// ==UserScript==
// @name         osu-web
// @namespace    osu
// @version      1.1.6
// @description  Library to modify static and dynamic components of osu web pages
// @author       Magnus Cosmos
// ==/UserScript==

let self;
try {
    self = unsafeWindow;
} catch (err) {
    self = window;
}

// Utils
self.isNonEmptyObj = self.isNonEmptyObj || ((obj) => {
    if (obj === null || (typeof obj !== "function" && typeof obj !== "object")) {
        return false;
    }
    for (const _key in obj) {
        return true;
    }
    return false;
});

self.loaded = self.loaded || ((selector, parent = document, options = { childList: true }) => {
    return new Promise((resolve) => {
        const el = parent.querySelector(selector);
        if (el) {
            resolve(el);
        } else {
            new MutationObserver(function (_mutations, observer) {
                const el = parent.querySelector(selector);
                if (el) {
                    resolve(el);
                    observer = observer ? observer : this;
                    observer.disconnect();
                }
            }).observe(parent, options);
        }
    });
});

// Classes
self.Webpack = self.Webpack || (function () {
    "use strict";
    let _instance;
    const inject = (entryPoint, data) => {
        try {
            self[entryPoint].push(data);
        } catch (err) {
            throw new Error(`Injection failed: ${err.message}`);
        }
    }
    class Webpack {
        constructor(options) {
            if (_instance) {
                return _instance;
            }
            _instance = this;
            this.modules = {};
            let { moduleId, chunkId, entryPoint } = options || {};
            moduleId = moduleId || Math.random().toString(36).substring(2, 6);
            chunkId = chunkId || Math.floor(101 + Math.random() * 899);
            entryPoint = entryPoint || "webpackJsonp";
            const data = [
                [chunkId],
                {
                    [moduleId]: (_module, _exports, require) => {
                        for (const key of Object.keys(require.m)) {
                            const exports = require(key);
                            if (self.isNonEmptyObj(exports)) {
                                this.modules[key] = exports;
                            }
                        }
                    },
                },
                (require) => {
                    require(require.s = moduleId);
                },
            ];
            inject(entryPoint, data);
        }
    }
    return Webpack;
}());

self.OsuWeb = self.OsuWeb || (function () {
    "use strict";
    let _instance;
    const _static = [];
    const _dynamic = [];
    const _before = {};
    const _after = {};
    const _keys = [];
    const appendStyle = (function () {
        const style = document.querySelector("#osu-web");
        if (!(style || this.style)) {
            this.style = document.createElement("style");
            this.style.id = "osu-web";
            document.head.append(this.style);
        }
    });
    const getTurboLinks = (function () {
        for (const id in this.webpack.modules) {
            const exports = this.webpack.modules[id];
            if ("controller" in exports) {
                this.turbolinks = exports;
                return;
            }
        }
    });
    const getReactModules = (function () {
        const reactModules = new Set();
        for (const id in this.webpack.modules) {
            const exports = this.webpack.modules[id];
            if ("__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED" in exports) {
                reactModules.add(exports);
            }
        }
        [this.React, this.ReactDOM] = reactModules;
    });
    const modify = ((obj, fn, key) => {
        const oldFn = obj[fn];
        obj[fn] = function () {
            beforeFn(key, arguments);
            const r = oldFn.apply(this, arguments);
            afterFn(key, arguments, r);
            return r;
        };
    });
    const beforeFn = ((key, args) => {
        const arr = _before[key] || [];
        for (const fn of arr) {
            fn(args);
        }
    });
    const afterFn = ((key, args, r) => {
        const arr = _after[key] || [];
        for (const fn of arr) {
            fn(args, r);
        }
    });
    const modifyFn = ((obj, fn, key, before, after) => {
        if (!_keys.includes(key)) {
            _keys.push(key);
            _before[key] = [];
            _after[key] = [];
            modify(obj, fn, key);
        }
        if (before) {
            _before[key].push(before);
        }
        if (after) {
            _after[key].push(after);
        }
    });
    const init = (function (body) {
        this.webpack = new self.Webpack({entryPoint: "webpackChunk"});
        this.modifyFn = modifyFn;
        getTurboLinks.call(this);
        getReactModules.call(this);
        appendStyle.call(this);
        for (const fn of _static) {
            fn.call(this, body);
        }
        const controller = this.turbolinks.controller;
        modifyFn(controller, "render", "turbolinks.render", null, (args, r) => {
            for (const fn of _static) {
                fn.call(this, r.newBody);
            }
        });
        for (const fn of _dynamic) {
            fn.call(this);
        }
    });
    class OsuWeb {
        constructor(staticFn, dynamicFn) {
            if (staticFn) {
                _static.push(staticFn);
            }
            if (dynamicFn) {
                _dynamic.push(dynamicFn);
            }
            if (_instance) {
                return _instance;
            }
            _instance = this;
            self.loaded("html", document).then((html) => {
                self.loaded("body", html).then((body) => {
                    init.call(_instance, body);
                });
            });
        }

        addStyle(css) {
            this.style.innerHTML += `\n${css}`;
        }
    }
    return OsuWeb;
}());