// ==UserScript==
// @name         ModuleRaid with unsafeWindow
// @namespace    Itsnotlupus Industries
// @version      5.1.2
// @description  This is build 5.1.2 of pixeldesu's moduleraid, patched to target unsafeWindow to work consistently within userscripts
// @author       pixeldesu
// @license      MIT
// ==/UserScript==


// source: https://unpkg.com/moduleraid@5.1.2/dist/moduleraid.umd.js
// tweak:  s/window/unsafeWindow/g

! function(t, e) {
    "object" == typeof exports && "undefined" != typeof module ? module.exports = e() : "function" == typeof define && define.amd ? define(e) : (t || self).moduleraid = e()
}(this, function() {
    function t() {
        return (t = Object.assign || function(t) {
            for (var e = 1; e < arguments.length; e++) {
                var o = arguments[e];
                for (var n in o) Object.prototype.hasOwnProperty.call(o, n) && (t[n] = o[n])
            }
            return t
        }).apply(this, arguments)
    }
    return function() {
        function e(e) {
            var o, n = this;
            this.entrypoint = void 0, this.debug = void 0, this.moduleID = Math.random().toString(36).substring(7), this.functionArguments = [
                [
                    [0],
                    [function(t, e, o) {
                        var r = o.c;
                        Object.keys(r).forEach(function(t) {
                            n.modules[t] = r[t].exports
                        }), n.constructors = o.m, n.get = o
                    }]
                ],
                [
                    [1e3], (o = {}, o[this.moduleID] = function(t, e, o) {
                        var r = o.c;
                        Object.keys(r).forEach(function(t) {
                            n.modules[t] = r[t].exports
                        }), n.constructors = o.m, n.get = o
                    }, o), [
                        [this.moduleID]
                    ]
                ]
            ], this.arrayArguments = [this.functionArguments[1],
                [
                    [this.moduleID], {},
                    function(t) {
                        Object.keys(t.m).forEach(function(e) {
                            try {
                                n.modules[e] = t(e)
                            } catch (t) {
                                n.log("[arrayArguments/1] Failed to require(" + e + ") with error:\n" + t + "\n" + t.stack)
                            }
                        }), n.get = t
                    }
                ]
            ], this.modules = {}, this.constructors = [], this.get = null;
            var r = {
                entrypoint: "webpackJsonp",
                debug: !1
            };
            "object" == typeof e ? r = t({}, r, e) : "boolean" == typeof e && (console.warn("[moduleRaid] Using a single boolean argument is deprecated, please use 'new ModuleRaid({ debug: true })'"), r.debug = e), this.entrypoint = r.entrypoint, this.debug = r.debug, this.fillModules(), this.replaceGet()
        }
        var o = e.prototype;
        return o.log = function(t) {
            this.debug && console.warn("[moduleRaid] " + t)
        }, o.replaceGet = function() {
            var t = this;
            null === this.get && (this.get = function(e) {
                return t.modules[e]
            })
        }, o.fillModules = function() {
            var t = this;
            if ("function" == typeof webpackJsonp ? this.functionArguments.forEach(function(e, o) {
                    try {
                        var n;
                        (n = unsafeWindow)[t.entrypoint].apply(n, e)
                    } catch (e) {
                        t.log("moduleRaid.functionArguments[" + o + "] failed:\n" + e + "\n" + e.stack)
                    }
                }) : this.arrayArguments.forEach(function(e, o) {
                    try {
                        if (unsafeWindow[t.entrypoint].push(e), t.modules && Object.keys(t.modules).length > 0) return
                    } catch (e) {
                        t.log("Pushing moduleRaid.arrayArguments[" + o + "] into " + t.entrypoint + " failed:\n" + e + "\n" + e.stack)
                    }
                }), this.modules && 0 == Object.keys(this.modules).length) {
                var e = !1,
                    o = 0;
                if (!unsafeWindow[this.entrypoint]([], [], [o])) throw Error("Unknown Webpack structure");
                for (; !e;) try {
                    this.modules[o] = unsafeWindow[this.entrypoint]([], [], [o]), o++
                } catch (t) {
                    e = !0
                }
            }
        }, o.findModule = function(t) {
            var e = this,
                o = [],
                n = Object.keys(this.modules);
            if (0 === n.length) throw new Error("There are no modules to search through!");
            return n.forEach(function(n) {
                var r = e.modules[n];
                try {
                    if ("string" == typeof t) switch (t = t.toLowerCase(), typeof r) {
                        case "string":
                            r.includes(t) && o.push(r);
                            break;
                        case "function":
                            r.toString().toLowerCase().includes(t) && o.push(r);
                            break;
                        case "object":
                            if ("object" == typeof r.default)
                                for (n in r.default) n.toLowerCase() === t && o.push(r);
                            for (n in r) n.toLowerCase() === t && o.push(r)
                    } else {
                        if ("function" != typeof t) throw new TypeError("findModule can only find via string and function, " + typeof t + " was passed");
                        t(r) && o.push(r)
                    }
                } catch (t) {
                    e.log("There was an error while searching through module '" + n + "':\n" + t + "\n" + t.stack)
                }
            }), o
        }, o.findConstructor = function(t) {
            var e = this,
                o = [],
                n = Object.keys(this.constructors);
            if (0 === n.length) throw new Error("There are no constructors to search through!");
            return n.forEach(function(n) {
                var r = e.constructors[n];
                try {
                    "string" == typeof t ? (t = t.toLowerCase(), r.toString().toLowerCase().includes(t) && o.push([e.constructors[n], e.modules[n]])) : "function" == typeof t && t(r) && o.push([e.constructors[n], e.modules[n]])
                } catch (t) {
                    e.log("There was an error while searching through constructor '" + n + "':\n" + t + "\n" + t.stack)
                }
            }), o
        }, e
    }()
});