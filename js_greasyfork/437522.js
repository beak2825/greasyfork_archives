// ==UserScript==
// @name         Gleam Timer
// @version      1.2
// @author       Saulios
// @description  No more waiting for the timer
// @icon         https://i.imgur.com/jsHPY7E.png
// @homepage     https://github.com/ColinLabDev/gleam_timer/
// @supportURL   https://github.com/ColinLabDev/gleam_timer/issues
// @match        https://gleam.io/*
// @grant        none
// @namespace https://greasyfork.org/users/843279
// @downloadURL https://update.greasyfork.org/scripts/437522/Gleam%20Timer.user.js
// @updateURL https://update.greasyfork.org/scripts/437522/Gleam%20Timer.meta.js
// ==/UserScript==

// This can be used to speed up the timer on Gleam.io tasks. You can instantly complete any task related to time without waiting.
// There will be a circle in the top left corner of the page with the text x1. You can click on it or press Control + 1 on your keyboard.
// A pop-up message will appear. Here you can set how fast the time for the tasks should go.
// The default setting is 1, which is the normal time. Recommended time multiplier: 1000 (1000 times faster)

// Updated: November 14, 2021


! function (t, e) {
	"object" == typeof exports && "undefined" != typeof module ? module.exports = e() : "function" == typeof define && define.amd ? define(e) : (t = "undefined" != typeof globalThis ? globalThis : t || self).$hookTimer = e()
}(this, (function () {
	"use strict";

	function t(t, e) {
		if (!(t instanceof e)) throw new TypeError("Cannot call a class as a function")
	}

	function e(t, e) {
		for (var n = 0; n < e.length; n++) {
			var r = e[n];
			r.enumerable = r.enumerable || !1, r.configurable = !0, "value" in r && (r.writable = !0), Object.defineProperty(t, r.key, r)
		}
	}

	function n(t, n, r) {
		return n && e(t.prototype, n), r && e(t, r), t
	}

	function r(t) {
		if (void 0 === t) throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
		return t
	}

	function i(t, e) {
		return (i = Object.setPrototypeOf || function (t, e) {
			return t.__proto__ = e, t
		})(t, e)
	}

	function o(t, e) {
		if ("function" != typeof e && null !== e) throw new TypeError("Super expression must either be null or a function");
		t.prototype = Object.create(e && e.prototype, {
			constructor: {
				value: t,
				writable: !0,
				configurable: !0
			}
		}), e && i(t, e)
	}

	function a(t) {
		return (a = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (t) {
			return typeof t
		} : function (t) {
			return t && "function" == typeof Symbol && t.constructor === Symbol && t !== Symbol.prototype ? "symbol" : typeof t
		})(t)
	}

	function u(t, e) {
		return !e || "object" !== a(e) && "function" != typeof e ? r(t) : e
	}

	function c(t) {
		return (c = Object.setPrototypeOf ? Object.getPrototypeOf : function (t) {
			return t.__proto__ || Object.getPrototypeOf(t)
		})(t)
	}

	function l(t, e, n) {
		return e in t ? Object.defineProperty(t, e, {
			value: n,
			enumerable: !0,
			configurable: !0,
			writable: !0
		}) : t[e] = n, t
	}
	var s, f, h, d = 1e3;

	function p() {
		return d++
	}

	function y() {
		return null == s && (s = "undefined" == typeof unsafeWindow ? window : unsafeWindow), s
	}

	function v() {
		var t = y().parent !== y();
		try {
			t = t && "FRAMESET" !== y().parent.document.body.tagName
		} catch (t) {}
		return t
	}

	function g(t) {
		var e = arguments.length > 1 && void 0 !== arguments[1] ? arguments[1] : 1 / 0,
			n = Array.prototype.flat || function () {
				var t = arguments.length > 0 && void 0 !== arguments[0] ? arguments[0] : 1 / 0;
				if (t < 1) return this;
				var e = [],
					r = t - 1;
				return this.forEach((function (t) {
					t instanceof Array ? e = e.concat(n.call(t, r)) : e.push(t)
				})), e
			};
		return n.call(t, e)
	}

	function m(t, e) {
		(null == e || e > t.length) && (e = t.length);
		for (var n = 0, r = new Array(e); n < e; n++) r[n] = t[n];
		return r
	}

	function b(t, e) {
		if (t) {
			if ("string" == typeof t) return m(t, e);
			var n = Object.prototype.toString.call(t).slice(8, -1);
			return "Object" === n && t.constructor && (n = t.constructor.name), "Map" === n || "Set" === n ? Array.from(t) : "Arguments" === n || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n) ? m(t, e) : void 0
		}
	}

	function w(t, e) {
		return function (t) {
			if (Array.isArray(t)) return t
		}(t) || function (t, e) {
			var n = t && ("undefined" != typeof Symbol && t[Symbol.iterator] || t["@@iterator"]);
			if (null != n) {
				var r, i, o = [],
					a = !0,
					u = !1;
				try {
					for (n = n.call(t); !(a = (r = n.next()).done) && (o.push(r.value), !e || o.length !== e); a = !0);
				} catch (t) {
					u = !0, i = t
				} finally {
					try {
						a || null == n.return || n.return()
					} finally {
						if (u) throw i
					}
				}
				return o
			}
		}(t, e) || b(t, e) || function () {
			throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.")
		}()
	}

	function k(t, e) {
		var n = "undefined" != typeof Symbol && t[Symbol.iterator] || t["@@iterator"];
		if (!n) {
			if (Array.isArray(t) || (n = function (t, e) {
					if (!t) return;
					if ("string" == typeof t) return x(t, e);
					var n = Object.prototype.toString.call(t).slice(8, -1);
					"Object" === n && t.constructor && (n = t.constructor.name);
					if ("Map" === n || "Set" === n) return Array.from(t);
					if ("Arguments" === n || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return x(t, e)
				}(t)) || e && t && "number" == typeof t.length) {
				n && (t = n);
				var r = 0,
					i = function () {};
				return {
					s: i,
					n: function () {
						return r >= t.length ? {
							done: !0
						} : {
							done: !1,
							value: t[r++]
						}
					},
					e: function (t) {
						throw t
					},
					f: i
				}
			}
			throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.")
		}
		var o, a = !0,
			u = !1;
		return {
			s: function () {
				n = n.call(t)
			},
			n: function () {
				var t = n.next();
				return a = t.done, t
			},
			e: function (t) {
				u = !0, o = t
			},
			f: function () {
				try {
					a || null == n.return || n.return()
				} finally {
					if (u) throw o
				}
			}
		}
	}

	function x(t, e) {
		(null == e || e > t.length) && (e = t.length);
		for (var n = 0, r = new Array(e); n < e; n++) r[n] = t[n];
		return r
	}

	function O() {
		return null == h && (h = "undefined" == typeof unsafeWindow ? window : unsafeWindow), h
	}

	function R() {
		var t = O().parent !== O();
		try {
			t = t && "FRAMESET" !== O().parent.document.body.tagName
		} catch (t) {}
		return t
	}! function (t) {
		t.BOOLEAN = "boolean", t.STRING = "string", t.NUMBER = "number", t.SHORTCUT = "shortcut", t.LONG_STRING = "long_string", t.DATE = "date", t.COLOR = "color", t.ARRAY = "array", t.PICKLIST = "picklist", t.DUELING_PICKLIST = "dueling_picklist"
	}(f || (f = {}));
	var M = "__hooks_load_module",
		_ = Object.getOwnPropertyNames.bind(Object),
		A = Object.getPrototypeOf.bind(Object);

	function S(t) {
		var e, n = {},
			r = k(_(t));
		try {
			for (r.s(); !(e = r.n()).done;) {
				var i = e.value;
				n[i] = t[i]
			}
		} catch (t) {
			r.e(t)
		} finally {
			r.f()
		}
		return n
	}
	var I = [[Array.prototype], [Object, !1]].map((function (t) {
		var e = w(t, 1)[0];
		return [e, S(e)]
	}));

	function C(t) {
		var e, n = k(I);
		try {
			for (n.s(); !(e = n.n()).done;) {
				var r = w(e.value, 2),
					i = r[0],
					o = r[1];
				if (t === i) return o
			}
		} catch (t) {
			n.e(t)
		} finally {
			n.f()
		}
		return t
	}

	function T(t, e) {
		return function (t, e) {
			var n = C(arguments.length > 2 && void 0 !== arguments[2] && !arguments[2] ? t : A(t)),
				r = n[e];
			return "function" == typeof r ? r.bind(t) : n[e]
		}(e.conditions || [], "reduce")((function (e, n) {
			return e || Object.entries(n).every((function (e) {
				var n = w(e, 2),
					r = n[0],
					i = n[1];
				return t[r] === i
			}))
		}), !1)
	}
	var E = window,
		j = new Proxy({}, {
			get: function (t, e) {
				var n = ["GM", e].join("_");
				return E[n] ? E[n] : E.GM && E.GM[e] ? E.GM[e] : void 0
			}
		}),
		D = function () {
			if (!R()) {
				for (var t = arguments.length, e = new Array(t), n = 0; n < t; n++) e[n] = arguments[n];
				var r;
				if (e.unshift("[TimerHook]"), "function" == typeof j.log) j.log(e.join(" "));
				else(r = console).log.apply(r, e)
			}
		},
		P = function () {
			if (!R()) {
				for (var t, e = arguments.length, n = new Array(e), r = 0; r < e; r++) n[r] = arguments[r];
				n.unshift("[TimerHook]"), (t = console).warn.apply(t, n)
			}
		},
		N = function () {
			function e() {
				t(this, e), l(this, "host", void 0), l(this, "isActive", !1), l(this, "isMountHost", !1)
			}
			return n(e, [{
				key: "mountHost",
				value: function (t) {
					this.host = t, this.isMountHost = !0, this.onMounted()
				}
			}, {
				key: "activate",
				value: function () {
					this.isActive = !0, this.init()
				}
			}, {
				key: "deactivate",
				value: function () {
					this.isActive = !1, this.onDestroy()
				}
			}, {
				key: "moduleName",
				get: function () {}
			}, {
				key: "priority",
				get: function () {
					return 50
				}
			}, {
				key: "autoActivate",
				get: function () {
					return !0
				}
			}, {
				key: "isCoreModule",
				get: function () {
					return !1
				}
			}, {
				key: "isOnlyOuterIframe",
				get: function () {
					return !1
				}
			}, {
				key: "getDependencyModule",
				value: function (t) {
					if (null != this.host) {
						var e = this.host.getModule(t);
						return e && e.moduleIdentityName ? e : void 0
					}
				}
			}, {
				key: "init",
				value: function () {}
			}, {
				key: "onMounted",
				value: function () {}
			}, {
				key: "onDestroy",
				value: function () {}
			}, {
				key: "declareConfigs",
				value: function () {
					return []
				}
			}, {
				key: "setConfig",
				value: function (t, e) {
					var n = this.getDependencyModule("configs");
					n && n.available() || P("Config module not found, can't set configs values."), n.setValue(this.moduleIdentityName, t, e)
				}
			}, {
				key: "getConfig",
				value: function (t) {
					var e, n = this.getDependencyModule("configs"),
						r = (this.declareConfigs().find((function (e) {
							return e.key === t
						})) || {}).default;
					return n && n.available() && null !== (e = n.getValue(this.moduleIdentityName, t)) && void 0 !== e ? e : r
				}
			}, {
				key: "window",
				get: function () {
					return this.host ? this.host.getWindow() : O()
				}
			}, {
				key: "document",
				get: function () {
					return this.window.document
				}
			}]), e
		}();

	function B(t, e, n) {
		return (B = "undefined" != typeof Reflect && Reflect.get ? Reflect.get : function (t, e, n) {
			var r = function (t, e) {
				for (; !Object.prototype.hasOwnProperty.call(t, e) && null !== (t = c(t)););
				return t
			}(t, e);
			if (r) {
				var i = Object.getOwnPropertyDescriptor(r, e);
				return i.get ? i.get.call(n) : i.value
			}
		})(t, e, n || t)
	}

	function L(t) {
		var e = function () {
			if ("undefined" == typeof Reflect || !Reflect.construct) return !1;
			if (Reflect.construct.sham) return !1;
			if ("function" == typeof Proxy) return !0;
			try {
				return Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], (function () {}))), !0
			} catch (t) {
				return !1
			}
		}();
		return function () {
			var n, r = c(t);
			if (e) {
				var i = c(this).constructor;
				n = Reflect.construct(r, arguments, i)
			} else n = r.apply(this, arguments);
			return u(this, n)
		}
	}
	var U = function (e) {
		o(a, e);
		var i = L(a);

		function a() {
			var e;
			t(this, a);
			for (var n = arguments.length, o = new Array(n), u = 0; u < n; u++) o[u] = arguments[u];
			return l(r(e = i.call.apply(i, [this].concat(o))), "rate", 1), l(r(e), "host", void 0), e
		}
		return n(a, [{
			key: "onRateChange",
			value: function (t) {
				this.rate = t
			}
		}, {
			key: "mountHost",
			value: function (t) {
				B(c(a.prototype), "mountHost", this).call(this, t), this.rate = t.rate
			}
		}]), a
	}(N);

	function V(t) {
		var e = function () {
			if ("undefined" == typeof Reflect || !Reflect.construct) return !1;
			if (Reflect.construct.sham) return !1;
			if ("function" == typeof Proxy) return !0;
			try {
				return Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], (function () {}))), !0
			} catch (t) {
				return !1
			}
		}();
		return function () {
			var n, r = c(t);
			if (e) {
				var i = c(this).constructor;
				n = Reflect.construct(r, arguments, i)
			} else n = r.apply(this, arguments);
			return u(this, n)
		}
	}
	var H = function (e) {
		o(a, e);
		var i = V(a);

		function a() {
			var e;
			t(this, a);
			for (var n = arguments.length, o = new Array(n), u = 0; u < n; u++) o[u] = arguments[u];
			return l(r(e = i.call.apply(i, [this].concat(o))), "isDOMLoaded", !1), l(r(e), "waitDomLoadedCallback", void 0), e
		}
		return n(a, [{
			key: "onMounted",
			value: function () {
				var t = this;
				B(c(a.prototype), "onMounted", this).call(this), this.document.addEventListener("readystatechange", (function () {
					"interactive" !== t.document.readyState && "complete" !== t.document.readyState || (t.isDOMLoaded = !0, "function" == typeof t.waitDomLoadedCallback && t.waitDomLoadedCallback(void 0))
				}))
			}
		}, {
			key: "waitDomLoaded",
			value: function () {
				var t, e, n, r = this;
				return this.isDOMLoaded || null !== (t = this.document) && void 0 !== t && null !== (e = t.body) && void 0 !== e && null !== (n = e.childNodes) && void 0 !== n && n.length ? Promise.resolve() : new Promise((function (t) {
					r.waitDomLoadedCallback = t
				}))
			}
		}, {
			key: "applyStyle",
			value: function (t) {
				var e = this.style(),
					n = this.document.createElement("style");
				if (n.setAttribute("type", "text/css"), n.styleSheet) n.styleSheet.cssText = e;
				else {
					var r = this.document.createTextNode(e);
					n.appendChild(r)
				}
				t.appendChild(n)
			}
		}, {
			key: "applyElement",
			value: function () {
				var t = this.element();
				return this.document.body.appendChild(t), t
			}
		}, {
			key: "onUiRateChange",
			value: function (t) {}
		}, {
			key: "onRateChange",
			value: function (t) {
				var e = this.rate !== t;
				B(c(a.prototype), "onRateChange", this).call(this, t), e && this.onUiRateChange(t)
			}
		}, {
			key: "init",
			value: function () {
				var t = this;
				D("Started to loading '".concat(this.moduleIdentityName, "' component...")), this.waitDomLoaded().then((function () {
					t.applyStyle(t.applyElement()), D("UI component '".concat(t.moduleIdentityName, "' loaded."))
				}))
			}
		}]), a
	}(U);

	function W(t) {
		var e = function () {
			if ("undefined" == typeof Reflect || !Reflect.construct) return !1;
			if (Reflect.construct.sham) return !1;
			if ("function" == typeof Proxy) return !0;
			try {
				return Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], (function () {}))), !0
			} catch (t) {
				return !1
			}
		}();
		return function () {
			var n, r = c(t);
			if (e) {
				var i = c(this).constructor;
				n = Reflect.construct(r, arguments, i)
			} else n = r.apply(this, arguments);
			return u(this, n)
		}
	}
	var q = "hook_timer__change_rate",
		F = function (e) {
			o(a, e);
			var i = W(a);

			function a() {
				var e;
				t(this, a);
				for (var n = arguments.length, o = new Array(n), u = 0; u < n; u++) o[u] = arguments[u];
				return l(r(e = i.call.apply(i, [this].concat(o))), "rate", 1), l(r(e), "state", "preparing"), l(r(e), "setIntervalOrigin", void 0), l(r(e), "clearIntervalOrigin", void 0), l(r(e), "inTimeCheckId", void 0), e
			}
			return n(a, [{
				key: "setSpeed",
				value: function (t) {
					var e = arguments.length > 1 && void 0 !== arguments[1] && arguments[1];
					if (0 === t && (t = this.defaultRate), t && (t !== this.rate || e) && t > 0 && (this.rate = t, this.onRateChanged(t)), null == t) {
						var n = prompt("Enter the time multiplier you wish to change to (Current: " + this.rate + ")");
						n && this.setSpeed(parseFloat(n))
					}
				}
			}, {
				key: "onRateChanged",
				value: function (t) {
					D("Timer speed rate changed to:", t), this.sentChangesToIframe(), this.getAllActivateModules().filter((function (t) {
						return t.onRateChange
					})).forEach((function (e) {
						e.onRateChange(t)
					}))
				}
			}, {
				key: "beginInTimeCheck",
				value: function () {
					var t = this;
					this.keptInTime && (this.inTimeCheckId = this.setIntervalOrigin.call(this.getWindow(), (function () {
						t.rate && 1 !== t.rate && t.setSpeed(t.rate, !0)
					}), this.keptInterval))
				}
			}, {
				key: "catchOriginMethod",
				value: function () {
					this.setIntervalOrigin = this.getWindow().setInterval, this.clearIntervalOrigin = this.getWindow().clearInterval
				}
			}, {
				key: "keptInTime",
				get: function () {
					return this.getConfig("keptInTime")
				}
			}, {
				key: "keptInterval",
				get: function () {
					return this.getConfig("keptInterval")
				}
			}, {
				key: "defaultRate",
				get: function () {
					return this.getConfig("defaultRate")
				}
			}, {
				key: "bootstrap",
				value: function () {
					"preparing" === this.state && (this.catchOriginMethod(), this.listenParentEvent(), this.launchModules(this.getAllModules()), this.setSpeed(this.defaultRate), this.beginInTimeCheck(), this.waitForModulesLoad(), this.state = "started")
				}
			}, {
				key: "launchModules",
				value: function (t) {
					var e = this;
					t.filter((function (t) {
						return t.autoActivate
					})).forEach((function (t) {
						var n = t.moduleIdentityName;
						e.deactivateModules.includes(n) && !t.isCoreModule || e.activateModule(n)
					}))
				}
			}, {
				key: "registerModules",
				value: function (t) {
					var e = this;
					return t.filter((function (t) {
						var n = t.moduleIdentityName;
						return n && e.registerModule(t, t.isOnlyOuterIframe), n
					}))
				}
			}, {
				key: "waitForModulesLoad",
				value: function () {
					var t = this,
						e = this.getWindow().___hooks_preModules || [];
					e.length > 0 && this.launchModules(this.registerModules(e)), this.getWindow()[M] = 1, this.getWindow().addEventListener(M, (function (e) {
						e.detail && e.detail.moduleIdentityName && t.launchModules(t.registerModules([e.detail]))
					}))
				}
			}, {
				key: "exportOuter",
				value: function () {
					var t = this;
					this.getWindow()._OxA ? (this.getWindow().$hookTimer = this, this.getWindow()._OxA = this) : Object.defineProperty(this.getWindow(), "_OxA", {
						get: function () {
							return 1
						},
						set: function (e) {
							"_OxA" === e && (t.getWindow().$hookTimer = t)
						}
					})
				}
			}, {
				key: "listenParentEvent",
				value: function () {
					var t = this;
					v() && this.getWindow().addEventListener("message", (function (e) {
						var n = e.data;
						(n.type || "") === q && t.setSpeed(n.rate || 0)
					}))
				}
			}, {
				key: "deactivateModules",
				get: function () {
					return this.getConfig("deactivateModules")
				}
			}, {
				key: "sentChangesToIframe",
				value: function () {
					var t = this.getWindow().document,
						e = t.querySelectorAll("iframe") || [],
						n = t.querySelectorAll("frame");
					if (e.length)
						for (var r = 0; r < e.length; r++) e[r].contentWindow.postMessage({
							type: q,
							rate: this.rate
						}, "*");
					if (n.length)
						for (var i = 0; i < n.length; i++) n[i].contentWindow.postMessage({
							type: q,
							rate: this.rate
						}, "*")
				}
			}, {
				key: "declareConfigs",
				value: function () {
					return [{
						key: "multiplyRate",
						type: f.NUMBER,
						default: 2
					}, {
						key: "divideRate",
						type: f.NUMBER,
						default: 2
					}, {
						key: "decrementRate",
						type: f.NUMBER,
						default: 2
					}, {
						key: "incrementRate",
						type: f.NUMBER,
						default: 2
					}, {
						key: "defaultRate",
						type: f.NUMBER,
						default: 1
					}, {
						key: "keptInTime",
						type: f.BOOLEAN,
						default: !0
					}, {
						key: "keptInterval",
						type: f.NUMBER,
						default: 4e3
					}, {
						key: "deactivateModules",
						type: f.ARRAY,
						values: this.getAllModules().map((function (t) {
							return {
								key: t.moduleIdentityName
							}
						})),
						default: []
					}]
				}
			}, {
				key: "setConfig",
				value: function (t, e) {
					var n = this.getModule("configs");
					n && n.available() || P("Config module not found, can't set configs values."), n.setValue("host", t, e)
				}
			}, {
				key: "getConfig",
				value: function (t) {
					var e, n = this.getModule("configs"),
						r = (this.declareConfigs().find((function (e) {
							return e.key === t
						})) || {}).default;
					return n && n.available() && null !== (e = n.getValue("host", t)) && void 0 !== e ? e : r
				}
			}]), a
		}(function () {
			function e() {
				t(this, e), l(this, "modules", {})
			}
			return n(e, [{
				key: "activateModule",
				value: function (t) {
					var e = this.getModule(t);
					e ? (e.activate(), D("Module - '".concat(t, "' activated"))) : P("Activate module failed, ".concat(t, " is not found"))
				}
			}, {
				key: "deactivateModule",
				value: function (t) {
					var e = this.getModule(t);
					e || P("Deactivate module failed, '".concat(t, "' is not found")), e.deactivate()
				}
			}, {
				key: "getModule",
				value: function (t) {
					return this.modules[t]
				}
			}, {
				key: "registerModule",
				value: function (t) {
					var e = arguments.length > 1 && void 0 !== arguments[1] && arguments[1];
					e && v() || (this.modules[t.moduleIdentityName] = t, t.mountHost(this))
				}
			}, {
				key: "getAllActivateModules",
				value: function () {
					return Object.values(this.modules).filter((function (t) {
						return t.isActive
					}))
				}
			}, {
				key: "getAllModules",
				value: function () {
					return Object.values(this.modules)
				}
			}, {
				key: "getWindow",
				value: function () {
					return y()
				}
			}]), e
		}());
	var G = function (t, e) {
		if (!(t instanceof e)) throw new TypeError("Cannot call a class as a function")
	};

	function z(t, e) {
		return t(e = {
			exports: {}
		}, e.exports), e.exports
	}
	var Y = z((function (t) {
		function e(n, r) {
			return t.exports = e = Object.setPrototypeOf || function (t, e) {
				return t.__proto__ = e, t
			}, e(n, r)
		}
		t.exports = e
	}));
	var $ = function (t, e) {
			if ("function" != typeof e && null !== e) throw new TypeError("Super expression must either be null or a function");
			t.prototype = Object.create(e && e.prototype, {
				constructor: {
					value: t,
					writable: !0,
					configurable: !0
				}
			}), e && Y(t, e)
		},
		K = z((function (t) {
			function e(n) {
				return "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? t.exports = e = function (t) {
					return typeof t
				} : t.exports = e = function (t) {
					return t && "function" == typeof Symbol && t.constructor === Symbol && t !== Symbol.prototype ? "symbol" : typeof t
				}, e(n)
			}
			t.exports = e
		}));
	var J = function (t) {
		if (void 0 === t) throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
		return t
	};
	var Q = function (t, e) {
			return !e || "object" !== K(e) && "function" != typeof e ? J(t) : e
		},
		X = z((function (t) {
			function e(n) {
				return t.exports = e = Object.setPrototypeOf ? Object.getPrototypeOf : function (t) {
					return t.__proto__ || Object.getPrototypeOf(t)
				}, e(n)
			}
			t.exports = e
		}));
	var Z = function (t, e) {
		(null == e || e > t.length) && (e = t.length);
		for (var n = 0, r = new Array(e); n < e; n++) r[n] = t[n];
		return r
	};
	var tt = function (t) {
		if (Array.isArray(t)) return Z(t)
	};
	var et = function (t) {
		if ("undefined" != typeof Symbol && Symbol.iterator in Object(t)) return Array.from(t)
	};
	var nt = function (t, e) {
		if (t) {
			if ("string" == typeof t) return Z(t, e);
			var n = Object.prototype.toString.call(t).slice(8, -1);
			return "Object" === n && t.constructor && (n = t.constructor.name), "Map" === n || "Set" === n ? Array.from(t) : "Arguments" === n || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n) ? Z(t, e) : void 0
		}
	};
	var rt = function () {
		throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.")
	};
	var it = function (t) {
		return tt(t) || et(t) || nt(t) || rt()
	};

	function ot(t, e) {
		for (var n = 0; n < e.length; n++) {
			var r = e[n];
			r.enumerable = r.enumerable || !1, r.configurable = !0, "value" in r && (r.writable = !0), Object.defineProperty(t, r.key, r)
		}
	}
	var at = function (t, e, n) {
		return e && ot(t.prototype, e), n && ot(t, n), t
	};
	var ut = function (t, e) {
			for (; !Object.prototype.hasOwnProperty.call(t, e) && null !== (t = X(t)););
			return t
		},
		ct = z((function (t) {
			function e(n, r, i) {
				return "undefined" != typeof Reflect && Reflect.get ? t.exports = e = Reflect.get : t.exports = e = function (t, e, n) {
					var r = ut(t, e);
					if (r) {
						var i = Object.getOwnPropertyDescriptor(r, e);
						return i.get ? i.get.call(n) : i.value
					}
				}, e(n, r, i || n)
			}
			t.exports = e
		}));
	var lt = function (t) {
		return -1 !== Function.toString.call(t).indexOf("[native code]")
	};
	var st = function () {
			if ("undefined" == typeof Reflect || !Reflect.construct) return !1;
			if (Reflect.construct.sham) return !1;
			if ("function" == typeof Proxy) return !0;
			try {
				return Date.prototype.toString.call(Reflect.construct(Date, [], (function () {}))), !0
			} catch (t) {
				return !1
			}
		},
		ft = z((function (t) {
			function e(n, r, i) {
				return st() ? t.exports = e = Reflect.construct : t.exports = e = function (t, e, n) {
					var r = [null];
					r.push.apply(r, e);
					var i = new(Function.bind.apply(t, r));
					return n && Y(i, n.prototype), i
				}, e.apply(null, arguments)
			}
			t.exports = e
		})),
		ht = z((function (t) {
			function e(n) {
				var r = "function" == typeof Map ? new Map : void 0;
				return t.exports = e = function (t) {
					if (null === t || !lt(t)) return t;
					if ("function" != typeof t) throw new TypeError("Super expression must either be null or a function");
					if (void 0 !== r) {
						if (r.has(t)) return r.get(t);
						r.set(t, e)
					}

					function e() {
						return ft(t, arguments, X(this).constructor)
					}
					return e.prototype = Object.create(t.prototype, {
						constructor: {
							value: e,
							enumerable: !1,
							writable: !0,
							configurable: !0
						}
					}), Y(e, t)
				}, e(n)
			}
			t.exports = e
		}));

	function dt(t, e) {
		var n = arguments.length > 2 && void 0 !== arguments[2] ? arguments[2] : "initAssign",
			r = Object.getPrototypeOf(e);
		return Object.setPrototypeOf(t, r), "function" == typeof r[n] && r[n].call(t, e), t
	}

	function pt(t) {
		return Number(Math.random().toString().substr(3, t) + Date.now()).toString(36)
	}

	function yt(t) {
		var e = function () {
			if ("undefined" == typeof Reflect || !Reflect.construct) return !1;
			if (Reflect.construct.sham) return !1;
			if ("function" == typeof Proxy) return !0;
			try {
				return Date.prototype.toString.call(Reflect.construct(Date, [], (function () {}))), !0
			} catch (t) {
				return !1
			}
		}();
		return function () {
			var n, r = X(t);
			if (e) {
				var i = X(this).constructor;
				n = Reflect.construct(r, arguments, i)
			} else n = r.apply(this, arguments);
			return Q(this, n)
		}
	}! function (t, e) {
		t(e = {
			exports: {}
		}, e.exports)
	}((function (t) {
		function e(n) {
			return "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? t.exports = e = function (t) {
				return typeof t
			} : t.exports = e = function (t) {
				return t && "function" == typeof Symbol && t.constructor === Symbol && t !== Symbol.prototype ? "symbol" : typeof t
			}, e(n)
		}
		t.exports = e
	}));
	var vt = {
		instanceType: function (t) {
			$(n, t);
			var e = yt(n);

			function n() {
				return G(this, n), e.apply(this, arguments)
			}
			return at(n, [{
				key: "initAssign",
				value: function (t) {
					this.id = pt(7),
						function (t, e, n, r) {
							e && void 0 !== e[n] ? t[n] = e[n] : "function" == typeof r && (t[n] = r())
						}(this, t, "uniqueId", (function () {
							return pt(7)
						}))
				}
			}, {
				key: "bind",
				value: function (t) {
					var e, r = arguments.length > 1 && void 0 !== arguments[1] ? arguments[1] : [];
					return dt((e = ct(X(n.prototype), "bind", this)).call.apply(e, [this, t].concat(it(r))), this)
				}
			}, {
				key: "before",
				value: function (t) {
					var e = arguments.length > 1 && void 0 !== arguments[1] && arguments[1];
					return this.surround({
						before: t,
						adaptAsync: e
					})
				}
			}, {
				key: "after",
				value: function (t) {
					var e = arguments.length > 1 && void 0 !== arguments[1] && arguments[1];
					return this.surround({
						after: t,
						adaptAsync: e
					})
				}
			}, {
				key: "surround",
				value: function (t) {
					var e = t.before,
						n = void 0 === e ? void 0 : e,
						r = t.after,
						i = void 0 === r ? void 0 : r,
						o = t.onError,
						a = void 0 === o ? void 0 : o,
						u = t.adaptAsync,
						c = void 0 !== u && u,
						l = this;
					return "function" != typeof l ? l : dt((function () {
						for (var t = this, e = arguments.length, r = new Array(e), o = 0; o < e; o++) r[o] = arguments[o];
						var u = {},
							s = {
								origin: l,
								args: r,
								trans: u
							},
							f = "function" == typeof a;
						try {
							var h, d, p = !1;
							return "function" == typeof n && (h = n.call(this, Object.assign({}, s, {
								preventDefault: function () {
									p = !0
								}
							})), p) ? h : (d = h instanceof Promise && c ? h.then((function () {
								return l.apply(t, r)
							})) : l.apply(this, r), "function" == typeof i && (d = d instanceof Promise && c ? d.then((function (e) {
								return i.call(t, Object.assign({}, s, {
									lastValue: e
								}))
							})) : i.call(this, Object.assign({}, s, {
								lastValue: d
							}))), d instanceof Promise && c && f ? d.catch((function (e) {
								var n = !1,
									r = "";
								return Promise.resolve(a.call(t, Object.assign({}, s, {
									error: e,
									resolve: function (t) {
										r = t, n = !0
									}
								}))).then((function (t) {
									if (!n) throw e;
									return r || t
								}))
							})) : d)
						} catch (t) {
							if (!f) throw t;
							var y = !1,
								v = "",
								g = function (t) {
									v = t, y = !0
								},
								m = a.call(this, Object.assign({}, s, {
									error: t,
									resolve: g
								}));
							if (!y) throw t;
							return v || m
						}
					}), this)
				}
			}, {
				key: "then",
				value: function (t) {
					var e = this;
					return dt((function () {
						for (var n = arguments.length, r = new Array(n), i = 0; i < n; i++) r[i] = arguments[i];
						var o = e.apply(this, r);
						return Promise.resolve(o).then(t)
					}), this)
				}
			}, {
				key: "catch",
				value: function (t) {
					var e = this;
					return dt((function () {
						var n;
						try {
							for (var r = arguments.length, i = new Array(r), o = 0; o < r; o++) i[o] = arguments[o];
							if ((n = e.apply(this, i)) instanceof Promise) return n.catch(t)
						} catch (e) {
							n = t.call(this, e)
						}
						return n
					}), this)
				}
			}, {
				key: "finally",
				value: function (t) {
					var e = this;
					return dt((function () {
						var n = function () {
							try {
								t.call(this)
							} catch (t) {}
						};
						try {
							for (var r = arguments.length, i = new Array(r), o = 0; o < r; o++) i[o] = arguments[o];
							var a = e.apply(this, i);
							return a instanceof Promise ? "function" == typeof a.finally ? a.finally((function () {
								return n()
							})) : a.catch((function (t) {
								return t
							})).then((function (t) {
								if (n(), t instanceof Error) throw t
							})) : (n(), a)
						} catch (t) {
							throw n(), t
						}
					}), this)
				}
			}, {
				key: "register",
				value: function () {
					var t = arguments.length > 0 && void 0 !== arguments[0] ? arguments[0] : {};
					return this.registerClass((function (e) {
						var n = function (t) {
							$(n, t);
							var e = yt(n);

							function n() {
								return G(this, n), e.apply(this, arguments)
							}
							return n
						}(e);
						return Object.assign(n.prototype, t), n
					}))
				}
			}, {
				key: "registerClass",
				value: function (t) {
					var e = t(this.constructor),
						n = this.bind(this);
					if (Object.setPrototypeOf(n, e.prototype), "function" != typeof e || !(n instanceof this.constructor)) throw new Error("Registered class must extend FunctionInstance");
					return n
				}
			}]), n
		}(ht(Function))
	};

	function gt(t, e) {
		var n = function () {
			for (var e = arguments.length, n = new Array(e), r = 0; r < e; r++) n[r] = arguments[r];
			return (t || function () {}).apply(this, n)
		};
		return function (t, e) {
			var n = arguments.length > 2 && void 0 !== arguments[2] ? arguments[2] : "initAssign",
				r = e.prototype;
			Object.setPrototypeOf(t, r), "function" == typeof r[n] && r[n].call(t)
		}(n, (e = Object.assign({}, vt, e)).instanceType), n
	}
	var mt, bt = {
			protect: !1,
			syncDesc: !0,
			native: !1
		},
		wt = Object.defineProperty,
		kt = Object.defineProperties;

	function xt(t, e, n) {
		var r = arguments.length > 3 && void 0 !== arguments[3] ? arguments[3] : {},
			i = t[e];
		if ("function" == typeof i) {
			var o = Object.assign({}, bt, r),
				a = o.native,
				u = n(a ? i : gt(i));
			t[e] = a ? u : function () {
				for (var t = arguments.length, e = new Array(t), n = 0; n < t; n++) e[n] = arguments[n];
				try {
					return u.apply(this, e)
				} catch (t) {
					return console.warn("[Hook JS]", "Hooks  running lost once."), i.apply(this, e)
				}
			};
			var c = o.protect,
				l = o.syncDesc;
			c && _t(t, e), l && At(i, t[e])
		}
	}

	function Ot(t, e, n, r) {
		var i = arguments.length > 4 && void 0 !== arguments[4] ? arguments[4] : {};
		return xt(t, e, (function (t) {
			return t[n](r)
		}), i)
	}

	function Rt(t, e, n) {
		var r = arguments.length > 3 && void 0 !== arguments[3] ? arguments[3] : {};
		return Ot(t, e, "before", n, r)
	}

	function Mt(t, e, n) {
		var r = arguments.length > 3 && void 0 !== arguments[3] ? arguments[3] : {};
		return xt(t, e, n, Object.assign({}, r, {
			native: !0
		}))
	}

	function _t(t, e) {
		wt.call(Object, t, e, {
			writable: !1
		})
	}

	function At(t, e) {
		kt.call(Object, e, {
			toString: {
				enumerable: !1,
				writable: !0,
				value: function () {
					return t.toString()
				}
			},
			toLocaleString: {
				enumerable: !1,
				writable: !0,
				value: function () {
					return t.toLocaleString()
				}
			}
		})
	}

	function St(t) {
		var e = function () {
			if ("undefined" == typeof Reflect || !Reflect.construct) return !1;
			if (Reflect.construct.sham) return !1;
			if ("function" == typeof Proxy) return !0;
			try {
				return Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], (function () {}))), !0
			} catch (t) {
				return !1
			}
		}();
		return function () {
			var n, r = c(t);
			if (e) {
				var i = c(this).constructor;
				n = Reflect.construct(r, arguments, i)
			} else n = r.apply(this, arguments);
			return u(this, n)
		}
	}! function (t) {
		t.TIMEOUT = "timeout", t.INTERVAL = "interval"
	}(mt || (mt = {}));
	var It = function (e) {
		o(a, e);
		var i = St(a);

		function a() {
			var e;
			t(this, a);
			for (var n = arguments.length, o = new Array(n), u = 0; u < n; u++) o[u] = arguments[u];
			return l(r(e = i.call.apply(i, [this].concat(o))), "percentage", void 0), l(r(e), "interval", {}), l(r(e), "timeout", {}), l(r(e), "setIntervalOrigin", void 0), l(r(e), "setTimeoutOrigin", void 0), l(r(e), "clearIntervalOrigin", void 0), l(r(e), "clearTimeoutOrigin", void 0), e
		}
		return n(a, [{
			key: "onMounted",
			value: function () {
				B(c(a.prototype), "onMounted", this).call(this), this.setIntervalOrigin = this.window.setInterval, this.setTimeoutOrigin = this.window.setTimeout, this.clearIntervalOrigin = this.window.clearInterval, this.clearTimeoutOrigin = this.window.clearTimeout
			}
		}, {
			key: "init",
			value: function () {
				var t = this;
				this.percentage = 1 / this.rate, Mt(this.window, "setInterval", (function (e) {
					return t.getHookedTimerFunction(mt.INTERVAL, e)
				})), Mt(this.window, "setTimeout", (function (e) {
					return t.getHookedTimerFunction(mt.TIMEOUT, e)
				})), Rt(this.window, "clearInterval", (function (e) {
					var n = e.args;
					t.redirectNewestId(n)
				})), Rt(this.window, "clearTimeout", (function (e) {
					var n = e.args;
					t.redirectNewestId(n)
				}))
			}
		}, {
			key: "onRateChange",
			value: function (t) {
				var e = this;
				B(c(a.prototype), "onRateChange", this).call(this, t), this.percentage = 1 / t, Object.values(this.interval).forEach((function (t) {
					t.args[1] = Math.floor((t.originMS || 1) * e.percentage), e.clearIntervalOrigin.call(e.window, t.nowId), t.nowId = e.setIntervalOrigin.apply(e.window, t.args)
				})), Object.values(this.timeout).forEach((function (t) {
					var n = Date.now(),
						r = t.exceptNextFireTime,
						i = t.oldPercentage,
						o = r - n;
					o < 0 && (o = 0);
					var a = Math.floor(e.percentage / i * o);
					t.args[1] = a, t.exceptNextFireTime = n + a, t.oldPercentage = e.percentage, e.clearTimeoutOrigin.call(e.window, t.nowId), t.nowId = e.setTimeoutOrigin.apply(e.window, t.args)
				}))
			}
		}, {
			key: "notifyExec",
			value: function (t) {
				var e = this;
				t && Object.values(this.timeout).filter((function (e) {
					return e.uniqueId === t
				})).forEach((function (t) {
					e.clearTimeoutOrigin.call(e.window, t.nowId), delete e.timeout[t.originId]
				}))
			}
		}, {
			key: "redirectNewestId",
			value: function (t) {
				var e = t[0];
				this.interval[e] && (t[0] = this.interval[e].nowId, delete this.interval[e]), this.timeout[e] && (t[0] = this.timeout[e].nowId, delete this.timeout[e])
			}
		}, {
			key: "getHookedTimerFunction",
			value: function (t, e) {
				var n = t,
					r = this;
				return function () {
					for (var t = arguments.length, i = new Array(t), o = 0; o < t; o++) i[o] = arguments[o];
					var a = p(),
						u = i[0];
					"string" == typeof u && (r.window.__timer = {
						notifyExec: r.notifyExec.bind(r)
					}, u += ";__timer.notifyExec(" + a + ")", i[0] = u), "function" == typeof u && (i[0] = function () {
						var t = u.apply(this, arguments);
						return r.notifyExec(a), t
					});
					var c = i[1];
					i[1] *= r.percentage;
					var l = e.apply(r.window, i);
					return r[n][l] = {
						args: i,
						originMS: c,
						originId: l,
						nowId: l,
						uniqueId: a,
						oldPercentage: r.percentage,
						exceptNextFireTime: Date.now() + c
					}, l
				}
			}
		}, {
			key: "moduleIdentityName",
			get: function () {
				return "timer"
			}
		}]), a
	}(U);

	function Ct(t) {
		var e = function () {
			if ("undefined" == typeof Reflect || !Reflect.construct) return !1;
			if (Reflect.construct.sham) return !1;
			if ("function" == typeof Proxy) return !0;
			try {
				return Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], (function () {}))), !0
			} catch (t) {
				return !1
			}
		}();
		return function () {
			var n, r = c(t);
			if (e) {
				var i = c(this).constructor;
				n = Reflect.construct(r, arguments, i)
			} else n = r.apply(this, arguments);
			return u(this, n)
		}
	}
	var Tt, Et = function (e) {
		o(a, e);
		var i = Ct(a);

		function a() {
			var e;
			t(this, a);
			for (var n = arguments.length, o = new Array(n), u = 0; u < n; u++) o[u] = arguments[u];
			return l(r(e = i.call.apply(i, [this].concat(o))), "DateOrigin", void 0), l(r(e), "DateModified", void 0), l(r(e), "rate", 1), l(r(e), "lastDatetime", void 0), l(r(e), "lastMDatetime", void 0), e
		}
		return n(a, [{
			key: "onMounted",
			value: function () {
				B(c(a.prototype), "onMounted", this).call(this), this.lastDatetime = Date.now(), this.lastMDatetime = Date.now(), this.DateOrigin = this.window.Date, this.DateModified = this.window.Date
			}
		}, {
			key: "init",
			value: function () {
				this.hookedDate()
			}
		}, {
			key: "onRateChange",
			value: function (t) {
				this.DateModified && (this.lastMDatetime = this.DateModified.now(), this.lastDatetime = this.DateOrigin.now()), B(c(a.prototype), "onRateChange", this).call(this, t)
			}
		}, {
			key: "hookedDate",
			value: function () {
				var e = this,
					n = this;
				Mt(this.window, "Date", (function (e) {
					var r = function (e) {
						o(i, e);
						var r = Ct(i);

						function i() {
							t(this, i);
							for (var e = arguments.length, o = new Array(e), a = 0; a < e; a++) o[a] = arguments[a];
							if (0 === o.length) {
								var u = n.DateOrigin.now(),
									c = u - n.lastDatetime,
									l = c * n.rate;
								o.push(n.lastMDatetime + l)
							}
							return r.call.apply(r, [this].concat(o))
						}
						return i
					}(e);
					return r = r.bind(new r)
				})), this.DateModified = this.window.Date, Mt(this.DateModified, "now", (function () {
					return function () {
						return (new e.DateModified).getTime()
					}
				}))
			}
		}, {
			key: "moduleIdentityName",
			get: function () {
				return "dateTimer"
			}
		}]), a
	}(U);

	function jt(t, e) {
		var n = "undefined" != typeof Symbol && t[Symbol.iterator] || t["@@iterator"];
		if (!n) {
			if (Array.isArray(t) || (n = function (t, e) {
					if (!t) return;
					if ("string" == typeof t) return Dt(t, e);
					var n = Object.prototype.toString.call(t).slice(8, -1);
					"Object" === n && t.constructor && (n = t.constructor.name);
					if ("Map" === n || "Set" === n) return Array.from(t);
					if ("Arguments" === n || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return Dt(t, e)
				}(t)) || e && t && "number" == typeof t.length) {
				n && (t = n);
				var r = 0,
					i = function () {};
				return {
					s: i,
					n: function () {
						return r >= t.length ? {
							done: !0
						} : {
							done: !1,
							value: t[r++]
						}
					},
					e: function (t) {
						throw t
					},
					f: i
				}
			}
			throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.")
		}
		var o, a = !0,
			u = !1;
		return {
			s: function () {
				n = n.call(t)
			},
			n: function () {
				var t = n.next();
				return a = t.done, t
			},
			e: function (t) {
				u = !0, o = t
			},
			f: function () {
				try {
					a || null == n.return || n.return()
				} finally {
					if (u) throw o
				}
			}
		}
	}

	function Dt(t, e) {
		(null == e || e > t.length) && (e = t.length);
		for (var n = 0, r = new Array(e); n < e; n++) r[n] = t[n];
		return r
	}

	function Pt(t) {
		var e = function () {
			if ("undefined" == typeof Reflect || !Reflect.construct) return !1;
			if (Reflect.construct.sham) return !1;
			if ("function" == typeof Proxy) return !0;
			try {
				return Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], (function () {}))), !0
			} catch (t) {
				return !1
			}
		}();
		return function () {
			var n, r = c(t);
			if (e) {
				var i = c(this).constructor;
				n = Reflect.construct(r, arguments, i)
			} else n = r.apply(this, arguments);
			return u(this, n)
		}
	}! function (t) {
		t.CTRL = "ctrl", t.META = "meta", t.CMD = "meta", t.SHIFT = "shift", t.ALT = "alt"
	}(Tt || (Tt = {}));
	var Nt = function (e) {
		o(i, e);
		var r = Pt(i);

		function i() {
			return t(this, i), r.apply(this, arguments)
		}
		return n(i, [{
			key: "init",
			value: function () {
				var t = this,
					e = this.shortcutList;
				this.window.addEventListener("keydown", (function (n) {
					var r, i = jt(e);
					try {
						for (i.s(); !(r = i.n()).done;) {
							var o = r.value;
							T(n, o) && (n.preventDefault(), n.stopPropagation(), o.operator(t.host))
						}
					} catch (t) {
						i.e(t)
					} finally {
						i.f()
					}
				}))
			}
		}, {
			key: "shortcutList",
			get: function () {
				var t = this;
				return [["shortcutExpressions.+", function (t) {
					return t.speedUp()
				}], ["shortcutExpressions.-", function (t) {
					return t.speedDown()
				}], ["shortcutExpressions.*", function (t) {
					return t.speedMultiply()
				}], ["shortcutExpressions./", function (t) {
					return t.speedDivide()
				}], ["shortcutExpressions.reset", function (t) {
					return t.setSpeed(1)
				}], ["shortcutExpressions.custom", function (t) {
					return t.setSpeed()
				}]].map((function (e) {
					var n = w(e, 2),
						r = n[0],
						i = n[1];
					return {
						expressions: t.getConfig(r),
						operator: i
					}
				})).map((function (t) {
					return e = t, "string" == typeof (n = Object.assign({}, e, {
						conditions: []
					})).expressions && (n.expressions = n.expressions.split(";")), n.expressions && n.expressions instanceof Array && (n.conditions = n.expressions.map((function (t) {
						return function (t) {
							var e = arguments.length > 1 && void 0 !== arguments[1] ? arguments[1] : "+",
								n = t.split(e).map((function (t) {
									return t.trim()
								})).filter((function (t) {
									return t
								})),
								r = {
									code: n.pop() || "UNKNOWN_KEY"
								};
							return n.forEach((function (t) {
								r[t + "Key"] = !0
							})), r
						}(t)
					}))), n;
					var e, n
				}))
			}
		}, {
			key: "moduleIdentityName",
			get: function () {
				return "shortcutKey"
			}
		}, {
			key: "declareConfigs",
			value: function () {
				return [{
					type: f.ARRAY,
					itemType: f.SHORTCUT,
					key: "shortcutExpressions.custom",
					default: ["ctrl + Digit1"]
				}]
			}
		}]), i
	}(U);

	function Bt(t) {
		var e = function () {
			if ("undefined" == typeof Reflect || !Reflect.construct) return !1;
			if (Reflect.construct.sham) return !1;
			if ("function" == typeof Proxy) return !0;
			try {
				return Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], (function () {}))), !0
			} catch (t) {
				return !1
			}
		}();
		return function () {
			var n, r = c(t);
			if (e) {
				var i = c(this).constructor;
				n = Reflect.construct(r, arguments, i)
			} else n = r.apply(this, arguments);
			return u(this, n)
		}
	}

	function Lt(t, e) {
		var n = "undefined" != typeof Symbol && t[Symbol.iterator] || t["@@iterator"];
		if (!n) {
			if (Array.isArray(t) || (n = function (t, e) {
					if (!t) return;
					if ("string" == typeof t) return Ut(t, e);
					var n = Object.prototype.toString.call(t).slice(8, -1);
					"Object" === n && t.constructor && (n = t.constructor.name);
					if ("Map" === n || "Set" === n) return Array.from(t);
					if ("Arguments" === n || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return Ut(t, e)
				}(t)) || e && t && "number" == typeof t.length) {
				n && (t = n);
				var r = 0,
					i = function () {};
				return {
					s: i,
					n: function () {
						return r >= t.length ? {
							done: !0
						} : {
							done: !1,
							value: t[r++]
						}
					},
					e: function (t) {
						throw t
					},
					f: i
				}
			}
			throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.")
		}
		var o, a = !0,
			u = !1;
		return {
			s: function () {
				n = n.call(t)
			},
			n: function () {
				var t = n.next();
				return a = t.done, t
			},
			e: function (t) {
				u = !0, o = t
			},
			f: function () {
				try {
					a || null == n.return || n.return()
				} finally {
					if (u) throw o
				}
			}
		}
	}

	function Ut(t, e) {
		(null == e || e > t.length) && (e = t.length);
		for (var n = 0, r = new Array(e); n < e; n++) r[n] = t[n];
		return r
	}

	function Vt(t) {
		var e, n = {},
			r = Lt(Object.entries(t).filter((function (t) {
				var e = w(t, 1)[0];
				return !["target", "key"].includes(e)
			})));
		try {
			for (r.s(); !(e = r.n()).done;) {
				var i = w(e.value, 2),
					o = i[0],
					a = i[1];
				n[o] = a
			}
		} catch (t) {
			r.e(t)
		} finally {
			r.f()
		}
		return n
	}
	var Ht = function (e) {
		o(a, e);
		var i = Bt(a);

		function a() {
			var e;
			t(this, a);
			for (var n = arguments.length, o = new Array(n), u = 0; u < n; u++) o[u] = arguments[u];
			return l(r(e = i.call.apply(i, [this].concat(o))), "defines", []), l(r(e), "definePropertiesOrigin", void 0), l(r(e), "definePropertyOrigin", void 0), e
		}
		return n(a, [{
			key: "onMounted",
			value: function () {
				B(c(a.prototype), "onMounted", this).call(this), this.definePropertiesOrigin = this.window.Object.defineProperties, this.definePropertyOrigin = this.window.Object.defineProperty
			}
		}, {
			key: "isCoreModule",
			get: function () {
				return !0
			}
		}, {
			key: "init",
			value: function () {
				var t = this;
				Rt(this.window.Object, "defineProperties", (function (e) {
					var n, r = e.args,
						i = w(r, 2),
						o = i[0],
						a = i[1],
						u = Object.entries(a).map((function (e) {
							var n = w(e, 2),
								i = n[0],
								a = n[1],
								u = Object.assign({
									target: o,
									key: i
								}, a);
							return t.hookDefine(u) ? (r[0] = u.target, [u.key, Vt(u)]) : [!1]
						})).filter((function (t) {
							return w(t, 1)[0]
						}));
					r[1] = (n = {}, u.forEach((function (t) {
						n[null == t[0] ? "" : t[0]] = t[1]
					})), n)
				})), Rt(this.window.Object, "defineProperty", (function (e) {
					var n = e.args,
						r = e.preventDefault,
						i = w(n, 3),
						o = i[0],
						a = i[1],
						u = i[2],
						c = Object.assign({
							target: o,
							key: a
						}, u);
					t.hookDefine(c) ? (n[0] = c.target, n[1] = c.key, n[2] = Vt(c)) : r()
				}))
			}
		}, {
			key: "hookDefine",
			value: function (t) {
				var e, n = Lt(this.defines);
				try {
					for (n.s(); !(e = n.n()).done;) {
						if ((0, e.value)(t)) return !1
					}
				} catch (t) {
					n.e(t)
				} finally {
					n.f()
				}
				return !0
			}
		}, {
			key: "applyDefineRole",
			value: function (t) {
				this.defines.push(t)
			}
		}, {
			key: "moduleIdentityName",
			get: function () {
				return "definition"
			}
		}]), a
	}(N);

	function Wt(t) {
		return function (t) {
			if (Array.isArray(t)) return m(t)
		}(t) || function (t) {
			if ("undefined" != typeof Symbol && null != t[Symbol.iterator] || null != t["@@iterator"]) return Array.from(t)
		}(t) || b(t) || function () {
			throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.")
		}()
	}

	function qt(t) {
		var e = function () {
			if ("undefined" == typeof Reflect || !Reflect.construct) return !1;
			if (Reflect.construct.sham) return !1;
			if ("function" == typeof Proxy) return !0;
			try {
				return Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], (function () {}))), !0
			} catch (t) {
				return !1
			}
		}();
		return function () {
			var n, r = c(t);
			if (e) {
				var i = c(this).constructor;
				n = Reflect.construct(r, arguments, i)
			} else n = r.apply(this, arguments);
			return u(this, n)
		}
	}
	var Ft = function (e) {
		o(a, e);
		var i = qt(a);

		function a() {
			var e;
			t(this, a);
			for (var n = arguments.length, o = new Array(n), u = 0; u < n; u++) o[u] = arguments[u];
			return l(r(e = i.call.apply(i, [this].concat(o))), "extraElements", []), e
		}
		return n(a, [{
			key: "init",
			value: function () {
				var t = this;
				! function (t, e, n) {
					Ot(t, e, "after", n, arguments.length > 3 && void 0 !== arguments[3] ? arguments[3] : {})
				}(this.window.Element.prototype, "attachShadow", (function (e) {
					var n = e.lastValue;
					return t.extraElements.push(n), n
				}))
			}
		}, {
			key: "querySelectorAll",
			value: function (t) {
				return g(this.extraElements.map((function (e) {
					return Wt(e.querySelectorAll(t))
				})))
			}
		}, {
			key: "moduleIdentityName",
			get: function () {
				return "shadowDOM"
			}
		}, {
			key: "isCoreModule",
			get: function () {
				return !0
			}
		}]), a
	}(N);

	function Gt(t, e) {
		var n = "undefined" != typeof Symbol && t[Symbol.iterator] || t["@@iterator"];
		if (!n) {
			if (Array.isArray(t) || (n = function (t, e) {
					if (!t) return;
					if ("string" == typeof t) return zt(t, e);
					var n = Object.prototype.toString.call(t).slice(8, -1);
					"Object" === n && t.constructor && (n = t.constructor.name);
					if ("Map" === n || "Set" === n) return Array.from(t);
					if ("Arguments" === n || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return zt(t, e)
				}(t)) || e && t && "number" == typeof t.length) {
				n && (t = n);
				var r = 0,
					i = function () {};
				return {
					s: i,
					n: function () {
						return r >= t.length ? {
							done: !0
						} : {
							done: !1,
							value: t[r++]
						}
					},
					e: function (t) {
						throw t
					},
					f: i
				}
			}
			throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.")
		}
		var o, a = !0,
			u = !1;
		return {
			s: function () {
				n = n.call(t)
			},
			n: function () {
				var t = n.next();
				return a = t.done, t
			},
			e: function (t) {
				u = !0, o = t
			},
			f: function () {
				try {
					a || null == n.return || n.return()
				} finally {
					if (u) throw o
				}
			}
		}
	}

	function zt(t, e) {
		(null == e || e > t.length) && (e = t.length);
		for (var n = 0, r = new Array(e); n < e; n++) r[n] = t[n];
		return r
	}

	function Yt(t) {
		var e = function () {
			if ("undefined" == typeof Reflect || !Reflect.construct) return !1;
			if (Reflect.construct.sham) return !1;
			if ("function" == typeof Proxy) return !0;
			try {
				return Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], (function () {}))), !0
			} catch (t) {
				return !1
			}
		}();
		return function () {
			var n, r = c(t);
			if (e) {
				var i = c(this).constructor;
				n = Reflect.construct(r, arguments, i)
			} else n = r.apply(this, arguments);
			return u(this, n)
		}
	}

	function Kt(t) {
		var e = function () {
			if ("undefined" == typeof Reflect || !Reflect.construct) return !1;
			if (Reflect.construct.sham) return !1;
			if ("function" == typeof Proxy) return !0;
			try {
				return Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], (function () {}))), !0
			} catch (t) {
				return !1
			}
		}();
		return function () {
			var n, r = c(t);
			if (e) {
				var i = c(this).constructor;
				n = Reflect.construct(r, arguments, i)
			} else n = r.apply(this, arguments);
			return u(this, n)
		}
	}
	var Jt = function (e) {
			o(i, e);
			var r = Kt(i);

			function i(e) {
				var n, o = arguments.length > 1 && void 0 !== arguments[1] ? arguments[1] : "__CM";
				return t(this, i), (n = r.call(this)).storage = e, n.prefix = o, n
			}
			return n(i, [{
				key: "isCoreModule",
				get: function () {
					return !0
				}
			}, {
				key: "openPage",
				value: function (t) {
					"function" == typeof j.openInTab ? j.openInTab(t, {
						active: !0
					}) : this.window.open(t)
				}
			}, {
				key: "init",
				value: function () {
					var t = this;
					B(c(i.prototype), "init", this).call(this), "function" == typeof j.registerMenuCommand
				}
			}, {
				key: "getAllConfigs",
				value: function () {
					var t = this;
					return this.getDeclaredConfigurations().map((function (e) {
						var n = t.getValue(e.namespace, e.key);
						return Object.assign({}, e, {
							value: null != n ? n : e.default
						})
					}))
				}
			}, {
				key: "getDeclaredConfigurations",
				value: function () {
					return g([this.host.declareConfigs().map((function (t) {
						return Object.assign({}, t, {
							namespace: "host"
						})
					}))].concat(Wt(this.host.getAllActivateModules().map((function (t) {
						return t.declareConfigs().map((function (e) {
							return Object.assign({}, e, {
								namespace: t.moduleIdentityName,
								modelName: t.moduleName
							})
						}))
					})))))
				}
			}, {
				key: "moduleIdentityName",
				get: function () {
					return "configs"
				}
			}, {
				key: "saveAllConfigs",
				value: function (t) {
					var e = this;
					t.forEach((function (t) {
						var n;
						e.setValue(t.namespace, t.key, null !== (n = t.value) && void 0 !== n ? n : t.default)
					}))
				}
			}, {
				key: "getValue",
				value: function (t, e) {
					if (this.available()) return this.storage.get([this.prefix, t, e].join("_"))
				}
			}, {
				key: "setValue",
				value: function (t, e, n) {
					this.available() && this.storage.set([this.prefix, t, e].join("_"), n)
				}
			}, {
				key: "available",
				value: function () {
					return !!this.storage && this.storage.available()
				}
			}, {
				key: "resetAll",
				value: function () {
					var t = this;
					this.storage.list().filter((function (e) {
						return e.startsWith(t.prefix)
					})).forEach((function (e) {
						t.storage.remove(e)
					}))
				}
			}]), i
		}(N),
		Qt = function () {
			function e() {
				t(this, e), l(this, "isAvailable", void 0)
			}
			return n(e, [{
				key: "get",
				value: function (t) {
					return j.getValue(t)
				}
			}, {
				key: "list",
				value: function () {
					return j.listValues()
				}
			}, {
				key: "remove",
				value: function (t) {
					j.deleteValue(t)
				}
			}, {
				key: "set",
				value: function (t, e) {
					j.setValue(t, e)
				}
			}, {
				key: "available",
				value: function () {
					return null == this.isAvailable && (this.isAvailable = [a(j.setValue), a(j.getValue), a(j.listValues), a(j.deleteValue)].every((function (t) {
						return "function" === t
					}))), this.isAvailable
				}
			}]), e
		}();

	function Xt(t) {
		var e = function () {
			if ("undefined" == typeof Reflect || !Reflect.construct) return !1;
			if (Reflect.construct.sham) return !1;
			if ("function" == typeof Proxy) return !0;
			try {
				return Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], (function () {}))), !0
			} catch (t) {
				return !1
			}
		}();
		return function () {
			var n, r = c(t);
			if (e) {
				var i = c(this).constructor;
				n = Reflect.construct(r, arguments, i)
			} else n = r.apply(this, arguments);
			return u(this, n)
		}
	}
	var Zt = function (e) {
			o(a, e);
			var i = Xt(a);

			function a() {
				var e;
				t(this, a);
				for (var n = arguments.length, o = new Array(n), u = 0; u < n; u++) o[u] = arguments[u];
				return l(r(e = i.call.apply(i, [this].concat(o))), "nodeElement", void 0), l(r(e), "clickMapper", {
					"_item-input": function (t) {
						t.setSpeed()
					}
				}), l(r(e), "setTimeoutOrigin", setTimeout), e
			}
			return n(a, [{
				key: "moduleIdentityName",
				get: function () {
					return "legacyUi"
				}
			}, {
				key: "displayNum",
				get: function () {
					return (this.rate.toString().split(".")[1] || "").length > 2 ? this.rate.toFixed(2) : this.rate.toString()
				}
			}, {
				key: "showSuspendedBall",
				get: function () {
					return this.getConfig("showSuspendedBall")
				}
			}, {
				key: "deeplyColor",
				get: function () {
					return this.getConfig("deeplyColor")
				}
			}, {
				key: "genElement",
				value: function () {
					var t = this.document.createElement("div");
					t.innerHTML = (this.showSuspendedBall ? '<div class="_th-container" >\n    <div class="_th-click-hover _item-input">\n        x' + this.displayNum + '\n    </div>\n' : "");
					var e = this;
					return Object.keys(this.clickMapper).forEach((function (n) {
						var r = e.clickMapper[n],
							i = t.getElementsByClassName(n)[0];
						i && (i.onclick = function () {
							r(e.host, e.rate)
						})
					})), t
				}
			}, {
				key: "element",
				value: function () {
					return this.nodeElement || (this.nodeElement = this.genElement()), this.nodeElement
				}
			}, {
				key: "style",
				value: function () {
					var t = this.position,
						e = this.positionOffset,
						n = "right" === t ? "left" : "right",
						r = "left" === t;
					return "._th-container ._th-item {margin-bottom: 3px;position: relative;width: 0;height: 0;cursor: pointer;opacity: .3;background-color: aquamarine;border-radius: 100%;text-align: center;line-height: 30px;-webkit-transition: all .35s;-o-transition: all .35s;transition: all .35s;".concat(n, ": 30px;}._th-container ._th-item, ._th-container ._th-click-hover, ._th_cover-all-show-times ._th_times {-webkit-box-shadow: ").concat(this.deeplyColor ? "4px 5px 10px 6px #b2b2b2" : "-3px 4px 12px -5px black", ";box-shadow: ").concat(this.deeplyColor ? "4px 5px 10px 6px #b2b2b2" : "-3px 4px 12px -5px black", ";}._th-click-hover {position: relative;-webkit-transition: all .5s;-o-transition: all .5s;transition: all .5s;height: 45px;width: 45px;cursor: pointer;opacity: .6;border-radius: 100%;background-color: aquamarine;text-align: center;line-height: 45px;").concat(n, ": 0}._th-container:hover {").concat(t, ": 0}._th-container {font-size: 12px;-webkit-transition: all .5s;-o-transition: all .5s;transition: all .5s;").concat(t, ": 0;top: ").concat(e, ";position: fixed;-webkit-box-sizing: border-box;box-sizing: border-box;z-index: 100000;-webkit-user-select: none;-moz-user-select: none;-ms-user-select: none;user-select: none;display: flex;width: 58px;-ms-flex-wrap: wrap;flex-wrap: wrap;-webkit-box-orient: horizontal;-webkit-box-direction: ").concat(r ? "normal" : "reverse", ";-ms-flex-direction: ").concat(r ? "row" : "row-reverse", ";flex-direction: ").concat(r ? "row" : "row-reverse", ";}._th-container ._th-item:hover {opacity: .8;background-color: #5fb492;color: aliceblue}._th-container ._th-item:active {opacity: .9;background-color: #1b3a26;color: aliceblue}._th-container:hover ._th-click-hover {opacity: .8}._th-container:hover ._th-item {opacity: .6;").concat(n, ": 0}._th-container ._th-click-hover:hover {opacity: .8;background-color: #5fb492;color: aliceblue}._th_cover-all-show-times {position: fixed;top: 0;").concat(n, ": 0;width: 100%;height: 100%;z-index: 99999;opacity: 1;font-weight: 900;font-size: 30px;color: #4f4f4f;background-color: rgba(0, 0, 0, 0.1)}._th_cover-all-show-times._th_hidden {z-index: -99999;opacity: 0;-webkit-transition: 1s all;-o-transition: 1s all;transition: 1s all}._th_cover-all-show-times ._th_times {width: 300px;height: 300px;border-radius: 50%;background-color: rgba(127, 255, 212, 0.51);text-align: center;line-height: 300px;position: absolute;top: 50%;").concat(n, ": 50%;margin-top: -150px;margin-").concat(n, ": -150px}")
				}
			}, {
				key: "onUiRateChange",
				value: function (t) {
					if (B(c(a.prototype), "onUiRateChange", this).call(this, t), this.nodeElement) {
						var e = this.nodeElement.querySelector("._th-click-hover") || {},
							n = this.nodeElement.querySelector("._th_times") || {},
							r = this.displayNum;
						e.innerHTML = "x" + r, n.innerHTML = "x" + r;
						var i = this.nodeElement.querySelector("._th_cover-all-show-times") || {};
						i.className = "_th_cover-all-show-times", this.setTimeoutOrigin.bind(this.window)((function () {
							i.className = "_th_cover-all-show-times _th_hidden"
						}), 100)
					}
				}
			}, {
				key: "position",
				get: function () {
					return this.getConfig("position")
				}
			}, {
				key: "positionOffset",
				get: function () {
					return this.getConfig("positionOffset")
				}
			}, {
				key: "declareConfigs",
				value: function () {
					return [{
						key: "position",
						type: f.STRING,
						default: "left"
					}, {
						key: "positionOffset",
						type: f.STRING,
						default: "0%"
					}, {
						key: "showSuspendedBall",
						type: f.BOOLEAN,
						default: true,
						title: "Show Suspended Ball"
					}, {
						key: "deeplyColor",
						type: f.BOOLEAN,
						default: false,
						title: "Deeply Color"
					}]
				}
			}]), a
		}(H),
		te = new F;
	return te.exportOuter(), te.registerModule(new Jt(new Qt)), te.registerModule(new Ht), te.registerModule(new It), te.registerModule(new Et), te.registerModule(new Nt, !0), te.registerModule(new Zt, !0), te.bootstrap(), te
}));
