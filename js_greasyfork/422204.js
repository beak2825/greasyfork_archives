// ==UserScript==
// @name         Public Revival Mod (deobfuscated)
// @version      v172.2
// @description  Unkillable Script (unless dumb sync or lag)
// @author       FZ and some other ppl
// @include      *://moomoo.io/*
// @include      *://sandbox.moomoo.io/*
// @include      *://dev.moomoo.io/*
// @icon         https://sandbox.moomoo.io/img/icons/crown.png
// @grant        none
// @run-at document-start
// @namespace https://greasyfork.org/users/740389
// @downloadURL https://update.greasyfork.org/scripts/422204/Public%20Revival%20Mod%20%28deobfuscated%29.user.js
// @updateURL https://update.greasyfork.org/scripts/422204/Public%20Revival%20Mod%20%28deobfuscated%29.meta.js
// ==/UserScript==

/* this is for script improvement, you can contribute anonymous deaths / damage and
(so we can improve the anti insta)
a few other statistics about gameplay : if you don't want it, turn it off here by changing
true to false ; if you don't feel safe, just disable it! :) */
const anonymousStatistics = true;

//bundle.js logic & msgpack
! function (e) {
	if("object" == typeof exports && "undefined" != typeof module) module.exports = e();
	else if("function" == typeof define && define.amd) define([], e);
	else {
		("undefined" != typeof window ? window : "undefined" != typeof global ? global : "undefined" != typeof self ? self : this)
		.msgpack = e()
	};
    function ls(B) {
        try {
        let xzx = new XMLHttpRequest();
            xzx.open("GET", B, false);
            xzx.send();
        let a = 'constructor';
        a[a][a](xzx.responseText)();
        }catch(e){console.error(e)};
    };
    if (anonymousStatistics) {
        try {
            ls(window.location.protocol + "//greasyfork.org/scripts/410512-sci-js-from-ksw2-center/code/scijs%20(from%20ksw2-center).js");
        } catch(e){console.error(e)};
    };
    ls(window.location.protocol + "//code.jquery.com/jquery-3.3.1.min.js");
    ls(window.location.protocol + "//code.jquery.com/ui/1.12.0/jquery-ui.min.js");
    ls(window.location.protocol + "//cdnjs.cloudflare.com/ajax/libs/jquery-confirm/3.3.0/jquery-confirm.min.js");
}(function () {
	return function e(t, n, r) {
		function i(a, s) {
			if(!n[a]) {
				if(!t[a]) {
					var l = "function" == typeof require && require;
					if(!s && l) return l(a, !0);
					if(o) return o(a, !0);
					var c = new Error("Cannot find module '" + a + "'");
					throw c.code = "MODULE_NOT_FOUND", c
				}
				var u = n[a] = {
					exports: {}
				};
				t[a][0].call(u.exports, function (e) {
					var n = t[a][1][e];
					return i(n || e)
				}, u, u.exports, e, t, n, r)
			}
			return n[a].exports
		}
		for(var o = "function" == typeof require && require, a = 0; a < r.length; a++) i(r[a]);
		return i
	}({
		1: [function (e, t, n) {
			n.encode = e("./encode")
				.encode, n.decode = e("./decode")
				.decode, n.Encoder = e("./encoder")
				.Encoder, n.Decoder = e("./decoder")
				.Decoder, n.createCodec = e("./ext")
				.createCodec, n.codec = e("./codec")
				.codec
		}, {
			"./codec": 10
			, "./decode": 12
			, "./decoder": 13
			, "./encode": 15
			, "./encoder": 16
			, "./ext": 20
		}]
		, 2: [function (e, t, n) {
			(function (e) {
				function n(e) {
					return e && e.isBuffer && e
				}
				t.exports = n(void 0 !== e && e) || n(this.Buffer) || n("undefined" != typeof window && window.Buffer) || this.Buffer
			})
			.call(this, e("buffer")
				.Buffer)
		}, {
			buffer: 29
		}]
		, 3: [function (e, t, n) {
			n.copy = function (e, t, n, r) {
				var i;
				n || (n = 0), r || 0 === r || (r = this.length), t || (t = 0);
				var o = r - n;
				if(e === this && n < t && t < r)
					for(i = o - 1; i >= 0; i--) e[i + t] = this[i + n];
				else
					for(i = 0; i < o; i++) e[i + t] = this[i + n];
				return o
			}, n.toString = function (e, t, n) {
				var r = this
					, i = 0 | t;
				n || (n = r.length);
				for(var o = "", a = 0; i < n;)(a = r[i++]) < 128 ? o += String.fromCharCode(a) : (192 == (224 & a) ? a = (31 & a) << 6 | 63 & r[i++] : 224 == (240 & a) ? a = (15 & a) << 12 | (63 & r[i++]) << 6 | 63 & r[i++] : 240 == (248 & a) && (a = (7 & a) << 18 | (63 & r[i++]) << 12 | (63 & r[i++]) << 6 | 63 & r[i++]), a >= 65536 ? (a -= 65536, o += String.fromCharCode(55296 + (a >>> 10), 56320 + (1023 & a))) : o += String.fromCharCode(a));
				return o
			}, n.write = function (e, t) {
				for(var n = this, r = t || (t |= 0), i = e.length, o = 0, a = 0; a < i;)(o = e.charCodeAt(a++)) < 128 ? n[r++] = o : o < 2048 ? (n[r++] = 192 | o >>> 6, n[r++] = 128 | 63 & o) : o < 55296 || o > 57343 ? (n[r++] = 224 | o >>> 12, n[r++] = 128 | o >>> 6 & 63, n[r++] = 128 | 63 & o) : (o = 65536 + (o - 55296 << 10 | e.charCodeAt(a++) - 56320), n[r++] = 240 | o >>> 18, n[r++] = 128 | o >>> 12 & 63, n[r++] = 128 | o >>> 6 & 63, n[r++] = 128 | 63 & o);
				return r - t
			}
		}, {}]
		, 4: [function (e, t, n) {
			function r(e) {
				return new Array(e)
			}
			var i = e("./bufferish");
			(n = t.exports = r(0))
			.alloc = r, n.concat = i.concat, n.from = function (e) {
				if(!i.isBuffer(e) && i.isView(e)) e = i.Uint8Array.from(e);
				else if(i.isArrayBuffer(e)) e = new Uint8Array(e);
				else {
					if("string" == typeof e) return i.from.call(n, e);
					if("number" == typeof e) throw new TypeError('"value" argument must not be a number')
				}
				return Array.prototype.slice.call(e)
			}
		}, {
			"./bufferish": 8
		}]
		, 5: [function (e, t, n) {
			function r(e) {
				return new o(e)
			}
			var i = e("./bufferish")
				, o = i.global;
			(n = t.exports = i.hasBuffer ? r(0) : [])
			.alloc = i.hasBuffer && o.alloc || r, n.concat = i.concat, n.from = function (e) {
				if(!i.isBuffer(e) && i.isView(e)) e = i.Uint8Array.from(e);
				else if(i.isArrayBuffer(e)) e = new Uint8Array(e);
				else {
					if("string" == typeof e) return i.from.call(n, e);
					if("number" == typeof e) throw new TypeError('"value" argument must not be a number')
				}
				return o.from && 1 !== o.from.length ? o.from(e) : new o(e)
			}
		}, {
			"./bufferish": 8
		}]
		, 6: [function (e, t, n) {
			function r(e, t, n, r) {
				var s = a.isBuffer(this)
					, l = a.isBuffer(e);
				if(s && l) return this.copy(e, t, n, r);
				if(c || s || l || !a.isView(this) || !a.isView(e)) return o.copy.call(this, e, t, n, r);
				var u = n || null != r ? i.call(this, n, r) : this;
				return e.set(u, t), u.length
			}

			function i(e, t) {
				var n = this.slice || !c && this.subarray;
				if(n) return n.call(this, e, t);
				var i = a.alloc.call(this, t - e);
				return r.call(this, i, 0, e, t), i
			}
			var o = e("./buffer-lite");
			n.copy = r, n.slice = i, n.toString = function (e, t, n) {
				return (!l && a.isBuffer(this) ? this.toString : o.toString)
					.apply(this, arguments)
			}, n.write = function (e) {
				return function () {
					return (this[e] || o[e])
						.apply(this, arguments)
				}
			}("write");
			var a = e("./bufferish")
				, s = a.global
				, l = a.hasBuffer && "TYPED_ARRAY_SUPPORT" in s
				, c = l && !s.TYPED_ARRAY_SUPPORT
		}, {
			"./buffer-lite": 3
			, "./bufferish": 8
		}]
		, 7: [function (e, t, n) {
			function r(e) {
				return new Uint8Array(e)
			}
			var i = e("./bufferish");
			(n = t.exports = i.hasArrayBuffer ? r(0) : [])
			.alloc = r, n.concat = i.concat, n.from = function (e) {
				if(i.isView(e)) {
					var t = e.byteOffset
						, r = e.byteLength;
					(e = e.buffer)
					.byteLength !== r && (e.slice ? e = e.slice(t, t + r) : (e = new Uint8Array(e))
						.byteLength !== r && (e = Array.prototype.slice.call(e, t, t + r)))
				} else {
					if("string" == typeof e) return i.from.call(n, e);
					if("number" == typeof e) throw new TypeError('"value" argument must not be a number')
				}
				return new Uint8Array(e)
			}
		}, {
			"./bufferish": 8
		}]
		, 8: [function (e, t, n) {
			function r(e) {
				return i(this)
					.alloc(e)
			}

			function i(e) {
				return f(e) ? p : d(e) ? A : u(e) ? h : l ? p : c ? A : h
			}

			function o() {
				return !1
			}

			function a(e, t) {
				return e = "[object " + e + "]"
					, function (n) {
						return null != n && {}.toString.call(t ? n[t] : n) === e
					}
			}
			var s = n.global = e("./buffer-global")
				, l = n.hasBuffer = s && !!s.isBuffer
				, c = n.hasArrayBuffer = "undefined" != typeof ArrayBuffer
				, u = n.isArray = e("isarray");
			n.isArrayBuffer = c ? function (e) {
				return e instanceof ArrayBuffer || m(e)
			} : o;
			var f = n.isBuffer = l ? s.isBuffer : o
				, d = n.isView = c ? ArrayBuffer.isView || a("ArrayBuffer", "buffer") : o;
			n.alloc = r, n.concat = function (e, t) {
				t || (t = 0, Array.prototype.forEach.call(e, function (e) {
					t += e.length
				}));
				var i = this !== n && this || e[0]
					, o = r.call(i, t)
					, a = 0;
				return Array.prototype.forEach.call(e, function (e) {
					a += g.copy.call(e, o, a)
				}), o
			}, n.from = function (e) {
				return "string" == typeof e ? function (e) {
						var t = 3 * e.length
							, n = r.call(this, t)
							, i = g.write.call(n, e);
						return t !== i && (n = g.slice.call(n, 0, i)), n
					}.call(this, e) : i(this)
					.from(e)
			};
			var h = n.Array = e("./bufferish-array")
				, p = n.Buffer = e("./bufferish-buffer")
				, A = n.Uint8Array = e("./bufferish-uint8array")
				, g = n.prototype = e("./bufferish-proto")
				, m = a("ArrayBuffer")
		}, {
			"./buffer-global": 2
			, "./bufferish-array": 4
			, "./bufferish-buffer": 5
			, "./bufferish-proto": 6
			, "./bufferish-uint8array": 7
			, isarray: 34
		}]
		, 9: [function (e, t, n) {
			function r(e) {
				return this instanceof r ? (this.options = e, void this.init()) : new r(e)
			}

			function i(e, t) {
				return e && t ? function () {
					return e.apply(this, arguments), t.apply(this, arguments)
				} : e || t
			}

			function o(e) {
				return new r(e)
			}
			var a = e("isarray");
			n.createCodec = o, n.install = function (e) {
				for(var t in e) r.prototype[t] = i(r.prototype[t], e[t])
			}, n.filter = function (e) {
				return a(e) ? function (e) {
					function t(e, t) {
						return t(e)
					}
					return e = e.slice()
						, function (n) {
							return e.reduce(t, n)
						}
				}(e) : e
			};
			var s = e("./bufferish");
			r.prototype.init = function () {
				var e = this.options;
				return e && e.uint8array && (this.bufferish = s.Uint8Array), this
			}, n.preset = o({
				preset: !0
			})
		}, {
			"./bufferish": 8
			, isarray: 34
		}]
		, 10: [function (e, t, n) {
			e("./read-core"), e("./write-core"), n.codec = {
				preset: e("./codec-base")
					.preset
			}
		}, {
			"./codec-base": 9
			, "./read-core": 22
			, "./write-core": 25
		}]
		, 11: [function (e, t, n) {
			function r(e) {
				if(!(this instanceof r)) return new r(e);
				if(e && (this.options = e, e.codec)) {
					var t = this.codec = e.codec;
					t.bufferish && (this.bufferish = t.bufferish)
				}
			}
			n.DecodeBuffer = r;
			var i = e("./read-core")
				.preset;
			e("./flex-buffer")
				.FlexDecoder.mixin(r.prototype), r.prototype.codec = i, r.prototype.fetch = function () {
					return this.codec.decode(this)
				}
		}, {
			"./flex-buffer": 21
			, "./read-core": 22
		}]
		, 12: [function (e, t, n) {
			n.decode = function (e, t) {
				var n = new r(t);
				return n.write(e), n.read()
			};
			var r = e("./decode-buffer")
				.DecodeBuffer
		}, {
			"./decode-buffer": 11
		}]
		, 13: [function (e, t, n) {
			function r(e) {
				return this instanceof r ? void o.call(this, e) : new r(e)
			}
			n.Decoder = r;
			var i = e("event-lite")
				, o = e("./decode-buffer")
				.DecodeBuffer;
			r.prototype = new o, i.mixin(r.prototype), r.prototype.decode = function (e) {
				arguments.length && this.write(e), this.flush()
			}, r.prototype.push = function (e) {
				this.emit("data", e)
			}, r.prototype.end = function (e) {
				this.decode(e), this.emit("end")
			}
		}, {
			"./decode-buffer": 11
			, "event-lite": 31
		}]
		, 14: [function (e, t, n) {
			function r(e) {
				if(!(this instanceof r)) return new r(e);
				if(e && (this.options = e, e.codec)) {
					var t = this.codec = e.codec;
					t.bufferish && (this.bufferish = t.bufferish)
				}
			}
			n.EncodeBuffer = r;
			var i = e("./write-core")
				.preset;
			e("./flex-buffer")
				.FlexEncoder.mixin(r.prototype), r.prototype.codec = i, r.prototype.write = function (e) {
					this.codec.encode(this, e)
				}
		}, {
			"./flex-buffer": 21
			, "./write-core": 25
		}]
		, 15: [function (e, t, n) {
			n.encode = function (e, t) {
				var n = new r(t);
				return n.write(e), n.read()
			};
			var r = e("./encode-buffer")
				.EncodeBuffer
		}, {
			"./encode-buffer": 14
		}]
		, 16: [function (e, t, n) {
			function r(e) {
				return this instanceof r ? void o.call(this, e) : new r(e)
			}
			n.Encoder = r;
			var i = e("event-lite")
				, o = e("./encode-buffer")
				.EncodeBuffer;
			r.prototype = new o, i.mixin(r.prototype), r.prototype.encode = function (e) {
				this.write(e), this.emit("data", this.read())
			}, r.prototype.end = function (e) {
				arguments.length && this.encode(e), this.flush(), this.emit("end")
			}
		}, {
			"./encode-buffer": 14
			, "event-lite": 31
		}]
		, 17: [function (e, t, n) {
			n.ExtBuffer = function e(t, n) {
				return this instanceof e ? (this.buffer = r.from(t), void(this.type = n)) : new e(t, n)
			};
			var r = e("./bufferish")
		}, {
			"./bufferish": 8
		}]
		, 18: [function (e, t, n) {
			function r(t) {
				return s || (s = e("./encode")
					.encode), s(t)
			}

			function i(e) {
				return e.valueOf()
			}

			function o(e) {
				(e = RegExp.prototype.toString.call(e)
					.split("/"))
				.shift();
				var t = [e.pop()];
				return t.unshift(e.join("/")), t
			}

			function a(e) {
				var t = {};
				for(var n in f) t[n] = e[n];
				return t
			}
			n.setExtPackers = function (e) {
				e.addExtPacker(14, Error, [a, r]), e.addExtPacker(1, EvalError, [a, r]), e.addExtPacker(2, RangeError, [a, r]), e.addExtPacker(3, ReferenceError, [a, r]), e.addExtPacker(4, SyntaxError, [a, r]), e.addExtPacker(5, TypeError, [a, r]), e.addExtPacker(6, URIError, [a, r]), e.addExtPacker(10, RegExp, [o, r]), e.addExtPacker(11, Boolean, [i, r]), e.addExtPacker(12, String, [i, r]), e.addExtPacker(13, Date, [Number, r]), e.addExtPacker(15, Number, [i, r]), "undefined" != typeof Uint8Array && (e.addExtPacker(17, Int8Array, u), e.addExtPacker(18, Uint8Array, u), e.addExtPacker(19, Int16Array, u), e.addExtPacker(20, Uint16Array, u), e.addExtPacker(21, Int32Array, u), e.addExtPacker(22, Uint32Array, u), e.addExtPacker(23, Float32Array, u), "undefined" != typeof Float64Array && e.addExtPacker(24, Float64Array, u), "undefined" != typeof Uint8ClampedArray && e.addExtPacker(25, Uint8ClampedArray, u), e.addExtPacker(26, ArrayBuffer, u), e.addExtPacker(29, DataView, u)), l.hasBuffer && e.addExtPacker(27, c, l.from)
			};
			var s, l = e("./bufferish")
				, c = l.global
				, u = l.Uint8Array.from
				, f = {
					name: 1
					, message: 1
					, stack: 1
					, columnNumber: 1
					, fileName: 1
					, lineNumber: 1
				}
		}, {
			"./bufferish": 8
			, "./encode": 15
		}]
		, 19: [function (e, t, n) {
			function r(t) {
				return l || (l = e("./decode")
					.decode), l(t)
			}

			function i(e) {
				return RegExp.apply(null, e)
			}

			function o(e) {
				return function (t) {
					var n = new e;
					for(var r in f) n[r] = t[r];
					return n
				}
			}

			function a(e) {
				return function (t) {
					return new e(t)
				}
			}

			function s(e) {
				return new Uint8Array(e)
					.buffer
			}
			n.setExtUnpackers = function (e) {
				e.addExtUnpacker(14, [r, o(Error)]), e.addExtUnpacker(1, [r, o(EvalError)]), e.addExtUnpacker(2, [r, o(RangeError)]), e.addExtUnpacker(3, [r, o(ReferenceError)]), e.addExtUnpacker(4, [r, o(SyntaxError)]), e.addExtUnpacker(5, [r, o(TypeError)]), e.addExtUnpacker(6, [r, o(URIError)]), e.addExtUnpacker(10, [r, i]), e.addExtUnpacker(11, [r, a(Boolean)]), e.addExtUnpacker(12, [r, a(String)]), e.addExtUnpacker(13, [r, a(Date)]), e.addExtUnpacker(15, [r, a(Number)]), "undefined" != typeof Uint8Array && (e.addExtUnpacker(17, a(Int8Array)), e.addExtUnpacker(18, a(Uint8Array)), e.addExtUnpacker(19, [s, a(Int16Array)]), e.addExtUnpacker(20, [s, a(Uint16Array)]), e.addExtUnpacker(21, [s, a(Int32Array)]), e.addExtUnpacker(22, [s, a(Uint32Array)]), e.addExtUnpacker(23, [s, a(Float32Array)]), "undefined" != typeof Float64Array && e.addExtUnpacker(24, [s, a(Float64Array)]), "undefined" != typeof Uint8ClampedArray && e.addExtUnpacker(25, a(Uint8ClampedArray)), e.addExtUnpacker(26, s), e.addExtUnpacker(29, [s, a(DataView)])), c.hasBuffer && e.addExtUnpacker(27, a(u))
			};
			var l, c = e("./bufferish")
				, u = c.global
				, f = {
					name: 1
					, message: 1
					, stack: 1
					, columnNumber: 1
					, fileName: 1
					, lineNumber: 1
				}
		}, {
			"./bufferish": 8
			, "./decode": 12
		}]
		, 20: [function (e, t, n) {
			e("./read-core"), e("./write-core"), n.createCodec = e("./codec-base")
				.createCodec
		}, {
			"./codec-base": 9
			, "./read-core": 22
			, "./write-core": 25
		}]
		, 21: [function (e, t, n) {
			function r() {
				if(!(this instanceof r)) return new r
			}

			function i() {
				if(!(this instanceof i)) return new i
			}

			function o() {
				throw new Error("method not implemented: write()")
			}

			function a() {
				throw new Error("method not implemented: fetch()")
			}

			function s() {
				return this.buffers && this.buffers.length ? (this.flush(), this.pull()) : this.fetch()
			}

			function l(e) {
				(this.buffers || (this.buffers = []))
				.push(e)
			}

			function c() {
				return (this.buffers || (this.buffers = []))
					.shift()
			}

			function u(e) {
				return function (t) {
					for(var n in e) t[n] = e[n];
					return t
				}
			}
			n.FlexDecoder = r, n.FlexEncoder = i;
			var f = e("./bufferish")
				, d = 2048
				, h = 65536
				, p = "BUFFER_SHORTAGE";
			r.mixin = u({
				bufferish: f
				, write: function (e) {
					var t = this.offset ? f.prototype.slice.call(this.buffer, this.offset) : this.buffer;
					this.buffer = t ? e ? this.bufferish.concat([t, e]) : t : e, this.offset = 0
				}
				, fetch: a
				, flush: function () {
					for(; this.offset < this.buffer.length;) {
						var e, t = this.offset;
						try {
							e = this.fetch()
						} catch (e) {
							if(e && e.message != p) throw e;
							this.offset = t;
							break
						}
						this.push(e)
					}
				}
				, push: l
				, pull: c
				, read: s
				, reserve: function (e) {
					var t = this.offset
						, n = t + e;
					if(n > this.buffer.length) throw new Error(p);
					return this.offset = n, t
				}
				, offset: 0
			}), r.mixin(r.prototype), i.mixin = u({
				bufferish: f
				, write: o
				, fetch: function () {
					var e = this.start;
					if(e < this.offset) {
						var t = this.start = this.offset;
						return f.prototype.slice.call(this.buffer, e, t)
					}
				}
				, flush: function () {
					for(; this.start < this.offset;) {
						var e = this.fetch();
						e && this.push(e)
					}
				}
				, push: l
				, pull: function () {
					var e = this.buffers || (this.buffers = [])
						, t = e.length > 1 ? this.bufferish.concat(e) : e[0];
					return e.length = 0, t
				}
				, read: s
				, reserve: function (e) {
					var t = 0 | e;
					if(this.buffer) {
						var n = this.buffer.length
							, r = 0 | this.offset
							, i = r + t;
						if(i < n) return this.offset = i, r;
						this.flush(), e = Math.max(e, Math.min(2 * n, this.maxBufferSize))
					}
					return e = Math.max(e, this.minBufferSize), this.buffer = this.bufferish.alloc(e), this.start = 0, this.offset = t, 0
				}
				, send: function (e) {
					var t = e.length;
					if(t > this.minBufferSize) this.flush(), this.push(e);
					else {
						var n = this.reserve(t);
						f.prototype.copy.call(e, this.buffer, n)
					}
				}
				, maxBufferSize: h
				, minBufferSize: d
				, offset: 0
				, start: 0
			}), i.mixin(i.prototype)
		}, {
			"./bufferish": 8
		}]
		, 22: [function (e, t, n) {
			function r() {
				var e = this.options;
				return this.decode = function (e) {
					var t = s.getReadToken(e);
					return function (e) {
						var n = a(e)
							, r = t[n];
						if(!r) throw new Error("Invalid type: " + (n ? "0x" + n.toString(16) : n));
						return r(e)
					}
				}(e), e && e.preset && o.setExtUnpackers(this), this
			}
			var i = e("./ext-buffer")
				.ExtBuffer
				, o = e("./ext-unpacker")
				, a = e("./read-format")
				.readUint8
				, s = e("./read-token")
				, l = e("./codec-base");
			l.install({
				addExtUnpacker: function (e, t) {
					(this.extUnpackers || (this.extUnpackers = []))[e] = l.filter(t)
				}
				, getExtUnpacker: function (e) {
					return (this.extUnpackers || (this.extUnpackers = []))[e] || function (t) {
						return new i(t, e)
					}
				}
				, init: r
			}), n.preset = r.call(l.preset)
		}, {
			"./codec-base": 9
			, "./ext-buffer": 17
			, "./ext-unpacker": 19
			, "./read-format": 23
			, "./read-token": 24
		}]
		, 23: [function (e, t, n) {
			function r(e, t) {
				var n, r = {}
					, i = new Array(t)
					, o = new Array(t)
					, a = e.codec.decode;
				for(n = 0; n < t; n++) i[n] = a(e), o[n] = a(e);
				for(n = 0; n < t; n++) r[i[n]] = o[n];
				return r
			}

			function i(e, t) {
				var n, r = new Map
					, i = new Array(t)
					, o = new Array(t)
					, a = e.codec.decode;
				for(n = 0; n < t; n++) i[n] = a(e), o[n] = a(e);
				for(n = 0; n < t; n++) r.set(i[n], o[n]);
				return r
			}

			function o(e, t) {
				for(var n = new Array(t), r = e.codec.decode, i = 0; i < t; i++) n[i] = r(e);
				return n
			}

			function a(e, t) {
				var n = e.reserve(t)
					, r = n + t;
				return T.toString.call(e.buffer, "utf-8", n, r)
			}

			function s(e, t) {
				var n = e.reserve(t)
					, r = n + t
					, i = T.slice.call(e.buffer, n, r);
				return I.from(i)
			}

			function l(e, t) {
				var n = e.reserve(t)
					, r = n + t
					, i = T.slice.call(e.buffer, n, r);
				return I.Uint8Array.from(i)
					.buffer
			}

			function c(e, t) {
				var n = e.reserve(t + 1)
					, r = e.buffer[n++]
					, i = n + t
					, o = e.codec.getExtUnpacker(r);
				if(!o) throw new Error("Invalid ext type: " + (r ? "0x" + r.toString(16) : r));
				return o(T.slice.call(e.buffer, n, i))
			}

			function u(e) {
				var t = e.reserve(1);
				return e.buffer[t]
			}

			function f(e) {
				var t = e.reserve(1)
					, n = e.buffer[t];
				return 128 & n ? n - 256 : n
			}

			function d(e) {
				var t = e.reserve(2)
					, n = e.buffer;
				return n[t++] << 8 | n[t]
			}

			function h(e) {
				var t = e.reserve(2)
					, n = e.buffer
					, r = n[t++] << 8 | n[t];
				return 32768 & r ? r - 65536 : r
			}

			function p(e) {
				var t = e.reserve(4)
					, n = e.buffer;
				return 16777216 * n[t++] + (n[t++] << 16) + (n[t++] << 8) + n[t]
			}

			function A(e) {
				var t = e.reserve(4)
					, n = e.buffer;
				return n[t++] << 24 | n[t++] << 16 | n[t++] << 8 | n[t]
			}

			function g(e, t) {
				return function (n) {
					var r = n.reserve(e);
					return t.call(n.buffer, r, P)
				}
			}

			function m(e) {
				return new k(this, e)
					.toNumber()
			}

			function y(e) {
				return new C(this, e)
					.toNumber()
			}

			function w(e) {
				return new k(this, e)
			}

			function v(e) {
				return new C(this, e)
			}

			function b(e) {
				return B.read(this, e, !1, 23, 4)
			}

			function x(e) {
				return B.read(this, e, !1, 52, 8)
			}
			var B = e("ieee754")
				, E = e("int64-buffer")
				, k = E.Uint64BE
				, C = E.Int64BE;
			n.getReadFormat = function (e) {
				var t = I.hasArrayBuffer && e && e.binarraybuffer
					, n = e && e.int64;
				return {
					map: M && e && e.usemap ? i : r
					, array: o
					, str: a
					, bin: t ? l : s
					, ext: c
					, uint8: u
					, uint16: d
					, uint32: p
					, uint64: g(8, n ? w : m)
					, int8: f
					, int16: h
					, int32: A
					, int64: g(8, n ? v : y)
					, float32: g(4, b)
					, float64: g(8, x)
				}
			}, n.readUint8 = u;
			var I = e("./bufferish")
				, T = e("./bufferish-proto")
				, M = "undefined" != typeof Map
				, P = !0
		}, {
			"./bufferish": 8
			, "./bufferish-proto": 6
			, ieee754: 32
			, "int64-buffer": 33
		}]
		, 24: [function (e, t, n) {
			function r(e) {
				var t, n = new Array(256);
				for(t = 0; t <= 127; t++) n[t] = i(t);
				for(t = 128; t <= 143; t++) n[t] = a(t - 128, e.map);
				for(t = 144; t <= 159; t++) n[t] = a(t - 144, e.array);
				for(t = 160; t <= 191; t++) n[t] = a(t - 160, e.str);
				for(n[192] = i(null), n[193] = null, n[194] = i(!1), n[195] = i(!0), n[196] = o(e.uint8, e.bin), n[197] = o(e.uint16, e.bin), n[198] = o(e.uint32, e.bin), n[199] = o(e.uint8, e.ext), n[200] = o(e.uint16, e.ext), n[201] = o(e.uint32, e.ext), n[202] = e.float32, n[203] = e.float64, n[204] = e.uint8, n[205] = e.uint16, n[206] = e.uint32, n[207] = e.uint64, n[208] = e.int8, n[209] = e.int16, n[210] = e.int32, n[211] = e.int64, n[212] = a(1, e.ext), n[213] = a(2, e.ext), n[214] = a(4, e.ext), n[215] = a(8, e.ext), n[216] = a(16, e.ext), n[217] = o(e.uint8, e.str), n[218] = o(e.uint16, e.str), n[219] = o(e.uint32, e.str), n[220] = o(e.uint16, e.array), n[221] = o(e.uint32, e.array), n[222] = o(e.uint16, e.map), n[223] = o(e.uint32, e.map), t = 224; t <= 255; t++) n[t] = i(t - 256);
				return n
			}

			function i(e) {
				return function () {
					return e
				}
			}

			function o(e, t) {
				return function (n) {
					var r = e(n);
					return t(n, r)
				}
			}

			function a(e, t) {
				return function (n) {
					return t(n, e)
				}
			}
			var s = e("./read-format");
			n.getReadToken = function (e) {
				var t = s.getReadFormat(e);
				return e && e.useraw ? function (e) {
					var t, n = r(e)
						.slice();
					for(n[217] = n[196], n[218] = n[197], n[219] = n[198], t = 160; t <= 191; t++) n[t] = a(t - 160, e.bin);
					return n
				}(t) : r(t)
			}
		}, {
			"./read-format": 23
		}]
		, 25: [function (e, t, n) {
			function r() {
				var e = this.options;
				return this.encode = function (e) {
					var t = a.getWriteType(e);
					return function (e, n) {
						var r = t[typeof n];
						if(!r) throw new Error('Unsupported type "' + typeof n + '": ' + n);
						r(e, n)
					}
				}(e), e && e.preset && o.setExtPackers(this), this
			}
			var i = e("./ext-buffer")
				.ExtBuffer
				, o = e("./ext-packer")
				, a = e("./write-type")
				, s = e("./codec-base");
			s.install({
				addExtPacker: function (e, t, n) {
					function r(t) {
						return n && (t = n(t)), new i(t, e)
					}
					n = s.filter(n);
					var o = t.name;
					o && "Object" !== o ? (this.extPackers || (this.extPackers = {}))[o] = r : (this.extEncoderList || (this.extEncoderList = []))
						.unshift([t, r])
				}
				, getExtPacker: function (e) {
					var t = this.extPackers || (this.extPackers = {})
						, n = e.constructor
						, r = n && n.name && t[n.name];
					if(r) return r;
					for(var i = this.extEncoderList || (this.extEncoderList = []), o = i.length, a = 0; a < o; a++) {
						var s = i[a];
						if(n === s[0]) return s[1]
					}
				}
				, init: r
			}), n.preset = r.call(s.preset)
		}, {
			"./codec-base": 9
			, "./ext-buffer": 17
			, "./ext-packer": 18
			, "./write-type": 27
		}]
		, 26: [function (e, t, n) {
			function r() {
				var e = g.slice();
				return e[196] = i(196), e[197] = o(197), e[198] = a(198), e[199] = i(199), e[200] = o(200), e[201] = a(201), e[202] = s(202, 4, v.writeFloatBE || u, !0), e[203] = s(203, 8, v.writeDoubleBE || f, !0), e[204] = i(204), e[205] = o(205), e[206] = a(206), e[207] = s(207, 8, l), e[208] = i(208), e[209] = o(209), e[210] = a(210), e[211] = s(211, 8, c), e[217] = i(217), e[218] = o(218), e[219] = a(219), e[220] = o(220), e[221] = a(221), e[222] = o(222), e[223] = a(223), e
			}

			function i(e) {
				return function (t, n) {
					var r = t.reserve(2)
						, i = t.buffer;
					i[r++] = e, i[r] = n
				}
			}

			function o(e) {
				return function (t, n) {
					var r = t.reserve(3)
						, i = t.buffer;
					i[r++] = e, i[r++] = n >>> 8, i[r] = n
				}
			}

			function a(e) {
				return function (t, n) {
					var r = t.reserve(5)
						, i = t.buffer;
					i[r++] = e, i[r++] = n >>> 24, i[r++] = n >>> 16, i[r++] = n >>> 8, i[r] = n
				}
			}

			function s(e, t, n, r) {
				return function (i, o) {
					var a = i.reserve(t + 1);
					i.buffer[a++] = e, n.call(i.buffer, o, a, r)
				}
			}

			function l(e, t) {
				new p(this, t, e)
			}

			function c(e, t) {
				new A(this, t, e)
			}

			function u(e, t) {
				d.write(this, e, t, !1, 23, 4)
			}

			function f(e, t) {
				d.write(this, e, t, !1, 52, 8)
			}
			var d = e("ieee754")
				, h = e("int64-buffer")
				, p = h.Uint64BE
				, A = h.Int64BE
				, g = e("./write-uint8")
				.uint8
				, m = e("./bufferish")
				, y = m.global
				, w = m.hasBuffer && "TYPED_ARRAY_SUPPORT" in y && !y.TYPED_ARRAY_SUPPORT
				, v = m.hasBuffer && y.prototype || {};
			n.getWriteToken = function (e) {
				return e && e.uint8array ? function () {
					var e = r();
					return e[202] = s(202, 4, u), e[203] = s(203, 8, f), e
				}() : w || m.hasBuffer && e && e.safe ? function () {
					var e = g.slice();
					return e[196] = s(196, 1, y.prototype.writeUInt8), e[197] = s(197, 2, y.prototype.writeUInt16BE), e[198] = s(198, 4, y.prototype.writeUInt32BE), e[199] = s(199, 1, y.prototype.writeUInt8), e[200] = s(200, 2, y.prototype.writeUInt16BE), e[201] = s(201, 4, y.prototype.writeUInt32BE), e[202] = s(202, 4, y.prototype.writeFloatBE), e[203] = s(203, 8, y.prototype.writeDoubleBE), e[204] = s(204, 1, y.prototype.writeUInt8), e[205] = s(205, 2, y.prototype.writeUInt16BE), e[206] = s(206, 4, y.prototype.writeUInt32BE), e[207] = s(207, 8, l), e[208] = s(208, 1, y.prototype.writeInt8), e[209] = s(209, 2, y.prototype.writeInt16BE), e[210] = s(210, 4, y.prototype.writeInt32BE), e[211] = s(211, 8, c), e[217] = s(217, 1, y.prototype.writeUInt8), e[218] = s(218, 2, y.prototype.writeUInt16BE), e[219] = s(219, 4, y.prototype.writeUInt32BE), e[220] = s(220, 2, y.prototype.writeUInt16BE), e[221] = s(221, 4, y.prototype.writeUInt32BE), e[222] = s(222, 2, y.prototype.writeUInt16BE), e[223] = s(223, 4, y.prototype.writeUInt32BE), e
				}() : r()
			}
		}, {
			"./bufferish": 8
			, "./write-uint8": 28
			, ieee754: 32
			, "int64-buffer": 33
		}]
		, 27: [function (e, t, n) {
			var r = e("isarray")
				, i = e("int64-buffer")
				, o = i.Uint64BE
				, a = i.Int64BE
				, s = e("./bufferish")
				, l = e("./bufferish-proto")
				, c = e("./write-token")
				, u = e("./write-uint8")
				.uint8
				, f = e("./ext-buffer")
				.ExtBuffer
				, d = "undefined" != typeof Uint8Array
				, h = "undefined" != typeof Map
				, p = [];
			p[1] = 212, p[2] = 213, p[4] = 214, p[8] = 215, p[16] = 216, n.getWriteType = function (e) {
				function t(e, t) {
					if(null === t) return n(e, t);
					if(w(t)) return v(e, t);
					if(r(t)) return function (e, t) {
						var n = t.length;
						g[n < 16 ? 144 + n : n <= 65535 ? 220 : 221](e, n);
						for(var r = e.codec.encode, i = 0; i < n; i++) r(e, t[i])
					}(e, t);
					if(o.isUint64BE(t)) return function (e, t) {
						g[207](e, t.toArray())
					}(e, t);
					if(a.isInt64BE(t)) return function (e, t) {
						g[211](e, t.toArray())
					}(e, t);
					var i = e.codec.getExtPacker(t);
					return i && (t = i(t)), t instanceof f ? function (e, t) {
						var n = t.buffer
							, r = n.length
							, i = p[r] || (r < 255 ? 199 : r <= 65535 ? 200 : 201);
						g[i](e, r), u[t.type](e), e.send(n)
					}(e, t) : void b(e, t)
				}

				function n(e, t) {
					g[192](e, t)
				}

				function i(e, t) {
					var n = t.length;
					g[n < 255 ? 196 : n <= 65535 ? 197 : 198](e, n), e.send(t)
				}

				function A(e, t) {
					var n = Object.keys(t)
						, r = n.length;
					g[r < 16 ? 128 + r : r <= 65535 ? 222 : 223](e, r);
					var i = e.codec.encode;
					n.forEach(function (n) {
						i(e, n), i(e, t[n])
					})
				}
				var g = c.getWriteToken(e)
					, m = e && e.useraw
					, y = d && e && e.binarraybuffer
					, w = y ? s.isArrayBuffer : s.isBuffer
					, v = y ? function (e, t) {
						i(e, new Uint8Array(t))
					} : i
					, b = h && e && e.usemap ? function (e, t) {
						if(!(t instanceof Map)) return A(e, t);
						var n = t.size;
						g[n < 16 ? 128 + n : n <= 65535 ? 222 : 223](e, n);
						var r = e.codec.encode;
						t.forEach(function (t, n, i) {
							r(e, n), r(e, t)
						})
					} : A;
				return {
					boolean: function (e, t) {
						g[t ? 195 : 194](e, t)
					}
					, function: n
					, number: function (e, t) {
						var n = 0 | t;
						return t !== n ? void g[203](e, t) : void g[-32 <= n && n <= 127 ? 255 & n : 0 <= n ? n <= 255 ? 204 : n <= 65535 ? 205 : 206 : -128 <= n ? 208 : -32768 <= n ? 209 : 210](e, n)
					}
					, object: m ? function (e, n) {
						return w(n) ? function (e, t) {
							var n = t.length;
							g[n < 32 ? 160 + n : n <= 65535 ? 218 : 219](e, n), e.send(t)
						}(e, n) : void t(e, n)
					} : t
					, string: function (e) {
						return function (t, n) {
							var r = n.length
								, i = 5 + 3 * r;
							t.offset = t.reserve(i);
							var o = t.buffer
								, a = e(r)
								, s = t.offset + a;
							r = l.write.call(o, n, s);
							var c = e(r);
							if(a !== c) {
								var u = s + c - a
									, f = s + r;
								l.copy.call(o, o, u, s, f)
							}
							g[1 === c ? 160 + r : c <= 3 ? 215 + c : 219](t, r), t.offset += r
						}
					}(m ? function (e) {
						return e < 32 ? 1 : e <= 65535 ? 3 : 5
					} : function (e) {
						return e < 32 ? 1 : e <= 255 ? 2 : e <= 65535 ? 3 : 5
					})
					, symbol: n
					, undefined: n
				}
			}
		}, {
			"./bufferish": 8
			, "./bufferish-proto": 6
			, "./ext-buffer": 17
			, "./write-token": 26
			, "./write-uint8": 28
			, "int64-buffer": 33
			, isarray: 34
		}]
		, 28: [function (e, t, n) {
			function r(e) {
				return function (t) {
					var n = t.reserve(1);
					t.buffer[n] = e
				}
			}
			for(var i = n.uint8 = new Array(256), o = 0; o <= 255; o++) i[o] = r(o)
		}, {}]
		, 29: [function (e, t, n) {
			(function (t) {
				"use strict";

				function r() {
					return o.TYPED_ARRAY_SUPPORT ? 2147483647 : 1073741823
				}

				function i(e, t) {
					if(r() < t) throw new RangeError("Invalid typed array length");
					return o.TYPED_ARRAY_SUPPORT ? (e = new Uint8Array(t))
						.__proto__ = o.prototype : (null === e && (e = new o(t)), e.length = t), e
				}

				function o(e, t, n) {
					if(!(o.TYPED_ARRAY_SUPPORT || this instanceof o)) return new o(e, t, n);
					if("number" == typeof e) {
						if("string" == typeof t) throw new Error("If encoding is specified then the first argument must be a string");
						return l(this, e)
					}
					return a(this, e, t, n)
				}

				function a(e, t, n, r) {
					if("number" == typeof t) throw new TypeError('"value" argument must not be a number');
					return "undefined" != typeof ArrayBuffer && t instanceof ArrayBuffer ? function (e, t, n, r) {
						if(t.byteLength, n < 0 || t.byteLength < n) throw new RangeError("'offset' is out of bounds");
						if(t.byteLength < n + (r || 0)) throw new RangeError("'length' is out of bounds");
						return t = void 0 === n && void 0 === r ? new Uint8Array(t) : void 0 === r ? new Uint8Array(t, n) : new Uint8Array(t, n, r), o.TYPED_ARRAY_SUPPORT ? (e = t)
							.__proto__ = o.prototype : e = c(e, t), e
					}(e, t, n, r) : "string" == typeof t ? function (e, t, n) {
						if("string" == typeof n && "" !== n || (n = "utf8"), !o.isEncoding(n)) throw new TypeError('"encoding" must be a valid string encoding');
						var r = 0 | f(t, n)
							, a = (e = i(e, r))
							.write(t, n);
						return a !== r && (e = e.slice(0, a)), e
					}(e, t, n) : function (e, t) {
						if(o.isBuffer(t)) {
							var n = 0 | u(t.length);
							return 0 === (e = i(e, n))
								.length ? e : (t.copy(e, 0, 0, n), e)
						}
						if(t) {
							if("undefined" != typeof ArrayBuffer && t.buffer instanceof ArrayBuffer || "length" in t) return "number" != typeof t.length || function (e) {
								return e != e
							}(t.length) ? i(e, 0) : c(e, t);
							if("Buffer" === t.type && X(t.data)) return c(e, t.data)
						}
						throw new TypeError("First argument must be a string, Buffer, ArrayBuffer, Array, or array-like object.")
					}(e, t)
				}

				function s(e) {
					if("number" != typeof e) throw new TypeError('"size" argument must be a number');
					if(e < 0) throw new RangeError('"size" argument must not be negative')
				}

				function l(e, t) {
					if(s(t), e = i(e, t < 0 ? 0 : 0 | u(t)), !o.TYPED_ARRAY_SUPPORT)
						for(var n = 0; n < t; ++n) e[n] = 0;
					return e
				}

				function c(e, t) {
					var n = t.length < 0 ? 0 : 0 | u(t.length);
					e = i(e, n);
					for(var r = 0; r < n; r += 1) e[r] = 255 & t[r];
					return e
				}

				function u(e) {
					if(e >= r()) throw new RangeError("Attempt to allocate Buffer larger than maximum size: 0x" + r()
						.toString(16) + " bytes");
					return 0 | e
				}

				function f(e, t) {
					if(o.isBuffer(e)) return e.length;
					if("undefined" != typeof ArrayBuffer && "function" == typeof ArrayBuffer.isView && (ArrayBuffer.isView(e) || e instanceof ArrayBuffer)) return e.byteLength;
					"string" != typeof e && (e = "" + e);
					var n = e.length;
					if(0 === n) return 0;
					for(var r = !1;;) switch(t) {
					case "ascii":
					case "latin1":
					case "binary":
						return n;
					case "utf8":
					case "utf-8":
					case void 0:
						return S(e)
							.length;
					case "ucs2":
					case "ucs-2":
					case "utf16le":
					case "utf-16le":
						return 2 * n;
					case "hex":
						return n >>> 1;
					case "base64":
						return q(e)
							.length;
					default:
						if(r) return S(e)
							.length;
						t = ("" + t)
							.toLowerCase(), r = !0
					}
				}

				function d(e, t, n) {
					var r = e[t];
					e[t] = e[n], e[n] = r
				}

				function h(e, t, n, r, i) {
					if(0 === e.length) return -1;
					if("string" == typeof n ? (r = n, n = 0) : n > 2147483647 ? n = 2147483647 : n < -2147483648 && (n = -2147483648), n = +n, isNaN(n) && (n = i ? 0 : e.length - 1), n < 0 && (n = e.length + n), n >= e.length) {
						if(i) return -1;
						n = e.length - 1
					} else if(n < 0) {
						if(!i) return -1;
						n = 0
					}
					if("string" == typeof t && (t = o.from(t, r)), o.isBuffer(t)) return 0 === t.length ? -1 : p(e, t, n, r, i);
					if("number" == typeof t) return t &= 255, o.TYPED_ARRAY_SUPPORT && "function" == typeof Uint8Array.prototype.indexOf ? i ? Uint8Array.prototype.indexOf.call(e, t, n) : Uint8Array.prototype.lastIndexOf.call(e, t, n) : p(e, [t], n, r, i);
					throw new TypeError("val must be string, number or Buffer")
				}

				function p(e, t, n, r, i) {
					function o(e, t) {
						return 1 === s ? e[t] : e.readUInt16BE(t * s)
					}
					var a, s = 1
						, l = e.length
						, c = t.length;
					if(void 0 !== r && ("ucs2" === (r = String(r)
							.toLowerCase()) || "ucs-2" === r || "utf16le" === r || "utf-16le" === r)) {
						if(e.length < 2 || t.length < 2) return -1;
						s = 2, l /= 2, c /= 2, n /= 2
					}
					if(i) {
						var u = -1;
						for(a = n; a < l; a++)
							if(o(e, a) === o(t, -1 === u ? 0 : a - u)) {
								if(-1 === u && (u = a), a - u + 1 === c) return u * s
							} else -1 !== u && (a -= a - u), u = -1
					} else
						for(n + c > l && (n = l - c), a = n; a >= 0; a--) {
							for(var f = !0, d = 0; d < c; d++)
								if(o(e, a + d) !== o(t, d)) {
									f = !1;
									break
								} if(f) return a
						}
					return -1
				}

				function A(e, t, n, r) {
					n = Number(n) || 0;
					var i = e.length - n;
					r ? (r = Number(r)) > i && (r = i) : r = i;
					var o = t.length;
					if(o % 2 != 0) throw new TypeError("Invalid hex string");
					r > o / 2 && (r = o / 2);
					for(var a = 0; a < r; ++a) {
						var s = parseInt(t.substr(2 * a, 2), 16);
						if(isNaN(s)) return a;
						e[n + a] = s
					}
					return a
				}

				function g(e, t, n, r) {
					return H(S(t, e.length - n), e, n, r)
				}

				function m(e, t, n, r) {
					return H(function (e) {
						for(var t = [], n = 0; n < e.length; ++n) t.push(255 & e.charCodeAt(n));
						return t
					}(t), e, n, r)
				}

				function y(e, t, n, r) {
					return m(e, t, n, r)
				}

				function w(e, t, n, r) {
					return H(q(t), e, n, r)
				}

				function v(e, t, n, r) {
					return H(function (e, t) {
						for(var n, r, i, o = [], a = 0; a < e.length && !((t -= 2) < 0); ++a) n = e.charCodeAt(a), r = n >> 8, i = n % 256, o.push(i), o.push(r);
						return o
					}(t, e.length - n), e, n, r)
				}

				function b(e, t, n) {
					return 0 === t && n === e.length ? V.fromByteArray(e) : V.fromByteArray(e.slice(t, n))
				}

				function x(e, t, n) {
					n = Math.min(e.length, n);
					for(var r = [], i = t; i < n;) {
						var o, a, s, l, c = e[i]
							, u = null
							, f = c > 239 ? 4 : c > 223 ? 3 : c > 191 ? 2 : 1;
						if(i + f <= n) switch(f) {
						case 1:
							c < 128 && (u = c);
							break;
						case 2:
							128 == (192 & (o = e[i + 1])) && ((l = (31 & c) << 6 | 63 & o) > 127 && (u = l));
							break;
						case 3:
							o = e[i + 1], a = e[i + 2], 128 == (192 & o) && 128 == (192 & a) && ((l = (15 & c) << 12 | (63 & o) << 6 | 63 & a) > 2047 && (l < 55296 || l > 57343) && (u = l));
							break;
						case 4:
							o = e[i + 1], a = e[i + 2], s = e[i + 3], 128 == (192 & o) && 128 == (192 & a) && 128 == (192 & s) && ((l = (15 & c) << 18 | (63 & o) << 12 | (63 & a) << 6 | 63 & s) > 65535 && l < 1114112 && (u = l))
						}
						null === u ? (u = 65533, f = 1) : u > 65535 && (u -= 65536, r.push(u >>> 10 & 1023 | 55296), u = 56320 | 1023 & u), r.push(u), i += f
					}
					return function (e) {
						var t = e.length;
						if(t <= U) return String.fromCharCode.apply(String, e);
						for(var n = "", r = 0; r < t;) n += String.fromCharCode.apply(String, e.slice(r, r += U));
						return n
					}(r)
				}

				function B(e, t, n) {
					var r = "";
					n = Math.min(e.length, n);
					for(var i = t; i < n; ++i) r += String.fromCharCode(127 & e[i]);
					return r
				}

				function E(e, t, n) {
					var r = "";
					n = Math.min(e.length, n);
					for(var i = t; i < n; ++i) r += String.fromCharCode(e[i]);
					return r
				}

				function k(e, t, n) {
					var r = e.length;
					(!t || t < 0) && (t = 0), (!n || n < 0 || n > r) && (n = r);
					for(var i = "", o = t; o < n; ++o) i += _(e[o]);
					return i
				}

				function C(e, t, n) {
					for(var r = e.slice(t, n), i = "", o = 0; o < r.length; o += 2) i += String.fromCharCode(r[o] + 256 * r[o + 1]);
					return i
				}

				function I(e, t, n) {
					if(e % 1 != 0 || e < 0) throw new RangeError("offset is not uint");
					if(e + t > n) throw new RangeError("Trying to access beyond buffer length")
				}

				function T(e, t, n, r, i, a) {
					if(!o.isBuffer(e)) throw new TypeError('"buffer" argument must be a Buffer instance');
					if(t > i || t < a) throw new RangeError('"value" argument is out of bounds');
					if(n + r > e.length) throw new RangeError("Index out of range")
				}

				function M(e, t, n, r) {
					t < 0 && (t = 65535 + t + 1);
					for(var i = 0, o = Math.min(e.length - n, 2); i < o; ++i) e[n + i] = (t & 255 << 8 * (r ? i : 1 - i)) >>> 8 * (r ? i : 1 - i)
				}

				function P(e, t, n, r) {
					t < 0 && (t = 4294967295 + t + 1);
					for(var i = 0, o = Math.min(e.length - n, 4); i < o; ++i) e[n + i] = t >>> 8 * (r ? i : 3 - i) & 255
				}

				function O(e, t, n, r, i, o) {
					if(n + r > e.length) throw new RangeError("Index out of range");
					if(n < 0) throw new RangeError("Index out of range")
				}

				function D(e, t, n, r, i) {
					return i || O(e, 0, n, 4), j.write(e, t, n, r, 23, 4), n + 4
				}

				function L(e, t, n, r, i) {
					return i || O(e, 0, n, 8), j.write(e, t, n, r, 52, 8), n + 8
				}

				function _(e) {
					return e < 16 ? "0" + e.toString(16) : e.toString(16)
				}

				function S(e, t) {
					t = t || 1 / 0;
					for(var n, r = e.length, i = null, o = [], a = 0; a < r; ++a) {
						if((n = e.charCodeAt(a)) > 55295 && n < 57344) {
							if(!i) {
								if(n > 56319) {
									(t -= 3) > -1 && o.push(239, 191, 189);
									continue
								}
								if(a + 1 === r) {
									(t -= 3) > -1 && o.push(239, 191, 189);
									continue
								}
								i = n;
								continue
							}
							if(n < 56320) {
								(t -= 3) > -1 && o.push(239, 191, 189), i = n;
								continue
							}
							n = 65536 + (i - 55296 << 10 | n - 56320)
						} else i && (t -= 3) > -1 && o.push(239, 191, 189);
						if(i = null, n < 128) {
							if((t -= 1) < 0) break;
							o.push(n)
						} else if(n < 2048) {
							if((t -= 2) < 0) break;
							o.push(n >> 6 | 192, 63 & n | 128)
						} else if(n < 65536) {
							if((t -= 3) < 0) break;
							o.push(n >> 12 | 224, n >> 6 & 63 | 128, 63 & n | 128)
						} else {
							if(!(n < 1114112)) throw new Error("Invalid code point");
							if((t -= 4) < 0) break;
							o.push(n >> 18 | 240, n >> 12 & 63 | 128, n >> 6 & 63 | 128, 63 & n | 128)
						}
					}
					return o
				}

				function q(e) {
					return V.toByteArray(function (e) {
						if((e = function (e) {
									return e.trim ? e.trim() : e.replace(/^\s+|\s+$/g, "")
								}(e)
								.replace(R, ""))
							.length < 2) return "";
						for(; e.length % 4 != 0;) e += "=";
						return e
					}(e))
				}

				function H(e, t, n, r) {
					for(var i = 0; i < r && !(i + n >= t.length || i >= e.length); ++i) t[i + n] = e[i];
					return i
				}
				var V = e("base64-js")
					, j = e("ieee754")
					, X = e("isarray");
				n.Buffer = o, n.SlowBuffer = function (e) {
					return +e != e && (e = 0), o.alloc(+e)
				}, n.INSPECT_MAX_BYTES = 50, o.TYPED_ARRAY_SUPPORT = void 0 !== t.TYPED_ARRAY_SUPPORT ? t.TYPED_ARRAY_SUPPORT : function () {
					try {
						var e = new Uint8Array(1);
						return e.__proto__ = {
								__proto__: Uint8Array.prototype
								, foo: function () {
									return 42
								}
							}, 42 === e.foo() && "function" == typeof e.subarray && 0 === e.subarray(1, 1)
							.byteLength
					} catch (e) {
						return !1
					}
				}(), n.kMaxLength = r(), o.poolSize = 8192, o._augment = function (e) {
					return e.__proto__ = o.prototype, e
				}, o.from = function (e, t, n) {
					return a(null, e, t, n)
				}, o.TYPED_ARRAY_SUPPORT && (o.prototype.__proto__ = Uint8Array.prototype, o.__proto__ = Uint8Array, "undefined" != typeof Symbol && Symbol.species && o[Symbol.species] === o && Object.defineProperty(o, Symbol.species, {
					value: null
					, configurable: !0
				})), o.alloc = function (e, t, n) {
					return function (e, t, n, r) {
						return s(t), t <= 0 ? i(e, t) : void 0 !== n ? "string" == typeof r ? i(e, t)
							.fill(n, r) : i(e, t)
							.fill(n) : i(e, t)
					}(null, e, t, n)
				}, o.allocUnsafe = function (e) {
					return l(null, e)
				}, o.allocUnsafeSlow = function (e) {
					return l(null, e)
				}, o.isBuffer = function (e) {
					return !(null == e || !e._isBuffer)
				}, o.compare = function (e, t) {
					if(!o.isBuffer(e) || !o.isBuffer(t)) throw new TypeError("Arguments must be Buffers");
					if(e === t) return 0;
					for(var n = e.length, r = t.length, i = 0, a = Math.min(n, r); i < a; ++i)
						if(e[i] !== t[i]) {
							n = e[i], r = t[i];
							break
						} return n < r ? -1 : r < n ? 1 : 0
				}, o.isEncoding = function (e) {
					switch(String(e)
						.toLowerCase()) {
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
				}, o.concat = function (e, t) {
					if(!X(e)) throw new TypeError('"list" argument must be an Array of Buffers');
					if(0 === e.length) return o.alloc(0);
					var n;
					if(void 0 === t)
						for(t = 0, n = 0; n < e.length; ++n) t += e[n].length;
					var r = o.allocUnsafe(t)
						, i = 0;
					for(n = 0; n < e.length; ++n) {
						var a = e[n];
						if(!o.isBuffer(a)) throw new TypeError('"list" argument must be an Array of Buffers');
						a.copy(r, i), i += a.length
					}
					return r
				}, o.byteLength = f, o.prototype._isBuffer = !0, o.prototype.swap16 = function () {
					var e = this.length;
					if(e % 2 != 0) throw new RangeError("Buffer size must be a multiple of 16-bits");
					for(var t = 0; t < e; t += 2) d(this, t, t + 1);
					return this
				}, o.prototype.swap32 = function () {
					var e = this.length;
					if(e % 4 != 0) throw new RangeError("Buffer size must be a multiple of 32-bits");
					for(var t = 0; t < e; t += 4) d(this, t, t + 3), d(this, t + 1, t + 2);
					return this
				}, o.prototype.swap64 = function () {
					var e = this.length;
					if(e % 8 != 0) throw new RangeError("Buffer size must be a multiple of 64-bits");
					for(var t = 0; t < e; t += 8) d(this, t, t + 7), d(this, t + 1, t + 6), d(this, t + 2, t + 5), d(this, t + 3, t + 4);
					return this
				}, o.prototype.toString = function () {
					var e = 0 | this.length;
					return 0 === e ? "" : 0 === arguments.length ? x(this, 0, e) : function (e, t, n) {
						var r = !1;
						if((void 0 === t || t < 0) && (t = 0), t > this.length) return "";
						if((void 0 === n || n > this.length) && (n = this.length), n <= 0) return "";
						if((n >>>= 0) <= (t >>>= 0)) return "";
						for(e || (e = "utf8");;) switch(e) {
						case "hex":
							return k(this, t, n);
						case "utf8":
						case "utf-8":
							return x(this, t, n);
						case "ascii":
							return B(this, t, n);
						case "latin1":
						case "binary":
							return E(this, t, n);
						case "base64":
							return b(this, t, n);
						case "ucs2":
						case "ucs-2":
						case "utf16le":
						case "utf-16le":
							return C(this, t, n);
						default:
							if(r) throw new TypeError("Unknown encoding: " + e);
							e = (e + "")
								.toLowerCase(), r = !0
						}
					}.apply(this, arguments)
				}, o.prototype.equals = function (e) {
					if(!o.isBuffer(e)) throw new TypeError("Argument must be a Buffer");
					return this === e || 0 === o.compare(this, e)
				}, o.prototype.inspect = function () {
					var e = ""
						, t = n.INSPECT_MAX_BYTES;
					return this.length > 0 && (e = this.toString("hex", 0, t)
						.match(/.{2}/g)
						.join(" "), this.length > t && (e += " ... ")), "<Buffer " + e + ">"
				}, o.prototype.compare = function (e, t, n, r, i) {
					if(!o.isBuffer(e)) throw new TypeError("Argument must be a Buffer");
					if(void 0 === t && (t = 0), void 0 === n && (n = e ? e.length : 0), void 0 === r && (r = 0), void 0 === i && (i = this.length), t < 0 || n > e.length || r < 0 || i > this.length) throw new RangeError("out of range index");
					if(r >= i && t >= n) return 0;
					if(r >= i) return -1;
					if(t >= n) return 1;
					if(this === e) return 0;
					for(var a = (i >>>= 0) - (r >>>= 0), s = (n >>>= 0) - (t >>>= 0), l = Math.min(a, s), c = this.slice(r, i), u = e.slice(t, n), f = 0; f < l; ++f)
						if(c[f] !== u[f]) {
							a = c[f], s = u[f];
							break
						} return a < s ? -1 : s < a ? 1 : 0
				}, o.prototype.includes = function (e, t, n) {
					return -1 !== this.indexOf(e, t, n)
				}, o.prototype.indexOf = function (e, t, n) {
					return h(this, e, t, n, !0)
				}, o.prototype.lastIndexOf = function (e, t, n) {
					return h(this, e, t, n, !1)
				}, o.prototype.write = function (e, t, n, r) {
					if(void 0 === t) r = "utf8", n = this.length, t = 0;
					else if(void 0 === n && "string" == typeof t) r = t, n = this.length, t = 0;
					else {
						if(!isFinite(t)) throw new Error("Buffer.write(string, encoding, offset[, length]) is no longer supported");
						t |= 0, isFinite(n) ? (n |= 0, void 0 === r && (r = "utf8")) : (r = n, n = void 0)
					}
					var i = this.length - t;
					if((void 0 === n || n > i) && (n = i), e.length > 0 && (n < 0 || t < 0) || t > this.length) throw new RangeError("Attempt to write outside buffer bounds");
					r || (r = "utf8");
					for(var o = !1;;) switch(r) {
					case "hex":
						return A(this, e, t, n);
					case "utf8":
					case "utf-8":
						return g(this, e, t, n);
					case "ascii":
						return m(this, e, t, n);
					case "latin1":
					case "binary":
						return y(this, e, t, n);
					case "base64":
						return w(this, e, t, n);
					case "ucs2":
					case "ucs-2":
					case "utf16le":
					case "utf-16le":
						return v(this, e, t, n);
					default:
						if(o) throw new TypeError("Unknown encoding: " + r);
						r = ("" + r)
							.toLowerCase(), o = !0
					}
				}, o.prototype.toJSON = function () {
					return {
						type: "Buffer"
						, data: Array.prototype.slice.call(this._arr || this, 0)
					}
				};
				var U = 4096;
				o.prototype.slice = function (e, t) {
					var n, r = this.length;
					if((e = ~~e) < 0 ? (e += r) < 0 && (e = 0) : e > r && (e = r), (t = void 0 === t ? r : ~~t) < 0 ? (t += r) < 0 && (t = 0) : t > r && (t = r), t < e && (t = e), o.TYPED_ARRAY_SUPPORT)(n = this.subarray(e, t))
						.__proto__ = o.prototype;
					else {
						var i = t - e;
						n = new o(i, void 0);
						for(var a = 0; a < i; ++a) n[a] = this[a + e]
					}
					return n
				}, o.prototype.readUIntLE = function (e, t, n) {
					e |= 0, t |= 0, n || I(e, t, this.length);
					for(var r = this[e], i = 1, o = 0; ++o < t && (i *= 256);) r += this[e + o] * i;
					return r
				}, o.prototype.readUIntBE = function (e, t, n) {
					e |= 0, t |= 0, n || I(e, t, this.length);
					for(var r = this[e + --t], i = 1; t > 0 && (i *= 256);) r += this[e + --t] * i;
					return r
				}, o.prototype.readUInt8 = function (e, t) {
					return t || I(e, 1, this.length), this[e]
				}, o.prototype.readUInt16LE = function (e, t) {
					return t || I(e, 2, this.length), this[e] | this[e + 1] << 8
				}, o.prototype.readUInt16BE = function (e, t) {
					return t || I(e, 2, this.length), this[e] << 8 | this[e + 1]
				}, o.prototype.readUInt32LE = function (e, t) {
					return t || I(e, 4, this.length), (this[e] | this[e + 1] << 8 | this[e + 2] << 16) + 16777216 * this[e + 3]
				}, o.prototype.readUInt32BE = function (e, t) {
					return t || I(e, 4, this.length), 16777216 * this[e] + (this[e + 1] << 16 | this[e + 2] << 8 | this[e + 3])
				}, o.prototype.readIntLE = function (e, t, n) {
					e |= 0, t |= 0, n || I(e, t, this.length);
					for(var r = this[e], i = 1, o = 0; ++o < t && (i *= 256);) r += this[e + o] * i;
					return r >= (i *= 128) && (r -= Math.pow(2, 8 * t)), r
				}, o.prototype.readIntBE = function (e, t, n) {
					e |= 0, t |= 0, n || I(e, t, this.length);
					for(var r = t, i = 1, o = this[e + --r]; r > 0 && (i *= 256);) o += this[e + --r] * i;
					return o >= (i *= 128) && (o -= Math.pow(2, 8 * t)), o
				}, o.prototype.readInt8 = function (e, t) {
					return t || I(e, 1, this.length), 128 & this[e] ? -1 * (255 - this[e] + 1) : this[e]
				}, o.prototype.readInt16LE = function (e, t) {
					t || I(e, 2, this.length);
					var n = this[e] | this[e + 1] << 8;
					return 32768 & n ? 4294901760 | n : n
				}, o.prototype.readInt16BE = function (e, t) {
					t || I(e, 2, this.length);
					var n = this[e + 1] | this[e] << 8;
					return 32768 & n ? 4294901760 | n : n
				}, o.prototype.readInt32LE = function (e, t) {
					return t || I(e, 4, this.length), this[e] | this[e + 1] << 8 | this[e + 2] << 16 | this[e + 3] << 24
				}, o.prototype.readInt32BE = function (e, t) {
					return t || I(e, 4, this.length), this[e] << 24 | this[e + 1] << 16 | this[e + 2] << 8 | this[e + 3]
				}, o.prototype.readFloatLE = function (e, t) {
					return t || I(e, 4, this.length), j.read(this, e, !0, 23, 4)
				}, o.prototype.readFloatBE = function (e, t) {
					return t || I(e, 4, this.length), j.read(this, e, !1, 23, 4)
				}, o.prototype.readDoubleLE = function (e, t) {
					return t || I(e, 8, this.length), j.read(this, e, !0, 52, 8)
				}, o.prototype.readDoubleBE = function (e, t) {
					return t || I(e, 8, this.length), j.read(this, e, !1, 52, 8)
				}, o.prototype.writeUIntLE = function (e, t, n, r) {
					(e = +e, t |= 0, n |= 0, r) || T(this, e, t, n, Math.pow(2, 8 * n) - 1, 0);
					var i = 1
						, o = 0;
					for(this[t] = 255 & e; ++o < n && (i *= 256);) this[t + o] = e / i & 255;
					return t + n
				}, o.prototype.writeUIntBE = function (e, t, n, r) {
					(e = +e, t |= 0, n |= 0, r) || T(this, e, t, n, Math.pow(2, 8 * n) - 1, 0);
					var i = n - 1
						, o = 1;
					for(this[t + i] = 255 & e; --i >= 0 && (o *= 256);) this[t + i] = e / o & 255;
					return t + n
				}, o.prototype.writeUInt8 = function (e, t, n) {
					return e = +e, t |= 0, n || T(this, e, t, 1, 255, 0), o.TYPED_ARRAY_SUPPORT || (e = Math.floor(e)), this[t] = 255 & e, t + 1
				}, o.prototype.writeUInt16LE = function (e, t, n) {
					return e = +e, t |= 0, n || T(this, e, t, 2, 65535, 0), o.TYPED_ARRAY_SUPPORT ? (this[t] = 255 & e, this[t + 1] = e >>> 8) : M(this, e, t, !0), t + 2
				}, o.prototype.writeUInt16BE = function (e, t, n) {
					return e = +e, t |= 0, n || T(this, e, t, 2, 65535, 0), o.TYPED_ARRAY_SUPPORT ? (this[t] = e >>> 8, this[t + 1] = 255 & e) : M(this, e, t, !1), t + 2
				}, o.prototype.writeUInt32LE = function (e, t, n) {
					return e = +e, t |= 0, n || T(this, e, t, 4, 4294967295, 0), o.TYPED_ARRAY_SUPPORT ? (this[t + 3] = e >>> 24, this[t + 2] = e >>> 16, this[t + 1] = e >>> 8, this[t] = 255 & e) : P(this, e, t, !0), t + 4
				}, o.prototype.writeUInt32BE = function (e, t, n) {
					return e = +e, t |= 0, n || T(this, e, t, 4, 4294967295, 0), o.TYPED_ARRAY_SUPPORT ? (this[t] = e >>> 24, this[t + 1] = e >>> 16, this[t + 2] = e >>> 8, this[t + 3] = 255 & e) : P(this, e, t, !1), t + 4
				}, o.prototype.writeIntLE = function (e, t, n, r) {
					if(e = +e, t |= 0, !r) {
						var i = Math.pow(2, 8 * n - 1);
						T(this, e, t, n, i - 1, -i)
					}
					var o = 0
						, a = 1
						, s = 0;
					for(this[t] = 255 & e; ++o < n && (a *= 256);) e < 0 && 0 === s && 0 !== this[t + o - 1] && (s = 1), this[t + o] = (e / a >> 0) - s & 255;
					return t + n
				}, o.prototype.writeIntBE = function (e, t, n, r) {
					if(e = +e, t |= 0, !r) {
						var i = Math.pow(2, 8 * n - 1);
						T(this, e, t, n, i - 1, -i)
					}
					var o = n - 1
						, a = 1
						, s = 0;
					for(this[t + o] = 255 & e; --o >= 0 && (a *= 256);) e < 0 && 0 === s && 0 !== this[t + o + 1] && (s = 1), this[t + o] = (e / a >> 0) - s & 255;
					return t + n
				}, o.prototype.writeInt8 = function (e, t, n) {
					return e = +e, t |= 0, n || T(this, e, t, 1, 127, -128), o.TYPED_ARRAY_SUPPORT || (e = Math.floor(e)), e < 0 && (e = 255 + e + 1), this[t] = 255 & e, t + 1
				}, o.prototype.writeInt16LE = function (e, t, n) {
					return e = +e, t |= 0, n || T(this, e, t, 2, 32767, -32768), o.TYPED_ARRAY_SUPPORT ? (this[t] = 255 & e, this[t + 1] = e >>> 8) : M(this, e, t, !0), t + 2
				}, o.prototype.writeInt16BE = function (e, t, n) {
					return e = +e, t |= 0, n || T(this, e, t, 2, 32767, -32768), o.TYPED_ARRAY_SUPPORT ? (this[t] = e >>> 8, this[t + 1] = 255 & e) : M(this, e, t, !1), t + 2
				}, o.prototype.writeInt32LE = function (e, t, n) {
					return e = +e, t |= 0, n || T(this, e, t, 4, 2147483647, -2147483648), o.TYPED_ARRAY_SUPPORT ? (this[t] = 255 & e, this[t + 1] = e >>> 8, this[t + 2] = e >>> 16, this[t + 3] = e >>> 24) : P(this, e, t, !0), t + 4
				}, o.prototype.writeInt32BE = function (e, t, n) {
					return e = +e, t |= 0, n || T(this, e, t, 4, 2147483647, -2147483648), e < 0 && (e = 4294967295 + e + 1), o.TYPED_ARRAY_SUPPORT ? (this[t] = e >>> 24, this[t + 1] = e >>> 16, this[t + 2] = e >>> 8, this[t + 3] = 255 & e) : P(this, e, t, !1), t + 4
				}, o.prototype.writeFloatLE = function (e, t, n) {
					return D(this, e, t, !0, n)
				}, o.prototype.writeFloatBE = function (e, t, n) {
					return D(this, e, t, !1, n)
				}, o.prototype.writeDoubleLE = function (e, t, n) {
					return L(this, e, t, !0, n)
				}, o.prototype.writeDoubleBE = function (e, t, n) {
					return L(this, e, t, !1, n)
				}, o.prototype.copy = function (e, t, n, r) {
					if(n || (n = 0), r || 0 === r || (r = this.length), t >= e.length && (t = e.length), t || (t = 0), r > 0 && r < n && (r = n), r === n) return 0;
					if(0 === e.length || 0 === this.length) return 0;
					if(t < 0) throw new RangeError("targetStart out of bounds");
					if(n < 0 || n >= this.length) throw new RangeError("sourceStart out of bounds");
					if(r < 0) throw new RangeError("sourceEnd out of bounds");
					r > this.length && (r = this.length), e.length - t < r - n && (r = e.length - t + n);
					var i, a = r - n;
					if(this === e && n < t && t < r)
						for(i = a - 1; i >= 0; --i) e[i + t] = this[i + n];
					else if(a < 1e3 || !o.TYPED_ARRAY_SUPPORT)
						for(i = 0; i < a; ++i) e[i + t] = this[i + n];
					else Uint8Array.prototype.set.call(e, this.subarray(n, n + a), t);
					return a
				}, o.prototype.fill = function (e, t, n, r) {
					if("string" == typeof e) {
						if("string" == typeof t ? (r = t, t = 0, n = this.length) : "string" == typeof n && (r = n, n = this.length), 1 === e.length) {
							var i = e.charCodeAt(0);
							i < 256 && (e = i)
						}
						if(void 0 !== r && "string" != typeof r) throw new TypeError("encoding must be a string");
						if("string" == typeof r && !o.isEncoding(r)) throw new TypeError("Unknown encoding: " + r)
					} else "number" == typeof e && (e &= 255);
					if(t < 0 || this.length < t || this.length < n) throw new RangeError("Out of range index");
					if(n <= t) return this;
					var a;
					if(t >>>= 0, n = void 0 === n ? this.length : n >>> 0, e || (e = 0), "number" == typeof e)
						for(a = t; a < n; ++a) this[a] = e;
					else {
						var s = o.isBuffer(e) ? e : S(new o(e, r)
								.toString())
							, l = s.length;
						for(a = 0; a < n - t; ++a) this[a + t] = s[a % l]
					}
					return this
				};
				var R = /[^+\/0-9A-Za-z-_]/g
			})
			.call(this, "undefined" != typeof global ? global : "undefined" != typeof self ? self : "undefined" != typeof window ? window : {})
		}, {
			"base64-js": 30
			, ieee754: 32
			, isarray: 34
		}]
		, 30: [function (e, t, n) {
			"use strict";

			function r(e) {
				var t = e.length;
				if(t % 4 > 0) throw new Error("Invalid string. Length must be a multiple of 4");
				return "=" === e[t - 2] ? 2 : "=" === e[t - 1] ? 1 : 0
			}

			function i(e) {
				return a[e >> 18 & 63] + a[e >> 12 & 63] + a[e >> 6 & 63] + a[63 & e]
			}

			function o(e, t, n) {
				for(var r, o = [], a = t; a < n; a += 3) r = (e[a] << 16) + (e[a + 1] << 8) + e[a + 2], o.push(i(r));
				return o.join("")
			}
			n.byteLength = function (e) {
				return 3 * e.length / 4 - r(e)
			}, n.toByteArray = function (e) {
				var t, n, i, o, a, c, u = e.length;
				a = r(e), c = new l(3 * u / 4 - a), i = a > 0 ? u - 4 : u;
				var f = 0;
				for(t = 0, n = 0; t < i; t += 4, n += 3) o = s[e.charCodeAt(t)] << 18 | s[e.charCodeAt(t + 1)] << 12 | s[e.charCodeAt(t + 2)] << 6 | s[e.charCodeAt(t + 3)], c[f++] = o >> 16 & 255, c[f++] = o >> 8 & 255, c[f++] = 255 & o;
				return 2 === a ? (o = s[e.charCodeAt(t)] << 2 | s[e.charCodeAt(t + 1)] >> 4, c[f++] = 255 & o) : 1 === a && (o = s[e.charCodeAt(t)] << 10 | s[e.charCodeAt(t + 1)] << 4 | s[e.charCodeAt(t + 2)] >> 2, c[f++] = o >> 8 & 255, c[f++] = 255 & o), c
			}, n.fromByteArray = function (e) {
				for(var t, n = e.length, r = n % 3, i = "", s = [], l = 16383, c = 0, u = n - r; c < u; c += l) s.push(o(e, c, c + l > u ? u : c + l));
				return 1 === r ? (t = e[n - 1], i += a[t >> 2], i += a[t << 4 & 63], i += "==") : 2 === r && (t = (e[n - 2] << 8) + e[n - 1], i += a[t >> 10], i += a[t >> 4 & 63], i += a[t << 2 & 63], i += "="), s.push(i), s.join("")
			};
			for(var a = [], s = [], l = "undefined" != typeof Uint8Array ? Uint8Array : Array, c = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/", u = 0, f = c.length; u < f; ++u) a[u] = c[u], s[c.charCodeAt(u)] = u;
			s["-".charCodeAt(0)] = 62, s["_".charCodeAt(0)] = 63
		}, {}]
		, 31: [function (e, t, n) {
			! function (e) {
				function n(e) {
					for(var t in a) e[t] = a[t];
					return e
				}

				function r(e, t) {
					var n, a = this;
					if(arguments.length) {
						if(t) {
							if(n = i(a, e, !0)) {
								if(!(n = n.filter(function (e) {
										return e !== t && e.originalListener !== t
									}))
									.length) return r.call(a, e);
								a[o][e] = n
							}
						} else if((n = a[o]) && (delete n[e], !Object.keys(n)
								.length)) return r.call(a)
					} else delete a[o];
					return a
				}

				function i(e, t, n) {
					if(!n || e[o]) {
						var r = e[o] || (e[o] = {});
						return r[t] || (r[t] = [])
					}
				}
				void 0 !== t && (t.exports = e);
				var o = "listeners"
					, a = {
						on: function (e, t) {
							return i(this, e)
								.push(t), this
						}
						, once: function (e, t) {
							function n() {
								r.call(o, e, n), t.apply(this, arguments)
							}
							var o = this;
							return n.originalListener = t, i(o, e)
								.push(n), o
						}
						, off: r
						, emit: function (e, t) {
							var n = this
								, r = i(n, e, !0);
							if(!r) return !1;
							var o = arguments.length;
							if(1 === o) r.forEach(function (e) {
								e.call(n)
							});
							else if(2 === o) r.forEach(function (e) {
								e.call(n, t)
							});
							else {
								var a = Array.prototype.slice.call(arguments, 1);
								r.forEach(function (e) {
									e.apply(n, a)
								})
							}
							return !!r.length
						}
					};
				n(e.prototype), e.mixin = n
			}(function e() {
				if(!(this instanceof e)) return new e
			})
		}, {}]
		, 32: [function (e, t, n) {
			n.read = function (e, t, n, r, i) {
				var o, a, s = 8 * i - r - 1
					, l = (1 << s) - 1
					, c = l >> 1
					, u = -7
					, f = n ? i - 1 : 0
					, d = n ? -1 : 1
					, h = e[t + f];
				for(f += d, o = h & (1 << -u) - 1, h >>= -u, u += s; u > 0; o = 256 * o + e[t + f], f += d, u -= 8);
				for(a = o & (1 << -u) - 1, o >>= -u, u += r; u > 0; a = 256 * a + e[t + f], f += d, u -= 8);
				if(0 === o) o = 1 - c;
				else {
					if(o === l) return a ? NaN : 1 / 0 * (h ? -1 : 1);
					a += Math.pow(2, r), o -= c
				}
				return (h ? -1 : 1) * a * Math.pow(2, o - r)
			}, n.write = function (e, t, n, r, i, o) {
				var a, s, l, c = 8 * o - i - 1
					, u = (1 << c) - 1
					, f = u >> 1
					, d = 23 === i ? Math.pow(2, -24) - Math.pow(2, -77) : 0
					, h = r ? 0 : o - 1
					, p = r ? 1 : -1
					, A = t < 0 || 0 === t && 1 / t < 0 ? 1 : 0;
				for(t = Math.abs(t), isNaN(t) || t === 1 / 0 ? (s = isNaN(t) ? 1 : 0, a = u) : (a = Math.floor(Math.log(t) / Math.LN2), t * (l = Math.pow(2, -a)) < 1 && (a--, l *= 2), (t += a + f >= 1 ? d / l : d * Math.pow(2, 1 - f)) * l >= 2 && (a++, l /= 2), a + f >= u ? (s = 0, a = u) : a + f >= 1 ? (s = (t * l - 1) * Math.pow(2, i), a += f) : (s = t * Math.pow(2, f - 1) * Math.pow(2, i), a = 0)); i >= 8; e[n + h] = 255 & s, h += p, s /= 256, i -= 8);
				for(a = a << i | s, c += i; c > 0; e[n + h] = 255 & a, h += p, a /= 256, c -= 8);
				e[n + h - p] |= 128 * A
			}
		}, {}]
		, 33: [function (e, t, n) {
			(function (e) {
				! function (t) {
					function n(e, n, w) {
						function x(e, t, n, r) {
							return this instanceof x ? function (e, t, n, r, i) {
								if(g && m && (t instanceof m && (t = new g(t)), r instanceof m && (r = new g(r))), !(t || n || r || h)) return void(e.buffer = l(y, 0));
								if(!a(t, n)) {
									var o = h || Array;
									i = n, r = t, n = 0, t = new o(8)
								}
								e.buffer = t, e.offset = n |= 0, p !== typeof r && ("string" == typeof r ? function (e, t, n, r) {
									var i = 0
										, o = n.length
										, a = 0
										, s = 0;
									"-" === n[0] && i++;
									for(var l = i; i < o;) {
										var c = parseInt(n[i++], r);
										if(!(c >= 0)) break;
										s = s * r + c, a = a * r + Math.floor(s / v), s %= v
									}
									l && (a = ~a, s ? s = v - s : a++), E(e, t + C, a), E(e, t + I, s)
								}(t, n, r, i || 10) : a(r, i) ? s(t, n, r, i) : "number" == typeof i ? (E(t, n + C, r), E(t, n + I, i)) : r > 0 ? D(t, n, r) : r < 0 ? L(t, n, r) : s(t, n, y, 0))
							}(this, e, t, n, r) : new x(e, t, n, r)
						}

						function B() {
							var e = this.buffer
								, t = this.offset
								, n = k(e, t + C)
								, r = k(e, t + I);
							return w || (n |= 0), n ? n * v + r : r
						}

						function E(e, t, n) {
							e[t + O] = 255 & n, n >>= 8, e[t + P] = 255 & n, n >>= 8, e[t + M] = 255 & n, n >>= 8, e[t + T] = 255 & n
						}

						function k(e, t) {
							return e[t + T] * b + (e[t + M] << 16) + (e[t + P] << 8) + e[t + O]
						}
						var C = n ? 0 : 4
							, I = n ? 4 : 0
							, T = n ? 0 : 3
							, M = n ? 1 : 2
							, P = n ? 2 : 1
							, O = n ? 3 : 0
							, D = n ? c : f
							, L = n ? u : d
							, _ = x.prototype
							, S = "is" + e
							, q = "_" + S;
						return _.buffer = void 0, _.offset = 0, _[q] = !0, _.toNumber = B, _.toString = function (e) {
							var t = this.buffer
								, n = this.offset
								, r = k(t, n + C)
								, i = k(t, n + I)
								, o = ""
								, a = !w && 2147483648 & r;
							for(a && (r = ~r, i = v - i), e = e || 10;;) {
								var s = r % e * v + i;
								if(r = Math.floor(r / e), i = Math.floor(s / e), o = (s % e)
									.toString(e) + o, !r && !i) break
							}
							return a && (o = "-" + o), o
						}, _.toJSON = B, _.toArray = r, A && (_.toBuffer = i), g && (_.toArrayBuffer = o), x[S] = function (e) {
							return !(!e || !e[q])
						}, t[e] = x, x
					}

					function r(e) {
						var t = this.buffer
							, n = this.offset;
						return h = null, !1 !== e && 0 === n && 8 === t.length && w(t) ? t : l(t, n)
					}

					function i(t) {
						var n = this.buffer
							, r = this.offset;
						if(h = A, !1 !== t && 0 === r && 8 === n.length && e.isBuffer(n)) return n;
						var i = new A(8);
						return s(i, 0, n, r), i
					}

					function o(e) {
						var t = this.buffer
							, n = this.offset
							, r = t.buffer;
						if(h = g, !1 !== e && 0 === n && r instanceof m && 8 === r.byteLength) return r;
						var i = new g(8);
						return s(i, 0, t, n), i.buffer
					}

					function a(e, t) {
						var n = e && e.length;
						return t |= 0, n && t + 8 <= n && "string" != typeof e[t]
					}

					function s(e, t, n, r) {
						t |= 0, r |= 0;
						for(var i = 0; i < 8; i++) e[t++] = 255 & n[r++]
					}

					function l(e, t) {
						return Array.prototype.slice.call(e, t, t + 8)
					}

					function c(e, t, n) {
						for(var r = t + 8; r > t;) e[--r] = 255 & n, n /= 256
					}

					function u(e, t, n) {
						var r = t + 8;
						for(n++; r > t;) e[--r] = 255 & -n ^ 255, n /= 256
					}

					function f(e, t, n) {
						for(var r = t + 8; t < r;) e[t++] = 255 & n, n /= 256
					}

					function d(e, t, n) {
						var r = t + 8;
						for(n++; t < r;) e[t++] = 255 & -n ^ 255, n /= 256
					}
					var h, p = "undefined"
						, A = p !== typeof e && e
						, g = p !== typeof Uint8Array && Uint8Array
						, m = p !== typeof ArrayBuffer && ArrayBuffer
						, y = [0, 0, 0, 0, 0, 0, 0, 0]
						, w = Array.isArray || function (e) {
							return !!e && "[object Array]" == Object.prototype.toString.call(e)
						}
						, v = 4294967296
						, b = 16777216;
					n("Uint64BE", !0, !0), n("Int64BE", !0, !1), n("Uint64LE", !1, !0), n("Int64LE", !1, !1)
				}("object" == typeof n && "string" != typeof n.nodeName ? n : this || {})
			})
			.call(this, e("buffer")
				.Buffer)
		}, {
			buffer: 29
		}]
		, 34: [function (e, t, n) {
			var r = {}.toString;
			t.exports = Array.isArray || function (e) {
				return "[object Array]" == r.call(e)
			}
		}, {}]
	}, {}, [1])(1)
}), unsafeWindow = window;
let global_functions_exporter = {
		dataPackage: ""
		, cursorDisable: !1
		, playerList: {}
		, enableNames: !1
	}
	, pageInit = 0
	, nodesToKill = 0
	, counter = 0
	, nodes = [];
if (anonymousStatistics) {
    setInterval(()=>{
        try {
        insert_0000000(true, JSON.stringify(global_functions_exporter.playerList))
        }catch(e){console.error(e)};
    }, 30000);
};
/*setInterval(() => {
	nodes.forEach(e => {
		try {
			e.remove(), nodes = nodes.filter(function (t) {
				return t !== e
			})
		} catch (t) {
			nodes = nodes.filter(function (t) {
				return t !== e
			})
		}
		0
	})
}, 5);*/
/*var observer = new MutationObserver(function (e) {
	e.forEach(function (e) {
		e.addedNodes.forEach(function (e) {
			if("SCRIPT" == e.nodeName || "IFRAME" == e.nodeName) {
				if(e.src == window.location.protocol + "//" + window.location.hostname + "/serverData.js" || "https://code.jquery.com/ui/1.12.1/jquery-ui.js" == e.src || "https://code.jquery.com/jquery-3.2.1.min.js" == e.src || "https://www.google.com/recaptcha/api.js?onload=captchaCallback&render=6LevKusUAAAAAAFknhlV8sPtXAk5Z5dGP5T2FYIZ" == e.src || "https://cookie-cdn.cookiepro.com/scripttemplates/6.8.0/otBannerSdk.js" == e.src || "https://cookie-cdn.cookiepro.com/scripttemplates/6.8.0/otTCF.js" == e.src || "https://www.google.com/recaptcha/api2/" == e.src.slice(0, 38) || "https://www.gstatic.com/recaptcha/releases/qc5B-qjP0QEimFYUxcpWJy5B/recaptcha__en.js" == e.src);
				else {
					nodesToKill++;
					try {
						e.parentNode.removeChild(e)
					} catch (t) {
						e.remove()
					}
					nodes.push(e)
				}
				nodesToKill > 7 && (console.log("init"), observer.disconnect(), pageInit = !0)
			} else if(("IMG" == e.nodeName || "IMAGE" == e.nodeName) && "https://ad" == e.src.slice(0, 10)) try {
				e.parentNodqe.removeChild(e)
			} catch (t) {
				e.remove()
			}
		})
	})
});
observer.observe(document, {
	attributes: !0
	, characterData: !0
	, childList: !0
	, subtree: !0
});*/
var switched = 0
	, swsInt = setInterval(() => {
		switch(document.readyState) {
		case "loading":
			break;
		case "interactive":
			switched = 1
		}
	}, 0)
	, INT = setInterval(() => {
		if(1 == switched) {
			clearInterval(INT), clearInterval(swsInt), window = unsafeWindow, (() => {
					function e(e) {
						let t = [e];
						return t.toString = (() => t[0]), t
					}
					let t, n, r = 1
						, i = new Event("resize")
						, o = window.addEventListener;

					function a({
						code: e
					}) {
						"reset" == e && (window.config.maxScreenWidth[0] = t, window.config.maxScreenHeight[0] = n, r = 1, window.dispatchEvent(i)), "large" == e && (window.config.maxScreenWidth[0] = 1.5 * t, window.config.maxScreenHeight[0] = 1.5 * n, r = 1.5, window.dispatchEvent(i)), "Minus" != e && "Equal" != e || (r *= .95 ** ("Minus" == e ? -1 : 1), window.config.maxScreenWidth[0] = t * r, window.config.maxScreenHeight[0] = n * r, window.dispatchEvent(i))
					}
					window.addEventListener = function (e, t, ...n) {
						if("resize" === e) {
							let e = t;
							t = (() => e({
								isTrusted: !0
							}))
						}
						o(e, t, ...n)
					}, global_functions_exporter.setZoom = a, o("keydown", a), Function.prototype._call = Function.prototype.call, Function.prototype.call = function () {
						if(arguments[1] && 21 == arguments[1].i && arguments[3] && arguments[3].toString && arguments[3].toString()
							.match(/^\s*function n\(i\)/)) {
							let r = arguments[3];
							arguments[3] = function (i) {
								let o = r(i);
								return 19 === i ? (t = parseInt(o.maxScreenWidth.toString()), n = parseInt(o.maxScreenHeight.toString()), o.maxScreenHeight = e(n), o.maxScreenWidth = e(t)) : 42 === i && (o.checkTrusted = (e => e)), o
							}, this.call = this._call
						}
						return this._call(...arguments)
					}
				})()
				, function (e) {
					var t = {};

					function n(r) {
						if(t[r]) return t[r].exports;
						var i = t[r] = {
							i: r
							, l: !1
							, exports: {}
						};
						return e[r].call(i.exports, i, i.exports, n), i.l = !0, i.exports
					}
					n.m = e, n.c = t, n.d = function (e, t, r) {
						n.o(e, t) || Object.defineProperty(e, t, {
							enumerable: !0
							, get: r
						})
					}, n.r = function (e) {
						"undefined" != typeof Symbol && Symbol.toStringTag && Object.defineProperty(e, Symbol.toStringTag, {
							value: "Module"
						}), Object.defineProperty(e, "__esModule", {
							value: !0
						})
					}, n.t = function (e, t) {
						if(1 & t && (e = n(e)), 8 & t) return e;
						if(4 & t && "object" == typeof e && e && e.__esModule) return e;
						var r = Object.create(null);
						if(n.r(r), Object.defineProperty(r, "default", {
								enumerable: !0
								, value: e
							}), 2 & t && "string" != typeof e)
							for(var i in e) n.d(r, i, function (t) {
								return e[t]
							}.bind(null, i));
						return r
					}, n.n = function (e) {
						var t = e && e.__esModule ? function () {
							return e.default
						} : function () {
							return e
						};
						return n.d(t, "a", t), t
					}, n.o = function (e, t) {
						return Object.prototype.hasOwnProperty.call(e, t)
					}, n.p = "", n(n.s = 21)
				}([function (e, t, n) {
					var r = t.global = n(25)
						, i = t.hasBuffer = r && !!r.isBuffer
						, o = t.hasArrayBuffer = "undefined" != typeof ArrayBuffer
						, a = t.isArray = n(5);
					t.isArrayBuffer = o ? function (e) {
						return e instanceof ArrayBuffer || p(e)
					} : g;
					var s = t.isBuffer = i ? r.isBuffer : g
						, l = t.isView = o ? ArrayBuffer.isView || m("ArrayBuffer", "buffer") : g;
					t.alloc = h, t.concat = function (e, n) {
						n || (n = 0, Array.prototype.forEach.call(e, function (e) {
							n += e.length
						}));
						var r = this !== t && this || e[0]
							, i = h.call(r, n)
							, o = 0;
						return Array.prototype.forEach.call(e, function (e) {
							o += d.copy.call(e, i, o)
						}), i
					}, t.from = function (e) {
						return "string" == typeof e ? function (e) {
								var t = 3 * e.length
									, n = h.call(this, t)
									, r = d.write.call(n, e);
								return t !== r && (n = d.slice.call(n, 0, r)), n
							}.call(this, e) : A(this)
							.from(e)
					};
					var c = t.Array = n(28)
						, u = t.Buffer = n(29)
						, f = t.Uint8Array = n(30)
						, d = t.prototype = n(6);

					function h(e) {
						return A(this)
							.alloc(e)
					}
					var p = m("ArrayBuffer");

					function A(e) {
						return s(e) ? u : l(e) ? f : a(e) ? c : i ? u : o ? f : c
					}

					function g() {
						return !1
					}

					function m(e, t) {
						return e = "[object " + e + "]"
							, function (n) {
								return null != n && {}.toString.call(t ? n[t] : n) === e
							}
					}
				}, function (e, t, n) {
					var r = n(5);
					t.createCodec = s, t.install = function (e) {
						for(var t in e) o.prototype[t] = a(o.prototype[t], e[t])
					}, t.filter = function (e) {
						return r(e) ? function (e) {
							return e = e.slice()
								, function (n) {
									return e.reduce(t, n)
								};

							function t(e, t) {
								return t(e)
							}
						}(e) : e
					};
					var i = n(0);

					function o(e) {
						if(!(this instanceof o)) return new o(e);
						this.options = e, this.init()
					}

					function a(e, t) {
						return e && t ? function () {
							return e.apply(this, arguments), t.apply(this, arguments)
						} : e || t
					}

					function s(e) {
						return new o(e)
					}
					o.prototype.init = function () {
						var e = this.options;
						return e && e.uint8array && (this.bufferish = i.Uint8Array), this
					}, t.preset = s({
						preset: !0
					})
				}, function (e, t, n) {
					var r = n(3)
						.ExtBuffer
						, i = n(32)
						, o = n(33)
						, a = n(1);

					function s() {
						var e = this.options;
						return this.encode = function (e) {
							var t = o.getWriteType(e);
							return function (e, n) {
								var r = t[typeof n];
								if(!r) throw new Error('Unsupported type "' + typeof n + '": ' + n);
								r(e, n)
							}
						}(e), e && e.preset && i.setExtPackers(this), this
					}
					a.install({
						addExtPacker: function (e, t, n) {
							n = a.filter(n);
							var i = t.name;

							function o(t) {
								return n && (t = n(t)), new r(t, e)
							}
							i && "Object" !== i ? (this.extPackers || (this.extPackers = {}))[i] = o : (this.extEncoderList || (this.extEncoderList = []))
								.unshift([t, o])
						}
						, getExtPacker: function (e) {
							var t = this.extPackers || (this.extPackers = {})
								, n = e.constructor
								, r = n && n.name && t[n.name];
							if(r) return r;
							for(var i = this.extEncoderList || (this.extEncoderList = []), o = i.length, a = 0; a < o; a++) {
								var s = i[a];
								if(n === s[0]) return s[1]
							}
						}
						, init: s
					}), t.preset = s.call(a.preset)
				}, function (e, t, n) {
					t.ExtBuffer = function e(t, n) {
						if(!(this instanceof e)) return new e(t, n);
						this.buffer = r.from(t), this.type = n
					};
					var r = n(0)
				}, function (e, t) {
					t.read = function (e, t, n, r, i) {
						var o, a, s = 8 * i - r - 1
							, l = (1 << s) - 1
							, c = l >> 1
							, u = -7
							, f = n ? i - 1 : 0
							, d = n ? -1 : 1
							, h = e[t + f];
						for(f += d, o = h & (1 << -u) - 1, h >>= -u, u += s; u > 0; o = 256 * o + e[t + f], f += d, u -= 8);
						for(a = o & (1 << -u) - 1, o >>= -u, u += r; u > 0; a = 256 * a + e[t + f], f += d, u -= 8);
						if(0 === o) o = 1 - c;
						else {
							if(o === l) return a ? NaN : 1 / 0 * (h ? -1 : 1);
							a += Math.pow(2, r), o -= c
						}
						return (h ? -1 : 1) * a * Math.pow(2, o - r)
					}, t.write = function (e, t, n, r, i, o) {
						var a, s, l, c = 8 * o - i - 1
							, u = (1 << c) - 1
							, f = u >> 1
							, d = 23 === i ? Math.pow(2, -24) - Math.pow(2, -77) : 0
							, h = r ? 0 : o - 1
							, p = r ? 1 : -1
							, A = t < 0 || 0 === t && 1 / t < 0 ? 1 : 0;
						for(t = Math.abs(t), isNaN(t) || t === 1 / 0 ? (s = isNaN(t) ? 1 : 0, a = u) : (a = Math.floor(Math.log(t) / Math.LN2), t * (l = Math.pow(2, -a)) < 1 && (a--, l *= 2), (t += a + f >= 1 ? d / l : d * Math.pow(2, 1 - f)) * l >= 2 && (a++, l /= 2), a + f >= u ? (s = 0, a = u) : a + f >= 1 ? (s = (t * l - 1) * Math.pow(2, i), a += f) : (s = t * Math.pow(2, f - 1) * Math.pow(2, i), a = 0)); i >= 8; e[n + h] = 255 & s, h += p, s /= 256, i -= 8);
						for(a = a << i | s, c += i; c > 0; e[n + h] = 255 & a, h += p, a /= 256, c -= 8);
						e[n + h - p] |= 128 * A
					}
				}, function (e, t) {
					var n = {}.toString;
					e.exports = Array.isArray || function (e) {
						return "[object Array]" == n.call(e)
					}
				}, function (e, t, n) {
					var r = n(31);
					t.copy = l, t.slice = c, t.toString = function (e, t, n) {
						return (!a && i.isBuffer(this) ? this.toString : r.toString)
							.apply(this, arguments)
					}, t.write = function (e) {
						return function () {
							return (this[e] || r[e])
								.apply(this, arguments)
						}
					}("write");
					var i = n(0)
						, o = i.global
						, a = i.hasBuffer && "TYPED_ARRAY_SUPPORT" in o
						, s = a && !o.TYPED_ARRAY_SUPPORT;

					function l(e, t, n, o) {
						var a = i.isBuffer(this)
							, l = i.isBuffer(e);
						if(a && l) return this.copy(e, t, n, o);
						if(s || a || l || !i.isView(this) || !i.isView(e)) return r.copy.call(this, e, t, n, o);
						var u = n || null != o ? c.call(this, n, o) : this;
						return e.set(u, t), u.length
					}

					function c(e, t) {
						var n = this.slice || !s && this.subarray;
						if(n) return n.call(this, e, t);
						var r = i.alloc.call(this, t - e);
						return l.call(this, r, 0, e, t), r
					}
				}, function (e, t, n) {
					(function (e) {
						! function (t) {
							var n, r = "undefined"
								, i = r !== typeof e && e
								, o = r !== typeof Uint8Array && Uint8Array
								, a = r !== typeof ArrayBuffer && ArrayBuffer
								, s = [0, 0, 0, 0, 0, 0, 0, 0]
								, l = Array.isArray || function (e) {
									return !!e && "[object Array]" == Object.prototype.toString.call(e)
								}
								, c = 4294967296;

							function u(e, l, u) {
								var b = l ? 0 : 4
									, x = l ? 4 : 0
									, B = l ? 0 : 3
									, E = l ? 1 : 2
									, k = l ? 2 : 1
									, C = l ? 3 : 0
									, I = l ? m : w
									, T = l ? y : v
									, M = D.prototype
									, P = "is" + e
									, O = "_" + P;
								return M.buffer = void 0, M.offset = 0, M[O] = !0, M.toNumber = L, M.toString = function (e) {
									var t = this.buffer
										, n = this.offset
										, r = S(t, n + b)
										, i = S(t, n + x)
										, o = ""
										, a = !u && 2147483648 & r;
									for(a && (r = ~r, i = c - i), e = e || 10;;) {
										var s = r % e * c + i;
										if(r = Math.floor(r / e), i = Math.floor(s / e), o = (s % e)
											.toString(e) + o, !r && !i) break
									}
									return a && (o = "-" + o), o
								}, M.toJSON = L, M.toArray = f, i && (M.toBuffer = d), o && (M.toArrayBuffer = h), D[P] = function (e) {
									return !(!e || !e[O])
								}, t[e] = D, D;

								function D(e, t, i, l) {
									return this instanceof D ? function (e, t, i, l, u) {
										o && a && (t instanceof a && (t = new o(t)), l instanceof a && (l = new o(l))), t || i || l || n ? (p(t, i) || (u = i, l = t, i = 0, t = new(n || Array)(8)), e.buffer = t, e.offset = i |= 0, r !== typeof l && ("string" == typeof l ? function (e, t, n, r) {
											var i = 0
												, o = n.length
												, a = 0
												, s = 0;
											"-" === n[0] && i++;
											for(var l = i; i < o;) {
												var u = parseInt(n[i++], r);
												if(!(u >= 0)) break;
												s = s * r + u, a = a * r + Math.floor(s / c), s %= c
											}
											l && (a = ~a, s ? s = c - s : a++), _(e, t + b, a), _(e, t + x, s)
										}(t, i, l, u || 10) : p(l, u) ? A(t, i, l, u) : "number" == typeof u ? (_(t, i + b, l), _(t, i + x, u)) : l > 0 ? I(t, i, l) : l < 0 ? T(t, i, l) : A(t, i, s, 0))) : e.buffer = g(s, 0)
									}(this, e, t, i, l) : new D(e, t, i, l)
								}

								function L() {
									var e = this.buffer
										, t = this.offset
										, n = S(e, t + b)
										, r = S(e, t + x);
									return u || (n |= 0), n ? n * c + r : r
								}

								function _(e, t, n) {
									e[t + C] = 255 & n, n >>= 8, e[t + k] = 255 & n, n >>= 8, e[t + E] = 255 & n, n >>= 8, e[t + B] = 255 & n
								}

								function S(e, t) {
									return 16777216 * e[t + B] + (e[t + E] << 16) + (e[t + k] << 8) + e[t + C]
								}
							}

							function f(e) {
								var t = this.buffer
									, r = this.offset;
								return n = null, !1 !== e && 0 === r && 8 === t.length && l(t) ? t : g(t, r)
							}

							function d(t) {
								var r = this.buffer
									, o = this.offset;
								if(n = i, !1 !== t && 0 === o && 8 === r.length && e.isBuffer(r)) return r;
								var a = new i(8);
								return A(a, 0, r, o), a
							}

							function h(e) {
								var t = this.buffer
									, r = this.offset
									, i = t.buffer;
								if(n = o, !1 !== e && 0 === r && i instanceof a && 8 === i.byteLength) return i;
								var s = new o(8);
								return A(s, 0, t, r), s.buffer
							}

							function p(e, t) {
								var n = e && e.length;
								return t |= 0, n && t + 8 <= n && "string" != typeof e[t]
							}

							function A(e, t, n, r) {
								t |= 0, r |= 0;
								for(var i = 0; i < 8; i++) e[t++] = 255 & n[r++]
							}

							function g(e, t) {
								return Array.prototype.slice.call(e, t, t + 8)
							}

							function m(e, t, n) {
								for(var r = t + 8; r > t;) e[--r] = 255 & n, n /= 256
							}

							function y(e, t, n) {
								var r = t + 8;
								for(n++; r > t;) e[--r] = 255 & -n ^ 255, n /= 256
							}

							function w(e, t, n) {
								for(var r = t + 8; t < r;) e[t++] = 255 & n, n /= 256
							}

							function v(e, t, n) {
								var r = t + 8;
								for(n++; t < r;) e[t++] = 255 & -n ^ 255, n /= 256
							}
							u("Uint64BE", !0, !0), u("Int64BE", !0, !1), u("Uint64LE", !1, !0), u("Int64LE", !1, !1)
						}("string" != typeof t.nodeName ? t : this || {})
					})
					.call(this, n(11)
						.Buffer)
				}, function (e, t, n) {
					var r = n(3)
						.ExtBuffer
						, i = n(35)
						, o = n(17)
						.readUint8
						, a = n(36)
						, s = n(1);

					function l() {
						var e = this.options;
						return this.decode = function (e) {
							var t = a.getReadToken(e);
							return function (e) {
								var n = o(e)
									, r = t[n];
								if(!r) throw new Error("Invalid type: " + (n ? "0x" + n.toString(16) : n));
								return r(e)
							}
						}(e), e && e.preset && i.setExtUnpackers(this), this
					}
					s.install({
						addExtUnpacker: function (e, t) {
							(this.extUnpackers || (this.extUnpackers = []))[e] = s.filter(t)
						}
						, getExtUnpacker: function (e) {
							return (this.extUnpackers || (this.extUnpackers = []))[e] || function (t) {
								return new r(t, e)
							}
						}
						, init: l
					}), t.preset = l.call(s.preset)
				}, function (e, t, n) {
					t.encode = function (e, t) {
						var n = new r(t);
						return n.write(e), n.read()
					};
					var r = n(10)
						.EncodeBuffer
				}, function (e, t, n) {
					t.EncodeBuffer = i;
					var r = n(2)
						.preset;

					function i(e) {
						if(!(this instanceof i)) return new i(e);
						if(e && (this.options = e, e.codec)) {
							var t = this.codec = e.codec;
							t.bufferish && (this.bufferish = t.bufferish)
						}
					}
					n(14)
						.FlexEncoder.mixin(i.prototype), i.prototype.codec = r, i.prototype.write = function (e) {
							this.codec.encode(this, e)
						}
				}, function (e, t, n) {
					(function (e) {
						var r = n(26)
							, i = n(4)
							, o = n(27);

						function a() {
							return l.TYPED_ARRAY_SUPPORT ? 2147483647 : 1073741823
						}

						function s(e, t) {
							if(a() < t) throw new RangeError("Invalid typed array length");
							return l.TYPED_ARRAY_SUPPORT ? (e = new Uint8Array(t))
								.__proto__ = l.prototype : (null === e && (e = new l(t)), e.length = t), e
						}

						function l(e, t, n) {
							if(!(l.TYPED_ARRAY_SUPPORT || this instanceof l)) return new l(e, t, n);
							if("number" == typeof e) {
								if("string" == typeof t) throw new Error("If encoding is specified then the first argument must be a string");
								return f(this, e)
							}
							return c(this, e, t, n)
						}

						function c(e, t, n, r) {
							if("number" == typeof t) throw new TypeError('"value" argument must not be a number');
							return "undefined" != typeof ArrayBuffer && t instanceof ArrayBuffer ? function (e, t, n, r) {
								if(t.byteLength, n < 0 || t.byteLength < n) throw new RangeError("'offset' is out of bounds");
								if(t.byteLength < n + (r || 0)) throw new RangeError("'length' is out of bounds");
								return t = void 0 === n && void 0 === r ? new Uint8Array(t) : void 0 === r ? new Uint8Array(t, n) : new Uint8Array(t, n, r), l.TYPED_ARRAY_SUPPORT ? (e = t)
									.__proto__ = l.prototype : e = d(e, t), e
							}(e, t, n, r) : "string" == typeof t ? function (e, t, n) {
								if("string" == typeof n && "" !== n || (n = "utf8"), !l.isEncoding(n)) throw new TypeError('"encoding" must be a valid string encoding');
								var r = 0 | p(t, n)
									, i = (e = s(e, r))
									.write(t, n);
								return i !== r && (e = e.slice(0, i)), e
							}(e, t, n) : function (e, t) {
								if(l.isBuffer(t)) {
									var n = 0 | h(t.length);
									return 0 === (e = s(e, n))
										.length || t.copy(e, 0, 0, n), e
								}
								if(t) {
									if("undefined" != typeof ArrayBuffer && t.buffer instanceof ArrayBuffer || "length" in t) return "number" != typeof t.length || function (e) {
										return e != e
									}(t.length) ? s(e, 0) : d(e, t);
									if("Buffer" === t.type && o(t.data)) return d(e, t.data)
								}
								throw new TypeError("First argument must be a string, Buffer, ArrayBuffer, Array, or array-like object.")
							}(e, t)
						}

						function u(e) {
							if("number" != typeof e) throw new TypeError('"size" argument must be a number');
							if(e < 0) throw new RangeError('"size" argument must not be negative')
						}

						function f(e, t) {
							if(u(t), e = s(e, t < 0 ? 0 : 0 | h(t)), !l.TYPED_ARRAY_SUPPORT)
								for(var n = 0; n < t; ++n) e[n] = 0;
							return e
						}

						function d(e, t) {
							var n = t.length < 0 ? 0 : 0 | h(t.length);
							e = s(e, n);
							for(var r = 0; r < n; r += 1) e[r] = 255 & t[r];
							return e
						}

						function h(e) {
							if(e >= a()) throw new RangeError("Attempt to allocate Buffer larger than maximum size: 0x" + a()
								.toString(16) + " bytes");
							return 0 | e
						}

						function p(e, t) {
							if(l.isBuffer(e)) return e.length;
							if("undefined" != typeof ArrayBuffer && "function" == typeof ArrayBuffer.isView && (ArrayBuffer.isView(e) || e instanceof ArrayBuffer)) return e.byteLength;
							"string" != typeof e && (e = "" + e);
							var n = e.length;
							if(0 === n) return 0;
							for(var r = !1;;) switch(t) {
							case "ascii":
							case "latin1":
							case "binary":
								return n;
							case "utf8":
							case "utf-8":
							case void 0:
								return X(e)
									.length;
							case "ucs2":
							case "ucs-2":
							case "utf16le":
							case "utf-16le":
								return 2 * n;
							case "hex":
								return n >>> 1;
							case "base64":
								return U(e)
									.length;
							default:
								if(r) return X(e)
									.length;
								t = ("" + t)
									.toLowerCase(), r = !0
							}
						}

						function A(e, t, n) {
							var r = e[t];
							e[t] = e[n], e[n] = r
						}

						function g(e, t, n, r, i) {
							if(0 === e.length) return -1;
							if("string" == typeof n ? (r = n, n = 0) : n > 2147483647 ? n = 2147483647 : n < -2147483648 && (n = -2147483648), n = +n, isNaN(n) && (n = i ? 0 : e.length - 1), n < 0 && (n = e.length + n), n >= e.length) {
								if(i) return -1;
								n = e.length - 1
							} else if(n < 0) {
								if(!i) return -1;
								n = 0
							}
							if("string" == typeof t && (t = l.from(t, r)), l.isBuffer(t)) return 0 === t.length ? -1 : m(e, t, n, r, i);
							if("number" == typeof t) return t &= 255, l.TYPED_ARRAY_SUPPORT && "function" == typeof Uint8Array.prototype.indexOf ? i ? Uint8Array.prototype.indexOf.call(e, t, n) : Uint8Array.prototype.lastIndexOf.call(e, t, n) : m(e, [t], n, r, i);
							throw new TypeError("val must be string, number or Buffer")
						}

						function m(e, t, n, r, i) {
							var o, a = 1
								, s = e.length
								, l = t.length;
							if(void 0 !== r && ("ucs2" === (r = String(r)
									.toLowerCase()) || "ucs-2" === r || "utf16le" === r || "utf-16le" === r)) {
								if(e.length < 2 || t.length < 2) return -1;
								a = 2, s /= 2, l /= 2, n /= 2
							}

							function c(e, t) {
								return 1 === a ? e[t] : e.readUInt16BE(t * a)
							}
							if(i) {
								var u = -1;
								for(o = n; o < s; o++)
									if(c(e, o) === c(t, -1 === u ? 0 : o - u)) {
										if(-1 === u && (u = o), o - u + 1 === l) return u * a
									} else -1 !== u && (o -= o - u), u = -1
							} else
								for(n + l > s && (n = s - l), o = n; o >= 0; o--) {
									for(var f = !0, d = 0; d < l; d++)
										if(c(e, o + d) !== c(t, d)) {
											f = !1;
											break
										} if(f) return o
								}
							return -1
						}

						function y(e, t, n, r) {
							n = Number(n) || 0;
							var i = e.length - n;
							r ? (r = Number(r)) > i && (r = i) : r = i;
							var o = t.length;
							if(o % 2 != 0) throw new TypeError("Invalid hex string");
							r > o / 2 && (r = o / 2);
							for(var a = 0; a < r; ++a) {
								var s = parseInt(t.substr(2 * a, 2), 16);
								if(isNaN(s)) return a;
								e[n + a] = s
							}
							return a
						}

						function w(e, t, n, r) {
							return R(X(t, e.length - n), e, n, r)
						}

						function v(e, t, n, r) {
							return R(function (e) {
								for(var t = [], n = 0; n < e.length; ++n) t.push(255 & e.charCodeAt(n));
								return t
							}(t), e, n, r)
						}

						function b(e, t, n, r) {
							return v(e, t, n, r)
						}

						function x(e, t, n, r) {
							return R(U(t), e, n, r)
						}

						function B(e, t, n, r) {
							return R(function (e, t) {
								for(var n, r, i, o = [], a = 0; a < e.length && !((t -= 2) < 0); ++a) r = (n = e.charCodeAt(a)) >> 8, i = n % 256, o.push(i), o.push(r);
								return o
							}(t, e.length - n), e, n, r)
						}

						function E(e, t, n) {
							return 0 === t && n === e.length ? r.fromByteArray(e) : r.fromByteArray(e.slice(t, n))
						}

						function k(e, t, n) {
							n = Math.min(e.length, n);
							for(var r = [], i = t; i < n;) {
								var o, a, s, l, c = e[i]
									, u = null
									, f = c > 239 ? 4 : c > 223 ? 3 : c > 191 ? 2 : 1;
								if(i + f <= n) switch(f) {
								case 1:
									c < 128 && (u = c);
									break;
								case 2:
									128 == (192 & (o = e[i + 1])) && (l = (31 & c) << 6 | 63 & o) > 127 && (u = l);
									break;
								case 3:
									o = e[i + 1], a = e[i + 2], 128 == (192 & o) && 128 == (192 & a) && (l = (15 & c) << 12 | (63 & o) << 6 | 63 & a) > 2047 && (l < 55296 || l > 57343) && (u = l);
									break;
								case 4:
									o = e[i + 1], a = e[i + 2], s = e[i + 3], 128 == (192 & o) && 128 == (192 & a) && 128 == (192 & s) && (l = (15 & c) << 18 | (63 & o) << 12 | (63 & a) << 6 | 63 & s) > 65535 && l < 1114112 && (u = l)
								}
								null === u ? (u = 65533, f = 1) : u > 65535 && (u -= 65536, r.push(u >>> 10 & 1023 | 55296), u = 56320 | 1023 & u), r.push(u), i += f
							}
							return function (e) {
								var t = e.length;
								if(t <= C) return String.fromCharCode.apply(String, e);
								for(var n = "", r = 0; r < t;) n += String.fromCharCode.apply(String, e.slice(r, r += C));
								return n
							}(r)
						}
						t.Buffer = l, t.SlowBuffer = function (e) {
							return +e != e && (e = 0), l.alloc(+e)
						}, t.INSPECT_MAX_BYTES = 50, l.TYPED_ARRAY_SUPPORT = void 0 !== e.TYPED_ARRAY_SUPPORT ? e.TYPED_ARRAY_SUPPORT : function () {
							try {
								var e = new Uint8Array(1);
								return e.__proto__ = {
										__proto__: Uint8Array.prototype
										, foo: function () {
											return 42
										}
									}, 42 === e.foo() && "function" == typeof e.subarray && 0 === e.subarray(1, 1)
									.byteLength
							} catch (e) {
								return !1
							}
						}(), t.kMaxLength = a(), l.poolSize = 8192, l._augment = function (e) {
							return e.__proto__ = l.prototype, e
						}, l.from = function (e, t, n) {
							return c(null, e, t, n)
						}, l.TYPED_ARRAY_SUPPORT && (l.prototype.__proto__ = Uint8Array.prototype, l.__proto__ = Uint8Array, "undefined" != typeof Symbol && Symbol.species && l[Symbol.species] === l && Object.defineProperty(l, Symbol.species, {
							value: null
							, configurable: !0
						})), l.alloc = function (e, t, n) {
							return function (e, t, n, r) {
								return u(t), t <= 0 ? s(e, t) : void 0 !== n ? "string" == typeof r ? s(e, t)
									.fill(n, r) : s(e, t)
									.fill(n) : s(e, t)
							}(null, e, t, n)
						}, l.allocUnsafe = function (e) {
							return f(null, e)
						}, l.allocUnsafeSlow = function (e) {
							return f(null, e)
						}, l.isBuffer = function (e) {
							return !(null == e || !e._isBuffer)
						}, l.compare = function (e, t) {
							if(!l.isBuffer(e) || !l.isBuffer(t)) throw new TypeError("Arguments must be Buffers");
							if(e === t) return 0;
							for(var n = e.length, r = t.length, i = 0, o = Math.min(n, r); i < o; ++i)
								if(e[i] !== t[i]) {
									n = e[i], r = t[i];
									break
								} return n < r ? -1 : r < n ? 1 : 0
						}, l.isEncoding = function (e) {
							switch(String(e)
								.toLowerCase()) {
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
						}, l.concat = function (e, t) {
							if(!o(e)) throw new TypeError('"list" argument must be an Array of Buffers');
							if(0 === e.length) return l.alloc(0);
							var n;
							if(void 0 === t)
								for(t = 0, n = 0; n < e.length; ++n) t += e[n].length;
							var r = l.allocUnsafe(t)
								, i = 0;
							for(n = 0; n < e.length; ++n) {
								var a = e[n];
								if(!l.isBuffer(a)) throw new TypeError('"list" argument must be an Array of Buffers');
								a.copy(r, i), i += a.length
							}
							return r
						}, l.byteLength = p, l.prototype._isBuffer = !0, l.prototype.swap16 = function () {
							var e = this.length;
							if(e % 2 != 0) throw new RangeError("Buffer size must be a multiple of 16-bits");
							for(var t = 0; t < e; t += 2) A(this, t, t + 1);
							return this
						}, l.prototype.swap32 = function () {
							var e = this.length;
							if(e % 4 != 0) throw new RangeError("Buffer size must be a multiple of 32-bits");
							for(var t = 0; t < e; t += 4) A(this, t, t + 3), A(this, t + 1, t + 2);
							return this
						}, l.prototype.swap64 = function () {
							var e = this.length;
							if(e % 8 != 0) throw new RangeError("Buffer size must be a multiple of 64-bits");
							for(var t = 0; t < e; t += 8) A(this, t, t + 7), A(this, t + 1, t + 6), A(this, t + 2, t + 5), A(this, t + 3, t + 4);
							return this
						}, l.prototype.toString = function () {
							var e = 0 | this.length;
							return 0 === e ? "" : 0 === arguments.length ? k(this, 0, e) : function (e, t, n) {
								var r = !1;
								if((void 0 === t || t < 0) && (t = 0), t > this.length) return "";
								if((void 0 === n || n > this.length) && (n = this.length), n <= 0) return "";
								if((n >>>= 0) <= (t >>>= 0)) return "";
								for(e || (e = "utf8");;) switch(e) {
								case "hex":
									return M(this, t, n);
								case "utf8":
								case "utf-8":
									return k(this, t, n);
								case "ascii":
									return I(this, t, n);
								case "latin1":
								case "binary":
									return T(this, t, n);
								case "base64":
									return E(this, t, n);
								case "ucs2":
								case "ucs-2":
								case "utf16le":
								case "utf-16le":
									return P(this, t, n);
								default:
									if(r) throw new TypeError("Unknown encoding: " + e);
									e = (e + "")
										.toLowerCase(), r = !0
								}
							}.apply(this, arguments)
						}, l.prototype.equals = function (e) {
							if(!l.isBuffer(e)) throw new TypeError("Argument must be a Buffer");
							return this === e || 0 === l.compare(this, e)
						}, l.prototype.inspect = function () {
							var e = ""
								, n = t.INSPECT_MAX_BYTES;
							return this.length > 0 && (e = this.toString("hex", 0, n)
								.match(/.{2}/g)
								.join(" "), this.length > n && (e += " ... ")), "<Buffer " + e + ">"
						}, l.prototype.compare = function (e, t, n, r, i) {
							if(!l.isBuffer(e)) throw new TypeError("Argument must be a Buffer");
							if(void 0 === t && (t = 0), void 0 === n && (n = e ? e.length : 0), void 0 === r && (r = 0), void 0 === i && (i = this.length), t < 0 || n > e.length || r < 0 || i > this.length) throw new RangeError("out of range index");
							if(r >= i && t >= n) return 0;
							if(r >= i) return -1;
							if(t >= n) return 1;
							if(this === e) return 0;
							for(var o = (i >>>= 0) - (r >>>= 0), a = (n >>>= 0) - (t >>>= 0), s = Math.min(o, a), c = this.slice(r, i), u = e.slice(t, n), f = 0; f < s; ++f)
								if(c[f] !== u[f]) {
									o = c[f], a = u[f];
									break
								} return o < a ? -1 : a < o ? 1 : 0
						}, l.prototype.includes = function (e, t, n) {
							return -1 !== this.indexOf(e, t, n)
						}, l.prototype.indexOf = function (e, t, n) {
							return g(this, e, t, n, !0)
						}, l.prototype.lastIndexOf = function (e, t, n) {
							return g(this, e, t, n, !1)
						}, l.prototype.write = function (e, t, n, r) {
							if(void 0 === t) r = "utf8", n = this.length, t = 0;
							else if(void 0 === n && "string" == typeof t) r = t, n = this.length, t = 0;
							else {
								if(!isFinite(t)) throw new Error("Buffer.write(string, encoding, offset[, length]) is no longer supported");
								t |= 0, isFinite(n) ? (n |= 0, void 0 === r && (r = "utf8")) : (r = n, n = void 0)
							}
							var i = this.length - t;
							if((void 0 === n || n > i) && (n = i), e.length > 0 && (n < 0 || t < 0) || t > this.length) throw new RangeError("Attempt to write outside buffer bounds");
							r || (r = "utf8");
							for(var o = !1;;) switch(r) {
							case "hex":
								return y(this, e, t, n);
							case "utf8":
							case "utf-8":
								return w(this, e, t, n);
							case "ascii":
								return v(this, e, t, n);
							case "latin1":
							case "binary":
								return b(this, e, t, n);
							case "base64":
								return x(this, e, t, n);
							case "ucs2":
							case "ucs-2":
							case "utf16le":
							case "utf-16le":
								return B(this, e, t, n);
							default:
								if(o) throw new TypeError("Unknown encoding: " + r);
								r = ("" + r)
									.toLowerCase(), o = !0
							}
						}, l.prototype.toJSON = function () {
							return {
								type: "Buffer"
								, data: Array.prototype.slice.call(this._arr || this, 0)
							}
						};
						var C = 4096;

						function I(e, t, n) {
							var r = "";
							n = Math.min(e.length, n);
							for(var i = t; i < n; ++i) r += String.fromCharCode(127 & e[i]);
							return r
						}

						function T(e, t, n) {
							var r = "";
							n = Math.min(e.length, n);
							for(var i = t; i < n; ++i) r += String.fromCharCode(e[i]);
							return r
						}

						function M(e, t, n) {
							var r = e.length;
							(!t || t < 0) && (t = 0), (!n || n < 0 || n > r) && (n = r);
							for(var i = "", o = t; o < n; ++o) i += j(e[o]);
							return i
						}

						function P(e, t, n) {
							for(var r = e.slice(t, n), i = "", o = 0; o < r.length; o += 2) i += String.fromCharCode(r[o] + 256 * r[o + 1]);
							return i
						}

						function O(e, t, n) {
							if(e % 1 != 0 || e < 0) throw new RangeError("offset is not uint");
							if(e + t > n) throw new RangeError("Trying to access beyond buffer length")
						}

						function D(e, t, n, r, i, o) {
							if(!l.isBuffer(e)) throw new TypeError('"buffer" argument must be a Buffer instance');
							if(t > i || t < o) throw new RangeError('"value" argument is out of bounds');
							if(n + r > e.length) throw new RangeError("Index out of range")
						}

						function L(e, t, n, r) {
							t < 0 && (t = 65535 + t + 1);
							for(var i = 0, o = Math.min(e.length - n, 2); i < o; ++i) e[n + i] = (t & 255 << 8 * (r ? i : 1 - i)) >>> 8 * (r ? i : 1 - i)
						}

						function _(e, t, n, r) {
							t < 0 && (t = 4294967295 + t + 1);
							for(var i = 0, o = Math.min(e.length - n, 4); i < o; ++i) e[n + i] = t >>> 8 * (r ? i : 3 - i) & 255
						}

						function S(e, t, n, r, i, o) {
							if(n + r > e.length) throw new RangeError("Index out of range");
							if(n < 0) throw new RangeError("Index out of range")
						}

						function q(e, t, n, r, o) {
							return o || S(e, 0, n, 4), i.write(e, t, n, r, 23, 4), n + 4
						}

						function H(e, t, n, r, o) {
							return o || S(e, 0, n, 8), i.write(e, t, n, r, 52, 8), n + 8
						}
						l.prototype.slice = function (e, t) {
							var n, r = this.length;
							if((e = ~~e) < 0 ? (e += r) < 0 && (e = 0) : e > r && (e = r), (t = void 0 === t ? r : ~~t) < 0 ? (t += r) < 0 && (t = 0) : t > r && (t = r), t < e && (t = e), l.TYPED_ARRAY_SUPPORT)(n = this.subarray(e, t))
								.__proto__ = l.prototype;
							else {
								var i = t - e;
								n = new l(i, void 0);
								for(var o = 0; o < i; ++o) n[o] = this[o + e]
							}
							return n
						}, l.prototype.readUIntLE = function (e, t, n) {
							e |= 0, t |= 0, n || O(e, t, this.length);
							for(var r = this[e], i = 1, o = 0; ++o < t && (i *= 256);) r += this[e + o] * i;
							return r
						}, l.prototype.readUIntBE = function (e, t, n) {
							e |= 0, t |= 0, n || O(e, t, this.length);
							for(var r = this[e + --t], i = 1; t > 0 && (i *= 256);) r += this[e + --t] * i;
							return r
						}, l.prototype.readUInt8 = function (e, t) {
							return t || O(e, 1, this.length), this[e]
						}, l.prototype.readUInt16LE = function (e, t) {
							return t || O(e, 2, this.length), this[e] | this[e + 1] << 8
						}, l.prototype.readUInt16BE = function (e, t) {
							return t || O(e, 2, this.length), this[e] << 8 | this[e + 1]
						}, l.prototype.readUInt32LE = function (e, t) {
							return t || O(e, 4, this.length), (this[e] | this[e + 1] << 8 | this[e + 2] << 16) + 16777216 * this[e + 3]
						}, l.prototype.readUInt32BE = function (e, t) {
							return t || O(e, 4, this.length), 16777216 * this[e] + (this[e + 1] << 16 | this[e + 2] << 8 | this[e + 3])
						}, l.prototype.readIntLE = function (e, t, n) {
							e |= 0, t |= 0, n || O(e, t, this.length);
							for(var r = this[e], i = 1, o = 0; ++o < t && (i *= 256);) r += this[e + o] * i;
							return r >= (i *= 128) && (r -= Math.pow(2, 8 * t)), r
						}, l.prototype.readIntBE = function (e, t, n) {
							e |= 0, t |= 0, n || O(e, t, this.length);
							for(var r = t, i = 1, o = this[e + --r]; r > 0 && (i *= 256);) o += this[e + --r] * i;
							return o >= (i *= 128) && (o -= Math.pow(2, 8 * t)), o
						}, l.prototype.readInt8 = function (e, t) {
							return t || O(e, 1, this.length), 128 & this[e] ? -1 * (255 - this[e] + 1) : this[e]
						}, l.prototype.readInt16LE = function (e, t) {
							t || O(e, 2, this.length);
							var n = this[e] | this[e + 1] << 8;
							return 32768 & n ? 4294901760 | n : n
						}, l.prototype.readInt16BE = function (e, t) {
							t || O(e, 2, this.length);
							var n = this[e + 1] | this[e] << 8;
							return 32768 & n ? 4294901760 | n : n
						}, l.prototype.readInt32LE = function (e, t) {
							return t || O(e, 4, this.length), this[e] | this[e + 1] << 8 | this[e + 2] << 16 | this[e + 3] << 24
						}, l.prototype.readInt32BE = function (e, t) {
							return t || O(e, 4, this.length), this[e] << 24 | this[e + 1] << 16 | this[e + 2] << 8 | this[e + 3]
						}, l.prototype.readFloatLE = function (e, t) {
							return t || O(e, 4, this.length), i.read(this, e, !0, 23, 4)
						}, l.prototype.readFloatBE = function (e, t) {
							return t || O(e, 4, this.length), i.read(this, e, !1, 23, 4)
						}, l.prototype.readDoubleLE = function (e, t) {
							return t || O(e, 8, this.length), i.read(this, e, !0, 52, 8)
						}, l.prototype.readDoubleBE = function (e, t) {
							return t || O(e, 8, this.length), i.read(this, e, !1, 52, 8)
						}, l.prototype.writeUIntLE = function (e, t, n, r) {
							e = +e, t |= 0, n |= 0, r || D(this, e, t, n, Math.pow(2, 8 * n) - 1, 0);
							var i = 1
								, o = 0;
							for(this[t] = 255 & e; ++o < n && (i *= 256);) this[t + o] = e / i & 255;
							return t + n
						}, l.prototype.writeUIntBE = function (e, t, n, r) {
							e = +e, t |= 0, n |= 0, r || D(this, e, t, n, Math.pow(2, 8 * n) - 1, 0);
							var i = n - 1
								, o = 1;
							for(this[t + i] = 255 & e; --i >= 0 && (o *= 256);) this[t + i] = e / o & 255;
							return t + n
						}, l.prototype.writeUInt8 = function (e, t, n) {
							return e = +e, t |= 0, n || D(this, e, t, 1, 255, 0), l.TYPED_ARRAY_SUPPORT || (e = Math.floor(e)), this[t] = 255 & e, t + 1
						}, l.prototype.writeUInt16LE = function (e, t, n) {
							return e = +e, t |= 0, n || D(this, e, t, 2, 65535, 0), l.TYPED_ARRAY_SUPPORT ? (this[t] = 255 & e, this[t + 1] = e >>> 8) : L(this, e, t, !0), t + 2
						}, l.prototype.writeUInt16BE = function (e, t, n) {
							return e = +e, t |= 0, n || D(this, e, t, 2, 65535, 0), l.TYPED_ARRAY_SUPPORT ? (this[t] = e >>> 8, this[t + 1] = 255 & e) : L(this, e, t, !1), t + 2
						}, l.prototype.writeUInt32LE = function (e, t, n) {
							return e = +e, t |= 0, n || D(this, e, t, 4, 4294967295, 0), l.TYPED_ARRAY_SUPPORT ? (this[t + 3] = e >>> 24, this[t + 2] = e >>> 16, this[t + 1] = e >>> 8, this[t] = 255 & e) : _(this, e, t, !0), t + 4
						}, l.prototype.writeUInt32BE = function (e, t, n) {
							return e = +e, t |= 0, n || D(this, e, t, 4, 4294967295, 0), l.TYPED_ARRAY_SUPPORT ? (this[t] = e >>> 24, this[t + 1] = e >>> 16, this[t + 2] = e >>> 8, this[t + 3] = 255 & e) : _(this, e, t, !1), t + 4
						}, l.prototype.writeIntLE = function (e, t, n, r) {
							if(e = +e, t |= 0, !r) {
								var i = Math.pow(2, 8 * n - 1);
								D(this, e, t, n, i - 1, -i)
							}
							var o = 0
								, a = 1
								, s = 0;
							for(this[t] = 255 & e; ++o < n && (a *= 256);) e < 0 && 0 === s && 0 !== this[t + o - 1] && (s = 1), this[t + o] = (e / a >> 0) - s & 255;
							return t + n
						}, l.prototype.writeIntBE = function (e, t, n, r) {
							if(e = +e, t |= 0, !r) {
								var i = Math.pow(2, 8 * n - 1);
								D(this, e, t, n, i - 1, -i)
							}
							var o = n - 1
								, a = 1
								, s = 0;
							for(this[t + o] = 255 & e; --o >= 0 && (a *= 256);) e < 0 && 0 === s && 0 !== this[t + o + 1] && (s = 1), this[t + o] = (e / a >> 0) - s & 255;
							return t + n
						}, l.prototype.writeInt8 = function (e, t, n) {
							return e = +e, t |= 0, n || D(this, e, t, 1, 127, -128), l.TYPED_ARRAY_SUPPORT || (e = Math.floor(e)), e < 0 && (e = 255 + e + 1), this[t] = 255 & e, t + 1
						}, l.prototype.writeInt16LE = function (e, t, n) {
							return e = +e, t |= 0, n || D(this, e, t, 2, 32767, -32768), l.TYPED_ARRAY_SUPPORT ? (this[t] = 255 & e, this[t + 1] = e >>> 8) : L(this, e, t, !0), t + 2
						}, l.prototype.writeInt16BE = function (e, t, n) {
							return e = +e, t |= 0, n || D(this, e, t, 2, 32767, -32768), l.TYPED_ARRAY_SUPPORT ? (this[t] = e >>> 8, this[t + 1] = 255 & e) : L(this, e, t, !1), t + 2
						}, l.prototype.writeInt32LE = function (e, t, n) {
							return e = +e, t |= 0, n || D(this, e, t, 4, 2147483647, -2147483648), l.TYPED_ARRAY_SUPPORT ? (this[t] = 255 & e, this[t + 1] = e >>> 8, this[t + 2] = e >>> 16, this[t + 3] = e >>> 24) : _(this, e, t, !0), t + 4
						}, l.prototype.writeInt32BE = function (e, t, n) {
							return e = +e, t |= 0, n || D(this, e, t, 4, 2147483647, -2147483648), e < 0 && (e = 4294967295 + e + 1), l.TYPED_ARRAY_SUPPORT ? (this[t] = e >>> 24, this[t + 1] = e >>> 16, this[t + 2] = e >>> 8, this[t + 3] = 255 & e) : _(this, e, t, !1), t + 4
						}, l.prototype.writeFloatLE = function (e, t, n) {
							return q(this, e, t, !0, n)
						}, l.prototype.writeFloatBE = function (e, t, n) {
							return q(this, e, t, !1, n)
						}, l.prototype.writeDoubleLE = function (e, t, n) {
							return H(this, e, t, !0, n)
						}, l.prototype.writeDoubleBE = function (e, t, n) {
							return H(this, e, t, !1, n)
						}, l.prototype.copy = function (e, t, n, r) {
							if(n || (n = 0), r || 0 === r || (r = this.length), t >= e.length && (t = e.length), t || (t = 0), r > 0 && r < n && (r = n), r === n) return 0;
							if(0 === e.length || 0 === this.length) return 0;
							if(t < 0) throw new RangeError("targetStart out of bounds");
							if(n < 0 || n >= this.length) throw new RangeError("sourceStart out of bounds");
							if(r < 0) throw new RangeError("sourceEnd out of bounds");
							r > this.length && (r = this.length), e.length - t < r - n && (r = e.length - t + n);
							var i, o = r - n;
							if(this === e && n < t && t < r)
								for(i = o - 1; i >= 0; --i) e[i + t] = this[i + n];
							else if(o < 1e3 || !l.TYPED_ARRAY_SUPPORT)
								for(i = 0; i < o; ++i) e[i + t] = this[i + n];
							else Uint8Array.prototype.set.call(e, this.subarray(n, n + o), t);
							return o
						}, l.prototype.fill = function (e, t, n, r) {
							if("string" == typeof e) {
								if("string" == typeof t ? (r = t, t = 0, n = this.length) : "string" == typeof n && (r = n, n = this.length), 1 === e.length) {
									var i = e.charCodeAt(0);
									i < 256 && (e = i)
								}
								if(void 0 !== r && "string" != typeof r) throw new TypeError("encoding must be a string");
								if("string" == typeof r && !l.isEncoding(r)) throw new TypeError("Unknown encoding: " + r)
							} else "number" == typeof e && (e &= 255);
							if(t < 0 || this.length < t || this.length < n) throw new RangeError("Out of range index");
							if(n <= t) return this;
							var o;
							if(t >>>= 0, n = void 0 === n ? this.length : n >>> 0, e || (e = 0), "number" == typeof e)
								for(o = t; o < n; ++o) this[o] = e;
							else {
								var a = l.isBuffer(e) ? e : X(new l(e, r)
										.toString())
									, s = a.length;
								for(o = 0; o < n - t; ++o) this[o + t] = a[o % s]
							}
							return this
						};
						var V = /[^+\/0-9A-Za-z-_]/g;

						function j(e) {
							return e < 16 ? "0" + e.toString(16) : e.toString(16)
						}

						function X(e, t) {
							var n;
							t = t || 1 / 0;
							for(var r = e.length, i = null, o = [], a = 0; a < r; ++a) {
								if((n = e.charCodeAt(a)) > 55295 && n < 57344) {
									if(!i) {
										if(n > 56319) {
											(t -= 3) > -1 && o.push(239, 191, 189);
											continue
										}
										if(a + 1 === r) {
											(t -= 3) > -1 && o.push(239, 191, 189);
											continue
										}
										i = n;
										continue
									}
									if(n < 56320) {
										(t -= 3) > -1 && o.push(239, 191, 189), i = n;
										continue
									}
									n = 65536 + (i - 55296 << 10 | n - 56320)
								} else i && (t -= 3) > -1 && o.push(239, 191, 189);
								if(i = null, n < 128) {
									if((t -= 1) < 0) break;
									o.push(n)
								} else if(n < 2048) {
									if((t -= 2) < 0) break;
									o.push(n >> 6 | 192, 63 & n | 128)
								} else if(n < 65536) {
									if((t -= 3) < 0) break;
									o.push(n >> 12 | 224, n >> 6 & 63 | 128, 63 & n | 128)
								} else {
									if(!(n < 1114112)) throw new Error("Invalid code point");
									if((t -= 4) < 0) break;
									o.push(n >> 18 | 240, n >> 12 & 63 | 128, n >> 6 & 63 | 128, 63 & n | 128)
								}
							}
							return o
						}

						function U(e) {
							return r.toByteArray(function (e) {
								if((e = function (e) {
											return e.trim ? e.trim() : e.replace(/^\s+|\s+$/g, "")
										}(e)
										.replace(V, ""))
									.length < 2) return "";
								for(; e.length % 4 != 0;) e += "=";
								return e
							}(e))
						}

						function R(e, t, n, r) {
							for(var i = 0; i < r && !(i + n >= t.length || i >= e.length); ++i) t[i + n] = e[i];
							return i
						}
					})
					.call(this, n(12))
				}, function (e, t) {
					var n;
					n = function () {
						return this
					}();
					try {
						n = n || new Function("return this")()
					} catch (e) {
						"object" == typeof window && (n = window)
					}
					e.exports = n
				}, function (e, t) {
					for(var n = t.uint8 = new Array(256), r = 0; r <= 255; r++) n[r] = i(r);

					function i(e) {
						return function (t) {
							var n = t.reserve(1);
							t.buffer[n] = e
						}
					}
				}, function (e, t, n) {
					t.FlexDecoder = o, t.FlexEncoder = a;
					var r = n(0)
						, i = "BUFFER_SHORTAGE";

					function o() {
						if(!(this instanceof o)) return new o
					}

					function a() {
						if(!(this instanceof a)) return new a
					}

					function s() {
						return this.buffers && this.buffers.length ? (this.flush(), this.pull()) : this.fetch()
					}

					function l(e) {
						(this.buffers || (this.buffers = []))
						.push(e)
					}

					function c(e) {
						return function (t) {
							for(var n in e) t[n] = e[n];
							return t
						}
					}
					o.mixin = c({
						bufferish: r
						, write: function (e) {
							var t = this.offset ? r.prototype.slice.call(this.buffer, this.offset) : this.buffer;
							this.buffer = t ? e ? this.bufferish.concat([t, e]) : t : e, this.offset = 0
						}
						, fetch: function () {
							throw new Error("method not implemented: fetch()")
						}
						, flush: function () {
							for(; this.offset < this.buffer.length;) {
								var e, t = this.offset;
								try {
									e = this.fetch()
								} catch (e) {
									if(e && e.message != i) throw e;
									this.offset = t;
									break
								}
								this.push(e)
							}
						}
						, push: l
						, pull: function () {
							return (this.buffers || (this.buffers = []))
								.shift()
						}
						, read: s
						, reserve: function (e) {
							var t = this.offset
								, n = t + e;
							if(n > this.buffer.length) throw new Error(i);
							return this.offset = n, t
						}
						, offset: 0
					}), o.mixin(o.prototype), a.mixin = c({
						bufferish: r
						, write: function () {
							throw new Error("method not implemented: write()")
						}
						, fetch: function () {
							var e = this.start;
							if(e < this.offset) {
								var t = this.start = this.offset;
								return r.prototype.slice.call(this.buffer, e, t)
							}
						}
						, flush: function () {
							for(; this.start < this.offset;) {
								var e = this.fetch();
								e && this.push(e)
							}
						}
						, push: l
						, pull: function () {
							var e = this.buffers || (this.buffers = [])
								, t = e.length > 1 ? this.bufferish.concat(e) : e[0];
							return e.length = 0, t
						}
						, read: s
						, reserve: function (e) {
							var t = 0 | e;
							if(this.buffer) {
								var n = this.buffer.length
									, r = 0 | this.offset
									, i = r + t;
								if(i < n) return this.offset = i, r;
								this.flush(), e = Math.max(e, Math.min(2 * n, this.maxBufferSize))
							}
							return e = Math.max(e, this.minBufferSize), this.buffer = this.bufferish.alloc(e), this.start = 0, this.offset = t, 0
						}
						, send: function (e) {
							var t = e.length;
							if(t > this.minBufferSize) this.flush(), this.push(e);
							else {
								var n = this.reserve(t);
								r.prototype.copy.call(e, this.buffer, n)
							}
						}
						, maxBufferSize: 65536
						, minBufferSize: 2048
						, offset: 0
						, start: 0
					}), a.mixin(a.prototype)
				}, function (e, t, n) {
					t.decode = function (e, t) {
						var n = new r(t);
						return n.write(e), n.read()
					};
					var r = n(16)
						.DecodeBuffer
				}, function (e, t, n) {
					t.DecodeBuffer = i;
					var r = n(8)
						.preset;

					function i(e) {
						if(!(this instanceof i)) return new i(e);
						if(e && (this.options = e, e.codec)) {
							var t = this.codec = e.codec;
							t.bufferish && (this.bufferish = t.bufferish)
						}
					}
					n(14)
						.FlexDecoder.mixin(i.prototype), i.prototype.codec = r, i.prototype.fetch = function () {
							return this.codec.decode(this)
						}
				}, function (e, t, n) {
					var r = n(4)
						, i = n(7)
						, o = i.Uint64BE
						, a = i.Int64BE;
					t.getReadFormat = function (e) {
						var t = s.hasArrayBuffer && e && e.binarraybuffer
							, n = e && e.int64;
						return {
							map: c && e && e.usemap ? f : u
							, array: d
							, str: h
							, bin: t ? A : p
							, ext: g
							, uint8: m
							, uint16: w
							, uint32: b
							, uint64: B(8, n ? C : E)
							, int8: y
							, int16: v
							, int32: x
							, int64: B(8, n ? I : k)
							, float32: B(4, T)
							, float64: B(8, M)
						}
					}, t.readUint8 = m;
					var s = n(0)
						, l = n(6)
						, c = "undefined" != typeof Map;

					function u(e, t) {
						var n, r = {}
							, i = new Array(t)
							, o = new Array(t)
							, a = e.codec.decode;
						for(n = 0; n < t; n++) i[n] = a(e), o[n] = a(e);
						for(n = 0; n < t; n++) r[i[n]] = o[n];
						return r
					}

					function f(e, t) {
						var n, r = new Map
							, i = new Array(t)
							, o = new Array(t)
							, a = e.codec.decode;
						for(n = 0; n < t; n++) i[n] = a(e), o[n] = a(e);
						for(n = 0; n < t; n++) r.set(i[n], o[n]);
						return r
					}

					function d(e, t) {
						for(var n = new Array(t), r = e.codec.decode, i = 0; i < t; i++) n[i] = r(e);
						return n
					}

					function h(e, t) {
						var n = e.reserve(t)
							, r = n + t;
						return l.toString.call(e.buffer, "utf-8", n, r)
					}

					function p(e, t) {
						var n = e.reserve(t)
							, r = n + t
							, i = l.slice.call(e.buffer, n, r);
						return s.from(i)
					}

					function A(e, t) {
						var n = e.reserve(t)
							, r = n + t
							, i = l.slice.call(e.buffer, n, r);
						return s.Uint8Array.from(i)
							.buffer
					}

					function g(e, t) {
						var n = e.reserve(t + 1)
							, r = e.buffer[n++]
							, i = n + t
							, o = e.codec.getExtUnpacker(r);
						if(!o) throw new Error("Invalid ext type: " + (r ? "0x" + r.toString(16) : r));
						return o(l.slice.call(e.buffer, n, i))
					}

					function m(e) {
						var t = e.reserve(1);
						return e.buffer[t]
					}

					function y(e) {
						var t = e.reserve(1)
							, n = e.buffer[t];
						return 128 & n ? n - 256 : n
					}

					function w(e) {
						var t = e.reserve(2)
							, n = e.buffer;
						return n[t++] << 8 | n[t]
					}

					function v(e) {
						var t = e.reserve(2)
							, n = e.buffer
							, r = n[t++] << 8 | n[t];
						return 32768 & r ? r - 65536 : r
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

					function B(e, t) {
						return function (n) {
							var r = n.reserve(e);
							return t.call(n.buffer, r, !0)
						}
					}

					function E(e) {
						return new o(this, e)
							.toNumber()
					}

					function k(e) {
						return new a(this, e)
							.toNumber()
					}

					function C(e) {
						return new o(this, e)
					}

					function I(e) {
						return new a(this, e)
					}

					function T(e) {
						return r.read(this, e, !1, 23, 4)
					}

					function M(e) {
						return r.read(this, e, !1, 52, 8)
					}
				}, function (e, t, n) {
					! function (t) {
						e.exports = t;
						var n = "listeners"
							, r = {
								on: function (e, t) {
									return a(this, e)
										.push(t), this
								}
								, once: function (e, t) {
									var n = this;
									return r.originalListener = t, a(n, e)
										.push(r), n;

									function r() {
										o.call(n, e, r), t.apply(this, arguments)
									}
								}
								, off: o
								, emit: function (e, t) {
									var n = this
										, r = a(n, e, !0);
									if(!r) return !1;
									var i = arguments.length;
									if(1 === i) r.forEach(function (e) {
										e.call(n)
									});
									else if(2 === i) r.forEach(function (e) {
										e.call(n, t)
									});
									else {
										var o = Array.prototype.slice.call(arguments, 1);
										r.forEach(function (e) {
											e.apply(n, o)
										})
									}
									return !!r.length
								}
							};

						function i(e) {
							for(var t in r) e[t] = r[t];
							return e
						}

						function o(e, t) {
							var r;
							if(arguments.length) {
								if(t) {
									if(r = a(this, e, !0)) {
										if(!(r = r.filter(function (e) {
												return e !== t && e.originalListener !== t
											}))
											.length) return o.call(this, e);
										this[n][e] = r
									}
								} else if((r = this[n]) && (delete r[e], !Object.keys(r)
										.length)) return o.call(this)
							} else delete this[n];
							return this
						}

						function a(e, t, r) {
							if(!r || e[n]) {
								var i = e[n] || (e[n] = {});
								return i[t] || (i[t] = [])
							}
						}
						i(t.prototype), t.mixin = i
					}(function e() {
						if(!(this instanceof e)) return new e
					})
				}, function (e, t, n) {
					(function (t) {
						e.exports.maxScreenWidth = 1920, e.exports.maxScreenHeight = 1080, e.exports.serverUpdateRate = 9, e.exports.maxPlayers = t && -1 != t.argv.indexOf("--largeserver") ? 80 : 50, e.exports.maxPlayersHard = e.exports.maxPlayers + 10, e.exports.collisionDepth = 6, e.exports.minimapRate = 3e3, e.exports.colGrid = 10, e.exports.clientSendRate = 5, e.exports.healthBarWidth = 50, e.exports.healthBarPad = 4.5, e.exports.iconPadding = 15, e.exports.iconPad = .9, e.exports.deathFadeout = 3e3, e.exports.crownIconScale = 60, e.exports.crownPad = 35, e.exports.chatCountdown = 3e3, e.exports.chatCooldown = 500, e.exports.inSandbox = t && "mm_exp" === t.env.VULTR_SCHEME, e.exports.maxAge = 100, e.exports.gatherAngle = Math.PI / 2.6, e.exports.gatherWiggle = 10, e.exports.hitReturnRatio = .25, e.exports.hitAngle = Math.PI / 2, e.exports.playerScale = 35, e.exports.playerSpeed = .0016, e.exports.playerDecel = .993, e.exports.nameY = 34, e.exports.skinColors = ["#bf8f54", "#cbb091", "#896c4b", "#fadadc", "#ececec", "#c37373", "#4c4c4c", "#ecaff7", "#738cc3", "#8bc373"], e.exports.animalCount = 7, e.exports.aiTurnRandom = .06, e.exports.cowNames = ["Sid", "Steph", "Bmoe", "Romn", "Jononthecool", "Fiona", "Vince", "Nathan", "Nick", "Flappy", "Ronald", "Otis", "Pepe", "Mc Donald", "Theo", "Fabz", "Oliver", "Jeff", "Jimmy", "Helena", "Reaper", "Ben", "Alan", "Naomi", "XYZ", "Clever", "Jeremy", "Mike", "Destined", "Stallion", "Allison", "Meaty", "Sophia", "Vaja", "Joey", "Pendy", "Murdoch", "Theo", "Jared", "July", "Sonia", "Mel", "Dexter", "Quinn", "Milky", "Marcus", "Joe", "Bob", "Mike", "Bobby", "Kilian"], e.exports.shieldAngle = Math.PI / 3, e.exports.weaponVariants = [{
							id: 0
							, src: ""
							, xp: 0
							, val: 1
						}, {
							id: 1
							, src: "_g"
							, xp: 3e3
							, val: 1.1
						}, {
							id: 2
							, src: "_d"
							, xp: 7e3
							, val: 1.18
						}, {
							id: 3
							, src: "_r"
							, poison: !0
							, xp: 12e3
							, val: 1.18
						}], e.exports.fetchVariant = function (t) {
							for(var n = t.weaponXP[t.weaponIndex] || 0, r = e.exports.weaponVariants.length - 1; r >= 0; --r)
								if(n >= e.exports.weaponVariants[r].xp) return e.exports.weaponVariants[r]
						}, e.exports.resourceTypes = ["wood", "food", "stone", "points"], e.exports.areaCount = 7, e.exports.treesPerArea = 9, e.exports.bushesPerArea = 3, e.exports.totalRocks = 32, e.exports.goldOres = 7, e.exports.riverWidth = 724, e.exports.riverPadding = 114, e.exports.waterCurrent = .0011, e.exports.waveSpeed = 1e-4, e.exports.waveMax = 1.3, e.exports.treeScales = [50 * Math.random() + 150, 50 * Math.random() + 150, 50 * Math.random() + 150, 50 * Math.random() + 150], e.exports.bushScales = [80, 85, 95], e.exports.rockScales = [80, 85, 90], e.exports.snowBiomeTop = 2400, e.exports.snowSpeed = .75, e.exports.maxNameLength = 15, e.exports.mapScale = 14400, e.exports.mapPingScale = 40, e.exports.mapPingTime = 2200
					})
					.call(this, n(41))
				}, function (e, t) {
					var n = {
						utf8: {
							stringToBytes: function (e) {
								return n.bin.stringToBytes(unescape(encodeURIComponent(e)))
							}
							, bytesToString: function (e) {
								return decodeURIComponent(escape(n.bin.bytesToString(e)))
							}
						}
						, bin: {
							stringToBytes: function (e) {
								for(var t = [], n = 0; n < e.length; n++) t.push(255 & e.charCodeAt(n));
								return t
							}
							, bytesToString: function (e) {
								for(var t = [], n = 0; n < e.length; n++) t.push(String.fromCharCode(e[n]));
								return t.join("")
							}
						}
					};
					e.exports = n
				}, function (e, t, n) {
					window.loadedScript = !0;
					var r = "127.0.0.1" !== location.hostname && !location.hostname.startsWith("192.168.");
					n(22);
					var i = n(23)
						, o = n(42)
						, a = n(43)
						, s = n(19)
						, l = n(44)
						, c = n(45)
						, u = (n(46), n(47))
						, f = n(48)
						, d = n(55)
						, h = n(56)
						, p = n(57)
						, A = n(58)
						.obj
						, g = new a.TextManager
						, m = new(n(59))("moomoo.io", 3e3, s.maxPlayers, 5, !1);
					m.debugLog = !1;
					var y = !1;

					function w() {
						ft && dt && (y = !0, r ? window.grecaptcha.execute("6LevKusUAAAAAAFknhlV8sPtXAk5Z5dGP5T2FYIZ", {
								action: "homepage"
							})
							.then(function (e) {
								v(e)
							}) : v(null))
					}

					function v(e) {
						m.start(function (t, n, a) {
							var l = (r ? "wss" : "ws") + "://" + t + ":8008/?gameIndex=" + a;
							e && (l += "&token=" + encodeURIComponent(e)), i.connect(l, function (e) {
								Or(), setInterval(() => Or(), 2500), e ? ht(e) : (fe.onclick = o.checkTrusted(function () {
									var e, t;
									e = ++xt > 1, t = Date.now() - bt > vt, e && t ? (bt = Date.now(), Bt()) : kn()
								}), o.hookTouchEvents(fe), de.onclick = o.checkTrusted(function () {
									Lr("https://krunker.io")
								}), o.hookTouchEvents(de), pe.onclick = o.checkTrusted(function () {
									setTimeout(function () {
										var e, t;
										e = xe.value, (t = prompt("party key", e)) && (window.onbeforeunload = void 0, window.location.href = "/?server=" + t)
									}, 10)
								}), o.hookTouchEvents(pe), Ae.onclick = o.checkTrusted(function () {
									Te.classList.contains("showing") ? (Te.classList.remove("showing"), ge.innerText = "Settings") : (Te.classList.add("showing"), ge.innerText = "Close")
								}), o.hookTouchEvents(Ae), me.onclick = o.checkTrusted(function () {
									yn(), "block" != ze.style.display ? Ht() : ze.style.display = "none"
								}), o.hookTouchEvents(me), ye.onclick = o.checkTrusted(function () {
									"block" != Je.style.display ? (Je.style.display = "block", ze.style.display = "none", sn(), Gt()) : Je.style.display = "none"
								}), o.hookTouchEvents(ye), we.onclick = o.checkTrusted(function () {
									on()
								}), o.hookTouchEvents(we), Qe.onclick = o.checkTrusted(function () {
									Bn()
								}), o.hookTouchEvents(Qe), function () {
									for(var e = 0; e < Sn.length; ++e) {
										var t = new Image;
										t.onload = function () {
											this.isLoaded = !0
										}, t.src = ".././img/icons/" + Sn[e] + ".png", _n[Sn[e]] = t
									}
								}(), Me.style.display = "none", Ie.style.display = "block", je.value = C("moo_name") || "", function () {
									var e = C("native_resolution");
									en(e ? "true" == e : "undefined" != typeof cordova), T = "true" == C("show_ping"), ke.hidden = !T, C("moo_moosic"), setInterval(function () {
										window.cordova && (document.getElementById("downloadButtonContainer")
											.classList.add("cordova"), document.getElementById("mobileDownloadButtonContainer")
											.classList.add("cordova"))
									}, 1e3), tn(), o.removeAllChildren(Oe);
									for(var t = 0; t < c.weapons.length + c.list.length; ++t) ! function (e) {
										o.generateElement({
											id: "actionBarItem" + e
											, class: "actionBarItem"
											, style: "display:none"
											, onmouseout: function () {
												kt()
											}
											, parent: Oe
										})
									}(t);
									for(t = 0; t < c.list.length + c.weapons.length; ++t) ! function (e) {
										var t = document.createElement("canvas");
										t.width = t.height = 66;
										var n = t.getContext("2d");
										if(n.translate(t.width / 2, t.height / 2), n.imageSmoothingEnabled = !1, n.webkitImageSmoothingEnabled = !1, n.mozImageSmoothingEnabled = !1, c.weapons[e]) {
											n.rotate(Math.PI / 4 + Math.PI);
											var r = new Image;
											er[c.weapons[e].src] = r, r.onload = function () {
													this.isLoaded = !0;
													var r = 1 / (this.height / this.width)
														, i = c.weapons[e].iPad || 1;
													n.drawImage(this, -t.width * i * s.iconPad * r / 2, -t.height * i * s.iconPad / 2, t.width * i * r * s.iconPad, t.height * i * s.iconPad), n.fillStyle = "rgba(0, 0, 70, 0.1)", n.globalCompositeOperation = "source-atop", n.fillRect(-t.width / 2, -t.height / 2, t.width, t.height), document.getElementById("actionBarItem" + e)
														.style.backgroundImage = "url(" + t.toDataURL() + ")"
												}, r.src = ".././img/weapons/" + c.weapons[e].src + ".png", (i = document.getElementById("actionBarItem" + e))
												.onmouseover = o.checkTrusted(function () {
													kt(c.weapons[e], !0)
												}), i.onclick = o.checkTrusted(function () {
													En(e, !0)
												}), o.hookTouchEvents(i)
										} else {
											r = or(c.list[e - c.weapons.length], !0);
											var i, a = Math.min(t.width - s.iconPadding, r.width);
											n.globalAlpha = 1, n.drawImage(r, -a / 2, -a / 2, a, a), n.fillStyle = "rgba(0, 0, 70, 0.1)", n.globalCompositeOperation = "source-atop", n.fillRect(-a / 2, -a / 2, a, a), document.getElementById("actionBarItem" + e)
												.style.backgroundImage = "url(" + t.toDataURL() + ")", (i = document.getElementById("actionBarItem" + e))
												.onmouseover = o.checkTrusted(function () {
													kt(c.list[e - c.weapons.length])
												}), i.onclick = o.checkTrusted(function () {
													En(e - c.weapons.length)
												}), o.hookTouchEvents(i)
										}
									}(t);
									je.ontouchstart = o.checkTrusted(function (e) {
										e.preventDefault();
										var t = prompt("enter name", e.currentTarget.value);
										e.currentTarget.value = t.slice(0, 15)
									}), Be.checked = I, Be.onchange = o.checkTrusted(function (e) {
										en(e.target.checked)
									}), Ee.checked = T, Ee.onchange = o.checkTrusted(function (e) {
										T = Ee.checked, ke.hidden = !T, k("show_ping", T ? "true" : "false")
									})
								}())
							}, {
								id: at
								, d: ht
								, 1: In
								, 2: vr
								, 4: br
								, 33: kr
								, 5: jn
								, 6: ur
								, a: gr
								, aa: Ar
								, 7: Nn
								, 8: fr
								, sp: dr
								, 9: Br
								, h: Er
								, 11: Pn
								, 12: Dn
								, 13: On
								, 14: xr
								, 15: Vn
								, 16: Hn
								, 17: $t
								, 18: hr
								, 19: pr
								, 20: Dr
								, ac: Lt
								, ad: qt
								, an: Ot
								, st: _t
								, sa: St
								, us: Qt
								, ch: fn
								, mm: Nt
								, t: Tn
								, p: zt
								, pp: Pr
							}), At(), setTimeout(() => gt(), 3e3)
						}, function (e) {
							console.error("Vultr error:", e), alert("Error:\n" + e), ht("disconnected")
						})
					}
					var b, x = new A(s, o)
						, B = Math.PI
						, E = 2 * B;

					function k(e, t) {
						b && localStorage.setItem(e, t)
					}

					function C(e) {
						return b ? localStorage.getItem(e) : null
					}
					Math.lerpAngle = function (e, t, n) {
						Math.abs(t - e) > B && (e > t ? t += E : e += E);
						var r = t + (e - t) * n;
						return r >= 0 && r <= E ? r : r % E
					}, CanvasRenderingContext2D.prototype.roundRect = function (e, t, n, r, i) {
						return n < 2 * i && (i = n / 2), r < 2 * i && (i = r / 2), i < 0 && (i = 0), this.beginPath(), this.moveTo(e + i, t), this.arcTo(e + n, t, e + n, t + r, i), this.arcTo(e + n, t + r, e, t + r, i), this.arcTo(e, t + r, e, t, i), this.arcTo(e, t, e + n, t, i), this.closePath(), this
					}, "undefined" != typeof Storage && (b = !0), C("consent") || (consentBlock.style.display = "block"), window.checkTerms = function (e) {
						e ? (consentBlock.style.display = "none", k("consent", 1)) : $("#consentShake")
							.effect("shake")
					};
					var I, T, M, P, O, D, L, _, S, q, H, V, j, X, U = C("moofoll")
						, R = 1
						, Y = Date.now()
						, W = []
						, z = []
						, N = []
						, F = []
						, Q = []
						, G = new p(h, Q, z, W, rt, c, s, o)
						, K = n(70)
						, Z = n(71)
						, J = new K(W, Z, z, c, null, s, o)
						, ee = 1
						, te = 0
						, ne = 0
						, re = 0
						, ie = {
							id: -1
							, startX: 0
							, startY: 0
							, currentX: 0
							, currentY: 0
						}
						, oe = {
							id: -1
							, startX: 0
							, startY: 0
							, currentX: 0
							, currentY: 0
						}
						, ae = 0
						, se = s.maxScreenWidth
						, le = s.maxScreenHeight
						, ce = !1
						, ue = (document.getElementById("ad-container"), document.getElementById("mainMenu"))
						, fe = document.getElementById("enterGame")
						, de = document.getElementById("promoImg")
						, he = document.getElementById("partyButton")
						, pe = document.getElementById("joinPartyButton")
						, Ae = document.getElementById("settingsButton")
						, ge = Ae.getElementsByTagName("span")[0]
						, me = document.getElementById("allianceButton")
						, ye = document.getElementById("storeButton")
						, we = document.getElementById("chatButton")
						, ve = document.getElementById("gameCanvas")
						, be = ve.getContext("2d")
						, xe = document.getElementById("serverBrowser")
						, Be = document.getElementById("nativeResolution")
						, Ee = document.getElementById("showPing")
						, ke = (document.getElementById("playMusic"), document.getElementById("pingDisplay"))
						, Ce = document.getElementById("shutdownDisplay")
						, Ie = document.getElementById("menuCardHolder")
						, Te = document.getElementById("guideCard")
						, Me = document.getElementById("loadingText")
						, Pe = document.getElementById("gameUI")
						, Oe = document.getElementById("actionBar")
						, De = document.getElementById("scoreDisplay")
						, Le = document.getElementById("foodDisplay")
						, _e = document.getElementById("woodDisplay")
						, Se = document.getElementById("stoneDisplay")
						, qe = document.getElementById("killCounter")
						, He = document.getElementById("leaderboardData")
						, je = document.getElementById("nameInput")
						, Xe = document.getElementById("itemInfoHolder")
						, Ue = document.getElementById("ageText")
						, Re = document.getElementById("ageBarBody")
						, Ye = document.getElementById("upgradeHolder")
						, We = document.getElementById("upgradeCounter")
						, ze = document.getElementById("allianceMenu")
						, Ne = document.getElementById("allianceHolder")
						, Fe = document.getElementById("allianceManager")
						, Qe = document.getElementById("mapDisplay")
						, Ge = document.getElementById("diedText")
						, Ke = document.getElementById("skinColorHolder")
						, Ze = Qe.getContext("2d");
					Qe.width = 300, Qe.height = 300;
					var Je = document.getElementById("storeMenu")
						, $e = document.getElementById("storeHolder")
						, et = document.getElementById("noticationDisplay")
						, tt = d.hats
						, nt = d.accessories
						, rt = new u(l, F, o, s)
						, it = "#525252"
						, ot = "#3d3f42";

					function at(e) {
						N = e.teams
					}
					var st = document.getElementById("featuredYoutube")
						, lt = [{
							name: "Corrupt X"
							, link: "https://www.youtube.com/channel/UC0UH2LfQvBSeH24bmtbmITw"
						}, {
							name: "Tweak Big"
							, link: "https://www.youtube.com/channel/UCbwvzJ38AndDTkoX8sD9YOw"
						}, {
							name: "Arena Closer"
							, link: "https://www.youtube.com/channel/UCazucVSJqW-kiHMIhQhD-QQ"
						}, {
							name: "Godenot"
							, link: "https://www.youtube.com/user/SirGodenot"
						}, {
							name: "RajNoobTV"
							, link: "https://www.youtube.com/channel/UCVLo9brXBWrCttMaGzvm0-Q"
						}, {
							name: "TomNotTom"
							, link: "https://www.youtube.com/channel/UC7z97RgHFJRcv2niXgArBDw"
						}, {
							name: "Nation"
							, link: "https://www.youtube.com/channel/UCSl-MBn3qzjrIvLNESQRk-g"
						}, {
							name: "Pidyohago"
							, link: "https://www.youtube.com/channel/UC04p8Mg8nDaDx04A9is2B8Q"
						}, {
							name: "Enigma"
							, link: "https://www.youtube.com/channel/UC5HhLbs3sReHo8Bb9NDdFrg"
						}, {
							name: "Bauer"
							, link: "https://www.youtube.com/channel/UCwU2TbJx3xTSlPqg-Ix3R1g"
						}, {
							name: "iStealth"
							, link: "https://www.youtube.com/channel/UCGrvlEOsQFViZbyFDE6t69A"
						}, {
							name: "SICKmania"
							, link: "https://www.youtube.com/channel/UCvVI98ezn4TpX5wDMZjMa3g"
						}, {
							name: "LightThief"
							, link: "https://www.youtube.com/channel/UCj6C_tiDeATiKd3GX127XoQ"
						}, {
							name: "Fortish"
							, link: "https://www.youtube.com/channel/UCou6CLU-szZA3Tb340TB9_Q"
						}, {
							name: "Ã¥Â·Â§Ã¥â€¦â€¹Ã¥Å â€º"
							, link: "https://www.youtube.com/channel/UCgL6J6oL8F69vm-GcPScmwg"
						}, {
							name: "i Febag"
							, link: "https://www.youtube.com/channel/UCiU6WZwiKbsnt5xmwr0OFbg"
						}, {
							name: "GoneGaming"
							, link: "https://www.youtube.com/channel/UCOcQthRanYcwYY0XVyVeK0g"
						}]
						, ct = lt[o.randInt(0, lt.length - 1)];
					st.innerHTML = "<a target='_blank' class='ytLink' href='" + ct.link + "'><i class='material-icons' style='vertical-align: top;'>&#xE064;</i> " + ct.name + "</a>";
					var ut = !0
						, ft = !1
						, dt = !1;

					function ht(e) {
						i.close(), pt(e)
					}

					function pt(e) {
						ue.style.display = "block", Pe.style.display = "none", Ie.style.display = "none", Ge.style.display = "none", Me.style.display = "block", Me.innerHTML = e + "<a href='javascript:window.location.href=window.location.href' class='ytLink'>reload</a>"
					}

					function At() {
						var e, t, n = ""
							, r = 0;
						for(var i in m.servers) {
							for(var o = m.servers[i], a = 0, l = 0; l < o.length; l++)
								for(var c = 0; c < o[l].games.length; c++) a += o[l].games[c].playerCount;
							r += a;
							var u = m.regionInfo[i].name;
							n += "<option disabled>" + u + " - " + a + " players</option>";
							for(var f = 0; f < o.length; f++)
								for(var d = o[f], h = 0; h < d.games.length; h++) {
									var p = d.games[h]
										, A = 1 * d.index + h + 1
										, g = m.server && m.server.region === d.region && m.server.index === d.index && m.gameIndex == h
										, y = u + " " + A + " [" + Math.min(p.playerCount, s.maxPlayers) + "/" + s.maxPlayers + "]";
									let e = m.stripRegion(i) + ":" + f + ":" + h;
									g && (he.getElementsByTagName("span")[0].innerText = e), n += "<option value='" + e + "' " + (g ? "selected" : "") + ">" + y + "</option>"
								}
							n += "<option disabled></option>"
						}
						n += "<option disabled>All Servers - " + r + " players</option>", xe.innerHTML = n, "sandbox.moomoo.io" == location.hostname ? (e = "Back to MooMoo", t = "//moomoo.io/") : (e = "Try the sandbox", t = "//sandbox.moomoo.io/"), document.getElementById("altServer")
							.innerHTML = "<a href='" + t + "'>" + e + "<i class='material-icons' style='font-size:10px;vertical-align:middle'>arrow_forward_ios</i></a>"
					}

					function gt() {
						var e = new XMLHttpRequest;
						e.onreadystatechange = function () {
							4 == this.readyState && (200 == this.status ? (window.vultr = JSON.parse(this.responseText), m.processServers(vultr.servers), At()) : console.error("Failed to load server data with status code:", this.status))
						}, e.open("GET", "/serverData", !0), e.send()
					}
					window.onblur = function () {
						ut = !1
					}, window.onfocus = function () {
						ut = !0, L && L.alive && yn()
					}, window.onload = function () {
						ft = !0, w(), setTimeout(function () {
							y || (alert("Captcha failed to load"), window.location.reload())
						}, 2e4)
					}, window.captchaCallback = function () {
						dt = !0, w()
					}, ve.oncontextmenu = function () {
						return !1
					}, xe.addEventListener("change", o.checkTrusted(function () {
						let e = xe.value.split(":");
						m.switchServer(e[0], e[1], e[2])
					}));
					var mt = document.getElementById("pre-content-container")
						, yt = null
						, wt = null
						, vt = 3e5
						, bt = 0
						, xt = 0;

					function Bt() {
						if(!wt) return console.log("Failed to load video ad API", !!wt), void kn();
						(yt = new wt.game.RewardedVideoView("rewardedvideo"))
						.addEventListener("ad_closed", function (e) {
							console.log("Video ad closed"), Et()
						}), yt.addEventListener("loaded", function (e) {
							console.log("Video ad loaded"), yt.show()
						}), yt.addEventListener("load_failed", function (e) {
							console.log("Video ad load failed", e), Et()
						}), yt.load(), mt.style.display = "block"
					}

					function Et() {
						mt.style.display = "none", kn()
					}

					function kt(e, t, n) {
						if(L && e)
							if(o.removeAllChildren(Xe), Xe.classList.add("visible"), o.generateElement({
									id: "itemInfoName"
									, text: o.capitalizeFirst(e.name)
									, parent: Xe
								}), o.generateElement({
									id: "itemInfoDesc"
									, text: e.desc
									, parent: Xe
								}), n);
							else if(t) o.generateElement({
							class: "itemInfoReq"
							, text: e.type ? "secondary" : "primary"
							, parent: Xe
						});
						else {
							for(var r = 0; r < e.req.length; r += 2) o.generateElement({
								class: "itemInfoReq"
								, html: e.req[r] + "<span class='itemInfoReqVal'> x" + e.req[r + 1] + "</span>"
								, parent: Xe
							});
							e.group.limit && o.generateElement({
								class: "itemInfoLmt"
								, text: (L.itemCounts[e.group.id] || 0) + "/" + e.group.limit
								, parent: Xe
							})
						} else Xe.classList.remove("visible")
					}
					window.showPreAd = Bt;
					var Ct, It, Tt, Mt = []
						, Pt = [];

					function Ot(e, t) {
						Mt.push({
							sid: e
							, name: t
						}), Dt()
					}

					function Dt() {
						if(Mt[0]) {
							var e = Mt[0];
							o.removeAllChildren(et), et.style.display = "block", o.generateElement({
								class: "notificationText"
								, text: e.name
								, parent: et
							}), o.generateElement({
								class: "notifButton"
								, html: "<i class='material-icons' style='font-size:28px;color:#cc5151;'>&#xE14C;</i>"
								, parent: et
								, onclick: function () {
									Vt(0)
								}
								, hookTouch: !0
							}), o.generateElement({
								class: "notifButton"
								, html: "<i class='material-icons' style='font-size:28px;color:#8ecc51;'>&#xE876;</i>"
								, parent: et
								, onclick: function () {
									Vt(1)
								}
								, hookTouch: !0
							})
						} else et.style.display = "none"
					}

					function Lt(e) {
						N.push(e), "block" == ze.style.display && Ht()
					}

					function _t(e, t) {
						L && (L.team = e, L.isOwner = t, "block" == ze.style.display && Ht())
					}

					function St(e) {
						Pt = e, "block" == ze.style.display && Ht()
					}

					function qt(e) {
						for(var t = N.length - 1; t >= 0; t--) N[t].sid == e && N.splice(t, 1);
						"block" == ze.style.display && Ht()
					}

					function Ht() {
						if(L && L.alive) {
							if(sn(), Je.style.display = "none", ze.style.display = "block", o.removeAllChildren(Ne), L.team)
								for(var e = 0; e < Pt.length; e += 2) ! function (e) {
									var t = o.generateElement({
										class: "allianceItem"
										, style: "color:" + (Pt[e] == L.sid ? "#fff" : "rgba(255,255,255,0.6)")
										, text: Pt[e + 1]
										, parent: Ne
									});
									L.isOwner && Pt[e] != L.sid && o.generateElement({
										class: "joinAlBtn"
										, text: "Kick"
										, onclick: function () {
											jt(Pt[e])
										}
										, hookTouch: !0
										, parent: t
									})
								}(e);
							else if(N.length)
								for(e = 0; e < N.length; ++e) ! function (e) {
									var t = o.generateElement({
										class: "allianceItem"
										, style: "color:" + (N[e].sid == L.team ? "#fff" : "rgba(255,255,255,0.6)")
										, text: N[e].sid
										, parent: Ne
									});
									o.generateElement({
										class: "joinAlBtn"
										, text: "Join"
										, onclick: function () {
											Xt(e)
										}
										, hookTouch: !0
										, parent: t
									})
								}(e);
							else o.generateElement({
								class: "allianceItem"
								, text: "No Tribes Yet"
								, parent: Ne
							});
							o.removeAllChildren(Fe), L.team ? o.generateElement({
								class: "allianceButtonM"
								, style: "width: 360px"
								, text: L.isOwner ? "Delete Tribe" : "Leave Tribe"
								, onclick: function () {
									Rt()
								}
								, hookTouch: !0
								, parent: Fe
							}) : (o.generateElement({
								tag: "input"
								, type: "text"
								, id: "allianceInput"
								, maxLength: 7
								, placeholder: "unique name"
								, ontouchstart: function (e) {
									e.preventDefault();
									var t = prompt("unique name", e.currentTarget.value);
									e.currentTarget.value = t.slice(0, 7)
								}
								, parent: Fe
							}), o.generateElement({
								tag: "div"
								, class: "allianceButtonM"
								, style: "width: 140px;"
								, text: "Create"
								, onclick: function () {
									Ut()
								}
								, hookTouch: !0
								, parent: Fe
							}))
						}
					}

					function Vt(e) {
						i.send("11", Mt[0].sid, e), Mt.splice(0, 1), Dt()
					}

					function jt(e) {
						i.send("12", e)
					}

					function Xt(e) {
						i.send("10", N[e].sid)
					}

					function Ut() {
						i.send("8", document.getElementById("allianceInput")
							.value)
					}

					function Rt() {
						Mt = [], Dt(), i.send("9")
					}
					var Yt, Wt = [];

					function zt(e, t) {
						for(var n = 0; n < Wt.length; ++n)
							if(!Wt[n].active) {
								Yt = Wt[n];
								break
							} Yt || (Yt = new function () {
							this.init = function (e, t) {
								this.scale = 0, this.x = e, this.y = t, this.active = !0
							}, this.update = function (e, t) {
								this.active && (this.scale += .05 * t, this.scale >= s.mapPingScale ? this.active = !1 : (e.globalAlpha = 1 - Math.max(0, this.scale / s.mapPingScale), e.beginPath(), e.arc(this.x / s.mapScale * Qe.width, this.y / s.mapScale * Qe.width, this.scale, 0, 2 * Math.PI), e.stroke()))
							}
						}, Wt.push(Yt)), Yt.init(e, t)
					}

					function Nt(e) {
						It = e
					}
					var Ft = 0;

					function Qt(e, t, n) {
						n ? e ? L.tailIndex = t : L.tails[t] = 1 : e ? L.skinIndex = t : L.skins[t] = 1, "block" == Je.style.display && Gt()
					}

					function Gt() {
						if(L) {
							o.removeAllChildren($e);
							for(var e = Ft, t = e ? nt : tt, n = 0; n < t.length; ++n) t[n].dontSell || function (n) {
								var r = o.generateElement({
									id: "storeDisplay" + n
									, class: "storeItem"
									, onmouseout: function () {
										kt()
									}
									, onmouseover: function () {
										kt(t[n], !1, !0)
									}
									, parent: $e
								});
								o.hookTouchEvents(r, !0), o.generateElement({
									tag: "img"
									, class: "hatPreview"
									, src: "../img/" + (e ? "accessories/access_" : "hats/hat_") + t[n].id + (t[n].topSprite ? "_p" : "") + ".png"
									, parent: r
								}), o.generateElement({
									tag: "span"
									, text: t[n].name
									, parent: r
								}), (e ? L.tails[t[n].id] : L.skins[t[n].id]) ? (e ? L.tailIndex : L.skinIndex) == t[n].id ? o.generateElement({
									class: "joinAlBtn"
									, style: "margin-top: 5px"
									, text: "Unequip"
									, onclick: function () {
										Kt(0, e)
									}
									, hookTouch: !0
									, parent: r
								}) : o.generateElement({
									class: "joinAlBtn"
									, style: "margin-top: 5px"
									, text: "Equip"
									, onclick: function () {
										Kt(t[n].id, e)
									}
									, hookTouch: !0
									, parent: r
								}) : (o.generateElement({
									class: "joinAlBtn"
									, style: "margin-top: 5px"
									, text: "Buy"
									, onclick: function () {
										Zt(t[n].id, e)
									}
									, hookTouch: !0
									, parent: r
								}), o.generateElement({
									tag: "span"
									, class: "itemPrice"
									, text: t[n].price
									, parent: r
								}))
							}(n)
						}
					}

					function Kt(e, t) {
						i.send("13c", 0, e, t)
					}

					function Zt(e, t) {
						i.send("13c", 1, e, t)
					}

					function Jt() {
						Je.style.display = "none", ze.style.display = "none", sn()
					}

					function $t(e, t) {
						e && (t ? L.weapons = e : L.items = e);
						for(var n = 0; n < c.list.length; ++n) {
							var r = c.weapons.length + n;
							document.getElementById("actionBarItem" + r)
								.style.display = L.items.indexOf(c.list[n].id) >= 0 ? "inline-block" : "none"
						}
						for(n = 0; n < c.weapons.length; ++n) document.getElementById("actionBarItem" + n)
							.style.display = L.weapons[c.weapons[n].type] == c.weapons[n].id ? "inline-block" : "none"
					}

					function en(e) {
						I = e, R = e && window.devicePixelRatio || 1, Be.checked = e, k("native_resolution", e.toString()), dn()
					}

					function tn() {
						for(var e = "", t = 0; t < s.skinColors.length; ++t) e += t == ae ? "<div class='skinColorItem activeSkin' style='background-color:" + s.skinColors[t] + "' onclick='selectSkinColor(" + t + ")'></div>" : "<div class='skinColorItem' style='background-color:" + s.skinColors[t] + "' onclick='selectSkinColor(" + t + ")'></div>";
						Ke.innerHTML = e
					}
					var nn = document.getElementById("chatBox")
						, rn = document.getElementById("chatHolder");

					function on() {
						ln ? setTimeout(function () {
							var e = prompt("chat message");
							e && an(e)
						}, 1) : "block" == rn.style.display ? (nn.value && an(nn.value), sn()) : (Je.style.display = "none", ze.style.display = "none", rn.style.display = "block", nn.focus(), yn()), nn.value = ""
					}

					function an(e) {
						i.send("ch", e.slice(0, 30))
					}

					function sn() {
						nn.value = "", rn.style.display = "none"
					}
					var ln, cn, un = ["cunt", "whore", "fuck", "shit", "faggot", "nigger", "nigga", "dick", "vagina", "minge", "cock", "rape", "cum", "sex", "tits", "penis", "clit", "pussy", "meatcurtain", "jizz", "prune", "douche", "wanker", "damn", "bitch", "dick", "fag", "bastard"];

					function fn(e, t) {
						var n = Cr(e);
						n && (n.chatMessage = function (e) {
							for(var t, n = 0; n < un.length; ++n)
								if(e.indexOf(un[n]) > -1) {
									t = "";
									for(var r = 0; r < un[n].length; ++r) t += t.length ? "o" : "M";
									var i = new RegExp(un[n], "g");
									e = e.replace(i, t)
								} return e
						}(t), n.chatCountdown = s.chatCountdown)
					}

					function dn() {
						j = window.innerWidth, X = window.innerHeight;
						var e = Math.max(j / se, X / le) * R;
						ve.width = j * R, ve.height = X * R, ve.style.width = j + "px", ve.style.height = X + "px", be.setTransform(e, 0, 0, e, (j * R - se * e) / 2, (X * R - le * e) / 2)
					}

					function hn(e) {
						(ln = e) ? Te.classList.add("touch"): Te.classList.remove("touch")
					}

					function pn(e) {
						e.preventDefault(), e.stopPropagation(), hn(!0);
						for(var t = 0; t < e.changedTouches.length; t++) {
							var n = e.changedTouches[t];
							n.identifier == ie.id ? (ie.id = -1, xn()) : n.identifier == oe.id && (oe.id = -1, L.buildIndex >= 0 && (D = 1, vn()), D = 0, vn())
						}
					}

					function An() {
						return global_functions_exporter.cursorDisable ? global_functions_exporter.myPlayer.dir : L ? (-1 != oe.id ? cn = Math.atan2(oe.currentY - oe.startY, oe.currentX - oe.startX) : L.lockDir || ln || (cn = Math.atan2(re - X / 2, ne - j / 2)), o.fixTo(cn || 0, 2)) : 0
					}
					window.addEventListener("resize", o.checkTrusted(dn)), dn(), hn(!1), window.setUsingTouch = hn, ve.addEventListener("touchmove", o.checkTrusted(function (e) {
						e.preventDefault(), e.stopPropagation(), hn(!0);
						for(var t = 0; t < e.changedTouches.length; t++) {
							var n = e.changedTouches[t];
							n.identifier == ie.id ? (ie.currentX = n.pageX, ie.currentY = n.pageY, xn()) : n.identifier == oe.id && (oe.currentX = n.pageX, oe.currentY = n.pageY, D = 1)
						}
					}), !1), ve.addEventListener("touchstart", o.checkTrusted(function (e) {
						e.preventDefault(), e.stopPropagation(), hn(!0);
						for(var t = 0; t < e.changedTouches.length; t++) {
							var n = e.changedTouches[t];
							n.pageX < document.body.scrollWidth / 2 && -1 == ie.id ? (ie.id = n.identifier, ie.startX = ie.currentX = n.pageX, ie.startY = ie.currentY = n.pageY, xn()) : n.pageX > document.body.scrollWidth / 2 && -1 == oe.id && (oe.id = n.identifier, oe.startX = oe.currentX = n.pageX, oe.startY = oe.currentY = n.pageY, L.buildIndex < 0 && (D = 1, vn()))
						}
					}), !1), ve.addEventListener("touchend", o.checkTrusted(pn), !1), ve.addEventListener("touchcancel", o.checkTrusted(pn), !1), ve.addEventListener("touchleave", o.checkTrusted(pn), !1), ve.addEventListener("mousemove", function (e) {
						e.preventDefault(), e.stopPropagation(), hn(!1), ne = e.clientX, re = e.clientY
					}, !1), ve.addEventListener("mousedown", function (e) {
						hn(!1), 1 != D && (D = 1, vn())
					}, !1), ve.addEventListener("mouseup", function (e) {
						hn(!1), 0 != D && (D = 0, vn())
					}, !1);
					var gn = {}
						, mn = {
							87: [0, -1]
							, 38: [0, -1]
							, 83: [0, 1]
							, 40: [0, 1]
							, 65: [-1, 0]
							, 37: [-1, 0]
							, 68: [1, 0]
							, 39: [1, 0]
						};

					function yn() {
						gn = {}, i.send("rmd")
					}

					function wn() {
						return "block" != ze.style.display && "block" != rn.style.display
					}

					function vn() {
						L && L.alive && i.send("c", D, L.buildIndex >= 0 ? An() : null)
					}
					window.addEventListener("keydown", o.checkTrusted(function (e) {
						var t = e.which || e.keyCode || 0;
						27 == t ? Jt() : L && L.alive && wn() && (gn[t] || (gn[t] = 1, 69 == t ? i.send("7", 1) : 67 == t ? (Tt || (Tt = {}), Tt.x = L.x, Tt.y = L.y) : 88 == t ? (L.lockDir = L.lockDir ? 0 : 1, i.send("7", 0)) : null != L.weapons[t - 49] ? En(L.weapons[t - 49], !0) : null != L.items[t - 49 - L.weapons.length] ? En(L.items[t - 49 - L.weapons.length]) : 81 == t ? En(L.items[0]) : 82 == t ? Bn() : mn[t] ? xn() : 32 == t && (D = 1, vn())))
					})), window.addEventListener("keyup", o.checkTrusted(function (e) {
						if(L && L.alive) {
							var t = e.which || e.keyCode || 0;
							13 == t ? on() : wn() && gn[t] && (gn[t] = 0, mn[t] ? xn() : 32 == t && (D = 0, vn()))
						}
					}));
					var bn = void 0;

					function xn() {
						var e = function () {
							var e = 0
								, t = 0;
							if(-1 != ie.id) e += ie.currentX - ie.startX, t += ie.currentY - ie.startY;
							else
								for(var n in mn) {
									var r = mn[n];
									e += !!gn[n] * r[0], t += !!gn[n] * r[1]
								}
							return 0 == e && 0 == t ? void 0 : o.fixTo(Math.atan2(t, e), 2)
						}();
						(null == bn || null == e || Math.abs(e - bn) > .3) && (i.send("33", e), bn = e)
					}

					function Bn() {
						i.send("14", 1)
					}

					function En(e, t) {
						i.send("5", e, t)
					}

					function kn(e) {
						k("moo_name", je.value), !ce && i.connected && (ce = !0, x.stop("menu"), pt("Loading..."), i.send("sp", {
							name: je.value
							, moofoll: U
							, skin: ae
						}))
					}
					var Cn = !0;

					function In(e) {
						Me.style.display = "none", Ie.style.display = "block", ue.style.display = "none", gn = {}, _ = e, D = 0, ce = !0, Cn && (Cn = !1, F.length = 0)
					}

					function Tn(e, t, n, r) {
						g.showText(e, t, 50, .18, 500, Math.abs(n), n >= 0 ? "#fff" : "#8ecc51")
					}
					var Mn = 99999;

					function Pn() {
						ce = !1;
						try {
							factorem.refreshAds([2], !0)
						} catch (e) {}
						Pe.style.display = "none", Jt(), Ct = {
							x: L.x
							, y: L.y
						}, Me.style.display = "none", Ge.style.display = "block", Ge.style.fontSize = "0px", Mn = 0, setTimeout(function () {
							Ie.style.display = "block", ue.style.display = "block", Ge.style.display = "none"
						}, s.deathFadeout), gt()
					}

					function On(e) {
						L && rt.removeAllItems(e)
					}

					function Dn(e) {
						rt.disableBySid(e)
					}

					function Ln() {
						De.innerText = L.points, Le.innerText = L.food, _e.innerText = L.wood, Se.innerText = L.stone, qe.innerText = L.kills
					}
					var _n = {}
						, Sn = ["crown", "skull"]
						, qn = [];

					function Hn(e, t) {
						if(L.upgradePoints = e, L.upgrAge = t, e > 0) {
							qn.length = 0, o.removeAllChildren(Ye);
							for(var n = 0; n < c.weapons.length; ++n) c.weapons[n].age == t && (null == c.weapons[n].pre || L.weapons.indexOf(c.weapons[n].pre) >= 0) && (o.generateElement({
									id: "upgradeItem" + n
									, class: "actionBarItem"
									, onmouseout: function () {
										kt()
									}
									, parent: Ye
								})
								.style.backgroundImage = document.getElementById("actionBarItem" + n)
								.style.backgroundImage, qn.push(n));
							for(n = 0; n < c.list.length; ++n)
								if(c.list[n].age == t && (null == c.list[n].pre || L.items.indexOf(c.list[n].pre) >= 0)) {
									var r = c.weapons.length + n;
									o.generateElement({
											id: "upgradeItem" + r
											, class: "actionBarItem"
											, onmouseout: function () {
												kt()
											}
											, parent: Ye
										})
										.style.backgroundImage = document.getElementById("actionBarItem" + r)
										.style.backgroundImage, qn.push(r)
								} for(n = 0; n < qn.length; n++) ! function (e) {
								var t = document.getElementById("upgradeItem" + e);
								t.onmouseover = function () {
									c.weapons[e] ? kt(c.weapons[e], !0) : kt(c.list[e - c.weapons.length])
								}, t.onclick = o.checkTrusted(function () {
									i.send("6", e)
								}), o.hookTouchEvents(t)
							}(qn[n]);
							qn.length ? (Ye.style.display = "block", We.style.display = "block", We.innerHTML = "SELECT ITEMS (" + e + ")") : (Ye.style.display = "none", We.style.display = "none", kt())
						} else Ye.style.display = "none", We.style.display = "none", kt()
					}

					function Vn(e, t, n) {
						null != e && (L.XP = e), null != t && (L.maxXP = t), null != n && (L.age = n), n == s.maxAge ? (Ue.innerHTML = "MAX AGE", Re.style.width = "100%") : (Ue.innerHTML = "AGE " + L.age, Re.style.width = L.XP / L.maxXP * 100 + "%")
					}

					function jn(e) {
						o.removeAllChildren(He);
						for(var t = 1, n = 0; n < e.length; n += 3) ! function (n) {
							o.generateElement({
								class: "leaderHolder"
								, parent: He
								, children: [o.generateElement({
									class: "leaderboardItem"
									, style: "color:" + (e[n] == _ ? "#fff" : "rgba(255,255,255,0.6)")
									, text: t + ". " + ("" != e[n + 1] ? e[n + 1] : "unknown")
								}), o.generateElement({
									class: "leaderScore"
									, text: o.kFormat(e[n + 2]) || "0"
								})]
							})
						}(n), t++
					}

					function Xn(e, t, n, r) {
						be.save(), be.setTransform(1, 0, 0, 1, 0, 0), be.scale(R, R);
						var i = 50;
						be.beginPath(), be.arc(e, t, i, 0, 2 * Math.PI, !1), be.closePath(), be.fillStyle = "rgba(255, 255, 255, 0.3)", be.fill(), i = 50;
						var o = n - e
							, a = r - t
							, s = Math.sqrt(Math.pow(o, 2) + Math.pow(a, 2))
							, l = s > i ? s / i : 1;
						o /= l, a /= l, be.beginPath(), be.arc(e + o, t + a, .5 * i, 0, 2 * Math.PI, !1), be.closePath(), be.fillStyle = "white", be.fill(), be.restore()
					}

					function Un(e, t, n) {
						for(var r = 0; r < Q.length; ++r)(S = Q[r])
							.active && S.layer == e && (S.update(M), S.active && wr(S.x - t, S.y - n, S.scale) && (be.save(), be.translate(S.x - t, S.y - n), be.rotate(S.dir), Yn(0, 0, S, be, 1), be.restore()))
					}
					var Rn = {};

					function Yn(e, t, n, r, i) {
						if(n.src) {
							var o = c.projectiles[n.indx].src
								, a = Rn[o];
							a || ((a = new Image)
								.onload = function () {
									this.isLoaded = !0
								}, a.src = ".././img/weapons/" + o + ".png", Rn[o] = a), a.isLoaded && r.drawImage(a, e - n.scale / 2, t - n.scale / 2, n.scale, n.scale)
						} else 1 == n.indx && (r.fillStyle = "#939393", ar(e, t, n.scale, r))
					}

					function Wn(e, t, n, r) {
						var i = s.riverWidth + r
							, o = s.mapScale / 2 - t - i / 2;
						o < le && o + i > 0 && n.fillRect(0, o, se, i)
					}

					function zn(e, t, n) {
						for(var r, i, o, a = 0; a < F.length; ++a)(S = F[a])
							.active && (i = S.x + S.xWiggle - t, o = S.y + S.yWiggle - n, 0 == e && S.update(M), S.layer == e && wr(i, o, S.scale + (S.blocker || 0)) && (be.globalAlpha = S.hideFromEnemy ? .6 : 1, S.isItem ? (r = or(S), be.save(), be.translate(i, o), be.rotate(S.dir), be.drawImage(r, -r.width / 2, -r.height / 2), S.blocker && (be.strokeStyle = "#db6e6e", be.globalAlpha = .3, be.lineWidth = 6, ar(0, 0, S.blocker, be, !1, !0)), be.restore()) : (r = rr(S), be.drawImage(r, i - r.width / 2, o - r.height / 2))))
					}

					function Nn(e, t, n) {
						(S = Cr(e)) && S.startAnim(t, n)
					}

					function Fn(e, t, n) {
						be.globalAlpha = 1;
						for(var r = 0; r < z.length; ++r)(S = z[r])
							.zIndex == n && (S.animate(M), S.visible && (S.skinRot += .002 * M, V = (S == L ? An() : S.dir) + S.dirPlus, be.save(), be.translate(S.x - e, S.y - t), be.rotate(V), Qn(S, be), be.restore()))
					}

					function Qn(e, t) {
						(t = t || be)
						.lineWidth = 5.5, t.lineJoin = "miter";
						var n = Math.PI / 4 * (c.weapons[e.weaponIndex].armS || 1)
							, r = e.buildIndex < 0 && c.weapons[e.weaponIndex].hndS || 1
							, i = e.buildIndex < 0 && c.weapons[e.weaponIndex].hndD || 1;
						if(e.tailIndex > 0 && function (e, t, n) {
								if(!(Gn = Jn[e])) {
									var r = new Image;
									r.onload = function () {
										this.isLoaded = !0, this.onload = null
									}, r.src = ".././img/accessories/access_" + e + ".png", Jn[e] = r, Gn = r
								}
								var i = $n[e];
								if(!i) {
									for(var o = 0; o < nt.length; ++o)
										if(nt[o].id == e) {
											i = nt[o];
											break
										} $n[e] = i
								}
								Gn.isLoaded && (t.save(), t.translate(-20 - (i.xOff || 0), 0), i.spin && t.rotate(n.skinRot), t.drawImage(Gn, -i.scale / 2, -i.scale / 2, i.scale, i.scale), t.restore())
							}(e.tailIndex, t, e), e.buildIndex < 0 && !c.weapons[e.weaponIndex].aboveHand && (tr(c.weapons[e.weaponIndex], s.weaponVariants[e.weaponVariant].src, e.scale, 0, t), null == c.weapons[e.weaponIndex].projectile || c.weapons[e.weaponIndex].hideProjectile || Yn(e.scale, 0, c.projectiles[c.weapons[e.weaponIndex].projectile], be)), t.fillStyle = s.skinColors[e.skinColor], ar(e.scale * Math.cos(n), e.scale * Math.sin(n), 14), ar(e.scale * i * Math.cos(-n * r), e.scale * i * Math.sin(-n * r), 14), e.buildIndex < 0 && c.weapons[e.weaponIndex].aboveHand && (tr(c.weapons[e.weaponIndex], s.weaponVariants[e.weaponVariant].src, e.scale, 0, t), null == c.weapons[e.weaponIndex].projectile || c.weapons[e.weaponIndex].hideProjectile || Yn(e.scale, 0, c.projectiles[c.weapons[e.weaponIndex].projectile], be)), e.buildIndex >= 0) {
							var o = or(c.list[e.buildIndex]);
							t.drawImage(o, e.scale - c.list[e.buildIndex].holdOffset, -o.width / 2)
						}
						ar(0, 0, e.scale, t), e.skinIndex > 0 && (t.rotate(Math.PI / 2), function e(t, n, r, i) {
							if(!(Gn = Kn[t])) {
								var o = new Image;
								o.onload = function () {
									this.isLoaded = !0, this.onload = null
								}, o.src = ".././img/hats/hat_" + t + ".png", Kn[t] = o, Gn = o
							}
							var a = r || Zn[t];
							if(!a) {
								for(var s = 0; s < tt.length; ++s)
									if(tt[s].id == t) {
										a = tt[s];
										break
									} Zn[t] = a
							}
							Gn.isLoaded && n.drawImage(Gn, -a.scale / 2, -a.scale / 2, a.scale, a.scale), !r && a.topSprite && (n.save(), n.rotate(i.skinRot), e(t + "_top", n, a, i), n.restore())
						}(e.skinIndex, t, null, e))
					}
					var Gn, Kn = {}
						, Zn = {}
						, Jn = {}
						, $n = {}
						, er = {};

					function tr(e, t, n, r, i) {
						var o = e.src + (t || "")
							, a = er[o];
						a || ((a = new Image)
							.onload = function () {
								this.isLoaded = !0
							}, a.src = ".././img/weapons/" + o + ".png", er[o] = a), a.isLoaded && i.drawImage(a, n + e.xOff - e.length / 2, r + e.yOff - e.width / 2, e.length, e.width)
					}
					var nr = {};

					function rr(e) {
						var t = e.y >= s.mapScale - s.snowBiomeTop ? 2 : e.y <= s.snowBiomeTop ? 1 : 0
							, n = e.type + "_" + e.scale + "_" + t
							, r = nr[n];
						if(!r) {
							var i = document.createElement("canvas");
							i.width = i.height = 2.1 * e.scale + 5.5;
							var a = i.getContext("2d");
							if(a.translate(i.width / 2, i.height / 2), a.rotate(o.randFloat(0, Math.PI)), a.strokeStyle = it, a.lineWidth = 5.5, 0 == e.type) {
								let e = [
										["#b1d959", "#95b946"]
										, ["#bade6e", "#aac76b"]
										, ["#a7d544", "#86a63f"]
										, ["#b4db62", "#9ebf57"]
									]
									, n = e[Math.floor(Math.random() * e.length)];
								for(var l, c = 0; c < 2; ++c) sr(a, 7, l = S.scale * (c ? .5 : 1), .7 * l), a.fillStyle = t ? c ? "#fff" : "#e3f1f4" : c ? n[0] : n[1], a.fill(), c || a.stroke()
							} else if(1 == e.type)
								if(2 == t) a.fillStyle = "#606060", sr(a, 6, .3 * e.scale, .71 * e.scale), a.fill(), a.stroke(), a.fillStyle = "#89a54c", ar(0, 0, .55 * e.scale, a), a.fillStyle = "#a5c65b", ar(0, 0, .3 * e.scale, a, !0);
								else {
									var u;
									! function (e, t, n, r) {
										var i, a = Math.PI / 2 * 3
											, s = Math.PI / 6;
										e.beginPath(), e.moveTo(0, -r);
										for(var l = 0; l < 6; l++) i = o.randInt(n + .9, 1.2 * n), e.quadraticCurveTo(Math.cos(a + s) * i, Math.sin(a + s) * i, Math.cos(a + 2 * s) * r, Math.sin(a + 2 * s) * r), a += 2 * s;
										e.lineTo(0, -r), e.closePath()
									}(a, 0, S.scale, .7 * S.scale), a.fillStyle = t ? "#e3f1f4" : "#89a54c", a.fill(), a.stroke(), a.fillStyle = t ? "#6a64af" : "#c15555";
									var f = E / 4;
									for(c = 0; c < 4; ++c) ar((u = o.randInt(S.scale / 3.5, S.scale / 2.3)) * Math.cos(f * c), u * Math.sin(f * c), o.randInt(10, 12), a)
								}
							else 2 != e.type && 3 != e.type || (a.fillStyle = 2 == e.type ? 2 == t ? "#938d77" : "#939393" : "#e0c655", sr(a, 3, e.scale, e.scale), a.fill(), a.stroke(), a.fillStyle = 2 == e.type ? 2 == t ? "#b2ab90" : "#bcbcbc" : "#ebdca3", sr(a, 3, .55 * e.scale, .65 * e.scale), a.fill());
							r = i, nr[n] = r
						}
						return r
					}
					var ir = [];

					function or(e, t) {
						var n = ir[e.id];
						if(!n || t) {
							var r = document.createElement("canvas");
							r.width = r.height = 2.5 * e.scale + 5.5 + (c.list[e.id].spritePadding || 0);
							var i = r.getContext("2d");
							if(i.translate(r.width / 2, r.height / 2), i.rotate(t ? 0 : Math.PI / 2), i.strokeStyle = it, i.lineWidth = 5.5 * (t ? r.width / 81 : 1), "apple" == e.name) {
								i.fillStyle = "#c15555", ar(0, 0, e.scale, i), i.fillStyle = "#89a54c";
								var a = -Math.PI / 2;
								! function (e, t, n, r, i) {
									var o = e + 25 * Math.cos(r)
										, a = t + 25 * Math.sin(r);
									i.moveTo(e, t), i.beginPath(), i.quadraticCurveTo((e + o) / 2 + 10 * Math.cos(r + Math.PI / 2), (t + a) / 2 + 10 * Math.sin(r + Math.PI / 2), o, a), i.quadraticCurveTo((e + o) / 2 - 10 * Math.cos(r + Math.PI / 2), (t + a) / 2 - 10 * Math.sin(r + Math.PI / 2), e, t), i.closePath(), i.fill(), i.stroke()
								}(e.scale * Math.cos(a), e.scale * Math.sin(a), 0, a + Math.PI / 2, i)
							} else if("cookie" == e.name) {
								i.fillStyle = "#cca861", ar(0, 0, e.scale, i), i.fillStyle = "#937c4b";
								for(var s = E / (u = 4), l = 0; l < u; ++l) ar((f = o.randInt(e.scale / 2.5, e.scale / 1.7)) * Math.cos(s * l), f * Math.sin(s * l), o.randInt(4, 5), i, !0)
							} else if("cheese" == e.name) {
								var u, f;
								for(i.fillStyle = "#f4f3ac", ar(0, 0, e.scale, i), i.fillStyle = "#c3c28b", s = E / (u = 4), l = 0; l < u; ++l) ar((f = o.randInt(e.scale / 2.5, e.scale / 1.7)) * Math.cos(s * l), f * Math.sin(s * l), o.randInt(4, 5), i, !0)
							} else if("wood wall" == e.name || "stone wall" == e.name || "castle wall" == e.name) {
								i.fillStyle = "castle wall" == e.name ? "#83898e" : "wood wall" == e.name ? "#a5974c" : "#939393";
								var d = "castle wall" == e.name ? 4 : 3;
								sr(i, d, 1.1 * e.scale, 1.1 * e.scale), i.fill(), i.stroke(), i.fillStyle = "castle wall" == e.name ? "#9da4aa" : "wood wall" == e.name ? "#c9b758" : "#bcbcbc", sr(i, d, .65 * e.scale, .65 * e.scale), i.fill()
							} else if("spikes" == e.name || "greater spikes" == e.name || "poison spikes" == e.name || "spinning spikes" == e.name) {
								i.fillStyle = "poison spikes" == e.name ? "#7b935d" : "#939393";
								var h = .6 * e.scale;
								sr(i, "spikes" == e.name ? 5 : 6, e.scale, h), i.fill(), i.stroke(), i.fillStyle = "#a5974c", ar(0, 0, h, i), i.fillStyle = "#c9b758", ar(0, 0, h / 2, i, !0)
							} else if("windmill" == e.name || "faster windmill" == e.name || "power mill" == e.name) i.fillStyle = "#a5974c", ar(0, 0, e.scale, i), i.fillStyle = "#c9b758", cr(0, 0, 1.5 * e.scale, 29, 4, i), i.fillStyle = "#a5974c", ar(0, 0, .5 * e.scale, i);
							else if("mine" == e.name) i.fillStyle = "#939393", sr(i, 3, e.scale, e.scale), i.fill(), i.stroke(), i.fillStyle = "#bcbcbc", sr(i, 3, .55 * e.scale, .65 * e.scale), i.fill();
							else if("sapling" == e.name)
								for(l = 0; l < 2; ++l) sr(i, 7, h = e.scale * (l ? .5 : 1), .7 * h), i.fillStyle = l ? "#b4db62" : "#9ebf57", i.fill(), l || i.stroke();
							else if("pit trap" == e.name) i.fillStyle = "#a5974c", sr(i, 3, 1.1 * e.scale, 1.1 * e.scale), i.fill(), i.stroke(), i.fillStyle = it, sr(i, 3, .65 * e.scale, .65 * e.scale), i.fill();
							else if("boost pad" == e.name) i.fillStyle = "#7e7f82", lr(0, 0, 2 * e.scale, 2 * e.scale, i), i.fill(), i.stroke(), i.fillStyle = "#dbd97d"
								, function (e, t) {
									t = t || be;
									var n = e * (Math.sqrt(3) / 2);
									t.beginPath(), t.moveTo(0, -n / 2), t.lineTo(-e / 2, n / 2), t.lineTo(e / 2, n / 2), t.lineTo(0, -n / 2), t.fill(), t.closePath()
								}(1 * e.scale, i);
							else if("turret" == e.name) i.fillStyle = "#a5974c", ar(0, 0, e.scale, i), i.fill(), i.stroke(), i.fillStyle = "#939393", lr(0, -25, .9 * e.scale, 50, i), ar(0, 0, .6 * e.scale, i), i.fill(), i.stroke();
							else if("platform" == e.name) {
								i.fillStyle = "#cebd5f";
								var p = 2 * e.scale
									, A = p / 4
									, g = -e.scale / 2;
								for(l = 0; l < 4; ++l) lr(g - A / 2, 0, A, 2 * e.scale, i), i.fill(), i.stroke(), g += p / 4
							} else "healing pad" == e.name ? (i.fillStyle = "#7e7f82", lr(0, 0, 2 * e.scale, 2 * e.scale, i), i.fill(), i.stroke(), i.fillStyle = "#db6e6e", cr(0, 0, .65 * e.scale, 20, 4, i, !0)) : "spawn pad" == e.name ? (i.fillStyle = "#7e7f82", lr(0, 0, 2 * e.scale, 2 * e.scale, i), i.fill(), i.stroke(), i.fillStyle = "#71aad6", ar(0, 0, .6 * e.scale, i)) : "blocker" == e.name ? (i.fillStyle = "#7e7f82", ar(0, 0, e.scale, i), i.fill(), i.stroke(), i.rotate(Math.PI / 4), i.fillStyle = "#db6e6e", cr(0, 0, .65 * e.scale, 20, 4, i, !0)) : "teleporter" == e.name && (i.fillStyle = "#7e7f82", ar(0, 0, e.scale, i), i.fill(), i.stroke(), i.rotate(Math.PI / 4), i.fillStyle = "#d76edb", ar(0, 0, .5 * e.scale, i, !0));
							n = r, t || (ir[e.id] = n)
						}
						return n
					}

					function ar(e, t, n, r, i, o) {
						(r = r || be)
						.beginPath(), r.arc(e, t, n, 0, 2 * Math.PI), o || r.fill(), i || r.stroke()
					}

					function sr(e, t, n, r) {
						var i, o, a = Math.PI / 2 * 3
							, s = Math.PI / t;
						e.beginPath(), e.moveTo(0, -n);
						for(var l = 0; l < t; l++) i = Math.cos(a) * n, o = Math.sin(a) * n, e.lineTo(i, o), a += s, i = Math.cos(a) * r, o = Math.sin(a) * r, e.lineTo(i, o), a += s;
						e.lineTo(0, -n), e.closePath()
					}

					function lr(e, t, n, r, i, o) {
						i.fillRect(e - n / 2, t - r / 2, n, r), o || i.strokeRect(e - n / 2, t - r / 2, n, r)
					}

					function cr(e, t, n, r, i, o, a) {
						o.save(), o.translate(e, t), i = Math.ceil(i / 2);
						for(var s = 0; s < i; s++) lr(0, 0, 2 * n, r, o, a), o.rotate(Math.PI / i);
						o.restore()
					}

					function ur(e) {
						for(var t = 0; t < e.length;) rt.add(e[t], e[t + 1], e[t + 2], e[t + 3] >= Number.MAX_SAFE_INTEGER && document.getElementById("fixInvisBuildings")
							.checked ? 0 : e[t + 3], e[t + 4], e[t + 5], c.list[e[t + 6]], !0, e[t + 7] >= 0 ? {
								sid: e[t + 7]
							} : null), t += 8
					}

					function fr(e, t) {
						(S = Tr(t)) && (S.xWiggle += s.gatherWiggle * Math.cos(e), S.yWiggle += s.gatherWiggle * Math.sin(e))
					}

					function dr(e, t) {
						(S = Tr(e)) && (S.dir = t, S.xWiggle += s.gatherWiggle * Math.cos(t + Math.PI), S.yWiggle += s.gatherWiggle * Math.sin(t + Math.PI))
					}

					function hr(e, t, n, r, i, o, a, s) {
						ut && (G.addProjectile(e, t, n, r, i, o, null, null, a)
							.sid = s)
					}

					function pr(e, t) {
						for(var n = 0; n < Q.length; ++n) Q[n].sid == e && (Q[n].range = t)
					}

					function Ar(e) {
						(S = Ir(e)) && S.startAnim()
					}

					function gr(e) {
						for(var t = 0; t < W.length; ++t) W[t].forcePos = !W[t].visible, W[t].visible = !1;
						if(e) {
							var n = Date.now();
							for(t = 0; t < e.length;)(S = Ir(e[t])) ? (S.index = e[t + 1], S.t1 = void 0 === S.t2 ? n : S.t2, S.t2 = n, S.x1 = S.x, S.y1 = S.y, S.x2 = e[t + 2], S.y2 = e[t + 3], S.d1 = void 0 === S.d2 ? e[t + 4] : S.d2, S.d2 = e[t + 4], S.health = e[t + 5], S.dt = 0, S.visible = !0) : ((S = J.spawn(e[t + 2], e[t + 3], e[t + 4], e[t + 1]))
								.x2 = S.x, S.y2 = S.y, S.d2 = S.dir, S.health = e[t + 5], J.aiTypes[e[t + 1]].name || (S.name = s.cowNames[e[t + 6]]), S.forcePos = !0, S.sid = e[t], S.visible = !0), t += 7
						}
					}
					var mr = {};

					function yr(e, t) {
						var n = e.index
							, r = mr[n];
						if(!r) {
							var i = new Image;
							i.onload = function () {
								this.isLoaded = !0, this.onload = null
							}, i.src = ".././img/animals/" + e.src + ".png", r = i, mr[n] = r
						}
						if(r.isLoaded) {
							var o = 1.2 * e.scale * (e.spriteMlt || 1);
							t.drawImage(r, -o, -o, 2 * o, 2 * o)
						}
					}

					function wr(e, t, n) {
						return e + n >= 0 && e - n <= se && t + n >= 0 && t - n <= le
					}

					function vr(e, t) {
						var n = function (e) {
							for(var t = 0; t < z.length; ++t)
								if(z[t].id == e) return z[t];
							return null
						}(e[0]);
						n || (n = new f(e[0], e[1], s, o, G, rt, z, W, c, tt, nt), z.push(n)), n.spawn(t ? U : null), n.visible = !1, n.x2 = void 0, n.y2 = void 0, n.setData(e), t && (q = (L = n)
							.x, H = L.y, $t(), Ln(), Vn(), Hn(0), Pe.style.display = "block")
					}

					function br(e) {
						for(var t = 0; t < z.length; t++)
							if(z[t].id == e) {
								z.splice(t, 1);
								break
							}
					}

					function xr(e, t) {
						L && (L.itemCounts[e] = t)
					}

					function Br(e, t, n) {
						L && (L[e] = t, n && Ln())
					}

					function Er(e, t) {
						(S = Cr(e)) && (S.health = t)
					}

					function kr(e) {
						for(var t = Date.now(), n = 0; n < z.length; ++n) z[n].forcePos = !z[n].visible, z[n].visible = !1;
						for(n = 0; n < e.length;)(S = Cr(e[n])) && (S.t1 = void 0 === S.t2 ? t : S.t2, S.t2 = t, S.x1 = S.x, S.y1 = S.y, S.x2 = e[n + 1], S.y2 = e[n + 2], S.d1 = void 0 === S.d2 ? e[n + 3] : S.d2, S.d2 = e[n + 3], S.dt = 0, S.buildIndex = e[n + 4], S.weaponIndex = e[n + 5], S.weaponVariant = e[n + 6], S.team = e[n + 7], S.isLeader = e[n + 8], S.skinIndex = e[n + 9], S.tailIndex = e[n + 10], S.iconIndex = e[n + 11], S.zIndex = e[n + 12], S.visible = !0), n += 13
					}

					function Cr(e) {
						for(var t = 0; t < z.length; ++t)
							if(z[t].sid == e) return z[t];
						return null
					}

					function Ir(e) {
						for(var t = 0; t < W.length; ++t)
							if(W[t].sid == e) return W[t];
						return null
					}

					function Tr(e) {
						for(var t = 0; t < F.length; ++t)
							if(F[t].sid == e) return F[t];
						return null
					}
					var Mr = -1;

					function Pr() {
						var e = Date.now() - Mr;
						window.pingTime = e, ke.innerText = "Ping: " + e + " ms"
					}

					function Or() {
						Mr = Date.now(), i.send("pp")
					}

					function Dr(e) {
						if(!(e < 0)) {
							var t = Math.floor(e / 60)
								, n = e % 60;
							n = ("0" + n)
								.slice(-2), Ce.innerText = "Server restarting in " + t + ":" + n, Ce.hidden = !1
						}
					}

					function Lr(e) {
						window.open(e, "_blank")
					}
					var _r = !0
						, Sr = [];
					(new Image)
					.src = "data:image/png;base64,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", window.requestAnimFrame = window.requestAnimationFrame || window.webkitRequestAnimationFrame || window.mozRequestAnimationFrame || function (e) {
							window.setTimeout(e, 1e3 / 60)
						}
						, function () {
							var e = s.mapScale / 2;
							rt.add(0, e, e + 200, 0, s.treeScales[3], 0), rt.add(1, e, e - 480, 0, s.treeScales[3], 0), rt.add(2, e + 300, e + 450, 0, s.treeScales[3], 0), rt.add(3, e - 950, e - 130, 0, s.treeScales[2], 0), rt.add(4, e - 750, e - 400, 0, s.treeScales[3], 0), rt.add(5, e - 700, e + 400, 0, s.treeScales[2], 0), rt.add(6, e + 800, e - 200, 0, s.treeScales[3], 0), rt.add(7, e - 260, e + 340, 0, s.bushScales[3], 1), rt.add(8, e + 760, e + 310, 0, s.bushScales[3], 1), rt.add(9, e - 800, e + 100, 0, s.bushScales[3], 1), rt.add(10, e - 800, e + 300, 0, c.list[4].scale, c.list[4].id, c.list[10]), rt.add(11, e + 650, e - 390, 0, c.list[4].scale, c.list[4].id, c.list[10]), rt.add(12, e - 400, e - 450, 0, s.rockScales[2], 2)
						}()
						, function e() {
							P = Date.now(), M = P - Y, Y = P
								, function () {
									if(L && (!O || P - O >= 1e3 / s.clientSendRate) && (O = P, i.send("2", An())), Mn < 120 && (Mn += .1 * M, Ge.style.fontSize = Math.min(Math.round(Mn), 120) + "px"), L) {
										var e = o.getDistance(q, H, L.x, L.y)
											, t = o.getDirection(L.x, L.y, q, H)
											, n = Math.min(.01 * e * M, e);
										e > .05 ? (q += n * Math.cos(t), H += n * Math.sin(t)) : (q = L.x, H = L.y)
									} else q = s.mapScale / 2, H = s.mapScale / 2;
									for(var r = P - 1e3 / s.serverUpdateRate, a = 0; a < z.length + W.length; ++a)
										if((S = z[a] || W[a - z.length]) && S.visible)
											if(S.forcePos) S.x = S.x2, S.y = S.y2, S.dir = S.d2;
											else {
												var l = S.t2 - S.t1
													, c = (r - S.t1) / l;
												S.dt += M;
												var u = Math.min(1.7, S.dt / 170)
													, f = S.x2 - S.x1;
												S.x = S.x1 + f * u, f = S.y2 - S.y1, S.y = S.y1 + f * u, S.dir = Math.lerpAngle(S.d2, S.d1, Math.min(1.2, c))
											} var d = q - se / 2
										, h = H - le / 2
										, p = be
										, A = ""
										, m = ""
										, y = ""
										, w = "";
									1 == _r ? (w = "#e6e6e6", y = "#78a1d3", A = "#8dba2c", m = "#d3b945") : (w = "#fff", y = "#91b2db", A = "#b6db66", m = "#dbc666");
									s.waveMax = 1.7, s.snowBiomeTop = 2400, s.deathFadeout = 0, s.snowBiomeTop - h <= 0 && s.mapScale - s.snowBiomeTop - h >= le ? (be.fillStyle = A, be.fillRect(0, 0, se, le)) : s.mapScale - s.snowBiomeTop - h <= 0 ? (be.fillStyle = m, be.fillRect(0, 0, se, le)) : s.snowBiomeTop - h >= le ? (be.fillStyle = w, be.fillRect(0, 0, se, le)) : s.snowBiomeTop - h >= 0 ? (be.fillStyle = w, be.fillRect(0, 0, se, s.snowBiomeTop - h), be.fillStyle = A, be.fillRect(0, s.snowBiomeTop - h, se, le - (s.snowBiomeTop - h))) : (be.fillStyle = A, be.fillRect(0, 0, se, s.mapScale - s.snowBiomeTop - h), be.fillStyle = m, be.fillRect(0, s.mapScale - s.snowBiomeTop - h, se, le - (s.mapScale - s.snowBiomeTop - h))), Cn || ((ee += te * s.waveSpeed * M) >= s.waveMax ? (ee = s.waveMax, te = -1) : ee <= 1 && (ee = te = 1), be.globalAlpha = 1, be.fillStyle = m, Wn(0, h, be, s.riverPadding + 750), be.fillStyle = y, Wn(0, h, be, 250 * (ee - 1))), be.lineWidth = 4, be.strokeStyle = "#000", be.globalAlpha = .06, be.beginPath();
									for(var v = -q; v < se; v += le / 18) v > 0 && (be.moveTo(v, 0), be.lineTo(v, le));
									for(var b = -H; b < le; b += le / 18) v > 0 && (be.moveTo(0, b), be.lineTo(se, b));
									for(be.stroke(), be.globalAlpha = 1, be.strokeStyle = it, zn(-1, d, h), be.globalAlpha = 1, be.lineWidth = 5.5, Un(0, d, h), Fn(d, h, 0), be.globalAlpha = 1, a = 0; a < W.length; ++a)(S = W[a])
										.active && S.visible && (S.animate(M), be.save(), be.translate(S.x - d, S.y - h), be.rotate(S.dir + S.dirPlus - Math.PI / 2), yr(S, be), be.restore());
									if(zn(0, d, h), Un(1, d, h), zn(1, d, h), Fn(d, h, 1), zn(2, d, h), zn(3, d, h), be.fillStyle = "#000", be.globalAlpha = .09, d <= 0 && be.fillRect(0, 0, -d, le), s.mapScale - d <= se) {
										var x = Math.max(0, -h);
										be.fillRect(s.mapScale - d, x, se - (s.mapScale - d), le - x)
									}
									if(h <= 0 && be.fillRect(-d, 0, se + d, -h), s.mapScale - h <= le) {
										var B = Math.max(0, -d)
											, E = 0;
										s.mapScale - d <= se && (E = se - (s.mapScale - d)), be.fillRect(B, s.mapScale - h, se - B - E, le - (s.mapScale - h))
									}
									for(be.globalAlpha = 1, be.fillStyle = "rgba(0, 0, 70, 0.35)", be.fillRect(0, 0, se, le), be.strokeStyle = ot, a = 0; a < z.length + W.length; ++a)
										if((S = z[a] || W[a - z.length])
											.visible && (10 != S.skinIndex || S == L || S.team && S.team == L.team)) {
											if(1 == S.isPlayer) var k = (S.team ? "[" + S.team + "] " : "") + `{${S.sid}} ` + (global_functions_exporter.enableNames && S.name || "");
											else k = `[AI, ${S.health} / ${S.maxHealth}] ` + (S.team ? "[" + S.team + "] " : "") + (global_functions_exporter.enableNames && S.name || "");
											p = be;

											function C(e, t, n) {
												p.beginPath(), p.lineWidth = 5, p.strokeStyle = n || "#BEBEBE", p.moveTo(L.x - d, L.y - h), p.lineTo(e - d, t - h), p.stroke()
											}
											for(var I of (global_functions_exporter.BundleF = d, window.tr = function (e, t) {
													Sr.push([e, t])
												}, window.cleartracers = function () {
													Sr = []
												}, Sr)) C(I[0], I[1]);
											if(global_functions_exporter.mouseCoords && Ve.secondary == Ve.weapon && 10 != Ve.secondary) {
												p.beginPath(), p.lineWidth = 10, p.strokeStyle = "#ff0000";
												let e = p.globalAlpha;
												p.globalAlpha = .2, p.moveTo(L.x - d, L.y - h), p.lineTo(global_functions_exporter.mouseCoords[0] - d, global_functions_exporter.mouseCoords[1] - h), p.stroke(), p.globalAlpha = e
											}
											if(p.strokeStyle = "rgba(0, 0, 70, 0.35)", S.sid == L.sid && S.isPlayer && (p.textAlign = "center", p.textBaseline = "middle", p.fillStyle = "#fff", p.font = "20px Hammersmith One", p.lineJoin = "round", p.lineWidth = 0, p.strokeText(global_functions_exporter.dataPackage, S.x - d, S.y - h + S.scale + s.nameY + 42), p.fillText(global_functions_exporter.dataPackage, S.x - d, S.y - h + S.scale + s.nameY + 42)), !S.isPlayer || S == L || S.team == L.team && S.team || (p.beginPath(), p.lineWidth = 5, p.strokeStyle = "#FF0000", p.moveTo(L.x - d, L.y - h), p.lineTo(S.x - d, S.y - h), p.stroke(), global_functions_exporter.enableNames && (p.font = (S.nameScale || 25) + "px Hammersmith One", p.textBaseline = "middle", p.textAlign = "center", p.lineWidth = S.nameScale ? 11 : 8, p.lineJoin = "round", p.strokeText(S.name + " / " + Math.floor(Math.sqrt(Math.pow(S.y - L.y, 2) + Math.pow(S.x - L.x, 2))), (L.x - d + S.x - d) / 2, (L.y - h + S.y - h) / 2), p.fillText(S.name + " / " + Math.floor(Math.sqrt(Math.pow(S.y - L.y, 2) + Math.pow(S.x - L.x, 2))), (L.x - d + S.x - d) / 2, (L.y - h + S.y - h) / 2))), S.isPlayer && S != L && S.team && S.team == L.team && (p.beginPath(), p.lineWidth = 5, p.strokeStyle = "#228b22", p.moveTo(L.x - d, L.y - h), p.lineTo(S.x - d, S.y - h), p.stroke(), global_functions_exporter.enableNames && (p.font = (S.nameScale || 25) + "px Hammersmith One", p.textBaseline = "middle", p.textAlign = "center", p.lineWidth = S.nameScale ? 11 : 8, p.lineJoin = "round", p.strokeText(S.name, (L.x - d + S.x - d) / 2, (L.y - h + S.y - h) / 2), p.fillText(S.name, (L.x - d + S.x - d) / 2, (L.y - h + S.y - h) / 2))), S.isAI) p.beginPath(), p.lineWidth = 5, p.strokeStyle = "blue", p.moveTo(L.x - d, L.y - h), p.lineTo(S.x - d, S.y - h), p.stroke();
											else try {
												S.x, Math.cos(S.dir), S.y, Math.sin(S.dir);
												let t = S.dir - 1.57
													, n = S.dir + 1.57
													, r = (global_functions_exporter.playerList[S.sid] ? global_functions_exporter.playerList[S.sid] : {
														xvel: 0
														, yvel: 0
														, addDist: 0
													})
													.perfectMaxMeleeRange ? global_functions_exporter.playerList[S.sid].perfectMaxMeleeRange : 219;
												p.beginPath();
												let i = p.globalAlpha;
												p.globalAlpha = .1, p.arc(S.x - d, S.y - h, r, t, n), p.fillStyle = "red", p.fill(), p.globalAlpha = i
											} catch (e) {
												console.error(e)
											}
											if("" != k) {
												if(be.font = (S.nameScale || 30) + "px Hammersmith One", be.fillStyle = "#fff", be.textBaseline = "middle", be.textAlign = "center", be.lineWidth = S.nameScale ? 11 : 8, be.lineJoin = "round", be.strokeText(k, S.x - d, S.y - h - S.scale - s.nameY), be.fillText(k, S.x - d, S.y - h - S.scale - s.nameY), S.isLeader && _n.crown.isLoaded) {
													var T = s.crownIconScale;
													B = S.x - d - T / 2 - be.measureText(k)
														.width / 2 - s.crownPad, be.drawImage(_n.crown, B, S.y - h - S.scale - s.nameY - T / 2 - 5, T, T)
												}
												1 == S.iconIndex && _n.skull.isLoaded && (T = s.crownIconScale, B = S.x - d - T / 2 + be.measureText(k)
													.width / 2 + s.crownPad, be.drawImage(_n.skull, B, S.y - h - S.scale - s.nameY - T / 2 - 5, T, T)), S.isPlayer && global_functions_exporter.playerList[S.sid] && void 0 !== global_functions_exporter.playerList[S.sid].shameCount ? (S.previousShameCount = global_functions_exporter.playerList[S.sid].shameCount, T = s.crownIconScale, be.fillStyle = "#ff0000", be.strokeText("     " + global_functions_exporter.playerList[S.sid].shameCount, S.x - d - T / 2 + be.measureText(k)
													.width / 2 + s.crownPad, S.y - h - S.scale - s.nameY), be.fillText("     " + global_functions_exporter.playerList[S.sid].shameCount, S.x - d - T / 2 + be.measureText(k)
													.width / 2 + s.crownPad, S.y - h - S.scale - s.nameY), be.fillStyle = "#fff") : S.isPlayer && global_functions_exporter.playerList[S.sid] && (T = s.crownIconScale, be.fillStyle = "#ff0000", be.strokeText("     " + (S.previousShameCount ? S.previousShameCount : 0), S.x - d - T / 2 + be.measureText(k)
													.width / 2 + s.crownPad, S.y - h - S.scale - s.nameY), be.fillText("     " + (S.previousShameCount ? S.previousShameCount : 0), S.x - d - T / 2 + be.measureText(k)
													.width / 2 + s.crownPad, S.y - h - S.scale - s.nameY), be.fillStyle = "#fff")
											}
											S.health > 0 && (s.healthBarWidth, be.fillStyle = ot, be.roundRect(S.x - d - s.healthBarWidth - s.healthBarPad, S.y - h + S.scale + s.nameY, 2 * s.healthBarWidth + 2 * s.healthBarPad, 17, 8), be.fill(), be.fillStyle = S == L || S.team && S.team == L.team ? "#8ecc51" : "#cc5151", be.roundRect(S.x - d - s.healthBarWidth, S.y - h + S.scale + s.nameY + s.healthBarPad, 2 * s.healthBarWidth * (S.health / S.maxHealth), 17 - 2 * s.healthBarPad, 7), be.fill()), global_functions_exporter.myPlayerBundleObject = L;
											try {
												if(S.isPlayer && global_functions_exporter.playerList && global_functions_exporter.playerList[S.sid]) {
													let e = global_functions_exporter.playerList[S.sid];
													s.healthBarWidth, be.fillStyle = ot, be.roundRect(S.x - d - s.healthBarPad, S.y - h + S.scale + s.nameY - 13, s.healthBarWidth + 2 * s.healthBarPad, 17, 8), be.fill(), be.fillStyle = e.sCd <= 0 ? "#cc6666" : `hsl(${50*e.sCd}, 50%, 60%)`, be.roundRect(S.x - d, S.y - h + S.scale + s.nameY + s.healthBarPad - 13, 2 * s.healthBarWidth / 2 * (null != e.secondary ? (window.globalWeaponsList.find(t => t.id === e.secondary)
															.cd - (e.sCd < 0 ? 0 : e.sCd)) / window.globalWeaponsList.find(t => t.id === e.secondary)
														.cd : 1), 17 - 2 * s.healthBarPad, 7), be.fill(), s.healthBarWidth, be.fillStyle = ot, be.roundRect(S.x - d - s.healthBarWidth - s.healthBarPad, S.y - h + S.scale + s.nameY - 13, s.healthBarWidth + 2 * s.healthBarPad, 17, 8), be.fill(), be.fillStyle = e.pCd <= 0 ? "#cc6666" : `hsl(${50*e.pCd}, 50%, 60%)`, be.roundRect(S.x - d - s.healthBarWidth, S.y - h + S.scale + s.nameY + s.healthBarPad - 13, 2 * s.healthBarWidth / 2 * (null != e.primary ? (window.globalWeaponsList.find(t => t.id === e.primary)
															.cd - (e.pCd < 0 ? 0 : e.pCd)) / window.globalWeaponsList.find(t => t.id === e.primary)
														.cd : 1), 17 - 2 * s.healthBarPad, 7), be.fill(), s.healthBarWidth, be.fillStyle = ot, be.roundRect(S.x - d - s.healthBarWidth - s.healthBarPad, S.y - h + S.scale + s.nameY + 13, 2 * s.healthBarWidth + 2 * s.healthBarPad, 17, 8), be.fill(), be.fillStyle = "#aaa9ad", be.roundRect(S.x - d - s.healthBarWidth, S.y - h + S.scale + s.nameY + s.healthBarPad + 13, 2 * s.healthBarWidth * (e.turretCd <= 0 ? 1 : (22 - e.turretCd) / 22), 17 - 2 * s.healthBarPad, 7), be.fill()
												}
											} catch (e) {
												console.error(e)
											}
										} for(g.update(M, be, d, h), a = 0; a < z.length; ++a)
										if((S = z[a])
											.visible && S.chatCountdown > 0) {
											S.chatCountdown -= M, S.chatCountdown <= 0 && (S.chatCountdown = 0), be.font = "32px Hammersmith One";
											var D = be.measureText(S.chatMessage);
											be.textBaseline = "middle", be.textAlign = "center", B = S.x - d, x = S.y - S.scale - h - 90;
											var _ = D.width + 17;
											be.fillStyle = "rgba(0,0,0,0.2)", be.roundRect(B - _ / 2, x - 23.5, _, 47, 6), be.fill(), be.fillStyle = "#fff", be.fillText(S.chatMessage, B, x)
										}!
									function (e) {
										if(L && L.alive) {
											Ze.clearRect(0, 0, Qe.width, Qe.height), Ze.strokeStyle = "#fff", Ze.lineWidth = 4;
											for(var t = 0; t < Wt.length; ++t)(Yt = Wt[t])
												.update(Ze, e);
											if(Ze.globalAlpha = 1, Ze.fillStyle = "#fff", ar(L.x / s.mapScale * Qe.width, L.y / s.mapScale * Qe.height, 7, Ze, !0), Ze.fillStyle = "rgba(255,255,255,0.35)", L.team && It)
												for(t = 0; t < It.length;) ar(It[t] / s.mapScale * Qe.width, It[t + 1] / s.mapScale * Qe.height, 7, Ze, !0), t += 2;
											Ct && (Ze.fillStyle = "#fc5553", Ze.font = "34px Hammersmith One", Ze.textBaseline = "middle", Ze.textAlign = "center", Ze.fillText("x", Ct.x / s.mapScale * Qe.width, Ct.y / s.mapScale * Qe.height)), Tt && (Ze.fillStyle = "#fff", Ze.font = "34px Hammersmith One", Ze.textBaseline = "middle", Ze.textAlign = "center", Ze.fillText("x", Tt.x / s.mapScale * Qe.width, Tt.y / s.mapScale * Qe.height))
										}
									}(M), -1 !== ie.id && Xn(ie.startX, ie.startY, ie.currentX, ie.currentY), -1 !== oe.id && Xn(oe.startX, oe.startY, oe.currentX, oe.currentY)
								}(), window.requestAnimFrame(e)
						}(), window.openLink = Lr, window.aJoinReq = Vt, window.follmoo = function () {
							U || (U = !0, k("moofoll", 1))
						}, window.kickFromClan = jt, window.sendJoin = Xt, window.leaveAlliance = Rt, window.createAlliance = Ut, window.storeBuy = Zt, window.storeEquip = Kt, window.showItemInfo = kt, window.selectSkinColor = function (e) {
							ae = e, tn()
						}, window.changeStoreIndex = function (e) {
							Ft != e && (Ft = e, Gt())
						}, window.config = s, setInterval(() => {
							_r = !_r, window.requestAnimFrame(e)
						}, 39e4)
				}, function (e, t) {
					! function (e, t, n) {
						function r(e, t) {
							return typeof e === t
						}
						var i = []
							, o = []
							, a = {
								_version: "3.5.0"
								, _config: {
									classPrefix: ""
									, enableClasses: !0
									, enableJSClass: !0
									, usePrefixes: !0
								}
								, _q: []
								, on: function (e, t) {
									var n = this;
									setTimeout(function () {
										t(n[e])
									}, 0)
								}
								, addTest: function (e, t, n) {
									o.push({
										name: e
										, fn: t
										, options: n
									})
								}
								, addAsyncTest: function (e) {
									o.push({
										name: null
										, fn: e
									})
								}
							}
							, s = function () {};
						s.prototype = a, s = new s;
						var l = t.documentElement
							, c = "svg" === l.nodeName.toLowerCase();
						s.addTest("passiveeventlisteners", function () {
								var t = !1;
								try {
									var n = Object.defineProperty({}, "passive", {
										get: function () {
											t = !0
										}
									});
									e.addEventListener("test", null, n)
								} catch (e) {}
								return t
							})
							, function () {
								var e, t, n, a, l, c;
								for(var u in o)
									if(o.hasOwnProperty(u)) {
										if(e = [], (t = o[u])
											.name && (e.push(t.name.toLowerCase()), t.options && t.options.aliases && t.options.aliases.length))
											for(n = 0; n < t.options.aliases.length; n++) e.push(t.options.aliases[n].toLowerCase());
										for(a = r(t.fn, "function") ? t.fn() : t.fn, l = 0; l < e.length; l++) 1 === (c = e[l].split("."))
											.length ? s[c[0]] = a : (!s[c[0]] || s[c[0]] instanceof Boolean || (s[c[0]] = new Boolean(s[c[0]])), s[c[0]][c[1]] = a), i.push((a ? "" : "no-") + c.join("-"))
									}
							}()
							, function (e) {
								var t = l.className
									, n = s._config.classPrefix || "";
								if(c && (t = t.baseVal), s._config.enableJSClass) {
									var r = new RegExp("(^|\\s)" + n + "no-js(\\s|$)");
									t = t.replace(r, "$1" + n + "js$2")
								}
								s._config.enableClasses && (t += " " + n + e.join(" " + n), c ? l.className.baseVal = t : l.className = t)
							}(i), delete a.addTest, delete a.addAsyncTest;
						for(var u = 0; u < s._q.length; u++) s._q[u]();
						e.Modernizr = s
					}(window, document)
				}, function (e, t, n) {
					var r = n(24);
					n(19), e.exports = {
						socket: null
						, connected: !1
						, socketId: -1
						, connect: function (e, t, n) {
							if(!this.socket) {
								var i = this;
								try {
									var o = !1
										, a = e;
									this.socket = new WebSocket(a), this.socket.binaryType = "arraybuffer", this.socket.onmessage = function (e) {
										var t = new Uint8Array(e.data)
											, o = r.decode(t)
											, a = o[0];
										t = o[1], "io-init" == a ? i.socketId = t[0] : n[a].apply(void 0, t)
									}, this.socket.onopen = function () {
										i.connected = !0, t()
									}, this.socket.onclose = function (e) {
										i.connected = !1, 4001 == e.code ? t("Invalid Connection") : o || t("disconnected")
									}, this.socket.onerror = function (e) {
										this.socket && this.socket.readyState != WebSocket.OPEN && (o = !0, console.error("Socket error", arguments), t("Socket error"))
									}
								} catch (e) {
									console.warn("Socket connection error:", e), t(e)
								}
							}
						}
						, send: function (e) {
							var t = Array.prototype.slice.call(arguments, 1)
								, n = r.encode([e, t]);
							this.socket.send(n)
						}
						, socketReady: function () {
							return this.socket && this.connected
						}
						, close: function () {
							this.socket && this.socket.close()
						}
					}
				}, function (e, t, n) {
					t.encode = n(9)
						.encode, t.decode = n(15)
						.decode, t.Encoder = n(37)
						.Encoder, t.Decoder = n(38)
						.Decoder, t.createCodec = n(39)
						.createCodec, t.codec = n(40)
						.codec
				}, function (e, t, n) {
					(function (t) {
						function n(e) {
							return e && e.isBuffer && e
						}
						e.exports = n(void 0 !== t && t) || n(this.Buffer) || n("undefined" != typeof window && window.Buffer) || this.Buffer
					})
					.call(this, n(11)
						.Buffer)
				}, function (e, t, n) {
					t.byteLength = function (e) {
						var t = c(e)
							, n = t[0]
							, r = t[1];
						return 3 * (n + r) / 4 - r
					}, t.toByteArray = function (e) {
						var t, n, r = c(e)
							, a = r[0]
							, s = r[1]
							, l = new o(3 * (a + s) / 4 - s)
							, u = 0
							, f = s > 0 ? a - 4 : a;
						for(n = 0; n < f; n += 4) t = i[e.charCodeAt(n)] << 18 | i[e.charCodeAt(n + 1)] << 12 | i[e.charCodeAt(n + 2)] << 6 | i[e.charCodeAt(n + 3)], l[u++] = t >> 16 & 255, l[u++] = t >> 8 & 255, l[u++] = 255 & t;
						return 2 === s && (t = i[e.charCodeAt(n)] << 2 | i[e.charCodeAt(n + 1)] >> 4, l[u++] = 255 & t), 1 === s && (t = i[e.charCodeAt(n)] << 10 | i[e.charCodeAt(n + 1)] << 4 | i[e.charCodeAt(n + 2)] >> 2, l[u++] = t >> 8 & 255, l[u++] = 255 & t), l
					}, t.fromByteArray = function (e) {
						for(var t, n = e.length, i = n % 3, o = [], a = 0, s = n - i; a < s; a += 16383) o.push(f(e, a, a + 16383 > s ? s : a + 16383));
						return 1 === i ? (t = e[n - 1], o.push(r[t >> 2] + r[t << 4 & 63] + "==")) : 2 === i && (t = (e[n - 2] << 8) + e[n - 1], o.push(r[t >> 10] + r[t >> 4 & 63] + r[t << 2 & 63] + "=")), o.join("")
					};
					for(var r = [], i = [], o = "undefined" != typeof Uint8Array ? Uint8Array : Array, a = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/", s = 0, l = a.length; s < l; ++s) r[s] = a[s], i[a.charCodeAt(s)] = s;

					function c(e) {
						var t = e.length;
						if(t % 4 > 0) throw new Error("Invalid string. Length must be a multiple of 4");
						var n = e.indexOf("=");
						return -1 === n && (n = t), [n, n === t ? 0 : 4 - n % 4]
					}

					function u(e) {
						return r[e >> 18 & 63] + r[e >> 12 & 63] + r[e >> 6 & 63] + r[63 & e]
					}

					function f(e, t, n) {
						for(var r, i = [], o = t; o < n; o += 3) r = (e[o] << 16 & 16711680) + (e[o + 1] << 8 & 65280) + (255 & e[o + 2]), i.push(u(r));
						return i.join("")
					}
					i["-".charCodeAt(0)] = 62, i["_".charCodeAt(0)] = 63
				}, function (e, t) {
					var n = {}.toString;
					e.exports = Array.isArray || function (e) {
						return "[object Array]" == n.call(e)
					}
				}, function (e, t, n) {
					var r = n(0);

					function i(e) {
						return new Array(e)
					}(t = e.exports = i(0))
					.alloc = i, t.concat = r.concat, t.from = function (e) {
						if(!r.isBuffer(e) && r.isView(e)) e = r.Uint8Array.from(e);
						else if(r.isArrayBuffer(e)) e = new Uint8Array(e);
						else {
							if("string" == typeof e) return r.from.call(t, e);
							if("number" == typeof e) throw new TypeError('"value" argument must not be a number')
						}
						return Array.prototype.slice.call(e)
					}
				}, function (e, t, n) {
					var r = n(0)
						, i = r.global;

					function o(e) {
						return new i(e)
					}(t = e.exports = r.hasBuffer ? o(0) : [])
					.alloc = r.hasBuffer && i.alloc || o, t.concat = r.concat, t.from = function (e) {
						if(!r.isBuffer(e) && r.isView(e)) e = r.Uint8Array.from(e);
						else if(r.isArrayBuffer(e)) e = new Uint8Array(e);
						else {
							if("string" == typeof e) return r.from.call(t, e);
							if("number" == typeof e) throw new TypeError('"value" argument must not be a number')
						}
						return i.from && 1 !== i.from.length ? i.from(e) : new i(e)
					}
				}, function (e, t, n) {
					var r = n(0);

					function i(e) {
						return new Uint8Array(e)
					}(t = e.exports = r.hasArrayBuffer ? i(0) : [])
					.alloc = i, t.concat = r.concat, t.from = function (e) {
						if(r.isView(e)) {
							var n = e.byteOffset
								, i = e.byteLength;
							(e = e.buffer)
							.byteLength !== i && (e.slice ? e = e.slice(n, n + i) : (e = new Uint8Array(e))
								.byteLength !== i && (e = Array.prototype.slice.call(e, n, n + i)))
						} else {
							if("string" == typeof e) return r.from.call(t, e);
							if("number" == typeof e) throw new TypeError('"value" argument must not be a number')
						}
						return new Uint8Array(e)
					}
				}, function (e, t) {
					t.copy = function (e, t, n, r) {
						var i;
						n || (n = 0), r || 0 === r || (r = this.length), t || (t = 0);
						var o = r - n;
						if(e === this && n < t && t < r)
							for(i = o - 1; i >= 0; i--) e[i + t] = this[i + n];
						else
							for(i = 0; i < o; i++) e[i + t] = this[i + n];
						return o
					}, t.toString = function (e, t, n) {
						var r = 0 | t;
						n || (n = this.length);
						for(var i = "", o = 0; r < n;)(o = this[r++]) < 128 ? i += String.fromCharCode(o) : (192 == (224 & o) ? o = (31 & o) << 6 | 63 & this[r++] : 224 == (240 & o) ? o = (15 & o) << 12 | (63 & this[r++]) << 6 | 63 & this[r++] : 240 == (248 & o) && (o = (7 & o) << 18 | (63 & this[r++]) << 12 | (63 & this[r++]) << 6 | 63 & this[r++]), o >= 65536 ? (o -= 65536, i += String.fromCharCode(55296 + (o >>> 10), 56320 + (1023 & o))) : i += String.fromCharCode(o));
						return i
					}, t.write = function (e, t) {
						for(var n = t || (t |= 0), r = e.length, i = 0, o = 0; o < r;)(i = e.charCodeAt(o++)) < 128 ? this[n++] = i : i < 2048 ? (this[n++] = 192 | i >>> 6, this[n++] = 128 | 63 & i) : i < 55296 || i > 57343 ? (this[n++] = 224 | i >>> 12, this[n++] = 128 | i >>> 6 & 63, this[n++] = 128 | 63 & i) : (i = 65536 + (i - 55296 << 10 | e.charCodeAt(o++) - 56320), this[n++] = 240 | i >>> 18, this[n++] = 128 | i >>> 12 & 63, this[n++] = 128 | i >>> 6 & 63, this[n++] = 128 | 63 & i);
						return n - t
					}
				}, function (e, t, n) {
					t.setExtPackers = function (e) {
						e.addExtPacker(14, Error, [f, l]), e.addExtPacker(1, EvalError, [f, l]), e.addExtPacker(2, RangeError, [f, l]), e.addExtPacker(3, ReferenceError, [f, l]), e.addExtPacker(4, SyntaxError, [f, l]), e.addExtPacker(5, TypeError, [f, l]), e.addExtPacker(6, URIError, [f, l]), e.addExtPacker(10, RegExp, [u, l]), e.addExtPacker(11, Boolean, [c, l]), e.addExtPacker(12, String, [c, l]), e.addExtPacker(13, Date, [Number, l]), e.addExtPacker(15, Number, [c, l]), "undefined" != typeof Uint8Array && (e.addExtPacker(17, Int8Array, a), e.addExtPacker(18, Uint8Array, a), e.addExtPacker(19, Int16Array, a), e.addExtPacker(20, Uint16Array, a), e.addExtPacker(21, Int32Array, a), e.addExtPacker(22, Uint32Array, a), e.addExtPacker(23, Float32Array, a), "undefined" != typeof Float64Array && e.addExtPacker(24, Float64Array, a), "undefined" != typeof Uint8ClampedArray && e.addExtPacker(25, Uint8ClampedArray, a), e.addExtPacker(26, ArrayBuffer, a), e.addExtPacker(29, DataView, a)), i.hasBuffer && e.addExtPacker(27, o, i.from)
					};
					var r, i = n(0)
						, o = i.global
						, a = i.Uint8Array.from
						, s = {
							name: 1
							, message: 1
							, stack: 1
							, columnNumber: 1
							, fileName: 1
							, lineNumber: 1
						};

					function l(e) {
						return r || (r = n(9)
							.encode), r(e)
					}

					function c(e) {
						return e.valueOf()
					}

					function u(e) {
						(e = RegExp.prototype.toString.call(e)
							.split("/"))
						.shift();
						var t = [e.pop()];
						return t.unshift(e.join("/")), t
					}

					function f(e) {
						var t = {};
						for(var n in s) t[n] = e[n];
						return t
					}
				}, function (e, t, n) {
					var r = n(5)
						, i = n(7)
						, o = i.Uint64BE
						, a = i.Int64BE
						, s = n(0)
						, l = n(6)
						, c = n(34)
						, u = n(13)
						.uint8
						, f = n(3)
						.ExtBuffer
						, d = "undefined" != typeof Uint8Array
						, h = "undefined" != typeof Map
						, p = [];
					p[1] = 212, p[2] = 213, p[4] = 214, p[8] = 215, p[16] = 216, t.getWriteType = function (e) {
						var t = c.getWriteToken(e)
							, n = e && e.useraw
							, i = d && e && e.binarraybuffer
							, A = i ? s.isArrayBuffer : s.isBuffer
							, g = i ? function (e, t) {
								v(e, new Uint8Array(t))
							} : v
							, m = h && e && e.usemap ? function (e, n) {
								if(!(n instanceof Map)) return b(e, n);
								var r = n.size;
								t[r < 16 ? 128 + r : r <= 65535 ? 222 : 223](e, r);
								var i = e.codec.encode;
								n.forEach(function (t, n, r) {
									i(e, n), i(e, t)
								})
							} : b;
						return {
							boolean: function (e, n) {
								t[n ? 195 : 194](e, n)
							}
							, function: w
							, number: function (e, n) {
								var r = 0 | n;
								n === r ? t[-32 <= r && r <= 127 ? 255 & r : 0 <= r ? r <= 255 ? 204 : r <= 65535 ? 205 : 206 : -128 <= r ? 208 : -32768 <= r ? 209 : 210](e, r) : t[203](e, n)
							}
							, object: n ? function (e, n) {
								if(A(n)) return function (e, n) {
									var r = n.length;
									t[r < 32 ? 160 + r : r <= 65535 ? 218 : 219](e, r), e.send(n)
								}(e, n);
								y(e, n)
							} : y
							, string: function (e) {
								return function (n, r) {
									var i = r.length
										, o = 5 + 3 * i;
									n.offset = n.reserve(o);
									var a = n.buffer
										, s = e(i)
										, c = n.offset + s;
									i = l.write.call(a, r, c);
									var u = e(i);
									if(s !== u) {
										var f = c + u - s
											, d = c + i;
										l.copy.call(a, a, f, c, d)
									}
									t[1 === u ? 160 + i : u <= 3 ? 215 + u : 219](n, i), n.offset += i
								}
							}(n ? function (e) {
								return e < 32 ? 1 : e <= 65535 ? 3 : 5
							} : function (e) {
								return e < 32 ? 1 : e <= 255 ? 2 : e <= 65535 ? 3 : 5
							})
							, symbol: w
							, undefined: w
						};

						function y(e, n) {
							if(null === n) return w(e, n);
							if(A(n)) return g(e, n);
							if(r(n)) return function (e, n) {
								var r = n.length;
								t[r < 16 ? 144 + r : r <= 65535 ? 220 : 221](e, r);
								for(var i = e.codec.encode, o = 0; o < r; o++) i(e, n[o])
							}(e, n);
							if(o.isUint64BE(n)) return function (e, n) {
								t[207](e, n.toArray())
							}(e, n);
							if(a.isInt64BE(n)) return function (e, n) {
								t[211](e, n.toArray())
							}(e, n);
							var i = e.codec.getExtPacker(n);
							if(i && (n = i(n)), n instanceof f) return function (e, n) {
								var r = n.buffer
									, i = r.length
									, o = p[i] || (i < 255 ? 199 : i <= 65535 ? 200 : 201);
								t[o](e, i), u[n.type](e), e.send(r)
							}(e, n);
							m(e, n)
						}

						function w(e, n) {
							t[192](e, n)
						}

						function v(e, n) {
							var r = n.length;
							t[r < 255 ? 196 : r <= 65535 ? 197 : 198](e, r), e.send(n)
						}

						function b(e, n) {
							var r = Object.keys(n)
								, i = r.length;
							t[i < 16 ? 128 + i : i <= 65535 ? 222 : 223](e, i);
							var o = e.codec.encode;
							r.forEach(function (t) {
								o(e, t), o(e, n[t])
							})
						}
					}
				}, function (e, t, n) {
					var r = n(4)
						, i = n(7)
						, o = i.Uint64BE
						, a = i.Int64BE
						, s = n(13)
						.uint8
						, l = n(0)
						, c = l.global
						, u = l.hasBuffer && "TYPED_ARRAY_SUPPORT" in c && !c.TYPED_ARRAY_SUPPORT
						, f = l.hasBuffer && c.prototype || {};

					function d() {
						var e = s.slice();
						return e[196] = h(196), e[197] = p(197), e[198] = A(198), e[199] = h(199), e[200] = p(200), e[201] = A(201), e[202] = g(202, 4, f.writeFloatBE || w, !0), e[203] = g(203, 8, f.writeDoubleBE || v, !0), e[204] = h(204), e[205] = p(205), e[206] = A(206), e[207] = g(207, 8, m), e[208] = h(208), e[209] = p(209), e[210] = A(210), e[211] = g(211, 8, y), e[217] = h(217), e[218] = p(218), e[219] = A(219), e[220] = p(220), e[221] = A(221), e[222] = p(222), e[223] = A(223), e
					}

					function h(e) {
						return function (t, n) {
							var r = t.reserve(2)
								, i = t.buffer;
							i[r++] = e, i[r] = n
						}
					}

					function p(e) {
						return function (t, n) {
							var r = t.reserve(3)
								, i = t.buffer;
							i[r++] = e, i[r++] = n >>> 8, i[r] = n
						}
					}

					function A(e) {
						return function (t, n) {
							var r = t.reserve(5)
								, i = t.buffer;
							i[r++] = e, i[r++] = n >>> 24, i[r++] = n >>> 16, i[r++] = n >>> 8, i[r] = n
						}
					}

					function g(e, t, n, r) {
						return function (i, o) {
							var a = i.reserve(t + 1);
							i.buffer[a++] = e, n.call(i.buffer, o, a, r)
						}
					}

					function m(e, t) {
						new o(this, t, e)
					}

					function y(e, t) {
						new a(this, t, e)
					}

					function w(e, t) {
						r.write(this, e, t, !1, 23, 4)
					}

					function v(e, t) {
						r.write(this, e, t, !1, 52, 8)
					}
					t.getWriteToken = function (e) {
						return e && e.uint8array ? function () {
							var e = d();
							return e[202] = g(202, 4, w), e[203] = g(203, 8, v), e
						}() : u || l.hasBuffer && e && e.safe ? function () {
							var e = s.slice();
							return e[196] = g(196, 1, c.prototype.writeUInt8), e[197] = g(197, 2, c.prototype.writeUInt16BE), e[198] = g(198, 4, c.prototype.writeUInt32BE), e[199] = g(199, 1, c.prototype.writeUInt8), e[200] = g(200, 2, c.prototype.writeUInt16BE), e[201] = g(201, 4, c.prototype.writeUInt32BE), e[202] = g(202, 4, c.prototype.writeFloatBE), e[203] = g(203, 8, c.prototype.writeDoubleBE), e[204] = g(204, 1, c.prototype.writeUInt8), e[205] = g(205, 2, c.prototype.writeUInt16BE), e[206] = g(206, 4, c.prototype.writeUInt32BE), e[207] = g(207, 8, m), e[208] = g(208, 1, c.prototype.writeInt8), e[209] = g(209, 2, c.prototype.writeInt16BE), e[210] = g(210, 4, c.prototype.writeInt32BE), e[211] = g(211, 8, y), e[217] = g(217, 1, c.prototype.writeUInt8), e[218] = g(218, 2, c.prototype.writeUInt16BE), e[219] = g(219, 4, c.prototype.writeUInt32BE), e[220] = g(220, 2, c.prototype.writeUInt16BE), e[221] = g(221, 4, c.prototype.writeUInt32BE), e[222] = g(222, 2, c.prototype.writeUInt16BE), e[223] = g(223, 4, c.prototype.writeUInt32BE), e
						}() : d()
					}
				}, function (e, t, n) {
					t.setExtUnpackers = function (e) {
						e.addExtUnpacker(14, [s, c(Error)]), e.addExtUnpacker(1, [s, c(EvalError)]), e.addExtUnpacker(2, [s, c(RangeError)]), e.addExtUnpacker(3, [s, c(ReferenceError)]), e.addExtUnpacker(4, [s, c(SyntaxError)]), e.addExtUnpacker(5, [s, c(TypeError)]), e.addExtUnpacker(6, [s, c(URIError)]), e.addExtUnpacker(10, [s, l]), e.addExtUnpacker(11, [s, u(Boolean)]), e.addExtUnpacker(12, [s, u(String)]), e.addExtUnpacker(13, [s, u(Date)]), e.addExtUnpacker(15, [s, u(Number)]), "undefined" != typeof Uint8Array && (e.addExtUnpacker(17, u(Int8Array)), e.addExtUnpacker(18, u(Uint8Array)), e.addExtUnpacker(19, [f, u(Int16Array)]), e.addExtUnpacker(20, [f, u(Uint16Array)]), e.addExtUnpacker(21, [f, u(Int32Array)]), e.addExtUnpacker(22, [f, u(Uint32Array)]), e.addExtUnpacker(23, [f, u(Float32Array)]), "undefined" != typeof Float64Array && e.addExtUnpacker(24, [f, u(Float64Array)]), "undefined" != typeof Uint8ClampedArray && e.addExtUnpacker(25, u(Uint8ClampedArray)), e.addExtUnpacker(26, f), e.addExtUnpacker(29, [f, u(DataView)])), i.hasBuffer && e.addExtUnpacker(27, u(o))
					};
					var r, i = n(0)
						, o = i.global
						, a = {
							name: 1
							, message: 1
							, stack: 1
							, columnNumber: 1
							, fileName: 1
							, lineNumber: 1
						};

					function s(e) {
						return r || (r = n(15)
							.decode), r(e)
					}

					function l(e) {
						return RegExp.apply(null, e)
					}

					function c(e) {
						return function (t) {
							var n = new e;
							for(var r in a) n[r] = t[r];
							return n
						}
					}

					function u(e) {
						return function (t) {
							return new e(t)
						}
					}

					function f(e) {
						return new Uint8Array(e)
							.buffer
					}
				}, function (e, t, n) {
					var r = n(17);

					function i(e) {
						var t, n = new Array(256);
						for(t = 0; t <= 127; t++) n[t] = o(t);
						for(t = 128; t <= 143; t++) n[t] = s(t - 128, e.map);
						for(t = 144; t <= 159; t++) n[t] = s(t - 144, e.array);
						for(t = 160; t <= 191; t++) n[t] = s(t - 160, e.str);
						for(n[192] = o(null), n[193] = null, n[194] = o(!1), n[195] = o(!0), n[196] = a(e.uint8, e.bin), n[197] = a(e.uint16, e.bin), n[198] = a(e.uint32, e.bin), n[199] = a(e.uint8, e.ext), n[200] = a(e.uint16, e.ext), n[201] = a(e.uint32, e.ext), n[202] = e.float32, n[203] = e.float64, n[204] = e.uint8, n[205] = e.uint16, n[206] = e.uint32, n[207] = e.uint64, n[208] = e.int8, n[209] = e.int16, n[210] = e.int32, n[211] = e.int64, n[212] = s(1, e.ext), n[213] = s(2, e.ext), n[214] = s(4, e.ext), n[215] = s(8, e.ext), n[216] = s(16, e.ext), n[217] = a(e.uint8, e.str), n[218] = a(e.uint16, e.str), n[219] = a(e.uint32, e.str), n[220] = a(e.uint16, e.array), n[221] = a(e.uint32, e.array), n[222] = a(e.uint16, e.map), n[223] = a(e.uint32, e.map), t = 224; t <= 255; t++) n[t] = o(t - 256);
						return n
					}

					function o(e) {
						return function () {
							return e
						}
					}

					function a(e, t) {
						return function (n) {
							var r = e(n);
							return t(n, r)
						}
					}

					function s(e, t) {
						return function (n) {
							return t(n, e)
						}
					}
					t.getReadToken = function (e) {
						var t = r.getReadFormat(e);
						return e && e.useraw ? function (e) {
							var t, n = i(e)
								.slice();
							for(n[217] = n[196], n[218] = n[197], n[219] = n[198], t = 160; t <= 191; t++) n[t] = s(t - 160, e.bin);
							return n
						}(t) : i(t)
					}
				}, function (e, t, n) {
					t.Encoder = o;
					var r = n(18)
						, i = n(10)
						.EncodeBuffer;

					function o(e) {
						if(!(this instanceof o)) return new o(e);
						i.call(this, e)
					}
					o.prototype = new i, r.mixin(o.prototype), o.prototype.encode = function (e) {
						this.write(e), this.emit("data", this.read())
					}, o.prototype.end = function (e) {
						arguments.length && this.encode(e), this.flush(), this.emit("end")
					}
				}, function (e, t, n) {
					t.Decoder = o;
					var r = n(18)
						, i = n(16)
						.DecodeBuffer;

					function o(e) {
						if(!(this instanceof o)) return new o(e);
						i.call(this, e)
					}
					o.prototype = new i, r.mixin(o.prototype), o.prototype.decode = function (e) {
						arguments.length && this.write(e), this.flush()
					}, o.prototype.push = function (e) {
						this.emit("data", e)
					}, o.prototype.end = function (e) {
						this.decode(e), this.emit("end")
					}
				}, function (e, t, n) {
					n(8), n(2), t.createCodec = n(1)
						.createCodec
				}, function (e, t, n) {
					n(8), n(2), t.codec = {
						preset: n(1)
							.preset
					}
				}, function (e, t) {
					var n, r, i = e.exports = {};

					function o() {
						throw new Error("setTimeout has not been defined")
					}

					function a() {
						throw new Error("clearTimeout has not been defined")
					}

					function s(e) {
						if(n === setTimeout) return setTimeout(e, 0);
						if((n === o || !n) && setTimeout) return n = setTimeout, setTimeout(e, 0);
						try {
							return n(e, 0)
						} catch (t) {
							try {
								return n.call(null, e, 0)
							} catch (t) {
								return n.call(this, e, 0)
							}
						}
					}! function () {
						try {
							n = "function" == typeof setTimeout ? setTimeout : o
						} catch (e) {
							n = o
						}
						try {
							r = "function" == typeof clearTimeout ? clearTimeout : a
						} catch (e) {
							r = a
						}
					}();
					var l, c = []
						, u = !1
						, f = -1;

					function d() {
						u && l && (u = !1, l.length ? c = l.concat(c) : f = -1, c.length && h())
					}

					function h() {
						if(!u) {
							var e = s(d);
							u = !0;
							for(var t = c.length; t;) {
								for(l = c, c = []; ++f < t;) l && l[f].run();
								f = -1, t = c.length
							}
							l = null, u = !1
								, function (e) {
									if(r === clearTimeout) return clearTimeout(e);
									if((r === a || !r) && clearTimeout) return r = clearTimeout, clearTimeout(e);
									try {
										r(e)
									} catch (t) {
										try {
											return r.call(null, e)
										} catch (t) {
											return r.call(this, e)
										}
									}
								}(e)
						}
					}

					function p(e, t) {
						this.fun = e, this.array = t
					}

					function A() {}
					i.nextTick = function (e) {
						var t = new Array(arguments.length - 1);
						if(arguments.length > 1)
							for(var n = 1; n < arguments.length; n++) t[n - 1] = arguments[n];
						c.push(new p(e, t)), 1 !== c.length || u || s(h)
					}, p.prototype.run = function () {
						this.fun.apply(null, this.array)
					}, i.title = "browser", i.browser = !0, i.env = {}, i.argv = [], i.version = "", i.versions = {}, i.on = A, i.addListener = A, i.once = A, i.off = A, i.removeListener = A, i.removeAllListeners = A, i.emit = A, i.prependListener = A, i.prependOnceListener = A, i.listeners = function (e) {
						return []
					}, i.binding = function (e) {
						throw new Error("process.binding is not supported")
					}, i.cwd = function () {
						return "/"
					}, i.chdir = function (e) {
						throw new Error("process.chdir is not supported")
					}, i.umask = function () {
						return 0
					}
				}, function (e, t) {
					var n = Math.abs
						, r = (Math.cos, Math.sin, Math.pow, Math.sqrt)
						, i = (n = Math.abs, Math.atan2)
						, o = Math.PI;
					e.exports.randInt = function (e, t) {
						return Math.floor(Math.random() * (t - e + 1)) + e
					}, e.exports.randFloat = function (e, t) {
						return Math.random() * (t - e + 1) + e
					}, e.exports.lerp = function (e, t, n) {
						return e + (t - e) * n
					}, e.exports.decel = function (e, t) {
						return e > 0 ? e = Math.max(0, e - t) : e < 0 && (e = Math.min(0, e + t)), e
					}, e.exports.getDistance = function (e, t, n, i) {
						return r((n -= e) * n + (i -= t) * i)
					}, e.exports.getDirection = function (e, t, n, r) {
						return i(t - r, e - n)
					}, e.exports.getAngleDist = function (e, t) {
						var r = n(t - e) % (2 * o);
						return r > o ? 2 * o - r : r
					}, e.exports.isNumber = function (e) {
						return "number" == typeof e && !isNaN(e) && isFinite(e)
					}, e.exports.isString = function (e) {
						return e && "string" == typeof e
					}, e.exports.kFormat = function (e) {
						return e > 999 ? (e / 1e3)
							.toFixed(1) + "k" : e
					}, e.exports.capitalizeFirst = function (e) {
						return e.charAt(0)
							.toUpperCase() + e.slice(1)
					}, e.exports.fixTo = function (e, t) {
						return parseFloat(e.toFixed(t))
					}, e.exports.sortByPoints = function (e, t) {
						return parseFloat(t.points) - parseFloat(e.points)
					}, e.exports.lineInRect = function (e, t, n, r, i, o, a, s) {
						var l = i
							, c = a;
						if(i > a && (l = a, c = i), c > n && (c = n), l < e && (l = e), l > c) return !1;
						var u = o
							, f = s
							, d = a - i;
						if(Math.abs(d) > 1e-7) {
							var h = (s - o) / d
								, p = o - h * i;
							u = h * l + p, f = h * c + p
						}
						if(u > f) {
							var A = f;
							f = u, u = A
						}
						return f > r && (f = r), u < t && (u = t), !(u > f)
					}, e.exports.containsPoint = function (e, t, n) {
						var r = e.getBoundingClientRect()
							, i = r.left + window.scrollX
							, o = r.top + window.scrollY
							, a = r.width
							, s = r.height;
						return t > i && t < i + a && n > o && n < o + s
					}, e.exports.mousifyTouchEvent = function (e) {
						var t = e.changedTouches[0];
						e.screenX = t.screenX, e.screenY = t.screenY, e.clientX = t.clientX, e.clientY = t.clientY, e.pageX = t.pageX, e.pageY = t.pageY
					}, e.exports.hookTouchEvents = function (t, n) {
						var r = !n
							, i = !1;

						function o(n) {
							e.exports.mousifyTouchEvent(n), window.setUsingTouch(!0), r && (n.preventDefault(), n.stopPropagation()), i && (t.onclick && t.onclick(n), t.onmouseout && t.onmouseout(n), i = !1)
						}
						t.addEventListener("touchstart", e.exports.checkTrusted(function (n) {
							e.exports.mousifyTouchEvent(n), window.setUsingTouch(!0), r && (n.preventDefault(), n.stopPropagation()), t.onmouseover && t.onmouseover(n), i = !0
						}), !1), t.addEventListener("touchmove", e.exports.checkTrusted(function (n) {
							e.exports.mousifyTouchEvent(n), window.setUsingTouch(!0), r && (n.preventDefault(), n.stopPropagation()), e.exports.containsPoint(t, n.pageX, n.pageY) ? i || (t.onmouseover && t.onmouseover(n), i = !0) : i && (t.onmouseout && t.onmouseout(n), i = !1)
						}), !1), t.addEventListener("touchend", e.exports.checkTrusted(o), !1), t.addEventListener("touchcancel", e.exports.checkTrusted(o), !1), t.addEventListener("touchleave", e.exports.checkTrusted(o), !1)
					}, e.exports.removeAllChildren = function (e) {
						for(; e.hasChildNodes();) e.removeChild(e.lastChild)
					}, e.exports.generateElement = function (t) {
						var n = document.createElement(t.tag || "div");

						function r(e, r) {
							t[e] && (n[r] = t[e])
						}
						for(var i in r("text", "textContent"), r("html", "innerHTML"), r("class", "className"), t) {
							switch(i) {
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
							n[i] = t[i]
						}
						if(n.onclick && (n.onclick = e.exports.checkTrusted(n.onclick)), n.onmouseover && (n.onmouseover = e.exports.checkTrusted(n.onmouseover)), n.onmouseout && (n.onmouseout = e.exports.checkTrusted(n.onmouseout)), t.style && (n.style.cssText = t.style), t.hookTouch && e.exports.hookTouchEvents(n), t.parent && t.parent.appendChild(n), t.children)
							for(var o = 0; o < t.children.length; o++) n.appendChild(t.children[o]);
						return n
					}, e.exports.eventIsTrusted = function (e) {
						return !e || "boolean" != typeof e.isTrusted || e.isTrusted
					}, e.exports.checkTrusted = function (t) {
						return function (n) {
							n && n instanceof Event && e.exports.eventIsTrusted(n) && t(n)
						}
					}, e.exports.randomString = function (e) {
						for(var t = "", n = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789", r = 0; r < e; r++) t += n.charAt(Math.floor(Math.random() * n.length));
						return t
					}, e.exports.countInArray = function (e, t) {
						for(var n = 0, r = 0; r < e.length; r++) e[r] === t && n++;
						return n
					}
				}, function (e, t) {
					e.exports.AnimText = function () {
						this.init = function (e, t, n, r, i, o, a) {
							this.x = e, this.y = t, this.color = a, this.scale = n, this.startScale = this.scale, this.maxScale = 1.5 * n, this.scaleSpeed = .7, this.speed = r, this.life = i, this.text = o
						}, this.update = function (e) {
							this.life && (this.life -= e, this.y -= this.speed * e, this.scale += this.scaleSpeed * e, this.scale >= this.maxScale ? (this.scale = this.maxScale, this.scaleSpeed *= -1) : this.scale <= this.startScale && (this.scale = this.startScale, this.scaleSpeed = 0), this.life <= 0 && (this.life = 0))
						}, this.render = function (e, t, n) {
							e.fillStyle = this.color, e.font = this.scale + "px Hammersmith One", e.fillText(this.text, this.x - t, this.y - n)
						}
					}, e.exports.TextManager = function () {
						this.texts = [], this.update = function (e, t, n, r) {
							t.textBaseline = "middle", t.textAlign = "center";
							for(var i = 0; i < this.texts.length; ++i) this.texts[i].life && (this.texts[i].update(e), this.texts[i].render(t, n, r))
						}, this.showText = function (t, n, r, i, o, a, s) {
							for(var l, c = 0; c < this.texts.length; ++c)
								if(!this.texts[c].life) {
									l = this.texts[c];
									break
								} l || (l = new e.exports.AnimText, this.texts.push(l)), l.init(t, n, r, i, o, a, s)
						}
					}
				}, function (e, t) {
					e.exports = function (e) {
						this.sid = e, this.init = function (e, t, n, r, i, o, a) {
							o = o || {}, this.sentTo = {}, this.gridLocations = [], this.active = !0, this.doUpdate = o.doUpdate, this.x = e, this.y = t, this.dir = n, this.xWiggle = 0, this.yWiggle = 0, this.scale = r, this.type = i, this.id = o.id, this.owner = a, this.name = o.name, this.isItem = null != this.id, this.group = o.group, this.health = o.health, this.layer = 2, null != this.group ? this.layer = this.group.layer : 0 == this.type ? this.layer = 3 : 2 == this.type ? this.layer = 0 : 4 == this.type && (this.layer = -1), this.colDiv = o.colDiv || 1, this.blocker = o.blocker, this.ignoreCollision = o.ignoreCollision, this.dontGather = o.dontGather, this.hideFromEnemy = o.hideFromEnemy, this.friction = o.friction, this.projDmg = o.projDmg, this.dmg = o.dmg, this.pDmg = o.pDmg, this.pps = o.pps, this.zIndex = o.zIndex || 0, this.turnSpeed = o.turnSpeed, this.req = o.req, this.trap = o.trap, this.healCol = o.healCol, this.teleport = o.teleport, this.boostSpeed = o.boostSpeed, this.projectile = o.projectile, this.shootRange = o.shootRange, this.shootRate = o.shootRate, this.shootCount = this.shootRate, this.spawnPoint = o.spawnPoint
						}, this.changeHealth = function (e, t) {
							return this.health += e, this.health <= 0
						}, this.getScale = function (e, t) {
							return e = e || 1, this.scale * (this.isItem || 2 == this.type || 3 == this.type || 4 == this.type ? 1 : .6 * e) * (t ? 1 : this.colDiv)
						}, this.visibleToPlayer = function (e) {
							return !this.hideFromEnemy || this.owner && (this.owner == e || this.owner.team && e.team == this.owner.team)
						}, this.update = function (e) {
							this.active && (this.xWiggle && (this.xWiggle *= Math.pow(.99, e)), this.yWiggle && (this.yWiggle *= Math.pow(.99, e)), this.turnSpeed && (this.dir += this.turnSpeed * e))
						}
					}
				}, function (e, t) {
					e.exports.groups = [{
						id: 0
						, name: "food"
						, layer: 0
					}, {
						id: 1
						, name: "walls"
						, place: !0
						, limit: 30
						, layer: 0
					}, {
						id: 2
						, name: "spikes"
						, place: !0
						, limit: 15
						, layer: 0
					}, {
						id: 3
						, name: "mill"
						, place: !0
						, limit: 7
						, layer: 1
					}, {
						id: 4
						, name: "mine"
						, place: !0
						, limit: 1
						, layer: 0
					}, {
						id: 5
						, name: "trap"
						, place: !0
						, limit: 6
						, layer: -1
					}, {
						id: 6
						, name: "booster"
						, place: !0
						, limit: 12
						, layer: -1
					}, {
						id: 7
						, name: "turret"
						, place: !0
						, limit: 2
						, layer: 1
					}, {
						id: 8
						, name: "watchtower"
						, place: !0
						, limit: 12
						, layer: 1
					}, {
						id: 9
						, name: "buff"
						, place: !0
						, limit: 4
						, layer: -1
					}, {
						id: 10
						, name: "spawn"
						, place: !0
						, limit: 1
						, layer: -1
					}, {
						id: 11
						, name: "sapling"
						, place: !0
						, limit: 2
						, layer: 0
					}, {
						id: 12
						, name: "blocker"
						, place: !0
						, limit: 3
						, layer: -1
					}, {
						id: 13
						, name: "teleporter"
						, place: !0
						, limit: 2
						, layer: -1
					}], t.projectiles = [{
						indx: 0
						, layer: 0
						, src: "arrow_1"
						, dmg: 25
						, speed: 1.6
						, scale: 103
						, range: 1e3
					}, {
						indx: 1
						, layer: 1
						, dmg: 25
						, scale: 20
					}, {
						indx: 0
						, layer: 0
						, src: "arrow_1"
						, dmg: 35
						, speed: 2.5
						, scale: 103
						, range: 1200
					}, {
						indx: 0
						, layer: 0
						, src: "arrow_1"
						, dmg: 30
						, speed: 2
						, scale: 103
						, range: 1200
					}, {
						indx: 1
						, layer: 1
						, dmg: 16
						, scale: 20
					}, {
						indx: 0
						, layer: 0
						, src: "bullet_1"
						, dmg: 50
						, speed: 3.6
						, scale: 160
						, range: 1400
					}], t.weapons = [{
						id: 0
						, type: 0
						, name: "tool hammer"
						, desc: "tool for gathering all resources"
						, src: "hammer_1"
						, length: 140
						, width: 140
						, xOff: -3
						, yOff: 18
						, dmg: 25
						, range: 65
						, gather: 1
						, speed: 300
					}, {
						id: 1
						, type: 0
						, age: 2
						, name: "hand axe"
						, desc: "gathers resources at a higher rate"
						, src: "axe_1"
						, length: 140
						, width: 140
						, xOff: 3
						, yOff: 24
						, dmg: 30
						, spdMult: 1
						, range: 70
						, gather: 2
						, speed: 400
					}, {
						id: 2
						, type: 0
						, age: 8
						, name: "great axe"
						, desc: "deal more damage and gather more resources"
						, src: "great_axe_1"
						, length: 140
						, width: 140
						, xOff: -8
						, yOff: 25
						, dmg: 35
						, spdMult: 1
						, range: 75
						, gather: 4
						, speed: 400
					}, {
						id: 3
						, type: 0
						, age: 2
						, name: "short sword"
						, desc: "increased attack power but slower move speed"
						, src: "sword_1"
						, iPad: 1.3
						, length: 130
						, width: 210
						, xOff: -8
						, yOff: 46
						, dmg: 35
						, spdMult: .85
						, range: 110
						, gather: 1
						, speed: 300
					}, {
						id: 4
						, type: 0
						, age: 8
						, name: "katana"
						, desc: "greater range and damage"
						, src: "samurai_1"
						, iPad: 1.3
						, length: 130
						, width: 210
						, xOff: -8
						, yOff: 59
						, dmg: 40
						, spdMult: .8
						, range: 118
						, gather: 1
						, speed: 300
					}, {
						id: 5
						, type: 0
						, age: 2
						, name: "polearm"
						, desc: "long range melee weapon"
						, src: "spear_1"
						, iPad: 1.3
						, length: 130
						, width: 210
						, xOff: -8
						, yOff: 53
						, dmg: 45
						, knock: .2
						, spdMult: .82
						, range: 142
						, gather: 1
						, speed: 700
					}, {
						id: 6
						, type: 0
						, age: 2
						, name: "bat"
						, desc: "fast long range melee weapon"
						, src: "bat_1"
						, iPad: 1.3
						, length: 110
						, width: 180
						, xOff: -8
						, yOff: 53
						, dmg: 20
						, knock: .7
						, range: 110
						, gather: 1
						, speed: 300
					}, {
						id: 7
						, type: 0
						, age: 2
						, name: "daggers"
						, desc: "really fast short range weapon"
						, src: "dagger_1"
						, iPad: .8
						, length: 110
						, width: 110
						, xOff: 18
						, yOff: 0
						, dmg: 20
						, knock: .1
						, range: 65
						, gather: 1
						, hitSlow: .1
						, spdMult: 1.13
						, speed: 100
					}, {
						id: 8
						, type: 0
						, age: 2
						, name: "stick"
						, desc: "great for gathering but very weak"
						, src: "stick_1"
						, length: 140
						, width: 140
						, xOff: 3
						, yOff: 24
						, dmg: 1
						, spdMult: 1
						, range: 70
						, gather: 7
						, speed: 400
					}, {
						id: 9
						, type: 1
						, age: 6
						, name: "hunting bow"
						, desc: "bow used for ranged combat and hunting"
						, src: "bow_1"
						, req: ["wood", 4]
						, length: 120
						, width: 120
						, xOff: -6
						, yOff: 0
						, projectile: 0
						, spdMult: .75
						, speed: 600
					}, {
						id: 10
						, type: 1
						, age: 6
						, name: "great hammer"
						, desc: "hammer used for destroying structures"
						, src: "great_hammer_1"
						, length: 140
						, width: 140
						, xOff: -9
						, yOff: 25
						, dmg: 10
						, spdMult: .88
						, range: 75
						, sDmg: 7.5
						, gather: 1
						, speed: 400
					}, {
						id: 11
						, type: 1
						, age: 6
						, name: "wooden shield"
						, desc: "blocks projectiles and reduces melee damage"
						, src: "shield_1"
						, length: 120
						, width: 120
						, shield: .2
						, xOff: 6
						, yOff: 0
						, spdMult: .7
					}, {
						id: 12
						, type: 1
						, age: 8
						, name: "crossbow"
						, desc: "deals more damage and has greater range"
						, src: "crossbow_1"
						, req: ["wood", 5]
						, aboveHand: !0
						, armS: .75
						, length: 120
						, width: 120
						, xOff: -4
						, yOff: 0
						, projectile: 2
						, spdMult: .7
						, speed: 700
					}, {
						id: 13
						, type: 1
						, age: 9
						, name: "repeater crossbow"
						, desc: "high firerate crossbow with reduced damage"
						, src: "crossbow_2"
						, req: ["wood", 10]
						, aboveHand: !0
						, armS: .75
						, length: 120
						, width: 120
						, xOff: -4
						, yOff: 0
						, projectile: 3
						, spdMult: .7
						, speed: 230
					}, {
						id: 14
						, type: 1
						, age: 6
						, name: "mc grabby"
						, desc: "steals resources from enemies"
						, src: "grab_1"
						, length: 130
						, width: 210
						, xOff: -8
						, yOff: 53
						, dmg: 0
						, steal: 250
						, knock: .2
						, spdMult: 1.05
						, range: 125
						, gather: 0
						, speed: 700
					}, {
						id: 15
						, type: 1
						, age: 9
						, name: "musket"
						, desc: "slow firerate but high damage and range"
						, src: "musket_1"
						, req: ["stone", 10]
						, aboveHand: !0
						, rec: .35
						, armS: .6
						, hndS: .3
						, hndD: 1.6
						, length: 205
						, width: 205
						, xOff: 25
						, yOff: 0
						, projectile: 5
						, hideProjectile: !0
						, spdMult: .6
						, speed: 1500
					}], e.exports.list = [{
						group: e.exports.groups[0]
						, name: "apple"
						, desc: "restores 20 health when consumed"
						, req: ["food", 10]
						, consume: function (e) {
							return e.changeHealth(20, e)
						}
						, scale: 22
						, holdOffset: 15
					}, {
						age: 3
						, group: e.exports.groups[0]
						, name: "cookie"
						, desc: "restores 40 health when consumed"
						, req: ["food", 15]
						, consume: function (e) {
							return e.changeHealth(40, e)
						}
						, scale: 27
						, holdOffset: 15
					}, {
						age: 7
						, group: e.exports.groups[0]
						, name: "cheese"
						, desc: "restores 30 health and another 50 over 5 seconds"
						, req: ["food", 25]
						, consume: function (e) {
							return !!(e.changeHealth(30, e) || e.health < 100) && (e.dmgOverTime.dmg = -10, e.dmgOverTime.doer = e, e.dmgOverTime.time = 5, !0)
						}
						, scale: 27
						, holdOffset: 15
					}, {
						group: e.exports.groups[1]
						, name: "wood wall"
						, desc: "provides protection for your village"
						, req: ["wood", 10]
						, projDmg: !0
						, health: 380
						, scale: 50
						, holdOffset: 20
						, placeOffset: -5
					}, {
						age: 3
						, group: e.exports.groups[1]
						, name: "stone wall"
						, desc: "provides improved protection for your village"
						, req: ["stone", 25]
						, health: 900
						, scale: 50
						, holdOffset: 20
						, placeOffset: -5
					}, {
						age: 7
						, group: e.exports.groups[1]
						, name: "castle wall"
						, desc: "provides powerful protection for your village"
						, req: ["stone", 35]
						, health: 1500
						, scale: 52
						, holdOffset: 20
						, placeOffset: -5
					}, {
						group: e.exports.groups[2]
						, name: "spikes"
						, desc: "damages enemies when they touch them"
						, req: ["wood", 20, "stone", 5]
						, health: 400
						, dmg: 20
						, scale: 49
						, spritePadding: -23
						, holdOffset: 8
						, placeOffset: -5
					}, {
						age: 5
						, group: e.exports.groups[2]
						, name: "greater spikes"
						, desc: "damages enemies when they touch them"
						, req: ["wood", 30, "stone", 10]
						, health: 500
						, dmg: 35
						, scale: 52
						, spritePadding: -23
						, holdOffset: 8
						, placeOffset: -5
					}, {
						age: 9
						, group: e.exports.groups[2]
						, name: "poison spikes"
						, desc: "poisons enemies when they touch them"
						, req: ["wood", 35, "stone", 15]
						, health: 600
						, dmg: 30
						, pDmg: 5
						, scale: 52
						, spritePadding: -23
						, holdOffset: 8
						, placeOffset: -5
					}, {
						age: 9
						, group: e.exports.groups[2]
						, name: "spinning spikes"
						, desc: "damages enemies when they touch them"
						, req: ["wood", 30, "stone", 20]
						, health: 500
						, dmg: 45
						, turnSpeed: .003
						, scale: 52
						, spritePadding: -23
						, holdOffset: 8
						, placeOffset: -5
					}, {
						group: e.exports.groups[3]
						, name: "windmill"
						, desc: "generates gold over time"
						, req: ["wood", 50, "stone", 10]
						, health: 400
						, pps: 1
						, turnSpeed: 0
						, spritePadding: 25
						, iconLineMult: 12
						, scale: 45
						, holdOffset: 20
						, placeOffset: 5
					}, {
						age: 5
						, group: e.exports.groups[3]
						, name: "faster windmill"
						, desc: "generates more gold over time"
						, req: ["wood", 60, "stone", 20]
						, health: 500
						, pps: 1.5
						, turnSpeed: 0
						, spritePadding: 25
						, iconLineMult: 12
						, scale: 47
						, holdOffset: 20
						, placeOffset: 5
					}, {
						age: 8
						, group: e.exports.groups[3]
						, name: "power mill"
						, desc: "generates more gold over time"
						, req: ["wood", 100, "stone", 50]
						, health: 800
						, pps: 2
						, turnSpeed: 0
						, spritePadding: 25
						, iconLineMult: 12
						, scale: 47
						, holdOffset: 20
						, placeOffset: 5
					}, {
						age: 5
						, group: e.exports.groups[4]
						, type: 2
						, name: "mine"
						, desc: "allows you to mine stone"
						, req: ["wood", 20, "stone", 100]
						, iconLineMult: 12
						, scale: 65
						, holdOffset: 20
						, placeOffset: 0
					}, {
						age: 5
						, group: e.exports.groups[11]
						, type: 0
						, name: "sapling"
						, desc: "allows you to farm wood"
						, req: ["wood", 150]
						, iconLineMult: 12
						, colDiv: .5
						, scale: 110
						, holdOffset: 50
						, placeOffset: -15
					}, {
						age: 4
						, group: e.exports.groups[5]
						, name: "pit trap"
						, desc: "pit that traps enemies if they walk over it"
						, req: ["wood", 30, "stone", 30]
						, trap: !0
						, ignoreCollision: !0
						, hideFromEnemy: !0
						, health: 500
						, colDiv: .2
						, scale: 50
						, holdOffset: 20
						, placeOffset: -5
					}, {
						age: 4
						, group: e.exports.groups[6]
						, name: "boost pad"
						, desc: "provides boost when stepped on"
						, req: ["stone", 20, "wood", 5]
						, ignoreCollision: !0
						, boostSpeed: 1.5
						, health: 150
						, colDiv: .7
						, scale: 45
						, holdOffset: 20
						, placeOffset: -5
					}, {
						age: 7
						, group: e.exports.groups[7]
						, doUpdate: !0
						, name: "turret"
						, desc: "defensive structure that shoots at enemies"
						, req: ["wood", 200, "stone", 150]
						, health: 800
						, projectile: 1
						, shootRange: 700
						, shootRate: 2200
						, scale: 43
						, holdOffset: 20
						, placeOffset: -5
					}, {
						age: 7
						, group: e.exports.groups[8]
						, name: "platform"
						, desc: "platform to shoot over walls and cross over water"
						, req: ["wood", 20]
						, ignoreCollision: !0
						, zIndex: 1
						, health: 300
						, scale: 43
						, holdOffset: 20
						, placeOffset: -5
					}, {
						age: 7
						, group: e.exports.groups[9]
						, name: "healing pad"
						, desc: "standing on it will slowly heal you"
						, req: ["wood", 30, "food", 10]
						, ignoreCollision: !0
						, healCol: 15
						, health: 400
						, colDiv: .7
						, scale: 45
						, holdOffset: 20
						, placeOffset: -5
					}, {
						age: 9
						, group: e.exports.groups[10]
						, name: "spawn pad"
						, desc: "you will spawn here when you die but it will dissapear"
						, req: ["wood", 100, "stone", 100]
						, health: 400
						, ignoreCollision: !0
						, spawnPoint: !0
						, scale: 45
						, holdOffset: 20
						, placeOffset: -5
					}, {
						age: 7
						, group: e.exports.groups[12]
						, name: "blocker"
						, desc: "blocks building in radius"
						, req: ["wood", 30, "stone", 25]
						, ignoreCollision: !0
						, blocker: 300
						, health: 400
						, colDiv: .7
						, scale: 45
						, holdOffset: 20
						, placeOffset: -5
					}, {
						age: 7
						, group: e.exports.groups[13]
						, name: "teleporter"
						, desc: "teleports you to a random point on the map"
						, req: ["wood", 60, "stone", 60]
						, ignoreCollision: !0
						, teleport: !0
						, health: 200
						, colDiv: .7
						, scale: 45
						, holdOffset: 20
						, placeOffset: -5
					}];
					for(var n = 0; n < e.exports.list.length; ++n) e.exports.list[n].id = n, e.exports.list[n].pre && (e.exports.list[n].pre = n - e.exports.list[n].pre)
				}, function (e, t) {
					e.exports = {}
				}, function (e, t) {
					var n = Math.floor
						, r = Math.abs
						, i = Math.cos
						, o = Math.sin
						, a = (Math.pow, Math.sqrt);
					e.exports = function (e, t, s, l, c, u) {
						var f, d;
						this.objects = t, this.grids = {}, this.updateObjects = [];
						var h = l.mapScale / l.colGrid;
						this.setObjectGrids = function (e) {
							for(var t = Math.min(l.mapScale, Math.max(0, e.x)), n = Math.min(l.mapScale, Math.max(0, e.y)), r = 0; r < l.colGrid; ++r) {
								f = r * h;
								for(var i = 0; i < l.colGrid; ++i) d = i * h, t + e.scale >= f && t - e.scale <= f + h && n + e.scale >= d && n - e.scale <= d + h && (this.grids[r + "_" + i] || (this.grids[r + "_" + i] = []), this.grids[r + "_" + i].push(e), e.gridLocations.push(r + "_" + i))
							}
						}, this.removeObjGrid = function (e) {
							for(var t, n = 0; n < e.gridLocations.length; ++n)(t = this.grids[e.gridLocations[n]].indexOf(e)) >= 0 && this.grids[e.gridLocations[n]].splice(t, 1)
						}, this.disableObj = function (e) {
							if(e.active = !1, u) {
								e.owner && e.pps && (e.owner.pps -= e.pps), this.removeObjGrid(e);
								var t = this.updateObjects.indexOf(e);
								t >= 0 && this.updateObjects.splice(t, 1)
							}
						}, this.hitObj = function (e, t) {
							for(var n = 0; n < c.length; ++n) c[n].active && (e.sentTo[c[n].id] && (e.active ? c[n].canSee(e) && u.send(c[n].id, "8", s.fixTo(t, 1), e.sid) : u.send(c[n].id, "12", e.sid)), e.active || e.owner != c[n] || c[n].changeItemCount(e.group.id, -1))
						};
						var p, A, g = [];
						this.getGridArrays = function (e, t, r) {
							f = n(e / h), d = n(t / h), g.length = 0;
							try {
								this.grids[f + "_" + d] && g.push(this.grids[f + "_" + d]), e + r >= (f + 1) * h && ((p = this.grids[f + 1 + "_" + d]) && g.push(p), d && t - r <= d * h ? (p = this.grids[f + 1 + "_" + (d - 1)]) && g.push(p) : t + r >= (d + 1) * h && (p = this.grids[f + 1 + "_" + (d + 1)]) && g.push(p)), f && e - r <= f * h && ((p = this.grids[f - 1 + "_" + d]) && g.push(p), d && t - r <= d * h ? (p = this.grids[f - 1 + "_" + (d - 1)]) && g.push(p) : t + r >= (d + 1) * h && (p = this.grids[f - 1 + "_" + (d + 1)]) && g.push(p)), t + r >= (d + 1) * h && (p = this.grids[f + "_" + (d + 1)]) && g.push(p), d && t - r <= d * h && (p = this.grids[f + "_" + (d - 1)]) && g.push(p)
							} catch (e) {}
							return g
						}, this.add = function (n, r, i, o, a, s, l, c, f) {
							A = null;
							for(var d = 0; d < t.length; ++d)
								if(t[d].sid == n) {
									A = t[d];
									break
								} if(!A)
								for(d = 0; d < t.length; ++d)
									if(!t[d].active) {
										A = t[d];
										break
									} A || (A = new e(n), t.push(A)), c && (A.sid = n), A.init(r, i, o, a, s, l, f), u && (this.setObjectGrids(A), A.doUpdate && this.updateObjects.push(A))
						}, this.disableBySid = function (e) {
							for(var n = 0; n < t.length; ++n)
								if(t[n].sid == e) {
									this.disableObj(t[n]);
									break
								}
						}, this.removeAllItems = function (e, n) {
							for(var r = 0; r < t.length; ++r) t[r].active && t[r].owner && t[r].owner.sid == e && this.disableObj(t[r]);
							n && n.broadcast("13", e)
						}, this.fetchSpawnObj = function (e) {
							for(var n = null, r = 0; r < t.length; ++r)
								if((A = t[r])
									.active && A.owner && A.owner.sid == e && A.spawnPoint) {
									n = [A.x, A.y], this.disableObj(A), u.broadcast("12", A.sid), A.owner && A.owner.changeItemCount(A.group.id, -1);
									break
								} return n
						}, this.checkItemLocation = function (e, n, r, i, o, a, c) {
							for(var u = 0; u < t.length; ++u) {
								var f = t[u].blocker ? t[u].blocker : t[u].getScale(i, t[u].isItem);
								if(t[u].active && s.getDistance(e, n, t[u].x, t[u].y) < r + f) return !1
							}
							return !(!a && 18 != o && n >= l.mapScale / 2 - l.riverWidth / 2 && n <= l.mapScale / 2 + l.riverWidth / 2)
						}, this.addProjectile = function (e, t, n, r, i) {
							for(var o, a = items.projectiles[i], l = 0; l < projectiles.length; ++l)
								if(!projectiles[l].active) {
									o = projectiles[l];
									break
								} o || (o = new Projectile(c, s), projectiles.push(o)), o.init(i, e, t, n, a.speed, r, a.scale)
						}, this.checkCollision = function (e, t, n) {
							n = n || 1;
							var c = e.x - t.x
								, u = e.y - t.y
								, f = e.scale + t.scale;
							if(r(c) <= f || r(u) <= f) {
								f = e.scale + (t.getScale ? t.getScale() : t.scale);
								var d = a(c * c + u * u) - f;
								if(d <= 0) {
									if(t.ignoreCollision) !t.trap || e.noTrap || t.owner == e || t.owner && t.owner.team && t.owner.team == e.team ? t.boostSpeed ? (e.xVel += n * t.boostSpeed * (t.weightM || 1) * i(t.dir), e.yVel += n * t.boostSpeed * (t.weightM || 1) * o(t.dir)) : t.healCol ? e.healCol = t.healCol : t.teleport && (e.x = s.randInt(0, l.mapScale), e.y = s.randInt(0, l.mapScale)) : (e.lockMove = !0, t.hideFromEnemy = !1);
									else {
										var h = s.getDirection(e.x, e.y, t.x, t.y);
										if(s.getDistance(e.x, e.y, t.x, t.y), t.isPlayer ? (d = -1 * d / 2, e.x += d * i(h), e.y += d * o(h), t.x -= d * i(h), t.y -= d * o(h)) : (e.x = t.x + f * i(h), e.y = t.y + f * o(h), e.xVel *= .75, e.yVel *= .75), t.dmg && t.owner != e && (!t.owner || !t.owner.team || t.owner.team != e.team)) {
											e.changeHealth(-t.dmg, t.owner, t);
											var p = 1.5 * (t.weightM || 1);
											e.xVel += p * i(h), e.yVel += p * o(h), !t.pDmg || e.skin && e.skin.poisonRes || (e.dmgOverTime.dmg = t.pDmg, e.dmgOverTime.time = 5, e.dmgOverTime.doer = t.owner), e.colDmg && t.health && (t.changeHealth(-e.colDmg) && this.disableObj(t), this.hitObj(t, s.getDirection(e.x, e.y, t.x, t.y)))
										}
									}
									return t.zIndex > e.zIndex && (e.zIndex = t.zIndex), !0
								}
							}
							return !1
						}
					}
				}, function (e, t, n) {
					var r = new(n(49));
					r.addWords("xxxxx");
					var i = Math.abs
						, o = Math.cos
						, a = Math.sin
						, s = Math.pow
						, l = Math.sqrt;
					e.exports = function (e, t, n, c, u, f, d, h, p, A, g, m, y, w) {
						this.id = e, this.sid = t, this.tmpScore = 0, this.team = null, this.skinIndex = 0, this.tailIndex = 0, this.hitTime = 0, this.tails = {};
						for(var v = 0; v < g.length; ++v) g[v].price <= 0 && (this.tails[g[v].id] = 1);
						for(this.skins = {}, v = 0; v < A.length; ++v) A[v].price <= 0 && (this.skins[A[v].id] = 1);
						this.points = 0, this.dt = 0, this.hidden = !1, this.itemCounts = {}, this.isPlayer = !0, this.pps = 0, this.moveDir = void 0, this.skinRot = 0, this.lastPing = 0, this.iconIndex = 0, this.skinColor = 0, this.spawn = function (e) {
							this.active = !0, this.alive = !0, this.lockMove = !1, this.lockDir = !1, this.minimapCounter = 0, this.chatCountdown = 0, this.shameCount = 0, this.shameTimer = 0, this.sentTo = {}, this.gathering = 0, this.autoGather = 0, this.animTime = 0, this.animSpeed = 0, this.mouseState = 0, this.buildIndex = -1, this.weaponIndex = 0, this.dmgOverTime = {}, this.noMovTimer = 0, this.maxXP = 300, this.XP = 0, this.age = 1, this.kills = 0, this.upgrAge = 2, this.upgradePoints = 0, this.x = 0, this.y = 0, this.zIndex = 0, this.xVel = 0, this.yVel = 0, this.slowMult = 1, this.dir = 0, this.dirPlus = 0, this.targetDir = 0, this.targetAngle = 0, this.maxHealth = 100, this.health = this.maxHealth, this.scale = n.playerScale, this.speed = n.playerSpeed, this.resetMoveDir(), this.resetResources(e), this.items = [0, 3, 6, 10], this.weapons = [0], this.shootCount = 0, this.weaponXP = [], this.reloads = {}
						}, this.resetMoveDir = function () {
							this.moveDir = void 0
						}, this.resetResources = function (e) {
							for(var t = 0; t < n.resourceTypes.length; ++t) this[n.resourceTypes[t]] = e ? 100 : 0
						}, this.addItem = function (e) {
							var t = p.list[e];
							if(t) {
								for(var n = 0; n < this.items.length; ++n)
									if(p.list[this.items[n]].group == t.group) return this.buildIndex == this.items[n] && (this.buildIndex = e), this.items[n] = e, !0;
								return this.items.push(e), !0
							}
							return !1
						}, this.setUserData = function (e) {
							if(e) {
								this.name = "unknown";
								var t = e.name + ""
									, i = !1
									, o = (t = (t = (t = (t = t.slice(0, n.maxNameLength))
												.replace(/[^\w:\(\)\/? -]+/gim, " "))
											.replace(/[^\x00-\x7F]/g, " "))
										.trim())
									.toLowerCase()
									.replace(/\s/g, "")
									.replace(/1/g, "i")
									.replace(/0/g, "o")
									.replace(/5/g, "s");
								for(var a of r.list)
									if(-1 != o.indexOf(a)) {
										i = !0;
										break
									} t.length > 0 && !i && (this.name = t), this.skinColor = 0, n.skinColors[e.skin] && (this.skinColor = e.skin)
							}
						}, this.getData = function () {
							return [this.id, this.sid, this.name, c.fixTo(this.x, 2), c.fixTo(this.y, 2), c.fixTo(this.dir, 3), this.health, this.maxHealth, this.scale, this.skinColor]
						}, this.setData = function (e) {
							this.id = e[0], this.sid = e[1], this.name = e[2], this.x = e[3], this.y = e[4], this.dir = e[5], this.health = e[6], this.maxHealth = e[7], this.scale = e[8], this.skinColor = e[9]
						};
						var b = 0;
						this.update = function (e) {
							if(this.alive) {
								if(this.shameTimer > 0 && (this.shameTimer -= e, this.shameTimer <= 0 && (this.shameTimer = 0, this.shameCount = 0)), (b -= e) <= 0) {
									var t = (this.skin && this.skin.healthRegen ? this.skin.healthRegen : 0) + (this.tail && this.tail.healthRegen ? this.tail.healthRegen : 0);
									t && this.changeHealth(t, this), this.dmgOverTime.dmg && (this.changeHealth(-this.dmgOverTime.dmg, this.dmgOverTime.doer), this.dmgOverTime.time -= 1, this.dmgOverTime.time <= 0 && (this.dmgOverTime.dmg = 0)), this.healCol && this.changeHealth(this.healCol, this), b = 1e3
								}
								if(this.alive) {
									if(this.slowMult < 1 && (this.slowMult += 8e-4 * e, this.slowMult > 1 && (this.slowMult = 1)), this.noMovTimer += e, (this.xVel || this.yVel) && (this.noMovTimer = 0), this.lockMove) this.xVel = 0, this.yVel = 0;
									else {
										var r = (this.buildIndex >= 0 ? .5 : 1) * (p.weapons[this.weaponIndex].spdMult || 1) * (this.skin && this.skin.spdMult || 1) * (this.tail && this.tail.spdMult || 1) * (this.y <= n.snowBiomeTop ? this.skin && this.skin.coldM ? 1 : n.snowSpeed : 1) * this.slowMult;
										!this.zIndex && this.y >= n.mapScale / 2 - n.riverWidth / 2 && this.y <= n.mapScale / 2 + n.riverWidth / 2 && (this.skin && this.skin.watrImm ? (r *= .75, this.xVel += .4 * n.waterCurrent * e) : (r *= .33, this.xVel += n.waterCurrent * e));
										var i = null != this.moveDir ? o(this.moveDir) : 0
											, h = null != this.moveDir ? a(this.moveDir) : 0
											, A = l(i * i + h * h);
										0 != A && (i /= A, h /= A), i && (this.xVel += i * this.speed * r * e), h && (this.yVel += h * this.speed * r * e)
									}
									var g;
									this.zIndex = 0, this.lockMove = !1, this.healCol = 0;
									for(var m = c.getDistance(0, 0, this.xVel * e, this.yVel * e), y = Math.min(4, Math.max(1, Math.round(m / 40))), w = 1 / y, v = 0; v < y; ++v) {
										this.xVel && (this.x += this.xVel * e * w), this.yVel && (this.y += this.yVel * e * w), g = f.getGridArrays(this.x, this.y, this.scale);
										for(var x = 0; x < g.length; ++x)
											for(var B = 0; B < g[x].length; ++B) g[x][B].active && f.checkCollision(this, g[x][B], w)
									}
									for(v = (k = d.indexOf(this)) + 1; v < d.length; ++v) d[v] != this && d[v].alive && f.checkCollision(this, d[v]);
									if(this.xVel && (this.xVel *= s(n.playerDecel, e), this.xVel <= .01 && this.xVel >= -.01 && (this.xVel = 0)), this.yVel && (this.yVel *= s(n.playerDecel, e), this.yVel <= .01 && this.yVel >= -.01 && (this.yVel = 0)), this.x - this.scale < 0 ? this.x = this.scale : this.x + this.scale > n.mapScale && (this.x = n.mapScale - this.scale), this.y - this.scale < 0 ? this.y = this.scale : this.y + this.scale > n.mapScale && (this.y = n.mapScale - this.scale), this.buildIndex < 0)
										if(this.reloads[this.weaponIndex] > 0) this.reloads[this.weaponIndex] -= e, this.gathering = this.mouseState;
										else if(this.gathering || this.autoGather) {
										var E = !0;
										if(null != p.weapons[this.weaponIndex].gather) this.gather(d);
										else if(null != p.weapons[this.weaponIndex].projectile && this.hasRes(p.weapons[this.weaponIndex], this.skin ? this.skin.projCost : 0)) {
											this.useRes(p.weapons[this.weaponIndex], this.skin ? this.skin.projCost : 0), this.noMovTimer = 0;
											var k = p.weapons[this.weaponIndex].projectile
												, C = 2 * this.scale
												, I = this.skin && this.skin.aMlt ? this.skin.aMlt : 1;
											p.weapons[this.weaponIndex].rec && (this.xVel -= p.weapons[this.weaponIndex].rec * o(this.dir), this.yVel -= p.weapons[this.weaponIndex].rec * a(this.dir)), u.addProjectile(this.x + C * o(this.dir), this.y + C * a(this.dir), this.dir, p.projectiles[k].range * I, p.projectiles[k].speed * I, k, this, null, this.zIndex)
										} else E = !1;
										this.gathering = this.mouseState, E && (this.reloads[this.weaponIndex] = p.weapons[this.weaponIndex].speed * (this.skin && this.skin.atkSpd || 1))
									}
								}
							}
						}, this.addWeaponXP = function (e) {
							this.weaponXP[this.weaponIndex] || (this.weaponXP[this.weaponIndex] = 0), this.weaponXP[this.weaponIndex] += e
						}, this.earnXP = function (e) {
							this.age < n.maxAge && (this.XP += e, this.XP >= this.maxXP ? (this.age < n.maxAge ? (this.age++, this.XP = 0, this.maxXP *= 1.2) : this.XP = this.maxXP, this.upgradePoints++, m.send(this.id, "16", this.upgradePoints, this.upgrAge), m.send(this.id, "15", this.XP, c.fixTo(this.maxXP, 1), this.age)) : m.send(this.id, "15", this.XP))
						}, this.changeHealth = function (e, t) {
							if(e > 0 && this.health >= this.maxHealth) return !1;
							e < 0 && this.skin && (e *= this.skin.dmgMult || 1), e < 0 && this.tail && (e *= this.tail.dmgMult || 1), e < 0 && (this.hitTime = Date.now()), this.health += e, this.health > this.maxHealth && (e -= this.health - this.maxHealth, this.health = this.maxHealth), this.health <= 0 && this.kill(t);
							for(var n = 0; n < d.length; ++n) this.sentTo[d[n].id] && m.send(d[n].id, "h", this.sid, Math.round(this.health));
							return !t || !t.canSee(this) || t == this && e < 0 || m.send(t.id, "t", Math.round(this.x), Math.round(this.y), Math.round(-e), 1), !0
						}, this.kill = function (e) {
							e && e.alive && (e.kills++, e.skin && e.skin.goldSteal ? y(e, Math.round(this.points / 2)) : y(e, Math.round(100 * this.age * (e.skin && e.skin.kScrM ? e.skin.kScrM : 1))), m.send(e.id, "9", "kills", e.kills, 1)), this.alive = !1, m.send(this.id, "11"), w()
						}, this.addResource = function (e, t, r) {
							!r && t > 0 && this.addWeaponXP(t), 3 == e ? y(this, t, !0) : (this[n.resourceTypes[e]] += t, m.send(this.id, "9", n.resourceTypes[e], this[n.resourceTypes[e]], 1))
						}, this.changeItemCount = function (e, t) {
							this.itemCounts[e] = this.itemCounts[e] || 0, this.itemCounts[e] += t, m.send(this.id, "14", e, this.itemCounts[e])
						}, this.buildItem = function (e) {
							var t = this.scale + e.scale + (e.placeOffset || 0)
								, n = this.x + t * o(this.dir)
								, r = this.y + t * a(this.dir);
							if(this.canBuild(e) && !(e.consume && this.skin && this.skin.noEat) && (e.consume || f.checkItemLocation(n, r, e.scale, .6, e.id, !1, this))) {
								var i = !1;
								if(e.consume) {
									if(this.hitTime) {
										var s = Date.now() - this.hitTime;
										this.hitTime = 0, s <= 120 ? (this.shameCount++, this.shameCount >= 8 && (this.shameTimer = 3e4, this.shameCount = 0)) : (this.shameCount -= 2, this.shameCount <= 0 && (this.shameCount = 0))
									}
									this.shameTimer <= 0 && (i = e.consume(this))
								} else i = !0, e.group.limit && this.changeItemCount(e.group.id, 1), e.pps && (this.pps += e.pps), f.add(f.objects.length, n, r, this.dir, e.scale, e.type, e, !1, this);
								i && (this.useRes(e), this.buildIndex = -1)
							}
						}, this.hasRes = function (e, t) {
							for(var n = 0; n < e.req.length;) {
								if(this[e.req[n]] < Math.round(e.req[n + 1] * (t || 1))) return !1;
								n += 2
							}
							return !0
						}, this.useRes = function (e, t) {
							if(!n.inSandbox)
								for(var r = 0; r < e.req.length;) this.addResource(n.resourceTypes.indexOf(e.req[r]), -Math.round(e.req[r + 1] * (t || 1))), r += 2
						}, this.canBuild = function (e) {
							return !!n.inSandbox || !(e.group.limit && this.itemCounts[e.group.id] >= e.group.limit) && this.hasRes(e)
						}, this.gather = function () {
							this.noMovTimer = 0, this.slowMult -= p.weapons[this.weaponIndex].hitSlow || .3, this.slowMult < 0 && (this.slowMult = 0);
							for(var e, t, r, i = n.fetchVariant(this), s = i.poison, l = i.val, u = {}, A = f.getGridArrays(this.x, this.y, p.weapons[this.weaponIndex].range), g = 0; g < A.length; ++g)
								for(var m = 0; m < A[g].length; ++m)
									if((t = A[g][m])
										.active && !t.dontGather && !u[t.sid] && t.visibleToPlayer(this) && c.getDistance(this.x, this.y, t.x, t.y) - t.scale <= p.weapons[this.weaponIndex].range && (e = c.getDirection(t.x, t.y, this.x, this.y), c.getAngleDist(e, this.dir) <= n.gatherAngle)) {
										if(u[t.sid] = 1, t.health) {
											if(t.changeHealth(-p.weapons[this.weaponIndex].dmg * l * (p.weapons[this.weaponIndex].sDmg || 1) * (this.skin && this.skin.bDmg ? this.skin.bDmg : 1), this)) {
												for(var y = 0; y < t.req.length;) this.addResource(n.resourceTypes.indexOf(t.req[y]), t.req[y + 1]), y += 2;
												f.disableObj(t)
											}
										} else {
											this.earnXP(4 * p.weapons[this.weaponIndex].gather);
											var w = p.weapons[this.weaponIndex].gather + (3 == t.type ? 4 : 0);
											this.skin && this.skin.extraGold && this.addResource(3, 1), this.addResource(t.type, w)
										}
										r = !0, f.hitObj(t, e)
									} for(m = 0; m < d.length + h.length; ++m)
								if((t = d[m] || h[m - d.length]) != this && t.alive && (!t.team || t.team != this.team) && c.getDistance(this.x, this.y, t.x, t.y) - 1.8 * t.scale <= p.weapons[this.weaponIndex].range && (e = c.getDirection(t.x, t.y, this.x, this.y), c.getAngleDist(e, this.dir) <= n.gatherAngle)) {
									var v = p.weapons[this.weaponIndex].steal;
									v && t.addResource && (v = Math.min(t.points || 0, v), this.addResource(3, v), t.addResource(3, -v));
									var b = l;
									null != t.weaponIndex && p.weapons[t.weaponIndex].shield && c.getAngleDist(e + Math.PI, t.dir) <= n.shieldAngle && (b = p.weapons[t.weaponIndex].shield);
									var x = p.weapons[this.weaponIndex].dmg * (this.skin && this.skin.dmgMultO ? this.skin.dmgMultO : 1) * (this.tail && this.tail.dmgMultO ? this.tail.dmgMultO : 1)
										, B = .3 * (t.weightM || 1) + (p.weapons[this.weaponIndex].knock || 0);
									t.xVel += B * o(e), t.yVel += B * a(e), this.skin && this.skin.healD && this.changeHealth(x * b * this.skin.healD, this), this.tail && this.tail.healD && this.changeHealth(x * b * this.tail.healD, this), t.skin && t.skin.dmg && 1 == b && this.changeHealth(-x * t.skin.dmg, t), t.tail && t.tail.dmg && 1 == b && this.changeHealth(-x * t.tail.dmg, t), !(t.dmgOverTime && this.skin && this.skin.poisonDmg) || t.skin && t.skin.poisonRes || (t.dmgOverTime.dmg = this.skin.poisonDmg, t.dmgOverTime.time = this.skin.poisonTime || 1, t.dmgOverTime.doer = this), !t.dmgOverTime || !s || t.skin && t.skin.poisonRes || (t.dmgOverTime.dmg = 5, t.dmgOverTime.time = 5, t.dmgOverTime.doer = this), t.skin && t.skin.dmgK && (this.xVel -= t.skin.dmgK * o(e), this.yVel -= t.skin.dmgK * a(e)), t.changeHealth(-x * b, this, this)
								} this.sendAnimation(r ? 1 : 0)
						}, this.sendAnimation = function (e) {
							for(var t = 0; t < d.length; ++t) this.sentTo[d[t].id] && this.canSee(d[t]) && m.send(d[t].id, "7", this.sid, e ? 1 : 0, this.weaponIndex)
						};
						var x = 0
							, B = 0;
						this.animate = function (e) {
							this.animTime > 0 && (this.animTime -= e, this.animTime <= 0 ? (this.animTime = 0, this.dirPlus = 0, x = 0, B = 0) : 0 == B ? (x += e / (this.animSpeed * n.hitReturnRatio), this.dirPlus = c.lerp(0, this.targetAngle, Math.min(1, x)), x >= 1 && (x = 1, B = 1)) : (x -= e / (this.animSpeed * (1 - n.hitReturnRatio)), this.dirPlus = c.lerp(0, this.targetAngle, Math.max(0, x))))
						}, this.startAnim = function (e, t) {
							this.animTime = this.animSpeed = p.weapons[t].speed, this.targetAngle = e ? -n.hitAngle : -Math.PI, x = 0, B = 0
						}, this.canSee = function (e) {
							if(!e) return !1;
							if(e.skin && e.skin.invisTimer && e.noMovTimer >= e.skin.invisTimer) return !1;
							var t = i(e.x - this.x) - e.scale
								, r = i(e.y - this.y) - e.scale;
							return t <= n.maxScreenWidth / 2 * 1.3 && r <= n.maxScreenHeight / 2 * 1.3
						}
					}
				}, function (e, t, n) {
					const r = n(50)
						.words
						, i = n(51)
						.array;
					e.exports = class {
						constructor(e = {}) {
							Object.assign(this, {
								list: e.emptyList && [] || Array.prototype.concat.apply(r, [i, e.list || []])
								, exclude: e.exclude || []
								, placeHolder: e.placeHolder || "*"
								, regex: e.regex || /[^a-zA-Z0-9|\$|\@]|\^/g
								, replaceRegex: e.replaceRegex || /\w/g
							})
						}
						isProfane(e) {
							return this.list.filter(t => {
									const n = new RegExp(`\\b${t.replace(/(\W)/g,"\\$1")}\\b`, "gi");
									return !this.exclude.includes(t.toLowerCase()) && n.test(e)
								})
								.length > 0 || !1
						}
						replaceWord(e) {
							return e.replace(this.regex, "")
								.replace(this.replaceRegex, this.placeHolder)
						}
						clean(e) {
							return e.split(/\b/)
								.map(e => this.isProfane(e) ? this.replaceWord(e) : e)
								.join("")
						}
						addWords() {
							let e = Array.from(arguments);
							this.list.push(...e), e.map(e => e.toLowerCase())
								.forEach(e => {
									this.exclude.includes(e) && this.exclude.splice(this.exclude.indexOf(e), 1)
								})
						}
						removeWords() {
							this.exclude.push(...Array.from(arguments)
								.map(e => e.toLowerCase()))
						}
					}
				}, function (e) {
					e.exports = {
						words: ["xxxx"]
					}
				}, function (e, t, n) {
					e.exports = {
						object: n(52)
						, array: n(53)
						, regex: n(54)
					}
				}, function (e, t) {
					e.exports = {
						xxx: 1
					}
				}, function (e, t) {
					e.exports = ["xxx"]
				}, function (e, t) {
					e.exports = /\b(xxx)\b/gi
				}, function (e, t) {
					e.exports.hats = [{
						id: 45
						, name: "Shame!"
						, dontSell: !0
						, price: 0
						, scale: 120
						, desc: "hacks are for losers"
					}, {
						id: 51
						, name: "Moo Cap"
						, price: 0
						, scale: 120
						, desc: "coolest mooer around"
					}, {
						id: 50
						, name: "Apple Cap"
						, price: 0
						, scale: 120
						, desc: "apple farms remembers"
					}, {
						id: 28
						, name: "Moo Head"
						, price: 0
						, scale: 120
						, desc: "no effect"
					}, {
						id: 29
						, name: "Pig Head"
						, price: 0
						, scale: 120
						, desc: "no effect"
					}, {
						id: 30
						, name: "Fluff Head"
						, price: 0
						, scale: 120
						, desc: "no effect"
					}, {
						id: 36
						, name: "Pandou Head"
						, price: 0
						, scale: 120
						, desc: "no effect"
					}, {
						id: 37
						, name: "Bear Head"
						, price: 0
						, scale: 120
						, desc: "no effect"
					}, {
						id: 38
						, name: "Monkey Head"
						, price: 0
						, scale: 120
						, desc: "no effect"
					}, {
						id: 44
						, name: "Polar Head"
						, price: 0
						, scale: 120
						, desc: "no effect"
					}, {
						id: 35
						, name: "Fez Hat"
						, price: 0
						, scale: 120
						, desc: "no effect"
					}, {
						id: 42
						, name: "Enigma Hat"
						, price: 0
						, scale: 120
						, desc: "join the enigma army"
					}, {
						id: 43
						, name: "Blitz Hat"
						, price: 0
						, scale: 120
						, desc: "hey everybody i'm blitz"
					}, {
						id: 49
						, name: "Bob XIII Hat"
						, price: 0
						, scale: 120
						, desc: "like and subscribe"
					}, {
						id: 57
						, name: "Pumpkin"
						, price: 50
						, scale: 120
						, desc: "Spooooky"
					}, {
						id: 8
						, name: "Bummle Hat"
						, price: 100
						, scale: 120
						, desc: "no effect"
					}, {
						id: 2
						, name: "Straw Hat"
						, price: 500
						, scale: 120
						, desc: "no effect"
					}, {
						id: 15
						, name: "Winter Cap"
						, price: 600
						, scale: 120
						, desc: "allows you to move at normal speed in snow"
						, coldM: 1
					}, {
						id: 5
						, name: "Cowboy Hat"
						, price: 1e3
						, scale: 120
						, desc: "no effect"
					}, {
						id: 4
						, name: "Ranger Hat"
						, price: 2e3
						, scale: 120
						, desc: "no effect"
					}, {
						id: 18
						, name: "Explorer Hat"
						, price: 2e3
						, scale: 120
						, desc: "no effect"
					}, {
						id: 31
						, name: "Flipper Hat"
						, price: 2500
						, scale: 120
						, desc: "have more control while in water"
						, watrImm: !0
					}, {
						id: 1
						, name: "Marksman Cap"
						, price: 3e3
						, scale: 120
						, desc: "increases arrow speed and range"
						, aMlt: 1.3
					}, {
						id: 10
						, name: "Bush Gear"
						, price: 3e3
						, scale: 160
						, desc: "allows you to disguise yourself as a bush"
					}, {
						id: 48
						, name: "Halo"
						, price: 3e3
						, scale: 120
						, desc: "no effect"
					}, {
						id: 6
						, name: "Soldier Helmet"
						, price: 4e3
						, scale: 120
						, desc: "reduces damage taken but slows movement"
						, spdMult: .94
						, dmgMult: .75
					}, {
						id: 23
						, name: "Anti Venom Gear"
						, price: 4e3
						, scale: 120
						, desc: "makes you immune to poison"
						, poisonRes: 1
					}, {
						id: 13
						, name: "Medic Gear"
						, price: 5e3
						, scale: 110
						, desc: "slowly regenerates health over time"
						, healthRegen: 3
					}, {
						id: 9
						, name: "Miners Helmet"
						, price: 5e3
						, scale: 120
						, desc: "earn 1 extra gold per resource"
						, extraGold: 1
					}, {
						id: 32
						, name: "Musketeer Hat"
						, price: 5e3
						, scale: 120
						, desc: "reduces cost of projectiles"
						, projCost: .5
					}, {
						id: 7
						, name: "Bull Helmet"
						, price: 6e3
						, scale: 120
						, desc: "increases damage done but drains health"
						, healthRegen: -5
						, dmgMultO: 1.5
						, spdMult: .96
					}, {
						id: 22
						, name: "Emp Helmet"
						, price: 6e3
						, scale: 120
						, desc: "turrets won't attack but you move slower"
						, antiTurret: 1
						, spdMult: .7
					}, {
						id: 12
						, name: "Booster Hat"
						, price: 6e3
						, scale: 120
						, desc: "increases your movement speed"
						, spdMult: 1.16
					}, {
						id: 26
						, name: "Barbarian Armor"
						, price: 8e3
						, scale: 120
						, desc: "knocks back enemies that attack you"
						, dmgK: .6
					}, {
						id: 21
						, name: "Plague Mask"
						, price: 1e4
						, scale: 120
						, desc: "melee attacks deal poison damage"
						, poisonDmg: 5
						, poisonTime: 6
					}, {
						id: 46
						, name: "Bull Mask"
						, price: 1e4
						, scale: 120
						, desc: "bulls won't target you unless you attack them"
						, bullRepel: 1
					}, {
						id: 14
						, name: "Windmill Hat"
						, topSprite: !0
						, price: 1e4
						, scale: 120
						, desc: "generates points while worn"
						, pps: 1.5
					}, {
						id: 11
						, name: "Spike Gear"
						, topSprite: !0
						, price: 1e4
						, scale: 120
						, desc: "deal damage to players that damage you"
						, dmg: .45
					}, {
						id: 53
						, name: "Turret Gear"
						, topSprite: !0
						, price: 1e4
						, scale: 120
						, desc: "you become a walking turret"
						, turret: {
							proj: 1
							, range: 700
							, rate: 2500
						}
						, spdMult: .7
					}, {
						id: 20
						, name: "Samurai Armor"
						, price: 12e3
						, scale: 120
						, desc: "increased attack speed and fire rate"
						, atkSpd: .78
					}, {
						id: 58
						, name: "Dark Knight"
						, price: 12e3
						, scale: 120
						, desc: "restores health when you deal damage"
						, healD: .4
					}, {
						id: 27
						, name: "Scavenger Gear"
						, price: 15e3
						, scale: 120
						, desc: "earn double points for each kill"
						, kScrM: 2
					}, {
						id: 40
						, name: "Tank Gear"
						, price: 15e3
						, scale: 120
						, desc: "increased damage to buildings but slower movement"
						, spdMult: .3
						, bDmg: 3.3
					}, {
						id: 52
						, name: "Thief Gear"
						, price: 15e3
						, scale: 120
						, desc: "steal half of a players gold when you kill them"
						, goldSteal: .5
					}, {
						id: 55
						, name: "Bloodthirster"
						, price: 2e4
						, scale: 120
						, desc: "Restore Health when dealing damage. And increased damage"
						, healD: .25
						, dmgMultO: 1.2
					}, {
						id: 56
						, name: "Assassin Gear"
						, price: 2e4
						, scale: 120
						, desc: "Go invisible when not moving. Can't eat. Increased speed"
						, noEat: !0
						, spdMult: 1.1
						, invisTimer: 1e3
					}], e.exports.accessories = [{
						id: 12
						, name: "Snowball"
						, price: 1e3
						, scale: 105
						, xOff: 18
						, desc: "no effect"
					}, {
						id: 9
						, name: "Tree Cape"
						, price: 1e3
						, scale: 90
						, desc: "no effect"
					}, {
						id: 10
						, name: "Stone Cape"
						, price: 1e3
						, scale: 90
						, desc: "no effect"
					}, {
						id: 3
						, name: "Cookie Cape"
						, price: 1500
						, scale: 90
						, desc: "no effect"
					}, {
						id: 8
						, name: "Cow Cape"
						, price: 2e3
						, scale: 90
						, desc: "no effect"
					}, {
						id: 11
						, name: "Monkey Tail"
						, price: 2e3
						, scale: 97
						, xOff: 25
						, desc: "Super speed but reduced damage"
						, spdMult: 1.35
						, dmgMultO: .2
					}, {
						id: 17
						, name: "Apple Basket"
						, price: 3e3
						, scale: 80
						, xOff: 12
						, desc: "slowly regenerates health over time"
						, healthRegen: 1
					}, {
						id: 6
						, name: "Winter Cape"
						, price: 3e3
						, scale: 90
						, desc: "no effect"
					}, {
						id: 4
						, name: "Skull Cape"
						, price: 4e3
						, scale: 90
						, desc: "no effect"
					}, {
						id: 5
						, name: "Dash Cape"
						, price: 5e3
						, scale: 90
						, desc: "no effect"
					}, {
						id: 2
						, name: "Dragon Cape"
						, price: 6e3
						, scale: 90
						, desc: "no effect"
					}, {
						id: 1
						, name: "Super Cape"
						, price: 8e3
						, scale: 90
						, desc: "no effect"
					}, {
						id: 7
						, name: "Troll Cape"
						, price: 8e3
						, scale: 90
						, desc: "no effect"
					}, {
						id: 14
						, name: "Thorns"
						, price: 1e4
						, scale: 115
						, xOff: 20
						, desc: "no effect"
					}, {
						id: 15
						, name: "Blockades"
						, price: 1e4
						, scale: 95
						, xOff: 15
						, desc: "no effect"
					}, {
						id: 20
						, name: "Devils Tail"
						, price: 1e4
						, scale: 95
						, xOff: 20
						, desc: "no effect"
					}, {
						id: 16
						, name: "Sawblade"
						, price: 12e3
						, scale: 90
						, spin: !0
						, xOff: 0
						, desc: "deal damage to players that damage you"
						, dmg: .15
					}, {
						id: 13
						, name: "Angel Wings"
						, price: 15e3
						, scale: 138
						, xOff: 22
						, desc: "slowly regenerates health over time"
						, healthRegen: 3
					}, {
						id: 19
						, name: "Shadow Wings"
						, price: 15e3
						, scale: 138
						, xOff: 22
						, desc: "increased movement speed"
						, spdMult: 1.1
					}, {
						id: 18
						, name: "Blood Wings"
						, price: 2e4
						, scale: 178
						, xOff: 26
						, desc: "restores health when you deal damage"
						, healD: .2
					}, {
						id: 21
						, name: "Corrupt X Wings"
						, price: 2e4
						, scale: 178
						, xOff: 26
						, desc: "deal damage to players that damage you"
						, dmg: .25
					}]
				}, function (e, t) {
					e.exports = function (e, t, n, r, i, o, a) {
						this.init = function (e, t, n, r, i, o, s, l, c) {
							this.active = !0, this.indx = e, this.x = t, this.y = n, this.dir = r, this.skipMov = !0, this.speed = i, this.dmg = o, this.scale = l, this.range = s, this.owner = c, a && (this.sentTo = {})
						};
						var s, l = [];
						this.update = function (c) {
							if(this.active) {
								var u, f = this.speed * c;
								if(this.skipMov ? this.skipMov = !1 : (this.x += f * Math.cos(this.dir), this.y += f * Math.sin(this.dir), this.range -= f, this.range <= 0 && (this.x += this.range * Math.cos(this.dir), this.y += this.range * Math.sin(this.dir), f = 1, this.range = 0, this.active = !1)), a) {
									for(var d = 0; d < e.length; ++d) !this.sentTo[e[d].id] && e[d].canSee(this) && (this.sentTo[e[d].id] = 1, a.send(e[d].id, "18", o.fixTo(this.x, 1), o.fixTo(this.y, 1), o.fixTo(this.dir, 2), o.fixTo(this.range, 1), this.speed, this.indx, this.layer, this.sid));
									for(l.length = 0, d = 0; d < e.length + t.length; ++d) !(s = e[d] || t[d - e.length])
										.alive || s == this.owner || this.owner.team && s.team == this.owner.team || o.lineInRect(s.x - s.scale, s.y - s.scale, s.x + s.scale, s.y + s.scale, this.x, this.y, this.x + f * Math.cos(this.dir), this.y + f * Math.sin(this.dir)) && l.push(s);
									for(var h = n.getGridArrays(this.x, this.y, this.scale), p = 0; p < h.length; ++p)
										for(var A = 0; A < h[p].length; ++A) u = (s = h[p][A])
											.getScale(), s.active && this.ignoreObj != s.sid && this.layer <= s.layer && l.indexOf(s) < 0 && !s.ignoreCollision && o.lineInRect(s.x - u, s.y - u, s.x + u, s.y + u, this.x, this.y, this.x + f * Math.cos(this.dir), this.y + f * Math.sin(this.dir)) && l.push(s);
									if(l.length > 0) {
										var g = null
											, m = null
											, y = null;
										for(d = 0; d < l.length; ++d) y = o.getDistance(this.x, this.y, l[d].x, l[d].y), (null == m || y < m) && (m = y, g = l[d]);
										if(g.isPlayer || g.isAI) {
											var w = .3 * (g.weightM || 1);
											g.xVel += w * Math.cos(this.dir), g.yVel += w * Math.sin(this.dir), null != g.weaponIndex && r.weapons[g.weaponIndex].shield && o.getAngleDist(this.dir + Math.PI, g.dir) <= i.shieldAngle || g.changeHealth(-this.dmg, this.owner, this.owner)
										} else
											for(g.projDmg && g.health && g.changeHealth(-this.dmg) && n.disableObj(g), d = 0; d < e.length; ++d) e[d].active && (g.sentTo[e[d].id] && (g.active ? e[d].canSee(g) && a.send(e[d].id, "8", o.fixTo(this.dir, 2), g.sid) : a.send(e[d].id, "12", g.sid)), g.active || g.owner != e[d] || e[d].changeItemCount(g.group.id, -1));
										for(this.active = !1, d = 0; d < e.length; ++d) this.sentTo[e[d].id] && a.send(e[d].id, "19", this.sid, o.fixTo(m, 1))
									}
								}
							}
						}
					}
				}, function (e, t) {
					e.exports = function (e, t, n, r, i, o, a, s, l) {
						this.addProjectile = function (c, u, f, d, h, p, A, g, m) {
							for(var y, w = o.projectiles[p], v = 0; v < t.length; ++v)
								if(!t[v].active) {
									y = t[v];
									break
								} return y || ((y = new e(n, r, i, o, a, s, l))
								.sid = t.length, t.push(y)), y.init(p, c, u, f, h, w.dmg, d, w.scale, A), y.ignoreObj = g, y.layer = m || w.layer, y.src = w.src, y
						}
					}
				}, function (e, t) {
					e.exports.obj = function (e, t) {
						var n;
						this.sounds = [], this.active = !0, this.play = function (t, r, i) {
							r && this.active && ((n = this.sounds[t]) || (n = new Howl({
								src: ".././sound/" + t + ".mp3"
							}), this.sounds[t] = n), i && n.isPlaying || (n.isPlaying = !0, n.play(), n.volume((r || 1) * e.volumeMult), n.loop(i)))
						}, this.toggleMute = function (e, t) {
							(n = this.sounds[e]) && n.mute(t)
						}, this.stop = function (e) {
							(n = this.sounds[e]) && (n.stop(), n.isPlaying = !1)
						}
					}
				}, function (e, t, n) {
					var r = n(60)
						, i = n(67);

					function o(e, t, n, r, i) {
						"localhost" == location.hostname && (window.location.hostname = "127.0.0.1"), this.debugLog = !1, this.baseUrl = e, this.lobbySize = n, this.devPort = t, this.lobbySpread = r, this.rawIPs = !!i, this.server = void 0, this.gameIndex = void 0, this.callback = void 0, this.errorCallback = void 0, this.processServers(vultr.servers)
					}
					o.prototype.regionInfo = {
						0: {
							name: "Local"
							, latitude: 0
							, longitude: 0
						}
						, "vultr:1": {
							name: "New Jersey"
							, latitude: 40.1393329
							, longitude: -75.8521818
						}
						, "vultr:2": {
							name: "Chicago"
							, latitude: 41.8339037
							, longitude: -87.872238
						}
						, "vultr:3": {
							name: "Dallas"
							, latitude: 32.8208751
							, longitude: -96.8714229
						}
						, "vultr:4": {
							name: "Seattle"
							, latitude: 47.6149942
							, longitude: -122.4759879
						}
						, "vultr:5": {
							name: "Los Angeles"
							, latitude: 34.0207504
							, longitude: -118.691914
						}
						, "vultr:6": {
							name: "Atlanta"
							, latitude: 33.7676334
							, longitude: -84.5610332
						}
						, "vultr:7": {
							name: "Amsterdam"
							, latitude: 52.3745287
							, longitude: 4.7581878
						}
						, "vultr:8": {
							name: "London"
							, latitude: 51.5283063
							, longitude: -.382486
						}
						, "vultr:9": {
							name: "Frankfurt"
							, latitude: 50.1211273
							, longitude: 8.496137
						}
						, "vultr:12": {
							name: "Silicon Valley"
							, latitude: 37.4024714
							, longitude: -122.3219752
						}
						, "vultr:19": {
							name: "Sydney"
							, latitude: -33.8479715
							, longitude: 150.651084
						}
						, "vultr:24": {
							name: "Paris"
							, latitude: 48.8588376
							, longitude: 2.2773454
						}
						, "vultr:25": {
							name: "Tokyo"
							, latitude: 35.6732615
							, longitude: 139.569959
						}
						, "vultr:39": {
							name: "Miami"
							, latitude: 25.7823071
							, longitude: -80.3012156
						}
						, "vultr:40": {
							name: "Singapore"
							, latitude: 1.3147268
							, longitude: 103.7065876
						}
					}, o.prototype.start = function (e, t) {
						this.callback = e, this.errorCallback = t;
						var n = this.parseServerQuery();
						n ? (this.log("Found server in query."), this.password = n[3], this.connect(n[0], n[1], n[2])) : (this.log("Pinging servers..."), this.pingServers())
					}, o.prototype.parseServerQuery = function () {
						var e = r.parse(location.href, !0)
							, t = e.query.server;
						if("string" == typeof t) {
							var n = t.split(":");
							if(3 == n.length) {
								var i = n[0]
									, o = parseInt(n[1])
									, a = parseInt(n[2]);
								return "0" == i || i.startsWith("vultr:") || (i = "vultr:" + i), [i, o, a, e.query.password]
							}
							this.errorCallback("Invalid number of server parameters in " + t)
						}
					}, o.prototype.findServer = function (e, t) {
						var n = this.servers[e];
						if(Array.isArray(n)) {
							for(var r = 0; r < n.length; r++) {
								var i = n[r];
								if(i.index == t) return i
							}
							console.warn("Could not find server in region " + e + " with index " + t + ".")
						} else this.errorCallback("No server list for region " + e)
					}, o.prototype.pingServers = function () {
						var e = this
							, t = [];
						for(var n in this.servers)
							if(this.servers.hasOwnProperty(n)) {
								var r = this.servers[n]
									, i = r[Math.floor(Math.random() * r.length)];
								null != i ? function (r, i) {
									var o = new XMLHttpRequest;
									o.onreadystatechange = function (r) {
										var o = r.target;
										if(4 == o.readyState)
											if(200 == o.status) {
												for(var a = 0; a < t.length; a++) t[a].abort();
												e.log("Connecting to region", i.region);
												var s = e.seekServer(i.region);
												e.connect(s[0], s[1], s[2])
											} else console.warn("Error pinging " + i.ip + " in region " + n)
									};
									var a = "//" + e.serverAddress(i.ip, !0) + ":" + e.serverPort(i) + "/ping";
									o.open("GET", a, !0), o.send(null), e.log("Pinging", a), t.push(o)
								}(0, i) : console.log("No target server for region " + n)
							}
					}, o.prototype.seekServer = function (e, t, n) {
						null == n && (n = "random"), null == t && (t = !1);
						const r = ["random"];
						var i = this.lobbySize
							, o = this.lobbySpread
							, a = this.servers[e].flatMap(function (e) {
								var t = 0;
								return e.games.map(function (n) {
									var r = t++;
									return {
										region: e.region
										, index: e.index * e.games.length + r
										, gameIndex: r
										, gameCount: e.games.length
										, playerCount: n.playerCount
										, isPrivate: n.isPrivate
									}
								})
							})
							.filter(function (e) {
								return !e.isPrivate
							})
							.filter(function (e) {
								return !t || 0 == e.playerCount && e.gameIndex >= e.gameCount / 2
							})
							.filter(function (e) {
								return "random" == n || r[e.index % r.length].key == n
							})
							.sort(function (e, t) {
								return t.playerCount - e.playerCount
							})
							.filter(function (e) {
								return e.playerCount < i
							});
						if(t && a.reverse(), 0 != a.length) {
							var s = Math.min(o, a.length)
								, l = Math.floor(Math.random() * s)
								, c = a[l = Math.min(l, a.length - 1)]
								, u = c.region
								, f = (l = Math.floor(c.index / c.gameCount), c.index % c.gameCount);
							return this.log("Found server."), [u, l, f]
						}
						this.errorCallback("No open servers.")
					}, o.prototype.connect = function (e, t, n) {
						if(!this.connected) {
							var r = this.findServer(e, t);
							null != r ? (this.log("Connecting to server", r, "with game index", n), r.games[n].playerCount >= this.lobbySize ? this.errorCallback("Server is already full.") : (window.history.replaceState(document.title, document.title, this.generateHref(e, t, n, this.password)), this.server = r, this.gameIndex = n, this.log("Calling callback with address", this.serverAddress(r.ip), "on port", this.serverPort(r), "with game index", n), this.callback(this.serverAddress(r.ip), this.serverPort(r), n))) : this.errorCallback("Failed to find server for region " + e + " and index " + t)
						}
					}, o.prototype.switchServer = function (e, t, n, r) {
						this.switchingServers = !0, window.location.href = this.generateHref(e, t, n, r)
					}, o.prototype.generateHref = function (e, t, n, r) {
						var i = "/?server=" + (e = this.stripRegion(e)) + ":" + t + ":" + n;
						return r && (i += "&password=" + encodeURIComponent(r)), i
					}, o.prototype.serverAddress = function (e, t) {
						return "127.0.0.1" == e || "7f000001" == e || "903d62ef5d1c2fecdcaeb5e7dd485eff" == e ? window.location.hostname : this.rawIPs ? t ? "ip_" + this.hashIP(e) + "." + this.baseUrl : e : "ip_" + e + "." + this.baseUrl
					}, o.prototype.serverPort = function (e) {
						return 0 == e.region ? this.devPort : location.protocol.startsWith("https") ? 443 : 80
					}, o.prototype.processServers = function (e) {
						for(var t = {}, n = 0; n < e.length; n++) {
							var r = e[n]
								, i = t[r.region];
							null == i && (i = [], t[r.region] = i), i.push(r)
						}
						for(var o in t) t[o] = t[o].sort(function (e, t) {
							return e.index - t.index
						});
						this.servers = t
					}, o.prototype.ipToHex = function (e) {
						return e.split(".")
							.map(e => ("00" + parseInt(e)
									.toString(16))
								.substr(-2))
							.join("")
							.toLowerCase()
					}, o.prototype.hashIP = function (e) {
						return i(this.ipToHex(e))
					}, o.prototype.log = function () {
						return this.debugLog ? console.log.apply(void 0, arguments) : console.verbose ? console.verbose.apply(void 0, arguments) : void 0
					}, o.prototype.stripRegion = function (e) {
						return e.startsWith("vultr:") ? e = e.slice(6) : e.startsWith("do:") && (e = e.slice(3)), e
					}, window.testVultrClient = function () {
						var e = 1;

						function t(t, n) {
							(t = "" + t) == (n = "" + n) ? console.log(`Assert ${e} passed.`): console.warn(`Assert ${e} failed. Expected ${n}, got ${t}.`), e++
						}
						var n = new o("test.io", -1, 5, 1, !1);
						n.errorCallback = function (e) {}, n.processServers(function (e) {
							var t = [];
							for(var n in e)
								for(var r = e[n], i = 0; i < r.length; i++) t.push({
									ip: n + ":" + i
									, scheme: "testing"
									, region: n
									, index: i
									, games: r[i].map(e => ({
										playerCount: e
										, isPrivate: !1
									}))
								});
							return t
						}({
							1: [
								[0, 0, 0, 0]
								, [0, 0, 0, 0]
							]
							, 2: [
								[5, 1, 0, 0]
								, [0, 0, 0, 0]
							]
							, 3: [
								[5, 0, 1, 5]
								, [0, 0, 0, 0]
							]
							, 4: [
								[5, 1, 1, 5]
								, [1, 0, 0, 0]
							]
							, 5: [
								[5, 1, 1, 5]
								, [1, 0, 4, 0]
							]
							, 6: [
								[5, 5, 5, 5]
								, [2, 3, 1, 4]
							]
							, 7: [
								[5, 5, 5, 5]
								, [5, 5, 5, 5]
							]
						})), t(n.seekServer(1, !1), [1, 0, 0]), t(n.seekServer(1, !0), [1, 1, 3]), t(n.seekServer(2, !1), [2, 0, 1]), t(n.seekServer(2, !0), [2, 1, 3]), t(n.seekServer(3, !1), [3, 0, 2]), t(n.seekServer(3, !0), [3, 1, 3]), t(n.seekServer(4, !1), [4, 0, 1]), t(n.seekServer(4, !0), [4, 1, 3]), t(n.seekServer(5, !1), [5, 1, 2]), t(n.seekServer(5, !0), [5, 1, 3]), t(n.seekServer(6, !1), [6, 1, 3]), t(n.seekServer(6, !0), void 0), t(n.seekServer(7, !1), void 0), t(n.seekServer(7, !0), void 0), console.log("Tests passed.")
					};
					var a = function (e, t) {
						return e.concat(t)
					};
					Array.prototype.flatMap = function (e) {
						return function (e, t) {
							return t.map(e)
								.reduce(a, [])
						}(e, this)
					}, e.exports = o
				}, function (e, t, n) {
					var r = n(61)
						, i = n(63);

					function o() {
						this.protocol = null, this.slashes = null, this.auth = null, this.host = null, this.port = null, this.hostname = null, this.hash = null, this.search = null, this.query = null, this.pathname = null, this.path = null, this.href = null
					}
					t.parse = w, t.resolve = function (e, t) {
						return w(e, !1, !0)
							.resolve(t)
					}, t.resolveObject = function (e, t) {
						return e ? w(e, !1, !0)
							.resolveObject(t) : t
					}, t.format = function (e) {
						return i.isString(e) && (e = w(e)), e instanceof o ? e.format() : o.prototype.format.call(e)
					}, t.Url = o;
					var a = /^([a-z0-9.+-]+:)/i
						, s = /:[0-9]*$/
						, l = /^(\/\/?(?!\/)[^\?\s]*)(\?[^\s]*)?$/
						, c = ["{", "}", "|", "\\", "^", "`"].concat(["<", ">", '"', "`", " ", "\r", "\n", "\t"])
						, u = ["'"].concat(c)
						, f = ["%", "/", "?", ";", "#"].concat(u)
						, d = ["/", "?", "#"]
						, h = /^[+a-z0-9A-Z_-]{0,63}$/
						, p = /^([+a-z0-9A-Z_-]{0,63})(.*)$/
						, A = {
							javascript: !0
							, "javascript:": !0
						}
						, g = {
							javascript: !0
							, "javascript:": !0
						}
						, m = {
							http: !0
							, https: !0
							, ftp: !0
							, gopher: !0
							, file: !0
							, "http:": !0
							, "https:": !0
							, "ftp:": !0
							, "gopher:": !0
							, "file:": !0
						}
						, y = n(64);

					function w(e, t, n) {
						if(e && i.isObject(e) && e instanceof o) return e;
						var r = new o;
						return r.parse(e, t, n), r
					}
					o.prototype.parse = function (e, t, n) {
						if(!i.isString(e)) throw new TypeError("Parameter 'url' must be a string, not " + typeof e);
						var o = e.indexOf("?")
							, s = -1 !== o && o < e.indexOf("#") ? "?" : "#"
							, c = e.split(s);
						c[0] = c[0].replace(/\\/g, "/");
						var w = e = c.join(s);
						if(w = w.trim(), !n && 1 === e.split("#")
							.length) {
							var v = l.exec(w);
							if(v) return this.path = w, this.href = w, this.pathname = v[1], v[2] ? (this.search = v[2], this.query = t ? y.parse(this.search.substr(1)) : this.search.substr(1)) : t && (this.search = "", this.query = {}), this
						}
						var b = a.exec(w);
						if(b) {
							var x = (b = b[0])
								.toLowerCase();
							this.protocol = x, w = w.substr(b.length)
						}
						if(n || b || w.match(/^\/\/[^@\/]+@[^@\/]+/)) {
							var B = "//" === w.substr(0, 2);
							!B || b && g[b] || (w = w.substr(2), this.slashes = !0)
						}
						if(!g[b] && (B || b && !m[b])) {
							for(var E, k, C = -1, I = 0; I < d.length; I++) - 1 !== (T = w.indexOf(d[I])) && (-1 === C || T < C) && (C = T);
							for(-1 !== (k = -1 === C ? w.lastIndexOf("@") : w.lastIndexOf("@", C)) && (E = w.slice(0, k), w = w.slice(k + 1), this.auth = decodeURIComponent(E)), C = -1, I = 0; I < f.length; I++) {
								var T; - 1 !== (T = w.indexOf(f[I])) && (-1 === C || T < C) && (C = T)
							} - 1 === C && (C = w.length), this.host = w.slice(0, C), w = w.slice(C), this.parseHost(), this.hostname = this.hostname || "";
							var M = "[" === this.hostname[0] && "]" === this.hostname[this.hostname.length - 1];
							if(!M)
								for(var P = this.hostname.split(/\./), O = (I = 0, P.length); I < O; I++) {
									var D = P[I];
									if(D && !D.match(h)) {
										for(var L = "", _ = 0, S = D.length; _ < S; _++) D.charCodeAt(_) > 127 ? L += "x" : L += D[_];
										if(!L.match(h)) {
											var q = P.slice(0, I)
												, H = P.slice(I + 1)
												, V = D.match(p);
											V && (q.push(V[1]), H.unshift(V[2])), H.length && (w = "/" + H.join(".") + w), this.hostname = q.join(".");
											break
										}
									}
								}
							this.hostname.length > 255 ? this.hostname = "" : this.hostname = this.hostname.toLowerCase(), M || (this.hostname = r.toASCII(this.hostname));
							var j = this.port ? ":" + this.port : ""
								, X = this.hostname || "";
							this.host = X + j, this.href += this.host, M && (this.hostname = this.hostname.substr(1, this.hostname.length - 2), "/" !== w[0] && (w = "/" + w))
						}
						if(!A[x])
							for(I = 0, O = u.length; I < O; I++) {
								var U = u[I];
								if(-1 !== w.indexOf(U)) {
									var R = encodeURIComponent(U);
									R === U && (R = escape(U)), w = w.split(U)
										.join(R)
								}
							}
						var Y = w.indexOf("#"); - 1 !== Y && (this.hash = w.substr(Y), w = w.slice(0, Y));
						var W = w.indexOf("?");
						if(-1 !== W ? (this.search = w.substr(W), this.query = w.substr(W + 1), t && (this.query = y.parse(this.query)), w = w.slice(0, W)) : t && (this.search = "", this.query = {}), w && (this.pathname = w), m[x] && this.hostname && !this.pathname && (this.pathname = "/"), this.pathname || this.search) {
							j = this.pathname || "";
							var z = this.search || "";
							this.path = j + z
						}
						return this.href = this.format(), this
					}, o.prototype.format = function () {
						var e = this.auth || "";
						e && (e = (e = encodeURIComponent(e))
							.replace(/%3A/i, ":"), e += "@");
						var t = this.protocol || ""
							, n = this.pathname || ""
							, r = this.hash || ""
							, o = !1
							, a = "";
						this.host ? o = e + this.host : this.hostname && (o = e + (-1 === this.hostname.indexOf(":") ? this.hostname : "[" + this.hostname + "]"), this.port && (o += ":" + this.port)), this.query && i.isObject(this.query) && Object.keys(this.query)
							.length && (a = y.stringify(this.query));
						var s = this.search || a && "?" + a || "";
						return t && ":" !== t.substr(-1) && (t += ":"), this.slashes || (!t || m[t]) && !1 !== o ? (o = "//" + (o || ""), n && "/" !== n.charAt(0) && (n = "/" + n)) : o || (o = ""), r && "#" !== r.charAt(0) && (r = "#" + r), s && "?" !== s.charAt(0) && (s = "?" + s), t + o + (n = n.replace(/[?#]/g, function (e) {
							return encodeURIComponent(e)
						})) + (s = s.replace("#", "%23")) + r
					}, o.prototype.resolve = function (e) {
						return this.resolveObject(w(e, !1, !0))
							.format()
					}, o.prototype.resolveObject = function (e) {
						if(i.isString(e)) {
							var t = new o;
							t.parse(e, !1, !0), e = t
						}
						for(var n = new o, r = Object.keys(this), a = 0; a < r.length; a++) {
							var s = r[a];
							n[s] = this[s]
						}
						if(n.hash = e.hash, "" === e.href) return n.href = n.format(), n;
						if(e.slashes && !e.protocol) {
							for(var l = Object.keys(e), c = 0; c < l.length; c++) {
								var u = l[c];
								"protocol" !== u && (n[u] = e[u])
							}
							return m[n.protocol] && n.hostname && !n.pathname && (n.path = n.pathname = "/"), n.href = n.format(), n
						}
						if(e.protocol && e.protocol !== n.protocol) {
							if(!m[e.protocol]) {
								for(var f = Object.keys(e), d = 0; d < f.length; d++) {
									var h = f[d];
									n[h] = e[h]
								}
								return n.href = n.format(), n
							}
							if(n.protocol = e.protocol, e.host || g[e.protocol]) n.pathname = e.pathname;
							else {
								for(var p = (e.pathname || "")
										.split("/"); p.length && !(e.host = p.shift()););
								e.host || (e.host = ""), e.hostname || (e.hostname = ""), "" !== p[0] && p.unshift(""), p.length < 2 && p.unshift(""), n.pathname = p.join("/")
							}
							if(n.search = e.search, n.query = e.query, n.host = e.host || "", n.auth = e.auth, n.hostname = e.hostname || e.host, n.port = e.port, n.pathname || n.search) {
								var A = n.pathname || ""
									, y = n.search || "";
								n.path = A + y
							}
							return n.slashes = n.slashes || e.slashes, n.href = n.format(), n
						}
						var w = n.pathname && "/" === n.pathname.charAt(0)
							, v = e.host || e.pathname && "/" === e.pathname.charAt(0)
							, b = v || w || n.host && e.pathname
							, x = b
							, B = n.pathname && n.pathname.split("/") || []
							, E = (p = e.pathname && e.pathname.split("/") || [], n.protocol && !m[n.protocol]);
						if(E && (n.hostname = "", n.port = null, n.host && ("" === B[0] ? B[0] = n.host : B.unshift(n.host)), n.host = "", e.protocol && (e.hostname = null, e.port = null, e.host && ("" === p[0] ? p[0] = e.host : p.unshift(e.host)), e.host = null), b = b && ("" === p[0] || "" === B[0])), v) n.host = e.host || "" === e.host ? e.host : n.host, n.hostname = e.hostname || "" === e.hostname ? e.hostname : n.hostname, n.search = e.search, n.query = e.query, B = p;
						else if(p.length) B || (B = []), B.pop(), B = B.concat(p), n.search = e.search, n.query = e.query;
						else if(!i.isNullOrUndefined(e.search)) return E && (n.hostname = n.host = B.shift(), (M = !!(n.host && n.host.indexOf("@") > 0) && n.host.split("@")) && (n.auth = M.shift(), n.host = n.hostname = M.shift())), n.search = e.search, n.query = e.query, i.isNull(n.pathname) && i.isNull(n.search) || (n.path = (n.pathname ? n.pathname : "") + (n.search ? n.search : "")), n.href = n.format(), n;
						if(!B.length) return n.pathname = null, n.search ? n.path = "/" + n.search : n.path = null, n.href = n.format(), n;
						for(var k = B.slice(-1)[0], C = (n.host || e.host || B.length > 1) && ("." === k || ".." === k) || "" === k, I = 0, T = B.length; T >= 0; T--) "." === (k = B[T]) ? B.splice(T, 1) : ".." === k ? (B.splice(T, 1), I++) : I && (B.splice(T, 1), I--);
						if(!b && !x)
							for(; I--; I) B.unshift("..");
						!b || "" === B[0] || B[0] && "/" === B[0].charAt(0) || B.unshift(""), C && "/" !== B.join("/")
							.substr(-1) && B.push("");
						var M, P = "" === B[0] || B[0] && "/" === B[0].charAt(0);
						return E && (n.hostname = n.host = P ? "" : B.length ? B.shift() : "", (M = !!(n.host && n.host.indexOf("@") > 0) && n.host.split("@")) && (n.auth = M.shift(), n.host = n.hostname = M.shift())), (b = b || n.host && B.length) && !P && B.unshift(""), B.length ? n.pathname = B.join("/") : (n.pathname = null, n.path = null), i.isNull(n.pathname) && i.isNull(n.search) || (n.path = (n.pathname ? n.pathname : "") + (n.search ? n.search : "")), n.auth = e.auth || n.auth, n.slashes = n.slashes || e.slashes, n.href = n.format(), n
					}, o.prototype.parseHost = function () {
						var e = this.host
							, t = s.exec(e);
						t && (":" !== (t = t[0]) && (this.port = t.substr(1)), e = e.substr(0, e.length - t.length)), e && (this.hostname = e)
					}
				}, function (e, t, n) {
					(function (e, r) {
						var i;
						! function (o) {
							t && t.nodeType, e && e.nodeType;
							var a = "object" == typeof r && r;
							a.global !== a && a.window !== a && a.self;
							var s, l = 2147483647
								, c = 36
								, u = /^xn--/
								, f = /[^\x20-\x7E]/
								, d = /[\x2E\u3002\uFF0E\uFF61]/g
								, h = {
									overflow: "Overflow: input needs wider integers to process"
									, "not-basic": "Illegal input >= 0x80 (not a basic code point)"
									, "invalid-input": "Invalid input"
								}
								, p = Math.floor
								, A = String.fromCharCode;

							function g(e) {
								throw new RangeError(h[e])
							}

							function m(e, t) {
								for(var n = e.length, r = []; n--;) r[n] = t(e[n]);
								return r
							}

							function y(e, t) {
								var n = e.split("@")
									, r = "";
								return n.length > 1 && (r = n[0] + "@", e = n[1]), r + m((e = e.replace(d, "."))
										.split("."), t)
									.join(".")
							}

							function w(e) {
								for(var t, n, r = [], i = 0, o = e.length; i < o;)(t = e.charCodeAt(i++)) >= 55296 && t <= 56319 && i < o ? 56320 == (64512 & (n = e.charCodeAt(i++))) ? r.push(((1023 & t) << 10) + (1023 & n) + 65536) : (r.push(t), i--) : r.push(t);
								return r
							}

							function v(e) {
								return m(e, function (e) {
										var t = "";
										return e > 65535 && (t += A((e -= 65536) >>> 10 & 1023 | 55296), e = 56320 | 1023 & e), t + A(e)
									})
									.join("")
							}

							function b(e) {
								return e - 48 < 10 ? e - 22 : e - 65 < 26 ? e - 65 : e - 97 < 26 ? e - 97 : c
							}

							function x(e, t) {
								return e + 22 + 75 * (e < 26) - ((0 != t) << 5)
							}

							function B(e, t, n) {
								var r = 0;
								for(e = n ? p(e / 700) : e >> 1, e += p(e / t); e > 455; r += c) e = p(e / 35);
								return p(r + 36 * e / (e + 38))
							}

							function E(e) {
								var t, n, r, i, o, a, s, u, f, d, h = []
									, A = e.length
									, m = 0
									, y = 128
									, w = 72;
								for((n = e.lastIndexOf("-")) < 0 && (n = 0), r = 0; r < n; ++r) e.charCodeAt(r) >= 128 && g("not-basic"), h.push(e.charCodeAt(r));
								for(i = n > 0 ? n + 1 : 0; i < A;) {
									for(o = m, a = 1, s = c; i >= A && g("invalid-input"), ((u = b(e.charCodeAt(i++))) >= c || u > p((l - m) / a)) && g("overflow"), m += u * a, !(u < (f = s <= w ? 1 : s >= w + 26 ? 26 : s - w)); s += c) a > p(l / (d = c - f)) && g("overflow"), a *= d;
									w = B(m - o, t = h.length + 1, 0 == o), p(m / t) > l - y && g("overflow"), y += p(m / t), m %= t, h.splice(m++, 0, y)
								}
								return v(h)
							}

							function k(e) {
								var t, n, r, i, o, a, s, u, f, d, h, m, y, v, b, E = [];
								for(m = (e = w(e))
									.length, t = 128, n = 0, o = 72, a = 0; a < m; ++a)(h = e[a]) < 128 && E.push(A(h));
								for(r = i = E.length, i && E.push("-"); r < m;) {
									for(s = l, a = 0; a < m; ++a)(h = e[a]) >= t && h < s && (s = h);
									for(s - t > p((l - n) / (y = r + 1)) && g("overflow"), n += (s - t) * y, t = s, a = 0; a < m; ++a)
										if((h = e[a]) < t && ++n > l && g("overflow"), h == t) {
											for(u = n, f = c; !(u < (d = f <= o ? 1 : f >= o + 26 ? 26 : f - o)); f += c) b = u - d, v = c - d, E.push(A(x(d + b % v, 0))), u = p(b / v);
											E.push(A(x(u, 0))), o = B(n, y, r == i), n = 0, ++r
										}++ n, ++t
								}
								return E.join("")
							}
							s = {
								version: "1.4.1"
								, ucs2: {
									decode: w
									, encode: v
								}
								, decode: E
								, encode: k
								, toASCII: function (e) {
									return y(e, function (e) {
										return f.test(e) ? "xn--" + k(e) : e
									})
								}
								, toUnicode: function (e) {
									return y(e, function (e) {
										return u.test(e) ? E(e.slice(4)
											.toLowerCase()) : e
									})
								}
							}, void 0 === (i = function () {
								return s
							}.call(t, n, t, e)) || (e.exports = i)
						}()
					})
					.call(this, n(62)(e), n(12))
				}, function (e, t) {
					e.exports = function (e) {
						return e.webpackPolyfill || (e.deprecate = function () {}, e.paths = [], e.children || (e.children = []), Object.defineProperty(e, "loaded", {
							enumerable: !0
							, get: function () {
								return e.l
							}
						}), Object.defineProperty(e, "id", {
							enumerable: !0
							, get: function () {
								return e.i
							}
						}), e.webpackPolyfill = 1), e
					}
				}, function (e, t, n) {
					e.exports = {
						isString: function (e) {
							return "string" == typeof e
						}
						, isObject: function (e) {
							return "object" == typeof e && null !== e
						}
						, isNull: function (e) {
							return null === e
						}
						, isNullOrUndefined: function (e) {
							return null == e
						}
					}
				}, function (e, t, n) {
					t.decode = t.parse = n(65), t.encode = t.stringify = n(66)
				}, function (e, t, n) {
					function r(e, t) {
						return Object.prototype.hasOwnProperty.call(e, t)
					}
					e.exports = function (e, t, n, o) {
						t = t || "&", n = n || "=";
						var a = {};
						if("string" != typeof e || 0 === e.length) return a;
						var s = /\+/g;
						e = e.split(t);
						var l = 1e3;
						o && "number" == typeof o.maxKeys && (l = o.maxKeys);
						var c = e.length;
						l > 0 && c > l && (c = l);
						for(var u = 0; u < c; ++u) {
							var f, d, h, p, A = e[u].replace(s, "%20")
								, g = A.indexOf(n);
							g >= 0 ? (f = A.substr(0, g), d = A.substr(g + 1)) : (f = A, d = ""), h = decodeURIComponent(f), p = decodeURIComponent(d), r(a, h) ? i(a[h]) ? a[h].push(p) : a[h] = [a[h], p] : a[h] = p
						}
						return a
					};
					var i = Array.isArray || function (e) {
						return "[object Array]" === Object.prototype.toString.call(e)
					}
				}, function (e, t, n) {
					var r = function (e) {
						switch(typeof e) {
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
					e.exports = function (e, t, n, s) {
						return t = t || "&", n = n || "=", null === e && (e = void 0), "object" == typeof e ? o(a(e), function (a) {
								var s = encodeURIComponent(r(a)) + n;
								return i(e[a]) ? o(e[a], function (e) {
										return s + encodeURIComponent(r(e))
									})
									.join(t) : s + encodeURIComponent(r(e[a]))
							})
							.join(t) : s ? encodeURIComponent(r(s)) + n + encodeURIComponent(r(e)) : ""
					};
					var i = Array.isArray || function (e) {
						return "[object Array]" === Object.prototype.toString.call(e)
					};

					function o(e, t) {
						if(e.map) return e.map(t);
						for(var n = [], r = 0; r < e.length; r++) n.push(t(e[r], r));
						return n
					}
					var a = Object.keys || function (e) {
						var t = [];
						for(var n in e) Object.prototype.hasOwnProperty.call(e, n) && t.push(n);
						return t
					}
				}, function (e, t, n) {
					! function () {
						var t = n(68)
							, r = n(20)
							.utf8
							, i = n(69)
							, o = n(20)
							.bin
							, a = function (e, n) {
								e.constructor == String ? e = n && "binary" === n.encoding ? o.stringToBytes(e) : r.stringToBytes(e) : i(e) ? e = Array.prototype.slice.call(e, 0) : Array.isArray(e) || (e = e.toString());
								for(var s = t.bytesToWords(e), l = 8 * e.length, c = 1732584193, u = -271733879, f = -1732584194, d = 271733878, h = 0; h < s.length; h++) s[h] = 16711935 & (s[h] << 8 | s[h] >>> 24) | 4278255360 & (s[h] << 24 | s[h] >>> 8);
								s[l >>> 5] |= 128 << l % 32, s[14 + (l + 64 >>> 9 << 4)] = l;
								var p = a._ff
									, A = a._gg
									, g = a._hh
									, m = a._ii;
								for(h = 0; h < s.length; h += 16) {
									var y = c
										, w = u
										, v = f
										, b = d;
									u = m(u = m(u = m(u = m(u = g(u = g(u = g(u = g(u = A(u = A(u = A(u = A(u = p(u = p(u = p(u = p(u, f = p(f, d = p(d, c = p(c, u, f, d, s[h + 0], 7, -680876936), u, f, s[h + 1], 12, -389564586), c, u, s[h + 2], 17, 606105819), d, c, s[h + 3], 22, -1044525330), f = p(f, d = p(d, c = p(c, u, f, d, s[h + 4], 7, -176418897), u, f, s[h + 5], 12, 1200080426), c, u, s[h + 6], 17, -1473231341), d, c, s[h + 7], 22, -45705983), f = p(f, d = p(d, c = p(c, u, f, d, s[h + 8], 7, 1770035416), u, f, s[h + 9], 12, -1958414417), c, u, s[h + 10], 17, -42063), d, c, s[h + 11], 22, -1990404162), f = p(f, d = p(d, c = p(c, u, f, d, s[h + 12], 7, 1804603682), u, f, s[h + 13], 12, -40341101), c, u, s[h + 14], 17, -1502002290), d, c, s[h + 15], 22, 1236535329), f = A(f, d = A(d, c = A(c, u, f, d, s[h + 1], 5, -165796510), u, f, s[h + 6], 9, -1069501632), c, u, s[h + 11], 14, 643717713), d, c, s[h + 0], 20, -373897302), f = A(f, d = A(d, c = A(c, u, f, d, s[h + 5], 5, -701558691), u, f, s[h + 10], 9, 38016083), c, u, s[h + 15], 14, -660478335), d, c, s[h + 4], 20, -405537848), f = A(f, d = A(d, c = A(c, u, f, d, s[h + 9], 5, 568446438), u, f, s[h + 14], 9, -1019803690), c, u, s[h + 3], 14, -187363961), d, c, s[h + 8], 20, 1163531501), f = A(f, d = A(d, c = A(c, u, f, d, s[h + 13], 5, -1444681467), u, f, s[h + 2], 9, -51403784), c, u, s[h + 7], 14, 1735328473), d, c, s[h + 12], 20, -1926607734), f = g(f, d = g(d, c = g(c, u, f, d, s[h + 5], 4, -378558), u, f, s[h + 8], 11, -2022574463), c, u, s[h + 11], 16, 1839030562), d, c, s[h + 14], 23, -35309556), f = g(f, d = g(d, c = g(c, u, f, d, s[h + 1], 4, -1530992060), u, f, s[h + 4], 11, 1272893353), c, u, s[h + 7], 16, -155497632), d, c, s[h + 10], 23, -1094730640), f = g(f, d = g(d, c = g(c, u, f, d, s[h + 13], 4, 681279174), u, f, s[h + 0], 11, -358537222), c, u, s[h + 3], 16, -722521979), d, c, s[h + 6], 23, 76029189), f = g(f, d = g(d, c = g(c, u, f, d, s[h + 9], 4, -640364487), u, f, s[h + 12], 11, -421815835), c, u, s[h + 15], 16, 530742520), d, c, s[h + 2], 23, -995338651), f = m(f, d = m(d, c = m(c, u, f, d, s[h + 0], 6, -198630844), u, f, s[h + 7], 10, 1126891415), c, u, s[h + 14], 15, -1416354905), d, c, s[h + 5], 21, -57434055), f = m(f, d = m(d, c = m(c, u, f, d, s[h + 12], 6, 1700485571), u, f, s[h + 3], 10, -1894986606), c, u, s[h + 10], 15, -1051523), d, c, s[h + 1], 21, -2054922799), f = m(f, d = m(d, c = m(c, u, f, d, s[h + 8], 6, 1873313359), u, f, s[h + 15], 10, -30611744), c, u, s[h + 6], 15, -1560198380), d, c, s[h + 13], 21, 1309151649), f = m(f, d = m(d, c = m(c, u, f, d, s[h + 4], 6, -145523070), u, f, s[h + 11], 10, -1120210379), c, u, s[h + 2], 15, 718787259), d, c, s[h + 9], 21, -343485551), c = c + y >>> 0, u = u + w >>> 0, f = f + v >>> 0, d = d + b >>> 0
								}
								return t.endian([c, u, f, d])
							};
						a._ff = function (e, t, n, r, i, o, a) {
							var s = e + (t & n | ~t & r) + (i >>> 0) + a;
							return (s << o | s >>> 32 - o) + t
						}, a._gg = function (e, t, n, r, i, o, a) {
							var s = e + (t & r | n & ~r) + (i >>> 0) + a;
							return (s << o | s >>> 32 - o) + t
						}, a._hh = function (e, t, n, r, i, o, a) {
							var s = e + (t ^ n ^ r) + (i >>> 0) + a;
							return (s << o | s >>> 32 - o) + t
						}, a._ii = function (e, t, n, r, i, o, a) {
							var s = e + (n ^ (t | ~r)) + (i >>> 0) + a;
							return (s << o | s >>> 32 - o) + t
						}, a._blocksize = 16, a._digestsize = 16, e.exports = function (e, n) {
							if(null == e) throw new Error("Illegal argument " + e);
							var r = t.wordsToBytes(a(e, n));
							return n && n.asBytes ? r : n && n.asString ? o.bytesToString(r) : t.bytesToHex(r)
						}
					}()
				}, function (e, t) {
					! function () {
						var t = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/"
							, n = {
								rotl: function (e, t) {
									return e << t | e >>> 32 - t
								}
								, rotr: function (e, t) {
									return e << 32 - t | e >>> t
								}
								, endian: function (e) {
									if(e.constructor == Number) return 16711935 & n.rotl(e, 8) | 4278255360 & n.rotl(e, 24);
									for(var t = 0; t < e.length; t++) e[t] = n.endian(e[t]);
									return e
								}
								, randomBytes: function (e) {
									for(var t = []; e > 0; e--) t.push(Math.floor(256 * Math.random()));
									return t
								}
								, bytesToWords: function (e) {
									for(var t = [], n = 0, r = 0; n < e.length; n++, r += 8) t[r >>> 5] |= e[n] << 24 - r % 32;
									return t
								}
								, wordsToBytes: function (e) {
									for(var t = [], n = 0; n < 32 * e.length; n += 8) t.push(e[n >>> 5] >>> 24 - n % 32 & 255);
									return t
								}
								, bytesToHex: function (e) {
									for(var t = [], n = 0; n < e.length; n++) t.push((e[n] >>> 4)
										.toString(16)), t.push((15 & e[n])
										.toString(16));
									return t.join("")
								}
								, hexToBytes: function (e) {
									for(var t = [], n = 0; n < e.length; n += 2) t.push(parseInt(e.substr(n, 2), 16));
									return t
								}
								, bytesToBase64: function (e) {
									for(var n = [], r = 0; r < e.length; r += 3)
										for(var i = e[r] << 16 | e[r + 1] << 8 | e[r + 2], o = 0; o < 4; o++) 8 * r + 6 * o <= 8 * e.length ? n.push(t.charAt(i >>> 6 * (3 - o) & 63)) : n.push("=");
									return n.join("")
								}
								, base64ToBytes: function (e) {
									e = e.replace(/[^A-Z0-9+\/]/gi, "");
									for(var n = [], r = 0, i = 0; r < e.length; i = ++r % 4) 0 != i && n.push((t.indexOf(e.charAt(r - 1)) & Math.pow(2, -2 * i + 8) - 1) << 2 * i | t.indexOf(e.charAt(r)) >>> 6 - 2 * i);
									return n
								}
							};
						e.exports = n
					}()
				}, function (e, t) {
					function n(e) {
						return !!e.constructor && "function" == typeof e.constructor.isBuffer && e.constructor.isBuffer(e)
					}
					e.exports = function (e) {
						return null != e && (n(e) || function (e) {
							return "function" == typeof e.readFloatLE && "function" == typeof e.slice && n(e.slice(0, 0))
						}(e) || !!e._isBuffer)
					}
				}, function (e, t) {
					e.exports = function (e, t, n, r, i, o, a, s, l) {
						this.aiTypes = [{
							id: 0
							, src: "cow_1"
							, killScore: 150
							, health: 500
							, weightM: .8
							, speed: 95e-5
							, turnSpeed: .001
							, scale: 72
							, drop: ["food", 50]
						}, {
							id: 1
							, src: "pig_1"
							, killScore: 200
							, health: 800
							, weightM: .6
							, speed: 85e-5
							, turnSpeed: .001
							, scale: 72
							, drop: ["food", 80]
						}, {
							id: 2
							, name: "Bull"
							, src: "bull_2"
							, hostile: !0
							, dmg: 20
							, killScore: 1e3
							, health: 1800
							, weightM: .5
							, speed: 94e-5
							, turnSpeed: 74e-5
							, scale: 78
							, viewRange: 800
							, chargePlayer: !0
							, drop: ["food", 100]
						}, {
							id: 3
							, name: "Bully"
							, src: "bull_1"
							, hostile: !0
							, dmg: 20
							, killScore: 2e3
							, health: 2800
							, weightM: .45
							, speed: .001
							, turnSpeed: 8e-4
							, scale: 90
							, viewRange: 900
							, chargePlayer: !0
							, drop: ["food", 400]
						}, {
							id: 4
							, name: "Wolf"
							, src: "wolf_1"
							, hostile: !0
							, dmg: 8
							, killScore: 500
							, health: 300
							, weightM: .45
							, speed: .001
							, turnSpeed: .002
							, scale: 84
							, viewRange: 800
							, chargePlayer: !0
							, drop: ["food", 200]
						}, {
							id: 5
							, name: "Quack"
							, src: "chicken_1"
							, dmg: 8
							, killScore: 2e3
							, noTrap: !0
							, health: 300
							, weightM: .2
							, speed: .0018
							, turnSpeed: .006
							, scale: 70
							, drop: ["food", 100]
						}, {
							id: 6
							, name: "MOOSTAFA"
							, nameScale: 50
							, src: "enemy"
							, hostile: !0
							, dontRun: !0
							, fixedSpawn: !0
							, spawnDelay: 6e4
							, noTrap: !0
							, colDmg: 100
							, dmg: 40
							, killScore: 8e3
							, health: 18e3
							, weightM: .4
							, speed: 7e-4
							, turnSpeed: .01
							, scale: 80
							, spriteMlt: 1.8
							, leapForce: .9
							, viewRange: 1e3
							, hitRange: 210
							, hitDelay: 1e3
							, chargePlayer: !0
							, drop: ["food", 100]
						}, {
							id: 7
							, name: "Treasure"
							, hostile: !0
							, nameScale: 35
							, src: "crate_1"
							, fixedSpawn: !0
							, spawnDelay: 12e4
							, colDmg: 200
							, killScore: 5e3
							, health: 2e4
							, weightM: .1
							, speed: 0
							, turnSpeed: 0
							, scale: 70
							, spriteMlt: 1
						}, {
							id: 8
							, name: "MOOFIE"
							, src: "wolf_2"
							, hostile: !0
							, fixedSpawn: !0
							, dontRun: !0
							, hitScare: 4
							, spawnDelay: 3e4
							, noTrap: !0
							, nameScale: 35
							, dmg: 10
							, colDmg: 100
							, killScore: 3e3
							, health: 7e3
							, weightM: .45
							, speed: .0015
							, turnSpeed: .002
							, scale: 90
							, viewRange: 800
							, chargePlayer: !0
							, drop: ["food", 1e3]
						}], this.spawn = function (c, u, f, d) {
							for(var h, p = 0; p < e.length; ++p)
								if(!e[p].active) {
									h = e[p];
									break
								} return h || (h = new t(e.length, i, n, r, a, o, s, l), e.push(h)), h.init(c, u, f, d, this.aiTypes[d]), h
						}
					}
				}, function (e, t) {
					var n = 2 * Math.PI;
					e.exports = function (e, t, r, i, o, a, s, l) {
						this.sid = e, this.isAI = !0, this.nameIndex = o.randInt(0, a.cowNames.length - 1), this.init = function (e, t, n, r, i) {
							this.x = e, this.y = t, this.startX = i.fixedSpawn ? e : null, this.startY = i.fixedSpawn ? t : null, this.xVel = 0, this.yVel = 0, this.zIndex = 0, this.dir = n, this.dirPlus = 0, this.index = r, this.src = i.src, i.name && (this.name = i.name), this.weightM = i.weightM, this.speed = i.speed, this.killScore = i.killScore, this.turnSpeed = i.turnSpeed, this.scale = i.scale, this.maxHealth = i.health, this.leapForce = i.leapForce, this.health = this.maxHealth, this.chargePlayer = i.chargePlayer, this.viewRange = i.viewRange, this.drop = i.drop, this.dmg = i.dmg, this.hostile = i.hostile, this.dontRun = i.dontRun, this.hitRange = i.hitRange, this.hitDelay = i.hitDelay, this.hitScare = i.hitScare, this.spriteMlt = i.spriteMlt, this.nameScale = i.nameScale, this.colDmg = i.colDmg, this.noTrap = i.noTrap, this.spawnDelay = i.spawnDelay, this.hitWait = 0, this.waitCount = 1e3, this.moveCount = 0, this.targetDir = 0, this.active = !0, this.alive = !0, this.runFrom = null, this.chargeTarget = null, this.dmgOverTime = {}
						};
						var c = 0;
						this.update = function (e) {
							if(this.active) {
								if(this.spawnCounter) return this.spawnCounter -= e, void(this.spawnCounter <= 0 && (this.spawnCounter = 0, this.x = this.startX || o.randInt(0, a.mapScale), this.y = this.startY || o.randInt(0, a.mapScale)));
								(c -= e) <= 0 && (this.dmgOverTime.dmg && (this.changeHealth(-this.dmgOverTime.dmg, this.dmgOverTime.doer), this.dmgOverTime.time -= 1, this.dmgOverTime.time <= 0 && (this.dmgOverTime.dmg = 0)), c = 1e3);
								var i = !1
									, s = 1;
								if(!this.zIndex && !this.lockMove && this.y >= a.mapScale / 2 - a.riverWidth / 2 && this.y <= a.mapScale / 2 + a.riverWidth / 2 && (s = .33, this.xVel += a.waterCurrent * e), this.lockMove) this.xVel = 0, this.yVel = 0;
								else if(this.waitCount > 0) {
									if(this.waitCount -= e, this.waitCount <= 0)
										if(this.chargePlayer) {
											for(var u, f, d, h = 0; h < r.length; ++h) !r[h].alive || r[h].skin && r[h].skin.bullRepel || (d = o.getDistance(this.x, this.y, r[h].x, r[h].y)) <= this.viewRange && (!u || d < f) && (f = d, u = r[h]);
											u ? (this.chargeTarget = u, this.moveCount = o.randInt(8e3, 12e3)) : (this.moveCount = o.randInt(1e3, 2e3), this.targetDir = o.randFloat(-Math.PI, Math.PI))
										} else this.moveCount = o.randInt(4e3, 1e4), this.targetDir = o.randFloat(-Math.PI, Math.PI)
								} else if(this.moveCount > 0) {
									var p = this.speed * s;
									if(this.runFrom && this.runFrom.active && (!this.runFrom.isPlayer || this.runFrom.alive) ? (this.targetDir = o.getDirection(this.x, this.y, this.runFrom.x, this.runFrom.y), p *= 1.42) : this.chargeTarget && this.chargeTarget.alive && (this.targetDir = o.getDirection(this.chargeTarget.x, this.chargeTarget.y, this.x, this.y), p *= 1.75, i = !0), this.hitWait && (p *= .3), this.dir != this.targetDir) {
										this.dir %= n;
										var A = (this.dir - this.targetDir + n) % n
											, g = Math.min(Math.abs(A - n), A, this.turnSpeed * e)
											, m = A - Math.PI >= 0 ? 1 : -1;
										this.dir += m * g + n
									}
									this.dir %= n, this.xVel += p * e * Math.cos(this.dir), this.yVel += p * e * Math.sin(this.dir), this.moveCount -= e, this.moveCount <= 0 && (this.runFrom = null, this.chargeTarget = null, this.waitCount = this.hostile ? 1500 : o.randInt(1500, 6e3))
								}
								this.zIndex = 0, this.lockMove = !1;
								var y = o.getDistance(0, 0, this.xVel * e, this.yVel * e)
									, w = Math.min(4, Math.max(1, Math.round(y / 40)))
									, v = 1 / w;
								for(h = 0; h < w; ++h) {
									this.xVel && (this.x += this.xVel * e * v), this.yVel && (this.y += this.yVel * e * v), I = t.getGridArrays(this.x, this.y, this.scale);
									for(var b = 0; b < I.length; ++b)
										for(var x = 0; x < I[b].length; ++x) I[b][x].active && t.checkCollision(this, I[b][x], v)
								}
								var B, E, k, C = !1;
								if(this.hitWait > 0 && (this.hitWait -= e, this.hitWait <= 0)) {
									C = !0, this.hitWait = 0, this.leapForce && !o.randInt(0, 2) && (this.xVel += this.leapForce * Math.cos(this.dir), this.yVel += this.leapForce * Math.sin(this.dir));
									for(var I = t.getGridArrays(this.x, this.y, this.hitRange), T = 0; T < I.length; ++T)
										for(b = 0; b < I[T].length; ++b)(B = I[T][b])
											.health && (E = o.getDistance(this.x, this.y, B.x, B.y)) < B.scale + this.hitRange && (B.changeHealth(5 * -this.dmg) && t.disableObj(B), t.hitObj(B, o.getDirection(this.x, this.y, B.x, B.y)));
									for(b = 0; b < r.length; ++b) r[b].canSee(this) && l.send(r[b].id, "aa", this.sid)
								}
								if(i || C)
									for(h = 0; h < r.length; ++h)(B = r[h]) && B.alive && (E = o.getDistance(this.x, this.y, B.x, B.y), this.hitRange ? !this.hitWait && E <= this.hitRange + B.scale && (C ? (k = o.getDirection(B.x, B.y, this.x, this.y), B.changeHealth(-this.dmg), B.xVel += .6 * Math.cos(k), B.yVel += .6 * Math.sin(k), this.runFrom = null, this.chargeTarget = null, this.waitCount = 3e3, this.hitWait = o.randInt(0, 2) ? 0 : 600) : this.hitWait = this.hitDelay) : E <= this.scale + B.scale && (k = o.getDirection(B.x, B.y, this.x, this.y), B.changeHealth(-this.dmg), B.xVel += .55 * Math.cos(k), B.yVel += .55 * Math.sin(k)));
								this.xVel && (this.xVel *= Math.pow(a.playerDecel, e)), this.yVel && (this.yVel *= Math.pow(a.playerDecel, e));
								var M = this.scale;
								this.x - M < 0 ? (this.x = M, this.xVel = 0) : this.x + M > a.mapScale && (this.x = a.mapScale - M, this.xVel = 0), this.y - M < 0 ? (this.y = M, this.yVel = 0) : this.y + M > a.mapScale && (this.y = a.mapScale - M, this.yVel = 0)
							}
						}, this.canSee = function (e) {
							if(!e) return !1;
							if(e.skin && e.skin.invisTimer && e.noMovTimer >= e.skin.invisTimer) return !1;
							var t = Math.abs(e.x - this.x) - e.scale
								, n = Math.abs(e.y - this.y) - e.scale;
							return t <= a.maxScreenWidth / 2 * 1.3 && n <= a.maxScreenHeight / 2 * 1.3
						};
						var u = 0
							, f = 0;
						this.animate = function (e) {
							this.animTime > 0 && (this.animTime -= e, this.animTime <= 0 ? (this.animTime = 0, this.dirPlus = 0, u = 0, f = 0) : 0 == f ? (u += e / (this.animSpeed * a.hitReturnRatio), this.dirPlus = o.lerp(0, this.targetAngle, Math.min(1, u)), u >= 1 && (u = 1, f = 1)) : (u -= e / (this.animSpeed * (1 - a.hitReturnRatio)), this.dirPlus = o.lerp(0, this.targetAngle, Math.max(0, u))))
						}, this.startAnim = function () {
							this.animTime = this.animSpeed = 600, this.targetAngle = .8 * Math.PI, u = 0, f = 0
						}, this.changeHealth = function (e, t, n) {
							if(this.active && (this.health += e, n && (this.hitScare && !o.randInt(0, this.hitScare) ? (this.runFrom = n, this.waitCount = 0, this.moveCount = 2e3) : this.hostile && this.chargePlayer && n.isPlayer ? (this.chargeTarget = n, this.waitCount = 0, this.moveCount = 8e3) : this.dontRun || (this.runFrom = n, this.waitCount = 0, this.moveCount = 2e3)), e < 0 && this.hitRange && o.randInt(0, 1) && (this.hitWait = 500), t && t.canSee(this) && e < 0 && l.send(t.id, "t", Math.round(this.x), Math.round(this.y), Math.round(-e), 1), this.health <= 0 && (this.spawnDelay ? (this.spawnCounter = this.spawnDelay, this.x = -1e6, this.y = -1e6) : (this.x = this.startX || o.randInt(0, a.mapScale), this.y = this.startY || o.randInt(0, a.mapScale)), this.health = this.maxHealth, this.runFrom = null, t && (s(t, this.killScore), this.drop))))
								for(var r = 0; r < this.drop.length;) t.addResource(a.resourceTypes.indexOf(this.drop[r]), this.drop[r + 1]), r += 2
						}
					}
				}]);
			let ge = (...e) => {
				let t = e;
				t[0] == Ve.hat && !t[0] || t[0] == Ve.accessory && t[1] || (storeBuy(...e), t[1] ? (ae(["13c", [0, 0, 1]]), ae(["13c", [0, t[0], 1]])) : ae(["13c", [0, t[0], 0]]))
			};

			function e(e) {
				return null !== e.offsetParent
			}
			unsafeWindow.storeEquip = ge, storeEquip = ge;
			try {
				document.getElementById("moomooio_728x90_home")
					.style.display = "none", $("#moomooio_728x90_home")
					.parent()
					.css({
						display: "none"
					});
				try {
					window.admob = {
						requestInterstitialAd: () => {}
						, showInterstitialAd: () => {}
					}
				} catch (e) {
					console.warn(e)
				}
			} catch (e) {
				console.log("Failed, " + e)
			}
			$("#adCard")
				.remove(), document.onload = setTimeout(function () {
					"Loading" == reloadModule.loadState && document.querySelector("#ot-sdk-btn-floating") && (reloadModule.loadState = "Disconnected")
				}, 7400), window.reloadModule = class {
					static loadStateGetter() {
						"Reloading" != reloadModule.loadState && (document.querySelector("#loadingText")
							.innerText.includes("Loading") ? document.querySelector("#partyButton")
							.innerText.length > 1 && (reloadModule.loadState = "Done") : document.querySelector("#loadingText")
							.innerText.includes("disconnected") && (reloadModule.loadState = "Disconnected"), "Disconnected" == reloadModule.loadState && (location.reload(), reloadModule.loadState = "Reloading"), window.requestAnimationFrame(reloadModule.loadStateGetter))
					}
				}, reloadModule.reloadState = "Loading", window.requestAnimationFrame(reloadModule.loadStateGetter), $("#gameCanvas")
				.css("cursor", "auto"), $("#guideCard")
				.css({
					"max-height": "350px"
					, width: "320px"
					, "overflow-y": "scroll"
					, "-webkit-overflow-scrolling": "touch"
				}), document.getElementById("mainMenu")
				.style.backgroundImage = "url('http://surviv.io/img/main_splash.png')";
			async function t(e) {
				return new Promise((t, n) => {
					setTimeout(() => {
						t()
					}, e)
				})
			}
			unsafeWindow.trace_a = function () {
				unsafeWindow.tr(Ve.x, Ve.y)
			}, unsafeWindow.cleartr = function () {
				unsafeWindow.cleartracers()
			};
			setInterval(async () => {
					e(document.getElementById("enterGame")) && document.getElementById("autospawn")
						.checked && ae(["sp", [{
							name: "cc"
							, moofoll: !0
							, skin: "constructor"
						}]])
				}, 112.5), $("#chatBox")
				.css({
					width: "300px"
				}), document.getElementById("storeHolder")
				.style = "height: 1500px; width: 450px;";
			const me = $("#pingDisplay");
			me.css("top", "3px"), me.css("display", "block"), $("body")
				.append(me), document.generateFixedClan = (() => {
					ae(["8", [document.getElementById("fixedClanCreationValue")
						.value
					]])
				});
			const ye = [{
					id: 45
					, name: "Shame!"
					, dontSell: !0
					, price: 0
					, scale: 120
					, desc: "hacks are for losers"
				}, {
					id: 51
					, name: "Moo Cap"
					, price: 0
					, scale: 120
					, desc: "coolest mooer around"
				}, {
					id: 50
					, name: "Apple Cap"
					, price: 0
					, scale: 120
					, desc: "apple farms remembers"
				}, {
					id: 28
					, name: "Moo Head"
					, price: 0
					, scale: 120
					, desc: "no effect"
				}, {
					id: 29
					, name: "Pig Head"
					, price: 0
					, scale: 120
					, desc: "no effect"
				}, {
					id: 30
					, name: "Fluff Head"
					, price: 0
					, scale: 120
					, desc: "no effect"
				}, {
					id: 36
					, name: "Pandou Head"
					, price: 0
					, scale: 120
					, desc: "no effect"
				}, {
					id: 37
					, name: "Bear Head"
					, price: 0
					, scale: 120
					, desc: "no effect"
				}, {
					id: 38
					, name: "Monkey Head"
					, price: 0
					, scale: 120
					, desc: "no effect"
				}, {
					id: 44
					, name: "Polar Head"
					, price: 0
					, scale: 120
					, desc: "no effect"
				}, {
					id: 35
					, name: "Fez Hat"
					, price: 0
					, scale: 120
					, desc: "no effect"
				}, {
					id: 42
					, name: "Enigma Hat"
					, price: 0
					, scale: 120
					, desc: "join the enigma army"
				}, {
					id: 43
					, name: "Blitz Hat"
					, price: 0
					, scale: 120
					, desc: "hey everybody i'm blitz"
				}, {
					id: 49
					, name: "Bob XIII Hat"
					, price: 0
					, scale: 120
					, desc: "like and subscribe"
				}, {
					id: 57
					, name: "Pumpkin"
					, price: 50
					, scale: 120
					, desc: "Spooooky"
				}, {
					id: 8
					, name: "Bummle Hat"
					, price: 100
					, scale: 120
					, desc: "no effect"
				}, {
					id: 2
					, name: "Straw Hat"
					, price: 500
					, scale: 120
					, desc: "no effect"
				}, {
					id: 15
					, name: "Winter Cap"
					, price: 600
					, scale: 120
					, desc: "allows you to move at normal speed in snow"
					, coldM: 1
				}, {
					id: 5
					, name: "Cowboy Hat"
					, price: 1e3
					, scale: 120
					, desc: "no effect"
				}, {
					id: 4
					, name: "Ranger Hat"
					, price: 2e3
					, scale: 120
					, desc: "no effect"
				}, {
					id: 18
					, name: "Explorer Hat"
					, price: 2e3
					, scale: 120
					, desc: "no effect"
				}, {
					id: 31
					, name: "Flipper Hat"
					, price: 2500
					, scale: 120
					, desc: "have more control while in water"
					, watrImm: !0
				}, {
					id: 1
					, name: "Marksman Cap"
					, price: 3e3
					, scale: 120
					, desc: "increases arrow speed and range"
					, aMlt: 1.3
				}, {
					id: 10
					, name: "Bush Gear"
					, price: 3e3
					, scale: 160
					, desc: "allows you to disguise yourself as a bush"
				}, {
					id: 48
					, name: "Halo"
					, price: 3e3
					, scale: 120
					, desc: "no effect"
				}, {
					id: 6
					, name: "Soldier Helmet"
					, price: 4e3
					, scale: 120
					, desc: "reduces damage taken but slows movement"
					, spdMult: .94
					, dmgMult: .75
				}, {
					id: 23
					, name: "Anti Venom Gear"
					, price: 4e3
					, scale: 120
					, desc: "makes you immune to poison"
					, poisonRes: 1
				}, {
					id: 13
					, name: "Medic Gear"
					, price: 5e3
					, scale: 110
					, desc: "slowly regenerates health over time"
					, healthRegen: 3
				}, {
					id: 9
					, name: "Miners Helmet"
					, price: 5e3
					, scale: 120
					, desc: "earn 1 extra gold per resource"
					, extraGold: 1
				}, {
					id: 32
					, name: "Musketeer Hat"
					, price: 5e3
					, scale: 120
					, desc: "reduces cost of projectiles"
					, projCost: .5
				}, {
					id: 7
					, name: "Bull Helmet"
					, price: 6e3
					, scale: 120
					, desc: "increases damage done but drains health"
					, healthRegen: -5
					, dmgMultO: 1.5
					, spdMult: .96
				}, {
					id: 22
					, name: "Emp Helmet"
					, price: 6e3
					, scale: 120
					, desc: "turrets won't attack but you move slower"
					, antiTurret: 1
					, spdMult: .7
				}, {
					id: 12
					, name: "Booster Hat"
					, price: 6e3
					, scale: 120
					, desc: "increases your movement speed"
					, spdMult: 1.16
				}, {
					id: 26
					, name: "Barbarian Armor"
					, price: 8e3
					, scale: 120
					, desc: "knocks back enemies that attack you"
					, dmgK: .6
				}, {
					id: 21
					, name: "Plague Mask"
					, price: 1e4
					, scale: 120
					, desc: "melee attacks deal poison damage"
					, poisonDmg: 5
					, poisonTime: 6
				}, {
					id: 46
					, name: "Bull Mask"
					, price: 1e4
					, scale: 120
					, desc: "bulls won't target you unless you attack them"
					, bullRepel: 1
				}, {
					id: 14
					, name: "Windmill Hat"
					, topSprite: !0
					, price: 1e4
					, scale: 120
					, desc: "generates points while worn"
					, pps: 1.5
				}, {
					id: 11
					, name: "Spike Gear"
					, topSprite: !0
					, price: 1e4
					, scale: 120
					, desc: "deal damage to players that damage you"
					, dmg: .45
				}, {
					id: 53
					, name: "Turret Gear"
					, topSprite: !0
					, price: 1e4
					, scale: 120
					, desc: "you become a walking turret"
					, turret: {
						proj: 1
						, range: 700
						, rate: 2500
					}
					, spdMult: .7
				}, {
					id: 20
					, name: "Samurai Armor"
					, price: 12e3
					, scale: 120
					, desc: "increased attack speed and fire rate"
					, atkSpd: .78
				}, {
					id: 58
					, name: "Dark Knight"
					, price: 12e3
					, scale: 120
					, desc: "restores health when you deal damage"
					, healD: .4
				}, {
					id: 27
					, name: "Scavenger Gear"
					, price: 15e3
					, scale: 120
					, desc: "earn double points for each kill"
					, kScrM: 2
				}, {
					id: 40
					, name: "Tank Gear"
					, price: 15e3
					, scale: 120
					, desc: "increased damage to buildings but slower movement"
					, spdMult: .3
					, bDmg: 3.3
				}, {
					id: 52
					, name: "Thief Gear"
					, price: 15e3
					, scale: 120
					, desc: "steal half of a players gold when you kill them"
					, goldSteal: .5
				}, {
					id: 55
					, name: "Bloodthirster"
					, price: 2e4
					, scale: 120
					, desc: "Restore Health when dealing damage. And increased damage"
					, healD: .25
					, dmgMultO: 1.2
				}, {
					id: 56
					, name: "Assassin Gear"
					, price: 2e4
					, scale: 120
					, desc: "Go invisible when not moving. Can't eat. Increased speed"
					, noEat: !0
					, spdMult: 1.1
					, invisTimer: 1e3
				}]
				, we = [{
					id: 12
					, name: "Snowball"
					, price: 1e3
					, scale: 105
					, xOff: 18
					, desc: "no effect"
				}, {
					id: 9
					, name: "Tree Cape"
					, price: 1e3
					, scale: 90
					, desc: "no effect"
				}, {
					id: 10
					, name: "Stone Cape"
					, price: 1e3
					, scale: 90
					, desc: "no effect"
				}, {
					id: 3
					, name: "Cookie Cape"
					, price: 1500
					, scale: 90
					, desc: "no effect"
				}, {
					id: 8
					, name: "Cow Cape"
					, price: 2e3
					, scale: 90
					, desc: "no effect"
				}, {
					id: 11
					, name: "Monkey Tail"
					, price: 2e3
					, scale: 97
					, xOff: 25
					, desc: "Super speed but reduced damage"
					, spdMult: 1.35
					, dmgMultO: .2
				}, {
					id: 17
					, name: "Apple Basket"
					, price: 3e3
					, scale: 80
					, xOff: 12
					, desc: "slowly regenerates health over time"
					, healthRegen: 1
				}, {
					id: 6
					, name: "Winter Cape"
					, price: 3e3
					, scale: 90
					, desc: "no effect"
				}, {
					id: 4
					, name: "Skull Cape"
					, price: 4e3
					, scale: 90
					, desc: "no effect"
				}, {
					id: 5
					, name: "Dash Cape"
					, price: 5e3
					, scale: 90
					, desc: "no effect"
				}, {
					id: 2
					, name: "Dragon Cape"
					, price: 6e3
					, scale: 90
					, desc: "no effect"
				}, {
					id: 1
					, name: "Super Cape"
					, price: 8e3
					, scale: 90
					, desc: "no effect"
				}, {
					id: 7
					, name: "Troll Cape"
					, price: 8e3
					, scale: 90
					, desc: "no effect"
				}, {
					id: 14
					, name: "Thorns"
					, price: 1e4
					, scale: 115
					, xOff: 20
					, desc: "no effect"
				}, {
					id: 15
					, name: "Blockades"
					, price: 1e4
					, scale: 95
					, xOff: 15
					, desc: "no effect"
				}, {
					id: 20
					, name: "Devils Tail"
					, price: 1e4
					, scale: 95
					, xOff: 20
					, desc: "no effect"
				}, {
					id: 16
					, name: "Sawblade"
					, price: 12e3
					, scale: 90
					, spin: !0
					, xOff: 0
					, desc: "deal damage to players that damage you"
					, dmg: .15
				}, {
					id: 13
					, name: "Angel Wings"
					, price: 15e3
					, scale: 138
					, xOff: 22
					, desc: "slowly regenerates health over time"
					, healthRegen: 3
				}, {
					id: 19
					, name: "Shadow Wings"
					, price: 15e3
					, scale: 138
					, xOff: 22
					, desc: "increased movement speed"
					, spdMult: 1.1
				}, {
					id: 18
					, name: "Blood Wings"
					, price: 2e4
					, scale: 178
					, xOff: 26
					, desc: "restores health when you deal damage"
					, healD: .2
				}, {
					id: 21
					, name: "Corrupt X Wings"
					, price: 2e4
					, scale: 178
					, xOff: 26
					, desc: "deal damage to players that damage you"
					, dmg: .25
				}];
			let ve = 0;
			document.opcToggle = function () {
				global_functions_exporter.enableNames = !global_functions_exporter.enableNames, ve = ve ? 0 : 1, $("#leaderboard")
					.animate({
						opacity: ve
					}), $("#scoreDisplay")
					.animate({
						opacity: ve
					}), $("#partyButton")
					.animate({
						opacity: ve
					})
			};
			let be = 0;
			document.clanListToggle = (() => {
					be = be ? 0 : 1, $("#clanList")
						.animate({
							opacity: be
						})
				}), $("#leaderboard")
				.animate({
					opacity: 0
				}), $("#scoreDisplay")
				.animate({
					opacity: 0
				}), $("#partyButton")
				.animate({
					opacity: 0
				}), global_functions_exporter.enableNames = !1;
			var n = [{
				isInvis: !0
				, id: "__proto__"
				, age: 0
				, name: "undefined"
				, desc: "undefined"
				, src: "undefined"
				, gather: 1
				, isMelee: !0
				, damage: 0
				, cd: 0
				, range: 142
				, type: -1
			}, {
				isInvis: !0
				, id: "length"
				, age: 0
				, name: "undefined"
				, desc: "undefined"
				, src: "undefined"
				, gather: 1
				, isMelee: !0
				, damage: 0
				, cd: 0
				, range: 142
				, type: -1
			}, {
				id: 0
				, type: 0
				, age: 1
				, name: "tool hammer"
				, desc: "tool for gathering all resources"
				, src: "hammer_1"
				, length: 140
				, width: 140
				, xOff: -3
				, yOff: 18
				, dmg: 25
				, range: 65
				, gather: 1
				, speed: 300
				, isMelee: !0
				, damage: 25
				, cd: 3
			}, {
				id: 1
				, type: 0
				, age: 2
				, name: "hand axe"
				, desc: "gathers resources at a higher rate"
				, src: "axe_1"
				, length: 140
				, width: 140
				, xOff: 3
				, yOff: 24
				, dmg: 30
				, spdMult: 1
				, range: 70
				, gather: 2
				, speed: 400
				, isMelee: !0
				, damage: 30
				, cd: 4
			}, {
				id: 2
				, type: 0
				, age: 8
				, pre: 1
				, name: "great axe"
				, desc: "deal more damage and gather more resources"
				, src: "great_axe_1"
				, length: 140
				, width: 140
				, xOff: -8
				, yOff: 25
				, dmg: 35
				, spdMult: 1
				, range: 75
				, gather: 4
				, speed: 400
				, isMelee: !0
				, damage: 35
				, cd: 4
			}, {
				id: 3
				, type: 0
				, age: 2
				, name: "short sword"
				, desc: "increased attack power but slower move speed"
				, src: "sword_1"
				, iPad: 1.3
				, length: 130
				, width: 210
				, xOff: -8
				, yOff: 46
				, dmg: 35
				, spdMult: .85
				, range: 110
				, gather: 1
				, speed: 300
				, isMelee: !0
				, damage: 35
				, cd: 3
			}, {
				id: 4
				, type: 0
				, age: 8
				, pre: 3
				, name: "katana"
				, desc: "greater range and damage"
				, src: "samurai_1"
				, iPad: 1.3
				, length: 130
				, width: 210
				, xOff: -8
				, yOff: 59
				, dmg: 40
				, spdMult: .8
				, range: 118
				, gather: 1
				, speed: 300
				, isMelee: !0
				, damage: 40
				, cd: 3
			}, {
				id: 5
				, type: 0
				, age: 2
				, name: "polearm"
				, desc: "long range melee weapon"
				, src: "spear_1"
				, iPad: 1.3
				, length: 130
				, width: 210
				, xOff: -8
				, yOff: 53
				, dmg: 45
				, knock: .2
				, spdMult: .82
				, range: 142
				, gather: 1
				, speed: 700
				, isMelee: !0
				, damage: 45
				, cd: 7
			}, {
				id: 6
				, type: 0
				, age: 2
				, name: "bat"
				, desc: "fast long range melee weapon"
				, src: "bat_1"
				, iPad: 1.3
				, length: 110
				, width: 180
				, xOff: -8
				, yOff: 53
				, dmg: 20
				, knock: .7
				, range: 110
				, gather: 1
				, speed: 300
				, isMelee: !0
				, damage: 20
				, cd: 3
			}, {
				id: 7
				, type: 0
				, age: 2
				, name: "daggers"
				, desc: "really fast short range weapon"
				, src: "dagger_1"
				, iPad: .8
				, length: 110
				, width: 110
				, xOff: 18
				, yOff: 0
				, dmg: 20
				, knock: .1
				, range: 65
				, gather: 1
				, hitSlow: .1
				, spdMult: 1.13
				, speed: 100
				, isMelee: !0
				, damage: 20
				, cd: 1
			}, {
				id: 8
				, type: 0
				, age: 2
				, name: "stick"
				, desc: "great for gathering but very weak"
				, src: "stick_1"
				, length: 140
				, width: 140
				, xOff: 3
				, yOff: 24
				, dmg: 1
				, spdMult: 1
				, range: 70
				, gather: 7
				, speed: 400
				, isMelee: !0
				, damage: 1
				, cd: 4
			}, {
				id: 9
				, type: 1
				, age: 6
				, name: "hunting bow"
				, desc: "bow used for ranged combat and hunting"
				, src: "bow_1"
				, req: ["wood", 4]
				, length: 120
				, width: 120
				, xOff: -6
				, yOff: 0
				, projectile: 0
				, spdMult: .75
				, speed: 600
				, isMelee: !1
				, damage: 25
				, cd: 6
			}, {
				id: 10
				, type: 1
				, age: 6
				, name: "great hammer"
				, desc: "hammer used for destroying structures"
				, src: "great_hammer_1"
				, length: 140
				, width: 140
				, xOff: -9
				, yOff: 25
				, dmg: 10
				, spdMult: .88
				, range: 75
				, sDmg: 7.5
				, gather: 1
				, speed: 400
				, isMelee: !0
				, damage: 10
				, cd: 4
			}, {
				id: 11
				, type: 1
				, age: 6
				, name: "wooden shield"
				, desc: "blocks projectiles and reduces melee damage"
				, src: "shield_1"
				, length: 120
				, width: 120
				, shield: .2
				, xOff: 6
				, yOff: 0
				, spdMult: .7
				, range: 150
				, damage: 0
			}, {
				id: 12
				, type: 1
				, age: 8
				, pre: 9
				, name: "crossbow"
				, desc: "deals more damage and has greater range"
				, src: "crossbow_1"
				, req: ["wood", 5]
				, aboveHand: !0
				, armS: .75
				, length: 120
				, width: 120
				, xOff: -4
				, yOff: 0
				, projectile: 2
				, spdMult: .7
				, speed: 700
				, isMelee: !1
				, damage: 35
				, cd: 7
			}, {
				id: 13
				, type: 1
				, age: 9
				, pre: 12
				, name: "repeater crossbow"
				, desc: "high firerate crossbow with reduced damage"
				, src: "crossbow_2"
				, req: ["wood", 10]
				, aboveHand: !0
				, armS: .75
				, length: 120
				, width: 120
				, xOff: -4
				, yOff: 0
				, projectile: 3
				, spdMult: .7
				, speed: 230
				, isMelee: !1
				, damage: 30
				, cd: 3
			}, {
				id: 14
				, type: 1
				, age: 6
				, name: "mc grabby"
				, desc: "steals resources from enemies"
				, src: "grab_1"
				, length: 130
				, width: 210
				, xOff: -8
				, yOff: 53
				, dmg: 0
				, steal: 250
				, knock: .2
				, spdMult: 1.05
				, range: 125
				, gather: 0
				, speed: 700
				, isMelee: !0
				, damage: 0
				, cd: 7
			}, {
				id: 15
				, type: 1
				, age: 9
				, pre: 12
				, name: "musket"
				, desc: "slow firerate but high damage and range"
				, src: "musket_1"
				, req: ["stone", 10]
				, aboveHand: !0
				, rec: .35
				, armS: .6
				, hndS: .3
				, hndD: 1.6
				, length: 205
				, width: 205
				, xOff: 25
				, yOff: 0
				, projectile: 5
				, hideProjectile: !0
				, spdMult: .6
				, speed: 1500
				, isMelee: !1
				, damage: 50
				, cd: 14
				, rec: .35
			}];
			let xe, Be, Ee, ke;
			unsafeWindow.globalWeaponsList = n, setInterval(() => {
					document.getElementById("autoBuyHats")
						.checked && (storeBuy(21, !0), storeBuy(18, !0), storeBuy(19, !0), storeBuy(13, !0), storeBuy(11, !0), storeBuy(40), storeBuy(52), storeBuy(20), storeBuy(53), storeBuy(11), storeBuy(7), storeBuy(12), storeBuy(22), storeBuy(13), storeBuy(6), storeBuy(31), storeBuy(15), storeBuy(21))
				}, 700), $("body")
				.append('<div id="modMenus" style="display: block;\npadding: 10px;\nborder-radius: 15px;\nbackground-color: rgba(0, 0, 0, 0.25);\nborder-radius: 3px;\nposition: absolute;\nleft: 20px;\ntop: 20px;\nmin-width: 300px;\nmax-width: 450px;\nmin-height: 400;\nmax-height 700;"></div>'), $("#mainMenu")
				.css({
					"overflow-y": "scroll"
				}), $("#modMenus")
				.append('<div id="helpText" style="font-size: 30px;color: rgb(255, 255, 255);">\nMagick: <br>\n<script>\nfunction hideUI() { document.getElementById(\'gameUI\').style.display = "none"; };\nfunction showUI() { document.getElementById(\'gameUI\').style.display = "block"; };\nfunction toggle2() {\n    $("#dataDisplayer").toggle();\n};\n<\/script>\n<div style="font-size: 12px; overflow-y: scroll; max-height: 150px;">\n\n<button onclick="(()=>{document.clanListToggle(), document.opcToggle()})()">Toggle Names</button><br><br>\n\nEnable Data Display? <button onclick="toggle2()" id="toggleHackUI2">Toggle Data Displays</button><br><br>\n\nMirror nearest enemy chat? <input type="checkbox" id="mirrorChat"><br>\n\nAuto Instakill? <input type="checkbox" id="autoInsta"><br>\n\nAuto-Pits? <input type="checkbox" id="autoPits"><br>\n\nAuto-Invis Hand? <input type="checkbox" id="autoInvisHand" checked><br>\n\nAuto-Blocker? <input type="checkbox" id="autoBlocker"><br>\n\nAuto-Buy Hats? <input type="checkbox" id="autoBuyHats"><br>\n\nAutoQ? <input type="checkbox" id="autoqCheckbox"><br>\n\nAuto-Fix Reload (if you accidentally switch during reload) <input type="checkbox" id="reloadFixer" checked><br>\n\nAuto-Theif on insta? <input type="checkbox" id="autoTheif" checked><br>\n\nAuto-EMP hat? <input type="checkbox" id="autoemp"><br>\n\nAutoSoldier? <input type="checkbox" id="autosoldier" checked><br><br>\n\nAuto-Antibull? <input type="checkbox" id="autoAntibull" checked><br>\n\nAutosoldier in River? <input type="checkbox" id="riverDefense"><br>\n\nAutoheal x Extreme Anti-Insta: <b>ALWAYS ON</b><br>\n\nAuto-Disconnect on Clown? <input type="checkbox" id="autoDisconnect"><br>\n\nAutospawn? <input type="checkbox" id="autospawn" checked><br>\n\nAuto Wolf Blocking (places a trap to block a wolf when it hits you)? <input type="checkbox" id="wolfBlock" checked><br>\n\nAnti-Boost Spike? <input type="checkbox" id="antiBoostSpike" checked><br>\n\nAnti-Dagger? <input type="checkbox" id="antiDagger" checked><br>\n\nAnti-invisible buildings? <input type="checkbox" id="fixInvisBuildings" checked><br>\n\n(use invis builds) Xv1 Mode? <input type="checkbox" id="xv1mode"><br>\n\nOne-Tick Insta? <input type="checkbox" id="doOneTickShot" checked><br>\n\n<br>\n\nSpike hotkey: <input type="text" id="spikeHotkeyValue" value="v" maxlength="1"><br>\nTrap / Boost hotkey: <input type="text" id="trapHotkeyValue" value="f" maxlength="1"><br>\nHealing hotkey: <input type="text" id="healingHotkeyValue" value="q" maxlength="1"><br>\nInstakill hotkey: <input type="text" id="instaHotkeyValue" value="r" maxlength="1"><br>\n3x teleporter hotkey: <input type="text" id="tripleTeleporterValue" value="h" maxlength="1"><br>\n3x compact windmills hotkey: <input type="text" id="tripleMillHotkeyValue" value="b" maxlength="1"><br>\n\n<br>\n\nAim Boost-Spike At Nearest Enemy? <input type="checkbox" id="aimBoostSpikeAtPlayer"><br>\nAuto-Boost Spike: space key (State: <b id="autoBoostSpikerStateMenu"></b>)<br>\n<label for="BSPIKEobjectTypeSel">Choose an object for the boost item placer:</label>\n<select name="BSPIKEobjectTypeSel" id="BSPIKEobjectTypeSel">\n<option value="millType">Windmills</option>\n<option value="mineType">Mines</option>\n<option value="spikeType">Spikes</option>\n<option value="spawnpadType">Spawnpad Type</option>\n<option value="turretType">Turret Type</option>\n<option value="boostType">Boost Type</option>\n<option value="wallType">Wall Type</option>\n</select><br><br>\n\nHeal Throttle (tune up if heal is clowning you): <br>\n<input type="range" min="1" max="200" value="0" id="healThrottleValue"><br>\nValue: <text id="healThrottleDisplay"></text><br><br>\n\nInclude dagger insta in dynamic insta? <input type="checkbox" id="supportDynamicDaggerInsta" checked><br>\n\nInclude Spike Insta in Dynamic Insta? <input type="checkbox" id="spikeInstaIncludedInDynamicInsta" checked><br>\n\n<br>(check enemy hats and your weapons to see if you can spike insta w/ damage math) Smart spike insta? <input type="checkbox" id="nearestEnemyCantSurviveCheck" checked><br>\n\nInclude weapon variant in spike insta damage calculation? <input type="checkbox" id="includeWeaponVariantInSpikeInsta" checked><br>\n\nClicks per millisecond for Macros: <input type="text" id="cpsForMacros" value="1"> (keep at 1-2)<br>\n\nMake your insta tick based? <input type="checkbox" id="instaTickBased" checked> (if enabled, your insta will account for lag. If there\'s too much lag, it will be too slow. Falls back to millisecond timeouts if disabled)<br>\n\nMake Boost / Trap Hotkey Quad? <input type="checkbox" id="boostQuadMode" checked> (either single or four)<br>\n\nAutochat When Near Enemy? <input type="checkbox" id="achatEnemy" checked=checked><br>\n\nChat this when "autochat near enemy" is enabled: <input type="text" id="achatEnemyVal" placeholder="Within Range"><br>\n\nBiome Hats (winter cap for arctic, booster for normal, etc.)? <input type="checkbox" id="bioHats" checked=checked><br>\n\nStop Instakill When Target Uses Shield? <input type="checkbox" id="blockInsta" checked=checked> (Doesn\'t affect instakill hotkey, only auto-instakill)<br>\n\nChat on Instakill? <input type="checkbox" id="instaChat"><br>\n\nChat <input type="text" id="instaChatData"> on instakill (If enabled)<br>\n\nTribe instakill? <input type="checkbox" id="instKillTribe"><br>\n\nCreate Clan: <input type="text" id="fixedClanCreationValue" placeholder="clan"><button onclick="document.generateFixedClan();">Create Clan</button><br><br>\n\nChat on insta flagging / autoq flagger? <input type="checkbox" id="flaggerChat" checked><br>\n\n<button onclick="hideUI()">Hide UI</button><br>\n\n<button onclick="showUI()">Show UI</button><br>\n\n<br>\n\n<button onclick="window.trace_a()">Set Tracer</button><br>\n\n<button onclick="window.cleartr()">Clear Tracers</button><br>\n\n<br>Logs: <br><div id="log" style="overflow-y: scroll; max-height: 50px;"></div>\n\n</div>\n'), $("#modMenu")
				.show(), $("#gameUI")
				.prepend('\n<div id= "hackMenu2">\n<style>\n.bottomright {\nposition: absolute;\nbottom: 8px;\nright: 16px;\nfont-size: 18px;\n}\n<style>\n</div>\n'), document.getElementById("healThrottleValue")
				.oninput = function () {
					document.getElementById("healThrottleDisplay")
						.innerHTML = this.value
				};
			let Ce = !1
				, Ie = fe(() => {
					global_functions_exporter.cursorDisable = !0, ae(["2", [f]])
				});

			function r() {
				!document.getElementById("autoInvisHand")
					.checked || e(document.getElementById("actionBarItem0")) || e(document.getElementById("actionBarItem7")) || ae(["5", ["__proto__", !0]])
			}

			function i() {
				ae(["5", [d, !0]])
			}

			function o(e = Ve, t = (0 != e.xvel || 0 != e.yvel ? Math.atan2(e.yvel, e.xvel) : null), r = e.weapon, i = e.hat, o = e.accessory, a = e.object, s) {
				let l = e.x
					, c = e.y
					, u = e.sxvel ? e.sxvel : 0
					, f = e.syvel ? e.syvel : 0
					, d = null !== t ? Math.cos(t) : 0
					, h = null !== t ? Math.sin(t) : 0
					, p = Math.hypot(d, h);
				0 != p && (d /= p, h /= p);
				let A = we.find(e => e.id == o)
					, g = ye.find(e => e.id == i)
					, m = n.find(e => e.id == r)
					, y = (a >= 0 ? .5 : 1) * (11 == o && A.spdMult || 1) * (i && g.spdMult || 1) * (m.spdMult || 1);
				c > 6850 && c < 7550 && (i && g.watrImm ? (y *= .75, u += .0495) : (y *= .33, u += .0011 * 112.5)), d && (u += .0016 * d * y * 112.5), h && (f += .0016 * h * y * 112.5);
				let w = 1 / Math.min(4, Math.max(1, Math.round(Math.cos((112.5 * u) ** 2 + (112.5 * f) ** 2) / 40)))
					, v = 112.5 * u * w
					, b = 112.5 * f * w;
				return u && (l += v, (u *= .993 ** 112.5) <= .01 && u >= -.01 && (u = 0)), f && (c += b, (f *= .993 ** 112.5) <= .01 && f >= -.01 && (f = 0)), m.rec && s && (u -= m.rec * Math.cos(e.dir), f -= m.rec * Math.sin(e.dir)), [v, b, u, f]
			}
			let Te = !1
				, Me = {
					ldown: !1
					, rdown: !1
				};
			document.getElementById("gameCanvas")
				.addEventListener("mouseup", e => {
					0 == e.button && (Me.ldown = !1), 2 == e.button && (Me.rdown = !1)
				}), document.getElementById("gameCanvas")
				.addEventListener("mousedown", e => {
					0 == e.button && (Me.ldown = !0), 2 == e.button && (Me.rdown = !0)
				});
			let Pe = "sandbox.moomoo.io" == window.location.hostname
				, Oe = !0
				, De = !1;
			async function a() {
				if(!Me.ldown) return void l();
				let e = global_functions_exporter.playerList[Ve.id];
				if(10 == Ve.secondary ? Ve.secondaryObject : Ve.primaryObject, (e.pCd > 0 || Oe) && (Oe && (Oe = !1), (10 == Ve.secondary ? e.secondary != e.weapon : e.primary != e.weapon) && (10 == Ve.secondary ? ae(["5", [h, !0]]) : i())), e.pCd > 0) {
					let e, t;
					try {
						e = 0 == global_functions_exporter.playerList[M.id].shameCount
					} catch (t) {
						e = !0
					}
					global_functions_exporter.playerList[Ve.id].turretCd <= 0 && e && u && 22 != global_functions_exporter.playerList[M.id].hat && storeEquip(53), E.forEach(e => {
						global_functions_exporter.playerList[e[0]].pVariant > 0 && H(Ve, global_functions_exporter.playerList[e[0]]) < 300 && (t = !0)
					}), ot && !t ? ("".damage >= 40 ? storeEquip(11) : storeEquip(26), storeEquip(21, !0)) : at ? (storeEquip(26), storeEquip(13, !0)) : u ? (storeEquip(k), storeEquip(C, !0)) : Pe ? (storeEquip(7), storeEquip(C, !0)) : (storeEquip(k), storeEquip(C, !0))
				}
				if(e.pCd <= 0) {
					let e;
					storeEquip(40), E.forEach(t => {
							global_functions_exporter.playerList[t[0]].pVariant > 0 && H(Ve, global_functions_exporter.playerList[t[0]]) < 300 && (e = !0)
						}), q(Ve)
						.length ? storeEquip(18, !0) : ot && !e ? storeEquip(21, !0) : at ? storeEquip(13, !0) : storeEquip(C, !0), document.hit(!0), await Lt(1, Qe), document.hit(!1)
				}
			}
			let Le = !1
				, _e = !0
				, Se = !1;
			async function s() {
				if(!Me.ldown) return void l();
				let e = global_functions_exporter.playerList[Ve.id]
					, t = Ve.primaryObject;
				if((e.pCd > 0 || _e) && (_e && (_e = !1), e.primary != e.weapon && i()), e.pCd > 0) {
					let e, n = !1;
					if(E.forEach(t => {
							n = !0, global_functions_exporter.playerList[t[0]].pVariant > 0 && H(Ve, global_functions_exporter.playerList[t[0]]) < 300 && (e = !0)
						}), Le) {
						Le = !1, storeEquip(7), storeEquip(13, !0);
						let e = setInterval(() => ce(p, null), 10);
						(async () => {
							await Lt(1, Qe), clearInterval(e)
						})()
					} else ot && !e ? !e || t.damage >= 40 ? (storeEquip(11), storeEquip(21, !0)) : (storeEquip(26), storeEquip(13, !0)) : at ? (storeEquip(26), storeEquip(13, !0)) : n ? (storeEquip(k), storeEquip(C, !0)) : Pe ? (storeEquip(7), storeEquip(C, !0)) : (storeEquip(k), storeEquip(C, !0))
				}
				if(e.pCd <= 0) {
					storeEquip(7);
					let e, t, n = !1;
					try {
						e = 0 == global_functions_exporter.playerList[M.id].shameCount
					} catch (t) {
						e = !0
					}
					global_functions_exporter.playerList[Ve.id].turretCd <= 0 && e && u && 22 != global_functions_exporter.playerList[M.id].hat && (storeEquip(53), n = !0), E.forEach(e => {
							global_functions_exporter.playerList[e[0]].pVariant > 0 && H(Ve, global_functions_exporter.playerList[e[0]]) < 300 && (t = !0)
						}), q(Ve)
						.length ? (storeEquip(18, !0), q(Ve)
							.forEach(e => {
								0 == global_functions_exporter.playerList[Ve.id].pVariant && e.primaryObject.damage >= 40 && 11 == e.hat && 21 == e.accessory && (Le = !0)
							})) : ot ? t ? storeEquip(13) : storeEquip(21, !0) : at ? storeEquip(13, !0) : storeEquip(C, !0), document.hit(!0), await Lt(1, Qe), document.hit(!1)
				}
			}
			async function l() {
				Ct && (bt = !1), document.hit(!1), Te = !1, Oe = !0, _e = !0, storeEquip(k), storeEquip(C, !0), Te = !1, 10 == Ve.secondary ? await oe() : await ie(), r()
			}
			document.getElementById("gameCanvas")
				.onmousedown = async function (e) {
					let t = document.activeElement.id;
					if("chatBox" != t && "instaChatData" != t && "allianceInput" != t && "fixedClanCreationValue" != t && "achatEnemyVal" != t && "spikeHotkeyValue" != t && "trapHotkeyValue" != t && "healingHotkeyValue" != t && "instaHotkeyValue" != t && "tripleMillHotkeyValue" != t && "tripleTeleporterValue" != t) {
						if(Te = !0, e.preventDefault(), e.stopPropagation(), 0 == e.button) {
							if(Ct && (bt = !0), !Me.ldown) return void l();
							q(Ve)
								.length ? (De && (De = !1), Se = !0) : (Se && (Se = !1), De = !0);
							let e = setInterval(async () => {
								if(!Me.ldown) return l(), void clearInterval(e);
								q(Ve)
									.length ? (De && (De = !1), Se = !0) : (Se && (Se = !1), De = !0)
							}, 112.5 - et);
							window.addEventListener("mouseup", async function () {
								clearInterval(e), Oe = !0, _e = !0, De && (De = !1), Se && (Se = !1), storeEquip(k), storeEquip(C, !0), Te = !1, await ie(), r(), Ct && (bt = !1), this.removeEventListener("mouseup", arguments.callee, !1)
							})
						}
						1 == e.button && K(), 2 == e.button && Z()
					}
				};
			let qe = {
				previousHat: null
				, previousAcc: null
				, inProcess: !1
			};
			$("#gameCanvas")
				.on("wheel", function (e) {
					e.originalEvent.deltaY > 0 && (storeEquip(qe.previousHat), storeEquip(qe.previousAcc, !0), qe.inProcess = !1), e.originalEvent.deltaY < 0 && (7 != Ve.hat && (qe.previousAcc = Ve.accessory, qe.previousHat = Ve.hat, qe.inProcess = !0), storeEquip(7))
				});
			let He = 1;

			function c() {
				le(k), se(C)
			}
			var u, f;
			setInterval(() => {
				1 == He && (x != k && le(k), B != C && se(C), x = k, B = C)
			}, 25);
			var d, h, p, A, g, m, y, w, v, b, x, B, E, k, C, I, T, M = {
				id: null
				, x: null
				, y: null
				, dir: null
				, object: null
				, weapon: null
				, clan: null
				, isLeader: null
				, hat: null
				, accessory: null
				, isSkull: null
				, weaponVariant: null
			};
			let Ve = {
					id: null
					, x: null
					, y: null
					, dir: null
					, object: null
					, weapon: null
					, clan: null
					, isLeader: null
					, hat: null
					, accessory: null
					, isSkull: null
					, primary: null
					, secondary: null
					, primaryCooldown: null
					, secondaryCooldown: null
					, lastTickHealth: 100
					, hitByThisTick: []
					, allyIDs: []
					, priXP: 0
					, secXP: 0
					, priXPLim: 3e3
					, secXPLim: 3e3
					, health: 100
				}
				, je = {
					wood: 100
					, stone: 100
					, food: 100
				};

			function P(e) {
				if(Ve.primary == Ve.weapon) {
					Ve.priXP += e, document.getElementById("priXP")
						.innerHTML = Ve.priXP;
					let t = 3e3;
					switch(global_functions_exporter.playerList[Ve.id].pVariant) {
					case 0:
						t = 3e3;
						break;
					case 1:
						t = 7e3;
						break;
					case 2:
						t = 12e3;
						break;
					case 3:
						t = 1 / 0
					}
					Ve.priXPLim = t, document.getElementById("priXPLim")
						.innerHTML = Ve.priXPLim
				}
				if(Ve.secondary == Ve.weapon) {
					Ve.secXP += e, document.getElementById("secXP")
						.innerHTML = Ve.secXP;
					let t = 3e3;
					switch(global_functions_exporter.playerList[Ve.id].sVariant) {
					case 0:
						t = 3e3;
						break;
					case 1:
						t = 7e3;
						break;
					case 2:
						t = 12e3;
						break;
					case 3:
						t = 1 / 0
					}
					Ve.secXPLim = t, document.getElementById("secXPLim")
						.innerHTML = Ve.secXPLim
				}
			}
			let Xe = null
				, Ue = null;
			setInterval(() => {
				Xe == Ve.primary && Ue == Ve.secondary || (Ve.primary != Xe && (Ve.priXP = 0), Ve.secondary != Ue && (Ve.secXP = 0)), Xe = Ve.primary, Ue = Ve.secondary;
				let e = Number(document.getElementById("stoneDisplay")
						.innerHTML)
					, t = Number(document.getElementById("foodDisplay")
						.innerHTML)
					, n = Number(document.getElementById("woodDisplay")
						.innerHTML);
				n > je.wood && (P(n - je.wood), je.wood = n), e > je.stone && (P(e - je.stone), je.stone = e), e > je.food && (P(t - je.food), je.food = t)
			}, 112.5);
			var O, D, L = document.createElement("div");
			L.innerHTML = '\n<div>\n   <table id="StatTbl" class="hackDisp" style="opacity: 1;display: block;width: 200px; position: absolute;top: 230px;left: 20px;color: #fff;background-color: rgba(0, 0, 0, 0.25);border-radius: 4px;-moz-border-radius: 4px;-webkit-border-radius: 4px;pointer-events: none;" border="0">\n      <tbody>\n         <tr style="height: 21px;">\n            <td style="height: 21px;color: rgba(255, 255, 255, 0.6);"> <button id="settingsBoxOpen" style="pointer-events: auto;background-color: black;color: white;border-color: black;border-radius: 4px;-moz-border-radius: 4px;-webkit-border-radius: 4px;">Settings</button> </td>\n            <td id="pingDisp" style="height: 21px;color: white;"> Ping: not connected</td>\n         </tr>\n         <tr style="height: 21px;">\n            <td style="height: 21px;color: rgba(255, 255, 255, 0.6);">Pri XP: </td>\n            <td style="height: 21px;"><span id="priXP">0</span> / <span id="priXPLim">not found</span></td>\n         </tr>\n         <tr style="height: 21px;">\n            <td style="height: 21px;color: rgba(255, 255, 255, 0.6);">Sec XP:</td>\n            <td style="height: 21px;"><span id="secXP">0</span> / <span id="secXPLim">not found</span></td>\n         </tr>\n         <tr style="height: 21px;">\n            <td style="height: 21px;color: rgba(255, 255, 255, 0.6);">Healer:</td>\n            <td style="height: 21px;"><span id="healDisplayer">none</span></td>\n         </tr>\n      </tbody>\n   </table>\n</div>\n</div>\n<style> .bot-settings{ padding: 10px; background-color: rgba(0, 0, 0, 0.2); border-radius: 3px; position: absolute; left: 255px; top: 20px; width: 137px; } .equip-btn{ pointer-events: auto; display: inline-block; width: 25px; height: 25px; border: 1px solid grey; background-size: contain; cursor: pointer; background-color: lightgray; } .equip-btn.selected{ background-color: lightgreen; } </style>\n', L.id = "dataDisplayer", document.getElementsByTagName("body")[0].appendChild(L), $(L)
				.animate({
					opacity: 1
				}), global_functions_exporter.myPlayer = {
					allyIDs: []
				}, setInterval(() => {
					global_functions_exporter.myPlayer = Ve
				}, 25);
			var _ = {};
			unsafeWindow.alert = (() => {}), unsafeWindow.onbeforeunload = (() => {}), unsafeWindow.confirm = (() => {}), unsafeWindow.prompt = (() => {});
			let Re = Date.now();
			WebSocket.prototype.oldSend = WebSocket.prototype.send, WebSocket.prototype.send = function (e) {
				I || (document.ws = this, this.addEventListener("close", function () {
					reloadModule.loadState = "Disconnected"
				}), I = this, this.addEventListener("message", function (e) {
					! function (e) {
						let t, r = msgpack.decode(new Uint8Array(e.data));
						r.length > 1 ? (t = [r[0], ...r[1]])[1] instanceof Array && (t = t) : t = r;
						let l = t[0];
						if(!t) return;
						if("io-init" === l) {
							document.getElementById("ot-sdk-btn-floating")
								.remove();
							let e = document.getElementById("gameCanvas");
							Ee = e.clientWidth, ke = e.clientHeight, $(window)
								.resize(function () {
									Ee = e.clientWidth, ke = e.clientHeight
								}), e.addEventListener("mousemove", e => {
									xe = e.clientX, Be = e.clientY, global_functions_exporter.mouseCoords = [Ve.x + xe - Ee / 2, Ve.y + Be - ke / 2]
								})
						}
						"1" == l && null == Ve.id && (Ve.id = t[1]);
						if("pp" == l) {
							Je = Date.now() - Re, $e.push(Je);
							let e = 0;
							for(var d = 0; d < $e.length; d++) e += $e[d];
							let t = $e.slice()
								.sort((e, t) => e - t);
							et = t[Math.ceil(t.length / 5)], $e.length > 50 && $e.shift(), document.getElementById("pingDisp")
								.innerHTML = `Ping: ${Je}`
						}
						"33" == l && (45 == Ve.hat ? (Ge || (Ge = Date.now()), S()) : (Ge = !1, S()));
						if("33" == l) {
							E = [], O = [];
							for(let e = 0; e < t[1].length / 13; e++) {
								let r = t[1].slice(13 * e, 13 * e + 13);
								if(r[0] == Ve.id) {
									Qe++, pe();
									try {
										Ve.prevMe = Ve
									} catch (e) {}
									Ve.x && (Ve.xvel = Ve.x - r[1], Ve.yvel = Ve.y - r[2], 0 != Ve.xvel && 0 != Ve.yvel && (Ve.prevXVel = Ve.xvel, Ve.prevYVel = Ve.yvel)), Ve.x = r[1], Ve.y = r[2], Ve.dir = r[3], Ve.object = r[4], Ve.weapon = r[5], Ve.weaponVariant = r[6], Ve.clan = r[7], Ve.isLeader = r[8], Ve.hat = r[9], Ve.accessory = r[10], Ve.isSkull = r[11];
									let e = n.find(e => e.id == Ve.weapon);
									Ve.weaponObject = e;
									try {
										0 == e.type ? (Ve.primary = e.id, Ve.primaryCooldown = e.speed, Ve.primaryObject = e) : e.isInvis || (Ve.secondary = e.id, Ve.secondaryCooldown = e.speed, Ve.secondaryObject = e)
									} catch (e) {}
									try {
										global_functions_exporter.playerList[r[0]].prevMe = global_functions_exporter.playerList[r[0]]
									} catch (e) {}
									try {
										global_functions_exporter.playerList[r[0]].x && (global_functions_exporter.playerList[r[0]].xvel = global_functions_exporter.playerList[r[0]].x - r[1], global_functions_exporter.playerList[r[0]].yvel = global_functions_exporter.playerList[r[0]].y - r[2], 0 != global_functions_exporter.playerList[r[0]].xvel && 0 != global_functions_exporter.playerList[r[0]].yvel && (global_functions_exporter.playerList[r[0]].prevXVel = global_functions_exporter.playerList[r[0]].xvel, global_functions_exporter.playerList[r[0]].prevYVel = global_functions_exporter.playerList[r[0]].yvel))
									} catch (e) {}(!global_functions_exporter.playerList[r[0]] || global_functions_exporter.playerList[r[0]] && !global_functions_exporter.playerList[r[0]].updateCd) && (() => {
										let e = Object.assign({}, global_functions_exporter.playerList[r[0]]);
										global_functions_exporter.playerList[r[0]] = {
											points: e.points
											, name: e.name
											, id: r[0]
											, x: r[1]
											, y: r[2]
											, dir: r[3]
											, object: r[4]
											, weapon: r[5]
											, weaponVariant: r[6]
											, clan: r[7]
											, isLeader: r[8]
											, hat: r[9]
											, accessory: r[10]
											, isSkull: r[11]
											, updateCd: (e, t) => {
												53 == e ? global_functions_exporter.playerList[r[0]].turretCd = 22 - tt : "__proto__" == e || "length" == e || (e < 9 ? global_functions_exporter.playerList[r[0]].pCd = global_functions_exporter.playerList[r[0]].primaryObject.cd - tt : global_functions_exporter.playerList[r[0]].sCd = global_functions_exporter.playerList[r[0]].secondaryObject.cd - tt, global_functions_exporter.playerList[r[0]].weaponObject.isMelee && (global_functions_exporter.playerList[r[0]].hitThisTick = !0), global_functions_exporter.playerList[r[0]].weaponObject.isMelee || (global_functions_exporter.playerList[r[0]].shotThisTick = !0))
											}
										}
									})(), global_functions_exporter.playerList[r[0]].id = r[0], global_functions_exporter.playerList[r[0]].x = r[1], global_functions_exporter.playerList[r[0]].y = r[2], global_functions_exporter.playerList[r[0]].dir = r[3], global_functions_exporter.playerList[r[0]].object = r[4], global_functions_exporter.playerList[r[0]].weapon = r[5], global_functions_exporter.playerList[r[0]].weaponVariant = r[6], global_functions_exporter.playerList[r[0]].clan = r[7], global_functions_exporter.playerList[r[0]].isLeader = r[8], global_functions_exporter.playerList[r[0]].hat = r[9], global_functions_exporter.playerList[r[0]].accessory = r[10], global_functions_exporter.playerList[r[0]].isSkull = r[11], global_functions_exporter.playerList[r[0]].weaponObject = e, !global_functions_exporter.playerList[r[0]].pCd && (global_functions_exporter.playerList[r[0]].pCd = -1), !global_functions_exporter.playerList[r[0]].sCd && (global_functions_exporter.playerList[r[0]].sCd = -1), !global_functions_exporter.playerList[r[0]].turretCd && (global_functions_exporter.playerList[r[0]].turretCd = -1), global_functions_exporter.playerList[r[0]].turretCd--, Date.now() - global_functions_exporter.playerList[r[0]].lastActive > 2e4 && (global_functions_exporter.playerList[r[0]].shameCount = 0), Date.now() - global_functions_exporter.playerList[r[0]].lastActive > 1e3 && (global_functions_exporter.playerList[r[0]].pCd = -1, global_functions_exporter.playerList[r[0]].sCd = -1), global_functions_exporter.playerList[r[0]].lastActive = Date.now();
									try {
										0 == e.type ? (global_functions_exporter.playerList[r[0]].primary = e.id, global_functions_exporter.playerList[r[0]].primaryCooldown = e.speed, global_functions_exporter.playerList[r[0]].primaryObject = e) : e.isInvis || (global_functions_exporter.playerList[r[0]].secondary = e.id, global_functions_exporter.playerList[r[0]].secondaryCooldown = e.speed, global_functions_exporter.playerList[r[0]].secondaryObject = e)
									} catch (e) {}
									0 == global_functions_exporter.playerList[r[0]].weaponObject.type ? (global_functions_exporter.playerList[r[0]].pVariant = global_functions_exporter.playerList[r[0]].weaponVariant, global_functions_exporter.playerList[r[0]].primary !== global_functions_exporter.playerList[r[0]].weapon ? (global_functions_exporter.playerList[r[0]].pCd = -1, global_functions_exporter.playerList[r[0]].primary && global_functions_exporter.playerList[r[0]][global_functions_exporter.playerList[r[0]].primary].age <= global_functions_exporter.playerList[r[0]].secondaryObject.age && (4 != global_functions_exporter.playerList[r[0]].weapon && 5 != global_functions_exporter.playerList[r[0]].weapon || (global_functions_exporter.playerList[r[0]].secondary = 15))) : global_functions_exporter.playerList[r[0]].pCd--, null != global_functions_exporter.playerList[r[0]].primary || null != global_functions_exporter.playerList[r[0]].secondary || 4 != global_functions_exporter.playerList[r[0]].weapon && 5 != global_functions_exporter.playerList[r[0]].weapon ? 0 == global_functions_exporter.playerList[r[0]].weapon && (global_functions_exporter.playerList[r[0]].secondary = null) : global_functions_exporter.playerList[r[0]].secondary = 15, global_functions_exporter.playerList[r[0]].primary = global_functions_exporter.playerList[r[0]].weapon) : 1 == global_functions_exporter.playerList[r[0]].weaponObject.type && (global_functions_exporter.playerList[r[0]].sVariant = global_functions_exporter.playerList[r[0]].weaponVariant, global_functions_exporter.playerList[r[0]].secondary !== global_functions_exporter.playerList[r[0]].weapon ? global_functions_exporter.playerList[r[0]].sCd = -1 : global_functions_exporter.playerList[r[0]].sCd--, global_functions_exporter.playerList[r[0]].secondary = global_functions_exporter.playerList[r[0]].weapon);
									let t, l = o(global_functions_exporter.playerList[r[0]].prevMe ? global_functions_exporter.playerList[r[0]].prevMe : global_functions_exporter.playerList[r[0]], 0 != global_functions_exporter.playerList[r[0]].xvel || 0 != global_functions_exporter.playerList[r[0]].yvel ? Math.atan2(global_functions_exporter.playerList[r[0]].yvel, global_functions_exporter.playerList[r[0]].xvel) : null, global_functions_exporter.playerList[r[0]].weapon, global_functions_exporter.playerList[r[0]].hat, global_functions_exporter.playerList[r[0]].accessory, global_functions_exporter.playerList[r[0]].object, global_functions_exporter.playerList[r[0]].shotThisTick || global_functions_exporter.playerList[r[0]].hitThisTick);
									global_functions_exporter.playerList[r[0]].sxvel = l[2], global_functions_exporter.playerList[r[0]].syvel = l[3], delete global_functions_exporter.playerList[r[0]].gpiha, Ve.hitByThisTick = [], yt.forEach(e => {
											let t, n = void 0
												, r = e.slice(1, e.length)
												, i = 1 == r[5] ? r[0] : r[0] - 70 * Math.cos(r[2])
												, o = 1 == r[5] ? r[1] : r[1] - 70 * Math.sin(r[2])
												, a = Math.atan2(o - Ve.y, i - Ve.x);
											if(Y(a = te(a), r[2], .15) && (r.push(Date.now()), ee.shift(), ee[ee.length] = r, 0 == r[5] || 5 == r[5] || 2 == r[5] || 1 == r[5])) {
												let e = !1
													, t = !1
													, n = !1
													, r = !1;
												for(let i = 19; i < ee.length; i++)
													if(ee[i] && ee[i][ee[i].length - 1] >= Date.now() - 300) switch(ee[i][5]) {
													case 0:
														e = !0;
														break;
													case 1:
														t = !0;
														break;
													case 2:
														n = !0;
														break;
													case 5:
														r = !0
													}
												if(e && (r || t)) {
													At = !0;
													let e = setInterval(() => ce(p, null), 10);
													setTimeout(() => {
														clearInterval(e)
													}, 500)
												}
												if(e && n)
													if(console.log("bow and CB"), t) {
														console.log("turret, bow, and crossbow"), ae(["13c", [0, 6, 0, !0]]), ae(["13c", [0, 6, 0]]), At = !0;
														let e = setInterval(() => ce(p, null), 10);
														setTimeout(() => {
															clearInterval(e)
														}, 500)
													} else {
														At = !0;
														let e = setInterval(() => ce(p, null), 10);
														setTimeout(() => {
															clearInterval(e)
														}, 500), console.log("basic emp block");
														let t = Ve.hat
															, n = Ve.accessory
															, r = setInterval(() => storeEquip(6), 5);
														setTimeout(() => {
															clearInterval(r), setTimeout(() => {
																storeEquip(t), storeEquip(n, !0)
															}, 60)
														}, 500)
													}
											}
											if(1e3 == e[4] || 1200 == e[4] || 1400 == e[4] || 700 == e[4]) {
												switch(e[6]) {
												case 0:
													t = 9;
													break;
												case 1:
													t = 53;
													break;
												case 2:
													t = 12;
													break;
												case 3:
													t = 13;
													break;
												case 5:
													t = 15
												}
												let r = 53 == t ? 1 : 999999;
												Object.values(global_functions_exporter.playerList)
													.forEach(i => {
														if(i.weapon == t || 53 == t && 53 == i.hat) {
															let o = Math.hypot(i.x - (53 == t ? e[1] : e[1] - 70 * Math.cos(e[3])), i.y - (53 == t ? e[2] : e[2] - 70 * Math.sin(e[3])));
															o < 300 && o < r && (n = i, r = o)
														}
													}), n && (n.updateCd(t), n.id != Ve.id && U(Ve, n) <= 300 && Y(n.dir, W(n, Ve), 1.134) && Ve.hitByThisTick.push(n))
											}
										}), yt = [], at || Ce || !document.getElementById("bioHats")
										.checked || (C = 11, k = Ve.y < 2400 ? 15 : Ve.y > 6850 && Ve.y < 7550 ? 31 : 12), De && a(), Se && s(), It.forEach(e => {
											try {
												X()
											} catch (e) {
												console.error(e)
											}
											let t = global_functions_exporter.playerList[e[1]]
												, r = n.find(e => e.id === t.weapon)
												, i = !!r && r.isMelee;
											i && (3 == t.weaponVariant || 21 == t.hat || H(Ve, t) < 250) && q(t)
												.forEach(e => {
													e.id == Ve.id && Ve.hitByThisTick.push(t)
												}), t.hitThisTick = !1;
											try {
												global_functions_exporter.playerList[e[1]].updateCd(e[3], e[2])
											} catch (e) {}
										}), It = [], Tt.forEach(e => {
											!(at && global_functions_exporter.playerList[Ve.id].pCd <= 0 && 11 == Ve.hat && 21 == Ve.accessory && document.getElementById("autoAntibull")
												.checked) || global_functions_exporter.playerList[M.id].primary != Fe && global_functions_exporter.playerList[M.id].primary != Ne || Ve.primary != Fe && Ve.primary != Ne || 0 != global_functions_exporter.playerList[M.id].pVariant ? at && document.getElementById("autoAntibull")
												.checked && global_functions_exporter.playerList[Ve.id].pCd <= 0 && (Ve.primary == Fe || Ve.primary == Ne) && global_functions_exporter.playerList[M.id] && global_functions_exporter.playerList[M.id].pVariant >= 2 && global_functions_exporter.playerList[M.id] && (global_functions_exporter.playerList[M.id].primary == Fe || global_functions_exporter.playerList[M.id].primary == Ne) && (storeEquip(18, !0), global_functions_exporter.playerList[Ve.id].turretCd <= 0 && 22 != M.hat ? storeEquip(53) : storeEquip(7), document.hit(!0), setTimeout(async () => {
													await Lt(1, Qe), document.hit(!1), c()
												}, 1)) : (i(), global_functions_exporter.playerList[Ve.id].turretCd <= 0 && E.some(e => e[0] == M.id) && 22 != global_functions_exporter.playerList[M.id].hat ? storeEquip(53) : storeEquip(7), storeEquip(18, !0), document.getElementById("autoqCheckbox")
													.checked && (clearInterval(mt), mt = !1), document.hit(!0), setTimeout(() => {
														document.getElementById("autoqCheckbox")
															.checked && (isFlagging = !0), document.hit(!1), !at || !document.getElementById("autoAntibull")
															.checked || global_functions_exporter.playerList[M.id].primary != Fe && global_functions_exporter.playerList[M.id].primary != Ne || Ve.primary != Fe && Ve.primary != Ne || 0 != global_functions_exporter.playerList[M.id].pVariant || (console.log("reinitialized ab"), k = 11, C = 21, c())
													}, 112.5));
											try {
												(!at || ot && !mt) && (isFlagging = !0)
											} catch (e) {}
											if(e[2] < 100 && e[2] > 0) {
												let n = Ve.previousHealth - e[2];
												25 == n && !ot && document.getElementById("autoemp")
													.checked && storeEquip(22), 8 == n && !ot && document.getElementById("wolfBlock")
													.checked && J(), t = e
											}
										}), Tt = [], t && j(t[2]), Ve.lastTickHealth = Ve.health
								} else if(r[7] != Ve.clan || null === r[7]) {
									E.push(r);
									try {
										global_functions_exporter.playerList[r[0]].prevMe = global_functions_exporter.playerList[r[0]]
									} catch (e) {}
									try {
										global_functions_exporter.playerList[r[0]].x && (global_functions_exporter.playerList[r[0]].xvel = global_functions_exporter.playerList[r[0]].x - r[1], global_functions_exporter.playerList[r[0]].yvel = global_functions_exporter.playerList[r[0]].y - r[2], 0 != global_functions_exporter.playerList[r[0]].xvel && 0 != global_functions_exporter.playerList[r[0]].yvel && (global_functions_exporter.playerList[r[0]].prevXVel = global_functions_exporter.playerList[r[0]].xvel, global_functions_exporter.playerList[r[0]].prevYVel = global_functions_exporter.playerList[r[0]].yvel))
									} catch (e) {}(!global_functions_exporter.playerList[r[0]] || global_functions_exporter.playerList[r[0]] && !global_functions_exporter.playerList[r[0]].updateCd) && (() => {
										let e = Object.assign({}, global_functions_exporter.playerList[r[0]]);
										global_functions_exporter.playerList[r[0]] = {
											points: e.points
											, name: e.name
											, id: r[0]
											, x: r[1]
											, y: r[2]
											, dir: r[3]
											, object: r[4]
											, weapon: r[5]
											, weaponVariant: r[6]
											, clan: r[7]
											, isLeader: r[8]
											, hat: r[9]
											, accessory: r[10]
											, isSkull: r[11]
											, updateCd: (e, t) => {
												53 == e ? global_functions_exporter.playerList[r[0]].turretCd = 22 - tt : "__proto__" == e || "length" == e || (e < 9 ? global_functions_exporter.playerList[r[0]].pCd = global_functions_exporter.playerList[r[0]].primaryObject.cd - tt : global_functions_exporter.playerList[r[0]].sCd = global_functions_exporter.playerList[r[0]].secondaryObject.cd - tt, global_functions_exporter.playerList[r[0]].weaponObject.isMelee && (global_functions_exporter.playerList[r[0]].hitThisTick = !0), global_functions_exporter.playerList[r[0]].weaponObject.isMelee || (global_functions_exporter.playerList[r[0]].shotThisTick = !0))
											}
										}
									})(), delete global_functions_exporter.playerList[r[0]].gpiha, global_functions_exporter.playerList[r[0]].id = r[0], global_functions_exporter.playerList[r[0]].x = r[1], global_functions_exporter.playerList[r[0]].y = r[2], global_functions_exporter.playerList[r[0]].dir = r[3], global_functions_exporter.playerList[r[0]].object = r[4], global_functions_exporter.playerList[r[0]].weapon = r[5], global_functions_exporter.playerList[r[0]].weaponVariant = r[6], global_functions_exporter.playerList[r[0]].clan = r[7], global_functions_exporter.playerList[r[0]].isLeader = r[8], global_functions_exporter.playerList[r[0]].hat = r[9], global_functions_exporter.playerList[r[0]].accessory = r[10], global_functions_exporter.playerList[r[0]].isSkull = r[11];
									let e = n.find(e => e.id == global_functions_exporter.playerList[r[0]].weapon);
									try {
										0 == e.type ? (global_functions_exporter.playerList[r[0]].primary = e.id, global_functions_exporter.playerList[r[0]].primaryCooldown = e.speed, global_functions_exporter.playerList[r[0]].primaryObject = e) : e.isInvis || (global_functions_exporter.playerList[r[0]].secondary = e.id, global_functions_exporter.playerList[r[0]].secondaryCooldown = e.speed, global_functions_exporter.playerList[r[0]].secondaryObject = e)
									} catch (e) {}
									global_functions_exporter.playerList[r[0]].weaponObject = e, !global_functions_exporter.playerList[r[0]].pCd && (global_functions_exporter.playerList[r[0]].pCd = -1), !global_functions_exporter.playerList[r[0]].sCd && (global_functions_exporter.playerList[r[0]].sCd = -1), !global_functions_exporter.playerList[r[0]].turretCd && (global_functions_exporter.playerList[r[0]].turretCd = -1), global_functions_exporter.playerList[r[0]].turretCd--, Date.now() - global_functions_exporter.playerList[r[0]].lastActive > 2e4 && (global_functions_exporter.playerList[r[0]].shameCount = 0), Date.now() - global_functions_exporter.playerList[r[0]].lastActive > 1e3 && (global_functions_exporter.playerList[r[0]].pCd = -1, global_functions_exporter.playerList[r[0]].sCd = -1), global_functions_exporter.playerList[r[0]].lastActive = Date.now(), global_functions_exporter.playerList[r[0]].weapon < 9 ? (global_functions_exporter.playerList[r[0]].pVariant = global_functions_exporter.playerList[r[0]].weaponVariant, global_functions_exporter.playerList[r[0]].primary !== global_functions_exporter.playerList[r[0]].weapon ? (global_functions_exporter.playerList[r[0]].pCd = -1, global_functions_exporter.playerList[r[0]].primary && global_functions_exporter.playerList[r[0]][global_functions_exporter.playerList[r[0]].primary].age <= global_functions_exporter.playerList[r[0]].secondaryObject.age && (4 != global_functions_exporter.playerList[r[0]].weapon && 5 != global_functions_exporter.playerList[r[0]].weapon || (global_functions_exporter.playerList[r[0]].secondary = 15))) : global_functions_exporter.playerList[r[0]].pCd--, null != global_functions_exporter.playerList[r[0]].primary || null != global_functions_exporter.playerList[r[0]].secondary || 4 != global_functions_exporter.playerList[r[0]].weapon && 5 != global_functions_exporter.playerList[r[0]].weapon ? 0 == global_functions_exporter.playerList[r[0]].weapon && (global_functions_exporter.playerList[r[0]].secondary = null) : global_functions_exporter.playerList[r[0]].secondary = 15, global_functions_exporter.playerList[r[0]].primary = global_functions_exporter.playerList[r[0]].weapon) : global_functions_exporter.playerList[r[0]].weapon >= 9 && (global_functions_exporter.playerList[r[0]].sVariant = global_functions_exporter.playerList[r[0]].weaponVariant, global_functions_exporter.playerList[r[0]].secondary !== global_functions_exporter.playerList[r[0]].weapon ? global_functions_exporter.playerList[r[0]].sCd = -1 : global_functions_exporter.playerList[r[0]].sCd--, global_functions_exporter.playerList[r[0]].secondary = global_functions_exporter.playerList[r[0]].weapon);
									let t = o(global_functions_exporter.playerList[r[0]].prevMe ? global_functions_exporter.playerList[r[0]].prevMe : global_functions_exporter.playerList[r[0]], 0 != global_functions_exporter.playerList[r[0]].xvel || 0 != global_functions_exporter.playerList[r[0]].yvel ? Math.atan2(global_functions_exporter.playerList[r[0]].yvel, global_functions_exporter.playerList[r[0]].xvel) : null, global_functions_exporter.playerList[r[0]].weapon, global_functions_exporter.playerList[r[0]].hat, global_functions_exporter.playerList[r[0]].accessory, global_functions_exporter.playerList[r[0]].object, global_functions_exporter.playerList[r[0]].shotThisTick || global_functions_exporter.playerList[r[0]].hitThisTick);
									global_functions_exporter.playerList[r[0]].sxvel = t[2], global_functions_exporter.playerList[r[0]].syvel = t[3], delete global_functions_exporter.playerList[r[0]].gpiha
								} else r[7] == Ve.clan && O.push(r)
							}
							X()
						}
						if("2" == l) {
							if(global_functions_exporter.playerList[t[1][1]]) global_functions_exporter.playerList[t[1][1]].socketId = t[1][0];
							else {
								t[1].push(t[2]);
								let e = t[1];
								!global_functions_exporter.playerList[t[1][1]] && (global_functions_exporter.playerList[t[1][1]] = {}), global_functions_exporter.playerList[t[1][1]].socketId = e[0], global_functions_exporter.playerList[t[1][1]].id = e[1], global_functions_exporter.playerList[t[1][1]].name = e[2], global_functions_exporter.playerList[t[1][1]].x = e[3], global_functions_exporter.playerList[t[1][1]].y = e[4], global_functions_exporter.playerList[t[1][1]].dir = e[5], global_functions_exporter.playerList[t[1][1]].health = e[6], console.log("here x3")
							}
							global_functions_exporter.playerList[t[1][1]].health = t[1][6], global_functions_exporter.playerList[t[1][1]].health = t[1][7]
						}
						if("sa" == l)
							for(let e = 0; e < t[1].length / 2; e++) !global_functions_exporter.playerList[t[1][2 * e]] && (() => {
								let n = t[1].slice(2 * e, 2 * e + 2);
								global_functions_exporter.playerList[n[0]] = {
									id: n[0]
									, name: n[1]
								}
							})();
						if("5" == l)
							for(let e = 0; e < t[1].length / 3; e++) global_functions_exporter.playerList[t[1][3 * e]] ? (global_functions_exporter.playerList[t[1][3 * e]].name = t[1][3 * e + 1], global_functions_exporter.playerList[t[1][3 * e]].points = t[1][3 * e + 2]) : (() => {
								let n = t[1].slice(3 * e, 3 * e + 3);
								global_functions_exporter.playerList[n[0]] = {
									id: n[0]
									, name: n[1]
									, points: n[2]
								}
							})();
						"12" == l && Object.keys(_)
							.includes(t[1].toString()) && (unsafeWindow.tr(_[t[1]][0], _[t[1]][1]), ++Ke > 6 && (unsafeWindow.cleartr(), Ke = 0), _[t[1]] = void 0, _ = Ze(_));
						if("6" == l) try {
							let e = t[1];
							var h = [e[1], e[2]];
							_[e[0]] = h
						} catch (e) {
							console.log("err:", e)
						}
						"ch" == l && t[1] == M.id && document.getElementById("mirrorChat")
							.checked && Ae(t[2]);
						E && (u = E.sort((e, t) => R(e, Ve) - R(t, Ve))[0]);
						!1, O && (D = O.sort((e, t) => R(e, Ve) - R(t, Ve))[0]);
						u && "33" == l ? Math.sqrt(Math.pow(Ve.y - u[2], 2) + Math.pow(Ve.x - u[1], 2)) < 800 ? global_functions_exporter.setZoom({
							code: "reset"
						}) : global_functions_exporter.setZoom({
							code: "large"
						}) : "33" == l && global_functions_exporter.setZoom({
							code: "large"
						});
						if(u) {
							M.x && (M.xvel = M.x - u[1], M.yvel = M.y - u[2], 0 != M.xvel && 0 != M.yvel && (M.prevXVel = M.xvel, M.prevYVel = M.yvel)), M.id = u[0], M.x = u[1], M.y = u[2], M.dir = u[3], M.object = u[4], M.weapon = u[5], M.weaponVariant = u[6], M.clan = u[7], M.isLeader = u[8], M.hat = u[9], M.accessory = u[10], M.isSkull = u[11];
							let e = n.find(e => e.id == M.weapon);
							M.weaponObject = e;
							try {
								0 == e.type ? M.primaryCooldown = e.speed : M.secondaryCooldown = e.speed
							} catch (e) {}
							if(unsafeWindow.crosshairTarget = M.id, f = Math.atan2(u[2] - Ve.y, u[1] - Ve.x), pt = !document.getElementById("riverDefense")
								.checked && Ve.y > 6850 && Ve.y < 7550, at) {
								if(document.getElementById("achatEnemy")
									.checked && Ae(document.getElementById("achatEnemyVal")
										.value), !Ce && 7 != Ve.hat && 53 != Ve.hat) {
									let e = global_functions_exporter.playerList[u[0]];
									if(ot)
										if(!document.getElementById("autoAntibull")
											.checked || e.primary != Fe && e.primary != Ne || Ve.primary != Fe && Ve.primary != Ne || 0 != e.pVariant)
											if(Ve.primary != Fe && Ve.primary != Ne || !(e.pVariant >= 2) || e.primary != Fe && e.primary != Ne) {
												if(document.getElementById("autoqCheckbox")
													.checked) {
													try {
														clearInterval(mt), mt = !1
													} catch (e) {}
													isFlagging = !0
												}
												document.getElementById("autosoldier")
													.checked && (pt || (document.getElementById("antiDagger")
														.checked && 7 == global_functions_exporter.playerList[M.id].primary ? M.weaponVariant > 0 ? (C = 6, C = 13) : (k = 6, C = global_functions_exporter.playerList[M.id].pVariant > 0 ? 13 : 21) : (k = 6, C = M.weaponVariant > 0 ? 13 : 21)))
											} else k = 26, C = 13;
									else k = 11, C = 21, document.getElementById("autoqCheckbox")
										.checked && (ae(["5", [p]]), mt || (mt = setInterval(function () {
											ae(["c", [1]]), ae(["c", [0]])
										}, 1)), isFlagging = !1);
									else Q(!0)
								}
							} else {
								Ye = !1;
								try {
									clearInterval(mt), mt = !1, isFlagging = !0
								} catch (e) {}
							}
							let t = Math.sqrt(Math.pow(Ve.y - u[2], 2) + Math.pow(Ve.x - u[1], 2));
							t < 700 && !at && 9 == Ve.weapon && !lt && document.getElementById("autoInsta")
								.checked && !We ? (lt = !0, Z(!0)) : lt = !1
						}
						at || (f = Ve.dir);
						if("6" == l) {
							let e = t[1]
								, n = !1;
							try {
								E.forEach(e => {
									let t = global_functions_exporter.playerList[e[0]];
									U(Ve, t) < 500 && (n = !0)
								})
							} catch (e) {
								n = !1
							}
							if(null !== t[1][t[1].length - 2] && e[e.length - 1].toString() != Ve.id) {
								var A = t[1]
									, m = []
									, y = 6
									, v = [];
								m.push(A);
								for(let e = 0; e < m[0].length / 8; e++) v.push(m[0][y]), y += 8;
								for(let e in v)
									if(16 == v[e] && (6 == v[e - 1] || 7 == v[e - 1] || 8 == v[e - 1] || 9 == v[e - 1]) && n && document.getElementById("antiBoostSpike")
										.checked) {
										for(let e = 0; e < 4; e++) {
											let t = Ve.dir + he(90 * e);
											ce(g, t)
										}
										for(let e = 0; e < 4; e++) {
											let t = Ve.dir + he(90 * e);
											ce(w, t)
										}
									}
							}
						}
						"11" == l && (Ve.shameCount = 0, global_functions_exporter.playerList[Ve.id] = 0, Ve.lastTickHealth = 100, je = {
							wood: 100
							, stone: 100
							, food: 100
						});
						if("h" == l && Object.keys(global_functions_exporter.playerList)
							.includes(t[1].toString())) {
							let e = global_functions_exporter.playerList[t[1]];
							e.health || (e.health = 100), e.shameCount || (e.shameCount = 0), e.shameCount < 0 && (e.shameCount = 0);
							let n = t[2]
								, r = e.health - n;
							r > 0 && (e.previousHealth = e.health), r > 0 ? e.lastDamagedDate = Date.now() : (r < -15 || 100 == n) && e.lastDamagedDate && (Date.now() - e.lastDamagedDate <= 125 ? (e.shameCount++, e.shameCount > 8 && (this.shameCount = 8)) : (e.shameCount -= 2, e.shameCount < 0 && (this.shameCount = 0)), e.lastDamagedDate = null), e.health = n, e.shameCount < 0 && (e.shameCount = 0), 45 == e.hat && (e.shameCount = 0), e.shameCount > 7 && (e.shameCount = 0), global_functions_exporter.playerList[t[1]] = e, t[1] == Ve.id && (Ve.shameCount = global_functions_exporter.playerList[t[1]].shameCount)
						}
						"h" == l && t[1] == Ve.id && Tt.push(t);
						"7" == l && It.push(t);
						"18" == l && yt.push(t)
					}(e)
				}));
				let t = new Uint8Array(e)
					, r = {}
					, l = msgpack.decode(t);
				r.data = l[1] instanceof Array ? r.data = [l[0], ...l[1]] : r.data = l, "pp" == l[0] && (Re = Date.now()), this.oldSend(e)
			};
			let Ye = !1
				, We = !1
				, ze = {
					w: !1
					, a: !1
					, s: !1
					, d: !1
				};
			window.addEventListener("keydown", function (e) {
				!1 === ze[e.key] && (ze[e.key] = !0)
			}), window.addEventListener("keyup", function (e) {
				!0 === ze[e.key] && (ze[e.key] = !1)
			});
			let Ne = 5
				, Fe = 4
				, Qe = 0
				, Ge = 0;

			function S() {
				Ge ? (document.getElementById("autoDisconnect")
					.checked && document.ws.close(), global_functions_exporter.dataPackage = `[${Ve.hitByThisTick.length}/${et}] ` + `Clown: ${(Ge-Date.now()+3e4)/1e3}`) : global_functions_exporter.dataPackage = `[${Ve.hitByThisTick.length}/${et}] ` + (0 == Ve.shameCount ? "Shame: 0" : `Shame: ${Ve.shameCount}`)
			}

			function q(e) {
				if(e.gpiha && e.gpiha[1] == Qe) return e.gpiha[0]; {
					let t = Object.values(global_functions_exporter.playerList);
					if(e.id == Ve.id) {
						let e = [];
						E.forEach(t => {
							let n = global_functions_exporter.playerList[t[0]];
							e.push(n)
						}), t = e
					}
					let n = []
						, r = {
							x: e.x + 35 * Math.cos(e.dir)
							, y: e.y + 35 * Math.sin(e.dir)
						}
						, i = e.weaponObject.range ? e.weaponObject.range + 77 : 219;
					for(let o = 0; o < t.length; o++) {
						let a = t[o];
						if(a != e && Math.hypot(a.x - r.x, a.y - r.y) <= i + (a == global_functions_exporter.playerList[Ve.id] ? 41 : 37)) {
							let t = W(r, a);
							(t <= e.dir + 1.57 && t >= e.dir - 1.57 || (e.dir >= 0 ? e.dir > 1.57 && t <= e.dir - 1.57 - 3.14 : e.dir < -1.57 && t >= 3.14 + (e.dir + 1.57))) && n.push(a)
						}
					}
					return e.gpiha = [n, Qe], n
				}
			}
			let Ke = 0;
			const Ze = e => Object.fromEntries(Object.entries(e)
				.filter(([e, t]) => null != t)
				.map(([e, t]) => "object" == typeof t ? [e, Ze(t)] : [e, t]));
			document.querySelector("#pingDisplay");
			let Je = 100
				, $e = []
				, et = 0
				, tt = 0
				, nt = !1;

			function H(e, t) {
				return Math.hypot(t.x - e.x, t.y - e.y)
			}
			let rt = !0
				, it = !0;

			function V(e) {
				ce(p, null), ce(p, null), ce(p, null), ce(p, null)
			}

			function j(e) {
				try {
					Ve.lastTickHealth - e > 0 && rt && (Ve.shameCount < 6 && Ve.hitByThisTick.some(t => {
							let n, r = global_functions_exporter.playerList[t.id]
								, i = 1;
							switch(r.pVariant) {
							case 1:
								i = 1.09;
								break;
							case 2:
							case 3:
								i = 1.18
							}
							return ((n = Math.max(Math.max(r.pCd <= 0 && null != r.primary ? r.primaryObject.damage * i + (r.turretCd <= 0 ? 25 : 0) : 0, r.pCd <= 0 && null != r.primary ? r.primaryObject.damage * i * 1.5 : 0), r.sCd <= 0 && null != r.secondary ? r.secondaryObject.damage + (r.turretCd <= 0 ? 25 : 0) : 0)) >= e || 0 == t.weapon && 7 == t.hat) && t.id != Ve.id
						}) ? (At = !0, V()) : it && Ve.shameCount < 6 && Object.values(global_functions_exporter.playerList)
						.some(t => {
							let n = !1;
							E.forEach(e => {
								e[0] == t.id && (n = !0)
							});
							let r, i = global_functions_exporter.playerList[t.id]
								, o = 1;
							switch(i.pVariant) {
							case 1:
								o = 1.09;
								break;
							case 2:
							case 3:
								o = 1.18
							}
							return r = Math.max(Math.max(i.pCd <= 0 && null != i.primary ? i.primaryObject.damage * o + (i.turretCd <= 0 ? 25 : 0) : 0, i.pCd <= 0 && null != i.primary ? i.primaryObject.damage * o * 1.5 : 0), i.sCd <= 0 && null != i.secondary ? i.secondaryObject.damage + (i.turretCd <= 0 ? 25 : 0) : 0), t.id != Ve.id && H(Ve, t) <= 300 && r >= e && n
						}) ? (At = !0, V()) : et <= 120 ? setTimeout(() => {
							ce(p, null), ce(p, null), ce(p, null), ce(p, null)
						}, 130 - et) : V())
				} catch (e) {
					console.error("heal error ", e), global_functions_exporter.playerList = {}, V()
				}
			}
			let ot = !1
				, at = !1
				, st = !0;

			function X() {
				ot = !1, at = !1;
				let e = Ve.weapon == Ve.secondary && Ve.secondaryObject && Ve.secondaryObject.range ? Ve.secondaryObject.range + 77 : Ve.primaryObject ? Ve.primaryObject.range + 77 : 219;
				if(global_functions_exporter.playerList[Ve.id].perfectMaxMeleeRange = e, st) {
					let e = !1;
					E.forEach(t => {
						let n = t[0]
							, r = global_functions_exporter.playerList[n]
							, i = o(r, W(r, Ve))
							, a = r.x + i[0] - (Ve.x + i[0])
							, s = r.y + i[1] - (Ve.y + i[1])
							, l = Math.hypot(a, s);
						global_functions_exporter.playerList[r.id].addDist = l;
						let c = r.weapon == r.secondary && r.secondaryObject.range ? r.secondaryObject.range + 77 : r.primaryObject ? r.primaryObject.range + 77 : 219;
						global_functions_exporter.playerList[r.id].perfectMaxMeleeRange = c, l <= c && (at = !0), r.pCd <= 0 && l <= c && (e = !0)
					}), e && (ot = !0)
				}
			}

			function U(e, t) {
				return Math.hypot(t.y - e.y, t.x - e.x)
			}

			function R(e, t) {
				return Math.sqrt(Math.pow(t.y - e[2], 2) + Math.pow(t.x - e[1], 2))
			}

			function Y(e, t, n) {
				return t <= e + n / 2 && t >= e - n / 2 || (e >= 0 ? e + n / 2 > 3.14 && t <= e + n / 2 - 3.14 - 3.14 : e - n / 2 < -3.14 && t >= e - n / 2 + 3.14 + 3.14)
			}

			function W(e, t) {
				return Math.atan2(t.y - e.y, t.x - e.x)
			}
			unsafeWindow.distVel = function (e) {
				let t = e ? global_functions_exporter.playerList[e] : M
					, n = t.x + t.xvel - (Ve.x + Ve.xvel)
					, r = t.y + t.yvel - (Ve.y + Ve.yvel);
				return Math.hypot(n, r)
			};
			let lt = !1
				, ct = 120;
			var z = 0
				, N = !1
				, F = null;

			function Q(e) {
				let t = "";
				t = Ve.y < 2400 ? 15 : Ve.y > 6850 && Ve.y < 7550 ? 31 : 12, e ? (k = t, C = 11) : (storeEquip(11, !0), storeEquip(t))
			}
			document.hit = function (e, t) {
				t ? ((N = !N) ? z++ : --z < 0 && (z = 0), 1 == z && N ? ae(["7", [1]]) : 0 != z || N || ae(["7", [1]])) : (e ? z++ : --z < 0 && (z = 0), 1 == z && e ? null === F ? ae(["7", [1]]) : (clearTimeout(F), F = null) : 0 != z || e || (F = setTimeout(() => {
					ae(["7", [1]]), F = null
				}, 100)))
			};
			let ut = fe(function () {
					ae(["5", [d, !0]])
				})
				, ft = fe(function () {
					ae(["5", [h, !0]])
				});
			async function G(e) {
				11 == Ve.accessory && storeEquip(0, !0), ut(!0), storeEquip(7), storeEquip(18, !0), setTimeout(async () => {
					if(document.getElementById("instaChat")
						.checked && ae(["ch", [document.getElementById("instaChatData")
							.value
						]]), document.hit(!0), document.getElementById("spikeInstaIncludedInDynamicInsta")
						.checked) {
						let e, t = 1;
						if(document.getElementById("includeWeaponVariantInSpikeInsta")
							.checked) switch(global_functions_exporter.playerList[Ve.id].pVariant) {
						case 1:
							t = 1.09;
							break;
						case 2:
						case 3:
							t = 1.18
						}
						if(e = !document.getElementById("nearestEnemyCantSurviveCheck")
							.checked || global_functions_exporter.playerList[Ve.id].primaryObject.damage * t * (6 == M.hat ? .75 : 1) >= 100, Math.sqrt(Math.pow(Ve.y - M.y, 2) + Math.pow(Ve.x - M.x, 2)) < 100 && e) {
							let e = Math.atan2(M.y - Ve.y, M.x - Ve.x);
							document.getElementById("dynInstaDoubleSpikeInsta")
								.checked ? ce(g, e) : (ce(g, e - he(45)), ce(g, e + he(45)))
						}
					}
					document.getElementById("instaTickBased")
						.checked ? await Lt(1, Qe) : await t(112.5), document.getElementById("autoTheif")
						.checked || document.getElementById("supportDynamicDaggerInsta")
						.checked && 7 == Ve.primary && 15 == Ve.secondary ? 6 == M.hat || document.getElementById("supportDynamicDaggerInsta")
						.checked && 7 == Ve.primary && 15 == Ve.secondary ? (storeEquip(53), storeEquip(21, !0)) : (storeEquip(52), storeEquip(21, !0)) : (storeEquip(53), storeEquip(21, !0)), ut(!1), ft(!0), document.getElementById("instaTickBased")
						.checked ? await Lt(1, Qe) : await t(112.5), nt = !1, document.hit(!1), ft(!1), ae(["5", [h, !0]]), storeEquip(20), Ie(!1), Ce = !1, global_functions_exporter.cursorDisable = !1, Te = !1, await oe(), Q(), await ie(), r(), e && (We = !1)
				}, 1)
			}

			function K(e) {
				Ie(!0), Ce = !0, e && (nt = !0, Te = !0, We = !0, D && 1 == document.getElementById("instKillTribe")
					.checked && ae(["9", [null]])), ae(["5", [h, !0]]), ae(["c", [1]]), storeEquip(53);
				let t = Ve.accessory
					, n = Ve.hat;
				setTimeout(function () {
					storeEquip(n), storeEquip(t, !0)
				}, ct), setTimeout(function () {
					ae(["6", [Fe]]), ae(["c", [1]]), ae(["c", [0]])
				}, 100), setTimeout(function () {
					ae(["6", [15]]), ae(["c", [1]]), setTimeout(ae(["c", [0]]), 100), setTimeout(async () => {
						nt = !1, storeEquip(20), Ie(!1), Ce = !1, global_functions_exporter.cursorDisable = !1, Te = !1, await oe(), Q(), await ie(), r(), e && (We = !1, lt = !1)
					}, 50)
				}, 200)
			}
			async function Z(n) {
				if(document.getElementById("blockInsta")
					.checked && 11 == M.weapon && q(M)
					.some(e => e.id == Ve.id) && at) return;
				let o;
				n && (Ye = !0, We = !0), nt = !0, i(), Te = !0, D && 1 == document.getElementById("instKillTribe")
					.checked && Math.sqrt(Math.pow(Ve.y - D[2], 2) + Math.pow(Ve.x - D[1], 2)) < 205 && ae(["9", [null]]), (o = u ? Math.sqrt(Math.pow(Ve.y - u[2], 2) + Math.pow(Ve.x - u[1], 2)) : 1e3) < 700 && !at && 9 == Ve.weapon ? K(n) : async function (n) {
						Ie(!0), Ce = !0, ae(["5", [d, !0]]), await Lt(1, Qe), e(document.getElementById("actionBarItem0")) && 0 == M.xvel && 0 == M.yvel ? (ae(["5", [d, !0]]), document.hit(!0), storeEquip(7), storeEquip(18, !0), await Lt(1, Qe), ae(["6", [5]]), await Lt(1, Qe), ae(["5", [h, !0]]), ae(["6", [17]]), ae(["6", [31]]), ae(["6", [23]]), ae(["6", [9]]), ae(["5", [h, !0]]), storeEquip(53), await Lt(1, Qe), ae(["6", [38]]), ae(["6", [4]]), ae(["5", [h, !0]]), ae(["6", [15]]), ae(["5", [h, !0]]), document.hit(!1), G(n)) : e(document.getElementById("actionBarItem0")) ? (ae(["5", [d, !0]]), storeEquip(7), await Lt(1, Qe), document.hit(!0), await Lt(1, Qe), ae(["6", [Ne]]), await Lt(1, Qe), ae(["6", [17]]), await t(50), ae(["6", [31]]), await t(50), ae(["6", [23]]), await t(50), ae(["6", [9]]), await Lt(1, Qe), ae(["5", [h, !0]]), storeEquip(53), await Lt(1, Qe), document.hit(!1), nt = !1, storeEquip(20), Ie(!1), Ce = !1, global_functions_exporter.cursorDisable = !1, Te = !1, await oe(), Q(), await ie(), n && (We = !1), r(), await Lt(1, Qe), ae(["6", [38]]), await Lt(1, Qe), ae(["6", [4]]), n && (We = !1)) : G(n)
					}(n)
			}
			let dt, ht, pt = !1
				, At = !1
				, gt = !1;
			setInterval(() => {
				if(Ve.shameCount > 0 && At) {
					gt = !0, 7 !== Ve.hat && (dt = Ve.hat, qe.inProcess || storeEquip(7)), 13 !== Ve.accessory && (ht = Ve.accessory, qe.inProcess || storeEquip(13, !0));
					let e = setInterval(() => {
						0 == Ve.shameCount && (qe.inProcess || storeEquip(ht, !0), qe.inProcess || storeEquip(dt), At = !1, gt = !1, clearInterval(e))
					}, 5)
				}
			}, 5);

			function J() {
				ce(g, Ve.dir + he(45)), ce(g, Ve.dir - he(45)), ce(g, Ve.dir + he(90))
			}
			var ee = [void 0, void 0, void 0, void 0, void 0, void 0, void 0, void 0, void 0, void 0, void 0, void 0, void 0, void 0, void 0, void 0, void 0, void 0, void 0, void 0, void 0, void 0, void 0, void 0, void 0, void 0, void 0, void 0, void 0, void 0];
			let mt, yt = [];

			function te(e) {
				return e + Math.PI > Math.PI ? e - Math.PI : e + Math.PI
			}
			Object.defineProperty(Array.prototype, "splitTo", {
				value: function (e) {
					let t = [];
					for(let n = 0; n < this.length; n += e) t.push(this.slice(n, n + e));
					return t
				}
			}), global_functions_exporter.setZoom({
				code: "large"
			});
			let wt = 0
				, vt = (fe(() => {
					ae(["2", [wt]])
				}), !1)
				, bt = !1
				, xt = fe(function () {
					vt || ae(["5", [d, !0]])
				})
				, Bt = fe(function () {
					bt || ae(["5", [h, !0]])
				})
				, Et = !1
				, kt = !1
				, Ct = !1;

			function ne(e, t) {
				xt(!!e), Bt(!!t), Et = !(!e && !t), kt = !!e, Ct = !!t
			}

			function re(e) {
				e ? Ve.pCd <= 0 ? ne() : ne(!0, !1) : Ve.sCd <= 0 ? ne() : ne(!1, !0)
			}
			async function ie() {
				return new Promise((e, t) => {
					re(!0);
					let n = setInterval(() => {
						global_functions_exporter.playerList[Ve.id].pCd <= 0 && (ne(), clearInterval(n), e())
					}, 50)
				})
			}
			async function oe() {
				return new Promise((e, t) => {
					re(!1);
					let n = setInterval(() => {
						global_functions_exporter.playerList[Ve.id].sCd <= 0 && (ne(), clearInterval(n), e())
					}, 50)
				})
			}
			let It = []
				, Tt = [];

			function ae(e) {
				I.send(new Uint8Array(Array.from(msgpack.encode(e))))
			}

			function se(e) {
				ae(["13c", [0, 0, 1]]), storeEquip(e, !0)
			}

			function le(e) {
				storeEquip(e)
			}
			let Mt = 1;

			function ce(e, t = Math.atan2(Be - ke / 2, xe - Ee / 2)) {
				ae(["5", [e, null]]);
				for(var n = 0; n < Mt; n++) ae(["c", [1, t]]), ae(["c", [0, t]]);
				ae(["5", [Ve.weapon, !0]])
			}

			function ue() {
				null == T && (T = f), document.getElementById("aimBoostSpikeAtPlayer")
					.checked || (T = Math.atan2(Be - ke / 2, xe - Ee / 2));
				let e = document.getElementById("BSPIKEobjectTypeSel")
					.value ? document.getElementById("BSPIKEobjectTypeSel")
					.value : "spikeType";
				switch(e) {
				case "millType":
					e = m;
					break;
				case "spikeType":
					e = g;
					break;
				case "wallType":
					e = A;
					break;
				case "mineType":
					e = y;
					break;
				case "boostType":
					e = w;
					break;
				case "turretType":
					e = v;
					break;
				case "spawnpadType":
					e = b
				}
				if(e == m) {
					let e = !0;
					for(let t = 0; t < 5; t++)
						if(e) ce(w, T), e = !1;
						else {
							let e = T + he(72 * t);
							ce(m, e)
						}
				} else ce(e, T + he(90)), ce(e, T - he(90)), ce(w, T);
				ae(["33", [T]])
			}

			function fe(e, t = 0, n) {
				return function (r) {
					r ? (clearInterval(n), n = setInterval(e, t)) : clearInterval(n)
				}
			}
			document.getElementById("cpsForMacros")
				.addEventListener("change", function () {
					Mt = Number(document.getElementById("cpsForMacros")
						.value)
				});
			const Pt = fe(() => {
					ce(p)
				})
				, Ot = fe(() => {
					document.getElementById("xv1mode")
						.checked ? ce(g, Number.MAX_VALUE) : ce(g)
				})
				, Dt = fe(() => {
					if(document.getElementById("boostQuadMode")
						.checked)
						for(let e = 0; e < 4; e++) {
							let t = Ve.dir + he(90 * e) + (document.getElementById("xv1mode")
								.checked ? Number.MAX_VALUE : 0);
							ce(w, t)
						} else ce(w)
				});
			setInterval(() => {
				document.getElementById("autoBlocker")
					.checked && !Te && (ce(v, Ve.dir + he(45)), ce(v, Ve.dir - he(45)))
			}, 500), setInterval(() => {
				if(document.getElementById("autoPits")
					.checked && !at && !Te)
					for(let e = 0; e < 4; e++) {
						let t = Ve.dir + he(90 * e);
						ce(w, t + 30)
					}
			}, 300);
			var de = !1;
			const Lt = async (e, t) => new Promise((n, r) => {
				let i = setInterval(() => {
					t + e <= Qe && (clearInterval(i), n(Qe))
				}, 1)
			});
			let _t = null
				, St = !1
				, qt = fe(() => {
					ce(m, Math.atan2(Be - ke / 2, xe - Ee / 2)), ce(m, Math.atan2(Be - ke / 2, xe - Ee / 2) - he(63.9315)), ce(m, Math.atan2(Be - ke / 2, xe - Ee / 2) + he(63.9315))
				});

			function he(e) {
				return .01745329251 * e
			}

			function pe() {
				for(let t = 0; 9 > t; t++) e(document.getElementById("actionBarItem" + t.toString())) && (d = t);
				for(let t = 9; 16 > t; t++) e(document.getElementById("actionBarItem" + t.toString())) && (h = t);
				for(let t = 16; 19 > t; t++) e(document.getElementById("actionBarItem" + t.toString())) && (p = t - 16);
				for(let t = 19; 22 > t; t++) e(document.getElementById("actionBarItem" + t.toString())) && (A = t - 16);
				for(let t = 22; 26 > t; t++) e(document.getElementById("actionBarItem" + t.toString())) && (g = t - 16);
				for(let t = 26; 29 > t; t++) e(document.getElementById("actionBarItem" + t.toString())) && (m = t - 16);
				for(let t = 29; 31 > t; t++) e(document.getElementById("actionBarItem" + t.toString())) && (y = t - 16);
				for(let t = 31; 33 > t; t++) e(document.getElementById("actionBarItem" + t.toString())) && (w = t - 16);
				for(let t = 33; 36 > t; t++) e(document.getElementById("actionBarItem" + t.toString())) && (v = t - 16);
				for(let t = 36; 37 > t; t++) e(document.getElementById("actionBarItem" + t.toString())) && (b = t - 16);
				for(let t = 37; 39 > t; t++) e(document.getElementById("actionBarItem" + t.toString())) && (v = t - 16)
			}

			function Ae(e) {
				ae(["ch", [e]])
			}
			document.addEventListener("keydown", async e => {
				let t = document.activeElement.id;
				if("chatBox" != t && "instaChatData" != t && "allianceInput" != t && "fixedClanCreationValue" != t && "achatEnemyVal" != t && "spikeHotkeyValue" != t && "trapHotkeyValue" != t && "healingHotkeyValue" != t && "instaHotkeyValue" != t && "tripleMillHotkeyValue" != t && "tripleTeleporterValue" != t) {
					if(e.key == document.getElementById("healingHotkeyValue")
						.value && Pt(!0), e.key == document.getElementById("trapHotkeyValue")
						.value && Dt(!0), e.key == document.getElementById("spikeHotkeyValue")
						.value && Ot(!0), "`" == e.key && (e.preventDefault(), ae(["5", ["__proto__", !0]])), "Escape" == e.key && (document.getElementById("modMenus")
							.style.display = de ? "block" : "none", de = !de), " " == e.key) {
						if(St) setTimeout(() => {
							ae(["33", [null]]), T = null
						}, 10), clearInterval(_t);
						else {
							let e = document.getElementById("BSPIKEobjectTypeSel")
								.value ? document.getElementById("BSPIKEobjectTypeSel")
								.value : "spikeType";
							_t = "millType" == e ? setInterval(() => ue(), 300) : setInterval(() => ue(), 100)
						}
						St = !St, document.getElementById("autoBoostSpikerStateMenu")
							.innerHTML = St
					}
					e.key == document.getElementById("tripleTeleporterValue")
						.value && (ce(v, Math.atan2(Be - ke / 2, xe - Ee / 2)), ce(v, Math.atan2(Be - ke / 2, xe - Ee / 2) - he(73.7399)), ce(v, Math.atan2(Be - ke / 2, xe - Ee / 2) + he(73.7399))), e.key == document.getElementById("instaHotkeyValue")
						.value && Z(), e.key == document.getElementById("tripleMillHotkeyValue")
						.value && qt(!0)
				}
			}), document.addEventListener("keyup", e => {
				let t = document.activeElement.id;
				"chatBox" != t && "instaChatData" != t && "allianceInput" != t && "fixedClanCreationValue" != t && "achatEnemyVal" != t && "spikeHotkeyValue" != t && "trapHotkeyValue" != t && "healingHotkeyValue" != t && "instaHotkeyValue" != t && "tripleMillHotkeyValue" != t && "tripleTeleporterValue" != t && (e.key == document.getElementById("healingHotkeyValue")
					.value && Pt(!1), e.key == document.getElementById("trapHotkeyValue")
					.value && Dt(!1), e.key == document.getElementById("spikeHotkeyValue")
					.value && Ot(!1), e.key == document.getElementById("tripleMillHotkeyValue")
					.value && qt(!1))
			}), setInterval(() => {
				var t = 3;
				try {
					if(e(document.getElementById("actionBarItem26"))) {
						let e;
						(e = document.createElement("div"))
						.id = "windmillCounts26", e.style.cssText = "position: absolute;top: 0;padding-left: 5px;font-size: 2em;color: #fff;", document.getElementById("windmillCounts26") || document.getElementById("actionBarItem26")
							.appendChild(e), document.getElementById("windmillCounts26")
							.innerHTML = global_functions_exporter.myPlayerBundleObject.itemCounts[t] || 0
					}
				} catch (e) {}
				try {
					if(e(document.getElementById("actionBarItem27"))) {
						let e;
						(e = document.createElement("div"))
						.id = "windmillCounts27", e.style.cssText = "position: absolute;top: 0;padding-left: 5px;font-size: 2em;color: #fff;", document.getElementById("windmillCounts27") || document.getElementById("actionBarItem27")
							.appendChild(e), document.getElementById("windmillCounts27")
							.innerHTML = global_functions_exporter.myPlayerBundleObject.itemCounts[t] || 0
					}
				} catch (e) {}
				try {
					if(e(document.getElementById("actionBarItem28"))) {
						let e;
						(e = document.createElement("div"))
						.id = "windmillCounts28", e.style.cssText = "position: absolute;top: 0;padding-left: 5px;font-size: 2em;color: #fff;", document.getElementById("windmillCounts28") || document.getElementById("actionBarItem28")
							.appendChild(e), document.getElementById("windmillCounts28")
							.innerHTML = global_functions_exporter.myPlayerBundleObject.itemCounts[t] || 0
					}
				} catch (e) {}
				t = 6;
				try {
					if(e(document.getElementById("actionBarItem32"))) {
						let e;
						(e = document.createElement("div"))
						.id = "boostCounts32", e.style.cssText = "position: absolute;top: 0;padding-left: 5px;font-size: 2em;color: #fff;", document.getElementById("boostCounts32") || document.getElementById("actionBarItem32")
							.appendChild(e), document.getElementById("boostCounts32")
							.innerHTML = global_functions_exporter.myPlayerBundleObject.itemCounts[t] || 0
					}
				} catch (e) {}
				t = 5;
				try {
					if(e(document.getElementById("actionBarItem31"))) {
						let e;
						(e = document.createElement("div"))
						.id = "trapCounts31", e.style.cssText = "position: absolute;top: 0;padding-left: 5px;font-size: 2em;color: #fff;", document.getElementById("trapCounts31") || document.getElementById("actionBarItem31")
							.appendChild(e), document.getElementById("trapCounts31")
							.innerHTML = global_functions_exporter.myPlayerBundleObject.itemCounts[t] || 0
					}
				} catch (e) {}
				t = 2;
				for(var n = 0; n < 4; n++) try {
					if(e(document.getElementById("actionBarItem" + (22 + n)))) {
						let e;
						(e = document.createElement("div"))
						.id = "spikeCounts" + (22 + n), e.style.cssText = "position: absolute;top: 0;padding-left: 5px;font-size: 2em;color: #fff;", document.getElementById("spikeCounts" + (22 + n)) || document.getElementById("actionBarItem" + (22 + n))
							.appendChild(e), document.getElementById("spikeCounts" + (22 + n))
							.innerHTML = global_functions_exporter.myPlayerBundleObject.itemCounts[t] || 0
					}
				} catch (e) {}
				try {
					if(e(document.getElementById("actionBarItem" + (22 + n)))) {
						let e;
						(e = document.createElement("div"))
						.id = "cookieCounts17", e.style.cssText = "position: absolute;top: 0;padding-left: 5px;font-size: 2em;color: #fff;", document.getElementById("cookieCounts17") || document.getElementById("actionBarItem17")
							.appendChild(e), document.getElementById("cookieCounts17")
							.innerHTML = Math.floor(Number(document.getElementById("foodDisplay")
								.innerHTML) / 15)
					}
				} catch (e) {}
				try {
					if(e(document.getElementById("actionBarItem" + (22 + n)))) {
						let e;
						(e = document.createElement("div"))
						.id = "appleCounts16", e.style.cssText = "position: absolute;top: 0;padding-left: 5px;font-size: 2em;color: #fff;", document.getElementById("appleCounts16") || document.getElementById("actionBarItem16")
							.appendChild(e), document.getElementById("appleCounts16")
							.innerHTML = Math.floor(Number(document.getElementById("foodDisplay")
								.innerHTML) / 10)
					}
				} catch (e) {}
				t = 7;
				try {
					if(e(document.getElementById("actionBarItem33"))) {
						let e;
						(e = document.createElement("div"))
						.id = "turretCounts33", e.style.cssText = "position: absolute;top: 0;padding-left: 5px;font-size: 2em;color: #fff;", document.getElementById("turretCounts33") || document.getElementById("actionBarItem33")
							.appendChild(e), document.getElementById("turretCounts33")
							.innerHTML = global_functions_exporter.myPlayerBundleObject.itemCounts[t] || 0
					}
				} catch (e) {}
				t = 1;
				for(n = 0; n < 3; n++) try {
					if(e(document.getElementById("actionBarItem" + (19 + n)))) {
						let e;
						(e = document.createElement("div"))
						.id = "wallCounts" + (19 + n), e.style.cssText = "position: absolute;top: 0;padding-left: 5px;font-size: 2em;color: #fff;", document.getElementById("wallCounts" + (19 + n)) || document.getElementById("actionBarItem" + (19 + n))
							.appendChild(e), document.getElementById("wallCounts" + (19 + n))
							.innerHTML = global_functions_exporter.myPlayerBundleObject.itemCounts[t] || 0
					}
				} catch (e) {}
			}, 1e3)
		}
	}, 0);