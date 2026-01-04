// ==UserScript==
// @name            学在浙大/智云课堂 辅助脚本
// @description     学在浙大/智云课堂 辅助脚本 by memset0
// @namespace       https://github.com/memset0/Learning-at-ZJU-Helper
// @homepage        https://github.com/memset0/Learning-at-ZJU-Helper
// @supportURL      https://github.com/memset0/Learning-at-ZJU-Helper/issues
// @match           *://classroom.zju.edu.cn/*
// @match           *://onlineroom.cmc.zju.edu.cn/*
// @match           *://livingroom.cmc.zju.edu.cn/*
// @match           *://interactivemeta.cmc.zju.edu.cn/*
// @match           *://courses.zju.edu.cn/*
// @match           **://pintia.cn/*
// @grant           unsafeWindow
// @grant           GM_setValue
// @grant           GM_getValue
// @grant           GM_addValueChangeListener
// @grant           GM_removeValueChangeListener
// @grant           GM_getResourceText
// @resource        jszip.min.js https://jsd.cdn.zzko.cn/gh/memset0/Learning-at-ZJU-Helper@latest/lib/jszip.min.js
// @encoding        utf-8
// @run-at          document-start
// @version         2.0.4
// @author          memset0
// @license         MIT
// @downloadURL https://update.greasyfork.org/scripts/488869/%E5%AD%A6%E5%9C%A8%E6%B5%99%E5%A4%A7%E6%99%BA%E4%BA%91%E8%AF%BE%E5%A0%82%20%E8%BE%85%E5%8A%A9%E8%84%9A%E6%9C%AC.user.js
// @updateURL https://update.greasyfork.org/scripts/488869/%E5%AD%A6%E5%9C%A8%E6%B5%99%E5%A4%A7%E6%99%BA%E4%BA%91%E8%AF%BE%E5%A0%82%20%E8%BE%85%E5%8A%A9%E8%84%9A%E6%9C%AC.meta.js
// ==/UserScript==


/*! For license information please see bundle.js.LICENSE.txt */
(() => {
	var e = {
			6741: (e, t, r) => {
				"use strict";
				r.r(t), r.d(t, {
					load: () => u,
					name: () => s,
					namespace: () => c
				});
				var o = r(2266);

				function i(e) {
					return i = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function(e) {
						return typeof e
					} : function(e) {
						return e && "function" == typeof Symbol && e.constructor === Symbol && e !== Symbol.prototype ? "symbol" : typeof e
					}, i(e)
				}

				function a() {
					a = function() {
						return t
					};
					var e, t = {},
						r = Object.prototype,
						o = r.hasOwnProperty,
						n = Object.defineProperty || function(e, t, r) {
							e[t] = r.value
						},
						_ = "function" == typeof Symbol ? Symbol : {},
						s = _.iterator || "@@iterator",
						c = _.asyncIterator || "@@asyncIterator",
						l = _.toStringTag || "@@toStringTag";

					function u(e, t, r) {
						return Object.defineProperty(e, t, {
							value: r,
							enumerable: !0,
							configurable: !0,
							writable: !0
						}), e[t]
					}
					try {
						u({}, "")
					} catch (e) {
						u = function(e, t, r) {
							return e[t] = r
						}
					}

					function d(e, t, r, o) {
						var i = t && t.prototype instanceof b ? t : b,
							a = Object.create(i.prototype),
							_ = new E(o || []);
						return n(a, "_invoke", {
							value: T(e, r, _)
						}), a
					}

					function p(e, t, r) {
						try {
							return {
								type: "normal",
								arg: e.call(t, r)
							}
						} catch (e) {
							return {
								type: "throw",
								arg: e
							}
						}
					}
					t.wrap = d;
					var h = "suspendedStart",
						v = "suspendedYield",
						f = "executing",
						m = "completed",
						g = {};

					function b() {}

					function y() {}

					function C() {}
					var w = {};
					u(w, s, (function() {
						return this
					}));
					var x = Object.getPrototypeOf,
						k = x && x(x(P([])));
					k && k !== r && o.call(k, s) && (w = k);
					var S = C.prototype = b.prototype = Object.create(w);

					function B(e) {
						["next", "throw", "return"].forEach((function(t) {
							u(e, t, (function(e) {
								return this._invoke(t, e)
							}))
						}))
					}

					function A(e, t) {
						function r(a, n, _, s) {
							var c = p(e[a], e, n);
							if ("throw" !== c.type) {
								var l = c.arg,
									u = l.value;
								return u && "object" == i(u) && o.call(u, "__await") ? t.resolve(u.__await).then((function(e) {
									r("next", e, _, s)
								}), (function(e) {
									r("throw", e, _, s)
								})) : t.resolve(u).then((function(e) {
									l.value = e, _(l)
								}), (function(e) {
									return r("throw", e, _, s)
								}))
							}
							s(c.arg)
						}
						var a;
						n(this, "_invoke", {
							value: function(e, o) {
								function i() {
									return new t((function(t, i) {
										r(e, o, t, i)
									}))
								}
								return a = a ? a.then(i, i) : i()
							}
						})
					}

					function T(t, r, o) {
						var i = h;
						return function(a, n) {
							if (i === f) throw Error("Generator is already running");
							if (i === m) {
								if ("throw" === a) throw n;
								return {
									value: e,
									done: !0
								}
							}
							for (o.method = a, o.arg = n;;) {
								var _ = o.delegate;
								if (_) {
									var s = I(_, o);
									if (s) {
										if (s === g) continue;
										return s
									}
								}
								if ("next" === o.method) o.sent = o._sent = o.arg;
								else if ("throw" === o.method) {
									if (i === h) throw i = m, o.arg;
									o.dispatchException(o.arg)
								} else "return" === o.method && o.abrupt("return", o.arg);
								i = f;
								var c = p(t, r, o);
								if ("normal" === c.type) {
									if (i = o.done ? m : v, c.arg === g) continue;
									return {
										value: c.arg,
										done: o.done
									}
								}
								"throw" === c.type && (i = m, o.method = "throw", o.arg = c.arg)
							}
						}
					}

					function I(t, r) {
						var o = r.method,
							i = t.iterator[o];
						if (i === e) return r.delegate = null, "throw" === o && t.iterator.return && (r.method = "return", r.arg = e, I(t, r), "throw" === r.method) || "return" !== o && (r.method = "throw", r.arg = new TypeError("The iterator does not provide a '" + o + "' method")), g;
						var a = p(i, t.iterator, r.arg);
						if ("throw" === a.type) return r.method = "throw", r.arg = a.arg, r.delegate = null, g;
						var n = a.arg;
						return n ? n.done ? (r[t.resultName] = n.value, r.next = t.nextLoc, "return" !== r.method && (r.method = "next", r.arg = e), r.delegate = null, g) : n : (r.method = "throw", r.arg = new TypeError("iterator result is not an object"), r.delegate = null, g)
					}

					function q(e) {
						var t = {
							tryLoc: e[0]
						};
						1 in e && (t.catchLoc = e[1]), 2 in e && (t.finallyLoc = e[2], t.afterLoc = e[3]), this.tryEntries.push(t)
					}

					function L(e) {
						var t = e.completion || {};
						t.type = "normal", delete t.arg, e.completion = t
					}

					function E(e) {
						this.tryEntries = [{
							tryLoc: "root"
						}], e.forEach(q, this), this.reset(!0)
					}

					function P(t) {
						if (t || "" === t) {
							var r = t[s];
							if (r) return r.call(t);
							if ("function" == typeof t.next) return t;
							if (!isNaN(t.length)) {
								var a = -1,
									n = function r() {
										for (; ++a < t.length;)
											if (o.call(t, a)) return r.value = t[a], r.done = !1, r;
										return r.value = e, r.done = !0, r
									};
								return n.next = n
							}
						}
						throw new TypeError(i(t) + " is not iterable")
					}
					return y.prototype = C, n(S, "constructor", {
						value: C,
						configurable: !0
					}), n(C, "constructor", {
						value: y,
						configurable: !0
					}), y.displayName = u(C, l, "GeneratorFunction"), t.isGeneratorFunction = function(e) {
						var t = "function" == typeof e && e.constructor;
						return !!t && (t === y || "GeneratorFunction" === (t.displayName || t.name))
					}, t.mark = function(e) {
						return Object.setPrototypeOf ? Object.setPrototypeOf(e, C) : (e.__proto__ = C, u(e, l, "GeneratorFunction")), e.prototype = Object.create(S), e
					}, t.awrap = function(e) {
						return {
							__await: e
						}
					}, B(A.prototype), u(A.prototype, c, (function() {
						return this
					})), t.AsyncIterator = A, t.async = function(e, r, o, i, a) {
						void 0 === a && (a = Promise);
						var n = new A(d(e, r, o, i), a);
						return t.isGeneratorFunction(r) ? n : n.next().then((function(e) {
							return e.done ? e.value : n.next()
						}))
					}, B(S), u(S, l, "Generator"), u(S, s, (function() {
						return this
					})), u(S, "toString", (function() {
						return "[object Generator]"
					})), t.keys = function(e) {
						var t = Object(e),
							r = [];
						for (var o in t) r.push(o);
						return r.reverse(),
							function e() {
								for (; r.length;) {
									var o = r.pop();
									if (o in t) return e.value = o, e.done = !1, e
								}
								return e.done = !0, e
							}
					}, t.values = P, E.prototype = {
						constructor: E,
						reset: function(t) {
							if (this.prev = 0, this.next = 0, this.sent = this._sent = e, this.done = !1, this.delegate = null, this.method = "next", this.arg = e, this.tryEntries.forEach(L), !t)
								for (var r in this) "t" === r.charAt(0) && o.call(this, r) && !isNaN(+r.slice(1)) && (this[r] = e)
						},
						stop: function() {
							this.done = !0;
							var e = this.tryEntries[0].completion;
							if ("throw" === e.type) throw e.arg;
							return this.rval
						},
						dispatchException: function(t) {
							if (this.done) throw t;
							var r = this;

							function i(o, i) {
								return _.type = "throw", _.arg = t, r.next = o, i && (r.method = "next", r.arg = e), !!i
							}
							for (var a = this.tryEntries.length - 1; a >= 0; --a) {
								var n = this.tryEntries[a],
									_ = n.completion;
								if ("root" === n.tryLoc) return i("end");
								if (n.tryLoc <= this.prev) {
									var s = o.call(n, "catchLoc"),
										c = o.call(n, "finallyLoc");
									if (s && c) {
										if (this.prev < n.catchLoc) return i(n.catchLoc, !0);
										if (this.prev < n.finallyLoc) return i(n.finallyLoc)
									} else if (s) {
										if (this.prev < n.catchLoc) return i(n.catchLoc, !0)
									} else {
										if (!c) throw Error("try statement without catch or finally");
										if (this.prev < n.finallyLoc) return i(n.finallyLoc)
									}
								}
							}
						},
						abrupt: function(e, t) {
							for (var r = this.tryEntries.length - 1; r >= 0; --r) {
								var i = this.tryEntries[r];
								if (i.tryLoc <= this.prev && o.call(i, "finallyLoc") && this.prev < i.finallyLoc) {
									var a = i;
									break
								}
							}
							a && ("break" === e || "continue" === e) && a.tryLoc <= t && t <= a.finallyLoc && (a = null);
							var n = a ? a.completion : {};
							return n.type = e, n.arg = t, a ? (this.method = "next", this.next = a.finallyLoc, g) : this.complete(n)
						},
						complete: function(e, t) {
							if ("throw" === e.type) throw e.arg;
							return "break" === e.type || "continue" === e.type ? this.next = e.arg : "return" === e.type ? (this.rval = this.arg = e.arg, this.method = "return", this.next = "end") : "normal" === e.type && t && (this.next = t), g
						},
						finish: function(e) {
							for (var t = this.tryEntries.length - 1; t >= 0; --t) {
								var r = this.tryEntries[t];
								if (r.finallyLoc === e) return this.complete(r.completion, r.afterLoc), L(r), g
							}
						},
						catch: function(e) {
							for (var t = this.tryEntries.length - 1; t >= 0; --t) {
								var r = this.tryEntries[t];
								if (r.tryLoc === e) {
									var o = r.completion;
									if ("throw" === o.type) {
										var i = o.arg;
										L(r)
									}
									return i
								}
							}
							throw Error("illegal catch attempt")
						},
						delegateYield: function(t, r, o) {
							return this.delegate = {
								iterator: P(t),
								resultName: r,
								nextLoc: o
							}, "next" === this.method && (this.arg = e), g
						}
					}, t
				}

				function n(e, t, r, o, i, a, n) {
					try {
						var _ = e[a](n),
							s = _.value
					} catch (e) {
						return void r(e)
					}
					_.done ? t(s) : Promise.resolve(s).then(o, i)
				}

				function _(e) {
					return function() {
						var t = this,
							r = arguments;
						return new Promise((function(o, i) {
							var a = e.apply(t, r);

							function _(e) {
								n(a, o, i, _, s, "next", e)
							}

							function s(e) {
								n(a, o, i, _, s, "throw", e)
							}
							_(void 0)
						}))
					}
				}
				var s = "更好的 PTA",
					c = "PTA";

				function l() {
					return location.href + location.hash
				}

				function u(e) {
					var t = e.logger,
						i = e.clipboard;

					function n() {
						return s.apply(this, arguments)
					}

					function s() {
						return (s = _(a().mark((function e() {
							var r, o, n, _;
							return a().wrap((function(e) {
								for (;;) switch (e.prev = e.next) {
									case 0:
										_ = function(e) {
											e.children[0].children[0].appendChild(o(e.children[1]))
										}, n = function(e) {
											e.children[0].appendChild(o(e.children[1]))
										}, o = function(e) {
											var o = document.createElement("button");
											return o.classList.add("mem-pta-btn"), o.innerText = "复制文本", o.onclick = function() {
												o.innerText = "已复制", setTimeout((function() {
													o.innerText = "复制文本"
												}), 500);
												var a = r(e);
												i.copy(a), t.debug("plain text:", a)
											}, o
										}, r = function(e) {
											var t = document.createElement("div");
											return t.appendChild(e.cloneNode(!0)),
												function e(t) {
													for (; t.children.length > 0;) e(t.children[0]);
													t.outerHTML = function(e) {
														return "LABEL" === e.tagName ? "- " + e.innerHTML + "\n\n" : "pc-text-raw" === e.className ? e.innerHTML + " " : "katex-html" === e.className || "mrow" === e.tagName ? "" : "katex" === e.className ? "$" + e.innerHTML + "$" : "IMG" === e.tagName ? "![".concat(e.alt || "", "](").concat(e.src, ")") : "PRE" === e.tagName ? "```\n" + e.innerHTML + "\n```\n" : "P" === e.tagName ? e.innerHTML + "\n\n" : e.innerHTML
													}(t)
												}(t.children[0]), t.innerHTML.replace(/\n{2,}/g, "\n\n").replace(/&lt;/g, "<").replace(/&gt;/g, ">").replace(/&amp;/g, "&").replace(/&nbsp;/g, " ").replace(/&quot;/g, '"').replace(/&apos;/g, "'")
										}, Array.from(document.querySelectorAll(".pc-x:not(.mem-pta-rendered)")).filter((function(e) {
											return !!e.id && (t.debug(e.id), e.classList.add("mem-pta-rendered"), _(e), !0)
										})), Array.from(document.querySelectorAll(".p-4:not(.mem-pta-rendered)")).filter((function(e) {
											return !(!e.children || !e.children.length || "题目描述" != e.children[0].innerText.trim() || (t.debug(e), e.classList.add("mem-pta-rendered"), n(e), 0))
										}));
									case 6:
									case "end":
										return e.stop()
								}
							}), e)
						})))).apply(this, arguments)
					}
					r(9102);
					var c = 20;
					document.addEventListener("click", (function(e) {
						c < 5 && (c = 5)
					}), !0), _(a().mark((function e() {
						var t;
						return a().wrap((function(e) {
							for (;;) switch (e.prev = e.next) {
								case 0:
									t = l();
								case 1:
									return e.next = 4, (0, o.yy)(100);
								case 4:
									if (l() !== t && (t = l(), c = 20), !(c > 0)) {
										e.next = 9;
										break
									}
									return --c, e.next = 9, n();
								case 9:
									e.next = 1;
									break;
								case 11:
								case "end":
									return e.stop()
							}
						}), e)
					})))()
				}
			},
			5221: (e, t, r) => {
				"use strict";
				r.r(t), r.d(t, {
					check: () => d,
					load: () => p,
					name: () => s,
					namespace: () => l,
					required: () => c
				});
				var o = r(2266);

				function i(e) {
					return i = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function(e) {
						return typeof e
					} : function(e) {
						return e && "function" == typeof Symbol && e.constructor === Symbol && e !== Symbol.prototype ? "symbol" : typeof e
					}, i(e)
				}

				function a() {
					a = function() {
						return t
					};
					var e, t = {},
						r = Object.prototype,
						o = r.hasOwnProperty,
						n = Object.defineProperty || function(e, t, r) {
							e[t] = r.value
						},
						_ = "function" == typeof Symbol ? Symbol : {},
						s = _.iterator || "@@iterator",
						c = _.asyncIterator || "@@asyncIterator",
						l = _.toStringTag || "@@toStringTag";

					function u(e, t, r) {
						return Object.defineProperty(e, t, {
							value: r,
							enumerable: !0,
							configurable: !0,
							writable: !0
						}), e[t]
					}
					try {
						u({}, "")
					} catch (e) {
						u = function(e, t, r) {
							return e[t] = r
						}
					}

					function d(e, t, r, o) {
						var i = t && t.prototype instanceof b ? t : b,
							a = Object.create(i.prototype),
							_ = new E(o || []);
						return n(a, "_invoke", {
							value: T(e, r, _)
						}), a
					}

					function p(e, t, r) {
						try {
							return {
								type: "normal",
								arg: e.call(t, r)
							}
						} catch (e) {
							return {
								type: "throw",
								arg: e
							}
						}
					}
					t.wrap = d;
					var h = "suspendedStart",
						v = "suspendedYield",
						f = "executing",
						m = "completed",
						g = {};

					function b() {}

					function y() {}

					function C() {}
					var w = {};
					u(w, s, (function() {
						return this
					}));
					var x = Object.getPrototypeOf,
						k = x && x(x(P([])));
					k && k !== r && o.call(k, s) && (w = k);
					var S = C.prototype = b.prototype = Object.create(w);

					function B(e) {
						["next", "throw", "return"].forEach((function(t) {
							u(e, t, (function(e) {
								return this._invoke(t, e)
							}))
						}))
					}

					function A(e, t) {
						function r(a, n, _, s) {
							var c = p(e[a], e, n);
							if ("throw" !== c.type) {
								var l = c.arg,
									u = l.value;
								return u && "object" == i(u) && o.call(u, "__await") ? t.resolve(u.__await).then((function(e) {
									r("next", e, _, s)
								}), (function(e) {
									r("throw", e, _, s)
								})) : t.resolve(u).then((function(e) {
									l.value = e, _(l)
								}), (function(e) {
									return r("throw", e, _, s)
								}))
							}
							s(c.arg)
						}
						var a;
						n(this, "_invoke", {
							value: function(e, o) {
								function i() {
									return new t((function(t, i) {
										r(e, o, t, i)
									}))
								}
								return a = a ? a.then(i, i) : i()
							}
						})
					}

					function T(t, r, o) {
						var i = h;
						return function(a, n) {
							if (i === f) throw Error("Generator is already running");
							if (i === m) {
								if ("throw" === a) throw n;
								return {
									value: e,
									done: !0
								}
							}
							for (o.method = a, o.arg = n;;) {
								var _ = o.delegate;
								if (_) {
									var s = I(_, o);
									if (s) {
										if (s === g) continue;
										return s
									}
								}
								if ("next" === o.method) o.sent = o._sent = o.arg;
								else if ("throw" === o.method) {
									if (i === h) throw i = m, o.arg;
									o.dispatchException(o.arg)
								} else "return" === o.method && o.abrupt("return", o.arg);
								i = f;
								var c = p(t, r, o);
								if ("normal" === c.type) {
									if (i = o.done ? m : v, c.arg === g) continue;
									return {
										value: c.arg,
										done: o.done
									}
								}
								"throw" === c.type && (i = m, o.method = "throw", o.arg = c.arg)
							}
						}
					}

					function I(t, r) {
						var o = r.method,
							i = t.iterator[o];
						if (i === e) return r.delegate = null, "throw" === o && t.iterator.return && (r.method = "return", r.arg = e, I(t, r), "throw" === r.method) || "return" !== o && (r.method = "throw", r.arg = new TypeError("The iterator does not provide a '" + o + "' method")), g;
						var a = p(i, t.iterator, r.arg);
						if ("throw" === a.type) return r.method = "throw", r.arg = a.arg, r.delegate = null, g;
						var n = a.arg;
						return n ? n.done ? (r[t.resultName] = n.value, r.next = t.nextLoc, "return" !== r.method && (r.method = "next", r.arg = e), r.delegate = null, g) : n : (r.method = "throw", r.arg = new TypeError("iterator result is not an object"), r.delegate = null, g)
					}

					function q(e) {
						var t = {
							tryLoc: e[0]
						};
						1 in e && (t.catchLoc = e[1]), 2 in e && (t.finallyLoc = e[2], t.afterLoc = e[3]), this.tryEntries.push(t)
					}

					function L(e) {
						var t = e.completion || {};
						t.type = "normal", delete t.arg, e.completion = t
					}

					function E(e) {
						this.tryEntries = [{
							tryLoc: "root"
						}], e.forEach(q, this), this.reset(!0)
					}

					function P(t) {
						if (t || "" === t) {
							var r = t[s];
							if (r) return r.call(t);
							if ("function" == typeof t.next) return t;
							if (!isNaN(t.length)) {
								var a = -1,
									n = function r() {
										for (; ++a < t.length;)
											if (o.call(t, a)) return r.value = t[a], r.done = !1, r;
										return r.value = e, r.done = !0, r
									};
								return n.next = n
							}
						}
						throw new TypeError(i(t) + " is not iterable")
					}
					return y.prototype = C, n(S, "constructor", {
						value: C,
						configurable: !0
					}), n(C, "constructor", {
						value: y,
						configurable: !0
					}), y.displayName = u(C, l, "GeneratorFunction"), t.isGeneratorFunction = function(e) {
						var t = "function" == typeof e && e.constructor;
						return !!t && (t === y || "GeneratorFunction" === (t.displayName || t.name))
					}, t.mark = function(e) {
						return Object.setPrototypeOf ? Object.setPrototypeOf(e, C) : (e.__proto__ = C, u(e, l, "GeneratorFunction")), e.prototype = Object.create(S), e
					}, t.awrap = function(e) {
						return {
							__await: e
						}
					}, B(A.prototype), u(A.prototype, c, (function() {
						return this
					})), t.AsyncIterator = A, t.async = function(e, r, o, i, a) {
						void 0 === a && (a = Promise);
						var n = new A(d(e, r, o, i), a);
						return t.isGeneratorFunction(r) ? n : n.next().then((function(e) {
							return e.done ? e.value : n.next()
						}))
					}, B(S), u(S, l, "Generator"), u(S, s, (function() {
						return this
					})), u(S, "toString", (function() {
						return "[object Generator]"
					})), t.keys = function(e) {
						var t = Object(e),
							r = [];
						for (var o in t) r.push(o);
						return r.reverse(),
							function e() {
								for (; r.length;) {
									var o = r.pop();
									if (o in t) return e.value = o, e.done = !1, e
								}
								return e.done = !0, e
							}
					}, t.values = P, E.prototype = {
						constructor: E,
						reset: function(t) {
							if (this.prev = 0, this.next = 0, this.sent = this._sent = e, this.done = !1, this.delegate = null, this.method = "next", this.arg = e, this.tryEntries.forEach(L), !t)
								for (var r in this) "t" === r.charAt(0) && o.call(this, r) && !isNaN(+r.slice(1)) && (this[r] = e)
						},
						stop: function() {
							this.done = !0;
							var e = this.tryEntries[0].completion;
							if ("throw" === e.type) throw e.arg;
							return this.rval
						},
						dispatchException: function(t) {
							if (this.done) throw t;
							var r = this;

							function i(o, i) {
								return _.type = "throw", _.arg = t, r.next = o, i && (r.method = "next", r.arg = e), !!i
							}
							for (var a = this.tryEntries.length - 1; a >= 0; --a) {
								var n = this.tryEntries[a],
									_ = n.completion;
								if ("root" === n.tryLoc) return i("end");
								if (n.tryLoc <= this.prev) {
									var s = o.call(n, "catchLoc"),
										c = o.call(n, "finallyLoc");
									if (s && c) {
										if (this.prev < n.catchLoc) return i(n.catchLoc, !0);
										if (this.prev < n.finallyLoc) return i(n.finallyLoc)
									} else if (s) {
										if (this.prev < n.catchLoc) return i(n.catchLoc, !0)
									} else {
										if (!c) throw Error("try statement without catch or finally");
										if (this.prev < n.finallyLoc) return i(n.finallyLoc)
									}
								}
							}
						},
						abrupt: function(e, t) {
							for (var r = this.tryEntries.length - 1; r >= 0; --r) {
								var i = this.tryEntries[r];
								if (i.tryLoc <= this.prev && o.call(i, "finallyLoc") && this.prev < i.finallyLoc) {
									var a = i;
									break
								}
							}
							a && ("break" === e || "continue" === e) && a.tryLoc <= t && t <= a.finallyLoc && (a = null);
							var n = a ? a.completion : {};
							return n.type = e, n.arg = t, a ? (this.method = "next", this.next = a.finallyLoc, g) : this.complete(n)
						},
						complete: function(e, t) {
							if ("throw" === e.type) throw e.arg;
							return "break" === e.type || "continue" === e.type ? this.next = e.arg : "return" === e.type ? (this.rval = this.arg = e.arg, this.method = "return", this.next = "end") : "normal" === e.type && t && (this.next = t), g
						},
						finish: function(e) {
							for (var t = this.tryEntries.length - 1; t >= 0; --t) {
								var r = this.tryEntries[t];
								if (r.finallyLoc === e) return this.complete(r.completion, r.afterLoc), L(r), g
							}
						},
						catch: function(e) {
							for (var t = this.tryEntries.length - 1; t >= 0; --t) {
								var r = this.tryEntries[t];
								if (r.tryLoc === e) {
									var o = r.completion;
									if ("throw" === o.type) {
										var i = o.arg;
										L(r)
									}
									return i
								}
							}
							throw Error("illegal catch attempt")
						},
						delegateYield: function(t, r, o) {
							return this.delegate = {
								iterator: P(t),
								resultName: r,
								nextLoc: o
							}, "next" === this.method && (this.arg = e), g
						}
					}, t
				}

				function n(e, t, r, o, i, a, n) {
					try {
						var _ = e[a](n),
							s = _.value
					} catch (e) {
						return void r(e)
					}
					_.done ? t(s) : Promise.resolve(s).then(o, i)
				}

				function _(e) {
					return function() {
						var t = this,
							r = arguments;
						return new Promise((function(o, i) {
							var a = e.apply(t, r);

							function _(e) {
								n(a, o, i, _, s, "next", e)
							}

							function s(e) {
								n(a, o, i, _, s, "throw", e)
							}
							_(void 0)
						}))
					}
				}
				var s = "更好的视频播放器",
					c = ["builtin-video-pages"],
					l = "智云课堂";

				function u(e) {
					var t = e.querySelector(".control-bottom .control-right");
					return t && t.children && 0 !== t.children.length ? t : null
				}

				function d(e) {
					return !!u(e.document)
				}

				function p(e) {
					return h.apply(this, arguments)
				}

				function h() {
					return h = _(a().mark((function e(t) {
						var i, n, s, c, l, d;
						return a().wrap((function(e) {
							for (;;) switch (e.prev = e.next) {
								case 0:
									c = function() {
										return (c = _(a().mark((function e() {
											return a().wrap((function(e) {
												for (;;) switch (e.prev = e.next) {
													case 0:
														return i.body.classList.toggle("mem-bvt-fullscreen"), e.next = 3, (0, o.yy)(100);
													case 3:
														n.playerVue.resizePlayer();
													case 4:
													case "end":
														return e.stop()
												}
											}), e)
										})))).apply(this, arguments)
									}, s = function() {
										return c.apply(this, arguments)
									}, t.logger, i = t.document, n = t.elements, r(9734), l = u(i), (d = i.createElement("div")).className = "mem-bvp-btn", d.innerText = "网页全屏", d.onclick = function() {
										return s()
									}, l.insertBefore(d, l.firstChild);
								case 10:
								case "end":
									return e.stop()
							}
						}), e)
					}))), h.apply(this, arguments)
				}
			},
			9849: (e, t, r) => {
				"use strict";

				function o(e) {
					return e && "__vue__" in e
				}

				function i(e, t) {
					(null == t || t > e.length) && (t = e.length);
					for (var r = 0, o = Array(t); r < t; r++) o[r] = e[r];
					return o
				}
				r.r(t), r.d(t, {
					check: () => c,
					description: () => n,
					load: () => l,
					name: () => a,
					skip: () => _
				});
				var a = "[builtin]视频页面前置",
					n = "内置插件，用于处理智云课堂的视频页面的播放器及相关内容。另外，将这一插件加入到其余模块的前置列表中，可以确保这些模块在播放器加载后再进行加载。";

				function _(e) {
					return !e.env.isVideoPage
				}

				function s(e) {
					var t = e.document,
						r = t.querySelector(".living-page-wrapper"),
						i = t.querySelector("#cmcPlayer_container"),
						a = t.querySelector(".living-page-wrapper .operate_wrap");
					return o(r) && o(i) && a ? {
						course: r,
						player: i,
						wrapper: a,
						courseVue: r.__vue__,
						playerVue: i.__vue__
					} : null
				}

				function c(e) {
					return !!s({
						document: e.document
					})
				}

				function l(e) {
					var t = e.logger,
						o = e.document,
						a = e.extendContext;
					r(5756);
					var n = s({
						document: o
					});
					t.debug("视频页面元素:", n), a({
						elements: n
					});
					var _ = n.wrapper,
						c = o.createElement("div");
					c.className = "mem-btn-group", _.insertBefore(c, _.firstChild), t.debug("wrapper", _), a({
						addButton: function(e, r, a) {
							var n = o.createElement("button");
							n.className = "mem-btn mem-btn-primary", n.textContent = r, n.style = "display: inline-block", n.setAttribute("data-key", e), n.onclick = function() {
								a({
									element: n,
									setStatus: function(e) {
										t.debug("(button)" + r, "set status:", e), n.innerText = e ? r + "(" + e + ")" : r
									}
								})
							};
							var _, s = function(e, t) {
								var r = "undefined" != typeof Symbol && e[Symbol.iterator] || e["@@iterator"];
								if (!r) {
									if (Array.isArray(e) || (r = function(e, t) {
											if (e) {
												if ("string" == typeof e) return i(e, t);
												var r = {}.toString.call(e).slice(8, -1);
												return "Object" === r && e.constructor && (r = e.constructor.name), "Map" === r || "Set" === r ? Array.from(e) : "Arguments" === r || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(r) ? i(e, t) : void 0
											}
										}(e)) || t && e && "number" == typeof e.length) {
										r && (e = r);
										var o = 0,
											a = function() {};
										return {
											s: a,
											n: function() {
												return o >= e.length ? {
													done: !0
												} : {
													done: !1,
													value: e[o++]
												}
											},
											e: function(e) {
												throw e
											},
											f: a
										}
									}
									throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.")
								}
								var n, _ = !0,
									s = !1;
								return {
									s: function() {
										r = r.call(e)
									},
									n: function() {
										var e = r.next();
										return _ = e.done, e
									},
									e: function(e) {
										s = !0, n = e
									},
									f: function() {
										try {
											_ || null == r.return || r.return()
										} finally {
											if (s) throw n
										}
									}
								}
							}(c.children);
							try {
								for (s.s(); !(_ = s.n()).done;) {
									var l = _.value;
									if (Number(l.getAttribute("data-key")) > e) return c.insertBefore(n, l), n
								}
							} catch (e) {
								s.e(e)
							} finally {
								s.f()
							}
							return c.appendChild(n), n
						}
					})
				}
			},
			1798: (e, t, r) => {
				"use strict";
				r.r(t), r.d(t, {
					check: () => d,
					load: () => p,
					name: () => s,
					namespace: () => l,
					required: () => c
				});
				var o = r(4205);

				function i(e) {
					return i = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function(e) {
						return typeof e
					} : function(e) {
						return e && "function" == typeof Symbol && e.constructor === Symbol && e !== Symbol.prototype ? "symbol" : typeof e
					}, i(e)
				}

				function a() {
					a = function() {
						return t
					};
					var e, t = {},
						r = Object.prototype,
						o = r.hasOwnProperty,
						n = Object.defineProperty || function(e, t, r) {
							e[t] = r.value
						},
						_ = "function" == typeof Symbol ? Symbol : {},
						s = _.iterator || "@@iterator",
						c = _.asyncIterator || "@@asyncIterator",
						l = _.toStringTag || "@@toStringTag";

					function u(e, t, r) {
						return Object.defineProperty(e, t, {
							value: r,
							enumerable: !0,
							configurable: !0,
							writable: !0
						}), e[t]
					}
					try {
						u({}, "")
					} catch (e) {
						u = function(e, t, r) {
							return e[t] = r
						}
					}

					function d(e, t, r, o) {
						var i = t && t.prototype instanceof b ? t : b,
							a = Object.create(i.prototype),
							_ = new E(o || []);
						return n(a, "_invoke", {
							value: T(e, r, _)
						}), a
					}

					function p(e, t, r) {
						try {
							return {
								type: "normal",
								arg: e.call(t, r)
							}
						} catch (e) {
							return {
								type: "throw",
								arg: e
							}
						}
					}
					t.wrap = d;
					var h = "suspendedStart",
						v = "suspendedYield",
						f = "executing",
						m = "completed",
						g = {};

					function b() {}

					function y() {}

					function C() {}
					var w = {};
					u(w, s, (function() {
						return this
					}));
					var x = Object.getPrototypeOf,
						k = x && x(x(P([])));
					k && k !== r && o.call(k, s) && (w = k);
					var S = C.prototype = b.prototype = Object.create(w);

					function B(e) {
						["next", "throw", "return"].forEach((function(t) {
							u(e, t, (function(e) {
								return this._invoke(t, e)
							}))
						}))
					}

					function A(e, t) {
						function r(a, n, _, s) {
							var c = p(e[a], e, n);
							if ("throw" !== c.type) {
								var l = c.arg,
									u = l.value;
								return u && "object" == i(u) && o.call(u, "__await") ? t.resolve(u.__await).then((function(e) {
									r("next", e, _, s)
								}), (function(e) {
									r("throw", e, _, s)
								})) : t.resolve(u).then((function(e) {
									l.value = e, _(l)
								}), (function(e) {
									return r("throw", e, _, s)
								}))
							}
							s(c.arg)
						}
						var a;
						n(this, "_invoke", {
							value: function(e, o) {
								function i() {
									return new t((function(t, i) {
										r(e, o, t, i)
									}))
								}
								return a = a ? a.then(i, i) : i()
							}
						})
					}

					function T(t, r, o) {
						var i = h;
						return function(a, n) {
							if (i === f) throw Error("Generator is already running");
							if (i === m) {
								if ("throw" === a) throw n;
								return {
									value: e,
									done: !0
								}
							}
							for (o.method = a, o.arg = n;;) {
								var _ = o.delegate;
								if (_) {
									var s = I(_, o);
									if (s) {
										if (s === g) continue;
										return s
									}
								}
								if ("next" === o.method) o.sent = o._sent = o.arg;
								else if ("throw" === o.method) {
									if (i === h) throw i = m, o.arg;
									o.dispatchException(o.arg)
								} else "return" === o.method && o.abrupt("return", o.arg);
								i = f;
								var c = p(t, r, o);
								if ("normal" === c.type) {
									if (i = o.done ? m : v, c.arg === g) continue;
									return {
										value: c.arg,
										done: o.done
									}
								}
								"throw" === c.type && (i = m, o.method = "throw", o.arg = c.arg)
							}
						}
					}

					function I(t, r) {
						var o = r.method,
							i = t.iterator[o];
						if (i === e) return r.delegate = null, "throw" === o && t.iterator.return && (r.method = "return", r.arg = e, I(t, r), "throw" === r.method) || "return" !== o && (r.method = "throw", r.arg = new TypeError("The iterator does not provide a '" + o + "' method")), g;
						var a = p(i, t.iterator, r.arg);
						if ("throw" === a.type) return r.method = "throw", r.arg = a.arg, r.delegate = null, g;
						var n = a.arg;
						return n ? n.done ? (r[t.resultName] = n.value, r.next = t.nextLoc, "return" !== r.method && (r.method = "next", r.arg = e), r.delegate = null, g) : n : (r.method = "throw", r.arg = new TypeError("iterator result is not an object"), r.delegate = null, g)
					}

					function q(e) {
						var t = {
							tryLoc: e[0]
						};
						1 in e && (t.catchLoc = e[1]), 2 in e && (t.finallyLoc = e[2], t.afterLoc = e[3]), this.tryEntries.push(t)
					}

					function L(e) {
						var t = e.completion || {};
						t.type = "normal", delete t.arg, e.completion = t
					}

					function E(e) {
						this.tryEntries = [{
							tryLoc: "root"
						}], e.forEach(q, this), this.reset(!0)
					}

					function P(t) {
						if (t || "" === t) {
							var r = t[s];
							if (r) return r.call(t);
							if ("function" == typeof t.next) return t;
							if (!isNaN(t.length)) {
								var a = -1,
									n = function r() {
										for (; ++a < t.length;)
											if (o.call(t, a)) return r.value = t[a], r.done = !1, r;
										return r.value = e, r.done = !0, r
									};
								return n.next = n
							}
						}
						throw new TypeError(i(t) + " is not iterable")
					}
					return y.prototype = C, n(S, "constructor", {
						value: C,
						configurable: !0
					}), n(C, "constructor", {
						value: y,
						configurable: !0
					}), y.displayName = u(C, l, "GeneratorFunction"), t.isGeneratorFunction = function(e) {
						var t = "function" == typeof e && e.constructor;
						return !!t && (t === y || "GeneratorFunction" === (t.displayName || t.name))
					}, t.mark = function(e) {
						return Object.setPrototypeOf ? Object.setPrototypeOf(e, C) : (e.__proto__ = C, u(e, l, "GeneratorFunction")), e.prototype = Object.create(S), e
					}, t.awrap = function(e) {
						return {
							__await: e
						}
					}, B(A.prototype), u(A.prototype, c, (function() {
						return this
					})), t.AsyncIterator = A, t.async = function(e, r, o, i, a) {
						void 0 === a && (a = Promise);
						var n = new A(d(e, r, o, i), a);
						return t.isGeneratorFunction(r) ? n : n.next().then((function(e) {
							return e.done ? e.value : n.next()
						}))
					}, B(S), u(S, l, "Generator"), u(S, s, (function() {
						return this
					})), u(S, "toString", (function() {
						return "[object Generator]"
					})), t.keys = function(e) {
						var t = Object(e),
							r = [];
						for (var o in t) r.push(o);
						return r.reverse(),
							function e() {
								for (; r.length;) {
									var o = r.pop();
									if (o in t) return e.value = o, e.done = !1, e
								}
								return e.done = !0, e
							}
					}, t.values = P, E.prototype = {
						constructor: E,
						reset: function(t) {
							if (this.prev = 0, this.next = 0, this.sent = this._sent = e, this.done = !1, this.delegate = null, this.method = "next", this.arg = e, this.tryEntries.forEach(L), !t)
								for (var r in this) "t" === r.charAt(0) && o.call(this, r) && !isNaN(+r.slice(1)) && (this[r] = e)
						},
						stop: function() {
							this.done = !0;
							var e = this.tryEntries[0].completion;
							if ("throw" === e.type) throw e.arg;
							return this.rval
						},
						dispatchException: function(t) {
							if (this.done) throw t;
							var r = this;

							function i(o, i) {
								return _.type = "throw", _.arg = t, r.next = o, i && (r.method = "next", r.arg = e), !!i
							}
							for (var a = this.tryEntries.length - 1; a >= 0; --a) {
								var n = this.tryEntries[a],
									_ = n.completion;
								if ("root" === n.tryLoc) return i("end");
								if (n.tryLoc <= this.prev) {
									var s = o.call(n, "catchLoc"),
										c = o.call(n, "finallyLoc");
									if (s && c) {
										if (this.prev < n.catchLoc) return i(n.catchLoc, !0);
										if (this.prev < n.finallyLoc) return i(n.finallyLoc)
									} else if (s) {
										if (this.prev < n.catchLoc) return i(n.catchLoc, !0)
									} else {
										if (!c) throw Error("try statement without catch or finally");
										if (this.prev < n.finallyLoc) return i(n.finallyLoc)
									}
								}
							}
						},
						abrupt: function(e, t) {
							for (var r = this.tryEntries.length - 1; r >= 0; --r) {
								var i = this.tryEntries[r];
								if (i.tryLoc <= this.prev && o.call(i, "finallyLoc") && this.prev < i.finallyLoc) {
									var a = i;
									break
								}
							}
							a && ("break" === e || "continue" === e) && a.tryLoc <= t && t <= a.finallyLoc && (a = null);
							var n = a ? a.completion : {};
							return n.type = e, n.arg = t, a ? (this.method = "next", this.next = a.finallyLoc, g) : this.complete(n)
						},
						complete: function(e, t) {
							if ("throw" === e.type) throw e.arg;
							return "break" === e.type || "continue" === e.type ? this.next = e.arg : "return" === e.type ? (this.rval = this.arg = e.arg, this.method = "return", this.next = "end") : "normal" === e.type && t && (this.next = t), g
						},
						finish: function(e) {
							for (var t = this.tryEntries.length - 1; t >= 0; --t) {
								var r = this.tryEntries[t];
								if (r.finallyLoc === e) return this.complete(r.completion, r.afterLoc), L(r), g
							}
						},
						catch: function(e) {
							for (var t = this.tryEntries.length - 1; t >= 0; --t) {
								var r = this.tryEntries[t];
								if (r.tryLoc === e) {
									var o = r.completion;
									if ("throw" === o.type) {
										var i = o.arg;
										L(r)
									}
									return i
								}
							}
							throw Error("illegal catch attempt")
						},
						delegateYield: function(t, r, o) {
							return this.delegate = {
								iterator: P(t),
								resultName: r,
								nextLoc: o
							}, "next" === this.method && (this.arg = e), g
						}
					}, t
				}

				function n(e, t, r, o, i, a, n) {
					try {
						var _ = e[a](n),
							s = _.value
					} catch (e) {
						return void r(e)
					}
					_.done ? t(s) : Promise.resolve(s).then(o, i)
				}

				function _(e) {
					return function() {
						var t = this,
							r = arguments;
						return new Promise((function(o, i) {
							var a = e.apply(t, r);

							function _(e) {
								n(a, o, i, _, s, "next", e)
							}

							function s(e) {
								n(a, o, i, _, s, "throw", e)
							}
							_(void 0)
						}))
					}
				}
				var s = "带时间戳的地址复制（精准空降）",
					c = ["builtin-video-pages"],
					l = "智云课堂";

				function u(e) {
					var t = e.querySelector(".control-bottom .control-right");
					return t && t.children && 0 !== t.children.length ? t : null
				}

				function d(e) {
					return !!u(e.document)
				}

				function p(e) {
					return h.apply(this, arguments)
				}

				function h() {
					return h = _(a().mark((function e(t) {
						var r, i, n, s, c, l, d, p;
						return a().wrap((function(e) {
							for (;;) switch (e.prev = e.next) {
								case 0:
									if (c = function() {
											return c = _(a().mark((function e() {
												var t, r, _;
												return a().wrap((function(e) {
													for (;;) switch (e.prev = e.next) {
														case 0:
															t = i.location.origin + i.location.pathname, (r = (0, o.mr)(i.location.search) || {}).ts = Math.floor(n.playerVue.getPlayTime()), _ = t + (0, o.wj)(r), (0, o.lW)(_), (0, o.rG)("复制成功！");
														case 6:
														case "end":
															return e.stop()
													}
												}), e)
											}))), c.apply(this, arguments)
										}, s = function() {
											return c.apply(this, arguments)
										}, r = t.logger, i = t.document, n = t.elements, (l = (0, o.mr)(i.location.search) || {}).ts) try {
										r.info("需定位到对应时间戳"), r.log("player", n.playerVue), r.log("playTime", n.playerVue.getPlayTime()), n.playerVue.setPlayerPlayTime(l.ts), r.log("playTime", n.playerVue.getPlayTime())
									} catch (e) {
										r.error("定位失败", e)
									}
									d = u(i), (p = i.createElement("div")).className = "mem-bvp-btn", p.innerText = "复制地址(精准空降)", p.onclick = function() {
										return s()
									}, d.insertBefore(p, d.firstChild);
								case 11:
								case "end":
									return e.stop()
							}
						}), e)
					}))), h.apply(this, arguments)
				}
			},
			1827: (e, t, r) => {
				"use strict";
				r.r(t), r.d(t, {
					check: () => _,
					description: () => i,
					load: () => s,
					name: () => o,
					required: () => a,
					skip: () => n
				});
				var o = "示例插件",
					i = "这是一个示例插件，他不应该被加载到脚本中。",
					a = [];

				function n() {
					return !1
				}

				function _() {
					return !0
				}

				function s(e) {
					e.logger.debug("示例插件已被加载。")
				}
			},
			1481: (e, t, r) => {
				"use strict";
				r.r(t), r.d(t, {
					load: () => i,
					name: () => o
				});
				var o = "专注模式";

				function i(e) {
					var t = e.logger,
						o = e.namespace;
					"学在浙大" === o ? r(831) : "智云课堂" === o ? r(445) : t.debug("没有可以加载的样式.")
				}
			},
			8096: (e, t, r) => {
				"use strict";
				r.r(t), r.d(t, {
					check: () => b,
					load: () => y,
					name: () => l,
					namespace: () => d,
					required: () => u
				});
				var o = r(2266);

				function i(e) {
					return i = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function(e) {
						return typeof e
					} : function(e) {
						return e && "function" == typeof Symbol && e.constructor === Symbol && e !== Symbol.prototype ? "symbol" : typeof e
					}, i(e)
				}

				function a() {
					a = function() {
						return t
					};
					var e, t = {},
						r = Object.prototype,
						o = r.hasOwnProperty,
						n = Object.defineProperty || function(e, t, r) {
							e[t] = r.value
						},
						_ = "function" == typeof Symbol ? Symbol : {},
						s = _.iterator || "@@iterator",
						c = _.asyncIterator || "@@asyncIterator",
						l = _.toStringTag || "@@toStringTag";

					function u(e, t, r) {
						return Object.defineProperty(e, t, {
							value: r,
							enumerable: !0,
							configurable: !0,
							writable: !0
						}), e[t]
					}
					try {
						u({}, "")
					} catch (e) {
						u = function(e, t, r) {
							return e[t] = r
						}
					}

					function d(e, t, r, o) {
						var i = t && t.prototype instanceof b ? t : b,
							a = Object.create(i.prototype),
							_ = new E(o || []);
						return n(a, "_invoke", {
							value: T(e, r, _)
						}), a
					}

					function p(e, t, r) {
						try {
							return {
								type: "normal",
								arg: e.call(t, r)
							}
						} catch (e) {
							return {
								type: "throw",
								arg: e
							}
						}
					}
					t.wrap = d;
					var h = "suspendedStart",
						v = "suspendedYield",
						f = "executing",
						m = "completed",
						g = {};

					function b() {}

					function y() {}

					function C() {}
					var w = {};
					u(w, s, (function() {
						return this
					}));
					var x = Object.getPrototypeOf,
						k = x && x(x(P([])));
					k && k !== r && o.call(k, s) && (w = k);
					var S = C.prototype = b.prototype = Object.create(w);

					function B(e) {
						["next", "throw", "return"].forEach((function(t) {
							u(e, t, (function(e) {
								return this._invoke(t, e)
							}))
						}))
					}

					function A(e, t) {
						function r(a, n, _, s) {
							var c = p(e[a], e, n);
							if ("throw" !== c.type) {
								var l = c.arg,
									u = l.value;
								return u && "object" == i(u) && o.call(u, "__await") ? t.resolve(u.__await).then((function(e) {
									r("next", e, _, s)
								}), (function(e) {
									r("throw", e, _, s)
								})) : t.resolve(u).then((function(e) {
									l.value = e, _(l)
								}), (function(e) {
									return r("throw", e, _, s)
								}))
							}
							s(c.arg)
						}
						var a;
						n(this, "_invoke", {
							value: function(e, o) {
								function i() {
									return new t((function(t, i) {
										r(e, o, t, i)
									}))
								}
								return a = a ? a.then(i, i) : i()
							}
						})
					}

					function T(t, r, o) {
						var i = h;
						return function(a, n) {
							if (i === f) throw Error("Generator is already running");
							if (i === m) {
								if ("throw" === a) throw n;
								return {
									value: e,
									done: !0
								}
							}
							for (o.method = a, o.arg = n;;) {
								var _ = o.delegate;
								if (_) {
									var s = I(_, o);
									if (s) {
										if (s === g) continue;
										return s
									}
								}
								if ("next" === o.method) o.sent = o._sent = o.arg;
								else if ("throw" === o.method) {
									if (i === h) throw i = m, o.arg;
									o.dispatchException(o.arg)
								} else "return" === o.method && o.abrupt("return", o.arg);
								i = f;
								var c = p(t, r, o);
								if ("normal" === c.type) {
									if (i = o.done ? m : v, c.arg === g) continue;
									return {
										value: c.arg,
										done: o.done
									}
								}
								"throw" === c.type && (i = m, o.method = "throw", o.arg = c.arg)
							}
						}
					}

					function I(t, r) {
						var o = r.method,
							i = t.iterator[o];
						if (i === e) return r.delegate = null, "throw" === o && t.iterator.return && (r.method = "return", r.arg = e, I(t, r), "throw" === r.method) || "return" !== o && (r.method = "throw", r.arg = new TypeError("The iterator does not provide a '" + o + "' method")), g;
						var a = p(i, t.iterator, r.arg);
						if ("throw" === a.type) return r.method = "throw", r.arg = a.arg, r.delegate = null, g;
						var n = a.arg;
						return n ? n.done ? (r[t.resultName] = n.value, r.next = t.nextLoc, "return" !== r.method && (r.method = "next", r.arg = e), r.delegate = null, g) : n : (r.method = "throw", r.arg = new TypeError("iterator result is not an object"), r.delegate = null, g)
					}

					function q(e) {
						var t = {
							tryLoc: e[0]
						};
						1 in e && (t.catchLoc = e[1]), 2 in e && (t.finallyLoc = e[2], t.afterLoc = e[3]), this.tryEntries.push(t)
					}

					function L(e) {
						var t = e.completion || {};
						t.type = "normal", delete t.arg, e.completion = t
					}

					function E(e) {
						this.tryEntries = [{
							tryLoc: "root"
						}], e.forEach(q, this), this.reset(!0)
					}

					function P(t) {
						if (t || "" === t) {
							var r = t[s];
							if (r) return r.call(t);
							if ("function" == typeof t.next) return t;
							if (!isNaN(t.length)) {
								var a = -1,
									n = function r() {
										for (; ++a < t.length;)
											if (o.call(t, a)) return r.value = t[a], r.done = !1, r;
										return r.value = e, r.done = !0, r
									};
								return n.next = n
							}
						}
						throw new TypeError(i(t) + " is not iterable")
					}
					return y.prototype = C, n(S, "constructor", {
						value: C,
						configurable: !0
					}), n(C, "constructor", {
						value: y,
						configurable: !0
					}), y.displayName = u(C, l, "GeneratorFunction"), t.isGeneratorFunction = function(e) {
						var t = "function" == typeof e && e.constructor;
						return !!t && (t === y || "GeneratorFunction" === (t.displayName || t.name))
					}, t.mark = function(e) {
						return Object.setPrototypeOf ? Object.setPrototypeOf(e, C) : (e.__proto__ = C, u(e, l, "GeneratorFunction")), e.prototype = Object.create(S), e
					}, t.awrap = function(e) {
						return {
							__await: e
						}
					}, B(A.prototype), u(A.prototype, c, (function() {
						return this
					})), t.AsyncIterator = A, t.async = function(e, r, o, i, a) {
						void 0 === a && (a = Promise);
						var n = new A(d(e, r, o, i), a);
						return t.isGeneratorFunction(r) ? n : n.next().then((function(e) {
							return e.done ? e.value : n.next()
						}))
					}, B(S), u(S, l, "Generator"), u(S, s, (function() {
						return this
					})), u(S, "toString", (function() {
						return "[object Generator]"
					})), t.keys = function(e) {
						var t = Object(e),
							r = [];
						for (var o in t) r.push(o);
						return r.reverse(),
							function e() {
								for (; r.length;) {
									var o = r.pop();
									if (o in t) return e.value = o, e.done = !1, e
								}
								return e.done = !0, e
							}
					}, t.values = P, E.prototype = {
						constructor: E,
						reset: function(t) {
							if (this.prev = 0, this.next = 0, this.sent = this._sent = e, this.done = !1, this.delegate = null, this.method = "next", this.arg = e, this.tryEntries.forEach(L), !t)
								for (var r in this) "t" === r.charAt(0) && o.call(this, r) && !isNaN(+r.slice(1)) && (this[r] = e)
						},
						stop: function() {
							this.done = !0;
							var e = this.tryEntries[0].completion;
							if ("throw" === e.type) throw e.arg;
							return this.rval
						},
						dispatchException: function(t) {
							if (this.done) throw t;
							var r = this;

							function i(o, i) {
								return _.type = "throw", _.arg = t, r.next = o, i && (r.method = "next", r.arg = e), !!i
							}
							for (var a = this.tryEntries.length - 1; a >= 0; --a) {
								var n = this.tryEntries[a],
									_ = n.completion;
								if ("root" === n.tryLoc) return i("end");
								if (n.tryLoc <= this.prev) {
									var s = o.call(n, "catchLoc"),
										c = o.call(n, "finallyLoc");
									if (s && c) {
										if (this.prev < n.catchLoc) return i(n.catchLoc, !0);
										if (this.prev < n.finallyLoc) return i(n.finallyLoc)
									} else if (s) {
										if (this.prev < n.catchLoc) return i(n.catchLoc, !0)
									} else {
										if (!c) throw Error("try statement without catch or finally");
										if (this.prev < n.finallyLoc) return i(n.finallyLoc)
									}
								}
							}
						},
						abrupt: function(e, t) {
							for (var r = this.tryEntries.length - 1; r >= 0; --r) {
								var i = this.tryEntries[r];
								if (i.tryLoc <= this.prev && o.call(i, "finallyLoc") && this.prev < i.finallyLoc) {
									var a = i;
									break
								}
							}
							a && ("break" === e || "continue" === e) && a.tryLoc <= t && t <= a.finallyLoc && (a = null);
							var n = a ? a.completion : {};
							return n.type = e, n.arg = t, a ? (this.method = "next", this.next = a.finallyLoc, g) : this.complete(n)
						},
						complete: function(e, t) {
							if ("throw" === e.type) throw e.arg;
							return "break" === e.type || "continue" === e.type ? this.next = e.arg : "return" === e.type ? (this.rval = this.arg = e.arg, this.method = "return", this.next = "end") : "normal" === e.type && t && (this.next = t), g
						},
						finish: function(e) {
							for (var t = this.tryEntries.length - 1; t >= 0; --t) {
								var r = this.tryEntries[t];
								if (r.finallyLoc === e) return this.complete(r.completion, r.afterLoc), L(r), g
							}
						},
						catch: function(e) {
							for (var t = this.tryEntries.length - 1; t >= 0; --t) {
								var r = this.tryEntries[t];
								if (r.tryLoc === e) {
									var o = r.completion;
									if ("throw" === o.type) {
										var i = o.arg;
										L(r)
									}
									return i
								}
							}
							throw Error("illegal catch attempt")
						},
						delegateYield: function(t, r, o) {
							return this.delegate = {
								iterator: P(t),
								resultName: r,
								nextLoc: o
							}, "next" === this.method && (this.arg = e), g
						}
					}, t
				}

				function n(e) {
					return function(e) {
						if (Array.isArray(e)) return _(e)
					}(e) || function(e) {
						if ("undefined" != typeof Symbol && null != e[Symbol.iterator] || null != e["@@iterator"]) return Array.from(e)
					}(e) || function(e, t) {
						if (e) {
							if ("string" == typeof e) return _(e, t);
							var r = {}.toString.call(e).slice(8, -1);
							return "Object" === r && e.constructor && (r = e.constructor.name), "Map" === r || "Set" === r ? Array.from(e) : "Arguments" === r || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(r) ? _(e, t) : void 0
						}
					}(e) || function() {
						throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.")
					}()
				}

				function _(e, t) {
					(null == t || t > e.length) && (t = e.length);
					for (var r = 0, o = Array(t); r < t; r++) o[r] = e[r];
					return o
				}

				function s(e, t, r, o, i, a, n) {
					try {
						var _ = e[a](n),
							s = _.value
					} catch (e) {
						return void r(e)
					}
					_.done ? t(s) : Promise.resolve(s).then(o, i)
				}

				function c(e) {
					return function() {
						var t = this,
							r = arguments;
						return new Promise((function(o, i) {
							var a = e.apply(t, r);

							function n(e) {
								s(a, o, i, n, _, "next", e)
							}

							function _(e) {
								s(a, o, i, n, _, "throw", e)
							}
							n(void 0)
						}))
					}
				}
				var l = "播放器画中画",
					u = ["builtin-video-pages"],
					d = "智云课堂";

				function p(e) {
					var t = e.querySelector(".control-bottom .control-right");
					return t && t.children && 0 !== t.children.length ? t : null
				}

				function h(e) {
					var t = e.querySelector(".opr_lay .ppt_opr_lay");
					return t && t.children && 0 !== t.children.length ? t : null
				}

				function v(e) {
					var t = e.querySelector(".change-item");
					return t && t.children && 0 !== t.children.length ? t : null
				}

				function f() {
					var e = document.createElement("div");
					return e.className = "pip-btn", e.innerHTML = '<svg class="svg-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48"><path d="M38 14H22v12h16V14zm4-8H6c-2.21 0-4 1.79-4 4v28c0 2.21 1.79 3.96 4 3.96h36c2.21 0 4-1.76 4-3.96V10c0-2.21-1.79-4-4-4zm0 32.03H6V9.97h36v28.06z"></path></svg>', e
				}

				function m() {
					return g.apply(this, arguments)
				}

				function g() {
					return (g = c(a().mark((function e() {
						var t;
						return a().wrap((function(e) {
							for (;;) switch (e.prev = e.next) {
								case 0:
									if (!documentPictureInPicture.window) {
										e.next = 3;
										break
									}
									return documentPictureInPicture.window.close(), e.abrupt("return");
								case 3:
									return e.next = 5, documentPictureInPicture.requestWindow({
										width: 640,
										height: 360
									});
								case 5:
									return t = e.sent, n(document.styleSheets).forEach((function(e) {
										try {
											var r = n(e.cssRules).map((function(e) {
													return e.cssText
												})).join(""),
												o = document.createElement("style");
											o.textContent = r, t.document.head.appendChild(o)
										} catch (r) {
											var i = document.createElement("link");
											i.rel = "stylesheet", i.type = e.type, i.media = e.media, i.href = e.href, t.document.head.appendChild(i)
										}
									})), e.abrupt("return", t);
								case 8:
								case "end":
									return e.stop()
							}
						}), e)
					})))).apply(this, arguments)
				}

				function b(e) {
					var t = e.document,
						r = !1;
					return "documentPictureInPicture" in window ? r = !0 : logger.debug("PIP api not supported"), r && !!p(t) && !!h(t) && !!v(t)
				}

				function y(e) {
					return C.apply(this, arguments)
				}

				function C() {
					return (C = c(a().mark((function e(t) {
						var i, n, _, s, l;
						return a().wrap((function(e) {
							for (;;) switch (e.prev = e.next) {
								case 0:
									t.logger, i = t.document, t.elements, t.addButton, r(6443), n = p(i), (_ = f()).onclick = function() {
										i.querySelector("#cmc_player_video").requestPictureInPicture()
									}, n.insertBefore(_, n.lastChild), s = !1, l = null, v(i).onclick = c(a().mark((function e() {
										var t, r;
										return a().wrap((function(e) {
											for (;;) switch (e.prev = e.next) {
												case 0:
													if (!s) {
														e.next = 3;
														break
													}
													return s = !1, e.abrupt("return");
												case 3:
													return s = !0, e.next = 6, (0, o.yy)(100);
												case 6:
													t = h(i), (r = f()).onclick = c(a().mark((function e() {
														var t, r, o, n, _, s;
														return a().wrap((function(e) {
															for (;;) switch (e.prev = e.next) {
																case 0:
																	return l = m(), t = i.querySelector(".main_resize_con .ppt_container").__vue__, r = i.querySelector("#ppt_canvas"), t.drawImg = function(e) {
																		var o = t,
																			i = r,
																			a = new Image;
																		a.crossOrigin = "anonymous", a.onload = function() {
																			return function(e) {
																				var t = a.width,
																					r = a.height,
																					n = e.offsetWidth,
																					_ = e.offsetHeight,
																					s = i.getContext("2d"),
																					c = t / r,
																					l = n / _,
																					u = 0,
																					d = 0;
																				c > l ? d = (_ - (r = (t = n) / c)) / 2 : u = (n - (t = (r = _) * c)) / 2, console.log("imgW=", t, "imgH=", r, "imgRatio=", c, "csvRatio=", l, "drawPosY=", d, "drawPosX=", u), i.setAttribute("width", n), i.setAttribute("height", _), s.drawImage(a, u, d, t, r);
																				var p = s.getImageData(0, 0, n, _);
																				o.middleAry = [p]
																			}(i)
																		}, a.src = e
																	}, o = i.querySelector(".el-slider__button-wrapper").__vue__, n = i.querySelector(".el-slider__button").__vue__, (_ = {}).onDragStart = o.onDragStart, o.onDragStart = function() {}, _.onDragging = o.onDragging, o.onDragging = function() {}, _.onDragEnd = o.onDragEnd, o.onDragEnd = function() {}, _.updatePopper = n.updatePopper, n.updatePopper = function() {}, e.next = 17, l;
																case 17:
																	l = e.sent, v(i).style.display = "none", s = i.querySelector(".main_resize_con").firstElementChild, l.document.body.className = "pip-window", l.document.body.append(s), t.drawImg(t.pptImgSrc), l.addEventListener("pagehide", (function(e) {
																		var r = i.querySelector(".main_resize_con"),
																			a = e.target.body.lastChild;
																		a && (r.append(a), o.onDragStart = _.onDragStart, o.onDragging = _.onDragging, o.onDragEnd = _.onDragEnd, n.updatePopper = _.updatePopper, t.drawImg = function(e) {
																			var t = this,
																				r = i.getElementById("ppt_canvas"),
																				o = new Image;
																			o.crossOrigin = "anonymous", o.onload = function() {
																				var e = o.width,
																					a = o.height,
																					n = i.getElementById("ppt").offsetWidth,
																					_ = i.getElementById("ppt").offsetHeight,
																					s = r.getContext("2d"),
																					c = e / a,
																					l = n / _,
																					u = 0,
																					d = 0;
																				c > l ? d = (_ - (a = (e = n) / c)) / 2 : u = (n - (e = (a = _) * c)) / 2, console.log("imgW=", e, "imgH=", a, "imgRatio=", c, "csvRatio=", l, "drawPosY=", d, "drawPosX=", u), r.setAttribute("width", n), r.setAttribute("height", _), s.drawImage(o, u, d, e, a);
																				var p = s.getImageData(0, 0, n, _);
																				t.middleAry = [p]
																			}, o.src = e
																		}, t.drawImg(t.pptImgSrc), v(i).style.display = "block")
																	}));
																case 24:
																case "end":
																	return e.stop()
															}
														}), e)
													}))), t.insertBefore(r, null);
												case 10:
												case "end":
													return e.stop()
											}
										}), e)
									})));
								case 10:
								case "end":
									return e.stop()
							}
						}), e)
					})))).apply(this, arguments)
				}
			},
			4533: (e, t, r) => {
				"use strict";
				r.r(t), r.d(t, {
					check: () => y,
					load: () => C,
					name: () => v,
					namespace: () => m,
					options: () => g,
					required: () => f
				});
				var o = r(4213),
					i = r(2266),
					a = r(4205);

				function n(e) {
					return n = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function(e) {
						return typeof e
					} : function(e) {
						return e && "function" == typeof Symbol && e.constructor === Symbol && e !== Symbol.prototype ? "symbol" : typeof e
					}, n(e)
				}

				function _(e, t) {
					var r = "undefined" != typeof Symbol && e[Symbol.iterator] || e["@@iterator"];
					if (!r) {
						if (Array.isArray(e) || (r = function(e, t) {
								if (e) {
									if ("string" == typeof e) return s(e, t);
									var r = {}.toString.call(e).slice(8, -1);
									return "Object" === r && e.constructor && (r = e.constructor.name), "Map" === r || "Set" === r ? Array.from(e) : "Arguments" === r || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(r) ? s(e, t) : void 0
								}
							}(e)) || t && e && "number" == typeof e.length) {
							r && (e = r);
							var o = 0,
								i = function() {};
							return {
								s: i,
								n: function() {
									return o >= e.length ? {
										done: !0
									} : {
										done: !1,
										value: e[o++]
									}
								},
								e: function(e) {
									throw e
								},
								f: i
							}
						}
						throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.")
					}
					var a, n = !0,
						_ = !1;
					return {
						s: function() {
							r = r.call(e)
						},
						n: function() {
							var e = r.next();
							return n = e.done, e
						},
						e: function(e) {
							_ = !0, a = e
						},
						f: function() {
							try {
								n || null == r.return || r.return()
							} finally {
								if (_) throw a
							}
						}
					}
				}

				function s(e, t) {
					(null == t || t > e.length) && (t = e.length);
					for (var r = 0, o = Array(t); r < t; r++) o[r] = e[r];
					return o
				}

				function c() {
					c = function() {
						return t
					};
					var e, t = {},
						r = Object.prototype,
						o = r.hasOwnProperty,
						i = Object.defineProperty || function(e, t, r) {
							e[t] = r.value
						},
						a = "function" == typeof Symbol ? Symbol : {},
						_ = a.iterator || "@@iterator",
						s = a.asyncIterator || "@@asyncIterator",
						l = a.toStringTag || "@@toStringTag";

					function u(e, t, r) {
						return Object.defineProperty(e, t, {
							value: r,
							enumerable: !0,
							configurable: !0,
							writable: !0
						}), e[t]
					}
					try {
						u({}, "")
					} catch (e) {
						u = function(e, t, r) {
							return e[t] = r
						}
					}

					function d(e, t, r, o) {
						var a = t && t.prototype instanceof b ? t : b,
							n = Object.create(a.prototype),
							_ = new E(o || []);
						return i(n, "_invoke", {
							value: T(e, r, _)
						}), n
					}

					function p(e, t, r) {
						try {
							return {
								type: "normal",
								arg: e.call(t, r)
							}
						} catch (e) {
							return {
								type: "throw",
								arg: e
							}
						}
					}
					t.wrap = d;
					var h = "suspendedStart",
						v = "suspendedYield",
						f = "executing",
						m = "completed",
						g = {};

					function b() {}

					function y() {}

					function C() {}
					var w = {};
					u(w, _, (function() {
						return this
					}));
					var x = Object.getPrototypeOf,
						k = x && x(x(P([])));
					k && k !== r && o.call(k, _) && (w = k);
					var S = C.prototype = b.prototype = Object.create(w);

					function B(e) {
						["next", "throw", "return"].forEach((function(t) {
							u(e, t, (function(e) {
								return this._invoke(t, e)
							}))
						}))
					}

					function A(e, t) {
						function r(i, a, _, s) {
							var c = p(e[i], e, a);
							if ("throw" !== c.type) {
								var l = c.arg,
									u = l.value;
								return u && "object" == n(u) && o.call(u, "__await") ? t.resolve(u.__await).then((function(e) {
									r("next", e, _, s)
								}), (function(e) {
									r("throw", e, _, s)
								})) : t.resolve(u).then((function(e) {
									l.value = e, _(l)
								}), (function(e) {
									return r("throw", e, _, s)
								}))
							}
							s(c.arg)
						}
						var a;
						i(this, "_invoke", {
							value: function(e, o) {
								function i() {
									return new t((function(t, i) {
										r(e, o, t, i)
									}))
								}
								return a = a ? a.then(i, i) : i()
							}
						})
					}

					function T(t, r, o) {
						var i = h;
						return function(a, n) {
							if (i === f) throw Error("Generator is already running");
							if (i === m) {
								if ("throw" === a) throw n;
								return {
									value: e,
									done: !0
								}
							}
							for (o.method = a, o.arg = n;;) {
								var _ = o.delegate;
								if (_) {
									var s = I(_, o);
									if (s) {
										if (s === g) continue;
										return s
									}
								}
								if ("next" === o.method) o.sent = o._sent = o.arg;
								else if ("throw" === o.method) {
									if (i === h) throw i = m, o.arg;
									o.dispatchException(o.arg)
								} else "return" === o.method && o.abrupt("return", o.arg);
								i = f;
								var c = p(t, r, o);
								if ("normal" === c.type) {
									if (i = o.done ? m : v, c.arg === g) continue;
									return {
										value: c.arg,
										done: o.done
									}
								}
								"throw" === c.type && (i = m, o.method = "throw", o.arg = c.arg)
							}
						}
					}

					function I(t, r) {
						var o = r.method,
							i = t.iterator[o];
						if (i === e) return r.delegate = null, "throw" === o && t.iterator.return && (r.method = "return", r.arg = e, I(t, r), "throw" === r.method) || "return" !== o && (r.method = "throw", r.arg = new TypeError("The iterator does not provide a '" + o + "' method")), g;
						var a = p(i, t.iterator, r.arg);
						if ("throw" === a.type) return r.method = "throw", r.arg = a.arg, r.delegate = null, g;
						var n = a.arg;
						return n ? n.done ? (r[t.resultName] = n.value, r.next = t.nextLoc, "return" !== r.method && (r.method = "next", r.arg = e), r.delegate = null, g) : n : (r.method = "throw", r.arg = new TypeError("iterator result is not an object"), r.delegate = null, g)
					}

					function q(e) {
						var t = {
							tryLoc: e[0]
						};
						1 in e && (t.catchLoc = e[1]), 2 in e && (t.finallyLoc = e[2], t.afterLoc = e[3]), this.tryEntries.push(t)
					}

					function L(e) {
						var t = e.completion || {};
						t.type = "normal", delete t.arg, e.completion = t
					}

					function E(e) {
						this.tryEntries = [{
							tryLoc: "root"
						}], e.forEach(q, this), this.reset(!0)
					}

					function P(t) {
						if (t || "" === t) {
							var r = t[_];
							if (r) return r.call(t);
							if ("function" == typeof t.next) return t;
							if (!isNaN(t.length)) {
								var i = -1,
									a = function r() {
										for (; ++i < t.length;)
											if (o.call(t, i)) return r.value = t[i], r.done = !1, r;
										return r.value = e, r.done = !0, r
									};
								return a.next = a
							}
						}
						throw new TypeError(n(t) + " is not iterable")
					}
					return y.prototype = C, i(S, "constructor", {
						value: C,
						configurable: !0
					}), i(C, "constructor", {
						value: y,
						configurable: !0
					}), y.displayName = u(C, l, "GeneratorFunction"), t.isGeneratorFunction = function(e) {
						var t = "function" == typeof e && e.constructor;
						return !!t && (t === y || "GeneratorFunction" === (t.displayName || t.name))
					}, t.mark = function(e) {
						return Object.setPrototypeOf ? Object.setPrototypeOf(e, C) : (e.__proto__ = C, u(e, l, "GeneratorFunction")), e.prototype = Object.create(S), e
					}, t.awrap = function(e) {
						return {
							__await: e
						}
					}, B(A.prototype), u(A.prototype, s, (function() {
						return this
					})), t.AsyncIterator = A, t.async = function(e, r, o, i, a) {
						void 0 === a && (a = Promise);
						var n = new A(d(e, r, o, i), a);
						return t.isGeneratorFunction(r) ? n : n.next().then((function(e) {
							return e.done ? e.value : n.next()
						}))
					}, B(S), u(S, l, "Generator"), u(S, _, (function() {
						return this
					})), u(S, "toString", (function() {
						return "[object Generator]"
					})), t.keys = function(e) {
						var t = Object(e),
							r = [];
						for (var o in t) r.push(o);
						return r.reverse(),
							function e() {
								for (; r.length;) {
									var o = r.pop();
									if (o in t) return e.value = o, e.done = !1, e
								}
								return e.done = !0, e
							}
					}, t.values = P, E.prototype = {
						constructor: E,
						reset: function(t) {
							if (this.prev = 0, this.next = 0, this.sent = this._sent = e, this.done = !1, this.delegate = null, this.method = "next", this.arg = e, this.tryEntries.forEach(L), !t)
								for (var r in this) "t" === r.charAt(0) && o.call(this, r) && !isNaN(+r.slice(1)) && (this[r] = e)
						},
						stop: function() {
							this.done = !0;
							var e = this.tryEntries[0].completion;
							if ("throw" === e.type) throw e.arg;
							return this.rval
						},
						dispatchException: function(t) {
							if (this.done) throw t;
							var r = this;

							function i(o, i) {
								return _.type = "throw", _.arg = t, r.next = o, i && (r.method = "next", r.arg = e), !!i
							}
							for (var a = this.tryEntries.length - 1; a >= 0; --a) {
								var n = this.tryEntries[a],
									_ = n.completion;
								if ("root" === n.tryLoc) return i("end");
								if (n.tryLoc <= this.prev) {
									var s = o.call(n, "catchLoc"),
										c = o.call(n, "finallyLoc");
									if (s && c) {
										if (this.prev < n.catchLoc) return i(n.catchLoc, !0);
										if (this.prev < n.finallyLoc) return i(n.finallyLoc)
									} else if (s) {
										if (this.prev < n.catchLoc) return i(n.catchLoc, !0)
									} else {
										if (!c) throw Error("try statement without catch or finally");
										if (this.prev < n.finallyLoc) return i(n.finallyLoc)
									}
								}
							}
						},
						abrupt: function(e, t) {
							for (var r = this.tryEntries.length - 1; r >= 0; --r) {
								var i = this.tryEntries[r];
								if (i.tryLoc <= this.prev && o.call(i, "finallyLoc") && this.prev < i.finallyLoc) {
									var a = i;
									break
								}
							}
							a && ("break" === e || "continue" === e) && a.tryLoc <= t && t <= a.finallyLoc && (a = null);
							var n = a ? a.completion : {};
							return n.type = e, n.arg = t, a ? (this.method = "next", this.next = a.finallyLoc, g) : this.complete(n)
						},
						complete: function(e, t) {
							if ("throw" === e.type) throw e.arg;
							return "break" === e.type || "continue" === e.type ? this.next = e.arg : "return" === e.type ? (this.rval = this.arg = e.arg, this.method = "return", this.next = "end") : "normal" === e.type && t && (this.next = t), g
						},
						finish: function(e) {
							for (var t = this.tryEntries.length - 1; t >= 0; --t) {
								var r = this.tryEntries[t];
								if (r.finallyLoc === e) return this.complete(r.completion, r.afterLoc), L(r), g
							}
						},
						catch: function(e) {
							for (var t = this.tryEntries.length - 1; t >= 0; --t) {
								var r = this.tryEntries[t];
								if (r.tryLoc === e) {
									var o = r.completion;
									if ("throw" === o.type) {
										var i = o.arg;
										L(r)
									}
									return i
								}
							}
							throw Error("illegal catch attempt")
						},
						delegateYield: function(t, r, o) {
							return this.delegate = {
								iterator: P(t),
								resultName: r,
								nextLoc: o
							}, "next" === this.method && (this.arg = e), g
						}
					}, t
				}

				function l(e, t, r, o, i, a, n) {
					try {
						var _ = e[a](n),
							s = _.value
					} catch (e) {
						return void r(e)
					}
					_.done ? t(s) : Promise.resolve(s).then(o, i)
				}

				function u(e) {
					return function() {
						var t = this,
							r = arguments;
						return new Promise((function(o, i) {
							var a = e.apply(t, r);

							function n(e) {
								l(a, o, i, n, _, "next", e)
							}

							function _(e) {
								l(a, o, i, n, _, "throw", e)
							}
							n(void 0)
						}))
					}
				}

				function d(e, t) {
					var r = Object.keys(e);
					if (Object.getOwnPropertySymbols) {
						var o = Object.getOwnPropertySymbols(e);
						t && (o = o.filter((function(t) {
							return Object.getOwnPropertyDescriptor(e, t).enumerable
						}))), r.push.apply(r, o)
					}
					return r
				}

				function p(e) {
					for (var t = 1; t < arguments.length; t++) {
						var r = null != arguments[t] ? arguments[t] : {};
						t % 2 ? d(Object(r), !0).forEach((function(t) {
							h(e, t, r[t])
						})) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(r)) : d(Object(r)).forEach((function(t) {
							Object.defineProperty(e, t, Object.getOwnPropertyDescriptor(r, t))
						}))
					}
					return e
				}

				function h(e, t, r) {
					return (t = function(e) {
						var t = function(e, t) {
							if ("object" != n(e) || !e) return e;
							var r = e[Symbol.toPrimitive];
							if (void 0 !== r) {
								var o = r.call(e, "string");
								if ("object" != n(o)) return o;
								throw new TypeError("@@toPrimitive must return a primitive value.")
							}
							return String(e)
						}(e);
						return "symbol" == n(t) ? t : t + ""
					}(t)) in e ? Object.defineProperty(e, t, {
						value: r,
						enumerable: !0,
						configurable: !0,
						writable: !0
					}) : e[t] = r, e
				}
				var v = "课件下载",
					f = ["builtin-video-pages"],
					m = "智云课堂",
					g = {
						"auto-remove": !0
					};

				function b(e) {
					return Array.from(e.courseVue.$data.pptList)
				}

				function y(e) {
					return b(e.elements).length > 0
				}

				function C(e, t) {
					var r = e.logger,
						n = e.elements,
						s = e.addButton,
						l = e.loadScript,
						d = b(n).map((function(e) {
							return p(p({}, e), {}, {
								ppt: p({}, e.ppt)
							})
						})).map((function(e) {
							return e.imgSrc = e.imgSrc.replace("http://", "https://"), e.s_imgSrc = e.s_imgSrc.replace("http://", "https://"), e
						}));
					r.debug("PPT下载(共".concat(d.length, "个):"), d[0]), d = function(e) {
						for (var t = [], r = 0; r < e.length; r++) r + 1 < e.length && e[r + 1].switchTime === e[r].switchTime || t.push(e[r]);
						return t
					}(d), r.debug("删除同一秒内的PPT后(共".concat(d.length, "个):"), d[0]), s(1.1, "打包下载", function() {
						var e = u(c().mark((function e(t) {
							var a, n, _, s, p;
							return c().wrap((function(e) {
								for (;;) switch (e.prev = e.next) {
									case 0:
										return (a = t.setStatus)("加载JSZip库"), l("jszip.min.js"), n = new JSZip, _ = 0, s = d.length, e.next = 8, (0, i.f6)(d.map(function() {
											var e = u(c().mark((function e(t, o) {
												var i, l, u;
												return c().wrap((function(e) {
													for (;;) switch (e.prev = e.next) {
														case 0:
															return i = "ppt-".concat(String(o).padStart(4, "0"), "-").concat(t.switchTime.replace(/\:/g, "-"), ".jpg"), e.next = 3, fetch(t.imgSrc, {
																method: "GET"
															});
														case 3:
															return l = e.sent, e.next = 6, l.blob();
														case 6:
															u = e.sent, r.debug("添加图片", i, u), a("正在下载(".concat(++_, "/").concat(s, ")")), n.file(i, u, {
																binary: !0
															});
														case 10:
														case "end":
															return e.stop()
													}
												}), e)
											})));
											return function(t, r) {
												return e.apply(this, arguments)
											}
										}()), 8);
									case 8:
										return a("生成Zip"), r.debug(n), e.next = 12, n.generateAsync({
											type: "blob"
										});
									case 12:
										p = e.sent, r.debug("完成生成zip", p), a("完成"), (0, o.saveAs)(p, "ppt.zip"), a(null);
									case 17:
									case "end":
										return e.stop()
								}
							}), e)
						})));
						return function(t) {
							return e.apply(this, arguments)
						}
					}()), s(1.2, "导出为PDF", function() {
						var e = u(c().mark((function e(t) {
							var o, n, s, l, p, h, v, f;
							return c().wrap((function(e) {
								for (;;) switch (e.prev = e.next) {
									case 0:
										return o = t.setStatus, n = "", s = 0, l = d.length, e.next = 6, (0, i.f6)(d.map(function() {
											var e = u(c().mark((function e(t, i) {
												var a, n, _;
												return c().wrap((function(e) {
													for (;;) switch (e.prev = e.next) {
														case 0:
															return e.next = 2, fetch(t.imgSrc, {
																method: "GET"
															});
														case 2:
															return a = e.sent, o("正在下载(".concat(++s, "/").concat(l, ")")), e.next = 6, a.blob();
														case 6:
															return n = e.sent, _ = URL.createObjectURL(n), r.log(i, _), e.abrupt("return", _);
														case 10:
														case "end":
															return e.stop()
													}
												}), e)
											})));
											return function(t, r) {
												return e.apply(this, arguments)
											}
										}()), 8);
									case 6:
										p = e.sent, o("生成PDF中"), h = _(p);
										try {
											for (h.s(); !(v = h.n()).done;) f = v.value, n += '<div class="page"><img src="'.concat(f, '" /></div>')
										} catch (e) {
											h.e(e)
										} finally {
											h.f()
										}
										return e.next = 12, (0, a.jt)({
											width: 1280,
											height: 720,
											margin: 0
										}, n);
									case 12:
										o(null);
									case 13:
									case "end":
										return e.stop()
								}
							}), e)
						})));
						return function(t) {
							return e.apply(this, arguments)
						}
					}())
				}
			},
			3766: (e, t, r) => {
				"use strict";
				r.r(t), r.d(t, {
					load: () => n,
					name: () => o,
					namespace: () => a,
					required: () => i
				});
				var o = "视频链接解析",
					i = ["builtin-video-pages"],
					a = "智云课堂";

				function n(e) {
					var t = e.logger,
						r = e.clipboard,
						o = e.elements;
					(0, e.addButton)(2, "解析链接", (function(e) {
						var i = e.setStatus,
							a = function() {
								try {
									return "live" === o.playerVue.liveType ? JSON.parse(o.playerVue.liveUrl.replace("mutli-rate: ", ""))[0].url : document.querySelector("#cmc_player_video").src
								} catch (e) {
									return null
								}
							}();
						a ? (t.info("视频链接:", a), r.copy(a), i("已拷贝"), setTimeout((function() {
							i(null)
						}), 500)) : alert("获取视频地址失败，请待播放器完全加载后再试。")
					}))
				}
			},
			7985: (e, t, r) => {
				"use strict";
				r.r(t), r.d(t, {
					description: () => Ne,
					load: () => Oe,
					name: () => Me,
					namespace: () => $e,
					route: () => Re
				});
				var o = r(5161),
					i = r(5645),
					a = r(5683),
					n = r(1398),
					_ = r(7798),
					s = r(9839),
					c = r(9897);
				var l = (e => (e.Auto = "Auto", e.Vertical = "Vertical", e.Horizontal = "Horizontal", e.Paging = "Paging", e))(l || {});
				const u = l;
				var d, p = ((d = p || {}).Static = "Static", d.Cyclic = "Cyclic", d);
				const h = p,
					v = class {
						constructor(e, t) {
							if (!e.isUI5Element) throw new Error("The root web component must be a UI5 Element instance");
							if (this.rootWebComponent = e, this.rootWebComponent.addEventListener("keydown", this._onkeydown.bind(this)), this._initBound = this._init.bind(this), this.rootWebComponent.attachComponentStateFinalized(this._initBound), "function" != typeof t.getItemsCallback) throw new Error("getItemsCallback is required");
							this._getItems = t.getItemsCallback, this._currentIndex = t.currentIndex || 0, this._rowSize = t.rowSize || 1, this._behavior = t.behavior || h.Static, this._navigationMode = t.navigationMode || u.Auto, this._affectedPropertiesNames = t.affectedPropertiesNames || [], this._skipItemsSize = t.skipItemsSize || null
						}
						setCurrentItem(e) {
							const t = this._getItems().indexOf(e); - 1 !== t ? (this._currentIndex = t, this._applyTabIndex()) : console.warn("The provided item is not managed by ItemNavigation", e)
						}
						setRowSize(e) {
							this._rowSize = e
						}
						_init() {
							this._getItems().forEach(((e, t) => {
								e.forcedTabIndex = t === this._currentIndex ? "0" : "-1"
							}))
						}
						_onkeydown(e) {
							if (!this._canNavigate()) return;
							const t = this._navigationMode === u.Horizontal || this._navigationMode === u.Auto,
								r = this._navigationMode === u.Vertical || this._navigationMode === u.Auto,
								o = "rtl" === this.rootWebComponent.effectiveDir;
							if (o && (0, c.OC)(e) && t) this._handleRight();
							else if (o && (0, c.FG)(e) && t) this._handleLeft();
							else if ((0, c.OC)(e) && t) this._handleLeft();
							else if ((0, c.FG)(e) && t) this._handleRight();
							else if ((0, c.ie)(e) && r) this._handleUp();
							else if ((0, c.Pj)(e) && r) this._handleDown();
							else if ((0, c.qN)(e)) this._handleHome();
							else if ((0, c.uV)(e)) this._handleEnd();
							else if ((0, c.vQ)(e)) this._handlePageUp();
							else {
								if (!(0, c.oY)(e)) return;
								this._handlePageDown()
							}
							e.preventDefault(), this._applyTabIndex(), this._focusCurrentItem()
						}
						_handleUp() {
							const e = this._getItems().length;
							if (this._currentIndex - this._rowSize >= 0) this._currentIndex -= this._rowSize;
							else if (this._behavior === h.Cyclic) {
								const t = this._currentIndex % this._rowSize;
								let r = (0 === t ? this._rowSize - 1 : t - 1) + (Math.ceil(e / this._rowSize) - 1) * this._rowSize;
								r > e - 1 && (r -= this._rowSize), this._currentIndex = r
							} else this._currentIndex = 0
						}
						_handleDown() {
							const e = this._getItems().length;
							if (this._currentIndex + this._rowSize < e) this._currentIndex += this._rowSize;
							else if (this._behavior === h.Cyclic) {
								const e = (this._currentIndex % this._rowSize + 1) % this._rowSize;
								this._currentIndex = e
							} else this._currentIndex = e - 1
						}
						_handleLeft() {
							const e = this._getItems().length;
							this._currentIndex > 0 ? this._currentIndex -= 1 : this._behavior === h.Cyclic && (this._currentIndex = e - 1)
						}
						_handleRight() {
							const e = this._getItems().length;
							this._currentIndex < e - 1 ? this._currentIndex += 1 : this._behavior === h.Cyclic && (this._currentIndex = 0)
						}
						_handleHome() {
							const e = this._rowSize > 1 ? this._rowSize : this._getItems().length;
							this._currentIndex -= this._currentIndex % e
						}
						_handleEnd() {
							const e = this._rowSize > 1 ? this._rowSize : this._getItems().length;
							this._currentIndex += e - 1 - this._currentIndex % e
						}
						_handlePageUp() {
							this._rowSize > 1 || this._handlePageUpFlat()
						}
						_handlePageDown() {
							this._rowSize > 1 || this._handlePageDownFlat()
						}
						_handlePageUpFlat() {
							null !== this._skipItemsSize && this._currentIndex + 1 > this._skipItemsSize ? this._currentIndex -= this._skipItemsSize : this._currentIndex -= this._currentIndex
						}
						_handlePageDownFlat() {
							null !== this._skipItemsSize && this._getItems().length - this._currentIndex - 1 > this._skipItemsSize ? this._currentIndex += this._skipItemsSize : this._currentIndex = this._getItems().length - 1
						}
						_applyTabIndex() {
							const e = this._getItems();
							for (let t = 0; t < e.length; t++) e[t].forcedTabIndex = t === this._currentIndex ? "0" : "-1";
							this._affectedPropertiesNames.forEach((e => {
								const t = this.rootWebComponent[e];
								this.rootWebComponent[e] = Array.isArray(t) ? [...t] : {
									...t
								}
							}))
						}
						_focusCurrentItem() {
							const e = this._getCurrentItem();
							e && e.focus()
						}
						_canNavigate() {
							const e = this._getCurrentItem(),
								t = (() => {
									let e = document.activeElement;
									for (; e && e.shadowRoot && e.shadowRoot.activeElement;) e = e.shadowRoot.activeElement;
									return e
								})();
							return e && e === t
						}
						_getCurrentItem() {
							const e = this._getItems();
							if (!e.length) return;
							for (; this._currentIndex >= e.length;) this._currentIndex -= this._rowSize;
							this._currentIndex < 0 && (this._currentIndex = 0);
							const t = e[this._currentIndex];
							if (!t) return;
							if ((0, o.W)(t)) return t.getFocusDomRef();
							const r = this.rootWebComponent.getDomRef();
							return r && t.id ? r.querySelector(`[id="${t.id}"]`) : void 0
						}
					},
					f = {
						key: "TIMELINE_ARIA_LABEL",
						defaultText: "Timeline"
					};

				function m(e, t, r, o, i) {
					return s.qy`<li class="ui5-timeline-list-item"><slot name="${(0,s.JR)(o._individualSlot)}"></slot></li>`
				}
				var g, b = r(4456),
					y = r(1573),
					C = r(8863),
					w = r(5587),
					x = r(2234);
				! function(e) {
					e.Default = "Default", e.Subtle = "Subtle", e.Emphasized = "Emphasized"
				}(g || (g = {}));
				const k = g;

				function S(e, t, r) {
					return r ? s.qy`<${(0,s.DL)("ui5-icon",t,r)} class="ui5-link-icon" name="${(0,s.JR)(this.icon)}" mode="Decorative" part="icon"></${(0,s.DL)("ui5-icon",t,r)}>` : s.qy`<ui5-icon class="ui5-link-icon" name="${(0,s.JR)(this.icon)}" mode="Decorative" part="icon"></ui5-icon>`
				}

				function B(e, t, r) {
					return s.qy`<span class="ui5-hidden-text">${(0,s.JR)(this.linkTypeText)}</span>`
				}

				function A(e, t, r) {
					return r ? s.qy`<${(0,s.DL)("ui5-icon",t,r)} class="ui5-link-end-icon" name="${(0,s.JR)(this.endIcon)}" mode="Decorative" part="endIcon"></${(0,s.DL)("ui5-icon",t,r)}>` : s.qy`<ui5-icon class="ui5-link-end-icon" name="${(0,s.JR)(this.endIcon)}" mode="Decorative" part="endIcon"></ui5-icon>`
				}
				var T = r(5637),
					I = r(5578),
					q = r(6180),
					L = r(7395);
				(0, I.Rh)("@ui5/webcomponents-theming", "sap_horizon", (async () => q.A)), (0, I.Rh)("@ui5/webcomponents", "sap_horizon", (async () => L.A));
				var E, P = function(e, t, r, o) {
					var i, a = arguments.length,
						n = a < 3 ? t : null === o ? o = Object.getOwnPropertyDescriptor(t, r) : o;
					if ("object" == typeof Reflect && "function" == typeof Reflect.decorate) n = Reflect.decorate(e, t, r, o);
					else
						for (var _ = e.length - 1; _ >= 0; _--)(i = e[_]) && (n = (a < 3 ? i(n) : a > 3 ? i(t, r, n) : i(t, r)) || n);
					return a > 3 && n && Object.defineProperty(t, r, n), n
				};
				let z = E = class extends o.A {
					constructor() {
						super(), this.disabled = !1, this.design = "Default", this.wrappingType = "Normal", this.accessibleRole = "Link", this.accessibilityAttributes = {}, this._dummyAnchor = document.createElement("a")
					}
					onEnterDOM() {
						(0, w.xl)() && this.setAttribute("desktop", "")
					}
					onBeforeRendering() {
						const e = "_self" !== this.target && this.href && this._isCrossOrigin(this.href);
						this._rel = e ? "noreferrer noopener" : void 0
					}
					_isCrossOrigin(e) {
						return this._dummyAnchor.href = e, !(this._dummyAnchor.hostname === (0, x.VQ)() && this._dummyAnchor.port === (0, x.lj)() && this._dummyAnchor.protocol === (0, x.iw)())
					}
					get effectiveTabIndex() {
						return this.forcedTabIndex ? this.forcedTabIndex : this.disabled || !this.textContent?.length ? "-1" : "0"
					}
					get ariaLabelText() {
						return (0, C.ax)(this)
					}
					get hasLinkType() {
						return this.design !== k.Default
					}
					static typeTextMappings() {
						return {
							Subtle: T.FvC,
							Emphasized: T.Kdd
						}
					}
					get linkTypeText() {
						return E.i18nBundle.getText(E.typeTextMappings()[this.design])
					}
					get parsedRef() {
						return this.href && this.href.length > 0 ? this.href : void 0
					}
					get effectiveAccRole() {
						return this.accessibleRole.toLowerCase()
					}
					get _hasPopup() {
						return this.accessibilityAttributes.hasPopup
					}
					_onclick(e) {
						const {
							altKey: t,
							ctrlKey: r,
							metaKey: o,
							shiftKey: i
						} = e;
						e.stopImmediatePropagation(), this.fireDecoratorEvent("click", {
							altKey: t,
							ctrlKey: r,
							metaKey: o,
							shiftKey: i
						}) || e.preventDefault()
					}
					_onkeydown(e) {
						(0, c.RI)(e) && !this.href ? this._onclick(e) : (0, c.xC)(e) && e.preventDefault()
					}
					_onkeyup(e) {
						if ((0, c.xC)(e) && (this._onclick(e), this.href && !e.defaultPrevented)) {
							const e = new MouseEvent("click");
							e.stopImmediatePropagation(), this.getDomRef().dispatchEvent(e)
						}
					}
				};
				P([(0, a.A)({
					type: Boolean
				})], z.prototype, "disabled", void 0), P([(0, a.A)()], z.prototype, "tooltip", void 0), P([(0, a.A)()], z.prototype, "href", void 0), P([(0, a.A)()], z.prototype, "target", void 0), P([(0, a.A)()], z.prototype, "design", void 0), P([(0, a.A)()], z.prototype, "wrappingType", void 0), P([(0, a.A)()], z.prototype, "accessibleName", void 0), P([(0, a.A)()], z.prototype, "accessibleNameRef", void 0), P([(0, a.A)()], z.prototype, "accessibleRole", void 0), P([(0, a.A)({
					type: Object
				})], z.prototype, "accessibilityAttributes", void 0), P([(0, a.A)()], z.prototype, "icon", void 0), P([(0, a.A)()], z.prototype, "endIcon", void 0), P([(0, a.A)({
					noAttribute: !0
				})], z.prototype, "_rel", void 0), P([(0, a.A)({
					noAttribute: !0
				})], z.prototype, "forcedTabIndex", void 0), P([(0, _.A)("@ui5/webcomponents")], z, "i18nBundle", void 0), z = E = P([(0, i.A)({
					tag: "ui5-link",
					languageAware: !0,
					renderer: s.Ay,
					template: function(e, t, r) {
						return s.qy`<a part="root" class="ui5-link-root" role="${(0,s.JR)(this.effectiveAccRole)}" href="${(0,s.JR)(this.parsedRef)}" target="${(0,s.JR)(this.target)}" rel="${(0,s.JR)(this._rel)}" tabindex="${(0,s.JR)(this.effectiveTabIndex)}" title="${(0,s.JR)(this.tooltip)}" ?disabled="${this.disabled}" aria-label="${(0,s.JR)(this.ariaLabelText)}" aria-haspopup="${(0,s.JR)(this._hasPopup)}" aria-expanded="${(0,s.JR)(this.accessibilityAttributes.expanded)}" aria-current="${(0,s.JR)(this.accessibilityAttributes.current)}" @click=${this._onclick} @keydown=${this._onkeydown} @keyup=${this._onkeyup}>${this.icon?S.call(this,e,t,r):void 0}<span class="ui5-link-text"><slot></slot></span>${this.hasLinkType?B.call(this,e,t,r):void 0}${this.endIcon?A.call(this,e,t,r):void 0}</a>`
					},
					styles: {
						packageName: "@ui5/webcomponents",
						fileName: "themes/Link.css.ts",
						content: '.ui5-hidden-text{position:absolute;clip:rect(1px,1px,1px,1px);user-select:none;left:-1000px;top:-1000px;pointer-events:none;font-size:0}:host(:not([hidden])){display:inline-flex}:host{max-width:100%;color:var(--sapLinkColor);font-family:var(--sapFontFamily);font-size:var(--sapFontSize);cursor:pointer;outline:none;text-decoration:var(--_ui5-v2-4-0_link_text_decoration);text-shadow:var(--sapContent_TextShadow);white-space:normal;overflow-wrap:break-word}:host(:hover){color:var(--sapLink_Hover_Color);text-decoration:var(--_ui5-v2-4-0_link_hover_text_decoration)}:host(:active){color:var(--sapLink_Active_Color);text-decoration:var(--_ui5-v2-4-0_link_active_text_decoration)}:host([disabled]){pointer-events:none}:host([disabled]) .ui5-link-root{text-shadow:none;outline:none;cursor:default;pointer-events:none;opacity:var(--sapContent_DisabledOpacity)}:host([design="Emphasized"]) .ui5-link-root{font-family:var(--sapFontBoldFamily)}:host([design="Subtle"]){color:var(--sapLink_SubtleColor);text-decoration:var(--_ui5-v2-4-0_link_subtle_text_decoration)}:host([design="Subtle"]:hover:not(:active)){color:var(--sapLink_SubtleColor);text-decoration:var(--_ui5-v2-4-0_link_subtle_text_decoration_hover)}:host([wrapping-type="None"]){white-space:nowrap;overflow-wrap:normal}.ui5-link-root{max-width:100%;display:inline-block;position:relative;overflow:hidden;text-overflow:ellipsis;outline:none;white-space:inherit;overflow-wrap:inherit;text-decoration:inherit;color:inherit}:host([wrapping-type="None"][end-icon]) .ui5-link-root{display:inline-flex;align-items:end}:host .ui5-link-root{outline-offset:-.0625rem;border-radius:var(--_ui5-v2-4-0_link_focus_border-radius)}.ui5-link-icon,.ui5-link-end-icon{color:inherit;flex-shrink:0}.ui5-link-icon{float:inline-start;margin-inline-end:.125rem}.ui5-link-end-icon{margin-inline-start:.125rem;vertical-align:bottom}.ui5-link-text{overflow:hidden;text-overflow:ellipsis}.ui5-link-root:focus-visible,:host([desktop]) .ui5-link-root:focus-within,:host([design="Subtle"]) .ui5-link-root:focus-visible,:host([design="Subtle"][desktop]) .ui5-link-root:focus-within{background-color:var(--_ui5-v2-4-0_link_focus_background_color);outline:var(--_ui5-v2-4-0_link_outline);border-radius:var(--_ui5-v2-4-0_link_focus_border-radius);text-shadow:none;color:var(--_ui5-v2-4-0_link_focus_color)}:host(:not([desktop])) .ui5-link-root:focus-visible,:host([desktop]:focus-within),:host([design="Subtle"][desktop]:focus-within){text-decoration:var(--_ui5-v2-4-0_link_focus_text_decoration)}:host([desktop]:hover:not(:active):focus-within),:host([design="Subtle"][desktop]:hover:not(:active):focus-within){color:var(--_ui5-v2-4-0_link_focused_hover_text_color);text-decoration:var(--_ui5-v2-4-0_link_focused_hover_text_decoration)}\n'
					},
					dependencies: [y.A]
				}), (0, b.A)("click", {
					detail: {
						altKey: {
							type: Boolean
						},
						ctrlKey: {
							type: Boolean
						},
						metaKey: {
							type: Boolean
						},
						shiftKey: {
							type: Boolean
						}
					},
					bubbles: !0,
					cancelable: !0
				})], z), z.define();
				const F = z;

				function H(e, t, r) {
					return r ? s.qy`<${(0,s.DL)("ui5-icon",t,r)} class="ui5-tli-icon" name="${(0,s.JR)(this.icon)}"></${(0,s.DL)("ui5-icon",t,r)}>` : s.qy`<ui5-icon class="ui5-tli-icon" name="${(0,s.JR)(this.icon)}"></ui5-icon>`
				}

				function M(e, t, r) {
					return s.qy`<div class="ui5-tli-dummy-icon-container"></div>`
				}

				function N(e, t, r) {
					return s.qy`<div class="ui5-tli-bubble" tabindex="${(0,s.JR)(this.forcedTabIndex)}" data-sap-focus-ref><div class="ui5-tli-title">${this.name?$.call(this,e,t,r):void 0}<span>${(0,s.JR)(this.titleText)}</span></div><div class="ui5-tli-subtitle">${(0,s.JR)(this.subtitleText)}</div>${this.content?j.call(this,e,t,r):void 0}<span class="${(0,s.Hk)(this.classes.bubbleArrowPosition)}"></span></div>`
				}

				function $(e, t, r) {
					return s.qy`${this.nameClickable?R.call(this,e,t,r):O.call(this,e,t,r)}`
				}

				function R(e, t, r) {
					return r ? s.qy`<${(0,s.DL)("ui5-link",t,r)} @ui5-click="${(0,s.JR)(this.onNamePress)}" class="ui5-tli-title-name-clickable" wrapping-type="None">${(0,s.JR)(this.name)}&nbsp;</${(0,s.DL)("ui5-link",t,r)}>` : s.qy`<ui5-link @ui5-click="${(0,s.JR)(this.onNamePress)}" class="ui5-tli-title-name-clickable" wrapping-type="None">${(0,s.JR)(this.name)}&nbsp;</ui5-link>`
				}

				function O(e, t, r) {
					return s.qy`<span class="ui5-tli-title-name">${(0,s.JR)(this.name)}&nbsp;</span>`
				}

				function j(e, t, r) {
					return s.qy`<div class="ui5-tli-desc"><slot></slot></div>`
				}
				var D;
				! function(e) {
					e.Vertical = "Vertical", e.Horizontal = "Horizontal"
				}(D || (D = {}));
				const U = D,
					G = {
						packageName: "@ui5/webcomponents-fiori",
						fileName: "themes/sap_horizon/parameters-bundle.css.ts",
						content: ":root{--_ui5-v2-4-0_fcl_solid_bg: var(--sapShell_Background);--_ui5-v2-4-0_fcl_decoration_top: linear-gradient(to top, var(--sapHighlightColor), transparent);--_ui5-v2-4-0_fcl_decoration_bottom: linear-gradient(to bottom, var(--sapHighlightColor), transparent);--_ui5-v2-4-0_fcl_separator_focus_border: .125rem solid var(--sapContent_FocusColor);--sapIllus_BrandColorPrimary: var(--sapContent_Illustrative_Color1);--sapIllus_BrandColorSecondary: var(--sapContent_Illustrative_Color2);--sapIllus_StrokeDetailColor: var(--sapContent_Illustrative_Color4);--sapIllus_Layering1: var(--sapContent_Illustrative_Color5);--sapIllus_Layering2: var(--sapContent_Illustrative_Color6);--sapIllus_BackgroundColor: var(--sapContent_Illustrative_Color7);--sapIllus_ObjectFillColor: var(--sapContent_Illustrative_Color8);--sapIllus_AccentColor: var(--sapContent_Illustrative_Color3);--sapIllus_NoColor: none;--sapIllus_PatternShadow: url(#sapIllus_PatternShadow);--sapIllus_PatternHighlight: url(#sapIllus_PatternHighlight);--_ui5-v2-4-0_media_gallery_thumbnail_border: 1px solid var(--sapContent_ForegroundColor);--_ui5-v2-4-0_media_gallery_thumbnail_selected_border: 2px solid var(--sapSelectedColor);--_ui5-v2-4-0_media_gallery_thumbnail_focus_outline: var(--sapContent_FocusWidth) var(--sapContent_FocusStyle) var(--sapContent_FocusColor);--_ui5-v2-4-0_media_gallery_item_overlay_box_shadow: inset 0px 0px 80px rgba(0, 0, 0, .2);--_ui5-v2-4-0-notification_group_header-margin: 0px;--_ui5-v2-4-0-notification_group_header-margin-expanded: .5rem;--_ui5-v2-4-0-notification_item-title-padding-end-two-buttons: 4.375rem;--_ui5-v2-4-0-notification_item-title-padding-end-one-button: 2.125rem;--_ui5-v2-4-0-notification_item-description-margin-top: .75rem;--_ui5-v2-4-0-notification_item-footer-margin-top: .75rem;--_ui5-v2-4-0-notification_item-border-radius: var(--sapTile_BorderCornerRadius);--_ui5-v2-4-0-notification_group_header-border-bottom-width: 0;--_ui5-v2-4-0-notification_group_header-padding: .5rem;--_ui5-v2-4-0-notification_item-state-icon-padding: .25rem;--_ui5-v2-4-0-notification_item-border-bottom: var(--sapList_BorderWidth) solid var(--sapList_BorderColor);--_ui5-v2-4-0-notification_item-border-top-left-right: var(--sapList_BorderWidth) solid var(--sapList_BorderColor);--_ui5-v2-4-0-notification_item-margin: 0 .5rem .5rem .5rem;--_ui5-v2-4-0-notification_item-background-color-hover: var(--sapList_Hover_Background);--_ui5-v2-4-0-notification_item-background-color-active: var(--sapList_SelectionBackgroundColor);--_ui5-v2-4-0-notification_item-border-active: 1px solid var(--sapList_SelectionBorderColor);--_ui5-v2-4-0-notification_item-root-padding-inline: 1rem;--_ui5-v2-4-0-notification_item-content-padding: .75rem 0;--_ui5-v2-4-0-notification_item-title-margin-bottom: 0;--_ui5-v2-4-0-notification_item-focus-offset: .1875rem;--_ui5-v2-4-0-notification_item-outline-offset: -.375rem;--_ui5-v2-4-0-notification_item-growing-btn-background-color-active: var(--_ui5-v2-4-0-notification_item-background-color-active);--_ui5-v2-4-0_page_list_bg: var(--sapGroup_ContentBackground);--_ui5-v2-4-0_page_transparent_bg: transparent;--_ui5-v2-4-0_vsd_header_container: 2.75rem;--_ui5-v2-4-0_vsd_sub_header_container_height: 2.75rem;--_ui5-v2-4-0_vsd_content_li_padding: .375rem;--_ui5-v2-4-0_vsd_content_height: 23.4375rem;--_ui5-v2-4-0_vsd_expand_content_height: 26.1875rem;--_ui5-v2-4-0_product_switch_item_width: 11.25rem;--_ui5-v2-4-0_product_switch_item_height: 7rem;--_ui5-v2-4-0_product_switch_item_outline_width: .0625rem;--_ui5-v2-4-0_product_switch_item_outline_color: var(--sapContent_FocusColor);--_ui5-v2-4-0_product_switch_item_outline: var(--_ui5-v2-4-0_product_switch_item_outline_width) var(--_ui5-v2-4-0_product_switch_item_outline_color) dotted;--_ui5-v2-4-0_product_switch_item_outline_offset: -.1875rem;--_ui5-v2-4-0_product_switch_item_outline_offset_positive: .1875rem;--_ui5-v2-4-0_product_switch_item_active_outline_color: var(--sapContent_FocusColor);--_ui5-v2-4-0_shellbar_root_height: 3.25rem;--_ui5-v2-4-0_shellbar_logo_outline_color: var(--sapContent_FocusColor);--_ui5-v2-4-0_shellbar_logo_outline: var(--sapContent_FocusWidth) var(--sapContent_FocusStyle) var(--_ui5-v2-4-0_shellbar_logo_outline_color);--_ui5-v2-4-0_shellbar_logo_outline_offset: -.125rem;--_ui5-v2-4-0_shellbar_outline_offset: -.25rem;--_ui5-v2-4-0_shellbar_button_border: none;--_ui5-v2-4-0_shellbar_button_border_radius: var(--sapButton_BorderCornerRadius);--_ui5-v2-4-0_shellbar_button_focused_border: .125rem solid var(--sapContent_FocusColor);--_ui5-v2-4-0_shellbar_button_badge_border: 1px solid var(--sapContent_BadgeBackground);--_ui5-v2-4-0_shellbar_logo_border_radius: .5rem;--_ui5-v2-4-0_shellbar_button_box_shadow: var(--sapContent_Interaction_Shadow);--_ui5-v2-4-0_shellbar_button_box_shadow_active: inset 0 0 0 .0625rem var(--sapButton_Lite_Active_BorderColor);--_ui5-v2-4-0_shellbar_button_active_color: var(--sapShell_Active_TextColor);--_ui5-v2-4-0_shellbar_logo_outline_border_radius: var(--sapField_BorderCornerRadius);--_ui5-v2-4-0_shellbar_search_button_border_radius: 50%;--_ui5-v2-4-0_shellbar_search_button_size: 1.75rem;--_ui5-v2-4-0_shellbar_search_field_height: 2.25rem;--_ui5-v2-4-0_shellbar_search_field_background: var(--sapShell_InteractiveBackground);--_ui5-v2-4-0_shellbar_search_field_border: none;--_ui5-v2-4-0_shellbar_search_field_color: var(--sapShell_InteractiveTextColor);--_ui5-v2-4-0_shellbar_search_field_background_hover: var(--sapShell_Hover_Background);--_ui5-v2-4-0_shellbar_search_field_box_shadow: var(--sapField_Shadow), inset 0 -.0625rem var(--sapField_BorderColor);--_ui5-v2-4-0_shellbar_search_field_box_shadow_hover: var(--sapField_Hover_Shadow), inset 0 -.0625rem var(--sapField_Hover_BorderColor);--_ui5-v2-4-0_shellbar_input_focus_outline_color: var(--sapField_Active_BorderColor);--_ui5-v2-4-0_shellbar_overflow_container_middle_height: 3rem;--_ui5-v2-4-0_shellbar_menu_button_title_font_size: var(--sapFontHeader5Size);--_ui5-v2-4-0_shellbar_input_border_radius: 1.125rem;--_ui5-v2-4-0_shellbar_input_focus_border_radius: 1.125rem;--_ui5-v2-4-0_shellbar_input_background_color: var(--sapShell_InteractiveBackground);--_ui5-v2-4-0_TimelineItem_arrow_size: 1.625rem;--_ui5-v2-4-0_TimelineItem_bubble_border_width: .125rem;--_ui5-v2-4-0_TimelineItem_bubble_border_style: solid;--_ui5-v2-4-0_TimelineItem_bubble_border_radius: var(--sapElement_BorderCornerRadius);--_ui5-v2-4-0_TimelineItem_bubble_border_color: var(--sapGroup_ContentBorderColor);--_ui5-v2-4-0_TimelineItem_bubble_border_top: -.25rem;--_ui5-v2-4-0_TimelineItem_bubble_border_right: -.25rem;--_ui5-v2-4-0_TimelineItem_bubble_border_bottom: -.25rem;--_ui5-v2-4-0_TimelineItem_bubble_border_left: -.75rem;--_ui5-v2-4-0_TimelineItem_bubble_rtl_left_offset: -.25rem;--_ui5-v2-4-0_TimelineItem_bubble_rtl_right_offset: -.75rem;--_ui5-v2-4-0_TimelineItem_bubble_focus_border_radius: .875rem;--_ui5-v2-4-0_TimelineItem_horizontal_bubble_focus_top_offset: -.75rem;--_ui5-v2-4-0_TimelineItem_horizontal_bubble_focus_left_offset: -.25rem;--_ui5-v2-4-0_TimelineItem_bubble_content_padding: .5rem;--_ui5-v2-4-0_TimelineItem_bubble_content_subtitle_padding_top: .125rem;--_ui5-v2-4-0_TimelineItem_bubble_content_description_padding_top: .5rem;--_ui5-v2-4-0_side_navigation_hover_border_style_color: none;--_ui5-v2-4-0_side_navigation_hover_border_width: 0;--_ui5-v2-4-0_side_navigation_group_border_width: 0 0 .0625rem 0;--_ui5-v2-4-0_side_navigation_item_border_style_color: none;--_ui5-v2-4-0_side_navigation_item_border_width: 0;--_ui5-v2-4-0_side_navigation_last_item_border_style_color: none;--_ui5-v2-4-0_side_navigation_item_padding_left: .5rem;--_ui5-v2-4-0_side_navigation_no_icons_group_padding: 1rem;--_ui5-v2-4-0_side_navigation_selected_item_border_color: var(--sapList_SelectionBorderColor);--_ui5-v2-4-0_side_navigation_selected_border_width: 0 0 .0625rem 0;--_ui5-v2-4-0_side_navigation_collapsed_selected_item_border_style_color: solid var(--_ui5-v2-4-0_side_navigation_selected_item_border_color);--_ui5-v2-4-0_side_navigation_collapsed_selected_group_border_color: var(--_ui5-v2-4-0_side_navigation_selected_item_border_color);--_ui5-v2-4-0_side_navigation_group_expanded_border_width: 0;--_ui5-v2-4-0_side_navigation_group_bottom_border_color: var(--sapList_BorderColor);--_ui5-v2-4-0_side_navigation_popup_arrow_box_shadow: var(--sapContent_Shadow2);--_ui5-v2-4-0_side_navigation_width: 16rem;--_ui5-v2-4-0_side_navigation_collapsed_width: 3.5rem;--_ui5-v2-4-0_side_navigation_navigation_separator_margin: .5rem;--_ui5-v2-4-0_side_navigation_navigation_separator_margin_collapsed: .5rem;--_ui5-v2-4-0_side_navigation_navigation_separator_background_color: var(--sapToolbar_SeparatorColor);--_ui5-v2-4-0_side_navigation_navigation_separator_radius: .125rem;--_ui5-v2-4-0_side_navigation_navigation_separator_height: .0625rem;--_ui5-v2-4-0_side_navigation_triangle_color: var(--sapContent_NonInteractiveIconColor);--_ui5-v2-4-0_side_navigation_border_right: 0;--_ui5-v2-4-0_side_navigation_box_shadow: var(--sapContent_Shadow0);--_ui5-v2-4-0_side_navigation_triangle_display: none;--_ui5-v2-4-0_side_navigation_phone_width: 100%;--_ui5-v2-4-0_side_navigation_icon_color: var(--sapList_TextColor);--_ui5-v2-4-0_side_navigation_icon_font_size: 1.125rem;--_ui5-v2-4-0_side_navigation_expand_icon_color: var(--sapList_TextColor);--_ui5-v2-4-0_side_navigation_external_link_icon_color: var(--sapContent_LabelColor);--_ui5-v2-4-0_side_navigation_group_border_style_color: none;--_ui5-v2-4-0_side_navigation_item_height: 2.5rem;--_ui5-v2-4-0_side_navigation_item_border_radius: .375rem;--_ui5-v2-4-0_side_navigation_item_bottom_margin: .25rem;--_ui5-v2-4-0_side_navigation_item_bottom_margin_compact: .5rem;--_ui5-v2-4-0_side_navigation_item_transition: background-color .3s ease-in-out;--_ui5-v2-4-0_side_navigation_no_icons_nested_item_padding: 2rem;--_ui5-v2-4-0_side_navigation_item_focus_border_offset: calc(-1 * var(--sapContent_FocusWidth));--_ui5-v2-4-0_side_navigation_item_focus_border_radius: calc(var(--_ui5-v2-4-0_side_navigation_item_border_radius) + var(--sapContent_FocusWidth));--_ui5-v2-4-0_side_navigation_collapsed_selected_item_background: 0 100% / 100% .125rem no-repeat linear-gradient(0deg, var(--sapList_SelectionBorderColor), var(--sapList_SelectionBorderColor)), var(--sapList_SelectionBackgroundColor);--_ui5-v2-4-0_side_navigation_selected_border_style_color: none;--_ui5-v2-4-0_side_navigation_selected_and_focused_border_style_color: var(--_ui5-v2-4-0_side_navigation_selected_border_style_color);--_ui5-v2-4-0_side_navigation_group_icon_width: 2rem;--_ui5-v2-4-0_side_navigation_group_text_weight: bold;--_ui5-v2-4-0_side_navigation_group_bottom_margin_in_popup: .75rem;--_ui5-v2-4-0_side_navigation_padding: .5rem;--_ui5-v2-4-0_side_navigation_padding_compact: 1.5rem .75rem .75rem .75rem;--_ui5-v2-4-0_side_navigation_parent_popup_padding: .75rem;--_ui5-v2-4-0_side_navigation_parent_popup_border_radius: .75rem;--_ui5-v2-4-0_side_navigation_popup_item_padding: 0 .5rem;--_ui5-v2-4-0_side_navigation_popup_icon_width: .5rem;--_ui5-v2-4-0_side_navigation_popup_shadow_color1: color-mix(in srgb, var(--sapContent_ShadowColor) 48%, transparent);--_ui5-v2-4-0_side_navigation_popup_shadow_color2: color-mix(in srgb, var(--sapContent_ShadowColor) 16%, transparent);--_ui5-v2-4-0_side_navigation_popup_box_shadow: 0 0 .125rem 0 var(--_ui5-v2-4-0_side_navigation_popup_shadow_color1), 0 1rem 2rem 0 var(--_ui5-v2-4-0_side_navigation_popup_shadow_color2);--_ui5-v2-4-0_side_navigation_popup_title_text_size: 1.25rem;--_ui5-v2-4-0_side_navigation_popup_title_line_height: 1.5rem;--_ui5-v2-4-0_side_navigation_selection_indicator_display: inline-block;--_ui5-v2-4-0_side_navigation_item_collapsed_icon_padding: 0 .25rem;--_ui5-v2-4-0_side_navigation_item_collapsed_hover_focus_width: fit-content;--_ui5-v2-4-0_side_navigation_item_collapsed_hover_focus_display: block;--_ui5-v2-4-0_side_navigation_item_collapsed_hover_focus_padding_right: 1rem;--ui5-v2-4-0_upload_collection_drop_overlay_border: .125rem solid var(--sapContent_DragAndDropActiveColor);--ui5-v2-4-0_upload_collection_thumbnail_size: 3rem;--ui5-v2-4-0_upload_collection_thumbnail_margin_inline_end: .75rem;--ui5-v2-4-0_upload_collection_small_size_buttons_margin_inline_start: 0;--ui5-v2-4-0_upload_collection_small_size_buttons_margin_block_start: .5rem;--ui5-v2-4-0_upload_collection_drag_overlay_text_color: var(--sapTextColor);--ui5-v2-4-0_upload_collection_drag_overlay_icon_color: var(--sapTextColor);--ui5-v2-4-0_upload_collection_drag_overlay_border: .125rem dashed var(--sapField_BorderColor);--ui5-v2-4-0_upload_collection_drop_overlay_background: var(--sapContent_DragAndDropActiveColor);--ui5-v2-4-0_upload_collection_drag_overlay_border_radius: .5rem;--ui5-v2-4-0_upload_collection_drag_overlay_opacity: .5;--_ui5-v2-4-0_wiz_content_item_wrapper_padding: 1rem;--_ui5-v2-4-0_wiz_content_item_wrapper_bg: var(--sapGroup_ContentBackground);--_ui5-v2-4-0_wiz_tab_selection_line: var(--sapSelectedColor);--_ui5-v2-4-0_wiz_tab_icon_color: var(--sapSelectedColor);--_ui5-v2-4-0_wiz_tab_title_color: var(--sapTextColor);--_ui5-v2-4-0_wiz_tab_title_font_family: var(--sapFontBoldFamily);--_ui5-v2-4-0_wiz_tab_focus_outline: var(--sapContent_FocusWidth) var(--sapContent_FocusStyle) var(--sapContent_FocusColor);--_ui5-v2-4-0_wiz_tab_focus_border_radius: 8px;--_ui5-v2-4-0_wiz_tab_border: 1px solid var(--sapContent_Selected_ForegroundColor);--_ui5-v2-4-0_wiz_tab_active_separator_color: var(--sapContent_Selected_ForegroundColor);--_ui5-v2-4-0_wiz_tab_selected_bg: var(--sapContent_Selected_ForegroundColor);--_ui5-v2-4-0_fcl_column_border: solid .0625rem var(--sapGroup_ContentBorderColor);--_ui5-v2-4-0_media_gallery_overflow_btn_background: var(--sapButton_Background);--_ui5-v2-4-0_media_gallery_overflow_btn_color: var(--sapButton_TextColor);--_ui5-v2-4-0_media_gallery_overflow_btn_border: 1px solid var(--sapButton_BorderColor);--_ui5-v2-4-0_dynamic_page_footer_spacer: 4rem;--_ui5-v2-4-0_dynamic_page_title_padding_S: .5rem 1rem;--_ui5-v2-4-0_dynamic_page_title_padding_M: .5rem 2rem;--_ui5-v2-4-0_dynamic_page_title_padding_L: .5rem 2rem;--_ui5-v2-4-0_dynamic_page_title_padding_XL: .5rem 3rem;--_ui5-v2-4-0_dynamic_page_header_padding_S: .5rem 1rem .125rem;--_ui5-v2-4-0_dynamic_page_header_padding_M: 1rem 2rem;--_ui5-v2-4-0_dynamic_page_header_padding_L: 1rem 2rem;--_ui5-v2-4-0_dynamic_page_header_padding_XL: 1rem 3rem;--_ui5-v2-4-0_dynamic_page_content_padding_S: 2rem 1rem 0;--_ui5-v2-4-0_dynamic_page_content_padding_M: 2rem 2rem 0;--_ui5-v2-4-0_dynamic_page_content_padding_L: 1rem 2rem 0;--_ui5-v2-4-0_dynamic_page_content_padding_XL: 1rem 3rem 0;--ui5-v2-4-0_dynamic_page_background: var(--sapBackgroundColor);--_ui5-v2-4-0_dynamic_page_title_padding_top: .5rem;--_ui5-v2-4-0_dynamic_page_title_padding_bottom: .5rem;--_ui5-v2-4-0_dynamic_page_title_min_height: 4rem;--_ui5-v2-4-0_dynamic_page_title_focus_outline: var(--sapContent_FocusWidth) var(--sapContent_FocusStyle) var(--sapContent_FocusColor);--_ui5-v2-4-0_dynamic_page_title_breadcrumbs_padding_top: .5rem;--_ui5-v2-4-0_dynamic_page_title_breadcrumbs_padding_bottom: .25rem;--_ui5-v2-4-0_dynamic_page_title_heading_padding_top: .3125rem;--_ui5-v2-4-0_dynamic_page_title_subheading_margin_top: .25rem;--_ui5-v2-4-0_dynamic_page_title_content_padding_left: 1rem;--_ui5-v2-4-0_dynamic_page_title_hover_background: var(--sapObjectHeader_Hover_Background);--_ui5-v2-4-0_dynamic_page_snapped_title_on_mobile_line_height: 2rem;--_ui5-v2-4-0_dynamic_page_snapped_title_on_mobile_min_height: 2rem;--_ui5-v2-4-0_dynamic_page_title_focus_outline_offset: -.125rem;--_ui5-v2-4-0_dynamic_page_header_padding_top: 1rem;--_ui5-v2-4-0_dynamic_page_header_padding_bottom: 1rem;--_ui5-v2-4-0_dynamic_page_header_background_color: var(--sapObjectHeader_Background);--_ui5-v2-4-0_dynamic_page_header-actions-box-shadow: var(--sapContent_Shadow0);--_ui5-v2-4-0_dynamic_page_header-box-shadow: var(--sapContent_HeaderShadow);--_ui5-v2-4-0_dynamic_page_header-actions-background: var(--sapObjectHeader_Background);--_ui5-v2-4-0_dynamic_page_header-actions-color: var(--sapButton_TextColor);--_ui5-v2-4-0_dynamic_page_actions-lines-color: var(--sapObjectHeader_BorderColor);--_ui5-v2-4-0_dynamic_page_header-actions-background-pressed: var(--_ui5-v2-4-0_dynamic_page_header-actions-background);--_ui5-v2-4-0_dynamic_page_header-actions-color-pressed: var(--_ui5-v2-4-0_dynamic_page_header-actions-color);--_ui5-v2-4-0_timeline_tlgi_line_horizontal_height: 14.8125rem;--_ui5-v2-4-0_timeline_tlgi_root_horizontal_height: 19.9375rem}[data-ui5-compact-size],.ui5-content-density-compact,.sapUiSizeCompact{--_ui5-v2-4-0-notification_item-description-margin-top: .5rem;--_ui5-v2-4-0-notification_item-footer-margin-top: .5rem;--_ui5-v2-4-0-notification_item-title-padding-end-two-buttons: 3.875rem;--_ui5-v2-4-0-notification_item-title-padding-end-one-button: 1.875rem;--_ui5-v2-4-0_side_navigation_navigation_separator_margin: var(--_ui5-v2-4-0_side_navigation_navigation_separator_margin_collapsed);--_ui5-v2-4-0_side_navigation_padding: var(--_ui5-v2-4-0_side_navigation_padding_compact);--_ui5-v2-4-0_side_navigation_item_bottom_margin: var(--_ui5-v2-4-0_side_navigation_item_bottom_margin_compact);--_ui5-v2-4-0_side_navigation_item_height: 2rem;--_ui5-v2-4-0_side_navigation_item_collapsed_icon_padding: 0;--_ui5-v2-4-0_side_navigation_item_collapsed_hover_focus_padding_right: .5rem}\n"
					};
				(0, I.Rh)("@ui5/webcomponents-theming", "sap_horizon", (async () => q.A)), (0, I.Rh)("@ui5/webcomponents-fiori", "sap_horizon", (async () => G));
				var W = function(e, t, r, o) {
					var i, a = arguments.length,
						n = a < 3 ? t : null === o ? o = Object.getOwnPropertyDescriptor(t, r) : o;
					if ("object" == typeof Reflect && "function" == typeof Reflect.decorate) n = Reflect.decorate(e, t, r, o);
					else
						for (var _ = e.length - 1; _ >= 0; _--)(i = e[_]) && (n = (a < 3 ? i(n) : a > 3 ? i(t, r, n) : i(t, r)) || n);
					return a > 3 && n && Object.defineProperty(t, r, n), n
				};
				let J = class extends o.A {
					constructor() {
						super(), this.nameClickable = !1, this.firstItemInTimeline = !1, this.isNextItemGroup = !1, this.forcedTabIndex = "-1", this.layout = "Vertical", this.hideBubble = !1, this.lastItem = !1, this.hidden = !1
					}
					onNamePress() {
						this.fireDecoratorEvent("name-click", {})
					}
					focusLink() {
						this.shadowRoot.querySelector("[ui5-link]")?.focus()
					}
					get classes() {
						return {
							indicator: {
								"ui5-tli-indicator": !0,
								"ui5-tli-indicator-short-line": "ShortLineWidth" === this.forcedLineWidth,
								"ui5-tli-indicator-large-line": "LargeLineWidth" === this.forcedLineWidth
							},
							bubbleArrowPosition: {
								"ui5-tli-bubble-arrow": !0,
								"ui5-tli-bubble-arrow--left": this.layout === U.Vertical,
								"ui5-tli-bubble-arrow--top": this.layout === U.Horizontal
							}
						}
					}
					get isGroupItem() {
						return !1
					}
				};
				W([(0, a.A)()], J.prototype, "icon", void 0), W([(0, a.A)()], J.prototype, "name", void 0), W([(0, a.A)({
					type: Boolean
				})], J.prototype, "nameClickable", void 0), W([(0, a.A)()], J.prototype, "titleText", void 0), W([(0, a.A)()], J.prototype, "subtitleText", void 0), W([(0, n.A)({
					type: HTMLElement,
					default: !0
				})], J.prototype, "content", void 0), W([(0, a.A)({
					type: Boolean
				})], J.prototype, "firstItemInTimeline", void 0), W([(0, a.A)({
					type: Boolean
				})], J.prototype, "isNextItemGroup", void 0), W([(0, a.A)({
					noAttribute: !0
				})], J.prototype, "forcedTabIndex", void 0), W([(0, a.A)()], J.prototype, "layout", void 0), W([(0, a.A)({
					noAttribute: !0
				})], J.prototype, "forcedLineWidth", void 0), W([(0, a.A)({
					type: Boolean
				})], J.prototype, "hideBubble", void 0), W([(0, a.A)({
					type: Boolean
				})], J.prototype, "lastItem", void 0), W([(0, a.A)({
					type: Boolean
				})], J.prototype, "hidden", void 0), W([(0, a.A)({
					type: Number
				})], J.prototype, "positionInGroup", void 0), J = W([(0, i.A)({
					tag: "ui5-timeline-item",
					renderer: s.Ay,
					styles: {
						packageName: "@ui5/webcomponents-fiori",
						fileName: "themes/TimelineItem.css.ts",
						content: ':host(:not([hidden])){display:block}.ui5-tli-root{display:flex}:host([layout="Vertical"]) .ui5-tli-indicator{position:relative;width:2rem}:host([layout="Horizontal"]) .ui5-tli-indicator{position:relative;display:flex;height:2rem;align-items:center}:host([layout="Vertical"]) .ui5-tli-indicator:before{content:"";display:inline-block;background-color:var(--sapContent_ForegroundBorderColor);width:.0625rem;position:absolute;inset-block-start:2rem;bottom:var(--_ui5-v2-4-0_timeline_tli_indicator_before_bottom);inset-inline-start:50%}:host(:not([icon])[layout="Vertical"]) .ui5-tli-indicator:before{inset-block-start:1.75rem}:host([position-in-group][layout="Vertical"]) .ui5-tli-indicator:before{bottom:-1.5rem}:host([position-in-group][layout="Vertical"]) .ui5-tli-indicator.ui5-tli-indicator-large-line:before{bottom:-1.75rem}:host(:first-child[layout="Vertical"]:not([first-item-in-timeline])[icon]) .ui5-tli-indicator:after{content:"";display:inline-block;background-color:var(--sapContent_ForegroundBorderColor);width:.0625rem;position:absolute;inset-block-start:var(--_ui5-v2-4-0_timeline_tli_indicator_after_top);bottom:var(--_ui5-v2-4-0_timeline_tli_indicator_before_bottom);inset-inline-start:50%;height:var(--_ui5-v2-4-0_timeline_tli_indicator_after_height)}:host(:not([position-in-group])[layout="Vertical"]) .ui5-tli-indicator.ui5-tli-indicator-large-line:before{bottom:var(--_ui5-v2-4-0_timeline_tli_indicator_before_without_icon_bottom)}:host([layout="Vertical"]):not([icon]) .ui5-tli-indicator:before{bottom:var(--_ui5-v2-4-0_timeline_tli_indicator_before_without_icon_bottom);inset-block-start:1.875rem}:host([layout="Horizontal"]:not([icon])) .ui5-tli-indicator:before{inset-block-start:50%;inset-inline-end:var(--_ui5-v2-4-0_timeline_tli_indicator_before_without_icon_right);inset-inline-start:1rem}:host([layout="Vertical"]):not([icon]) .ui5-tli-indicator.ui5-tli-indicator-short-line:before{bottom:var(--_ui5-v2-4-0_timeline_tli_indicator_before_bottom)}:host([layout="Horizontal"]:not([icon])) .ui5-tli-indicator.ui5-tli-indicator-short-line:before{inset-inline-end:var(--_ui5-v2-4-0_timeline_tli_indicator_before_right)}:host(:not([icon])) .ui5-tli-indicator:after{content:"";display:inline-block;box-sizing:border-box;border:.0625rem solid var(--sapContent_NonInteractiveIconColor);background-color:var(--sapContent_NonInteractiveIconColor);border-radius:50%;width:.375rem;height:.375rem;position:absolute;inset-block-start:.9375rem;inset-inline-start:51.75%;transform:translate(-50%)}:host([layout="Horizontal"]:not([icon])) .ui5-tli-indicator:after{inset-block-start:.84rem;inset-inline-start:.9625rem}:host(:last-child) .ui5-tli-indicator:before{display:none}.ui5-tli-icon-outer{display:flex;justify-content:center;align-items:center;margin-block-start:.25rem;height:1.625rem;width:2rem}:host([layout="Horizontal"]) .ui5-tli-icon-outer{margin-block-start:0rem;height:1.3125rem}.ui5-tli-icon{color:var(--sapContent_NonInteractiveIconColor);height:1.375rem;width:1.375rem}:host([layout="Horizontal"]) .ui5-tli-dummy-icon-container{height:1.375rem;width:1.375rem;display:inline-block;outline:none}.ui5-tli-bubble{background:var(--sapGroup_ContentBackground);border:.0625rem solid var(--_ui5-v2-4-0_TimelineItem_bubble_border_color);box-sizing:border-box;border-radius:var(--_ui5-v2-4-0_TimelineItem_bubble_border_radius);flex:1;position:relative;margin-left:.5rem;padding:var(--_ui5-v2-4-0_TimelineItem_bubble_content_padding)}:host([layout="Horizontal"]) .ui5-tli-bubble{margin-top:.5rem;margin-left:0}.ui5-tli-bubble:focus{outline:none}.ui5-tli-bubble:focus:after{content:"";border:var(--_ui5-v2-4-0_TimelineItem_bubble_border_width) var(--_ui5-v2-4-0_TimelineItem_bubble_border_style) var(--sapContent_FocusColor);border-radius:var(--_ui5-v2-4-0_TimelineItem_bubble_focus_border_radius);position:absolute;inset-block-start:var(--_ui5-v2-4-0_TimelineItem_bubble_border_top);inset-inline-end:var(--_ui5-v2-4-0_TimelineItem_bubble_border_right);bottom:var(--_ui5-v2-4-0_TimelineItem_bubble_border_bottom);inset-inline-start:var(--_ui5-v2-4-0_TimelineItem_bubble_border_left);pointer-events:none}:host([layout="Horizontal"]) .ui5-tli-bubble:focus:after{inset-block-start:var(--_ui5-v2-4-0_TimelineItem_horizontal_bubble_focus_top_offset);inset-inline-start:var(--_ui5-v2-4-0_TimelineItem_horizontal_bubble_focus_left_offset)}.ui5-tli-bubble-arrow{width:var(--_ui5-v2-4-0_TimelineItem_arrow_size);padding-bottom:var(--_ui5-v2-4-0_TimelineItem_arrow_size);position:absolute;pointer-events:none;top:0;left:0;overflow:hidden}.ui5-tli-bubble-arrow:before{content:"";background:var(--sapGroup_ContentBackground);border:.0625rem solid var(--_ui5-v2-4-0_TimelineItem_bubble_border_color);position:absolute;top:0;left:0;width:100%;height:100%;transform-origin:0 100%;transform:rotate(45deg)}:host([layout="Horizontal"]) .ui5-tli-bubble-arrow:before{transform:rotate(315deg)}.ui5-tli-bubble-arrow--left{left:calc(-1 * var(--_ui5-v2-4-0_TimelineItem_arrow_size))}.ui5-tli-bubble-arrow--top{inset-block-start:calc(-1 * var(--_ui5-v2-4-0_TimelineItem_arrow_size))}.ui5-tli-bubble-arrow--left:before{left:50%;width:50%;transform-origin:100% 100%}.ui5-tli-bubble-arrow--top:before{left:42%;width:75%;transform-origin:152% 104%}.ui5-tli-title,.ui5-tli-desc{color:var(--sapTextColor);font-family:var(--sapFontFamily);font-weight:400;font-size:var(--sapFontSize)}.ui5-tli-title span{display:inline-block}.ui5-tli-subtitle{color:var(--sapContent_LabelColor);font-family:var(--sapFontFamily);font-weight:400;font-size:var(--sapFontSmallSize);padding-block-start:var(--_ui5-v2-4-0_TimelineItem_bubble_content_subtitle_padding_top)}.ui5-tli-desc{padding-block-start:var(--_ui5-v2-4-0_TimelineItem_bubble_content_description_padding_top)}:dir(rtl) .ui5-tli-bubble-arrow--left{right:calc(-1 * var(--_ui5-v2-4-0_TimelineItem_arrow_size));left:auto;transform:scaleX(-1)}:dir(rtl) .ui5-tli-bubble-arrow--top{right:0;left:auto;transform:scaleX(-1)}:dir(rtl) .ui5-tli-bubble{margin-left:auto;margin-right:.5rem}:host([layout="Horizontal"]:dir(rtl)) .ui5-tli-bubble{margin-right:0}:dir(rtl) .ui5-tli-bubble:focus:after{left:var(--_ui5-v2-4-0_TimelineItem_bubble_rtl_left_offset);right:var(--_ui5-v2-4-0_TimelineItem_bubble_rtl_right_offset)}:host([layout="Horizontal"]:dir(rtl)) .ui5-tli-bubble:focus:after{right:0}:host([layout="Horizontal"]:not([icon]):dir(rtl)) .ui5-tli-indicator:after{right:.625rem}:host([layout="Horizontal"]:not([icon]):dir(rtl)) .ui5-tli-indicator:before{right:1.9375rem;left:var(--_ui5-v2-4-0_timeline_tli_indicator_before_right)}:host([layout="Horizontal"]:dir(rtl)) .ui5-tli-indicator:before{left:var(--_ui5-v2-4-0_timeline_tli_indicator_before_right);right:2.125rem}:host{align-content:end}:host([hide-bubble]){display:none}.ui5-tli-group-item-btn-arrow{position:absolute;width:.5rem;height:.5rem;transform:rotate(45deg);border:.0625rem solid var(--sapButton_BorderColor);background-color:var(--sapButton_Background);inset-inline-end:4.25rem;inset-block-start:.8125rem;border-inline-end-color:transparent;border-block-start-color:transparent}.ui5-tli-root:hover .ui5-tli-group-item-btn-arrow{background-color:var(--sapButton_Hover_Background)}:host([layout="Horizontal"]) .ui5-tli-root{flex-direction:column}:host([layout="Horizontal"][is-next-item-group]:last-child:not([last-item])) .ui5-tli-indicator:before{height:.0625rem;inset-block-start:50%;inset-inline-start:1.75rem}:host([position-in-group][layout="Horizontal"][is-next-item-group]:last-child:not([last-item])) .ui5-tli-indicator:before{inset-inline-start:1.625rem;width:calc(100% + .5rem)}:host([layout="Vertical"]:last-child:not([last-item])) .ui5-tli-indicator:before{content:"";display:inline-block;background-color:var(--sapContent_ForegroundBorderColor);inset-block-start:2rem;position:absolute;height:var(--_ui5-v2-4-0_timeline_tli_indicator_before_height)}:host(:not([icon])[layout="Vertical"]:last-child:not([last-item])) .ui5-tli-indicator:before{inset-block-start:1.75rem}:host([layout="Horizontal"]){height:auto;min-width:3rem;margin-inline-end:.25rem}:host([icon][layout="Horizontal"]:not([last-item])) .ui5-tli-indicator:after,:host(:not([icon])[layout="Horizontal"]:not([last-item])) .ui5-tli-indicator:before{content:"";display:inline-block;background-color:var(--sapContent_ForegroundBorderColor);height:.0625rem;inset-block-start:1rem;position:absolute;width:var(--_ui5-v2-4-0_timeline_tli_horizontal_indicator_after_width);inset-inline-start:1.5rem}:host([icon][layout="Horizontal"]:not([last-item])) .ui5-tli-indicator:after{inset-inline-start:var(--_ui5-v2-4-0_timeline_tli_horizontal_indicator_after_left)}:host([icon][layout="Horizontal"]:not([last-item]):not([is-next-item-group])) .ui5-tli-indicator:after{width:calc(var(--_ui5-v2-4-0_timeline_tli_icon_horizontal_indicator_after_width) + 1.25rem)}:host(:not([icon])[layout="Horizontal"]:not([last-item])[is-next-item-group]) .ui5-tli-indicator:before{width:var(--_ui5-v2-4-0_timeline_tli_horizontal_without_icon_indicator_before_width)}:host([is-next-item-group][icon][layout="Horizontal"]:not([last-item])) .ui5-tli-indicator.ui5-tli-indicator-large-line:after{width:var(--_ui5-v2-4-0_timeline_tli_horizontal_indicator_short_after_width)}:host([icon][layout="Horizontal"]:not([last-item])) .ui5-tli-indicator-short-line:after{content:"";display:inline-block;background-color:var(--sapContent_ForegroundBorderColor);height:.0625rem;inset-block-start:1rem;position:absolute;width:100%;inset-inline-start:1.9375rem}:host(:not([position-in-group])[icon][layout="Horizontal"]:not([last-item])) .ui5-tli-indicator-short-line:after{width:var(--_ui5-v2-4-0_timeline_tli_horizontal_indicator_short_after_width)}:host([position-in-group][icon][layout="Horizontal"]:not([last-item])) .ui5-tli-indicator-short-line:after{width:calc(100% - .5rem)}:host([icon][layout="Horizontal"]:not([last-item]):not([is-next-item-group])) .ui5-tli-indicator-large-line:after{width:var(--_ui5-v2-4-0_timeline_tli_icon_horizontal_indicator_after_width)}:host([position-in-group]:not([icon])[layout="Horizontal"]:not([last-item]):not([is-next-item-group])) .ui5-tli-indicator:before{width:calc(100% + .125rem)}:host([position-in-group]:not([icon])[layout="Horizontal"]:not([last-item]):not([is-next-item-group])) .ui5-tli-indicator.ui5-tli-indicator-short-line:before{width:100%}:host([position-in-group][icon][layout="Horizontal"]:not([last-item]):not([is-next-item-group])) .ui5-tli-indicator-large-line:after{width:calc(100% - .25rem)}:host(:not([icon])[layout="Horizontal"]:not([last-item]):not([is-next-item-group])) .ui5-tli-indicator:before{width:var(--_ui5-v2-4-0_timeline_tli_horizontal_indicator_before_width);inset-inline-start:1.625rem}:host(:not([icon])[layout="Horizontal"]:not([last-item])) .ui5-tli-indicator.ui5-tli-indicator-short-line:before{width:var(--_ui5-v2-4-0_timeline_tli_without_icon_horizontal_indicator_before_width);inset-inline-start:1.5rem}\n'
					},
					template: function(e, t, r) {
						return s.qy`<div class="ui5-tli-root"><div class="${(0,s.Hk)(this.classes.indicator)}"><div class="ui5-tli-icon-outer">${this.icon?H.call(this,e,t,r):M.call(this,e,t,r)}</div></div>${this.hideBubble?void 0:N.call(this,e,t,r)}</div>`
					},
					dependencies: [y.A, F]
				}), (0, b.A)("name-click", {
					bubbles: !0
				})], J), J.define();
				const V = J;
				var X = r(1431),
					Y = r(1688),
					Z = r(5475),
					K = r(1542);
				let Q;
				const ee = () => (void 0 === Q && (Q = (0, K.$n)()), Q);
				var te;
				! function(e) {
					e.Default = "Default", e.Positive = "Positive", e.Negative = "Negative", e.Transparent = "Transparent", e.Emphasized = "Emphasized", e.Attention = "Attention"
				}(te || (te = {}));
				const re = te;
				var oe;
				! function(e) {
					e.Button = "Button", e.Submit = "Submit", e.Reset = "Reset"
				}(oe || (oe = {}));
				const ie = oe;

				function ae(e, t, r) {
					return r ? s.qy`<${(0,s.DL)("ui5-icon",t,r)} class="ui5-button-icon" name="${(0,s.JR)(this.icon)}" mode="${(0,s.JR)(this.iconMode)}" part="icon" ?show-tooltip=${this.showIconTooltip}></${(0,s.DL)("ui5-icon",t,r)}>` : s.qy`<ui5-icon class="ui5-button-icon" name="${(0,s.JR)(this.icon)}" mode="${(0,s.JR)(this.iconMode)}" part="icon" ?show-tooltip=${this.showIconTooltip}></ui5-icon>`
				}

				function ne(e, t, r) {
					return r ? s.qy`<${(0,s.DL)("ui5-icon",t,r)} class="ui5-button-end-icon" name="${(0,s.JR)(this.endIcon)}" mode="${(0,s.JR)(this.endIconMode)}" part="endIcon"></${(0,s.DL)("ui5-icon",t,r)}>` : s.qy`<ui5-icon class="ui5-button-end-icon" name="${(0,s.JR)(this.endIcon)}" mode="${(0,s.JR)(this.endIconMode)}" part="endIcon"></ui5-icon>`
				}

				function _e(e, t, r) {
					return s.qy`<span id="ui5-button-hiddenText-type" aria-hidden="true" class="ui5-hidden-text">${(0,s.JR)(this.buttonTypeText)}</span>`
				}
				var se = r(4281);
				(0, I.Rh)("@ui5/webcomponents-theming", "sap_horizon", (async () => q.A)), (0, I.Rh)("@ui5/webcomponents", "sap_horizon", (async () => L.A));
				var ce, le = function(e, t, r, o) {
					var i, a = arguments.length,
						n = a < 3 ? t : null === o ? o = Object.getOwnPropertyDescriptor(t, r) : o;
					if ("object" == typeof Reflect && "function" == typeof Reflect.decorate) n = Reflect.decorate(e, t, r, o);
					else
						for (var _ = e.length - 1; _ >= 0; _--)(i = e[_]) && (n = (a < 3 ? i(n) : a > 3 ? i(t, r, n) : i(t, r)) || n);
					return a > 3 && n && Object.defineProperty(t, r, n), n
				};
				let ue = !1,
					de = null,
					pe = ce = class extends o.A {
						constructor() {
							super(), this.design = "Default", this.disabled = !1, this.submits = !1, this.accessibilityAttributes = {}, this.type = "Button", this.accessibleRole = "Button", this.active = !1, this.iconOnly = !1, this.hasIcon = !1, this.hasEndIcon = !1, this.nonInteractive = !1, this._iconSettings = {}, this.forcedTabIndex = "0", this._isTouch = !1, this._cancelAction = !1, this._deactivate = () => {
								de && de._setActiveState(!1)
							}, ue || (document.addEventListener("mouseup", this._deactivate), ue = !0), this._ontouchstart = {
								handleEvent: () => {
									this.nonInteractive || this._setActiveState(!0)
								},
								passive: !0
							}
						}
						onEnterDOM() {
							(0, w.xl)() && this.setAttribute("desktop", "")
						}
						async onBeforeRendering() {
							this.hasIcon = !!this.icon, this.hasEndIcon = !!this.endIcon, this.iconOnly = this.isIconOnly, this.buttonTitle = this.tooltip || await this.getDefaultTooltip()
						}
						_onclick() {
							this.nonInteractive || (this._isSubmit && (0, Z.rM)(this), this._isReset && (0, Z.E2)(this), (0, w.nr)() && this.getDomRef()?.focus())
						}
						_onmousedown() {
							this.nonInteractive || (this._setActiveState(!0), de = this)
						}
						_ontouchend(e) {
							this.disabled && (e.preventDefault(), e.stopPropagation()), this.active && this._setActiveState(!1), de && de._setActiveState(!1)
						}
						_onkeydown(e) {
							this._cancelAction = (0, c.Tu)(e) || (0, c.KL)(e), (0, c.xC)(e) || (0, c.RI)(e) ? this._setActiveState(!0) : this._cancelAction && this._setActiveState(!1)
						}
						_onkeyup(e) {
							this._cancelAction && e.preventDefault(), ((0, c.xC)(e) || (0, c.RI)(e)) && this.active && this._setActiveState(!1)
						}
						_onfocusout() {
							this.nonInteractive || this.active && this._setActiveState(!1)
						}
						_setActiveState(e) {
							!this.fireDecoratorEvent("_active-state-change") || (this.active = e)
						}
						get _hasPopup() {
							return this.accessibilityAttributes.hasPopup
						}
						get hasButtonType() {
							return this.design !== re.Default && this.design !== re.Transparent
						}
						get iconMode() {
							return this.icon ? se.A.Decorative : ""
						}
						get endIconMode() {
							return this.endIcon ? se.A.Decorative : ""
						}
						get isIconOnly() {
							return !(0, Y.A)(this.text)
						}
						static typeTextMappings() {
							return {
								Positive: T.nFX,
								Negative: T.kQX,
								Emphasized: T.Jy$
							}
						}
						getDefaultTooltip() {
							if (ee()) return (0, X.Z5)(this.icon)
						}
						get buttonTypeText() {
							return ce.i18nBundle.getText(ce.typeTextMappings()[this.design])
						}
						get effectiveAccRole() {
							return this.accessibleRole.toLowerCase()
						}
						get tabIndexValue() {
							if (this.disabled) return;
							return this.getAttribute("tabindex") || (this.nonInteractive ? "-1" : this.forcedTabIndex)
						}
						get showIconTooltip() {
							return ee() && this.iconOnly && !this.tooltip
						}
						get ariaLabelText() {
							return (0, C.ax)(this)
						}
						get ariaDescribedbyText() {
							return this.hasButtonType ? "ui5-button-hiddenText-type" : void 0
						}
						get _isSubmit() {
							return this.type === ie.Submit || this.submits
						}
						get _isReset() {
							return this.type === ie.Reset
						}
					};
				le([(0, a.A)()], pe.prototype, "design", void 0), le([(0, a.A)({
					type: Boolean
				})], pe.prototype, "disabled", void 0), le([(0, a.A)()], pe.prototype, "icon", void 0), le([(0, a.A)()], pe.prototype, "endIcon", void 0), le([(0, a.A)({
					type: Boolean
				})], pe.prototype, "submits", void 0), le([(0, a.A)()], pe.prototype, "tooltip", void 0), le([(0, a.A)()], pe.prototype, "accessibleName", void 0), le([(0, a.A)()], pe.prototype, "accessibleNameRef", void 0), le([(0, a.A)({
					type: Object
				})], pe.prototype, "accessibilityAttributes", void 0), le([(0, a.A)()], pe.prototype, "type", void 0), le([(0, a.A)()], pe.prototype, "accessibleRole", void 0), le([(0, a.A)({
					type: Boolean
				})], pe.prototype, "active", void 0), le([(0, a.A)({
					type: Boolean
				})], pe.prototype, "iconOnly", void 0), le([(0, a.A)({
					type: Boolean
				})], pe.prototype, "hasIcon", void 0), le([(0, a.A)({
					type: Boolean
				})], pe.prototype, "hasEndIcon", void 0), le([(0, a.A)({
					type: Boolean
				})], pe.prototype, "nonInteractive", void 0), le([(0, a.A)({
					noAttribute: !0
				})], pe.prototype, "buttonTitle", void 0), le([(0, a.A)({
					type: Object
				})], pe.prototype, "_iconSettings", void 0), le([(0, a.A)({
					noAttribute: !0
				})], pe.prototype, "forcedTabIndex", void 0), le([(0, a.A)({
					type: Boolean
				})], pe.prototype, "_isTouch", void 0), le([(0, a.A)({
					type: Boolean,
					noAttribute: !0
				})], pe.prototype, "_cancelAction", void 0), le([(0, n.A)({
					type: Node,
					default: !0
				})], pe.prototype, "text", void 0), le([(0, _.A)("@ui5/webcomponents")], pe, "i18nBundle", void 0), pe = ce = le([(0, i.A)({
					tag: "ui5-button",
					formAssociated: !0,
					languageAware: !0,
					renderer: s.Ay,
					template: function(e, t, r) {
						return s.qy`<button type="button" class="ui5-button-root" ?disabled="${this.disabled}" data-sap-focus-ref  @focusout=${this._onfocusout} @click=${this._onclick} @mousedown=${this._onmousedown} @keydown=${this._onkeydown} @keyup=${this._onkeyup} @touchstart="${this._ontouchstart}" @touchend="${this._ontouchend}" tabindex=${(0,s.JR)(this.tabIndexValue)} aria-expanded="${(0,s.JR)(this.accessibilityAttributes.expanded)}" aria-controls="${(0,s.JR)(this.accessibilityAttributes.controls)}" aria-haspopup="${(0,s.JR)(this._hasPopup)}" aria-label="${(0,s.JR)(this.ariaLabelText)}" aria-describedby="${(0,s.JR)(this.ariaDescribedbyText)}" title="${(0,s.JR)(this.buttonTitle)}" part="button" role="${(0,s.JR)(this.effectiveAccRole)}">${this.icon?ae.call(this,e,t,r):void 0}<span id="${(0,s.JR)(this._id)}-content" class="ui5-button-text"><bdi><slot></slot></bdi></span>${this.endIcon?ne.call(this,e,t,r):void 0}${this.hasButtonType?_e.call(this,e,t,r):void 0}</button> `
					},
					styles: {
						packageName: "@ui5/webcomponents",
						fileName: "themes/Button.css.ts",
						content: ':host{vertical-align:middle}.ui5-hidden-text{position:absolute;clip:rect(1px,1px,1px,1px);user-select:none;left:-1000px;top:-1000px;pointer-events:none;font-size:0}:host(:not([hidden])){display:inline-block}:host{min-width:var(--_ui5-v2-4-0_button_base_min_width);height:var(--_ui5-v2-4-0_button_base_height);line-height:normal;font-family:var(--_ui5-v2-4-0_button_fontFamily);font-size:var(--sapFontSize);text-shadow:var(--_ui5-v2-4-0_button_text_shadow);border-radius:var(--_ui5-v2-4-0_button_border_radius);cursor:pointer;background-color:var(--sapButton_Background);border:var(--sapButton_BorderWidth) solid var(--sapButton_BorderColor);color:var(--sapButton_TextColor);box-sizing:border-box;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}.ui5-button-root{min-width:inherit;cursor:inherit;height:100%;width:100%;box-sizing:border-box;display:flex;justify-content:center;align-items:center;outline:none;padding:0 var(--_ui5-v2-4-0_button_base_padding);position:relative;background:transparent;border:none;color:inherit;text-shadow:inherit;font:inherit;white-space:inherit;overflow:inherit;text-overflow:inherit;letter-spacing:inherit;word-spacing:inherit;line-height:inherit;-webkit-user-select:none;-moz-user-select:none;user-select:none}:host(:not([active]):not([non-interactive]):not([_is-touch]):not([disabled]):hover),:host(:not([hidden]):not([disabled]).ui5_hovered){background:var(--sapButton_Hover_Background);border:1px solid var(--sapButton_Hover_BorderColor);color:var(--sapButton_Hover_TextColor)}.ui5-button-icon,.ui5-button-end-icon{color:inherit;flex-shrink:0}.ui5-button-end-icon{margin-inline-start:var(--_ui5-v2-4-0_button_base_icon_margin)}:host([icon-only]:not([has-end-icon])) .ui5-button-root{min-width:auto;padding:0}:host([icon-only]) .ui5-button-text{display:none}.ui5-button-text{outline:none;position:relative;white-space:inherit;overflow:inherit;text-overflow:inherit}:host([has-icon]:not(:empty)) .ui5-button-text{margin-inline-start:var(--_ui5-v2-4-0_button_base_icon_margin)}:host([has-end-icon]:not([has-icon]):empty) .ui5-button-end-icon{margin-inline-start:0}:host([disabled]){opacity:var(--sapContent_DisabledOpacity);pointer-events:unset;cursor:default}:host([has-icon]:not([icon-only]):not([has-end-icon])) .ui5-button-text{min-width:calc(var(--_ui5-v2-4-0_button_base_min_width) - var(--_ui5-v2-4-0_button_base_icon_margin) - 1rem)}:host([disabled]:active){pointer-events:none}:host([desktop]:not([active])) .ui5-button-root:focus-within:after,:host(:not([active])) .ui5-button-root:focus-visible:after,:host([desktop][active][design="Emphasized"]) .ui5-button-root:focus-within:after,:host([active][design="Emphasized"]) .ui5-button-root:focus-visible:after,:host([desktop][active]) .ui5-button-root:focus-within:before,:host([active]) .ui5-button-root:focus-visible:before{content:"";position:absolute;box-sizing:border-box;inset:.0625rem;border:var(--_ui5-v2-4-0_button_focused_border);border-radius:var(--_ui5-v2-4-0_button_focused_border_radius)}:host([desktop][active]) .ui5-button-root:focus-within:before,:host([active]) .ui5-button-root:focus-visible:before{border-color:var(--_ui5-v2-4-0_button_pressed_focused_border_color)}:host([design="Emphasized"][desktop]) .ui5-button-root:focus-within:after,:host([design="Emphasized"]) .ui5-button-root:focus-visible:after{border-color:var(--_ui5-v2-4-0_button_emphasized_focused_border_color)}:host([design="Emphasized"][desktop]) .ui5-button-root:focus-within:before,:host([design="Emphasized"]) .ui5-button-root:focus-visible:before{content:"";position:absolute;box-sizing:border-box;inset:.0625rem;border:var(--_ui5-v2-4-0_button_emphasized_focused_border_before);border-radius:var(--_ui5-v2-4-0_button_focused_border_radius)}.ui5-button-root::-moz-focus-inner{border:0}bdi{display:block;white-space:inherit;overflow:inherit;text-overflow:inherit}:host([ui5-button][active]:not([disabled]):not([non-interactive])){background-image:none;background-color:var(--sapButton_Active_Background);border-color:var(--sapButton_Active_BorderColor);color:var(--sapButton_Active_TextColor)}:host([design="Positive"]){background-color:var(--sapButton_Accept_Background);border-color:var(--sapButton_Accept_BorderColor);color:var(--sapButton_Accept_TextColor)}:host([design="Positive"]:not([active]):not([non-interactive]):not([_is-touch]):not([disabled]):hover),:host([design="Positive"]:not([active]):not([non-interactive]):not([_is-touch]):not([disabled]).ui5_hovered){background-color:var(--sapButton_Accept_Hover_Background);border-color:var(--sapButton_Accept_Hover_BorderColor);color:var(--sapButton_Accept_Hover_TextColor)}:host([ui5-button][design="Positive"][active]:not([non-interactive])){background-color:var(--sapButton_Accept_Active_Background);border-color:var(--sapButton_Accept_Active_BorderColor);color:var(--sapButton_Accept_Active_TextColor)}:host([design="Negative"]){background-color:var(--sapButton_Reject_Background);border-color:var(--sapButton_Reject_BorderColor);color:var(--sapButton_Reject_TextColor)}:host([design="Negative"]:not([active]):not([non-interactive]):not([_is-touch]):not([disabled]):hover),:host([design="Negative"]:not([active]):not([non-interactive]):not([_is-touch]):not([disabled]).ui5_hovered){background-color:var(--sapButton_Reject_Hover_Background);border-color:var(--sapButton_Reject_Hover_BorderColor);color:var(--sapButton_Reject_Hover_TextColor)}:host([ui5-button][design="Negative"][active]:not([non-interactive])){background-color:var(--sapButton_Reject_Active_Background);border-color:var(--sapButton_Reject_Active_BorderColor);color:var(--sapButton_Reject_Active_TextColor)}:host([design="Attention"]){background-color:var(--sapButton_Attention_Background);border-color:var(--sapButton_Attention_BorderColor);color:var(--sapButton_Attention_TextColor)}:host([design="Attention"]:not([active]):not([non-interactive]):not([_is-touch]):not([disabled]):hover),:host([design="Attention"]:not([active]):not([non-interactive]):not([_is-touch]):not([disabled]).ui5_hovered){background-color:var(--sapButton_Attention_Hover_Background);border-color:var(--sapButton_Attention_Hover_BorderColor);color:var(--sapButton_Attention_Hover_TextColor)}:host([ui5-button][design="Attention"][active]:not([non-interactive])){background-color:var(--sapButton_Attention_Active_Background);border-color:var(--sapButton_Attention_Active_BorderColor);color:var(--sapButton_Attention_Active_TextColor)}:host([design="Emphasized"]){background-color:var(--sapButton_Emphasized_Background);border-color:var(--sapButton_Emphasized_BorderColor);border-width:var(--_ui5-v2-4-0_button_emphasized_border_width);color:var(--sapButton_Emphasized_TextColor);font-family:var(--sapFontBoldFamily )}:host([design="Emphasized"]:not([active]):not([non-interactive]):not([_is-touch]):not([disabled]):hover),:host([design="Emphasized"]:not([active]):not([non-interactive]):not([_is-touch]):not([disabled]).ui5_hovered){background-color:var(--sapButton_Emphasized_Hover_Background);border-color:var(--sapButton_Emphasized_Hover_BorderColor);border-width:var(--_ui5-v2-4-0_button_emphasized_border_width);color:var(--sapButton_Emphasized_Hover_TextColor)}:host([ui5-button][design="Empasized"][active]:not([non-interactive])){background-color:var(--sapButton_Emphasized_Active_Background);border-color:var(--sapButton_Emphasized_Active_BorderColor);color:var(--sapButton_Emphasized_Active_TextColor)}:host([design="Emphasized"][desktop]) .ui5-button-root:focus-within:after,:host([design="Emphasized"]) .ui5-button-root:focus-visible:after{border-color:var(--_ui5-v2-4-0_button_emphasized_focused_border_color);outline:none}:host([design="Emphasized"][desktop][active]:not([non-interactive])) .ui5-button-root:focus-within:after,:host([design="Emphasized"][active]:not([non-interactive])) .ui5-button-root:focus-visible:after{border-color:var(--_ui5-v2-4-0_button_emphasized_focused_active_border_color)}:host([design="Transparent"]){background-color:var(--sapButton_Lite_Background);color:var(--sapButton_Lite_TextColor);border-color:var(--sapButton_Lite_BorderColor)}:host([design="Transparent"]:not([active]):not([non-interactive]):not([_is-touch]):not([disabled]):hover),:host([design="Transparent"]:not([active]):not([non-interactive]):not([_is-touch]):not([disabled]).ui5_hovered){background-color:var(--sapButton_Lite_Hover_Background);border-color:var(--sapButton_Lite_Hover_BorderColor);color:var(--sapButton_Lite_Hover_TextColor)}:host([ui5-button][design="Transparent"][active]:not([non-interactive])){background-color:var(--sapButton_Lite_Active_Background);border-color:var(--sapButton_Lite_Active_BorderColor);color:var(--sapButton_Active_TextColor)}:host([ui5-segmented-button-item][active][desktop]) .ui5-button-root:focus-within:after,:host([ui5-segmented-button-item][active]) .ui5-button-root:focus-visible:after,:host([pressed][desktop]) .ui5-button-root:focus-within:after,:host([pressed]) .ui5-button-root:focus-visible:after{border-color:var(--_ui5-v2-4-0_button_pressed_focused_border_color);outline:none}:host([ui5-segmented-button-item][desktop]:not(:last-child)) .ui5-button-root:focus-within:after,:host([ui5-segmented-button-item]:not(:last-child)) .ui5-button-root:focus-visible:after{border-top-right-radius:var(--_ui5-v2-4-0_button_focused_inner_border_radius);border-bottom-right-radius:var(--_ui5-v2-4-0_button_focused_inner_border_radius)}:host([ui5-segmented-button-item][desktop]:not(:first-child)) .ui5-button-root:focus-within:after,:host([ui5-segmented-button-item]:not(:first-child)) .ui5-button-root:focus-visible:after{border-top-left-radius:var(--_ui5-v2-4-0_button_focused_inner_border_radius);border-bottom-left-radius:var(--_ui5-v2-4-0_button_focused_inner_border_radius)}\n'
					},
					dependencies: [y.A],
					shadowRootOptions: {
						delegatesFocus: !0
					}
				}), (0, b.A)("click", {
					bubbles: !0
				}), (0, b.A)("_active-state-change", {
					bubbles: !0,
					cancelable: !0
				})], pe), pe.define();
				const he = pe;

				function ve(e, t, r) {
					return r ? s.qy`<${(0,s.DL)("ui5-icon",t,r)} class="ui5-button-icon" name="${(0,s.JR)(this.icon)}" mode="${(0,s.JR)(this.iconMode)}" part="icon" ?show-tooltip=${this.showIconTooltip}></${(0,s.DL)("ui5-icon",t,r)}>` : s.qy`<ui5-icon class="ui5-button-icon" name="${(0,s.JR)(this.icon)}" mode="${(0,s.JR)(this.iconMode)}" part="icon" ?show-tooltip=${this.showIconTooltip}></ui5-icon>`
				}

				function fe(e, t, r) {
					return r ? s.qy`<${(0,s.DL)("ui5-icon",t,r)} class="ui5-button-end-icon" name="${(0,s.JR)(this.endIcon)}" mode="${(0,s.JR)(this.endIconMode)}" part="endIcon"></${(0,s.DL)("ui5-icon",t,r)}>` : s.qy`<ui5-icon class="ui5-button-end-icon" name="${(0,s.JR)(this.endIcon)}" mode="${(0,s.JR)(this.endIconMode)}" part="endIcon"></ui5-icon>`
				}

				function me(e, t, r) {
					return s.qy`<span id="ui5-button-hiddenText-type" aria-hidden="true" class="ui5-hidden-text">${(0,s.JR)(this.buttonTypeText)}</span>`
				}(0, I.Rh)("@ui5/webcomponents-theming", "sap_horizon", (async () => q.A)), (0, I.Rh)("@ui5/webcomponents", "sap_horizon", (async () => L.A));
				var ge = function(e, t, r, o) {
					var i, a = arguments.length,
						n = a < 3 ? t : null === o ? o = Object.getOwnPropertyDescriptor(t, r) : o;
					if ("object" == typeof Reflect && "function" == typeof Reflect.decorate) n = Reflect.decorate(e, t, r, o);
					else
						for (var _ = e.length - 1; _ >= 0; _--)(i = e[_]) && (n = (a < 3 ? i(n) : a > 3 ? i(t, r, n) : i(t, r)) || n);
					return a > 3 && n && Object.defineProperty(t, r, n), n
				};
				let be = class extends he {
					constructor() {
						super(...arguments), this.pressed = !1
					}
					_onclick() {
						this.pressed = !this.pressed, (0, w.nr)() && this.getDomRef().focus()
					}
					_onkeyup(e) {
						(0, c.BF)(e) ? e.preventDefault(): super._onkeyup(e)
					}
				};
				ge([(0, a.A)({
					type: Boolean
				})], be.prototype, "pressed", void 0), be = ge([(0, i.A)({
					tag: "ui5-toggle-button",
					template: function(e, t, r) {
						return s.qy`<button type="button" class="ui5-button-root" ?disabled="${this.disabled}" data-sap-focus-ref  aria-pressed="${(0,s.JR)(this.pressed)}"  @focusout=${this._onfocusout} @click=${this._onclick} @mousedown=${this._onmousedown} @keydown=${this._onkeydown} @keyup=${this._onkeyup} @touchstart="${this._ontouchstart}" @touchend="${this._ontouchend}" tabindex=${(0,s.JR)(this.tabIndexValue)} aria-expanded="${(0,s.JR)(this.accessibilityAttributes.expanded)}" aria-controls="${(0,s.JR)(this.accessibilityAttributes.controls)}" aria-haspopup="${(0,s.JR)(this._hasPopup)}" aria-label="${(0,s.JR)(this.ariaLabelText)}" aria-describedby="${(0,s.JR)(this.ariaDescribedbyText)}" title="${(0,s.JR)(this.buttonTitle)}" part="button" role="${(0,s.JR)(this.effectiveAccRole)}">${this.icon?ve.call(this,e,t,r):void 0}<span id="${(0,s.JR)(this._id)}-content" class="ui5-button-text"><bdi><slot></slot></bdi></span>${this.endIcon?fe.call(this,e,t,r):void 0}${this.hasButtonType?me.call(this,e,t,r):void 0}</button> `
					},
					styles: [he.styles, {
						packageName: "@ui5/webcomponents",
						fileName: "themes/ToggleButton.css.ts",
						content: ':host(:not([hidden])){display:inline-block}:host([design="Emphasized"]:not([pressed])){text-shadow:var(--_ui5-v2-4-0_toggle_button_emphasized_text_shadow)}:host([pressed]),:host([design="Default"][pressed]),:host([design="Transparent"][pressed]),:host([design="Emphasized"][pressed]){background:var(--sapButton_Selected_Background);border-color:var(--sapButton_Selected_BorderColor);color:var(--sapButton_Selected_TextColor);text-shadow:none}:host([pressed]:hover),:host([pressed]:not([active]):not([non-interactive]):not([_is-touch]):hover),:host([design="Default"][pressed]:hover),:host([design="Default"][pressed]:not([active]):not([non-interactive]):not([_is-touch]):hover),:host([design="Transparent"][pressed]:hover),:host([design="Transparent"][pressed]:not([active]):not([non-interactive]):not([_is-touch]):hover),:host([design="Emphasized"][pressed]:hover),:host([design="Emphasized"][pressed]:not([active]):not([non-interactive]):not([_is-touch]):hover){background:var(--sapButton_Selected_Hover_Background);border-color:var(--sapButton_Selected_Hover_BorderColor);color:var(--sapButton_Selected_TextColor)}:host([active]:not([disabled])),:host([design="Default"][active]:not([disabled])),:host([design="Transparent"][active]:not([disabled])),:host([design="Emphasized"][active]:not([disabled])){background:var(--sapButton_Active_Background);border-color:var(--sapButton_Active_BorderColor);color:var(--sapButton_Selected_TextColor)}:host([pressed]:not([active]):not([non-interactive]):not([_is-touch])),:host([design="Default"][pressed]:not([active]):not([non-interactive]):not([_is-touch])),:host([design="Transparent"][pressed]:not([active]):not([non-interactive]):not([_is-touch])),:host([design="Emphasized"][pressed]:not([active]):not([non-interactive]):not([_is-touch])){background:var(--sapButton_Selected_Background);border-color:var(--sapButton_Selected_BorderColor);color:var(--sapButton_Selected_TextColor)}:host([design="Negative"][pressed]){background:var(--sapButton_Reject_Selected_Background);border-color:var(--sapButton_Reject_Selected_BorderColor);color:var(--sapButton_Reject_Selected_TextColor)}:host([design="Negative"][active]:not([disabled])){background:var(--sapButton_Reject_Active_Background);border-color:var(--sapButton_Reject_Active_BorderColor);color:var(--sapButton_Reject_Active_TextColor)}:host([design="Negative"][pressed][active]:hover),:host([design="Negative"][pressed]:not([active]):not([non-interactive]):not([_is-touch]):hover){background:var(--sapButton_Reject_Selected_Hover_Background);border-color:var(--sapButton_Reject_Selected_Hover_BorderColor);color:var(--sapButton_Reject_Selected_TextColor)}:host([design="Negative"][pressed]:not([active]):not([non-interactive]):not([_is-touch])){background:var(--sapButton_Reject_Selected_Background);border-color:var(--sapButton_Reject_Selected_BorderColor);color:var(--sapButton_Reject_Selected_TextColor)}:host([design="Positive"][pressed]){background:var(--sapButton_Accept_Selected_Background);border-color:var(--sapButton_Accept_Selected_BorderColor);color:var(--sapButton_Accept_Selected_TextColor)}:host([design="Positive"][active]:not([disabled])){background:var(--sapButton_Accept_Active_Background);border-color:var(--sapButton_Accept_Active_BorderColor);color:var(--sapButton_Accept_Selected_TextColor)}:host([design="Positive"][pressed][active]:hover),:host([design="Positive"][pressed]:not([active]):not([non-interactive]):not([_is-touch]):hover){background:var(--sapButton_Accept_Selected_Hover_Background);border-color:var(--sapButton_Accept_Selected_Hover_BorderColor);color:var(--sapButton_Accept_Selected_TextColor)}:host([design="Positive"][pressed]:not([active]):not([non-interactive]):not([_is-touch])){background:var(--sapButton_Accept_Selected_Background);border-color:var(--sapButton_Accept_Selected_BorderColor);color:var(--sapButton_Accept_Selected_TextColor)}:host([design="Attention"][pressed]){background:var(--sapButton_Attention_Selected_Background);border-color:var(--sapButton_Attention_Selected_BorderColor);color:var(--sapButton_Attention_Selected_TextColor)}:host([design="Attention"][active]:not([disabled])){background:var(--sapButton_Attention_Active_Background);border-color:var(--sapButton_Attention_Active_BorderColor);color:var(--sapButton_Attention_Active_TextColor)}:host([design="Attention"][pressed][active]:hover),:host([design="Attention"][pressed]:not([active]):not([non-interactive]):not([_is-touch]):hover){background:var(--sapButton_Attention_Selected_Hover_Background);border-color:var(--sapButton_Attention_Selected_Hover_BorderColor);color:var(--sapButton_Attention_Selected_TextColor)}:host([design="Attention"][pressed]:not([active]):not([non-interactive]):not([_is-touch])){background:var(--sapButton_Attention_Selected_Background);border-color:var(--sapButton_Attention_Selected_BorderColor);color:var(--sapButton_Attention_Selected_TextColor)}\n'
					}]
				})], be), be.define();
				const ye = be;

				function Ce(e, t, r, o, i) {
					return s.qy`<li class="ui5-timeline-group-list-item"><slot name="${(0,s.JR)(o._individualSlot)}"></slot></li>`
				}(0, I.Rh)("@ui5/webcomponents-theming", "sap_horizon", (async () => q.A)), (0, I.Rh)("@ui5/webcomponents-fiori", "sap_horizon", (async () => G));
				var we = function(e, t, r, o) {
					var i, a = arguments.length,
						n = a < 3 ? t : null === o ? o = Object.getOwnPropertyDescriptor(t, r) : o;
					if ("object" == typeof Reflect && "function" == typeof Reflect.decorate) n = Reflect.decorate(e, t, r, o);
					else
						for (var _ = e.length - 1; _ >= 0; _--)(i = e[_]) && (n = (a < 3 ? i(n) : a > 3 ? i(t, r, n) : i(t, r)) || n);
					return a > 3 && n && Object.defineProperty(t, r, n), n
				};
				let xe = class extends o.A {
					constructor() {
						super(...arguments), this.collapsed = !1, this.layout = "Vertical", this.lastItem = !1, this.isNextItemGroup = !1, this.hidden = !1, this.firstItemInTimeline = !1, this.forcedTabIndex = "-1"
					}
					onBeforeRendering() {
						this.items.length && this._setGroupItemProps()
					}
					_setGroupItemProps() {
						const e = this.items,
							t = e.length;
						t && this.firstItemInTimeline && (e[0].firstItemInTimeline = !0);
						for (let r = 0; r < t; r++) e[r].lastItem = !1, e[r].isNextItemGroup = !1;
						t > 0 && (e[t - 1].isNextItemGroup = this.isNextItemGroup, this.collapsed ? e[t - 1].lastItem = !1 : this.lastItem && (e[t - 1].lastItem = !0));
						for (let r = 0; r < t; r++) {
							const t = e[r];
							t.positionInGroup = r + 1, t.hidden = !!this.collapsed, t.layout = this.layout, e[r + 1] && e[r + 1].icon ? t.forcedLineWidth = "ShortLineWidth" : t.icon && e[r + 1] && !e[r + 1].icon && (t.forcedLineWidth = "LargeLineWidth")
						}
					}
					onGroupItemClick() {
						this.collapsed = !this.collapsed, this.fireDecoratorEvent("toggle")
					}
					get isGroupItem() {
						return !0
					}
					get _groupName() {
						return this.groupName
					}
					get _groupItemIcon() {
						return this.layout === U.Vertical ? this.collapsed ? "slim-arrow-left" : "slim-arrow-down" : this.collapsed ? "slim-arrow-up" : "slim-arrow-right"
					}
				};
				we([(0, a.A)()], xe.prototype, "groupName", void 0), we([(0, a.A)({
					type: Boolean
				})], xe.prototype, "collapsed", void 0), we([(0, n.A)({
					type: HTMLElement,
					individualSlots: !0,
					default: !0
				})], xe.prototype, "items", void 0), we([(0, a.A)()], xe.prototype, "layout", void 0), we([(0, a.A)({
					type: Boolean
				})], xe.prototype, "lastItem", void 0), we([(0, a.A)({
					type: Boolean
				})], xe.prototype, "isNextItemGroup", void 0), we([(0, a.A)({
					type: Boolean
				})], xe.prototype, "hidden", void 0), we([(0, a.A)({
					type: Boolean
				})], xe.prototype, "firstItemInTimeline", void 0), we([(0, a.A)({
					noAttribute: !0
				})], xe.prototype, "forcedTabIndex", void 0), xe = we([(0, i.A)({
					tag: "ui5-timeline-group-item",
					renderer: s.Ay,
					styles: {
						packageName: "@ui5/webcomponents-fiori",
						fileName: "themes/TimelineGroupItem.css.ts",
						content: ':host .ui5-timeline-group-list-item{list-style:none}:host([collapsed]) .ui5-timeline-group-list-item{display:none}.ui5-tl-group-item{width:100%;display:flex;flex-direction:column;margin:0;padding:0;gap:1.25rem}.ui5-tlgi-root{display:flex;flex-direction:column;gap:var(--_ui5-v2-4-0_timeline_tlgi_compact_root_gap, 1.25rem)}.ui5-tlgi-btn-root{display:flex;justify-content:space-between;gap:.125rem}.ui5-tlgi-icon-placeholder{display:flex;justify-content:center;position:relative;width:2rem;align-self:center}:host([collapsed]) .ui5-tlgi-icon-dot{width:.375rem;height:.375rem;box-sizing:border-box;border:.0625rem solid var(--sapContent_NonInteractiveIconColor);background-color:var(--sapBackgroundColor);border-radius:50%;margin-inline-start:.0625rem}.ui5-tlgi-line-placeholder{display:flex;justify-content:center;position:relative;align-self:center;flex-grow:1;margin-inline-end:.5rem;margin-inline-start:-.9375rem}:host([collapsed]) .ui5-tlgi-line{width:100%;height:.0625rem;border-block-start:.0625rem dashed var(--sapContent_NonInteractiveIconColor)}:host([layout="Vertical"]:not(:last-child)[collapsed]) .ui5-tlgi-icon-dot:before{content:"";display:inline-block;background-color:var(--sapContent_ForegroundBorderColor);width:.0625rem;position:absolute;inset-block-start:.375rem;inset-inline-start:50%;height:var(--_ui5-v2-4-0_timeline_tlgi_compact_icon_before_height, calc(100% + 4.5rem) )}:host([layout="Vertical"]:not(:last-child)[collapsed]:not([is-next-item-group])) .ui5-tlgi-icon-dot:before{height:var(--_ui5-v2-4-0_timeline_tlgi_compact_icon_before_height, calc(100% + 3.75rem) )}:host([layout="Vertical"]:not([first-item-in-timeline])[collapsed]) .ui5-tlgi-icon-dot:after{content:"";display:inline-block;background-color:var(--sapContent_ForegroundBorderColor);width:.0625rem;position:absolute;inset-block-start:-2rem;inset-inline-start:50%;height:2rem}:host([layout="Horizontal"]) .ui5-tl-group-item{height:100%}:host([layout="Horizontal"]) .ui5-tlgi-root{height:var(--_ui5-v2-4-0_timeline_tlgi_root_horizontal_height)}:host([layout="Horizontal"][collapsed]) .ui5-tlgi-btn-root,:host([layout="Horizontal"][collapsed]) .ui5-tlgi-root{flex-direction:column;gap:.8275rem;margin-block-start:.4375rem;margin-inline-end:var(--_ui5-v2-4-0_timeline_tlgi_horizontal_compact_root_margin_left, 0)}:host([layout="Horizontal"][collapsed]) .ui5-tlgi-root:last-child{margin-block-end:-.4375rem}:host([layout="Horizontal"][collapsed]):first-child .ui5-tlgi-btn-root{padding-inline-end:2rem}:host([layout="Horizontal"][collapsed]) .ui5-tlgi-icon-placeholder{align-self:unset;justify-content:unset}:host([layout="Horizontal"]) .ui5-tlgi-btn{margin-inline-start:-.75rem}:host([layout="Horizontal"][collapsed]) .ui5-tlgi-line{width:100%;height:calc(100% + 1rem);border-block-start:none;border-inline-start:.0625rem dashed var(--sapContent_NonInteractiveIconColor);margin-block-start:-.8125rem}:host([layout="Horizontal"]) .ui5-tlgi-line-placeholder{height:var(--_ui5-v2-4-0_timeline_tlgi_line_horizontal_height);align-self:unset;margin-inline-end:0;margin-inline-start:.25rem}:host([layout="Horizontal"]:not([collapsed])) .ui5-tlgi-line-placeholder{display:none}:host([layout="Horizontal"][collapsed]) .ui5-tlgi-root>:last-child{margin-block-end:-.8275rem}:host([layout="Horizontal"]) .ui5-tl-group-item{flex-direction:row}:host([layout="Horizontal"]) .ui5-tl-group-item:last-child{margin-inline-end:.25rem}:host([layout="Horizontal"]) .ui5-tlgi-root{flex-direction:column-reverse}:host([layout="Horizontal"]) .ui5-tlgi-btn-root{flex-direction:row-reverse}:host([layout="Horizontal"]:not(:last-child)[collapsed]) .ui5-tlgi-line-placeholder:before{content:"";display:inline-block;background-color:var(--sapContent_ForegroundBorderColor);height:.0625rem;inset-block-start:-1.0625rem;position:absolute;inset-inline-start:.125rem;width:var(--_ui5-v2-4-0_timeline_tlgi_horizontal_line_placeholder_before_width, calc(100% + 1.5625rem) )}:host(:not([is-next-item-group])[layout="Horizontal"]:not(:last-child)[collapsed]) .ui5-tlgi-line-placeholder:before{width:var(--_ui5-v2-4-0_timeline_tlgi_horizontal_line_placeholder_before_width, calc(100% + 1.9375rem) )}\n'
					},
					template: function(e, t, r) {
						return r ? s.qy`<div class="ui5-tlgi-root"><div class="ui5-tlgi-btn-root"><div class="ui5-tlgi-icon-placeholder"><div class="ui5-tlgi-icon-dot"></div></div><div class="ui5-tlgi-line-placeholder"><div class="ui5-tlgi-line"></div></div><${(0,s.DL)("ui5-toggle-button",t,r)} icon="${(0,s.JR)(this._groupItemIcon)}" @click="${this.onGroupItemClick}" class="ui5-tlgi-btn" .pressed="${(0,s.JR)(this.collapsed)}">${(0,s.JR)(this.groupName)}</${(0,s.DL)("ui5-toggle-button",t,r)}></div><ul class="ui5-tl-group-item">${(0,s.ux)(this.items,((e,t)=>e._id||t),((o,i)=>Ce.call(this,e,t,r,o,i)))}</ul></div>` : s.qy`<div class="ui5-tlgi-root"><div class="ui5-tlgi-btn-root"><div class="ui5-tlgi-icon-placeholder"><div class="ui5-tlgi-icon-dot"></div></div><div class="ui5-tlgi-line-placeholder"><div class="ui5-tlgi-line"></div></div><ui5-toggle-button icon="${(0,s.JR)(this._groupItemIcon)}" @click="${this.onGroupItemClick}" class="ui5-tlgi-btn" .pressed="${(0,s.JR)(this.collapsed)}">${(0,s.JR)(this.groupName)}</ui5-toggle-button></div><ul class="ui5-tl-group-item">${(0,s.ux)(this.items,((e,t)=>e._id||t),((o,i)=>Ce.call(this,e,t,r,o,i)))}</ul></div>`
					},
					dependencies: [V, ye]
				}), (0, b.A)("toggle", {
					bubbles: !0
				})], xe), xe.define();
				const ke = xe;
				(0, I.Rh)("@ui5/webcomponents-theming", "sap_horizon", (async () => q.A)), (0, I.Rh)("@ui5/webcomponents-fiori", "sap_horizon", (async () => G));
				var Se, Be = function(e, t, r, o) {
					var i, a = arguments.length,
						n = a < 3 ? t : null === o ? o = Object.getOwnPropertyDescriptor(t, r) : o;
					if ("object" == typeof Reflect && "function" == typeof Reflect.decorate) n = Reflect.decorate(e, t, r, o);
					else
						for (var _ = e.length - 1; _ >= 0; _--)(i = e[_]) && (n = (a < 3 ? i(n) : a > 3 ? i(t, r, n) : i(t, r)) || n);
					return a > 3 && n && Object.defineProperty(t, r, n), n
				};
				let Ae = Se = class extends o.A {
					constructor() {
						super(), this.layout = "Vertical", this._itemNavigation = new v(this, {
							getItemsCallback: () => this._navigatableItems
						})
					}
					get ariaLabel() {
						return this.accessibleName ? `${Se.i18nBundle.getText(f)} ${this.accessibleName}` : Se.i18nBundle.getText(f)
					}
					_onfocusin(e) {
						let t = e.target;
						t.isGroupItem && (t = t.shadowRoot.querySelector("[ui5-toggle-button]")), this._itemNavigation.setCurrentItem(t)
					}
					onBeforeRendering() {
						if (this._itemNavigation._navigationMode = this.layout === U.Horizontal ? u.Horizontal : u.Vertical, this.items.length) {
							for (let e = 0; e < this.items.length; e++) this.items[e].layout = this.layout, this.items[e + 1] && this.items[e + 1].icon ? this.items[e].forcedLineWidth = "ShortLineWidth" : this.items[e].icon && this.items[e + 1] && !this.items[e + 1].icon && (this.items[e].forcedLineWidth = "LargeLineWidth");
							this._setLastItem(), this._setIsNextItemGroup(), this.items[0].firstItemInTimeline = !0
						}
					}
					_setLastItem() {
						const e = this.items;
						for (let t = 0; t < e.length; t++) e[t].lastItem = !1;
						e.length > 0 && (e[e.length - 1].lastItem = !0)
					}
					_setIsNextItemGroup() {
						for (let e = 0; e < this.items.length; e++) this.items[e].isNextItemGroup = !1;
						for (let e = 0; e < this.items.length; e++) this.items[e + 1] && this.items[e + 1].isGroupItem && (this.items[e].isNextItemGroup = !0)
					}
					_onkeydown(e) {
						const t = e.target;
						t.nameClickable && !t.getFocusDomRef().matches(":has(:focus-within)") || ((0, c.zP)(e) ? this._handleNextOrPreviousItem(e, !0) : (0, c.bR)(e) && this._handleNextOrPreviousItem(e))
					}
					_handleNextOrPreviousItem(e, t) {
						const r = e.target;
						let o = r;
						r.isGroupItem && (o = r.shadowRoot.querySelector("[ui5-toggle-button]"));
						const i = t ? this._navigatableItems.indexOf(o) + 1 : this._navigatableItems.indexOf(o) - 1,
							a = this._navigatableItems[i];
						a && a && (e.preventDefault(), a.focus(), this._itemNavigation.setCurrentItem(a))
					}
					get _navigatableItems() {
						const e = [];
						return this.items.length ? (this.items.forEach((t => {
							if (!t.isGroupItem) return void e.push(t);
							const r = t.shadowRoot.querySelector("[ui5-toggle-button]");
							r && e.push(r), t.collapsed || t.items?.forEach((t => {
								e.push(t)
							}))
						})), e) : []
					}
				};
				Be([(0, a.A)()], Ae.prototype, "layout", void 0), Be([(0, a.A)()], Ae.prototype, "accessibleName", void 0), Be([(0, n.A)({
					type: HTMLElement,
					individualSlots: !0,
					default: !0
				})], Ae.prototype, "items", void 0), Be([(0, _.A)("@ui5/webcomponents-fiori")], Ae, "i18nBundle", void 0), Ae = Se = Be([(0, i.A)({
					tag: "ui5-timeline",
					languageAware: !0,
					renderer: s.Ay,
					styles: {
						packageName: "@ui5/webcomponents-fiori",
						fileName: "themes/Timeline.css.ts",
						content: ':host(:not([hidden])){display:block}.ui5-timeline-root{padding:var(--_ui5-v2-4-0_tl_padding);box-sizing:border-box;overflow:hidden}.ui5-timeline-list{list-style:none;margin:0;padding:0}:host([layout="Vertical"]) .ui5-timeline-list{display:flex;flex-direction:column}.ui5-timeline-list-item{margin-bottom:var(--_ui5-v2-4-0_tl_li_margin_bottom)}.ui5-timeline-list-item:last-child{margin-bottom:0}:host([layout="Horizontal"]) .ui5-timeline-list{white-space:nowrap;list-style:none;margin:0;padding:0;display:flex}:host([layout="Horizontal"]) .ui5-timeline-list-item{display:inline-block;margin-inline-start:var(--_ui5-v2-4-0_tl_li_margin_bottom)}:host([layout="Horizontal"]) .ui5-timeline-scroll-container{overflow:auto;width:calc(100% + var(--_ui5-v2-4-0_timeline_scroll_container_offset))}\n'
					},
					template: function(e, t, r) {
						return s.qy`<div class="ui5-timeline-root" @focusin=${this._onfocusin} @keydown=${this._onkeydown}><div class="ui5-timeline-scroll-container"><ul class="ui5-timeline-list" aria-live="polite" aria-label="${(0,s.JR)(this.ariaLabel)}">${(0,s.ux)(this.items,((e,t)=>e._id||t),((o,i)=>m.call(this,e,t,r,o,i)))}</ul></div></div>`
					},
					dependencies: [V, ke]
				})], Ae), Ae.define(), r(4825), (0, X.pU)("away", {
					pathData: "M256 0q53 0 100 20t81.5 55 54.5 81.5 20 99.5-20 99.5-54.5 81.5-81.5 55-100 20-99.5-20T75 437t-55-81.5T0 256t20-99.5T75 75t81.5-55T256 0zm128 288q18 0 30.5-7t12.5-25q0-17-12.5-24.5T384 224h-96v-96q0-18-7-30.5T256 85q-17 0-24.5 12.5T224 128v128q0 18 7.5 25t24.5 7h128z",
					ltr: !1,
					collection: "SAP-icons-v4",
					packageName: "@ui5/webcomponents-icons"
				}), (0, X.pU)("away", {
					pathData: "M256 64q46 0 87 17.5t71.5 48 48 71.5 17.5 87-17.5 87-48 71.5-71.5 48-87 17.5-87-17.5-71.5-48-48-71.5T32 288t17.5-87 48-71.5 71.5-48T256 64zm0 397q36 0 67.5-13.5t55-37 37-55T429 288t-13.5-67.5-37-55-55-37T256 115t-67.5 13.5-55 37-37 55T83 288t13.5 67.5 37 55 55 37T256 461zm78-192q11 0 18 7t7 18-7 18.5-18 7.5h-72q-11 0-18.5-7.5T236 294V186q0-11 7.5-18.5T262 160t18.5 7.5T288 186v83h46zM47 117q-8 11-21 11-11 0-18.5-7T0 106q0-10 12-27.5t28.5-35 34.5-30T105 1q10 0 16.5 7.5T128 26q0 6-4 12t-15 14Q95 62 78 78.5T47 117zM407 1q12 0 30 12.5t34.5 30 28.5 35 12 27.5q0 8-8 15t-18 7q-13 0-21-11-14-22-30.5-38.5T404 52q-12-8-16-14t-4-12q0-10 6.5-17.5T407 1z",
					ltr: !1,
					collection: "SAP-icons-v5",
					packageName: "@ui5/webcomponents-icons"
				}), (0, X.pU)("accelerated", {
					pathData: "M32 64q0-13 9-22.5T64 32h64V0h32v32h192V0h32v32h64q14 0 23 9.5t9 22.5v416q0 14-9 23t-23 9H64q-14 0-23-9t-9-23V64zm320 0v32h32V64h-32zm-224 0v32h32V64h-32zm-64 64v352h384V128H64zm160 112q0-7 5-11.5t11-4.5h128q16 0 16 16 0 6-4.5 11t-11.5 5H240q-6 0-11-5t-5-11zm-112 48h160q16 0 16 16 0 6-4.5 11t-11.5 5H112q-6 0-11-5t-5-11q0-7 5-11.5t11-4.5zm16 80q0-7 5-11.5t11-4.5h256q16 0 16 16 0 6-4.5 11t-11.5 5H144q-6 0-11-5t-5-11z",
					ltr: !1,
					collection: "SAP-icons-v4",
					packageName: "@ui5/webcomponents-icons"
				}), (0, X.pU)("accelerated", {
					pathData: "M390 64q38 0 64 26t26 64v268q0 38-26 64t-64 26H122q-38 0-64-26t-26-64V154q0-38 26-64t64-26h6V26q0-11 7.5-18.5T154 0t18 7.5 7 18.5v38h154V26q0-11 7-18.5T358 0t18.5 7.5T384 26v38h6zm39 90q0-17-11-28t-28-11h-6v19q0 11-7.5 18.5T358 160t-18-7.5-7-18.5v-19H179v19q0 11-7 18.5t-18 7.5-18.5-7.5T128 134v-19h-6q-17 0-28 11t-11 28v268q0 17 11 28t28 11h268q17 0 28-11t11-28V154zm-71 83q11 0 18.5 7t7.5 18-7.5 18.5T358 288H218q-11 0-18.5-7.5T192 262t7.5-18 18.5-7h140zm-96 83q11 0 18.5 7.5T288 346t-7.5 18-18.5 7H154q-11 0-18.5-7t-7.5-18 7.5-18.5T154 320h108z",
					ltr: !1,
					collection: "SAP-icons-v5",
					packageName: "@ui5/webcomponents-icons"
				}), (0, X.pU)("document-text", {
					pathData: "M416 0q14 0 23 9.5t9 22.5v448q0 14-9 23t-22 9H97q-14 0-23.5-9T64 480V128L192 0h224zm1 480l-1-448H224v96q0 14-9.5 23t-22.5 9H96v320h321zm-81-160q16 0 16 16 0 6-4.5 11t-11.5 5H176q-6 0-11-5t-5-11q0-7 5-11.5t11-4.5h160zm0 64q16 0 16 16 0 6-4.5 11t-11.5 5H176q-6 0-11-5t-5-11q0-7 5-11.5t11-4.5h160z",
					ltr: !1,
					collection: "SAP-icons-v4",
					packageName: "@ui5/webcomponents-icons"
				}), (0, X.pU)("document-text", {
					pathData: "M160 282q0-11 7.5-18.5T186 256h140q11 0 18.5 7.5T352 282t-7.5 18-18.5 7H186q-11 0-18.5-7t-7.5-18zm166 70q11 0 18.5 7.5T352 378t-7.5 18-18.5 7H186q-11 0-18.5-7t-7.5-18 7.5-18.5T186 352h140zM422 0q11 0 18.5 7.5T448 26v460q0 11-7.5 18.5T422 512H90q-11 0-18.5-7.5T64 486V192q0-10 6-17L213 9q6-9 19-9h190zm-25 51H244l-20 24v66q0 21-15 36t-36 15h-50l-8 9v260h282V51z",
					ltr: !1,
					collection: "SAP-icons-v5",
					packageName: "@ui5/webcomponents-icons"
				});
				var Te = r(1081),
					Ie = r(6639);

				function qe(e) {
					return qe = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function(e) {
						return typeof e
					} : function(e) {
						return e && "function" == typeof Symbol && e.constructor === Symbol && e !== Symbol.prototype ? "symbol" : typeof e
					}, qe(e)
				}

				function Le() {
					Le = function() {
						return t
					};
					var e, t = {},
						r = Object.prototype,
						o = r.hasOwnProperty,
						i = Object.defineProperty || function(e, t, r) {
							e[t] = r.value
						},
						a = "function" == typeof Symbol ? Symbol : {},
						n = a.iterator || "@@iterator",
						_ = a.asyncIterator || "@@asyncIterator",
						s = a.toStringTag || "@@toStringTag";

					function c(e, t, r) {
						return Object.defineProperty(e, t, {
							value: r,
							enumerable: !0,
							configurable: !0,
							writable: !0
						}), e[t]
					}
					try {
						c({}, "")
					} catch (e) {
						c = function(e, t, r) {
							return e[t] = r
						}
					}

					function l(e, t, r, o) {
						var a = t && t.prototype instanceof m ? t : m,
							n = Object.create(a.prototype),
							_ = new q(o || []);
						return i(n, "_invoke", {
							value: B(e, r, _)
						}), n
					}

					function u(e, t, r) {
						try {
							return {
								type: "normal",
								arg: e.call(t, r)
							}
						} catch (e) {
							return {
								type: "throw",
								arg: e
							}
						}
					}
					t.wrap = l;
					var d = "suspendedStart",
						p = "suspendedYield",
						h = "executing",
						v = "completed",
						f = {};

					function m() {}

					function g() {}

					function b() {}
					var y = {};
					c(y, n, (function() {
						return this
					}));
					var C = Object.getPrototypeOf,
						w = C && C(C(L([])));
					w && w !== r && o.call(w, n) && (y = w);
					var x = b.prototype = m.prototype = Object.create(y);

					function k(e) {
						["next", "throw", "return"].forEach((function(t) {
							c(e, t, (function(e) {
								return this._invoke(t, e)
							}))
						}))
					}

					function S(e, t) {
						function r(i, a, n, _) {
							var s = u(e[i], e, a);
							if ("throw" !== s.type) {
								var c = s.arg,
									l = c.value;
								return l && "object" == qe(l) && o.call(l, "__await") ? t.resolve(l.__await).then((function(e) {
									r("next", e, n, _)
								}), (function(e) {
									r("throw", e, n, _)
								})) : t.resolve(l).then((function(e) {
									c.value = e, n(c)
								}), (function(e) {
									return r("throw", e, n, _)
								}))
							}
							_(s.arg)
						}
						var a;
						i(this, "_invoke", {
							value: function(e, o) {
								function i() {
									return new t((function(t, i) {
										r(e, o, t, i)
									}))
								}
								return a = a ? a.then(i, i) : i()
							}
						})
					}

					function B(t, r, o) {
						var i = d;
						return function(a, n) {
							if (i === h) throw Error("Generator is already running");
							if (i === v) {
								if ("throw" === a) throw n;
								return {
									value: e,
									done: !0
								}
							}
							for (o.method = a, o.arg = n;;) {
								var _ = o.delegate;
								if (_) {
									var s = A(_, o);
									if (s) {
										if (s === f) continue;
										return s
									}
								}
								if ("next" === o.method) o.sent = o._sent = o.arg;
								else if ("throw" === o.method) {
									if (i === d) throw i = v, o.arg;
									o.dispatchException(o.arg)
								} else "return" === o.method && o.abrupt("return", o.arg);
								i = h;
								var c = u(t, r, o);
								if ("normal" === c.type) {
									if (i = o.done ? v : p, c.arg === f) continue;
									return {
										value: c.arg,
										done: o.done
									}
								}
								"throw" === c.type && (i = v, o.method = "throw", o.arg = c.arg)
							}
						}
					}

					function A(t, r) {
						var o = r.method,
							i = t.iterator[o];
						if (i === e) return r.delegate = null, "throw" === o && t.iterator.return && (r.method = "return", r.arg = e, A(t, r), "throw" === r.method) || "return" !== o && (r.method = "throw", r.arg = new TypeError("The iterator does not provide a '" + o + "' method")), f;
						var a = u(i, t.iterator, r.arg);
						if ("throw" === a.type) return r.method = "throw", r.arg = a.arg, r.delegate = null, f;
						var n = a.arg;
						return n ? n.done ? (r[t.resultName] = n.value, r.next = t.nextLoc, "return" !== r.method && (r.method = "next", r.arg = e), r.delegate = null, f) : n : (r.method = "throw", r.arg = new TypeError("iterator result is not an object"), r.delegate = null, f)
					}

					function T(e) {
						var t = {
							tryLoc: e[0]
						};
						1 in e && (t.catchLoc = e[1]), 2 in e && (t.finallyLoc = e[2], t.afterLoc = e[3]), this.tryEntries.push(t)
					}

					function I(e) {
						var t = e.completion || {};
						t.type = "normal", delete t.arg, e.completion = t
					}

					function q(e) {
						this.tryEntries = [{
							tryLoc: "root"
						}], e.forEach(T, this), this.reset(!0)
					}

					function L(t) {
						if (t || "" === t) {
							var r = t[n];
							if (r) return r.call(t);
							if ("function" == typeof t.next) return t;
							if (!isNaN(t.length)) {
								var i = -1,
									a = function r() {
										for (; ++i < t.length;)
											if (o.call(t, i)) return r.value = t[i], r.done = !1, r;
										return r.value = e, r.done = !0, r
									};
								return a.next = a
							}
						}
						throw new TypeError(qe(t) + " is not iterable")
					}
					return g.prototype = b, i(x, "constructor", {
						value: b,
						configurable: !0
					}), i(b, "constructor", {
						value: g,
						configurable: !0
					}), g.displayName = c(b, s, "GeneratorFunction"), t.isGeneratorFunction = function(e) {
						var t = "function" == typeof e && e.constructor;
						return !!t && (t === g || "GeneratorFunction" === (t.displayName || t.name))
					}, t.mark = function(e) {
						return Object.setPrototypeOf ? Object.setPrototypeOf(e, b) : (e.__proto__ = b, c(e, s, "GeneratorFunction")), e.prototype = Object.create(x), e
					}, t.awrap = function(e) {
						return {
							__await: e
						}
					}, k(S.prototype), c(S.prototype, _, (function() {
						return this
					})), t.AsyncIterator = S, t.async = function(e, r, o, i, a) {
						void 0 === a && (a = Promise);
						var n = new S(l(e, r, o, i), a);
						return t.isGeneratorFunction(r) ? n : n.next().then((function(e) {
							return e.done ? e.value : n.next()
						}))
					}, k(x), c(x, s, "Generator"), c(x, n, (function() {
						return this
					})), c(x, "toString", (function() {
						return "[object Generator]"
					})), t.keys = function(e) {
						var t = Object(e),
							r = [];
						for (var o in t) r.push(o);
						return r.reverse(),
							function e() {
								for (; r.length;) {
									var o = r.pop();
									if (o in t) return e.value = o, e.done = !1, e
								}
								return e.done = !0, e
							}
					}, t.values = L, q.prototype = {
						constructor: q,
						reset: function(t) {
							if (this.prev = 0, this.next = 0, this.sent = this._sent = e, this.done = !1, this.delegate = null, this.method = "next", this.arg = e, this.tryEntries.forEach(I), !t)
								for (var r in this) "t" === r.charAt(0) && o.call(this, r) && !isNaN(+r.slice(1)) && (this[r] = e)
						},
						stop: function() {
							this.done = !0;
							var e = this.tryEntries[0].completion;
							if ("throw" === e.type) throw e.arg;
							return this.rval
						},
						dispatchException: function(t) {
							if (this.done) throw t;
							var r = this;

							function i(o, i) {
								return _.type = "throw", _.arg = t, r.next = o, i && (r.method = "next", r.arg = e), !!i
							}
							for (var a = this.tryEntries.length - 1; a >= 0; --a) {
								var n = this.tryEntries[a],
									_ = n.completion;
								if ("root" === n.tryLoc) return i("end");
								if (n.tryLoc <= this.prev) {
									var s = o.call(n, "catchLoc"),
										c = o.call(n, "finallyLoc");
									if (s && c) {
										if (this.prev < n.catchLoc) return i(n.catchLoc, !0);
										if (this.prev < n.finallyLoc) return i(n.finallyLoc)
									} else if (s) {
										if (this.prev < n.catchLoc) return i(n.catchLoc, !0)
									} else {
										if (!c) throw Error("try statement without catch or finally");
										if (this.prev < n.finallyLoc) return i(n.finallyLoc)
									}
								}
							}
						},
						abrupt: function(e, t) {
							for (var r = this.tryEntries.length - 1; r >= 0; --r) {
								var i = this.tryEntries[r];
								if (i.tryLoc <= this.prev && o.call(i, "finallyLoc") && this.prev < i.finallyLoc) {
									var a = i;
									break
								}
							}
							a && ("break" === e || "continue" === e) && a.tryLoc <= t && t <= a.finallyLoc && (a = null);
							var n = a ? a.completion : {};
							return n.type = e, n.arg = t, a ? (this.method = "next", this.next = a.finallyLoc, f) : this.complete(n)
						},
						complete: function(e, t) {
							if ("throw" === e.type) throw e.arg;
							return "break" === e.type || "continue" === e.type ? this.next = e.arg : "return" === e.type ? (this.rval = this.arg = e.arg, this.method = "return", this.next = "end") : "normal" === e.type && t && (this.next = t), f
						},
						finish: function(e) {
							for (var t = this.tryEntries.length - 1; t >= 0; --t) {
								var r = this.tryEntries[t];
								if (r.finallyLoc === e) return this.complete(r.completion, r.afterLoc), I(r), f
							}
						},
						catch: function(e) {
							for (var t = this.tryEntries.length - 1; t >= 0; --t) {
								var r = this.tryEntries[t];
								if (r.tryLoc === e) {
									var o = r.completion;
									if ("throw" === o.type) {
										var i = o.arg;
										I(r)
									}
									return i
								}
							}
							throw Error("illegal catch attempt")
						},
						delegateYield: function(t, r, o) {
							return this.delegate = {
								iterator: L(t),
								resultName: r,
								nextLoc: o
							}, "next" === this.method && (this.arg = e), f
						}
					}, t
				}

				function Ee(e, t) {
					var r = "undefined" != typeof Symbol && e[Symbol.iterator] || e["@@iterator"];
					if (!r) {
						if (Array.isArray(e) || (r = ze(e)) || t && e && "number" == typeof e.length) {
							r && (e = r);
							var o = 0,
								i = function() {};
							return {
								s: i,
								n: function() {
									return o >= e.length ? {
										done: !0
									} : {
										done: !1,
										value: e[o++]
									}
								},
								e: function(e) {
									throw e
								},
								f: i
							}
						}
						throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.")
					}
					var a, n = !0,
						_ = !1;
					return {
						s: function() {
							r = r.call(e)
						},
						n: function() {
							var e = r.next();
							return n = e.done, e
						},
						e: function(e) {
							_ = !0, a = e
						},
						f: function() {
							try {
								n || null == r.return || r.return()
							} finally {
								if (_) throw a
							}
						}
					}
				}

				function Pe(e, t) {
					return function(e) {
						if (Array.isArray(e)) return e
					}(e) || function(e, t) {
						var r = null == e ? null : "undefined" != typeof Symbol && e[Symbol.iterator] || e["@@iterator"];
						if (null != r) {
							var o, i, a, n, _ = [],
								s = !0,
								c = !1;
							try {
								if (a = (r = r.call(e)).next, 0 === t) {
									if (Object(r) !== r) return;
									s = !1
								} else
									for (; !(s = (o = a.call(r)).done) && (_.push(o.value), _.length !== t); s = !0);
							} catch (e) {
								c = !0, i = e
							} finally {
								try {
									if (!s && null != r.return && (n = r.return(), Object(n) !== n)) return
								} finally {
									if (c) throw i
								}
							}
							return _
						}
					}(e, t) || ze(e, t) || function() {
						throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.")
					}()
				}

				function ze(e, t) {
					if (e) {
						if ("string" == typeof e) return Fe(e, t);
						var r = {}.toString.call(e).slice(8, -1);
						return "Object" === r && e.constructor && (r = e.constructor.name), "Map" === r || "Set" === r ? Array.from(e) : "Arguments" === r || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(r) ? Fe(e, t) : void 0
					}
				}

				function Fe(e, t) {
					(null == t || t > e.length) && (t = e.length);
					for (var r = 0, o = Array(t); r < t; r++) o[r] = e[r];
					return o
				}

				function He(e, t, r, o, i, a, n) {
					try {
						var _ = e[a](n),
							s = _.value
					} catch (e) {
						return void r(e)
					}
					_.done ? t(s) : Promise.resolve(s).then(o, i)
				}
				var Me = "成绩嗅探",
					Ne = "通过 API 显示学在浙大中已被登记但尚未公开的成绩。",
					$e = "学在浙大",
					Re = "/course/<course_id:int>/<panel>";

				function Oe(e) {
					return je.apply(this, arguments)
				}

				function je() {
					var e;
					return e = Le().mark((function e(t) {
						var o, i, a, n, _, s, c, l, u, d, p, h, v, f, m, g;
						return Le().wrap((function(e) {
							for (;;) switch (e.prev = e.next) {
								case 0:
									return o = t.params, i = t.logger, a = t.panelInitialize, r(1851), n = o.course_id, i.debug("当前课程:", n), _ = fetch("https://courses.zju.edu.cn/api/course/".concat(n, "/activity-reads-for-user")), s = fetch("https://courses.zju.edu.cn/api/course/".concat(n, "/homework-scores?fields=id,title")), c = fetch("https://courses.zju.edu.cn/api/courses/".concat(n, "/exams")), e.t0 = Promise, e.next = 10, Promise.all([_, s, c]);
								case 10:
									return e.t1 = e.sent.map((function(e) {
										return e.json()
									})), e.next = 13, e.t0.all.call(e.t0, e.t1);
								case 13:
									l = e.sent, u = Pe(l, 3), d = u[0], p = u[1], h = u[2], d && d.activity_reads || i.warn("活动阅读数据获取失败！"), p && p.homework_activities || i.warn("作业数据获取失败！"), h && h.exams || i.warn("考试数据获取失败！"), v = d.activity_reads, f = p.homework_activities, m = h.exams, i.debug("活动阅读数据:", v), i.debug("作业数据:", f), i.debug("考试数据:", m), g = new Map, f.forEach((function(e) {
										return g.set(e.id, e.title)
									})), m.forEach((function(e) {
										return g.set(e.id, e.title)
									})), v.forEach((function(e) {
										g.has(e.activity_id) ? e.title = g.get(e.activity_id) : e.title = "未知活动"
									})), i.info("合并后的活动数据:", v), (0, Te.yA)({
										node: a(),
										view: function() {
											if (0 === v.length) return (0, Ie.Y)("div", {
												class: "score-finder-no-activity",
												children: "没有检测到作业或考试。"
											});
											var e, t = [],
												r = 0,
												o = Ee(v);
											try {
												for (o.s(); !(e = o.n()).done;) {
													var a = e.value,
														_ = null,
														s = "",
														c = !0;
													"learning_activity" === a.activity_type ? (_ = "document-text", "https://courses.zju.edu.cn/course/".concat(n, "/learning-activity#/").concat(a.activity_id), "未知活动" === a.title ? (_ = "accelerated", 0 === Object.keys(a.data).length ? (c = !1, r += 1) : s = JSON.stringify(a.data)) : s = void 0 === a.data.score ? "未评分" : "得分：".concat(a.data.score)) : "exam_activity" === a.activity_type ? ("https://courses.zju.edu.cn/course/".concat(n, "/learning-activity#/exam/").concat(a.activity_id), _ = "away", s = "得分：".concat(a.data.score)) : (_ = "accelerated", s = "缺少数据"), i.debug("活动:", a), c && t.push((0, Ie.Y)("ui5-timeline-item", {
														"title-text": a.title,
														icon: _,
														timestamp: a.last_visited_at ? Date.parse(a.last_visited_at) : Date.now(),
														children: (0, Ie.Y)("div", {
															class: "score-finder-item-content",
															children: s
														})
													}))
												}
											} catch (e) {
												o.e(e)
											} finally {
												o.f()
											}
											return i.debug("活动组件:", t), (0, Ie.F)("div", {
												children: [(0, Ie.Y)("ui5-timeline", {
													children: t
												}), r > 0 ? (0, Ie.F)("div", {
													class: "score-finder-meaningless-counter",
													children: ["还有 ", r, " 条缺少数据的活动。"]
												}) : null]
											})
										}
									});
								case 33:
								case "end":
									return e.stop()
							}
						}), e)
					})), je = function() {
						var t = this,
							r = arguments;
						return new Promise((function(o, i) {
							var a = e.apply(t, r);

							function n(e) {
								He(a, o, i, n, _, "next", e)
							}

							function _(e) {
								He(a, o, i, n, _, "throw", e)
							}
							n(void 0)
						}))
					}, je.apply(this, arguments)
				}
			},
			4205: (e, t, r) => {
				"use strict";
				r.d(t, {
					jt: () => l,
					lW: () => c,
					mr: () => d,
					rG: () => h,
					wj: () => p
				});
				var o = r(3893);

				function i(e) {
					return i = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function(e) {
						return typeof e
					} : function(e) {
						return e && "function" == typeof Symbol && e.constructor === Symbol && e !== Symbol.prototype ? "symbol" : typeof e
					}, i(e)
				}

				function a() {
					a = function() {
						return t
					};
					var e, t = {},
						r = Object.prototype,
						o = r.hasOwnProperty,
						n = Object.defineProperty || function(e, t, r) {
							e[t] = r.value
						},
						_ = "function" == typeof Symbol ? Symbol : {},
						s = _.iterator || "@@iterator",
						c = _.asyncIterator || "@@asyncIterator",
						l = _.toStringTag || "@@toStringTag";

					function u(e, t, r) {
						return Object.defineProperty(e, t, {
							value: r,
							enumerable: !0,
							configurable: !0,
							writable: !0
						}), e[t]
					}
					try {
						u({}, "")
					} catch (e) {
						u = function(e, t, r) {
							return e[t] = r
						}
					}

					function d(e, t, r, o) {
						var i = t && t.prototype instanceof b ? t : b,
							a = Object.create(i.prototype),
							_ = new E(o || []);
						return n(a, "_invoke", {
							value: T(e, r, _)
						}), a
					}

					function p(e, t, r) {
						try {
							return {
								type: "normal",
								arg: e.call(t, r)
							}
						} catch (e) {
							return {
								type: "throw",
								arg: e
							}
						}
					}
					t.wrap = d;
					var h = "suspendedStart",
						v = "suspendedYield",
						f = "executing",
						m = "completed",
						g = {};

					function b() {}

					function y() {}

					function C() {}
					var w = {};
					u(w, s, (function() {
						return this
					}));
					var x = Object.getPrototypeOf,
						k = x && x(x(P([])));
					k && k !== r && o.call(k, s) && (w = k);
					var S = C.prototype = b.prototype = Object.create(w);

					function B(e) {
						["next", "throw", "return"].forEach((function(t) {
							u(e, t, (function(e) {
								return this._invoke(t, e)
							}))
						}))
					}

					function A(e, t) {
						function r(a, n, _, s) {
							var c = p(e[a], e, n);
							if ("throw" !== c.type) {
								var l = c.arg,
									u = l.value;
								return u && "object" == i(u) && o.call(u, "__await") ? t.resolve(u.__await).then((function(e) {
									r("next", e, _, s)
								}), (function(e) {
									r("throw", e, _, s)
								})) : t.resolve(u).then((function(e) {
									l.value = e, _(l)
								}), (function(e) {
									return r("throw", e, _, s)
								}))
							}
							s(c.arg)
						}
						var a;
						n(this, "_invoke", {
							value: function(e, o) {
								function i() {
									return new t((function(t, i) {
										r(e, o, t, i)
									}))
								}
								return a = a ? a.then(i, i) : i()
							}
						})
					}

					function T(t, r, o) {
						var i = h;
						return function(a, n) {
							if (i === f) throw Error("Generator is already running");
							if (i === m) {
								if ("throw" === a) throw n;
								return {
									value: e,
									done: !0
								}
							}
							for (o.method = a, o.arg = n;;) {
								var _ = o.delegate;
								if (_) {
									var s = I(_, o);
									if (s) {
										if (s === g) continue;
										return s
									}
								}
								if ("next" === o.method) o.sent = o._sent = o.arg;
								else if ("throw" === o.method) {
									if (i === h) throw i = m, o.arg;
									o.dispatchException(o.arg)
								} else "return" === o.method && o.abrupt("return", o.arg);
								i = f;
								var c = p(t, r, o);
								if ("normal" === c.type) {
									if (i = o.done ? m : v, c.arg === g) continue;
									return {
										value: c.arg,
										done: o.done
									}
								}
								"throw" === c.type && (i = m, o.method = "throw", o.arg = c.arg)
							}
						}
					}

					function I(t, r) {
						var o = r.method,
							i = t.iterator[o];
						if (i === e) return r.delegate = null, "throw" === o && t.iterator.return && (r.method = "return", r.arg = e, I(t, r), "throw" === r.method) || "return" !== o && (r.method = "throw", r.arg = new TypeError("The iterator does not provide a '" + o + "' method")), g;
						var a = p(i, t.iterator, r.arg);
						if ("throw" === a.type) return r.method = "throw", r.arg = a.arg, r.delegate = null, g;
						var n = a.arg;
						return n ? n.done ? (r[t.resultName] = n.value, r.next = t.nextLoc, "return" !== r.method && (r.method = "next", r.arg = e), r.delegate = null, g) : n : (r.method = "throw", r.arg = new TypeError("iterator result is not an object"), r.delegate = null, g)
					}

					function q(e) {
						var t = {
							tryLoc: e[0]
						};
						1 in e && (t.catchLoc = e[1]), 2 in e && (t.finallyLoc = e[2], t.afterLoc = e[3]), this.tryEntries.push(t)
					}

					function L(e) {
						var t = e.completion || {};
						t.type = "normal", delete t.arg, e.completion = t
					}

					function E(e) {
						this.tryEntries = [{
							tryLoc: "root"
						}], e.forEach(q, this), this.reset(!0)
					}

					function P(t) {
						if (t || "" === t) {
							var r = t[s];
							if (r) return r.call(t);
							if ("function" == typeof t.next) return t;
							if (!isNaN(t.length)) {
								var a = -1,
									n = function r() {
										for (; ++a < t.length;)
											if (o.call(t, a)) return r.value = t[a], r.done = !1, r;
										return r.value = e, r.done = !0, r
									};
								return n.next = n
							}
						}
						throw new TypeError(i(t) + " is not iterable")
					}
					return y.prototype = C, n(S, "constructor", {
						value: C,
						configurable: !0
					}), n(C, "constructor", {
						value: y,
						configurable: !0
					}), y.displayName = u(C, l, "GeneratorFunction"), t.isGeneratorFunction = function(e) {
						var t = "function" == typeof e && e.constructor;
						return !!t && (t === y || "GeneratorFunction" === (t.displayName || t.name))
					}, t.mark = function(e) {
						return Object.setPrototypeOf ? Object.setPrototypeOf(e, C) : (e.__proto__ = C, u(e, l, "GeneratorFunction")), e.prototype = Object.create(S), e
					}, t.awrap = function(e) {
						return {
							__await: e
						}
					}, B(A.prototype), u(A.prototype, c, (function() {
						return this
					})), t.AsyncIterator = A, t.async = function(e, r, o, i, a) {
						void 0 === a && (a = Promise);
						var n = new A(d(e, r, o, i), a);
						return t.isGeneratorFunction(r) ? n : n.next().then((function(e) {
							return e.done ? e.value : n.next()
						}))
					}, B(S), u(S, l, "Generator"), u(S, s, (function() {
						return this
					})), u(S, "toString", (function() {
						return "[object Generator]"
					})), t.keys = function(e) {
						var t = Object(e),
							r = [];
						for (var o in t) r.push(o);
						return r.reverse(),
							function e() {
								for (; r.length;) {
									var o = r.pop();
									if (o in t) return e.value = o, e.done = !1, e
								}
								return e.done = !0, e
							}
					}, t.values = P, E.prototype = {
						constructor: E,
						reset: function(t) {
							if (this.prev = 0, this.next = 0, this.sent = this._sent = e, this.done = !1, this.delegate = null, this.method = "next", this.arg = e, this.tryEntries.forEach(L), !t)
								for (var r in this) "t" === r.charAt(0) && o.call(this, r) && !isNaN(+r.slice(1)) && (this[r] = e)
						},
						stop: function() {
							this.done = !0;
							var e = this.tryEntries[0].completion;
							if ("throw" === e.type) throw e.arg;
							return this.rval
						},
						dispatchException: function(t) {
							if (this.done) throw t;
							var r = this;

							function i(o, i) {
								return _.type = "throw", _.arg = t, r.next = o, i && (r.method = "next", r.arg = e), !!i
							}
							for (var a = this.tryEntries.length - 1; a >= 0; --a) {
								var n = this.tryEntries[a],
									_ = n.completion;
								if ("root" === n.tryLoc) return i("end");
								if (n.tryLoc <= this.prev) {
									var s = o.call(n, "catchLoc"),
										c = o.call(n, "finallyLoc");
									if (s && c) {
										if (this.prev < n.catchLoc) return i(n.catchLoc, !0);
										if (this.prev < n.finallyLoc) return i(n.finallyLoc)
									} else if (s) {
										if (this.prev < n.catchLoc) return i(n.catchLoc, !0)
									} else {
										if (!c) throw Error("try statement without catch or finally");
										if (this.prev < n.finallyLoc) return i(n.finallyLoc)
									}
								}
							}
						},
						abrupt: function(e, t) {
							for (var r = this.tryEntries.length - 1; r >= 0; --r) {
								var i = this.tryEntries[r];
								if (i.tryLoc <= this.prev && o.call(i, "finallyLoc") && this.prev < i.finallyLoc) {
									var a = i;
									break
								}
							}
							a && ("break" === e || "continue" === e) && a.tryLoc <= t && t <= a.finallyLoc && (a = null);
							var n = a ? a.completion : {};
							return n.type = e, n.arg = t, a ? (this.method = "next", this.next = a.finallyLoc, g) : this.complete(n)
						},
						complete: function(e, t) {
							if ("throw" === e.type) throw e.arg;
							return "break" === e.type || "continue" === e.type ? this.next = e.arg : "return" === e.type ? (this.rval = this.arg = e.arg, this.method = "return", this.next = "end") : "normal" === e.type && t && (this.next = t), g
						},
						finish: function(e) {
							for (var t = this.tryEntries.length - 1; t >= 0; --t) {
								var r = this.tryEntries[t];
								if (r.finallyLoc === e) return this.complete(r.completion, r.afterLoc), L(r), g
							}
						},
						catch: function(e) {
							for (var t = this.tryEntries.length - 1; t >= 0; --t) {
								var r = this.tryEntries[t];
								if (r.tryLoc === e) {
									var o = r.completion;
									if ("throw" === o.type) {
										var i = o.arg;
										L(r)
									}
									return i
								}
							}
							throw Error("illegal catch attempt")
						},
						delegateYield: function(t, r, o) {
							return this.delegate = {
								iterator: P(t),
								resultName: r,
								nextLoc: o
							}, "next" === this.method && (this.arg = e), g
						}
					}, t
				}

				function n(e, t) {
					return function(e) {
						if (Array.isArray(e)) return e
					}(e) || function(e, t) {
						var r = null == e ? null : "undefined" != typeof Symbol && e[Symbol.iterator] || e["@@iterator"];
						if (null != r) {
							var o, i, a, n, _ = [],
								s = !0,
								c = !1;
							try {
								if (a = (r = r.call(e)).next, 0 === t) {
									if (Object(r) !== r) return;
									s = !1
								} else
									for (; !(s = (o = a.call(r)).done) && (_.push(o.value), _.length !== t); s = !0);
							} catch (e) {
								c = !0, i = e
							} finally {
								try {
									if (!s && null != r.return && (n = r.return(), Object(n) !== n)) return
								} finally {
									if (c) throw i
								}
							}
							return _
						}
					}(e, t) || function(e, t) {
						if (e) {
							if ("string" == typeof e) return _(e, t);
							var r = {}.toString.call(e).slice(8, -1);
							return "Object" === r && e.constructor && (r = e.constructor.name), "Map" === r || "Set" === r ? Array.from(e) : "Arguments" === r || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(r) ? _(e, t) : void 0
						}
					}(e, t) || function() {
						throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.")
					}()
				}

				function _(e, t) {
					(null == t || t > e.length) && (t = e.length);
					for (var r = 0, o = Array(t); r < t; r++) o[r] = e[r];
					return o
				}

				function s(e, t, r, o, i, a, n) {
					try {
						var _ = e[a](n),
							s = _.value
					} catch (e) {
						return void r(e)
					}
					_.done ? t(s) : Promise.resolve(s).then(o, i)
				}

				function c(e) {
					var t = document.createElement("textarea");
					t.style.position = "fixed", t.style.opacity = 0, t.value = e, document.body.appendChild(t), t.select(), document.execCommand("copy"), document.body.removeChild(t)
				}

				function l(e, t) {
					return u.apply(this, arguments)
				}

				function u() {
					var e;
					return e = a().mark((function e(t, r) {
						var i, n, _, s, c, l, u;
						return a().wrap((function(e) {
							for (;;) switch (e.prev = e.next) {
								case 0:
									i = t.width, n = t.height, _ = t.margin, r = "<style> /* normalize browsers */ html, body { margin: 0 !important; padding: 0 !important; } </style>" + (r = "<style> /* page settings */ @page { size: " + i + "px " + n + "px; margin: " + _ + "px; } </style>" + (r = "<style> div.page { width: " + (i - 2 * _) + "px; height: " + (n - 2 * _) + "px; } </style>" + r)), (s = t.style) && (r += "\n\n\n\x3c!-- additional style --\x3e<style>" + s + "</style>\n\n\n"), c = new Blob([r], {
										type: "text/html;charset=utf-8"
									}), l = URL.createObjectURL(c), o.Ay.debug("blobUrl:", l), (u = document.createElement("iframe")).style.display = "none", u.src = l, document.body.appendChild(u), u.onload = function() {
										setTimeout((function() {
											u.focus(), u.contentWindow.print()
										}), 1)
									};
								case 14:
								case "end":
									return e.stop()
							}
						}), e)
					})), u = function() {
						var t = this,
							r = arguments;
						return new Promise((function(o, i) {
							var a = e.apply(t, r);

							function n(e) {
								s(a, o, i, n, _, "next", e)
							}

							function _(e) {
								s(a, o, i, n, _, "throw", e)
							}
							n(void 0)
						}))
					}, u.apply(this, arguments)
				}

				function d(e) {
					var t = {};
					return e.slice(1).split("&").forEach((function(e) {
						var r = n(e.split("="), 2),
							o = r[0],
							i = r[1];
						t[o] = i
					})), t
				}

				function p(e) {
					return "?" + Object.entries(e).map((function(e) {
						var t = n(e, 2),
							r = t[0],
							o = t[1];
						return "".concat(r, "=").concat(o)
					})).join("&")
				}

				function h(e) {
					alert(e)
				}
			},
			2266: (e, t, r) => {
				"use strict";

				function o(e) {
					return o = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function(e) {
						return typeof e
					} : function(e) {
						return e && "function" == typeof Symbol && e.constructor === Symbol && e !== Symbol.prototype ? "symbol" : typeof e
					}, o(e)
				}

				function i() {
					i = function() {
						return t
					};
					var e, t = {},
						r = Object.prototype,
						a = r.hasOwnProperty,
						n = Object.defineProperty || function(e, t, r) {
							e[t] = r.value
						},
						_ = "function" == typeof Symbol ? Symbol : {},
						s = _.iterator || "@@iterator",
						c = _.asyncIterator || "@@asyncIterator",
						l = _.toStringTag || "@@toStringTag";

					function u(e, t, r) {
						return Object.defineProperty(e, t, {
							value: r,
							enumerable: !0,
							configurable: !0,
							writable: !0
						}), e[t]
					}
					try {
						u({}, "")
					} catch (e) {
						u = function(e, t, r) {
							return e[t] = r
						}
					}

					function d(e, t, r, o) {
						var i = t && t.prototype instanceof b ? t : b,
							a = Object.create(i.prototype),
							_ = new E(o || []);
						return n(a, "_invoke", {
							value: T(e, r, _)
						}), a
					}

					function p(e, t, r) {
						try {
							return {
								type: "normal",
								arg: e.call(t, r)
							}
						} catch (e) {
							return {
								type: "throw",
								arg: e
							}
						}
					}
					t.wrap = d;
					var h = "suspendedStart",
						v = "suspendedYield",
						f = "executing",
						m = "completed",
						g = {};

					function b() {}

					function y() {}

					function C() {}
					var w = {};
					u(w, s, (function() {
						return this
					}));
					var x = Object.getPrototypeOf,
						k = x && x(x(P([])));
					k && k !== r && a.call(k, s) && (w = k);
					var S = C.prototype = b.prototype = Object.create(w);

					function B(e) {
						["next", "throw", "return"].forEach((function(t) {
							u(e, t, (function(e) {
								return this._invoke(t, e)
							}))
						}))
					}

					function A(e, t) {
						function r(i, n, _, s) {
							var c = p(e[i], e, n);
							if ("throw" !== c.type) {
								var l = c.arg,
									u = l.value;
								return u && "object" == o(u) && a.call(u, "__await") ? t.resolve(u.__await).then((function(e) {
									r("next", e, _, s)
								}), (function(e) {
									r("throw", e, _, s)
								})) : t.resolve(u).then((function(e) {
									l.value = e, _(l)
								}), (function(e) {
									return r("throw", e, _, s)
								}))
							}
							s(c.arg)
						}
						var i;
						n(this, "_invoke", {
							value: function(e, o) {
								function a() {
									return new t((function(t, i) {
										r(e, o, t, i)
									}))
								}
								return i = i ? i.then(a, a) : a()
							}
						})
					}

					function T(t, r, o) {
						var i = h;
						return function(a, n) {
							if (i === f) throw Error("Generator is already running");
							if (i === m) {
								if ("throw" === a) throw n;
								return {
									value: e,
									done: !0
								}
							}
							for (o.method = a, o.arg = n;;) {
								var _ = o.delegate;
								if (_) {
									var s = I(_, o);
									if (s) {
										if (s === g) continue;
										return s
									}
								}
								if ("next" === o.method) o.sent = o._sent = o.arg;
								else if ("throw" === o.method) {
									if (i === h) throw i = m, o.arg;
									o.dispatchException(o.arg)
								} else "return" === o.method && o.abrupt("return", o.arg);
								i = f;
								var c = p(t, r, o);
								if ("normal" === c.type) {
									if (i = o.done ? m : v, c.arg === g) continue;
									return {
										value: c.arg,
										done: o.done
									}
								}
								"throw" === c.type && (i = m, o.method = "throw", o.arg = c.arg)
							}
						}
					}

					function I(t, r) {
						var o = r.method,
							i = t.iterator[o];
						if (i === e) return r.delegate = null, "throw" === o && t.iterator.return && (r.method = "return", r.arg = e, I(t, r), "throw" === r.method) || "return" !== o && (r.method = "throw", r.arg = new TypeError("The iterator does not provide a '" + o + "' method")), g;
						var a = p(i, t.iterator, r.arg);
						if ("throw" === a.type) return r.method = "throw", r.arg = a.arg, r.delegate = null, g;
						var n = a.arg;
						return n ? n.done ? (r[t.resultName] = n.value, r.next = t.nextLoc, "return" !== r.method && (r.method = "next", r.arg = e), r.delegate = null, g) : n : (r.method = "throw", r.arg = new TypeError("iterator result is not an object"), r.delegate = null, g)
					}

					function q(e) {
						var t = {
							tryLoc: e[0]
						};
						1 in e && (t.catchLoc = e[1]), 2 in e && (t.finallyLoc = e[2], t.afterLoc = e[3]), this.tryEntries.push(t)
					}

					function L(e) {
						var t = e.completion || {};
						t.type = "normal", delete t.arg, e.completion = t
					}

					function E(e) {
						this.tryEntries = [{
							tryLoc: "root"
						}], e.forEach(q, this), this.reset(!0)
					}

					function P(t) {
						if (t || "" === t) {
							var r = t[s];
							if (r) return r.call(t);
							if ("function" == typeof t.next) return t;
							if (!isNaN(t.length)) {
								var i = -1,
									n = function r() {
										for (; ++i < t.length;)
											if (a.call(t, i)) return r.value = t[i], r.done = !1, r;
										return r.value = e, r.done = !0, r
									};
								return n.next = n
							}
						}
						throw new TypeError(o(t) + " is not iterable")
					}
					return y.prototype = C, n(S, "constructor", {
						value: C,
						configurable: !0
					}), n(C, "constructor", {
						value: y,
						configurable: !0
					}), y.displayName = u(C, l, "GeneratorFunction"), t.isGeneratorFunction = function(e) {
						var t = "function" == typeof e && e.constructor;
						return !!t && (t === y || "GeneratorFunction" === (t.displayName || t.name))
					}, t.mark = function(e) {
						return Object.setPrototypeOf ? Object.setPrototypeOf(e, C) : (e.__proto__ = C, u(e, l, "GeneratorFunction")), e.prototype = Object.create(S), e
					}, t.awrap = function(e) {
						return {
							__await: e
						}
					}, B(A.prototype), u(A.prototype, c, (function() {
						return this
					})), t.AsyncIterator = A, t.async = function(e, r, o, i, a) {
						void 0 === a && (a = Promise);
						var n = new A(d(e, r, o, i), a);
						return t.isGeneratorFunction(r) ? n : n.next().then((function(e) {
							return e.done ? e.value : n.next()
						}))
					}, B(S), u(S, l, "Generator"), u(S, s, (function() {
						return this
					})), u(S, "toString", (function() {
						return "[object Generator]"
					})), t.keys = function(e) {
						var t = Object(e),
							r = [];
						for (var o in t) r.push(o);
						return r.reverse(),
							function e() {
								for (; r.length;) {
									var o = r.pop();
									if (o in t) return e.value = o, e.done = !1, e
								}
								return e.done = !0, e
							}
					}, t.values = P, E.prototype = {
						constructor: E,
						reset: function(t) {
							if (this.prev = 0, this.next = 0, this.sent = this._sent = e, this.done = !1, this.delegate = null, this.method = "next", this.arg = e, this.tryEntries.forEach(L), !t)
								for (var r in this) "t" === r.charAt(0) && a.call(this, r) && !isNaN(+r.slice(1)) && (this[r] = e)
						},
						stop: function() {
							this.done = !0;
							var e = this.tryEntries[0].completion;
							if ("throw" === e.type) throw e.arg;
							return this.rval
						},
						dispatchException: function(t) {
							if (this.done) throw t;
							var r = this;

							function o(o, i) {
								return _.type = "throw", _.arg = t, r.next = o, i && (r.method = "next", r.arg = e), !!i
							}
							for (var i = this.tryEntries.length - 1; i >= 0; --i) {
								var n = this.tryEntries[i],
									_ = n.completion;
								if ("root" === n.tryLoc) return o("end");
								if (n.tryLoc <= this.prev) {
									var s = a.call(n, "catchLoc"),
										c = a.call(n, "finallyLoc");
									if (s && c) {
										if (this.prev < n.catchLoc) return o(n.catchLoc, !0);
										if (this.prev < n.finallyLoc) return o(n.finallyLoc)
									} else if (s) {
										if (this.prev < n.catchLoc) return o(n.catchLoc, !0)
									} else {
										if (!c) throw Error("try statement without catch or finally");
										if (this.prev < n.finallyLoc) return o(n.finallyLoc)
									}
								}
							}
						},
						abrupt: function(e, t) {
							for (var r = this.tryEntries.length - 1; r >= 0; --r) {
								var o = this.tryEntries[r];
								if (o.tryLoc <= this.prev && a.call(o, "finallyLoc") && this.prev < o.finallyLoc) {
									var i = o;
									break
								}
							}
							i && ("break" === e || "continue" === e) && i.tryLoc <= t && t <= i.finallyLoc && (i = null);
							var n = i ? i.completion : {};
							return n.type = e, n.arg = t, i ? (this.method = "next", this.next = i.finallyLoc, g) : this.complete(n)
						},
						complete: function(e, t) {
							if ("throw" === e.type) throw e.arg;
							return "break" === e.type || "continue" === e.type ? this.next = e.arg : "return" === e.type ? (this.rval = this.arg = e.arg, this.method = "return", this.next = "end") : "normal" === e.type && t && (this.next = t), g
						},
						finish: function(e) {
							for (var t = this.tryEntries.length - 1; t >= 0; --t) {
								var r = this.tryEntries[t];
								if (r.finallyLoc === e) return this.complete(r.completion, r.afterLoc), L(r), g
							}
						},
						catch: function(e) {
							for (var t = this.tryEntries.length - 1; t >= 0; --t) {
								var r = this.tryEntries[t];
								if (r.tryLoc === e) {
									var o = r.completion;
									if ("throw" === o.type) {
										var i = o.arg;
										L(r)
									}
									return i
								}
							}
							throw Error("illegal catch attempt")
						},
						delegateYield: function(t, r, o) {
							return this.delegate = {
								iterator: P(t),
								resultName: r,
								nextLoc: o
							}, "next" === this.method && (this.arg = e), g
						}
					}, t
				}

				function a(e, t, r, o, i, a, n) {
					try {
						var _ = e[a](n),
							s = _.value
					} catch (e) {
						return void r(e)
					}
					_.done ? t(s) : Promise.resolve(s).then(o, i)
				}

				function n(e) {
					return _.apply(this, arguments)
				}

				function _() {
					var e;
					return e = i().mark((function e(t) {
						return i().wrap((function(e) {
							for (;;) switch (e.prev = e.next) {
								case 0:
									return e.abrupt("return", new Promise((function(e) {
										return setTimeout(e, t)
									})));
								case 1:
								case "end":
									return e.stop()
							}
						}), e)
					})), _ = function() {
						var t = this,
							r = arguments;
						return new Promise((function(o, i) {
							var n = e.apply(t, r);

							function _(e) {
								a(n, o, i, _, s, "next", e)
							}

							function s(e) {
								a(n, o, i, _, s, "throw", e)
							}
							_(void 0)
						}))
					}, _.apply(this, arguments)
				}

				function s(e, t) {
					return new Promise((function(r, o) {
						var i = 0,
							a = 0,
							n = 0,
							_ = [];
						! function s() {
							if (console.log("!! ", a, e.length), a >= e.length) r(_);
							else
								for (var c = function() {
										var t = n;
										e[n].then((function(e) {
											i--, a++, _[t] = e, s()
										})).catch((function(e) {
											o(e)
										})), i++, n++
									}; n < e.length && i < t;) c()
						}()
					}))
				}

				function c(e, t) {
					for (var r, o = [], i = [], a = /<([^>:]+)(?::([^>]+))?>/g; null !== (r = a.exec(e));) {
						var n = r[1],
							_ = r[2] || "string";
						o.push(_), i.push(n)
					}
					var s = e.replace(/<([^>:]+)(?::([^>]+))?>/g, "([^/]+)"),
						c = new RegExp("^".concat(s, "$")),
						l = t.match(c);
					if (!l) return !1;
					for (var u = {}, d = 0; d < i.length; d++) {
						var p = l[d + 1],
							h = o[d];
						if ("int" === h) {
							if (!/^\d+$/.test(p)) return !1;
							u[i[d]] = parseInt(p)
						} else {
							if ("string" !== h) return !1;
							u[i[d]] = p
						}
					}
					return u
				}
				r.d(t, {
					Di: () => c,
					f6: () => s,
					yy: () => n
				})
			},
			3893: (e, t, r) => {
				"use strict";

				function o(e) {
					return o = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function(e) {
						return typeof e
					} : function(e) {
						return e && "function" == typeof Symbol && e.constructor === Symbol && e !== Symbol.prototype ? "symbol" : typeof e
					}, o(e)
				}

				function i(e, t) {
					for (var r = 0; r < t.length; r++) {
						var o = t[r];
						o.enumerable = o.enumerable || !1, o.configurable = !0, "value" in o && (o.writable = !0), Object.defineProperty(e, a(o.key), o)
					}
				}

				function a(e) {
					var t = function(e, t) {
						if ("object" != o(e) || !e) return e;
						var r = e[Symbol.toPrimitive];
						if (void 0 !== r) {
							var i = r.call(e, "string");
							if ("object" != o(i)) return i;
							throw new TypeError("@@toPrimitive must return a primitive value.")
						}
						return String(e)
					}(e);
					return "symbol" == o(t) ? t : t + ""
				}
				r.d(t, {
					Ay: () => n
				});
				const n = new(function() {
					function e(t) {
						! function(e, t) {
							if (!(e instanceof t)) throw new TypeError("Cannot call a class as a function")
						}(this, e), this.namespace = t, this.prefix = "[" + t + "]"
					}
					return t = e, r = [{
						key: "log",
						value: function() {
							for (var e, t = arguments.length, r = new Array(t), o = 0; o < t; o++) r[o] = arguments[o];
							(e = console).log.apply(e, [this.prefix].concat(r))
						}
					}, {
						key: "warn",
						value: function() {
							for (var e, t = arguments.length, r = new Array(t), o = 0; o < t; o++) r[o] = arguments[o];
							(e = console).warn.apply(e, [this.prefix].concat(r))
						}
					}, {
						key: "error",
						value: function() {
							for (var e, t = arguments.length, r = new Array(t), o = 0; o < t; o++) r[o] = arguments[o];
							(e = console).error.apply(e, [this.prefix].concat(r))
						}
					}, {
						key: "debug",
						value: function() {
							for (var e, t = arguments.length, r = new Array(t), o = 0; o < t; o++) r[o] = arguments[o];
							(e = console).debug.apply(e, [this.prefix].concat(r))
						}
					}, {
						key: "info",
						value: function() {
							for (var e, t = arguments.length, r = new Array(t), o = 0; o < t; o++) r[o] = arguments[o];
							(e = console).info.apply(e, [this.prefix].concat(r))
						}
					}, {
						key: "extends",
						value: function(t) {
							return new e(this.namespace + ":" + t)
						}
					}], r && i(t.prototype, r), Object.defineProperty(t, "prototype", {
						writable: !1
					}), t;
					var t, r
				}())("zju-helper")
			},
			7954: (e, t, r) => {
				"use strict";
				r.d(t, {
					A: () => _
				});
				var o = r(1601),
					i = r.n(o),
					a = r(6314),
					n = r.n(a)()(i());
				n.push([e.id, "html{font-size:16px}.zju-helper{position:fixed;top:0;left:-18rem;width:18rem;height:100vh;box-shadow:2px 0 8px rgba(0,0,0,.15);transition:left .25s,opacity .25s;opacity:0;z-index:9999;padding:1.5rem 1rem;backdrop-filter:blur(4px);background-color:rgba(255,255,255,.375);overflow-y:auto;overflow-x:hidden;scrollbar-gutter:stable}.zju-helper,.zju-helper *{box-sizing:border-box}.zju-helper::-webkit-scrollbar{width:6px}.zju-helper::-webkit-scrollbar-thumb{background-color:rgba(0,0,0,.2);border-radius:3px}.zju-helper::-webkit-scrollbar-track{background-color:transparent}.zju-helper.visible{left:0;opacity:1}.zju-helper-busy-indicator{opacity:1;transition:opacity .25s ease}.zju-helper.zju-helper-loaded .zju-helper-busy-indicator{opacity:0}.zju-helper-trigger{position:fixed;top:0;left:0;width:20px;height:100vh;z-index:9998}.zju-helper-panel-header{padding:1rem}.zju-helper-panel-header .zju-helper-panel-header-title{margin-top:.15rem;font-weight:700;font-size:1.025rem}.zju-helper-panel-header .zju-helper-loaded-plugins-slogen{margin-top:.5rem;font-size:.8rem;color:#666}.zju-helper-panel-header .zju-helper-loaded-plugins{margin-top:.25rem}.zju-helper-loaded-plugin-tag{zoom:0.875;margin-right:.375rem;margin-top:.375rem;display:inline-block}.zju-helper-plugin{margin-top:.75rem}.zju-helper-plugin .zju-helper-plugin-content{margin-top:-1rem;max-height:400px;overflow-y:hidden;transition:max-height .5s cubic-bezier(0, 1, 0, 1)}.zju-helper-plugin .zju-helper-plugin-content.has-overflow{mask-image:linear-gradient(to bottom,black 0%,black 80%,rgba(0,0,0,0.1) 100%)}.zju-helper-plugin:hover .zju-helper-plugin-content{max-height:9999vh;transition:max-height 1s ease-in-out;mask-image:none;-webkit-mask-image:none}*,:after,:before{--_ui5-v2-4-0_card_header_title_font_weight:bold!important;--_ui5-v2-4-0_card_header_padding:1rem 1rem 0.75rem 1rem!important;--_ui5-v2-4-0_tl_li_margin_bottom:0.625rem!important;--_ui5-v2-4-0_timeline_tli_indicator_before_bottom:-0.625rem!important}", ""]);
				const _ = n
			},
			5271: (e, t, r) => {
				"use strict";
				r.d(t, {
					A: () => _
				});
				var o = r(1601),
					i = r.n(o),
					a = r(6314),
					n = r.n(a)()(i());
				n.push([e.id, ".mem-pta-btn{border:none;border-radius:4px}", ""]);
				const _ = n
			},
			5443: (e, t, r) => {
				"use strict";
				r.d(t, {
					A: () => _
				});
				var o = r(1601),
					i = r.n(o),
					a = r(6314),
					n = r.n(a)()(i());
				n.push([e.id, ".content-right .mem-bvp-btn{display:none}.mem-bvp-btn{position:relative;margin-right:10px;order:-1;color:#fff;font-size:12px}.mem-bvp-btn:hover{color:#248ef1}.mem-bvt-fullscreen .app-wrap{overflow:hidden!important}.mem-bvt-fullscreen .player-wrapper{position:fixed!important;top:0;left:0;z-index:114514!important;width:100%!important;height:100%!important}", ""]);
				const _ = n
			},
			297: (e, t, r) => {
				"use strict";
				r.d(t, {
					A: () => _
				});
				var o = r(1601),
					i = r.n(o),
					a = r(6314),
					n = r.n(a)()(i());
				n.push([e.id, ".mem-btn{border:none;display:flex;margin-left:16px;cursor:pointer;height:32px;line-height:32px;-webkit-box-align:center;-ms-flex-align:center;align-items:center;-webkit-box-pack:center;-ms-flex-pack:center;justify-content:center;border-radius:4px;background-color:#f0f1f3;font-size:14px;color:#144aea;text-align:center;position:relative;padding:0 6px}@media screen and (max-width:1679px){.mem-btn{margin-left:11.42856px;height:22.85712px;line-height:22.85712px;font-size:9.99999px}}@media screen and (min-width:1680px) and (max-width:1919px){.mem-btn{margin-left:14px;height:28px;line-height:28px;font-size:12.25px}}", ""]);
				const _ = n
			},
			1254: (e, t, r) => {
				"use strict";
				r.d(t, {
					A: () => _
				});
				var o = r(1601),
					i = r.n(o),
					a = r(6314),
					n = r.n(a)()(i());
				n.push([e.id, ".footer.gtm-category.ng-scope,__nothing__{display:none!important}", ""]);
				const _ = n
			},
			844: (e, t, r) => {
				"use strict";
				r.d(t, {
					A: () => _
				});
				var o = r(1601),
					i = r.n(o),
					a = r(6314),
					n = r.n(a)()(i());
				n.push([e.id, ".custom-footer,.feedback-wrapper,.hot-recommend-wrapper,.menu-content>.first-menu:nth-child(4),.menu-content>.first-menu:nth-child(5),__nothing__{display:none!important}__nothing__{opacity:0!important;pointer-events:none;cursor:default}.living-page-wrapper{padding-bottom:20.040129px}.course-filter-searchAll-custom{border-left:none!important;border-right:none!important}.collect>.collect_span,.collect>.good_span,.operate_wrap>.collect_span,.operate_wrap>.good_span{display:none!important}.side_tab_wrap .side_tab{background:#f9f9f9!important;transform:none!important;color:#a0a0a0!important}.side_tab_wrap .side_tab span{transform:none!important}.side_tab_wrap .side_tab.active span{color:#144aea!important;font-weight:700!important}.relative-info-gap,.relative-info-right{display:none}.relative-info-left{width:100%!important}", ""]);
				const _ = n
			},
			6428: (e, t, r) => {
				"use strict";
				r.d(t, {
					A: () => _
				});
				var o = r(1601),
					i = r.n(o),
					a = r(6314),
					n = r.n(a)()(i());
				n.push([e.id, ".ppt_opr_lay>.pip-btn{display:inline-block;vertical-align:middle;margin-left:10px;margin-right:-20px}.pip-btn{position:relative;margin-right:10px;order:2;opacity:.75}.pip-btn>.svg-icon{fill:white;width:24px;height:24px}.pip-btn:hover>.svg-icon{fill:#248ef1}.pip-window .pip-btn{display:none}.pip-window>.ppt_container>.ppt_opr_con{display:none;position:absolute;bottom:0;background:#000;overflow-x:clip}.pip-window>.ppt_container:hover>.ppt_opr_con{display:block}.pip-window .opr_lay{justify-content:start!important}.pip-window .ppt_page_btn{margin-left:30px}.pip-window .el-slider__button-wrapper{cursor:pointer!important}.pip-window .el-slider__button-wrapper>.el-slider__button{cursor:pointer!important}", ""]);
				const _ = n
			},
			5548: (e, t, r) => {
				"use strict";
				r.d(t, {
					A: () => _
				});
				var o = r(1601),
					i = r.n(o),
					a = r(6314),
					n = r.n(a)()(i());
				n.push([e.id, ".score-finder-item-content{word-break:break-all;margin-top:-.375rem;font-size:.675rem}.score-finder-meaningless-counter{padding:0 1rem 1rem 1rem;font-size:.75rem}.score-finder-no-activity{padding:1rem}", ""]);
				const _ = n
			},
			6314: e => {
				"use strict";
				e.exports = function(e) {
					var t = [];
					return t.toString = function() {
						return this.map((function(t) {
							var r = "",
								o = void 0 !== t[5];
							return t[4] && (r += "@supports (".concat(t[4], ") {")), t[2] && (r += "@media ".concat(t[2], " {")), o && (r += "@layer".concat(t[5].length > 0 ? " ".concat(t[5]) : "", " {")), r += e(t), o && (r += "}"), t[2] && (r += "}"), t[4] && (r += "}"), r
						})).join("")
					}, t.i = function(e, r, o, i, a) {
						"string" == typeof e && (e = [
							[null, e, void 0]
						]);
						var n = {};
						if (o)
							for (var _ = 0; _ < this.length; _++) {
								var s = this[_][0];
								null != s && (n[s] = !0)
							}
						for (var c = 0; c < e.length; c++) {
							var l = [].concat(e[c]);
							o && n[l[0]] || (void 0 !== a && (void 0 === l[5] || (l[1] = "@layer".concat(l[5].length > 0 ? " ".concat(l[5]) : "", " {").concat(l[1], "}")), l[5] = a), r && (l[2] ? (l[1] = "@media ".concat(l[2], " {").concat(l[1], "}"), l[2] = r) : l[2] = r), i && (l[4] ? (l[1] = "@supports (".concat(l[4], ") {").concat(l[1], "}"), l[4] = i) : l[4] = "".concat(i)), t.push(l))
						}
					}, t
				}
			},
			1601: e => {
				"use strict";
				e.exports = function(e) {
					return e[1]
				}
			},
			4213: function(e, t, r) {
				var o, i;
				void 0 === (i = "function" == typeof(o = function() {
					"use strict";

					function t(e, t, r) {
						var o = new XMLHttpRequest;
						o.open("GET", e), o.responseType = "blob", o.onload = function() {
							_(o.response, t, r)
						}, o.onerror = function() {
							console.error("could not download file")
						}, o.send()
					}

					function o(e) {
						var t = new XMLHttpRequest;
						t.open("HEAD", e, !1);
						try {
							t.send()
						} catch (e) {}
						return 200 <= t.status && 299 >= t.status
					}

					function i(e) {
						try {
							e.dispatchEvent(new MouseEvent("click"))
						} catch (r) {
							var t = document.createEvent("MouseEvents");
							t.initMouseEvent("click", !0, !0, window, 0, 0, 0, 80, 20, !1, !1, !1, !1, 0, null), e.dispatchEvent(t)
						}
					}
					var a = "object" == typeof window && window.window === window ? window : "object" == typeof self && self.self === self ? self : "object" == typeof r.g && r.g.global === r.g ? r.g : void 0,
						n = a.navigator && /Macintosh/.test(navigator.userAgent) && /AppleWebKit/.test(navigator.userAgent) && !/Safari/.test(navigator.userAgent),
						_ = a.saveAs || ("object" != typeof window || window !== a ? function() {} : "download" in HTMLAnchorElement.prototype && !n ? function(e, r, n) {
							var _ = a.URL || a.webkitURL,
								s = document.createElement("a");
							r = r || e.name || "download", s.download = r, s.rel = "noopener", "string" == typeof e ? (s.href = e, s.origin === location.origin ? i(s) : o(s.href) ? t(e, r, n) : i(s, s.target = "_blank")) : (s.href = _.createObjectURL(e), setTimeout((function() {
								_.revokeObjectURL(s.href)
							}), 4e4), setTimeout((function() {
								i(s)
							}), 0))
						} : "msSaveOrOpenBlob" in navigator ? function(e, r, a) {
							if (r = r || e.name || "download", "string" != typeof e) navigator.msSaveOrOpenBlob(function(e, t) {
								return void 0 === t ? t = {
									autoBom: !1
								} : "object" != typeof t && (console.warn("Deprecated: Expected third argument to be a object"), t = {
									autoBom: !t
								}), t.autoBom && /^\s*(?:text\/\S*|application\/xml|\S*\/\S*\+xml)\s*;.*charset\s*=\s*utf-8/i.test(e.type) ? new Blob(["\ufeff", e], {
									type: e.type
								}) : e
							}(e, a), r);
							else if (o(e)) t(e, r, a);
							else {
								var n = document.createElement("a");
								n.href = e, n.target = "_blank", setTimeout((function() {
									i(n)
								}))
							}
						} : function(e, r, o, i) {
							if ((i = i || open("", "_blank")) && (i.document.title = i.document.body.innerText = "downloading..."), "string" == typeof e) return t(e, r, o);
							var _ = "application/octet-stream" === e.type,
								s = /constructor/i.test(a.HTMLElement) || a.safari,
								c = /CriOS\/[\d]+/.test(navigator.userAgent);
							if ((c || _ && s || n) && "undefined" != typeof FileReader) {
								var l = new FileReader;
								l.onloadend = function() {
									var e = l.result;
									e = c ? e : e.replace(/^data:[^;]*;/, "data:attachment/file;"), i ? i.location.href = e : location = e, i = null
								}, l.readAsDataURL(e)
							} else {
								var u = a.URL || a.webkitURL,
									d = u.createObjectURL(e);
								i ? i.location = d : location.href = d, i = null, setTimeout((function() {
									u.revokeObjectURL(d)
								}), 4e4)
							}
						});
					a.saveAs = _.saveAs = _, e.exports = _
				}) ? o.apply(t, []) : o) || (e.exports = i)
			},
			4579: (e, t, r) => {
				"use strict";
				r.r(t), r.d(t, {
					default: () => m
				});
				var o = r(5072),
					i = r.n(o),
					a = r(7825),
					n = r.n(a),
					_ = r(7659),
					s = r.n(_),
					c = r(5056),
					l = r.n(c),
					u = r(540),
					d = r.n(u),
					p = r(1113),
					h = r.n(p),
					v = r(7954),
					f = {};
				f.styleTagTransform = h(), f.setAttributes = l(), f.insert = s().bind(null, "head"), f.domAPI = n(), f.insertStyleElement = d(), i()(v.A, f);
				const m = v.A && v.A.locals ? v.A.locals : void 0
			},
			9102: (e, t, r) => {
				"use strict";
				r.r(t), r.d(t, {
					default: () => m
				});
				var o = r(5072),
					i = r.n(o),
					a = r(7825),
					n = r.n(a),
					_ = r(7659),
					s = r.n(_),
					c = r(5056),
					l = r.n(c),
					u = r(540),
					d = r.n(u),
					p = r(1113),
					h = r.n(p),
					v = r(5271),
					f = {};
				f.styleTagTransform = h(), f.setAttributes = l(), f.insert = s().bind(null, "head"), f.domAPI = n(), f.insertStyleElement = d(), i()(v.A, f);
				const m = v.A && v.A.locals ? v.A.locals : void 0
			},
			9734: (e, t, r) => {
				"use strict";
				r.r(t), r.d(t, {
					default: () => m
				});
				var o = r(5072),
					i = r.n(o),
					a = r(7825),
					n = r.n(a),
					_ = r(7659),
					s = r.n(_),
					c = r(5056),
					l = r.n(c),
					u = r(540),
					d = r.n(u),
					p = r(1113),
					h = r.n(p),
					v = r(5443),
					f = {};
				f.styleTagTransform = h(), f.setAttributes = l(), f.insert = s().bind(null, "head"), f.domAPI = n(), f.insertStyleElement = d(), i()(v.A, f);
				const m = v.A && v.A.locals ? v.A.locals : void 0
			},
			5756: (e, t, r) => {
				"use strict";
				r.r(t), r.d(t, {
					default: () => m
				});
				var o = r(5072),
					i = r.n(o),
					a = r(7825),
					n = r.n(a),
					_ = r(7659),
					s = r.n(_),
					c = r(5056),
					l = r.n(c),
					u = r(540),
					d = r.n(u),
					p = r(1113),
					h = r.n(p),
					v = r(297),
					f = {};
				f.styleTagTransform = h(), f.setAttributes = l(), f.insert = s().bind(null, "head"), f.domAPI = n(), f.insertStyleElement = d(), i()(v.A, f);
				const m = v.A && v.A.locals ? v.A.locals : void 0
			},
			831: (e, t, r) => {
				"use strict";
				r.r(t), r.d(t, {
					default: () => m
				});
				var o = r(5072),
					i = r.n(o),
					a = r(7825),
					n = r.n(a),
					_ = r(7659),
					s = r.n(_),
					c = r(5056),
					l = r.n(c),
					u = r(540),
					d = r.n(u),
					p = r(1113),
					h = r.n(p),
					v = r(1254),
					f = {};
				f.styleTagTransform = h(), f.setAttributes = l(), f.insert = s().bind(null, "head"), f.domAPI = n(), f.insertStyleElement = d(), i()(v.A, f);
				const m = v.A && v.A.locals ? v.A.locals : void 0
			},
			445: (e, t, r) => {
				"use strict";
				r.r(t), r.d(t, {
					default: () => m
				});
				var o = r(5072),
					i = r.n(o),
					a = r(7825),
					n = r.n(a),
					_ = r(7659),
					s = r.n(_),
					c = r(5056),
					l = r.n(c),
					u = r(540),
					d = r.n(u),
					p = r(1113),
					h = r.n(p),
					v = r(844),
					f = {};
				f.styleTagTransform = h(), f.setAttributes = l(), f.insert = s().bind(null, "head"), f.domAPI = n(), f.insertStyleElement = d(), i()(v.A, f);
				const m = v.A && v.A.locals ? v.A.locals : void 0
			},
			6443: (e, t, r) => {
				"use strict";
				r.r(t), r.d(t, {
					default: () => m
				});
				var o = r(5072),
					i = r.n(o),
					a = r(7825),
					n = r.n(a),
					_ = r(7659),
					s = r.n(_),
					c = r(5056),
					l = r.n(c),
					u = r(540),
					d = r.n(u),
					p = r(1113),
					h = r.n(p),
					v = r(6428),
					f = {};
				f.styleTagTransform = h(), f.setAttributes = l(), f.insert = s().bind(null, "head"), f.domAPI = n(), f.insertStyleElement = d(), i()(v.A, f);
				const m = v.A && v.A.locals ? v.A.locals : void 0
			},
			1851: (e, t, r) => {
				"use strict";
				r.r(t), r.d(t, {
					default: () => m
				});
				var o = r(5072),
					i = r.n(o),
					a = r(7825),
					n = r.n(a),
					_ = r(7659),
					s = r.n(_),
					c = r(5056),
					l = r.n(c),
					u = r(540),
					d = r.n(u),
					p = r(1113),
					h = r.n(p),
					v = r(5548),
					f = {};
				f.styleTagTransform = h(), f.setAttributes = l(), f.insert = s().bind(null, "head"), f.domAPI = n(), f.insertStyleElement = d(), i()(v.A, f);
				const m = v.A && v.A.locals ? v.A.locals : void 0
			},
			5072: e => {
				"use strict";
				var t = [];

				function r(e) {
					for (var r = -1, o = 0; o < t.length; o++)
						if (t[o].identifier === e) {
							r = o;
							break
						} return r
				}

				function o(e, o) {
					for (var a = {}, n = [], _ = 0; _ < e.length; _++) {
						var s = e[_],
							c = o.base ? s[0] + o.base : s[0],
							l = a[c] || 0,
							u = "".concat(c, " ").concat(l);
						a[c] = l + 1;
						var d = r(u),
							p = {
								css: s[1],
								media: s[2],
								sourceMap: s[3],
								supports: s[4],
								layer: s[5]
							};
						if (-1 !== d) t[d].references++, t[d].updater(p);
						else {
							var h = i(p, o);
							o.byIndex = _, t.splice(_, 0, {
								identifier: u,
								updater: h,
								references: 1
							})
						}
						n.push(u)
					}
					return n
				}

				function i(e, t) {
					var r = t.domAPI(t);
					return r.update(e),
						function(t) {
							if (t) {
								if (t.css === e.css && t.media === e.media && t.sourceMap === e.sourceMap && t.supports === e.supports && t.layer === e.layer) return;
								r.update(e = t)
							} else r.remove()
						}
				}
				e.exports = function(e, i) {
					var a = o(e = e || [], i = i || {});
					return function(e) {
						e = e || [];
						for (var n = 0; n < a.length; n++) {
							var _ = r(a[n]);
							t[_].references--
						}
						for (var s = o(e, i), c = 0; c < a.length; c++) {
							var l = r(a[c]);
							0 === t[l].references && (t[l].updater(), t.splice(l, 1))
						}
						a = s
					}
				}
			},
			7659: e => {
				"use strict";
				var t = {};
				e.exports = function(e, r) {
					var o = function(e) {
						if (void 0 === t[e]) {
							var r = document.querySelector(e);
							if (window.HTMLIFrameElement && r instanceof window.HTMLIFrameElement) try {
								r = r.contentDocument.head
							} catch (e) {
								r = null
							}
							t[e] = r
						}
						return t[e]
					}(e);
					if (!o) throw new Error("Couldn't find a style target. This probably means that the value for the 'insert' parameter is invalid.");
					o.appendChild(r)
				}
			},
			540: e => {
				"use strict";
				e.exports = function(e) {
					var t = document.createElement("style");
					return e.setAttributes(t, e.attributes), e.insert(t, e.options), t
				}
			},
			5056: (e, t, r) => {
				"use strict";
				e.exports = function(e) {
					var t = r.nc;
					t && e.setAttribute("nonce", t)
				}
			},
			7825: e => {
				"use strict";
				e.exports = function(e) {
					if ("undefined" == typeof document) return {
						update: function() {},
						remove: function() {}
					};
					var t = e.insertStyleElement(e);
					return {
						update: function(r) {
							! function(e, t, r) {
								var o = "";
								r.supports && (o += "@supports (".concat(r.supports, ") {")), r.media && (o += "@media ".concat(r.media, " {"));
								var i = void 0 !== r.layer;
								i && (o += "@layer".concat(r.layer.length > 0 ? " ".concat(r.layer) : "", " {")), o += r.css, i && (o += "}"), r.media && (o += "}"), r.supports && (o += "}");
								var a = r.sourceMap;
								a && "undefined" != typeof btoa && (o += "\n/*# sourceMappingURL=data:application/json;base64,".concat(btoa(unescape(encodeURIComponent(JSON.stringify(a)))), " */")), t.styleTagTransform(o, e, t.options)
							}(t, e, r)
						},
						remove: function() {
							! function(e) {
								if (null === e.parentNode) return !1;
								e.parentNode.removeChild(e)
							}(t)
						}
					}
				}
			},
			1113: e => {
				"use strict";
				e.exports = function(e, t) {
					if (t.styleSheet) t.styleSheet.cssText = e;
					else {
						for (; t.firstChild;) t.removeChild(t.firstChild);
						t.appendChild(document.createTextNode(e))
					}
				}
			},
			1342: (e, t, r) => {
				var o = {
					"./better-pintia/index.js": 6741,
					"./better-video-player/index.js": 5221,
					"./builtin-video-pages/index.js": 9849,
					"./copy-with-timestamp/index.js": 1798,
					"./example-plugin/index.js": 1827,
					"./focus-mode/index.js": 1481,
					"./picture-in-picture/index.js": 8096,
					"./ppt-downloader/index.js": 4533,
					"./replay-parser/index.js": 3766,
					"./score-finder/index.js": 7985
				};

				function i(e) {
					var t = a(e);
					return r(t)
				}

				function a(e) {
					if (!r.o(o, e)) {
						var t = new Error("Cannot find module '" + e + "'");
						throw t.code = "MODULE_NOT_FOUND", t
					}
					return o[e]
				}
				i.keys = function() {
					return Object.keys(o)
				}, i.resolve = a, e.exports = i, i.id = 1342
			},
			6601: (e, t, r) => {
				"use strict";
				r.d(t, {
					zj: () => C
				});
				var o = r(7064),
					i = r(5602),
					a = r(3889);
				const n = {
						packageName: "@ui5/webcomponents-base",
						fileName: "FontFace.css",
						content: "@font-face{font-family:\"72\";font-style:normal;font-weight:400;src:url(https://sdk.openui5.org/resources/sap/ui/core/themes/sap_horizon/fonts/72-Regular.woff2?ui5-webcomponents) format(\"woff2\"),local(\"72\");unicode-range:U+00,U+0D,U+20-7E,U+A0-FF,U+131,U+152-153,U+161,U+178,U+17D-17E,U+192,U+237,U+2C6,U+2DC,U+3BC,U+1E9E,U+2013-2014,U+2018-201A,U+201C-201E,U+2020-2022,U+2026,U+2030,U+2039-203A,U+2044,U+20AC,U+2122}@font-face{font-family:\"72full\";font-style:normal;font-weight:400;src:url(https://sdk.openui5.org/resources/sap/ui/core/themes/sap_horizon/fonts/72-Regular-full.woff2?ui5-webcomponents) format(\"woff2\"),local('72-full')}@font-face{font-family:\"72\";font-style:normal;font-weight:700;src:url(https://sdk.openui5.org/resources/sap/ui/core/themes/sap_horizon/fonts/72-Bold.woff2?ui5-webcomponents) format(\"woff2\"),local('72-Bold');unicode-range:U+00,U+0D,U+20-7E,U+A0-FF,U+131,U+152-153,U+161,U+178,U+17D-17E,U+192,U+237,U+2C6,U+2DC,U+3BC,U+1E9E,U+2013-2014,U+2018-201A,U+201C-201E,U+2020-2022,U+2026,U+2030,U+2039-203A,U+2044,U+20AC,U+2122}@font-face{font-family:\"72full\";font-style:normal;font-weight:700;src:url(https://sdk.openui5.org/resources/sap/ui/core/themes/sap_horizon/fonts/72-Bold-full.woff2?ui5-webcomponents) format(\"woff2\")}@font-face{font-family:'72-Bold';font-style:normal;src:url(https://sdk.openui5.org/resources/sap/ui/core/themes/sap_horizon/fonts/72-Bold.woff2?ui5-webcomponents) format(\"woff2\"),local('72-Bold');unicode-range:U+00,U+0D,U+20-7E,U+A0-FF,U+131,U+152-153,U+161,U+178,U+17D-17E,U+192,U+237,U+2C6,U+2DC,U+3BC,U+1E9E,U+2013-2014,U+2018-201A,U+201C-201E,U+2020-2022,U+2026,U+2030,U+2039-203A,U+2044,U+20AC,U+2122}@font-face{font-family:'72-Boldfull';font-style:normal;src:url(https://sdk.openui5.org/resources/sap/ui/core/themes/sap_horizon/fonts/72-Bold-full.woff2?ui5-webcomponents) format(\"woff2\")}@font-face{font-family:'72-Light';font-style:normal;src:url(https://sdk.openui5.org/resources/sap/ui/core/themes/sap_horizon/fonts/72-Light.woff2?ui5-webcomponents) format(\"woff2\"),local('72-Light');unicode-range:U+00,U+0D,U+20-7E,U+A0-FF,U+131,U+152-153,U+161,U+178,U+17D-17E,U+192,U+237,U+2C6,U+2DC,U+3BC,U+1E9E,U+2013-2014,U+2018-201A,U+201C-201E,U+2020-2022,U+2026,U+2030,U+2039-203A,U+2044,U+20AC,U+2122}@font-face{font-family:'72-Lightfull';font-style:normal;src:url(https://sdk.openui5.org/resources/sap/ui/core/themes/sap_horizon/fonts/72-Light-full.woff2?ui5-webcomponents) format(\"woff2\")}@font-face{font-family:'72Mono';src:url(https://sdk.openui5.org/resources/sap/ui/core/themes/sap_horizon/fonts/72Mono-Regular.woff2?ui5-webcomponents) format('woff2'),local('72Mono');unicode-range:U+00,U+0D,U+20-7E,U+A0-FF,U+131,U+152-153,U+161,U+178,U+17D-17E,U+192,U+237,U+2C6,U+2DC,U+3BC,U+1E9E,U+2013-2014,U+2018-201A,U+201C-201E,U+2020-2022,U+2026,U+2030,U+2039-203A,U+2044,U+20AC,U+2122}@font-face{font-family:'72Monofull';src:url(https://sdk.openui5.org/resources/sap/ui/core/themes/sap_horizon/fonts/72Mono-Regular-full.woff2?ui5-webcomponents) format('woff2')}@font-face{font-family:'72Mono-Bold';src:url(https://sdk.openui5.org/resources/sap/ui/core/themes/sap_horizon/fonts/72Mono-Bold.woff2?ui5-webcomponents) format('woff2'),local('72Mono-Bold');unicode-range:U+00,U+0D,U+20-7E,U+A0-FF,U+131,U+152-153,U+161,U+178,U+17D-17E,U+192,U+237,U+2C6,U+2DC,U+3BC,U+1E9E,U+2013-2014,U+2018-201A,U+201C-201E,U+2020-2022,U+2026,U+2030,U+2039-203A,U+2044,U+20AC,U+2122}@font-face{font-family:'72Mono-Boldfull';src:url(https://sdk.openui5.org/resources/sap/ui/core/themes/sap_horizon/fonts/72Mono-Bold-full.woff2?ui5-webcomponents) format('woff2')}@font-face{font-family:\"72Black\";font-style:bold;font-weight:900;src:url(https://sdk.openui5.org/resources/sap/ui/core/themes/sap_horizon/fonts/72-Black.woff2?ui5-webcomponents) format(\"woff2\"),local('72Black');unicode-range:U+00,U+0D,U+20-7E,U+A0-FF,U+131,U+152-153,U+161,U+178,U+17D-17E,U+192,U+237,U+2C6,U+2DC,U+3BC,U+1E9E,U+2013-2014,U+2018-201A,U+201C-201E,U+2020-2022,U+2026,U+2030,U+2039-203A,U+2044,U+20AC,U+2122}@font-face{font-family:'72Blackfull';src:url(https://sdk.openui5.org/resources/sap/ui/core/themes/sap_horizon/fonts/72-Black-full.woff2?ui5-webcomponents) format('woff2')}@font-face{font-family:\"72-SemiboldDuplex\";src:url(https://sdk.openui5.org/resources/sap/ui/core/themes/sap_horizon/fonts/72-SemiboldDuplex.woff2?ui5-webcomponents) format(\"woff2\"),local('72-SemiboldDuplex');unicode-range:U+00,U+0D,U+20-7E,U+A0-FF,U+131,U+152-153,U+161,U+178,U+17D-17E,U+192,U+237,U+2C6,U+2DC,U+3BC,U+1E9E,U+2013-2014,U+2018-201A,U+201C-201E,U+2020-2022,U+2026,U+2030,U+2039-203A,U+2044,U+20AC,U+2122}"
					},
					_ = {
						packageName: "@ui5/webcomponents-base",
						fileName: "OverrideFontFace.css",
						content: "@font-face{font-family:'72override';unicode-range:U+0102-0103,U+01A0-01A1,U+01AF-01B0,U+1EA0-1EB7,U+1EB8-1EC7,U+1EC8-1ECB,U+1ECC-1EE3,U+1EE4-1EF1,U+1EF4-1EF7;src:local('Arial'),local('Helvetica'),local('sans-serif')}"
					};
				var s = r(1542);
				let c;
				(0, r(9887).R)((() => {
					c = void 0
				}));
				const l = () => {
						const e = (0, a.x$)("OpenUI5Support");
						(!e || !e.isOpenUI5Detected()) && (() => {
							const e = document.querySelector("head>style[data-ui5-font-face]");
							void 0 === c && (c = (0, s.d$)()), !c || e || (0, i.g5)("data-ui5-font-face") || (0, i._r)(n, "data-ui5-font-face")
						})(), (0, i.g5)("data-ui5-font-face-override") || (0, i._r)(_, "data-ui5-font-face-override")
					},
					u = {
						packageName: "@ui5/webcomponents-base",
						fileName: "SystemCSSVars.css",
						content: ":root{--_ui5_content_density:cozy}.sapUiSizeCompact,.ui5-content-density-compact,[data-ui5-compact-size]{--_ui5_content_density:compact}"
					};
				var d = r(4825),
					p = r(3941),
					h = r(3472),
					v = r(6585),
					f = r(5587);
				let m = !1;
				let g, b = !1;
				const y = new o.A,
					C = async () => (void 0 !== g || (g = new Promise((async e => {
						if ((0, h.je)(), typeof document > "u") return void e();
						(0, v.h)(w);
						const t = (0, a.x$)("OpenUI5Support"),
							r = !!t && t.isOpenUI5Detected(),
							o = (0, a.x$)("F6Navigation");
						t && await t.init(), o && !r && o.init(), await new Promise((e => {
							document.body ? e() : document.addEventListener("DOMContentLoaded", (() => {
								e()
							}))
						})), await (0, p.A)((0, d.O4)()), t && t.attachListeners(), l(), (0, i.g5)("data-ui5-system-css-vars") || (0, i._r)(u, "data-ui5-system-css-vars"), (0, f.nr)() && (0, f.un)() && !m && (document.body.addEventListener("touchstart", (() => {})), m = !0), e(), b = !0, y.fireEvent("boot")
					}))), g), w = e => {
						b && e === (0, d.O4)() && (0, p.A)((0, d.O4)())
					}
			},
			3124: (e, t, r) => {
				"use strict";
				r.d(t, {
					D8: () => l,
					FN: () => u,
					J4: () => d,
					KI: () => c
				});
				var o = r(5314),
					i = r(3472);
				const a = (0, o.A)("Tags", new Map),
					n = new Set;
				let _, s = new Map;
				const c = e => {
						n.add(e), a.set(e, (0, i._w)())
					},
					l = e => n.has(e),
					u = () => [...n.values()],
					d = e => {
						let t = a.get(e);
						void 0 === t && (t = -1), s.has(t) || s.set(t, new Set), s.get(t).add(e), _ || (_ = setTimeout((() => {
							p(), s = new Map, _ = void 0
						}), 1e3))
					},
					p = () => {
						const e = (0, i.J1)(),
							t = (0, i._w)(),
							r = e[t];
						let o = "Multiple UI5 Web Components instances detected.";
						e.length > 1 && (o = `${o}\nLoading order (versions before 1.1.0 not listed): ${e.map((e=>`\n${e.description}`)).join("")}`), [...s.keys()].forEach((a => {
							let n, _, c; - 1 === a ? (n = 1, _ = {
								description: "Older unknown runtime"
							}) : (n = (0, i.Dz)(t, a), _ = e[a]), c = n > 0 ? "an older" : n < 0 ? "a newer" : "the same", o = `${o}\n\n"${r.description}" failed to define ${s.get(a).size} tag(s) as they were defined by a runtime of ${c} version "${_.description}": ${[...s.get(a)].sort().join(", ")}.`, o = n > 0 ? `${o}\nWARNING! If your code uses features of the above web components, unavailable in ${_.description}, it might not work as expected!` : `${o}\nSince the above web components were defined by the same or newer version runtime, they should be compatible with your code.`
						})), o = `${o}\n\nTo prevent other runtimes from defining tags that you use, consider using scoping or have third-party libraries use scoping: https://github.com/SAP/ui5-webcomponents/blob/main/docs/2-advanced/03-scoping.md.`, console.warn(o)
					}
			},
			3290: (e, t, r) => {
				"use strict";
				r.d(t, {
					$4: () => s,
					LI: () => n,
					RF: () => _,
					rD: () => a
				}), r(7987);
				let o = {
					include: [/^ui5-/],
					exclude: []
				};
				const i = new Map,
					a = () => {},
					n = () => o,
					_ = e => {
						if (!i.has(e)) {
							const t = o.include.some((t => e.match(t))) && !o.exclude.some((t => e.match(t)));
							i.set(e, t)
						}
						return i.get(e)
					},
					s = e => {
						if (_(e)) return a()
					}
			},
			5587: (e, t, r) => {
				"use strict";
				r.d(t, {
					gm: () => u,
					nr: () => l,
					un: () => p,
					xl: () => d
				});
				const o = typeof document > "u",
					i = {
						get userAgent() {
							return o ? "" : navigator.userAgent
						},
						get touch() {
							return !o && ("ontouchstart" in window || navigator.maxTouchPoints > 0)
						},
						get chrome() {
							return !o && /(Chrome|CriOS)/.test(i.userAgent)
						},
						get firefox() {
							return !o && /Firefox/.test(i.userAgent)
						},
						get safari() {
							return !o && !i.chrome && /(Version|PhantomJS)\/(\d+\.\d+).*Safari/.test(i.userAgent)
						},
						get webkit() {
							return !o && /webkit/.test(i.userAgent)
						},
						get windows() {
							return !o && -1 !== navigator.platform.indexOf("Win")
						},
						get macOS() {
							return !o && !!navigator.userAgent.match(/Macintosh|Mac OS X/i)
						},
						get iOS() {
							return !(o || !navigator.platform.match(/iPhone|iPad|iPod/) && (!i.userAgent.match(/Mac/) || !("ontouchend" in document)))
						},
						get android() {
							return !o && !i.windows && /Android/.test(i.userAgent)
						},
						get androidPhone() {
							return !o && i.android && /(?=android)(?=.*mobile)/i.test(i.userAgent)
						},
						get ipad() {
							return !o && (/ipad/i.test(i.userAgent) || /Macintosh/i.test(i.userAgent) && "ontouchend" in document)
						},
						_isPhone: () => (c(), i.touch && !_)
					};
				let a, n, _;
				const s = () => {
						if (o || !i.windows) return !1;
						if (void 0 === a) {
							const e = i.userAgent.match(/Windows NT (\d+).(\d)/);
							a = e ? parseFloat(e[1]) : 0
						}
						return a >= 8
					},
					c = () => {
						if (o) return !1;
						if (void 0 === _) {
							if (i.ipad) return void(_ = !0);
							if (i.touch) {
								if (s()) return void(_ = !0);
								if (i.chrome && i.android) return void(_ = !/Mobile Safari\/[.0-9]+/.test(i.userAgent));
								let e = window.devicePixelRatio ? window.devicePixelRatio : 1;
								return i.android && (() => {
									if (o || !i.webkit) return !1;
									if (void 0 === n) {
										const e = i.userAgent.match(/(webkit)[ /]([\w.]+)/);
										n = e ? parseFloat(e[1]) : 0
									}
									return n >= 537.1
								})() && (e = 1), void(_ = Math.min(window.screen.width / e, window.screen.height / e) >= 600)
							}
							_ = -1 !== i.userAgent.indexOf("Touch") || i.android && !i.androidPhone
						}
					},
					l = () => i.safari,
					u = () => i.firefox,
					d = () => !o && (c(), !((i.touch || s()) && _ || i._isPhone()) || s()),
					p = () => i.iOS
			},
			7064: (e, t, r) => {
				"use strict";
				r.d(t, {
					A: () => o
				});
				const o = class {
					constructor() {
						this._eventRegistry = new Map
					}
					attachEvent(e, t) {
						const r = this._eventRegistry,
							o = r.get(e);
						Array.isArray(o) ? o.includes(t) || o.push(t) : r.set(e, [t])
					}
					detachEvent(e, t) {
						const r = this._eventRegistry,
							o = r.get(e);
						if (!o) return;
						const i = o.indexOf(t); - 1 !== i && o.splice(i, 1), 0 === o.length && r.delete(e)
					}
					fireEvent(e, t) {
						const r = this._eventRegistry.get(e);
						return r ? r.map((e => e.call(this, t))) : []
					}
					fireEventAsync(e, t) {
						return Promise.all(this.fireEvent(e, t))
					}
					isHandlerAttached(e, t) {
						const r = this._eventRegistry.get(e);
						return !!r && r.includes(t)
					}
					hasListeners(e) {
						return !!this._eventRegistry.get(e)
					}
				}
			},
			3889: (e, t, r) => {
				"use strict";
				r.d(t, {
					OE: () => c,
					_0: () => l,
					x$: () => s
				});
				var o = r(7064);
				const i = new Map,
					a = new Map,
					n = new Map,
					_ = new o.A,
					s = e => i.get(e),
					c = e => a.get(e),
					l = (e, t, r) => {
						const o = n.get(t);
						o?.includes(e) || (o ? o.push(e) : n.set(t, [e]), _.attachEvent((e => `componentFeatureLoad_${e}`)(e), r))
					}
			},
			1542: (e, t, r) => {
				"use strict";
				r.d(t, {
					d$: () => b,
					$n: () => y,
					mE: () => m,
					Z0: () => f,
					uf: () => g,
					O4: () => h,
					SU: () => v
				});
				var o, i = r(3084),
					a = r(3889),
					n = r(9439),
					_ = r(490),
					s = ((o = s || {}).Full = "full", o.Basic = "basic", o.Minimal = "minimal", o.None = "none", o);
				const c = s;
				var l = r(9887),
					u = r(2234);
				let d = !1,
					p = {
						animationMode: c.Full,
						theme: n.SS,
						themeRoot: void 0,
						rtl: void 0,
						language: void 0,
						timezone: void 0,
						calendarType: void 0,
						secondaryCalendarType: void 0,
						noConflict: !1,
						formatSettings: {},
						fetchDefaultLanguage: !1,
						defaultFontLoading: !0,
						enableDefaultTooltips: !0
					};
				const h = () => (x(), p.theme),
					v = () => (x(), p.themeRoot),
					f = () => (x(), p.language),
					m = () => (x(), p.fetchDefaultLanguage),
					g = () => (x(), p.noConflict),
					b = () => (x(), p.defaultFontLoading),
					y = () => (x(), p.enableDefaultTooltips),
					C = new Map;
				C.set("true", !0), C.set("false", !1);
				const w = (e, t, r) => {
						const o = t.toLowerCase(),
							i = e.split(`${r}-`)[1];
						C.has(t) && (t = C.get(o)), "theme" === i ? (p.theme = ((e, t) => "theme" === e && t.includes("@") ? t.split("@")[0] : t)(i, t), t && t.includes("@") && (p.themeRoot = (e => {
							const t = e.split("@")[1];
							return (0, _.A)(t)
						})(t))) : p[i] = t
					},
					x = () => {
						typeof document > "u" || d || (k(), d = !0)
					},
					k = e => {
						e && (0, l.k)(), (() => {
							const e = document.querySelector("[data-ui5-config]") || document.querySelector("[data-id='sap-ui-config']");
							let t;
							if (e) {
								try {
									t = JSON.parse(e.innerHTML)
								} catch {
									console.warn("Incorrect data-sap-ui-config format. Please use JSON")
								}
								t && (p = (0, i.A)(p, t))
							}
						})(), (() => {
							const e = new URLSearchParams((0, u.iA)());
							e.forEach(((e, t) => {
								const r = t.split("sap-").length;
								0 === r || r === t.split("sap-ui-").length || w(t, e, "sap")
							})), e.forEach(((e, t) => {
								t.startsWith("sap-ui") && w(t, e, "sap-ui")
							}))
						})(), (() => {
							const e = (0, a.x$)("OpenUI5Support");
							if (!e || !e.isOpenUI5Detected()) return;
							const t = e.getConfigurationSettingsObject();
							p = (0, i.A)(p, t)
						})()
					}
			},
			9897: (e, t, r) => {
				"use strict";
				r.d(t, {
					BF: () => a,
					FG: () => _,
					KL: () => d,
					OC: () => n,
					Pj: () => c,
					RI: () => o,
					Tu: () => m,
					bR: () => h,
					ie: () => s,
					oY: () => f,
					qN: () => l,
					uV: () => u,
					vQ: () => v,
					xC: () => i,
					zP: () => p
				});
				const o = e => (e.key ? "Enter" === e.key : 13 === e.keyCode) && !g(e),
					i = e => (e.key ? "Spacebar" === e.key || " " === e.key : 32 === e.keyCode) && !g(e),
					a = e => (e.key ? "Spacebar" === e.key || " " === e.key : 32 === e.keyCode) && y(e, !1, !1, !0),
					n = e => (e.key ? "ArrowLeft" === e.key || "Left" === e.key : 37 === e.keyCode) && !g(e),
					_ = e => (e.key ? "ArrowRight" === e.key || "Right" === e.key : 39 === e.keyCode) && !g(e),
					s = e => (e.key ? "ArrowUp" === e.key || "Up" === e.key : 38 === e.keyCode) && !g(e),
					c = e => (e.key ? "ArrowDown" === e.key || "Down" === e.key : 40 === e.keyCode) && !g(e),
					l = e => (e.key ? "Home" === e.key : 36 === e.keyCode) && !g(e),
					u = e => (e.key ? "End" === e.key : 35 === e.keyCode) && !g(e),
					d = e => (e.key ? "Escape" === e.key || "Esc" === e.key : 27 === e.keyCode) && !g(e),
					p = e => (e.key ? "Tab" === e.key : 9 === e.keyCode) && !g(e),
					h = e => (e.key ? "Tab" === e.key : 9 === e.keyCode) && y(e, !1, !1, !0),
					v = e => (e.key ? "PageUp" === e.key : 33 === e.keyCode) && !g(e),
					f = e => (e.key ? "PageDown" === e.key : 34 === e.keyCode) && !g(e),
					m = e => "Shift" === e.key || 16 === e.keyCode,
					g = e => e.shiftKey || e.altKey || b(e),
					b = e => !(!e.metaKey && !e.ctrlKey),
					y = (e, t, r, o) => e.shiftKey === o && e.altKey === r && b(e) === t
			},
			2234: (e, t, r) => {
				"use strict";
				r.d(t, {
					$N: () => s,
					VQ: () => a,
					iA: () => c,
					iw: () => _,
					lj: () => n
				});
				const o = typeof document > "u",
					i = () => o ? "" : window.location.search,
					a = () => o ? "" : window.location.hostname,
					n = () => o ? "" : window.location.port,
					_ = () => o ? "" : window.location.protocol,
					s = () => o ? "" : window.location.href,
					c = () => i()
			},
			5602: (e, t, r) => {
				"use strict";
				r.d(t, {
					E6: () => c,
					Zq: () => l,
					_r: () => n,
					eP: () => s,
					g5: () => _
				});
				var o = r(3472);
				const i = typeof document > "u",
					a = (e, t) => t ? `${e}|${t}` : e,
					n = (e, t, r = "", i) => {
						const n = "string" == typeof e ? e : e.content,
							_ = (0, o._w)(),
							s = new CSSStyleSheet;
						s.replaceSync(n), s._ui5StyleId = a(t, r), i && (s._ui5RuntimeIndex = _, s._ui5Theme = i), document.adoptedStyleSheets = [...document.adoptedStyleSheets, s]
					},
					_ = (e, t = "") => !!i || !!document.adoptedStyleSheets.find((r => r._ui5StyleId === a(e, t))),
					s = (e, t = "") => {
						document.adoptedStyleSheets = document.adoptedStyleSheets.filter((r => r._ui5StyleId !== a(e, t)))
					},
					c = (e, t, r = "", i) => {
						_(t, r) ? ((e, t, r = "", i) => {
							const n = "string" == typeof e ? e : e.content,
								_ = (0, o._w)(),
								s = document.adoptedStyleSheets.find((e => e._ui5StyleId === a(t, r)));
							if (s)
								if (i) {
									const e = s._ui5RuntimeIndex;
									(s._ui5Theme !== i || (e => void 0 === e || 1 === (0, o.Dz)((0, o._w)(), parseInt(e)))(e)) && (s.replaceSync(n || ""), s._ui5RuntimeIndex = String(_), s._ui5Theme = i)
								} else s.replaceSync(n || "")
						})(e, t, r, i) : n(e, t, r, i)
					},
					l = (e, t) => {
						if (void 0 === e) return t;
						if (void 0 === t) return e;
						const r = "string" == typeof t ? t : t.content;
						return "string" == typeof e ? `${e} ${r}` : {
							content: `${e.content} ${r}`,
							packageName: e.packageName,
							fileName: e.fileName
						}
					}
			},
			4576: (e, t, r) => {
				"use strict";
				r.d(t, {
					zo: () => v,
					xm: () => g,
					oK: () => p,
					fz: () => h
				});
				var o = r(7064);
				var i = r(3124),
					a = r(5009);
				const n = new Set,
					_ = new o.A,
					s = new class {
						constructor() {
							this.list = [], this.lookup = new Set
						}
						add(e) {
							this.lookup.has(e) || (this.list.push(e), this.lookup.add(e))
						}
						remove(e) {
							this.lookup.has(e) && (this.list = this.list.filter((t => t !== e)), this.lookup.delete(e))
						}
						shift() {
							const e = this.list.shift();
							if (e) return this.lookup.delete(e), e
						}
						isEmpty() {
							return 0 === this.list.length
						}
						isAdded(e) {
							return this.lookup.has(e)
						}
						process(e) {
							let t;
							const r = new Map;
							for (t = this.shift(); t;) {
								const o = r.get(t) || 0;
								if (o > 10) throw new Error("Web component processed too many times this task, max allowed is: 10");
								e(t), r.set(t, o + 1), t = this.shift()
							}
						}
					};
				let c, l, u, d;
				const p = async e => {
					s.add(e), await f()
				}, h = e => {
					_.fireEvent("beforeComponentRender", e), n.add(e), e._render()
				}, v = e => {
					s.remove(e), n.delete(e)
				}, f = async () => {
					d || (d = new Promise((e => {
						window.requestAnimationFrame((() => {
							s.process(h), d = null, e(), u || (u = setTimeout((() => {
								u = void 0, s.isEmpty() && m()
							}), 200))
						}))
					}))), await d
				}, m = () => {
					s.isEmpty() && l && (l(), l = void 0, c = void 0)
				}, g = async e => {
					n.forEach((t => {
						const r = t.constructor,
							o = r.getMetadata().getTag(),
							i = (0, a.J)(r),
							n = r.getMetadata().isLanguageAware(),
							_ = r.getMetadata().isThemeAware();
						(!e || e.tag === o || e.rtlAware && i || e.languageAware && n || e.themeAware && _) && p(t)
					})), await (async () => {
						await (() => {
							const e = (0, i.FN)().map((e => customElements.whenDefined(e)));
							return Promise.all(e)
						})(), await (c || (c = new Promise((e => {
							l = e, window.requestAnimationFrame((() => {
								s.isEmpty() && (c = void 0, e())
							}))
						})), c))
					})()
				}
			},
			3472: (e, t, r) => {
				"use strict";
				r.d(t, {
					Dz: () => d,
					J1: () => p,
					_w: () => u,
					je: () => l
				});
				var o = r(3124),
					i = r(3290),
					a = r(7987),
					n = r(5314);
				let _;
				const s = new Map,
					c = (0, n.A)("Runtimes", []),
					l = () => {
						if (void 0 === _) {
							_ = c.length;
							const e = a.A;
							c.push({
								...e,
								get scopingSuffix() {
									return (0, i.rD)()
								},
								get registeredTags() {
									return (0, o.FN)()
								},
								get scopingRules() {
									return (0, i.LI)()
								},
								alias: "",
								description: `Runtime ${_} - ver ${e.version}`
							})
						}
					},
					u = () => _,
					d = (e, t) => {
						const r = `${e},${t}`;
						if (s.has(r)) return s.get(r);
						const o = c[e],
							i = c[t];
						if (!o || !i) throw new Error("Invalid runtime index supplied");
						if (o.isNext || i.isNext) return o.buildTime - i.buildTime;
						const a = o.major - i.major;
						if (a) return a;
						const n = o.minor - i.minor;
						if (n) return n;
						const _ = o.patch - i.patch;
						if (_) return _;
						const l = new Intl.Collator(void 0, {
							numeric: !0,
							sensitivity: "base"
						}).compare(o.suffix, i.suffix);
						return s.set(r, l), l
					},
					p = () => c
			},
			5161: (e, t, r) => {
				"use strict";
				r.d(t, {
					A: () => _e,
					W: () => ne
				});
				var o = r(3084),
					i = r(6601);
				const a = new Map,
					n = new Map,
					_ = new Map,
					s = e => {
						if (!a.has(e)) {
							const t = l(e.split("-"));
							a.set(e, t)
						}
						return a.get(e)
					},
					c = e => {
						if (!n.has(e)) {
							const t = e.replace(/([a-z])([A-Z])/g, "$1-$2").toLowerCase();
							n.set(e, t)
						}
						return n.get(e)
					},
					l = e => e.map(((e, t) => 0 === t ? e.toLowerCase() : e.charAt(0).toUpperCase() + e.slice(1).toLowerCase())).join(""),
					u = e => {
						const t = _.get(e);
						if (t) return t;
						const r = s(e),
							o = r.charAt(0).toUpperCase() + r.slice(1);
						return _.set(e, o), o
					},
					d = e => e instanceof HTMLSlotElement ? e.assignedNodes({
						flatten: !0
					}).filter((e => e instanceof HTMLElement)) : [e],
					p = e => e.reduce(((e, t) => e.concat(d(t))), []);
				var h = r(3290);
				const v = class {
					constructor(e) {
						this.metadata = e
					}
					getInitialState() {
						if (Object.prototype.hasOwnProperty.call(this, "_initialState")) return this._initialState;
						const e = {};
						if (this.slotsAreManaged()) {
							const t = this.getSlots();
							for (const [r, o] of Object.entries(t)) {
								const t = o.propertyName || r;
								e[t] = [], e[s(t)] = e[t]
							}
						}
						return this._initialState = e, e
					}
					static validateSlotValue(e, t) {
						return ((e, t) => (e && d(e).forEach((e => {
							if (!(e instanceof t.type)) throw new Error(`The element is not of type ${t.type.toString()}`)
						})), e))(e, t)
					}
					getPureTag() {
						return this.metadata.tag || ""
					}
					getFeatures() {
						return this.metadata.features || []
					}
					getTag() {
						const e = this.metadata.tag;
						if (!e) return "";
						const t = (0, h.$4)(e);
						return t ? `${e}-${t}` : e
					}
					hasAttribute(e) {
						const t = this.getProperties()[e];
						return t.type !== Object && t.type !== Array && !t.noAttribute
					}
					getPropertiesList() {
						return Object.keys(this.getProperties())
					}
					getAttributesList() {
						return this.getPropertiesList().filter(this.hasAttribute.bind(this)).map(c)
					}
					canSlotText() {
						return this.getSlots().default?.type === Node
					}
					hasSlots() {
						return !!Object.entries(this.getSlots()).length
					}
					hasIndividualSlots() {
						return this.slotsAreManaged() && Object.values(this.getSlots()).some((e => e.individualSlots))
					}
					slotsAreManaged() {
						return !!this.metadata.managedSlots
					}
					supportsF6FastNavigation() {
						return !!this.metadata.fastNavigation
					}
					getProperties() {
						return this.metadata.properties || (this.metadata.properties = {}), this.metadata.properties
					}
					getEvents() {
						return this.metadata.events || (this.metadata.events = {}), this.metadata.events
					}
					getSlots() {
						return this.metadata.slots || (this.metadata.slots = {}), this.metadata.slots
					}
					isLanguageAware() {
						return !!this.metadata.languageAware
					}
					isThemeAware() {
						return !!this.metadata.themeAware
					}
					needsCLDR() {
						return !!this.metadata.cldr
					}
					getShadowRootOptions() {
						return this.metadata.shadowRootOptions || {}
					}
					isFormAssociated() {
						return !!this.metadata.formAssociated
					}
					shouldInvalidateOnChildChange(e, t, r) {
						const o = this.getSlots()[e].invalidateOnChildChange;
						if (void 0 === o) return !1;
						if ("boolean" == typeof o) return o;
						if ("object" == typeof o) {
							if ("property" === t) {
								if (void 0 === o.properties) return !1;
								if ("boolean" == typeof o.properties) return o.properties;
								if (Array.isArray(o.properties)) return o.properties.includes(r);
								throw new Error("Wrong format for invalidateOnChildChange.properties: boolean or array is expected")
							}
							if ("slot" === t) {
								if (void 0 === o.slots) return !1;
								if ("boolean" == typeof o.slots) return o.slots;
								if (Array.isArray(o.slots)) return o.slots.includes(r);
								throw new Error("Wrong format for invalidateOnChildChange.slots: boolean or array is expected")
							}
						}
						throw new Error("Wrong format for invalidateOnChildChange: boolean or object is expected")
					}
					getI18n() {
						return this.metadata.i18n || (this.metadata.i18n = {}), this.metadata.i18n
					}
				};
				var f = r(7064),
					m = r(4576),
					g = r(5314);
				const b = e => {
					(0, g.A)("CustomStyle.eventProvider", new f.A).attachEvent("CustomCSSChange", e)
				};
				b((e => {
					(0, m.xm)({
						tag: e
					})
				}));
				const y = e => Array.isArray(e) ? e.filter((e => !!e)).flat(10).map((e => "string" == typeof e ? e : e.content)).join(" ") : "string" == typeof e ? e : e.content;
				var C = r(3889);
				const w = new Map;
				b((e => {
					w.delete(`${e}_normal`)
				}));
				const x = e => {
						const t = e.getMetadata().getTag(),
							r = `${t}_normal`,
							o = (0, C.x$)("OpenUI5Enablement");
						if (!w.has(r)) {
							let i = "";
							o && (i = y(o.getBusyIndicatorStyles()));
							const a = (e => {
									const t = (0, g.A)("CustomStyle.customCSSFor", {});
									return t[e] ? t[e].join("") : ""
								})(t) || "",
								n = `${y(e.styles)} ${a} ${i}`;
							w.set(r, n)
						}
						return w.get(r)
					},
					k = new Map;
				b((e => {
					k.delete(`${e}_normal`)
				}));
				const S = e => {
						const t = e.constructor,
							r = e.shadowRoot,
							o = e.render();
						r ? (r.adoptedStyleSheets = (e => {
							const t = `${e.getMetadata().getTag()}_normal`;
							if (!k.has(t)) {
								const r = x(e),
									o = new CSSStyleSheet;
								o.replaceSync(r), k.set(t, [o])
							}
							return k.get(t)
						})(t), t.renderer(o, r, {
							host: e
						})) : console.warn("There is no shadow root to update")
					},
					B = [];
				var A = r(3124);
				const T = new WeakMap;
				var I = r(1542),
					q = r(9887);
				const L = ["value-changed", "click"];
				let E;
				(0, q.R)((() => {
					E = void 0
				}));
				const P = () => (void 0 === E && (E = (0, I.uf)()), E),
					z = ["disabled", "title", "hidden", "role", "draggable"],
					F = e => !(!z.includes(e) && !e.startsWith("aria") && [HTMLElement, Element, Node].some((t => t.prototype.hasOwnProperty(e)))),
					H = (e, t) => {
						if (e.length !== t.length) return !1;
						for (let r = 0; r < e.length; r++)
							if (e[r] !== t[r]) return !1;
						return !0
					};
				var M = r(5009),
					N = r(9212),
					$ = r(5475),
					R = r(4303),
					O = r(5512),
					j = r(9774),
					D = r(9439);
				const U = new Map,
					G = new Map,
					W = new Map,
					J = new Set;
				let V = !1;
				const X = {
						iw: "he",
						ji: "yi",
						in: "id"
					},
					Y = e => {
						V || (console.warn(`[LocaleData] Supported locale "${e}" not configured, import the "Assets.js" module from the webcomponents package you are using.`), V = !0)
					},
					Z = (e, t) => {
						U.set(e, t)
					},
					K = async (e, t, r) => {
						const o = ((e, t, r) => {
								"no" === (e = e && X[e] || e) && (e = "nb"), "zh" === e && !t && ("Hans" === r ? t = "CN" : "Hant" === r && (t = "TW")), ("sh" === e || "sr" === e && "Latn" === r) && (e = "sr", t = "Latn");
								let o = `${e}_${t}`;
								return D.dI.includes(o) ? G.has(o) ? o : (Y(o), D.Xn) : (o = e, D.dI.includes(o) ? G.has(o) ? o : (Y(o), D.Xn) : D.Xn)
							})(e, t, r),
							i = (0, C.x$)("OpenUI5Support");
						if (i) {
							const e = i.getLocaleDataObject();
							if (e) return void Z(o, e)
						}
						try {
							const e = await (e => {
								if (!W.get(e)) {
									const t = G.get(e);
									if (!t) throw new Error(`CLDR data for locale ${e} is not loaded!`);
									W.set(e, t(e))
								}
								return W.get(e)
							})(o);
							Z(o, e)
						} catch (e) {
							const t = e;
							J.has(t.message) || (J.add(t.message), console.error(t.message))
						}
					};
				G.set("en", (async () => (await fetch("https://sdk.openui5.org/1.120.17/resources/sap/ui/core/cldr/en.json")).json())), (0, O._F)((() => {
					const e = (0, j.A)();
					return K(e.getLanguage(), e.getRegion(), e.getScript())
				}));
				let Q = 0;
				const ee = new Map,
					te = new Map,
					re = {
						fromAttribute: (e, t) => t === Boolean ? null !== e : t === Number ? null === e ? void 0 : parseFloat(e) : e,
						toAttribute: (e, t) => t === Boolean ? e ? "" : null : t === Object || t === Array || null == e ? null : String(e)
					};

				function oe(e) {
					this._suppressInvalidation || (this.onInvalidation(e), this._changedState.push(e), (0, m.oK)(this), this._invalidationEventProvider.fireEvent("invalidate", {
						...e,
						target: this
					}))
				}

				function ie(e, t) {
					do {
						const r = Object.getOwnPropertyDescriptor(e, t);
						if (r) return r;
						e = Object.getPrototypeOf(e)
					} while (e && e !== HTMLElement.prototype)
				}
				class ae extends HTMLElement {
					constructor() {
						super(), this._rendered = !1;
						const e = this.constructor;
						let t;
						this._changedState = [], this._suppressInvalidation = !0, this._inDOM = !1, this._fullyConnected = !1, this._childChangeListeners = new Map, this._slotChangeListeners = new Map, this._invalidationEventProvider = new f.A, this._componentStateFinalizedEventProvider = new f.A, this._domRefReadyPromise = new Promise((e => {
							t = e
						})), this._domRefReadyPromise._deferredResolve = t, this._doNotSyncAttributes = new Set, this._slotsAssignedNodes = new WeakMap, this._state = {
							...e.getMetadata().getInitialState()
						}, this.initializedProperties = new Map, this.constructor.getMetadata().getPropertiesList().forEach((e => {
							if (this.hasOwnProperty(e)) {
								const t = this[e];
								this.initializedProperties.set(e, t)
							}
						})), this._internals = this.attachInternals(), this._initShadowRoot()
					}
					_initShadowRoot() {
						const e = this.constructor;
						if (e._needsShadowDOM()) {
							const t = {
								mode: "open"
							};
							this.attachShadow({
								...t,
								...e.getMetadata().getShadowRootOptions()
							}), e.getMetadata().slotsAreManaged() && this.shadowRoot.addEventListener("slotchange", this._onShadowRootSlotChange.bind(this))
						}
					}
					_onShadowRootSlotChange(e) {
						e.target?.getRootNode() === this.shadowRoot && this._processChildren()
					}
					get _id() {
						return this.__id || (this.__id = "ui5wc_" + ++Q), this.__id
					}
					render() {
						const e = this.constructor.template;
						return (0, N.A)(e, this)
					}
					async connectedCallback() {
						const e = this.constructor;
						this.setAttribute(e.getMetadata().getPureTag(), ""), e.getMetadata().supportsF6FastNavigation() && this.setAttribute("data-sap-ui-fastnavgroup", "true");
						const t = e.getMetadata().slotsAreManaged();
						this._inDOM = !0, t && (this._startObservingDOMChildren(), await this._processChildren()), this._inDOM && (e.asyncFinished || await e.definePromise, (0, m.fz)(this), this._domRefReadyPromise._deferredResolve(), this._fullyConnected = !0, this.onEnterDOM())
					}
					disconnectedCallback() {
						const e = this.constructor.getMetadata().slotsAreManaged();
						this._inDOM = !1, e && this._stopObservingDOMChildren(), this._fullyConnected && (this.onExitDOM(), this._fullyConnected = !1), this._domRefReadyPromise._deferredResolve(), (0, m.zo)(this)
					}
					onBeforeRendering() {}
					onAfterRendering() {}
					onEnterDOM() {}
					onExitDOM() {}
					_startObservingDOMChildren() {
						const e = this.constructor.getMetadata();
						if (!e.hasSlots()) return;
						const t = e.canSlotText(),
							r = {
								childList: !0,
								subtree: t,
								characterData: t
							};
						((e, t, r) => {
							const o = new MutationObserver(t);
							T.set(e, o), o.observe(e, r)
						})(this, this._processChildren.bind(this), r)
					}
					_stopObservingDOMChildren() {
						(e => {
							const t = T.get(e);
							t && (t.disconnect(), T.delete(e))
						})(this)
					}
					async _processChildren() {
						this.constructor.getMetadata().hasSlots() && await this._updateSlots()
					}
					async _updateSlots() {
						const e = this.constructor,
							t = e.getMetadata().getSlots(),
							r = e.getMetadata().canSlotText(),
							o = Array.from(r ? this.childNodes : this.children),
							i = new Map,
							a = new Map;
						for (const [e, r] of Object.entries(t)) {
							const t = r.propertyName || e;
							a.set(t, e), i.set(t, [...this._state[t]]), this._clearSlot(e, r)
						}
						const n = new Map,
							_ = new Map,
							c = o.map((async (r, o) => {
								const i = (e => {
										if (!(e instanceof HTMLElement)) return "default";
										const t = e.getAttribute("slot");
										if (t) {
											const e = t.match(/^(.+?)-\d+$/);
											return e ? e[1] : t
										}
										return "default"
									})(r),
									a = t[i];
								if (void 0 === a) {
									if ("default" !== i) {
										const e = Object.keys(t).join(", ");
										console.warn(`Unknown slotName: ${i}, ignoring`, r, `Valid values are: ${e}`)
									}
									return
								}
								if (a.individualSlots) {
									const e = (n.get(i) || 0) + 1;
									n.set(i, e), r._individualSlot = `${i}-${e}`
								}
								if (r instanceof HTMLElement) {
									const e = r.localName;
									if (e.includes("-") && !(e => B.some((t => e.startsWith(t))))(e)) {
										if (!customElements.get(e)) {
											const t = customElements.whenDefined(e);
											let r = ee.get(e);
											r || (r = new Promise((e => setTimeout(e, 1e3))), ee.set(e, r)), await Promise.race([t, r])
										}
										customElements.upgrade(r)
									}
								}
								if (r = e.getMetadata().constructor.validateSlotValue(r, a), ne(r) && a.invalidateOnChildChange) {
									const e = this._getChildChangeListener(i);
									r.attachInvalidate.call(r, e)
								}
								r instanceof HTMLSlotElement && this._attachSlotChange(r, i, !!a.invalidateOnChildChange);
								const s = a.propertyName || i;
								_.has(s) ? _.get(s).push({
									child: r,
									idx: o
								}) : _.set(s, [{
									child: r,
									idx: o
								}])
							}));
						await Promise.all(c), _.forEach(((e, t) => {
							this._state[t] = e.sort(((e, t) => e.idx - t.idx)).map((e => e.child)), this._state[s(t)] = this._state[t]
						}));
						let l = !1;
						for (const [r, o] of Object.entries(t)) {
							const t = o.propertyName || r;
							H(i.get(t), this._state[t]) || (oe.call(this, {
								type: "slot",
								name: a.get(t),
								reason: "children"
							}), l = !0, e.getMetadata().isFormAssociated() && (0, $.ok)(this))
						}
						l || oe.call(this, {
							type: "slot",
							name: "default",
							reason: "textcontent"
						})
					}
					_clearSlot(e, t) {
						const r = t.propertyName || e;
						this._state[r].forEach((t => {
							if (ne(t)) {
								const r = this._getChildChangeListener(e);
								t.detachInvalidate.call(t, r)
							}
							t instanceof HTMLSlotElement && this._detachSlotChange(t, e)
						})), this._state[r] = [], this._state[s(r)] = this._state[r]
					}
					attachInvalidate(e) {
						this._invalidationEventProvider.attachEvent("invalidate", e)
					}
					detachInvalidate(e) {
						this._invalidationEventProvider.detachEvent("invalidate", e)
					}
					_onChildChange(e, t) {
						this.constructor.getMetadata().shouldInvalidateOnChildChange(e, t.type, t.name) && oe.call(this, {
							type: "slot",
							name: e,
							reason: "childchange",
							child: t.target
						})
					}
					attributeChangedCallback(e, t, r) {
						let o;
						if (this._doNotSyncAttributes.has(e)) return;
						const i = this.constructor.getMetadata().getProperties(),
							a = e.replace(/^ui5-/, ""),
							n = s(a);
						if (i.hasOwnProperty(n)) {
							const e = i[n];
							o = (e.converter ?? re).fromAttribute(r, e.type), this[n] = o
						}
					}
					formAssociatedCallback() {
						this.constructor.getMetadata().isFormAssociated() && (0, $.fc)(this)
					}
					static get formAssociated() {
						return this.getMetadata().isFormAssociated()
					}
					_updateAttribute(e, t) {
						const r = this.constructor;
						if (!r.getMetadata().hasAttribute(e)) return;
						const o = r.getMetadata().getProperties()[e],
							i = c(e),
							a = (o.converter || re).toAttribute(t, o.type);
						this._doNotSyncAttributes.add(i), null == a ? this.removeAttribute(i) : this.setAttribute(i, a), this._doNotSyncAttributes.delete(i)
					}
					_getChildChangeListener(e) {
						return this._childChangeListeners.has(e) || this._childChangeListeners.set(e, this._onChildChange.bind(this, e)), this._childChangeListeners.get(e)
					}
					_getSlotChangeListener(e) {
						return this._slotChangeListeners.has(e) || this._slotChangeListeners.set(e, this._onSlotChange.bind(this, e)), this._slotChangeListeners.get(e)
					}
					_attachSlotChange(e, t, r) {
						const o = this._getSlotChangeListener(t);
						e.addEventListener("slotchange", (i => {
							if (o.call(e, i), r) {
								const r = this._slotsAssignedNodes.get(e);
								r && r.forEach((e => {
									if (ne(e)) {
										const r = this._getChildChangeListener(t);
										e.detachInvalidate.call(e, r)
									}
								}));
								const o = p([e]);
								this._slotsAssignedNodes.set(e, o), o.forEach((e => {
									if (ne(e)) {
										const r = this._getChildChangeListener(t);
										e.attachInvalidate.call(e, r)
									}
								}))
							}
						}))
					}
					_detachSlotChange(e, t) {
						e.removeEventListener("slotchange", this._getSlotChangeListener(t))
					}
					_onSlotChange(e) {
						oe.call(this, {
							type: "slot",
							name: e,
							reason: "slotchange"
						})
					}
					onInvalidation(e) {}
					updateAttributes() {
						const e = this.constructor.getMetadata().getProperties();
						for (const [t, r] of Object.entries(e)) this._updateAttribute(t, this[t])
					}
					_render() {
						const e = this.constructor,
							t = e.getMetadata().hasIndividualSlots();
						this.initializedProperties.size > 0 && (Array.from(this.initializedProperties.entries()).forEach((([e, t]) => {
							delete this[e], this[e] = t
						})), this.initializedProperties.clear()), this._suppressInvalidation = !0;
						try {
							this.onBeforeRendering(), this._rendered || this.updateAttributes(), this._componentStateFinalizedEventProvider.fireEvent("componentStateFinalized")
						} finally {
							this._suppressInvalidation = !1
						}
						this._changedState = [], e._needsShadowDOM() && S(this), this._rendered = !0, t && this._assignIndividualSlotsToChildren(), this.onAfterRendering()
					}
					_assignIndividualSlotsToChildren() {
						Array.from(this.children).forEach((e => {
							e._individualSlot && e.setAttribute("slot", e._individualSlot)
						}))
					}
					_waitForDomRef() {
						return this._domRefReadyPromise
					}
					getDomRef() {
						return "function" == typeof this._getRealDomRef ? this._getRealDomRef() : this.shadowRoot && 0 !== this.shadowRoot.children.length ? this.shadowRoot.children[0] : void 0
					}
					getFocusDomRef() {
						const e = this.getDomRef();
						if (e) return e.querySelector("[data-sap-focus-ref]") || e
					}
					async getFocusDomRefAsync() {
						return await this._waitForDomRef(), this.getFocusDomRef()
					}
					async focus(e) {
						await this._waitForDomRef();
						const t = this.getFocusDomRef();
						t === this ? HTMLElement.prototype.focus.call(this, e) : t && "function" == typeof t.focus && t.focus(e)
					}
					fireEvent(e, t, r = !1, o = !0) {
						const i = this._fireEvent(e, t, r, o),
							a = u(e);
						return a !== e ? i && this._fireEvent(a, t, r, o) : i
					}
					fireDecoratorEvent(e, t) {
						const r = this.getEventData(e),
							o = !!r && r.cancelable,
							i = !!r && r.bubbles,
							a = this._fireEvent(e, t, o, i),
							n = u(e);
						return n !== e ? a && this._fireEvent(n, t, o, i) : a
					}
					_fireEvent(e, t, r = !1, o = !0) {
						const i = new CustomEvent(`ui5-${e}`, {
								detail: t,
								composed: !1,
								bubbles: o,
								cancelable: r
							}),
							a = this.dispatchEvent(i);
						if ((e => {
								const t = P();
								return !((e => L.includes(e))(e) || !0 !== t && (e => {
									const t = P();
									return !("boolean" != typeof t && t.events && t.events.includes && t.events.includes(e))
								})(e))
							})(e)) return a;
						const n = new CustomEvent(e, {
							detail: t,
							composed: !1,
							bubbles: o,
							cancelable: r
						});
						return this.dispatchEvent(n) && a
					}
					getEventData(e) {
						return this.constructor.getMetadata().getEvents()[e]
					}
					getSlottedNodes(e) {
						return p(this[e])
					}
					attachComponentStateFinalized(e) {
						this._componentStateFinalizedEventProvider.attachEvent("componentStateFinalized", e)
					}
					detachComponentStateFinalized(e) {
						this._componentStateFinalizedEventProvider.detachEvent("componentStateFinalized", e)
					}
					get effectiveDir() {
						return (0, M.A)(this.constructor), (e => e.matches(":dir(rtl)") ? "rtl" : "ltr")(this)
					}
					get isUI5Element() {
						return !0
					}
					get classes() {
						return {}
					}
					get accessibilityInfo() {
						return {}
					}
					static get observedAttributes() {
						return this.getMetadata().getAttributesList()
					}
					static _needsShadowDOM() {
						return !!this.template || Object.prototype.hasOwnProperty.call(this.prototype, "render")
					}
					static _generateAccessors() {
						const e = this.prototype,
							t = this.getMetadata().slotsAreManaged(),
							r = this.getMetadata().getProperties();
						for (const [t, o] of Object.entries(r)) {
							F(t) || console.warn(`"${t}" is not a valid property name. Use a name that does not collide with DOM APIs`);
							const r = ie(e, t);
							let o, i;
							r?.set && (o = r.set), r?.get && (i = r.get), Object.defineProperty(e, t, {
								get() {
									return i ? i.call(this) : this._state[t]
								},
								set(e) {
									const r = this.constructor,
										a = i ? i.call(this) : this._state[t];
									a !== e && (o ? o.call(this, e) : this._state[t] = e, oe.call(this, {
										type: "property",
										name: t,
										newValue: e,
										oldValue: a
									}), this._rendered && this._updateAttribute(t, e), r.getMetadata().isFormAssociated() && (0, $.ok)(this))
								}
							})
						}
						if (t) {
							const t = this.getMetadata().getSlots();
							for (const [r, o] of Object.entries(t)) {
								F(r) || console.warn(`"${r}" is not a valid property name. Use a name that does not collide with DOM APIs`);
								const t = o.propertyName || r,
									i = {
										get() {
											return void 0 !== this._state[t] ? this._state[t] : []
										},
										set() {
											throw new Error("Cannot set slot content directly, use the DOM APIs (appendChild, removeChild, etc...)")
										}
									};
								Object.defineProperty(e, t, i), t !== s(t) && Object.defineProperty(e, s(t), i)
							}
						}
					}
					static {
						this.metadata = {}
					}
					static {
						this.styles = ""
					}
					static get dependencies() {
						return []
					}
					static cacheUniqueDependencies() {
						const e = this.dependencies.filter(((e, t, r) => r.indexOf(e) === t));
						te.set(this, e)
					}
					static getUniqueDependencies() {
						return te.has(this) || this.cacheUniqueDependencies(), te.get(this) || []
					}
					static async onDefine() {
						return Promise.resolve()
					}
					static fetchI18nBundles() {
						return Promise.all(Object.entries(this.getMetadata().getI18n()).map((e => {
							const {
								bundleName: t
							} = e[1];
							return (0, R.HE)(t)
						})))
					}
					static fetchCLDR() {
						return this.getMetadata().needsCLDR() ? K((0, j.A)().getLanguage(), (0, j.A)().getRegion(), (0, j.A)().getScript()) : Promise.resolve()
					}
					static define() {
						this.definePromise = (async () => {
							await (0, i.zj)();
							const e = await Promise.all([this.fetchI18nBundles(), this.fetchCLDR(), this.onDefine()]),
								[t] = e;
							Object.entries(this.getMetadata().getI18n()).forEach(((e, r) => {
								const o = e[0];
								e[1].target[o] = t[r]
							})), this.asyncFinished = !0
						})();
						const e = this.getMetadata().getTag();
						this.getMetadata().getFeatures().forEach((e => {
							(0, C.OE)(e) && this.cacheUniqueDependencies(), (0, C._0)(e, this, this.cacheUniqueDependencies.bind(this))
						}));
						const t = (0, A.D8)(e),
							r = customElements.get(e);
						return r && !t ? (0, A.J4)(e) : r || (this._generateAccessors(), (0, A.KI)(e), customElements.define(e, this)), this
					}
					static getMetadata() {
						if (this.hasOwnProperty("_metadata")) return this._metadata;
						const e = [this.metadata];
						let t = this;
						for (; t !== ae;) t = Object.getPrototypeOf(t), e.unshift(t.metadata);
						const r = (0, o.A)({}, ...e);
						return this._metadata = new v(r), this._metadata
					}
					get validity() {
						return this._internals.validity
					}
					get validationMessage() {
						return this._internals.validationMessage
					}
					checkValidity() {
						return this._internals.checkValidity()
					}
					reportValidity() {
						return this._internals.reportValidity()
					}
				}
				const ne = e => "isUI5Element" in e,
					_e = ae
			},
			1431: (e, t, r) => {
				"use strict";
				r.d(t, {
					Z5: () => x,
					y3: () => C,
					hu: () => y,
					pU: () => g
				});
				var o = r(5314),
					i = (e => (e["SAP-icons"] = "SAP-icons-v4", e.horizon = "SAP-icons-v5", e["SAP-icons-TNT"] = "tnt", e.BusinessSuiteInAppSymbols = "business-suite", e))(i || {});
				const a = e => i[e] ? i[e] : e;
				var n, _ = r(4825),
					s = ((n = s || {}).SAPIconsV4 = "SAP-icons-v4", n.SAPIconsV5 = "SAP-icons-v5", n.SAPIconsTNTV2 = "tnt-v2", n.SAPIconsTNTV3 = "tnt-v3", n.SAPBSIconsV1 = "business-suite-v1", n.SAPBSIconsV2 = "business-suite-v2", n);
				const c = new Map;
				c.set("SAP-icons", {
					legacy: "SAP-icons-v4",
					sap_horizon: "SAP-icons-v5"
				}), c.set("tnt", {
					legacy: "tnt-v2",
					sap_horizon: "tnt-v3"
				}), c.set("business-suite", {
					legacy: "business-suite-v1",
					sap_horizon: "business-suite-v2"
				});
				const l = new Map,
					u = e => {
						const t = (e => l.get(e))((0, _.O4)());
						return !e && t ? a(t) : (e => {
							const t = (0, _.Z3)() ? "legacy" : "sap_horizon";
							return c.has(e) ? c.get(e)[t] : e
						})(e || "SAP-icons")
					};
				var d = r(4303);
				const p = new Map,
					h = (0, o.A)("SVGIcons.registry", new Map),
					v = (0, o.A)("SVGIcons.promises", new Map),
					f = "ICON_NOT_FOUND",
					m = e => {
						Object.keys(e.data).forEach((t => {
							const r = e.data[t];
							g(t, {
								pathData: r.path || r.paths,
								ltr: r.ltr,
								accData: r.acc,
								collection: e.collection,
								packageName: e.packageName
							})
						}))
					},
					g = (e, t) => {
						const r = `${t.collection}/${e}`;
						h.set(r, {
							pathData: t.pathData,
							ltr: t.ltr,
							accData: t.accData,
							packageName: t.packageName,
							customTemplate: t.customTemplate,
							viewBox: t.viewBox,
							collection: t.collection
						})
					},
					b = e => {
						let t;
						return e.startsWith("sap-icon://") && (e = e.replace("sap-icon://", "")), [e, t] = e.split("/").reverse(), e = e.replace("icon-", ""), t && (t = a(t)), {
							name: e,
							collection: t
						}
					},
					y = e => {
						const {
							name: t,
							collection: r
						} = b(e);
						return w(r, t)
					},
					C = async e => {
						const {
							name: t,
							collection: r
						} = b(e);
						let o = f;
						try {
							o = await (async e => {
								if (!v.has(e)) {
									if (!p.has(e)) throw new Error(`No loader registered for the ${e} icons collection. Probably you forgot to import the "AllIcons.js" module for the respective package.`);
									const t = p.get(e);
									v.set(e, t(e))
								}
								return v.get(e)
							})(u(r))
						} catch (e) {
							console.error(e.message)
						}
						return o === f ? o : w(r, t) || (Array.isArray(o) ? o.forEach((e => {
							m(e), ((e, t) => {
								c.has(e) ? c.set(e, {
									...t,
									...c.get(e)
								}) : c.set(e, t)
							})(r, {
								[e.themeFamily || "legacy"]: e.collection
							})
						})) : m(o), w(r, t))
					}, w = (e, t) => {
						const r = `${u(e)}/${t}`;
						return h.get(r)
					}, x = async e => {
						if (!e) return;
						let t = y(e);
						return t || (t = await C(e)), t && t !== f && t.accData ? (await (0, d.HE)(t.packageName)).getText(t.accData) : void 0
					}
			},
			5578: (e, t, r) => {
				"use strict";
				r.d(t, {
					Rh: () => u,
					gu: () => v,
					tw: () => d,
					w2: () => h
				});
				var o = r(9439),
					i = r(5602),
					a = r(6585);
				const n = new Map,
					_ = new Map,
					s = new Map,
					c = new Set,
					l = new Set,
					u = (e, t, r) => {
						_.set(`${e}/${t}`, r), c.add(e), l.add(t), (0, a.E)(t)
					},
					d = async (e, t, r) => {
						const a = `${e}_${t}_${r||""}`,
							_ = n.get(a);
						if (void 0 !== _) return _;
						if (!l.has(t)) {
							const r = [...l.values()].join(", ");
							return console.warn(`You have requested a non-registered theme ${t} - falling back to ${o.SS}. Registered themes are: ${r}`), p(e, o.SS)
						}
						const [s, c] = await Promise.all([p(e, t), r ? p(e, r, !0) : void 0]), u = (0, i.Zq)(s, c);
						return u && n.set(a, u), u
					}, p = async (e, t, r = !1) => {
						const o = (r ? s : _).get(`${e}/${t}`);
						if (!o) return void(r || console.error(`Theme [${t}] not registered for package [${e}]`));
						let i;
						try {
							i = await o(t)
						} catch (t) {
							return void console.error(e, t.message)
						}
						return i._ || i
					}, h = () => c, v = e => l.has(e)
			},
			9887: (e, t, r) => {
				"use strict";
				r.d(t, {
					R: () => a,
					k: () => n
				});
				const o = new(r(7064).A),
					i = "configurationReset",
					a = e => {
						o.attachEvent(i, e)
					},
					n = () => {
						o.fireEvent(i, void 0)
					}
			},
			3252: (e, t, r) => {
				"use strict";
				r.d(t, {
					Z0: () => n,
					mE: () => _
				});
				var o = r(1542);
				let i, a;
				r(5512), r(4576), r(9439), r(6601), (0, r(9887).R)((() => {
					i = void 0, a = void 0
				}));
				const n = () => (void 0 === i && (i = (0, o.Z0)()), i),
					_ = () => (void 0 === a && (a = (0, o.mE)()), a)
			},
			4825: (e, t, r) => {
				"use strict";
				r.d(t, {
					O4: () => _,
					Z3: () => s
				});
				var o = r(1542),
					i = (r(4576), r(3941), r(2421)),
					a = r(9439);
				let n;
				r(6601), (0, r(9887).R)((() => {
					n = void 0
				}));
				const _ = () => (void 0 === n && (n = (0, o.O4)()), n),
					s = () => {
						const e = _();
						return c(e) ? !e.startsWith("sap_horizon") : !(0, i.A)()?.baseThemeName?.startsWith("sap_horizon")
					},
					c = e => a.QP.includes(e)
			},
			5645: (e, t, r) => {
				"use strict";
				r.d(t, {
					A: () => o
				});
				const o = (e = {}) => t => {
					if (Object.prototype.hasOwnProperty.call(t, "metadata") || (t.metadata = {}), "string" == typeof e) return void(t.metadata.tag = e);
					const {
						tag: r,
						languageAware: o,
						themeAware: i,
						cldr: a,
						fastNavigation: n,
						formAssociated: _,
						shadowRootOptions: s,
						features: c
					} = e;
					t.metadata.tag = r, o && (t.metadata.languageAware = o), a && (t.metadata.cldr = a), c && (t.metadata.features = c), i && (t.metadata.themeAware = i), n && (t.metadata.fastNavigation = n), _ && (t.metadata.formAssociated = _), s && (t.metadata.shadowRootOptions = s), ["renderer", "template", "styles", "dependencies"].forEach((r => {
						e[r] && Object.defineProperty(t, r, {
							get: () => e[r]
						})
					}))
				}
			},
			4456: (e, t, r) => {
				"use strict";
				r.d(t, {
					A: () => o
				});
				const o = (e, t = {}) => r => {
					Object.prototype.hasOwnProperty.call(r, "metadata") || (r.metadata = {});
					const o = r.metadata;
					o.events || (o.events = {});
					const i = o.events;
					i[e] || (t.bubbles = !!t.bubbles, t.cancelable = !!t.cancelable, i[e] = t)
				}
			},
			7798: (e, t, r) => {
				"use strict";
				r.d(t, {
					A: () => o
				});
				const o = e => (t, r) => {
					t.metadata.i18n || (t.metadata.i18n = {}), t.metadata.i18n[r] = {
						bundleName: e,
						target: t
					}
				}
			},
			5683: (e, t, r) => {
				"use strict";
				r.d(t, {
					A: () => o
				});
				const o = e => (t, r) => {
					const o = t.constructor;
					Object.prototype.hasOwnProperty.call(o, "metadata") || (o.metadata = {});
					const i = o.metadata;
					i.properties || (i.properties = {});
					const a = i.properties;
					a[r] || (a[r] = e ?? {})
				}
			},
			1398: (e, t, r) => {
				"use strict";
				r.d(t, {
					A: () => o
				});
				const o = e => (t, r) => {
					const o = t.constructor;
					Object.prototype.hasOwnProperty.call(o, "metadata") || (o.metadata = {});
					const i = o.metadata;
					i.slots || (i.slots = {});
					const a = i.slots;
					if (e && e.default && a.default) throw new Error("Only one slot can be the default slot.");
					const n = e && e.default ? "default" : r;
					(e = e || {
						type: HTMLElement
					}).type || (e.type = HTMLElement), a[n] || (a[n] = e), e.default && (delete a.default.default, a.default.propertyName = r), o.metadata.managedSlots = !0
				}
			},
			5475: (e, t, r) => {
				"use strict";
				r.d(t, {
					E2: () => _,
					fc: () => o,
					ok: () => i,
					rM: () => n
				});
				const o = e => {
						s(e) && i(e)
					},
					i = e => {
						if (e._internals?.form) {
							if (a(e), !e.name) return void e._internals?.setFormValue(null);
							e._internals.setFormValue(e.formFormattedValue)
						}
					},
					a = async e => {
						if (e._internals?.form)
							if (e.formValidity && Object.keys(e.formValidity).some((e => e))) {
								const t = await (e.formElementAnchor?.());
								e._internals.setValidity(e.formValidity, e.formValidityMessage, t)
							} else e._internals.setValidity({})
					}, n = e => {
						e._internals?.form?.requestSubmit()
					}, _ = e => {
						e._internals?.form?.reset()
					}, s = e => "formFormattedValue" in e && "name" in e
			},
			9439: (e, t, r) => {
				"use strict";
				r.d(t, {
					Nm: () => a,
					QP: () => i,
					SS: () => o,
					Xn: () => n,
					dI: () => _
				});
				const o = "sap_horizon",
					i = ["sap_fiori_3", "sap_fiori_3_dark", "sap_fiori_3_hcb", "sap_fiori_3_hcw", "sap_horizon", "sap_horizon_dark", "sap_horizon_hcb", "sap_horizon_hcw", "sap_horizon_exp", "sap_horizon_dark_exp", "sap_horizon_hcb_exp", "sap_horizon_hcw_exp"],
					a = "en",
					n = "en",
					_ = ["ar", "ar_EG", "ar_SA", "bg", "ca", "cnr", "cs", "da", "de", "de_AT", "de_CH", "el", "el_CY", "en", "en_AU", "en_GB", "en_HK", "en_IE", "en_IN", "en_NZ", "en_PG", "en_SG", "en_ZA", "es", "es_AR", "es_BO", "es_CL", "es_CO", "es_MX", "es_PE", "es_UY", "es_VE", "et", "fa", "fi", "fr", "fr_BE", "fr_CA", "fr_CH", "fr_LU", "he", "hi", "hr", "hu", "id", "it", "it_CH", "ja", "kk", "ko", "lt", "lv", "ms", "mk", "nb", "nl", "nl_BE", "pl", "pt", "pt_PT", "ro", "ru", "ru_UA", "sk", "sl", "sr", "sr_Latn", "sv", "th", "tr", "uk", "vi", "zh_CN", "zh_HK", "zh_SG", "zh_TW"]
			},
			7987: (e, t, r) => {
				"use strict";
				r.d(t, {
					A: () => o
				});
				const o = {
					version: "2.4.0",
					major: 2,
					minor: 4,
					patch: 0,
					suffix: "",
					isNext: !1,
					buildTime: 1730643247
				}
			},
			5314: (e, t, r) => {
				"use strict";
				r.d(t, {
					A: () => i
				});
				const o = () => {
						const e = document.createElement("meta");
						return e.setAttribute("name", "ui5-shared-resources"), e.setAttribute("content", ""), e
					},
					i = (e, t) => {
						const r = e.split(".");
						let i = typeof document > "u" ? null : ((e, t = document.body, r) => {
							let o = document.querySelector(e);
							return o || (o = r ? r() : document.createElement(e), t.insertBefore(o, t.firstChild))
						})('meta[name="ui5-shared-resources"]', document.head, o);
						if (!i) return t;
						for (let e = 0; e < r.length; e++) {
							const o = r[e],
								a = e === r.length - 1;
							Object.prototype.hasOwnProperty.call(i, o) || (i[o] = a ? t : {}), i = i[o]
						}
						return i
					}
			},
			4303: (e, t, r) => {
				"use strict";
				r.d(t, {
					HE: () => x
				});
				var o = r(9774),
					i = r(5512),
					a = r(9439);
				const n = /^((?:[A-Z]{2,3}(?:-[A-Z]{3}){0,3})|[A-Z]{4}|[A-Z]{5,8})(?:-([A-Z]{4}))?(?:-([A-Z]{2}|[0-9]{3}))?((?:-[0-9A-Z]{5,8}|-[0-9][0-9A-Z]{3})*)((?:-[0-9A-WYZ](?:-[0-9A-Z]{2,8})+)*)(?:-(X(?:-[0-9A-Z]{1,8})+))?$/i,
					_ = /(?:^|-)(saptrc|sappsd)(?:-|$)/i,
					s = {
						he: "iw",
						yi: "ji",
						nb: "no",
						sr: "sh"
					},
					c = e => {
						if (!e) return a.Xn;
						if ("zh_HK" === e) return "zh_TW";
						const t = e.lastIndexOf("_");
						return t >= 0 ? e.slice(0, t) : e !== a.Xn ? a.Xn : ""
					};
				var l = r(3252);
				const u = new Set,
					d = new Set,
					p = new Map,
					h = new Map,
					v = new Map,
					f = (e, t) => {
						p.set(e, t)
					},
					m = (e, t) => {
						const r = `${e}/${t}`;
						return v.has(r)
					},
					g = (e, t) => t !== a.Nm && !m(e, t),
					b = async e => {
						const t = (0, o.A)().getLanguage(),
							r = (0, o.A)().getRegion(),
							i = (0, o.A)().getVariant();
						let p = t + (r ? `-${r}` : "") + (i ? `-${i}` : "");
						if (g(e, p))
							for (p = (e => {
									let t;
									if (!e) return a.Xn;
									if ("string" == typeof e && (t = n.exec(e.replace(/_/g, "-")))) {
										let e = t[1].toLowerCase(),
											r = t[3] ? t[3].toUpperCase() : void 0;
										const o = t[2] ? t[2].toLowerCase() : void 0,
											i = t[4] ? t[4].slice(1) : void 0,
											a = t[6];
										return e = s[e] || e, a && (t = _.exec(a)) || i && (t = _.exec(i)) ? `en_US_${t[1].toLowerCase()}` : ("zh" === e && !r && ("hans" === o ? r = "CN" : "hant" === o && (r = "TW")), e + (r ? "_" + r + (i ? "_" + i.replace("-", "_") : "") : ""))
									}
									return a.Xn
								})(p); g(e, p);) p = c(p);
						const b = (0, l.mE)();
						if (p !== a.Nm || b)
							if (m(e, p)) try {
								const t = await ((e, t) => {
									const r = `${e}/${t}`,
										o = v.get(r);
									return o && !h.get(r) && h.set(r, o(t)), h.get(r)
								})(e, p);
								f(e, t)
							} catch (e) {
								const t = e;
								d.has(t.message) || (d.add(t.message), console.error(t.message))
							} else(e => {
								u.has(e) || (console.warn(`[${e}]: Message bundle assets are not configured. Falling back to English texts.`, ` Add \`import "${e}/dist/Assets.js"\` in your bundle and make sure your build tool supports dynamic imports and JSON imports. See section "Assets" in the documentation for more information.`), u.add(e))
							})(e);
							else f(e, null)
					};
				(0, i._F)((e => {
					const t = [...p.keys()];
					return Promise.all(t.map(b))
				}));
				const y = /('')|'([^']+(?:''[^']*)*)(?:'|$)|\{([0-9]+(?:\s*,[^{}]*)?)\}|[{}]/g,
					C = new Map;
				class w {
					constructor(e) {
						this.packageName = e
					}
					getText(e, ...t) {
						if ("string" == typeof e && (e = {
								key: e,
								defaultText: e
							}), !e || !e.key) return "";
						const r = (o = this.packageName, p.get(o));
						var o;
						r && !r[e.key] && console.warn(`Key ${e.key} not found in the i18n bundle, the default text will be used`);
						return ((e, t) => (t = t || [], e.replace(y, ((e, r, o, i, a) => {
							if (r) return "'";
							if (o) return o.replace(/''/g, "'");
							if (i) {
								const e = "string" == typeof i ? parseInt(i) : i;
								return String(t[e])
							}
							throw new Error(`[i18n]: pattern syntax error at pos ${a}`)
						}))))(r && r[e.key] ? r[e.key] : e.defaultText || e.key, t)
					}
				}
				const x = async e => (await b(e), (e => {
					if (C.has(e)) return C.get(e);
					const t = new w(e);
					return C.set(e, t), t
				})(e))
			},
			5009: (e, t, r) => {
				"use strict";
				r.d(t, {
					A: () => i,
					J: () => a
				});
				const o = new Set,
					i = e => {
						o.add(e)
					},
					a = e => o.has(e)
			},
			9774: (e, t, r) => {
				"use strict";
				r.d(t, {
					A: () => d
				});
				var o = r(9439);
				const i = typeof document > "u",
					a = () => {
						if (i) return o.Nm;
						const e = navigator.languages;
						return e && e[0] || navigator.language || o.Nm
					};
				var n = r(3252);
				const _ = /^((?:[A-Z]{2,3}(?:-[A-Z]{3}){0,3})|[A-Z]{4}|[A-Z]{5,8})(?:-([A-Z]{4}))?(?:-([A-Z]{2}|[0-9]{3}))?((?:-[0-9A-Z]{5,8}|-[0-9][0-9A-Z]{3})*)((?:-[0-9A-WYZ](?:-[0-9A-Z]{2,8})+)*)(?:-(X(?:-[0-9A-Z]{1,8})+))?$/i,
					s = class {
						constructor(e) {
							const t = _.exec(e.replace(/_/g, "-"));
							if (null === t) throw new Error(`The given language ${e} does not adhere to BCP-47.`);
							this.sLocaleId = e, this.sLanguage = t[1] || o.Nm, this.sScript = t[2] || "", this.sRegion = t[3] || "", this.sVariant = t[4] && t[4].slice(1) || null, this.sExtension = t[5] && t[5].slice(1) || null, this.sPrivateUse = t[6] || null, this.sLanguage && (this.sLanguage = this.sLanguage.toLowerCase()), this.sScript && (this.sScript = this.sScript.toLowerCase().replace(/^[a-z]/, (e => e.toUpperCase()))), this.sRegion && (this.sRegion = this.sRegion.toUpperCase())
						}
						getLanguage() {
							return this.sLanguage
						}
						getScript() {
							return this.sScript
						}
						getRegion() {
							return this.sRegion
						}
						getVariant() {
							return this.sVariant
						}
						getVariantSubtags() {
							return this.sVariant ? this.sVariant.split("-") : []
						}
						getExtension() {
							return this.sExtension
						}
						getExtensionSubtags() {
							return this.sExtension ? this.sExtension.slice(2).split("-") : []
						}
						getPrivateUse() {
							return this.sPrivateUse
						}
						getPrivateUseSubtags() {
							return this.sPrivateUse ? this.sPrivateUse.slice(2).split("-") : []
						}
						hasPrivateUseSubtag(e) {
							return this.getPrivateUseSubtags().indexOf(e) >= 0
						}
						toString() {
							const e = [this.sLanguage];
							return this.sScript && e.push(this.sScript), this.sRegion && e.push(this.sRegion), this.sVariant && e.push(this.sVariant), this.sExtension && e.push(this.sExtension), this.sPrivateUse && e.push(this.sPrivateUse), e.join("-")
						}
					},
					c = new Map,
					l = e => (c.has(e) || c.set(e, new s(e)), c.get(e)),
					u = e => {
						try {
							if (e && "string" == typeof e) return l(e)
						} catch {}
						return new s(o.Xn)
					},
					d = e => {
						if (e) return u(e);
						const t = (0, n.Z0)();
						return t ? l(t) : u(a())
					}
			},
			5512: (e, t, r) => {
				"use strict";
				r.d(t, {
					_F: () => i
				});
				const o = new(r(7064).A),
					i = e => {
						o.attachEvent("languageChange", e)
					}
			},
			9839: (e, t, r) => {
				"use strict";
				var o;
				r.d(t, {
					Hk: () => re,
					Ay: () => se,
					qy: () => ae,
					JR: () => oe,
					ux: () => te,
					DL: () => _e,
					JW: () => ne
				});
				const i = window,
					a = i.trustedTypes,
					n = a ? a.createPolicy("lit-html", {
						createHTML: e => e
					}) : void 0,
					_ = "$lit$",
					s = `lit$${(Math.random()+"").slice(9)}$`,
					c = "?" + s,
					l = `<${c}>`,
					u = document,
					d = () => u.createComment(""),
					p = e => null === e || "object" != typeof e && "function" != typeof e,
					h = Array.isArray,
					v = e => h(e) || "function" == typeof(null == e ? void 0 : e[Symbol.iterator]),
					f = "[ \t\n\f\r]",
					m = /<(?:(!--|\/[^a-zA-Z])|(\/?[a-zA-Z][^>\s]*)|(\/?$))/g,
					g = /-->/g,
					b = />/g,
					y = RegExp(`>|${f}(?:([^\\s"'>=/]+)(${f}*=${f}*(?:[^ \t\n\f\r"'\`<>=]|("|')|))|$)`, "g"),
					C = /'/g,
					w = /"/g,
					x = /^(?:script|style|textarea|title)$/i,
					k = e => (t, ...r) => ({
						_$litType$: e,
						strings: t,
						values: r
					}),
					S = k(1),
					B = k(2),
					A = Symbol.for("lit-noChange"),
					T = Symbol.for("lit-nothing"),
					I = new WeakMap,
					q = u.createTreeWalker(u, 129, null, !1);

				function L(e, t) {
					if (!Array.isArray(e) || !e.hasOwnProperty("raw")) throw Error("invalid template strings array");
					return void 0 !== n ? n.createHTML(t) : t
				}
				const E = (e, t) => {
					const r = e.length - 1,
						o = [];
					let i, a = 2 === t ? "<svg>" : "",
						n = m;
					for (let t = 0; t < r; t++) {
						const r = e[t];
						let c, u, d = -1,
							p = 0;
						for (; p < r.length && (n.lastIndex = p, u = n.exec(r), null !== u);) p = n.lastIndex, n === m ? "!--" === u[1] ? n = g : void 0 !== u[1] ? n = b : void 0 !== u[2] ? (x.test(u[2]) && (i = RegExp("</" + u[2], "g")), n = y) : void 0 !== u[3] && (n = y) : n === y ? ">" === u[0] ? (n = null != i ? i : m, d = -1) : void 0 === u[1] ? d = -2 : (d = n.lastIndex - u[2].length, c = u[1], n = void 0 === u[3] ? y : '"' === u[3] ? w : C) : n === w || n === C ? n = y : n === g || n === b ? n = m : (n = y, i = void 0);
						const h = n === y && e[t + 1].startsWith("/>") ? " " : "";
						a += n === m ? r + l : d >= 0 ? (o.push(c), r.slice(0, d) + _ + r.slice(d) + s + h) : r + s + (-2 === d ? (o.push(void 0), t) : h)
					}
					return [L(e, a + (e[r] || "<?>") + (2 === t ? "</svg>" : "")), o]
				};
				class P {
					constructor({
						strings: e,
						_$litType$: t
					}, r) {
						let o;
						this.parts = [];
						let i = 0,
							n = 0;
						const l = e.length - 1,
							u = this.parts,
							[p, h] = E(e, t);
						if (this.el = P.createElement(p, r), q.currentNode = this.el.content, 2 === t) {
							const e = this.el.content,
								t = e.firstChild;
							t.remove(), e.append(...t.childNodes)
						}
						for (; null !== (o = q.nextNode()) && u.length < l;) {
							if (1 === o.nodeType) {
								if (o.hasAttributes()) {
									const e = [];
									for (const t of o.getAttributeNames())
										if (t.endsWith(_) || t.startsWith(s)) {
											const r = h[n++];
											if (e.push(t), void 0 !== r) {
												const e = o.getAttribute(r.toLowerCase() + _).split(s),
													t = /([.?@])?(.*)/.exec(r);
												u.push({
													type: 1,
													index: i,
													name: t[2],
													strings: e,
													ctor: "." === t[1] ? N : "?" === t[1] ? R : "@" === t[1] ? O : M
												})
											} else u.push({
												type: 6,
												index: i
											})
										} for (const t of e) o.removeAttribute(t)
								}
								if (x.test(o.tagName)) {
									const e = o.textContent.split(s),
										t = e.length - 1;
									if (t > 0) {
										o.textContent = a ? a.emptyScript : "";
										for (let r = 0; r < t; r++) o.append(e[r], d()), q.nextNode(), u.push({
											type: 2,
											index: ++i
										});
										o.append(e[t], d())
									}
								}
							} else if (8 === o.nodeType)
								if (o.data === c) u.push({
									type: 2,
									index: i
								});
								else {
									let e = -1;
									for (; - 1 !== (e = o.data.indexOf(s, e + 1));) u.push({
										type: 7,
										index: i
									}), e += s.length - 1
								} i++
						}
					}
					static createElement(e, t) {
						const r = u.createElement("template");
						return r.innerHTML = e, r
					}
				}

				function z(e, t, r = e, o) {
					var i, a, n, _;
					if (t === A) return t;
					let s = void 0 !== o ? null === (i = r._$Co) || void 0 === i ? void 0 : i[o] : r._$Cl;
					const c = p(t) ? void 0 : t._$litDirective$;
					return (null == s ? void 0 : s.constructor) !== c && (null === (a = null == s ? void 0 : s._$AO) || void 0 === a || a.call(s, !1), void 0 === c ? s = void 0 : (s = new c(e), s._$AT(e, r, o)), void 0 !== o ? (null !== (n = (_ = r)._$Co) && void 0 !== n ? n : _._$Co = [])[o] = s : r._$Cl = s), void 0 !== s && (t = z(e, s._$AS(e, t.values), s, o)), t
				}
				class F {
					constructor(e, t) {
						this._$AV = [], this._$AN = void 0, this._$AD = e, this._$AM = t
					}
					get parentNode() {
						return this._$AM.parentNode
					}
					get _$AU() {
						return this._$AM._$AU
					}
					u(e) {
						var t;
						const {
							el: {
								content: r
							},
							parts: o
						} = this._$AD, i = (null !== (t = null == e ? void 0 : e.creationScope) && void 0 !== t ? t : u).importNode(r, !0);
						q.currentNode = i;
						let a = q.nextNode(),
							n = 0,
							_ = 0,
							s = o[0];
						for (; void 0 !== s;) {
							if (n === s.index) {
								let t;
								2 === s.type ? t = new H(a, a.nextSibling, this, e) : 1 === s.type ? t = new s.ctor(a, s.name, s.strings, this, e) : 6 === s.type && (t = new j(a, this, e)), this._$AV.push(t), s = o[++_]
							}
							n !== (null == s ? void 0 : s.index) && (a = q.nextNode(), n++)
						}
						return q.currentNode = u, i
					}
					v(e) {
						let t = 0;
						for (const r of this._$AV) void 0 !== r && (void 0 !== r.strings ? (r._$AI(e, r, t), t += r.strings.length - 2) : r._$AI(e[t])), t++
					}
				}
				class H {
					constructor(e, t, r, o) {
						var i;
						this.type = 2, this._$AH = T, this._$AN = void 0, this._$AA = e, this._$AB = t, this._$AM = r, this.options = o, this._$Cp = null === (i = null == o ? void 0 : o.isConnected) || void 0 === i || i
					}
					get _$AU() {
						var e, t;
						return null !== (t = null === (e = this._$AM) || void 0 === e ? void 0 : e._$AU) && void 0 !== t ? t : this._$Cp
					}
					get parentNode() {
						let e = this._$AA.parentNode;
						const t = this._$AM;
						return void 0 !== t && 11 === (null == e ? void 0 : e.nodeType) && (e = t.parentNode), e
					}
					get startNode() {
						return this._$AA
					}
					get endNode() {
						return this._$AB
					}
					_$AI(e, t = this) {
						e = z(this, e, t), p(e) ? e === T || null == e || "" === e ? (this._$AH !== T && this._$AR(), this._$AH = T) : e !== this._$AH && e !== A && this._(e) : void 0 !== e._$litType$ ? this.g(e) : void 0 !== e.nodeType ? this.$(e) : v(e) ? this.T(e) : this._(e)
					}
					k(e) {
						return this._$AA.parentNode.insertBefore(e, this._$AB)
					}
					$(e) {
						this._$AH !== e && (this._$AR(), this._$AH = this.k(e))
					}
					_(e) {
						this._$AH !== T && p(this._$AH) ? this._$AA.nextSibling.data = e : this.$(u.createTextNode(e)), this._$AH = e
					}
					g(e) {
						var t;
						const {
							values: r,
							_$litType$: o
						} = e, i = "number" == typeof o ? this._$AC(e) : (void 0 === o.el && (o.el = P.createElement(L(o.h, o.h[0]), this.options)), o);
						if ((null === (t = this._$AH) || void 0 === t ? void 0 : t._$AD) === i) this._$AH.v(r);
						else {
							const e = new F(i, this),
								t = e.u(this.options);
							e.v(r), this.$(t), this._$AH = e
						}
					}
					_$AC(e) {
						let t = I.get(e.strings);
						return void 0 === t && I.set(e.strings, t = new P(e)), t
					}
					T(e) {
						h(this._$AH) || (this._$AH = [], this._$AR());
						const t = this._$AH;
						let r, o = 0;
						for (const i of e) o === t.length ? t.push(r = new H(this.k(d()), this.k(d()), this, this.options)) : r = t[o], r._$AI(i), o++;
						o < t.length && (this._$AR(r && r._$AB.nextSibling, o), t.length = o)
					}
					_$AR(e = this._$AA.nextSibling, t) {
						var r;
						for (null === (r = this._$AP) || void 0 === r || r.call(this, !1, !0, t); e && e !== this._$AB;) {
							const t = e.nextSibling;
							e.remove(), e = t
						}
					}
					setConnected(e) {
						var t;
						void 0 === this._$AM && (this._$Cp = e, null === (t = this._$AP) || void 0 === t || t.call(this, e))
					}
				}
				class M {
					constructor(e, t, r, o, i) {
						this.type = 1, this._$AH = T, this._$AN = void 0, this.element = e, this.name = t, this._$AM = o, this.options = i, r.length > 2 || "" !== r[0] || "" !== r[1] ? (this._$AH = Array(r.length - 1).fill(new String), this.strings = r) : this._$AH = T
					}
					get tagName() {
						return this.element.tagName
					}
					get _$AU() {
						return this._$AM._$AU
					}
					_$AI(e, t = this, r, o) {
						const i = this.strings;
						let a = !1;
						if (void 0 === i) e = z(this, e, t, 0), a = !p(e) || e !== this._$AH && e !== A, a && (this._$AH = e);
						else {
							const o = e;
							let n, _;
							for (e = i[0], n = 0; n < i.length - 1; n++) _ = z(this, o[r + n], t, n), _ === A && (_ = this._$AH[n]), a || (a = !p(_) || _ !== this._$AH[n]), _ === T ? e = T : e !== T && (e += (null != _ ? _ : "") + i[n + 1]), this._$AH[n] = _
						}
						a && !o && this.j(e)
					}
					j(e) {
						e === T ? this.element.removeAttribute(this.name) : this.element.setAttribute(this.name, null != e ? e : "")
					}
				}
				class N extends M {
					constructor() {
						super(...arguments), this.type = 3
					}
					j(e) {
						this.element[this.name] = e === T ? void 0 : e
					}
				}
				const $ = a ? a.emptyScript : "";
				class R extends M {
					constructor() {
						super(...arguments), this.type = 4
					}
					j(e) {
						e && e !== T ? this.element.setAttribute(this.name, $) : this.element.removeAttribute(this.name)
					}
				}
				class O extends M {
					constructor(e, t, r, o, i) {
						super(e, t, r, o, i), this.type = 5
					}
					_$AI(e, t = this) {
						var r;
						if ((e = null !== (r = z(this, e, t, 0)) && void 0 !== r ? r : T) === A) return;
						const o = this._$AH,
							i = e === T && o !== T || e.capture !== o.capture || e.once !== o.once || e.passive !== o.passive,
							a = e !== T && (o === T || i);
						i && this.element.removeEventListener(this.name, this, o), a && this.element.addEventListener(this.name, this, e), this._$AH = e
					}
					handleEvent(e) {
						var t, r;
						"function" == typeof this._$AH ? this._$AH.call(null !== (r = null === (t = this.options) || void 0 === t ? void 0 : t.host) && void 0 !== r ? r : this.element, e) : this._$AH.handleEvent(e)
					}
				}
				class j {
					constructor(e, t, r) {
						this.element = e, this.type = 6, this._$AN = void 0, this._$AM = t, this.options = r
					}
					get _$AU() {
						return this._$AM._$AU
					}
					_$AI(e) {
						z(this, e)
					}
				}
				const D = {
						O: _,
						P: s,
						A: c,
						C: 1,
						M: E,
						L: F,
						R: v,
						D: z,
						I: H,
						V: M,
						H: R,
						N: O,
						U: N,
						F: j
					},
					U = i.litHtmlPolyfillSupport;
				null == U || U(P, H), (null !== (o = i.litHtmlVersions) && void 0 !== o ? o : i.litHtmlVersions = []).push("2.8.0");
				var G = r(3889);
				const W = e => (...t) => ({
					_$litDirective$: e,
					values: t
				});
				class J {
					constructor(e) {}
					get _$AU() {
						return this._$AM._$AU
					}
					_$AT(e, t, r) {
						this._$Ct = e, this._$AM = t, this._$Ci = r
					}
					_$AS(e, t) {
						return this.update(e, t)
					}
					update(e, t) {
						return this.render(...t)
					}
				}
				const {
					I: V
				} = D, X = () => document.createComment(""), Y = (e, t, r) => {
					var o;
					const i = e._$AA.parentNode,
						a = void 0 === t ? e._$AB : t._$AA;
					if (void 0 === r) {
						const t = i.insertBefore(X(), a),
							o = i.insertBefore(X(), a);
						r = new V(t, o, e, e.options)
					} else {
						const t = r._$AB.nextSibling,
							n = r._$AM,
							_ = n !== e;
						if (_) {
							let t;
							null === (o = r._$AQ) || void 0 === o || o.call(r, e), r._$AM = e, void 0 !== r._$AP && (t = e._$AU) !== n._$AU && r._$AP(t)
						}
						if (t !== a || _) {
							let e = r._$AA;
							for (; e !== t;) {
								const t = e.nextSibling;
								i.insertBefore(e, a), e = t
							}
						}
					}
					return r
				}, Z = (e, t, r = e) => (e._$AI(t, r), e), K = {}, Q = e => {
					var t;
					null === (t = e._$AP) || void 0 === t || t.call(e, !1, !0);
					let r = e._$AA;
					const o = e._$AB.nextSibling;
					for (; r !== o;) {
						const e = r.nextSibling;
						r.remove(), r = e
					}
				}, ee = (e, t, r) => {
					const o = new Map;
					for (let i = t; i <= r; i++) o.set(e[i], i);
					return o
				}, te = W(class extends J {
					constructor(e) {
						if (super(e), 2 !== e.type) throw Error("repeat() can only be used in text expressions")
					}
					ct(e, t, r) {
						let o;
						void 0 === r ? r = t : void 0 !== t && (o = t);
						const i = [],
							a = [];
						let n = 0;
						for (const t of e) i[n] = o ? o(t, n) : n, a[n] = r(t, n), n++;
						return {
							values: a,
							keys: i
						}
					}
					render(e, t, r) {
						return this.ct(e, t, r).values
					}
					update(e, [t, r, o]) {
						var i;
						const a = (e => e._$AH)(e),
							{
								values: n,
								keys: _
							} = this.ct(t, r, o);
						if (!Array.isArray(a)) return this.ut = _, n;
						const s = null !== (i = this.ut) && void 0 !== i ? i : this.ut = [],
							c = [];
						let l, u, d = 0,
							p = a.length - 1,
							h = 0,
							v = n.length - 1;
						for (; d <= p && h <= v;)
							if (null === a[d]) d++;
							else if (null === a[p]) p--;
						else if (s[d] === _[h]) c[h] = Z(a[d], n[h]), d++, h++;
						else if (s[p] === _[v]) c[v] = Z(a[p], n[v]), p--, v--;
						else if (s[d] === _[v]) c[v] = Z(a[d], n[v]), Y(e, c[v + 1], a[d]), d++, v--;
						else if (s[p] === _[h]) c[h] = Z(a[p], n[h]), Y(e, a[d], a[p]), p--, h++;
						else if (void 0 === l && (l = ee(_, h, v), u = ee(s, d, p)), l.has(s[d]))
							if (l.has(s[p])) {
								const t = u.get(_[h]),
									r = void 0 !== t ? a[t] : null;
								if (null === r) {
									const t = Y(e, a[d]);
									Z(t, n[h]), c[h] = t
								} else c[h] = Z(r, n[h]), Y(e, a[d], r), a[t] = null;
								h++
							} else Q(a[p]), p--;
						else Q(a[d]), d++;
						for (; h <= v;) {
							const t = Y(e, c[v + 1]);
							Z(t, n[h]), c[h++] = t
						}
						for (; d <= p;) {
							const e = a[d++];
							null !== e && Q(e)
						}
						return this.ut = _, ((e, t = K) => {
							e._$AH = t
						})(e, c), A
					}
				}), re = W(class extends J {
					constructor(e) {
						var t;
						if (super(e), 1 !== e.type || "class" !== e.name || (null === (t = e.strings) || void 0 === t ? void 0 : t.length) > 2) throw Error("`classMap()` can only be used in the `class` attribute and must be the only part in the attribute.")
					}
					render(e) {
						return " " + Object.keys(e).filter((t => e[t])).join(" ") + " "
					}
					update(e, [t]) {
						var r, o;
						if (void 0 === this.it) {
							this.it = new Set, void 0 !== e.strings && (this.nt = new Set(e.strings.join(" ").split(/\s/).filter((e => "" !== e))));
							for (const e in t) t[e] && !(null === (r = this.nt) || void 0 === r ? void 0 : r.has(e)) && this.it.add(e);
							return this.render(t)
						}
						const i = e.element.classList;
						this.it.forEach((e => {
							e in t || (i.remove(e), this.it.delete(e))
						}));
						for (const e in t) {
							const r = !!t[e];
							r === this.it.has(e) || (null === (o = this.nt) || void 0 === o ? void 0 : o.has(e)) || (r ? (i.add(e), this.it.add(e)) : (i.remove(e), this.it.delete(e)))
						}
						return A
					}
				});
				W(class extends J {
					constructor(e) {
						var t;
						if (super(e), 1 !== e.type || "style" !== e.name || (null === (t = e.strings) || void 0 === t ? void 0 : t.length) > 2) throw new Error("The `styleMap` directive must be used in the `style` attribute and must be the only part in the attribute.")
					}
					render(e) {
						return ""
					}
					update(e, [t]) {
						const {
							style: r
						} = e.element;
						if (void 0 === this._previousStyleProperties) {
							this._previousStyleProperties = new Set;
							for (const e in t) this._previousStyleProperties.add(e)
						}
						this._previousStyleProperties.forEach((e => {
							null == t[e] && (this._previousStyleProperties.delete(e), e.includes("-") ? r.removeProperty(e) : r[e] = "")
						}));
						for (const e in t) {
							const o = t[e];
							null != o && (this._previousStyleProperties.add(e), e.includes("-") ? r.setProperty(e, o) : r[e] = o)
						}
						return A
					}
				});
				const oe = e => null != e ? e : T;
				class ie extends J {
					constructor(e) {
						if (super(e), this.et = T, 2 !== e.type) throw Error(this.constructor.directiveName + "() can only be used in child bindings")
					}
					render(e) {
						if (e === T || null == e) return this.ft = void 0, this.et = e;
						if (e === A) return e;
						if ("string" != typeof e) throw Error(this.constructor.directiveName + "() called with a non-string value");
						if (e === this.et) return this.ft;
						this.et = e;
						const t = [e];
						return t.raw = t, this.ft = {
							_$litType$: this.constructor.resultType,
							strings: t,
							values: []
						}
					}
				}
				ie.directiveName = "unsafeHTML", ie.resultType = 1, W(ie);
				const ae = (e, ...t) => {
						const r = (0, G.x$)("LitStatic");
						return (r ? r.html : S)(e, ...t)
					},
					ne = (e, ...t) => {
						const r = (0, G.x$)("LitStatic");
						return (r ? r.svg : B)(e, ...t)
					},
					_e = (e, t, r) => {
						const o = (0, G.x$)("LitStatic");
						if (o) return o.unsafeStatic((t || []).includes(e) ? `${e}-${r}` : e)
					},
					se = (e, t, r) => {
						const o = (0, G.x$)("OpenUI5Enablement");
						o && (e = o.wrapTemplateResultInBusyMarkup(ae, r.host, e)), ((e, t, r) => {
							var o, i;
							const a = null !== (o = null == r ? void 0 : r.renderBefore) && void 0 !== o ? o : t;
							let n = a._$litPart$;
							if (void 0 === n) {
								const e = null !== (i = null == r ? void 0 : r.renderBefore) && void 0 !== i ? i : null;
								a._$litPart$ = n = new H(t.insertBefore(d(), e), e, void 0, null != r ? r : {})
							}
							n._$AI(e)
						})(e, t, r)
					}
			},
			9212: (e, t, r) => {
				"use strict";
				r.d(t, {
					A: () => i
				});
				var o = r(3290);
				const i = (e, t) => {
					const r = (e => {
							const t = e.constructor,
								r = t.getMetadata().getPureTag(),
								i = t.getUniqueDependencies().map((e => e.getMetadata().getPureTag())).filter(o.RF);
							return (0, o.RF)(r) && i.push(r), i
						})(t),
						i = (0, o.rD)();
					return e.call(t, t, r, i)
				}
			},
			6585: (e, t, r) => {
				"use strict";
				r.d(t, {
					E: () => n,
					h: () => a
				});
				const o = new(r(7064).A),
					i = "themeRegistered",
					a = e => {
						o.attachEvent(i, e)
					},
					n = e => o.fireEvent(i, e)
			},
			3941: (e, t, r) => {
				"use strict";
				r.d(t, {
					A: () => f
				});
				var o = r(5578),
					i = r(5602),
					a = r(2421);
				const n = new(r(7064).A),
					_ = e => n.fireEvent("themeLoaded", e);
				var s = r(3889);
				r(490);
				var c = r(1542);
				let l;
				r(4825), (0, r(9887).R)((() => {
					l = void 0
				}));
				const u = () => (void 0 === l && (l = (0, c.SU)()), l),
					d = async e => {
						const t = document.querySelector(`[sap-ui-webcomponents-theme="${e}"]`);
						t && document.head.removeChild(t), await ((e, t) => {
							const r = document.createElement("link");
							return r.type = "text/css", r.rel = "stylesheet", t && Object.entries(t).forEach((e => r.setAttribute(...e))), r.href = e, document.head.appendChild(r), new Promise((e => {
								r.addEventListener("load", e), r.addEventListener("error", e)
							}))
						})((e => `${u()}Base/baseLib/${e}/css_variables.css`)(e), {
							"sap-ui-webcomponents-theme": e
						})
					};
				var p = r(9439),
					h = r(3472);
				const v = "@ui5/webcomponents-theming",
					f = async e => {
						const t = await (async e => {
							const t = (0, a.A)();
							if (t) return t;
							const r = (0, s.x$)("OpenUI5Support");
							if (r && r.isOpenUI5Detected()) {
								if (r.cssVariablesLoaded()) return {
									themeName: r.getConfigurationSettingsObject()?.theme,
									baseThemeName: ""
								}
							} else if (u()) return await d(e), (0, a.A)()
						})(e);
						t && e === t.themeName ? (0, i.eP)("data-ui5-theme-properties", v) : await (async e => {
							if (!(0, o.w2)().has(v)) return;
							const t = await (0, o.tw)(v, e);
							t && (0, i.E6)(t, "data-ui5-theme-properties", v, e)
						})(e);
						const r = (0, o.gu)(e) ? e : t && t.baseThemeName;
						await (async (e, t) => {
							const r = [...(0, o.w2)()].map((async r => {
								if (r === v) return;
								const a = await (0, o.tw)(r, e, t);
								a && (0, i.E6)(a, `data-ui5-component-properties-${(0,h._w)()}`, r)
							}));
							return Promise.all(r)
						})(r || p.SS, t && t.themeName === e ? e : void 0), _(e)
					}
			},
			2421: (e, t, r) => {
				"use strict";
				r.d(t, {
					A: () => i
				});
				const o = new Set,
					i = () => {
						const e = (() => {
							let e = document.querySelector(".sapThemeMetaData-Base-baseLib") || document.querySelector(".sapThemeMetaData-UI5-sap-ui-core");
							if (e) return getComputedStyle(e).backgroundImage;
							e = document.createElement("span"), e.style.display = "none", e.classList.add("sapThemeMetaData-Base-baseLib"), document.body.appendChild(e);
							let t = getComputedStyle(e).backgroundImage;
							return "none" === t && (e.classList.add("sapThemeMetaData-UI5-sap-ui-core"), t = getComputedStyle(e).backgroundImage), document.body.removeChild(e), t
						})();
						if (!e || "none" === e) return;
						const t = (e => {
							const t = /\(["']?data:text\/plain;utf-8,(.*?)['"]?\)$/i.exec(e);
							if (t && t.length >= 2) {
								let e = t[1];
								if (e = e.replace(/\\"/g, '"'), "{" !== e.charAt(0) && "}" !== e.charAt(e.length - 1)) try {
									e = decodeURIComponent(e)
								} catch {
									return void(o.has("decode") || (console.warn("Malformed theme metadata string, unable to decodeURIComponent"), o.add("decode")))
								}
								try {
									return JSON.parse(e)
								} catch {
									o.has("parse") || (console.warn("Malformed theme metadata string, unable to parse JSON"), o.add("parse"))
								}
							}
						})(e);
						return t ? (e => {
							let t, r;
							try {
								t = e.Path.match(/\.([^.]+)\.css_variables$/)[1], r = e.Extends[0]
							} catch {
								return void(o.has("object") || (console.warn("Malformed theme metadata Object", e), o.add("object")))
							}
							return {
								themeName: t,
								baseThemeName: r
							}
						})(t) : void 0
					}
			},
			3084: (e, t, r) => {
				"use strict";
				r.d(t, {
					A: () => d
				});
				var o = {},
					i = o.hasOwnProperty,
					a = o.toString,
					n = i.toString,
					_ = n.call(Object);
				const s = function(e) {
					var t, r;
					return !(!e || "[object Object]" !== a.call(e) || (t = Object.getPrototypeOf(e)) && ("function" != typeof(r = i.call(t, "constructor") && t.constructor) || n.call(r) !== _))
				};
				var c = Object.create(null),
					l = function(e, t, r, o) {
						var i, a, n, _, u, d, p = arguments[2] || {},
							h = 3,
							v = arguments.length,
							f = arguments[0] || !1,
							m = arguments[1] ? void 0 : c;
						for ("object" != typeof p && "function" != typeof p && (p = {}); h < v; h++)
							if (null != (u = arguments[h]))
								for (_ in u) i = p[_], n = u[_], "__proto__" !== _ && p !== n && (f && n && (s(n) || (a = Array.isArray(n))) ? (a ? (a = !1, d = i && Array.isArray(i) ? i : []) : d = i && s(i) ? i : {}, p[_] = l(f, arguments[1], d, n)) : n !== m && (p[_] = n));
						return p
					};
				const u = l,
					d = function(e, t) {
						return u(!0, !1, ...arguments)
					}
			},
			8863: (e, t, r) => {
				"use strict";
				r.d(t, {
					ax: () => o
				}), new WeakMap, new WeakMap;
				const o = e => {
						const t = e;
						return t.accessibleNameRef ? i(e) : t.accessibleName ? t.accessibleName : void 0
					},
					i = e => {
						const t = e.accessibleNameRef?.split(" ") ?? [],
							r = e.getRootNode();
						let o = "";
						return t.forEach(((e, i) => {
							const a = r.querySelector(`[id='${e}']`),
								n = `${a&&a.textContent?a.textContent:""}`;
							n && (o += n, i < t.length - 1 && (o += " "))
						})), o
					}
			},
			1688: (e, t, r) => {
				"use strict";
				r.d(t, {
					A: () => o
				});
				const o = e => Array.from(e).filter((e => e.nodeType !== Node.COMMENT_NODE && (e.nodeType !== Node.TEXT_NODE || 0 !== (e.nodeValue || "").trim().length))).length > 0
			},
			490: (e, t, r) => {
				"use strict";
				r.d(t, {
					A: () => i
				});
				var o = r(2234);
				const i = e => {
					let t;
					try {
						if (e.startsWith(".") || e.startsWith("/")) t = new URL(e, (0, o.$N)()).toString();
						else {
							const r = new URL(e),
								i = r.origin;
							t = i && (e => {
								const t = (e => {
									const t = document.querySelector('META[name="sap-allowedThemeOrigins"]');
									return t && t.getAttribute("content")
								})();
								return t && t.split(",").some((t => "*" === t || e === t.trim()))
							})(i) ? r.toString() : ((e, t) => {
								const r = new URL(e).pathname;
								return new URL(r, t).toString()
							})(r.toString(), (0, o.$N)())
						}
						return t.endsWith("/") || (t = `${t}/`), `${t}UI5/`
					} catch {}
				}
			},
			6180: (e, t, r) => {
				"use strict";
				r.d(t, {
					A: () => o
				});
				const o = {
					packageName: "@ui5/webcomponents-theming",
					fileName: "themes/sap_horizon/parameters-bundle.css.ts",
					content: ':root{--sapThemeMetaData-Base-baseLib:{"Path": "Base.baseLib.sap_horizon.css_variables","PathPattern": "/%frameworkId%/%libId%/%themeId%/%fileId%.css","Extends": ["baseTheme"],"Tags": ["Fiori_3","LightColorScheme"],"FallbackThemeId": "sap_fiori_3","Engine":{"Name": "theming-engine","Version": "14.0.2"},"Version":{"Build": "11.17.1.20240715084505","Source": "11.17.1"}};--sapBrandColor: #0070f2;--sapHighlightColor: #0064d9;--sapBaseColor: #fff;--sapShellColor: #fff;--sapBackgroundColor: #f5f6f7;--sapFontFamily: "72", "72full", Arial, Helvetica, sans-serif;--sapFontSize: .875rem;--sapTextColor: #1d2d3e;--sapLinkColor: #0064d9;--sapCompanyLogo: none;--sapBackgroundImage: none;--sapBackgroundImageOpacity: 1;--sapBackgroundImageRepeat: false;--sapSelectedColor: #0064d9;--sapHoverColor: #eaecee;--sapActiveColor: #dee2e5;--sapHighlightTextColor: #fff;--sapTitleColor: #1d2d3e;--sapNegativeColor: #aa0808;--sapCriticalColor: #e76500;--sapPositiveColor: #256f3a;--sapInformativeColor: #0070f2;--sapNeutralColor: #788fa6;--sapNegativeElementColor: #f53232;--sapCriticalElementColor: #e76500;--sapPositiveElementColor: #30914c;--sapInformativeElementColor: #0070f2;--sapNeutralElementColor: #788fa6;--sapNegativeTextColor: #aa0808;--sapCriticalTextColor: #b44f00;--sapPositiveTextColor: #256f3a;--sapInformativeTextColor: #0064d9;--sapNeutralTextColor: #1d2d3e;--sapErrorColor: #aa0808;--sapWarningColor: #e76500;--sapSuccessColor: #256f3a;--sapInformationColor: #0070f2;--sapErrorBackground: #ffeaf4;--sapWarningBackground: #fff8d6;--sapSuccessBackground: #f5fae5;--sapInformationBackground: #e1f4ff;--sapNeutralBackground: #eff1f2;--sapErrorBorderColor: #e90b0b;--sapWarningBorderColor: #dd6100;--sapSuccessBorderColor: #30914c;--sapInformationBorderColor: #0070f2;--sapNeutralBorderColor: #788fa6;--sapElement_LineHeight: 2.75rem;--sapElement_Height: 2.25rem;--sapElement_BorderWidth: .0625rem;--sapElement_BorderCornerRadius: .75rem;--sapElement_Compact_LineHeight: 2rem;--sapElement_Compact_Height: 1.625rem;--sapElement_Condensed_LineHeight: 1.5rem;--sapElement_Condensed_Height: 1.375rem;--sapContent_LineHeight: 1.5;--sapContent_IconHeight: 1rem;--sapContent_IconColor: #1d2d3e;--sapContent_ContrastIconColor: #fff;--sapContent_NonInteractiveIconColor: #758ca4;--sapContent_MarkerIconColor: #5d36ff;--sapContent_MarkerTextColor: #046c7a;--sapContent_MeasureIndicatorColor: #556b81;--sapContent_Selected_MeasureIndicatorColor: #0064d9;--sapContent_Placeholderloading_Background: #ccc;--sapContent_Placeholderloading_Gradient: linear-gradient(to right, #ccc 0%, #ccc 20%, #999 50%, #ccc 80%, #ccc 100%);--sapContent_ImagePlaceholderBackground: #eaecee;--sapContent_ImagePlaceholderForegroundColor: #5b738b;--sapContent_RatedColor: #d27700;--sapContent_UnratedColor: #758ca4;--sapContent_BusyColor: #0064d9;--sapContent_FocusColor: #0032a5;--sapContent_FocusStyle: solid;--sapContent_FocusWidth: .125rem;--sapContent_ContrastFocusColor: #fff;--sapContent_ShadowColor: #223548;--sapContent_ContrastShadowColor: #fff;--sapContent_Shadow0: 0 0 .125rem 0 rgba(34,53,72,.2), 0 .125rem .25rem 0 rgba(34,53,72,.2);--sapContent_Shadow1: 0 0 0 .0625rem rgba(34,53,72,.48), 0 .125rem .5rem 0 rgba(34,53,72,.3);--sapContent_Shadow2: 0 0 0 .0625rem rgba(34,53,72,.48), 0 .625rem 1.875rem 0 rgba(34,53,72,.25);--sapContent_Shadow3: 0 0 0 .0625rem rgba(34,53,72,.48), 0 1.25rem 5rem 0 rgba(34,53,72,.25);--sapContent_TextShadow: 0 0 .125rem #fff;--sapContent_ContrastTextShadow: 0 0 .0625rem rgba(0,0,0,.7);--sapContent_HeaderShadow: 0 .125rem .125rem 0 rgba(34,53,72,.05), inset 0 -.0625rem 0 0 #d9d9d9;--sapContent_Interaction_Shadow: inset 0 0 0 .0625rem rgba(85,107,129,.25);--sapContent_Selected_Shadow: inset 0 0 0 .0625rem rgba(79,160,255,.5);--sapContent_Negative_Shadow: inset 0 0 0 .0625rem rgba(255,142,196,.45);--sapContent_Critical_Shadow: inset 0 0 0 .0625rem rgba(255,213,10,.4);--sapContent_Positive_Shadow: inset 0 0 0 .0625rem rgba(48,145,76,.18);--sapContent_Informative_Shadow: inset 0 0 0 .0625rem rgba(104,174,255,.5);--sapContent_Neutral_Shadow: inset 0 0 0 .0625rem rgba(120,143,166,.3);--sapContent_SearchHighlightColor: #dafdf5;--sapContent_HelpColor: #188918;--sapContent_LabelColor: #556b82;--sapContent_MonospaceFontFamily: "72Mono", "72Monofull", lucida console, monospace;--sapContent_MonospaceBoldFontFamily: "72Mono-Bold", "72Mono-Boldfull", lucida console, monospace;--sapContent_IconFontFamily: "SAP-icons";--sapContent_DisabledTextColor: rgba(29,45,62,.6);--sapContent_DisabledOpacity: .4;--sapContent_ContrastTextThreshold: .65;--sapContent_ContrastTextColor: #fff;--sapContent_ForegroundColor: #efefef;--sapContent_ForegroundBorderColor: #758ca4;--sapContent_ForegroundTextColor: #1d2d3e;--sapContent_BadgeBackground: #aa0808;--sapContent_BadgeTextColor: #fff;--sapContent_DragAndDropActiveColor: #0064d9;--sapContent_Selected_TextColor: #0064d9;--sapContent_Selected_Background: #fff;--sapContent_Selected_Hover_Background: #e3f0ff;--sapContent_Selected_ForegroundColor: #0064d9;--sapContent_ForcedColorAdjust: none;--sapContent_Illustrative_Color1: #5d36ff;--sapContent_Illustrative_Color2: #0070f2;--sapContent_Illustrative_Color3: #f58b00;--sapContent_Illustrative_Color4: #00144a;--sapContent_Illustrative_Color5: #a9b4be;--sapContent_Illustrative_Color6: #d5dadd;--sapContent_Illustrative_Color7: #ebf8ff;--sapContent_Illustrative_Color8: #fff;--sapContent_Illustrative_Color9: #64edd2;--sapContent_Illustrative_Color10: #ebf8ff;--sapContent_Illustrative_Color11: #f31ded;--sapContent_Illustrative_Color12: #00a800;--sapContent_Illustrative_Color13: #005dc9;--sapContent_Illustrative_Color14: #004da5;--sapContent_Illustrative_Color15: #cc7400;--sapContent_Illustrative_Color16: #3b0ac6;--sapContent_Illustrative_Color17: #00a58a;--sapContent_Illustrative_Color18: #d1efff;--sapContent_Illustrative_Color19: #b8e6ff;--sapContent_Illustrative_Color20: #9eddff;--sapFontLightFamily: "72-Light", "72-Lightfull", "72", "72full", Arial, Helvetica, sans-serif;--sapFontBoldFamily: "72-Bold", "72-Boldfull", "72", "72full", Arial, Helvetica, sans-serif;--sapFontSemiboldFamily: "72-Semibold", "72-Semiboldfull", "72", "72full", Arial, Helvetica, sans-serif;--sapFontSemiboldDuplexFamily: "72-SemiboldDuplex", "72-SemiboldDuplexfull", "72", "72full", Arial, Helvetica, sans-serif;--sapFontBlackFamily: "72Black", "72Blackfull","72", "72full", Arial, Helvetica, sans-serif;--sapFontHeaderFamily: "72-Bold", "72-Boldfull", "72", "72full", Arial, Helvetica, sans-serif;--sapFontSmallSize: .75rem;--sapFontLargeSize: 1rem;--sapFontHeader1Size: 3rem;--sapFontHeader2Size: 2rem;--sapFontHeader3Size: 1.5rem;--sapFontHeader4Size: 1.25rem;--sapFontHeader5Size: 1rem;--sapFontHeader6Size: .875rem;--sapLink_TextDecoration: none;--sapLink_Hover_Color: #0064d9;--sapLink_Hover_TextDecoration: underline;--sapLink_Active_Color: #0064d9;--sapLink_Active_TextDecoration: none;--sapLink_Visited_Color: #0064d9;--sapLink_InvertedColor: #a6cfff;--sapLink_SubtleColor: #1d2d3e;--sapShell_Background: #eff1f2;--sapShell_BackgroundImage: linear-gradient(to bottom, #eff1f2, #eff1f2);--sapShell_BackgroundImageOpacity: 1;--sapShell_BackgroundImageRepeat: false;--sapShell_BorderColor: #fff;--sapShell_TextColor: #1d2d3e;--sapShell_InteractiveBackground: #eff1f2;--sapShell_InteractiveTextColor: #1d2d3e;--sapShell_InteractiveBorderColor: #556b81;--sapShell_GroupTitleTextColor: #1d2d3e;--sapShell_GroupTitleTextShadow: 0 0 .125rem #fff;--sapShell_Hover_Background: #fff;--sapShell_Active_Background: #fff;--sapShell_Active_TextColor: #0070f2;--sapShell_Selected_Background: #fff;--sapShell_Selected_TextColor: #0070f2;--sapShell_Selected_Hover_Background: #fff;--sapShell_Favicon: none;--sapShell_Navigation_Background: #fff;--sapShell_Navigation_Hover_Background: #fff;--sapShell_Navigation_SelectedColor: #0064d9;--sapShell_Navigation_Selected_TextColor: #0064d9;--sapShell_Navigation_TextColor: #1d2d3e;--sapShell_Navigation_Active_TextColor: #0064d9;--sapShell_Navigation_Active_Background: #fff;--sapShell_Shadow: 0 .125rem .125rem 0 rgba(34,53,72,.15), inset 0 -.0625rem 0 0 rgba(34,53,72,.2);--sapShell_NegativeColor: #aa0808;--sapShell_CriticalColor: #b44f00;--sapShell_PositiveColor: #256f3a;--sapShell_InformativeColor: #0064d9;--sapShell_NeutralColor: #1d2d3e;--sapShell_Assistant_ForegroundColor: #5d36ff;--sapShell_Category_1_Background: #0057d2;--sapShell_Category_1_BorderColor: #0057d2;--sapShell_Category_1_TextColor: #fff;--sapShell_Category_1_TextShadow: 0 0 .0625rem rgba(0,0,0,.7);--sapShell_Category_2_Background: #df1278;--sapShell_Category_2_BorderColor: #df1278;--sapShell_Category_2_TextColor: #fff;--sapShell_Category_2_TextShadow: 0 0 .0625rem rgba(0,0,0,.7);--sapShell_Category_3_Background: #e76500;--sapShell_Category_3_BorderColor: #e76500;--sapShell_Category_3_TextColor: #fff;--sapShell_Category_3_TextShadow: 0 0 .0625rem rgba(0,0,0,.7);--sapShell_Category_4_Background: #7800a4;--sapShell_Category_4_BorderColor: #7800a4;--sapShell_Category_4_TextColor: #fff;--sapShell_Category_4_TextShadow: 0 0 .0625rem rgba(0,0,0,.7);--sapShell_Category_5_Background: #aa2608;--sapShell_Category_5_BorderColor: #aa2608;--sapShell_Category_5_TextColor: #fff;--sapShell_Category_5_TextShadow: 0 0 .0625rem rgba(0,0,0,.7);--sapShell_Category_6_Background: #07838f;--sapShell_Category_6_BorderColor: #07838f;--sapShell_Category_6_TextColor: #fff;--sapShell_Category_6_TextShadow: 0 0 .0625rem rgba(0,0,0,.7);--sapShell_Category_7_Background: #f31ded;--sapShell_Category_7_BorderColor: #f31ded;--sapShell_Category_7_TextColor: #fff;--sapShell_Category_7_TextShadow: 0 0 .0625rem rgba(0,0,0,.7);--sapShell_Category_8_Background: #188918;--sapShell_Category_8_BorderColor: #188918;--sapShell_Category_8_TextColor: #fff;--sapShell_Category_8_TextShadow: 0 0 .0625rem rgba(0,0,0,.7);--sapShell_Category_9_Background: #002a86;--sapShell_Category_9_BorderColor: #002a86;--sapShell_Category_9_TextColor: #fff;--sapShell_Category_9_TextShadow: 0 0 .0625rem rgba(0,0,0,.7);--sapShell_Category_10_Background: #5b738b;--sapShell_Category_10_BorderColor: #5b738b;--sapShell_Category_10_TextColor: #fff;--sapShell_Category_10_TextShadow: 0 0 .0625rem rgba(0,0,0,.7);--sapShell_Category_11_Background: #d20a0a;--sapShell_Category_11_BorderColor: #d20a0a;--sapShell_Category_11_TextColor: #fff;--sapShell_Category_11_TextShadow: 0 0 .0625rem rgba(0,0,0,.7);--sapShell_Category_12_Background: #7858ff;--sapShell_Category_12_BorderColor: #7858ff;--sapShell_Category_12_TextColor: #fff;--sapShell_Category_12_TextShadow: 0 0 .0625rem rgba(0,0,0,.7);--sapShell_Category_13_Background: #a00875;--sapShell_Category_13_BorderColor: #a00875;--sapShell_Category_13_TextColor: #fff;--sapShell_Category_13_TextShadow: 0 0 .0625rem rgba(0,0,0,.7);--sapShell_Category_14_Background: #14565b;--sapShell_Category_14_BorderColor: #14565b;--sapShell_Category_14_TextColor: #fff;--sapShell_Category_14_TextShadow: 0 0 .0625rem rgba(0,0,0,.7);--sapShell_Category_15_Background: #223548;--sapShell_Category_15_BorderColor: #223548;--sapShell_Category_15_TextColor: #fff;--sapShell_Category_15_TextShadow: 0 0 .0625rem rgba(0,0,0,.7);--sapShell_Category_16_Background: #1e592f;--sapShell_Category_16_BorderColor: #1e592f;--sapShell_Category_16_TextColor: #fff;--sapShell_Category_16_TextShadow: 0 0 .0625rem rgba(0,0,0,.7);--sapAssistant_Color1: #5d36ff;--sapAssistant_Color2: #a100c2;--sapAssistant_BackgroundGradient: linear-gradient(#5d36ff, #a100c2);--sapAssistant_Background: #5d36ff;--sapAssistant_BorderColor: #5d36ff;--sapAssistant_TextColor: #fff;--sapAssistant_Hover_Background: #2800cf;--sapAssistant_Hover_BorderColor: #2800cf;--sapAssistant_Hover_TextColor: #fff;--sapAssistant_Active_Background: #fff;--sapAssistant_Active_BorderColor: #5d36ff;--sapAssistant_Active_TextColor: #5d36ff;--sapAssistant_Question_Background: #eae5ff;--sapAssistant_Question_BorderColor: #eae5ff;--sapAssistant_Question_TextColor: #1d2d3e;--sapAssistant_Answer_Background: #eff1f2;--sapAssistant_Answer_BorderColor: #eff1f2;--sapAssistant_Answer_TextColor: #1d2d3e;--sapAvatar_1_Background: #fff3b8;--sapAvatar_1_BorderColor: #fff3b8;--sapAvatar_1_TextColor: #a45d00;--sapAvatar_2_Background: #ffd0e7;--sapAvatar_2_BorderColor: #ffd0e7;--sapAvatar_2_TextColor: #aa0808;--sapAvatar_3_Background: #ffdbe7;--sapAvatar_3_BorderColor: #ffdbe7;--sapAvatar_3_TextColor: #ba066c;--sapAvatar_4_Background: #ffdcf3;--sapAvatar_4_BorderColor: #ffdcf3;--sapAvatar_4_TextColor: #a100c2;--sapAvatar_5_Background: #ded3ff;--sapAvatar_5_BorderColor: #ded3ff;--sapAvatar_5_TextColor: #552cff;--sapAvatar_6_Background: #d1efff;--sapAvatar_6_BorderColor: #d1efff;--sapAvatar_6_TextColor: #0057d2;--sapAvatar_7_Background: #c2fcee;--sapAvatar_7_BorderColor: #c2fcee;--sapAvatar_7_TextColor: #046c7a;--sapAvatar_8_Background: #ebf5cb;--sapAvatar_8_BorderColor: #ebf5cb;--sapAvatar_8_TextColor: #256f3a;--sapAvatar_9_Background: #ddccf0;--sapAvatar_9_BorderColor: #ddccf0;--sapAvatar_9_TextColor: #6c32a9;--sapAvatar_10_Background: #eaecee;--sapAvatar_10_BorderColor: #eaecee;--sapAvatar_10_TextColor: #556b82;--sapButton_Background: #fff;--sapButton_BorderColor: #bcc3ca;--sapButton_BorderWidth: .0625rem;--sapButton_BorderCornerRadius: .5rem;--sapButton_TextColor: #0064d9;--sapButton_Hover_Background: #eaecee;--sapButton_Hover_BorderColor: #bcc3ca;--sapButton_Hover_TextColor: #0064d9;--sapButton_IconColor: #0064d9;--sapButton_Active_Background: #fff;--sapButton_Active_BorderColor: #0064d9;--sapButton_Active_TextColor: #0064d9;--sapButton_Emphasized_Background: #0070f2;--sapButton_Emphasized_BorderColor: #0070f2;--sapButton_Emphasized_TextColor: #fff;--sapButton_Emphasized_Hover_Background: #0064d9;--sapButton_Emphasized_Hover_BorderColor: #0064d9;--sapButton_Emphasized_Hover_TextColor: #fff;--sapButton_Emphasized_Active_Background: #fff;--sapButton_Emphasized_Active_BorderColor: #0064d9;--sapButton_Emphasized_Active_TextColor: #0064d9;--sapButton_Emphasized_TextShadow: transparent;--sapButton_Emphasized_FontWeight: bold;--sapButton_Reject_Background: #ffd6e9;--sapButton_Reject_BorderColor: #ffc2de;--sapButton_Reject_TextColor: #aa0808;--sapButton_Reject_Hover_Background: #ffbddb;--sapButton_Reject_Hover_BorderColor: #ffbddb;--sapButton_Reject_Hover_TextColor: #aa0808;--sapButton_Reject_Active_Background: #fff;--sapButton_Reject_Active_BorderColor: #e90b0b;--sapButton_Reject_Active_TextColor: #aa0808;--sapButton_Reject_Selected_Background: #fff;--sapButton_Reject_Selected_BorderColor: #e90b0b;--sapButton_Reject_Selected_TextColor: #aa0808;--sapButton_Reject_Selected_Hover_Background: #ffbddb;--sapButton_Reject_Selected_Hover_BorderColor: #e90b0b;--sapButton_Accept_Background: #ebf5cb;--sapButton_Accept_BorderColor: #dbeda0;--sapButton_Accept_TextColor: #256f3a;--sapButton_Accept_Hover_Background: #e3f1b6;--sapButton_Accept_Hover_BorderColor: #e3f1b6;--sapButton_Accept_Hover_TextColor: #256f3a;--sapButton_Accept_Active_Background: #fff;--sapButton_Accept_Active_BorderColor: #30914c;--sapButton_Accept_Active_TextColor: #256f3a;--sapButton_Accept_Selected_Background: #fff;--sapButton_Accept_Selected_BorderColor: #30914c;--sapButton_Accept_Selected_TextColor: #256f3a;--sapButton_Accept_Selected_Hover_Background: #e3f1b6;--sapButton_Accept_Selected_Hover_BorderColor: #30914c;--sapButton_Lite_Background: transparent;--sapButton_Lite_BorderColor: transparent;--sapButton_Lite_TextColor: #0064d9;--sapButton_Lite_Hover_Background: #eaecee;--sapButton_Lite_Hover_BorderColor: #bcc3ca;--sapButton_Lite_Hover_TextColor: #0064d9;--sapButton_Lite_Active_Background: #fff;--sapButton_Lite_Active_BorderColor: #0064d9;--sapButton_Selected_Background: #edf6ff;--sapButton_Selected_BorderColor: #0064d9;--sapButton_Selected_TextColor: #0064d9;--sapButton_Selected_Hover_Background: #d9ecff;--sapButton_Selected_Hover_BorderColor: #0064d9;--sapButton_Attention_Background: #fff3b7;--sapButton_Attention_BorderColor: #ffeb84;--sapButton_Attention_TextColor: #b44f00;--sapButton_Attention_Hover_Background: #ffef9e;--sapButton_Attention_Hover_BorderColor: #ffef9e;--sapButton_Attention_Hover_TextColor: #b44f00;--sapButton_Attention_Active_Background: #fff;--sapButton_Attention_Active_BorderColor: #dd6100;--sapButton_Attention_Active_TextColor: #b44f00;--sapButton_Attention_Selected_Background: #fff;--sapButton_Attention_Selected_BorderColor: #dd6100;--sapButton_Attention_Selected_TextColor: #b44f00;--sapButton_Attention_Selected_Hover_Background: #ffef9e;--sapButton_Attention_Selected_Hover_BorderColor: #dd6100;--sapButton_Negative_Background: #f53232;--sapButton_Negative_BorderColor: #f53232;--sapButton_Negative_TextColor: #fff;--sapButton_Negative_Hover_Background: #e90b0b;--sapButton_Negative_Hover_BorderColor: #e90b0b;--sapButton_Negative_Hover_TextColor: #fff;--sapButton_Negative_Active_Background: #fff;--sapButton_Negative_Active_BorderColor: #f53232;--sapButton_Negative_Active_TextColor: #aa0808;--sapButton_Critical_Background: #e76500;--sapButton_Critical_BorderColor: #e76500;--sapButton_Critical_TextColor: #fff;--sapButton_Critical_Hover_Background: #dd6100;--sapButton_Critical_Hover_BorderColor: #dd6100;--sapButton_Critical_Hover_TextColor: #fff;--sapButton_Critical_Active_Background: #fff;--sapButton_Critical_Active_BorderColor: #dd6100;--sapButton_Critical_Active_TextColor: #b44f00;--sapButton_Success_Background: #30914c;--sapButton_Success_BorderColor: #30914c;--sapButton_Success_TextColor: #fff;--sapButton_Success_Hover_Background: #2c8646;--sapButton_Success_Hover_BorderColor: #2c8646;--sapButton_Success_Hover_TextColor: #fff;--sapButton_Success_Active_Background: #fff;--sapButton_Success_Active_BorderColor: #30914c;--sapButton_Success_Active_TextColor: #256f3a;--sapButton_Information_Background: #e8f3ff;--sapButton_Information_BorderColor: #b5d8ff;--sapButton_Information_TextColor: #0064d9;--sapButton_Information_Hover_Background: #d4e8ff;--sapButton_Information_Hover_BorderColor: #b5d8ff;--sapButton_Information_Hover_TextColor: #0064d9;--sapButton_Information_Active_Background: #fff;--sapButton_Information_Active_BorderColor: #0064d9;--sapButton_Information_Active_TextColor: #0064d9;--sapButton_Neutral_Background: #e8f3ff;--sapButton_Neutral_BorderColor: #b5d8ff;--sapButton_Neutral_TextColor: #0064d9;--sapButton_Neutral_Hover_Background: #d4e8ff;--sapButton_Neutral_Hover_BorderColor: #b5d8ff;--sapButton_Neutral_Hover_TextColor: #0064d9;--sapButton_Neutral_Active_Background: #fff;--sapButton_Neutral_Active_BorderColor: #0064d9;--sapButton_Neutral_Active_TextColor: #0064d9;--sapButton_Track_Background: #788fa6;--sapButton_Track_BorderColor: #788fa6;--sapButton_Track_TextColor: #fff;--sapButton_Track_Hover_Background: #637d97;--sapButton_Track_Hover_BorderColor: #637d97;--sapButton_Track_Selected_Background: #0064d9;--sapButton_Track_Selected_BorderColor: #0064d9;--sapButton_Track_Selected_TextColor: #fff;--sapButton_Track_Selected_Hover_Background: #0058c0;--sapButton_Track_Selected_Hover_BorderColor: #0058c0;--sapButton_Handle_Background: #fff;--sapButton_Handle_BorderColor: #fff;--sapButton_Handle_TextColor: #1d2d3e;--sapButton_Handle_Hover_Background: #fff;--sapButton_Handle_Hover_BorderColor: rgba(255,255,255,.5);--sapButton_Handle_Selected_Background: #edf6ff;--sapButton_Handle_Selected_BorderColor: #edf6ff;--sapButton_Handle_Selected_TextColor: #0064d9;--sapButton_Handle_Selected_Hover_Background: #edf6ff;--sapButton_Handle_Selected_Hover_BorderColor: rgba(237,246,255,.5);--sapButton_Track_Negative_Background: #f53232;--sapButton_Track_Negative_BorderColor: #f53232;--sapButton_Track_Negative_TextColor: #fff;--sapButton_Track_Negative_Hover_Background: #e90b0b;--sapButton_Track_Negative_Hover_BorderColor: #e90b0b;--sapButton_Handle_Negative_Background: #fff;--sapButton_Handle_Negative_BorderColor: #fff;--sapButton_Handle_Negative_TextColor: #aa0808;--sapButton_Handle_Negative_Hover_Background: #fff;--sapButton_Handle_Negative_Hover_BorderColor: rgba(255,255,255,.5);--sapButton_Track_Positive_Background: #30914c;--sapButton_Track_Positive_BorderColor: #30914c;--sapButton_Track_Positive_TextColor: #fff;--sapButton_Track_Positive_Hover_Background: #2c8646;--sapButton_Track_Positive_Hover_BorderColor: #2c8646;--sapButton_Handle_Positive_Background: #fff;--sapButton_Handle_Positive_BorderColor: #fff;--sapButton_Handle_Positive_TextColor: #256f3a;--sapButton_Handle_Positive_Hover_Background: #fff;--sapButton_Handle_Positive_Hover_BorderColor: rgba(255,255,255,.5);--sapButton_TokenBackground: #fff;--sapButton_TokenBorderColor: #bcc3ca;--sapField_Background: #fff;--sapField_BackgroundStyle: 0 100% / 100% .0625rem no-repeat linear-gradient(0deg, #556b81, #556b81) border-box;--sapField_TextColor: #131e29;--sapField_PlaceholderTextColor: #556b82;--sapField_BorderColor: #556b81;--sapField_HelpBackground: #fff;--sapField_BorderWidth: .0625rem;--sapField_BorderStyle: none;--sapField_BorderCornerRadius: .25rem;--sapField_Shadow: inset 0 0 0 .0625rem rgba(85,107,129,.25);--sapField_Hover_Background: #fff;--sapField_Hover_BackgroundStyle: 0 100% / 100% .0625rem no-repeat linear-gradient(0deg, #0064d9, #0064d9) border-box;--sapField_Hover_BorderColor: #0064d9;--sapField_Hover_HelpBackground: #fff;--sapField_Hover_Shadow: inset 0 0 0 .0625rem rgba(79,160,255,.5);--sapField_Hover_InvalidShadow: inset 0 0 0 .0625rem rgba(255,142,196,.45);--sapField_Hover_WarningShadow: inset 0 0 0 .0625rem rgba(255,213,10,.4);--sapField_Hover_SuccessShadow: inset 0 0 0 .0625rem rgba(48,145,76,.18);--sapField_Hover_InformationShadow: inset 0 0 0 .0625rem rgba(104,174,255,.5);--sapField_Active_BorderColor: #0064d9;--sapField_Focus_Background: #fff;--sapField_Focus_BorderColor: #0032a5;--sapField_Focus_HelpBackground: #fff;--sapField_ReadOnly_Background: #eaecee;--sapField_ReadOnly_BackgroundStyle: 0 100% / .375rem .0625rem repeat-x linear-gradient(90deg, #556b81 0, #556b81 .25rem, transparent .25rem) border-box;--sapField_ReadOnly_BorderColor: #556b81;--sapField_ReadOnly_BorderStyle: none;--sapField_ReadOnly_HelpBackground: #eaecee;--sapField_RequiredColor: #ba066c;--sapField_InvalidColor: #e90b0b;--sapField_InvalidBackground: #ffeaf4;--sapField_InvalidBackgroundStyle: 0 100% / 100% .125rem no-repeat linear-gradient(0deg, #e90b0b, #e90b0b) border-box;--sapField_InvalidBorderWidth: .125rem;--sapField_InvalidBorderStyle: none;--sapField_InvalidShadow: inset 0 0 0 .0625rem rgba(255,142,196,.45);--sapField_WarningColor: #dd6100;--sapField_WarningBackground: #fff8d6;--sapField_WarningBackgroundStyle: 0 100% / 100% .125rem no-repeat linear-gradient(0deg, #dd6100, #dd6100) border-box;--sapField_WarningBorderWidth: .125rem;--sapField_WarningBorderStyle: none;--sapField_WarningShadow: inset 0 0 0 .0625rem rgba(255,213,10,.4);--sapField_SuccessColor: #30914c;--sapField_SuccessBackground: #f5fae5;--sapField_SuccessBackgroundStyle: 0 100% / 100% .0625rem no-repeat linear-gradient(0deg, #30914c, #30914c) border-box;--sapField_SuccessBorderWidth: .0625rem;--sapField_SuccessBorderStyle: none;--sapField_SuccessShadow: inset 0 0 0 .0625rem rgba(48,145,76,.18);--sapField_InformationColor: #0070f2;--sapField_InformationBackground: #e1f4ff;--sapField_InformationBackgroundStyle: 0 100% / 100% .125rem no-repeat linear-gradient(0deg, #0070f2, #0070f2) border-box;--sapField_InformationBorderWidth: .125rem;--sapField_InformationBorderStyle: none;--sapField_InformationShadow: inset 0 0 0 .0625rem rgba(104,174,255,.5);--sapGroup_TitleBackground: #fff;--sapGroup_TitleBorderColor: #a8b2bd;--sapGroup_TitleTextColor: #1d2d3e;--sapGroup_Title_FontSize: 1rem;--sapGroup_ContentBackground: #fff;--sapGroup_ContentBorderColor: #d9d9d9;--sapGroup_BorderWidth: .0625rem;--sapGroup_BorderCornerRadius: .5rem;--sapGroup_FooterBackground: transparent;--sapToolbar_Background: #fff;--sapToolbar_SeparatorColor: #d9d9d9;--sapList_HeaderBackground: #fff;--sapList_HeaderBorderColor: #a8b2bd;--sapList_HeaderTextColor: #1d2d3e;--sapList_BorderColor: #e5e5e5;--sapList_BorderWidth: .0625rem;--sapList_TextColor: #1d2d3e;--sapList_Active_TextColor: #1d2d3e;--sapList_Active_Background: #dee2e5;--sapList_SelectionBackgroundColor: #ebf8ff;--sapList_SelectionBorderColor: #0064d9;--sapList_Hover_SelectionBackground: #dcf3ff;--sapList_Background: #fff;--sapList_Hover_Background: #eaecee;--sapList_AlternatingBackground: #f5f6f7;--sapList_GroupHeaderBackground: #fff;--sapList_GroupHeaderBorderColor: #a8b2bd;--sapList_GroupHeaderTextColor: #1d2d3e;--sapList_TableGroupHeaderBackground: #eff1f2;--sapList_TableGroupHeaderBorderColor: #a8b2bd;--sapList_TableGroupHeaderTextColor: #1d2d3e;--sapList_FooterBackground: #fff;--sapList_FooterTextColor: #1d2d3e;--sapList_TableFooterBorder: #a8b2bd;--sapList_TableFixedBorderColor: #8c8c8c;--sapMessage_ErrorBorderColor: #ff8ec4;--sapMessage_WarningBorderColor: #ffe770;--sapMessage_SuccessBorderColor: #cee67e;--sapMessage_InformationBorderColor: #7bcfff;--sapPopover_BorderCornerRadius: .5rem;--sapProgress_Background: #d5dadd;--sapProgress_BorderColor: #d5dadd;--sapProgress_TextColor: #1d2d3e;--sapProgress_FontSize: .875rem;--sapProgress_NegativeBackground: #ffdbec;--sapProgress_NegativeBorderColor: #ffdbec;--sapProgress_NegativeTextColor: #1d2d3e;--sapProgress_CriticalBackground: #fff4bd;--sapProgress_CriticalBorderColor: #fff4bd;--sapProgress_CriticalTextColor: #1d2d3e;--sapProgress_PositiveBackground: #e5f2ba;--sapProgress_PositiveBorderColor: #e5f2ba;--sapProgress_PositiveTextColor: #1d2d3e;--sapProgress_InformationBackground: #cdedff;--sapProgress_InformationBorderColor: #cdedff;--sapProgress_InformationTextColor: #1d2d3e;--sapProgress_Value_Background: #617b94;--sapProgress_Value_BorderColor: #617b94;--sapProgress_Value_TextColor: #788fa6;--sapProgress_Value_NegativeBackground: #f53232;--sapProgress_Value_NegativeBorderColor: #f53232;--sapProgress_Value_NegativeTextColor: #f53232;--sapProgress_Value_CriticalBackground: #e76500;--sapProgress_Value_CriticalBorderColor: #e76500;--sapProgress_Value_CriticalTextColor: #e76500;--sapProgress_Value_PositiveBackground: #30914c;--sapProgress_Value_PositiveBorderColor: #30914c;--sapProgress_Value_PositiveTextColor: #30914c;--sapProgress_Value_InformationBackground: #0070f2;--sapProgress_Value_InformationBorderColor: #0070f2;--sapProgress_Value_InformationTextColor: #0070f2;--sapScrollBar_FaceColor: #7b91a8;--sapScrollBar_TrackColor: #fff;--sapScrollBar_BorderColor: #7b91a8;--sapScrollBar_SymbolColor: #0064d9;--sapScrollBar_Dimension: .75rem;--sapScrollBar_Hover_FaceColor: #5b728b;--sapSlider_Background: #d5dadd;--sapSlider_BorderColor: #d5dadd;--sapSlider_Selected_Background: #0064d9;--sapSlider_Selected_BorderColor: #0064d9;--sapSlider_HandleBackground: #fff;--sapSlider_HandleBorderColor: #b0d5ff;--sapSlider_RangeHandleBackground: #fff;--sapSlider_Hover_HandleBackground: #d9ecff;--sapSlider_Hover_HandleBorderColor: #b0d5ff;--sapSlider_Hover_RangeHandleBackground: #d9ecff;--sapSlider_Active_HandleBackground: #fff;--sapSlider_Active_HandleBorderColor: #0064d9;--sapSlider_Active_RangeHandleBackground: transparent;--sapPageHeader_Background: #fff;--sapPageHeader_BorderColor: #d9d9d9;--sapPageHeader_TextColor: #1d2d3e;--sapPageFooter_Background: #fff;--sapPageFooter_BorderColor: #d9d9d9;--sapPageFooter_TextColor: #1d2d3e;--sapInfobar_Background: #c2fcee;--sapInfobar_Hover_Background: #fff;--sapInfobar_Active_Background: #fff;--sapInfobar_NonInteractive_Background: #f5f6f7;--sapInfobar_TextColor: #046c7a;--sapObjectHeader_Background: #fff;--sapObjectHeader_Hover_Background: #eaecee;--sapObjectHeader_BorderColor: #d9d9d9;--sapObjectHeader_Title_TextColor: #1d2d3e;--sapObjectHeader_Title_FontSize: 1.5rem;--sapObjectHeader_Title_SnappedFontSize: 1.25rem;--sapObjectHeader_Title_FontFamily: "72Black", "72Blackfull","72", "72full", Arial, Helvetica, sans-serif;--sapObjectHeader_Subtitle_TextColor: #556b82;--sapBlockLayer_Background: #000;--sapTile_Background: #fff;--sapTile_Hover_Background: #eaecee;--sapTile_Active_Background: #dee2e5;--sapTile_BorderColor: transparent;--sapTile_BorderCornerRadius: 1rem;--sapTile_TitleTextColor: #1d2d3e;--sapTile_TextColor: #556b82;--sapTile_IconColor: #556b82;--sapTile_SeparatorColor: #ccc;--sapTile_Interactive_BorderColor: #b3b3b3;--sapTile_OverlayBackground: #fff;--sapTile_OverlayForegroundColor: #1d2d3e;--sapAccentColor1: #d27700;--sapAccentColor2: #aa0808;--sapAccentColor3: #ba066c;--sapAccentColor4: #a100c2;--sapAccentColor5: #5d36ff;--sapAccentColor6: #0057d2;--sapAccentColor7: #046c7a;--sapAccentColor8: #256f3a;--sapAccentColor9: #6c32a9;--sapAccentColor10: #5b738b;--sapAccentBackgroundColor1: #fff3b8;--sapAccentBackgroundColor2: #ffd0e7;--sapAccentBackgroundColor3: #ffdbe7;--sapAccentBackgroundColor4: #ffdcf3;--sapAccentBackgroundColor5: #ded3ff;--sapAccentBackgroundColor6: #d1efff;--sapAccentBackgroundColor7: #c2fcee;--sapAccentBackgroundColor8: #ebf5cb;--sapAccentBackgroundColor9: #ddccf0;--sapAccentBackgroundColor10: #eaecee;--sapIndicationColor_1: #840606;--sapIndicationColor_1_Background: #840606;--sapIndicationColor_1_BorderColor: #840606;--sapIndicationColor_1_TextColor: #fff;--sapIndicationColor_1_Hover_Background: #6c0505;--sapIndicationColor_1_Active_Background: #fff;--sapIndicationColor_1_Active_BorderColor: #fb9d9d;--sapIndicationColor_1_Active_TextColor: #840606;--sapIndicationColor_1_Selected_Background: #fff;--sapIndicationColor_1_Selected_BorderColor: #fb9d9d;--sapIndicationColor_1_Selected_TextColor: #840606;--sapIndicationColor_1b: #fb9d9d;--sapIndicationColor_1b_BorderColor: #fb9d9d;--sapIndicationColor_1b_Hover_Background: #fa8585;--sapIndicationColor_2: #aa0808;--sapIndicationColor_2_Background: #aa0808;--sapIndicationColor_2_BorderColor: #aa0808;--sapIndicationColor_2_TextColor: #fff;--sapIndicationColor_2_Hover_Background: #920707;--sapIndicationColor_2_Active_Background: #fff;--sapIndicationColor_2_Active_BorderColor: #fcc4c4;--sapIndicationColor_2_Active_TextColor: #aa0808;--sapIndicationColor_2_Selected_Background: #fff;--sapIndicationColor_2_Selected_BorderColor: #fcc4c4;--sapIndicationColor_2_Selected_TextColor: #aa0808;--sapIndicationColor_2b: #fcc4c4;--sapIndicationColor_2b_BorderColor: #fcc4c4;--sapIndicationColor_2b_Hover_Background: #fbacac;--sapIndicationColor_3: #b95100;--sapIndicationColor_3_Background: #e76500;--sapIndicationColor_3_BorderColor: #e76500;--sapIndicationColor_3_TextColor: #fff;--sapIndicationColor_3_Hover_Background: #d85e00;--sapIndicationColor_3_Active_Background: #fff;--sapIndicationColor_3_Active_BorderColor: #fff2c0;--sapIndicationColor_3_Active_TextColor: #b95100;--sapIndicationColor_3_Selected_Background: #fff;--sapIndicationColor_3_Selected_BorderColor: #fff2c0;--sapIndicationColor_3_Selected_TextColor: #b95100;--sapIndicationColor_3b: #fff2c0;--sapIndicationColor_3b_BorderColor: #fff2c0;--sapIndicationColor_3b_Hover_Background: #ffeda6;--sapIndicationColor_4: #256f3a;--sapIndicationColor_4_Background: #256f3a;--sapIndicationColor_4_BorderColor: #256f3a;--sapIndicationColor_4_TextColor: #fff;--sapIndicationColor_4_Hover_Background: #1f5c30;--sapIndicationColor_4_Active_Background: #fff;--sapIndicationColor_4_Active_BorderColor: #bae8bc;--sapIndicationColor_4_Active_TextColor: #256f3a;--sapIndicationColor_4_Selected_Background: #fff;--sapIndicationColor_4_Selected_BorderColor: #bae8bc;--sapIndicationColor_4_Selected_TextColor: #256f3a;--sapIndicationColor_4b: #bae8bc;--sapIndicationColor_4b_BorderColor: #bae8bc;--sapIndicationColor_4b_Hover_Background: #a7e2a9;--sapIndicationColor_5: #0070f2;--sapIndicationColor_5_Background: #0070f2;--sapIndicationColor_5_BorderColor: #0070f2;--sapIndicationColor_5_TextColor: #fff;--sapIndicationColor_5_Hover_Background: #0064d9;--sapIndicationColor_5_Active_Background: #fff;--sapIndicationColor_5_Active_BorderColor: #d3effd;--sapIndicationColor_5_Active_TextColor: #0070f2;--sapIndicationColor_5_Selected_Background: #fff;--sapIndicationColor_5_Selected_BorderColor: #d3effd;--sapIndicationColor_5_Selected_TextColor: #0070f2;--sapIndicationColor_5b: #d3effd;--sapIndicationColor_5b_BorderColor: #d3effd;--sapIndicationColor_5b_Hover_Background: #bbe6fc;--sapIndicationColor_6: #046c7a;--sapIndicationColor_6_Background: #046c7a;--sapIndicationColor_6_BorderColor: #046c7a;--sapIndicationColor_6_TextColor: #fff;--sapIndicationColor_6_Hover_Background: #035661;--sapIndicationColor_6_Active_Background: #fff;--sapIndicationColor_6_Active_BorderColor: #cdf5ec;--sapIndicationColor_6_Active_TextColor: #046c7a;--sapIndicationColor_6_Selected_Background: #fff;--sapIndicationColor_6_Selected_BorderColor: #cdf5ec;--sapIndicationColor_6_Selected_TextColor: #046c7a;--sapIndicationColor_6b: #cdf5ec;--sapIndicationColor_6b_BorderColor: #cdf5ec;--sapIndicationColor_6b_Hover_Background: #b8f1e4;--sapIndicationColor_7: #5d36ff;--sapIndicationColor_7_Background: #5d36ff;--sapIndicationColor_7_BorderColor: #5d36ff;--sapIndicationColor_7_TextColor: #fff;--sapIndicationColor_7_Hover_Background: #481cff;--sapIndicationColor_7_Active_Background: #fff;--sapIndicationColor_7_Active_BorderColor: #e2dbff;--sapIndicationColor_7_Active_TextColor: #5d36ff;--sapIndicationColor_7_Selected_Background: #fff;--sapIndicationColor_7_Selected_BorderColor: #e2dbff;--sapIndicationColor_7_Selected_TextColor: #5d36ff;--sapIndicationColor_7b: #e2dbff;--sapIndicationColor_7b_BorderColor: #e2dbff;--sapIndicationColor_7b_Hover_Background: #cdc2ff;--sapIndicationColor_8: #a100c2;--sapIndicationColor_8_Background: #a100c2;--sapIndicationColor_8_BorderColor: #a100c2;--sapIndicationColor_8_TextColor: #fff;--sapIndicationColor_8_Hover_Background: #8c00a9;--sapIndicationColor_8_Active_Background: #fff;--sapIndicationColor_8_Active_BorderColor: #f8d6ff;--sapIndicationColor_8_Active_TextColor: #a100c2;--sapIndicationColor_8_Selected_Background: #fff;--sapIndicationColor_8_Selected_BorderColor: #f8d6ff;--sapIndicationColor_8_Selected_TextColor: #a100c2;--sapIndicationColor_8b: #f8d6ff;--sapIndicationColor_8b_BorderColor: #f8d6ff;--sapIndicationColor_8b_Hover_Background: #f4bdff;--sapIndicationColor_9: #1d2d3e;--sapIndicationColor_9_Background: #1d2d3e;--sapIndicationColor_9_BorderColor: #1d2d3e;--sapIndicationColor_9_TextColor: #fff;--sapIndicationColor_9_Hover_Background: #15202d;--sapIndicationColor_9_Active_Background: #fff;--sapIndicationColor_9_Active_BorderColor: #d9d9d9;--sapIndicationColor_9_Active_TextColor: #1d2d3e;--sapIndicationColor_9_Selected_Background: #fff;--sapIndicationColor_9_Selected_BorderColor: #d9d9d9;--sapIndicationColor_9_Selected_TextColor: #1d2d3e;--sapIndicationColor_9b: #fff;--sapIndicationColor_9b_BorderColor: #d9d9d9;--sapIndicationColor_9b_Hover_Background: #f2f2f2;--sapIndicationColor_10: #45484a;--sapIndicationColor_10_Background: #83888b;--sapIndicationColor_10_BorderColor: #83888b;--sapIndicationColor_10_TextColor: #fff;--sapIndicationColor_10_Hover_Background: #767b7e;--sapIndicationColor_10_Active_Background: #fff;--sapIndicationColor_10_Active_BorderColor: #eaecee;--sapIndicationColor_10_Active_TextColor: #45484a;--sapIndicationColor_10_Selected_Background: #fff;--sapIndicationColor_10_Selected_BorderColor: #eaecee;--sapIndicationColor_10_Selected_TextColor: #45484a;--sapIndicationColor_10b: #eaecee;--sapIndicationColor_10b_BorderColor: #eaecee;--sapIndicationColor_10b_Hover_Background: #dcdfe3;--sapLegend_WorkingBackground: #fff;--sapLegend_NonWorkingBackground: #ebebeb;--sapLegend_CurrentDateTime: #a100c2;--sapLegendColor1: #c35500;--sapLegendColor2: #d23a0a;--sapLegendColor3: #df1278;--sapLegendColor4: #840606;--sapLegendColor5: #cc00dc;--sapLegendColor6: #0057d2;--sapLegendColor7: #07838f;--sapLegendColor8: #188918;--sapLegendColor9: #5b738b;--sapLegendColor10: #7800a4;--sapLegendColor11: #a93e00;--sapLegendColor12: #aa2608;--sapLegendColor13: #ba066c;--sapLegendColor14: #8d2a00;--sapLegendColor15: #4e247a;--sapLegendColor16: #002a86;--sapLegendColor17: #035663;--sapLegendColor18: #1e592f;--sapLegendColor19: #1a4796;--sapLegendColor20: #470ced;--sapLegendBackgroundColor1: #ffef9f;--sapLegendBackgroundColor2: #feeae1;--sapLegendBackgroundColor3: #fbf6f8;--sapLegendBackgroundColor4: #fbebeb;--sapLegendBackgroundColor5: #ffe5fe;--sapLegendBackgroundColor6: #d1efff;--sapLegendBackgroundColor7: #c2fcee;--sapLegendBackgroundColor8: #f5fae5;--sapLegendBackgroundColor9: #f5f6f7;--sapLegendBackgroundColor10: #fff0fa;--sapLegendBackgroundColor11: #fff8d6;--sapLegendBackgroundColor12: #fff6f6;--sapLegendBackgroundColor13: #f7ebef;--sapLegendBackgroundColor14: #f1ecd5;--sapLegendBackgroundColor15: #f0e7f8;--sapLegendBackgroundColor16: #ebf8ff;--sapLegendBackgroundColor17: #dafdf5;--sapLegendBackgroundColor18: #ebf5cb;--sapLegendBackgroundColor19: #fafdff;--sapLegendBackgroundColor20: #eceeff;--sapChart_Background: #fff;--sapChart_ContrastTextShadow: 0 0 .0625rem rgba(0,0,0,.7);--sapChart_ContrastShadowColor: #fff;--sapChart_ContrastLineColor: #fff;--sapChart_LineColor_1: #e1e6eb;--sapChart_LineColor_2: #768da4;--sapChart_LineColor_3: #000001;--sapChart_Choropleth_Background: #edf0f3;--sapChart_ChoroplethRegion_Background: #758ca4;--sapChart_ChoroplethRegion_BorderColor: #edf0f3;--sapChart_Data_TextColor: #000;--sapChart_Data_ContrastTextColor: #fff;--sapChart_Data_InteractiveColor: #000001;--sapChart_Data_Active_Background: #dee2e5;--sapChart_OrderedColor_1: #3278be;--sapChart_OrderedColor_2: #c87b00;--sapChart_OrderedColor_3: #75980b;--sapChart_OrderedColor_4: #df1278;--sapChart_OrderedColor_5: #8b47d7;--sapChart_OrderedColor_6: #049f9a;--sapChart_OrderedColor_7: #0070f2;--sapChart_OrderedColor_8: #cc00dc;--sapChart_OrderedColor_9: #798c77;--sapChart_OrderedColor_10: #da6c6c;--sapChart_OrderedColor_11: #5d36ff;--sapChart_OrderedColor_12: #a68a5b;--sapChart_Bad: #f53232;--sapChart_Critical: #e26300;--sapChart_Good: #30914c;--sapChart_Neutral: #758ca4;--sapChart_Sequence_1_Plus3: #84b8eb;--sapChart_Sequence_1_Plus3_TextColor: #000;--sapChart_Sequence_1_Plus3_TextShadow: 0 0 .125rem #fff;--sapChart_Sequence_1_Plus2: #468acd;--sapChart_Sequence_1_Plus2_TextColor: #000;--sapChart_Sequence_1_Plus2_TextShadow: 0 0 .125rem #fff;--sapChart_Sequence_1_Plus1: #3c8cdd;--sapChart_Sequence_1_Plus1_TextColor: #000;--sapChart_Sequence_1_Plus1_TextShadow: 0 0 .125rem #fff;--sapChart_Sequence_1: #3278be;--sapChart_Sequence_1_TextColor: #fff;--sapChart_Sequence_1_TextShadow: 0 0 .125rem #223548;--sapChart_Sequence_1_BorderColor: #3278be;--sapChart_Sequence_1_Minus1: #31669c;--sapChart_Sequence_1_Minus1_TextColor: #fff;--sapChart_Sequence_1_Minus1_TextShadow: 0 0 .125rem #223548;--sapChart_Sequence_1_Minus2: #31669c;--sapChart_Sequence_1_Minus2_TextColor: #fff;--sapChart_Sequence_1_Minus2_TextShadow: 0 0 .125rem #223548;--sapChart_Sequence_1_Minus3: #204060;--sapChart_Sequence_1_Minus3_TextColor: #fff;--sapChart_Sequence_1_Minus3_TextShadow: 0 0 .125rem #223548;--sapChart_Sequence_1_Minus4: #19334e;--sapChart_Sequence_1_Minus4_TextColor: #fff;--sapChart_Sequence_1_Minus4_TextShadow: 0 0 .125rem #223548;--sapChart_Sequence_1_Minus5: #13263a;--sapChart_Sequence_1_Minus5_TextColor: #fff;--sapChart_Sequence_1_Minus5_TextShadow: 0 0 .125rem #223548;--sapChart_Sequence_2_Plus3: #efbf72;--sapChart_Sequence_2_Plus3_TextColor: #000;--sapChart_Sequence_2_Plus3_TextShadow: 0 0 .125rem #fff;--sapChart_Sequence_2_Plus2: #eaaa44;--sapChart_Sequence_2_Plus2_TextColor: #000;--sapChart_Sequence_2_Plus2_TextShadow: 0 0 .125rem #fff;--sapChart_Sequence_2_Plus1: #e29419;--sapChart_Sequence_2_Plus1_TextColor: #000;--sapChart_Sequence_2_Plus1_TextShadow: 0 0 .125rem #fff;--sapChart_Sequence_2: #c87b00;--sapChart_Sequence_2_TextColor: #000;--sapChart_Sequence_2_TextShadow: 0 0 .125rem #fff;--sapChart_Sequence_2_BorderColor: #9f6200;--sapChart_Sequence_2_Minus1: #9f6200;--sapChart_Sequence_2_Minus1_TextColor: #fff;--sapChart_Sequence_2_Minus1_TextShadow: 0 0 .125rem #223548;--sapChart_Sequence_2_Minus2: #7c4c00;--sapChart_Sequence_2_Minus2_TextColor: #fff;--sapChart_Sequence_2_Minus2_TextShadow: 0 0 .125rem #223548;--sapChart_Sequence_2_Minus3: #623c00;--sapChart_Sequence_2_Minus3_TextColor: #fff;--sapChart_Sequence_2_Minus3_TextShadow: 0 0 .125rem #223548;--sapChart_Sequence_2_Minus4: #623c00;--sapChart_Sequence_2_Minus4_TextColor: #fff;--sapChart_Sequence_2_Minus4_TextShadow: 0 0 .125rem #223548;--sapChart_Sequence_2_Minus5: #2f1d00;--sapChart_Sequence_2_Minus5_TextColor: #fff;--sapChart_Sequence_2_Minus5_TextShadow: 0 0 .125rem #223548;--sapChart_Sequence_3_Plus3: #b9d369;--sapChart_Sequence_3_Plus3_TextColor: #000;--sapChart_Sequence_3_Plus3_TextShadow: 0 0 .125rem #fff;--sapChart_Sequence_3_Plus2: #a6c742;--sapChart_Sequence_3_Plus2_TextColor: #000;--sapChart_Sequence_3_Plus2_TextShadow: 0 0 .125rem #fff;--sapChart_Sequence_3_Plus1: #8fad33;--sapChart_Sequence_3_Plus1_TextColor: #000;--sapChart_Sequence_3_Plus1_TextShadow: 0 0 .125rem #fff;--sapChart_Sequence_3: #75980b;--sapChart_Sequence_3_TextColor: #000;--sapChart_Sequence_3_TextShadow: 0 0 .125rem #fff;--sapChart_Sequence_3_BorderColor: #587208;--sapChart_Sequence_3_Minus1: #587208;--sapChart_Sequence_3_Minus1_TextColor: #fff;--sapChart_Sequence_3_Minus1_TextShadow: 0 0 .125rem #223548;--sapChart_Sequence_3_Minus2: #3e5106;--sapChart_Sequence_3_Minus2_TextColor: #fff;--sapChart_Sequence_3_Minus2_TextShadow: 0 0 .125rem #223548;--sapChart_Sequence_3_Minus3: #2c3904;--sapChart_Sequence_3_Minus3_TextColor: #fff;--sapChart_Sequence_3_Minus3_TextShadow: 0 0 .125rem #223548;--sapChart_Sequence_3_Minus4: #212b03;--sapChart_Sequence_3_Minus4_TextColor: #fff;--sapChart_Sequence_3_Minus4_TextShadow: 0 0 .125rem #223548;--sapChart_Sequence_3_Minus5: #161c02;--sapChart_Sequence_3_Minus5_TextColor: #fff;--sapChart_Sequence_3_Minus5_TextShadow: 0 0 .125rem #223548;--sapChart_Sequence_4_Plus3: #f473b3;--sapChart_Sequence_4_Plus3_TextColor: #000;--sapChart_Sequence_4_Plus3_TextShadow: 0 0 .125rem #fff;--sapChart_Sequence_4_Plus2: #f14d9e;--sapChart_Sequence_4_Plus2_TextColor: #000;--sapChart_Sequence_4_Plus2_TextShadow: 0 0 .125rem #fff;--sapChart_Sequence_4_Plus1: #ee278a;--sapChart_Sequence_4_Plus1_TextColor: #000;--sapChart_Sequence_4_Plus1_TextShadow: 0 0 .125rem #fff;--sapChart_Sequence_4: #df1278;--sapChart_Sequence_4_TextColor: #fff;--sapChart_Sequence_4_TextShadow: 0 0 .125rem #223548;--sapChart_Sequence_4_BorderColor: #df1278;--sapChart_Sequence_4_Minus1: #b90f64;--sapChart_Sequence_4_Minus1_TextColor: #fff;--sapChart_Sequence_4_Minus1_TextShadow: 0 0 .125rem #223548;--sapChart_Sequence_4_Minus2: #930c4f;--sapChart_Sequence_4_Minus2_TextColor: #fff;--sapChart_Sequence_4_Minus2_TextShadow: 0 0 .125rem #223548;--sapChart_Sequence_4_Minus3: #770a40;--sapChart_Sequence_4_Minus3_TextColor: #fff;--sapChart_Sequence_4_Minus3_TextShadow: 0 0 .125rem #223548;--sapChart_Sequence_4_Minus4: #51072c;--sapChart_Sequence_4_Minus4_TextColor: #fff;--sapChart_Sequence_4_Minus4_TextShadow: 0 0 .125rem #223548;--sapChart_Sequence_4_Minus5: #3a051f;--sapChart_Sequence_4_Minus5_TextColor: #fff;--sapChart_Sequence_4_Minus5_TextShadow: 0 0 .125rem #223548;--sapChart_Sequence_5_Plus3: #d5bcf0;--sapChart_Sequence_5_Plus3_TextColor: #000;--sapChart_Sequence_5_Plus3_TextShadow: 0 0 .125rem #fff;--sapChart_Sequence_5_Plus2: #b994e0;--sapChart_Sequence_5_Plus2_TextColor: #000;--sapChart_Sequence_5_Plus2_TextShadow: 0 0 .125rem #fff;--sapChart_Sequence_5_Plus1: #a679d8;--sapChart_Sequence_5_Plus1_TextColor: #000;--sapChart_Sequence_5_Plus1_TextShadow: 0 0 .125rem #fff;--sapChart_Sequence_5: #8b47d7;--sapChart_Sequence_5_TextColor: #fff;--sapChart_Sequence_5_TextShadow: 0 0 .125rem #223548;--sapChart_Sequence_5_BorderColor: #8b47d7;--sapChart_Sequence_5_Minus1: #7236b5;--sapChart_Sequence_5_Minus1_TextColor: #fff;--sapChart_Sequence_5_Minus1_TextShadow: 0 0 .125rem #223548;--sapChart_Sequence_5_Minus2: #5e2c96;--sapChart_Sequence_5_Minus2_TextColor: #fff;--sapChart_Sequence_5_Minus2_TextShadow: 0 0 .125rem #223548;--sapChart_Sequence_5_Minus3: #522682;--sapChart_Sequence_5_Minus3_TextColor: #fff;--sapChart_Sequence_5_Minus3_TextShadow: 0 0 .125rem #223548;--sapChart_Sequence_5_Minus4: #46216f;--sapChart_Sequence_5_Minus4_TextColor: #fff;--sapChart_Sequence_5_Minus4_TextShadow: 0 0 .125rem #223548;--sapChart_Sequence_5_Minus5: #341358;--sapChart_Sequence_5_Minus5_TextColor: #fff;--sapChart_Sequence_5_Minus5_TextShadow: 0 0 .125rem #223548;--sapChart_Sequence_6_Plus3: #64ede9;--sapChart_Sequence_6_Plus3_TextColor: #000;--sapChart_Sequence_6_Plus3_TextShadow: 0 0 .125rem #fff;--sapChart_Sequence_6_Plus2: #2ee0da;--sapChart_Sequence_6_Plus2_TextColor: #000;--sapChart_Sequence_6_Plus2_TextShadow: 0 0 .125rem #fff;--sapChart_Sequence_6_Plus1: #05c7c1;--sapChart_Sequence_6_Plus1_TextColor: #000;--sapChart_Sequence_6_Plus1_TextShadow: 0 0 .125rem #fff;--sapChart_Sequence_6: #049f9a;--sapChart_Sequence_6_TextColor: #000;--sapChart_Sequence_6_TextShadow: 0 0 .125rem #fff;--sapChart_Sequence_6_BorderColor: #05c7c1;--sapChart_Sequence_6_Minus1: #02837f;--sapChart_Sequence_6_Minus1_TextColor: #fff;--sapChart_Sequence_6_Minus1_TextShadow: 0 0 .125rem #223548;--sapChart_Sequence_6_Minus2: #006663;--sapChart_Sequence_6_Minus2_TextColor: #fff;--sapChart_Sequence_6_Minus2_TextShadow: 0 0 .125rem #223548;--sapChart_Sequence_6_Minus3: #00514f;--sapChart_Sequence_6_Minus3_TextColor: #fff;--sapChart_Sequence_6_Minus3_TextShadow: 0 0 .125rem #223548;--sapChart_Sequence_6_Minus4: #003d3b;--sapChart_Sequence_6_Minus4_TextColor: #fff;--sapChart_Sequence_6_Minus4_TextShadow: 0 0 .125rem #223548;--sapChart_Sequence_6_Minus5: #002322;--sapChart_Sequence_6_Minus5_TextColor: #fff;--sapChart_Sequence_6_Minus5_TextShadow: 0 0 .125rem #223548;--sapChart_Sequence_7_Plus3: #68aeff;--sapChart_Sequence_7_Plus3_TextColor: #000;--sapChart_Sequence_7_Plus3_TextShadow: 0 0 .125rem #fff;--sapChart_Sequence_7_Plus2: #4098ff;--sapChart_Sequence_7_Plus2_TextColor: #000;--sapChart_Sequence_7_Plus2_TextShadow: 0 0 .125rem #fff;--sapChart_Sequence_7_Plus1: #1c85ff;--sapChart_Sequence_7_Plus1_TextColor: #000;--sapChart_Sequence_7_Plus1_TextShadow: 0 0 .125rem #fff;--sapChart_Sequence_7: #0070f2;--sapChart_Sequence_7_TextColor: #fff;--sapChart_Sequence_7_TextShadow: 0 0 .125rem #223548;--sapChart_Sequence_7_BorderColor: #0070f2;--sapChart_Sequence_7_Minus1: #0062d3;--sapChart_Sequence_7_Minus1_TextColor: #fff;--sapChart_Sequence_7_Minus1_TextShadow: 0 0 .125rem #223548;--sapChart_Sequence_7_Minus2: #0054b5;--sapChart_Sequence_7_Minus2_TextColor: #fff;--sapChart_Sequence_7_Minus2_TextShadow: 0 0 .125rem #223548;--sapChart_Sequence_7_Minus3: #00418c;--sapChart_Sequence_7_Minus3_TextColor: #fff;--sapChart_Sequence_7_Minus3_TextShadow: 0 0 .125rem #223548;--sapChart_Sequence_7_Minus4: #00244f;--sapChart_Sequence_7_Minus4_TextColor: #fff;--sapChart_Sequence_7_Minus4_TextShadow: 0 0 .125rem #223548;--sapChart_Sequence_7_Minus5: #001b3a;--sapChart_Sequence_7_Minus5_TextColor: #fff;--sapChart_Sequence_7_Minus5_TextShadow: 0 0 .125rem #223548;--sapChart_Sequence_8_Plus3: #f462ff;--sapChart_Sequence_8_Plus3_TextColor: #000;--sapChart_Sequence_8_Plus3_TextShadow: 0 0 .125rem #fff;--sapChart_Sequence_8_Plus2: #f034ff;--sapChart_Sequence_8_Plus2_TextColor: #000;--sapChart_Sequence_8_Plus2_TextShadow: 0 0 .125rem #fff;--sapChart_Sequence_8_Plus1: #ed0bff;--sapChart_Sequence_8_Plus1_TextColor: #000;--sapChart_Sequence_8_Plus1_TextShadow: 0 0 .125rem #fff;--sapChart_Sequence_8: #cc00dc;--sapChart_Sequence_8_TextColor: #fff;--sapChart_Sequence_8_TextShadow: 0 0 .125rem #223548;--sapChart_Sequence_8_BorderColor: #cc00dc;--sapChart_Sequence_8_Minus1: #a600b3;--sapChart_Sequence_8_Minus1_TextColor: #fff;--sapChart_Sequence_8_Minus1_TextShadow: 0 0 .125rem #223548;--sapChart_Sequence_8_Minus2: #80008a;--sapChart_Sequence_8_Minus2_TextColor: #fff;--sapChart_Sequence_8_Minus2_TextShadow: 0 0 .125rem #223548;--sapChart_Sequence_8_Minus3: #6d0076;--sapChart_Sequence_8_Minus3_TextColor: #fff;--sapChart_Sequence_8_Minus3_TextShadow: 0 0 .125rem #223548;--sapChart_Sequence_8_Minus4: #56005d;--sapChart_Sequence_8_Minus4_TextColor: #fff;--sapChart_Sequence_8_Minus4_TextShadow: 0 0 .125rem #223548;--sapChart_Sequence_8_Minus5: #350039;--sapChart_Sequence_8_Minus5_TextColor: #fff;--sapChart_Sequence_8_Minus5_TextShadow: 0 0 .125rem #223548;--sapChart_Sequence_9_Plus3: #bdc6bc;--sapChart_Sequence_9_Plus3_TextColor: #000;--sapChart_Sequence_9_Plus3_TextShadow: 0 0 .125rem #fff;--sapChart_Sequence_9_Plus2: #b5bfb4;--sapChart_Sequence_9_Plus2_TextColor: #000;--sapChart_Sequence_9_Plus2_TextShadow: 0 0 .125rem #fff;--sapChart_Sequence_9_Plus1: #97a695;--sapChart_Sequence_9_Plus1_TextColor: #000;--sapChart_Sequence_9_Plus1_TextShadow: 0 0 .125rem #fff;--sapChart_Sequence_9: #798c77;--sapChart_Sequence_9_TextColor: #000;--sapChart_Sequence_9_TextShadow: 0 0 .125rem #fff;--sapChart_Sequence_9_BorderColor: #798c77;--sapChart_Sequence_9_Minus1: #667664;--sapChart_Sequence_9_Minus1_TextColor: #fff;--sapChart_Sequence_9_Minus1_TextShadow: 0 0 .125rem #223548;--sapChart_Sequence_9_Minus2: #536051;--sapChart_Sequence_9_Minus2_TextColor: #fff;--sapChart_Sequence_9_Minus2_TextShadow: 0 0 .125rem #223548;--sapChart_Sequence_9_Minus3: #404a3f;--sapChart_Sequence_9_Minus3_TextColor: #fff;--sapChart_Sequence_9_Minus3_TextShadow: 0 0 .125rem #223548;--sapChart_Sequence_9_Minus4: #2d342c;--sapChart_Sequence_9_Minus4_TextColor: #fff;--sapChart_Sequence_9_Minus4_TextShadow: 0 0 .125rem #223548;--sapChart_Sequence_9_Minus5: #1e231e;--sapChart_Sequence_9_Minus5_TextColor: #fff;--sapChart_Sequence_9_Minus5_TextShadow: 0 0 .125rem #223548;--sapChart_Sequence_10_Plus3: #f1c6c6;--sapChart_Sequence_10_Plus3_TextColor: #000;--sapChart_Sequence_10_Plus3_TextShadow: 0 0 .125rem #fff;--sapChart_Sequence_10_Plus2: #eaadad;--sapChart_Sequence_10_Plus2_TextColor: #000;--sapChart_Sequence_10_Plus2_TextShadow: 0 0 .125rem #fff;--sapChart_Sequence_10_Plus1: #e28d8d;--sapChart_Sequence_10_Plus1_TextColor: #000;--sapChart_Sequence_10_Plus1_TextShadow: 0 0 .125rem #fff;--sapChart_Sequence_10: #da6c6c;--sapChart_Sequence_10_TextColor: #000;--sapChart_Sequence_10_TextShadow: 0 0 .125rem #fff;--sapChart_Sequence_10_BorderColor: #b75757;--sapChart_Sequence_10_Minus1: #b75757;--sapChart_Sequence_10_Minus1_TextColor: #000;--sapChart_Sequence_10_Minus1_TextShadow: 0 0 .125rem #fff;--sapChart_Sequence_10_Minus2: #9d4343;--sapChart_Sequence_10_Minus2_TextColor: #fff;--sapChart_Sequence_10_Minus2_TextShadow: 0 0 .125rem #223548;--sapChart_Sequence_10_Minus3: #803737;--sapChart_Sequence_10_Minus3_TextColor: #fff;--sapChart_Sequence_10_Minus3_TextShadow: 0 0 .125rem #223548;--sapChart_Sequence_10_Minus4: #672c2c;--sapChart_Sequence_10_Minus4_TextColor: #fff;--sapChart_Sequence_10_Minus4_TextShadow: 0 0 .125rem #223548;--sapChart_Sequence_10_Minus5: #562424;--sapChart_Sequence_10_Minus5_TextColor: #fff;--sapChart_Sequence_10_Minus5_TextShadow: 0 0 .125rem #223548;--sapChart_Sequence_11_Plus3: #c0b0ff;--sapChart_Sequence_11_Plus3_TextColor: #000;--sapChart_Sequence_11_Plus3_TextShadow: 0 0 .125rem #fff;--sapChart_Sequence_11_Plus2: #9b83ff;--sapChart_Sequence_11_Plus2_TextColor: #000;--sapChart_Sequence_11_Plus2_TextShadow: 0 0 .125rem #fff;--sapChart_Sequence_11_Plus1: #8669ff;--sapChart_Sequence_11_Plus1_TextColor: #000;--sapChart_Sequence_11_Plus1_TextShadow: 0 0 .125rem #fff;--sapChart_Sequence_11: #5d36ff;--sapChart_Sequence_11_TextColor: #fff;--sapChart_Sequence_11_TextShadow: 0 0 .125rem #223548;--sapChart_Sequence_11_BorderColor: #5d36ff;--sapChart_Sequence_11_Minus1: #4b25e7;--sapChart_Sequence_11_Minus1_TextColor: #fff;--sapChart_Sequence_11_Minus1_TextShadow: 0 0 .125rem #223548;--sapChart_Sequence_11_Minus2: #3a17cd;--sapChart_Sequence_11_Minus2_TextColor: #fff;--sapChart_Sequence_11_Minus2_TextShadow: 0 0 .125rem #223548;--sapChart_Sequence_11_Minus3: #2f13a8;--sapChart_Sequence_11_Minus3_TextColor: #fff;--sapChart_Sequence_11_Minus3_TextShadow: 0 0 .125rem #223548;--sapChart_Sequence_11_Minus4: #250f83;--sapChart_Sequence_11_Minus4_TextColor: #fff;--sapChart_Sequence_11_Minus4_TextShadow: 0 0 .125rem #223548;--sapChart_Sequence_11_Minus5: #2f13a8;--sapChart_Sequence_11_Minus5_TextColor: #fff;--sapChart_Sequence_11_Minus5_TextShadow: 0 0 .125rem #223548;--sapChart_Sequence_12_Plus3: #e4ddcf;--sapChart_Sequence_12_Plus3_TextColor: #000;--sapChart_Sequence_12_Plus3_TextShadow: 0 0 .125rem #fff;--sapChart_Sequence_12_Plus2: #dacebb;--sapChart_Sequence_12_Plus2_TextColor: #000;--sapChart_Sequence_12_Plus2_TextShadow: 0 0 .125rem #fff;--sapChart_Sequence_12_Plus1: #c4b293;--sapChart_Sequence_12_Plus1_TextColor: #000;--sapChart_Sequence_12_Plus1_TextShadow: 0 0 .125rem #fff;--sapChart_Sequence_12: #a68a5b;--sapChart_Sequence_12_TextColor: #000;--sapChart_Sequence_12_TextShadow: 0 0 .125rem #fff;--sapChart_Sequence_12_BorderColor: #a68a5b;--sapChart_Sequence_12_Minus1: #8c744c;--sapChart_Sequence_12_Minus1_TextColor: #fff;--sapChart_Sequence_12_Minus1_TextShadow: 0 0 .125rem #223548;--sapChart_Sequence_12_Minus2: #786441;--sapChart_Sequence_12_Minus2_TextColor: #fff;--sapChart_Sequence_12_Minus2_TextShadow: 0 0 .125rem #223548;--sapChart_Sequence_12_Minus3: #5e4e33;--sapChart_Sequence_12_Minus3_TextColor: #fff;--sapChart_Sequence_12_Minus3_TextShadow: 0 0 .125rem #223548;--sapChart_Sequence_12_Minus4: #433825;--sapChart_Sequence_12_Minus4_TextColor: #fff;--sapChart_Sequence_12_Minus4_TextShadow: 0 0 .125rem #223548;--sapChart_Sequence_12_Minus5: #30271a;--sapChart_Sequence_12_Minus5_TextColor: #fff;--sapChart_Sequence_12_Minus5_TextShadow: 0 0 .125rem #223548;--sapChart_Sequence_Bad_Plus3: #fdcece;--sapChart_Sequence_Bad_Plus3_TextColor: #000;--sapChart_Sequence_Bad_Plus3_TextShadow: 0 0 .125rem #fff;--sapChart_Sequence_Bad_Plus2: #fa9d9d;--sapChart_Sequence_Bad_Plus2_TextColor: #000;--sapChart_Sequence_Bad_Plus2_TextShadow: 0 0 .125rem #fff;--sapChart_Sequence_Bad_Plus1: #f86c6c;--sapChart_Sequence_Bad_Plus1_TextColor: #000;--sapChart_Sequence_Bad_Plus1_TextShadow: 0 0 .125rem #fff;--sapChart_Sequence_Bad: #f53232;--sapChart_Sequence_Bad_TextColor: #000;--sapChart_Sequence_Bad_TextShadow: 0 0 .125rem #fff;--sapChart_Sequence_Bad_BorderColor: #f53232;--sapChart_Sequence_Bad_Minus1: #d00a0a;--sapChart_Sequence_Bad_Minus1_TextColor: #fff;--sapChart_Sequence_Bad_Minus1_TextShadow: 0 0 .125rem #223548;--sapChart_Sequence_Bad_Minus2: #a90808;--sapChart_Sequence_Bad_Minus2_TextColor: #fff;--sapChart_Sequence_Bad_Minus2_TextShadow: 0 0 .125rem #223548;--sapChart_Sequence_Bad_Minus3: #830606;--sapChart_Sequence_Bad_Minus3_TextColor: #fff;--sapChart_Sequence_Bad_Minus3_TextShadow: 0 0 .125rem #223548;--sapChart_Sequence_Bad_Minus4: #570404;--sapChart_Sequence_Bad_Minus4_TextColor: #fff;--sapChart_Sequence_Bad_Minus4_TextShadow: 0 0 .125rem #223548;--sapChart_Sequence_Bad_Minus5: #320000;--sapChart_Sequence_Bad_Minus5_TextColor: #fff;--sapChart_Sequence_Bad_Minus5_TextShadow: 0 0 .125rem #223548;--sapChart_Sequence_Critical_Plus3: #ffb881;--sapChart_Sequence_Critical_Plus3_TextColor: #000;--sapChart_Sequence_Critical_Plus3_TextShadow: 0 0 .125rem #fff;--sapChart_Sequence_Critical_Plus2: #ff933f;--sapChart_Sequence_Critical_Plus2_TextColor: #000;--sapChart_Sequence_Critical_Plus2_TextShadow: 0 0 .125rem #fff;--sapChart_Sequence_Critical_Plus1: #ff760c;--sapChart_Sequence_Critical_Plus1_TextColor: #000;--sapChart_Sequence_Critical_Plus1_TextShadow: 0 0 .125rem #fff;--sapChart_Sequence_Critical: #e26300;--sapChart_Sequence_Critical_TextColor: #000;--sapChart_Sequence_Critical_TextShadow: 0 0 .125rem #fff;--sapChart_Sequence_Critical_BorderColor: #e26300;--sapChart_Sequence_Critical_Minus1: #c35600;--sapChart_Sequence_Critical_Minus1_TextColor: #fff;--sapChart_Sequence_Critical_Minus1_TextShadow: 0 0 .125rem #223548;--sapChart_Sequence_Critical_Minus2: #aa4a00;--sapChart_Sequence_Critical_Minus2_TextColor: #fff;--sapChart_Sequence_Critical_Minus2_TextShadow: 0 0 .125rem #223548;--sapChart_Sequence_Critical_Minus3: #903f00;--sapChart_Sequence_Critical_Minus3_TextColor: #fff;--sapChart_Sequence_Critical_Minus3_TextShadow: 0 0 .125rem #223548;--sapChart_Sequence_Critical_Minus4: #6d3000;--sapChart_Sequence_Critical_Minus4_TextColor: #fff;--sapChart_Sequence_Critical_Minus4_TextShadow: 0 0 .125rem #223548;--sapChart_Sequence_Critical_Minus5: #492000;--sapChart_Sequence_Critical_Minus5_TextColor: #fff;--sapChart_Sequence_Critical_Minus5_TextShadow: 0 0 .125rem #223548;--sapChart_Sequence_Good_Plus3: #88d79f;--sapChart_Sequence_Good_Plus3_TextColor: #000;--sapChart_Sequence_Good_Plus3_TextShadow: 0 0 .125rem #fff;--sapChart_Sequence_Good_Plus2: #56c776;--sapChart_Sequence_Good_Plus2_TextColor: #000;--sapChart_Sequence_Good_Plus2_TextShadow: 0 0 .125rem #fff;--sapChart_Sequence_Good_Plus1: #3ab05c;--sapChart_Sequence_Good_Plus1_TextColor: #000;--sapChart_Sequence_Good_Plus1_TextShadow: 0 0 .125rem #fff;--sapChart_Sequence_Good: #30914c;--sapChart_Sequence_Good_TextColor: #000;--sapChart_Sequence_Good_TextShadow: 0 0 .125rem #fff;--sapChart_Sequence_Good_BorderColor: #30914c;--sapChart_Sequence_Good_Minus1: #287a40;--sapChart_Sequence_Good_Minus1_TextColor: #fff;--sapChart_Sequence_Good_Minus1_TextShadow: 0 0 .125rem #223548;--sapChart_Sequence_Good_Minus2: #226736;--sapChart_Sequence_Good_Minus2_TextColor: #fff;--sapChart_Sequence_Good_Minus2_TextShadow: 0 0 .125rem #223548;--sapChart_Sequence_Good_Minus3: #1c542c;--sapChart_Sequence_Good_Minus3_TextColor: #fff;--sapChart_Sequence_Good_Minus3_TextShadow: 0 0 .125rem #223548;--sapChart_Sequence_Good_Minus4: #13391e;--sapChart_Sequence_Good_Minus4_TextColor: #fff;--sapChart_Sequence_Good_Minus4_TextShadow: 0 0 .125rem #223548;--sapChart_Sequence_Good_Minus5: #0a1e10;--sapChart_Sequence_Good_Minus5_TextColor: #fff;--sapChart_Sequence_Good_Minus5_TextShadow: 0 0 .125rem #223548;--sapChart_Sequence_Neutral_Plus3: #edf0f3;--sapChart_Sequence_Neutral_Plus3_TextColor: #000;--sapChart_Sequence_Neutral_Plus3_TextShadow: 0 0 .125rem #fff;--sapChart_Sequence_Neutral_Plus2: #c2ccd7;--sapChart_Sequence_Neutral_Plus2_TextColor: #000;--sapChart_Sequence_Neutral_Plus2_TextShadow: 0 0 .125rem #fff;--sapChart_Sequence_Neutral_Plus1: #9aabbc;--sapChart_Sequence_Neutral_Plus1_TextColor: #000;--sapChart_Sequence_Neutral_Plus1_TextShadow: 0 0 .125rem #fff;--sapChart_Sequence_Neutral: #758ca4;--sapChart_Sequence_Neutral_TextColor: #000;--sapChart_Sequence_Neutral_TextShadow: 0 0 .125rem #fff;--sapChart_Sequence_Neutral_BorderColor: #758ca4;--sapChart_Sequence_Neutral_Minus1: #5b728b;--sapChart_Sequence_Neutral_Minus1_TextColor: #fff;--sapChart_Sequence_Neutral_Minus1_TextShadow: 0 0 .125rem #223548;--sapChart_Sequence_Neutral_Minus2: #495e74;--sapChart_Sequence_Neutral_Minus2_TextColor: #fff;--sapChart_Sequence_Neutral_Minus2_TextShadow: 0 0 .125rem #223548;--sapChart_Sequence_Neutral_Minus3: #364a5f;--sapChart_Sequence_Neutral_Minus3_TextColor: #fff;--sapChart_Sequence_Neutral_Minus3_TextShadow: 0 0 .125rem #223548;--sapChart_Sequence_Neutral_Minus4: #233649;--sapChart_Sequence_Neutral_Minus4_TextColor: #fff;--sapChart_Sequence_Neutral_Minus4_TextShadow: 0 0 .125rem #223548;--sapChart_Sequence_Neutral_Minus5: #1a2633;--sapChart_Sequence_Neutral_Minus5_TextColor: #fff;--sapChart_Sequence_Neutral_Minus5_TextShadow: 0 0 .125rem #223548;}\n'
				}
			},
			1573: (e, t, r) => {
				"use strict";
				r.d(t, {
					A: () => x
				});
				var o = r(5161),
					i = r(9839),
					a = r(5645),
					n = r(4456),
					_ = r(5683),
					s = r(1431),
					c = r(4303),
					l = r(5587),
					u = r(9897),
					d = r(9212);

				function p(e, t, r) {
					return i.JW`<title id="${(0,i.JR)(this._id)}-tooltip">${(0,i.JR)(this.effectiveAccessibleName)}</title>`
				}

				function h(e, t, r) {
					return i.JW`${(0,i.JR)(this.customSvg)}`
				}

				function v(e, t, r, o, a) {
					return i.JW`<path d="${(0,i.JR)(o)}"></path>`
				}

				function f(e, t, r) {
					return i.JW`${this.hasIconTooltip?p.call(this,e,t,r):void 0}<g role="presentation">${this.customSvg?h.call(this,e,t,r):void 0}${(0,i.ux)(this.pathData,((e,t)=>e._id||t),((o,i)=>v.call(this,e,t,r,o,i)))}</g>`
				}
				var m = r(4281),
					g = r(5578),
					b = r(6180),
					y = r(7395);
				(0, g.Rh)("@ui5/webcomponents-theming", "sap_horizon", (async () => b.A)), (0, g.Rh)("@ui5/webcomponents", "sap_horizon", (async () => y.A));
				var C = function(e, t, r, o) {
					var i, a = arguments.length,
						n = a < 3 ? t : null === o ? o = Object.getOwnPropertyDescriptor(t, r) : o;
					if ("object" == typeof Reflect && "function" == typeof Reflect.decorate) n = Reflect.decorate(e, t, r, o);
					else
						for (var _ = e.length - 1; _ >= 0; _--)(i = e[_]) && (n = (a < 3 ? i(n) : a > 3 ? i(t, r, n) : i(t, r)) || n);
					return a > 3 && n && Object.defineProperty(t, r, n), n
				};
				let w = class extends o.A {
					constructor() {
						super(...arguments), this.design = "Default", this.showTooltip = !1, this.mode = "Image", this.pathData = [], this.invalid = !1
					}
					_onkeydown(e) {
						this.mode === m.A.Interactive && ((0, u.RI)(e) && this.fireDecoratorEvent("click"), (0, u.xC)(e) && e.preventDefault())
					}
					_onkeyup(e) {
						this.mode === m.A.Interactive && (0, u.xC)(e) && this.fireDecoratorEvent("click")
					}
					get _dir() {
						return this.ltr ? "ltr" : void 0
					}
					get effectiveAriaHidden() {
						return this.mode === m.A.Decorative ? "true" : void 0
					}
					get _tabIndex() {
						return this.mode === m.A.Interactive ? "0" : void 0
					}
					get effectiveAccessibleRole() {
						switch (this.mode) {
							case m.A.Interactive:
								return "button";
							case m.A.Decorative:
								return "presentation";
							default:
								return "img"
						}
					}
					onEnterDOM() {
						(0, l.xl)() && this.setAttribute("desktop", "")
					}
					async onBeforeRendering() {
						const e = this.name;
						if (!e) return console.warn("Icon name property is required", this);
						let t = (0, s.hu)(e);
						if (t || (t = await (0, s.y3)(e)), !t) return this.invalid = !0, console.warn(`Required icon is not registered. Invalid icon name: ${this.name}`);
						if ("ICON_NOT_FOUND" === t) return this.invalid = !0, console.warn(`Required icon is not registered. You can either import the icon as a module in order to use it e.g. "@ui5/webcomponents-icons/dist/${e.replace("sap-icon://","")}.js", or setup a JSON build step and import "@ui5/webcomponents-icons/dist/AllIcons.js".`);
						if (this.viewBox = t.viewBox || "0 0 512 512", t.customTemplate && (t.pathData = [], this.customSvg = (0, d.A)(t.customTemplate, this)), this.invalid = !1, this.pathData = Array.isArray(t.pathData) ? t.pathData : [t.pathData], this.accData = t.accData, this.ltr = t.ltr, this.packageName = t.packageName, this.accessibleName) this.effectiveAccessibleName = this.accessibleName;
						else if (this.accData) {
							const e = await (0, c.HE)(this.packageName);
							this.effectiveAccessibleName = e.getText(this.accData) || void 0
						} else this.effectiveAccessibleName = void 0
					}
					get hasIconTooltip() {
						return this.showTooltip && this.effectiveAccessibleName
					}
				};
				C([(0, _.A)()], w.prototype, "design", void 0), C([(0, _.A)()], w.prototype, "name", void 0), C([(0, _.A)()], w.prototype, "accessibleName", void 0), C([(0, _.A)({
					type: Boolean
				})], w.prototype, "showTooltip", void 0), C([(0, _.A)()], w.prototype, "mode", void 0), C([(0, _.A)({
					type: Array
				})], w.prototype, "pathData", void 0), C([(0, _.A)({
					type: Object,
					noAttribute: !0
				})], w.prototype, "accData", void 0), C([(0, _.A)({
					type: Boolean
				})], w.prototype, "invalid", void 0), C([(0, _.A)({
					noAttribute: !0
				})], w.prototype, "effectiveAccessibleName", void 0), w = C([(0, a.A)({
					tag: "ui5-icon",
					languageAware: !0,
					themeAware: !0,
					renderer: i.Ay,
					template: function(e, t, r) {
						return i.qy`<svg class="ui5-icon-root" part="root" tabindex="${(0,i.JR)(this._tabIndex)}" dir="${(0,i.JR)(this._dir)}" viewBox="${(0,i.JR)(this.viewBox)}" role="${(0,i.JR)(this.effectiveAccessibleRole)}" focusable="false" preserveAspectRatio="xMidYMid meet" aria-label="${(0,i.JR)(this.effectiveAccessibleName)}" aria-hidden=${(0,i.JR)(this.effectiveAriaHidden)} xmlns="http://www.w3.org/2000/svg" @keydown=${this._onkeydown} @keyup=${this._onkeyup}>${f.call(this,e,t,r)}</svg>`
					},
					styles: {
						packageName: "@ui5/webcomponents",
						fileName: "themes/Icon.css.ts",
						content: ':host{-webkit-tap-highlight-color:rgba(0,0,0,0)}:host([hidden]){display:none}:host([invalid]){display:none}:host(:not([hidden]).ui5_hovered){opacity:.7}:host{display:inline-block;width:1rem;height:1rem;color:var(--sapContent_IconColor);fill:currentColor;outline:none}:host([design="Contrast"]){color:var(--sapContent_ContrastIconColor)}:host([design="Critical"]){color:var(--sapCriticalElementColor)}:host([design="Information"]){color:var(--sapInformativeElementColor)}:host([design="Negative"]){color:var(--sapNegativeElementColor)}:host([design="Neutral"]){color:var(--sapNeutralElementColor)}:host([design="NonInteractive"]){color:var(--sapContent_NonInteractiveIconColor)}:host([design="Positive"]){color:var(--sapPositiveElementColor)}:host([mode="Interactive"][desktop]) .ui5-icon-root:focus,:host([mode="Interactive"]) .ui5-icon-root:focus-visible{outline:var(--sapContent_FocusWidth) var(--sapContent_FocusStyle) var(--sapContent_FocusColor);border-radius:var(--ui5-v2-4-0-icon-focus-border-radius)}.ui5-icon-root{display:flex;height:100%;width:100%;outline:none;vertical-align:top}:host([mode="Interactive"]){cursor:pointer}.ui5-icon-root:not([dir=ltr]){transform:var(--_ui5-v2-4-0_icon_transform_scale);transform-origin:center}\n'
					}
				}), (0, n.A)("click", {
					bubbles: !0
				})], w), w.define();
				const x = w
			},
			5637: (e, t, r) => {
				"use strict";
				r.d(t, {
					An0: () => u,
					ETz: () => i,
					FvC: () => g,
					IBR: () => _,
					Jy$: () => m,
					Kdd: () => b,
					RXS: () => h,
					Syq: () => a,
					WHs: () => l,
					btg: () => s,
					dVz: () => d,
					jog: () => n,
					kQX: () => f,
					nFX: () => v,
					qXW: () => p,
					tgM: () => c,
					uDy: () => o,
					vtI: () => y
				});
				const o = {
						key: "ARIA_LABEL_CARD_CONTENT",
						defaultText: "Card Content"
					},
					i = {
						key: "ARIA_ROLEDESCRIPTION_CARD",
						defaultText: "Card"
					},
					a = {
						key: "ARIA_ROLEDESCRIPTION_CARD_HEADER",
						defaultText: "Card Header"
					},
					n = {
						key: "ARIA_ROLEDESCRIPTION_INTERACTIVE_CARD_HEADER",
						defaultText: "Interactive Card Header"
					},
					_ = {
						key: "AVATAR_TOOLTIP",
						defaultText: "Avatar"
					},
					s = {
						key: "TAG_DESCRIPTION_TAG",
						defaultText: "Tag"
					},
					c = {
						key: "TAG_ROLE_DESCRIPTION",
						defaultText: "Tag button"
					},
					l = {
						key: "TAG_ERROR",
						defaultText: "Error"
					},
					u = {
						key: "TAG_WARNING",
						defaultText: "Warning"
					},
					d = {
						key: "TAG_SUCCESS",
						defaultText: "Success"
					},
					p = {
						key: "TAG_INFORMATION",
						defaultText: "Information"
					},
					h = {
						key: "BUSY_INDICATOR_TITLE",
						defaultText: "Please wait"
					},
					v = {
						key: "BUTTON_ARIA_TYPE_ACCEPT",
						defaultText: "Positive Action"
					},
					f = {
						key: "BUTTON_ARIA_TYPE_REJECT",
						defaultText: "Negative Action"
					},
					m = {
						key: "BUTTON_ARIA_TYPE_EMPHASIZED",
						defaultText: "Emphasized"
					},
					g = {
						key: "LINK_SUBTLE",
						defaultText: "Subtle"
					},
					b = {
						key: "LINK_EMPHASIZED",
						defaultText: "Emphasized"
					},
					y = {
						key: "LABEL_COLON",
						defaultText: ":"
					}
			},
			7395: (e, t, r) => {
				"use strict";
				r.d(t, {
					A: () => o
				});
				const o = {
					packageName: "@ui5/webcomponents",
					fileName: "themes/sap_horizon/parameters-bundle.css.ts",
					content: ':root{--ui5-v2-4-0-avatar-hover-box-shadow-offset: 0px 0px 0px .0625rem;--ui5-v2-4-0-avatar-initials-color: var(--sapContent_ImagePlaceholderForegroundColor);--ui5-v2-4-0-avatar-border-radius-img-deduction: .0625rem;--_ui5-v2-4-0_avatar_outline: var(--sapContent_FocusWidth) var(--sapContent_FocusStyle) var(--sapContent_FocusColor);--_ui5-v2-4-0_avatar_focus_width: .0625rem;--_ui5-v2-4-0_avatar_focus_color: var(--sapContent_FocusColor);--_ui5-v2-4-0_avatar_overflow_button_focus_offset: .0625rem;--_ui5-v2-4-0_avatar_focus_offset: .1875rem;--ui5-v2-4-0-avatar-initials-border: .0625rem solid var(--sapAvatar_1_BorderColor);--ui5-v2-4-0-avatar-border-radius: var(--sapElement_BorderCornerRadius);--_ui5-v2-4-0_avatar_fontsize_XS: 1rem;--_ui5-v2-4-0_avatar_fontsize_S: 1.125rem;--_ui5-v2-4-0_avatar_fontsize_M: 1.5rem;--_ui5-v2-4-0_avatar_fontsize_L: 2.25rem;--_ui5-v2-4-0_avatar_fontsize_XL: 3rem;--ui5-v2-4-0-avatar-accent1: var(--sapAvatar_1_Background);--ui5-v2-4-0-avatar-accent2: var(--sapAvatar_2_Background);--ui5-v2-4-0-avatar-accent3: var(--sapAvatar_3_Background);--ui5-v2-4-0-avatar-accent4: var(--sapAvatar_4_Background);--ui5-v2-4-0-avatar-accent5: var(--sapAvatar_5_Background);--ui5-v2-4-0-avatar-accent6: var(--sapAvatar_6_Background);--ui5-v2-4-0-avatar-accent7: var(--sapAvatar_7_Background);--ui5-v2-4-0-avatar-accent8: var(--sapAvatar_8_Background);--ui5-v2-4-0-avatar-accent9: var(--sapAvatar_9_Background);--ui5-v2-4-0-avatar-accent10: var(--sapAvatar_10_Background);--ui5-v2-4-0-avatar-placeholder: var(--sapContent_ImagePlaceholderBackground);--ui5-v2-4-0-avatar-accent1-color: var(--sapAvatar_1_TextColor);--ui5-v2-4-0-avatar-accent2-color: var(--sapAvatar_2_TextColor);--ui5-v2-4-0-avatar-accent3-color: var(--sapAvatar_3_TextColor);--ui5-v2-4-0-avatar-accent4-color: var(--sapAvatar_4_TextColor);--ui5-v2-4-0-avatar-accent5-color: var(--sapAvatar_5_TextColor);--ui5-v2-4-0-avatar-accent6-color: var(--sapAvatar_6_TextColor);--ui5-v2-4-0-avatar-accent7-color: var(--sapAvatar_7_TextColor);--ui5-v2-4-0-avatar-accent8-color: var(--sapAvatar_8_TextColor);--ui5-v2-4-0-avatar-accent9-color: var(--sapAvatar_9_TextColor);--ui5-v2-4-0-avatar-accent10-color: var(--sapAvatar_10_TextColor);--ui5-v2-4-0-avatar-placeholder-color: var(--sapContent_ImagePlaceholderForegroundColor);--ui5-v2-4-0-avatar-accent1-border-color: var(--sapAvatar_1_BorderColor);--ui5-v2-4-0-avatar-accent2-border-color: var(--sapAvatar_2_BorderColor);--ui5-v2-4-0-avatar-accent3-border-color: var(--sapAvatar_3_BorderColor);--ui5-v2-4-0-avatar-accent4-border-color: var(--sapAvatar_4_BorderColor);--ui5-v2-4-0-avatar-accent5-border-color: var(--sapAvatar_5_BorderColor);--ui5-v2-4-0-avatar-accent6-border-color: var(--sapAvatar_6_BorderColor);--ui5-v2-4-0-avatar-accent7-border-color: var(--sapAvatar_7_BorderColor);--ui5-v2-4-0-avatar-accent8-border-color: var(--sapAvatar_8_BorderColor);--ui5-v2-4-0-avatar-accent9-border-color: var(--sapAvatar_9_BorderColor);--ui5-v2-4-0-avatar-accent10-border-color: var(--sapAvatar_10_BorderColor);--ui5-v2-4-0-avatar-placeholder-border-color: var(--sapContent_ImagePlaceholderBackground);--_ui5-v2-4-0_avatar_icon_XS: var(--_ui5-v2-4-0_avatar_fontsize_XS);--_ui5-v2-4-0_avatar_icon_S: var(--_ui5-v2-4-0_avatar_fontsize_S);--_ui5-v2-4-0_avatar_icon_M: var(--_ui5-v2-4-0_avatar_fontsize_M);--_ui5-v2-4-0_avatar_icon_L: var(--_ui5-v2-4-0_avatar_fontsize_L);--_ui5-v2-4-0_avatar_icon_XL: var(--_ui5-v2-4-0_avatar_fontsize_XL);--_ui5-v2-4-0_avatar_group_button_focus_border: none;--_ui5-v2-4-0_avatar_group_focus_border_radius: .375rem;--_ui5-v2-4-0-tag-height: 1rem;--_ui5-v2-4-0-tag-icon-width: .75rem;--ui5-v2-4-0-tag-text-shadow: var(--sapContent_TextShadow);--ui5-v2-4-0-tag-contrast-text-shadow: var(--sapContent_ContrastTextShadow);--ui5-v2-4-0-tag-information-text-shadow: var(--ui5-v2-4-0-tag-text-shadow);--ui5-v2-4-0-tag-set2-color-scheme-1-color: var(--sapIndicationColor_1);--ui5-v2-4-0-tag-set2-color-scheme-1-background: var(--sapIndicationColor_1b);--ui5-v2-4-0-tag-set2-color-scheme-1-border: var(--sapIndicationColor_1b_BorderColor);--ui5-v2-4-0-tag-set2-color-scheme-1-hover-background: var(--sapIndicationColor_1b_Hover_Background);--ui5-v2-4-0-tag-set2-color-scheme-1-active-color: var(--sapIndicationColor_1_Active_TextColor);--ui5-v2-4-0-tag-set2-color-scheme-1-active-background: var(--sapIndicationColor_1_Active_Background);--ui5-v2-4-0-tag-set2-color-scheme-1-active-border: var(--sapIndicationColor_1_Active_BorderColor);--ui5-v2-4-0-tag-set2-color-scheme-2-color: var(--sapIndicationColor_2);--ui5-v2-4-0-tag-set2-color-scheme-2-background: var(--sapIndicationColor_2b);--ui5-v2-4-0-tag-set2-color-scheme-2-border: var(--sapIndicationColor_2b_BorderColor);--ui5-v2-4-0-tag-set2-color-scheme-2-hover-background: var(--sapIndicationColor_2b_Hover_Background);--ui5-v2-4-0-tag-set2-color-scheme-2-active-color: var(--sapIndicationColor_2_Active_TextColor);--ui5-v2-4-0-tag-set2-color-scheme-2-active-background: var(--sapIndicationColor_2_Active_Background);--ui5-v2-4-0-tag-set2-color-scheme-2-active-border: var(--sapIndicationColor_2_Active_BorderColor);--ui5-v2-4-0-tag-set2-color-scheme-3-color: var(--sapIndicationColor_3);--ui5-v2-4-0-tag-set2-color-scheme-3-background: var(--sapIndicationColor_3b);--ui5-v2-4-0-tag-set2-color-scheme-3-border: var(--sapIndicationColor_3b_BorderColor);--ui5-v2-4-0-tag-set2-color-scheme-3-hover-background: var(--sapIndicationColor_3b_Hover_Background);--ui5-v2-4-0-tag-set2-color-scheme-3-active-color: var(--sapIndicationColor_3_Active_TextColor);--ui5-v2-4-0-tag-set2-color-scheme-3-active-background: var(--sapIndicationColor_3_Active_Background);--ui5-v2-4-0-tag-set2-color-scheme-3-active-border: var(--sapIndicationColor_3_Active_BorderColor);--ui5-v2-4-0-tag-set2-color-scheme-4-color: var(--sapIndicationColor_4);--ui5-v2-4-0-tag-set2-color-scheme-4-background: var(--sapIndicationColor_4b);--ui5-v2-4-0-tag-set2-color-scheme-4-border: var(--sapIndicationColor_4b_BorderColor);--ui5-v2-4-0-tag-set2-color-scheme-4-hover-background: var(--sapIndicationColor_4b_Hover_Background);--ui5-v2-4-0-tag-set2-color-scheme-4-active-color: var(--sapIndicationColor_4_Active_TextColor);--ui5-v2-4-0-tag-set2-color-scheme-4-active-background: var(--sapIndicationColor_4_Active_Background);--ui5-v2-4-0-tag-set2-color-scheme-4-active-border: var(--sapIndicationColor_4_Active_BorderColor);--ui5-v2-4-0-tag-set2-color-scheme-5-color: var(--sapIndicationColor_5);--ui5-v2-4-0-tag-set2-color-scheme-5-background: var(--sapIndicationColor_5b);--ui5-v2-4-0-tag-set2-color-scheme-5-border: var(--sapIndicationColor_5b_BorderColor);--ui5-v2-4-0-tag-set2-color-scheme-5-hover-background: var(--sapIndicationColor_5b_Hover_Background);--ui5-v2-4-0-tag-set2-color-scheme-5-active-color: var(--sapIndicationColor_5_Active_TextColor);--ui5-v2-4-0-tag-set2-color-scheme-5-active-background: var(--sapIndicationColor_5_Active_Background);--ui5-v2-4-0-tag-set2-color-scheme-5-active-border: var(--sapIndicationColor_5_Active_BorderColor);--ui5-v2-4-0-tag-set2-color-scheme-6-color: var(--sapIndicationColor_6);--ui5-v2-4-0-tag-set2-color-scheme-6-background: var(--sapIndicationColor_6b);--ui5-v2-4-0-tag-set2-color-scheme-6-border: var(--sapIndicationColor_6b_BorderColor);--ui5-v2-4-0-tag-set2-color-scheme-6-hover-background: var(--sapIndicationColor_6b_Hover_Background);--ui5-v2-4-0-tag-set2-color-scheme-6-active-color: var(--sapIndicationColor_6_Active_TextColor);--ui5-v2-4-0-tag-set2-color-scheme-6-active-background: var(--sapIndicationColor_6_Active_Background);--ui5-v2-4-0-tag-set2-color-scheme-6-active-border: var(--sapIndicationColor_6_Active_BorderColor);--ui5-v2-4-0-tag-set2-color-scheme-7-color: var(--sapIndicationColor_7);--ui5-v2-4-0-tag-set2-color-scheme-7-background: var(--sapIndicationColor_7b);--ui5-v2-4-0-tag-set2-color-scheme-7-border: var(--sapIndicationColor_7b_BorderColor);--ui5-v2-4-0-tag-set2-color-scheme-7-hover-background: var(--sapIndicationColor_7b_Hover_Background);--ui5-v2-4-0-tag-set2-color-scheme-7-active-color: var(--sapIndicationColor_7_Active_TextColor);--ui5-v2-4-0-tag-set2-color-scheme-7-active-background: var(--sapIndicationColor_7_Active_Background);--ui5-v2-4-0-tag-set2-color-scheme-7-active-border: var(--sapIndicationColor_7_Active_BorderColor);--ui5-v2-4-0-tag-set2-color-scheme-8-color: var(--sapIndicationColor_8);--ui5-v2-4-0-tag-set2-color-scheme-8-background: var(--sapIndicationColor_8b);--ui5-v2-4-0-tag-set2-color-scheme-8-border: var(--sapIndicationColor_8b_BorderColor);--ui5-v2-4-0-tag-set2-color-scheme-8-hover-background: var(--sapIndicationColor_8b_Hover_Background);--ui5-v2-4-0-tag-set2-color-scheme-8-active-color: var(--sapIndicationColor_8_Active_TextColor);--ui5-v2-4-0-tag-set2-color-scheme-8-active-background: var(--sapIndicationColor_8_Active_Background);--ui5-v2-4-0-tag-set2-color-scheme-8-active-border: var(--sapIndicationColor_8_Active_BorderColor);--ui5-v2-4-0-tag-set2-color-scheme-9-color: var(--sapIndicationColor_9);--ui5-v2-4-0-tag-set2-color-scheme-9-background: var(--sapIndicationColor_9b);--ui5-v2-4-0-tag-set2-color-scheme-9-border: var(--sapIndicationColor_9b_BorderColor);--ui5-v2-4-0-tag-set2-color-scheme-10-color: var(--sapIndicationColor_10);--ui5-v2-4-0-tag-set2-color-scheme-10-background: var(--sapIndicationColor_10b);--ui5-v2-4-0-tag-set2-color-scheme-10-border: var(--sapIndicationColor_10b_BorderColor);--ui5-v2-4-0-tag-set2-color-scheme-10-hover-background: var(--sapIndicationColor_10b_Hover_Background);--ui5-v2-4-0-tag-set2-color-scheme-10-active-color: var(--sapIndicationColor_10_Active_TextColor);--ui5-v2-4-0-tag-set2-color-scheme-10-active-background: var(--sapIndicationColor_10_Active_Background);--ui5-v2-4-0-tag-set2-color-scheme-10-active-border: var(--sapIndicationColor_10_Active_BorderColor);--_ui5-v2-4-0-tag-height_size_l: 1.5rem;--_ui5-v2-4-0-tag-min-width_size_l: 1.75rem;--_ui5-v2-4-0-tag-font-size_size_l: 1.25rem;--_ui5-v2-4-0-tag-icon_min_width_size_l: 1.25rem;--_ui5-v2-4-0-tag-icon_min_height_size_l:1.25rem;--_ui5-v2-4-0-tag-icon_height_size_l: 1.25rem;--_ui5-v2-4-0-tag-text_padding_size_l: .125rem .25rem;--_ui5-v2-4-0-tag-text-height_size_l: 1.5rem;--_ui5-v2-4-0-tag-text-padding: .1875rem .25rem;--_ui5-v2-4-0-tag-padding-inline-icon-only: .313rem;--_ui5-v2-4-0-tag-text-transform: none;--_ui5-v2-4-0-tag-icon-gap: .25rem;--_ui5-v2-4-0-tag-font-size: var(--sapFontSize);--_ui5-v2-4-0-tag-font: var(--sapFontSemiboldDuplexFamily);--_ui5-v2-4-0-tag-font-weight: normal;--_ui5-v2-4-0-tag-letter-spacing: normal;--_ui5-v2-4-0_bar_base_height: 2.75rem;--_ui5-v2-4-0_bar_subheader_height: 3rem;--_ui5-v2-4-0_bar-start-container-padding-start: 2rem;--_ui5-v2-4-0_bar-mid-container-padding-start-end: .5rem;--_ui5-v2-4-0_bar-end-container-padding-end: 2rem;--_ui5-v2-4-0_bar-start-container-padding-start_S: 1rem;--_ui5-v2-4-0_bar-start-container-padding-start_XL: 3rem;--_ui5-v2-4-0_bar-end-container-padding-end_S: 1rem;--_ui5-v2-4-0_bar-end-container-padding-end_XL: 3rem;--_ui5-v2-4-0_bar_subheader_margin-top: -.0625rem;--_ui5-v2-4-0_breadcrumbs_margin: 0 0 .5rem 0;--_ui5-v2-4-0_busy_indicator_block_layer: color-mix(in oklch, transparent, var(--sapBlockLayer_Background) 20%);--_ui5-v2-4-0_busy_indicator_color: var(--sapContent_BusyColor);--_ui5-v2-4-0_busy_indicator_focus_outline: var(--sapContent_FocusWidth) var(--sapContent_FocusStyle) var(--sapContent_FocusColor);--_ui5-v2-4-0-calendar-legend-root-padding: .75rem;--_ui5-v2-4-0-calendar-legend-root-width: 18.5rem;--_ui5-v2-4-0-calendar-legend-item-root-focus-margin: 0;--_ui5-v2-4-0-calendar-legend-item-root-width: 7.75rem;--_ui5-v2-4-0-calendar-legend-item-root-focus-border: var(--sapContent_FocusWidth) solid var(--sapContent_FocusColor);--_ui5-v2-4-0_card_box_shadow: var(--sapContent_Shadow0);--_ui5-v2-4-0_card_header_border_color: var(--sapTile_SeparatorColor);--_ui5-v2-4-0_card_header_focus_border: var(--sapContent_FocusWidth) var(--sapContent_FocusStyle) var(--sapContent_FocusColor);--_ui5-v2-4-0_card_header_focus_bottom_radius: 0px;--_ui5-v2-4-0_card_header_title_font_weight: normal;--_ui5-v2-4-0_card_header_subtitle_margin_top: .25rem;--_ui5-v2-4-0_card_hover_box_shadow: var(--sapContent_Shadow2);--_ui5-v2-4-0_card_header_focus_offset: 0px;--_ui5-v2-4-0_card_header_focus_radius: var(--_ui5-v2-4-0_card_border-radius);--_ui5-v2-4-0_card_header_title_font_family: var(--sapFontHeaderFamily);--_ui5-v2-4-0_card_header_title_font_size: var(--sapFontHeader6Size);--_ui5-v2-4-0_card_header_hover_bg: var(--sapTile_Hover_Background);--_ui5-v2-4-0_card_header_active_bg: var(--sapTile_Active_Background);--_ui5-v2-4-0_card_header_border: none;--_ui5-v2-4-0_card_border-radius: var(--sapTile_BorderCornerRadius);--_ui5-v2-4-0_card_header_padding: 1rem 1rem .75rem 1rem;--_ui5-v2-4-0_card_border: none;--ui5-v2-4-0_carousel_background_color_solid: var(--sapGroup_ContentBackground);--ui5-v2-4-0_carousel_background_color_translucent: var(--sapBackgroundColor);--ui5-v2-4-0_carousel_button_size: 2.5rem;--ui5-v2-4-0_carousel_inactive_dot_size: .25rem;--ui5-v2-4-0_carousel_inactive_dot_margin: 0 .375rem;--ui5-v2-4-0_carousel_inactive_dot_border: 1px solid var(--sapContent_ForegroundBorderColor);--ui5-v2-4-0_carousel_inactive_dot_background: var(--sapContent_ForegroundBorderColor);--ui5-v2-4-0_carousel_active_dot_border: 1px solid var(--sapContent_Selected_ForegroundColor);--ui5-v2-4-0_carousel_active_dot_background: var(--sapContent_Selected_ForegroundColor);--ui5-v2-4-0_carousel_navigation_button_active_box_shadow: none;--_ui5-v2-4-0_checkbox_box_shadow: none;--_ui5-v2-4-0_checkbox_transition: unset;--_ui5-v2-4-0_checkbox_focus_border: none;--_ui5-v2-4-0_checkbox_border_radius: 0;--_ui5-v2-4-0_checkbox_focus_outline: var(--sapContent_FocusWidth) var(--sapContent_FocusStyle) var(--sapContent_FocusColor);--_ui5-v2-4-0_checkbox_outer_hover_background: transparent;--_ui5-v2-4-0_checkbox_inner_width_height: 1.375rem;--_ui5-v2-4-0_checkbox_inner_disabled_border_color: var(--sapField_BorderColor);--_ui5-v2-4-0_checkbox_inner_information_box_shadow: none;--_ui5-v2-4-0_checkbox_inner_warning_box_shadow: none;--_ui5-v2-4-0_checkbox_inner_error_box_shadow: none;--_ui5-v2-4-0_checkbox_inner_success_box_shadow: none;--_ui5-v2-4-0_checkbox_inner_default_box_shadow: none;--_ui5-v2-4-0_checkbox_inner_background: var(--sapField_Background);--_ui5-v2-4-0_checkbox_wrapped_focus_padding: .375rem;--_ui5-v2-4-0_checkbox_wrapped_focus_inset_block: var(--_ui5-v2-4-0_checkbox_focus_position);--_ui5-v2-4-0_checkbox_compact_wrapper_padding: .5rem;--_ui5-v2-4-0_checkbox_compact_width_height: 2rem;--_ui5-v2-4-0_checkbox_compact_inner_size: 1rem;--_ui5-v2-4-0_checkbox_compact_focus_position: .375rem;--_ui5-v2-4-0_checkbox_label_offset: var(--_ui5-v2-4-0_checkbox_wrapper_padding);--_ui5-v2-4-0_checkbox_disabled_label_color: var(--sapContent_LabelColor);--_ui5-v2-4-0_checkbox_default_focus_border: none;--_ui5-v2-4-0_checkbox_focus_outline_display: block;--_ui5-v2-4-0_checkbox_wrapper_padding: .6875rem;--_ui5-v2-4-0_checkbox_width_height: 2.75rem;--_ui5-v2-4-0_checkbox_label_color: var(--sapField_TextColor);--_ui5-v2-4-0_checkbox_inner_border: solid var(--sapField_BorderWidth) var(--sapField_BorderColor);--_ui5-v2-4-0_checkbox_inner_border_radius: var(--sapField_BorderCornerRadius);--_ui5-v2-4-0_checkbox_checkmark_color: var(--sapContent_Selected_ForegroundColor);--_ui5-v2-4-0_checkbox_hover_background: var(--sapContent_Selected_Hover_Background);--_ui5-v2-4-0_checkbox_inner_hover_border_color: var(--sapField_Hover_BorderColor);--_ui5-v2-4-0_checkbox_inner_hover_checked_border_color: var(--sapField_Hover_BorderColor);--_ui5-v2-4-0_checkbox_inner_selected_border_color: var(--sapField_BorderColor);--_ui5-v2-4-0_checkbox_inner_active_border_color: var(--sapField_Hover_BorderColor);--_ui5-v2-4-0_checkbox_active_background: var(--sapContent_Selected_Hover_Background);--_ui5-v2-4-0_checkbox_inner_readonly_border: var(--sapElement_BorderWidth) var(--sapField_ReadOnly_BorderColor) dashed;--_ui5-v2-4-0_checkbox_inner_error_border: var(--sapField_InvalidBorderWidth) solid var(--sapField_InvalidColor);--_ui5-v2-4-0_checkbox_inner_error_background_hover: var(--sapField_Hover_Background);--_ui5-v2-4-0_checkbox_inner_warning_border: var(--sapField_WarningBorderWidth) solid var(--sapField_WarningColor);--_ui5-v2-4-0_checkbox_inner_warning_color: var(--sapField_WarningColor);--_ui5-v2-4-0_checkbox_inner_warning_background_hover: var(--sapField_Hover_Background);--_ui5-v2-4-0_checkbox_checkmark_warning_color: var(--sapField_WarningColor);--_ui5-v2-4-0_checkbox_inner_success_border: var(--sapField_SuccessBorderWidth) solid var(--sapField_SuccessColor);--_ui5-v2-4-0_checkbox_inner_success_background_hover: var(--sapField_Hover_Background);--_ui5-v2-4-0_checkbox_inner_information_color: var(--sapField_InformationColor);--_ui5-v2-4-0_checkbox_inner_information_border: var(--sapField_InformationBorderWidth) solid var(--sapField_InformationColor);--_ui5-v2-4-0_checkbox_inner_information_background_hover: var(--sapField_Hover_Background);--_ui5-v2-4-0_checkbox_disabled_opacity: var(--sapContent_DisabledOpacity);--_ui5-v2-4-0_checkbox_focus_position: .3125rem;--_ui5-v2-4-0_checkbox_focus_border_radius: .5rem;--_ui5-v2-4-0_checkbox_right_focus_distance: var(--_ui5-v2-4-0_checkbox_focus_position);--_ui5-v2-4-0_color-palette-item-after-focus-inset: .0625rem;--_ui5-v2-4-0_color-palette-item-outer-border-radius: .25rem;--_ui5-v2-4-0_color-palette-item-inner-border-radius: .1875rem;--_ui5-v2-4-0_color-palette-item-after-not-focus-color: .0625rem solid var(--sapGroup_ContentBackground);--_ui5-v2-4-0_color-palette-item-container-sides-padding: .3125rem;--_ui5-v2-4-0_color-palette-item-container-rows-padding: .6875rem;--_ui5-v2-4-0_color-palette-item-focus-height: 1.5rem;--_ui5-v2-4-0_color-palette-item-container-padding: var(--_ui5-v2-4-0_color-palette-item-container-sides-padding) var(--_ui5-v2-4-0_color-palette-item-container-rows-padding);--_ui5-v2-4-0_color-palette-item-hover-margin: .0625rem;--_ui5-v2-4-0_color-palette-row-height: 9.5rem;--_ui5-v2-4-0_color-palette-button-height: 3rem;--_ui5-v2-4-0_color-palette-item-before-focus-color: .125rem solid var(--sapContent_FocusColor);--_ui5-v2-4-0_color-palette-item-before-focus-inset: -.3125rem;--_ui5-v2-4-0_color-palette-item-before-focus-hover-inset: -.0625rem;--_ui5-v2-4-0_color-palette-item-after-focus-color: .0625rem solid var(--sapContent_ContrastFocusColor);--_ui5-v2-4-0_color-palette-item-selected-focused-border-after: none;--_ui5-v2-4-0_color-palette-item-after-focus-hover-inset: .0625rem;--_ui5-v2-4-0_color-palette-item-before-focus-border-radius: .4375rem;--_ui5-v2-4-0_color-palette-item-after-focus-border-radius: .3125rem;--_ui5-v2-4-0_color-palette-item-hover-outer-border-radius: .4375rem;--_ui5-v2-4-0_color-palette-item-hover-inner-border-radius: .375rem;--_ui5-v2-4-0_color-palette-item-selected-focused-border-before: -.0625rem;--_ui5-v2-4-0_color-palette-item-after-focus-not-selected-border: none;--_ui5-v2-4-0_color-palette-item-selected-focused-border: none;--_ui5-v2-4-0_color-palette-item-mobile-focus-sides-inset: -.375rem -.375rem;--_ui5-v2-4-0-color-palette-item-mobile-focus-inset: 0px;--_ui5-v2-4-0_color-palette-item-after-mobile-focus-border: none;--_ui5-v2-4-0_color_picker_circle_outer_border: .0625rem solid var(--sapContent_ContrastShadowColor);--_ui5-v2-4-0_color_picker_circle_inner_border: .0625rem solid var(--sapField_BorderColor);--_ui5-v2-4-0_color_picker_circle_inner_circle_size: .5625rem;--_ui5-v2-4-0_color_picker_slider_handle_box_shadow: .125rem solid var(--sapField_BorderColor);--_ui5-v2-4-0_color_picker_slider_handle_border: .125rem solid var(--sapField_BorderColor);--_ui5-v2-4-0_color_picker_slider_handle_outline_hover: .125rem solid var(--sapContent_FocusColor);--_ui5-v2-4-0_color_picker_slider_handle_outline_focus: .125rem solid var(--sapContent_FocusColor);--_ui5-v2-4-0_color_picker_slider_handle_margin_top: -.1875rem;--_ui5-v2-4-0_color_picker_slider_handle_focus_margin_top: var(--_ui5-v2-4-0_color_picker_slider_handle_margin_top);--_ui5-v2-4-0_color_picker_slider_container_margin_top: -11px;--_ui5-v2-4-0_color_picker_slider_handle_inline_focus: 1px solid var(--sapContent_ContrastFocusColor);--_ui5-v2-4-0_datepicker_icon_border: none;--_ui5-v2-4-0-datepicker-hover-background: var(--sapField_Hover_Background);--_ui5-v2-4-0-datepicker_border_radius: .25rem;--_ui5-v2-4-0-datepicker_icon_border_radius: .125rem;--_ui5-v2-4-0_daypicker_item_box_shadow: inset 0 0 0 .0625rem var(--sapContent_Selected_ForegroundColor);--_ui5-v2-4-0_daypicker_item_margin: 2px;--_ui5-v2-4-0_daypicker_item_border: none;--_ui5-v2-4-0_daypicker_item_selected_border_color: var(--sapList_Background);--_ui5-v2-4-0_daypicker_daynames_container_height: 2rem;--_ui5-v2-4-0_daypicker_weeknumbers_container_padding_top: 2rem;--_ui5-v2-4-0_daypicker_item_othermonth_background_color: var(--sapList_Background);--_ui5-v2-4-0_daypicker_item_othermonth_color: var(--sapContent_LabelColor);--_ui5-v2-4-0_daypicker_item_othermonth_hover_color: var(--sapContent_LabelColor);--_ui5-v2-4-0_daypicker_item_now_inner_border_radius: 0;--_ui5-v2-4-0_daypicker_item_outline_width: 1px;--_ui5-v2-4-0_daypicker_item_outline_offset: 1px;--_ui5-v2-4-0_daypicker_item_now_focus_after_width: calc(100% - .25rem) ;--_ui5-v2-4-0_daypicker_item_now_focus_after_height: calc(100% - .25rem) ;--_ui5-v2-4-0_daypicker_item_now_selected_focus_after_width: calc(100% - .375rem) ;--_ui5-v2-4-0_daypicker_item_now_selected_focus_after_height: calc(100% - .375rem) ;--_ui5-v2-4-0_daypicker_item_selected_background: transparent;--_ui5-v2-4-0_daypicker_item_outline_focus_after: none;--_ui5-v2-4-0_daypicker_item_border_focus_after: var(--_ui5-v2-4-0_daypicker_item_outline_width) dotted var(--sapContent_FocusColor);--_ui5-v2-4-0_daypicker_item_width_focus_after: calc(100% - .25rem) ;--_ui5-v2-4-0_daypicker_item_height_focus_after: calc(100% - .25rem) ;--_ui5-v2-4-0_daypicker_item_now_outline: none;--_ui5-v2-4-0_daypicker_item_now_outline_offset: none;--_ui5-v2-4-0_daypicker_item_now_outline_offset_focus_after: var(--_ui5-v2-4-0_daypicker_item_now_outline_offset);--_ui5-v2-4-0_daypicker_item_selected_between_hover_background: var(--sapList_Hover_SelectionBackground);--_ui5-v2-4-0_daypicker_item_now_not_selected_inset: 0;--_ui5-v2-4-0_daypicker_item_now_border_color: var(--sapLegend_CurrentDateTime);--_ui5-v2-4-0_dp_two_calendar_item_secondary_text_border_radios: .25rem;--_ui5-v2-4-0_daypicker_special_day_top: 2.5rem;--_ui5-v2-4-0_daypicker_special_day_before_border_color: var(--sapList_Background);--_ui5-v2-4-0_daypicker_selected_item_now_special_day_border_bottom_radius: 0;--_ui5-v2-4-0_daypicker_twocalendar_item_special_day_after_border_width: .125rem;--_ui5-v2-4-0_daypicker_twocalendar_item_special_day_dot: .375rem;--_ui5-v2-4-0_daypicker_twocalendar_item_special_day_top: 2rem;--_ui5-v2-4-0_daypicker_twocalendar_item_special_day_right: 1.4375rem;--_ui5-v2-4-0_daypicker_item_border_radius: .4375rem;--_ui5-v2-4-0_daypicker_item_focus_border: .0625rem dotted var(--sapContent_FocusColor);--_ui5-v2-4-0_daypicker_item_selected_border: .0625rem solid var(--sapList_SelectionBorderColor);--_ui5-v2-4-0_daypicker_item_not_selected_focus_border: .125rem solid var(--sapContent_FocusColor);--_ui5-v2-4-0_daypicker_item_selected_focus_color: var(--sapContent_FocusColor);--_ui5-v2-4-0_daypicker_item_selected_focus_width: .125rem;--_ui5-v2-4-0_daypicker_item_no_selected_inset: .375rem;--_ui5-v2-4-0_daypicker_item_now_border_focus_after: .125rem solid var(--sapList_SelectionBorderColor);--_ui5-v2-4-0_daypicker_item_now_border_radius_focus_after: .3125rem;--_ui5-v2-4-0_day_picker_item_selected_now_border_focus: .125rem solid var(--sapContent_FocusColor);--_ui5-v2-4-0_day_picker_item_selected_now_border_radius_focus: .1875rem;--ui5-v2-4-0-dp-item_withsecondtype_border: .375rem;--_ui5-v2-4-0_daypicker_item_now_border: .125rem solid var(--sapLegend_CurrentDateTime);--_ui5-v2-4-0_daypicker_dayname_color: var(--sapContent_LabelColor);--_ui5-v2-4-0_daypicker_weekname_color: var(--sapContent_LabelColor);--_ui5-v2-4-0_daypicker_item_selected_box_shadow: inset 0 0 0 .0625rem var(--sapContent_Selected_ForegroundColor);--_ui5-v2-4-0_daypicker_item_selected_daytext_hover_background: transparent;--_ui5-v2-4-0_daypicker_item_border_radius_item: .5rem;--_ui5-v2-4-0_daypicker_item_border_radius_focus_after: .1875rem;--_ui5-v2-4-0_daypicker_item_selected_between_border: .5rem;--_ui5-v2-4-0_daypicker_item_selected_between_background: var(--sapList_SelectionBackgroundColor);--_ui5-v2-4-0_daypicker_item_selected_between_text_background: transparent;--_ui5-v2-4-0_daypicker_item_selected_between_text_font: var(--sapFontFamily);--_ui5-v2-4-0_daypicker_item_selected_text_font: var(--sapFontBoldFamily);--_ui5-v2-4-0_daypicker_item_now_box_shadow: inset 0 0 0 .35rem var(--sapList_Background);--_ui5-v2-4-0_daypicker_item_selected_text_outline: .0625rem solid var(--sapSelectedColor);--_ui5-v2-4-0_daypicker_item_now_selected_outline_offset: -.25rem;--_ui5-v2-4-0_daypicker_item_now_selected_between_inset: .25rem;--_ui5-v2-4-0_daypicker_item_now_selected_between_border: .0625rem solid var(--sapContent_Selected_ForegroundColor);--_ui5-v2-4-0_daypicker_item_now_selected_between_border_radius: .1875rem;--_ui5-v2-4-0_daypicker_item_select_between_border: 1px solid var(--sapContent_Selected_ForegroundColor);--_ui5-v2-4-0_daypicker_item_weeekend_filter: brightness(105%);--_ui5-v2-4-0_daypicker_item_selected_hover: var(--sapList_Hover_Background);--_ui5-v2-4-0_daypicker_item_now_inset: .3125rem;--_ui5-v2-4-0-dp-item_withsecondtype_border: .25rem;--_ui5-v2-4-0_daypicker_item_selected__secondary_type_text_outline: .0625rem solid var(--sapSelectedColor);--_ui5-v2-4-0_daypicker_two_calendar_item_now_day_text_content: "";--_ui5-v2-4-0_daypicker_two_calendar_item_now_selected_border_width: .125rem;--_ui5-v2-4-0_daypicker_two_calendar_item_border_radius: .5rem;--_ui5-v2-4-0_daypicker_two_calendar_item_border_focus_border_radius: .375rem;--_ui5-v2-4-0_daypicker_two_calendar_item_no_selected_inset: 0;--_ui5-v2-4-0_daypicker_two_calendar_item_selected_now_border_radius_focus: .1875rem;--_ui5-v2-4-0_daypicker_two_calendar_item_no_selected_focus_inset: .1875rem;--_ui5-v2-4-0_daypicker_two_calendar_item_no_select_focus_border_radius: .3125rem;--_ui5-v2-4-0_daypicker_two_calendar_item_now_inset: .3125rem;--_ui5-v2-4-0_daypicker_two_calendar_item_now_selected_border_inset: .125rem;--_ui5-v2-4-0_daypicker_selected_item_special_day_width: calc(100% - .125rem) ;--_ui5-v2-4-0_daypicker_special_day_border_bottom_radius: .5rem;--_ui5-v2-4-0-daypicker_item_selected_now_border_radius: .5rem;--_ui5-v2-4-0_daypicker_selected_item_now_special_day_width: calc(100% - .1875rem) ;--_ui5-v2-4-0_daypicker_selected_item_now_special_day_border_bottom_radius_alternate: .5rem;--_ui5-v2-4-0_daypicker_selected_item_now_special_day_top: 2.4375rem;--_ui5-v2-4-0_daypicker_two_calendar_item_margin_bottom: 0;--_ui5-v2-4-0_daypicker_twocalendar_item_special_day_now_inset: .3125rem;--_ui5-v2-4-0_daypicker_twocalendar_item_special_day_now_border_radius: .25rem;--_ui5-v2-4-0_daypicker_item_now_focus_margin: 0;--_ui5-v2-4-0_daypicker_special_day_border_top: none;--_ui5-v2-4-0_daypicker_special_day_selected_border_radius_bottom: .25rem;--_ui5-v2-4-0_daypicker_specialday_focused_top: 2.125rem;--_ui5-v2-4-0_daypicker_specialday_focused_width: calc(100% - .75rem) ;--_ui5-v2-4-0_daypicker_specialday_focused_border_bottom: 0;--_ui5-v2-4-0_daypicker_item_now_specialday_top: 2.3125rem;--_ui5-v2-4-0_daypicker_item_now_specialday_width: calc(100% - .5rem) ;--_ui5-v2-4-0_dialog_header_error_state_icon_color: var(--sapNegativeElementColor);--_ui5-v2-4-0_dialog_header_information_state_icon_color: var(--sapInformativeElementColor);--_ui5-v2-4-0_dialog_header_success_state_icon_color: var(--sapPositiveElementColor);--_ui5-v2-4-0_dialog_header_warning_state_icon_color: var(--sapCriticalElementColor);--_ui5-v2-4-0_dialog_header_state_line_height: .0625rem;--_ui5-v2-4-0_dialog_header_focus_bottom_offset: 2px;--_ui5-v2-4-0_dialog_header_focus_top_offset: 1px;--_ui5-v2-4-0_dialog_header_focus_left_offset: 1px;--_ui5-v2-4-0_dialog_header_focus_right_offset: 1px;--_ui5-v2-4-0_dialog_header_border_radius: var(--sapElement_BorderCornerRadius);--_ui5-v2-4-0_file_uploader_value_state_error_hover_background_color: var(--sapField_Hover_Background);--_ui5-v2-4-0_file_uploader_hover_border: none;--_ui5-v2-4-0_table_cell_valign: center;--_ui5-v2-4-0_table_cell_min_width: 2.75rem;--_ui5-v2-4-0_table_navigated_cell_width: .1875rem;--_ui5-v2-4-0_table_shadow_border_left: inset var(--sapContent_FocusWidth) 0 var(--sapContent_FocusColor);--_ui5-v2-4-0_table_shadow_border_right: inset calc(-1 * var(--sapContent_FocusWidth)) 0 var(--sapContent_FocusColor);--_ui5-v2-4-0_table_shadow_border_top: inset 0 var(--sapContent_FocusWidth) var(--sapContent_FocusColor);--_ui5-v2-4-0_table_shadow_border_bottom: inset 0 -1px var(--sapContent_FocusColor);--ui5-v2-4-0-form-item-layout: 1fr 2fr;--ui5-v2-4-0-form-item-layout-span1: 1fr 11fr;--ui5-v2-4-0-form-item-layout-span2: 2fr 10fr;--ui5-v2-4-0-form-item-layout-span3: 3fr 9fr;--ui5-v2-4-0-form-item-layout-span4: 4fr 8fr;--ui5-v2-4-0-form-item-layout-span5: 5fr 7fr;--ui5-v2-4-0-form-item-layout-span6: 6fr 6fr;--ui5-v2-4-0-form-item-layout-span7: 7fr 5fr;--ui5-v2-4-0-form-item-layout-span8: 8fr 4fr;--ui5-v2-4-0-form-item-layout-span9: 9fr 3fr;--ui5-v2-4-0-form-item-layout-span10: 10fr 2fr;--ui5-v2-4-0-form-item-layout-span11: 11fr 1fr;--ui5-v2-4-0-form-item-layout-span12: 1fr;--ui5-v2-4-0-form-item-label-justify: end;--ui5-v2-4-0-form-item-label-justify-span12: start;--ui5-v2-4-0-form-item-label-padding: .125rem 0;--ui5-v2-4-0-form-item-label-padding-end: .85rem;--ui5-v2-4-0-form-item-label-padding-span12: .625rem .25rem 0 .25rem;--ui5-v2-4-0-group-header-listitem-background-color: var(--sapList_GroupHeaderBackground);--ui5-v2-4-0-icon-focus-border-radius: .25rem;--_ui5-v2-4-0_input_width: 13.125rem;--_ui5-v2-4-0_input_min_width: 2.75rem;--_ui5-v2-4-0_input_height: var(--sapElement_Height);--_ui5-v2-4-0_input_compact_height: 1.625rem;--_ui5-v2-4-0_input_value_state_error_hover_background: var(--sapField_Hover_Background);--_ui5-v2-4-0_input_background_color: var(--sapField_Background);--_ui5-v2-4-0_input_border_radius: var(--sapField_BorderCornerRadius);--_ui5-v2-4-0_input_placeholder_style: italic;--_ui5-v2-4-0_input_placeholder_color: var(--sapField_PlaceholderTextColor);--_ui5-v2-4-0_input_bottom_border_height: 0;--_ui5-v2-4-0_input_bottom_border_color: transparent;--_ui5-v2-4-0_input_focused_border_color: var(--sapField_Hover_BorderColor);--_ui5-v2-4-0_input_state_border_width: .125rem;--_ui5-v2-4-0_input_information_border_width: .125rem;--_ui5-v2-4-0_input_error_font_weight: normal;--_ui5-v2-4-0_input_warning_font_weight: normal;--_ui5-v2-4-0_input_focus_border_width: 1px;--_ui5-v2-4-0_input_error_warning_font_style: inherit;--_ui5-v2-4-0_input_error_warning_text_indent: 0;--_ui5-v2-4-0_input_disabled_color: var(--sapContent_DisabledTextColor);--_ui5-v2-4-0_input_disabled_font_weight: normal;--_ui5-v2-4-0_input_disabled_border_color: var(--sapField_BorderColor);--_ui5-v2-4-0-input_disabled_background: var(--sapField_Background);--_ui5-v2-4-0_input_readonly_border_color: var(--sapField_ReadOnly_BorderColor);--_ui5-v2-4-0_input_readonly_background: var(--sapField_ReadOnly_Background);--_ui5-v2-4-0_input_disabled_opacity: var(--sapContent_DisabledOpacity);--_ui5-v2-4-0_input_icon_min_width: 2.25rem;--_ui5-v2-4-0_input_compact_min_width: 2rem;--_ui5-v2-4-0_input_transition: none;--_ui5-v2-4-0-input-value-state-icon-display: none;--_ui5-v2-4-0_input_value_state_error_border_color: var(--sapField_InvalidColor);--_ui5-v2-4-0_input_focused_value_state_error_border_color: var(--sapField_InvalidColor);--_ui5-v2-4-0_input_value_state_warning_border_color: var(--sapField_WarningColor);--_ui5-v2-4-0_input_focused_value_state_warning_border_color: var(--sapField_WarningColor);--_ui5-v2-4-0_input_value_state_success_border_color: var(--sapField_SuccessColor);--_ui5-v2-4-0_input_focused_value_state_success_border_color: var(--sapField_SuccessColor);--_ui5-v2-4-0_input_value_state_success_border_width: 1px;--_ui5-v2-4-0_input_value_state_information_border_color: var(--sapField_InformationColor);--_ui5-v2-4-0_input_focused_value_state_information_border_color: var(--sapField_InformationColor);--_ui5-v2-4-0-input-value-state-information-border-width: 1px;--_ui5-v2-4-0-input-background-image: none;--ui5-v2-4-0_input_focus_pseudo_element_content: "";--_ui5-v2-4-0_input_value_state_error_warning_placeholder_font_weight: normal;--_ui5-v2-4-0-input_error_placeholder_color: var(--sapField_PlaceholderTextColor);--_ui5-v2-4-0_input_icon_width: 2.25rem;--_ui5-v2-4-0-input-icons-count: 0;--_ui5-v2-4-0_input_margin_top_bottom: .1875rem;--_ui5-v2-4-0_input_tokenizer_min_width: 3.25rem;--_ui5-v2-4-0-input-border: none;--_ui5-v2-4-0_input_hover_border: none;--_ui5-v2-4-0_input_focus_border_radius: .25rem;--_ui5-v2-4-0_input_readonly_focus_border_radius: .125rem;--_ui5-v2-4-0_input_error_warning_border_style: none;--_ui5-v2-4-0_input_focused_value_state_error_background: var(--sapField_Hover_Background);--_ui5-v2-4-0_input_focused_value_state_warning_background: var(--sapField_Hover_Background);--_ui5-v2-4-0_input_focused_value_state_success_background: var(--sapField_Hover_Background);--_ui5-v2-4-0_input_focused_value_state_information_background: var(--sapField_Hover_Background);--_ui5-v2-4-0_input_focused_value_state_error_focus_outline_color: var(--sapField_InvalidColor);--_ui5-v2-4-0_input_focused_value_state_warning_focus_outline_color: var(--sapField_WarningColor);--_ui5-v2-4-0_input_focused_value_state_success_focus_outline_color: var(--sapField_SuccessColor);--_ui5-v2-4-0_input_focus_offset: 0;--_ui5-v2-4-0_input_readonly_focus_offset: .125rem;--_ui5-v2-4-0_input_information_icon_padding: .625rem .625rem .5rem .625rem;--_ui5-v2-4-0_input_information_focused_icon_padding: .625rem .625rem .5625rem .625rem;--_ui5-v2-4-0_input_error_warning_icon_padding: .625rem .625rem .5rem .625rem;--_ui5-v2-4-0_input_error_warning_focused_icon_padding: .625rem .625rem .5625rem .625rem;--_ui5-v2-4-0_input_custom_icon_padding: .625rem .625rem .5625rem .625rem;--_ui5-v2-4-0_input_error_warning_custom_icon_padding: .625rem .625rem .5rem .625rem;--_ui5-v2-4-0_input_error_warning_custom_focused_icon_padding: .625rem .625rem .5625rem .625rem;--_ui5-v2-4-0_input_information_custom_icon_padding: .625rem .625rem .5rem .625rem;--_ui5-v2-4-0_input_information_custom_focused_icon_padding: .625rem .625rem .5625rem .625rem;--_ui5-v2-4-0_input_focus_outline_color: var(--sapField_Active_BorderColor);--_ui5-v2-4-0_input_icon_wrapper_height: calc(100% - 1px) ;--_ui5-v2-4-0_input_icon_wrapper_state_height: calc(100% - 2px) ;--_ui5-v2-4-0_input_icon_wrapper_success_state_height: calc(100% - var(--_ui5-v2-4-0_input_value_state_success_border_width));--_ui5-v2-4-0_input_icon_color: var(--sapContent_IconColor);--_ui5-v2-4-0_input_icon_pressed_bg: var(--sapButton_Selected_Background);--_ui5-v2-4-0_input_icon_padding: .625rem .625rem .5625rem .625rem;--_ui5-v2-4-0_input_icon_hover_bg: var(--sapField_Focus_Background);--_ui5-v2-4-0_input_icon_pressed_color: var(--sapButton_Active_TextColor);--_ui5-v2-4-0_input_icon_border_radius: .25rem;--_ui5-v2-4-0_input_icon_box_shadow: var(--sapField_Hover_Shadow);--_ui5-v2-4-0_input_icon_border: none;--_ui5-v2-4-0_input_error_icon_box_shadow: var(--sapContent_Negative_Shadow);--_ui5-v2-4-0_input_warning_icon_box_shadow: var(--sapContent_Critical_Shadow);--_ui5-v2-4-0_input_information_icon_box_shadow: var(--sapContent_Informative_Shadow);--_ui5-v2-4-0_input_success_icon_box_shadow: var(--sapContent_Positive_Shadow);--_ui5-v2-4-0_input_icon_error_pressed_color: var(--sapButton_Reject_Selected_TextColor);--_ui5-v2-4-0_input_icon_warning_pressed_color: var(--sapButton_Attention_Selected_TextColor);--_ui5-v2-4-0_input_icon_information_pressed_color: var(--sapButton_Selected_TextColor);--_ui5-v2-4-0_input_icon_success_pressed_color: var(--sapButton_Accept_Selected_TextColor);--_ui5-v2-4-0_link_focus_text_decoration: underline;--_ui5-v2-4-0_link_text_decoration: var(--sapLink_TextDecoration);--_ui5-v2-4-0_link_hover_text_decoration: var(--sapLink_Hover_TextDecoration);--_ui5-v2-4-0_link_focused_hover_text_decoration: none;--_ui5-v2-4-0_link_focused_hover_text_color: var(--sapContent_ContrastTextColor);--_ui5-v2-4-0_link_active_text_decoration: var(--sapLink_Active_TextDecoration);--_ui5-v2-4-0_link_outline: none;--_ui5-v2-4-0_link_focus_border-radius: .125rem;--_ui5-v2-4-0_link_focus_background_color: var(--sapContent_FocusColor);--_ui5-v2-4-0_link_focus_color: var(--sapContent_ContrastTextColor);--_ui5-v2-4-0_link_subtle_text_decoration: underline;--_ui5-v2-4-0_link_subtle_text_decoration_hover: none;--ui5-v2-4-0_list_footer_text_color: var(--sapList_FooterTextColor);--ui5-v2-4-0-listitem-background-color: var(--sapList_Background);--ui5-v2-4-0-listitem-border-bottom: var(--sapList_BorderWidth) solid var(--sapList_BorderColor);--ui5-v2-4-0-listitem-selected-border-bottom: 1px solid var(--sapList_SelectionBorderColor);--ui5-v2-4-0-listitem-focused-selected-border-bottom: 1px solid var(--sapList_SelectionBorderColor);--_ui5-v2-4-0_listitembase_focus_width: 1px;--_ui5-v2-4-0-listitembase_disabled_opacity: .5;--_ui5-v2-4-0_product_switch_item_border: none;--ui5-v2-4-0-listitem-active-border-color: var(--sapContent_FocusColor);--_ui5-v2-4-0_menu_item_padding: 0 1rem 0 .75rem;--_ui5-v2-4-0_menu_item_submenu_icon_right: 1rem;--_ui5-v2-4-0_menu_item_additional_text_start_margin: 1rem;--_ui5-v2-4-0_menu_popover_border_radius: var(--sapPopover_BorderCornerRadius);--_ui5-v2-4-0_monthpicker_item_margin: .0625rem;--_ui5-v2-4-0_monthpicker_item_border: .0625rem solid var(--sapButton_Lite_BorderColor);--_ui5-v2-4-0_monthpicker_item_hover_border: .0625rem solid var(--sapButton_Lite_Hover_BorderColor);--_ui5-v2-4-0_monthpicker_item_active_border: .0625rem solid var(--sapButton_Lite_Active_BorderColor);--_ui5-v2-4-0_monthpicker_item_selected_border: .0625rem solid var(--sapButton_Selected_BorderColor);--_ui5-v2-4-0_monthpicker_item_selected_hover_border: .0625rem solid var(--sapButton_Selected_Hover_BorderColor);--_ui5-v2-4-0_monthpicker_item_border_radius: .5rem;--_ui5-v2-4-0_message_strip_icon_width: 2.5rem;--_ui5-v2-4-0_message_strip_button_border_width: 0;--_ui5-v2-4-0_message_strip_button_border_style: none;--_ui5-v2-4-0_message_strip_button_border_color: transparent;--_ui5-v2-4-0_message_strip_button_border_radius: 0;--_ui5-v2-4-0_message_strip_padding: .4375rem 2.5rem .4375rem 2.5rem;--_ui5-v2-4-0_message_strip_padding_block_no_icon: .4375rem .4375rem;--_ui5-v2-4-0_message_strip_padding_inline_no_icon: 1rem 2.5rem;--_ui5-v2-4-0_message_strip_button_height: 1.625rem;--_ui5-v2-4-0_message_strip_border_width: 1px;--_ui5-v2-4-0_message_strip_close_button_border: none;--_ui5-v2-4-0_message_strip_icon_top: .4375rem;--_ui5-v2-4-0_message_strip_focus_width: 1px;--_ui5-v2-4-0_message_strip_focus_offset: -2px;--_ui5-v2-4-0_message_strip_close_button_top: .125rem;--_ui5-v2-4-0_message_strip_close_button_color_set_1_background: #eaecee4d;--_ui5-v2-4-0_message_strip_close_button_color_set_2_background: #eaecee80;--_ui5-v2-4-0_message_strip_close_button_color_set_1_color: var(--sapButton_Emphasized_TextColor);--_ui5-v2-4-0_message_strip_close_button_color_set_1_hover_color: var(--sapButton_Emphasized_TextColor);--_ui5-v2-4-0_message_strip_scheme_1_set_2_background: var(--sapIndicationColor_1b);--_ui5-v2-4-0_message_strip_scheme_1_set_2_border_color: var(--sapIndicationColor_1b_BorderColor);--_ui5-v2-4-0_message_strip_scheme_2_set_2_background: var(--sapIndicationColor_2b);--_ui5-v2-4-0_message_strip_scheme_2_set_2_border_color: var(--sapIndicationColor_2b_BorderColor);--_ui5-v2-4-0_message_strip_scheme_3_set_2_background: var(--sapIndicationColor_3b);--_ui5-v2-4-0_message_strip_scheme_3_set_2_border_color: var(--sapIndicationColor_3b_BorderColor);--_ui5-v2-4-0_message_strip_scheme_4_set_2_background: var(--sapIndicationColor_4b);--_ui5-v2-4-0_message_strip_scheme_4_set_2_border_color: var(--sapIndicationColor_4b_BorderColor);--_ui5-v2-4-0_message_strip_scheme_5_set_2_background: var(--sapIndicationColor_5b);--_ui5-v2-4-0_message_strip_scheme_5_set_2_border_color: var(--sapIndicationColor_5b_BorderColor);--_ui5-v2-4-0_message_strip_scheme_6_set_2_background: var(--sapIndicationColor_6b);--_ui5-v2-4-0_message_strip_scheme_6_set_2_border_color: var(--sapIndicationColor_6b_BorderColor);--_ui5-v2-4-0_message_strip_scheme_7_set_2_background: var(--sapIndicationColor_7b);--_ui5-v2-4-0_message_strip_scheme_7_set_2_border_color: var(--sapIndicationColor_7b_BorderColor);--_ui5-v2-4-0_message_strip_scheme_8_set_2_background: var(--sapIndicationColor_8b);--_ui5-v2-4-0_message_strip_scheme_8_set_2_border_color: var(--sapIndicationColor_8b_BorderColor);--_ui5-v2-4-0_message_strip_scheme_9_set_2_background: var(--sapIndicationColor_9b);--_ui5-v2-4-0_message_strip_scheme_9_set_2_border_color: var(--sapIndicationColor_9b_BorderColor);--_ui5-v2-4-0_message_strip_scheme_10_set_2_background: var(--sapIndicationColor_10b);--_ui5-v2-4-0_message_strip_scheme_10_set_2_border_color: var(--sapIndicationColor_10b_BorderColor);--_ui5-v2-4-0_message_strip_close_button_right: .1875rem;--_ui5-v2-4-0_panel_focus_border: var(--sapContent_FocusWidth) var(--sapContent_FocusStyle) var(--sapContent_FocusColor);--_ui5-v2-4-0_panel_header_height: 2.75rem;--_ui5-v2-4-0_panel_button_root_width: 2.75rem;--_ui5-v2-4-0_panel_button_root_height: 2.75rem;--_ui5-v2-4-0_panel_header_padding_right: .5rem;--_ui5-v2-4-0_panel_header_button_wrapper_padding: .25rem;--_ui5-v2-4-0_panel_border_radius: var(--sapElement_BorderCornerRadius);--_ui5-v2-4-0_panel_border_bottom: none;--_ui5-v2-4-0_panel_default_header_border: .0625rem solid var(--sapGroup_TitleBorderColor);--_ui5-v2-4-0_panel_outline_offset: -.125rem;--_ui5-v2-4-0_panel_border_radius_expanded: var(--sapElement_BorderCornerRadius) var(--sapElement_BorderCornerRadius) 0 0;--_ui5-v2-4-0_panel_icon_color: var(--sapButton_Lite_TextColor);--_ui5-v2-4-0_panel_focus_offset: 0px;--_ui5-v2-4-0_panel_focus_bottom_offset: -1px;--_ui5-v2-4-0_panel_content_padding: .625rem 1rem;--_ui5-v2-4-0_panel_header_background_color: var(--sapGroup_TitleBackground);--_ui5-v2-4-0_popover_background: var(--sapGroup_ContentBackground);--_ui5-v2-4-0_popover_box_shadow: var(--sapContent_Shadow2);--_ui5-v2-4-0_popover_no_arrow_box_shadow: var(--sapContent_Shadow1);--_ui5-v2-4-0_popup_content_padding_s: 1rem;--_ui5-v2-4-0_popup_content_padding_m_l: 2rem;--_ui5-v2-4-0_popup_content_padding_xl: 3rem;--_ui5-v2-4-0_popup_header_footer_padding_s: 1rem;--_ui5-v2-4-0_popup_header_footer_padding_m_l: 2rem;--_ui5-v2-4-0_popup_header_footer_padding_xl: 3rem;--_ui5-v2-4-0_popup_viewport_margin: 10px;--_ui5-v2-4-0_popup_header_font_weight: 400;--_ui5-v2-4-0_popup_header_prop_header_text_alignment: flex-start;--_ui5-v2-4-0_popup_header_background: var(--sapPageHeader_Background);--_ui5-v2-4-0_popup_header_shadow: var(--sapContent_HeaderShadow);--_ui5-v2-4-0_popup_header_border: none;--_ui5-v2-4-0_popup_border_radius: .5rem;--_ui5-v2-4-0_popup_block_layer_background: var(--sapBlockLayer_Background);--_ui5-v2-4-0_popup_block_layer_opacity: .2;--_ui5-v2-4-0_progress_indicator_bar_border_max: none;--_ui5-v2-4-0_progress_indicator_icon_visibility: inline-block;--_ui5-v2-4-0_progress_indicator_side_points_visibility: block;--_ui5-v2-4-0_progress_indicator_padding: 1.25rem 0 .75rem 0;--_ui5-v2-4-0_progress_indicator_padding_novalue: .3125rem;--_ui5-v2-4-0_progress_indicator_padding_end: 1.25rem;--_ui5-v2-4-0_progress_indicator_host_height: unset;--_ui5-v2-4-0_progress_indicator_host_min_height: unset;--_ui5-v2-4-0_progress_indicator_host_box_sizing: border-box;--_ui5-v2-4-0_progress_indicator_root_position: relative;--_ui5-v2-4-0_progress_indicator_root_border_radius: .25rem;--_ui5-v2-4-0_progress_indicator_root_height: .375rem;--_ui5-v2-4-0_progress_indicator_root_min_height: .375rem;--_ui5-v2-4-0_progress_indicator_root_overflow: visible;--_ui5-v2-4-0_progress_indicator_bar_height: .625rem;--_ui5-v2-4-0_progress_indicator_bar_border_radius: .5rem;--_ui5-v2-4-0_progress_indicator_remaining_bar_border_radius: .25rem;--_ui5-v2-4-0_progress_indicator_remaining_bar_position: absolute;--_ui5-v2-4-0_progress_indicator_remaining_bar_width: 100%;--_ui5-v2-4-0_progress_indicator_remaining_bar_overflow: visible;--_ui5-v2-4-0_progress_indicator_icon_position: absolute;--_ui5-v2-4-0_progress_indicator_icon_right_position: -1.25rem;--_ui5-v2-4-0_progress_indicator_value_margin: 0 0 .1875rem 0;--_ui5-v2-4-0_progress_indicator_value_position: absolute;--_ui5-v2-4-0_progress_indicator_value_top_position: -1.3125rem;--_ui5-v2-4-0_progress_indicator_value_left_position: 0;--_ui5-v2-4-0_progress_indicator_background_none: var(--sapProgress_Background);--_ui5-v2-4-0_progress_indicator_background_error: var(--sapProgress_NegativeBackground);--_ui5-v2-4-0_progress_indicator_background_warning: var(--sapProgress_CriticalBackground);--_ui5-v2-4-0_progress_indicator_background_success: var(--sapProgress_PositiveBackground);--_ui5-v2-4-0_progress_indicator_background_information: var(--sapProgress_InformationBackground);--_ui5-v2-4-0_progress_indicator_value_state_none: var(--sapProgress_Value_Background);--_ui5-v2-4-0_progress_indicator_value_state_error: var(--sapProgress_Value_NegativeBackground);--_ui5-v2-4-0_progress_indicator_value_state_warning: var(--sapProgress_Value_CriticalBackground);--_ui5-v2-4-0_progress_indicator_value_state_success: var(--sapProgress_Value_PositiveBackground);--_ui5-v2-4-0_progress_indicator_value_state_information: var(--sapProgress_Value_InformationBackground);--_ui5-v2-4-0_progress_indicator_value_state_error_icon_color: var(--sapProgress_Value_NegativeTextColor);--_ui5-v2-4-0_progress_indicator_value_state_warning_icon_color: var(--sapProgress_Value_CriticalTextColor);--_ui5-v2-4-0_progress_indicator_value_state_success_icon_color: var(--sapProgress_Value_PositiveTextColor);--_ui5-v2-4-0_progress_indicator_value_state_information_icon_color: var(--sapProgress_Value_InformationTextColor);--_ui5-v2-4-0_progress_indicator_border: none;--_ui5-v2-4-0_progress_indicator_border_color_error: var(--sapErrorBorderColor);--_ui5-v2-4-0_progress_indicator_border_color_warning: var(--sapWarningBorderColor);--_ui5-v2-4-0_progress_indicator_border_color_success: var(--sapSuccessBorderColor);--_ui5-v2-4-0_progress_indicator_border_color_information: var(--sapInformationBorderColor);--_ui5-v2-4-0_progress_indicator_color: var(--sapField_TextColor);--_ui5-v2-4-0_progress_indicator_bar_color: var(--sapProgress_TextColor);--_ui5-v2-4-0_progress_indicator_icon_size: var(--sapFontLargeSize);--_ui5-v2-4-0_rating_indicator_item_height: 1em;--_ui5-v2-4-0_rating_indicator_item_width: 1em;--_ui5-v2-4-0_rating_indicator_component_spacing: .5rem 0px;--_ui5-v2-4-0_rating_indicator_border_radius: .25rem;--_ui5-v2-4-0_rating_indicator_outline_offset: .125rem;--_ui5-v2-4-0_rating_indicator_readonly_item_height: .75em;--_ui5-v2-4-0_rating_indicator_readonly_item_width: .75em;--_ui5-v2-4-0_rating_indicator_readonly_item_spacing: .1875rem .1875rem;--_ui5-v2-4-0_segmented_btn_inner_border: .0625rem solid transparent;--_ui5-v2-4-0_segmented_btn_inner_border_odd_child: .0625rem solid transparent;--_ui5-v2-4-0_segmented_btn_inner_pressed_border_odd_child: .0625rem solid var(--sapButton_Selected_BorderColor);--_ui5-v2-4-0_segmented_btn_inner_border_radius: var(--sapButton_BorderCornerRadius);--_ui5-v2-4-0_segmented_btn_background_color: var(--sapButton_Lite_Background);--_ui5-v2-4-0_segmented_btn_border_color: var(--sapButton_Lite_BorderColor);--_ui5-v2-4-0_segmented_btn_hover_box_shadow: none;--_ui5-v2-4-0_segmented_btn_item_border_left: .0625rem;--_ui5-v2-4-0_segmented_btn_item_border_right: .0625rem;--_ui5-v2-4-0_button_base_min_compact_width: 2rem;--_ui5-v2-4-0_button_base_height: var(--sapElement_Height);--_ui5-v2-4-0_button_compact_height: 1.625rem;--_ui5-v2-4-0_button_border_radius: var(--sapButton_BorderCornerRadius);--_ui5-v2-4-0_button_compact_padding: .4375rem;--_ui5-v2-4-0_button_emphasized_outline: 1px dotted var(--sapContent_FocusColor);--_ui5-v2-4-0_button_focus_offset: 1px;--_ui5-v2-4-0_button_focus_width: 1px;--_ui5-v2-4-0_button_emphasized_focused_border_before: .125rem solid var(--sapContent_FocusColor);--_ui5-v2-4-0_button_emphasized_focused_active_border_color: transparent;--_ui5-v2-4-0_button_focused_border: .125rem solid var(--sapContent_FocusColor);--_ui5-v2-4-0_button_focused_border_radius: .375rem;--_ui5-v2-4-0_button_focused_inner_border_radius: .375rem;--_ui5-v2-4-0_button_base_min_width: 2.25rem;--_ui5-v2-4-0_button_base_padding: .5625rem;--_ui5-v2-4-0_button_base_icon_only_padding: .5625rem;--_ui5-v2-4-0_button_base_icon_margin: .375rem;--_ui5-v2-4-0_button_icon_font_size: 1rem;--_ui5-v2-4-0_button_text_shadow: none;--_ui5-v2-4-0_button_emphasized_border_width: .0625rem;--_ui5-v2-4-0_button_pressed_focused_border_color: var(--sapContent_FocusColor);--_ui5-v2-4-0_button_fontFamily: var(--sapFontSemiboldDuplexFamily);--_ui5-v2-4-0_button_emphasized_focused_border_color: var(--sapContent_ContrastFocusColor);--_ui5-v2-4-0_radio_button_min_width: 2.75rem;--_ui5-v2-4-0_radio_button_hover_fill_error: var(--sapField_Hover_Background);--_ui5-v2-4-0_radio_button_hover_fill_warning: var(--sapField_Hover_Background);--_ui5-v2-4-0_radio_button_hover_fill_success: var(--sapField_Hover_Background);--_ui5-v2-4-0_radio_button_hover_fill_information: var(--sapField_Hover_Background);--_ui5-v2-4-0_radio_button_checked_fill: var(--sapSelectedColor);--_ui5-v2-4-0_radio_button_checked_error_fill: var(--sapField_InvalidColor);--_ui5-v2-4-0_radio_button_checked_success_fill: var(--sapField_SuccessColor);--_ui5-v2-4-0_radio_button_checked_information_fill: var(--sapField_InformationColor);--_ui5-v2-4-0_radio_button_warning_error_border_dash: 0;--_ui5-v2-4-0_radio_button_outer_ring_color: var(--sapField_BorderColor);--_ui5-v2-4-0_radio_button_outer_ring_width: var(--sapField_BorderWidth);--_ui5-v2-4-0_radio_button_outer_ring_bg: var(--sapField_Background);--_ui5-v2-4-0_radio_button_outer_ring_hover_color: var(--sapField_Hover_BorderColor);--_ui5-v2-4-0_radio_button_outer_ring_active_color: var(--sapField_Hover_BorderColor);--_ui5-v2-4-0_radio_button_outer_ring_checked_hover_color: var(--sapField_Hover_BorderColor);--_ui5-v2-4-0_radio_button_outer_ring_padding_with_label: 0 .6875rem;--_ui5-v2-4-0_radio_button_border: none;--_ui5-v2-4-0_radio_button_focus_outline: block;--_ui5-v2-4-0_radio_button_color: var(--sapField_BorderColor);--_ui5-v2-4-0_radio_button_label_offset: 1px;--_ui5-v2-4-0_radio_button_items_align: unset;--_ui5-v2-4-0_radio_button_information_border_width: var(--sapField_InformationBorderWidth);--_ui5-v2-4-0_radio_button_border_width: var(--sapContent_FocusWidth);--_ui5-v2-4-0_radio_button_border_radius: .5rem;--_ui5-v2-4-0_radio_button_label_color: var(--sapField_TextColor);--_ui5-v2-4-0_radio_button_inner_ring_radius: 27.5%;--_ui5-v2-4-0_radio_button_outer_ring_padding: 0 .6875rem;--_ui5-v2-4-0_radio_button_read_only_border_type: 4,2;--_ui5-v2-4-0_radio_button_inner_ring_color: var(--sapContent_Selected_ForegroundColor);--_ui5-v2-4-0_radio_button_checked_warning_fill: var(--sapField_WarningColor);--_ui5-v2-4-0_radio_button_read_only_inner_ring_color: var(--sapField_TextColor);--_ui5-v2-4-0_radio_button_read_only_border_width: var(--sapElement_BorderWidth);--_ui5-v2-4-0_radio_button_hover_fill: var(--sapContent_Selected_Hover_Background);--_ui5-v2-4-0_radio_button_focus_dist: .375rem;--_ui5-v2-4-0_switch_height: 2.75rem;--_ui5-v2-4-0_switch_foucs_border_size: 1px;--_ui5-v2-4-0-switch-root-border-radius: 0;--_ui5-v2-4-0-switch-root-box-shadow: none;--_ui5-v2-4-0-switch-focus: "";--_ui5-v2-4-0_switch_track_border_radius: .75rem;--_ui5-v2-4-0-switch-track-border: 1px solid;--_ui5-v2-4-0_switch_track_transition: none;--_ui5-v2-4-0_switch_handle_border_radius: 1rem;--_ui5-v2-4-0-switch-handle-icon-display: none;--_ui5-v2-4-0-switch-slider-texts-display: inline;--_ui5-v2-4-0_switch_width: 3.5rem;--_ui5-v2-4-0_switch_min_width: none;--_ui5-v2-4-0_switch_with_label_width: 3.875rem;--_ui5-v2-4-0_switch_focus_outline: none;--_ui5-v2-4-0_switch_root_after_outline: .125rem solid var(--sapContent_FocusColor);--_ui5-v2-4-0_switch_root_after_boreder: none;--_ui5-v2-4-0_switch_root_after_boreder_radius: 1rem;--_ui5-v2-4-0_switch_root_outline_top: .5rem;--_ui5-v2-4-0_switch_root_outline_bottom: .5rem;--_ui5-v2-4-0_switch_root_outline_left: .375rem;--_ui5-v2-4-0_switch_root_outline_right: .375rem;--_ui5-v2-4-0_switch_disabled_opacity: var(--sapContent_DisabledOpacity);--_ui5-v2-4-0_switch_transform: translateX(100%) translateX(-1.625rem);--_ui5-v2-4-0_switch_transform_with_label: translateX(100%) translateX(-1.875rem);--_ui5-v2-4-0_switch_rtl_transform: translateX(-100%) translateX(1.625rem);--_ui5-v2-4-0_switch_rtl_transform_with_label: translateX(-100%) translateX(1.875rem);--_ui5-v2-4-0_switch_track_width: 2.5rem;--_ui5-v2-4-0_switch_track_height: 1.5rem;--_ui5-v2-4-0_switch_track_with_label_width: 2.875rem;--_ui5-v2-4-0_switch_track_with_label_height: 1.5rem;--_ui5-v2-4-0_switch_track_active_background_color: var(--sapButton_Track_Selected_Background);--_ui5-v2-4-0_switch_track_inactive_background_color: var(--sapButton_Track_Background);--_ui5-v2-4-0_switch_track_hover_active_background_color: var(--sapButton_Track_Selected_Hover_Background);--_ui5-v2-4-0_switch_track_hover_inactive_background_color: var(--sapButton_Track_Hover_Background);--_ui5-v2-4-0_switch_track_active_border_color: var(--sapButton_Track_Selected_BorderColor);--_ui5-v2-4-0_switch_track_inactive_border_color: var(--sapButton_Track_BorderColor);--_ui5-v2-4-0_switch_track_hover_active_border_color: var(--sapButton_Track_Selected_Hover_BorderColor);--_ui5-v2-4-0_switch_track_hover_inactive_border_color: var(--sapButton_Track_Hover_BorderColor);--_ui5-v2-4-0_switch_track_semantic_accept_background_color: var(--sapButton_Track_Positive_Background);--_ui5-v2-4-0_switch_track_semantic_reject_background_color: var(--sapButton_Track_Negative_Background);--_ui5-v2-4-0_switch_track_semantic_hover_accept_background_color: var(--sapButton_Track_Positive_Hover_Background);--_ui5-v2-4-0_switch_track_semantic_hover_reject_background_color: var(--sapButton_Track_Negative_Hover_Background);--_ui5-v2-4-0_switch_track_semantic_accept_border_color: var(--sapButton_Track_Positive_BorderColor);--_ui5-v2-4-0_switch_track_semantic_reject_border_color: var(--sapButton_Track_Negative_BorderColor);--_ui5-v2-4-0_switch_track_semantic_hover_accept_border_color: var(--sapButton_Track_Positive_Hover_BorderColor);--_ui5-v2-4-0_switch_track_semantic_hover_reject_border_color: var(--sapButton_Track_Negative_Hover_BorderColor);--_ui5-v2-4-0_switch_track_icon_display: inline-block;--_ui5-v2-4-0_switch_handle_width: 1.5rem;--_ui5-v2-4-0_switch_handle_height: 1.25rem;--_ui5-v2-4-0_switch_handle_with_label_width: 1.75rem;--_ui5-v2-4-0_switch_handle_with_label_height: 1.25rem;--_ui5-v2-4-0_switch_handle_border: var(--_ui5-v2-4-0_switch_handle_border_width) solid var(--sapButton_Handle_BorderColor);--_ui5-v2-4-0_switch_handle_border_width: .125rem;--_ui5-v2-4-0_switch_handle_active_background_color: var(--sapButton_Handle_Selected_Background);--_ui5-v2-4-0_switch_handle_inactive_background_color: var(--sapButton_Handle_Background);--_ui5-v2-4-0_switch_handle_hover_active_background_color: var(--sapButton_Handle_Selected_Hover_Background);--_ui5-v2-4-0_switch_handle_hover_inactive_background_color: var(--sapButton_Handle_Hover_Background);--_ui5-v2-4-0_switch_handle_active_border_color: var(--sapButton_Handle_Selected_BorderColor);--_ui5-v2-4-0_switch_handle_inactive_border_color: var(--sapButton_Handle_BorderColor);--_ui5-v2-4-0_switch_handle_hover_active_border_color: var(--sapButton_Handle_Selected_BorderColor);--_ui5-v2-4-0_switch_handle_hover_inactive_border_color: var(--sapButton_Handle_BorderColor);--_ui5-v2-4-0_switch_handle_semantic_accept_background_color: var(--sapButton_Handle_Positive_Background);--_ui5-v2-4-0_switch_handle_semantic_reject_background_color: var(--sapButton_Handle_Negative_Background);--_ui5-v2-4-0_switch_handle_semantic_hover_accept_background_color: var(--sapButton_Handle_Positive_Hover_Background);--_ui5-v2-4-0_switch_handle_semantic_hover_reject_background_color: var(--sapButton_Handle_Negative_Hover_Background);--_ui5-v2-4-0_switch_handle_semantic_accept_border_color: var(--sapButton_Handle_Positive_BorderColor);--_ui5-v2-4-0_switch_handle_semantic_reject_border_color: var(--sapButton_Handle_Negative_BorderColor);--_ui5-v2-4-0_switch_handle_semantic_hover_accept_border_color: var(--sapButton_Handle_Positive_BorderColor);--_ui5-v2-4-0_switch_handle_semantic_hover_reject_border_color: var(--sapButton_Handle_Negative_BorderColor);--_ui5-v2-4-0_switch_handle_on_hover_box_shadow: 0 0 0 .125rem var(--sapButton_Handle_Selected_Hover_BorderColor);--_ui5-v2-4-0_switch_handle_off_hover_box_shadow: 0 0 0 .125rem var(--sapButton_Handle_Hover_BorderColor);--_ui5-v2-4-0_switch_handle_semantic_on_hover_box_shadow: 0 0 0 .125rem var(--sapButton_Handle_Positive_Hover_BorderColor);--_ui5-v2-4-0_switch_handle_semantic_off_hover_box_shadow: 0 0 0 .125rem var(--sapButton_Handle_Negative_Hover_BorderColor);--_ui5-v2-4-0_switch_handle_left: .0625rem;--_ui5-v2-4-0_switch_text_font_family: var(--sapContent_IconFontFamily);--_ui5-v2-4-0_switch_text_font_size: var(--sapFontLargeSize);--_ui5-v2-4-0_switch_text_width: 1.25rem;--_ui5-v2-4-0_switch_text_with_label_font_family: "72-Condensed-Bold" , "72" , "72full" , Arial, Helvetica, sans-serif;--_ui5-v2-4-0_switch_text_with_label_font_size: var(--sapFontSmallSize);--_ui5-v2-4-0_switch_text_with_label_width: 1.75rem;--_ui5-v2-4-0_switch_text_inactive_left: .1875rem;--_ui5-v2-4-0_switch_text_inactive_left_alternate: .0625rem;--_ui5-v2-4-0_switch_text_inactive_right: auto;--_ui5-v2-4-0_switch_text_inactive_right_alternate: 0;--_ui5-v2-4-0_switch_text_active_left: .1875rem;--_ui5-v2-4-0_switch_text_active_left_alternate: .0625rem;--_ui5-v2-4-0_switch_text_active_right: auto;--_ui5-v2-4-0_switch_text_active_color: var(--sapButton_Handle_Selected_TextColor);--_ui5-v2-4-0_switch_text_inactive_color: var(--sapButton_Handle_TextColor);--_ui5-v2-4-0_switch_text_semantic_accept_color: var(--sapButton_Handle_Positive_TextColor);--_ui5-v2-4-0_switch_text_semantic_reject_color: var(--sapButton_Handle_Negative_TextColor);--_ui5-v2-4-0_switch_text_overflow: hidden;--_ui5-v2-4-0_switch_text_z_index: 1;--_ui5-v2-4-0_switch_text_hidden: hidden;--_ui5-v2-4-0_switch_text_min_width: none;--_ui5-v2-4-0_switch_icon_width: 1rem;--_ui5-v2-4-0_switch_icon_height: 1rem;--_ui5-v2-4-0_select_disabled_background: var(--sapField_Background);--_ui5-v2-4-0_select_disabled_border_color: var(--sapField_BorderColor);--_ui5-v2-4-0_select_state_error_warning_border_style: solid;--_ui5-v2-4-0_select_state_error_warning_border_width: .125rem;--_ui5-v2-4-0_select_focus_width: 1px;--_ui5-v2-4-0_select_label_color: var(--sapField_TextColor);--_ui5-v2-4-0_select_hover_icon_left_border: none;--_ui5-v2-4-0_select_option_focus_border_radius: var(--sapElement_BorderCornerRadius);--_ui5-v2-4-0_split_button_host_transparent_hover_background: transparent;--_ui5-v2-4-0_split_button_transparent_disabled_background: transparent;--_ui5-v2-4-0_split_button_host_default_box_shadow: inset 0 0 0 var(--sapButton_BorderWidth) var(--sapButton_BorderColor);--_ui5-v2-4-0_split_button_host_attention_box_shadow: inset 0 0 0 var(--sapButton_BorderWidth) var(--sapButton_Attention_BorderColor);--_ui5-v2-4-0_split_button_host_emphasized_box_shadow: inset 0 0 0 var(--sapButton_BorderWidth) var(--sapButton_Emphasized_BorderColor);--_ui5-v2-4-0_split_button_host_positive_box_shadow: inset 0 0 0 var(--sapButton_BorderWidth) var(--sapButton_Accept_BorderColor);--_ui5-v2-4-0_split_button_host_negative_box_shadow: inset 0 0 0 var(--sapButton_BorderWidth) var(--sapButton_Reject_BorderColor);--_ui5-v2-4-0_split_button_host_transparent_box_shadow: inset 0 0 0 var(--sapButton_BorderWidth) var(--sapButton_Lite_BorderColor);--_ui5-v2-4-0_split_text_button_border_color: transparent;--_ui5-v2-4-0_split_text_button_background_color: transparent;--_ui5-v2-4-0_split_text_button_emphasized_border: var(--sapButton_BorderWidth) solid var(--sapButton_Emphasized_BorderColor);--_ui5-v2-4-0_split_text_button_emphasized_border_width: .0625rem;--_ui5-v2-4-0_split_text_button_hover_border: var(--sapButton_BorderWidth) solid var(--sapButton_BorderColor);--_ui5-v2-4-0_split_text_button_emphasized_hover_border: var(--sapButton_BorderWidth) solid var(--sapButton_Emphasized_BorderColor);--_ui5-v2-4-0_split_text_button_positive_hover_border: var(--sapButton_BorderWidth) solid var(--sapButton_Accept_BorderColor);--_ui5-v2-4-0_split_text_button_negative_hover_border: var(--sapButton_BorderWidth) solid var(--sapButton_Reject_BorderColor);--_ui5-v2-4-0_split_text_button_attention_hover_border: var(--sapButton_BorderWidth) solid var(--sapButton_Attention_BorderColor);--_ui5-v2-4-0_split_text_button_transparent_hover_border: var(--sapButton_BorderWidth) solid var(--sapButton_BorderColor);--_ui5-v2-4-0_split_arrow_button_hover_border: var(--sapButton_BorderWidth) solid var(--sapButton_BorderColor);--_ui5-v2-4-0_split_arrow_button_emphasized_hover_border: var(--sapButton_BorderWidth) solid var(--sapButton_Emphasized_BorderColor);--_ui5-v2-4-0_split_arrow_button_emphasized_hover_border_left: var(--sapButton_BorderWidth) solid var(--sapButton_Emphasized_BorderColor);--_ui5-v2-4-0_split_arrow_button_positive_hover_border: var(--sapButton_BorderWidth) solid var(--sapButton_Accept_BorderColor);--_ui5-v2-4-0_split_arrow_button_negative_hover_border: var(--sapButton_BorderWidth) solid var(--sapButton_Reject_BorderColor);--_ui5-v2-4-0_split_arrow_button_attention_hover_border: var(--sapButton_BorderWidth) solid var(--sapButton_Attention_BorderColor);--_ui5-v2-4-0_split_arrow_button_transparent_hover_border: var(--sapButton_BorderWidth) solid var(--sapButton_BorderColor);--_ui5-v2-4-0_split_text_button_hover_border_left: var(--sapButton_BorderWidth) solid var(--sapButton_BorderColor);--_ui5-v2-4-0_split_text_button_emphasized_hover_border_left: var(--sapButton_BorderWidth) solid var(--sapButton_Emphasized_BorderColor);--_ui5-v2-4-0_split_text_button_positive_hover_border_left: var(--sapButton_BorderWidth) solid var(--sapButton_Accept_BorderColor);--_ui5-v2-4-0_split_text_button_negative_hover_border_left: var(--sapButton_BorderWidth) solid var(--sapButton_Reject_BorderColor);--_ui5-v2-4-0_split_text_button_attention_hover_border_left: var(--sapButton_BorderWidth) solid var(--sapButton_Attention_BorderColor);--_ui5-v2-4-0_split_text_button_transparent_hover_border_left: var(--sapButton_BorderWidth) solid var(--sapButton_BorderColor);--_ui5-v2-4-0_split_button_focused_border: .125rem solid var(--sapContent_FocusColor);--_ui5-v2-4-0_split_button_focused_border_radius: .375rem;--_ui5-v2-4-0_split_button_hover_border_radius: var(--_ui5-v2-4-0_button_border_radius);--_ui5-v2-4-0_split_button_middle_separator_width: 0;--_ui5-v2-4-0_split_button_middle_separator_left: -.0625rem;--_ui5-v2-4-0_split_button_middle_separator_hover_display: none;--_ui5-v2-4-0_split_button_text_button_width: 2.375rem;--_ui5-v2-4-0_split_button_text_button_right_border_width: .0625rem;--_ui5-v2-4-0_split_button_transparent_hover_background: var(--sapButton_Lite_Hover_Background);--_ui5-v2-4-0_split_button_transparent_hover_color: var(--sapButton_TextColor);--_ui5-v2-4-0_split_button_host_transparent_hover_box_shadow: inset 0 0 0 var(--sapButton_BorderWidth) var(--sapButton_BorderColor);--_ui5-v2-4-0_split_button_inner_focused_border_radius_outer: .375rem;--_ui5-v2-4-0_split_button_inner_focused_border_radius_inner: .375rem;--_ui5-v2-4-0_split_button_emphasized_separator_color: transparent;--_ui5-v2-4-0_split_button_positive_separator_color: transparent;--_ui5-v2-4-0_split_button_negative_separator_color: transparent;--_ui5-v2-4-0_split_button_attention_separator_color: transparent;--_ui5-v2-4-0_split_button_attention_separator_color_default: var(--sapButton_Attention_TextColor);--_ui5-v2-4-0_split_text_button_hover_border_right: var(--sapButton_BorderWidth) solid var(--sapButton_BorderColor);--_ui5-v2-4-0_split_text_button_emphasized_hover_border_right: none;--_ui5-v2-4-0_split_text_button_positive_hover_border_right: var(--sapButton_BorderWidth) solid var(--sapButton_Accept_BorderColor);--_ui5-v2-4-0_split_text_button_negative_hover_border_right: var(--sapButton_BorderWidth) solid var(--sapButton_Reject_BorderColor);--_ui5-v2-4-0_split_text_button_attention_hover_border_right: var(--sapButton_BorderWidth) solid var(--sapButton_Attention_BorderColor);--_ui5-v2-4-0_split_text_button_transparent_hover_border_right: var(--sapButton_BorderWidth) solid var(--sapButton_BorderColor);--_ui5-v2-4-0_split_button_middle_separator_hover_display_emphasized: none;--_ui5-v2-4-0_tc_header_height: var(--_ui5-v2-4-0_tc_item_height);--_ui5-v2-4-0_tc_header_height_text_only: var(--_ui5-v2-4-0_tc_item_text_only_height);--_ui5-v2-4-0_tc_header_height_text_with_additional_text: var(--_ui5-v2-4-0_tc_item_text_only_with_additional_text_height);--_ui5-v2-4-0_tc_header_box_shadow: var(--sapContent_HeaderShadow);--_ui5-v2-4-0_tc_header_background: var(--sapObjectHeader_Background);--_ui5-v2-4-0_tc_header_background_translucent: var(--sapObjectHeader_Background);--_ui5-v2-4-0_tc_content_background: var(--sapBackgroundColor);--_ui5-v2-4-0_tc_content_background_translucent: var(--sapGroup_ContentBackground);--_ui5-v2-4-0_tc_headeritem_padding: 1rem;--_ui5-v2-4-0_tc_headerItem_additional_text_color: var(--sapContent_LabelColor);--_ui5-v2-4-0_tc_headerItem_text_selected_color: var(--sapSelectedColor);--_ui5-v2-4-0_tc_headerItem_text_selected_hover_color: var(--sapSelectedColor);--_ui5-v2-4-0_tc_headerItem_additional_text_font_weight: normal;--_ui5-v2-4-0_tc_headerItem_neutral_color: var(--sapNeutralTextColor);--_ui5-v2-4-0_tc_headerItem_positive_color: var(--sapPositiveTextColor);--_ui5-v2-4-0_tc_headerItem_negative_color: var(--sapNegativeTextColor);--_ui5-v2-4-0_tc_headerItem_critical_color: var(--sapCriticalTextColor);--_ui5-v2-4-0_tc_headerItem_neutral_border_color: var(--sapNeutralElementColor);--_ui5-v2-4-0_tc_headerItem_positive_border_color: var(--sapPositiveElementColor);--_ui5-v2-4-0_tc_headerItem_negative_border_color: var(--sapNegativeElementColor);--_ui5-v2-4-0_tc_headerItem_critical_border_color: var(--sapCriticalElementColor);--_ui5-v2-4-0_tc_headerItem_neutral_selected_border_color: var(--_ui5-v2-4-0_tc_headerItem_neutral_color);--_ui5-v2-4-0_tc_headerItem_positive_selected_border_color: var(--_ui5-v2-4-0_tc_headerItem_positive_color);--_ui5-v2-4-0_tc_headerItem_negative_selected_border_color: var(--_ui5-v2-4-0_tc_headerItem_negative_color);--_ui5-v2-4-0_tc_headerItem_critical_selected_border_color: var(--_ui5-v2-4-0_tc_headerItem_critical_color);--_ui5-v2-4-0_tc_headerItem_transition: none;--_ui5-v2-4-0_tc_headerItem_hover_border_visibility: hidden;--_ui5-v2-4-0_tc_headerItemContent_border_radius: .125rem .125rem 0 0;--_ui5-v2-4-0_tc_headerItemContent_border_bg: transparent;--_ui5-v2-4-0_tc_headerItem_neutral_border_bg: transparent;--_ui5-v2-4-0_tc_headerItem_positive_border_bg: transparent;--_ui5-v2-4-0_tc_headerItem_negative_border_bg: transparent;--_ui5-v2-4-0_tc_headerItem_critical_border_bg: transparent;--_ui5-v2-4-0_tc_headerItemContent_border_height: 0;--_ui5-v2-4-0_tc_headerItemContent_focus_offset: 1rem;--_ui5-v2-4-0_tc_headerItem_text_focus_border_offset_left: 0px;--_ui5-v2-4-0_tc_headerItem_text_focus_border_offset_right: 0px;--_ui5-v2-4-0_tc_headerItem_text_focus_border_offset_top: 0px;--_ui5-v2-4-0_tc_headerItem_text_focus_border_offset_bottom: 0px;--_ui5-v2-4-0_tc_headerItem_mixed_mode_focus_border_offset_left: .75rem;--_ui5-v2-4-0_tc_headerItem_mixed_mode_focus_border_offset_right: .625rem;--_ui5-v2-4-0_tc_headerItem_mixed_mode_focus_border_offset_top: .75rem;--_ui5-v2-4-0_tc_headerItem_mixed_mode_focus_border_offset_bottom: .75rem;--_ui5-v2-4-0_tc_headerItemContent_focus_border: none;--_ui5-v2-4-0_tc_headerItemContent_default_focus_border: none;--_ui5-v2-4-0_tc_headerItemContent_focus_border_radius: 0;--_ui5-v2-4-0_tc_headerItemSemanticIcon_display: none;--_ui5-v2-4-0_tc_headerItemSemanticIcon_size: .75rem;--_ui5-v2-4-0_tc_mixedMode_itemText_font_family: var(--sapFontFamily);--_ui5-v2-4-0_tc_mixedMode_itemText_font_size: var(--sapFontSmallSize);--_ui5-v2-4-0_tc_mixedMode_itemText_font_weight: normal;--_ui5-v2-4-0_tc_overflowItem_positive_color: var(--sapPositiveColor);--_ui5-v2-4-0_tc_overflowItem_negative_color: var(--sapNegativeColor);--_ui5-v2-4-0_tc_overflowItem_critical_color: var(--sapCriticalColor);--_ui5-v2-4-0_tc_overflowItem_focus_offset: .125rem;--_ui5-v2-4-0_tc_overflowItem_extraIndent: 0rem;--_ui5-v2-4-0_tc_headerItemIcon_positive_selected_background: var(--sapPositiveColor);--_ui5-v2-4-0_tc_headerItemIcon_negative_selected_background: var(--sapNegativeColor);--_ui5-v2-4-0_tc_headerItemIcon_critical_selected_background: var(--sapCriticalColor);--_ui5-v2-4-0_tc_headerItemIcon_neutral_selected_background: var(--sapNeutralColor);--_ui5-v2-4-0_tc_headerItemIcon_semantic_selected_color: var(--sapGroup_ContentBackground);--_ui5-v2-4-0_tc_header_border_bottom: .0625rem solid var(--sapObjectHeader_Background);--_ui5-v2-4-0_tc_headerItemContent_border_bottom: .1875rem solid var(--sapSelectedColor);--_ui5-v2-4-0_tc_headerItem_color: var(--sapTextColor);--_ui5-v2-4-0_tc_overflowItem_default_color: var(--sapTextColor);--_ui5-v2-4-0_tc_overflowItem_current_color: CurrentColor;--_ui5-v2-4-0_tc_content_border_bottom: .0625rem solid var(--sapObjectHeader_BorderColor);--_ui5-v2-4-0_tc_headerItem_expand_button_margin_inline_start: 0rem;--_ui5-v2-4-0_tc_headerItem_single_click_expand_button_margin_inline_start: .25rem;--_ui5-v2-4-0_tc_headerItem_expand_button_border_radius: .25rem;--_ui5-v2-4-0_tc_headerItem_expand_button_separator_display: inline-block;--_ui5-v2-4-0_tc_headerItem_focus_border: .125rem solid var(--sapContent_FocusColor);--_ui5-v2-4-0_tc_headerItem_focus_border_offset: -5px;--_ui5-v2-4-0_tc_headerItemIcon_focus_border_radius: 50%;--_ui5-v2-4-0_tc_headerItem_focus_border_radius: .375rem;--_ui5-v2-4-0_tc_headeritem_text_font_weight: bold;--_ui5-v2-4-0_tc_headerItem_focus_offset: 1px;--_ui5-v2-4-0_tc_headerItem_text_hover_color: var(--sapContent_Selected_ForegroundColor);--_ui5-v2-4-0_tc_headerItemIcon_border: .125rem solid var(--sapContent_Selected_ForegroundColor);--_ui5-v2-4-0_tc_headerItemIcon_color: var(--sapContent_Selected_ForegroundColor);--_ui5-v2-4-0_tc_headerItemIcon_selected_background: var(--sapContent_Selected_ForegroundColor);--_ui5-v2-4-0_tc_headerItemIcon_background_color: var(--sapContent_Selected_Background);--_ui5-v2-4-0_tc_headerItemIcon_selected_color: var(--sapContent_ContrastIconColor);--_ui5-v2-4-0_tc_mixedMode_itemText_color: var(--sapTextColor);--_ui5-v2-4-0_tc_overflow_text_color: var(--sapTextColor);--_ui5-v2-4-0_text_max_lines: initial;--_ui5-v2-4-0_textarea_state_border_width: .125rem;--_ui5-v2-4-0_textarea_information_border_width: .125rem;--_ui5-v2-4-0_textarea_placeholder_font_style: italic;--_ui5-v2-4-0_textarea_value_state_error_warning_placeholder_font_weight: normal;--_ui5-v2-4-0_textarea_error_placeholder_font_style: italic;--_ui5-v2-4-0_textarea_error_placeholder_color: var(--sapField_PlaceholderTextColor);--_ui5-v2-4-0_textarea_error_hover_background_color: var(--sapField_Hover_Background);--_ui5-v2-4-0_textarea_disabled_opacity: .4;--_ui5-v2-4-0_textarea_focus_pseudo_element_content: "";--_ui5-v2-4-0_textarea_min_height: 2.25rem;--_ui5-v2-4-0_textarea_padding_right_and_left_readonly: .5625rem;--_ui5-v2-4-0_textarea_padding_top_readonly: .4375rem;--_ui5-v2-4-0_textarea_exceeded_text_height: 1rem;--_ui5-v2-4-0_textarea_hover_border: none;--_ui5-v2-4-0_textarea_focus_border_radius: .25rem;--_ui5-v2-4-0_textarea_error_warning_border_style: none;--_ui5-v2-4-0_textarea_line_height: 1.5;--_ui5-v2-4-0_textarea_focused_value_state_error_background: var(--sapField_Hover_Background);--_ui5-v2-4-0_textarea_focused_value_state_warning_background: var(--sapField_Hover_Background);--_ui5-v2-4-0_textarea_focused_value_state_success_background: var(--sapField_Hover_Background);--_ui5-v2-4-0_textarea_focused_value_state_information_background: var(--sapField_Hover_Background);--_ui5-v2-4-0_textarea_focused_value_state_error_focus_outline_color: var(--sapField_InvalidColor);--_ui5-v2-4-0_textarea_focused_value_state_warning_focus_outline_color: var(--sapField_WarningColor);--_ui5-v2-4-0_textarea_focused_value_state_success_focus_outline_color: var(--sapField_SuccessColor);--_ui5-v2-4-0_textarea_focus_offset: 0;--_ui5-v2-4-0_textarea_readonly_focus_offset: 1px;--_ui5-v2-4-0_textarea_focus_outline_color: var(--sapField_Active_BorderColor);--_ui5-v2-4-0_textarea_value_state_focus_offset: 1px;--_ui5-v2-4-0_textarea_wrapper_padding: .0625rem;--_ui5-v2-4-0_textarea_success_wrapper_padding: .0625rem;--_ui5-v2-4-0_textarea_warning_error_wrapper_padding: .0625rem .0625rem .125rem .0625rem;--_ui5-v2-4-0_textarea_information_wrapper_padding: .0625rem .0625rem .125rem .0625rem;--_ui5-v2-4-0_textarea_padding_bottom_readonly: .375rem;--_ui5-v2-4-0_textarea_padding_top_error_warning: .5rem;--_ui5-v2-4-0_textarea_padding_bottom_error_warning: .4375rem;--_ui5-v2-4-0_textarea_padding_top_information: .5rem;--_ui5-v2-4-0_textarea_padding_bottom_information: .4375rem;--_ui5-v2-4-0_textarea_padding_right_and_left: .625rem;--_ui5-v2-4-0_textarea_padding_right_and_left_error_warning: .625rem;--_ui5-v2-4-0_textarea_padding_right_and_left_information: .625rem;--_ui5-v2-4-0_textarea_readonly_border_style: dashed;--_ui5-v2-4-0_time_picker_border: .0625rem solid transparent;--_ui5-v2-4-0-time_picker_border_radius: .25rem;--_ui5-v2-4-0_toast_vertical_offset: 3rem;--_ui5-v2-4-0_toast_horizontal_offset: 2rem;--_ui5-v2-4-0_toast_background: var(--sapList_Background);--_ui5-v2-4-0_toast_shadow: var(--sapContent_Shadow2);--_ui5-v2-4-0_toast_offset_width: -.1875rem;--_ui5-v2-4-0_toggle_button_pressed_focussed: var(--sapButton_Selected_BorderColor);--_ui5-v2-4-0_toggle_button_pressed_focussed_hovered: var(--sapButton_Selected_BorderColor);--_ui5-v2-4-0_toggle_button_selected_positive_text_color: var(--sapButton_Selected_TextColor);--_ui5-v2-4-0_toggle_button_selected_negative_text_color: var(--sapButton_Selected_TextColor);--_ui5-v2-4-0_toggle_button_selected_attention_text_color: var(--sapButton_Selected_TextColor);--_ui5-v2-4-0_toggle_button_emphasized_pressed_focussed_hovered: var(--sapContent_FocusColor);--_ui5-v2-4-0_toggle_button_emphasized_text_shadow: none;--_ui5-v2-4-0_yearpicker_item_margin: .0625rem;--_ui5-v2-4-0_yearpicker_item_border: .0625rem solid var(--sapButton_Lite_BorderColor);--_ui5-v2-4-0_yearpicker_item_hover_border: .0625rem solid var(--sapButton_Lite_Hover_BorderColor);--_ui5-v2-4-0_yearpicker_item_active_border: .0625rem solid var(--sapButton_Lite_Active_BorderColor);--_ui5-v2-4-0_yearpicker_item_selected_border: .0625rem solid var(--sapButton_Selected_BorderColor);--_ui5-v2-4-0_yearpicker_item_selected_hover_border: .0625rem solid var(--sapButton_Selected_Hover_BorderColor);--_ui5-v2-4-0_yearpicker_item_border_radius: .5rem;--_ui5-v2-4-0_calendar_header_middle_button_width: 6.25rem;--_ui5-v2-4-0_calendar_header_middle_button_flex: 1 1 auto;--_ui5-v2-4-0_calendar_header_middle_button_focus_after_display: block;--_ui5-v2-4-0_calendar_header_middle_button_focus_after_width: calc(100% - .375rem) ;--_ui5-v2-4-0_calendar_header_middle_button_focus_after_height: calc(100% - .375rem) ;--_ui5-v2-4-0_calendar_header_middle_button_focus_after_top_offset: .125rem;--_ui5-v2-4-0_calendar_header_middle_button_focus_after_left_offset: .125rem;--_ui5-v2-4-0_calendar_header_arrow_button_border: none;--_ui5-v2-4-0_calendar_header_arrow_button_border_radius: .5rem;--_ui5-v2-4-0_calendar_header_button_background_color: var(--sapButton_Lite_Background);--_ui5-v2-4-0_calendar_header_arrow_button_box_shadow: 0 0 .125rem 0 rgb(85 107 130 / 72%);--_ui5-v2-4-0_calendar_header_middle_button_focus_border_radius: .5rem;--_ui5-v2-4-0_calendar_header_middle_button_focus_border: none;--_ui5-v2-4-0_calendar_header_middle_button_focus_after_border: none;--_ui5-v2-4-0_calendar_header_middle_button_focus_background: transparent;--_ui5-v2-4-0_calendar_header_middle_button_focus_outline: .125rem solid var(--sapSelectedColor);--_ui5-v2-4-0_calendar_header_middle_button_focus_active_outline: .0625rem solid var(--sapSelectedColor);--_ui5-v2-4-0_calendar_header_middle_button_focus_active_background: transparent;--_ui5-v2-4-0_token_background: var(--sapButton_TokenBackground);--_ui5-v2-4-0_token_readonly_background: var(--sapButton_TokenBackground);--_ui5-v2-4-0_token_readonly_color: var(--sapContent_LabelColor);--_ui5-v2-4-0_token_right_margin: .3125rem;--_ui5-v2-4-0_token_padding: .25rem 0;--_ui5-v2-4-0_token_left_padding: .3125rem;--_ui5-v2-4-0_token_focused_selected_border: 1px solid var(--sapButton_Selected_BorderColor);--_ui5-v2-4-0_token_focus_offset: -.25rem;--_ui5-v2-4-0_token_focus_outline_width: .0625rem;--_ui5-v2-4-0_token_hover_border_color: var(--sapButton_TokenBorderColor);--_ui5-v2-4-0_token_selected_focus_outline: none;--_ui5-v2-4-0_token_focus_outline: none;--_ui5-v2-4-0_token_outline_offset: .125rem;--_ui5-v2-4-0_token_selected_hover_border_color: var(--sapButton_Selected_BorderColor);--ui5-v2-4-0_token_focus_pseudo_element_content: "";--_ui5-v2-4-0_token_border_radius: .375rem;--_ui5-v2-4-0_token_focus_outline_border_radius: .5rem;--_ui5-v2-4-0_token_text_color: var(--sapTextColor);--_ui5-v2-4-0_token_selected_text_font_family: var(--sapFontSemiboldDuplexFamily);--_ui5-v2-4-0_token_selected_internal_border_bottom: .125rem solid var(--sapButton_Selected_BorderColor);--_ui5-v2-4-0_token_selected_internal_border_bottom_radius: .1875rem;--_ui5-v2-4-0_token_text_icon_top: .0625rem;--_ui5-v2-4-0_token_selected_focused_offset_bottom: -.375rem;--_ui5-v2-4-0_token_readonly_padding: .25rem .3125rem;--_ui5-v2-4-0_tokenizer-popover_offset: .3125rem;--_ui5-v2-4-0_tokenizer_n_more_text_color: var(--sapLinkColor);--_ui5-v2-4-0-multi_combobox_token_margin_top: 1px;--_ui5-v2-4-0_slider_progress_container_dot_background: var(--sapField_BorderColor);--_ui5-v2-4-0_slider_progress_border: none;--_ui5-v2-4-0_slider_padding: 1.406rem 1.0625rem;--_ui5-v2-4-0_slider_inner_height: .25rem;--_ui5-v2-4-0_slider_outer_height: 1.6875rem;--_ui5-v2-4-0_slider_progress_border_radius: .25rem;--_ui5-v2-4-0_slider_tickmark_bg: var(--sapField_BorderColor);--_ui5-v2-4-0_slider_handle_margin_left: calc(-1 * (var(--_ui5-v2-4-0_slider_handle_width) / 2));--_ui5-v2-4-0_slider_handle_outline_offset: .075rem;--_ui5-v2-4-0_slider_progress_outline: .0625rem dotted var(--sapContent_FocusColor);--_ui5-v2-4-0_slider_progress_outline_offset: -.8125rem;--_ui5-v2-4-0_slider_disabled_opacity: .4;--_ui5-v2-4-0_slider_tooltip_border_color: var(--sapField_BorderColor);--_ui5-v2-4-0_range_slider_handle_background_focus: transparent;--_ui5-v2-4-0_slider_progress_box_sizing: content-box;--_ui5-v2-4-0_range_slider_focus_outline_width: 100%;--_ui5-v2-4-0_slider_progress_outline_offset_left: 0;--_ui5-v2-4-0_range_slider_focus_outline_radius: 0;--_ui5-v2-4-0_slider_progress_container_top: 0;--_ui5-v2-4-0_slider_progress_height: 100%;--_ui5-v2-4-0_slider_active_progress_border: none;--_ui5-v2-4-0_slider_active_progress_left: 0;--_ui5-v2-4-0_slider_active_progress_top: 0;--_ui5-v2-4-0_slider_no_tickmarks_progress_container_top: var(--_ui5-v2-4-0_slider_progress_container_top);--_ui5-v2-4-0_slider_no_tickmarks_progress_height: var(--_ui5-v2-4-0_slider_progress_height);--_ui5-v2-4-0_slider_no_tickmarks_active_progress_border: var(--_ui5-v2-4-0_slider_active_progress_border);--_ui5-v2-4-0_slider_no_tickmarks_active_progress_left: var(--_ui5-v2-4-0_slider_active_progress_left);--_ui5-v2-4-0_slider_no_tickmarks_active_progress_top: var(--_ui5-v2-4-0_slider_active_progress_top);--_ui5-v2-4-0_slider_handle_focus_visibility: none;--_ui5-v2-4-0_slider_handle_icon_size: 1rem;--_ui5-v2-4-0_slider_progress_container_background: var(--sapSlider_Background);--_ui5-v2-4-0_slider_progress_container_dot_display: block;--_ui5-v2-4-0_slider_inner_min_width: 4rem;--_ui5-v2-4-0_slider_progress_background: var(--sapSlider_Selected_Background);--_ui5-v2-4-0_slider_progress_before_background: var(--sapSlider_Selected_Background);--_ui5-v2-4-0_slider_progress_after_background: var(--sapContent_MeasureIndicatorColor);--_ui5-v2-4-0_slider_handle_background: var(--sapSlider_HandleBackground);--_ui5-v2-4-0_slider_handle_icon_display: inline-block;--_ui5-v2-4-0_slider_handle_border: .0625rem solid var(--sapSlider_HandleBorderColor);--_ui5-v2-4-0_slider_handle_border_radius: .5rem;--_ui5-v2-4-0_slider_handle_height: 1.5rem;--_ui5-v2-4-0_slider_handle_width: 2rem;--_ui5-v2-4-0_slider_handle_top: -.625rem;--_ui5-v2-4-0_slider_handle_font_family: "SAP-icons";--_ui5-v2-4-0_slider_handle_hover_border: .0625rem solid var(--sapSlider_Hover_HandleBorderColor);--_ui5-v2-4-0_slider_handle_focus_border: .125rem solid var(--sapContent_FocusColor);--_ui5-v2-4-0_slider_handle_background_focus: var(--sapSlider_Active_RangeHandleBackground);--_ui5-v2-4-0_slider_handle_outline: none;--_ui5-v2-4-0_slider_handle_hover_background: var(--sapSlider_Hover_HandleBackground);--_ui5-v2-4-0_slider_tooltip_background: var(--sapField_Focus_Background);--_ui5-v2-4-0_slider_tooltip_border: none;--_ui5-v2-4-0_slider_tooltip_border_radius: .5rem;--_ui5-v2-4-0_slider_tooltip_box_shadow: var(--sapContent_Shadow1);--_ui5-v2-4-0_range_slider_legacy_progress_focus_display: none;--_ui5-v2-4-0_range_slider_progress_focus_display: block;--_ui5-v2-4-0_slider_tickmark_in_range_bg: var(--sapSlider_Selected_BorderColor);--_ui5-v2-4-0_slider_label_fontsize: var(--sapFontSmallSize);--_ui5-v2-4-0_slider_label_color: var(--sapContent_LabelColor);--_ui5-v2-4-0_slider_tooltip_min_width: 2rem;--_ui5-v2-4-0_slider_tooltip_padding: .25rem;--_ui5-v2-4-0_slider_tooltip_fontsize: var(--sapFontSmallSize);--_ui5-v2-4-0_slider_tooltip_color: var(--sapContent_LabelColor);--_ui5-v2-4-0_slider_tooltip_height: 1.375rem;--_ui5-v2-4-0_slider_handle_focus_width: 1px;--_ui5-v2-4-0_slider_start_end_point_size: .5rem;--_ui5-v2-4-0_slider_start_end_point_left: -.75rem;--_ui5-v2-4-0_slider_start_end_point_top: -.125rem;--_ui5-v2-4-0_slider_handle_focused_tooltip_distance: calc(var(--_ui5-v2-4-0_slider_tooltip_bottom) - var(--_ui5-v2-4-0_slider_handle_focus_width));--_ui5-v2-4-0_slider_tooltip_border_box: border-box;--_ui5-v2-4-0_range_slider_handle_active_background: var(--sapSlider_Active_RangeHandleBackground);--_ui5-v2-4-0_range_slider_active_handle_icon_display: none;--_ui5-v2-4-0_range_slider_progress_focus_top: -15px;--_ui5-v2-4-0_range_slider_progress_focus_left: calc(-1 * (var(--_ui5-v2-4-0_slider_handle_width) / 2) - 5px);--_ui5-v2-4-0_range_slider_progress_focus_padding: 0 1rem 0 1rem;--_ui5-v2-4-0_range_slider_progress_focus_width: calc(100% + var(--_ui5-v2-4-0_slider_handle_width) + 10px);--_ui5-v2-4-0_range_slider_progress_focus_height: calc(var(--_ui5-v2-4-0_slider_handle_height) + 10px);--_ui5-v2-4-0_range_slider_root_hover_handle_icon_display: inline-block;--_ui5-v2-4-0_range_slider_root_hover_handle_bg: var(--_ui5-v2-4-0_slider_handle_hover_background);--_ui5-v2-4-0_range_slider_root_active_handle_icon_display: none;--_ui5-v2-4-0_slider_tickmark_height: .5rem;--_ui5-v2-4-0_slider_tickmark_top: -2px;--_ui5-v2-4-0_slider_handle_box_sizing: border-box;--_ui5-v2-4-0_range_slider_handle_background: var(--sapSlider_RangeHandleBackground);--_ui5-v2-4-0_slider_tooltip_bottom: 2rem;--_ui5-v2-4-0_value_state_message_border: none;--_ui5-v2-4-0_value_state_header_border: none;--_ui5-v2-4-0_input_value_state_icon_offset: .5rem;--_ui5-v2-4-0_value_state_header_box_shadow_error: inset 0 -.0625rem var(--sapField_InvalidColor);--_ui5-v2-4-0_value_state_header_box_shadow_information: inset 0 -.0625rem var(--sapField_InformationColor);--_ui5-v2-4-0_value_state_header_box_shadow_success: inset 0 -.0625rem var(--sapField_SuccessColor);--_ui5-v2-4-0_value_state_header_box_shadow_warning: inset 0 -.0625rem var(--sapField_WarningColor);--_ui5-v2-4-0_value_state_message_icon_offset_phone: 1rem;--_ui5-v2-4-0_value_state_header_border_bottom: none;--_ui5-v2-4-0_input_value_state_icon_display: inline-block;--_ui5-v2-4-0_value_state_message_padding: .5rem .5rem .5rem 1.875rem;--_ui5-v2-4-0_value_state_header_padding: .5rem .5rem .5rem 1.875rem;--_ui5-v2-4-0_value_state_message_popover_box_shadow: var(--sapContent_Shadow1);--_ui5-v2-4-0_value_state_message_icon_width: 1rem;--_ui5-v2-4-0_value_state_message_icon_height: 1rem;--_ui5-v2-4-0_value_state_header_offset: -.25rem;--_ui5-v2-4-0_value_state_message_popover_border_radius: var(--sapPopover_BorderCornerRadius);--_ui5-v2-4-0_value_state_message_padding_phone: .5rem .5rem .5rem 2.375rem;--_ui5-v2-4-0_value_state_message_line_height: 1.125rem;--_ui5-v2-4-0-toolbar-padding-left: .5rem;--_ui5-v2-4-0-toolbar-padding-right: .5rem;--_ui5-v2-4-0-toolbar-item-margin-left: 0;--_ui5-v2-4-0-toolbar-item-margin-right: .25rem;--_ui5-v2-4-0_step_input_min_width: 7.25rem;--_ui5-v2-4-0_step_input_padding: 2.5rem;--_ui5-v2-4-0_step_input_input_error_background_color: inherit;--_ui5-v2-4-0-step_input_button_state_hover_background_color: var(--sapField_Hover_Background);--_ui5-v2-4-0_step_input_border_style: none;--_ui5-v2-4-0_step_input_border_style_hover: none;--_ui5-v2-4-0_step_input_button_background_color: transparent;--_ui5-v2-4-0_step_input_input_border: none;--_ui5-v2-4-0_step_input_input_margin_top: 0;--_ui5-v2-4-0_step_input_button_display: inline-flex;--_ui5-v2-4-0_step_input_button_left: 0;--_ui5-v2-4-0_step_input_button_right: 0;--_ui5-v2-4-0_step_input_input_border_focused_after: .125rem solid #0070f2;--_ui5-v2-4-0_step_input_input_border_top_bottom_focused_after: 0;--_ui5-v2-4-0_step_input_input_border_radius_focused_after: .25rem;--_ui5-v2-4-0_step_input_input_information_border_color_focused_after: var(--sapField_InformationColor);--_ui5-v2-4-0_step_input_input_warning_border_color_focused_after: var(--sapField_WarningColor);--_ui5-v2-4-0_step_input_input_success_border_color_focused_after: var(--sapField_SuccessColor);--_ui5-v2-4-0_step_input_input_error_border_color_focused_after: var(--sapField_InvalidColor);--_ui5-v2-4-0_step_input_disabled_button_background: none;--_ui5-v2-4-0_step_input_border_color_hover: none;--_ui5-v2-4-0_step_input_border_hover: none;--_ui5-v2-4-0_input_input_background_color: transparent;--_ui5-v2-4-0_load_more_padding: 0;--_ui5-v2-4-0_load_more_border: 1px top solid transparent;--_ui5-v2-4-0_load_more_border_radius: none;--_ui5-v2-4-0_load_more_outline_width: var(--sapContent_FocusWidth);--_ui5-v2-4-0_load_more_border-bottom: var(--sapList_BorderWidth) solid var(--sapList_BorderColor);--_ui5-v2-4-0_calendar_height: 24.5rem;--_ui5-v2-4-0_calendar_width: 20rem;--_ui5-v2-4-0_calendar_padding: 1rem;--_ui5-v2-4-0_calendar_left_right_padding: .5rem;--_ui5-v2-4-0_calendar_top_bottom_padding: 1rem;--_ui5-v2-4-0_calendar_header_height: 3rem;--_ui5-v2-4-0_calendar_header_arrow_button_width: 2.5rem;--_ui5-v2-4-0_calendar_header_padding: .25rem 0;--_ui5-v2-4-0_checkbox_root_side_padding: .6875rem;--_ui5-v2-4-0_checkbox_icon_size: 1rem;--_ui5-v2-4-0_checkbox_partially_icon_size: .75rem;--_ui5-v2-4-0_custom_list_item_rb_min_width: 2.75rem;--_ui5-v2-4-0_day_picker_item_width: 2.25rem;--_ui5-v2-4-0_day_picker_item_height: 2.875rem;--_ui5-v2-4-0_day_picker_empty_height: 3rem;--_ui5-v2-4-0_day_picker_item_justify_content: space-between;--_ui5-v2-4-0_dp_two_calendar_item_now_text_padding_top: .375rem;--_ui5-v2-4-0_daypicker_item_now_selected_two_calendar_focus_special_day_top: 2rem;--_ui5-v2-4-0_daypicker_item_now_selected_two_calendar_focus_special_day_right: 1.4375rem;--_ui5-v2-4-0_dp_two_calendar_item_primary_text_height: 1.8125rem;--_ui5-v2-4-0_dp_two_calendar_item_secondary_text_height: 1rem;--_ui5-v2-4-0_dp_two_calendar_item_text_padding_top: .4375rem;--_ui5-v2-4-0_daypicker_item_now_selected_two_calendar_focus_secondary_text_padding_block: 0 .5rem;--_ui5-v2-4-0-calendar-legend-item-root-focus-offset: -.125rem;--_ui5-v2-4-0-calendar-legend-item-box-margin: .25rem;--_ui5-v2-4-0-calendar-legend-item-box-inner-margin: .5rem;--_ui5-v2-4-0_color-palette-swatch-container-padding: .3125rem .6875rem;--_ui5-v2-4-0_datetime_picker_width: 40.0625rem;--_ui5-v2-4-0_datetime_picker_height: 25rem;--_ui5-v2-4-0_datetime_timeview_width: 17rem;--_ui5-v2-4-0_datetime_timeview_phonemode_width: 19.5rem;--_ui5-v2-4-0_datetime_timeview_padding: 1rem;--_ui5-v2-4-0_datetime_timeview_phonemode_clocks_width: 24.5rem;--_ui5-v2-4-0_datetime_dateview_phonemode_margin_bottom: 0;--_ui5-v2-4-0_dialog_content_min_height: 2.75rem;--_ui5-v2-4-0_dialog_footer_height: 2.75rem;--_ui5-v2-4-0_input_inner_padding: 0 .625rem;--_ui5-v2-4-0_input_inner_padding_with_icon: 0 .25rem 0 .625rem;--_ui5-v2-4-0_input_inner_space_to_tokenizer: .125rem;--_ui5-v2-4-0_input_inner_space_to_n_more_text: .1875rem;--_ui5-v2-4-0_list_no_data_height: 3rem;--_ui5-v2-4-0_list_item_cb_margin_right: 0;--_ui5-v2-4-0_list_item_title_size: var(--sapFontLargeSize);--_ui5-v2-4-0_list_no_data_font_size: var(--sapFontLargeSize);--_ui5-v2-4-0_list_item_img_size: 3rem;--_ui5-v2-4-0_list_item_img_top_margin: .5rem;--_ui5-v2-4-0_list_item_img_bottom_margin: .5rem;--_ui5-v2-4-0_list_item_img_hn_margin: .75rem;--_ui5-v2-4-0_list_item_dropdown_base_height: 2.5rem;--_ui5-v2-4-0_list_item_base_height: var(--sapElement_LineHeight);--_ui5-v2-4-0_list_item_base_padding: 0 1rem;--_ui5-v2-4-0_list_item_icon_size: 1.125rem;--_ui5-v2-4-0_list_item_icon_padding-inline-end: .5rem;--_ui5-v2-4-0_list_item_selection_btn_margin_top: calc(-1 * var(--_ui5-v2-4-0_checkbox_wrapper_padding));--_ui5-v2-4-0_list_item_content_vertical_offset: calc((var(--_ui5-v2-4-0_list_item_base_height) - var(--_ui5-v2-4-0_list_item_title_size)) / 2);--_ui5-v2-4-0_group_header_list_item_height: 2.75rem;--_ui5-v2-4-0_list_busy_row_height: 3rem;--_ui5-v2-4-0_month_picker_item_height: 3rem;--_ui5-v2-4-0_list_buttons_left_space: .125rem;--_ui5-v2-4-0_form_item_min_height: 2.813rem;--_ui5-v2-4-0_form_item_padding: .65rem;--_ui5-v2-4-0-form-group-heading-height: 2.75rem;--_ui5-v2-4-0_popup_default_header_height: 2.75rem;--_ui5-v2-4-0_year_picker_item_height: 3rem;--_ui5-v2-4-0_tokenizer_padding: .25rem;--_ui5-v2-4-0_token_height: 1.625rem;--_ui5-v2-4-0_token_icon_size: .75rem;--_ui5-v2-4-0_token_icon_padding: .25rem .5rem;--_ui5-v2-4-0_token_wrapper_right_padding: .3125rem;--_ui5-v2-4-0_token_wrapper_left_padding: 0;--_ui5-v2-4-0_tl_bubble_padding: 1rem;--_ui5-v2-4-0_tl_indicator_before_bottom: -1.625rem;--_ui5-v2-4-0_tl_padding: 1rem 1rem 1rem .5rem;--_ui5-v2-4-0_tl_li_margin_bottom: 1.625rem;--_ui5-v2-4-0_switch_focus_width_size_horizon_exp: calc(100% + 4px) ;--_ui5-v2-4-0_switch_focus_height_size_horizon_exp: calc(100% + 4px) ;--_ui5-v2-4-0_tc_item_text: 3rem;--_ui5-v2-4-0_tc_item_height: 4.75rem;--_ui5-v2-4-0_tc_item_text_only_height: 2.75rem;--_ui5-v2-4-0_tc_item_text_only_with_additional_text_height: 3.75rem;--_ui5-v2-4-0_tc_item_text_line_height: 1.325rem;--_ui5-v2-4-0_tc_item_icon_circle_size: 2.75rem;--_ui5-v2-4-0_tc_item_icon_size: 1.25rem;--_ui5-v2-4-0_tc_item_add_text_margin_top: .375rem;--_ui5-v2-4-0_textarea_margin: .25rem 0;--_ui5-v2-4-0_radio_button_height: 2.75rem;--_ui5-v2-4-0_radio_button_label_side_padding: .875rem;--_ui5-v2-4-0_radio_button_inner_size: 2.75rem;--_ui5-v2-4-0_radio_button_svg_size: 1.375rem;--_ui5-v2-4-0-responsive_popover_header_height: 2.75rem;--ui5-v2-4-0_side_navigation_item_height: 2.75rem;--_ui5-v2-4-0-tree-indent-step: 1.5rem;--_ui5-v2-4-0-tree-toggle-box-width: 2.75rem;--_ui5-v2-4-0-tree-toggle-box-height: 2.25rem;--_ui5-v2-4-0-tree-toggle-icon-size: 1.0625rem;--_ui5-v2-4-0_timeline_tli_indicator_before_bottom: -1.5rem;--_ui5-v2-4-0_timeline_tli_indicator_before_right: -1.625rem;--_ui5-v2-4-0_timeline_tli_indicator_before_without_icon_bottom: -1.875rem;--_ui5-v2-4-0_timeline_tli_indicator_before_without_icon_right: -1.9375rem;--_ui5-v2-4-0_timeline_tli_indicator_after_top: calc(-100% - 1rem) ;--_ui5-v2-4-0_timeline_tli_indicator_after_height: calc(100% + 1rem) ;--_ui5-v2-4-0_timeline_tli_indicator_before_height: 100%;--_ui5-v2-4-0_timeline_tli_horizontal_indicator_after_width: calc(100% + .25rem) ;--_ui5-v2-4-0_timeline_tli_horizontal_indicator_after_left: 1.9375rem;--_ui5-v2-4-0_timeline_tli_horizontal_without_icon_indicator_before_width: calc(100% + .5rem) ;--_ui5-v2-4-0_timeline_tli_horizontal_indicator_before_width: calc(100% + .5rem) ;--_ui5-v2-4-0_timeline_tli_icon_horizontal_indicator_after_width: calc(100% + .25rem) ;--_ui5-v2-4-0_timeline_tli_without_icon_horizontal_indicator_before_width: calc(100% + .375rem) ;--_ui5-v2-4-0_timeline_tli_horizontal_indicator_short_after_width: 100%;--_ui5-v2-4-0_timeline_tli_last_child_vertical_indicator_before_height: calc(100% - 1.5rem) ;--_ui5-v2-4-0-toolbar-separator-height: 2rem;--_ui5-v2-4-0-toolbar-height: 2.75rem;--_ui5-v2-4-0_toolbar_overflow_padding: .25rem .5rem;--_ui5-v2-4-0_table_cell_padding: .25rem .5rem;--_ui5-v2-4-0_dynamic_page_title_actions_separator_height: var(--_ui5-v2-4-0-toolbar-separator-height);--_ui5-v2-4-0_split_button_middle_separator_top: .625rem;--_ui5-v2-4-0_split_button_middle_separator_height: 1rem;--_ui5-v2-4-0-calendar-legend-item-root-focus-border-radius: .25rem;--_ui5-v2-4-0_color-palette-item-height: 1.75rem;--_ui5-v2-4-0_color-palette-item-hover-height: 2.25rem;--_ui5-v2-4-0_color-palette-item-margin: calc(((var(--_ui5-v2-4-0_color-palette-item-hover-height) - var(--_ui5-v2-4-0_color-palette-item-height)) / 2) + .0625rem);--_ui5-v2-4-0_color-palette-row-width: 12rem;--_ui5-v2-4-0_textarea_padding_top: .5rem;--_ui5-v2-4-0_textarea_padding_bottom: .4375rem;--_ui5-v2-4-0_dp_two_calendar_item_secondary_text_padding_block: 0 .5rem;--_ui5-v2-4-0_dp_two_calendar_item_secondary_text_padding: 0 .5rem;--_ui5-v2-4-0_daypicker_two_calendar_item_selected_focus_margin_bottom: 0;--_ui5-v2-4-0_daypicker_two_calendar_item_selected_focus_padding_right: .5rem}[dir=rtl]{--_ui5-v2-4-0_table_shadow_border_left: inset calc(-1 * var(--sapContent_FocusWidth)) 0 var(--sapContent_FocusColor);--_ui5-v2-4-0_table_shadow_border_right: inset var(--sapContent_FocusWidth) 0 var(--sapContent_FocusColor);--_ui5-v2-4-0_icon_transform_scale: scale(-1, 1);--_ui5-v2-4-0_panel_toggle_btn_rotation: var(--_ui5-v2-4-0_rotation_minus_90deg);--_ui5-v2-4-0_li_notification_group_toggle_btn_rotation: var(--_ui5-v2-4-0_rotation_minus_90deg);--_ui5-v2-4-0_timeline_scroll_container_offset: -.5rem;--_ui5-v2-4-0_popover_upward_arrow_margin: .1875rem .125rem 0 0;--_ui5-v2-4-0_popover_right_arrow_margin: .1875rem .25rem 0 0;--_ui5-v2-4-0_popover_downward_arrow_margin: -.4375rem .125rem 0 0;--_ui5-v2-4-0_popover_left_arrow_margin: .1875rem -.375rem 0 0;--_ui5-v2-4-0_dialog_resize_cursor:sw-resize;--_ui5-v2-4-0_menu_submenu_margin_offset: 0 -.25rem;--_ui5-v2-4-0_menu_submenu_placement_type_left_margin_offset: 0 .25rem;--_ui5-v2-4-0-menu_item_icon_float: left;--_ui5-v2-4-0-shellbar-notification-btn-count-offset: auto;--_ui5-v2-4-0_segmented_btn_item_border_left: .0625rem;--_ui5-v2-4-0_segmented_btn_item_border_right: .0625rem;--_ui5-v2-4-0_progress_indicator_bar_border_radius: .5rem;--_ui5-v2-4-0_progress_indicator_remaining_bar_border_radius: .25rem}[data-ui5-compact-size],.ui5-content-density-compact,.sapUiSizeCompact{--_ui5-v2-4-0_input_min_width: 2rem;--_ui5-v2-4-0_input_icon_width: 2rem;--_ui5-v2-4-0_input_information_icon_padding: .3125rem .5rem .1875rem .5rem;--_ui5-v2-4-0_input_information_focused_icon_padding: .3125rem .5rem .25rem .5rem;--_ui5-v2-4-0_input_error_warning_icon_padding: .3125rem .5rem .1875rem .5rem;--_ui5-v2-4-0_input_error_warning_focused_icon_padding: .3125rem .5rem .25rem .5rem;--_ui5-v2-4-0_input_custom_icon_padding: .3125rem .5rem .25rem .5rem;--_ui5-v2-4-0_input_error_warning_custom_icon_padding: .3125rem .5rem .1875rem .5rem;--_ui5-v2-4-0_input_error_warning_custom_focused_icon_padding: .3125rem .5rem .25rem .5rem;--_ui5-v2-4-0_input_information_custom_icon_padding: .3125rem .5rem .1875rem .5rem;--_ui5-v2-4-0_input_information_custom_focused_icon_padding: .3125rem .5rem .25rem .5rem;--_ui5-v2-4-0_input_icon_padding: .3125rem .5rem .25rem .5rem;--_ui5-v2-4-0_panel_header_button_wrapper_padding: .1875rem .25rem;--_ui5-v2-4-0_rating_indicator_item_height: 1em;--_ui5-v2-4-0_rating_indicator_item_width: 1em;--_ui5-v2-4-0_rating_indicator_readonly_item_height: .75em;--_ui5-v2-4-0_rating_indicator_readonly_item_width: .75em;--_ui5-v2-4-0_rating_indicator_component_spacing: .5rem 0px;--_ui5-v2-4-0_radio_button_min_width: 2rem;--_ui5-v2-4-0_radio_button_outer_ring_padding_with_label: 0 .5rem;--_ui5-v2-4-0_radio_button_outer_ring_padding: 0 .5rem;--_ui5-v2-4-0_radio_button_focus_dist: .1875rem;--_ui5-v2-4-0_switch_height: 2rem;--_ui5-v2-4-0_switch_width: 3rem;--_ui5-v2-4-0_switch_min_width: none;--_ui5-v2-4-0_switch_with_label_width: 3.75rem;--_ui5-v2-4-0_switch_root_outline_top: .25rem;--_ui5-v2-4-0_switch_root_outline_bottom: .25rem;--_ui5-v2-4-0_switch_transform: translateX(100%) translateX(-1.375rem);--_ui5-v2-4-0_switch_transform_with_label: translateX(100%) translateX(-1.875rem);--_ui5-v2-4-0_switch_rtl_transform: translateX(1.375rem) translateX(-100%);--_ui5-v2-4-0_switch_rtl_transform_with_label: translateX(1.875rem) translateX(-100%);--_ui5-v2-4-0_switch_track_width: 2rem;--_ui5-v2-4-0_switch_track_height: 1.25rem;--_ui5-v2-4-0_switch_track_with_label_width: 2.75rem;--_ui5-v2-4-0_switch_track_with_label_height: 1.25rem;--_ui5-v2-4-0_switch_handle_width: 1.25rem;--_ui5-v2-4-0_switch_handle_height: 1rem;--_ui5-v2-4-0_switch_handle_with_label_width: 1.75rem;--_ui5-v2-4-0_switch_handle_with_label_height: 1rem;--_ui5-v2-4-0_switch_text_font_size: var(--sapFontSize);--_ui5-v2-4-0_switch_text_width: 1rem;--_ui5-v2-4-0_switch_text_active_left: .1875rem;--_ui5-v2-4-0_textarea_padding_right_and_left_readonly: .4375rem;--_ui5-v2-4-0_textarea_padding_top_readonly: .125rem;--_ui5-v2-4-0_textarea_exceeded_text_height: .375rem;--_ui5-v2-4-0_textarea_min_height: 1.625rem;--_ui5-v2-4-0_textarea_padding_bottom_readonly: .0625rem;--_ui5-v2-4-0_textarea_padding_top_error_warning: .1875rem;--_ui5-v2-4-0_textarea_padding_bottom_error_warning: .125rem;--_ui5-v2-4-0_textarea_padding_top_information: .1875rem;--_ui5-v2-4-0_textarea_padding_bottom_information: .125rem;--_ui5-v2-4-0_textarea_padding_right_and_left: .5rem;--_ui5-v2-4-0_textarea_padding_right_and_left_error_warning: .5rem;--_ui5-v2-4-0_textarea_padding_right_and_left_information: .5rem;--_ui5-v2-4-0_token_selected_focused_offset_bottom: -.25rem;--_ui5-v2-4-0_tokenizer-popover_offset: .1875rem;--_ui5-v2-4-0_slider_handle_icon_size: .875rem;--_ui5-v2-4-0_slider_padding: 1rem 1.0625rem;--_ui5-v2-4-0_range_slider_progress_focus_width: calc(100% + var(--_ui5-v2-4-0_slider_handle_width) + 10px);--_ui5-v2-4-0_range_slider_progress_focus_height: calc(var(--_ui5-v2-4-0_slider_handle_height) + 10px);--_ui5-v2-4-0_range_slider_progress_focus_top: -.8125rem;--_ui5-v2-4-0_slider_tooltip_bottom: 1.75rem;--_ui5-v2-4-0_slider_handle_focused_tooltip_distance: calc(var(--_ui5-v2-4-0_slider_tooltip_bottom) - var(--_ui5-v2-4-0_slider_handle_focus_width));--_ui5-v2-4-0_range_slider_progress_focus_left: calc(-1 * (var(--_ui5-v2-4-0_slider_handle_width) / 2) - 5px);--_ui5-v2-4-0_bar_base_height: 2.5rem;--_ui5-v2-4-0_bar_subheader_height: 2.25rem;--_ui5-v2-4-0_button_base_height: var(--sapElement_Compact_Height);--_ui5-v2-4-0_button_base_padding: .4375rem;--_ui5-v2-4-0_button_base_min_width: 2rem;--_ui5-v2-4-0_button_icon_font_size: 1rem;--_ui5-v2-4-0_calendar_height: 18rem;--_ui5-v2-4-0_calendar_width: 17.75rem;--_ui5-v2-4-0_calendar_left_right_padding: .25rem;--_ui5-v2-4-0_calendar_top_bottom_padding: .5rem;--_ui5-v2-4-0_calendar_header_height: 2rem;--_ui5-v2-4-0_calendar_header_arrow_button_width: 2rem;--_ui5-v2-4-0_calendar_header_padding: 0;--_ui5-v2-4-0-calendar-legend-root-padding: .5rem;--_ui5-v2-4-0-calendar-legend-root-width: 16.75rem;--_ui5-v2-4-0-calendar-legend-item-root-focus-margin: -.125rem;--_ui5-v2-4-0_checkbox_root_side_padding: var(--_ui5-v2-4-0_checkbox_wrapped_focus_padding);--_ui5-v2-4-0_checkbox_width_height: var(--_ui5-v2-4-0_checkbox_compact_width_height);--_ui5-v2-4-0_checkbox_wrapper_padding: var(--_ui5-v2-4-0_checkbox_compact_wrapper_padding);--_ui5-v2-4-0_checkbox_inner_width_height: var(--_ui5-v2-4-0_checkbox_compact_inner_size);--_ui5-v2-4-0_checkbox_icon_size: .75rem;--_ui5-v2-4-0_checkbox_partially_icon_size: .5rem;--_ui5-v2-4-0_custom_list_item_rb_min_width: 2rem;--_ui5-v2-4-0_daypicker_weeknumbers_container_padding_top: 2rem;--_ui5-v2-4-0_day_picker_item_width: 2rem;--_ui5-v2-4-0_day_picker_item_height: 2rem;--_ui5-v2-4-0_day_picker_empty_height: 2.125rem;--_ui5-v2-4-0_day_picker_item_justify_content: flex-end;--_ui5-v2-4-0_dp_two_calendar_item_now_text_padding_top: .5rem;--_ui5-v2-4-0_dp_two_calendar_item_primary_text_height: 1rem;--_ui5-v2-4-0_dp_two_calendar_item_secondary_text_height: .75rem;--_ui5-v2-4-0_dp_two_calendar_item_text_padding_top: .5rem;--_ui5-v2-4-0_daypicker_special_day_top: 1.625rem;--_ui5-v2-4-0_daypicker_twocalendar_item_special_day_top: 1.25rem;--_ui5-v2-4-0_daypicker_twocalendar_item_special_day_right: 1.25rem;--_ui5-v2-4-0_daypicker_two_calendar_item_margin_bottom: 0;--_ui5-v2-4-0_daypicker_item_now_selected_two_calendar_focus_special_day_top: 1.125rem;--_ui5-v2-4-0_daypicker_item_now_selected_two_calendar_focus_special_day_right: 1.125rem;--_ui5-v2-4-0_daypicker_item_now_selected_two_calendar_focus_secondary_text_padding_block: 0 1rem;--_ui5-v2-4-0_datetime_picker_height: 20.5rem;--_ui5-v2-4-0_datetime_picker_width: 35.5rem;--_ui5-v2-4-0_datetime_timeview_width: 17rem;--_ui5-v2-4-0_datetime_timeview_phonemode_width: 18.5rem;--_ui5-v2-4-0_datetime_timeview_padding: .5rem;--_ui5-v2-4-0_datetime_timeview_phonemode_clocks_width: 21.125rem;--_ui5-v2-4-0_datetime_dateview_phonemode_margin_bottom: 3.125rem;--_ui5-v2-4-0_dialog_content_min_height: 2.5rem;--_ui5-v2-4-0_dialog_footer_height: 2.5rem;--_ui5-v2-4-0_form_item_min_height: 2rem;--_ui5-v2-4-0_form_item_padding: .25rem;--_ui5-v2-4-0-form-group-heading-height: 2rem;--_ui5-v2-4-0_input_height: var(--sapElement_Compact_Height);--_ui5-v2-4-0_input_inner_padding: 0 .5rem;--_ui5-v2-4-0_input_inner_padding_with_icon: 0 .2rem 0 .5rem;--_ui5-v2-4-0_input_inner_space_to_tokenizer: .125rem;--_ui5-v2-4-0_input_inner_space_to_n_more_text: .125rem;--_ui5-v2-4-0_input_icon_min_width: var(--_ui5-v2-4-0_input_compact_min_width);--_ui5-v2-4-0_menu_item_padding: 0 .75rem 0 .5rem;--_ui5-v2-4-0_menu_item_submenu_icon_right: .75rem;--_ui5-v2-4-0_popup_default_header_height: 2.5rem;--_ui5-v2-4-0_textarea_margin: .1875rem 0;--_ui5-v2-4-0_list_no_data_height: 2rem;--_ui5-v2-4-0_list_item_cb_margin_right: .5rem;--_ui5-v2-4-0_list_item_title_size: var(--sapFontSize);--_ui5-v2-4-0_list_item_img_top_margin: .55rem;--_ui5-v2-4-0_list_no_data_font_size: var(--sapFontSize);--_ui5-v2-4-0_list_item_dropdown_base_height: 2rem;--_ui5-v2-4-0_list_item_base_height: 2rem;--_ui5-v2-4-0_list_item_base_padding: 0 1rem;--_ui5-v2-4-0_list_item_icon_size: 1rem;--_ui5-v2-4-0_list_item_selection_btn_margin_top: calc(-1 * var(--_ui5-v2-4-0_checkbox_wrapper_padding));--_ui5-v2-4-0_list_item_content_vertical_offset: calc((var(--_ui5-v2-4-0_list_item_base_height) - var(--_ui5-v2-4-0_list_item_title_size)) / 2);--_ui5-v2-4-0_list_busy_row_height: 2rem;--_ui5-v2-4-0_list_buttons_left_space: .125rem;--_ui5-v2-4-0_month_picker_item_height: 2rem;--_ui5-v2-4-0_year_picker_item_height: 2rem;--_ui5-v2-4-0_panel_header_height: 2rem;--_ui5-v2-4-0_panel_button_root_height: 2rem;--_ui5-v2-4-0_panel_button_root_width: 2.5rem;--_ui5-v2-4-0_token_height: 1.25rem;--_ui5-v2-4-0_token_right_margin: .25rem;--_ui5-v2-4-0_token_left_padding: .25rem;--_ui5-v2-4-0_token_readonly_padding: .125rem .25rem;--_ui5-v2-4-0_token_focus_offset: -.125rem;--_ui5-v2-4-0_token_icon_size: .75rem;--_ui5-v2-4-0_token_icon_padding: .375rem .375rem;--_ui5-v2-4-0_token_wrapper_right_padding: .25rem;--_ui5-v2-4-0_token_wrapper_left_padding: 0;--_ui5-v2-4-0_token_outline_offset: -.125rem;--_ui5-v2-4-0_tl_bubble_padding: .5rem;--_ui5-v2-4-0_tl_indicator_before_bottom: -.5rem;--_ui5-v2-4-0_tl_padding: .5rem;--_ui5-v2-4-0_tl_li_margin_bottom: .5rem;--_ui5-v2-4-0_tc_item_text: 2rem;--_ui5-v2-4-0_tc_item_text_line_height: 1.325rem;--_ui5-v2-4-0_tc_item_add_text_margin_top: .3125rem;--_ui5-v2-4-0_tc_item_height: 4rem;--_ui5-v2-4-0_tc_header_height: var(--_ui5-v2-4-0_tc_item_height);--_ui5-v2-4-0_tc_item_icon_circle_size: 2rem;--_ui5-v2-4-0_tc_item_icon_size: 1rem;--_ui5-v2-4-0_radio_button_height: 2rem;--_ui5-v2-4-0_radio_button_label_side_padding: .5rem;--_ui5-v2-4-0_radio_button_inner_size: 2rem;--_ui5-v2-4-0_radio_button_svg_size: 1rem;--_ui5-v2-4-0-responsive_popover_header_height: 2.5rem;--ui5-v2-4-0_side_navigation_item_height: 2rem;--_ui5-v2-4-0_slider_handle_height: 1.25rem;--_ui5-v2-4-0_slider_handle_width: 1.5rem;--_ui5-v2-4-0_slider_tooltip_padding: .25rem;--_ui5-v2-4-0_slider_progress_outline_offset: -.625rem;--_ui5-v2-4-0_slider_outer_height: 1.3125rem;--_ui5-v2-4-0_step_input_min_width: 6rem;--_ui5-v2-4-0_step_input_padding: 2rem;--_ui5-v2-4-0-tree-indent-step: .5rem;--_ui5-v2-4-0-tree-toggle-box-width: 2rem;--_ui5-v2-4-0-tree-toggle-box-height: 1.5rem;--_ui5-v2-4-0-tree-toggle-icon-size: .8125rem;--_ui5-v2-4-0_timeline_tli_indicator_before_bottom: -.75rem;--_ui5-v2-4-0_timeline_tli_indicator_before_right: -.5rem;--_ui5-v2-4-0_timeline_tli_indicator_before_without_icon_bottom: -1rem;--_ui5-v2-4-0_timeline_tli_indicator_before_without_icon_right: -.8125rem;--_ui5-v2-4-0_timeline_tli_indicator_before_height: calc(100% - 1.25rem) ;--_ui5-v2-4-0_timeline_tli_horizontal_without_icon_indicator_before_width: var(--_ui5-v2-4-0_timeline_tli_indicator_after_height);--_ui5-v2-4-0_timeline_tli_horizontal_indicator_after_width: var(--_ui5-v2-4-0_timeline_tli_indicator_after_height);--_ui5-v2-4-0_timeline_tli_horizontal_indicator_before_width: var(--_ui5-v2-4-0_timeline_tli_indicator_after_height);--_ui5-v2-4-0_timeline_tli_icon_horizontal_indicator_after_width: var(--_ui5-v2-4-0_timeline_tli_indicator_after_height);--_ui5-v2-4-0_timeline_tli_indicator_after_top: calc(-100% + .9375rem) ;--_ui5-v2-4-0_timeline_tli_indicator_after_height: calc(100% - .75rem) ;--_ui5-v2-4-0_timeline_tli_horizontal_indicator_after_left: 1.8625rem;--_ui5-v2-4-0_timeline_tli_horizontal_indicator_short_after_width: calc(100% - 1rem) ;--_ui5-v2-4-0_timeline_tli_without_icon_horizontal_indicator_before_width: calc(100% - .625rem) ;--_ui5-v2-4-0_timeline_tli_last_child_vertical_indicator_before_height: calc(100% - 2.5rem) ;--_ui5-v2-4-0_timeline_tlgi_compact_icon_before_height: calc(100% + 1.5rem) ;--_ui5-v2-4-0_timeline_tlgi_horizontal_line_placeholder_before_width: var(--_ui5-v2-4-0_timeline_tlgi_compact_icon_before_height);--_ui5-v2-4-0_timeline_tlgi_horizontal_compact_root_margin_left: .5rem;--_ui5-v2-4-0_timeline_tlgi_compact_root_gap: .5rem;--_ui5-v2-4-0_timeline_tlgi_root_horizontal_height: 19.375rem;--_ui5-v2-4-0_vsd_header_container: 2.5rem;--_ui5-v2-4-0_vsd_sub_header_container_height: 2rem;--_ui5-v2-4-0_vsd_header_height: 4rem;--_ui5-v2-4-0_vsd_expand_content_height: 25.4375rem;--_ui5-v2-4-0-toolbar-separator-height: 1.5rem;--_ui5-v2-4-0-toolbar-height: 2rem;--_ui5-v2-4-0_toolbar_overflow_padding: .1875rem .375rem;--_ui5-v2-4-0_dynamic_page_title_actions_separator_height: var(--_ui5-v2-4-0-toolbar-separator-height);--_ui5-v2-4-0_textarea_padding_top: .1875rem;--_ui5-v2-4-0_textarea_padding_bottom: .125rem;--_ui5-v2-4-0_checkbox_focus_position: .25rem;--_ui5-v2-4-0_split_button_middle_separator_top: .3125rem;--_ui5-v2-4-0_split_button_middle_separator_height: 1rem;--_ui5-v2-4-0_slider_handle_top: -.5rem;--_ui5-v2-4-0_slider_tooltip_height: 1.375rem;--_ui5-v2-4-0_checkbox_wrapped_focus_inset_block: .125rem;--_ui5-v2-4-0_color-palette-item-height: 1.25rem;--_ui5-v2-4-0_color-palette-item-focus-height: 1rem;--_ui5-v2-4-0_color-palette-item-container-sides-padding: .1875rem;--_ui5-v2-4-0_color-palette-item-container-rows-padding: .8125rem;--_ui5-v2-4-0_color-palette-item-hover-height: 1.625rem;--_ui5-v2-4-0_color-palette-item-margin: calc(((var(--_ui5-v2-4-0_color-palette-item-hover-height) - var(--_ui5-v2-4-0_color-palette-item-height)) / 2) + .0625rem);--_ui5-v2-4-0_color-palette-row-width: 8.75rem;--_ui5-v2-4-0_color-palette-swatch-container-padding: .1875rem .5rem;--_ui5-v2-4-0_color-palette-item-hover-margin: .0625rem;--_ui5-v2-4-0_color-palette-row-height: 7.5rem;--_ui5-v2-4-0_color-palette-button-height: 2rem;--_ui5-v2-4-0_color-palette-item-before-focus-inset: -.25rem;--_ui5-v2-4-0_color_picker_slider_container_margin_top: -9px;--_ui5-v2-4-0_daypicker_selected_item_now_special_day_top: 1.5625rem;--_ui5-v2-4-0_daypicker_specialday_focused_top: 1.3125rem;--_ui5-v2-4-0_daypicker_selected_item_now_special_day_border_bottom_radius_alternate: .5rem;--_ui5-v2-4-0_daypicker_specialday_focused_border_bottom: .25rem;--_ui5-v2-4-0_daypicker_item_now_specialday_top: 1.4375rem;--_ui5-v2-4-0_dp_two_calendar_item_secondary_text_padding_block: 0 .375rem;--_ui5-v2-4-0_dp_two_calendar_item_secondary_text_padding: 0 .375rem;--_ui5-v2-4-0_daypicker_two_calendar_item_selected_focus_margin_bottom: -.25rem;--_ui5-v2-4-0_daypicker_two_calendar_item_selected_focus_padding_right: .4375rem}:root,[dir=ltr]{--_ui5-v2-4-0_rotation_90deg: rotate(90deg);--_ui5-v2-4-0_rotation_minus_90deg: rotate(-90deg);--_ui5-v2-4-0_icon_transform_scale: none;--_ui5-v2-4-0_panel_toggle_btn_rotation: var(--_ui5-v2-4-0_rotation_90deg);--_ui5-v2-4-0_li_notification_group_toggle_btn_rotation: var(--_ui5-v2-4-0_rotation_90deg);--_ui5-v2-4-0_timeline_scroll_container_offset: .5rem;--_ui5-v2-4-0_popover_upward_arrow_margin: .1875rem 0 0 .1875rem;--_ui5-v2-4-0_popover_right_arrow_margin: .1875rem 0 0 -.375rem;--_ui5-v2-4-0_popover_downward_arrow_margin: -.375rem 0 0 .125rem;--_ui5-v2-4-0_popover_left_arrow_margin: .125rem 0 0 .25rem;--_ui5-v2-4-0_dialog_resize_cursor: se-resize;--_ui5-v2-4-0_progress_indicator_bar_border_radius: .5rem 0 0 .5rem;--_ui5-v2-4-0_progress_indicator_remaining_bar_border_radius: 0 .5rem .5rem 0;--_ui5-v2-4-0_menu_submenu_margin_offset: -.25rem 0;--_ui5-v2-4-0_menu_submenu_placement_type_left_margin_offset: .25rem 0;--_ui5-v2-4-0-menu_item_icon_float: right;--_ui5-v2-4-0-shellbar-notification-btn-count-offset: -.125rem}\n'
				}
			},
			4281: (e, t, r) => {
				"use strict";
				var o;
				r.d(t, {
						A: () => i
					}),
					function(e) {
						e.Image = "Image", e.Decorative = "Decorative", e.Interactive = "Interactive"
					}(o || (o = {}));
				const i = o
			},
			6639: (e, t, r) => {
				"use strict";
				r.d(t, {
					F: () => n,
					Y: () => a
				});
				var o = r(1081);
				const i = e => "string" == typeof e || "number" == typeof e ? (0, o.Qq)(e) : e,
					a = (e, {
						children: t,
						...r
					}, a) => "function" == typeof e ? e({
						...r,
						key: a
					}, t) : (0, o.h)(e, {
						...r,
						key: a
					}, i(t)),
					n = (e, {
						children: t,
						...r
					}, a) => "function" == typeof e ? e({
						...r,
						key: a
					}, t) : (0, o.h)(e, {
						...r,
						key: a
					}, t.map(i))
			},
			1081: (e, t, r) => {
				"use strict";
				r.d(t, {
					Qq: () => g,
					h: () => b,
					yA: () => y
				});
				var o = {},
					i = [],
					a = e => e,
					n = i.map,
					_ = Array.isArray,
					s = "undefined" != typeof requestAnimationFrame ? requestAnimationFrame : setTimeout,
					c = e => {
						var t = "";
						if ("string" == typeof e) return e;
						if (_(e))
							for (var r, o = 0; o < e.length; o++)(r = c(e[o])) && (t += (t && " ") + r);
						else
							for (var o in e) e[o] && (t += (t && " ") + o);
						return t
					},
					l = (e, t) => {
						for (var r in {
								...e,
								...t
							})
							if ("function" == typeof(_(e[r]) ? e[r][0] : e[r])) t[r] = e[r];
							else if (e[r] !== t[r]) return !0
					},
					u = e => null == e ? e : e.key,
					d = (e, t, r, o, i, a) => {
						if ("style" === t)
							for (var n in {
									...r,
									...o
								}) r = null == o || null == o[n] ? "" : o[n], "-" === n[0] ? e[t].setProperty(n, r) : e[t][n] = r;
						else "o" === t[0] && "n" === t[1] ? ((e.events || (e.events = {}))[t = t.slice(2)] = o) ? r || e.addEventListener(t, i) : e.removeEventListener(t, i) : !a && "list" !== t && "form" !== t && t in e ? e[t] = null == o ? "" : o : null == o || !1 === o ? e.removeAttribute(t) : e.setAttribute(t, o)
					},
					p = (e, t, r) => {
						var o = e.props,
							i = 3 === e.type ? document.createTextNode(e.tag) : (r = r || "svg" === e.tag) ? document.createElementNS("http://www.w3.org/2000/svg", e.tag, o.is && o) : document.createElement(e.tag, o.is && o);
						for (var a in o) d(i, a, null, o[a], t, r);
						for (var n = 0; n < e.children.length; n++) i.appendChild(p(e.children[n] = v(e.children[n]), t, r));
						return e.node = i
					},
					h = (e, t, r, o, i, a) => {
						if (r === o);
						else if (null != r && 3 === r.type && 3 === o.type) r.tag !== o.tag && (t.nodeValue = o.tag);
						else if (null == r || r.tag !== o.tag) t = e.insertBefore(p(o = v(o), i, a), t), null != r && e.removeChild(r.node);
						else {
							var n, _, s, c, l = r.props,
								f = o.props,
								m = r.children,
								g = o.children,
								b = 0,
								y = 0,
								C = m.length - 1,
								w = g.length - 1;
							for (var x in a = a || "svg" === o.tag, {
									...l,
									...f
								})("value" === x || "selected" === x || "checked" === x ? t[x] : l[x]) !== f[x] && d(t, x, l[x], f[x], i, a);
							for (; y <= w && b <= C && null != (s = u(m[b])) && s === u(g[y]);) h(t, m[b].node, m[b], g[y] = v(g[y++], m[b++]), i, a);
							for (; y <= w && b <= C && null != (s = u(m[C])) && s === u(g[w]);) h(t, m[C].node, m[C], g[w] = v(g[w--], m[C--]), i, a);
							if (b > C)
								for (; y <= w;) t.insertBefore(p(g[y] = v(g[y++]), i, a), (_ = m[b]) && _.node);
							else if (y > w)
								for (; b <= C;) t.removeChild(m[b++].node);
							else {
								var k = {},
									S = {};
								for (x = b; x <= C; x++) null != (s = m[x].key) && (k[s] = m[x]);
								for (; y <= w;) s = u(_ = m[b]), c = u(g[y] = v(g[y], _)), S[s] || null != c && c === u(m[b + 1]) ? (null == s && t.removeChild(_.node), b++) : null == c || 1 === r.type ? (null == s && (h(t, _ && _.node, _, g[y], i, a), y++), b++) : (s === c ? (h(t, _.node, _, g[y], i, a), S[c] = !0, b++) : null != (n = k[c]) ? (h(t, t.insertBefore(n.node, _ && _.node), n, g[y], i, a), S[c] = !0) : h(t, _ && _.node, null, g[y], i, a), y++);
								for (; b <= C;) null == u(_ = m[b++]) && t.removeChild(_.node);
								for (var x in k) null == S[x] && t.removeChild(k[x].node)
							}
						}
						return o.node = t
					},
					v = (e, t) => !0 !== e && !1 !== e && e ? "function" == typeof e.tag ? ((!t || null == t.memo || ((e, t) => {
						for (var r in e)
							if (e[r] !== t[r]) return !0;
						for (var r in t)
							if (e[r] !== t[r]) return !0
					})(t.memo, e.memo)) && ((t = e.tag(e.memo)).memo = e.memo), t) : e : g(""),
					f = e => 3 === e.nodeType ? g(e.nodeValue, e) : m(e.nodeName.toLowerCase(), o, n.call(e.childNodes, f), 1, e),
					m = (e, {
						key: t,
						...r
					}, o, i, a) => ({
						tag: e,
						props: r,
						key: t,
						children: o,
						type: i,
						node: a
					}),
					g = (e, t) => m(e, o, i, 3, t),
					b = (e, {
						class: t,
						...r
					}, a = i) => m(e, {
						...r,
						...t ? {
							class: c(t)
						} : o
					}, _(a) ? a : [a]),
					y = ({
						node: e,
						view: t,
						subscriptions: r,
						dispatch: n = a,
						init: c = o
					}) => {
						var u, d, p = e && f(e),
							v = [],
							m = e => {
								u !== e && (null == (u = e) && (n = r = g = a), r && (v = ((e, t = i, r) => {
									for (var o, a, n = [], _ = 0; _ < e.length || _ < t.length; _++) o = e[_], a = t[_], n.push(a && !0 !== a ? !o || a[0] !== o[0] || l(a[1], o[1]) ? [a[0], a[1], (o && o[2](), a[0](r, a[1]))] : o : o && o[2]());
									return n
								})(v, r(u), n)), t && !d && s(g, d = !0))
							},
							g = () => e = h(e.parentNode, e, p, p = t(u), b, d = !1),
							b = function(e) {
								n(this.events[e.type], e)
							};
						return (n = n(((e, t) => "function" == typeof e ? n(e(u, t)) : _(e) ? "function" == typeof e[0] ? n(e[0], e[1]) : e.slice(1).map((e => e && !0 !== e && (e[0] || e)(n, e[1])), m(e[0])) : m(e))))(c), n
					}
			}
		},
		t = {};

	function r(o) {
		var i = t[o];
		if (void 0 !== i) return i.exports;
		var a = t[o] = {
			id: o,
			exports: {}
		};
		return e[o].call(a.exports, a, a.exports, r), a.exports
	}
	r.n = e => {
		var t = e && e.__esModule ? () => e.default : () => e;
		return r.d(t, {
			a: t
		}), t
	}, r.d = (e, t) => {
		for (var o in t) r.o(t, o) && !r.o(e, o) && Object.defineProperty(e, o, {
			enumerable: !0,
			get: t[o]
		})
	}, r.g = function() {
		if ("object" == typeof globalThis) return globalThis;
		try {
			return this || new Function("return this")()
		} catch (e) {
			if ("object" == typeof window) return window
		}
	}(), r.o = (e, t) => Object.prototype.hasOwnProperty.call(e, t), r.r = e => {
		"undefined" != typeof Symbol && Symbol.toStringTag && Object.defineProperty(e, Symbol.toStringTag, {
			value: "Module"
		}), Object.defineProperty(e, "__esModule", {
			value: !0
		})
	}, r.nc = void 0, (() => {
		"use strict";
		var e = r(5161),
			t = r(5645),
			o = r(5683),
			i = r(1398),
			a = r(7798),
			n = r(9839),
			_ = r(8863);

		function s(e, t, r) {
			return n.qy`<div class="ui5-card-header-root"><slot name="header"></slot></div>`
		}
		var c, l, u = r(1573),
			d = r(9897),
			p = r(5587);
		(l = c || (c = {})).Top = "Top", l.Bottom = "Bottom";
		const h = c;
		var v = r(5637);
		var f = r(5578),
			m = r(6180),
			g = r(7395);
		(0, f.Rh)("@ui5/webcomponents-theming", "sap_horizon", (async () => m.A)), (0, f.Rh)("@ui5/webcomponents", "sap_horizon", (async () => g.A));
		var b, y = function(e, t, r, o) {
			var i, a = arguments.length,
				n = a < 3 ? t : null === o ? o = Object.getOwnPropertyDescriptor(t, r) : o;
			if ("object" == typeof Reflect && "function" == typeof Reflect.decorate) n = Reflect.decorate(e, t, r, o);
			else
				for (var _ = e.length - 1; _ >= 0; _--)(i = e[_]) && (n = (a < 3 ? i(n) : a > 3 ? i(t, r, n) : i(t, r)) || n);
			return a > 3 && n && Object.defineProperty(t, r, n), n
		};
		let C = b = class extends e.A {
			constructor() {
				super(...arguments), this.showColon = !1, this.required = !1, this.wrappingType = "Normal"
			}
			_onclick() {
				if (!this.for) return;
				const e = this.getRootNode().querySelector(`[id="${this.for}"]`);
				e && e.focus()
			}
			get _colonSymbol() {
				return b.i18nBundle.getText(v.vtI)
			}
		};
		y([(0, o.A)()], C.prototype, "for", void 0), y([(0, o.A)({
			type: Boolean
		})], C.prototype, "showColon", void 0), y([(0, o.A)({
			type: Boolean
		})], C.prototype, "required", void 0), y([(0, o.A)()], C.prototype, "wrappingType", void 0), y([(0, a.A)("@ui5/webcomponents")], C, "i18nBundle", void 0), C = b = y([(0, t.A)({
			tag: "ui5-label",
			renderer: n.Ay,
			template: function(e, t, r) {
				return n.qy`<label class="ui5-label-root" @click=${this._onclick}><span class="ui5-label-text-wrapper"><slot></slot></span><span aria-hidden="true" class="ui5-label-required-colon" data-colon="${(0,n.JR)(this._colonSymbol)}"></span></label>`
			},
			styles: {
				packageName: "@ui5/webcomponents",
				fileName: "themes/Label.css.ts",
				content: ':host(:not([hidden])){display:inline-flex}:host{max-width:100%;color:var(--sapContent_LabelColor);font-family:"72override",var(--sapFontFamily);font-size:var(--sapFontSize);font-weight:400;cursor:text}.ui5-label-root{width:100%;cursor:inherit}:host{white-space:normal}:host([wrapping-type="None"]){white-space:nowrap}:host([wrapping-type="None"]) .ui5-label-root{display:inline-flex}:host([wrapping-type="None"]) .ui5-label-text-wrapper{text-overflow:ellipsis;overflow:hidden;display:inline-block;vertical-align:top;flex:0 1 auto;min-width:0}:host([show-colon]) .ui5-label-required-colon:before{content:attr(data-colon)}:host([required]) .ui5-label-required-colon:after{content:"*";color:var(--sapField_RequiredColor);font-size:1.25rem;font-weight:700;position:relative;font-style:normal;vertical-align:middle;line-height:0}.ui5-label-text-wrapper{padding-inline-end:.075rem}:host([required][show-colon]) .ui5-label-required-colon:after{margin-inline-start:.125rem}:host([show-colon]) .ui5-label-required-colon{margin-inline-start:-.05rem;white-space:pre}\n'
			},
			languageAware: !0
		})], C), C.define();
		const w = C;

		function x(e, t, r) {
			return n.qy`<div class="ui5-busy-indicator-busy-area" title="${(0,n.JR)(this.ariaTitle)}" tabindex="0" role="progressbar" aria-valuemin="0" aria-valuemax="100" aria-valuetext="Busy" aria-labelledby="${(0,n.JR)(this.labelId)}" data-sap-focus-ref>${this.textPosition.top?k.call(this,e,t,r):void 0}<div class="ui5-busy-indicator-circles-wrapper"><div class="ui5-busy-indicator-circle circle-animation-0"></div><div class="ui5-busy-indicator-circle circle-animation-1"></div><div class="ui5-busy-indicator-circle circle-animation-2"></div></div>${this.textPosition.bottom?B.call(this,e,t,r):void 0}</div>`
		}

		function k(e, t, r) {
			return n.qy`${this.text?S.call(this,e,t,r):void 0}`
		}

		function S(e, t, r) {
			return r ? n.qy`<${(0,n.DL)("ui5-label",t,r)} id="${(0,n.JR)(this._id)}-label" class="ui5-busy-indicator-text">${(0,n.JR)(this.text)}</${(0,n.DL)("ui5-label",t,r)}>` : n.qy`<ui5-label id="${(0,n.JR)(this._id)}-label" class="ui5-busy-indicator-text">${(0,n.JR)(this.text)}</ui5-label>`
		}

		function B(e, t, r) {
			return n.qy`${this.text?A.call(this,e,t,r):void 0}`
		}

		function A(e, t, r) {
			return r ? n.qy`<${(0,n.DL)("ui5-label",t,r)} id="${(0,n.JR)(this._id)}-label" class="ui5-busy-indicator-text">${(0,n.JR)(this.text)}</${(0,n.DL)("ui5-label",t,r)}>` : n.qy`<ui5-label id="${(0,n.JR)(this._id)}-label" class="ui5-busy-indicator-text">${(0,n.JR)(this.text)}</ui5-label>`
		}

		function T(e, t, r) {
			return n.qy`<span data-ui5-focus-redirect tabindex="0" @focusin="${this._redirectFocus}"></span>`
		}(0, f.Rh)("@ui5/webcomponents-theming", "sap_horizon", (async () => m.A)), (0, f.Rh)("@ui5/webcomponents", "sap_horizon", (async () => g.A));
		var I, q = function(e, t, r, o) {
			var i, a = arguments.length,
				n = a < 3 ? t : null === o ? o = Object.getOwnPropertyDescriptor(t, r) : o;
			if ("object" == typeof Reflect && "function" == typeof Reflect.decorate) n = Reflect.decorate(e, t, r, o);
			else
				for (var _ = e.length - 1; _ >= 0; _--)(i = e[_]) && (n = (a < 3 ? i(n) : a > 3 ? i(t, r, n) : i(t, r)) || n);
			return a > 3 && n && Object.defineProperty(t, r, n), n
		};
		let L = I = class extends e.A {
			constructor() {
				super(), this.size = "M", this.active = !1, this.delay = 1e3, this.textPlacement = "Bottom", this._isBusy = !1, this._keydownHandler = this._handleKeydown.bind(this), this._preventEventHandler = this._preventEvent.bind(this)
			}
			onEnterDOM() {
				this.addEventListener("keydown", this._keydownHandler, {
					capture: !0
				}), this.addEventListener("keyup", this._preventEventHandler, {
					capture: !0
				}), (0, p.xl)() && this.setAttribute("desktop", "")
			}
			onExitDOM() {
				this._busyTimeoutId && (clearTimeout(this._busyTimeoutId), delete this._busyTimeoutId), this.removeEventListener("keydown", this._keydownHandler, !0), this.removeEventListener("keyup", this._preventEventHandler, !0)
			}
			get ariaTitle() {
				return I.i18nBundle.getText(v.RXS)
			}
			get labelId() {
				return this.text ? `${this._id}-label` : void 0
			}
			get classes() {
				return {
					root: {
						"ui5-busy-indicator-root": !0
					}
				}
			}
			get textPosition() {
				return {
					top: this.text && this.textPlacement === h.Top,
					bottom: this.text && this.textPlacement === h.Bottom
				}
			}
			onBeforeRendering() {
				this.active ? this._isBusy || this._busyTimeoutId || (this._busyTimeoutId = setTimeout((() => {
					delete this._busyTimeoutId, this._isBusy = !0
				}), Math.max(0, this.delay))) : (this._busyTimeoutId && (clearTimeout(this._busyTimeoutId), delete this._busyTimeoutId), this._isBusy = !1)
			}
			_handleKeydown(e) {
				this._isBusy && (e.stopImmediatePropagation(), (0, d.zP)(e) && (this.focusForward = !0, this.shadowRoot.querySelector("[data-ui5-focus-redirect]").focus(), this.focusForward = !1))
			}
			_preventEvent(e) {
				this._isBusy && e.stopImmediatePropagation()
			}
			_redirectFocus(e) {
				this.focusForward || (e.preventDefault(), this.shadowRoot.querySelector(".ui5-busy-indicator-busy-area").focus())
			}
		};
		q([(0, o.A)()], L.prototype, "text", void 0), q([(0, o.A)()], L.prototype, "size", void 0), q([(0, o.A)({
			type: Boolean
		})], L.prototype, "active", void 0), q([(0, o.A)({
			type: Number
		})], L.prototype, "delay", void 0), q([(0, o.A)()], L.prototype, "textPlacement", void 0), q([(0, o.A)({
			type: Boolean
		})], L.prototype, "_isBusy", void 0), q([(0, a.A)("@ui5/webcomponents")], L, "i18nBundle", void 0), L = I = q([(0, t.A)({
			tag: "ui5-busy-indicator",
			languageAware: !0,
			styles: {
				packageName: "@ui5/webcomponents",
				fileName: "themes/BusyIndicator.css.ts",
				content: ':host(:not([hidden])){display:inline-block}:host([_is-busy]){color:var(--_ui5-v2-4-0_busy_indicator_color)}:host([size="S"]) .ui5-busy-indicator-root{min-width:1.625rem;min-height:.5rem}:host([size="S"][text]:not([text=""])) .ui5-busy-indicator-root{min-height:1.75rem}:host([size="S"]) .ui5-busy-indicator-circle{width:.5rem;height:.5rem}:host([size="S"]) .ui5-busy-indicator-circle:first-child,:host([size="S"]) .ui5-busy-indicator-circle:nth-child(2){margin-inline-end:.0625rem}:host(:not([size])) .ui5-busy-indicator-root,:host([size="M"]) .ui5-busy-indicator-root{min-width:3.375rem;min-height:1rem}:host([size="M"]) .ui5-busy-indicator-circle:first-child,:host([size="M"]) .ui5-busy-indicator-circle:nth-child(2){margin-inline-end:.1875rem}:host(:not([size])[text]:not([text=""])) .ui5-busy-indicator-root,:host([size="M"][text]:not([text=""])) .ui5-busy-indicator-root{min-height:2.25rem}:host(:not([size])) .ui5-busy-indicator-circle,:host([size="M"]) .ui5-busy-indicator-circle{width:1rem;height:1rem}:host([size="L"]) .ui5-busy-indicator-root{min-width:6.5rem;min-height:2rem}:host([size="L"]) .ui5-busy-indicator-circle:first-child,:host([size="L"]) .ui5-busy-indicator-circle:nth-child(2){margin-inline-end:.25rem}:host([size="L"][text]:not([text=""])) .ui5-busy-indicator-root{min-height:3.25rem}:host([size="L"]) .ui5-busy-indicator-circle{width:2rem;height:2rem}.ui5-busy-indicator-root{display:flex;justify-content:center;align-items:center;position:relative;background-color:inherit;height:inherit;border-radius:inherit}.ui5-busy-indicator-busy-area{position:absolute;z-index:99;inset:0;display:flex;justify-content:center;align-items:center;background-color:inherit;flex-direction:column;border-radius:inherit}:host(:not(:empty)) .ui5-busy-indicator-busy-area{background-color:var(--_ui5-v2-4-0_busy_indicator_block_layer)}:host([desktop]) .ui5-busy-indicator-busy-area:focus,.ui5-busy-indicator-busy-area:focus-visible{outline:var(--_ui5-v2-4-0_busy_indicator_focus_outline);outline-offset:-2px}.ui5-busy-indicator-circles-wrapper{line-height:0}.ui5-busy-indicator-circle{display:inline-block;background-color:currentColor;border-radius:50%}.ui5-busy-indicator-circle:before{content:"";width:100%;height:100%;border-radius:100%}.circle-animation-0{animation:grow 1.6s infinite cubic-bezier(.32,.06,.85,1.11)}.circle-animation-1{animation:grow 1.6s infinite cubic-bezier(.32,.06,.85,1.11);animation-delay:.2s}.circle-animation-2{animation:grow 1.6s infinite cubic-bezier(.32,.06,.85,1.11);animation-delay:.4s}.ui5-busy-indicator-text{width:100%;text-align:center}:host([text-placement="Top"]) .ui5-busy-indicator-text{margin-bottom:.5rem}:host(:not([text-placement])) .ui5-busy-indicator-text,:host([text-placement="Bottom"]) .ui5-busy-indicator-text{margin-top:.5rem}@keyframes grow{0%,50%,to{-webkit-transform:scale(.5);-moz-transform:scale(.5);transform:scale(.5)}25%{-webkit-transform:scale(1);-moz-transform:scale(1);transform:scale(1)}}\n'
			},
			renderer: n.Ay,
			template: function(e, t, r) {
				return n.qy`<div class="${(0,n.Hk)(this.classes.root)}">${this._isBusy?x.call(this,e,t,r):void 0}<slot></slot>${this._isBusy?T.call(this,e,t,r):void 0}</div> `
			},
			dependencies: [w]
		})], L), L.define();
		const E = L;
		(0, f.Rh)("@ui5/webcomponents-theming", "sap_horizon", (async () => m.A)), (0, f.Rh)("@ui5/webcomponents", "sap_horizon", (async () => g.A));
		var P, z = function(e, t, r, o) {
			var i, a = arguments.length,
				n = a < 3 ? t : null === o ? o = Object.getOwnPropertyDescriptor(t, r) : o;
			if ("object" == typeof Reflect && "function" == typeof Reflect.decorate) n = Reflect.decorate(e, t, r, o);
			else
				for (var _ = e.length - 1; _ >= 0; _--)(i = e[_]) && (n = (a < 3 ? i(n) : a > 3 ? i(t, r, n) : i(t, r)) || n);
			return a > 3 && n && Object.defineProperty(t, r, n), n
		};
		let F = P = class extends e.A {
			constructor() {
				super(...arguments), this.loading = !1, this.loadingDelay = 1e3
			}
			get classes() {
				return {
					root: {
						"ui5-card-root": !0,
						"ui5-card--interactive": this._hasHeader && this.header[0].interactive,
						"ui5-card--nocontent": !this.content.length
					}
				}
			}
			get _hasHeader() {
				return !!this.header.length
			}
			get _getAriaLabel() {
				const e = (0, _.ax)(this),
					t = e ? ` ${e}` : "";
				return P.i18nBundle.getText(v.ETz) + t
			}
			get _ariaCardContentLabel() {
				return P.i18nBundle.getText(v.uDy)
			}
		};
		z([(0, o.A)()], F.prototype, "accessibleName", void 0), z([(0, o.A)()], F.prototype, "accessibleNameRef", void 0), z([(0, i.A)({
			type: HTMLElement,
			default: !0
		})], F.prototype, "content", void 0), z([(0, i.A)({
			type: HTMLElement,
			invalidateOnChildChange: !0
		})], F.prototype, "header", void 0), z([(0, o.A)({
			type: Boolean
		})], F.prototype, "loading", void 0), z([(0, o.A)({
			type: Number
		})], F.prototype, "loadingDelay", void 0), z([(0, a.A)("@ui5/webcomponents")], F, "i18nBundle", void 0), F = P = z([(0, t.A)({
			tag: "ui5-card",
			languageAware: !0,
			renderer: n.Ay,
			template: function(e, t, r) {
				return r ? n.qy`<div class="${(0,n.Hk)(this.classes.root)}" role="region" aria-label="${(0,n.JR)(this._getAriaLabel)}" part="root"><${(0,n.DL)("ui5-busy-indicator",t,r)} id="${(0,n.JR)(this._id)}-busyIndicator" delay="${(0,n.JR)(this.loadingDelay)}" ?active="${this.loading}" class="ui5-card-busy-indicator"><div class="ui5-card-inner">${this._hasHeader?s.call(this,e,t,r):void 0}<div role="group" aria-label="${(0,n.JR)(this._ariaCardContentLabel)}" part="content"><slot></slot></div></div></${(0,n.DL)("ui5-busy-indicator",t,r)}></div>` : n.qy`<div class="${(0,n.Hk)(this.classes.root)}" role="region" aria-label="${(0,n.JR)(this._getAriaLabel)}" part="root"><ui5-busy-indicator id="${(0,n.JR)(this._id)}-busyIndicator" delay="${(0,n.JR)(this.loadingDelay)}" ?active="${this.loading}" class="ui5-card-busy-indicator"><div class="ui5-card-inner">${this._hasHeader?s.call(this,e,t,r):void 0}<div role="group" aria-label="${(0,n.JR)(this._ariaCardContentLabel)}" part="content"><slot></slot></div></div></ui5-busy-indicator></div>`
			},
			styles: {
				packageName: "@ui5/webcomponents",
				fileName: "themes/Card.css.ts",
				content: '.ui5-hidden-text{position:absolute;clip:rect(1px,1px,1px,1px);user-select:none;left:-1000px;top:-1000px;pointer-events:none;font-size:0}:host(:not([hidden])){display:inline-block;width:100%}.ui5-card-root{width:100%;height:100%;color:var(--sapGroup_TitleTextColor);background:var(--sapTile_Background);box-shadow:var(--_ui5-v2-4-0_card_box_shadow);border-radius:var(--_ui5-v2-4-0_card_border-radius);border:var(--_ui5-v2-4-0_card_border);overflow:hidden;font-family:"72override",var(--sapFontFamily);font-size:var(--sapFontSize);box-sizing:border-box}.ui5-card-busy-indicator{width:100%;height:100%;border-radius:var(--_ui5-v2-4-0_card_border-radius)}.ui5-card-inner{width:100%;height:100%}.ui5-card-root.ui5-card--interactive:hover{box-shadow:var(--_ui5-v2-4-0_card_hover_box_shadow)}.ui5-card-root.ui5-card--interactive:active{box-shadow:var(--_ui5-v2-4-0_card_box_shadow)}.ui5-card-root.ui5-card--nocontent{height:auto}.ui5-card-root.ui5-card--nocontent .ui5-card-header-root{border-bottom:none}.ui5-card--nocontent ::slotted([ui5-card-header]){--_ui5-v2-4-0_card_header_focus_bottom_radius: var(--_ui5-v2-4-0_card_header_focus_radius)}.ui5-card-root .ui5-card-header-root{border-bottom:var(--_ui5-v2-4-0_card_header_border)}\n'
			},
			dependencies: [u.A, E]
		})], F), F.define();
		var H = r(4456);

		function M(e, t, r) {
			return n.qy`<div id="${(0,n.JR)(this._id)}-avatar" class="ui5-card-header-avatar" aria-label="${(0,n.JR)(this.ariaCardAvatarLabel)}"><slot name="avatar"></slot></div>`
		}

		function N(e, t, r) {
			return n.qy`<div id="${(0,n.JR)(this._id)}-title" class="ui5-card-header-title" part="title" role="heading" aria-level="3">${(0,n.JR)(this.titleText)}</div>`
		}

		function $(e, t, r) {
			return n.qy`<div class="ui5-card-header-additionalText"><span id="${(0,n.JR)(this._id)}-additionalText" part="additional-text" dir="auto">${(0,n.JR)(this.additionalText)}</span></div>`
		}

		function R(e, t, r) {
			return n.qy`<div id="${(0,n.JR)(this._id)}-subtitle" class="ui5-card-header-subtitle" part="subtitle">${(0,n.JR)(this.subtitleText)}</div>`
		}

		function O(e, t, r) {
			return n.qy`<div class="ui5-card-header-action" @focusin="${this._actionsFocusin}" @focusout="${this._actionsFocusout}"><slot name="action"></slot></div>`
		}(0, f.Rh)("@ui5/webcomponents-theming", "sap_horizon", (async () => m.A)), (0, f.Rh)("@ui5/webcomponents", "sap_horizon", (async () => g.A));
		var j, D = function(e, t, r, o) {
			var i, a = arguments.length,
				n = a < 3 ? t : null === o ? o = Object.getOwnPropertyDescriptor(t, r) : o;
			if ("object" == typeof Reflect && "function" == typeof Reflect.decorate) n = Reflect.decorate(e, t, r, o);
			else
				for (var _ = e.length - 1; _ >= 0; _--)(i = e[_]) && (n = (a < 3 ? i(n) : a > 3 ? i(t, r, n) : i(t, r)) || n);
			return a > 3 && n && Object.defineProperty(t, r, n), n
		};
		let U = j = class extends e.A {
			constructor() {
				super(...arguments), this.interactive = !1, this._ariaLevel = 3, this._headerActive = !1
			}
			onEnterDOM() {
				(0, p.xl)() && this.setAttribute("desktop", "")
			}
			get classes() {
				return {
					root: {
						"ui5-card-header": !0,
						"ui5-card-header--interactive": this.interactive,
						"ui5-card-header--active": this.interactive && this._headerActive,
						"ui5-card-header-ff": (0, p.gm)()
					}
				}
			}
			get _root() {
				return this.shadowRoot.querySelector(".ui5-card-header")
			}
			get ariaRoleDescription() {
				return this.interactive ? j.i18nBundle.getText(v.jog) : j.i18nBundle.getText(v.Syq)
			}
			get ariaRoleFocusableElement() {
				return this.interactive ? "button" : null
			}
			get ariaCardAvatarLabel() {
				return j.i18nBundle.getText(v.IBR)
			}
			get ariaLabelledBy() {
				const e = [];
				return this.titleText && e.push(`${this._id}-title`), this.subtitleText && e.push(`${this._id}-subtitle`), this.additionalText && e.push(`${this._id}-additionalText`), this.hasAvatar && e.push(`${this._id}-avatar`), 0 !== e.length ? e.join(" ") : void 0
			}
			get hasAvatar() {
				return !!this.avatar.length
			}
			get hasAction() {
				return !!this.action.length
			}
			_actionsFocusin() {
				this._root.classList.add("ui5-card-header-hide-focus")
			}
			_actionsFocusout() {
				this._root.classList.remove("ui5-card-header-hide-focus")
			}
			_click(e) {
				e.stopImmediatePropagation(), this.interactive && this._root.contains(e.target) && this.fireDecoratorEvent("click")
			}
			_keydown(e) {
				if (!this.interactive || !this._root.contains(e.target)) return;
				const t = (0, d.RI)(e),
					r = (0, d.xC)(e);
				this._headerActive = t || r, t ? this.fireDecoratorEvent("click") : r && e.preventDefault()
			}
			_keyup(e) {
				if (!this.interactive || !this._root.contains(e.target)) return;
				const t = (0, d.xC)(e);
				this._headerActive = !1, t && this.fireDecoratorEvent("click")
			}
		};
		D([(0, o.A)()], U.prototype, "titleText", void 0), D([(0, o.A)()], U.prototype, "subtitleText", void 0), D([(0, o.A)()], U.prototype, "additionalText", void 0), D([(0, o.A)({
			type: Boolean
		})], U.prototype, "interactive", void 0), D([(0, o.A)({
			type: Number
		})], U.prototype, "_ariaLevel", void 0), D([(0, o.A)({
			type: Boolean,
			noAttribute: !0
		})], U.prototype, "_headerActive", void 0), D([(0, i.A)()], U.prototype, "avatar", void 0), D([(0, i.A)()], U.prototype, "action", void 0), D([(0, a.A)("@ui5/webcomponents")], U, "i18nBundle", void 0), U = j = D([(0, t.A)({
			tag: "ui5-card-header",
			languageAware: !0,
			renderer: n.Ay,
			template: function(e, t, r) {
				return n.qy`<div id="${(0,n.JR)(this._id)}--header" class="${(0,n.Hk)(this.classes.root)}" role="group" aria-roledescription="${(0,n.JR)(this.ariaRoleDescription)}" @click="${this._click}" @keydown="${this._keydown}" @keyup="${this._keyup}" part="root"><div class="ui5-card-header-focusable-element" aria-labelledby="${(0,n.JR)(this.ariaLabelledBy)}" role="${(0,n.JR)(this.ariaRoleFocusableElement)}" data-sap-focus-ref tabindex="0">${this.hasAvatar?M.call(this,e,t,r):void 0}<div class="ui5-card-header-text"><div class="ui5-card-header-first-line">${this.titleText?N.call(this,e,t,r):void 0}${this.additionalText?$.call(this,e,t,r):void 0}</div>${this.subtitleText?R.call(this,e,t,r):void 0}</div></div>${this.hasAction?O.call(this,e,t,r):void 0}</div></div>`
			},
			styles: {
				packageName: "@ui5/webcomponents",
				fileName: "themes/CardHeader.css.ts",
				content: '.ui5-hidden-text{position:absolute;clip:rect(1px,1px,1px,1px);user-select:none;left:-1000px;top:-1000px;pointer-events:none;font-size:0}.ui5-card-header{position:relative;display:flex;align-items:center;padding:var(--_ui5-v2-4-0_card_header_padding);outline:none}:host([subtitleText]) .ui5-card-header{align-items:flex-start}:host([desktop]) .ui5-card-header.ui5-card-header-ff:not(.ui5-card-header-hide-focus):focus-within:before,.ui5-card-header.ui5-card-header-ff:not(.ui5-card-header-hide-focus):focus-visible:before{outline:none;content:"";position:absolute;border:var(--_ui5-v2-4-0_card_header_focus_border);pointer-events:none;top:var(--_ui5-v2-4-0_card_header_focus_offset);left:var(--_ui5-v2-4-0_card_header_focus_offset);right:var(--_ui5-v2-4-0_card_header_focus_offset);bottom:var(--_ui5-v2-4-0_card_header_focus_offset);border-top-left-radius:var(--_ui5-v2-4-0_card_header_focus_radius);border-top-right-radius:var(--_ui5-v2-4-0_card_header_focus_radius);border-bottom-left-radius:var(--_ui5-v2-4-0_card_header_focus_bottom_radius);border-bottom-right-radius:var(--_ui5-v2-4-0_card_header_focus_bottom_radius)}:host([desktop]) .ui5-card-header:not(.ui5-card-header-ff):not(.ui5-card-header-hide-focus):has(.ui5-card-header-focusable-element:focus):before,.ui5-card-header:not(.ui5-card-header-ff):not(.ui5-card-header-hide-focus):has(.ui5-card-header-focusable-element:focus-visible):before{outline:none;content:"";position:absolute;border:var(--_ui5-v2-4-0_card_header_focus_border);pointer-events:none;top:var(--_ui5-v2-4-0_card_header_focus_offset);left:var(--_ui5-v2-4-0_card_header_focus_offset);right:var(--_ui5-v2-4-0_card_header_focus_offset);bottom:var(--_ui5-v2-4-0_card_header_focus_offset);border-top-left-radius:var(--_ui5-v2-4-0_card_header_focus_radius);border-top-right-radius:var(--_ui5-v2-4-0_card_header_focus_radius);border-bottom-left-radius:var(--_ui5-v2-4-0_card_header_focus_bottom_radius);border-bottom-right-radius:var(--_ui5-v2-4-0_card_header_focus_bottom_radius)}.ui5-card-header-focusable-element{outline:none}.ui5-card-header-focusable-element{display:inherit;align-items:inherit;flex:1;min-width:0}.ui5-card-header.ui5-card-header--interactive:hover{cursor:pointer;background:var(--_ui5-v2-4-0_card_header_hover_bg)}.ui5-card-header.ui5-card-header--active,.ui5-card-header.ui5-card-header--interactive:active{background:var(--_ui5-v2-4-0_card_header_active_bg)}.ui5-card-header .ui5-card-header-text{flex:1;min-width:0;pointer-events:none}.ui5-card-header-first-line{display:flex;flex-flow:row;justify-content:space-between}.ui5-card-header-additionalText{flex:none}.ui5-card-header .ui5-card-header-avatar{height:3rem;width:3rem;display:flex;align-items:center;justify-content:center;margin-inline-end:.75rem;pointer-events:none;align-self:flex-start}::slotted([ui5-icon]){width:1.5rem;height:1.5rem;color:var(--sapTile_IconColor)}::slotted(img[slot="avatar"]){width:100%;height:100%;border-radius:50%}.ui5-card-header .ui5-card-header-additionalText{display:inline-block;font-family:"72override",var(--sapFontFamily);font-size:var(--sapFontSmallSize);color:var(--sapTile_TextColor);text-align:left;text-overflow:ellipsis;overflow:hidden;white-space:nowrap;vertical-align:middle;margin-inline-start:1rem;margin-block-start:.125rem}.ui5-card-header .ui5-card-header-text .ui5-card-header-title{font-family:var(--_ui5-v2-4-0_card_header_title_font_family);font-size:var(--_ui5-v2-4-0_card_header_title_font_size);font-weight:var(--_ui5-v2-4-0_card_header_title_font_weight);color:var(--sapTile_TitleTextColor);max-height:3.5rem;align-self:flex-end}.ui5-card-header .ui5-card-header-text .ui5-card-header-subtitle{font-family:"72override",var(--sapFontFamily);font-size:var(--sapFontSize);font-weight:400;color:var(--sapTile_TextColor);margin-top:var(--_ui5-v2-4-0_card_header_subtitle_margin_top);max-height:2.1rem}.ui5-card-header .ui5-card-header-text .ui5-card-header-title,.ui5-card-header .ui5-card-header-text .ui5-card-header-subtitle{text-align:start;text-overflow:ellipsis;white-space:normal;word-wrap:break-word;overflow:hidden;-webkit-line-clamp:2;-webkit-box-orient:vertical;display:-webkit-box;max-width:100%}.ui5-card-header .ui5-card-header-text .ui5-card-header-title{-webkit-line-clamp:3}.ui5-card-header-action{display:flex;padding-inline-start:1rem;align-self:flex-start}\n'
			}
		}), (0, H.A)("click", {
			bubbles: !0
		})], U), U.define();
		var G = r(1688),
			W = (r(4825), r(1431));
		(0, W.pU)("sys-help-2", {
			pathData: "M256 0q53 0 99.5 20T437 74.5t55 81.5 20 100-20 99.5-55 81.5-81.5 55-99.5 20-100-20-81.5-55T20 355.5 0 256t20-100 54.5-81.5T156 20 256 0zm96 186q0-32-27-57t-77-25q-46 0-72.5 24T146 187h52q5-24 17.5-32.5T251 146t35 12.5 12 27.5q0 10-2.5 14T282 215l-20 17q-15 12-23 21t-11.5 18.5-4.5 21-1 27.5h50q0-12 .5-19t3-12.5T283 278t15-13l27-25 16-18 9-16zM251 425q15 0 26-11t11-26-11-25.5-26-10.5-25.5 10.5T215 388t10.5 26 25.5 11z",
			ltr: !0,
			collection: "SAP-icons-v4",
			packageName: "@ui5/webcomponents-icons"
		}), (0, W.pU)("sys-help-2", {
			pathData: "M256 0q53 0 99.5 20T437 75t55 81.5 20 99.5-20 99.5-55 81.5-81.5 55-99.5 20-99.5-20T75 437t-55-81.5T0 256t20-99.5T75 75t81.5-55T256 0zm0 416q14 0 23-9t9-23-9-23-23-9-23 9-9 23 9 23 23 9zm32-127q31-10 50.5-36.5T358 192q0-21-8-39.5T328 120t-32.5-22-39.5-8-39.5 8-32.5 21-22 29.5-8 34.5q0 20 9 30.5t23 10.5q13 0 22.5-9t9.5-23q0-16 11-27t27-11 27 11 11 27-11 27-27 11q-14 0-23 9.5t-9 22.5v26q0 14 9 23t23 9q13 0 22-9t10-22z",
			ltr: !0,
			collection: "SAP-icons-v5",
			packageName: "@ui5/webcomponents-icons"
		}), (0, W.pU)("sys-enter-2", {
			pathData: "M512 256q0 54-20 100.5t-54.5 81T356 492t-100 20q-54 0-100.5-20t-81-55T20 355.5 0 256t20.5-100 55-81.5T157 20t99-20q53 0 100 20t81.5 54.5T492 156t20 100zm-118-87q2-4 2-7t-3-6l-36-36q-3-4-8-4t-8 5L237 294h-4l-70-52q-4-3-7-3t-4.5 2-2.5 3l-29 41q-3 3-3 6 0 5 5 8l113 95q2 2 7 2t8-4z",
			ltr: !0,
			collection: "SAP-icons-v4",
			packageName: "@ui5/webcomponents-icons"
		}), (0, W.pU)("sys-enter-2", {
			pathData: "M256 0q53 0 100 20t81.5 54.5T492 156t20 100-20 100-54.5 81.5T356 492t-100 20-100-20-81.5-54.5T20 356 0 256t20-100 54.5-81.5T156 20 256 0zm150 183q10-9 10-23 0-13-9.5-22.5T384 128t-22 9L186 308l-68-63q-9-9-22-9t-22.5 9.5T64 268q0 15 10 24l90 83q11 9 22 9 13 0 22-9z",
			ltr: !0,
			collection: "SAP-icons-v5",
			packageName: "@ui5/webcomponents-icons"
		});
		const J = {
				key: "ICON_ERROR",
				defaultText: "Error"
			},
			V = J;
		(0, W.pU)("error", {
			pathData: "M512 256q0 53-20.5 100t-55 81.5-81 54.5-99.5 20-100-20.5-81.5-55T20 355 0 256q0-54 20-100.5t55-81T156.5 20 256 0t99.5 20T437 75t55 81.5 20 99.5zM399 364q3-3 3-6t-3-6l-86-86q-3-3-3-6t3-6l81-81q3-3 3-6t-3-6l-37-37q-2-2-6-2t-6 2l-83 82q-1 3-6 3-3 0-6-3l-84-83q-1-2-6-2-4 0-6 2l-37 37q-3 3-3 6t3 6l83 82q3 3 3 6t-3 6l-83 82q-2 2-2.5 4.5l-.5 2.5q0 3 3 5l36 37q4 2 6 2 4 0 6-2l85-84q2-2 6-2t6 2l88 88q4 2 6 2t6-2z",
			ltr: !1,
			accData: V,
			collection: "SAP-icons-v4",
			packageName: "@ui5/webcomponents-icons"
		});
		const X = J;
		var Y, Z;
		(0, W.pU)("error", {
			pathData: "M256 0q53 0 99.5 20T437 75t55 81.5 20 99.5-20 99.5-55 81.5-81.5 55-99.5 20-99.5-20T75 437t-55-81.5T0 256t20-99.5T75 75t81.5-55T256 0zm45 256l74-73q9-11 9-23 0-13-9.5-22.5T352 128q-12 0-23 9l-73 74-73-74q-10-9-23-9t-22.5 9.5T128 160q0 12 9 23l74 73-74 73q-9 10-9 23t9.5 22.5T160 384t23-9l73-74 73 74q11 9 23 9 13 0 22.5-9.5T384 352t-9-23z",
			ltr: !1,
			accData: X,
			collection: "SAP-icons-v5",
			packageName: "@ui5/webcomponents-icons"
		}), (0, W.pU)("alert", {
			pathData: "M501 374q5 10 7.5 19.5T512 412v5q0 31-23 47t-50 16H74q-13 0-26-4t-23.5-12-17-20T0 417q0-13 4-22.5t9-20.5L198 38q21-38 61-38 38 0 59 38zM257 127q-13 0-23.5 8T223 161q1 7 2 12 3 25 4.5 48t3.5 61q0 11 7.5 16t16.5 5q22 0 23-21l2-36 9-85q0-18-10.5-26t-23.5-8zm0 299q20 0 31.5-12t11.5-32q0-19-11.5-31T257 339t-31.5 12-11.5 31q0 20 11.5 32t31.5 12z",
			ltr: !1,
			collection: "SAP-icons-v4",
			packageName: "@ui5/webcomponents-icons"
		}), (0, W.pU)("alert", {
			pathData: "M505 399q7 13 7 27 0 21-15.5 37.5T456 480H56q-25 0-40.5-16.5T0 426q0-14 7-27L208 59q8-14 21-20.5t27-6.5 27 6.5T304 59zm-249 17q14 0 23-9t9-23-9-23-23-9-23 9-9 23 9 23 23 9zm32-240q0-14-9-23t-23-9-23 9-9 23v96q0 14 9 23t23 9 23-9 9-23v-96z",
			ltr: !1,
			collection: "SAP-icons-v5",
			packageName: "@ui5/webcomponents-icons"
		}), (0, W.pU)("information", {
			pathData: "M0 256q0-53 20.5-100t55-81.5T157 20t99-20q54 0 100.5 20t81 55 54.5 81.5 20 99.5q0 54-20 100.5t-54.5 81T356 492t-100 20q-54 0-100.5-20t-81-55T20 355.5 0 256zm226-89q14 11 30 11 17 0 29.5-11.5T298 138q0-19-13-31-12-12-29-12-19 0-30.5 12.5T214 138q0 17 12 29zm-34 201v33h128v-33h-32V215q0-6-7-6h-88v31h32v128h-33z",
			ltr: !1,
			collection: "SAP-icons-v4",
			packageName: "@ui5/webcomponents-icons"
		}), (0, W.pU)("information", {
			pathData: "M256 0q53 0 99.5 20T437 75t55 81.5 20 99.5-20 99.5-55 81.5-81.5 55-99.5 20-99.5-20T75 437t-55-81.5T0 256t20-99.5T75 75t81.5-55T256 0zm32 224q0-14-9-23t-23-9-23 9-9 23v160q0 14 9 23t23 9 23-9 9-23V224zm-32-64q14 0 23-9t9-23-9-23-23-9-23 9-9 23 9 23 23 9z",
			ltr: !1,
			collection: "SAP-icons-v5",
			packageName: "@ui5/webcomponents-icons"
		}), (Z = Y || (Y = {})).Set1 = "Set1", Z.Set2 = "Set2", Z.Neutral = "Neutral", Z.Information = "Information", Z.Positive = "Positive", Z.Negative = "Negative", Z.Critical = "Critical";
		const K = Y;

		function Q(e, t, r) {
			return n.qy`<button class="ui5-tag-root" title="${(0,n.JR)(this._title)}" aria-roledescription="${(0,n.JR)(this._roleDescription)}" aria-description="${(0,n.JR)(this._valueState)}" @onclick=${this._onclick}><slot name="icon"></slot>${this._semanticIconName?ee.call(this,e,t,r):void 0}<span class="ui5-hidden-text">${(0,n.JR)(this.tagDescription)}</span>${this.hasText?te.call(this,e,t,r):void 0}</button>`
		}

		function ee(e, t, r) {
			return r ? n.qy`<${(0,n.DL)("ui5-icon",t,r)} class="ui5-tag-semantic-icon" name="${(0,n.JR)(this._semanticIconName)}"></${(0,n.DL)("ui5-icon",t,r)}>` : n.qy`<ui5-icon class="ui5-tag-semantic-icon" name="${(0,n.JR)(this._semanticIconName)}"></ui5-icon>`
		}

		function te(e, t, r) {
			return n.qy`<span class="ui5-tag-text"><slot></slot></span>`
		}

		function re(e, t, r) {
			return n.qy`<div class="ui5-tag-root" title="${(0,n.JR)(this._title)}"><slot name="icon"></slot>${this._semanticIconName?oe.call(this,e,t,r):void 0}<span class="ui5-hidden-text">${(0,n.JR)(this.tagDescription)}</span>${this.hasText?ie.call(this,e,t,r):void 0}</div>`
		}

		function oe(e, t, r) {
			return r ? n.qy`<${(0,n.DL)("ui5-icon",t,r)} class="ui5-tag-semantic-icon" name="${(0,n.JR)(this._semanticIconName)}"></${(0,n.DL)("ui5-icon",t,r)}>` : n.qy`<ui5-icon class="ui5-tag-semantic-icon" name="${(0,n.JR)(this._semanticIconName)}"></ui5-icon>`
		}

		function ie(e, t, r) {
			return n.qy`<span class="ui5-tag-text"><slot></slot></span>`
		}(0, f.Rh)("@ui5/webcomponents-theming", "sap_horizon", (async () => m.A)), (0, f.Rh)("@ui5/webcomponents", "sap_horizon", (async () => g.A));
		var ae, ne = function(e, t, r, o) {
			var i, a = arguments.length,
				n = a < 3 ? t : null === o ? o = Object.getOwnPropertyDescriptor(t, r) : o;
			if ("object" == typeof Reflect && "function" == typeof Reflect.decorate) n = Reflect.decorate(e, t, r, o);
			else
				for (var _ = e.length - 1; _ >= 0; _--)(i = e[_]) && (n = (a < 3 ? i(n) : a > 3 ? i(t, r, n) : i(t, r)) || n);
			return a > 3 && n && Object.defineProperty(t, r, n), n
		};
		let _e = ae = class extends e.A {
			constructor() {
				super(...arguments), this.design = "Neutral", this.colorScheme = "1", this.hideStateIcon = !1, this.interactive = !1, this.wrappingType = "Normal", this.size = "S", this._hasIcon = !1, this._iconOnly = !1
			}
			onEnterDOM() {
				(0, p.xl)() && this.setAttribute("desktop", "")
			}
			onBeforeRendering() {
				this._hasIcon = this.hasIcon || !!this._semanticIconName, this._iconOnly = this.iconOnly
			}
			get _roleDescription() {
				return ae.i18nBundle.getText(v.tgM)
			}
			get _valueState() {
				switch (this.design) {
					case K.Positive:
						return ae.i18nBundle.getText(v.dVz);
					case K.Negative:
						return ae.i18nBundle.getText(v.WHs);
					case K.Critical:
						return ae.i18nBundle.getText(v.An0);
					case K.Information:
						return ae.i18nBundle.getText(v.qXW)
				}
			}
			get hasText() {
				return (0, G.A)(this.text)
			}
			get hasIcon() {
				return !!this.icon.length
			}
			get iconOnly() {
				return this.hasIcon && !this.hasText
			}
			get _title() {
				return this.title || void 0
			}
			get tagDescription() {
				if (this.interactive) return;
				const e = this._valueState;
				let t = ae.i18nBundle.getText(v.btg);
				return e && (t = `${t} ${e}`), t
			}
			get _semanticIconName() {
				if (this.hideStateIcon || this.hasIcon) return null;
				switch (this.design) {
					case K.Neutral:
						return "sys-help-2";
					case K.Positive:
						return "sys-enter-2";
					case K.Negative:
						return "error";
					case K.Critical:
						return "alert";
					case K.Information:
						return "information";
					default:
						return null
				}
			}
			_onclick() {
				this.fireDecoratorEvent("click")
			}
		};
		ne([(0, o.A)()], _e.prototype, "design", void 0), ne([(0, o.A)()], _e.prototype, "colorScheme", void 0), ne([(0, o.A)({
			type: Boolean
		})], _e.prototype, "hideStateIcon", void 0), ne([(0, o.A)({
			type: Boolean
		})], _e.prototype, "interactive", void 0), ne([(0, o.A)()], _e.prototype, "wrappingType", void 0), ne([(0, o.A)()], _e.prototype, "size", void 0), ne([(0, o.A)({
			type: Boolean
		})], _e.prototype, "_hasIcon", void 0), ne([(0, o.A)({
			type: Boolean
		})], _e.prototype, "_iconOnly", void 0), ne([(0, i.A)({
			type: Node,
			default: !0
		})], _e.prototype, "text", void 0), ne([(0, i.A)()], _e.prototype, "icon", void 0), ne([(0, a.A)("@ui5/webcomponents")], _e, "i18nBundle", void 0), _e = ae = ne([(0, t.A)({
			tag: "ui5-tag",
			languageAware: !0,
			renderer: n.Ay,
			template: function(e, t, r) {
				return n.qy`${this.interactive?Q.call(this,e,t,r):re.call(this,e,t,r)} `
			},
			styles: {
				packageName: "@ui5/webcomponents",
				fileName: "themes/Tag.css.ts",
				content: '.ui5-hidden-text{position:absolute;clip:rect(1px,1px,1px,1px);user-select:none;left:-1000px;top:-1000px;pointer-events:none;font-size:0}:host(:not([hidden])){display:inline-block}:host{font-size:var(--sapFontSmallSize);font-family:var(--sapFontBoldFamily);font-weight:var(--_ui5-v2-4-0-tag-font-weight);letter-spacing:var(--_ui5-v2-4-0-tag-letter-spacing);line-height:var(--_ui5-v2-4-0-tag-height)}.ui5-tag-root{display:flex;align-items:center;justify-content:center;width:100%;min-width:1.125em;max-width:100%;box-sizing:border-box;padding:var(--_ui5-v2-4-0-tag-text-padding);border:.0625rem solid;border-radius:var(--sapButton_BorderCornerRadius);white-space:normal;font-size:inherit;font-family:inherit;font-weight:inherit;line-height:inherit;letter-spacing:inherit}:host([interactive]) .ui5-tag-root:active{text-shadow:var(--ui5-v2-4-0-tag-text-shadow)}:host([interactive]) .ui5-tag-root{cursor:pointer}:host([desktop][interactive]) .ui5-tag-root:focus,:host([interactive]) .ui5-tag-root:focus-visible{outline:var(--sapContent_FocusWidth) var(--sapContent_FocusStyle) var(--sapContent_FocusColor);outline-offset:1px}:host([wrapping-type="None"]) .ui5-tag-root{white-space:nowrap}:host([_icon-only]) .ui5-tag-root{padding-inline:var(--_ui5-v2-4-0-tag-padding-inline-icon-only)}.ui5-tag-text{text-transform:var(--_ui5-v2-4-0-tag-text-transform);text-align:start;pointer-events:none;overflow:hidden;text-overflow:ellipsis}:host([_has-icon]) .ui5-tag-text{padding-inline-start:var(--_ui5-v2-4-0-tag-icon-gap)}[ui5-icon],::slotted([ui5-icon]){width:var(--_ui5-v2-4-0-tag-icon-width);min-width:var(--_ui5-v2-4-0-tag-icon-width);color:inherit;pointer-events:none;align-self:flex-start}:host([wrapping-type="None"]) [ui5-icon],:host([wrapping-type="None"]) ::slotted([ui5-icon]){align-self:auto}.ui5-tag-root{background-color:var(--sapNeutralBackground);border-color:var(--sapNeutralBorderColor);color:var(--sapTextColor);text-shadow:var(--ui5-v2-4-0-tag-text-shadow)}:host([interactive]) .ui5-tag-root:hover{background-color:var(--sapButton_Neutral_Hover_Background);border-color:var(--sapButton_Neutral_Hover_BorderColor);color:var(--sapButton_Neutral_Hover_TextColor)}:host([interactive]) .ui5-tag-root:active{background-color:var(--sapButton_Neutral_Active_Background);border-color:var(--sapButton_Neutral_Active_BorderColor);color:var(--sapButton_Active_TextColor)}:host([design="Positive"]) .ui5-tag-root{background-color:var(--sapButton_Success_Background);border-color:var(--sapButton_Success_BorderColor);color:var(--sapButton_Success_TextColor);text-shadow:var(--ui5-v2-4-0-tag-contrast-text-shadow)}:host([interactive][design="Positive"]) .ui5-tag-root:hover{background-color:var(--sapButton_Success_Hover_Background);border-color:var(--sapButton_Success_Hover_BorderColor);color:var(--sapButton_Success_Hover_TextColor)}:host([interactive][design="Positive"]) .ui5-tag-root:active{background-color:var(--sapButton_Success_Active_Background);border-color:var(--sapButton_Success_Active_BorderColor);color:var(--sapButton_Accept_Selected_TextColor)}:host([design="Negative"]) .ui5-tag-root{background-color:var(--sapButton_Negative_Background);border-color:var(--sapButton_Negative_BorderColor);color:var(--sapButton_Negative_TextColor);text-shadow:var(--ui5-v2-4-0-tag-contrast-text-shadow)}:host([interactive][design="Negative"]) .ui5-tag-root:hover{background-color:var(--sapButton_Negative_Hover_Background);border-color:var(--sapButton_Negative_Hover_BorderColor);color:var(--sapButton_Negative_Hover_TextColor)}:host([interactive][design="Negative"]) .ui5-tag-root:active{background-color:var(--sapButton_Negative_Active_Background);border-color:var(--sapButton_Negative_Active_BorderColor);color:var(--sapButton_Reject_Selected_TextColor)}:host([design="Critical"]) .ui5-tag-root{background-color:var(--sapButton_Critical_Background);border-color:var(--sapButton_Critical_BorderColor);color:var(--sapButton_Critical_TextColor);text-shadow:var(--ui5-v2-4-0-tag-contrast-text-shadow)}:host([interactive][design="Critical"]) .ui5-tag-root:hover{background-color:var(--sapButton_Critical_Hover_Background);border-color:var(--sapButton_Critical_Hover_BorderColor);color:var(--sapButton_Critical_Hover_TextColor)}:host([interactive][design="Critical"]) .ui5-tag-root:active{background-color:var(--sapButton_Critical_Active_Background);border-color:var(--sapButton_Critical_Active_BorderColor);color:var(--sapButton_Attention_Selected_TextColor)}:host([design="Information"]) .ui5-tag-root{background-color:var(--sapButton_Information_Background);border-color:var(--sapButton_Information_BorderColor);color:var(--sapButton_Information_TextColor);text-shadow:var(--ui5-v2-4-0-tag-information-text-shadow)}:host([interactive][design="Information"]) .ui5-tag-root:hover{background-color:var(--sapButton_Information_Hover_Background);border-color:var(--sapButton_Information_Hover_BorderColor);color:var(--sapButton_Information_Hover_TextColor)}:host([interactive][design="Information"]) .ui5-tag-root:active{background-color:var(--sapButton_Information_Active_Background);border-color:var(--sapButton_Information_Active_BorderColor);color:var(--sapButton_Selected_TextColor)}:host([design="Set1"]) .ui5-tag-root{text-shadow:var(--ui5-v2-4-0-tag-contrast-text-shadow)}:host([design="Set1"]) .ui5-tag-root,:host([interactive][design="Set1"]) .ui5-tag-root{background-color:var(--sapIndicationColor_1_Background);border-color:var(--sapIndicationColor_1_BorderColor);color:var(--sapIndicationColor_1_TextColor)}:host([interactive][design="Set1"]) .ui5-tag-root:hover{background-color:var(--sapIndicationColor_1_Hover_Background)}:host([interactive][design="Set1"]) .ui5-tag-root:active{background-color:var(--sapIndicationColor_1_Active_Background);border-color:var(--sapIndicationColor_1_Active_BorderColor);color:var(--sapIndicationColor_1_Active_TextColor)}:host([design="Set1"][color-scheme="2"]) .ui5-tag-root{background-color:var(--sapIndicationColor_2_Background);border-color:var(--sapIndicationColor_2_BorderColor);color:var(--sapIndicationColor_2_TextColor)}:host([interactive][design="Set1"][color-scheme="2"]) .ui5-tag-root:hover{background-color:var(--sapIndicationColor_2_Hover_Background)}:host([interactive][design="Set1"][color-scheme="2"]) .ui5-tag-root:active{background-color:var(--sapIndicationColor_2_Active_Background);border-color:var(--sapIndicationColor_2_Active_BorderColor);color:var(--sapIndicationColor_2_Active_TextColor)}:host([design="Set1"][color-scheme="3"]) .ui5-tag-root{background-color:var(--sapIndicationColor_3_Background);border-color:var(--sapIndicationColor_3_BorderColor);color:var(--sapIndicationColor_3_TextColor)}:host([interactive][design="Set1"][color-scheme="3"]) .ui5-tag-root:hover{background-color:var(--sapIndicationColor_3_Hover_Background)}:host([interactive][design="Set1"][color-scheme="3"]) .ui5-tag-root:active{background-color:var(--sapIndicationColor_3_Active_Background);border-color:var(--sapIndicationColor_3_Active_BorderColor);color:var(--sapIndicationColor_3_Active_TextColor)}:host([design="Set1"][color-scheme="4"]) .ui5-tag-root{background-color:var(--sapIndicationColor_4_Background);border-color:var(--sapIndicationColor_4_BorderColor);color:var(--sapIndicationColor_4_TextColor)}:host([interactive][design="Set1"][color-scheme="4"]) .ui5-tag-root:hover{background-color:var(--sapIndicationColor_4_Hover_Background)}:host([interactive][design="Set1"][color-scheme="4"]) .ui5-tag-root:active{background-color:var(--sapIndicationColor_4_Active_Background);border-color:var(--sapIndicationColor_4_Active_BorderColor);color:var(--sapIndicationColor_4_Active_TextColor)}:host([design="Set1"][color-scheme="5"]) .ui5-tag-root{background-color:var(--sapIndicationColor_5_Background);border-color:var(--sapIndicationColor_5_BorderColor);color:var(--sapIndicationColor_5_TextColor)}:host([interactive][design="Set1"][color-scheme="5"]) .ui5-tag-root:hover{background-color:var(--sapIndicationColor_5_Hover_Background)}:host([interactive][design="Set1"][color-scheme="5"]) .ui5-tag-root:active{background-color:var(--sapIndicationColor_5_Active_Background);border-color:var(--sapIndicationColor_5_Active_BorderColor);color:var(--sapIndicationColor_5_Active_TextColor)}:host([design="Set1"][color-scheme="6"]) .ui5-tag-root{background-color:var(--sapIndicationColor_6_Background);border-color:var(--sapIndicationColor_6_BorderColor);color:var(--sapIndicationColor_6_TextColor)}:host([interactive][design="Set1"][color-scheme="6"]) .ui5-tag-root:hover{background-color:var(--sapIndicationColor_6_Hover_Background)}:host([interactive][design="Set1"][color-scheme="6"]) .ui5-tag-root:active{background-color:var(--sapIndicationColor_6_Active_Background);border-color:var(--sapIndicationColor_6_Active_BorderColor);color:var(--sapIndicationColor_6_Active_TextColor)}:host([design="Set1"][color-scheme="7"]) .ui5-tag-root{background-color:var(--sapIndicationColor_7_Background);border-color:var(--sapIndicationColor_7_BorderColor);color:var(--sapIndicationColor_7_TextColor)}:host([interactive][design="Set1"][color-scheme="7"]) .ui5-tag-root:hover{background-color:var(--sapIndicationColor_7_Hover_Background)}:host([interactive][design="Set1"][color-scheme="7"]) .ui5-tag-root:active{background-color:var(--sapIndicationColor_7_Active_Background);border-color:var(--sapIndicationColor_7_Active_BorderColor);color:var(--sapIndicationColor_7_Active_TextColor)}:host([design="Set1"][color-scheme="8"]) .ui5-tag-root{background-color:var(--sapIndicationColor_8_Background);border-color:var(--sapIndicationColor_8_BorderColor);color:var(--sapIndicationColor_8_TextColor)}:host([interactive][design="Set1"][color-scheme="8"]) .ui5-tag-root:hover{background-color:var(--sapIndicationColor_8_Hover_Background)}:host([interactive][design="Set1"][color-scheme="8"]) .ui5-tag-root:active{background-color:var(--sapIndicationColor_8_Active_Background);border-color:var(--sapIndicationColor_8_Active_BorderColor);color:var(--sapIndicationColor_8_Active_TextColor)}:host([design="Set1"][color-scheme="9"]) .ui5-tag-root{background-color:var(--sapIndicationColor_9_Background);border-color:var(--sapIndicationColor_9_BorderColor);color:var(--sapIndicationColor_9_TextColor)}:host([interactive][design="Set1"][color-scheme="9"]) .ui5-tag-root:hover{background-color:var(--sapIndicationColor_9_Hover_Background)}:host([interactive][design="Set1"][color-scheme="9"]) .ui5-tag-root:active{background-color:var(--sapIndicationColor_9_Active_Background);border-color:var(--sapIndicationColor_9_Active_BorderColor);color:var(--sapIndicationColor_9_Active_TextColor)}:host([design="Set1"][color-scheme="10"]) .ui5-tag-root{background-color:var(--sapIndicationColor_10_Background);border-color:var(--sapIndicationColor_10_BorderColor);color:var(--sapIndicationColor_10_TextColor)}:host([interactive][design="Set1"][color-scheme="10"]) .ui5-tag-root:hover{background-color:var(--sapIndicationColor_10_Hover_Background)}:host([interactive][design="Set1"][color-scheme="10"]) .ui5-tag-root:active{background-color:var(--sapIndicationColor_10_Active_Background);border-color:var(--sapIndicationColor_10_Active_BorderColor);color:var(--sapIndicationColor_10_Active_TextColor)}:host([design="Set2"]) .ui5-tag-root{text-shadow:var(--ui5-v2-4-0-tag-text-shadow)}:host([design="Set2"]) .ui5-tag-root,:host([interactive][design="Set2"]) .ui5-tag-root{background-color:var(--ui5-v2-4-0-tag-set2-color-scheme-1-background);border-color:var(--ui5-v2-4-0-tag-set2-color-scheme-1-border);color:var(--ui5-v2-4-0-tag-set2-color-scheme-1-color)}:host([interactive][design="Set2"]) .ui5-tag-root:hover{background-color:var(--ui5-v2-4-0-tag-set2-color-scheme-1-hover-background)}:host([interactive][design="Set2"]) .ui5-tag-root:active{background-color:var(--ui5-v2-4-0-tag-set2-color-scheme-1-active-background);border-color:var(--ui5-v2-4-0-tag-set2-color-scheme-1-active-border);color:var(--ui5-v2-4-0-tag-set2-color-scheme-1-active-color)}:host([design="Set2"][color-scheme="2"]) .ui5-tag-root{background-color:var(--ui5-v2-4-0-tag-set2-color-scheme-2-background);border-color:var(--ui5-v2-4-0-tag-set2-color-scheme-2-border);color:var(--ui5-v2-4-0-tag-set2-color-scheme-2-color)}:host([design="Set2"][color-scheme="3"]) .ui5-tag-root{background-color:var(--ui5-v2-4-0-tag-set2-color-scheme-3-background);border-color:var(--ui5-v2-4-0-tag-set2-color-scheme-3-border);color:var(--ui5-v2-4-0-tag-set2-color-scheme-3-color)}:host([interactive][design="Set2"][color-scheme="3"]) .ui5-tag-root:hover{background-color:var(--ui5-v2-4-0-tag-set2-color-scheme-3-hover-background)}:host([interactive][design="Set2"][color-scheme="3"]) .ui5-tag-root:active{background-color:var(--ui5-v2-4-0-tag-set2-color-scheme-3-active-background);border-color:var(--ui5-v2-4-0-tag-set2-color-scheme-3-active-border);color:var(--ui5-v2-4-0-tag-set2-color-scheme-3-active-color)}:host([design="Set2"][color-scheme="4"]) .ui5-tag-root{background-color:var(--ui5-v2-4-0-tag-set2-color-scheme-4-background);border-color:var(--ui5-v2-4-0-tag-set2-color-scheme-4-border);color:var(--ui5-v2-4-0-tag-set2-color-scheme-4-color)}:host([interactive][design="Set2"][color-scheme="4"]) .ui5-tag-root:hover{background-color:var(--ui5-v2-4-0-tag-set2-color-scheme-4-hover-background)}:host([interactive][design="Set2"][color-scheme="4"]) .ui5-tag-root:active{background-color:var(--ui5-v2-4-0-tag-set2-color-scheme-4-active-background);border-color:var(--ui5-v2-4-0-tag-set2-color-scheme-4-active-border);color:var(--ui5-v2-4-0-tag-set2-color-scheme-4-active-color)}:host([design="Set2"][color-scheme="5"]) .ui5-tag-root{background-color:var(--ui5-v2-4-0-tag-set2-color-scheme-5-background);border-color:var(--ui5-v2-4-0-tag-set2-color-scheme-5-border);color:var(--ui5-v2-4-0-tag-set2-color-scheme-5-color)}:host([interactive][design="Set2"][color-scheme="5"]) .ui5-tag-root:hover{background-color:var(--ui5-v2-4-0-tag-set2-color-scheme-5-hover-background)}:host([interactive][design="Set2"][color-scheme="5"]) .ui5-tag-root:active{background-color:var(--ui5-v2-4-0-tag-set2-color-scheme-5-active-background);border-color:var(--ui5-v2-4-0-tag-set2-color-scheme-5-active-border);color:var(--ui5-v2-4-0-tag-set2-color-scheme-5-active-color)}:host([design="Set2"][color-scheme="6"]) .ui5-tag-root{background-color:var(--ui5-v2-4-0-tag-set2-color-scheme-6-background);border-color:var(--ui5-v2-4-0-tag-set2-color-scheme-6-border);color:var(--ui5-v2-4-0-tag-set2-color-scheme-6-color)}:host([interactive][design="Set2"][color-scheme="6"]) .ui5-tag-root:hover{background-color:var(--ui5-v2-4-0-tag-set2-color-scheme-6-hover-background)}:host([interactive][design="Set2"][color-scheme="6"]) .ui5-tag-root:active{background-color:var(--ui5-v2-4-0-tag-set2-color-scheme-6-active-background);border-color:var(--ui5-v2-4-0-tag-set2-color-scheme-6-active-border);color:var(--ui5-v2-4-0-tag-set2-color-scheme-6-active-color)}:host([design="Set2"][color-scheme="7"]) .ui5-tag-root{background-color:var(--ui5-v2-4-0-tag-set2-color-scheme-7-background);border-color:var(--ui5-v2-4-0-tag-set2-color-scheme-7-border);color:var(--ui5-v2-4-0-tag-set2-color-scheme-7-color)}:host([interactive][design="Set2"][color-scheme="7"]) .ui5-tag-root:hover{background-color:var(--ui5-v2-4-0-tag-set2-color-scheme-7-hover-background)}:host([interactive][design="Set2"][color-scheme="7"]) .ui5-tag-root:active{background-color:var(--ui5-v2-4-0-tag-set2-color-scheme-7-active-background);border-color:var(--ui5-v2-4-0-tag-set2-color-scheme-7-active-border);color:var(--ui5-v2-4-0-tag-set2-color-scheme-7-active-color)}:host([design="Set2"][color-scheme="8"]) .ui5-tag-root{background-color:var(--ui5-v2-4-0-tag-set2-color-scheme-8-background);border-color:var(--ui5-v2-4-0-tag-set2-color-scheme-8-border);color:var(--ui5-v2-4-0-tag-set2-color-scheme-8-color)}:host([interactive][design="Set2"][color-scheme="8"]) .ui5-tag-root:hover{background-color:var(--ui5-v2-4-0-tag-set2-color-scheme-8-hover-background)}:host([interactive][design="Set2"][color-scheme="8"]) .ui5-tag-root:active{background-color:var(--ui5-v2-4-0-tag-set2-color-scheme-8-active-background);border-color:var(--ui5-v2-4-0-tag-set2-color-scheme-8-active-border);color:var(--ui5-v2-4-0-tag-set2-color-scheme-8-active-color)}:host([design="Set2"][color-scheme="9"]) .ui5-tag-root{background-color:var(--ui5-v2-4-0-tag-set2-color-scheme-9-background);border-color:var(--ui5-v2-4-0-tag-set2-color-scheme-9-border);color:var(--ui5-v2-4-0-tag-set2-color-scheme-9-color)}:host([interactive][design="Set2"][color-scheme="10"]) .ui5-tag-root:hover{background-color:var(--ui5-v2-4-0-tag-set2-color-scheme-10-hover-background)}:host([interactive][design="Set2"][color-scheme="10"]) .ui5-tag-root:active{background-color:var(--ui5-v2-4-0-tag-set2-color-scheme-10-active-background);border-color:var(--ui5-v2-4-0-tag-set2-color-scheme-10-active-border);color:var(--ui5-v2-4-0-tag-set2-color-scheme-10-active-color)}:host([design="Set2"][color-scheme="10"]) .ui5-tag-root{background-color:var(--ui5-v2-4-0-tag-set2-color-scheme-10-background);border-color:var(--ui5-v2-4-0-tag-set2-color-scheme-10-border);color:var(--ui5-v2-4-0-tag-set2-color-scheme-10-color)}:host([interactive][design="Set2"][color-scheme="2"]) .ui5-tag-root:hover{background-color:var(--ui5-v2-4-0-tag-set2-color-scheme-2-hover-background)}:host([interactive][design="Set2"][color-scheme="2"]) .ui5-tag-root:active{background-color:var(--ui5-v2-4-0-tag-set2-color-scheme-2-active-background);border-color:var(--ui5-v2-4-0-tag-set2-color-scheme-2-active-border);color:var(--ui5-v2-4-0-tag-set2-color-scheme-2-active-color)}:host([size="L"]){font-family:var(--sapFontSemiboldDuplexFamily);line-height:var(--_ui5-v2-4-0-tag-height_size_l)}:host([size="L"]) .ui5-tag-root{font-size:var(--_ui5-v2-4-0-tag-font-size_size_l);min-width:var(--_ui5-v2-4-0-tag-min-width_size_l);padding:var(--_ui5-v2-4-0-tag-text_padding_size_l)}:host([size="L"]) [ui5-icon],:host([size="L"]) ::slotted([ui5-icon]){min-width:var(--_ui5-v2-4-0-tag-icon_min_width_size_l);min-height:var(--_ui5-v2-4-0-tag-icon_min_height_size_l);height:var(--_ui5-v2-4-0-tag-icon_height_size_l)}\n'
			},
			dependencies: [u.A]
		}), (0, H.A)("click", {
			bubbles: !0
		})], _e), _e.define();
		var se = r(1081);

		function ce(e, t) {
			(null == t || t > e.length) && (t = e.length);
			for (var r = 0, o = Array(t); r < t; r++) o[r] = e[r];
			return o
		}
		var le = function(e) {
				for (var t = document.createElement(e.tag), r = 0, o = Object.entries(e.props || {}); r < o.length; r++) {
					var i = (_ = o[r], s = 2, function(e) {
							if (Array.isArray(e)) return e
						}(_) || function(e, t) {
							var r = null == e ? null : "undefined" != typeof Symbol && e[Symbol.iterator] || e["@@iterator"];
							if (null != r) {
								var o, i, a, n, _ = [],
									s = !0,
									c = !1;
								try {
									if (a = (r = r.call(e)).next, 0 === t) {
										if (Object(r) !== r) return;
										s = !1
									} else
										for (; !(s = (o = a.call(r)).done) && (_.push(o.value), _.length !== t); s = !0);
								} catch (e) {
									c = !0, i = e
								} finally {
									try {
										if (!s && null != r.return && (n = r.return(), Object(n) !== n)) return
									} finally {
										if (c) throw i
									}
								}
								return _
							}
						}(_, s) || function(e, t) {
							if (e) {
								if ("string" == typeof e) return ce(e, t);
								var r = {}.toString.call(e).slice(8, -1);
								return "Object" === r && e.constructor && (r = e.constructor.name), "Map" === r || "Set" === r ? Array.from(e) : "Arguments" === r || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(r) ? ce(e, t) : void 0
							}
						}(_, s) || function() {
							throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.")
						}()),
						a = i[0],
						n = i[1];
					t.setAttribute(a, n)
				}
				var _, s;
				return e.children.forEach((function(e) {
					"string" == typeof e ? t.appendChild(document.createTextNode(e)) : t.appendChild(le(e))
				})), t
			},
			ue = r(6639);

		function de(e) {
			return de = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function(e) {
				return typeof e
			} : function(e) {
				return e && "function" == typeof Symbol && e.constructor === Symbol && e !== Symbol.prototype ? "symbol" : typeof e
			}, de(e)
		}

		function pe(e, t) {
			var r = Object.keys(e);
			if (Object.getOwnPropertySymbols) {
				var o = Object.getOwnPropertySymbols(e);
				t && (o = o.filter((function(t) {
					return Object.getOwnPropertyDescriptor(e, t).enumerable
				}))), r.push.apply(r, o)
			}
			return r
		}

		function he(e, t, r) {
			return (t = function(e) {
				var t = function(e, t) {
					if ("object" != de(e) || !e) return e;
					var r = e[Symbol.toPrimitive];
					if (void 0 !== r) {
						var o = r.call(e, "string");
						if ("object" != de(o)) return o;
						throw new TypeError("@@toPrimitive must return a primitive value.")
					}
					return String(e)
				}(e);
				return "symbol" == de(t) ? t : t + ""
			}(t)) in e ? Object.defineProperty(e, t, {
				value: r,
				enumerable: !0,
				configurable: !0,
				writable: !0
			}) : e[t] = r, e
		}

		function ve(e, t) {
			(null == t || t > e.length) && (t = e.length);
			for (var r = 0, o = Array(t); r < t; r++) o[r] = e[r];
			return o
		}

		function fe(e) {
			r(4579);
			var t = le((0, ue.Y)("div", {
				id: "zju-helper",
				class: "zju-helper"
			}));

			function o() {
				t.classList.add("visible")
			}

			function i() {
				t.classList.remove("visible")
			}
			var a = le((0, ue.Y)("div", {
				class: "zju-helper-trigger"
			}));
			a.addEventListener("mouseenter", o), t.addEventListener("mouseleave", i), document.body.appendChild(a), document.body.appendChild(t);
			var n = {};
			Object.entries(e).forEach((function(e) {
				var r, o, i = (o = 2, function(e) {
						if (Array.isArray(e)) return e
					}(r = e) || function(e, t) {
						var r = null == e ? null : "undefined" != typeof Symbol && e[Symbol.iterator] || e["@@iterator"];
						if (null != r) {
							var o, i, a, n, _ = [],
								s = !0,
								c = !1;
							try {
								if (a = (r = r.call(e)).next, 0 === t) {
									if (Object(r) !== r) return;
									s = !1
								} else
									for (; !(s = (o = a.call(r)).done) && (_.push(o.value), _.length !== t); s = !0);
							} catch (e) {
								c = !0, i = e
							} finally {
								try {
									if (!s && null != r.return && (n = r.return(), Object(n) !== n)) return
								} finally {
									if (c) throw i
								}
							}
							return _
						}
					}(r, o) || function(e, t) {
						if (e) {
							if ("string" == typeof e) return ve(e, t);
							var r = {}.toString.call(e).slice(8, -1);
							return "Object" === r && e.constructor && (r = e.constructor.name), "Map" === r || "Set" === r ? Array.from(e) : "Arguments" === r || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(r) ? ve(e, t) : void 0
						}
					}(r, o) || function() {
						throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.")
					}()),
					a = i[0],
					_ = i[1];
				n[a] = function() {
					var e = le((0, ue.Y)("ui5-card", {
							id: "zju-helper-plugin-".concat(a),
							class: "zju-helper-plugin zju-helper-plugin-".concat(a),
							children: (0, ue.Y)("ui5-card-header", {
								slot: "header",
								"title-text": _.name,
								"subtitle-text": _.slug
							})
						})),
						r = le((0, ue.Y)("div", {
							class: "zju-helper-plugin-content"
						})),
						o = le((0, ue.Y)("div", {}));
					return r.appendChild(o), e.appendChild(r), t.appendChild(e), new ResizeObserver((function() {
						r.scrollHeight > r.clientHeight ? r.classList.add("has-overflow") : r.classList.remove("has-overflow")
					})).observe(o), o
				}
			}));
			var _ = le((0, ue.Y)("div", {}));

			function s(e) {
				return e.slug.startsWith("builtin-") ? 8 : "学在浙大" === e.namespace ? 4 : "智云课堂" === e.namespace ? 5 : "PTA" === e.namespace ? 6 : 10
			}
			t.appendChild(_);
			var c = (0, se.yA)({
				node: _,
				init: {
					loadedPlugins: []
				},
				view: function(e) {
					var t = e.loadedPlugins;
					return (0, ue.Y)("ui5-card", {
						children: (0, ue.F)("div", {
							class: "zju-helper-panel-header",
							children: [(0, ue.Y)("div", {
								class: "zju-helper-panel-header-title",
								children: "学在浙大/智云课堂小助手"
							}), (0, ue.F)("div", {
								class: "zju-helper-loaded-plugins-slogen",
								children: ["当前共加载 ", t.length, " 个插件"]
							}), (0, ue.Y)("div", {
								class: "zju-helper-loaded-plugins",
								children: t.map((function(e) {
									return (0, ue.Y)("a", {
										class: "zju-helper-loaded-plugin-tag",
										target: "_blank",
										href: "https://github.com/memset0/Learning-at-ZJU-Helper/tree/master/src/plugins/".concat(e.slug),
										children: (0, ue.Y)("ui5-tag", {
											design: "Set2",
											"color-scheme": s(e),
											children: e.slug
										})
									})
								}))
							})]
						})
					})
				}
			});
			return {
				element: t,
				show: o,
				hide: i,
				toggle: function() {
					t.classList.toggle("visible")
				},
				pluginInitializers: n,
				pushLoadedPlugin: function(e) {
					c((function(t) {
						return t.loadedPlugins.push(e),
							function(e) {
								for (var t = 1; t < arguments.length; t++) {
									var r = null != arguments[t] ? arguments[t] : {};
									t % 2 ? pe(Object(r), !0).forEach((function(t) {
										he(e, t, r[t])
									})) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(r)) : pe(Object(r)).forEach((function(t) {
										Object.defineProperty(e, t, Object.getOwnPropertyDescriptor(r, t))
									}))
								}
								return e
							}({}, t)
					}))
				}
			}
		}
		var me = r(3893),
			ge = r(2266),
			be = r(4205);

		function ye(e) {
			return ye = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function(e) {
				return typeof e
			} : function(e) {
				return e && "function" == typeof Symbol && e.constructor === Symbol && e !== Symbol.prototype ? "symbol" : typeof e
			}, ye(e)
		}

		function Ce() {
			Ce = function() {
				return t
			};
			var e, t = {},
				r = Object.prototype,
				o = r.hasOwnProperty,
				i = Object.defineProperty || function(e, t, r) {
					e[t] = r.value
				},
				a = "function" == typeof Symbol ? Symbol : {},
				n = a.iterator || "@@iterator",
				_ = a.asyncIterator || "@@asyncIterator",
				s = a.toStringTag || "@@toStringTag";

			function c(e, t, r) {
				return Object.defineProperty(e, t, {
					value: r,
					enumerable: !0,
					configurable: !0,
					writable: !0
				}), e[t]
			}
			try {
				c({}, "")
			} catch (e) {
				c = function(e, t, r) {
					return e[t] = r
				}
			}

			function l(e, t, r, o) {
				var a = t && t.prototype instanceof m ? t : m,
					n = Object.create(a.prototype),
					_ = new q(o || []);
				return i(n, "_invoke", {
					value: B(e, r, _)
				}), n
			}

			function u(e, t, r) {
				try {
					return {
						type: "normal",
						arg: e.call(t, r)
					}
				} catch (e) {
					return {
						type: "throw",
						arg: e
					}
				}
			}
			t.wrap = l;
			var d = "suspendedStart",
				p = "suspendedYield",
				h = "executing",
				v = "completed",
				f = {};

			function m() {}

			function g() {}

			function b() {}
			var y = {};
			c(y, n, (function() {
				return this
			}));
			var C = Object.getPrototypeOf,
				w = C && C(C(L([])));
			w && w !== r && o.call(w, n) && (y = w);
			var x = b.prototype = m.prototype = Object.create(y);

			function k(e) {
				["next", "throw", "return"].forEach((function(t) {
					c(e, t, (function(e) {
						return this._invoke(t, e)
					}))
				}))
			}

			function S(e, t) {
				function r(i, a, n, _) {
					var s = u(e[i], e, a);
					if ("throw" !== s.type) {
						var c = s.arg,
							l = c.value;
						return l && "object" == ye(l) && o.call(l, "__await") ? t.resolve(l.__await).then((function(e) {
							r("next", e, n, _)
						}), (function(e) {
							r("throw", e, n, _)
						})) : t.resolve(l).then((function(e) {
							c.value = e, n(c)
						}), (function(e) {
							return r("throw", e, n, _)
						}))
					}
					_(s.arg)
				}
				var a;
				i(this, "_invoke", {
					value: function(e, o) {
						function i() {
							return new t((function(t, i) {
								r(e, o, t, i)
							}))
						}
						return a = a ? a.then(i, i) : i()
					}
				})
			}

			function B(t, r, o) {
				var i = d;
				return function(a, n) {
					if (i === h) throw Error("Generator is already running");
					if (i === v) {
						if ("throw" === a) throw n;
						return {
							value: e,
							done: !0
						}
					}
					for (o.method = a, o.arg = n;;) {
						var _ = o.delegate;
						if (_) {
							var s = A(_, o);
							if (s) {
								if (s === f) continue;
								return s
							}
						}
						if ("next" === o.method) o.sent = o._sent = o.arg;
						else if ("throw" === o.method) {
							if (i === d) throw i = v, o.arg;
							o.dispatchException(o.arg)
						} else "return" === o.method && o.abrupt("return", o.arg);
						i = h;
						var c = u(t, r, o);
						if ("normal" === c.type) {
							if (i = o.done ? v : p, c.arg === f) continue;
							return {
								value: c.arg,
								done: o.done
							}
						}
						"throw" === c.type && (i = v, o.method = "throw", o.arg = c.arg)
					}
				}
			}

			function A(t, r) {
				var o = r.method,
					i = t.iterator[o];
				if (i === e) return r.delegate = null, "throw" === o && t.iterator.return && (r.method = "return", r.arg = e, A(t, r), "throw" === r.method) || "return" !== o && (r.method = "throw", r.arg = new TypeError("The iterator does not provide a '" + o + "' method")), f;
				var a = u(i, t.iterator, r.arg);
				if ("throw" === a.type) return r.method = "throw", r.arg = a.arg, r.delegate = null, f;
				var n = a.arg;
				return n ? n.done ? (r[t.resultName] = n.value, r.next = t.nextLoc, "return" !== r.method && (r.method = "next", r.arg = e), r.delegate = null, f) : n : (r.method = "throw", r.arg = new TypeError("iterator result is not an object"), r.delegate = null, f)
			}

			function T(e) {
				var t = {
					tryLoc: e[0]
				};
				1 in e && (t.catchLoc = e[1]), 2 in e && (t.finallyLoc = e[2], t.afterLoc = e[3]), this.tryEntries.push(t)
			}

			function I(e) {
				var t = e.completion || {};
				t.type = "normal", delete t.arg, e.completion = t
			}

			function q(e) {
				this.tryEntries = [{
					tryLoc: "root"
				}], e.forEach(T, this), this.reset(!0)
			}

			function L(t) {
				if (t || "" === t) {
					var r = t[n];
					if (r) return r.call(t);
					if ("function" == typeof t.next) return t;
					if (!isNaN(t.length)) {
						var i = -1,
							a = function r() {
								for (; ++i < t.length;)
									if (o.call(t, i)) return r.value = t[i], r.done = !1, r;
								return r.value = e, r.done = !0, r
							};
						return a.next = a
					}
				}
				throw new TypeError(ye(t) + " is not iterable")
			}
			return g.prototype = b, i(x, "constructor", {
				value: b,
				configurable: !0
			}), i(b, "constructor", {
				value: g,
				configurable: !0
			}), g.displayName = c(b, s, "GeneratorFunction"), t.isGeneratorFunction = function(e) {
				var t = "function" == typeof e && e.constructor;
				return !!t && (t === g || "GeneratorFunction" === (t.displayName || t.name))
			}, t.mark = function(e) {
				return Object.setPrototypeOf ? Object.setPrototypeOf(e, b) : (e.__proto__ = b, c(e, s, "GeneratorFunction")), e.prototype = Object.create(x), e
			}, t.awrap = function(e) {
				return {
					__await: e
				}
			}, k(S.prototype), c(S.prototype, _, (function() {
				return this
			})), t.AsyncIterator = S, t.async = function(e, r, o, i, a) {
				void 0 === a && (a = Promise);
				var n = new S(l(e, r, o, i), a);
				return t.isGeneratorFunction(r) ? n : n.next().then((function(e) {
					return e.done ? e.value : n.next()
				}))
			}, k(x), c(x, s, "Generator"), c(x, n, (function() {
				return this
			})), c(x, "toString", (function() {
				return "[object Generator]"
			})), t.keys = function(e) {
				var t = Object(e),
					r = [];
				for (var o in t) r.push(o);
				return r.reverse(),
					function e() {
						for (; r.length;) {
							var o = r.pop();
							if (o in t) return e.value = o, e.done = !1, e
						}
						return e.done = !0, e
					}
			}, t.values = L, q.prototype = {
				constructor: q,
				reset: function(t) {
					if (this.prev = 0, this.next = 0, this.sent = this._sent = e, this.done = !1, this.delegate = null, this.method = "next", this.arg = e, this.tryEntries.forEach(I), !t)
						for (var r in this) "t" === r.charAt(0) && o.call(this, r) && !isNaN(+r.slice(1)) && (this[r] = e)
				},
				stop: function() {
					this.done = !0;
					var e = this.tryEntries[0].completion;
					if ("throw" === e.type) throw e.arg;
					return this.rval
				},
				dispatchException: function(t) {
					if (this.done) throw t;
					var r = this;

					function i(o, i) {
						return _.type = "throw", _.arg = t, r.next = o, i && (r.method = "next", r.arg = e), !!i
					}
					for (var a = this.tryEntries.length - 1; a >= 0; --a) {
						var n = this.tryEntries[a],
							_ = n.completion;
						if ("root" === n.tryLoc) return i("end");
						if (n.tryLoc <= this.prev) {
							var s = o.call(n, "catchLoc"),
								c = o.call(n, "finallyLoc");
							if (s && c) {
								if (this.prev < n.catchLoc) return i(n.catchLoc, !0);
								if (this.prev < n.finallyLoc) return i(n.finallyLoc)
							} else if (s) {
								if (this.prev < n.catchLoc) return i(n.catchLoc, !0)
							} else {
								if (!c) throw Error("try statement without catch or finally");
								if (this.prev < n.finallyLoc) return i(n.finallyLoc)
							}
						}
					}
				},
				abrupt: function(e, t) {
					for (var r = this.tryEntries.length - 1; r >= 0; --r) {
						var i = this.tryEntries[r];
						if (i.tryLoc <= this.prev && o.call(i, "finallyLoc") && this.prev < i.finallyLoc) {
							var a = i;
							break
						}
					}
					a && ("break" === e || "continue" === e) && a.tryLoc <= t && t <= a.finallyLoc && (a = null);
					var n = a ? a.completion : {};
					return n.type = e, n.arg = t, a ? (this.method = "next", this.next = a.finallyLoc, f) : this.complete(n)
				},
				complete: function(e, t) {
					if ("throw" === e.type) throw e.arg;
					return "break" === e.type || "continue" === e.type ? this.next = e.arg : "return" === e.type ? (this.rval = this.arg = e.arg, this.method = "return", this.next = "end") : "normal" === e.type && t && (this.next = t), f
				},
				finish: function(e) {
					for (var t = this.tryEntries.length - 1; t >= 0; --t) {
						var r = this.tryEntries[t];
						if (r.finallyLoc === e) return this.complete(r.completion, r.afterLoc), I(r), f
					}
				},
				catch: function(e) {
					for (var t = this.tryEntries.length - 1; t >= 0; --t) {
						var r = this.tryEntries[t];
						if (r.tryLoc === e) {
							var o = r.completion;
							if ("throw" === o.type) {
								var i = o.arg;
								I(r)
							}
							return i
						}
					}
					throw Error("illegal catch attempt")
				},
				delegateYield: function(t, r, o) {
					return this.delegate = {
						iterator: L(t),
						resultName: r,
						nextLoc: o
					}, "next" === this.method && (this.arg = e), f
				}
			}, t
		}

		function we(e, t) {
			var r = "undefined" != typeof Symbol && e[Symbol.iterator] || e["@@iterator"];
			if (!r) {
				if (Array.isArray(e) || (r = function(e, t) {
						if (e) {
							if ("string" == typeof e) return xe(e, t);
							var r = {}.toString.call(e).slice(8, -1);
							return "Object" === r && e.constructor && (r = e.constructor.name), "Map" === r || "Set" === r ? Array.from(e) : "Arguments" === r || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(r) ? xe(e, t) : void 0
						}
					}(e)) || t && e && "number" == typeof e.length) {
					r && (e = r);
					var o = 0,
						i = function() {};
					return {
						s: i,
						n: function() {
							return o >= e.length ? {
								done: !0
							} : {
								done: !1,
								value: e[o++]
							}
						},
						e: function(e) {
							throw e
						},
						f: i
					}
				}
				throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.")
			}
			var a, n = !0,
				_ = !1;
			return {
				s: function() {
					r = r.call(e)
				},
				n: function() {
					var e = r.next();
					return n = e.done, e
				},
				e: function(e) {
					_ = !0, a = e
				},
				f: function() {
					try {
						n || null == r.return || r.return()
					} finally {
						if (_) throw a
					}
				}
			}
		}

		function xe(e, t) {
			(null == t || t > e.length) && (t = e.length);
			for (var r = 0, o = Array(t); r < t; r++) o[r] = e[r];
			return o
		}

		function ke(e, t) {
			var r = Object.keys(e);
			if (Object.getOwnPropertySymbols) {
				var o = Object.getOwnPropertySymbols(e);
				t && (o = o.filter((function(t) {
					return Object.getOwnPropertyDescriptor(e, t).enumerable
				}))), r.push.apply(r, o)
			}
			return r
		}

		function Se(e) {
			for (var t = 1; t < arguments.length; t++) {
				var r = null != arguments[t] ? arguments[t] : {};
				t % 2 ? ke(Object(r), !0).forEach((function(t) {
					Be(e, t, r[t])
				})) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(r)) : ke(Object(r)).forEach((function(t) {
					Object.defineProperty(e, t, Object.getOwnPropertyDescriptor(r, t))
				}))
			}
			return e
		}

		function Be(e, t, r) {
			return (t = qe(t)) in e ? Object.defineProperty(e, t, {
				value: r,
				enumerable: !0,
				configurable: !0,
				writable: !0
			}) : e[t] = r, e
		}

		function Ae(e, t, r, o, i, a, n) {
			try {
				var _ = e[a](n),
					s = _.value
			} catch (e) {
				return void r(e)
			}
			_.done ? t(s) : Promise.resolve(s).then(o, i)
		}

		function Te(e) {
			return function() {
				var t = this,
					r = arguments;
				return new Promise((function(o, i) {
					var a = e.apply(t, r);

					function n(e) {
						Ae(a, o, i, n, _, "next", e)
					}

					function _(e) {
						Ae(a, o, i, n, _, "throw", e)
					}
					n(void 0)
				}))
			}
		}

		function Ie(e, t) {
			for (var r = 0; r < t.length; r++) {
				var o = t[r];
				o.enumerable = o.enumerable || !1, o.configurable = !0, "value" in o && (o.writable = !0), Object.defineProperty(e, qe(o.key), o)
			}
		}

		function qe(e) {
			var t = function(e, t) {
				if ("object" != ye(e) || !e) return e;
				var r = e[Symbol.toPrimitive];
				if (void 0 !== r) {
					var o = r.call(e, "string");
					if ("object" != ye(o)) return o;
					throw new TypeError("@@toPrimitive must return a primitive value.")
				}
				return String(e)
			}(e);
			return "symbol" == ye(t) ? t : t + ""
		}
		var Le = new(function() {
			return e = function e() {
				var t = this;
				! function(e, t) {
					if (!(e instanceof t)) throw new TypeError("Cannot call a class as a function")
				}(this, e), this.plugins = {};
				var o = r(1342);
				o.keys().forEach((function(e) {
					var r = e.slice(2, -9);
					r.startsWith("example-") || (t.plugins[r] = o(e), t.plugins[r].slug = r)
				})), this.loadedScripts = []
			}, t = [{
				key: "getNamespace",
				value: function() {
					var e = location.hostname;
					return "courses.zju.edu.cn" === e ? "学在浙大" : "classroom.zju.edu.cn" === e || "livingroom.cmc.zju.edu.cn" === e || "onlineroom.cmc.zju.edu.cn" === e || "interactivemeta.cmc.zju.edu.cn" === e ? "智云课堂" : "pintia.cn" === e ? "PTA" : null
				}
			}, {
				key: "loadScript",
				value: function(e) {
					if (!this.loadedScripts.includes(e)) {
						this.loadedScripts.push(e), me.Ay.debug(e, GM_getResourceText);
						var t = GM_getResourceText(e);
						null === t ? me.Ay.error("脚本 ".concat(e, " 加载失败")) : (me.Ay.debug(t), unsafeWindow.eval(t))
					}
				}
			}, {
				key: "load",
				value: (o = Te(Ce().mark((function e() {
					var t, r, o, i, a, n, _, s, c, l, u, d, p, h = this;
					return Ce().wrap((function(e) {
						for (;;) switch (e.prev = e.next) {
							case 0:
								t = fe(this.plugins), r = {
									panel: t,
									namespace: this.getNamespace(),
									clipboard: {
										copy: be.lW
									},
									query: (0, be.mr)(location.search),
									window: unsafeWindow,
									document: unsafeWindow.document,
									location: unsafeWindow.location,
									env: {
										isVideoPage: "classroom.zju.edu.cn" === location.host && "/livingroom" === location.pathname || !("interactivemeta.cmc.zju.edu.cn" !== location.host || "/" !== location.pathname || !location.hash.startsWith("#/replay?"))
									},
									loadScript: function(e) {
										return h.loadScript(e)
									},
									extendContext: function(e) {
										Object.assign(r, e)
									}
								}, o = function() {
									for (var e in h.plugins)
										if (!h.plugins[e].loaded) return !1;
									return !0
								}, me.Ay.debug("开始加载插件", this.plugins), i = 0;
							case 5:
								e.t0 = Ce().keys(this.plugins);
							case 6:
								if ((e.t1 = e.t0()).done) {
									e.next = 70;
									break
								}
								if (a = e.t1.value, (n = this.plugins[a]).loaded) {
									e.next = 68;
									break
								}
								if (_ = Se(Se({}, r), {}, {
										logger: me.Ay.extends(n.slug),
										panelInitialize: t.pluginInitializers[n.slug]
									}), !(n.required && n.required instanceof Array && n.required.length > 0)) {
									e.next = 45;
									break
								}
								s = "ok", c = we(n.required), e.prev = 14, c.s();
							case 16:
								if ((l = c.n()).done) {
									e.next = 28;
									break
								}
								if (u = l.value, !this.plugins[u].skipped) {
									e.next = 23;
									break
								}
								return s = "skip", e.abrupt("break", 28);
							case 23:
								if (this.plugins[u].loaded) {
									e.next = 26;
									break
								}
								return s = "wait", e.abrupt("break", 28);
							case 26:
								e.next = 16;
								break;
							case 28:
								e.next = 33;
								break;
							case 30:
								e.prev = 30, e.t2 = e.catch(14), c.e(e.t2);
							case 33:
								return e.prev = 33, c.f(), e.finish(33);
							case 36:
								if ("skip" !== s) {
									e.next = 43;
									break
								}
								return n.loaded = !0, n.skipped = !0, me.Ay.debug("跳过加载 ".concat(n.slug, " 插件，因为前置插件被跳过")), e.abrupt("continue", 6);
							case 43:
								if ("wait" !== s) {
									e.next = 45;
									break
								}
								return e.abrupt("continue", 6);
							case 45:
								if (!(d = !1) && n.namespace && (n.namespace instanceof Array ? n.namespace.includes(r.namespace) || (d = !0) : n.namespace !== r.namespace && (d = !0)), !d && n.route && !1 === (0, ge.Di)(n.route, location.pathname) && (d = !0), d || !(n.skip instanceof Function)) {
									e.next = 53;
									break
								}
								return e.next = 51, n.skip(_);
							case 51:
								if (!e.sent) {
									e.next = 53;
									break
								}
								d = !0;
							case 53:
								if (!d) {
									e.next = 58;
									break
								}
								return n.loaded = !0, n.skipped = !0, me.Ay.debug("跳过加载 ".concat(n.slug, " 插件")), e.abrupt("continue", 6);
							case 58:
								if (!(n.check instanceof Function)) {
									e.next = 63;
									break
								}
								return e.next = 61, n.check(_);
							case 61:
								if (e.sent) {
									e.next = 63;
									break
								}
								return e.abrupt("continue", 6);
							case 63:
								return n.route && (p = (0, ge.Di)(n.route, location.pathname), _.params = p), e.next = 66, n.load(_);
							case 66:
								n.loaded = !0, t.pushLoadedPlugin({
									slug: n.slug,
									name: n.name,
									namespace: n.namespace ? r.namespace : null,
									description: n.description
								});
							case 68:
								e.next = 6;
								break;
							case 70:
								return e.next = 72, (0, ge.yy)(100);
							case 72:
								if (!o() && ++i < 129) {
									e.next = 5;
									break
								}
							case 73:
								o() ? me.Ay.info("插件加载完成!") : me.Ay.error("插件加载失败，还有以下插件未加载:", Object.keys(this.plugins).filter((function(e) {
									return !h.plugins[e].loaded
								}))), t.element.classList.add("zju-helper-loaded");
							case 75:
							case "end":
								return e.stop()
						}
					}), e, this, [
						[14, 30, 33, 36]
					])
				}))), function() {
					return o.apply(this, arguments)
				})
			}, {
				key: "safe_load",
				value: function() {
					Te(Ce().mark((function e() {
						return Ce().wrap((function(e) {
							for (;;) switch (e.prev = e.next) {
								case 0:
									return e.prev = 0, e.next = 3, Le.load();
								case 3:
									e.next = 9;
									break;
								case 5:
									throw e.prev = 5, e.t0 = e.catch(0), me.Ay.error(e.t0), e.t0;
								case 9:
								case "end":
									return e.stop()
							}
						}), e, null, [
							[0, 5]
						])
					})))()
				}
			}], t && Ie(e.prototype, t), Object.defineProperty(e, "prototype", {
				writable: !1
			}), e;
			var e, t, o
		}());
		Le.safe_load()
	})()
})();