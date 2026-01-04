// ==UserScript==
// @name         pixels-tree-not-cooking-2
// @namespace    https://play.pixels.xyz
// @version      0.3
// @description  pixels游戏自动化脚本
// @author       JackerYoung
// @include      http://*
// @include      https://*
// @grant        GM_addElement
// @run-at       document-start
// @grant        GM_setValue
// @grant        GM_getValue
// @downloadURL https://update.greasyfork.org/scripts/507484/pixels-tree-not-cooking-2.user.js
// @updateURL https://update.greasyfork.org/scripts/507484/pixels-tree-not-cooking-2.meta.js
// ==/UserScript==


(() => {
        const R = {};

        function Decoder(m, R) {
            if (this._offset = R, m instanceof ArrayBuffer) this._buffer = m, this._view = new DataView(this._buffer); else if (ArrayBuffer.isView(m)) this._buffer = m.buffer, this._view = new DataView(this._buffer, m.byteOffset, m.byteLength); else throw Error("Invalid argument")
        }

        Object.defineProperty(R, "__esModule", {
            value: !0
        }), R.decode = R.encode = void 0, Decoder.prototype._array = function (m) {
            for (var R = Array(m), C = 0; C < m; C++) R[C] = this._parse();
            return R
        }
            , Decoder.prototype._map = function (m) {
            for (var R = {}, C = 0; C < m; C++) R[this._parse()] = this._parse();
            return R
        }
            , Decoder.prototype._str = function (m) {
            var R = function (m, R, C) {
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
                        (L = (7 & B) << 18 | (63 & m.getUint8(++U)) << 12 | (63 & m.getUint8(++U)) << 6 | (63 & m.getUint8(++U)) << 0) >= 65536 ? (L -= 65536, T += String.fromCharCode((L >>> 10) + 55296, (1023 & L) + 56320)) : T += String.fromCharCode(L);
                        continue
                    }
                    throw Error("Invalid byte " + B.toString(16))
                }
                return T
            }(this._view, this._offset, m);
            return this._offset += m, R
        }
            , Decoder.prototype._bin = function (m) {
            var R = this._buffer.slice(this._offset, this._offset + m);
            return this._offset += m, R
        }
            , Decoder.prototype._parse = function () {
            var m, R = this._view.getUint8(this._offset++), C = 0, T = 0, L = 0, U = 0;
            if (R < 192) return R < 128 ? R : R < 144 ? this._map(15 & R) : R < 160 ? this._array(15 & R) : this._str(31 & R);
            if (R > 223) return -((255 - R + 1) * 1);
            switch (R) {
                case 192:
                    return null;
                case 194:
                    return !1;
                case 195:
                    return !0;
                case 196:
                    return C = this._view.getUint8(this._offset), this._offset += 1, this._bin(C);
                case 197:
                    return C = this._view.getUint16(this._offset), this._offset += 2, this._bin(C);
                case 198:
                    return C = this._view.getUint32(this._offset), this._offset += 4, this._bin(C);
                case 199:
                    if (C = this._view.getUint8(this._offset), T = this._view.getInt8(this._offset + 1), this._offset += 2, -1 === T) {
                        var $ = this._view.getUint32(this._offset);
                        return L = this._view.getInt32(this._offset + 4), U = this._view.getUint32(this._offset + 8), this._offset += 12, new Date((4294967296 * L + U) * 1e3 + $ / 1e6)
                    }
                    return [T, this._bin(C)];
                case 200:
                    return C = this._view.getUint16(this._offset), T = this._view.getInt8(this._offset + 2), this._offset += 3, [T, this._bin(C)];
                case 201:
                    return C = this._view.getUint32(this._offset), T = this._view.getInt8(this._offset + 4), this._offset += 5, [T, this._bin(C)];
                case 202:
                    return m = this._view.getFloat32(this._offset), this._offset += 4, m;
                case 203:
                    return m = this._view.getFloat64(this._offset), this._offset += 8, m;
                case 204:
                    return m = this._view.getUint8(this._offset), this._offset += 1, m;
                case 205:
                    return m = this._view.getUint16(this._offset), this._offset += 2, m;
                case 206:
                    return m = this._view.getUint32(this._offset), this._offset += 4, m;
                case 207:
                    return L = 4294967296 * this._view.getUint32(this._offset), U = this._view.getUint32(this._offset + 4), this._offset += 8, L + U;
                case 208:
                    return m = this._view.getInt8(this._offset), this._offset += 1, m;
                case 209:
                    return m = this._view.getInt16(this._offset), this._offset += 2, m;
                case 210:
                    return m = this._view.getInt32(this._offset), this._offset += 4, m;
                case 211:
                    return L = 4294967296 * this._view.getInt32(this._offset), U = this._view.getUint32(this._offset + 4), this._offset += 8, L + U;
                case 212:
                    if (T = this._view.getInt8(this._offset), this._offset += 1, 0 === T) {
                        this._offset += 1;
                        return
                    }
                    return [T, this._bin(1)];
                case 213:
                    return T = this._view.getInt8(this._offset), this._offset += 1, [T, this._bin(2)];
                case 214:
                    if (T = this._view.getInt8(this._offset), this._offset += 1, -1 === T) return m = this._view.getUint32(this._offset), this._offset += 4, new Date(1e3 * m);
                    return [T, this._bin(4)];
                case 215:
                    if (T = this._view.getInt8(this._offset), this._offset += 1, 0 === T) return L = 4294967296 * this._view.getInt32(this._offset), U = this._view.getUint32(this._offset + 4), this._offset += 8, new Date(L + U);
                    if (-1 === T) {
                        L = this._view.getUint32(this._offset), U = this._view.getUint32(this._offset + 4), this._offset += 8;
                        var B = (3 & L) * 4294967296 + U;
                        return new Date(1e3 * B + (L >>> 2) / 1e6)
                    }
                    return [T, this._bin(8)];
                case 216:
                    return T = this._view.getInt8(this._offset), this._offset += 1, [T, this._bin(16)];
                case 217:
                    return C = this._view.getUint8(this._offset), this._offset += 1, this._str(C);
                case 218:
                    return C = this._view.getUint16(this._offset), this._offset += 2, this._str(C);
                case 219:
                    return C = this._view.getUint32(this._offset), this._offset += 4, this._str(C);
                case 220:
                    return C = this._view.getUint16(this._offset), this._offset += 2, this._array(C);
                case 221:
                    return C = this._view.getUint32(this._offset), this._offset += 4, this._array(C);
                case 222:
                    return C = this._view.getUint16(this._offset), this._offset += 2, this._map(C);
                case 223:
                    return C = this._view.getUint32(this._offset), this._offset += 4, this._map(C)
            }
            throw Error("Could not parse")
        }
            , R.decode = function (m, R = 0) {
            var C = new Decoder(m, R), T = C._parse();
            if (C._offset !== m.byteLength) throw Error(m.byteLength - C._offset + " trailing bytes");
            return T
        }
            , R.encode = function (m) {
            var R = [], C = [], T = function _encode(m, R, C) {
                var T = typeof C, L = 0, U = 0, $ = 0, B = 0, V = 0, H = 0;
                if ("string" === T) {
                    if ((V = function (m) {
                        for (var R = 0, C = 0, T = 0, L = m.length; T < L; T++) (R = m.charCodeAt(T)) < 128 ? C += 1 : R < 2048 ? C += 2 : R < 55296 || R >= 57344 ? C += 3 : (T++, C += 4);
                        return C
                    }(C)) < 32) m.push(160 | V), H = 1; else if (V < 256) m.push(217, V), H = 2; else if (V < 65536) m.push(218, V >> 8, V), H = 3; else if (V < 4294967296) m.push(219, V >> 24, V >> 16, V >> 8, V), H = 5; else throw Error("String too long");
                    return R.push({
                        _str: C, _length: V, _offset: m.length
                    }), H + V
                }
                if ("number" === T) return Math.floor(C) === C && isFinite(C) ? C >= 0 ? C < 128 ? (m.push(C), 1) : C < 256 ? (m.push(204, C), 2) : C < 65536 ? (m.push(205, C >> 8, C), 3) : C < 4294967296 ? (m.push(206, C >> 24, C >> 16, C >> 8, C), 5) : ($ = C / 4294967296 >> 0, B = C >>> 0, m.push(207, $ >> 24, $ >> 16, $ >> 8, $, B >> 24, B >> 16, B >> 8, B), 9) : C >= -32 ? (m.push(C), 1) : C >= -128 ? (m.push(208, C), 2) : C >= -32768 ? (m.push(209, C >> 8, C), 3) : C >= -2147483648 ? (m.push(210, C >> 24, C >> 16, C >> 8, C), 5) : ($ = Math.floor(C / 4294967296), B = C >>> 0, m.push(211, $ >> 24, $ >> 16, $ >> 8, $, B >> 24, B >> 16, B >> 8, B), 9) : (m.push(203), R.push({
                    _float: C, _length: 8, _offset: m.length
                }), 9);
                if ("object" === T) {
                    if (null === C) return m.push(192), 1;
                    if (Array.isArray(C)) {
                        if ((V = C.length) < 16) m.push(144 | V), H = 1; else if (V < 65536) m.push(220, V >> 8, V), H = 3; else if (V < 4294967296) m.push(221, V >> 24, V >> 16, V >> 8, V), H = 5; else throw Error("Array too large");
                        for (L = 0; L < V; L++) H += _encode(m, R, C[L]);
                        return H
                    }
                    if (C instanceof Date) {
                        var G = C.getTime(), q = Math.floor(G / 1e3), W = (G - 1e3 * q) * 1e6;
                        return q >= 0 && W >= 0 && q <= 17179869183 ? 0 === W && q <= 4294967295 ? (m.push(214, 255, q >> 24, q >> 16, q >> 8, q), 6) : ($ = q / 4294967296, B = 4294967295 & q, m.push(215, 255, W >> 22, W >> 14, W >> 6, $, B >> 24, B >> 16, B >> 8, B), 10) : ($ = Math.floor(q / 4294967296), B = q >>> 0, m.push(199, 12, 255, W >> 24, W >> 16, W >> 8, W, $ >> 24, $ >> 16, $ >> 8, $, B >> 24, B >> 16, B >> 8, B), 15)
                    }
                    if (C instanceof ArrayBuffer) {
                        if ((V = C.byteLength) < 256) m.push(196, V), H = 2; else if (V < 65536) m.push(197, V >> 8, V), H = 3; else if (V < 4294967296) m.push(198, V >> 24, V >> 16, V >> 8, V), H = 5; else throw Error("Buffer too large");
                        return R.push({
                            _bin: C, _length: V, _offset: m.length
                        }), H + V
                    }
                    if ("function" == typeof C.toJSON) return _encode(m, R, C.toJSON());
                    var Z = [], Y = "", K = Object.keys(C);
                    for (L = 0, U = K.length; L < U; L++) void 0 !== C[Y = K[L]] && "function" != typeof C[Y] && Z.push(Y);
                    if ((V = Z.length) < 16) m.push(128 | V), H = 1; else if (V < 65536) m.push(222, V >> 8, V), H = 3; else if (V < 4294967296) m.push(223, V >> 24, V >> 16, V >> 8, V), H = 5; else throw Error("Object too large");
                    for (L = 0; L < V; L++) H += _encode(m, R, Y = Z[L]) + _encode(m, R, C[Y]);
                    return H
                }
                if ("boolean" === T) return m.push(C ? 195 : 194), 1;
                if ("undefined" === T) return m.push(192), 1;
                if ("function" == typeof C.toJSON) return _encode(m, R, C.toJSON());
                throw Error("Could not encode")
            }(R, C, m), L = new ArrayBuffer(T), U = new DataView(L), $ = 0, B = 0, V = -1;
            C.length > 0 && (V = C[0]._offset);
            for (var H, G = 0, q = 0, W = 0, Z = R.length; W < Z; W++) if (U.setUint8(B + W, R[W]), W + 1 === V) {
                if (G = (H = C[$])._length, q = B + V, H._bin) for (var Y = new Uint8Array(H._bin), K = 0; K < G; K++) U.setUint8(q + K, Y[K]); else H._str ? function (m, R, C) {
                    for (var T = 0, L = 0, U = C.length; L < U; L++) (T = C.charCodeAt(L)) < 128 ? m.setUint8(R++, T) : (T < 2048 ? m.setUint8(R++, 192 | T >> 6) : (T < 55296 || T >= 57344 ? m.setUint8(R++, 224 | T >> 12) : (L++, T = 65536 + ((1023 & T) << 10 | 1023 & C.charCodeAt(L)), m.setUint8(R++, 240 | T >> 18), m.setUint8(R++, 128 | T >> 12 & 63)), m.setUint8(R++, 128 | T >> 6 & 63)), m.setUint8(R++, 128 | 63 & T))
                }(U, q, H._str) : void 0 !== H._float && U.setFloat64(q, H._float);
                $++, B += G, C[$] && (V = C[$]._offset)
            }
            return L
        }

        const $ = {
            decode: function (m, R = 0) {
                var C = new Decoder(m, R), T = C._parse();
                if (C._offset !== m.byteLength) throw Error(m.byteLength - C._offset + " trailing bytes");
                return T
            }, encode: function (m) {
                var R = [], C = [], T = function _encode(m, R, C) {
                    var T = typeof C, L = 0, U = 0, $ = 0, B = 0, V = 0, H = 0;
                    if ("string" === T) {
                        if ((V = function (m) {
                            for (var R = 0, C = 0, T = 0, L = m.length; T < L; T++) (R = m.charCodeAt(T)) < 128 ? C += 1 : R < 2048 ? C += 2 : R < 55296 || R >= 57344 ? C += 3 : (T++, C += 4);
                            return C
                        }(C)) < 32) m.push(160 | V), H = 1; else if (V < 256) m.push(217, V), H = 2; else if (V < 65536) m.push(218, V >> 8, V), H = 3; else if (V < 4294967296) m.push(219, V >> 24, V >> 16, V >> 8, V), H = 5; else throw Error("String too long");
                        return R.push({
                            _str: C, _length: V, _offset: m.length
                        }), H + V
                    }
                    if ("number" === T) return Math.floor(C) === C && isFinite(C) ? C >= 0 ? C < 128 ? (m.push(C), 1) : C < 256 ? (m.push(204, C), 2) : C < 65536 ? (m.push(205, C >> 8, C), 3) : C < 4294967296 ? (m.push(206, C >> 24, C >> 16, C >> 8, C), 5) : ($ = C / 4294967296 >> 0, B = C >>> 0, m.push(207, $ >> 24, $ >> 16, $ >> 8, $, B >> 24, B >> 16, B >> 8, B), 9) : C >= -32 ? (m.push(C), 1) : C >= -128 ? (m.push(208, C), 2) : C >= -32768 ? (m.push(209, C >> 8, C), 3) : C >= -2147483648 ? (m.push(210, C >> 24, C >> 16, C >> 8, C), 5) : ($ = Math.floor(C / 4294967296), B = C >>> 0, m.push(211, $ >> 24, $ >> 16, $ >> 8, $, B >> 24, B >> 16, B >> 8, B), 9) : (m.push(203), R.push({
                        _float: C, _length: 8, _offset: m.length
                    }), 9);
                    if ("object" === T) {
                        if (null === C) return m.push(192), 1;
                        if (Array.isArray(C)) {
                            if ((V = C.length) < 16) m.push(144 | V), H = 1; else if (V < 65536) m.push(220, V >> 8, V), H = 3; else if (V < 4294967296) m.push(221, V >> 24, V >> 16, V >> 8, V), H = 5; else throw Error("Array too large");
                            for (L = 0; L < V; L++) H += _encode(m, R, C[L]);
                            return H
                        }
                        if (C instanceof Date) {
                            var G = C.getTime(), q = Math.floor(G / 1e3), W = (G - 1e3 * q) * 1e6;
                            return q >= 0 && W >= 0 && q <= 17179869183 ? 0 === W && q <= 4294967295 ? (m.push(214, 255, q >> 24, q >> 16, q >> 8, q), 6) : ($ = q / 4294967296, B = 4294967295 & q, m.push(215, 255, W >> 22, W >> 14, W >> 6, $, B >> 24, B >> 16, B >> 8, B), 10) : ($ = Math.floor(q / 4294967296), B = q >>> 0, m.push(199, 12, 255, W >> 24, W >> 16, W >> 8, W, $ >> 24, $ >> 16, $ >> 8, $, B >> 24, B >> 16, B >> 8, B), 15)
                        }
                        if (C instanceof ArrayBuffer) {
                            if ((V = C.byteLength) < 256) m.push(196, V), H = 2; else if (V < 65536) m.push(197, V >> 8, V), H = 3; else if (V < 4294967296) m.push(198, V >> 24, V >> 16, V >> 8, V), H = 5; else throw Error("Buffer too large");
                            return R.push({
                                _bin: C, _length: V, _offset: m.length
                            }), H + V
                        }
                        if ("function" == typeof C.toJSON) return _encode(m, R, C.toJSON());
                        var Z = [], Y = "", K = Object.keys(C);
                        for (L = 0, U = K.length; L < U; L++) void 0 !== C[Y = K[L]] && "function" != typeof C[Y] && Z.push(Y);
                        if ((V = Z.length) < 16) m.push(128 | V), H = 1; else if (V < 65536) m.push(222, V >> 8, V), H = 3; else if (V < 4294967296) m.push(223, V >> 24, V >> 16, V >> 8, V), H = 5; else throw Error("Object too large");
                        for (L = 0; L < V; L++) H += _encode(m, R, Y = Z[L]) + _encode(m, R, C[Y]);
                        return H
                    }
                    if ("boolean" === T) return m.push(C ? 195 : 194), 1;
                    if ("undefined" === T) return m.push(192), 1;
                    if ("function" == typeof C.toJSON) return _encode(m, R, C.toJSON());
                    throw Error("Could not encode")
                }(R, C, m), L = new ArrayBuffer(T), U = new DataView(L), $ = 0, B = 0, V = -1;
                C.length > 0 && (V = C[0]._offset);
                for (var H, G = 0, q = 0, W = 0, Z = R.length; W < Z; W++) if (U.setUint8(B + W, R[W]), W + 1 === V) {
                    if (G = (H = C[$])._length, q = B + V, H._bin) for (var Y = new Uint8Array(H._bin), K = 0; K < G; K++) U.setUint8(q + K, Y[K]); else H._str ? function (m, R, C) {
                        for (var T = 0, L = 0, U = C.length; L < U; L++) (T = C.charCodeAt(L)) < 128 ? m.setUint8(R++, T) : (T < 2048 ? m.setUint8(R++, 192 | T >> 6) : (T < 55296 || T >= 57344 ? m.setUint8(R++, 224 | T >> 12) : (L++, T = 65536 + ((1023 & T) << 10 | 1023 & C.charCodeAt(L)), m.setUint8(R++, 240 | T >> 18), m.setUint8(R++, 128 | T >> 12 & 63)), m.setUint8(R++, 128 | T >> 6 & 63)), m.setUint8(R++, 128 | 63 & T))
                    }(U, q, H._str) : void 0 !== H._float && U.setFloat64(q, H._float);
                    $++, B += G, C[$] && (V = C[$]._offset)
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
            }, ErrorCode: {
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
            }, utf8Read: function (m, R) {
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
                        T += String.fromCharCode(((15 & B) << 12) | ((63 & m[++U]) << 6) | ((63 & m[++U]) << 0));
                        continue;
                    }
                    if ((248 & B) == 240) {
                        (L = ((7 & B) << 18) | ((63 & m[++U]) << 12) | ((63 & m[++U]) << 6) | ((63 & m[++U]) << 0)) >= 65536 ? ((L -= 65536), (T += String.fromCharCode((L >>> 10) + 55296, (1023 & L) + 56320))) : (T += String.fromCharCode(L));
                        continue;
                    }
                    throw Error("Invalid byte " + B.toString(16));
                }
                return T;
            }, utf8Length: function (m = "") {
                let R = 0, C = 0;
                for (let T = 0, L = m.length; T < L; T++) (R = m.charCodeAt(T)) < 128 ? (C += 1) : R < 2048 ? (C += 2) : R < 55296 || R >= 57344 ? (C += 3) : (T++, (C += 4));
                return C + 1;
            },
        };
        let _globalReflection = {};
        !function (m) {
            "use strict";

            var R, extendStatics = function (m, R) {
                return (extendStatics = Object.setPrototypeOf || ({
                    __proto__: []
                }) instanceof Array && function (m, R) {
                    m.__proto__ = R
                } || function (m, R) {
                    for (var C in R) Object.prototype.hasOwnProperty.call(R, C) && (m[C] = R[C])
                })(m, R)
            };

            function __extends(m, R) {
                if ("function" != typeof R && null !== R) throw TypeError("Class extends value " + String(R) + " is not a constructor or null");

                function __() {
                    this.constructor = m
                }

                extendStatics(m, R), m.prototype = null === R ? Object.create(R) : (__.prototype = R.prototype, new __)
            }

            function __decorate(m, R, C, T) {
                var L, U = arguments.length, $ = U < 3 ? R : null === T ? T = Object.getOwnPropertyDescriptor(R, C) : T;
                if ("object" == typeof Reflect && "function" == typeof Reflect.decorate) $ = Reflect.decorate(m, R, C, T); else for (var B = m.length - 1; B >= 0; B--) (L = m[B]) && ($ = (U < 3 ? L($) : U > 3 ? L(R, C, $) : L(R, C)) || $);
                return U > 3 && $ && Object.defineProperty(R, C, $), $
            }

            function __spreadArray(m, R, C) {
                if (C || 2 == arguments.length) for (var T, L = 0, U = R.length; L < U; L++) !T && L in R || (T || (T = Array.prototype.slice.call(R, 0, L)), T[L] = R[L]);
                return m.concat(T || Array.prototype.slice.call(R))
            }

            m.OPERATION = void 0, (R = m.OPERATION || (m.OPERATION = {}))[R.ADD = 128] = "ADD", R[R.REPLACE = 0] = "REPLACE", R[R.DELETE = 64] = "DELETE", R[R.DELETE_AND_ADD = 192] = "DELETE_AND_ADD", R[R.TOUCH = 1] = "TOUCH", R[R.CLEAR = 10] = "CLEAR";
            var C = function () {
                function ChangeTree(m, R, C) {
                    this.changed = !1, this.changes = new Map, this.allChanges = new Set, this.caches = {}, this.currentCustomOperation = 0, this.ref = m, this.setParent(R, C)
                }

                return ChangeTree.prototype.setParent = function (m, R, C) {
                    var T = this;
                    if (this.indexes || (this.indexes = this.ref instanceof en ? this.ref._definition.indexes : {}), this.parent = m, this.parentIndex = C, R) {
                        if (this.root = R, this.ref instanceof en) {
                            var L = this.ref._definition;
                            for (var U in L.schema) {
                                var $ = this.ref[U];
                                if ($ && $.$changes) {
                                    var B = L.indexes[U];
                                    $.$changes.setParent(this.ref, R, B)
                                }
                            }
                        } else "object" == typeof this.ref && this.ref.forEach(function (m, R) {
                            if (m instanceof en) {
                                var C = m.$changes, L = T.ref.$changes.indexes[R];
                                C.setParent(T.ref, T.root, L)
                            }
                        })
                    }
                }
                    , ChangeTree.prototype.operation = function (m) {
                    this.changes.set(--this.currentCustomOperation, m)
                }
                    , ChangeTree.prototype.change = function (R, C) {
                    void 0 === C && (C = m.OPERATION.ADD);
                    var T = "number" == typeof R ? R : this.indexes[R];
                    this.assertValidIndex(T, R);
                    var L = this.changes.get(T);
                    L && L.op !== m.OPERATION.DELETE && L.op !== m.OPERATION.TOUCH || this.changes.set(T, {
                        op: L && L.op === m.OPERATION.DELETE ? m.OPERATION.DELETE_AND_ADD : C, index: T
                    }), this.allChanges.add(T), this.changed = !0, this.touchParents()
                }
                    , ChangeTree.prototype.touch = function (R) {
                    var C = "number" == typeof R ? R : this.indexes[R];
                    this.assertValidIndex(C, R), this.changes.has(C) || this.changes.set(C, {
                        op: m.OPERATION.TOUCH, index: C
                    }), this.allChanges.add(C), this.touchParents()
                }
                    , ChangeTree.prototype.touchParents = function () {
                    this.parent && this.parent.$changes.touch(this.parentIndex)
                }
                    , ChangeTree.prototype.getType = function (m) {
                    if (this.ref._definition) {
                        var R = this.ref._definition;
                        return R.schema[R.fieldsByIndex[m]]
                    }
                    var R = this.parent._definition;
                    return Object.values(R.schema[R.fieldsByIndex[this.parentIndex]])[0]
                }
                    , ChangeTree.prototype.getChildrenFilter = function () {
                    var m = this.parent._definition.childFilters;
                    return m && m[this.parentIndex]
                }
                    , ChangeTree.prototype.getValue = function (m) {
                    return this.ref.getByIndex(m)
                }
                    , ChangeTree.prototype.delete = function (R) {
                    var C = "number" == typeof R ? R : this.indexes[R];
                    if (void 0 === C) {
                        console.warn("@colyseus/schema ".concat(this.ref.constructor.name, ": trying to delete non-existing index: ").concat(R, " (").concat(C, ")"));
                        return
                    }
                    var T = this.getValue(C);
                    this.changes.set(C, {
                        op: m.OPERATION.DELETE, index: C
                    }), this.allChanges.delete(C), delete this.caches[C], T && T.$changes && (T.$changes.parent = void 0), this.changed = !0, this.touchParents()
                }
                    , ChangeTree.prototype.discard = function (R, C) {
                    var T = this;
                    void 0 === R && (R = !1), void 0 === C && (C = !1), this.ref instanceof en || this.changes.forEach(function (R) {
                        if (R.op === m.OPERATION.DELETE) {
                            var C = T.ref.getIndex(R.index);
                            delete T.indexes[C]
                        }
                    }), this.changes.clear(), this.changed = R, C && this.allChanges.clear(), this.currentCustomOperation = 0
                }
                    , ChangeTree.prototype.discardAll = function () {
                    var m = this;
                    this.changes.forEach(function (R) {
                        var C = m.getValue(R.index);
                        C && C.$changes && C.$changes.discardAll()
                    }), this.discard()
                }
                    , ChangeTree.prototype.cache = function (m, R) {
                    this.caches[m] = R
                }
                    , ChangeTree.prototype.clone = function () {
                    return new ChangeTree(this.ref, this.parent, this.root)
                }
                    , ChangeTree.prototype.ensureRefId = function () {
                    void 0 === this.refId && (this.refId = this.root.getNextUniqueId())
                }
                    , ChangeTree.prototype.assertValidIndex = function (m, R) {
                    if (void 0 === m) throw Error('ChangeTree: missing index for field "'.concat(R, '"'))
                }
                    , ChangeTree
            }();

            function addCallback(m, R, C, T) {
                return m[R] || (m[R] = []), m[R].push(C), null == T || T.forEach(function (m, R) {
                    return C(m, R)
                }), function () {
                    return spliceOne(m[R], m[R].indexOf(C))
                }
            }

            function removeChildRefs(R) {
                var C = this, T = "string" != typeof this.$changes.getType();
                this.$items.forEach(function (L, U) {
                    R.push({
                        refId: C.$changes.refId, op: m.OPERATION.DELETE, field: U, value: void 0, previousValue: L
                    }), T && C.$changes.root.removeRef(L.$changes.refId)
                })
            }

            function spliceOne(m, R) {
                if (-1 === R || R >= m.length) return !1;
                for (var C = m.length - 1, T = R; T < C; T++) m[T] = m[T + 1];
                return m.length = C, !0
            }

            var DEFAULT_SORT = function (m, R) {
                var C = m.toString(), T = R.toString();
                return C < T ? -1 : C > T ? 1 : 0
            }, T = function () {
                function ArraySchema() {
                    for (var m = [], R = 0; R < arguments.length; R++) m[R] = arguments[R];
                    this.$changes = new C(this), this.$items = new Map, this.$indexes = new Map, this.$refId = 0, this.push.apply(this, m)
                }

                return ArraySchema.prototype.onAdd = function (R, C) {
                    return void 0 === C && (C = !0), addCallback(this.$callbacks || (this.$callbacks = []), m.OPERATION.ADD, R, C ? this.$items : void 0)
                }
                    , ArraySchema.prototype.onRemove = function (R) {
                    return addCallback(this.$callbacks || (this.$callbacks = []), m.OPERATION.DELETE, R)
                }
                    , ArraySchema.prototype.onChange = function (R) {
                    return addCallback(this.$callbacks || (this.$callbacks = []), m.OPERATION.REPLACE, R)
                }
                    , ArraySchema.is = function (m) {
                    return Array.isArray(m) || void 0 !== m.array
                }
                    , Object.defineProperty(ArraySchema.prototype, "length", {
                    get: function () {
                        return this.$items.size
                    }, set: function (m) {
                        0 === m ? this.clear() : this.splice(m, this.length - m)
                    }, enumerable: !1, configurable: !0
                }), ArraySchema.prototype.push = function () {
                    for (var m, R = this, C = [], T = 0; T < arguments.length; T++) C[T] = arguments[T];
                    return C.forEach(function (C) {
                        m = R.$refId++, R.setAt(m, C)
                    }), m
                }
                    , ArraySchema.prototype.pop = function () {
                    var m = Array.from(this.$indexes.values()).pop();
                    if (void 0 !== m) {
                        this.$changes.delete(m), this.$indexes.delete(m);
                        var R = this.$items.get(m);
                        return this.$items.delete(m), R
                    }
                }
                    , ArraySchema.prototype.at = function (m) {
                    var R = Array.from(this.$items.keys())[m];
                    return this.$items.get(R)
                }
                    , ArraySchema.prototype.setAt = function (R, C) {
                    void 0 !== C.$changes && C.$changes.setParent(this, this.$changes.root, R);
                    var T, L,
                        U = null !== (L = null === (T = this.$changes.indexes[R]) || void 0 === T ? void 0 : T.op) && void 0 !== L ? L : m.OPERATION.ADD;
                    this.$changes.indexes[R] = R, this.$indexes.set(R, R), this.$items.set(R, C), this.$changes.change(R, U)
                }
                    , ArraySchema.prototype.deleteAt = function (m) {
                    var R = Array.from(this.$items.keys())[m];
                    return void 0 !== R && this.$deleteAt(R)
                }
                    , ArraySchema.prototype.$deleteAt = function (m) {
                    return this.$changes.delete(m), this.$indexes.delete(m), this.$items.delete(m)
                }
                    , ArraySchema.prototype.clear = function (R) {
                    this.$changes.discard(!0, !0), this.$changes.indexes = {}, this.$indexes.clear(), R && removeChildRefs.call(this, R), this.$items.clear(), this.$changes.operation({
                        index: 0, op: m.OPERATION.CLEAR
                    }), this.$changes.touchParents()
                }
                    , ArraySchema.prototype.concat = function () {
                    for (var m, R = [], C = 0; C < arguments.length; C++) R[C] = arguments[C];
                    return new (ArraySchema.bind.apply(ArraySchema, __spreadArray([void 0], (m = Array.from(this.$items.values())).concat.apply(m, R), !1)))
                }
                    , ArraySchema.prototype.join = function (m) {
                    return Array.from(this.$items.values()).join(m)
                }
                    , ArraySchema.prototype.reverse = function () {
                    var m = this, R = Array.from(this.$items.keys());
                    return Array.from(this.$items.values()).reverse().forEach(function (C, T) {
                        m.setAt(R[T], C)
                    }), this
                }
                    , ArraySchema.prototype.shift = function () {
                    var m = Array.from(this.$items.keys()).shift();
                    if (void 0 !== m) {
                        var R = this.$items.get(m);
                        return this.$deleteAt(m), R
                    }
                }
                    , ArraySchema.prototype.slice = function (m, R) {
                    var C = new ArraySchema;
                    return C.push.apply(C, Array.from(this.$items.values()).slice(m, R)), C
                }
                    , ArraySchema.prototype.sort = function (m) {
                    var R = this;
                    void 0 === m && (m = DEFAULT_SORT);
                    var C = Array.from(this.$items.keys());
                    return Array.from(this.$items.values()).sort(m).forEach(function (m, T) {
                        R.setAt(C[T], m)
                    }), this
                }
                    , ArraySchema.prototype.splice = function (m, R) {
                    void 0 === R && (R = this.length - m);
                    for (var C = Array.from(this.$items.keys()), T = [], L = m; L < m + R; L++) T.push(this.$items.get(C[L])), this.$deleteAt(C[L]);
                    return T
                }
                    , ArraySchema.prototype.unshift = function () {
                    for (var m = this, R = [], C = 0; C < arguments.length; C++) R[C] = arguments[C];
                    var T = this.length, L = R.length, U = Array.from(this.$items.values());
                    return R.forEach(function (R, C) {
                        m.setAt(C, R)
                    }), U.forEach(function (R, C) {
                        m.setAt(L + C, R)
                    }), T + L
                }
                    , ArraySchema.prototype.indexOf = function (m, R) {
                    return Array.from(this.$items.values()).indexOf(m, R)
                }
                    , ArraySchema.prototype.lastIndexOf = function (m, R) {
                    return void 0 === R && (R = this.length - 1), Array.from(this.$items.values()).lastIndexOf(m, R)
                }
                    , ArraySchema.prototype.every = function (m, R) {
                    return Array.from(this.$items.values()).every(m, R)
                }
                    , ArraySchema.prototype.some = function (m, R) {
                    return Array.from(this.$items.values()).some(m, R)
                }
                    , ArraySchema.prototype.forEach = function (m, R) {
                    Array.from(this.$items.values()).forEach(m, R)
                }
                    , ArraySchema.prototype.map = function (m, R) {
                    return Array.from(this.$items.values()).map(m, R)
                }
                    , ArraySchema.prototype.filter = function (m, R) {
                    return Array.from(this.$items.values()).filter(m, R)
                }
                    , ArraySchema.prototype.reduce = function (m, R) {
                    return Array.prototype.reduce.apply(Array.from(this.$items.values()), arguments)
                }
                    , ArraySchema.prototype.reduceRight = function (m, R) {
                    return Array.prototype.reduceRight.apply(Array.from(this.$items.values()), arguments)
                }
                    , ArraySchema.prototype.find = function (m, R) {
                    return Array.from(this.$items.values()).find(m, R)
                }
                    , ArraySchema.prototype.findIndex = function (m, R) {
                    return Array.from(this.$items.values()).findIndex(m, R)
                }
                    , ArraySchema.prototype.fill = function (m, R, C) {
                    throw Error("ArraySchema#fill() not implemented")
                }
                    , ArraySchema.prototype.copyWithin = function (m, R, C) {
                    throw Error("ArraySchema#copyWithin() not implemented")
                }
                    , ArraySchema.prototype.toString = function () {
                    return this.$items.toString()
                }
                    , ArraySchema.prototype.toLocaleString = function () {
                    return this.$items.toLocaleString()
                }
                    , ArraySchema.prototype[Symbol.iterator] = function () {
                    return Array.from(this.$items.values())[Symbol.iterator]()
                }
                    , ArraySchema.prototype.entries = function () {
                    return this.$items.entries()
                }
                    , ArraySchema.prototype.keys = function () {
                    return this.$items.keys()
                }
                    , ArraySchema.prototype.values = function () {
                    return this.$items.values()
                }
                    , ArraySchema.prototype.includes = function (m, R) {
                    return Array.from(this.$items.values()).includes(m, R)
                }
                    , ArraySchema.prototype.flatMap = function (m, R) {
                    throw Error("ArraySchema#flatMap() is not supported.")
                }
                    , ArraySchema.prototype.flat = function (m) {
                    throw Error("ArraySchema#flat() is not supported.")
                }
                    , ArraySchema.prototype.findLast = function () {
                    var m = Array.from(this.$items.values());
                    return m.findLast.apply(m, arguments)
                }
                    , ArraySchema.prototype.findLastIndex = function () {
                    var m = Array.from(this.$items.values());
                    return m.findLastIndex.apply(m, arguments)
                }
                    , ArraySchema.prototype.setIndex = function (m, R) {
                    this.$indexes.set(m, R)
                }
                    , ArraySchema.prototype.getIndex = function (m) {
                    return this.$indexes.get(m)
                }
                    , ArraySchema.prototype.getByIndex = function (m) {
                    return this.$items.get(this.$indexes.get(m))
                }
                    , ArraySchema.prototype.deleteByIndex = function (m) {
                    var R = this.$indexes.get(m);
                    this.$items.delete(R), this.$indexes.delete(m)
                }
                    , ArraySchema.prototype.toArray = function () {
                    return Array.from(this.$items.values())
                }
                    , ArraySchema.prototype.toJSON = function () {
                    return this.toArray().map(function (m) {
                        return "function" == typeof m.toJSON ? m.toJSON() : m
                    })
                }
                    , ArraySchema.prototype.clone = function (m) {
                    return m ? new (ArraySchema.bind.apply(ArraySchema, __spreadArray([void 0], Array.from(this.$items.values()), !1))) : new (ArraySchema.bind.apply(ArraySchema, __spreadArray([void 0], this.map(function (m) {
                        return m.$changes ? m.clone() : m
                    }), !1)))
                }
                    , ArraySchema
            }(), L = function () {
                function MapSchema(m) {
                    var R = this;
                    if (this.$changes = new C(this), this.$items = new Map, this.$indexes = new Map, this.$refId = 0, m) {
                        if (m instanceof Map || m instanceof MapSchema) m.forEach(function (m, C) {
                            return R.set(C, m)
                        }); else for (var T in m) this.set(T, m[T])
                    }
                }

                return MapSchema.prototype.onAdd = function (R, C) {
                    return void 0 === C && (C = !0), addCallback(this.$callbacks || (this.$callbacks = []), m.OPERATION.ADD, R, C ? this.$items : void 0)
                }
                    , MapSchema.prototype.onRemove = function (R) {
                    return addCallback(this.$callbacks || (this.$callbacks = []), m.OPERATION.DELETE, R)
                }
                    , MapSchema.prototype.onChange = function (R) {
                    return addCallback(this.$callbacks || (this.$callbacks = []), m.OPERATION.REPLACE, R)
                }
                    , MapSchema.is = function (m) {
                    return void 0 !== m.map
                }
                    , MapSchema.prototype[Symbol.iterator] = function () {
                    return this.$items[Symbol.iterator]()
                }
                    , Object.defineProperty(MapSchema.prototype, Symbol.toStringTag, {
                    get: function () {
                        return this.$items[Symbol.toStringTag]
                    }, enumerable: !1, configurable: !0
                }), MapSchema.prototype.set = function (R, C) {
                    if (null == C) throw Error("MapSchema#set('".concat(R, "', ").concat(C, "): trying to set ").concat(C, " value on '").concat(R, "'."));
                    var T = void 0 !== this.$changes.indexes[R], L = T ? this.$changes.indexes[R] : this.$refId++,
                        U = T ? m.OPERATION.REPLACE : m.OPERATION.ADD, $ = void 0 !== C.$changes;
                    return $ && C.$changes.setParent(this, this.$changes.root, L), T ? $ && this.$items.get(R) !== C && (U = m.OPERATION.ADD) : (this.$changes.indexes[R] = L, this.$indexes.set(L, R)), this.$items.set(R, C), this.$changes.change(R, U), this
                }
                    , MapSchema.prototype.get = function (m) {
                    return this.$items.get(m)
                }
                    , MapSchema.prototype.delete = function (m) {
                    return this.$changes.delete(m), this.$items.delete(m)
                }
                    , MapSchema.prototype.clear = function (R) {
                    this.$changes.discard(!0, !0), this.$changes.indexes = {}, this.$indexes.clear(), R && removeChildRefs.call(this, R), this.$items.clear(), this.$changes.operation({
                        index: 0, op: m.OPERATION.CLEAR
                    }), this.$changes.touchParents()
                }
                    , MapSchema.prototype.has = function (m) {
                    return this.$items.has(m)
                }
                    , MapSchema.prototype.forEach = function (m) {
                    this.$items.forEach(m)
                }
                    , MapSchema.prototype.entries = function () {
                    return this.$items.entries()
                }
                    , MapSchema.prototype.keys = function () {
                    return this.$items.keys()
                }
                    , MapSchema.prototype.values = function () {
                    return this.$items.values()
                }
                    , Object.defineProperty(MapSchema.prototype, "size", {
                    get: function () {
                        return this.$items.size
                    }, enumerable: !1, configurable: !0
                }), MapSchema.prototype.setIndex = function (m, R) {
                    this.$indexes.set(m, R)
                }
                    , MapSchema.prototype.getIndex = function (m) {
                    return this.$indexes.get(m)
                }
                    , MapSchema.prototype.getByIndex = function (m) {
                    return this.$items.get(this.$indexes.get(m))
                }
                    , MapSchema.prototype.deleteByIndex = function (m) {
                    var R = this.$indexes.get(m);
                    this.$items.delete(R), this.$indexes.delete(m)
                }
                    , MapSchema.prototype.toJSON = function () {
                    var m = {};
                    return this.forEach(function (R, C) {
                        m[C] = "function" == typeof R.toJSON ? R.toJSON() : R
                    }), m
                }
                    , MapSchema.prototype.clone = function (m) {
                    var R;
                    return m ? R = Object.assign(new MapSchema, this) : (R = new MapSchema, this.forEach(function (m, C) {
                        m.$changes ? R.set(C, m.clone()) : R.set(C, m)
                    })), R
                }
                    , MapSchema
            }(), U = {}, $ = function () {
                function SchemaDefinition() {
                    this.indexes = {}, this.fieldsByIndex = {}, this.deprecated = {}, this.descriptors = {}
                }

                return SchemaDefinition.create = function (m) {
                    var R = new SchemaDefinition;
                    return R.schema = Object.assign({}, m && m.schema || {}), R.indexes = Object.assign({}, m && m.indexes || {}), R.fieldsByIndex = Object.assign({}, m && m.fieldsByIndex || {}), R.descriptors = Object.assign({}, m && m.descriptors || {}), R.deprecated = Object.assign({}, m && m.deprecated || {}), R
                }
                    , SchemaDefinition.prototype.addField = function (m, R) {
                    var C = this.getNextFieldIndex();
                    this.fieldsByIndex[C] = m, this.indexes[m] = C, this.schema[m] = Array.isArray(R) ? {
                        array: R[0]
                    } : R
                }
                    , SchemaDefinition.prototype.hasField = function (m) {
                    return void 0 !== this.indexes[m]
                }
                    , SchemaDefinition.prototype.addFilter = function (m, R) {
                    return this.filters || (this.filters = {}, this.indexesWithFilters = []), this.filters[this.indexes[m]] = R, this.indexesWithFilters.push(this.indexes[m]), !0
                }
                    , SchemaDefinition.prototype.addChildrenFilter = function (m, R) {
                    var C = this.indexes[m];
                    if (U[Object.keys(this.schema[m])[0]]) return this.childFilters || (this.childFilters = {}), this.childFilters[C] = R, !0;
                    console.warn("@filterChildren: field '".concat(m, "' can't have children. Ignoring filter."))
                }
                    , SchemaDefinition.prototype.getChildrenFilter = function (m) {
                    return this.childFilters && this.childFilters[this.indexes[m]]
                }
                    , SchemaDefinition.prototype.getNextFieldIndex = function () {
                    return Object.keys(this.schema || {}).length
                }
                    , SchemaDefinition
            }(), B = function () {
                function Context() {
                    this.types = {}, this.schemas = new Map, this.useFilters = !1
                }

                return Context.prototype.has = function (m) {
                    return this.schemas.has(m)
                }
                    , Context.prototype.get = function (m) {
                    return this.types[m]
                }
                    , Context.prototype.add = function (m, R) {
                    void 0 === R && (R = this.schemas.size), m._definition = $.create(m._definition), m._typeid = R, this.types[R] = m, this.schemas.set(m, R)
                }
                    , Context.create = function (m) {
                    return void 0 === m && (m = {}), function (R) {
                        return m.context || (m.context = new Context), type(R, m)
                    }
                }
                    , Context
            }(), V = new B;

            function type(m, R) {
                return void 0 === R && (R = {}), function (C, U) {
                    var $ = R.context || V, B = C.constructor;
                    if (B._context = $, !m) throw Error("".concat(B.name, ': @type() reference provided for "').concat(U, "\" is undefined. Make sure you don't have any circular dependencies."));
                    $.has(B) || $.add(B);
                    var H = B._definition;
                    if (H.addField(U, m), H.descriptors[U]) {
                        if (H.deprecated[U]) return;
                        try {
                            throw Error("@colyseus/schema: Duplicate '".concat(U, "' definition on '").concat(B.name, "'.\nCheck @type() annotation"))
                        } catch (m) {
                            var G = m.stack.split("\n")[4].trim();
                            throw Error("".concat(m.message, " ").concat(G))
                        }
                    }
                    var q = T.is(m), W = !q && L.is(m);
                    if ("string" != typeof m && !en.is(m)) {
                        var Z = Object.values(m)[0];
                        "string" == typeof Z || $.has(Z) || $.add(Z)
                    }
                    if (R.manual) {
                        H.descriptors[U] = {
                            enumerable: !0, configurable: !0, writable: !0
                        };
                        return
                    }
                    var Y = "_".concat(U);
                    H.descriptors[Y] = {
                        enumerable: !1, configurable: !1, writable: !0
                    }, H.descriptors[U] = {
                        get: function () {
                            return this[Y]
                        }, set: function (m) {
                            if (m !== this[Y]) {
                                if (null != m) {
                                    if (!q || m instanceof T || (m = new (T.bind.apply(T, __spreadArray([void 0], m, !1)))), !W || m instanceof L || (m = new L(m)), void 0 === m.$proxy) {
                                        var R, C;
                                        W ? ((R = m).$proxy = !0, m = R = new Proxy(R, {
                                            get: function (m, R) {
                                                return "symbol" != typeof R && void 0 === m[R] ? m.get(R) : m[R]
                                            }, set: function (m, R, C) {
                                                return "symbol" != typeof R && -1 === R.indexOf("$") && "onAdd" !== R && "onRemove" !== R && "onChange" !== R ? m.set(R, C) : m[R] = C, !0
                                            }, deleteProperty: function (m, R) {
                                                return m.delete(R), !0
                                            }
                                        })) : q && ((C = m).$proxy = !0, m = C = new Proxy(C, {
                                            get: function (m, R) {
                                                return "symbol" == typeof R || isNaN(R) ? m[R] : m.at(R)
                                            }, set: function (m, R, C) {
                                                if ("symbol" == typeof R || isNaN(R)) m[R] = C; else {
                                                    var T = parseInt(Array.from(m.$items.keys())[R] || R);
                                                    null == C ? m.deleteAt(T) : m.setAt(T, C)
                                                }
                                                return !0
                                            }, deleteProperty: function (m, R) {
                                                return "number" == typeof R ? m.deleteAt(R) : delete m[R], !0
                                            }
                                        }))
                                    }
                                    this.$changes.change(U), m.$changes && m.$changes.setParent(this, this.$changes.root, this._definition.indexes[U])
                                } else this[Y] && this.$changes.delete(U);
                                this[Y] = m
                            }
                        }, enumerable: !0, configurable: !0
                    }
                }
            }

            function utf8Write(m, R, C) {
                for (var T = 0, L = 0, U = C.length; L < U; L++) (T = C.charCodeAt(L)) < 128 ? m[R++] = T : (T < 2048 ? m[R++] = 192 | T >> 6 : (T < 55296 || T >= 57344 ? m[R++] = 224 | T >> 12 : (L++, T = 65536 + ((1023 & T) << 10 | 1023 & C.charCodeAt(L)), m[R++] = 240 | T >> 18, m[R++] = 128 | T >> 12 & 63), m[R++] = 128 | T >> 6 & 63), m[R++] = 128 | 63 & T)
            }

            function int8$1(m, R) {
                m.push(255 & R)
            }

            function uint8$1(m, R) {
                m.push(255 & R)
            }

            function int16$1(m, R) {
                m.push(255 & R), m.push(R >> 8 & 255)
            }

            function uint16$1(m, R) {
                m.push(255 & R), m.push(R >> 8 & 255)
            }

            function int32$1(m, R) {
                m.push(255 & R), m.push(R >> 8 & 255), m.push(R >> 16 & 255), m.push(R >> 24 & 255)
            }

            function uint32$1(m, R) {
                var C = R >> 24, T = R >> 16, L = R >> 8;
                m.push(255 & R), m.push(255 & L), m.push(255 & T), m.push(255 & C)
            }

            function int64$1(m, R) {
                uint32$1(m, R >>> 0), uint32$1(m, Math.floor(R / 4294967296))
            }

            function uint64$1(m, R) {
                uint32$1(m, R >>> 0), uint32$1(m, R / 4294967296 >> 0)
            }

            var H = new Int32Array(2), G = new Float32Array(H.buffer), q = new Float64Array(H.buffer);

            function writeFloat32(m, R) {
                G[0] = R, int32$1(m, H[0])
            }

            function writeFloat64(m, R) {
                q[0] = R, int32$1(m, H[0]), int32$1(m, H[1])
            }

            function string$1(m, R) {
                R || (R = "");
                var C = function (m) {
                    for (var R = 0, C = 0, T = 0, L = m.length; T < L; T++) (R = m.charCodeAt(T)) < 128 ? C += 1 : R < 2048 ? C += 2 : R < 55296 || R >= 57344 ? C += 3 : (T++, C += 4);
                    return C
                }(R), T = 0;
                if (C < 32) m.push(160 | C), T = 1; else if (C < 256) m.push(217), uint8$1(m, C), T = 2; else if (C < 65536) m.push(218), uint16$1(m, C), T = 3; else if (C < 4294967296) m.push(219), uint32$1(m, C), T = 5; else throw Error("String too long");
                return utf8Write(m, m.length, R), T + C
            }

            function number$1(m, R) {
                return isNaN(R) ? number$1(m, 0) : isFinite(R) ? R !== (0 | R) ? (m.push(203), writeFloat64(m, R), 9) : R >= 0 ? R < 128 ? (uint8$1(m, R), 1) : R < 256 ? (m.push(204), uint8$1(m, R), 2) : R < 65536 ? (m.push(205), uint16$1(m, R), 3) : R < 4294967296 ? (m.push(206), uint32$1(m, R), 5) : (m.push(207), uint64$1(m, R), 9) : R >= -32 ? (m.push(224 | R + 32), 1) : R >= -128 ? (m.push(208), int8$1(m, R), 2) : R >= -32768 ? (m.push(209), int16$1(m, R), 3) : R >= -2147483648 ? (m.push(210), int32$1(m, R), 5) : (m.push(211), int64$1(m, R), 9) : number$1(m, R > 0 ? Number.MAX_SAFE_INTEGER : -Number.MAX_SAFE_INTEGER)
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
                    writeFloat32(m, R)
                },
                float64: function (m, R) {
                    writeFloat64(m, R)
                },
                writeFloat32: writeFloat32,
                writeFloat64: writeFloat64,
                boolean: function (m, R) {
                    return uint8$1(m, R ? 1 : 0)
                },
                string: string$1,
                number: number$1
            });

            function int8(m, R) {
                return uint8(m, R) << 24 >> 24
            }

            function uint8(m, R) {
                return m[R.offset++]
            }

            function int16(m, R) {
                return uint16(m, R) << 16 >> 16
            }

            function uint16(m, R) {
                return m[R.offset++] | m[R.offset++] << 8
            }

            function int32(m, R) {
                return m[R.offset++] | m[R.offset++] << 8 | m[R.offset++] << 16 | m[R.offset++] << 24
            }

            function uint32(m, R) {
                return int32(m, R) >>> 0
            }

            function int64(m, R) {
                var C = uint32(m, R);
                return 4294967296 * int32(m, R) + C
            }

            function uint64(m, R) {
                var C = uint32(m, R);
                return 4294967296 * uint32(m, R) + C
            }

            var Z = new Int32Array(2), Y = new Float32Array(Z.buffer), K = new Float64Array(Z.buffer);

            function readFloat32(m, R) {
                return Z[0] = int32(m, R), Y[0]
            }

            function readFloat64(m, R) {
                return Z[0] = int32(m, R), Z[1] = int32(m, R), K[0]
            }

            function string(m, R) {
                var C, T = m[R.offset++];
                T < 192 ? C = 31 & T : 217 === T ? C = uint8(m, R) : 218 === T ? C = uint16(m, R) : 219 === T && (C = uint32(m, R));
                var L = function (m, R, C) {
                    for (var T = "", L = 0, U = R, $ = R + C; U < $; U++) {
                        var B = m[U];
                        if ((128 & B) == 0) {
                            T += String.fromCharCode(B);
                            continue
                        }
                        if ((224 & B) == 192) {
                            T += String.fromCharCode((31 & B) << 6 | 63 & m[++U]);
                            continue
                        }
                        if ((240 & B) == 224) {
                            T += String.fromCharCode((15 & B) << 12 | (63 & m[++U]) << 6 | (63 & m[++U]) << 0);
                            continue
                        }
                        if ((248 & B) == 240) {
                            (L = (7 & B) << 18 | (63 & m[++U]) << 12 | (63 & m[++U]) << 6 | (63 & m[++U]) << 0) >= 65536 ? (L -= 65536, T += String.fromCharCode((L >>> 10) + 55296, (1023 & L) + 56320)) : T += String.fromCharCode(L);
                            continue
                        }
                        console.error("Invalid byte " + B.toString(16))
                    }
                    return T
                }(m, R.offset, C);
                return R.offset += C, L
            }

            function number(m, R) {
                var C = m[R.offset++];
                if (C < 128) return C;
                if (202 === C) return readFloat32(m, R);
                if (203 === C) return readFloat64(m, R);
                if (204 === C) return uint8(m, R);
                if (205 === C) return uint16(m, R);
                if (206 === C) return uint32(m, R);
                if (207 === C) return uint64(m, R); else if (208 === C) return int8(m, R); else if (209 === C) return int16(m, R); else if (210 === C) return int32(m, R); else if (211 === C) return int64(m, R); else if (C > 223) return -((255 - C + 1) * 1)
            }

            function switchStructureCheck(m, R) {
                return 255 === m[R.offset - 1] && (m[R.offset] < 128 || m[R.offset] >= 202 && m[R.offset] <= 211)
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
                    return readFloat32(m, R)
                },
                float64: function (m, R) {
                    return readFloat64(m, R)
                },
                int64: int64,
                uint64: uint64,
                readFloat32: readFloat32,
                readFloat64: readFloat64,
                boolean: function (m, R) {
                    return uint8(m, R) > 0
                },
                string: string,
                stringCheck: function (m, R) {
                    var C = m[R.offset];
                    return C < 192 && C > 160 || 217 === C || 218 === C || 219 === C
                },
                number: number,
                numberCheck: function (m, R) {
                    var C = m[R.offset];
                    return C < 128 || C >= 202 && C <= 211
                },
                arrayCheck: function (m, R) {
                    return m[R.offset] < 160
                },
                switchStructureCheck: switchStructureCheck
            }), X = function () {
                function CollectionSchema(m) {
                    var R = this;
                    this.$changes = new C(this), this.$items = new Map, this.$indexes = new Map, this.$refId = 0, m && m.forEach(function (m) {
                        return R.add(m)
                    })
                }

                return CollectionSchema.prototype.onAdd = function (R, C) {
                    return void 0 === C && (C = !0), addCallback(this.$callbacks || (this.$callbacks = []), m.OPERATION.ADD, R, C ? this.$items : void 0)
                }
                    , CollectionSchema.prototype.onRemove = function (R) {
                    return addCallback(this.$callbacks || (this.$callbacks = []), m.OPERATION.DELETE, R)
                }
                    , CollectionSchema.prototype.onChange = function (R) {
                    return addCallback(this.$callbacks || (this.$callbacks = []), m.OPERATION.REPLACE, R)
                }
                    , CollectionSchema.is = function (m) {
                    return void 0 !== m.collection
                }
                    , CollectionSchema.prototype.add = function (m) {
                    var R = this.$refId++;
                    return void 0 !== m.$changes && m.$changes.setParent(this, this.$changes.root, R), this.$changes.indexes[R] = R, this.$indexes.set(R, R), this.$items.set(R, m), this.$changes.change(R), R
                }
                    , CollectionSchema.prototype.at = function (m) {
                    var R = Array.from(this.$items.keys())[m];
                    return this.$items.get(R)
                }
                    , CollectionSchema.prototype.entries = function () {
                    return this.$items.entries()
                }
                    , CollectionSchema.prototype.delete = function (m) {
                    for (var R, C, T = this.$items.entries(); (C = T.next()) && !C.done;) if (m === C.value[1]) {
                        R = C.value[0];
                        break
                    }
                    return void 0 !== R && (this.$changes.delete(R), this.$indexes.delete(R), this.$items.delete(R))
                }
                    , CollectionSchema.prototype.clear = function (R) {
                    this.$changes.discard(!0, !0), this.$changes.indexes = {}, this.$indexes.clear(), R && removeChildRefs.call(this, R), this.$items.clear(), this.$changes.operation({
                        index: 0, op: m.OPERATION.CLEAR
                    }), this.$changes.touchParents()
                }
                    , CollectionSchema.prototype.has = function (m) {
                    return Array.from(this.$items.values()).some(function (R) {
                        return R === m
                    })
                }
                    , CollectionSchema.prototype.forEach = function (m) {
                    var R = this;
                    this.$items.forEach(function (C, T, L) {
                        return m(C, T, R)
                    })
                }
                    , CollectionSchema.prototype.values = function () {
                    return this.$items.values()
                }
                    , Object.defineProperty(CollectionSchema.prototype, "size", {
                    get: function () {
                        return this.$items.size
                    }, enumerable: !1, configurable: !0
                }), CollectionSchema.prototype.setIndex = function (m, R) {
                    this.$indexes.set(m, R)
                }
                    , CollectionSchema.prototype.getIndex = function (m) {
                    return this.$indexes.get(m)
                }
                    , CollectionSchema.prototype.getByIndex = function (m) {
                    return this.$items.get(this.$indexes.get(m))
                }
                    , CollectionSchema.prototype.deleteByIndex = function (m) {
                    var R = this.$indexes.get(m);
                    this.$items.delete(R), this.$indexes.delete(m)
                }
                    , CollectionSchema.prototype.toArray = function () {
                    return Array.from(this.$items.values())
                }
                    , CollectionSchema.prototype.toJSON = function () {
                    var m = [];
                    return this.forEach(function (R, C) {
                        m.push("function" == typeof R.toJSON ? R.toJSON() : R)
                    }), m
                }
                    , CollectionSchema.prototype.clone = function (m) {
                    var R;
                    return m ? R = Object.assign(new CollectionSchema, this) : (R = new CollectionSchema, this.forEach(function (m) {
                        m.$changes ? R.add(m.clone()) : R.add(m)
                    })), R
                }
                    , CollectionSchema
            }(), Q = function () {
                function SetSchema(m) {
                    var R = this;
                    this.$changes = new C(this), this.$items = new Map, this.$indexes = new Map, this.$refId = 0, m && m.forEach(function (m) {
                        return R.add(m)
                    })
                }

                return SetSchema.prototype.onAdd = function (R, C) {
                    return void 0 === C && (C = !0), addCallback(this.$callbacks || (this.$callbacks = []), m.OPERATION.ADD, R, C ? this.$items : void 0)
                }
                    , SetSchema.prototype.onRemove = function (R) {
                    return addCallback(this.$callbacks || (this.$callbacks = []), m.OPERATION.DELETE, R)
                }
                    , SetSchema.prototype.onChange = function (R) {
                    return addCallback(this.$callbacks || (this.$callbacks = []), m.OPERATION.REPLACE, R)
                }
                    , SetSchema.is = function (m) {
                    return void 0 !== m.set
                }
                    , SetSchema.prototype.add = function (R) {
                    if (this.has(R)) return !1;
                    var C, T, L = this.$refId++;
                    void 0 !== R.$changes && R.$changes.setParent(this, this.$changes.root, L);
                    var U = null !== (T = null === (C = this.$changes.indexes[L]) || void 0 === C ? void 0 : C.op) && void 0 !== T ? T : m.OPERATION.ADD;
                    return this.$changes.indexes[L] = L, this.$indexes.set(L, L), this.$items.set(L, R), this.$changes.change(L, U), L
                }
                    , SetSchema.prototype.entries = function () {
                    return this.$items.entries()
                }
                    , SetSchema.prototype.delete = function (m) {
                    for (var R, C, T = this.$items.entries(); (C = T.next()) && !C.done;) if (m === C.value[1]) {
                        R = C.value[0];
                        break
                    }
                    return void 0 !== R && (this.$changes.delete(R), this.$indexes.delete(R), this.$items.delete(R))
                }
                    , SetSchema.prototype.clear = function (R) {
                    this.$changes.discard(!0, !0), this.$changes.indexes = {}, this.$indexes.clear(), R && removeChildRefs.call(this, R), this.$items.clear(), this.$changes.operation({
                        index: 0, op: m.OPERATION.CLEAR
                    }), this.$changes.touchParents()
                }
                    , SetSchema.prototype.has = function (m) {
                    for (var R, C = this.$items.values(), T = !1; (R = C.next()) && !R.done;) if (m === R.value) {
                        T = !0;
                        break
                    }
                    return T
                }
                    , SetSchema.prototype.forEach = function (m) {
                    var R = this;
                    this.$items.forEach(function (C, T, L) {
                        return m(C, T, R)
                    })
                }
                    , SetSchema.prototype.values = function () {
                    return this.$items.values()
                }
                    , Object.defineProperty(SetSchema.prototype, "size", {
                    get: function () {
                        return this.$items.size
                    }, enumerable: !1, configurable: !0
                }), SetSchema.prototype.setIndex = function (m, R) {
                    this.$indexes.set(m, R)
                }
                    , SetSchema.prototype.getIndex = function (m) {
                    return this.$indexes.get(m)
                }
                    , SetSchema.prototype.getByIndex = function (m) {
                    return this.$items.get(this.$indexes.get(m))
                }
                    , SetSchema.prototype.deleteByIndex = function (m) {
                    var R = this.$indexes.get(m);
                    this.$items.delete(R), this.$indexes.delete(m)
                }
                    , SetSchema.prototype.toArray = function () {
                    return Array.from(this.$items.values())
                }
                    , SetSchema.prototype.toJSON = function () {
                    var m = [];
                    return this.forEach(function (R, C) {
                        m.push("function" == typeof R.toJSON ? R.toJSON() : R)
                    }), m
                }
                    , SetSchema.prototype.clone = function (m) {
                    var R;
                    return m ? R = Object.assign(new SetSchema, this) : (R = new SetSchema, this.forEach(function (m) {
                        m.$changes ? R.add(m.clone()) : R.add(m)
                    })), R
                }
                    , SetSchema
            }(), ee = function () {
                function ClientState() {
                    this.refIds = new WeakSet, this.containerIndexes = new WeakMap
                }

                return ClientState.prototype.addRefId = function (m) {
                    this.refIds.has(m) || (this.refIds.add(m), this.containerIndexes.set(m, new Set))
                }
                    , ClientState.get = function (m) {
                    return void 0 === m.$filterState && (m.$filterState = new ClientState), m.$filterState
                }
                    , ClientState
            }(), et = function () {
                function ReferenceTracker() {
                    this.refs = new Map, this.refCounts = {}, this.deletedRefs = new Set, this.nextUniqueId = 0
                }

                return ReferenceTracker.prototype.getNextUniqueId = function () {
                    return this.nextUniqueId++
                }
                    , ReferenceTracker.prototype.addRef = function (m, R, C) {
                    void 0 === C && (C = !0), this.refs.set(m, R), C && (this.refCounts[m] = (this.refCounts[m] || 0) + 1)
                }
                    , ReferenceTracker.prototype.removeRef = function (m) {
                    this.refCounts[m] = this.refCounts[m] - 1, this.deletedRefs.add(m)
                }
                    , ReferenceTracker.prototype.clearRefs = function () {
                    this.refs.clear(), this.deletedRefs.clear(), this.refCounts = {}
                }
                    , ReferenceTracker.prototype.garbageCollectDeletedRefs = function () {
                    var m = this;
                    this.deletedRefs.forEach(function (R) {
                        if (!(m.refCounts[R] > 0)) {
                            var C = m.refs.get(R);
                            if (C instanceof en) for (var T in C._definition.schema) "string" != typeof C._definition.schema[T] && C[T] && C[T].$changes && m.removeRef(C[T].$changes.refId); else {
                                var L = C.$changes.parent._definition;
                                "function" == typeof Object.values(L.schema[L.fieldsByIndex[C.$changes.parentIndex]])[0] && Array.from(C.values()).forEach(function (R) {
                                    return m.removeRef(R.$changes.refId)
                                })
                            }
                            m.refs.delete(R), delete m.refCounts[R]
                        }
                    }), this.deletedRefs.clear()
                }
                    , ReferenceTracker
            }(), er = function (m) {
                function EncodeSchemaError() {
                    return null !== m && m.apply(this, arguments) || this
                }

                return __extends(EncodeSchemaError, m), EncodeSchemaError
            }(Error);

            function assertInstanceType(m, R, C, T) {
                if (!(m instanceof R)) throw new er("a '".concat(R.name, "' was expected, but '").concat(m.constructor.name, "' was provided in ").concat(C.constructor.name, "#").concat(T))
            }

            var en = function () {
                function Schema() {
                    for (var m = [], R = 0; R < arguments.length; R++) m[R] = arguments[R];
                    Object.defineProperties(this, {
                        $changes: {
                            value: new C(this, void 0, new et), enumerable: !1, writable: !0
                        }, $callbacks: {
                            value: void 0, enumerable: !1, writable: !0
                        }
                    });
                    var T = this._definition.descriptors;
                    T && Object.defineProperties(this, T), m[0] && this.assign(m[0])
                }

                return Schema.onError = function (m) {
                    console.error(m)
                }
                    , Schema.is = function (m) {
                    return m._definition && void 0 !== m._definition.schema
                }
                    , Schema.prototype.onChange = function (R) {
                    return addCallback(this.$callbacks || (this.$callbacks = []), m.OPERATION.REPLACE, R)
                }
                    , Schema.prototype.onRemove = function (R) {
                    return addCallback(this.$callbacks || (this.$callbacks = []), m.OPERATION.DELETE, R)
                }
                    , Schema.prototype.assign = function (m) {
                    return Object.assign(this, m), this
                }
                    , Object.defineProperty(Schema.prototype, "_definition", {
                    get: function () {
                        return this.constructor._definition
                    }, enumerable: !1, configurable: !0
                }), Schema.prototype.setDirty = function (m, R) {
                    this.$changes.change(m, R)
                }
                    , Schema.prototype.listen = function (m, R, C) {
                    var T = this;
                    return void 0 === C && (C = !0), this.$callbacks || (this.$callbacks = {}), this.$callbacks[m] || (this.$callbacks[m] = []), this.$callbacks[m].push(R), C && void 0 !== this[m] && R(this[m], void 0), function () {
                        return spliceOne(T.$callbacks[m], T.$callbacks[m].indexOf(R))
                    }
                }
                    , Schema.prototype.decode = function (R, C, $) {
                    void 0 === C && (C = {
                        offset: 0
                    }), void 0 === $ && ($ = this);
                    var B, V = [], H = this.$changes.root, G = R.length, q = 0;
                    for (H.refs.set(q, this); C.offset < G;) {
                        var W, Z = R[C.offset++];
                        if (255 == Z) {
                            q = number(R, C);
                            var Y = H.refs.get(q);
                            if (!Y) throw Error('"refId" not found: '.concat(q));
                            $ = Y;
                            continue
                        }
                        var K = $.$changes, ee = void 0 !== $._definition, et = ee ? Z >> 6 << 6 : Z;
                        if (et === m.OPERATION.CLEAR) {
                            $.clear(V);
                            continue
                        }
                        var er = ee ? Z % (et || 255) : number(R, C), en = ee ? $._definition.fieldsByIndex[er] : "",
                            eo = K.getType(er), ei = void 0, ea = void 0, es = void 0;
                        if (ee ? ea = $["_".concat(en)] : (ea = $.getByIndex(er), (et & m.OPERATION.ADD) === m.OPERATION.ADD ? (es = $ instanceof L ? string(R, C) : er, $.setIndex(er, es)) : es = $.getIndex(er)), (et & m.OPERATION.DELETE) === m.OPERATION.DELETE && (et !== m.OPERATION.DELETE_AND_ADD && $.deleteByIndex(er), ea && ea.$changes && H.removeRef(ea.$changes.refId), ei = null), void 0 === en) {
                            // console.warn("@colyseus/schema: definition mismatch");
                            for (var el = {
                                offset: C.offset
                            }; C.offset < G && !(switchStructureCheck(R, C) && (el.offset = C.offset + 1, H.refs.has(number(R, el))));) C.offset++;
                            continue
                        }
                        if (et === m.OPERATION.DELETE) ; else if (Schema.is(eo)) {
                            var eu = number(R, C);
                            if (ei = H.refs.get(eu), et !== m.OPERATION.REPLACE) {
                                var ec = this.getSchemaType(R, C, eo);
                                !ei && ((ei = this.createTypeInstance(ec)).$changes.refId = eu, ea && (ei.$callbacks = ea.$callbacks, ea.$changes.refId && eu !== ea.$changes.refId && H.removeRef(ea.$changes.refId))), H.addRef(eu, ei, ei !== ea)
                            }
                        } else if ("string" == typeof eo) W = C, ei = J[eo](R, W); else {
                            var ed = U[Object.keys(eo)[0]], ef = number(R, C),
                                ep = H.refs.has(ef) ? ea || H.refs.get(ef) : new ed.constructor;
                            if ((ei = ep.clone(!0)).$changes.refId = ef, ea && (ei.$callbacks = ea.$callbacks, ea.$changes.refId && ef !== ea.$changes.refId)) {
                                H.removeRef(ea.$changes.refId);
                                for (var eh = ea.entries(), eg = void 0; (eg = eh.next()) && !eg.done;) {
                                    var em = (B = eg.value)[0], ey = B[1];
                                    V.push({
                                        refId: ef, op: m.OPERATION.DELETE, field: em, value: void 0, previousValue: ey
                                    })
                                }
                            }
                            H.addRef(ef, ei, ep !== ea)
                        }
                        if (null != ei) {
                            if (ei.$changes && ei.$changes.setParent(K.ref, K.root, er), $ instanceof Schema) $[en] = ei; else if ($ instanceof L) {
                                var em = es;
                                $.$items.set(em, ei), $.$changes.allChanges.add(er)
                            } else if ($ instanceof T) $.setAt(er, ei); else if ($ instanceof X) {
                                var ev = $.add(ei);
                                $.setIndex(er, ev)
                            } else if ($ instanceof Q) {
                                var ev = $.add(ei);
                                !1 !== ev && $.setIndex(er, ev)
                            }
                        }
                        ea !== ei && V.push({
                            refId: q, op: et, field: en, dynamicIndex: es, value: ei, previousValue: ea
                        })
                    }
                    return this._triggerChanges(V), H.garbageCollectDeletedRefs(), V
                }
                    , Schema.prototype.encode = function (R, C, T) {
                    void 0 === R && (R = !1), void 0 === C && (C = []), void 0 === T && (T = !1);
                    for (var $ = this.$changes, B = new WeakSet, V = [$], H = 1, G = 0; G < H; G++) {
                        var q = V[G], Z = q.ref, Y = Z instanceof Schema;
                        q.ensureRefId(), B.add(q), q !== $ && (q.changed || R) && (uint8$1(C, 255), number$1(C, q.refId));
                        for (var K = R ? Array.from(q.allChanges) : Array.from(q.changes.values()), J = 0, X = K.length; J < X; J++) {
                            var Q = R ? {
                                    op: m.OPERATION.ADD, index: K[J]
                                } : K[J], ee = Q.index,
                                et = Y ? Z._definition.fieldsByIndex && Z._definition.fieldsByIndex[ee] : ee,
                                en = C.length;
                            if (Q.op !== m.OPERATION.TOUCH) {
                                if (Y) uint8$1(C, ee | Q.op); else {
                                    if (uint8$1(C, Q.op), Q.op === m.OPERATION.CLEAR) continue;
                                    number$1(C, ee)
                                }
                            }
                            if (!Y && (Q.op & m.OPERATION.ADD) == m.OPERATION.ADD && Z instanceof L && string$1(C, q.ref.$indexes.get(ee)), Q.op !== m.OPERATION.DELETE) {
                                var eo = q.getType(ee), ei = q.getValue(ee);
                                if (ei && ei.$changes && !B.has(ei.$changes) && (V.push(ei.$changes), ei.$changes.ensureRefId(), H++), Q.op !== m.OPERATION.TOUCH) {
                                    if (Schema.is(eo)) assertInstanceType(ei, eo, Z, et), number$1(C, ei.$changes.refId), (Q.op & m.OPERATION.ADD) === m.OPERATION.ADD && this.tryEncodeTypeId(C, eo, ei.constructor); else if ("string" == typeof eo) !function (m, R, C, T, L) {
                                        !function (m, R, C, T) {
                                            var L, U = !1;
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
                                                    L = "number", isNaN(m) && console.log('trying to encode "NaN" in '.concat(C.constructor.name, "#").concat(T));
                                                    break;
                                                case "string":
                                                    L = "string", U = !0;
                                                    break;
                                                case "boolean":
                                                    return
                                            }
                                            if (typeof m !== L && (!U || U && null !== m)) {
                                                var $ = "'".concat(JSON.stringify(m), "'").concat(m && m.constructor && " (".concat(m.constructor.name, ")") || "");
                                                throw new er("a '".concat(L, "' was expected, but ").concat($, " was provided in ").concat(C.constructor.name, "#").concat(T))
                                            }
                                        }(C, m, T, L);
                                        var U = W[m];
                                        if (U) U(R, C); else throw new er("a '".concat(m, "' was expected, but ").concat(C, " was provided in ").concat(T.constructor.name, "#").concat(L))
                                    }(eo, C, ei, Z, et); else {
                                        var ea = U[Object.keys(eo)[0]];
                                        assertInstanceType(Z["_".concat(et)], ea.constructor, Z, et), number$1(C, ei.$changes.refId)
                                    }
                                    T && q.cache(ee, C.slice(en))
                                }
                            }
                        }
                        R || T || q.discard()
                    }
                    return C
                }
                    , Schema.prototype.encodeAll = function (m) {
                    return this.encode(!0, [], m)
                }
                    , Schema.prototype.applyFilters = function (R, C) {
                    void 0 === C && (C = !1);
                    for (var T, U, $ = this, B = new Set, V = ee.get(R), H = [this.$changes], G = 1, q = [], Z = 0; Z < G; Z++) !function (Z) {
                        var Y = H[Z];
                        if (!B.has(Y.refId)) {
                            var K = Y.ref, J = K instanceof Schema;
                            uint8$1(q, 255), number$1(q, Y.refId);
                            var X = V.refIds.has(Y), Q = C || !X;
                            V.addRefId(Y);
                            var ee = V.containerIndexes.get(Y),
                                et = Q ? Array.from(Y.allChanges) : Array.from(Y.changes.values());
                            !C && J && K._definition.indexesWithFilters && K._definition.indexesWithFilters.forEach(function (R) {
                                !ee.has(R) && Y.allChanges.has(R) && (Q ? et.push(R) : et.push({
                                    op: m.OPERATION.ADD, index: R
                                }))
                            });
                            for (var er = 0, en = et.length; er < en; er++) {
                                var eo = Q ? {
                                    op: m.OPERATION.ADD, index: et[er]
                                } : et[er];
                                if (eo.op === m.OPERATION.CLEAR) {
                                    uint8$1(q, eo.op);
                                    continue
                                }
                                var ei = eo.index;
                                if (eo.op === m.OPERATION.DELETE) {
                                    J ? uint8$1(q, eo.op | ei) : (uint8$1(q, eo.op), number$1(q, ei));
                                    continue
                                }
                                var ea = Y.getValue(ei), es = Y.getType(ei);
                                if (J) {
                                    var el = K._definition.filters && K._definition.filters[ei];
                                    if (el && !el.call(K, R, ea, $)) {
                                        ea && ea.$changes && B.add(ea.$changes.refId);
                                        continue
                                    }
                                } else {
                                    var eu = Y.parent, el = Y.getChildrenFilter();
                                    if (el && !el.call(eu, R, K.$indexes.get(ei), ea, $)) {
                                        ea && ea.$changes && B.add(ea.$changes.refId);
                                        continue
                                    }
                                }
                                if (ea.$changes && (H.push(ea.$changes), G++), eo.op !== m.OPERATION.TOUCH) {
                                    if (eo.op === m.OPERATION.ADD || J) q.push.apply(q, null !== (T = Y.caches[ei]) && void 0 !== T ? T : []), ee.add(ei); else if (ee.has(ei)) q.push.apply(q, null !== (U = Y.caches[ei]) && void 0 !== U ? U : []); else {
                                        if (ee.add(ei), uint8$1(q, m.OPERATION.ADD), number$1(q, ei), K instanceof L) {
                                            var ec = Y.ref.$indexes.get(ei);
                                            string$1(q, ec)
                                        }
                                        ea.$changes ? number$1(q, ea.$changes.refId) : W[es](q, ea)
                                    }
                                } else if (ea.$changes && !J) {
                                    if (uint8$1(q, m.OPERATION.ADD), number$1(q, ei), K instanceof L) {
                                        var ec = Y.ref.$indexes.get(ei);
                                        string$1(q, ec)
                                    }
                                    number$1(q, ea.$changes.refId)
                                }
                            }
                        }
                    }(Z);
                    return q
                }
                    , Schema.prototype.clone = function () {
                    var m, R = new this.constructor, C = this._definition.schema;
                    for (var T in C) "object" == typeof this[T] && "function" == typeof (null === (m = this[T]) || void 0 === m ? void 0 : m.clone) ? R[T] = this[T].clone() : R[T] = this[T];
                    return R
                }
                    , Schema.prototype.toJSON = function () {
                    var m = this._definition.schema, R = this._definition.deprecated, C = {};
                    for (var T in m) R[T] || null === this[T] || void 0 === this[T] || (C[T] = "function" == typeof this[T].toJSON ? this[T].toJSON() : this["_".concat(T)]);
                    return C
                }
                    , Schema.prototype.discardAllChanges = function () {
                    this.$changes.discardAll()
                }
                    , Schema.prototype.getByIndex = function (m) {
                    return this[this._definition.fieldsByIndex[m]]
                }
                    , Schema.prototype.deleteByIndex = function (m) {
                    this[this._definition.fieldsByIndex[m]] = void 0
                }
                    , Schema.prototype.tryEncodeTypeId = function (m, R, C) {
                    R._typeid !== C._typeid && (uint8$1(m, 213), number$1(m, C._typeid))
                }
                    , Schema.prototype.getSchemaType = function (m, R, C) {
                    var T;
                    return 213 === m[R.offset] && (R.offset++, T = this.constructor._context.get(number(m, R))), T || C
                }
                    , Schema.prototype.createTypeInstance = function (m) {
                    var R = new m;
                    return R.$changes.root = this.$changes.root, R
                }
                    , Schema.prototype._triggerChanges = function (R) {
                    for (var C, T, L, U, $, B, V, H, G, q = new Set, W = this.$changes.root.refs, Z = 0; Z < R.length; Z++) !function (Z) {
                        var Y = R[Z], K = Y.refId, J = W.get(K), X = J.$callbacks;
                        if ((Y.op & m.OPERATION.DELETE) === m.OPERATION.DELETE && Y.previousValue instanceof Schema && (null === (T = null === (C = Y.previousValue.$callbacks) || void 0 === C ? void 0 : C[m.OPERATION.DELETE]) || void 0 === T || T.forEach(function (m) {
                            return m()
                        })), X) {
                            if (J instanceof Schema) {
                                if (!q.has(K)) try {
                                    null === (L = null == X ? void 0 : X[m.OPERATION.REPLACE]) || void 0 === L || L.forEach(function (m) {
                                        return m(R)
                                    })
                                } catch (m) {
                                    Schema.onError(m)
                                }
                                try {
                                    X.hasOwnProperty(Y.field) && (null === (U = X[Y.field]) || void 0 === U || U.forEach(function (m) {
                                        return m(Y.value, Y.previousValue)
                                    }))
                                } catch (m) {
                                    Schema.onError(m)
                                }
                            } else Y.op === m.OPERATION.ADD && void 0 === Y.previousValue ? null === ($ = X[m.OPERATION.ADD]) || void 0 === $ || $.forEach(function (m) {
                                var R;
                                return m(Y.value, null !== (R = Y.dynamicIndex) && void 0 !== R ? R : Y.field)
                            }) : Y.op === m.OPERATION.DELETE ? void 0 !== Y.previousValue && (null === (B = X[m.OPERATION.DELETE]) || void 0 === B || B.forEach(function (m) {
                                var R;
                                return m(Y.previousValue, null !== (R = Y.dynamicIndex) && void 0 !== R ? R : Y.field)
                            })) : Y.op === m.OPERATION.DELETE_AND_ADD && (void 0 !== Y.previousValue && (null === (V = X[m.OPERATION.DELETE]) || void 0 === V || V.forEach(function (m) {
                                var R;
                                return m(Y.previousValue, null !== (R = Y.dynamicIndex) && void 0 !== R ? R : Y.field)
                            })), null === (H = X[m.OPERATION.ADD]) || void 0 === H || H.forEach(function (m) {
                                var R;
                                return m(Y.value, null !== (R = Y.dynamicIndex) && void 0 !== R ? R : Y.field)
                            })), Y.value !== Y.previousValue && (null === (G = X[m.OPERATION.REPLACE]) || void 0 === G || G.forEach(function (m) {
                                var R;
                                return m(Y.value, null !== (R = Y.dynamicIndex) && void 0 !== R ? R : Y.field)
                            }));
                            q.add(K)
                        }
                    }(Z)
                }
                    , Schema._definition = $.create(), Schema
            }(), eo = {
                context: new B
            }, ei = function (m) {
                function ReflectionField() {
                    return null !== m && m.apply(this, arguments) || this
                }

                return __extends(ReflectionField, m), __decorate([type("string", eo)], ReflectionField.prototype, "name", void 0), __decorate([type("string", eo)], ReflectionField.prototype, "type", void 0), __decorate([type("number", eo)], ReflectionField.prototype, "referencedType", void 0), ReflectionField
            }(en), ea = function (m) {
                function ReflectionType() {
                    var R = null !== m && m.apply(this, arguments) || this;
                    return R.fields = new T, R
                }

                return __extends(ReflectionType, m), __decorate([type("number", eo)], ReflectionType.prototype, "id", void 0), __decorate([type([ei], eo)], ReflectionType.prototype, "fields", void 0), ReflectionType
            }(en), es = function (m) {
                function Reflection() {
                    var R = null !== m && m.apply(this, arguments) || this;
                    return R.types = new T, R
                }

                return __extends(Reflection, m), Reflection.encode = function (m) {
                    var R = m.constructor, C = new Reflection;
                    C.rootType = R._typeid;
                    var T = R._context.types;
                    for (var L in T) {
                        var U = new ea;
                        U.id = Number(L), function (m, R) {
                            for (var T in R) {
                                var L = new ei;
                                L.name = T;
                                var U = void 0;
                                if ("string" == typeof R[T]) U = R[T]; else {
                                    var $ = R[T], B = void 0;
                                    en.is($) ? (U = "ref", B = R[T]) : (U = Object.keys($)[0], "string" == typeof $[U] ? U += ":" + $[U] : B = $[U]), L.referencedType = B ? B._typeid : -1
                                }
                                L.type = U, m.fields.push(L)
                            }
                            C.types.push(m)
                        }(U, T[L]._definition.schema)
                    }
                    return C.encodeAll()
                }
                    , Reflection.decode = function (m, R) {
                    var C = new B, T = new Reflection;
                    T.decode(m, R);
                    var L = T.types.reduce(function (m, R) {
                        var T = function (m) {
                            function _() {
                                return null !== m && m.apply(this, arguments) || this
                            }

                            return __extends(_, m), _
                        }(en), L = R.id;
                        return m[L] = T, C.add(T, L), m
                    }, {});
                    T.types.forEach(function (m) {
                        var R = L[m.id];
                        m.fields.forEach(function (m) {
                            var T;
                            if (void 0 !== m.referencedType) {
                                var U = m.type, $ = L[m.referencedType];
                                if (!$) {
                                    var B = m.type.split(":");
                                    U = B[0], $ = B[1]
                                }
                                "ref" === U ? type($, {
                                    context: C
                                })(R.prototype, m.name) : type(((T = {})[U] = $, T), {
                                    context: C
                                })(R.prototype, m.name)
                            } else type(m.type, {
                                context: C
                            })(R.prototype, m.name)
                        })
                    });
                    var $ = L[T.rootType], V = new $;
                    for (var H in $._definition.schema) {
                        var G = $._definition.schema[H];
                        "string" != typeof G && (V[H] = "function" == typeof G ? new G : new U[Object.keys(G)[0]].constructor)
                    }
                    return V
                }
                    , __decorate([type([ea], eo)], Reflection.prototype, "types", void 0), __decorate([type("number", eo)], Reflection.prototype, "rootType", void 0), Reflection, _globalReflection = Reflection
            }(en);
            U.map = {
                constructor: L
            }, U.array = {
                constructor: T
            }, U.set = {
                constructor: Q
            }, U.collection = {
                constructor: X
            }, m.ArraySchema = T, m.CollectionSchema = X, m.Context = B, m.MapSchema = L, m.Reflection = es, m.ReflectionField = ei, m.ReflectionType = ea, m.Schema = en, m.SchemaDefinition = $, m.SetSchema = Q, m.decode = J, m.defineTypes = function (m, R, C) {
                for (var T in void 0 === C && (C = {}), C.context || (C.context = m._context || C.context || V), R) type(R[T], C)(m.prototype, T);
                return m
            }
                , m.deprecated = function (m) {
                return void 0 === m && (m = !0), function (R, C) {
                    var T = R.constructor._definition;
                    T.deprecated[C] = !0, m && (T.descriptors[C] = {
                        get: function () {
                            throw Error("".concat(C, " is deprecated."))
                        }, set: function (m) {
                        }, enumerable: !1, configurable: !0
                    })
                }
            }
                , m.dumpChanges = function (m) {
                for (var R = [m.$changes], C = {}, T = 0; T < 1; T++) !function (m) {
                    var T = R[m];
                    T.changes.forEach(function (m) {
                        var R = T.ref, L = m.index;
                        C[R._definition ? R._definition.fieldsByIndex[L] : R.$indexes.get(L)] = T.getValue(L)
                    })
                }(T);
                return C
            }
                , m.encode = W, m.filter = function (m) {
                return function (R, C) {
                    var T = R.constructor;
                    T._definition.addFilter(C, m) && (T._context.useFilters = !0)
                }
            }
                , m.filterChildren = function (m) {
                return function (R, C) {
                    var T = R.constructor;
                    T._definition.addChildrenFilter(C, m) && (T._context.useFilters = !0)
                }
            }
                , m.hasFilter = function (m) {
                return m._context && m._context.useFilters
            }
                , m.registerType = function (m, R) {
                U[m] = R
            }
                , m.type = type, Object.defineProperty(m, "__esModule", {
                value: !0
            })
        }(R);
        var schema = null;

        class SchemaSerializer {
            setState(m) {
                return this.state.decode(m)
            }

            getState() {
                return this.state
            }

            patch(m) {
                return this.state.decode(m)
            }

            teardown() {
                var m, R;
                null === (R = null === (m = this.state) || void 0 === m ? void 0 : m.$changes) || void 0 === R || R.root.clearRefs()
            }

            handshake(m, R) {
                if (this.state) {
                    let C = new _globalReflection;
                    C.decode(m, R)
                } else this.state = _globalReflection.decode(m, R)
            }
        }

        const W = R;
        const encryptUtils = {
            encryptSend(m, R) {
                let C;
                let T = [V.Protocol.ROOM_DATA];
                if (("string" == typeof m ? W.encode.string(T, m) : W.encode.number(T, m), void 0 !== R)) {
                    let m = $.encode(R);
                    (C = new Uint8Array(T.length + m.byteLength)).set(new Uint8Array(T), 0), C.set(new Uint8Array(m), T.length);
                } else C = new Uint8Array(T);
                // console.log(C.buffer)
                return C.buffer;
            }, encryptSendBytes(m, R) {
                let C;
                let T = [V.Protocol.ROOM_DATA_BYTES];
                "string" == typeof m ? W.encode.string(T, m) : W.encode.number(T, m), (C = new Uint8Array(T.length + (R.byteLength || R.length))).set(new Uint8Array(T), 0), C.set(new Uint8Array(R), T.length);
                // console.log(C.buffer)
                // this.connection.send(C.buffer);
            }
        }
        const config = {
            spacepackEverywhere: {
                enabled: true, // Automatically detect webpack objects and inject them with spacepack (Default: true)
                ignoreSites: [], // Don't inject spacepack on matching sites (Default: [])

                // Don't inject spacepack on matching webpack objects (Default: [])
                ignoreChunkObjects: ["webpackChunkruffle_extension", // https://ruffle.rs/
                ],
            }, siteConfigs: []
        };

        /* // Example config
  const config = {
    spacepackEverywhere: {
      enabled: true, // Automatically detect webpack objects and inject them with spacepack (Default: true)
      ignoreSites: [], // Don't inject spacepack on matching sites (Default: [])

      // Don't inject spacepack on matching webpack objects (Default: [])
      ignoreChunkObjects: [
        "webpackChunkruffle_extension", // https://ruffle.rs/
      ],
    },
    siteConfigs: [
      {
        name: "twitter", // For debug logging (Required)
        chunkObject: "webpackChunk_twitter_responsive_web", // Name of webpack chunk object to intercept (Required)
        webpackVersion: "5", // Version of webpack used to compile. (Required)

        // String or Array of strings of sites to inject on. (Required)
        matchSites: ["twitter.com"],

        // Whether to isolate every module. with //# sourceURL=. Allows for viewing an individual module in devtools
        // without the whole rest of the chunk, but has a noticable performance impact (Default: false)
        patchAll: true,
        injectSpacepack: true, // Whether to inject spacepack (Default: true)
        patches: [
          {
            // Used for debugging purposes, logging if a patch fails (TODO) and a comment of which
            // patches affected a module
            name: "patchingDemo",

            // String, regexp or an array of them to match a module we're patching. Best to keep this a single string if
            // possible for performance reasons (Required.)
            find: "(window.__INITIAL_STATE__",

            // match and replace are literally passed to `String.prototype.replace(match, replacement)`
            replace: {
              match: /(const|var) .{1,3}=.\..\(window\.__INITIAL_STATE__/,
              replacement: (orig) => `console.log('Patches work!!!');${orig}`,
            },
          },
        ],
        modules: [
          {
            // ID of the module being injected. If this ID is identical to one of another module it will be replaced
            // with this one. (Required)
            name: "modulesDemo",

            // Set of strings, or regexes of modules that need to be loaded before injecting this one. can also be
            // `{moduleId: <moduleId>}` if depending on other injected or named modules. (Default: null)
            needs: new Set(),
            entry: true, // Whether to load immediately or wait to be required by another module (Default: false)

            // The actual webpack module! Treat this sort of like in node where you can require other modules and export
            // your own values. (Required). Hint: you can require("spacepack") if injectSpacepack isn't false.
            run: function (module, exports, webpackRequire) {
              // the actual webpack module.
              console.log("Module injection works!!!");
            },
          },
        ],
      },
    ],
  };
  */

        unsafeWindow.__webpackTools_config = config;

        const runtime = "(() => {\n  // src/matchModule.js\n  function matchModule(moduleStr, queryArg) {\n    const queryArray = queryArg instanceof Array ? queryArg : [queryArg];\n    return !queryArray.some((query) => {\n      if (query instanceof RegExp) {\n        return !query.test(moduleStr);\n      } else {\n        return !moduleStr.includes(query);\n      }\n    });\n  }\n\n  // src/spacepackLite.js\n  var namedRequireMap = {\n    p: \"publicPath\",\n    s: \"entryModuleId\",\n    c: \"moduleCache\",\n    m: \"moduleFactories\",\n    e: \"ensureChunk\",\n    f: \"ensureChunkHandlers\",\n    E: \"prefetchChunk\",\n    F: \"prefetchChunkHandlers\",\n    G: \"preloadChunk\",\n    H: \"preloadChunkHandlers\",\n    d: \"definePropertyGetters\",\n    r: \"makeNamespaceObject\",\n    t: \"createFakeNamespaceObject\",\n    n: \"compatGetDefaultExport\",\n    hmd: \"harmonyModuleDecorator\",\n    nmd: \"nodeModuleDecorator\",\n    h: \"getFullHash\",\n    w: \"wasmInstances\",\n    v: \"instantiateWasm\",\n    oe: \"uncaughtErrorHandler\",\n    nc: \"scriptNonce\",\n    l: \"loadScript\",\n    ts: \"createScript\",\n    tu: \"createScriptUrl\",\n    tt: \"getTrustedTypesPolicy\",\n    cn: \"chunkName\",\n    j: \"runtimeId\",\n    u: \"getChunkScriptFilename\",\n    k: \"getChunkCssFilename\",\n    hu: \"getChunkUpdateScriptFilename\",\n    hk: \"getChunkUpdateCssFilename\",\n    x: \"startup\",\n    X: \"startupEntrypoint\",\n    O: \"onChunksLoaded\",\n    C: \"externalInstallChunk\",\n    i: \"interceptModuleExecution\",\n    g: \"global\",\n    S: \"shareScopeMap\",\n    I: \"initializeSharing\",\n    R: \"currentRemoteGetScope\",\n    hmrF: \"getUpdateManifestFilename\",\n    hmrM: \"hmrDownloadManifest\",\n    hmrC: \"hmrDownloadUpdateHandlers\",\n    hmrD: \"hmrModuleData\",\n    hmrI: \"hmrInvalidateModuleHandlers\",\n    hmrS: \"hmrRuntimeStatePrefix\",\n    amdD: \"amdDefine\",\n    amdO: \"amdOptions\",\n    System: \"system\",\n    o: \"hasOwnProperty\",\n    y: \"systemContext\",\n    b: \"baseURI\",\n    U: \"relativeUrl\",\n    a: \"asyncModule\"\n  };\n  function getNamedRequire(webpackRequire) {\n    const namedRequireObj = {};\n    Object.getOwnPropertyNames(webpackRequire).forEach((key) => {\n      if (Object.prototype.hasOwnProperty.call(namedRequireMap, key)) {\n        namedRequireObj[namedRequireMap[key]] = webpackRequire[key];\n      }\n    });\n    return namedRequireObj;\n  }\n  function getSpacepack(chunkObject, logSuccess = false) {\n    function spacepack(module, exports, webpackRequire) {\n      if (logSuccess) {\n        if (!chunkObject) {\n          console.log(\"[wpTools] spacepack loaded\");\n        } else {\n          console.log(\"[wpTools] spacepack loaded in \" + chunkObject);\n        }\n      }\n      function findByExports(keysArg) {\n        if (!webpackRequire.c) {\n          throw new Error(\"webpack runtime didn't export its moduleCache\");\n        }\n        const keys = keysArg instanceof Array ? keysArg : [keysArg];\n        return Object.entries(webpackRequire.c).filter(([moduleId, exportCache]) => {\n          return !keys.some((searchKey) => {\n            return !(exportCache !== void 0 && exportCache !== window && (exports?.[searchKey] || exports?.default?.[searchKey]));\n          });\n        }).map(([moduleId, exportCache]) => {\n          return exportCache;\n        });\n      }\n      function findByCode(search) {\n        return Object.entries(webpackRequire.m).filter(([moduleId, moduleFunc]) => {\n          const funcStr = Function.prototype.toString.apply(moduleFunc);\n          return matchModule(funcStr, search);\n        }).map(([moduleId, moduleFunc]) => {\n          try {\n            return {\n              id: moduleId,\n              exports: webpackRequire(moduleId)\n            };\n          } catch (error) {\n            console.error(\"Failed to require module: \" + error);\n            return {\n              id: moduleId,\n              exports: {}\n            };\n          }\n        });\n      }\n      function findObjectFromKey(exports2, key) {\n        let subKey;\n        if (key.indexOf(\".\") > -1) {\n          const splitKey = key.split(\".\");\n          key = splitKey[0];\n          subKey = splitKey[1];\n        }\n        for (const exportKey in exports2) {\n          const obj = exports2[exportKey];\n          if (obj && obj[key] !== void 0) {\n            if (subKey) {\n              if (obj[key][subKey])\n                return obj;\n            } else {\n              return obj;\n            }\n          }\n        }\n        return null;\n      }\n      function findObjectFromValue(exports2, value) {\n        for (const exportKey in exports2) {\n          const obj = exports2[exportKey];\n          if (obj == value)\n            return obj;\n          for (const subKey in obj) {\n            if (obj && obj[subKey] == value) {\n              return obj;\n            }\n          }\n        }\n        return null;\n      }\n      function findObjectFromKeyValuePair(exports2, key, value) {\n        for (const exportKey in exports2) {\n          const obj = exports2[exportKey];\n          if (obj && obj[key] == value) {\n            return obj;\n          }\n        }\n        return null;\n      }\n      function findFunctionByStrings(exports2, ...strings) {\n        return Object.entries(exports2).filter(\n          ([index, func]) => typeof func === \"function\" && !strings.some(\n            (query) => !(query instanceof RegExp ? func.toString().match(query) : func.toString().includes(query))\n          )\n        )?.[0]?.[1] ?? null;\n      }\n      function inspect(moduleId) {\n        return webpackRequire.m[moduleId];\n      }\n      const exportedRequire = module.exports.default = exports.default = {\n        require: webpackRequire,\n        modules: webpackRequire.m,\n        cache: webpackRequire.c,\n        __namedRequire: getNamedRequire(webpackRequire),\n        findByCode,\n        findByExports,\n        findObjectFromKey,\n        findObjectFromKeyValuePair,\n        findObjectFromValue,\n        findFunctionByStrings,\n        inspect\n      };\n      if (chunkObject) {\n        exportedRequire.chunkObject = window[chunkObject];\n        exportedRequire.name = chunkObject;\n      }\n      if (window.wpTools) {\n        const runtimesRegistry = window.wpTools.runtimes;\n        if (runtimesRegistry[chunkObject]) {\n          console.warn(\"[wpTools] Multiple active runtimes for \" + chunkObject);\n          let currId = 0;\n          if (runtimesRegistry[chunkObject].__wpTools_multiRuntime_id) {\n            currId = runtimesRegistry[chunkObject].__wpTools_multiRuntime_id;\n          }\n          runtimesRegistry[chunkObject + \"_\" + currId] = runtimesRegistry[chunkObject];\n          currId++;\n          runtimesRegistry[chunkObject + \"_\" + currId] = exportedRequire;\n          runtimesRegistry[chunkObject] = exportedRequire;\n        }\n        runtimesRegistry[chunkObject] = exportedRequire;\n        window[\"spacepack_\" + chunkObject] = exportedRequire;\n      }\n      window[\"spacepack\"] = exportedRequire;\n    }\n    spacepack.__wpt_processed = true;\n    return spacepack;\n  }\n\n  // src/Patcher.js\n  var ConfigValidationError = class extends Error {\n  };\n  function validateProperty(name, object, key, required, validationCallback) {\n    if (!Object.prototype.hasOwnProperty.call(object, [key])) {\n      if (required) {\n        throw new ConfigValidationError(`Required property not found, missing ${key} in ${name}`);\n      } else {\n        return;\n      }\n    } else {\n      if (!validationCallback(object[key])) {\n        throw new ConfigValidationError(\n          `Failed to validate ${key} in ${name}. The following check failed: \n${validationCallback.toString()}`\n        );\n      }\n    }\n  }\n  var Patcher = class {\n    constructor(config) {\n      this._validateConfig(config);\n      this.name = config.name;\n      this.chunkObject = config.chunkObject;\n      this.webpackVersion = config.webpackVersion.toString();\n      this.patchAll = config.patchAll;\n      this.modules = new Set(config.modules ?? []);\n      for (const module of this.modules) {\n        this._validateModuleConfig(module);\n      }\n      this.patches = new Set(config.patches ?? []);\n      for (const patch of this.patches) {\n        this._validatePatchConfig(patch);\n      }\n      this.patchesToApply = /* @__PURE__ */ new Set();\n      if (this.patches) {\n        for (const patch of this.patches) {\n          if (patch.replace instanceof Array) {\n            for (const index in patch.replace) {\n              this.patchesToApply.add({\n                name: patch.name + \"_\" + index,\n                find: patch.find,\n                replace: patch.replace[index]\n              });\n            }\n            continue;\n          }\n          this.patchesToApply.add(patch);\n        }\n      }\n      this.modulesToInject = /* @__PURE__ */ new Set();\n      if (this.modules) {\n        for (const module of this.modules) {\n          if (module.needs !== void 0 && module.needs instanceof Array) {\n            module.needs = new Set(module.needs);\n          }\n          this.modulesToInject.add(module);\n        }\n      }\n      if (config.injectSpacepack !== false) {\n        this.modulesToInject.add({\n          name: \"spacepack\",\n          // This is sorta a scope hack.\n          // If we rewrap this function, it will lose its scope (in this case the match module import and the chunk object name)\n          run: getSpacepack(this.chunkObject),\n          entry: true\n        });\n      }\n      if (config.patchEntryChunk) {\n        this.modulesToInject.add({\n          name: \"patchEntryChunk\",\n          run: (module, exports, webpackRequire) => {\n            this._patchModules(webpackRequire.m);\n          },\n          entry: true\n        });\n        this.patchEntryChunk = true;\n      }\n    }\n    run() {\n      if (this.webpackVersion === \"4\" || this.webpackVersion === \"5\") {\n        this._interceptWebpackModern();\n      } else {\n        this._interceptWebpackLegacy;\n      }\n    }\n    _interceptWebpackModern() {\n      let realChunkObject = window[this.chunkObject];\n      const patcher = this;\n      Object.defineProperty(window, this.chunkObject, {\n        set: function set(value) {\n          realChunkObject = value;\n          if (patcher.patchEntryChunk) {\n            let newChunk = [[\"patchEntryChunk\"], {}];\n            patcher._injectModules(newChunk);\n            realChunkObject.push(newChunk);\n          }\n          if (!value.push.__wpt_injected) {\n            realChunkObject = value;\n            const realPush = value.push;\n            value.push = function(chunk) {\n              if (!chunk.__wpt_processed) {\n                chunk.__wpt_processed = true;\n                patcher._patchModules(chunk[1]);\n                patcher._injectModules(chunk);\n              }\n              return realPush.apply(this, arguments);\n            };\n            value.push.__wpt_injected = true;\n            if (realPush === Array.prototype.push) {\n              console.log(\"[wpTools] Injected \" + patcher.chunkObject + \" (before webpack runtime)\");\n            } else {\n              console.log(\"[wpTools] Injected \" + patcher.chunkObject + \" (at webpack runtime)\");\n            }\n          }\n        },\n        get: function get() {\n          return realChunkObject;\n        },\n        configurable: true\n      });\n    }\n    _interceptWebpackLegacy() {\n    }\n    _patchModules(modules) {\n      for (const id in modules) {\n        if (modules[id].__wpt_processed) {\n          continue;\n        }\n        let funcStr = Function.prototype.toString.apply(modules[id]);\n        const matchingPatches = [];\n        for (const patch of this.patchesToApply) {\n          if (matchModule(funcStr, patch.find)) {\n            matchingPatches.push(patch);\n            this.patchesToApply.delete(patch);\n          }\n        }\n        for (const patch of matchingPatches) {\n          funcStr = funcStr.replace(patch.replace.match, patch.replace.replacement);\n        }\n        if (matchingPatches.length > 0 || this.patchAll) {\n          let debugString = \"\";\n          if (matchingPatches.length > 0) {\n            debugString += \"Patched by: \" + matchingPatches.map((patch) => patch.name).join(\", \");\n          }\n          modules[id] = new Function(\n            \"module\",\n            \"exports\",\n            \"webpackRequire\",\n            `(${funcStr}).apply(this, arguments)\n// ${debugString}\n//# sourceURL=${this.chunkObject}-Module-${id}`\n          );\n          modules[id].__wpt_patched = true;\n        }\n        modules[id].__wpt_funcStr = funcStr;\n        modules[id].__wpt_processed = true;\n      }\n    }\n    _injectModules(chunk) {\n      const readyModules = /* @__PURE__ */ new Set();\n      for (const moduleToInject of this.modulesToInject) {\n        if (moduleToInject?.needs?.size > 0) {\n          for (const need of moduleToInject.needs) {\n            for (const wpModule of Object.entries(chunk[1])) {\n              if (need?.moduleId && wpModule[0] === need.moduleId || matchModule(wpModule[1].__wpt_funcStr, need)) {\n                moduleToInject.needs.delete(need);\n                if (moduleToInject.needs.size === 0) {\n                  readyModules.add(moduleToInject);\n                }\n                break;\n              }\n            }\n          }\n        } else {\n          readyModules.add(moduleToInject);\n        }\n      }\n      if (readyModules.size > 0) {\n        const injectModules = {};\n        const injectEntries = [];\n        for (const readyModule of readyModules) {\n          this.modulesToInject.delete(readyModule);\n          injectModules[readyModule.name] = readyModule.run;\n          if (readyModule.entry) {\n            injectEntries.push(readyModule.name);\n          }\n        }\n        if (chunk[1] instanceof Array) {\n          const origChunkArray = chunk[1];\n          chunk[1] = {};\n          origChunkArray.forEach((module, index) => {\n            chunk[1][index] = module;\n          });\n        }\n        chunk[1] = Object.assign(chunk[1], injectModules);\n        if (injectEntries.length > 0) {\n          switch (this.webpackVersion) {\n            case \"5\":\n              if (chunk[2]) {\n                const originalEntry = chunk[2];\n                chunk[2] = function(webpackRequire) {\n                  originalEntry.apply(this, arguments);\n                  injectEntries.forEach(webpackRequire);\n                };\n              } else {\n                chunk[2] = function(webpackRequire) {\n                  injectEntries.forEach(webpackRequire);\n                };\n              }\n              break;\n            case \"4\":\n              if (chunk[2]?.[0]) {\n                chunk[2]?.[0].concat([injectEntries]);\n              } else {\n                chunk[2] = [injectEntries];\n              }\n              break;\n          }\n        }\n      }\n    }\n    _validateConfig(config) {\n      validateProperty(\"siteConfigs[?]\", config, \"name\", true, (value) => {\n        return typeof value === \"string\";\n      });\n      const name = config.name;\n      validateProperty(`siteConfigs[${name}]`, config, \"chunkObject\", true, (value) => {\n        return typeof value === \"string\";\n      });\n      validateProperty(`siteConfigs[${name}]`, config, \"webpackVersion\", true, (value) => {\n        return [\"4\", \"5\"].includes(value.toString());\n      });\n      validateProperty(`siteConfigs[${name}]`, config, \"patchAll\", false, (value) => {\n        return typeof value === \"boolean\";\n      });\n      validateProperty(`siteConfigs[${name}]`, config, \"modules\", false, (value) => {\n        return value instanceof Array;\n      });\n      validateProperty(`siteConfigs[${name}]`, config, \"patches\", false, (value) => {\n        return value instanceof Array;\n      });\n      validateProperty(`siteConfigs[${name}]`, config, \"injectSpacepack\", false, (value) => {\n        return typeof value === \"boolean\";\n      });\n      validateProperty(`siteConfigs[${name}]`, config, \"patchEntryChunk\", false, (value) => {\n        return typeof value === \"boolean\";\n      });\n    }\n    _validatePatchReplacement(replace, name, index) {\n      let indexStr = index === void 0 ? \"\" : `[${index}]`;\n      validateProperty(\n        `siteConfigs[${this.name}].patches[${name}].replace${indexStr}`,\n        replace,\n        \"match\",\n        true,\n        (value) => {\n          return typeof value === \"string\" || value instanceof RegExp;\n        }\n      );\n      validateProperty(`siteConfigs[${this.name}].patches[${name}].replace`, replace, \"replacement\", true, (value) => {\n        return typeof value === \"string\" || value instanceof Function;\n      });\n    }\n    _validatePatchConfig(config) {\n      validateProperty(`siteConfigs[${this.name}].patches[?]`, config, \"name\", true, (value) => {\n        return typeof value === \"string\";\n      });\n      const name = config.name;\n      validateProperty(`siteConfigs[${this.name}].patches[${name}]`, config, \"find\", true, (value) => {\n        return (\n          // RegExp, String, or an Array of RegExps and Strings\n          typeof value === \"string\" || value instanceof RegExp || value instanceof Array && !value.some((value2) => {\n            !(typeof value2 === \"string\" || value2 instanceof RegExp);\n          })\n        );\n      });\n      validateProperty(`siteConfigs[${this.name}].patches[${name}]`, config, \"replace\", true, (value) => {\n        return typeof value === \"object\";\n      });\n      if (config.replace instanceof Array) {\n        config.replace.forEach((replacement, index) => {\n          this._validatePatchReplacement(replacement, name, index);\n        });\n      } else {\n        this._validatePatchReplacement(config.replace, name);\n      }\n    }\n    _validateModuleConfig(config) {\n      validateProperty(`siteConfigs[${this.name}].modules[?]`, config, \"name\", true, (value) => {\n        return typeof value === \"string\";\n      });\n      const name = config.name;\n      validateProperty(`siteConfigs[${this.name}].modules[${name}]`, config, \"needs\", false, (value) => {\n        return (value instanceof Array || value instanceof Set) && ![...value].some((value2) => {\n          !(typeof value2 === \"string\" || value2 instanceof RegExp || value2 instanceof Object && typeof value2.moduleId === \"string\");\n        });\n      });\n      validateProperty(`siteConfigs[${this.name}].modules[${name}]`, config, \"run\", true, (value) => {\n        return typeof value === \"function\";\n      });\n      validateProperty(`siteConfigs[${this.name}].modules[${name}]`, config, \"entry\", false, (value) => {\n        return typeof value === \"boolean\";\n      });\n      if (config.entry === void 0) {\n        config.entry = false;\n      }\n    }\n  };\n\n  // src/spacepackEverywhere.js\n  function getWebpackVersion(chunkObject) {\n    if (chunkObject instanceof Array) {\n      return \"modern\";\n    } else {\n      return \"legacy\";\n    }\n  }\n  var onChunkLoaded = function(webpackRequire) {\n    webpackRequire(\"spacepack\");\n  };\n  onChunkLoaded[0] = [\"spacepack\"];\n  onChunkLoaded[Symbol.iterator] = function() {\n    return {\n      read: false,\n      next() {\n        if (!this.read) {\n          this.read = true;\n          return { done: false, value: 0 };\n        } else {\n          return { done: true };\n        }\n      }\n    };\n  };\n  function pushSpacepack(chunkObjectName) {\n    const chunkObject = window[chunkObjectName];\n    if (chunkObject.__spacepack_everywhere_injected) {\n      return;\n    }\n    const version = getWebpackVersion(chunkObject);\n    console.log(\"[wpTools] Detected \" + chunkObjectName + \" using webpack \" + version);\n    switch (version) {\n      case \"modern\":\n        chunkObject.__spacepack_everywhere_injected = true;\n        chunkObject.push([[\"spacepack\"], { spacepack: getSpacepack(chunkObjectName, true) }, onChunkLoaded]);\n        break;\n    }\n  }\n  function spacepackEverywhere(config) {\n    if (config?.ignoreSites?.includes(window.location.host)) {\n      return;\n    }\n    for (const key of Object.getOwnPropertyNames(window)) {\n      if ((key.includes(\"webpackJsonp\") || key.includes(\"webpackChunk\") || key.includes(\"__LOADABLE_LOADED_CHUNKS__\")) && !key.startsWith(\"spacepack\") && !config?.ignoreChunkObjects?.includes(key)) {\n        pushSpacepack(key);\n      }\n    }\n  }\n\n  // src/entry/userscript.js\n  var globalConfig = window.__webpackTools_config;\n  delete window.__webpackTools_config;\n  var siteConfigs = /* @__PURE__ */ new Set();\n  for (let siteConfig of globalConfig.siteConfigs) {\n    if (siteConfig.matchSites?.includes(window.location.host)) {\n      siteConfigs.add(siteConfig);\n      break;\n    }\n  }\n  window.wpTools = {\n    globalConfig,\n    activeSiteConfigs: siteConfigs,\n    spacepackEverywhereDetect: () => {\n      spacepackEverywhere(globalConfig.spacepackEverywhere);\n    },\n    runtimes: {}\n  };\n  if (siteConfigs.size > 0) {\n    for (const siteConfig of siteConfigs) {\n      const patcher = new Patcher(siteConfig);\n      patcher.run();\n    }\n  } else if (globalConfig?.spacepackEverywhere?.enabled !== false) {\n    window.addEventListener(\"load\", () => {\n      spacepackEverywhere(globalConfig.spacepackEverywhere);\n    });\n  }\n})();\n\n//# sourceURL=wpTools";

        GM_addElement("script", {
            textContent: runtime,
        });

        //let jsonString = JSON.stringify(Phaser.Display.Canvas.CanvasPool.pool[0].parent.game.scene.scenes[1].stateManager.room.state);
        //console.log(jsonString);
        //定时两秒检查时否退出游戏
        setInterval(async() => {
            if(document.querySelector(`[class*="Intro_startbutton__"]`)) {
                if (document.querySelector(`[class*="Intro_smalllink__nJ3cG"]`)){
                    document.querySelector(`[class*="Intro_smalllink__nJ3cG"]`).click()
                    await new Promise(resolve => setTimeout(resolve, 1000))
                    const worldItem = document.querySelectorAll(`[class*="Intro_worldItem__"]`)
                    const index= Math.floor(Math.random()* (50 - 10 + 1)) + 10
                    worldItem[index].querySelector(`button[class*="pixel-button"]`).click()
                }
            }
        }, 5000);
        setInterval(() => {
            if(document.querySelector(`[class*="MuiDialog-paperWidthSm"][class*="commons_pixelbox__"]`)) {
                if(document.querySelector(`[class*="MuiDialog-paperWidthSm"][class*="commons_pixelbox__"]`).querySelector(`[class*="commons_pushbutton__"]`)) {
                    document.querySelector(`[class*="MuiDialog-paperWidthSm"][class*="commons_pixelbox__"]`).querySelector(`[class*="commons_pushbutton__"]`).click()
                }
            }
        }, 5000)


        let interval = setInterval(() => {
            //    console.log(unsafeWindow.pga);
            if (unsafeWindow.spacepack) {
                unsafeWindow._getPhaserEventEmitter = () => {
                    return spacepack.findByCode('phaserEventEmitter')[0].exports.ZP.phaserEventEmitter
                }
                unsafeWindow._emit = function () {
                    const emitter = unsafeWindow._getPhaserEventEmitter();
                    emitter.emit.call(emitter,...arguments)
                }
                unsafeWindow._joinMap = function(mapId){
                    unsafeWindow._emit('ROOM_WARP',{"mapId":mapId})
                }
                unsafeWindow._buy_store = function(){
                    unsafeWindow._emit('PRESENT_UI',{"ui":"marketplace"})
                }
                unsafeWindow._sell_store = function(){
                    unsafeWindow._emit('PRESENT_UI',{"ui":"marketplace-listings"})
                }
                unsafeWindow._bucksGalore = function(){
                    unsafeWindow._emit('PRESENT_UI',{"ui":"str_bucksGalore"})
                }
                unsafeWindow._petShop = function(){
                    unsafeWindow._emit('PRESENT_UI',{"ui":"str_petShop"})
                }
                unsafeWindow.move = function(x,y,vx = 0, vy = 0){
                    Phaser.Display.Canvas.CanvasPool.pool[0].parent.game.scene.scenes[length_scenes-1].selfPlayer.move({x:vx,y:vy},{x:x,y:y})
                }
                clearInterval(interval)
                console.log('inject')
                var Room = unsafeWindow.spacepack.findByCode('sendBytes')[0].exports.Room.prototype.constructor;
                var RoomPrototype = unsafeWindow.spacepack.findByCode('sendBytes')[0].exports.Room.prototype;
                let playSchemaSerializer = ''
                let selfPlayer = ''
                let start = false
                let energy = 0
                let map_list = []
                let self_farm = ''
                let self_farmInterior = ''
                let length_scenes=0
                let position_x = 0
                let position_y = 0
                let orders = []
                let apiary_map = ['pixelsNFTFarm-264','pixelsNFTFarm-541','pixelsNFTFarm-723','pixelsNFTFarm-997','pixelsNFTFarm-1350','pixelsNFTFarm-2127','pixelsNFTFarm-2778','pixelsNFTFarm-2921','pixelsNFTFarm-3041','pixelsNFTFarm-4076','pixelsNFTFarm-4081','pixelsNFTFarm-4200','pixelsNFTFarm-4449','pixelsNFTFarm-1629','pixelsNFTFarm-2123','pixelsNFTFarm-2655', 'pixelsNFTFarm-2072','pixelsNFTFarm-2074','pixelsNFTFarm-2780','pixelsNFTFarm-2781','pixelsNFTFarm-2782','pixelsNFTFarm-2784','pixelsNFTFarm-4025','pixelsNFTFarm-4027', 'pixelsNFTFarm-4172']
                let apiary_time = GM_getValue("apiary_time")
                if (!apiary_time){
                    apiary_time = {}
                }
                let ElementsName = []
                let cur_coins = 0
                let SaunaInterior_time = 0
                let bed_covers_time = 0
                let retain = {"Grainbow": 99, "Queen Bee":4, "Honey":99}
                let sell_info = ["Popberry", "Grainbow", "Queen Bee", "Honey", "Egg", "Eggsplosive", "Seltsam Egg","Whittlewood Log","Sap"]
                let bug_seed = ["Popberry Seeds", "Grainbow Seeds"]
                let bug_seed_item = {"Popberry Seeds": "itm_popberrySeeds", "Grainbow Seeds": "itm_grainseeds"}
                let buy_store_info = [{"itm":"itm_metalore_01","name":"Copperite Ore","quantity":90, "lt_quantity": 30},{"itm":"itm_popberrywine","name":"Popberry Wine","quantity":10, "lt_quantity": 4}]
                const originalOnMessage = RoomPrototype.onMessageCallback;
                const originaldispatchMessage = RoomPrototype.dispatchMessage;
                let slotArray = [];
                const originalSend = RoomPrototype.send;

                function senddata(action, data) {
                    let room_ws = unsafeWindow.Phaser.Display.Canvas.CanvasPool.pool[0].parent.game.scene.scenes[length_scenes-1].stateManager.room
                    console.log("%cwebsocket发送消息 : %c%s %c%s %c%s %c%s", "color:red;font-size:15px;", "color:blue;font-size:15px;", "参数5", "color:green;font-size:15px;", action, "color:purple;font-size:15px;", "参数6", "color:orange;font-size:15px;", JSON.stringify(data));
                    if (room_ws.connection.transport.isOpen) {
                        room_ws.connection.send(encryptUtils.encryptSend(action, data));
                    }

//                  RoomPrototype.connection.send(encryptUtils.encryptSend(action, data));
                }

                async function sleep(ms) {
                    return new Promise(resolve => setTimeout(resolve, ms));
                }

                function getRandomAround(value, floatRange) {
                    // 计算随机偏移量
                    const offset = Math.random() * floatRange * 2 - floatRange + Math.random() / 100;
                    // 返回随机值
                    return value + offset;
                }

                function generateMovePath(currentX, currentY, targetX, targetY, distance, floatRange) {
                    let mv_list = [];

                    while (currentX !== targetX || currentY !== targetY) {
                        let dx = Math.min(Math.abs(targetX - currentX), distance);
                        let dy = Math.min(Math.abs(targetY - currentY), distance);

                        let moveX = 0, moveY = 0;

                        if (currentX < targetX) {
                            moveX = Math.min(dx, getRandomAround(distance, floatRange));
                        } else if (currentX > targetX) {
                            moveX = -Math.min(dx, getRandomAround(distance, floatRange));
                        }

                        if (currentY < targetY) {
                            moveY = Math.min(dy, getRandomAround(distance, floatRange));
                        } else if (currentY > targetY) {
                            moveY = -Math.min(dy, getRandomAround(distance, floatRange));
                        }

                        currentX += moveX;
                        currentY += moveY;

                        let vx = moveX !== 0 ? moveX * 100 / dx : 0;
                        let vy = moveY !== 0 ? moveY * 100 / dy : 0;

                        mv_list.push({"x": currentX, "y": currentY, "vx": vx, "vy": vy});
                    }

                    return mv_list;
                }
                function distance(point1, point2) {
                    return Math.sqrt(Math.pow(point2.x - point1.x, 2) + Math.pow(point2.y - point1.y, 2));
                }

                function pointInRadius(point, points, radius) {
                    for (let i = 0; i < points.length; i++) {
                        if (distance(point, points[i]) < radius) {
                            return true;
                        }
                    }
                    return false;
                }
                async function move_distance(x, y, distance = 50, floatRange = 2, points=[]) {
                    const mv_list = generateMovePath(position_x, position_y, x, y, distance, floatRange)
                    for (const value of mv_list) {
                        await sleep(800)
                        if (!pointInRadius(value,points,100)){
                            await unsafeWindow.move(value["x"], value["y"], value["vx"], value["vy"])
                        }
                    }
                    position_x = x;
                    position_y = y;
                }

                function distance_sqrt(coord1, coord2) {
                    return Math.sqrt((coord1.x - coord2.x) ** 2 + (coord1.y - coord2.y) ** 2);
                }

                function findOptimalCenter(coords) {
                    let optimalCenter;
                    let maxCoverage = 0;
                    for (let key in coords) {
                        let withinRangeCount = 0;
                        for (let otherKey in coords) {
                            if (key !== otherKey && distance_sqrt(coords[key], coords[otherKey]) <= 300) {
                                withinRangeCount++;
                            }
                        }
                        if (withinRangeCount > maxCoverage) {
                            maxCoverage = withinRangeCount;
                            optimalCenter = key;
                        }
                    }

                    return optimalCenter;
                }
                const emitKeyboardEvent = (el, value) => {
                    if (!el)
                        return;
                    el.focus();
                    el.value = "";
                    document.execCommand("insertText", false, value);
//                     el.dispatchEvent(new Event("change", { bubbles: true }));
                };
                const updateMarketplaceSearchKeyword = (keyword) => {
                    const itemInputEl = document.querySelector(
                        `input[class*="Marketplace_filter"]`
                    );
                    emitKeyboardEvent(itemInputEl, keyword);
                };

                function findCenterAndRange(coords) {
                    let centerPoints = [];
                    let coordinates = {...coords};
                    while (Object.keys(coordinates).length > 0) {
                        let currentCenterKey = findOptimalCenter(coordinates);
                        if (!currentCenterKey) {
                            let key = Object.keys(coordinates)[0];
                            let center = coordinates[key];
                            centerPoints.push({center: center, withinRange: [key]});
                            delete coordinates[key];
                        } else {
                            let currentCenter = coordinates[currentCenterKey];
                            let withinRangeKeys = Object.keys(coordinates).filter(key => key !== currentCenterKey && distance_sqrt(currentCenter, coordinates[key]) <= 100);
                            centerPoints.push({center: currentCenter, withinRange: [currentCenterKey, ...withinRangeKeys]});
                            delete coordinates[currentCenterKey];
                            withinRangeKeys.forEach(key => delete coordinates[key]);
                        }
                    }
                    return centerPoints;
                }

                async function sendMssage() {
                    console.log("房间开始加载")
                    await sleep(10000);
                    while (!unsafeWindow.Phaser.Display.Canvas.CanvasPool.pool[0].parent.game.scene.scenes[length_scenes-1]){
                        console.log("test_canvas")
                        await sleep(3000);
                    }
                    length_scenes = unsafeWindow.Phaser.Display.Canvas.CanvasPool.pool[0].parent.game.scene.scenes.length
                    console.log("进入房间")
                    let room = unsafeWindow.Phaser.Display.Canvas.CanvasPool.pool[0].parent.game.scene.scenes[length_scenes-1].stateManager.room;
                    while (room){
                        // senddata('timerCheck', undefined)
                        await sleep(3000);
                        let state = unsafeWindow.Phaser.Display.Canvas.CanvasPool.pool[0].parent.game.scene.scenes[length_scenes-1].stateManager.room.state;
                        let player = unsafeWindow.Phaser.Display.Canvas.CanvasPool.pool[0].parent.game.scene.scenes[length_scenes-1].selfPlayer;
                        let entities = unsafeWindow.Phaser.Display.Canvas.CanvasPool.pool[0].parent.game.scene.scenes[length_scenes-1].entities;
                        let game = unsafeWindow.Phaser.Display.Canvas.CanvasPool.pool[0].parent.game;
                        selfPlayer = unsafeWindow.Phaser.Display.Canvas.CanvasPool.pool[0].parent.game.scene.scenes[length_scenes-1].stateManager.selfPlayer
                        energy = selfPlayer.energy.level;
                        var inventorySlots = selfPlayer.inventory.slots;
                        selfPlayer.farms.$items.forEach((value, key) => {
                            if (value.includes('shareRent')){
                                self_farm=value
                            }else if (value.includes('shareInterior')){
                                self_farmInterior=value
                            }
                        })
                        selfPlayer.coinInventory.$items.forEach((value, key) => {
                            if (value.currencyId === 'cur_coins') {
                                cur_coins = value.balance;
                            }
                        });

                        //背包物品
                        slotArray = Array.from(inventorySlots.entries()).map(([key, slotData]) => {
                            return {
                                slot: slotData.slot, item: slotData.item, quantity: slotData.quantity,
                            };
                        });
                        while(!player.body){
                            await sleep(1000)
                            player = unsafeWindow.Phaser.Display.Canvas.CanvasPool.pool[0].parent.game.scene.scenes[length_scenes-1].selfPlayer;
                        }
                        position_x = player.body.position.x
                        position_y = player.body.position.y
                        const mapId = state.id
                        if(mapId!==self_farm&&(!map_list.includes(self_farm))&&self_farm!=''){
                            map_list.push(self_farm)
                        }
                        console.log(position_x, position_y, SaunaInterior_time, bed_covers_time, state.id)
                        if (state.id.includes("shareRent")) {
                            let apiary_time_bool = false
                            let gostore=false

                            const axeItem = slotArray.find(item => item.item.includes('itm_axe'));
                            entities = unsafeWindow.Phaser.Display.Canvas.CanvasPool.pool[0].parent.game.scene.scenes[length_scenes-1].entities;
                            console.log(playSchemaSerializer, entities)
                            for (const [key, value] of entities) {
                                if(value.gameEntity&&value.gameEntity&&(value.gameEntity.id.includes('ent_treeLand2')||value.gameEntity.id.includes('ent_treeWater2')||value.gameEntity.id.includes('ent_treeSpace2'))){
                                    if (energy < 30 ) {
                                        gostore = true
                                    }
                                    if (gostore){
                                            break;
                                    }
                                    // console.log('ent_mine_test',value.generic.state,value.mapEntity_id,key)
                                    while (true){
                                        if (gostore){
                                            break;
                                        }
                                        if (value.currentState.state === 'mature'){
                                            if (axeItem){
                                                await move_distance(value.propCache.position.x+100,value.propCache.position.y+160)
                                                await sleep(1000).then(() => {
                                                    senddata("ui", { "id": axeItem.item, "type": "entity", "slot": axeItem.slot, "mid": key });
                                                });
                                            }
                                        }else {
                                            break
                                        }
                                    }

                                }
                                else if(value.gameEntity&&(value.gameEntity.id.includes('ent_treeLand1')||value.gameEntity.id.includes('ent_treeWater1')||value.gameEntity.id.includes('ent_treeSpace1'))){
                                    if (energy < 30 ) {
                                        gostore = true
                                    }
                                    if (gostore){
                                            break;
                                    }
                                    // console.log('ent_mine_test',value.generic.state,value.mapEntity_id,key)
                                    while (true){
                                        if (gostore){
                                            break;
                                        }
                                        if (value.currentState.state === 'mature'){
                                            if (axeItem){
                                                await move_distance(value.propCache.position.x+100,value.propCache.position.y+160)
                                                await sleep(1000).then(() => {
                                                    senddata("ui", { "id": axeItem.item, "type": "entity", "slot": axeItem.slot, "mid": key });
                                                });
                                            }
                                        }else {
                                            break
                                        }
                                    }

                                }

                            }
                            senddata('timerCheck', undefined)
                            await sleep(3000)
                            entities = unsafeWindow.Phaser.Display.Canvas.CanvasPool.pool[0].parent.game.scene.scenes[length_scenes-1].entities;
                            for (const [key, value] of entities) {
                                if (value.gameEntity&&(value.gameEntity.id==='ent_sap'||value.gameEntity.id==='ent_wood_01'||value.gameEntity.id==='itm_woodlog_02')){
                                    await move_distance(value.propCache.position.x,value.propCache.position.y)
                                    await sleep(1000)
                                }
                            }
                            senddata('timerCheck', undefined)
                            await sleep(3000)
                            entities = unsafeWindow.Phaser.Display.Canvas.CanvasPool.pool[0].parent.game.scene.scenes[length_scenes-1].entities;
                            for (const [key, value] of entities) {
                                if (value.gameEntity&&(value.gameEntity.id==='ent_sap'||value.gameEntity.id==='ent_wood_01'||value.gameEntity.id==='itm_woodlog_02')){
                                    await sleep(1000).then(() => { senddata("clickEntity", { "mid": key, "entity": value.gameEntity.id, "impact": "collide" }) });
                                    await sleep(1000).then(() => { senddata("clickEntity", { "mid": key, "entity": value.gameEntity.id, "impact": "magneto" }) });
                                }
                            }
                            
                            if (!room.connection.transport.isOpen) {
                                return;
                            }

                            for (let key in apiary_time){
                                if (apiary_time[key] < new Date().getTime()){
                                    apiary_time_bool = true
                                }
                            }
                            if (Object.keys(apiary_time).length != apiary_map.length){
                                apiary_time_bool = true
                            }
                            if(slotArray.length>=35){
                                gostore = true
                            }
                            if ((SaunaInterior_time>0 && Math.abs(new Date().getTime() > SaunaInterior_time) && energy<100)||(SaunaInterior_time===0 && energy< 100)){
                                map_list.unshift("SaunaInterior")
                            }else if (apiary_time_bool){
                                const result = apiary_map.filter(item => !Object.keys(apiary_time).includes(item))
                                if (result.length>0){
                                    Array.prototype.unshift.apply(map_list, result);
                                }
                                for (let key in apiary_time){
                                    if (apiary_time[key] < new Date().getTime()){
                                        map_list.unshift(key)
                                        break;
                                    }
                                }
                            }
                            if (!apiary_time_bool){
                                const result = apiary_map.filter(item => !Object.keys(apiary_time).includes(item))
                                if (result.length>0){
                                    Array.prototype.unshift.apply(map_list, result);
                                }
                                for (let key in apiary_time){
                                    if (apiary_time[key] < new Date().getTime()){
                                        if(!map_list.includes(key)){
                                            map_list.unshift(key)
                                            break;
                                        }
                                    }
                                }
                            }
                            if ((map_list.length===1 && map_list.includes(self_farm))|| map_list.length===0){
                                map_list.unshift("generalStore")
                                map_list.unshift("terravilla")
                                map_list.unshift(self_farmInterior)
                            }
                            if (map_list.length>0){
                                const mapid = map_list.shift()
                                unsafeWindow._joinMap(mapid)
                            }else{
                                unsafeWindow._joinMap(self_farm)
                            }
                        }
                        else if (state.id.includes("shareInterior")){
                            orders = []
                            entities = unsafeWindow.Phaser.Display.Canvas.CanvasPool.pool[0].parent.game.scene.scenes[length_scenes-1].entities;
                            let info = {'shop_sign':{},'stove':{},'bed_covers':{}}
                            let dream = true
                            for (const [key,value] of entities) {
                                if (value.gameEntity&&value.gameEntity.id==='ent_shop_sign'){
                                    info['shop_sign'][key]={'x':value.propCache.position.x,'y':value.propCache.position.y}
                                    if (room.connection.transport.isOpen){
                                        senddata('clickEntity',{"mid":key,"entity":value.entity,"impact":"click","inputs":[value.propCache.position.x,value.propCache.position.y]})

                                    }
                                }else if (value.gameEntity&&value.gameEntity.id === 'ent_stove'){
                                    info['stove'][key]={'x':value.propCache.position.x,'y':value.propCache.position.y}
                                }else if (value.gameEntity&&value.gameEntity.id === 'ent_bed_covers'){
                                    info['bed_covers'] = {'x':value.propCache.position.x,'y':value.propCache.position.y}
                                    if ((value.currentState.displayInfo.utcTarget === 0)&&((bed_covers_time>0 && Math.abs(new Date().getTime() > bed_covers_time) && energy<600)||(bed_covers_time===0 && energy< 600))){
                                        await move_distance(info['bed_covers']['x'], info['bed_covers']['y'])
                                        dream = false
                                        if (mapId.includes('shareInterior')){
                                            senddata("clickEntity", { "mid": key, "entity": "ent_bed_covers", "impact": "click", "inputs": [info['bed_covers']['x'], info['bed_covers']['y']] });
                                            return
                                        }
                                    }else {
                                        bed_covers_time = parseInt(value.currentState.displayInfo.utcTarget)
                                    }
                                }
                            }
                            await sleep(8000)
                            while (orders.length<=0){
                                await sleep(3000)
                            }
                            let nonDisabledElements = Array.from(document.querySelectorAll('[class*="Store_btn-max__"]')).filter(element => (!element.hasAttribute('disabled') && element.textContent!='Get VIP'));
                            while (nonDisabledElements.length>0){
                                await sleep(3000)
                                nonDisabledElements.forEach(element => {
                                    element.click();
                                });
                                if (nonDisabledElements.length>0){
                                    await sleep(30000)
                                }
                                let istask = true

                                while(istask){
                                    istask = false
                                    for (let index = 0; index < orders.length; index++) {
                                        const order = orders[index];
                                        if (order.completedAt) {
                                            istask = true;
                                            await sleep(5000)
                                            break;
                                        }
                                    }
                                }
                                nonDisabledElements = Array.from(document.querySelectorAll('[class*="Store_btn-max__"]')).filter(element => (!element.hasAttribute('disabled') && element.textContent!='Get VIP'));
                            }
                            ElementsName = Array.from(document.querySelectorAll('[class*="Store_card-title__"]')).map(div => div.textContent);
                            console.log(ElementsName)
                            console.log(orders)
                            await sleep(3000)
                            const Store_box_cannel = document.querySelector('div[class*="Store_box__"]').querySelector('button[class*="commons_closeBtn__"]');
                            Store_box_cannel.click();
                            if (ElementsName.length>0){
                                if (!map_list.includes("generalStore")){
                                    map_list.unshift("generalStore")
                                    map_list.unshift("terravilla")
                                }
                            }
                            if (!room.connection.transport.isOpen) {
                                return
                            }
                            if(map_list.length>0&&dream){
                                const mapid = map_list.shift()
                                unsafeWindow._joinMap(mapid)
                            }else{
                                unsafeWindow._joinMap(self_farm)
                            }

                        }
                        else if(state.id.includes("terravilla")){
                            entities = unsafeWindow.Phaser.Display.Canvas.CanvasPool.pool[0].parent.game.scene.scenes[length_scenes-1].entities;
                            let info = {'ent_apiary':{},'ent_coop':{}}
                            for (const [key, value] of entities) {
                                if (value.gameEntity&&value.gameEntity.id ==='ent_apiary'){
                                    if (value.currentState.state === 'ready'){
                                        await move_distance(value.propCache.position.x+60,value.propCache.position.y+100)
                                        if (!room.connection.transport.isOpen) {
                                                return;
                                        }
                                        senddata("clickEntity", {"impact": "click", "type": "ent_apiary", "mid": key, "inputs": [value.propCache.position.x,value.propCache.position.y]})

                                    }else if (value.currentState.state === 'loaded'){
                                        await sleep(1000)
                                    }else{
                                        info['ent_apiary'][key]=[value.propCache.position.x,value.propCache.position.y]
                                    }
                                }
                                else if (value.gameEntity&&value.gameEntity.id ==='ent_coop'){
                                    if (value.currentState.state === '2egg'){
                                        unsafeWindow.move(value.propCache.position.x,value.propCache.position.y)
                                        if (!room.connection.transport.isOpen) {
                                                return;
                                        }
                                        senddata("clickEntity", {"impact": "click", "type": "ent_coop", "mid": key, "inputs": [value.propCache.position.x,value.propCache.position.y]})

                                    }else if (value.currentState.state === '2chicken'){
                                        console.log(value.currentState.displayInfo.utcTarget)
                                    }else if (value.currentState.state === '1egg'){
                                        unsafeWindow.move(value.propCache.position.x,value.propCache.position.y)
                                        if (!room.connection.transport.isOpen) {
                                                return;
                                        }
                                        senddata("clickEntity", {"impact": "click", "type": "ent_coop", "mid": key, "inputs": [value.propCache.position.x,value.propCache.position.y]})
                                        let coop_quantity= 0
                                        let coop_solt_num= 0
                                        slotArray.forEach(slotData => {
                                            if (slotData.item === 'itm_hen') {
                                                coop_quantity=slotData.quantity
                                                coop_solt_num = slotData.slot
                                            }
                                        })
                                        if (coop_quantity>0){
                                            if (!room.connection.transport.isOpen) {
                                                return;
                                            }
                                            await sleep(1000).then(() => {
                                                senddata("ui", {"id": "itm_hen", "type": "entity", "slot": coop_solt_num, "mid": key})
                                            });
                                        }
                                    }else if (value.currentState.state === '1chicken'){
                                        let coop_quantity= 0
                                        let coop_solt_num= 0
                                        slotArray.forEach(slotData => {
                                            if (slotData.item === 'itm_hen') {
                                                coop_quantity=slotData.quantity
                                                coop_solt_num = slotData.slot
                                            }
                                        })
                                        if (coop_quantity>0){
                                            await move_distance(value.propCache.position.x,value.propCache.position.y)
                                            if (!room.connection.transport.isOpen) {
                                                return;
                                            }
                                            senddata("ui", {"id": "itm_hen", "type": "entity", "slot": coop_solt_num, "mid": key})
                                        }
                                    }else{
                                        info['ent_coop'][key]=[value.propCache.position.x,value.propCache.position.y]
                                    }
                                }
                                else if (value.gameEntity&&value.gameEntity.id ==="ent_metalworking_01"){
                                    const getCurrentItemCount = (item_info) => {
                                        return slotArray.reduce((count, slot) => {
                                            return count + (slot.item === item_info ? slot.quantity : 0);
                                        }, 0);
                                    };
                                    let metalore = getCurrentItemCount('itm_metalore_01');
                                    let screw = getCurrentItemCount('itm_screw');
                                    if (metalore>0&&screw<30){
                                        if (value.currentState.state === 'loaded') {
                                            await move_distance(value.propCache.position.x, value.propCache.position.y)
                                            senddata("clickEntity", {"impact": "click", "type": "ent_metalworking_01", "mid": key, "inputs": [value.propCache.position.x,value.propCache.position.y]})
                                            await sleep(2000);
                                            while(!document.querySelector('div[class*="Crafting_craftPages__"]')){
                                                await sleep(1000);
                                            }
                                            const item =  Array.from(document.querySelectorAll('div[class*="Crafting_craftingRecipeItem__"]'))
                                            const Index = item.findIndex(el => el.querySelector('span').textContent.trim() === 'Copperite Screw')
                                            item[Index].click()
                                            await sleep(1000)
                                            console.log("制作铁钉", key);
                                            document.querySelector('button[class*="Crafting_craftingButton__"]').click()
                                            document.querySelector('button[class*="Crafting_craftingCloseButton__"]').click()
                                        } else if (value.currentState.state === 'ready') {
                                            await move_distance(value.propCache.position.x, value.propCache.position.y)
                                            senddata("clickEntity", {"impact": "click", "type": "ent_metalworking_01", "mid": key, "inputs": [value.propCache.position.x,value.propCache.position.y]})
                                            await sleep(2000);
                                            senddata("clickEntity", {"impact": "click", "type": "ent_metalworking_01", "mid": key, "inputs": [value.propCache.position.x,value.propCache.position.y]})
                                            await sleep(2000);
                                            while(!document.querySelector('div[class*="Crafting_craftPages__"]')){
                                                await sleep(1000);
                                            }
                                            const item =  Array.from(document.querySelectorAll('div[class*="Crafting_craftingRecipeItem__"]'))
                                            const Index = item.findIndex(el => el.querySelector('span').textContent.trim() === 'Copperite Screw')
                                            item[Index].click()
                                            await sleep(1000)
                                            document.querySelector('button[class*="Crafting_craftingButton__"]').click()
                                            document.querySelector('button[class*="Crafting_craftingCloseButton__"]').click()
                                        }
                                    }

                                }
                                else if (value.propCache&&value.propCache.element ==="ent_trash"){
                                    const wax = slotArray.find(item => item.item.includes('itm_beeswax'));
                                    if (wax){
                                        await move_distance(value.propCache.position.x,value.propCache.position.y)
                                        if (!room.connection.transport.isOpen) {
                                                return;
                                        }
                                        senddata("swapOrCombineInventorySlots",{"targetIndex":1,"targetContainer":key,"sourceIndex":wax.slot})
                                        await sleep(10000)
                                    }
                                }
                            }
                            if (Object.keys(info['ent_apiary']).length>0){
                                let quantity=0
                                let solt_num = 0
                                let deposit_bee = []
                                slotArray.forEach(slotData => {
                                    if (slotData.item === 'itm_queenbee') {
                                        quantity=slotData.quantity
                                        solt_num = slotData.slot
                                    }
                                })
                                for (const key in info['ent_apiary']){
                                    if (quantity>0){
                                        quantity = quantity - 1
                                        await sleep(1000).then(() => {
                                            deposit_bee.push(key)
                                            if (!room.connection.transport.isOpen) {
                                                return;
                                            }
                                            senddata("ui", {"id": "itm_queenbee", "type": "entity", "slot": solt_num, "mid": key})
                                        });
                                    }
                                }
                                deposit_bee.filter(item =>delete info['ent_apiary'][item])
                            }
//                             await move_distance(3492, 3000)
                            await sleep(3000)
                            if(map_list.length>0){
                                const mapid = map_list.shift()
                                unsafeWindow._joinMap(mapid)
                            }else{
                                unsafeWindow._joinMap(self_farm)
                            }
                        }
                        else if(state.id.includes("generalStore")){
                            await move_distance(3000,2450,80,3)
                            unsafeWindow._sell_store()
                            await sleep(2000)
                            let remove_results_bool=true
                            while(remove_results_bool){
                                remove_results_bool = false
                                const remove_allMarketplaceListings = Array.from(document.querySelector('div[class*="MarketplaceListings_content__"]').querySelector('div[class*="commons_scrollArea__"]').querySelectorAll('div[class*="MarketplaceListings_listing__"]'));
                                const remove_filteredMarketplaceListings = remove_allMarketplaceListings.slice(1);
                                const remove_results = remove_filteredMarketplaceListings.map(listing => {
                                    const removeButton = listing.querySelector('button[class*="MarketplaceListings_remove__"]');
                                    return { removeButton };
                                });
                                for(const result of remove_results){
                                    result['removeButton'].click()
                                    remove_results_bool=true
                                    break;
                                }
                                await sleep(2000)
                            }

                            let sell_bos = true
                            while(sell_bos){
                                await sleep(2000)
                                sell_bos = false
                                const Create = Array.from(document.querySelectorAll('button[class*="Infiniportal_tabButton__"]')).filter(element => element.textContent.trim() === 'Create');
                                Create[0].click()
                                await sleep(2000)
                                const allMarketplaceListings = Array.from(document.querySelectorAll('div[class*="MarketplaceListings_listing__"]'));
                                const filteredMarketplaceListings = allMarketplaceListings.slice(1);
                                const results = filteredMarketplaceListings.map(listing => {
                                    const listingName = listing.querySelector('div[class*="MarketplaceListings_itemName__"]').querySelector('span').textContent.trim();
                                    const listingQuantity = listing.querySelector('div[class*="MarketplaceListings_listingQuantity__"]').textContent.trim();
                                    const removeButton = listing.querySelector('button[class*="MarketplaceListings_remove__"]');

                                    return { listingName, listingQuantity, removeButton };
                                });
                                const retain_list = Object.keys(retain)
                                for(const result of results){
                                    let Quantity = 0
                                    if (sell_info.includes(result['listingName'])){
                                        if(retain_list.includes(result['listingName'])){

                                            Quantity = result['listingQuantity']-retain[result['listingName']]

                                        }else {
                                            Quantity = result['listingQuantity']
                                        }
                                        if (Quantity>0){
                                            result['removeButton'].click()
                                            await sleep(3000)
                                            const MarketplaceAddListing = document.querySelector('div[class*="MarketplaceAddListing_container__"]')
                                            const AddListing = MarketplaceAddListing.querySelector('div[class*="MarketplaceAddListing_props__"]')
                                            const price = Array.from(AddListing.querySelector('div[class*="MarketplaceAddListing_listinginfo__"]').querySelectorAll('span'))[1].textContent
                                            const price_quantity_input = Array.from(AddListing.querySelectorAll('div[class*="MarketplaceAddListing_prop__"]')).slice(1);
                                            emitKeyboardEvent(price_quantity_input[0].querySelector('input'), price)
                                            emitKeyboardEvent(price_quantity_input[1].querySelector('input'), Quantity)
                                            await sleep(1000)
                                            const removeButton = MarketplaceAddListing.querySelector('button[class*="MarketplaceAddListing_button__"]');
                                            removeButton.click()
                                            sell_bos = true
                                            break;
                                        }
                                    }
                                }
                            }
                            const MarketplaceListing = document.querySelector('div[class*="MarketplaceListings_container__"]').querySelector('button[class*="commons_closeBtn__"]')
                            MarketplaceListing.click()

                            await move_distance(3180,2450,80,3)
                            unsafeWindow._buy_store()
                            await sleep(5000)
                            let id = 0
                            let count = 0
                            let knapsack = JSON.parse(JSON.stringify(slotArray))
                            const getCurrentItemCount = (item_info) => {
                                return slotArray.reduce((count, slot) => {
                                    return count + (slot.item === item_info ? slot.quantity : 0);
                                }, 0);
                            };
                            while (ElementsName.length>0){
                                const name = ElementsName.shift()
                                console.log(name)
                                let itemId = orders[id]['request']['itemId'];
                                let amount = orders[id]['request']['quantity'];
                                let currencyId = orders[id]['reward']['currency']['currencyId']
                                let currency_amount = orders[id]['reward']['currency']['amount']
                                let skillType = orders[id]['reward']['skill']['skillType']
                                if (name === 'Copperite Screw'||(skillType==='cooking')){
                                    id = id+1
                                    continue;
                                }
                                const item_result = knapsack.find(item => item.item === itemId)
                                if (item_result){
                                    amount = amount-item_result['quantity']
                                }
                                if (amount<=0){
                                    id = id+1
                                    continue;
                                }
                                while(Array.from(document.querySelectorAll('[class*="Marketplace_itemName__"]'))<=0){
                                    await sleep(2000)
                                }
                                updateMarketplaceSearchKeyword(name)
                                await sleep(1000)
                                const Index = Array.from(document.querySelectorAll('[class*="Marketplace_itemName__"]')).findIndex(el => el.textContent === name);
                                if (!room.connection.transport.isOpen) {
                                    return;
                                }
                                const item = Array.from(document.querySelectorAll('[class*="Marketplace_viewListings__"]'))
                                item[Index].click()
                                await sleep(3000)
                                if (!room.connection.transport.isOpen) {
                                    return;
                                }
                                const elements = Array.from(document.querySelectorAll('button[class*="MarketplaceItemListings_buyListing__"]')).filter(element => element.textContent.trim() === 'Automatic Buy');
                                elements[0].click()
                                await sleep(3000)
                                if (!room.connection.transport.isOpen) {
                                    return;
                                }
                                const Listings_amount = Array.from(document.querySelectorAll('div[class*="MarketplaceItemListings_amount__"]'));
                                const Listings_amount_input=Listings_amount[0].querySelector('input')
                                const Listings_price_input=Listings_amount[1].querySelector('input').value
                                emitKeyboardEvent(Listings_amount_input, amount)
                                if (Listings_price_input*amount-parseInt(currency_amount)>5000&&currencyId==='cur_coins'){
                                    await sleep(2000)
                                    const Marketplace_buyContainer_cannel = document.querySelector('div[class*="MarketplaceItemListings_container__"]').querySelector('button[class*="commons_closeBtn__"]');
                                    Marketplace_buyContainer_cannel.click();
                                    id = id+1
                                    continue;
                                }

                                const Listings_button_div = document.querySelector('div[class*="MarketplaceItemListings_buttons__"]');
                                const Listings_button =Array.from(Listings_button_div.querySelectorAll('button[class*="MarketplaceItemListings_buyListing__"]'))
                                Listings_button[0].click()
                                await sleep(2000)
                                if (!room.connection.transport.isOpen) {
                                    return;
                                }
                                let Marketplace_buyContainer = document.querySelector('div[class*="Marketplace_buyContainer__"]');
                                while(!Marketplace_buyContainer){
                                    await sleep(3000)
                                    if (!room.connection.transport.isOpen) {
                                        return;
                                    }
                                    Marketplace_buyContainer = document.querySelector('div[class*="Marketplace_buyContainer__"]');
                                    if (count>10){
                                        break;
                                    }
                                    count = count + 1
                                }
                                if (Marketplace_buyContainer){
                                    Marketplace_buyContainer.querySelector('button[class*="Marketplace_button__"]').click();
                                    await sleep(3000)
                                    if (!room.connection.transport.isOpen) {
                                        return;
                                    }
                                }
                                const Marketplace_buyContainer_cannel = document.querySelector('div[class*="MarketplaceItemListings_container__"]').querySelector('button[class*="commons_closeBtn__"]');
                                Marketplace_buyContainer_cannel.click();
                                await sleep(3000)
                                if (!room.connection.transport.isOpen) {
                                    return;
                                }
                                id = id+1
                                count = 0
                            }
                            for (let items of buy_store_info){
                                let metalore = getCurrentItemCount(items.itm);
                                if (metalore < items.lt_quantity){
                                    const name =items.name
                                    const amount = items.quantity-metalore
                                    updateMarketplaceSearchKeyword(name)
                                    await sleep(1000)
                                    const Index = Array.from(document.querySelectorAll('[class*="Marketplace_itemName__"]')).findIndex(el => el.textContent === name);
                                    if (!room.connection.transport.isOpen) {
                                        return;
                                    }
                                    const item = Array.from(document.querySelectorAll('[class*="Marketplace_viewListings__"]'))
                                    item[Index].click()
                                    await sleep(3000)
                                    if (!room.connection.transport.isOpen) {
                                        return;
                                    }
                                    const elements = Array.from(document.querySelectorAll('button[class*="MarketplaceItemListings_buyListing__"]')).filter(element => element.textContent.trim() === 'Automatic Buy');
                                    elements[0].click()
                                    await sleep(3000)
                                    if (!room.connection.transport.isOpen) {
                                        return;
                                    }
                                    const Listings_amount = Array.from(document.querySelectorAll('div[class*="MarketplaceItemListings_amount__"]'));
                                    const Listings_amount_input=Listings_amount[0].querySelector('input')
                                    const Listings_price_input=Listings_amount[1].querySelector('input').value
                                    emitKeyboardEvent(Listings_amount_input, amount)
                                    const Listings_button_div = document.querySelector('div[class*="MarketplaceItemListings_buttons__"]');
                                    const Listings_button =Array.from(Listings_button_div.querySelectorAll('button[class*="MarketplaceItemListings_buyListing__"]'))
                                    Listings_button[0].click()
                                    await sleep(2000)
                                    if (!room.connection.transport.isOpen) {
                                        return;
                                    }
                                    let Marketplace_buyContainer = document.querySelector('div[class*="Marketplace_buyContainer__"]');
                                    while(!Marketplace_buyContainer){
                                        await sleep(3000)
                                        if (!room.connection.transport.isOpen) {
                                            return;
                                        }
                                        Marketplace_buyContainer = document.querySelector('div[class*="Marketplace_buyContainer__"]');
                                        if (count>10){
                                            break;
                                        }
                                        count = count + 1
                                    }
                                    if (Marketplace_buyContainer){
                                        Marketplace_buyContainer.querySelector('button[class*="Marketplace_button__"]').click();
                                        await sleep(3000)
                                        if (!room.connection.transport.isOpen) {
                                            return;
                                        }
                                    }
                                    const Marketplace_buyContainer_cannel = document.querySelector('div[class*="MarketplaceItemListings_container__"]').querySelector('button[class*="commons_closeBtn__"]');
                                    Marketplace_buyContainer_cannel.click();
                                    await sleep(3000)
                                    if (!room.connection.transport.isOpen) {
                                        return;
                                    }
                                }
                            }

                            const Marketplace_Container_cannel = document.querySelector('div[class*="Marketplace_container__"]').querySelector('button[class*="commons_closeBtn__"]');
                            Marketplace_Container_cannel.click();

                            await move_distance(3100,2900,80,3)
                            unsafeWindow._bucksGalore()
                            await sleep(2000)
                            const allMarketplaceListings = Array.from(document.querySelectorAll('div[class*="Store_store-item-container__"]'));
                            const results = allMarketplaceListings.map(listing => {
                                const button = listing.querySelector('div[class*="Store_card-content__"]')
                                const title = button.querySelector('div[class*="Store_card-title__"]').textContent.trim();
                                const price = listing.querySelector('div[class*="Store_item-price__"]').querySelector('span').textContent.trim();
                                return { title, price, button };
                            });
                            knapsack = JSON.parse(JSON.stringify(slotArray))
                            for (const result of results){
                                if (bug_seed.includes(result['title'])){
                                    const item_result = getCurrentItemCount(bug_seed_item[result['title']])
                                    if (item_result){
                                        if (item_result<99){
                                            result['button'].click()
                                            await sleep(1000)
                                            let div_buy = document.querySelector('div[class*="Store_buy-section__"]')
                                            let count = 0
                                            while(!div_buy){
                                                div_buy = document.querySelector('div[class*="Store_buy-section__"]')
                                                await sleep(1000)
                                                if (count>10){
                                                    break;
                                                }
                                                count = count + 1
                                            }
                                            if (div_buy){
                                                const buy_amount_input=div_buy.querySelector('input[class*="Store_quantity-input__"]')
                                                emitKeyboardEvent(buy_amount_input, 99-item_result)
                                                await sleep(2000)
                                                const buy_button=div_buy.querySelector('button[class*="Store_buy-btn__"]')
                                                buy_button.click()
                                                await sleep(2000)
                                            }
                                        }
                                    }else{
                                        result['button'].click()
                                        await sleep(1000)
                                        let div_buy = document.querySelector('div[class*="Store_buy-section__"]')
                                        let count = 0
                                        while(!div_buy){
                                            div_buy = document.querySelector('div[class*="Store_buy-section__"]')
                                            await sleep(1000)
                                            if (count>10){
                                                break;
                                            }
                                            count = count + 1
                                        }
                                        if (div_buy){
                                            const buy_amount_input=div_buy.querySelector('input[class*="Store_quantity-input__"]')
                                            emitKeyboardEvent(buy_amount_input, 297)
                                            await sleep(2000)
                                            const buy_button=div_buy.querySelector('button[class*="Store_buy-btn__"]')
                                            buy_button.click()
                                            await sleep(2000)
                                        }
                                    }
                                }
                            }

                            const Store_modal_cannel = document.querySelector('div[class*="Store_modal-box-container__"]').querySelector('button[class*="commons_closeBtn__"]');
                            Store_modal_cannel.click();
                            await sleep(2000)
                            const Mail_box = document.querySelector('button[class*="Hud_mailbox__"]')
                            if (Mail_box.querySelector("span")){
                                Mail_box.click();
                                await sleep(2000)
                                const MailBox_container = document.querySelector('div[class*="MailBox_container__"]')
                                while(MailBox_container.querySelectorAll('div[class*="MailBox_mailboxItemWrapper__"]').length<=0){
                                    await sleep(2000)
                                }
                                const mailboxItem = MailBox_container.querySelectorAll('div[class*="MailBox_mailboxItemWrapper__"]')
                                const mailboxItemAll =mailboxItem[0].querySelector('button[class*="MailBox_collectAllButton__"]');
                                if (mailboxItemAll){
                                    mailboxItemAll.click()
                                    await sleep(2000)
                                }else{
                                    const mailboxItemcollect =mailboxItem[0].querySelector('button[class*="MailBox_collectButton__"]');
                                    mailboxItemcollect.click()
                                    await sleep(2000)
                                }
                                MailBox_container.querySelector('button[class*="commons_closeBtn__"]').click();
                            }
                            await sleep(4000)
                            const queenbee = getCurrentItemCount('itm_queenbee')
                            if (queenbee<4&&cur_coins>1000){
                                map_list.unshift("petsInterior")
                                map_list.unshift("terravilla")
                            }

                            await sleep(2000)
                            if(map_list.length>0){
                                const mapid = map_list.shift()
                                unsafeWindow._joinMap(mapid)
                            }else{
                                unsafeWindow._joinMap(self_farm)
                            }

                        }
                        else if(state.id.includes("SaunaInterior")){
                            entities = unsafeWindow.Phaser.Display.Canvas.CanvasPool.pool[0].parent.game.scene.scenes[length_scenes-1].entities;
                            for (const [key, value] of entities) {
                                if (value.gameEntity&&value.gameEntity.id === 'ent_saunarocks_charger'){
                                    // await move_distance(3001, 2688)
                                    if (value.currentState.displayInfo.utcTarget === 0&&mapId.includes('SaunaInterior')){
                                        senddata("clickEntity", {
                                            "mid": key,
                                            "entity": "ent_saunarocks_charger",
                                            "impact": "click",
                                            "inputs": [3001.5, 2688]
                                        });
                                    }else {
                                        SaunaInterior_time = parseInt(value.currentState.displayInfo.utcTarget)
                                    }

                                    // this.closeConnection()
                                }else if (value.gameEntity&&value.gameEntity.id === 'ent_saunaenergy') {
                                    if (mapId.includes('SaunaInterior')){
                                        senddata("clickEntity", {"mid": key, "entity": "ent_saunaenergy", "impact": "collide"});
                                    }

                                }
                            }
                            await sleep(3000)
                            for (const [key, value] of entities) {
                                if (value.gameEntity&&value.gameEntity.id === 'ent_saunarocks_charger'){
                                    // await move_distance(3001, 2688)
                                    if (value.currentState.displayInfo.utcTarget === 0&&mapId.includes('SaunaInterior')){
                                        senddata("clickEntity", {
                                            "mid": key,
                                            "entity": "ent_saunarocks_charger",
                                            "impact": "click",
                                            "inputs": [3001.5, 2688]
                                        });
                                    }else {
                                        SaunaInterior_time = parseInt(value.currentState.displayInfo.utcTarget)
                                    }

                                    // this.closeConnection()
                                }else if (value.gameEntity&&value.gameEntity.id === 'ent_saunaenergy') {
                                    if (mapId.includes('SaunaInterior')){
                                        senddata("clickEntity", {"mid": key, "entity": "ent_saunaenergy", "impact": "collide"});
                                    }

                                }
                            }
                            if(map_list.length>0){
                                const mapid = map_list.shift()
                                unsafeWindow._joinMap(mapid)
                            }else{
                                unsafeWindow._joinMap(self_farm)
                            }
                        }
                        else if(state.id.includes("pixelsNFTFarm")){
                            if (energy < 20 ) {
                                while (true){
                                    await sleep(1000)
                                    const winItems = slotArray.filter(item => item.item==='itm_popberrywine');
                                    winItems.sort((a, b) => a.quantity - b.quantity);
                                    if (winItems.length>0){
                                        senddata('ui',{"id":winItems[0]['item'],"type":"self","slot":winItems[0]['slot']})
                                        await sleep(2000)
                                        if (energy > 70){
                                            break
                                        }
                                    }else {
                                        break
                                    }
                                }
                            }
                            let info = {'ent_apiary':{},'ent_coop':{}}
                            let collect_time = new Date().getTime()+45*60*1000
                            entities = unsafeWindow.Phaser.Display.Canvas.CanvasPool.pool[0].parent.game.scene.scenes[length_scenes-1].entities;
                            let saunaportal = []
                            for (const [key, value] of entities) {
                                if (value.gameEntity&&value.gameEntity.id ==='ent_saunaportal'){
                                    saunaportal.push({"x":value.propCache.position.x,"y":value.propCache.position.y})
                                }

                            }
                            for (const [key, value] of entities) {
                                if (value.gameEntity&&value.gameEntity.id ==='ent_apiary'){
                                    if (value.currentState.state === 'ready'){
                                        collect_time = new Date().getTime()+45*60*1000
                                        await move_distance(value.propCache.position.x+60,value.propCache.position.y+100,50,2,saunaportal)
                                        if (!room.connection.transport.isOpen) {
                                                return;
                                        }
                                        senddata("clickEntity", {"impact": "click", "type": "ent_apiary", "mid": key, "inputs": [value.propCache.position.x,value.propCache.position.y]})

                                    }else if (value.currentState.state === 'loaded'){
                                        await sleep(1000)
                                        collect_time = value.currentState.displayInfo.utcTarget

                                    }else{
                                        info['ent_apiary'][key]=[value.propCache.position.x,value.propCache.position.y]
                                    }
                                }
                                else if (value.gameEntity&&value.gameEntity.id ==='ent_coop'){
                                    if (value.currentState.state === '2egg'){
                                        unsafeWindow.move(value.propCache.position.x,value.propCache.position.y)
                                        if (!room.connection.transport.isOpen) {
                                                return;
                                        }
                                        senddata("clickEntity", {"impact": "click", "type": "ent_coop", "mid": key, "inputs": [value.propCache.position.x,value.propCache.position.y]})

                                    }else if (value.currentState.state === '2chicken'){
                                        console.log(value.currentState.displayInfo.utcTarget)
                                    }else if (value.currentState.state === '1egg'){
                                        unsafeWindow.move(value.propCache.position.x,value.propCache.position.y)
                                        if (!room.connection.transport.isOpen) {
                                                return;
                                        }
                                        senddata("clickEntity", {"impact": "click", "type": "ent_coop", "mid": key, "inputs": [value.propCache.position.x,value.propCache.position.y]})
                                        let coop_quantity= 0
                                        let coop_solt_num= 0
                                        slotArray.forEach(slotData => {
                                            if (slotData.item === 'itm_hen') {
                                                coop_quantity=slotData.quantity
                                                coop_solt_num = slotData.slot
                                            }
                                        })
                                        if (coop_quantity>0){
                                            if (!room.connection.transport.isOpen) {
                                                return;
                                            }
                                            await sleep(1000).then(() => {
                                                senddata("ui", {"id": "itm_hen", "type": "entity", "slot": coop_solt_num, "mid": key})
                                            });
                                        }
                                    }else if (value.currentState.state === '1chicken'){
                                        let coop_quantity= 0
                                        let coop_solt_num= 0
                                        slotArray.forEach(slotData => {
                                            if (slotData.item === 'itm_hen') {
                                                coop_quantity=slotData.quantity
                                                coop_solt_num = slotData.slot
                                            }
                                        })
                                        if (coop_quantity>0){
                                            await move_distance(value.propCache.position.x,value.propCache.position.y,50,2,saunaportal)
                                            if (!room.connection.transport.isOpen) {
                                                return;
                                            }
                                            senddata("ui", {"id": "itm_hen", "type": "entity", "slot": coop_solt_num, "mid": key})
                                        }
                                    }else{
                                        info['ent_coop'][key]=[value.propCache.position.x,value.propCache.position.y]
                                    }
                                }
                            }
                            if (Object.keys(info['ent_apiary']).length>0){
                                let quantity=0
                                let solt_num = 0
                                let deposit_bee = []
                                slotArray.forEach(slotData => {
                                    if (slotData.item === 'itm_queenbee') {
                                        quantity=slotData.quantity
                                        solt_num = slotData.slot
                                    }
                                })
                                for (const key in info['ent_apiary']){
                                    if (quantity>0){
                                        quantity = quantity - 1
                                        await sleep(1000).then(() => {
                                            deposit_bee.push(key)
                                            // console.log("存放蜜蜂")
                                            collect_time = new Date().getTime()+45*60*1000
                                            if (!room.connection.transport.isOpen) {
                                                return;
                                            }
                                            senddata("ui", {"id": "itm_queenbee", "type": "entity", "slot": solt_num, "mid": key})
                                        });
                                    }
                                }
                                deposit_bee.filter(item =>delete info['ent_apiary'][item])
                            }
                            apiary_time[state.id] = collect_time
                            console.log(apiary_time)
                            GM_setValue("apiary_time",apiary_time)
                            for (let key in apiary_time){
                                if (apiary_time[key] < new Date().getTime() && key!=mapId){
                                    if(!map_list.includes(key)){
                                        map_list.unshift(key)
                                        break;
                                    }
                                }
                            }
                            await sleep(3000)
                            console.log(map_list)
                            if(map_list.length>0){
                                const mapid = map_list.shift()
                                unsafeWindow._joinMap(mapid)
                            }else{
                                unsafeWindow._joinMap(self_farm)
                            }
                        }
                        else if (state.id.includes('petsInterior')){
                            unsafeWindow._petShop()
                            await sleep(2000)
                            const allMarketplaceListings = Array.from(document.querySelectorAll('div[class*="Store_store-item-container__"]'));
                            const results = allMarketplaceListings.map(listing => {
                                const button = listing.querySelector('div[class*="Store_card-content__"]')
                                const title = button.querySelector('div[class*="Store_card-title__"]').textContent.trim();
                                const price = listing.querySelector('div[class*="Store_item-price__"]').querySelector('span').textContent.trim();
                                return { title, price, button };
                            });
                            const getCurrentItemCount = (item_info) => {
                                return slotArray.reduce((count, slot) => {
                                    return count + (slot.item === item_info ? slot.quantity : 0);
                                }, 0);
                            };
                            const knapsack = JSON.parse(JSON.stringify(slotArray))
                            const item_result = getCurrentItemCount('itm_queenbee')
                            if (item_result<4&&cur_coins>1000){
                                let amout = 0
                                const item = results.find(item => item.title === "Queen Bee")
                                if (cur_coins>1000*(4-item_result)){
                                    amout = (4-item_result)
                                }else{
                                    amout = Math.floor(cur_coins/1000)
                                }
                                item['button'].click()
                                await sleep(1000)
                                const div_pet_buy = document.querySelector('div[class*="Store_buy-section__"]')
                                await sleep(1000)
                                const buy_pet_amount_input=div_pet_buy.querySelector('input[class*="Store_quantity-input__"]')
                                emitKeyboardEvent(buy_pet_amount_input, amout)
                                await sleep(2000)
                                const pet_buy_button=div_pet_buy.querySelector('button[class*="Store_buy-btn__"]')
                                pet_buy_button.click()
                                await sleep(2000)
                                const petStore_modal_cannel = document.querySelector('div[class*="Store_modal-box-container__"]').querySelector('button[class*="commons_closeBtn__"]');
                                petStore_modal_cannel.click();
                            }
                            await sleep(3000)
                            if(map_list.length>0){
                                const mapid = map_list.shift()
                                unsafeWindow._joinMap(mapid)
                            }else{
                                unsafeWindow._joinMap(self_farm)
                            }
                        }
                        else {

                        }
                        await sleep(3000);
                        room = unsafeWindow.Phaser.Display.Canvas.CanvasPool.pool[0].parent.game.scene.scenes[length_scenes-1].stateManager.room
                        if(room){
                            break;
                        }
                    }
                }

//                 RoomPrototype.onMessageCallback = function (m) {
//                     let R = Array.from(new Uint8Array(m.data))
//                     let C = W.decode.number(R, {
//                         offset: 1
//                     })
//                     let T = W.decode.string(R, {
//                         offset: 1
//                     });
//                     console.log("websocket 接收消息: 字符串解密结果:", T, "number解密结果:", C);
//                     // 调用原始的方法
//                     originalOnMessage.call(this, m);
//                 }

                RoomPrototype.dispatchMessage = function (m, R) {
                    var C;
                    let T = RoomPrototype.getMessageHandlerKey(m);
                    switch (T) {
                        case 'joinRoom':
                            sendMssage();
                            break;
                        case 'sellOrders':
                            length_scenes = unsafeWindow.Phaser.Display.Canvas.CanvasPool.pool[0].parent.game.scene.scenes.length
                            playSchemaSerializer = unsafeWindow.Phaser.Display.Canvas.CanvasPool.pool[0].parent.game.scene.scenes[length_scenes-1].stateManager.playerSerializer
                            playSchemaSerializer.patch(R)
                            orders = R['str_taskBoard_01']['orders'];
                            break;
                        case 'updatePlayer':
                            length_scenes = unsafeWindow.Phaser.Display.Canvas.CanvasPool.pool[0].parent.game.scene.scenes.length
                            selfPlayer = unsafeWindow.Phaser.Display.Canvas.CanvasPool.pool[0].parent.game.scene.scenes[length_scenes-1].stateManager.selfPlayer
                            if (selfPlayer){
                                energy = selfPlayer.energy.level;
                                var inventorySlots = selfPlayer.inventory.slots;
                                selfPlayer.farms.$items.forEach((value, key) => {
                                    if (value.includes('shareRent')){
                                        self_farm=value
                                    }else if (value.includes('shareInterior')){
                                        self_farmInterior=value
                                    }
                                })
                                selfPlayer.coinInventory.$items.forEach((value, key) => {
                                    if (value.currencyId === 'cur_coins') {
                                        cur_coins = value.balance;
                                    }
                                });

                                //背包物品
                                slotArray = Array.from(inventorySlots.entries()).map(([key, slotData]) => {
                                    return {
                                        slot: slotData.slot, item: slotData.item, quantity: slotData.quantity,
                                    };
                                });
                            }
                            break;
                    }
                    originaldispatchMessage.call(this, m, R);
                }
                //重写 Room.prototype.send 方法
//                 RoomPrototype.send = function (message, options) {
//                     let state = unsafeWindow.Phaser.Display.Canvas.CanvasPool.pool[0].parent.game.scene.scenes[1].stateManager.room.state;
//                     //console.log(unsafeWindow.Phaser.Display.Canvas.CanvasPool.pool[0].parent.game.scene.scenes[1].entities);
//                     console.log("HOME", state.id);

//                     let actionArray = []
//                     actionArray.push([message, JSON.stringify(options)]);
//                     let id = 0;
//                     console.log("action动作列表：", actionArray, this);
//                     for (const action of actionArray) {
//                         id++;
//                         setTimeout(() => {
//                             message = action[0];
//                             console.log("%cwebsocket发送消息 : %c%s %c%s %c%s %c%s", "color:red;font-size:15px;", "color:blue;font-size:15px;", "参数3", "color:green;font-size:15px;", message, "color:purple;font-size:15px;", "参数4", "color:orange;font-size:15px;", action[1]);
//                             if (action[1] === undefined) {
//                                 originalSend.call(this, message, action[1]);
//                             } else {
//                                 //console.log("send_message",message,typeof JSON.parse(action[1]))
//                                 originalSend.call(this, message, JSON.parse(action[1]));
//                             }
//                         }, 1200 * id);
//                     }
//                 };

                // 重写 Room.prototype.send 方法
//                 RoomPrototype.sendBytes = function (message, options) {
//                     // 打印参数
//                     // 调用原始的方法
//                     console.log("%cwebsocket发送消息 bytes方法 : %c%s %c%s %c%s %c%s", "color:red;font-size:15px;", "color:blue;font-size:15px;", "参数1", "color:green;font-size:15px;", message, "color:purple;font-size:15px;", "参数2", "color:orange;font-size:15px;", JSON.stringify(options));
//                     originalSend.call(Room.prototype.send, message, options);
//                 };
            }

        }, 100)
    }

)();