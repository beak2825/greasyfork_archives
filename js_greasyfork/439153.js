var PoopJs;
(function (PoopJs) {
    let PromiseExtension;
    (function (PromiseExtension) {
        /**
         * Creates unwrapped promise
         */
        function empty() {
            let resolve;
            let reject;
            let p = new Promise((r, j) => {
                resolve = r;
                reject = j;
            });
            p.resolve = p.r = resolve;
            p.reject = p.j = reject;
            return p;
        }
        PromiseExtension.empty = empty;
        async function frame(n = 1) {
            while (--n > 0) {
                await new Promise(requestAnimationFrame);
            }
            return new Promise(requestAnimationFrame);
        }
        PromiseExtension.frame = frame;
    })(PromiseExtension = PoopJs.PromiseExtension || (PoopJs.PromiseExtension = {}));
})(PoopJs || (PoopJs = {}));
/// <reference path="./Promise.ts" />
var PoopJs;
(function (PoopJs) {
    let ArrayExtension;
    (function (ArrayExtension) {
        async function pmap(mapper, threads = 5) {
            if (!(threads > 0))
                throw new Error();
            let tasks = this.map((e, i, a) => [e, i, a]);
            let results = Array(tasks.length);
            let anyResolved = PoopJs.PromiseExtension.empty();
            let freeThreads = threads;
            async function runTask(task) {
                try {
                    return await mapper(...task);
                }
                catch (err) {
                    return err;
                }
            }
            async function run(task) {
                freeThreads--;
                results[task[1]] = await runTask(task);
                freeThreads++;
                let oldAnyResolved = anyResolved;
                anyResolved = PoopJs.PromiseExtension.empty();
                oldAnyResolved.r(undefined);
            }
            for (let task of tasks) {
                if (freeThreads == 0) {
                    await anyResolved;
                }
                run(task);
            }
            while (freeThreads < threads) {
                await anyResolved;
            }
            return results;
        }
        ArrayExtension.pmap = pmap;
        function map(length, mapper = i => i) {
            return this(length).fill(0).map((e, i, a) => mapper(i));
        }
        ArrayExtension.map = map;
        function vsort(mapper, sorter = (a, b) => a - b) {
            let theSorter = typeof sorter == 'function' ? sorter : (a, b) => b - a;
            return this
                .map((e, i, a) => ({ e, v: mapper(e, i, a) }))
                .sort((a, b) => theSorter(a.v, b.v, a.e, b.e))
                .map(e => e.e);
        }
        ArrayExtension.vsort = vsort;
        const empty = PoopJs.PromiseExtension.empty;
        function pmap2raw(data) {
            data.result ??= Array(data.source.length);
            data.requests = data.result.map(() => empty());
            data.threads ??= 5;
            data.window ??= Infinity;
            data.completed = 0;
            data.length = data.source.length;
            data.activeThreads = 0;
            data.lastStarted = 0;
            if (data.threads <= 0)
                throw new Error();
            let allDone = empty();
            data.then = allDone.then.bind(allDone);
            let anyResolved = empty();
            async function runOne(i) {
                data.activeThreads++;
                data.beforeStart?.(data.source[i], i, data.source, data);
                data.lastStarted = i;
                let v = await data.mapper(data.source[i], i, data.source, data).catch(e => e);
                data.afterComplete?.(data.source[i], i, data.source, data);
                data.activeThreads--;
                anyResolved.resolve(null);
            }
            async function run() {
                for (let i = 0; i < data.length; i++) {
                    while (data.activeThreads < data.threads)
                        await anyResolved;
                    anyResolved = empty();
                    runOne(i);
                }
            }
            return data;
        }
    })(ArrayExtension = PoopJs.ArrayExtension || (PoopJs.ArrayExtension = {}));
})(PoopJs || (PoopJs = {}));
var PoopJs;
(function (PoopJs) {
    let DateNowHack;
    (function (DateNowHack) {
        DateNowHack.speedMultiplier = 1;
        DateNowHack.deltaOffset = 0;
        DateNowHack.startRealtime = 0;
        DateNowHack.startTime = 0;
        // export let speedMultiplier = 1;
        DateNowHack.performanceDeltaOffset = 0;
        DateNowHack.performanceStartRealtime = 0;
        DateNowHack.performanceStartTime = 0;
        DateNowHack.usedMethods = {
            date: true,
            performance: true,
        };
        function toFakeTime(realtime) {
            if (!DateNowHack.usedMethods.date)
                return realtime;
            return Math.floor((realtime - DateNowHack.startRealtime) * DateNowHack.speedMultiplier + DateNowHack.startTime + DateNowHack.deltaOffset);
        }
        DateNowHack.toFakeTime = toFakeTime;
        function toPerformanceFakeTime(realtime) {
            if (!DateNowHack.usedMethods.performance)
                return realtime;
            return (realtime - DateNowHack.performanceStartRealtime) * DateNowHack.speedMultiplier
                + DateNowHack.performanceStartTime + DateNowHack.performanceDeltaOffset;
        }
        DateNowHack.toPerformanceFakeTime = toPerformanceFakeTime;
        DateNowHack.bracketSpeeds = [0.05, 0.25, 1, 2, 5, 10, 20, 60, 120];
        function speedhack(speed) {
            activate();
            activatePerformance();
            DateNowHack.speedMultiplier = speed;
            location.hash = speed + '';
        }
        DateNowHack.speedhack = speedhack;
        function timejump(seconds) {
            activate();
            activatePerformance();
            DateNowHack.deltaOffset += seconds * 1000;
        }
        DateNowHack.timejump = timejump;
        function switchSpeedhack(dir) {
            let currentIndex = DateNowHack.bracketSpeeds.indexOf(DateNowHack.speedMultiplier);
            if (currentIndex == -1)
                currentIndex = DateNowHack.bracketSpeeds.indexOf(1);
            let newSpeed = DateNowHack.bracketSpeeds[currentIndex + dir];
            if (newSpeed == undefined)
                return false;
            speedhack(newSpeed);
        }
        DateNowHack.switchSpeedhack = switchSpeedhack;
        function onkeydown(event) {
            if (event.code == 'BracketLeft') {
                switchSpeedhack(-1);
            }
            if (event.code == 'BracketRight') {
                switchSpeedhack(1);
            }
        }
        function bindBrackets(mode = 'on') {
            removeEventListener('keydown', onkeydown);
            if (mode == 'on') {
                addEventListener('keydown', onkeydown);
            }
        }
        DateNowHack.bindBrackets = bindBrackets;
        DateNowHack.activated = false;
        function activate() {
            Date._now ??= Date.now;
            Date.prototype._getTime ??= Date.prototype.getTime;
            DateNowHack.startTime = Date.now();
            DateNowHack.startRealtime = Date._now();
            DateNowHack.deltaOffset = 0;
            // console.log(Date.now(), )
            // debugger;
            Date.now = () => toFakeTime(Date._now());
            Date.prototype.getTime = function () {
                return this._t ??= toFakeTime(this._getTime());
            };
            Date.prototype.valueOf = function () {
                return this.getTime();
            };
            DateNowHack.activated = true;
        }
        DateNowHack.performanceActivated = false;
        function activatePerformance() {
            performance._now ??= performance.now;
            DateNowHack.performanceStartTime = performance.now();
            DateNowHack.performanceStartRealtime = performance._now();
            DateNowHack.performanceDeltaOffset = 0;
            performance.now = () => toPerformanceFakeTime(performance._now());
            DateNowHack.performanceActivated = true;
        }
    })(DateNowHack = PoopJs.DateNowHack || (PoopJs.DateNowHack = {}));
})(PoopJs || (PoopJs = {}));
var PoopJs;
(function (PoopJs) {
    let ObjectExtension;
    (function (ObjectExtension) {
        function defineValue(o, p, value) {
            if (typeof p == 'function') {
                [p, value] = [p.name, p];
            }
            Object.defineProperty(o, p, {
                value,
                configurable: true,
                enumerable: false,
                writable: true,
            });
            return o;
        }
        ObjectExtension.defineValue = defineValue;
        function defineGetter(o, p, get) {
            if (typeof p == 'function') {
                [p, get] = [p.name, p];
            }
            Object.defineProperty(o, p, {
                get,
                configurable: true,
                enumerable: false,
            });
            return o;
        }
        ObjectExtension.defineGetter = defineGetter;
        function map(o, mapper) {
            let entries = Object.entries(o);
            return Object.fromEntries(entries.map(([k, v]) => [k, mapper(v, k, o)]));
        }
        ObjectExtension.map = map;
    })(ObjectExtension = PoopJs.ObjectExtension || (PoopJs.ObjectExtension = {}));
})(PoopJs || (PoopJs = {}));
var PoopJs;
(function (PoopJs) {
    let QuerySelector;
    (function (QuerySelector) {
        let WindowQ;
        (function (WindowQ) {
            function q(selector) {
                return (this?.document ?? document).querySelector(selector);
            }
            WindowQ.q = q;
            function qq(selector) {
                return [...(this?.document ?? document).querySelectorAll(selector)];
            }
            WindowQ.qq = qq;
        })(WindowQ = QuerySelector.WindowQ || (QuerySelector.WindowQ = {}));
        let DocumentQ;
        (function (DocumentQ) {
            function q(selector) {
                return this.documentElement.querySelector(selector);
            }
            DocumentQ.q = q;
            function qq(selector) {
                return [...this.documentElement.querySelectorAll(selector)];
            }
            DocumentQ.qq = qq;
        })(DocumentQ = QuerySelector.DocumentQ || (QuerySelector.DocumentQ = {}));
        let ElementQ;
        (function (ElementQ) {
            function q(selector) {
                return this.querySelector(selector);
            }
            ElementQ.q = q;
            function qq(selector) {
                return [...this.querySelectorAll(selector)];
            }
            ElementQ.qq = qq;
        })(ElementQ = QuerySelector.ElementQ || (QuerySelector.ElementQ = {}));
    })(QuerySelector = PoopJs.QuerySelector || (PoopJs.QuerySelector = {}));
    let ElementExtension;
    (function (ElementExtension) {
        function emit(type, detail) {
            let event = new CustomEvent(type, {
                bubbles: true,
                detail,
            });
            this.dispatchEvent(event);
        }
        ElementExtension.emit = emit;
        function appendTo(parent) {
            if (typeof parent == 'string') {
                parent = document.querySelector(parent);
            }
            parent.append(this);
            return this;
        }
        ElementExtension.appendTo = appendTo;
    })(ElementExtension = PoopJs.ElementExtension || (PoopJs.ElementExtension = {}));
})(PoopJs || (PoopJs = {}));
var PoopJs;
(function (PoopJs) {
    let Elm;
    (function (Elm) {
        const elmRegex = new RegExp([
            /^(?<tag>[\w-]+)/,
            /#(?<id>[\w-]+)/,
            /\.(?<class>[\w-]+)/,
            /\[(?<attr1>[\w-]+)\]/,
            /\[(?<attr2>[\w-]+)=(?!['"])(?<val2>[^\]]*)\]/,
            /\[(?<attr3>[\w-]+)="(?<val3>(?:[^"]|\\")*)"\]/,
            /\[(?<attr4>[\w-]+)="(?<val4>(?:[^']|\\')*)"\]/,
        ].map(e => e.source).join('|'), 'g');
        /** if `elm` should disallow listeners not existing as `on * ` property on the element */
        Elm.allowOnlyExistingListeners = true;
        /** if `elm` should allow overriding `on * ` listeners if multiple of them are provided */
        Elm.allowOverrideOnListeners = false;
        function elm(selector = '', ...children) {
            if (selector.replaceAll(elmRegex, '') != '') {
                throw new Error(`invalid selector: ${selector} `);
            }
            let element = document.createElement('div');
            // let tag = '';
            // let firstMatch = false;
            for (let match of selector.matchAll(elmRegex)) {
                if (match.groups.tag) {
                    // if (tag && match.groups.tag != tag) {
                    // 	throw new Error(`selector has two different tags at once : <${tag}> and <${match.groups.tag}>`);
                    // }
                    // tag = match.groups.tag;
                    // if (!firstMatch) return elm(tag + selector, ...children);
                    element = document.createElement(match.groups.tag);
                }
                else if (match.groups.id) {
                    element.id = match.groups.id;
                }
                else if (match.groups.class) {
                    element.classList.add(match.groups.class);
                }
                else if (match.groups.attr1) {
                    element.setAttribute(match.groups.attr1, "true");
                }
                else if (match.groups.attr2) {
                    element.setAttribute(match.groups.attr2, match.groups.val2);
                }
                else if (match.groups.attr3) {
                    element.setAttribute(match.groups.attr3, match.groups.val3.replace(/\\"/g, '"'));
                }
                else if (match.groups.attr4) {
                    element.setAttribute(match.groups.attr4, match.groups.val4.replace(/\\'/g, '\''));
                }
                // firstMatch = false;
            }
            for (let listener of children.filter(e => typeof e == 'function')) {
                let name = listener.name;
                if (!name)
                    name = (listener + '').match(/\b(?!function\b)\w+/)[0];
                if (!name)
                    throw new Error('trying to bind unnamed function');
                if (name.startsWith('bound '))
                    name = name.slice('bound '.length);
                if (name.startsWith('on')) {
                    if (!element.hasOwnProperty(name))
                        throw new Error(`< ${element.tagName.toLowerCase()}> does not have "${name}" listener`);
                    if (!Elm.allowOverrideOnListeners && element[name])
                        throw new Error('overriding `on * ` listeners is disabled');
                    element[name] = listener;
                }
                else {
                    if (Elm.allowOnlyExistingListeners && element['on' + name] === undefined)
                        throw new Error(`<${element.tagName.toLowerCase()}> does not have "on'${name}'" listener`);
                    element.addEventListener(name, listener);
                }
            }
            element.append(...children.filter(e => typeof e != 'function'));
            return element;
        }
        Elm.elm = elm;
        function qOrElm(selector, parent) {
            if (typeof parent == 'string') {
                parent = document.querySelector(parent);
                if (!parent)
                    throw new Error('failed to find parent element');
            }
            if (selector.includes('>')) {
                let parentSelector = selector.split('>').slice(0, -1).join('>');
                selector = selector.split('>').pop();
                parent = (parent || document).querySelector(parentSelector);
                if (!parent)
                    throw new Error('failed to find parent element');
            }
            let child = (parent || document).querySelector(selector);
            if (child)
                return child;
            child = elm(selector);
            parent?.append(child);
            return child;
        }
        Elm.qOrElm = qOrElm;
    })(Elm = PoopJs.Elm || (PoopJs.Elm = {}));
})(PoopJs || (PoopJs = {}));
var PoopJs;
(function (PoopJs) {
    PoopJs.debug = false;
    let etc;
    (function (etc) {
        function keybind(key, fn) {
            let code = key.length == 1 ? 'Key' + key.toUpperCase() : key;
            function onkeydown(event) {
                if (event.code == code) {
                    fn(event);
                }
            }
            addEventListener('keydown', onkeydown);
            return () => removeEventListener('keydown', onkeydown);
        }
        etc.keybind = keybind;
        async function fullscreen(on) {
            let central = PoopJs.ImageScrollingExtension.imageScrollingActive && PoopJs.ImageScrollingExtension.getCentralImg();
            if (!document.fullscreenElement) {
                if (on == false)
                    return;
                await document.documentElement.requestFullscreen().catch(() => { });
            }
            else {
                if (on == true)
                    return;
                await document.exitFullscreen().catch(() => { });
            }
            if (central) {
                central.scrollIntoView();
            }
            return !!document.fullscreenElement;
        }
        etc.fullscreen = fullscreen;
        function anybind(keyOrEvent, fn) {
            if (typeof keyOrEvent == "number")
                keyOrEvent = keyOrEvent + '';
            // detect if it is event
            let isEvent = window.hasOwnProperty('on' + keyOrEvent);
            if (isEvent) {
                addEventListener(keyOrEvent, fn);
                return;
            }
            // parse key code
            if (!isNaN(parseInt(keyOrEvent))) {
                keyOrEvent = `Digit${keyOrEvent}`;
            }
            else if (keyOrEvent.length == 1) {
                keyOrEvent = `Key${keyOrEvent.toUpperCase()}`;
            }
            addEventListener('keydown', ev => {
                if (ev.code != keyOrEvent)
                    return;
                fn(ev);
            });
        }
        etc.anybind = anybind;
        function fullscreenOn(key) {
            if (key == 'scroll') {
                addEventListener('scroll', () => fullscreen(true));
                return;
            }
            return keybind(key, () => fullscreen());
        }
        etc.fullscreenOn = fullscreenOn;
        function fIsForFullscreen() {
            keybind('F', () => fullscreen());
        }
        etc.fIsForFullscreen = fIsForFullscreen;
        function hashCode(value) {
            value ??= this;
            let hash = 0;
            for (let c of value) {
                hash = ((hash << 5) - hash) + c.charCodeAt(0);
                hash = hash & hash;
            }
            return hash;
        }
        etc.hashCode = hashCode;
        function init() {
            // String.prototype.hashCode = hashCode;
        }
        etc.init = init;
        function currentScriptHash() {
            return hashCode(document.currentScript.innerHTML);
        }
        etc.currentScriptHash = currentScriptHash;
        function reloadOnCurrentScriptChanged(scriptName = location.hostname + '.ujs') {
            let scriptId = `reloadOnCurrentScriptChanged_${scriptName}`;
            let scriptHash = currentScriptHash() + '';
            localStorage.setItem(scriptId, scriptHash);
            addEventListener('focus', () => {
                if (localStorage.getItem(scriptId) != scriptHash) {
                    location.reload();
                }
            });
        }
        etc.reloadOnCurrentScriptChanged = reloadOnCurrentScriptChanged;
        etc.fastScroll = function (speed = 0.25) {
            if (etc.fastScroll.active)
                etc.fastScroll.off();
            etc.fastScroll.active = true;
            etc.fastScroll.speed = speed;
            function onwheel(event) {
                if (event.defaultPrevented)
                    return;
                if (event.ctrlKey || event.shiftKey)
                    return;
                scrollBy(0, -Math.sign(event.wheelDeltaY) * innerHeight * etc.fastScroll.speed);
                event.preventDefault();
            }
            addEventListener('mousewheel', onwheel, { passive: false });
            etc.fastScroll.off = () => {
                etc.fastScroll.active = false;
                removeEventListener('mousewheel', onwheel);
            };
        };
        etc.fastScroll.active = false;
        etc.fastScroll.off = () => { };
        function onraf(f) {
            let loop = true;
            void async function () {
                while (loop) {
                    await Promise.frame();
                    f();
                }
            }();
            return () => { loop = false; };
        }
        etc.onraf = onraf;
        let resizeObserver;
        let resizeListeners = [];
        let previousBodyHeight = 0;
        function onheightchange(f) {
            if (!resizeObserver) {
                previousBodyHeight = document.body.clientHeight;
                resizeObserver = new ResizeObserver(entries => {
                    for (let e of entries) {
                        if (e.target != document.body)
                            continue;
                        let newBodyHeight = e.target.clientHeight;
                        for (let f of resizeListeners) {
                            f(newBodyHeight, previousBodyHeight);
                        }
                        previousBodyHeight = newBodyHeight;
                    }
                });
                resizeObserver.observe(document.body);
            }
            resizeListeners.push(f);
            return function removeListener() {
                resizeListeners.splice(resizeListeners.indexOf(f));
            };
        }
        etc.onheightchange = onheightchange;
        Object.defineProperty(etc, 'kds', {
            configurable: true,
            get() {
                let kds = initKds();
                Object.defineProperty(etc, 'kds', { value: kds });
                return kds;
            },
        });
        Object.defineProperty(PoopJs, 'kds', {
            get: () => etc.kds,
            set: (v) => Object.assign(etc.kds, v),
        });
        function generateKdsCodes(e) {
            let basePrefix = `${e.shiftKey ? '<' : ''}${e.ctrlKey ? '^' : ''}${e.altKey ? '>' : ''}`;
            let baseCode = e.code
                ? e.code.replace(/Key|Digit|Arrow|Left|Right/, '')
                : ['LMB', 'RMB', 'MMB'][e.button];
            let extraCode = e.code
                ? baseCode.replace('Control', 'Ctrl')
                : baseCode; // ['Left', 'Right', 'Middle'][e.button];
            let rawCode = e.code ?? baseCode;
            let keyCode = e.key ?? baseCode;
            let extraPrefix = basePrefix.replace(baseCode == 'Shift' ? '<' : baseCode == 'Control' ? '^' : baseCode == 'Alt' ? '>' : '', '');
            let codes = [baseCode, extraCode, rawCode, keyCode].flatMap(c => [basePrefix, extraPrefix].map(p => p + c));
            //.flatMap(e => [e, e.toUpperCase(), e.toLowerCase()]);
            codes.push(e.code ? 'key' : 'mouse');
            codes.push('any');
            return Array.from(new Set(codes));
        }
        function kdsListener(e) {
            let codes = generateKdsCodes(e);
            Object.assign(e, { _codes: codes });
            for (let c of codes) {
                let listener = etc.kds[c];
                if (typeof listener == 'string') {
                    q(listener).click();
                }
                else if (typeof listener == 'function') {
                    etc.kds[c](e);
                }
            }
        }
        etc.kdsListener = kdsListener;
        function initKds() {
            addEventListener('keydown', kdsListener);
            addEventListener('mousedown', kdsListener);
            return {};
        }
        etc._kbdInited = false;
        function makeKds(kds) {
            return Object.assign(etc.kds, kds);
        }
        etc.makeKds = makeKds;
    })(etc = PoopJs.etc || (PoopJs.etc = {}));
})(PoopJs || (PoopJs = {}));
// interface String {
// 	hashCode: () => number;
// }
var PoopJs;
(function (PoopJs) {
    function normalizeDeltaTime(maxAge) {
        if (typeof maxAge == 'number')
            return maxAge;
        if (typeof maxAge != 'string')
            return Infinity;
        const aToM = { s: 1e3, h: 3600e3, d: 24 * 3600e3, w: 7 * 24 * 3600e3, y: 365 * 24 * 3600e3 };
        let n = parseFloat(maxAge);
        let m = aToM[maxAge[maxAge.length - 1]];
        if (n != n || !m)
            throw new Error('invalid deltaTime');
        return n * m;
    }
    PoopJs.normalizeDeltaTime = normalizeDeltaTime;
    let FetchExtension;
    (function (FetchExtension) {
        FetchExtension.defaults = { credentials: 'include' };
        FetchExtension.cache = null;
        async function openCache() {
            if (FetchExtension.cache)
                return FetchExtension.cache;
            FetchExtension.cache = await caches.open('fetch');
            return FetchExtension.cache;
        }
        function toDur(dt) {
            dt = normalizeDeltaTime(dt);
            if (dt > 1e10)
                dt = Date.now() - dt;
            let split = (n, d) => [n % d, ~~(n / d)];
            let to2 = (n) => (n + '').padStart(2, '0');
            var [ms, s] = split(dt, 1000);
            var [s, m] = split(s, 60);
            var [m, h] = split(m, 60);
            var [h, d] = split(h, 24);
            var [d, w] = split(d, 7);
            return w > 1e3 ? 'forever' : w ? `${w}w${d}d` : d ? `${d}d${to2(h)}h` : h + m ? `${to2(h)}:${to2(m)}:${to2(s)}` : `${s + ~~ms / 1000}s`;
        }
        function isStale(cachedAt, maxAge) {
            if (maxAge == null)
                return false;
            return Date.now() - cachedAt >= normalizeDeltaTime(maxAge);
        }
        FetchExtension.isStale = isStale;
        async function cached(url, init = {}) {
            let now = performance.now();
            let cache = await openCache();
            let response = await cache.match(url);
            if (response) {
                response.cachedAt = +response.headers.get('cached-at') || 0;
                if (!isStale(response.cachedAt, normalizeDeltaTime(init.maxAge))) {
                    PoopJs.debug && console.log(`Cached response: ${toDur(response.cachedAt)} < c:${toDur(init.maxAge)}`, url);
                    return response;
                }
                PoopJs.debug && console.log(`Stale response: ${toDur(response.cachedAt)} > c:${toDur(init.maxAge)}`, url);
            }
            response =
                !init.xml ? await fetch(url, { ...FetchExtension.defaults, ...init })
                    : await xmlResponse(url, init);
            if (response.ok) {
                response.cachedAt = Date.now();
                let clone = response.clone();
                let init2 = {
                    status: clone.status, statusText: clone.statusText,
                    headers: [['cached-at', `${response.cachedAt}`], ...clone.headers.entries()]
                };
                let resultResponse = new Response(clone.body, init2);
                cache.put(url, resultResponse);
                let dt = performance.now() - now;
                PoopJs.debug && console.log(`Loaded response: ${toDur(dt)} / c:${toDur(init.maxAge)}`, url);
            }
            else {
                PoopJs.debug && console.log(`Failed response: ${toDur(response.cachedAt)} / c:${toDur(init.maxAge)}`, url);
            }
            return response;
        }
        FetchExtension.cached = cached;
        async function cachedDoc(url, init = {}) {
            let response = await cached(url, init);
            let text = await response.text();
            let parser = new DOMParser();
            let doc = parser.parseFromString(text, 'text/html');
            let base = doc.createElement('base');
            base.href = url;
            doc.head.append(base);
            doc.cachedAt = response.cachedAt;
            return doc;
        }
        FetchExtension.cachedDoc = cachedDoc;
        async function doc(url, init = {}) {
            let response = await fetch(url, { ...FetchExtension.defaults, ...init });
            let text = await response.text();
            let parser = new DOMParser();
            let doc = parser.parseFromString(text, 'text/html');
            let base = doc.createElement('base');
            base.href = url;
            doc.head.append(base);
            doc.cachedAt = response.cachedAt;
            return doc;
        }
        FetchExtension.doc = doc;
        async function xmlResponse(url, init = {}) {
            let p = PoopJs.PromiseExtension.empty();
            let oReq = new XMLHttpRequest();
            oReq.onload = p.r;
            oReq.responseType = 'document';
            oReq.open("get", url, true);
            oReq.send();
            await p;
            if (oReq.responseType != 'document')
                throw new Error('FIXME');
            return new Response(oReq.responseXML.documentElement.outerHTML, init);
        }
        FetchExtension.xmlResponse = xmlResponse;
        async function json(url, init = {}) {
            return fetch(url, { ...FetchExtension.defaults, ...init }).then(e => e.json());
        }
        FetchExtension.json = json;
        async function clearCache() {
            FetchExtension.cache = null;
            return caches.delete('fetch');
        }
        FetchExtension.clearCache = clearCache;
        async function uncache(url) {
            let cache = await openCache();
            let d1 = cache.delete(url);
            let d2 = await idbDelete(url);
            return (await d1) || d2;
        }
        FetchExtension.uncache = uncache;
        async function isCached(url, options = {}) {
            if (options.indexedDb) {
                let dbJson = await idbGet(url);
                if (dbJson) {
                    return isStale(dbJson.cachedAt, normalizeDeltaTime(options.maxAge)) ? false : 'idb';
                }
                if (options.indexedDb == 'only')
                    return false;
            }
            let cache = await openCache();
            let response = await cache.match(url);
            if (!response)
                return false;
            if (options?.maxAge != null) {
                let cachedAt = +response.headers.get('cached-at') || 0;
                if (isStale(response.cachedAt, normalizeDeltaTime(options.maxAge))) {
                    return false;
                }
            }
            return true;
        }
        FetchExtension.isCached = isCached;
        async function cachedJson(url, init = {}) {
            if (init.indexedDb) {
                let dbJson = await idbGet(url);
                if (dbJson) {
                    if (!isStale(dbJson.cachedAt, init.maxAge)) {
                        PoopJs.ObjectExtension.defineValue(dbJson.data, 'cached', dbJson.cachedAt);
                        return dbJson.data;
                    }
                }
            }
            let response = await cached(url, init);
            let json = await response.json();
            if (!('cached' in json)) {
                PoopJs.ObjectExtension.defineValue(json, 'cached', response.cachedAt);
            }
            if (init.indexedDb) {
                idbPut(url, json, response.cachedAt);
            }
            return json;
        }
        FetchExtension.cachedJson = cachedJson;
        let _idbInstancePromise = null;
        let idbInstance = null;
        async function openIdb() {
            if (idbInstance)
                return idbInstance;
            if (await _idbInstancePromise) {
                return idbInstance;
            }
            let irq = indexedDB.open('fetch');
            irq.onupgradeneeded = event => {
                let db = irq.result;
                let store = db.createObjectStore('fetch', { keyPath: 'url' });
            };
            _idbInstancePromise = new Promise((r, j) => {
                irq.onsuccess = r;
                irq.onerror = j;
            }).then(() => irq.result, () => null);
            idbInstance = _idbInstancePromise = await _idbInstancePromise;
            if (!idbInstance)
                throw new Error('Failed to open indexedDB');
            return idbInstance;
        }
        async function idbClear() {
            throw new Error('TODO');
        }
        FetchExtension.idbClear = idbClear;
        async function idbGet(url) {
            let db = await openIdb();
            let t = db.transaction(['fetch'], 'readonly');
            let rq = t.objectStore('fetch').get(url);
            return new Promise(r => {
                rq.onsuccess = () => r(rq.result);
                rq.onerror = () => r(undefined);
            });
        }
        async function idbPut(url, data, cachedAt) {
            let db = await openIdb();
            let t = db.transaction(['fetch'], 'readwrite');
            let rq = t.objectStore('fetch').put({ url, data, cachedAt: cachedAt ?? +new Date() });
            return new Promise(r => {
                rq.onsuccess = () => r(rq.result);
                rq.onerror = () => r(undefined);
            });
        }
        async function idbDelete(url) {
            let db = await openIdb();
            let t = db.transaction(['fetch'], 'readwrite');
            let rq = t.objectStore('fetch').delete(url);
            return new Promise(r => {
                rq.onsuccess = () => r(rq.result);
                rq.onerror = () => r(undefined);
            });
        }
    })(FetchExtension = PoopJs.FetchExtension || (PoopJs.FetchExtension = {}));
})(PoopJs || (PoopJs = {}));
var PoopJs;
(function (PoopJs) {
    let EntryFiltererExtension;
    (function (EntryFiltererExtension) {
        /**
         * can be either Map or WeakMap
         * (WeakMap is likely to be useless if there are less then 10k old nodes in map)
         */
        let MapType = Map;
        function toElArray(entrySelector) {
            return typeof entrySelector == 'function' ? entrySelector() : qq(entrySelector);
        }
        class EntryFilterer {
            container;
            entrySelector;
            constructor(entrySelector, enabled = 'soft') {
                this.entrySelector = entrySelector;
                this.container = elm('.ef-container');
                if (enabled == 'soft') {
                    this.softDisable = true;
                    this.disable('soft');
                }
                else if (enabled) {
                    this.softDisable = false;
                }
                else {
                    // enabled is falsy
                    this.softDisable = false;
                    this.disable();
                }
                this.style();
                this.update();
                document.addEventListener('paginationmodify', () => this.requestUpdate());
                PoopJs.etc.onheightchange(() => this.requestUpdate());
            }
            entries = [];
            entryDatas = new MapType();
            getData(el) {
                if (!el)
                    return this.entries.map(e => this.getData(e));
                let data = this.entryDatas.get(el);
                if (!data) {
                    data = this.parseEntry(el);
                    this.entryDatas.set(el, data);
                }
                return data;
            }
            updatePending = false;
            reparsePending = false;
            requestUpdate(reparse = false) {
                if (this.updatePending)
                    return;
                this.updatePending = true;
                if (reparse)
                    this.reparsePending = true;
                setTimeout(() => this.update());
            }
            parsers = [];
            writeDataAttribute = false;
            addParser(parser) {
                this.parsers.push(parser);
                this.requestUpdate(true);
            }
            parseEntry(el) {
                el.parentElement.classList.add('ef-entry-container');
                el.classList.add('ef-entry');
                let data = {};
                for (let parser of this.parsers) {
                    let newData = parser(el, data);
                    if (!newData || newData == data)
                        continue;
                    if (!IsPromise(newData)) {
                        Object.assign(data, newData);
                        continue;
                    }
                    newData.then(pNewData => {
                        if (pNewData && pNewData != data) {
                            Object.assign(data, pNewData);
                        }
                        this.requestUpdate();
                    });
                }
                if (this.writeDataAttribute) {
                    el.setAttribute('ef-data', JSON.stringify(data));
                }
                return data;
            }
            addItem(constructor, list, data, source) {
                Object.assign(data, source, { parent: this });
                data.name ??= data.id;
                let item = new constructor(data);
                list.push(item);
                return item;
            }
            filters = [];
            sorters = [];
            modifiers = [];
            addFilter(id, filter, data = {}) {
                return this.addItem(EntryFiltererExtension.Filter, this.filters, data, { id, filter });
            }
            addVFilter(id, filter, data) {
                if (typeof data != 'object' || !data) {
                    data = { input: data };
                }
                return this.addItem(EntryFiltererExtension.ValueFilter, this.filters, data, { id, filter });
            }
            addMFilter(id, value, data) {
                return this.addItem(EntryFiltererExtension.MatchFilter, this.filters, data, { id, value });
            }
            addTagFilter(id, data) {
                return this.addItem(EntryFiltererExtension.TagFilter, this.filters, data, { id });
            }
            addSorter(id, sorter, data = {}) {
                return this.addItem(EntryFiltererExtension.Sorter, this.sorters, data, { id, sorter });
            }
            addModifier(id, modifier, data = {}) {
                return this.addItem(EntryFiltererExtension.Modifier, this.modifiers, data, { id, modifier });
            }
            addPrefix(id, prefix, data = {}) {
                return this.addItem(EntryFiltererExtension.Prefixer, this.modifiers, data, { id, prefix });
            }
            addPaginationInfo(id = 'pginfo', data = {}) {
                return this.addItem(EntryFiltererExtension.PaginationInfoFilter, this.filters, data, { id });
            }
            filterEntries() {
                for (let el of this.entries) {
                    let data = this.getData(el);
                    let value = true;
                    for (let filter of this.filters) {
                        value = value && filter.apply(data, el);
                    }
                    el.classList.toggle('ef-filtered-out', !value);
                }
            }
            _previousState = {
                allSortersOff: true,
                updateDuration: 0,
                finishedAt: 0,
            };
            orderedEntries = [];
            orderMode = 'css';
            sortEntries() {
                if (this.entries.length <= 1)
                    return;
                if (this.orderedEntries.length == 0)
                    this.orderedEntries = this.entries;
                if (this.sorters.length == 0)
                    return;
                let entries = this.entries;
                let pairs = entries.map(e => [this.getData(e), e]);
                let allOff = true;
                for (let sorter of this.sorters) {
                    if (sorter.mode != 'off') {
                        pairs = sorter.sort(pairs);
                        allOff = false;
                    }
                }
                entries = pairs.map(e => e[1]);
                if (this.orderMode == 'swap') {
                    if (!entries.every((e, i) => e == this.orderedEntries[i])) {
                        let br = elm(`${entries[0]?.tagName}.ef-before-sort[hidden]`);
                        this.orderedEntries[0].before(br);
                        br.after(...entries);
                        br.remove();
                    }
                }
                else {
                    if (allOff != this._previousState.allSortersOff) {
                        entries.map((e, i) => {
                            if (allOff) {
                                e.classList.remove('ef-reorder');
                                e.parentElement.classList.remove('ef-reorder-container');
                            }
                            else {
                                // use `flex` or `grid` container and `order:var(--ef-order)` for children 
                                e.classList.add('ef-reorder');
                                e.parentElement.classList.add('ef-reorder-container');
                            }
                        });
                    }
                    if (!allOff) {
                        entries.map((e, i) => {
                            e.style.setProperty('--ef-order', i + '');
                        });
                    }
                }
                this.orderedEntries = entries;
                this._previousState.allSortersOff = allOff;
            }
            modifyEntries() {
                let entries = this.entries;
                let pairs = entries.map(e => [e, this.getData(e)]);
                for (let modifier of this.modifiers) {
                    for (let [e, d] of pairs) {
                        modifier.apply(d, e);
                    }
                }
            }
            moveToTop(item) {
                if (this.sorters.includes(item)) {
                    this.sorters.splice(this.sorters.indexOf(item), 1);
                    this.sorters.push(item);
                }
                if (this.modifiers.includes(item)) {
                    this.modifiers.splice(this.modifiers.indexOf(item), 1);
                    this.modifiers.push(item);
                }
            }
            findEntries() {
                return typeof this.entrySelector == 'function' ? this.entrySelector() : qq(this.entrySelector);
            }
            update(reparse = this.reparsePending) {
                let earliestUpdate = this._previousState.finishedAt + Math.min(1000, 8 * this._previousState.updateDuration);
                if (performance.now() < earliestUpdate) {
                    requestAnimationFrame(() => this.update());
                    return;
                }
                this.updatePending = false;
                if (this.disabled == true)
                    return;
                let now = performance.now();
                let entries = this.findEntries();
                if (this.disabled == 'soft') {
                    if (!entries.length)
                        return;
                    PoopJs.debug && console.log(`Ef soft-enabled: x0=>x${entries.length}`, this.entrySelector, this);
                    this.enable();
                    return;
                }
                if (this.disabled != false)
                    throw 0;
                if (!entries.length && this.softDisable) {
                    PoopJs.debug && console.log(`Ef soft-disabled: x${this.enable.length}=>x0`, this.entrySelector, this);
                    this.disable('soft');
                    return;
                }
                if (reparse) {
                    this.entryDatas = new MapType();
                    this.reparsePending = false;
                }
                if (!this.container.closest('body')) {
                    this.container.appendTo('body');
                }
                if (this.entries.length != entries.length) {
                    PoopJs.debug && console.log(`Ef update: x${this.entries.length}=>x${entries.length}`, this.entrySelector, this);
                    // || this.entries
                    // TODO: sort entries in initial order
                }
                this.entries = entries;
                this.filterEntries();
                this.sortEntries();
                this.modifyEntries();
                let timeUsed = performance.now() - now;
                this._previousState.updateDuration = timeUsed;
                this._previousState.finishedAt = performance.now();
            }
            offIncompatible(incompatible) {
                for (let filter of this.filters) {
                    if (incompatible.includes(filter.id)) {
                        filter.toggleMode('off');
                    }
                }
                for (let sorter of this.sorters) {
                    if (incompatible.includes(sorter.id)) {
                        sorter.toggleMode('off');
                    }
                }
                for (let modifier of this.modifiers) {
                    if (incompatible.includes(modifier.id)) {
                        modifier.toggleMode('off');
                    }
                }
            }
            style(s = '') {
                EntryFilterer.style(s);
                return this;
            }
            static style(s = '') {
                let style = q('style.ef-style') || elm('style.ef-style').appendTo('head');
                style.innerHTML = `
					.ef-container {
						display: flex;
						flex-direction: column;
						position: fixed;
						top: 0;
						right: 0;
						z-index: 9999999999999999999;
						min-width: 100px;
					}
					.ef-entry {}

					.ef-filtered-out {
						display: none !important;
					}

					button.ef-item {}
					button.ef-item[ef-mode="off"] {
						background: lightgray;
					}
					button.ef-item[ef-mode="on"] {
						background: lightgreen;
					}
					button.ef-item[ef-mode="opposite"] {
						background: yellow;
					}

					button.ef-item.ef-filter > input {
						float: right;
					}

					[ef-prefix]::before {
						content: attr(ef-prefix);
					}
					[ef-postfix]::after {
						content: attr(ef-postfix);
					}
					
				` + s;
            }
            softDisable = true;
            disabled = false;
            disable(soft) {
                this.disabled = true;
                if (soft == 'soft')
                    this.disabled = 'soft';
                this.container.remove();
            }
            enable() {
                this.disabled = false;
                this.updatePending = false;
                this.requestUpdate();
            }
            clear() {
                this.entryDatas = new Map();
                this.parsers.splice(0, 999);
                this.filters.splice(0, 999).map(e => e.remove());
                this.sorters.splice(0, 999).map(e => e.remove());
                this.modifiers.splice(0, 999).map(e => e.remove());
                this.enable();
            }
            get _datas() {
                return this.entries
                    .filter(e => !e.classList.contains('ef-filtered-out'))
                    .map(e => this.getData(e));
            }
        }
        EntryFiltererExtension.EntryFilterer = EntryFilterer;
        function IsPromise(p) {
            if (!p)
                return false;
            return typeof p.then == 'function';
        }
    })(EntryFiltererExtension = PoopJs.EntryFiltererExtension || (PoopJs.EntryFiltererExtension = {}));
})(PoopJs || (PoopJs = {}));
var PoopJs;
(function (PoopJs) {
    class Observer {
    }
    PoopJs.Observer = Observer;
})(PoopJs || (PoopJs = {}));
/*

function observeClassAdd(cls, cb) {
    let queued = false;
    async function run() {
        if (queued) return;
        queued = true;
        await Promise.frame();
        queued = false;
        cb();
    }
    new MutationObserver(list => {
        for (let mr of list) {
            if (mr.type == 'attributes' && mr.attributeName == 'class') {
                if (mr.target.classList.contains(cls)) {
                    run();
                }
            }
            if (mr.type == 'childList') {
                for (let ch of mr.addedNodes) {
                    if (ch.classList?.contains(cls)) {
                        run();
                    }
                }
            }
        }
    }).observe(document.body, {
        childList: true,
        attributes: true,
        subtree: true,
    });
}

*/ 
var PoopJs;
(function (PoopJs) {
    let PaginateExtension;
    (function (PaginateExtension) {
        class Paginate {
            doc;
            enabled = true;
            condition;
            queued = 0;
            running = false;
            _inited = false;
            shiftRequestCount;
            static shiftRequestCount = 10;
            static _inited = false;
            static removeDefaultRunBindings;
            static addDefaultRunBindings() {
                Paginate.removeDefaultRunBindings?.();
                function onmousedown(event) {
                    if (event.button != 1)
                        return;
                    let target = event.target;
                    if (target?.closest('a'))
                        return;
                    event.preventDefault();
                    let count = event.shiftKey ? Paginate.shiftRequestCount : 1;
                    Paginate.requestPagination(count, event, target);
                }
                function onkeydown(event) {
                    if (event.code != 'AltRight')
                        return;
                    event.preventDefault();
                    let count = event.shiftKey ? Paginate.shiftRequestCount : 1;
                    let target = event.target;
                    Paginate.requestPagination(count, event, target);
                }
                document.addEventListener('mousedown', onmousedown);
                document.addEventListener('keydown', onkeydown);
                Paginate.removeDefaultRunBindings = () => {
                    document.removeEventListener('mousedown', onmousedown);
                    document.removeEventListener('keydown', onkeydown);
                };
            }
            static instances = [];
            // listeners
            init() {
                if (!Paginate.removeDefaultRunBindings) {
                    Paginate.addDefaultRunBindings();
                }
                if (this._inited)
                    return;
                document.addEventListener('paginationrequest', this.onPaginationRequest.bind(this));
                document.addEventListener('paginationend', this.onPaginationEnd.bind(this));
                Paginate.instances.push(this);
                if (PoopJs.debug) {
                    let active = this.canConsumeRequest() ? 'active' : 'inactive';
                    if (active == 'active')
                        PoopJs.debug && console.log(`Paginate instantiated (${active}): `, this.data);
                }
            }
            onPaginationRequest(event) {
                if (this.canConsumeRequest()) {
                    event.detail.consumed++;
                    let queued = !event.detail.reason?.shiftKey ? null : typeof this.shiftRequestCount == 'function' ? this.shiftRequestCount() : this.shiftRequestCount;
                    this.queued += queued ?? event.detail.count;
                }
                if (!this.running && this.queued) {
                    this.consumeRequest();
                }
            }
            ;
            onPaginationEnd(event) {
                if (this.queued && this.canConsumeRequest()) {
                    requestAnimationFrame(() => {
                        if (!this.canConsumeRequest()) {
                            console.warn(`this paginate can not work anymore`);
                            this.queued = 0;
                        }
                        else {
                            this.consumeRequest();
                        }
                    });
                }
            }
            canConsumeRequest() {
                if (!this.enabled)
                    return false;
                if (this.running)
                    return true;
                if (this.condition) {
                    if (typeof this.condition == 'function') {
                        if (!this.condition())
                            return false;
                    }
                    else {
                        if (!document.q(this.condition))
                            return false;
                    }
                }
                return true;
            }
            async consumeRequest() {
                if (this.running)
                    return;
                this.queued--;
                this.running = true;
                this.emitStart();
                await this.onrun?.();
                this.running = false;
                this.emitEnd();
            }
            onrun;
            // emitters
            static requestPagination(count = 1, reason, target = document.body) {
                let detail = { count, reason, consumed: 0 };
                function fail(event) {
                    if (event.detail.consumed == 0) {
                        console.warn(`Pagination request failed: no listeners`);
                    }
                    removeEventListener('paginationrequest', fail);
                }
                addEventListener('paginationrequest', fail);
                target.emit('paginationrequest', { count, reason, consumed: 0 });
            }
            emitStart() {
                document.body.emit('paginationstart', { paginate: this });
            }
            emitModify(added, removed, selector) {
                document.body.emit('paginationmodify', { paginate: this, added, removed, selector });
            }
            emitEnd() {
                document.body.emit('paginationend', { paginate: this });
            }
            // fetching: 
            async fetchDocument(link, spinner = true, maxAge = 0) {
                this.doc = null;
                let a = spinner && Paginate.linkToAnchor(link);
                a?.classList.add('paginate-spin');
                link = Paginate.linkToUrl(link);
                let init = { maxAge, xml: this.data.xml };
                this.doc = !maxAge ? await fetch.doc(link, init) : await fetch.cached.doc(link, init);
                a?.classList.remove('paginate-spin');
                return this.doc;
            }
            static prefetch(source) {
                document.qq(source).map(e => {
                    if (e.href) {
                        elm(`link[rel="prefetch"][href="${e.href}"]`).appendTo('head');
                    }
                    // TODO: if e.src
                });
            }
            // modification: 
            after(source, target = source) {
                let added = this.doc.qq(source);
                if (!added.length)
                    return;
                let found = document.qq(target);
                if (found.length == 0)
                    throw new Error(`failed to find where to append`);
                found.pop().after(...added);
                this.emitModify(added, [], source);
            }
            replaceEach(source, target = source) {
                let added = this.doc.qq(source);
                let removed = document.qq(target);
                if (added.length != removed.length)
                    throw new Error(`added/removed count mismatch`);
                removed.map((e, i) => e.replaceWith(added[i]));
                this.emitModify(added, removed, source);
            }
            replace(source, target = source) {
                let added = this.doc.qq(source);
                let removed = document.qq(target);
                if (added.length != removed.length)
                    throw new Error(`not implemented`);
                return this.replaceEach(source, target);
            }
            // util
            static linkToUrl(link) {
                if (typeof link == 'string') {
                    if (link.startsWith('http'))
                        return link;
                    link = document.q(link);
                }
                if (link.tagName != 'A')
                    throw new Error('link should be <a> element!');
                return link.href;
            }
            static linkToAnchor(link) {
                if (typeof link == 'string') {
                    if (link.startsWith('http'))
                        return null;
                    return document.q(link);
                }
                return link;
            }
            static staticCall(data) {
                let p = new Paginate();
                p.staticCall(data);
                return p;
            }
            rawData;
            data;
            staticCall(data) {
                function toArray(v) {
                    if (Array.isArray(v))
                        return v;
                    if (v == null)
                        return [];
                    return [v];
                }
                function toCondition(s) {
                    if (!s)
                        return () => true;
                    if (typeof s == 'string')
                        return () => !!document.q(s);
                    return s;
                }
                function canFind(a) {
                    if (a.length == 0)
                        return true;
                    return a.some(s => !!document.q(s));
                }
                function findOne(a) {
                    return a.find(s => document.q(s));
                }
                this.rawData = data;
                this.data = {
                    condition: toCondition(data.condition),
                    prefetch: toArray(data.prefetch)
                        .flatMap(e => toArray(data[e] ?? e)),
                    doc: toArray(data.doc),
                    click: toArray(data.click),
                    after: toArray(data.after),
                    replace: toArray(data.replace),
                    maxAge: data.maxAge ?? (data.cache == true ? '1y' : data.cache),
                    start: data.start, modify: data.modify, end: data.end,
                    xml: data.xml,
                };
                this.shiftRequestCount = data.shifted;
                if (data.pager) {
                    let pager = toArray(data.pager);
                    this.data.doc = this.data.doc.flatMap(e => pager.map(p => `${p} ${e}`));
                    this.data.replace.push(...pager);
                }
                this.condition = () => {
                    if (!this.data.condition())
                        return false;
                    if (!canFind(this.data.doc))
                        return false;
                    if (!canFind(this.data.click))
                        return false;
                    return true;
                };
                this.init();
                if (this.data.condition()) {
                    this.data.prefetch.map(s => Paginate.prefetch(s));
                }
                this.onrun = async () => {
                    // if (!fixedData.condition()) return;
                    await this.data.start?.call(this);
                    this.data.click.map(e => document.q(e)?.click());
                    let doc = findOne(this.data.doc);
                    if (doc) {
                        await this.fetchDocument(doc, true, this.data.maxAge);
                        this.data.replace.map(s => this.replace(s));
                        this.data.after.map(s => this.after(s));
                        await this.data.modify?.call(this, this.doc);
                    }
                    await this.data.end?.call(this, doc && this.doc);
                };
            }
        }
        PaginateExtension.Paginate = Paginate;
        PaginateExtension.paginate = Object.setPrototypeOf(Object.assign(Paginate.staticCall, new Paginate()), Paginate);
    })(PaginateExtension = PoopJs.PaginateExtension || (PoopJs.PaginateExtension = {}));
    PoopJs.paginate = PaginateExtension.paginate;
})(PoopJs || (PoopJs = {}));
var PoopJs;
(function (PoopJs) {
    let ImageScrollingExtension;
    (function (ImageScrollingExtension) {
        ImageScrollingExtension.imageScrollingActive = false;
        ImageScrollingExtension.imgSelector = 'img';
        function imageScrolling(selector) {
            if (ImageScrollingExtension.imageScrollingActive)
                return;
            if (selector)
                ImageScrollingExtension.imgSelector = selector;
            ImageScrollingExtension.imageScrollingActive = true;
            function onwheel(event) {
                if (event.shiftKey || event.ctrlKey)
                    return;
                if (scrollWholeImage(-Math.sign(event.wheelDeltaY))) {
                    event.preventDefault();
                }
            }
            document.addEventListener('mousewheel', onwheel, { passive: false });
            return ImageScrollingExtension.imageScrollingOff = () => {
                ImageScrollingExtension.imageScrollingActive = false;
                document.removeEventListener('mousewheel', onwheel);
            };
        }
        ImageScrollingExtension.imageScrolling = imageScrolling;
        function bindArrows() {
            addEventListener('keydown', event => {
                if (event.code == 'ArrowLeft') {
                    scrollWholeImage(-1);
                }
                if (event.code == 'ArrowRight') {
                    scrollWholeImage(1);
                }
            });
        }
        ImageScrollingExtension.bindArrows = bindArrows;
        ImageScrollingExtension.imageScrollingOff = () => { };
        function imgToWindowCenter(img) {
            let rect = img.getBoundingClientRect();
            return (rect.top + rect.bottom) / 2 - innerHeight / 2;
        }
        ImageScrollingExtension.imgToWindowCenter = imgToWindowCenter;
        function getAllImageInfo() {
            let images = qq(ImageScrollingExtension.imgSelector);
            let datas = images.map((img, index) => {
                let rect = img.getBoundingClientRect();
                return {
                    img, rect, index,
                    inScreen: rect.top >= -1 && rect.bottom <= innerHeight,
                    crossScreen: rect.bottom >= 1 && rect.top <= innerHeight - 1,
                    yToScreenCenter: (rect.top + rect.bottom) / 2 - innerHeight / 2,
                    isInCenter: Math.abs((rect.top + rect.bottom) / 2 - innerHeight / 2) < 3,
                    isScreenHeight: Math.abs(rect.height - innerHeight) < 3,
                };
            }).filter(e => e.rect?.width || e.rect?.width);
            return datas;
        }
        ImageScrollingExtension.getAllImageInfo = getAllImageInfo;
        ImageScrollingExtension.scrollWholeImagePending = false;
        function getCentralImg() {
            return getAllImageInfo().vsort(e => Math.abs(e.yToScreenCenter))[0]?.img;
        }
        ImageScrollingExtension.getCentralImg = getCentralImg;
        function scrollWholeImage(dir = 1) {
            if (ImageScrollingExtension.scrollWholeImagePending)
                return true;
            // if (dir == 0) throw new Error('scrolling in no direction!');
            if (!dir)
                return false;
            dir = Math.sign(dir);
            let datas = getAllImageInfo().vsort(e => e.yToScreenCenter);
            let central = datas.vsort(e => Math.abs(e.yToScreenCenter))[0];
            let nextCentralIndex = datas.indexOf(central);
            while (datas[nextCentralIndex + dir] &&
                Math.abs(datas[nextCentralIndex + dir].yToScreenCenter - central.yToScreenCenter) < 10)
                nextCentralIndex += dir;
            central = datas[nextCentralIndex];
            let next = datas[nextCentralIndex + dir];
            function scrollToImage(data) {
                if (!data)
                    return false;
                if (scrollY + data.yToScreenCenter <= 0 && scrollY <= 0) {
                    return false;
                }
                if (data.isScreenHeight) {
                    data.img.scrollIntoView();
                }
                else {
                    scrollTo(scrollX, scrollY + data.yToScreenCenter);
                }
                ImageScrollingExtension.scrollWholeImagePending = true;
                Promise.raf(2).then(() => ImageScrollingExtension.scrollWholeImagePending = false);
                return true;
            }
            // if no images, don't scroll;
            if (!central)
                return false;
            // if current image is outside view, don't scroll
            if (!central.crossScreen)
                return false;
            // if current image is in center, scroll to the next one
            if (central.isInCenter) {
                return scrollToImage(next);
            }
            // if to scroll to current image you have to scroll in opposide direction, scroll to next one
            if (Math.sign(central.yToScreenCenter) != dir) {
                return scrollToImage(next);
            }
            // if current image is first/last, don't scroll over 25vh to it
            if (dir == 1 && central.index == 0 && central.yToScreenCenter > innerHeight / 2) {
                return false;
            }
            if (dir == -1 && central.index == datas.length - 1 && central.yToScreenCenter < -innerHeight / 2) {
                return false;
            }
            return scrollToImage(central);
        }
        ImageScrollingExtension.scrollWholeImage = scrollWholeImage;
    })(ImageScrollingExtension = PoopJs.ImageScrollingExtension || (PoopJs.ImageScrollingExtension = {}));
})(PoopJs || (PoopJs = {}));
/// <reference path="./Array.ts" />
/// <reference path="./DateNowHack.ts" />
/// <reference path="./element.ts" />
/// <reference path="./elm.ts" />
/// <reference path="./Filterer/EntityFilterer.ts" />
/// <reference path="./etc.ts" />
/// <reference path="./fetch.ts" />
/// <reference path="./Object.ts" />
/// <reference path="./observer.ts" />
/// <reference path="./Paginate/Pagination.ts" />
/// <reference path="./Paginate/ImageScrolling.ts" />
/// <reference path="./Promise.ts" />
var PoopJs;
(function (PoopJs) {
    function __init__(window) {
        if (!window)
            window = globalThis.window;
        window.elm = PoopJs.Elm.elm;
        window.q = Object.assign(PoopJs.QuerySelector.WindowQ.q, { orElm: PoopJs.Elm.qOrElm });
        window.qq = PoopJs.QuerySelector.WindowQ.qq;
        PoopJs.ObjectExtension.defineValue(window.Element.prototype, 'q', PoopJs.QuerySelector.ElementQ.q);
        PoopJs.ObjectExtension.defineValue(window.Element.prototype, 'qq', PoopJs.QuerySelector.ElementQ.qq);
        PoopJs.ObjectExtension.defineValue(window.Element.prototype, 'appendTo', PoopJs.ElementExtension.appendTo);
        PoopJs.ObjectExtension.defineValue(window.Element.prototype, 'emit', PoopJs.ElementExtension.emit);
        PoopJs.ObjectExtension.defineValue(window.Document.prototype, 'q', PoopJs.QuerySelector.DocumentQ.q);
        PoopJs.ObjectExtension.defineValue(window.Document.prototype, 'qq', PoopJs.QuerySelector.DocumentQ.qq);
        PoopJs.ObjectExtension.defineValue(window.Promise, 'empty', PoopJs.PromiseExtension.empty);
        PoopJs.ObjectExtension.defineValue(window.Promise, 'frame', PoopJs.PromiseExtension.frame);
        PoopJs.ObjectExtension.defineValue(window.Promise, 'raf', PoopJs.PromiseExtension.frame);
        window.fetch.cached = PoopJs.FetchExtension.cached;
        window.fetch.doc = PoopJs.FetchExtension.doc;
        window.fetch.json = PoopJs.FetchExtension.json;
        window.fetch.cached.doc = PoopJs.FetchExtension.cachedDoc;
        window.fetch.doc.cached = PoopJs.FetchExtension.cachedDoc;
        window.fetch.cachedDoc = PoopJs.FetchExtension.cachedDoc;
        window.fetch.json.cached = PoopJs.FetchExtension.cachedJson;
        window.fetch.cached.json = PoopJs.FetchExtension.cachedJson;
        window.fetch.isCached = PoopJs.FetchExtension.isCached;
        PoopJs.ObjectExtension.defineValue(window.Response.prototype, 'cachedAt', 0);
        PoopJs.ObjectExtension.defineValue(window.Document.prototype, 'cachedAt', 0);
        PoopJs.ObjectExtension.defineValue(window.Object, 'defineValue', PoopJs.ObjectExtension.defineValue);
        PoopJs.ObjectExtension.defineValue(window.Object, 'defineGetter', PoopJs.ObjectExtension.defineGetter);
        // ObjectExtension.defineValue(Object, 'map', ObjectExtension.map);
        PoopJs.ObjectExtension.defineValue(window.Array, 'map', PoopJs.ArrayExtension.map);
        PoopJs.ObjectExtension.defineValue(window.Array.prototype, 'pmap', PoopJs.ArrayExtension.pmap);
        PoopJs.ObjectExtension.defineValue(window.Array.prototype, 'vsort', PoopJs.ArrayExtension.vsort);
        window.paginate = PoopJs.paginate;
        window.imageScrolling = PoopJs.ImageScrollingExtension;
        PoopJs.ObjectExtension.defineValue(window, '__init__', 'already inited');
        return 'inited';
    }
    PoopJs.__init__ = __init__;
    PoopJs.ObjectExtension.defineGetter(window, '__init__', () => __init__(window));
    if (window.localStorage.__init__) {
        window.__init__;
    }
})(PoopJs || (PoopJs = {}));
;
var PoopJs;
(function (PoopJs) {
    let EntryFiltererExtension;
    (function (EntryFiltererExtension) {
        class FiltererItem {
            id = "";
            name;
            description;
            threeWay = false;
            mode = 'off';
            parent;
            button;
            incompatible;
            hidden = false;
            constructor(data) {
                data.button ??= 'button.ef-item';
                Object.assign(this, data);
                this.button = elm(data.button, click => this.click(click), contextmenu => this.contextmenu(contextmenu));
                this.parent.container.append(this.button);
                if (this.name) {
                    this.button.append(this.name);
                }
                if (this.description) {
                    this.button.title = this.description;
                }
                if (this.mode != 'off') {
                    this.toggleMode(data.mode, true);
                }
                if (this.hidden) {
                    this.hide();
                }
            }
            click(event) {
                if (this.mode == 'off') {
                    this.toggleMode('on');
                    return;
                }
                if (event.target != this.button)
                    return;
                if (this.mode == 'on') {
                    this.toggleMode(this.threeWay ? 'opposite' : 'off');
                }
                else {
                    this.toggleMode('off');
                }
            }
            contextmenu(event) {
                event.preventDefault();
                if (this.mode != 'opposite') {
                    this.toggleMode('opposite');
                }
                else {
                    this.toggleMode('off');
                }
            }
            toggleMode(mode, force = false) {
                if (this.mode == mode && !force)
                    return;
                this.mode = mode;
                this.button.setAttribute('ef-mode', mode);
                if (mode != 'off' && this.incompatible) {
                    this.parent.offIncompatible(this.incompatible);
                }
                this.parent.requestUpdate();
            }
            remove() {
                this.button.remove();
                this.toggleMode('off');
            }
            show() {
                this.hidden = false;
                this.button.hidden = false;
            }
            hide() {
                this.hidden = true;
                this.button.hidden = true;
            }
        }
        EntryFiltererExtension.FiltererItem = FiltererItem;
    })(EntryFiltererExtension = PoopJs.EntryFiltererExtension || (PoopJs.EntryFiltererExtension = {}));
})(PoopJs || (PoopJs = {}));
/// <reference path="./FiltererItem.ts" />
var PoopJs;
(function (PoopJs) {
    let EntryFiltererExtension;
    (function (EntryFiltererExtension) {
        class Filter extends EntryFiltererExtension.FiltererItem {
            constructor(data) {
                data.button ??= 'button.ef-item.ef-filter[ef-mode="off"]';
                super(data);
            }
            /** returns if item should be visible */
            apply(data, el) {
                if (this.mode == 'off')
                    return true;
                let value = this.filter(data, el, this.mode);
                let result = typeof value == "number" ? value > 0 : value;
                if (this.mode == 'on')
                    return result;
                if (this.mode == 'opposite')
                    return !result;
            }
        }
        EntryFiltererExtension.Filter = Filter;
        class ValueFilter extends EntryFiltererExtension.FiltererItem {
            input;
            lastValue;
            constructor(data) {
                data.button ??= 'button.ef-item.ef-filter[ef-mode="off"]';
                super(data);
                let type = typeof data.input == 'number' ? 'number' : 'text';
                let value = JSON.stringify(data.input);
                let input = `input[type=${type}][value=${value}]`;
                this.input = elm(input, input => this.change()).appendTo(this.button);
            }
            change() {
                let value = this.getValue();
                if (this.lastValue != value) {
                    this.lastValue = value;
                    this.parent.requestUpdate();
                }
            }
            /** returns if item should be visible */
            apply(data, el) {
                if (this.mode == 'off')
                    return true;
                let value = this.filter(this.getValue(), data, el);
                let result = typeof value == "number" ? value > 0 : value;
                if (this.mode == 'on')
                    return result;
                if (this.mode == 'opposite')
                    return !result;
            }
            getValue() {
                let value = (this.input.type == 'text' ? this.input.value : this.input.valueAsNumber);
                return value;
            }
        }
        EntryFiltererExtension.ValueFilter = ValueFilter;
        class MatchFilter extends EntryFiltererExtension.FiltererItem {
            input;
            lastValue;
            matcher;
            constructor(data) {
                data.button ??= 'button.ef-item.ef-filter[ef-mode="off"]';
                data.value ??= data => JSON.stringify(data);
                super(data);
                let value = !data.input ? '' : JSON.stringify(data.input);
                let input = `input[type=text}][value=${value}]`;
                this.input = elm(input, input => this.change()).appendTo(this.button);
            }
            change() {
                if (this.lastValue != this.input.value) {
                    this.lastValue = this.input.value;
                    this.matcher = this.generateMatcher(this.lastValue);
                }
            }
            apply(data, el) {
                if (this.mode == 'off')
                    return true;
                let result = this.matcher(this.value(data, el));
                return this.mode == 'on' ? result : !result;
            }
            // matcherCache: Map<string, ((input: string) => boolean)> = new Map();
            // getMatcher(source: string): (input: string) => boolean {
            // 	if (this.matcherCache.has(source)) {
            // 		return this.matcherCache.get(source);
            // 	}
            // 	let matcher = this.generateMatcher(source);
            // 	this.matcherCache.set(source, matcher);
            // 	return matcher;
            // }
            generateMatcher(source) {
                source = source.trim();
                if (source.length == 0)
                    return () => true;
                if (source.includes(' ')) {
                    let parts = source.split(' ').map(e => this.generateMatcher(e));
                    return (input) => parts.every(m => m(input));
                }
                if (source.startsWith('-')) {
                    if (source.length < 3)
                        return () => true;
                    let base = this.generateMatcher(source.slice(1));
                    return (input) => !base(input);
                }
                try {
                    let flags = source.toLowerCase() == source ? 'i' : '';
                    let regex = new RegExp(source, flags);
                    return (input) => !!input.match(regex);
                }
                catch (e) { }
                ;
                return (input) => input.includes(source);
            }
        }
        EntryFiltererExtension.MatchFilter = MatchFilter;
        class TagFilter extends EntryFiltererExtension.FiltererItem {
            tags;
            input;
            highightClass;
            lastValue = '';
            cachedMatcher;
            constructor(data) {
                data.button ??= 'button.ef-item.ef-filter[ef-mode="off"]';
                super(data);
                this.input = elm(`input[type=text}]`, input => this.change()).appendTo(this.button);
                this.input.value = data.input || '';
                this.tags = data.tags;
                this.cachedMatcher = [];
                this.highightClass = data.highightClass ?? 'ef-tag-highlisht';
            }
            apply(data, el) {
                let tags = this.getTags(data, el);
                tags.map(tag => this.resetHighlight(tag));
                let results = this.cachedMatcher.map(m => {
                    let r = { positive: m.positive, count: 0 };
                    for (let tag of tags) {
                        let str = typeof tag == 'string' ? tag : tag.innerText;
                        let val = m.matches(str);
                        if (val) {
                            r.count++;
                            this.highlightTag(tag, m.positive);
                        }
                    }
                    return r;
                });
                return results.every(r => r.positive ? r.count > 0 : r.count == 0);
            }
            resetHighlight(tag) {
                if (typeof tag == 'string')
                    return;
                tag.classList.remove(this.highightClass);
            }
            highlightTag(tag, positive) {
                if (typeof tag == 'string')
                    return;
                // FIXME
                tag.classList.add(this.highightClass);
            }
            getTags(data, el) {
                if (typeof this.tags == 'string')
                    return el.qq(this.tags);
                return this.tags(data, el, this.mode);
            }
            getTagStrings(data, el) {
                let tags = this.getTags(data, el);
                if (typeof tags[0] == 'string')
                    return tags;
                return tags.map((e) => e.innerText);
            }
            change() {
                if (this.lastValue == this.input.value)
                    return;
                this.lastValue = this.input.value;
                this.cachedMatcher = this.parseMatcher(this.lastValue);
                this.parent.requestUpdate();
            }
            parseMatcher(matcher) {
                matcher.trim();
                if (!matcher)
                    return [];
                if (matcher.includes(' ')) {
                    let parts = matcher.match(/"[^"]*"|\S+/g) || [];
                    return parts.flatMap(e => this.parseMatcher(e));
                }
                if (matcher.startsWith('-')) {
                    let parts = this.parseMatcher(matcher.slice(1));
                    return parts.map(e => ({ positive: !e.positive, matches: e.matches }));
                }
                if (matcher.match(/"^[^"]*"$/)) {
                    matcher = matcher.slice(1, -1);
                    return [{ positive: true, matches: tag => tag == matcher }];
                }
                if (matcher.length < 3)
                    return [];
                if (matcher.match(/"/)?.length == 1)
                    return [];
                try {
                    let g = new RegExp(matcher, 'i');
                    return [{ positive: true, matches: tag => !!tag.match(g) }];
                }
                catch (e) { }
                return [{ positive: true, matches: tag => tag.includes(matcher) }];
            }
        }
        EntryFiltererExtension.TagFilter = TagFilter;
        class PaginationInfoFilter extends EntryFiltererExtension.FiltererItem {
            constructor(data) {
                super(data);
                this.init();
            }
            apply() {
                return true;
            }
            Paginate = PoopJs.PaginateExtension.Paginate;
            countPaginate() {
                let data = { running: 0, queued: 0, };
                for (let p of this.Paginate.instances) {
                    data.running += +p.running;
                    data.queued += p.queued;
                }
                return data;
            }
            updateInfo() {
                let data = this.countPaginate();
                if (!data.running && !data.queued) {
                    this.hide();
                }
                else {
                    this.show();
                    this.button.innerText = `... +${data.running + data.queued}`;
                }
            }
            async init() {
                while (true) {
                    await Promise.frame();
                    this.updateInfo();
                }
            }
        }
        EntryFiltererExtension.PaginationInfoFilter = PaginationInfoFilter;
    })(EntryFiltererExtension = PoopJs.EntryFiltererExtension || (PoopJs.EntryFiltererExtension = {}));
})(PoopJs || (PoopJs = {}));
var PoopJs;
(function (PoopJs) {
    let EntryFiltererExtension;
    (function (EntryFiltererExtension) {
        class Modifier extends EntryFiltererExtension.FiltererItem {
            constructor(data) {
                data.button ??= 'button.ef-item.ef-modifier[ef-mode="off"]';
                super(data);
            }
            toggleMode(mode, force = false) {
                if (this.mode == mode && !force)
                    return;
                this.parent.moveToTop(this);
                super.toggleMode(mode, force);
            }
            apply(data, el) {
                let oldMode = el.getAttribute(`ef-modifier-${this.id}-mode`);
                if (oldMode == this.mode && !this.runOnNoChange)
                    return;
                this.modifier(data, el, this.mode, null);
                el.setAttribute(`ef-modifier-${this.id}-mode`, this.mode);
            }
        }
        EntryFiltererExtension.Modifier = Modifier;
        class Prefixer extends EntryFiltererExtension.FiltererItem {
            constructor(data) {
                data.button ??= 'button.ef-item.ef-modifier[ef-mode="off"]';
                data.target ??= e => e;
                data.prefixAttribute ??= 'ef-prefix';
                data.postfixAttribute ??= 'ef-postfix';
                data.all ??= false;
                super(data);
            }
            apply(data, el) {
                let targets = this.getTargets(el, data);
                if (this.prefix) {
                    if (this.mode == 'off') {
                        targets.map(e => e.removeAttribute(this.prefixAttribute));
                    }
                    else {
                        let value = this.prefix(data, el, this.mode);
                        targets.map(e => e.setAttribute(this.prefixAttribute, value));
                    }
                }
                if (this.postfix) {
                    if (this.mode == 'off') {
                        targets.map(e => e.removeAttribute(this.postfixAttribute));
                    }
                    else {
                        let value = this.postfix(data, el, this.mode);
                        targets.map(e => e.setAttribute(this.postfixAttribute, value));
                    }
                }
            }
            getTargets(el, data) {
                if (typeof this.target == 'string') {
                    if (this.all)
                        return el.qq(this.target);
                    return [el.q(this.target)];
                }
                else {
                    let targets = this.target(el, data, this.mode);
                    return Array.isArray(targets) ? targets : [targets];
                }
            }
        }
        EntryFiltererExtension.Prefixer = Prefixer;
    })(EntryFiltererExtension = PoopJs.EntryFiltererExtension || (PoopJs.EntryFiltererExtension = {}));
})(PoopJs || (PoopJs = {}));
var PoopJs;
(function (PoopJs) {
    let EntryFiltererExtension;
    (function (EntryFiltererExtension) {
        class Sorter extends EntryFiltererExtension.FiltererItem {
            constructor(data) {
                data.button ??= 'button.ef-item.ef-sorter[ef-mode="off"]';
                data.comparator ??= (a, b) => a > b ? 1 : a < b ? -1 : 0;
                super(data);
            }
            toggleMode(mode, force = false) {
                if (this.mode == mode && !force)
                    return;
                this.parent.moveToTop(this);
                super.toggleMode(mode, force);
            }
            sort(list) {
                if (this.mode == 'off')
                    return list;
                return list.vsort(([data, el]) => this.apply(data, el), (a, b) => this.compare(a, b));
            }
            /** returns order of entry */
            apply(data, el) {
                return this.sorter(data, el, this.mode);
            }
            compare(a, b) {
                if (this.mode == 'on') {
                    return this.comparator(a, b);
                }
                if (this.mode == 'opposite') {
                    return this.comparator(b, a);
                }
                return 0;
            }
        }
        EntryFiltererExtension.Sorter = Sorter;
    })(EntryFiltererExtension = PoopJs.EntryFiltererExtension || (PoopJs.EntryFiltererExtension = {}));
})(PoopJs || (PoopJs = {}));
var PoopJs;
(function (PoopJs) {
    let EntryFiltererExtension;
    (function (EntryFiltererExtension) {
        /**
         * can be either Map or WeakMap
         * (WeakMap is likely to be useless if there are less then 10k old nodes in map)
         */
        let MapType = Map;
    })(EntryFiltererExtension = PoopJs.EntryFiltererExtension || (PoopJs.EntryFiltererExtension = {}));
    PoopJs.EF = EntryFiltererExtension.EntryFilterer;
})(PoopJs || (PoopJs = {}));
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicG9vcC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uL3NyYy9Qcm9taXNlLnRzIiwiLi4vc3JjL0FycmF5LnRzIiwiLi4vc3JjL0RhdGVOb3dIYWNrLnRzIiwiLi4vc3JjL09iamVjdC50cyIsIi4uL3NyYy9lbGVtZW50LnRzIiwiLi4vc3JjL2VsbS50cyIsIi4uL3NyYy9ldGMudHMiLCIuLi9zcmMvZmV0Y2gudHMiLCIuLi9zcmMvRmlsdGVyZXIvRW50aXR5RmlsdGVyZXIudHMiLCIuLi9zcmMvb2JzZXJ2ZXIudHMiLCIuLi9zcmMvUGFnaW5hdGUvUGFnaW5hdGlvbi50cyIsIi4uL3NyYy9QYWdpbmF0ZS9JbWFnZVNjcm9sbGluZy50cyIsIi4uL3NyYy9pbml0LnRzIiwiLi4vc3JjL3R5cGVzLnRzIiwiLi4vc3JjL0ZpbHRlcmVyL0ZpbHRlcmVySXRlbS50cyIsIi4uL3NyYy9GaWx0ZXJlci9GaWx0ZXIudHMiLCIuLi9zcmMvRmlsdGVyZXIvTW9kaWZpZXIudHMiLCIuLi9zcmMvRmlsdGVyZXIvU29ydGVyLnRzIiwiLi4vc3JjL0ZpbHRlcmVyL3R5cGVzLnRzIiwiLi4vc3JjL1BhZ2luYXRlL21vZGlmaWNhdGlvbi50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxJQUFVLE1BQU0sQ0F1Q2Y7QUF2Q0QsV0FBVSxNQUFNO0lBRWYsSUFBaUIsZ0JBQWdCLENBbUNoQztJQW5DRCxXQUFpQixnQkFBZ0I7UUFjaEM7O1dBRUc7UUFDSCxTQUFnQixLQUFLO1lBQ3BCLElBQUksT0FBMkIsQ0FBQztZQUNoQyxJQUFJLE1BQThCLENBQUM7WUFDbkMsSUFBSSxDQUFDLEdBQUcsSUFBSSxPQUFPLENBQUksQ0FBQyxDQUFDLEVBQUUsQ0FBQyxFQUFFLEVBQUU7Z0JBQy9CLE9BQU8sR0FBRyxDQUFDLENBQUM7Z0JBQ1osTUFBTSxHQUFHLENBQUMsQ0FBQztZQUNaLENBQUMsQ0FBd0IsQ0FBQztZQUMxQixDQUFDLENBQUMsT0FBTyxHQUFHLENBQUMsQ0FB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QUFDLENBQUM7WUFDekMsQ0FBQztZQUVELE9BQU8sQ0FBQyxDQUFJLEVBQUUsQ0FBSTtnQkFDakIsSUFBSSxJQUFJLENBQUMsSUFBSSxJQUFJLElBQUksRUFBRTtvQkFDdEIsT0FBTyxJQUFJLENBQUMsVUFBVSxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQztpQkFDN0I7Z0JBQ0QsSUFBSSxJQUFJLENBQUMsSUFBSSxJQUFJLFVBQVUsRUFBRTtvQkFDNUIsT0FBTyxJQUFJLENBQUMsVUFBVSxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQztpQkFDN0I7Z0JBQ0QsT0FBTyxDQUFDLENBQUM7WUFDVixDQUFDO1NBQ0Q7UUFuQ1ksNkJBQU0sU0FtQ2xCLENBQUE7SUFFRixDQUFDLEVBdkNnQixzQkFBc0IsR0FBdEIsNkJBQXNCLEtBQXRCLDZCQUFzQixRQXVDdEM7QUFDRixDQUFDLEVBekNTLE1BQU0sS0FBTixNQUFNLFFBeUNmO0FDekNELElBQVUsTUFBTSxDQWlIZjtBQWpIRCxXQUFVLE1BQU07SUFFZixJQUFpQixzQkFBc0IsQ0E0R3RDO0lBNUdELFdBQWlCLHNCQUFzQjtRQXFHdEM7OztXQUdHO1FBQ0gsSUFBSSxPQUFPLEdBQUcsR0FBRyxDQUFDO0lBR25CLENBQUMsRUE1R2dCLHNCQUFzQixHQUF0Qiw2QkFBc0IsS0FBdEIsNkJBQXNCLFFBNEd0QztJQUVVLFNBQUUsR0FBRyxzQkFBc0IsQ0FBQyxhQUFhLENBQUM7QUFDdEQsQ0FBQyxFQWpIUyxNQUFNLEtBQU4sTUFBTSxRQWlIZiIsInNvdXJjZXNDb250ZW50IjpbIm5hbWVzcGFjZSBQb29wSnMge1xyXG5cclxuXHRleHBvcnQgbmFtZXNwYWNlIFByb21pc2VFeHRlbnNpb24ge1xyXG5cdFx0Ly8gdHlwZSBVbndyYXBwZWRQcm9taXNlPFQ+ID0gUHJvbWlzZTxUPiAmIHtcclxuXHRcdC8vIFx0cmVzb2x2ZTogKHZhbHVlOiBUIHwgUHJvbWlzZUxpa2U8VD4pID0+IHZvaWQ7XHJcblx0XHQvLyBcdHJlamVjdDogKHJlYXNvbj86IGFueSkgPT4gdm9pZDtcclxuXHRcdC8vIFx0cjogKHZhbHVlOiBUIHwgUHJvbWlzZUxpa2U8VD4pID0+IHZvaWQ7XHJcblx0XHQvLyBcdGo6IChyZWFzb24/OiBhbnkpID0+IHZvaWQ7XHJcblx0XHQvLyB9XHJcblx0XHRleHBvcnQgaW50ZXJmYWNlIFVud3JhcHBlZFByb21pc2U8VD4gZXh0ZW5kcyBQcm9taXNlPFQ+IHtcclxuXHRcdFx0cmVzb2x2ZTogKHZhbHVlOiBUIHwgUHJvbWlzZUxpa2U8VD4pID0+IHZvaWQ7XHJcblx0XHRcdHJlamVjdDogKHJlYXNvbj86IGFueSkgPT4gdm9pZDtcclxuXHRcdFx0cjogKHZhbHVlOiBUIHwgUHJvbWlzZUxpa2U8VD4pID0+IHZvaWQ7XHJcblx0XHRcdGo6IChyZWFzb24/OiBhbnkpID0+IHZvaWQ7XHJcblx0XHR9XHJcblxyXG5cdFx0LyoqXHJcblx0XHQgKiBDcmVhdGVzIHVud3JhcHBlZCBwcm9taXNlXHJcblx0XHQgKi9cclxuXHRcdGV4cG9ydCBmdW5jdGlvbiBlbXB0eTxUPigpIHtcclxuXHRcdFx0bGV0IHJlc29sdmU6ICh2YWx1ZTogVCkgPT4gdm9pZDtcclxuXHRcdFx0bGV0IHJlamVjdDogKHJlYXNvbj86IGFueSkgPT4gdm9pZDtcclxuXHRcdFx0bGV0IHAgPSBuZXcgUHJvbWlzZTxUPigociwgaikgPT4ge1xyXG5cdFx0XHRcdHJlc29sdmUgPSByO1xyXG5cdFx0XHRcdHJlamVjdCA9IGo7XHJcblx0XHRcdH0pIGFzIFVud3JhcHBlZFByb21pc2U8VD47XHJcblx0XHRcdHAucmVzb2x2ZSA9IHAuciA9IHJlc29sdmU7XHJcblx0XHRcdHAucmVqZWN0ID0gcC5qID0gcmVqZWN0O1xyXG5cdFx0XHRyZXR1cm4gcDtcclxuXHRcdH1cclxuXHJcblx0XHRleHBvcnQgYXN5bmMgZnVuY3Rpb24gZnJhbWUobiA9IDEpOiBQcm9taXNlPG51bWJlcj4ge1xyXG5cdFx0XHR3aGlsZSAoLS1uID4gMCkge1xyXG5cdFx0XHRcdGF3YWl0IG5ldyBQcm9taXNlKHJlcXVlc3RBbmltYXRpb25GcmFtZSk7XHJcblx0XHRcdH1cclxuXHRcdFx0cmV0dXJuIG5ldyBQcm9taXNlKHJlcXVlc3RBbmltYXRpb25GcmFtZSk7XHJcblx0XHR9XHJcblx0fVxyXG5cclxufVxyXG4iLCIvLy8gPHJlZmVyZW5jZSBwYXRoPVwiLi9Qcm9taXNlLnRzXCIgLz5cclxubmFtZXNwYWNlIFBvb3BKcyB7XHJcblx0ZXhwb3J0IG5hbWVzcGFjZSBBcnJheUV4dGVuc2lvbiB7XHJcblxyXG5cdFx0ZXhwb3J0IGFzeW5jIGZ1bmN0aW9uIHBtYXA8VCwgVj4odGhpczogVFtdLCBtYXBwZXI6IChlOiBULCBpOiBudW1iZXIsIGE6IFRbXSkgPT4gUHJvbWlzZTxWPiB8IFYsIHRocmVhZHMgPSA1KTogUHJvbWlzZTxWW10+IHtcclxuXHRcdFx0aWYgKCEodGhyZWFkcyA+IDApKSB0aHJvdyBuZXcgRXJyb3IoKTtcclxuXHRcdFx0bGV0IHRhc2tzOiBbVCwgbnVtYmVyLCBUW11dW10gPSB0aGlzLm1hcCgoZSwgaSwgYSkgPT4gW2UsIGksIGFdKTtcclxuXHRcdFx0bGV0IHJlc3VsdHMgPSBBcnJheTxWPih0YXNrcy5sZW5ndGgpO1xyXG5cdFx0XHRsZXQgYW55UmVzb2x2ZWQgPSBQcm9taXNlRXh0ZW5zaW9uLmVtcHR5KCk7XHJcblx0XHRcdGxldCBmcmVlVGhyZWFkcyA9IHRocmVhZHM7XHJcblx0XHRcdGFzeW5jIGZ1bmN0aW9uIHJ1blRhc2sodGFzazogW1QsIG51bWJlciwgVFtdXSk6IFByb21pc2U8Vj4ge1xyXG5cdFx0XHRcdHRyeSB7XHJcblx0XHRcdFx0XHRyZXR1cm4gYXdhaXQgbWFwcGVyKC4uLnRhc2spO1xyXG5cdFx0XHRcdH0gY2F0Y2ggKGVycikge1xyXG5cdFx0XHRcdFx0cmV0dXJuIGVycjtcclxuXHRcdFx0XHR9XHJcblx0XHRcdH1cclxuXHRcdFx0YXN5bmMgZnVuY3Rpb24gcnVuKHRhc2spIHtcclxuXHRcdFx0XHRmcmVlVGhyZWFkcy0tO1xyXG5cdFx0XHRcdHJlc3VsdHNbdGFza1sxXV0gPSBhd2FpdCBydW5UYXNrKHRhc2spO1xyXG5cdFx0XHRcdGZyZWVUaHJlYWRzKys7XHJcblx0XHRcdFx0bGV0IG9sZEFueVJlc29sdmVkID0gYW55UmVzb2x2ZWQ7XHJcblx0XHRcdFx0YW55UmVzb2x2ZWQgPSBQcm9taXNlRXh0ZW5zaW9uLmVtcHR5KCk7XHJcblx0XHRcdFx0b2xkQW55UmVzb2x2ZWQucih1bmRlZmluZWQpO1xyXG5cdFx0XHR9XHJcblx0XHRcdGZvciAobGV0IHRhc2sgb2YgdGFza3MpIHtcclxuXHRcdFx0XHRpZiAoZnJlZVRocmVhZHMgPT0gMCkge1xyXG5cdFx0XHRcdFx0YXdhaXQgYW55UmVzb2x2ZWQ7XHJcblx0XHRcdFx0fVxyXG5cdFx0XHRcdHJ1bih0YXNrKTtcclxuXHRcdFx0fVxyXG5cdFx0XHR3aGlsZSAoZnJlZVRocmVhZHMgPCB0aHJlYWRzKSB7XHJcblx0XHRcdFx0YXdhaXQgYW55UmVzb2x2ZWQ7XHJcblx0XHRcdH1cclxuXHRcdFx0cmV0dXJuIHJlc3VsdHM7XHJcblx0XHR9XHJcblxyXG5cdFx0ZXhwb3J0IGZ1bmN0aW9uIG1hcDxUID0gbnVtYmVyPih0aGlzOiBBcnJheUNvbnN0cnVjdG9yLCBsZW5ndGg6IG51bWJlciwgbWFwcGVyOiAobnVtYmVyKSA9PiBUID0gaSA9PiBpKSB7XHJcblx0XHRcdHJldHVybiB0aGlzKGxlbmd0aCkuZmlsbCgwKS5tYXAoKGUsIGksIGEpID0+IG1hcHBlcihpKSk7XHJcblx0XHR9XHJcblxyXG5cdFx0ZXhwb3J0IGZ1bmN0aW9uIHZzb3J0PFQ+KHRoaXM6IFRbXSwgbWFwcGVyOiAoZTogVCwgaTogbnVtYmVyLCBhOiBUW10pID0+IG51bWJlciwgc29ydGVyPzogKChhOiBudW1iZXIsIGI6IG51bWJlciwgYWU6IFQsIGJlOiBUKSA9PiBudW1iZXIpIHwgLTEpOiBUW107XHJcblx0XHRleHBvcnQgZnVuY3Rpb24gdnNvcnQ8VCwgVj4odGhpczogVFtdLCBtYXBwZXI6IChlOiBULCBpOiBudW1iZXIsIGE6IFRbXSkgPT4gViwgc29ydGVyOiAoKGE6IFYsIGI6IFYsIGFlOiBULCBiZTogVCkgPT4gbnVtYmVyKSB8IC0xKTogVFtdO1xyXG5cdFx0ZXhwb3J0IGZ1bmN0aW9uIHZzb3J0PFQ+KHRoaXM6IFRbXSwgbWFwcGVyOiAoZTogVCwgaTogbnVtYmVyLCBhOiBUW10pID0+IG51bWJlciwgc29ydGVyOiAoKGE6IG51bWJlciwgYjogbnVtYmVyLCBhZTogVCwgYmU6IFQpID0+IG51bWJlcikgfCAtMSA9IChhLCBiKSA9PiBhIC0gYik6IFRbXSB7XHJcblx0XHRcdGxldCB0aGVTb3J0ZXIgPSB0eXBlb2Ygc29ydGVyID09ICdmdW5jdGlvbicgPyBzb3J0ZXIgOiAoYSwgYikgPT4gYiAtIGE7XHJcblx0XHRcdHJldHVybiB0aGlzXHJcblx0XHRcdFx0Lm1hcCgoZSwgaSwgYSkgPT4gKHsgZSwgdjogbWFwcGVyKGUsIGksIGEpIH0pKVxyXG5cdFx0XHRcdC5zb3J0KChhLCBiKSA9PiB0aGVTb3J0ZXIoYS52LCBiLnYsIGEuZSwgYi5lKSlcclxuXHRcdFx0XHQubWFwKGUgPT4gZS5lKTtcclxuXHRcdH1cclxuXHJcblx0XHQvLyBleHBvcnQgaW50ZXJmYWNlIFBNYXBEYXRhPFQsIFY+IHtcclxuXHRcdC8vIFx0c291cmNlOiBUW10sXHJcblx0XHQvLyBcdHJlc3VsdDogKFYgfCB1bmRlZmluZWQpW10sXHJcblx0XHQvLyBcdHRocmVhZHM6IG51bWJlcixcclxuXHRcdC8vIFx0d2luZG93OiBudW1iZXIsXHJcblx0XHQvLyBcdGNvbXBsZXRlZDogbnVtYmVyLFxyXG5cdFx0Ly8gXHRsZW5ndGg6IG51bWJlcixcclxuXHRcdC8vIH1cclxuXHJcblx0XHQvLyBleHBvcnQgZnVuY3Rpb24gcG1hcF92MjxULCBWPih0aGlzOiBUW10sIG1hcHBlcjogKGU6IFQsIGk6IG51bWJlciwgc291cmNlOiBUW10sIGRhdGE6IFBNYXBEYXRhPFQsIFY+KSA9PiBWLCBkYXRhOiBQYXJ0aWFsPFBNYXBEYXRhPFQsIFY+Pik6IFByb21pc2U8VltdPiB7XHJcblx0XHQvLyBcdGRhdGEgPSBkYXRhIGFzIFBNYXBEYXRhPFQsIFY+O1xyXG5cdFx0Ly8gXHRsZXQgc291cmNlOiBUW10gPSB0aGlzO1xyXG5cdFx0Ly8gXHRsZXQgcmVzdWx0OiAoViB8IHVuZGVmaW5lZClbXSA9IHNvdXJjZS5tYXAoZSA9PiApO1xyXG5cdFx0Ly8gXHRsZXQgdGhyZWFkczogbnVtYmVyID0gZGF0YS50aHJlYWRzO1xyXG5cdFx0Ly8gXHRsZXQgd2luZG93OiBudW1iZXI7XHJcblx0XHQvLyBcdGxldCBjb21wbGV0ZWQ6IG51bWJlciA9IDA7XHJcblx0XHQvLyBcdGxldCBsZW5ndGg6IG51bWJlciA9IHRoaXMubGVuZ3RoO1xyXG5cclxuXHRcdC8vIFx0ZGF0YS5cclxuXHRcdC8vIH1cclxuXHJcblx0XHR0eXBlIFJlc29sdmVhYmxlUHJvbWlzZTxUPiA9IFByb21pc2VMaWtlPFQ+ICYge1xyXG5cdFx0XHRyZXNvbHZlKHZhbHVlOiBUKTogdm9pZDtcclxuXHRcdH1cclxuXHJcblx0XHRleHBvcnQgaW50ZXJmYWNlIFBNYXBEYXRhPFQsIFYsIEUgPSBuZXZlcj4gZXh0ZW5kcyBQcm9taXNlTGlrZTwoViB8IEUpW10+IHtcclxuXHRcdFx0LyoqIE9yaWdpbmFsIGFycmF5ICovXHJcblx0XHRcdHNvdXJjZTogVFtdLFxyXG5cdFx0XHQvKiogQXN5bmMgZWxlbWVudCBjb252ZXJ0ZXIgZnVuY3Rpb24gKi9cclxuXHRcdFx0bWFwcGVyOiAoZTogVCwgaTogbnVtYmVyLCBhOiBUW10sIGRhdGE6IFBNYXBEYXRhPFQsIFYsIEU+KSA9PiBQcm9taXNlPFYgfCBFPixcclxuXHRcdFx0LyoqIE1heCBudW1iZXIgb2YgcmVxdWVzdHMgYXQgb25jZS4gICBcclxuXHRcdFx0ICogICpNYXkqIGJlIGNoYW5nZWQgaW4gcnVudGltZSAqL1xyXG5cdFx0XHR0aHJlYWRzOiBudW1iZXIsXHJcblx0XHRcdC8qKiBNYXggZGlzdGFuY2UgYmV0d2VlbiB0aGUgb2xkZXJzIGluY29tcGxldGUgYW5kIG5ld2VzdCBhY3RpdmUgZWxlbWVudHMuICAgXHJcblx0XHRcdCAqICAqTWF5KiBiZSBjaGFuZ2VkIGluIHJ1bnRpbWUgKi9cclxuXHRcdFx0d2luZG93OiBudW1iZXIsXHJcblxyXG5cdFx0XHQvKiogVW5maW5pc2hlZCByZXN1bHQgYXJyYXkgKi9cclxuXHRcdFx0cmVzdWx0OiAoViB8IEVycm9yIHwgdW5kZWZpbmVkKVtdLFxyXG5cdFx0XHQvKiogUHJvbWlzZXMgZm9yIGV2ZXJ5IGVsZW1lbnQgKi9cclxuXHRcdFx0cmVxdWVzdHM6IFVud3JhcHBlZFByb21pc2U8ViB8IEU+W10sXHJcblxyXG5cdFx0XHRiZWZvcmVTdGFydChlOiBULCBpOiBudW1iZXIsIGE6IFRbXSwgZGF0YTogUE1hcERhdGE8VCwgViwgRT4pOiB2b2lkO1xyXG5cdFx0XHRhZnRlckNvbXBsZXRlKGU6IFQsIGk6IG51bWJlciwgYTogVFtdLCBkYXRhOiBQTWFwRGF0YTxULCBWLCBFPik6IHZvaWQ7XHJcblxyXG5cdFx0XHQvKiogTGVuZ3RoIG9mIHRoZSBhcnJheSAqL1xyXG5cdFx0XHRsZW5ndGg6IG51bWJlcixcclxuXHRcdFx0LyoqIFRoZSBudW1iZXIgb2YgZWxlbWVudHMgZmluaXNoZWQgY29udmVydGluZyAqL1xyXG5cdFx0XHRjb21wbGV0ZWQ6IG51bWJlcixcclxuXHRcdFx0LyoqIFRocmVhZHMgY3VycmVudGx5IHdvcmtpbmcgICBcclxuXHRcdFx0ICogIGluIHRoZSBtYXBwZXIgZnVuY3Rpb246IGluY2x1ZGluZyB0aGUgY3VycmVudCBvbmUgKi9cclxuXHRcdFx0YWN0aXZlVGhyZWFkczogbnVtYmVyLFxyXG5cdFx0XHRsYXN0U3RhcnRlZDogbnVtYmVyO1xyXG5cdFx0fVxyXG5cclxuXHRcdGNvbnN0IGVtcHR5ID0gUHJvbWlzZUV4dGVuc2lvbi5lbXB0eTtcclxuXHRcdHR5cGUgVW53cmFwcGVkUHJvbWlzZTxUPiA9IFByb21pc2VFeHRlbnNpb24uVW53cmFwcGVkUHJvbWlzZTxUPjtcclxuXHJcblx0XHRleHBvcnQgaW50ZXJmYWNlIFBNYXBTb3VyY2U8VCwgViwgRSA9IG5ldmVyPiBleHRlbmRzIFByb21pc2VMaWtlPFZbXT4ge1xyXG5cdFx0XHQvKiogT3JpZ2luYWwgYXJyYXkgKi9cclxuXHRcdFx0c291cmNlOiBUW10sXHJcblx0XHRcdC8qKiBBc3luYyBlbGVtZW50IGNvbnZlcnRlciBmdW5jdGlvbiAqL1xyXG5cdFx0XHRtYXBwZXI6IChlOiBULCBpOiBudW1iZXIsIGE6IFRbXSwgZGF0YTogUE1hcERhdGE8VCwgViwgRT4pID0+IFByb21pc2U8ViB8IEU+LFxyXG5cdFx0XHQvKiogQXJyYXkgdG8gd3JpdGUgdG8gKi9cclxuXHRcdFx0cmVzdWx0PzogKFYgfCBFcnJvciB8IHVuZGVmaW5lZClbXSxcclxuXHRcdFx0LyoqIE1heCBudW1iZXIgb2YgcmVxdWVzdHMgYXQgb25jZS4gIFxyXG5cdFx0XHQgKiAgRGVmYXVsdDogNVxyXG5cdFx0XHQgKiAgKk1heSogYmUgY2hhbmdlZCBpbiBydW50aW1lICovXHJcblx0XHRcdHRocmVhZHM6IG51bWJlcixcclxuXHRcdFx0LyoqIE1heCBkaXN0YW5jZSBiZXR3ZWVuIHRoZSBvbGRlcnMgaW5jb21wbGV0ZSBhbmQgbmV3ZXN0IGFjdGl2ZSBlbGVtZW50cy4gICBcclxuXHRcdFx0ICogIERlZmF1bHQ6IHVubGltaXRlZCAgIFxyXG5cdFx0XHQgKiAgKk1heSogYmUgY2hhbmdlZCBpbiBydW50aW1lICovXHJcblx0XHRcdHdpbmRvdz86IG51bWJlcixcclxuXHRcdH1cclxuXHJcblx0XHRmdW5jdGlvbiBwbWFwMnJhdzxULCBWLCBFID0gbmV2ZXI+KGRhdGE6IFBNYXBEYXRhPFQsIFYsIEU+KTogUE1hcERhdGE8VCwgViwgRT4ge1xyXG5cdFx0XHRkYXRhLnJlc3VsdCA/Pz0gQXJyYXkoZGF0YS5zb3VyY2UubGVuZ3RoKTtcclxuXHRcdFx0ZGF0YS5yZXF1ZXN0cyA9IGRhdGEucmVzdWx0Lm1hcCgoKSA9PiBlbXB0eSgpKTtcclxuXHRcdFx0ZGF0YS50aHJlYWRzID8/PSA1O1xyXG5cdFx0XHRkYXRhLndpbmRvdyA/Pz0gSW5maW5pdHk7XHJcblxyXG5cdFx0XHRkYXRhLmNvbXBsZXRlZCA9IDA7XHJcblx0XHRcdGRhdGEubGVuZ3RoID0gZGF0YS5zb3VyY2UubGVuZ3RoO1xyXG5cdFx0XHRkYXRhLmFjdGl2ZVRocmVhZHMgPSAwO1xyXG5cdFx0XHRkYXRhLmxhc3RTdGFydGVkID0gMDtcclxuXHJcblx0XHRcdGlmIChkYXRhLnRocmVhZHMgPD0gMCkgdGhyb3cgbmV3IEVycm9yKCk7XHJcblxyXG5cdFx0XHRsZXQgYWxsRG9uZSA9IGVtcHR5KCk7XHJcblx0XHRcdGRhdGEudGhlbiA9IGFsbERvbmUudGhlbi5iaW5kKGFsbERvbmUpIGFzIGFueTtcclxuXHJcblx0XHRcdGxldCBhbnlSZXNvbHZlZCA9IGVtcHR5KCk7XHJcblx0XHRcdGFzeW5jIGZ1bmN0aW9uIHJ1bk9uZShpOiBudW1iZXIpIHtcclxuXHRcdFx0XHRkYXRhLmFjdGl2ZVRocmVhZHMrKztcclxuXHRcdFx0XHRkYXRhLmJlZm9yZVN0YXJ0Py4oZGF0YS5zb3VyY2VbaV0sIGksIGRhdGEuc291cmNlLCBkYXRhKTtcclxuXHRcdFx0XHRkYXRhLmxhc3RTdGFydGVkID0gaTtcclxuXHRcdFx0XHRsZXQgdjogViB8IEUgPSBhd2FpdCBkYXRhLm1hcHBlcihkYXRhLnNvdXJjZVtpXSwgaSwgZGF0YS5zb3VyY2UsIGRhdGEpLmNhdGNoKGUgPT4gZSk7XHJcblx0XHRcdFx0ZGF0YS5hZnRlckNvbXBsZXRlPy4oZGF0YS5zb3VyY2VbaV0sIGksIGRhdGEuc291cmNlLCBkYXRhKTtcclxuXHRcdFx0XHRkYXRhLmFjdGl2ZVRocmVhZHMtLTtcclxuXHRcdFx0XHRhbnlSZXNvbHZlZC5yZXNvbHZlKG51bGwpO1xyXG5cdFx0XHR9XHJcblxyXG5cdFx0XHRhc3luYyBmdW5jdGlvbiBydW4oKSB7XHJcblx0XHRcdFx0Zm9yIChsZXQgaSA9IDA7IGkgPCBkYXRhLmxlbmd0aDsgaSsrKSB7XHJcblx0XHRcdFx0XHR3aGlsZSAoZGF0YS5hY3RpdmVUaHJlYWRzIDwgZGF0YS50aHJlYWRzKSBhd2FpdCBhbnlSZXNvbHZlZDtcclxuXHRcdFx0XHRcdGFueVJlc29sdmVkID0gZW1wdHkoKTtcclxuXHRcdFx0XHRcdHJ1bk9uZShpKTtcclxuXHRcdFx0XHR9XHJcblx0XHRcdH1cclxuXHJcblxyXG5cdFx0XHRyZXR1cm4gZGF0YTtcclxuXHRcdH1cclxuXHJcblx0fVxyXG5cclxufSIsIm5hbWVzcGFjZSBQb29wSnMge1xyXG5cclxuXHRleHBvcnQgbmFtZXNwYWNlIERhdGVOb3dIYWNrIHtcclxuXHJcblx0XHRleHBvcnQgbGV0IHNwZWVkTXVsdGlwbGllciA9IDE7XHJcblx0XHRleHBvcnQgbGV0IGRlbHRhT2Zmc2V0ID0gMDtcclxuXHRcdGV4cG9ydCBsZXQgc3RhcnRSZWFsdGltZSA9IDA7XHJcblx0XHRleHBvcnQgbGV0IHN0YXJ0VGltZSA9IDA7XHJcblxyXG5cdFx0Ly8gZXhwb3J0IGxldCBzcGVlZE11bHRpcGxpZXIgPSAxO1xyXG5cdFx0ZXhwb3J0IGxldCBwZXJmb3JtYW5jZURlbHRhT2Zmc2V0ID0gMDtcclxuXHRcdGV4cG9ydCBsZXQgcGVyZm9ybWFuY2VTdGFydFJlYWx0aW1lID0gMDtcclxuXHRcdGV4cG9ydCBsZXQgcGVyZm9ybWFuY2VTdGFydFRpbWUgPSAwO1xyXG5cclxuXHRcdGV4cG9ydCBsZXQgdXNlZE1ldGhvZHMgPSB7XHJcblx0XHRcdGRhdGU6IHRydWUsXHJcblx0XHRcdHBlcmZvcm1hbmNlOiB0cnVlLFxyXG5cdFx0fVxyXG5cclxuXHRcdGV4cG9ydCBmdW5jdGlvbiB0b0Zha2VUaW1lKHJlYWx0aW1lOiBudW1iZXIpIHtcclxuXHRcdFx0aWYgKCF1c2VkTWV0aG9kcy5kYXRlKSByZXR1cm4gcmVhbHRpbWU7XHJcblx0XHRcdHJldHVybiBNYXRoLmZsb29yKFxyXG5cdFx0XHRcdChyZWFsdGltZSAtIHN0YXJ0UmVhbHRpbWUpICogc3BlZWRNdWx0aXBsaWVyICsgc3RhcnRUaW1lICsgZGVsdGFPZmZzZXRcclxuXHRcdFx0KTtcclxuXHRcdH1cclxuXHRcdGV4cG9ydCBmdW5jdGlvbiB0b1BlcmZvcm1hbmNlRmFrZVRpbWUocmVhbHRpbWU6IG51bWJlcikge1xyXG5cdFx0XHRpZiAoIXVzZWRNZXRob2RzLnBlcmZvcm1hbmNlKSByZXR1cm4gcmVhbHRpbWU7XHJcblx0XHRcdHJldHVybiAocmVhbHRpbWUgLSBwZXJmb3JtYW5jZVN0YXJ0UmVhbHRpbWUpICogc3BlZWRNdWx0aXBsaWVyXHJcblx0XHRcdFx0KyBwZXJmb3JtYW5jZVN0YXJ0VGltZSArIHBlcmZvcm1hbmNlRGVsdGFPZmZzZXQ7XHJcblx0XHR9XHJcblxyXG5cdFx0ZXhwb3J0IGxldCBicmFja2V0U3BlZWRzID0gWzAuMDUsIDAuMjUsIDEsIDIsIDUsIDEwLCAyMCwgNjAsIDEyMF07XHJcblx0XHRleHBvcnQgZnVuY3Rpb24gc3BlZWRoYWNrKHNwZWVkOiBudW1iZXIpIHtcclxuXHRcdFx0YWN0aXZhdGUoKTtcclxuXHRcdFx0YWN0aXZhdGVQZXJmb3JtYW5jZSgpO1xyXG5cdFx0XHRzcGVlZE11bHRpcGxpZXIgPSBzcGVlZDtcclxuXHRcdFx0bG9jYXRpb24uaGFzaCA9IHNwZWVkICsgJyc7XHJcblx0XHR9XHJcblx0XHRleHBvcnQgZnVuY3Rpb24gdGltZWp1bXAoc2Vjb25kczogbnVtYmVyKSB7XHJcblx0XHRcdGFjdGl2YXRlKCk7XHJcblx0XHRcdGFjdGl2YXRlUGVyZm9ybWFuY2UoKTtcclxuXHRcdFx0ZGVsdGFPZmZzZXQgKz0gc2Vjb25kcyAqIDEwMDA7XHJcblx0XHR9XHJcblx0XHRleHBvcnQgZnVuY3Rpb24gc3dpdGNoU3BlZWRoYWNrKGRpcjogbnVtYmVyKSB7XHJcblx0XHRcdGxldCBjdXJyZW50SW5kZXggPSBicmFja2V0U3BlZWRzLmluZGV4T2Yoc3BlZWRNdWx0aXBsaWVyKTtcclxuXHRcdFx0aWYgKGN1cnJlbnRJbmRleCA9PSAtMSkgY3VycmVudEluZGV4ID0gYnJhY2tldFNwZWVkcy5pbmRleE9mKDEpO1xyXG5cdFx0XHRsZXQgbmV3U3BlZWQgPSBicmFja2V0U3BlZWRzW2N1cnJlbnRJbmRleCArIGRpcl07XHJcblx0XHRcdGlmIChuZXdTcGVlZCA9PSB1bmRlZmluZWQpIHJldHVybiBmYWxzZTtcclxuXHRcdFx0c3BlZWRoYWNrKG5ld1NwZWVkKTtcclxuXHRcdH1cclxuXHRcdGZ1bmN0aW9uIG9ua2V5ZG93bihldmVudDogS2V5Ym9hcmRFdmVudCkge1xyXG5cdFx0XHRpZiAoZXZlbnQuY29kZSA9PSAnQnJhY2tldExlZnQnKSB7XHJcblx0XHRcdFx0c3dpdGNoU3BlZWRoYWNrKC0xKTtcclxuXHRcdFx0fVxyXG5cdFx0XHRpZiAoZXZlbnQuY29kZSA9PSAnQnJhY2tldFJpZ2h0Jykge1xyXG5cdFx0XHRcdHN3aXRjaFNwZWVkaGFjaygxKTtcclxuXHRcdFx0fVxyXG5cdFx0fVxyXG5cdFx0ZXhwb3J0IGZ1bmN0aW9uIGJpbmRCcmFja2V0cyhtb2RlID0gJ29uJykge1xyXG5cdFx0XHRyZW1vdmVFdmVudExpc3RlbmVyKCdrZXlkb3duJywgb25rZXlkb3duKTtcclxuXHRcdFx0aWYgKG1vZGUgPT0gJ29uJykge1xyXG5cdFx0XHRcdGFkZEV2ZW50TGlzdGVuZXIoJ2tleWRvd24nLCBvbmtleWRvd24pO1xyXG5cdFx0XHR9XHJcblx0XHR9XHJcblxyXG5cdFx0ZXhwb3J0IGxldCBhY3RpdmF0ZWQgPSBmYWxzZTtcclxuXHRcdGZ1bmN0aW9uIGFjdGl2YXRlKCkge1xyXG5cdFx0XHREYXRlLl9ub3cgPz89IERhdGUubm93O1xyXG5cdFx0XHREYXRlLnByb3RvdHlwZS5fZ2V0VGltZSA/Pz0gRGF0ZS5wcm90b3R5cGUuZ2V0VGltZTtcclxuXHRcdFx0c3RhcnRUaW1lID0gRGF0ZS5ub3coKTtcclxuXHRcdFx0c3RhcnRSZWFsdGltZSA9IERhdGUuX25vdygpO1xyXG5cdFx0XHRkZWx0YU9mZnNldCA9IDA7XHJcblx0XHRcdC8vIGNvbnNvbGUubG9nKERhdGUubm93KCksIClcclxuXHRcdFx0Ly8gZGVidWdnZXI7XHJcblx0XHRcdERhdGUubm93ID0gKCkgPT4gdG9GYWtlVGltZShEYXRlLl9ub3coKSk7XHJcblx0XHRcdERhdGUucHJvdG90eXBlLmdldFRpbWUgPSBmdW5jdGlvbiAodGhpczogRGF0ZSAmIHsgX3Q/OiBudW1iZXIgfSkge1xyXG5cdFx0XHRcdHJldHVybiB0aGlzLl90ID8/PSB0b0Zha2VUaW1lKHRoaXMuX2dldFRpbWUoKSk7XHJcblx0XHRcdH1cclxuXHRcdFx0RGF0ZS5wcm90b3R5cGUudmFsdWVPZiA9IGZ1bmN0aW9uICh0aGlzOiBEYXRlKSB7XHJcblx0XHRcdFx0cmV0dXJuIHRoaXMuZ2V0VGltZSgpO1xyXG5cdFx0XHR9XHJcblx0XHRcdGFjdGl2YXRlZCA9IHRydWU7XHJcblx0XHR9XHJcblx0XHRleHBvcnQgbGV0IHBlcmZvcm1hbmNlQWN0aXZhdGVkID0gZmFsc2U7XHJcblx0XHRmdW5jdGlvbiBhY3RpdmF0ZVBlcmZvcm1hbmNlKCkge1xyXG5cdFx0XHRwZXJmb3JtYW5jZS5fbm93ID8/PSBwZXJmb3JtYW5jZS5ub3c7XHJcblx0XHRcdHBlcmZvcm1hbmNlU3RhcnRUaW1lID0gcGVyZm9ybWFuY2Uubm93KCk7XHJcblx0XHRcdHBlcmZvcm1hbmNlU3RhcnRSZWFsdGltZSA9IHBlcmZvcm1hbmNlLl9ub3coKTtcclxuXHRcdFx0cGVyZm9ybWFuY2VEZWx0YU9mZnNldCA9IDA7XHJcblx0XHRcdHBlcmZvcm1hbmNlLm5vdyA9ICgpID0+IHRvUGVyZm9ybWFuY2VGYWtlVGltZShwZXJmb3JtYW5jZS5fbm93KCkpO1xyXG5cdFx0XHRwZXJmb3JtYW5jZUFjdGl2YXRlZCA9IHRydWU7XHJcblx0XHR9XHJcblxyXG5cdH1cclxuXHJcblxyXG59IiwibmFtZXNwYWNlIFBvb3BKcyB7XHJcblxyXG5cdGV4cG9ydCBuYW1lc3BhY2UgT2JqZWN0RXh0ZW5zaW9uIHtcclxuXHJcblx0XHRleHBvcnQgZnVuY3Rpb24gZGVmaW5lVmFsdWU8VCwgSyBleHRlbmRzIGtleW9mIFQ+KG86IFQsIHA6IEssIHZhbHVlOiBUW0tdKTogVDtcclxuXHRcdGV4cG9ydCBmdW5jdGlvbiBkZWZpbmVWYWx1ZTxUPihvOiBULCBmbjogRnVuY3Rpb24pOiBUO1xyXG5cdFx0ZXhwb3J0IGZ1bmN0aW9uIGRlZmluZVZhbHVlPFQ+KG86IFQsIHA6IGtleW9mIFQgfCBzdHJpbmcgfCBGdW5jdGlvbiwgdmFsdWU/OiBhbnkpOiBUIHtcclxuXHRcdFx0aWYgKHR5cGVvZiBwID09ICdmdW5jdGlvbicpIHtcclxuXHRcdFx0XHRbcCwgdmFsdWVdID0gW3AubmFtZSwgcF0gYXMgW3N0cmluZywgRnVuY3Rpb25dO1xyXG5cdFx0XHR9XHJcblx0XHRcdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShvLCBwLCB7XHJcblx0XHRcdFx0dmFsdWUsXHJcblx0XHRcdFx0Y29uZmlndXJhYmxlOiB0cnVlLFxyXG5cdFx0XHRcdGVudW1lcmFibGU6IGZhbHNlLFxyXG5cdFx0XHRcdHdyaXRhYmxlOiB0cnVlLFxyXG5cdFx0XHR9KTtcclxuXHRcdFx0cmV0dXJuIG87XHJcblx0XHR9XHJcblxyXG5cdFx0ZXhwb3J0IGZ1bmN0aW9uIGRlZmluZUdldHRlcjxULCBLIGV4dGVuZHMga2V5b2YgVD4obzogVCwgcDogSywgZ2V0OiAoKSA9PiBUW0tdKTogVDtcclxuXHRcdGV4cG9ydCBmdW5jdGlvbiBkZWZpbmVHZXR0ZXI8VD4obzogVCwgZ2V0OiBGdW5jdGlvbik6IFQ7XHJcblx0XHRleHBvcnQgZnVuY3Rpb24gZGVmaW5lR2V0dGVyPFQ+KG86IFQsIHA6IHN0cmluZyB8IGtleW9mIFQgfCBGdW5jdGlvbiwgZ2V0PzogYW55KTogVCB7XHJcblx0XHRcdGlmICh0eXBlb2YgcCA9PSAnZnVuY3Rpb24nKSB7XHJcblx0XHRcdFx0W3AsIGdldF0gPSBbcC5uYW1lLCBwXSBhcyBbc3RyaW5nLCBGdW5jdGlvbl07XHJcblx0XHRcdH1cclxuXHRcdFx0T2JqZWN0LmRlZmluZVByb3BlcnR5KG8sIHAsIHtcclxuXHRcdFx0XHRnZXQsXHJcblx0XHRcdFx0Y29uZmlndXJhYmxlOiB0cnVlLFxyXG5cdFx0XHRcdGVudW1lcmFibGU6IGZhbHNlLFxyXG5cdFx0XHR9KTtcclxuXHRcdFx0cmV0dXJuIG87XHJcblx0XHR9XHJcblxyXG5cdFx0ZXhwb3J0IGZ1bmN0aW9uIG1hcDxULCBWPihvOiBULCBtYXBwZXI6ICh2OiBWYWx1ZU9mPFQ+LCBrOiBrZXlvZiBULCBvOiBUKSA9PiBWKTogTWFwcGVkT2JqZWN0PFQsIFY+IHtcclxuXHRcdFx0bGV0IGVudHJpZXMgPSBPYmplY3QuZW50cmllcyhvKSBhcyBba2V5b2YgVCwgVmFsdWVPZjxUPl1bXTtcclxuXHRcdFx0cmV0dXJuIE9iamVjdC5mcm9tRW50cmllcyhlbnRyaWVzLm1hcCgoW2ssIHZdKSA9PiBbaywgbWFwcGVyKHYsIGssIG8pXSkpIGFzIE1hcHBlZE9iamVjdDxULCBWPjtcclxuXHRcdH1cclxuXHR9XHJcblxyXG59IiwibmFtZXNwYWNlIFBvb3BKcyB7XHJcblxyXG5cdGV4cG9ydCBuYW1lc3BhY2UgUXVlcnlTZWxlY3RvciB7XHJcblxyXG5cdFx0ZXhwb3J0IG5hbWVzcGFjZSBXaW5kb3dRIHtcclxuXHRcdFx0ZXhwb3J0IGZ1bmN0aW9uIHE8SyBleHRlbmRzIGtleW9mIEhUTUxFbGVtZW50VGFnTmFtZU1hcD4oc2VsZWN0b3I6IEspOiBIVE1MRWxlbWVudFRhZ05hbWVNYXBbS107XHJcblx0XHRcdGV4cG9ydCBmdW5jdGlvbiBxPFMgZXh0ZW5kcyBzZWxlY3RvciwgTiA9IFRhZ05hbWVGcm9tU2VsZWN0b3I8Uz4+KHNlbGVjdG9yOiBTKTogVGFnRWxlbWVudEZyb21UYWdOYW1lPE4+O1xyXG5cdFx0XHRleHBvcnQgZnVuY3Rpb24gcTxFIGV4dGVuZHMgRWxlbWVudD4oc2VsZWN0b3I6IHNlbGVjdG9yKTogRTtcclxuXHRcdFx0ZXhwb3J0IGZ1bmN0aW9uIHE8SyBleHRlbmRzIGtleW9mIEhUTUxFbGVtZW50VGFnTmFtZU1hcD4oc2VsZWN0b3I6IHNlbGVjdG9yKTogSFRNTEVsZW1lbnRUYWdOYW1lTWFwW0tdO1xyXG5cdFx0XHRleHBvcnQgZnVuY3Rpb24gcShzZWxlY3Rvcjogc3RyaW5nKSB7XHJcblx0XHRcdFx0cmV0dXJuICh0aGlzPy5kb2N1bWVudCA/PyBkb2N1bWVudCkucXVlcnlTZWxlY3RvcihzZWxlY3Rvcik7XHJcblx0XHRcdH1cclxuXHJcblx0XHRcdGV4cG9ydCBmdW5jdGlvbiBxcTxLIGV4dGVuZHMga2V5b2YgSFRNTEVsZW1lbnRUYWdOYW1lTWFwPihzZWxlY3RvcjogSyk6IChIVE1MRWxlbWVudFRhZ05hbWVNYXBbS10pW107XHJcblx0XHRcdGV4cG9ydCBmdW5jdGlvbiBxcTxTIGV4dGVuZHMgc2VsZWN0b3IsIE4gPSBUYWdOYW1lRnJvbVNlbGVjdG9yPFM+PihzZWxlY3RvcjogUyk6IFRhZ0VsZW1lbnRGcm9tVGFnTmFtZTxOPltdO1xyXG5cdFx0XHRleHBvcnQgZnVuY3Rpb24gcXE8RSBleHRlbmRzIEVsZW1lbnQ+KHNlbGVjdG9yOiBzZWxlY3Rvcik6IEVbXTtcclxuXHRcdFx0ZXhwb3J0IGZ1bmN0aW9uIHFxPEsgZXh0ZW5kcyBrZXlvZiBIVE1MRWxlbWVudFRhZ05hbWVNYXA+KHNlbGVjdG9yOiBzZWxlY3Rvcik6IChIVE1MRWxlbWVudFRhZ05hbWVNYXBbS10pW107XHJcblx0XHRcdGV4cG9ydCBmdW5jdGlvbiBxcShzZWxlY3Rvcjogc3RyaW5nKSB7XHJcblx0XHRcdFx0cmV0dXJuIFsuLi4odGhpcz8uZG9jdW1lbnQgPz8gZG9jdW1lbnQpLnF1ZXJ5U2VsZWN0b3JBbGwoc2VsZWN0b3IpXTtcclxuXHRcdFx0fVxyXG5cdFx0fVxyXG5cclxuXHRcdGV4cG9ydCBuYW1lc3BhY2UgRG9jdW1lbnRRIHtcclxuXHRcdFx0ZXhwb3J0IGZ1bmN0aW9uIHE8SyBleHRlbmRzIGtleW9mIEhUTUxFbGVtZW50VGFnTmFtZU1hcD4odGhpczogRG9jdW1lbnQsIHNlbGVjdG9yOiBLKTogSFRNTEVsZW1lbnRUYWdOYW1lTWFwW0tdO1xyXG5cdFx0XHRleHBvcnQgZnVuY3Rpb24gcTxTIGV4dGVuZHMgc2VsZWN0b3IsIE4gPSBUYWdOYW1lRnJvbVNlbGVjdG9yPFM+Pih0aGlzOiBEb2N1bWVudCwgc2VsZWN0b3I6IFMpOiBUYWdFbGVtZW50RnJvbVRhZ05hbWU8Tj47XHJcblx0XHRcdGV4cG9ydCBmdW5jdGlvbiBxPEUgZXh0ZW5kcyBFbGVtZW50Pih0aGlzOiBEb2N1bWVudCwgc2VsZWN0b3I6IHNlbGVjdG9yKTogRTtcclxuXHRcdFx0ZXhwb3J0IGZ1bmN0aW9uIHE8SyBleHRlbmRzIGtleW9mIEhUTUxFbGVtZW50VGFnTmFtZU1hcD4odGhpczogRG9jdW1lbnQsIHNlbGVjdG9yOiBzZWxlY3Rvcik6IEhUTUxFbGVtZW50VGFnTmFtZU1hcFtLXTtcclxuXHRcdFx0ZXhwb3J0IGZ1bmN0aW9uIHEodGhpczogRG9jdW1lbnQsIHNlbGVjdG9yOiBzdHJpbmcpIHtcclxuXHRcdFx0XHRyZXR1cm4gdGhpcy5kb2N1bWVudEVsZW1lbnQucXVlcnlTZWxlY3RvcihzZWxlY3Rvcik7XHJcblx0XHRcdH1cclxuXHJcblx0XHRcdGV4cG9ydCBmdW5jdGlvbiBxcTxLIGV4dGVuZHMga2V5b2YgSFRNTEVsZW1lbnRUYWdOYW1lTWFwPih0aGlzOiBEb2N1bWVudCwgc2VsZWN0b3I6IEspOiAoSFRNTEVsZW1lbnRUYWdOYW1lTWFwW0tdKVtdO1xyXG5cdFx0XHRleHBvcnQgZnVuY3Rpb24gcXE8UyBleHRlbmRzIHNlbGVjdG9yLCBOID0gVGFnTmFtZUZyb21TZWxlY3RvcjxTPj4odGhpczogRG9jdW1lbnQsIHNlbGVjdG9yOiBTKTogVGFnRWxlbWVudEZyb21UYWdOYW1lPE4+W107XHJcblx0XHRcdGV4cG9ydCBmdW5jdGlvbiBxcTxFIGV4dGVuZHMgRWxlbWVudD4odGhpczogRG9jdW1lbnQsIHNlbGVjdG9yOiBzZWxlY3Rvcik6IEVbXTtcclxuXHRcdFx0ZXhwb3J0IGZ1bmN0aW9uIHFxPEsgZXh0ZW5kcyBrZXlvZiBIVE1MRWxlbWVudFRhZ05hbWVNYXA+KHRoaXM6IERvY3VtZW50LCBzZWxlY3Rvcjogc2VsZWN0b3IpOiAoSFRNTEVsZW1lbnRUYWdOYW1lTWFwW0tdKVtdO1xyXG5cdFx0XHRleHBvcnQgZnVuY3Rpb24gcXEodGhpczogRG9jdW1lbnQsIHNlbGVjdG9yOiBzdHJpbmcpIHtcclxuXHRcdFx0XHRyZXR1cm4gWy4uLnRoaXMuZG9jdW1lbnRFbGVtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoc2VsZWN0b3IpXTtcclxuXHRcdFx0fVxyXG5cdFx0fVxyXG5cclxuXHRcdGV4cG9ydCBuYW1lc3BhY2UgRWxlbWVudFEge1xyXG5cdFx0XHRleHBvcnQgZnVuY3Rpb24gcTxLIGV4dGVuZHMga2V5b2YgSFRNTEVsZW1lbnRUYWdOYW1lTWFwPih0aGlzOiBFbGVtZW50LCBzZWxlY3RvcjogSyk6IEhUTUxFbGVtZW50VGFnTmFtZU1hcFtLXTtcclxuXHRcdFx0ZXhwb3J0IGZ1bmN0aW9uIHE8UyBleHRlbmRzIHNlbGVjdG9yLCBOID0gVGFnTmFtZUZyb21TZWxlY3RvcjxTPj4odGhpczogRWxlbWVudCwgc2VsZWN0b3I6IFMpOiBUYWdFbGVtZW50RnJvbVRhZ05hbWU8Tj47XHJcblx0XHRcdGV4cG9ydCBmdW5jdGlvbiBxPEUgZXh0ZW5kcyBFbGVtZW50Pih0aGlzOiBFbGVtZW50LCBzZWxlY3Rvcjogc2VsZWN0b3IpOiBFO1xyXG5cdFx0XHRleHBvcnQgZnVuY3Rpb24gcTxLIGV4dGVuZHMga2V5b2YgSFRNTEVsZW1lbnRUYWdOYW1lTWFwPih0aGlzOiBFbGVtZW50LCBzZWxlY3Rvcjogc2VsZWN0b3IpOiBIVE1MRWxlbWVudFRhZ05hbWVNYXBbS107XHJcblx0XHRcdGV4cG9ydCBmdW5jdGlvbiBxKHRoaXM6IEVsZW1lbnQsIHNlbGVjdG9yOiBzdHJpbmcpIHtcclxuXHRcdFx0XHRyZXR1cm4gdGhpcy5xdWVyeVNlbGVjdG9yKHNlbGVjdG9yKTtcclxuXHRcdFx0fVxyXG5cclxuXHRcdFx0ZXhwb3J0IGZ1bmN0aW9uIHFxPEsgZXh0ZW5kcyBrZXlvZiBIVE1MRWxlbWVudFRhZ05hbWVNYXA+KHRoaXM6IEVsZW1lbnQsIHNlbGVjdG9yOiBLKTogKEhUTUxFbGVtZW50VGFnTmFtZU1hcFtLXSlbXTtcclxuXHRcdFx0ZXhwb3J0IGZ1bmN0aW9uIHFxPFMgZXh0ZW5kcyBzZWxlY3RvciwgTiA9IFRhZ05hbWVGcm9tU2VsZWN0b3I8Uz4+KHRoaXM6IEVsZW1lbnQsIHNlbGVjdG9yOiBTKTogVGFnRWxlbWVudEZyb21UYWdOYW1lPE4+W107XHJcblx0XHRcdGV4cG9ydCBmdW5jdGlvbiBxcTxFIGV4dGVuZHMgRWxlbWVudD4odGhpczogRWxlbWVudCwgc2VsZWN0b3I6IHNlbGVjdG9yKTogRVtdO1xyXG5cdFx0XHRleHBvcnQgZnVuY3Rpb24gcXE8SyBleHRlbmRzIGtleW9mIEhUTUxFbGVtZW50VGFnTmFtZU1hcD4odGhpczogRWxlbWVudCwgc2VsZWN0b3I6IHNlbGVjdG9yKTogKEhUTUxFbGVtZW50VGFnTmFtZU1hcFtLXSlbXTtcclxuXHRcdFx0ZXhwb3J0IGZ1bmN0aW9uIHFxKHRoaXM6IEVsZW1lbnQsIHNlbGVjdG9yOiBzdHJpbmcpIHtcclxuXHRcdFx0XHRyZXR1cm4gWy4uLnRoaXMucXVlcnlTZWxlY3RvckFsbChzZWxlY3RvcildO1xyXG5cdFx0XHR9XHJcblx0XHR9XHJcblx0fVxyXG5cclxuXHRleHBvcnQgbmFtZXNwYWNlIEVsZW1lbnRFeHRlbnNpb24ge1xyXG5cdFx0ZXhwb3J0IGZ1bmN0aW9uIGVtaXQ8VCBleHRlbmRzIEN1c3RvbUV2ZW50PHsgX2V2ZW50Pzogc3RyaW5nIH0+Pih0aGlzOiBFbGVtZW50LCB0eXBlOiBUWydkZXRhaWwnXVsnX2V2ZW50J10sIGRldGFpbD86IFRbJ2RldGFpbCddKTtcclxuXHRcdGV4cG9ydCBmdW5jdGlvbiBlbWl0PFQ+KHRoaXM6IEVsZW1lbnQsIHR5cGU6IHN0cmluZywgZGV0YWlsPzogVCkge1xyXG5cdFx0XHRsZXQgZXZlbnQgPSBuZXcgQ3VzdG9tRXZlbnQodHlwZSwge1xyXG5cdFx0XHRcdGJ1YmJsZXM6IHRydWUsXHJcblx0XHRcdFx0ZGV0YWlsLFxyXG5cdFx0XHR9KTtcclxuXHRcdFx0dGhpcy5kaXNwYXRjaEV2ZW50KGV2ZW50KTtcclxuXHRcdH1cclxuXHJcblx0XHRleHBvcnQgZnVuY3Rpb24gYXBwZW5kVG88RSBleHRlbmRzIEVsZW1lbnQ+KHRoaXM6IEUsIHBhcmVudDogRWxlbWVudCB8IHNlbGVjdG9yKTogRSB7XHJcblx0XHRcdGlmICh0eXBlb2YgcGFyZW50ID09ICdzdHJpbmcnKSB7XHJcblx0XHRcdFx0cGFyZW50ID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcihwYXJlbnQpO1xyXG5cdFx0XHR9XHJcblx0XHRcdHBhcmVudC5hcHBlbmQodGhpcyk7XHJcblx0XHRcdHJldHVybiB0aGlzO1xyXG5cdFx0fVxyXG5cdH1cclxuXHJcbn1cclxuIiwibmFtZXNwYWNlIFBvb3BKcyB7XHJcblxyXG5cdGV4cG9ydCBuYW1lc3BhY2UgRWxtIHtcclxuXHRcdHR5cGUgQ2hpbGQgPSBOb2RlIHwgc3RyaW5nIHwgbnVtYmVyIHwgYm9vbGVhbjtcclxuXHRcdHR5cGUgU29tZUV2ZW50ID0gRXZlbnQgJiBNb3VzZUV2ZW50ICYgS2V5Ym9hcmRFdmVudCAmIHsgdGFyZ2V0OiBIVE1MRWxlbWVudCB9O1xyXG5cdFx0dHlwZSBMaXN0ZW5lciA9ICgoZXZlbnQ6IFNvbWVFdmVudCkgPT4gYW55KVxyXG5cdFx0XHQmIHsgbmFtZT86IGAkeycnIHwgJ2JvdW5kICd9JHsnb24nIHwgJyd9JHtrZXlvZiBIVE1MRWxlbWVudEV2ZW50TWFwfWAgfCAnJyB9IHwgKChldmVudDogU29tZUV2ZW50KSA9PiBhbnkpO1xyXG5cclxuXHRcdGNvbnN0IGVsbVJlZ2V4ID0gbmV3IFJlZ0V4cChbXHJcblx0XHRcdC9eKD88dGFnPltcXHctXSspLyxcclxuXHRcdFx0LyMoPzxpZD5bXFx3LV0rKS8sXHJcblx0XHRcdC9cXC4oPzxjbGFzcz5bXFx3LV0rKS8sXHJcblx0XHRcdC9cXFsoPzxhdHRyMT5bXFx3LV0rKVxcXS8sXHJcblx0XHRcdC9cXFsoPzxhdHRyMj5bXFx3LV0rKT0oPyFbJ1wiXSkoPzx2YWwyPlteXFxdXSopXFxdLyxcclxuXHRcdFx0L1xcWyg/PGF0dHIzPltcXHctXSspPVwiKD88dmFsMz4oPzpbXlwiXXxcXFxcXCIpKilcIlxcXS8sXHJcblx0XHRcdC9cXFsoPzxhdHRyND5bXFx3LV0rKT1cIig/PHZhbDQ+KD86W14nXXxcXFxcJykqKVwiXFxdLyxcclxuXHRcdF0ubWFwKGUgPT4gZS5zb3VyY2UpLmpvaW4oJ3wnKSwgJ2cnKTtcclxuXHJcblx0XHQvKiogaWYgYGVsbWAgc2hvdWxkIGRpc2FsbG93IGxpc3RlbmVycyBub3QgZXhpc3RpbmcgYXMgYG9uICogYCBwcm9wZXJ0eSBvbiB0aGUgZWxlbWVudCAqL1xyXG5cdFx0ZXhwb3J0IGxldCBhbGxvd09ubHlFeGlzdGluZ0xpc3RlbmVycyA9IHRydWU7XHJcblxyXG5cdFx0LyoqIGlmIGBlbG1gIHNob3VsZCBhbGxvdyBvdmVycmlkaW5nIGBvbiAqIGAgbGlzdGVuZXJzIGlmIG11bHRpcGxlIG9mIHRoZW0gYXJlIHByb3ZpZGVkICovXHJcblx0XHRleHBvcnQgbGV0IGFsbG93T3ZlcnJpZGVPbkxpc3RlbmVycyA9IGZhbHNlO1xyXG5cclxuXHRcdGV4cG9ydCBmdW5jdGlvbiBlbG08SyBleHRlbmRzIGtleW9mIEhUTUxFbGVtZW50VGFnTmFtZU1hcD4oc2VsZWN0b3I6IEssIC4uLmNoaWxkcmVuOiAoQ2hpbGQgfCBMaXN0ZW5lcilbXSk6IEhUTUxFbGVtZW50VGFnTmFtZU1hcFtLXTtcclxuXHRcdGV4cG9ydCBmdW5jdGlvbiBlbG08SyBleHRlbmRzIGtleW9mIEhUTUxFbGVtZW50VGFnTmFtZU1hcD4oc2VsZWN0b3I6IGtleW9mIEhUTUxFbGVtZW50VGFnTmFtZU1hcCBleHRlbmRzIEsgPyBuZXZlciA6IHNlbGVjdG9yLCAuLi5jaGlsZHJlbjogKENoaWxkIHwgTGlzdGVuZXIpW10pOiBIVE1MRWxlbWVudFRhZ05hbWVNYXBbS107XHJcblx0XHRleHBvcnQgZnVuY3Rpb24gZWxtPFMgZXh0ZW5kcyBzZWxlY3RvciwgTiA9IFRhZ05hbWVGcm9tU2VsZWN0b3I8Uz4+KHNlbGVjdG9yOiBTLCAuLi5jaGlsZHJlbjogKENoaWxkIHwgTGlzdGVuZXIpW10pOiBUYWdFbGVtZW50RnJvbVRhZ05hbWU8Tj47XHJcblx0XHRleHBvcnQgZnVuY3Rpb24gZWxtPEUgZXh0ZW5kcyBFbGVtZW50ID0gSFRNTEVsZW1lbnQ+KHNlbGVjdG9yOiBzZWxlY3RvciwgLi4uY2hpbGRyZW46IChDaGlsZCB8IExpc3RlbmVyKVtdKTogRTtcclxuXHRcdGV4cG9ydCBmdW5jdGlvbiBlbG0oKTogSFRNTERpdkVsZW1lbnQ7XHJcblx0XHRleHBvcnQgZnVuY3Rpb24gZWxtKHNlbGVjdG9yOiBzdHJpbmcgPSAnJywgLi4uY2hpbGRyZW46IChDaGlsZCB8IExpc3RlbmVyKVtdKTogSFRNTEVsZW1lbnQge1xyXG5cdFx0XHRpZiAoc2VsZWN0b3IucmVwbGFjZUFsbChlbG1SZWdleCwgJycpICE9ICcnKSB7XHJcblx0XHRcdFx0dGhyb3cgbmV3IEVycm9yKGBpbnZhbGlkIHNlbGVjdG9yOiAke3NlbGVjdG9yfSBgKTtcclxuXHRcdFx0fVxyXG5cdFx0XHRsZXQgZWxlbWVudDogSFRNTEVsZW1lbnQgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKTtcclxuXHRcdFx0Ly8gbGV0IHRhZyA9ICcnO1xyXG5cdFx0XHQvLyBsZXQgZmlyc3RNYXRjaCA9IGZhbHNlO1xyXG5cdFx0XHRmb3IgKGxldCBtYXRjaCBvZiBzZWxlY3Rvci5tYXRjaEFsbChlbG1SZWdleCkpIHtcclxuXHRcdFx0XHRpZiAobWF0Y2guZ3JvdXBzLnRhZykge1xyXG5cdFx0XHRcdFx0Ly8gaWYgKHRhZyAmJiBtYXRjaC5ncm91cHMudGFnICE9IHRhZykge1xyXG5cdFx0XHRcdFx0Ly8gXHR0aHJvdyBuZXcgRXJyb3IoYHNlbGVjdG9yIGhhcyB0d28gZGlmZmVyZW50IHRhZ3MgYXQgb25jZSA6IDwke3RhZ30+IGFuZCA8JHttYXRjaC5ncm91cHMudGFnfT5gKTtcclxuXHRcdFx0XHRcdC8vIH1cclxuXHRcdFx0XHRcdC8vIHRhZyA9IG1hdGNoLmdyb3Vwcy50YWc7XHJcblx0XHRcdFx0XHQvLyBpZiAoIWZpcnN0TWF0Y2gpIHJldHVybiBlbG0odGFnICsgc2VsZWN0b3IsIC4uLmNoaWxkcmVuKTtcclxuXHRcdFx0XHRcdGVsZW1lbnQgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KG1hdGNoLmdyb3Vwcy50YWcpO1xyXG5cdFx0XHRcdH0gZWxzZSBpZiAobWF0Y2guZ3JvdXBzLmlkKSB7XHJcblx0XHRcdFx0XHRlbGVtZW50LmlkID0gbWF0Y2guZ3JvdXBzLmlkO1xyXG5cdFx0XHRcdH0gZWxzZSBpZiAobWF0Y2guZ3JvdXBzLmNsYXNzKSB7XHJcblx0XHRcdFx0XHRlbGVtZW50LmNsYXNzTGlzdC5hZGQobWF0Y2guZ3JvdXBzLmNsYXNzKTtcclxuXHRcdFx0XHR9IGVsc2UgaWYgKG1hdGNoLmdyb3Vwcy5hdHRyMSkge1xyXG5cdFx0XHRcdFx0ZWxlbWVudC5zZXRBdHRyaWJ1dGUobWF0Y2guZ3JvdXBzLmF0dHIxLCBcInRydWVcIik7XHJcblx0XHRcdFx0fSBlbHNlIGlmIChtYXRjaC5ncm91cHMuYXR0cjIpIHtcclxuXHRcdFx0XHRcdGVsZW1lbnQuc2V0QXR0cmlidXRlKG1hdGNoLmdyb3Vwcy5hdHRyMiwgbWF0Y2guZ3JvdXBzLnZhbDIpO1xyXG5cdFx0XHRcdH0gZWxzZSBpZiAobWF0Y2guZ3JvdXBzLmF0dHIzKSB7XHJcblx0XHRcdFx0XHRlbGVtZW50LnNldEF0dHJpYnV0ZShtYXRjaC5ncm91cHMuYXR0cjMsIG1hdGNoLmdyb3Vwcy52YWwzLnJlcGxhY2UoL1xcXFxcIi9nLCAnXCInKSk7XHJcblx0XHRcdFx0fSBlbHNlIGlmIChtYXRjaC5ncm91cHMuYXR0cjQpIHtcclxuXHRcdFx0XHRcdGVsZW1lbnQuc2V0QXR0cmlidXRlKG1hdGNoLmdyb3Vwcy5hdHRyNCwgbWF0Y2guZ3JvdXBzLnZhbDQucmVwbGFjZSgvXFxcXCcvZywgJ1xcJycpKTtcclxuXHRcdFx0XHR9XHJcblx0XHRcdFx0Ly8gZmlyc3RNYXRjaCA9IGZhbHNlO1xyXG5cdFx0XHR9XHJcblx0XHRcdGZvciAobGV0IGxpc3RlbmVyIG9mIGNoaWxkcmVuLmZpbHRlcihlID0+IHR5cGVvZiBlID09ICdmdW5jdGlvbicpIGFzIExpc3RlbmVyW10pIHtcclxuXHRcdFx0XHRsZXQgbmFtZTogc3RyaW5nID0gbGlzdGVuZXIubmFtZTtcclxuXHRcdFx0XHRpZiAoIW5hbWUpIG5hbWUgPSAobGlzdGVuZXIgKyAnJykubWF0Y2goL1xcYig/IWZ1bmN0aW9uXFxiKVxcdysvKVswXTtcclxuXHRcdFx0XHRpZiAoIW5hbWUpIHRocm93IG5ldyBFcnJvcigndHJ5aW5nIHRvIGJpbmQgdW5uYW1lZCBmdW5jdGlvbicpO1xyXG5cdFx0XHRcdGlmIChuYW1lLnN0YXJ0c1dpdGgoJ2JvdW5kICcpKSBuYW1lID0gbmFtZS5zbGljZSgnYm91bmQgJy5sZW5ndGgpO1xyXG5cdFx0XHRcdGlmIChuYW1lLnN0YXJ0c1dpdGgoJ29uJykpIHtcclxuXHRcdFx0XHRcdGlmICghZWxlbWVudC5oYXNPd25Qcm9wZXJ0eShuYW1lKSkgdGhyb3cgbmV3IEVycm9yKGA8ICR7ZWxlbWVudC50YWdOYW1lLnRvTG93ZXJDYXNlKCl9PiBkb2VzIG5vdCBoYXZlIFwiJHtuYW1lfVwiIGxpc3RlbmVyYCk7XHJcblx0XHRcdFx0XHRpZiAoIWFsbG93T3ZlcnJpZGVPbkxpc3RlbmVycyAmJiBlbGVtZW50W25hbWVdKSB0aHJvdyBuZXcgRXJyb3IoJ292ZXJyaWRpbmcgYG9uICogYCBsaXN0ZW5lcnMgaXMgZGlzYWJsZWQnKTtcclxuXHRcdFx0XHRcdGVsZW1lbnRbbmFtZV0gPSBsaXN0ZW5lcjtcclxuXHRcdFx0XHR9IGVsc2Uge1xyXG5cdFx0XHRcdFx0aWYgKGFsbG93T25seUV4aXN0aW5nTGlzdGVuZXJzICYmIGVsZW1lbnRbJ29uJyArIG5hbWVdID09PSB1bmRlZmluZWQpXHJcblx0XHRcdFx0XHRcdHRocm93IG5ldyBFcnJvcihgPCR7ZWxlbWVudC50YWdOYW1lLnRvTG93ZXJDYXNlKCl9PiBkb2VzIG5vdCBoYXZlIFwib24nJHtuYW1lfSdcIiBsaXN0ZW5lcmApO1xyXG5cdFx0XHRcdFx0ZWxlbWVudC5hZGRFdmVudExpc3RlbmVyKG5hbWUsIGxpc3RlbmVyKTtcclxuXHRcdFx0XHR9XHJcblx0XHRcdH1cclxuXHRcdFx0ZWxlbWVudC5hcHBlbmQoLi4uY2hpbGRyZW4uZmlsdGVyKGUgPT4gdHlwZW9mIGUgIT0gJ2Z1bmN0aW9uJykgYXMgKE5vZGUgfCBzdHJpbmcpW10pO1xyXG5cdFx0XHRyZXR1cm4gZWxlbWVudDtcclxuXHRcdH1cclxuXHJcblx0XHRleHBvcnQgZnVuY3Rpb24gcU9yRWxtPEsgZXh0ZW5kcyBrZXlvZiBIVE1MRWxlbWVudFRhZ05hbWVNYXA+KHNlbGVjdG9yOiBLLCBwYXJlbnQ/OiBQYXJlbnROb2RlIHwgc2VsZWN0b3IpOiBIVE1MRWxlbWVudFRhZ05hbWVNYXBbS107XHJcblx0XHRleHBvcnQgZnVuY3Rpb24gcU9yRWxtPFMgZXh0ZW5kcyBzZWxlY3RvciwgTiA9IFRhZ05hbWVGcm9tU2VsZWN0b3I8Uz4+KHNlbGVjdG9yOiBTLCBwYXJlbnQ/OiBQYXJlbnROb2RlIHwgc2VsZWN0b3IpOiBUYWdFbGVtZW50RnJvbVRhZ05hbWU8Tj47XHJcblx0XHRleHBvcnQgZnVuY3Rpb24gcU9yRWxtPEUgZXh0ZW5kcyBFbGVtZW50ID0gSFRNTEVsZW1lbnQ+KHNlbGVjdG9yOiBzdHJpbmcsIHBhcmVudD86IFBhcmVudE5vZGUgfCBzZWxlY3Rvcik6IEU7XHJcblx0XHRleHBvcnQgZnVuY3Rpb24gcU9yRWxtKHNlbGVjdG9yOiBzdHJpbmcsIHBhcmVudD86IFBhcmVudE5vZGUgfCBzdHJpbmcpIHtcclxuXHRcdFx0aWYgKHR5cGVvZiBwYXJlbnQgPT0gJ3N0cmluZycpIHtcclxuXHRcdFx0XHRwYXJlbnQgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKHBhcmVudCkgYXMgUGFyZW50Tm9kZTtcclxuXHRcdFx0XHRpZiAoIXBhcmVudCkgdGhyb3cgbmV3IEVycm9yKCdmYWlsZWQgdG8gZmluZCBwYXJlbnQgZWxlbWVudCcpO1xyXG5cdFx0XHR9XHJcblx0XHRcdGlmIChzZWxlY3Rvci5pbmNsdWRlcygnPicpKSB7XHJcblx0XHRcdFx0bGV0IHBhcmVudFNlbGVjdG9yID0gc2VsZWN0b3Iuc3BsaXQoJz4nKS5zbGljZSgwLCAtMSkuam9pbignPicpO1xyXG5cdFx0XHRcdHNlbGVjdG9yID0gc2VsZWN0b3Iuc3BsaXQoJz4nKS5wb3AoKTtcclxuXHRcdFx0XHRwYXJlbnQgPSAocGFyZW50IHx8IGRvY3VtZW50KS5xdWVyeVNlbGVjdG9yKHBhcmVudFNlbGVjdG9yKSBhcyBQYXJlbnROb2RlO1xyXG5cdFx0XHRcdGlmICghcGFyZW50KSB0aHJvdyBuZXcgRXJyb3IoJ2ZhaWxlZCB0byBmaW5kIHBhcmVudCBlbGVtZW50Jyk7XHJcblx0XHRcdH1cclxuXHRcdFx0bGV0IGNoaWxkID0gKHBhcmVudCB8fCBkb2N1bWVudCkucXVlcnlTZWxlY3RvcihzZWxlY3Rvcik7XHJcblx0XHRcdGlmIChjaGlsZCkgcmV0dXJuIGNoaWxkO1xyXG5cclxuXHRcdFx0Y2hpbGQgPSBlbG0oc2VsZWN0b3IpO1xyXG5cdFx0XHRwYXJlbnQ/LmFwcGVuZChjaGlsZCk7XHJcblx0XHRcdHJldHVybiBjaGlsZDtcclxuXHRcdH1cclxuXHR9XHJcblxyXG59IiwibmFtZXNwYWNlIFBvb3BKcyB7XHJcblx0ZXhwb3J0IGxldCBkZWJ1ZyA9IGZhbHNlO1xyXG5cclxuXHRleHBvcnQgbmFtZXNwYWNlIGV0YyB7XHJcblx0XHRleHBvcnQgZnVuY3Rpb24ga2V5YmluZChrZXk6IHN0cmluZywgZm46IChldmVudDogS2V5Ym9hcmRFdmVudCkgPT4gdm9pZCkge1xyXG5cdFx0XHRsZXQgY29kZSA9IGtleS5sZW5ndGggPT0gMSA/ICdLZXknICsga2V5LnRvVXBwZXJDYXNlKCkgOiBrZXk7XHJcblx0XHRcdGZ1bmN0aW9uIG9ua2V5ZG93bihldmVudDogS2V5Ym9hcmRFdmVudCkge1xyXG5cdFx0XHRcdGlmIChldmVudC5jb2RlID09IGNvZGUpIHtcclxuXHRcdFx0XHRcdGZuKGV2ZW50KTtcclxuXHRcdFx0XHR9XHJcblx0XHRcdH1cclxuXHRcdFx0YWRkRXZlbnRMaXN0ZW5lcigna2V5ZG93bicsIG9ua2V5ZG93bik7XHJcblx0XHRcdHJldHVybiAoKSA9PiByZW1vdmVFdmVudExpc3RlbmVyKCdrZXlkb3duJywgb25rZXlkb3duKTtcclxuXHRcdH1cclxuXHJcblx0XHRleHBvcnQgYXN5bmMgZnVuY3Rpb24gZnVsbHNjcmVlbihvbj86IGJvb2xlYW4pIHtcclxuXHRcdFx0bGV0IGNlbnRyYWwgPSBJbWFnZVNjcm9sbGluZ0V4dGVuc2lvbi5pbWFnZVNjcm9sbGluZ0FjdGl2ZSAmJiBJbWFnZVNjcm9sbGluZ0V4dGVuc2lvbi5nZXRDZW50cmFsSW1nKCk7XHJcblx0XHRcdGlmICghZG9jdW1lbnQuZnVsbHNjcmVlbkVsZW1lbnQpIHtcclxuXHRcdFx0XHRpZiAob24gPT0gZmFsc2UpIHJldHVybjtcclxuXHRcdFx0XHRhd2FpdCBkb2N1bWVudC5kb2N1bWVudEVsZW1lbnQucmVxdWVzdEZ1bGxzY3JlZW4oKS5jYXRjaCgoKSA9PiB7IH0pO1xyXG5cdFx0XHR9IGVsc2Uge1xyXG5cdFx0XHRcdGlmIChvbiA9PSB0cnVlKSByZXR1cm47XHJcblx0XHRcdFx0YXdhaXQgZG9jdW1lbnQuZXhpdEZ1bGxzY3JlZW4oKS5jYXRjaCgoKSA9PiB7IH0pO1xyXG5cdFx0XHR9XHJcblx0XHRcdGlmIChjZW50cmFsKSB7XHJcblx0XHRcdFx0Y2VudHJhbC5zY3JvbGxJbnRvVmlldygpO1xyXG5cdFx0XHR9XHJcblx0XHRcdHJldHVybiAhIWRvY3VtZW50LmZ1bGxzY3JlZW5FbGVtZW50O1xyXG5cdFx0fVxyXG5cclxuXHRcdGV4cG9ydCBmdW5jdGlvbiBhbnliaW5kKGtleU9yRXZlbnQ6IHN0cmluZyB8IG51bWJlciwgZm46IChldmVudDogRXZlbnQpID0+IHZvaWQpIHtcclxuXHRcdFx0aWYgKHR5cGVvZiBrZXlPckV2ZW50ID09IFwibnVtYmVyXCIpIGtleU9yRXZlbnQgPSBrZXlPckV2ZW50ICsgJyc7XHJcblx0XHRcdC8vIGRldGVjdCBpZiBpdCBpcyBldmVudFxyXG5cdFx0XHRsZXQgaXNFdmVudCA9IHdpbmRvdy5oYXNPd25Qcm9wZXJ0eSgnb24nICsga2V5T3JFdmVudCk7XHJcblx0XHRcdGlmIChpc0V2ZW50KSB7XHJcblx0XHRcdFx0YWRkRXZlbnRMaXN0ZW5lcihrZXlPckV2ZW50LCBmbik7XHJcblx0XHRcdFx0cmV0dXJuO1xyXG5cdFx0XHR9XHJcblx0XHRcdC8vIHBhcnNlIGtleSBjb2RlXHJcblx0XHRcdGlmICghaXNOYU4ocGFyc2VJbnQoa2V5T3JFdmVudCkpKSB7XHJcblx0XHRcdFx0a2V5T3JFdmVudCA9IGBEaWdpdCR7a2V5T3JFdmVudH1gO1xyXG5cdFx0XHR9IGVsc2UgaWYgKGtleU9yRXZlbnQubGVuZ3RoID09IDEpIHtcclxuXHRcdFx0XHRrZXlPckV2ZW50ID0gYEtleSR7a2V5T3JFdmVudC50b1VwcGVyQ2FzZSgpfWA7XHJcblx0XHRcdH1cclxuXHRcdFx0YWRkRXZlbnRMaXN0ZW5lcigna2V5ZG93bicsIGV2ID0+IHtcclxuXHRcdFx0XHRpZiAoZXYuY29kZSAhPSBrZXlPckV2ZW50KSByZXR1cm47XHJcblx0XHRcdFx0Zm4oZXYpO1xyXG5cdFx0XHR9KTtcclxuXHRcdH1cclxuXHJcblx0XHRleHBvcnQgZnVuY3Rpb24gZnVsbHNjcmVlbk9uKGtleTogc3RyaW5nKSB7XHJcblx0XHRcdGlmIChrZXkgPT0gJ3Njcm9sbCcpIHtcclxuXHRcdFx0XHRhZGRFdmVudExpc3RlbmVyKCdzY3JvbGwnLCAoKSA9PiBmdWxsc2NyZWVuKHRydWUpKTtcclxuXHRcdFx0XHRyZXR1cm47XHJcblx0XHRcdH1cclxuXHRcdFx0cmV0dXJuIGtleWJpbmQoa2V5LCAoKSA9PiBmdWxsc2NyZWVuKCkpO1xyXG5cdFx0fVxyXG5cclxuXHRcdGV4cG9ydCBmdW5jdGlvbiBmSXNGb3JGdWxsc2NyZWVuKCkge1xyXG5cdFx0XHRrZXliaW5kKCdGJywgKCkgPT4gZnVsbHNjcmVlbigpKTtcclxuXHRcdH1cclxuXHJcblx0XHRleHBvcnQgZnVuY3Rpb24gaGFzaENvZGUodGhpczogc3RyaW5nKTtcclxuXHRcdGV4cG9ydCBmdW5jdGlvbiBoYXNoQ29kZSh2YWx1ZTogc3RyaW5nKTtcclxuXHRcdGV4cG9ydCBmdW5jdGlvbiBoYXNoQ29kZSh0aGlzOiBzdHJpbmcsIHZhbHVlPzogc3RyaW5nKSB7XHJcblx0XHRcdHZhbHVlID8/PSB0aGlzO1xyXG5cdFx0XHRsZXQgaGFzaCA9IDA7XHJcblx0XHRcdGZvciAobGV0IGMgb2YgdmFsdWUpIHtcclxuXHRcdFx0XHRoYXNoID0gKChoYXNoIDw8IDUpIC0gaGFzaCkgKyBjLmNoYXJDb2RlQXQoMCk7XHJcblx0XHRcdFx0aGFzaCA9IGhhc2ggJiBoYXNoO1xyXG5cdFx0XHR9XHJcblx0XHRcdHJldHVybiBoYXNoO1xyXG5cdFx0fVxyXG5cclxuXHRcdGV4cG9ydCBmdW5jdGlvbiBpbml0KCkge1xyXG5cdFx0XHQvLyBTdHJpbmcucHJvdG90eXBlLmhhc2hDb2RlID0gaGFzaENvZGU7XHJcblx0XHR9XHJcblxyXG5cdFx0ZXhwb3J0IGZ1bmN0aW9uIGN1cnJlbnRTY3JpcHRIYXNoKCkge1xyXG5cdFx0XHRyZXR1cm4gaGFzaENvZGUoZG9jdW1lbnQuY3VycmVudFNjcmlwdC5pbm5lckhUTUwpO1xyXG5cdFx0fVxyXG5cclxuXHRcdGV4cG9ydCBmdW5jdGlvbiByZWxvYWRPbkN1cnJlbnRTY3JpcHRDaGFuZ2VkKHNjcmlwdE5hbWU6IHN0cmluZyA9IGxvY2F0aW9uLmhvc3RuYW1lICsgJy51anMnKSB7XHJcblx0XHRcdGxldCBzY3JpcHRJZCA9IGByZWxvYWRPbkN1cnJlbnRTY3JpcHRDaGFuZ2VkXyR7c2NyaXB0TmFtZX1gO1xyXG5cdFx0XHRsZXQgc2NyaXB0SGFzaCA9IGN1cnJlbnRTY3JpcHRIYXNoKCkgKyAnJztcclxuXHRcdFx0bG9jYWxTdG9yYWdlLnNldEl0ZW0oc2NyaXB0SWQsIHNjcmlwdEhhc2gpO1xyXG5cdFx0XHRhZGRFdmVudExpc3RlbmVyKCdmb2N1cycsICgpID0+IHtcclxuXHRcdFx0XHRpZiAobG9jYWxTdG9yYWdlLmdldEl0ZW0oc2NyaXB0SWQpICE9IHNjcmlwdEhhc2gpIHtcclxuXHRcdFx0XHRcdGxvY2F0aW9uLnJlbG9hZCgpO1xyXG5cdFx0XHRcdH1cclxuXHRcdFx0fSk7XHJcblx0XHR9XHJcblxyXG5cdFx0ZXhwb3J0IGxldCBmYXN0U2Nyb2xsOiB7XHJcblx0XHRcdChzcGVlZD86IG51bWJlcik6IHZvaWQ7XHJcblx0XHRcdHNwZWVkPzogbnVtYmVyO1xyXG5cdFx0XHRhY3RpdmU/OiBib29sZWFuO1xyXG5cdFx0XHRvZmY/OiAoKSA9PiB2b2lkO1xyXG5cdFx0fSA9IGZ1bmN0aW9uIChzcGVlZCA9IDAuMjUpIHtcclxuXHRcdFx0aWYgKGZhc3RTY3JvbGwuYWN0aXZlKSBmYXN0U2Nyb2xsLm9mZigpO1xyXG5cdFx0XHRmYXN0U2Nyb2xsLmFjdGl2ZSA9IHRydWU7XHJcblx0XHRcdGZhc3RTY3JvbGwuc3BlZWQgPSBzcGVlZDtcclxuXHRcdFx0ZnVuY3Rpb24gb253aGVlbChldmVudDogTW91c2VFdmVudCAmIHsgd2hlZWxEZWx0YVk6IG51bWJlciB9KSB7XHJcblx0XHRcdFx0aWYgKGV2ZW50LmRlZmF1bHRQcmV2ZW50ZWQpIHJldHVybjtcclxuXHRcdFx0XHRpZiAoZXZlbnQuY3RybEtleSB8fCBldmVudC5zaGlmdEtleSkgcmV0dXJuO1xyXG5cdFx0XHRcdHNjcm9sbEJ5KDAsIC1NYXRoLnNpZ24oZXZlbnQud2hlZWxEZWx0YVkpICogaW5uZXJIZWlnaHQgKiBmYXN0U2Nyb2xsLnNwZWVkKTtcclxuXHRcdFx0XHRldmVudC5wcmV2ZW50RGVmYXVsdCgpO1xyXG5cdFx0XHR9XHJcblx0XHRcdGFkZEV2ZW50TGlzdGVuZXIoJ21vdXNld2hlZWwnLCBvbndoZWVsLCB7IHBhc3NpdmU6IGZhbHNlIH0pO1xyXG5cdFx0XHRmYXN0U2Nyb2xsLm9mZiA9ICgpID0+IHtcclxuXHRcdFx0XHRmYXN0U2Nyb2xsLmFjdGl2ZSA9IGZhbHNlO1xyXG5cdFx0XHRcdHJlbW92ZUV2ZW50TGlzdGVuZXIoJ21vdXNld2hlZWwnLCBvbndoZWVsKTtcclxuXHRcdFx0fVxyXG5cdFx0fVxyXG5cdFx0ZmFzdFNjcm9sbC5hY3RpdmUgPSBmYWxzZTtcclxuXHRcdGZhc3RTY3JvbGwub2ZmID0gKCkgPT4geyB9O1xyXG5cclxuXHJcblxyXG5cdFx0ZXhwb3J0IGZ1bmN0aW9uIG9ucmFmKGY6ICgpID0+IHZvaWQpIHtcclxuXHRcdFx0bGV0IGxvb3AgPSB0cnVlO1xyXG5cdFx0XHR2b2lkIGFzeW5jIGZ1bmN0aW9uICgpIHtcclxuXHRcdFx0XHR3aGlsZSAobG9vcCkge1xyXG5cdFx0XHRcdFx0YXdhaXQgUHJvbWlzZS5mcmFtZSgpO1xyXG5cdFx0XHRcdFx0ZigpO1xyXG5cdFx0XHRcdH1cclxuXHRcdFx0fSgpO1xyXG5cdFx0XHRyZXR1cm4gKCkgPT4geyBsb29wID0gZmFsc2UgfTtcclxuXHRcdH1cclxuXHJcblx0XHRsZXQgcmVzaXplT2JzZXJ2ZXI6IFJlc2l6ZU9ic2VydmVyO1xyXG5cdFx0bGV0IHJlc2l6ZUxpc3RlbmVyczogKChuZXdIZWlnaHQ6IG51bWJlciwgb2xkSGVpZ2h0OiBudW1iZXIpID0+IHZvaWQpW10gPSBbXTtcclxuXHRcdGxldCBwcmV2aW91c0JvZHlIZWlnaHQgPSAwO1xyXG5cdFx0ZXhwb3J0IGZ1bmN0aW9uIG9uaGVpZ2h0Y2hhbmdlKGY6IChuZXdIZWlnaHQ6IG51bWJlciwgb2xkSGVpZ2h0OiBudW1iZXIpID0+IHZvaWQpIHtcclxuXHRcdFx0aWYgKCFyZXNpemVPYnNlcnZlcikge1xyXG5cdFx0XHRcdHByZXZpb3VzQm9keUhlaWdodCA9IGRvY3VtZW50LmJvZHkuY2xpZW50SGVpZ2h0O1xyXG5cdFx0XHRcdHJlc2l6ZU9ic2VydmVyID0gbmV3IFJlc2l6ZU9ic2VydmVyKGVudHJpZXMgPT4ge1xyXG5cdFx0XHRcdFx0Zm9yIChsZXQgZSBvZiBlbnRyaWVzKSB7XHJcblx0XHRcdFx0XHRcdGlmIChlLnRhcmdldCAhPSBkb2N1bWVudC5ib2R5KSBjb250aW51ZTtcclxuXHJcblx0XHRcdFx0XHRcdGxldCBuZXdCb2R5SGVpZ2h0ID0gZS50YXJnZXQuY2xpZW50SGVpZ2h0O1xyXG5cdFx0XHRcdFx0XHRmb3IgKGxldCBmIG9mIHJlc2l6ZUxpc3RlbmVycykge1xyXG5cdFx0XHRcdFx0XHRcdGYobmV3Qm9keUhlaWdodCwgcHJldmlvdXNCb2R5SGVpZ2h0KTtcclxuXHRcdFx0XHRcdFx0fVxyXG5cdFx0XHRcdFx0XHRwcmV2aW91c0JvZHlIZWlnaHQgPSBuZXdCb2R5SGVpZ2h0O1xyXG5cdFx0XHRcdFx0fVxyXG5cdFx0XHRcdH0pO1xyXG5cdFx0XHRcdHJlc2l6ZU9ic2VydmVyLm9ic2VydmUoZG9jdW1lbnQuYm9keSk7XHJcblx0XHRcdH1cclxuXHRcdFx0cmVzaXplTGlzdGVuZXJzLnB1c2goZik7XHJcblx0XHRcdHJldHVybiBmdW5jdGlvbiByZW1vdmVMaXN0ZW5lcigpIHtcclxuXHRcdFx0XHRyZXNpemVMaXN0ZW5lcnMuc3BsaWNlKHJlc2l6ZUxpc3RlbmVycy5pbmRleE9mKGYpKTtcclxuXHRcdFx0fVxyXG5cdFx0fVxyXG5cclxuXHRcdGV4cG9ydCBkZWNsYXJlIGNvbnN0IGtkczoge1xyXG5cdFx0XHRbazogc3RyaW5nXTogc3RyaW5nIHwgKChlOiBLZXlib2FyZEV2ZW50ICYgTW91c2VFdmVudCkgPT4gdm9pZClcclxuXHRcdH07XHJcblxyXG5cdFx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV0YywgJ2tkcycsIHtcclxuXHRcdFx0Y29uZmlndXJhYmxlOiB0cnVlLFxyXG5cdFx0XHRnZXQoKSB7XHJcblx0XHRcdFx0bGV0IGtkcyA9IGluaXRLZHMoKTtcclxuXHRcdFx0XHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXRjLCAna2RzJywgeyB2YWx1ZToga2RzIH0pO1xyXG5cdFx0XHRcdHJldHVybiBrZHM7XHJcblx0XHRcdH0sXHJcblx0XHR9KTtcclxuXHRcdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShQb29wSnMsICdrZHMnLCB7XHJcblx0XHRcdGdldDogKCkgPT4gZXRjLmtkcyxcclxuXHRcdFx0c2V0OiAodikgPT4gT2JqZWN0LmFzc2lnbihldGMua2RzLCB2KSxcclxuXHRcdH0pO1xyXG5cclxuXHRcdGZ1bmN0aW9uIGdlbmVyYXRlS2RzQ29kZXMoZTogS2V5Ym9hcmRFdmVudCAmIE1vdXNlRXZlbnQpIHtcclxuXHRcdFx0bGV0IGJhc2VQcmVmaXggPSBgJHtlLnNoaWZ0S2V5ID8gJzwnIDogJyd9JHtlLmN0cmxLZXkgPyAnXicgOiAnJ30ke2UuYWx0S2V5ID8gJz4nIDogJyd9YDtcclxuXHRcdFx0bGV0IGJhc2VDb2RlID0gZS5jb2RlXHJcblx0XHRcdFx0PyBlLmNvZGUucmVwbGFjZSgvS2V5fERpZ2l0fEFycm93fExlZnR8UmlnaHQvLCAnJylcclxuXHRcdFx0XHQ6IFsnTE1CJywgJ1JNQicsICdNTUInXVtlLmJ1dHRvbl07XHJcblx0XHRcdGxldCBleHRyYUNvZGUgPSBlLmNvZGVcclxuXHRcdFx0XHQ/IGJhc2VDb2RlLnJlcGxhY2UoJ0NvbnRyb2wnLCAnQ3RybCcpXHJcblx0XHRcdFx0OiBiYXNlQ29kZTsvLyBbJ0xlZnQnLCAnUmlnaHQnLCAnTWlkZGxlJ11bZS5idXR0b25dO1xyXG5cdFx0XHRsZXQgcmF3Q29kZSA9IGUuY29kZSA/PyBiYXNlQ29kZTtcclxuXHRcdFx0bGV0IGtleUNvZGUgPSBlLmtleSA/PyBiYXNlQ29kZTtcclxuXHRcdFx0bGV0IGV4dHJhUHJlZml4ID0gYmFzZVByZWZpeC5yZXBsYWNlKFxyXG5cdFx0XHRcdGJhc2VDb2RlID09ICdTaGlmdCcgPyAnPCcgOiBiYXNlQ29kZSA9PSAnQ29udHJvbCcgPyAnXicgOiBiYXNlQ29kZSA9PSAnQWx0JyA/ICc+JyA6ICcnXHJcblx0XHRcdFx0LCAnJyk7XHJcblxyXG5cdFx0XHRsZXQgY29kZXMgPSBbYmFzZUNvZGUsIGV4dHJhQ29kZSwgcmF3Q29kZSwga2V5Q29kZV0uZmxhdE1hcChcclxuXHRcdFx0XHRjID0+IFtiYXNlUHJlZml4LCBleHRyYVByZWZpeF0ubWFwKHAgPT4gcCArIGMpXHJcblx0XHRcdCk7XHJcblx0XHRcdC8vLmZsYXRNYXAoZSA9PiBbZSwgZS50b1VwcGVyQ2FzZSgpLCBlLnRvTG93ZXJDYXNlKCldKTtcclxuXHRcdFx0Y29kZXMucHVzaChlLmNvZGUgPyAna2V5JyA6ICdtb3VzZScpO1xyXG5cdFx0XHRjb2Rlcy5wdXNoKCdhbnknKTtcclxuXHRcdFx0cmV0dXJuIEFycmF5LmZyb20obmV3IFNldChjb2RlcykpO1xyXG5cdFx0fVxyXG5cdFx0ZXhwb3J0IGZ1bmN0aW9uIGtkc0xpc3RlbmVyKGU6IEtleWJvYXJkRXZlbnQgJiBNb3VzZUV2ZW50KSB7XHJcblx0XHRcdGxldCBjb2RlcyA9IGdlbmVyYXRlS2RzQ29kZXMoZSk7XHJcblx0XHRcdE9iamVjdC5hc3NpZ24oZSwgeyBfY29kZXM6IGNvZGVzIH0pO1xyXG5cdFx0XHRmb3IgKGxldCBjIG9mIGNvZGVzKSB7XHJcblx0XHRcdFx0bGV0IGxpc3RlbmVyID0gZXRjLmtkc1tjXTtcclxuXHRcdFx0XHRpZiAodHlwZW9mIGxpc3RlbmVyID09ICdzdHJpbmcnKSB7XHJcblx0XHRcdFx0XHRxKGxpc3RlbmVyKS5jbGljaygpO1xyXG5cdFx0XHRcdH0gZWxzZSBpZiAodHlwZW9mIGxpc3RlbmVyID09ICdmdW5jdGlvbicpIHtcclxuXHRcdFx0XHRcdChldGMua2RzW2NdIGFzIGFueSkoZSk7XHJcblx0XHRcdFx0fVxyXG5cdFx0XHR9XHJcblx0XHR9XHJcblx0XHRmdW5jdGlvbiBpbml0S2RzKCkge1xyXG5cdFx0XHRhZGRFdmVudExpc3RlbmVyKCdrZXlkb3duJywga2RzTGlzdGVuZXIpO1xyXG5cdFx0XHRhZGRFdmVudExpc3RlbmVyKCdtb3VzZWRvd24nLCBrZHNMaXN0ZW5lcik7XHJcblx0XHRcdHJldHVybiB7fTtcclxuXHRcdH1cclxuXHJcblx0XHRleHBvcnQgbGV0IF9rYmRJbml0ZWQgPSBmYWxzZTtcclxuXHRcdGV4cG9ydCBmdW5jdGlvbiBtYWtlS2RzKGtkczogeyBbazogc3RyaW5nXTogc3RyaW5nIHwgKChlOiBLZXlib2FyZEV2ZW50ICYgTW91c2VFdmVudCkgPT4gdm9pZCkgfSkge1xyXG5cdFx0XHRyZXR1cm4gT2JqZWN0LmFzc2lnbihldGMua2RzLCBrZHMpO1xyXG5cdFx0fVxyXG5cdH1cclxuXHRleHBvcnQgZGVjbGFyZSBsZXQga2RzOiB0eXBlb2YgZXRjLmtkcztcclxufVxyXG5cclxuLy8gaW50ZXJmYWNlIFN0cmluZyB7XHJcbi8vIFx0aGFzaENvZGU6ICgpID0+IG51bWJlcjtcclxuLy8gfVxyXG4iLCJuYW1lc3BhY2UgUG9vcEpzIHtcclxuXHJcblx0ZXhwb3J0IHR5cGUgZGVsdGFUaW1lID0gbnVtYmVyIHwgYCR7bnVtYmVyfSR7J3MnIHwgJ2gnIHwgJ2QnIHwgJ3cnIHwgJ3knfWAgfCBudWxsO1xyXG5cclxuXHRleHBvcnQgZnVuY3Rpb24gbm9ybWFsaXplRGVsdGFUaW1lKG1heEFnZTogZGVsdGFUaW1lKSB7XHJcblx0XHRpZiAodHlwZW9mIG1heEFnZSA9PSAnbnVtYmVyJykgcmV0dXJuIG1heEFnZTtcclxuXHRcdGlmICh0eXBlb2YgbWF4QWdlICE9ICdzdHJpbmcnKSByZXR1cm4gSW5maW5pdHk7XHJcblx0XHRjb25zdCBhVG9NID0geyBzOiAxZTMsIGg6IDM2MDBlMywgZDogMjQgKiAzNjAwZTMsIHc6IDcgKiAyNCAqIDM2MDBlMywgeTogMzY1ICogMjQgKiAzNjAwZTMgfTtcclxuXHRcdGxldCBuID0gcGFyc2VGbG9hdChtYXhBZ2UpO1xyXG5cdFx0bGV0IG0gPSBhVG9NW21heEFnZVttYXhBZ2UubGVuZ3RoIC0gMV1dO1xyXG5cdFx0aWYgKG4gIT0gbiB8fCAhbSkgdGhyb3cgbmV3IEVycm9yKCdpbnZhbGlkIGRlbHRhVGltZScpO1xyXG5cdFx0cmV0dXJuIG4gKiBtO1xyXG5cdH1cclxuXHJcblx0ZXhwb3J0IG5hbWVzcGFjZSBGZXRjaEV4dGVuc2lvbiB7XHJcblx0XHRleHBvcnQgdHlwZSBSZXF1ZXN0SW5pdEV4ID0gUmVxdWVzdEluaXQgJiB7IG1heEFnZT86IGRlbHRhVGltZSwgeG1sPzogYm9vbGVhbiB9O1xyXG5cdFx0ZXhwb3J0IHR5cGUgUmVxdWVzdEluaXRFeEpzb24gPSBSZXF1ZXN0SW5pdCAmIHsgbWF4QWdlPzogZGVsdGFUaW1lLCBpbmRleGVkRGI/OiBib29sZWFuIH07XHJcblx0XHRleHBvcnQgbGV0IGRlZmF1bHRzOiBSZXF1ZXN0SW5pdCA9IHsgY3JlZGVudGlhbHM6ICdpbmNsdWRlJyB9O1xyXG5cclxuXHRcdGV4cG9ydCBsZXQgY2FjaGU6IENhY2hlID0gbnVsbDtcclxuXHRcdGFzeW5jIGZ1bmN0aW9uIG9wZW5DYWNoZSgpIHtcclxuXHRcdFx0aWYgKGNhY2hlKSByZXR1cm4gY2FjaGU7XHJcblx0XHRcdGNhY2hlID0gYXdhaXQgY2FjaGVzLm9wZW4oJ2ZldGNoJyk7XHJcblx0XHRcdHJldHVybiBjYWNoZTtcclxuXHRcdH1cclxuXHJcblx0XHRmdW5jdGlvbiB0b0R1cihkdDogZGVsdGFUaW1lKSB7XHJcblx0XHRcdGR0ID0gbm9ybWFsaXplRGVsdGFUaW1lKGR0KTtcclxuXHRcdFx0aWYgKGR0ID4gMWUxMCkgZHQgPSBEYXRlLm5vdygpIC0gZHQ7XHJcblx0XHRcdGxldCBzcGxpdCA9IChuOiBudW1iZXIsIGQ6IG51bWJlcikgPT4gW24gJSBkLCB+fihuIC8gZCldO1xyXG5cdFx0XHRsZXQgdG8yID0gKG46IG51bWJlcikgPT4gKG4gKyAnJykucGFkU3RhcnQoMiwgJzAnKTtcclxuXHRcdFx0dmFyIFttcywgc10gPSBzcGxpdChkdCwgMTAwMCk7XHJcblx0XHRcdHZhciBbcywgbV0gPSBzcGxpdChzLCA2MCk7XHJcblx0XHRcdHZhciBbbSwgaF0gPSBzcGxpdChtLCA2MCk7XHJcblx0XHRcdHZhciBbaCwgZF0gPSBzcGxpdChoLCAyNCk7XHJcblx0XHRcdHZhciBbZCwgd10gPSBzcGxpdChkLCA3KTtcclxuXHRcdFx0cmV0dXJuIHcgPiAxZTMgPyAnZm9yZXZlcicgOiB3ID8gYCR7d313JHtkfWRgIDogZCA/IGAke2R9ZCR7dG8yKGgpfWhgIDogaCArIG0gPyBgJHt0bzIoaCl9OiR7dG8yKG0pfToke3RvMihzKX1gIDogYCR7cyArIH5+bXMgLyAxMDAwfXNgO1xyXG5cdFx0fVxyXG5cclxuXHRcdGV4cG9ydCBmdW5jdGlvbiBpc1N0YWxlKGNhY2hlZEF0OiBudW1iZXIsIG1heEFnZT86IGRlbHRhVGltZSkge1xyXG5cdFx0XHRpZiAobWF4QWdlID09IG51bGwpIHJldHVybiBmYWxzZTtcclxuXHRcdFx0cmV0dXJuIERhdGUubm93KCkgLSBjYWNoZWRBdCA+PSBub3JtYWxpemVEZWx0YVRpbWUobWF4QWdlKTtcclxuXHRcdH1cclxuXHJcblx0XHRleHBvcnQgYXN5bmMgZnVuY3Rpb24gY2FjaGVkKHVybDogc3RyaW5nLCBpbml0OiBSZXF1ZXN0SW5pdEV4ID0ge30pOiBQcm9taXNlPFJlc3BvbnNlPiB7XHJcblx0XHRcdGxldCBub3cgPSBwZXJmb3JtYW5jZS5ub3coKTtcclxuXHRcdFx0bGV0IGNhY2hlID0gYXdhaXQgb3BlbkNhY2hlKCk7XHJcblx0XHRcdGxldCByZXNwb25zZSA9IGF3YWl0IGNhY2hlLm1hdGNoKHVybCk7XHJcblx0XHRcdGlmIChyZXNwb25zZSkge1xyXG5cdFx0XHRcdHJlc3BvbnNlLmNhY2hlZEF0ID0gK3Jlc3BvbnNlLmhlYWRlcnMuZ2V0KCdjYWNoZWQtYXQnKSB8fCAwO1xyXG5cdFx0XHRcdGlmICghaXNTdGFsZShyZXNwb25zZS5jYWNoZWRBdCwgbm9ybWFsaXplRGVsdGFUaW1lKGluaXQubWF4QWdlKSkpIHtcclxuXHRcdFx0XHRcdFBvb3BKcy5kZWJ1ZyAmJiBjb25zb2xlLmxvZyhgQ2FjaGVkIHJlc3BvbnNlOiAke3RvRHVyKHJlc3BvbnNlLmNhY2hlZEF0KX0gPCBjOiR7dG9EdXIoaW5pdC5tYXhBZ2UpfWAsIHVybCk7XHJcblx0XHRcdFx0XHRyZXR1cm4gcmVzcG9uc2U7XHJcblx0XHRcdFx0fVxyXG5cdFx0XHRcdFBvb3BKcy5kZWJ1ZyAmJiBjb25zb2xlLmxvZyhgU3RhbGUgcmVzcG9uc2U6ICR7dG9EdXIocmVzcG9uc2UuY2FjaGVkQXQpfSA+IGM6JHt0b0R1cihpbml0Lm1heEFnZSl9YCwgdXJsKTtcclxuXHRcdFx0fVxyXG5cdFx0XHRyZXNwb25zZSA9XHJcblx0XHRcdFx0IWluaXQueG1sID8gYXdhaXQgZmV0Y2godXJsLCB7IC4uLmRlZmF1bHRzLCAuLi5pbml0IH0pXHJcblx0XHRcdFx0XHQ6IGF3YWl0IHhtbFJlc3BvbnNlKHVybCwgaW5pdCk7XHJcblx0XHRcdGlmIChyZXNwb25zZS5vaykge1xyXG5cdFx0XHRcdHJlc3BvbnNlLmNhY2hlZEF0ID0gRGF0ZS5ub3coKTtcclxuXHRcdFx0XHRsZXQgY2xvbmUgPSByZXNwb25zZS5jbG9uZSgpO1xyXG5cdFx0XHRcdGxldCBpbml0MjogUmVzcG9uc2VJbml0ID0ge1xyXG5cdFx0XHRcdFx0c3RhdHVzOiBjbG9uZS5zdGF0dXMsIHN0YXR1c1RleHQ6IGNsb25lLnN0YXR1c1RleHQsXHJcblx0XHRcdFx0XHRoZWFkZXJzOiBbWydjYWNoZWQtYXQnLCBgJHtyZXNwb25zZS5jYWNoZWRBdH1gXSwgLi4uY2xvbmUuaGVhZGVycy5lbnRyaWVzKCldXHJcblx0XHRcdFx0fTtcclxuXHRcdFx0XHRsZXQgcmVzdWx0UmVzcG9uc2UgPSBuZXcgUmVzcG9uc2UoY2xvbmUuYm9keSwgaW5pdDIpO1xyXG5cdFx0XHRcdGNhY2hlLnB1dCh1cmwsIHJlc3VsdFJlc3BvbnNlKTtcclxuXHRcdFx0XHRsZXQgZHQgPSBwZXJmb3JtYW5jZS5ub3coKSAtIG5vdztcclxuXHRcdFx0XHRQb29wSnMuZGVidWcgJiYgY29uc29sZS5sb2coYExvYWRlZCByZXNwb25zZTogJHt0b0R1cihkdCl9IC8gYzoke3RvRHVyKGluaXQubWF4QWdlKX1gLCB1cmwpO1xyXG5cdFx0XHR9IGVsc2Uge1xyXG5cdFx0XHRcdFBvb3BKcy5kZWJ1ZyAmJiBjb25zb2xlLmxvZyhgRmFpbGVkIHJlc3BvbnNlOiAke3RvRHVyKHJlc3BvbnNlLmNhY2hlZEF0KX0gLyBjOiR7dG9EdXIoaW5pdC5tYXhBZ2UpfWAsIHVybCk7XHJcblx0XHRcdH1cclxuXHRcdFx0cmV0dXJuIHJlc3BvbnNlO1xyXG5cdFx0fVxyXG5cclxuXHRcdGV4cG9ydCBhc3luYyBmdW5jdGlvbiBjYWNoZWREb2ModXJsOiBzdHJpbmcsIGluaXQ6IFJlcXVlc3RJbml0RXggPSB7fSk6IFByb21pc2U8RG9jdW1lbnQ+IHtcclxuXHRcdFx0bGV0IHJlc3BvbnNlID0gYXdhaXQgY2FjaGVkKHVybCwgaW5pdCk7XHJcblx0XHRcdGxldCB0ZXh0ID0gYXdhaXQgcmVzcG9uc2UudGV4dCgpO1xyXG5cdFx0XHRsZXQgcGFyc2VyID0gbmV3IERPTVBhcnNlcigpO1xyXG5cdFx0XHRsZXQgZG9jID0gcGFyc2VyLnBhcnNlRnJvbVN0cmluZyh0ZXh0LCAndGV4dC9odG1sJyk7XHJcblx0XHRcdGxldCBiYXNlID0gZG9jLmNyZWF0ZUVsZW1lbnQoJ2Jhc2UnKTtcclxuXHRcdFx0YmFzZS5ocmVmID0gdXJsO1xyXG5cdFx0XHRkb2MuaGVhZC5hcHBlbmQoYmFzZSk7XHJcblx0XHRcdGRvYy5jYWNoZWRBdCA9IHJlc3BvbnNlLmNhY2hlZEF0O1xyXG5cdFx0XHRyZXR1cm4gZG9jO1xyXG5cdFx0fVxyXG5cclxuXHJcblx0XHRleHBvcnQgYXN5bmMgZnVuY3Rpb24gZG9jKHVybDogc3RyaW5nLCBpbml0OiBSZXF1ZXN0SW5pdEV4ID0ge30pOiBQcm9taXNlPERvY3VtZW50PiB7XHJcblx0XHRcdGxldCByZXNwb25zZSA9IGF3YWl0IGZldGNoKHVybCwgeyAuLi5kZWZhdWx0cywgLi4uaW5pdCB9KTtcclxuXHRcdFx0bGV0IHRleHQgPSBhd2FpdCByZXNwb25zZS50ZXh0KCk7XHJcblx0XHRcdGxldCBwYXJzZXIgPSBuZXcgRE9NUGFyc2VyKCk7XHJcblx0XHRcdGxldCBkb2MgPSBwYXJzZXIucGFyc2VGcm9tU3RyaW5nKHRleHQsICd0ZXh0L2h0bWwnKTtcclxuXHRcdFx0bGV0IGJhc2UgPSBkb2MuY3JlYXRlRWxlbWVudCgnYmFzZScpO1xyXG5cdFx0XHRiYXNlLmhyZWYgPSB1cmw7XHJcblx0XHRcdGRvYy5oZWFkLmFwcGVuZChiYXNlKTtcclxuXHRcdFx0ZG9jLmNhY2hlZEF0ID0gcmVzcG9uc2UuY2FjaGVkQXQ7XHJcblx0XHRcdHJldHVybiBkb2M7XHJcblx0XHR9XHJcblxyXG5cdFx0ZXhwb3J0IGFzeW5jIGZ1bmN0aW9uIHhtbFJlc3BvbnNlKHVybDogc3RyaW5nLCBpbml0OiBSZXF1ZXN0SW5pdEV4ID0ge30pOiBQcm9taXNlPFJlc3BvbnNlPiB7XHJcblx0XHRcdGxldCBwID0gUHJvbWlzZUV4dGVuc2lvbi5lbXB0eSgpO1xyXG5cdFx0XHRsZXQgb1JlcSA9IG5ldyBYTUxIdHRwUmVxdWVzdCgpO1xyXG5cdFx0XHRvUmVxLm9ubG9hZCA9IHAucjtcclxuXHRcdFx0b1JlcS5yZXNwb25zZVR5cGUgPSAnZG9jdW1lbnQnO1xyXG5cdFx0XHRvUmVxLm9wZW4oXCJnZXRcIiwgdXJsLCB0cnVlKTtcclxuXHRcdFx0b1JlcS5zZW5kKCk7XHJcblx0XHRcdGF3YWl0IHA7XHJcblx0XHRcdGlmIChvUmVxLnJlc3BvbnNlVHlwZSAhPSAnZG9jdW1lbnQnKSB0aHJvdyBuZXcgRXJyb3IoJ0ZJWE1FJyk7XHJcblx0XHRcdHJldHVybiBuZXcgUmVzcG9uc2Uob1JlcS5yZXNwb25zZVhNTC5kb2N1bWVudEVsZW1lbnQub3V0ZXJIVE1MLCBpbml0KTtcclxuXHRcdH1cclxuXHJcblx0XHRleHBvcnQgYXN5bmMgZnVuY3Rpb24ganNvbih1cmw6IHN0cmluZywgaW5pdDogUmVxdWVzdEluaXQgPSB7fSk6IFByb21pc2U8dW5rbm93bj4ge1xyXG5cdFx0XHRyZXR1cm4gZmV0Y2godXJsLCB7IC4uLmRlZmF1bHRzLCAuLi5pbml0IH0pLnRoZW4oZSA9PiBlLmpzb24oKSk7XHJcblx0XHR9XHJcblxyXG5cdFx0ZXhwb3J0IGFzeW5jIGZ1bmN0aW9uIGNsZWFyQ2FjaGUoKSB7XHJcblx0XHRcdGNhY2hlID0gbnVsbDtcclxuXHRcdFx0cmV0dXJuIGNhY2hlcy5kZWxldGUoJ2ZldGNoJyk7XHJcblx0XHR9XHJcblxyXG5cdFx0ZXhwb3J0IGFzeW5jIGZ1bmN0aW9uIHVuY2FjaGUodXJsOiBzdHJpbmcpIHtcclxuXHRcdFx0bGV0IGNhY2hlID0gYXdhaXQgb3BlbkNhY2hlKCk7XHJcblx0XHRcdGxldCBkMSA9IGNhY2hlLmRlbGV0ZSh1cmwpO1xyXG5cdFx0XHRsZXQgZDIgPSBhd2FpdCBpZGJEZWxldGUodXJsKTtcclxuXHRcdFx0cmV0dXJuIChhd2FpdCBkMSkgfHwgZDI7XHJcblx0XHR9XHJcblxyXG5cdFx0ZXhwb3J0IGFzeW5jIGZ1bmN0aW9uIGlzQ2FjaGVkKHVybDogc3RyaW5nLCBvcHRpb25zOiB7IG1heEFnZT86IGRlbHRhVGltZSwgaW5kZXhlZERiPzogYm9vbGVhbiB8ICdvbmx5JyB9ID0ge30pOiBQcm9taXNlPGJvb2xlYW4gfCAnaWRiJz4ge1xyXG5cdFx0XHRpZiAob3B0aW9ucy5pbmRleGVkRGIpIHtcclxuXHRcdFx0XHRsZXQgZGJKc29uID0gYXdhaXQgaWRiR2V0KHVybCk7XHJcblx0XHRcdFx0aWYgKGRiSnNvbikge1xyXG5cdFx0XHRcdFx0cmV0dXJuIGlzU3RhbGUoZGJKc29uLmNhY2hlZEF0LCBub3JtYWxpemVEZWx0YVRpbWUob3B0aW9ucy5tYXhBZ2UpKSA/IGZhbHNlIDogJ2lkYic7XHJcblx0XHRcdFx0fVxyXG5cdFx0XHRcdGlmIChvcHRpb25zLmluZGV4ZWREYiA9PSAnb25seScpIHJldHVybiBmYWxzZTtcclxuXHRcdFx0fVxyXG5cdFx0XHRsZXQgY2FjaGUgPSBhd2FpdCBvcGVuQ2FjaGUoKTtcclxuXHRcdFx0bGV0IHJlc3BvbnNlID0gYXdhaXQgY2FjaGUubWF0Y2godXJsKTtcclxuXHRcdFx0aWYgKCFyZXNwb25zZSkgcmV0dXJuIGZhbHNlO1xyXG5cdFx0XHRpZiAob3B0aW9ucz8ubWF4QWdlICE9IG51bGwpIHtcclxuXHRcdFx0XHRsZXQgY2FjaGVkQXQgPSArcmVzcG9uc2UuaGVhZGVycy5nZXQoJ2NhY2hlZC1hdCcpIHx8IDA7XHJcblx0XHRcdFx0aWYgKGlzU3RhbGUocmVzcG9uc2UuY2FjaGVkQXQsIG5vcm1hbGl6ZURlbHRhVGltZShvcHRpb25zLm1heEFnZSkpKSB7XHJcblx0XHRcdFx0XHRyZXR1cm4gZmFsc2U7XHJcblx0XHRcdFx0fVxyXG5cdFx0XHR9XHJcblx0XHRcdHJldHVybiB0cnVlO1xyXG5cdFx0fVxyXG5cclxuXHJcblxyXG5cdFx0ZXhwb3J0IGFzeW5jIGZ1bmN0aW9uIGNhY2hlZEpzb24odXJsOiBzdHJpbmcsIGluaXQ6IFJlcXVlc3RJbml0RXhKc29uID0ge30pOiBQcm9taXNlPHVua25vd24+IHtcclxuXHRcdFx0aWYgKGluaXQuaW5kZXhlZERiKSB7XHJcblx0XHRcdFx0bGV0IGRiSnNvbiA9IGF3YWl0IGlkYkdldCh1cmwpO1xyXG5cdFx0XHRcdGlmIChkYkpzb24pIHtcclxuXHRcdFx0XHRcdGlmICghaXNTdGFsZShkYkpzb24uY2FjaGVkQXQsIGluaXQubWF4QWdlKSkge1xyXG5cdFx0XHRcdFx0XHRPYmplY3RFeHRlbnNpb24uZGVmaW5lVmFsdWUoZGJKc29uLmRhdGEgYXMgYW55LCAnY2FjaGVkJywgZGJKc29uLmNhY2hlZEF0KTtcclxuXHRcdFx0XHRcdFx0cmV0dXJuIGRiSnNvbi5kYXRhO1xyXG5cdFx0XHRcdFx0fVxyXG5cdFx0XHRcdH1cclxuXHRcdFx0fVxyXG5cdFx0XHRsZXQgcmVzcG9uc2UgPSBhd2FpdCBjYWNoZWQodXJsLCBpbml0KTtcclxuXHRcdFx0bGV0IGpzb24gPSBhd2FpdCByZXNwb25zZS5qc29uKCk7XHJcblx0XHRcdGlmICghKCdjYWNoZWQnIGluIGpzb24pKSB7XHJcblx0XHRcdFx0T2JqZWN0RXh0ZW5zaW9uLmRlZmluZVZhbHVlKGpzb24sICdjYWNoZWQnLCByZXNwb25zZS5jYWNoZWRBdCk7XHJcblx0XHRcdH1cclxuXHRcdFx0aWYgKGluaXQuaW5kZXhlZERiKSB7XHJcblx0XHRcdFx0aWRiUHV0KHVybCwganNvbiwgcmVzcG9uc2UuY2FjaGVkQXQpO1xyXG5cdFx0XHR9XHJcblx0XHRcdHJldHVybiBqc29uO1xyXG5cdFx0fVxyXG5cclxuXHJcblx0XHRsZXQgX2lkYkluc3RhbmNlUHJvbWlzZTogSURCRGF0YWJhc2UgfCBQcm9taXNlPElEQkRhdGFiYXNlPiA9IG51bGw7XHJcblx0XHRsZXQgaWRiSW5zdGFuY2U6IElEQkRhdGFiYXNlID0gbnVsbDtcclxuXHJcblx0XHRhc3luYyBmdW5jdGlvbiBvcGVuSWRiKCk6IFByb21pc2U8SURCRGF0YWJhc2U+IHtcclxuXHRcdFx0aWYgKGlkYkluc3RhbmNlKSByZXR1cm4gaWRiSW5zdGFuY2U7XHJcblx0XHRcdGlmIChhd2FpdCBfaWRiSW5zdGFuY2VQcm9taXNlKSB7XHJcblx0XHRcdFx0cmV0dXJuIGlkYkluc3RhbmNlO1xyXG5cdFx0XHR9XHJcblx0XHRcdGxldCBpcnEgPSBpbmRleGVkREIub3BlbignZmV0Y2gnKTtcclxuXHRcdFx0aXJxLm9udXBncmFkZW5lZWRlZCA9IGV2ZW50ID0+IHtcclxuXHRcdFx0XHRsZXQgZGIgPSBpcnEucmVzdWx0O1xyXG5cdFx0XHRcdGxldCBzdG9yZSA9IGRiLmNyZWF0ZU9iamVjdFN0b3JlKCdmZXRjaCcsIHsga2V5UGF0aDogJ3VybCcgfSk7XHJcblx0XHRcdH1cclxuXHRcdFx0X2lkYkluc3RhbmNlUHJvbWlzZSA9IG5ldyBQcm9taXNlKChyLCBqKSA9PiB7XHJcblx0XHRcdFx0aXJxLm9uc3VjY2VzcyA9IHI7XHJcblx0XHRcdFx0aXJxLm9uZXJyb3IgPSBqO1xyXG5cdFx0XHR9KS50aGVuKCgpID0+IGlycS5yZXN1bHQsICgpID0+IG51bGwpO1xyXG5cdFx0XHRpZGJJbnN0YW5jZSA9IF9pZGJJbnN0YW5jZVByb21pc2UgPSBhd2FpdCBfaWRiSW5zdGFuY2VQcm9taXNlO1xyXG5cdFx0XHRpZiAoIWlkYkluc3RhbmNlKSB0aHJvdyBuZXcgRXJyb3IoJ0ZhaWxlZCB0byBvcGVuIGluZGV4ZWREQicpO1xyXG5cdFx0XHRyZXR1cm4gaWRiSW5zdGFuY2U7XHJcblx0XHR9XHJcblxyXG5cdFx0ZXhwb3J0IGFzeW5jIGZ1bmN0aW9uIGlkYkNsZWFyKCkge1xyXG5cdFx0XHR0aHJvdyBuZXcgRXJyb3IoJ1RPRE8nKVxyXG5cdFx0fVxyXG5cclxuXHJcblx0XHRhc3luYyBmdW5jdGlvbiBpZGJHZXQodXJsOiBzdHJpbmcpOiBQcm9taXNlPHsgdXJsOiBzdHJpbmcsIGRhdGE6IHVua25vd24sIGNhY2hlZEF0OiBudW1iZXIgfSB8IHVuZGVmaW5lZD4ge1xyXG5cdFx0XHRsZXQgZGIgPSBhd2FpdCBvcGVuSWRiKCk7XHJcblx0XHRcdGxldCB0ID0gZGIudHJhbnNhY3Rpb24oWydmZXRjaCddLCAncmVhZG9ubHknKTtcclxuXHRcdFx0bGV0IHJxID0gdC5vYmplY3RTdG9yZSgnZmV0Y2gnKS5nZXQodXJsKTtcclxuXHRcdFx0cmV0dXJuIG5ldyBQcm9taXNlKHIgPT4ge1xyXG5cdFx0XHRcdHJxLm9uc3VjY2VzcyA9ICgpID0+IHIocnEucmVzdWx0KTtcclxuXHRcdFx0XHRycS5vbmVycm9yID0gKCkgPT4gcih1bmRlZmluZWQpO1xyXG5cdFx0XHR9KTtcclxuXHRcdH1cclxuXHJcblx0XHRhc3luYyBmdW5jdGlvbiBpZGJQdXQodXJsOiBzdHJpbmcsIGRhdGE6IHVua25vd24sIGNhY2hlZEF0PzogbnVtYmVyKTogUHJvbWlzZTxJREJWYWxpZEtleSB8IHVuZGVmaW5lZD4ge1xyXG5cdFx0XHRsZXQgZGIgPSBhd2FpdCBvcGVuSWRiKCk7XHJcblx0XHRcdGxldCB0ID0gZGIudHJhbnNhY3Rpb24oWydmZXRjaCddLCAncmVhZHdyaXRlJyk7XHJcblx0XHRcdGxldCBycSA9IHQub2JqZWN0U3RvcmUoJ2ZldGNoJykucHV0KHsgdXJsLCBkYXRhLCBjYWNoZWRBdDogY2FjaGVkQXQgPz8gK25ldyBEYXRlKCkgfSk7XHJcblx0XHRcdHJldHVybiBuZXcgUHJvbWlzZShyID0+IHtcclxuXHRcdFx0XHRycS5vbnN1Y2Nlc3MgPSAoKSA9PiByKHJxLnJlc3VsdCk7XHJcblx0XHRcdFx0cnEub25lcnJvciA9ICgpID0+IHIodW5kZWZpbmVkKTtcclxuXHRcdFx0fSk7XHJcblx0XHR9XHJcblxyXG5cdFx0YXN5bmMgZnVuY3Rpb24gaWRiRGVsZXRlKHVybDogc3RyaW5nKTogUHJvbWlzZTxJREJWYWxpZEtleSB8IHVuZGVmaW5lZD4ge1xyXG5cdFx0XHRsZXQgZGIgPSBhd2FpdCBvcGVuSWRiKCk7XHJcblx0XHRcdGxldCB0ID0gZGIudHJhbnNhY3Rpb24oWydmZXRjaCddLCAncmVhZHdyaXRlJyk7XHJcblx0XHRcdGxldCBycSA9IHQub2JqZWN0U3RvcmUoJ2ZldGNoJykuZGVsZXRlKHVybCk7XHJcblx0XHRcdHJldHVybiBuZXcgUHJvbWlzZShyID0+IHtcclxuXHRcdFx0XHRycS5vbnN1Y2Nlc3MgPSAoKSA9PiByKHJxLnJlc3VsdCk7XHJcblx0XHRcdFx0cnEub25lcnJvciA9ICgpID0+IHIodW5kZWZpbmVkKTtcclxuXHRcdFx0fSk7XHJcblx0XHR9XHJcblxyXG5cdH1cclxuXHJcbn0iLCJuYW1lc3BhY2UgUG9vcEpzIHtcclxuXHJcblx0ZXhwb3J0IG5hbWVzcGFjZSBFbnRyeUZpbHRlcmVyRXh0ZW5zaW9uIHtcclxuXHJcblx0XHQvKipcclxuXHRcdCAqIGNhbiBiZSBlaXRoZXIgTWFwIG9yIFdlYWtNYXBcclxuXHRcdCAqIChXZWFrTWFwIGlzIGxpa2VseSB0byBiZSB1c2VsZXNzIGlmIHRoZXJlIGFyZSBsZXNzIHRoZW4gMTBrIG9sZCBub2RlcyBpbiBtYXApXHJcblx0XHQgKi9cclxuXHRcdGxldCBNYXBUeXBlID0gTWFwO1xyXG5cdFx0dHlwZSBNYXBUeXBlPEsgZXh0ZW5kcyBvYmplY3QsIFY+ID0vLyBNYXA8SywgVj4gfCBcclxuXHRcdFx0V2Vha01hcDxLLCBWPjtcclxuXHJcblx0XHRmdW5jdGlvbiB0b0VsQXJyYXkoZW50cnlTZWxlY3Rvcjogc2VsZWN0b3IgfCAoKCkgPT4gSFRNTEVsZW1lbnRbXSkpOiBIVE1MRWxlbWVudFtdIHtcclxuXHRcdFx0cmV0dXJuIHR5cGVvZiBlbnRyeVNlbGVjdG9yID09ICdmdW5jdGlvbicgPyBlbnRyeVNlbGVjdG9yKCkgOiBxcShlbnRyeVNlbGVjdG9yKTtcclxuXHRcdH1cclxuXHJcblx0XHRleHBvcnQgY2xhc3MgRW50cnlGaWx0ZXJlcjxEYXRhIGV4dGVuZHMge30gPSB7fT4ge1xyXG5cdFx0XHRjb250YWluZXI6IEhUTUxFbGVtZW50O1xyXG5cdFx0XHRlbnRyeVNlbGVjdG9yOiBzZWxlY3RvciB8ICgoKSA9PiBIVE1MRWxlbWVudFtdKTtcclxuXHRcdFx0Y29uc3RydWN0b3IoZW50cnlTZWxlY3Rvcjogc2VsZWN0b3IgfCAoKCkgPT4gSFRNTEVsZW1lbnRbXSksIGVuYWJsZWQ6IGJvb2xlYW4gfCAnc29mdCcgPSAnc29mdCcpIHtcclxuXHRcdFx0XHR0aGlzLmVudHJ5U2VsZWN0b3IgPSBlbnRyeVNlbGVjdG9yO1xyXG5cdFx0XHRcdHRoaXMuY29udGFpbmVyID0gZWxtKCcuZWYtY29udGFpbmVyJyk7XHJcblxyXG5cdFx0XHRcdGlmIChlbmFibGVkID09ICdzb2Z0Jykge1xyXG5cdFx0XHRcdFx0dGhpcy5zb2Z0RGlzYWJsZSA9IHRydWU7XHJcblx0XHRcdFx0XHR0aGlzLmRpc2FibGUoJ3NvZnQnKTtcclxuXHRcdFx0XHR9IGVsc2UgaWYgKGVuYWJsZWQpIHtcclxuXHRcdFx0XHRcdHRoaXMuc29mdERpc2FibGUgPSBmYWxzZTtcclxuXHRcdFx0XHR9IGVsc2Uge1xyXG5cdFx0XHRcdFx0Ly8gZW5hYmxlZCBpcyBmYWxzeVxyXG5cdFx0XHRcdFx0dGhpcy5zb2Z0RGlzYWJsZSA9IGZhbHNlO1xyXG5cdFx0XHRcdFx0dGhpcy5kaXNhYmxlKCk7XHJcblx0XHRcdFx0fVxyXG5cdFx0XHRcdHRoaXMuc3R5bGUoKTtcclxuXHJcblx0XHRcdFx0dGhpcy51cGRhdGUoKTtcclxuXHRcdFx0XHRkb2N1bWVudC5hZGRFdmVudExpc3RlbmVyPFBhZ2luYXRlRXh0ZW5zaW9uLlBNb2RpZnlFdmVudD4oJ3BhZ2luYXRpb25tb2RpZnknLCAoKSA9PiB0aGlzLnJlcXVlc3RVcGRhdGUoKSk7XHJcblx0XHRcdFx0ZXRjLm9uaGVpZ2h0Y2hhbmdlKCgpID0+IHRoaXMucmVxdWVzdFVwZGF0ZSgpKTtcclxuXHRcdFx0fVxyXG5cclxuXHRcdFx0ZW50cmllczogSFRNTEVsZW1lbnRbXSA9IFtdO1xyXG5cdFx0XHRlbnRyeURhdGFzOiBNYXBUeXBlPEhUTUxFbGVtZW50LCBEYXRhPiA9IG5ldyBNYXBUeXBlKCk7XHJcblxyXG5cdFx0XHRnZXREYXRhKGVsOiBIVE1MRWxlbWVudCk6IERhdGE7XHJcblx0XHRcdGdldERhdGEoKTogRGF0YVtdO1xyXG5cdFx0XHRnZXREYXRhKGVsPzogSFRNTEVsZW1lbnQpOiBEYXRhIHwgRGF0YVtdIHtcclxuXHRcdFx0XHRpZiAoIWVsKSByZXR1cm4gdGhpcy5lbnRyaWVzLm1hcChlID0+IHRoaXMuZ2V0RGF0YShlKSk7XHJcblx0XHRcdFx0bGV0IGRhdGEgPSB0aGlzLmVudHJ5RGF0YXMuZ2V0KGVsKTtcclxuXHRcdFx0XHRpZiAoIWRhdGEpIHtcclxuXHRcdFx0XHRcdGRhdGEgPSB0aGlzLnBhcnNlRW50cnkoZWwpO1xyXG5cdFx0XHRcdFx0dGhpcy5lbnRyeURhdGFzLnNldChlbCwgZGF0YSk7XHJcblx0XHRcdFx0fVxyXG5cdFx0XHRcdHJldHVybiBkYXRhO1xyXG5cdFx0XHR9XHJcblxyXG5cdFx0XHR1cGRhdGVQZW5kaW5nID0gZmFsc2U7XHJcblx0XHRcdHJlcGFyc2VQZW5kaW5nID0gZmFsc2U7XHJcblx0XHRcdHJlcXVlc3RVcGRhdGUocmVwYXJzZSA9IGZhbHNlKSB7XHJcblx0XHRcdFx0aWYgKHRoaXMudXBkYXRlUGVuZGluZykgcmV0dXJuO1xyXG5cdFx0XHRcdHRoaXMudXBkYXRlUGVuZGluZyA9IHRydWU7XHJcblx0XHRcdFx0aWYgKHJlcGFyc2UpIHRoaXMucmVwYXJzZVBlbmRpbmcgPSB0cnVlO1xyXG5cdFx0XHRcdHNldFRpbWVvdXQoKCkgPT4gdGhpcy51cGRhdGUoKSk7XHJcblx0XHRcdH1cclxuXHJcblx0XHRcdHBhcnNlcnM6IFBhcnNlckZuPERhdGE+W10gPSBbXTtcclxuXHRcdFx0d3JpdGVEYXRhQXR0cmlidXRlID0gZmFsc2U7XHJcblx0XHRcdGFkZFBhcnNlcihwYXJzZXI6IFBhcnNlckZuPERhdGE+KSB7XHJcblx0XHRcdFx0dGhpcy5wYXJzZXJzLnB1c2gocGFyc2VyKTtcclxuXHRcdFx0XHR0aGlzLnJlcXVlc3RVcGRhdGUodHJ1ZSk7XHJcblx0XHRcdH1cclxuXHRcdFx0cGFyc2VFbnRyeShlbDogSFRNTEVsZW1lbnQpOiBEYXRhIHtcclxuXHRcdFx0XHRlbC5wYXJlbnRFbGVtZW50LmNsYXNzTGlzdC5hZGQoJ2VmLWVudHJ5LWNvbnRhaW5lcicpO1xyXG5cdFx0XHRcdGVsLmNsYXNzTGlzdC5hZGQoJ2VmLWVudHJ5Jyk7XHJcblxyXG5cdFx0XHRcdGxldCBkYXRhOiBEYXRhID0ge30gYXMgRGF0YTtcclxuXHRcdFx0XHRmb3IgKGxldCBwYXJzZXIgb2YgdGhpcy5wYXJzZXJzKSB7XHJcblx0XHRcdFx0XHRsZXQgbmV3RGF0YSA9IHBhcnNlcihlbCwgZGF0YSk7XHJcblx0XHRcdFx0XHRpZiAoIW5ld0RhdGEgfHwgbmV3RGF0YSA9PSBkYXRhKSBjb250aW51ZTtcclxuXHRcdFx0XHRcdGlmICghSXNQcm9taXNlKG5ld0RhdGEpKSB7XHJcblx0XHRcdFx0XHRcdE9iamVjdC5hc3NpZ24oZGF0YSwgbmV3RGF0YSk7XHJcblx0XHRcdFx0XHRcdGNvbnRpbnVlO1xyXG5cdFx0XHRcdFx0fVxyXG5cdFx0XHRcdFx0bmV3RGF0YS50aGVuKHBOZXdEYXRhID0+IHtcclxuXHRcdFx0XHRcdFx0aWYgKHBOZXdEYXRhICYmIHBOZXdEYXRhICE9IGRhdGEpIHtcclxuXHRcdFx0XHRcdFx0XHRPYmplY3QuYXNzaWduKGRhdGEsIHBOZXdEYXRhKTtcclxuXHRcdFx0XHRcdFx0fVxyXG5cdFx0XHRcdFx0XHR0aGlzLnJlcXVlc3RVcGRhdGUoKTtcclxuXHRcdFx0XHRcdH0pXHJcblx0XHRcdFx0fVxyXG5cdFx0XHRcdGlmICh0aGlzLndyaXRlRGF0YUF0dHJpYnV0ZSkge1xyXG5cdFx0XHRcdFx0ZWwuc2V0QXR0cmlidXRlKCdlZi1kYXRhJywgSlNPTi5zdHJpbmdpZnkoZGF0YSkpO1xyXG5cdFx0XHRcdH1cclxuXHRcdFx0XHRyZXR1cm4gZGF0YTtcclxuXHRcdFx0fVxyXG5cclxuXHRcdFx0YWRkSXRlbTxJVCwgVCBleHRlbmRzIElULCBJUyBleHRlbmRzIEZpbHRlcmVySXRlbVBhcnRpYWwsIFMsIFRTIGV4dGVuZHMgUyAmIElTICYgRmlsdGVyZXJJdGVtU291cmNlPihjb25zdHJ1Y3RvcjogeyBuZXcoZGF0YTogVFMpOiBUIH0sIGxpc3Q6IElUW10sIGRhdGE6IElTLCBzb3VyY2U6IFMpOiBUIHtcclxuXHRcdFx0XHRPYmplY3QuYXNzaWduKGRhdGEsIHNvdXJjZSwgeyBwYXJlbnQ6IHRoaXMgfSk7XHJcblx0XHRcdFx0ZGF0YS5uYW1lID8/PSBkYXRhLmlkO1xyXG5cdFx0XHRcdGxldCBpdGVtID0gbmV3IGNvbnN0cnVjdG9yKGRhdGEgYXMgVFMpO1xyXG5cdFx0XHRcdGxpc3QucHVzaChpdGVtKTtcclxuXHRcdFx0XHRyZXR1cm4gaXRlbTtcclxuXHRcdFx0fVxyXG5cclxuXHRcdFx0ZmlsdGVyczogSUZpbHRlcjxEYXRhPltdID0gW107XHJcblx0XHRcdHNvcnRlcnM6IElTb3J0ZXI8RGF0YT5bXSA9IFtdO1xyXG5cdFx0XHRtb2RpZmllcnM6IElNb2RpZmllcjxEYXRhPltdID0gW107XHJcblxyXG5cdFx0XHRhZGRGaWx0ZXIoaWQ6IHN0cmluZywgZmlsdGVyOiBGaWx0ZXJGbjxEYXRhPiwgZGF0YTogRmlsdGVyUGFydGlhbDxEYXRhPiA9IHt9KTogRmlsdGVyPERhdGE+IHtcclxuXHRcdFx0XHRyZXR1cm4gdGhpcy5hZGRJdGVtKEZpbHRlciwgdGhpcy5maWx0ZXJzLCBkYXRhLCB7IGlkLCBmaWx0ZXIgfSk7XHJcblx0XHRcdH1cclxuXHRcdFx0YWRkVkZpbHRlcjxWIGV4dGVuZHMgbnVtYmVyIHwgc3RyaW5nPihpZDogc3RyaW5nLCBmaWx0ZXI6IFZhbHVlRmlsdGVyRm48RGF0YSwgVj4sIGRhdGE6IFZhbHVlRmlsdGVyUGFydGlhbDxEYXRhLCBWPik6IFZhbHVlRmlsdGVyPERhdGEsIFY+O1xyXG5cdFx0XHRhZGRWRmlsdGVyPFYgZXh0ZW5kcyBudW1iZXIgfCBzdHJpbmc+KGlkOiBzdHJpbmcsIGZpbHRlcjogVmFsdWVGaWx0ZXJGbjxEYXRhLCBWPiwgZGF0YTogVik7XHJcblx0XHRcdGFkZFZGaWx0ZXI8ViBleHRlbmRzIG51bWJlciB8IHN0cmluZz4oaWQ6IHN0cmluZywgZmlsdGVyOiBWYWx1ZUZpbHRlckZuPERhdGEsIFY+LCBkYXRhOiBWYWx1ZUZpbHRlclBhcnRpYWw8RGF0YSwgVj4gfCBWKSB7XHJcblx0XHRcdFx0aWYgKHR5cGVvZiBkYXRhICE9ICdvYmplY3QnIHx8ICFkYXRhKSB7XHJcblx0XHRcdFx0XHRkYXRhID0geyBpbnB1dDogZGF0YSBhcyBWIH07XHJcblx0XHRcdFx0fVxyXG5cdFx0XHRcdHJldHVybiB0aGlzLmFkZEl0ZW0oVmFsdWVGaWx0ZXIsIHRoaXMuZmlsdGVycywgZGF0YSwgeyBpZCwgZmlsdGVyIH0pO1xyXG5cdFx0XHR9XHJcblx0XHRcdGFkZE1GaWx0ZXIoaWQ6IHN0cmluZywgdmFsdWU6IChkYXRhOiBEYXRhLCBlbDogSFRNTEVsZW1lbnQpID0+IHN0cmluZywgZGF0YTogTWF0Y2hGaWx0ZXJTb3VyY2U8RGF0YT4pIHtcclxuXHRcdFx0XHRyZXR1cm4gdGhpcy5hZGRJdGVtKE1hdGNoRmlsdGVyLCB0aGlzLmZpbHRlcnMsIGRhdGEsIHsgaWQsIHZhbHVlIH0pO1xyXG5cdFx0XHR9XHJcblx0XHRcdGFkZFRhZ0ZpbHRlcihpZDogc3RyaW5nLCBkYXRhOiBUYWdGaWx0ZXJTb3VyY2U8RGF0YT4pIHtcclxuXHRcdFx0XHRyZXR1cm4gdGhpcy5hZGRJdGVtKFRhZ0ZpbHRlciwgdGhpcy5maWx0ZXJzLCBkYXRhLCB7IGlkIH0pO1xyXG5cdFx0XHR9XHJcblx0XHRcdGFkZFNvcnRlcjxWIGV4dGVuZHMgbnVtYmVyIHwgc3RyaW5nPihpZDogc3RyaW5nLCBzb3J0ZXI6IFNvcnRlckZuPERhdGEsIFY+LCBkYXRhOiBTb3J0ZXJQYXJ0aWFsU291cmNlPERhdGEsIFY+ID0ge30pOiBTb3J0ZXI8RGF0YSwgVj4ge1xyXG5cdFx0XHRcdHJldHVybiB0aGlzLmFkZEl0ZW0oU29ydGVyLCB0aGlzLnNvcnRlcnMsIGRhdGEsIHsgaWQsIHNvcnRlciB9KTtcclxuXHRcdFx0fVxyXG5cdFx0XHRhZGRNb2RpZmllcihpZDogc3RyaW5nLCBtb2RpZmllcjogTW9kaWZpZXJGbjxEYXRhPiwgZGF0YTogTW9kaWZpZXJQYXJ0aWFsPERhdGE+ID0ge30pOiBNb2RpZmllcjxEYXRhPiB7XHJcblx0XHRcdFx0cmV0dXJuIHRoaXMuYWRkSXRlbShNb2RpZmllciwgdGhpcy5tb2RpZmllcnMsIGRhdGEsIHsgaWQsIG1vZGlmaWVyIH0pO1xyXG5cdFx0XHR9XHJcblx0XHRcdGFkZFByZWZpeChpZDogc3RyaW5nLCBwcmVmaXg6IFByZWZpeGVyRm48RGF0YT4sIGRhdGE6IFByZWZpeGVyUGFydGlhbDxEYXRhPiA9IHt9KTogUHJlZml4ZXI8RGF0YT4ge1xyXG5cdFx0XHRcdHJldHVybiB0aGlzLmFkZEl0ZW0oUHJlZml4ZXIsIHRoaXMubW9kaWZpZXJzLCBkYXRhLCB7IGlkLCBwcmVmaXggfSk7XHJcblx0XHRcdH1cclxuXHRcdFx0YWRkUGFnaW5hdGlvbkluZm8oaWQ6IHN0cmluZyA9ICdwZ2luZm8nLCBkYXRhOiBQYXJ0aWFsPEZpbHRlcmVySXRlbVNvdXJjZT4gPSB7fSkge1xyXG5cdFx0XHRcdHJldHVybiB0aGlzLmFkZEl0ZW0oUGFnaW5hdGlvbkluZm9GaWx0ZXIsIHRoaXMuZmlsdGVycywgZGF0YSwgeyBpZCB9KTtcclxuXHRcdFx0fVxyXG5cclxuXHRcdFx0ZmlsdGVyRW50cmllcygpIHtcclxuXHRcdFx0XHRmb3IgKGxldCBlbCBvZiB0aGlzLmVudHJpZXMpIHtcclxuXHRcdFx0XHRcdGxldCBkYXRhID0gdGhpcy5nZXREYXRhKGVsKTtcclxuXHRcdFx0XHRcdGxldCB2YWx1ZSA9IHRydWU7XHJcblx0XHRcdFx0XHRmb3IgKGxldCBmaWx0ZXIgb2YgdGhpcy5maWx0ZXJzKSB7XHJcblx0XHRcdFx0XHRcdHZhbHVlID0gdmFsdWUgJiYgZmlsdGVyLmFwcGx5KGRhdGEsIGVsKTtcclxuXHRcdFx0XHRcdH1cclxuXHRcdFx0XHRcdGVsLmNsYXNzTGlzdC50b2dnbGUoJ2VmLWZpbHRlcmVkLW91dCcsICF2YWx1ZSk7XHJcblx0XHRcdFx0fVxyXG5cdFx0XHR9XHJcblxyXG5cdFx0XHRfcHJldmlvdXNTdGF0ZSA9IHtcclxuXHRcdFx0XHRhbGxTb3J0ZXJzT2ZmOiB0cnVlLFxyXG5cdFx0XHRcdHVwZGF0ZUR1cmF0aW9uOiAwLFxyXG5cdFx0XHRcdGZpbmlzaGVkQXQ6IDAsXHJcblx0XHRcdH07XHJcblxyXG5cdFx0XHRvcmRlcmVkRW50cmllczogSFRNTEVsZW1lbnRbXSA9IFtdO1xyXG5cdFx0XHRvcmRlck1vZGU6ICdjc3MnIHwgJ3N3YXAnID0gJ2Nzcyc7XHJcblx0XHRcdHNvcnRFbnRyaWVzKCkge1xyXG5cdFx0XHRcdGlmICh0aGlzLmVudHJpZXMubGVuZ3RoIDw9IDEpIHJldHVybjtcclxuXHRcdFx0XHRpZiAodGhpcy5vcmRlcmVkRW50cmllcy5sZW5ndGggPT0gMCkgdGhpcy5vcmRlcmVkRW50cmllcyA9IHRoaXMuZW50cmllcztcclxuXHRcdFx0XHRpZiAodGhpcy5zb3J0ZXJzLmxlbmd0aCA9PSAwKSByZXR1cm47XHJcblxyXG5cdFx0XHRcdGxldCBlbnRyaWVzID0gdGhpcy5lbnRyaWVzO1xyXG5cdFx0XHRcdGxldCBwYWlyczogW0RhdGEsIEhUTUxFbGVtZW50XVtdID0gZW50cmllcy5tYXAoZSA9PiBbdGhpcy5nZXREYXRhKGUpLCBlXSk7XHJcblx0XHRcdFx0bGV0IGFsbE9mZiA9IHRydWU7XHJcblx0XHRcdFx0Zm9yIChsZXQgc29ydGVyIG9mIHRoaXMuc29ydGVycykge1xyXG5cdFx0XHRcdFx0aWYgKHNvcnRlci5tb2RlICE9ICdvZmYnKSB7XHJcblx0XHRcdFx0XHRcdHBhaXJzID0gc29ydGVyLnNvcnQocGFpcnMpO1xyXG5cdFx0XHRcdFx0XHRhbGxPZmYgPSBmYWxzZTtcclxuXHRcdFx0XHRcdH1cclxuXHRcdFx0XHR9XHJcblx0XHRcdFx0ZW50cmllcyA9IHBhaXJzLm1hcChlID0+IGVbMV0pO1xyXG5cdFx0XHRcdGlmICh0aGlzLm9yZGVyTW9kZSA9PSAnc3dhcCcpIHtcclxuXHRcdFx0XHRcdGlmICghZW50cmllcy5ldmVyeSgoZSwgaSkgPT4gZSA9PSB0aGlzLm9yZGVyZWRFbnRyaWVzW2ldKSkge1xyXG5cdFx0XHRcdFx0XHRsZXQgYnIgPSBlbG0oYCR7ZW50cmllc1swXT8udGFnTmFtZX0uZWYtYmVmb3JlLXNvcnRbaGlkZGVuXWApO1xyXG5cdFx0XHRcdFx0XHR0aGlzLm9yZGVyZWRFbnRyaWVzWzBdLmJlZm9yZShicik7XHJcblx0XHRcdFx0XHRcdGJyLmFmdGVyKC4uLmVudHJpZXMpO1xyXG5cdFx0XHRcdFx0XHRici5yZW1vdmUoKTtcclxuXHRcdFx0XHRcdH1cclxuXHRcdFx0XHR9IGVsc2Uge1xyXG5cdFx0XHRcdFx0aWYgKGFsbE9mZiAhPSB0aGlzLl9wcmV2aW91c1N0YXRlLmFsbFNvcnRlcnNPZmYpIHtcclxuXHRcdFx0XHRcdFx0ZW50cmllcy5tYXAoKGUsIGkpID0+IHtcclxuXHRcdFx0XHRcdFx0XHRpZiAoYWxsT2ZmKSB7XHJcblx0XHRcdFx0XHRcdFx0XHRlLmNsYXNzTGlzdC5yZW1vdmUoJ2VmLXJlb3JkZXInKTtcclxuXHRcdFx0XHRcdFx0XHRcdGUucGFyZW50RWxlbWVudC5jbGFzc0xpc3QucmVtb3ZlKCdlZi1yZW9yZGVyLWNvbnRhaW5lcicpO1xyXG5cdFx0XHRcdFx0XHRcdH0gZWxzZSB7XHJcblx0XHRcdFx0XHRcdFx0XHQvLyB1c2UgYGZsZXhgIG9yIGBncmlkYCBjb250YWluZXIgYW5kIGBvcmRlcjp2YXIoLS1lZi1vcmRlcilgIGZvciBjaGlsZHJlbiBcclxuXHRcdFx0XHRcdFx0XHRcdGUuY2xhc3NMaXN0LmFkZCgnZWYtcmVvcmRlcicpO1xyXG5cdFx0XHRcdFx0XHRcdFx0ZS5wYXJlbnRFbGVtZW50LmNsYXNzTGlzdC5hZGQoJ2VmLXJlb3JkZXItY29udGFpbmVyJyk7XHJcblx0XHRcdFx0XHRcdFx0fVxyXG5cdFx0XHRcdFx0XHR9KTtcclxuXHRcdFx0XHRcdH1cclxuXHRcdFx0XHRcdGlmICghYWxsT2ZmKSB7XHJcblx0XHRcdFx0XHRcdGVudHJpZXMubWFwKChlLCBpKSA9PiB7XHJcblx0XHRcdFx0XHRcdFx0ZS5zdHlsZS5zZXRQcm9wZXJ0eSgnLS1lZi1vcmRlcicsIGkgKyAnJyk7XHJcblx0XHRcdFx0XHRcdH0pO1xyXG5cdFx0XHRcdFx0fVxyXG5cdFx0XHRcdH1cclxuXHRcdFx0XHR0aGlzLm9yZGVyZWRFbnRyaWVzID0gZW50cmllcztcclxuXHRcdFx0XHR0aGlzLl9wcmV2aW91c1N0YXRlLmFsbFNvcnRlcnNPZmYgPSBhbGxPZmY7XHJcblx0XHRcdH1cclxuXHJcblx0XHRcdG1vZGlmeUVudHJpZXMoKSB7XHJcblx0XHRcdFx0bGV0IGVudHJpZXMgPSB0aGlzLmVudHJpZXM7XHJcblx0XHRcdFx0bGV0IHBhaXJzOiBbSFRNTEVsZW1lbnQsIERhdGFdW10gPSBlbnRyaWVzLm1hcChlID0+IFtlLCB0aGlzLmdldERhdGEoZSldKTtcclxuXHRcdFx0XHRmb3IgKGxldCBtb2RpZmllciBvZiB0aGlzLm1vZGlmaWVycykge1xyXG5cdFx0XHRcdFx0Zm9yIChsZXQgW2UsIGRdIG9mIHBhaXJzKSB7XHJcblx0XHRcdFx0XHRcdG1vZGlmaWVyLmFwcGx5KGQsIGUpO1xyXG5cdFx0XHRcdFx0fVxyXG5cdFx0XHRcdH1cclxuXHRcdFx0fVxyXG5cclxuXHRcdFx0bW92ZVRvVG9wKGl0ZW06IElTb3J0ZXI8RGF0YT4gfCBJTW9kaWZpZXI8RGF0YT4pIHtcclxuXHRcdFx0XHRpZiAodGhpcy5zb3J0ZXJzLmluY2x1ZGVzKGl0ZW0gYXMgSVNvcnRlcjxEYXRhPikpIHtcclxuXHRcdFx0XHRcdHRoaXMuc29ydGVycy5zcGxpY2UodGhpcy5zb3J0ZXJzLmluZGV4T2YoaXRlbSBhcyBJU29ydGVyPERhdGE+KSwgMSk7XHJcblx0XHRcdFx0XHR0aGlzLnNvcnRlcnMucHVzaChpdGVtIGFzIElTb3J0ZXI8RGF0YT4pO1xyXG5cdFx0XHRcdH1cclxuXHRcdFx0XHRpZiAodGhpcy5tb2RpZmllcnMuaW5jbHVkZXMoaXRlbSBhcyBJTW9kaWZpZXI8RGF0YT4pKSB7XHJcblx0XHRcdFx0XHR0aGlzLm1vZGlmaWVycy5zcGxpY2UodGhpcy5tb2RpZmllcnMuaW5kZXhPZihpdGVtIGFzIElNb2RpZmllcjxEYXRhPiksIDEpO1xyXG5cdFx0XHRcdFx0dGhpcy5tb2RpZmllcnMucHVzaChpdGVtIGFzIElNb2RpZmllcjxEYXRhPik7XHJcblx0XHRcdFx0fVxyXG5cdFx0XHR9XHJcblxyXG5cdFx0XHRmaW5kRW50cmllcygpOiBIVE1MRWxlbWVudFtdIHtcclxuXHRcdFx0XHRyZXR1cm4gdHlwZW9mIHRoaXMuZW50cnlTZWxlY3RvciA9PSAnZnVuY3Rpb24nID8gdGhpcy5lbnRyeVNlbGVjdG9yKCkgOiBxcSh0aGlzLmVudHJ5U2VsZWN0b3IpO1xyXG5cdFx0XHR9XHJcblxyXG5cdFx0XHR1cGRhdGUocmVwYXJzZSA9IHRoaXMucmVwYXJzZVBlbmRpbmcpIHtcclxuXHRcdFx0XHRsZXQgZWFybGllc3RVcGRhdGUgPSB0aGlzLl9wcmV2aW91c1N0YXRlLmZpbmlzaGVkQXQgKyBNYXRoLm1pbigxMDAwLCA4ICogdGhpcy5fcHJldmlvdXNTdGF0ZS51cGRhdGVEdXJhdGlvbik7XHJcblx0XHRcdFx0aWYgKHBlcmZvcm1hbmNlLm5vdygpIDwgZWFybGllc3RVcGRhdGUpIHtcclxuXHRcdFx0XHRcdHJlcXVlc3RBbmltYXRpb25GcmFtZSgoKSA9PiB0aGlzLnVwZGF0ZSgpKTtcclxuXHRcdFx0XHRcdHJldHVybjtcclxuXHRcdFx0XHR9XHJcblx0XHRcdFx0dGhpcy51cGRhdGVQZW5kaW5nID0gZmFsc2U7XHJcblx0XHRcdFx0aWYgKHRoaXMuZGlzYWJsZWQgPT0gdHJ1ZSkgcmV0dXJuO1xyXG5cdFx0XHRcdGxldCBub3cgPSBwZXJmb3JtYW5jZS5ub3coKTtcclxuXHJcblx0XHRcdFx0bGV0IGVudHJpZXMgPSB0aGlzLmZpbmRFbnRyaWVzKCk7XHJcblxyXG5cdFx0XHRcdGlmICh0aGlzLmRpc2FibGVkID09ICdzb2Z0Jykge1xyXG5cdFx0XHRcdFx0aWYgKCFlbnRyaWVzLmxlbmd0aCkgcmV0dXJuO1xyXG5cdFx0XHRcdFx0UG9vcEpzLmRlYnVnICYmIGNvbnNvbGUubG9nKGBFZiBzb2Z0LWVuYWJsZWQ6IHgwPT54JHtlbnRyaWVzLmxlbmd0aH1gLCB0aGlzLmVudHJ5U2VsZWN0b3IsIHRoaXMpO1xyXG5cdFx0XHRcdFx0dGhpcy5lbmFibGUoKTtcclxuXHRcdFx0XHRcdHJldHVybjtcclxuXHRcdFx0XHR9XHJcblx0XHRcdFx0aWYgKHRoaXMuZGlzYWJsZWQgIT0gZmFsc2UpIHRocm93IDA7XHJcblxyXG5cdFx0XHRcdGlmICghZW50cmllcy5sZW5ndGggJiYgdGhpcy5zb2Z0RGlzYWJsZSkge1xyXG5cdFx0XHRcdFx0UG9vcEpzLmRlYnVnICYmIGNvbnNvbGUubG9nKGBFZiBzb2Z0LWRpc2FibGVkOiB4JHt0aGlzLmVuYWJsZS5sZW5ndGh9PT54MGAsIHRoaXMuZW50cnlTZWxlY3RvciwgdGhpcyk7XHJcblx0XHRcdFx0XHR0aGlzLmRpc2FibGUoJ3NvZnQnKTtcclxuXHRcdFx0XHRcdHJldHVybjtcclxuXHRcdFx0XHR9XHJcblxyXG5cdFx0XHRcdGlmIChyZXBhcnNlKSB7XHJcblx0XHRcdFx0XHR0aGlzLmVudHJ5RGF0YXMgPSBuZXcgTWFwVHlwZSgpO1xyXG5cdFx0XHRcdFx0dGhpcy5yZXBhcnNlUGVuZGluZyA9IGZhbHNlO1xyXG5cdFx0XHRcdH1cclxuXHRcdFx0XHRpZiAoIXRoaXMuY29udGFpbmVyLmNsb3Nlc3QoJ2JvZHknKSkge1xyXG5cdFx0XHRcdFx0dGhpcy5jb250YWluZXIuYXBwZW5kVG8oJ2JvZHknKTtcclxuXHRcdFx0XHR9XHJcblx0XHRcdFx0aWYgKHRoaXMuZW50cmllcy5sZW5ndGggIT0gZW50cmllcy5sZW5ndGgpIHtcclxuXHRcdFx0XHRcdFBvb3BKcy5kZWJ1ZyAmJiBjb25zb2xlLmxvZyhgRWYgdXBkYXRlOiB4JHt0aGlzLmVudHJpZXMubGVuZ3RofT0+eCR7ZW50cmllcy5sZW5ndGh9YCwgdGhpcy5lbnRyeVNlbGVjdG9yLCB0aGlzKTtcclxuXHRcdFx0XHRcdC8vIHx8IHRoaXMuZW50cmllc1xyXG5cdFx0XHRcdFx0Ly8gVE9ETzogc29ydCBlbnRyaWVzIGluIGluaXRpYWwgb3JkZXJcclxuXHRcdFx0XHR9XHJcblx0XHRcdFx0dGhpcy5lbnRyaWVzID0gZW50cmllcztcclxuXHRcdFx0XHR0aGlzLmZpbHRlckVudHJpZXMoKTtcclxuXHRcdFx0XHR0aGlzLnNvcnRFbnRyaWVzKCk7XHJcblx0XHRcdFx0dGhpcy5tb2RpZnlFbnRyaWVzKCk7XHJcblx0XHRcdFx0bGV0IHRpbWVVc2VkID0gcGVyZm9ybWFuY2Uubm93KCkgLSBub3c7XHJcblx0XHRcdFx0dGhpcy5fcHJldmlvdXNTdGF0ZS51cGRhdGVEdXJhdGlvbiA9IHRpbWVVc2VkO1xyXG5cdFx0XHRcdHRoaXMuX3ByZXZpb3VzU3RhdGUuZmluaXNoZWRBdCA9IHBlcmZvcm1hbmNlLm5vdygpO1xyXG5cdFx0XHR9XHJcblxyXG5cdFx0XHRvZmZJbmNvbXBhdGlibGUoaW5jb21wYXRpYmxlOiBzdHJpbmdbXSkge1xyXG5cdFx0XHRcdGZvciAobGV0IGZpbHRlciBvZiB0aGlzLmZpbHRlcnMpIHtcclxuXHRcdFx0XHRcdGlmIChpbmNvbXBhdGlibGUuaW5jbHVkZXMoZmlsdGVyLmlkKSkge1xyXG5cdFx0XHRcdFx0XHRmaWx0ZXIudG9nZ2xlTW9kZSgnb2ZmJyk7XHJcblx0XHRcdFx0XHR9XHJcblx0XHRcdFx0fVxyXG5cdFx0XHRcdGZvciAobGV0IHNvcnRlciBvZiB0aGlzLnNvcnRlcnMpIHtcclxuXHRcdFx0XHRcdGlmIChpbmNvbXBhdGlibGUuaW5jbHVkZXMoc29ydGVyLmlkKSkge1xyXG5cdFx0XHRcdFx0XHRzb3J0ZXIudG9nZ2xlTW9kZSgnb2ZmJyk7XHJcblx0XHRcdFx0XHR9XHJcblx0XHRcdFx0fVxyXG5cdFx0XHRcdGZvciAobGV0IG1vZGlmaWVyIG9mIHRoaXMubW9kaWZpZXJzKSB7XHJcblx0XHRcdFx0XHRpZiAoaW5jb21wYXRpYmxlLmluY2x1ZGVzKG1vZGlmaWVyLmlkKSkge1xyXG5cdFx0XHRcdFx0XHRtb2RpZmllci50b2dnbGVNb2RlKCdvZmYnKTtcclxuXHRcdFx0XHRcdH1cclxuXHRcdFx0XHR9XHJcblx0XHRcdH1cclxuXHJcblx0XHRcdHN0eWxlKHMgPSAnJykge1xyXG5cdFx0XHRcdEVudHJ5RmlsdGVyZXIuc3R5bGUocyk7XHJcblx0XHRcdFx0cmV0dXJuIHRoaXM7XHJcblx0XHRcdH1cclxuXHRcdFx0c3RhdGljIHN0eWxlKHMgPSAnJykge1xyXG5cdFx0XHRcdGxldCBzdHlsZSA9IHEoJ3N0eWxlLmVmLXN0eWxlJykgfHwgZWxtKCdzdHlsZS5lZi1zdHlsZScpLmFwcGVuZFRvKCdoZWFkJyk7XHJcblx0XHRcdFx0c3R5bGUuaW5uZXJIVE1MID0gYFxyXG5cdFx0XHRcdFx0LmVmLWNvbnRhaW5lciB7XHJcblx0XHRcdFx0XHRcdGRpc3BsYXk6IGZsZXg7XHJcblx0XHRcdFx0XHRcdGZsZXgtZGlyZWN0aW9uOiBjb2x1bW47XHJcblx0XHRcdFx0XHRcdHBvc2l0aW9uOiBmaXhlZDtcclxuXHRcdFx0XHRcdFx0dG9wOiAwO1xyXG5cdFx0XHRcdFx0XHRyaWdodDogMDtcclxuXHRcdFx0XHRcdFx0ei1pbmRleDogOTk5OTk5OTk5OTk5OTk5OTk5OTtcclxuXHRcdFx0XHRcdFx0bWluLXdpZHRoOiAxMDBweDtcclxuXHRcdFx0XHRcdH1cclxuXHRcdFx0XHRcdC5lZi1lbnRyeSB7fVxyXG5cclxuXHRcdFx0XHRcdC5lZi1maWx0ZXJlZC1vdXQge1xyXG5cdFx0XHRcdFx0XHRkaXNwbGF5OiBub25lICFpbXBvcnRhbnQ7XHJcblx0XHRcdFx0XHR9XHJcblxyXG5cdFx0XHRcdFx0YnV0dG9uLmVmLWl0ZW0ge31cclxuXHRcdFx0XHRcdGJ1dHRvbi5lZi1pdGVtW2VmLW1vZGU9XCJvZmZcIl0ge1xyXG5cdFx0XHRcdFx0XHRiYWNrZ3JvdW5kOiBsaWdodGdyYXk7XHJcblx0XHRcdFx0XHR9XHJcblx0XHRcdFx0XHRidXR0b24uZWYtaXRlbVtlZi1tb2RlPVwib25cIl0ge1xyXG5cdFx0XHRcdFx0XHRiYWNrZ3JvdW5kOiBsaWdodGdyZWVuO1xyXG5cdFx0XHRcdFx0fVxyXG5cdFx0XHRcdFx0YnV0dG9uLmVmLWl0ZW1bZWYtbW9kZT1cIm9wcG9zaXRlXCJdIHtcclxuXHRcdFx0XHRcdFx0YmFja2dyb3VuZDogeWVsbG93O1xyXG5cdFx0XHRcdFx0fVxyXG5cclxuXHRcdFx0XHRcdGJ1dHRvbi5lZi1pdGVtLmVmLWZpbHRlciA+IGlucHV0IHtcclxuXHRcdFx0XHRcdFx0ZmxvYXQ6IHJpZ2h0O1xyXG5cdFx0XHRcdFx0fVxyXG5cclxuXHRcdFx0XHRcdFtlZi1wcmVmaXhdOjpiZWZvcmUge1xyXG5cdFx0XHRcdFx0XHRjb250ZW50OiBhdHRyKGVmLXByZWZpeCk7XHJcblx0XHRcdFx0XHR9XHJcblx0XHRcdFx0XHRbZWYtcG9zdGZpeF06OmFmdGVyIHtcclxuXHRcdFx0XHRcdFx0Y29udGVudDogYXR0cihlZi1wb3N0Zml4KTtcclxuXHRcdFx0XHRcdH1cclxuXHRcdFx0XHRcdFxyXG5cdFx0XHRcdGAgKyBzO1xyXG5cdFx0XHR9XHJcblxyXG5cdFx0XHRzb2Z0RGlzYWJsZSA9IHRydWU7XHJcblx0XHRcdGRpc2FibGVkOiBib29sZWFuIHwgJ3NvZnQnID0gZmFsc2U7XHJcblx0XHRcdGRpc2FibGUoc29mdD86ICdzb2Z0Jykge1xyXG5cdFx0XHRcdHRoaXMuZGlzYWJsZWQgPSB0cnVlO1xyXG5cdFx0XHRcdGlmIChzb2Z0ID09ICdzb2Z0JykgdGhpcy5kaXNhYmxlZCA9ICdzb2Z0JztcclxuXHRcdFx0XHR0aGlzLmNvbnRhaW5lci5yZW1vdmUoKTtcclxuXHRcdFx0fVxyXG5cdFx0XHRlbmFibGUoKSB7XHJcblx0XHRcdFx0dGhpcy5kaXNhYmxlZCA9IGZhbHNlO1xyXG5cdFx0XHRcdHRoaXMudXBkYXRlUGVuZGluZyA9IGZhbHNlO1xyXG5cdFx0XHRcdHRoaXMucmVxdWVzdFVwZGF0ZSgpO1xyXG5cdFx0XHR9XHJcblxyXG5cdFx0XHRjbGVhcigpIHtcclxuXHRcdFx0XHR0aGlzLmVudHJ5RGF0YXMgPSBuZXcgTWFwKCk7XHJcblx0XHRcdFx0dGhpcy5wYXJzZXJzLnNwbGljZSgwLCA5OTkpO1xyXG5cdFx0XHRcdHRoaXMuZmlsdGVycy5zcGxpY2UoMCwgOTk5KS5tYXAoZSA9PiBlLnJlbW92ZSgpKTtcclxuXHRcdFx0XHR0aGlzLnNvcnRlcnMuc3BsaWNlKDAsIDk5OSkubWFwKGUgPT4gZS5yZW1vdmUoKSk7XHJcblx0XHRcdFx0dGhpcy5tb2RpZmllcnMuc3BsaWNlKDAsIDk5OSkubWFwKGUgPT4gZS5yZW1vdmUoKSk7XHJcblx0XHRcdFx0dGhpcy5lbmFibGUoKTtcclxuXHRcdFx0fVxyXG5cclxuXHRcdFx0Z2V0IF9kYXRhcygpIHtcclxuXHRcdFx0XHRyZXR1cm4gdGhpcy5lbnRyaWVzXHJcblx0XHRcdFx0XHQuZmlsdGVyKGUgPT4gIWUuY2xhc3NMaXN0LmNvbnRhaW5zKCdlZi1maWx0ZXJlZC1vdXQnKSlcclxuXHRcdFx0XHRcdC5tYXAoZSA9PiB0aGlzLmdldERhdGEoZSkpO1xyXG5cdFx0XHR9XHJcblxyXG5cdFx0fVxyXG5cclxuXHRcdGZ1bmN0aW9uIElzUHJvbWlzZTxUPihwOiBQcm9taXNlTGlrZTxUPiB8IFQpOiBwIGlzIFByb21pc2VMaWtlPFQ+IHtcclxuXHRcdFx0aWYgKCFwKSByZXR1cm4gZmFsc2U7XHJcblx0XHRcdHJldHVybiB0eXBlb2YgKHAgYXMgUHJvbWlzZUxpa2U8VD4pLnRoZW4gPT0gJ2Z1bmN0aW9uJztcclxuXHRcdH1cclxuXHR9XHJcbn0iLCJuYW1lc3BhY2UgUG9vcEpzIHtcclxuXHRleHBvcnQgY2xhc3MgT2JzZXJ2ZXIge1xyXG5cdFx0XHJcblx0fVxyXG59XHJcblxyXG4vKlxyXG5cclxuZnVuY3Rpb24gb2JzZXJ2ZUNsYXNzQWRkKGNscywgY2IpIHtcclxuXHRsZXQgcXVldWVkID0gZmFsc2U7XHJcblx0YXN5bmMgZnVuY3Rpb24gcnVuKCkge1xyXG5cdFx0aWYgKHF1ZXVlZCkgcmV0dXJuO1xyXG5cdFx0cXVldWVkID0gdHJ1ZTtcclxuXHRcdGF3YWl0IFByb21pc2UuZnJhbWUoKTtcclxuXHRcdHF1ZXVlZCA9IGZhbHNlO1xyXG5cdFx0Y2IoKTtcclxuXHR9XHJcblx0bmV3IE11dGF0aW9uT2JzZXJ2ZXIobGlzdCA9PiB7XHJcblx0XHRmb3IgKGxldCBtciBvZiBsaXN0KSB7XHJcblx0XHRcdGlmIChtci50eXBlID09ICdhdHRyaWJ1dGVzJyAmJiBtci5hdHRyaWJ1dGVOYW1lID09ICdjbGFzcycpIHtcclxuXHRcdFx0XHRpZiAobXIudGFyZ2V0LmNsYXNzTGlzdC5jb250YWlucyhjbHMpKSB7XHJcblx0XHRcdFx0XHRydW4oKTtcclxuXHRcdFx0XHR9XHJcblx0XHRcdH1cclxuXHRcdFx0aWYgKG1yLnR5cGUgPT0gJ2NoaWxkTGlzdCcpIHtcclxuXHRcdFx0XHRmb3IgKGxldCBjaCBvZiBtci5hZGRlZE5vZGVzKSB7XHJcblx0XHRcdFx0XHRpZiAoY2guY2xhc3NMaXN0Py5jb250YWlucyhjbHMpKSB7XHJcblx0XHRcdFx0XHRcdHJ1bigpO1xyXG5cdFx0XHRcdFx0fVxyXG5cdFx0XHRcdH1cclxuXHRcdFx0fVxyXG5cdFx0fVxyXG5cdH0pLm9ic2VydmUoZG9jdW1lbnQuYm9keSwge1xyXG5cdFx0Y2hpbGRMaXN0OiB0cnVlLFxyXG5cdFx0YXR0cmlidXRlczogdHJ1ZSxcclxuXHRcdHN1YnRyZWU6IHRydWUsXHJcblx0fSk7XHJcbn1cclxuXHJcbiovIiwibmFtZXNwYWNlIFBvb3BKcyB7XHJcblxyXG5cdGV4cG9ydCBuYW1lc3BhY2UgUGFnaW5hdGVFeHRlbnNpb24ge1xyXG5cclxuXHRcdGV4cG9ydCB0eXBlIFBSZXF1ZXN0RXZlbnQgPSBDdXN0b21FdmVudDx7XHJcblx0XHRcdHJlYXNvbj86IEtleWJvYXJkRXZlbnQgfCBNb3VzZUV2ZW50LFxyXG5cdFx0XHRjb3VudDogbnVtYmVyLFxyXG5cdFx0XHRjb25zdW1lZDogbnVtYmVyLFxyXG5cdFx0XHRfZXZlbnQ/OiAncGFnaW5hdGlvbnJlcXVlc3QnLFxyXG5cdFx0fT47XHJcblx0XHRleHBvcnQgdHlwZSBQU3RhcnRFdmVudCA9IEN1c3RvbUV2ZW50PHtcclxuXHRcdFx0cGFnaW5hdGU6IFBhZ2luYXRlLFxyXG5cdFx0XHRfZXZlbnQ/OiAncGFnaW5hdGlvbnN0YXJ0JyxcclxuXHRcdH0+O1xyXG5cdFx0ZXhwb3J0IHR5cGUgUEVuZEV2ZW50ID0gQ3VzdG9tRXZlbnQ8e1xyXG5cdFx0XHRwYWdpbmF0ZTogUGFnaW5hdGUsXHJcblx0XHRcdF9ldmVudD86ICdwYWdpbmF0aW9uZW5kJyxcclxuXHRcdH0+O1xyXG5cdFx0ZXhwb3J0IHR5cGUgUE1vZGlmeUV2ZW50ID0gQ3VzdG9tRXZlbnQ8e1xyXG5cdFx0XHRwYWdpbmF0ZTogUGFnaW5hdGUsXHJcblx0XHRcdGFkZGVkOiBIVE1MRWxlbWVudFtdLFxyXG5cdFx0XHRyZW1vdmVkOiBIVE1MRWxlbWVudFtdLFxyXG5cdFx0XHRzZWxlY3Rvcjogc2VsZWN0b3IsXHJcblx0XHRcdF9ldmVudD86ICdwYWdpbmF0aW9ubW9kaWZ5JyxcclxuXHRcdH0+O1xyXG5cclxuXHRcdGV4cG9ydCBjbGFzcyBQYWdpbmF0ZSB7XHJcblx0XHRcdGRvYzogRG9jdW1lbnQ7XHJcblxyXG5cdFx0XHRlbmFibGVkID0gdHJ1ZTtcclxuXHRcdFx0Y29uZGl0aW9uOiBzZWxlY3RvciB8ICgoKSA9PiBib29sZWFuKTtcclxuXHRcdFx0cXVldWVkID0gMDtcclxuXHRcdFx0cnVubmluZyA9IGZhbHNlO1xyXG5cdFx0XHRfaW5pdGVkID0gZmFsc2U7XHJcblx0XHRcdHNoaWZ0UmVxdWVzdENvdW50PzogbnVtYmVyIHwgKCgpID0+IG51bWJlcik7XHJcblxyXG5cdFx0XHRzdGF0aWMgc2hpZnRSZXF1ZXN0Q291bnQgPSAxMDtcclxuXHRcdFx0c3RhdGljIF9pbml0ZWQgPSBmYWxzZTtcclxuXHRcdFx0c3RhdGljIHJlbW92ZURlZmF1bHRSdW5CaW5kaW5nczogKCkgPT4gdm9pZDtcclxuXHRcdFx0c3RhdGljIGFkZERlZmF1bHRSdW5CaW5kaW5ncygpIHtcclxuXHRcdFx0XHRQYWdpbmF0ZS5yZW1vdmVEZWZhdWx0UnVuQmluZGluZ3M/LigpO1xyXG5cdFx0XHRcdGZ1bmN0aW9uIG9ubW91c2Vkb3duKGV2ZW50OiBNb3VzZUV2ZW50KSB7XHJcblx0XHRcdFx0XHRpZiAoZXZlbnQuYnV0dG9uICE9IDEpIHJldHVybjtcclxuXHRcdFx0XHRcdGxldCB0YXJnZXQgPSBldmVudC50YXJnZXQgYXMgRWxlbWVudDtcclxuXHRcdFx0XHRcdGlmICh0YXJnZXQ/LmNsb3Nlc3QoJ2EnKSkgcmV0dXJuO1xyXG5cdFx0XHRcdFx0ZXZlbnQucHJldmVudERlZmF1bHQoKTtcclxuXHRcdFx0XHRcdGxldCBjb3VudCA9IGV2ZW50LnNoaWZ0S2V5ID8gUGFnaW5hdGUuc2hpZnRSZXF1ZXN0Q291bnQgOiAxO1xyXG5cdFx0XHRcdFx0UGFnaW5hdGUucmVxdWVzdFBhZ2luYXRpb24oY291bnQsIGV2ZW50LCB0YXJnZXQpO1xyXG5cdFx0XHRcdH1cclxuXHRcdFx0XHRmdW5jdGlvbiBvbmtleWRvd24oZXZlbnQ6IEtleWJvYXJkRXZlbnQpIHtcclxuXHRcdFx0XHRcdGlmIChldmVudC5jb2RlICE9ICdBbHRSaWdodCcpIHJldHVybjtcclxuXHRcdFx0XHRcdGV2ZW50LnByZXZlbnREZWZhdWx0KCk7XHJcblx0XHRcdFx0XHRsZXQgY291bnQgPSBldmVudC5zaGlmdEtleSA/IFBhZ2luYXRlLnNoaWZ0UmVxdWVzdENvdW50IDogMTtcclxuXHRcdFx0XHRcdGxldCB0YXJnZXQgPSBldmVudC50YXJnZXQgYXMgRWxlbWVudDtcclxuXHRcdFx0XHRcdFBhZ2luYXRlLnJlcXVlc3RQYWdpbmF0aW9uKGNvdW50LCBldmVudCwgdGFyZ2V0KTtcclxuXHRcdFx0XHR9XHJcblx0XHRcdFx0ZG9jdW1lbnQuYWRkRXZlbnRMaXN0ZW5lcignbW91c2Vkb3duJywgb25tb3VzZWRvd24pO1xyXG5cdFx0XHRcdGRvY3VtZW50LmFkZEV2ZW50TGlzdGVuZXIoJ2tleWRvd24nLCBvbmtleWRvd24pO1xyXG5cdFx0XHRcdFBhZ2luYXRlLnJlbW92ZURlZmF1bHRSdW5CaW5kaW5ncyA9ICgpID0+IHtcclxuXHRcdFx0XHRcdGRvY3VtZW50LnJlbW92ZUV2ZW50TGlzdGVuZXIoJ21vdXNlZG93bicsIG9ubW91c2Vkb3duKTtcclxuXHRcdFx0XHRcdGRvY3VtZW50LnJlbW92ZUV2ZW50TGlzdGVuZXIoJ2tleWRvd24nLCBvbmtleWRvd24pO1xyXG5cdFx0XHRcdH1cclxuXHRcdFx0fVxyXG5cdFx0XHRzdGF0aWMgaW5zdGFuY2VzOiBQYWdpbmF0ZVtdID0gW107XHJcblxyXG5cdFx0XHQvLyBsaXN0ZW5lcnNcclxuXHRcdFx0aW5pdCgpIHtcclxuXHRcdFx0XHRpZiAoIVBhZ2luYXRlLnJlbW92ZURlZmF1bHRSdW5CaW5kaW5ncykge1xyXG5cdFx0XHRcdFx0UGFnaW5hdGUuYWRkRGVmYXVsdFJ1bkJpbmRpbmdzKCk7XHJcblx0XHRcdFx0fVxyXG5cdFx0XHRcdGlmICh0aGlzLl9pbml0ZWQpIHJldHVybjtcclxuXHRcdFx0XHRkb2N1bWVudC5hZGRFdmVudExpc3RlbmVyPFBSZXF1ZXN0RXZlbnQ+KCdwYWdpbmF0aW9ucmVxdWVzdCcsIHRoaXMub25QYWdpbmF0aW9uUmVxdWVzdC5iaW5kKHRoaXMpKTtcclxuXHRcdFx0XHRkb2N1bWVudC5hZGRFdmVudExpc3RlbmVyPFBFbmRFdmVudD4oJ3BhZ2luYXRpb25lbmQnLCB0aGlzLm9uUGFnaW5hdGlvbkVuZC5iaW5kKHRoaXMpKTtcclxuXHRcdFx0XHRQYWdpbmF0ZS5pbnN0YW5jZXMucHVzaCh0aGlzKTtcclxuXHRcdFx0XHRpZiAoUG9vcEpzLmRlYnVnKSB7XHJcblx0XHRcdFx0XHRsZXQgYWN0aXZlID0gdGhpcy5jYW5Db25zdW1lUmVxdWVzdCgpID8gJ2FjdGl2ZScgOiAnaW5hY3RpdmUnO1xyXG5cdFx0XHRcdFx0aWYgKGFjdGl2ZSA9PSAnYWN0aXZlJylcclxuXHRcdFx0XHRcdFx0UG9vcEpzLmRlYnVnICYmIGNvbnNvbGUubG9nKGBQYWdpbmF0ZSBpbnN0YW50aWF0ZWQgKCR7YWN0aXZlfSk6IGAsIHRoaXMuZGF0YSk7XHJcblx0XHRcdFx0fVxyXG5cdFx0XHR9XHJcblx0XHRcdG9uUGFnaW5hdGlvblJlcXVlc3QoZXZlbnQ6IFBSZXF1ZXN0RXZlbnQpIHtcclxuXHRcdFx0XHRpZiAodGhpcy5jYW5Db25zdW1lUmVxdWVzdCgpKSB7XHJcblx0XHRcdFx0XHRldmVudC5kZXRhaWwuY29uc3VtZWQrKztcclxuXHRcdFx0XHRcdGxldCBxdWV1ZWQgPSAhZXZlbnQuZGV0YWlsLnJlYXNvbj8uc2hpZnRLZXkgPyBudWxsIDogdHlwZW9mIHRoaXMuc2hpZnRSZXF1ZXN0Q291bnQgPT0gJ2Z1bmN0aW9uJyA/IHRoaXMuc2hpZnRSZXF1ZXN0Q291bnQoKSA6IHRoaXMuc2hpZnRSZXF1ZXN0Q291bnQ7XHJcblx0XHRcdFx0XHR0aGlzLnF1ZXVlZCArPSBxdWV1ZWQgPz8gZXZlbnQuZGV0YWlsLmNvdW50O1xyXG5cdFx0XHRcdH1cclxuXHRcdFx0XHRpZiAoIXRoaXMucnVubmluZyAmJiB0aGlzLnF1ZXVlZCkge1xyXG5cdFx0XHRcdFx0dGhpcy5jb25zdW1lUmVxdWVzdCgpO1xyXG5cdFx0XHRcdH1cclxuXHRcdFx0fTtcclxuXHRcdFx0b25QYWdpbmF0aW9uRW5kKGV2ZW50OiBQRW5kRXZlbnQpIHtcclxuXHRcdFx0XHRpZiAodGhpcy5xdWV1ZWQgJiYgdGhpcy5jYW5Db25zdW1lUmVxdWVzdCgpKSB7XHJcblx0XHRcdFx0XHRyZXF1ZXN0QW5pbWF0aW9uRnJhbWUoKCkgPT4ge1xyXG5cdFx0XHRcdFx0XHRpZiAoIXRoaXMuY2FuQ29uc3VtZVJlcXVlc3QoKSkge1xyXG5cdFx0XHRcdFx0XHRcdGNvbnNvbGUud2FybihgdGhpcyBwYWdpbmF0ZSBjYW4gbm90IHdvcmsgYW55bW9yZWApO1xyXG5cdFx0XHRcdFx0XHRcdHRoaXMucXVldWVkID0gMDtcclxuXHRcdFx0XHRcdFx0fSBlbHNlIHtcclxuXHRcdFx0XHRcdFx0XHR0aGlzLmNvbnN1bWVSZXF1ZXN0KCk7XHJcblx0XHRcdFx0XHRcdH1cclxuXHRcdFx0XHRcdH0pO1xyXG5cdFx0XHRcdH1cclxuXHRcdFx0fVxyXG5cdFx0XHRjYW5Db25zdW1lUmVxdWVzdCgpIHtcclxuXHRcdFx0XHRpZiAoIXRoaXMuZW5hYmxlZCkgcmV0dXJuIGZhbHNlO1xyXG5cdFx0XHRcdGlmICh0aGlzLnJ1bm5pbmcpIHJldHVybiB0cnVlO1xyXG5cdFx0XHRcdGlmICh0aGlzLmNvbmRpdGlvbikge1xyXG5cdFx0XHRcdFx0aWYgKHR5cGVvZiB0aGlzLmNvbmRpdGlvbiA9PSAnZnVuY3Rpb24nKSB7XHJcblx0XHRcdFx0XHRcdGlmICghdGhpcy5jb25kaXRpb24oKSkgcmV0dXJuIGZhbHNlO1xyXG5cdFx0XHRcdFx0fSBlbHNlIHtcclxuXHRcdFx0XHRcdFx0aWYgKCFkb2N1bWVudC5xKHRoaXMuY29uZGl0aW9uKSkgcmV0dXJuIGZhbHNlO1xyXG5cdFx0XHRcdFx0fVxyXG5cdFx0XHRcdH1cclxuXHRcdFx0XHRyZXR1cm4gdHJ1ZTtcclxuXHRcdFx0fVxyXG5cdFx0XHRhc3luYyBjb25zdW1lUmVxdWVzdCgpIHtcclxuXHRcdFx0XHRpZiAodGhpcy5ydW5uaW5nKSByZXR1cm47XHJcblx0XHRcdFx0dGhpcy5xdWV1ZWQtLTtcclxuXHRcdFx0XHR0aGlzLnJ1bm5pbmcgPSB0cnVlO1xyXG5cdFx0XHRcdHRoaXMuZW1pdFN0YXJ0KCk7XHJcblx0XHRcdFx0YXdhaXQgdGhpcy5vbnJ1bj8uKCk7XHJcblx0XHRcdFx0dGhpcy5ydW5uaW5nID0gZmFsc2U7XHJcblx0XHRcdFx0dGhpcy5lbWl0RW5kKCk7XHJcblx0XHRcdH1cclxuXHRcdFx0b25ydW46ICgpID0+IFByb21pc2U8dm9pZD47XHJcblxyXG5cclxuXHRcdFx0Ly8gZW1pdHRlcnNcclxuXHRcdFx0c3RhdGljIHJlcXVlc3RQYWdpbmF0aW9uKGNvdW50ID0gMSwgcmVhc29uPzogUFJlcXVlc3RFdmVudFsnZGV0YWlsJ11bJ3JlYXNvbiddLCB0YXJnZXQ6IEVsZW1lbnQgPSBkb2N1bWVudC5ib2R5KSB7XHJcblx0XHRcdFx0bGV0IGRldGFpbDogUFJlcXVlc3RFdmVudFsnZGV0YWlsJ10gPSB7IGNvdW50LCByZWFzb24sIGNvbnN1bWVkOiAwIH07XHJcblx0XHRcdFx0ZnVuY3Rpb24gZmFpbChldmVudDogUFJlcXVlc3RFdmVudCkge1xyXG5cdFx0XHRcdFx0aWYgKGV2ZW50LmRldGFpbC5jb25zdW1lZCA9PSAwKSB7XHJcblx0XHRcdFx0XHRcdGNvbnNvbGUud2FybihgUGFnaW5hdGlvbiByZXF1ZXN0IGZhaWxlZDogbm8gbGlzdGVuZXJzYCk7XHJcblx0XHRcdFx0XHR9XHJcblx0XHRcdFx0XHRyZW1vdmVFdmVudExpc3RlbmVyKCdwYWdpbmF0aW9ucmVxdWVzdCcsIGZhaWwpO1xyXG5cdFx0XHRcdH1cclxuXHRcdFx0XHRhZGRFdmVudExpc3RlbmVyKCdwYWdpbmF0aW9ucmVxdWVzdCcsIGZhaWwpO1xyXG5cdFx0XHRcdHRhcmdldC5lbWl0PFBSZXF1ZXN0RXZlbnQ+KCdwYWdpbmF0aW9ucmVxdWVzdCcsIHsgY291bnQsIHJlYXNvbiwgY29uc3VtZWQ6IDAgfSk7XHJcblx0XHRcdH1cclxuXHRcdFx0ZW1pdFN0YXJ0KCkge1xyXG5cdFx0XHRcdGRvY3VtZW50LmJvZHkuZW1pdDxQU3RhcnRFdmVudD4oJ3BhZ2luYXRpb25zdGFydCcsIHsgcGFnaW5hdGU6IHRoaXMgfSk7XHJcblx0XHRcdH1cclxuXHRcdFx0ZW1pdE1vZGlmeShhZGRlZCwgcmVtb3ZlZCwgc2VsZWN0b3IpIHtcclxuXHRcdFx0XHRkb2N1bWVudC5ib2R5LmVtaXQ8UE1vZGlmeUV2ZW50PigncGFnaW5hdGlvbm1vZGlmeScsIHsgcGFnaW5hdGU6IHRoaXMsIGFkZGVkLCByZW1vdmVkLCBzZWxlY3RvciB9KTtcclxuXHRcdFx0fVxyXG5cdFx0XHRlbWl0RW5kKCkge1xyXG5cdFx0XHRcdGRvY3VtZW50LmJvZHkuZW1pdDxQRW5kRXZlbnQ+KCdwYWdpbmF0aW9uZW5kJywgeyBwYWdpbmF0ZTogdGhpcyB9KTtcclxuXHRcdFx0fVxyXG5cclxuXHRcdFx0Ly8gZmV0Y2hpbmc6IFxyXG5cdFx0XHRhc3luYyBmZXRjaERvY3VtZW50KGxpbms6IExpbmssIHNwaW5uZXIgPSB0cnVlLCBtYXhBZ2U6IGRlbHRhVGltZSA9IDApOiBQcm9taXNlPERvY3VtZW50PiB7XHJcblx0XHRcdFx0dGhpcy5kb2MgPSBudWxsO1xyXG5cdFx0XHRcdGxldCBhID0gc3Bpbm5lciAmJiBQYWdpbmF0ZS5saW5rVG9BbmNob3IobGluayk7XHJcblx0XHRcdFx0YT8uY2xhc3NMaXN0LmFkZCgncGFnaW5hdGUtc3BpbicpO1xyXG5cdFx0XHRcdGxpbmsgPSBQYWdpbmF0ZS5saW5rVG9VcmwobGluayk7XHJcblx0XHRcdFx0bGV0IGluaXQgPSB7IG1heEFnZSwgeG1sOiB0aGlzLmRhdGEueG1sIH07XHJcblx0XHRcdFx0dGhpcy5kb2MgPSAhbWF4QWdlID8gYXdhaXQgZmV0Y2guZG9jKGxpbmssIGluaXQpIDogYXdhaXQgZmV0Y2guY2FjaGVkLmRvYyhsaW5rLCBpbml0KTtcclxuXHRcdFx0XHRhPy5jbGFzc0xpc3QucmVtb3ZlKCdwYWdpbmF0ZS1zcGluJyk7XHJcblx0XHRcdFx0cmV0dXJuIHRoaXMuZG9jO1xyXG5cdFx0XHR9XHJcblxyXG5cdFx0XHRzdGF0aWMgcHJlZmV0Y2goc291cmNlOiBzZWxlY3Rvcikge1xyXG5cdFx0XHRcdGRvY3VtZW50LnFxPCdhJz4oc291cmNlKS5tYXAoZSA9PiB7XHJcblx0XHRcdFx0XHRpZiAoZS5ocmVmKSB7XHJcblx0XHRcdFx0XHRcdGVsbShgbGlua1tyZWw9XCJwcmVmZXRjaFwiXVtocmVmPVwiJHtlLmhyZWZ9XCJdYCkuYXBwZW5kVG8oJ2hlYWQnKTtcclxuXHRcdFx0XHRcdH1cclxuXHRcdFx0XHRcdC8vIFRPRE86IGlmIGUuc3JjXHJcblx0XHRcdFx0fSk7XHJcblx0XHRcdH1cclxuXHJcblxyXG5cdFx0XHQvLyBtb2RpZmljYXRpb246IFxyXG5cdFx0XHRhZnRlcihzb3VyY2U6IHNlbGVjdG9yLCB0YXJnZXQ6IHNlbGVjdG9yID0gc291cmNlKSB7XHJcblx0XHRcdFx0bGV0IGFkZGVkID0gdGhpcy5kb2MucXEoc291cmNlKTtcclxuXHRcdFx0XHRpZiAoIWFkZGVkLmxlbmd0aCkgcmV0dXJuO1xyXG5cdFx0XHRcdGxldCBmb3VuZCA9IGRvY3VtZW50LnFxKHRhcmdldCk7XHJcblx0XHRcdFx0aWYgKGZvdW5kLmxlbmd0aCA9PSAwKSB0aHJvdyBuZXcgRXJyb3IoYGZhaWxlZCB0byBmaW5kIHdoZXJlIHRvIGFwcGVuZGApO1xyXG5cdFx0XHRcdGZvdW5kLnBvcCgpLmFmdGVyKC4uLmFkZGVkKTtcclxuXHRcdFx0XHR0aGlzLmVtaXRNb2RpZnkoYWRkZWQsIFtdLCBzb3VyY2UpO1xyXG5cdFx0XHR9XHJcblx0XHRcdHJlcGxhY2VFYWNoKHNvdXJjZTogc2VsZWN0b3IsIHRhcmdldDogc2VsZWN0b3IgPSBzb3VyY2UpIHtcclxuXHRcdFx0XHRsZXQgYWRkZWQgPSB0aGlzLmRvYy5xcShzb3VyY2UpO1xyXG5cdFx0XHRcdGxldCByZW1vdmVkID0gZG9jdW1lbnQucXEodGFyZ2V0KTtcclxuXHRcdFx0XHRpZiAoYWRkZWQubGVuZ3RoICE9IHJlbW92ZWQubGVuZ3RoKSB0aHJvdyBuZXcgRXJyb3IoYGFkZGVkL3JlbW92ZWQgY291bnQgbWlzbWF0Y2hgKTtcclxuXHRcdFx0XHRyZW1vdmVkLm1hcCgoZSwgaSkgPT4gZS5yZXBsYWNlV2l0aChhZGRlZFtpXSkpO1xyXG5cdFx0XHRcdHRoaXMuZW1pdE1vZGlmeShhZGRlZCwgcmVtb3ZlZCwgc291cmNlKTtcclxuXHRcdFx0fVxyXG5cdFx0XHRyZXBsYWNlKHNvdXJjZTogc2VsZWN0b3IsIHRhcmdldDogc2VsZWN0b3IgPSBzb3VyY2UpIHtcclxuXHRcdFx0XHRsZXQgYWRkZWQgPSB0aGlzLmRvYy5xcShzb3VyY2UpO1xyXG5cdFx0XHRcdGxldCByZW1vdmVkID0gZG9jdW1lbnQucXEodGFyZ2V0KTtcclxuXHRcdFx0XHRpZiAoYWRkZWQubGVuZ3RoICE9IHJlbW92ZWQubGVuZ3RoKSB0aHJvdyBuZXcgRXJyb3IoYG5vdCBpbXBsZW1lbnRlZGApO1xyXG5cdFx0XHRcdHJldHVybiB0aGlzLnJlcGxhY2VFYWNoKHNvdXJjZSwgdGFyZ2V0KTtcclxuXHRcdFx0fVxyXG5cclxuXHJcblx0XHRcdC8vIHV0aWxcclxuXHRcdFx0c3RhdGljIGxpbmtUb1VybChsaW5rOiBMaW5rKTogdXJsIHtcclxuXHRcdFx0XHRpZiAodHlwZW9mIGxpbmsgPT0gJ3N0cmluZycpIHtcclxuXHRcdFx0XHRcdGlmIChsaW5rLnN0YXJ0c1dpdGgoJ2h0dHAnKSkgcmV0dXJuIGxpbmsgYXMgdXJsO1xyXG5cdFx0XHRcdFx0bGluayA9IGRvY3VtZW50LnE8J2EnPihsaW5rKTtcclxuXHRcdFx0XHR9XHJcblx0XHRcdFx0aWYgKGxpbmsudGFnTmFtZSAhPSAnQScpIHRocm93IG5ldyBFcnJvcignbGluayBzaG91bGQgYmUgPGE+IGVsZW1lbnQhJyk7XHJcblx0XHRcdFx0cmV0dXJuIChsaW5rIGFzIEhUTUxBbmNob3JFbGVtZW50KS5ocmVmIGFzIHVybDtcclxuXHRcdFx0fVxyXG5cdFx0XHRzdGF0aWMgbGlua1RvQW5jaG9yKGxpbms6IExpbmspOiBIVE1MQW5jaG9yRWxlbWVudCB7XHJcblx0XHRcdFx0aWYgKHR5cGVvZiBsaW5rID09ICdzdHJpbmcnKSB7XHJcblx0XHRcdFx0XHRpZiAobGluay5zdGFydHNXaXRoKCdodHRwJykpIHJldHVybiBudWxsO1xyXG5cdFx0XHRcdFx0cmV0dXJuIGRvY3VtZW50LnE8J2EnPihsaW5rKTtcclxuXHRcdFx0XHR9XHJcblx0XHRcdFx0cmV0dXJuIGxpbms7XHJcblx0XHRcdH1cclxuXHJcblx0XHRcdHN0YXRpYyBzdGF0aWNDYWxsPFQ+KHRoaXM6IHZvaWQsIGRhdGE6IFBhcmFtZXRlcnM8UGFnaW5hdGVbJ3N0YXRpY0NhbGwnXT5bMF0pIHtcclxuXHRcdFx0XHRsZXQgcCA9IG5ldyBQYWdpbmF0ZSgpO1xyXG5cdFx0XHRcdHAuc3RhdGljQ2FsbChkYXRhKTtcclxuXHRcdFx0XHRyZXR1cm4gcDtcclxuXHRcdFx0fVxyXG5cclxuXHRcdFx0cmF3RGF0YTogYW55O1xyXG5cdFx0XHRkYXRhOiB7XHJcblx0XHRcdFx0Y29uZGl0aW9uOiAoKSA9PiBib29sZWFuO1xyXG5cdFx0XHRcdHByZWZldGNoOiBhbnlbXTtcclxuXHRcdFx0XHRkb2M6IHNlbGVjdG9yW107XHJcblx0XHRcdFx0Y2xpY2s6IHNlbGVjdG9yW107XHJcblx0XHRcdFx0YWZ0ZXI6IHNlbGVjdG9yW107XHJcblx0XHRcdFx0cmVwbGFjZTogc2VsZWN0b3JbXTtcclxuXHRcdFx0XHRtYXhBZ2U6IGRlbHRhVGltZTtcclxuXHRcdFx0XHRzdGFydD86ICh0aGlzOiBQYWdpbmF0ZSkgPT4gdm9pZDtcclxuXHRcdFx0XHRtb2RpZnk/OiAodGhpczogUGFnaW5hdGUsIGRvYzogRG9jdW1lbnQpID0+IHZvaWQ7XHJcblx0XHRcdFx0ZW5kPzogKHRoaXM6IFBhZ2luYXRlLCBkb2M6IERvY3VtZW50KSA9PiB2b2lkO1xyXG5cdFx0XHRcdHhtbD86IGJvb2xlYW47XHJcblx0XHRcdH07XHJcblx0XHRcdHN0YXRpY0NhbGwoZGF0YToge1xyXG5cdFx0XHRcdGNvbmRpdGlvbj86IHNlbGVjdG9yIHwgKCgpID0+IGJvb2xlYW4pLFxyXG5cdFx0XHRcdHByZWZldGNoPzogc2VsZWN0b3IgfCBzZWxlY3RvcltdLFxyXG5cdFx0XHRcdGNsaWNrPzogc2VsZWN0b3IgfCBzZWxlY3RvcltdLFxyXG5cdFx0XHRcdGRvYz86IHNlbGVjdG9yIHwgc2VsZWN0b3JbXSxcclxuXHRcdFx0XHRhZnRlcj86IHNlbGVjdG9yIHwgc2VsZWN0b3JbXSxcclxuXHRcdFx0XHRyZXBsYWNlPzogc2VsZWN0b3IgfCBzZWxlY3RvcltdLFxyXG5cdFx0XHRcdHN0YXJ0PzogKHRoaXM6IFBhZ2luYXRlKSA9PiB2b2lkO1xyXG5cdFx0XHRcdG1vZGlmeT86ICh0aGlzOiBQYWdpbmF0ZSwgZG9jOiBEb2N1bWVudCkgPT4gdm9pZDtcclxuXHRcdFx0XHRlbmQ/OiAodGhpczogUGFnaW5hdGUsIGRvYzogRG9jdW1lbnQpID0+IHZvaWQ7XHJcblx0XHRcdFx0bWF4QWdlPzogZGVsdGFUaW1lO1xyXG5cdFx0XHRcdGNhY2hlPzogZGVsdGFUaW1lIHwgdHJ1ZTtcclxuXHRcdFx0XHR4bWw/OiBib29sZWFuO1xyXG5cdFx0XHRcdHBhZ2VyPzogc2VsZWN0b3IgfCBzZWxlY3RvcltdO1xyXG5cdFx0XHRcdHNoaWZ0ZWQ/OiBudW1iZXIgfCAoKCkgPT4gbnVtYmVyKTtcclxuXHRcdFx0fSkge1xyXG5cdFx0XHRcdGZ1bmN0aW9uIHRvQXJyYXk8VD4odj86IFQgfCBUW10gfCB1bmRlZmluZWQpOiBUW10ge1xyXG5cdFx0XHRcdFx0aWYgKEFycmF5LmlzQXJyYXkodikpIHJldHVybiB2O1xyXG5cdFx0XHRcdFx0aWYgKHYgPT0gbnVsbCkgcmV0dXJuIFtdO1xyXG5cdFx0XHRcdFx0cmV0dXJuIFt2XTtcclxuXHRcdFx0XHR9XHJcblx0XHRcdFx0ZnVuY3Rpb24gdG9Db25kaXRpb24ocz86IHNlbGVjdG9yIHwgKCgpID0+IGJvb2xlYW4pIHwgdW5kZWZpbmVkKTogKCkgPT4gYm9vbGVhbiB7XHJcblx0XHRcdFx0XHRpZiAoIXMpIHJldHVybiAoKSA9PiB0cnVlO1xyXG5cdFx0XHRcdFx0aWYgKHR5cGVvZiBzID09ICdzdHJpbmcnKSByZXR1cm4gKCkgPT4gISFkb2N1bWVudC5xKHMpO1xyXG5cdFx0XHRcdFx0cmV0dXJuIHM7XHJcblx0XHRcdFx0fVxyXG5cdFx0XHRcdGZ1bmN0aW9uIGNhbkZpbmQoYTogc2VsZWN0b3JbXSkge1xyXG5cdFx0XHRcdFx0aWYgKGEubGVuZ3RoID09IDApIHJldHVybiB0cnVlO1xyXG5cdFx0XHRcdFx0cmV0dXJuIGEuc29tZShzID0+ICEhZG9jdW1lbnQucShzKSk7XHJcblx0XHRcdFx0fVxyXG5cdFx0XHRcdGZ1bmN0aW9uIGZpbmRPbmUoYTogc2VsZWN0b3JbXSkge1xyXG5cdFx0XHRcdFx0cmV0dXJuIGEuZmluZChzID0+IGRvY3VtZW50LnEocykpO1xyXG5cdFx0XHRcdH1cclxuXHRcdFx0XHR0aGlzLnJhd0RhdGEgPSBkYXRhO1xyXG5cdFx0XHRcdHRoaXMuZGF0YSA9IHtcclxuXHRcdFx0XHRcdGNvbmRpdGlvbjogdG9Db25kaXRpb24oZGF0YS5jb25kaXRpb24pLFxyXG5cdFx0XHRcdFx0cHJlZmV0Y2g6IHRvQXJyYXk8c2VsZWN0b3I+KGRhdGEucHJlZmV0Y2gpXHJcblx0XHRcdFx0XHRcdC5mbGF0TWFwKGUgPT4gdG9BcnJheShkYXRhW2VdID8/IGUpKSxcclxuXHRcdFx0XHRcdGRvYzogdG9BcnJheTxzZWxlY3Rvcj4oZGF0YS5kb2MpLFxyXG5cdFx0XHRcdFx0Y2xpY2s6IHRvQXJyYXk8c2VsZWN0b3I+KGRhdGEuY2xpY2spLFxyXG5cdFx0XHRcdFx0YWZ0ZXI6IHRvQXJyYXk8c2VsZWN0b3I+KGRhdGEuYWZ0ZXIpLFxyXG5cdFx0XHRcdFx0cmVwbGFjZTogdG9BcnJheTxzZWxlY3Rvcj4oZGF0YS5yZXBsYWNlKSxcclxuXHRcdFx0XHRcdG1heEFnZTogZGF0YS5tYXhBZ2UgPz8gKGRhdGEuY2FjaGUgPT0gdHJ1ZSA/ICcxeScgOiBkYXRhLmNhY2hlKSxcclxuXHRcdFx0XHRcdHN0YXJ0OiBkYXRhLnN0YXJ0LCBtb2RpZnk6IGRhdGEubW9kaWZ5LCBlbmQ6IGRhdGEuZW5kLFxyXG5cdFx0XHRcdFx0eG1sOiBkYXRhLnhtbCxcclxuXHRcdFx0XHR9O1xyXG5cdFx0XHRcdHRoaXMuc2hpZnRSZXF1ZXN0Q291bnQgPSBkYXRhLnNoaWZ0ZWQ7XHJcblx0XHRcdFx0aWYgKGRhdGEucGFnZXIpIHtcclxuXHRcdFx0XHRcdGxldCBwYWdlciA9IHRvQXJyYXk8c2VsZWN0b3I+KGRhdGEucGFnZXIpO1xyXG5cdFx0XHRcdFx0dGhpcy5kYXRhLmRvYyA9IHRoaXMuZGF0YS5kb2MuZmxhdE1hcChlID0+IHBhZ2VyLm1hcChwID0+IGAke3B9ICR7ZX1gKSk7XHJcblx0XHRcdFx0XHR0aGlzLmRhdGEucmVwbGFjZS5wdXNoKC4uLnBhZ2VyKTtcclxuXHRcdFx0XHR9XHJcblx0XHRcdFx0dGhpcy5jb25kaXRpb24gPSAoKSA9PiB7XHJcblx0XHRcdFx0XHRpZiAoIXRoaXMuZGF0YS5jb25kaXRpb24oKSkgcmV0dXJuIGZhbHNlO1xyXG5cdFx0XHRcdFx0aWYgKCFjYW5GaW5kKHRoaXMuZGF0YS5kb2MpKSByZXR1cm4gZmFsc2U7XHJcblx0XHRcdFx0XHRpZiAoIWNhbkZpbmQodGhpcy5kYXRhLmNsaWNrKSkgcmV0dXJuIGZhbHNlO1xyXG5cdFx0XHRcdFx0cmV0dXJuIHRydWU7XHJcblx0XHRcdFx0fTtcclxuXHRcdFx0XHR0aGlzLmluaXQoKTtcclxuXHRcdFx0XHRpZiAodGhpcy5kYXRhLmNvbmRpdGlvbigpKSB7XHJcblx0XHRcdFx0XHR0aGlzLmRhdGEucHJlZmV0Y2gubWFwKHMgPT4gUGFnaW5hdGUucHJlZmV0Y2gocykpO1xyXG5cdFx0XHRcdH1cclxuXHRcdFx0XHR0aGlzLm9ucnVuID0gYXN5bmMgKCkgPT4ge1xyXG5cdFx0XHRcdFx0Ly8gaWYgKCFmaXhlZERhdGEuY29uZGl0aW9uKCkpIHJldHVybjtcclxuXHRcdFx0XHRcdGF3YWl0IHRoaXMuZGF0YS5zdGFydD8uY2FsbCh0aGlzKTtcclxuXHRcdFx0XHRcdHRoaXMuZGF0YS5jbGljay5tYXAoZSA9PiBkb2N1bWVudC5xKGUpPy5jbGljaygpKTtcclxuXHRcdFx0XHRcdGxldCBkb2MgPSBmaW5kT25lKHRoaXMuZGF0YS5kb2MpO1xyXG5cdFx0XHRcdFx0aWYgKGRvYykge1xyXG5cdFx0XHRcdFx0XHRhd2FpdCB0aGlzLmZldGNoRG9jdW1lbnQoZG9jLCB0cnVlLCB0aGlzLmRhdGEubWF4QWdlKTtcclxuXHRcdFx0XHRcdFx0dGhpcy5kYXRhLnJlcGxhY2UubWFwKHMgPT4gdGhpcy5yZXBsYWNlKHMpKTtcclxuXHRcdFx0XHRcdFx0dGhpcy5kYXRhLmFmdGVyLm1hcChzID0+IHRoaXMuYWZ0ZXIocykpO1xyXG5cdFx0XHRcdFx0XHRhd2FpdCB0aGlzLmRhdGEubW9kaWZ5Py5jYWxsKHRoaXMsIHRoaXMuZG9jKTtcclxuXHRcdFx0XHRcdH1cclxuXHRcdFx0XHRcdGF3YWl0IHRoaXMuZGF0YS5lbmQ/LmNhbGwodGhpcywgZG9jICYmIHRoaXMuZG9jKTtcclxuXHRcdFx0XHR9XHJcblx0XHRcdH1cclxuXHJcblxyXG5cdFx0fVxyXG5cdFx0dHlwZSBTZWxPckVsID0gc2VsZWN0b3IgfCBIVE1MRWxlbWVudDtcclxuXHRcdHR5cGUgU29tZWhvdzxUPiA9IG51bGwgfCBUIHwgVFtdIHwgKCgpID0+IChudWxsIHwgVCB8IFRbXSkpO1xyXG5cdFx0dHlwZSBTb21laG93QXN5bmM8VD4gPSBudWxsIHwgVCB8IFRbXSB8ICgoKSA9PiAobnVsbCB8IFQgfCBUW10gfCBQcm9taXNlPG51bGwgfCBUIHwgVFtdPikpO1xyXG5cclxuXHRcdGV4cG9ydCBjb25zdCBwYWdpbmF0ZSA9IE9iamVjdC5zZXRQcm90b3R5cGVPZihPYmplY3QuYXNzaWduKFBhZ2luYXRlLnN0YXRpY0NhbGwsIG5ldyBQYWdpbmF0ZSgpKSwgUGFnaW5hdGUpO1xyXG5cdH1cclxuXHJcblx0ZXhwb3J0IGNvbnN0IHBhZ2luYXRlID0gUGFnaW5hdGVFeHRlbnNpb24ucGFnaW5hdGU7XHJcblxyXG59IiwibmFtZXNwYWNlIFBvb3BKcyB7XHJcblx0ZXhwb3J0IG5hbWVzcGFjZSBJbWFnZVNjcm9sbGluZ0V4dGVuc2lvbiB7XHJcblxyXG5cdFx0ZXhwb3J0IGxldCBpbWFnZVNjcm9sbGluZ0FjdGl2ZSA9IGZhbHNlO1xyXG5cdFx0ZXhwb3J0IGxldCBpbWdTZWxlY3RvciA9ICdpbWcnO1xyXG5cclxuXHRcdGV4cG9ydCBmdW5jdGlvbiBpbWFnZVNjcm9sbGluZyhzZWxlY3Rvcj86IHN0cmluZykge1xyXG5cdFx0XHRpZiAoaW1hZ2VTY3JvbGxpbmdBY3RpdmUpIHJldHVybjtcclxuXHRcdFx0aWYgKHNlbGVjdG9yKSBpbWdTZWxlY3RvciA9IHNlbGVjdG9yO1xyXG5cdFx0XHRpbWFnZVNjcm9sbGluZ0FjdGl2ZSA9IHRydWU7XHJcblx0XHRcdGZ1bmN0aW9uIG9ud2hlZWwoZXZlbnQ6IE1vdXNlRXZlbnQgJiB7IHdoZWVsRGVsdGFZOiBudW1iZXIgfSkge1xyXG5cdFx0XHRcdGlmIChldmVudC5zaGlmdEtleSB8fCBldmVudC5jdHJsS2V5KSByZXR1cm47XHJcblx0XHRcdFx0aWYgKHNjcm9sbFdob2xlSW1hZ2UoLU1hdGguc2lnbihldmVudC53aGVlbERlbHRhWSkpKSB7XHJcblx0XHRcdFx0XHRldmVudC5wcmV2ZW50RGVmYXVsdCgpO1xyXG5cdFx0XHRcdH1cclxuXHRcdFx0fVxyXG5cdFx0XHRkb2N1bWVudC5hZGRFdmVudExpc3RlbmVyKCdtb3VzZXdoZWVsJywgb253aGVlbCwgeyBwYXNzaXZlOiBmYWxzZSB9KTtcclxuXHRcdFx0cmV0dXJuIGltYWdlU2Nyb2xsaW5nT2ZmID0gKCkgPT4ge1xyXG5cdFx0XHRcdGltYWdlU2Nyb2xsaW5nQWN0aXZlID0gZmFsc2U7XHJcblx0XHRcdFx0ZG9jdW1lbnQucmVtb3ZlRXZlbnRMaXN0ZW5lcignbW91c2V3aGVlbCcsIG9ud2hlZWwpO1xyXG5cdFx0XHR9O1xyXG5cdFx0fVxyXG5cdFx0ZXhwb3J0IGZ1bmN0aW9uIGJpbmRBcnJvd3MoKSB7XHJcblx0XHRcdGFkZEV2ZW50TGlzdGVuZXIoJ2tleWRvd24nLCBldmVudCA9PiB7XHJcblx0XHRcdFx0aWYgKGV2ZW50LmNvZGUgPT0gJ0Fycm93TGVmdCcpIHtcclxuXHRcdFx0XHRcdHNjcm9sbFdob2xlSW1hZ2UoLTEpO1xyXG5cdFx0XHRcdH1cclxuXHRcdFx0XHRpZiAoZXZlbnQuY29kZSA9PSAnQXJyb3dSaWdodCcpIHtcclxuXHRcdFx0XHRcdHNjcm9sbFdob2xlSW1hZ2UoMSk7XHJcblx0XHRcdFx0fVxyXG5cdFx0XHR9KVxyXG5cdFx0fVxyXG5cdFx0ZXhwb3J0IGxldCBpbWFnZVNjcm9sbGluZ09mZiA9ICgpID0+IHsgfTtcclxuXHJcblx0XHRleHBvcnQgZnVuY3Rpb24gaW1nVG9XaW5kb3dDZW50ZXIoaW1nOiBFbGVtZW50KSB7XHJcblx0XHRcdGxldCByZWN0ID0gaW1nLmdldEJvdW5kaW5nQ2xpZW50UmVjdCgpO1xyXG5cdFx0XHRyZXR1cm4gKHJlY3QudG9wICsgcmVjdC5ib3R0b20pIC8gMiAtIGlubmVySGVpZ2h0IC8gMjtcclxuXHRcdH1cclxuXHJcblx0XHRleHBvcnQgZnVuY3Rpb24gZ2V0QWxsSW1hZ2VJbmZvKCkge1xyXG5cdFx0XHRsZXQgaW1hZ2VzID0gcXEoaW1nU2VsZWN0b3IpIGFzIEhUTUxJbWFnZUVsZW1lbnRbXTtcclxuXHRcdFx0bGV0IGRhdGFzID0gaW1hZ2VzLm1hcCgoaW1nLCBpbmRleCkgPT4ge1xyXG5cdFx0XHRcdGxldCByZWN0ID0gaW1nLmdldEJvdW5kaW5nQ2xpZW50UmVjdCgpO1xyXG5cdFx0XHRcdHJldHVybiB7XHJcblx0XHRcdFx0XHRpbWcsIHJlY3QsIGluZGV4LFxyXG5cdFx0XHRcdFx0aW5TY3JlZW46IHJlY3QudG9wID49IC0xICYmIHJlY3QuYm90dG9tIDw9IGlubmVySGVpZ2h0LFxyXG5cdFx0XHRcdFx0Y3Jvc3NTY3JlZW46IHJlY3QuYm90dG9tID49IDEgJiYgcmVjdC50b3AgPD0gaW5uZXJIZWlnaHQgLSAxLFxyXG5cdFx0XHRcdFx0eVRvU2NyZWVuQ2VudGVyOiAocmVjdC50b3AgKyByZWN0LmJvdHRvbSkgLyAyIC0gaW5uZXJIZWlnaHQgLyAyLFxyXG5cdFx0XHRcdFx0aXNJbkNlbnRlcjogTWF0aC5hYnMoKHJlY3QudG9wICsgcmVjdC5ib3R0b20pIC8gMiAtIGlubmVySGVpZ2h0IC8gMikgPCAzLFxyXG5cdFx0XHRcdFx0aXNTY3JlZW5IZWlnaHQ6IE1hdGguYWJzKHJlY3QuaGVpZ2h0IC0gaW5uZXJIZWlnaHQpIDwgMyxcclxuXHRcdFx0XHR9O1xyXG5cdFx0XHR9KS5maWx0ZXIoZSA9PiBlLnJlY3Q/LndpZHRoIHx8IGUucmVjdD8ud2lkdGgpO1xyXG5cdFx0XHRyZXR1cm4gZGF0YXM7XHJcblx0XHR9XHJcblxyXG5cdFx0ZXhwb3J0IGxldCBzY3JvbGxXaG9sZUltYWdlUGVuZGluZyA9IGZhbHNlO1xyXG5cclxuXHRcdGV4cG9ydCBmdW5jdGlvbiBnZXRDZW50cmFsSW1nKCkge1xyXG5cdFx0XHRyZXR1cm4gZ2V0QWxsSW1hZ2VJbmZvKCkudnNvcnQoZSA9PiBNYXRoLmFicyhlLnlUb1NjcmVlbkNlbnRlcikpWzBdPy5pbWc7XHJcblx0XHR9XHJcblx0XHRleHBvcnQgZnVuY3Rpb24gc2Nyb2xsV2hvbGVJbWFnZShkaXIgPSAxKTogYm9vbGVhbiB7XHJcblx0XHRcdGlmIChzY3JvbGxXaG9sZUltYWdlUGVuZGluZykgcmV0dXJuIHRydWU7XHJcblx0XHRcdC8vIGlmIChkaXIgPT0gMCkgdGhyb3cgbmV3IEVycm9yKCdzY3JvbGxpbmcgaW4gbm8gZGlyZWN0aW9uIScpO1xyXG5cdFx0XHRpZiAoIWRpcikgcmV0dXJuIGZhbHNlO1xyXG5cclxuXHRcdFx0ZGlyID0gTWF0aC5zaWduKGRpcik7XHJcblx0XHRcdGxldCBkYXRhcyA9IGdldEFsbEltYWdlSW5mbygpLnZzb3J0KGUgPT4gZS55VG9TY3JlZW5DZW50ZXIpO1xyXG5cdFx0XHRsZXQgY2VudHJhbCA9IGRhdGFzLnZzb3J0KGUgPT4gTWF0aC5hYnMoZS55VG9TY3JlZW5DZW50ZXIpKVswXTtcclxuXHRcdFx0bGV0IG5leHRDZW50cmFsSW5kZXggPSBkYXRhcy5pbmRleE9mKGNlbnRyYWwpO1xyXG5cdFx0XHR3aGlsZSAoXHJcblx0XHRcdFx0ZGF0YXNbbmV4dENlbnRyYWxJbmRleCArIGRpcl0gJiZcclxuXHRcdFx0XHRNYXRoLmFicyhkYXRhc1tuZXh0Q2VudHJhbEluZGV4ICsgZGlyXS55VG9TY3JlZW5DZW50ZXIgLSBjZW50cmFsLnlUb1NjcmVlbkNlbnRlcikgPCAxMFxyXG5cdFx0XHQpIG5leHRDZW50cmFsSW5kZXggKz0gZGlyO1xyXG5cdFx0XHRjZW50cmFsID0gZGF0YXNbbmV4dENlbnRyYWxJbmRleF07XHJcblx0XHRcdGxldCBuZXh0ID0gZGF0YXNbbmV4dENlbnRyYWxJbmRleCArIGRpcl07XHJcblxyXG5cdFx0XHRmdW5jdGlvbiBzY3JvbGxUb0ltYWdlKGRhdGE6IHR5cGVvZiBjZW50cmFsIHwgdW5kZWZpbmVkKTogYm9vbGVhbiB7XHJcblx0XHRcdFx0aWYgKCFkYXRhKSByZXR1cm4gZmFsc2U7XHJcblx0XHRcdFx0aWYgKHNjcm9sbFkgKyBkYXRhLnlUb1NjcmVlbkNlbnRlciA8PSAwICYmIHNjcm9sbFkgPD0gMCkge1xyXG5cdFx0XHRcdFx0cmV0dXJuIGZhbHNlO1xyXG5cdFx0XHRcdH1cclxuXHRcdFx0XHRpZiAoZGF0YS5pc1NjcmVlbkhlaWdodCkge1xyXG5cdFx0XHRcdFx0ZGF0YS5pbWcuc2Nyb2xsSW50b1ZpZXcoKTtcclxuXHRcdFx0XHR9IGVsc2Uge1xyXG5cdFx0XHRcdFx0c2Nyb2xsVG8oc2Nyb2xsWCwgc2Nyb2xsWSArIGRhdGEueVRvU2NyZWVuQ2VudGVyKTtcclxuXHRcdFx0XHR9XHJcblx0XHRcdFx0c2Nyb2xsV2hvbGVJbWFnZVBlbmRpbmcgPSB0cnVlO1xyXG5cdFx0XHRcdFByb21pc2UucmFmKDIpLnRoZW4oKCkgPT4gc2Nyb2xsV2hvbGVJbWFnZVBlbmRpbmcgPSBmYWxzZSk7XHJcblx0XHRcdFx0cmV0dXJuIHRydWU7XHJcblx0XHRcdH1cclxuXHJcblx0XHRcdC8vIGlmIG5vIGltYWdlcywgZG9uJ3Qgc2Nyb2xsO1xyXG5cdFx0XHRpZiAoIWNlbnRyYWwpIHJldHVybiBmYWxzZTtcclxuXHJcblx0XHRcdC8vIGlmIGN1cnJlbnQgaW1hZ2UgaXMgb3V0c2lkZSB2aWV3LCBkb24ndCBzY3JvbGxcclxuXHRcdFx0aWYgKCFjZW50cmFsLmNyb3NzU2NyZWVuKSByZXR1cm4gZmFsc2U7XHJcblxyXG5cdFx0XHQvLyBpZiBjdXJyZW50IGltYWdlIGlzIGluIGNlbnRlciwgc2Nyb2xsIHRvIHRoZSBuZXh0IG9uZVxyXG5cdFx0XHRpZiAoY2VudHJhbC5pc0luQ2VudGVyKSB7XHJcblx0XHRcdFx0cmV0dXJuIHNjcm9sbFRvSW1hZ2UobmV4dCk7XHJcblx0XHRcdH1cclxuXHJcblx0XHRcdC8vIGlmIHRvIHNjcm9sbCB0byBjdXJyZW50IGltYWdlIHlvdSBoYXZlIHRvIHNjcm9sbCBpbiBvcHBvc2lkZSBkaXJlY3Rpb24sIHNjcm9sbCB0byBuZXh0IG9uZVxyXG5cdFx0XHRpZiAoTWF0aC5zaWduKGNlbnRyYWwueVRvU2NyZWVuQ2VudGVyKSAhPSBkaXIpIHtcclxuXHRcdFx0XHRyZXR1cm4gc2Nyb2xsVG9JbWFnZShuZXh0KTtcclxuXHRcdFx0fVxyXG5cclxuXHRcdFx0Ly8gaWYgY3VycmVudCBpbWFnZSBpcyBmaXJzdC9sYXN0LCBkb24ndCBzY3JvbGwgb3ZlciAyNXZoIHRvIGl0XHJcblx0XHRcdGlmIChkaXIgPT0gMSAmJiBjZW50cmFsLmluZGV4ID09IDAgJiYgY2VudHJhbC55VG9TY3JlZW5DZW50ZXIgPiBpbm5lckhlaWdodCAvIDIpIHtcclxuXHRcdFx0XHRyZXR1cm4gZmFsc2U7XHJcblx0XHRcdH1cclxuXHRcdFx0aWYgKGRpciA9PSAtMSAmJiBjZW50cmFsLmluZGV4ID09IGRhdGFzLmxlbmd0aCAtIDEgJiYgY2VudHJhbC55VG9TY3JlZW5DZW50ZXIgPCAtaW5uZXJIZWlnaHQgLyAyKSB7XHJcblx0XHRcdFx0cmV0dXJuIGZhbHNlO1xyXG5cdFx0XHR9XHJcblxyXG5cdFx0XHRyZXR1cm4gc2Nyb2xsVG9JbWFnZShjZW50cmFsKTtcclxuXHRcdH1cclxuXHR9XHJcbn0iLCIvLy8gPHJlZmVyZW5jZSBwYXRoPVwiLi9BcnJheS50c1wiIC8+XHJcbi8vLyA8cmVmZXJlbmNlIHBhdGg9XCIuL0RhdGVOb3dIYWNrLnRzXCIgLz5cclxuLy8vIDxyZWZlcmVuY2UgcGF0aD1cIi4vZWxlbWVudC50c1wiIC8+XHJcbi8vLyA8cmVmZXJlbmNlIHBhdGg9XCIuL2VsbS50c1wiIC8+XHJcbi8vLyA8cmVmZXJlbmNlIHBhdGg9XCIuL0ZpbHRlcmVyL0VudGl0eUZpbHRlcmVyLnRzXCIgLz5cclxuLy8vIDxyZWZlcmVuY2UgcGF0aD1cIi4vZXRjLnRzXCIgLz5cclxuLy8vIDxyZWZlcmVuY2UgcGF0aD1cIi4vZmV0Y2gudHNcIiAvPlxyXG4vLy8gPHJlZmVyZW5jZSBwYXRoPVwiLi9PYmplY3QudHNcIiAvPlxyXG4vLy8gPHJlZmVyZW5jZSBwYXRoPVwiLi9vYnNlcnZlci50c1wiIC8+XHJcbi8vLyA8cmVmZXJlbmNlIHBhdGg9XCIuL1BhZ2luYXRlL1BhZ2luYXRpb24udHNcIiAvPlxyXG4vLy8gPHJlZmVyZW5jZSBwYXRoPVwiLi9QYWdpbmF0ZS9JbWFnZVNjcm9sbGluZy50c1wiIC8+XHJcbi8vLyA8cmVmZXJlbmNlIHBhdGg9XCIuL1Byb21pc2UudHNcIiAvPlxyXG5cclxuXHJcblxyXG5cclxuXHJcbm5hbWVzcGFjZSBQb29wSnMge1xyXG5cclxuXHRleHBvcnQgZnVuY3Rpb24gX19pbml0X18od2luZG93OiBXaW5kb3cgJiB0eXBlb2YgZ2xvYmFsVGhpcyk6IFwiaW5pdGVkXCIgfCBcImFscmVhZHkgaW5pdGVkXCIge1xyXG5cdFx0aWYgKCF3aW5kb3cpIHdpbmRvdyA9IGdsb2JhbFRoaXMud2luZG93IGFzIFdpbmRvdyAmIHR5cGVvZiBnbG9iYWxUaGlzO1xyXG5cclxuXHRcdHdpbmRvdy5lbG0gPSBFbG0uZWxtO1xyXG5cdFx0d2luZG93LnEgPSBPYmplY3QuYXNzaWduKFF1ZXJ5U2VsZWN0b3IuV2luZG93US5xLCB7IG9yRWxtOiBQb29wSnMuRWxtLnFPckVsbSB9KTtcclxuXHRcdHdpbmRvdy5xcSA9IFF1ZXJ5U2VsZWN0b3IuV2luZG93US5xcTtcclxuXHRcdE9iamVjdEV4dGVuc2lvbi5kZWZpbmVWYWx1ZSh3aW5kb3cuRWxlbWVudC5wcm90b3R5cGUsICdxJywgUXVlcnlTZWxlY3Rvci5FbGVtZW50US5xKTtcclxuXHRcdE9iamVjdEV4dGVuc2lvbi5kZWZpbmVWYWx1ZSh3aW5kb3cuRWxlbWVudC5wcm90b3R5cGUsICdxcScsIFF1ZXJ5U2VsZWN0b3IuRWxlbWVudFEucXEpO1xyXG5cdFx0T2JqZWN0RXh0ZW5zaW9uLmRlZmluZVZhbHVlKHdpbmRvdy5FbGVtZW50LnByb3RvdHlwZSwgJ2FwcGVuZFRvJywgRWxlbWVudEV4dGVuc2lvbi5hcHBlbmRUbyk7XHJcblx0XHRPYmplY3RFeHRlbnNpb24uZGVmaW5lVmFsdWUod2luZG93LkVsZW1lbnQucHJvdG90eXBlLCAnZW1pdCcsIEVsZW1lbnRFeHRlbnNpb24uZW1pdCk7XHJcblx0XHRPYmplY3RFeHRlbnNpb24uZGVmaW5lVmFsdWUod2luZG93LkRvY3VtZW50LnByb3RvdHlwZSwgJ3EnLCBRdWVyeVNlbGVjdG9yLkRvY3VtZW50US5xKTtcclxuXHRcdE9iamVjdEV4dGVuc2lvbi5kZWZpbmVWYWx1ZSh3aW5kb3cuRG9jdW1lbnQucHJvdG90eXBlLCAncXEnLCBRdWVyeVNlbGVjdG9yLkRvY3VtZW50US5xcSk7XHJcblxyXG5cdFx0T2JqZWN0RXh0ZW5zaW9uLmRlZmluZVZhbHVlKHdpbmRvdy5Qcm9taXNlLCAnZW1wdHknLCBQcm9taXNlRXh0ZW5zaW9uLmVtcHR5KTtcclxuXHRcdE9iamVjdEV4dGVuc2lvbi5kZWZpbmVWYWx1ZSh3aW5kb3cuUHJvbWlzZSwgJ2ZyYW1lJywgUHJvbWlzZUV4dGVuc2lvbi5mcmFtZSk7XHJcblx0XHRPYmplY3RFeHRlbnNpb24uZGVmaW5lVmFsdWUod2luZG93LlByb21pc2UsICdyYWYnLCBQcm9taXNlRXh0ZW5zaW9uLmZyYW1lKTtcclxuXHJcblx0XHR3aW5kb3cuZmV0Y2guY2FjaGVkID0gRmV0Y2hFeHRlbnNpb24uY2FjaGVkIGFzIGFueTtcclxuXHRcdHdpbmRvdy5mZXRjaC5kb2MgPSBGZXRjaEV4dGVuc2lvbi5kb2MgYXMgYW55O1xyXG5cdFx0d2luZG93LmZldGNoLmpzb24gPSBGZXRjaEV4dGVuc2lvbi5qc29uIGFzIGFueTtcclxuXHRcdHdpbmRvdy5mZXRjaC5jYWNoZWQuZG9jID0gRmV0Y2hFeHRlbnNpb24uY2FjaGVkRG9jO1xyXG5cdFx0d2luZG93LmZldGNoLmRvYy5jYWNoZWQgPSBGZXRjaEV4dGVuc2lvbi5jYWNoZWREb2M7XHJcblx0XHR3aW5kb3cuZmV0Y2guY2FjaGVkRG9jID0gRmV0Y2hFeHRlbnNpb24uY2FjaGVkRG9jO1xyXG5cdFx0d2luZG93LmZldGNoLmpzb24uY2FjaGVkID0gRmV0Y2hFeHRlbnNpb24uY2FjaGVkSnNvbjtcclxuXHRcdHdpbmRvdy5mZXRjaC5jYWNoZWQuanNvbiA9IEZldGNoRXh0ZW5zaW9uLmNhY2hlZEpzb247XHJcblx0XHR3aW5kb3cuZmV0Y2guaXNDYWNoZWQgPSBGZXRjaEV4dGVuc2lvbi5pc0NhY2hlZDtcclxuXHRcdE9iamVjdEV4dGVuc2lvbi5kZWZpbmVWYWx1ZSh3aW5kb3cuUmVzcG9uc2UucHJvdG90eXBlLCAnY2FjaGVkQXQnLCAwKTtcclxuXHRcdE9iamVjdEV4dGVuc2lvbi5kZWZpbmVWYWx1ZSh3aW5kb3cuRG9jdW1lbnQucHJvdG90eXBlLCAnY2FjaGVkQXQnLCAwKTtcclxuXHJcblx0XHRPYmplY3RFeHRlbnNpb24uZGVmaW5lVmFsdWUod2luZG93Lk9iamVjdCwgJ2RlZmluZVZhbHVlJywgT2JqZWN0RXh0ZW5zaW9uLmRlZmluZVZhbHVlKTtcclxuXHRcdE9iamVjdEV4dGVuc2lvbi5kZWZpbmVWYWx1ZSh3aW5kb3cuT2JqZWN0LCAnZGVmaW5lR2V0dGVyJywgT2JqZWN0RXh0ZW5zaW9uLmRlZmluZUdldHRlcik7XHJcblx0XHQvLyBPYmplY3RFeHRlbnNpb24uZGVmaW5lVmFsdWUoT2JqZWN0LCAnbWFwJywgT2JqZWN0RXh0ZW5zaW9uLm1hcCk7XHJcblxyXG5cdFx0T2JqZWN0RXh0ZW5zaW9uLmRlZmluZVZhbHVlKHdpbmRvdy5BcnJheSwgJ21hcCcsIEFycmF5RXh0ZW5zaW9uLm1hcCk7XHJcblx0XHRPYmplY3RFeHRlbnNpb24uZGVmaW5lVmFsdWUod2luZG93LkFycmF5LnByb3RvdHlwZSwgJ3BtYXAnLCBBcnJheUV4dGVuc2lvbi5wbWFwKTtcclxuXHRcdE9iamVjdEV4dGVuc2lvbi5kZWZpbmVWYWx1ZSh3aW5kb3cuQXJyYXkucHJvdG90eXBlLCAndnNvcnQnLCBBcnJheUV4dGVuc2lvbi52c29ydCk7XHJcblxyXG5cdFx0d2luZG93LnBhZ2luYXRlID0gUG9vcEpzLnBhZ2luYXRlIGFzIGFueTtcclxuXHRcdHdpbmRvdy5pbWFnZVNjcm9sbGluZyA9IFBvb3BKcy5JbWFnZVNjcm9sbGluZ0V4dGVuc2lvbjtcclxuXHJcblx0XHRPYmplY3RFeHRlbnNpb24uZGVmaW5lVmFsdWUod2luZG93LCAnX19pbml0X18nLCAnYWxyZWFkeSBpbml0ZWQnKTtcclxuXHRcdHJldHVybiAnaW5pdGVkJztcclxuXHR9XHJcblxyXG5cdE9iamVjdEV4dGVuc2lvbi5kZWZpbmVHZXR0ZXIod2luZG93LCAnX19pbml0X18nLCAoKSA9PiBfX2luaXRfXyh3aW5kb3cpKTtcclxuXHJcblx0aWYgKHdpbmRvdy5sb2NhbFN0b3JhZ2UuX19pbml0X18pIHtcclxuXHRcdHdpbmRvdy5fX2luaXRfXztcclxuXHR9XHJcblxyXG59IiwibmFtZXNwYWNlIFBvb3BKcyB7XHJcblx0ZXhwb3J0IHR5cGUgVmFsdWVPZjxUPiA9IFRba2V5b2YgVF07XHJcblx0ZXhwb3J0IHR5cGUgTWFwcGVkT2JqZWN0PFQsIFY+ID0geyBbUCBpbiBrZXlvZiBUXTogViB9O1xyXG5cclxuXHRleHBvcnQgdHlwZSBzZWxlY3RvciA9IHN0cmluZyB8IHN0cmluZyAmIHsgXz86ICdzZWxlY3RvcicgfVxyXG5cdGV4cG9ydCB0eXBlIHVybCA9IGBodHRwJHtzdHJpbmd9YCAmIHsgXz86ICd1cmwnIH07XHJcblx0ZXhwb3J0IHR5cGUgTGluayA9IEhUTUxBbmNob3JFbGVtZW50IHwgc2VsZWN0b3IgfCB1cmw7XHJcblxyXG5cclxuXHJcblxyXG5cdHR5cGUgdHJpbVN0YXJ0PFMsIEMgZXh0ZW5kcyBzdHJpbmc+ID0gUyBleHRlbmRzIGAke0N9JHtpbmZlciBTMX1gID8gdHJpbVN0YXJ0PFMxLCBDPiA6IFM7XHJcblx0dHlwZSB0cmltRW5kPFMsIEMgZXh0ZW5kcyBzdHJpbmc+ID0gUyBleHRlbmRzIGAke2luZmVyIFMxfSR7Q31gID8gdHJpbUVuZDxTMSwgQz4gOiBTO1xyXG5cdHR5cGUgdHJpbTxTLCBDIGV4dGVuZHMgc3RyaW5nID0gJyAnIHwgJ1xcdCcgfCAnXFxuJz4gPSB0cmltU3RhcnQ8dHJpbUVuZDxTLCBDPiwgQz47XHJcblxyXG5cdHR5cGUgc3BsaXQ8UywgQyBleHRlbmRzIHN0cmluZz4gPSBTIGV4dGVuZHMgYCR7aW5mZXIgUzF9JHtDfSR7aW5mZXIgUzJ9YCA/IHNwbGl0PFMxLCBDPiB8IHNwbGl0PFMyLCBDPiA6IFM7XHJcblx0dHlwZSBzcGxpdFN0YXJ0PFMsIEMgZXh0ZW5kcyBzdHJpbmc+ID0gUyBleHRlbmRzIGAke2luZmVyIFMxfSR7Q30ke2luZmVyIF9TMn1gID8gc3BsaXRTdGFydDxTMSwgQz4gOiBTO1xyXG5cdHR5cGUgc3BsaXRFbmQ8UywgQyBleHRlbmRzIHN0cmluZz4gPSBTIGV4dGVuZHMgYCR7aW5mZXIgX1MxfSR7Q30ke2luZmVyIFMyfWAgPyBzcGxpdEVuZDxTMiwgQz4gOiBTO1xyXG5cclxuXHR0eXBlIHJlcGxhY2U8UywgQyBleHRlbmRzIHN0cmluZywgViBleHRlbmRzIHN0cmluZz4gPSBTIGV4dGVuZHMgYCR7aW5mZXIgUzF9JHtDfSR7aW5mZXIgUzN9YCA/IHJlcGxhY2U8YCR7UzF9JHtWfSR7UzN9YCwgQywgVj4gOiBTO1xyXG5cclxuXHR0eXBlIHdzID0gJyAnIHwgJ1xcdCcgfCAnXFxuJztcclxuXHJcblx0Ly8gdHlwZSBpbnNhbmVTZWxlY3RvciA9ICcgYSAsIGJbcXdlXSBcXG4gLCBjLnggLCBkI3kgLCB4IGUgLCB4PmYgLCB4ID4gZyAsIFtxd2VdICwgaDpub3QoeD55KSAsIGltZyAnO1xyXG5cclxuXHQvLyB0eXBlIF9pMSA9IHJlcGxhY2U8aW5zYW5lU2VsZWN0b3IsIGBbJHtzdHJpbmd9XWAsICcuJz47XHJcblx0Ly8gdHlwZSBfaTE1ID0gcmVwbGFjZTxfaTEsIGAoJHtzdHJpbmd9KWAsICcuJz47XHJcblx0Ly8gdHlwZSBfaTE3ID0gcmVwbGFjZTxfaTE1LCBFeGNsdWRlPHdzLCAnICc+LCAnICc+O1xyXG5cdC8vIHR5cGUgX2kyID0gc3BsaXQ8X2kxNywgJywnPjtcclxuXHQvLyB0eXBlIF9pMyA9IHRyaW08X2kyPjtcclxuXHQvLyB0eXBlIF9pNCA9IHNwbGl0RW5kPF9pMywgd3MgfCAnPic+O1xyXG5cdC8vIHR5cGUgX2k1ID0gc3BsaXRTdGFydDxfaTQsICcuJyB8ICcjJyB8ICc6Jz47XHJcblx0Ly8gdHlwZSBfaTYgPSAoSFRNTEVsZW1lbnRUYWdOYW1lTWFwICYgeyAnJzogSFRNTEVsZW1lbnQgfSAmIHsgW2s6IHN0cmluZ106IEhUTUxFbGVtZW50IH0pW19pNV07XHJcblx0ZXhwb3J0IHR5cGUgVGFnTmFtZUZyb21TZWxlY3RvcjxTIGV4dGVuZHMgc3RyaW5nPiA9IHNwbGl0U3RhcnQ8c3BsaXRFbmQ8dHJpbTxzcGxpdDxyZXBsYWNlPHJlcGxhY2U8cmVwbGFjZTxTLCBgWyR7c3RyaW5nfV1gLCAnLic+LCBgKCR7c3RyaW5nfSlgLCAnLic+LCBFeGNsdWRlPHdzLCAnICc+LCAnICc+LCAnLCc+Piwgd3MgfCAnPic+LCAnLicgfCAnIycgfCAnOic+O1xyXG5cclxuXHRleHBvcnQgdHlwZSBUYWdFbGVtZW50RnJvbVRhZ05hbWU8Uz4gPSBTIGV4dGVuZHMga2V5b2YgSFRNTEVsZW1lbnRUYWdOYW1lTWFwID8gSFRNTEVsZW1lbnRUYWdOYW1lTWFwW1NdIDogSFRNTEVsZW1lbnQ7XHJcbn1cclxuXHJcblxyXG5kZWNsYXJlIGNvbnN0IF9faW5pdF9fOiBcImluaXRlZFwiIHwgXCJhbHJlYWR5IGluaXRlZFwiO1xyXG5kZWNsYXJlIGNvbnN0IGVsbTogdHlwZW9mIFBvb3BKcy5FbG0uZWxtO1xyXG5kZWNsYXJlIGNvbnN0IHE6IHR5cGVvZiBQb29wSnMuUXVlcnlTZWxlY3Rvci5XaW5kb3dRLnEgJiB7IG9yRWxtOiB0eXBlb2YgUG9vcEpzLkVsbS5xT3JFbG0gfTs7XHJcbmRlY2xhcmUgY29uc3QgcXE6IHR5cGVvZiBQb29wSnMuUXVlcnlTZWxlY3Rvci5XaW5kb3dRLnFxO1xyXG5kZWNsYXJlIGNvbnN0IHBhZ2luYXRlOiB0eXBlb2YgUG9vcEpzLnBhZ2luYXRlO1xyXG5kZWNsYXJlIGNvbnN0IGltYWdlU2Nyb2xsaW5nOiB0eXBlb2YgUG9vcEpzLkltYWdlU2Nyb2xsaW5nRXh0ZW5zaW9uO1xyXG5kZWNsYXJlIG5hbWVzcGFjZSBmZXRjaCB7XHJcblx0ZXhwb3J0IGxldCBjYWNoZWQ6IHR5cGVvZiBQb29wSnMuRmV0Y2hFeHRlbnNpb24uY2FjaGVkICYgeyBkb2M6IHR5cGVvZiBQb29wSnMuRmV0Y2hFeHRlbnNpb24uY2FjaGVkRG9jLCBqc29uOiB0eXBlb2YgUG9vcEpzLkZldGNoRXh0ZW5zaW9uLmNhY2hlZEpzb24gfTtcclxuXHRleHBvcnQgbGV0IGRvYzogdHlwZW9mIFBvb3BKcy5GZXRjaEV4dGVuc2lvbi5kb2MgJiB7IGNhY2hlZDogdHlwZW9mIFBvb3BKcy5GZXRjaEV4dGVuc2lvbi5jYWNoZWREb2MgfTtcclxuXHRleHBvcnQgbGV0IGNhY2hlZERvYzogdHlwZW9mIFBvb3BKcy5GZXRjaEV4dGVuc2lvbi5jYWNoZWREb2M7XHJcblx0ZXhwb3J0IGxldCBqc29uOiB0eXBlb2YgUG9vcEpzLkZldGNoRXh0ZW5zaW9uLmpzb24gJiB7IGNhY2hlZDogdHlwZW9mIFBvb3BKcy5GZXRjaEV4dGVuc2lvbi5jYWNoZWRKc29uIH07XHJcblx0ZXhwb3J0IGxldCBpc0NhY2hlZDogdHlwZW9mIFBvb3BKcy5GZXRjaEV4dGVuc2lvbi5pc0NhY2hlZDtcclxufVxyXG5cclxuaW50ZXJmYWNlIFdpbmRvdyB7XHJcblx0cmVhZG9ubHkgX19pbml0X186IFwiaW5pdGVkXCIgfCBcImFscmVhZHkgaW5pdGVkXCI7XHJcblx0ZWxtOiB0eXBlb2YgUG9vcEpzLkVsbS5lbG07XHJcblx0cTogdHlwZW9mIFBvb3BKcy5RdWVyeVNlbGVjdG9yLldpbmRvd1EucSAmIHsgb3JFbG06IHR5cGVvZiBQb29wSnMuRWxtLnFPckVsbSB9O1xyXG5cdHFxOiB0eXBlb2YgUG9vcEpzLlF1ZXJ5U2VsZWN0b3IuV2luZG93US5xcTtcclxuXHRwYWdpbmF0ZTogdHlwZW9mIFBvb3BKcy5wYWdpbmF0ZTtcclxuXHRpbWFnZVNjcm9sbGluZzogdHlwZW9mIFBvb3BKcy5JbWFnZVNjcm9sbGluZ0V4dGVuc2lvbjtcclxuXHRmZXRjaDoge1xyXG5cdFx0KGlucHV0OiBSZXF1ZXN0SW5mbywgaW5pdD86IFJlcXVlc3RJbml0KTogUHJvbWlzZTxSZXNwb25zZT47XHJcblx0XHRjYWNoZWQ6IHR5cGVvZiBQb29wSnMuRmV0Y2hFeHRlbnNpb24uY2FjaGVkICYgeyBkb2M6IHR5cGVvZiBQb29wSnMuRmV0Y2hFeHRlbnNpb24uY2FjaGVkRG9jLCBqc29uOiB0eXBlb2YgUG9vcEpzLkZldGNoRXh0ZW5zaW9uLmNhY2hlZEpzb24gfTtcclxuXHRcdGRvYzogdHlwZW9mIFBvb3BKcy5GZXRjaEV4dGVuc2lvbi5kb2MgJiB7IGNhY2hlZDogdHlwZW9mIFBvb3BKcy5GZXRjaEV4dGVuc2lvbi5jYWNoZWREb2MgfTtcclxuXHRcdGNhY2hlZERvYzogdHlwZW9mIFBvb3BKcy5GZXRjaEV4dGVuc2lvbi5jYWNoZWREb2M7XHJcblx0XHRqc29uOiB0eXBlb2YgUG9vcEpzLkZldGNoRXh0ZW5zaW9uLmpzb24gJiB7IGNhY2hlZDogdHlwZW9mIFBvb3BKcy5GZXRjaEV4dGVuc2lvbi5jYWNoZWRKc29uIH07XHJcblx0XHRpc0NhY2hlZDogdHlwZW9mIFBvb3BKcy5GZXRjaEV4dGVuc2lvbi5pc0NhY2hlZDtcclxuXHR9XHJcbn1cclxuXHJcbmludGVyZmFjZSBFbGVtZW50IHtcclxuXHRxOiB0eXBlb2YgUG9vcEpzLlF1ZXJ5U2VsZWN0b3IuRWxlbWVudFEucTtcclxuXHRxcTogdHlwZW9mIFBvb3BKcy5RdWVyeVNlbGVjdG9yLkVsZW1lbnRRLnFxO1xyXG5cdGFwcGVuZFRvOiB0eXBlb2YgUG9vcEpzLkVsZW1lbnRFeHRlbnNpb24uYXBwZW5kVG87XHJcblx0ZW1pdDogdHlwZW9mIFBvb3BKcy5FbGVtZW50RXh0ZW5zaW9uLmVtaXQ7XHJcblx0YWRkRXZlbnRMaXN0ZW5lcjxUIGV4dGVuZHMgQ3VzdG9tRXZlbnQ8eyBfZXZlbnQ/OiBzdHJpbmcgfT4+KHR5cGU6IFRbJ2RldGFpbCddWydfZXZlbnQnXSwgbGlzdGVuZXI6ICh0aGlzOiBEb2N1bWVudCwgZXY6IFQpID0+IGFueSwgb3B0aW9ucz86IGJvb2xlYW4gfCBBZGRFdmVudExpc3RlbmVyT3B0aW9ucyk6IHZvaWQ7XHJcbn1cclxuaW50ZXJmYWNlIERvY3VtZW50IHtcclxuXHRxOiB0eXBlb2YgUG9vcEpzLlF1ZXJ5U2VsZWN0b3IuRG9jdW1lbnRRLnE7XHJcblx0cXE6IHR5cGVvZiBQb29wSnMuUXVlcnlTZWxlY3Rvci5Eb2N1bWVudFEucXE7XHJcblx0Y2FjaGVkQXQ6IG51bWJlcjtcclxuXHRhZGRFdmVudExpc3RlbmVyPFQgZXh0ZW5kcyBDdXN0b21FdmVudDx7IF9ldmVudD86IHN0cmluZyB9Pj4odHlwZTogVFsnZGV0YWlsJ11bJ19ldmVudCddLCBsaXN0ZW5lcjogKHRoaXM6IERvY3VtZW50LCBldjogVCkgPT4gYW55LCBvcHRpb25zPzogYm9vbGVhbiB8IEFkZEV2ZW50TGlzdGVuZXJPcHRpb25zKTogdm9pZDtcclxufVxyXG5cclxuaW50ZXJmYWNlIE9iamVjdENvbnN0cnVjdG9yIHtcclxuXHRkZWZpbmVWYWx1ZTogdHlwZW9mIFBvb3BKcy5PYmplY3RFeHRlbnNpb24uZGVmaW5lVmFsdWU7XHJcblx0ZGVmaW5lR2V0dGVyOiB0eXBlb2YgUG9vcEpzLk9iamVjdEV4dGVuc2lvbi5kZWZpbmVHZXR0ZXI7XHJcblx0Ly8gbWFwOiB0eXBlb2YgUG9vcEpzLk9iamVjdEV4dGVuc2lvbi5tYXA7XHJcblx0c2V0UHJvdG90eXBlT2Y8VCwgUD4obzogVCwgcHJvdG86IFApOiBUICYgUDtcclxufVxyXG5pbnRlcmZhY2UgUHJvbWlzZUNvbnN0cnVjdG9yIHtcclxuXHRlbXB0eTogdHlwZW9mIFBvb3BKcy5Qcm9taXNlRXh0ZW5zaW9uLmVtcHR5O1xyXG5cdGZyYW1lOiB0eXBlb2YgUG9vcEpzLlByb21pc2VFeHRlbnNpb24uZnJhbWU7XHJcblx0cmFmOiB0eXBlb2YgUG9vcEpzLlByb21pc2VFeHRlbnNpb24uZnJhbWU7XHJcbn1cclxuXHJcbmludGVyZmFjZSBBcnJheTxUPiB7XHJcblx0dnNvcnQ6IHR5cGVvZiBQb29wSnMuQXJyYXlFeHRlbnNpb24udnNvcnQ7XHJcblx0cG1hcDogdHlwZW9mIFBvb3BKcy5BcnJheUV4dGVuc2lvbi5wbWFwO1xyXG59XHJcbmludGVyZmFjZSBBcnJheUNvbnN0cnVjdG9yIHtcclxuXHRtYXA6IHR5cGVvZiBQb29wSnMuQXJyYXlFeHRlbnNpb24ubWFwO1xyXG59XHJcblxyXG5pbnRlcmZhY2UgRGF0ZUNvbnN0cnVjdG9yIHtcclxuXHRfbm93KCk6IG51bWJlcjtcclxufVxyXG5pbnRlcmZhY2UgRGF0ZSB7XHJcblx0X2dldFRpbWUoKTogbnVtYmVyO1xyXG59XHJcbmludGVyZmFjZSBQZXJmb3JtYW5jZSB7XHJcblx0X25vdzogUGVyZm9ybWFuY2VbJ25vdyddO1xyXG59XHJcblxyXG5pbnRlcmZhY2UgUmVzcG9uc2Uge1xyXG5cdGNhY2hlZEF0OiBudW1iZXI7XHJcbn1cclxuXHJcbi8vIGludGVyZmFjZSBDdXN0b21FdmVudDxUPiB7XHJcbi8vIFx0ZGV0YWlsPzogVDtcclxuLy8gfVxyXG5cclxuaW50ZXJmYWNlIEZ1bmN0aW9uIHtcclxuXHRiaW5kPFQsIFIsIEFSR1MgZXh0ZW5kcyBhbnlbXT4odGhpczogKHRoaXM6IFQsIC4uLmFyZ3M6IEFSR1MpID0+IFIsIHRoaXNBcmc6IFQpOiAoKC4uLmFyZ3M6IEFSR1MpID0+IFIpXHJcbn1cclxuXHJcbi8vIGZvcmNlIGFsbG93ICcnLnNwbGl0KCcuJykucG9wKCkhXHJcbmludGVyZmFjZSBTdHJpbmcge1xyXG5cdHNwbGl0KHNwbGl0dGVyOiBzdHJpbmcpOiBbc3RyaW5nLCAuLi5zdHJpbmdbXV07XHJcbn1cclxuaW50ZXJmYWNlIEFycmF5PFQ+IHtcclxuXHRwb3AoKTogdGhpcyBleHRlbmRzIFtULCAuLi5UW11dID8gVCA6IFQgfCB1bmRlZmluZWQ7XHJcbn1cclxuIiwibmFtZXNwYWNlIFBvb3BKcyB7XHJcblx0ZXhwb3J0IG5hbWVzcGFjZSBFbnRyeUZpbHRlcmVyRXh0ZW5zaW9uIHtcclxuXHJcblx0XHRleHBvcnQgY2xhc3MgRmlsdGVyZXJJdGVtPERhdGE+IHtcclxuXHRcdFx0aWQ6IHN0cmluZyA9IFwiXCI7XHJcblx0XHRcdG5hbWU/OiBzdHJpbmc7XHJcblx0XHRcdGRlc2NyaXB0aW9uPzogc3RyaW5nO1xyXG5cdFx0XHR0aHJlZVdheTogV2F5bmVzcyA9IGZhbHNlO1xyXG5cdFx0XHRtb2RlOiBNb2RlID0gJ29mZic7XHJcblx0XHRcdHBhcmVudDogRW50cnlGaWx0ZXJlcjtcclxuXHRcdFx0YnV0dG9uOiBIVE1MQnV0dG9uRWxlbWVudDtcclxuXHRcdFx0aW5jb21wYXRpYmxlPzogc3RyaW5nW107XHJcblx0XHRcdGhpZGRlbiA9IGZhbHNlO1xyXG5cclxuXHRcdFx0Y29uc3RydWN0b3IoZGF0YTogRmlsdGVyZXJJdGVtU291cmNlKSB7XHJcblx0XHRcdFx0ZGF0YS5idXR0b24gPz89ICdidXR0b24uZWYtaXRlbSc7XHJcblx0XHRcdFx0T2JqZWN0LmFzc2lnbih0aGlzLCBkYXRhKTtcclxuXHJcblx0XHRcdFx0dGhpcy5idXR0b24gPSBlbG08J2J1dHRvbic+KGRhdGEuYnV0dG9uLFxyXG5cdFx0XHRcdFx0Y2xpY2sgPT4gdGhpcy5jbGljayhjbGljayksXHJcblx0XHRcdFx0XHRjb250ZXh0bWVudSA9PiB0aGlzLmNvbnRleHRtZW51KGNvbnRleHRtZW51KSxcclxuXHRcdFx0XHQpO1xyXG5cdFx0XHRcdHRoaXMucGFyZW50LmNvbnRhaW5lci5hcHBlbmQodGhpcy5idXR0b24pO1xyXG5cdFx0XHRcdGlmICh0aGlzLm5hbWUpIHtcclxuXHRcdFx0XHRcdHRoaXMuYnV0dG9uLmFwcGVuZCh0aGlzLm5hbWUpO1xyXG5cdFx0XHRcdH1cclxuXHRcdFx0XHRpZiAodGhpcy5kZXNjcmlwdGlvbikge1xyXG5cdFx0XHRcdFx0dGhpcy5idXR0b24udGl0bGUgPSB0aGlzLmRlc2NyaXB0aW9uO1xyXG5cdFx0XHRcdH1cclxuXHRcdFx0XHRpZiAodGhpcy5tb2RlICE9ICdvZmYnKSB7XHJcblx0XHRcdFx0XHR0aGlzLnRvZ2dsZU1vZGUoZGF0YS5tb2RlLCB0cnVlKTtcclxuXHRcdFx0XHR9XHJcblx0XHRcdFx0aWYgKHRoaXMuaGlkZGVuKSB7XHJcblx0XHRcdFx0XHR0aGlzLmhpZGUoKTtcclxuXHRcdFx0XHR9XHJcblx0XHRcdH1cclxuXHJcblx0XHRcdGNsaWNrKGV2ZW50OiBNb3VzZUV2ZW50KSB7XHJcblx0XHRcdFx0aWYgKHRoaXMubW9kZSA9PSAnb2ZmJykge1xyXG5cdFx0XHRcdFx0dGhpcy50b2dnbGVNb2RlKCdvbicpO1xyXG5cdFx0XHRcdFx0cmV0dXJuO1xyXG5cdFx0XHRcdH1cclxuXHRcdFx0XHRpZiAoZXZlbnQudGFyZ2V0ICE9IHRoaXMuYnV0dG9uKSByZXR1cm47XHJcblx0XHRcdFx0aWYgKHRoaXMubW9kZSA9PSAnb24nKSB7XHJcblx0XHRcdFx0XHR0aGlzLnRvZ2dsZU1vZGUodGhpcy50aHJlZVdheSA/ICdvcHBvc2l0ZScgOiAnb2ZmJyk7XHJcblx0XHRcdFx0fSBlbHNlIHtcclxuXHRcdFx0XHRcdHRoaXMudG9nZ2xlTW9kZSgnb2ZmJylcclxuXHRcdFx0XHR9XHJcblx0XHRcdH1cclxuXHJcblx0XHRcdGNvbnRleHRtZW51KGV2ZW50OiBNb3VzZUV2ZW50KSB7XHJcblx0XHRcdFx0ZXZlbnQucHJldmVudERlZmF1bHQoKTtcclxuXHRcdFx0XHRpZiAodGhpcy5tb2RlICE9ICdvcHBvc2l0ZScpIHtcclxuXHRcdFx0XHRcdHRoaXMudG9nZ2xlTW9kZSgnb3Bwb3NpdGUnKTtcclxuXHRcdFx0XHR9IGVsc2Uge1xyXG5cdFx0XHRcdFx0dGhpcy50b2dnbGVNb2RlKCdvZmYnKTtcclxuXHRcdFx0XHR9XHJcblx0XHRcdH1cclxuXHJcblx0XHRcdHRvZ2dsZU1vZGUobW9kZTogTW9kZSwgZm9yY2UgPSBmYWxzZSkge1xyXG5cdFx0XHRcdGlmICh0aGlzLm1vZGUgPT0gbW9kZSAmJiAhZm9yY2UpIHJldHVybjtcclxuXHRcdFx0XHR0aGlzLm1vZGUgPSBtb2RlO1xyXG5cdFx0XHRcdHRoaXMuYnV0dG9uLnNldEF0dHJpYnV0ZSgnZWYtbW9kZScsIG1vZGUpO1xyXG5cdFx0XHRcdGlmIChtb2RlICE9ICdvZmYnICYmIHRoaXMuaW5jb21wYXRpYmxlKSB7XHJcblx0XHRcdFx0XHR0aGlzLnBhcmVudC5vZmZJbmNvbXBhdGlibGUodGhpcy5pbmNvbXBhdGlibGUpO1xyXG5cdFx0XHRcdH1cclxuXHRcdFx0XHR0aGlzLnBhcmVudC5yZXF1ZXN0VXBkYXRlKCk7XHJcblx0XHRcdH1cclxuXHJcblx0XHRcdHJlbW92ZSgpIHtcclxuXHRcdFx0XHR0aGlzLmJ1dHRvbi5yZW1vdmUoKTtcclxuXHRcdFx0XHR0aGlzLnRvZ2dsZU1vZGUoJ29mZicpO1xyXG5cdFx0XHR9XHJcblxyXG5cdFx0XHRzaG93KCkge1xyXG5cdFx0XHRcdHRoaXMuaGlkZGVuID0gZmFsc2U7XHJcblx0XHRcdFx0dGhpcy5idXR0b24uaGlkZGVuID0gZmFsc2U7XHJcblx0XHRcdH1cclxuXHRcdFx0aGlkZSgpIHtcclxuXHRcdFx0XHR0aGlzLmhpZGRlbiA9IHRydWU7XHJcblx0XHRcdFx0dGhpcy5idXR0b24uaGlkZGVuID0gdHJ1ZTtcclxuXHRcdFx0fVxyXG5cclxuXHRcdH1cclxuXHJcblx0fVxyXG59IiwiLy8vIDxyZWZlcmVuY2UgcGF0aD1cIi4vRmlsdGVyZXJJdGVtLnRzXCIgLz5cclxuXHJcbm5hbWVzcGFjZSBQb29wSnMge1xyXG5cdGV4cG9ydCBuYW1lc3BhY2UgRW50cnlGaWx0ZXJlckV4dGVuc2lvbiB7XHJcblxyXG5cdFx0ZXhwb3J0IGNsYXNzIEZpbHRlcjxEYXRhPiBleHRlbmRzIEZpbHRlcmVySXRlbTxEYXRhPiBpbXBsZW1lbnRzIElGaWx0ZXI8RGF0YT4ge1xyXG5cdFx0XHRkZWNsYXJlIGZpbHRlcjogRmlsdGVyRm48RGF0YT47XHJcblxyXG5cdFx0XHRjb25zdHJ1Y3RvcihkYXRhOiBGaWx0ZXJTb3VyY2U8RGF0YT4pIHtcclxuXHRcdFx0XHRkYXRhLmJ1dHRvbiA/Pz0gJ2J1dHRvbi5lZi1pdGVtLmVmLWZpbHRlcltlZi1tb2RlPVwib2ZmXCJdJztcclxuXHRcdFx0XHRzdXBlcihkYXRhKTtcclxuXHRcdFx0fVxyXG5cclxuXHRcdFx0LyoqIHJldHVybnMgaWYgaXRlbSBzaG91bGQgYmUgdmlzaWJsZSAqL1xyXG5cdFx0XHRhcHBseShkYXRhOiBEYXRhLCBlbDogSFRNTEVsZW1lbnQpOiBib29sZWFuIHtcclxuXHRcdFx0XHRpZiAodGhpcy5tb2RlID09ICdvZmYnKSByZXR1cm4gdHJ1ZTtcclxuXHRcdFx0XHRsZXQgdmFsdWUgPSB0aGlzLmZpbHRlcihkYXRhLCBlbCwgdGhpcy5tb2RlKTtcclxuXHRcdFx0XHRsZXQgcmVzdWx0ID0gdHlwZW9mIHZhbHVlID09IFwibnVtYmVyXCIgPyB2YWx1ZSA+IDAgOiB2YWx1ZTtcclxuXHRcdFx0XHRpZiAodGhpcy5tb2RlID09ICdvbicpIHJldHVybiByZXN1bHQ7XHJcblx0XHRcdFx0aWYgKHRoaXMubW9kZSA9PSAnb3Bwb3NpdGUnKSByZXR1cm4gIXJlc3VsdDtcclxuXHRcdFx0fVxyXG5cdFx0fVxyXG5cclxuXHRcdGV4cG9ydCBjbGFzcyBWYWx1ZUZpbHRlcjxEYXRhLCBWIGV4dGVuZHMgc3RyaW5nIHwgbnVtYmVyPiBleHRlbmRzIEZpbHRlcmVySXRlbTxEYXRhPiBpbXBsZW1lbnRzIElGaWx0ZXI8RGF0YT4ge1xyXG5cdFx0XHRkZWNsYXJlIGZpbHRlcjogVmFsdWVGaWx0ZXJGbjxEYXRhLCBWPjtcclxuXHRcdFx0aW5wdXQ6IEhUTUxJbnB1dEVsZW1lbnQ7XHJcblx0XHRcdGxhc3RWYWx1ZTogVjtcclxuXHJcblx0XHRcdGNvbnN0cnVjdG9yKGRhdGE6IFZhbHVlRmlsdGVyU291cmNlPERhdGEsIFY+KSB7XHJcblx0XHRcdFx0ZGF0YS5idXR0b24gPz89ICdidXR0b24uZWYtaXRlbS5lZi1maWx0ZXJbZWYtbW9kZT1cIm9mZlwiXSc7XHJcblx0XHRcdFx0c3VwZXIoZGF0YSk7XHJcblx0XHRcdFx0bGV0IHR5cGUgPSB0eXBlb2YgZGF0YS5pbnB1dCA9PSAnbnVtYmVyJyA/ICdudW1iZXInIDogJ3RleHQnO1xyXG5cdFx0XHRcdGxldCB2YWx1ZSA9IEpTT04uc3RyaW5naWZ5KGRhdGEuaW5wdXQpO1xyXG5cdFx0XHRcdGxldCBpbnB1dCA9IGBpbnB1dFt0eXBlPSR7dHlwZX1dW3ZhbHVlPSR7dmFsdWV9XWA7XHJcblx0XHRcdFx0dGhpcy5pbnB1dCA9IGVsbTwnaW5wdXQnPihpbnB1dCxcclxuXHRcdFx0XHRcdGlucHV0ID0+IHRoaXMuY2hhbmdlKCksXHJcblx0XHRcdFx0KS5hcHBlbmRUbyh0aGlzLmJ1dHRvbik7XHJcblx0XHRcdH1cclxuXHJcblx0XHRcdGNoYW5nZSgpIHtcclxuXHRcdFx0XHRsZXQgdmFsdWUgPSB0aGlzLmdldFZhbHVlKCk7XHJcblx0XHRcdFx0aWYgKHRoaXMubGFzdFZhbHVlICE9IHZhbHVlKSB7XHJcblx0XHRcdFx0XHR0aGlzLmxhc3RWYWx1ZSA9IHZhbHVlO1xyXG5cdFx0XHRcdFx0dGhpcy5wYXJlbnQucmVxdWVzdFVwZGF0ZSgpO1xyXG5cdFx0XHRcdH1cclxuXHRcdFx0fVxyXG5cclxuXHRcdFx0LyoqIHJldHVybnMgaWYgaXRlbSBzaG91bGQgYmUgdmlzaWJsZSAqL1xyXG5cdFx0XHRhcHBseShkYXRhOiBEYXRhLCBlbDogSFRNTEVsZW1lbnQpOiBib29sZWFuIHtcclxuXHRcdFx0XHRpZiAodGhpcy5tb2RlID09ICdvZmYnKSByZXR1cm4gdHJ1ZTtcclxuXHRcdFx0XHRsZXQgdmFsdWUgPSB0aGlzLmZpbHRlcih0aGlzLmdldFZhbHVlKCksIGRhdGEsIGVsKTtcclxuXHRcdFx0XHRsZXQgcmVzdWx0ID0gdHlwZW9mIHZhbHVlID09IFwibnVtYmVyXCIgPyB2YWx1ZSA+IDAgOiB2YWx1ZTtcclxuXHRcdFx0XHRpZiAodGhpcy5tb2RlID09ICdvbicpIHJldHVybiByZXN1bHQ7XHJcblx0XHRcdFx0aWYgKHRoaXMubW9kZSA9PSAnb3Bwb3NpdGUnKSByZXR1cm4gIXJlc3VsdDtcclxuXHRcdFx0fVxyXG5cclxuXHRcdFx0Z2V0VmFsdWUoKTogViB7XHJcblx0XHRcdFx0bGV0IHZhbHVlOiBWID0gKHRoaXMuaW5wdXQudHlwZSA9PSAndGV4dCcgPyB0aGlzLmlucHV0LnZhbHVlIDogdGhpcy5pbnB1dC52YWx1ZUFzTnVtYmVyKSBhcyBWO1xyXG5cdFx0XHRcdHJldHVybiB2YWx1ZTtcclxuXHRcdFx0fVxyXG5cdFx0fVxyXG5cclxuXHRcdGV4cG9ydCBjbGFzcyBNYXRjaEZpbHRlcjxEYXRhPiBleHRlbmRzIEZpbHRlcmVySXRlbTxEYXRhPiBpbXBsZW1lbnRzIElGaWx0ZXI8RGF0YT4ge1xyXG5cdFx0XHRkZWNsYXJlIHZhbHVlOiAoZGF0YTogRGF0YSwgZWw6IEhUTUxFbGVtZW50KSA9PiBzdHJpbmc7XHJcblx0XHRcdGlucHV0OiBIVE1MSW5wdXRFbGVtZW50O1xyXG5cdFx0XHRsYXN0VmFsdWU6IHN0cmluZztcclxuXHRcdFx0bWF0Y2hlcjogKGlucHV0OiBzdHJpbmcpID0+IGJvb2xlYW47XHJcblxyXG5cdFx0XHRjb25zdHJ1Y3RvcihkYXRhOiBNYXRjaEZpbHRlclNvdXJjZTxEYXRhPikge1xyXG5cdFx0XHRcdGRhdGEuYnV0dG9uID8/PSAnYnV0dG9uLmVmLWl0ZW0uZWYtZmlsdGVyW2VmLW1vZGU9XCJvZmZcIl0nO1xyXG5cdFx0XHRcdGRhdGEudmFsdWUgPz89IGRhdGEgPT4gSlNPTi5zdHJpbmdpZnkoZGF0YSk7XHJcblx0XHRcdFx0c3VwZXIoZGF0YSk7XHJcblx0XHRcdFx0bGV0IHZhbHVlID0gIWRhdGEuaW5wdXQgPyAnJyA6IEpTT04uc3RyaW5naWZ5KGRhdGEuaW5wdXQpO1xyXG5cdFx0XHRcdGxldCBpbnB1dCA9IGBpbnB1dFt0eXBlPXRleHR9XVt2YWx1ZT0ke3ZhbHVlfV1gO1xyXG5cdFx0XHRcdHRoaXMuaW5wdXQgPSBlbG08J2lucHV0Jz4oaW5wdXQsXHJcblx0XHRcdFx0XHRpbnB1dCA9PiB0aGlzLmNoYW5nZSgpLFxyXG5cdFx0XHRcdCkuYXBwZW5kVG8odGhpcy5idXR0b24pO1xyXG5cdFx0XHR9XHJcblxyXG5cdFx0XHRjaGFuZ2UoKSB7XHJcblx0XHRcdFx0aWYgKHRoaXMubGFzdFZhbHVlICE9IHRoaXMuaW5wdXQudmFsdWUpIHtcclxuXHRcdFx0XHRcdHRoaXMubGFzdFZhbHVlID0gdGhpcy5pbnB1dC52YWx1ZTtcclxuXHRcdFx0XHRcdHRoaXMubWF0Y2hlciA9IHRoaXMuZ2VuZXJhdGVNYXRjaGVyKHRoaXMubGFzdFZhbHVlKTtcclxuXHRcdFx0XHR9XHJcblx0XHRcdH1cclxuXHJcblx0XHRcdGFwcGx5KGRhdGE6IERhdGEsIGVsOiBIVE1MRWxlbWVudCk6IGJvb2xlYW4ge1xyXG5cdFx0XHRcdGlmICh0aGlzLm1vZGUgPT0gJ29mZicpIHJldHVybiB0cnVlO1xyXG5cdFx0XHRcdGxldCByZXN1bHQgPSB0aGlzLm1hdGNoZXIodGhpcy52YWx1ZShkYXRhLCBlbCkpO1xyXG5cdFx0XHRcdHJldHVybiB0aGlzLm1vZGUgPT0gJ29uJyA/IHJlc3VsdCA6ICFyZXN1bHQ7XHJcblx0XHRcdH1cclxuXHJcblx0XHRcdC8vIG1hdGNoZXJDYWNoZTogTWFwPHN0cmluZywgKChpbnB1dDogc3RyaW5nKSA9PiBib29sZWFuKT4gPSBuZXcgTWFwKCk7XHJcblx0XHRcdC8vIGdldE1hdGNoZXIoc291cmNlOiBzdHJpbmcpOiAoaW5wdXQ6IHN0cmluZykgPT4gYm9vbGVhbiB7XHJcblx0XHRcdC8vIFx0aWYgKHRoaXMubWF0Y2hlckNhY2hlLmhhcyhzb3VyY2UpKSB7XHJcblx0XHRcdC8vIFx0XHRyZXR1cm4gdGhpcy5tYXRjaGVyQ2FjaGUuZ2V0KHNvdXJjZSk7XHJcblx0XHRcdC8vIFx0fVxyXG5cdFx0XHQvLyBcdGxldCBtYXRjaGVyID0gdGhpcy5nZW5lcmF0ZU1hdGNoZXIoc291cmNlKTtcclxuXHRcdFx0Ly8gXHR0aGlzLm1hdGNoZXJDYWNoZS5zZXQoc291cmNlLCBtYXRjaGVyKTtcclxuXHRcdFx0Ly8gXHRyZXR1cm4gbWF0Y2hlcjtcclxuXHRcdFx0Ly8gfVxyXG5cdFx0XHRnZW5lcmF0ZU1hdGNoZXIoc291cmNlOiBzdHJpbmcpOiAoKGlucHV0OiBzdHJpbmcpID0+IGJvb2xlYW4pIHtcclxuXHRcdFx0XHRzb3VyY2UgPSBzb3VyY2UudHJpbSgpO1xyXG5cdFx0XHRcdGlmIChzb3VyY2UubGVuZ3RoID09IDApIHJldHVybiAoKSA9PiB0cnVlO1xyXG5cdFx0XHRcdGlmIChzb3VyY2UuaW5jbHVkZXMoJyAnKSkge1xyXG5cdFx0XHRcdFx0bGV0IHBhcnRzID0gc291cmNlLnNwbGl0KCcgJykubWFwKGUgPT4gdGhpcy5nZW5lcmF0ZU1hdGNoZXIoZSkpO1xyXG5cdFx0XHRcdFx0cmV0dXJuIChpbnB1dCkgPT4gcGFydHMuZXZlcnkobSA9PiBtKGlucHV0KSk7XHJcblx0XHRcdFx0fVxyXG5cdFx0XHRcdGlmIChzb3VyY2Uuc3RhcnRzV2l0aCgnLScpKSB7XHJcblx0XHRcdFx0XHRpZiAoc291cmNlLmxlbmd0aCA8IDMpIHJldHVybiAoKSA9PiB0cnVlO1xyXG5cdFx0XHRcdFx0bGV0IGJhc2UgPSB0aGlzLmdlbmVyYXRlTWF0Y2hlcihzb3VyY2Uuc2xpY2UoMSkpO1xyXG5cdFx0XHRcdFx0cmV0dXJuIChpbnB1dCkgPT4gIWJhc2UoaW5wdXQpO1xyXG5cdFx0XHRcdH1cclxuXHRcdFx0XHR0cnkge1xyXG5cdFx0XHRcdFx0bGV0IGZsYWdzID0gc291cmNlLnRvTG93ZXJDYXNlKCkgPT0gc291cmNlID8gJ2knIDogJyc7XHJcblx0XHRcdFx0XHRsZXQgcmVnZXggPSBuZXcgUmVnRXhwKHNvdXJjZSwgZmxhZ3MpO1xyXG5cdFx0XHRcdFx0cmV0dXJuIChpbnB1dCkgPT4gISFpbnB1dC5tYXRjaChyZWdleCk7XHJcblx0XHRcdFx0fSBjYXRjaCAoZSkgeyB9O1xyXG5cdFx0XHRcdHJldHVybiAoaW5wdXQpID0+IGlucHV0LmluY2x1ZGVzKHNvdXJjZSk7XHJcblx0XHRcdH1cclxuXHRcdH1cclxuXHJcblx0XHR0eXBlIFRhZ0dldHRlckZuPERhdGE+ID0gc2VsZWN0b3IgfCAoKGRhdGE6IERhdGEsIGVsOiBIVE1MRWxlbWVudCwgbW9kZTogTW9kZSkgPT4gKEhUTUxFbGVtZW50W10gfCBzdHJpbmdbXSkpO1xyXG5cdFx0ZXhwb3J0IGludGVyZmFjZSBUYWdGaWx0ZXJTb3VyY2U8RGF0YT4gZXh0ZW5kcyBGaWx0ZXJlckl0ZW1Tb3VyY2Uge1xyXG5cdFx0XHR0YWdzOiBUYWdHZXR0ZXJGbjxEYXRhPjtcclxuXHRcdFx0aW5wdXQ/OiBzdHJpbmc7XHJcblx0XHRcdGhpZ2hpZ2h0Q2xhc3M/OiBzdHJpbmc7XHJcblx0XHR9XHJcblx0XHR0eXBlIFRhZ01hdGNoZXIgPSB7IHBvc2l0aXZlOiBib29sZWFuLCBtYXRjaGVzOiAoczogc3RyaW5nKSA9PiBib29sZWFuIH07XHJcblxyXG5cdFx0ZXhwb3J0IGNsYXNzIFRhZ0ZpbHRlcjxEYXRhPiBleHRlbmRzIEZpbHRlcmVySXRlbTxEYXRhPiBpbXBsZW1lbnRzIElGaWx0ZXI8RGF0YT4ge1xyXG5cdFx0XHR0YWdzOiBUYWdHZXR0ZXJGbjxEYXRhPjtcclxuXHRcdFx0aW5wdXQ6IEhUTUxJbnB1dEVsZW1lbnQ7XHJcblx0XHRcdGhpZ2hpZ2h0Q2xhc3M6IHN0cmluZztcclxuXHJcblx0XHRcdGxhc3RWYWx1ZTogc3RyaW5nID0gJyc7XHJcblx0XHRcdGNhY2hlZE1hdGNoZXI6IFRhZ01hdGNoZXJbXTtcclxuXHJcblxyXG5cdFx0XHRjb25zdHJ1Y3RvcihkYXRhOiBUYWdGaWx0ZXJTb3VyY2U8RGF0YT4pIHtcclxuXHRcdFx0XHRkYXRhLmJ1dHRvbiA/Pz0gJ2J1dHRvbi5lZi1pdGVtLmVmLWZpbHRlcltlZi1tb2RlPVwib2ZmXCJdJztcclxuXHRcdFx0XHRzdXBlcihkYXRhKTtcclxuXHRcdFx0XHR0aGlzLmlucHV0ID0gZWxtPCdpbnB1dCc+KGBpbnB1dFt0eXBlPXRleHR9XWAsXHJcblx0XHRcdFx0XHRpbnB1dCA9PiB0aGlzLmNoYW5nZSgpLFxyXG5cdFx0XHRcdCkuYXBwZW5kVG8odGhpcy5idXR0b24pO1xyXG5cdFx0XHRcdHRoaXMuaW5wdXQudmFsdWUgPSBkYXRhLmlucHV0IHx8ICcnO1xyXG5cdFx0XHRcdHRoaXMudGFncyA9IGRhdGEudGFncztcclxuXHRcdFx0XHR0aGlzLmNhY2hlZE1hdGNoZXIgPSBbXTtcclxuXHJcblx0XHRcdFx0dGhpcy5oaWdoaWdodENsYXNzID0gZGF0YS5oaWdoaWdodENsYXNzID8/ICdlZi10YWctaGlnaGxpc2h0JztcclxuXHRcdFx0fVxyXG5cclxuXHRcdFx0YXBwbHkoZGF0YTogRGF0YSwgZWw6IEhUTUxFbGVtZW50KTogYm9vbGVhbiB7XHJcblx0XHRcdFx0bGV0IHRhZ3MgPSB0aGlzLmdldFRhZ3MoZGF0YSwgZWwpO1xyXG5cdFx0XHRcdHRhZ3MubWFwKHRhZyA9PiB0aGlzLnJlc2V0SGlnaGxpZ2h0KHRhZykpO1xyXG5cclxuXHRcdFx0XHRsZXQgcmVzdWx0cyA9IHRoaXMuY2FjaGVkTWF0Y2hlci5tYXAobSA9PiB7XHJcblx0XHRcdFx0XHRsZXQgciA9IHsgcG9zaXRpdmU6IG0ucG9zaXRpdmUsIGNvdW50OiAwIH07XHJcblx0XHRcdFx0XHRmb3IgKGxldCB0YWcgb2YgdGFncykge1xyXG5cdFx0XHRcdFx0XHRsZXQgc3RyID0gdHlwZW9mIHRhZyA9PSAnc3RyaW5nJyA/IHRhZyA6IHRhZy5pbm5lclRleHQ7XHJcblx0XHRcdFx0XHRcdGxldCB2YWwgPSBtLm1hdGNoZXMoc3RyKTtcclxuXHRcdFx0XHRcdFx0aWYgKHZhbCkge1xyXG5cdFx0XHRcdFx0XHRcdHIuY291bnQrKztcclxuXHRcdFx0XHRcdFx0XHR0aGlzLmhpZ2hsaWdodFRhZyh0YWcsIG0ucG9zaXRpdmUpO1xyXG5cdFx0XHRcdFx0XHR9XHJcblx0XHRcdFx0XHR9XHJcblx0XHRcdFx0XHRyZXR1cm4gcjtcclxuXHRcdFx0XHR9KTtcclxuXHRcdFx0XHRyZXR1cm4gcmVzdWx0cy5ldmVyeShyID0+IHIucG9zaXRpdmUgPyByLmNvdW50ID4gMCA6IHIuY291bnQgPT0gMCk7XHJcblx0XHRcdH1cclxuXHRcdFx0cmVzZXRIaWdobGlnaHQodGFnOiBzdHJpbmcgfCBIVE1MRWxlbWVudCkge1xyXG5cdFx0XHRcdGlmICh0eXBlb2YgdGFnID09ICdzdHJpbmcnKSByZXR1cm47XHJcblx0XHRcdFx0dGFnLmNsYXNzTGlzdC5yZW1vdmUodGhpcy5oaWdoaWdodENsYXNzKTtcclxuXHRcdFx0fVxyXG5cdFx0XHRoaWdobGlnaHRUYWcodGFnOiBzdHJpbmcgfCBIVE1MRWxlbWVudCwgcG9zaXRpdmU6IGJvb2xlYW4pIHtcclxuXHRcdFx0XHRpZiAodHlwZW9mIHRhZyA9PSAnc3RyaW5nJykgcmV0dXJuO1xyXG5cdFx0XHRcdC8vIEZJWE1FXHJcblx0XHRcdFx0dGFnLmNsYXNzTGlzdC5hZGQodGhpcy5oaWdoaWdodENsYXNzKTtcclxuXHRcdFx0fVxyXG5cclxuXHRcdFx0Z2V0VGFncyhkYXRhOiBEYXRhLCBlbDogSFRNTEVsZW1lbnQpOiBIVE1MRWxlbWVudFtdIHwgc3RyaW5nW10ge1xyXG5cdFx0XHRcdGlmICh0eXBlb2YgdGhpcy50YWdzID09ICdzdHJpbmcnKSByZXR1cm4gZWwucXE8SFRNTEVsZW1lbnQ+KHRoaXMudGFncyk7XHJcblx0XHRcdFx0cmV0dXJuIHRoaXMudGFncyhkYXRhLCBlbCwgdGhpcy5tb2RlKTtcclxuXHRcdFx0fVxyXG5cdFx0XHRnZXRUYWdTdHJpbmdzKGRhdGE6IERhdGEsIGVsOiBIVE1MRWxlbWVudCk6IHN0cmluZ1tdIHtcclxuXHRcdFx0XHRsZXQgdGFncyA9IHRoaXMuZ2V0VGFncyhkYXRhLCBlbCk7XHJcblx0XHRcdFx0aWYgKHR5cGVvZiB0YWdzWzBdID09ICdzdHJpbmcnKSByZXR1cm4gdGFncyBhcyBzdHJpbmdbXTtcclxuXHRcdFx0XHRyZXR1cm4gdGFncy5tYXAoKGUpID0+IGUuaW5uZXJUZXh0KTtcclxuXHRcdFx0fVxyXG5cclxuXHRcdFx0Y2hhbmdlKCkge1xyXG5cdFx0XHRcdGlmICh0aGlzLmxhc3RWYWx1ZSA9PSB0aGlzLmlucHV0LnZhbHVlKSByZXR1cm47XHJcblx0XHRcdFx0dGhpcy5sYXN0VmFsdWUgPSB0aGlzLmlucHV0LnZhbHVlO1xyXG5cdFx0XHRcdHRoaXMuY2FjaGVkTWF0Y2hlciA9IHRoaXMucGFyc2VNYXRjaGVyKHRoaXMubGFzdFZhbHVlKTtcclxuXHRcdFx0XHR0aGlzLnBhcmVudC5yZXF1ZXN0VXBkYXRlKCk7XHJcblx0XHRcdH1cclxuXHJcblx0XHRcdHBhcnNlTWF0Y2hlcihtYXRjaGVyOiBzdHJpbmcpOiBUYWdNYXRjaGVyW10ge1xyXG5cdFx0XHRcdG1hdGNoZXIudHJpbSgpO1xyXG5cdFx0XHRcdGlmICghbWF0Y2hlcikgcmV0dXJuIFtdO1xyXG5cclxuXHRcdFx0XHRpZiAobWF0Y2hlci5pbmNsdWRlcygnICcpKSB7XHJcblx0XHRcdFx0XHRsZXQgcGFydHMgPSBtYXRjaGVyLm1hdGNoKC9cIlteXCJdKlwifFxcUysvZykgfHwgW107XHJcblx0XHRcdFx0XHRyZXR1cm4gcGFydHMuZmxhdE1hcChlID0+IHRoaXMucGFyc2VNYXRjaGVyKGUpKTtcclxuXHRcdFx0XHR9XHJcblx0XHRcdFx0aWYgKG1hdGNoZXIuc3RhcnRzV2l0aCgnLScpKSB7XHJcblx0XHRcdFx0XHRsZXQgcGFydHMgPSB0aGlzLnBhcnNlTWF0Y2hlcihtYXRjaGVyLnNsaWNlKDEpKTtcclxuXHRcdFx0XHRcdHJldHVybiBwYXJ0cy5tYXAoZSA9PiAoeyBwb3NpdGl2ZTogIWUucG9zaXRpdmUsIG1hdGNoZXM6IGUubWF0Y2hlcyB9KSk7XHJcblx0XHRcdFx0fVxyXG5cdFx0XHRcdGlmIChtYXRjaGVyLm1hdGNoKC9cIl5bXlwiXSpcIiQvKSkge1xyXG5cdFx0XHRcdFx0bWF0Y2hlciA9IG1hdGNoZXIuc2xpY2UoMSwgLTEpO1xyXG5cdFx0XHRcdFx0cmV0dXJuIFt7IHBvc2l0aXZlOiB0cnVlLCBtYXRjaGVzOiB0YWcgPT4gdGFnID09IG1hdGNoZXIgfV07XHJcblx0XHRcdFx0fVxyXG5cdFx0XHRcdGlmIChtYXRjaGVyLmxlbmd0aCA8IDMpIHJldHVybiBbXTtcclxuXHRcdFx0XHRpZiAobWF0Y2hlci5tYXRjaCgvXCIvKT8ubGVuZ3RoID09IDEpIHJldHVybiBbXTtcclxuXHRcdFx0XHR0cnkge1xyXG5cdFx0XHRcdFx0bGV0IGcgPSBuZXcgUmVnRXhwKG1hdGNoZXIsICdpJyk7XHJcblx0XHRcdFx0XHRyZXR1cm4gW3sgcG9zaXRpdmU6IHRydWUsIG1hdGNoZXM6IHRhZyA9PiAhIXRhZy5tYXRjaChnKSB9XTtcclxuXHRcdFx0XHR9IGNhdGNoIChlKSB7IH1cclxuXHRcdFx0XHRyZXR1cm4gW3sgcG9zaXRpdmU6IHRydWUsIG1hdGNoZXM6IHRhZyA9PiB0YWcuaW5jbHVkZXMobWF0Y2hlcikgfV07XHJcblx0XHRcdH1cclxuXHJcblx0XHR9XHJcblxyXG5cdFx0ZXhwb3J0IGNsYXNzIFBhZ2luYXRpb25JbmZvRmlsdGVyPERhdGE+IGV4dGVuZHMgRmlsdGVyZXJJdGVtPERhdGE+IGltcGxlbWVudHMgSUZpbHRlcjxEYXRhPiB7XHJcblx0XHRcdGNvbnN0cnVjdG9yKGRhdGE6IEZpbHRlcmVySXRlbVNvdXJjZSkge1xyXG5cdFx0XHRcdHN1cGVyKGRhdGEpO1xyXG5cdFx0XHRcdHRoaXMuaW5pdCgpO1xyXG5cdFx0XHR9XHJcblx0XHRcdGFwcGx5KCkge1xyXG5cdFx0XHRcdHJldHVybiB0cnVlO1xyXG5cdFx0XHR9XHJcblx0XHRcdFBhZ2luYXRlID0gUG9vcEpzLlBhZ2luYXRlRXh0ZW5zaW9uLlBhZ2luYXRlO1xyXG5cdFx0XHRjb3VudFBhZ2luYXRlKCkge1xyXG5cdFx0XHRcdGxldCBkYXRhID0geyBydW5uaW5nOiAwLCBxdWV1ZWQ6IDAsIH07XHJcblx0XHRcdFx0Zm9yIChsZXQgcCBvZiB0aGlzLlBhZ2luYXRlLmluc3RhbmNlcykge1xyXG5cdFx0XHRcdFx0ZGF0YS5ydW5uaW5nICs9ICtwLnJ1bm5pbmc7XHJcblx0XHRcdFx0XHRkYXRhLnF1ZXVlZCArPSBwLnF1ZXVlZDtcclxuXHRcdFx0XHR9XHJcblx0XHRcdFx0cmV0dXJuIGRhdGE7XHJcblx0XHRcdH1cclxuXHJcblx0XHRcdHVwZGF0ZUluZm8oKSB7XHJcblx0XHRcdFx0bGV0IGRhdGEgPSB0aGlzLmNvdW50UGFnaW5hdGUoKTtcclxuXHRcdFx0XHRpZiAoIWRhdGEucnVubmluZyAmJiAhZGF0YS5xdWV1ZWQpIHtcclxuXHRcdFx0XHRcdHRoaXMuaGlkZSgpO1xyXG5cdFx0XHRcdH0gZWxzZSB7XHJcblx0XHRcdFx0XHR0aGlzLnNob3coKTtcclxuXHRcdFx0XHRcdHRoaXMuYnV0dG9uLmlubmVyVGV4dCA9IGAuLi4gKyR7ZGF0YS5ydW5uaW5nICsgZGF0YS5xdWV1ZWR9YDtcclxuXHRcdFx0XHR9XHJcblx0XHRcdH1cclxuXHJcblx0XHRcdGFzeW5jIGluaXQoKSB7XHJcblx0XHRcdFx0d2hpbGUodHJ1ZSkge1xyXG5cdFx0XHRcdFx0YXdhaXQgUHJvbWlzZS5mcmFtZSgpO1xyXG5cdFx0XHRcdFx0dGhpcy51cGRhdGVJbmZvKCk7XHJcblx0XHRcdFx0fVxyXG5cdFx0XHR9XHJcblx0XHR9XHJcblxyXG5cdH1cclxufVxyXG4iLCJuYW1lc3BhY2UgUG9vcEpzIHtcclxuXHRleHBvcnQgbmFtZXNwYWNlIEVudHJ5RmlsdGVyZXJFeHRlbnNpb24ge1xyXG5cclxuXHRcdGV4cG9ydCBjbGFzcyBNb2RpZmllcjxEYXRhPiBleHRlbmRzIEZpbHRlcmVySXRlbTxEYXRhPiBpbXBsZW1lbnRzIElNb2RpZmllcjxEYXRhPiB7XHJcblx0XHRcdGRlY2xhcmUgbW9kaWZpZXI6IE1vZGlmaWVyRm48RGF0YT47XHJcblx0XHRcdGRlY2xhcmUgcnVuT25Ob0NoYW5nZT86IGJvb2xlYW47XHJcblxyXG5cdFx0XHRjb25zdHJ1Y3RvcihkYXRhOiBNb2RpZmllclNvdXJjZTxEYXRhPikge1xyXG5cdFx0XHRcdGRhdGEuYnV0dG9uID8/PSAnYnV0dG9uLmVmLWl0ZW0uZWYtbW9kaWZpZXJbZWYtbW9kZT1cIm9mZlwiXSc7XHJcblx0XHRcdFx0c3VwZXIoZGF0YSk7XHJcblx0XHRcdH1cclxuXHJcblx0XHRcdHRvZ2dsZU1vZGUobW9kZTogTW9kZSwgZm9yY2UgPSBmYWxzZSkge1xyXG5cdFx0XHRcdGlmICh0aGlzLm1vZGUgPT0gbW9kZSAmJiAhZm9yY2UpIHJldHVybjtcclxuXHRcdFx0XHR0aGlzLnBhcmVudC5tb3ZlVG9Ub3AodGhpcyk7XHJcblx0XHRcdFx0c3VwZXIudG9nZ2xlTW9kZShtb2RlLCBmb3JjZSk7XHJcblx0XHRcdH1cclxuXHJcblx0XHRcdGFwcGx5KGRhdGE6IERhdGEsIGVsOiBIVE1MRWxlbWVudCkge1xyXG5cdFx0XHRcdGxldCBvbGRNb2RlOiBNb2RlIHwgbnVsbCA9IGVsLmdldEF0dHJpYnV0ZShgZWYtbW9kaWZpZXItJHt0aGlzLmlkfS1tb2RlYCkgYXMgKE1vZGUgfCBudWxsKTtcclxuXHRcdFx0XHRpZiAob2xkTW9kZSA9PSB0aGlzLm1vZGUgJiYgIXRoaXMucnVuT25Ob0NoYW5nZSkgcmV0dXJuO1xyXG5cdFx0XHRcdHRoaXMubW9kaWZpZXIoZGF0YSwgZWwsIHRoaXMubW9kZSwgbnVsbCk7XHJcblx0XHRcdFx0ZWwuc2V0QXR0cmlidXRlKGBlZi1tb2RpZmllci0ke3RoaXMuaWR9LW1vZGVgLCB0aGlzLm1vZGUpO1xyXG5cdFx0XHR9XHJcblx0XHR9XHJcblxyXG5cdFx0ZXhwb3J0IGNsYXNzIFByZWZpeGVyPERhdGE+IGV4dGVuZHMgRmlsdGVyZXJJdGVtPERhdGE+IGltcGxlbWVudHMgSU1vZGlmaWVyPERhdGE+IHtcclxuXHRcdFx0ZGVjbGFyZSB0YXJnZXQ6IHNlbGVjdG9yIHwgKChlOiBIVE1MRWxlbWVudCwgZGF0YTogRGF0YSwgbW9kZTogTW9kZSkgPT4gKEhUTUxFbGVtZW50IHwgSFRNTEVsZW1lbnRbXSkpO1xyXG5cdFx0XHRkZWNsYXJlIHByZWZpeD86IChkYXRhOiBEYXRhLCBlbDogSFRNTEVsZW1lbnQsIG1vZGU6IE1vZGUpID0+IHN0cmluZztcclxuXHRcdFx0ZGVjbGFyZSBwb3N0Zml4PzogKGRhdGE6IERhdGEsIGVsOiBIVE1MRWxlbWVudCwgbW9kZTogTW9kZSkgPT4gc3RyaW5nO1xyXG5cdFx0XHRkZWNsYXJlIHByZWZpeEF0dHJpYnV0ZTogc3RyaW5nO1xyXG5cdFx0XHRkZWNsYXJlIHBvc3RmaXhBdHRyaWJ1dGU6IHN0cmluZztcclxuXHRcdFx0ZGVjbGFyZSBhbGw6IGJvb2xlYW47XHJcblxyXG5cdFx0XHRjb25zdHJ1Y3RvcihkYXRhOiBQcmVmaXhlclNvdXJjZTxEYXRhPikge1xyXG5cdFx0XHRcdGRhdGEuYnV0dG9uID8/PSAnYnV0dG9uLmVmLWl0ZW0uZWYtbW9kaWZpZXJbZWYtbW9kZT1cIm9mZlwiXSc7XHJcblx0XHRcdFx0ZGF0YS50YXJnZXQgPz89IGUgPT4gZTtcclxuXHRcdFx0XHRkYXRhLnByZWZpeEF0dHJpYnV0ZSA/Pz0gJ2VmLXByZWZpeCc7XHJcblx0XHRcdFx0ZGF0YS5wb3N0Zml4QXR0cmlidXRlID8/PSAnZWYtcG9zdGZpeCc7XHJcblx0XHRcdFx0ZGF0YS5hbGwgPz89IGZhbHNlO1xyXG5cdFx0XHRcdHN1cGVyKGRhdGEpO1xyXG5cdFx0XHR9XHJcblxyXG5cdFx0XHRhcHBseShkYXRhOiBEYXRhLCBlbDogSFRNTEVsZW1lbnQpIHtcclxuXHRcdFx0XHRsZXQgdGFyZ2V0cyA9IHRoaXMuZ2V0VGFyZ2V0cyhlbCwgZGF0YSk7XHJcblx0XHRcdFx0aWYgKHRoaXMucHJlZml4KSB7XHJcblx0XHRcdFx0XHRpZiAodGhpcy5tb2RlID09ICdvZmYnKSB7XHJcblx0XHRcdFx0XHRcdHRhcmdldHMubWFwKGUgPT4gZS5yZW1vdmVBdHRyaWJ1dGUodGhpcy5wcmVmaXhBdHRyaWJ1dGUpKTtcclxuXHRcdFx0XHRcdH0gZWxzZSB7XHJcblx0XHRcdFx0XHRcdGxldCB2YWx1ZSA9IHRoaXMucHJlZml4KGRhdGEsIGVsLCB0aGlzLm1vZGUpO1xyXG5cdFx0XHRcdFx0XHR0YXJnZXRzLm1hcChlID0+IGUuc2V0QXR0cmlidXRlKHRoaXMucHJlZml4QXR0cmlidXRlLCB2YWx1ZSkpO1xyXG5cdFx0XHRcdFx0fVxyXG5cdFx0XHRcdH1cclxuXHRcdFx0XHRpZiAodGhpcy5wb3N0Zml4KSB7XHJcblx0XHRcdFx0XHRpZiAodGhpcy5tb2RlID09ICdvZmYnKSB7XHJcblx0XHRcdFx0XHRcdHRhcmdldHMubWFwKGUgPT4gZS5yZW1vdmVBdHRyaWJ1dGUodGhpcy5wb3N0Zml4QXR0cmlidXRlKSk7XHJcblx0XHRcdFx0XHR9IGVsc2Uge1xyXG5cdFx0XHRcdFx0XHRsZXQgdmFsdWUgPSB0aGlzLnBvc3RmaXgoZGF0YSwgZWwsIHRoaXMubW9kZSk7XHJcblx0XHRcdFx0XHRcdHRhcmdldHMubWFwKGUgPT4gZS5zZXRBdHRyaWJ1dGUodGhpcy5wb3N0Zml4QXR0cmlidXRlLCB2YWx1ZSkpO1xyXG5cdFx0XHRcdFx0fVxyXG5cdFx0XHRcdH1cclxuXHRcdFx0fVxyXG5cclxuXHRcdFx0Z2V0VGFyZ2V0cyhlbDogSFRNTEVsZW1lbnQsIGRhdGE6IERhdGEpOiBIVE1MRWxlbWVudFtdIHtcclxuXHRcdFx0XHRpZiAodHlwZW9mIHRoaXMudGFyZ2V0ID09ICdzdHJpbmcnKSB7XHJcblx0XHRcdFx0XHRpZiAodGhpcy5hbGwpIHJldHVybiBlbC5xcSh0aGlzLnRhcmdldCk7XHJcblx0XHRcdFx0XHRyZXR1cm4gW2VsLnEodGhpcy50YXJnZXQpXTtcclxuXHRcdFx0XHR9IGVsc2Uge1xyXG5cdFx0XHRcdFx0bGV0IHRhcmdldHMgPSB0aGlzLnRhcmdldChlbCwgZGF0YSwgdGhpcy5tb2RlKTtcclxuXHRcdFx0XHRcdHJldHVybiBBcnJheS5pc0FycmF5KHRhcmdldHMpID8gdGFyZ2V0cyA6IFt0YXJnZXRzXTtcclxuXHRcdFx0XHR9XHJcblx0XHRcdH1cclxuXHRcdH1cclxuXHJcblx0fVxyXG59IiwibmFtZXNwYWNlIFBvb3BKcyB7XHJcblx0ZXhwb3J0IG5hbWVzcGFjZSBFbnRyeUZpbHRlcmVyRXh0ZW5zaW9uIHtcclxuXHJcblx0XHRleHBvcnQgY2xhc3MgU29ydGVyPERhdGEsIFYgZXh0ZW5kcyBudW1iZXIgfCBzdHJpbmc+IGV4dGVuZHMgRmlsdGVyZXJJdGVtPERhdGE+IGltcGxlbWVudHMgSVNvcnRlcjxEYXRhPiB7XHJcblx0XHRcdGRlY2xhcmUgc29ydGVyOiBTb3J0ZXJGbjxEYXRhLCBWPjtcclxuXHRcdFx0ZGVjbGFyZSBjb21wYXJhdG9yOiAoYTogViwgYjogVikgPT4gbnVtYmVyO1xyXG5cclxuXHRcdFx0Y29uc3RydWN0b3IoZGF0YTogU29ydGVyU291cmNlPERhdGEsIFY+KSB7XHJcblx0XHRcdFx0ZGF0YS5idXR0b24gPz89ICdidXR0b24uZWYtaXRlbS5lZi1zb3J0ZXJbZWYtbW9kZT1cIm9mZlwiXSc7XHJcblx0XHRcdFx0ZGF0YS5jb21wYXJhdG9yID8/PSAoYTogViwgYjogVikgPT4gYSA+IGIgPyAxIDogYSA8IGIgPyAtMSA6IDA7XHJcblx0XHRcdFx0c3VwZXIoZGF0YSk7XHJcblx0XHRcdH1cclxuXHJcblx0XHRcdHRvZ2dsZU1vZGUobW9kZTogTW9kZSwgZm9yY2UgPSBmYWxzZSkge1xyXG5cdFx0XHRcdGlmICh0aGlzLm1vZGUgPT0gbW9kZSAmJiAhZm9yY2UpIHJldHVybjtcclxuXHRcdFx0XHR0aGlzLnBhcmVudC5tb3ZlVG9Ub3AodGhpcyk7XHJcblx0XHRcdFx0c3VwZXIudG9nZ2xlTW9kZShtb2RlLCBmb3JjZSk7XHJcblx0XHRcdH1cclxuXHJcblx0XHRcdHNvcnQobGlzdDogW0RhdGEsIEhUTUxFbGVtZW50XVtdKTogW0RhdGEsIEhUTUxFbGVtZW50XVtdIHtcclxuXHRcdFx0XHRpZiAodGhpcy5tb2RlID09ICdvZmYnKSByZXR1cm4gbGlzdDtcclxuXHRcdFx0XHRyZXR1cm4gbGlzdC52c29ydCgoW2RhdGEsIGVsXTogW0RhdGEsIEhUTUxFbGVtZW50XSkgPT4gdGhpcy5hcHBseShkYXRhLCBlbCksIChhOiBWLCBiOiBWKSA9PiB0aGlzLmNvbXBhcmUoYSwgYikpO1xyXG5cdFx0XHR9XHJcblxyXG5cdFx0XHQvKiogcmV0dXJucyBvcmRlciBvZiBlbnRyeSAqL1xyXG5cdFx0XHRhcHBseShkYXRhOiBEYXRhLCBlbDogSFRNTEVsZW1lbnQpOiBWIHtcclxuXHRcdFx0XHRyZXR1cm4gdGhpcy5zb3J0ZXIoZGF0YSwgZWwsIHRoaXMubW9kZSk7XHJcblx0XHRcdH1cclxuXHJcblx0XHRcdGNvbXBhcmUoYTogViwgYjogVik6IG51bWJlciB7XHJcblx0XHRcdFx0aWYgKHRoaXMubW9kZSA9PSAnb24nKSB7XHJcblx0XHRcdFx0XHRyZXR1cm4gdGhpcy5jb21wYXJhdG9yKGEsIGIpO1xyXG5cdFx0XHRcdH1cclxuXHRcdFx0XHRpZiAodGhpcy5tb2RlID09ICdvcHBvc2l0ZScpIHtcclxuXHRcdFx0XHRcdHJldHVybiB0aGlzLmNvbXBhcmF0b3IoYiwgYSk7XHJcblx0XHRcdFx0fVxyXG5cdFx0XHRcdHJldHVybiAwO1xyXG5cdFx0XHR9XHJcblx0XHR9XHJcblxyXG5cdH1cclxufSIsIm5hbWVzcGFjZSBQb29wSnMge1xyXG5cclxuXHRleHBvcnQgbmFtZXNwYWNlIEVudHJ5RmlsdGVyZXJFeHRlbnNpb24ge1xyXG5cdFx0ZXhwb3J0IHR5cGUgV2F5bmVzcyA9IGZhbHNlIHwgdHJ1ZSB8ICdkaXInO1xyXG5cdFx0ZXhwb3J0IHR5cGUgTW9kZSA9ICdvZmYnIHwgJ29uJyB8ICdvcHBvc2l0ZSc7XHJcblxyXG5cdFx0ZXhwb3J0IHR5cGUgUGFyc2VyRm48RGF0YT4gPSAoZWw6IEhUTUxFbGVtZW50LCBkYXRhOiBQYXJ0aWFsPERhdGE+KSA9PiBQYXJ0aWFsPERhdGE+IHwgdm9pZCB8IFByb21pc2VMaWtlPFBhcnRpYWw8RGF0YSB8IHZvaWQ+PjtcclxuXHRcdGV4cG9ydCB0eXBlIEZpbHRlckZuPERhdGE+ID0gKGRhdGE6IERhdGEsIGVsOiBIVE1MRWxlbWVudCwgbW9kZTogTW9kZSkgPT4gYm9vbGVhbjtcclxuXHRcdGV4cG9ydCB0eXBlIFNvcnRlckZuPERhdGEsIFY+ID0gKGRhdGE6IERhdGEsIGVsOiBIVE1MRWxlbWVudCwgbW9kZTogTW9kZSkgPT4gVjtcclxuXHRcdGV4cG9ydCB0eXBlIE1vZGlmaWVyRm48RGF0YT4gPSAoZGF0YTogRGF0YSwgZWw6IEhUTUxFbGVtZW50LCBtb2RlOiBNb2RlLCBvbGRNb2RlOiBNb2RlIHwgbnVsbCkgPT4gdm9pZDtcclxuXHRcdGV4cG9ydCB0eXBlIFZhbHVlRmlsdGVyRm48RGF0YSwgVj4gPSAodmFsdWU6IFYsIGRhdGE6IERhdGEsIGVsOiBIVE1MRWxlbWVudCkgPT4gYm9vbGVhbjtcclxuXHRcdGV4cG9ydCB0eXBlIFByZWZpeGVyRm48RGF0YT4gPSAoZGF0YTogRGF0YSwgZWw6IEhUTUxFbGVtZW50LCBtb2RlOiBNb2RlKSA9PiBzdHJpbmc7XHJcblxyXG5cdFx0ZXhwb3J0IGludGVyZmFjZSBJRmlsdGVyPERhdGE+IGV4dGVuZHMgRmlsdGVyZXJJdGVtPERhdGE+IHtcclxuXHRcdFx0YXBwbHkoZGF0YTogRGF0YSwgZWw6IEhUTUxFbGVtZW50KTogYm9vbGVhbjtcclxuXHRcdH1cclxuXHRcdGV4cG9ydCBpbnRlcmZhY2UgSVNvcnRlcjxEYXRhPiBleHRlbmRzIEZpbHRlcmVySXRlbTxEYXRhPiB7XHJcblx0XHRcdHNvcnQobGlzdDogW0RhdGEsIEhUTUxFbGVtZW50XVtdKTogW0RhdGEsIEhUTUxFbGVtZW50XVtdO1xyXG5cdFx0fVxyXG5cdFx0ZXhwb3J0IGludGVyZmFjZSBJTW9kaWZpZXI8RGF0YT4gZXh0ZW5kcyBGaWx0ZXJlckl0ZW08RGF0YT4ge1xyXG5cdFx0XHRhcHBseShkYXRhOiBEYXRhLCBlbDogSFRNTEVsZW1lbnQpOiB2b2lkO1xyXG5cdFx0fVxyXG5cclxuXHRcdGV4cG9ydCBpbnRlcmZhY2UgRmlsdGVyZXJJdGVtU291cmNlIHtcclxuXHRcdFx0YnV0dG9uPzogc2VsZWN0b3I7XHJcblx0XHRcdGlkOiBzdHJpbmc7XHJcblx0XHRcdG5hbWU/OiBzdHJpbmc7XHJcblx0XHRcdGRlc2NyaXB0aW9uPzogc3RyaW5nO1xyXG5cdFx0XHR0aHJlZVdheT86IFdheW5lc3M7XHJcblx0XHRcdG1vZGU/OiBNb2RlO1xyXG5cdFx0XHRwYXJlbnQ6IEVudHJ5RmlsdGVyZXI7XHJcblx0XHRcdGluY29tcGF0aWJsZT86IHN0cmluZ1tdO1xyXG5cdFx0XHRoaWRkZW4/OiBib29sZWFuO1xyXG5cdFx0fVxyXG5cdFx0ZXhwb3J0IGludGVyZmFjZSBGaWx0ZXJTb3VyY2U8RGF0YT4gZXh0ZW5kcyBGaWx0ZXJlckl0ZW1Tb3VyY2Uge1xyXG5cdFx0XHRmaWx0ZXI6IEZpbHRlckZuPERhdGE+O1xyXG5cdFx0fVxyXG5cdFx0ZXhwb3J0IGludGVyZmFjZSBWYWx1ZUZpbHRlclNvdXJjZTxEYXRhLCBWPiBleHRlbmRzIEZpbHRlcmVySXRlbVNvdXJjZSB7XHJcblx0XHRcdGZpbHRlcjogVmFsdWVGaWx0ZXJGbjxEYXRhLCBWPjtcclxuXHRcdFx0aW5wdXQ6IFY7XHJcblx0XHR9XHJcblx0XHRleHBvcnQgaW50ZXJmYWNlIE1hdGNoRmlsdGVyU291cmNlPERhdGE+IGV4dGVuZHMgRmlsdGVyZXJJdGVtU291cmNlIHtcclxuXHRcdFx0dmFsdWU/OiAoZGF0YTogRGF0YSwgZWw6IEhUTUxFbGVtZW50KSA9PiBzdHJpbmc7XHJcblx0XHRcdGlucHV0Pzogc3RyaW5nO1xyXG5cdFx0fVxyXG5cdFx0ZXhwb3J0IGludGVyZmFjZSBTb3J0ZXJTb3VyY2U8RGF0YSwgVj4gZXh0ZW5kcyBGaWx0ZXJlckl0ZW1Tb3VyY2Uge1xyXG5cdFx0XHRzb3J0ZXI6IFNvcnRlckZuPERhdGEsIFY+O1xyXG5cdFx0XHRjb21wYXJhdG9yPzogKChhOiBWLCBiOiBWKSA9PiBudW1iZXIpIHwgVjtcclxuXHRcdH1cclxuXHRcdGV4cG9ydCBpbnRlcmZhY2UgTW9kaWZpZXJTb3VyY2U8RGF0YT4gZXh0ZW5kcyBGaWx0ZXJlckl0ZW1Tb3VyY2Uge1xyXG5cdFx0XHRtb2RpZmllcjogTW9kaWZpZXJGbjxEYXRhPjtcclxuXHRcdH1cclxuXHRcdGV4cG9ydCBpbnRlcmZhY2UgUHJlZml4ZXJTb3VyY2U8RGF0YT4gZXh0ZW5kcyBGaWx0ZXJlckl0ZW1Tb3VyY2Uge1xyXG5cdFx0XHR0YXJnZXQ/OiBzZWxlY3RvciB8ICgoZWw6IEhUTUxFbGVtZW50LCBkYXRhOiBEYXRhLCBtb2RlOiBNb2RlKSA9PiBIVE1MRWxlbWVudCk7XHJcblx0XHRcdHByZWZpeD86IChkYXRhOiBEYXRhLCBlbDogSFRNTEVsZW1lbnQpID0+IHN0cmluZztcclxuXHRcdFx0cG9zdGZpeD86IChkYXRhOiBEYXRhLCBlbDogSFRNTEVsZW1lbnQpID0+IHN0cmluZztcclxuXHRcdFx0cHJlZml4QXR0cmlidXRlPzogc3RyaW5nO1xyXG5cdFx0XHRwb3N0Zml4QXR0cmlidXRlPzogc3RyaW5nO1xyXG5cdFx0XHRhbGw/OiBib29sZWFuO1xyXG5cdFx0fVxyXG5cclxuXHRcdFxyXG5cdFx0ZXhwb3J0IGludGVyZmFjZSBGaWx0ZXJlckl0ZW1QYXJ0aWFsIHtcclxuXHRcdFx0YnV0dG9uPzogc2VsZWN0b3I7XHJcblx0XHRcdGlkPzogc3RyaW5nO1xyXG5cdFx0XHRuYW1lPzogc3RyaW5nO1xyXG5cdFx0XHRkZXNjcmlwdGlvbj86IHN0cmluZztcclxuXHRcdFx0dGhyZWVXYXk/OiBXYXluZXNzO1xyXG5cdFx0XHRtb2RlPzogTW9kZTtcclxuXHRcdFx0aW5jb21wYXRpYmxlPzogc3RyaW5nW107XHJcblx0XHRcdGhpZGRlbj86IGJvb2xlYW47XHJcblx0XHR9XHJcblx0XHRleHBvcnQgaW50ZXJmYWNlIEZpbHRlclBhcnRpYWw8RGF0YT4gZXh0ZW5kcyBGaWx0ZXJlckl0ZW1QYXJ0aWFsIHsgfVxyXG5cdFx0ZXhwb3J0IGludGVyZmFjZSBWYWx1ZUZpbHRlclBhcnRpYWw8RGF0YSwgVj4gZXh0ZW5kcyBGaWx0ZXJlckl0ZW1QYXJ0aWFsIHtcclxuXHRcdFx0aW5wdXQ6IFY7XHJcblx0XHR9XHJcblx0XHRleHBvcnQgaW50ZXJmYWNlIFNvcnRlclBhcnRpYWxTb3VyY2U8RGF0YSwgVj4gZXh0ZW5kcyBGaWx0ZXJlckl0ZW1QYXJ0aWFsIHtcclxuXHRcdFx0Y29tcGFyYXRvcj86ICgoYTogViwgYjogVikgPT4gbnVtYmVyKSB8IFY7XHJcblx0XHR9XHJcblx0XHRleHBvcnQgaW50ZXJmYWNlIE1vZGlmaWVyUGFydGlhbDxEYXRhPiBleHRlbmRzIEZpbHRlcmVySXRlbVBhcnRpYWwgeyB9XHJcblx0XHRleHBvcnQgaW50ZXJmYWNlIFByZWZpeGVyUGFydGlhbDxEYXRhPiBleHRlbmRzIEZpbHRlcmVySXRlbVBhcnRpYWwge1xyXG5cdFx0XHR0YXJnZXQ/OiBzZWxlY3RvciB8ICgoZWw6IEhUTUxFbGVtZW50LCBkYXRhOiBEYXRhLCBtb2RlOiBNb2RlKSA9PiBIVE1MRWxlbWVudCk7XHJcblx0XHRcdHByZWZpeD86IChkYXRhOiBEYXRhLCBlbDogSFRNTEVsZW1lbnQpID0+IHN0cmluZztcclxuXHRcdFx0cG9zdGZpeD86IChkYXRhOiBEYXRhLCBlbDogSFRNTEVsZW1lbnQpID0+IHN0cmluZztcclxuXHRcdFx0cHJlZml4QXR0cmlidXRlPzogc3RyaW5nO1xyXG5cdFx0XHRwb3N0Zml4QXR0cmlidXRlPzogc3RyaW5nO1xyXG5cdFx0XHRhbGw/OiBib29sZWFuO1xyXG5cdFx0fVxyXG5cclxuXHRcdHR5cGUgVW5pb248U291cmNlLCBSZXN1bHQ+ID0ge1xyXG5cdFx0XHRbUCBpbiBrZXlvZiBTb3VyY2UgJiBrZXlvZiBSZXN1bHRdOiBTb3VyY2VbUF0gfCBSZXN1bHRbUF07XHJcblx0XHR9ICYgT21pdDxTb3VyY2UsIGtleW9mIFJlc3VsdD4gJiBPbWl0PFJlc3VsdCwga2V5b2YgU291cmNlPjtcclxuXHJcblx0XHR0eXBlIE92ZXJyaWRlPFQsIE8+ID0gT21pdDxULCBrZXlvZiBPPiAmIE87XHJcblxyXG5cdFx0dHlwZSBFRlNvdXJjZTxUIGV4dGVuZHMgeyBzb3VyY2U6IGFueSB9PiA9IE92ZXJyaWRlPE92ZXJyaWRlPFBhcnRpYWw8VD4sIFRbJ3NvdXJjZSddPiwgeyBidXR0b24/OiBzZWxlY3RvciB9PjtcclxuXHJcblx0XHR0eXBlIFNvdXJjZTxUIGV4dGVuZHMgeyBzb3VyY2U6IGFueSB9PiA9IFRbJ3NvdXJjZSddICYge1xyXG5cdFx0XHRpZD86IHN0cmluZzsgbmFtZT86IHN0cmluZzsgZGVzY3JpcHRpb24/OiBzdHJpbmc7XHJcblx0XHRcdHRocmVlV2F5PzogV2F5bmVzczsgbW9kZT86IE1vZGU7IGluY29tcGF0aWJsZT86IHN0cmluZ1tdOyBoaWRkZW4/OiBib29sZWFuO1xyXG5cdFx0fTtcclxuXHJcblxyXG5cdFx0LyoqXHJcblx0XHQgKiBjYW4gYmUgZWl0aGVyIE1hcCBvciBXZWFrTWFwXHJcblx0XHQgKiAoV2Vha01hcCBpcyBsaWtlbHkgdG8gYmUgdXNlbGVzcyBpZiB0aGVyZSBhcmUgbGVzcyB0aGVuIDEwayBvbGQgbm9kZXMgaW4gbWFwKVxyXG5cdFx0ICovXHJcblx0XHRsZXQgTWFwVHlwZSA9IE1hcDtcclxuXHRcdHR5cGUgTWFwVHlwZTxLIGV4dGVuZHMgb2JqZWN0LCBWPiA9Ly8gTWFwPEssIFY+IHwgXHJcblx0XHRcdFdlYWtNYXA8SywgVj47XHJcblx0fVxyXG5cclxuXHRleHBvcnQgbGV0IEVGID0gRW50cnlGaWx0ZXJlckV4dGVuc2lvbi5FbnRyeUZpbHRlcmVyO1xyXG59IiwiIl19