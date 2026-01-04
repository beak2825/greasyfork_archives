// ==UserScript==
// @name             MZ Tactics Manager
// @namespace        douglaskampl
// @version          15.0.4
// @description      Userscript to manage tactics in ManagerZone
// @author           Douglas Vieira
// @match            https://www.managerzone.com/?p=tactics
// @match            https://www.managerzone.com/?p=national_teams&sub=tactics&type=*
// @icon             https://yt3.googleusercontent.com/ytc/AIdro_mDHaJkwjCgyINFM7cdUV2dWPPnL9Q58vUsrhOmRqkatg=s160-c-k-c0x00ffffff-no-rj
// @grant            GM_getValue
// @grant            GM_setValue
// @grant            GM_deleteValue
// @grant            GM_addStyle
// @run-at           document-idle
// @license          MIT
// @downloadURL https://update.greasyfork.org/scripts/467712/MZ%20Tactics%20Manager.user.js
// @updateURL https://update.greasyfork.org/scripts/467712/MZ%20Tactics%20Manager.meta.js
// ==/UserScript==

(function () {
    'use strict';

    !function (r, t) { "object" == typeof exports && "undefined" != typeof module ? module.exports = t() : "function" == typeof define && define.amd ? define(t) : (r = "undefined" != typeof globalThis ? globalThis : r || self).jsSHA = t() }(this, (function () { "use strict"; var r = function (t, n) { return r = Object.setPrototypeOf || { __proto__: [] } instanceof Array && function (r, t) { r.__proto__ = t } || function (r, t) { for (var n in t) Object.prototype.hasOwnProperty.call(t, n) && (r[n] = t[n]) }, r(t, n) }; "function" == typeof SuppressedError && SuppressedError; var t = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/", n = "ARRAYBUFFER not supported by this environment", i = "UINT8ARRAY not supported by this environment"; function e(r, t, n, i) { var e, o, u, s = t || [0], f = (n = n || 0) >>> 3, h = -1 === i ? 3 : 0; for (e = 0; e < r.length; e += 1)o = (u = e + f) >>> 2, s.length <= o && s.push(0), s[o] |= r[e] << 8 * (h + i * (u % 4)); return { value: s, binLen: 8 * r.length + n } } function o(r, o, u) { switch (o) { case "UTF8": case "UTF16BE": case "UTF16LE": break; default: throw new Error("encoding must be UTF8, UTF16BE, or UTF16LE") }switch (r) { case "HEX": return function (r, t, n) { return function (r, t, n, i) { var e, o, u, s; if (0 != r.length % 2) throw new Error("String of HEX type must be in byte increments"); var f = t || [0], h = (n = n || 0) >>> 3, a = -1 === i ? 3 : 0; for (e = 0; e < r.length; e += 2) { if (o = parseInt(r.substr(e, 2), 16), isNaN(o)) throw new Error("String of HEX type contains invalid characters"); for (u = (s = (e >>> 1) + h) >>> 2; f.length <= u;)f.push(0); f[u] |= o << 8 * (a + i * (s % 4)) } return { value: f, binLen: 4 * r.length + n } }(r, t, n, u) }; case "TEXT": return function (r, t, n) { return function (r, t, n, i, e) { var o, u, s, f, h, a, c, w, E = 0, v = n || [0], l = (i = i || 0) >>> 3; if ("UTF8" === t) for (c = -1 === e ? 3 : 0, s = 0; s < r.length; s += 1)for (u = [], 128 > (o = r.charCodeAt(s)) ? u.push(o) : 2048 > o ? (u.push(192 | o >>> 6), u.push(128 | 63 & o)) : 55296 > o || 57344 <= o ? u.push(224 | o >>> 12, 128 | o >>> 6 & 63, 128 | 63 & o) : (s += 1, o = 65536 + ((1023 & o) << 10 | 1023 & r.charCodeAt(s)), u.push(240 | o >>> 18, 128 | o >>> 12 & 63, 128 | o >>> 6 & 63, 128 | 63 & o)), f = 0; f < u.length; f += 1) { for (h = (a = E + l) >>> 2; v.length <= h;)v.push(0); v[h] |= u[f] << 8 * (c + e * (a % 4)), E += 1 } else for (c = -1 === e ? 2 : 0, w = "UTF16LE" === t && 1 !== e || "UTF16LE" !== t && 1 === e, s = 0; s < r.length; s += 1) { for (o = r.charCodeAt(s), !0 === w && (o = (f = 255 & o) << 8 | o >>> 8), h = (a = E + l) >>> 2; v.length <= h;)v.push(0); v[h] |= o << 8 * (c + e * (a % 4)), E += 2 } return { value: v, binLen: 8 * E + i } }(r, o, t, n, u) }; case "B64": return function (r, n, i) { return function (r, n, i, e) { var o, u, s, f, h, a, c = 0, w = n || [0], E = (i = i || 0) >>> 3, v = -1 === e ? 3 : 0, l = r.indexOf("="); if (-1 === r.search(/^[a-zA-Z0-9=+/]+$/)) throw new Error("Invalid character in base-64 string"); if (r = r.replace(/=/g, ""), -1 !== l && l < r.length) throw new Error("Invalid '=' found in base-64 string"); for (o = 0; o < r.length; o += 4) { for (f = r.substr(o, 4), s = 0, u = 0; u < f.length; u += 1)s |= t.indexOf(f.charAt(u)) << 18 - 6 * u; for (u = 0; u < f.length - 1; u += 1) { for (h = (a = c + E) >>> 2; w.length <= h;)w.push(0); w[h] |= (s >>> 16 - 8 * u & 255) << 8 * (v + e * (a % 4)), c += 1 } } return { value: w, binLen: 8 * c + i } }(r, n, i, u) }; case "BYTES": return function (r, t, n) { return function (r, t, n, i) { var e, o, u, s, f = t || [0], h = (n = n || 0) >>> 3, a = -1 === i ? 3 : 0; for (o = 0; o < r.length; o += 1)e = r.charCodeAt(o), u = (s = o + h) >>> 2, f.length <= u && f.push(0), f[u] |= e << 8 * (a + i * (s % 4)); return { value: f, binLen: 8 * r.length + n } }(r, t, n, u) }; case "ARRAYBUFFER": try { new ArrayBuffer(0) } catch (r) { throw new Error(n) } return function (r, t, n) { return function (r, t, n, i) { return e(new Uint8Array(r), t, n, i) }(r, t, n, u) }; case "UINT8ARRAY": try { new Uint8Array(0) } catch (r) { throw new Error(i) } return function (r, t, n) { return e(r, t, n, u) }; default: throw new Error("format must be HEX, TEXT, B64, BYTES, ARRAYBUFFER, or UINT8ARRAY") } } function u(r, e, o, u) { switch (r) { case "HEX": return function (r) { return function (r, t, n, i) { var e, o, u = "0123456789abcdef", s = "", f = t / 8, h = -1 === n ? 3 : 0; for (e = 0; e < f; e += 1)o = r[e >>> 2] >>> 8 * (h + n * (e % 4)), s += u.charAt(o >>> 4 & 15) + u.charAt(15 & o); return i.outputUpper ? s.toUpperCase() : s }(r, e, o, u) }; case "B64": return function (r) { return function (r, n, i, e) { var o, u, s, f, h, a = "", c = n / 8, w = -1 === i ? 3 : 0; for (o = 0; o < c; o += 3)for (f = o + 1 < c ? r[o + 1 >>> 2] : 0, h = o + 2 < c ? r[o + 2 >>> 2] : 0, s = (r[o >>> 2] >>> 8 * (w + i * (o % 4)) & 255) << 16 | (f >>> 8 * (w + i * ((o + 1) % 4)) & 255) << 8 | h >>> 8 * (w + i * ((o + 2) % 4)) & 255, u = 0; u < 4; u += 1)a += 8 * o + 6 * u <= n ? t.charAt(s >>> 6 * (3 - u) & 63) : e.b64Pad; return a }(r, e, o, u) }; case "BYTES": return function (r) { return function (r, t, n) { var i, e, o = "", u = t / 8, s = -1 === n ? 3 : 0; for (i = 0; i < u; i += 1)e = r[i >>> 2] >>> 8 * (s + n * (i % 4)) & 255, o += String.fromCharCode(e); return o }(r, e, o) }; case "ARRAYBUFFER": try { new ArrayBuffer(0) } catch (r) { throw new Error(n) } return function (r) { return function (r, t, n) { var i, e = t / 8, o = new ArrayBuffer(e), u = new Uint8Array(o), s = -1 === n ? 3 : 0; for (i = 0; i < e; i += 1)u[i] = r[i >>> 2] >>> 8 * (s + n * (i % 4)) & 255; return o }(r, e, o) }; case "UINT8ARRAY": try { new Uint8Array(0) } catch (r) { throw new Error(i) } return function (r) { return function (r, t, n) { var i, e = t / 8, o = -1 === n ? 3 : 0, u = new Uint8Array(e); for (i = 0; i < e; i += 1)u[i] = r[i >>> 2] >>> 8 * (o + n * (i % 4)) & 255; return u }(r, e, o) }; default: throw new Error("format must be HEX, B64, BYTES, ARRAYBUFFER, or UINT8ARRAY") } } var s = [1116352408, 1899447441, 3049323471, 3921009573, 961987163, 1508970993, 2453635748, 2870763221, 3624381080, 310598401, 607225278, 1426881987, 1925078388, 2162078206, 2614888103, 3248222580, 3835390401, 4022224774, 264347078, 604807628, 770255983, 1249150122, 1555081692, 1996064986, 2554220882, 2821834349, 2952996808, 3210313671, 3336571891, 3584528711, 113926993, 338241895, 666307205, 773529912, 1294757372, 1396182291, 1695183700, 1986661051, 2177026350, 2456956037, 2730485921, 2820302411, 3259730800, 3345764771, 3516065817, 3600352804, 4094571909, 275423344, 430227734, 506948616, 659060556, 883997877, 958139571, 1322822218, 1537002063, 1747873779, 1955562222, 2024104815, 2227730452, 2361852424, 2428436474, 2756734187, 3204031479, 3329325298], f = [3238371032, 914150663, 812702999, 4144912697, 4290775857, 1750603025, 1694076839, 3204075428], h = [1779033703, 3144134277, 1013904242, 2773480762, 1359893119, 2600822924, 528734635, 1541459225]; function a(r) { var t = { outputUpper: !1, b64Pad: "=", outputLen: -1 }, n = r || {}, i = "Output length must be a multiple of 8"; if (t.outputUpper = n.outputUpper || !1, n.b64Pad && (t.b64Pad = n.b64Pad), n.outputLen) { if (n.outputLen % 8 != 0) throw new Error(i); t.outputLen = n.outputLen } else if (n.shakeLen) { if (n.shakeLen % 8 != 0) throw new Error(i); t.outputLen = n.shakeLen } if ("boolean" != typeof t.outputUpper) throw new Error("Invalid outputUpper formatting option"); if ("string" != typeof t.b64Pad) throw new Error("Invalid b64Pad formatting option"); return t } function c(r, t) { return r >>> t | r << 32 - t } function w(r, t) { return r >>> t } function E(r, t, n) { return r & t ^ ~r & n } function v(r, t, n) { return r & t ^ r & n ^ t & n } function l(r) { return c(r, 2) ^ c(r, 13) ^ c(r, 22) } function p(r, t) { var n = (65535 & r) + (65535 & t); return (65535 & (r >>> 16) + (t >>> 16) + (n >>> 16)) << 16 | 65535 & n } function A(r, t, n, i) { var e = (65535 & r) + (65535 & t) + (65535 & n) + (65535 & i); return (65535 & (r >>> 16) + (t >>> 16) + (n >>> 16) + (i >>> 16) + (e >>> 16)) << 16 | 65535 & e } function d(r, t, n, i, e) { var o = (65535 & r) + (65535 & t) + (65535 & n) + (65535 & i) + (65535 & e); return (65535 & (r >>> 16) + (t >>> 16) + (n >>> 16) + (i >>> 16) + (e >>> 16) + (o >>> 16)) << 16 | 65535 & o } function y(r) { return c(r, 7) ^ c(r, 18) ^ w(r, 3) } function U(r) { return c(r, 6) ^ c(r, 11) ^ c(r, 25) } function T(r) { return "SHA-224" == r ? f.slice() : h.slice() } function b(r, t) { var n, i, e, o, u, f, h, a, T, b, R, m, F = []; for (n = t[0], i = t[1], e = t[2], o = t[3], u = t[4], f = t[5], h = t[6], a = t[7], R = 0; R < 64; R += 1)F[R] = R < 16 ? r[R] : A(c(m = F[R - 2], 17) ^ c(m, 19) ^ w(m, 10), F[R - 7], y(F[R - 15]), F[R - 16]), T = d(a, U(u), E(u, f, h), s[R], F[R]), b = p(l(n), v(n, i, e)), a = h, h = f, f = u, u = p(o, T), o = e, e = i, i = n, n = p(T, b); return t[0] = p(n, t[0]), t[1] = p(i, t[1]), t[2] = p(e, t[2]), t[3] = p(o, t[3]), t[4] = p(u, t[4]), t[5] = p(f, t[5]), t[6] = p(h, t[6]), t[7] = p(a, t[7]), t } return function (t) { function n(r, n, i) { var e = this; if ("SHA-224" !== r && "SHA-256" !== r) throw new Error("Chosen SHA variant is not supported"); var u = i || {}; return (e = t.call(this, r, n, i) || this).t = e.i, e.o = !0, e.u = -1, e.h = o(e.v, e.l, e.u), e.p = b, e.A = function (r) { return r.slice() }, e.U = T, e.T = function (t, n, i, e) { return function (r, t, n, i, e) { for (var o, u = 15 + (t + 65 >>> 9 << 4), s = t + n; r.length <= u;)r.push(0); for (r[t >>> 5] |= 128 << 24 - t % 32, r[u] = 4294967295 & s, r[u - 1] = s / 4294967296 | 0, o = 0; o < r.length; o += 16)i = b(r.slice(o, o + 16), i); return "SHA-224" === e ? [i[0], i[1], i[2], i[3], i[4], i[5], i[6]] : i }(t, n, i, e, r) }, e.R = T(r), e.m = 512, e.F = "SHA-224" === r ? 224 : 256, e.g = !1, u.hmacKey && e.B(function (r, t, n, i) { var e = r + " must include a value and format"; if (!t) { if (!i) throw new Error(e); return i } if (void 0 === t.value || !t.format) throw new Error(e); return o(t.format, t.encoding || "UTF8", n)(t.value) }("hmacKey", u.hmacKey, e.u)), e } return function (t, n) { if ("function" != typeof n && null !== n) throw new TypeError("Class extends value " + String(n) + " is not a constructor or null"); function i() { this.constructor = t } r(t, n), t.prototype = null === n ? Object.create(n) : (i.prototype = n.prototype, new i) }(n, t), n }(function () { function r(r, t, n) { var i = n || {}; if (this.v = t, this.l = i.encoding || "UTF8", this.numRounds = i.numRounds || 1, isNaN(this.numRounds) || this.numRounds !== parseInt(this.numRounds, 10) || 1 > this.numRounds) throw new Error("numRounds must a integer >= 1"); this.S = r, this.H = [], this.Y = 0, this.C = !1, this.I = 0, this.L = !1, this.N = [], this.X = [] } return r.prototype.update = function (r) { var t, n = 0, i = this.m >>> 5, e = this.h(r, this.H, this.Y), o = e.binLen, u = e.value, s = o >>> 5; for (t = 0; t < s; t += i)n + this.m <= o && (this.R = this.p(u.slice(t, t + i), this.R), n += this.m); return this.I += n, this.H = u.slice(n >>> 5), this.Y = o % this.m, this.C = !0, this }, r.prototype.getHash = function (r, t) { var n, i, e = this.F, o = a(t); if (this.g) { if (-1 === o.outputLen) throw new Error("Output length must be specified in options"); e = o.outputLen } var s = u(r, e, this.u, o); if (this.L && this.t) return s(this.t(o)); for (i = this.T(this.H.slice(), this.Y, this.I, this.A(this.R), e), n = 1; n < this.numRounds; n += 1)this.g && e % 32 != 0 && (i[i.length - 1] &= 16777215 >>> 24 - e % 32), i = this.T(i, e, 0, this.U(this.S), e); return s(i) }, r.prototype.setHMACKey = function (r, t, n) { if (!this.o) throw new Error("Variant does not support HMAC"); if (this.C) throw new Error("Cannot set MAC key after calling update"); var i = o(t, (n || {}).encoding || "UTF8", this.u); this.B(i(r)) }, r.prototype.B = function (r) { var t, n = this.m >>> 3, i = n / 4 - 1; if (1 !== this.numRounds) throw new Error("Cannot set numRounds with MAC"); if (this.L) throw new Error("MAC key already set"); for (n < r.binLen / 8 && (r.value = this.T(r.value, r.binLen, 0, this.U(this.S), this.F)); r.value.length <= i;)r.value.push(0); for (t = 0; t <= i; t += 1)this.N[t] = 909522486 ^ r.value[t], this.X[t] = 1549556828 ^ r.value[t]; this.R = this.p(this.N, this.R), this.I = this.m, this.L = !0 }, r.prototype.getHMAC = function (r, t) { var n = a(t); return u(r, this.F, this.u, n)(this.i()) }, r.prototype.i = function () { var r; if (!this.L) throw new Error("Cannot call getHMAC without first setting MAC key"); var t = this.T(this.H.slice(), this.Y, this.I, this.A(this.R), this.F); return r = this.p(this.X, this.U(this.S)), r = this.T(t, this.F, this.m, r, this.F) }, r }()) }));

    const sado = `@import url('https://api.fontshare.com/v2/css?f[]=satoshi@400,500,700&f[]=general-sans@400,500&display=swap');:root{--bg-color:#111827;--text-color:#F9FAFB;--primary-accent-color:#634999;--secondary-text-color:#94A3B8;--shadow-color-dark:rgba(0,0,0,0.25);--shadow-color-light:rgba(255,255,255,0.03);--style-accent-teal:#14B8A6;--style-accent-green:#22C55E;--style-accent-orange:#F97316;--style-accent-gray:#6B7280;--success-color:#22C55E;--error-color:#EF4444;--info-color:#3B82F6;--warning-color:#F59E0B;--border-color:rgba(148,163,184,0.1);--border-color-hover:rgba(148,163,184,0.2);--border-color-focus:var(--primary-accent-color);--input-bg-color:rgba(255,255,255,0.04);--input-bg-color-hover:rgba(255,255,255,0.06);--input-bg-color-focus:rgba(255,255,255,0.07);--button-secondary-bg:rgba(255,255,255,0.05);--button-secondary-bg-hover:rgba(255,255,255,0.08);--button-secondary-bg-active:rgba(0,0,0,0.05);--border-radius:8px;--shadow-base:3px 3px 8px var(--shadow-color-dark),-2px -2px 4px var(--shadow-color-light);--shadow-inset:inset 2px 2px 4px var(--shadow-color-dark),inset -2px -2px 4px var(--shadow-color-light);--shadow-concave:4px 4px 8px var(--shadow-color-dark),-4px -4px 8px var(--shadow-color-light),inset 1px 1px 2px var(--shadow-color-light),inset -1px -1px 2px var(--shadow-color-dark);}#mz_tactics_panel{font-family:"Satoshi",-apple-system,sans-serif;background-color:var(--bg-color);border-radius:12px;padding:16px 16px 4px 16px;margin:8px;box-shadow:var(--shadow-base);border:1px solid var(--border-color);transition:max-height 0.4s ease-out,padding 0.4s ease-out,margin 0.4s ease-out,opacity 0.3s ease-out;max-height:1000px;opacity:1;color:var(--text-color);overflow:visible;}#mz_tactics_panel.collapsed{max-height:0 !important;padding-top:0 !important;padding-bottom:0 !important;margin-top:0 !important;margin-bottom:0 !important;opacity:0 !important;border:none !important;overflow:hidden !important;}.mz-group{background-color:rgba(0,0,0,0.1);border-radius:var(--border-radius);padding:12px;margin:8px 0;box-shadow:none;border:1px solid var(--border-color);position:relative;transition:max-height 0.3s ease-out,padding 0.3s ease-out,margin 0.3s ease-out;overflow:visible;}.mz-group-main-title{display:flex;justify-content:space-between;align-items:center;color:var(--text-color);font-size:18px;font-weight:500;margin:-4px 0 12px 0;padding-bottom:8px;border-bottom:1px solid var(--border-color);}.mz-title-container{display:flex;align-items:center;gap:8px;flex-grow:1;flex-wrap:nowrap;min-width:0;}.mz-main-title{font-family:"Satoshi",sans-serif;font-size:20px;font-weight:700;margin:0;padding:0;letter-spacing:0.2px;white-space:nowrap;background:linear-gradient(to right,var(--primary-accent-color),#A78BFA);-webkit-background-clip:text;background-clip:text;color:transparent;}.mz-version-text{color:#2A8C5E;opacity:0.7;font-size:0.9em;font-weight:400;margin-right:10px;white-space:nowrap;}.mz-divider{width:50px;height:1px;background:var(--border-color);margin:10px auto 0;opacity:0.5;}#toggle_panel_btn{background:transparent;border:none;color:var(--secondary-text-color);cursor:pointer;padding:8px;width:32px;height:32px;border-radius:50%;margin-left:auto;font-size:18px;transition:all 0.3s ease;display:inline-flex;align-items:center;justify-content:center;flex-shrink:0;}#toggle_panel_btn:hover{background:rgba(255,255,255,0.05);color:var(--text-color);}#collapsed_icon{display:none;width:20px;height:18px;border-radius:50%;background:#1F2937;color:var(--secondary-text-color);font-size:9px;font-weight:bold;text-align:center;line-height:18px;cursor:pointer;transition:transform 0.3s ease,box-shadow 0.3s ease,opacity 0.3s ease;box-shadow:var(--shadow-base);border:1px solid var(--border-color);margin-left:8px;vertical-align:middle;flex-shrink:0;opacity:0;transform:scale(0.8);}#collapsed_icon.visible{display:inline-block;opacity:1;transform:scale(1);}#collapsed_icon:hover{transform:scale(1.1);box-shadow:0 0 10px rgba(139,92,246,0.3);color:var(--text-color);}#mz_tactics_panel .mzbtn{display:inline-flex;align-items:center;justify-content:center;padding:8px 14px;margin:4px;font-family:"Satoshi",sans-serif;font-size:13px;font-weight:500;color:var(--text-color);background:var(--button-secondary-bg);border:1px solid var(--border-color);border-radius:var(--border-radius);cursor:pointer;transition:all 0.2s ease;min-height:36px;box-shadow:0 1px 2px rgba(0,0,0,0.1);}#mz_tactics_panel .mzbtn:hover:not(:disabled){background:var(--button-secondary-bg-hover);border-color:var(--border-color-hover);transform:translateY(-1px);box-shadow:0 3px 6px rgba(0,0,0,0.15);}#mz_tactics_panel .mzbtn:active:not(:disabled){background:var(--button-secondary-bg-active);transform:translateY(0);box-shadow:inset 0 1px 2px rgba(0,0,0,0.2);}#mz_tactics_panel .mzbtn:disabled{opacity:0.5;cursor:not-allowed;}#mz_tactics_panel select{font-family:"Satoshi",sans-serif;font-size:14px;color:var(--text-color);padding:7px 13px;border:1px solid var(--border-color);border-radius:var(--border-radius);background-color:var(--input-bg-color);cursor:pointer;margin:0;transition:all 0.2s ease;-webkit-appearance:none;-moz-appearance:none;appearance:none;background-image:url("data:image/svg+xml;utf8,<svg fill='%2394A3B8' height='24' viewBox='0 0 24 24' width='24' xmlns='http://www.w3.org/2000/svg'><path d='M7 10l5 5 5-5z'/></svg>");background-repeat:no-repeat;background-position:right 10px top 50%;padding-right:30px;height:36px;box-sizing:border-box;}#mz_tactics_panel select:hover:not(:disabled){background:var(--input-bg-color-hover);border-color:var(--border-color-hover);}#mz_tactics_panel select:focus{outline:none;border-color:var(--border-color-focus);box-shadow:0 0 0 2px rgba(139,92,246,0.3);background:var(--input-bg-color-focus);}#mz_tactics_panel select option{background-color:#1F2937;color:var(--text-color);padding:5px 10px;}#mz_tactics_panel select:disabled{opacity:0.5;cursor:not-allowed;}.tactics-selector-section{margin-bottom:12px;}.tactics-selector-label{display:block;margin-bottom:5px;color:var(--secondary-text-color);font-size:12px;}.modal-info-wrapper{width:100%;max-width:550px;}.modal-tabs{display:flex;border-bottom:1px solid var(--border-color);margin-bottom:15px;}.modal-tab{padding:10px 15px;cursor:pointer;border:none;background:none;color:var(--secondary-text-color);opacity:0.8;border-bottom:2px solid transparent;transition:all 0.3s ease;font-family:"Satoshi",sans-serif;font-size:14px;font-weight:500;}.modal-tab:hover{opacity:1;color:var(--text-color);background-color:rgba(255,255,255,0.03);}.modal-tab.active{opacity:1;color:var(--primary-accent-color);border-bottom-color:var(--primary-accent-color);font-weight:600;}.modal-tab-content{display:none;padding:5px;max-height:40vh;overflow-y:auto;overflow-x:hidden;scrollbar-width:thin;scrollbar-color:var(--primary-accent-color) rgba(255,255,255,0.05);}#mz_tactics_panel .mztm-custom-select-list-container{background-color:#1F2937;}#mz_tactics_panel #category-selector option{background-color:#1F2937;}.modal-tab-content::-webkit-scrollbar{width:6px;}.modal-tab-content::-webkit-scrollbar-track{background:rgba(255,255,255,0.05);border-radius:3px;}.modal-tab-content::-webkit-scrollbar-thumb{background-color:var(--primary-accent-color);border-radius:3px;}.modal-tab-content.active{display:block;animation:fadeIn 0.5s ease;}.modal-tab-content[data-tab-id="links"] a{color:var(--info-color);}.faq-section h3{color:var(--primary-accent-color);margin-top:20px;margin-bottom:15px;font-size:16px;border-bottom:1px solid var(--border-color);padding-bottom:5px;}.faq-item{margin-bottom:15px;}.faq-item h4{font-weight:600;margin-bottom:5px;color:var(--text-color);font-size:14px;}.faq-item p{font-size:13px;line-height:1.5;color:var(--secondary-text-color);margin:0;}.faq-item code{background-color:var(--input-bg-color);padding:2px 5px;border-radius:4px;font-size:0.9em;color:var(--primary-accent-color);border:1px solid var(--border-color);}.info-modal-content a{color:var(--primary-accent-color);text-decoration:none;transition:color 0.3s ease;}.info-modal-content a:hover{color:var(--primary-accent-color);opacity:0.8;text-decoration:underline;}.info-modal-content ul{list-style:none;padding:0;}.info-modal-content ul li{margin:12px 0;padding:8px 12px;border-radius:var(--border-radius);background:var(--input-bg-color);border:1px solid var(--border-color);transition:all 0.3s ease;}.info-modal-content ul li:hover{background:var(--input-bg-color-hover);}#mz-modal-overlay{position:fixed;top:0;left:0;right:0;bottom:0;background-color:rgba(17,24,39,0.8);backdrop-filter:blur(4px);display:flex;align-items:center;justify-content:center;z-index:10000;opacity:0;transition:opacity 0.3s ease;}#mz-modal-container{background:var(--bg-color);border-radius:12px;padding:24px;box-shadow:0 10px 25px rgba(0,0,0,0.3);border:1px solid var(--border-color);max-width:550px;width:90%;transform:scale(0.9);transition:transform 0.3s ease;color:var(--text-color);font-family:"Satoshi",-apple-system,sans-serif;}#mz-modal-container.management-modal{max-width:700px;width:95%;}#mz-modal-overlay.active{opacity:1;}#mz-modal-overlay.active #mz-modal-container{transform:scale(1);}#mz-modal-header{display:flex;justify-content:space-between;align-items:center;margin-bottom:10px;border-bottom:none;padding-bottom:0;}#mz-modal-title{font-size:20px;font-weight:500;margin:0;}#mz-modal-close{background:transparent;border:none;color:var(--secondary-text-color);font-size:22px;cursor:pointer;transition:all 0.3s ease;padding:0;width:36px;height:36px;display:flex;align-items:center;justify-content:center;border-radius:50%;}#mz-modal-close:hover{background:rgba(255,255,255,0.05);color:var(--error-color);}#mz-modal-content{margin-bottom:24px;white-space:pre-line;line-height:1.5;color:var(--secondary-text-color);}#mz-modal-input{width:calc(100% - 32px);background:var(--input-bg-color);border:1px solid var(--border-color);color:var(--text-color);padding:14px 16px;border-radius:var(--border-radius);font-family:"Satoshi",sans-serif;font-size:15px;margin-bottom:20px;transition:all 0.3s ease;box-sizing:border-box;}#mz-modal-input:focus{outline:none;border-color:var(--border-color-focus);box-shadow:0 0 0 2px rgba(139,92,246,0.3);background:var(--input-bg-color-focus);}.mz-modal-label{display:block;margin-bottom:8px;font-size:14px;color:var(--text-color);opacity:0.9;margin-top:10px;}#mz-modal-description{width:calc(100% - 0);background:var(--input-bg-color);border:1px solid var(--border-color);color:var(--text-color);padding:12px 16px;border-radius:var(--border-radius);font-family:"Satoshi",sans-serif;font-size:14px;margin-bottom:20px;transition:all 0.3s ease;box-sizing:border-box;resize:vertical;min-height:60px;}#mz-modal-description:focus{outline:none;border-color:var(--border-color-focus);box-shadow:0 0 0 2px rgba(139,92,246,0.3);background:var(--input-bg-color-focus);}#mz-modal-buttons{display:flex;justify-content:flex-start;gap:12px;margin-top:15px;}.mz-modal-btn{display:inline-flex;align-items:center;justify-content:center;padding:10px 18px;font-family:"Satoshi",sans-serif;font-size:15px;font-weight:500;color:var(--text-color);background:var(--button-secondary-bg);border:1px solid var(--border-color);border-radius:var(--border-radius);cursor:pointer;transition:all 0.2s ease;min-width:90px;box-shadow:0 1px 2px rgba(0,0,0,0.1);}.mz-modal-btn:hover{background:var(--button-secondary-bg-hover);border-color:var(--border-color-hover);transform:translateY(-1px);box-shadow:0 3px 6px rgba(0,0,0,0.15);}.mz-modal-btn:active{background:var(--button-secondary-bg-active);transform:translateY(0);box-shadow:inset 0 1px 2px rgba(0,0,0,0.2);}.mz-modal-btn.primary{background:var(--primary-accent-color);color:#ffffff;font-weight:500;border:none;}.mz-modal-btn.primary:hover{background-color:#7C3AED;}.mz-modal-btn.cancel{background:transparent;color:var(--secondary-text-color);border:1px solid var(--border-color);}.mz-modal-btn.cancel:hover{background:rgba(255,255,255,0.03);color:var(--text-color);border-color:var(--border-color-hover);}.mz-modal-icon{display:inline-flex;align-items:center;justify-content:center;width:36px;height:36px;border-radius:50%;margin-right:14px;font-weight:bold;font-size:1.2em;}.mz-modal-icon.success{color:var(--success-color);background:rgba(34,197,94,0.1);}.mz-modal-icon.error{color:var(--error-color);background:rgba(239,68,68,0.1);}.mz-modal-icon.info{color:var(--info-color);background:rgba(59,130,246,0.1);}.mz-modal-title-with-icon{display:flex;align-items:center;}.formations-controls-container{display:flex;flex-wrap:nowrap;gap:8px;margin-top:0;align-items:center;}.mztm-filter-controls-row{display:flex;flex-wrap:nowrap;gap:8px;align-items:center;width:100%;}.tactics-search-box{width:140px !important;padding:8px 12px;margin-bottom:0 !important;border:1px solid var(--border-color);border-radius:var(--border-radius);background-color:var(--input-bg-color);color:var(--text-color);font-family:"Satoshi",sans-serif;font-size:14px;box-sizing:border-box;height:36px;transition:all 0.2s ease;position:relative;flex-shrink:0;}.tactics-search-box:focus{outline:none;border-color:var(--border-color-focus);box-shadow:0 0 0 2px rgba(139,92,246,0.3);background:var(--input-bg-color-focus);}.tactics-search-box.filtering{border-bottom:2px solid var(--primary-accent-color);animation:pulse-border 1.5s infinite;}@keyframes pulse-border{0%{border-color:var(--primary-accent-color);}50%{border-color:transparent;}100%{border-color:var(--primary-accent-color);}}.category-filter-wrapper{display:flex;align-items:center;gap:4px;flex-shrink:0;}#category_filter_selector{min-width:140px;flex-grow:0;}#manage_items_btn{padding:4px 8px;min-width:auto;height:36px;font-size:14px;line-height:1;flex-shrink:0;color:var(--secondary-text-color);}#manage_items_btn:hover{color:var(--text-color);}.mztm-custom-select-wrapper{position:relative;flex:1;min-width:180px;flex-grow:1;flex-shrink:1;}.mztm-custom-select-trigger{display:flex;align-items:center;justify-content:space-between;font-family:"Satoshi",sans-serif;font-size:14px;color:var(--text-color);padding:8px 14px;border:1px solid var(--border-color);border-radius:var(--border-radius);background-color:var(--input-bg-color);cursor:pointer;margin:0;transition:all 0.2s ease;height:36px;box-sizing:border-box;overflow:hidden;white-space:nowrap;text-overflow:ellipsis;}.mztm-custom-select-trigger:hover:not(.disabled){background:var(--input-bg-color-hover);border-color:var(--border-color-hover);}.mztm-custom-select-trigger.open{border-color:var(--border-color-focus);box-shadow:0 0 0 2px rgba(139,92,246,0.3);border-bottom-left-radius:0;border-bottom-right-radius:0;background:var(--input-bg-color-focus);}.mztm-custom-select-trigger.disabled{opacity:0.5;cursor:not-allowed;}.mztm-custom-select-trigger::after{content:'';border:solid var(--secondary-text-color);border-width:0 2px 2px 0;display:inline-block;padding:3px;transform:rotate(45deg);-webkit-transform:rotate(45deg);margin-left:10px;flex-shrink:0;transition:border-color 0.2s ease;}.mztm-custom-select-trigger:hover:not(.disabled)::after{border-color:var(--text-color);}.mztm-custom-select-trigger.open::after{transform:rotate(-135deg);-webkit-transform:rotate(-135deg);margin-top:3px;}.mztm-custom-select-placeholder{color:var(--secondary-text-color);font-style:italic;}.mztm-custom-select-list-container{position:absolute;top:100%;left:0;right:0;background-color:#1F2937;border:1px solid var(--border-color-focus);border-top:none;border-radius:0 0 8px 8px;z-index:1001;max-height:250px;overflow-y:auto;box-shadow:0 5px 10px rgba(0,0,0,0.2);display:none;scrollbar-width:thin;scrollbar-color:var(--primary-accent-color) rgba(255,255,255,0.05);}.mztm-custom-select-list-container.open{display:block;animation:fadeIn 0.2s ease-out;}.mztm-custom-select-list-container::-webkit-scrollbar{width:6px;}.mztm-custom-select-list-container::-webkit-scrollbar-track{background:rgba(255,255,255,0.05);border-radius:3px;}.mztm-custom-select-list-container::-webkit-scrollbar-thumb{background-color:var(--primary-accent-color);border-radius:3px;}.mztm-custom-select-list{list-style:none;padding:0;margin:0;}.mztm-custom-select-category{color:var(--primary-accent-color);font-size:11px;font-weight:600;padding:6px 12px;background:rgba(0,0,0,0.2);margin-top:2px;border-top:1px solid var(--border-color);border-bottom:1px solid var(--border-color);cursor:default;text-transform:uppercase;letter-spacing:0.5px;}.mztm-custom-select-item{padding:8px 12px;cursor:pointer;transition:background-color 0.15s ease,color 0.15s ease;font-size:14px;color:var(--text-color);white-space:nowrap;overflow:hidden;text-overflow:ellipsis;}.mztm-custom-select-item:hover,.mztm-custom-select-item.highlighted{background-color:var(--primary-accent-color);color:#ffffff;}.mztm-custom-select-item.disabled{opacity:0.5;cursor:default;background-color:transparent !important;color:var(--secondary-text-color) !important;}.mztm-custom-select-item.hidden{display:none;}.mztm-custom-select-no-results{padding:10px 12px;color:var(--secondary-text-color);font-style:italic;cursor:default;}.tactics-style-indicator{display:inline-block;width:8px;height:8px;border-radius:50%;margin-right:6px;}.tactics-style-indicator.accent-teal{background-color:var(--style-accent-teal);}.tactics-style-indicator.accent-green{background-color:var(--style-accent-green);}.tactics-style-indicator.accent-orange{background-color:var(--style-accent-orange);}.tactics-style-indicator.accent-gray{background-color:var(--style-accent-gray);}#category-selector{width:75%;padding:10px 12px;border:1px solid var(--border-color);border-radius:var(--border-radius);background-color:var(--input-bg-color);color:var(--text-color);font-family:"Satoshi",sans-serif;font-size:13px;box-sizing:border-box;}#category-selector option{padding:8px;background-color:#1F2937;}.category-selection-container{margin-bottom:10px;}.category-selection-label{display:block;margin-bottom:5px;font-size:14px;color:var(--text-color);opacity:0.9;}.new-category-input-container{margin-top:10px;display:none;}.new-category-input-container.visible{display:block;}#new-category-input{width:100%;padding:10px 12px;border:1px solid var(--border-color);border-radius:var(--border-radius);background-color:var(--input-bg-color);color:var(--text-color);font-family:"Satoshi",sans-serif;font-size:14px;box-sizing:border-box;}#new-category-input:focus{outline:none;border-color:var(--border-color-focus);box-shadow:0 0 0 2px rgba(139,92,246,0.3);background:var(--input-bg-color-focus);}@keyframes fadeIn{from{opacity:0;transform:translateY(-5px);}to{opacity:1;transform:translateY(0);}}@keyframes shake{0%,100%{transform:translateX(0);}25%{transform:translateX(-2px);}50%{transform:translateX(0);}75%{transform:translateX(2px);}}.mztm-custom-select-wrapper.filtering .mztm-custom-select-trigger{border-color:var(--primary-accent-color);animation:pulse-border 1.5s infinite;}.action-buttons-section{display:flex;flex-direction:column;flex-wrap:nowrap;margin-top:10px;gap:4px;}.action-buttons-row{display:flex;flex-wrap:wrap;gap:6px;width:100%;}.footer-actions{position:absolute;bottom:10px;right:16px;background:transparent !important;border:none !important;box-shadow:none !important;font-family:"General Sans",sans-serif !important;color:gold !important;opacity:0.8;transition:opacity 0.2s ease;}.footer-actions:hover{opacity:1;transform:none !important;}#manage_action_dropdown_menu{max-height:200px;overflow-y:auto;overflow-x:hidden;}#loading-overlay{position:fixed;top:0;left:0;width:100%;height:100%;background-color:rgba(17,24,39,0.7);backdrop-filter:blur(3px);display:flex;justify-content:center;align-items:center;z-index:10001;opacity:0;transition:opacity 0.3s ease;pointer-events:none;}#loading-overlay.visible{opacity:1;pointer-events:auto;}#loading-spinner{border:4px solid rgba(255,255,255,0.1);border-left-color:var(--primary-accent-color);border-radius:50%;width:40px;height:40px;animation:spin 1s linear infinite;}@keyframes spin{to{transform:rotate(360deg);}}.mode-toggle-container{display:flex;align-items:center;margin:0 10px 0 30px;white-space:nowrap;}.mode-toggle-switch{position:relative;display:inline-block;width:44px;height:22px;margin:0 10px;vertical-align:middle;}.mode-toggle-switch input{opacity:0;width:0;height:0;}.mode-toggle-slider{position:absolute;cursor:pointer;top:0;left:0;right:0;bottom:0;background-color:#4B5563;transition:0.4s;border-radius:22px;border:1px solid var(--border-color);}.mode-toggle-slider:before{position:absolute;content:"";height:16px;width:16px;left:3px;bottom:2px;background-color:white;transition:0.4s;border-radius:50%;}.mode-toggle-switch input:checked + .mode-toggle-slider{background-color:var(--primary-accent-color);}.mode-toggle-switch input:checked + .mode-toggle-slider:before{transform:translateX(22px);}.mode-toggle-label{font-size:12px;vertical-align:middle;color:var(--secondary-text-color);opacity:0.8;transition:opacity 0.2s ease,color 0.2s ease;}.mode-toggle-label.active{opacity:1;color:var(--text-color);font-weight:500;}.section-content{position:relative;padding-bottom:2px;overflow:visible;}.management-modal-wrapper{width:100%;}.management-modal-content{display:none;padding:5px;max-height:50vh;overflow-y:auto;overflow-x:hidden;scrollbar-width:thin;scrollbar-color:var(--primary-accent-color) rgba(255,255,255,0.05);}.management-modal-content::-webkit-scrollbar{width:8px;}.management-modal-content::-webkit-scrollbar-track{background:rgba(255,255,255,0.05);border-radius:4px;}.management-modal-content::-webkit-scrollbar-thumb{background-color:var(--primary-accent-color);border-radius:4px;}.management-modal-content.active{display:block;animation:fadeIn 0.5s ease;}.formation-management-list,.category-management-list{list-style:none;padding:0;margin:10px 0 0 0;}.formation-management-list li,.category-management-list li{display:flex;justify-content:space-between;align-items:center;padding:10px 5px;border-bottom:1px solid var(--border-color);transition:background-color 0.2s ease;}.formation-management-list li:last-child,.category-management-list li:last-child{border-bottom:none;}.item-name-container{flex-grow:1;margin-right:10px;display:flex;align-items:center;min-width:0;}.item-name{flex-grow:1;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;color:var(--text-color);}.item-name-input{flex-grow:1;background:var(--input-bg-color-hover);border:1px solid var(--border-color-hover);color:var(--text-color);padding:4px 8px;border-radius:4px;font-family:"Satoshi",sans-serif;font-size:14px;margin-right:5px;}.item-name-input:focus{outline:none;border-color:var(--border-color-focus);box-shadow:0 0 0 2px rgba(139,92,246,0.3);}.item-controls{display:flex;align-items:center;gap:8px;flex-shrink:0;}.item-category-select{padding:4px 8px !important;height:30px !important;font-size:12px !important;min-width:120px;background-position:right 5px top 50%;padding-right:25px !important;flex-shrink:0;background-color:var(--input-bg-color);border-color:var(--border-color);color:var(--secondary-text-color);}.item-category-select:hover{background-color:var(--input-bg-color-hover);border-color:var(--border-color-hover);color:var(--text-color);}.item-action-btn{background:transparent;border:none;color:var(--secondary-text-color);opacity:0.7;cursor:pointer;font-size:16px;padding:4px;transition:opacity 0.2s ease,color 0.2s ease;line-height:1;}.item-action-btn:hover{opacity:1;color:var(--text-color);}.save-name-btn{color:var(--success-color);}.cancel-name-btn{color:var(--error-color);}.delete-item-btn{color:var(--error-color);}.delete-item-btn:hover{color:var(--error-color);}.add-category-section{display:flex;gap:8px;padding:10px 5px;border-bottom:1px solid var(--border-color);margin-bottom:10px;}.add-category-input{flex-grow:1;background:var(--input-bg-color);border:1px solid var(--border-color);color:var(--text-color);padding:8px 12px;border-radius:var(--border-radius);font-family:"Satoshi",sans-serif;font-size:14px;}.add-category-input:focus{outline:none;border-color:var(--border-color-focus);box-shadow:0 0 0 2px rgba(139,92,246,0.3);background:var(--input-bg-color-focus);}.add-category-btn{padding:8px 15px !important;font-size:14px !important;min-width:auto !important;background:var(--primary-accent-color) !important;color:white !important;border:none !important;}.add-category-btn:hover{background:#7C3AED !important;transform:none !important;box-shadow:none !important;}.category-management-list li span{flex-grow:1;margin-right:10px;color:var(--text-color);}.category-remove-btn{background-color:rgba(239,68,68,0.1) !important;border:1px solid rgba(239,68,68,0.3) !important;color:var(--error-color) !important;padding:5px 10px !important;min-width:auto !important;font-size:13px !important;}.category-remove-btn:hover{background-color:rgba(239,68,68,0.2) !important;border-color:rgba(239,68,68,0.5) !important;color:#FECACA !important;transform:none !important;box-shadow:none !important;}.no-items-message,.no-custom-categories-message{padding:15px;text-align:center;color:var(--secondary-text-color);}#mztm-tactic-preview{position:fixed;z-index:10002;background-color:#1F2937;color:var(--text-color);border:1px solid var(--border-color-hover);border-radius:var(--border-radius);padding:10px 15px;font-family:"Satoshi",sans-serif;font-size:13px;box-shadow:0 4px 12px rgba(0,0,0,0.2);max-width:250px;pointer-events:none;line-height:1.5;opacity:0;transition:opacity 0.2s ease-in-out;white-space:normal;display:none;}.mztm-preview-formation{margin-bottom:8px;padding-bottom:6px;border-bottom:1px solid var(--border-color);font-size:14px;}.mztm-preview-formation strong{color:var(--primary-accent-color);font-weight:500;}.mztm-preview-desc{max-height:150px;overflow-y:auto;word-wrap:break-word;scrollbar-width:thin;color:var(--secondary-text-color);scrollbar-color:var(--primary-accent-color) rgba(255,255,255,0.05);}.mztm-preview-desc::-webkit-scrollbar{width:4px;}.mztm-preview-desc::-webkit-scrollbar-track{background:rgba(255,255,255,0.05);border-radius:2px;}.mztm-preview-desc::-webkit-scrollbar-thumb{background-color:var(--primary-accent-color);border-radius:2px;}.mztm-preview-no-desc{color:var(--secondary-text-color);opacity:0.7;font-style:italic;}@media (max-width: 768px){#mz_tactics_panel{width:auto;margin:8px 4px;padding:12px;}.mz-group-main-title, .mz-title-container, .action-buttons-row{flex-wrap:wrap;}.formations-controls-container{flex-direction:column;flex-wrap:wrap;gap:10px;}.mztm-filter-controls-row{width:100%;flex-direction:column;gap:10px;}.mz-title-container{width:100%;margin-bottom:8px;justify-content:center;}.mode-toggle-container{width:100%;margin:8px 0 0 0;justify-content:center;}.mztm-custom-select-wrapper{width:100%;min-width:0;}.tactics-search-box{width:100% !important;}.category-filter-wrapper{width:100%;flex-direction:column;gap:10px;}#category_filter_selector{width:100%;}#manage_items_btn{width:100%;}.action-buttons-section{margin-top:12px;}.action-buttons-row{flex-direction:column;gap:8px;width:100%;}#mz_tactics_panel .mzbtn{width:100%;margin:0;}#mz-modal-container{width:95vw;max-width:95vw;padding:16px;}#mz-modal-container.management-modal{width:98vw;max-width:98vw;}#mz-modal-buttons{flex-direction:column-reverse;gap:8px;}.mz-modal-btn{width:100%;margin:0;}.formation-management-list li, .category-management-list li{flex-direction:column;align-items:flex-start;gap:10px;}.item-name-container{width:100%;}.item-controls{width:100%;justify-content:space-between;}.item-category-select{flex-grow:1;}.footer-actions{position:relative;bottom:auto;right:auto;width:100%;margin-top:10px;text-align:center;}}}`
    GM_addStyle(sado);

    const OUTFIELD_PLAYERS_SELECTOR = '.fieldpos.fieldpos-ok.ui-draggable:not(.substitute):not(.goalkeeper):not(.substitute.goalkeeper), .fieldpos.fieldpos-collision.ui-draggable:not(.substitute):not(.goalkeeper):not(.substitute.goalkeeper)';
    const GOALKEEPER_SELECTOR = '.fieldpos.fieldpos-ok.goalkeeper.ui-draggable';
    const FORMATION_TEXT_SELECTOR = '#formation_text';
    const TACTIC_SLOT_SELECTOR = '.ui-state-default.ui-corner-top.ui-tabs-selected.ui-state-active.invalid';
    const MIN_PLAYERS_ON_PITCH = 11;
    const MAX_TACTIC_NAME_LENGTH = 50;
    const MAX_CATEGORY_NAME_LENGTH = 30;
    const MAX_DESCRIPTION_LENGTH = 250;
    const SCRIPT_VERSION = '15';
    const DISPLAY_VERSION = '15';
    const SCRIPT_NAME = 'MZ Tactics Manager';
    const VERSION_KEY = 'mz_tactics_version';
    const COLLAPSED_KEY = 'mz_tactics_collapsed';
    const VIEW_MODE_KEY = 'mztm_view_mode';
    const CATEGORIES_STORAGE_KEY = 'mz_tactics_categories';
    const FORMATIONS_STORAGE_KEY = 'mztm_formations';
    const OLD_FORMATIONS_STORAGE_KEY = 'ls_tactics';
    const COMPLETE_TACTICS_STORAGE_KEY = 'mztm_complete_tactics';
    const ROSTER_CACHE_KEY = 'mztm_roster_cache';
    const USER_INFO_CACHE_KEY = 'mztm_user_info_cache';
    const CATEGORY_FILTER_STORAGE_KEY = 'mztm_last_category_filter';
    const ROSTER_CACHE_DURATION_MS = 3600000;
    const USER_INFO_CACHE_DURATION_MS = 86400000;
    const INITIAL_FORMATIONS_DATA = {"tactics": [{"name": "SP_3d_1dm (1)","coordinates": [[96,54],[147,54],[120,94],[96,141],[139,169],[52,171],[96,188],[139,216],[54,217],[97,236]]},{"name": "SP_3d_1dm (2)","coordinates": [[101,54],[74,96],[120,97],[96,137],[55,163],[137,163],[96,184],[55,210],[137,210],[96,231]]},{"name": "SP_3d_1dm (3)","coordinates": [[97,54],[138,78],[97,101],[96,147],[56,170],[136,171],[96,194],[56,218],[136,218],[96,241]]},{"name": "SP_3d_1dm (4)","coordinates": [[118,54],[97,95],[144,95],[97,148],[57,172],[137,172],[97,195],[57,219],[137,219],[97,242]]},{"name": "SP_3d_1dm (5)","coordinates": [[125,54],[82,77],[122,101],[81,126],[56,167],[136,167],[96,190],[56,214],[136,214],[96,237]]},{"name": "SP_3d_mand (1)","coordinates": [[96,54],[136,77],[96,101],[136,124],[96,148],[72,188],[120,188],[49,228],[96,228],[143,228]]},{"name": "SP_3d_morph (1)","coordinates": [[86,54],[154,54],[120,85],[96,125],[143,125],[72,165],[119,165],[49,205],[96,205],[143,205]]},{"name": "SP_3d_morph (2)","coordinates": [[82,55],[161,56],[124,88],[157,121],[96,125],[72,165],[119,165],[49,205],[96,205],[143,205]]},{"name": "SP_4d_2dm_c (1)","coordinates": [[100,54],[73,96],[123,98],[97,136],[73,176],[120,176],[26,209],[167,209],[73,224],[120,224]]},{"name": "SP_4d_2dm_c (2)","coordinates": [[69,54],[129,54],[97,92],[97,139],[73,179],[120,179],[26,209],[167,209],[73,227],[120,227]]},{"name": "SP_4d_2dm_c (3)","coordinates": [[97,54],[145,54],[119,98],[97,146],[73,186],[120,186],[26,209],[167,209],[73,234],[120,234]]},{"name": "SP_4d_2dm_w (1)","coordinates": [[77,54],[144,54],[111,87],[96,134],[70,172],[122,172],[3,217],[191,217],[73,219],[120,220]]},{"name": "SP_4d_2dm_w (2)","coordinates": [[91,55],[130,83],[85,103],[98,149],[121,190],[75,191],[5,214],[189,214],[74,237],[121,237]]},{"name": "SP_4d_3dm (1)","coordinates": [[100,54],[74,99],[121,99],[50,174],[144,174],[96,176],[26,216],[73,216],[120,216],[167,216]]},{"name": "SP_4d_3dm (2)","coordinates": [[92,54],[143,54],[113,103],[97,160],[45,174],[151,176],[3,215],[187,215],[74,218],[128,218]]},{"name": "SP_5d_2dm (1)","coordinates": [[106,54],[81,93],[96,137],[73,177],[120,177],[2,205],[190,205],[49,217],[96,217],[143,217]]},{"name": "SP_5d_2dm (2)","coordinates": [[101,72],[75,118],[121,122],[73,177],[120,177],[2,205],[190,205],[49,217],[96,217],[143,217]]},{"name": "SP_5d_2dm (3)","coordinates": [[66,54],[126,54],[96,125],[73,165],[120,165],[2,205],[49,205],[96,205],[143,205],[190,205]]},{"name": "WP_2d_3dm_1w (1)","coordinates": [[125,56],[190,60],[78,71],[97,190],[49,191],[146,191],[191,215],[3,218],[74,230],[121,230]]},{"name": "WP_3d_1dm_1w (1)","coordinates": [[124,54],[191,60],[82,73],[97,145],[57,168],[137,170],[97,194],[57,217],[137,217],[97,241]]},{"name": "WP_3d_2dm_1w (1)","coordinates": [[128,54],[189,62],[78,69],[120,148],[72,149],[73,195],[120,195],[50,235],[97,235],[143,236]]},{"name": "WP_3d_3dm_1w (1)","coordinates": [[188,67],[79,72],[124,102],[98,142],[74,182],[121,182],[168,182],[51,222],[98,222],[145,222]]},{"name": "WP_4d_2dm_1w_c (1)","coordinates": [[125,54],[191,60],[82,71],[97,150],[74,192],[121,192],[34,216],[161,216],[74,240],[121,240]]},{"name": "WP_4d_2dm_1w_c (2)","coordinates": [[191,60],[82,71],[123,92],[97,150],[74,192],[121,192],[34,216],[161,216],[74,240],[121,240]]},{"name": "WP_4d_2dm_1w_w (1)","coordinates": [[122,54],[189,58],[79,72],[97,142],[73,182],[122,182],[7,209],[187,209],[72,228],[123,228]]},{"name": "WP_4d_2dm_2w_c (1)","coordinates": [[78,71],[191,72],[164,110],[96,153],[72,193],[120,193],[30,220],[162,220],[72,240],[120,240]]},{"name": "WP_4d_3dm_1w_w (1)","coordinates": [[126,54],[190,61],[80,72],[50,174],[97,174],[144,174],[30,217],[77,217],[124,217],[171,217]]},{"name": "WP_4d_2dm_1w_w (2)","coordinates": [[124,54],[189,54],[77,71],[97,128],[96,176],[144,176],[26,216],[73,216],[120,216],[167,216]]},{"name": "WP_5d_2dm_1w (1)","coordinates": [[190,57],[78,71],[96,123],[74,174],[121,174],[192,207],[4,208],[50,214],[97,214],[144,214]]},{"name": "WP_5d_2dm_2w (1)","coordinates": [[190,60],[81,71],[168,105],[122,177],[75,178],[5,207],[189,207],[50,217],[144,218],[97,219]]}]};
    const DEFAULT_CATEGORIES = {
        'short_passing': {
            id: 'short_passing',
            name: 'Short Passing',
            color: '#54a0ff'
        },
        'wing_play': {
            id: 'wing_play',
            name: 'Wing Play',
            color: '#5dd39e'
        }
    };
    const NEW_CATEGORY_ID = 'new_category';
    const OTHER_CATEGORY_ID = 'other';
    const USERSCRIPT_STRINGS = {
        addButton: 'Add',
        addCurrentTactic: 'Add Current',
        addWithXmlButton: 'Add via XML',
        manageButton: 'Manage',
        deleteButton: 'Delete',
        renameButton: 'Edit',
        updateButton: 'Update Coords',
        clearButton: 'Clear',
        resetButton: 'Reset',
        importButton: 'Import',
        exportButton: 'Export',
        infoButton: 'FAQ',
        saveButton: 'Save',
        tacticNamePrompt: 'Please enter a name and a category',
        addAlert: 'Formation {} added successfully.',
        deleteAlert: 'Item {} deleted successfully.',
        renameAlert: 'Item {} successfully edited.',
        updateAlert: 'Formation {} updated successfully.',
        clearAlert: 'Formations cleared successfully.',
        resetAlert: 'Formations were reset successfully.',
        importAlert: 'Formations imported successfully.',
        exportAlert: 'Formations JSON copied to clipboard.',
        deleteConfirmation: 'Do you really want to delete {}?',
        updateConfirmation: 'Do you really want to update {} coords?',
        clearConfirmation: 'Do you really want to clear all saved formations?',
        resetConfirmation: 'Reset to default formations? This will remove all your custom formations.',
        invalidTacticError: 'Invalid formation. Ensure 11 players are on the pitch.',
        noTacticNameProvidedError: 'No name provided.',
        alreadyExistingTacticNameError: 'Name already exists.',
        tacticNameMaxLengthError: `Name is too long (max ${MAX_TACTIC_NAME_LENGTH} chars).`,
        noTacticSelectedError: 'No item selected.',
        duplicateTacticError: 'This formation already exists.',
        duplicateTacticErrorWithName: 'This formation already exists (name: {}).',
        noChangesMadeError: 'No changes detected in player positions.',
        invalidImportError: 'Invalid import data. Please provide valid JSON.',
        modalContentInfoText: 'MZ Tactics Manager by douglaskampl.',
        modalContentFeedbackText: 'For feedback or suggestions, contact via GB/Chat.',
        usefulContent: '',
        tacticsDropdownMenuLabel: 'Select a Formation',
        completeTacticsDropdownMenuLabel: 'Select a Tactic',
        errorTitle: 'Error',
        doneTitle: 'Success',
        confirmationTitle: 'Confirmation',
        deleteTacticConfirmButton: 'Delete',
        cancelConfirmButton: 'Cancel',
        updateConfirmButton: 'Update',
        clearTacticsConfirmButton: 'Clear',
        resetTacticsConfirmButton: 'Reset',
        addConfirmButton: 'Add',
        xmlValidationError: 'Invalid XML format',
        xmlParsingError: 'Error parsing XML',
        xmlPlaceholder: 'Paste Formation XML here',
        tacticNamePlaceholder: 'Formation name',
        managerTitle: SCRIPT_NAME,
        searchPlaceholder: 'Search...',
        allTacticsFilter: 'All',
        noTacticsFound: 'No formations found',
        welcomeMessage: `Userscript updated to v${SCRIPT_VERSION}.\n\nChanges in this version:\n• Userscript is now more mobile-friendly.`,
        welcomeGotIt: 'Got it!',
        removeCategoryConfirmation: 'Remove category "{}"? (All formations in this category will be moved to "Other").',
        removeCategoryAlert: 'Category "{}" removed successfully.',
        removeCategoryButton: 'Remove',
        completeTacticsTitle: 'Tactics Management',
        saveCompleteTacticButton: 'Save Current',
        loadCompleteTacticButton: 'Load',
        deleteCompleteTacticButton: 'Delete',
        renameCompleteTacticButton: 'Rename',
        updateCompleteTacticButton: 'Update with Current',
        importCompleteTacticsButton: 'Import',
        exportCompleteTacticsButton: 'Export',
        completeTacticNamePrompt: 'Please enter a name for the tactic',
        renameCompleteTacticPrompt: 'Enter a new name for the tactic:',
        updateCompleteTacticConfirmation: 'Overwrite tactic "{}" with the current setup (positions, rules, settings) from the pitch?',
        completeTacticSaveSuccess: 'Tactic {} saved successfully.',
        completeTacticLoadSuccess: 'Tactic {} loaded successfully.',
        completeTacticDeleteSuccess: 'Tactic {} deleted successfully.',
        completeTacticRenameSuccess: 'Tactic renamed to {} successfully.',
        completeTacticUpdateSuccess: 'Tactic {} updated successfully.',
        importCompleteTacticsTitle: 'Import Tactics (JSON)',
        exportCompleteTacticsTitle: 'Export Tactics (JSON)',
        importCompleteTacticsPlaceholder: 'Paste Tactics JSON here',
        importCompleteTacticsAlert: 'Tactics imported successfully.',
        exportCompleteTacticsAlert: 'Tactics JSON copied to clipboard.',
        invalidCompleteImportError: 'Invalid import data. Please provide valid JSON (object map).',
        errorFetchingRoster: 'Error fetching team roster. Cannot load Tactic.',
        errorInsufficientPlayers: 'Not enough available players in roster to fill required positions.',
        errorXmlExportParse: 'Error parsing XML from native export.',
        errorXmlGenerate: 'Error generating XML for import.',
        errorImportFailed: 'Native import failed. Check XML validity or player availability.',
        warningPlayersSubstituted: 'Warning: roster mismatch. Some were players replaced at random. Tactic updated!',
        invalidXmlForImport: 'MZ rejected the generated XML. It might be invalid or player assignments failed.',
        completeTacticNamePlaceholder: 'Tactic name',
        normalModeLabel: 'Formations',
        completeModeLabel: 'Tactics',
        modeLabel: '',
        manageCategoriesTitle: 'Manage Categories',
        noCustomCategories: 'No custom categories to manage.',
        manageCategoriesDoneButton: 'Done',
        managementModalTitle: 'Manage Formations & Categories',
        formationsTabTitle: 'Formations',
        categoriesTabTitle: 'Categories',
        addCategoryPlaceholder: 'New category name...',
        addCategoryButton: '+ Add',
        categoryNameMaxLengthError: `Category name too long (max ${MAX_CATEGORY_NAME_LENGTH} chars).`,
        saveChangesButton: 'Save Changes',
        changesSavedSuccess: 'Changes saved successfully.',
        noChangesToSave: 'No changes to save.',
        descriptionLabel: 'Description (optional):',
        descriptionPlaceholder: `Enter a short description (max ${MAX_DESCRIPTION_LENGTH} chars)...`,
        descriptionMaxLengthError: `Description too long (max ${MAX_DESCRIPTION_LENGTH} chars).`,
        previewFormationLabel: 'Formation:',
        xmlRequiredError: 'Please paste the XML data first.',
        invalidXmlFormatError: 'The provided text does not appear to be valid XML.',
        noTacticsSaved: 'No formations saved',
        noCompleteTacticsSaved: 'No tactics saved'
    };
    const DEFAULT_MODAL_STRINGS = {
        ok: 'OK',
        cancel: 'Cancel',
        error: 'Error',
        close: '×'
    };

    let tactics = [];
    let completeTactics = {};
    let currentFilter = 'all';
    let searchTerm = '';
    let categories = {};
    let rosterCache = { data: null, timestamp: 0, teamId: null };
    let userInfoCache = { teamId: null, username: null, timestamp: 0 };
    let teamId = null;
    let username = null;
    let loadingOverlay = null;
    let currentViewMode = 'normal';
    let collapsedIconElement = null;
    let previewElement = null;
    let previewHideTimeout = null;
    let currentOpenDropdown = null;
    let selectedFormationTacticId = null;
    let selectedCompleteTacticName = null;

    function createModalIcon(type) {
        if (!type) return null;
        const i = document.createElement('div');
        i.classList.add('mz-modal-icon');
        if (type === 'success') {
            i.classList.add('success');
            i.innerHTML = '✓';
        } else if (type === 'error') {
            i.classList.add('error');
            i.innerHTML = '✗';
        } else if (type === 'info') {
            i.classList.add('info');
            i.innerHTML = 'ℹ';
        }
        return i;
    }

    function validateModalInput(inputElement, validatorFn, errorElementId) {
        if (!validatorFn || !inputElement || !inputElement.parentNode) return null;
        const validationError = validatorFn(inputElement.value);
        const existingError = document.getElementById(errorElementId);
        if (existingError) existingError.remove();
        if (!validationError) return null;
        const errorContainer = document.createElement('div');
        errorContainer.id = errorElementId;
        errorContainer.style.color = '#ff6b6b';
        errorContainer.style.marginTop = inputElement.tagName === 'TEXTAREA' ? '5px' : '-10px';
        errorContainer.style.marginBottom = '10px';
        errorContainer.style.fontSize = '13px';
        errorContainer.textContent = validationError;
        inputElement.parentNode.insertBefore(errorContainer, inputElement.nextSibling);
        return validationError;
    }


    function closeModal(overlayElement, callback) {
        if (!overlayElement) return;
        overlayElement.classList.remove('active');
        setTimeout(() => {
            if (overlayElement && overlayElement.parentNode === document.body) document.body.removeChild(overlayElement);
            if (callback) callback();
        }, 300);
    }

    function handleAlertConfirm(options, inputElement, descElement, categorySelect, newCategoryInput, overlayElement, resolve) {
        if (options.input === 'text' && options.inputValidator && inputElement) {
            const validationError = validateModalInput(inputElement, options.inputValidator, 'mz-modal-input-error');
            if (validationError) return;
        }
        if (options.descriptionInput === 'textarea' && options.descriptionValidator && descElement) {
            const descValidationError = validateModalInput(descElement, options.descriptionValidator, 'mz-modal-desc-error');
            if (descValidationError) return;
        }

        let selectedCategoryId = null;
        let newCategoryName = null;
        if (categorySelect) {
            selectedCategoryId = categorySelect.value;
            if (selectedCategoryId === NEW_CATEGORY_ID && newCategoryInput) {
                newCategoryName = newCategoryInput.value.trim();
                const categoryErrorElement = document.getElementById('new-category-error');
                if (categoryErrorElement) categoryErrorElement.remove();
                if (!newCategoryName) {
                    const errorText = document.createElement('div');
                    errorText.style.color = '#ff6b6b';
                    errorText.style.marginTop = '5px';
                    errorText.style.fontSize = '13px';
                    errorText.textContent = 'Category name cannot be empty.';
                    errorText.id = 'new-category-error';
                    newCategoryInput.parentNode.appendChild(errorText);
                    return;
                }
                const existingCategory = Object.values(categories).find(cat => cat.name.toLowerCase() === newCategoryName.toLowerCase());
                if (existingCategory) {
                    const errorText = document.createElement('div');
                    errorText.style.color = '#ff6b6b';
                    errorText.style.marginTop = '5px';
                    errorText.style.fontSize = '13px';
                    errorText.textContent = 'Category name already exists.';
                    errorText.id = 'new-category-error';
                    newCategoryInput.parentNode.appendChild(errorText);
                    return;
                }
            }
        }
        closeModal(overlayElement, () => {
            let result = {
                isConfirmed: true
            };
            if (options.input === 'text') {
                result.value = inputElement ? inputElement.value : null;
            }
            if (options.descriptionInput === 'textarea') {
                result.description = descElement ? descElement.value : null;
            }
            if (categorySelect) {
                if (selectedCategoryId === NEW_CATEGORY_ID && newCategoryName) {
                    const newCategoryId = generateCategoryId(newCategoryName);
                    const newCategory = {
                        id: newCategoryId,
                        name: newCategoryName,
                        color: generateCategoryColor(newCategoryName)
                    };
                    result.category = newCategory;
                    addCategory(newCategory);
                } else {
                    result.category = categories[selectedCategoryId] || categories[OTHER_CATEGORY_ID] || {
                        id: OTHER_CATEGORY_ID,
                        name: 'Other',
                        color: '#8395a7'
                    };
                }
            }
            resolve(result);
        });
    }

    function handleAlertCancel(overlayElement, resolve) {
        closeModal(overlayElement, () => {
            resolve({
                isConfirmed: false,
                value: null,
                description: null
            });
        });
    }

    function setUpKeyboardHandler(confirmHandler, cancelHandler, inputElement, descElement) {
        return function (event) {
            if (event.key === 'Escape') {
                cancelHandler();
            } else if (event.key === 'Enter') {
                const activeEl = document.activeElement;
                if (!(activeEl === descElement && descElement?.tagName === 'TEXTAREA') && !(activeEl === inputElement && inputElement?.tagName === 'TEXTAREA')) {
                    confirmHandler();
                } else if (activeEl === inputElement && inputElement?.tagName === 'INPUT') {
                    confirmHandler();
                }
            }
        };
    }

    function showAlert(options) {
        return new Promise((resolve) => {
            const overlay = document.createElement('div');
            overlay.id = 'mz-modal-overlay';
            const container = document.createElement('div');
            container.id = 'mz-modal-container';
            if (options.modalClass) container.classList.add(options.modalClass);
            const header = document.createElement('div');
            header.id = 'mz-modal-header';
            const titleContainer = document.createElement('div');
            titleContainer.classList.add('mz-modal-title-with-icon');
            const icon = createModalIcon(options.type);
            if (icon) titleContainer.appendChild(icon);
            const title = document.createElement('h2');
            title.id = 'mz-modal-title';
            title.textContent = options.title || '';
            titleContainer.appendChild(title);
            header.appendChild(titleContainer);
            const closeButton = document.createElement('button');
            closeButton.id = 'mz-modal-close';
            closeButton.innerHTML = DEFAULT_MODAL_STRINGS.close;
            header.appendChild(closeButton);
            const content = document.createElement('div');
            content.id = 'mz-modal-content';
            if (options.htmlContent) {
                content.appendChild(options.htmlContent);
            } else if (options.text) {
                const textNode = document.createTextNode(options.text);
                content.appendChild(textNode);
            }
            let inputElem = null,
                descElem = null,
                descLabel = null,
                categorySelectElem = null,
                newCategoryInputElem = null,
                categoryContainer = null;

            if (options.input === 'text') {
                inputElem = document.createElement('input');
                inputElem.id = 'mz-modal-input';
                inputElem.type = 'text';
                inputElem.value = options.inputValue || '';
                inputElem.placeholder = options.placeholder || '';
            }

            if (options.descriptionInput === 'textarea') {
                descLabel = document.createElement('label');
                descLabel.className = 'mz-modal-label';
                descLabel.textContent = options.descriptionLabel || USERSCRIPT_STRINGS.descriptionLabel;
                descLabel.htmlFor = 'mz-modal-description';
                descElem = document.createElement('textarea');
                descElem.id = 'mz-modal-description';
                descElem.value = options.descriptionValue || '';
                descElem.placeholder = options.descriptionPlaceholder || USERSCRIPT_STRINGS.descriptionPlaceholder;
                descElem.rows = 3;
            }

            if (options.showCategorySelector) {
                categoryContainer = document.createElement('div');
                categoryContainer.className = 'category-selection-container';
                const categoryLabel = document.createElement('label');
                categoryLabel.className = 'category-selection-label';
                categoryLabel.textContent = 'Category:';
                categoryContainer.appendChild(categoryLabel);
                categorySelectElem = document.createElement('select');
                categorySelectElem.id = 'category-selector';
                const usedCategoryIds = new Set(tactics.map(t => t.style).filter(Boolean));
                if (options.currentCategory) usedCategoryIds.add(options.currentCategory);
                const availableCategories = Object.values(categories).filter(cat => DEFAULT_CATEGORIES[cat.id] || cat.id === OTHER_CATEGORY_ID || usedCategoryIds.has(cat.id));
                availableCategories.sort((a, b) => {
                    if (a.id === OTHER_CATEGORY_ID) return 1;
                    if (b.id === OTHER_CATEGORY_ID) return -1;
                    return a.name.localeCompare(b.name);
                });
                availableCategories.forEach(cat => {
                    if (cat.id !== OTHER_CATEGORY_ID) {
                        const opt = document.createElement('option');
                        opt.value = cat.id;
                        opt.textContent = cat.name;
                        categorySelectElem.appendChild(opt);
                    }
                });
                const otherOption = document.createElement('option');
                otherOption.value = OTHER_CATEGORY_ID;
                otherOption.textContent = getCategoryName(OTHER_CATEGORY_ID);
                categorySelectElem.appendChild(otherOption);
                const addNewOption = document.createElement('option');
                addNewOption.value = NEW_CATEGORY_ID;
                addNewOption.textContent = '+ New category';
                categorySelectElem.appendChild(addNewOption);
                categorySelectElem.value = (options.currentCategory && categories[options.currentCategory]) ? options.currentCategory : OTHER_CATEGORY_ID;
                const newCategoryContainer = document.createElement('div');
                newCategoryContainer.className = 'new-category-input-container';
                newCategoryInputElem = document.createElement('input');
                newCategoryInputElem.id = 'new-category-input';
                newCategoryInputElem.type = 'text';
                newCategoryInputElem.placeholder = 'New category name';
                newCategoryContainer.appendChild(newCategoryInputElem);
                categorySelectElem.addEventListener('change', function () {
                    const isNew = this.value === NEW_CATEGORY_ID;
                    newCategoryContainer.classList.toggle('visible', isNew);
                    if (isNew) newCategoryInputElem.focus();
                    const categoryError = document.getElementById('new-category-error');
                    if (categoryError) categoryError.remove();
                });
                categoryContainer.appendChild(categorySelectElem);
                categoryContainer.appendChild(newCategoryContainer);
            }
            const buttons = document.createElement('div');
            buttons.id = 'mz-modal-buttons';
            const confirmHandler = () => handleAlertConfirm(options, inputElem, descElem, categorySelectElem, newCategoryInputElem, overlay, resolve);
            const cancelHandler = () => handleAlertCancel(overlay, resolve);
            const confirmButton = document.createElement('button');
            confirmButton.classList.add('mz-modal-btn', 'primary');
            confirmButton.textContent = options.confirmButtonText || DEFAULT_MODAL_STRINGS.ok;
            confirmButton.addEventListener('click', confirmHandler);
            buttons.appendChild(confirmButton);
            if (options.showCancelButton) {
                const cancelButton = document.createElement('button');
                cancelButton.classList.add('mz-modal-btn', 'cancel');
                cancelButton.textContent = options.cancelButtonText || DEFAULT_MODAL_STRINGS.cancel;
                cancelButton.addEventListener('click', cancelHandler);
                buttons.appendChild(cancelButton);
            }
            closeButton.addEventListener('click', cancelHandler);
            const keyboardHandler = setUpKeyboardHandler(confirmHandler, cancelHandler, inputElem, descElem);
            document.addEventListener('keydown', keyboardHandler);

            container.appendChild(header);
            container.appendChild(content);
            if (inputElem) {
                container.appendChild(inputElem);
            }
            if (descLabel && descElem) {
                container.appendChild(descLabel);
                container.appendChild(descElem);
            }
            if (categoryContainer) {
                container.appendChild(categoryContainer);
            }
            container.appendChild(buttons);

            overlay.appendChild(container);
            document.body.appendChild(overlay);
            setTimeout(() => {
                overlay.classList.add('active');
                if (inputElem) inputElem.focus();
                else if (descElem) descElem.focus();
                if (categorySelectElem && categorySelectElem.value === NEW_CATEGORY_ID) newCategoryInputElem.focus();
            }, 10);
            overlay.addEventListener('transitionend', () => {
                if (!overlay.classList.contains('active')) document.removeEventListener('keydown', keyboardHandler);
            });
        });
    }

    function showSuccessMessage(title, text) {
        return showAlert({
            title: title || USERSCRIPT_STRINGS.doneTitle,
            text: text,
            type: 'success'
        });
    }

    function showErrorMessage(title, text) {
        return showAlert({
            title: title || USERSCRIPT_STRINGS.errorTitle,
            text: text,
            type: 'error'
        });
    }

    function showWelcomeMessage() {
        return showAlert({
            title: '',
            text: USERSCRIPT_STRINGS.welcomeMessage,
            confirmButtonText: USERSCRIPT_STRINGS.welcomeGotIt
        });
    }

    function showLoadingOverlay() {
        if (!loadingOverlay) {
            loadingOverlay = document.createElement('div');
            loadingOverlay.id = 'loading-overlay';
            const spinner = document.createElement('div');
            spinner.id = 'loading-spinner';
            loadingOverlay.appendChild(spinner);
            document.body.appendChild(loadingOverlay);
        }
        setTimeout(() => loadingOverlay.classList.add('visible'), 10);
    }

    function hideLoadingOverlay() {
        if (loadingOverlay) loadingOverlay.classList.remove('visible');
    }

    function isFootball() {
        return !!document.querySelector('div#tactics_box.soccer.clearfix');
    }

    function sha256Hash(s) {
        const shaObj = new jsSHA('SHA-256', 'TEXT');
        shaObj.update(s);
        return shaObj.getHash('HEX');
    }

    function insertAfterElement(newNode, referenceNode) {
        if (referenceNode && referenceNode.parentNode) {
            referenceNode.parentNode.insertBefore(newNode, referenceNode.nextSibling);
        }
    }

    function appendChildren(parent, children) {
        children.forEach((child) => {
            if (child) parent.appendChild(child);
        });
    }

    function getFormattedDate() {
        const now = new Date();
        const year = now.getFullYear();
        const month = (now.getMonth() + 1).toString().padStart(2, '0');
        const day = now.getDate().toString().padStart(2, '0');
        return `${year}-${month}-${day}`;
    }

    async function fetchTacticsFromGMStorage() {
        return GM_getValue(FORMATIONS_STORAGE_KEY, {
            tactics: []
        });
    }

    function storeTacticsInGMStorage(data) {
        GM_setValue(FORMATIONS_STORAGE_KEY, data);
    }

    async function validateDuplicateTactic(id) {
        const data = await GM_getValue(FORMATIONS_STORAGE_KEY) || { tactics: [] };
        const duplicateTactic = data.tactics.find(t => t.id === id);
        return duplicateTactic ? duplicateTactic.name : null;
    }

    async function saveTacticToStorage(tactic) {
        const data = await GM_getValue(FORMATIONS_STORAGE_KEY) || {
            tactics: []
        };
        data.tactics.push(tactic);
        await GM_setValue(FORMATIONS_STORAGE_KEY, data);
    }

    async function validateDuplicateTacticWithUpdatedCoord(newId, currentTactic, data) {
        if (newId === currentTactic.id) return { status: 'unchanged', name: null };
        const duplicateTactic = data.tactics.find(t => t.id === newId);
        if (duplicateTactic) return { status: 'duplicate', name: duplicateTactic.name };
        return { status: 'unique', name: null };
    }

    function loadCompleteTacticsData() {
        completeTactics = GM_getValue(COMPLETE_TACTICS_STORAGE_KEY, {});
        updateCompleteTacticsDropdown();
    }

    function saveCompleteTacticsData() {
        GM_setValue(COMPLETE_TACTICS_STORAGE_KEY, completeTactics);
    }

    async function fetchTeamIdAndUsername(forceRefresh = false) {
        const now = Date.now();
        const cachedInfo = GM_getValue(USER_INFO_CACHE_KEY);
        if (!forceRefresh && cachedInfo && cachedInfo.teamId && cachedInfo.username && (now - cachedInfo.timestamp < USER_INFO_CACHE_DURATION_MS)) {
            teamId = cachedInfo.teamId;
            username = cachedInfo.username;
            return {
                teamId,
                username
            };
        }
        try {
            const usernameElement = document.getElementById('header-username');
            if (!usernameElement) throw new Error('No username element found');
            const currentUsername = usernameElement.textContent.trim();
            const url = `/xml/manager_data.php?sport_id=1&username=${encodeURIComponent(currentUsername)}`;
            const response = await fetch(url);
            if (!response.ok) throw new Error(`HTTP error ${response.status}`);
            const xmlString = await response.text();
            const parser = new DOMParser();
            const xmlDoc = parser.parseFromString(xmlString, 'text/xml');
            const teamElement = xmlDoc.querySelector('Team[sport="soccer"]');
            if (!teamElement) throw new Error('No soccer team data found in XML');
            const currentTeamId = teamElement.getAttribute('teamId');
            if (!currentTeamId) throw new Error('No team ID found in XML');
            teamId = currentTeamId;
            username = currentUsername;
            const newUserInfo = {
                teamId: teamId,
                username: username,
                timestamp: now
            };
            GM_setValue(USER_INFO_CACHE_KEY, newUserInfo);
            return {
                teamId,
                username
            };
        } catch (error) {
            console.error('Error fetching Team ID and Username:', error);
            showErrorMessage(USERSCRIPT_STRINGS.errorTitle, 'Could not fetch team info. Some features might be limited.');
            return {
                teamId: null,
                username: null
            };
        }
    }

    async function fetchTeamRoster(forceRefresh = false) {
        const now = Date.now();
        if (!teamId) {
            const ids = await fetchTeamIdAndUsername();
            if (!ids.teamId) {
                console.error("Cannot fetch roster without Team ID.");
                return null;
            }
        }
        const cachedRoster = GM_getValue(ROSTER_CACHE_KEY);
        const isCacheValid = !forceRefresh && cachedRoster && cachedRoster.data && cachedRoster.teamId === teamId && (now - cachedRoster.timestamp < ROSTER_CACHE_DURATION_MS);
        if (isCacheValid) {
            return cachedRoster.data;
        }
        try {
            const url = `/xml/team_playerlist.php?sport_id=1&team_id=${teamId}`;
            const response = await fetch(url);
            if (!response.ok) throw new Error(`HTTP error ${response.status}`);
            const xmlString = await response.text();
            const parser = new DOMParser();
            const xmlDoc = parser.parseFromString(xmlString, 'text/xml');
            const playerElements = Array.from(xmlDoc.querySelectorAll('TeamPlayers Player'));
            const roster = playerElements.map(p => p.getAttribute('id')).filter(id => id);
            if (roster.length === 0) {
                console.warn("Fetched roster is empty for team", teamId);
            }
            rosterCache = {
                data: roster,
                timestamp: now,
                teamId: teamId
            };
            GM_setValue(ROSTER_CACHE_KEY, rosterCache);
            return roster;
        } catch (error) {
            console.error('Error fetching team roster:', error);
            showErrorMessage(USERSCRIPT_STRINGS.errorTitle, USERSCRIPT_STRINGS.errorFetchingRoster);
            return null;
        }
    }

    function generateUniqueId(coordinates) {
        coordinates.sort((a, b) => {
            if (a[1] !== b[1]) return a[1] - b[1];
            else return a[0] - b[0];
        });
        const coordString = coordinates.map(coord => `${coord[0]},${coord[1]}`).join(';');
        return sha256Hash(coordString);
    }

    function handleTacticSelection(tacticId) {
        selectedFormationTacticId = tacticId;
        if (!tacticId) return;
        const outfieldPlayers = Array.from(document.querySelectorAll(OUTFIELD_PLAYERS_SELECTOR));
        const selectedTactic = tactics.find(td => td.id === tacticId);
        if (selectedTactic) {
            if (outfieldPlayers.length < MIN_PLAYERS_ON_PITCH - 1) {
                const hiddenTrigger = document.getElementById('hidden_trigger_button');
                if (hiddenTrigger) hiddenTrigger.click();
                setTimeout(() => rearrangePlayers(selectedTactic.coordinates), 100);
            } else {
                rearrangePlayers(selectedTactic.coordinates);
            }
        }
    }

    function rearrangePlayers(coordinates) {
        const outfieldPlayers = Array.from(document.querySelectorAll(OUTFIELD_PLAYERS_SELECTOR));
        findBestPositions(outfieldPlayers, coordinates);
        for (let i = 0; i < outfieldPlayers.length; ++i) {
            if (coordinates[i]) {
                outfieldPlayers[i].style.left = coordinates[i][0] + 'px';
                outfieldPlayers[i].style.top = coordinates[i][1] + 'px';
                removeCollision(outfieldPlayers[i]);
            }
        }
        removeTacticSlotInvalidStatus();
        updateFormationTextDisplay(getFormation(coordinates));
    }

    function findBestPositions(players, coordinates) {
        players.sort((a, b) => parseInt(a.style.top) - parseInt(b.style.top));
        coordinates.sort((a, b) => a[1] - b[1]);
    }

    function removeCollision(playerElement) {
        if (playerElement.classList.contains('fieldpos-collision')) {
            playerElement.classList.remove('fieldpos-collision');
            playerElement.classList.add('fieldpos-ok');
        }
    }

    function removeTacticSlotInvalidStatus() {
        const slot = document.querySelector(TACTIC_SLOT_SELECTOR);
        if (slot) slot.classList.remove('invalid');
    }

    function updateFormationTextDisplay(formation) {
        const formationTextElement = document.querySelector(FORMATION_TEXT_SELECTOR);
        if (formationTextElement) {
            const defs = formationTextElement.querySelector('.defs'),
                mids = formationTextElement.querySelector('.mids'),
                atts = formationTextElement.querySelector('.atts');
            if (defs) defs.textContent = formation.defenders;
            if (mids) mids.textContent = formation.midfielders;
            if (atts) atts.textContent = formation.strikers;
        }
    }

    function getFormation(coordinates) {
        let strikers = 0,
            midfielders = 0,
            defenders = 0;
        for (const coord of coordinates) {
            const y = coord[1];
            if (y < 103) strikers++;
            else if (y <= 204) midfielders++;
            else defenders++;
        }
        return {
            strikers,
            midfielders,
            defenders
        };
    }

    function getFormationFromCompleteTactic(tacticData) {
        let strikers = 0,
            midfielders = 0,
            defenders = 0;

        if (tacticData.players) {
            for (const pid in tacticData.players) {
                const player = tacticData.players[pid];
                if (player.pos === 'normal' && player.initial) {
                    const y = player.initial.y - 9;
                    if (y < 103) strikers++;
                    else if (y <= 204) midfielders++;
                    else defenders++;
                }
            }
        } else if (tacticData.initialCoords) {
            const outfieldCoords = tacticData.initialCoords.filter(p => p.pos === 'normal');
            for (const coord of outfieldCoords) {
                const y = coord.y - 9;
                if (y < 103) strikers++;
                else if (y <= 204) midfielders++;
                else defenders++;
            }
        }

        if (strikers + midfielders + defenders !== 10) {
            console.warn("Calculated formation from complete tactic doesn't sum to 10 outfield players.");
        }
        return {
            strikers,
            midfielders,
            defenders
        };
    }

    function formatFormationString(formationObj) {
        if (!formationObj || typeof formationObj.defenders === 'undefined') return 'N/A';
        return `${formationObj.defenders}-${formationObj.midfielders}-${formationObj.strikers}`;
    }

    function validateTacticPlayerCount(outfieldPlayers) {
        const isGoalkeeperPresent = document.querySelector(GOALKEEPER_SELECTOR);
        outfieldPlayers = outfieldPlayers.filter(p => !p.classList.contains('fieldpos-collision'));
        if (outfieldPlayers.length < MIN_PLAYERS_ON_PITCH - 1 || !isGoalkeeperPresent) {
            showErrorMessage(USERSCRIPT_STRINGS.errorTitle, USERSCRIPT_STRINGS.invalidTacticError);
            return false;
        }
        return true;
    }

    async function loadInitialTacticsAndCategories() {
        const initialTacticsToSave = [];

        if (INITIAL_FORMATIONS_DATA && INITIAL_FORMATIONS_DATA.tactics) {
            INITIAL_FORMATIONS_DATA.tactics.forEach(tacticEntry => {
                if (tacticEntry.name && Array.isArray(tacticEntry.coordinates)) {
                    const newId = generateUniqueId(tacticEntry.coordinates);
                    let categoryId = OTHER_CATEGORY_ID;

                    if (DEFAULT_CATEGORIES.short_passing && tacticEntry.name.startsWith('SP_')) {
                        categoryId = DEFAULT_CATEGORIES.short_passing.id;
                    } else if (DEFAULT_CATEGORIES.wing_play && tacticEntry.name.startsWith('WP_')) {
                        categoryId = DEFAULT_CATEGORIES.wing_play.id;
                    }

                    initialTacticsToSave.push({
                        name: tacticEntry.name,
                        coordinates: tacticEntry.coordinates,
                        id: newId,
                        style: categoryId,
                        description: ''
                    });
                }
            });
        }

        tactics = initialTacticsToSave;
        tactics.sort((a, b) => a.name.localeCompare(b.name));
        await GM_setValue(FORMATIONS_STORAGE_KEY, { tactics: tactics });
    }

    function generateCategoryId(name) {
        return sha256Hash(name.toLowerCase()).substring(0, 10);
    }

    function generateCategoryColor(name) {
        const hash = sha256Hash(name);
        const hue = parseInt(hash.substring(0, 6), 16) % 360;
        const saturation = 50 + (parseInt(hash.substring(6, 8), 16) % 30);
        const lightness = 55 + (parseInt(hash.substring(8, 10), 16) % 15);
        return `hsl(${hue}, ${saturation}%, ${lightness}%)`;
    }

    function addCategory(category) {
        categories[category.id] = category;
        saveCategories();
    }

    function saveCategories() {
        GM_setValue(CATEGORIES_STORAGE_KEY, categories);
    }

    function loadCategories() {
        const storedCategories = GM_getValue(CATEGORIES_STORAGE_KEY);
        if (storedCategories && typeof storedCategories === 'object') {
            categories = storedCategories;
            if (!categories.short_passing) {
                categories.short_passing = DEFAULT_CATEGORIES.short_passing;
            }
            if (!categories.wing_play) {
                categories.wing_play = DEFAULT_CATEGORIES.wing_play;
            }
        } else {
            categories = {
                ...DEFAULT_CATEGORIES
            };
            saveCategories();
        }
        if (!categories[OTHER_CATEGORY_ID]) {
            categories[OTHER_CATEGORY_ID] = {
                id: OTHER_CATEGORY_ID,
                name: 'Other',
                color: '#8395a7'
            };
        }
    }

    function loadCategoryColor(categoryId) {
        if (categories[categoryId]) return categories[categoryId].color;
        else if (categoryId === 'short_passing') return DEFAULT_CATEGORIES.short_passing.color;
        else if (categoryId === 'wing_play') return DEFAULT_CATEGORIES.wing_play.color;
        else if (categoryId === OTHER_CATEGORY_ID || !categoryId) return '#8395a7';
        else return '#8395a7';
    }

    function getCategoryName(categoryId) {
        if (categories[categoryId]) return categories[categoryId].name;
        else if (categoryId === 'short_passing') return 'Short Passing';
        else if (categoryId === 'wing_play') return 'Wing Play';
        else if (categoryId === OTHER_CATEGORY_ID || !categoryId) return 'Other';
        else return categoryId || 'Uncategorized';
    }

    async function removeCategory(categoryId, sourceModalElement = null) {
        if (!categoryId || categoryId === 'all' || categoryId === OTHER_CATEGORY_ID || DEFAULT_CATEGORIES[categoryId]) {
            console.error("Cannot remove this category:", categoryId);
            return false;
        }

        const categoryName = getCategoryName(categoryId);
        const confirmation = await showAlert({
            title: USERSCRIPT_STRINGS.confirmationTitle,
            text: USERSCRIPT_STRINGS.removeCategoryConfirmation.replace('{}', categoryName),
            showCancelButton: true,
            confirmButtonText: USERSCRIPT_STRINGS.removeCategoryButton,
            cancelButtonText: USERSCRIPT_STRINGS.cancelConfirmButton,
            type: 'error'
        });

        if (!confirmation.isConfirmed) return false;

        const data = await GM_getValue(FORMATIONS_STORAGE_KEY, { tactics: [] });
        let updated = false;
        data.tactics = data.tactics.map(t => {
            if (t.style === categoryId) {
                t.style = OTHER_CATEGORY_ID;
                updated = true;
            }
            return t;
        });
        tactics = tactics.map(t => {
            if (t.style === categoryId) t.style = OTHER_CATEGORY_ID;
            return t;
        });

        if (updated) await GM_setValue(FORMATIONS_STORAGE_KEY, data);

        delete categories[categoryId];
        saveCategories();

        if (currentFilter === categoryId) {
            currentFilter = 'all';
            GM_setValue(CATEGORY_FILTER_STORAGE_KEY, currentFilter);
        }

        updateTacticsDropdown();
        updateCategoryFilterDropdown();

        if (sourceModalElement) {
            const categoryItem = sourceModalElement.querySelector(`li[data-category-id="${categoryId}"]`);
            if (categoryItem) {
                categoryItem.style.transition = 'opacity 0.3s ease, transform 0.3s ease';
                categoryItem.style.opacity = '0';
                categoryItem.style.transform = 'translateX(-20px)';
                setTimeout(() => categoryItem.remove(), 300);
            }
        }

        await showSuccessMessage(USERSCRIPT_STRINGS.doneTitle, USERSCRIPT_STRINGS.removeCategoryAlert.replace('{}', categoryName));
        return true;
    }

    async function showManagementModal() {
        const modalContent = createManagementModalContent();
        await showAlert({
            title: USERSCRIPT_STRINGS.managementModalTitle,
            htmlContent: modalContent,
            confirmButtonText: USERSCRIPT_STRINGS.manageCategoriesDoneButton,
            showCancelButton: false,
            modalClass: 'management-modal'
        });
        updateCategoryFilterDropdown();
        updateTacticsDropdown();
    }

    function createManagementModalContent() {
        const wrapper = document.createElement('div');
        wrapper.className = 'management-modal-wrapper';

        const tabsConfig = [
            { id: 'formations', title: USERSCRIPT_STRINGS.formationsTabTitle, contentGenerator: createFormationsManagementTab },
            { id: 'categories', title: USERSCRIPT_STRINGS.categoriesTabTitle, contentGenerator: createCategoriesManagementTab }
        ];

        const tabsContainer = createModalTabs(tabsConfig, wrapper);
        wrapper.appendChild(tabsContainer);

        tabsConfig.forEach((tab, index) => {
            const contentDiv = document.createElement('div');
            contentDiv.className = 'management-modal-content';
            contentDiv.dataset.tabId = tab.id;
            if (index === 0) contentDiv.classList.add('active');
            tab.contentGenerator(contentDiv);
            wrapper.appendChild(contentDiv);
        });

        wrapper.addEventListener('click', handleManagementModalClick);
        wrapper.addEventListener('change', handleManagementModalChange);
        wrapper.addEventListener('keydown', handleManagementModalKeydown);

        return wrapper;
    }

    function createFormationsManagementTab(container) {
        container.innerHTML = '';
        const list = document.createElement('ul');
        list.className = 'formation-management-list';

        const sortedTactics = [...tactics].sort((a, b) => a.name.localeCompare(b.name));

        if (sortedTactics.length === 0) {
            const message = document.createElement('p');
            message.textContent = 'No formations saved yet.';
            message.className = 'no-items-message';
            list.appendChild(message);
        } else {
            sortedTactics.forEach(tactic => {
                list.appendChild(createFormationManagementItem(tactic));
            });
        }
        container.appendChild(list);
    }

    function createFormationManagementItem(tactic) {
        const listItem = document.createElement('li');
        listItem.dataset.tacticId = tactic.id;

        const nameContainer = document.createElement('div');
        nameContainer.className = 'item-name-container';
        const nameSpan = document.createElement('span');
        nameSpan.className = 'item-name';
        nameSpan.textContent = tactic.name;
        nameContainer.appendChild(nameSpan);

        const controlsContainer = document.createElement('div');
        controlsContainer.className = 'item-controls';

        const categorySelect = document.createElement('select');
        categorySelect.className = 'item-category-select';
        populateCategorySelect(categorySelect, tactic.style);

        const editBtn = document.createElement('button');
        editBtn.className = 'item-action-btn edit-name-btn';
        editBtn.innerHTML = '✏️';
        editBtn.title = 'Edit name & description';

        const deleteBtn = document.createElement('button');
        deleteBtn.className = 'item-action-btn delete-item-btn';
        deleteBtn.innerHTML = '🗑️';
        deleteBtn.title = 'Delete formation';

        appendChildren(controlsContainer, [categorySelect, editBtn, deleteBtn]);
        appendChildren(listItem, [nameContainer, controlsContainer]);

        return listItem;
    }

    function populateCategorySelect(selectElement, currentCategoryId) {
        selectElement.innerHTML = '';
        const availableCategories = Object.values(categories)
        .sort((a, b) => {
            if (a.id === OTHER_CATEGORY_ID) return 1;
            if (b.id === OTHER_CATEGORY_ID) return -1;
            return a.name.localeCompare(b.name);
        });

        availableCategories.forEach(cat => {
            const option = document.createElement('option');
            option.value = cat.id;
            option.textContent = cat.name;
            if (cat.id === (currentCategoryId || OTHER_CATEGORY_ID)) {
                option.selected = true;
            }
            selectElement.appendChild(option);
        });
    }

    function createCategoriesManagementTab(container) {
        container.innerHTML = '';

        const addCategorySection = document.createElement('div');
        addCategorySection.className = 'add-category-section';
        const newCategoryInput = document.createElement('input');
        newCategoryInput.type = 'text';
        newCategoryInput.placeholder = USERSCRIPT_STRINGS.addCategoryPlaceholder;
        newCategoryInput.className = 'add-category-input';
        const addCategoryBtn = document.createElement('button');
        addCategoryBtn.className = 'mz-modal-btn add-category-btn';
        addCategoryBtn.textContent = USERSCRIPT_STRINGS.addCategoryButton;
        appendChildren(addCategorySection, [newCategoryInput, addCategoryBtn]);
        container.appendChild(addCategorySection);

        const list = document.createElement('ul');
        list.className = 'category-management-list';

        const customCategories = Object.values(categories)
        .filter(cat => cat.id !== OTHER_CATEGORY_ID && !DEFAULT_CATEGORIES[cat.id])
        .sort((a, b) => a.name.localeCompare(b.name));

        const noCatMsg = document.createElement('p');
        noCatMsg.textContent = USERSCRIPT_STRINGS.noCustomCategories;
        noCatMsg.className = 'no-custom-categories-message';
        noCatMsg.style.display = customCategories.length === 0 ? 'block' : 'none';
        list.appendChild(noCatMsg);

        customCategories.forEach(cat => {
            list.appendChild(createCategoryManagementItem(cat));
        });

        container.appendChild(list);
    }

    function createCategoryManagementItem(category) {
        const listItem = document.createElement('li');
        listItem.dataset.categoryId = category.id;

        const nameSpan = document.createElement('span');
        nameSpan.textContent = category.name;
        nameSpan.style.flexGrow = '1';
        nameSpan.style.marginRight = '10px';

        const removeBtn = document.createElement('button');
        removeBtn.textContent = 'Remove';
        removeBtn.className = 'mz-modal-btn category-remove-btn';
        removeBtn.title = `Remove category "${category.name}"`;

        listItem.appendChild(nameSpan);
        listItem.appendChild(removeBtn);
        return listItem;
    }

    function handleManagementModalClick(event) {
        const target = event.target;
        const listItem = target.closest('li');

        if (target.classList.contains('edit-name-btn') && listItem) {
            handleEditFormationInModal(listItem);
        } else if (target.classList.contains('delete-item-btn') && listItem) {
            handleDeleteFormationInModal(listItem);
        } else if (target.classList.contains('add-category-btn')) {
            handleAddNewCategoryInModal(target.closest('.add-category-section'));
        } else if (target.classList.contains('category-remove-btn') && listItem) {
            handleDeleteCategoryInModal(listItem);
        }
    }

    function handleManagementModalChange(event) {
        const target = event.target;
        if (target.classList.contains('item-category-select')) {
            const listItem = target.closest('li');
            const tacticId = listItem?.dataset.tacticId;
            const newCategoryId = target.value;
            if (tacticId && newCategoryId) {
                updateFormationCategory(tacticId, newCategoryId);
            }
        }
    }

    function handleManagementModalKeydown(event) {
        if (event.key === 'Enter' && !event.shiftKey) {
            const target = event.target;
            if (target.classList.contains('add-category-input')) {
                handleAddNewCategoryInModal(target.closest('.add-category-section'));
                event.preventDefault();
            }
        }
    }

    async function handleEditFormationInModal(listItem) {
        const tacticId = listItem.dataset.tacticId;
        const tactic = tactics.find(t => t.id === tacticId);
        if (!tactic) return;

        await editTactic(tactic.id, listItem);
    }

    async function handleDeleteFormationInModal(listItem) {
        const tacticId = listItem.dataset.tacticId;
        const tactic = tactics.find(t => t.id === tacticId);
        if (!tactic) return;

        const confirmation = await showAlert({
            title: USERSCRIPT_STRINGS.confirmationTitle,
            text: USERSCRIPT_STRINGS.deleteConfirmation.replace('{}', tactic.name),
            showCancelButton: true,
            confirmButtonText: USERSCRIPT_STRINGS.deleteTacticConfirmButton,
            cancelButtonText: USERSCRIPT_STRINGS.cancelConfirmButton,
            type: 'error'
        });

        if (!confirmation.isConfirmed) return;

        const deletedCategoryId = tactic.style;
        const data = await GM_getValue(FORMATIONS_STORAGE_KEY) || { tactics: [] };
        data.tactics = data.tactics.filter(t => t.id !== tacticId);
        await GM_setValue(FORMATIONS_STORAGE_KEY, data);
        tactics = tactics.filter(t => t.id !== tacticId);

        listItem.style.transition = 'opacity 0.3s ease, transform 0.3s ease';
        listItem.style.opacity = '0';
        listItem.style.transform = 'translateX(-20px)';
        setTimeout(() => {
            listItem.remove();
            const list = document.querySelector('.formation-management-list');
            if (list && !list.querySelector('li')) {
                const message = document.createElement('p');
                message.textContent = 'No formations saved yet.';
                message.className = 'no-items-message';
                list.appendChild(message);
            }
        }, 300);

        const categoryStillUsed = tactics.some(t => t.style === deletedCategoryId);
        if (!categoryStillUsed && deletedCategoryId && !DEFAULT_CATEGORIES[deletedCategoryId] && deletedCategoryId !== OTHER_CATEGORY_ID) {
            delete categories[deletedCategoryId];
            saveCategories();
            if (currentFilter === deletedCategoryId) {
                currentFilter = 'all';
                GM_setValue(CATEGORY_FILTER_STORAGE_KEY, currentFilter);
            }
            const catTab = document.querySelector('.management-modal-content[data-tab-id="categories"]');
            if (catTab) createCategoriesManagementTab(catTab);
        }

        updateTacticsDropdown();
        updateCategoryFilterDropdown();
    }

    async function updateFormationCategory(tacticId, newCategoryId) {
        const tacticIndex = tactics.findIndex(t => t.id === tacticId);
        if (tacticIndex === -1) return;

        const originalCategoryId = tactics[tacticIndex].style;
        if (originalCategoryId === newCategoryId) return;

        tactics[tacticIndex].style = newCategoryId;
        const data = await GM_getValue(FORMATIONS_STORAGE_KEY, { tactics: [] });
        const dataIndex = data.tactics.findIndex(t => t.id === tacticId);
        if (dataIndex !== -1) {
            data.tactics[dataIndex].style = newCategoryId;
            await GM_setValue(FORMATIONS_STORAGE_KEY, data);

            const originalCategoryStillUsed = tactics.some(t => t.style === originalCategoryId);
            if (!originalCategoryStillUsed && originalCategoryId && !DEFAULT_CATEGORIES[originalCategoryId] && originalCategoryId !== OTHER_CATEGORY_ID) {
                delete categories[originalCategoryId];
                saveCategories();
                if (currentFilter === originalCategoryId) {
                    currentFilter = 'all';
                    GM_setValue(CATEGORY_FILTER_STORAGE_KEY, currentFilter);
                }
                const catTab = document.querySelector('.management-modal-content[data-tab-id="categories"]');
                if (catTab) createCategoriesManagementTab(catTab);
            }

            updateTacticsDropdown();
            updateCategoryFilterDropdown();
        } else {
            showErrorMessage(USERSCRIPT_STRINGS.errorTitle, "Failed to update category in storage.");
            tactics[tacticIndex].style = originalCategoryId;
            const selectElement = document.querySelector(`li[data-tactic-id="${tacticId}"] .item-category-select`);
            if (selectElement) selectElement.value = originalCategoryId || OTHER_CATEGORY_ID;
        }
    }

    async function handleAddNewCategoryInModal(addSection) {
        const input = addSection.querySelector('.add-category-input');
        const list = addSection.nextElementSibling;
        if (!input || !list) return;

        const name = input.value.trim();
        if (!name) {
            showErrorMessage(USERSCRIPT_STRINGS.errorTitle, USERSCRIPT_STRINGS.noTacticNameProvidedError.replace("name", "category name"));
            input.focus();
            return;
        }
        if (name.length > MAX_CATEGORY_NAME_LENGTH) {
            showErrorMessage(USERSCRIPT_STRINGS.errorTitle, USERSCRIPT_STRINGS.categoryNameMaxLengthError);
            input.focus();
            return;
        }
        const existingCategory = Object.values(categories).find(cat => cat.name.toLowerCase() === name.toLowerCase());
        if (existingCategory) {
            showErrorMessage(USERSCRIPT_STRINGS.errorTitle, "Category name already exists.");
            input.focus();
            return;
        }

        const newCategoryId = generateCategoryId(name);
        const newCategory = {
            id: newCategoryId,
            name: name,
            color: generateCategoryColor(name)
        };

        addCategory(newCategory);
        input.value = '';

        const noCatMsg = list.querySelector('.no-custom-categories-message');
        if (noCatMsg) noCatMsg.style.display = 'none';

        const newItem = createCategoryManagementItem(newCategory);
        list.appendChild(newItem);
        newItem.style.opacity = '0';
        newItem.style.transform = 'translateY(-10px)';
        setTimeout(() => {
            newItem.style.transition = 'opacity 0.3s ease, transform 0.3s ease';
            newItem.style.opacity = '1';
            newItem.style.transform = 'translateY(0)';
        }, 10);

        updateCategoryFilterDropdown();
        document.querySelectorAll('.item-category-select').forEach(select => {
            const currentTacticId = select.closest('li')?.dataset.tacticId;
            const currentTactic = tactics.find(t => t.id === currentTacticId);
            populateCategorySelect(select, currentTactic?.style);
        });
    }

    async function handleDeleteCategoryInModal(listItem) {
        const categoryId = listItem.dataset.categoryId;
        const categoryName = getCategoryName(categoryId);
        if (!categoryId || !categoryName) return;

        const success = await removeCategory(categoryId, listItem.closest('.management-modal-content'));
        if (success) {
            document.querySelectorAll('.item-category-select').forEach(select => {
                const currentTacticId = select.closest('li')?.dataset.tacticId;
                const currentTactic = tactics.find(t => t.id === currentTacticId);
                populateCategorySelect(select, currentTactic?.style);
            });
            const formationsTab = document.querySelector('.management-modal-content[data-tab-id="formations"]');
            if (formationsTab) createFormationsManagementTab(formationsTab);
        }
    }

    async function addNewTactic() {
        const outfieldPlayers = Array.from(document.querySelectorAll(OUTFIELD_PLAYERS_SELECTOR));
        const coordinates = outfieldPlayers.map(p => [parseInt(p.style.left), parseInt(p.style.top)]);
        if (!validateTacticPlayerCount(outfieldPlayers)) return;
        const id = generateUniqueId(coordinates);
        const duplicateName = await validateDuplicateTactic(id);
        if (duplicateName) {
            await showErrorMessage(USERSCRIPT_STRINGS.errorTitle, USERSCRIPT_STRINGS.duplicateTacticErrorWithName.replace('{}', duplicateName));
            return;
        }
        const result = await showAlert({
            title: USERSCRIPT_STRINGS.tacticNamePrompt,
            input: 'text',
            inputValue: '',
            placeholder: USERSCRIPT_STRINGS.tacticNamePlaceholder,
            inputValidator: (v) => {
                if (!v) return USERSCRIPT_STRINGS.noTacticNameProvidedError;
                if (v.length > MAX_TACTIC_NAME_LENGTH) return USERSCRIPT_STRINGS.tacticNameMaxLengthError;
                if (tactics.some(t => t.name === v)) return USERSCRIPT_STRINGS.alreadyExistingTacticNameError;
                return null;
            },
            descriptionInput: 'textarea',
            descriptionValue: '',
            descriptionPlaceholder: USERSCRIPT_STRINGS.descriptionPlaceholder,
            descriptionValidator: (d) => {
                if (d && d.length > MAX_DESCRIPTION_LENGTH) return USERSCRIPT_STRINGS.descriptionMaxLengthError;
                return null;
            },
            showCategorySelector: true,
            showCancelButton: true,
            confirmButtonText: USERSCRIPT_STRINGS.saveButton,
            cancelButtonText: USERSCRIPT_STRINGS.cancelConfirmButton
        });
        if (!result.isConfirmed || !result.value) return;
        const name = result.value;
        const description = result.description || '';
        const categoryId = result.category.id;
        const tactic = {
            name: name,
            description: description,
            coordinates: coordinates,
            id: id,
            style: categoryId
        };
        await saveTacticToStorage(tactic);
        tactics.push(tactic);
        tactics.sort((a, b) => a.name.localeCompare(b.name));
        updateTacticsDropdown(id);
        updateCategoryFilterDropdown();
        handleTacticSelection(tactic.id);
        await showSuccessMessage(USERSCRIPT_STRINGS.doneTitle, USERSCRIPT_STRINGS.addAlert.replace('{}', tactic.name));
    }

    async function addNewTacticWithXml() {
        const xmlResult = await showAlert({
            title: USERSCRIPT_STRINGS.xmlPlaceholder,
            input: 'text',
            inputValue: '',
            placeholder: USERSCRIPT_STRINGS.xmlPlaceholder,
            showCancelButton: true,
            confirmButtonText: USERSCRIPT_STRINGS.addConfirmButton,
            cancelButtonText: USERSCRIPT_STRINGS.cancelConfirmButton
        });

        if (!xmlResult.isConfirmed) return;
        const xml = xmlResult.value;

        if (!xml) {
            await showErrorMessage(USERSCRIPT_STRINGS.errorTitle, USERSCRIPT_STRINGS.xmlRequiredError);
            return;
        }
        if (!xml.trim().startsWith('<') || !xml.trim().endsWith('>')) {
            await showErrorMessage(USERSCRIPT_STRINGS.errorTitle, USERSCRIPT_STRINGS.invalidXmlFormatError);
            return;
        }

        const nameResult = await showAlert({
            title: USERSCRIPT_STRINGS.tacticNamePrompt,
            input: 'text',
            inputValue: '',
            placeholder: USERSCRIPT_STRINGS.tacticNamePlaceholder,
            inputValidator: (v) => {
                if (!v) return USERSCRIPT_STRINGS.noTacticNameProvidedError;
                if (v.length > MAX_TACTIC_NAME_LENGTH) return USERSCRIPT_STRINGS.tacticNameMaxLengthError;
                if (tactics.some(t => t.name === v)) return USERSCRIPT_STRINGS.alreadyExistingTacticNameError;
                return null;
            },
            descriptionInput: 'textarea',
            descriptionValue: '',
            descriptionPlaceholder: USERSCRIPT_STRINGS.descriptionPlaceholder,
            descriptionValidator: (d) => {
                if (d && d.length > MAX_DESCRIPTION_LENGTH) return USERSCRIPT_STRINGS.descriptionMaxLengthError;
                return null;
            },
            showCategorySelector: true,
            showCancelButton: true,
            confirmButtonText: USERSCRIPT_STRINGS.saveButton,
            cancelButtonText: USERSCRIPT_STRINGS.cancelConfirmButton
        });
        if (!nameResult.isConfirmed || !nameResult.value) return;
        const name = nameResult.value;
        const description = nameResult.description || '';
        const categoryId = nameResult.category.id;
        try {
            const newTactic = await convertXmlToSimpleFormationJson(xml, name);
            const id = generateUniqueId(newTactic.coordinates);
            const duplicateName = await validateDuplicateTactic(id);
            if (duplicateName) {
                await showErrorMessage(USERSCRIPT_STRINGS.errorTitle, USERSCRIPT_STRINGS.duplicateTacticErrorWithName.replace('{}', duplicateName));
                return;
            }
            newTactic.id = id;
            newTactic.style = categoryId;
            newTactic.description = description;
            await saveTacticToStorage(newTactic);
            tactics.push(newTactic);
            tactics.sort((a, b) => a.name.localeCompare(b.name));
            updateTacticsDropdown(id);
            updateCategoryFilterDropdown();
            handleTacticSelection(newTactic.id);
            await showSuccessMessage(USERSCRIPT_STRINGS.doneTitle, USERSCRIPT_STRINGS.addAlert.replace('{}', newTactic.name));
        } catch (error) {
            console.error('XMLError:', error);
            await showErrorMessage(USERSCRIPT_STRINGS.errorTitle, USERSCRIPT_STRINGS.xmlParsingError + (error.message ? `: ${error.message}` : ''));
        }
    }

    async function deleteTactic() {
        const selectedTactic = tactics.find(t => t.id === selectedFormationTacticId);
        if (!selectedTactic) {
            await showErrorMessage(USERSCRIPT_STRINGS.errorTitle, USERSCRIPT_STRINGS.noTacticSelectedError);
            return;
        }
        const confirmation = await showAlert({
            title: USERSCRIPT_STRINGS.confirmationTitle,
            text: USERSCRIPT_STRINGS.deleteConfirmation.replace('{}', selectedTactic.name),
            showCancelButton: true,
            confirmButtonText: USERSCRIPT_STRINGS.deleteTacticConfirmButton,
            cancelButtonText: USERSCRIPT_STRINGS.cancelConfirmButton
        });
        if (!confirmation.isConfirmed) return;
        const deletedCategoryId = selectedTactic.style;
        const data = await GM_getValue(FORMATIONS_STORAGE_KEY) || {
            tactics: []
        };
        data.tactics = data.tactics.filter(t => t.id !== selectedTactic.id);
        await GM_setValue(FORMATIONS_STORAGE_KEY, data);
        tactics = tactics.filter(t => t.id !== selectedTactic.id);
        selectedFormationTacticId = null;
        const categoryStillUsed = tactics.some(t => t.style === deletedCategoryId);
        if (!categoryStillUsed && deletedCategoryId && !DEFAULT_CATEGORIES[deletedCategoryId] && deletedCategoryId !== OTHER_CATEGORY_ID) {
            delete categories[deletedCategoryId];
            saveCategories();
            if (currentFilter === deletedCategoryId) {
                currentFilter = 'all';
                GM_setValue(CATEGORY_FILTER_STORAGE_KEY, currentFilter);
            }
        }
        updateTacticsDropdown();
        updateCategoryFilterDropdown();
        await showSuccessMessage(USERSCRIPT_STRINGS.doneTitle, USERSCRIPT_STRINGS.deleteAlert.replace('{}', selectedTactic.name));
    }

    async function editTactic(tacticIdToEdit = null, sourceListItem = null) {
        const idToUse = tacticIdToEdit || selectedFormationTacticId;
        const selectedTactic = tactics.find(t => t.id === idToUse);

        if (!selectedTactic) {
            await showErrorMessage(USERSCRIPT_STRINGS.errorTitle, USERSCRIPT_STRINGS.noTacticSelectedError);
            return;
        }

        const originalName = selectedTactic.name;
        const originalCategory = selectedTactic.style;
        const originalDescription = selectedTactic.description || '';

        const result = await showAlert({
            title: 'Edit Formation',
            input: 'text',
            inputValue: originalName,
            placeholder: USERSCRIPT_STRINGS.tacticNamePlaceholder,
            inputValidator: (v) => {
                if (!v) return USERSCRIPT_STRINGS.noTacticNameProvidedError;
                if (v.length > MAX_TACTIC_NAME_LENGTH) return USERSCRIPT_STRINGS.tacticNameMaxLengthError;
                if (v !== originalName && tactics.some(t => t.name === v)) return USERSCRIPT_STRINGS.alreadyExistingTacticNameError;
                return null;
            },
            descriptionInput: 'textarea',
            descriptionValue: originalDescription,
            descriptionPlaceholder: USERSCRIPT_STRINGS.descriptionPlaceholder,
            descriptionValidator: (d) => {
                if (d && d.length > MAX_DESCRIPTION_LENGTH) return USERSCRIPT_STRINGS.descriptionMaxLengthError;
                return null;
            },
            showCategorySelector: true,
            currentCategory: selectedTactic.style,
            showCancelButton: true,
            confirmButtonText: USERSCRIPT_STRINGS.saveButton,
            cancelButtonText: USERSCRIPT_STRINGS.cancelConfirmButton
        });

        if (!result.isConfirmed) return;

        const newName = result.value || originalName;
        const newDescription = result.description || '';
        const newCategory = result.category?.id || originalCategory;

        if (newName === originalName && newCategory === originalCategory && newDescription === originalDescription) {
            return;
        }

        const categoryChanged = originalCategory !== newCategory;
        const data = await GM_getValue(FORMATIONS_STORAGE_KEY) || {
            tactics: []
        };

        let updatedInStorage = false;
        data.tactics = data.tactics.map(t => {
            if (t.id === selectedTactic.id) {
                t.name = newName;
                t.style = newCategory;
                t.description = newDescription;
                updatedInStorage = true;
            }
            return t;
        });

        if (!updatedInStorage) {
            console.error("Failed to find tactic in storage for update.", selectedTactic.id);
            await showErrorMessage(USERSCRIPT_STRINGS.errorTitle, "Failed to update tactic in storage.");
            return;
        }

        await GM_setValue(FORMATIONS_STORAGE_KEY, data);

        const tacticIndex = tactics.findIndex(t => t.id === selectedTactic.id);
        if (tacticIndex !== -1) {
            tactics[tacticIndex].name = newName;
            tactics[tacticIndex].style = newCategory;
            tactics[tacticIndex].description = newDescription;
        } else {
            console.error("Failed to find tactic in memory for update.", selectedTactic.id);
            await showErrorMessage(USERSCRIPT_STRINGS.errorTitle, "Internal error updating tactic data.");
            await initializeUsData();
            updateTacticsDropdown();
            updateCategoryFilterDropdown();
            return;
        }

        if (categoryChanged) {
            const originalCategoryStillUsed = tactics.some(t => t.style === originalCategory);
            if (!originalCategoryStillUsed && originalCategory && !DEFAULT_CATEGORIES[originalCategory] && originalCategory !== OTHER_CATEGORY_ID) {
                delete categories[originalCategory];
                saveCategories();
                if (currentFilter === originalCategory) {
                    currentFilter = 'all';
                    GM_setValue(CATEGORY_FILTER_STORAGE_KEY, currentFilter);
                }
            }
        }

        tactics.sort((a, b) => a.name.localeCompare(b.name));
        updateTacticsDropdown(selectedTactic.id);
        updateCategoryFilterDropdown();

        if (sourceListItem) {
            const nameSpan = sourceListItem.querySelector('.item-name');
            if (nameSpan) nameSpan.textContent = newName;
            const categorySelect = sourceListItem.querySelector('.item-category-select');
            if (categorySelect) categorySelect.value = newCategory;
        }

        await showSuccessMessage(USERSCRIPT_STRINGS.doneTitle, USERSCRIPT_STRINGS.renameAlert.replace('{}', newName));
    }

    async function updateTactic() {
        const outfieldPlayers = Array.from(document.querySelectorAll(OUTFIELD_PLAYERS_SELECTOR));
        const selectedTactic = tactics.find(t => t.id === selectedFormationTacticId);
        if (!selectedTactic) {
            await showErrorMessage(USERSCRIPT_STRINGS.errorTitle, USERSCRIPT_STRINGS.noTacticSelectedError);
            return;
        }
        if (!validateTacticPlayerCount(outfieldPlayers)) return;
        const updatedCoordinates = outfieldPlayers.map(p => [parseInt(p.style.left), parseInt(p.style.top)]);
        const newId = generateUniqueId(updatedCoordinates);
        const data = await GM_getValue(FORMATIONS_STORAGE_KEY) || {
            tactics: []
        };
        const validationResult = await validateDuplicateTacticWithUpdatedCoord(newId, selectedTactic, data);
        if (validationResult.status === 'unchanged') {
            await showErrorMessage(USERSCRIPT_STRINGS.errorTitle, USERSCRIPT_STRINGS.noChangesMadeError);
            return;
        } else if (validationResult.status === 'duplicate') {
            await showErrorMessage(USERSCRIPT_STRINGS.errorTitle, USERSCRIPT_STRINGS.duplicateTacticErrorWithName.replace('{}', validationResult.name));
            return;
        }
        const confirmation = await showAlert({
            title: USERSCRIPT_STRINGS.confirmationTitle,
            text: USERSCRIPT_STRINGS.updateConfirmation.replace('{}', selectedTactic.name),
            showCancelButton: true,
            confirmButtonText: USERSCRIPT_STRINGS.updateConfirmButton,
            cancelButtonText: USERSCRIPT_STRINGS.cancelConfirmButton
        });
        if (!confirmation.isConfirmed) return;
        for (const tactic of data.tactics) {
            if (tactic.id === selectedTactic.id) {
                tactic.coordinates = updatedCoordinates;
                tactic.id = newId;
            }
        }
        const memoryTactic = tactics.find(t => t.id === selectedTactic.id);
        if (memoryTactic) {
            memoryTactic.coordinates = updatedCoordinates;
            memoryTactic.id = newId;
        }
        await GM_setValue(FORMATIONS_STORAGE_KEY, data);
        selectedFormationTacticId = newId;
        updateTacticsDropdown(newId);
        await showSuccessMessage(USERSCRIPT_STRINGS.doneTitle, USERSCRIPT_STRINGS.updateAlert.replace('{}', selectedTactic.name));
    }

    async function clearTactics() {
        const confirmation = await showAlert({
            title: USERSCRIPT_STRINGS.confirmationTitle,
            text: USERSCRIPT_STRINGS.clearConfirmation,
            showCancelButton: true,
            confirmButtonText: USERSCRIPT_STRINGS.clearTacticsConfirmButton,
            cancelButtonText: USERSCRIPT_STRINGS.cancelConfirmButton,
            type: 'error'
        });
        if (!confirmation.isConfirmed) return;

        await GM_deleteValue(FORMATIONS_STORAGE_KEY);
        await GM_deleteValue(OLD_FORMATIONS_STORAGE_KEY);
        await GM_deleteValue(CATEGORIES_STORAGE_KEY);
        await GM_deleteValue(CATEGORY_FILTER_STORAGE_KEY);

        tactics = [];
        selectedFormationTacticId = null;
        currentFilter = 'all';

        loadCategories();
        updateTacticsDropdown();
        updateCategoryFilterDropdown();
        await showSuccessMessage(USERSCRIPT_STRINGS.doneTitle, USERSCRIPT_STRINGS.clearAlert);
    }

    async function resetTactics() {
        const confirmation = await showAlert({
            title: USERSCRIPT_STRINGS.confirmationTitle,
            text: USERSCRIPT_STRINGS.resetConfirmation,
            showCancelButton: true,
            confirmButtonText: USERSCRIPT_STRINGS.resetTacticsConfirmButton,
            cancelButtonText: USERSCRIPT_STRINGS.cancelConfirmButton,
            type: 'error'
        });
        if (!confirmation.isConfirmed) return;

        await GM_deleteValue(FORMATIONS_STORAGE_KEY);
        await GM_deleteValue(OLD_FORMATIONS_STORAGE_KEY);
        await GM_deleteValue(CATEGORIES_STORAGE_KEY);
        await GM_deleteValue(CATEGORY_FILTER_STORAGE_KEY);

        tactics = [];
        selectedFormationTacticId = null;
        currentFilter = 'all';

        loadCategories();
        await loadInitialTacticsAndCategories();

        updateTacticsDropdown();
        updateCategoryFilterDropdown();
        await showSuccessMessage(USERSCRIPT_STRINGS.doneTitle, USERSCRIPT_STRINGS.resetAlert);
    }

    async function importTacticsJsonData() {
        try {
            const result = await showAlert({
                title: 'Import Formations (JSON)',
                input: 'text',
                inputValue: '',
                placeholder: 'Paste Formations JSON here',
                showCancelButton: true,
                confirmButtonText: USERSCRIPT_STRINGS.importButton,
                cancelButtonText: USERSCRIPT_STRINGS.cancelConfirmButton
            });
            if (!result.isConfirmed || !result.value) return;
            let importedData;
            try {
                importedData = JSON.parse(result.value);
            } catch (e) {
                await showErrorMessage(USERSCRIPT_STRINGS.errorTitle, USERSCRIPT_STRINGS.invalidImportError);
                return;
            }
            if (!importedData || !Array.isArray(importedData.tactics) || !importedData.tactics.every(t => t.name && t.id && Array.isArray(t.coordinates))) {
                await showErrorMessage(USERSCRIPT_STRINGS.errorTitle, USERSCRIPT_STRINGS.invalidImportError);
                return;
            }
            const importedTactics = importedData.tactics;
            importedTactics.forEach(t => {
                if (!t.hasOwnProperty('style')) t.style = OTHER_CATEGORY_ID;
                if (!t.hasOwnProperty('description')) t.description = '';
                if (t.style && !categories[t.style] && !DEFAULT_CATEGORIES[t.style] && t.style !== OTHER_CATEGORY_ID) {
                    addCategory({
                        id: t.style,
                        name: t.style,
                        color: generateCategoryColor(t.style)
                    });
                }
            });
            let existingData = await GM_getValue(FORMATIONS_STORAGE_KEY, {
                tactics: []
            });
            let existingTactics = existingData.tactics || [];
            const mergedTactics = [...existingTactics];
            let addedCount = 0;
            for (const impTactic of importedTactics) {
                if (!existingTactics.some(t => t.id === impTactic.id)) {
                    mergedTactics.push(impTactic);
                    addedCount++;
                } else {
                    const existingIndex = mergedTactics.findIndex(t => t.id === impTactic.id);
                    if (existingIndex !== -1) {
                        mergedTactics[existingIndex] = { ...mergedTactics[existingIndex], ...impTactic };
                    }
                }
            }
            await GM_setValue(FORMATIONS_STORAGE_KEY, {
                tactics: mergedTactics
            });
            mergedTactics.sort((a, b) => a.name.localeCompare(b.name));
            tactics = mergedTactics;
            updateTacticsDropdown();
            updateCategoryFilterDropdown();
            await showSuccessMessage(USERSCRIPT_STRINGS.doneTitle, USERSCRIPT_STRINGS.importAlert + (addedCount > 0 ? ` (${addedCount} new items added)` : ''));
        } catch (error) {
            console.error('ImportError:', error);
            await showErrorMessage(USERSCRIPT_STRINGS.errorTitle, USERSCRIPT_STRINGS.invalidImportError + (error.message ? `: ${error.message}` : ''));
        }
    }

    async function exportTacticsJsonData() {
        try {
            const data = GM_getValue(FORMATIONS_STORAGE_KEY, {
                tactics: []
            });
            const jsonString = JSON.stringify(data, null, 2);
            if (navigator.clipboard?.writeText) {
                try {
                    await navigator.clipboard.writeText(jsonString);
                    await showSuccessMessage(USERSCRIPT_STRINGS.doneTitle, USERSCRIPT_STRINGS.exportAlert);
                    return;
                } catch (clipError) {
                    console.warn('Clipboard write failed, fallback.', clipError);
                }
            }
            const textArea = document.createElement('textarea');
            textArea.value = jsonString;
            textArea.style.width = '100%';
            textArea.style.minHeight = '150px';
            textArea.style.marginTop = '10px';
            textArea.style.backgroundColor = 'rgba(0,0,0,0.2)';
            textArea.style.color = 'var(--text-color)';
            textArea.style.border = '1px solid rgba(255,255,255,0.1)';
            textArea.style.borderRadius = '4px';
            textArea.readOnly = true;
            const container = document.createElement('div');
            container.appendChild(document.createTextNode('Copy the JSON data:'));
            container.appendChild(textArea);
            await showAlert({
                title: 'Export Formations (JSON)',
                htmlContent: container,
                confirmButtonText: 'Done'
            });
            textArea.select();
            textArea.setSelectionRange(0, 99999);
        } catch (error) {
            console.error('Export error:', error);
            await showErrorMessage(USERSCRIPT_STRINGS.errorTitle, 'Failed to export formations.');
        }
    }

    async function convertXmlToSimpleFormationJson(xmlString, tacticName) {
        const parser = new DOMParser();
        const xmlDoc = parser.parseFromString(xmlString, 'text/xml');
        const parseErrors = xmlDoc.getElementsByTagName('parsererror');
        if (parseErrors.length > 0) throw new Error(USERSCRIPT_STRINGS.xmlValidationError);
        const positionElements = Array.from(xmlDoc.getElementsByTagName('Pos')).filter(el => el.getAttribute('pos') === 'normal');
        if (positionElements.length !== MIN_PLAYERS_ON_PITCH - 1) throw new Error(`XML must contain exactly ${MIN_PLAYERS_ON_PITCH - 1} outfield players. Found ${positionElements.length}.`);
        const coordinates = positionElements.map(el => {
            const x = parseInt(el.getAttribute('x'));
            const y = parseInt(el.getAttribute('y'));
            if (isNaN(x) || isNaN(y)) throw new Error('Invalid coordinates found in XML.');
            return [x - 7, y - 9];
        });
        return {
            name: tacticName,
            coordinates: coordinates
        };
    }

    function getAttr(element, attributeName, defaultValue = null) {
        return element ? element.getAttribute(attributeName) || defaultValue : defaultValue;
    }

    function parseCompleteTacticXml(xmlString) {
        const parser = new DOMParser();
        const xmlDoc = parser.parseFromString(xmlString, "text/xml");
        if (xmlDoc.getElementsByTagName("parsererror").length > 0) throw new Error("XML parsing error");
        const soccerTactics = xmlDoc.querySelector("SoccerTactics");
        if (!soccerTactics) throw new Error("Missing <SoccerTactics>");
        const teamElement = soccerTactics.querySelector("Team");
        const posElements = Array.from(soccerTactics.querySelectorAll("Pos"));
        const subElements = Array.from(soccerTactics.querySelectorAll("Sub"));
        const ruleElements = Array.from(soccerTactics.querySelectorAll("TacticRule"));
        const data = {
            players: {},
            substitutes: {},
            teamSettings: {},
            tacticRules: [],
            originalPlayerIDs: new Set(),
            description: ''
        };
        data.teamSettings = {
            passingStyle: getAttr(teamElement, 'tactics', 'shortpass'),
            mentality: getAttr(teamElement, 'playstyle', 'normal'),
            aggression: getAttr(teamElement, 'aggression', 'normal'),
            captainPID: getAttr(teamElement, 'captain', '0')
        };
        if (data.teamSettings.captainPID !== '0') data.originalPlayerIDs.add(data.teamSettings.captainPID);
        posElements.forEach(el => {
            const pid = getAttr(el, 'pid');
            if (!pid) return;
            data.originalPlayerIDs.add(pid);
            const x = parseInt(getAttr(el, 'x', 0));
            const y = parseInt(getAttr(el, 'y', 0));
            data.players[pid] = {
                pos: getAttr(el, 'pos'),
                pt: getAttr(el, 'pt'),
                fk: getAttr(el, 'fk'),
                initial: {
                    x,
                    y
                },
                alt1: {
                    x: parseInt(getAttr(el, 'x1', x)),
                    y: parseInt(getAttr(el, 'y1', y))
                },
                alt2: {
                    x: parseInt(getAttr(el, 'x2', x)),
                    y: parseInt(getAttr(el, 'y2', y))
                },
            };
        });
        subElements.forEach(el => {
            const pid = getAttr(el, 'pid');
            if (pid) {
                data.originalPlayerIDs.add(pid);
                data.substitutes[pid] = {
                    pid: pid,
                    pos: getAttr(el, 'pos'),
                    pt: getAttr(el, 'pt'),
                    fk: getAttr(el, 'fk'),
                    x: parseInt(getAttr(el, 'x', 0)),
                    y: parseInt(getAttr(el, 'y', 0)),
                };
            }
        });
        ruleElements.forEach(el => {
            const rule = {};
            for (const attr of el.attributes) {
                rule[attr.name] = attr.value;
                if (attr.name === 'out_player' && attr.value !== 'no_change' && attr.value !== '0') data.originalPlayerIDs.add(attr.value);
                if (attr.name === 'in_player_id' && attr.value !== 'NULL' && attr.value !== '0') data.originalPlayerIDs.add(attr.value);
            }
            data.tacticRules.push(rule);
        });
        data.originalPlayerIDs = Array.from(data.originalPlayerIDs);
        return data;
    }

    function generateCompleteTacticXml(tacticData, playerMapping) {
        if (!tacticData.players) {
            console.error("Attempting to generate XML from an old or invalid tactic format. Operation aborted.");
            throw new Error("Cannot generate XML from outdated tactic format. Please resave the tactic first.");
        }
        let xml = `<?xml version="1.0" ?>\n<SoccerTactics>\n`;
        const mappedCaptain = playerMapping[tacticData.teamSettings.captainPID] || '0';
        xml += `\t<Team tactics="${tacticData.teamSettings.passingStyle || 'shortpass'}" playstyle="${tacticData.teamSettings.mentality || 'normal'}" aggression="${tacticData.teamSettings.aggression || 'normal'}" captain="${mappedCaptain}" />\n`;
        for (const originalPid in tacticData.players) {
            const mappedPid = playerMapping[originalPid];
            if (!mappedPid) continue;
            const p = tacticData.players[originalPid];
            const initial = p.initial || {
                x: 0,
                y: 0
            };
            const alt1 = p.alt1 || initial;
            const alt2 = p.alt2 || alt1;
            let posTag = `\t<Pos pos="${p.pos}" pid="${mappedPid}" x="${initial.x}" y="${initial.y}" x1="${alt1.x}" y1="${alt1.y}" x2="${alt2.x}" y2="${alt2.y}"`;
            if (p.pt) posTag += ` pt="${p.pt}"`;
            if (p.fk) posTag += ` fk="${p.fk}"`;
            posTag += ' />\n';
            xml += posTag;
        }
        for (const originalPid in tacticData.substitutes) {
            const mappedPid = playerMapping[originalPid];
            if (!mappedPid) continue;
            const s = tacticData.substitutes[originalPid];
            let subTag = `\t<Sub pos="${s.pos}" pid="${mappedPid}" x="${s.x}" y="${s.y}"`;
            if (s.pt) subTag += ` pt="${s.pt}"`;
            if (s.fk) subTag += ` fk="${s.fk}"`;
            subTag += ' />\n';
            xml += subTag;
        }
        tacticData.tacticRules.forEach(rule => {
            const mappedOutPlayer = (rule.out_player && rule.out_player !== 'no_change') ? (playerMapping[rule.out_player] || 'no_change') : 'no_change';
            const mappedInPlayer = (rule.in_player_id && rule.in_player_id !== 'NULL') ? (playerMapping[rule.in_player_id] || 'NULL') : 'NULL';
            let includeRule = true;
            if (rule.out_player && rule.out_player !== 'no_change' && mappedOutPlayer === 'no_change') includeRule = false;
            if (rule.in_player_id && rule.in_player_id !== 'NULL' && mappedInPlayer === 'NULL') includeRule = false;
            if (includeRule) {
                xml += '\t<TacticRule';
                for (const attr in rule) {
                    let value = rule[attr];
                    if (attr === 'out_player') value = mappedOutPlayer;
                    if (attr === 'in_player_id') value = mappedInPlayer;
                    xml += ` ${attr}="${value}"`;
                }
                xml += ' />\n';
            }
        });
        xml += '</SoccerTactics>';
        return xml;
    }

    async function saveCompleteTactic() {
        const exportButton = document.getElementById('export_button');
        const importExportWindow = document.getElementById('importExportTacticsWindow');
        const playerInfoWindow = document.getElementById('playerInfoWindow');
        const importExportData = document.getElementById('importExportData');
        if (!exportButton || !importExportWindow || !playerInfoWindow || !importExportData) return showErrorMessage(USERSCRIPT_STRINGS.errorTitle, 'Could not find required MZ UI elements for export.');
        const windowHidden = importExportWindow.style.display === 'none';
        if (windowHidden) {
            const toggleButton = document.getElementById('import_export_button');
            if (toggleButton) toggleButton.click();
            else return showErrorMessage(USERSCRIPT_STRINGS.errorTitle, 'Could not find button to toggle XML view.');
        }
        importExportData.value = '';
        exportButton.click();
        await new Promise(r => setTimeout(r, 200));
        const xmlString = importExportData.value;
        if (!xmlString) {
            if (windowHidden) document.getElementById('close_button')?.click();
            return showErrorMessage(USERSCRIPT_STRINGS.errorTitle, 'Export did not produce XML.');
        }
        let savedData;
        try {
            savedData = parseCompleteTacticXml(xmlString);
        } catch (error) {
            console.error("XML Parse Error:", error);
            if (windowHidden) document.getElementById('close_button')?.click();
            return showErrorMessage(USERSCRIPT_STRINGS.errorTitle, USERSCRIPT_STRINGS.errorXmlExportParse);
        }
        const result = await showAlert({
            title: USERSCRIPT_STRINGS.completeTacticNamePrompt,
            input: 'text',
            inputValue: '',
            placeholder: USERSCRIPT_STRINGS.completeTacticNamePlaceholder,
            inputValidator: (v) => {
                if (!v) return USERSCRIPT_STRINGS.noTacticNameProvidedError;
                if (v.length > MAX_TACTIC_NAME_LENGTH) return USERSCRIPT_STRINGS.tacticNameMaxLengthError;
                if (completeTactics.hasOwnProperty(v)) return USERSCRIPT_STRINGS.alreadyExistingTacticNameError;
                return null;
            },
            descriptionInput: 'textarea',
            descriptionValue: '',
            descriptionPlaceholder: USERSCRIPT_STRINGS.descriptionPlaceholder,
            descriptionValidator: (d) => {
                if (d && d.length > MAX_DESCRIPTION_LENGTH) return USERSCRIPT_STRINGS.descriptionMaxLengthError;
                return null;
            },
            showCancelButton: true,
            confirmButtonText: USERSCRIPT_STRINGS.saveButton,
            cancelButtonText: USERSCRIPT_STRINGS.cancelConfirmButton,
        });
        if (!result.isConfirmed || !result.value) {
            if (windowHidden) document.getElementById('close_button')?.click();
            return;
        }
        const baseName = result.value;
        const description = result.description || '';
        const fullName = `${baseName} (${getFormattedDate()})`;
        savedData.description = description;
        completeTactics[fullName] = savedData;
        saveCompleteTacticsData();
        updateCompleteTacticsDropdown(fullName);
        if (windowHidden) document.getElementById('close_button')?.click();
        await showSuccessMessage(USERSCRIPT_STRINGS.doneTitle, USERSCRIPT_STRINGS.completeTacticSaveSuccess.replace('{}', fullName));
    }

    async function loadCompleteTactic() {
        const selectedName = selectedCompleteTacticName;
        if (!selectedName || !completeTactics[selectedName]) return showErrorMessage(USERSCRIPT_STRINGS.errorTitle, USERSCRIPT_STRINGS.noTacticSelectedError);
        showLoadingOverlay();
        const originalAlert = window.alert;
        try {
            const dataToLoad = completeTactics[selectedName];
            const currentRoster = await fetchTeamRoster();
            if (!currentRoster) throw new Error(USERSCRIPT_STRINGS.errorFetchingRoster);
            const rosterSet = new Set(currentRoster);
            const originalPids = dataToLoad.originalPlayerIDs || [];
            const mapping = {};
            const missingPids = [];
            const mappedPids = new Set();
            originalPids.forEach(pid => {
                if (rosterSet.has(pid)) {
                    mapping[pid] = pid;
                    mappedPids.add(pid);
                } else {
                    missingPids.push(pid);
                }
            });
            const availablePids = currentRoster.filter(pid => !mappedPids.has(pid));
            let replacementsFound = 0;
            missingPids.forEach(missingPid => {
                if (availablePids.length > 0) {
                    const randomIndex = Math.floor(Math.random() * availablePids.length);
                    const replacementPid = availablePids.splice(randomIndex, 1)[0];
                    mapping[missingPid] = replacementPid;
                    replacementsFound++;
                } else {
                    mapping[missingPid] = null;
                }
            });
            const assignedPids = new Set();
            if (dataToLoad.players) {
                Object.keys(dataToLoad.players).forEach(pid => {
                    if (mapping[pid]) assignedPids.add(mapping[pid]);
                });
            }
            if (dataToLoad.substitutes) {
                Object.keys(dataToLoad.substitutes).forEach(pid => {
                    if (mapping[pid]) assignedPids.add(mapping[pid]);
                });
            }
            if (assignedPids.size < MIN_PLAYERS_ON_PITCH) throw new Error(USERSCRIPT_STRINGS.errorInsufficientPlayers);
            let xmlString;
            try {
                xmlString = generateCompleteTacticXml(dataToLoad, mapping);
            } catch (error) {
                console.error("XML Gen Error:", error);
                throw new Error(USERSCRIPT_STRINGS.errorXmlGenerate);
            }
            let alertContent = null;
            window.alert = (msg) => {
                console.warn("Native alert captured:", msg);
                alertContent = msg;
            };
            const importButton = document.getElementById('import_button');
            const importExportWindow = document.getElementById('importExportTacticsWindow');
            const importExportData = document.getElementById('importExportData');
            if (!importButton || !importExportWindow || !importExportData) throw new Error('Could not find required MZ UI elements for import.');
            const windowHidden = importExportWindow.style.display === 'none';
            if (windowHidden) {
                document.getElementById('import_export_button')?.click();
                await new Promise(r => setTimeout(r, 50));
            }
            importExportData.value = xmlString;
            importButton.click();
            await new Promise(r => setTimeout(r, 300));
            window.alert = originalAlert;
            if (alertContent) throw new Error(USERSCRIPT_STRINGS.invalidXmlForImport + (alertContent.length < 100 ? ` MZ Message: ${alertContent}` : ''));

            const observer = new MutationObserver((mutationsList, obs) => {
                for (const mutation of mutationsList) {
                    if (mutation.type === 'childList') {
                        const errorBox = document.getElementById('lightbox_tactics_rule_error');
                        if (errorBox && errorBox.style.display !== 'none') {
                            const okButton = errorBox.querySelector('#powerbox_confirm_ok_button');
                            if (okButton) {
                                okButton.click();
                                obs.disconnect();
                                break;
                            }
                        }
                    }
                }
            });
            observer.observe(document.body, {
                childList: true,
                subtree: true
            });
            setTimeout(() => observer.disconnect(), 3000);
            if (replacementsFound > 0) {
                showAlert({
                    title: 'Warning',
                    text: USERSCRIPT_STRINGS.warningPlayersSubstituted,
                    type: 'info'
                });
            }
            else showSuccessMessage(USERSCRIPT_STRINGS.doneTitle, USERSCRIPT_STRINGS.completeTacticLoadSuccess.replace('{}', selectedName));
        } catch (error) {
            console.error("Load Complete Tactic Error:", error);
            showErrorMessage(USERSCRIPT_STRINGS.errorTitle, error.message || 'Unknown error during load.');
            if (window.alert !== originalAlert) window.alert = originalAlert;
        } finally {
            hideLoadingOverlay();
        }
    }

    async function deleteCompleteTactic() {
        const selectedName = selectedCompleteTacticName;
        if (!selectedName || !completeTactics[selectedName]) return showErrorMessage(USERSCRIPT_STRINGS.errorTitle, USERSCRIPT_STRINGS.noTacticSelectedError);
        const confirmation = await showAlert({
            title: USERSCRIPT_STRINGS.confirmationTitle,
            text: USERSCRIPT_STRINGS.deleteConfirmation.replace('{}', selectedName),
            showCancelButton: true,
            confirmButtonText: USERSCRIPT_STRINGS.deleteTacticConfirmButton,
            cancelButtonText: USERSCRIPT_STRINGS.cancelConfirmButton,
            type: 'error'
        });
        if (!confirmation.isConfirmed) return;
        delete completeTactics[selectedName];
        selectedCompleteTacticName = null;
        saveCompleteTacticsData();
        updateCompleteTacticsDropdown();
        await showSuccessMessage(USERSCRIPT_STRINGS.doneTitle, USERSCRIPT_STRINGS.completeTacticDeleteSuccess.replace('{}', selectedName));
    }

    async function editCompleteTactic() {
        const selectedName = selectedCompleteTacticName;
        if (!selectedName || !completeTactics[selectedName]) {
            return showErrorMessage(USERSCRIPT_STRINGS.errorTitle, USERSCRIPT_STRINGS.noTacticSelectedError);
        }
        const originalTacticData = completeTactics[selectedName];
        const originalDescription = originalTacticData.description || '';

        const result = await showAlert({
            title: USERSCRIPT_STRINGS.renameCompleteTacticPrompt,
            input: 'text',
            inputValue: selectedName,
            placeholder: USERSCRIPT_STRINGS.completeTacticNamePlaceholder,
            inputValidator: (v) => {
                if (!v) return USERSCRIPT_STRINGS.noTacticNameProvidedError;
                if (v.length > MAX_TACTIC_NAME_LENGTH) return USERSCRIPT_STRINGS.tacticNameMaxLengthError;
                if (v !== selectedName && completeTactics.hasOwnProperty(v)) return USERSCRIPT_STRINGS.alreadyExistingTacticNameError;
                return null;
            },
            descriptionInput: 'textarea',
            descriptionValue: originalDescription,
            descriptionPlaceholder: USERSCRIPT_STRINGS.descriptionPlaceholder,
            descriptionValidator: (d) => {
                if (d && d.length > MAX_DESCRIPTION_LENGTH) return USERSCRIPT_STRINGS.descriptionMaxLengthError;
                return null;
            },
            showCancelButton: true,
            confirmButtonText: USERSCRIPT_STRINGS.saveButton,
            cancelButtonText: USERSCRIPT_STRINGS.cancelConfirmButton
        });

        if (!result.isConfirmed || !result.value) return;

        const newName = result.value;
        const newDescription = result.description || '';

        if (newName === selectedName && newDescription === originalDescription) return;

        const tacticData = completeTactics[selectedName];
        tacticData.description = newDescription;

        delete completeTactics[selectedName];
        completeTactics[newName] = tacticData;

        saveCompleteTacticsData();
        selectedCompleteTacticName = newName;
        updateCompleteTacticsDropdown(newName);
        await showSuccessMessage(USERSCRIPT_STRINGS.doneTitle, USERSCRIPT_STRINGS.completeTacticRenameSuccess.replace('{}', newName));
    }

    async function updateCompleteTactic() {
        const selectedName = selectedCompleteTacticName;
        if (!selectedName || !completeTactics[selectedName]) {
            return showErrorMessage(USERSCRIPT_STRINGS.errorTitle, USERSCRIPT_STRINGS.noTacticSelectedError);
        }

        const confirmation = await showAlert({
            title: USERSCRIPT_STRINGS.confirmationTitle,
            text: USERSCRIPT_STRINGS.updateCompleteTacticConfirmation.replace('{}', selectedName),
            showCancelButton: true,
            confirmButtonText: USERSCRIPT_STRINGS.updateConfirmButton,
            cancelButtonText: USERSCRIPT_STRINGS.cancelConfirmButton
        });

        if (!confirmation.isConfirmed) return;

        const originalAlert = window.alert;
        try {
            const exportButton = document.getElementById('export_button');
            const importExportWindow = document.getElementById('importExportTacticsWindow');
            const importExportData = document.getElementById('importExportData');
            if (!exportButton || !importExportWindow || !importExportData) throw new Error('Could not find required MZ UI elements for export.');

            const windowHidden = importExportWindow.style.display === 'none';
            if (windowHidden) {
                document.getElementById('import_export_button')?.click();
                await new Promise(r => setTimeout(r, 50));
            }

            importExportData.value = '';
            exportButton.click();
            await new Promise(r => setTimeout(r, 200));
            const xmlString = importExportData.value;
            if (windowHidden) document.getElementById('close_button')?.click();

            if (!xmlString) throw new Error('Export did not produce XML.');

            let updatedData;
            try {
                updatedData = parseCompleteTacticXml(xmlString);
            } catch (error) {
                console.error("XML Parse Error on Update:", error);
                throw new Error(USERSCRIPT_STRINGS.errorXmlExportParse);
            }

            updatedData.description = completeTactics[selectedName]?.description || '';
            completeTactics[selectedName] = updatedData;
            saveCompleteTacticsData();
            updateCompleteTacticsDropdown(selectedName);
            await showSuccessMessage(USERSCRIPT_STRINGS.doneTitle, USERSCRIPT_STRINGS.completeTacticUpdateSuccess.replace('{}', selectedName));

        } catch (error) {
            console.error("Update Complete Tactic Error:", error);
            showErrorMessage(USERSCRIPT_STRINGS.errorTitle, error.message || 'Unknown error during update.');
            if (window.alert !== originalAlert) window.alert = originalAlert;
            const importExportWindow = document.getElementById('importExportTacticsWindow');
            if (importExportWindow && importExportWindow.style.display !== 'none') {
                document.getElementById('close_button')?.click();
            }
        }
    }

    async function importCompleteTactics() {
        try {
            const result = await showAlert({
                title: USERSCRIPT_STRINGS.importCompleteTacticsTitle,
                input: 'text',
                inputValue: '',
                placeholder: USERSCRIPT_STRINGS.importCompleteTacticsPlaceholder,
                showCancelButton: true,
                confirmButtonText: USERSCRIPT_STRINGS.importButton,
                cancelButtonText: USERSCRIPT_STRINGS.cancelConfirmButton
            });

            if (!result.isConfirmed || !result.value) return;

            let importedData;
            try {
                importedData = JSON.parse(result.value);
            } catch (e) {
                await showErrorMessage(USERSCRIPT_STRINGS.errorTitle, USERSCRIPT_STRINGS.invalidCompleteImportError);
                return;
            }

            if (typeof importedData !== 'object' || importedData === null || Array.isArray(importedData)) {
                await showErrorMessage(USERSCRIPT_STRINGS.errorTitle, USERSCRIPT_STRINGS.invalidCompleteImportError);
                return;
            }

            let addedCount = 0;
            let updatedCount = 0;
            for (const name in importedData) {
                if (importedData.hasOwnProperty(name)) {
                    if (typeof importedData[name] === 'object' && importedData[name] !== null) {
                        if (!importedData[name].hasOwnProperty('description')) importedData[name].description = '';
                        if (!completeTactics.hasOwnProperty(name)) {
                            addedCount++;
                        } else {
                            updatedCount++;
                        }
                        completeTactics[name] = importedData[name];
                    } else {
                        console.warn(`Skipping invalid tactic data during import for key: ${name}`);
                    }
                }
            }

            saveCompleteTacticsData();
            updateCompleteTacticsDropdown();
            let message = USERSCRIPT_STRINGS.importCompleteTacticsAlert;
            if (addedCount > 0 || updatedCount > 0) {
                message += ` (${addedCount > 0 ? `${addedCount} new` : ''}${addedCount > 0 && updatedCount > 0 ? ', ' : ''}${updatedCount > 0 ? `${updatedCount} updated` : ''} items)`;
            }
            await showSuccessMessage(USERSCRIPT_STRINGS.doneTitle, message);

        } catch (error) {
            console.error('Import Complete Tactics Error:', error);
            await showErrorMessage(USERSCRIPT_STRINGS.errorTitle, USERSCRIPT_STRINGS.invalidCompleteImportError + (error.message ? `: ${error.message}` : ''));
        }
    }

    async function exportCompleteTactics() {
        try {
            const jsonString = JSON.stringify(completeTactics, null, 2);
            if (navigator.clipboard?.writeText) {
                try {
                    await navigator.clipboard.writeText(jsonString);
                    await showSuccessMessage(USERSCRIPT_STRINGS.doneTitle, USERSCRIPT_STRINGS.exportCompleteTacticsAlert);
                    return;
                } catch (clipError) {
                    console.warn('Clipboard write failed, fallback.', clipError);
                }
            }
            const textArea = document.createElement('textarea');
            textArea.value = jsonString;
            textArea.style.width = '100%';
            textArea.style.minHeight = '150px';
            textArea.style.marginTop = '10px';
            textArea.style.backgroundColor = 'rgba(0,0,0,0.2)';
            textArea.style.color = 'var(--text-color)';
            textArea.style.border = '1px solid rgba(255,255,255,0.1)';
            textArea.style.borderRadius = '4px';
            textArea.readOnly = true;
            const container = document.createElement('div');
            container.appendChild(document.createTextNode('Copy the JSON data:'));
            container.appendChild(textArea);
            await showAlert({
                title: USERSCRIPT_STRINGS.exportCompleteTacticsTitle,
                htmlContent: container,
                confirmButtonText: 'Done'
            });
            textArea.select();
            textArea.setSelectionRange(0, 99999);
        } catch (error) {
            console.error('Export Complete Tactics error:', error);
            await showErrorMessage(USERSCRIPT_STRINGS.errorTitle, 'Failed to export tactics.');
        }
    }

    function createTacticPreviewElement() {
        if (previewElement) return previewElement;
        previewElement = document.createElement('div');
        previewElement.id = 'mztm-tactic-preview';
        previewElement.style.display = 'none';
        previewElement.style.opacity = '0';
        previewElement.addEventListener('mouseenter', () => {
            if (previewHideTimeout) clearTimeout(previewHideTimeout);
        });
        previewElement.addEventListener('mouseleave', hideTacticPreview);
        document.body.appendChild(previewElement);
        return previewElement;
    }

    function updatePreviewPosition(event) {
        if (!previewElement || previewElement.style.display === 'none') return;
        const xOffset = 15;
        const yOffset = 10;
        let x = event.clientX + xOffset;
        let y = event.clientY + yOffset;
        const previewRect = previewElement.getBoundingClientRect();
        const viewportWidth = window.innerWidth;
        const viewportHeight = window.innerHeight;

        if (x + previewRect.width > viewportWidth - 10) {
            x = event.clientX - previewRect.width - xOffset;
        }
        if (y + previewRect.height > viewportHeight - 10) {
            y = event.clientY - previewRect.height - yOffset;
        }
        if (x < 10) x = 10;
        if (y < 10) y = 10;

        previewElement.style.left = `${x}px`;
        previewElement.style.top = `${y}px`;
    }

    function showTacticPreview(event, listItem) {
        if (!listItem || listItem.classList.contains('mztm-custom-select-category') || listItem.classList.contains('mztm-custom-select-no-results')) {
            hideTacticPreview();
            return;
        }

        if (previewHideTimeout) clearTimeout(previewHideTimeout);

        const tacticId = listItem.dataset.tacticId;
        const tacticName = listItem.dataset.tacticName;
        const description = listItem.dataset.description || '';
        const formationString = listItem.dataset.formationString || 'N/A';
        const isCompleteTactic = listItem.closest('#complete_tactics_selector_list');


        if (!tacticId && !tacticName) {
            hideTacticPreview();
            return;
        }

        const previewDiv = createTacticPreviewElement();
        previewDiv.innerHTML = `
            <div class="mztm-preview-formation"><strong>${USERSCRIPT_STRINGS.previewFormationLabel}</strong> ${formationString}</div>
            ${description ? `<div class="mztm-preview-desc">${description.replace(/\n/g, '<br>')}</div>` : '<div class="mztm-preview-no-desc">No description available.</div>'}
        `;
        previewDiv.style.display = 'block';
        requestAnimationFrame(() => {
            updatePreviewPosition(event);
            previewDiv.style.opacity = '1';
        });

        document.addEventListener('mousemove', updatePreviewPosition);
    }

    function hideTacticPreview() {
        if (previewHideTimeout) clearTimeout(previewHideTimeout);
        previewHideTimeout = setTimeout(() => {
            if (previewElement) {
                previewElement.style.opacity = '0';
                setTimeout(() => {
                    if (previewElement && previewElement.style.opacity === '0') {
                        previewElement.style.display = 'none';
                    }
                }, 200);
                document.removeEventListener('mousemove', updatePreviewPosition);
            }
            previewHideTimeout = null;
        }, 100);
    }

    function addPreviewListenersToList(listElement) {
        if (!listElement) return;

        listElement.addEventListener('mouseover', (event) => {
            const listItem = event.target.closest('.mztm-custom-select-item');
            if (listItem && !listItem.classList.contains('disabled')) {
                showTacticPreview(event, listItem);
            } else if (!listItem) {
                hideTacticPreview();
            }
        });

        listElement.addEventListener('mouseout', (event) => {
            const listItem = event.target.closest('.mztm-custom-select-item');
            if (listItem) {
                const related = event.relatedTarget;
                if (!listItem.contains(related) && related !== previewElement) {
                    hideTacticPreview();
                }
            } else if (!listElement.contains(event.relatedTarget) && (!previewElement || event.relatedTarget !== previewElement)) {
                hideTacticPreview();
            }
        });

        window.addEventListener('scroll', hideTacticPreview, true);
    }

    function closeAllCustomDropdowns(exceptElement = null) {
        document.querySelectorAll('.mztm-custom-select-list-container.open').forEach(container => {
            const wrapper = container.closest('.mztm-custom-select-wrapper');
            if (wrapper !== exceptElement?.closest('.mztm-custom-select-wrapper')) {
                container.classList.remove('open');
                const trigger = wrapper?.querySelector('.mztm-custom-select-trigger');
                trigger?.classList.remove('open');
            }
        });
        currentOpenDropdown = exceptElement?.closest('.mztm-custom-select-wrapper') || null;
    }

    document.addEventListener('click', (event) => {
        if (currentOpenDropdown && !currentOpenDropdown.contains(event.target)) {
            closeAllCustomDropdowns();
        }
    });

    function createCustomSelect(id, placeholderText) {
        const wrapper = document.createElement('div');
        wrapper.className = 'mztm-custom-select-wrapper';
        wrapper.id = `${id}_wrapper`;

        const trigger = document.createElement('div');
        trigger.className = 'mztm-custom-select-trigger';
        trigger.id = `${id}_trigger`;
        trigger.tabIndex = 0;
        const triggerText = document.createElement('span');
        triggerText.className = 'mztm-custom-select-text mztm-custom-select-placeholder';
        triggerText.textContent = placeholderText;
        trigger.appendChild(triggerText);

        const listContainer = document.createElement('div');
        listContainer.className = 'mztm-custom-select-list-container';
        listContainer.id = `${id}_list_container`;
        const list = document.createElement('ul');
        list.className = 'mztm-custom-select-list';
        list.id = `${id}_list`;
        listContainer.appendChild(list);

        addPreviewListenersToList(list);

        trigger.addEventListener('click', (e) => {
            e.stopPropagation();
            const isOpen = listContainer.classList.contains('open');
            closeAllCustomDropdowns(wrapper);
            if (!isOpen && !trigger.classList.contains('disabled')) {
                listContainer.classList.add('open');
                trigger.classList.add('open');
                currentOpenDropdown = wrapper;
            }
        });

        trigger.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                trigger.click();
            }
        });

        list.addEventListener('click', (e) => {
            const item = e.target.closest('.mztm-custom-select-item');
            if (item && !item.classList.contains('disabled')) {
                const value = item.dataset.value || item.dataset.tacticId || item.dataset.tacticName;
                const text = item.textContent;

                triggerText.textContent = text;
                triggerText.classList.remove('mztm-custom-select-placeholder');
                trigger.dataset.selectedValue = value;

                if (id === 'tactics_selector') {
                    handleTacticSelection(value);
                } else if (id === 'complete_tactics_selector') {
                    selectedCompleteTacticName = value;
                }

                closeAllCustomDropdowns();

                const changeEvent = new Event('change', { bubbles: true });
                trigger.dispatchEvent(changeEvent);
            }
        });

        wrapper.appendChild(trigger);
        wrapper.appendChild(listContainer);
        return wrapper;
    }

    function createTacticsSelector() {
        const container = document.createElement('div');
        container.className = 'tactics-selector-section';
        const controlsContainer = document.createElement('div');
        controlsContainer.className = 'formations-controls-container';

        const dropdownWrapper = createCustomSelect('tactics_selector', USERSCRIPT_STRINGS.tacticsDropdownMenuLabel);

        const filterControlsRow = document.createElement('div');
        filterControlsRow.className = 'mztm-filter-controls-row';

        const searchBox = document.createElement('input');
        searchBox.type = 'text';
        searchBox.className = 'tactics-search-box';
        searchBox.placeholder = USERSCRIPT_STRINGS.searchPlaceholder;
        searchBox.addEventListener('input', (e) => {
            searchTerm = e.target.value.toLowerCase();
            updateTacticsDropdown(selectedFormationTacticId);
        });

        const filterDropdownWrapper = document.createElement('div');
        filterDropdownWrapper.className = 'category-filter-wrapper';
        const filterSelect = document.createElement('select');
        filterSelect.id = 'category_filter_selector';
        filterSelect.addEventListener('change', (e) => {
            currentFilter = e.target.value;
            GM_setValue(CATEGORY_FILTER_STORAGE_KEY, currentFilter);
            updateTacticsDropdown(selectedFormationTacticId);
        });

        const manageBtn = document.createElement('button');
        manageBtn.id = 'manage_items_btn';
        manageBtn.className = 'mzbtn manage-items-btn';
        manageBtn.innerHTML = '⚙️';
        manageBtn.title = USERSCRIPT_STRINGS.managementModalTitle;
        manageBtn.addEventListener('click', showManagementModal);
        filterDropdownWrapper.appendChild(filterSelect);
        filterDropdownWrapper.appendChild(manageBtn);

        appendChildren(filterControlsRow, [searchBox, filterDropdownWrapper]);
        appendChildren(controlsContainer, [dropdownWrapper, filterControlsRow]);
        container.appendChild(controlsContainer);
        return container;
    }

    function updateCategoryFilterDropdown() {
        const filterSelect = document.getElementById('category_filter_selector');
        if (!filterSelect) return;
        filterSelect.innerHTML = '';
        const usedCategoryIds = new Set(tactics.map(t => t.style || OTHER_CATEGORY_ID));
        let categoriesToShow = [{
            id: 'all',
            name: USERSCRIPT_STRINGS.allTacticsFilter
        }];
        Object.values(categories)
            .filter(cat => cat.id !== 'all' && (usedCategoryIds.has(cat.id) || Object.keys(DEFAULT_CATEGORIES).includes(cat.id) || cat.id === OTHER_CATEGORY_ID))
            .sort((a, b) => {
            if (a.id === OTHER_CATEGORY_ID) return 1;
            if (b.id === OTHER_CATEGORY_ID) return -1;
            return a.name.localeCompare(b.name);
        })
            .forEach(cat => categoriesToShow.push({ id: cat.id, name: getCategoryName(cat.id) }));

        let foundCurrentFilter = false;
        categoriesToShow.forEach(categoryInfo => {
            const option = document.createElement('option');
            option.value = categoryInfo.id;
            option.textContent = categoryInfo.name;
            filterSelect.appendChild(option);
            if (categoryInfo.id === currentFilter) {
                foundCurrentFilter = true;
            }
        });

        if (foundCurrentFilter) {
            filterSelect.value = currentFilter;
        } else {
            filterSelect.value = 'all';
            currentFilter = 'all';
            GM_setValue(CATEGORY_FILTER_STORAGE_KEY, currentFilter);
        }

        filterSelect.disabled = categoriesToShow.length <= 1;
    }

    function updateTacticsDropdown(currentSelectedId = null) {
        const listElement = document.getElementById('tactics_selector_list');
        const triggerElement = document.getElementById('tactics_selector_trigger');
        const triggerTextElement = triggerElement?.querySelector('.mztm-custom-select-text');
        const wrapper = document.getElementById('tactics_selector_wrapper');
        const searchBox = document.querySelector('.tactics-search-box');

        if (!listElement || !triggerElement || !triggerTextElement || !wrapper) return;

        listElement.innerHTML = '';

        if (searchTerm.length > 0) {
            wrapper.classList.add('filtering');
            searchBox?.classList.add('filtering');
        } else {
            wrapper.classList.remove('filtering');
            searchBox?.classList.remove('filtering');
        }

        const filteredTactics = tactics.filter(t => {
            const nameMatch = searchTerm === '' || t.name.toLowerCase().includes(searchTerm);
            const categoryMatch = currentFilter === 'all' || (currentFilter === OTHER_CATEGORY_ID && (!t.style || t.style === OTHER_CATEGORY_ID)) || t.style === currentFilter;
            return nameMatch && categoryMatch;
        });

        const groupedTactics = {};
        Object.keys(categories).forEach(id => {
            if (id !== 'all') groupedTactics[id] = [];
        });
        if (!groupedTactics[OTHER_CATEGORY_ID]) groupedTactics[OTHER_CATEGORY_ID] = [];

        filteredTactics.forEach(t => {
            const categoryId = t.style || OTHER_CATEGORY_ID;
            if (!groupedTactics[categoryId]) {
                if (!groupedTactics[OTHER_CATEGORY_ID]) groupedTactics[OTHER_CATEGORY_ID] = [];
                groupedTactics[OTHER_CATEGORY_ID].push(t);
            }
            else groupedTactics[categoryId].push(t);
        });

        const categoryOrder = Object.keys(groupedTactics).filter(id => groupedTactics[id].length > 0).sort((a, b) => {
            if (a === currentFilter) return -1;
            if (b === currentFilter) return 1;
            if (DEFAULT_CATEGORIES[a] && !DEFAULT_CATEGORIES[b]) return -1;
            if (!DEFAULT_CATEGORIES[a] && DEFAULT_CATEGORIES[b]) return 1;
            if (a === OTHER_CATEGORY_ID) return 1;
            if (b === OTHER_CATEGORY_ID) return -1;
            return (getCategoryName(a) || '').localeCompare(getCategoryName(b) || '');
        });

        let itemsAdded = 0;
        categoryOrder.forEach(categoryId => {
            if (groupedTactics[categoryId].length > 0) {
                addTacticItemsGroup(listElement, groupedTactics[categoryId], getCategoryName(categoryId), categoryId);
                itemsAdded += groupedTactics[categoryId].length;
            }
        });

        if (itemsAdded === 0) {
            const noResultsItem = document.createElement('li');
            noResultsItem.className = 'mztm-custom-select-no-results';
            noResultsItem.textContent = tactics.length === 0 ? USERSCRIPT_STRINGS.noTacticsSaved : USERSCRIPT_STRINGS.noTacticsFound;
            listElement.appendChild(noResultsItem);
            triggerElement.classList.add('disabled');
            triggerTextElement.textContent = tactics.length === 0 ? USERSCRIPT_STRINGS.noTacticsSaved : USERSCRIPT_STRINGS.tacticsDropdownMenuLabel;
            triggerTextElement.classList.add('mztm-custom-select-placeholder');
            delete triggerElement.dataset.selectedValue;
            selectedFormationTacticId = null;
        } else {
            triggerElement.classList.remove('disabled');
            const currentSelection = tactics.find(t => t.id === currentSelectedId);
            if (currentSelection) {
                triggerTextElement.textContent = currentSelection.name;
                triggerTextElement.classList.remove('mztm-custom-select-placeholder');
                triggerElement.dataset.selectedValue = currentSelection.id;
                selectedFormationTacticId = currentSelection.id;
            } else {
                triggerTextElement.textContent = USERSCRIPT_STRINGS.tacticsDropdownMenuLabel;
                triggerTextElement.classList.add('mztm-custom-select-placeholder');
                delete triggerElement.dataset.selectedValue;
                selectedFormationTacticId = null;
            }
        }
    }

    function addTacticItemsGroup(listElement, tacticsList, groupLabel, categoryId) {
        if (tacticsList.length === 0) return;

        const categoryHeader = document.createElement('li');
        categoryHeader.className = 'mztm-custom-select-category';
        categoryHeader.textContent = groupLabel;
        listElement.appendChild(categoryHeader);

        tacticsList.sort((a, b) => a.name.localeCompare(b.name));
        tacticsList.forEach(tactic => {
            const item = document.createElement('li');
            item.className = 'mztm-custom-select-item';
            item.textContent = tactic.name;
            item.dataset.tacticId = tactic.id;
            item.dataset.value = tactic.id;
            item.dataset.description = tactic.description || '';
            item.dataset.style = tactic.style || OTHER_CATEGORY_ID;
            item.dataset.formationString = formatFormationString(getFormation(tactic.coordinates));
            listElement.appendChild(item);
        });
    }

    function createCompleteTacticsSelector() {
        const container = document.createElement('div');
        container.className = 'tactics-selector-section';
        const label = document.createElement('label');
        label.textContent = '';
        label.className = 'tactics-selector-label';

        const dropdownWrapper = createCustomSelect('complete_tactics_selector', USERSCRIPT_STRINGS.completeTacticsDropdownMenuLabel);

        container.appendChild(label);
        container.appendChild(dropdownWrapper);
        return container;
    }

    function updateCompleteTacticsDropdown(currentSelectedName = null) {
        const listElement = document.getElementById('complete_tactics_selector_list');
        const triggerElement = document.getElementById('complete_tactics_selector_trigger');
        const triggerTextElement = triggerElement?.querySelector('.mztm-custom-select-text');
        const wrapper = document.getElementById('complete_tactics_selector_wrapper');

        if (!listElement || !triggerElement || !triggerTextElement || !wrapper) return;

        listElement.innerHTML = '';

        const names = Object.keys(completeTactics).sort((a, b) => a.localeCompare(b));

        if (names.length === 0) {
            const noResultsItem = document.createElement('li');
            noResultsItem.className = 'mztm-custom-select-no-results';
            noResultsItem.textContent = USERSCRIPT_STRINGS.noCompleteTacticsSaved;
            listElement.appendChild(noResultsItem);
            triggerElement.classList.add('disabled');
            triggerTextElement.textContent = USERSCRIPT_STRINGS.noCompleteTacticsSaved;
            triggerTextElement.classList.add('mztm-custom-select-placeholder');
            delete triggerElement.dataset.selectedValue;
            selectedCompleteTacticName = null;
        } else {
            triggerElement.classList.remove('disabled');
            names.forEach(name => {
                const tactic = completeTactics[name];
                const item = document.createElement('li');
                item.className = 'mztm-custom-select-item';
                item.textContent = name;
                item.dataset.tacticName = name;
                item.dataset.value = name;
                item.dataset.description = tactic.description || '';
                item.dataset.formationString = formatFormationString(getFormationFromCompleteTactic(tactic));
                listElement.appendChild(item);
            });

            const currentSelection = currentSelectedName && completeTactics[currentSelectedName] ? currentSelectedName : null;

            if (currentSelection) {
                triggerTextElement.textContent = currentSelection;
                triggerTextElement.classList.remove('mztm-custom-select-placeholder');
                triggerElement.dataset.selectedValue = currentSelection;
                selectedCompleteTacticName = currentSelection;
            } else {
                triggerTextElement.textContent = USERSCRIPT_STRINGS.completeTacticsDropdownMenuLabel;
                triggerTextElement.classList.add('mztm-custom-select-placeholder');
                delete triggerElement.dataset.selectedValue;
                selectedCompleteTacticName = null;
            }
        }
    }

    function createButton(id, text, clickHandler) {
        const button = document.createElement('button');
        setUpButton(button, id, text);
        if (clickHandler) {
            button.addEventListener('click', async (e) => {
                e.stopPropagation();
                try {
                    await clickHandler();
                } catch (err) {
                    console.error('Button click failed:', err);
                    showErrorMessage('Action Failed', `${err.message || err}`);
                }
            });
        }
        return button;
    }

    async function checkVersion() {
        const savedVersion = GM_getValue(VERSION_KEY, null);
        if (!savedVersion || savedVersion !== SCRIPT_VERSION) {
            await showWelcomeMessage();
            GM_setValue(VERSION_KEY, SCRIPT_VERSION);
        }
    }

    function createModeToggleSwitch() {
        const label = document.createElement('label');
        label.className = 'mode-toggle-switch';
        const input = document.createElement('input');
        input.type = 'checkbox';
        input.id = 'view-mode-toggle';
        input.addEventListener('change', (e) => setViewMode(e.target.checked ? 'complete' : 'normal'));
        const slider = document.createElement('span');
        slider.className = 'mode-toggle-slider';
        label.appendChild(input);
        label.appendChild(slider);
        return label;
    }

    function createModeLabel(mode, isPrefix = false) {
        const span = document.createElement('span');
        span.className = 'mode-toggle-label';
        span.textContent = isPrefix ? USERSCRIPT_STRINGS.modeLabel : (mode === 'normal' ? USERSCRIPT_STRINGS.normalModeLabel : USERSCRIPT_STRINGS.completeModeLabel);
        span.id = `mode-label-${mode}`;
        return span;
    }

    function setViewMode(mode) {
        currentViewMode = mode;
        GM_setValue(VIEW_MODE_KEY, mode);
        const normalContent = document.getElementById('normal-tactics-content');
        const completeContent = document.getElementById('complete-tactics-content');
        const toggleInput = document.getElementById('view-mode-toggle');
        const normalLabel = document.getElementById('mode-label-normal');
        const completeLabel = document.getElementById('mode-label-complete');
        const isNormal = mode === 'normal';
        if (normalContent) normalContent.style.display = isNormal ? 'block' : 'none';
        if (completeContent) completeContent.style.display = isNormal ? 'none' : 'block';
        if (toggleInput) toggleInput.checked = !isNormal;
        if (normalLabel) normalLabel.classList.toggle('active', isNormal);
        if (completeLabel) completeLabel.classList.toggle('active', !isNormal);
    }

    function createMainContainer() {
        const container = document.createElement('div');
        container.id = 'mz_tactics_panel';
        container.classList.add('mz-panel');
        const header = document.createElement('div');
        header.classList.add('mz-group-main-title');
        const titleContainer = document.createElement('div');
        titleContainer.className = 'mz-title-container';
        const titleText = document.createElement('span');
        titleText.textContent = USERSCRIPT_STRINGS.managerTitle;
        titleText.classList.add('mz-main-title');
        const versionText = document.createElement('span');
        versionText.textContent = 'v' + DISPLAY_VERSION;
        versionText.classList.add('mz-version-text');
        const modeToggleContainer = document.createElement('div');
        modeToggleContainer.className = 'mode-toggle-container';
        const prefixLabel = createModeLabel('', true);
        const modeLabelNormal = createModeLabel('normal');
        const toggleSwitch = createModeToggleSwitch();
        const modeLabelComplete = createModeLabel('complete');
        appendChildren(modeToggleContainer, [prefixLabel, modeLabelNormal, toggleSwitch, modeLabelComplete]);
        appendChildren(titleContainer, [titleText, versionText, modeToggleContainer]);
        header.appendChild(titleContainer);
        const toggleButton = createToggleButton();
        header.appendChild(toggleButton);
        container.appendChild(header);
        const group = document.createElement('div');
        group.classList.add('mz-group');
        container.appendChild(group);

        const normalContent = document.createElement('div');
        normalContent.id = 'normal-tactics-content';
        normalContent.className = 'section-content';
        const tacticsSelectorSection = createTacticsSelector();
        const normalButtonsSection = document.createElement('div');
        normalButtonsSection.className = 'action-buttons-section';
        const addCurrentBtn = createButton('add_current_tactic_btn', USERSCRIPT_STRINGS.addCurrentTactic, addNewTactic);
        const addXmlBtn = createButton('add_xml_tactic_btn', USERSCRIPT_STRINGS.addWithXmlButton, addNewTacticWithXml);
        const editBtn = createButton('edit_tactic_button', USERSCRIPT_STRINGS.renameButton, () => editTactic());
        const updateBtn = createButton('update_tactic_button', USERSCRIPT_STRINGS.updateButton, updateTactic);
        const deleteBtn = createButton('delete_tactic_button', USERSCRIPT_STRINGS.deleteButton, deleteTactic);
        const importBtn = createButton('import_tactics_btn', USERSCRIPT_STRINGS.importButton, importTacticsJsonData);
        const exportBtn = createButton('export_tactics_btn', USERSCRIPT_STRINGS.exportButton, exportTacticsJsonData);
        const resetBtn = createButton('reset_tactics_btn', USERSCRIPT_STRINGS.resetButton, resetTactics);
        const clearBtn = createButton('clear_tactics_btn', USERSCRIPT_STRINGS.clearButton, clearTactics);
        const normalButtonsRow1 = document.createElement('div');
        normalButtonsRow1.className = 'action-buttons-row';
        appendChildren(normalButtonsRow1, [addCurrentBtn, addXmlBtn, editBtn, updateBtn, deleteBtn]);
        const normalButtonsRow2 = document.createElement('div');
        normalButtonsRow2.className = 'action-buttons-row';
        appendChildren(normalButtonsRow2, [importBtn, exportBtn, resetBtn, clearBtn]);
        appendChildren(normalButtonsSection, [normalButtonsRow1, normalButtonsRow2]);
        appendChildren(normalContent, [tacticsSelectorSection, normalButtonsSection, createHiddenTriggerButton(), createCombinedInfoButton()]);
        group.appendChild(normalContent);

        const completeContent = document.createElement('div');
        completeContent.id = 'complete-tactics-content';
        completeContent.className = 'section-content';
        completeContent.style.display = 'none';
        const completeTacticsSelectorSection = createCompleteTacticsSelector();
        const completeButtonsSection = document.createElement('div');
        completeButtonsSection.className = 'action-buttons-section';
        const completeButtonsRow1 = document.createElement('div');
        completeButtonsRow1.className = 'action-buttons-row';
        const saveCompleteBtn = createButton('save_complete_tactic_button', USERSCRIPT_STRINGS.saveCompleteTacticButton, saveCompleteTactic);
        const loadCompleteBtn = createButton('load_complete_tactic_button', USERSCRIPT_STRINGS.loadCompleteTacticButton, loadCompleteTactic);
        const renameCompleteBtn = createButton('rename_complete_tactic_button', USERSCRIPT_STRINGS.renameCompleteTacticButton, editCompleteTactic);
        const updateCompleteBtn = createButton('update_complete_tactic_button', USERSCRIPT_STRINGS.updateCompleteTacticButton, updateCompleteTactic);
        const deleteCompleteBtn = createButton('delete_complete_tactic_button', USERSCRIPT_STRINGS.deleteCompleteTacticButton, deleteCompleteTactic);
        appendChildren(completeButtonsRow1, [saveCompleteBtn, loadCompleteBtn, renameCompleteBtn, updateCompleteBtn, deleteCompleteBtn]);
        const completeButtonsRow2 = document.createElement('div');
        completeButtonsRow2.className = 'action-buttons-row';
        const importCompleteBtn = createButton('import_complete_tactics_btn', USERSCRIPT_STRINGS.importCompleteTacticsButton, importCompleteTactics);
        const exportCompleteBtn = createButton('export_complete_tactics_btn', USERSCRIPT_STRINGS.exportCompleteTacticsButton, exportCompleteTactics);
        appendChildren(completeButtonsRow2, [importCompleteBtn, exportCompleteBtn]);
        appendChildren(completeButtonsSection, [completeButtonsRow1, completeButtonsRow2]);
        appendChildren(completeContent, [completeTacticsSelectorSection, completeButtonsSection, createCombinedInfoButton()]);
        group.appendChild(completeContent);

        return container;
    }

    function createHiddenTriggerButton() {
        const button = document.createElement('button');
        button.id = 'hidden_trigger_button';
        button.textContent = '';
        button.style.cssText = 'position:absolute; opacity:0; pointer-events:none; width:0; height:0; padding:0; margin:0; border:0;';
        button.addEventListener('click', function () {
            const presetSelect = document.getElementById('tactics_preset');
            if (presetSelect) {
                presetSelect.value = '5-3-2';
                presetSelect.dispatchEvent(new Event('change'));
            }
        });
        return button;
    }

    function setUpButton(button, id, text) {
        button.id = id;
        button.classList.add('mzbtn');
        button.textContent = text;
    }

    function createModalTabs(tabsConfig, modalBody) {
        const tabsContainer = document.createElement('div');
        tabsContainer.className = 'modal-tabs';
        tabsConfig.forEach((tab, index) => {
            const tabButton = document.createElement('button');
            tabButton.className = 'modal-tab';
            tabButton.textContent = tab.title;
            tabButton.dataset.tabId = tab.id;
            if (index === 0) tabButton.classList.add('active');
            tabButton.addEventListener('click', () => {
                modalBody.querySelectorAll('.modal-tab').forEach(t => t.classList.remove('active'));
                modalBody.querySelectorAll('.management-modal-content, .modal-tab-content').forEach(c => c.classList.remove('active'));
                tabButton.classList.add('active');
                const content = modalBody.querySelector(`.management-modal-content[data-tab-id="${tab.id}"], .modal-tab-content[data-tab-id="${tab.id}"]`);
                if (content) content.classList.add('active');
            });
            tabsContainer.appendChild(tabButton);
        });
        return tabsContainer;
    }

    function createTabbedModalContent(tabsConfig) {
        const wrapper = document.createElement('div');
        wrapper.className = 'modal-info-wrapper';
        const tabs = createModalTabs(tabsConfig, wrapper);
        wrapper.appendChild(tabs);
        tabsConfig.forEach((tab, index) => {
            const contentDiv = document.createElement('div');
            contentDiv.className = 'modal-tab-content';
            contentDiv.dataset.tabId = tab.id;
            if (index === 0) contentDiv.classList.add('active');
            const content = tab.contentGenerator();
            contentDiv.appendChild(content);
            wrapper.appendChild(contentDiv);
        });
        return wrapper;
    }

    function createAboutTabContent() {
        const content = document.createElement('div');
        const aboutSection = document.createElement('div');
        const aboutTitle = document.createElement('h3');
        aboutTitle.textContent = 'About';
        const infoText = document.createElement('p');
        infoText.id = 'info_modal_info_text';
        infoText.innerHTML = USERSCRIPT_STRINGS.modalContentInfoText;
        const feedbackText = document.createElement('p');
        feedbackText.id = 'info_modal_feedback_text';
        feedbackText.innerHTML = USERSCRIPT_STRINGS.modalContentFeedbackText;
        appendChildren(aboutSection, [aboutTitle, infoText, feedbackText]);
        content.appendChild(aboutSection);
        const faqSection = document.createElement('div');
        faqSection.className = 'faq-section';
        const faqTitle = document.createElement('h3');
        faqTitle.textContent = 'FAQ/Function Explanations';
        faqSection.appendChild(faqTitle);

        const formationItems = [
            { q: "<code>Add Current</code> Button (Formations Mode)", a: "Saves the player positions currently visible on the pitch as a new formation. You'll be prompted for a name, category, and an optional description." },
            { q: "<code>Add via XML</code> Button (Formations Mode)", a: "Allows pasting XML to add a new formation. Only player positions are saved from the XML. Prompted for name, category, and description." },
            { q: "Category Filter Dropdown & <code>⚙️</code> Button (Formations Mode)", a: "Use the dropdown to filter formations by category (your last selection is remembered). Click the gear icon (⚙️) to open the Management Modal (Formations & Categories)." },
            { q: "<code>Edit</code> Button (Formations Mode)", a: "Allows renaming the selected formation, changing its assigned category, and editing its description via a popup." },
            { q: "<code>Update Coords</code> Button (Formations Mode)", a: "Updates the coordinates of the selected formation to match the current player positions on the pitch (description and category remain unchanged)." },
            { q: "<code>Delete</code> Button (Formations Mode)", a: "Permanently removes the selected formation from the storage." },
            { q: "<code>Import</code> Button (Formations Mode)", a: "Imports multiple formations from a JSON text format. Merges with existing formations (updates name/category/description if ID matches)." },
            { q: "<code>Export</code> Button (Formations Mode)", a: "Exports all saved formations (including descriptions) into a JSON text format (copied to clipboard)." },
            { q: "<code>Reset</code> Button (Formations Mode)", a: "Deletes all saved formations and custom categories, restoring defaults. Also resets the saved category filter." },
            { q: "<code>Clear</code> Button (Formations Mode)", a: "Deletes all saved formations. Also resets the saved category filter." },
            { q: "Management Modal (Gear Icon ⚙️)", a: "Opens a dedicated window to manage formations (edit name/description/category, delete) and categories (add, remove) in bulk." },
            { q: "Preview on Hover (Formations Mode)", a: "Hover your mouse over a formation name in the dropdown list to see its numerical formation (e.g., 4-4-2) and its description in a small pop-up." }
        ];

        const tacticItems = [
            { q: "<code>Save Current</code> Button (Tactics Mode)", a: "Exports the entire current tactic setup (positions, alts, rules, settings) using MZ's native export, parses it, prompts for a name and description, then saves it as a new complete tactic." },
            { q: "<code>Load</code> Button (Tactics Mode)", a: "Loads a saved complete tactic using MZ's native import. Shows a spinner during load. Matches players or substitutes if needed. Updates everything on the pitch." },
            { q: "<code>Rename</code> Button (Tactics Mode)", a: "Allows renaming the selected complete tactic and editing its description via a popup." },
            { q: "<code>Update with Current</code> Button (Tactics Mode)", a: "Overwrites the selected complete tactic's positions, rules, and settings with the setup currently on the pitch (using native export). The existing description is kept." },
            { q: "<code>Delete</code> Button (Tactics Mode)", a: "Permanently removes the selected complete tactic." },
            { q: "<code>Import</code> Button (Tactics Mode)", a: "Imports multiple complete tactics from a JSON text format. Merges with existing tactics, overwriting any with the same name (including description)." },
            { q: "<code>Export</code> Button (Tactics Mode)", a: "Exports all saved complete tactics (including descriptions) into a JSON text format (copied to clipboard)." },
            { q: "Preview on Hover (Tactics Mode)", a: "Hover your mouse over a tactic name in the dropdown list to see its numerical formation (e.g., 5-3-2, based on initial positions) and its description in a small pop-up." }
        ];

        const combinedItems = [...formationItems, ...tacticItems].sort((a, b) => {
            const modeA = a.q.includes("Formations Mode") || a.q.includes("Category Filter") || a.q.includes("Management Modal") ? 0 : (a.q.includes("Tactics Mode") ? 1 : 2);
            const modeB = b.q.includes("Formations Mode") || b.q.includes("Category Filter") || b.q.includes("Management Modal") ? 0 : (b.q.includes("Tactics Mode") ? 1 : 2);
            if (modeA !== modeB) return modeA - modeB;
            return a.q.localeCompare(b.q);
        });

        combinedItems.forEach(item => {
            const faqItemDiv = document.createElement('div');
            faqItemDiv.className = 'faq-item';
            const question = document.createElement('h4');
            question.innerHTML = item.q;
            const answer = document.createElement('p');
            answer.textContent = item.a;
            appendChildren(faqItemDiv, [question, answer]);
            faqSection.appendChild(faqItemDiv);
        });
        content.appendChild(faqSection);
        return content;
    }

    function createLinksTabContent() {
        const content = document.createElement('div');
        const linksSection = document.createElement('div');
        const linksTitle = document.createElement('h3');
        linksTitle.textContent = 'Useful Links';
        const resourcesText = createUsefulContent();
        const linksMap = new Map([
            ['gewlaht - BoooM', 'https://www.managerzone.com/?p=forum&sub=topic&topic_id=11415137&forum_id=49&sport=soccer'],
            ['taktikskola by honken91', 'https://www.managerzone.com/?p=forum&sub=topic&topic_id=12653892&forum_id=4&sport=soccer'],
            ['peto - mix de dibujos', 'https://www.managerzone.com/?p=forum&sub=topic&topic_id=12196312&forum_id=255&sport=soccer'],
            ['The Zone Chile', 'https://www.managerzone.com/thezone/paper.php?paper_id=18036&page=9&sport=soccer'],
            ['Tactics guide by lukasz87o/filipek4', 'https://www.managerzone.com/?p=forum&sub=topic&topic_id=12766444&forum_id=12&sport=soccer&share_sport=soccer'],
            ['MZExtension/van.mz.playerAdvanced by vanjoge', 'https://greasyfork.org/en/scripts/373382-van-mz-playeradvanced'],
            ['Mazyar Userscript', 'https://greasyfork.org/en/scripts/476290-mazyar'],
            ['Stats Xente Userscript', 'https://greasyfork.org/en/scripts/491442-stats-xente-script'],
            ['More userscripts', 'https://greasyfork.org/en/users/1088808-douglasdotv']
        ]);
        const linksList = createLinksList(linksMap);
        appendChildren(linksSection, [linksTitle, resourcesText, linksList]);
        content.appendChild(linksSection);
        return content;
    }

    function createCombinedInfoButton() {
        const button = createButton('info_button', USERSCRIPT_STRINGS.infoButton, null);
        button.classList.add('footer-actions');
        button.style.background = 'transparent';
        button.style.border = 'none';
        button.style.boxShadow = 'none';
        button.style.fontFamily = '"Quicksand", sans-serif';
        button.style.color = 'gold';
        button.addEventListener('click', (e) => {
            e.stopPropagation();
            const tabsConfig = [{
                id: 'about',
                title: 'About & FAQ',
                contentGenerator: createAboutTabContent
            }, {
                id: 'links',
                title: 'Useful Links',
                contentGenerator: createLinksTabContent
            }];
            const modalContent = createTabbedModalContent(tabsConfig);
            showAlert({
                title: 'MZ Tactics Manager Info',
                htmlContent: modalContent,
                confirmButtonText: DEFAULT_MODAL_STRINGS.ok
            });
        });
        return button;
    }

    function createUsefulContent() {
        const p = document.createElement('p');
        p.id = 'useful_content';
        p.textContent = USERSCRIPT_STRINGS.usefulContent;
        return p;
    }

    function createLinksList(linksMap) {
        const list = document.createElement('ul');
        linksMap.forEach((href, text) => {
            const listItem = document.createElement('li');
            const anchor = document.createElement('a');
            anchor.href = href;
            anchor.target = '_blank';
            anchor.rel = 'noopener noreferrer';
            anchor.textContent = text;
            listItem.appendChild(anchor);
            list.appendChild(listItem);
        });
        return list;
    }

    function createToggleButton() {
        const button = document.createElement('button');
        button.id = 'toggle_panel_btn';
        button.innerHTML = '✕';
        button.title = 'Hide panel';
        return button;
    }

    function createCollapsedIcon() {
        const icon = document.createElement('div');
        icon.id = 'collapsed_icon';
        icon.innerHTML = 'TM';
        icon.title = 'Show MZ Tactics Manager';
        collapsedIconElement = icon;
        return icon;
    }

    async function initializeUsData() {
        loadCategories();
        currentFilter = GM_getValue(CATEGORY_FILTER_STORAGE_KEY, 'all');
        const ids = await fetchTeamIdAndUsername();
        if (!ids.teamId) {
            console.warn("Failed to get Team ID.");
        }

        tactics = [];

        const rawTacticDataFromStorage = GM_getValue(FORMATIONS_STORAGE_KEY);
        const oldRawTacticDataFromStorage = GM_getValue(OLD_FORMATIONS_STORAGE_KEY);

        if (!rawTacticDataFromStorage && oldRawTacticDataFromStorage && oldRawTacticDataFromStorage.tactics && Array.isArray(oldRawTacticDataFromStorage.tactics)) {
            console.log(`Migrating tactics from old storage key '${OLD_FORMATIONS_STORAGE_KEY}' to '${FORMATIONS_STORAGE_KEY}'.`);
            let migratedTactics = oldRawTacticDataFromStorage.tactics.filter(t => t && t.name && t.id && Array.isArray(t.coordinates));
            migratedTactics.forEach(t => {
                if (!t.hasOwnProperty('style')) t.style = OTHER_CATEGORY_ID;
                if (!t.hasOwnProperty('description')) t.description = '';
            });
            tactics = migratedTactics;
            await GM_setValue(FORMATIONS_STORAGE_KEY, { tactics: tactics });
            await GM_deleteValue(OLD_FORMATIONS_STORAGE_KEY);
            console.log(`Migration complete. Deleted old key '${OLD_FORMATIONS_STORAGE_KEY}'.`);
        } else if (!rawTacticDataFromStorage) {
            console.log("No existing formations data found. Loading initial default formations.");
            await loadInitialTacticsAndCategories();
        } else {
            if (!rawTacticDataFromStorage.tactics || !Array.isArray(rawTacticDataFromStorage.tactics)) {
                rawTacticDataFromStorage.tactics = [];
            }
            let loadedTactics = rawTacticDataFromStorage.tactics.filter(t => t && t.name && t.id && Array.isArray(t.coordinates));
            let dataWasChangedDuringValidation = false;
            loadedTactics.forEach(t => {
                if (!t.hasOwnProperty('style')) {
                    t.style = OTHER_CATEGORY_ID;
                    dataWasChangedDuringValidation = true;
                }
                if (!t.hasOwnProperty('description')) {
                    t.description = '';
                    dataWasChangedDuringValidation = true;
                }
            });
            if (dataWasChangedDuringValidation) {
                await GM_setValue(FORMATIONS_STORAGE_KEY, { tactics: loadedTactics });
            }
            tactics = loadedTactics;
        }

        tactics.sort((a, b) => a.name.localeCompare(b.name));

        loadCompleteTacticsData();
        const storedCompleteTactics = GM_getValue(COMPLETE_TACTICS_STORAGE_KEY, {});
        let completeTacticsChanged = false;
        for (const name in storedCompleteTactics) {
            if (storedCompleteTactics.hasOwnProperty(name)) {
                if (storedCompleteTactics[name] && typeof storedCompleteTactics[name] === 'object' && !storedCompleteTactics[name].hasOwnProperty('description')) {
                    storedCompleteTactics[name].description = '';
                    completeTacticsChanged = true;
                }
            }
        }
        if (completeTacticsChanged) {
            GM_setValue(COMPLETE_TACTICS_STORAGE_KEY, storedCompleteTactics);
        }
        completeTactics = storedCompleteTactics;

        await checkVersion();
    }

    function setUpTacticsInterface(mainContainer) {
        const toggleButton = mainContainer.querySelector('#toggle_panel_btn');
        const collapsedIcon = collapsedIconElement || createCollapsedIcon();
        let isCollapsed = GM_getValue(COLLAPSED_KEY, false);
        const anchorButtonId = 'replace-player-btn';
        const applyCollapseState = (instant = false) => {
            const anchorButton = document.getElementById(anchorButtonId);
            if (collapsedIcon && collapsedIcon.parentNode) {
                collapsedIcon.parentNode.removeChild(collapsedIcon);
            }
            if (isCollapsed) {
                if (instant) {
                    mainContainer.style.transition = 'none';
                    mainContainer.classList.add('collapsed');
                    void mainContainer.offsetHeight;
                    mainContainer.style.transition = '';
                } else {
                    mainContainer.classList.add('collapsed');
                }
                toggleButton.innerHTML = '☰';
                toggleButton.title = 'Show panel';
                if (anchorButton) {
                    insertAfterElement(collapsedIcon, anchorButton);
                    collapsedIcon.classList.add('visible');
                } else {
                    console.warn(`Anchor button #${anchorButtonId} not found.`);
                    collapsedIcon.classList.remove('visible');
                }
            } else {
                mainContainer.classList.remove('collapsed');
                toggleButton.innerHTML = '✕';
                toggleButton.title = 'Hide panel';
                collapsedIcon.classList.remove('visible');
            }
        };
        applyCollapseState(true);

        function togglePanel() {
            isCollapsed = !isCollapsed;
            GM_setValue(COLLAPSED_KEY, isCollapsed);
            applyCollapseState();
        }
        toggleButton.addEventListener('click', (e) => {
            e.stopPropagation();
            togglePanel();
        });
        collapsedIcon.addEventListener('click', () => {
            togglePanel();
        });
    }

    async function initialize() {
        const tacticsBox = document.getElementById('tactics_box');
        if (!tacticsBox || !isFootball()) {
            console.log("Tactics box not found/Invalid page.");
            return;
        }
        const cachedUserInfo = GM_getValue(USER_INFO_CACHE_KEY);
        if (cachedUserInfo && typeof cachedUserInfo === 'object' && cachedUserInfo.teamId && cachedUserInfo.username && cachedUserInfo.timestamp) {
            userInfoCache = cachedUserInfo;
            if (Date.now() - userInfoCache.timestamp < USER_INFO_CACHE_DURATION_MS) {
                teamId = userInfoCache.teamId;
                username = userInfoCache.username;
            }
        }
        const cachedRoster = GM_getValue(ROSTER_CACHE_KEY);
        if (cachedRoster && typeof cachedRoster === 'object' && cachedRoster.data && cachedRoster.timestamp) {
            rosterCache = cachedRoster;
        }
        try {
            collapsedIconElement = createCollapsedIcon();
            createTacticPreviewElement();
            await initializeUsData();
            const mainContainer = createMainContainer();
            setUpTacticsInterface(mainContainer);
            insertAfterElement(mainContainer, tacticsBox);
            updateTacticsDropdown();
            updateCategoryFilterDropdown();
            updateCompleteTacticsDropdown();
            const savedMode = GM_getValue(VIEW_MODE_KEY, 'normal');
            setViewMode(savedMode);
        } catch (error) {
            console.error(error);
            const errorDiv = document.createElement('div');
            errorDiv.textContent = 'Error initializing MZ Tactics Manager! Check console for details.';
            errorDiv.style.cssText = 'color:red; padding:10px; border:1px solid red; margin:10px;';
            insertAfterElement(errorDiv, tacticsBox);
        }
    }

    window.addEventListener('load', initialize);
})();
