// ==UserScript==
// @name Flow Youtube Chat
// @description Youtubeのチャットをニコニコ風に画面上へ流す(再アップ) Make youtube chats move in danmaku-style.
// @version 1.19.2
// @match https://www.youtube.com/*
// @grant GM.setValue
// @grant GM.getValue
// @grant GM.deleteValue
// @grant GM.listValues
// @grant GM.setClipboard
// @license AGPL-3.0-or-later
// @namespace FlowYoutubeChatScript
// @noframes
// @require https://unpkg.com/rxjs@7.8.1/dist/bundles/rxjs.umd.min.js#sha384-Opyi337NBU4M11Xx1aRUN4dZejlRWsq277uHWHyysNm4frJzmqu7KvgkHu4YWTqk
// @require https://cdn.jsdelivr.net/npm/deep-diff@1.0.2/dist/deep-diff.min.js#sha384-0Ywk0zro7cwc1qs9cJjyGhLbEzWPL9Qw4toVNrYtqHTL7kboLNyhePWOiLBb0lUj
// @require https://cdn.jsdelivr.net/npm/astring@1.8.6/dist/astring.min.js#sha384-/CFO1wx9JFmRDs/KY6V6kvOw79jr7O9zoMW3bKOSQtpK1+QLsT0I1j6fav8u8vvM
// @require https://cdn.jsdelivr.net/npm/jsep@1.3.9/dist/iife/jsep.iife.min.js#sha384-CFM0Dwr/nycUHzB5IWL+HEB2vghQhbUc4NJqz3UCdk+Hu7WpOuFktcvVexJbc4Od
// @require https://cdn.jsdelivr.net/npm/hash-it@6.0.0/dist/min/index.js#sha384-kqUFMXizyaodUGfm0UszFxndXukhSB/yEpOt+q9w/RgjyOK0wz9gXoEYb2FW1/ex
// @require https://cdn.jsdelivr.net/npm/micro-memoize@4.1.2/dist/micro-memoize.min.js#sha384-W1hqD6GTNQ97ZqDR18GhfU1G9qcDLs4sL7BPYND2ncvGNNiLUmUp37Ph+hzm+OPt
// @require https://cdn.jsdelivr.net/npm/lz-string@1.5.0/libs/lz-string.min.js#sha384-0d+Gr7vM4Drod8E3hXKgciWJSWbjD/opKLLygI9ktiWbuvlDwQLzU46wJ9s5gsp7
// @run-at document-end
// @downloadURL https://update.greasyfork.org/scripts/411442/Flow%20Youtube%20Chat.user.js
// @updateURL https://update.greasyfork.org/scripts/411442/Flow%20Youtube%20Chat.meta.js
// ==/UserScript==

/*! For license information please see index.js.LICENSE.txt */
/* jshint esversion: 6 */

;(() => {
	var __webpack_modules__ = {
			371: module => {
				"use strict"
				module.exports = function equal(a, b) {
					if (a === b) return !0
					if (a && b && "object" == typeof a && "object" == typeof b) {
						if (a.constructor !== b.constructor) return !1
						var length, i, keys
						if (Array.isArray(a)) {
							if ((length = a.length) != b.length) return !1
							for (i = length; 0 != i--; ) if (!equal(a[i], b[i])) return !1
							return !0
						}
						if (a.constructor === RegExp)
							return a.source === b.source && a.flags === b.flags
						if (a.valueOf !== Object.prototype.valueOf)
							return a.valueOf() === b.valueOf()
						if (a.toString !== Object.prototype.toString)
							return a.toString() === b.toString()
						if (
							(length = (keys = Object.keys(a)).length) !==
							Object.keys(b).length
						)
							return !1
						for (i = length; 0 != i--; )
							if (!Object.prototype.hasOwnProperty.call(b, keys[i])) return !1
						for (i = length; 0 != i--; ) {
							var key = keys[i]
							if (!equal(a[key], b[key])) return !1
						}
						return !0
					}
					return a != a && b != b
				}
			},
			742: module => {
				module.exports = (function (e) {
					var r = {}
					function t(n) {
						if (r[n]) return r[n].exports
						var a = (r[n] = { i: n, l: !1, exports: {} })
						return e[n].call(a.exports, a, a.exports, t), (a.l = !0), a.exports
					}
					return (
						(t.m = e),
						(t.c = r),
						(t.d = function (e, r, n) {
							t.o(e, r) ||
								Object.defineProperty(e, r, { enumerable: !0, get: n })
						}),
						(t.r = function (e) {
							"undefined" != typeof Symbol &&
								Symbol.toStringTag &&
								Object.defineProperty(e, Symbol.toStringTag, {
									value: "Module",
								}),
								Object.defineProperty(e, "__esModule", { value: !0 })
						}),
						(t.t = function (e, r) {
							if ((1 & r && (e = t(e)), 8 & r)) return e
							if (4 & r && "object" == typeof e && e && e.__esModule) return e
							var n = Object.create(null)
							if (
								(t.r(n),
								Object.defineProperty(n, "default", {
									enumerable: !0,
									value: e,
								}),
								2 & r && "string" != typeof e)
							)
								for (var a in e)
									t.d(
										n,
										a,
										function (r) {
											return e[r]
										}.bind(null, a),
									)
							return n
						}),
						(t.n = function (e) {
							var r =
								e && e.__esModule
									? function () {
											return e.default
										}
									: function () {
											return e
										}
							return t.d(r, "a", r), r
						}),
						(t.o = function (e, r) {
							return Object.prototype.hasOwnProperty.call(e, r)
						}),
						(t.p = ""),
						t((t.s = 0))
					)
				})([
					function (e, r, t) {
						"use strict"
						t.r(r),
							t.d(r, "validateHTMLColorName", function () {
								return l
							}),
							t.d(r, "validateHTMLColorSpecialName", function () {
								return i
							}),
							t.d(r, "validateHTMLColorHex", function () {
								return u
							}),
							t.d(r, "validateHTMLColorRgb", function () {
								return g
							}),
							t.d(r, "validateHTMLColorHsl", function () {
								return y
							}),
							t.d(r, "validateHTMLColorHwb", function () {
								return L
							}),
							t.d(r, "validateHTMLColorLab", function () {
								return S
							}),
							t.d(r, "validateHTMLColorLch", function () {
								return m
							}),
							t.d(r, "validateHTMLColor", function () {
								return G
							})
						const n = e => e && "string" == typeof e,
							a = [
								"AliceBlue",
								"AntiqueWhite",
								"Aqua",
								"Aquamarine",
								"Azure",
								"Beige",
								"Bisque",
								"Black",
								"BlanchedAlmond",
								"Blue",
								"BlueViolet",
								"Brown",
								"BurlyWood",
								"CadetBlue",
								"Chartreuse",
								"Chocolate",
								"Coral",
								"CornflowerBlue",
								"Cornsilk",
								"Crimson",
								"Cyan",
								"DarkBlue",
								"DarkCyan",
								"DarkGoldenrod",
								"DarkGray",
								"DarkGrey",
								"DarkGreen",
								"DarkKhaki",
								"DarkMagenta",
								"DarkOliveGreen",
								"DarkOrange",
								"DarkOrchid",
								"DarkRed",
								"DarkSalmon",
								"DarkSeaGreen",
								"DarkSlateBlue",
								"DarkSlateGray",
								"DarkSlateGrey",
								"DarkTurquoise",
								"DarkViolet",
								"DeepPink",
								"DeepSkyBlue",
								"DimGray",
								"DimGrey",
								"DodgerBlue",
								"FireBrick",
								"FloralWhite",
								"ForestGreen",
								"Fuchsia",
								"Gainsboro",
								"GhostWhite",
								"Gold",
								"Goldenrod",
								"Gray",
								"Grey",
								"Green",
								"GreenYellow",
								"HoneyDew",
								"HotPink",
								"IndianRed",
								"Indigo",
								"Ivory",
								"Khaki",
								"Lavender",
								"LavenderBlush",
								"LawnGreen",
								"LemonChiffon",
								"LightBlue",
								"LightCoral",
								"LightCyan",
								"LightGoldenrodYellow",
								"LightGray",
								"LightGrey",
								"LightGreen",
								"LightPink",
								"LightSalmon",
								"LightSalmon",
								"LightSeaGreen",
								"LightSkyBlue",
								"LightSlateGray",
								"LightSlateGrey",
								"LightSteelBlue",
								"LightYellow",
								"Lime",
								"LimeGreen",
								"Linen",
								"Magenta",
								"Maroon",
								"MediumAquamarine",
								"MediumBlue",
								"MediumOrchid",
								"MediumPurple",
								"MediumSeaGreen",
								"MediumSlateBlue",
								"MediumSlateBlue",
								"MediumSpringGreen",
								"MediumTurquoise",
								"MediumVioletRed",
								"MidnightBlue",
								"MintCream",
								"MistyRose",
								"Moccasin",
								"NavajoWhite",
								"Navy",
								"OldLace",
								"Olive",
								"OliveDrab",
								"Orange",
								"OrangeRed",
								"Orchid",
								"PaleGoldenrod",
								"PaleGreen",
								"PaleTurquoise",
								"PaleVioletRed",
								"PapayaWhip",
								"PeachPuff",
								"Peru",
								"Pink",
								"Plum",
								"PowderBlue",
								"Purple",
								"RebeccaPurple",
								"Red",
								"RosyBrown",
								"RoyalBlue",
								"SaddleBrown",
								"Salmon",
								"SandyBrown",
								"SeaGreen",
								"SeaShell",
								"Sienna",
								"Silver",
								"SkyBlue",
								"SlateBlue",
								"SlateGray",
								"SlateGrey",
								"Snow",
								"SpringGreen",
								"SteelBlue",
								"Tan",
								"Teal",
								"Thistle",
								"Tomato",
								"Turquoise",
								"Violet",
								"Wheat",
								"White",
								"WhiteSmoke",
								"Yellow",
								"YellowGreen",
							],
							o = ["currentColor", "inherit", "transparent"],
							l = e => {
								let r = !1
								return (
									n(e) &&
										a.map(
											t => (
												e.toLowerCase() === t.toLowerCase() && (r = !0), null
											),
										),
									r
								)
							},
							i = e => {
								let r = !1
								return (
									n(e) &&
										o.map(
											t => (
												e.toLowerCase() === t.toLowerCase() && (r = !0), null
											),
										),
									r
								)
							},
							u = e =>
								!!n(e) &&
								e &&
								/^#([\da-f]{3}){1,2}$|^#([\da-f]{4}){1,2}$/i.test(e),
							d = "(([\\d]{0,5})((\\.([\\d]{1,5}))?))",
							s = `(${d}%)`,
							c = "(([0-9]|[1-9][0-9]|100)%)",
							f = `(${c}|(0?((\\.([\\d]{1,5}))?))|1)`,
							h = `([\\s]{0,5})\\)?)(([\\s]{0,5})(\\/?)([\\s]{1,5})(((${c}))|(0?((\\.([\\d]{1,5}))?))|1))?([\\s]{0,5})\\)`,
							$ =
								"(-?(([0-9]|[1-9][0-9]|1[0-9][0-9]|2[0-9][0-9]|3[0-5][0-9])((\\.([\\d]{1,5}))?)|360)(deg)?)",
							g = e => {
								if (n(e)) {
									const r = "([\\s]{0,5})([\\d]{1,5})%?([\\s]{0,5}),?",
										t = "((([\\s]{0,5}),?([\\s]{0,5}))|(([\\s]{1,5})))",
										n = new RegExp(
											`^(rgb)a?\\(${r}${t}${r}${t}${r}${t}((\\/?([\\s]{0,5})(0?\\.?([\\d]{1,5})%?([\\s]{0,5}))?|1|0))?\\)$`,
										)
									return e && n.test(e)
								}
								return !1
							},
							y = e => {
								if (n(e)) {
									const r = new RegExp(
										`^(hsl)a?\\((([\\s]{0,5})(${$}|(([0-9]|[1-9][0-9]|1[0-9][0-9]|2[0-9][0-9]|3[0-9][0-9]|400)grad)|((([0-5])?\\.([\\d]{1,5})|6\\.([0-9]|1[0-9]|2[0-8])|[0-6])rad)|((0?((\\.([\\d]{1,5}))?)|1)turn))((([\\s]{0,5}),([\\s]{0,5}))|(([\\s]{1,5}))))(([\\s]{0,5})(0|${c})((([\\s]{0,5}),([\\s]{0,5}))|(([\\s]{1,5}))))(([\\s]{0,5})(0|${c})([\\s]{0,5})\\)?)(([\\s]{0,5})(\\/?|,?)([\\s]{0,5})(((${c}))|(0?((\\.([\\d]{1,5}))?))|1))?\\)$`,
									)
									return e && r.test(e)
								}
								return !1
							},
							L = e => {
								if (n(e)) {
									const r = new RegExp(
										`^(hwb\\(([\\s]{0,5})${$}([\\s]{1,5}))((0|${c})([\\s]{1,5}))((0|${c})${h}$`,
									)
									return e && r.test(e)
								}
								return !1
							},
							S = e => {
								if (n(e)) {
									const r =
											"(-?(([0-9]|[1-9][0-9]|1[0-5][0-9])((\\.([\\d]{1,5}))?)?|160))",
										t = new RegExp(
											`^(lab\\(([\\s]{0,5})${s}([\\s]{1,5})${r}([\\s]{1,5})${r}${h}$`,
										)
									return e && t.test(e)
								}
								return !1
							},
							m = e => {
								if (n(e)) {
									const o = new RegExp(
										`^lch\\((([\\s]{0,5})((([0-9]|[1-9][0-9])?((\\.([\\d]{1,5}))?)|100)(%)?)([\\s]{1,5})${"" + d}([\\s]{1,5})((${$})|(0|${f})|(([0-9]|[1-9][0-9]|1[0-9][0-9]|2[0-9][0-9]|3[0-5][0-9])((\\.([\\d]{1,5}))?)|360))([\\s]{0,5})((\\/([\\s]{0,5})${f}))?)\\)$`,
									)
									return e && o.test(e)
								}
								return !1
							},
							G = e => !!((e && u(e)) || g(e) || y(e) || L(e) || S(e) || m(e))
						r.default = e =>
							!!(
								(e && u(e)) ||
								l(e) ||
								i(e) ||
								g(e) ||
								y(e) ||
								L(e) ||
								S(e) ||
								m(e)
							)
					},
				])
			},
		},
		__webpack_module_cache__ = {}
	function __webpack_require__(moduleId) {
		var cachedModule = __webpack_module_cache__[moduleId]
		if (void 0 !== cachedModule) return cachedModule.exports
		var module = (__webpack_module_cache__[moduleId] = { exports: {} })
		__webpack_modules__[moduleId](module, module.exports, __webpack_require__)
		return module.exports
	}
	__webpack_require__.n = module => {
		var getter =
			module && module.__esModule ? () => module.default : () => module
		__webpack_require__.d(getter, { a: getter })
		return getter
	}
	__webpack_require__.d = (exports, definition) => {
		for (var key in definition)
			__webpack_require__.o(definition, key) &&
				!__webpack_require__.o(exports, key) &&
				Object.defineProperty(exports, key, {
					enumerable: !0,
					get: definition[key],
				})
	}
	__webpack_require__.o = (obj, prop) =>
		Object.prototype.hasOwnProperty.call(obj, prop)
	;(() => {
		"use strict"
		const Function_dual = function (arity, body) {
				if ("function" == typeof arity)
					return function () {
						return arity(arguments)
							? body.apply(this, arguments)
							: self => body(self, ...arguments)
					}
				switch (arity) {
					case 0:
					case 1:
						throw new RangeError(`Invalid arity ${arity}`)
					case 2:
						return function (a, b) {
							return arguments.length >= 2
								? body(a, b)
								: function (self) {
										return body(self, a)
									}
						}
					case 3:
						return function (a, b, c) {
							return arguments.length >= 3
								? body(a, b, c)
								: function (self) {
										return body(self, a, b)
									}
						}
					case 4:
						return function (a, b, c, d) {
							return arguments.length >= 4
								? body(a, b, c, d)
								: function (self) {
										return body(self, a, b, c)
									}
						}
					case 5:
						return function (a, b, c, d, e) {
							return arguments.length >= 5
								? body(a, b, c, d, e)
								: function (self) {
										return body(self, a, b, c, d)
									}
						}
					default:
						return function () {
							if (arguments.length >= arity) return body.apply(this, arguments)
							const args = arguments
							return function (self) {
								return body(self, ...args)
							}
						}
				}
			},
			apply = a => self => self(a),
			Function_identity = a => a,
			constant = value => () => value,
			Function_constTrue = constant(!0),
			constFalse = constant(!1),
			Function_constUndefined = constant(void 0),
			Function_constVoid = Function_constUndefined,
			flip =
				f =>
				(...b) =>
				(...a) =>
					f(...a)(...b)
		function Function_pipe(a, ab, bc, cd, de, ef, fg, gh, hi) {
			switch (arguments.length) {
				case 1:
					return a
				case 2:
					return ab(a)
				case 3:
					return bc(ab(a))
				case 4:
					return cd(bc(ab(a)))
				case 5:
					return de(cd(bc(ab(a))))
				case 6:
					return ef(de(cd(bc(ab(a)))))
				case 7:
					return fg(ef(de(cd(bc(ab(a))))))
				case 8:
					return gh(fg(ef(de(cd(bc(ab(a)))))))
				case 9:
					return hi(gh(fg(ef(de(cd(bc(ab(a))))))))
				default: {
					let ret = arguments[0]
					for (let i = 1; i < arguments.length; i++) ret = arguments[i](ret)
					return ret
				}
			}
		}
		const getCurrentVersion = () => "3.5.7",
			globalStoreId = Symbol.for(
				`effect/GlobalValue/globalStoreId/${getCurrentVersion()}`,
			)
		globalStoreId in globalThis || (globalThis[globalStoreId] = new Map())
		const globalStore = globalThis[globalStoreId],
			globalValue = (id, compute) => {
				globalStore.has(id) || globalStore.set(id, compute())
				return globalStore.get(id)
			},
			isTruthy = input => !!input,
			isString = input => "string" == typeof input,
			isNumber = input => "number" == typeof input,
			Predicate_isBoolean = input => "boolean" == typeof input,
			isBigInt = input => "bigint" == typeof input,
			isSymbol = input => "symbol" == typeof input,
			Predicate_isFunction = input => "function" == typeof input,
			isUndefined = input => void 0 === input,
			isNever = _ => !1,
			isRecordOrArray = input => "object" == typeof input && null !== input,
			Predicate_isObject = input =>
				isRecordOrArray(input) || Predicate_isFunction(input),
			Predicate_hasProperty = Function_dual(
				2,
				(self, property) => Predicate_isObject(self) && property in self,
			),
			Predicate_isTagged = Function_dual(
				2,
				(self, tag) => Predicate_hasProperty(self, "_tag") && self._tag === tag,
			),
			isNullable = input => null == input,
			isNotNullable = input => null != input,
			Predicate_isIterable = input =>
				Predicate_hasProperty(input, Symbol.iterator),
			isRecord = input => isRecordOrArray(input) && !Array.isArray(input),
			not = self => a => !self(a),
			getBugErrorMessage = message =>
				`BUG: ${message} - please report an issue at https://github.com/Effect-TS/effect/issues`
		Symbol.iterator
		class SingleShotGen {
			self
			called = !1
			constructor(self) {
				this.self = self
			}
			next(a) {
				return this.called
					? { value: a, done: !0 }
					: ((this.called = !0), { value: this.self, done: !1 })
			}
			return(a) {
				return { value: a, done: !0 }
			}
			throw(e) {
				throw e
			}
			[Symbol.iterator]() {
				return new SingleShotGen(this.self)
			}
		}
		class PCGRandom {
			_state
			constructor(seedHi, seedLo, incHi, incLo) {
				if (isNullable(seedLo) && isNullable(seedHi)) {
					seedLo = (4294967295 * Math.random()) >>> 0
					seedHi = 0
				} else if (isNullable(seedLo)) {
					seedLo = seedHi
					seedHi = 0
				}
				if (isNullable(incLo) && isNullable(incHi)) {
					incLo = this._state ? this._state[3] : 4150755663
					incHi = this._state ? this._state[2] : 335903614
				} else if (isNullable(incLo)) {
					incLo = incHi
					incHi = 0
				}
				this._state = new Int32Array([
					0,
					0,
					incHi >>> 0,
					(1 | (incLo || 0)) >>> 0,
				])
				this._next()
				add64(
					this._state,
					this._state[0],
					this._state[1],
					seedHi >>> 0,
					seedLo >>> 0,
				)
				this._next()
				return this
			}
			getState() {
				return [this._state[0], this._state[1], this._state[2], this._state[3]]
			}
			setState(state) {
				this._state[0] = state[0]
				this._state[1] = state[1]
				this._state[2] = state[2]
				this._state[3] = 1 | state[3]
			}
			integer(max) {
				if (!max) return this._next()
				if (0 == ((max >>>= 0) & (max - 1))) return this._next() & (max - 1)
				let num = 0
				const skew = (-max >>> 0) % max >>> 0
				for (num = this._next(); num < skew; num = this._next());
				return num % max
			}
			number() {
				return (
					(1 * (67108863 & this._next()) * 134217728 +
						1 * (134217727 & this._next())) /
					9007199254740992
				)
			}
			_next() {
				const oldHi = this._state[0] >>> 0,
					oldLo = this._state[1] >>> 0
				!(function (out, aHi, aLo, bHi, bLo) {
					let c1 = (32557 * (aLo >>> 16)) >>> 0,
						c0 = (19605 * (65535 & aLo)) >>> 0,
						lo = (32557 * (65535 & aLo)) >>> 0,
						hi = (19605 * (aLo >>> 16) + ((c0 >>> 16) + (c1 >>> 16))) >>> 0
					c0 = (c0 << 16) >>> 0
					lo = (lo + c0) >>> 0
					lo >>> 0 < c0 >>> 0 && (hi = (hi + 1) >>> 0)
					c1 = (c1 << 16) >>> 0
					lo = (lo + c1) >>> 0
					lo >>> 0 < c1 >>> 0 && (hi = (hi + 1) >>> 0)
					hi = (hi + Math.imul(aLo, 1481765933)) >>> 0
					hi = (hi + Math.imul(aHi, 1284865837)) >>> 0
					out[0] = hi
					out[1] = lo
				})(this._state, oldHi, oldLo)
				add64(
					this._state,
					this._state[0],
					this._state[1],
					this._state[2],
					this._state[3],
				)
				let xsHi = oldHi >>> 18,
					xsLo = ((oldLo >>> 18) | (oldHi << 14)) >>> 0
				xsHi = (xsHi ^ oldHi) >>> 0
				xsLo = (xsLo ^ oldLo) >>> 0
				const xorshifted = ((xsLo >>> 27) | (xsHi << 5)) >>> 0,
					rot = oldHi >>> 27
				return (
					((xorshifted >>> rot) |
						(xorshifted << (((-rot >>> 0) & 31) >>> 0))) >>>
					0
				)
			}
		}
		function add64(out, aHi, aLo, bHi, bLo) {
			let hi = (aHi + bHi) >>> 0
			const lo = (aLo + bLo) >>> 0
			lo >>> 0 < aLo >>> 0 && (hi = (hi + 1) | 0)
			out[0] = hi
			out[1] = lo
		}
		const YieldWrapTypeId = Symbol.for("effect/Utils/YieldWrap")
		class YieldWrap {
			#value
			constructor(value) {
				this.#value = value
			}
			[YieldWrapTypeId]() {
				return this.#value
			}
		}
		const structuralRegionState = globalValue(
				"effect/Utils/isStructuralRegion",
				() => ({ enabled: !1, tester: void 0 }),
			),
			internalCall = (name => {
				const wrap = { [name]: body => body() }
				return function (fn) {
					return wrap[name](fn)
				}
			})("effect_internal_function"),
			randomHashCache = globalValue(
				Symbol.for("effect/Hash/randomHashCache"),
				() => new WeakMap(),
			),
			symbol = Symbol.for("effect/Hash"),
			Hash_hash = self => {
				if (!0 === structuralRegionState.enabled) return 0
				switch (typeof self) {
					case "number":
						return Hash_number(self)
					case "bigint":
						return string(self.toString(10))
					case "boolean":
					case "symbol":
						return string(String(self))
					case "string":
						return string(self)
					case "undefined":
						return string("undefined")
					case "function":
					case "object":
						return null === self
							? string("null")
							: self instanceof Date
								? Hash_hash(self.toISOString())
								: isHash(self)
									? self[symbol]()
									: random(self)
					default:
						throw new Error(
							`BUG: unhandled typeof ${typeof self} - please report an issue at https://github.com/Effect-TS/effect/issues`,
						)
				}
			},
			random = self => {
				randomHashCache.has(self) ||
					randomHashCache.set(
						self,
						Hash_number(Math.floor(Math.random() * Number.MAX_SAFE_INTEGER)),
					)
				return randomHashCache.get(self)
			},
			combine = b => self => (53 * self) ^ b,
			optimize = n => (3221225471 & n) | ((n >>> 1) & 1073741824),
			isHash = u => Predicate_hasProperty(u, symbol),
			Hash_number = n => {
				if (n != n || n === 1 / 0) return 0
				let h = 0 | n
				h !== n && (h ^= 4294967295 * n)
				for (; n > 4294967295; ) h ^= n /= 4294967295
				return optimize(n)
			},
			string = str => {
				let h = 5381,
					i = str.length
				for (; i; ) h = (33 * h) ^ str.charCodeAt(--i)
				return optimize(h)
			},
			structure = o =>
				((o, keys) => {
					let h = 12289
					for (let i = 0; i < keys.length; i++)
						h ^= Function_pipe(string(keys[i]), combine(Hash_hash(o[keys[i]])))
					return optimize(h)
				})(o, Object.keys(o)),
			array = arr => {
				let h = 6151
				for (let i = 0; i < arr.length; i++)
					h = Function_pipe(h, combine(Hash_hash(arr[i])))
				return optimize(h)
			},
			cached = function () {
				if (1 === arguments.length) {
					const self = arguments[0]
					return function (hash) {
						Object.defineProperty(self, symbol, {
							value: () => hash,
							enumerable: !1,
						})
						return hash
					}
				}
				const self = arguments[0],
					hash = arguments[1]
				Object.defineProperty(self, symbol, {
					value: () => hash,
					enumerable: !1,
				})
				return hash
			},
			Equal_symbol = Symbol.for("effect/Equal")
		function equals() {
			return 1 === arguments.length
				? self => compareBoth(self, arguments[0])
				: compareBoth(arguments[0], arguments[1])
		}
		function compareBoth(self, that) {
			if (self === that) return !0
			const selfType = typeof self
			if (selfType !== typeof that) return !1
			if ("object" === selfType || "function" === selfType) {
				if (null !== self && null !== that) {
					if (isEqual(self) && isEqual(that))
						return (
							!(
								Hash_hash(self) !== Hash_hash(that) || !self[Equal_symbol](that)
							) ||
							(!(
								!structuralRegionState.enabled || !structuralRegionState.tester
							) &&
								structuralRegionState.tester(self, that))
						)
					if (self instanceof Date && that instanceof Date)
						return self.toISOString() === that.toISOString()
				}
				if (structuralRegionState.enabled) {
					if (Array.isArray(self) && Array.isArray(that))
						return (
							self.length === that.length &&
							self.every((v, i) => compareBoth(v, that[i]))
						)
					if (
						Object.getPrototypeOf(self) === Object.prototype &&
						Object.getPrototypeOf(self) === Object.prototype
					) {
						const keysSelf = Object.keys(self),
							keysThat = Object.keys(that)
						if (keysSelf.length === keysThat.length) {
							for (const key of keysSelf)
								if (!(key in that) || !compareBoth(self[key], that[key]))
									return (
										!!structuralRegionState.tester &&
										structuralRegionState.tester(self, that)
									)
							return !0
						}
					}
					return (
						!!structuralRegionState.tester &&
						structuralRegionState.tester(self, that)
					)
				}
			}
			return (
				!(!structuralRegionState.enabled || !structuralRegionState.tester) &&
				structuralRegionState.tester(self, that)
			)
		}
		const isEqual = u => Predicate_hasProperty(u, Equal_symbol),
			equivalence = () => equals,
			Inspectable_NodeInspectSymbol = Symbol.for("nodejs.util.inspect.custom"),
			toJSON = x =>
				Predicate_hasProperty(x, "toJSON") &&
				Predicate_isFunction(x.toJSON) &&
				0 === x.toJSON.length
					? x.toJSON()
					: Array.isArray(x)
						? x.map(toJSON)
						: x,
			format = x => JSON.stringify(x, null, 2),
			toStringUnknown = (u, whitespace = 2) => {
				try {
					return "object" == typeof u
						? stringifyCircular(u, whitespace)
						: String(u)
				} catch (_) {
					return String(u)
				}
			},
			stringifyCircular = (obj, whitespace) => {
				let cache = []
				const retVal = JSON.stringify(
					obj,
					(_key, value) =>
						"object" == typeof value && null !== value
							? cache.includes(value)
								? void 0
								: cache.push(value) && value
							: value,
					whitespace,
				)
				cache = void 0
				return retVal
			},
			Pipeable_pipeArguments = (self, args) => {
				switch (args.length) {
					case 1:
						return args[0](self)
					case 2:
						return args[1](args[0](self))
					case 3:
						return args[2](args[1](args[0](self)))
					case 4:
						return args[3](args[2](args[1](args[0](self))))
					case 5:
						return args[4](args[3](args[2](args[1](args[0](self)))))
					case 6:
						return args[5](args[4](args[3](args[2](args[1](args[0](self))))))
					case 7:
						return args[6](
							args[5](args[4](args[3](args[2](args[1](args[0](self)))))),
						)
					case 8:
						return args[7](
							args[6](
								args[5](args[4](args[3](args[2](args[1](args[0](self)))))),
							),
						)
					case 9:
						return args[8](
							args[7](
								args[6](
									args[5](args[4](args[3](args[2](args[1](args[0](self)))))),
								),
							),
						)
					default: {
						let ret = self
						for (let i = 0, len = args.length; i < len; i++) ret = args[i](ret)
						return ret
					}
				}
			},
			EffectTypeId = Symbol.for("effect/Effect"),
			StreamTypeId = Symbol.for("effect/Stream"),
			SinkTypeId = Symbol.for("effect/Sink"),
			ChannelTypeId = Symbol.for("effect/Channel"),
			effectVariance = {
				_R: _ => _,
				_E: _ => _,
				_A: _ => _,
				_V: getCurrentVersion(),
			},
			EffectPrototype = {
				[EffectTypeId]: effectVariance,
				[StreamTypeId]: effectVariance,
				[SinkTypeId]: {
					_A: _ => _,
					_In: _ => _,
					_L: _ => _,
					_E: _ => _,
					_R: _ => _,
				},
				[ChannelTypeId]: {
					_Env: _ => _,
					_InErr: _ => _,
					_InElem: _ => _,
					_InDone: _ => _,
					_OutErr: _ => _,
					_OutElem: _ => _,
					_OutDone: _ => _,
				},
				[Equal_symbol](that) {
					return this === that
				},
				[symbol]() {
					return cached(this, random(this))
				},
				[Symbol.iterator]() {
					return new SingleShotGen(new YieldWrap(this))
				},
				pipe() {
					return Pipeable_pipeArguments(this, arguments)
				},
			},
			effectable_StructuralPrototype = {
				[symbol]() {
					return cached(this, structure(this))
				},
				[Equal_symbol](that) {
					const selfKeys = Object.keys(this),
						thatKeys = Object.keys(that)
					if (selfKeys.length !== thatKeys.length) return !1
					for (const key of selfKeys)
						if (!(key in that) || !equals(this[key], that[key])) return !1
					return !0
				},
			},
			StructuralCommitPrototype = {
				...{ ...EffectPrototype, _op: "Commit" },
				...effectable_StructuralPrototype,
			},
			TypeId = Symbol.for("effect/Option"),
			CommonProto = {
				...EffectPrototype,
				[TypeId]: { _A: _ => _ },
				[Inspectable_NodeInspectSymbol]() {
					return this.toJSON()
				},
				toString() {
					return format(this.toJSON())
				},
			},
			SomeProto = Object.assign(Object.create(CommonProto), {
				_tag: "Some",
				_op: "Some",
				[Equal_symbol](that) {
					return (
						isOption(that) && isSome(that) && equals(this.value, that.value)
					)
				},
				[symbol]() {
					return cached(
						this,
						combine(Hash_hash(this._tag))(Hash_hash(this.value)),
					)
				},
				toJSON() {
					return { _id: "Option", _tag: this._tag, value: toJSON(this.value) }
				},
			}),
			NoneHash = Hash_hash("None"),
			NoneProto = Object.assign(Object.create(CommonProto), {
				_tag: "None",
				_op: "None",
				[Equal_symbol]: that => isOption(that) && isNone(that),
				[symbol]: () => NoneHash,
				toJSON() {
					return { _id: "Option", _tag: this._tag }
				},
			}),
			isOption = input => Predicate_hasProperty(input, TypeId),
			isNone = fa => "None" === fa._tag,
			isSome = fa => "Some" === fa._tag,
			none = Object.create(NoneProto),
			option_some = value => {
				const a = Object.create(SomeProto)
				a.value = value
				return a
			},
			TagTypeId = Symbol.for("effect/Context/Tag"),
			STMTypeId = Symbol.for("effect/STM"),
			context_TagProto = {
				...EffectPrototype,
				_tag: "Tag",
				_op: "Tag",
				[STMTypeId]: effectVariance,
				[TagTypeId]: { _Service: _ => _, _Identifier: _ => _ },
				toString() {
					return format(this.toJSON())
				},
				toJSON() {
					return { _id: "Tag", key: this.key, stack: this.stack }
				},
				[Inspectable_NodeInspectSymbol]() {
					return this.toJSON()
				},
				of: self => self,
				context(self) {
					return make(this, self)
				},
			},
			context_TypeId = Symbol.for("effect/Context"),
			ContextProto = {
				[context_TypeId]: { _Services: _ => _ },
				[Equal_symbol](that) {
					if (isContext(that) && this.unsafeMap.size === that.unsafeMap.size) {
						for (const k of this.unsafeMap.keys())
							if (
								!that.unsafeMap.has(k) ||
								!equals(this.unsafeMap.get(k), that.unsafeMap.get(k))
							)
								return !1
						return !0
					}
					return !1
				},
				[symbol]() {
					return cached(this, Hash_number(this.unsafeMap.size))
				},
				pipe() {
					return Pipeable_pipeArguments(this, arguments)
				},
				toString() {
					return format(this.toJSON())
				},
				toJSON() {
					return {
						_id: "Context",
						services: Array.from(this.unsafeMap).map(toJSON),
					}
				},
				[Inspectable_NodeInspectSymbol]() {
					return this.toJSON()
				},
			},
			makeContext = unsafeMap => {
				const context = Object.create(ContextProto)
				context.unsafeMap = unsafeMap
				return context
			},
			isContext = u => Predicate_hasProperty(u, context_TypeId),
			_empty = makeContext(new Map()),
			make = (tag, service) => makeContext(new Map([[tag.key, service]])),
			add = Function_dual(3, (self, tag, service) => {
				const map = new Map(self.unsafeMap)
				map.set(tag.key, service)
				return makeContext(map)
			}),
			unsafeGet = Function_dual(2, (self, tag) => {
				if (!self.unsafeMap.has(tag.key))
					throw (tag => {
						const error = new Error(
							"Service not found" + (tag.key ? `: ${String(tag.key)}` : ""),
						)
						if (tag.stack) {
							const lines = tag.stack.split("\n")
							if (lines.length > 2) {
								const afterAt = lines[2].match(/at (.*)/)
								afterAt &&
									(error.message =
										error.message + ` (defined at ${afterAt[1]})`)
							}
						}
						if (error.stack) {
							const lines = error.stack.split("\n")
							lines.splice(1, 3)
							error.stack = lines.join("\n")
						}
						return error
					})(tag)
				return self.unsafeMap.get(tag.key)
			}),
			get = unsafeGet,
			getOption = Function_dual(2, (self, tag) =>
				self.unsafeMap.has(tag.key)
					? option_some(self.unsafeMap.get(tag.key))
					: none,
			),
			merge = Function_dual(2, (self, that) => {
				const map = new Map(self.unsafeMap)
				for (const [tag, s] of that.unsafeMap) map.set(tag, s)
				return makeContext(map)
			}),
			GenericTag = key => {
				const limit = Error.stackTraceLimit
				Error.stackTraceLimit = 2
				const creationError = new Error()
				Error.stackTraceLimit = limit
				const tag = Object.create(context_TagProto)
				Object.defineProperty(tag, "stack", { get: () => creationError.stack })
				tag.key = key
				return tag
			},
			Context_isContext = isContext,
			Context_empty = () => _empty,
			Context_make = make,
			Context_add = add,
			Context_get = get,
			Context_unsafeGet = unsafeGet,
			Context_getOption = getOption,
			Context_merge = merge,
			Equivalence_make = isEquivalent => (self, that) =>
				self === that || isEquivalent(self, that),
			isStrictEquivalent = (x, y) => x === y,
			strict = () => isStrictEquivalent,
			Equivalence_string = strict(),
			Equivalence_mapInput = Function_dual(2, (self, f) =>
				Equivalence_make((x, y) => self(f(x), f(y))),
			),
			isNonEmptyArray = self => self.length > 0,
			either_TypeId = Symbol.for("effect/Either"),
			either_CommonProto = {
				...EffectPrototype,
				[either_TypeId]: { _R: _ => _ },
				[Inspectable_NodeInspectSymbol]() {
					return this.toJSON()
				},
				toString() {
					return format(this.toJSON())
				},
			},
			RightProto = Object.assign(Object.create(either_CommonProto), {
				_tag: "Right",
				_op: "Right",
				[Equal_symbol](that) {
					return (
						isEither(that) && isRight(that) && equals(this.right, that.right)
					)
				},
				[symbol]() {
					return combine(Hash_hash(this._tag))(Hash_hash(this.right))
				},
				toJSON() {
					return { _id: "Either", _tag: this._tag, right: toJSON(this.right) }
				},
			}),
			LeftProto = Object.assign(Object.create(either_CommonProto), {
				_tag: "Left",
				_op: "Left",
				[Equal_symbol](that) {
					return isEither(that) && isLeft(that) && equals(this.left, that.left)
				},
				[symbol]() {
					return combine(Hash_hash(this._tag))(Hash_hash(this.left))
				},
				toJSON() {
					return { _id: "Either", _tag: this._tag, left: toJSON(this.left) }
				},
			}),
			isEither = input => Predicate_hasProperty(input, either_TypeId),
			isLeft = ma => "Left" === ma._tag,
			isRight = ma => "Right" === ma._tag,
			Option_none = () => none,
			Option_some = option_some,
			Option_isNone = isNone,
			Option_isSome = isSome,
			match = Function_dual(2, (self, { onNone, onSome }) =>
				Option_isNone(self) ? onNone() : onSome(self.value),
			),
			getOrElse = Function_dual(2, (self, onNone) =>
				Option_isNone(self) ? onNone() : self.value,
			),
			orElse = Function_dual(2, (self, that) =>
				Option_isNone(self) ? that() : self,
			),
			orElseSome = Function_dual(2, (self, onNone) =>
				Option_isNone(self) ? Option_some(onNone()) : self,
			),
			fromNullable = nullableValue =>
				null == nullableValue ? Option_none() : Option_some(nullableValue),
			getOrUndefined = getOrElse(Function_constUndefined),
			getOrThrow = Function_dual(2, (self, onNone) => {
				if (Option_isSome(self)) return self.value
				throw onNone()
			})(() => new Error("getOrThrow called on a None")),
			map = Function_dual(2, (self, f) =>
				Option_isNone(self) ? Option_none() : Option_some(f(self.value)),
			),
			flatMap = Function_dual(2, (self, f) =>
				Option_isNone(self) ? Option_none() : f(self.value),
			),
			flatMapNullable = Function_dual(2, (self, f) =>
				Option_isNone(self) ? Option_none() : fromNullable(f(self.value)),
			),
			filterMap = Function_dual(2, (self, f) =>
				Option_isNone(self) ? Option_none() : f(self.value),
			),
			filter = Function_dual(2, (self, predicate) =>
				filterMap(self, b => (predicate(b) ? option_some(b) : none)),
			),
			liftPredicate = Function_dual(2, (b, predicate) =>
				predicate(b) ? Option_some(b) : Option_none(),
			),
			containsWith = isEquivalent =>
				Function_dual(
					2,
					(self, a) => !Option_isNone(self) && isEquivalent(self.value, a),
				),
			contains = containsWith(equivalence()),
			exists = Function_dual(
				2,
				(self, refinement) => !Option_isNone(self) && refinement(self.value),
			),
			findFirst = Function_dual(2, (self, f) => {
				let i = 0
				for (const a of self) {
					const o = f(a, i)
					if (Predicate_isBoolean(o)) {
						if (o) return Option_some(a)
					} else if (Option_isSome(o)) return o
					i++
				}
				return Option_none()
			})
		Symbol.iterator
		const Order_make = compare => (self, that) =>
				self === that ? 0 : compare(self, that),
			Order_number = Order_make((self, that) => (self < that ? -1 : 1)),
			Order_boolean = Order_make((self, that) => (self < that ? -1 : 1)),
			Order_mapInput = Function_dual(2, (self, f) =>
				Order_make((b1, b2) => self(f(b1), f(b2))),
			),
			greaterThan = O => Function_dual(2, (self, that) => 1 === O(self, that)),
			greaterThanOrEqualTo = O =>
				Function_dual(2, (self, that) => -1 !== O(self, that)),
			clamp = O =>
				Function_dual(2, (self, options) =>
					(O =>
						Function_dual(2, (self, that) =>
							self === that || O(self, that) < 1 ? self : that,
						))(O)(
						options.maximum,
						(O =>
							Function_dual(2, (self, that) =>
								self === that || O(self, that) > -1 ? self : that,
							))(O)(options.minimum, self),
					),
				),
			Tuple_make = (Object.fromEntries, (...elements) => elements),
			getFirst = self => self[0],
			getSecond = self => self[1],
			mapBoth = Function_dual(2, (self, { onFirst, onSecond }) => [
				onFirst(self[0]),
				onSecond(self[1]),
			]),
			mapFirst = Function_dual(2, (self, f) => [f(self[0]), self[1]]),
			mapSecond = Function_dual(2, (self, f) => [self[0], f(self[1])]),
			allocate = n => new Array(n),
			Array_makeBy = (n, f) => {
				const max = Math.max(1, Math.floor(n)),
					out = new Array(max)
				for (let i = 0; i < max; i++) out[i] = f(i)
				return out
			},
			Array_fromIterable = collection =>
				Array.isArray(collection) ? collection : Array.from(collection),
			matchLeft = Function_dual(2, (self, { onEmpty, onNonEmpty }) =>
				isNonEmptyReadonlyArray(self)
					? onNonEmpty(headNonEmpty(self), tailNonEmpty(self))
					: onEmpty(),
			),
			matchRight = Function_dual(2, (self, { onEmpty, onNonEmpty }) =>
				isNonEmptyReadonlyArray(self)
					? onNonEmpty(initNonEmpty(self), lastNonEmpty(self))
					: onEmpty(),
			),
			Array_prepend = Function_dual(2, (self, head) => [head, ...self]),
			Array_append = Function_dual(2, (self, last) => [...self, last]),
			Array_appendAll = Function_dual(2, (self, that) =>
				Array_fromIterable(self).concat(Array_fromIterable(that)),
			),
			isArray = Array.isArray,
			Array_isNonEmptyArray = isNonEmptyArray,
			isNonEmptyReadonlyArray = isNonEmptyArray,
			isOutOfBound = (i, as) => i < 0 || i >= as.length,
			Array_clamp = (i, as) => Math.floor(Math.min(Math.max(0, i), as.length)),
			Array_get = Function_dual(2, (self, index) => {
				const i = Math.floor(index)
				return isOutOfBound(i, self) ? Option_none() : Option_some(self[i])
			}),
			Array_unsafeGet = Function_dual(2, (self, index) => {
				const i = Math.floor(index)
				if (isOutOfBound(i, self)) throw new Error(`Index ${i} out of bounds`)
				return self[i]
			}),
			Array_head = Array_get(0),
			headNonEmpty = Array_unsafeGet(0),
			lastNonEmpty = self => self[self.length - 1],
			tailNonEmpty = self => self.slice(1),
			initNonEmpty = self => self.slice(0, -1),
			Array_take = Function_dual(2, (self, n) => {
				const input = Array_fromIterable(self)
				return input.slice(0, Array_clamp(n, input))
			}),
			span = Function_dual(2, (self, predicate) =>
				splitAt(
					self,
					((self, predicate) => {
						let i = 0
						for (const a of self) {
							if (!predicate(a, i)) break
							i++
						}
						return i
					})(self, predicate),
				),
			),
			Array_drop = Function_dual(2, (self, n) => {
				const input = Array_fromIterable(self)
				return input.slice(Array_clamp(n, input), input.length)
			}),
			findFirstIndex = Function_dual(2, (self, predicate) => {
				let i = 0
				for (const a of self) {
					if (predicate(a, i)) return Option_some(i)
					i++
				}
				return Option_none()
			}),
			Array_findFirst = findFirst,
			Array_findLast = Function_dual(2, (self, f) => {
				const input = Array_fromIterable(self)
				for (let i = input.length - 1; i >= 0; i--) {
					const a = input[i],
						o = f(a, i)
					if (Predicate_isBoolean(o)) {
						if (o) return Option_some(a)
					} else if (Option_isSome(o)) return o
				}
				return Option_none()
			}),
			Array_replace = Function_dual(3, (self, i, b) =>
				Array_modify(self, i, () => b),
			),
			Array_modify = Function_dual(3, (self, i, f) =>
				getOrElse(Array_modifyOption(self, i, f), () => Array.from(self)),
			),
			Array_modifyOption = Function_dual(3, (self, i, f) => {
				const out = Array.from(self)
				if (isOutOfBound(i, out)) return Option_none()
				const next = f(out[i])
				out[i] = next
				return Option_some(out)
			}),
			Array_remove = Function_dual(2, (self, i) => {
				const out = Array.from(self)
				if (isOutOfBound(i, out)) return out
				out.splice(i, 1)
				return out
			}),
			Array_reverse = self => Array.from(self).reverse(),
			sort = Function_dual(2, (self, O) => {
				const out = Array.from(self)
				out.sort(O)
				return out
			}),
			Array_zip = Function_dual(2, (self, that) =>
				Array_zipWith(self, that, Tuple_make),
			),
			Array_zipWith = Function_dual(3, (self, that, f) => {
				const as = Array_fromIterable(self),
					bs = Array_fromIterable(that)
				if (isNonEmptyReadonlyArray(as) && isNonEmptyReadonlyArray(bs)) {
					const out = [f(headNonEmpty(as), headNonEmpty(bs))],
						len = Math.min(as.length, bs.length)
					for (let i = 1; i < len; i++) out[i] = f(as[i], bs[i])
					return out
				}
				return []
			}),
			Array_containsWith = isEquivalent =>
				Function_dual(2, (self, a) => {
					for (const i of self) if (isEquivalent(a, i)) return !0
					return !1
				}),
			Array_equivalence = equivalence(),
			splitAt = Function_dual(2, (self, n) => {
				const input = Array.from(self),
					_n = Math.floor(n)
				return isNonEmptyReadonlyArray(input)
					? _n >= 1
						? splitNonEmptyAt(input, _n)
						: [[], input]
					: [input, []]
			}),
			splitNonEmptyAt = Function_dual(2, (self, n) => {
				const _n = Math.max(1, Math.floor(n))
				return _n >= self.length
					? [copy(self), []]
					: [
							Array_prepend(self.slice(1, _n), headNonEmpty(self)),
							self.slice(_n),
						]
			}),
			copy = self => self.slice(),
			unionWith = Function_dual(3, (self, that, isEquivalent) => {
				const a = Array_fromIterable(self),
					b = Array_fromIterable(that)
				return isNonEmptyReadonlyArray(a)
					? isNonEmptyReadonlyArray(b)
						? dedupeWith(isEquivalent)(Array_appendAll(a, b))
						: a
					: b
			}),
			Array_union = Function_dual(2, (self, that) =>
				unionWith(self, that, Array_equivalence),
			),
			Array_of = a => [a],
			Array_map = Function_dual(2, (self, f) => self.map(f)),
			Array_flatMap = Function_dual(2, (self, f) => {
				if ((self => 0 === self.length)(self)) return []
				const out = []
				for (let i = 0; i < self.length; i++) {
					const inner = f(self[i], i)
					for (let j = 0; j < inner.length; j++) out.push(inner[j])
				}
				return out
			}),
			Array_flatten = Array_flatMap(Function_identity),
			Array_filterMap = Function_dual(2, (self, f) => {
				const as = Array_fromIterable(self),
					out = []
				for (let i = 0; i < as.length; i++) {
					const o = f(as[i], i)
					Option_isSome(o) && out.push(o.value)
				}
				return out
			}),
			Array_getSomes = Array_filterMap(Function_identity),
			Array_filter = Function_dual(2, (self, predicate) => {
				const as = Array_fromIterable(self),
					out = []
				for (let i = 0; i < as.length; i++)
					predicate(as[i], i) && out.push(as[i])
				return out
			}),
			Array_reduce = Function_dual(3, (self, b, f) =>
				Array_fromIterable(self).reduce((b, a, i) => f(b, a, i), b),
			),
			Array_some = Function_dual(2, (self, predicate) => self.some(predicate)),
			Array_unfold = (b, f) => {
				const out = []
				let o,
					next = b
				for (; Option_isSome((o = f(next))); ) {
					const [a, b] = o.value
					out.push(a)
					next = b
				}
				return out
			},
			Array_getEquivalence = item =>
				Equivalence_make((self, that) => {
					if (self.length !== that.length) return !1
					for (let i = 0; i < self.length; i++)
						if (!item(self[i], that[i])) return !1
					return !0
				}),
			dedupeWith = Function_dual(2, (self, isEquivalent) => {
				const input = Array_fromIterable(self)
				if (isNonEmptyReadonlyArray(input)) {
					const out = [headNonEmpty(input)],
						rest = tailNonEmpty(input)
					for (const r of rest)
						out.every(a => !isEquivalent(r, a)) && out.push(r)
					return out
				}
				return []
			}),
			dedupe = self => dedupeWith(self, equivalence()),
			join = Function_dual(2, (self, sep) =>
				Array_fromIterable(self).join(sep),
			),
			Chunk_TypeId = Symbol.for("effect/Chunk"),
			emptyArray = [],
			Chunk_getEquivalence = isEquivalent =>
				Equivalence_make(
					(self, that) =>
						self.length === that.length &&
						toReadonlyArray(self).every((value, i) =>
							isEquivalent(value, Chunk_unsafeGet(that, i)),
						),
				),
			Chunk_equivalence = Chunk_getEquivalence(equals),
			ChunkProto = {
				[Chunk_TypeId]: { _A: _ => _ },
				toString() {
					return format(this.toJSON())
				},
				toJSON() {
					return { _id: "Chunk", values: toReadonlyArray(this).map(toJSON) }
				},
				[Inspectable_NodeInspectSymbol]() {
					return this.toJSON()
				},
				[Equal_symbol](that) {
					return isChunk(that) && Chunk_equivalence(this, that)
				},
				[symbol]() {
					return cached(this, array(toReadonlyArray(this)))
				},
				[Symbol.iterator]() {
					switch (this.backing._tag) {
						case "IArray":
							return this.backing.array[Symbol.iterator]()
						case "IEmpty":
							return emptyArray[Symbol.iterator]()
						default:
							return toReadonlyArray(this)[Symbol.iterator]()
					}
				},
				pipe() {
					return Pipeable_pipeArguments(this, arguments)
				},
			},
			makeChunk = backing => {
				const chunk = Object.create(ChunkProto)
				chunk.backing = backing
				switch (backing._tag) {
					case "IEmpty":
						chunk.length = 0
						chunk.depth = 0
						chunk.left = chunk
						chunk.right = chunk
						break
					case "IConcat":
						chunk.length = backing.left.length + backing.right.length
						chunk.depth = 1 + Math.max(backing.left.depth, backing.right.depth)
						chunk.left = backing.left
						chunk.right = backing.right
						break
					case "IArray":
						chunk.length = backing.array.length
						chunk.depth = 0
						chunk.left = Chunk_empty
						chunk.right = Chunk_empty
						break
					case "ISingleton":
						chunk.length = 1
						chunk.depth = 0
						chunk.left = Chunk_empty
						chunk.right = Chunk_empty
						break
					case "ISlice":
						chunk.length = backing.length
						chunk.depth = backing.chunk.depth + 1
						chunk.left = Chunk_empty
						chunk.right = Chunk_empty
				}
				return chunk
			},
			isChunk = u => Predicate_hasProperty(u, Chunk_TypeId),
			Chunk_empty = makeChunk({ _tag: "IEmpty" }),
			esm_Chunk_empty = () => Chunk_empty,
			Chunk_make = (...as) =>
				1 === as.length ? Chunk_of(as[0]) : unsafeFromNonEmptyArray(as),
			Chunk_of = a => makeChunk({ _tag: "ISingleton", a }),
			Chunk_fromIterable = self =>
				isChunk(self)
					? self
					: makeChunk({ _tag: "IArray", array: Array_fromIterable(self) }),
			copyToArray = (self, array, initial) => {
				switch (self.backing._tag) {
					case "IArray":
						!(function (src, srcPos, dest, destPos, len) {
							for (let i = 0; i < Math.min(src.length, 0 + len); i++)
								dest[destPos + i - 0] = src[i]
						})(self.backing.array, 0, array, initial, self.length)
						break
					case "IConcat":
						copyToArray(self.left, array, initial)
						copyToArray(self.right, array, initial + self.left.length)
						break
					case "ISingleton":
						array[initial] = self.backing.a
						break
					case "ISlice": {
						let i = 0,
							j = initial
						for (; i < self.length; ) {
							array[j] = Chunk_unsafeGet(self, i)
							i += 1
							j += 1
						}
						break
					}
				}
			},
			toReadonlyArray = self => {
				switch (self.backing._tag) {
					case "IEmpty":
						return emptyArray
					case "IArray":
						return self.backing.array
					default: {
						const arr = new Array(self.length)
						copyToArray(self, arr, 0)
						self.backing = { _tag: "IArray", array: arr }
						self.left = Chunk_empty
						self.right = Chunk_empty
						self.depth = 0
						return arr
					}
				}
			},
			Chunk_reverse = self => {
				switch (self.backing._tag) {
					case "IEmpty":
					case "ISingleton":
						return self
					case "IArray":
						return makeChunk({
							_tag: "IArray",
							array: Array_reverse(self.backing.array),
						})
					case "IConcat":
						return makeChunk({
							_tag: "IConcat",
							left: Chunk_reverse(self.backing.right),
							right: Chunk_reverse(self.backing.left),
						})
					case "ISlice":
						return unsafeFromArray(Array_reverse(toReadonlyArray(self)))
				}
			},
			Chunk_get = Function_dual(2, (self, index) =>
				index < 0 || index >= self.length
					? Option_none()
					: Option_some(Chunk_unsafeGet(self, index)),
			),
			unsafeFromArray = self => makeChunk({ _tag: "IArray", array: self }),
			unsafeFromNonEmptyArray = self => unsafeFromArray(self),
			Chunk_unsafeGet = Function_dual(2, (self, index) => {
				switch (self.backing._tag) {
					case "IEmpty":
						throw new Error("Index out of bounds")
					case "ISingleton":
						if (0 !== index) throw new Error("Index out of bounds")
						return self.backing.a
					case "IArray":
						if (index >= self.length || index < 0)
							throw new Error("Index out of bounds")
						return self.backing.array[index]
					case "IConcat":
						return index < self.left.length
							? Chunk_unsafeGet(self.left, index)
							: Chunk_unsafeGet(self.right, index - self.left.length)
					case "ISlice":
						return Chunk_unsafeGet(
							self.backing.chunk,
							index + self.backing.offset,
						)
				}
			}),
			Chunk_append = Function_dual(2, (self, a) =>
				Chunk_appendAll(self, Chunk_of(a)),
			),
			Chunk_prepend = Function_dual(2, (self, elem) =>
				Chunk_appendAll(Chunk_of(elem), self),
			),
			Chunk_drop = Function_dual(2, (self, n) => {
				if (n <= 0) return self
				if (n >= self.length) return Chunk_empty
				switch (self.backing._tag) {
					case "ISlice":
						return makeChunk({
							_tag: "ISlice",
							chunk: self.backing.chunk,
							offset: self.backing.offset + n,
							length: self.backing.length - n,
						})
					case "IConcat":
						return n > self.left.length
							? Chunk_drop(self.right, n - self.left.length)
							: makeChunk({
									_tag: "IConcat",
									left: Chunk_drop(self.left, n),
									right: self.right,
								})
					default:
						return makeChunk({
							_tag: "ISlice",
							chunk: self,
							offset: n,
							length: self.length - n,
						})
				}
			}),
			Chunk_appendAll = Function_dual(2, (self, that) => {
				if ("IEmpty" === self.backing._tag) return that
				if ("IEmpty" === that.backing._tag) return self
				const diff = that.depth - self.depth
				if (Math.abs(diff) <= 1)
					return makeChunk({ _tag: "IConcat", left: self, right: that })
				if (diff < -1) {
					if (self.left.depth >= self.right.depth) {
						const nr = Chunk_appendAll(self.right, that)
						return makeChunk({ _tag: "IConcat", left: self.left, right: nr })
					}
					{
						const nrr = Chunk_appendAll(self.right.right, that)
						if (nrr.depth === self.depth - 3) {
							const nr = makeChunk({
								_tag: "IConcat",
								left: self.right.left,
								right: nrr,
							})
							return makeChunk({ _tag: "IConcat", left: self.left, right: nr })
						}
						{
							const nl = makeChunk({
								_tag: "IConcat",
								left: self.left,
								right: self.right.left,
							})
							return makeChunk({ _tag: "IConcat", left: nl, right: nrr })
						}
					}
				}
				if (that.right.depth >= that.left.depth) {
					const nl = Chunk_appendAll(self, that.left)
					return makeChunk({ _tag: "IConcat", left: nl, right: that.right })
				}
				{
					const nll = Chunk_appendAll(self, that.left.left)
					if (nll.depth === that.depth - 3) {
						const nl = makeChunk({
							_tag: "IConcat",
							left: nll,
							right: that.left.right,
						})
						return makeChunk({ _tag: "IConcat", left: nl, right: that.right })
					}
					{
						const nr = makeChunk({
							_tag: "IConcat",
							left: that.left.right,
							right: that.right,
						})
						return makeChunk({ _tag: "IConcat", left: nll, right: nr })
					}
				}
			}),
			Chunk_isEmpty = self => 0 === self.length,
			isNonEmpty = self => self.length > 0,
			Chunk_head = Chunk_get(0),
			Chunk_unsafeHead = self => Chunk_unsafeGet(self, 0),
			Chunk_headNonEmpty = Chunk_unsafeHead,
			Chunk_tailNonEmpty = self => Chunk_drop(self, 1),
			Duration_TypeId = Symbol.for("effect/Duration"),
			bigint0 = BigInt(0),
			bigint24 = BigInt(24),
			bigint60 = BigInt(60),
			bigint1e3 = BigInt(1e3),
			bigint1e6 = BigInt(1e6),
			bigint1e9 = BigInt(1e9),
			DURATION_REGEX =
				/^(-?\d+(?:\.\d+)?)\s+(nanos?|micros?|millis?|seconds?|minutes?|hours?|days?|weeks?)$/,
			decode = input => {
				if (isDuration(input)) return input
				if (isNumber(input)) return Duration_millis(input)
				if (isBigInt(input)) return Duration_nanos(input)
				if (Array.isArray(input)) {
					if (2 === input.length && isNumber(input[0]) && isNumber(input[1]))
						return Duration_nanos(
							BigInt(input[0]) * bigint1e9 + BigInt(input[1]),
						)
				} else if (isString(input)) {
					DURATION_REGEX.lastIndex = 0
					const match = DURATION_REGEX.exec(input)
					if (match) {
						const [_, valueStr, unit] = match,
							value = Number(valueStr)
						switch (unit) {
							case "nano":
							case "nanos":
								return Duration_nanos(BigInt(valueStr))
							case "micro":
							case "micros":
								return micros(BigInt(valueStr))
							case "milli":
							case "millis":
								return Duration_millis(value)
							case "second":
							case "seconds":
								return seconds(value)
							case "minute":
							case "minutes":
								return minutes(value)
							case "hour":
							case "hours":
								return hours(value)
							case "day":
							case "days":
								return days(value)
							case "week":
							case "weeks":
								return weeks(value)
						}
					}
				}
				throw new Error("Invalid DurationInput")
			},
			zeroValue = { _tag: "Millis", millis: 0 },
			infinityValue = { _tag: "Infinity" },
			DurationProto = {
				[Duration_TypeId]: Duration_TypeId,
				[symbol]() {
					return cached(this, structure(this.value))
				},
				[Equal_symbol](that) {
					return isDuration(that) && Duration_equals(this, that)
				},
				toString() {
					return `Duration(${Duration_format(this)})`
				},
				toJSON() {
					switch (this.value._tag) {
						case "Millis":
							return {
								_id: "Duration",
								_tag: "Millis",
								millis: this.value.millis,
							}
						case "Nanos":
							return { _id: "Duration", _tag: "Nanos", hrtime: toHrTime(this) }
						case "Infinity":
							return { _id: "Duration", _tag: "Infinity" }
					}
				},
				[Inspectable_NodeInspectSymbol]() {
					return this.toJSON()
				},
				pipe() {
					return Pipeable_pipeArguments(this, arguments)
				},
			},
			Duration_make = input => {
				const duration = Object.create(DurationProto)
				isNumber(input)
					? isNaN(input) || input <= 0
						? (duration.value = zeroValue)
						: Number.isFinite(input)
							? Number.isInteger(input)
								? (duration.value = { _tag: "Millis", millis: input })
								: (duration.value = {
										_tag: "Nanos",
										nanos: BigInt(Math.round(1e6 * input)),
									})
							: (duration.value = infinityValue)
					: (duration.value =
							input <= bigint0 ? zeroValue : { _tag: "Nanos", nanos: input })
				return duration
			},
			isDuration = u => Predicate_hasProperty(u, Duration_TypeId),
			zero = Duration_make(0),
			Duration_nanos = nanos => Duration_make(nanos),
			micros = micros => Duration_make(micros * bigint1e3),
			Duration_millis = millis => Duration_make(millis),
			seconds = seconds => Duration_make(1e3 * seconds),
			minutes = minutes => Duration_make(6e4 * minutes),
			hours = hours => Duration_make(36e5 * hours),
			days = days => Duration_make(864e5 * days),
			weeks = weeks => Duration_make(6048e5 * weeks),
			toMillis = self => {
				const _self = decode(self)
				switch (_self.value._tag) {
					case "Infinity":
						return 1 / 0
					case "Nanos":
						return Number(_self.value.nanos) / 1e6
					case "Millis":
						return _self.value.millis
				}
			},
			toHrTime = self => {
				const _self = decode(self)
				switch (_self.value._tag) {
					case "Infinity":
						return [1 / 0, 0]
					case "Nanos":
						return [
							Number(_self.value.nanos / bigint1e9),
							Number(_self.value.nanos % bigint1e9),
						]
					case "Millis":
						return [
							Math.floor(_self.value.millis / 1e3),
							Math.round((_self.value.millis % 1e3) * 1e6),
						]
				}
			},
			matchWith = Function_dual(3, (self, that, options) => {
				const _self = decode(self),
					_that = decode(that)
				if ("Infinity" === _self.value._tag || "Infinity" === _that.value._tag)
					return options.onMillis(toMillis(_self), toMillis(_that))
				if ("Nanos" === _self.value._tag || "Nanos" === _that.value._tag) {
					const selfNanos =
							"Nanos" === _self.value._tag
								? _self.value.nanos
								: BigInt(Math.round(1e6 * _self.value.millis)),
						thatNanos =
							"Nanos" === _that.value._tag
								? _that.value.nanos
								: BigInt(Math.round(1e6 * _that.value.millis))
					return options.onNanos(selfNanos, thatNanos)
				}
				return options.onMillis(_self.value.millis, _that.value.millis)
			}),
			Duration_greaterThanOrEqualTo = Function_dual(2, (self, that) =>
				matchWith(self, that, {
					onMillis: (self, that) => self >= that,
					onNanos: (self, that) => self >= that,
				}),
			),
			Duration_equals = Function_dual(2, (self, that) =>
				((self, that) =>
					matchWith(self, that, {
						onMillis: (self, that) => self === that,
						onNanos: (self, that) => self === that,
					}))(decode(self), decode(that)),
			),
			Duration_format = self => {
				const duration = decode(self),
					parts = []
				if ("Infinity" === duration.value._tag) return "Infinity"
				const nanos = (self => {
					const _self = decode(self)
					switch (_self.value._tag) {
						case "Infinity":
							throw new Error("Cannot convert infinite duration to nanos")
						case "Nanos":
							return _self.value.nanos
						case "Millis":
							return BigInt(Math.round(1e6 * _self.value.millis))
					}
				})(duration)
				nanos % bigint1e6 && parts.push((nanos % bigint1e6) + "ns")
				const ms = nanos / bigint1e6
				ms % bigint1e3 !== bigint0 && parts.push((ms % bigint1e3) + "ms")
				const sec = ms / bigint1e3
				sec % bigint60 !== bigint0 && parts.push((sec % bigint60) + "s")
				const min = sec / bigint60
				min % bigint60 !== bigint0 && parts.push((min % bigint60) + "m")
				const hr = min / bigint60
				hr % bigint24 !== bigint0 && parts.push((hr % bigint24) + "h")
				const days = hr / bigint24
				days !== bigint0 && parts.push(`${days}d`)
				return parts.reverse().join(" ")
			},
			Either_right = right => {
				const a = Object.create(RightProto)
				a.right = right
				return a
			},
			Either_left = left => {
				const a = Object.create(LeftProto)
				a.left = left
				return a
			},
			Either_isLeft = isLeft,
			Either_isRight = isRight,
			Either_match = Function_dual(2, (self, { onLeft, onRight }) =>
				Either_isLeft(self) ? onLeft(self.left) : onRight(self.right),
			),
			Either_merge = Either_match({
				onLeft: Function_identity,
				onRight: Function_identity,
			}),
			Either_getOrThrowWith = Function_dual(2, (self, onLeft) => {
				if (Either_isRight(self)) return self.right
				throw onLeft(self.left)
			}),
			BUCKET_SIZE = Math.pow(2, 5),
			MASK = BUCKET_SIZE - 1,
			MAX_INDEX_NODE = BUCKET_SIZE / 2,
			MIN_ARRAY_NODE = BUCKET_SIZE / 4
		function hashFragment(shift, h) {
			return (h >>> shift) & MASK
		}
		function toBitmap(x) {
			return 1 << x
		}
		function fromBitmap(bitmap, bit) {
			return (function (x) {
				x =
					((x =
						(858993459 & (x -= (x >> 1) & 1431655765)) +
						((x >> 2) & 858993459)) +
						(x >> 4)) &
					252645135
				return 127 & ((x += x >> 8) + (x >> 16))
			})(bitmap & (bit - 1))
		}
		function arrayUpdate(mutate, at, v, arr) {
			let out = arr
			if (!mutate) {
				const len = arr.length
				out = new Array(len)
				for (let i = 0; i < len; ++i) out[i] = arr[i]
			}
			out[at] = v
			return out
		}
		function arraySpliceOut(mutate, at, arr) {
			const newLen = arr.length - 1
			let i = 0,
				g = 0,
				out = arr
			if (mutate) i = g = at
			else {
				out = new Array(newLen)
				for (; i < at; ) out[g++] = arr[i++]
			}
			++i
			for (; i <= newLen; ) out[g++] = arr[i++]
			mutate && (out.length = newLen)
			return out
		}
		class EmptyNode {
			_tag = "EmptyNode"
			modify(edit, _shift, f, hash, key, size) {
				const v = f(Option_none())
				if (Option_isNone(v)) return new EmptyNode()
				++size.value
				return new LeafNode(edit, hash, key, v)
			}
		}
		function isEmptyNode(a) {
			return Predicate_isTagged(a, "EmptyNode")
		}
		function canEditNode(node, edit) {
			return !isEmptyNode(node) && edit === node.edit
		}
		class LeafNode {
			edit
			hash
			key
			value
			_tag = "LeafNode"
			constructor(edit, hash, key, value) {
				this.edit = edit
				this.hash = hash
				this.key = key
				this.value = value
			}
			modify(edit, shift, f, hash, key, size) {
				if (equals(key, this.key)) {
					const v = f(this.value)
					if (v === this.value) return this
					if (Option_isNone(v)) {
						--size.value
						return new EmptyNode()
					}
					if (canEditNode(this, edit)) {
						this.value = v
						return this
					}
					return new LeafNode(edit, hash, key, v)
				}
				const v = f(Option_none())
				if (Option_isNone(v)) return this
				++size.value
				return mergeLeaves(
					edit,
					shift,
					this.hash,
					this,
					hash,
					new LeafNode(edit, hash, key, v),
				)
			}
		}
		class CollisionNode {
			edit
			hash
			children
			_tag = "CollisionNode"
			constructor(edit, hash, children) {
				this.edit = edit
				this.hash = hash
				this.children = children
			}
			modify(edit, shift, f, hash, key, size) {
				if (hash === this.hash) {
					const canEdit = canEditNode(this, edit),
						list = this.updateCollisionList(
							canEdit,
							edit,
							this.hash,
							this.children,
							f,
							key,
							size,
						)
					return list === this.children
						? this
						: list.length > 1
							? new CollisionNode(edit, this.hash, list)
							: list[0]
				}
				const v = f(Option_none())
				if (Option_isNone(v)) return this
				++size.value
				return mergeLeaves(
					edit,
					shift,
					this.hash,
					this,
					hash,
					new LeafNode(edit, hash, key, v),
				)
			}
			updateCollisionList(mutate, edit, hash, list, f, key, size) {
				const len = list.length
				for (let i = 0; i < len; ++i) {
					const child = list[i]
					if ("key" in child && equals(key, child.key)) {
						const value = child.value,
							newValue = f(value)
						if (newValue === value) return list
						if (Option_isNone(newValue)) {
							--size.value
							return arraySpliceOut(mutate, i, list)
						}
						return arrayUpdate(
							mutate,
							i,
							new LeafNode(edit, hash, key, newValue),
							list,
						)
					}
				}
				const newValue = f(Option_none())
				if (Option_isNone(newValue)) return list
				++size.value
				return arrayUpdate(
					mutate,
					len,
					new LeafNode(edit, hash, key, newValue),
					list,
				)
			}
		}
		class IndexedNode {
			edit
			mask
			children
			_tag = "IndexedNode"
			constructor(edit, mask, children) {
				this.edit = edit
				this.mask = mask
				this.children = children
			}
			modify(edit, shift, f, hash, key, size) {
				const mask = this.mask,
					children = this.children,
					frag = hashFragment(shift, hash),
					bit = toBitmap(frag),
					indx = fromBitmap(mask, bit),
					exists = mask & bit,
					canEdit = canEditNode(this, edit)
				if (!exists) {
					const _newChild = new EmptyNode().modify(
						edit,
						shift + 5,
						f,
						hash,
						key,
						size,
					)
					return _newChild
						? children.length >= MAX_INDEX_NODE
							? (function (edit, frag, child, bitmap, subNodes) {
									const arr = []
									let bit = bitmap,
										count = 0
									for (let i = 0; bit; ++i) {
										1 & bit && (arr[i] = subNodes[count++])
										bit >>>= 1
									}
									arr[frag] = child
									return new ArrayNode(edit, count + 1, arr)
								})(edit, frag, _newChild, mask, children)
							: new IndexedNode(
									edit,
									mask | bit,
									(function (mutate, at, v, arr) {
										const len = arr.length
										if (mutate) {
											let i = len
											for (; i >= at; ) arr[i--] = arr[i]
											arr[at] = v
											return arr
										}
										let i = 0,
											g = 0
										const out = new Array(len + 1)
										for (; i < at; ) out[g++] = arr[i++]
										out[at] = v
										for (; i < len; ) out[++g] = arr[i++]
										return out
									})(canEdit, indx, _newChild, children),
								)
						: this
				}
				const current = children[indx],
					child = current.modify(edit, shift + 5, f, hash, key, size)
				if (current === child) return this
				let newChildren,
					bitmap = mask
				if (isEmptyNode(child)) {
					bitmap &= ~bit
					if (!bitmap) return new EmptyNode()
					if (
						children.length <= 2 &&
						(isEmptyNode((node = children[1 ^ indx])) ||
							"LeafNode" === node._tag ||
							"CollisionNode" === node._tag)
					)
						return children[1 ^ indx]
					newChildren = arraySpliceOut(canEdit, indx, children)
				} else newChildren = arrayUpdate(canEdit, indx, child, children)
				var node
				if (canEdit) {
					this.mask = bitmap
					this.children = newChildren
					return this
				}
				return new IndexedNode(edit, bitmap, newChildren)
			}
		}
		class ArrayNode {
			edit
			size
			children
			_tag = "ArrayNode"
			constructor(edit, size, children) {
				this.edit = edit
				this.size = size
				this.children = children
			}
			modify(edit, shift, f, hash, key, size) {
				let count = this.size
				const children = this.children,
					frag = hashFragment(shift, hash),
					child = children[frag],
					newChild = (child || new EmptyNode()).modify(
						edit,
						shift + 5,
						f,
						hash,
						key,
						size,
					)
				if (child === newChild) return this
				const canEdit = canEditNode(this, edit)
				let newChildren
				if (isEmptyNode(child) && !isEmptyNode(newChild)) {
					++count
					newChildren = arrayUpdate(canEdit, frag, newChild, children)
				} else if (!isEmptyNode(child) && isEmptyNode(newChild)) {
					--count
					if (count <= MIN_ARRAY_NODE)
						return (function (edit, count, removed, elements) {
							const children = new Array(count - 1)
							let g = 0,
								bitmap = 0
							for (let i = 0, len = elements.length; i < len; ++i)
								if (i !== removed) {
									const elem = elements[i]
									if (elem && !isEmptyNode(elem)) {
										children[g++] = elem
										bitmap |= 1 << i
									}
								}
							return new IndexedNode(edit, bitmap, children)
						})(edit, count, frag, children)
					newChildren = arrayUpdate(canEdit, frag, new EmptyNode(), children)
				} else newChildren = arrayUpdate(canEdit, frag, newChild, children)
				if (canEdit) {
					this.size = count
					this.children = newChildren
					return this
				}
				return new ArrayNode(edit, count, newChildren)
			}
		}
		function mergeLeavesInner(edit, shift, h1, n1, h2, n2) {
			if (h1 === h2) return new CollisionNode(edit, h1, [n2, n1])
			const subH1 = hashFragment(shift, h1),
				subH2 = hashFragment(shift, h2)
			if (subH1 === subH2)
				return child =>
					new IndexedNode(edit, toBitmap(subH1) | toBitmap(subH2), [child])
			{
				const children = subH1 < subH2 ? [n1, n2] : [n2, n1]
				return new IndexedNode(
					edit,
					toBitmap(subH1) | toBitmap(subH2),
					children,
				)
			}
		}
		function mergeLeaves(edit, shift, h1, n1, h2, n2) {
			let stack,
				currentShift = shift
			for (;;) {
				const res = mergeLeavesInner(edit, currentShift, h1, n1, h2, n2)
				if ("function" != typeof res) {
					let final = res
					for (; null != stack; ) {
						final = stack.value(final)
						stack = stack.previous
					}
					return final
				}
				stack = { value: res, previous: stack }
				currentShift += 5
			}
		}
		const HashMapTypeId = Symbol.for("effect/HashMap"),
			HashMapProto = {
				[HashMapTypeId]: HashMapTypeId,
				[Symbol.iterator]() {
					return new HashMapIterator(this, (k, v) => [k, v])
				},
				[symbol]() {
					let hash = Hash_hash("effect/HashMap")
					for (const item of this)
						hash ^= Function_pipe(
							Hash_hash(item[0]),
							combine(Hash_hash(item[1])),
						)
					return cached(this, hash)
				},
				[Equal_symbol](that) {
					if (isHashMap(that)) {
						if (that._size !== this._size) return !1
						for (const item of this) {
							const elem = Function_pipe(
								that,
								getHash(item[0], Hash_hash(item[0])),
							)
							if (Option_isNone(elem)) return !1
							if (!equals(item[1], elem.value)) return !1
						}
						return !0
					}
					return !1
				},
				toString() {
					return format(this.toJSON())
				},
				toJSON() {
					return { _id: "HashMap", values: Array.from(this).map(toJSON) }
				},
				[Inspectable_NodeInspectSymbol]() {
					return this.toJSON()
				},
				pipe() {
					return Pipeable_pipeArguments(this, arguments)
				},
			},
			makeImpl = (editable, edit, root, size) => {
				const map = Object.create(HashMapProto)
				map._editable = editable
				map._edit = edit
				map._root = root
				map._size = size
				return map
			}
		class HashMapIterator {
			map
			f
			v
			constructor(map, f) {
				this.map = map
				this.f = f
				this.v = visitLazy(this.map._root, this.f, void 0)
			}
			next() {
				if (Option_isNone(this.v)) return { done: !0, value: void 0 }
				const v0 = this.v.value
				this.v = applyCont(v0.cont)
				return { done: !1, value: v0.value }
			}
			[Symbol.iterator]() {
				return new HashMapIterator(this.map, this.f)
			}
		}
		const applyCont = cont =>
				cont
					? visitLazyChildren(cont[0], cont[1], cont[2], cont[3], cont[4])
					: Option_none(),
			visitLazy = (node, f, cont = void 0) => {
				switch (node._tag) {
					case "LeafNode":
						return Option_isSome(node.value)
							? Option_some({ value: f(node.key, node.value.value), cont })
							: applyCont(cont)
					case "CollisionNode":
					case "ArrayNode":
					case "IndexedNode": {
						const children = node.children
						return visitLazyChildren(children.length, children, 0, f, cont)
					}
					default:
						return applyCont(cont)
				}
			},
			visitLazyChildren = (len, children, i, f, cont) => {
				for (; i < len; ) {
					const child = children[i++]
					if (child && !isEmptyNode(child))
						return visitLazy(child, f, [len, children, i, f, cont])
				}
				return applyCont(cont)
			},
			hashMap_empty = makeImpl(!1, 0, new EmptyNode(), 0),
			internal_hashMap_empty = () => hashMap_empty,
			isHashMap = u => Predicate_hasProperty(u, HashMapTypeId),
			hashMap_get = Function_dual(2, (self, key) =>
				getHash(self, key, Hash_hash(key)),
			),
			getHash = Function_dual(3, (self, key, hash) => {
				let node = self._root,
					shift = 0
				for (;;)
					switch (node._tag) {
						case "LeafNode":
							return equals(key, node.key) ? node.value : Option_none()
						case "CollisionNode":
							if (hash === node.hash) {
								const children = node.children
								for (let i = 0, len = children.length; i < len; ++i) {
									const child = children[i]
									if ("key" in child && equals(key, child.key))
										return child.value
								}
							}
							return Option_none()
						case "IndexedNode": {
							const bit = toBitmap(hashFragment(shift, hash))
							if (node.mask & bit) {
								node = node.children[fromBitmap(node.mask, bit)]
								shift += 5
								break
							}
							return Option_none()
						}
						case "ArrayNode":
							node = node.children[hashFragment(shift, hash)]
							if (node) {
								shift += 5
								break
							}
							return Option_none()
						default:
							return Option_none()
					}
			}),
			hashMap_has = Function_dual(2, (self, key) =>
				Option_isSome(getHash(self, key, Hash_hash(key))),
			),
			hashMap_set = Function_dual(3, (self, key, value) =>
				modifyAt(self, key, () => Option_some(value)),
			),
			setTree = Function_dual(3, (self, newRoot, newSize) => {
				if (self._editable) {
					self._root = newRoot
					self._size = newSize
					return self
				}
				return newRoot === self._root
					? self
					: makeImpl(self._editable, self._edit, newRoot, newSize)
			}),
			hashMap_keys = self => new HashMapIterator(self, key => key),
			hashMap_size = self => self._size,
			beginMutation = self =>
				makeImpl(!0, self._edit + 1, self._root, self._size),
			modifyAt = Function_dual(3, (self, key, f) =>
				modifyHash(self, key, Hash_hash(key), f),
			),
			modifyHash = Function_dual(4, (self, key, hash, f) => {
				const size = { value: self._size },
					newRoot = self._root.modify(
						self._editable ? self._edit : NaN,
						0,
						f,
						hash,
						key,
						size,
					)
				return Function_pipe(self, setTree(newRoot, size.value))
			}),
			hashMap_remove = Function_dual(2, (self, key) =>
				modifyAt(self, key, Option_none),
			),
			hashMap_map = Function_dual(2, (self, f) =>
				hashMap_reduce(self, internal_hashMap_empty(), (map, value, key) =>
					hashMap_set(map, key, f(value, key)),
				),
			),
			hashMap_forEach = Function_dual(2, (self, f) =>
				hashMap_reduce(self, void 0, (_, value, key) => f(value, key)),
			),
			hashMap_reduce = Function_dual(3, (self, zero, f) => {
				const root = self._root
				if ("LeafNode" === root._tag)
					return Option_isSome(root.value)
						? f(zero, root.value.value, root.key)
						: zero
				if ("EmptyNode" === root._tag) return zero
				const toVisit = [root.children]
				let children
				for (; (children = toVisit.pop()); )
					for (let i = 0, len = children.length; i < len; ) {
						const child = children[i++]
						child &&
							!isEmptyNode(child) &&
							("LeafNode" === child._tag
								? Option_isSome(child.value) &&
									(zero = f(zero, child.value.value, child.key))
								: toVisit.push(child.children))
					}
				return zero
			}),
			HashSetTypeId = Symbol.for("effect/HashSet"),
			HashSetProto = {
				[HashSetTypeId]: HashSetTypeId,
				[Symbol.iterator]() {
					return hashMap_keys(this._keyMap)
				},
				[symbol]() {
					return cached(
						this,
						combine(Hash_hash(this._keyMap))(Hash_hash("effect/HashSet")),
					)
				},
				[Equal_symbol](that) {
					return (
						!!isHashSet(that) &&
						hashMap_size(this._keyMap) === hashMap_size(that._keyMap) &&
						equals(this._keyMap, that._keyMap)
					)
				},
				toString() {
					return format(this.toJSON())
				},
				toJSON() {
					return { _id: "HashSet", values: Array.from(this).map(toJSON) }
				},
				[Inspectable_NodeInspectSymbol]() {
					return this.toJSON()
				},
				pipe() {
					return Pipeable_pipeArguments(this, arguments)
				},
			},
			hashSet_makeImpl = keyMap => {
				const set = Object.create(HashSetProto)
				set._keyMap = keyMap
				return set
			},
			isHashSet = u => Predicate_hasProperty(u, HashSetTypeId),
			hashSet_empty = hashSet_makeImpl(internal_hashMap_empty()),
			internal_hashSet_empty = () => hashSet_empty,
			hashSet_has = Function_dual(2, (self, value) =>
				hashMap_has(self._keyMap, value),
			),
			hashSet_beginMutation = self =>
				hashSet_makeImpl(beginMutation(self._keyMap)),
			hashSet_endMutation = self => {
				self._keyMap._editable = !1
				return self
			},
			hashSet_mutate = Function_dual(2, (self, f) => {
				const transient = hashSet_beginMutation(self)
				f(transient)
				return hashSet_endMutation(transient)
			}),
			hashSet_add = Function_dual(2, (self, value) =>
				self._keyMap._editable
					? (hashMap_set(value, !0)(self._keyMap), self)
					: hashSet_makeImpl(hashMap_set(value, !0)(self._keyMap)),
			),
			hashSet_remove = Function_dual(2, (self, value) =>
				self._keyMap._editable
					? (hashMap_remove(value)(self._keyMap), self)
					: hashSet_makeImpl(hashMap_remove(value)(self._keyMap)),
			),
			hashSet_difference = Function_dual(2, (self, that) =>
				hashSet_mutate(self, set => {
					for (const value of that) hashSet_remove(set, value)
				}),
			),
			hashSet_union = Function_dual(2, (self, that) =>
				hashSet_mutate(internal_hashSet_empty(), set => {
					hashSet_forEach(self, value => hashSet_add(set, value))
					for (const value of that) hashSet_add(set, value)
				}),
			),
			hashSet_forEach = Function_dual(2, (self, f) =>
				hashMap_forEach(self._keyMap, (_, k) => f(k)),
			),
			hashSet_reduce = Function_dual(3, (self, zero, f) =>
				hashMap_reduce(self._keyMap, zero, (z, _, a) => f(z, a)),
			),
			HashSet_empty = internal_hashSet_empty,
			HashSet_make = (...elements) => {
				const set = hashSet_beginMutation(internal_hashSet_empty())
				for (const value of elements) hashSet_add(set, value)
				return hashSet_endMutation(set)
			},
			HashSet_has = hashSet_has,
			HashSet_size = self => hashMap_size(self._keyMap),
			HashSet_add = hashSet_add,
			HashSet_remove = hashSet_remove,
			HashSet_difference = hashSet_difference,
			HashSet_union = hashSet_union,
			HashSet_reduce = hashSet_reduce,
			MutableRef_TypeId = Symbol.for("effect/MutableRef"),
			MutableRefProto = {
				[MutableRef_TypeId]: MutableRef_TypeId,
				toString() {
					return format(this.toJSON())
				},
				toJSON() {
					return { _id: "MutableRef", current: toJSON(this.current) }
				},
				[Inspectable_NodeInspectSymbol]() {
					return this.toJSON()
				},
				pipe() {
					return Pipeable_pipeArguments(this, arguments)
				},
			},
			MutableRef_make = value => {
				const ref = Object.create(MutableRefProto)
				ref.current = value
				return ref
			},
			MutableRef_get = self => self.current,
			MutableRef_set = Function_dual(2, (self, value) => {
				self.current = value
				return self
			}),
			FiberIdTypeId = Symbol.for("effect/FiberId"),
			emptyHash = string("effect/FiberId-None")
		class None {
			[FiberIdTypeId] = FiberIdTypeId
			_tag = "None"
			id = -1
			startTimeMillis = -1;
			[symbol]() {
				return emptyHash
			}
			[Equal_symbol](that) {
				return isFiberId(that) && "None" === that._tag
			}
			toString() {
				return format(this.toJSON())
			}
			toJSON() {
				return { _id: "FiberId", _tag: this._tag }
			}
			[Inspectable_NodeInspectSymbol]() {
				return this.toJSON()
			}
		}
		class Runtime {
			id
			startTimeMillis;
			[FiberIdTypeId] = FiberIdTypeId
			_tag = "Runtime"
			constructor(id, startTimeMillis) {
				this.id = id
				this.startTimeMillis = startTimeMillis
			}
			[symbol]() {
				return cached(
					this,
					string(
						`effect/FiberId-${this._tag}-${this.id}-${this.startTimeMillis}`,
					),
				)
			}
			[Equal_symbol](that) {
				return (
					isFiberId(that) &&
					"Runtime" === that._tag &&
					this.id === that.id &&
					this.startTimeMillis === that.startTimeMillis
				)
			}
			toString() {
				return format(this.toJSON())
			}
			toJSON() {
				return {
					_id: "FiberId",
					_tag: this._tag,
					id: this.id,
					startTimeMillis: this.startTimeMillis,
				}
			}
			[Inspectable_NodeInspectSymbol]() {
				return this.toJSON()
			}
		}
		const fiberId_none = new None(),
			isFiberId = self => Predicate_hasProperty(self, FiberIdTypeId),
			ids = self => {
				switch (self._tag) {
					case "None":
						return HashSet_empty()
					case "Runtime":
						return HashSet_make(self.id)
					case "Composite":
						return Function_pipe(ids(self.left), HashSet_union(ids(self.right)))
				}
			},
			_fiberCounter = globalValue(
				Symbol.for("effect/Fiber/Id/_fiberCounter"),
				() => MutableRef_make(0),
			),
			threadName = self =>
				Array.from(ids(self))
					.map(n => `#${n}`)
					.join(","),
			FiberId_none = fiberId_none,
			FiberId_threadName = threadName,
			FiberId_unsafeMake = () => {
				const id = MutableRef_get(_fiberCounter)
				Function_pipe(_fiberCounter, MutableRef_set(id + 1))
				return new Runtime(id, Date.now())
			},
			HashMap_empty = internal_hashMap_empty,
			HashMap_get = hashMap_get,
			HashMap_set = hashMap_set,
			HashMap_keys = hashMap_keys,
			HashMap_size = hashMap_size,
			HashMap_modifyAt = modifyAt,
			HashMap_map = hashMap_map,
			HashMap_reduce = hashMap_reduce,
			List_TypeId = Symbol.for("effect/List"),
			List_toArray = self => Array_fromIterable(self),
			List_getEquivalence = isEquivalent =>
				Equivalence_mapInput(Array_getEquivalence(isEquivalent), List_toArray),
			List_equivalence = List_getEquivalence(equals),
			ConsProto = {
				[List_TypeId]: List_TypeId,
				_tag: "Cons",
				toString() {
					return format(this.toJSON())
				},
				toJSON() {
					return {
						_id: "List",
						_tag: "Cons",
						values: List_toArray(this).map(toJSON),
					}
				},
				[Inspectable_NodeInspectSymbol]() {
					return this.toJSON()
				},
				[Equal_symbol](that) {
					return (
						isList(that) &&
						this._tag === that._tag &&
						List_equivalence(this, that)
					)
				},
				[symbol]() {
					return cached(this, array(List_toArray(this)))
				},
				[Symbol.iterator]() {
					let done = !1,
						self = this
					return {
						next() {
							if (done) return this.return()
							if ("Nil" === self._tag) {
								done = !0
								return this.return()
							}
							const value = self.head
							self = self.tail
							return { done, value }
						},
						return(value) {
							done || (done = !0)
							return { done: !0, value }
						},
					}
				},
				pipe() {
					return Pipeable_pipeArguments(this, arguments)
				},
			},
			makeCons = (head, tail) => {
				const cons = Object.create(ConsProto)
				cons.head = head
				cons.tail = tail
				return cons
			},
			NilHash = string("Nil"),
			NilProto = {
				[List_TypeId]: List_TypeId,
				_tag: "Nil",
				toString() {
					return format(this.toJSON())
				},
				toJSON: () => ({ _id: "List", _tag: "Nil" }),
				[Inspectable_NodeInspectSymbol]() {
					return this.toJSON()
				},
				[symbol]: () => NilHash,
				[Equal_symbol](that) {
					return isList(that) && this._tag === that._tag
				},
				[Symbol.iterator]: () => ({
					next: () => ({ done: !0, value: void 0 }),
				}),
				pipe() {
					return Pipeable_pipeArguments(this, arguments)
				},
			},
			_Nil = Object.create(NilProto),
			isList = u => Predicate_hasProperty(u, List_TypeId),
			isNil = self => "Nil" === self._tag,
			isCons = self => "Cons" === self._tag,
			cons = (head, tail) => makeCons(head, tail),
			List_empty = () => _Nil,
			List_of = value => makeCons(value, _Nil),
			List_appendAll = Function_dual(2, (self, that) =>
				List_prependAll(that, self),
			),
			List_prepend = Function_dual(2, (self, element) => cons(element, self)),
			List_prependAll = Function_dual(2, (self, prefix) => {
				if (isNil(self)) return prefix
				if (isNil(prefix)) return self
				{
					const result = makeCons(prefix.head, self)
					let curr = result,
						that = prefix.tail
					for (; !isNil(that); ) {
						const temp = makeCons(that.head, self)
						curr.tail = temp
						curr = temp
						that = that.tail
					}
					return result
				}
			}),
			List_reduce = Function_dual(3, (self, zero, f) => {
				let acc = zero,
					these = self
				for (; !isNil(these); ) {
					acc = f(acc, these.head)
					these = these.tail
				}
				return acc
			}),
			List_reverse = self => {
				let result = List_empty(),
					these = self
				for (; !isNil(these); ) {
					result = List_prepend(result, these.head)
					these = these.tail
				}
				return result
			},
			Structural =
				(Array.prototype,
				(function () {
					function Structural(args) {
						args && Object.assign(this, args)
					}
					Structural.prototype = effectable_StructuralPrototype
					return Structural
				})())
		Structural.prototype
		const ContextPatchTypeId = Symbol.for("effect/DifferContextPatch")
		function contextPatch_variance(a) {
			return a
		}
		const contextPatch_PatchProto = {
				...Structural.prototype,
				[ContextPatchTypeId]: {
					_Value: contextPatch_variance,
					_Patch: contextPatch_variance,
				},
			},
			contextPatch_EmptyProto = Object.assign(
				Object.create(contextPatch_PatchProto),
				{ _tag: "Empty" },
			),
			contextPatch_empty = Object.create(contextPatch_EmptyProto),
			differ_contextPatch_empty = () => contextPatch_empty,
			contextPatch_AndThenProto = Object.assign(
				Object.create(contextPatch_PatchProto),
				{ _tag: "AndThen" },
			),
			AddServiceProto = Object.assign(Object.create(contextPatch_PatchProto), {
				_tag: "AddService",
			}),
			makeAddService = (key, service) => {
				const o = Object.create(AddServiceProto)
				o.key = key
				o.service = service
				return o
			},
			RemoveServiceProto = Object.assign(
				Object.create(contextPatch_PatchProto),
				{ _tag: "RemoveService" },
			),
			makeRemoveService = key => {
				const o = Object.create(RemoveServiceProto)
				o.key = key
				return o
			},
			UpdateServiceProto = Object.assign(
				Object.create(contextPatch_PatchProto),
				{ _tag: "UpdateService" },
			),
			makeUpdateService = (key, update) => {
				const o = Object.create(UpdateServiceProto)
				o.key = key
				o.update = update
				return o
			},
			contextPatch_combine = Function_dual(2, (self, that) =>
				((first, second) => {
					const o = Object.create(contextPatch_AndThenProto)
					o.first = first
					o.second = second
					return o
				})(self, that),
			),
			contextPatch_patch = Function_dual(2, (self, context) => {
				if ("Empty" === self._tag) return context
				let wasServiceUpdated = !1,
					patches = Chunk_of(self)
				const updatedContext = new Map(context.unsafeMap)
				for (; isNonEmpty(patches); ) {
					const head = Chunk_headNonEmpty(patches),
						tail = Chunk_tailNonEmpty(patches)
					switch (head._tag) {
						case "Empty":
							patches = tail
							break
						case "AddService":
							updatedContext.set(head.key, head.service)
							patches = tail
							break
						case "AndThen":
							patches = Chunk_prepend(
								Chunk_prepend(tail, head.second),
								head.first,
							)
							break
						case "RemoveService":
							updatedContext.delete(head.key)
							patches = tail
							break
						case "UpdateService":
							updatedContext.set(
								head.key,
								head.update(updatedContext.get(head.key)),
							)
							wasServiceUpdated = !0
							patches = tail
					}
				}
				if (!wasServiceUpdated) return makeContext(updatedContext)
				const map = new Map()
				for (const [tag] of context.unsafeMap)
					if (updatedContext.has(tag)) {
						map.set(tag, updatedContext.get(tag))
						updatedContext.delete(tag)
					}
				for (const [tag, s] of updatedContext) map.set(tag, s)
				return makeContext(map)
			})
		Structural.prototype
		const HashSetPatchTypeId = Symbol.for("effect/DifferHashSetPatch")
		function hashSetPatch_variance(a) {
			return a
		}
		const hashSetPatch_PatchProto = {
				...Structural.prototype,
				[HashSetPatchTypeId]: {
					_Value: hashSetPatch_variance,
					_Key: hashSetPatch_variance,
					_Patch: hashSetPatch_variance,
				},
			},
			hashSetPatch_EmptyProto = Object.assign(
				Object.create(hashSetPatch_PatchProto),
				{ _tag: "Empty" },
			),
			hashSetPatch_empty = Object.create(hashSetPatch_EmptyProto),
			differ_hashSetPatch_empty = () => hashSetPatch_empty,
			hashSetPatch_AndThenProto = Object.assign(
				Object.create(hashSetPatch_PatchProto),
				{ _tag: "AndThen" },
			),
			hashSetPatch_AddProto = Object.assign(
				Object.create(hashSetPatch_PatchProto),
				{ _tag: "Add" },
			),
			hashSetPatch_makeAdd = value => {
				const o = Object.create(hashSetPatch_AddProto)
				o.value = value
				return o
			},
			hashSetPatch_RemoveProto = Object.assign(
				Object.create(hashSetPatch_PatchProto),
				{ _tag: "Remove" },
			),
			hashSetPatch_combine = Function_dual(2, (self, that) =>
				((first, second) => {
					const o = Object.create(hashSetPatch_AndThenProto)
					o.first = first
					o.second = second
					return o
				})(self, that),
			),
			hashSetPatch_patch = Function_dual(2, (self, oldValue) => {
				if ("Empty" === self._tag) return oldValue
				let set = oldValue,
					patches = Chunk_of(self)
				for (; isNonEmpty(patches); ) {
					const head = Chunk_headNonEmpty(patches),
						tail = Chunk_tailNonEmpty(patches)
					switch (head._tag) {
						case "Empty":
							patches = tail
							break
						case "AndThen":
							patches = Chunk_prepend(head.first)(
								Chunk_prepend(head.second)(tail),
							)
							break
						case "Add":
							set = HashSet_add(head.value)(set)
							patches = tail
							break
						case "Remove":
							set = HashSet_remove(head.value)(set)
							patches = tail
					}
				}
				return set
			})
		Structural.prototype
		const ReadonlyArrayPatchTypeId = Symbol.for(
			"effect/DifferReadonlyArrayPatch",
		)
		function readonlyArrayPatch_variance(a) {
			return a
		}
		const readonlyArrayPatch_PatchProto = {
				...Structural.prototype,
				[ReadonlyArrayPatchTypeId]: {
					_Value: readonlyArrayPatch_variance,
					_Patch: readonlyArrayPatch_variance,
				},
			},
			readonlyArrayPatch_EmptyProto = Object.assign(
				Object.create(readonlyArrayPatch_PatchProto),
				{ _tag: "Empty" },
			),
			readonlyArrayPatch_empty = Object.create(readonlyArrayPatch_EmptyProto),
			differ_readonlyArrayPatch_empty = () => readonlyArrayPatch_empty,
			readonlyArrayPatch_AndThenProto = Object.assign(
				Object.create(readonlyArrayPatch_PatchProto),
				{ _tag: "AndThen" },
			),
			readonlyArrayPatch_AppendProto = Object.assign(
				Object.create(readonlyArrayPatch_PatchProto),
				{ _tag: "Append" },
			),
			readonlyArrayPatch_SliceProto = Object.assign(
				Object.create(readonlyArrayPatch_PatchProto),
				{ _tag: "Slice" },
			),
			readonlyArrayPatch_UpdateProto = Object.assign(
				Object.create(readonlyArrayPatch_PatchProto),
				{ _tag: "Update" },
			),
			readonlyArrayPatch_makeUpdate = (index, patch) => {
				const o = Object.create(readonlyArrayPatch_UpdateProto)
				o.index = index
				o.patch = patch
				return o
			},
			readonlyArrayPatch_combine = Function_dual(2, (self, that) =>
				((first, second) => {
					const o = Object.create(readonlyArrayPatch_AndThenProto)
					o.first = first
					o.second = second
					return o
				})(self, that),
			),
			readonlyArrayPatch_patch = Function_dual(3, (self, oldValue, differ) => {
				if ("Empty" === self._tag) return oldValue
				let readonlyArray = oldValue.slice(),
					patches = Array_of(self)
				for (; Array_isNonEmptyArray(patches); ) {
					const head = headNonEmpty(patches),
						tail = tailNonEmpty(patches)
					switch (head._tag) {
						case "Empty":
							patches = tail
							break
						case "AndThen":
							tail.unshift(head.first, head.second)
							patches = tail
							break
						case "Append":
							for (const value of head.values) readonlyArray.push(value)
							patches = tail
							break
						case "Slice":
							readonlyArray = readonlyArray.slice(head.from, head.until)
							patches = tail
							break
						case "Update":
							readonlyArray[head.index] = differ.patch(
								head.patch,
								readonlyArray[head.index],
							)
							patches = tail
					}
				}
				return readonlyArray
			}),
			DifferProto = {
				[Symbol.for("effect/Differ")]: {
					_P: Function_identity,
					_V: Function_identity,
				},
			},
			differ_make = params => {
				const differ = Object.create(DifferProto)
				differ.empty = params.empty
				differ.diff = params.diff
				differ.combine = params.combine
				differ.patch = params.patch
				return differ
			},
			differ_update = () => updateWith((_, a) => a),
			updateWith = f =>
				differ_make({
					empty: Function_identity,
					combine: (first, second) =>
						first === Function_identity
							? second
							: second === Function_identity
								? first
								: a => second(first(a)),
					diff: (oldValue, newValue) =>
						equals(oldValue, newValue) ? Function_identity : constant(newValue),
					patch: (patch, oldValue) => f(oldValue, patch(oldValue)),
				}),
			active = patch => 255 & patch,
			enabled = patch => (patch >> 8) & 255,
			runtimeFlagsPatch_make = (active, enabled) =>
				(255 & active) + ((enabled & active & 255) << 8),
			runtimeFlagsPatch_empty = runtimeFlagsPatch_make(0, 0),
			exclude = Function_dual(2, (self, flag) =>
				runtimeFlagsPatch_make(active(self) & ~flag, enabled(self)),
			),
			runtimeFlagsPatch_andThen = Function_dual(2, (self, that) => self | that),
			cooperativeYielding = self => runtimeFlags_isEnabled(self, 32),
			runtimeFlags_enable = Function_dual(2, (self, flag) => self | flag),
			interruptible = self => interruption(self) && !windDown(self),
			interruption = self => runtimeFlags_isEnabled(self, 1),
			runtimeFlags_isEnabled = Function_dual(
				2,
				(self, flag) => 0 != (self & flag),
			),
			runtimeFlags_make = (...flags) => flags.reduce((a, b) => a | b, 0),
			runtimeFlags_none = runtimeFlags_make(0),
			runtimeMetrics = self => runtimeFlags_isEnabled(self, 4),
			windDown = self => runtimeFlags_isEnabled(self, 16),
			runtimeFlags_diff = Function_dual(2, (self, that) =>
				runtimeFlagsPatch_make(self ^ that, that),
			),
			runtimeFlags_patch = Function_dual(
				2,
				(self, patch) =>
					(self & (((~active(patch) >>> 0) & 255) | enabled(patch))) |
					(active(patch) & enabled(patch)),
			),
			differ = differ_make({
				empty: runtimeFlagsPatch_empty,
				diff: (oldValue, newValue) => runtimeFlags_diff(oldValue, newValue),
				combine: (first, second) => runtimeFlagsPatch_andThen(second)(first),
				patch: (_patch, oldValue) => runtimeFlags_patch(oldValue, _patch),
			}),
			RuntimeFlagsPatch_disable = flag => runtimeFlagsPatch_make(flag, 0),
			RuntimeFlagsPatch_exclude = exclude,
			CauseTypeId = Symbol.for("effect/Cause"),
			proto = {
				[CauseTypeId]: { _E: _ => _ },
				[symbol]() {
					return Function_pipe(
						Hash_hash("effect/Cause"),
						combine(Hash_hash(flattenCause(this))),
						cached(this),
					)
				},
				[Equal_symbol](that) {
					return isCause(that) && causeEquals(this, that)
				},
				pipe() {
					return Pipeable_pipeArguments(this, arguments)
				},
				toJSON() {
					switch (this._tag) {
						case "Empty":
							return { _id: "Cause", _tag: this._tag }
						case "Die":
							return {
								_id: "Cause",
								_tag: this._tag,
								defect: toJSON(this.defect),
							}
						case "Interrupt":
							return {
								_id: "Cause",
								_tag: this._tag,
								fiberId: this.fiberId.toJSON(),
							}
						case "Fail":
							return {
								_id: "Cause",
								_tag: this._tag,
								failure: toJSON(this.error),
							}
						case "Sequential":
						case "Parallel":
							return {
								_id: "Cause",
								_tag: this._tag,
								left: toJSON(this.left),
								right: toJSON(this.right),
							}
					}
				},
				toString() {
					return pretty(this)
				},
				[Inspectable_NodeInspectSymbol]() {
					return this.toJSON()
				},
			},
			cause_empty = (() => {
				const o = Object.create(proto)
				o._tag = "Empty"
				return o
			})(),
			fail = error => {
				const o = Object.create(proto)
				o._tag = "Fail"
				o.error = error
				return o
			},
			die = defect => {
				const o = Object.create(proto)
				o._tag = "Die"
				o.defect = defect
				return o
			},
			interrupt = fiberId => {
				const o = Object.create(proto)
				o._tag = "Interrupt"
				o.fiberId = fiberId
				return o
			},
			parallel = (left, right) => {
				const o = Object.create(proto)
				o._tag = "Parallel"
				o.left = left
				o.right = right
				return o
			},
			sequential = (left, right) => {
				const o = Object.create(proto)
				o._tag = "Sequential"
				o.left = left
				o.right = right
				return o
			},
			isCause = u => Predicate_hasProperty(u, CauseTypeId),
			isInterruptedOnly = self =>
				reduceWithContext(void 0, IsInterruptedOnlyCauseReducer)(self),
			cause_defects = self =>
				Chunk_reverse(
					cause_reduce(self, esm_Chunk_empty(), (list, cause) =>
						"Die" === cause._tag
							? Option_some(Function_pipe(list, Chunk_prepend(cause.defect)))
							: Option_none(),
					),
				),
			failureOrCause = self => {
				const option = (self =>
					find(self, cause =>
						"Fail" === cause._tag ? Option_some(cause.error) : Option_none(),
					))(self)
				switch (option._tag) {
					case "None":
						return Either_right(self)
					case "Some":
						return Either_left(option.value)
				}
			},
			stripFailures = self =>
				cause_match(self, {
					onEmpty: cause_empty,
					onFail: () => cause_empty,
					onDie: defect => die(defect),
					onInterrupt: fiberId => interrupt(fiberId),
					onSequential: sequential,
					onParallel: parallel,
				}),
			causeEquals = (left, right) => {
				let leftStack = Chunk_of(left),
					rightStack = Chunk_of(right)
				for (; isNonEmpty(leftStack) && isNonEmpty(rightStack); ) {
					const [leftParallel, leftSequential] = Function_pipe(
							Chunk_headNonEmpty(leftStack),
							cause_reduce(
								[HashSet_empty(), esm_Chunk_empty()],
								([parallel, sequential], cause) => {
									const [par, seq] = evaluateCause(cause)
									return Option_some([
										Function_pipe(parallel, HashSet_union(par)),
										Function_pipe(sequential, Chunk_appendAll(seq)),
									])
								},
							),
						),
						[rightParallel, rightSequential] = Function_pipe(
							Chunk_headNonEmpty(rightStack),
							cause_reduce(
								[HashSet_empty(), esm_Chunk_empty()],
								([parallel, sequential], cause) => {
									const [par, seq] = evaluateCause(cause)
									return Option_some([
										Function_pipe(parallel, HashSet_union(par)),
										Function_pipe(sequential, Chunk_appendAll(seq)),
									])
								},
							),
						)
					if (!equals(leftParallel, rightParallel)) return !1
					leftStack = leftSequential
					rightStack = rightSequential
				}
				return !0
			},
			flattenCause = cause =>
				flattenCauseLoop(Chunk_of(cause), esm_Chunk_empty()),
			flattenCauseLoop = (causes, flattened) => {
				for (;;) {
					const [parallel, sequential] = Function_pipe(
							causes,
							Array_reduce(
								[HashSet_empty(), esm_Chunk_empty()],
								([parallel, sequential], cause) => {
									const [par, seq] = evaluateCause(cause)
									return [
										Function_pipe(parallel, HashSet_union(par)),
										Function_pipe(sequential, Chunk_appendAll(seq)),
									]
								},
							),
						),
						updated =
							HashSet_size(parallel) > 0
								? Function_pipe(flattened, Chunk_prepend(parallel))
								: flattened
					if (Chunk_isEmpty(sequential)) return Chunk_reverse(updated)
					causes = sequential
					flattened = updated
				}
				throw new Error(getBugErrorMessage("Cause.flattenCauseLoop"))
			},
			find = Function_dual(2, (self, pf) => {
				const stack = [self]
				for (; stack.length > 0; ) {
					const item = stack.pop(),
						option = pf(item)
					switch (option._tag) {
						case "None":
							switch (item._tag) {
								case "Sequential":
								case "Parallel":
									stack.push(item.right)
									stack.push(item.left)
							}
							break
						case "Some":
							return option
					}
				}
				return Option_none()
			}),
			evaluateCause = self => {
				let cause = self
				const stack = []
				let _parallel = HashSet_empty(),
					_sequential = esm_Chunk_empty()
				for (; void 0 !== cause; )
					switch (cause._tag) {
						case "Empty":
							if (0 === stack.length) return [_parallel, _sequential]
							cause = stack.pop()
							break
						case "Fail":
							_parallel = HashSet_add(
								_parallel,
								Chunk_make(cause._tag, cause.error),
							)
							if (0 === stack.length) return [_parallel, _sequential]
							cause = stack.pop()
							break
						case "Die":
							_parallel = HashSet_add(
								_parallel,
								Chunk_make(cause._tag, cause.defect),
							)
							if (0 === stack.length) return [_parallel, _sequential]
							cause = stack.pop()
							break
						case "Interrupt":
							_parallel = HashSet_add(
								_parallel,
								Chunk_make(cause._tag, cause.fiberId),
							)
							if (0 === stack.length) return [_parallel, _sequential]
							cause = stack.pop()
							break
						case "Sequential":
							switch (cause.left._tag) {
								case "Empty":
									cause = cause.right
									break
								case "Sequential":
									cause = sequential(
										cause.left.left,
										sequential(cause.left.right, cause.right),
									)
									break
								case "Parallel":
									cause = parallel(
										sequential(cause.left.left, cause.right),
										sequential(cause.left.right, cause.right),
									)
									break
								default:
									_sequential = Chunk_prepend(_sequential, cause.right)
									cause = cause.left
							}
							break
						case "Parallel":
							stack.push(cause.right)
							cause = cause.left
					}
				throw new Error(getBugErrorMessage("Cause.evaluateCauseLoop"))
			},
			IsInterruptedOnlyCauseReducer = {
				emptyCase: Function_constTrue,
				failCase: constFalse,
				dieCase: constFalse,
				interruptCase: Function_constTrue,
				sequentialCase: (_, left, right) => left && right,
				parallelCase: (_, left, right) => left && right,
			},
			cause_match = Function_dual(
				2,
				(
					self,
					{ onDie, onEmpty, onFail, onInterrupt, onParallel, onSequential },
				) =>
					reduceWithContext(self, void 0, {
						emptyCase: () => onEmpty,
						failCase: (_, error) => onFail(error),
						dieCase: (_, defect) => onDie(defect),
						interruptCase: (_, fiberId) => onInterrupt(fiberId),
						sequentialCase: (_, left, right) => onSequential(left, right),
						parallelCase: (_, left, right) => onParallel(left, right),
					}),
			),
			cause_reduce = Function_dual(3, (self, zero, pf) => {
				let accumulator = zero,
					cause = self
				const causes = []
				for (; void 0 !== cause; ) {
					const option = pf(accumulator, cause)
					accumulator = Option_isSome(option) ? option.value : accumulator
					switch (cause._tag) {
						case "Sequential":
						case "Parallel":
							causes.push(cause.right)
							cause = cause.left
							break
						default:
							cause = void 0
					}
					void 0 === cause && causes.length > 0 && (cause = causes.pop())
				}
				return accumulator
			}),
			reduceWithContext = Function_dual(3, (self, context, reducer) => {
				const input = [self],
					output = []
				for (; input.length > 0; ) {
					const cause = input.pop()
					switch (cause._tag) {
						case "Empty":
							output.push(Either_right(reducer.emptyCase(context)))
							break
						case "Fail":
							output.push(Either_right(reducer.failCase(context, cause.error)))
							break
						case "Die":
							output.push(Either_right(reducer.dieCase(context, cause.defect)))
							break
						case "Interrupt":
							output.push(
								Either_right(reducer.interruptCase(context, cause.fiberId)),
							)
							break
						case "Sequential":
							input.push(cause.right)
							input.push(cause.left)
							output.push(Either_left({ _tag: "SequentialCase" }))
							break
						case "Parallel":
							input.push(cause.right)
							input.push(cause.left)
							output.push(Either_left({ _tag: "ParallelCase" }))
					}
				}
				const accumulator = []
				for (; output.length > 0; ) {
					const either = output.pop()
					switch (either._tag) {
						case "Left":
							switch (either.left._tag) {
								case "SequentialCase": {
									const left = accumulator.pop(),
										right = accumulator.pop(),
										value = reducer.sequentialCase(context, left, right)
									accumulator.push(value)
									break
								}
								case "ParallelCase": {
									const left = accumulator.pop(),
										right = accumulator.pop(),
										value = reducer.parallelCase(context, left, right)
									accumulator.push(value)
									break
								}
							}
							break
						case "Right":
							accumulator.push(either.right)
					}
				}
				if (0 === accumulator.length)
					throw new Error(
						"BUG: Cause.reduceWithContext - please report an issue at https://github.com/Effect-TS/effect/issues",
					)
				return accumulator.pop()
			}),
			pretty = (cause, options) =>
				isInterruptedOnly(cause)
					? "All fibers interrupted without errors."
					: cause_prettyErrors(cause)
							.map(function (e) {
								return !0 !== options?.renderErrorCause || void 0 === e.cause
									? e.stack
									: `${e.stack} {\n${renderErrorCause(e.cause, "  ")}\n}`
							})
							.join("\n"),
			renderErrorCause = (cause, prefix) => {
				const lines = cause.stack.split("\n")
				let stack = `${prefix}[cause]: ${lines[0]}`
				for (let i = 1, len = lines.length; i < len; i++)
					stack += `\n${prefix}${lines[i]}`
				cause.cause &&
					(stack += ` {\n${renderErrorCause(cause.cause, `${prefix}  `)}\n${prefix}}`)
				return stack
			}
		class PrettyError extends globalThis.Error {
			span = void 0
			constructor(originalError) {
				const originalErrorIsObject =
						"object" == typeof originalError && null !== originalError,
					prevLimit = Error.stackTraceLimit
				Error.stackTraceLimit = 1
				super(
					prettyErrorMessage(originalError),
					originalErrorIsObject &&
						"cause" in originalError &&
						void 0 !== originalError.cause
						? { cause: new PrettyError(originalError.cause) }
						: void 0,
				)
				"" === this.message && (this.message = "An error has occurred")
				Error.stackTraceLimit = prevLimit
				this.name =
					originalError instanceof Error ? originalError.name : "Error"
				if (originalErrorIsObject) {
					spanSymbol in originalError && (this.span = originalError[spanSymbol])
					Object.keys(originalError).forEach(key => {
						key in this || (this[key] = originalError[key])
					})
				}
				this.stack = prettyErrorStack(
					`${this.name}: ${this.message}`,
					originalError instanceof Error && originalError.stack
						? originalError.stack
						: "",
					this.span,
				)
			}
		}
		const prettyErrorMessage = u => {
				if ("string" == typeof u) return u
				if ("object" == typeof u && null !== u && u instanceof Error)
					return u.message
				try {
					if (
						Predicate_hasProperty(u, "toString") &&
						Predicate_isFunction(u.toString) &&
						u.toString !== Object.prototype.toString &&
						u.toString !== globalThis.Array.prototype.toString
					)
						return u.toString()
				} catch {}
				return JSON.stringify(u)
			},
			locationRegex = /\((.*)\)/,
			spanToTrace = globalValue(
				"effect/Tracer/spanToTrace",
				() => new WeakMap(),
			),
			prettyErrorStack = (message, stack, span) => {
				const out = [message],
					lines = stack.startsWith(message)
						? stack.slice(message.length).split("\n")
						: stack.split("\n")
				for (
					let i = 1;
					i < lines.length && !lines[i].includes("Generator.next");
					i++
				) {
					if (lines[i].includes("effect_internal_function")) {
						out.pop()
						break
					}
					out.push(
						lines[i]
							.replace(/at .*effect_instruction_i.*\((.*)\)/, "at $1")
							.replace(/EffectPrimitive\.\w+/, "<anonymous>"),
					)
				}
				if (span) {
					let current = span,
						i = 0
					for (; current && "Span" === current._tag && i < 10; ) {
						const stackFn = spanToTrace.get(current)
						if ("function" == typeof stackFn) {
							const stack = stackFn()
							if ("string" == typeof stack) {
								const locationMatch = stack.match(locationRegex),
									location = locationMatch
										? locationMatch[1]
										: stack.replace(/^at /, "")
								out.push(`    at ${current.name} (${location})`)
							} else out.push(`    at ${current.name}`)
						} else out.push(`    at ${current.name}`)
						current = getOrUndefined(current.parent)
						i++
					}
				}
				return out.join("\n")
			},
			spanSymbol = Symbol.for("effect/SpanAnnotation"),
			cause_prettyErrors = cause =>
				reduceWithContext(cause, void 0, {
					emptyCase: () => [],
					dieCase: (_, unknownError) => [new PrettyError(unknownError)],
					failCase: (_, error) => [new PrettyError(error)],
					interruptCase: () => [],
					parallelCase: (_, l, r) => [...l, ...r],
					sequentialCase: (_, l, r) => [...l, ...r],
				}),
			DeferredTypeId = Symbol.for("effect/Deferred"),
			deferredVariance = { _E: _ => _, _A: _ => _ },
			done = effect => ({ _tag: "Done", effect })
		class singleShotGen_SingleShotGen {
			self
			called = !1
			constructor(self) {
				this.self = self
			}
			next(a) {
				return this.called
					? { value: a, done: !0 }
					: ((this.called = !0), { value: this.self, done: !1 })
			}
			return(a) {
				return { value: a, done: !0 }
			}
			throw(e) {
				throw e
			}
			[Symbol.iterator]() {
				return new singleShotGen_SingleShotGen(this.self)
			}
		}
		const TracerTypeId = Symbol.for("effect/Tracer"),
			tracer_make = options => ({ [TracerTypeId]: TracerTypeId, ...options }),
			tracerTag = GenericTag("effect/Tracer"),
			spanTag = GenericTag("effect/ParentSpan"),
			randomHexString = (function () {
				return function (length) {
					let result = ""
					for (let i = 0; i < length; i++)
						result += "abcdef0123456789".charAt(Math.floor(16 * Math.random()))
					return result
				}
			})()
		class NativeSpan {
			name
			parent
			context
			links
			startTime
			kind
			_tag = "Span"
			spanId
			traceId = "native"
			sampled = !0
			status
			attributes
			events = []
			constructor(name, parent, context, links, startTime, kind) {
				this.name = name
				this.parent = parent
				this.context = context
				this.links = links
				this.startTime = startTime
				this.kind = kind
				this.status = { _tag: "Started", startTime }
				this.attributes = new Map()
				this.traceId =
					"Some" === parent._tag ? parent.value.traceId : randomHexString(32)
				this.spanId = randomHexString(16)
			}
			end(endTime, exit) {
				this.status = {
					_tag: "Ended",
					endTime,
					exit,
					startTime: this.status.startTime,
				}
			}
			attribute(key, value) {
				this.attributes.set(key, value)
			}
			event(name, startTime, attributes) {
				this.events.push([name, startTime, attributes ?? {}])
			}
		}
		const nativeTracer = tracer_make({
				span: (name, parent, context, links, startTime, kind) =>
					new NativeSpan(name, parent, context, links, startTime, kind),
				context: f => f(),
			}),
			EffectErrorTypeId = Symbol.for("effect/EffectError"),
			isEffectError = u => Predicate_hasProperty(u, EffectErrorTypeId),
			blocked = (blockedRequests, _continue) => {
				const effect = new EffectPrimitive("Blocked")
				effect.effect_instruction_i0 = blockedRequests
				effect.effect_instruction_i1 = _continue
				return effect
			},
			core_EffectTypeId = Symbol.for("effect/Effect")
		class RevertFlags {
			patch
			op
			_op = "RevertFlags"
			constructor(patch, op) {
				this.patch = patch
				this.op = op
			}
		}
		class EffectPrimitive {
			_op
			effect_instruction_i0 = void 0
			effect_instruction_i1 = void 0
			effect_instruction_i2 = void 0
			trace = void 0;
			[core_EffectTypeId] = effectVariance
			constructor(_op) {
				this._op = _op
			}
			[Equal_symbol](that) {
				return this === that
			}
			[symbol]() {
				return cached(this, random(this))
			}
			pipe() {
				return Pipeable_pipeArguments(this, arguments)
			}
			toJSON() {
				return {
					_id: "Effect",
					_op: this._op,
					effect_instruction_i0: toJSON(this.effect_instruction_i0),
					effect_instruction_i1: toJSON(this.effect_instruction_i1),
					effect_instruction_i2: toJSON(this.effect_instruction_i2),
				}
			}
			toString() {
				return format(this.toJSON())
			}
			[Inspectable_NodeInspectSymbol]() {
				return this.toJSON()
			}
			[Symbol.iterator]() {
				return new singleShotGen_SingleShotGen(new YieldWrap(this))
			}
		}
		class EffectPrimitiveFailure {
			_op
			effect_instruction_i0 = void 0
			effect_instruction_i1 = void 0
			effect_instruction_i2 = void 0
			trace = void 0;
			[core_EffectTypeId] = effectVariance
			constructor(_op) {
				this._op = _op
				this._tag = _op
			}
			[Equal_symbol](that) {
				return (
					exitIsExit(that) &&
					"Failure" === that._op &&
					equals(this.effect_instruction_i0, that.effect_instruction_i0)
				)
			}
			[symbol]() {
				return Function_pipe(
					string(this._tag),
					combine(Hash_hash(this.effect_instruction_i0)),
					cached(this),
				)
			}
			get cause() {
				return this.effect_instruction_i0
			}
			pipe() {
				return Pipeable_pipeArguments(this, arguments)
			}
			toJSON() {
				return { _id: "Exit", _tag: this._op, cause: this.cause.toJSON() }
			}
			toString() {
				return format(this.toJSON())
			}
			[Inspectable_NodeInspectSymbol]() {
				return this.toJSON()
			}
			[Symbol.iterator]() {
				return new singleShotGen_SingleShotGen(new YieldWrap(this))
			}
		}
		class EffectPrimitiveSuccess {
			_op
			effect_instruction_i0 = void 0
			effect_instruction_i1 = void 0
			effect_instruction_i2 = void 0
			trace = void 0;
			[core_EffectTypeId] = effectVariance
			constructor(_op) {
				this._op = _op
				this._tag = _op
			}
			[Equal_symbol](that) {
				return (
					exitIsExit(that) &&
					"Success" === that._op &&
					equals(this.effect_instruction_i0, that.effect_instruction_i0)
				)
			}
			[symbol]() {
				return Function_pipe(
					string(this._tag),
					combine(Hash_hash(this.effect_instruction_i0)),
					cached(this),
				)
			}
			get value() {
				return this.effect_instruction_i0
			}
			pipe() {
				return Pipeable_pipeArguments(this, arguments)
			}
			toJSON() {
				return { _id: "Exit", _tag: this._op, value: toJSON(this.value) }
			}
			toString() {
				return format(this.toJSON())
			}
			[Inspectable_NodeInspectSymbol]() {
				return this.toJSON()
			}
			[Symbol.iterator]() {
				return new singleShotGen_SingleShotGen(new YieldWrap(this))
			}
		}
		const isEffect = u => Predicate_hasProperty(u, core_EffectTypeId),
			withFiberRuntime = withRuntime => {
				const effect = new EffectPrimitive("WithRuntime")
				effect.effect_instruction_i0 = withRuntime
				return effect
			},
			acquireUseRelease = Function_dual(3, (acquire, use, release) =>
				uninterruptibleMask(restore =>
					core_flatMap(acquire, a =>
						core_flatMap(core_exit(suspend(() => restore(use(a)))), exit =>
							suspend(() => release(a, exit)).pipe(
								matchCauseEffect({
									onFailure: cause => {
										switch (exit._tag) {
											case "Failure":
												return failCause(
													parallel(exit.effect_instruction_i0, cause),
												)
											case "Success":
												return failCause(cause)
										}
									},
									onSuccess: () => exit,
								}),
							),
						),
					),
				),
			),
			core_as = Function_dual(2, (self, value) =>
				core_flatMap(self, () => succeed(value)),
			),
			core_asVoid = self => core_as(self, void 0),
			custom = function () {
				const wrapper = new EffectPrimitive("Commit")
				switch (arguments.length) {
					case 2:
						wrapper.effect_instruction_i0 = arguments[0]
						wrapper.commit = arguments[1]
						break
					case 3:
						wrapper.effect_instruction_i0 = arguments[0]
						wrapper.effect_instruction_i1 = arguments[1]
						wrapper.commit = arguments[2]
						break
					case 4:
						wrapper.effect_instruction_i0 = arguments[0]
						wrapper.effect_instruction_i1 = arguments[1]
						wrapper.effect_instruction_i2 = arguments[2]
						wrapper.commit = arguments[3]
						break
					default:
						throw new Error(
							getBugErrorMessage("you're not supposed to end up here"),
						)
				}
				return wrapper
			},
			core_async = (register, blockingOn = FiberId_none) =>
				custom(register, function () {
					let backingResume, pendingEffect
					function proxyResume(effect) {
						backingResume
							? backingResume(effect)
							: void 0 === pendingEffect && (pendingEffect = effect)
					}
					const effect = new EffectPrimitive("Async")
					effect.effect_instruction_i0 = resume => {
						backingResume = resume
						pendingEffect && resume(pendingEffect)
					}
					effect.effect_instruction_i1 = blockingOn
					let cancelerRef, controllerRef
					if (1 !== this.effect_instruction_i0.length) {
						controllerRef = new AbortController()
						cancelerRef = internalCall(() =>
							this.effect_instruction_i0(proxyResume, controllerRef.signal),
						)
					} else
						cancelerRef = internalCall(() =>
							this.effect_instruction_i0(proxyResume),
						)
					return cancelerRef || controllerRef
						? onInterrupt(effect, _ => {
								controllerRef && controllerRef.abort()
								return cancelerRef ?? core_void_
							})
						: effect
				}),
			catchAll = Function_dual(2, (self, f) =>
				matchEffect(self, { onFailure: f, onSuccess: succeed }),
			),
			core_spanSymbol = Symbol.for("effect/SpanAnnotation"),
			originalSymbol = Symbol.for("effect/OriginalAnnotation"),
			capture = (obj, span) =>
				Option_isSome(span)
					? new Proxy(obj, {
							has: (target, p) =>
								p === core_spanSymbol || p === originalSymbol || p in target,
							get: (target, p) =>
								p === core_spanSymbol
									? span.value
									: p === originalSymbol
										? obj
										: target[p],
						})
					: obj,
			core_die = defect =>
				Predicate_isObject(defect) && !(core_spanSymbol in defect)
					? withFiberRuntime(fiber =>
							failCause(die(capture(defect, currentSpanFromFiber(fiber)))),
						)
					: failCause(die(defect)),
			core_either = self =>
				matchEffect(self, {
					onFailure: e => succeed(Either_left(e)),
					onSuccess: a => succeed(Either_right(a)),
				}),
			core_exit = self =>
				matchCause(self, { onFailure: exitFailCause, onSuccess: exitSucceed }),
			core_fail = error =>
				Predicate_isObject(error) && !(core_spanSymbol in error)
					? withFiberRuntime(fiber =>
							failCause(fail(capture(error, currentSpanFromFiber(fiber)))),
						)
					: failCause(fail(error)),
			failSync = evaluate => core_flatMap(sync(evaluate), core_fail),
			failCause = cause => {
				const effect = new EffectPrimitiveFailure("Failure")
				effect.effect_instruction_i0 = cause
				return effect
			},
			fiberId = withFiberRuntime(state => succeed(state.id())),
			fiberIdWith = f => withFiberRuntime(state => f(state.id())),
			core_flatMap = Function_dual(2, (self, f) => {
				const effect = new EffectPrimitive("OnSuccess")
				effect.effect_instruction_i0 = self
				effect.effect_instruction_i1 = f
				return effect
			}),
			step = self => {
				const effect = new EffectPrimitive("OnStep")
				effect.effect_instruction_i0 = self
				return effect
			},
			core_flatten = self => core_flatMap(self, Function_identity),
			matchCause = Function_dual(2, (self, options) =>
				matchCauseEffect(self, {
					onFailure: cause => succeed(options.onFailure(cause)),
					onSuccess: a => succeed(options.onSuccess(a)),
				}),
			),
			matchCauseEffect = Function_dual(2, (self, options) => {
				const effect = new EffectPrimitive("OnSuccessAndFailure")
				effect.effect_instruction_i0 = self
				effect.effect_instruction_i1 = options.onFailure
				effect.effect_instruction_i2 = options.onSuccess
				return effect
			}),
			matchEffect = Function_dual(2, (self, options) =>
				matchCauseEffect(self, {
					onFailure: cause => {
						if (cause_defects(cause).length > 0)
							return failCause(
								(self =>
									cause_match(self, {
										onEmpty: cause_empty,
										onFail: failure => die(failure),
										onDie: defect => die(defect),
										onInterrupt: fiberId => interrupt(fiberId),
										onSequential: (left, right) => sequential(left, right),
										onParallel: (left, right) => parallel(left, right),
									}))(cause),
							)
						const failures = (self =>
							Chunk_reverse(
								cause_reduce(self, esm_Chunk_empty(), (list, cause) =>
									"Fail" === cause._tag
										? Option_some(
												Function_pipe(list, Chunk_prepend(cause.error)),
											)
										: Option_none(),
								),
							))(cause)
						return failures.length > 0
							? options.onFailure(Chunk_unsafeHead(failures))
							: failCause(cause)
					},
					onSuccess: options.onSuccess,
				}),
			),
			forEachSequential = Function_dual(2, (self, f) =>
				suspend(() => {
					const arr = Array_fromIterable(self),
						ret = allocate(arr.length)
					let i = 0
					return core_as(
						whileLoop({
							while: () => i < arr.length,
							body: () => f(arr[i], i),
							step: b => {
								ret[i++] = b
							},
						}),
						ret,
					)
				}),
			),
			forEachSequentialDiscard = Function_dual(2, (self, f) =>
				suspend(() => {
					const arr = Array_fromIterable(self)
					let i = 0
					return whileLoop({
						while: () => i < arr.length,
						body: () => f(arr[i], i),
						step: () => {
							i++
						},
					})
				}),
			),
			core_interruptible = self => {
				const effect = new EffectPrimitive("UpdateRuntimeFlags")
				effect.effect_instruction_i0 = runtimeFlagsPatch_make((flag = 1), flag)
				var flag
				effect.effect_instruction_i1 = () => self
				return effect
			},
			core_map = Function_dual(2, (self, f) =>
				core_flatMap(self, a => sync(() => f(a))),
			),
			core_mapBoth = Function_dual(2, (self, options) =>
				matchEffect(self, {
					onFailure: e => failSync(() => options.onFailure(e)),
					onSuccess: a => sync(() => options.onSuccess(a)),
				}),
			),
			mapError = Function_dual(2, (self, f) =>
				matchCauseEffect(self, {
					onFailure: cause => {
						const either = failureOrCause(cause)
						switch (either._tag) {
							case "Left":
								return failSync(() => f(either.left))
							case "Right":
								return failCause(either.right)
						}
					},
					onSuccess: succeed,
				}),
			),
			onExit = Function_dual(2, (self, cleanup) =>
				uninterruptibleMask(restore =>
					matchCauseEffect(restore(self), {
						onFailure: cause1 => {
							const result = exitFailCause(cause1)
							return matchCauseEffect(cleanup(result), {
								onFailure: cause2 => exitFailCause(sequential(cause1, cause2)),
								onSuccess: () => result,
							})
						},
						onSuccess: success => {
							const result = exitSucceed(success)
							return core_zipRight(cleanup(result), result)
						},
					}),
				),
			),
			onInterrupt = Function_dual(2, (self, cleanup) =>
				onExit(
					self,
					exitMatch({
						onFailure: cause =>
							isInterruptedOnly(cause)
								? core_asVoid(
										cleanup(
											(self =>
												cause_reduce(self, HashSet_empty(), (set, cause) =>
													"Interrupt" === cause._tag
														? Option_some(
																Function_pipe(set, HashSet_add(cause.fiberId)),
															)
														: Option_none(),
												))(cause),
										),
									)
								: core_void_,
						onSuccess: () => core_void_,
					}),
				),
			),
			core_orElse = Function_dual(2, (self, that) =>
				attemptOrElse(self, that, succeed),
			),
			orDieWith = Function_dual(2, (self, f) =>
				matchEffect(self, {
					onFailure: e => core_die(f(e)),
					onSuccess: succeed,
				}),
			),
			succeed = value => {
				const effect = new EffectPrimitiveSuccess("Success")
				effect.effect_instruction_i0 = value
				return effect
			},
			suspend = effect => core_flatMap(sync(effect), Function_identity),
			sync = evaluate => {
				const effect = new EffectPrimitive("Sync")
				effect.effect_instruction_i0 = evaluate
				return effect
			},
			core_tap = Function_dual(2, (self, f) =>
				core_flatMap(self, a => {
					const b = "function" == typeof f ? f(a) : f
					return isEffect(b)
						? core_as(b, a)
						: Predicate_hasProperty((input = b), "then") &&
							  Predicate_isFunction(input.then)
							? core_async(resume => {
									b.then(
										_ => resume(succeed(a)),
										e => resume(core_fail(new UnknownException(e))),
									)
								})
							: succeed(a)
					var input
				}),
			),
			attemptOrElse = Function_dual(3, (self, that, onSuccess) =>
				matchCauseEffect(self, {
					onFailure: cause =>
						cause_defects(cause).length > 0
							? failCause(
									getOrThrow(
										(self =>
											cause_match(self, {
												onEmpty: Option_none(),
												onFail: failure => Option_some(die(failure)),
												onDie: defect => Option_some(die(defect)),
												onInterrupt: () => Option_none(),
												onSequential: (left, right) =>
													Option_isSome(left) && Option_isSome(right)
														? Option_some(sequential(left.value, right.value))
														: Option_isSome(left) && Option_isNone(right)
															? Option_some(left.value)
															: Option_isNone(left) && Option_isSome(right)
																? Option_some(right.value)
																: Option_none(),
												onParallel: (left, right) =>
													Option_isSome(left) && Option_isSome(right)
														? Option_some(parallel(left.value, right.value))
														: Option_isSome(left) && Option_isNone(right)
															? Option_some(left.value)
															: Option_isNone(left) && Option_isSome(right)
																? Option_some(right.value)
																: Option_none(),
											}))(cause),
									),
								)
							: that(),
					onSuccess,
				}),
			),
			uninterruptible = self => {
				const effect = new EffectPrimitive("UpdateRuntimeFlags")
				effect.effect_instruction_i0 = RuntimeFlagsPatch_disable(1)
				effect.effect_instruction_i1 = () => self
				return effect
			},
			uninterruptibleMask = f =>
				custom(f, function () {
					const effect = new EffectPrimitive("UpdateRuntimeFlags")
					effect.effect_instruction_i0 = RuntimeFlagsPatch_disable(1)
					effect.effect_instruction_i1 = oldFlags =>
						interruption(oldFlags)
							? internalCall(() =>
									this.effect_instruction_i0(core_interruptible),
								)
							: internalCall(() => this.effect_instruction_i0(uninterruptible))
					return effect
				}),
			core_void_ = succeed(void 0),
			whenEffect = Function_dual(2, (self, condition) =>
				core_flatMap(condition, b =>
					b
						? Function_pipe(self, core_map(Option_some))
						: succeed(Option_none()),
				),
			),
			whileLoop = options => {
				const effect = new EffectPrimitive("While")
				effect.effect_instruction_i0 = options.while
				effect.effect_instruction_i1 = options.body
				effect.effect_instruction_i2 = options.step
				return effect
			},
			withConcurrency = Function_dual(2, (self, concurrency) =>
				fiberRefLocally(self, currentConcurrency, concurrency),
			),
			withRuntimeFlags = Function_dual(2, (self, update) => {
				const effect = new EffectPrimitive("UpdateRuntimeFlags")
				effect.effect_instruction_i0 = update
				effect.effect_instruction_i1 = () => self
				return effect
			}),
			yieldNow = options => {
				const effect = new EffectPrimitive("Yield")
				return void 0 !== options?.priority
					? withSchedulingPriority(effect, options.priority)
					: effect
			},
			core_zip = Function_dual(2, (self, that) =>
				core_flatMap(self, a => core_map(that, b => [a, b])),
			),
			core_zipLeft = Function_dual(2, (self, that) =>
				core_flatMap(self, a => core_as(that, a)),
			),
			core_zipRight = Function_dual(2, (self, that) =>
				core_flatMap(self, () => that),
			),
			core_zipWith = Function_dual(3, (self, that, f) =>
				core_flatMap(self, a => core_map(that, b => f(a, b))),
			),
			interruptAsFiber = Function_dual(2, (self, fiberId) =>
				core_flatMap(self.interruptAsFork(fiberId), () => self.await),
			),
			logLevelFatal =
				(Number.MIN_SAFE_INTEGER,
				{
					_tag: "Fatal",
					syslog: 2,
					label: "FATAL",
					ordinal: 5e4,
					pipe() {
						return Pipeable_pipeArguments(this, arguments)
					},
				}),
			logLevelError = {
				_tag: "Error",
				syslog: 3,
				label: "ERROR",
				ordinal: 4e4,
				pipe() {
					return Pipeable_pipeArguments(this, arguments)
				},
			},
			logLevelWarning = {
				_tag: "Warning",
				syslog: 4,
				label: "WARN",
				ordinal: 3e4,
				pipe() {
					return Pipeable_pipeArguments(this, arguments)
				},
			},
			logLevelInfo = {
				_tag: "Info",
				syslog: 6,
				label: "INFO",
				ordinal: 2e4,
				pipe() {
					return Pipeable_pipeArguments(this, arguments)
				},
			},
			logLevelDebug = {
				_tag: "Debug",
				syslog: 7,
				label: "DEBUG",
				ordinal: 1e4,
				pipe() {
					return Pipeable_pipeArguments(this, arguments)
				},
			},
			logLevelTrace = {
				_tag: "Trace",
				syslog: 7,
				label: "TRACE",
				ordinal: 0,
				pipe() {
					return Pipeable_pipeArguments(this, arguments)
				},
			},
			FiberRefTypeId = (Number.MAX_SAFE_INTEGER, Symbol.for("effect/FiberRef")),
			fiberRefVariance = { _A: _ => _ },
			fiberRefGet = self => fiberRefModify(self, a => [a, a]),
			fiberRefGetWith = Function_dual(2, (self, f) =>
				core_flatMap(fiberRefGet(self), f),
			),
			fiberRefSet = Function_dual(2, (self, value) =>
				fiberRefModify(self, () => [void 0, value]),
			),
			fiberRefModify = Function_dual(2, (self, f) =>
				withFiberRuntime(state => {
					const [b, a] = f(state.getFiberRef(self))
					state.setFiberRef(self, a)
					return succeed(b)
				}),
			),
			fiberRefLocally = Function_dual(3, (use, self, value) =>
				acquireUseRelease(
					core_zipLeft(fiberRefGet(self), fiberRefSet(self, value)),
					() => use,
					oldValue => fiberRefSet(self, oldValue),
				),
			),
			fiberRefLocallyWith = Function_dual(3, (use, self, f) =>
				fiberRefGetWith(self, a => fiberRefLocally(use, self, f(a))),
			),
			fiberRefUnsafeMake = (initial, options) =>
				fiberRefUnsafeMakePatch(initial, {
					differ: differ_update(),
					fork: options?.fork ?? Function_identity,
					join: options?.join,
				}),
			fiberRefUnsafeMakeContext = initial => {
				const differ = differ_make({
					empty: differ_contextPatch_empty(),
					combine: (first, second) => contextPatch_combine(second)(first),
					diff: (oldValue, newValue) =>
						((oldValue, newValue) => {
							const missingServices = new Map(oldValue.unsafeMap)
							let patch = differ_contextPatch_empty()
							for (const [tag, newService] of newValue.unsafeMap.entries())
								if (missingServices.has(tag)) {
									const old = missingServices.get(tag)
									missingServices.delete(tag)
									equals(old, newService) ||
										(patch = contextPatch_combine(
											makeUpdateService(tag, () => newService),
										)(patch))
								} else {
									missingServices.delete(tag)
									patch = contextPatch_combine(makeAddService(tag, newService))(
										patch,
									)
								}
							for (const [tag] of missingServices.entries())
								patch = contextPatch_combine(makeRemoveService(tag))(patch)
							return patch
						})(oldValue, newValue),
					patch: (patch, oldValue) => contextPatch_patch(oldValue)(patch),
				})
				return fiberRefUnsafeMakePatch(initial, { differ, fork: differ.empty })
			},
			fiberRefUnsafeMakePatch = (initial, options) => ({
				[FiberRefTypeId]: fiberRefVariance,
				initial,
				diff: (oldValue, newValue) => options.differ.diff(oldValue, newValue),
				combine: (first, second) => options.differ.combine(first, second),
				patch: patch => oldValue => options.differ.patch(patch, oldValue),
				fork: options.fork,
				join: options.join ?? ((_, n) => n),
				pipe() {
					return Pipeable_pipeArguments(this, arguments)
				},
			}),
			fiberRefUnsafeMakeRuntimeFlags = initial =>
				fiberRefUnsafeMakePatch(initial, { differ, fork: differ.empty }),
			currentContext = globalValue(
				Symbol.for("effect/FiberRef/currentContext"),
				() => fiberRefUnsafeMakeContext(Context_empty()),
			),
			currentSchedulingPriority = globalValue(
				Symbol.for("effect/FiberRef/currentSchedulingPriority"),
				() => fiberRefUnsafeMake(0),
			),
			currentMaxOpsBeforeYield = globalValue(
				Symbol.for("effect/FiberRef/currentMaxOpsBeforeYield"),
				() => fiberRefUnsafeMake(2048),
			),
			currentLogAnnotations = globalValue(
				Symbol.for("effect/FiberRef/currentLogAnnotation"),
				() => fiberRefUnsafeMake(HashMap_empty()),
			),
			currentLogLevel = globalValue(
				Symbol.for("effect/FiberRef/currentLogLevel"),
				() => fiberRefUnsafeMake(logLevelInfo),
			),
			currentLogSpan = globalValue(
				Symbol.for("effect/FiberRef/currentLogSpan"),
				() => fiberRefUnsafeMake(List_empty()),
			),
			withSchedulingPriority = Function_dual(2, (self, scheduler) =>
				fiberRefLocally(self, currentSchedulingPriority, scheduler),
			),
			currentConcurrency = globalValue(
				Symbol.for("effect/FiberRef/currentConcurrency"),
				() => fiberRefUnsafeMake("unbounded"),
			),
			currentRequestBatching = globalValue(
				Symbol.for("effect/FiberRef/currentRequestBatching"),
				() => fiberRefUnsafeMake(!0),
			),
			currentUnhandledErrorLogLevel = globalValue(
				Symbol.for("effect/FiberRef/currentUnhandledErrorLogLevel"),
				() => fiberRefUnsafeMake(Option_some(logLevelDebug)),
			),
			currentMetricLabels = globalValue(
				Symbol.for("effect/FiberRef/currentMetricLabels"),
				() =>
					(initial => {
						const differ = (differ =>
							differ_make({
								empty: differ_readonlyArrayPatch_empty(),
								combine: (first, second) =>
									readonlyArrayPatch_combine(first, second),
								diff: (oldValue, newValue) =>
									(options => {
										let i = 0,
											patch = differ_readonlyArrayPatch_empty()
										for (
											;
											i < options.oldValue.length &&
											i < options.newValue.length;

										) {
											const oldElement = options.oldValue[i],
												newElement = options.newValue[i],
												valuePatch = options.differ.diff(oldElement, newElement)
											equals(valuePatch, options.differ.empty) ||
												(patch = readonlyArrayPatch_combine(
													patch,
													readonlyArrayPatch_makeUpdate(i, valuePatch),
												))
											i += 1
										}
										i < options.oldValue.length &&
											(patch = readonlyArrayPatch_combine(
												patch,
												((from, until) => {
													const o = Object.create(readonlyArrayPatch_SliceProto)
													o.from = 0
													o.until = until
													return o
												})(0, i),
											))
										i < options.newValue.length &&
											(patch = readonlyArrayPatch_combine(
												patch,
												(values => {
													const o = Object.create(
														readonlyArrayPatch_AppendProto,
													)
													o.values = values
													return o
												})(Array_drop(i)(options.newValue)),
											))
										return patch
									})({ oldValue, newValue, differ }),
								patch: (patch, oldValue) =>
									readonlyArrayPatch_patch(patch, oldValue, differ),
							}))(differ_update())
						return fiberRefUnsafeMakePatch([], { differ, fork: differ.empty })
					})(),
			),
			currentForkScopeOverride = globalValue(
				Symbol.for("effect/FiberRef/currentForkScopeOverride"),
				() =>
					fiberRefUnsafeMake(Option_none(), {
						fork: () => Option_none(),
						join: (parent, _) => parent,
					}),
			),
			currentInterruptedCause = globalValue(
				Symbol.for("effect/FiberRef/currentInterruptedCause"),
				() =>
					fiberRefUnsafeMake(cause_empty, {
						fork: () => cause_empty,
						join: (parent, _) => parent,
					}),
			),
			ScopeTypeId = Symbol.for("effect/Scope"),
			CloseableScopeTypeId = Symbol.for("effect/CloseableScope"),
			scopeAddFinalizerExit = (self, finalizer) => self.addFinalizer(finalizer),
			scopeClose = (self, exit) => self.close(exit),
			scopeFork = (self, strategy) => self.fork(strategy),
			YieldableError = (function () {
				class YieldableError extends globalThis.Error {
					commit() {
						return core_fail(this)
					}
					toJSON() {
						return { ...this }
					}
					[Inspectable_NodeInspectSymbol]() {
						return this.toString !== globalThis.Error.prototype.toString
							? this.stack
								? `${this.toString()}\n${this.stack.split("\n").slice(1).join("\n")}`
								: this.toString()
							: "Bun" in globalThis
								? pretty(fail(this), { renderErrorCause: !0 })
								: this
					}
				}
				Object.assign(YieldableError.prototype, StructuralCommitPrototype)
				return YieldableError
			})(),
			makeException = (proto, tag) => {
				class Base extends YieldableError {
					_tag = tag
				}
				Object.assign(Base.prototype, proto)
				Base.prototype.name = tag
				return Base
			},
			RuntimeExceptionTypeId = Symbol.for(
				"effect/Cause/errors/RuntimeException",
			),
			RuntimeException = makeException(
				{ [RuntimeExceptionTypeId]: RuntimeExceptionTypeId },
				"RuntimeException",
			),
			InterruptedExceptionTypeId = Symbol.for(
				"effect/Cause/errors/InterruptedException",
			),
			isInterruptedException = u =>
				Predicate_hasProperty(u, InterruptedExceptionTypeId),
			NoSuchElementExceptionTypeId = Symbol.for(
				"effect/Cause/errors/NoSuchElement",
			),
			NoSuchElementException = makeException(
				{ [NoSuchElementExceptionTypeId]: NoSuchElementExceptionTypeId },
				"NoSuchElementException",
			),
			UnknownExceptionTypeId = Symbol.for(
				"effect/Cause/errors/UnknownException",
			),
			UnknownException = (function () {
				class UnknownException extends YieldableError {
					cause
					_tag = "UnknownException"
					error
					constructor(cause, message) {
						super(message ?? "An unknown error occurred", { cause })
						this.cause = cause
						this.error = cause
					}
				}
				Object.assign(UnknownException.prototype, {
					[UnknownExceptionTypeId]: UnknownExceptionTypeId,
					name: "UnknownException",
				})
				return UnknownException
			})(),
			exitIsExit = u =>
				isEffect(u) &&
				"_tag" in u &&
				("Success" === u._tag || "Failure" === u._tag),
			exitAs = Function_dual(2, (self, value) => {
				switch (self._tag) {
					case "Failure":
						return exitFailCause(self.effect_instruction_i0)
					case "Success":
						return exitSucceed(value)
				}
			}),
			exitAsVoid = self => exitAs(self, void 0),
			exitCollectAll = (exits, options) =>
				exitCollectAllInternal(
					exits,
					options?.parallel ? parallel : sequential,
				),
			exitDie = defect => exitFailCause(die(defect)),
			exitFail = error => exitFailCause(fail(error)),
			exitFailCause = cause => {
				const effect = new EffectPrimitiveFailure("Failure")
				effect.effect_instruction_i0 = cause
				return effect
			},
			exitMap = Function_dual(2, (self, f) => {
				switch (self._tag) {
					case "Failure":
						return exitFailCause(self.effect_instruction_i0)
					case "Success":
						return exitSucceed(f(self.effect_instruction_i0))
				}
			}),
			exitMatch = Function_dual(2, (self, { onFailure, onSuccess }) => {
				switch (self._tag) {
					case "Failure":
						return onFailure(self.effect_instruction_i0)
					case "Success":
						return onSuccess(self.effect_instruction_i0)
				}
			}),
			exitMatchEffect = Function_dual(2, (self, { onFailure, onSuccess }) => {
				switch (self._tag) {
					case "Failure":
						return onFailure(self.effect_instruction_i0)
					case "Success":
						return onSuccess(self.effect_instruction_i0)
				}
			}),
			exitSucceed = value => {
				const effect = new EffectPrimitiveSuccess("Success")
				effect.effect_instruction_i0 = value
				return effect
			},
			exitVoid = exitSucceed(void 0),
			exitZipWith = Function_dual(3, (self, that, { onFailure, onSuccess }) => {
				switch (self._tag) {
					case "Failure":
						switch (that._tag) {
							case "Success":
								return exitFailCause(self.effect_instruction_i0)
							case "Failure":
								return exitFailCause(
									onFailure(
										self.effect_instruction_i0,
										that.effect_instruction_i0,
									),
								)
						}
					case "Success":
						switch (that._tag) {
							case "Success":
								return exitSucceed(
									onSuccess(
										self.effect_instruction_i0,
										that.effect_instruction_i0,
									),
								)
							case "Failure":
								return exitFailCause(that.effect_instruction_i0)
						}
				}
			}),
			exitCollectAllInternal = (exits, combineCauses) => {
				const list = Chunk_fromIterable(exits)
				return isNonEmpty(list)
					? Function_pipe(
							Chunk_tailNonEmpty(list),
							Array_reduce(
								Function_pipe(Chunk_headNonEmpty(list), exitMap(Chunk_of)),
								(accumulator, current) =>
									Function_pipe(
										accumulator,
										exitZipWith(current, {
											onSuccess: (list, value) =>
												Function_pipe(list, Chunk_prepend(value)),
											onFailure: combineCauses,
										}),
									),
							),
							exitMap(Chunk_reverse),
							exitMap(chunk => toReadonlyArray(chunk)),
							Option_some,
						)
					: Option_none()
			},
			deferredUnsafeMake = fiberId => {
				return {
					[DeferredTypeId]: deferredVariance,
					state: MutableRef_make(
						((joiners = []), { _tag: "Pending", joiners }),
					),
					blockingOn: fiberId,
					pipe() {
						return Pipeable_pipeArguments(this, arguments)
					},
				}
				var joiners
			},
			deferredAwait = self =>
				core_async(resume => {
					const state = MutableRef_get(self.state)
					switch (state._tag) {
						case "Done":
							return resume(state.effect)
						case "Pending":
							state.joiners.push(resume)
							return deferredInterruptJoiner(self, resume)
					}
				}, self.blockingOn),
			deferredCompleteWith = Function_dual(2, (self, effect) =>
				sync(() => {
					const state = MutableRef_get(self.state)
					switch (state._tag) {
						case "Done":
							return !1
						case "Pending":
							MutableRef_set(self.state, done(effect))
							for (let i = 0, len = state.joiners.length; i < len; i++)
								state.joiners[i](effect)
							return !0
					}
				}),
			),
			deferredFailCause = Function_dual(2, (self, cause) =>
				deferredCompleteWith(self, failCause(cause)),
			),
			deferredSucceed = Function_dual(2, (self, value) =>
				deferredCompleteWith(self, succeed(value)),
			),
			deferredUnsafeDone = (self, effect) => {
				const state = MutableRef_get(self.state)
				if ("Pending" === state._tag) {
					MutableRef_set(self.state, done(effect))
					for (let i = 0, len = state.joiners.length; i < len; i++)
						state.joiners[i](effect)
				}
			},
			deferredInterruptJoiner = (self, joiner) =>
				sync(() => {
					const state = MutableRef_get(self.state)
					if ("Pending" === state._tag) {
						const index = state.joiners.indexOf(joiner)
						index >= 0 && state.joiners.splice(index, 1)
					}
				}),
			constContext = fiberRefGet(currentContext),
			contextWithEffect = f => core_flatMap(constContext, f),
			provideContext = Function_dual(2, (self, context) =>
				fiberRefLocally(currentContext, context)(self),
			),
			provideSomeContext = Function_dual(2, (self, context) =>
				fiberRefLocallyWith(currentContext, parent =>
					Context_merge(parent, context),
				)(self),
			),
			mapInputContext = Function_dual(2, (self, f) =>
				contextWithEffect(context => provideContext(self, f(context))),
			),
			currentSpanFromFiber = fiber => {
				const span = fiber
					.getFiberRef(currentContext)
					.unsafeMap.get(spanTag.key)
				return void 0 !== span && "Span" === span._tag
					? Option_some(span)
					: Option_none()
			},
			ClockTypeId = Symbol.for("effect/Clock"),
			clockTag = GenericTag("effect/Clock"),
			globalClockScheduler = {
				unsafeSchedule(task, duration) {
					const millis = toMillis(duration)
					if (millis > 2147483647) return constFalse
					let completed = !1
					const handle = setTimeout(() => {
						completed = !0
						task()
					}, millis)
					return () => {
						clearTimeout(handle)
						return !completed
					}
				},
			},
			performanceNowNanos = (function () {
				const bigint1e6 = BigInt(1e6)
				if ("undefined" == typeof performance)
					return () => BigInt(Date.now()) * bigint1e6
				if (
					"number" == typeof performance.timeOrigin &&
					0 === performance.timeOrigin
				)
					return () => BigInt(Math.round(1e6 * performance.now()))
				const origin =
					BigInt(Date.now()) * bigint1e6 -
					BigInt(Math.round(1e6 * performance.now()))
				return () => origin + BigInt(Math.round(1e6 * performance.now()))
			})(),
			processOrPerformanceNow = (function () {
				const processHrtime =
					"object" == typeof process &&
					"hrtime" in process &&
					"function" == typeof process.hrtime.bigint
						? process.hrtime
						: void 0
				if (!processHrtime) return performanceNowNanos
				const origin = performanceNowNanos() - processHrtime.bigint()
				return () => origin + processHrtime.bigint()
			})()
		class ClockImpl {
			[ClockTypeId] = ClockTypeId
			unsafeCurrentTimeMillis() {
				return Date.now()
			}
			unsafeCurrentTimeNanos() {
				return processOrPerformanceNow()
			}
			currentTimeMillis = sync(() => this.unsafeCurrentTimeMillis())
			currentTimeNanos = sync(() => this.unsafeCurrentTimeNanos())
			scheduler() {
				return succeed(globalClockScheduler)
			}
			sleep(duration) {
				return core_async(resume => {
					const canceler = globalClockScheduler.unsafeSchedule(
						() => resume(core_void_),
						duration,
					)
					return core_asVoid(sync(canceler))
				})
			}
		}
		const clock_make = () => new ClockImpl(),
			Number_Order = Order_number,
			Number_clamp = clamp(Number_Order),
			RegExp_escape = string => string.replace(/[/\\^$*+?.()|[\]{}]/g, "\\$&"),
			ConfigErrorTypeId = Symbol.for("effect/ConfigError"),
			configError_proto = {
				_tag: "ConfigError",
				[ConfigErrorTypeId]: ConfigErrorTypeId,
			},
			And = (self, that) => {
				const error = Object.create(configError_proto)
				error._op = "And"
				error.left = self
				error.right = that
				Object.defineProperty(error, "toString", {
					enumerable: !1,
					value() {
						return `${this.left} and ${this.right}`
					},
				})
				return error
			},
			Or = (self, that) => {
				const error = Object.create(configError_proto)
				error._op = "Or"
				error.left = self
				error.right = that
				Object.defineProperty(error, "toString", {
					enumerable: !1,
					value() {
						return `${this.left} or ${this.right}`
					},
				})
				return error
			},
			InvalidData = (path, message, options = { pathDelim: "." }) => {
				const error = Object.create(configError_proto)
				error._op = "InvalidData"
				error.path = path
				error.message = message
				Object.defineProperty(error, "toString", {
					enumerable: !1,
					value() {
						return `(Invalid data at ${Function_pipe(this.path, join(options.pathDelim))}: "${this.message}")`
					},
				})
				return error
			},
			MissingData = (path, message, options = { pathDelim: "." }) => {
				const error = Object.create(configError_proto)
				error._op = "MissingData"
				error.path = path
				error.message = message
				Object.defineProperty(error, "toString", {
					enumerable: !1,
					value() {
						return `(Missing data at ${Function_pipe(this.path, join(options.pathDelim))}: "${this.message}")`
					},
				})
				return error
			},
			SourceUnavailable = (
				path,
				message,
				cause,
				options = { pathDelim: "." },
			) => {
				const error = Object.create(configError_proto)
				error._op = "SourceUnavailable"
				error.path = path
				error.message = message
				error.cause = cause
				Object.defineProperty(error, "toString", {
					enumerable: !1,
					value() {
						return `(Source unavailable at ${Function_pipe(this.path, join(options.pathDelim))}: "${this.message}")`
					},
				})
				return error
			},
			Unsupported = (path, message, options = { pathDelim: "." }) => {
				const error = Object.create(configError_proto)
				error._op = "Unsupported"
				error.path = path
				error.message = message
				Object.defineProperty(error, "toString", {
					enumerable: !1,
					value() {
						return `(Unsupported operation at ${Function_pipe(this.path, join(options.pathDelim))}: "${this.message}")`
					},
				})
				return error
			},
			prefixed = Function_dual(2, (self, prefix) => {
				switch (self._op) {
					case "And":
						return And(
							prefixed(self.left, prefix),
							prefixed(self.right, prefix),
						)
					case "Or":
						return Or(prefixed(self.left, prefix), prefixed(self.right, prefix))
					case "InvalidData":
						return InvalidData([...prefix, ...self.path], self.message)
					case "MissingData":
						return MissingData([...prefix, ...self.path], self.message)
					case "SourceUnavailable":
						return SourceUnavailable(
							[...prefix, ...self.path],
							self.message,
							self.cause,
						)
					case "Unsupported":
						return Unsupported([...prefix, ...self.path], self.message)
				}
			}),
			pathPatch_empty = { _tag: "Empty" },
			patch = Function_dual(2, (path, patch) => {
				let input = List_of(patch),
					output = path
				for (; isCons(input); ) {
					const patch = input.head
					switch (patch._tag) {
						case "Empty":
							input = input.tail
							break
						case "AndThen":
							input = cons(patch.first, cons(patch.second, input.tail))
							break
						case "MapName":
							output = Array_map(output, patch.f)
							input = input.tail
							break
						case "Nested":
							output = Array_prepend(output, patch.name)
							input = input.tail
							break
						case "Unnested":
							if (!Function_pipe(Array_head(output), contains(patch.name)))
								return Either_left(
									MissingData(
										output,
										`Expected ${patch.name} to be in path in ConfigProvider#unnested`,
									),
								)
							output = tailNonEmpty(output)
							input = input.tail
					}
				}
				return Either_right(output)
			}),
			concat = (l, r) => [...l, ...r],
			ConfigProviderTypeId = Symbol.for("effect/ConfigProvider"),
			configProviderTag = GenericTag("effect/ConfigProvider"),
			FlatConfigProviderTypeId = Symbol.for("effect/ConfigProviderFlat"),
			configProvider_make = options => ({
				[ConfigProviderTypeId]: ConfigProviderTypeId,
				pipe() {
					return Pipeable_pipeArguments(this, arguments)
				},
				...options,
			}),
			fromEnv = config => {
				const { pathDelim, seqDelim } = Object.assign(
						{},
						{ pathDelim: "_", seqDelim: "," },
						config,
					),
					getEnv = () =>
						"undefined" != typeof process &&
						"env" in process &&
						"object" == typeof process.env
							? process.env
							: {}
				return (
					(flat =
						((options = {
							load: (path, primitive, split = !0) => {
								const pathString = (path =>
										Function_pipe(path, join(pathDelim)))(path),
									current = getEnv()
								return Function_pipe(
									pathString in current
										? Option_some(current[pathString])
										: Option_none(),
									mapError(() =>
										MissingData(
											path,
											`Expected ${pathString} to exist in the process context`,
										),
									),
									core_flatMap(value =>
										parsePrimitive(value, path, primitive, seqDelim, split),
									),
								)
							},
							enumerateChildren: path =>
								sync(() => {
									const current = getEnv(),
										filteredKeyPaths = Object.keys(current)
											.map(value => value.toUpperCase().split(pathDelim))
											.filter(keyPath => {
												for (let i = 0; i < path.length; i++) {
													const pathComponent = Function_pipe(
															path,
															Array_unsafeGet(i),
														),
														currentElement = keyPath[i]
													if (
														void 0 === currentElement ||
														pathComponent !== currentElement
													)
														return !1
												}
												return !0
											})
											.flatMap(keyPath =>
												keyPath.slice(path.length, path.length + 1),
											)
									return (elements => {
										const set = hashSet_beginMutation(internal_hashSet_empty())
										for (const value of elements) hashSet_add(set, value)
										return hashSet_endMutation(set)
									})(filteredKeyPaths)
								}),
							patch: pathPatch_empty,
						}),
						{
							[FlatConfigProviderTypeId]: FlatConfigProviderTypeId,
							patch: options.patch,
							load: (path, config, split = !0) =>
								options.load(path, config, split),
							enumerateChildren: options.enumerateChildren,
						})),
					configProvider_make({
						load: config =>
							core_flatMap(fromFlatLoop(flat, [], config, !1), chunk =>
								match(Array_head(chunk), {
									onNone: () =>
										core_fail(
											MissingData(
												[],
												`Expected a single value having structure: ${config}`,
											),
										),
									onSome: succeed,
								}),
							),
						flattened: flat,
					})
				)
				var flat, options
			},
			fromFlatLoop = (flat, prefix, config, split) => {
				const op = config
				switch (op._tag) {
					case "Constant":
						return succeed(Array_of(op.value))
					case "Described":
						return suspend(() => fromFlatLoop(flat, prefix, op.config, split))
					case "Fail":
						return core_fail(MissingData(prefix, op.message))
					case "Fallback":
						return Function_pipe(
							suspend(() => fromFlatLoop(flat, prefix, op.first, split)),
							catchAll(error1 =>
								op.condition(error1)
									? Function_pipe(
											fromFlatLoop(flat, prefix, op.second, split),
											catchAll(error2 => core_fail(Or(error1, error2))),
										)
									: core_fail(error1),
							),
						)
					case "Lazy":
						return suspend(() => fromFlatLoop(flat, prefix, op.config(), split))
					case "MapOrFail":
						return suspend(() =>
							Function_pipe(
								fromFlatLoop(flat, prefix, op.original, split),
								core_flatMap(
									forEachSequential(a =>
										Function_pipe(
											op.mapOrFail(a),
											mapError(
												prefixed(
													((path, config) => {
														let op = config
														if ("Nested" === op._tag) {
															const out = path.slice()
															for (; "Nested" === op._tag; ) {
																out.push(op.name)
																op = op.config
															}
															return out
														}
														return path
													})(prefix, op.original),
												),
											),
										),
									),
								),
							),
						)
					case "Nested":
						return suspend(() =>
							fromFlatLoop(
								flat,
								concat(prefix, Array_of(op.name)),
								op.config,
								split,
							),
						)
					case "Primitive":
						return Function_pipe(
							patch(prefix, flat.patch),
							core_flatMap(prefix =>
								Function_pipe(
									flat.load(prefix, op, split),
									core_flatMap(values => {
										if (0 === values.length) {
											const name = Function_pipe(
												(self =>
													isNonEmptyReadonlyArray(self)
														? Option_some(lastNonEmpty(self))
														: Option_none())(prefix),
												getOrElse(() => "<n/a>"),
											)
											return core_fail(
												MissingData(
													[],
													`Expected ${op.description} with name ${name}`,
												),
											)
										}
										return succeed(values)
									}),
								),
							),
						)
					case "Sequence":
						return Function_pipe(
							patch(prefix, flat.patch),
							core_flatMap(patchedPrefix =>
								Function_pipe(
									flat.enumerateChildren(patchedPrefix),
									core_flatMap(indicesFrom),
									core_flatMap(indices =>
										0 === indices.length
											? suspend(() =>
													core_map(
														fromFlatLoop(flat, patchedPrefix, op.config, !0),
														Array_of,
													),
												)
											: Function_pipe(
													forEachSequential(indices, index =>
														fromFlatLoop(
															flat,
															Array_append(prefix, `[${index}]`),
															op.config,
															!0,
														),
													),
													core_map(chunkChunk => {
														const flattened = Array_flatten(chunkChunk)
														return 0 === flattened.length
															? Array_of([])
															: Array_of(flattened)
													}),
												),
									),
								),
							),
						)
					case "HashMap":
						return suspend(() =>
							Function_pipe(
								patch(prefix, flat.patch),
								core_flatMap(prefix =>
									Function_pipe(
										flat.enumerateChildren(prefix),
										core_flatMap(keys =>
											Function_pipe(
												keys,
												forEachSequential(key =>
													fromFlatLoop(
														flat,
														concat(prefix, Array_of(key)),
														op.valueConfig,
														split,
													),
												),
												core_map(matrix =>
													0 === matrix.length
														? Array_of(HashMap_empty())
														: Function_pipe(
																transpose(matrix),
																Array_map(values =>
																	(entries => {
																		const map = beginMutation(
																			internal_hashMap_empty(),
																		)
																		for (const entry of entries)
																			hashMap_set(map, entry[0], entry[1])
																		return (self => {
																			self._editable = !1
																			return self
																		})(map)
																	})(
																		Array_zip(Array_fromIterable(keys), values),
																	),
																),
															),
												),
											),
										),
									),
								),
							),
						)
					case "ZipWith":
						return suspend(() =>
							Function_pipe(
								fromFlatLoop(flat, prefix, op.left, split),
								core_either,
								core_flatMap(left =>
									Function_pipe(
										fromFlatLoop(flat, prefix, op.right, split),
										core_either,
										core_flatMap(right => {
											if (Either_isLeft(left) && Either_isLeft(right))
												return core_fail(And(left.left, right.left))
											if (Either_isLeft(left) && Either_isRight(right))
												return core_fail(left.left)
											if (Either_isRight(left) && Either_isLeft(right))
												return core_fail(right.left)
											if (Either_isRight(left) && Either_isRight(right)) {
												const path = Function_pipe(prefix, join(".")),
													fail = fromFlatLoopFail(prefix, path),
													[lefts, rights] = ((
														leftDef,
														rightDef,
														left,
														right,
													) => {
														const leftPad = Array_unfold(left.length, index =>
																index >= right.length
																	? Option_none()
																	: Option_some([leftDef(index), index + 1]),
															),
															rightPad = Array_unfold(right.length, index =>
																index >= left.length
																	? Option_none()
																	: Option_some([rightDef(index), index + 1]),
															)
														return [
															concat(left, leftPad),
															concat(right, rightPad),
														]
													})(
														fail,
														fail,
														Function_pipe(left.right, Array_map(Either_right)),
														Function_pipe(right.right, Array_map(Either_right)),
													)
												return Function_pipe(
													lefts,
													Array_zip(rights),
													forEachSequential(([left, right]) =>
														Function_pipe(
															core_zip(left, right),
															core_map(([left, right]) => op.zip(left, right)),
														),
													),
												)
											}
											throw new Error(
												"BUG: ConfigProvider.fromFlatLoop - please report an issue at https://github.com/Effect-TS/effect/issues",
											)
										}),
									),
								),
							),
						)
				}
			},
			fromFlatLoopFail = (prefix, path) => index =>
				Either_left(
					MissingData(
						prefix,
						`The element at index ${index} in a sequence at path "${path}" was missing`,
					),
				),
			parsePrimitive = (text, path, primitive, delimiter, split) =>
				split
					? Function_pipe(
							((text, delim) =>
								text.split(new RegExp(`\\s*${RegExp_escape(delim)}\\s*`)))(
								text,
								delimiter,
							),
							forEachSequential(char => primitive.parse(char.trim())),
							mapError(prefixed(path)),
						)
					: Function_pipe(
							primitive.parse(text),
							core_mapBoth({ onFailure: prefixed(path), onSuccess: Array_of }),
						),
			transpose = array =>
				Object.keys(array[0]).map(column => array.map(row => row[column])),
			indicesFrom = quotedIndices =>
				Function_pipe(
					forEachSequential(quotedIndices, parseQuotedIndex),
					core_mapBoth({ onFailure: () => [], onSuccess: sort(Number_Order) }),
					core_either,
					core_map(Either_merge),
				),
			QUOTED_INDEX_REGEX = /^(\[(\d+)\])$/,
			parseQuotedIndex = str => {
				const match = str.match(QUOTED_INDEX_REGEX)
				if (null !== match) {
					const matchedIndex = match[2]
					return Function_pipe(
						void 0 !== matchedIndex && matchedIndex.length > 0
							? Option_some(matchedIndex)
							: Option_none(),
						flatMap(parseInteger),
					)
				}
				return Option_none()
			},
			parseInteger = str => {
				const parsedIndex = Number.parseInt(str)
				return Number.isNaN(parsedIndex)
					? Option_none()
					: Option_some(parsedIndex)
			},
			console_TypeId = Symbol.for("effect/Console"),
			consoleTag = GenericTag("effect/Console"),
			defaultConsole = {
				[console_TypeId]: console_TypeId,
				assert: (condition, ...args) =>
					sync(() => {
						console.assert(condition, ...args)
					}),
				clear: sync(() => {
					console.clear()
				}),
				count: label =>
					sync(() => {
						console.count(label)
					}),
				countReset: label =>
					sync(() => {
						console.countReset(label)
					}),
				debug: (...args) =>
					sync(() => {
						console.debug(...args)
					}),
				dir: (item, options) =>
					sync(() => {
						console.dir(item, options)
					}),
				dirxml: (...args) =>
					sync(() => {
						console.dirxml(...args)
					}),
				error: (...args) =>
					sync(() => {
						console.error(...args)
					}),
				group: options =>
					sync(
						options?.collapsed
							? () => console.groupCollapsed(options?.label)
							: () => console.group(options?.label),
					),
				groupEnd: sync(() => {
					console.groupEnd()
				}),
				info: (...args) =>
					sync(() => {
						console.info(...args)
					}),
				log: (...args) =>
					sync(() => {
						console.log(...args)
					}),
				table: (tabularData, properties) =>
					sync(() => {
						console.table(tabularData, properties)
					}),
				time: label => sync(() => console.time(label)),
				timeEnd: label => sync(() => console.timeEnd(label)),
				timeLog: (label, ...args) =>
					sync(() => {
						console.timeLog(label, ...args)
					}),
				trace: (...args) =>
					sync(() => {
						console.trace(...args)
					}),
				warn: (...args) =>
					sync(() => {
						console.warn(...args)
					}),
				unsafe: console,
			},
			RandomTypeId = Symbol.for("effect/Random"),
			randomTag = GenericTag("effect/Random")
		class RandomImpl {
			seed;
			[RandomTypeId] = RandomTypeId
			PRNG
			constructor(seed) {
				this.seed = seed
				this.PRNG = new PCGRandom(seed)
			}
			get next() {
				return sync(() => this.PRNG.number())
			}
			get nextBoolean() {
				return core_map(this.next, n => n > 0.5)
			}
			get nextInt() {
				return sync(() => this.PRNG.integer(Number.MAX_SAFE_INTEGER))
			}
			nextRange(min, max) {
				return core_map(this.next, n => (max - min) * n + min)
			}
			nextIntBetween(min, max) {
				return sync(() => this.PRNG.integer(max - min) + min)
			}
			shuffle(elements) {
				return shuffleWith(elements, n => this.nextIntBetween(0, n))
			}
		}
		const shuffleWith = (elements, nextIntBounded) =>
				suspend(() =>
					Function_pipe(
						sync(() => Array.from(elements)),
						core_flatMap(buffer => {
							const numbers = []
							for (let i = buffer.length; i >= 2; i -= 1) numbers.push(i)
							return Function_pipe(
								numbers,
								forEachSequentialDiscard(n =>
									Function_pipe(
										nextIntBounded(n),
										core_map(k => random_swap(buffer, n - 1, k)),
									),
								),
								core_as(Chunk_fromIterable(buffer)),
							)
						}),
					),
				),
			random_swap = (buffer, index1, index2) => {
				const tmp = buffer[index1]
				buffer[index1] = buffer[index2]
				buffer[index2] = tmp
				return buffer
			},
			random_make = seed => new RandomImpl(Hash_hash(seed)),
			liveServices = Function_pipe(
				Context_empty(),
				Context_add(clockTag, clock_make()),
				Context_add(consoleTag, defaultConsole),
				Context_add(randomTag, random_make(Math.random())),
				Context_add(configProviderTag, fromEnv()),
				Context_add(tracerTag, nativeTracer),
			),
			currentServices = globalValue(
				Symbol.for("effect/DefaultServices/currentServices"),
				() => fiberRefUnsafeMakeContext(liveServices),
			),
			clockWith = f =>
				fiberRefGetWith(currentServices, services =>
					f(Context_get(services, clockTag)),
				),
			currentTimeMillis = clockWith(clock => clock.currentTimeMillis),
			Boolean_Order = Order_boolean,
			Effectable_EffectTypeId = EffectTypeId,
			executionStrategy_sequential = { _tag: "Sequential" },
			ExecutionStrategy_sequential = executionStrategy_sequential,
			ExecutionStrategy_parallel = { _tag: "Parallel" },
			ExecutionStrategy_parallelN = parallelism => ({
				_tag: "ParallelN",
				parallelism,
			}),
			FiberRefsSym = Symbol.for("effect/FiberRefs")
		class FiberRefsImpl {
			locals;
			[FiberRefsSym] = FiberRefsSym
			constructor(locals) {
				this.locals = locals
			}
			pipe() {
				return Pipeable_pipeArguments(this, arguments)
			}
		}
		const joinAs = Function_dual(3, (self, fiberId, that) => {
				const parentFiberRefs = new Map(self.locals)
				that.locals.forEach((childStack, fiberRef) => {
					const childValue = childStack[0][1]
					if (!childStack[0][0][Equal_symbol](fiberId)) {
						if (!parentFiberRefs.has(fiberRef)) {
							if (equals(childValue, fiberRef.initial)) return
							parentFiberRefs.set(fiberRef, [
								[fiberId, fiberRef.join(fiberRef.initial, childValue)],
							])
							return
						}
						const parentStack = parentFiberRefs.get(fiberRef),
							[ancestor, wasModified] = ((
								_ref,
								_parentStack,
								_childStack,
								_childModified = !1,
							) => {
								const ref = _ref
								let ret,
									parentStack = _parentStack,
									childStack = _childStack,
									childModified = _childModified
								for (; void 0 === ret; )
									if (
										isNonEmptyReadonlyArray(parentStack) &&
										isNonEmptyReadonlyArray(childStack)
									) {
										const parentFiberId = headNonEmpty(parentStack)[0],
											parentAncestors = tailNonEmpty(parentStack),
											childFiberId = headNonEmpty(childStack)[0],
											childRefValue = headNonEmpty(childStack)[1],
											childAncestors = tailNonEmpty(childStack)
										if (
											parentFiberId.startTimeMillis <
											childFiberId.startTimeMillis
										) {
											childStack = childAncestors
											childModified = !0
										} else if (
											parentFiberId.startTimeMillis >
											childFiberId.startTimeMillis
										)
											parentStack = parentAncestors
										else if (parentFiberId.id < childFiberId.id) {
											childStack = childAncestors
											childModified = !0
										} else
											parentFiberId.id > childFiberId.id
												? (parentStack = parentAncestors)
												: (ret = [childRefValue, childModified])
									} else ret = [ref.initial, !0]
								return ret
							})(fiberRef, parentStack, childStack)
						if (wasModified) {
							const patch = fiberRef.diff(ancestor, childValue),
								oldValue = parentStack[0][1],
								newValue = fiberRef.join(
									oldValue,
									fiberRef.patch(patch)(oldValue),
								)
							if (!equals(oldValue, newValue)) {
								let newStack
								const parentFiberId = parentStack[0][0]
								newStack = parentFiberId[Equal_symbol](fiberId)
									? [[parentFiberId, newValue], ...parentStack.slice(1)]
									: [[fiberId, newValue], ...parentStack]
								parentFiberRefs.set(fiberRef, newStack)
							}
						}
					}
				})
				return new FiberRefsImpl(parentFiberRefs)
			}),
			forkAs = Function_dual(2, (self, childId) => {
				const map = new Map()
				unsafeForkAs(self, map, childId)
				return new FiberRefsImpl(map)
			}),
			unsafeForkAs = (self, map, fiberId) => {
				self.locals.forEach((stack, fiberRef) => {
					const oldValue = stack[0][1],
						newValue = fiberRef.patch(fiberRef.fork)(oldValue)
					equals(oldValue, newValue)
						? map.set(fiberRef, stack)
						: map.set(fiberRef, [[fiberId, newValue], ...stack])
				})
			},
			delete_ = Function_dual(2, (self, fiberRef) => {
				const locals = new Map(self.locals)
				locals.delete(fiberRef)
				return new FiberRefsImpl(locals)
			}),
			fiberRefs_get = Function_dual(2, (self, fiberRef) =>
				self.locals.has(fiberRef)
					? Option_some(headNonEmpty(self.locals.get(fiberRef))[1])
					: Option_none(),
			),
			getOrDefault = Function_dual(2, (self, fiberRef) =>
				Function_pipe(
					fiberRefs_get(self, fiberRef),
					getOrElse(() => fiberRef.initial),
				),
			),
			updateAs = Function_dual(2, (self, { fiberId, fiberRef, value }) => {
				if (0 === self.locals.size)
					return new FiberRefsImpl(new Map([[fiberRef, [[fiberId, value]]]]))
				const locals = new Map(self.locals)
				unsafeUpdateAs(locals, fiberId, fiberRef, value)
				return new FiberRefsImpl(locals)
			}),
			unsafeUpdateAs = (locals, fiberId, fiberRef, value) => {
				const oldStack = locals.get(fiberRef) ?? []
				let newStack
				if (isNonEmptyReadonlyArray(oldStack)) {
					const [currentId, currentValue] = headNonEmpty(oldStack)
					if (currentId[Equal_symbol](fiberId)) {
						if (equals(currentValue, value)) return
						newStack = [[fiberId, value], ...oldStack.slice(1)]
					} else newStack = [[fiberId, value], ...oldStack]
				} else newStack = [[fiberId, value]]
				locals.set(fiberRef, newStack)
			},
			updateManyAs = Function_dual(2, (self, { entries, forkAs }) => {
				if (0 === self.locals.size) return new FiberRefsImpl(new Map(entries))
				const locals = new Map(self.locals)
				void 0 !== forkAs && unsafeForkAs(self, locals, forkAs)
				entries.forEach(([fiberRef, values]) => {
					1 === values.length
						? unsafeUpdateAs(locals, values[0][0], fiberRef, values[0][1])
						: values.forEach(([fiberId, value]) => {
								unsafeUpdateAs(locals, fiberId, fiberRef, value)
							})
				})
				return new FiberRefsImpl(locals)
			}),
			FiberRefs_getOrDefault = getOrDefault,
			FiberRefs_updateManyAs = updateManyAs,
			FiberRefs_empty = function () {
				return (fiberRefLocals = new Map()), new FiberRefsImpl(fiberRefLocals)
				var fiberRefLocals
			},
			patch_empty = { _tag: "Empty" },
			patch_diff = (oldValue, newValue) => {
				const missingLocals = new Map(oldValue.locals)
				let patch = patch_empty
				for (const [fiberRef, pairs] of newValue.locals.entries()) {
					const newValue = headNonEmpty(pairs)[1],
						old = missingLocals.get(fiberRef)
					if (void 0 !== old) {
						const oldValue = headNonEmpty(old)[1]
						equals(oldValue, newValue) ||
							(patch = patch_combine({
								_tag: "Update",
								fiberRef,
								patch: fiberRef.diff(oldValue, newValue),
							})(patch))
					} else
						patch = patch_combine({ _tag: "Add", fiberRef, value: newValue })(
							patch,
						)
					missingLocals.delete(fiberRef)
				}
				for (const [fiberRef] of missingLocals.entries())
					patch = patch_combine({ _tag: "Remove", fiberRef })(patch)
				return patch
			},
			patch_combine = Function_dual(2, (self, that) => ({
				_tag: "AndThen",
				first: self,
				second: that,
			})),
			patch_patch = Function_dual(3, (self, fiberId, oldValue) => {
				let fiberRefs = oldValue,
					patches = Array_of(self)
				for (; isNonEmptyReadonlyArray(patches); ) {
					const head = headNonEmpty(patches),
						tail = tailNonEmpty(patches)
					switch (head._tag) {
						case "Empty":
							patches = tail
							break
						case "Add":
							fiberRefs = updateAs(fiberRefs, {
								fiberId,
								fiberRef: head.fiberRef,
								value: head.value,
							})
							patches = tail
							break
						case "Remove":
							fiberRefs = delete_(fiberRefs, head.fiberRef)
							patches = tail
							break
						case "Update": {
							const value = getOrDefault(fiberRefs, head.fiberRef)
							fiberRefs = updateAs(fiberRefs, {
								fiberId,
								fiberRef: head.fiberRef,
								value: head.fiberRef.patch(head.patch)(value),
							})
							patches = tail
							break
						}
						case "AndThen":
							patches = Array_prepend(head.first)(
								Array_prepend(head.second)(tail),
							)
					}
				}
				return fiberRefs
			}),
			FiberRefsPatch_diff = patch_diff,
			FiberRefsPatch_patch = patch_patch,
			FiberStatusTypeId = Symbol.for("effect/FiberStatus"),
			DoneHash = string("effect/FiberStatus-Done")
		class Done {
			[FiberStatusTypeId] = FiberStatusTypeId
			_tag = "Done";
			[symbol]() {
				return DoneHash
			}
			[Equal_symbol](that) {
				return isFiberStatus(that) && "Done" === that._tag
			}
		}
		class Running {
			runtimeFlags;
			[FiberStatusTypeId] = FiberStatusTypeId
			_tag = "Running"
			constructor(runtimeFlags) {
				this.runtimeFlags = runtimeFlags
			}
			[symbol]() {
				return Function_pipe(
					Hash_hash("effect/FiberStatus"),
					combine(Hash_hash(this._tag)),
					combine(Hash_hash(this.runtimeFlags)),
					cached(this),
				)
			}
			[Equal_symbol](that) {
				return (
					isFiberStatus(that) &&
					"Running" === that._tag &&
					this.runtimeFlags === that.runtimeFlags
				)
			}
		}
		class Suspended {
			runtimeFlags
			blockingOn;
			[FiberStatusTypeId] = FiberStatusTypeId
			_tag = "Suspended"
			constructor(runtimeFlags, blockingOn) {
				this.runtimeFlags = runtimeFlags
				this.blockingOn = blockingOn
			}
			[symbol]() {
				return Function_pipe(
					Hash_hash("effect/FiberStatus"),
					combine(Hash_hash(this._tag)),
					combine(Hash_hash(this.runtimeFlags)),
					combine(Hash_hash(this.blockingOn)),
					cached(this),
				)
			}
			[Equal_symbol](that) {
				return (
					isFiberStatus(that) &&
					"Suspended" === that._tag &&
					this.runtimeFlags === that.runtimeFlags &&
					equals(this.blockingOn, that.blockingOn)
				)
			}
		}
		const isFiberStatus = u => Predicate_hasProperty(u, FiberStatusTypeId),
			FiberStatus_done = new Done(),
			FiberStatus_running = runtimeFlags => new Running(runtimeFlags),
			Fatal = logLevelFatal,
			LogLevel_Error = logLevelError,
			Warning = logLevelWarning,
			Info = logLevelInfo,
			Debug = logLevelDebug,
			Trace = logLevelTrace,
			locally = Function_dual(2, (use, self) =>
				fiberRefLocally(use, currentLogLevel, self),
			),
			LogLevel_Order = Function_pipe(
				Number_Order,
				Order_mapInput(level => level.ordinal),
			),
			LogLevel_greaterThan = greaterThan(LogLevel_Order),
			greaterThanEqual = greaterThanOrEqualTo(LogLevel_Order),
			runSymbol = Symbol.for("effect/Micro/runSymbol")
		globalThis.Error
		const EnvTypeId = Symbol.for("effect/Micro/Env"),
			EnvRefTypeId = Symbol.for("effect/Micro/EnvRef"),
			EnvProto = {
				[EnvTypeId]: { _R: Function_identity },
				pipe() {
					return Pipeable_pipeArguments(this, arguments)
				},
			},
			envMake = refs => {
				const self = Object.create(EnvProto)
				self.refs = refs
				return self
			},
			envGet = Function_dual(2, (self, ref) =>
				ref.key in self.refs ? self.refs[ref.key] : ref.initial,
			),
			envSet = Function_dual(3, (self, ref, value) => {
				const refs = Object.assign(Object.create(null), self.refs)
				refs[ref.key] = value
				return envMake(refs)
			}),
			EnvRefProto = { [EnvRefTypeId]: EnvRefTypeId },
			envRefMake = (key, initial) =>
				globalValue(key, () => {
					const self = Object.create(EnvRefProto)
					self.key = key
					self.initial = initial()
					return self
				}),
			currentAbortController = envRefMake(
				"effect/Micro/currentAbortController",
				() => {},
			),
			currentAbortSignal = envRefMake(
				"effect/Micro/currentAbortSignal",
				() => {},
			),
			Micro_currentContext = envRefMake("effect/Micro/currentContext", () =>
				Context_empty(),
			)
		Symbol.iterator, "setImmediate" in globalThis && globalThis.setImmediate
		const Readable_TypeId = Symbol.for("effect/Readable"),
			RefTypeId = Symbol.for("effect/Ref"),
			refVariance = { _A: _ => _ }
		class RefImpl {
			ref;
			[RefTypeId] = refVariance;
			[Readable_TypeId]
			constructor(ref) {
				this.ref = ref
				this[Readable_TypeId] = Readable_TypeId
				this.get = sync(() => MutableRef_get(this.ref))
			}
			get;
			modify(f) {
				return sync(() => {
					const current = MutableRef_get(this.ref),
						[b, a] = f(current)
					current !== a && MutableRef_set(a)(this.ref)
					return b
				})
			}
			pipe() {
				return Pipeable_pipeArguments(this, arguments)
			}
		}
		const ref_unsafeMake = value => new RefImpl(MutableRef_make(value)),
			ref_make = value => sync(() => ref_unsafeMake(value)),
			ref_get = self => self.get,
			ref_set = Function_dual(2, (self, value) =>
				self.modify(() => [void 0, value]),
			),
			ref_modify = Function_dual(2, (self, f) => self.modify(f)),
			ref_update = Function_dual(2, (self, f) =>
				self.modify(a => [void 0, f(a)]),
			)
		class PriorityBuckets {
			buckets = []
			scheduleTask(task, priority) {
				let bucket, index
				for (
					index = 0;
					index < this.buckets.length && this.buckets[index][0] <= priority;
					index++
				)
					bucket = this.buckets[index]
				if (bucket) bucket[1].push(task)
				else {
					const newBuckets = []
					for (let i = 0; i < index; i++) newBuckets.push(this.buckets[i])
					newBuckets.push([priority, [task]])
					for (let i = index; i < this.buckets.length; i++)
						newBuckets.push(this.buckets[i])
					this.buckets = newBuckets
				}
			}
		}
		class MixedScheduler {
			maxNextTickBeforeTimer
			running = !1
			tasks = new PriorityBuckets()
			constructor(maxNextTickBeforeTimer) {
				this.maxNextTickBeforeTimer = maxNextTickBeforeTimer
			}
			starveInternal(depth) {
				const tasks = this.tasks.buckets
				this.tasks.buckets = []
				for (const [_, toRun] of tasks)
					for (let i = 0; i < toRun.length; i++) toRun[i]()
				0 === this.tasks.buckets.length
					? (this.running = !1)
					: this.starve(depth)
			}
			starve(depth = 0) {
				depth >= this.maxNextTickBeforeTimer
					? setTimeout(() => this.starveInternal(0), 0)
					: Promise.resolve(void 0).then(() => this.starveInternal(depth + 1))
			}
			shouldYield(fiber) {
				return (
					fiber.currentOpCount > fiber.getFiberRef(currentMaxOpsBeforeYield) &&
					fiber.getFiberRef(currentSchedulingPriority)
				)
			}
			scheduleTask(task, priority) {
				this.tasks.scheduleTask(task, priority)
				if (!this.running) {
					this.running = !0
					this.starve()
				}
			}
		}
		const defaultScheduler = globalValue(
			Symbol.for("effect/Scheduler/defaultScheduler"),
			() => new MixedScheduler(2048),
		)
		class SyncScheduler {
			tasks = new PriorityBuckets()
			deferred = !1
			scheduleTask(task, priority) {
				this.deferred
					? defaultScheduler.scheduleTask(task, priority)
					: this.tasks.scheduleTask(task, priority)
			}
			shouldYield(fiber) {
				return (
					fiber.currentOpCount > fiber.getFiberRef(currentMaxOpsBeforeYield) &&
					fiber.getFiberRef(currentSchedulingPriority)
				)
			}
			flush() {
				for (; this.tasks.buckets.length > 0; ) {
					const tasks = this.tasks.buckets
					this.tasks.buckets = []
					for (const [_, toRun] of tasks)
						for (let i = 0; i < toRun.length; i++) toRun[i]()
				}
				this.deferred = !0
			}
		}
		const currentScheduler = globalValue(
				Symbol.for("effect/FiberRef/currentScheduler"),
				() => fiberRefUnsafeMake(defaultScheduler),
			),
			par = (self, that) => ({ _tag: "Par", left: self, right: that }),
			seq = (self, that) => ({ _tag: "Seq", left: self, right: that }),
			blockedRequests_step = requests => {
				let current = requests,
					parallel = parallelCollectionEmpty(),
					stack = List_empty(),
					sequential = List_empty()
				for (;;)
					switch (current._tag) {
						case "Empty":
							if (isNil(stack)) return [parallel, sequential]
							current = stack.head
							stack = stack.tail
							break
						case "Par":
							stack = cons(current.right, stack)
							current = current.left
							break
						case "Seq": {
							const left = current.left,
								right = current.right
							switch (left._tag) {
								case "Empty":
									current = right
									break
								case "Par": {
									const l = left.left,
										r = left.right
									current = par(seq(l, right), seq(r, right))
									break
								}
								case "Seq": {
									const l = left.left,
										r = left.right
									current = seq(l, seq(r, right))
									break
								}
								case "Single":
									current = left
									sequential = cons(right, sequential)
							}
							break
						}
						case "Single":
							parallel = parallelCollectionAdd(parallel, current)
							if (isNil(stack)) return [parallel, sequential]
							current = stack.head
							stack = stack.tail
					}
				throw new Error(
					"BUG: BlockedRequests.step - please report an issue at https://github.com/Effect-TS/effect/issues",
				)
			},
			blockedRequests_merge = (sequential, parallel) => {
				if (isNil(sequential))
					return List_of(parallelCollectionToSequentialCollection(parallel))
				if (parallelCollectionIsEmpty(parallel)) return sequential
				const seqHeadKeys = sequentialCollectionKeys(sequential.head),
					parKeys = parallelCollectionKeys(parallel)
				return 1 === seqHeadKeys.length &&
					1 === parKeys.length &&
					equals(seqHeadKeys[0], parKeys[0])
					? cons(
							sequentialCollectionCombine(
								sequential.head,
								parallelCollectionToSequentialCollection(parallel),
							),
							sequential.tail,
						)
					: cons(parallelCollectionToSequentialCollection(parallel), sequential)
			},
			RequestBlockParallelTypeId = Symbol.for(
				"effect/RequestBlock/RequestBlockParallel",
			),
			parallelVariance = { _R: _ => _ }
		class ParallelImpl {
			map;
			[RequestBlockParallelTypeId] = parallelVariance
			constructor(map) {
				this.map = map
			}
		}
		const parallelCollectionEmpty = () => new ParallelImpl(HashMap_empty()),
			parallelCollectionAdd = (self, blockedRequest) =>
				new ParallelImpl(
					HashMap_modifyAt(self.map, blockedRequest.dataSource, _ =>
						orElseSome(
							map(_, Chunk_append(blockedRequest.blockedRequest)),
							() => Chunk_of(blockedRequest.blockedRequest),
						),
					),
				),
			parallelCollectionCombine = (self, that) =>
				new ParallelImpl(
					HashMap_reduce(self.map, that.map, (map, value, key) =>
						HashMap_set(
							map,
							key,
							match(HashMap_get(map, key), {
								onNone: () => value,
								onSome: other => Chunk_appendAll(value, other),
							}),
						),
					),
				),
			parallelCollectionIsEmpty = self =>
				(self => self && isEmptyNode(self._root))(self.map),
			parallelCollectionKeys = self => Array.from(HashMap_keys(self.map)),
			parallelCollectionToSequentialCollection = self =>
				sequentialCollectionMake(HashMap_map(self.map, x => Chunk_of(x))),
			SequentialCollectionTypeId = Symbol.for(
				"effect/RequestBlock/RequestBlockSequential",
			),
			sequentialVariance = { _R: _ => _ }
		class SequentialImpl {
			map;
			[SequentialCollectionTypeId] = sequentialVariance
			constructor(map) {
				this.map = map
			}
		}
		const sequentialCollectionMake = map => new SequentialImpl(map),
			sequentialCollectionCombine = (self, that) =>
				new SequentialImpl(
					HashMap_reduce(that.map, self.map, (map, value, key) =>
						HashMap_set(
							map,
							key,
							match(HashMap_get(map, key), {
								onNone: () => esm_Chunk_empty(),
								onSome: a => Chunk_appendAll(a, value),
							}),
						),
					),
				),
			sequentialCollectionKeys = self => Array.from(HashMap_keys(self.map)),
			currentRequestMap = globalValue(
				Symbol.for("effect/FiberRef/currentRequestMap"),
				() => fiberRefUnsafeMake(new Map()),
			),
			concurrency_match = (concurrency, sequential, unbounded, bounded) => {
				switch (concurrency) {
					case void 0:
						return sequential()
					case "unbounded":
						return unbounded()
					case "inherit":
						return fiberRefGetWith(currentConcurrency, concurrency =>
							"unbounded" === concurrency
								? unbounded()
								: concurrency > 1
									? bounded(concurrency)
									: sequential(),
						)
					default:
						return concurrency > 1 ? bounded(concurrency) : sequential()
				}
			},
			Clock_currentTimeMillis = currentTimeMillis,
			LogSpan_render = now => self =>
				`${self.label.replace(/[\s="]/g, "_")}=${now - self.startTime}ms`,
			MetricLabelTypeId = Symbol.for("effect/MetricLabel")
		class MetricLabelImpl {
			key
			value;
			[MetricLabelTypeId] = MetricLabelTypeId
			_hash
			constructor(key, value) {
				this.key = key
				this.value = value
				this._hash = string("effect/MetricLabel" + this.key + this.value)
			}
			[symbol]() {
				return this._hash
			}
			[Equal_symbol](that) {
				return (
					isMetricLabel(that) &&
					this.key === that.key &&
					this.value === that.value
				)
			}
			pipe() {
				return Pipeable_pipeArguments(this, arguments)
			}
		}
		const label_make = (key, value) => new MetricLabelImpl(key, value),
			isMetricLabel = u => Predicate_hasProperty(u, MetricLabelTypeId),
			annotateLogs = Function_dual(
				args => isEffect(args[0]),
				function () {
					const args = arguments
					return fiberRefLocallyWith(
						args[0],
						currentLogAnnotations,
						"string" == typeof args[1]
							? HashMap_set(args[1], args[2])
							: annotations =>
									Object.entries(args[1]).reduce(
										(acc, [key, value]) => HashMap_set(acc, key, value),
										annotations,
									),
					)
				},
			),
			filterOrElse = Function_dual(3, (self, predicate, orElse) =>
				core_flatMap(self, a => (predicate(a) ? succeed(a) : orElse(a))),
			),
			core_effect_filterOrFail = Function_dual(
				args => isEffect(args[0]),
				(self, predicate, orFailWith) =>
					filterOrElse(self, predicate, a =>
						void 0 === orFailWith
							? core_fail(new NoSuchElementException())
							: failSync(() => orFailWith(a)),
					),
			),
			core_effect_match = Function_dual(2, (self, options) =>
				matchEffect(self, {
					onFailure: e => succeed(options.onFailure(e)),
					onSuccess: a => succeed(options.onSuccess(a)),
				}),
			),
			core_effect_fiberRefs = withFiberRuntime(state =>
				succeed(state.getFiberRefs()),
			),
			logWithLevel =
				level =>
				(...message) => {
					const levelOption = fromNullable(level)
					let cause
					for (let i = 0, len = message.length; i < len; i++) {
						const msg = message[i]
						if (isCause(msg)) {
							cause = void 0 !== cause ? sequential(cause, msg) : msg
							message = [...message.slice(0, i), ...message.slice(i + 1)]
							i--
						}
					}
					void 0 === cause && (cause = cause_empty)
					return withFiberRuntime(fiberState => {
						fiberState.log(message, cause, levelOption)
						return core_void_
					})
				},
			log = logWithLevel(),
			logDebug = logWithLevel(Debug),
			logInfo = logWithLevel(Info),
			logWarning = logWithLevel(Warning),
			logError = logWithLevel(LogLevel_Error),
			core_effect_orElseSucceed = Function_dual(2, (self, evaluate) =>
				core_orElse(self, () => sync(evaluate)),
			),
			summarized = Function_dual(3, (self, summary, f) =>
				core_flatMap(summary, start =>
					core_flatMap(self, value =>
						core_map(summary, end => [f(start, end), value]),
					),
				),
			),
			core_effect_tapErrorCause = Function_dual(2, (self, f) =>
				matchCauseEffect(self, {
					onFailure: cause => core_zipRight(f(cause), failCause(cause)),
					onSuccess: succeed,
				}),
			),
			core_effect_when = Function_dual(2, (self, condition) =>
				suspend(() =>
					condition() ? core_map(self, Option_some) : succeed(Option_none()),
				),
			),
			interruptSignal = cause => ({ _tag: "InterruptSignal", cause }),
			stateful = onFiber => ({ _tag: "Stateful", onFiber }),
			resume = effect => ({ _tag: "Resume", effect }),
			FiberScopeTypeId = Symbol.for("effect/FiberScope")
		class Global {
			[FiberScopeTypeId] = FiberScopeTypeId
			fiberId = FiberId_none
			roots = new Set()
			add(_runtimeFlags, child) {
				this.roots.add(child)
				child.addObserver(() => {
					this.roots.delete(child)
				})
			}
		}
		class Local {
			fiberId
			parent;
			[FiberScopeTypeId] = FiberScopeTypeId
			constructor(fiberId, parent) {
				this.fiberId = fiberId
				this.parent = parent
			}
			add(_runtimeFlags, child) {
				this.parent.tell(
					stateful(parentFiber => {
						parentFiber.addChild(child)
						child.addObserver(() => {
							parentFiber.removeChild(child)
						})
					}),
				)
			}
		}
		const globalScope = globalValue(
				Symbol.for("effect/FiberScope/Global"),
				() => new Global(),
			),
			FiberTypeId = Symbol.for("effect/Fiber"),
			fiberVariance = { _E: _ => _, _A: _ => _ },
			RuntimeFiberTypeId = Symbol.for("effect/Fiber"),
			currentFiberURI = "effect/FiberCurrent",
			LoggerTypeId = Symbol.for("effect/Logger"),
			loggerVariance = { _Message: _ => _, _Output: _ => _ },
			makeLogger = log => ({
				[LoggerTypeId]: loggerVariance,
				log,
				pipe() {
					return Pipeable_pipeArguments(this, arguments)
				},
			}),
			logger_zip = Function_dual(2, (self, that) =>
				makeLogger(options => [self.log(options), that.log(options)]),
			),
			stringLogger = makeLogger(
				({ annotations, cause, date, fiberId, logLevel, message, spans }) => {
					const nowMillis = date.getTime()
					let output = [
						`timestamp=${date.toISOString()}`,
						`level=${logLevel.label}`,
						`fiber=${threadName(fiberId)}`,
					].join(" ")
					const messageArr = (self => (Array.isArray(self) ? self : [self]))(
						message,
					)
					for (let i = 0; i < messageArr.length; i++) {
						const stringMessage = toStringUnknown(messageArr[i])
						if (stringMessage.length > 0) {
							output += " message="
							output = appendQuoted(stringMessage, output)
						}
					}
					if (null != cause && "Empty" !== cause._tag) {
						output += " cause="
						output = appendQuoted(
							pretty(cause, { renderErrorCause: !0 }),
							output,
						)
					}
					if (isCons(spans)) {
						output += " "
						let first = !0
						for (const span of spans) {
							first ? (first = !1) : (output += " ")
							output += Function_pipe(span, LogSpan_render(nowMillis))
						}
					}
					if (HashMap_size(annotations) > 0) {
						output += " "
						let first = !0
						for (const [key, value] of annotations) {
							first ? (first = !1) : (output += " ")
							output += filterKeyName(key)
							output += "="
							output = appendQuoted(toStringUnknown(value), output)
						}
					}
					return output
				},
			),
			textOnly = /^[^\s"=]+$/,
			appendQuoted = (label, output) =>
				output +
				(label.match(textOnly)
					? label
					: `"${label.replace(/\\([\s\S])|(")/g, "\\$1$2")}"`),
			filterKeyName = key => key.replace(/[\s="]/g, "_"),
			MetricKeyTypeTypeId =
				("object" == typeof process &&
					null !== process &&
					"object" == typeof process.stdout &&
					null !== process.stdout &&
					process.stdout.isTTY,
				"object" == typeof self && null !== self && self.constructor,
				Symbol.for("effect/MetricKeyType")),
			CounterKeyTypeTypeId = Symbol.for("effect/MetricKeyType/Counter"),
			FrequencyKeyTypeTypeId = Symbol.for("effect/MetricKeyType/Frequency"),
			GaugeKeyTypeTypeId = Symbol.for("effect/MetricKeyType/Gauge"),
			HistogramKeyTypeTypeId = Symbol.for("effect/MetricKeyType/Histogram"),
			SummaryKeyTypeTypeId = Symbol.for("effect/MetricKeyType/Summary"),
			metricKeyTypeVariance = { _In: _ => _, _Out: _ => _ }
		class CounterKeyType {
			incremental
			bigint;
			[MetricKeyTypeTypeId] = metricKeyTypeVariance;
			[CounterKeyTypeTypeId] = CounterKeyTypeTypeId
			constructor(incremental, bigint) {
				this.incremental = incremental
				this.bigint = bigint
				this._hash = string("effect/MetricKeyType/Counter")
			}
			_hash;
			[symbol]() {
				return this._hash
			}
			[Equal_symbol](that) {
				return isCounterKey(that)
			}
			pipe() {
				return Pipeable_pipeArguments(this, arguments)
			}
		}
		class HistogramKeyType {
			boundaries;
			[MetricKeyTypeTypeId] = metricKeyTypeVariance;
			[HistogramKeyTypeTypeId] = HistogramKeyTypeTypeId
			constructor(boundaries) {
				this.boundaries = boundaries
				this._hash = Function_pipe(
					string("effect/MetricKeyType/Histogram"),
					combine(Hash_hash(this.boundaries)),
				)
			}
			_hash;
			[symbol]() {
				return this._hash
			}
			[Equal_symbol](that) {
				return isHistogramKey(that) && equals(this.boundaries, that.boundaries)
			}
			pipe() {
				return Pipeable_pipeArguments(this, arguments)
			}
		}
		const isCounterKey = u => Predicate_hasProperty(u, CounterKeyTypeTypeId),
			isHistogramKey = u => Predicate_hasProperty(u, HistogramKeyTypeTypeId),
			MetricKeyTypeId = Symbol.for("effect/MetricKey"),
			metricKeyVariance = { _Type: _ => _ },
			arrayEquivilence = Array_getEquivalence(equals)
		class MetricKeyImpl {
			name
			keyType
			description
			tags;
			[MetricKeyTypeId] = metricKeyVariance
			constructor(name, keyType, description, tags = []) {
				this.name = name
				this.keyType = keyType
				this.description = description
				this.tags = tags
				this._hash = Function_pipe(
					string(this.name + this.description),
					combine(Hash_hash(this.keyType)),
					combine(array(this.tags)),
				)
			}
			_hash;
			[symbol]() {
				return this._hash
			}
			[Equal_symbol](u) {
				return (
					isMetricKey(u) &&
					this.name === u.name &&
					equals(this.keyType, u.keyType) &&
					equals(this.description, u.description) &&
					arrayEquivilence(this.tags, u.tags)
				)
			}
			pipe() {
				return Pipeable_pipeArguments(this, arguments)
			}
		}
		const isMetricKey = u => Predicate_hasProperty(u, MetricKeyTypeId),
			taggedWithLabels = Function_dual(2, (self, extraTags) =>
				0 === extraTags.length
					? self
					: new MetricKeyImpl(
							self.name,
							self.keyType,
							self.description,
							Array_union(self.tags, extraTags),
						),
			),
			MutableHashMap_TypeId = Symbol.for("effect/MutableHashMap"),
			MutableHashMapProto = {
				[MutableHashMap_TypeId]: MutableHashMap_TypeId,
				[Symbol.iterator]() {
					return new MutableHashMapIterator(this)
				},
				toString() {
					return format(this.toJSON())
				},
				toJSON() {
					return { _id: "MutableHashMap", values: Array.from(this).map(toJSON) }
				},
				[Inspectable_NodeInspectSymbol]() {
					return this.toJSON()
				},
				pipe() {
					return Pipeable_pipeArguments(this, arguments)
				},
			}
		class MutableHashMapIterator {
			self
			referentialIterator
			bucketIterator
			constructor(self) {
				this.self = self
				this.referentialIterator = self.referential[Symbol.iterator]()
			}
			next() {
				if (void 0 !== this.bucketIterator) return this.bucketIterator.next()
				const result = this.referentialIterator.next()
				if (result.done) {
					this.bucketIterator = new BucketIterator(this.self.buckets.values())
					return this.next()
				}
				return result
			}
			[Symbol.iterator]() {
				return new MutableHashMapIterator(this.self)
			}
		}
		class BucketIterator {
			backing
			constructor(backing) {
				this.backing = backing
			}
			currentBucket
			next() {
				if (void 0 === this.currentBucket) {
					const result = this.backing.next()
					if (result.done) return result
					this.currentBucket = result.value[Symbol.iterator]()
				}
				const result = this.currentBucket.next()
				if (result.done) {
					this.currentBucket = void 0
					return this.next()
				}
				return result
			}
		}
		const MutableHashMap_empty = () => {
				const self = Object.create(MutableHashMapProto)
				self.referential = new Map()
				self.buckets = new Map()
				self.bucketsSize = 0
				return self
			},
			MutableHashMap_get = Function_dual(2, (self, key) => {
				if (!1 === isEqual(key))
					return self.referential.has(key)
						? Option_some(self.referential.get(key))
						: Option_none()
				const hash = key[symbol](),
					bucket = self.buckets.get(hash)
				return void 0 === bucket
					? Option_none()
					: getFromBucket(self, bucket, key)
			}),
			getFromBucket = (self, bucket, key, remove = !1) => {
				for (let i = 0, len = bucket.length; i < len; i++)
					if (key[Equal_symbol](bucket[i][0])) {
						const value = bucket[i][1]
						if (remove) {
							bucket.splice(i, 1)
							self.bucketsSize--
						}
						return Option_some(value)
					}
				return Option_none()
			},
			MutableHashMap_has = Function_dual(2, (self, key) =>
				Option_isSome(MutableHashMap_get(self, key)),
			),
			MutableHashMap_set = Function_dual(3, (self, key, value) => {
				if (!1 === isEqual(key)) {
					self.referential.set(key, value)
					return self
				}
				const hash = key[symbol](),
					bucket = self.buckets.get(hash)
				if (void 0 === bucket) {
					self.buckets.set(hash, [[key, value]])
					self.bucketsSize++
					return self
				}
				removeFromBucket(self, bucket, key)
				bucket.push([key, value])
				self.bucketsSize++
				return self
			}),
			removeFromBucket = (self, bucket, key) => {
				for (let i = 0, len = bucket.length; i < len; i++)
					if (key[Equal_symbol](bucket[i][0])) {
						bucket.splice(i, 1)
						self.bucketsSize--
						return
					}
			},
			MetricStateTypeId = Symbol.for("effect/MetricState"),
			CounterStateTypeId = Symbol.for("effect/MetricState/Counter"),
			FrequencyStateTypeId = Symbol.for("effect/MetricState/Frequency"),
			GaugeStateTypeId = Symbol.for("effect/MetricState/Gauge"),
			HistogramStateTypeId = Symbol.for("effect/MetricState/Histogram"),
			SummaryStateTypeId = Symbol.for("effect/MetricState/Summary"),
			metricStateVariance = { _A: _ => _ }
		class CounterState {
			count;
			[MetricStateTypeId] = metricStateVariance;
			[CounterStateTypeId] = CounterStateTypeId
			constructor(count) {
				this.count = count
			}
			[symbol]() {
				return Function_pipe(
					Hash_hash("effect/MetricState/Counter"),
					combine(Hash_hash(this.count)),
					cached(this),
				)
			}
			[Equal_symbol](that) {
				return isCounterState(that) && this.count === that.count
			}
			pipe() {
				return Pipeable_pipeArguments(this, arguments)
			}
		}
		const arrayEquals = Array_getEquivalence(equals)
		class FrequencyState {
			occurrences;
			[MetricStateTypeId] = metricStateVariance;
			[FrequencyStateTypeId] = FrequencyStateTypeId
			constructor(occurrences) {
				this.occurrences = occurrences
			}
			_hash;
			[symbol]() {
				return Function_pipe(
					string("effect/MetricState/Frequency"),
					combine(array(Array_fromIterable(this.occurrences.entries()))),
					cached(this),
				)
			}
			[Equal_symbol](that) {
				return (
					isFrequencyState(that) &&
					arrayEquals(
						Array_fromIterable(this.occurrences.entries()),
						Array_fromIterable(that.occurrences.entries()),
					)
				)
			}
			pipe() {
				return Pipeable_pipeArguments(this, arguments)
			}
		}
		class GaugeState {
			value;
			[MetricStateTypeId] = metricStateVariance;
			[GaugeStateTypeId] = GaugeStateTypeId
			constructor(value) {
				this.value = value
			}
			[symbol]() {
				return Function_pipe(
					Hash_hash("effect/MetricState/Gauge"),
					combine(Hash_hash(this.value)),
					cached(this),
				)
			}
			[Equal_symbol](u) {
				return isGaugeState(u) && this.value === u.value
			}
			pipe() {
				return Pipeable_pipeArguments(this, arguments)
			}
		}
		class HistogramState {
			buckets
			count
			min
			max
			sum;
			[MetricStateTypeId] = metricStateVariance;
			[HistogramStateTypeId] = HistogramStateTypeId
			constructor(buckets, count, min, max, sum) {
				this.buckets = buckets
				this.count = count
				this.min = min
				this.max = max
				this.sum = sum
			}
			[symbol]() {
				return Function_pipe(
					Hash_hash("effect/MetricState/Histogram"),
					combine(Hash_hash(this.buckets)),
					combine(Hash_hash(this.count)),
					combine(Hash_hash(this.min)),
					combine(Hash_hash(this.max)),
					combine(Hash_hash(this.sum)),
					cached(this),
				)
			}
			[Equal_symbol](that) {
				return (
					isHistogramState(that) &&
					equals(this.buckets, that.buckets) &&
					this.count === that.count &&
					this.min === that.min &&
					this.max === that.max &&
					this.sum === that.sum
				)
			}
			pipe() {
				return Pipeable_pipeArguments(this, arguments)
			}
		}
		class SummaryState {
			error
			quantiles
			count
			min
			max
			sum;
			[MetricStateTypeId] = metricStateVariance;
			[SummaryStateTypeId] = SummaryStateTypeId
			constructor(error, quantiles, count, min, max, sum) {
				this.error = error
				this.quantiles = quantiles
				this.count = count
				this.min = min
				this.max = max
				this.sum = sum
			}
			[symbol]() {
				return Function_pipe(
					Hash_hash("effect/MetricState/Summary"),
					combine(Hash_hash(this.error)),
					combine(Hash_hash(this.quantiles)),
					combine(Hash_hash(this.count)),
					combine(Hash_hash(this.min)),
					combine(Hash_hash(this.max)),
					combine(Hash_hash(this.sum)),
					cached(this),
				)
			}
			[Equal_symbol](that) {
				return (
					isSummaryState(that) &&
					this.error === that.error &&
					equals(this.quantiles, that.quantiles) &&
					this.count === that.count &&
					this.min === that.min &&
					this.max === that.max &&
					this.sum === that.sum
				)
			}
			pipe() {
				return Pipeable_pipeArguments(this, arguments)
			}
		}
		const isCounterState = u => Predicate_hasProperty(u, CounterStateTypeId),
			isFrequencyState = u => Predicate_hasProperty(u, FrequencyStateTypeId),
			isGaugeState = u => Predicate_hasProperty(u, GaugeStateTypeId),
			isHistogramState = u => Predicate_hasProperty(u, HistogramStateTypeId),
			isSummaryState = u => Predicate_hasProperty(u, SummaryStateTypeId),
			MetricHookTypeId = Symbol.for("effect/MetricHook"),
			metricHookVariance = { _In: _ => _, _Out: _ => _ },
			hook_make = options => ({
				[MetricHookTypeId]: metricHookVariance,
				pipe() {
					return Pipeable_pipeArguments(this, arguments)
				},
				...options,
			}),
			hook_bigint0 = BigInt(0),
			resolveQuantile = (
				error,
				sampleCount,
				current,
				consumed,
				quantile,
				rest,
			) => {
				let error_1 = error,
					sampleCount_1 = sampleCount,
					current_1 = current,
					consumed_1 = consumed,
					quantile_1 = quantile,
					rest_1 = rest,
					error_2 = error,
					sampleCount_2 = sampleCount,
					current_2 = current,
					consumed_2 = consumed,
					quantile_2 = quantile,
					rest_2 = rest
				for (;;) {
					if (!isNonEmptyReadonlyArray(rest_1))
						return {
							quantile: quantile_1,
							value: Option_none(),
							consumed: consumed_1,
							rest: [],
						}
					if (1 === quantile_1)
						return {
							quantile: quantile_1,
							value: Option_some(lastNonEmpty(rest_1)),
							consumed: consumed_1 + rest_1.length,
							rest: [],
						}
					const sameHead = span(rest_1, n => n <= rest_1[0]),
						desired = quantile_1 * sampleCount_1,
						allowedError = (error_1 / 2) * desired,
						candConsumed = consumed_1 + sameHead[0].length,
						candError = Math.abs(candConsumed - desired)
					if (candConsumed < desired - allowedError) {
						error_2 = error_1
						sampleCount_2 = sampleCount_1
						current_2 = Array_head(rest_1)
						consumed_2 = candConsumed
						quantile_2 = quantile_1
						rest_2 = sameHead[1]
						error_1 = error_2
						sampleCount_1 = sampleCount_2
						current_1 = current_2
						consumed_1 = consumed_2
						quantile_1 = quantile_2
						rest_1 = rest_2
					} else {
						if (candConsumed > desired + allowedError)
							return {
								quantile: quantile_1,
								value: current_1,
								consumed: consumed_1,
								rest: rest_1,
							}
						switch (current_1._tag) {
							case "None":
								error_2 = error_1
								sampleCount_2 = sampleCount_1
								current_2 = Array_head(rest_1)
								consumed_2 = candConsumed
								quantile_2 = quantile_1
								rest_2 = sameHead[1]
								error_1 = error_2
								sampleCount_1 = sampleCount_2
								current_1 = current_2
								consumed_1 = consumed_2
								quantile_1 = quantile_2
								rest_1 = rest_2
								continue
							case "Some":
								if (candError < Math.abs(desired - current_1.value)) {
									error_2 = error_1
									sampleCount_2 = sampleCount_1
									current_2 = Array_head(rest_1)
									consumed_2 = candConsumed
									quantile_2 = quantile_1
									rest_2 = sameHead[1]
									error_1 = error_2
									sampleCount_1 = sampleCount_2
									current_1 = current_2
									consumed_1 = consumed_2
									quantile_1 = quantile_2
									rest_1 = rest_2
									continue
								}
								return {
									quantile: quantile_1,
									value: Option_some(current_1.value),
									consumed: consumed_1,
									rest: rest_1,
								}
						}
					}
				}
				throw new Error(
					"BUG: MetricHook.resolveQuantiles - please report an issue at https://github.com/Effect-TS/effect/issues",
				)
			},
			MetricPairTypeId = Symbol.for("effect/MetricPair"),
			metricPairVariance = { _Type: _ => _ },
			pair_unsafeMake = (metricKey, metricState) => ({
				[MetricPairTypeId]: metricPairVariance,
				metricKey,
				metricState,
				pipe() {
					return Pipeable_pipeArguments(this, arguments)
				},
			}),
			MetricRegistryTypeId = Symbol.for("effect/MetricRegistry")
		class MetricRegistryImpl {
			[MetricRegistryTypeId] = MetricRegistryTypeId
			map = MutableHashMap_empty()
			snapshot() {
				const result = []
				for (const [key, hook] of this.map)
					result.push(pair_unsafeMake(key, hook.get()))
				return result
			}
			get(key) {
				const hook = Function_pipe(
					this.map,
					MutableHashMap_get(key),
					getOrUndefined,
				)
				if (null == hook) {
					if (isCounterKey(key.keyType)) return this.getCounter(key)
					if ((u => Predicate_hasProperty(u, GaugeKeyTypeTypeId))(key.keyType))
						return this.getGauge(key)
					if (
						(u => Predicate_hasProperty(u, FrequencyKeyTypeTypeId))(key.keyType)
					)
						return this.getFrequency(key)
					if (isHistogramKey(key.keyType)) return this.getHistogram(key)
					if (
						(u => Predicate_hasProperty(u, SummaryKeyTypeTypeId))(key.keyType)
					)
						return this.getSummary(key)
					throw new Error(
						"BUG: MetricRegistry.get - unknown MetricKeyType - please report an issue at https://github.com/Effect-TS/effect/issues",
					)
				}
				return hook
			}
			getCounter(key) {
				let value = Function_pipe(
					this.map,
					MutableHashMap_get(key),
					getOrUndefined,
				)
				if (null == value) {
					const counter = (key => {
						let sum = key.keyType.bigint ? hook_bigint0 : 0
						const canUpdate = key.keyType.incremental
							? key.keyType.bigint
								? value => value >= hook_bigint0
								: value => value >= 0
							: _value => !0
						return hook_make({
							get: () => new CounterState(sum),
							update: value => {
								canUpdate(value) && (sum += value)
							},
						})
					})(key)
					Function_pipe(this.map, MutableHashMap_has(key)) ||
						Function_pipe(this.map, MutableHashMap_set(key, counter))
					value = counter
				}
				return value
			}
			getFrequency(key) {
				let value = Function_pipe(
					this.map,
					MutableHashMap_get(key),
					getOrUndefined,
				)
				if (null == value) {
					const frequency = (key => {
						const values = new Map()
						for (const word of key.keyType.preregisteredWords)
							values.set(word, 0)
						return hook_make({
							get: () => new FrequencyState(values),
							update: word => {
								const slotCount = values.get(word) ?? 0
								values.set(word, slotCount + 1)
							},
						})
					})(key)
					Function_pipe(this.map, MutableHashMap_has(key)) ||
						Function_pipe(this.map, MutableHashMap_set(key, frequency))
					value = frequency
				}
				return value
			}
			getGauge(key) {
				let value = Function_pipe(
					this.map,
					MutableHashMap_get(key),
					getOrUndefined,
				)
				if (null == value) {
					const gauge = ((_key, startAt) => {
						let value = startAt
						return hook_make({
							get: () => new GaugeState(value),
							update: v => {
								value = v
							},
						})
					})(0, key.keyType.bigint ? BigInt(0) : 0)
					Function_pipe(this.map, MutableHashMap_has(key)) ||
						Function_pipe(this.map, MutableHashMap_set(key, gauge))
					value = gauge
				}
				return value
			}
			getHistogram(key) {
				let value = Function_pipe(
					this.map,
					MutableHashMap_get(key),
					getOrUndefined,
				)
				if (null == value) {
					const histogram = (key => {
						const bounds = key.keyType.boundaries.values,
							size = bounds.length,
							values = new Uint32Array(size + 1),
							boundaries = new Float32Array(size)
						let count = 0,
							sum = 0,
							min = Number.MAX_VALUE,
							max = Number.MIN_VALUE
						Function_pipe(
							bounds,
							sort(Number_Order),
							Array_map((n, i) => {
								boundaries[i] = n
							}),
						)
						const getBuckets = () => {
							const builder = allocate(size)
							let cumulated = 0
							for (let i = 0; i < size; i++) {
								const boundary = boundaries[i]
								cumulated += values[i]
								builder[i] = [boundary, cumulated]
							}
							return builder
						}
						return hook_make({
							get: () => {
								return (
									(options = { buckets: getBuckets(), count, min, max, sum }),
									new HistogramState(
										options.buckets,
										options.count,
										options.min,
										options.max,
										options.sum,
									)
								)
								var options
							},
							update: value => {
								let from = 0,
									to = size
								for (; from !== to; ) {
									const mid = Math.floor(from + (to - from) / 2)
									value <= boundaries[mid] ? (to = mid) : (from = mid)
									to === from + 1 &&
										(value <= boundaries[from] ? (to = from) : (from = to))
								}
								values[from] = values[from] + 1
								count += 1
								sum += value
								value < min && (min = value)
								value > max && (max = value)
							},
						})
					})(key)
					Function_pipe(this.map, MutableHashMap_has(key)) ||
						Function_pipe(this.map, MutableHashMap_set(key, histogram))
					value = histogram
				}
				return value
			}
			getSummary(key) {
				let value = Function_pipe(
					this.map,
					MutableHashMap_get(key),
					getOrUndefined,
				)
				if (null == value) {
					const summary = (key => {
						const { error, maxAge, maxSize, quantiles } = key.keyType,
							sortedQuantiles = Function_pipe(quantiles, sort(Number_Order)),
							values = allocate(maxSize)
						let head = 0,
							count = 0,
							sum = 0,
							min = Number.MAX_VALUE,
							max = Number.MIN_VALUE
						const snapshot = now => {
							const builder = []
							let i = 0
							for (; i !== maxSize - 1; ) {
								const item = values[i]
								if (null != item) {
									const [t, v] = item,
										age = Duration_millis(now - t)
									Duration_greaterThanOrEqualTo(age, zero) &&
										age <= maxAge &&
										builder.push(v)
								}
								i += 1
							}
							return ((error, sortedQuantiles, sortedSamples) => {
								const sampleCount = sortedSamples.length
								if (!isNonEmptyReadonlyArray(sortedQuantiles)) return []
								const head = sortedQuantiles[0],
									tail = sortedQuantiles.slice(1),
									resolvedHead = resolveQuantile(
										error,
										sampleCount,
										Option_none(),
										0,
										head,
										sortedSamples,
									),
									resolved = Array_of(resolvedHead)
								tail.forEach(quantile => {
									resolved.push(
										resolveQuantile(
											error,
											sampleCount,
											resolvedHead.value,
											resolvedHead.consumed,
											quantile,
											resolvedHead.rest,
										),
									)
								})
								return Array_map(resolved, rq => [rq.quantile, rq.value])
							})(error, sortedQuantiles, sort(builder, Number_Order))
						}
						return hook_make({
							get: () => {
								return (
									(options = {
										error,
										quantiles: snapshot(Date.now()),
										count,
										min,
										max,
										sum,
									}),
									new SummaryState(
										options.error,
										options.quantiles,
										options.count,
										options.min,
										options.max,
										options.sum,
									)
								)
								var options
							},
							update: ([value, timestamp]) =>
								((value, timestamp) => {
									if (maxSize > 0) {
										head += 1
										values[head % maxSize] = [timestamp, value]
									}
									count += 1
									sum += value
									value < min && (min = value)
									value > max && (max = value)
								})(value, timestamp),
						})
					})(key)
					Function_pipe(this.map, MutableHashMap_has(key)) ||
						Function_pipe(this.map, MutableHashMap_set(key, summary))
					value = summary
				}
				return value
			}
		}
		const MetricTypeId = Symbol.for("effect/Metric"),
			metricVariance = { _Type: _ => _, _In: _ => _, _Out: _ => _ },
			globalMetricRegistry = globalValue(
				Symbol.for("effect/Metric/globalMetricRegistry"),
				() => new MetricRegistryImpl(),
			),
			metric_make = function (keyType, unsafeUpdate, unsafeValue) {
				const metric = Object.assign(
					effect => core_tap(effect, a => metric_update(metric, a)),
					{
						[MetricTypeId]: metricVariance,
						keyType,
						unsafeUpdate,
						unsafeValue,
						register() {
							this.unsafeValue([])
							return this
						},
						pipe() {
							return Pipeable_pipeArguments(this, arguments)
						},
					},
				)
				return metric
			},
			metric_counter = (name, options) =>
				fromMetricKey(
					((name, options) =>
						new MetricKeyImpl(
							name,
							(options =>
								new CounterKeyType(
									options?.incremental ?? !1,
									options?.bigint ?? !1,
								))(options),
							fromNullable(options?.description),
						))(name, options),
				),
			fromMetricKey = key => {
				let untaggedHook
				const hookCache = new WeakMap(),
					hook = extraTags => {
						if (0 === extraTags.length) {
							if (void 0 !== untaggedHook) return untaggedHook
							untaggedHook = globalMetricRegistry.get(key)
							return untaggedHook
						}
						let hook = hookCache.get(extraTags)
						if (void 0 !== hook) return hook
						hook = globalMetricRegistry.get(taggedWithLabels(key, extraTags))
						hookCache.set(extraTags, hook)
						return hook
					}
				return metric_make(
					key.keyType,
					(input, extraTags) => hook(extraTags).update(input),
					extraTags => hook(extraTags).get(),
				)
			},
			metric_histogram = (name, boundaries, description) =>
				fromMetricKey(
					((name, boundaries, description) =>
						new MetricKeyImpl(
							name,
							(boundaries => new HistogramKeyType(boundaries))(boundaries),
							fromNullable(description),
						))(name, boundaries, description),
				),
			metric_tagged = Function_dual(3, (self, key, value) =>
				metric_taggedWithLabels(self, [label_make(key, value)]),
			),
			metric_taggedWithLabels = Function_dual(2, (self, extraTags) =>
				metric_make(
					self.keyType,
					(input, extraTags1) =>
						self.unsafeUpdate(input, Array_union(extraTags, extraTags1)),
					extraTags1 => self.unsafeValue(Array_union(extraTags, extraTags1)),
				),
			),
			metric_update = Function_dual(2, (self, input) =>
				fiberRefGetWith(currentMetricLabels, tags =>
					sync(() => self.unsafeUpdate(input, tags)),
				),
			),
			MetricBoundariesTypeId = Symbol.for("effect/MetricBoundaries")
		class MetricBoundariesImpl {
			values;
			[MetricBoundariesTypeId] = MetricBoundariesTypeId
			constructor(values) {
				this.values = values
				this._hash = Function_pipe(
					string("effect/MetricBoundaries"),
					combine(array(this.values)),
				)
			}
			_hash;
			[symbol]() {
				return this._hash
			}
			[Equal_symbol](u) {
				return isMetricBoundaries(u) && equals(this.values, u.values)
			}
			pipe() {
				return Pipeable_pipeArguments(this, arguments)
			}
		}
		const isMetricBoundaries = u =>
				Predicate_hasProperty(u, MetricBoundariesTypeId),
			boundaries_fromIterable = iterable => {
				const values = Function_pipe(
					iterable,
					Array_appendAll(Chunk_of(Number.POSITIVE_INFINITY)),
					dedupe,
				)
				return new MetricBoundariesImpl(values)
			},
			exponential = options =>
				Function_pipe(
					Array_makeBy(
						options.count - 1,
						i => options.start * Math.pow(options.factor, i),
					),
					unsafeFromArray,
					boundaries_fromIterable,
				),
			request_complete = Function_dual(2, (self, result) =>
				fiberRefGetWith(currentRequestMap, map =>
					sync(() => {
						if (map.has(self)) {
							const entry = map.get(self)
							if (!entry.state.completed) {
								entry.state.completed = !0
								deferredUnsafeDone(entry.result, result)
							}
						}
					}),
				),
			),
			SupervisorTypeId = Symbol.for("effect/Supervisor"),
			supervisorVariance = { _T: _ => _ }
		class ProxySupervisor {
			underlying
			value0;
			[SupervisorTypeId] = supervisorVariance
			constructor(underlying, value0) {
				this.underlying = underlying
				this.value0 = value0
			}
			get value() {
				return this.value0
			}
			onStart(context, effect, parent, fiber) {
				this.underlying.onStart(context, effect, parent, fiber)
			}
			onEnd(value, fiber) {
				this.underlying.onEnd(value, fiber)
			}
			onEffect(fiber, effect) {
				this.underlying.onEffect(fiber, effect)
			}
			onSuspend(fiber) {
				this.underlying.onSuspend(fiber)
			}
			onResume(fiber) {
				this.underlying.onResume(fiber)
			}
			map(f) {
				return new ProxySupervisor(this, Function_pipe(this.value, core_map(f)))
			}
			zip(right) {
				return new Zip(this, right)
			}
		}
		class Zip {
			left
			right
			_tag = "Zip";
			[SupervisorTypeId] = supervisorVariance
			constructor(left, right) {
				this.left = left
				this.right = right
			}
			get value() {
				return core_zip(this.left.value, this.right.value)
			}
			onStart(context, effect, parent, fiber) {
				this.left.onStart(context, effect, parent, fiber)
				this.right.onStart(context, effect, parent, fiber)
			}
			onEnd(value, fiber) {
				this.left.onEnd(value, fiber)
				this.right.onEnd(value, fiber)
			}
			onEffect(fiber, effect) {
				this.left.onEffect(fiber, effect)
				this.right.onEffect(fiber, effect)
			}
			onSuspend(fiber) {
				this.left.onSuspend(fiber)
				this.right.onSuspend(fiber)
			}
			onResume(fiber) {
				this.left.onResume(fiber)
				this.right.onResume(fiber)
			}
			map(f) {
				return new ProxySupervisor(this, Function_pipe(this.value, core_map(f)))
			}
			zip(right) {
				return new Zip(this, right)
			}
		}
		const isZip = self =>
			Predicate_hasProperty(self, SupervisorTypeId) &&
			Predicate_isTagged(self, "Zip")
		class Const {
			effect;
			[SupervisorTypeId] = supervisorVariance
			constructor(effect) {
				this.effect = effect
			}
			get value() {
				return this.effect
			}
			onStart(_context, _effect, _parent, _fiber) {}
			onEnd(_value, _fiber) {}
			onEffect(_fiber, _effect) {}
			onSuspend(_fiber) {}
			onResume(_fiber) {}
			map(f) {
				return new ProxySupervisor(this, Function_pipe(this.value, core_map(f)))
			}
			zip(right) {
				return new Zip(this, right)
			}
			onRun(execution, _fiber) {
				return execution()
			}
		}
		const supervisor_none = globalValue(
				"effect/Supervisor/none",
				() => new Const(core_void_),
			),
			supervisor_patch_empty = { _tag: "Empty" },
			supervisor_patch_combine = (self, that) => ({
				_tag: "AndThen",
				first: self,
				second: that,
			}),
			removeSupervisor = (self, that) =>
				equals(self, that)
					? supervisor_none
					: isZip(self)
						? removeSupervisor(self.left, that).zip(
								removeSupervisor(self.right, that),
							)
						: self,
			patch_toSet = self =>
				equals(self, supervisor_none)
					? HashSet_empty()
					: isZip(self)
						? Function_pipe(
								patch_toSet(self.left),
								HashSet_union(patch_toSet(self.right)),
							)
						: HashSet_make(self),
			patch_differ = differ_make({
				empty: supervisor_patch_empty,
				patch: (self, supervisor) =>
					((_supervisor, _patches) => {
						let supervisor = _supervisor,
							patches = _patches
						for (; isNonEmpty(patches); ) {
							const head = Chunk_headNonEmpty(patches)
							switch (head._tag) {
								case "Empty":
									patches = Chunk_tailNonEmpty(patches)
									break
								case "AddSupervisor":
									supervisor = supervisor.zip(head.supervisor)
									patches = Chunk_tailNonEmpty(patches)
									break
								case "RemoveSupervisor":
									supervisor = removeSupervisor(supervisor, head.supervisor)
									patches = Chunk_tailNonEmpty(patches)
									break
								case "AndThen":
									patches = Chunk_prepend(head.first)(
										Chunk_prepend(head.second)(Chunk_tailNonEmpty(patches)),
									)
							}
						}
						return supervisor
					})(supervisor, Chunk_of(self)),
				combine: supervisor_patch_combine,
				diff: (oldValue, newValue) => {
					if (equals(oldValue, newValue)) return supervisor_patch_empty
					const oldSupervisors = patch_toSet(oldValue),
						newSupervisors = patch_toSet(newValue),
						added = Function_pipe(
							newSupervisors,
							HashSet_difference(oldSupervisors),
							HashSet_reduce(supervisor_patch_empty, (patch, supervisor) =>
								supervisor_patch_combine(patch, {
									_tag: "AddSupervisor",
									supervisor,
								}),
							),
						),
						removed = Function_pipe(
							oldSupervisors,
							HashSet_difference(newSupervisors),
							HashSet_reduce(supervisor_patch_empty, (patch, supervisor) =>
								supervisor_patch_combine(patch, {
									_tag: "RemoveSupervisor",
									supervisor,
								}),
							),
						)
					return supervisor_patch_combine(added, removed)
				},
			}),
			fiberStarted = metric_counter("effect_fiber_started", {
				incremental: !0,
			}),
			fiberActive = metric_counter("effect_fiber_active"),
			fiberSuccesses = metric_counter("effect_fiber_successes", {
				incremental: !0,
			}),
			fiberFailures = metric_counter("effect_fiber_failures", {
				incremental: !0,
			}),
			fiberLifetimes = metric_tagged(
				metric_histogram(
					"effect_fiber_lifetimes",
					exponential({ start: 0.5, factor: 2, count: 35 }),
				),
				"time_unit",
				"milliseconds",
			),
			runtimeFiberVariance = { _E: _ => _, _A: _ => _ },
			fiberRuntime_absurd = _ => {
				throw new Error(
					`BUG: FiberRuntime - ${toStringUnknown(_)} - please report an issue at https://github.com/Effect-TS/effect/issues`,
				)
			},
			YieldedOp = Symbol.for("effect/internal/fiberRuntime/YieldedOp"),
			yieldedOpChannel = globalValue(
				"effect/internal/fiberRuntime/yieldedOpChannel",
				() => ({ currentOp: null }),
			),
			contOpSuccess = {
				OnSuccess: (_, cont, value) =>
					internalCall(() => cont.effect_instruction_i1(value)),
				OnStep: (_, _cont, value) => exitSucceed(exitSucceed(value)),
				OnSuccessAndFailure: (_, cont, value) =>
					internalCall(() => cont.effect_instruction_i2(value)),
				RevertFlags: (self, cont, value) => {
					self.patchRuntimeFlags(self._runtimeFlags, cont.patch)
					return interruptible(self._runtimeFlags) && self.isInterrupted()
						? exitFailCause(self.getInterruptedCause())
						: exitSucceed(value)
				},
				While: (self, cont, value) => {
					internalCall(() => cont.effect_instruction_i2(value))
					if (internalCall(() => cont.effect_instruction_i0())) {
						self.pushStack(cont)
						return internalCall(() => cont.effect_instruction_i1())
					}
					return core_void_
				},
			},
			drainQueueWhileRunningTable = {
				InterruptSignal: (self, runtimeFlags, cur, message) => {
					self.processNewInterruptSignal(message.cause)
					return interruptible(runtimeFlags)
						? exitFailCause(message.cause)
						: cur
				},
				Resume: (_self, _runtimeFlags, _cur, _message) => {
					throw new Error(
						"It is illegal to have multiple concurrent run loops in a single fiber",
					)
				},
				Stateful: (self, runtimeFlags, cur, message) => {
					message.onFiber(self, FiberStatus_running(runtimeFlags))
					return cur
				},
				YieldNow: (_self, _runtimeFlags, cur, _message) =>
					core_flatMap(yieldNow(), () => cur),
			}
		class FiberRuntime {
			[FiberTypeId] = fiberVariance;
			[RuntimeFiberTypeId] = runtimeFiberVariance
			pipe() {
				return Pipeable_pipeArguments(this, arguments)
			}
			_fiberRefs
			_fiberId
			_runtimeFlags
			_queue = new Array()
			_children = null
			_observers = new Array()
			_running = !1
			_stack = []
			_asyncInterruptor = null
			_asyncBlockingOn = null
			_exitValue = null
			_steps = []
			_supervisor
			_scheduler
			_tracer
			currentOpCount = 0
			isYielding = !1
			constructor(fiberId, fiberRefs0, runtimeFlags0) {
				this._runtimeFlags = runtimeFlags0
				this._fiberId = fiberId
				this._fiberRefs = fiberRefs0
				this._supervisor = this.getFiberRef(currentSupervisor)
				this._scheduler = this.getFiberRef(currentScheduler)
				if (runtimeMetrics(runtimeFlags0)) {
					const tags = this.getFiberRef(currentMetricLabels)
					fiberStarted.unsafeUpdate(1, tags)
					fiberActive.unsafeUpdate(1, tags)
				}
				this._tracer = Context_get(this.getFiberRef(currentServices), tracerTag)
			}
			id() {
				return this._fiberId
			}
			resume(effect) {
				this.tell(resume(effect))
			}
			get status() {
				return this.ask((_, status) => status)
			}
			get runtimeFlags() {
				return this.ask((state, status) =>
					(self => "Done" === self._tag)(status)
						? state._runtimeFlags
						: status.runtimeFlags,
				)
			}
			scope() {
				return new Local((fiber = this).id(), fiber)
				var fiber
			}
			get children() {
				return this.ask(fiber => Array.from(fiber.getChildren()))
			}
			getChildren() {
				null === this._children && (this._children = new Set())
				return this._children
			}
			getInterruptedCause() {
				return this.getFiberRef(currentInterruptedCause)
			}
			fiberRefs() {
				return this.ask(fiber => fiber.getFiberRefs())
			}
			ask(f) {
				return suspend(() => {
					const deferred = deferredUnsafeMake(this._fiberId)
					this.tell(
						stateful((fiber, status) => {
							deferredUnsafeDone(
								deferred,
								sync(() => f(fiber, status)),
							)
						}),
					)
					return deferredAwait(deferred)
				})
			}
			tell(message) {
				this._queue.push(message)
				if (!this._running) {
					this._running = !0
					this.drainQueueLaterOnExecutor()
				}
			}
			get await() {
				return core_async(resume => {
					const cb = exit => resume(succeed(exit))
					this.tell(
						stateful((fiber, _) => {
							null !== fiber._exitValue
								? cb(this._exitValue)
								: fiber.addObserver(cb)
						}),
					)
					return sync(() =>
						this.tell(
							stateful((fiber, _) => {
								fiber.removeObserver(cb)
							}),
						),
					)
				}, this.id())
			}
			get inheritAll() {
				return withFiberRuntime((parentFiber, parentStatus) => {
					const parentFiberId = parentFiber.id(),
						parentFiberRefs = parentFiber.getFiberRefs(),
						parentRuntimeFlags = parentStatus.runtimeFlags,
						childFiberRefs = this.getFiberRefs(),
						updatedFiberRefs = joinAs(
							parentFiberRefs,
							parentFiberId,
							childFiberRefs,
						)
					parentFiber.setFiberRefs(updatedFiberRefs)
					const updatedRuntimeFlags =
						parentFiber.getFiberRef(currentRuntimeFlags)
					return (patch => {
						const effect = new EffectPrimitive("UpdateRuntimeFlags")
						effect.effect_instruction_i0 = patch
						effect.effect_instruction_i1 = void 0
						return effect
					})(
						Function_pipe(
							runtimeFlags_diff(parentRuntimeFlags, updatedRuntimeFlags),
							RuntimeFlagsPatch_exclude(1),
							RuntimeFlagsPatch_exclude(16),
						),
					)
				})
			}
			get poll() {
				return sync(() => fromNullable(this._exitValue))
			}
			unsafePoll() {
				return this._exitValue
			}
			interruptAsFork(fiberId) {
				return sync(() => this.tell(interruptSignal(interrupt(fiberId))))
			}
			unsafeInterruptAsFork(fiberId) {
				this.tell(interruptSignal(interrupt(fiberId)))
			}
			addObserver(observer) {
				null !== this._exitValue
					? observer(this._exitValue)
					: this._observers.push(observer)
			}
			removeObserver(observer) {
				this._observers = this._observers.filter(o => o !== observer)
			}
			getFiberRefs() {
				this.setFiberRef(currentRuntimeFlags, this._runtimeFlags)
				return this._fiberRefs
			}
			unsafeDeleteFiberRef(fiberRef) {
				this._fiberRefs = delete_(this._fiberRefs, fiberRef)
			}
			getFiberRef(fiberRef) {
				return this._fiberRefs.locals.has(fiberRef)
					? this._fiberRefs.locals.get(fiberRef)[0][1]
					: fiberRef.initial
			}
			setFiberRef(fiberRef, value) {
				this._fiberRefs = updateAs(this._fiberRefs, {
					fiberId: this._fiberId,
					fiberRef,
					value,
				})
				this.refreshRefCache()
			}
			refreshRefCache() {
				this._tracer = Context_get(this.getFiberRef(currentServices), tracerTag)
				this._supervisor = this.getFiberRef(currentSupervisor)
				this._scheduler = this.getFiberRef(currentScheduler)
			}
			setFiberRefs(fiberRefs) {
				this._fiberRefs = fiberRefs
				this.refreshRefCache()
			}
			addChild(child) {
				this.getChildren().add(child)
			}
			removeChild(child) {
				this.getChildren().delete(child)
			}
			drainQueueOnCurrentThread() {
				let recurse = !0
				for (; recurse; ) {
					let evaluationSignal = "Continue"
					const prev = globalThis[currentFiberURI]
					globalThis[currentFiberURI] = this
					try {
						for (; "Continue" === evaluationSignal; )
							evaluationSignal =
								0 === this._queue.length
									? "Done"
									: this.evaluateMessageWhileSuspended(
											this._queue.splice(0, 1)[0],
										)
					} finally {
						this._running = !1
						globalThis[currentFiberURI] = prev
					}
					if (this._queue.length > 0 && !this._running) {
						this._running = !0
						if ("Yield" === evaluationSignal) {
							this.drainQueueLaterOnExecutor()
							recurse = !1
						} else recurse = !0
					} else recurse = !1
				}
			}
			drainQueueLaterOnExecutor() {
				this._scheduler.scheduleTask(
					this.run,
					this.getFiberRef(currentSchedulingPriority),
				)
			}
			drainQueueWhileRunning(runtimeFlags, cur0) {
				let cur = cur0
				for (; this._queue.length > 0; ) {
					const message = this._queue.splice(0, 1)[0]
					cur = drainQueueWhileRunningTable[message._tag](
						this,
						runtimeFlags,
						cur,
						message,
					)
				}
				return cur
			}
			isInterrupted() {
				return !(self =>
					"Empty" === self._tag ||
					cause_reduce(self, !0, (acc, cause) => {
						switch (cause._tag) {
							case "Empty":
								return Option_some(acc)
							case "Die":
							case "Fail":
							case "Interrupt":
								return Option_some(!1)
							default:
								return Option_none()
						}
					}))(this.getFiberRef(currentInterruptedCause))
			}
			addInterruptedCause(cause) {
				const oldSC = this.getFiberRef(currentInterruptedCause)
				this.setFiberRef(currentInterruptedCause, sequential(oldSC, cause))
			}
			processNewInterruptSignal(cause) {
				this.addInterruptedCause(cause)
				this.sendInterruptSignalToAllChildren()
			}
			sendInterruptSignalToAllChildren() {
				if (null === this._children || 0 === this._children.size) return !1
				let told = !1
				for (const child of this._children) {
					child.tell(interruptSignal(interrupt(this.id())))
					told = !0
				}
				return told
			}
			interruptAllChildren() {
				if (this.sendInterruptSignalToAllChildren()) {
					const it = this._children.values()
					this._children = null
					let isDone = !1
					return whileLoop({
						while: () => !isDone,
						body: () => {
							const next = it.next()
							return next.done
								? sync(() => {
										isDone = !0
									})
								: core_asVoid(next.value.await)
						},
						step: () => {},
					})
				}
				return null
			}
			reportExitValue(exit) {
				if (runtimeMetrics(this._runtimeFlags)) {
					const tags = this.getFiberRef(currentMetricLabels),
						startTimeMillis = this.id().startTimeMillis,
						endTimeMillis = Date.now()
					fiberLifetimes.unsafeUpdate(endTimeMillis - startTimeMillis, tags)
					fiberActive.unsafeUpdate(-1, tags)
					switch (exit._tag) {
						case "Success":
							fiberSuccesses.unsafeUpdate(1, tags)
							break
						case "Failure":
							fiberFailures.unsafeUpdate(1, tags)
					}
				}
				if ("Failure" === exit._tag) {
					const level = this.getFiberRef(currentUnhandledErrorLogLevel)
					isInterruptedOnly(exit.cause) ||
						"Some" !== level._tag ||
						this.log(
							"Fiber terminated with an unhandled error",
							exit.cause,
							level,
						)
				}
			}
			setExitValue(exit) {
				this._exitValue = exit
				this.reportExitValue(exit)
				for (let i = this._observers.length - 1; i >= 0; i--)
					this._observers[i](exit)
			}
			getLoggers() {
				return this.getFiberRef(currentLoggers)
			}
			log(message, cause, overrideLogLevel) {
				const logLevel = Option_isSome(overrideLogLevel)
						? overrideLogLevel.value
						: this.getFiberRef(currentLogLevel),
					minimumLogLevel = this.getFiberRef(currentMinimumLogLevel)
				if (LogLevel_greaterThan(minimumLogLevel, logLevel)) return
				const spans = this.getFiberRef(currentLogSpan),
					annotations = this.getFiberRef(currentLogAnnotations),
					loggers = this.getLoggers(),
					contextMap = this.getFiberRefs()
				if (HashSet_size(loggers) > 0) {
					const clockService = Context_get(
							this.getFiberRef(currentServices),
							clockTag,
						),
						date = new Date(clockService.unsafeCurrentTimeMillis())
					for (const logger of loggers)
						logger.log({
							fiberId: this.id(),
							logLevel,
							message,
							cause,
							context: contextMap,
							spans,
							annotations,
							date,
						})
				}
			}
			evaluateMessageWhileSuspended(message) {
				switch (message._tag) {
					case "YieldNow":
						return "Yield"
					case "InterruptSignal":
						this.processNewInterruptSignal(message.cause)
						if (null !== this._asyncInterruptor) {
							this._asyncInterruptor(exitFailCause(message.cause))
							this._asyncInterruptor = null
						}
						return "Continue"
					case "Resume":
						this._asyncInterruptor = null
						this._asyncBlockingOn = null
						this.evaluateEffect(message.effect)
						return "Continue"
					case "Stateful":
						message.onFiber(
							this,
							null !== this._exitValue
								? FiberStatus_done
								: ((runtimeFlags = this._runtimeFlags),
									(blockingOn = this._asyncBlockingOn),
									new Suspended(runtimeFlags, blockingOn)),
						)
						return "Continue"
					default:
						return fiberRuntime_absurd(message)
				}
				var runtimeFlags, blockingOn
			}
			evaluateEffect(effect0) {
				this._supervisor.onResume(this)
				try {
					let effect =
						interruptible(this._runtimeFlags) && this.isInterrupted()
							? exitFailCause(this.getInterruptedCause())
							: effect0
					for (; null !== effect; ) {
						const eff = effect,
							exit = this.runLoop(eff)
						if (exit === YieldedOp) {
							const op = yieldedOpChannel.currentOp
							yieldedOpChannel.currentOp = null
							if ("Yield" === op._op)
								if (cooperativeYielding(this._runtimeFlags)) {
									this.tell({ _tag: "YieldNow" })
									this.tell(resume(exitVoid))
									effect = null
								} else effect = exitVoid
							else "Async" === op._op && (effect = null)
						} else {
							this._runtimeFlags = Function_pipe(
								this._runtimeFlags,
								runtimeFlags_enable(16),
							)
							const interruption = this.interruptAllChildren()
							if (null !== interruption)
								effect = core_flatMap(interruption, () => exit)
							else {
								0 === this._queue.length
									? this.setExitValue(exit)
									: this.tell(resume(exit))
								effect = null
							}
						}
					}
				} finally {
					this._supervisor.onSuspend(this)
				}
			}
			start(effect) {
				if (this._running) this.tell(resume(effect))
				else {
					this._running = !0
					const prev = globalThis[currentFiberURI]
					globalThis[currentFiberURI] = this
					try {
						this.evaluateEffect(effect)
					} finally {
						this._running = !1
						globalThis[currentFiberURI] = prev
						this._queue.length > 0 && this.drainQueueLaterOnExecutor()
					}
				}
			}
			startFork(effect) {
				this.tell(resume(effect))
			}
			patchRuntimeFlags(oldRuntimeFlags, patch) {
				const newRuntimeFlags = runtimeFlags_patch(oldRuntimeFlags, patch)
				globalThis[currentFiberURI] = this
				this._runtimeFlags = newRuntimeFlags
				return newRuntimeFlags
			}
			initiateAsync(runtimeFlags, asyncRegister) {
				let alreadyCalled = !1
				const callback = effect => {
					if (!alreadyCalled) {
						alreadyCalled = !0
						this.tell(resume(effect))
					}
				}
				interruptible(runtimeFlags) && (this._asyncInterruptor = callback)
				try {
					asyncRegister(callback)
				} catch (e) {
					callback(failCause(die(e)))
				}
			}
			pushStack(cont) {
				this._stack.push(cont)
				"OnStep" === cont._op &&
					this._steps.push({
						refs: this.getFiberRefs(),
						flags: this._runtimeFlags,
					})
			}
			popStack() {
				const item = this._stack.pop()
				if (item) {
					"OnStep" === item._op && this._steps.pop()
					return item
				}
			}
			getNextSuccessCont() {
				let frame = this.popStack()
				for (; frame; ) {
					if ("OnFailure" !== frame._op) return frame
					frame = this.popStack()
				}
			}
			getNextFailCont() {
				let frame = this.popStack()
				for (; frame; ) {
					if ("OnSuccess" !== frame._op && "While" !== frame._op) return frame
					frame = this.popStack()
				}
			}
			Tag(op) {
				return core_map(fiberRefGet(currentContext), context =>
					Context_unsafeGet(context, op),
				)
			}
			Left(op) {
				return core_fail(op.left)
			}
			None(_) {
				return core_fail(new NoSuchElementException())
			}
			Right(op) {
				return exitSucceed(op.right)
			}
			Some(op) {
				return exitSucceed(op.value)
			}
			Micro(op) {
				return ((register, blockingOn = FiberId_none) => {
					const effect = new EffectPrimitive("Async")
					let cancelerRef
					effect.effect_instruction_i0 = resume => {
						cancelerRef = register(resume)
					}
					effect.effect_instruction_i1 = blockingOn
					return void 0 !== cancelerRef
						? onInterrupt(effect, _ => cancelerRef)
						: effect
				})(microResume => {
					const env = (() => {
						const controller = new AbortController(),
							refs = Object.create(null)
						refs[currentAbortController.key] = controller
						refs[currentAbortSignal.key] = controller.signal
						return envMake(refs)
					})().pipe(
						envSet(Micro_currentContext, this.getFiberRef(currentContext)),
					)
					let resume = microResume
					op[runSymbol](env, result => {
						if ("Right" === result._tag)
							return resume(exitSucceed(result.right))
						switch (result.left._tag) {
							case "Interrupt":
								return resume(exitFailCause(interrupt(FiberId_none)))
							case "Fail":
								return resume(core_fail(result.left.error))
							case "Die":
								return resume(core_die(result.left.defect))
						}
					})
					return core_async(abortResume => {
						resume = _ => {
							abortResume(core_void_)
						}
						envGet(env, currentAbortController).abort()
					})
				})
			}
			Sync(op) {
				const value = internalCall(() => op.effect_instruction_i0()),
					cont = this.getNextSuccessCont()
				if (void 0 !== cont) {
					cont._op in contOpSuccess || fiberRuntime_absurd(cont)
					return contOpSuccess[cont._op](this, cont, value)
				}
				yieldedOpChannel.currentOp = exitSucceed(value)
				return YieldedOp
			}
			Success(op) {
				const oldCur = op,
					cont = this.getNextSuccessCont()
				if (void 0 !== cont) {
					cont._op in contOpSuccess || fiberRuntime_absurd(cont)
					return contOpSuccess[cont._op](
						this,
						cont,
						oldCur.effect_instruction_i0,
					)
				}
				yieldedOpChannel.currentOp = oldCur
				return YieldedOp
			}
			Failure(op) {
				const cause = op.effect_instruction_i0,
					cont = this.getNextFailCont()
				if (void 0 === cont) {
					yieldedOpChannel.currentOp = exitFailCause(cause)
					return YieldedOp
				}
				switch (cont._op) {
					case "OnFailure":
					case "OnSuccessAndFailure":
						return interruptible(this._runtimeFlags) && this.isInterrupted()
							? exitFailCause(stripFailures(cause))
							: internalCall(() => cont.effect_instruction_i1(cause))
					case "OnStep":
						return interruptible(this._runtimeFlags) && this.isInterrupted()
							? exitFailCause(stripFailures(cause))
							: exitSucceed(exitFailCause(cause))
					case "RevertFlags":
						this.patchRuntimeFlags(this._runtimeFlags, cont.patch)
						return interruptible(this._runtimeFlags) && this.isInterrupted()
							? exitFailCause(sequential(cause, this.getInterruptedCause()))
							: exitFailCause(cause)
					default:
						fiberRuntime_absurd(cont)
				}
			}
			WithRuntime(op) {
				return internalCall(() =>
					op.effect_instruction_i0(
						this,
						FiberStatus_running(this._runtimeFlags),
					),
				)
			}
			Blocked(op) {
				const refs = this.getFiberRefs(),
					flags = this._runtimeFlags
				if (this._steps.length > 0) {
					const frames = [],
						snap = this._steps[this._steps.length - 1]
					let frame = this.popStack()
					for (; frame && "OnStep" !== frame._op; ) {
						frames.push(frame)
						frame = this.popStack()
					}
					this.setFiberRefs(snap.refs)
					this._runtimeFlags = snap.flags
					const patchRefs = FiberRefsPatch_diff(snap.refs, refs),
						patchFlags = runtimeFlags_diff(snap.flags, flags)
					return exitSucceed(
						blocked(
							op.effect_instruction_i0,
							withFiberRuntime(newFiber => {
								for (; frames.length > 0; ) newFiber.pushStack(frames.pop())
								newFiber.setFiberRefs(
									FiberRefsPatch_patch(
										newFiber.id(),
										newFiber.getFiberRefs(),
									)(patchRefs),
								)
								newFiber._runtimeFlags = runtimeFlags_patch(patchFlags)(
									newFiber._runtimeFlags,
								)
								return op.effect_instruction_i1
							}),
						),
					)
				}
				return uninterruptibleMask(restore =>
					core_flatMap(
						fiberRuntime_forkDaemon(
							(blockedRequests => {
								const effect = new EffectPrimitive("RunBlocked")
								effect.effect_instruction_i0 = blockedRequests
								return effect
							})(op.effect_instruction_i0),
						),
						() => restore(op.effect_instruction_i1),
					),
				)
			}
			RunBlocked(op) {
				return (self =>
					forEachSequentialDiscard(
						(self => {
							let current = List_of(self),
								updated = List_empty()
							for (;;) {
								const [parallel, sequential] = List_reduce(
									current,
									[parallelCollectionEmpty(), List_empty()],
									([parallel, sequential], blockedRequest) => {
										const [par, seq] = blockedRequests_step(blockedRequest)
										return [
											parallelCollectionCombine(parallel, par),
											List_appendAll(sequential, seq),
										]
									},
								)
								updated = blockedRequests_merge(updated, parallel)
								if (isNil(sequential)) return List_reverse(updated)
								current = sequential
							}
							throw new Error(
								"BUG: BlockedRequests.flatten - please report an issue at https://github.com/Effect-TS/effect/issues",
							)
						})(self),
						requestsByRequestResolver =>
							forEachConcurrentDiscard(
								(self => Array.from(self.map))(requestsByRequestResolver),
								([dataSource, sequential]) => {
									const map = new Map(),
										arr = []
									for (const block of sequential) {
										arr.push(toReadonlyArray(block))
										for (const entry of block) map.set(entry.request, entry)
									}
									const flat = arr.flat()
									return fiberRefLocally(
										invokeWithInterrupt(dataSource.runAll(arr), flat, () =>
											flat.forEach(entry => {
												entry.listeners.interrupted = !0
											}),
										),
										currentRequestMap,
										map,
									)
								},
								!1,
								!1,
							),
					))(op.effect_instruction_i0)
			}
			UpdateRuntimeFlags(op) {
				const updateFlags = op.effect_instruction_i0,
					oldRuntimeFlags = this._runtimeFlags,
					newRuntimeFlags = runtimeFlags_patch(oldRuntimeFlags, updateFlags)
				if (interruptible(newRuntimeFlags) && this.isInterrupted())
					return exitFailCause(this.getInterruptedCause())
				this.patchRuntimeFlags(this._runtimeFlags, updateFlags)
				if (op.effect_instruction_i1) {
					const revertFlags = runtimeFlags_diff(
						newRuntimeFlags,
						oldRuntimeFlags,
					)
					this.pushStack(new RevertFlags(revertFlags, op))
					return internalCall(() => op.effect_instruction_i1(oldRuntimeFlags))
				}
				return exitVoid
			}
			OnSuccess(op) {
				this.pushStack(op)
				return op.effect_instruction_i0
			}
			OnStep(op) {
				this.pushStack(op)
				return op.effect_instruction_i0
			}
			OnFailure(op) {
				this.pushStack(op)
				return op.effect_instruction_i0
			}
			OnSuccessAndFailure(op) {
				this.pushStack(op)
				return op.effect_instruction_i0
			}
			Async(op) {
				this._asyncBlockingOn = op.effect_instruction_i1
				this.initiateAsync(this._runtimeFlags, op.effect_instruction_i0)
				yieldedOpChannel.currentOp = op
				return YieldedOp
			}
			Yield(op) {
				this.isYielding = !1
				yieldedOpChannel.currentOp = op
				return YieldedOp
			}
			While(op) {
				const check = op.effect_instruction_i0,
					body = op.effect_instruction_i1
				if (check()) {
					this.pushStack(op)
					return body()
				}
				return exitVoid
			}
			Commit(op) {
				return internalCall(() => op.commit())
			}
			runLoop(effect0) {
				let cur = effect0
				this.currentOpCount = 0
				for (;;) {
					0 != (2 & this._runtimeFlags) && this._supervisor.onEffect(this, cur)
					this._queue.length > 0 &&
						(cur = this.drainQueueWhileRunning(this._runtimeFlags, cur))
					if (!this.isYielding) {
						this.currentOpCount += 1
						const shouldYield = this._scheduler.shouldYield(this)
						if (!1 !== shouldYield) {
							this.isYielding = !0
							this.currentOpCount = 0
							const oldCur = cur
							cur = core_flatMap(
								yieldNow({ priority: shouldYield }),
								() => oldCur,
							)
						}
					}
					try {
						;("_op" in cur && cur._op in this) || fiberRuntime_absurd(cur)
						cur = this._tracer.context(() => {
							return "3.5.7" !== cur[Effectable_EffectTypeId]._V
								? ((message = `Cannot execute an Effect versioned ${cur[Effectable_EffectTypeId]._V} with a Runtime of version 3.5.7`),
									core_flatMap(
										sync(() => die(new RuntimeException(message))),
										failCause,
									))
								: this[cur._op](cur)
							var message
						}, this)
						if (cur === YieldedOp) {
							const op = yieldedOpChannel.currentOp
							if ("Yield" === op._op || "Async" === op._op) return YieldedOp
							yieldedOpChannel.currentOp = null
							return "Success" === op._op || "Failure" === op._op
								? op
								: exitFailCause(die(op))
						}
					} catch (e) {
						cur = isEffectError(e)
							? exitFailCause(e.cause)
							: isInterruptedException(e)
								? exitFailCause(sequential(die(e), interrupt(FiberId_none)))
								: core_die(e)
					}
				}
			}
			run = () => {
				this.drainQueueOnCurrentThread()
			}
		}
		const currentMinimumLogLevel = globalValue(
				"effect/FiberRef/currentMinimumLogLevel",
				() => fiberRefUnsafeMake(Info),
			),
			defaultLogger = globalValue(
				Symbol.for("effect/Logger/defaultLogger"),
				() =>
					(self =>
						makeLogger(opts => {
							const services = FiberRefs_getOrDefault(
								opts.context,
								currentServices,
							)
							Context_get(services, consoleTag).unsafe.log(self.log(opts))
						}))(stringLogger),
			),
			tracerLogger = globalValue(Symbol.for("effect/Logger/tracerLogger"), () =>
				makeLogger(
					({ annotations, cause, context, fiberId, logLevel, message }) => {
						const span = flatMap(
								fiberRefs_get(context, currentContext),
								Context_getOption(spanTag),
							),
							clockService = map(fiberRefs_get(context, currentServices), _ =>
								Context_get(_, clockTag),
							)
						if (
							"None" === span._tag ||
							"ExternalSpan" === span.value._tag ||
							"None" === clockService._tag
						)
							return
						const attributes = Object.fromEntries(
							HashMap_map(annotations, toStringUnknown),
						)
						attributes["effect.fiberId"] = FiberId_threadName(fiberId)
						attributes["effect.logLevel"] = logLevel.label
						null !== cause &&
							"Empty" !== cause._tag &&
							(attributes["effect.cause"] = pretty(cause))
						span.value.event(
							String(message),
							clockService.value.unsafeCurrentTimeNanos(),
							attributes,
						)
					},
				),
			),
			currentLoggers = globalValue(
				Symbol.for("effect/FiberRef/currentLoggers"),
				() =>
					(initial => {
						const differ = differ_make({
							empty: differ_hashSetPatch_empty(),
							combine: (first, second) => hashSetPatch_combine(second)(first),
							diff: (oldValue, newValue) =>
								((oldValue, newValue) => {
									const [removed, patch] = HashSet_reduce(
										[oldValue, differ_hashSetPatch_empty()],
										([set, patch], value) =>
											HashSet_has(value)(set)
												? [HashSet_remove(value)(set), patch]
												: [
														set,
														hashSetPatch_combine(hashSetPatch_makeAdd(value))(
															patch,
														),
													],
									)(newValue)
									return HashSet_reduce(patch, (patch, value) =>
										hashSetPatch_combine(
											(value => {
												const o = Object.create(hashSetPatch_RemoveProto)
												o.value = value
												return o
											})(value),
										)(patch),
									)(removed)
								})(oldValue, newValue),
							patch: (patch, oldValue) => hashSetPatch_patch(oldValue)(patch),
						})
						return fiberRefUnsafeMakePatch(initial, {
							differ,
							fork: differ.empty,
						})
					})(HashSet_make(defaultLogger, tracerLogger)),
			),
			fiberRuntime_acquireRelease = Function_dual(
				args => isEffect(args[0]),
				(acquire, release) =>
					uninterruptible(
						core_tap(acquire, a =>
							fiberRuntime_addFinalizer(exit => release(a, exit)),
						),
					),
			),
			fiberRuntime_addFinalizer = finalizer =>
				withFiberRuntime(runtime => {
					const acquireRefs = runtime.getFiberRefs(),
						acquireFlags = runtime._runtimeFlags
					return core_flatMap(fiberRuntime_scope, scope =>
						scopeAddFinalizerExit(scope, exit =>
							withFiberRuntime(runtimeFinalizer => {
								const preRefs = runtimeFinalizer.getFiberRefs(),
									preFlags = runtimeFinalizer._runtimeFlags,
									patchRefs = FiberRefsPatch_diff(preRefs, acquireRefs),
									patchFlags = runtimeFlags_diff(preFlags, acquireFlags),
									inverseRefs = FiberRefsPatch_diff(acquireRefs, preRefs)
								runtimeFinalizer.setFiberRefs(
									FiberRefsPatch_patch(
										patchRefs,
										runtimeFinalizer.id(),
										acquireRefs,
									),
								)
								return fiberRuntime_ensuring(
									withRuntimeFlags(finalizer(exit), patchFlags),
									sync(() => {
										runtimeFinalizer.setFiberRefs(
											FiberRefsPatch_patch(
												inverseRefs,
												runtimeFinalizer.id(),
												runtimeFinalizer.getFiberRefs(),
											),
										)
									}),
								)
							}),
						),
					)
				}),
			fiberRuntime_all = (arg, options) => {
				const [effects, reconcile] = (input => {
					if (Array.isArray(input) || Predicate_isIterable(input))
						return [input, Option_none()]
					const keys = Object.keys(input),
						size = keys.length
					return [
						keys.map(k => input[k]),
						Option_some(values => {
							const res = {}
							for (let i = 0; i < size; i++) res[keys[i]] = values[i]
							return res
						}),
					]
				})(arg)
				return "validate" === options?.mode
					? ((effects, reconcile, options) => {
							const eitherEffects = []
							for (const effect of effects)
								eitherEffects.push(core_either(effect))
							return core_flatMap(
								fiberRuntime_forEach(eitherEffects, Function_identity, {
									concurrency: options?.concurrency,
									batching: options?.batching,
								}),
								eithers => {
									const none = Option_none(),
										size = eithers.length,
										errors = new Array(size),
										successes = new Array(size)
									let errored = !1
									for (let i = 0; i < size; i++) {
										const either = eithers[i]
										if ("Left" === either._tag) {
											errors[i] = Option_some(either.left)
											errored = !0
										} else {
											successes[i] = either.right
											errors[i] = none
										}
									}
									return errored
										? "Some" === reconcile._tag
											? core_fail(reconcile.value(errors))
											: core_fail(errors)
										: options?.discard
											? core_void_
											: "Some" === reconcile._tag
												? succeed(reconcile.value(successes))
												: succeed(successes)
								},
							)
						})(effects, reconcile, options)
					: "either" === options?.mode
						? ((effects, reconcile, options) => {
								const eitherEffects = []
								for (const effect of effects)
									eitherEffects.push(core_either(effect))
								return options?.discard
									? fiberRuntime_forEach(eitherEffects, Function_identity, {
											concurrency: options?.concurrency,
											batching: options?.batching,
											discard: !0,
										})
									: core_map(
											fiberRuntime_forEach(eitherEffects, Function_identity, {
												concurrency: options?.concurrency,
												batching: options?.batching,
											}),
											eithers =>
												"Some" === reconcile._tag
													? reconcile.value(eithers)
													: eithers,
										)
							})(effects, reconcile, options)
						: !0 !== options?.discard && "Some" === reconcile._tag
							? core_map(
									fiberRuntime_forEach(effects, Function_identity, options),
									reconcile.value,
								)
							: fiberRuntime_forEach(effects, Function_identity, options)
			},
			fiberRuntime_forEach = Function_dual(
				args => Predicate_isIterable(args[0]),
				(self, f, options) =>
					withFiberRuntime(r => {
						const isRequestBatchingEnabled =
							!0 === options?.batching ||
							("inherit" === options?.batching &&
								r.getFiberRef(currentRequestBatching))
						return options?.discard
							? concurrency_match(
									options.concurrency,
									() =>
										finalizersMask(ExecutionStrategy_sequential)(restore =>
											isRequestBatchingEnabled
												? forEachConcurrentDiscard(
														self,
														(a, i) => restore(f(a, i)),
														!0,
														!1,
														1,
													)
												: forEachSequentialDiscard(self, (a, i) =>
														restore(f(a, i)),
													),
										),
									() =>
										finalizersMask(ExecutionStrategy_parallel)(restore =>
											forEachConcurrentDiscard(
												self,
												(a, i) => restore(f(a, i)),
												isRequestBatchingEnabled,
												!1,
											),
										),
									n =>
										finalizersMask(ExecutionStrategy_parallelN(n))(restore =>
											forEachConcurrentDiscard(
												self,
												(a, i) => restore(f(a, i)),
												isRequestBatchingEnabled,
												!1,
												n,
											),
										),
								)
							: concurrency_match(
									options?.concurrency,
									() =>
										finalizersMask(ExecutionStrategy_sequential)(restore =>
											isRequestBatchingEnabled
												? forEachParN(self, 1, (a, i) => restore(f(a, i)), !0)
												: forEachSequential(self, (a, i) => restore(f(a, i))),
										),
									() =>
										finalizersMask(ExecutionStrategy_parallel)(restore =>
											forEachParUnbounded(
												self,
												(a, i) => restore(f(a, i)),
												isRequestBatchingEnabled,
											),
										),
									n =>
										finalizersMask(ExecutionStrategy_parallelN(n))(restore =>
											forEachParN(
												self,
												n,
												(a, i) => restore(f(a, i)),
												isRequestBatchingEnabled,
											),
										),
								)
					}),
			),
			forEachParUnbounded = (self, f, batching) =>
				suspend(() => {
					const as = Array_fromIterable(self),
						array = new Array(as.length)
					return core_zipRight(
						forEachConcurrentDiscard(
							as,
							(a, i) => core_flatMap(f(a, i), b => sync(() => (array[i] = b))),
							batching,
							!1,
						),
						succeed(array),
					)
				}),
			forEachConcurrentDiscard = (self, f, batching, processAll, n) =>
				uninterruptibleMask(restore =>
					(f =>
						withFiberRuntime(state => {
							const scope = Function_pipe(
								state.getFiberRef(currentForkScopeOverride),
								getOrElse(() => state.scope()),
							)
							return f(
								fiberRefLocally(currentForkScopeOverride, Option_some(scope)),
							)
						}))(graft =>
						withFiberRuntime(parent => {
							let todos = Array.from(self).reverse(),
								target = todos.length
							if (0 === target) return core_void_
							let counter = 0,
								interrupted = !1
							const fibersCount = n ? Math.min(todos.length, n) : todos.length,
								fibers = new Set(),
								results = new Array(),
								startOrder = new Array(),
								joinOrder = new Array(),
								residual = new Array(),
								collectExits = () => {
									const exits = results
										.filter(({ exit }) => "Failure" === exit._tag)
										.sort((a, b) =>
											a.index < b.index ? -1 : a.index === b.index ? 0 : 1,
										)
										.map(({ exit }) => exit)
									0 === exits.length && exits.push(exitVoid)
									return exits
								},
								runFiber = (eff, interruptImmediately = !1) => {
									const runnable = uninterruptible(graft(eff)),
										fiber = unsafeForkUnstarted(
											runnable,
											parent,
											parent._runtimeFlags,
											globalScope,
										)
									parent._scheduler.scheduleTask(() => {
										interruptImmediately &&
											fiber.unsafeInterruptAsFork(parent.id())
										fiber.resume(runnable)
									}, 0)
									return fiber
								},
								onInterruptSignal = () => {
									if (!processAll) {
										target -= todos.length
										todos = []
									}
									interrupted = !0
									fibers.forEach(fiber => {
										fiber._scheduler.scheduleTask(() => {
											fiber.unsafeInterruptAsFork(parent.id())
										}, 0)
									})
								},
								stepOrExit = batching ? step : core_exit,
								processingFiber = runFiber(
									core_async(resume => {
										const pushResult = (res, index) => {
												if ("Blocked" === res._op) residual.push(res)
												else {
													results.push({ index, exit: res })
													"Failure" !== res._op ||
														interrupted ||
														onInterruptSignal()
												}
											},
											next = () => {
												if (todos.length > 0) {
													const a = todos.pop()
													let index = counter++
													const returnNextElement = () => {
															const a = todos.pop()
															index = counter++
															return core_flatMap(yieldNow(), () =>
																core_flatMap(
																	stepOrExit(restore(f(a, index))),
																	onRes,
																),
															)
														},
														onRes = res => {
															if (todos.length > 0) {
																pushResult(res, index)
																if (todos.length > 0) return returnNextElement()
															}
															return succeed(res)
														},
														todo = core_flatMap(
															stepOrExit(restore(f(a, index))),
															onRes,
														),
														fiber = runFiber(todo)
													startOrder.push(fiber)
													fibers.add(fiber)
													interrupted &&
														fiber._scheduler.scheduleTask(() => {
															fiber.unsafeInterruptAsFork(parent.id())
														}, 0)
													fiber.addObserver(wrapped => {
														let exit
														exit =
															"Failure" === wrapped._op
																? wrapped
																: wrapped.effect_instruction_i0
														joinOrder.push(fiber)
														fibers.delete(fiber)
														pushResult(exit, index)
														if (results.length === target)
															resume(
																succeed(
																	getOrElse(
																		exitCollectAll(collectExits(), {
																			parallel: !0,
																		}),
																		() => exitVoid,
																	),
																),
															)
														else if (
															residual.length + results.length ===
															target
														) {
															const requests = residual
																.map(blocked => blocked.effect_instruction_i0)
																.reduce(par)
															resume(
																succeed(
																	blocked(
																		requests,
																		forEachConcurrentDiscard(
																			[
																				getOrElse(
																					exitCollectAll(collectExits(), {
																						parallel: !0,
																					}),
																					() => exitVoid,
																				),
																				...residual.map(
																					blocked =>
																						blocked.effect_instruction_i1,
																				),
																			],
																			i => i,
																			batching,
																			!0,
																			n,
																		),
																	),
																),
															)
														} else next()
													})
												}
											}
										for (let i = 0; i < fibersCount; i++) next()
									}),
								)
							return core_asVoid(
								onExit(
									core_flatten(
										restore(
											(self =>
												core_zipLeft(
													core_flatten(self.await),
													self.inheritAll,
												))(processingFiber),
										),
									),
									exitMatch({
										onFailure: () => {
											onInterruptSignal()
											const target = residual.length + 1,
												concurrency = Math.min(
													"number" == typeof n ? n : residual.length,
													residual.length,
												),
												toPop = Array.from(residual)
											return core_async(cb => {
												const exits = []
												let count = 0,
													index = 0
												const check = (index, hitNext) => exit => {
														exits[index] = exit
														count++
														count === target &&
															cb(
																getOrThrow(
																	exitCollectAll(exits, { parallel: !0 }),
																),
															)
														toPop.length > 0 && hitNext && next()
													},
													next = () => {
														runFiber(toPop.pop(), !0).addObserver(
															check(index, !0),
														)
														index++
													}
												processingFiber.addObserver(check(index, !1))
												index++
												for (let i = 0; i < concurrency; i++) next()
											})
										},
										onSuccess: () =>
											forEachSequential(joinOrder, f => f.inheritAll),
									}),
								),
							)
						}),
					),
				),
			forEachParN = (self, n, f, batching) =>
				suspend(() => {
					const as = Array_fromIterable(self),
						array = new Array(as.length)
					return core_zipRight(
						forEachConcurrentDiscard(
							as,
							(a, i) => core_map(f(a, i), b => (array[i] = b)),
							batching,
							!1,
							n,
						),
						succeed(array),
					)
				}),
			fiberRuntime_forkDaemon = self =>
				forkWithScopeOverride(self, globalScope),
			unsafeForkUnstarted = (
				effect,
				parentFiber,
				parentRuntimeFlags,
				overrideScope = null,
			) =>
				unsafeMakeChildFiber(
					effect,
					parentFiber,
					parentRuntimeFlags,
					overrideScope,
				),
			unsafeMakeChildFiber = (
				effect,
				parentFiber,
				parentRuntimeFlags,
				overrideScope = null,
			) => {
				const childId = FiberId_unsafeMake(),
					parentFiberRefs = parentFiber.getFiberRefs(),
					childFiberRefs = forkAs(parentFiberRefs, childId),
					childFiber = new FiberRuntime(
						childId,
						childFiberRefs,
						parentRuntimeFlags,
					),
					childContext = getOrDefault(childFiberRefs, currentContext),
					supervisor = childFiber._supervisor
				supervisor.onStart(
					childContext,
					effect,
					Option_some(parentFiber),
					childFiber,
				)
				childFiber.addObserver(exit => supervisor.onEnd(exit, childFiber))
				;(null !== overrideScope
					? overrideScope
					: Function_pipe(
							parentFiber.getFiberRef(currentForkScopeOverride),
							getOrElse(() => parentFiber.scope()),
						)
				).add(parentRuntimeFlags, childFiber)
				return childFiber
			},
			forkWithScopeOverride = (self, scopeOverride) =>
				withFiberRuntime((parentFiber, parentStatus) =>
					succeed(
						((
							effect,
							parentFiber,
							parentRuntimeFlags,
							overrideScope = null,
						) => {
							const childFiber = unsafeMakeChildFiber(
								effect,
								parentFiber,
								parentRuntimeFlags,
								overrideScope,
							)
							childFiber.resume(effect)
							return childFiber
						})(self, parentFiber, parentStatus.runtimeFlags, scopeOverride),
					),
				),
			parallelFinalizers = self =>
				contextWithEffect(context =>
					match(Context_getOption(context, scopeTag), {
						onNone: () => self,
						onSome: scope => {
							switch (scope.strategy._tag) {
								case "Parallel":
									return self
								case "Sequential":
								case "ParallelN":
									return core_flatMap(
										scopeFork(scope, ExecutionStrategy_parallel),
										inner => scopeExtend(self, inner),
									)
							}
						},
					}),
				),
			parallelNFinalizers = parallelism => self =>
				contextWithEffect(context =>
					match(Context_getOption(context, scopeTag), {
						onNone: () => self,
						onSome: scope =>
							"ParallelN" === scope.strategy._tag &&
							scope.strategy.parallelism === parallelism
								? self
								: core_flatMap(
										scopeFork(scope, ExecutionStrategy_parallelN(parallelism)),
										inner => scopeExtend(self, inner),
									),
					}),
				),
			finalizersMask = strategy => self =>
				contextWithEffect(context =>
					match(Context_getOption(context, scopeTag), {
						onNone: () => self(Function_identity),
						onSome: scope => {
							const patch =
								"Parallel" === strategy._tag
									? parallelFinalizers
									: "Sequential" === strategy._tag
										? sequentialFinalizers
										: parallelNFinalizers(strategy.parallelism)
							switch (scope.strategy._tag) {
								case "Parallel":
									return patch(self(parallelFinalizers))
								case "Sequential":
									return patch(self(sequentialFinalizers))
								case "ParallelN":
									return patch(
										self(parallelNFinalizers(scope.strategy.parallelism)),
									)
							}
						},
					}),
				),
			sequentialFinalizers = self =>
				contextWithEffect(context =>
					match(Context_getOption(context, scopeTag), {
						onNone: () => self,
						onSome: scope => {
							switch (scope.strategy._tag) {
								case "Sequential":
									return self
								case "Parallel":
								case "ParallelN":
									return core_flatMap(
										scopeFork(scope, ExecutionStrategy_sequential),
										inner => scopeExtend(self, inner),
									)
							}
						},
					}),
				),
			zipLeftOptions = Function_dual(
				args => isEffect(args[1]),
				(self, that, options) =>
					!0 === options?.concurrent ||
					(void 0 !== options?.batching && !1 !== options.batching)
						? zipWithOptions(self, that, (a, _) => a, options)
						: core_zipLeft(self, that),
			),
			zipRightOptions = Function_dual(
				args => isEffect(args[1]),
				(self, that, options) =>
					!0 === options?.concurrent ||
					(void 0 !== options?.batching && !1 !== options.batching)
						? zipWithOptions(self, that, (_, b) => b, options)
						: core_zipRight(self, that),
			),
			zipWithOptions = Function_dual(
				args => isEffect(args[1]),
				(self, that, f, options) =>
					core_map(
						fiberRuntime_all([self, that], {
							concurrency: options?.concurrent ? 2 : 1,
							batching: options?.batching,
						}),
						([a, a2]) => f(a, a2),
					),
			),
			scopeTag = GenericTag("effect/Scope"),
			fiberRuntime_scope = scopeTag,
			ScopeImplProto = {
				[ScopeTypeId]: ScopeTypeId,
				[CloseableScopeTypeId]: CloseableScopeTypeId,
				pipe() {
					return Pipeable_pipeArguments(this, arguments)
				},
				fork(strategy) {
					return sync(() => {
						const newScope = fiberRuntime_scopeUnsafeMake(strategy)
						if ("Closed" === this.state._tag) {
							newScope.state = this.state
							return newScope
						}
						const fin = exit => newScope.close(exit)
						this.state.finalizers.add(fin)
						;((scope, fin) => {
							"Open" === scope.state._tag && scope.state.finalizers.add(fin)
						})(newScope, _ =>
							sync(() => {
								"Open" === this.state._tag && this.state.finalizers.delete(fin)
							}),
						)
						return newScope
					})
				},
				close(exit) {
					return suspend(() => {
						if ("Closed" === this.state._tag) return core_void_
						const finalizers = Array.from(
							this.state.finalizers.values(),
						).reverse()
						this.state = { _tag: "Closed", exit }
						return 0 === finalizers.length
							? core_void_
							: (self => "Sequential" === this.strategy._tag)()
								? Function_pipe(
										forEachSequential(finalizers, fin => core_exit(fin(exit))),
										core_flatMap(results =>
											Function_pipe(
												exitCollectAll(results),
												map(exitAsVoid),
												getOrElse(() => exitVoid),
											),
										),
									)
								: (self => "Parallel" === this.strategy._tag)()
									? Function_pipe(
											forEachParUnbounded(
												finalizers,
												fin => core_exit(fin(exit)),
												!1,
											),
											core_flatMap(results =>
												Function_pipe(
													exitCollectAll(results, { parallel: !0 }),
													map(exitAsVoid),
													getOrElse(() => exitVoid),
												),
											),
										)
									: Function_pipe(
											forEachParN(
												finalizers,
												this.strategy.parallelism,
												fin => core_exit(fin(exit)),
												!1,
											),
											core_flatMap(results =>
												Function_pipe(
													exitCollectAll(results, { parallel: !0 }),
													map(exitAsVoid),
													getOrElse(() => exitVoid),
												),
											),
										)
					})
				},
				addFinalizer(fin) {
					return suspend(() => {
						if ("Closed" === this.state._tag) return fin(this.state.exit)
						this.state.finalizers.add(fin)
						return core_void_
					})
				},
			},
			fiberRuntime_scopeUnsafeMake = (
				strategy = executionStrategy_sequential,
			) => {
				const scope = Object.create(ScopeImplProto)
				scope.strategy = strategy
				scope.state = { _tag: "Open", finalizers: new Set() }
				return scope
			},
			fiberRuntime_scopeMake = (strategy = executionStrategy_sequential) =>
				sync(() => fiberRuntime_scopeUnsafeMake(strategy)),
			scopeExtend = Function_dual(2, (effect, scope) =>
				mapInputContext(effect, Context_merge(Context_make(scopeTag, scope))),
			),
			fiberRefUnsafeMakeSupervisor = initial =>
				fiberRefUnsafeMakePatch(initial, {
					differ: patch_differ,
					fork: supervisor_patch_empty,
				}),
			fiberRefLocallyScoped = Function_dual(2, (self, value) =>
				core_asVoid(
					fiberRuntime_acquireRelease(
						core_flatMap(fiberRefGet(self), oldValue =>
							core_as(fiberRefSet(self, value), oldValue),
						),
						oldValue => fiberRefSet(self, oldValue),
					),
				),
			),
			fiberRefLocallyScopedWith = Function_dual(2, (self, f) =>
				fiberRefGetWith(self, a => fiberRefLocallyScoped(self, f(a))),
			),
			currentRuntimeFlags = fiberRefUnsafeMakeRuntimeFlags(runtimeFlags_none),
			currentSupervisor = fiberRefUnsafeMakeSupervisor(supervisor_none),
			fiberRuntime_ensuring = Function_dual(2, (self, finalizer) =>
				uninterruptibleMask(restore =>
					matchCauseEffect(restore(self), {
						onFailure: cause1 =>
							matchCauseEffect(finalizer, {
								onFailure: cause2 => failCause(sequential(cause1, cause2)),
								onSuccess: () => failCause(cause1),
							}),
						onSuccess: a => core_as(finalizer, a),
					}),
				),
			),
			invokeWithInterrupt = (self, entries, onInterrupt) =>
				fiberIdWith(id =>
					core_flatMap(
						core_flatMap(
							fiberRuntime_forkDaemon(core_interruptible(self)),
							processing =>
								core_async(cb => {
									const counts = entries.map(_ => _.listeners.count),
										checkDone = () => {
											if (
												counts.every(count => 0 === count) &&
												entries.every(
													_ =>
														"Pending" === _.result.state.current._tag ||
														!(
															"Done" !== _.result.state.current._tag ||
															!exitIsExit(_.result.state.current.effect) ||
															"Failure" !==
																_.result.state.current.effect._tag ||
															!(self =>
																Option_isSome(
																	(self =>
																		find(self, cause =>
																			"Interrupt" === cause._tag
																				? Option_some(cause.fiberId)
																				: Option_none(),
																		))(self),
																))(_.result.state.current.effect.cause)
														),
												)
											) {
												cleanup.forEach(f => f())
												onInterrupt?.()
												cb(
													(self =>
														core_flatMap(fiberId, fiberId =>
															Function_pipe(self, interruptAsFiber(fiberId)),
														))(processing),
												)
											}
										}
									processing.addObserver(exit => {
										cleanup.forEach(f => f())
										cb(exit)
									})
									const cleanup = entries.map((r, i) => {
										const observer = count => {
											counts[i] = count
											checkDone()
										}
										r.listeners.addObserver(observer)
										return () => r.listeners.removeObserver(observer)
									})
									checkDone()
									return sync(() => {
										cleanup.forEach(f => f())
									})
								}),
						),
						() =>
							suspend(() => {
								const residual = entries.flatMap(entry =>
									entry.state.completed ? [] : [entry],
								)
								return forEachSequentialDiscard(residual, entry =>
									request_complete(
										entry.request,
										(fiberId => exitFailCause(interrupt(fiberId)))(id),
									),
								)
							}),
					),
				),
			Cause_fail = fail,
			Cause_failureOrCause = failureOrCause,
			Cause_NoSuchElementException = NoSuchElementException,
			Cause_pretty = pretty,
			String_Equivalence = Equivalence_string,
			String_isEmpty = self => 0 === self.length,
			String_isNonEmpty = self => self.length > 0,
			String_split = Function_dual(2, (self, separator) => {
				const out = self.split(separator)
				return isNonEmptyArray(out) ? out : [self]
			})
		Symbol.iterator
		const IntervalTypeId = Symbol.for("effect/ScheduleInterval"),
			interval_empty = {
				[IntervalTypeId]: IntervalTypeId,
				startMillis: 0,
				endMillis: 0,
			},
			ScheduleInterval_empty = interval_empty,
			ScheduleInterval_after = startMilliseconds => {
				return (startMillis = startMilliseconds) >
					(endMillis = Number.POSITIVE_INFINITY)
					? interval_empty
					: { [IntervalTypeId]: IntervalTypeId, startMillis, endMillis }
				var startMillis, endMillis
			},
			IntervalsTypeId = Symbol.for("effect/ScheduleIntervals"),
			ScheduleDecision_continueWith = interval => {
				return {
					_tag: "Continue",
					intervals:
						((intervals = Chunk_of(interval)),
						{ [IntervalsTypeId]: IntervalsTypeId, intervals }),
				}
				var intervals
			},
			ScheduleTypeId = Symbol.for("effect/Schedule"),
			ScheduleDriverTypeId = Symbol.for("effect/ScheduleDriver"),
			scheduleVariance = { _Out: _ => _, _In: _ => _, _R: _ => _ },
			scheduleDriverVariance = { _Out: _ => _, _In: _ => _, _R: _ => _ }
		class ScheduleImpl {
			initial
			step;
			[ScheduleTypeId] = scheduleVariance
			constructor(initial, step) {
				this.initial = initial
				this.step = step
			}
			pipe() {
				return Pipeable_pipeArguments(this, arguments)
			}
		}
		class ScheduleDriverImpl {
			schedule
			ref;
			[ScheduleDriverTypeId] = scheduleDriverVariance
			constructor(schedule, ref) {
				this.schedule = schedule
				this.ref = ref
			}
			get state() {
				return core_map(ref_get(this.ref), tuple => tuple[1])
			}
			get last() {
				return core_flatMap(ref_get(this.ref), ([element, _]) => {
					switch (element._tag) {
						case "None":
							return failSync(() => new NoSuchElementException())
						case "Some":
							return succeed(element.value)
					}
				})
			}
			get reset() {
				return ref_set(this.ref, [Option_none(), this.schedule.initial])
			}
			next(input) {
				return Function_pipe(
					core_map(ref_get(this.ref), tuple => tuple[1]),
					core_flatMap(state =>
						Function_pipe(
							Clock_currentTimeMillis,
							core_flatMap(now =>
								Function_pipe(
									suspend(() => this.schedule.step(now, input, state)),
									core_flatMap(([state, out, decision]) => {
										const setState = ref_set(this.ref, [
											Option_some(out),
											state,
										])
										if ((self => "Done" === self._tag)(decision))
											return core_zipRight(setState, core_fail(Option_none()))
										const millis =
											(self =>
												Function_pipe(
													self.intervals,
													Chunk_head,
													getOrElse(() => ScheduleInterval_empty),
												).startMillis)(decision.intervals) - now
										return millis <= 0
											? core_as(setState, out)
											: Function_pipe(
													setState,
													core_zipRight(
														(duration => {
															const decodedDuration = decode(duration)
															return clockWith(clock =>
																clock.sleep(decodedDuration),
															)
														})(Duration_millis(millis)),
													),
													core_as(out),
												)
									}),
								),
							),
						),
					),
				)
			}
		}
		const schedule_Effect = Function_dual(2, (self, schedule) =>
				scheduleFrom_Effect(self, void 0, schedule),
			),
			scheduleFrom_Effect = Function_dual(3, (self, initial, schedule) =>
				core_flatMap(
					(self =>
						Function_pipe(
							ref_make([Option_none(), self.initial]),
							core_map(ref => new ScheduleDriverImpl(self, ref)),
						))(schedule),
					driver => scheduleFrom_EffectLoop(self, initial, driver),
				),
			),
			scheduleFrom_EffectLoop = (self, initial, driver) =>
				matchEffect(driver.next(initial), {
					onFailure: () =>
						(self => orDieWith(self, Function_identity))(driver.last),
					onSuccess: () =>
						core_flatMap(self, a => scheduleFrom_EffectLoop(self, a, driver)),
				})
		class Semaphore {
			permits
			waiters = new Set()
			taken = 0
			constructor(permits) {
				this.permits = permits
			}
			get free() {
				return this.permits - this.taken
			}
			take = n =>
				core_async(resume => {
					if (this.free < n) {
						const observer = () => {
							if (!(this.free < n)) {
								this.waiters.delete(observer)
								this.taken += n
								resume(succeed(n))
							}
						}
						this.waiters.add(observer)
						return sync(() => {
							this.waiters.delete(observer)
						})
					}
					this.taken += n
					return resume(succeed(n))
				})
			updateTaken = f =>
				withFiberRuntime(fiber => {
					this.taken = f(this.taken)
					this.waiters.size > 0 &&
						fiber.getFiberRef(currentScheduler).scheduleTask(() => {
							const iter = this.waiters.values()
							let item = iter.next()
							for (; !1 === item.done && this.free > 0; ) {
								item.value()
								item = iter.next()
							}
						}, fiber.getFiberRef(currentSchedulingPriority))
					return succeed(this.free)
				})
			release = n => this.updateTaken(taken => taken - n)
			releaseAll = this.updateTaken(_ => 0)
			withPermits = n => self =>
				uninterruptibleMask(restore =>
					core_flatMap(restore(this.take(n)), permits =>
						fiberRuntime_ensuring(restore(self), this.release(permits)),
					),
				)
		}
		const SynchronizedTypeId = Symbol.for("effect/Ref/SynchronizedRef"),
			synchronizedVariance = { _A: _ => _ }
		class SynchronizedImpl {
			ref
			withLock;
			[SynchronizedTypeId] = synchronizedVariance;
			[RefTypeId] = refVariance;
			[Readable_TypeId]
			constructor(ref, withLock) {
				this.ref = ref
				this.withLock = withLock
				this[Readable_TypeId] = Readable_TypeId
				this.get = ref_get(this.ref)
			}
			get;
			modify(f) {
				return this.modifyEffect(a => succeed(f(a)))
			}
			modifyEffect(f) {
				return this.withLock(
					Function_pipe(
						core_flatMap(ref_get(this.ref), f),
						core_flatMap(([b, a]) => core_as(ref_set(this.ref, a), b)),
					),
				)
			}
			pipe() {
				return Pipeable_pipeArguments(this, arguments)
			}
		}
		const makeSynchronized = value => sync(() => unsafeMakeSynchronized(value)),
			unsafeMakeSynchronized = value => {
				const ref = ref_unsafeMake(value),
					sem = new Semaphore(1)
				return new SynchronizedImpl(ref, sem.withPermits(1))
			},
			Scope_close = scopeClose,
			Scope_fork = scopeFork,
			runtime_unsafeFork = runtime => (self, options) => {
				const fiberId = FiberId_unsafeMake(),
					fiberRefUpdates = [[currentContext, [[fiberId, runtime.context]]]]
				options?.scheduler &&
					fiberRefUpdates.push([
						currentScheduler,
						[[fiberId, options.scheduler]],
					])
				let fiberRefs = FiberRefs_updateManyAs(runtime.fiberRefs, {
					entries: fiberRefUpdates,
					forkAs: fiberId,
				})
				options?.updateRefs &&
					(fiberRefs = options.updateRefs(fiberRefs, fiberId))
				const fiberRuntime = new FiberRuntime(
					fiberId,
					fiberRefs,
					runtime.runtimeFlags,
				)
				let effect = self
				options?.scope &&
					(effect = core_flatMap(
						Scope_fork(options.scope, executionStrategy_sequential),
						closeableScope =>
							core_zipRight(
								((self, finalizer) =>
									self.addFinalizer(() => core_asVoid(finalizer)))(
									closeableScope,
									fiberIdWith(id =>
										equals(id, fiberRuntime.id())
											? core_void_
											: interruptAsFiber(fiberRuntime, id),
									),
								),
								onExit(self, exit => Scope_close(closeableScope, exit)),
							),
					))
				const supervisor = fiberRuntime._supervisor
				if (supervisor !== supervisor_none) {
					supervisor.onStart(
						runtime.context,
						effect,
						Option_none(),
						fiberRuntime,
					)
					fiberRuntime.addObserver(exit => supervisor.onEnd(exit, fiberRuntime))
				}
				globalScope.add(runtime.runtimeFlags, fiberRuntime)
				!1 === options?.immediate
					? fiberRuntime.resume(effect)
					: fiberRuntime.start(effect)
				return fiberRuntime
			},
			unsafeRunSync = runtime => effect => {
				const result = unsafeRunSyncExit(runtime)(effect)
				if ("Failure" === result._tag)
					throw fiberFailure(result.effect_instruction_i0)
				return result.effect_instruction_i0
			}
		class AsyncFiberExceptionImpl extends Error {
			fiber
			_tag = "AsyncFiberException"
			constructor(fiber) {
				super(
					`Fiber #${fiber.id().id} cannot be resolved synchronously. This is caused by using runSync on an effect that performs async work`,
				)
				this.fiber = fiber
				this.name = this._tag
				this.stack = this.message
			}
		}
		const FiberFailureId = Symbol.for("effect/Runtime/FiberFailure"),
			FiberFailureCauseId = Symbol.for("effect/Runtime/FiberFailure/Cause")
		class FiberFailureImpl extends Error {
			[FiberFailureId];
			[FiberFailureCauseId]
			constructor(cause) {
				super()
				this[FiberFailureId] = FiberFailureId
				this[FiberFailureCauseId] = cause
				const prettyErrors = cause_prettyErrors(cause)
				if (prettyErrors.length > 0) {
					const head = prettyErrors[0]
					this.name = head.name
					this.message = head.message
					this.stack = head.stack
				}
				this.name = `(FiberFailure) ${this.name}`
				;(void 0 !== this.message && 0 !== this.message.length) ||
					(this.message = "An error has occurred")
			}
			toJSON() {
				return {
					_id: "FiberFailure",
					cause: this[FiberFailureCauseId].toJSON(),
				}
			}
			toString() {
				return "(FiberFailure) " + (this.stack ?? this.message)
			}
			[Inspectable_NodeInspectSymbol]() {
				return this.toString()
			}
		}
		const fiberFailure = cause => {
				const limit = Error.stackTraceLimit
				Error.stackTraceLimit = 0
				const error = new FiberFailureImpl(cause)
				Error.stackTraceLimit = limit
				return error
			},
			fastPath = effect => {
				const op = effect
				switch (op._op) {
					case "Failure":
					case "Success":
						return op
					case "Left":
						return exitFail(op.left)
					case "Right":
						return exitSucceed(op.right)
					case "Some":
						return exitSucceed(op.value)
					case "None":
						return exitFail(NoSuchElementException())
				}
			},
			unsafeRunSyncExit = runtime => effect => {
				const op = fastPath(effect)
				if (op) return op
				const scheduler = new SyncScheduler(),
					fiberRuntime = runtime_unsafeFork(runtime)(effect, { scheduler })
				scheduler.flush()
				const result = fiberRuntime.unsafePoll()
				if (result) return result
				throw (fiber => {
					const limit = Error.stackTraceLimit
					Error.stackTraceLimit = 0
					const error = new AsyncFiberExceptionImpl(fiber)
					Error.stackTraceLimit = limit
					return error
				})(fiberRuntime)
			},
			unsafeRunPromise = runtime => (effect, options) =>
				unsafeRunPromiseExit(runtime)(effect, options).then(result => {
					switch (result._tag) {
						case "Success":
							return result.effect_instruction_i0
						case "Failure":
							throw fiberFailure(result.effect_instruction_i0)
					}
				}),
			unsafeRunPromiseExit = runtime => (effect, options) =>
				new Promise(resolve => {
					const op = fastPath(effect)
					op && resolve(op)
					const fiber = runtime_unsafeFork(runtime)(effect)
					fiber.addObserver(exit => {
						resolve(exit)
					})
					void 0 !== options?.signal &&
						(options.signal.aborted
							? fiber.unsafeInterruptAsFork(fiber.id())
							: options.signal.addEventListener(
									"abort",
									() => {
										fiber.unsafeInterruptAsFork(fiber.id())
									},
									{ once: !0 },
								))
				})
		class RuntimeImpl {
			context
			runtimeFlags
			fiberRefs
			constructor(context, runtimeFlags, fiberRefs) {
				this.context = context
				this.runtimeFlags = runtimeFlags
				this.fiberRefs = fiberRefs
			}
			pipe() {
				return Pipeable_pipeArguments(this, arguments)
			}
		}
		const runtime_make = options =>
				new RuntimeImpl(
					options.context,
					options.runtimeFlags,
					options.fiberRefs,
				),
			defaultRuntimeFlags = runtimeFlags_make(1, 32, 4),
			defaultRuntime = runtime_make({
				context: Context_empty(),
				runtimeFlags: defaultRuntimeFlags,
				fiberRefs: FiberRefs_empty(),
			}),
			unsafeRunPromiseEffect = unsafeRunPromise(defaultRuntime),
			unsafeRunSyncEffect = unsafeRunSync(defaultRuntime),
			modifyEffect = Function_dual(2, (self, f) => self.modifyEffect(f)),
			LayerTypeId = Symbol.for("effect/Layer"),
			layer_proto = {
				[LayerTypeId]: { _RIn: _ => _, _E: _ => _, _ROut: _ => _ },
				pipe() {
					return Pipeable_pipeArguments(this, arguments)
				},
			},
			MemoMapTypeId = Symbol.for("effect/Layer/MemoMap"),
			isFresh = self => "Fresh" === self._tag
		class MemoMapImpl {
			ref;
			[MemoMapTypeId]
			constructor(ref) {
				this.ref = ref
				this[MemoMapTypeId] = MemoMapTypeId
			}
			getOrElseMemoize(layer, scope) {
				return Function_pipe(
					modifyEffect(this.ref, map => {
						const inMap = map.get(layer)
						if (void 0 !== inMap) {
							const [acquire, release] = inMap,
								cached = Function_pipe(
									acquire,
									core_flatMap(([patch, b]) =>
										Function_pipe(
											(patch => {
												return (
													(f = (fiberId, fiberRefs) =>
														Function_pipe(
															patch,
															patch_patch(fiberId, fiberRefs),
														)),
													withFiberRuntime(state => {
														state.setFiberRefs(
															f(state.id(), state.getFiberRefs()),
														)
														return core_void_
													})
												)
												var f
											})(patch),
											core_as(b),
										),
									),
									onExit(
										exitMatch({
											onFailure: () => core_void_,
											onSuccess: () => scopeAddFinalizerExit(scope, release),
										}),
									),
								)
							return succeed([cached, map])
						}
						return Function_pipe(
							ref_make(0),
							core_flatMap(observers =>
								Function_pipe(
									core_flatMap(fiberId, id =>
										(fiberId => sync(() => deferredUnsafeMake(fiberId)))(id),
									),
									core_flatMap(deferred =>
										Function_pipe(
											ref_make(() => core_void_),
											core_map(finalizerRef => {
												const resource = uninterruptibleMask(restore =>
														Function_pipe(
															fiberRuntime_scopeMake(),
															core_flatMap(innerScope =>
																Function_pipe(
																	restore(
																		core_flatMap(
																			makeBuilder(layer, innerScope, !0),
																			f =>
																				(self =>
																					summarized(
																						self,
																						core_effect_fiberRefs,
																						patch_diff,
																					))(f(this)),
																		),
																	),
																	core_exit,
																	core_flatMap(exit => {
																		switch (exit._tag) {
																			case "Failure":
																				return Function_pipe(
																					deferredFailCause(
																						deferred,
																						exit.effect_instruction_i0,
																					),
																					core_zipRight(
																						scopeClose(innerScope, exit),
																					),
																					core_zipRight(
																						failCause(
																							exit.effect_instruction_i0,
																						),
																					),
																				)
																			case "Success":
																				return Function_pipe(
																					ref_set(finalizerRef, exit =>
																						Function_pipe(
																							scopeClose(innerScope, exit),
																							whenEffect(
																								ref_modify(observers, n => [
																									1 === n,
																									n - 1,
																								]),
																							),
																							core_asVoid,
																						),
																					),
																					core_zipRight(
																						ref_update(observers, n => n + 1),
																					),
																					core_zipRight(
																						scopeAddFinalizerExit(scope, exit =>
																							Function_pipe(
																								sync(() => map.delete(layer)),
																								core_zipRight(
																									ref_get(finalizerRef),
																								),
																								core_flatMap(finalizer =>
																									finalizer(exit),
																								),
																							),
																						),
																					),
																					core_zipRight(
																						deferredSucceed(
																							deferred,
																							exit.effect_instruction_i0,
																						),
																					),
																					core_as(
																						exit.effect_instruction_i0[1],
																					),
																				)
																		}
																	}),
																),
															),
														),
													),
													memoized = [
														Function_pipe(
															deferredAwait(deferred),
															onExit(
																exitMatchEffect({
																	onFailure: () => core_void_,
																	onSuccess: () =>
																		ref_update(observers, n => n + 1),
																}),
															),
														),
														exit =>
															Function_pipe(
																ref_get(finalizerRef),
																core_flatMap(finalizer => finalizer(exit)),
															),
													]
												return [
													resource,
													isFresh(layer) ? map : map.set(layer, memoized),
												]
											}),
										),
									),
								),
							),
						)
					}),
					core_flatten,
				)
			}
		}
		const makeMemoMap = suspend(() =>
				core_map(makeSynchronized(new Map()), ref => new MemoMapImpl(ref)),
			),
			buildWithScope = Function_dual(2, (self, scope) =>
				core_flatMap(makeMemoMap, memoMap =>
					core_flatMap(makeBuilder(self, scope), run => run(memoMap)),
				),
			),
			makeBuilder = (self, scope, inMemoMap = !1) => {
				const op = self
				switch (op._tag) {
					case "Locally":
						return sync(
							() => memoMap => op.f(memoMap.getOrElseMemoize(op.self, scope)),
						)
					case "ExtendScope":
						return sync(() => memoMap => {
							return (
								(f = scope => memoMap.getOrElseMemoize(op.layer, scope)),
								core_flatMap(scopeTag, f)
							)
							var f
						})
					case "Fold":
						return sync(
							() => memoMap =>
								Function_pipe(
									memoMap.getOrElseMemoize(op.layer, scope),
									matchCauseEffect({
										onFailure: cause =>
											memoMap.getOrElseMemoize(op.failureK(cause), scope),
										onSuccess: value =>
											memoMap.getOrElseMemoize(op.successK(value), scope),
									}),
								),
						)
					case "Fresh":
						return sync(
							() => _ => Function_pipe(op.layer, buildWithScope(scope)),
						)
					case "FromEffect":
						return sync(
							inMemoMap
								? () => _ => op.effect
								: () => memoMap => memoMap.getOrElseMemoize(self, scope),
						)
					case "Provide":
						return sync(
							() => memoMap =>
								Function_pipe(
									memoMap.getOrElseMemoize(op.first, scope),
									core_flatMap(env =>
										Function_pipe(
											memoMap.getOrElseMemoize(op.second, scope),
											provideContext(env),
										),
									),
								),
						)
					case "Scoped":
						return sync(
							inMemoMap
								? () => _ => scopeExtend(op.effect, scope)
								: () => memoMap => memoMap.getOrElseMemoize(self, scope),
						)
					case "Suspend":
						return sync(
							() => memoMap => memoMap.getOrElseMemoize(op.evaluate(), scope),
						)
					case "ProvideMerge":
						return sync(
							() => memoMap =>
								Function_pipe(
									memoMap.getOrElseMemoize(op.first, scope),
									core_zipWith(
										memoMap.getOrElseMemoize(op.second, scope),
										op.zipK,
									),
								),
						)
					case "ZipWith":
						return sync(
							() => memoMap =>
								Function_pipe(
									memoMap.getOrElseMemoize(op.first, scope),
									zipWithOptions(
										memoMap.getOrElseMemoize(op.second, scope),
										op.zipK,
										{ concurrent: !0 },
									),
								),
						)
				}
			},
			layer_fail = error => layer_failCause(Cause_fail(error)),
			layer_failCause = cause =>
				(function (effect) {
					const fromEffect = Object.create(layer_proto)
					fromEffect._tag = "FromEffect"
					fromEffect.effect = effect
					return fromEffect
				})(failCause(cause)),
			layer_flatMap = Function_dual(2, (self, f) =>
				layer_match(self, { onFailure: layer_fail, onSuccess: f }),
			),
			layer_matchCause = Function_dual(2, (self, { onFailure, onSuccess }) => {
				const fold = Object.create(layer_proto)
				fold._tag = "Fold"
				fold.layer = self
				fold.failureK = onFailure
				fold.successK = onSuccess
				return fold
			}),
			layer_match = Function_dual(2, (self, { onFailure, onSuccess }) =>
				layer_matchCause(self, {
					onFailure: cause => {
						const failureOrCause = Cause_failureOrCause(cause)
						switch (failureOrCause._tag) {
							case "Left":
								return onFailure(failureOrCause.left)
							case "Right":
								return layer_failCause(failureOrCause.right)
						}
					},
					onSuccess,
				}),
			),
			scopedDiscard = effect =>
				scopedContext(Function_pipe(effect, core_as(Context_empty()))),
			scopedContext = effect => {
				const scoped = Object.create(layer_proto)
				scoped._tag = "Scoped"
				scoped.effect = effect
				return scoped
			},
			provideSomeLayer = Function_dual(2, (self, layer) =>
				acquireUseRelease(
					fiberRuntime_scopeMake(),
					scope =>
						core_flatMap(buildWithScope(layer, scope), context =>
							provideSomeContext(self, context),
						),
					(scope, exit) => scopeClose(scope, exit),
				),
			),
			provideSomeRuntime = Function_dual(2, (self, rt) => {
				const patchRefs = FiberRefsPatch_diff(
						defaultRuntime.fiberRefs,
						rt.fiberRefs,
					),
					patchFlags = runtimeFlags_diff(
						defaultRuntime.runtimeFlags,
						rt.runtimeFlags,
					)
				return uninterruptibleMask(restore =>
					withFiberRuntime(fiber => {
						const oldContext = fiber.getFiberRef(currentContext),
							oldRefs = fiber.getFiberRefs(),
							newRefs = FiberRefsPatch_patch(fiber.id(), oldRefs)(patchRefs),
							oldFlags = fiber._runtimeFlags,
							newFlags = runtimeFlags_patch(patchFlags)(oldFlags),
							rollbackRefs = FiberRefsPatch_diff(newRefs, oldRefs),
							rollbackFlags = runtimeFlags_diff(newFlags, oldFlags)
						fiber.setFiberRefs(newRefs)
						fiber._runtimeFlags = newFlags
						return fiberRuntime_ensuring(
							provideSomeContext(
								restore(self),
								Context_merge(oldContext, rt.context),
							),
							withFiberRuntime(fiber => {
								fiber.setFiberRefs(
									FiberRefsPatch_patch(
										fiber.id(),
										fiber.getFiberRefs(),
									)(rollbackRefs),
								)
								fiber._runtimeFlags = runtimeFlags_patch(rollbackFlags)(
									fiber._runtimeFlags,
								)
								return core_void_
							}),
						)
					}),
				)
			}),
			effect_provide = Function_dual(2, (self, source) =>
				(u => Predicate_hasProperty(u, LayerTypeId))(source)
					? provideSomeLayer(self, source)
					: Context_isContext(source)
						? provideSomeContext(self, source)
						: provideSomeRuntime(self, source),
			),
			consoleWith = f =>
				fiberRefGetWith(currentServices, services =>
					f(Context_get(services, consoleTag)),
				)
		Symbol.iterator
		Symbol.iterator
		const Effect_isEffect = isEffect,
			Effect_all = fiberRuntime_all,
			Effect_allSuccesses = (elements, options) =>
				core_map(
					fiberRuntime_all(
						Array_fromIterable(elements).map(core_exit),
						options,
					),
					Array_filterMap(exit =>
						(self => "Success" === self._tag)(exit)
							? Option_some(exit.effect_instruction_i0)
							: Option_none(),
					),
				),
			Effect_forEach = fiberRuntime_forEach,
			Effect_fail = core_fail,
			Effect_gen = function () {
				let f
				f =
					1 === arguments.length
						? arguments[0]
						: arguments[1].bind(arguments[0])
				return suspend(() => {
					const iterator = f(Function_pipe),
						state = internalCall(() => iterator.next()),
						run = state =>
							state.done
								? succeed(state.value)
								: core_flatMap(
										(function (self) {
											if (
												"object" == typeof self &&
												null !== self &&
												YieldWrapTypeId in self
											)
												return self[YieldWrapTypeId]()
											throw new Error(getBugErrorMessage("yieldWrapGet"))
										})(state.value),
										val => run(internalCall(() => iterator.next(val))),
									)
					return run(state)
				})
			},
			Effect_promise = evaluate =>
				evaluate.length >= 1
					? core_async((resolve, signal) => {
							evaluate(signal).then(
								a => resolve(exitSucceed(a)),
								e => resolve(exitDie(e)),
							)
						})
					: core_async(resolve => {
							evaluate().then(
								a => resolve(exitSucceed(a)),
								e => resolve(exitDie(e)),
							)
						}),
			Effect_succeed = succeed,
			Effect_suspend = suspend,
			Effect_sync = sync,
			_void = core_void_,
			Effect_catchAll = catchAll,
			Effect_ignore = self =>
				core_effect_match(self, {
					onFailure: Function_constVoid,
					onSuccess: Function_constVoid,
				}),
			Effect_map = core_map,
			Effect_mapError = mapError,
			Effect_forkDaemon = fiberRuntime_forkDaemon,
			Effect_withConcurrency = withConcurrency,
			Effect_provide = effect_provide,
			Effect_either = core_either,
			Effect_option = self =>
				matchEffect(self, {
					onFailure: () => succeed(Option_none()),
					onSuccess: a => succeed(Option_some(a)),
				}),
			Effect_filterOrElse = filterOrElse,
			Effect_filterOrFail = core_effect_filterOrFail,
			Effect_when = core_effect_when,
			Effect_flatMap = core_flatMap,
			Effect_tap = core_tap,
			Effect_tapErrorCause = core_effect_tapErrorCause,
			schedule = schedule_Effect,
			Effect_locally = fiberRefLocally,
			Effect_isSuccess = self =>
				core_effect_match(self, {
					onFailure: constFalse,
					onSuccess: Function_constTrue,
				}),
			Effect_matchEffect = matchEffect,
			Effect_log = log,
			Effect_logDebug = logDebug,
			Effect_logInfo = logInfo,
			Effect_logWarning = logWarning,
			Effect_logError = logError,
			Effect_annotateLogs = annotateLogs,
			Effect_orElse = core_orElse,
			Effect_orElseSucceed = core_effect_orElseSucceed,
			Effect_runPromise = unsafeRunPromiseEffect,
			Effect_runSync = unsafeRunSyncEffect,
			Effect_zipLeft = zipLeftOptions,
			Effect_zipRight = zipRightOptions,
			Effect_fromNullable = value =>
				null == value
					? core_fail(new NoSuchElementException())
					: succeed(value),
			external_rxjs_namespaceObject = rxjs,
			lib = observer => value => {
				observer.next(value)
			}
		var EMPTY_OBJ = {},
			EMPTY_ARR = [],
			hyperapp_id = a => a,
			hyperapp_map = EMPTY_ARR.map,
			hyperapp_isArray = Array.isArray,
			enqueue =
				"undefined" != typeof requestAnimationFrame
					? requestAnimationFrame
					: setTimeout,
			createClass = obj => {
				var out = ""
				if ("string" == typeof obj) return obj
				if (hyperapp_isArray(obj))
					for (var tmp, k = 0; k < obj.length; k++)
						(tmp = createClass(obj[k])) && (out += (out && " ") + tmp)
				else for (var k in obj) obj[k] && (out += (out && " ") + k)
				return out
			},
			shouldRestart = (a, b) => {
				for (var k in { ...a, ...b })
					if ("function" == typeof (hyperapp_isArray(a[k]) ? a[k][0] : a[k]))
						b[k] = a[k]
					else if (a[k] !== b[k]) return !0
			},
			getKey = vdom => (null == vdom ? vdom : vdom.key),
			patchProperty = (node, key, oldValue, newValue, listener, isSvg) => {
				if ("style" === key)
					for (var k in { ...oldValue, ...newValue }) {
						oldValue =
							null == newValue || null == newValue[k] ? "" : newValue[k]
						"-" === k[0]
							? node[key].setProperty(k, oldValue)
							: (node[key][k] = oldValue)
					}
				else
					"o" === key[0] && "n" === key[1]
						? ((node.events || (node.events = {}))[(key = key.slice(2))] =
								newValue)
							? oldValue || node.addEventListener(key, listener)
							: node.removeEventListener(key, listener)
						: !isSvg && "list" !== key && "form" !== key && key in node
							? (node[key] = newValue ?? "")
							: null == newValue || !1 === newValue
								? node.removeAttribute(key)
								: node.setAttribute(key, newValue)
			},
			createNode = (vdom, listener, isSvg) => {
				var props = vdom.props,
					node =
						3 === vdom.type
							? document.createTextNode(vdom.tag)
							: (isSvg = isSvg || "svg" === vdom.tag)
								? document.createElementNS(
										"http://www.w3.org/2000/svg",
										vdom.tag,
										props.is && props,
									)
								: document.createElement(vdom.tag, props.is && props)
				for (var k in props)
					patchProperty(node, k, null, props[k], listener, isSvg)
				for (var i = 0; i < vdom.children.length; i++)
					node.appendChild(
						createNode(
							(vdom.children[i] = maybeVNode(vdom.children[i])),
							listener,
							isSvg,
						),
					)
				return (vdom.node = node)
			},
			hyperapp_patch = (parent, node, oldVNode, newVNode, listener, isSvg) => {
				if (oldVNode === newVNode);
				else if (null != oldVNode && 3 === oldVNode.type && 3 === newVNode.type)
					oldVNode.tag !== newVNode.tag && (node.nodeValue = newVNode.tag)
				else if (null == oldVNode || oldVNode.tag !== newVNode.tag) {
					node = parent.insertBefore(
						createNode((newVNode = maybeVNode(newVNode)), listener, isSvg),
						node,
					)
					null != oldVNode && parent.removeChild(oldVNode.node)
				} else {
					var tmpVKid,
						oldVKid,
						oldKey,
						newKey,
						oldProps = oldVNode.props,
						newProps = newVNode.props,
						oldVKids = oldVNode.children,
						newVKids = newVNode.children,
						oldHead = 0,
						newHead = 0,
						oldTail = oldVKids.length - 1,
						newTail = newVKids.length - 1
					isSvg = isSvg || "svg" === newVNode.tag
					for (var i in { ...oldProps, ...newProps })
						("value" === i || "selected" === i || "checked" === i
							? node[i]
							: oldProps[i]) !== newProps[i] &&
							patchProperty(node, i, oldProps[i], newProps[i], listener, isSvg)
					for (
						;
						newHead <= newTail &&
						oldHead <= oldTail &&
						null != (oldKey = getKey(oldVKids[oldHead])) &&
						oldKey === getKey(newVKids[newHead]);

					)
						hyperapp_patch(
							node,
							oldVKids[oldHead].node,
							oldVKids[oldHead],
							(newVKids[newHead] = maybeVNode(
								newVKids[newHead++],
								oldVKids[oldHead++],
							)),
							listener,
							isSvg,
						)
					for (
						;
						newHead <= newTail &&
						oldHead <= oldTail &&
						null != (oldKey = getKey(oldVKids[oldTail])) &&
						oldKey === getKey(newVKids[newTail]);

					)
						hyperapp_patch(
							node,
							oldVKids[oldTail].node,
							oldVKids[oldTail],
							(newVKids[newTail] = maybeVNode(
								newVKids[newTail--],
								oldVKids[oldTail--],
							)),
							listener,
							isSvg,
						)
					if (oldHead > oldTail)
						for (; newHead <= newTail; )
							node.insertBefore(
								createNode(
									(newVKids[newHead] = maybeVNode(newVKids[newHead++])),
									listener,
									isSvg,
								),
								(oldVKid = oldVKids[oldHead]) && oldVKid.node,
							)
					else if (newHead > newTail)
						for (; oldHead <= oldTail; )
							node.removeChild(oldVKids[oldHead++].node)
					else {
						var keyed = {},
							newKeyed = {}
						for (i = oldHead; i <= oldTail; i++)
							null != (oldKey = oldVKids[i].key) &&
								(keyed[oldKey] = oldVKids[i])
						for (; newHead <= newTail; ) {
							oldKey = getKey((oldVKid = oldVKids[oldHead]))
							newKey = getKey(
								(newVKids[newHead] = maybeVNode(newVKids[newHead], oldVKid)),
							)
							if (
								newKeyed[oldKey] ||
								(null != newKey && newKey === getKey(oldVKids[oldHead + 1]))
							) {
								null == oldKey && node.removeChild(oldVKid.node)
								oldHead++
							} else if (null == newKey || 1 === oldVNode.type) {
								if (null == oldKey) {
									hyperapp_patch(
										node,
										oldVKid && oldVKid.node,
										oldVKid,
										newVKids[newHead],
										listener,
										isSvg,
									)
									newHead++
								}
								oldHead++
							} else {
								if (oldKey === newKey) {
									hyperapp_patch(
										node,
										oldVKid.node,
										oldVKid,
										newVKids[newHead],
										listener,
										isSvg,
									)
									newKeyed[newKey] = !0
									oldHead++
								} else if (null != (tmpVKid = keyed[newKey])) {
									hyperapp_patch(
										node,
										node.insertBefore(tmpVKid.node, oldVKid && oldVKid.node),
										tmpVKid,
										newVKids[newHead],
										listener,
										isSvg,
									)
									newKeyed[newKey] = !0
								} else
									hyperapp_patch(
										node,
										oldVKid && oldVKid.node,
										null,
										newVKids[newHead],
										listener,
										isSvg,
									)
								newHead++
							}
						}
						for (; oldHead <= oldTail; )
							null == getKey((oldVKid = oldVKids[oldHead++])) &&
								node.removeChild(oldVKid.node)
						for (var i in keyed)
							null == newKeyed[i] && node.removeChild(keyed[i].node)
					}
				}
				return (newVNode.node = node)
			},
			maybeVNode = (newVNode, oldVNode) =>
				!0 !== newVNode && !1 !== newVNode && newVNode
					? "function" == typeof newVNode.tag
						? ((!oldVNode ||
								null == oldVNode.memo ||
								((a, b) => {
									for (var k in a) if (a[k] !== b[k]) return !0
									for (var k in b) if (a[k] !== b[k]) return !0
								})(oldVNode.memo, newVNode.memo)) &&
								((oldVNode = newVNode.tag(newVNode.memo)).memo = newVNode.memo),
							oldVNode)
						: newVNode
					: hyperapp_text(""),
			recycleNode = node =>
				3 === node.nodeType
					? hyperapp_text(node.nodeValue, node)
					: createVNode(
							node.nodeName.toLowerCase(),
							EMPTY_OBJ,
							hyperapp_map.call(node.childNodes, recycleNode),
							1,
							node,
						),
			createVNode = (tag, { key, ...props }, children, type, node) => ({
				tag,
				props,
				key,
				children,
				type,
				node,
			}),
			hyperapp_text = (value, node) =>
				createVNode(value, EMPTY_OBJ, EMPTY_ARR, 3, node),
			h = (tag, { class: c, ...props }, children = EMPTY_ARR) =>
				createVNode(
					tag,
					{ ...props, ...(c ? { class: createClass(c) } : EMPTY_OBJ) },
					hyperapp_isArray(children) ? children : [children],
				),
			app = ({
				node,
				view,
				subscriptions,
				dispatch = hyperapp_id,
				init = EMPTY_OBJ,
			}) => {
				var state,
					busy,
					vdom = node && recycleNode(node),
					subs = [],
					update = newState => {
						if (state !== newState) {
							null == (state = newState) &&
								(dispatch = subscriptions = render = hyperapp_id)
							subscriptions &&
								(subs = ((oldSubs, newSubs = EMPTY_ARR, dispatch) => {
									for (
										var oldSub, newSub, subs = [], i = 0;
										i < oldSubs.length || i < newSubs.length;
										i++
									) {
										oldSub = oldSubs[i]
										newSub = newSubs[i]
										subs.push(
											newSub && !0 !== newSub
												? !oldSub ||
													newSub[0] !== oldSub[0] ||
													shouldRestart(newSub[1], oldSub[1])
													? [
															newSub[0],
															newSub[1],
															(oldSub && oldSub[2](),
															newSub[0](dispatch, newSub[1])),
														]
													: oldSub
												: oldSub && oldSub[2](),
										)
									}
									return subs
								})(subs, subscriptions(state), dispatch))
							view && !busy && enqueue(render, (busy = !0))
						}
					},
					render = () =>
						(node = hyperapp_patch(
							node.parentNode,
							node,
							vdom,
							(vdom = view(state)),
							listener,
							(busy = !1),
						)),
					listener = function (event) {
						dispatch(this.events[event.type], event)
					}
				return (
					(dispatch = dispatch((action, props) =>
						"function" == typeof action
							? dispatch(action(state, props))
							: hyperapp_isArray(action)
								? "function" == typeof action[0]
									? dispatch(action[0], action[1])
									: action
											.slice(1)
											.map(
												fx => fx && !0 !== fx && (fx[0] || fx)(dispatch, fx[1]),
												update(action[0]),
											)
								: update(action),
					))(init),
					dispatch
				)
			}
		const wrapApp = (comp, init) =>
			Function_pipe(
				Effect_sync(() => document.createElement(comp.tag)),
				Effect_flatMap(node =>
					Effect_sync(() => ({
						node,
						dispatch: app({ init, view: comp.view, node }),
					})),
				),
			)
		Promise.resolve(!1), Promise.resolve(!0)
		var PROMISE_RESOLVED_VOID = Promise.resolve()
		function util_sleep(time, resolveWith) {
			time || (time = 0)
			return new Promise(function (res) {
				return setTimeout(function () {
					return res(resolveWith)
				}, time)
			})
		}
		function randomToken() {
			return Math.random().toString(36).substring(2)
		}
		var lastMs = 0
		function microSeconds() {
			var ret = 1e3 * Date.now()
			ret <= lastMs && (ret = lastMs + 1)
			lastMs = ret
			return ret
		}
		var NativeMethod = {
			create: function (channelName) {
				var state = {
					time: microSeconds(),
					messagesCallback: null,
					bc: new BroadcastChannel(channelName),
					subFns: [],
				}
				state.bc.onmessage = function (msgEvent) {
					state.messagesCallback && state.messagesCallback(msgEvent.data)
				}
				return state
			},
			close: function (channelState) {
				channelState.bc.close()
				channelState.subFns = []
			},
			onMessage: function (channelState, fn) {
				channelState.messagesCallback = fn
			},
			postMessage: function (channelState, messageJson) {
				try {
					channelState.bc.postMessage(messageJson, !1)
					return PROMISE_RESOLVED_VOID
				} catch (err) {
					return Promise.reject(err)
				}
			},
			canBeUsed: function () {
				if (
					"undefined" != typeof globalThis &&
					globalThis.Deno &&
					globalThis.Deno.args
				)
					return !0
				if (
					("undefined" == typeof window && "undefined" == typeof self) ||
					"function" != typeof BroadcastChannel
				)
					return !1
				if (BroadcastChannel._pubkey)
					throw new Error(
						"BroadcastChannel: Do not overwrite window.BroadcastChannel with this module, this is not a polyfill",
					)
				return !0
			},
			type: "native",
			averageResponseTime: function () {
				return 150
			},
			microSeconds,
		}
		class ObliviousSet {
			ttl
			map = new Map()
			_to = !1
			constructor(ttl) {
				this.ttl = ttl
			}
			has(value) {
				return this.map.has(value)
			}
			add(value) {
				this.map.set(value, now())
				if (!this._to) {
					this._to = !0
					setTimeout(() => {
						this._to = !1
						!(function (obliviousSet) {
							const olderThen = now() - obliviousSet.ttl,
								iterator = obliviousSet.map[Symbol.iterator]()
							for (;;) {
								const next = iterator.next().value
								if (!next) return
								const value = next[0]
								if (!(next[1] < olderThen)) return
								obliviousSet.map.delete(value)
							}
						})(this)
					}, 0)
				}
			}
			clear() {
				this.map.clear()
			}
		}
		function now() {
			return Date.now()
		}
		function options_fillOptionsWithDefaults() {
			var originalOptions =
					arguments.length > 0 && void 0 !== arguments[0] ? arguments[0] : {},
				options = JSON.parse(JSON.stringify(originalOptions))
			void 0 === options.webWorkerSupport && (options.webWorkerSupport = !0)
			options.idb || (options.idb = {})
			options.idb.ttl || (options.idb.ttl = 45e3)
			options.idb.fallbackInterval || (options.idb.fallbackInterval = 150)
			originalOptions.idb &&
				"function" == typeof originalOptions.idb.onclose &&
				(options.idb.onclose = originalOptions.idb.onclose)
			options.localstorage || (options.localstorage = {})
			options.localstorage.removeTimeout ||
				(options.localstorage.removeTimeout = 6e4)
			originalOptions.methods && (options.methods = originalOptions.methods)
			options.node || (options.node = {})
			options.node.ttl || (options.node.ttl = 12e4)
			options.node.maxParallelWrites || (options.node.maxParallelWrites = 2048)
			void 0 === options.node.useFastPath && (options.node.useFastPath = !0)
			return options
		}
		var OBJECT_STORE_ID = "messages",
			TRANSACTION_SETTINGS = { durability: "relaxed" }
		function getIdb() {
			if ("undefined" != typeof indexedDB) return indexedDB
			if ("undefined" != typeof window) {
				if (void 0 !== window.mozIndexedDB) return window.mozIndexedDB
				if (void 0 !== window.webkitIndexedDB) return window.webkitIndexedDB
				if (void 0 !== window.msIndexedDB) return window.msIndexedDB
			}
			return !1
		}
		function commitIndexedDBTransaction(tx) {
			tx.commit && tx.commit()
		}
		function _readLoop(state) {
			state.closed ||
				readNewMessages(state)
					.then(function () {
						return util_sleep(state.options.idb.fallbackInterval)
					})
					.then(function () {
						return _readLoop(state)
					})
		}
		function readNewMessages(state) {
			return state.closed
				? PROMISE_RESOLVED_VOID
				: state.messagesCallback
					? (function (db, lastCursorId) {
							var tx = db.transaction(
									OBJECT_STORE_ID,
									"readonly",
									TRANSACTION_SETTINGS,
								),
								objectStore = tx.objectStore(OBJECT_STORE_ID),
								ret = [],
								keyRangeValue = IDBKeyRange.bound(lastCursorId + 1, 1 / 0)
							if (objectStore.getAll) {
								var getAllRequest = objectStore.getAll(keyRangeValue)
								return new Promise(function (res, rej) {
									getAllRequest.onerror = function (err) {
										return rej(err)
									}
									getAllRequest.onsuccess = function (e) {
										res(e.target.result)
									}
								})
							}
							return new Promise(function (res, rej) {
								var openCursorRequest = (function () {
									try {
										keyRangeValue = IDBKeyRange.bound(lastCursorId + 1, 1 / 0)
										return objectStore.openCursor(keyRangeValue)
									} catch (e) {
										return objectStore.openCursor()
									}
								})()
								openCursorRequest.onerror = function (err) {
									return rej(err)
								}
								openCursorRequest.onsuccess = function (ev) {
									var cursor = ev.target.result
									if (cursor)
										if (cursor.value.id < lastCursorId + 1)
											cursor.continue(lastCursorId + 1)
										else {
											ret.push(cursor.value)
											cursor.continue()
										}
									else {
										commitIndexedDBTransaction(tx)
										res(ret)
									}
								}
							})
						})(state.db, state.lastCursorId).then(function (newerMessages) {
							var useMessages = newerMessages
								.filter(function (msgObj) {
									return !!msgObj
								})
								.map(function (msgObj) {
									msgObj.id > state.lastCursorId &&
										(state.lastCursorId = msgObj.id)
									return msgObj
								})
								.filter(function (msgObj) {
									return (function (msgObj, state) {
										return !(
											msgObj.uuid === state.uuid ||
											state.eMIs.has(msgObj.id) ||
											msgObj.data.time < state.messagesCallbackTime
										)
									})(msgObj, state)
								})
								.sort(function (msgObjA, msgObjB) {
									return msgObjA.time - msgObjB.time
								})
							useMessages.forEach(function (msgObj) {
								if (state.messagesCallback) {
									state.eMIs.add(msgObj.id)
									state.messagesCallback(msgObj.data)
								}
							})
							return PROMISE_RESOLVED_VOID
						})
					: PROMISE_RESOLVED_VOID
		}
		var IndexedDBMethod = {
			create: function (channelName, options) {
				options = options_fillOptionsWithDefaults(options)
				return (function (channelName) {
					var dbName = "pubkey.broadcast-channel-0-" + channelName,
						openRequest = getIdb().open(dbName)
					openRequest.onupgradeneeded = function (ev) {
						ev.target.result.createObjectStore(OBJECT_STORE_ID, {
							keyPath: "id",
							autoIncrement: !0,
						})
					}
					return new Promise(function (res, rej) {
						openRequest.onerror = function (ev) {
							return rej(ev)
						}
						openRequest.onsuccess = function () {
							res(openRequest.result)
						}
					})
				})(channelName).then(function (db) {
					var state = {
						closed: !1,
						lastCursorId: 0,
						channelName,
						options,
						uuid: randomToken(),
						eMIs: new ObliviousSet(2 * options.idb.ttl),
						writeBlockPromise: PROMISE_RESOLVED_VOID,
						messagesCallback: null,
						readQueuePromises: [],
						db,
					}
					db.onclose = function () {
						state.closed = !0
						options.idb.onclose && options.idb.onclose()
					}
					_readLoop(state)
					return state
				})
			},
			close: function (channelState) {
				channelState.closed = !0
				channelState.db.close()
			},
			onMessage: function (channelState, fn, time) {
				channelState.messagesCallbackTime = time
				channelState.messagesCallback = fn
				readNewMessages(channelState)
			},
			postMessage: function (channelState, messageJson) {
				channelState.writeBlockPromise = channelState.writeBlockPromise
					.then(function () {
						return (function (db, readerUuid, messageJson) {
							var writeObject = {
									uuid: readerUuid,
									time: Date.now(),
									data: messageJson,
								},
								tx = db.transaction(
									[OBJECT_STORE_ID],
									"readwrite",
									TRANSACTION_SETTINGS,
								)
							return new Promise(function (res, rej) {
								tx.oncomplete = function () {
									return res()
								}
								tx.onerror = function (ev) {
									return rej(ev)
								}
								tx.objectStore(OBJECT_STORE_ID).add(writeObject)
								commitIndexedDBTransaction(tx)
							})
						})(channelState.db, channelState.uuid, messageJson)
					})
					.then(function () {
						0 === Math.floor(11 * Math.random() + 0) &&
							(function (channelState) {
								return ((db = channelState.db),
								(ttl = channelState.options.idb.ttl),
								(olderThen = Date.now() - ttl),
								(tx = db.transaction(
									OBJECT_STORE_ID,
									"readonly",
									TRANSACTION_SETTINGS,
								)),
								(objectStore = tx.objectStore(OBJECT_STORE_ID)),
								(ret = []),
								new Promise(function (res) {
									objectStore.openCursor().onsuccess = function (ev) {
										var cursor = ev.target.result
										if (cursor) {
											var msgObk = cursor.value
											if (msgObk.time < olderThen) {
												ret.push(msgObk)
												cursor.continue()
											} else {
												commitIndexedDBTransaction(tx)
												res(ret)
											}
										} else res(ret)
									}
								})).then(function (tooOld) {
									return (function (channelState, ids) {
										if (channelState.closed) return Promise.resolve([])
										var objectStore = channelState.db
											.transaction(
												OBJECT_STORE_ID,
												"readwrite",
												TRANSACTION_SETTINGS,
											)
											.objectStore(OBJECT_STORE_ID)
										return Promise.all(
											ids.map(function (id) {
												var deleteRequest = objectStore.delete(id)
												return new Promise(function (res) {
													deleteRequest.onsuccess = function () {
														return res()
													}
												})
											}),
										)
									})(
										channelState,
										tooOld.map(function (msg) {
											return msg.id
										}),
									)
								})
								var db, ttl, olderThen, tx, objectStore, ret
							})(channelState)
					})
				return channelState.writeBlockPromise
			},
			canBeUsed: function () {
				return !!getIdb()
			},
			type: "idb",
			averageResponseTime: function (options) {
				return 2 * options.idb.fallbackInterval
			},
			microSeconds,
		}
		function getLocalStorage() {
			var localStorage
			if ("undefined" == typeof window) return null
			try {
				localStorage = window.localStorage
				localStorage =
					window["ie8-eventlistener/storage"] || window.localStorage
			} catch (e) {}
			return localStorage
		}
		function storageKey(channelName) {
			return "pubkey.broadcastChannel-" + channelName
		}
		function localstorage_canBeUsed() {
			var ls = getLocalStorage()
			if (!ls) return !1
			try {
				var key = "__broadcastchannel_check"
				ls.setItem(key, "works")
				ls.removeItem(key)
			} catch (e) {
				return !1
			}
			return !0
		}
		var LocalstorageMethod = {
				create: function (channelName, options) {
					options = options_fillOptionsWithDefaults(options)
					if (!localstorage_canBeUsed())
						throw new Error("BroadcastChannel: localstorage cannot be used")
					var uuid = randomToken(),
						eMIs = new ObliviousSet(options.localstorage.removeTimeout),
						state = { channelName, uuid, eMIs }
					state.listener = (function (channelName, fn) {
						var key = storageKey(channelName),
							listener = function (ev) {
								ev.key === key &&
									(function (msgObj) {
										if (
											state.messagesCallback &&
											msgObj.uuid !== uuid &&
											msgObj.token &&
											!eMIs.has(msgObj.token) &&
											!(
												msgObj.data.time &&
												msgObj.data.time < state.messagesCallbackTime
											)
										) {
											eMIs.add(msgObj.token)
											state.messagesCallback(msgObj.data)
										}
									})(JSON.parse(ev.newValue))
							}
						window.addEventListener("storage", listener)
						return listener
					})(channelName)
					return state
				},
				close: function (channelState) {
					;(listener = channelState.listener),
						window.removeEventListener("storage", listener)
					var listener
				},
				onMessage: function (channelState, fn, time) {
					channelState.messagesCallbackTime = time
					channelState.messagesCallback = fn
				},
				postMessage: function (channelState, messageJson) {
					return new Promise(function (res) {
						util_sleep().then(function () {
							var key = storageKey(channelState.channelName),
								writeObj = {
									token: randomToken(),
									time: Date.now(),
									data: messageJson,
									uuid: channelState.uuid,
								},
								value = JSON.stringify(writeObj)
							getLocalStorage().setItem(key, value)
							var ev = document.createEvent("Event")
							ev.initEvent("storage", !0, !0)
							ev.key = key
							ev.newValue = value
							window.dispatchEvent(ev)
							res()
						})
					})
				},
				canBeUsed: localstorage_canBeUsed,
				type: "localstorage",
				averageResponseTime: function () {
					var userAgent = navigator.userAgent.toLowerCase()
					return userAgent.includes("safari") && !userAgent.includes("chrome")
						? 240
						: 120
				},
				microSeconds,
			},
			simulate_microSeconds = microSeconds,
			SIMULATE_CHANNELS = new Set(),
			SimulateMethod = {
				create: function (channelName) {
					var state = {
						time: simulate_microSeconds(),
						name: channelName,
						messagesCallback: null,
					}
					SIMULATE_CHANNELS.add(state)
					return state
				},
				close: function (channelState) {
					SIMULATE_CHANNELS.delete(channelState)
				},
				onMessage: function (channelState, fn) {
					channelState.messagesCallback = fn
				},
				postMessage: function (channelState, messageJson) {
					return new Promise(function (res) {
						return setTimeout(function () {
							Array.from(SIMULATE_CHANNELS).forEach(function (channel) {
								channel.name === channelState.name &&
									channel !== channelState &&
									channel.messagesCallback &&
									channel.time < messageJson.time &&
									channel.messagesCallback(messageJson)
							})
							res()
						}, 5)
					})
				},
				canBeUsed: function () {
					return !0
				},
				type: "simulate",
				averageResponseTime: function () {
					return 5
				},
				microSeconds: simulate_microSeconds,
			},
			METHODS = [NativeMethod, IndexedDBMethod, LocalstorageMethod],
			OPEN_BROADCAST_CHANNELS = new Set(),
			lastId = 0,
			broadcast_channel_BroadcastChannel = function (name, options) {
				this.id = lastId++
				OPEN_BROADCAST_CHANNELS.add(this)
				this.name = name
				this.options = options_fillOptionsWithDefaults(options)
				this.method = (function (options) {
					var chooseMethods = []
						.concat(options.methods, METHODS)
						.filter(Boolean)
					if (options.type) {
						if ("simulate" === options.type) return SimulateMethod
						var ret = chooseMethods.find(function (m) {
							return m.type === options.type
						})
						if (ret) return ret
						throw new Error("method-type " + options.type + " not found")
					}
					options.webWorkerSupport ||
						(chooseMethods = chooseMethods.filter(function (m) {
							return "idb" !== m.type
						}))
					var useMethod = chooseMethods.find(function (method) {
						return method.canBeUsed()
					})
					if (useMethod) return useMethod
					throw new Error(
						"No usable method found in " +
							JSON.stringify(
								METHODS.map(function (m) {
									return m.type
								}),
							),
					)
				})(this.options)
				this._iL = !1
				this._onML = null
				this._addEL = { message: [], internal: [] }
				this._uMP = new Set()
				this._befC = []
				this._prepP = null
				!(function (channel) {
					var obj,
						maybePromise = channel.method.create(channel.name, channel.options)
					if ((obj = maybePromise) && "function" == typeof obj.then) {
						channel._prepP = maybePromise
						maybePromise.then(function (s) {
							channel._state = s
						})
					} else channel._state = maybePromise
				})(this)
			}
		broadcast_channel_BroadcastChannel._pubkey = !0
		broadcast_channel_BroadcastChannel.prototype = {
			postMessage: function (msg) {
				if (this.closed)
					throw new Error(
						"BroadcastChannel.postMessage(): Cannot post message after channel has closed " +
							JSON.stringify(msg),
					)
				return _post(this, "message", msg)
			},
			postInternal: function (msg) {
				return _post(this, "internal", msg)
			},
			set onmessage(fn) {
				var listenObj = { time: this.method.microSeconds(), fn }
				_removeListenerObject(this, "message", this._onML)
				if (fn && "function" == typeof fn) {
					this._onML = listenObj
					_addListenerObject(this, "message", listenObj)
				} else this._onML = null
			},
			addEventListener: function (type, fn) {
				_addListenerObject(this, type, { time: this.method.microSeconds(), fn })
			},
			removeEventListener: function (type, fn) {
				_removeListenerObject(
					this,
					type,
					this._addEL[type].find(function (obj) {
						return obj.fn === fn
					}),
				)
			},
			close: function () {
				var _this = this
				if (!this.closed) {
					OPEN_BROADCAST_CHANNELS.delete(this)
					this.closed = !0
					var awaitPrepare = this._prepP ? this._prepP : PROMISE_RESOLVED_VOID
					this._onML = null
					this._addEL.message = []
					return awaitPrepare
						.then(function () {
							return Promise.all(Array.from(_this._uMP))
						})
						.then(function () {
							return Promise.all(
								_this._befC.map(function (fn) {
									return fn()
								}),
							)
						})
						.then(function () {
							return _this.method.close(_this._state)
						})
				}
			},
			get type() {
				return this.method.type
			},
			get isClosed() {
				return this.closed
			},
		}
		function _post(broadcastChannel, type, msg) {
			var msgObj = {
				time: broadcastChannel.method.microSeconds(),
				type,
				data: msg,
			}
			return (
				broadcastChannel._prepP
					? broadcastChannel._prepP
					: PROMISE_RESOLVED_VOID
			).then(function () {
				var sendPromise = broadcastChannel.method.postMessage(
					broadcastChannel._state,
					msgObj,
				)
				broadcastChannel._uMP.add(sendPromise)
				sendPromise.catch().then(function () {
					return broadcastChannel._uMP.delete(sendPromise)
				})
				return sendPromise
			})
		}
		function _hasMessageListeners(channel) {
			return (
				channel._addEL.message.length > 0 || channel._addEL.internal.length > 0
			)
		}
		function _addListenerObject(channel, type, obj) {
			channel._addEL[type].push(obj)
			!(function (channel) {
				if (!channel._iL && _hasMessageListeners(channel)) {
					var listenerFn = function (msgObj) {
							channel._addEL[msgObj.type].forEach(function (listenerObject) {
								msgObj.time >= listenerObject.time &&
									listenerObject.fn(msgObj.data)
							})
						},
						time = channel.method.microSeconds()
					if (channel._prepP)
						channel._prepP.then(function () {
							channel._iL = !0
							channel.method.onMessage(channel._state, listenerFn, time)
						})
					else {
						channel._iL = !0
						channel.method.onMessage(channel._state, listenerFn, time)
					}
				}
			})(channel)
		}
		function _removeListenerObject(channel, type, obj) {
			channel._addEL[type] = channel._addEL[type].filter(function (o) {
				return o !== obj
			})
			!(function (channel) {
				if (channel._iL && !_hasMessageListeners(channel)) {
					channel._iL = !1
					var time = channel.method.microSeconds()
					channel.method.onMessage(channel._state, null, time)
				}
			})(channel)
		}
		const SynchronizedRef_make = makeSynchronized,
			SynchronizedRef_get = ref_get,
			SynchronizedRef_set = ref_set,
			SynchronizedRef_update = ref_update,
			Schedule_fixed = intervalInput => {
				const interval = decode(intervalInput),
					intervalMillis = toMillis(interval)
				return (
					(initial = [Option_none(), 0]),
					new ScheduleImpl(initial, (now, _, [option, n]) =>
						sync(() => {
							switch (option._tag) {
								case "None":
									return [
										[Option_some([now, now + intervalMillis]), n + 1],
										n,
										ScheduleDecision_continueWith(
											ScheduleInterval_after(now + intervalMillis),
										),
									]
								case "Some": {
									const [startMillis, lastRun] = option.value,
										runningBehind = now > lastRun + intervalMillis,
										boundary = equals(interval, zero)
											? interval
											: Duration_millis(
													intervalMillis -
														((now - startMillis) % intervalMillis),
												),
										sleepTime = equals(boundary, zero) ? interval : boundary,
										nextRun = runningBehind ? now : now + toMillis(sleepTime)
									return [
										[Option_some([startMillis, nextRun]), n + 1],
										n,
										ScheduleDecision_continueWith(
											ScheduleInterval_after(nextRun),
										),
									]
								}
							}
						}),
					)
				)
				var initial
			}
		var fast_deep_equal = __webpack_require__(371),
			fast_deep_equal_default = __webpack_require__.n(fast_deep_equal)
		const makeSubject = configKeys =>
				Function_pipe(
					configKeys,
					Array_map(x => [x, new external_rxjs_namespaceObject.Subject()]),
					Object.fromEntries,
				),
			mapObject = f => o =>
				Function_pipe(Object.entries(o), Array_map(f), Object.fromEntries),
			makeGetter = c =>
				Function_pipe(
					c,
					mapObject(([x]) => [x, Effect_sync(() => c[x])]),
				),
			external_DeepDiff_namespaceObject = DeepDiff,
			makePageState = mapObject(([k, v]) => [
				k,
				{ ele: Option_none(), read: v },
			]),
			external_astring_namespaceObject = astring,
			external_jsep_namespaceObject = jsep
		var external_jsep_default = __webpack_require__.n(
				external_jsep_namespaceObject,
			),
			u = {
				"||": function (r, e) {
					return r || e
				},
				"&&": function (r, e) {
					return r && e
				},
				"|": function (r, e) {
					return r | e
				},
				"^": function (r, e) {
					return r ^ e
				},
				"&": function (r, e) {
					return r & e
				},
				"==": function (r, e) {
					return r == e
				},
				"!=": function (r, e) {
					return r != e
				},
				"===": function (r, e) {
					return r === e
				},
				"!==": function (r, e) {
					return r !== e
				},
				"<": function (r, e) {
					return r < e
				},
				">": function (r, e) {
					return r > e
				},
				"<=": function (r, e) {
					return r <= e
				},
				">=": function (r, e) {
					return r >= e
				},
				"<<": function (r, e) {
					return r << e
				},
				">>": function (r, e) {
					return r >> e
				},
				">>>": function (r, e) {
					return r >>> e
				},
				"+": function (r, e) {
					return r + e
				},
				"-": function (r, e) {
					return r - e
				},
				"*": function (r, e) {
					return r * e
				},
				"/": function (r, e) {
					return r / e
				},
				"%": function (r, e) {
					return r % e
				},
			},
			i = {
				"-": function (r) {
					return -r
				},
				"+": function (r) {
					return +r
				},
				"~": function (r) {
					return ~r
				},
				"!": function (r) {
					return !r
				},
			}
		function s(r, e) {
			return r.map(function (r) {
				return a(r, e)
			})
		}
		function c(r, e) {
			var n,
				t = a(r.object, e)
			if (
				((n = r.computed ? a(r.property, e) : r.property.name),
				/^__proto__|prototype|constructor$/.test(n))
			)
				throw Error('Access to member "' + n + '" disallowed.')
			return [t, t[n]]
		}
		function a(r, e) {
			var n = r
			switch (n.type) {
				case "ArrayExpression":
					return s(n.elements, e)
				case "BinaryExpression":
					return u[n.operator](a(n.left, e), a(n.right, e))
				case "CallExpression":
					var t, o, l
					if (
						("MemberExpression" === n.callee.type
							? ((t = (l = c(n.callee, e))[0]), (o = l[1]))
							: (o = a(n.callee, e)),
						"function" != typeof o)
					)
						return
					return o.apply(t, s(n.arguments, e))
				case "ConditionalExpression":
					return a(n.test, e) ? a(n.consequent, e) : a(n.alternate, e)
				case "Identifier":
					return e[n.name]
				case "Literal":
					return n.value
				case "LogicalExpression":
					return "||" === n.operator
						? a(n.left, e) || a(n.right, e)
						: "&&" === n.operator
							? a(n.left, e) && a(n.right, e)
							: u[n.operator](a(n.left, e), a(n.right, e))
				case "MemberExpression":
					return c(n, e)[1]
				case "ThisExpression":
					return e
				case "UnaryExpression":
					return i[n.operator](a(n.argument, e))
				default:
					return
			}
		}
		const fycKey = key => `FYC_${key}`,
			languages = ["FYC_EN", "FYC_JA", "FYC_ZH_CN"],
			stringsArgs = [
				[],
				x =>
					Function_pipe(
						String_split(x, /\r\n|\n/),
						Array_filter(not(String_isEmpty)),
					),
				join("\n"),
			],
			sc = (k, d) => {
				return (
					(key = fycKey(k)),
					(defaultValue = d),
					{
						gmKey: key,
						getValue: Effect_promise(async () =>
							GM.getValue(key, defaultValue),
						),
						defaultValue,
						toGm: Function_identity,
					}
				)
				var key, defaultValue
			},
			ic = (k, d, c, g) => {
				return (
					(key = fycKey(k)),
					(toConfig = c),
					Function_pipe(
						{ gmKey: key, defaultValue: (defaultValue = d), toGm: g },
						ctx => ({
							...ctx,
							getValue: Function_pipe(
								Effect_promise(() => GM.getValue(key)),
								Effect_map(x => (void 0 !== x ? toConfig(x) : defaultValue)),
							),
						}),
					)
				)
				var key, defaultValue, toConfig
			},
			src_defaultGMConfig = Function_pipe(
				{
					lang: ic(
						"LANG",
						"FYC_EN",
						x => (languages.includes(x) ? x : "FYC_EN"),
						x => x,
					),
					font: sc("FONT", "MS PGothic"),
					chatOpacity: sc("OPACITY", 0.8),
					color: sc("COLOR", "#ffffff"),
					ownerColor: sc("COLOR_OWNER", "#ffd600"),
					moderatorColor: sc("COLOR_MODERATOR", "#c564ff"),
					memberColor: sc("COLOR_MEMBER", "#9fffff"),
					fontSize: sc("SIZE", 1),
					fontWeight: sc("WEIGHT", 730),
					shadowFontWeight: sc("WEIGHT_SHADOW", 1),
					maxChatCount: sc("LIMIT", 40),
					flowSpeed: sc("SPEED", 18),
					maxChatLength: sc("MAX", 100),
					laneCount: sc("LANE_DIV", 12),
					bannedWords: ic("NG_WORDS", ...stringsArgs),
					bannedWordRegexes: ic("NG_REG_WORDS", ...stringsArgs),
					bannedUsers: ic("NG_USERS", ...stringsArgs),
					createChats: sc("TOGGLE_CREATE_COMMENTS", !0),
					noOverlap: sc("NO_OVERLAP", !0),
					createBanButton: sc("NG_BUTTON", !0),
					simplifyChatField: sc("SIMPLE_CHAT_FIELD", !1),
					displayModName: sc("DISPLAY_MODERATOR_NAME", !0),
					displaySuperChatAuthor: sc("DISPLAY_SUPER_CHAT_AUTHOR", !0),
					textOnly: sc("TEXT_ONLY", !1),
					timingFunction: sc("TIMING_FUNCTION", "linear"),
					displayChats: sc("DISPLAY_COMMENTS", !0),
					minSpacing: sc("MIN_SPACING", 0.5),
					fieldScale: sc("FIELD_SCALE", 1),
					flowY1: sc("flowY1", 0),
					flowY2: sc("flowY2", 1),
					flowX1: sc("flowX1", 0),
					flowX2: sc("flowX2", 1),
					shadowColor: sc("shadowColor", "#000000"),
					logEvents: sc("logEvents", !0),
				},
				x => ({
					...x,
					filterExp: ic(
						"filterExp",
						external_jsep_default()(
							`\n  or([\n  A.some(\n    flip(flow([inText, A.some]))(${JSON.stringify(x.bannedWords.defaultValue)})\n  )(A.getSomes([\n    messageText,\n    paymentInfo\n  ])),\n  A.some(\n    flip(flow([matchedByText, A.some]))(${JSON.stringify(x.bannedWordRegexes.defaultValue)})\n  )(A.getSomes([\n    messageText,\n    paymentInfo\n  ])),\n  O.exists(\n    flip(flow([eqText, A.some]))(${JSON.stringify(x.bannedUsers.defaultValue)})\n  )(authorID)\n  ])\n        `,
						),
						external_jsep_default(),
						external_astring_namespaceObject.generate,
					),
				}),
			),
			configKeys = Object.keys(src_defaultGMConfig),
			removeOldChats = flowChats => maxChatCount =>
				Function_pipe(
					SynchronizedRef_get(flowChats),
					Effect_map(
						sort(
							Order_mapInput(x => Either_isRight(x.animationState))(
								Boolean_Order,
							),
						),
					),
					Effect_map(x => splitAt(x, x.length - maxChatCount)),
					Effect_flatMap(([oldChats, newChats]) =>
						Function_pipe(
							oldChats,
							Effect_forEach(x =>
								Function_pipe(
									Effect_logDebug("RemoveChat"),
									Effect_zipRight(
										Effect_sync(() => {
											x.element.remove()
										}),
									),
								),
							),
							Effect_map(() => newChats),
						),
					),
					Effect_tap(x => Effect_logDebug(`length after clear: ${x.length}`)),
					Effect_flatMap(x => SynchronizedRef_set(flowChats, x)),
				),
			lit_html_t = globalThis,
			lit_html_i = lit_html_t.trustedTypes,
			lit_html_s = lit_html_i
				? lit_html_i.createPolicy("lit-html", { createHTML: t => t })
				: void 0,
			lit_html_h = `lit$${Math.random().toFixed(9).slice(2)}$`,
			lit_html_o = "?" + lit_html_h,
			lit_html_n = `<${lit_html_o}>`,
			lit_html_r = document,
			lit_html_l = () => lit_html_r.createComment(""),
			lit_html_c = t =>
				null === t || ("object" != typeof t && "function" != typeof t),
			lit_html_a = Array.isArray,
			d = "[ \t\n\f\r]",
			lit_html_f = /<(?:(!--|\/[^a-zA-Z])|(\/?[a-zA-Z][^>\s]*)|(\/?$))/g,
			v = /-->/g,
			_ = />/g,
			lit_html_m = RegExp(
				`>|${d}(?:([^\\s"'>=/]+)(${d}*=${d}*(?:[^ \t\n\f\r"'\`<>=]|("|')|))|$)`,
				"g",
			),
			lit_html_p = /'/g,
			g = /"/g,
			$ = /^(?:script|style|textarea|title)$/i,
			y =
				t =>
				(i, ...s) => ({ _$litType$: t, strings: i, values: s }),
			lit_html_x = y(1),
			w = (y(2), Symbol.for("lit-noChange")),
			T = Symbol.for("lit-nothing"),
			A = new WeakMap(),
			lit_html_E = lit_html_r.createTreeWalker(lit_html_r, 129)
		function C(t, i) {
			if (!Array.isArray(t) || !t.hasOwnProperty("raw"))
				throw Error("invalid template strings array")
			return void 0 !== lit_html_s ? lit_html_s.createHTML(i) : i
		}
		const P = (t, i) => {
			const s = t.length - 1,
				o = []
			let r,
				l = 2 === i ? "<svg>" : "",
				c = lit_html_f
			for (let i = 0; i < s; i++) {
				const s = t[i]
				let a,
					u,
					d = -1,
					y = 0
				for (
					;
					y < s.length && ((c.lastIndex = y), (u = c.exec(s)), null !== u);

				)
					(y = c.lastIndex),
						c === lit_html_f
							? "!--" === u[1]
								? (c = v)
								: void 0 !== u[1]
									? (c = _)
									: void 0 !== u[2]
										? ($.test(u[2]) && (r = RegExp("</" + u[2], "g")),
											(c = lit_html_m))
										: void 0 !== u[3] && (c = lit_html_m)
							: c === lit_html_m
								? ">" === u[0]
									? ((c = r ?? lit_html_f), (d = -1))
									: void 0 === u[1]
										? (d = -2)
										: ((d = c.lastIndex - u[2].length),
											(a = u[1]),
											(c =
												void 0 === u[3]
													? lit_html_m
													: '"' === u[3]
														? g
														: lit_html_p))
								: c === g || c === lit_html_p
									? (c = lit_html_m)
									: c === v || c === _
										? (c = lit_html_f)
										: ((c = lit_html_m), (r = void 0))
				const x = c === lit_html_m && t[i + 1].startsWith("/>") ? " " : ""
				l +=
					c === lit_html_f
						? s + lit_html_n
						: d >= 0
							? (o.push(a),
								s.slice(0, d) + "$lit$" + s.slice(d) + lit_html_h + x)
							: s + lit_html_h + (-2 === d ? i : x)
			}
			return [C(t, l + (t[s] || "<?>") + (2 === i ? "</svg>" : "")), o]
		}
		class V {
			constructor({ strings: t, _$litType$: s }, n) {
				let r
				this.parts = []
				let c = 0,
					a = 0
				const u = t.length - 1,
					d = this.parts,
					[f, v] = P(t, s)
				if (
					((this.el = V.createElement(f, n)),
					(lit_html_E.currentNode = this.el.content),
					2 === s)
				) {
					const t = this.el.content.firstChild
					t.replaceWith(...t.childNodes)
				}
				for (; null !== (r = lit_html_E.nextNode()) && d.length < u; ) {
					if (1 === r.nodeType) {
						if (r.hasAttributes())
							for (const t of r.getAttributeNames())
								if (t.endsWith("$lit$")) {
									const i = v[a++],
										s = r.getAttribute(t).split(lit_html_h),
										e = /([.?@])?(.*)/.exec(i)
									d.push({
										type: 1,
										index: c,
										name: e[2],
										strings: s,
										ctor:
											"." === e[1]
												? k
												: "?" === e[1]
													? H
													: "@" === e[1]
														? I
														: R,
									}),
										r.removeAttribute(t)
								} else
									t.startsWith(lit_html_h) &&
										(d.push({ type: 6, index: c }), r.removeAttribute(t))
						if ($.test(r.tagName)) {
							const t = r.textContent.split(lit_html_h),
								s = t.length - 1
							if (s > 0) {
								r.textContent = lit_html_i ? lit_html_i.emptyScript : ""
								for (let i = 0; i < s; i++)
									r.append(t[i], lit_html_l()),
										lit_html_E.nextNode(),
										d.push({ type: 2, index: ++c })
								r.append(t[s], lit_html_l())
							}
						}
					} else if (8 === r.nodeType)
						if (r.data === lit_html_o) d.push({ type: 2, index: c })
						else {
							let t = -1
							for (; -1 !== (t = r.data.indexOf(lit_html_h, t + 1)); )
								d.push({ type: 7, index: c }), (t += lit_html_h.length - 1)
						}
					c++
				}
			}
			static createElement(t, i) {
				const s = lit_html_r.createElement("template")
				return (s.innerHTML = t), s
			}
		}
		function N(t, i, s = t, e) {
			if (i === w) return i
			let h = void 0 !== e ? s._$Co?.[e] : s._$Cl
			const o = lit_html_c(i) ? void 0 : i._$litDirective$
			return (
				h?.constructor !== o &&
					(h?._$AO?.(!1),
					void 0 === o ? (h = void 0) : ((h = new o(t)), h._$AT(t, s, e)),
					void 0 !== e ? ((s._$Co ??= [])[e] = h) : (s._$Cl = h)),
				void 0 !== h && (i = N(t, h._$AS(t, i.values), h, e)),
				i
			)
		}
		class S {
			constructor(t, i) {
				;(this._$AV = []),
					(this._$AN = void 0),
					(this._$AD = t),
					(this._$AM = i)
			}
			get parentNode() {
				return this._$AM.parentNode
			}
			get _$AU() {
				return this._$AM._$AU
			}
			u(t) {
				const {
						el: { content: i },
						parts: s,
					} = this._$AD,
					e = (t?.creationScope ?? lit_html_r).importNode(i, !0)
				lit_html_E.currentNode = e
				let h = lit_html_E.nextNode(),
					o = 0,
					n = 0,
					l = s[0]
				for (; void 0 !== l; ) {
					if (o === l.index) {
						let i
						2 === l.type
							? (i = new M(h, h.nextSibling, this, t))
							: 1 === l.type
								? (i = new l.ctor(h, l.name, l.strings, this, t))
								: 6 === l.type && (i = new L(h, this, t)),
							this._$AV.push(i),
							(l = s[++n])
					}
					o !== l?.index && ((h = lit_html_E.nextNode()), o++)
				}
				return (lit_html_E.currentNode = lit_html_r), e
			}
			p(t) {
				let i = 0
				for (const s of this._$AV)
					void 0 !== s &&
						(void 0 !== s.strings
							? (s._$AI(t, s, i), (i += s.strings.length - 2))
							: s._$AI(t[i])),
						i++
			}
		}
		class M {
			get _$AU() {
				return this._$AM?._$AU ?? this._$Cv
			}
			constructor(t, i, s, e) {
				;(this.type = 2),
					(this._$AH = T),
					(this._$AN = void 0),
					(this._$AA = t),
					(this._$AB = i),
					(this._$AM = s),
					(this.options = e),
					(this._$Cv = e?.isConnected ?? !0)
			}
			get parentNode() {
				let t = this._$AA.parentNode
				const i = this._$AM
				return void 0 !== i && 11 === t?.nodeType && (t = i.parentNode), t
			}
			get startNode() {
				return this._$AA
			}
			get endNode() {
				return this._$AB
			}
			_$AI(t, i = this) {
				;(t = N(this, t, i)),
					lit_html_c(t)
						? t === T || null == t || "" === t
							? (this._$AH !== T && this._$AR(), (this._$AH = T))
							: t !== this._$AH && t !== w && this._(t)
						: void 0 !== t._$litType$
							? this.$(t)
							: void 0 !== t.nodeType
								? this.T(t)
								: (t =>
											lit_html_a(t) ||
											"function" == typeof t?.[Symbol.iterator])(t)
									? this.k(t)
									: this._(t)
			}
			S(t) {
				return this._$AA.parentNode.insertBefore(t, this._$AB)
			}
			T(t) {
				this._$AH !== t && (this._$AR(), (this._$AH = this.S(t)))
			}
			_(t) {
				this._$AH !== T && lit_html_c(this._$AH)
					? (this._$AA.nextSibling.data = t)
					: this.T(lit_html_r.createTextNode(t)),
					(this._$AH = t)
			}
			$(t) {
				const { values: i, _$litType$: s } = t,
					e =
						"number" == typeof s
							? this._$AC(t)
							: (void 0 === s.el &&
									(s.el = V.createElement(C(s.h, s.h[0]), this.options)),
								s)
				if (this._$AH?._$AD === e) this._$AH.p(i)
				else {
					const t = new S(e, this),
						s = t.u(this.options)
					t.p(i), this.T(s), (this._$AH = t)
				}
			}
			_$AC(t) {
				let i = A.get(t.strings)
				return void 0 === i && A.set(t.strings, (i = new V(t))), i
			}
			k(t) {
				lit_html_a(this._$AH) || ((this._$AH = []), this._$AR())
				const i = this._$AH
				let s,
					e = 0
				for (const h of t)
					e === i.length
						? i.push(
								(s = new M(
									this.S(lit_html_l()),
									this.S(lit_html_l()),
									this,
									this.options,
								)),
							)
						: (s = i[e]),
						s._$AI(h),
						e++
				e < i.length && (this._$AR(s && s._$AB.nextSibling, e), (i.length = e))
			}
			_$AR(t = this._$AA.nextSibling, i) {
				for (this._$AP?.(!1, !0, i); t && t !== this._$AB; ) {
					const i = t.nextSibling
					t.remove(), (t = i)
				}
			}
			setConnected(t) {
				void 0 === this._$AM && ((this._$Cv = t), this._$AP?.(t))
			}
		}
		class R {
			get tagName() {
				return this.element.tagName
			}
			get _$AU() {
				return this._$AM._$AU
			}
			constructor(t, i, s, e, h) {
				;(this.type = 1),
					(this._$AH = T),
					(this._$AN = void 0),
					(this.element = t),
					(this.name = i),
					(this._$AM = e),
					(this.options = h),
					s.length > 2 || "" !== s[0] || "" !== s[1]
						? ((this._$AH = Array(s.length - 1).fill(new String())),
							(this.strings = s))
						: (this._$AH = T)
			}
			_$AI(t, i = this, s, e) {
				const h = this.strings
				let o = !1
				if (void 0 === h)
					(t = N(this, t, i, 0)),
						(o = !lit_html_c(t) || (t !== this._$AH && t !== w)),
						o && (this._$AH = t)
				else {
					const e = t
					let n, r
					for (t = h[0], n = 0; n < h.length - 1; n++)
						(r = N(this, e[s + n], i, n)),
							r === w && (r = this._$AH[n]),
							(o ||= !lit_html_c(r) || r !== this._$AH[n]),
							r === T ? (t = T) : t !== T && (t += (r ?? "") + h[n + 1]),
							(this._$AH[n] = r)
				}
				o && !e && this.j(t)
			}
			j(t) {
				t === T
					? this.element.removeAttribute(this.name)
					: this.element.setAttribute(this.name, t ?? "")
			}
		}
		class k extends R {
			constructor() {
				super(...arguments), (this.type = 3)
			}
			j(t) {
				this.element[this.name] = t === T ? void 0 : t
			}
		}
		class H extends R {
			constructor() {
				super(...arguments), (this.type = 4)
			}
			j(t) {
				this.element.toggleAttribute(this.name, !!t && t !== T)
			}
		}
		class I extends R {
			constructor(t, i, s, e, h) {
				super(t, i, s, e, h), (this.type = 5)
			}
			_$AI(t, i = this) {
				if ((t = N(this, t, i, 0) ?? T) === w) return
				const s = this._$AH,
					e =
						(t === T && s !== T) ||
						t.capture !== s.capture ||
						t.once !== s.once ||
						t.passive !== s.passive,
					h = t !== T && (s === T || e)
				e && this.element.removeEventListener(this.name, this, s),
					h && this.element.addEventListener(this.name, this, t),
					(this._$AH = t)
			}
			handleEvent(t) {
				"function" == typeof this._$AH
					? this._$AH.call(this.options?.host ?? this.element, t)
					: this._$AH.handleEvent(t)
			}
		}
		class L {
			constructor(t, i, s) {
				;(this.element = t),
					(this.type = 6),
					(this._$AN = void 0),
					(this._$AM = i),
					(this.options = s)
			}
			get _$AU() {
				return this._$AM._$AU
			}
			_$AI(t) {
				N(this, t)
			}
		}
		const Z = lit_html_t.litHtmlPolyfillSupport
		Z?.(V, M), (lit_html_t.litHtmlVersions ??= []).push("3.1.4")
		class directive_i {
			constructor(t) {}
			get _$AU() {
				return this._$AM._$AU
			}
			_$AT(t, e, i) {
				;(this._$Ct = t), (this._$AM = e), (this._$Ci = i)
			}
			_$AS(t, e) {
				return this.update(t, e)
			}
			update(t, e) {
				return this.render(...e)
			}
		}
		const style_map_o =
				((t = class extends directive_i {
					constructor(t) {
						if (
							(super(t),
							1 !== t.type || "style" !== t.name || t.strings?.length > 2)
						)
							throw Error(
								"The `styleMap` directive must be used in the `style` attribute and must be the only part in the attribute.",
							)
					}
					render(t) {
						return Object.keys(t).reduce((e, r) => {
							const s = t[r]
							return null == s
								? e
								: e +
										`${(r = r.includes("-") ? r : r.replace(/(?:^(webkit|moz|ms|o)|)(?=[A-Z])/g, "-$&").toLowerCase())}:${s};`
						}, "")
					}
					update(e, [r]) {
						const { style: s } = e.element
						if (void 0 === this.ft)
							return (this.ft = new Set(Object.keys(r))), this.render(r)
						for (const t of this.ft)
							null == r[t] &&
								(this.ft.delete(t),
								t.includes("-") ? s.removeProperty(t) : (s[t] = null))
						for (const t in r) {
							const e = r[t]
							if (null != e) {
								this.ft.add(t)
								const r = "string" == typeof e && e.endsWith(" !important")
								t.includes("-") || r
									? s.setProperty(
											t,
											r ? e.slice(0, -11) : e,
											r ? "important" : "",
										)
									: (s[t] = e)
							}
						}
						return w
					}
				}),
				(...e) => ({ _$litDirective$: t, values: e })),
			getChatFontSize = ({ config: { value: config }, playerRect }) =>
				SynchronizedRef_get(playerRect).pipe(
					Effect_map(
						rect =>
							Math.round(
								((Math.max(config.fontSize - 0.2, 0.01) * rect.height) /
									config.laneCount) *
									(config.flowY2 - config.flowY1) *
									100,
							) / 100,
					),
				),
			textShadow = shadowColor => offset =>
				Function_pipe(
					offset,
					x => `${x}px`,
					x => (a, b) => `${a}${x} ${b}${x} ${shadowColor}99`,
					x => join(", ")([x("-", "-"), x("", "-"), x("-", ""), x("", "")]),
				),
			textStyle = { fontFamily: "inherit" },
			renderChat = chat => mainState =>
				((chat, mainState) =>
					Function_pipe(
						Effect_gen(function* () {
							return {
								data: chat.data,
								config: mainState.config.value,
								fontSize: yield* getChatFontSize(mainState),
							}
						}),
						Effect_map(
							({ data, config, fontSize }) =>
								lit_html_x`<span style=${style_map_o({ fontSize: `${fontSize}px`, visibility: config.displayChats ? "visible" : "hidden", color: "owner" === data.authorType ? config.ownerColor : "moderator" === data.authorType ? config.moderatorColor : "member" === data.authorType ? config.memberColor : config.color, fontWeight: config.fontWeight.toString(), fontFamily: config.font, opacity: config.chatOpacity.toString(), textShadow: textShadow(config.shadowColor)(config.shadowFontWeight) })}>${Function_pipe(
									[
										Function_pipe(
											data.authorName,
											filter(
												() =>
													("moderator" === data.authorType &&
														config.displayModName) ||
													(Option_isSome(data.paymentInfo) &&
														config.displaySuperChatAuthor),
											),
											map(
												text =>
													lit_html_x`<span style=${style_map_o({ ...match(data.textColor, { onNone: () => {}, onSome: x => ({ color: x }) }), fontSize: "0.84em", ...textStyle })}>${text}: </span>`,
											),
										),
										Function_pipe(
											data.messageElement,
											map(x =>
												((message, config) => {
													const eleWin =
															message.ownerDocument.defaultView ?? window,
														{ maxChatLength } = config
													return Function_pipe(
														Array.from(message.childNodes),
														Array_reduce(
															{ vnodes: [], length: 0 },
															({ vnodes, length }, node) => {
																return length >= maxChatLength
																	? { vnodes, length }
																	: !config.textOnly &&
																		  node instanceof eleWin.HTMLImageElement
																		? {
																				vnodes: [
																					...vnodes,
																					lit_html_x`<img style=${style_map_o({ height: "1em", width: "1em", verticalAlign: "text-top" })} src=${node.src.replace(/=w\d+-h\d+-c-k-nd$/, "")} alt=${node.alt}>`,
																				],
																				length: length + 1,
																			}
																		: Function_pipe(
																				node.textContent ?? "",
																				((end = maxChatLength),
																				self => self.slice(0, end)),
																				x =>
																					node instanceof
																					eleWin.HTMLAnchorElement
																						? {
																								vnodes: [
																									...vnodes,
																									lit_html_x`<span style=${style_map_o({ fontSize: "0.84em", textDecoration: "underline", ...textStyle })}>${x}</span>`,
																								],
																								length: length + x.length,
																							}
																						: {
																								vnodes: [
																									...vnodes,
																									lit_html_x`${x}`,
																								],
																								length: length + x.length,
																							},
																			)
																var end
															},
														),
													)
												})(x, config),
											),
											map(
												text =>
													lit_html_x`<span style=${style_map_o({ ...match(data.textColor, { onNone: () => {}, onSome: x => ({ color: x }) }), ...textStyle })}>${text.vnodes}</span>`,
											),
										),
										Function_pipe(
											data.paymentInfo,
											map(
												text =>
													lit_html_x`<span style=${style_map_o({ ...match(data.paidColor, { onNone: () => {}, onSome: x => ({ color: x }) }), fontSize: "0.84em", ...textStyle })}><strong style=${style_map_o(textStyle)}></strong> ${text.trim()}</span>`,
											),
										),
									],
									Array_getSomes,
								)}</span>`,
						),
					))(chat, mainState).pipe(
					Effect_flatMap(node =>
						Effect_sync(() =>
							((t, i, s) => {
								const e = i
								let h = e._$litPart$
								if (void 0 === h) {
									const t = null
									e._$litPart$ = h = new M(
										i.insertBefore(lit_html_l(), t),
										t,
										void 0,
										{},
									)
								}
								return h._$AI(t), h
							})(node, chat.element),
						),
					),
				),
			external_window_hash_it_namespaceObject = window["hash-it"]
		var t,
			external_window_hash_it_default = __webpack_require__.n(
				external_window_hash_it_namespaceObject,
			)
		const external_window_micro_memoize_namespaceObject =
			window["micro-memoize"]
		var external_window_micro_memoize_default = __webpack_require__.n(
			external_window_micro_memoize_namespaceObject,
		)
		const getFlowChatProgress = animationState =>
				animationState.pipe(
					Either_match({ onLeft: Option_none, onRight: Option_some }),
					flatMapNullable(x => x.currentTime),
					map(x => ("number" == typeof x ? x : x.to("ms").value)),
					map(x => x / 6400),
					getOrElse(() => 0),
				),
			getFlowChatRect = (chat, config, playerRect) =>
				Function_pipe(
					config,
					x =>
						playerRect.width * x.flowX2 -
						(chat.width + playerRect.width * (x.flowX2 - x.flowX1)) *
							getFlowChatProgress(chat.animationState),
					x => new DOMRectReadOnly(x, chat.y, chat.width, chat.height),
				),
			getChatLane =
				(flowChat, chatIndex, progress) =>
				({ config: { value: config }, flowChats, playerRect }) =>
					Effect_gen(function* () {
						const rect = yield* SynchronizedRef_get(playerRect),
							flowWidth = rect.width * (config.flowX2 - config.flowX1),
							{
								width: chatWidth,
								height: chatHeight,
								x: chatX,
							} = getFlowChatRect(flowChat, config, rect),
							movingChats = Function_pipe(
								yield* SynchronizedRef_get(flowChats),
								chats =>
									Array_take(
										chats,
										getOrElse(chatIndex, () => chats.length),
									),
								Array_filter(
									chat => Either_isRight(chat.animationState) && chat.width > 0,
								),
								sort(Order_mapInput(x => x.lane)(Number_Order)),
							),
							tooCloseTo = external_window_micro_memoize_default()(
								x => {
									const { width: otherWidth, x: otherX } = getFlowChatRect(
											x,
											config,
											rect,
										),
										gap =
											(chatHeight * otherWidth * chatWidth) ** 0.333 *
											config.minSpacing
									return (
										(flowWidth - otherX) / (flowWidth + otherWidth) - progress <
											(chatWidth + gap) / (flowWidth + chatWidth) ||
										otherX + otherWidth + gap > chatX
									)
								},
								{ maxSize: 1e3 },
							),
							occupyInfo = Function_pipe(
								movingChats,
								Array_map(x => ({
									tooClose: () => tooCloseTo(x),
									lane: x.lane,
								})),
								Array_append({ tooClose: () => !0, lane: config.laneCount }),
							),
							index = Function_pipe(
								occupyInfo,
								findFirstIndex(x => x.lane >= flowChat.lane),
								getOrElse(() => -1),
							),
							nextOccupiedLaneAbove = Function_pipe(
								occupyInfo,
								Array_take(index),
								Array_findLast(x => x.tooClose()),
								map(x => x.lane),
								getOrElse(() => -1),
							),
							nextOccupiedLaneBelow = Function_pipe(
								occupyInfo,
								Array_drop(index),
								Array_findFirst(x => x.tooClose()),
								map(x => x.lane),
								getOrElse(() => config.laneCount),
							),
							formerLaneInterval = Math.min(
								flowChat.lane - nextOccupiedLaneAbove,
								nextOccupiedLaneBelow - flowChat.lane,
								1,
							)
						return Function_pipe(
							occupyInfo,
							Array_reduce(
								{ maxInterval: 0, maxIntervalLane: 0, lastLane: -1 },
								({ maxInterval, maxIntervalLane, lastLane }, info) =>
									maxInterval > 0.999 || !info.tooClose()
										? { maxInterval, maxIntervalLane, lastLane }
										: (() => {
												const nextLane = info.lane,
													interLane = Number_clamp({
														minimum: 0,
														maximum: config.laneCount - 1,
													})((lastLane + nextLane) / 2),
													newInterval = Math.min(
														interLane - lastLane,
														nextLane - interLane,
														1,
													)
												return {
													lastLane: nextLane,
													...(newInterval - maxInterval > 0.001
														? {
																maxInterval: newInterval,
																maxIntervalLane: Math.max(
																	lastLane + newInterval,
																	0,
																),
															}
														: { maxInterval, maxIntervalLane }),
												}
											})(),
							),
							x => ({
								lane:
									Math.abs(formerLaneInterval - x.maxInterval) < 0.001
										? flowChat.lane
										: x.maxIntervalLane,
								interval: x.maxInterval,
							}),
						)
					}),
			intervalTooSmall = interval => config =>
				config.noOverlap && interval < 0.999,
			setChatPlayState = chat => mainState =>
				Function_pipe(
					chat.animationState,
					Effect_tap(x =>
						SynchronizedRef_get(mainState.chatPlaying).pipe(
							Effect_flatMap(playing =>
								Effect_sync(playing ? () => x.play() : () => x.pause()),
							),
						),
					),
					Effect_flatMap(x =>
						Effect_sync(() => {
							x.playbackRate = mainState.config.value.flowSpeed / 15
						}),
					),
					Effect_ignore,
				),
			getWidth = external_window_micro_memoize_default()(
				ele => ele?.getBoundingClientRect().width ?? 0,
				{
					maxSize: 2e3,
					transformKey: Array_map(external_window_hash_it_default()),
				},
			),
			setChatAnimation = chat => mainState =>
				Function_pipe(
					getChatFontSize(mainState),
					Effect_tap(height =>
						Effect_gen(function* () {
							chat.element.style.transform = `translate(${(yield* SynchronizedRef_get(mainState.playerRect)).width * (mainState.config.value.flowX2 - mainState.config.value.flowX1)}px, -${2 * height}px)`
						}),
					),
					Effect_filterOrFail(() =>
						Either_match(chat.animationState, {
							onLeft: x => "NotStarted" === x,
							onRight: () => !0,
						}),
					),
					Effect_flatMap(height =>
						Effect_gen(function* () {
							return {
								newChat: {
									...chat,
									width: getWidth(chat.element.firstElementChild),
									height,
								},
								oldChatIndex: Function_pipe(
									yield* SynchronizedRef_get(mainState.flowChats),
									findFirstIndex(x => x === chat),
								),
								progress: getFlowChatProgress(chat.animationState),
							}
						}),
					),
					Effect_flatMap(ctx =>
						getChatLane(
							ctx.newChat,
							ctx.oldChatIndex,
							ctx.progress,
						)(mainState).pipe(
							Effect_flatMap(({ lane, interval }) =>
								intervalTooSmall(interval)(mainState.config.value)
									? ctx.newChat.animationState.pipe(
											Effect_tap(x => Effect_sync(() => x.finish())),
											Effect_map(() => ({
												...ctx.newChat,
												animationState: Either_left("Ended"),
											})),
											Effect_orElse(() => Effect_succeed(ctx.newChat)),
										)
									: (
											chat => lane => progress => mainState =>
												Function_pipe(
													((lane, { config: { value: config }, playerRect }) =>
														SynchronizedRef_get(playerRect).pipe(
															Effect_map(
																rect =>
																	rect.height *
																	((lane / config.laneCount + 0.005) *
																		(config.flowY2 - config.flowY1) +
																		config.flowY1),
															),
														))(lane, mainState),
													Effect_map(y => ({ ...chat, lane, y })),
													Effect_tap(newChat =>
														Function_pipe(
															newChat.animationState,
															Either_match({
																onLeft: () => _void,
																onRight: x => Effect_sync(() => x.cancel()),
															}),
														),
													),
													Effect_flatMap(newChat =>
														SynchronizedRef_get(mainState.playerRect).pipe(
															Effect_map(rect => [
																[
																	rect.width *
																		(mainState.config.value.flowX2 -
																			mainState.config.value.flowX1),
																	newChat.y,
																],
																[-newChat.width, newChat.y],
															]),
															Effect_map(
																Function_pipe(
																	x => `${x}px`,
																	x =>
																		Array_map(
																			mapBoth({ onFirst: x, onSecond: x }),
																		),
																),
															),
															Effect_map(
																Array_map(([x, y]) => ({
																	transform: `translate(${x}, ${y})`,
																})),
															),
															Effect_flatMap(x =>
																Effect_sync(() =>
																	newChat.element.animate(x, {
																		duration: 6400,
																		easing:
																			mainState.config.value.timingFunction,
																	}),
																),
															),
															Effect_flatMap(animation =>
																Effect_sync(() => {
																	const newNewChat = {
																		...newChat,
																		animationState: Either_right(animation),
																	}
																	Object.assign(animation, {
																		onfinish: () =>
																			Object.assign(newNewChat, {
																				animationState: Either_left("Ended"),
																			}),
																		currentTime: 6400 * progress,
																	})
																	return newNewChat
																}),
															),
														),
													),
												)
										)(ctx.newChat)(lane)(ctx.progress)(mainState),
							),
							Effect_map(x => ({ oldChatIndex: ctx.oldChatIndex, newChat: x })),
						),
					),
					Effect_tap(x => setChatPlayState(x.newChat)(mainState)),
					Effect_flatMap(x =>
						match(x.oldChatIndex, {
							onNone: () => Effect_succeed({ newChat: x.newChat }),
							onSome: index =>
								Function_pipe(
									SynchronizedRef_update(
										mainState.flowChats,
										Array_replace(index, x.newChat),
									),
									Effect_zipRight(
										Effect_fail(new Cause_NoSuchElementException()),
									),
								),
						}),
					),
				),
			tapEffect = f =>
				(0, external_rxjs_namespaceObject.concatMap)(x =>
					(0, external_rxjs_namespaceObject.from)(Effect_runPromise(f(x))).pipe(
						(0, external_rxjs_namespaceObject.map)(() => x),
					),
				),
			configStream = (provideLog, mainState, co, chatScreen, live) =>
				(0, external_rxjs_namespaceObject.defer)(() =>
					(0, external_rxjs_namespaceObject.merge)(
						(0, external_rxjs_namespaceObject.merge)(
							co.bannedWordRegexes,
							co.bannedWords,
							co.bannedUsers,
						),
						Function_pipe(
							co.fieldScale,
							(0, external_rxjs_namespaceObject.startWith)(
								mainState.config.value.fieldScale,
							),
							(0, external_rxjs_namespaceObject.map)(
								(
									live => scale =>
										Function_pipe(
											live.chatField.ele,
											Effect_flatMap(field =>
												Function_pipe(
													[
														Function_pipe(
															fromNullable(field.parentElement),
															map(x =>
																Effect_sync(() =>
																	Object.assign(x.style, {
																		transformOrigin:
																			(scale >= 1 ? "top" : "bottom") + " left",
																		transform: `scale(${scale})`,
																		width: 100 / scale + "%",
																		height: 100 / scale + "%",
																	}),
																),
															),
														),
														Function_pipe(
															live.chatScroller.ele,
															map(scroller =>
																Effect_sync(() => {
																	scroller.scrollTop = scroller.scrollHeight
																}),
															),
														),
													],
													Array_getSomes,
													Effect_all,
												),
											),
											Effect_ignore,
										)
								)(live),
							),
							tapEffect(provideLog),
						),
						Function_pipe(
							(0, external_rxjs_namespaceObject.merge)(
								Function_pipe(
									(0, external_rxjs_namespaceObject.merge)(
										co.displayModName,
										co.displaySuperChatAuthor,
										co.font,
										co.fontSize,
										co.fontWeight,
										co.laneCount,
										co.minSpacing,
										co.flowY1,
										co.flowY2,
										Function_pipe(
											co.flowX1,
											(0, external_rxjs_namespaceObject.startWith)(
												mainState.config.value.flowX1,
											),
											tapEffect(x =>
												provideLog(
													Effect_sync(() =>
														Object.assign(chatScreen.style, {
															left: 100 * x + "%",
															width:
																100 * (mainState.config.value.flowX2 - x) + "%",
														}),
													),
												),
											),
										),
										Function_pipe(
											co.flowX2,
											tapEffect(x =>
												provideLog(
													Effect_sync(() =>
														Object.assign(chatScreen.style, {
															left: 100 * mainState.config.value.flowX1 + "%",
															width:
																100 * (x - mainState.config.value.flowX1) + "%",
														}),
													),
												),
											),
										),
										co.textOnly,
									),
									(0, external_rxjs_namespaceObject.map)(() => ({
										render: !0,
										setAnimation: !0,
									})),
								),
								Function_pipe(
									(0, external_rxjs_namespaceObject.merge)(
										co.color,
										co.ownerColor,
										co.moderatorColor,
										co.memberColor,
										co.shadowColor,
										co.chatOpacity,
										co.shadowFontWeight,
										co.displayChats,
									),
									(0, external_rxjs_namespaceObject.map)(() => ({
										render: !0,
									})),
								),
								Function_pipe(
									co.flowSpeed,
									(0, external_rxjs_namespaceObject.map)(() => ({
										setPlayState: !0,
									})),
								),
								Function_pipe(
									(0, external_rxjs_namespaceObject.merge)(
										Function_pipe(
											co.maxChatCount,
											(0, external_rxjs_namespaceObject.map)(
												removeOldChats(mainState.flowChats),
											),
											tapEffect(provideLog),
										),
										co.noOverlap,
										co.timingFunction,
									),
									(0, external_rxjs_namespaceObject.map)(() => ({
										setAnimation: !0,
									})),
								),
							),
							(0, external_rxjs_namespaceObject.throttleTime)(180, void 0, {
								leading: !0,
								trailing: !0,
							}),
							(0, external_rxjs_namespaceObject.map)(x => ({
								render: !1,
								setAnimation: !1,
								setPlayState: !1,
								...x,
							})),
							tapEffect(c =>
								provideLog(
									Function_pipe(
										SynchronizedRef_get(mainState.flowChats),
										Effect_map(
											Array_filter(x => Either_isRight(x.animationState)),
										),
										Effect_flatMap(
											Effect_forEach(chat =>
												Function_pipe(
													Effect_allSuccesses([
														c.render
															? Effect_succeed(renderChat(chat))
															: Effect_fail(new Cause_NoSuchElementException()),
														c.setAnimation
															? Effect_succeed(state =>
																	Effect_ignore(setChatAnimation(chat)(state)),
																)
															: c.setPlayState
																? Effect_succeed(setChatPlayState(chat))
																: Effect_fail(
																		new Cause_NoSuchElementException(),
																	),
													]),
													Effect_flatMap(Effect_forEach(apply(mainState))),
												),
											),
										),
									),
								),
							),
						),
						co.lang,
						co.maxChatLength,
						co.simplifyChatField,
						co.createBanButton,
						co.createChats,
						co.fieldScale,
					),
				),
			src_listeningBroadcastConfigKeys = [
				"lang",
				"bannedWords",
				"bannedWordRegexes",
				"bannedUsers",
				"filterExp",
				"simplifyChatField",
				"createBanButton",
				"fieldScale",
			],
			chatApp = Function_pipe(
				Effect_sync(() => document.querySelector("#chatframe")),
				Effect_flatMap(nullableFrame =>
					Function_pipe(
						fromNullable(nullableFrame),
						filter(frame =>
							Function_pipe(
								frame.contentDocument?.readyState,
								x => "loading" === x || "complete" === x,
							),
						),
						flatMapNullable(x => x.contentDocument),
						orElse(() => Option_some(document)),
						flatMapNullable(x => x.querySelector("yt-live-chat-app")),
					),
				),
			),
			livePageYt = {
				toggleChatBtnParent: Function_pipe(
					Effect_sync(() =>
						Array.from(document.querySelectorAll(".ytp-right-controls")),
					),
					Effect_flatMap(Array_findFirst(x => null !== x.offsetParent)),
				),
				settingsToggleNextElement: Function_pipe(
					Effect_sync(() => document.querySelector("#menu-container")),
					Effect_flatMap(Effect_fromNullable),
					Effect_filterOrFail(x => null !== x.offsetParent),
					Effect_flatMap(x =>
						Effect_fromNullable(
							x.querySelector(".dropdown-trigger.ytd-menu-renderer"),
						),
					),
					Effect_orElse(() =>
						Effect_fromNullable(
							document.querySelector(
								"#top-row .dropdown-trigger.ytd-menu-renderer",
							),
						),
					),
					Effect_filterOrFail(x => null !== x.parentElement?.offsetParent),
				),
				settingsContainer: Function_pipe(
					Effect_sync(() => document.body),
					Effect_flatMap(fromNullable),
				),
				player: Function_pipe(
					Effect_sync(() => document.querySelector("#movie_player")),
					Effect_flatMap(fromNullable),
				),
				video: Function_pipe(
					Effect_sync(() =>
						document.querySelector("video.video-stream.html5-main-video"),
					),
					Effect_flatMap(fromNullable),
				),
				chatField: Function_pipe(
					chatApp,
					Effect_flatMap(app =>
						Function_pipe(
							app.querySelector("#items.yt-live-chat-item-list-renderer"),
							fromNullable,
						),
					),
				),
				chatTicker: Function_pipe(
					chatApp,
					Effect_flatMap(app =>
						Function_pipe(
							app.querySelector("#items.yt-live-chat-ticker-renderer"),
							fromNullable,
						),
					),
				),
				chatScroller: Function_pipe(
					chatApp,
					Effect_flatMap(app =>
						Function_pipe(
							app.querySelector(
								"#item-scroller.yt-live-chat-item-list-renderer",
							),
							fromNullable,
						),
					),
				),
				offlineSlate: Function_pipe(
					Effect_sync(() => document.querySelector(".ytp-offline-slate")),
					Effect_flatMap(fromNullable),
				),
			},
			logMeta = fiberRefUnsafeMake(Option_none()),
			logWithMeta = level => message => data =>
				Function_pipe(
					Effect_log(message),
					Effect_locally(logMeta, Option_some(data)),
					x => locally(level)(x),
				),
			mainCss = Function_pipe(
				Effect_sync(() => document.createElement("style")),
				Effect_tap(x =>
					Effect_sync(() => {
						x.textContent =
							".fyc_chat {\n  line-height: 1;\n  z-index: 30;\n  position: absolute;\n  user-select: none;\n  white-space: nowrap;\n  will-change: transform;\n}\n.fyc_button {\n  display: inline-block;\n  border-style: none;\n  z-index: 4;\n  font-weight: 500;\n  color: var(--yt-spec-text-secondary);\n}"
					}),
				),
			),
			observePair = con =>
				Effect_sync(() => {
					const subject = new external_rxjs_namespaceObject.Subject()
					return { subject, observer: new con(lib(subject)) }
				}),
			emptyElement = document.createElement("span"),
			addFlowChat = (data, chatScrn, mainState) =>
				Effect_gen(function* () {
					const chatFontSize = yield* getChatFontSize(mainState)
					;(yield* Function_pipe(
						Effect_succeed({
							data,
							element: emptyElement,
							lane: -1,
							animationState: Either_left("NotStarted"),
							width: 2,
							height: chatFontSize,
							y: 0,
						}),
						Effect_flatMap(x => getChatLane(x, Option_none(), 0)(mainState)),
						Effect_map(
							({ interval }) =>
								!intervalTooSmall(interval)(mainState.config.value),
						),
					)) &&
						(yield* Function_pipe(
							SynchronizedRef_get(mainState.flowChats),
							Effect_flatMap(chats =>
								findFirstIndex(
									chats,
									chat =>
										Either_match(chat.animationState, {
											onLeft: x => "Ended" === x,
											onRight: () => !1,
										}) || chats.length >= mainState.config.value.maxChatCount,
								),
							),
							Effect_matchEffect({
								onFailure: () =>
									Function_pipe(
										Effect_sync(() => document.createElement("span")),
										Effect_tap(element =>
											Effect_sync(() => chatScrn.append(element)),
										),
										Effect_tap(element =>
											Effect_sync(() => element.classList.add("fyc_chat")),
										),
										Effect_zipLeft(Effect_logDebug("Flow chat element added")),
									),
								onSuccess: index =>
									Function_pipe(
										Effect_gen(function* () {
											const chat = Function_pipe(
												yield* SynchronizedRef_get(mainState.flowChats),
												Array_unsafeGet(index),
											)
											yield* SynchronizedRef_update(
												mainState.flowChats,
												Array_remove(index),
											)
											yield* chat.animationState.pipe(
												Effect_tap(animation =>
													Effect_sync(() => animation.cancel()),
												),
												Effect_ignore,
											)
											return chat.element
										}),
									),
							}),
							Effect_map(element => ({
								data,
								element,
								lane: -1,
								animationState: Either_left("NotStarted"),
								width: 2,
								height: chatFontSize,
								y: 0,
							})),
							Effect_flatMap(flowChat =>
								Function_pipe(
									Effect_succeed(mainState),
									Effect_tap(renderChat(flowChat)),
									Effect_flatMap(setChatAnimation(flowChat)),
									Effect_matchEffect({
										onFailure: () =>
											Function_pipe(
												Effect_sync(() => flowChat.element.remove()),
												Effect_zipLeft(
													Effect_logDebug("Flow chat element removed"),
												),
											),
										onSuccess: x =>
											SynchronizedRef_update(
												mainState.flowChats,
												Array_append(x.newChat),
											),
									}),
								),
							),
						))
				}),
			appendChatMessage = flip(chat =>
				Effect_flatMap(x =>
					Effect_sync(() => chat.querySelector("#content #message")?.append(x)),
				),
			),
			template = Effect_runPromise(
				Function_pipe(
					Effect_succeed(document.createElement("button")),
					Effect_tap(x =>
						Effect_sync(() =>
							x.classList.add("style-scope", "yt-icon-button", "fyc_button"),
						),
					),
					Effect_tap(x =>
						Effect_sync(() =>
							Object.assign(x.style, {
								padding: "0px",
								width: "20px",
								height: "20px",
								fill: "#fff",
							}),
						),
					),
					Effect_tap(x =>
						Effect_sync(() =>
							x.setAttribute("aria-label", "NGに入れる(Ban this user)"),
						),
					),
					Effect_tap(x =>
						Effect_sync(() => {
							const svg = document.createElementNS(
								"http://www.w3.org/2000/svg",
								"svg",
							)
							svg.setAttribute("class", "style-scope yt-icon")
							Object.assign(svg.style, {
								width: "100%",
								height: "75%",
								fill: "var(--yt-spec-text-secondary)",
							})
							svg.setAttribute("viewBox", "0 0 512 512")
							const path = document.createElementNS(
								"http://www.w3.org/2000/svg",
								"path",
							)
							path.setAttribute(
								"d",
								"M440 78A256 256 0 1 0 73 435 256 256 0 0 0 440 78zm-99 35L113 341C37 179 212 44 341 113zM177 405l228-228c76 162-99 297-228 228z",
							)
							path.setAttribute("fill-rule", "evenodd")
							svg.appendChild(path)
							x.appendChild(svg)
						}),
					),
				),
			),
			fromSemigroup = (S, empty) => ({
				combine: S.combine,
				combineMany: S.combineMany,
				empty,
				combineAll: collection => S.combineMany(empty, collection),
			}),
			Semigroup_make = (
				combine,
				combineMany = (self, collection) => {
					return ((b = self),
					(f = combine),
					function (iterable) {
						if (Array.isArray(iterable)) return iterable.reduce(f, b)
						let result = b
						for (const n of iterable) result = f(result, n)
						return result
					})(collection)
					var b, f
				},
			) => ({ combine, combineMany }),
			SemigroupEvery = Semigroup_make(
				(self, that) => self && that,
				(self, collection) => {
					if (!1 === self) return !1
					for (const b of collection) if (!1 === b) return !1
					return !0
				},
			),
			SemigroupSome = Semigroup_make(
				(self, that) => self || that,
				(self, collection) => {
					if (!0 === self) return !0
					for (const b of collection) if (!0 === b) return !0
					return !1
				},
			),
			MonoidEvery = fromSemigroup(SemigroupEvery, !0),
			MonoidSome = fromSemigroup(SemigroupSome, !1),
			filter_filterOperators = {
				flip,
				flow: fns => x => Function_pipe(x, ...fns),
				and: MonoidEvery.combineAll,
				or: MonoidSome.combineAll,
				A: { some: Array_some, getSomes: Array_getSomes },
				O: { exists },
				inText: text => x => {
					return ((searchString = x),
					self => self.includes(searchString, void 0))(text)
					var searchString
				},
				eqText: text => x => text === x,
				matchedByText: text => x => isTruthy(text.match(RegExp(x, "u"))),
			},
			setChatFieldSimplifyStyle = chat =>
				Effect_gen(function* () {
					chat.querySelector(
						".style-scope.yt-live-chat-paid-message-renderer",
					) ||
						(yield* Function_pipe(
							[
								"#author-photo",
								"yt-live-chat-author-chip.style-scope.yt-live-chat-text-message-renderer",
							],
							Array_map(x => fromNullable(chat.querySelector(x))),
							Array_getSomes,
							Array_map(x =>
								Effect_sync(() => {
									x.style.display = "none"
								}),
							),
							Array_append(
								Effect_sync(() => {
									chat.style.borderBottom =
										"1px solid var(--yt-spec-text-secondary)"
								}),
							),
							Effect_all,
						))
				}),
			strictOptionEquivalence =
				((isEquivalent = strict()),
				Equivalence_make((x, y) =>
					Option_isNone(x)
						? Option_isNone(y)
						: !Option_isNone(y) && isEquivalent(x.value, y.value),
				)),
			allStream = provideLog =>
				(function (ab, bc, cd, de, ef, fg, gh, hi, ij) {
					switch (arguments.length) {
						case 1:
							return ab
						case 2:
							return function () {
								return bc(ab.apply(this, arguments))
							}
						case 3:
							return function () {
								return cd(bc(ab.apply(this, arguments)))
							}
						case 4:
							return function () {
								return de(cd(bc(ab.apply(this, arguments))))
							}
						case 5:
							return function () {
								return ef(de(cd(bc(ab.apply(this, arguments)))))
							}
						case 6:
							return function () {
								return fg(ef(de(cd(bc(ab.apply(this, arguments))))))
							}
						case 7:
							return function () {
								return gh(fg(ef(de(cd(bc(ab.apply(this, arguments)))))))
							}
						case 8:
							return function () {
								return hi(gh(fg(ef(de(cd(bc(ab.apply(this, arguments))))))))
							}
						case 9:
							return function () {
								return ij(hi(gh(fg(ef(de(cd(bc(ab.apply(this, arguments)))))))))
							}
					}
				})(
					ctx =>
						Effect_gen(function* () {
							const live = makePageState(livePageYt)
							return {
								...ctx,
								live,
								...Function_pipe(
									new external_rxjs_namespaceObject.BehaviorSubject(
										new DOMRectReadOnly(0, 0, 660, 395),
									),
									settingsRectSubject => ({
										settingsRectSubject,
										tapUpdateSettingsRect: ob =>
											(0, external_rxjs_namespaceObject.switchMap)(value => {
												return Function_pipe(
													settingsRectSubject,
													(0, external_rxjs_namespaceObject.first)(),
													(0, external_rxjs_namespaceObject.map)(
														((toggleSettingsElement =
															ctx.apps.toggleSettingsPanelApp.node),
														nextSettingsRect => last =>
															Function_pipe(
																Effect_succeed(toggleSettingsElement),
																Effect_filterOrFail(
																	x => null !== x.offsetParent,
																),
																Effect_map(x => x.getBoundingClientRect()),
																Effect_map(
																	x =>
																		new DOMRectReadOnly(
																			Math.max(
																				0,
																				x.right + window.scrollX - 660,
																			),
																			Math.max(0, x.y + window.scrollY - 395),
																			660,
																			Math.min(x.y + window.scrollY, 395),
																		),
																),
																Effect_orElseSucceed(
																	() =>
																		new DOMRectReadOnly(-660, -395, 660, 395),
																),
																Effect_filterOrFail(
																	x =>
																		x.x !== last.x ||
																		x.y !== last.y ||
																		x.width !== last.width ||
																		x.height !== last.height,
																),
																Effect_tap(nextSettingsRect),
																Effect_ignore,
															))(rect =>
															Effect_sync(() => settingsRectSubject.next(rect)),
														),
													),
													tapEffect(provideLog),
													(0, external_rxjs_namespaceObject.map)(() => value),
												)
												var toggleSettingsElement
											})(ob),
									}),
								),
								config$: configStream(
									provideLog,
									ctx.mainState,
									ctx.co,
									ctx.chatScreen,
									live,
								),
								css: yield* mainCss,
								documentMutationPair: yield* observePair(MutationObserver),
								chatMutationPair: yield* observePair(MutationObserver),
								playerResizePair: yield* observePair(ResizeObserver),
								bodyResizePair: yield* observePair(ResizeObserver),
								liveElementKeys: Object.keys(live),
							}
						}),
					Effect_map(c =>
						Function_pipe(
							c.reinitSubject,
							(0, external_rxjs_namespaceObject.observeOn)(
								external_rxjs_namespaceObject.asyncScheduler,
							),
							Function_pipe(Duration_millis(100), initDelay =>
								(0, external_rxjs_namespaceObject.delay)(toMillis(initDelay)),
							),
							tapEffect(() => provideLog(Effect_logInfo("Init"))),
							(0, external_rxjs_namespaceObject.switchMap)(() =>
								Function_pipe(
									Duration_millis(700),
									changeDetectInterval =>
										(0, external_rxjs_namespaceObject.interval)(
											toMillis(changeDetectInterval),
										),
									c.tapUpdateSettingsRect,
									(0, external_rxjs_namespaceObject.concatMap)(index =>
										Function_pipe(
											(0, external_rxjs_namespaceObject.from)(
												Effect_runPromise(
													provideLog(
														Function_pipe(
															Effect_succeed(c.liveElementKeys),
															Effect_flatMap(
																Effect_forEach(key =>
																	c.live[key].read.pipe(
																		Effect_option,
																		Effect_flatMap(
																			liftPredicate(
																				newEle =>
																					!strictOptionEquivalence(
																						c.live[key].ele,
																						newEle,
																					),
																			),
																		),
																		Effect_tap(x =>
																			Effect_sync(() => {
																				c.live[key].ele = x
																			}),
																		),
																		Effect_map(Option_isSome),
																		Effect_map(
																			x => `${key} ${x ? "found" : "lost"}`,
																		),
																		Effect_flatMap(Effect_logDebug),
																		Effect_isSuccess,
																	),
																),
															),
															Effect_map(Array_some(Function_identity)),
														),
													),
												),
											),
											(0, external_rxjs_namespaceObject.filter)(
												Function_identity,
											),
											(0, external_rxjs_namespaceObject.map)(() => index),
										),
									),
									(0, external_rxjs_namespaceObject.startWith)(0),
								),
							),
							tapEffect(() =>
								provideLog(
									Function_pipe(
										Effect_logDebug("Loading..."),
										Effect_zipRight(
											Effect_sync(() => {
												;[
													c.documentMutationPair,
													c.chatMutationPair,
													c.playerResizePair,
													c.bodyResizePair,
												].forEach(pair => {
													pair.observer.disconnect()
												})
												c.documentMutationPair.observer.observe(document, {
													childList: !0,
													subtree: !0,
												})
												document.head.append(c.css)
											}),
										),
										Effect_zipRight(
											Effect_allSuccesses([
												...Array_map(
													[c.live.chatField.ele, c.live.chatTicker.ele],
													Effect_flatMap(x =>
														Effect_sync(() =>
															c.chatMutationPair.observer.observe(x, {
																childList: !0,
															}),
														),
													),
												),
												c.live.player.ele.pipe(
													Effect_flatMap(element =>
														Function_pipe(
															Effect_succeed(element),
															Effect_tap(x =>
																Effect_sync(() =>
																	c.playerResizePair.observer.observe(x),
																),
															),
															Effect_flatMap(x =>
																Effect_sync(() => x.prepend(c.chatScreen)),
															),
														),
													),
												),
												c.live.toggleChatBtnParent.ele.pipe(
													Effect_flatMap(x =>
														Effect_sync(() =>
															x.prepend(c.apps.toggleChatButtonApp.node),
														),
													),
												),
												c.live.settingsToggleNextElement.ele.pipe(
													Effect_flatMap(x =>
														Effect_sync(() =>
															x.before(c.apps.toggleSettingsPanelApp.node),
														),
													),
													Effect_orElse(() =>
														c.live.toggleChatBtnParent.ele.pipe(
															Effect_flatMap(() =>
																Effect_sync(() =>
																	c.apps.toggleChatButtonApp.node.before(
																		c.apps.toggleSettingsPanelApp.node,
																	),
																),
															),
														),
													),
												),
												c.live.settingsContainer.ele.pipe(
													Effect_flatMap(x =>
														Effect_sync(() =>
															x.append(c.apps.settingsApp.node),
														),
													),
												),
												Function_pipe(
													document.body,
													Effect_fromNullable,
													Effect_flatMap(x =>
														Effect_sync(() =>
															c.bodyResizePair.observer.observe(x),
														),
													),
												),
												c.live.video.ele.pipe(
													Effect_filterOrElse(
														x => !x.paused,
														() => c.live.offlineSlate.ele,
													),
													Effect_isSuccess,
													Effect_flatMap(x =>
														SynchronizedRef_set(c.mainState.chatPlaying, x),
													),
												),
											]),
										),
									),
								),
							),
							(0, external_rxjs_namespaceObject.switchMap)(() => {
								return (0, external_rxjs_namespaceObject.merge)(
									Function_pipe(
										(0, external_rxjs_namespaceObject.fromEvent)(
											c.channel,
											"message",
										),
										(0, external_rxjs_namespaceObject.map)(([key, val]) =>
											Function_pipe(
												src_listeningBroadcastConfigKeys.includes(key),
												x =>
													x
														? c.setChangedConfig[key](val)
														: Effect_sync(() => {}),
											),
										),
										tapEffect(provideLog),
									),
									...Function_pipe(
										configKeys,
										Array_map(key =>
											Function_pipe(
												c.co[key],
												(0, external_rxjs_namespaceObject.startWith)(
													c.mainState.config.value[key],
												),
												(0, external_rxjs_namespaceObject.bufferCount)(2, 1),
												(0, external_rxjs_namespaceObject.map)(([x, y]) =>
													(0, external_DeepDiff_namespaceObject.diff)(x, y),
												),
												(0, external_rxjs_namespaceObject.map)(x =>
													Effect_logDebug(
														`Config ${key}: ${JSON.stringify(x, void 0, 2)}`,
													),
												),
												tapEffect(provideLog),
											),
										),
									),
									c.config$,
									c.live.video.ele.pipe(
										match({
											onNone: () => external_rxjs_namespaceObject.EMPTY,
											onSome: element => {
												return Function_pipe(
													((video = element),
													Function_pipe(
														[["playing"], ["waiting", "pause"]],
														Array_map((x, i) => [x, 0 === i]),
														Array_flatMap(([xs, b]) =>
															Function_pipe(
																xs,
																Array_map(x => [x, b]),
															),
														),
														Array_map(([x, b]) =>
															Function_pipe(
																(0, external_rxjs_namespaceObject.fromEvent)(
																	video,
																	x,
																),
																(0, external_rxjs_namespaceObject.map)(() => b),
															),
														),
														x => (0, external_rxjs_namespaceObject.merge)(...x),
													)),
													(0, external_rxjs_namespaceObject.map)(
														playing =>
															playing || Option_isSome(c.live.offlineSlate.ele),
													),
													(0, external_rxjs_namespaceObject.map)(chatPlaying =>
														Function_pipe(
															SynchronizedRef_set(
																c.mainState.chatPlaying,
																chatPlaying,
															),
															Effect_zipRight(
																Function_pipe(
																	SynchronizedRef_get(c.mainState.flowChats),
																	Effect_map(Array_map(setChatPlayState)),
																	Effect_flatMap(
																		Effect_forEach(apply(c.mainState)),
																	),
																),
															),
														),
													),
													tapEffect(provideLog),
												)
												var video
											},
										}),
									),
									Function_pipe(
										c.chatMutationPair.subject,
										(0, external_rxjs_namespaceObject.map)(
											((chatScrn = c.chatScreen),
											(mainState = c.mainState),
											records =>
												Function_pipe(
													Effect_succeed(records),
													Effect_map(
														Array_flatMap(e => Array.from(e.addedNodes)),
													),
													Effect_map(Array_filter(x => x.children.length > 0)),
													Effect_map(Array_reverse),
													Effect_flatMap(
														Effect_forEach(chat =>
															Effect_gen(function* () {
																yield* Effect_logDebug("Chat detected")
																const data = (chat => {
																	const chatType = chat.querySelector(
																			".yt-live-chat-ticker-paid-message-item-renderer",
																		)
																			? "ticker"
																			: chat.querySelector(
																						".yt-live-chat-membership-item-renderer",
																				  )
																				? "membership"
																				: chat.querySelector(
																							".yt-live-chat-viewer-engagement-message-renderer",
																					  )
																					? "engagement"
																					: "normal",
																		paymentInfo = Function_pipe(
																			"ticker" === chatType ||
																				null !== chat.querySelector("#card"),
																			isPaid =>
																				fromNullable(
																					isPaid
																						? chat.querySelector(
																								join(", ")([
																									"#purchase-amount",
																									"#purchase-amount-chip",
																									"#content>#text",
																								]),
																							)?.textContent
																						: void 0,
																				),
																		),
																		messageElement = fromNullable(
																			chat.querySelector("#message"),
																		),
																		isPaidNormal =
																			Option_isSome(paymentInfo) &&
																			isTruthy(
																				chat.querySelector(
																					".yt-live-chat-paid-message-renderer",
																				),
																			),
																		isPaidSticker =
																			Option_isSome(paymentInfo) &&
																			!isPaidNormal &&
																			isTruthy(
																				chat.querySelector(
																					".yt-live-chat-paid-sticker-renderer",
																				),
																			),
																		visibleBackgroundColor = element =>
																			Function_pipe(
																				window
																					.getComputedStyle(element)
																					.getPropertyValue("background-color"),
																				liftPredicate(
																					x =>
																						"transparent" !== x &&
																						"rgba(0, 0, 0, 0)" !== x,
																				),
																			)
																	return {
																		chatType,
																		authorType: chat.querySelector(".owner")
																			? "owner"
																			: chat.querySelector(".moderator")
																				? "moderator"
																				: chat.querySelector(".member")
																					? "member"
																					: "normal",
																		authorID: Function_pipe(
																			chat
																				.querySelector(
																					join(" ")(["#author-photo", "img"]),
																				)
																				?.src.match(
																					/ggpht\.com\/(ytc\/)?(.*)=/,
																				),
																			authorPhotoMatches =>
																				fromNullable(
																					authorPhotoMatches?.at(-1),
																				),
																		),
																		authorName: fromNullable(
																			chat.querySelector("#author-name")
																				?.textContent,
																		),
																		timestamp: fromNullable(
																			chat.querySelector("#timestamp")
																				?.textContent,
																		),
																		messageElement,
																		message: Function_pipe(
																			messageElement,
																			map(x => x.innerHTML),
																		),
																		messageText: Function_pipe(
																			messageElement,
																			map(x => x.textContent ?? ""),
																		),
																		paymentInfo,
																		textColor: isPaidNormal
																			? Function_pipe(
																					fromNullable(
																						chat.querySelector("#header"),
																					),
																					flatMap(visibleBackgroundColor),
																					orElse(() =>
																						Function_pipe(
																							fromNullable(
																								chat.querySelector("#card"),
																							),
																							flatMap(visibleBackgroundColor),
																						),
																					),
																					orElse(() =>
																						Function_pipe(
																							fromNullable(
																								chat.querySelector("#content"),
																							),
																							flatMap(visibleBackgroundColor),
																						),
																					),
																				)
																			: isPaidSticker
																				? Option_some(
																						window
																							.getComputedStyle(chat)
																							.getPropertyValue(
																								"--yt-live-chat-paid-sticker-chip-background-color",
																							),
																					)
																				: Option_none(),
																		paidColor: isPaidNormal
																			? Function_pipe(
																					fromNullable(
																						chat.querySelector("#content"),
																					),
																					flatMap(visibleBackgroundColor),
																					orElse(() =>
																						Function_pipe(
																							fromNullable(
																								chat.querySelector("#card"),
																							),
																							flatMap(visibleBackgroundColor),
																						),
																					),
																					orElse(() =>
																						Function_pipe(
																							fromNullable(
																								chat.querySelector("#header"),
																							),
																							flatMap(visibleBackgroundColor),
																						),
																					),
																				)
																			: isPaidSticker
																				? Option_some(
																						window
																							.getComputedStyle(chat)
																							.getPropertyValue(
																								"--yt-live-chat-paid-sticker-background-color",
																							),
																					)
																				: Option_none(),
																	}
																})(chat)
																;(yield* ((data, config) =>
																	Function_pipe(
																		Effect_succeed(data),
																		Effect_filterOrFail(x =>
																			a(
																				config.filterExp,
																				(data => ({
																					...filter_filterOperators,
																					authorName: data.authorName,
																					message: data.message,
																					messageText: data.messageText,
																					paymentInfo: data.paymentInfo,
																					authorID: data.authorID,
																				}))(x),
																			),
																		),
																		Effect_map(x => [x.message, x.paymentInfo]),
																		Effect_flatMap(
																			Effect_forEach(
																				Effect_orElse(() => Effect_succeed("")),
																			),
																		),
																		Effect_map(JSON.stringify),
																		Effect_flatMap(x =>
																			Effect_logDebug(`Filtered: ${x}`),
																		),
																		Effect_isSuccess,
																	))(data, mainState.config.value))
																	? (chat.style.display = "none")
																	: yield* Effect_all(
																			[
																				Function_pipe(
																					addFlowChat(
																						data,
																						chatScrn,
																						mainState,
																					),
																					Effect_when(
																						Function_pipe(
																							yield* SynchronizedRef_get(
																								mainState.flowChats,
																							),
																							flowChats => () =>
																								mainState.config.value
																									.createChats &&
																								"normal" === data.chatType &&
																								!Array_some(
																									flowChats,
																									x =>
																										Either_isRight(
																											x.animationState,
																										) &&
																										strictOptionEquivalence(
																											x.data.authorID,
																											data.authorID,
																										) &&
																										strictOptionEquivalence(
																											x.data.messageText,
																											data.messageText,
																										) &&
																										strictOptionEquivalence(
																											x.data.timestamp,
																											data.timestamp,
																										),
																								),
																						),
																					),
																				),
																				data.authorID.pipe(
																					filter(
																						() =>
																							mainState.config.value
																								.createBanButton &&
																							!chat.children.namedItem("card"),
																					),
																					Effect_flatMap(x => {
																						return appendChatMessage(
																							((id = x),
																							getConfig => setConfig => chat =>
																								Function_pipe(
																									getConfig.bannedUsers,
																									Effect_filterOrFail(
																										x => !x.includes(id),
																									),
																									Effect_map(x =>
																										Function_pipe(
																											dedupeWith(
																												x,
																												String_Equivalence,
																											),
																											Array_append(id),
																										),
																									),
																									Effect_flatMap(x =>
																										Function_pipe(
																											setConfig.bannedUsers(x),
																										),
																									),
																									Effect_ignore,
																									Effect_zipRight(
																										Effect_sync(() => {
																											chat.style.display =
																												"none"
																										}),
																									),
																									onclick =>
																										Function_pipe(
																											Effect_promise(
																												() => template,
																											),
																											Effect_map(x =>
																												x.cloneNode(!0),
																											),
																											Effect_tap(x =>
																												Effect_sync(() => {
																													x.onclick = () =>
																														Effect_runPromise(
																															onclick,
																														)
																												}),
																											),
																										),
																								))(mainState.config.getConfig)(
																								mainState.config.setConfig,
																							)(chat),
																						)(chat)
																						var id
																					}),
																					Effect_zipLeft(
																						Effect_logDebug("Ban button added"),
																					),
																				),
																				Function_pipe(
																					setChatFieldSimplifyStyle(chat),
																					Effect_when(
																						() =>
																							mainState.config.value
																								.simplifyChatField,
																					),
																					Effect_zipLeft(
																						Effect_logDebug("Chat simplified"),
																					),
																				),
																			],
																			{ mode: "either" },
																		)
															}),
														),
													),
												)),
										),
										tapEffect(provideLog),
									),
									Function_pipe(
										c.documentMutationPair.subject,
										(0, external_rxjs_namespaceObject.map)(
											() => window.location.href,
										),
										(0, external_rxjs_namespaceObject.distinctUntilChanged)(),
										(0, external_rxjs_namespaceObject.skip)(1),
										c.tapUpdateSettingsRect,
										(0, external_rxjs_namespaceObject.map)(x =>
											Effect_all([
												Effect_logDebug(`URL Changed: ${x}`),
												removeOldChats(c.mainState.flowChats)(0),
											]),
										),
										tapEffect(provideLog),
										Function_pipe(Duration_millis(1700), urlDelay =>
											(0, external_rxjs_namespaceObject.delay)(
												toMillis(urlDelay),
											),
										),
										tapEffect(() => c.reinitialize),
									),
									Function_pipe(
										c.playerResizePair.subject,
										(0, external_rxjs_namespaceObject.throttleTime)(
											500,
											void 0,
											{ leading: !0, trailing: !0 },
										),
										(0, external_rxjs_namespaceObject.startWith)([]),
										(0, external_rxjs_namespaceObject.map)(() =>
											c.live.player.ele.pipe(
												map(x => x.getBoundingClientRect()),
												match({
													onNone: () => _void,
													onSome: x => {
														return (
															(rect = x),
															(mainState = c.mainState),
															Function_pipe(
																Effect_succeed(rect),
																Effect_tap(x =>
																	Effect_logDebug(
																		`Resize [${x.width.toFixed(1)}, ${x.height.toFixed(1)}]`,
																	),
																),
																Effect_flatMap(r =>
																	SynchronizedRef_set(mainState.playerRect, r),
																),
																Effect_zipRight(
																	SynchronizedRef_get(mainState.flowChats),
																),
																Effect_flatMap(
																	Effect_forEach(x =>
																		Effect_all([
																			renderChat(x)(mainState),
																			Effect_ignore(
																				setChatAnimation(x)(mainState),
																			),
																		]),
																	),
																),
															)
														)
														var rect, mainState
													},
												}),
											),
										),
										tapEffect(provideLog),
									),
									Function_pipe(
										c.bodyResizePair.subject,
										Function_pipe(
											Duration_millis(300),
											bodyResizeDetectInterval =>
												(0, external_rxjs_namespaceObject.throttleTime)(
													toMillis(bodyResizeDetectInterval),
													void 0,
													{ leading: !0, trailing: !0 },
												),
										),
										(0, external_rxjs_namespaceObject.startWith)([]),
										c.tapUpdateSettingsRect,
									),
									Function_pipe(
										c.settingsRectSubject,
										tapEffect(panelRect =>
											c.updateSettingState(s => ({ ...s, panelRect })),
										),
									),
								)
								var chatScrn, mainState
							}),
							(0, external_rxjs_namespaceObject.retry)({
								delay: e =>
									Function_pipe(
										(0, external_rxjs_namespaceObject.of)(e),
										tapEffect(() =>
											provideLog(
												logWithMeta(LogLevel_Error)(`Errored: ${e}`)(e),
											),
										),
										Function_pipe(Duration_millis(5e3), errorRetryInterval =>
											(0, external_rxjs_namespaceObject.delay)(
												toMillis(errorRetryInterval),
											),
										),
										tapEffect(() => c.reinitialize),
									),
							}),
						),
					),
				),
			defaultFilter = config =>
				external_jsep_default()(
					`\nor([\nA.some(\n  flip(flow([inText, A.some]))(${JSON.stringify(config.bannedWords)})\n)(A.getSomes([\n  messageText,\n  paymentInfo\n])),\nA.some(\n  flip(flow([matchedByText, A.some]))(${JSON.stringify(config.bannedWordRegexes)})\n)(A.getSomes([\n  messageText,\n  paymentInfo\n])),\nO.exists(\n  flip(flow([eqText, A.some]))(${JSON.stringify(config.bannedUsers)})\n)(authorID)\n])\n`,
				),
			makeChatScreen = Function_pipe(
				Effect_sync(() => document.createElement("div")),
				Effect_tap(x =>
					Effect_sync(() =>
						Object.assign(x.style, {
							pointerEvents: "none",
							zIndex: "30",
							position: "absolute",
							overflow: "hidden",
							height: "100%",
							width: "100%",
						}),
					),
				),
			),
			Editable_of = x => [x, Option_none()],
			fromValueText = v => t => [v, Option_some([t, Option_none()])],
			Editable_value = getFirst,
			Editable_text = x => Function_pipe(getSecond(x), map(getFirst)),
			Editable_error = x => Function_pipe(getSecond(x), flatMap(getSecond)),
			setValue = v => Function_pipe(constant(v), x => mapFirst(x)),
			setText = x =>
				mapSecond(snd =>
					snd.pipe(
						map(mapFirst(constant(x))),
						orElse(constant(Option_some([x, Option_none()]))),
					),
				),
			hasError = x => Option_isSome(Editable_error(x)),
			exceptions = ["timingFunction", "lang"],
			isEditable = k => v =>
				("number" == typeof v ||
					"string" == typeof v ||
					(Array.isArray(v) && ("string" == typeof v[0] || 0 === v.length))) &&
				!Array_some(x => x === k)(exceptions),
			RefinedConstructorsTypeId = Symbol.for("effect/Brand/Refined")
		var isEquivalent
		const nominal = () =>
				Object.assign(args => args, {
					[RefinedConstructorsTypeId]: RefinedConstructorsTypeId,
					option: args => Option_some(args),
					either: args => Either_right(args),
					is: _args => !0,
				}),
			external_LZString_namespaceObject = LZString,
			makeCompressedLogBlock = nominal(),
			makeLog = nominal(),
			decompressBlock = x =>
				Function_pipe(
					(0, external_LZString_namespaceObject.decompressFromUTF16)(x),
					JSON.parse,
				),
			importLog = s =>
				makeLog(
					Function_pipe(
						"<" === s[0] ? s.slice(5, -6) : s,
						x => JSON.parse(x),
						log => ({
							nextId: log.nextId,
							...Function_pipe(
								log.blocks,
								Array_map(
									external_LZString_namespaceObject.decompressFromEncodedURIComponent,
								),
								matchRight({
									onEmpty: () => ({ compressedBlocks: [], lastBlock: [] }),
									onNonEmpty: (init, last) => ({
										compressedBlocks: Array_map(init, x =>
											Function_pipe(
												(0, external_LZString_namespaceObject.compressToUTF16)(
													x,
												),
												makeCompressedLogBlock,
											),
										),
										lastBlock: JSON.parse(last),
									}),
								}),
							),
						}),
					),
				),
			makeComponent = x => tag => ({ tag, view: x(tag) }),
			node_option = (value, label, selected) =>
				h("option", { value, selected }, hyperapp_text(label)),
			tabContainer = style => ontabSelect => labels => tabs => mainTab =>
				h("div", { style: style.container }, [
					h(
						"div",
						{},
						Function_pipe(
							labels,
							Array_map((x, i) =>
								h(
									"span",
									{
										style: {
											...style.label,
											...(mainTab === i ? style.labelFocus : {}),
											display: "inline-block",
										},
										onpointerdown: [ontabSelect, i],
									},
									hyperapp_text(x),
								),
							),
						),
					),
					h(
						"div",
						{
							style: {
								...style.tab,
								overflow: "auto",
								boxSizing: "border-box",
							},
						},
						Function_pipe(
							tabs,
							Array_get(mainTab),
							match({ onNone: () => {}, onSome: x => x() }),
						),
					),
				]),
			defaultText = {
				setting: ["Settings", "設定", "设置"],
				font: ["Font", "フォント", "字体"],
				color: ["Color(Normal)", "色(通常)", "颜色（正常）"],
				ownerColor: ["Color(Owner)", "色(オーナー)", "颜色（主人）"],
				moderatorColor: [
					"Color(Moderator)",
					"色(モデレーター)",
					"颜色（管理员）",
				],
				memberColor: ["Color(Member)", "色(メンバー)", "颜色（成员）"],
				feedback: ["Feedback", "バグ報告と要望", "反馈"],
				eventLog: ["Event log", "イベントログ", "事件日志"],
				giveFeedback: [
					"Give your feedbacks here(Please attach the event log for bug reports)",
					"バグ報告、要望はこちら(バグの場合は、イベントログを添付してください)",
					"在此处提供您的反馈（如报告错误,请附上事件日志）",
				],
				chatOpacity: ["Opacity", "不透明度", "不透明度"],
				fontSize: ["Size", "サイズ", "字体大小"],
				fontWeight: ["Weight", "太さ", "字体粗细"],
				shadowFontWeight: ["Shadow Weight", "影の太さ", "阴影粗细"],
				flowSpeed: ["Speed", "速度", "弹幕速度"],
				maxChatCount: ["Max number of chats", "最大表示数", "最大聊天数量"],
				maxChatLength: ["Max number of characters", "最大文字数", "最大字符数"],
				laneCount: ["Number of rows", "行数", "行数"],
				bannedWords: ["Banned Words", "NGワード", "屏蔽词"],
				bannedWordRegexes: [
					"Banned Words(Regex)",
					"NGワード(正規表現)",
					"屏蔽词（正则表达式）",
				],
				bannedUsers: ["Banned Users", "NGユーザー", "屏蔽用户"],
				simplifyChatField: ["Simplify", "簡略化する", "简化聊天栏"],
				createBanButton: [
					"Show ban button",
					"NGボタンを表示する",
					"显示屏蔽按钮",
				],
				displayModName: [
					"Show moderator's name",
					"モデレーターの名前を表示する",
					"显示管理员姓名",
				],
				displaySuperChatAuthor: [
					"Show super chat author",
					"スパチャの作成者を表示する",
					"显示超级留言作者",
				],
				createChats: ["Create flowing chats", "チャットを流す", "创建弹幕"],
				textOnly: [
					"Text only(ignore emojis)",
					"文字のみ(絵文字を無視する)",
					"仅文本（忽略表情符号）",
				],
				error: ["Error", "エラー", "错误"],
				video: ["Video", "画面", "视频"],
				chatField: ["Chat Window", "チャット欄", "聊天窗口"],
				useStepTiming: [
					"Move chat in steps",
					"チャットを段階的に動かす",
					"按步骤移动弹幕",
				],
				timingStepCount: ["└Step Count", "└段階数", "└步骤数"],
				chatFilter: ["Chat Filter", "チャットフィルター", "聊天过滤器"],
				flowChat: ["Flow Chat", "チャット流れ", "聊天弹幕"],
				clearFlowChats: [
					"Clear Flowing Chats",
					"流れるチャットをクリアする",
					"清除弹幕",
				],
				flowNewChatIf: [
					"A new chat will appear if all of the followings are met:",
					"新しいチャットは以下のすべてを満たす場合に流れます：",
					"如果满足以下所有条件，新弹幕会出现：",
				],
				noOverlap: [
					"└Chats won't overlap",
					"└他のチャットと重ならない",
					"└弹幕不会重叠",
				],
				minSpacing: [
					"Min spacing between chats",
					"チャットの最小間隔",
					"弹幕间的最小间距",
				],
				fieldScale: ["Scale", "拡大率", "缩放比例"],
				copy: ["Copy", "コピーする", "复制"],
				showChats: ["Show chats", "チャットを表示する", "显示弹幕"],
				hideChats: ["Hide chats", "チャットを非表示にする", "隐藏弹幕"],
				flowY1: ["Flow area top edge", "流れ範囲の上端", "显示区域上边缘"],
				flowY2: ["Flow area bottom edge", "流れ範囲の下端", "显示区域下边缘"],
				flowX1: ["Flow area left edge", "流れ範囲の左端", "显示区域左边缘"],
				flowX2: ["Flow area right edge", "流れ範囲の右端", "显示区域右边缘"],
				shadowColor: ["Shadow Color", "影の色", "阴影颜色"],
				invalidColor: ["Invalid color", "無効な色", "无效颜色"],
				inputNonNumberic: [
					"Input isn't a number",
					"入力値が数字でない",
					"输入值非数字",
				],
				invalidSetting: ["Invalid setting", "無効な設定値", "无效的设置值"],
				logEvents: [
					"Enable event logging",
					"イベントログを有効にする",
					"启用事件日志",
				],
				importLog: [
					"Import event log",
					"イベントログを取り込む",
					"导入事件日志",
				],
			},
			getText = key => state =>
				Function_pipe(
					languages,
					findFirstIndex(x => x === state.lang),
					map(x => Array_unsafeGet(defaultText[key], x)),
					getOrElse(() => "Error"),
				),
			languageLabels = ["English(US)", "日本語", "简体中文"],
			panelBoxStyle = width => ({
				flex: `0 0 ${width}px`,
				width: `${width}px`,
				margin: "2px",
			}),
			computed = {
				useStepTiming: s => isTruthy(s.timingFunction.match(/^steps\(.+/)),
			},
			getState = k => (k in computed ? computed[k] : s => s[k]),
			Data_Error = (function () {
				return class extends YieldableError {
					constructor(args) {
						super(args?.message, args?.cause ? { cause: args.cause } : void 0)
						args && Object.assign(this, args)
					}
				}
			})(),
			Data_TaggedError = tag => {
				class Base extends Data_Error {
					_tag = tag
				}
				Base.prototype.name = tag
				return Base
			},
			getKeysForIndexSignature = (input, parameter) => {
				switch (parameter._tag) {
					case "StringKeyword":
					case "TemplateLiteral":
						return Object.keys(input)
					case "SymbolKeyword":
						return Object.getOwnPropertySymbols(input)
					case "Refinement":
						return getKeysForIndexSignature(input, parameter.from)
				}
			},
			util_ownKeys = o =>
				Object.keys(o).concat(Object.getOwnPropertySymbols(o)),
			memoizeThunk = f => {
				let a,
					done = !1
				return () => {
					if (done) return a
					a = f()
					done = !0
					return a
				}
			},
			formatUnknown = u => {
				if (isString(u)) return JSON.stringify(u)
				if (
					isNumber(u) ||
					null == u ||
					Predicate_isBoolean(u) ||
					isSymbol(u) ||
					u instanceof Date
				)
					return String(u)
				if (isBigInt(u)) return String(u) + "n"
				if (
					!isArray(u) &&
					Predicate_hasProperty(u, "toString") &&
					Predicate_isFunction(u.toString) &&
					u.toString !== Object.prototype.toString
				)
					return u.toString()
				try {
					JSON.stringify(u)
					return isArray(u)
						? `[${u.map(formatUnknown).join(",")}]`
						: `{${util_ownKeys(u)
								.map(
									k =>
										`${isString(k) ? JSON.stringify(k) : String(k)}:${formatUnknown(u[k])}`,
								)
								.join(",")}}`
				} catch (e) {
					return String(u)
				}
			},
			util_isNonEmpty = x => Array.isArray(x),
			formatPathKey = key => {
				return `[${((name = key), "string" == typeof name ? JSON.stringify(name) : String(name))}]`
				var name
			},
			formatPath = path =>
				util_isNonEmpty(path)
					? path.map(formatPathKey).join("")
					: formatPathKey(path),
			getErrorMessage = (reason, details, path, ast) => {
				let out = reason
				path &&
					isNonEmptyReadonlyArray(path) &&
					(out += `\nat path: ${formatPath(path)}`)
				void 0 !== details && (out += `\ndetails: ${details}`)
				ast && (out += `\nschema (${ast._tag}): ${ast}`)
				return out
			},
			getASTDuplicateIndexSignatureErrorMessage = type =>
				getErrorMessage("Duplicate index signature", `${type} index signature`),
			getASTIndexSignatureParameterErrorMessage = getErrorMessage(
				"Unsupported index signature parameter",
				"An index signature parameter type must be `string`, `symbol`, a template literal type or a refinement of the previous types",
			),
			getASTRequiredElementFollowinAnOptionalElementErrorMessage =
				getErrorMessage(
					"Invalid element",
					"A required element cannot follow an optional element. ts(1257)",
				),
			TypeAnnotationId = Symbol.for("@effect/schema/annotation/Type"),
			MessageAnnotationId = Symbol.for("@effect/schema/annotation/Message"),
			MissingMessageAnnotationId = Symbol.for(
				"@effect/schema/annotation/MissingMessage",
			),
			IdentifierAnnotationId = Symbol.for(
				"@effect/schema/annotation/Identifier",
			),
			TitleAnnotationId = Symbol.for("@effect/schema/annotation/Title"),
			DescriptionAnnotationId = Symbol.for(
				"@effect/schema/annotation/Description",
			),
			ExamplesAnnotationId = Symbol.for("@effect/schema/annotation/Examples"),
			DefaultAnnotationId = Symbol.for("@effect/schema/annotation/Default"),
			JSONSchemaAnnotationId = Symbol.for(
				"@effect/schema/annotation/JSONSchema",
			),
			DocumentationAnnotationId = Symbol.for(
				"@effect/schema/annotation/Documentation",
			),
			ConcurrencyAnnotationId = Symbol.for(
				"@effect/schema/annotation/Concurrency",
			),
			BatchingAnnotationId = Symbol.for("@effect/schema/annotation/Batching"),
			ParseIssueTitleAnnotationId = Symbol.for(
				"@effect/schema/annotation/ParseIssueTitle",
			),
			ParseOptionsAnnotationId = Symbol.for(
				"@effect/schema/annotation/ParseOptions",
			),
			SurrogateAnnotationId = Symbol.for("@effect/schema/annotation/Surrogate"),
			StableFilterAnnotationId = Symbol.for(
				"@effect/schema/annotation/StableFilter",
			),
			getAnnotation = Function_dual(2, (annotated, key) =>
				Object.prototype.hasOwnProperty.call(annotated.annotations, key)
					? Option_some(annotated.annotations[key])
					: Option_none(),
			),
			getMessageAnnotation = getAnnotation(MessageAnnotationId),
			getMissingMessageAnnotation = getAnnotation(MissingMessageAnnotationId),
			getTitleAnnotation = getAnnotation(TitleAnnotationId),
			getIdentifierAnnotation = getAnnotation(IdentifierAnnotationId),
			getDescriptionAnnotation = getAnnotation(DescriptionAnnotationId),
			getConcurrencyAnnotation = getAnnotation(ConcurrencyAnnotationId),
			getBatchingAnnotation = getAnnotation(BatchingAnnotationId),
			getParseIssueTitleAnnotation = getAnnotation(ParseIssueTitleAnnotationId),
			getParseOptionsAnnotation = getAnnotation(ParseOptionsAnnotationId),
			getSurrogateAnnotation = getAnnotation(SurrogateAnnotationId),
			getStableFilterAnnotation = getAnnotation(StableFilterAnnotationId),
			JSONIdentifierAnnotationId = Symbol.for(
				"@effect/schema/annotation/JSONIdentifier",
			),
			getJSONIdentifierAnnotation = getAnnotation(JSONIdentifierAnnotationId)
		class Declaration {
			typeParameters
			decodeUnknown
			encodeUnknown
			annotations
			_tag = "Declaration"
			constructor(
				typeParameters,
				decodeUnknown,
				encodeUnknown,
				annotations = {},
			) {
				this.typeParameters = typeParameters
				this.decodeUnknown = decodeUnknown
				this.encodeUnknown = encodeUnknown
				this.annotations = annotations
			}
			toString() {
				return getOrElse(getExpected(this), () => "<declaration schema>")
			}
			toJSON() {
				return {
					_tag: this._tag,
					typeParameters: this.typeParameters.map(ast => ast.toJSON()),
					annotations: toJSONAnnotations(this.annotations),
				}
			}
		}
		const createASTGuard = tag => ast => ast._tag === tag
		class Literal {
			literal
			annotations
			_tag = "Literal"
			constructor(literal, annotations = {}) {
				this.literal = literal
				this.annotations = annotations
			}
			toString() {
				return getOrElse(getExpected(this), () => formatUnknown(this.literal))
			}
			toJSON() {
				return {
					_tag: this._tag,
					literal: isBigInt(this.literal) ? String(this.literal) : this.literal,
					annotations: toJSONAnnotations(this.annotations),
				}
			}
		}
		const isLiteral = createASTGuard("Literal")
		class UniqueSymbol {
			symbol
			annotations
			_tag = "UniqueSymbol"
			constructor(symbol, annotations = {}) {
				this.symbol = symbol
				this.annotations = annotations
			}
			toString() {
				return getOrElse(getExpected(this), () => formatUnknown(this.symbol))
			}
			toJSON() {
				return {
					_tag: this._tag,
					symbol: String(this.symbol),
					annotations: toJSONAnnotations(this.annotations),
				}
			}
		}
		class NeverKeyword {
			annotations
			_tag = "NeverKeyword"
			constructor(annotations = {}) {
				this.annotations = annotations
			}
			toString() {
				return formatKeyword(this)
			}
			toJSON() {
				return {
					_tag: this._tag,
					annotations: toJSONAnnotations(this.annotations),
				}
			}
		}
		const neverKeyword = new NeverKeyword({ [TitleAnnotationId]: "never" })
		class UnknownKeyword {
			annotations
			_tag = "UnknownKeyword"
			constructor(annotations = {}) {
				this.annotations = annotations
			}
			toString() {
				return formatKeyword(this)
			}
			toJSON() {
				return {
					_tag: this._tag,
					annotations: toJSONAnnotations(this.annotations),
				}
			}
		}
		const unknownKeyword = new UnknownKeyword({
			[TitleAnnotationId]: "unknown",
		})
		class AnyKeyword {
			annotations
			_tag = "AnyKeyword"
			constructor(annotations = {}) {
				this.annotations = annotations
			}
			toString() {
				return formatKeyword(this)
			}
			toJSON() {
				return {
					_tag: this._tag,
					annotations: toJSONAnnotations(this.annotations),
				}
			}
		}
		const anyKeyword = new AnyKeyword({ [TitleAnnotationId]: "any" }),
			isStringKeyword = createASTGuard("StringKeyword"),
			isNumberKeyword = createASTGuard("NumberKeyword"),
			isSymbolKeyword = createASTGuard("SymbolKeyword")
		class Type {
			type
			annotations
			constructor(type, annotations = {}) {
				this.type = type
				this.annotations = annotations
			}
			toJSON() {
				return {
					type: this.type.toJSON(),
					annotations: toJSONAnnotations(this.annotations),
				}
			}
			toString() {
				return String(this.type)
			}
		}
		class OptionalType extends Type {
			isOptional
			constructor(type, isOptional, annotations = {}) {
				super(type, annotations)
				this.isOptional = isOptional
			}
			toJSON() {
				return {
					type: this.type.toJSON(),
					isOptional: this.isOptional,
					annotations: toJSONAnnotations(this.annotations),
				}
			}
			toString() {
				return String(this.type) + (this.isOptional ? "?" : "")
			}
		}
		const getRestASTs = rest => rest.map(annotatedAST => annotatedAST.type)
		class TupleType {
			elements
			rest
			isReadonly
			annotations
			_tag = "TupleType"
			constructor(elements, rest, isReadonly, annotations = {}) {
				this.elements = elements
				this.rest = rest
				this.isReadonly = isReadonly
				this.annotations = annotations
				let hasOptionalElement = !1,
					hasIllegalRequiredElement = !1
				for (const e of elements)
					if (e.isOptional) hasOptionalElement = !0
					else if (hasOptionalElement) {
						hasIllegalRequiredElement = !0
						break
					}
				if (
					hasIllegalRequiredElement ||
					(hasOptionalElement && rest.length > 1)
				)
					throw new Error(
						getASTRequiredElementFollowinAnOptionalElementErrorMessage,
					)
			}
			toString() {
				return getOrElse(getExpected(this), () => formatTuple(this))
			}
			toJSON() {
				return {
					_tag: this._tag,
					elements: this.elements.map(e => e.toJSON()),
					rest: this.rest.map(ast => ast.toJSON()),
					isReadonly: this.isReadonly,
					annotations: toJSONAnnotations(this.annotations),
				}
			}
		}
		const formatTuple = ast => {
			const formattedElements = ast.elements.map(String).join(", ")
			return matchLeft(ast.rest, {
				onEmpty: () => `readonly [${formattedElements}]`,
				onNonEmpty: (head, tail) => {
					const formattedHead = String(head),
						wrappedHead = formattedHead.includes(" | ")
							? `(${formattedHead})`
							: formattedHead
					if (tail.length > 0) {
						const formattedTail = tail.map(String).join(", ")
						return ast.elements.length > 0
							? `readonly [${formattedElements}, ...${wrappedHead}[], ${formattedTail}]`
							: `readonly [...${wrappedHead}[], ${formattedTail}]`
					}
					return ast.elements.length > 0
						? `readonly [${formattedElements}, ...${wrappedHead}[]]`
						: `ReadonlyArray<${formattedHead}>`
				},
			})
		}
		class PropertySignature extends OptionalType {
			name
			isReadonly
			constructor(name, type, isOptional, isReadonly, annotations) {
				super(type, isOptional, annotations)
				this.name = name
				this.isReadonly = isReadonly
			}
			toString() {
				return (
					(this.isReadonly ? "readonly " : "") +
					String(this.name) +
					(this.isOptional ? "?" : "") +
					": " +
					this.type
				)
			}
			toJSON() {
				return {
					name: String(this.name),
					type: this.type.toJSON(),
					isOptional: this.isOptional,
					isReadonly: this.isReadonly,
					annotations: toJSONAnnotations(this.annotations),
				}
			}
		}
		const isParameter = ast => {
			switch (ast._tag) {
				case "StringKeyword":
				case "SymbolKeyword":
				case "TemplateLiteral":
					return !0
				case "Refinement":
					return isParameter(ast.from)
			}
			return !1
		}
		class IndexSignature {
			type
			isReadonly
			parameter
			constructor(parameter, type, isReadonly) {
				this.type = type
				this.isReadonly = isReadonly
				if (!isParameter(parameter))
					throw new Error(getASTIndexSignatureParameterErrorMessage)
				this.parameter = parameter
			}
			toString() {
				return (
					(this.isReadonly ? "readonly " : "") +
					`[x: ${this.parameter}]: ${this.type}`
				)
			}
			toJSON() {
				return {
					parameter: this.parameter.toJSON(),
					type: this.type.toJSON(),
					isReadonly: this.isReadonly,
				}
			}
		}
		class TypeLiteral {
			annotations
			_tag = "TypeLiteral"
			propertySignatures
			indexSignatures
			constructor(propertySignatures, indexSignatures, annotations = {}) {
				this.annotations = annotations
				const keys = {}
				for (let i = 0; i < propertySignatures.length; i++) {
					const name = propertySignatures[i].name
					if (Object.prototype.hasOwnProperty.call(keys, name))
						throw new Error(
							getErrorMessage(
								"Duplicate property signature",
								`Duplicate key ${formatUnknown(name)}`,
							),
						)
					keys[name] = null
				}
				const parameters = { string: !1, symbol: !1 }
				for (let i = 0; i < indexSignatures.length; i++) {
					const parameter = getParameterBase(indexSignatures[i].parameter)
					if (isStringKeyword(parameter)) {
						if (parameters.string)
							throw new Error(
								getASTDuplicateIndexSignatureErrorMessage("string"),
							)
						parameters.string = !0
					} else if (isSymbolKeyword(parameter)) {
						if (parameters.symbol)
							throw new Error(
								getASTDuplicateIndexSignatureErrorMessage("symbol"),
							)
						parameters.symbol = !0
					}
				}
				this.propertySignatures = sortPropertySignatures(propertySignatures)
				this.indexSignatures = sortIndexSignatures(indexSignatures)
			}
			toString() {
				return getOrElse(getExpected(this), () => formatTypeLiteral(this))
			}
			toJSON() {
				return {
					_tag: this._tag,
					propertySignatures: this.propertySignatures.map(ps => ps.toJSON()),
					indexSignatures: this.indexSignatures.map(ps => ps.toJSON()),
					annotations: toJSONAnnotations(this.annotations),
				}
			}
		}
		const formatIndexSignatures = iss => iss.map(String).join("; "),
			formatTypeLiteral = ast => {
				if (ast.propertySignatures.length > 0) {
					const pss = ast.propertySignatures.map(String).join("; ")
					return ast.indexSignatures.length > 0
						? `{ ${pss}; ${formatIndexSignatures(ast.indexSignatures)} }`
						: `{ ${pss} }`
				}
				return ast.indexSignatures.length > 0
					? `{ ${formatIndexSignatures(ast.indexSignatures)} }`
					: "{}"
			},
			sortCandidates = sort(
				Order_mapInput(Number_Order, ast => {
					switch (ast._tag) {
						case "AnyKeyword":
							return 0
						case "UnknownKeyword":
							return 1
						case "ObjectKeyword":
							return 2
						case "StringKeyword":
						case "NumberKeyword":
						case "BooleanKeyword":
						case "BigIntKeyword":
						case "SymbolKeyword":
							return 3
					}
					return 4
				}),
			),
			literalMap = {
				string: "StringKeyword",
				number: "NumberKeyword",
				boolean: "BooleanKeyword",
				bigint: "BigIntKeyword",
			},
			AST_flatten = candidates =>
				Array_flatMap(candidates, ast =>
					isUnion(ast) ? AST_flatten(ast.types) : [ast],
				)
		class Union {
			types
			annotations
			static make = (candidates, annotations) => {
				const types = [],
					memo = new Set()
				for (let i = 0; i < candidates.length; i++) {
					const ast = candidates[i]
					if (ast !== neverKeyword && !memo.has(ast)) {
						memo.add(ast)
						types.push(ast)
					}
				}
				return Union.union(types, annotations)
			}
			static members = (candidates, annotations) =>
				Union.union(
					(candidates => candidates.filter(ast => !(ast === neverKeyword)))(
						candidates,
					),
					annotations,
				)
			static unify = (candidates, annotations) =>
				Union.union(
					(candidates => {
						const cs = sortCandidates(candidates),
							out = [],
							uniques = {},
							literals = []
						for (const ast of cs)
							switch (ast._tag) {
								case "NeverKeyword":
									break
								case "AnyKeyword":
									return [anyKeyword]
								case "UnknownKeyword":
									return [unknownKeyword]
								case "ObjectKeyword":
								case "UndefinedKeyword":
								case "VoidKeyword":
								case "StringKeyword":
								case "NumberKeyword":
								case "BooleanKeyword":
								case "BigIntKeyword":
								case "SymbolKeyword":
									if (!uniques[ast._tag]) {
										uniques[ast._tag] = ast
										out.push(ast)
									}
									break
								case "Literal": {
									const type = typeof ast.literal
									switch (type) {
										case "string":
										case "number":
										case "bigint":
										case "boolean":
											if (
												!uniques[literalMap[type]] &&
												!literals.includes(ast.literal)
											) {
												literals.push(ast.literal)
												out.push(ast)
											}
											break
										case "object":
											if (!literals.includes(ast.literal)) {
												literals.push(ast.literal)
												out.push(ast)
											}
									}
									break
								}
								case "UniqueSymbol":
									if (
										!uniques.SymbolKeyword &&
										!literals.includes(ast.symbol)
									) {
										literals.push(ast.symbol)
										out.push(ast)
									}
									break
								case "TupleType":
									uniques.ObjectKeyword || out.push(ast)
									break
								case "TypeLiteral":
									if (
										0 === ast.propertySignatures.length &&
										0 === ast.indexSignatures.length
									) {
										if (!uniques["{}"]) {
											uniques["{}"] = ast
											out.push(ast)
										}
									} else uniques.ObjectKeyword || out.push(ast)
									break
								default:
									out.push(ast)
							}
						return out
					})(AST_flatten(candidates)),
					annotations,
				)
			static union = (types, annotations) =>
				isMembers(types)
					? new Union(types, annotations)
					: 1 === types.length
						? types[0]
						: neverKeyword
			_tag = "Union"
			constructor(types, annotations = {}) {
				this.types = types
				this.annotations = annotations
			}
			toString() {
				return getOrElse(getExpected(this), () =>
					this.types.map(String).join(" | "),
				)
			}
			toJSON() {
				return {
					_tag: this._tag,
					types: this.types.map(ast => ast.toJSON()),
					annotations: toJSONAnnotations(this.annotations),
				}
			}
		}
		const isMembers = as => as.length > 1,
			isUnion = createASTGuard("Union"),
			toJSONMemoMap = globalValue(
				Symbol.for("@effect/schema/AST/toJSONMemoMap"),
				() => new WeakMap(),
			)
		class Suspend {
			f
			annotations
			_tag = "Suspend"
			constructor(f, annotations = {}) {
				this.f = f
				this.annotations = annotations
				this.f = memoizeThunk(f)
			}
			toString() {
				return getExpected(this).pipe(
					orElse(() => {
						return flatMap(
							((f = this.f),
							(...a) => {
								try {
									return Option_some(f(...a))
								} catch (e) {
									return Option_none()
								}
							})(),
							ast => getExpected(ast),
						)
						var f
					}),
					getOrElse(() => "<suspended schema>"),
				)
			}
			toJSON() {
				const ast = this.f()
				let out = toJSONMemoMap.get(ast)
				if (out) return out
				toJSONMemoMap.set(ast, { _tag: this._tag })
				out = {
					_tag: this._tag,
					ast: ast.toJSON(),
					annotations: toJSONAnnotations(this.annotations),
				}
				toJSONMemoMap.set(ast, out)
				return out
			}
		}
		class Refinement {
			from
			filter
			annotations
			_tag = "Refinement"
			constructor(from, filter, annotations = {}) {
				this.from = from
				this.filter = filter
				this.annotations = annotations
			}
			toString() {
				return getOrElse(getExpected(this), () => `{ ${this.from} | filter }`)
			}
			toJSON() {
				return {
					_tag: this._tag,
					from: this.from.toJSON(),
					annotations: toJSONAnnotations(this.annotations),
				}
			}
		}
		const isRefinement = createASTGuard("Refinement"),
			defaultParseOption = {},
			isTransformation = createASTGuard("Transformation"),
			AST_annotations = (ast, annotations) => {
				const d = Object.getOwnPropertyDescriptors(ast)
				d.annotations.value = { ...ast.annotations, ...annotations }
				return Object.create(Object.getPrototypeOf(ast), d)
			},
			typeAST = ast => {
				switch (ast._tag) {
					case "Declaration": {
						const typeParameters = changeMap(ast.typeParameters, typeAST)
						return typeParameters === ast.typeParameters
							? ast
							: new Declaration(
									typeParameters,
									ast.decodeUnknown,
									ast.encodeUnknown,
									ast.annotations,
								)
					}
					case "TupleType": {
						const elements = changeMap(ast.elements, e => {
								const type = typeAST(e.type)
								return type === e.type
									? e
									: new OptionalType(type, e.isOptional)
							}),
							restASTs = getRestASTs(ast.rest),
							rest = changeMap(restASTs, typeAST)
						return elements === ast.elements && rest === restASTs
							? ast
							: new TupleType(
									elements,
									rest.map(type => new Type(type)),
									ast.isReadonly,
									ast.annotations,
								)
					}
					case "TypeLiteral": {
						const propertySignatures = changeMap(ast.propertySignatures, p => {
								const type = typeAST(p.type)
								return type === p.type
									? p
									: new PropertySignature(
											p.name,
											type,
											p.isOptional,
											p.isReadonly,
										)
							}),
							indexSignatures = changeMap(ast.indexSignatures, is => {
								const type = typeAST(is.type)
								return type === is.type
									? is
									: new IndexSignature(is.parameter, type, is.isReadonly)
							})
						return propertySignatures === ast.propertySignatures &&
							indexSignatures === ast.indexSignatures
							? ast
							: new TypeLiteral(
									propertySignatures,
									indexSignatures,
									ast.annotations,
								)
					}
					case "Union": {
						const types = changeMap(ast.types, typeAST)
						return types === ast.types
							? ast
							: Union.make(types, ast.annotations)
					}
					case "Suspend":
						return new Suspend(() => typeAST(ast.f()), ast.annotations)
					case "Refinement": {
						const from = typeAST(ast.from)
						return from === ast.from
							? ast
							: new Refinement(from, ast.filter, ast.annotations)
					}
					case "Transformation":
						return typeAST(ast.to)
				}
				return ast
			},
			createJSONIdentifierAnnotation = annotated =>
				match(
					(annotated =>
						orElse(getJSONIdentifierAnnotation(annotated), () =>
							getIdentifierAnnotation(annotated),
						))(annotated),
					{
						onNone: () => {},
						onSome: identifier => ({
							[JSONIdentifierAnnotationId]: identifier,
						}),
					},
				)
		function changeMap(as, f) {
			let changed = !1
			const out = allocate(as.length)
			for (let i = 0; i < as.length; i++) {
				const a = as[i],
					fa = f(a)
				fa !== a && (changed = !0)
				out[i] = fa
			}
			return changed ? out : as
		}
		const encodedAST_ = (ast, isBound) => {
				switch (ast._tag) {
					case "Declaration": {
						const typeParameters = changeMap(ast.typeParameters, ast =>
							encodedAST_(ast, isBound),
						)
						return typeParameters === ast.typeParameters
							? ast
							: new Declaration(
									typeParameters,
									ast.decodeUnknown,
									ast.encodeUnknown,
									ast.annotations,
								)
					}
					case "TupleType": {
						const elements = changeMap(ast.elements, e => {
								const type = encodedAST_(e.type, isBound)
								return type === e.type
									? e
									: new OptionalType(type, e.isOptional)
							}),
							restASTs = getRestASTs(ast.rest),
							rest = changeMap(restASTs, ast => encodedAST_(ast, isBound))
						return elements === ast.elements && rest === restASTs
							? ast
							: new TupleType(
									elements,
									rest.map(ast => new Type(ast)),
									ast.isReadonly,
									createJSONIdentifierAnnotation(ast),
								)
					}
					case "TypeLiteral": {
						const propertySignatures = changeMap(ast.propertySignatures, ps => {
								const type = encodedAST_(ps.type, isBound)
								return type === ps.type
									? ps
									: new PropertySignature(
											ps.name,
											type,
											ps.isOptional,
											ps.isReadonly,
										)
							}),
							indexSignatures = changeMap(ast.indexSignatures, is => {
								const type = encodedAST_(is.type, isBound)
								return type === is.type
									? is
									: new IndexSignature(is.parameter, type, is.isReadonly)
							})
						return propertySignatures === ast.propertySignatures &&
							indexSignatures === ast.indexSignatures
							? ast
							: new TypeLiteral(
									propertySignatures,
									indexSignatures,
									createJSONIdentifierAnnotation(ast),
								)
					}
					case "Union": {
						const types = changeMap(ast.types, ast => encodedAST_(ast, isBound))
						return types === ast.types
							? ast
							: Union.make(types, createJSONIdentifierAnnotation(ast))
					}
					case "Suspend":
						return new Suspend(
							() => encodedAST_(ast.f(), isBound),
							createJSONIdentifierAnnotation(ast),
						)
					case "Refinement": {
						const from = encodedAST_(ast.from, isBound)
						if (isBound) {
							if (from === ast.from) return ast
							if (!isTransformation(ast.from)) {
								const annotations = getStableFilterAnnotation(ast)
								if (Option_isSome(annotations) && !0 === annotations.value)
									return new Refinement(from, ast.filter)
							}
						}
						return from
					}
					case "Transformation":
						return encodedAST_(ast.from, isBound)
				}
				return ast
			},
			encodedAST = ast => encodedAST_(ast, !1),
			toJSONAnnotations = annotations => {
				const out = {}
				for (const k of Object.getOwnPropertySymbols(annotations))
					out[String(k)] = annotations[k]
				return out
			},
			sortPropertySignatures = sort(
				Order_mapInput(Number_Order, ps =>
					(ast => {
						switch (ast._tag) {
							case "NeverKeyword":
								return 0
							case "Literal":
							case "UndefinedKeyword":
							case "VoidKeyword":
							case "UniqueSymbol":
								return 1
							case "BooleanKeyword":
								return 2
							case "StringKeyword":
							case "NumberKeyword":
							case "BigIntKeyword":
							case "SymbolKeyword":
								return 3
							case "ObjectKeyword":
								return 5
							case "UnknownKeyword":
							case "AnyKeyword":
								return 6
							default:
								return 4
						}
					})(ps.type),
				),
			),
			sortIndexSignatures = sort(
				Order_mapInput(Number_Order, is => {
					switch (getParameterBase(is.parameter)._tag) {
						case "StringKeyword":
							return 2
						case "SymbolKeyword":
							return 3
						case "TemplateLiteral":
							return 1
					}
				}),
			),
			getParameterBase = ast => {
				switch (ast._tag) {
					case "StringKeyword":
					case "SymbolKeyword":
					case "TemplateLiteral":
						return ast
					case "Refinement":
						return getParameterBase(ast.from)
				}
			},
			formatKeyword = ast => getOrElse(getExpected(ast), () => ast._tag),
			getExpected = ast =>
				getIdentifierAnnotation(ast).pipe(
					orElse(() => getTitleAnnotation(ast)),
					orElse(() => getDescriptionAnnotation(ast)),
				),
			TreeFormatter_make = (value, forest = []) => ({ value, forest }),
			drawTree = tree => tree.value + draw("\n", tree.forest),
			draw = (indentation, forest) => {
				let r = ""
				const len = forest.length
				let tree
				for (let i = 0; i < len; i++) {
					tree = forest[i]
					const isLast = i === len - 1
					r += indentation + (isLast ? "└" : "├") + "─ " + tree.value
					r += draw(
						indentation + (len > 1 && !isLast ? "│  " : "   "),
						tree.forest,
					)
				}
				return r
			},
			formatTransformationKind = kind => {
				switch (kind) {
					case "Encoded":
						return "Encoded side transformation failure"
					case "Transformation":
						return "Transformation process failure"
					case "Type":
						return "Type side transformation failure"
				}
			},
			formatRefinementKind = kind => {
				switch (kind) {
					case "From":
						return "From side refinement failure"
					case "Predicate":
						return "Predicate refinement failure"
				}
			},
			getAnnotated = issue =>
				"ast" in issue ? Option_some(issue.ast) : Option_none(),
			createParseIssueGuard = tag => issue => issue._tag === tag,
			TreeFormatter_isComposite = createParseIssueGuard("Composite"),
			TreeFormatter_isRefinement = createParseIssueGuard("Refinement"),
			TreeFormatter_isTransformation = createParseIssueGuard("Transformation"),
			getMessage = issue =>
				(issue =>
					getAnnotated(issue).pipe(
						flatMap(getMessageAnnotation),
						Effect_flatMap(annotation => {
							const out = annotation(issue)
							return isString(out)
								? Effect_succeed({ message: out, override: !1 })
								: Effect_isEffect(out)
									? Effect_map(out, message => ({ message, override: !1 }))
									: isString(out.message)
										? Effect_succeed({
												message: out.message,
												override: out.override,
											})
										: Effect_map(out.message, message => ({
												message,
												override: out.override,
											}))
						}),
					))(issue).pipe(
					Effect_flatMap(currentMessage =>
						!currentMessage.override &&
						(TreeFormatter_isComposite(issue) ||
							(TreeFormatter_isRefinement(issue) && "From" === issue.kind) ||
							(TreeFormatter_isTransformation(issue) &&
								"Transformation" !== issue.kind))
							? TreeFormatter_isTransformation(issue) ||
								TreeFormatter_isRefinement(issue)
								? getMessage(issue.issue)
								: Option_none()
							: Effect_succeed(currentMessage.message),
					),
				),
			TreeFormatter_getParseIssueTitleAnnotation = issue =>
				getAnnotated(issue).pipe(
					flatMap(getParseIssueTitleAnnotation),
					filterMap(annotation => fromNullable(annotation(issue))),
				),
			getParseIssueTitle = issue =>
				getOrElse(TreeFormatter_getParseIssueTitleAnnotation(issue), () =>
					String(issue.ast),
				),
			formatForbiddenMessage = e => e.message ?? "is forbidden",
			getTree = (issue, onFailure) =>
				Effect_matchEffect(getMessage(issue), {
					onFailure,
					onSuccess: message => Effect_succeed(TreeFormatter_make(message)),
				}),
			go = e => {
				switch (e._tag) {
					case "Type":
						return Effect_map(
							(e =>
								getMessage(e).pipe(
									Effect_orElse(() =>
										TreeFormatter_getParseIssueTitleAnnotation(e),
									),
									Effect_catchAll(() =>
										Effect_succeed(
											e.message ??
												`Expected ${String(e.ast)}, actual ${formatUnknown(e.actual)}`,
										),
									),
								))(e),
							TreeFormatter_make,
						)
					case "Forbidden":
						return Effect_succeed(
							TreeFormatter_make(getParseIssueTitle(e), [
								TreeFormatter_make(formatForbiddenMessage(e)),
							]),
						)
					case "Unexpected":
						return Effect_succeed(
							TreeFormatter_make((e => e.message ?? "is unexpected")(e)),
						)
					case "Missing":
						return Effect_map(
							(e =>
								getMissingMessageAnnotation(e.ast).pipe(
									Effect_flatMap(annotation => {
										const out = annotation()
										return isString(out) ? Effect_succeed(out) : out
									}),
									Effect_catchAll(() =>
										Effect_succeed(e.message ?? "is missing"),
									),
								))(e),
							TreeFormatter_make,
						)
					case "Transformation":
						return getTree(e, () =>
							Effect_map(go(e.issue), tree =>
								TreeFormatter_make(getParseIssueTitle(e), [
									TreeFormatter_make(formatTransformationKind(e.kind), [tree]),
								]),
							),
						)
					case "Refinement":
						return getTree(e, () =>
							Effect_map(go(e.issue), tree =>
								TreeFormatter_make(getParseIssueTitle(e), [
									TreeFormatter_make(formatRefinementKind(e.kind), [tree]),
								]),
							),
						)
					case "Pointer":
						return Effect_map(go(e.issue), tree =>
							TreeFormatter_make(formatPath(e.path), [tree]),
						)
					case "Composite": {
						const parseIssueTitle = getParseIssueTitle(e)
						return getTree(e, () =>
							util_isNonEmpty(e.issues)
								? Effect_map(Effect_forEach(e.issues, go), forest =>
										TreeFormatter_make(parseIssueTitle, forest),
									)
								: Effect_map(go(e.issues), tree =>
										TreeFormatter_make(parseIssueTitle, [tree]),
									),
						)
					}
				}
			}
		class Pointer {
			path
			actual
			issue
			_tag = "Pointer"
			constructor(path, actual, issue) {
				this.path = path
				this.actual = actual
				this.issue = issue
			}
		}
		class Unexpected {
			actual
			message
			_tag = "Unexpected"
			constructor(actual, message) {
				this.actual = actual
				this.message = message
			}
		}
		class Missing {
			ast
			message
			_tag = "Missing"
			actual = void 0
			constructor(ast, message) {
				this.ast = ast
				this.message = message
			}
		}
		class ParseResult_Composite {
			ast
			actual
			issues
			output
			_tag = "Composite"
			constructor(ast, actual, issues, output) {
				this.ast = ast
				this.actual = actual
				this.issues = issues
				this.output = output
			}
		}
		class ParseResult_Refinement {
			ast
			actual
			kind
			issue
			_tag = "Refinement"
			constructor(ast, actual, kind, issue) {
				this.ast = ast
				this.actual = actual
				this.kind = kind
				this.issue = issue
			}
		}
		class ParseResult_Transformation {
			ast
			actual
			kind
			issue
			_tag = "Transformation"
			constructor(ast, actual, kind, issue) {
				this.ast = ast
				this.actual = actual
				this.kind = kind
				this.issue = issue
			}
		}
		class ParseResult_Type {
			ast
			actual
			message
			_tag = "Type"
			constructor(ast, actual, message) {
				this.ast = ast
				this.actual = actual
				this.message = message
			}
		}
		class Forbidden {
			ast
			actual
			message
			_tag = "Forbidden"
			constructor(ast, actual, message) {
				this.ast = ast
				this.actual = actual
				this.message = message
			}
		}
		const ParseResult_ParseErrorTypeId = Symbol.for(
			"@effect/schema/ParseErrorTypeId",
		)
		class ParseResult_ParseError extends Data_TaggedError("ParseError") {
			[ParseResult_ParseErrorTypeId] = ParseResult_ParseErrorTypeId
			get message() {
				return this.toString()
			}
			toString() {
				return (
					(issue = this.issue),
					Effect_runSync(
						(issue => Effect_map(go(issue), tree => drawTree(tree)))(issue),
					)
				)
				var issue
			}
			toJSON() {
				return { _id: "ParseError", message: this.toString() }
			}
			[Inspectable_NodeInspectSymbol]() {
				return this.toJSON()
			}
		}
		const parseError = issue => new ParseResult_ParseError({ issue }),
			ParseResult_succeed = Either_right,
			ParseResult_fail = Either_left,
			ParseResult_flatMap = Function_dual(2, (self, f) => {
				const s = self
				return "Left" === s._tag
					? s
					: "Right" === s._tag
						? f(s.right)
						: Effect_flatMap(self, f)
			}),
			ParseResult_map = Function_dual(2, (self, f) => {
				const s = self
				return "Left" === s._tag
					? s
					: "Right" === s._tag
						? Either_right(f(s.right))
						: Effect_map(self, f)
			}),
			ParseResult_mapError = Function_dual(2, (self, f) => {
				const s = self
				return "Left" === s._tag
					? Either_left(f(s.left))
					: "Right" === s._tag
						? s
						: Effect_mapError(self, f)
			}),
			eitherOrUndefined = self => {
				const s = self
				if ("Left" === s._tag || "Right" === s._tag) return s
			},
			mergeInternalOptions = (options, overrideOptions) =>
				void 0 === overrideOptions || isNumber(overrideOptions)
					? options
					: void 0 === options
						? overrideOptions
						: { ...options, ...overrideOptions },
			decodeUnknownSync = (schema, options) =>
				((ast, isDecoding, options) => {
					const parser = ((ast, isDecoding, options) => {
						const parser = goMemo(ast, isDecoding)
						return (u, overrideOptions) =>
							parser(u, mergeInternalOptions(options, overrideOptions))
					})(ast, isDecoding, options)
					return (input, overrideOptions) =>
						Either_getOrThrowWith(parser(input, overrideOptions), parseError)
				})(schema.ast, !0, options),
			decodeMemoMap = globalValue(
				Symbol.for("@effect/schema/Parser/decodeMemoMap"),
				() => new WeakMap(),
			),
			encodeMemoMap = globalValue(
				Symbol.for("@effect/schema/Parser/encodeMemoMap"),
				() => new WeakMap(),
			),
			goMemo = (ast, isDecoding) => {
				const memoMap = isDecoding ? decodeMemoMap : encodeMemoMap,
					memo = memoMap.get(ast)
				if (memo) return memo
				const raw = ParseResult_go(ast, isDecoding),
					parseOptionsAnnotation = getParseOptionsAnnotation(ast),
					parser = Option_isSome(parseOptionsAnnotation)
						? (i, options) =>
								raw(
									i,
									mergeInternalOptions(options, parseOptionsAnnotation.value),
								)
						: raw
				memoMap.set(ast, parser)
				return parser
			},
			getConcurrency = ast => getOrUndefined(getConcurrencyAnnotation(ast)),
			getBatching = ast => getOrUndefined(getBatchingAnnotation(ast)),
			ParseResult_go = (ast, isDecoding) => {
				switch (ast._tag) {
					case "Refinement":
						if (isDecoding) {
							const from = goMemo(ast.from, !0)
							return (i, options) =>
								handleForbidden(
									ParseResult_flatMap(
										ParseResult_mapError(
											from(i, options),
											e => new ParseResult_Refinement(ast, i, "From", e),
										),
										a =>
											match(ast.filter(a, options ?? defaultParseOption, ast), {
												onNone: () => Either_right(a),
												onSome: e =>
													Either_left(
														new ParseResult_Refinement(ast, i, "Predicate", e),
													),
											}),
									),
									ast,
									i,
									options,
								)
						}
						{
							const from = goMemo(typeAST(ast), !0),
								to = goMemo(dropRightRefinement(ast.from), !1)
							return (i, options) =>
								handleForbidden(
									ParseResult_flatMap(from(i, options), a => to(a, options)),
									ast,
									i,
									options,
								)
						}
					case "Transformation": {
						const transform = getFinalTransformation(
								ast.transformation,
								isDecoding,
							),
							from = isDecoding ? goMemo(ast.from, !0) : goMemo(ast.to, !1),
							to = isDecoding ? goMemo(ast.to, !0) : goMemo(ast.from, !1)
						return (i, options) =>
							handleForbidden(
								ParseResult_flatMap(
									ParseResult_mapError(
										from(i, options),
										e =>
											new ParseResult_Transformation(
												ast,
												i,
												isDecoding ? "Encoded" : "Type",
												e,
											),
									),
									a =>
										ParseResult_flatMap(
											ParseResult_mapError(
												transform(a, options ?? defaultParseOption, ast, i),
												e =>
													new ParseResult_Transformation(
														ast,
														i,
														"Transformation",
														e,
													),
											),
											i2 =>
												ParseResult_mapError(
													to(i2, options),
													e =>
														new ParseResult_Transformation(
															ast,
															i,
															isDecoding ? "Type" : "Encoded",
															e,
														),
												),
										),
								),
								ast,
								i,
								options,
							)
					}
					case "Declaration": {
						const parse = isDecoding
							? ast.decodeUnknown(...ast.typeParameters)
							: ast.encodeUnknown(...ast.typeParameters)
						return (i, options) =>
							handleForbidden(
								parse(i, options ?? defaultParseOption, ast),
								ast,
								i,
								options,
							)
					}
					case "Literal":
						return fromRefinement(ast, u => u === ast.literal)
					case "UniqueSymbol":
						return fromRefinement(ast, u => u === ast.symbol)
					case "UndefinedKeyword":
						return fromRefinement(ast, isUndefined)
					case "NeverKeyword":
						return fromRefinement(ast, isNever)
					case "UnknownKeyword":
					case "AnyKeyword":
					case "VoidKeyword":
						return Either_right
					case "StringKeyword":
						return fromRefinement(ast, isString)
					case "NumberKeyword":
						return fromRefinement(ast, isNumber)
					case "BooleanKeyword":
						return fromRefinement(ast, Predicate_isBoolean)
					case "BigIntKeyword":
						return fromRefinement(ast, isBigInt)
					case "SymbolKeyword":
						return fromRefinement(ast, isSymbol)
					case "ObjectKeyword":
						return fromRefinement(ast, Predicate_isObject)
					case "Enums":
						return fromRefinement(ast, u =>
							ast.enums.some(([_, value]) => value === u),
						)
					case "TemplateLiteral": {
						const regex = (ast => {
							let pattern = `^${RegExp_escape(ast.head)}`
							for (const span of ast.spans) {
								isStringKeyword(span.type)
									? (pattern += ".*")
									: isNumberKeyword(span.type) &&
										(pattern += "[+-]?\\d*\\.?\\d+(?:[Ee][+-]?\\d+)?")
								pattern += RegExp_escape(span.literal)
							}
							pattern += "$"
							return new RegExp(pattern)
						})(ast)
						return fromRefinement(ast, u => isString(u) && regex.test(u))
					}
					case "TupleType": {
						const elements = ast.elements.map(e => goMemo(e.type, isDecoding)),
							rest = ast.rest.map(annotatedAST =>
								goMemo(annotatedAST.type, isDecoding),
							)
						let requiredTypes = ast.elements.filter(e => !e.isOptional)
						ast.rest.length > 0 &&
							(requiredTypes = requiredTypes.concat(ast.rest.slice(1)))
						const requiredLen = requiredTypes.length,
							expectedIndexes =
								ast.elements.length > 0
									? ast.elements.map((_, i) => i).join(" | ")
									: "never",
							concurrency = getConcurrency(ast),
							batching = getBatching(ast)
						return (input, options) => {
							if (!isArray(input))
								return Either_left(new ParseResult_Type(ast, input))
							const allErrors = "all" === options?.errors,
								es = []
							let stepKey = 0
							const output = [],
								len = input.length
							for (let i = len; i <= requiredLen - 1; i++) {
								const e = new Pointer(
									i,
									input,
									new Missing(requiredTypes[i - len]),
								)
								if (!allErrors)
									return Either_left(
										new ParseResult_Composite(ast, input, e, output),
									)
								es.push([stepKey++, e])
							}
							if (0 === ast.rest.length)
								for (let i = ast.elements.length; i <= len - 1; i++) {
									const e = new Pointer(
										i,
										input,
										new Unexpected(
											input[i],
											`is unexpected, expected: ${expectedIndexes}`,
										),
									)
									if (!allErrors)
										return Either_left(
											new ParseResult_Composite(ast, input, e, output),
										)
									es.push([stepKey++, e])
								}
							let queue,
								i = 0
							for (; i < elements.length; i++)
								if (len < i + 1) {
									if (ast.elements[i].isOptional) continue
								} else {
									const te = (0, elements[i])(input[i], options),
										eu = eitherOrUndefined(te)
									if (eu) {
										if (Either_isLeft(eu)) {
											const e = new Pointer(i, input, eu.left)
											if (allErrors) {
												es.push([stepKey++, e])
												continue
											}
											return Either_left(
												new ParseResult_Composite(
													ast,
													input,
													e,
													sortByIndex(output),
												),
											)
										}
										output.push([stepKey++, eu.right])
									} else {
										const nk = stepKey++,
											index = i
										queue || (queue = [])
										queue.push(({ es, output }) =>
											Effect_flatMap(Effect_either(te), t => {
												if (Either_isLeft(t)) {
													const e = new Pointer(index, input, t.left)
													if (allErrors) {
														es.push([nk, e])
														return _void
													}
													return Either_left(
														new ParseResult_Composite(
															ast,
															input,
															e,
															sortByIndex(output),
														),
													)
												}
												output.push([nk, t.right])
												return _void
											}),
										)
									}
								}
							if (isNonEmptyReadonlyArray(rest)) {
								const [head, ...tail] = rest
								for (; i < len - tail.length; i++) {
									const te = head(input[i], options),
										eu = eitherOrUndefined(te)
									if (eu) {
										if (Either_isLeft(eu)) {
											const e = new Pointer(i, input, eu.left)
											if (allErrors) {
												es.push([stepKey++, e])
												continue
											}
											return Either_left(
												new ParseResult_Composite(
													ast,
													input,
													e,
													sortByIndex(output),
												),
											)
										}
										output.push([stepKey++, eu.right])
									} else {
										const nk = stepKey++,
											index = i
										queue || (queue = [])
										queue.push(({ es, output }) =>
											Effect_flatMap(Effect_either(te), t => {
												if (Either_isLeft(t)) {
													const e = new Pointer(index, input, t.left)
													if (allErrors) {
														es.push([nk, e])
														return _void
													}
													return Either_left(
														new ParseResult_Composite(
															ast,
															input,
															e,
															sortByIndex(output),
														),
													)
												}
												output.push([nk, t.right])
												return _void
											}),
										)
									}
								}
								for (let j = 0; j < tail.length; j++) {
									i += j
									if (!(len < i + 1)) {
										const te = tail[j](input[i], options),
											eu = eitherOrUndefined(te)
										if (eu) {
											if (Either_isLeft(eu)) {
												const e = new Pointer(i, input, eu.left)
												if (allErrors) {
													es.push([stepKey++, e])
													continue
												}
												return Either_left(
													new ParseResult_Composite(
														ast,
														input,
														e,
														sortByIndex(output),
													),
												)
											}
											output.push([stepKey++, eu.right])
										} else {
											const nk = stepKey++,
												index = i
											queue || (queue = [])
											queue.push(({ es, output }) =>
												Effect_flatMap(Effect_either(te), t => {
													if (Either_isLeft(t)) {
														const e = new Pointer(index, input, t.left)
														if (allErrors) {
															es.push([nk, e])
															return _void
														}
														return Either_left(
															new ParseResult_Composite(
																ast,
																input,
																e,
																sortByIndex(output),
															),
														)
													}
													output.push([nk, t.right])
													return _void
												}),
											)
										}
									}
								}
							}
							const computeResult = ({ es, output }) =>
								Array_isNonEmptyArray(es)
									? Either_left(
											new ParseResult_Composite(
												ast,
												input,
												sortByIndex(es),
												sortByIndex(output),
											),
										)
									: Either_right(sortByIndex(output))
							if (queue && queue.length > 0) {
								const cqueue = queue
								return Effect_suspend(() => {
									const state = { es: copy(es), output: copy(output) }
									return Effect_flatMap(
										Effect_forEach(cqueue, f => f(state), {
											concurrency,
											batching,
											discard: !0,
										}),
										() => computeResult(state),
									)
								})
							}
							return computeResult({ output, es })
						}
					}
					case "TypeLiteral": {
						if (
							0 === ast.propertySignatures.length &&
							0 === ast.indexSignatures.length
						)
							return fromRefinement(ast, isNotNullable)
						const propertySignatures = [],
							expectedKeysMap = {},
							expectedKeys = []
						for (const ps of ast.propertySignatures) {
							propertySignatures.push([goMemo(ps.type, isDecoding), ps])
							expectedKeysMap[ps.name] = null
							expectedKeys.push(ps.name)
						}
						const indexSignatures = ast.indexSignatures.map(is => [
								goMemo(is.parameter, isDecoding),
								goMemo(is.type, isDecoding),
								is.parameter,
							]),
							expectedAST = Union.make(
								ast.indexSignatures
									.map(is => is.parameter)
									.concat(
										expectedKeys.map(key =>
											isSymbol(key) ? new UniqueSymbol(key) : new Literal(key),
										),
									),
							),
							expected = goMemo(expectedAST, isDecoding),
							concurrency = getConcurrency(ast),
							batching = getBatching(ast)
						return (input, options) => {
							if (!isRecord(input))
								return Either_left(new ParseResult_Type(ast, input))
							const allErrors = "all" === options?.errors,
								es = []
							let stepKey = 0
							const onExcessPropertyError =
									"error" === options?.onExcessProperty,
								output = {}
							let inputKeys, queue
							if (
								onExcessPropertyError ||
								"preserve" === options?.onExcessProperty
							) {
								inputKeys = util_ownKeys(input)
								for (const key of inputKeys) {
									const eu = eitherOrUndefined(expected(key, options))
									if (Either_isLeft(eu)) {
										if (onExcessPropertyError) {
											const e = new Pointer(
												key,
												input,
												new Unexpected(
													input[key],
													`is unexpected, expected: ${String(expectedAST)}`,
												),
											)
											if (allErrors) {
												es.push([stepKey++, e])
												continue
											}
											return Either_left(
												new ParseResult_Composite(ast, input, e, output),
											)
										}
										output[key] = input[key]
									}
								}
							}
							const isExact = !0 === options?.exact
							for (let i = 0; i < propertySignatures.length; i++) {
								const ps = propertySignatures[i][1],
									name = ps.name,
									hasKey = Object.prototype.hasOwnProperty.call(input, name)
								if (!hasKey) {
									if (ps.isOptional) continue
									if (isExact) {
										const e = new Pointer(name, input, new Missing(ps))
										if (allErrors) {
											es.push([stepKey++, e])
											continue
										}
										return Either_left(
											new ParseResult_Composite(ast, input, e, output),
										)
									}
								}
								const te = (0, propertySignatures[i][0])(input[name], options),
									eu = eitherOrUndefined(te)
								if (eu) {
									if (Either_isLeft(eu)) {
										const e = new Pointer(
											name,
											input,
											hasKey ? eu.left : new Missing(ps),
										)
										if (allErrors) {
											es.push([stepKey++, e])
											continue
										}
										return Either_left(
											new ParseResult_Composite(ast, input, e, output),
										)
									}
									output[name] = eu.right
								} else {
									const nk = stepKey++,
										index = name
									queue || (queue = [])
									queue.push(({ es, output }) =>
										Effect_flatMap(Effect_either(te), t => {
											if (Either_isLeft(t)) {
												const e = new Pointer(
													index,
													input,
													hasKey ? t.left : new Missing(ps),
												)
												if (allErrors) {
													es.push([nk, e])
													return _void
												}
												return Either_left(
													new ParseResult_Composite(ast, input, e, output),
												)
											}
											output[index] = t.right
											return _void
										}),
									)
								}
							}
							for (let i = 0; i < indexSignatures.length; i++) {
								const indexSignature = indexSignatures[i],
									parameter = indexSignature[0],
									type = indexSignature[1],
									keys = getKeysForIndexSignature(input, indexSignature[2])
								for (const key of keys) {
									const keu = eitherOrUndefined(parameter(key, options))
									if (keu && Either_isRight(keu)) {
										const vpr = type(input[key], options),
											veu = eitherOrUndefined(vpr)
										if (veu) {
											if (Either_isLeft(veu)) {
												const e = new Pointer(key, input, veu.left)
												if (allErrors) {
													es.push([stepKey++, e])
													continue
												}
												return Either_left(
													new ParseResult_Composite(ast, input, e, output),
												)
											}
											Object.prototype.hasOwnProperty.call(
												expectedKeysMap,
												key,
											) || (output[key] = veu.right)
										} else {
											const nk = stepKey++,
												index = key
											queue || (queue = [])
											queue.push(({ es, output }) =>
												Effect_flatMap(Effect_either(vpr), tv => {
													if (Either_isLeft(tv)) {
														const e = new Pointer(index, input, tv.left)
														if (allErrors) {
															es.push([nk, e])
															return _void
														}
														return Either_left(
															new ParseResult_Composite(ast, input, e, output),
														)
													}
													Object.prototype.hasOwnProperty.call(
														expectedKeysMap,
														key,
													) || (output[key] = tv.right)
													return _void
												}),
											)
										}
									}
								}
							}
							const computeResult = ({ es, output }) => {
								if (Array_isNonEmptyArray(es))
									return Either_left(
										new ParseResult_Composite(
											ast,
											input,
											sortByIndex(es),
											output,
										),
									)
								if ("original" === options?.propertyOrder) {
									const keys = inputKeys || util_ownKeys(input)
									for (const name of expectedKeys)
										-1 === keys.indexOf(name) && keys.push(name)
									const out = {}
									for (const key of keys)
										Object.prototype.hasOwnProperty.call(output, key) &&
											(out[key] = output[key])
									return Either_right(out)
								}
								return Either_right(output)
							}
							if (queue && queue.length > 0) {
								const cqueue = queue
								return Effect_suspend(() => {
									const state = {
										es: copy(es),
										output: Object.assign({}, output),
									}
									return Effect_flatMap(
										Effect_forEach(cqueue, f => f(state), {
											concurrency,
											batching,
											discard: !0,
										}),
										() => computeResult(state),
									)
								})
							}
							return computeResult({ es, output })
						}
					}
					case "Union": {
						const searchTree = getSearchTree(ast.types, isDecoding),
							ownKeys = util_ownKeys(searchTree.keys),
							len = ownKeys.length,
							map = new Map()
						for (let i = 0; i < ast.types.length; i++)
							map.set(ast.types[i], goMemo(ast.types[i], isDecoding))
						const concurrency = getConcurrency(ast) ?? 1,
							batching = getBatching(ast)
						return (input, options) => {
							const es = []
							let queue,
								stepKey = 0,
								candidates = []
							if (len > 0)
								if (isRecord(input))
									for (let i = 0; i < len; i++) {
										const name = ownKeys[i],
											buckets = searchTree.keys[name].buckets
										if (Object.prototype.hasOwnProperty.call(input, name)) {
											const literal = String(input[name])
											if (
												Object.prototype.hasOwnProperty.call(buckets, literal)
											)
												candidates = candidates.concat(buckets[literal])
											else {
												const literals = Union.make(
													searchTree.keys[name].literals,
												)
												es.push([
													stepKey++,
													new ParseResult_Composite(
														new TypeLiteral(
															[new PropertySignature(name, literals, !1, !0)],
															[],
														),
														input,
														new Pointer(
															name,
															input,
															new ParseResult_Type(literals, input[name]),
														),
													),
												])
											}
										} else {
											const literals = Union.make(
													searchTree.keys[name].literals,
												),
												fakeps = new PropertySignature(name, literals, !1, !0)
											es.push([
												stepKey++,
												new ParseResult_Composite(
													new TypeLiteral([fakeps], []),
													input,
													new Pointer(name, input, new Missing(fakeps)),
												),
											])
										}
									}
								else es.push([stepKey++, new ParseResult_Type(ast, input)])
							searchTree.otherwise.length > 0 &&
								(candidates = candidates.concat(searchTree.otherwise))
							for (let i = 0; i < candidates.length; i++) {
								const candidate = candidates[i],
									pr = map.get(candidate)(input, options),
									eu =
										queue && 0 !== queue.length ? void 0 : eitherOrUndefined(pr)
								if (eu) {
									if (Either_isRight(eu)) return Either_right(eu.right)
									es.push([stepKey++, eu.left])
								} else {
									const nk = stepKey++
									queue || (queue = [])
									queue.push(state =>
										Effect_suspend(() =>
											"finalResult" in state
												? _void
												: Effect_flatMap(Effect_either(pr), t => {
														Either_isRight(t)
															? (state.finalResult = Either_right(t.right))
															: state.es.push([nk, t.left])
														return _void
													}),
										),
									)
								}
							}
							const computeResult = es =>
								Array_isNonEmptyArray(es)
									? 1 === es.length && "Type" === es[0][1]._tag
										? Either_left(es[0][1])
										: Either_left(
												new ParseResult_Composite(ast, input, sortByIndex(es)),
											)
									: Either_left(new ParseResult_Type(ast, input))
							if (queue && queue.length > 0) {
								const cqueue = queue
								return Effect_suspend(() => {
									const state = { es: copy(es) }
									return Effect_flatMap(
										Effect_forEach(cqueue, f => f(state), {
											concurrency,
											batching,
											discard: !0,
										}),
										() =>
											"finalResult" in state
												? state.finalResult
												: computeResult(state.es),
									)
								})
							}
							return computeResult(es)
						}
					}
					case "Suspend": {
						const get = memoizeThunk(() =>
							goMemo(AST_annotations(ast.f(), ast.annotations), isDecoding),
						)
						return (a, options) => get()(a, options)
					}
				}
			},
			fromRefinement = (ast, refinement) => u =>
				refinement(u)
					? Either_right(u)
					: Either_left(new ParseResult_Type(ast, u)),
			getLiterals = (ast, isDecoding) => {
				switch (ast._tag) {
					case "Declaration": {
						const annotation = getSurrogateAnnotation(ast)
						if (Option_isSome(annotation))
							return getLiterals(annotation.value, isDecoding)
						break
					}
					case "TypeLiteral": {
						const out = []
						for (let i = 0; i < ast.propertySignatures.length; i++) {
							const propertySignature = ast.propertySignatures[i],
								type = isDecoding
									? encodedAST(propertySignature.type)
									: typeAST(propertySignature.type)
							isLiteral(type) &&
								!propertySignature.isOptional &&
								out.push([propertySignature.name, type])
						}
						return out
					}
					case "Refinement":
						return getLiterals(ast.from, isDecoding)
					case "Suspend":
						return getLiterals(ast.f(), isDecoding)
					case "Transformation":
						return getLiterals(isDecoding ? ast.from : ast.to, isDecoding)
				}
				return []
			},
			getSearchTree = (members, isDecoding) => {
				const keys = {},
					otherwise = []
				for (let i = 0; i < members.length; i++) {
					const member = members[i],
						tags = getLiterals(member, isDecoding)
					if (tags.length > 0)
						for (let j = 0; j < tags.length; j++) {
							const [key, literal] = tags[j],
								hash = String(literal.literal)
							keys[key] = keys[key] || { buckets: {}, literals: [] }
							const buckets = keys[key].buckets
							if (!Object.prototype.hasOwnProperty.call(buckets, hash)) {
								buckets[hash] = [member]
								keys[key].literals.push(literal)
								break
							}
							if (!(j < tags.length - 1)) {
								buckets[hash].push(member)
								keys[key].literals.push(literal)
							}
						}
					else otherwise.push(member)
				}
				return { keys, otherwise }
			},
			dropRightRefinement = ast =>
				isRefinement(ast) ? dropRightRefinement(ast.from) : ast,
			handleForbidden = (effect, ast, actual, options) => {
				const eu = eitherOrUndefined(effect)
				if (eu) return eu
				if (!0 === options?.isEffectAllowed) return effect
				try {
					return Effect_runSync(Effect_either(effect))
				} catch (e) {
					return Either_left(
						new Forbidden(
							ast,
							actual,
							"cannot be be resolved synchronously, this is caused by using runSync on an effect that performs async work",
						),
					)
				}
			},
			compare = ([a], [b]) => (a > b ? 1 : a < b ? -1 : 0)
		function sortByIndex(es) {
			return es.sort(compare).map(t => t[1])
		}
		const getFinalTransformation = (transformation, isDecoding) => {
				switch (transformation._tag) {
					case "FinalTransformation":
						return isDecoding ? transformation.decode : transformation.encode
					case "ComposeTransformation":
						return Either_right
					case "TypeLiteralTransformation":
						return input => {
							let out = Either_right(input)
							for (const pst of transformation.propertySignatureTransformations) {
								const [from, to] = isDecoding
										? [pst.from, pst.to]
										: [pst.to, pst.from],
									transformation = isDecoding ? pst.decode : pst.encode,
									f = input => {
										const o = transformation(
											Object.prototype.hasOwnProperty.call(input, from)
												? Option_some(input[from])
												: Option_none(),
										)
										delete input[from]
										Option_isSome(o) && (input[to] = o.value)
										return input
									}
								out = ParseResult_map(out, f)
							}
							return out
						}
				}
			},
			ArbitraryHookId = Symbol.for("@effect/schema/ArbitraryHookId"),
			EquivalenceHookId = Symbol.for("@effect/schema/EquivalenceHookId"),
			PrettyHookId = Symbol.for("@effect/schema/PrettyHookId"),
			Schema_TypeId = Symbol.for("@effect/schema/Schema"),
			Schema_make = ast =>
				class {
					[Schema_TypeId] = Schema_variance
					static Type
					static Encoded
					static [Schema_TypeId] = Schema_variance
					static ast = ast
					static annotations(annotations) {
						return Schema_make(mergeSchemaAnnotations(this.ast, annotations))
					}
					static pipe() {
						return Pipeable_pipeArguments(this, arguments)
					}
					static toString() {
						return String(ast)
					}
				},
			Schema_variance = { _A: _ => _, _I: _ => _, _R: _ => _ },
			toASTAnnotations = annotations => {
				if (!annotations) return {}
				const out = {},
					custom = Object.getOwnPropertySymbols(annotations)
				for (const sym of custom) out[sym] = annotations[sym]
				if (void 0 !== annotations.typeId) {
					const typeId = annotations.typeId
					if ("object" == typeof typeId) {
						out[TypeAnnotationId] = typeId.id
						out[typeId.id] = typeId.annotation
					} else out[TypeAnnotationId] = typeId
				}
				const move = (from, to) => {
					void 0 !== annotations[from] && (out[to] = annotations[from])
				}
				move("message", MessageAnnotationId)
				move("missingMessage", MissingMessageAnnotationId)
				move("identifier", IdentifierAnnotationId)
				move("title", TitleAnnotationId)
				move("description", DescriptionAnnotationId)
				move("examples", ExamplesAnnotationId)
				move("default", DefaultAnnotationId)
				move("documentation", DocumentationAnnotationId)
				move("jsonSchema", JSONSchemaAnnotationId)
				move("arbitrary", ArbitraryHookId)
				move("pretty", PrettyHookId)
				move("equivalence", EquivalenceHookId)
				move("concurrency", ConcurrencyAnnotationId)
				move("batching", BatchingAnnotationId)
				move("parseIssueTitle", ParseIssueTitleAnnotationId)
				move("parseOptions", ParseOptionsAnnotationId)
				return out
			},
			mergeSchemaAnnotations = (ast, annotations) =>
				AST_annotations(ast, toASTAnnotations(annotations)),
			InstanceOfTypeId = Symbol.for("@effect/schema/TypeId/InstanceOf"),
			instanceOf = (constructor, annotations) =>
				(function () {
					return Array.isArray(arguments[0])
						? ((options = arguments[1]),
							(annotations = arguments[2]),
							Schema_make(
								new Declaration(
									arguments[0].map(tp => tp.ast),
									(...typeParameters) =>
										options.decode(...typeParameters.map(Schema_make)),
									(...typeParameters) =>
										options.encode(...typeParameters.map(Schema_make)),
									toASTAnnotations(annotations),
								),
							))
						: ((is, annotations) => {
								const decodeUnknown = () => (input, _, ast) =>
									is(input)
										? ParseResult_succeed(input)
										: ParseResult_fail(new ParseResult_Type(ast, input))
								return Schema_make(
									new Declaration(
										[],
										decodeUnknown,
										decodeUnknown,
										toASTAnnotations(annotations),
									),
								)
							})(arguments[0], arguments[1])
					var options, annotations
				})(u => u instanceof constructor, {
					title: constructor.name,
					description: `an instance of ${constructor.name}`,
					pretty: () => String,
					typeId: { id: InstanceOfTypeId, annotation: { constructor } },
					...annotations,
				}),
			configEffect = (k, v) => c => () =>
				Effect_runPromise(c.provideLog(c.setConfig[k](v))),
			stepTiming = stepCount => `steps(${stepCount}, jump-end)`,
			setComputed = {
				useStepTiming: v => c => s =>
					Function_pipe(
						v ? stepTiming(Editable_value(s.timingStepCount)) : "linear",
						timingFunction => [
							{ ...s, timingFunction },
							configEffect("timingFunction", timingFunction)(c),
						],
					),
			},
			settingUI_setComputed = setComputed,
			setRange = keyA => keyB => bFn => vA => commander => s =>
				Function_pipe(
					Editable_value(vA),
					a => ({ a, b: bFn(a)(Editable_value(s[keyB])) }),
					({ a, b }) =>
						Function_pipe(
							[configEffect(keyA, a), configEffect(keyB, b)],
							xs => c =>
								Function_pipe(
									xs,
									Array_map(x => x(c)),
									effects => [
										{ ...s, [keyA]: vA, [keyB]: setValue(b)(s[keyB]) },
										...effects,
									],
								),
						)(commander),
				),
			setState = {
				flowY1: setRange("flowY1")("flowY2")(a => b => Math.max(b, a + 0.05)),
				flowY2: setRange("flowY2")("flowY1")(a => b => Math.min(b, a - 0.05)),
				flowX1: setRange("flowX1")("flowX2")(a => b => Math.max(b, a + 0.05)),
				flowX2: setRange("flowX2")("flowX1")(a => b => Math.min(b, a - 0.05)),
				timingStepCount: v => c => s =>
					Function_pipe(stepTiming(Editable_value(v)), timingFunction => [
						{ ...s, timingStepCount: v, timingFunction },
						configEffect("timingFunction", timingFunction)(c),
					]),
			},
			settingUI_setState = setState,
			updateAt = k => v =>
				Function_pipe(
					k in settingUI_setComputed
						? settingUI_setComputed[k](v)
						: k in settingUI_setState
							? settingUI_setState[k](v)
							: c => s => [
									{ ...s, [k]: v },
									...(k in c.setConfig && "filterExp" !== k
										? [
												configEffect(
													k,
													Array.isArray(v) &&
														2 === v.length &&
														isEditable(k)(v[0])
														? Editable_value(v)
														: v,
												)(c),
											]
										: []),
								],
				),
			updateBool = (
				updateAt => key =>
					flip((s, e) =>
						Function_pipe(
							(e =>
								decodeUnknownSync(instanceOf(HTMLInputElement))(e.currentTarget)
									.checked)(e),
							updateAt(key),
							flip,
							apply(s),
						),
					)
			)(updateAt),
			settingUI_checkboxNode = (
				(getText, getState, updateBool) => label => c => s =>
					((label, checked, onchange) =>
						h(
							"div",
							{},
							h("label", {}, [
								hyperapp_text(label),
								h("input", { type: "checkbox", checked, onchange }),
							]),
						))(getText(label)(s), getState(label)(s), updateBool(label)(c))
			)(getText, getState, updateBool),
			mapSettingNodes = f => xs => c => s =>
				Function_pipe(
					xs,
					Array_map(x => x(c)(s)),
					f,
				),
			errorText = subject => edit =>
				Function_pipe(
					edit,
					Editable_error,
					map(x => `${subject}${"" === x ? "" : ": "}${x}`),
					getOrElse(constant("")),
				),
			rangeRow = (config, action) => value =>
				h("div", {}, [
					h("input", {
						style: { width: "150px", verticalAlign: "middle" },
						type: "range",
						...config,
						value: Editable_value(value).toString(),
						oninput: action.onchange ?? Function_identity,
					}),
					h("input", {
						style: {
							width: "30px",
							backgroundColor: "transparent",
							color: "inherit",
							borderWidth: "1px",
							verticalAlign: "middle",
							borderColor: hasError(value) ? "#f55" : null,
						},
						inputmode: "decimal",
						value: Function_pipe(
							value,
							Editable_text,
							getOrElse(
								constant(
									Editable_value(value)
										.toFixed(4)
										.replace(/\.?0+$/, ""),
								),
							),
						),
						...action,
					}),
				]),
			settingRow = (label, error, content) =>
				h("div", {}, [
					h("span", {}, hyperapp_text(label)),
					h(
						"span",
						{
							style: {
								color: "#f55",
								marginLeft: "5px",
								whiteSpace: "pre-wrap",
							},
						},
						hyperapp_text(error),
					),
					h("div", {}, content),
				]),
			numericNode =
				setter =>
				(editAction, getText, getState) =>
				(label, min, max, step) =>
				c =>
				s =>
					settingRow(
						getText(label)(s),
						errorText(getText("inputNonNumberic")(s))(getState(label)(s)),
						[
							rangeRow(
								{ min, max, step },
								editAction(label, setter)(c),
							)(getState(label)(s)),
						],
					),
			numberNode = numericNode(
				editing => value => state =>
					Function_pipe(
						value,
						Number.parseFloat,
						editing
							? x =>
									Number.isNaN(x) || "." === value.at(-1)
										? Function_pipe(state, setText(value))
										: fromValueText(x)(value)
							: x =>
									Number.isNaN(x)
										? Function_pipe(
												state,
												mapSecond(
													constant(Option_some([value, Option_some("")])),
												),
											)
										: Editable_of(x),
					),
			),
			updateInput = (
				(getState, updateAt) => key => setter => c => (s, e) =>
					Function_pipe(
						(e => {
							const target = e.currentTarget ?? e.__target
							if (
								target instanceof HTMLSelectElement ||
								target instanceof HTMLTextAreaElement ||
								target instanceof HTMLInputElement
							)
								return target.value
							throw Error("Event target type isn't acceptable.")
						})(e),
						setter,
						apply(getState(key)(s)),
						updateAt(key),
						x => x(c)(s),
					)
			)(getState, updateAt),
			editAction = (updateInput => (key, setter) => c => ({
				oninput: updateInput(key)(setter(!0))(c),
				onchange: updateInput(key)(setter(!1))(c),
			}))(updateInput),
			settingUI_numberNode = numberNode(editAction, getText, getState),
			settingUI_chatFieldPanel = Function_pipe(
				[
					Function_pipe(
						[
							settingUI_numberNode("fieldScale", 0.7, 1.5, 0.05),
							settingUI_checkboxNode("simplifyChatField"),
							settingUI_checkboxNode("createBanButton"),
						],
						mapSettingNodes(x => h("div", { style: panelBoxStyle(644) }, x)),
					),
				],
				mapSettingNodes(Function_identity),
			),
			action = {
				copy: () => s =>
					Effect_map(
						Effect_promise(async () => {
							return GM.setClipboard(
								((x = s.eventLog),
								`<pre>${JSON.stringify({ nextId: x.nextId, blocks: Function_pipe(x.compressedBlocks, Array_map(external_LZString_namespaceObject.decompressFromUTF16), Array_append(JSON.stringify(x.lastBlock)), Array_map(external_LZString_namespaceObject.compressToEncodedURIComponent)) })}</pre>`),
							)
							var x
						}),
						() => s,
					),
				clearFlowChats: c => s => Effect_map(c.act.clearFlowChats, () => s),
				importLog: () => s =>
					Function_pipe(
						Effect_sync(() => prompt(getText("importLog")(s))),
						Effect_flatMap(Effect_fromNullable),
						Effect_map(x => ({ ...s, eventLog: importLog(x) })),
						Effect_orElseSucceed(() => s),
					),
			},
			buttonNode = label => c => state =>
				h(
					"button",
					{
						type: "button",
						onclick: s => [
							s,
							d =>
								Effect_runPromise(
									c.provideLog(
										Function_pipe(
											action[label](c)(s),
											Effect_flatMap(newS => Effect_sync(() => d(newS))),
										),
									),
								),
						],
					},
					hyperapp_text(getText(label)(state)),
				),
			feedbackPanel = c => s =>
				Function_pipe(
					getState("eventLog")(s).compressedBlocks.length + 1,
					logPageCount => [
						Function_pipe(
							[settingUI_checkboxNode("logEvents"), buttonNode("importLog")],
							mapSettingNodes(x => h("div", { style: panelBoxStyle(212) }, x)),
						)(c)(s),
						h("div", { style: panelBoxStyle(428) }, [
							h(
								"a",
								{
									style: { color: "#f0f" },
									href: "https://greasyfork.org/en/scripts/411442-flow-youtube-chat/feedback",
									target: "_blank",
								},
								hyperapp_text(getText("giveFeedback")(s)),
							),
							h("div", {}, [
								h("span", {}, hyperapp_text(getText("eventLog")(s))),
								buttonNode("copy")(c)(s),
								tabContainer({
									container: {},
									label: { padding: "4px", width: "2em", textAlign: "center" },
									labelFocus: { background: "#666" },
									tab: {
										height: "251px",
										display: "flex",
										flexDirection: "column",
										padding: "6px",
									},
								})((_, n) => updateAt("logTab")(n)(c))(
									Function_pipe(Array_makeBy(logPageCount, x => `${x}`)),
								)(
									Function_pipe(getState("eventLog")(s), l =>
										Array_makeBy(
											logPageCount,
											i => () =>
												Function_pipe(
													Array_get(l.compressedBlocks, i),
													map(decompressBlock),
													getOrElse(() => l.lastBlock),
													Array_map((x, j) =>
														h("div", { style: { display: "flex" } }, [
															h(
																"div",
																{
																	style: {
																		userSelect: "none",
																		flex: "0 0 2em",
																	},
																},
																hyperapp_text(x.id),
															),
															h(
																"div",
																{
																	style: {
																		background: j % 2 == 0 ? "#fff" : "#ddd",
																		color: "#000",
																		flex: "auto",
																		wordBreak: "break-all",
																		whiteSpace: "break-spaces",
																		padding: "0 2px",
																	},
																},
																hyperapp_text(`[${x.level}] ${x.text}`),
															),
														]),
													),
												),
										),
									),
								)(getState("logTab")(s)),
							]),
						]),
					],
				),
			textAreaRow = (rows, action) => value =>
				h("textarea", {
					rows,
					style: {
						resize: "none",
						boxSizing: "border-box",
						width: "100%",
						borderColor: hasError(value) ? "#f55" : null,
					},
					value: Function_pipe(
						value,
						Editable_text,
						getOrElse(
							Function_pipe(Editable_value(value), join("\n"), constant),
						),
					),
					...action,
				}),
			textAreaNode =
				setter => (editAction, getText, getState) => (label, rows) => c => s =>
					settingRow(
						getText(label)(s),
						errorText(getText("invalidSetting")(s))(getState(label)(s)),
						[
							textAreaRow(
								rows,
								editAction(label, setter)(c),
							)(getState(label)(s)),
						],
					),
			settingUI_plainTextAreaNode = textAreaNode(
				editing => value =>
					Function_pipe(
						value,
						String_split(/\r\n|\n/),
						Array_filter(not(String_isEmpty)),
						regexes => ({
							regexes,
							errors: Function_pipe(
								regexes,
								Array_map((x, i) => {
									try {
										RegExp(x, "u")
										return Option_none()
									} catch (e) {
										return Option_some(`${e} in regex number ${i}`)
									}
								}),
								Array_getSomes,
								Array_reduce("", (b, a) => `${b}\n${a}`),
								liftPredicate(String_isNonEmpty),
							),
						}),
						ctx =>
							editing
								? setText(value)
								: Function_pipe(
										ctx.errors,
										map(x =>
											mapSecond(() => Option_some([value, Option_some(x)])),
										),
										getOrElse(() => () => Editable_of(ctx.regexes)),
									),
					),
			)(editAction, getText, getState),
			settingUI_regexTextAreaNode = textAreaNode(
				editing => value =>
					Function_pipe(
						value,
						String_split(/\r\n|\n/),
						Array_filter(not(String_isEmpty)),
						x =>
							constant(
								editing
									? [x, Option_some([value, Option_none()])]
									: Editable_of(x),
							),
					),
			)(editAction, getText, getState),
			filterPanelOld = c => s => [
				h(
					"div",
					{ style: panelBoxStyle(212) },
					settingUI_plainTextAreaNode("bannedWords", 18)(c)(s),
				),
				h(
					"div",
					{ style: panelBoxStyle(212) },
					settingUI_regexTextAreaNode("bannedWordRegexes", 18)(c)(s),
				),
				h(
					"div",
					{ style: panelBoxStyle(212) },
					settingUI_plainTextAreaNode("bannedUsers", 18)(c)(s),
				),
			],
			colorPicker = action => color =>
				h("input", {
					style: { width: "36px", verticalAlign: "middle" },
					type: "color",
					value: color,
					oninput: action.onchange ?? Function_identity,
				}),
			textInput = action => value =>
				h("input", {
					style: {
						verticalAlign: "middle",
						width: "5.5em",
						borderColor: hasError(value) ? "#f55" : null,
					},
					maxlength: 20,
					value: Function_pipe(
						value,
						Editable_text,
						getOrElse(constant(Editable_value(value))),
					),
					...action,
				})
		var validate_color_lib = __webpack_require__(742),
			lib_default = __webpack_require__.n(validate_color_lib)
		const setter_setEditColor = editing => value =>
				editing
					? lib_default()(value)
						? constant(fromValueText(value)(value))
						: setText(value)
					: lib_default()(value)
						? constant(Editable_of(value))
						: mapSecond(constant(Option_some([value, Option_some("")]))),
			settingUI_colorNode = (
				(editAction, getText, getState) => label => c => s =>
					settingRow(
						getText(label)(s),
						errorText(getText("invalidColor")(s))(getState(label)(s)),
						Function_pipe(editAction(label, setter_setEditColor)(c), x => [
							colorPicker(x)(Editable_value(getState(label)(s))),
							textInput(x)(getState(label)(s)),
						]),
					)
			)(editAction, getText, getState),
			settingUI_intNode = numericNode(
				editing => value => state =>
					Function_pipe(
						value,
						Number.parseInt,
						editing
							? x =>
									Number.isNaN(x) || "." === value.at(-1)
										? Function_pipe(state, setText(value))
										: fromValueText(x)(value)
							: x =>
									Number.isNaN(x)
										? Function_pipe(
												state,
												mapSecond(
													constant(Option_some([value, Option_some("")])),
												),
											)
										: Editable_of(x),
					),
			)(editAction, getText, getState),
			setter_setEditString = editing => x =>
				constant(editing ? fromValueText(x)(x) : Editable_of(x)),
			fonts = currentFont => [
				["", "Default", "デフォルト", "Default"],
				["arial", "Arial", "Arial", "Arial"],
				["arial black", "Arial Black", "Arial Black", "Arial Black"],
				["arial narrow", "Arial Narrow", "Arial Narrow", "Arial Narrow"],
				["Century", "Century", "Century", "Century"],
				["Comic Sans MS", "Comic Sans MS", "Comic Sans MS", "Comic Sans MS"],
				["Courier", "Courier", "Courier", "Courier"],
				["cursive", "cursive", "cursive", "cursive"],
				["fantasy", "fantasy", "fantasy", "fantasy"],
				["Impact", "Impact", "Impact", "Impact"],
				["Meiryo", "Meiryo", "メイリオ", "Meiryo"],
				["Meiryo UI", "Meiryo UI", "メイリオ UI", "Meiryo UI"],
				["monospace", "monospace", "monospace", "monospace"],
				[
					"Monotype Corsiva",
					"Monotype Corsiva",
					"Monotype Corsiva",
					"Monotype Corsiva",
				],
				["MS PGothic", "MS PGothic", "MS Pゴシック", "MS PGothic"],
				["MS Gothic", "MS Gothic", "MS ゴシック", "MS Gothic"],
				["MS Sans Serif", "MS Sans Serif", "MS Sans Serif", "MS Sans Serif"],
				["MS Serif", "MS Serif", "MS Serif", "MS Serif"],
				["MS UI Gothic", "MS UI Gothic", "MS UI Gothic", "MS UI Gothic"],
				["sans-serif", "Sans-serif", "Sans-serif", "Sans-serif"],
				["serif", "Serif", "Serif", "Serif"],
				[
					"Times New Roman",
					"Times New Roman",
					"Times New Roman",
					"Times New Roman",
				],
				["Yu Gothic", "Yu Gothic", "遊ゴシック", "Yu Gothic"],
				["YuGothic", "YuGothic", "游ゴシック体", "YuGothic"],
				[currentFont, "Custom", "カスタム", "自定义"],
			],
			settingUI_textRowStyle = { width: "70%", boxSizing: "border-box" },
			colorTextOutput = textStyle => color =>
				h(
					"span",
					{ style: { ...textStyle, color } },
					hyperapp_text("Aa1あア亜"),
				),
			settingUI_textColorNode = (
				(editAction, getText, getState, getExampleTextStyle) =>
				label =>
				c =>
				s =>
					settingRow(
						getText(label)(s),
						errorText(getText("invalidColor")(s))(getState(label)(s)),
						Function_pipe(
							{
								a: editAction(label, setter_setEditColor)(c),
								v: Editable_value(getState(label)(s)),
							},
							({ a, v }) => [
								colorPicker(a)(v),
								textInput(a)(getState(label)(s)),
								colorTextOutput(getExampleTextStyle(s))(v),
							],
						),
					)
			)(editAction, getText, getState, s => ({
				fontFamily: Editable_value(s.font),
				fontWeight: Editable_value(s.fontWeight).toString(),
				textShadow: textShadow(Editable_value(s.shadowColor))(
					Editable_value(s.shadowFontWeight),
				),
			})),
			flowChatPanel = Function_pipe(
				[
					Function_pipe(
						[
							c => s =>
								Function_pipe(Editable_value(s.font), font =>
									settingRow(getText("font")(s), "", [
										h(
											"select",
											{
												style: settingUI_textRowStyle,
												onchange: updateInput("font")(setter_setEditString(!1))(
													c,
												),
											},
											Function_pipe(
												fonts(font),
												findFirstIndex(x => x[0] === font),
												getOrElse(() => 0),
												index =>
													Function_pipe(
														fonts(font),
														Array_map((f, i) =>
															node_option(
																f[0],
																Function_pipe(
																	languages,
																	findFirstIndex(x => x === s.lang),
																	map(x => Array_unsafeGet(x + 1)(f)),
																	getOrElse(() => "Error"),
																),
																i === index,
															),
														),
													),
											),
										),
										h("input", {
											style: settingUI_textRowStyle,
											maxlength: 20,
											value: font,
											...editAction("font", setter_setEditString),
										}),
									]),
								),
							settingUI_textColorNode("color"),
							settingUI_textColorNode("ownerColor"),
							settingUI_textColorNode("moderatorColor"),
							settingUI_textColorNode("memberColor"),
							settingUI_colorNode("shadowColor"),
						],
						mapSettingNodes(x => h("div", { style: panelBoxStyle(212) }, x)),
					),
					Function_pipe(
						[
							settingUI_numberNode("chatOpacity", 0, 1, 0.05),
							settingUI_numberNode("fontSize", 0.3, 2, 0.05),
							settingUI_numberNode("fontWeight", 10, 1e3, 10),
							settingUI_numberNode("shadowFontWeight", 0, 3, 0.1),
							settingUI_numberNode("flowSpeed", 1, 50, 1),
							settingUI_intNode("maxChatCount", 5, 200, 5),
							settingUI_intNode("maxChatLength", 5, 200, 5),
							settingUI_intNode("laneCount", 1, 25, 1),
						],
						mapSettingNodes(x => h("div", { style: panelBoxStyle(212) }, x)),
					),
					Function_pipe(
						[
							settingUI_numberNode("flowY1", 0, 0.95, 0.01),
							settingUI_numberNode("flowY2", 0.05, 1, 0.01),
							settingUI_numberNode("flowX1", 0, 0.95, 0.01),
							settingUI_numberNode("flowX2", 0.05, 1, 0.01),
							settingUI_numberNode("minSpacing", 0, 2.5, 0.1),
							c => s =>
								h("div", {}, [
									settingUI_checkboxNode("useStepTiming")(c)(s),
									h(
										"div",
										{
											style: {
												opacity: getState("useStepTiming")(s) ? null : "0.5",
											},
										},
										settingUI_intNode("timingStepCount", 1, 400, 1)(c)(s),
									),
								]),
							settingUI_checkboxNode("createChats"),
							settingUI_checkboxNode("displayModName"),
							settingUI_checkboxNode("displaySuperChatAuthor"),
							settingUI_checkboxNode("textOnly"),
							() => s => hyperapp_text(getText("flowNewChatIf")(s)),
							settingUI_checkboxNode("noOverlap"),
							buttonNode("clearFlowChats"),
						],
						mapSettingNodes(x => h("div", { style: panelBoxStyle(212) }, x)),
					),
				],
				mapSettingNodes(Function_identity),
			),
			settingUI_flowChatPanel = flowChatPanel,
			withMinimumLogLevel = Function_dual(2, (self, level) =>
				fiberRefLocally(currentMinimumLogLevel, level)(self),
			),
			Logger_make = makeLogger,
			Logger_replace = Function_dual(2, (self, that) =>
				layer_flatMap(
					scopedDiscard(
						fiberRefLocallyScopedWith(currentLoggers, HashSet_remove(self)),
					),
					() =>
						scopedDiscard(
							fiberRefLocallyScopedWith(currentLoggers, HashSet_add(that)),
						),
				),
			),
			Logger_withMinimumLogLevel = withMinimumLogLevel,
			Logger_zip = logger_zip,
			Logger_defaultLogger = defaultLogger
		var LogAnnotationKeys
		!(function (LogAnnotationKeys) {
			LogAnnotationKeys.name = "name"
		})(LogAnnotationKeys || (LogAnnotationKeys = {}))
		const src_LogAnnotationKeys = LogAnnotationKeys,
			maxEventLogBlockCount = Math.floor(50),
			preserveEventLogBlockCount = Math.floor(0.2 * maxEventLogBlockCount),
			Console_debug = (...args) => consoleWith(_ => _.debug(...args)),
			Console_error = (...args) => consoleWith(_ => _.error(...args)),
			Console_info = (...args) => consoleWith(_ => _.info(...args)),
			Console_log = (...args) => consoleWith(_ => _.log(...args)),
			Console_trace = (...args) => consoleWith(_ => _.trace(...args)),
			Console_warn = (...args) => consoleWith(_ => _.warn(...args)),
			getConsoleLog = x =>
				x === Trace
					? Console_trace
					: x === Debug
						? Console_debug
						: x === Info
							? Console_info
							: x === Warning
								? Console_warn
								: x === LogLevel_Error || x === Fatal
									? Console_error
									: Console_log,
			metaLogger = Logger_make(({ logLevel, message, context, annotations }) =>
				Effect_runPromise(
					Function_pipe(
						() =>
							`${Function_pipe(annotations, HashMap_get(src_LogAnnotationKeys.name), match({ onNone: () => "", onSome: x => `[${x}] ` }))}${message}`,
						getStr =>
							Function_pipe(
								FiberRefs_getOrDefault(context, logMeta),
								match({
									onNone: () =>
										greaterThanEqual(Warning)(logLevel)
											? getConsoleLog(logLevel)(getStr())
											: _void,
									onSome: meta =>
										Effect_sync(() =>
											getConsoleLog(logLevel)(`${getStr()}: `, meta),
										),
								}),
							),
					),
				),
			),
			provideLog = settingUpdateApps => effect => {
				return Function_pipe(
					Effect_succeed(
						Logger_replace(
							Logger_defaultLogger,
							Logger_zip(metaLogger)(
								((apps = settingUpdateApps),
								Logger_make(({ logLevel, message }) =>
									Effect_runPromise(
										(
											apps => dispatchable =>
												Function_pipe(
													apps,
													Effect_forEach(x =>
														Effect_sync(() => x(dispatchable)),
													),
												)
										)(apps.getValue())(s => {
											return s.logEvents
												? {
														...s,
														eventLog: ((text = String(message)),
														(level = logLevel.label),
														x =>
															Function_pipe(
																x.compressedBlocks.length ===
																	maxEventLogBlockCount
																	? (i => log =>
																			i > log.compressedBlocks.length
																				? log
																				: makeLog({
																						nextId: log.nextId,
																						...(i ===
																						log.compressedBlocks.length
																							? {
																									lastBlock: [],
																									compressedBlocks:
																										log.compressedBlocks,
																								}
																							: {
																									lastBlock: log.lastBlock,
																									compressedBlocks:
																										Array_remove(
																											log.compressedBlocks,
																											i,
																										),
																								}),
																					}))(
																			Math.floor(preserveEventLogBlockCount),
																		)(x)
																	: x,
																(
																	(text, level) => log =>
																		makeLog({
																			nextId: log.nextId + 1,
																			...Function_pipe(
																				log.lastBlock,
																				Array_append({
																					id: log.nextId,
																					text,
																					level,
																				}),
																				x =>
																					200 === x.length
																						? {
																								compressedBlocks: Array_append(
																									log.compressedBlocks,
																									makeCompressedLogBlock(
																										(0,
																										external_LZString_namespaceObject.compressToUTF16)(
																											JSON.stringify(x),
																										),
																									),
																								),
																								lastBlock: [],
																							}
																						: {
																								compressedBlocks:
																									log.compressedBlocks,
																								lastBlock: x,
																							},
																			),
																		})
																)(text, level),
															))(s.eventLog),
													}
												: s
											var text, level
										}),
									),
								)),
							),
						),
					),
					Effect_flatMap(logLayer =>
						Function_pipe(
							effect,
							Effect_tapErrorCause(x => Effect_logError(Cause_pretty(x))),
							Effect_provide(logLayer),
						),
					),
					Effect_annotateLogs(src_LogAnnotationKeys.name, "FYC"),
					Logger_withMinimumLogLevel(Debug),
				)
				var apps
			}
		Effect_runPromise(
			Function_pipe(
				Effect_gen(function* () {
					const settingUpdateApps =
						new external_rxjs_namespaceObject.BehaviorSubject([])
					yield* (({ settingUpdateApps, provideLog }) =>
						provideLog(
							Function_pipe(
								Effect_gen(function* () {
									const ctx = {
											updateSettingState: dispatchable =>
												provideLog(
													Function_pipe(
														Effect_succeed(settingUpdateApps.value),
														Effect_flatMap(
															Effect_forEach(x =>
																Effect_sync(() => x(dispatchable)),
															),
														),
													),
												),
											configSubject: makeSubject(configKeys),
											channel: new broadcast_channel_BroadcastChannel(
												"fyc-0615654655528523",
											),
											configValue: yield* ((config = src_defaultGMConfig),
											Function_pipe(
												Object.entries(config),
												Effect_forEach(([k, c]) =>
													c.getValue.pipe(Effect_map(x => [k, x])),
												),
												Effect_map(Object.fromEntries),
											)),
										},
										setterFromMap =
											((keys = configKeys),
											f =>
												Function_pipe(
													keys,
													Array_map(x => [x, f(x)]),
													Object.fromEntries,
												)),
										setConfigPlain = setterFromMap(
											key => val =>
												Effect_sync(() => {
													Object.assign(ctx.configValue, { [key]: val })
													ctx.configSubject[key].next(val)
												}),
										)
									var keys, config
									yield* setConfigPlain.filterExp(
										defaultFilter(ctx.configValue),
									)
									const changedConfigMap = key => val =>
										Function_pipe(
											Effect_sync(() => ctx.configValue[key]),
											Effect_filterOrFail(
												x => !fast_deep_equal_default()(x, val),
											),
											Effect_flatMap(() => setConfigPlain[key](val)),
										)
									return {
										...ctx,
										setChangedConfig: setterFromMap(
											key => val =>
												changedConfigMap(key)(val).pipe(Effect_ignore),
										),
										mainState: {
											chatPlaying: yield* SynchronizedRef_make(!0),
											playerRect: yield* SynchronizedRef_make(
												new DOMRectReadOnly(0, 0, 600, 400),
											),
											flowChats: yield* SynchronizedRef_make([]),
											config: {
												value: ctx.configValue,
												getConfig: makeGetter(ctx.configValue),
												setConfig: setterFromMap(
													key => val =>
														changedConfigMap(key)(val).pipe(
															Effect_zipRight(
																Effect_promise(() =>
																	ctx.channel.postMessage([key, val]),
																),
															),
															Effect_zipRight(
																Effect_promise(() =>
																	Function_pipe(src_defaultGMConfig[key], x =>
																		GM.setValue(x.gmKey, x.toGm(val)),
																	),
																),
															),
															Effect_ignore,
														),
												),
											},
										},
									}
								}),
								Effect_flatMap(ctx =>
									Effect_gen(function* () {
										const stateInit = Function_pipe(
											(config = ctx.mainState.config.value),
											mapObject(([k, v]) => [
												k,
												isEditable(k)(v)
													? Editable_of(v)
													: "filterExp" === k
														? void 0
														: v,
											]),
											x => ({
												...x,
												showPanel: !1,
												mainTab: 0,
												logTab: 0,
												timingStepCount: Editable_of(
													parseInt(
														config.timingFunction.match(
															/^steps\((\d+),.+/,
														)?.[1] ?? "150",
														10,
													),
												),
												eventLog: makeLog({
													nextId: 0,
													compressedBlocks: [],
													lastBlock: [],
												}),
												panelRect: new DOMRectReadOnly(0, 0, 660, 395),
											}),
										)
										var config, updateState, command, setConfig
										return {
											...ctx,
											apps: {
												toggleChatButtonApp: yield* wrapApp(
													((setConfig = ctx.mainState.config.setConfig),
													Function_pipe(
														"button",
														makeComponent(
															tag => state =>
																Function_pipe(
																	getText(
																		state.displayChats
																			? "hideChats"
																			: "showChats",
																	)(state),
																	label =>
																		h(
																			tag,
																			{
																				class: "ytp-button",
																				style: {
																					background: "none",
																					border: "none",
																					cursor: "pointer",
																					float: "left",
																					fontSize: "1em",
																					height: "100%",
																					outline: "none",
																					overflow: "visible",
																					padding: "0 0 0em",
																					position: "relative",
																					width: "48px",
																					display: "flex",
																					alignItems: "center",
																				},
																				type: "button",
																				"aria-label": label,
																				title: label,
																				onclick: s =>
																					Function_pipe(
																						!s.displayChats,
																						displayChats => [
																							{ ...s, displayChats },
																							() =>
																								Effect_runPromise(
																									setConfig.displayChats(
																										displayChats,
																									),
																								),
																						],
																					),
																			},
																			[
																				h(
																					"svg",
																					{
																						style: { width: "36px" },
																						viewBox: "0 0 36 36",
																					},
																					[
																						h("path", {
																							class: "chat-button-path",
																							d: "m11 12h17q1 0 1 1v9q0 1-1 1h-1v2l-4-2h-12q-1 0-1-1v-9q0-1 1-1z",
																							fill: "#fff",
																							"fill-opacity": state.displayChats
																								? "1"
																								: "0",
																							stroke: "#fff",
																							"stroke-width": "2",
																						}),
																					],
																				),
																			],
																		),
																),
														),
													)),
													stateInit,
												),
												settingsApp: yield* wrapApp(
													((command = {
														setConfig: ctx.mainState.config.setConfig,
														act: {
															clearFlowChats: removeOldChats(
																ctx.mainState.flowChats,
															)(0),
														},
														provideLog,
													}),
													Function_pipe(
														(c => state => {
															return state.showPanel
																? h(
																		"div",
																		{
																			class: "fyc_panel",
																			style: {
																				backgroundColor: "rgba(30,30,30,0.9)",
																				position: "absolute",
																				zIndex: "66666",
																				color: "#fff",
																				fontSize: "14px",
																				overflow: "auto",
																				left: `${state.panelRect.x}px`,
																				top: `${state.panelRect.y}px`,
																				width: `${state.panelRect.width}px`,
																				height: `${state.panelRect.height}px`,
																				border: "solid 1px #666",
																				fontFamily: "MS PGothic",
																				lineHeight: "1.2",
																				colorScheme: "dark",
																			},
																		},
																		[
																			h(
																				"div",
																				{
																					style: {
																						position: "absolute",
																						inset: "3px 3px auto auto",
																					},
																				},
																				[
																					hyperapp_text("🌐"),
																					h(
																						"select",
																						{
																							onchange: updateInput("lang")(
																								((allowedStrings = languages),
																								value => state =>
																									Function_pipe(
																										value,
																										liftPredicate(x =>
																											Array_containsWith(
																												String_Equivalence,
																											)(allowedStrings, x),
																										),
																										getOrElse(() => state),
																									)),
																							)(c),
																						},
																						Function_pipe(
																							languages,
																							Array_zip(languageLabels),
																							Array_map(([lang, label]) =>
																								node_option(
																									lang,
																									label,
																									lang === state.lang,
																								),
																							),
																						),
																					),
																				],
																			),
																			tabContainer({
																				container: {},
																				label: { padding: "6px" },
																				labelFocus: { background: "#666" },
																				tab: {
																					height: "364px",
																					display: "flex",
																					padding: "6px",
																				},
																			})((s, n) =>
																				updateAt("mainTab")(n)(c)(s),
																			)(
																				Function_pipe(
																					[
																						"flowChat",
																						"chatFilter",
																						"chatField",
																						"feedback",
																					],
																					Array_map(getText),
																					Array_map(apply(state)),
																				),
																			)(
																				Function_pipe(
																					[
																						settingUI_flowChatPanel,
																						filterPanelOld,
																						settingUI_chatFieldPanel,
																						feedbackPanel,
																					],
																					Array_map(apply(c)),
																					Array_map(constant),
																					Array_map(flip),
																					Array_map(apply(state)),
																				),
																			)(getState("mainTab")(state)),
																		],
																	)
																: h("div", {})
															var allowedStrings
														})(command),
														panel =>
															makeComponent(
																tag => s =>
																	h(
																		tag,
																		{ style: { display: "contents" } },
																		panel(s),
																	),
															)("span"),
													)),
													stateInit,
												),
												toggleSettingsPanelApp: yield* wrapApp(
													((updateState = ctx.updateSettingState),
													Function_pipe(
														(
															updateState => (x, e) =>
																Function_pipe(
																	{ ...x, showPanel: !x.showPanel },
																	newState => [
																		newState,
																		x.showPanel
																			? () =>
																					decodeUnknownSync(
																						instanceOf(HTMLElement),
																					)(e.currentTarget).blur()
																			: () => {},
																		() =>
																			Effect_runPromise(
																				updateState(oldState => ({
																					...oldState,
																					...newState,
																				})),
																			),
																	],
																)
														)(updateState),
														toggle => state =>
															h(
																"button",
																{
																	class: "fyc_button",
																	style: {
																		background: "rgba(0,0,0,0)",
																		marginLeft: "10px",
																		whiteSpace: "nowrap",
																	},
																	onclick: toggle,
																},
																[
																	h(
																		"svg",
																		{
																			preserveAspectRatio: "xMidYMid meet",
																			viewBox: "0 0 640 640",
																			width: "15",
																			height: "15",
																			style: {
																				position: "relative",
																				top: "1px",
																			},
																		},
																		[
																			h(
																				"defs",
																				{},
																				h("path", {
																					id: "d1TbzTC1zI",
																					d: "M135 58c25 14 67 30 82 35-7 49 16 109-15 149-50 71-19 184 64 213 74 31 165-18 183-95-3-38 23-62 58-36l120 55c-39 10-106 35-72 85 40 38 1 71-29 98-29 53-70-17-109-5-46 22-25 109-96 85h-55c-24-31-21-103-80-84-32 32-70 31-93-9l-35-36c4-40 57-96-6-120-45 5-58-32-52-68 2-19-4-41 3-59 35-15 100-22 77-79-48-43 1-84 35-115 5-6 12-12 20-14zM577 2c52 3 72 62 62 106-5 51 19 117-27 155-18 24 8 49 11 74-39-8-98-46-146-60-55-1-111 2-167-2-52-15-57-76-52-121S242 52 282 18c38-30 88-11 132-16h163z",
																				}),
																			),
																			h("use", {
																				href: "#d1TbzTC1zI",
																				opacity: "1",
																				fill: "var(--iron-icon-fill-color, currentcolor)",
																				"fill-opacity": "1",
																			}),
																		],
																	),
																	h(
																		"span",
																		{
																			style: {
																				position: "relative",
																				top: "-2px",
																				marginLeft: "8px,",
																			},
																		},
																		hyperapp_text(getText("setting")(state)),
																	),
																],
															),
														button =>
															makeComponent(
																tag => s =>
																	h(
																		tag,
																		{
																			style: {
																				float: "left",
																				display: "flex",
																				minHeight: "100%",
																			},
																		},
																		button(s),
																	),
															)("span"),
													)),
													stateInit,
												),
											},
										}
									}),
								),
								Effect_tap(ctx =>
									Effect_sync(() =>
										settingUpdateApps.next(
											Array_map(
												[
													ctx.apps.settingsApp,
													ctx.apps.toggleSettingsPanelApp,
													ctx.apps.toggleChatButtonApp,
												],
												x => x.dispatch,
											),
										),
									),
								),
								Effect_tap(ctx =>
									Function_pipe(
										Effect_succeed([
											"Version: 1.19.2",
											`User Agent: ${window.navigator.userAgent}`,
											`GMConfig: ${JSON.stringify(ctx.mainState.config, void 0, "\t")}`,
										]),
										Effect_flatMap(Effect_forEach(x => Effect_logDebug(x))),
									),
								),
								Effect_zipLeft(
									Function_pipe(
										Effect_logDebug("10s..."),
										schedule(Schedule_fixed(seconds(10))),
										Effect_forkDaemon,
									),
								),
								Effect_flatMap(ctx =>
									Effect_gen(function* () {
										const reinitSubject =
												new external_rxjs_namespaceObject.Subject(),
											reinitialize = provideLog(
												Effect_sync(() => {
													requestAnimationFrame(() => lib(reinitSubject)())
												}),
											)
										;(yield* allStream(provideLog)({
											...ctx,
											reinitSubject,
											reinitialize,
											chatScreen: yield* makeChatScreen,
											co: Function_pipe(
												ctx.configSubject,
												mapObject(([k, value]) => [
													k,
													Function_pipe(
														value,
														tapEffect(v => {
															return provideLog(
																Function_pipe(
																	Effect_succeed(s => ({ ...s, [k]: v })),
																	Effect_zipLeft(
																		ctx.updateSettingState(
																			((key = k),
																			value => state => ({
																				...state,
																				[key]: isEditable(key)(value)
																					? setValue(value)(state[key])
																					: "filterExp" === key
																						? void 0
																						: value,
																			}))(v),
																		),
																	),
																	Effect_zipLeft(
																		Function_pipe(
																			[
																				"bannedWords",
																				"bannedUsers",
																				"bannedWordRegexes",
																			],
																			Array_containsWith(String_Equivalence)(k),
																			x =>
																				x
																					? ctx.mainState.config.setConfig.filterExp(
																							defaultFilter(
																								ctx.mainState.config.value,
																							),
																						)
																					: _void,
																		),
																	),
																	x =>
																		Effect_sync(() =>
																			setTimeout(
																				() => Effect_runPromise(provideLog(x)),
																				0,
																			),
																		),
																),
															)
															var key
														}),
														(0, external_rxjs_namespaceObject.share)(),
													),
												]),
											),
										})).subscribe({
											error: x =>
												Effect_runPromise(
													logWithMeta(LogLevel_Error)(`Stream Errored: ${x}`)(
														x,
													),
												),
											complete: () =>
												Effect_runPromise(Effect_logWarning("Stream complete")),
										})
										yield* reinitialize
									}),
								),
							),
						))({ settingUpdateApps, provideLog: provideLog(settingUpdateApps) })
				}),
				Effect_withConcurrency(30),
			),
		)
	})()
})()
