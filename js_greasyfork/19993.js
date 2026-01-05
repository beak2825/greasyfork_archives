// ==UserScript==
// @name         RU AdList JS Fixes
// @namespace    ruadlist_js_fixes
// @version      20240625.1
// @description  try to take over the world!
// @author       lainverse & dimisa
// @license      CC-BY-SA-4.0
// @supportURL   https://greasyfork.org/en/scripts/19993-ru-adlist-js-fixes/feedback
// @match        *://*/*
// @exclude      /^https?:\/\/([^.]+\.)*?(avito\.ru|auth\.wi-fi\.ru|hd\.kinopoisk\.ru|(webntp|bank|brontp(-pr|-beta|-alpha)?|diehard|market(-delivery)?|money|trust)\.yandex\.(by|kz|ru|net)|account\.mail\.ru)([:/]|$)/
// @exclude      /^https?:\/\/([^.]+\.)*?(1cfresh\.com|(alfabank|(cdn-)?tinkoff|sberbank)\.ru|ingress\.com|lineageos\.org|telegram\.org|unicreditbanking\.net)([:/]|$)/
// @compatible   chrome Only with Tampermonkey or Violentmonkey. Только с Tampermonkey или Violentmonkey.
// @compatible   brave Only with Tampermonkey or Violentmonkey. Только с Tampermonkey или Violentmonkey.
// @compatible   vivaldi Only with Tampermonkey or Violentmonkey. Только с Tampermonkey или Violentmonkey.
// @compatible   edge Only in Edge 79+ with Tampermonkey or Violentmonkey. Только в Edge 79+ с Tampermonkey или Violentmonkey.
// @compatible   firefox Only in Firefox 56+ with Tampermonkey. Только Firefox 56+ с Tampermonkey.
// @compatible   opera Only with Tampermonkey. Только с Tampermonkey.
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        GM_listValues
// @grant        GM_registerMenuCommand
// @grant        GM.cookie
// @grant        unsafeWindow
// @grant        window.close
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/19993/RU%20AdList%20JS%20Fixes.user.js
// @updateURL https://update.greasyfork.org/scripts/19993/RU%20AdList%20JS%20Fixes.meta.js
// ==/UserScript==

// jshint esversion: 8
// jshint unused: true
/* eslint no-empty: ["error", { "allowEmptyCatch": true }] */
(function () {
    'use strict';

    const win = (unsafeWindow || window);

    // MooTools are crazy enough to replace standard browser object window.Document: https://mootools.net/core
    // Occasionally their code runs before my script on some domains and causes all kinds of havoc.
    const _Document = Object.getPrototypeOf(HTMLDocument.prototype);
    const _Element = Object.getPrototypeOf(HTMLElement.prototype);
    // dTree 2.05 in some cases replaces Node object
    const _Node = Object.getPrototypeOf(_Element);

    // Prefer to use Proxy object from unsafeWindow since cloneInto require it to be from the same source as the root
    const _Proxy = win.Proxy;
    const _cloneInto = (obj, root = win) => cloneInto(obj, root, { cloneFunctions: true });
    // http://stackoverflow.com/questions/9847580/how-to-detect-safari-chrome-ie-firefox-and-opera-browser
    const
        // isOpera = (!!window.opr && !!window.opr.addons) || !!window.opera || navigator.userAgent.indexOf(' OPR/') >= 0,
        // isChrome = !!window.chrome && !!window.chrome.webstore,
        isSafari =
        Object.prototype.toString.call(window.HTMLElement).indexOf('Constructor') > 0 ||
        (function (p) {
            return p.toString() === "[object SafariRemoteNotification]";
        })(!window.safari || window.safari.pushNotification),
        isFirefox = 'InstallTrigger' in win,
        inIFrame = (win.self !== win.top);
    const
        _bindCall = fun => Function.prototype.call.bind(fun),
        _getAttribute = _bindCall(_Element.getAttribute),
        _setAttribute = _bindCall(_Element.setAttribute),
        _removeAttribute = _bindCall(_Element.removeAttribute),
        _hasOwnProperty = _bindCall(Object.prototype.hasOwnProperty),
        _toString = _bindCall(Function.prototype.toString),
        _document = win.document,
        _de = _document.documentElement,
        _appendChild = _Document.appendChild.bind(_de),
        _removeChild = _Document.removeChild.bind(_de),
        _createElement = _Document.createElement.bind(_document),
        _querySelector = _Document.querySelector.bind(_document),
        _querySelectorAll = _Document.querySelectorAll.bind(_document),
        _apply = Reflect.apply,
        _construct = Reflect.construct;
    const _attachShadow = (() => {
        try {
            return ('attachShadow' in _Element) ? _bindCall(_Element.attachShadow) : null;
        } catch (ignore) {}
    })();

    let skipLander = true;
    try {
        skipLander = !(isFirefox && 'StopIteration' in win);
    } catch (ignore) {}

    const _console = {};
    _console.initConsole = () => {
        const keys = new Set();
        const _stopImmediatePropagation = _bindCall(Event.prototype.stopImmediatePropagation);
        win.addEventListener('message', e => {
            if (e.source === win || typeof e.data !== 'string')
                return;
            if (e.data.startsWith('_console.key')) {
                _stopImmediatePropagation(e);
                keys.add(e.data.slice(13));
            }
            if (keys.has(e.data.slice(0, 10))) {
                _stopImmediatePropagation(e);
                _console.log(`From: ${e.origin}\n${e.data.slice(11)}`);
            }
        });
        if (inIFrame) {
            const _postMessage = win.parent.postMessage.bind(win.parent);
            const key = Math.random().toString(36).substr(2).padStart(10, '0').slice(0, 10);
            _postMessage(`_console.key ${key}`, '*');
            const _Object_toString = _bindCall(Object.prototype.toString);
            const _Symbol_toString = _bindCall(Symbol.prototype.toString);
            const _Array_toString = _bindCall(Array.prototype.toString);
            const selfHandled = ['string', 'number', 'boolean', 'undefined'];
            const stringify = x => {
                if (x === null)
                    return 'null';
                const type = typeof x;
                if (selfHandled.includes(type))
                    return x;
                if (type === 'object') {
                    if (x instanceof Window || x instanceof Document)
                        return _Object_toString(x);
                    if (Array.isArray(x))
                        return _Array_toString(x);
                    if (x instanceof Element)
                        return `<${x.tagName} ${Array.from(x.attributes).map(x => x.value ? `${x.name}="${x.value}"`: x.name).join(' ')}>`;
                    let props = Object.getOwnPropertyNames(x);
                    if (props.length > 30) {
                        props.splice(30, props.length - 30);
                        props.push('\u2026');
                    }
                    return `[object {${props.join(', ')}}]`;
                }
                if (type === 'function') {
                    let str = _toString(x);
                    return str.length > 200 ? `${str.slice(0, 200)}\u2026` : str;
                }
                if (type === 'symbol')
                    return _Symbol_toString(x);
                return `[unhandled ${typeof x}]`;
            };
            const passIt = (...args) => {
                let strs = args.map(stringify);
                _postMessage(`${key} ${strs.join(' ')}`, '*', );
            };
            for (let name in win.console)
                _console[name] = passIt;
        } else {
            for (let name in win.console)
                _console[name] = console[name];
            _console._trace = _console.trace;
            _console.trace = (...args) => {
                if (!skipLander)
                    return _console.warn(...args);
                _console.groupCollapsed(...args);
                _console._trace('Stack trace.');
                _console.groupEnd();
            };
        }

        Object.freeze(_console);
        Object.defineProperty(win.console, 'clear', _cloneInto({
            value() {
                return null;
            }
        }));
    };
    _console.initConsole();

    const jsf = (function () {
        const opts = {};
        let getValue = (a, b) => b,
            setValue = () => null,
            listValues = () => [];
        try {
            [getValue, setValue, listValues] = [GM_getValue, GM_setValue, GM_listValues];
        } catch (ignore) {}
        // defaults
        opts.Lang = 'rus';
        opts.AbortExecutionStatistics = false;
        opts.AccessStatistics = false;
        opts.LogAttachedCSS = false;
        opts.LogAdditionalInfo = false;
        opts.BlockNotificationPermissionRequests = false;
        opts.ShowScriptHandlerCompatibilityWarning = true;
        // load actual values
        for (let name of listValues())
            opts[name] = getValue(name, opts[name]);
        const checkName = name => {
            if (!_hasOwnProperty(opts, name))
                throw new Error('Attempt to access missing option value.');
            return true;
        };
        return new Proxy(opts, {
            get(opts, name) {
                if (name === 'toString')
                    return () => JSON.stringify(opts);
                if (checkName(name))
                    return opts[name];
            },
            set(opts, name, value) {
                if (checkName(name)) {
                    opts[name] = value;
                    setValue(name, value);
                }
                return true;
            }
        });
    })();

    if (jsf.BlockNotificationPermissionRequests && win.Notification && win.Notification.permission === 'default') {
        win.Notification.requestPermission = () => new Promise(resolve => resolve('denied'));
        Object.defineProperty(win.Notification, 'permission', _cloneInto({
            set() {},
            get() {
                return 'denied';
            }
        }));
    }

    if (isFirefox && // Exit on image pages in Fx
        _document.constructor.prototype.toString() === '[object ImageDocumentPrototype]')
        return;

    // NodeList and HTMLCollection iterator polyfill
    // required for old versions of Safari and Chrome 49 (last available for WinXP)
    // https://jakearchibald.com/2014/iterators-gonna-iterate/
    if (!NodeList.prototype[Symbol.iterator])
        NodeList.prototype[Symbol.iterator] = Array.prototype[Symbol.iterator];
    if (!HTMLCollection.prototype[Symbol.iterator])
        HTMLCollection.prototype[Symbol.iterator] = Array.prototype[Symbol.iterator];
    // Firefox 60 ESR Fix: calling toString on Proxy object throws Error
    function FxProxyToStringFix(root) {
        if (!isFirefox || parseInt((navigator.userAgent.match(/Firefox\/(\d+)\./) || [])[1]) > 60)
            return;
        const wrapper = {
            apply(fun, that, args) {
                let res;
                try {
                    res = _apply(fun, that, args);
                } catch (e) {
                    if (typeof that === 'function')
                        res = Function[fun.name || 'toString']();
                    else
                        throw e;
                    if (that.name && res)
                        res = res.replace('Function', that.name);
                }
                return res;
            }
        };

        ['toLocaleString', 'toSource', 'toString'].forEach(
            toWrap => (root.Function.prototype[toWrap] = new root.Proxy(root.Function.prototype[toWrap], _cloneInto(wrapper, root)))
        );
    }
    FxProxyToStringFix(win);

    // Stub for missing "GM.cookie.list" in unsupported script managers
    if (GM.cookie === undefined)
        GM.cookie = {
            list: () => ({
                then: () => null
            })
        };

    // Wrapper to run scripts designed to override objects available to other scripts
    // Required in old versions of Firefox (<58) or when running with Greasemonkey
    const
        batchLand = [],
        batchPrepend = new Set(),
        _APIString = `const win = window, isFirefox = ${isFirefox}, inIFrame = ${inIFrame}, _document = win.document, _de = _document.documentElement,
        _Document = Object.getPrototypeOf(HTMLDocument.prototype), _Element = Object.getPrototypeOf(HTMLElement.prototype), _Node = Object.getPrototypeOf(_Element),
        _appendChild = _Document.appendChild.bind(_de), _removeChild = _Document.removeChild.bind(_de), skipLander = ${skipLander},
        _createElement = _Document.createElement.bind(_document), _querySelector = _Document.querySelector.bind(_document),
        _querySelectorAll = _Document.querySelectorAll.bind(_document), _bindCall = fun => Function.prototype.call.bind(fun),
        _getAttribute = _bindCall(_Element.getAttribute), _setAttribute = _bindCall(_Element.setAttribute),
        _removeAttribute = _bindCall(_Element.removeAttribute), _hasOwnProperty = _bindCall(Object.prototype.hasOwnProperty),
        _toString = _bindCall(Function.prototype.toString), _apply = Reflect.apply, _construct = Reflect.construct;
        const GM = { info: { version: '0.0', scriptHandler: null }, cookie: { list: () => ({ then: () => null }) } };
        const jsf = ${jsf.toString()}, _console = {}; (${_console.initConsole.toString()})();`,
        landScript = (f, pre) => {
            const script = _createElement('script');
            script.textContent = `(()=>{${_APIString}${[...pre].join(';')};(${f.join(')();(')})();})();`;
            _appendChild(script);
            _removeChild(script);
        };
    let scriptLander = f => f();
    if (!skipLander) {
        scriptLander = (func, ...prepend) => {
            prepend.forEach(x => batchPrepend.add(x));
            batchLand.push(func);
        };
        _document.addEventListener(
            'DOMContentLoaded', () => void(scriptLander = (f, ...prep) => landScript([f], prep)), false
        );
    }

    function nullTools(opts) {
        /* jshint validthis: true */
        const nt = this;
        opts = opts || {};

        function Stats() {
            const updated = new Map();
            const logged = new Map();

            function printUpdated() {
                const prepared = [...updated].map(x => {
                    const [prop, dir] = x;
                    logged.set(prop, logged.get(prop) | dir);
                    return `${prop} (${dir ^ (Stats.GET | Stats.SET) ? (dir & Stats.GET ? 'R' : 'W') : 'R/W'})`;
                }).sort();
                updated.clear();
                _console.log(`Accessed properties:\n * ${prepared.join('\n * ')}`);
            }

            let logLock;
            this.log = async (prop, dir) => {
                if (!jsf.AccessStatistics) return;
                if (!(logged.get(prop) & dir))
                    updated.set(prop, updated.get(prop) | dir);
                logLock = (logLock > 0 || !updated.size) ? logLock : setInterval(() => {
                    printUpdated();
                    logLock = clearInterval(logLock);
                }, 2500);
            };
        }
        Stats.GET = 1;
        Stats.SET = 2;
        Object.freeze(Stats);
        const stats = new Stats();

        const log = async (...args) => jsf.LogAdditionalInfo && _console.log(...args);
        const isObjecty = x => (x !== null) && typeof x === 'object' || typeof x === 'function';
        const parsePath = path => {
            let root = win,
                chain = path.split('.'),
                link = chain.shift();
            for (; chain.length > 0; link = chain.shift()) {
                if (!isObjecty(root[link]))
                    break;
                root = root[link];
            }
            return [root, link, chain];
        };

        const namedObjects = new WeakMap();

        nt.destroy = function (o, destroy) {
            if (!opts.destroy && !destroy || typeof o !== 'object' || o === null)
                return;
            log('cleaning', o);
            try {
                for (let item in o) {
                    if (item instanceof Object)
                        nt.destroy(item, destroy);
                    delete o[item];
                }
            } catch (e) {
                log('Error in object destructor', e);
            }
        };

        nt.define = function (path, val, other = {}) {
            other.enumerable = other.enumerable || false;
            const [obj, prop, remainder] = parsePath(path);
            if (remainder.length) {
                if (other.dontWait)
                    _console.warn(`Unable to resolve ${remainder.join('.')} in ${path}`);
                else {
                    let _obj;
                    Object.defineProperty(obj, prop, _cloneInto({
                        get() {
                            return _obj;
                        },
                        set(val) {
                            _obj = val;
                            nt.define(path, val, other);
                        },
                        configurable: true
                    }));
                }
                return;
            }
            namedObjects.set(obj, path);
            nt.defineOn(obj, prop, val, path, other);
        };

        nt.defineOn = function (obj, prop, val, path, other = {}) {
            path = path || ((obj === win) ? prop : `?.${prop}`);
            if (path[path.length - 1] === '.')
                path = `${path}${prop}`;
            const desc = Object.getOwnPropertyDescriptor(obj, prop);
            if (desc !== undefined && !desc.configurable) {
                _console.warn(`Unable to redefine not configurable ${prop} in`, obj);
                return;
            }
            Object.defineProperty(
                obj, prop, _cloneInto({
                    get: exportFunction(() => {
                        stats.log(path, Stats.GET);
                        return val;
                    }, win),
                    set: exportFunction(v => {
                        stats.log(path, Stats.SET);
                        if (v !== val) {
                            log(`set ${prop} of`, obj, 'to', v);
                            nt.destroy(v);
                        }
                    }, win),
                    enumerable: other.enumerable
                })
            );
        };

        nt.proxy = function (obj, name, opts = {}) {
            if (name) namedObjects.set(obj, name);
            return new _Proxy(
                obj, _cloneInto({
                    get(that, prop) {
                        if (prop in that)
                            return that[prop];
                        if (typeof prop === 'symbol') {
                            if (prop === Symbol.toPrimitive)
                                that[prop] = function (hint) {
                                    if (hint === 'string')
                                        return Object.prototype.toString.call(this);
                                    return `[missing toPrimitive] ${name} ${hint}`;
                                };
                            else if (prop === Symbol.toStringTag)
                                that[prop] = () => 'Object';
                            else {
                                that[prop] = undefined;
                                _console.trace('Missing', prop, 'in', name || '?', '>>', that[prop]);
                            }
                            return that[prop];
                        }
                        if (name) {
                            that[prop] = nt.func(opts.val, `${name}.${prop}`, opts.log);
                            return that[prop];
                        }
                        _console.trace('Missing', prop, 'in', namedObjects.get(that) || that);
                    },
                    set(that, prop, val) {
                        if (val !== that[prop]) {
                            log('skip set', prop, 'of', namedObjects.get(that) || that, 'to', val);
                            nt.destroy(val);
                        }
                        return true;
                    }
                })
            );
        };

        nt.func = (val, name) => nt.proxy((() => {
            let f = function () {
                if (jsf.LogAdditionalInfo)
                    _console.trace(`call ${name || ''}(`, ...arguments, `) return`, val);
                return val;
            };
            if (name) namedObjects.set(f, name);
            return f;
        })());

        nt.NULL = {
            val: null
        };
        Object.freeze(nt.NULL);

        Object.freeze(nt);
    }
    nullTools.toString = new _Proxy(nullTools.toString, _cloneInto({
        apply(...args) {
            return `${_apply(...args)} let nt = new nullTools();`;
        }
    }));
    let nt = new nullTools();

    // Creates and return protected style (unless protection is manually disabled).
    // Protected style will re-add itself on removal and remaind enabled on attempt to disable it.

    const createStyle = (function createStyleModule() {
        function createStyleElement(rules, opts) {
            const style = _createElement('style');
            Object.assign(style, opts.props);
            opts.root.appendChild(style);

            if (style.sheet) // style.sheet is only available when style attached to DOM
                rules.forEach(style.sheet.insertRule.bind(style.sheet));
            else
                style.textContent = rules.join('\n');

            if (opts.protect) {
                Object.defineProperty(style, 'sheet', _cloneInto({
                    value: null,
                    enumerable: true
                }));
                Object.defineProperty(style, 'disabled', _cloneInto({ //pretend to be disabled
                    enumerable: true,
                    set() {},
                    get() {
                        return true;
                    }
                }));
                (new MutationObserver(
                    () => opts.root.removeChild(style)
                )).observe(style, {
                    childList: true
                });
            }

            return style;
        }

        // functions to parse object-based rulesets
        function parseRule(rec) {
            /* jshint validthis: true */
            return this.concat(rec[0], ' {\n', Object.entries(rec[1]).map(parseProperty, this + '\t').join('\n'), '\n', this, '}');
        }

        function parseProperty(rec) {
            /* jshint validthis: true */
            return rec[1] instanceof Object ? parseRule.call(this, rec) : `${this}${rec[0].replace(/_/g, '-')}: ${rec[1]};`;
        }

        // main
        const createStyle = (rules, opts) => {
            // parse options
            opts = Object.assign({
                protect: true,
                root: _de,
                type: 'text/css'
            }, opts);
            // move style properties into separate property
            // { a, b, ...rest } construction is not available in Fx 52
            opts.props = Object.assign({}, opts);
            delete opts.props.protect;
            delete opts.props.root;
            // store binded methods instead of element
            opts.root = {
                appendChild: opts.root.appendChild.bind(opts.root),
                removeChild: opts.root.removeChild.bind(opts.root)
            };

            // convert rules set into an array if it isn't one already
            rules = Array.isArray(rules) ? rules : rules instanceof Object ? Object.entries(rules).map(parseRule, '') : [rules];

            // could be reassigned when protection triggered
            let style = createStyleElement(rules, opts);

            if (!opts.protect)
                return style;

            const replaceStyle = () => new Promise(
                resolve => setTimeout(re => re(createStyleElement(rules, opts)), 0, resolve)
            ).then(st => (style = st)); // replace poiner to style object with a new style object

            (new MutationObserver(ms => {
                for (let m of ms)
                    for (let node of m.removedNodes)
                        if (node === style) replaceStyle();
            })).observe(_de, {
                childList: true
            });

            if (jsf.LogAttachedCSS)
                _console.log(`Attached CSS:\n${rules.join('\n')}`);

            return style;
        };
        createStyle.toString = () => `const createStyle = (${createStyleModule.toString()})();`;
        return createStyle;
    })();

    // aborts currently running script with TypeError on specific property access
    // in case of inline script also checks if it contains specific pattern in it

    const removeOwnFootprint = e => (e.stack = e.stack.split('\n').filter(x => !x.includes('-extension://')).join('\n'), e);
    const abortExecution = (function abortExecutionModule() {
        let map = new Map(),
            cnt = new Map(),
            stack = 0;
        const printCounters = (cnts) => {
            let s = '';
            for (let cntr of cnts)
                s += `\n * ${cntr[0]}: ${cntr[1]}`;
            return s;
        };
        const logger = id => {
            if (!jsf.AbortExecutionStatistics)
                return;
            let {
                path,
                mode
            } = map.get(id);
            let prop = `${path} ${mode.toString().replace('Symbol','')}`;
            cnt.set(prop, (cnt.get(prop) || 0) + 1);
            stack++;
            setTimeout(() => {
                stack--;
                if (!stack)
                    console.log('Abort execution counters:', printCounters(Array.from(cnt.entries())));
            }, 1000);
        };
        const isObjecty = x => (x !== null) && typeof x === 'object' || typeof x === 'function';
        const Mode = {
            Get: Symbol('Read'),
            Set: Symbol('Write'),
            All: Symbol('Access'),
            InlineScript: Symbol('InlineScript')
        };
        Object.freeze(Mode);

        const abortExecution = function abortExecution(mode, path, conf = {}) {
            let root = conf.root || win,
                chain = path.split('.'),
                postponed = false;
            const postpone = (link, chain) => {
                postponed = true;
                let _val;
                try {
                    Object.defineProperty(root, link, _cloneInto({
                        get() {
                            return _val;
                        },
                        set(val) {
                            _val = val;
                            conf.root = val;
                            conf.fullPath = conf.fullPath || path;
                            abortExecution(mode, chain.join('.'), conf);
                        }
                    }));
                } catch (e) {
                    _console.warn(`Unable to set postpone point at ${link} in ${path}\n`, e);
                }
            };
            while (chain.length > 1) {
                let link = chain.shift();
                if (!isObjecty(root[link])) {
                    if (conf.breakOnMissing)
                        break;
                    postpone(link, chain);
                    break;
                }
                root = root[link];
            }
            path = conf.fullPath || path;
            if (postponed) {
                if (conf.breakOnMissing)
                    _console.log(`Unable to locate "${path}", abort anchor skipped.`);
                return;
            }
            const target = chain[0];
            const message = `Cannot read property '${target}' of undefined`;
            const des = Object.getOwnPropertyDescriptor(root, target);
            if (des && des.get !== undefined)
                return;
            const id = Math.random().toString(36).substr(2);
            map.set(id, {
                path: path,
                mode: mode
            });
            win.addEventListener('error', e => {
                if (e.error && e.error.message === message)
                    e.stopImmediatePropagation();
            }, false);
            const get = Symbol('get');
            const set = Symbol('set');

            const check = (mode === Mode.InlineScript) ?
                () => {
                    const script = _document.currentScript;
                    if (script && script.src === '' &&
                        (!conf.pattern || conf.pattern.test(script.textContent))) {
                        logger(id);
                        throw removeOwnFootprint(new TypeError(message));
                    }
                } : io => {
                    if (io === set && mode === Mode.Get ||
                        io === get && mode === Mode.Set)
                        return;
                    logger(id);
                    throw removeOwnFootprint(new TypeError(message));
                };

            let _val = root[target];
            Object.defineProperty(root, target, _cloneInto({
                get() {
                    check(get);
                    return _val;
                },
                set(v) {
                    check(set);
                    _val = v;
                }
            }));
        };
        abortExecution.onGet = (path, conf) => abortExecution(Mode.Get, path, conf);
        abortExecution.onSet = (path, conf) => abortExecution(Mode.Set, path, conf);
        abortExecution.onAll = (path, conf) => abortExecution(Mode.All, path, conf);
        abortExecution.inlineScript = (path, conf) => abortExecution(Mode.InlineScript, path, conf);
        abortExecution.toString = () => ` const abortExecution = (${abortExecutionModule.toString()})();`;
        return abortExecution;
    })();

    // Fake objects of advertisement networks to break their workflow
    // Popular adblock detector
    function deployFABStub(root) {
        if (!('fuckAdBlock' in root)) {
            let FuckAdBlock = function (options) {
                let self = this;
                self._options = {
                    checkOnLoad: false,
                    resetOnEnd: false,
                    checking: false
                };
                self.setOption = function (opt, val) {
                    if (val)
                        self._options[opt] = val;
                    else
                        Object.assign(self._options, opt);
                };
                if (options)
                    self.setOption(options);

                self._var = {
                    event: {}
                };
                self.clearEvent = function () {
                    self._var.event.detected = [];
                    self._var.event.notDetected = [];
                };
                self.clearEvent();

                self.on = function (detected, fun) {
                    self._var.event[detected ? 'detected' : 'notDetected'].push(fun);
                    return self;
                };
                self.onDetected = function (cb) {
                    return self.on(true, cb);
                };
                self.onNotDetected = function (cb) {
                    return self.on(false, cb);
                };
                self.emitEvent = function () {
                    for (let fun of self._var.event.notDetected)
                        fun();
                    if (self._options.resetOnEnd)
                        self.clearEvent();
                    return self;
                };
                self._creatBait = () => null;
                self._destroyBait = () => null;
                self._checkBait = function () {
                    setTimeout((() => self.emitEvent()), 1);
                };
                self.check = function () {
                    self._checkBait();
                    return true;
                };

                let callback = function () {
                    if (self._options.checkOnLoad)
                        setTimeout(self.check, 1);
                };
                root.addEventListener('load', callback, false);
            };
            nt.defineOn(root, 'FuckAdBlock', FuckAdBlock);
            nt.defineOn(root, 'fuckAdBlock', new FuckAdBlock({
                checkOnLoad: true,
                resetOnEnd: true
            }));
        }
    }
    // new version of fAB adapting to fake API
    // scriptLander(() => deployFABStub(win), nullTools); // so it's disabled by default for now

    scriptLander(() => {
        // VideoJS player wrapper
        {
            let _videojs = win.videojs;
            Object.defineProperty(win, 'videojs', _cloneInto({
                get() {
                    return _videojs;
                },
                set(f) {
                    if (f === _videojs)
                        return true;
                    _console.log('videojs =', f);
                    _videojs = new _Proxy(f, _cloneInto({
                        apply(fun, that, args) {
                            _console.log('videojs(', ...args, ')');
                            const params = args[1];
                            if (params) {
                                if (params.hasAd)
                                    params.hasAd = false;
                                if (params.plugins && params.plugins.vastClient)
                                    delete params.plugins.vastClient;
                                // disable unmuted autoplay (muted used for preview purposes)
                                if (params.autoplay && !params.muted)
                                    params.autoplay = false;
                            }
                            const res = _apply(fun, that, args);
                            if (res.seed)
                                res.seed = () => null;
                            if (res.on && res.off) {
                                const logPlayer = () => {
                                    _console.log('player =', res);
                                    res.off('playing', logPlayer);
                                };
                                res.on('playing', logPlayer);
                            }
                            return res;
                        }
                    }));
                }
            }));
        }
    }, nullTools, createStyle, abortExecution);

    // Yandex Raven stub (some monitoring sub-system)
    function yandexRavenStub() {
        nt.define('Raven', nt.proxy({
            context(f) {
                return f();
            },
            config: nt.func(
                nt.proxy({}, 'Raven.config', {
                    val: nt.proxy({}, 'Raven.config()..', nt.NULL)
                }), 'Raven.config')
        }, 'Raven', nt.NULL));
    }

    // Based on https://greasyfork.org/en/scripts/21937-moonwalk-hdgo-kodik-fix v0.8
    {
        const log = name => _console.log(`Player FIX: Detected ${name} player in ${location.href}`);
        const removeVast = (data) => {
            if (data && typeof data === 'object') {
                _console.log('Player configuration:', data);
                if (data.advert_script && data.advert_script !== '') {
                    _console.log('Set data.advert_script to empty string.');
                    data.advert_script = '';
                }
                let keys = Object.getOwnPropertyNames(data);
                let isVast = name => /vast|clickunder/.test(name);
                if (!keys.some(isVast))
                    return data;
                for (let key of keys)
                    if (typeof data[key] === 'object' && key !== 'links') {
                        _console.log(`Removed data.${key}:`, data[key]);
                        delete data[key];
                    }
                if (data.chain) {
                    let need = [],
                        drop = [],
                        links = data.chain.split('.');
                    for (let link of links)
                        if (!isVast(link))
                            need.push(link);
                        else
                            drop.push(link);
                    _console.log('Dropped from the chain:', ...drop);
                    data.chain = need.join('.');
                }
            }
            return data;
        };

        _document.addEventListener(
            'DOMContentLoaded',
            function () {
                if ('video_balancer_options' in win && 'event_callback' in win) {
                    log('Moonwalk');
                    if (win.video_balancer_options.adv)
                        removeVast(win.video_balancer_options.adv);
                    if ('_mw_adb' in win)
                        Object.defineProperty(win, '_mw_adb', _cloneInto({
                            set() {},
                            get() {
                                return false;
                            }
                        }));
                } else if (win.startKodikPlayer !== undefined) {
                    log('Kodik');
                    // skip attempt to block access to HD resolutions
                    const chainCall = new _Proxy({}, _cloneInto({
                        get() {
                            return () => chainCall;
                        }
                    }));
                    if (win.$ && win.$.prototype && win.$.prototype.addClass) {
                        let $addClass = win.$.prototype.addClass;
                        win.$.prototype.addClass = function (className) {
                            if (className === 'blocked')
                                return chainCall;
                            return $addClass.apply(this, arguments);
                        };
                    }
                    // remove ad links from the metadata
                    let _ajax = win.$.ajax;
                    win.$.ajax = (params, ...args) => {
                        if (params.success) {
                            let _s = params.success;
                            params.success = (data, ...args) => _s(removeVast(data), ...args);
                        }
                        return _ajax(params, ...args);
                    };
                } else if (win.getnextepisode && win.uppodEvent) {
                    log('Share-Serials.net');
                    scriptLander(
                        function () {
                            let _setInterval = win.setInterval,
                                _setTimeout = win.setTimeout;
                            win.setInterval = function (func) {
                                if (typeof func === 'function' && _toString(func).includes('_delay')) {
                                    let intv = _setInterval.call(
                                        this,
                                        function () {
                                            _setTimeout.call(
                                                this,
                                                function (intv) {
                                                    clearInterval(intv);
                                                    let timer = _document.querySelector('#timer');
                                                    if (timer)
                                                        timer.click();
                                                }, 100, intv);
                                            func.call(this);
                                        }, 5
                                    );

                                    return intv;
                                }
                                return _setInterval.apply(this, arguments);
                            };
                            win.setTimeout = function (func) {
                                if (typeof func === 'function' && _toString(func).includes('adv_showed'))
                                    return _setTimeout.call(this, func, 0);
                                return _setTimeout.apply(this, arguments);
                            };
                        }
                    );
                } else if ('ADC' in win) {
                    log('vjs-creatives plugin in');
                    let replacer = (obj) => {
                        for (let name in obj)
                            if (typeof obj[name] === 'function')
                                obj[name] = () => null;
                    };
                    replacer(win.ADC);
                    replacer(win.currentAdSlot);
                } else if ('Playerjs' in win) {
                    log('Playerjs');
                    win.Playerjs = new _Proxy(win.Playerjs, _cloneInto({
                        construct(fn, args) {
                            let params = args[0];
                            if (params && typeof params === 'object') {
                                delete params.preroll;
                                params = removeVast(params);
                                Object.defineProperty(params, 'hasOwnProperty', _cloneInto({
                                    value(...args) {
                                        let res = _hasOwnProperty(this, ...args);
                                        if (typeof args[0] === 'string' && args[0].startsWith('vast_') &&
                                            res && params[args[0]]) {
                                            _console.log(`Removed params.${args[0]}:`, params[args[0]]);
                                            delete params[args[0]];
                                            return false;
                                        }
                                        return res;
                                    },
                                    enumerable: false,
                                    configurable: true
                                }));
                            }
                            return _construct(fn, args);
                        }
                    }));
                }

                UberVK: {
                    if (!inIFrame)
                        break UberVK;
                    let oddNames = 'HD' in win &&
                        !Object.getOwnPropertyNames(win).every(n => !n.startsWith('_0x'));
                    if (!oddNames)
                        break UberVK;
                    log('UberVK');
                    XMLHttpRequest.prototype.open = () => {
                        throw 404;
                    };
                }
            }, false
        );
    }

    // Applies wrapper function on the current page and all newly created same-origin iframes
    // This is used to prevent trick which allows to get fresh page API through newly created same-origin iframes
    function deepWrapAPI(wrapper) {
        let wrapped = new WeakSet();
        const
            log = (...args) => false && _console.log(...args),
            _HTMLIFrameElement = HTMLIFrameElement.prototype,
            isIFrameElement = _HTMLIFrameElement.isPrototypeOf.bind(_HTMLIFrameElement),
            _contentWindow = Object.getOwnPropertyDescriptor(_HTMLIFrameElement, 'contentWindow'),
            _get_contentWindow = _bindCall(_contentWindow.get);

        function wrapAPI(root) {
            if (!root || wrapped.has(root))
                return;
            wrapped.add(root);
            try {
                wrapper(isIFrameElement(root) ? _get_contentWindow(root) : root);
                log('Wrapped API in', (root === win) ? "main window." : root);
            } catch (e) {
                log('Failed to wrap API in', (root === win) ? "main window." : root, '\n', e);
            }
        }

        // wrap API on contentWindow access
        const getter = _cloneInto({
            apply(get, that, args) {
                wrapAPI(that);
                return _apply(get, that, args);
            }
        });
        _contentWindow.get = new _Proxy(_contentWindow.get, getter);
        Object.defineProperty(_HTMLIFrameElement, 'contentWindow', _contentWindow);
        // wrap API on contentDocument access
        const _contentDocument = Object.getOwnPropertyDescriptor(_HTMLIFrameElement, 'contentDocument');
        _contentDocument.get = new _Proxy(_contentDocument.get, getter);
        Object.defineProperty(_HTMLIFrameElement, 'contentDocument', _contentDocument);

        // manual children objects traverser to avoid issues
        // with calling querySelectorAll on wrong types of objects
        const
            _nodeType = _bindCall(Object.getOwnPropertyDescriptor(_Node, 'nodeType').get),
            _childNodes = _bindCall(Object.getOwnPropertyDescriptor(_Node, 'childNodes').get),
            _ELEMENT_NODE = _Node.ELEMENT_NODE,
            _DOCUMENT_FRAGMENT_NODE = _Node.DOCUMENT_FRAGMENT_NODE;
        const wrapFrames = root => {
            if (_nodeType(root) !== _ELEMENT_NODE && _nodeType(root) !== _DOCUMENT_FRAGMENT_NODE)
                return; // only process nodes which may contain an IFRAME or be one
            if (isIFrameElement(root)) {
                wrapAPI(root);
                return;
            }
            for (let child of _childNodes(root))
                wrapFrames(child);
        };

        // wrap API in a newly appended iframe objects
        const wrappedAppendChild = new _Proxy(_Node.appendChild, _cloneInto({
            apply(fun, that, args) {
                let res = _apply(fun, that, args);
                wrapFrames(args[0]);
                return res;
            }
        }));
        // ABP Freeze Element snippet replaces normal properties with getters without setters
        const _Node_appendChild = Object.getOwnPropertyDescriptor(Node.prototype, 'appendChild');
        if (_Node_appendChild.configurable) {
            if (_Node_appendChild.value)
                _Node_appendChild.value = wrappedAppendChild;
            if (_Node_appendChild.get)
                _Node_appendChild.get = () => wrappedAppendChild;
            Object.defineProperty(_Node, 'appendChild', _Node_appendChild);
        }

        // wrap API in iframe objects created with innerHTML of element on page
        const _innerHTML = Object.getOwnPropertyDescriptor(_Element, 'innerHTML');
        _innerHTML.set = new _Proxy(_innerHTML.set, _cloneInto({
            apply(set, that, args) {
                _apply(set, that, args);
                if (_document.contains(that))
                    wrapFrames(that);
            }
        }));
        Object.defineProperty(_Element, 'innerHTML', _innerHTML);

        wrapAPI(win);
    }

    // piguiqproxy.com / zmctrack.net circumvention and onerror callback prevention
    scriptLander(
        () => {
            // onerror callback blacklist
            let masks = [],
                //blockAll = /(^|\.)(rutracker-org\.appspot\.com)$/,
                isBlocked = url => masks.some(mask => mask.test(url)); // || blockAll.test(location.hostname);
            for (let filter of [ // blacklist
                    // global
                    '/adv/www/',
                    // adservers
                    '||185.87.50.147^',
                    '||10root25.website^', '||24video.xxx^',
                    '||adlabs.ru^', '||adspayformymortgage.win^', '||aliru1.ru^', '||amgload.net^', '||aviabay.ru^',
                    '||bgrndi.com^', '||brokeloy.com^',
                    '||cdnjs-aws.ru^', '||cnamerutor.ru^',
                    '||directadvert.ru^', '||docfilms.info^', '||dreadfula.ru^', '||dsn-fishki.ru^',
                    '||et-cod.com^', '||et-code.ru^', '||etcodes.com^',
                    '||film-doma.ru^',
                    '||free-torrent.org^', '||free-torrent.pw^',
                    '||free-torrents.org^', '||free-torrents.pw^',
                    '||game-torrent.info^', '||gocdn.ru^',
                    '||hdkinoshka.com^', '||hghit.com^', '||hindcine.net^',
                    '||kinotochka.net^', '||kinott.com^', '||kinott.ru^',
                    '||klcheck.com^', '||kuveres.com^',
                    '||lepubs.com^', '||luxadv.com^', '||luxup.ru^', '||luxupcdna.com^',
                    '||marketgid.com^', '||mebablo.com^', '||mixadvert.com^', '||mxtads.com^',
                    '||nickhel.com^',
                    '||oconner.biz^', '||oconner.link^', '||octoclick.net^', '||octozoon.org^',
                    '||pigiuqproxy.com^', '||piguiqproxy.com^', '||pkpojhc.com^',
                    '||psma01.com^', '||psma02.com^', '||psma03.com^',
                    '||rcdn.pro^', '||recreativ.ru^', '||redtram.com^', '||regpole.com^',
                    '||rootmedia.ws^', '||ruttwind.com^', '||rutvind.com^',
                    '||skidl.ru^', '||smi2.net^', '||smcheck.org^',
                    '||torvind.com^', '||traffic-media.co^', '||trafmag.com^', '||trustjs.net^', '||ttarget.ru^',
                    '||u-dot-id-adtool.appspot.com^', '||utarget.ru^',
                    '||webadvert-gid.ru^', '||webadvertgid.ru^',
                    '||xxuhter.ru^',
                    '||yuiout.online^',
                    '||zfctrack.net^', '||zhctrack.net^', '||zmctrack.net^', '||znctrack.net^', '||zoom-film.ru^'
                ])
                masks.push(new RegExp(
                    filter.replace(/([\\/[\].+?(){}$])/g, '\\$1')
                    .replace(/\*/g, '.*?')
                    .replace(/\^(?!$)/g, '\\.?[^\\w%._-]')
                    .replace(/\^$/, '\\.?([^\\w%._-]|$)')
                    .replace(/^\|\|/, '^((ws|http)s?:|/)/+([^/.]+\\.)*?'),
                    'i'));
            // main script
            deepWrapAPI(root => {
                FxProxyToStringFix(root);

                const _defineProperty = root.Object.defineProperty;
                const _getOwnPropertyDescriptor = root.Object.getOwnPropertyDescriptor;
                const _dispatchEvent = _bindCall(root.EventTarget.prototype.dispatchEvent);

                const dispatchCustomEvent = (
                    target, name, opts = {
                        bubble: false,
                        cancelable: false
                    }
                ) => _dispatchEvent(target, new CustomEvent(name, opts));

                {
                    // 'onerror' handler for scripts from blacklisted sources
                    const scriptMap = new WeakMap();
                    const _HTMLScriptElement = root.HTMLScriptElement,
                          _HTMLImageElement = root.HTMLImageElement;
                    const _get_tagName = _bindCall(_getOwnPropertyDescriptor(root.Element.prototype, 'tagName').get),
                          _get_scr_src = _bindCall(_getOwnPropertyDescriptor(_HTMLScriptElement.prototype, 'src').get),
                          _get_img_src = _bindCall(_getOwnPropertyDescriptor(_HTMLImageElement.prototype, 'src').get);
                    const _get_src = node => {
                        if (node instanceof _HTMLScriptElement)
                            return _get_scr_src(node);
                        if (node instanceof _HTMLImageElement)
                            return _get_img_src(node);
                        return undefined;
                    };
                    const _onerror = _getOwnPropertyDescriptor(root.HTMLElement.prototype, 'onerror');
                    _onerror.get = new root.Proxy(_onerror.get, _cloneInto({
                        apply(_fun, that) {
                            return scriptMap.get(that) || null;
                        }
                    }, root));
                    _onerror.set = new root.Proxy(_onerror.set, _cloneInto({
                        apply(fun, that, args) {
                            let [callback] = args;
                            if (typeof callback !== 'function') {
                                scriptMap.delete(that);
                                _apply(fun, that, args);
                                return;
                            }
                            scriptMap.set(that, callback);
                            _apply(fun, that, [function () {
                                let src = _get_src(this);
                                if (isBlocked(src)) {
                                    _console.trace(`Blocked "onerror" callback from ${_get_tagName(this)}: ${src}`);
                                    return;
                                }
                                _apply(scriptMap.get(this), this, arguments);
                            }]);
                        }
                    }, root));
                    _defineProperty(root.HTMLElement.prototype, 'onerror', _onerror);
                }
                // Simplistic WebSocket wrapper for Maxthon and Firefox before v58
                // once again seems required in Google Chrome and similar browsers due to zmctrack.net -_-
                if (_getOwnPropertyDescriptor(root, 'WebSocket'))
                    root.WebSocket = new root.Proxy(root.WebSocket, _cloneInto({
                        construct(ws, args) {
                            if (isBlocked(args[0])) {
                                _console.log('Blocked WS connection:', args[0]);
                                return {};
                            }
                            return _construct(ws, args);
                        }
                    }, root));
                // Block popular method to open a new window in Google Chrome by dispatching a custom click
                // event on a newly created anchor with _blank target. Untrusted events must not open new windows.
                const clickWhitelist = /^([^.]\.)*?(nakarte\.me|sberbank\.ru)$/;
                root.EventTarget.prototype.dispatchEvent = new root.Proxy(root.EventTarget.prototype.dispatchEvent, _cloneInto({
                    apply(fun, that, args) {
                        const e = args[0];
                        if (!clickWhitelist.test(win.location.hostname) &&
                            !e.isTrusted && e.type === 'click' && e.constructor.name === 'MouseEvent' &&
                            !that.parentNode && that.tagName === 'A' && that.target[0] === '_') {
                            _console.log('Blocked dispatching a click event on a parentless anchor:', that);
                            return;
                        }
                        return _apply(fun, that, args);
                    }
                }, root));
                // blacklist of domains where all third-party requests are ignored
                const ondomains = /(^|[/.@])oane\.ws($|[:/])/i;
                const yandex_direct = /^(https?:)?\/\/([^.]+\.)??yandex(\.[a-z]{2,3}){1,2}\/(images\/[a-z0-9/_-]{40,}|jstracer?|j?clck\/.*|set\/s\/rsya-tag-users\/data(\?.*)?|static\/main\.js(\?.*)?)$/i;
                const more_y_direct = /^(https?:)?\/\/((([^.]+\.)??(drive2|kakprosto)\.ru\/(.{290,}|[a-z0-9/_-]{100,}))|yastatic\.net\/.*?\/chunks\/promo\/.*)$/i;
                const whitelist = /^(https?:)?\/\/yandex\.ru\/yobject$/;
                const fabPatterns = /\/fuckadblock/i;

                const blockedUrls = new Set();

                function checkRequest(fname, method, url) {
                    let block = isBlocked(url) ||
                        ondomains.test(location.hostname) && !ondomains.test(url) ||
                        yandex_direct.test(url) || more_y_direct.test(url);
                    let allow = block && whitelist.test(url) ||
                        // Fix for infinite load on Yandex Images: find image, open "other sizes and similar images" in a new tab, click on a preview of a similar image
                        (block && method === 'script.src' &&
                         root.location.pathname === '/images/search' && root.location.hostname.startsWith('yandex.') &&
                         url.startsWith('http') && url.includes('/images/')) || // Direct URLs are similar, but don't have protocol for some reason
                        (block && root.location.hostname === 'widgets.kinopoisk.ru' && url.includes('/static/main.js?')) ||
                        (block && !url.startsWith('http') && // drive2.ru hid a little CSS style in their requests which shows page content like this
                         (root.location.hostname === 'drive2.ru' || root.location.hostname.endsWith('.drive2.ru')));
                    if (allow) {
                        block = false;
                        _console.trace(`Allowed ${fname} ${method} request %o from %o`, url, root.location.href);
                    }
                    if (block) {
                        if (!blockedUrls.has(url)) // don't repeat log if the same URL were blocked more than once
                            _console.trace(`Blocked ${fname} ${method} request %o from %o`, url, root.location.href);
                        blockedUrls.add(url);
                        return true;
                    }
                    return false;
                }

                // workaround for broken searchbar on market.yandex.ru
                const checkOnloadEvent = location.hostname.startsWith('market.yandex.');
                const triggerLoadEvent = /^(https?:)?\/\/([^.]+\.)??yandex(\.[a-z]{2,3}){1,2}\/(j?clck\/.*)$/i;

                // XHR Wrapper
                const _proto = root.XMLHttpRequest && root.XMLHttpRequest.prototype;
                if (_proto) {
                    const xhrStopList = new WeakSet();
                    const xhrDispatchLoadList = new WeakSet();
                    _proto.open = new root.Proxy(_proto.open, _cloneInto({
                        apply(fun, that, args) {
                            if (checkOnloadEvent && triggerLoadEvent.test(args[1]))
                                xhrDispatchLoadList.add(that);
                            if (checkRequest('xhr', ...args)) {
                                xhrStopList.add(that);
                                return;
                            }
                            return _apply(fun, that, args);
                        }
                    }, root));
                    const _DONE = _proto.DONE; // 4
                    const sendWrapper = {
                        apply(fun, that, args) {
                            if (xhrStopList.has(that)) {
                                if (that.readyState !== _DONE && xhrDispatchLoadList.has(that)) {
                                    that.readyState = _DONE;
                                    setTimeout(() => dispatchCustomEvent(that, 'load'), 0);
                                }
                                return null;
                            }
                            return _apply(fun, that, args);
                        }
                    };
                    ['send', 'setRequestHeader', 'getAllResponseHeaders'].forEach(
                        name => _proto[name] = new root.Proxy(_proto[name], _cloneInto(sendWrapper, root))
                    );
                    // simulate readyState === 1 for blocked requests
                    const _readyState = Object.getOwnPropertyDescriptor(_proto, 'readyState');
                    _readyState.get = new root.Proxy(_readyState.get, _cloneInto({
                        apply(fun, that, args) {
                            return xhrStopList.has(that) ? 1 : _apply(fun, that, args);
                        }
                    }, root));
                    _defineProperty(_proto, 'readyState', _readyState);
                }

                if (root.fetch)
                    root.fetch = new root.Proxy(root.fetch, _cloneInto({
                        apply(fun, that, args) {
                            let [url, opts] = args;
                            let method = opts && opts.method || 'GET';
                            if (typeof url === 'object' && 'headers' in url &&
                                'url' in url && 'method' in url) // url instanceof Request
                                ({
                                    url,
                                    method
                                } = url);
                            if (checkRequest('fetch', method, url))
                                return new Promise(() => null);
                            return _apply(fun, that, args);
                        }
                    }, root));

                const _script_src = Object.getOwnPropertyDescriptor(root.HTMLScriptElement.prototype, 'src');
                _script_src.set = new root.Proxy(_script_src.set, _cloneInto({
                    apply(fun, that, args) {
                        if (fabPatterns.test(args[0])) {
                            _console.trace('Blocked set script.src request:', args[0]);
                            deployFABStub(root);
                            setTimeout(() => dispatchCustomEvent(that, 'load'), 0);
                            return;
                        }
                        return checkRequest('set', 'script.src', args[0]) || _apply(fun, that, args);
                    }
                }, root));
                _defineProperty(root.HTMLScriptElement.prototype, 'src', _script_src);

                const adregain_pattern = /ggg==" alt="advertisement"/;
                if (root.self !== root.top) // in IFrame
                    root.document.write = new root.Proxy(root.document.write, _cloneInto({
                        apply(fun, that, args) {
                            if (adregain_pattern.test(args[0])) {
                                _console.log('Skipped AdRegain frame.');
                                args[0] = '';
                            }
                            return _apply(fun, that, args);
                        }
                    }, root));
            });
        }, deepWrapAPI
    );

    // === Helper functions ===

    const gardener = (() => {
        // function to search and remove nodes by content
        // selector - standard CSS selector to define set of nodes to check
        // words - regular expression to check content of the suspicious nodes
        // params - object with multiple extra parameters:
        //   .log - display log in the console
        //   .hide - set display to none instead of removing from the page
        //   .parent - parent node to remove if content is found in the child node
        //   .siblings - number of simling nodes to remove (excluding text nodes)
        const scissors = (selector, words, scope, params) => {
            const logger = (...args) => {
                if (params.log) _console.log(...args);
            };
            const hideStyleStr = ';display:none!important;';
            const getStyleAtt = node => _getAttribute(node, 'style') || '';
            const scHide = node => {
                const style = getStyleAtt(node);
                if (!style.includes(hideStyleStr))
                    _setAttribute(node, 'style', style + hideStyleStr);
            };

            if (!scope.contains(_document.body))
                logger('[s] scope', scope);
            let remFunc = (params.hide ? scHide : node => node.parentNode.removeChild(node)),
                iterFunc = (params.siblings > 0 ? 'nextElementSibling' : 'previousElementSibling'),
                toRemove = [],
                siblings;
            for (let node of scope.querySelectorAll(selector)) {
                // drill up to a parent node if specified, break if not found
                if (params.parent) {
                    let old = node;
                    node = node.closest(params.parent);
                    if (node === null || node.contains(scope)) {
                        logger('[s] went out of scope with', old);
                        continue;
                    }
                }
                if (getStyleAtt(node).includes(hideStyleStr))
                    continue;
                logger('[s] processing', node);
                if (toRemove.includes(node))
                    continue;
                if (words.test(node.innerHTML)) {
                    // skip node if already marked for removal
                    logger('[s] marked for removal');
                    toRemove.push(node);
                    // add multiple nodes if defined more than one sibling
                    siblings = Math.abs(params.siblings) || 0;
                    while (siblings) {
                        node = node[iterFunc];
                        if (!node) break; // can't go any further - exit
                        logger('[s] adding sibling node', node);
                        toRemove.push(node);
                        siblings -= 1;
                    }
                }
            }
            const toSkip = [];
            toSkip.checkNode = node => !toRemove.every(other => other === node || !node.contains(other));
            for (let node of toRemove)
                if (toSkip.checkNode(node))
                    toSkip.push(node);
            if (toRemove.length)
                logger(`[s] proceeding with ${params.hide?'hide':'removal'} of`, toRemove, `skip`, toSkip);
            for (let node of toRemove)
                if (!toSkip.includes(node))
                    remFunc(node);
        };

        // function to perform multiple checks if ads inserted with a delay
        // by default does 30 checks withing a 3 seconds unless nonstop mode specified
        // also does 1 extra check when a page completely loads
        // selector and words - passed dow to scissors
        // params - object with multiple extra parameters:
        //   .log - display log in the console
        //   .root - selector to narrow down scope to scan;
        //   .observe - if true then check will be performed continuously;
        // Other parameters passed down to scissors.
        return (selector, words, params) => {
            let logger = (...args) => {
                if (params.log) _console.log(...args);
            };
            params = params || {};
            logger(`[gardener] selector: '${selector}' detector: ${words} options: ${JSON.stringify(params)}`);
            let scope;
            let globalScope = [_de.parentNode];
            let domLoaded = false;
            let getScope = root => root ? _de.querySelectorAll(root) : globalScope;
            let onevent = e => {
                logger(`[gardener] cleanup on ${Object.getPrototypeOf(e).toString().slice(1, -1).split(/\s/)[1]} "${e.type}"`);
                for (let node of scope)
                    scissors(selector, words, node, params);
            };
            let repeater = n => {
                if (!domLoaded && n) {
                    setTimeout(repeater, 500, n - 1);
                    scope = getScope(params.root);
                    if (!scope) // exit if the root element is not present on the page
                        return 0;
                    onevent({
                        type: 'Repeater'
                    });
                }
            };
            repeater(20);
            _document.addEventListener(
                'DOMContentLoaded', (e) => {
                    domLoaded = true;
                    // narrow down scope to a specific element
                    scope = getScope(params.root);
                    if (!scope) // exit if the root element is not present on the page
                        return 0;
                    logger('[g] scope', scope);
                    // add observe mode if required
                    if (params.observe) {
                        let params = {
                            childList: true,
                            subtree: true
                        };
                        let observer = new MutationObserver(
                            function (ms) {
                                for (let m of ms)
                                    if (m.addedNodes.length)
                                        onevent(m);
                            }
                        );
                        for (let node of scope)
                            observer.observe(node, params);
                        logger('[g] observer enabled');
                    }
                    onevent(e);
                }, false);
            // wait for a full page load to do one extra cut
            win.addEventListener('load', onevent, false);
        };
    })();

    // wrap popular methods to open a new tab to catch specific behaviours
    function createWindowOpenWrapper(openFunc) {
        const parser = _createElement('a');
        const openWhitelist = (url, parent) => {
            parser.href = url;
            return parser.hostname === 'www.imdb.com' || parser.hostname === 'www.kinopoisk.ru' ||
                parent.hostname === 'radikal.ru' && url === undefined;
        };

        function redefineOpen(root) {
            if ('open' in root)
                root.open = new root.Proxy(root.open, _cloneInto({
                    apply(fun, that, args) {
                        if (openWhitelist(args[0], location)) {
                            _console.log('Whitelisted popup:', ...args);
                            return _apply(fun, that, args);
                        }
                        return openFunc(...args);
                    }
                }, root));
        }
        redefineOpen(win);

        const getTagName = _bindCall(Object.getOwnPropertyDescriptor(_Element, 'tagName').get);
        const hasOwnProperty = _bindCall(Object.hasOwnProperty);
        const createElementWrapper = {
            apply(fun, that, args) {
                const el = _apply(fun, that, args);
                // redefine window.open in first-party frames
                if (getTagName(el) === 'IFRAME' || getTagName(el) === 'OBJECT')
                    el.addEventListener('load', (e) => {
                        try {
                            redefineOpen(e.target.contentWindow);
                        } catch (ignore) {}
                    }, false);
                return el;
            }
        };

        function redefineCreateElement(obj) {
            for (let root of [obj.document, Object.getPrototypeOf(obj.HTMLDocument.prototype)])
                if (hasOwnProperty(root, 'createElement'))
                    root.createElement = new root.Proxy(root.createElement, _cloneInto(createElementWrapper, root));
        }
        redefineCreateElement(win);

        // wrap window.open in newly added first-party frames
        const wrappedAppendChild = new root.Proxy(_Node.appendChild, _cloneInto({
            apply(fun, that, args) {
                let el = _apply(fun, that, args);
                if (el instanceof HTMLIFrameElement)
                    try {
                        redefineOpen(el.contentWindow);
                        redefineCreateElement(el.contentWindow);
                    } catch (ignore) {}
                return el;
            }
        }, root));
        // ABP Freeze Element snippet replaces normal properties with getters without setters
        const _Node_appendChild = Object.getOwnPropertyDescriptor(Node.prototype, 'appendChild');
        if (_Node_appendChild.configurable) {
            if (_Node_appendChild.value)
                _Node_appendChild.value = wrappedAppendChild;
            if (_Node_appendChild.get)
                _Node_appendChild.get = () => wrappedAppendChild;
            Object.defineProperty(_Node, 'appendChild', _Node_appendChild);
        }
    }

    // Function to catch and block various methods to open a new window with 3rd-party content.
    // Some advertisement networks went way past simple window.open call to circumvent default popup protection.
    // This funciton blocks window.open, ability to restore original window.open from an IFRAME object,
    // ability to perform an untrusted (not initiated by user) click on a link, click on a link without a parent
    // node or simply a link with piece of javascript code in the HREF attribute.
    function preventPopups() {
        // call sandbox-me if in iframe and not whitelisted
        if (inIFrame) {
            win.top.postMessage({
                name: 'sandbox-me',
                href: win.location.href
            }, '*');
            return;
        }

        scriptLander(() => {
            let open = (...args) => {
                '[native code]';
                _console.trace('Site attempted to open a new window', ...args);
                return {
                    document: nt.proxy({
                        write: nt.func({}, 'write'),
                        writeln: nt.func({}, 'writeln')
                    }),
                    location: nt.proxy({})
                };
            };

            createWindowOpenWrapper(open);

            _console.log('Popup prevention enabled.');
        }, nullTools, createWindowOpenWrapper);
    }

    // Helper function to close background tab if site opens itself in a new tab and then
    // loads a 3rd-party page in the background one (thus performing background redirect).
    function preventPopunders() {
        // create "close_me" event to call high-level window.close()
        let eventName = `close_me_${Math.random().toString(36).substr(2)}`;
        let callClose = () => {
            _console.log('close call');
            window.close();
        };
        window.addEventListener(eventName, callClose, true);

        scriptLander(() => {
            // get host of a provided URL with help of an anchor object
            // unfortunately new URL(url, window.location) generates wrong URL in some cases
            let parseURL = _document.createElement('A');
            let getHost = url => {
                parseURL.href = url;
                return parseURL.hostname;
            };
            // site went to a new tab and attempts to unload
            // call for high-level close through event
            let closeWindow = () => window.dispatchEvent(new CustomEvent(eventName, {}));
            // check is URL local or goes to different site
            let isLocal = (url) => {
                if (url === location.pathname || url === location.href)
                    return true; // URL points to current pathname or full address
                let host = getHost(url);
                let site = location.hostname;
                return host !== '' && // URLs with unusual protocol may have empty 'host'
                    (site === host || site.endsWith(`.${host}`) || host.endsWith(`.${site}`));
            };

            let _open = window.open.bind(window);
            let open = (...args) => {
                '[native code]';
                let url = args[0];
                if (url && isLocal(url))
                    window.addEventListener('beforeunload', closeWindow, true);
                return _open(...args);
            };

            createWindowOpenWrapper(open);

            _console.log("Background redirect prevention enabled.");
        }, `let eventName="${eventName}"`, nullTools, createWindowOpenWrapper);
    }

    // Mix between check for popups and popunders
    // Significantly more agressive than both and can't be used as universal solution
    function preventPopMix() {
        if (inIFrame) {
            win.top.postMessage({
                name: 'sandbox-me',
                href: win.location.href
            }, '*');
            return;
        }

        // create "close_me" event to call high-level window.close()
        let eventName = `close_me_${Math.random().toString(36).substr(2)}`;
        let callClose = () => {
            _console.log('close call');
            window.close();
        };
        window.addEventListener(eventName, callClose, true);

        scriptLander(() => {
            let _open = window.open,
                parseURL = _document.createElement('A');
            // get host of a provided URL with help of an anchor object
            // unfortunately new URL(url, window.location) generates wrong URL in some cases
            let getHost = (url) => {
                parseURL.href = url;
                return parseURL.host;
            };
            // site went to a new tab and attempts to unload
            // call for high-level close through event
            let closeWindow = () => {
                _open(window.location, '_self');
                window.dispatchEvent(new CustomEvent(eventName, {}));
            };
            // check is URL local or goes to different site
            function isLocal(url) {
                let loc = window.location;
                if (url === loc.pathname || url === loc.href)
                    return true; // URL points to current pathname or full address
                let host = getHost(url),
                    site = loc.host;
                if (host === '')
                    return false; // URLs with unusual protocol may have empty 'host'
                if (host.length > site.length)
                    [site, host] = [host, site];
                return site.includes(host, site.length - host.length);
            }

            // add check for redirect for 5 seconds, then disable it
            function checkRedirect() {
                window.addEventListener('beforeunload', closeWindow, true);
                setTimeout(closeWindow => window.removeEventListener('beforeunload', closeWindow, true), 5000, closeWindow);
            }

            function open(url, name) {
                '[native code]';
                if (url && isLocal(url) && (!name || name === '_blank')) {
                    _console.trace('Suspicious local new window', ...arguments);
                    checkRedirect();
                    /* jshint validthis: true */
                    return _open.apply(this, arguments);
                }
                _console.trace('Blocked attempt to open a new window', ...arguments);
                return {
                    document: {
                        write() {},
                        writeln() {}
                    }
                };
            }

            function clickHandler(e) {
                let link = e.target,
                    url = link.href || '';
                if (e.targetParentNode && e.isTrusted || link.target !== '_blank') {
                    _console.log('Link', link, 'were created dinamically, but looks fine.');
                    return true;
                }
                if (isLocal(url) && link.target === '_blank') {
                    _console.log('Suspicious local link', link);
                    checkRedirect();
                    return;
                }
                _console.log('Blocked suspicious click on a link', link);
                e.stopPropagation();
                e.preventDefault();
            }

            createWindowOpenWrapper(open, clickHandler);

            _console.log("Mixed popups prevention enabled.");
        }, `let eventName="${eventName}"`, createWindowOpenWrapper);
    }
    // External listener for case when site known to open popups were loaded in iframe
    // It will sandbox any iframe which will send message 'forbid.popups' (preventPopups sends it)
    // Some sites replace frame's window.location with data-url to run in clean context
    if (!inIFrame) window.addEventListener(
        'message',
        function (e) {
            if (!e.data || e.data.name !== 'sandbox-me' || !e.data.href)
                return;
            let src = e.data.href;
            for (let frame of _document.querySelectorAll('iframe'))
                if (frame.contentWindow === e.source) {
                    if (frame.hasAttribute('sandbox')) {
                        if (!frame.sandbox.contains('allow-popups'))
                            return; // exit frame since it's already sandboxed and popups are blocked
                        // remove allow-popups if frame already sandboxed
                        frame.sandbox.remove('allow-popups');
                    } else
                        // set sandbox mode for troublesome frame and allow scripts, forms and a few other actions
                        // technically allowing both scripts and same-origin allows removal of the sandbox attribute,
                        // but to apply content must be reloaded and this script will re-apply it in the result
                        frame.setAttribute('sandbox', 'allow-forms allow-scripts allow-presentation allow-top-navigation allow-same-origin');
                    _console.log('Disallowed popups from iframe', frame);

                    // reload frame content to apply restrictions
                    if (!src) {
                        src = frame.src;
                        _console.log('Unable to get current iframe location, reloading from src', src);
                    } else
                        _console.log('Reloading iframe with URL', src);
                    frame.src = 'about:blank';
                    frame.src = src;
                }
        }, false
    );

    const evalPatternYandex = /{exports:{},id:r,loaded:!1}|containerId:(.|\r|\n)+params:/,
          evalPatternGeneric = /_0x|location\s*?=|location.href\s*?=|location.assign\(|open\(/i;

    function selectiveEval(...patterns) {
        let fullLog = false;
        if (patterns[patterns.length - 1] === true) {
            fullLog = true;
            patterns.length = patterns.length - 1;
        }
        if (patterns.length === 0)
            patterns.push(evalPatternGeneric);
        win.eval = new _Proxy(win.eval, _cloneInto({
            apply(fun, that, args) {
                if (patterns.some(pattern => pattern.test(args[0]))) {
                    _console[fullLog ? 'trace' : 'log'](`Skipped eval ${fullLog ? args[0] : args[0].slice(0, 512)}${fullLog ? '' : '\u2026'}`);
                    return null;
                }
                try {
                    if (fullLog)
                        _console.trace(`eval ${args[0]}`);
                    return _apply(fun, that, args);
                } catch (e) {
                    _console.error('Crash source:', args[0]);
                    throw e;
                }
            }
        }));
    }
    selectiveEval.toString = new _Proxy(selectiveEval.toString, _cloneInto({
        apply(...args) {
            return `${_apply(...args)} const evalPatternYandex = ${evalPatternYandex}, evalPatternGeneric = ${evalPatternGeneric}`;
        }
    }));

    // hides cookies by pattern and attempts to remove them if they already set
    // also prevents setting new versions of such cookies
    function selectiveCookies(scPattern = '', opts = {}) {
        const patterns = scPattern.split('|');
        if (patterns[0] !== '~default') {
            // Google Analytics cookies
            patterns.push('_g(at?|id)|__utm[a-z]');
            // Yandex ABP detection cookies
            patterns.push('altrs|bltsr|blcrm');
        } else
            patterns.shift();

        const withValue = f => f.includes('=');
        const withoutValue = f => !withValue(f);
        const blacklist = new RegExp(`^((${patterns.filter(withoutValue).join('|')})=.*|${patterns.filter(withValue).join('|')})$`);

        const root = opts.root || win;
        const _root_Document = Object.getPrototypeOf(root.HTMLDocument.prototype);
        const _doc_proto = ('cookie' in _root_Document) ? _root_Document : Object.getPrototypeOf(root.document);
        const _cookie = Object.getOwnPropertyDescriptor(_doc_proto, 'cookie');
        const _set_cookie = _bindCall(_cookie.set);

        let removed = new Set();
        const removeLog = (cookie) => {
            let strings = [`${cookie.name}=${cookie.value}`];
            if (cookie.domain)
                strings.push(`domain=${cookie.domain}`);
            if (cookie.path)
                strings.push(`path=${cookie.path}`);
            if (cookie.sameSite !== 'unspecified')
                strings.push(`sameSite=${cookie.sameSite}`);
            for (let name of ['httpOnly', 'hostOnly', 'secure', 'session'])
                if (cookie[name]) strings.push(name);
            let full = strings.join('; ');
            if (!removed.has(full))
                _console.log(`Removed cookie: ${full}`);
            removed.add(full);
        };

        let skipTM = true;
        const asyncCookieCleaner = () => {
            GM.cookie.list({
                url: location.href
            }).then(cookies => {
                if (!cookies) return;
                if (skipTM) {
                    cookies = cookies.filter(x => !x.name.startsWith('TM_'));
                    skipTM = false;
                }
                for (let cookie of cookies)
                    if (blacklist.test(`${cookie.name}=${cookie.value}`)) {
                        if (skipTM && cookie.name)
                            continue;
                        GM.cookie.delete(cookie);
                        removeLog(cookie);
                    }
            }, () => null);
        };

        const useOldPass = (() => {
            if (GM.info.scriptHandler === 'Tampermonkey' && GM.info.version === undefined)
                return false; // TM Beta doesn't have a version, apparently
            // returns true if GM version <= 4.10
            let v = GM.info.version.split('.').map(x => x - 0);
            return v[0] < 4 || v[0] === 4 && v[1] <= 10 && v[2] === undefined || GM.info.scriptHandler !== 'Tampermonkey';
        })();

        const getName = (cookie) => cookie && cookie.includes('=') ? /^(.+?)=/.exec(cookie)[1] : cookie;
        const removeCookie = (cookie, that) => {
            const expireCookie = (name, domain) => {
                domain = domain ? `;domain=${domain.join('.')}` : '';
                _set_cookie(that, `${name}=;Max-Age=0;path=/${domain}`);
                _set_cookie(that, `${name}=;Max-Age=0;path=/${domain.replace('=', '=.')}`);
            };
            const name = getName(cookie);
            const domain = that.location.hostname.split('.');

            expireCookie(name);
            while (domain.length > 1) {
                try {
                    expireCookie(name, domain);
                } catch (e) {
                    _console.error(e);
                }
                domain.shift();
            }
            _console.log('Removing existing cookie:', cookie);
        };

        if (_cookie) {
            // skip setting unwanted cookies
            _cookie.set = new _Proxy(_cookie.set, _cloneInto({
                apply(fun, that, args) {
                    if (useOldPass) {
                        let cookie = args[0];
                        if (blacklist.test(cookie)) {
                            _console.log('Ignored cookie: %s', cookie);
                            removeCookie(cookie, that);
                            return;
                        }
                    }
                    _apply(fun, that, args);
                    asyncCookieCleaner();
                    return true;
                }
            }));
            // hide unwanted cookies from site
            _cookie.get = new _Proxy(_cookie.get, _cloneInto({
                apply(fun, that, args) {
                    asyncCookieCleaner();
                    const res = _apply(fun, that, args).split(/;\s?/);
                    const clean = res.filter(cookie => !blacklist.test(cookie));
                    if (useOldPass && clean.length !== res.length)
                        for (let cookie of res.filter(cookie => !clean.includes(cookie)))
                            removeCookie(cookie, that);
                    return clean.join('; ');
                }
            }));
            Object.defineProperty(_doc_proto, 'cookie', _cookie);
            _console.log('Active cookies:', root.document.cookie);
        }
    }

    // Locates a node with specific text in Russian
    // Uses table of substitutions for similar letters
    let selectNodeByTextContent = (() => {
        let subs = {
            // english & greek
            'А': 'AΑ',
            'В': 'BΒ',
            'Г': 'Γ',
            'Е': 'EΕ',
            'З': '3',
            'К': 'KΚ',
            'М': 'MΜ',
            'Н': 'HΗ',
            'О': 'OΟ',
            'П': 'Π',
            'Р': 'PΡ',
            'С': 'C',
            'Т': 'T',
            'Ф': 'Φ',
            'Х': 'XΧ'
        };
        let regExpBuilder = text => new RegExp(
            text.toUpperCase()
            .split('')
            .map(function (e) {
                return `${e in subs ? `[${e}${subs[e]}]` : (e === ' ' ? '\\s+' : e)}[\u200b\u200c\u200d]*`;
            })
            .join(''),
            'i');
        let reMap = {};
        return (re, opts = {
            root: _document.body
        }) => {
            if (!re.test) {
                if (!reMap[re])
                    reMap[re] = regExpBuilder(re);
                re = reMap[re];
            }

            for (let child of opts.root.children)
                if (re.test(child.textContent)) {
                    if (opts.shallow)
                        return child;
                    opts.root = child;
                    return selectNodeByTextContent(re, opts) || child;
                }
        };
    })();

    // webpackJsonp filter
    function webpackJsonpFilter(blacklist, log = false) {
        function wrapPush(webpack) {
            let _push = webpack.push.bind(webpack);
            Object.defineProperty(webpack, 'push', _cloneInto({
                get() {
                    return _push;
                },
                set(vl) {
                    _push = new _Proxy(vl, _cloneInto({
                        apply(fun, that, args) {
                            wrapper: {
                                if (!(args[0] instanceof Array))
                                    break wrapper;
                                let mainName;
                                if (args[0][2] instanceof Array && args[0][2][0] instanceof Array)
                                    mainName = args[0][2][0][0];
                                let funs = args[0][1];
                                if (!(funs instanceof Object && !(funs instanceof Array)))
                                    break wrapper;
                                const noopFunc = (name, text) => () => _console.log(`Skip webpack ${name}`, text);
                                for (let name in funs) {
                                    if (typeof funs[name] !== 'function')
                                        continue;
                                    if (blacklist.test(_toString(funs[name])) && name !== mainName)
                                        funs[name] = noopFunc(name, log ? _toString(funs[name]) : '');
                                }
                            }
                            _console.log('webpack.push()');
                            return _apply(fun, that, args);
                        }
                    }));
                    return true;
                }
            }));
            return webpack;
        }
        let _webpackJsonp = wrapPush([]);
        Object.defineProperty(win, 'webpackJsonp', _cloneInto({
            get() {
                return _webpackJsonp;
            },
            set(vl) {
                if (vl === _webpackJsonp)
                    return;
                _console.log('new webpackJsonp', vl);
                _webpackJsonp = wrapPush(vl);
            }
        }));
    }

    // JSON filter
    // removeList - list of paths divided by space to remove
    // checkList  - optional list of paths divided by space to check presence of before removal
    const jsonFilter = (function jsonFilterModule() {
        const _log = (() => {
            if (!jsf.AccessStatistics)
                return () => null;
            const counter = {};
            const counterToString = () => Object.entries(counter).map(a => `\n * ${a.join(': ')}`).join('');
            let lock = 0;
            return async function _log(path) {
                counter[path] = (counter[path] || 0) + 1;
                lock++;
                setTimeout(() => {
                    lock--;
                    if (lock === 0)
                        _console.log('JSON filters:', counterToString());
                }, 3333);
            };
        })();

        const isObjecty = o => (typeof o === 'object' || typeof o === 'function') && o !== null;

        function parsePath(root, path) {
            let pos;
            pos = path.indexOf('.');
            for (let name; pos > 0;) {
                name = path.slice(0, pos);
                if (!isObjecty(root[name]))
                    break;
                root = root[name];
                path = path.slice(pos + 1);
                pos = path.indexOf('.');
            }
            return [pos < 0 && _hasOwnProperty(root, path), root, path];
        }

        const filterList = [];

        function filter(result) {
            if (!isObjecty(result))
                return result;

            const pathNotInObject = path => !(parsePath(result, path)[0]);
            const removePathInObject = path => {
                let [exist, root, name] = parsePath(result, path);
                if (exist) {
                    delete root[name];
                    _log(path);
                }
            };
            for (let list of filterList) {
                if (list.check && list.check.some(pathNotInObject))
                    return result;
                list.remove.forEach(removePathInObject);
            }

            return result;
        }


        let wrapped = false;

        function jsonFilter(removeList, checkList) {
            filterList.push({
                remove: removeList.split(/\s/),
                check: checkList ? checkList.split(/\s/) : undefined
            });

            if (wrapped) return;
            wrapped = true;

            win.JSON.parse = new _Proxy(win.JSON.parse, _cloneInto({
                apply(fun, that, args) {
                    return filter(_apply(fun, that, args));
                }
            }));

            win.Response.prototype.json = new _Proxy(win.Response.prototype.json, _cloneInto({
                apply(fun, that, args) {
                    let promise = _apply(fun, that, args);
                    promise.then(res => filter(res));
                    return promise;
                }
            }));
        }
        jsonFilter.toString = () => `const jsonFilter = (${jsonFilterModule.toString()})()`;
        return jsonFilter;
    })();

    function zmcPlug(conf) {
        // enable Emcode debug mode in ZMCTrack code (just to see it in the log)
        const _RegExpToString = _bindCall(RegExp.prototype.toString);
        String.prototype.match = new _Proxy(String.prototype.match, _cloneInto({
            apply(fun, that, args) {
                let str = typeof args[0] === 'string' ? args[0] : _RegExpToString(args[0]);
                if (str.includes('argon_debug'))
                    return true;
                return _apply(fun, that, args);
            }
        }));
        // catch and overwrite API in the clean IFrame created by ZMCTrack
        _Node.appendChild = new _Proxy(_Node.appendChild, _cloneInto({
            apply(fun, that, args) {
                const res = _apply(fun, that, args);
                if (res && res.name && res.name.startsWith('_m')) {
                    const zmcWin = win[res.name];
                    if (!zmcWin) return;
                    zmcWin.write = nt.func(null, 'zmc.write', true);
                    zmcWin.setTimeout = nt.func(null, 'zmc.setTimeout', true);
                    zmcWin.document.addEventListener = nt.func(null, 'zmc.document.addEventListener', true);
                    zmcWin.XMLHttpRequest.prototype.open = nt.func(null, 'zmc.XMLHttpRequest.prototype.open', true);
                    zmcWin.XMLHttpRequest.prototype.send = nt.func(null, 'zmc.XMLHttpRequest.prototype.send', true);
                }
                return res;
            }
        }));

        const define = name => {
            let _win;
            Object.defineProperty(win, name, _cloneInto({
                get() {
                    if (!_win) {
                        let frame = _document.querySelector(`iframe[name="${name}"`);
                        if (frame)
                            _win = frame.contentWindow;
                    }
                    return _win;
                }
            }));
        };
        // "predict" names of zmctrack frames on certain domains which use date-based frame names
        // id - some fixed number, zone - server's timezone (hours), step - how often name changes (minutes)
        // range - period in hours to cover from -range/2 to +range/2, offset - fixed number of minutes to add
        if (typeof conf === 'object') {
            let {
                id,
                zone = 2,
                step = 5,
                range = 3,
                offset = 0
            } = conf;
            const pad = n => n.toString().padStart(2, '0');
            const m2ms = x => x * 60 * 1000;
            const d = new Date();
            d.setTime(Math.floor(d.getTime() / m2ms(step)) * m2ms(step) + m2ms(zone * 60) + m2ms(offset));
            const defineByDate = d => {
                define(`n${pad(
                    d.getUTCMonth() + 1
                )}${pad(
                    d.getUTCDate()
                )}${pad(
                    d.getUTCHours()
                )}${pad(
                    d.getUTCMinutes()
                )}${(
                    id ? `_${id}` : ''
                )}`);
            };
            const time = d.getTime();
            for (let n = -Math.floor(range * 30 / step); n <= Math.floor(range * 30 / step); n += 1) {
                d.setTime(time + n * m2ms(step));
                defineByDate(d);
            }
        }
        if (typeof conf === 'string')
            define(conf);
    }

    function documentRewrite(pattern, substitute) {
        /* jshint -W060 */ // document.write is a form of evil, a necessary evil in this case
        const inject = (pattern, substitute) => {
            let xhr = new XMLHttpRequest();
            xhr.open('GET', location.href);
            xhr.onload = () => {
                document.close();
                //console.log(xhr.responseText.match(pattern));
                document.write(xhr.responseText.replace(pattern, substitute));
                document.close();
            };
            xhr.send();
        };
        /* jshint +W060 */
        const style = [
            '@keyframes spinner { 0% { transform: translate3d(-50%, -50%, 0) rotate(0deg); } 100% { transform: translate3d(-50%, -50%, 0) rotate(360deg); } }',
            '.spinner::before { animation: 1.5s linear infinite spinner; animation-play-state: running;',
            'content: ""; border: solid 3px #dedede; border-bottom-color: #EF6565; border-radius: 50%;',
            'height: 10vh; width: 10vh; left: 50%; top: 50%; position: absolute; transform: translate3d(-50%, -50%, 0); };'
        ].join('');
        _document.write(`<html><head><script>(${inject.toString()})(${pattern.toString()},'${substitute}')</script>`);
        _document.write(`<style>${style}</style></head><body><div class="spinner"></div></body></html>`);
    }

    // === Scripts for specific domains ===

    const scripts = {
        // Prevent Popups
        preventPopups: {
            other: 'biqle.ru, chaturbate.com, dfiles.ru, eporner.eu, hentaiz.org, mirrorcreator.com, online-multy.ru' +
                'radikal.ru, rumedia.ws, tapehub.tech, thepiratebay.org, unionpeer.com, zippyshare.com',
            now: preventPopups
        },
        // Prevent Popunders (background redirect)
        preventPopunders: {
            other: 'lostfilm-online.ru, mediafire.com, megapeer.org, megapeer.ru, perfectgirls.net',
            now: preventPopunders
        },
        // zmctrack remover
        zmcDocumentRewrite: {
            other: 'www.ukr.net', // generic script removal pattern
            now: () => documentRewrite(/<iframe\sname="n\d+(_\d+)?"\sstyle="display:none"><\/iframe><script(\s+[^>]+)?>.*?<\/script>/, '<!-- removed -->')
        },
        zmcPlug: {
            other: [
                '4mama.ua,beauty.ua,eknigi.org,forumodua.com,internetua.com,mama.ua,newsyou.info,okino.ua,orakul.com',
                'sinoptik.ua,toneto.net,tvgid.ua,tvoymalysh.com.ua,udoktora.net'
            ].join(','),
            now: () => {
                if (GM.info.scriptHandler === 'Violentmonkey')
                    documentRewrite(/ /, ' ');
                zmcPlug();
            }
        },
        zmcPlugTime: {
            other: [ // using time-based iframe names
                'avtovod.com.ua,bigmir.net,hvylya.net,inforesist.org,isport.ua',
                'kolobok.ua,kriminal.tv,nnovosti.info,smak.ua,tochka.net,tv.ua'
            ].join(','),
            now: () => {
                let is = name => location.hostname === name || location.hostname.includes(name);
                if ([
                    ['avtovod.com', 'id', 12754],
                    ['hvylya.net', 'step', 5, 'range', 15],
                    ['inforesist.org', 'step', 30, 'range', 64],
                    ['kriminal.tv', 'id', 12393],
                    ['nnovosti.info', 'id', 12397],
                    ['tochka.net', 'step', 1, 'range', 2.2],
                ].some(e => is(e[0]) && !zmcPlug( // object from flat key/value array
                    e.reduceRight((o, x, i) => (o[i % 2 ? x : 'x'] = i % 2 ? o.x : x, o), {})
                ))) return;
                zmcPlug({});
            }
        },
        // using fixed iframe names
        'censor.net': () => zmcPlug('n11111512'),
        'enovosty.com': () => zmcPlug('n01212138'),
        'epravda.com.ua': () => zmcPlug('n10121300'),
        'eurointegration.com.ua': () => zmcPlug('n09141907'),
        'football24.ua': () => zmcPlug('n04211212'),
        'gazeta.ua': () => zmcPlug('n11241758'),
        'i.ua': () => zmcPlug('n03021349'),
        'meteofor.com.ua': () => zmcPlug('n05171007'),
        'meteo.ua': () => zmcPlug('n09021131'),
        'mport.ua': () => zmcPlug('n11071239'),
        'nv.ua': () => zmcPlug('n10051437'),
        'pravda.com.ua': () => {
            zmcPlug('n09151519');
            nt.define('AdnetLoadScript');
        },
        'real-vin.com': () => zmcPlug('n09221148'),
        'viva.ua': () => zmcPlug('n07151030_11817'),
        // custom zmc-related fixes
        'kzblow.info': () => documentRewrite(/<script>\(function\(\w\w,.*?['"]n\d+['"]\);<\/script>/, '<!-- removed -->'),
        // disables ads when specific cookies are set
        'liga.net': () => (_document.cookie = 'isShowAd=false; domain=.liga.net', _document.cookie = 'is_login=true; domain=.liga.net'),
        // disables ads if screen width is below 1200
        'segodnya.ua': () => {
            nt.define('document.documentElement', new _Proxy(_document.documentElement, _cloneInto({
                get(that, prop) {
                    if (prop === 'clientWidth' && that[prop] > 1199)
                        return 1199;
                    return that[prop];
                }
            })));
        },

        // PopMix (both types of popups encountered on site)
        'openload.co': {
            other: 'oload.tv, oload.info, openload.co.com',
            now() {
                if (inIFrame) {
                    nt.define('BetterJsPop', {
                        add(a, b) {
                            _console.trace('BetterJsPop.add(%o, %o)', a, b);
                        },
                        config(o) {
                            _console.trace('BetterJsPop.config(%o)', o);
                        },
                        Browser: {
                            isChrome: true
                        }
                    });
                    nt.define('isSandboxed', nt.func(null, 'isSandboxed'));
                    nt.define('adblock', false);
                    nt.define('adblock2', false);
                } else preventPopMix();
            }
        },

        'turbobit.net': preventPopMix,

        'tapochek.net': () => {
            // workaround for moradu.com/apu.php load error handler script, not sure which ad network is this
            let _appendChild = Object.getOwnPropertyDescriptor(_Node, 'appendChild');
            let _appendChild_value = _appendChild.value;
            _appendChild.value = function appendChild(node) {
                if (this === _document.body)
                    if ((node instanceof HTMLScriptElement || node instanceof HTMLStyleElement) &&
                        /^https?:\/\/[0-9a-f]{15}\.com\/\d+(\/|\.css)$/.test(node.src) ||
                        node instanceof HTMLDivElement && node.style.zIndex > 900000 &&
                        node.style.backgroundImage.includes('R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7'))
                        throw '...eenope!';
                return _appendChild_value.apply(this, arguments);
            };
            Object.defineProperty(_Node, 'appendChild', _appendChild);

            // disable window focus tricks and changing location
            let focusHandlerName = /\WfocusAchieved\(/;
            let _setInterval = win.setInterval;
            win.setInterval = (...args) => {
                if (args.length && focusHandlerName.test(_toString(args[0]))) {
                    _console.log('skip setInterval for', ...args);
                    return -1;
                }
                return _setInterval(...args);
            };
            let _addEventListener = win.addEventListener;
            win.addEventListener = function (...args) {
                if (args.length && args[0] === 'focus' && focusHandlerName.test(_toString(args[1]))) {
                    _console.log('skip addEventListener for', ...args);
                    return undefined;
                }
                return _addEventListener.apply(this, args);
            };

            // generic popup prevention
            preventPopups();
        },

        // = other ======================================================================================

        '1plus1.video': () => {
            let noopDefine = ['abMessage', 'BLOCK'];
            win.Object.defineProperty = new _Proxy(win.Object.defineProperty, _cloneInto({
                apply(fun, that, args) {
                    let [, prop, desc] = args;
                    if (noopDefine.includes(prop)) {
                        delete desc.get;
                        delete desc.set;
                        desc.value = () => {};
                    }
                    return _apply(fun, that, args);
                }
            }));
            /* jshint -W001 */ // aka 'hasOwnProperty' is a really bad name, but this is a wrapper
            win.Object.prototype.hasOwnProperty = new _Proxy(win.Object.prototype.hasOwnProperty, _cloneInto({
                apply(fun, that, args) {
                    if (args[0] === 'dl')
                        return false; // when true checks is partner and changes value of 'wa'
                    return _apply(fun, that, args);
                }
            }));
        },

        '1tv.ru': {
            other: 'mediavitrina.ru',
            now: () => scriptLander(() => {
                nt.define('EUMPAntiblockConfig', nt.proxy({
                    url: '//www.1tv.ru/favicon.ico'
                }));
                nt.define('Object.prototype.disableSeek', nt.func(undefined, 'disableSeek'));
                //nt.define('preroll', undefined);

                let _EUMP;
                const _EUMP_set = x => {
                    if (x === _EUMP)
                        return true;
                    let _plugins = x.plugins;
                    Object.defineProperty(x, 'plugins', _cloneInto({
                        enumerable: true,
                        get() {
                            return _plugins;
                        },
                        set(vl) {
                            if (vl === _plugins)
                                return true;
                            nt.defineOn(vl, 'antiblock', function (player, opts) {
                                const antiblock = nt.proxy({
                                    opts: opts,
                                    readyState: 'ready',
                                    isEUMPPlugin: true,
                                    detected: nt.func(false, 'antiblock.detected'),
                                    currentWeight: nt.func(0, 'antiblock.currentWeight')
                                });
                                player.antiblock = antiblock;
                                return antiblock;
                            }, 'EUMP.plugins.');
                            _plugins = vl;
                        }
                    }));
                    _EUMP = x;
                    return true;
                };
                if ('EUMP' in win)
                    _EUMP_set(win.EUMP);
                Object.defineProperty(win, 'EUMP', _cloneInto({
                    enumerable: true,
                    get() {
                        return _EUMP;
                    },
                    set: _EUMP_set
                }));

                let _EUMPVGTRK;
                const _EUMPVGTRK_set = x => {
                    if (x === _EUMPVGTRK)
                        return true;
                    if (x && x.prototype) {
                        if ('generatePrerollUrls' in x.prototype)
                            nt.defineOn(x.prototype, 'generatePrerollUrls', nt.func(null, 'EUMPVGTRK.generatePrerollUrls'), 'EUMPVGTRK.prototype.', {
                                enumerable: false
                            });
                        if ('sendAdsEvent' in x.prototype)
                            nt.defineOn(x.prototype, 'sendAdsEvent', nt.func(null, 'EUMPVGTRK.sendAdsEvent'), 'EUMPVGTRK.prototype.', {
                                enumerable: false
                            });
                    }
                    _EUMPVGTRK = x;
                    return true;
                };
                if ('EUMPVGTRK' in win)
                    _EUMPVGTRK_set(win.EUMPVGTRK);
                Object.defineProperty(win, 'EUMPVGTRK', _cloneInto({
                    enumerable: true,
                    get() {
                        return _EUMPVGTRK;
                    },
                    set: _EUMPVGTRK_set
                }));
            }, nullTools)
        },

        '24smi.org': () => {
            selectiveCookies('isab');
            abortExecution.onGet('Object.prototype.getYa');
            abortExecution.onAll('Object.prototype.YaBaseController');
        },

        '2picsun.ru': {
            other: 'pics2sun.ru, 3pics-img.ru',
            now() {
                Object.defineProperty(navigator, 'userAgent', _cloneInto({
                    value: 'googlebot'
                }));
            }
        },

        '4pda.to': {
            now() {
                // https://greasyfork.org/en/scripts/14470-4pda-unbrender
                const _setAttribute = _bindCall(_Element.setAttribute);
                const _removeChild = _bindCall(_Element.removeChild);
                const isForum = location.pathname.startsWith('/forum/');
                const remove = node => (node && _removeChild(node.parentNode, node));
                const hide = node => node && _setAttribute(node, 'style', 'display:none!important');

                selectiveCookies('viewpref');
                abortExecution.inlineScript('document.querySelector', {
                    pattern: /\(document(,window)?\);/
                });

                const log = false;

                function cleaner() {
                    HeaderAds: {
                        // hide ads above HEADER
                        let nav = _querySelector('.menu-main-item');
                        while (nav && (nav.parentNode !== _de)) {
                            if (!nav.parentNode.querySelector('article, .container[itemtype$="Article"]') && nav.parentNode.clientHeight < 500)
                                nav = nav.parentNode;
                            else break;
                        }
                        if (!nav || (nav.parentNode === _de)) {
                            if (log) _console.warn('Unable to locate header element');
                            break HeaderAds;
                        }
                        if (log) _console.log('Processing header:', nav);
                        for (let itm of nav.parentNode.children)
                            if (itm !== nav)
                                hide(itm);
                            else break;
                    }

                    FixNavMenu: {
                        // hide ad link from the navigation
                        let ad = _querySelector('.menu-main-item > a > svg');
                        if (ad) {
                            ad = ad.parentNode.parentNode;
                            hide(ad);
                            if (log) _console.log('Hid menu ad item:', ad);
                            break FixNavMenu;
                        }
                        if (log) _console.warn('Unable to locate menu ad item');
                    }

                    SidebarAds: {
                        // remove ads from sidebar
                        let aside = _querySelectorAll('[class]:not([id]) > [id]:not([class]) > :first-child + :last-child:not(.v-panel)');
                        if (!aside.length) {
                            if (log) _console.warn('Unable to locate sidebar');
                            break SidebarAds;
                        }
                        for (let side of aside) {
                            if (log) _console.log('Processing potential sidebar:', side);
                            for (let itm of Array.from(side.children)) {
                                if (itm.classList.contains('post'))
                                    continue;
                                if (itm.querySelector('iframe') || !itm.children.length)
                                    remove(itm);
                                let script = itm.querySelector('script');
                                if (itm.querySelector('a[target="_blank"] > img') ||
                                    script && script.src === '' && (script.type === 'text/javascript' || !script.type) &&
                                    script.textContent.includes('document')) {
                                    if (log) _console.log('Hid:', itm);
                                    hide(itm);
                                }
                            }
                        }
                    }
                }

                const cln = setInterval(cleaner, 100);

                // hide banner next to logo and header banner in profiles
                if (isForum)
                    createStyle([
                        'div[class]:not([id]) tr[valign="top"] > td:last-child { display: none !important }',
                        'html[style] > body [class]:not([id]):not(div):not([style]) > div:empty + [data-revive-zoneid] { display: none !important }'
                    ]);
                // clean page
                window.addEventListener(
                    'DOMContentLoaded',
                    function () {
                        clearInterval(cln);
                        const width = () => win.innerWidth || _de.clientWidth || _document.body.clientWidth || 0;
                        const height = () => win.innerHeight || _de.clientHeight || _document.body.clientHeight || 0;

                        if (isForum) {
                            // hide banner next to logo
                            //let itm = _document.querySelector('#logostrip');
                            //if (itm) hide(itm.parentNode.nextSibling);
                            // clear background in the download frame
                            if (location.pathname.startsWith('/forum/dl/')) {
                                let setBackground = node => _setAttribute(
                                    node,
                                    'style', (_getAttribute(node, 'style') || '') +
                                    ';background-color:#4ebaf6!important'
                                );
                                setBackground(_document.body);
                                for (let itm of _document.querySelectorAll('body > div'))
                                    if (!itm.querySelector('.dw-fdwlink, .content') && !itm.classList.contains('footer'))
                                        remove(itm);
                                    else
                                        setBackground(itm);
                            }
                            // exist from DOMContentLoaded since the rest is not for forum
                            return;
                        }

                        cleaner();

                        _document.body.setAttribute('style', (_document.body.getAttribute('style') || '') + ';background-color:#E6E7E9!important');

                        let extra = 'background-image:none!important;background-color:transparent!important',
                            fakeStyles = new WeakMap(),
                            styleProxy = {
                                get(target, prop) {
                                    return fakeStyles.get(target)[prop] || target[prop];
                                },
                                set(target, prop, value) {
                                    let fakeStyle = fakeStyles.get(target);
                                    ((prop in fakeStyle) ? fakeStyle : target)[prop] = value;
                                    return true;
                                }
                            };
                        for (let itm of _document.querySelectorAll('[id]:not(A), A')) {
                            if (!(itm.offsetWidth > 0.95 * width() &&
                                  itm.offsetHeight > 0.85 * height()))
                                continue;
                            if (itm.tagName !== 'A') {
                                fakeStyles.set(itm.style, {
                                    'backgroundImage': itm.style.backgroundImage,
                                    'backgroundColor': itm.style.backgroundColor
                                });

                                try {
                                    Object.defineProperty(itm, 'style', _cloneInto({
                                        value: new _Proxy(itm.style, _cloneInto(styleProxy)),
                                        enumerable: true
                                    }));
                                } catch (e) {
                                    _console.log('Unable to protect style property.', e);
                                }

                                _setAttribute(itm, 'style', `${(_getAttribute(itm, 'style') || '')};${extra}`);
                            }
                            if (itm.tagName === 'A')
                                _setAttribute(itm, 'style', 'display:none!important');
                        }
                    }
                );
            }
        },

        'adhands.ru': () => scriptLander(() => {
            try {
                let _adv;
                Object.defineProperty(win, 'adv', _cloneInto({
                    get() {
                        return _adv;
                    },
                    set(val) {
                        _console.log('Blocked advert on adhands.ru.');
                        nt.defineOn(val, 'advert', '', 'adv.');
                        _adv = val;
                    }
                }));
            } catch (ignore) {
                if (!win.adv)
                    _console.log('Unable to locate advert on adhands.ru.');
                else {
                    _console.log('Blocked advert on adhands.ru.');
                    nt.define('adv.advert', '');
                }
            }
        }, nullTools),

        'allhentai.ru': () => {
            preventPopups();
            scriptLander(() => {
                selectiveEval();
                let _onerror = Object.getOwnPropertyDescriptor(HTMLElement.prototype, 'onerror');
                if (!_onerror)
                    return;
                _onerror.set = (...args) => _console.log(args[0].toString());
                Object.defineProperty(HTMLElement.prototype, 'onerror', _onerror);
            }, selectiveEval);
        },

        'allmovie.pro': {
            other: 'rufilmtv.org',
            dom() {
                // pretend to be Android to make site use different played for ads
                if (isSafari)
                    return;
                Object.defineProperty(navigator, 'userAgent', _cloneInto({
                    get() {
                        return 'Mozilla/5.0 (Linux; Android 4.1.1; Nexus 7 Build/JRO03D) AppleWebKit/535.19 (KHTML, like Gecko) Chrome/18.0.1025.166 Safari/535.19';
                    },
                    enumerable: true
                }));
            }
        },

        'anidub.com': {
            other: 'anidub.life, myanime.online, loveanime.live',
            now() {
                let _AnidubAd = win.AnidubAd;
                Object.defineProperty(win, 'AnidubAd', _cloneInto({
                    get() {
                        return _AnidubAd;
                    },
                    set(x) {
                        _console.log(x.usePlyr);
                        if (x && 'usePlyr' in x)
                            x.usePlyr = new _Proxy(x.usePlyr, _cloneInto({
                                apply(fun, that, args) {
                                    if (args[1] && 'sources' in args[1])
                                        args[1].sources = [];
                                    return new _Proxy(_apply(fun, that, args), _cloneInto({
                                        get(that, prop) {
                                            if (prop === 'isDone')
                                                return true;
                                            return that[prop];
                                        }
                                    }));
                                }
                            }));
                        _AnidubAd = new _Proxy(x, _cloneInto({
                            construct(that, args) {
                                return new _Proxy(_construct(that, args), _cloneInto({
                                    get(that, prop) {
                                        if (prop === 'done')
                                            return true;
                                        if (prop === 'on')
                                            return () => {};
                                        return that[prop];
                                    }
                                }));
                            }
                        }));
                        return true;
                    }
                }));
                const onmessage = Object.getOwnPropertyDescriptor(win, 'onmessage');
                onmessage.set = new _Proxy(onmessage.set, _cloneInto({
                    apply(fun, that, args) {
                        if (typeof args[0] === 'function')
                            args[0] = new _Proxy(args[0], _cloneInto({
                                apply(fun, that, args) {
                                    let [event] = args;
                                    if (event.origin.includes('googleapis'))
                                        return;
                                    if (event.data && !event.data.indexOf)
                                        event.data.indexOf = () => -1;
                                    return _apply(fun, that, args);
                                }
                            }));
                        return _apply(fun, that, args);
                    }
                }));
                Object.defineProperty(win, 'onmessage', onmessage);
            }
        },

        'ati.su': () => scriptLander(() => {
            nt.define('Object.prototype.advManager', nt.proxy({}, 'advManager'));
            abortExecution.onGet('Object.prototype.bannersResolved');
        }),

        'audioportal.su': {
            now() {
                createStyle('#blink2 { display: none !important }');
            },
            dom() {
                let links = _document.querySelectorAll('a[onclick*="clickme("]');
                if (!links) return;
                for (let link of links)
                    win.clickme(link);
            }
        },

        'auto.ru': () => {
            let words = /Реклама|Яндекс.Директ|yandex_ad_/;
            let userAdsListAds = (
                '.listing-list > .listing-item,' +
                '.listing-item_type_fixed.listing-item'
            );
            let catalogAds = (
                'div[class*="layout_catalog-inline"],' +
                'div[class$="layout_horizontal"]'
            );
            let otherAds = (
                '.advt_auto,' +
                '.sidebar-block,' +
                '.pager-listing + div[class],' +
                '.card > div[class][style],' +
                '.sidebar > div[class],' +
                '.main-page__section + div[class],' +
                '.listing > tbody'
            );
            gardener(userAdsListAds, words, {
                root: '.listing-wrap',
                observe: true
            });
            gardener(catalogAds, words, {
                root: '.catalog__page,.content__wrapper',
                observe: true
            });
            gardener(otherAds, words);
            nt.define('Object.prototype.yaads', undefined);
            nt.define('Object.prototype.initYaDirect', undefined);
            nt.define('Object.prototype.direct', nt.proxy({}, 'Yandex.direct'));
        },

        'di.fm': () => scriptLander(() => {
            let log = false;
            // wrap global app object to catch registration of specific modules
            let _di = win.di;
            Object.defineProperty(win, 'di', _cloneInto({
                get() {
                    return _di;
                },
                set(vl) {
                    if (vl === _di)
                        return;
                    if (log) _console.trace('di =', vl);
                    _di = new _Proxy(vl, _cloneInto({
                        set(di, name, vl) {
                            if (vl === di[name])
                                return true;
                            if (name === 'app') {
                                if (log) _console.trace(`di.${name} =`, vl);
                                if (!('module' in vl))
                                    return;
                                vl.module = new _Proxy(vl.module, _cloneInto({
                                    apply(module, that, args) {
                                        if (/Wall|Banner|Detect|WebplayerApp\.Ads/.test(args[0])) {
                                            let name = args[0];
                                            if (log) _console.log('wrap', name, 'module');
                                            if (typeof args[1] === 'function')
                                                args[1] = new _Proxy(args[1], _cloneInto({
                                                    apply(fun, that, args) {
                                                        if (args[0]) // module object
                                                            args[0].start = () => _console.log('Skipped start of', name);
                                                        return Reflect.apply(fun, that, args);
                                                    }
                                                }));
                                        } // else log && _console.log('loading module', args[0]);
                                        if (args[0] === 'Modals' && typeof args[1] === 'function') {
                                            if (log) _console.log('wrap', name, 'module');
                                            args[1] = new _Proxy(args[1], _cloneInto({
                                                apply(fun, that, args) {
                                                    if ('commands' in args[1] && 'setHandlers' in args[1].commands &&
                                                        !Object.hasOwnProperty.call(args[1].commands, 'setHandlers')) {
                                                        let _commands = args[1].commands;
                                                        _commands.setHandlers = new _Proxy(_commands.setHandlers, _cloneInto({
                                                            apply(fun, that, args) {
                                                                const noopFunc = name => () => _console.log('Skipped', name, 'window');
                                                                for (let name in args[0])
                                                                    if (name === 'modal:streaminterrupt' ||
                                                                        name === 'modal:midroll')
                                                                        args[0][name] = noopFunc(name);
                                                                delete _commands.setHandlers;
                                                                return Reflect.apply(fun, that, args);
                                                            }
                                                        }));
                                                    }
                                                    return Reflect.apply(fun, that, args);
                                                }
                                            }));
                                        }
                                        return Reflect.apply(module, that, args);
                                    }
                                }));
                            }
                            di[name] = vl;
                        }
                    }));
                }
            }));
            // don't send errorception logs
            Object.defineProperty(win, 'onerror', _cloneInto({
                set(vl) {
                    if (log) _console.trace('Skipped global onerror callback:', vl);
                }
            }));
        }),

        'draug.ru': {
            other: 'vargr.ru',
            now: () => scriptLander(() => {
                if (location.pathname === '/pop.html')
                    win.close();
                createStyle({
                    '#timer_1': {
                        display: 'none !important'
                    },
                    '#timer_2': {
                        position: 'relative !important',
                        display: 'block !important',
                        z_index: '42 !important'
                    },
                    '.clearfix, .clearfix > *': {
                        z_index: 'initial !important'
                    }
                });
                let _contentWindow = Object.getOwnPropertyDescriptor(HTMLIFrameElement.prototype, 'contentWindow');
                let _get_contentWindow = _bindCall(_contentWindow.get);
                _contentWindow.get = function () {
                    let res = _get_contentWindow(this);
                    if (res.location.href === 'about:blank')
                        res.document.write = (...args) => _console.log('Skipped iframe.write(', ...args, ')');
                    return res;
                };
                Object.defineProperty(HTMLIFrameElement.prototype, 'contentWindow', _contentWindow);
            }),
            dom() {
                let list = _querySelectorAll('div[id^="yandex_rtb_"], .adsbygoogle');
                list.forEach(node => _console.log('Removed:', node.parentNode.parentNode.removeChild(node.parentNode)));
            }
        },

        'drive2.ru': () => {
            gardener('.c-block:not([data-metrika="recomm"]),.o-grid__item', />Реклама<\//i);
            scriptLander(() => {
                selectiveCookies();
                let _d2;
                Object.defineProperty(win, 'd2', _cloneInto({
                    get() {
                        return _d2;
                    },
                    set(vl) {
                        if (vl === _d2)
                            return true;
                        _d2 = new _Proxy(vl, _cloneInto({
                            set(target, prop, val) {
                                if (['brandingRender', 'dvReveal', '__dv'].includes(prop))
                                    val = () => null;
                                target[prop] = val;
                                return true;
                            }
                        }));
                    }
                }));
                // obfuscated Yandex.Direct
                nt.define('Object.prototype.initYaDirect', undefined);
            }, nullTools, selectiveCookies);
        },

        'echo.msk.ru': {
            now() {
                scripts.yandexDirect.now();
                selectiveCookies();
                win.localStorage.removeItem('COOKIE_MATCHING_FAIL');
                win.localStorage.removeItem('beerka');
                win.localStorage.removeItem('ludca');
            }
        },

        'eurogamer.tld': {
            other: 'metabomb.net, usgamer.net',
            now: () => scriptLander(() => {
                abortExecution.inlineScript('_sp_');
                selectiveCookies('sp');
            }, selectiveCookies, abortExecution)
        },

        'fastpic.ru': () => {
            // Had to obfuscate property name to avoid triggering anti-obfuscation on greasyfork.org -_- (Exception 403012)
            nt.define(`_0x${'4955'}`, []);
        },

        'fishki.net': () => {
            scriptLander(() => {
                const fishki = {};
                const adv = nt.proxy({
                    afterAdblockCheck: nt.func(null, 'fishki.afterAdblockCheck'),
                    refreshFloat: nt.func(null, 'fishki.refreshFloat')
                });
                nt.defineOn(fishki, 'adv', adv, 'fishki.');
                nt.defineOn(fishki, 'is_adblock', false, 'fishki.');
                nt.define('fishki', fishki);
                nt.define('Object.prototype.detect', nt.func(undefined, 'detect'));
                win.Object.defineProperty = new _Proxy(win.Object.defineProperty, _cloneInto({
                    apply(fun, that, args) {
                        if (['is_adblock', 'adv'].includes(args[1]) || args[0] === adv)
                            return;
                        return _apply(fun, that, args);
                    }
                }));
            }, nullTools);
            gardener('.drag_list > .drag_element, .list-view > .paddingtop15, .post-wrap', /543769|Новости\sпартнеров|Полезная\sреклама/);
        },

        'forbes.com': () => {
            createStyle(['fbs-ad[ad-id], .top-ad-container, .fbs-ad-wrapper, .footer-ad-labeling, .ad-rail, .ad-unit { display: none !important; }']);
            nt.define('Object.prototype.isAdLight', true);
            nt.define('Object.prototype.initializeAd', nt.func(undefined, '?.initializeAd'));
            win.getComputedStyle = new _Proxy(win.getComputedStyle, _cloneInto({
                apply(fun, that, args) {
                    let res = _apply(fun, that, args);
                    if (res.display === 'none')
                        nt.defineOn(res, 'display', 'block', 'getComputedStyle().');
                    if (res.visibility === 'hidden')
                        nt.defineOn(res, 'visibility', 'visible', 'getComputedStyle().');
                    return res;
                }
            }));
            win.CSSStyleDeclaration.prototype.getPropertyValue = new _Proxy(win.CSSStyleDeclaration.prototype.getPropertyValue, _cloneInto({
                apply(fun, that, args) {
                    let res = _apply(fun, that, args);
                    if (args[0] === 'display' && res === 'none')
                        return 'block';
                    if (args[0] === 'visibility' && res === 'hidden')
                        return 'visible';
                    return res;
                }
            }));
        },

        'freeopenvpn.org': () => {
            const alterEval = Function.constructor;
            win.addEventListener = new _Proxy(win.addEventListener, _cloneInto({
                apply(fun, that, args) {
                    let [event, callback] = args;
                    if (event === 'load') {
                        let str = _toString(callback);
                        if (/\.clientHeight\s*!=/.test(str))
                            args[1] = () => alterEval(
                                str.replace(/^function\s*\(\)/, 'function pwd()')
                                .replace(/if[^\r\n]*clientHeight[^\r\n]*\)\s*{/, 'if (false) {') + ' pwd();'
                            )();
                    }
                    return _apply(fun, that, args);
                }
            }));
        },

        'friends.in.ua': () => scriptLander(() => {
            Object.defineProperty(win, 'need_warning', _cloneInto({
                get() {
                    return 0;
                },
                set() {}
            }));
        }),

        'gamerevolution.com': () => {
            const _clientHeight = Object.getOwnPropertyDescriptor(_Element, 'clientHeight');
            _clientHeight.get = new _Proxy(_clientHeight.get, _cloneInto({
                apply(...args) {
                    return _apply(...args) || 1;
                }
            }));
            Object.defineProperty(_Element, 'clientHeight', _clientHeight);

            const toReplace = [
                'blockerDetected', 'disableDetected', 'hasAdBlocker',
                'hasBlockerFlag', 'hasDisabledAdBlocker', 'hasBlocker'
            ];
            win.Object.defineProperty = new _Proxy(win.Object.defineProperty, _cloneInto({
                apply(fun, that, args) {
                    if (toReplace.includes(args[1])) {
                        args[2] = {
                            value() {
                                return false;
                            }
                        };
                        console.log(args);
                    }
                    return _apply(fun, that, args);
                }
            }));
        },

        'gamersheroes.com': () => abortExecution.inlineScript('document.createElement', {
            pattern: /window\[\w+\(\[(\d+,?\s?)+\],\s?\w+\)\]/
        }),

        'gidonline.club': () => createStyle('.tray > div[style] {display: none!important}'),

        'glav.su': () => scriptLander(() => {
            abortExecution.onSet('abd');
            abortExecution.onSet('script1');
        }, abortExecution),

        'gorodrabot.ru': () => scriptLander(() => {
            abortExecution.onGet('Object.prototype.yaads');
            abortExecution.onGet('Object.prototype.initYaDirect');
        }, abortExecution),

        'haes.tech': () => {
            // debugger detection prevention
            win.eval = new _Proxy(win.eval, _cloneInto({
                apply(fun, that, args) {
                    if (typeof args[0] === 'string' && args[0].includes('debugger;'))
                        throw removeOwnFootprint(new ReferenceError('debugger is not defined'));
                    return _apply(fun, that, args);
                }
            }));
        },

        'hdgo.cc': {
            other: '46.30.43.38, couber.be',
            now() {
                (new MutationObserver(
                    ms => {
                        let m, node;
                        for (m of ms)
                            for (node of m.addedNodes)
                                if (node instanceof HTMLScriptElement && _getAttribute(node, 'onerror') !== null)
                                    node.removeAttribute('onerror');
                    }
                )).observe(_document.documentElement, {
                    childList: true,
                    subtree: true
                });
            }
        },

        'hentai-share.tv': () => {
            // debugger detection prevention
            win.Object.defineProperty = new _Proxy(win.Object.defineProperty, _cloneInto({
                apply(fun, that, args) {
                    if (args[1] === 'id' && 'get' in args[2])
                        return;
                    return _apply(fun, that, args);
                }
            }));
        },

        'gamepur.com': () => {
            nt.define('ga', nt.func(null, 'ga'));
            win.Object.defineProperty = new _Proxy(win.Object.defineProperty, _cloneInto({
                apply(fun, that, args) {
                    if (typeof args[1] === 'string' &&
                        (args[1] === 'hasAdblocker' || args[1] === 'blockerDetected'))
                        throw new TypeError(`Cannot read property '${args[1]}' of undefined`);
                    return Reflect.apply(fun, that, args);
                }
            }));
        },

        'hdrezka.ag': () => {
            Object.defineProperty(win, 'ab', _cloneInto({
                value: false,
                enumerable: true
            }));
            gardener('div[id][onclick][onmouseup][onmousedown]', /onmouseout/i);
        },

        'htmlweb.ru': () => {
            let _onerror = Object.getOwnPropertyDescriptor(HTMLElement.prototype, 'onerror');
            _onerror.set = new _Proxy(_onerror.set, _cloneInto({
                apply(fun, that, args) {
                    if (that.tagName === 'SCRIPT')
                        return _console.log('Skip set onerror for', that);
                    return _apply(fun, that, args);
                }
            }));
            Object.defineProperty(HTMLElement.prototype, 'onerror', _onerror);
        },

        'hqq.tv': () => scriptLander(() => {
            // disable anti-debugging in hqq.tv player
            let isObfuscated = text => /[^a-z0-9]([a-z0-9]{1,2}\.[a-z0-9]{1,2}\(|[a-z0-9]{4}\.[a-z]\(\d+\)|[a-z0-9]\[[a-z0-9]{1,2}\]\[[a-z0-9]{1,2}\])/i.test(text);
            deepWrapAPI(root => {
                // skip obfuscated stuff and a few other calls
                let _setInterval = root.setInterval,
                    _setTimeout = root.setTimeout;
                root.setInterval = (...args) => {
                    let fun = args[0];
                    if (typeof fun === 'function') {
                        let text = _toString(fun),
                            skip = text.includes('check();') || isObfuscated(text);
                        _console.trace('setInterval', text, 'skip', skip);
                        if (skip) return -1;
                    }
                    return _setInterval.apply(this, args);
                };
                let wrappedST = new WeakSet();
                root.setTimeout = (...args) => {
                    let fun = args[0];
                    if (typeof fun === 'function') {
                        let text = _toString(fun),
                            skip = fun.name === 'check' || isObfuscated(text);
                        if (!wrappedST.has(fun)) {
                            _console.trace('setTimeout', text, 'skip', skip);
                            wrappedST.add(fun);
                        }
                        if (skip) return;
                    }
                    return _setTimeout.apply(this, args);
                };
                // skip 'debugger' call
                let _eval = root.eval;
                root.eval = text => {
                    if (typeof text === 'string' && text.includes('debugger;')) {
                        _console.trace('skip eval', text);
                        return;
                    }
                    _eval(text);
                };
                // Prevent RegExpt + toString trick
                let _proto;
                try {
                    _proto = root.RegExp.prototype;
                } catch (ignore) {
                    return;
                }
                let _RE_tS = Object.getOwnPropertyDescriptor(_proto, 'toString');
                let _RE_tSV = _RE_tS.value || _RE_tS.get();
                Object.defineProperty(_proto, 'toString', _cloneInto({
                    enumerable: _RE_tS.enumerable,
                    configurable: _RE_tS.configurable,
                    get() {
                        return _RE_tSV;
                    },
                    set(val) {
                        _console.trace('Attempt to change toString for', this, 'with', _toString(val));
                    }
                }));
            });
        }, deepWrapAPI),

        'hideip.me': {
            now: () => scriptLander(() => {
                let _innerHTML = Object.getOwnPropertyDescriptor(_Element, 'innerHTML');
                let _set_innerHTML = _innerHTML.set;
                let _innerText = Object.getOwnPropertyDescriptor(HTMLElement.prototype, 'innerText');
                let _get_innerText = _innerText.get;
                let div = _document.createElement('div');
                _innerHTML.set = function (...args) {
                    _set_innerHTML.call(div, args[0].replace('i', 'a'));
                    if (args[0] && /[рp][еe]кл/.test(_get_innerText.call(div)) ||
                        /(\d\d\d?\.){3}\d\d\d?:\d/.test(_get_innerText.call(this))) {
                        _console.log('Anti-Adblock killed.');
                        return true;
                    }
                    _set_innerHTML.apply(this, args);
                };
                Object.defineProperty(_Element, 'innerHTML', _innerHTML);
                Object.defineProperty(win, 'adblock', _cloneInto({
                    get() {
                        return false;
                    },
                    set() {},
                    enumerable: true
                }));
                let _$ = {};
                let _$_map = new WeakMap();
                let _gOPD = Object.getOwnPropertyDescriptor(Object, 'getOwnPropertyDescriptor');
                let _val_gOPD = _gOPD.value;
                _gOPD.value = function (...args) {
                    let _res = _val_gOPD.apply(this, args);
                    if (args[0] instanceof Window && (args[1] === '$' || args[1] === 'jQuery')) {
                        delete _res.get;
                        delete _res.set;
                        _res.value = win[args[1]];
                    }
                    return _res;
                };
                Object.defineProperty(Object, 'getOwnPropertyDescriptor', _gOPD);
                let getJQWrap = (n) => {
                    let name = n;
                    return {
                        enumerable: true,
                        get() {
                            return _$[name];
                        },
                        set(x) {
                            if (_$_map.has(x)) {
                                _$[name] = _$_map.get(x);
                                return true;
                            }
                            if (x === _$.$ || x === _$.jQuery) {
                                _$[name] = x;
                                return true;
                            }
                            _$[name] = new _Proxy(x, _cloneInto({
                                apply(t, o, args) {
                                    let _res = t.apply(o, args);
                                    if (_$_map.has(_res.is))
                                        _res.is = _$_map.get(_res.is);
                                    else {
                                        let _is = _res.is;
                                        _res.is = function (...args) {
                                            if (args[0] === ':hidden')
                                                return false;
                                            return _is.apply(this, args);
                                        };
                                        _$_map.set(_is, _res.is);
                                    }
                                    return _res;
                                }
                            }));
                            _$_map.set(x, _$[name]);
                            return true;
                        }
                    };
                };
                Object.defineProperty(win, '$', getJQWrap('$'));
                Object.defineProperty(win, 'jQuery', getJQWrap('jQuery'));
                let _dP = Object.defineProperty;
                Object.defineProperty = exportFunction(function (...args) {
                    if (args[0] instanceof Window && (args[1] === '$' || args[1] === 'jQuery'))
                        return undefined;
                    return _dP.apply(this, args);
                }, win);
            })
        },

        'igra-prestoloff.cx': () => scriptLander(() => {
            /*jslint evil: true */ // yes, evil, I know
            let _write = _document.write.bind(_document);
            /*jslint evil: false */
            nt.define('document.write', t => {
                let id = t.match(/jwplayer\("(\w+)"\)/i);
                if (id && id[1])
                    return _write(`<div id="${id[1]}"></div>${t}`);
                return _write('');
            }, {
                enumerable: true
            });
        }),

        'imageban.ru': () => {
            Object.defineProperty(win, 'V7x1J', _cloneInto({
                get() {
                    return null;
                }
            }));
        },

        'inoreader.com': () => scriptLander(() => {
            createStyle('.block_article_ad { display: none !important }');
            nt.define('gn', true);
            // their own hidden adblock detection skip
            let cookie = Object.getOwnPropertyDescriptor(_Document, 'cookie');
            cookie.get = new _Proxy(cookie.get, _cloneInto({
                apply(...args) {
                    return 'aguineapigtrickedme=1; ' + _apply(...args);
                }
            }));
            Object.defineProperty(_Document, 'cookie', cookie);
        }),

        'it-actual.ru': () => scriptLander(() => {
            abortExecution.onAll('blocked');
            abortExecution.onGet('nsg');
        }, abortExecution),

        'ivi.ru': () => {
            let _xhr_open = win.XMLHttpRequest.prototype.open;
            win.XMLHttpRequest.prototype.open = function (method, url, ...args) {
                if (typeof url === 'string')
                    if (url.endsWith('/track'))
                        return;
                return _xhr_open.call(this, method, url, ...args);
            };
            let _responseText = Object.getOwnPropertyDescriptor(XMLHttpRequest.prototype, 'responseText');
            let _responseText_get = _responseText.get;
            _responseText.get = function () {
                if (this.__responseText__)
                    return this.__responseText__;
                let res = _responseText_get.apply(this, arguments);
                let o;
                try {
                    if (res)
                        o = JSON.parse(res);
                } catch (ignore) {}
                let changed = false;
                if (o && o.result) {
                    if (o.result instanceof Array &&
                        'adv_network_logo_url' in o.result[0]) {
                        o.result = [];
                        changed = true;
                    }
                    if (o.result.show_adv) {
                        o.result.show_adv = false;
                        changed = true;
                    }
                }
                if (changed) {
                    _console.log('changed response >>', o);
                    res = JSON.stringify(o);
                }
                this.__responseText__ = res;
                return res;
            };
            Object.defineProperty(XMLHttpRequest.prototype, 'responseText', _responseText);
        },

        'kakprosto.ru': () => scriptLander(() => {
            selectiveCookies('yadb');
            abortExecution.inlineScript('yaProxy', {
                pattern: /yadb/
            });
            abortExecution.inlineScript('yandexContextAsyncCallbacks');
            abortExecution.inlineScript('adfoxAsyncParams');
            abortExecution.inlineScript('adfoxBackGroundLoaded');
        }, selectiveCookies, abortExecution),

        'kinonavigator.ru': () => {
            // fix for broken pages specific for this site, no need to make it global
            nt.define('Ya.share2', nt.func(nt.proxy({}, 'Ya.share2'), 'Ya.share2'));
        },

        'kinopoisk.ru': () => {
            // filter cookies
            // set no-branding body style and adjust other blocks on the page
            const style = {
                '.app__header.app__header_margin-bottom_brand, #top': {
                    margin_bottom: '20px !important'
                },
                '.app__branding': {
                    display: 'none!important'
                }
            };
            if (location.hostname === 'www.kinopoisk.ru' && !location.pathname.startsWith('/games/'))
                style['html:not(#id), body:not(#id), .app-container'] = {
                    background: '#d5d5d5 url(/images/noBrandBg.jpg) 50% 0 no-repeat !important'
                };
            createStyle(style);
            scriptLander(() => {
                selectiveCookies('cmtchd|crookie|kpunk');
                // filter JSON
                win.JSON.parse = new _Proxy(win.JSON.parse, _cloneInto({
                    apply(fun, that, args) {
                        let o = _apply(fun, that, args);
                        let name = 'antiAdBlockCookieName';
                        if (name in o && typeof o[name] === 'string')
                            selectiveCookies(o[name]);
                        name = 'branding';
                        if (name in o) o[name] = {};
                        // tricks against ads in the trailer player
                        // if (location.hostname.startsWith('widgets.'))
                        if (o.page && o.page.playerParams)
                            delete o.page.playerParams.adConfig;
                        if (o.common && o.common.bunker && o.common.bunker.adv && o.common.bunker.adv.filmIdWithoutAd)
                            o.common.bunker.adv.filmIdWithoutAd.includes = () => true;
                        //_console.log('JSON.parse', o);
                        return o;
                    }
                }));
                // skip timeout check for blocked requests
                win.setTimeout = new _Proxy(win.setTimeout, _cloneInto({
                    apply(fun, that, args) {
                        if (args[1] === 100) {
                            let str = _toString(args[0]);
                            if (str.endsWith('{a()}') || str.endsWith('{n()}'))
                                return;
                        }
                        return _apply(fun, that, args);
                    }
                }));
                // obfuscated Yandex.Direct
                nt.define('Object.prototype.initYaDirect', undefined);
                nt.define('Object.prototype._resolveDetectResult', () => null);
                nt.define('Object.prototype.detectResultPromise', new Promise(r => r(false)));
                if (location.hostname === 'www.kinopoisk.ru')
                    nt.define('Object.prototype.initAd', nt.func(undefined, 'initAd'));
                // catch branding and other things
                let _KP;
                Object.defineProperty(win, 'KP', _cloneInto({
                    get() {
                        return _KP;
                    },
                    set(val) {
                        if (_KP === val)
                            return true;
                        _KP = new _Proxy(val, _cloneInto({
                            set(kp, name, val) {
                                if (name === 'branding') {
                                    kp[name] = new _Proxy(_cloneInto({
                                        weborama: {}
                                    }), _cloneInto({
                                        get(kp, name) {
                                            return name in kp ? kp[name] : '';
                                        },
                                        set() {}
                                    }));
                                    return true;
                                }
                                if (name === 'config')
                                    val = new _Proxy(val, _cloneInto({
                                        set(cfg, name, val) {
                                            if (name === 'anContextUrl')
                                                return true;
                                            if (name === 'adfoxEnabled' || name === 'hasBranding')
                                                val = false;
                                            if (name === 'adfoxVideoAdUrls')
                                                val = {
                                                    flash: {},
                                                    html: {}
                                                };
                                            cfg[name] = val;
                                            return true;
                                        }
                                    }));
                                kp[name] = val;
                                return true;
                            }
                        }));
                        _console.log('KP =', val);
                    }
                }));
            }, selectiveCookies, nullTools);
        },

        'korrespondent.net': {
            now: () => scriptLander(() => {
                nt.define('holder', function (id) {
                    let div = _document.getElementById(id);
                    if (!div)
                        return;
                    if (div.parentNode.classList.contains('col__sidebar')) {
                        div.parentNode.appendChild(div);
                        div.style.height = '300px';
                    }
                });
            }, nullTools),
            dom() {
                for (let frame of _document.querySelectorAll('.unit-side-informer > iframe'))
                    frame.parentNode.style.width = '1px';
            }
        },

        'libertycity.ru': () => scriptLander(() => {
            nt.define('adBlockEnabled', false);
        }, nullTools),

        'liveinternet.ru': () => scriptLander(() => {
            abortExecution.onGet('Object.prototype.getYa');
            abortExecution.onGet('Object.prototype.managerForAdfox');
            abortExecution.onGet('Object.prototype.__activeTestIds');
            nt.define('mediatargetBanners', []);
        }, abortExecution),

        'livejournal.com': () => scriptLander(() => {
            nt.define('Object.prototype.Adf', undefined);
            nt.define('Object.prototype.Begun', undefined);
        }, nullTools),

        'mail.ru': {
            other: 'ok.ru, sportmail.ru',
            now: () => scriptLander(() => {
                const _hostparts = location.hostname.split('.');
                const _subdomain = _hostparts.slice(-3).join('.');
                const _hostname = _hostparts.slice(-2).join('.');
                const _emailru = _subdomain === 'e.mail.ru' || _subdomain === 'octavius.mail.ru';
                const _mymailru = _subdomain === 'my.mail.ru';
                const _otvet = _subdomain === 'otvet.mail.ru';
                const _okru = _hostname === 'ok.ru';
                // setTimeout filter
                // advBlock|rbParams - ads
                // document\.title= - blinking title on background news load on main page
                const pattern = /advBlock|rbParams|document\.title=/i;
                const _setTimeout = win.setTimeout;
                win.setTimeout = function setTimeout(...args) {
                    const text = typeof args[0] === 'function' && _toString(args[0]) || '';
                    if (pattern.test(text)) {
                        _console.trace('Skipped setTimeout:', text);
                        return;
                    }
                    return _setTimeout(...args);
                };

                // Trick to prevent mail.ru from removing 3rd-party styles
                nt.define('Object.prototype.restoreVisibility', nt.func(null, 'restoreVisibility'));
                // Other Yandex Direct and other ads
                nt.define('Object.prototype.initMimic', undefined);
                nt.define('Object.prototype.hpConfig', undefined);
                if (!_otvet) // used for a different purpose there
                    nt.define('Object.prototype.direct', undefined);
                const getAds = () => new Promise(
                    r => r(nt.proxy({}, '?.getAds()'))
                );
                nt.define('Object.prototype.getAds', getAds);
                nt.define('rb_counter', nt.func(null, 'rb_counter'));
                if (_subdomain === 'mail.ru') { // main page
                    nt.define('Object.prototype.baits', undefined); // detector
                    nt.define('Object.prototype.getFeed', nt.func(null, 'pulse.getFeed')); // Pulse feed
                    createStyle('body > div > .pulse { display: none !important }');
                }
                if (_emailru)
                    nt.define('Object.prototype.show_me_ads', undefined);
                else if (_mymailru)
                    nt.define('Object.prototype.runMimic', nt.func(null, 'runMimic'));
                else {
                    nt.define('Object.prototype.mimic', undefined);
                    const xray = nt.func(undefined, 'xray');
                    nt.defineOn(xray, 'send', nt.func(undefined, 'xray.send'), 'xray.');
                    nt.defineOn(xray, 'radarPrefix', null, 'xray.');
                    nt.defineOn(xray, 'xrayRadarUrl', undefined, 'xray.');
                    nt.defineOn(xray, 'defaultParams', nt.proxy({
                        i: undefined,
                        p: 'media'
                    }), 'xray.');
                    nt.defineOn(xray, 'getConfig', nt.func(
                        nt.proxy({
                            radarPrefix: 'dev'
                        }, 'xray.getConfig().'),
                        'xray.getConfig'
                    ));
                    nt.define('Object.prototype.xray', nt.proxy(xray));
                }
                // shenanigans against ok.ru ABP detector
                if (_okru) {
                    abortExecution.onGet('OK.hooks');
                    // banners on ok.ru and counter
                    nt.define('getAdvTargetParam', nt.func(null, 'getAdvTargetParam'));
                    // break detection in case detector wasn't wrapped
                    abortExecution.onSet('Object.prototype.adBlockDetected');
                }
                // news.mail.ru and sportmail.ru
                abortExecution.onGet('myWidget');
                // cleanup e.mail.ru configs and mimic config on news and sport
                const emptyString = (root, name) => root[name] && (root[name] = '');
                const detectMimic = /direct|240x400|SlotView/;
                win.JSON.parse = new _Proxy(win.JSON.parse, _cloneInto({
                    apply(fun, that, args) {
                        let o = _apply(fun, that, args);
                        if (o && typeof o === 'object') {
                            if (o.cfg && o.cfg.sotaFeatures) {
                                let root = o.cfg.sotaFeatures;
                                if (Array.isArray(root.adv)) root.adv = [];
                                for (let name in root)
                                    if (name.startsWith('adv-') || name.startsWith('adman-'))
                                        delete root[name];
                                ['email_logs_to', 'smokescreen-locators'].forEach(name => emptyString(root, name));
                            }
                            if (o.userConfig) {
                                if (Array.isArray(o.userConfig.honeypot))
                                    o.userConfig.honeypot.forEach((v, id, me) => (me[id] = []));
                                const cfg = o.userConfig.config;
                                if (cfg && cfg.honeypot)
                                    emptyString(cfg.honeypot, 'baits');
                            }
                            if (o.body) {
                                const flags = o.body.common_purpose_flags;
                                if (flags && 'hide_ad_in_mail_web' in flags)
                                    flags.hide_ad_in_mail_web = true;
                                if (o.body.show_me_ads)
                                    o.body.show_me_ads = false;
                            }
                            //_console.log('JSON.parse', o);
                        }
                        if (Array.isArray(o))
                            if (o.some(t => typeof t === 'string' && detectMimic.test(t))) {
                                _console.log('Replaced', o);
                                o = [];
                            } //else _console.log('JSON.parse', o);
                        return o;
                    }
                }));
                // all the rest is only needed on main page and in emails
                if (_subdomain !== 'mail.ru' && !_emailru && !_okru)
                    return;

                // Disable page scrambler on mail.ru to let extensions easily block ads there
                let logger = {
                    apply(fun, that, args) {
                        let res = _apply(fun, that, args);
                        _console.log(`${fun._name}(`, ...args, `)\n>>`, res);
                        return res;
                    }
                };

                function wrapLocator(locator) {
                    if ('setup' in locator) {
                        let _setup = locator.setup;
                        locator.setup = function (o) {
                            if ('enable' in o) {
                                o.enable = false;
                                _console.log('Disable mimic mode.');
                            }
                            if ('links' in o) {
                                o.links = [];
                                _console.log('Call with empty list of sheets.');
                            }
                            return _setup.call(this, o);
                        };
                        locator.insertSheet = () => false;
                        locator.wrap = () => false;
                    }
                    try {
                        let names = [];
                        for (let name in locator)
                            if (typeof locator[name] === 'function' && name !== 'transform') {
                                locator[name]._name = "locator." + name;
                                locator[name] = new _Proxy(locator[name], _cloneInto(logger));
                                names.push(name);
                            }
                        _console.log(`[locator] wrapped properties: ${names.length ? names.join(', ') : '[empty]'}`);
                    } catch (e) {
                        _console.log(e);
                    }
                    return locator;
                }

                const same = Symbol('same');

                function defineLocator(root) {
                    let _locator = root.locator;
                    let wrapLocatorSetter = vl => _locator = wrapLocator(vl);
                    wrapLocatorSetter[same] = true;
                    let loc_desc = Object.getOwnPropertyDescriptor(root, 'locator');
                    if (!loc_desc || !loc_desc.set[same])
                        try {
                            Object.defineProperty(root, 'locator', _cloneInto({
                                set: wrapLocatorSetter,
                                get() {
                                    return _locator;
                                }
                            }, root));
                        } catch (err) {
                            _console.log('Unable to redefine "locator" object!!!', err);
                        }
                    else if (loc_desc.value)
                        _locator = wrapLocator(loc_desc.value);
                }

                { // auto-stubs for various ad, detection and obfuscation modules
                    const missingCheck = {
                        get(obj, name) {
                            let res = obj[name];
                            if (!(name in obj))
                                _console.trace(`Missing "${name}" in`, obj);
                            return res;
                        }
                    };
                    const skipLog = (name, ret) => (...args) => (_console.log(`${name}(`, ...args, ')'), ret);
                    const createSkipAllObject = (baseName, obj = {
                        __esModule: true
                    }) => new _Proxy(obj, _cloneInto({
                        get(obj, name) {
                            if (name in obj)
                                return obj[name];
                            _console.log(`Created stub for "${name}" in ${baseName}.`);
                            obj[name] = skipLog(`${baseName}.${name}`);
                            return obj[name];
                        },
                        set() {}
                    }));
                    const redefiner = {
                        apply(fun, that, args) {
                            let res;
                            let warn = false;
                            let name = fun._name;
                            if (name === 'mrg-smokescreen/Welter')
                                res = {
                                    isWelter() {
                                        return true;
                                    },
                                    wrap: skipLog(`${name}.wrap`)
                                };
                            if (name === 'mrg-smokescreen/Honeypot')
                                res = {
                                    check(...args) {
                                        _console.log(`${name}.check(`, ...args, ')');
                                        return new Promise(() => undefined);
                                    },
                                    version: "-1"
                                };
                            if (name === 'advert/adman/adman') {
                                let features = {
                                    siteZones: {},
                                    slots: {}
                                };
                                [
                                    'expId', 'siteId', 'mimicEndpoint', 'mimicPartnerId',
                                    'immediateFetchTimeout', 'delayedFetchTimeout'
                                ].forEach(name => void(features[name] = null));
                                res = createSkipAllObject(name, {
                                    getFeatures: skipLog(`${name}.getFeatures`, features)
                                });
                            }
                            if (name === 'mrg-smokescreen/Utils')
                                res = createSkipAllObject(name, {
                                    extend(...args) {
                                        let res = {
                                            enable: false,
                                            match: [],
                                            links: []
                                        };
                                        _console.log(`${name}.extend(`, ...args, ') >>', res);
                                        return res;
                                    }
                                });
                            if (name.startsWith('OK/banners/') ||
                                name.startsWith('mrg-smokescreen/StyleSheets') ||
                                name === '@mail/mimic' ||
                                name === 'mediator/advert-managers')
                                res = createSkipAllObject(name);
                            if (res) {
                                Object.defineProperty(res, Symbol.toStringTag, _cloneInto({
                                    get() {
                                        return `Skiplog object for ${name}`;
                                    }
                                }));
                                Object.defineProperty(res, Symbol.toPrimitive, _cloneInto({
                                    value(hint) {
                                        if (hint === 'string')
                                            return Object.prototype.toString.call(this);
                                        return `[missing toPrimitive] ${name} ${hint}`;
                                    }
                                }));
                                res = new _Proxy(res, _cloneInto(missingCheck));
                            } else {
                                res = _apply(fun, that, args);
                                warn = true;
                            }
                            _console[warn ? 'warn' : 'log'](name, '(', ...args, ')\n>>', res);
                            return res;
                        }
                    };

                    const advModuleNamesStartWith = /^(mrg-(context|honeypot)|adv\/)/;
                    const advModuleNamesGeneric = /advert|banner|mimic|smoke/i;
                    const wrapAdFuncs = {
                        apply(fun, that, args) {
                            let module = args[0];
                            if (typeof module === 'string')
                                if ((advModuleNamesStartWith.test(module) ||
                                     advModuleNamesGeneric.test(module)) &&
                                    // fix for e.mail.ru in Fx56 and below, looks like Proxy is quirky there
                                    !module.startsWith('patron.v2.')) {
                                    let main = args[args.length - 1];
                                    main._name = module;
                                    args[args.length - 1] = new _Proxy(main, _cloneInto(redefiner));
                                }
                            return _apply(fun, that, args);
                        }
                    };
                    const wrapDefine = def => {
                        if (!def)
                            return;
                        _console.log('define =', def);
                        def = new _Proxy(def, _cloneInto(wrapAdFuncs));
                        def._name = 'define';
                        return def;
                    };
                    let _define = wrapDefine(win.define);
                    Object.defineProperty(win, 'define', _cloneInto({
                        get() {
                            return _define;
                        },
                        set(x) {
                            if (_define === x)
                                return true;
                            _define = wrapDefine(x);
                            return true;
                        }
                    }));
                }

                let _honeyPot;

                function defineDetector(mr) {
                    let __ = mr._ || {};
                    let setHoneyPot = o => {
                        if (!o || o === _honeyPot) return;
                        _console.log('[honeyPot]', o);
                        _honeyPot = function () {
                            this.check = new _Proxy(() => {
                                __.STUCK_IN_POT = false;
                                return false;
                            }, _cloneInto(logger));
                            this.check._name = 'honeyPot.check';
                            this.destroy = () => null;
                        };
                    };
                    if ('honeyPot' in mr)
                        setHoneyPot(mr.honeyPot);
                    else
                        Object.defineProperty(mr, 'honeyPot', _cloneInto({
                            get() {
                                return _honeyPot;
                            },
                            set: setHoneyPot
                        }));

                    __ = new _Proxy(__, _cloneInto({
                        get(target, prop) {
                            return target[prop];
                        },
                        set(target, prop, val) {
                            _console.log(`mr._.${prop} =`, val);
                            target[prop] = val;
                            return true;
                        }
                    }));
                    mr._ = __;
                }

                function defineAdd(mr) {
                    let _add;
                    let addWrapper = {
                        apply(fun, that, args) {
                            let module = args[0];
                            if (typeof module === 'string' && module.startsWith('ad')) {
                                _console.log('Skip module:', module);
                                return;
                            }
                            if (typeof module === 'object' && module.name.startsWith('ad'))
                                _console.log('Loaded module:', module);
                            return logger.apply(fun, that, args);
                        }
                    };
                    let setMrAdd = v => {
                        if (!v) return;
                        v._name = 'mr.add';
                        v = new _Proxy(v, _cloneInto(addWrapper));
                        _add = v;
                    };
                    if ('add' in mr)
                        setMrAdd(mr.add);
                    Object.defineProperty(mr, 'add', _cloneInto({
                        get() {
                            return _add;
                        },
                        set: setMrAdd
                    }));

                }

                const _mr_wrapper = vl => {
                    defineLocator(vl.mimic ? vl.mimic : vl);
                    defineDetector(vl);
                    defineAdd(vl);
                    return vl;
                };
                if ('mr' in win) {
                    _console.log('Found existing "mr" object.');
                    win.mr = _mr_wrapper(win.mr);
                } else {
                    let _mr;
                    Object.defineProperty(win, 'mr', _cloneInto({
                        get() {
                            return _mr;
                        },
                        set(vl) {
                            _mr = vl ? _mr_wrapper(vl) : vl;
                        },
                        configurable: true
                    }));
                    let _defineProperty = _bindCall(Object.defineProperty);
                    Object.defineProperty = exportFunction(function defineProperty(...args) {
                        const [obj, name, conf] = args;
                        if (name === 'mr' && obj instanceof Window) {
                            _console.trace('Object.defineProperty(', ...args, ')');
                            conf.set(_mr_wrapper(conf.get()));
                        }
                        if ((name === 'honeyPot' || name === 'add') && _mr === obj && conf.set)
                            return;
                        return _defineProperty(this, ...args);
                    }, win);
                }
            }, nullTools, selectiveCookies, abortExecution)
        },

        'oms.matchat.online': () => scriptLander(() => {
            let _rmpGlobals;
            Object.defineProperty(win, 'rmpGlobals', _cloneInto({
                get() {
                    return _rmpGlobals;
                },
                set(val) {
                    if (val === _rmpGlobals)
                        return true;
                    _rmpGlobals = new _Proxy(val, _cloneInto({
                        get(obj, name) {
                            if (name === 'adBlockerDetected')
                                return false;
                            return obj[name];
                        },
                        set(obj, name, val) {
                            if (name === 'adBlockerDetected')
                                _console.trace('rmpGlobals.adBlockerDetected =', val);
                            else
                                obj[name] = val;
                            return true;
                        }
                    }));
                }
            }));
        }),

        'megogo.net': {
            now() {
                nt.define('adBlock', false);
                nt.define('showAdBlockMessage', nt.func(null, 'showAdBlockMessage'));
            }
        },

        'naruto-base.su': () => gardener('div[id^="entryID"],.block', /href="http.*?target="_blank"/i),

        'online-fix.me': () => {
            localStorage.setItem('disable-helpus', true);
            let _$ = win.$;
            Object.defineProperty(win, '$', _cloneInto({
                get() {
                    return _$;
                },
                set(jQuery) {
                    _$ = new _Proxy(jQuery, _cloneInto({
                        apply(fun, that, args) {
                            const res = _apply(fun, that, args);
                            if (res.selector === '#helpus')
                                res.fadeIn = nt.func(null, '$.fadeIn');
                            if (res.selector && res.selector.endsWith('a.btn'))
                                res.replaceWith = nt.func(null, '$.replaceWith');
                            return res;
                        }
                    }));
                    return true;
                }
            }));
        },

        'otzovik.com': () => scriptLander(() => {
            abortExecution.onAll('Object.prototype.getYa');
            abortExecution.onGet('Object.prototype.parseServerDataFunction');
            let _o_math = win.o_math;
            Object.defineProperty(win, 'o_math', _cloneInto({
                get() {
                    return _o_math;
                },
                set(val) {
                    delete val.ext_uid;
                    _o_math = val;
                    throw removeOwnFootprint(new ReferenceError('fetch is not defined'));
                }
            }));
        }, abortExecution, selectiveCookies),

        'overclockers.ru': {
            now() {
                abortExecution.onAll('cardinals');
                abortExecution.inlineScript('Document.prototype.createElement', {
                    pattern: /mamydirect/
                });
            }
        },

        'peka2.tv': () => {
            let bodyClass = 'body--branding';
            let checkNode = node => {
                for (let className of node.classList)
                    if (className.includes('banner') || className === bodyClass) {
                        _removeAttribute(node, 'style');
                        node.classList.remove(className);
                        for (let attr of Array.from(node.attributes))
                            if (attr.name.startsWith('advert'))
                                _removeAttribute(node, attr.name);
                    }
            };
            (new MutationObserver(ms => {
                let m, node;
                for (m of ms)
                    for (node of m.addedNodes)
                        if (node instanceof HTMLElement)
                            checkNode(node);
            })).observe(_de, {
                childList: true,
                subtree: true
            });
            (new MutationObserver(ms => {
                for (let m of ms)
                    checkNode(m.target);
            })).observe(_de, {
                attributes: true,
                subtree: true,
                attributeFilter: ['class']
            });
        },

        'pikabu.ru': () => gardener('.story', /story__author[^>]+>ads</i, {
            root: '.inner_wrap',
            observe: true
        }),

        'pixelexperience.org': () => scriptLander(() => {
            abortExecution.inlineScript('eval', {
                pattern: /blockadblock/
            });
        }, abortExecution),

        'player.starlight.digital': {
            other: 'teleportal.ua',
            dom() {
                scriptLander(() => {
                    let _currVideo = win.currVideo;
                    Object.defineProperty(win, 'currVideo', _cloneInto({
                        get() {
                            return _currVideo;
                        },
                        set(val) {
                            _console.log('currVideo =', val);
                            if ('adv' in val)
                                val.adv.creatives = [];
                            if ('showadv' in val)
                                val.showadv = false;
                            if ('mediaHls' in val)
                                val.mediaHls = val.mediaHls.replace('adv=1', 'adv=0');
                            if ('media' in val)
                                for (let media of val.media)
                                    media.url = media.url.replace('adv=1', 'adv=0');
                            _currVideo = val;
                        }
                    }));
                    nt.define('Object.prototype.isAdBlockEnabled', false);
                    nt.define('Object.prototype.AdBlockDynamicConfig', undefined);
                    nt.define('ADT_PLAYER_ADBLOCK_CONFIG', '');
                    nt.define('ADT_PLAYER_ADBLOCK_CONFIG_DETECT_ON_FAIL', false);
                }, nullTools);
            }
        },

        'player.vgtrk.com': () => nt.define('Object.prototype.IS_CHECK_REGISTRATION', undefined),

        'qrz.ru': {
            now() {
                nt.define('ab', false);
                nt.define('tryMessage', nt.func(null, 'tryMessage'));
            }
        },

        'rambler.ru': {
            other: [
                'afisha.ru', 'autorambler.ru', 'championat.com', 'eda.ru', 'gazeta.ru', 'lenta.ru', 'letidor.ru',
                'media.eagleplatform.com', 'motor.ru', 'passion.ru', 'quto.ru', 'rns.online', 'wmj.ru'
            ].join(','),
            now() {
                scriptLander(() => {
                    //  Skip login form and frames, and comments frames. Nothing to do here.
                    if (['id.rambler.ru', 'comments.rambler.ru'].includes(location.hostname))
                        return;

                    // prevent autoplay
                    if (location.hostname === 'vp.rambler.ru') {
                        nt.define('Object.prototype.minPlayingVisibleHeight', Number.MAX_SAFE_INTEGER);
                        return;
                    }
                    if (location.hostname.endsWith('.media.eagleplatform.com')) {
                        const _stopImmediatePropagation = _bindCall(Event.prototype.stopImmediatePropagation);
                        win.addEventListener('message', e => {
                            if (typeof e.data === 'object' && e.data.visible)
                                _stopImmediatePropagation(e);
                        });
                        return;
                    }
                    /* jshint -W001 */ // aka 'hasOwnProperty' is a really bad name, but this is a wrapper
                    const autoList = new Set(['autoplay', 'scrollplay']);
                    win.Object.prototype.hasOwnProperty = new _Proxy(win.Object.prototype.hasOwnProperty, _cloneInto({
                        apply(fun, that, args) {
                            if (autoList.has(args[0]))
                                return false;
                            return _apply(fun, that, args);
                        }
                    }));
                    /* jshint +W001 */

                    // ABP detection dev override, handy ^_^
                    _document.cookie = '_blocker_hidden=1; domain=.rambler.ru; path=/';

                    selectiveCookies('detect_count|dv|dvr|lv|lvr');
                    // Wrapper for adv loader settings in QW50aS1BZEJsb2Nr['7t7hystz']
                    const _contexts = new WeakMap();
                    Object.defineProperty(Object.prototype, 'Settings', _cloneInto({
                        set(val) {
                            if (typeof val === 'object' && 'Transports' in val && 'Urls' in val)
                                val.Urls = [];
                            _contexts.set(this, val);
                        },
                        get() {
                            return _contexts.get(this);
                        }
                    }));
                    // disable video pop-outs in articles on gazeta.ru
                    if (location.hostname === 'gazeta.ru' || location.hostname.endsWith('.gazeta.ru'))
                        nt.define('creepyVideo', nt.func(null, 'creepyVideo'));
                    // disable Alice popup (encountered on horoscopes.rambler.ru)
                    nt.define('Object.prototype.needShowAlicePopup', false);
                    // disable some logging
                    yandexRavenStub();
                    // hide "disable ads" button
                    createStyle('a[href^="https://prime.rambler.ru/promo/"] { display: none !important }');
                    // prevent ads from loading
                    abortExecution.onGet('g_GazetaNoExchange');

                    //const toBlock = /[[:][a-z]{1,4}\("0x[\da-f]+"\)[\],}]|{[a-z]{1,2}\([a-z]{1,2}\)}|\.(rnet\.plus|24smi\.net|infox\.sg|lentainform\.com)\//i;
                    const scriptSkipList = /nrWrapper|\/(desktopVendor|vendorsDesktop)\.|<anonymous>/;
                    const isLocalScript = (log) => {
                        let e = removeOwnFootprint(new Error()),
                            parts = e.stack.split(/\n/),
                            row = 0;
                        if (!/http/.test(parts[row]))
                            row += 1;
                        while (scriptSkipList.test(parts[row]))
                            row += 1;
                        let parse = /(https?:.*):\d+:\d+/.exec(parts[row]);
                        if (log)
                            _console.log(parse && parse[1] === location.href, parts[row], [parts]);
                        return parse && parse[1] === location.href;
                    };
                    const cutoff = 200;
                    const fts = f => _toString(f.__sentry__ && f.__sentry_original__ || f['nr@original'] || f);
                    win.setTimeout = new _Proxy(win.setTimeout, _cloneInto({
                        apply(fun, that, args) {
                            if (isLocalScript()) {
                                const [callback, delay] = args;
                                const str = fts(callback);
                                if (!/\n/.test(str)) {
                                    _console.trace(`Skipped setTimeout(${str.slice(0, cutoff)}${str.length > cutoff ? '\u2026' : ''}, ${delay})`);
                                    return null;
                                }
                            }
                            return _apply(fun, that, args);
                        }
                    }));
                    const _onerror = Object.getOwnPropertyDescriptor(win.HTMLElement.prototype, 'onerror');
                    _onerror.set = new _Proxy(_onerror.set, _cloneInto({
                        apply(fun, that, args) {
                            if (typeof args[0] === 'function' && isLocalScript()) {
                                const str = fts(args[0]);
                                _console.trace(`Skipped onerror = ${str.slice(0, cutoff)}${str.length > cutoff ? '\u2026' : ''}`);
                                return;
                            }
                            return _apply(fun, that, args);
                        }
                    }));
                    Object.defineProperty(win.HTMLElement.prototype, 'onerror', _onerror);
                    // Skip dev console check
                    win.console.debug = new Proxy(win.console.debug, _cloneInto({
                        apply(fun, that, args) {
                            if (args[0] instanceof HTMLImageElement)
                                return;
                            return _apply(fun, that, args);
                        }
                    }));
                    // anti-abdetector
                    let _primeStorage;
                    Object.defineProperty(win, 'primeStorage', _cloneInto({
                        get() {
                            if (isLocalScript())
                                throw removeOwnFootprint(new TypeError(`Cannot read property 'primeStorage' of undefined`));
                            return _primeStorage;
                        },
                        set(val) {
                            _primeStorage = val;
                        }
                    }));
                    // Defense against triggered detector
                    _Node.removeChild = new _Proxy(_Node.removeChild, _cloneInto({
                        apply(fun, that, args) {
                            const [el] = args;
                            if (el.tagName === 'LINK' && isLocalScript()) {
                                _console.log(`Let's not remove ${el.tagName}.`);
                                return;
                            }
                            return _apply(fun, that, args);
                        }
                    }));
                }, nullTools, yandexRavenStub, selectiveCookies, abortExecution);
            },
            dom() {
                // disable video pop-outs in articles on lenta.ru and rambler.ru
                let domain = location.hostname.split('.');
                if (['lenta', 'rambler'].includes(domain[domain.length - 2])) {
                    const player = _document.querySelector('.js-video-box__container, .j-mini-player__video');
                    if (player) player.removeAttribute('class');
                }
                // remove utm_ form links
                const parser = _document.createElement('a');
                _document.addEventListener('mousedown', (e) => {
                    let t = e.target;
                    if (!t.href)
                        t = t.closest('A');
                    if (t && t.href) {
                        parser.href = t.href;
                        let remove = [];
                        let params = parser.search.slice(1).split('&').filter(name => {
                            if (name.startsWith('utm_')) {
                                remove.push(name);
                                return false;
                            }
                            return true;
                        });
                        if (remove.length)
                            _console.log('Removed parameters from link:', ...remove);
                        if (params.length)
                            parser.search = `?${params.join('&')}`;
                        else
                            parser.search = '';
                        t.href = parser.href;
                    }
                }, false);
            }
        },

        'razlozhi.ru': {
            now() {
                nt.define('cadb', false);
                for (let func of ['createShadowRoot', 'attachShadow'])
                    if (func in _Element)
                        _Element[func] = function () {
                            return this.cloneNode();
                        };
                createStyle([
                    'div[class][style*="width:"][style*="height"][style*="/themes/default/bg.png"] > div > div[style*="height:"][style*="width:"] { width: 100% !important }',
                    'div[class][style*="width:"][style*="height"][style*="/themes/default/bg.png"] > div[class][style^="top: "] ~ div[class]:not([style]) { right: -100% !important }',
                    'div[class][style*="width:"][style*="height"][style*="/themes/default/bg.png"] > div[style*="px;"] { width: 100% !important }',
                    'div[class][style*="width:"][style*="height"][style*="/themes/default/bg.png"] { width: 100% !important }'
                ]);
            }
        },

        'rbc.ru': {
            other: 'autonews.ru, rbcplus.ru, sportrbc.ru',
            now() {
                scriptLander(() => selectiveCookies('adb_on'), selectiveCookies);
                let _RA;
                let setArgs = {
                    'showBanners': true,
                    'showAds': true,
                    'banners.staticPath': '',
                    'paywall.staticPath': '',
                    'banners.dfp.pageTargeting': () => null,
                    'banners.refreshConfig': [],
                    'banners.preroll': null
                };
                const log = (...args) => jsf.LogAdditionalInfo && _console.log(...args);
                const trace = (...args) => jsf.LogAdditionalInfo && _console.trace(...args);
                Object.defineProperty(win, 'RA', _cloneInto({
                    get() {
                        return _RA;
                    },
                    set(vl) {
                        log('RA =', vl);
                        if ('repo' in vl) {
                            log('RA.repo =', vl.repo);
                            vl.repo = new _Proxy(vl.repo, _cloneInto({
                                set(obj, name, val) {
                                    if (name === 'banner') {
                                        log(`RA.repo.${name} =`, val);
                                        val = new _Proxy(val, _cloneInto({
                                            get(obj, name) {
                                                let res = obj[name];
                                                if (name === 'checkAdBlock' || name === 'gpmdPuidGenerator')
                                                    res = () => undefined;
                                                if (name === 'isInited')
                                                    res = true;
                                                if (name === 'run')
                                                    res = (...args) => log('run RA.repo.banner.run(', ...args, ')');
                                                trace(`get RA.repo.banner.${name}`, res);
                                                return res;
                                            }
                                        }));
                                    }
                                    obj[name] = val;
                                    return true;
                                }
                            }));
                        } else
                            _console.log('Unable to locate RA.repo');
                        if ('fn' in vl) {
                            const replace = ['flyroll', 'subscriptionPopup', 'yandexDirect'];
                            vl.fn = new _Proxy(vl.fn, _cloneInto({
                                get(obj, name) {
                                    if (replace.includes(name))
                                        obj[name] = {
                                            init: (...args) => log(`run RA.fn.${name}.init(`, ...args, ')')
                                        };
                                    log(`get RA.fn.${name}`, obj[name]);
                                    return obj[name];
                                }
                            }));
                        }
                        _RA = new _Proxy(vl, _cloneInto({
                            set(o, name, val) {
                                if (name === 'config') {
                                    log('RA.config =', val);
                                    if ('set' in val) {
                                        val.set = new _Proxy(val.set, _cloneInto({
                                            apply(set, that, args) {
                                                let name = args[0];
                                                if (name in setArgs)
                                                    args[1] = setArgs[name];
                                                if (name === 'banners.dfp.config' && args[1] && args[1].length) // looks like player is loaded as an ad
                                                    args[1] = args[1].filter(x => x.place === 'over_livetv');
                                                if (name in setArgs || name === 'checkad' || name === 'banners.dfp.config')
                                                    log('RA.config.set(', ...args, ')');
                                                return _apply(set, that, args);
                                            }
                                        }));
                                        val.set('showAds', true); // pretend ads already were shown
                                    }
                                }
                                o[name] = val;
                                return true;
                            }
                        }));
                    }
                }));
                nt.define('bannersConfig', []);
                // pretend there is a paywall landing on screen already
                let pwl = _document.createElement('div');
                pwl.style.display = 'none';
                pwl.className = 'js-paywall-landing';
                _document.documentElement.appendChild(pwl);
                // hide banner placeholders
                createStyle('[data-banner-id], .banner__container, .banners__yandex__article { display: none !important }');
            },
            dom() {
                // hide sticky banner place at the top of the page
                for (let itm of _document.querySelectorAll('.l-sticky'))
                    if (itm.querySelector('.banner__container__link'))
                        itm.style.display = 'none';
            }
        },

        'reactor.cc': {
            other: 'joyreactor.cc, pornreactor.cc',
            now: () => scriptLander(() => {
                selectiveEval();
                win.open = function () {
                    throw new ReferenceError('Redirect prevention.');
                };
                nt.define('Worker', nt.func(nt.proxy({}, 'Worker'), 'Worker'));
                let _CTRManager = win.CTRManager;
                Object.defineProperty(win, 'CTRManager', _cloneInto({
                    get() {
                        return _CTRManager;
                    },
                    set(vl) {
                        if (vl === _CTRManager)
                            return true;
                        _CTRManager = {};
                        for (let name in vl)
                            if (typeof vl[name] !== 'function')
                                _CTRManager[name] = vl[name];
                        _CTRManager = nt.proxy(_CTRManager, 'CTRManager');
                    }
                }));
            }, nullTools, selectiveEval),
            click(e) {
                let node = e.target;
                if (node.nodeType === _Node.ELEMENT_NODE &&
                    node.style.position === 'absolute' &&
                    node.style.zIndex > 0)
                    node.parentNode.removeChild(node);
            }
        },

        'rp5.tld': {
            now() {
                Object.defineProperty(win, 'sContentBottom', _cloneInto({
                    set() {},
                    get() {
                        return '';
                    }
                }));
                // skip timeout check for blocked requests
                let _setTimeout = win.setTimeout;
                win.setTimeout = function setTimeout(...args) {
                    let str = (typeof args[0] === 'string' ? args[0] : _toString(args[0]));
                    if (str.includes('xvb')) {
                        _console.log('Blocked setTimeout for:', str);
                        return;
                    }
                    return _setTimeout(...args);
                };
            },
            dom() {
                let node = selectNodeByTextContent('Разместить текстовое объявление', {
                    root: _de.querySelector('#content-wrapper'),
                    shallow: true
                });
                if (node)
                    node.style.display = 'none';
            }
        },

        'rutracker.org': {
            other: 'rutracker.lib, rutracker.net, rutracker.nl',
            now: () => {
                const ext = 'p-ext-link';
                _Element.setAttribute = new _Proxy(_Element.setAttribute, _cloneInto({
                    apply(fun, that, args) {
                        let [prop, classes] = args;
                        if (prop === 'class') {
                            let list = classes.split(/\s/);
                            if (list.includes(ext)) {
                                args[1] = list.filter(x => x !== ext).join(' ');
                                that.setAttribute('target', '_blank');
                                that.setAttribute('rel', 'noreferrer');
                            }
                        }
                        return _apply(fun, that, args);
                    }
                }));
            }
        },

        'rutube.ru': () => scriptLander(() => {
            jsonFilter('creative', 'creative.id');
            jsonFilter('interactives', 'interactives.0');
        }, jsonFilter),

        'sdamgia.ru': () => {
            abortExecution.onGet('Object.prototype.getYa');
            abortExecution.onGet('Object.prototype.initYa');
            abortExecution.onGet('Object.prototype.initYaDirect');
        },

        'shazoo.ru': () => {
            const wash = node => node.tagName === 'BODY' && !node.removeAttribute('style');
            if (!Array.prototype.some.call(_de.children, wash)) {
                let o = new MutationObserver(() => wash(_de.children[_de.children.length - 1]) && o.disconnect());
                o.observe(_de, {
                    childList: true
                });
            }
        },

        'simpsonsua.tv': () => {
            let _addEventListener = _Document.addEventListener;
            _document.addEventListener = function (event, callback) {
                if (event === 'DOMContentLoaded' && callback.toString().includes('show_warning'))
                    return;
                return _addEventListener.apply(this, arguments);
            };
            nt.define('need_warning', 0);
            nt.define('onYouTubeIframeAPIReady', nt.func(null, 'onYouTubeIframeAPIReady'));
        },

        'smotret-anime-365.ru': () => scriptLander(() => {
            deepWrapAPI(root => {
                const _pause = _bindCall(root.Audio.prototype.pause);
                const _addEventListener = _bindCall(root.Element.prototype.addEventListener);
                let stopper = e => _pause(e.target);
                root.Audio = new root.Proxy(root.Audio, _cloneInto({
                    construct(audio, args) {
                        let res = _construct(audio, args);
                        _addEventListener(res, 'play', stopper, true);
                        return res;
                    }
                }, root));
                const getTagName = _bindCall(Object.getOwnPropertyDescriptor(_Element, 'tagName').get);
                root.Document.prototype.createElement = new root.Proxy(root.Document.prototype.createElement, _cloneInto({
                    apply(fun, that, args) {
                        let res = _apply(fun, that, args);
                        if (getTagName(res) === 'AUDIO')
                            _addEventListener(res, 'play', stopper, true);
                        return res;
                    }
                }, root));
            });
        }, deepWrapAPI),

        'smotrim.ru': () => createStyle('.dialog-wrapper { display: none !important }'),

        'spaces.ru': () => {
            gardener('div:not(.f-c_fll) > a[href*="spaces.ru/?Cl="]', /./, {
                parent: 'div'
            });
            gardener('.js-banner_rotator', /./, {
                parent: '.widgets-group'
            });
        },

        'spam-club.blogspot.co.uk': () => {
            let _clientHeight = Object.getOwnPropertyDescriptor(_Element, 'clientHeight'),
                _clientWidth = Object.getOwnPropertyDescriptor(_Element, 'clientWidth');
            let wrapGetter = (getter) => {
                let _getter = getter;
                return function () {
                    let _size = _getter.apply(this, arguments);
                    return _size ? _size : 1;
                };
            };
            _clientHeight.get = wrapGetter(_clientHeight.get);
            _clientWidth.get = wrapGetter(_clientWidth.get);
            Object.defineProperty(_Element, 'clientHeight', _clientHeight);
            Object.defineProperty(_Element, 'clientWidth', _clientWidth);
            let _onload = Object.getOwnPropertyDescriptor(HTMLElement.prototype, 'onload'),
                _set_onload = _onload.set;
            _onload.set = function () {
                if (this instanceof HTMLImageElement)
                    return true;
                _set_onload.apply(this, arguments);
            };
            Object.defineProperty(HTMLElement.prototype, 'onload', _onload);
        },

        'sport-express.ru': () => gardener('.js-relap__item', />Реклама\s+<\//, {
            root: '.container',
            observe: true
        }),

        'sports.ru': {
            other: 'tribuna.com',
            now() {
                // extra functionality: shows/hides panel at the top depending on scroll direction
                createStyle({
                    '.user-panel__fixed': {
                        transition: 'top 0.2s ease-in-out!important'
                    },
                    '.popup__overlay.feedback': {
                        display: 'none!important'
                    },
                    '.user-panel-up': {
                        top: '-40px!important'
                    },
                    '#branding-layout': {
                        margin_top: '100px!important'
                    }
                }, {
                    id: 'fixes',
                    protect: false
                });
                scriptLander(() => {
                    yandexRavenStub();
                    webpackJsonpFilter(/AdBlockDetector|addBranding|loadPlista/);
                }, nullTools, yandexRavenStub, webpackJsonpFilter);
            },
            dom() {
                (function lookForPanel() {
                    let panel = _document.querySelector('.user-panel__fixed');
                    if (!panel)
                        setTimeout(lookForPanel, 100);
                    else
                        window.addEventListener(
                            'wheel',
                            function (e) {
                                if (e.deltaY > 0 && !panel.classList.contains('user-panel-up'))
                                    panel.classList.add('user-panel-up');
                                else if (e.deltaY < 0 && panel.classList.contains('user-panel-up'))
                                    panel.classList.remove('user-panel-up');
                            }, false
                        );
                })();
            }
        },

        'stealthz.ru': {
            dom() {
                // skip timeout
                let $ = _document.querySelector.bind(_document);
                let [timer_1, timer_2] = [$('#timer_1'), $('#timer_2')];
                if (!timer_1 || !timer_2)
                    return;
                timer_1.style.display = 'none';
                timer_2.style.display = 'block';
            }
        },

        'tortuga.wtf': () => {
            nt.define('Object.prototype.hideab', undefined);
        },

        'tv.animebest.org': {
            now() {
                let _eval = win.eval;
                win.eval = new _Proxy(win.eval, _cloneInto({
                    apply(evl, ths, args) {
                        if (typeof args[0] === 'string' &&
                            args[0].includes("'VASTP'")) {
                            args[0] = args[0].replace("'VASTP'", "''");
                            win.eval = _eval;
                        }
                        return Reflect.apply(evl, ths, args);
                    }
                }));
            }
        },

        'tv-kanali.online': () => {
            win.setTimeout = new _Proxy(win.setTimeout, _cloneInto({
                apply(fun, that, args) {
                    if (args[0].name && args[0].name.includes('doAd'))
                        return;
                    if (args[1] === 30000) args[1] = 100;
                    return _apply(fun, that, args);
                }
            }));
        },

        'video.khl.ru': () => {
            let props = new Set(['detectBlockers', 'detectBlockersByLink', 'detectBlockersByElement']);
            win.Object.defineProperty = new _Proxy(win.Object.defineProperty, _cloneInto({
                apply(def, that, args) {
                    if (props.has(args[1])) {
                        args[2] = {
                            key: args[1],
                            value() {
                                _console.log(`Skipped ${args[1]} call.`);
                            }
                        };
                        _console.log(`Replaced method ${args[1]}.`);
                    }
                    return Reflect.apply(def, that, args);
                }
            }));
        },

        'websdr.space': () => {
            // scripts_base.min.js localDetect(): lol. seriously, lol
            win.setTimeout = new _Proxy(win.setTimeout, _cloneInto({
                apply(fun, that, args) {
                    let [callback, timeout] = args;
                    if (timeout > 1000 && typeof callback === 'function' && _toString(callback).includes('5e3')) {
                        _console.log('skip', callback);
                        return;
                    }
                    return _apply(fun, that, args);
                }
            }));
        },

        'xatab-repack.net': {
            other: 'rg-mechanics.org',
            now() {
                abortExecution.onSet('blocked');
            }
        },

        'xittv.net': () => scriptLander(() => {
            let logNames = ['setup', 'trigger', 'on', 'off', 'onReady', 'onError', 'getConfig', 'addPlugin', 'getAdBlock'];
            let skipEvents = ['adComplete', 'adSkipped', 'adBlock', 'adRequest', 'adMeta', 'adImpression', 'adError', 'adTime', 'adStarted', 'adClick'];
            let _jwplayer;
            Object.defineProperty(win, 'jwplayer', _cloneInto({
                get() {
                    return _jwplayer;
                },
                set(x) {
                    _jwplayer = new _Proxy(x, _cloneInto({
                        apply(fun, that, args) {
                            let res = fun.apply(that, args);
                            res = new _Proxy(res, _cloneInto({
                                get(obj, name) {
                                    if (logNames.includes(name) && typeof obj[name] === 'function')
                                        return new _Proxy(obj[name], _cloneInto({
                                            apply(fun, that, args) {
                                                if (name === 'setup') {
                                                    let o = args[0];
                                                    if (o)
                                                        delete o.advertising;
                                                }
                                                if (name === 'on' || name === 'trigger') {
                                                    let events = typeof args[0] === 'string' ? args[0].split(" ") : null;
                                                    if (events.length === 1 && skipEvents.includes(events[0]))
                                                        return res;
                                                    if (events.length > 1) {
                                                        let names = [];
                                                        for (let event of events)
                                                            if (!skipEvents.includes(event))
                                                                names.push(event);
                                                        if (names.length > 0)
                                                            args[0] = names.join(" ");
                                                        else
                                                            return res;
                                                    }
                                                }
                                                let subres = fun.apply(that, args);
                                                _console.trace(`jwplayer().${name}(`, ...args, `) >>`, res);
                                                return subres;
                                            }
                                        }));
                                    return obj[name];
                                }
                            }));
                            return res;
                        }
                    }));
                    _console.log('jwplayer =', x);
                }
            }));
        }),

        'yandex.tld': {
            other: 'yandexsport.tld',
            now: () => {
                // Generic Yandex Scripts
                const mainScript = () => {
                    // Yandex API (ADBTools, Metrika)
                    let hostname = location.hostname;
                    if (// Yandex use their Ya object for a lot of things on their pages and
                        // wrapping it may cause problems. It's better to skip it in some cases.
                        ((hostname.startsWith('yandex.') || hostname.includes('.yandex.')) &&
                        /^\/((yand)?search|images|health)/i.test(location.pathname) && !hostname.startsWith('news.')) ||
                        hostname.startsWith('eda.yandex.')
                    ) return;

                    let YaProps = new Set();

                    function setObfuscatedProperty(Ya, rootProp, obj, name) {
                        if (YaProps.has(rootProp))
                            return;
                        _console.trace(`Ya.${rootProp} = Ya.${name}`);
                        nt.defineOn(Ya, rootProp, Ya[name], 'Ya.');
                        YaProps.add(rootProp);
                        for (let prop in obj)
                            delete obj[prop];
                        for (let prop in Ya[name])
                            obj[prop] = Ya[name][prop];
                    }

                    function onObfuscatedProperty(Ya, rootProp, obj) {
                        if ('AdvManager' in obj || 'AdvManagerStatic' in obj || 'isAllowedRepeatAds' in obj) {
                            setObfuscatedProperty(Ya, rootProp, obj, 'Context');
                            return Ya.Context;
                        }
                        if ('create' in obj && 'createAdaptive' in obj && 'createScroll' in obj) {
                            setObfuscatedProperty(Ya, rootProp, obj, 'adfoxCode');
                            return Ya.adfoxCode;
                        }
                        return new _Proxy(obj, _cloneInto({
                            set(target, prop, val) {
                                if (prop === 'AdvManager' || prop === 'isAllowedRepeatAds') {
                                    setObfuscatedProperty(Ya, rootProp, obj, 'Context');
                                    return true;
                                }
                                if (prop === 'create' && 'createAdaptive' in obj && 'createScroll' in obj ||
                                    prop === 'createScroll' && 'create' in obj && 'createAdaptive' in obj ||
                                    prop === 'createAdaptive' && 'create' in obj && 'createScroll' in obj) {
                                    setObfuscatedProperty(Ya, rootProp, obj, 'adfoxCode');
                                    return true;
                                }
                                target[prop] = val;
                                return true;
                            },
                            get(target, prop) {
                                if (prop === 'AdvManager' && !(prop in target)) {
                                    _console.trace(`Injected missing ${prop} in Ya.${rootProp}.`);
                                    target[prop] = Ya.Context[prop];
                                }
                                return target[prop];
                            }
                        }));
                    }
                    let Rum = {
                        getSettings: nt.func([], 'Ya.Rum.getSettings'),
                        getVarsList: nt.func([], 'Ya.Rum.getVarsList'),
                        getTimeMarks: nt.func([], 'Ya.Rum.getTimeMarks'),
                        ajaxStart: 0,
                        ajaxComplete: 0,
                        enabled: true,
                        vsChanged: false,
                        vsStart: 'visible',
                        ERROR_LEVEL: nt.proxy({
                            ERROR: 0,
                            WARN: 0,
                            INFO: 0
                        }, 'Ya.Rum.ERROR_LEVEL'),
                        _tti: null,
                        _markListeners: nt.proxy({}, 'Ya.Rum._markListeners'),
                        _periodicTasks: nt.proxy({}, 'Ya.Rum._periodicTasks'),
                        firstScreenMark: nt.proxy({}, 'Ya.Rum.firstScreenMark'),
                        getSpaMetricsManager: undefined,
                        _onComplete: [],
                        _onInit: []
                    };
                    [
                        '__timeMarks', '_timeMarks', '__deltaMarks', '_deltaMarks',
                        '__defRes', '_defRes', '__defTimes', '_defTimes', '_vars',
                        '_unsubscribers', 'commonVars'
                    ].forEach(name => void(Rum[name] = []));
                    Rum = nt.proxy(Rum, 'Ya.Rum', nt.NULL);
                    let Ya = new _Proxy(_cloneInto({}), _cloneInto({
                        set(obj, prop, val) {
                            if (val === obj[prop])
                                return true;
                            if (prop === 'Rum') {
                                nt.defineOn(obj, prop, Rum, 'Ya.');
                                YaProps.add(prop);
                                Object.assign(val, Rum);
                            }
                            if (YaProps.has(prop)) {
                                jsf.LogAdditionalInfo && _console.log(`Ya.${prop} \u2260`, val);
                                return true;
                            }
                            if (typeof val === 'object' && prop !== '__inline_params__' && !('length' in val))
                                val = onObfuscatedProperty(Ya, prop, val);
                            obj[prop] = val;
                            jsf.LogAdditionalInfo && _console.log(`Ya.${prop} =`, val);
                            return true;
                        },
                        get(obj, prop) {
                            const val = obj[prop];
                            jsf.LogAdditionalInfo && _console.log(`get Ya.${prop}`, val);
                            return val;
                        }
                    }));
                    let callWithParams = function (f) {
                        f.call(this, Ya.__inline_params__ || {});
                        Ya.__inline_params__ = null;
                    };
                    nt.defineOn(Ya, 'callWithParams', callWithParams, 'Ya.');
                    nt.defineOn(Ya, 'PerfCounters', nt.proxy({
                        __cacheEvents: []
                    }, 'Ya.PerfCounters', nt.NULL), 'Ya.');
                    nt.defineOn(Ya, '__isSent', true, 'Ya.');
                    nt.defineOn(Ya, 'confirmUrl', '', 'Ya.');
                    nt.defineOn(Ya, 'Direct', nt.proxy({}, 'Ya.Direct', nt.NULL), 'Ya.');
                    nt.defineOn(Ya, 'mediaCode', nt.proxy({
                        create() {
                            if (inIFrame) {
                                _console.log('Removed body of ad-frame.');
                                _document.documentElement.removeChild(_document.body);
                            }
                        }
                    }, 'Ya.mediaCode', nt.NULL), 'Ya.');
                    let extra = nt.proxy({
                        extra: nt.proxy({
                            match: 0,
                            confirm: '',
                            src: ''
                        }),
                        id: 0,
                        percent: 100,
                        threshold: 1
                    });
                    nt.defineOn(Ya, '_exp', nt.proxy({
                        id: 0,
                        coin: 0,
                        choose: nt.func(extra, 'Ya._exp.choose'),
                        get(prop) {
                            return _hasOwnProperty(extra, prop) ? extra[prop] : null;
                        },
                        getId: nt.func(0, 'Ya._exp.getId'),
                        defaultVersion: extra,
                        getExtra: nt.func(extra.extra, 'Ya._exp.getExtra'),
                        getDefaultExtra: nt.func(extra.extra, 'Ya._exp.getDefaultExtra'),
                        versions: [extra]
                    }), 'Ya.');
                    nt.defineOn(Ya, 'c', nt.func(null, 'Ya.c'), 'Ya.');
                    nt.defineOn(Ya, 'ADBTools', function () {
                        this.getCurrentState = nt.func(true, 'Ya.ADBTools().getCurrentState');
                        return nt.proxy(this, 'Ya.ADBTools', nt.NULL);
                    }, 'Ya.');
                    nt.defineOn(Ya, 'AdDetector', nt.proxy({}, 'Ya.AdDetector', nt.NULL), 'Ya.');
                    let definePr = o => {
                        Object.defineProperty(o, 'pr', _cloneInto({
                            set() {},
                            get() {
                                return Math.floor(Math.random() * 1e6) + 1;
                            }
                        }));
                    };
                    let adfoxCode = {
                        forcedDirectLoadingExp: nt.proxy({
                            isLoadingTurnedOn: false,
                            isExp: false
                        }),
                        isLoadingTurnedOn: false,
                        xhrExperiment: nt.proxy({
                            isXhr: true,
                            isControl: true
                        }),
                        matchidManager: nt.proxy({}, 'Ya.adfoxCode.matchidManager', nt.NULL),
                        _: []
                    };
                    definePr(adfoxCode);
                    [
                        'clearSession', 'create', 'createAdaptive', 'createScroll',
                        'destroy', 'moduleLoad', 'reload', 'setModule'
                    ].forEach(name => void(adfoxCode[name] = nt.func(null, `Ya.adfoxCode.${name}`)));
                    nt.defineOn(Ya, 'adfoxCode', nt.proxy(adfoxCode, 'Ya.adfoxCode', nt.NULL), 'Ya.');
                    let managerForAdfox = {
                        loaderVersion: 1,
                        isCurrrencyExp: true,
                        isReady: nt.func(true, 'Ya.headerBidding.managerForAdfox.isReady'),
                        getRequestTimeout: nt.func(
                            300 + Math.floor(Math.random() * 100),
                            'Ya.headerBidding.managerForAdfox.getRequestTimeout'
                        )
                    };
                    let headerBidding = nt.proxy({
                        setSettings(opts) {
                            if (!(opts && opts.adUnits))
                                return null;
                            let ids = [];
                            for (let unit of opts.adUnits)
                                ids.push(unit.code);
                            createStyle(`#${ids.join(', #')} { display: none !important }`);
                        },
                        pushAdUnits: nt.func(null, 'Ya.headerBidding.pushAdUnits'),
                        managerForAdfox: nt.proxy(managerForAdfox, 'Ya.headerBidding.managerForAdfox', nt.NULL)
                    });
                    definePr(headerBidding);
                    nt.defineOn(Ya, 'headerBidding', headerBidding, 'Ya.');

                    let AdvManager = function () {
                        this.render = function (o) {
                            if (!o.renderTo)
                                return;
                            let placeholder = _document.getElementById(o.renderTo);
                            if (!placeholder)
                                return _console.warn('Ya.AdvManager.render call w/o placeholder', o);
                            let parent = placeholder.parentNode;
                            placeholder.style = 'display:none!important';
                            parent.style = (parent.getAttribute('style') || '') + 'height:auto!important';
                            // fix for Yandex TV pages
                            if (location.hostname.startsWith('tv.yandex.')) {
                                let sibling = placeholder.previousSibling;
                                if (sibling && sibling.classList && sibling.classList.contains('tv-spin'))
                                    sibling.style.display = 'none';
                            }
                        };
                        this.constructor = Object;
                        return nt.proxy(this, 'Ya.AdvManager', nt.NULL);
                    };
                    nt.defineOn(Ya, 'Context', new _Proxy(_cloneInto({
                        __longExperiment: null,
                        _callbacks: nt.proxy([]),
                        _asyncModeOn: true,
                        _init: nt.func(null, 'Ya.Context._init'),
                        _load_callbacks: nt.proxy([]),
                        performanceStorage: nt.proxy({}),
                        processCallbacks: nt.func(null, 'Ya.Context.processCallbacks'),
                        isAllowedRepeatAds: nt.func(null, 'Ya.Context.isAllowedRepeatAds'),
                        isNewLoader: nt.func(false, 'Ya.Context.isNewLoader'),
                        getItem: nt.func(null, 'Ya.Context.getItem'),
                        AdvManager: new AdvManager(),
                        AdvManagerStatic: new AdvManager()
                    }), _cloneInto({
                        get(obj, prop) {
                            if (prop in obj)
                                return obj[prop];
                            _console.trace(`Ya.Context.${prop} = Ya.Context.AdvManager`);
                            obj[prop] = obj.AdvManager;
                            return obj[prop];
                        },
                        set() {
                            return true;
                        }
                    })), 'Ya.');
                    let Metrika = function Metrika(x) {
                        this._ecommerce = '';
                        if (x && 'id' in x)
                            this.id = x.id;
                        else
                            this.id = 0;
                        return nt.proxy(this, 'Ya.Metrika', nt.NULL);
                    };
                    Metrika.counters = () => Ya._metrika.counters;
                    nt.defineOn(Ya, 'Metrika', Metrika, 'Ya.');
                    nt.defineOn(Ya, 'Metrika2', Metrika, 'Ya.');
                    let counter = new Metrika();
                    nt.defineOn(Ya, '_metrika', nt.proxy({
                        counter: counter,
                        counters: [counter],
                        hitParam: {},
                        counterNum: 0,
                        hitId: 0,
                        v: 1,
                        i: 0,
                        _globalMetrikaHitId: 0,
                        getCounters: () => [],
                        dataLayer: null,
                        f1: null
                    }), 'Ya.');
                    nt.defineOn(Ya, '_globalMetrikaHitId', 0, 'Ya.');
                    counter = {};
                    [
                        'stringifyParams', '_getVars',
                        'getUid', 'getUrl', 'getHash'
                    ].forEach(name => void(counter[name] = nt.func('', `Ya.counter.${name}`)));
                    nt.defineOn(Ya, 'counter', nt.proxy(counter, 'Ya.counter', nt.NULL), 'Ya.');
                    nt.defineOn(Ya, 'jserrors', [], 'Ya.');
                    nt.defineOn(Ya, 'onerror', nt.func(null, 'Ya.onerror'), 'Ya.');
                    let skipYa = location.pathname.startsWith('/games/play/');
                    if (!skipYa) {
                        let error_on_access = false;
                        if ('Ya' in win)
                            try {
                                _console.log('Found existing Ya object:', win.Ya);
                                for (let prop in win.Ya)
                                    Ya[prop] = win.Ya[prop];
                            } catch (ignore) {
                                error_on_access = true;
                            }
                        if (!error_on_access) {
                            for (let prop in Ya)
                                if (prop !== '__inline_params__')
                                    YaProps.add(prop);
                            nt.define('Ya', Ya);
                        } else
                            _console.warn('Looks like window.Ya blocked with error-on-access scriptlet.');
                        // Yandex.Metrika callbacks
                        let yandex_metrika_callbacks = [];
                        _document.addEventListener(
                            'DOMContentLoaded', () => {
                                yandex_metrika_callbacks.forEach((f) => f && f.call(window));
                                yandex_metrika_callbacks.length = 0;
                                yandex_metrika_callbacks.push = (f) => setTimeout(f, 0);
                            }, false
                        );
                        nt.define('yandex_metrika_callbacks', yandex_metrika_callbacks);
                    }

                    let cookiefilter = '';
                    // ads on afisha.yandex.ru, however it looks like selectiveEval isn't perfect
                    // since eval could be called in scope to access properties of that scope and
                    // such calls with it active break functionality on metrika.yandex.ru
                    if (/(^|\.)afisha\./.test(location.hostname)) {
                        selectiveEval(/AdvManagerStatic/);
                        nt.define('Object.prototype._adbStyles', null);
                        nt.define('Object.prototype._adbClass', null);
                        cookiefilter += (cookiefilter.length ? '|' : '') + 'checkcookie';
                    }

                    selectiveCookies(cookiefilter);
                    // remove banner on the start page
                    let AwapsJsonAPI_Json = function (...args) {
                        _console.log('>> new AwapsJsonAPI.Json(', ...args, ')');
                    };
                    const cleaner = (_params, nodes) => {
                        try {
                            for (let i = 0; i < nodes.length; i++)
                                nodes[i].parentNode.parentNode.removeChild(nodes[i].parentNode);
                            _console.log(`Removed banner placeholder.`);
                        } catch (ignore) {
                            _console.log(`Can't locate placeholder to remove.`);
                        }
                    };
                    Object.assign(AwapsJsonAPI_Json.prototype, {
                        checkBannerVisibility: nt.func(true, 'AwapsJsonAPI.Json.checkBannerVisibility'),
                        autorefresh: nt.proxy(cleaner, 'AwapsJsonAPI.Json.prototype.autorefresh'),
                        addIframeContent: nt.proxy(cleaner, 'AwapsJsonAPI.Json.prototype.addIframeContent'),
                        getHTML: nt.func('', 'AwapsJsonAPI.Json.getHTML')
                    });
                    AwapsJsonAPI_Json.prototype = nt.proxy(AwapsJsonAPI_Json.prototype, 'AwapsJsonAPI.Json.prototype');
                    AwapsJsonAPI_Json = nt.proxy(AwapsJsonAPI_Json);
                    if ('AwapsJsonAPI' in win) {
                        _console.log('Oops! AwapsJsonAPI already defined.');
                        let f = win.AwapsJsonAPI.Json;
                        win.AwapsJsonAPI.Json = AwapsJsonAPI_Json;
                        if (f && f.prototype)
                            f.prototype = AwapsJsonAPI_Json.prototype;
                    } else
                        nt.define('AwapsJsonAPI', nt.proxy({
                            Json: AwapsJsonAPI_Json
                        }));

                    const parseExport = x => {
                        if (!x)
                            return x;
                        // remove banner placeholder
                        if (x.banner && x.banner.cls && x.banner.cls.banner__parent) {
                            let hide = pattern => {
                                for (let banner of _document.querySelectorAll(pattern)) {
                                    _setAttribute(banner, 'style', 'display:none!important');
                                    _console.log('Hid banner placeholder.');
                                }
                            };
                            let _parent = `.${x.banner.cls.banner__parent}`;
                            hide(_parent);
                            _document.addEventListener('DOMContentLoaded', () => hide(_parent), false);
                        }

                        // remove banner data and some other stuff
                        delete x.banner;
                        delete x.consistency;
                        delete x['i-bannerid'];
                        delete x['i-counter'];
                        delete x['promo-curtain'];

                        // remove parts of ga-counter (complete removal break "ТВ Онлайн")
                        if (x['ga-counter'] && x['ga-counter'].data) {
                            x['ga-counter'].data.id = 0;
                            delete x['ga-counter'].data.ether;
                            delete x['ga-counter'].data.iframeSrc;
                            delete x['ga-counter'].data.iframeSrcEx;
                        }

                        // remove adblock detector parameters and clean up detector cookie
                        if ('adb' in x) {
                            let cookie = x.adb.data ? x.adb.data.cookie : undefined;
                            if (cookie) {
                                selectiveCookies(cookie);
                                x.adb.data.adb = 0;
                            }
                            delete x.adb;
                        }

                        return x;
                    };
                    // Yandex banner on main page and some other things
                    let _home = win.home,
                        _home_set = !!_home;
                    Object.defineProperty(win, 'home', _cloneInto({
                        get() {
                            return _home;
                        },
                        set(vl) {
                            if (!_home_set && vl === _home)
                                return;
                            _home_set = false;
                            _console.log('home =', vl);
                            let _home_export = parseExport(vl.export);
                            Object.defineProperty(vl, 'export', _cloneInto({
                                get() {
                                    return _home_export;
                                },
                                set(vl) {
                                    _home_export = parseExport(vl);
                                }
                            }));
                            _home = vl;
                        }
                    }));

                    // adblock circumvention on some Yandex domains
                    yandexRavenStub();

                    // news, sport, docviewer in emails and probably other places
                    abortExecution.onGet('yaads.adRenderedCount');
                    let AdvertPartner = nt.func(false, 'AdvertPartner');
                    nt.defineOn(AdvertPartner, 'defaultProps', {}, 'AdvertPartner.');
                    nt.defineOn(AdvertPartner, 'contextTypes', [], 'AdvertPartner.');
                    nt.define('Object.prototype.AdvertPartner', AdvertPartner);
                    // ads in videoplayer
                    nt.define('Object.prototype.useAbdBundle', false);

                    (path => { // code specific for certain paths on yandex
                        const paths = {
                            news: () => {
                                win.JSON.parse = new _Proxy(win.JSON.parse, _cloneInto({
                                    apply(fun, that, args) {
                                        const res = _apply(fun, that, args);
                                        //_console.log(res);
                                        if ('content' in res) {
                                            delete res.content.adTags;
                                            delete res.content.adConfig;
                                        }
                                        if ('request_info' in res && res.request_info.with_ad_insertion)
                                            res.request_info.with_ad_insertion = false;
                                        delete res.rtb;
                                        delete res.seatbid;
                                        return res;
                                    }
                                }));
                            },
                            pogoda: () => createStyle(
                                'div[class^="content "][data-bem] > .content__bottom ~ div[class*="card "],' +
                                '[class*="segment__container"] > div > [class^="card "][class*="_"],' +
                                '.b-statcounter + div[class] > div[id][class] { display: none !important }'
                            ),
                            '': () => {
                                // banner on the main page under search
                                createStyle([
                                    '.widgets[role="main"] div[class] > div[class]:empty:first-child + div[class]:last-child' +
                                    '{ border: none !important }',
                                    'div.media-grid__row[data-blockname="infinity_zen"] .feed__item > div[class^="card-wrapper"][class*=" "]:not([style])' +
                                    '{ display: none !important }',
                                    '.widgets[role="main"] a[href^="https://yastatic.net/www/_/"] ~ div, .widgets[role="main"] a[href^="https://yastatic.net/www/_/"]' +
                                    '{ display: none !important }'
                                ]);
                                const getChildren = _bindCall(Object.getOwnPropertyDescriptor(_Element, 'children').get);
                                const HTMLElementDescriptors = Object.getOwnPropertyDescriptors(HTMLElement.prototype);
                                const [getOffsetParent, getOffsetHeight, getOffsetLeft, getOffsetTop] = [
                                    'offsetParent', 'offsetHeight', 'offsetLeft', 'offsetTop'
                                ].map(prop => _bindCall(HTMLElementDescriptors[prop].get));
                                const isParent = _bindCall(_Node.contains);
                                const getComputedStyle = win.getComputedStyle;
                                const getElementsFromPoint = _document.elementsFromPoint.bind(_document);
                                const getElementPoint = (e, x = 0, y = 0) => {
                                    while (e) {
                                        x += getOffsetLeft(e);
                                        y += getOffsetTop(e);
                                        e = getOffsetParent(e);
                                    }
                                    return {
                                        x,
                                        y
                                    };
                                };
                                const getRoot = (() => {
                                    let root;
                                    return () => root || (root = _querySelector('.widgets[role="main"]'));
                                })();

                                function hideAtPoint(node) {
                                    const arrow = _querySelector('.home-arrow, form[role="search"]');
                                    if (!arrow) {
                                        _console.log('Unable to locate search field.');
                                        return;
                                    }
                                    const [pt, at] = [getElementPoint(node), getElementPoint(arrow)];
                                    const stack = getElementsFromPoint(
                                        Math.max(pt.x, at.x + 16),
                                        Math.max(pt.y, at.y + getOffsetHeight(arrow) + 16)
                                    );
                                    const root = getRoot();
                                    stack.filter(n => !isParent(n, arrow) && root.contains(n)).forEach(
                                        e => e.setAttribute('style', 'display:none!important')
                                    );
                                }

                                const processed = new WeakSet();

                                function reWalker(root) {
                                    for (let node of getChildren(root)) {
                                        let bg = getComputedStyle(node).backgroundImage;
                                        if (bg && bg.includes('/yastatic.net/www/_/') && !processed.has(node)) {
                                            _setAttribute(node, 'style', 'background-image:none!important');
                                            hideAtPoint(node);
                                            processed.add(node);
                                            _console.log('Hid banner.');
                                        }
                                        reWalker(node);
                                    }
                                }

                                (new MutationObserver(
                                    ms => {
                                        const root = getRoot();
                                        if (!root) return;
                                        for (let m of ms)
                                            for (let node of m.addedNodes) {
                                                if (!(node instanceof HTMLElement) || !root.contains(node))
                                                    continue;
                                                reWalker(node);
                                            }
                                    }
                                )).observe(_de, {
                                    childList: true,
                                    subtree: true
                                });

                                win.addEventListener('DOMContentLoaded', r => (r = getRoot()) && reWalker(r));
                            }
                        };
                        if (paths[path]) paths[path]();
                        if (path === 'news' || path === 'sport') {
                            createStyle(
                                'div[class*="-header"] ~ div[id*="page"] > div > div[class*="__"] + div[class] > [class*="__row"] > div[class*="__col"]:last-child,' +
                                '.news-top-rubric-heading > span:only-child, div[class*="sport-app__advert"], div[class*="_banger"] { display: none !important }'
                            );
                            gardener('div[class*="__col"] > div[class*="-feed__"][class*="_type_"] > div[class*="loader"]', /./, {
                                root: 'div[class*="-header"] ~ div[id*="page"]',
                                parent: 'div[class*="-header"] ~ div[id*="page"] div[class*="__col"]',
                                observe: true,
                                hide: true
                            });
                        }
                    })(location.pathname.slice(1, (x => x < 0 ? undefined : x)(location.pathname.indexOf('/', 1))).toLowerCase());

                    // abp detector cookie on yandex pogoda and afisha
                    win.Element.prototype.getAttribute = new _Proxy(win.Element.prototype.getAttribute, _cloneInto({
                        apply(get, el, args) {
                            let res = _apply(get, el, args);
                            if (res && res.length > 20 && el instanceof HTMLBodyElement)
                                try {
                                    let o = JSON.parse(res),
                                        found = false,
                                        check;
                                    for (let prop in o) {
                                        check = 'param' in o[prop] || 'aabCookieName' in o[prop];
                                        if (check || 'banners' in o[prop]) {
                                            found = true;
                                            if (check)
                                                selectiveCookies(o[prop].param || o[prop].aabCookieName);
                                            _console.log(el.tagName, o, 'removed', o[prop]);
                                            delete o[prop];
                                        }
                                    }
                                    if (!found) _console.log(el.tagName, o);
                                    res = JSON.stringify(o);
                                } catch (ignore) {}
                            return res;
                        }
                    }));
                };
                scriptLander(mainScript, nullTools, yandexRavenStub, abortExecution, selectiveCookies, selectiveEval);


                // Subdomain-specific Yandex scripts
                const subDomain = location.hostname.slice(0, location.hostname.indexOf('.'));

                // Cause issues on docviewer
                if ('attachShadow' in _Element && subDomain !== 'docviewer') try {
                    let fakeRoot = () => ({
                        firstChild: null,
                        appendChild() {
                            return null;
                        },
                        querySelector() {
                            return null;
                        },
                        querySelectorAll() {
                            return null;
                        }
                    });
                    _Element.createShadowRoot = fakeRoot;
                    let shadows = new WeakMap();
                    let _attachShadow = Object.getOwnPropertyDescriptor(_Element, 'attachShadow');
                    _attachShadow.value = function () {
                        return shadows.set(this, fakeRoot()).get(this);
                    };
                    Object.defineProperty(_Element, 'attachShadow', _attachShadow);
                    let _shadowRoot = Object.getOwnPropertyDescriptor(_Element, 'shadowRoot');
                    _shadowRoot.set = () => null;
                    _shadowRoot.get = function () {
                        return shadows.has(this) ? shadows.get(this) : undefined;
                    };
                    Object.defineProperty(_Element, 'shadowRoot', _shadowRoot);
                } catch (e) {
                    _console.warn('Unable to wrap Element.prototype.attachShadow\n', e);
                }

                // Disable banner styleSheet (on main page)
                document.addEventListener('DOMContentLoaded', () => {
                    for (let sheet of document.styleSheets)
                        try {
                            for (let rule of sheet.cssRules)
                                if (rule.cssText.includes(' 728px 90px')) {
                                    rule.parentStyleSheet.disabled = true;
                                    _console.log('Disabled banner styleSheet:', rule.parentStyleSheet);
                                }
                        } catch (ignore) {}
                }, false);

                // Yandex Mail ads
                if (subDomain === 'mail') {
                    let wrap = vl => {
                        if (!vl)
                            return vl;
                        _console.log('Daria =', vl);
                        nt.defineOn(vl, 'AdBlock', nt.proxy({
                            detect: nt.func(new Promise(() => null), 'Daria.AdBlock.detect'),
                            enabled: false
                        }), 'Daria.');
                        nt.defineOn(vl, 'AdvPresenter', nt.proxy({
                            _config: nt.proxy({
                                banner: false,
                                done: false,
                                line: false
                            })
                        }), 'Daria.');
                        if (vl.Config) {
                            delete vl.Config.adBlockDetector;
                            delete vl.Config['adv-url'];
                            delete vl.Config.cryprox;
                            if (vl.Config.features) {
                                delete vl.Config.features.web_adloader_with_cookie_cache;
                                delete vl.Config.features.web_ads;
                                delete vl.Config.features.web_ads_mute;
                            }
                            vl.Config.mayHaveAdv = false;
                        }
                        return vl;
                    };
                    let _Daria = wrap(win.Daria);
                    if (_Daria)
                        _console.log('Wrapped already existing object "Daria".');
                    Object.defineProperty(win, 'Daria', _cloneInto({
                        get() {
                            return _Daria;
                        },
                        set(vl) {
                            if (vl === _Daria)
                                return;
                            _Daria = wrap(vl);
                        }
                    }));
                    // Buttons to pay to disable ads
                    createStyle('.ns-view-mail-pro-left-column-button, .PSHeader-Pro { display: none !important }');
                }

                // Detector and ads on Yandex Music
                if (subDomain === 'music') {
                    nt.define('tryPay', nt.func(null, 'tryPay'));
                    nt.define('Object.prototype.initMegabannerAPI', nt.func(null, 'initMegabannerAPI'));
                    nt.define('Object.prototype.mediaAd', undefined);
                    nt.define('Object.prototype.detect', () => new Promise(() => null));
                    nt.define('Object.prototype.loadContext', () => new Promise(r => r()));
                    nt.define('Object.prototype.antiAdbSetup', nt.func(null, 'ya.music.antiAdbSetup'));
                }

                const isSearch = /^\/(yand)?search[/?]/i.test(location.pathname);
                if (['mail', 'music', 'tv', 'yandexsport'].includes(subDomain) || isSearch) {
                    // prevent/defuse adblock detector and cleanup localStorage
                    for (let name in localStorage)
                        if (name.startsWith('videoplayer-ad-session-') || ['ic', 'yu', 'ludca', 'test'].includes(name))
                            localStorage.removeItem(name);

                    const mapsmb = Symbol('lsOverrideMap');
                    let lsOverride = {
                        // generic
                        '_mt__data': '',
                        'yandexJSPlayerApiSavedSingleVideoSessionWatchedTimeSinceAd': Math.floor(Math.random() * 1000000) / 1000,
                        'yandexJSPlayerApiSavedSingleVideoSessionWatchedTimeSinceAdUtcTimestamp': true,
                        // Yandex Music specific
                        'playerBrandingType': null,
                        'paywall-onloaded': true,
                        'gdpr-welcome': true
                    };
                    lsOverride[mapsmb] = new Map();
                    lsOverride = new _Proxy(lsOverride, _cloneInto({
                        get(that, name) {
                            if (name === mapsmb)
                                return that[name];
                            if (name === 'yandexJSPlayerApiSavedSingleVideoSessionWatchedTimeSinceAdUtcTimestamp')
                                return String((new Date()).getTime() / 1000 - that.yandexJSPlayerApiSavedSingleVideoSessionWatchedTimeSinceAd).slice(1, 14);
                            if (name === 'paywall-onloaded' || name === 'gdpr-welcome') {
                                let val = that[mapsmb].get(name);
                                if (!val) return val;
                                let obj = JSON.parse(val);
                                let dt = Math.floor((new Date()).getTime() + Math.random() * 3 * 86400000 + 2 * 86400000);
                                for (let itm in obj)
                                    obj[itm] = dt;
                                return JSON.stringify(obj);
                            }
                            return String(that[name]);
                        },
                        set(that, name, val) {
                            that[mapsmb].set(name, val);
                            return true;
                        }
                    }));
                    const _getItem = win.localStorage.getItem;
                    const _localStorage = new _Proxy(win.localStorage, _cloneInto({
                        get(that, name) {
                            if (name === 'getItem') {
                                return (it) => {
                                    //console.log('get', it, _getItem.call(that, it));
                                    if (it in lsOverride) {
                                        lsOverride[it] = _getItem.call(that, it);
                                        //console.log('override', lsOverride[it]);
                                        return lsOverride[it];
                                    }
                                    return _getItem.call(that, it);
                                };
                            }
                            if (name === 'removeItem' || name === 'setItem')
                                return that[name].bind(that);
                            if (name in lsOverride) {
                                lsOverride[name] = _localStorage[name];
                                _localStorage[name] = lsOverride[name];
                                return lsOverride[name];
                            }
                            return that[name];
                        }
                    }));
                    Object.defineProperty(win, 'localStorage', _cloneInto({
                        enumerable: true,
                        configurable: true,
                        get: new _Proxy(exportFunction(function localStorage() {
                            return _localStorage;
                        }, win), _cloneInto({}))
                    }));

                    // cookie cleaner
                    let yp_keepCookieParts = /\.(sp|ygo|ygu|fblkv2|skin)\./;
                    // ygo = city id; ygu = detect city automatically; fblkv2 = visible sections on the main page under search; skin = ligh/dark site skin
                    let _doc_proto = ('cookie' in _Document) ? _Document : Object.getPrototypeOf(_document);
                    let _cookie = Object.getOwnPropertyDescriptor(_doc_proto, 'cookie');
                    let blacklist = /^(mda=|ys=|yabs-|__|bltsr=)/;
                    if (_cookie) {
                        let _set_cookie = _bindCall(_cookie.set);
                        _cookie.set = function (value) {
                            if (blacklist.test(value)) {
                                // remove value, set expired
                                value = value.replace(/^([^=]+=)[^;]+/, '$1').replace(/(expires=)[\w\s\d,]+/, '$1Thu, 01 Jan 1970 00');
                                _console.trace('expire cookie', value.match(/^[^=]+/)[0]);
                            } else if (value.startsWith('yp=')) {
                                let parts = value.split(';');
                                let values = parts[0].split('#').filter(part => yp_keepCookieParts.test(part));
                                if (values.length)
                                    values[0] = values[0].replace(/^yp=/, '');
                                let res = `yp=${values.join('#')}`;
                                _console.trace(`set cookie ${res}, dropped ${parts[0].replace(res,'')}`);
                                parts[0] = res;
                                value = parts.join(';');
                            }
                            return _set_cookie(this, value);
                        };
                        Object.defineProperty(_doc_proto, 'cookie', _cookie);
                    }
                    // Remove blacklisted cookies on startup
                    GM.cookie.list({ url: location.href }).then(cookies => {
                        const remove = [];
                        for (const cookie of cookies) if (blacklist.test(`${cookie.name}=`)) remove.push(cookie);
                        for (const cookie of remove) {
                            console.log('Remove cookie', cookie.name);
                            GM.cookie.delete(cookie);
                        }
                    });
                }
            },
            dom: () => {
                { // Partially based on https://greasyfork.org/en/scripts/22737-remove-yandex-redirect
                    let count = 0,
                        lock = false;
                    const log = () => {
                        count++;
                        if (lock)
                            return;
                        setTimeout(() => {
                            _console.log('Removed tracking attributes from', count, 'links.');
                            count = 0;
                            lock = false;
                        }, 3333);
                        lock = true;
                    };
                    const selectors = (
                        'A[onmousedown*="/jsredir"],' +
                        'A[data-log-node],' +
                        'A[data-vdir-href],' +
                        'A[data-counter]'
                    );
                    const removeTrackingAttributes = (link) => {
                        _removeAttribute(link, 'onmousedown');
                        _removeAttribute(link, 'data-log-node');
                        // data-vdir-href
                        _removeAttribute(link, 'data-vdir-href');
                        _removeAttribute(link, 'data-orig-href');
                        // data-counter
                        _removeAttribute(link, 'data-counter');
                        _removeAttribute(link, 'data-bem');
                        log();
                    };
                    const removeTracking = (scope) => {
                        if (scope instanceof Element)
                            for (let link of scope.querySelectorAll(selectors))
                                removeTrackingAttributes(link);
                    };

                    removeTracking(_document);
                    (new MutationObserver(
                        function (ms) {
                            let m, node;
                            for (m of ms)
                                for (node of m.addedNodes)
                                    if (node instanceof HTMLAnchorElement && node.matches(selectors))
                                        removeTrackingAttributes(node);
                                    else
                                        removeTracking(node);
                        }
                    )).observe(_de, {
                        childList: true,
                        subtree: true
                    });
                }

                // Subdomain-specific Yandex scripts
                const subDomain = location.hostname.slice(0, location.hostname.indexOf('.'));

                // Function to attach an observer to monitor dynamic changes on the page
                const pageUpdateObserver = (func, obj, params) => {
                    if (obj)
                        (new MutationObserver(func))
                         .observe(obj, (params || {
                            childList: true,
                            subtree: true
                        }));
                };
                // Short name for parentNode.removeChild
                const remove = node => {
                    if (!node || !node.parentNode)
                        return false;
                    _console.log('Removed node.');
                    node.parentNode.removeChild(node);
                };
                // Short name for setAttribute style to display:none
                const hide = node => {
                    if (!node)
                        return false;
                    _console.log('Hid node.');
                    _setAttribute(node, 'style', 'display:none!important');
                };

                if (subDomain === 'music') {
                    const removeMusicAds = () => {
                        for (let node of _querySelectorAll('.ads-block'))
                            remove(node);
                    };
                    pageUpdateObserver(removeMusicAds, _querySelector('.sidebar'));
                    removeMusicAds();
                }

                if (subDomain === 'tv') {
                    const removeTVAds = () => {
                        const yadWord = /Яндекс.Директ/i;
                        for (let node of _querySelectorAll('div[class^="_"][data-reactid] > div'))
                            if (yadWord.test(node.textContent) || node.querySelector('iframe:not([src])')) {
                                if (node.offsetWidth) {
                                    let pad = _document.createElement('div');
                                    _setAttribute(pad, 'style', `width:${node.offsetWidth}px`);
                                    node.parentNode.appendChild(pad);
                                }
                                remove(node);
                            }
                    };
                    pageUpdateObserver(removeTVAds, _document.body);
                    removeTVAds();
                }

                const isSearch = /^\/(yand)?search[/?]/i.test(location.pathname);
                if (isSearch) {
                    const removeSearchAds = () => {
                        const adWords = /Реклама|Ad/i;
                        for (let node of _querySelectorAll('.serp-item'))
                            if (_getAttribute(node, 'role') === 'complementary' ||
                                adWords.test((node.querySelector('.label') || {}).textContent))
                                hide(node);
                    };
                    pageUpdateObserver(removeSearchAds, _querySelector('.main__content'));
                    removeSearchAds();
                }

                if (['mail', 'music', 'tv', 'yandexsport'].includes(subDomain) || isSearch) {
                    // Generic ads removal and fixes
                    for (let node of _querySelectorAll('.serp-header'))
                        node.style.marginTop = '0';
                    for (let node of _querySelectorAll(
                            '.serp-adv__head + .serp-item,' +
                            '#adbanner,' +
                            '.serp-adv,' +
                            '.b-spec-adv,' +
                            'div[class*="serp-adv__"]:not(.serp-adv__found):not(.serp-adv__displayed)'
                        )) remove(node);
                }
            }
        },

        'yap.ru': {
            other: 'yaplakal.com',
            now() {
                gardener('form > table[id^="p_row_"]:nth-of-type(2)', /member1438|Administration/);
                gardener('.icon-comments', /member1438|Administration|\/go\/\?http/, {
                    parent: 'tr',
                    siblings: -2
                });
            }
        },

        'yapx.ru': () => scriptLander(() => {
            selectiveCookies('adblock_state|adblock_views');
            nt.define('blockAdBlock', {
                on: nt.func(nt.proxy({}, 'blockAdBlock.on', nt.NULL), 'blockAdBlock.on'),
                check: nt.func(null, 'blockAdBlock.check')
            });
        }, selectiveCookies, nullTools),

        'znanija.com': () => scriptLander(() => {
            localStorage.clear();
        }, abortExecution)
    };

    // replace '.tld' in domain names, add alternative domain names if present and wrap functions into objects
    {
        const parts = _document.domain.split('.');
        const tld = /\.tld$/;
        const tldSubstitur = (() => {
            // stores TLD of current domain (simplistic TLD implementation)
            const last = parts.length - 1;
            const tld = ['', parts[last]];
            const secondLevel = [
                'biz', 'com', 'edu', 'gov', 'info', 'int', 'mil', 'net', 'org', 'pro'
            ];
            // add second from the end part of domain name as part of the TLD substitutor
            // when domain name consists of more than 2 parts and it looks like a part of TLD
            if ((parts[0] !== 'www' && parts.length > 2 || parts.length > 3) &&
                (parts[last - 1].length < 3 || secondLevel.includes(parts[last - 1])))
                tld.splice(0, 1, parts[last - 1]);
            return tld.join('.');
        })();
        for (let name in scripts) {
            if (typeof scripts[name] === 'function')
                scripts[name] = {
                    now: scripts[name]
                };
            if (name.endsWith('.tld'))
                scripts[name.replace(tld, tldSubstitur)] = scripts[name];
            for (let domain of (scripts[name].other && scripts[name].other.split(/,\s*/) || [])) {
                domain = domain.replace(tld, tldSubstitur);
                if (domain in scripts)
                    _console.log('Error in scripts list. Script for', name, 'replaced script for', domain);
                scripts[domain] = scripts[name];
            }
            delete scripts[name].other;
        }
        // scripts lookup
        const windowEvents = ['load', 'unload', 'beforeunload'];
        let domain;
        while (parts.length > 1) {
            domain = parts.join('.');
            if (domain in scripts) {
                for (let when in scripts[domain]) {
                    let script = scripts[domain][when];
                    if (when === 'now')
                        script();
                    else if (when === 'dom')
                        _document.addEventListener('DOMContentLoaded', script);
                    else if (windowEvents.includes(when))
                        win.addEventListener(when, scripts[domain][when]);
                    else
                        _document.addEventListener(when, scripts[domain][when]);
                }
            }
            parts.shift();
        }
    }

    // Batch script lander
    if (!skipLander)
        landScript(batchLand, batchPrepend);

    { // JS Fixes Tools Menu
        const incompatibleScriptHandler = !/^(Tamper|Violent)monkey$/.test(GM.info.scriptHandler);
        // Debug function, lists all unusual window properties
        const isNativeFunction = /^[^{]*\{[\s\r\n]*\[native\scode\][\s\r\n]*\}$/;
        const getStrangeObjectsList = () => {
            _console.group('Window strangers list');
            const _skip = 'frames/self/window/webkitStorageInfo'.split('/');
            for (let n of Object.getOwnPropertyNames(win))
                try {
                    let val = win[n];
                    if (val && !_skip.includes(n) && (win !== window && val !== window[n] || win === window) &&
                        (typeof val !== 'function' || typeof val === 'function' && !isNativeFunction.test(_toString(val))))
                        _console.log(`${n} =`, val);
                } catch (e) {
                    _console.log(n, 'returns error on read', e);
                }
            _console.groupEnd('Window strangers list');
        };

        const lines = {
            linked: [],
            MenuOptions: {
                eng: 'Options',
                ukr: 'Налаштування',
                rus: 'Настройки'
            },
            MenuCompatibilityWarning: {
                eng: 'is not supported',
                ukr: 'не підтримується',
                rus: 'не поддерживается'
            },
            langs: {
                eng: 'English',
                ukr: 'Українська',
                rus: 'Русский'
            },
            sObjBtn: {
                eng: 'List unusual “window” properties',
                ukr: 'Вивести нестандартні властивості «window»',
                rus: 'Вывести нестандартные свойства «window»'
            },
            HeaderTools: {
                eng: 'Tools',
                ukr: 'Інструменти',
                rus: 'Инструменты'
            },
            HeaderOptions: {
                eng: 'Options',
                ukr: 'Налаштування',
                rus: 'Настройки'
            },
            AccessStatisticsLabel: {
                eng: 'Display stubs access statistics and JSON filter',
                ukr: 'Відображати статистику запитів до заглушок та JSON фільтра',
                rus: 'Выводить статистику запросов к заглушкам и JSON фильтра'
            },
            AbortExecutionStatisticsLabel: {
                eng: 'Display abort execution statistics',
                ukr: 'Відображати статистику переривання виконання скриптів',
                rus: 'Выводить статистику прерывания исполнения скриптов'
            },
            LogAttachedCSSLabel: {
                eng: 'Log CSS attached to a page',
                ukr: 'Журналювати CSS додані на сторінку',
                rus: 'Журналировать CSS добавленные на страницу'
            },
            LogAdditionalInfoLabel: {
                eng: 'Display additional logs (when available)',
                ukr: 'Додаткове журналування (якщо є)',
                rus: "Дополнительное журналирование (когда доступно)"
            },
            BlockNotificationPermissionRequestsLabel: {
                eng: 'Block requests to "Show Notifications" on sites',
                ukr: 'Блокувати запити «Показувати Повідомлення» на сайтах',
                rus: 'Блокировать запросы «Показывать Уведомления» на сайтах'
            },
            ShowScriptHandlerCompatibilityWarningLabel: {
                eng: 'Show compatibility warning in menu next to Options',
                ukr: 'Відображати попередження про сумісність у меню поруч із Налаштуваннями',
                rus: 'Отображать предупреждение о совместимости в меню рядом с Настройками'
            },
            DisableTMContextMenuLabel: {
                eng: [
                    'To hide “Tampermonkey” in context menu please open “Dashboard” from extension\'s menu,',
                    'select “Settings” tab, switch “Config mode” to “Advanced”, navigate to “Context Menu” section',
                    'and disable “Userscript menu commands” option. Additionally, make sure “Inject mode”',
                    'in “Experimental” section is set to “Instant”.'
                ].join(' '),
                ukr: [
                    'Для приховання "Tampermonkey" у контекстному меню будь ласка, відкрийте «Панель упарвлення» з меню розширення,',
                    'перейдіть на вкладку «Налаштування», переключіть «Режим конфігурації» на «Просунутий», знайдіть секцію «Context Menu»',
                    'і вимкніть опцію «Userscript menu commands». Також переконайтеся, що «Режим вбудовування» в секції',
                    '«Експериментально» встановлений на «Миттєвий».',
                ].join(' '),
                rus: [
                    'Для скрытия "Tampermonkey" в контекстном меню пожалуйста откройте «Панель упарвления» из меню расширения,',
                    'перейдите на вкладку «Настройки», переключите «Режим конфигурации» на «Продвинутый», найдите секцию «Context Menu»',
                    'и выключите опцию «Userscript menu commands». Также убедитесь, что «Режим встраивания» в секции',
                    '«Экспериментально» установлен на «Мгновенный».',
                ].join(' ')
            },
            reg(el, name) {
                this[name].link = el;
                this.linked.push(name);
            },
            setLang(lang = 'eng') {
                for (let name of this.linked) {
                    const el = this[name].link;
                    const label = this[name][lang];
                    el.textContent = label;
                }
                this.langs.link.value = lang;
                jsf.Lang = lang;
            }
        };

        const _createTextNode = _Document.createTextNode.bind(_document);
        const createOptionsWindow = () => {
            const root = _createElement('div'),
                shadow = _attachShadow ? _attachShadow(root, {
                    mode: 'closed'
                }) : root,
                overlay = _createElement('div'),
                inner = _createElement('div');

            overlay.id = 'overlay';
            overlay.appendChild(inner);
            shadow.appendChild(overlay);

            inner.id = 'inner';
            inner.br = function appendBreakLine() {
                return this.appendChild(_createElement('br'));
            };

            createStyle({
                'h2': {
                    margin_top: 0
                },
                'h2, h3': {
                    margin_block_end: '0.5em'
                },
                'div, button, select, input': {
                    font_family: 'Helvetica, Arial, sans-serif',
                    font_size: '12pt'
                },
                'button': {
                    background: 'linear-gradient(to bottom, #f0f0f0 5%, #c0c0c0 100%)',
                    border_radius: '3px',
                    border: '1px solid #a1a1a1',
                    color: '#000000',
                    text_shadow: '0px 1px 0px #d4d4d4'
                },
                'button:hover': {
                    background: 'linear-gradient(to bottom, #c0c0c0 5%, #f0f0f0 100%)'
                },
                'button:active': {
                    position: 'relative',
                    top: '1px'
                },
                'select': {
                    border: '1px solid darkgrey',
                    border_radius: '0px 0px 5px 5px',
                    border_top: '0px'
                },
                'button:focus, select:focus': {
                    outline: 'none'
                },
                '#overlay': {
                    position: 'fixed',
                    top: 0,
                    left: 0,
                    bottom: 0,
                    right: 0,
                    background: 'rgba(0,0,0,0.65)',
                    z_index: 2147483647 // Highest z-index: Math.pow(2, 31) - 1
                },
                '#inner': {
                    background: 'whitesmoke',
                    color: 'black',
                    padding: '1.5em 1em 1.5em 1em',
                    max_width: '65ch',
                    position: 'absolute',
                    top: '50%',
                    left: '50%',
                    transform: 'translate(-50%, -50%)',
                    border: '1px solid darkgrey',
                    border_radius: '5px'
                },
                '#closeOptionsButton': {
                    float: 'right',
                    transform: 'translate(1em, -1.5em)',
                    border: 0,
                    border_radius: 0,
                    background: 'none',
                    box_shadow: 'none'
                },
                '#selectLang': {
                    float: 'right',
                    transform: 'translate(0, -1.5em)'
                },
                '.optionsLabel': {
                    padding_left: '1.5em',
                    text_indent: '-1em',
                    display: 'block'
                },
                '.optionsCheckbox': {
                    left: '-0.25em',
                    width: '1em',
                    height: '1em',
                    padding: 0,
                    margin: 0,
                    position: 'relative',
                    vertical_align: 'middle'
                },
                '@media (prefers-color-scheme: dark)': {
                    '#inner': {
                        background_color: '#292a2d',
                        color: 'white',
                        border: '1px solid #1a1b1e'
                    },
                    'input': {
                        filter: 'invert(100%)'
                    },
                    'button': {
                        background: 'linear-gradient(to bottom, #575757 5%, #303030 100%)',
                        border_color: '#575757',
                        color: '#f0f0f0',
                        text_shadow: '0px 1px 0px #171717'
                    },
                    'button:hover': {
                        background: 'linear-gradient(to bottom, #303030 5%, #575757 100%)'
                    },
                    'select': {
                        background_color: '#303030',
                        color: '#f0f0f0',
                        border: '1px solid #1a1b1e',
                        border_radius: '0px 0px 5px 5px',
                        border_top: '0px'
                    },
                    '#overlay': {
                        background: 'rgba(0,0,0,.85)',
                    }
                }
            }, {
                root: shadow,
                protect: false
            });

            // components
            function createCheckbox(name) {
                const checkbox = _createElement('input');
                const label = _createElement('label');
                checkbox.type = 'checkbox';
                checkbox.classList.add('optionsCheckbox');
                checkbox.checked = jsf[name];
                checkbox.onclick = e => {
                    jsf[name] = e.target.checked;
                    return true;
                };
                label.classList.add('optionsLabel');
                label.appendChild(checkbox);
                const text = _createTextNode('');
                label.appendChild(text);
                Object.defineProperty(label, 'textContent', _cloneInto({
                    set(title) {
                        text.textContent = title;
                    }
                }));
                return label;
            }

            // language & close
            const closeBtn = _createElement('button');
            closeBtn.onclick = () => _removeChild(root);
            closeBtn.textContent = '\u2715';
            closeBtn.id = 'closeOptionsButton';
            inner.appendChild(closeBtn);

            overlay.addEventListener('click', e => {
                if (e.target === overlay) {
                    _removeChild(root);
                    e.preventDefault();
                }
                e.stopPropagation();
            }, false);

            const selectLang = _createElement('select');
            for (let name in lines.langs) {
                const langOption = _createElement('option');
                langOption.value = name;
                langOption.innerText = lines.langs[name];
                selectLang.appendChild(langOption);
            }
            selectLang.id = 'selectLang';
            lines.langs.link = selectLang;
            inner.appendChild(selectLang);

            selectLang.onchange = e => {
                const lang = e.target.value;
                lines.setLang(lang);
            };

            // fill options form
            const header = _createElement('h2');
            header.textContent = 'RU AdList JS Fixes';
            inner.appendChild(header);

            lines.reg(inner.appendChild(_createElement('h3')), 'HeaderTools');

            const sObjBtn = _createElement('button');
            sObjBtn.onclick = getStrangeObjectsList;
            sObjBtn.textContent = '';
            lines.reg(inner.appendChild(sObjBtn), 'sObjBtn');

            lines.reg(inner.appendChild(_createElement('h3')), 'HeaderOptions');

            lines.reg(inner.appendChild(createCheckbox('AccessStatistics')), 'AccessStatisticsLabel');
            lines.reg(inner.appendChild(createCheckbox('AbortExecutionStatistics')), 'AbortExecutionStatisticsLabel');
            lines.reg(inner.appendChild(createCheckbox('LogAttachedCSS')), 'LogAttachedCSSLabel');
            lines.reg(inner.appendChild(createCheckbox('LogAdditionalInfo')), 'LogAdditionalInfoLabel');

            inner.appendChild(_createElement('br'));
            lines.reg(inner.appendChild(createCheckbox('BlockNotificationPermissionRequests')), 'BlockNotificationPermissionRequestsLabel');

            if (GM.info.scriptHandler === 'Tampermonkey') {
                inner.appendChild(_createElement('br'));
                lines.reg(inner.appendChild(_createElement('label')), 'DisableTMContextMenuLabel');
            }

            if (incompatibleScriptHandler) {
                inner.appendChild(_createElement('br'));
                lines.reg(inner.appendChild(createCheckbox('ShowScriptHandlerCompatibilityWarning')), 'ShowScriptHandlerCompatibilityWarningLabel');
            }

            lines.setLang(jsf.Lang);

            return root;
        };

        let optionsWindow;
        GM_registerMenuCommand(lines.MenuOptions[jsf.Lang], () => _appendChild(optionsWindow = optionsWindow || createOptionsWindow()));
        // add warning to script menu for non-Tampermonkey users
        if (jsf.ShowScriptHandlerCompatibilityWarning && incompatibleScriptHandler)
            GM_registerMenuCommand(`${GM.info.scriptHandler} ${lines.MenuCompatibilityWarning[jsf.Lang]}`, () => {
                win.open(`https://greasyfork.org/${jsf.Lang.slice(0,2)}/scripts/19993-ru-adlist-js-fixes#additional-info`);
            });
    }
})();