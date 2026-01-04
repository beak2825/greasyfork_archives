// ==UserScript==
// @name              GitHub Relative Time Format
// @name:zh-CN        GitHub 时间格式化
// @namespace         https://greasyfork.org/zh-CN/scripts/480032-github-relative-time-format
// @version           0.7.1
// @description       replacing GitHub relative timestamps(<relative-time>) with customizable date and time formats
// @description:zh-CN 用自定义的日期时间格式替换 GitHub 时间显示（<relative-time>）
// @author            MuXiu1997 (https://github.com/MuXiu1997)
// @license           MIT
// @homepageURL       https://github.com/MuXiu1997/github-relative-time-format
// @supportURL        https://github.com/MuXiu1997/github-relative-time-format
// @match             https://github.com/**
// @icon              https://www.google.com/s2/favicons?sz=64&domain=github.com
// @grant             GM_getValue
// @grant             GM_setValue
// @grant             GM_registerMenuCommand
// @grant             GM_unregisterMenuCommand
// @require           https://cdn.jsdelivr.net/npm/dayjs@1.11.19/dayjs.min.js
// @require           https://cdn.jsdelivr.net/npm/ts-debounce@4.0.0/dist/src/index.umd.js
// @downloadURL https://update.greasyfork.org/scripts/480032/GitHub%20Relative%20Time%20Format.user.js
// @updateURL https://update.greasyfork.org/scripts/480032/GitHub%20Relative%20Time%20Format.meta.js
// ==/UserScript==
(function(ts_debounce, dayjs) {

//#region rolldown:runtime
	var __create = Object.create;
	var __defProp = Object.defineProperty;
	var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
	var __getOwnPropNames = Object.getOwnPropertyNames;
	var __getProtoOf = Object.getPrototypeOf;
	var __hasOwnProp = Object.prototype.hasOwnProperty;
	var __copyProps = (to, from, except, desc) => {
		if (from && typeof from === "object" || typeof from === "function") {
			for (var keys = __getOwnPropNames(from), i = 0, n = keys.length, key; i < n; i++) {
				key = keys[i];
				if (!__hasOwnProp.call(to, key) && key !== except) {
					__defProp(to, key, {
						get: ((k) => from[k]).bind(null, key),
						enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable
					});
				}
			}
		}
		return to;
	};
	var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", {
		value: mod,
		enumerable: true
	}) : target, mod));

//#endregion
dayjs = __toESM(dayjs);

//#region node_modules/.pnpm/alien-signals@3.1.0/node_modules/alien-signals/esm/system.mjs
	function createReactiveSystem({ update, notify, unwatched }) {
		return {
			link: link$1,
			unlink: unlink$1,
			propagate: propagate$1,
			checkDirty: checkDirty$1,
			shallowPropagate: shallowPropagate$1
		};
		function link$1(dep, sub, version$1) {
			const prevDep = sub.depsTail;
			if (prevDep !== void 0 && prevDep.dep === dep) return;
			const nextDep = prevDep !== void 0 ? prevDep.nextDep : sub.deps;
			if (nextDep !== void 0 && nextDep.dep === dep) {
				nextDep.version = version$1;
				sub.depsTail = nextDep;
				return;
			}
			const prevSub = dep.subsTail;
			if (prevSub !== void 0 && prevSub.version === version$1 && prevSub.sub === sub) return;
			const newLink = sub.depsTail = dep.subsTail = {
				version: version$1,
				dep,
				sub,
				prevDep,
				nextDep,
				prevSub,
				nextSub: void 0
			};
			if (nextDep !== void 0) nextDep.prevDep = newLink;
			if (prevDep !== void 0) prevDep.nextDep = newLink;
			else sub.deps = newLink;
			if (prevSub !== void 0) prevSub.nextSub = newLink;
			else dep.subs = newLink;
		}
		function unlink$1(link$2, sub = link$2.sub) {
			const dep = link$2.dep;
			const prevDep = link$2.prevDep;
			const nextDep = link$2.nextDep;
			const nextSub = link$2.nextSub;
			const prevSub = link$2.prevSub;
			if (nextDep !== void 0) nextDep.prevDep = prevDep;
			else sub.depsTail = prevDep;
			if (prevDep !== void 0) prevDep.nextDep = nextDep;
			else sub.deps = nextDep;
			if (nextSub !== void 0) nextSub.prevSub = prevSub;
			else dep.subsTail = prevSub;
			if (prevSub !== void 0) prevSub.nextSub = nextSub;
			else if ((dep.subs = nextSub) === void 0) unwatched(dep);
			return nextDep;
		}
		function propagate$1(link$2) {
			let next = link$2.nextSub;
			let stack;
			top: do {
				const sub = link$2.sub;
				let flags = sub.flags;
				if (!(flags & 60)) sub.flags = flags | 32;
				else if (!(flags & 12)) flags = 0;
				else if (!(flags & 4)) sub.flags = flags & -9 | 32;
				else if (!(flags & 48) && isValidLink(link$2, sub)) {
					sub.flags = flags | 40;
					flags &= 1;
				} else flags = 0;
				if (flags & 2) notify(sub);
				if (flags & 1) {
					const subSubs = sub.subs;
					if (subSubs !== void 0) {
						const nextSub = (link$2 = subSubs).nextSub;
						if (nextSub !== void 0) {
							stack = {
								value: next,
								prev: stack
							};
							next = nextSub;
						}
						continue;
					}
				}
				if ((link$2 = next) !== void 0) {
					next = link$2.nextSub;
					continue;
				}
				while (stack !== void 0) {
					link$2 = stack.value;
					stack = stack.prev;
					if (link$2 !== void 0) {
						next = link$2.nextSub;
						continue top;
					}
				}
				break;
			} while (true);
		}
		function checkDirty$1(link$2, sub) {
			let stack;
			let checkDepth = 0;
			let dirty = false;
			top: do {
				const dep = link$2.dep;
				const flags = dep.flags;
				if (sub.flags & 16) dirty = true;
				else if ((flags & 17) === 17) {
					if (update(dep)) {
						const subs = dep.subs;
						if (subs.nextSub !== void 0) shallowPropagate$1(subs);
						dirty = true;
					}
				} else if ((flags & 33) === 33) {
					if (link$2.nextSub !== void 0 || link$2.prevSub !== void 0) stack = {
						value: link$2,
						prev: stack
					};
					link$2 = dep.deps;
					sub = dep;
					++checkDepth;
					continue;
				}
				if (!dirty) {
					const nextDep = link$2.nextDep;
					if (nextDep !== void 0) {
						link$2 = nextDep;
						continue;
					}
				}
				while (checkDepth--) {
					const firstSub = sub.subs;
					const hasMultipleSubs = firstSub.nextSub !== void 0;
					if (hasMultipleSubs) {
						link$2 = stack.value;
						stack = stack.prev;
					} else link$2 = firstSub;
					if (dirty) {
						if (update(sub)) {
							if (hasMultipleSubs) shallowPropagate$1(firstSub);
							sub = link$2.sub;
							continue;
						}
						dirty = false;
					} else sub.flags &= -33;
					sub = link$2.sub;
					const nextDep = link$2.nextDep;
					if (nextDep !== void 0) {
						link$2 = nextDep;
						continue top;
					}
				}
				return dirty;
			} while (true);
		}
		function shallowPropagate$1(link$2) {
			do {
				const sub = link$2.sub;
				const flags = sub.flags;
				if ((flags & 48) === 32) {
					sub.flags = flags | 16;
					if ((flags & 6) === 2) notify(sub);
				}
			} while ((link$2 = link$2.nextSub) !== void 0);
		}
		function isValidLink(checkLink, sub) {
			let link$2 = sub.depsTail;
			while (link$2 !== void 0) {
				if (link$2 === checkLink) return true;
				link$2 = link$2.prevDep;
			}
			return false;
		}
	}

//#endregion
//#region node_modules/.pnpm/alien-signals@3.1.0/node_modules/alien-signals/esm/index.mjs
	let cycle = 0;
	let batchDepth = 0;
	let notifyIndex = 0;
	let queuedLength = 0;
	let activeSub;
	const queued = [];
	const { link, unlink, propagate, checkDirty, shallowPropagate } = createReactiveSystem({
		update(node) {
			if (node.depsTail !== void 0) return updateComputed(node);
			else return updateSignal(node);
		},
		notify(effect$1) {
			let insertIndex = queuedLength;
			let firstInsertedIndex = insertIndex;
			do {
				var _effect$subs;
				effect$1.flags &= -3;
				queued[insertIndex++] = effect$1;
				effect$1 = (_effect$subs = effect$1.subs) === null || _effect$subs === void 0 ? void 0 : _effect$subs.sub;
				if (effect$1 === void 0 || !(effect$1.flags & 2)) break;
			} while (true);
			queuedLength = insertIndex;
			while (firstInsertedIndex < --insertIndex) {
				const left = queued[firstInsertedIndex];
				queued[firstInsertedIndex++] = queued[insertIndex];
				queued[insertIndex] = left;
			}
		},
		unwatched(node) {
			if (!(node.flags & 1)) effectScopeOper.call(node);
			else if (node.depsTail !== void 0) {
				node.depsTail = void 0;
				node.flags = 17;
				purgeDeps(node);
			}
		}
	});
	function setActiveSub(sub) {
		const prevSub = activeSub;
		activeSub = sub;
		return prevSub;
	}
	function signal(initialValue) {
		return signalOper.bind({
			currentValue: initialValue,
			pendingValue: initialValue,
			subs: void 0,
			subsTail: void 0,
			flags: 1
		});
	}
	function computed(getter) {
		return computedOper.bind({
			value: void 0,
			subs: void 0,
			subsTail: void 0,
			deps: void 0,
			depsTail: void 0,
			flags: 0,
			getter
		});
	}
	function effect(fn) {
		const e = {
			fn,
			subs: void 0,
			subsTail: void 0,
			deps: void 0,
			depsTail: void 0,
			flags: 6
		};
		const prevSub = setActiveSub(e);
		if (prevSub !== void 0) link(e, prevSub, 0);
		try {
			e.fn();
		} finally {
			activeSub = prevSub;
			e.flags &= -5;
		}
		return effectOper.bind(e);
	}
	function updateComputed(c) {
		++cycle;
		c.depsTail = void 0;
		c.flags = 5;
		const prevSub = setActiveSub(c);
		try {
			const oldValue = c.value;
			return oldValue !== (c.value = c.getter(oldValue));
		} finally {
			activeSub = prevSub;
			c.flags &= -5;
			purgeDeps(c);
		}
	}
	function updateSignal(s) {
		s.flags = 1;
		return s.currentValue !== (s.currentValue = s.pendingValue);
	}
	function run(e) {
		const flags = e.flags;
		if (flags & 16 || flags & 32 && checkDirty(e.deps, e)) {
			++cycle;
			e.depsTail = void 0;
			e.flags = 6;
			const prevSub = setActiveSub(e);
			try {
				e.fn();
			} finally {
				activeSub = prevSub;
				e.flags &= -5;
				purgeDeps(e);
			}
		} else e.flags = 2;
	}
	function flush() {
		while (notifyIndex < queuedLength) {
			const effect$1 = queued[notifyIndex];
			queued[notifyIndex++] = void 0;
			run(effect$1);
		}
		notifyIndex = 0;
		queuedLength = 0;
	}
	function computedOper() {
		const flags = this.flags;
		if (flags & 16 || flags & 32 && (checkDirty(this.deps, this) || (this.flags = flags & -33, false))) {
			if (updateComputed(this)) {
				const subs = this.subs;
				if (subs !== void 0) shallowPropagate(subs);
			}
		} else if (!flags) {
			this.flags = 5;
			const prevSub = setActiveSub(this);
			try {
				this.value = this.getter();
			} finally {
				activeSub = prevSub;
				this.flags &= -5;
			}
		}
		const sub = activeSub;
		if (sub !== void 0) link(this, sub, cycle);
		return this.value;
	}
	function signalOper(...value) {
		if (value.length) {
			if (this.pendingValue !== (this.pendingValue = value[0])) {
				this.flags = 17;
				const subs = this.subs;
				if (subs !== void 0) {
					propagate(subs);
					if (!batchDepth) flush();
				}
			}
		} else {
			if (this.flags & 16) {
				if (updateSignal(this)) {
					const subs = this.subs;
					if (subs !== void 0) shallowPropagate(subs);
				}
			}
			let sub = activeSub;
			while (sub !== void 0) {
				var _sub$subs;
				if (sub.flags & 3) {
					link(this, sub, cycle);
					break;
				}
				sub = (_sub$subs = sub.subs) === null || _sub$subs === void 0 ? void 0 : _sub$subs.sub;
			}
			return this.currentValue;
		}
	}
	function effectOper() {
		effectScopeOper.call(this);
	}
	function effectScopeOper() {
		this.depsTail = void 0;
		this.flags = 0;
		purgeDeps(this);
		const sub = this.subs;
		if (sub !== void 0) unlink(sub);
	}
	function purgeDeps(sub) {
		const depsTail = sub.depsTail;
		let dep = depsTail !== void 0 ? depsTail.nextDep : sub.deps;
		while (dep !== void 0) dep = unlink(dep, sub);
	}

//#endregion
//#region \0@oxc-project+runtime@0.98.0/helpers/typeof.js
	function _typeof(o) {
		"@babel/helpers - typeof";
		return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function(o$1) {
			return typeof o$1;
		} : function(o$1) {
			return o$1 && "function" == typeof Symbol && o$1.constructor === Symbol && o$1 !== Symbol.prototype ? "symbol" : typeof o$1;
		}, _typeof(o);
	}

//#endregion
//#region \0@oxc-project+runtime@0.98.0/helpers/toPrimitive.js
	function toPrimitive(t, r) {
		if ("object" != _typeof(t) || !t) return t;
		var e = t[Symbol.toPrimitive];
		if (void 0 !== e) {
			var i = e.call(t, r || "default");
			if ("object" != _typeof(i)) return i;
			throw new TypeError("@@toPrimitive must return a primitive value.");
		}
		return ("string" === r ? String : Number)(t);
	}

//#endregion
//#region \0@oxc-project+runtime@0.98.0/helpers/toPropertyKey.js
	function toPropertyKey(t) {
		var i = toPrimitive(t, "string");
		return "symbol" == _typeof(i) ? i : i + "";
	}

//#endregion
//#region \0@oxc-project+runtime@0.98.0/helpers/defineProperty.js
	function _defineProperty(e, r, t) {
		return (r = toPropertyKey(r)) in e ? Object.defineProperty(e, r, {
			value: t,
			enumerable: !0,
			configurable: !0,
			writable: !0
		}) : e[r] = t, e;
	}

//#endregion
//#region \0@oxc-project+runtime@0.98.0/helpers/objectSpread2.js
	function ownKeys(e, r) {
		var t = Object.keys(e);
		if (Object.getOwnPropertySymbols) {
			var o = Object.getOwnPropertySymbols(e);
			r && (o = o.filter(function(r$1) {
				return Object.getOwnPropertyDescriptor(e, r$1).enumerable;
			})), t.push.apply(t, o);
		}
		return t;
	}
	function _objectSpread2(e) {
		for (var r = 1; r < arguments.length; r++) {
			var t = null != arguments[r] ? arguments[r] : {};
			r % 2 ? ownKeys(Object(t), !0).forEach(function(r$1) {
				_defineProperty(e, r$1, t[r$1]);
			}) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(t)) : ownKeys(Object(t)).forEach(function(r$1) {
				Object.defineProperty(e, r$1, Object.getOwnPropertyDescriptor(t, r$1));
			});
		}
		return e;
	}

//#endregion
//#region node_modules/.pnpm/consola@3.4.2/node_modules/consola/dist/core.mjs
	const LogLevels = {
		silent: Number.NEGATIVE_INFINITY,
		fatal: 0,
		error: 0,
		warn: 1,
		log: 2,
		info: 3,
		success: 3,
		fail: 3,
		ready: 3,
		start: 3,
		box: 3,
		debug: 4,
		trace: 5,
		verbose: Number.POSITIVE_INFINITY
	};
	const LogTypes = {
		silent: { level: -1 },
		fatal: { level: LogLevels.fatal },
		error: { level: LogLevels.error },
		warn: { level: LogLevels.warn },
		log: { level: LogLevels.log },
		info: { level: LogLevels.info },
		success: { level: LogLevels.success },
		fail: { level: LogLevels.fail },
		ready: { level: LogLevels.info },
		start: { level: LogLevels.info },
		box: { level: LogLevels.info },
		debug: { level: LogLevels.debug },
		trace: { level: LogLevels.trace },
		verbose: { level: LogLevels.verbose }
	};
	function isPlainObject$1(value) {
		if (value === null || typeof value !== "object") return false;
		const prototype = Object.getPrototypeOf(value);
		if (prototype !== null && prototype !== Object.prototype && Object.getPrototypeOf(prototype) !== null) return false;
		if (Symbol.iterator in value) return false;
		if (Symbol.toStringTag in value) return Object.prototype.toString.call(value) === "[object Module]";
		return true;
	}
	function _defu(baseObject, defaults, namespace = ".", merger) {
		if (!isPlainObject$1(defaults)) return _defu(baseObject, {}, namespace, merger);
		const object = Object.assign({}, defaults);
		for (const key in baseObject) {
			if (key === "__proto__" || key === "constructor") continue;
			const value = baseObject[key];
			if (value === null || value === void 0) continue;
			if (merger && merger(object, key, value, namespace)) continue;
			if (Array.isArray(value) && Array.isArray(object[key])) object[key] = [...value, ...object[key]];
			else if (isPlainObject$1(value) && isPlainObject$1(object[key])) object[key] = _defu(value, object[key], (namespace ? `${namespace}.` : "") + key.toString(), merger);
			else object[key] = value;
		}
		return object;
	}
	function createDefu(merger) {
		return (...arguments_) => arguments_.reduce((p, c) => _defu(p, c, "", merger), {});
	}
	const defu = createDefu();
	function isPlainObject(obj) {
		return Object.prototype.toString.call(obj) === "[object Object]";
	}
	function isLogObj(arg) {
		if (!isPlainObject(arg)) return false;
		if (!arg.message && !arg.args) return false;
		if (arg.stack) return false;
		return true;
	}
	let paused = false;
	const queue = [];
	var Consola = class Consola {
		/**
		* Creates an instance of Consola with specified options or defaults.
		*
		* @param {Partial<ConsolaOptions>} [options={}] - Configuration options for the Consola instance.
		*/
		constructor(options = {}) {
			const types = options.types || LogTypes;
			this.options = defu(_objectSpread2(_objectSpread2({}, options), {}, {
				defaults: _objectSpread2({}, options.defaults),
				level: _normalizeLogLevel(options.level, types),
				reporters: [...options.reporters || []]
			}), {
				types: LogTypes,
				throttle: 1e3,
				throttleMin: 5,
				formatOptions: {
					date: true,
					colors: false,
					compact: true
				}
			});
			for (const type in types) {
				const defaults = _objectSpread2(_objectSpread2({ type }, this.options.defaults), types[type]);
				this[type] = this._wrapLogFn(defaults);
				this[type].raw = this._wrapLogFn(defaults, true);
			}
			if (this.options.mockFn) this.mockTypes();
			this._lastLog = {};
		}
		/**
		* Gets the current log level of the Consola instance.
		*
		* @returns {number} The current log level.
		*/
		get level() {
			return this.options.level;
		}
		/**
		* Sets the minimum log level that will be output by the instance.
		*
		* @param {number} level - The new log level to set.
		*/
		set level(level) {
			this.options.level = _normalizeLogLevel(level, this.options.types, this.options.level);
		}
		/**
		* Displays a prompt to the user and returns the response.
		* Throw an error if `prompt` is not supported by the current configuration.
		*
		* @template T
		* @param {string} message - The message to display in the prompt.
		* @param {T} [opts] - Optional options for the prompt. See {@link PromptOptions}.
		* @returns {promise<T>} A promise that infer with the prompt options. See {@link PromptOptions}.
		*/
		prompt(message, opts) {
			if (!this.options.prompt) throw new Error("prompt is not supported!");
			return this.options.prompt(message, opts);
		}
		/**
		* Creates a new instance of Consola, inheriting options from the current instance, with possible overrides.
		*
		* @param {Partial<ConsolaOptions>} options - Optional overrides for the new instance. See {@link ConsolaOptions}.
		* @returns {ConsolaInstance} A new Consola instance. See {@link ConsolaInstance}.
		*/
		create(options) {
			const instance = new Consola(_objectSpread2(_objectSpread2({}, this.options), options));
			if (this._mockFn) instance.mockTypes(this._mockFn);
			return instance;
		}
		/**
		* Creates a new Consola instance with the specified default log object properties.
		*
		* @param {InputLogObject} defaults - Default properties to include in any log from the new instance. See {@link InputLogObject}.
		* @returns {ConsolaInstance} A new Consola instance. See {@link ConsolaInstance}.
		*/
		withDefaults(defaults) {
			return this.create(_objectSpread2(_objectSpread2({}, this.options), {}, { defaults: _objectSpread2(_objectSpread2({}, this.options.defaults), defaults) }));
		}
		/**
		* Creates a new Consola instance with a specified tag, which will be included in every log.
		*
		* @param {string} tag - The tag to include in each log of the new instance.
		* @returns {ConsolaInstance} A new Consola instance. See {@link ConsolaInstance}.
		*/
		withTag(tag) {
			return this.withDefaults({ tag: this.options.defaults.tag ? this.options.defaults.tag + ":" + tag : tag });
		}
		/**
		* Adds a custom reporter to the Consola instance.
		* Reporters will be called for each log message, depending on their implementation and log level.
		*
		* @param {ConsolaReporter} reporter - The reporter to add. See {@link ConsolaReporter}.
		* @returns {Consola} The current Consola instance.
		*/
		addReporter(reporter) {
			this.options.reporters.push(reporter);
			return this;
		}
		/**
		* Removes a custom reporter from the Consola instance.
		* If no reporter is specified, all reporters will be removed.
		*
		* @param {ConsolaReporter} reporter - The reporter to remove. See {@link ConsolaReporter}.
		* @returns {Consola} The current Consola instance.
		*/
		removeReporter(reporter) {
			if (reporter) {
				const i = this.options.reporters.indexOf(reporter);
				if (i !== -1) return this.options.reporters.splice(i, 1);
			} else this.options.reporters.splice(0);
			return this;
		}
		/**
		* Replaces all reporters of the Consola instance with the specified array of reporters.
		*
		* @param {ConsolaReporter[]} reporters - The new reporters to set. See {@link ConsolaReporter}.
		* @returns {Consola} The current Consola instance.
		*/
		setReporters(reporters) {
			this.options.reporters = Array.isArray(reporters) ? reporters : [reporters];
			return this;
		}
		wrapAll() {
			this.wrapConsole();
			this.wrapStd();
		}
		restoreAll() {
			this.restoreConsole();
			this.restoreStd();
		}
		/**
		* Overrides console methods with Consola logging methods for consistent logging.
		*/
		wrapConsole() {
			for (const type in this.options.types) {
				if (!console["__" + type]) console["__" + type] = console[type];
				console[type] = this[type].raw;
			}
		}
		/**
		* Restores the original console methods, removing Consola overrides.
		*/
		restoreConsole() {
			for (const type in this.options.types) if (console["__" + type]) {
				console[type] = console["__" + type];
				delete console["__" + type];
			}
		}
		/**
		* Overrides standard output and error streams to redirect them through Consola.
		*/
		wrapStd() {
			this._wrapStream(this.options.stdout, "log");
			this._wrapStream(this.options.stderr, "log");
		}
		_wrapStream(stream, type) {
			if (!stream) return;
			if (!stream.__write) stream.__write = stream.write;
			stream.write = (data) => {
				this[type].raw(String(data).trim());
			};
		}
		/**
		* Restores the original standard output and error streams, removing the Consola redirection.
		*/
		restoreStd() {
			this._restoreStream(this.options.stdout);
			this._restoreStream(this.options.stderr);
		}
		_restoreStream(stream) {
			if (!stream) return;
			if (stream.__write) {
				stream.write = stream.__write;
				delete stream.__write;
			}
		}
		/**
		* Pauses logging, queues incoming logs until resumed.
		*/
		pauseLogs() {
			paused = true;
		}
		/**
		* Resumes logging, processing any queued logs.
		*/
		resumeLogs() {
			paused = false;
			const _queue = queue.splice(0);
			for (const item of _queue) item[0]._logFn(item[1], item[2]);
		}
		/**
		* Replaces logging methods with mocks if a mock function is provided.
		*
		* @param {ConsolaOptions["mockFn"]} mockFn - The function to use for mocking logging methods. See {@link ConsolaOptions["mockFn"]}.
		*/
		mockTypes(mockFn) {
			const _mockFn = mockFn || this.options.mockFn;
			this._mockFn = _mockFn;
			if (typeof _mockFn !== "function") return;
			for (const type in this.options.types) {
				this[type] = _mockFn(type, this.options.types[type]) || this[type];
				this[type].raw = this[type];
			}
		}
		_wrapLogFn(defaults, isRaw) {
			return (...args) => {
				if (paused) {
					queue.push([
						this,
						defaults,
						args,
						isRaw
					]);
					return;
				}
				return this._logFn(defaults, args, isRaw);
			};
		}
		_logFn(defaults, args, isRaw) {
			if ((defaults.level || 0) > this.level) return false;
			const logObj = _objectSpread2(_objectSpread2({
				date: /* @__PURE__ */ new Date(),
				args: []
			}, defaults), {}, { level: _normalizeLogLevel(defaults.level, this.options.types) });
			if (!isRaw && args.length === 1 && isLogObj(args[0])) Object.assign(logObj, args[0]);
			else logObj.args = [...args];
			if (logObj.message) {
				logObj.args.unshift(logObj.message);
				delete logObj.message;
			}
			if (logObj.additional) {
				if (!Array.isArray(logObj.additional)) logObj.additional = logObj.additional.split("\n");
				logObj.args.push("\n" + logObj.additional.join("\n"));
				delete logObj.additional;
			}
			logObj.type = typeof logObj.type === "string" ? logObj.type.toLowerCase() : "log";
			logObj.tag = typeof logObj.tag === "string" ? logObj.tag : "";
			const resolveLog = (newLog = false) => {
				const repeated = (this._lastLog.count || 0) - this.options.throttleMin;
				if (this._lastLog.object && repeated > 0) {
					const args2 = [...this._lastLog.object.args];
					if (repeated > 1) args2.push(`(repeated ${repeated} times)`);
					this._log(_objectSpread2(_objectSpread2({}, this._lastLog.object), {}, { args: args2 }));
					this._lastLog.count = 1;
				}
				if (newLog) {
					this._lastLog.object = logObj;
					this._log(logObj);
				}
			};
			clearTimeout(this._lastLog.timeout);
			const diffTime = this._lastLog.time && logObj.date ? logObj.date.getTime() - this._lastLog.time.getTime() : 0;
			this._lastLog.time = logObj.date;
			if (diffTime < this.options.throttle) try {
				const serializedLog = JSON.stringify([
					logObj.type,
					logObj.tag,
					logObj.args
				]);
				const isSameLog = this._lastLog.serialized === serializedLog;
				this._lastLog.serialized = serializedLog;
				if (isSameLog) {
					this._lastLog.count = (this._lastLog.count || 0) + 1;
					if (this._lastLog.count > this.options.throttleMin) {
						this._lastLog.timeout = setTimeout(resolveLog, this.options.throttle);
						return;
					}
				}
			} catch (_unused) {}
			resolveLog(true);
		}
		_log(logObj) {
			for (const reporter of this.options.reporters) reporter.log(logObj, { options: this.options });
		}
	};
	function _normalizeLogLevel(input, types = {}, defaultLevel = 3) {
		if (input === void 0) return defaultLevel;
		if (typeof input === "number") return input;
		if (types[input] && types[input].level !== void 0) return types[input].level;
		return defaultLevel;
	}
	Consola.prototype.add = Consola.prototype.addReporter;
	Consola.prototype.remove = Consola.prototype.removeReporter;
	Consola.prototype.clear = Consola.prototype.removeReporter;
	Consola.prototype.withScope = Consola.prototype.withTag;
	Consola.prototype.mock = Consola.prototype.mockTypes;
	Consola.prototype.pause = Consola.prototype.pauseLogs;
	Consola.prototype.resume = Consola.prototype.resumeLogs;
	function createConsola(options = {}) {
		return new Consola(options);
	}

//#endregion
//#region node_modules/.pnpm/consola@3.4.2/node_modules/consola/dist/browser.mjs
	var BrowserReporter = class {
		constructor(options) {
			this.options = _objectSpread2({}, options);
			this.defaultColor = "#7f8c8d";
			this.levelColorMap = {
				0: "#c0392b",
				1: "#f39c12",
				3: "#00BCD4"
			};
			this.typeColorMap = { success: "#2ecc71" };
		}
		_getLogFn(level) {
			if (level < 1) return console.__error || console.error;
			if (level === 1) return console.__warn || console.warn;
			return console.__log || console.log;
		}
		log(logObj) {
			const consoleLogFn = this._getLogFn(logObj.level);
			const type = logObj.type === "log" ? "" : logObj.type;
			const tag = logObj.tag || "";
			const style = `
      background: ${this.typeColorMap[logObj.type] || this.levelColorMap[logObj.level] || this.defaultColor};
      border-radius: 0.5em;
      color: white;
      font-weight: bold;
      padding: 2px 0.5em;
    `;
			const badge = `%c${[tag, type].filter(Boolean).join(":")}`;
			if (typeof logObj.args[0] === "string") consoleLogFn(`${badge}%c ${logObj.args[0]}`, style, "", ...logObj.args.slice(1));
			else consoleLogFn(badge, style, ...logObj.args);
		}
	};
	function createConsola$1(options = {}) {
		return createConsola(_objectSpread2({
			reporters: options.reporters || [new BrowserReporter({})],
			prompt(message, options2 = {}) {
				if (options2.type === "confirm") return Promise.resolve(confirm(message));
				return Promise.resolve(prompt(message));
			}
		}, options));
	}
	const consola = createConsola$1();

//#endregion
//#region package.json
	var version = "0.7.1";

//#endregion
//#region src/core.ts
	const logger = consola.withDefaults({ tag: "GRTF" });
	/** Check if the element is a valid relative-time custom element */
	function isRelativeTimeElement(element) {
		return element instanceof HTMLElement && element.tagName === "RELATIVE-TIME";
	}
	/**
	* Check if the node is a <relative-time> element or sits inside one (including Shadow DOM).
	* This is efficient for attribute or characterData mutations.
	*/
	function isInsideRelativeTime(node) {
		if (!node) return false;
		const element = node instanceof Element ? node : node.parentElement;
		if (element === null || element === void 0 ? void 0 : element.closest("relative-time")) return true;
		const root = node.getRootNode();
		return root instanceof ShadowRoot && isRelativeTimeElement(root.host);
	}
	/**
	* Check if the element contains any <relative-time> descendants.
	* This is useful for childList mutations where a container might be added.
	*/
	function isContainingRelativeTime(node) {
		return node instanceof Element && node.getElementsByTagName("relative-time").length > 0;
	}
	/** Determine if the element should preserve its native format based on attributes */
	function shouldPreserveNativeFormat(element) {
		const format = element.getAttribute("format");
		return format === "duration" || format === "elapsed";
	}
	/** Apply custom format to a single relative-time element */
	function applyCustomFormat(element, displayFormat, tooltipFormat) {
		const startTime = performance.now();
		const datetime = element.getAttribute("datetime");
		if (!datetime) return;
		const date = (0, dayjs.default)(datetime);
		if (!date.isValid()) return;
		element.title = date.format(tooltipFormat);
		try {
			var _element$disconnected;
			(_element$disconnected = element.disconnectedCallback) === null || _element$disconnected === void 0 || _element$disconnected.call(element);
			let updated = false;
			if (element.shadowRoot) {
				const newContent = date.format(displayFormat);
				if (element.shadowRoot.innerHTML !== newContent) {
					element.shadowRoot.innerHTML = newContent;
					updated = true;
				}
			} else {
				const newContent = date.format(displayFormat);
				if (element.textContent !== newContent) {
					element.textContent = newContent;
					updated = true;
				}
			}
			if (updated) {
				const duration = performance.now() - startTime;
				logger.debug(`Updated element:`, element, `in ${duration.toFixed(3)}ms`);
			}
		} catch (error) {
			logger.warn("Error updating element", element, error);
		}
	}
	/** Restore the native behavior of the relative-time element */
	function restoreNativeFormat(element) {
		try {
			var _element$connectedCal;
			(_element$connectedCal = element.connectedCallback) === null || _element$connectedCal === void 0 || _element$connectedCal.call(element);
		} catch (error) {
			logger.warn("Error restoring element", element, error);
		}
	}
	/** Iterate and update all relative-time elements in the DOM */
	function updateAllElements(displayFormat, tooltipFormat) {
		const startTime = performance.now();
		const elements = document.querySelectorAll(`relative-time`);
		if (elements.length === 0) return;
		let updateCount = 0;
		for (const element of elements) if (shouldPreserveNativeFormat(element)) restoreNativeFormat(element);
		else {
			applyCustomFormat(element, displayFormat, tooltipFormat);
			updateCount++;
		}
		const duration = performance.now() - startTime;
		if (updateCount > 0) logger.debug({
			type: "success",
			message: `Total updated: ${updateCount} elements in ${duration.toFixed(3)}ms`
		});
	}

//#endregion
//#region \0@oxc-project+runtime@0.98.0/helpers/asyncToGenerator.js
	function asyncGeneratorStep(n, t, e, r, o, a, c) {
		try {
			var i = n[a](c), u = i.value;
		} catch (n$1) {
			e(n$1);
			return;
		}
		i.done ? t(u) : Promise.resolve(u).then(r, o);
	}
	function _asyncToGenerator(n) {
		return function() {
			var t = this, e = arguments;
			return new Promise(function(r, o) {
				var a = n.apply(t, e);
				function _next(n$1) {
					asyncGeneratorStep(a, r, o, _next, _throw, "next", n$1);
				}
				function _throw(n$1) {
					asyncGeneratorStep(a, r, o, _next, _throw, "throw", n$1);
				}
				_next(void 0);
			});
		};
	}

//#endregion
//#region src/ui.ts
	let activeResolve = null;
	/**
	* Show a GitHub-style modal for option editing
	*/
	function showOptionModal(_x, _x2, _x3) {
		return _showOptionModal.apply(this, arguments);
	}
	function _showOptionModal() {
		_showOptionModal = _asyncToGenerator(function* (title, currentValue, type) {
			if (activeResolve) {
				activeResolve(null);
				activeResolve = null;
			}
			const existingDialog = document.querySelector("dialog[data-grtf-modal]");
			if (existingDialog) {
				existingDialog.close();
				existingDialog.remove();
			}
			return new Promise((resolve) => {
				var _dialog$querySelector, _dialog$querySelector2, _dialog$querySelector3;
				activeResolve = resolve;
				const dialog = document.createElement("dialog");
				dialog.dataset.grtfModal = "";
				dialog.className = "Box Box--overlay d-flex flex-column anim-fade-in fast";
				dialog.style.cssText = `
      width: 448px;
      padding: 0;
      border: 1px solid var(--color-border-default, #30363d);
      border-radius: 6px;
      background-color: var(--bgColor-default, var(--color-canvas-overlay, #161b22));
      color: var(--color-fg-default, #c9d1d9);
      box-shadow: var(--color-shadow-large, 0 8px 24px rgba(1, 4, 9, 0.2));
      position: fixed;
      top: 10%;
      left: 50%;
      transform: translateX(-50%);
      margin: 0;
      display: flex;
    `;
				const isBoolean = type === "boolean";
				dialog.innerHTML = `
      <div class="Box-header d-flex flex-items-center">
        <h3 class="Box-title flex-auto">${title}</h3>
        <button class="btn-octicon" type="button" id="modal-close" aria-label="Close">
          <svg aria-hidden="true" height="16" viewBox="0 0 16 16" width="16" fill="currentColor"><path d="M3.72 3.72a.75.75 0 011.06 0L8 6.94l3.22-3.22a.75.75 0 111.06 1.06L9.06 8l3.22 3.22a.75.75 0 11-1.06 1.06L8 9.06l-3.22 3.22a.75.75 0 01-1.06-1.06L6.94 8 3.72 4.78a.75.75 0 010-1.06z"></path></svg>
        </button>
      </div>
      <div class="Box-body">
        ${isBoolean ? `
          <div class="form-checkbox">
            <label>
              <input type="checkbox" id="modal-input" ${currentValue === "true" ? "checked" : ""}>
              Enable
            </label>
          </div>
          ` : `
          <input type="text" id="modal-input" class="form-control input-block" value="${currentValue}" spellcheck="false">
          `}
      </div>
      <div class="Box-footer text-right">
        <button class="btn btn-secondary mr-2" type="button" id="modal-cancel">Cancel</button>
        <button class="btn btn-primary" type="button" id="modal-save">Save</button>
      </div>
    `;
				if (!document.getElementById("grtf-modal-style")) {
					const style = document.createElement("style");
					style.id = "grtf-modal-style";
					style.textContent = `
        dialog[data-grtf-modal]::backdrop {
          background-color: rgba(0, 0, 0, 0.7);
          backdrop-filter: blur(2px);
        }
        dialog[data-grtf-modal] {
          background-color: var(--bgColor-default, var(--color-canvas-overlay, #161b22)) !important;
        }
      `;
					document.head.appendChild(style);
				}
				document.body.appendChild(dialog);
				dialog.showModal();
				const input = dialog.querySelector("#modal-input");
				const close = () => {
					activeResolve = null;
					dialog.close();
					document.body.removeChild(dialog);
				};
				(_dialog$querySelector = dialog.querySelector("#modal-save")) === null || _dialog$querySelector === void 0 || _dialog$querySelector.addEventListener("click", () => {
					const result = isBoolean ? input.checked ? "true" : "false" : input.value;
					const resolveFn = resolve;
					close();
					resolveFn(result);
				});
				(_dialog$querySelector2 = dialog.querySelector("#modal-cancel")) === null || _dialog$querySelector2 === void 0 || _dialog$querySelector2.addEventListener("click", () => {
					const resolveFn = resolve;
					close();
					resolveFn(null);
				});
				(_dialog$querySelector3 = dialog.querySelector("#modal-close")) === null || _dialog$querySelector3 === void 0 || _dialog$querySelector3.addEventListener("click", () => {
					const resolveFn = resolve;
					close();
					resolveFn(null);
				});
				dialog.addEventListener("cancel", () => {
					activeResolve = null;
					document.body.removeChild(dialog);
					resolve(null);
				});
				setTimeout(() => {
					if (isBoolean) input.focus();
					else {
						input.focus();
						input.select();
					}
				}, 0);
			});
		});
		return _showOptionModal.apply(this, arguments);
	}

//#endregion
//#region src/useOption.ts
/** Option management Hook */
	function useOption(key, title, defaultValue, type = "text") {
		const option = signal(typeof GM_getValue !== "undefined" ? GM_getValue(key, defaultValue) : defaultValue);
		if (typeof GM_setValue !== "undefined" && typeof GM_registerMenuCommand !== "undefined") {
			effect(() => {
				GM_setValue(key, option());
			});
			GM_registerMenuCommand(title, _asyncToGenerator(function* () {
				const result = yield showOptionModal(title, option(), type);
				if (result !== null) option(result);
			}));
		}
		return option;
	}

//#endregion
//#region src/index.ts
/** Main entry point for the userscript */
	function main() {
		const displayFormatOption = useOption("DISPLAY_FORMAT", "Change display format", "YY-MM-DD HH:mm");
		const tooltipFormatOption = useOption("TOOLTIP_FORMAT", "Change tooltip format", "YYYY-MM-DD HH:mm:ss");
		const debugLogOption = useOption("DEBUG_LOG", "Enable debug log", "false", "boolean");
		const loggerLevel = computed(() => debugLogOption() === "true" ? LogLevels.verbose : LogLevels.info);
		const runUpdate = () => {
			updateAllElements(displayFormatOption(), tooltipFormatOption());
		};
		effect(() => {
			runUpdate();
		});
		effect(() => {
			logger.level = loggerLevel();
		});
		logger.info(`GitHub Relative Time Format(v${version}) is loaded`);
		const debouncedUpdate = (0, ts_debounce.debounce)(runUpdate, 100);
		/** Initialize MutationObserver to monitor DOM changes for new relative-time elements */
		const initObserver = () => {
			new MutationObserver((mutations) => {
				let shouldUpdate = false;
				for (const mutation of mutations) {
					const { target, type } = mutation;
					if (type === "attributes" || type === "characterData") {
						if (isInsideRelativeTime(target)) {
							shouldUpdate = true;
							break;
						}
					} else if (type === "childList") {
						if (isInsideRelativeTime(target) || isContainingRelativeTime(target)) {
							shouldUpdate = true;
							break;
						}
					}
				}
				if (shouldUpdate) debouncedUpdate();
			}).observe(document.body, {
				childList: true,
				subtree: true,
				attributes: true,
				characterData: true,
				attributeFilter: ["datetime", "format"]
			});
		};
		initObserver();
	}
	main();

//#endregion
})(tsDebounce, dayjs);