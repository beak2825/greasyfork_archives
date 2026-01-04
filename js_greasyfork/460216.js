// ==UserScript==
// @name         YouTube 生词翻译 (Explain YouTube Caption)
// @namespace    https://greasyfork.org/en/users/168542-archeb
// @version      0.4.1
// @description  explain those unknown words in youtube caption
// @author       Archeb
// @match        https://www.youtube.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=youtube.com
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/460216/YouTube%20%E7%94%9F%E8%AF%8D%E7%BF%BB%E8%AF%91%20%28Explain%20YouTube%20Caption%29.user.js
// @updateURL https://update.greasyfork.org/scripts/460216/YouTube%20%E7%94%9F%E8%AF%8D%E7%BF%BB%E8%AF%91%20%28Explain%20YouTube%20Caption%29.meta.js
// ==/UserScript==

var caiyun_apiurl = "https://api.interpreter.caiyunai.com/v1/translator";
var caiyun_apitoken = "wno8rhqiranvo8ducvbw"; // 请勿滥用，我懒得换，用完了自己去申请
var word_freq = 5000; // 定义单词出现频率，低于此频率的单词将被翻译

/**
 * Original file: /npm/js-md5@0.7.3/src/md5.js
 */
// prettier-ignore
!function () { "use strict"; var ERROR = "input is invalid type", WINDOW = "object" == typeof window, root = WINDOW ? window : {}; root.JS_MD5_NO_WINDOW && (WINDOW = !1); var WEB_WORKER = !WINDOW && "object" == typeof self, NODE_JS = !root.JS_MD5_NO_NODE_JS && "object" == typeof process && process.versions && process.versions.node; NODE_JS ? root = global : WEB_WORKER && (root = self); var COMMON_JS = !root.JS_MD5_NO_COMMON_JS && "object" == typeof module && module.exports, AMD = "function" == typeof define && define.amd, ARRAY_BUFFER = !root.JS_MD5_NO_ARRAY_BUFFER && "undefined" != typeof ArrayBuffer, HEX_CHARS = "0123456789abcdef".split(""), EXTRA = [128, 32768, 8388608, -2147483648], SHIFT = [0, 8, 16, 24], OUTPUT_TYPES = ["hex", "array", "digest", "buffer", "arrayBuffer", "base64"], BASE64_ENCODE_CHAR = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/".split(""), blocks = [], buffer8; if (ARRAY_BUFFER) { var buffer = new ArrayBuffer(68); buffer8 = new Uint8Array(buffer), blocks = new Uint32Array(buffer) } !root.JS_MD5_NO_NODE_JS && Array.isArray || (Array.isArray = function (t) { return "[object Array]" === Object.prototype.toString.call(t) }), !ARRAY_BUFFER || !root.JS_MD5_NO_ARRAY_BUFFER_IS_VIEW && ArrayBuffer.isView || (ArrayBuffer.isView = function (t) { return "object" == typeof t && t.buffer && t.buffer.constructor === ArrayBuffer }); var createOutputMethod = function (r) { return function (t) { return new Md5(!0).update(t)[r]() } }, createMethod = function () { var r = createOutputMethod("hex"); NODE_JS && (r = nodeWrap(r)), r.create = function () { return new Md5 }, r.update = function (t) { return r.create().update(t) }; for (var t = 0; t < OUTPUT_TYPES.length; ++t) { var e = OUTPUT_TYPES[t]; r[e] = createOutputMethod(e) } return r }, nodeWrap = function (method) { var crypto = eval("require('crypto')"), Buffer = eval("require('buffer').Buffer"), nodeMethod = function (t) { if ("string" == typeof t) return crypto.createHash("md5").update(t, "utf8").digest("hex"); if (null == t) throw ERROR; return t.constructor === ArrayBuffer && (t = new Uint8Array(t)), Array.isArray(t) || ArrayBuffer.isView(t) || t.constructor === Buffer ? crypto.createHash("md5").update(new Buffer(t)).digest("hex") : method(t) }; return nodeMethod }; function Md5(t) { if (t) blocks[0] = blocks[16] = blocks[1] = blocks[2] = blocks[3] = blocks[4] = blocks[5] = blocks[6] = blocks[7] = blocks[8] = blocks[9] = blocks[10] = blocks[11] = blocks[12] = blocks[13] = blocks[14] = blocks[15] = 0, this.blocks = blocks, this.buffer8 = buffer8; else if (ARRAY_BUFFER) { var r = new ArrayBuffer(68); this.buffer8 = new Uint8Array(r), this.blocks = new Uint32Array(r) } else this.blocks = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]; this.h0 = this.h1 = this.h2 = this.h3 = this.start = this.bytes = this.hBytes = 0, this.finalized = this.hashed = !1, this.first = !0 } Md5.prototype.update = function (t) { if (!this.finalized) { var r, e = typeof t; if ("string" !== e) { if ("object" !== e) throw ERROR; if (null === t) throw ERROR; if (ARRAY_BUFFER && t.constructor === ArrayBuffer) t = new Uint8Array(t); else if (!(Array.isArray(t) || ARRAY_BUFFER && ArrayBuffer.isView(t))) throw ERROR; r = !0 } for (var s, i, o = 0, h = t.length, f = this.blocks, a = this.buffer8; o < h;) { if (this.hashed && (this.hashed = !1, f[0] = f[16], f[16] = f[1] = f[2] = f[3] = f[4] = f[5] = f[6] = f[7] = f[8] = f[9] = f[10] = f[11] = f[12] = f[13] = f[14] = f[15] = 0), r) if (ARRAY_BUFFER) for (i = this.start; o < h && i < 64; ++o)a[i++] = t[o]; else for (i = this.start; o < h && i < 64; ++o)f[i >> 2] |= t[o] << SHIFT[3 & i++]; else if (ARRAY_BUFFER) for (i = this.start; o < h && i < 64; ++o)(s = t.charCodeAt(o)) < 128 ? a[i++] = s : (s < 2048 ? a[i++] = 192 | s >> 6 : (s < 55296 || 57344 <= s ? a[i++] = 224 | s >> 12 : (s = 65536 + ((1023 & s) << 10 | 1023 & t.charCodeAt(++o)), a[i++] = 240 | s >> 18, a[i++] = 128 | s >> 12 & 63), a[i++] = 128 | s >> 6 & 63), a[i++] = 128 | 63 & s); else for (i = this.start; o < h && i < 64; ++o)(s = t.charCodeAt(o)) < 128 ? f[i >> 2] |= s << SHIFT[3 & i++] : (s < 2048 ? f[i >> 2] |= (192 | s >> 6) << SHIFT[3 & i++] : (s < 55296 || 57344 <= s ? f[i >> 2] |= (224 | s >> 12) << SHIFT[3 & i++] : (s = 65536 + ((1023 & s) << 10 | 1023 & t.charCodeAt(++o)), f[i >> 2] |= (240 | s >> 18) << SHIFT[3 & i++], f[i >> 2] |= (128 | s >> 12 & 63) << SHIFT[3 & i++]), f[i >> 2] |= (128 | s >> 6 & 63) << SHIFT[3 & i++]), f[i >> 2] |= (128 | 63 & s) << SHIFT[3 & i++]); this.lastByteIndex = i, this.bytes += i - this.start, 64 <= i ? (this.start = i - 64, this.hash(), this.hashed = !0) : this.start = i } return 4294967295 < this.bytes && (this.hBytes += this.bytes / 4294967296 << 0, this.bytes = this.bytes % 4294967296), this } }, Md5.prototype.finalize = function () { if (!this.finalized) { this.finalized = !0; var t = this.blocks, r = this.lastByteIndex; t[r >> 2] |= EXTRA[3 & r], 56 <= r && (this.hashed || this.hash(), t[0] = t[16], t[16] = t[1] = t[2] = t[3] = t[4] = t[5] = t[6] = t[7] = t[8] = t[9] = t[10] = t[11] = t[12] = t[13] = t[14] = t[15] = 0), t[14] = this.bytes << 3, t[15] = this.hBytes << 3 | this.bytes >>> 29, this.hash() } }, Md5.prototype.hash = function () { var t, r, e, s, i, o, h = this.blocks; this.first ? r = ((r = ((t = ((t = h[0] - 680876937) << 7 | t >>> 25) - 271733879 << 0) ^ (e = ((e = (-271733879 ^ (s = ((s = (-1732584194 ^ 2004318071 & t) + h[1] - 117830708) << 12 | s >>> 20) + t << 0) & (-271733879 ^ t)) + h[2] - 1126478375) << 17 | e >>> 15) + s << 0) & (s ^ t)) + h[3] - 1316259209) << 22 | r >>> 10) + e << 0 : (t = this.h0, r = this.h1, e = this.h2, r = ((r += ((t = ((t += ((s = this.h3) ^ r & (e ^ s)) + h[0] - 680876936) << 7 | t >>> 25) + r << 0) ^ (e = ((e += (r ^ (s = ((s += (e ^ t & (r ^ e)) + h[1] - 389564586) << 12 | s >>> 20) + t << 0) & (t ^ r)) + h[2] + 606105819) << 17 | e >>> 15) + s << 0) & (s ^ t)) + h[3] - 1044525330) << 22 | r >>> 10) + e << 0), r = ((r += ((t = ((t += (s ^ r & (e ^ s)) + h[4] - 176418897) << 7 | t >>> 25) + r << 0) ^ (e = ((e += (r ^ (s = ((s += (e ^ t & (r ^ e)) + h[5] + 1200080426) << 12 | s >>> 20) + t << 0) & (t ^ r)) + h[6] - 1473231341) << 17 | e >>> 15) + s << 0) & (s ^ t)) + h[7] - 45705983) << 22 | r >>> 10) + e << 0, r = ((r += ((t = ((t += (s ^ r & (e ^ s)) + h[8] + 1770035416) << 7 | t >>> 25) + r << 0) ^ (e = ((e += (r ^ (s = ((s += (e ^ t & (r ^ e)) + h[9] - 1958414417) << 12 | s >>> 20) + t << 0) & (t ^ r)) + h[10] - 42063) << 17 | e >>> 15) + s << 0) & (s ^ t)) + h[11] - 1990404162) << 22 | r >>> 10) + e << 0, r = ((r += ((t = ((t += (s ^ r & (e ^ s)) + h[12] + 1804603682) << 7 | t >>> 25) + r << 0) ^ (e = ((e += (r ^ (s = ((s += (e ^ t & (r ^ e)) + h[13] - 40341101) << 12 | s >>> 20) + t << 0) & (t ^ r)) + h[14] - 1502002290) << 17 | e >>> 15) + s << 0) & (s ^ t)) + h[15] + 1236535329) << 22 | r >>> 10) + e << 0, r = ((r += ((s = ((s += (r ^ e & ((t = ((t += (e ^ s & (r ^ e)) + h[1] - 165796510) << 5 | t >>> 27) + r << 0) ^ r)) + h[6] - 1069501632) << 9 | s >>> 23) + t << 0) ^ t & ((e = ((e += (t ^ r & (s ^ t)) + h[11] + 643717713) << 14 | e >>> 18) + s << 0) ^ s)) + h[0] - 373897302) << 20 | r >>> 12) + e << 0, r = ((r += ((s = ((s += (r ^ e & ((t = ((t += (e ^ s & (r ^ e)) + h[5] - 701558691) << 5 | t >>> 27) + r << 0) ^ r)) + h[10] + 38016083) << 9 | s >>> 23) + t << 0) ^ t & ((e = ((e += (t ^ r & (s ^ t)) + h[15] - 660478335) << 14 | e >>> 18) + s << 0) ^ s)) + h[4] - 405537848) << 20 | r >>> 12) + e << 0, r = ((r += ((s = ((s += (r ^ e & ((t = ((t += (e ^ s & (r ^ e)) + h[9] + 568446438) << 5 | t >>> 27) + r << 0) ^ r)) + h[14] - 1019803690) << 9 | s >>> 23) + t << 0) ^ t & ((e = ((e += (t ^ r & (s ^ t)) + h[3] - 187363961) << 14 | e >>> 18) + s << 0) ^ s)) + h[8] + 1163531501) << 20 | r >>> 12) + e << 0, r = ((r += ((s = ((s += (r ^ e & ((t = ((t += (e ^ s & (r ^ e)) + h[13] - 1444681467) << 5 | t >>> 27) + r << 0) ^ r)) + h[2] - 51403784) << 9 | s >>> 23) + t << 0) ^ t & ((e = ((e += (t ^ r & (s ^ t)) + h[7] + 1735328473) << 14 | e >>> 18) + s << 0) ^ s)) + h[12] - 1926607734) << 20 | r >>> 12) + e << 0, r = ((r += ((o = (s = ((s += ((i = r ^ e) ^ (t = ((t += (i ^ s) + h[5] - 378558) << 4 | t >>> 28) + r << 0)) + h[8] - 2022574463) << 11 | s >>> 21) + t << 0) ^ t) ^ (e = ((e += (o ^ r) + h[11] + 1839030562) << 16 | e >>> 16) + s << 0)) + h[14] - 35309556) << 23 | r >>> 9) + e << 0, r = ((r += ((o = (s = ((s += ((i = r ^ e) ^ (t = ((t += (i ^ s) + h[1] - 1530992060) << 4 | t >>> 28) + r << 0)) + h[4] + 1272893353) << 11 | s >>> 21) + t << 0) ^ t) ^ (e = ((e += (o ^ r) + h[7] - 155497632) << 16 | e >>> 16) + s << 0)) + h[10] - 1094730640) << 23 | r >>> 9) + e << 0, r = ((r += ((o = (s = ((s += ((i = r ^ e) ^ (t = ((t += (i ^ s) + h[13] + 681279174) << 4 | t >>> 28) + r << 0)) + h[0] - 358537222) << 11 | s >>> 21) + t << 0) ^ t) ^ (e = ((e += (o ^ r) + h[3] - 722521979) << 16 | e >>> 16) + s << 0)) + h[6] + 76029189) << 23 | r >>> 9) + e << 0, r = ((r += ((o = (s = ((s += ((i = r ^ e) ^ (t = ((t += (i ^ s) + h[9] - 640364487) << 4 | t >>> 28) + r << 0)) + h[12] - 421815835) << 11 | s >>> 21) + t << 0) ^ t) ^ (e = ((e += (o ^ r) + h[15] + 530742520) << 16 | e >>> 16) + s << 0)) + h[2] - 995338651) << 23 | r >>> 9) + e << 0, r = ((r += ((s = ((s += (r ^ ((t = ((t += (e ^ (r | ~s)) + h[0] - 198630844) << 6 | t >>> 26) + r << 0) | ~e)) + h[7] + 1126891415) << 10 | s >>> 22) + t << 0) ^ ((e = ((e += (t ^ (s | ~r)) + h[14] - 1416354905) << 15 | e >>> 17) + s << 0) | ~t)) + h[5] - 57434055) << 21 | r >>> 11) + e << 0, r = ((r += ((s = ((s += (r ^ ((t = ((t += (e ^ (r | ~s)) + h[12] + 1700485571) << 6 | t >>> 26) + r << 0) | ~e)) + h[3] - 1894986606) << 10 | s >>> 22) + t << 0) ^ ((e = ((e += (t ^ (s | ~r)) + h[10] - 1051523) << 15 | e >>> 17) + s << 0) | ~t)) + h[1] - 2054922799) << 21 | r >>> 11) + e << 0, r = ((r += ((s = ((s += (r ^ ((t = ((t += (e ^ (r | ~s)) + h[8] + 1873313359) << 6 | t >>> 26) + r << 0) | ~e)) + h[15] - 30611744) << 10 | s >>> 22) + t << 0) ^ ((e = ((e += (t ^ (s | ~r)) + h[6] - 1560198380) << 15 | e >>> 17) + s << 0) | ~t)) + h[13] + 1309151649) << 21 | r >>> 11) + e << 0, r = ((r += ((s = ((s += (r ^ ((t = ((t += (e ^ (r | ~s)) + h[4] - 145523070) << 6 | t >>> 26) + r << 0) | ~e)) + h[11] - 1120210379) << 10 | s >>> 22) + t << 0) ^ ((e = ((e += (t ^ (s | ~r)) + h[2] + 718787259) << 15 | e >>> 17) + s << 0) | ~t)) + h[9] - 343485551) << 21 | r >>> 11) + e << 0, this.first ? (this.h0 = t + 1732584193 << 0, this.h1 = r - 271733879 << 0, this.h2 = e - 1732584194 << 0, this.h3 = s + 271733878 << 0, this.first = !1) : (this.h0 = this.h0 + t << 0, this.h1 = this.h1 + r << 0, this.h2 = this.h2 + e << 0, this.h3 = this.h3 + s << 0) }, Md5.prototype.hex = function () { this.finalize(); var t = this.h0, r = this.h1, e = this.h2, s = this.h3; return HEX_CHARS[t >> 4 & 15] + HEX_CHARS[15 & t] + HEX_CHARS[t >> 12 & 15] + HEX_CHARS[t >> 8 & 15] + HEX_CHARS[t >> 20 & 15] + HEX_CHARS[t >> 16 & 15] + HEX_CHARS[t >> 28 & 15] + HEX_CHARS[t >> 24 & 15] + HEX_CHARS[r >> 4 & 15] + HEX_CHARS[15 & r] + HEX_CHARS[r >> 12 & 15] + HEX_CHARS[r >> 8 & 15] + HEX_CHARS[r >> 20 & 15] + HEX_CHARS[r >> 16 & 15] + HEX_CHARS[r >> 28 & 15] + HEX_CHARS[r >> 24 & 15] + HEX_CHARS[e >> 4 & 15] + HEX_CHARS[15 & e] + HEX_CHARS[e >> 12 & 15] + HEX_CHARS[e >> 8 & 15] + HEX_CHARS[e >> 20 & 15] + HEX_CHARS[e >> 16 & 15] + HEX_CHARS[e >> 28 & 15] + HEX_CHARS[e >> 24 & 15] + HEX_CHARS[s >> 4 & 15] + HEX_CHARS[15 & s] + HEX_CHARS[s >> 12 & 15] + HEX_CHARS[s >> 8 & 15] + HEX_CHARS[s >> 20 & 15] + HEX_CHARS[s >> 16 & 15] + HEX_CHARS[s >> 28 & 15] + HEX_CHARS[s >> 24 & 15] }, Md5.prototype.toString = Md5.prototype.hex, Md5.prototype.digest = function () { this.finalize(); var t = this.h0, r = this.h1, e = this.h2, s = this.h3; return [255 & t, t >> 8 & 255, t >> 16 & 255, t >> 24 & 255, 255 & r, r >> 8 & 255, r >> 16 & 255, r >> 24 & 255, 255 & e, e >> 8 & 255, e >> 16 & 255, e >> 24 & 255, 255 & s, s >> 8 & 255, s >> 16 & 255, s >> 24 & 255] }, Md5.prototype.array = Md5.prototype.digest, Md5.prototype.arrayBuffer = function () { this.finalize(); var t = new ArrayBuffer(16), r = new Uint32Array(t); return r[0] = this.h0, r[1] = this.h1, r[2] = this.h2, r[3] = this.h3, t }, Md5.prototype.buffer = Md5.prototype.arrayBuffer, Md5.prototype.base64 = function () { for (var t, r, e, s = "", i = this.array(), o = 0; o < 15;)t = i[o++], r = i[o++], e = i[o++], s += BASE64_ENCODE_CHAR[t >>> 2] + BASE64_ENCODE_CHAR[63 & (t << 4 | r >>> 4)] + BASE64_ENCODE_CHAR[63 & (r << 2 | e >>> 6)] + BASE64_ENCODE_CHAR[63 & e]; return t = i[o], s += BASE64_ENCODE_CHAR[t >>> 2] + BASE64_ENCODE_CHAR[t << 4 & 63] + "==" }; var exports = createMethod(); COMMON_JS ? module.exports = exports : (root.md5 = exports, AMD && define(function () { return exports })) }();

/**
 * Original file: /npm/fetch-jsonp@1.2.3/build/fetch-jsonp.js
 */
// prettier-ignore
!function (e, t) { if ("function" == typeof define && define.amd) define(["exports", "module"], t); else if ("undefined" != typeof exports && "undefined" != typeof module) t(exports, module); else { var n = { exports: {} }; t(n.exports, n), e.fetchJsonp = n.exports } }(this, (function (e, t) { "use strict"; var n = 5e3, o = "callback"; function r() { return "jsonp_" + Date.now() + "_" + Math.ceil(1e5 * Math.random()) } function i(e) { try { delete window[e] } catch (t) { window[e] = void 0 } } function c(e) { var t = document.getElementById(e); t && document.getElementsByTagName("head")[0].removeChild(t) } t.exports = function (e) { var t = arguments.length <= 1 || void 0 === arguments[1] ? {} : arguments[1], u = e, d = t.timeout || n, s = t.jsonpCallback || o, a = void 0; return new Promise((function (n, o) { var f = t.jsonpCallbackFunction || r(), l = s + "_" + f; window[f] = function (e) { n({ ok: !0, json: function () { return Promise.resolve(e) } }), a && clearTimeout(a), c(l), i(f) }, u += -1 === u.indexOf("?") ? "?" : "&"; var m = document.createElement("script"); m.setAttribute("src", "" + u + s + "=" + f), t.charset && m.setAttribute("charset", t.charset), t.nonce && m.setAttribute("nonce", t.nonce), t.referrerPolicy && m.setAttribute("referrerPolicy", t.referrerPolicy), m.id = l, document.getElementsByTagName("head")[0].appendChild(m), a = setTimeout((function () { o(new Error("JSONP request to " + e + " timed out")), i(f), c(l), window[f] = function () { i(f) } }), d), m.onerror = function () { o(new Error("JSONP request to " + e + " failed")), i(f), c(l), a && clearTimeout(a) } })) } }));

var translationCache = {};

async function caiyun_translate(text, from, to) {
	return new Promise((resolve, reject) => {
		fetch(caiyun_apiurl, {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
				"x-authorization": "token " + caiyun_apitoken,
			},
			mode: "cors",
			body: JSON.stringify({
				source: text,
				trans_type: from + "2" + to,
				request_id: "wikitranslate",
			}),
		})
			.then((response) => {
				return response.json();
			})
			.then((json) => {
				if (json.target && json.target.length > 0) {
					resolve(json.target);
				} else {
					reject(json);
				}
			})
			.catch((error) => {
				reject(error);
			});
	});
}

var words = null;

// Load the word frequency file into a string and cache it
fetch("https://raw.githubusercontent.com/mahavivo/vocabulary/master/vocabulary/COCA60000.txt")
	.then((response) => response.text())
	.then((text) => {
		// Split the text into an array of words
		words = text.split(/\s+/);
		// add the common words to the beginning of the list
		// prettier-ignore
		let common_words=["s","going","made","is","are","re","was","were","an","won","t","has","had","been","did","does","cannot","got","men","am","are","be","been","being","can","could","did","do","does","had","has","have","he","her","him","his","I","is","it","may","might","must","shall","should","that","the","their","them","they","us","was","we","were","will","with","would","you","your","ain't","aren't","can't","could've","couldn't","didn't","doesn't","don't","hadn't","hasn't","haven't","he'd","he'll","he's","how'd","how'll","how's","i'd","i'll","i'm","i've","isn't","it'd","it'll","it's","let's","ma'am","might've","must've","mustn't","needn't","o'clock","shan't","she","she'd","she'll","she's","should've","shouldn't","somebody's","someone's","something's","that'll","that's","there's","they'd","they'll","they're","they've","wasn't","we'd","we'll","we're","we've","weren't","what'd","what'll","what're","what's","what've","when's","where'd","where's","who'd","who'll","who's","who've","why'd","why'll","why's","won't","would've","wouldn't","you'd","you'll","you're","you've","A","B","C","D","E","F","G","H","I","J","K","L","M","N","O","P","Q","R","S","T","U","V","W","X","Y","Z",];
		words.unshift(...common_words);
	});

// Search for elements with the selector "span.ytp-caption-segment" every 100ms
setInterval(async () => {
	var spans = document.querySelectorAll("span.ytp-caption-segment");
	for (seg of spans) {
		// to see if the segment has childNodes
		if (seg.childNodes.length > 0) {
			// it's the streaming caption, handle childNode one by one
			for (child of seg.childNodes) {
				if (child.nodeType == 3 && child.explained == null) {
					// it's a text node, handle it
					child.explained = true;
					explain(child);
				}
			}
		} else {
			// it's a normal caption
			if (seg.explained == null) {
				seg.explained = true;
				explain(seg);
			}
		}
	}
}, 50);

// Explain a segment
async function explain(seg) {
	// Get the text of the segment
	var text = seg.textContent;
	var wordsInSegment = text.split(/\s+/);
	var wordsToExplain = [];

    // make the word lowercase and remove the punctuation at the beginning and end,
    // if the word is empty, skip it
    wordsInSegment = wordsInSegment.map((word) => word.toLowerCase().replace(/^[^a-z]+|[^a-z]+$/g, "")).filter((word) => word != "");
    wordsInSegment = wordsInSegment.filter((word, index) => wordsInSegment.indexOf(word) == index);

	// For each word in the segment, check their position in the word frequency list
	// if the word is in the top most common words, then it is not explained, otherwise it is
	for (word of wordsInSegment) {
		let wordIndex = words.indexOf(word);
		// if cannot find, try to convert them and search again
        // if freq is so high, try to find its origin
		if (wordIndex == -1 || wordIndex > word_freq) {
			let wordIndexOrig = words.indexOf(wordConvert(word));
            if (wordIndexOrig != -1) wordIndex = wordIndexOrig;
            else {
                wordIndexOrig = words.indexOf(wordConvert2(word));
                if (wordIndexOrig != -1) wordIndex = wordIndexOrig;
            }
		}

		if (wordIndex > word_freq || (wordIndex == -1 && isAWord(word))) {
			// If the word is in the cache, then add the translation to the segment
			if (translationCache[word]) {
				// replace ignore case
				seg.textContent = seg.textContent.replace(new RegExp(word, "gi"), word + " (" + translationCache[word] + ")");
				console.log(word + ": cached, frequency " + words.indexOf(word));
			} else {
				wordsToExplain.push(word);
				console.log(word + ": frequency " + words.indexOf(word));
			}
		}
	}

	// If there are words to explain, then explain them
	if (wordsToExplain.length > 0) {
		// translate the words to chinese
		caiyun_translate(wordsToExplain, "en", "zh").then((result) => {
			// go through each word and add the translation to the segment
			for (var i = 0; i < wordsToExplain.length; i++) {
				var word = wordsToExplain[i];
				var translation = result[i];
				// replace ignore case
				seg.textContent = seg.textContent.replace(new RegExp(word, "gi"), word + " (" + translation + ")");
				console.log(word + ": " + translation);
				// add the translation to the cache
				translationCache[word] = translation;
			}
		});
	}
}

function isAWord(word) {
	// only word with letter, hypen, apostrophe, and a length less than 20 are considered words
	return /^[a-zA-Z'-]{1,20}$/.test(word);
}

function wordConvert(word) {
	// Check if the word ends with "ies" and replace it with "y"
	if (word.endsWith("ies")) {
		return word.slice(0, -3) + "y";
	}

	// Check if the word ends with "es" and replace it with "e"
	if (word.endsWith("es")) {
		return word.slice(0, -2) + "e";
	}

	// Check if the word ends with "s" and remove it
	if (word.endsWith("s")) {
		return word.slice(0, -1);
	}

	// Check if the word ends with "d" and remove it
	if (word.endsWith("d")) {
		return word.slice(0, -1);
	}

	// Check if the word ends with "ing" and remove it, then add "e"
	if (word.endsWith("ing")) {
		return word.slice(0, -3) + "e";
	}

	// Check if the word ends with "ed" and remove it, then add "e"
	if (word.endsWith("ed")) {
		return word.slice(0, -2) + "e";
	}

	// If none of the above conditions are met, return the original word
	return word;
}

function wordConvert2(word) {
	// Check if the word ends with "ed" and remove it
	if (word.endsWith("ed")) {
		return word.slice(0, -2);
	}
	// Check if the word ends with "ing" and remove it
	if (word.endsWith("ing")) {
		return word.slice(0, -3);
	}
}