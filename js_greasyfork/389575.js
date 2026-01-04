// ==UserScript==
// @name         FB Messages Count
// @namespace    http://tampermonkey.net/
// @version      1.2
// @description  Show messages count on Facebook.com and Messenger.com
// @author       You
// @match        https://www.messenger.com/*
// @include https://www.messenger.com/*
// @include https://www.facebook.com/*
// @grant        none
// @run-at document-start
// @downloadURL https://update.greasyfork.org/scripts/389575/FB%20Messages%20Count.user.js
// @updateURL https://update.greasyfork.org/scripts/389575/FB%20Messages%20Count.meta.js
// ==/UserScript==

(function(a) {
    if (a.require)
        return;
    var b = (a.Env || {}).gk_require_dic
      , c = null
      , d = []
      , e = b ? Object.create(null) : {}
      , f = b ? Object.create(null) : {}
      , g = 0
      , h = 0
      , i = 0
      , j = 1
      , k = 2
      , l = 4
      , m = 8
      , n = {}
      , o = Object.prototype.hasOwnProperty
      , p = Object.prototype.toString;
    function q(a) {
        a = Array.prototype.slice.call(a);
        var b = {}, c, d, f, g;
        while (a.length) {
            d = a.shift();
            if (b[d])
                continue;
            b[d] = !0;
            f = e[d];
            if (!f || Q(f))
                continue;
            if (f.dependencies)
                for (c = 0; c < f.dependencies.length; c++)
                    g = f.dependencies[c],
                    Q(g) || a.push(g.id)
        }
        for (d in b)
            o.call(b, d) && a.push(d);
        b = [];
        for (c = 0; c < a.length; c++) {
            d = a[c];
            var h = d;
            f = e[d];
            if (!f || !f.dependencies)
                h += " is not defined";
            else if (Q(f))
                h += " is ready";
            else {
                d = [];
                for (var i = 0; i < f.dependencies.length; i++)
                    g = f.dependencies[i],
                    (!e[g] || !Q(e[g])) && d.push(g.id);
                h += " is waiting for " + d.join(", ")
            }
            b.push(h)
        }
        return b.join("\n")
    }
    function r(a) {
        this.name = "ModuleError",
        this.message = a,
        this.stack = Error(a).stack,
        this.framesToPop = 2
    }
    r.prototype = Object.create(Error.prototype);
    r.prototype.constructor = r;
    var s = (a.Env || {}).profile_require_factories, t = a.performance || a.msPerformance || a.webkitPerformance || {}, u;
    if (t.now && t.timing && t.timing.navigationStart) {
        var v = t.timing.navigationStart;
        u = function() {
            return t.now() + v
        }
    } else
        u = function() {
            return Date.now()
        }
        ;
    var w = 0
      , x = 0;
    function y(a) {
        x++;
        var b = e[a];
        if (b && b.exports != null) {
            b.refcount-- === 1 && (e[a] = void 0);
            return b.exports
        }
        return A(a)
    }
    function z(b) {
        var c = e[b];
        b = f[b];
        if (c.factoryLength === -1) {
            var d = s && a.ProfilingCounters, g;
            d && (g = d.startTiming("FACTORY_COMPILE_TIME"));
            c.factoryLength = c.factory.length;
            g != null && (d = d.stopTiming(g),
            b.compileTime += d)
        }
        return c.factoryLength
    }
    function A(b) {
        var d = a.ErrorGuard;
        if (d && !d.inGuard())
            return d.applyWithGuard(A, null, [b]);
        d = e[b];
        if (!d) {
            var g = 'Requiring unknown module "' + b + '"';
            throw new r(g)
        }
        var h;
        if (d.hasError)
            throw new r('Requiring module "' + b + '" which threw an exception: ' + d.error.message);
        if (!Q(d))
            throw new r('Requiring module "' + b + '" with unresolved dependencies: ' + q([b]));
        g = d.exports = {};
        var i = d.factory;
        if (p.call(i) === "[object Function]") {
            var j = d.dependencies
              , l = j.length;
            try {
                try {
                    U(d)
                } catch (a) {
                    B(a, b)
                }
                var o = []
                  , t = l;
                d.special & m && (o = c.slice(0),
                o[c.length - 2] = d,
                o[c.length - 1] = g,
                t += o.length);
                if (d.special & k) {
                    g = z(b);
                    t = Math.min(l + o.length, g)
                }
                for (var g = 0; g < l; g++) {
                    var v = j[g];
                    o.length < t && o.push(y.call(null, v.id))
                }
                ++w;
                var x, C, D;
                s && (D = u(),
                x = a.ProfilingCounters,
                x && (x.incrementCounter("FACTORY_COUNT", 1),
                C = x.startTiming("FACTORY_EXEC_TIME")));
                try {
                    v = i.apply(d.context || a, o)
                } catch (a) {
                    B(a, b)
                } finally {
                    if (s) {
                        t = u();
                        j = 0;
                        C != null && (j = x.stopTiming(C));
                        l = f[d.id];
                        l.factoryTime = j;
                        l.factoryEnd = t;
                        l.factoryStart = D;
                        if (i.__SMmeta)
                            for (var E in i.__SMmeta)
                                Object.prototype.hasOwnProperty.call(i.__SMmeta, E) && (l[E] = i.__SMmeta[E])
                    }
                }
            } catch (a) {
                d.hasError = !0;
                d.error = a;
                d.exports = null;
                throw a
            }
            v && (d.exports = v);
            if (typeof d.exports === "function") {
                g = d.exports;
                o = g.__superConstructor__;
                (!g.displayName || o && o.displayName === g.displayName) && (g.displayName = (g.name || "(anonymous)") + " [from " + b + "]")
            }
            d.factoryFinished = !0
        } else
            d.exports = i;
        j = "__isRequired__" + b;
        t = e[j];
        t && !Q(t) && H(j, n);
        d.refcount-- === 1 && (e[b] = void 0);
        return d.exports
    }
    function B(b, c) {
        b instanceof Error || (b = new Error(b));
        var d = a.ErrorSerializer;
        if (d) {
            var e = d.parse(b.message);
            e.message.indexOf(' from module "%s"') < 0 && (e.message += ' from module "%s"',
            e.params = e.params || [],
            e.params.push(c),
            b.message = d.stringify(e))
        }
        throw b
    }
    function C() {
        var a = 0;
        for (var b in f)
            Object.prototype.hasOwnProperty.call(f, b) && (a += f[b].factoryTime);
        return a
    }
    function D() {
        var a = 0;
        for (var b in f)
            Object.prototype.hasOwnProperty.call(f, b) && (a += f[b].compileTime);
        return a
    }
    function E() {
        return w
    }
    function F() {
        return x
    }
    function G() {
        var a = {};
        for (var b in f)
            Object.prototype.hasOwnProperty.call(f, b) && (a[b] = f[b]);
        return a
    }
    function H(b, c, g, h, i, j, k) {
        c === void 0 ? (c = [],
        g = b,
        b = M()) : g === void 0 && (g = c,
        p.call(b) === "[object Array]" ? (c = b,
        b = M(c.join(","))) : c = []);
        var l = {
            cancel: K.bind(this, b)
        }
          , m = e[b];
        if (!c && !g && j) {
            I(b).refcount += j;
            return l
        }
        f[b] = {
            id: b,
            dependencies: c,
            meta: k,
            category: h,
            defined: s ? u() : null,
            compileTime: null,
            factoryTime: null,
            factoryStart: null,
            factoryEnd: null
        };
        k = c.map(I);
        m = e[b];
        if (m) {
            if (m.dependencies && !m.reload)
                return l;
            j && (m.refcount += j);
            m.factory = g;
            m.dependencies = k;
            m.context = i;
            m.special = h
        } else
            m = new J(b,j || 0,null,g,k,i,h),
            e[b] = m;
        T(m);
        if (d.length > 0) {
            var n = d;
            d = [];
            c = a.ScheduleJSWork ? a.ScheduleJSWork : Z;
            c(function() {
                while (n.length > 0)
                    y.call(null, n.pop().id)
            })()
        }
        return l
    }
    function I(a) {
        var b = e[a];
        if (b)
            return b;
        b = new J(a,0);
        e[a] = b;
        return b
    }
    function J(a, b, c, d, e, f, g) {
        this.id = a,
        this.refcount = b,
        this.exports = c || null,
        this.factory = d,
        this.factoryLength = -1,
        this.factoryFinished = !1,
        this.dependencies = e,
        this.depPosition = 0,
        this.context = f,
        this.special = g || 0,
        this.hasError = !1,
        this.error = null,
        this.ranRecursiveSideEffects = !1,
        this.sideEffectDependencyException = null,
        this.nextDepWaitingHead = null,
        this.nextDepWaitingNext = null,
        this.tarjanGeneration = -1,
        this.tarjanLow = 0,
        this.tarjanIndex = 0,
        this.tarjanOnStack = !1
    }
    function K(a) {
        if (!e[a])
            return;
        var b = e[a];
        e[a] = void 0;
        if (b.dependencies)
            for (var a = 0; a < b.dependencies.length; a++) {
                var c = b.dependencies[a];
                c.refcount-- === 1 && K(c.id)
            }
    }
    function L(a, b, c) {
        return H("__requireLazy__" + (a.length > 0 ? a.join(",") + "__" : "") + g++, a, $()(b, "requireLazy", {
            propagationType: 0
        }), j, c, 1)
    }
    function M(a) {
        return "__mod__" + (a ? a + "__" : "") + g++
    }
    function N(a, b, c) {
        c.tarjanGeneration != h && (c.tarjanGeneration = h,
        c.tarjanLow = c.tarjanIndex = i++,
        c.tarjanOnStack = !0,
        b.push(c));
        if (c.dependencies != null)
            for (var d = c.depPosition; d < c.dependencies.length; d++) {
                var e = c.dependencies[d];
                e.tarjanGeneration != h ? (N(a, b, e),
                c.tarjanLow = Math.min(c.tarjanLow, e.tarjanLow)) : e.tarjanOnStack && (c.tarjanLow = Math.min(c.tarjanLow, e.tarjanIndex))
            }
        if (c.tarjanLow == c.tarjanIndex) {
            e = [];
            do {
                d = b.pop();
                d.tarjanOnStack = !1;
                e.push(d);
                if (c == b[0] && d != c && d.dependencies != null)
                    for (var f = d.depPosition; f < d.dependencies.length; f++) {
                        var g = d.dependencies[f];
                        !Q(g) && a.indexOf(g) == -1 && b.indexOf(g) == -1 && e.indexOf(g) == -1 && a.push(g)
                    }
            } while (d != c)
        }
    }
    function O(a) {
        h++,
        N(a.dependencies, [], a),
        a.depPosition++,
        T(a)
    }
    function P(a, b) {
        var c = b;
        while (!0) {
            if (c.dependencies && c.depPosition != c.dependencies.length)
                c = c.dependencies[c.depPosition];
            else
                break;
            if (c == a) {
                O(a);
                return
            }
        }
        a.nextDepWaitingNext = b.nextDepWaitingHead;
        b.nextDepWaitingHead = a
    }
    function Q(a) {
        return a.dependencies != null && a.depPosition >= a.dependencies.length
    }
    function R(a) {
        a.depPosition++,
        T(a)
    }
    function S(a) {
        var b = a.nextDepWaitingHead;
        a.nextDepWaitingHead = null;
        while (b !== null) {
            a = b;
            b = a.nextDepWaitingNext;
            a.nextDepWaitingNext = null;
            var c = !e[a.id];
            c || R(a)
        }
    }
    function aa(a) {
        return a.special & j
    }
    function T(a) {
        while (a.depPosition < a.dependencies.length) {
            var b = a.dependencies[a.depPosition]
              , c = Q(b);
            if (!c && a != b) {
                P(a, b);
                return
            }
            a.depPosition++
        }
        aa(a) && d.push(a);
        a.nextDepWaitingHead !== null && S(a)
    }
    function U(a) {
        if (a.sideEffectDependencyException)
            throw a.sideEffectDependencyException;
        if (a.ranRecursiveSideEffects)
            return;
        a.ranRecursiveSideEffects = !0;
        var b = a.dependencies;
        if (b)
            for (var c = 0; c < b.length; c++) {
                var d = b[c];
                try {
                    U(d)
                } catch (b) {
                    a.sideEffectDependencyException = b;
                    throw b
                }
                if (d.special & l)
                    try {
                        y.call(null, d.id)
                    } catch (b) {
                        a.sideEffectDependencyException = b;
                        throw b
                    }
            }
    }
    function V(a, b) {
        e[a] = new J(a,0,b),
        f[a] = {
            id: a,
            dependencies: [],
            category: 0,
            compileTime: null,
            factoryLengthAccessTime: null,
            factoryTime: null,
            factoryStart: null,
            factoryEnd: null
        }
    }
    V("module", 0);
    V("exports", 0);
    V("define", H);
    V("global", a);
    V("require", y);
    V("requireDynamic", W);
    V("requireLazy", L);
    V("requireWeak", X);
    V("ifRequired", Y);
    c = [y.call(null, "global"), y.call(null, "require"), y.call(null, "requireDynamic"), y.call(null, "requireLazy"), null, null];
    H.amd = {};
    a.define = H;
    a.require = y;
    a.requireDynamic = W;
    a.requireLazy = L;
    function W(a, b) {
        throw new ReferenceError("requireDynamic is not defined")
    }
    function X(a, b) {
        Y.call(null, a, function(a) {
            b(a)
        }, function() {
            H("__requireWeak__" + a + "__" + g++, ["__isRequired__" + a], $()(function() {
                b(e[a].exports)
            }, "requireWeak"), j, null, 1)
        })
    }
    function Y(a, b, c) {
        a = e[a];
        if (a && a.factoryFinished) {
            if (typeof b === "function")
                return b(a.exports)
        } else if (typeof c === "function")
            return c()
    }
    b = {
        getModules: function() {
            var a = {};
            for (var b in e)
                e[b] && Object.prototype.hasOwnProperty.call(e, b) && (a[b] = e[b]);
            return a
        },
        modulesMap: e,
        debugUnresolvedDependencies: q
    };
    function Z(a) {
        return a
    }
    function $() {
        var b = a.TimeSlice && a.TimeSlice.guard ? a.TimeSlice.guard : Z;
        return function() {
            return b.apply(void 0, arguments)
        }
    }
    V("__getFactoryTime", C);
    V("__getCompileTime", D);
    V("__getTotalFactories", E);
    V("__getTotalRequireCalls", F);
    V("__getModuleTimeDetails", G);
    V("__debug", b);
    Object.defineProperty(a, '__d', {
        writeable: false,
        value: function(a, b, c, d) {
            $()(function() {
                H(a, b, c, (d || k) | m, null, null, null)
            }, "define " + a, {
                root: !0
            })()
        }
    });
    ;
    if (a.__d_stub) {
        for (var X = 0; X < a.__d_stub.length; X++)
            a.__d.apply(null, a.__d_stub[X]);
        delete a.__d_stub
    }
    if (a.__rl_stub) {
        for (var W = 0; W < a.__rl_stub.length; W++)
            L.apply(null, a.__rl_stub[W]);
        delete a.__rl_stub
    }
}
)(window);

(async() => {
    console.log('Running');

    __d("MercuryThreadTitleReact.bs", ["fbt", "bs_array", "bs_block", "bs_curry", "React", "bs_js_dict", "bs_caml_obj", "BadgeReact.bs", "MercuryIDs", "bs_belt_Option", "CurrentUser", "ReasonReact.bs", "bs_js_primitive", "bs_js_null_undefined", "MessengerParticipants.bs", "MercuryParticipantListRenderer", "MessengerTextWithEmoticonsReact.bs", "WorkUserEmojiWithTooltipBootloader.react"], (function(a, b, c, d, e, f, g) {
        __p && __p();
        var h = b("ReasonReact.bs").reducerComponent("MercuryThreadTitleReact");
        function i(a, b) {
            return g._("{conversation-title} ({unread-count})", [g._param("conversation-title", a), g._param("unread-count", String(b))])
        }
        function a(a, c, d, e, f, g, j, k, l) {
            function tryGenerateMessagesCount(item, thread = d) {
                if (!item) return;

                try {
                    if(typeof item == 'string') item += ` [${thread.message_count}]`, thread.title_modified = true;
                } catch (err){};

                if (!thread.title_modified) {
                    try {
                        if(typeof item.$1[0] == 'string') item.$1[0] += ` [${thread.message_count}]`, thread.title_modified = true;
                    } catch (err){};
                }

                if (!thread.title_modified) {
                    try {
                        if(typeof item.props.text == 'string') item.props.text += ` [${thread.message_count}]`, thread.title_modified = true;
                    } catch (err){};
                }

                if (!thread.title_modified) {
                    try {
                        if(typeof item.props.content[1].props.text == 'string') item.props.content[1].props.text += ` [${thread.message_count}]`, thread.title_modified = true;
                    } catch (err){};
                }

                if (!thread.title_modified) console.log(item);

                return item;
            }
            // console.log({ a, c, d, e, f, g, j, k, l })
            __p && __p();
            var m = f !== void 0 ? f : !1
              , n = g !== void 0 ? g : !1
              , o = j !== void 0 ? j : !1
              , p = k !== void 0 ? k : !1
              , q = function(a) {
                __p && __p();
                if (d.name === "") {
                    b("bs_curry")._1(a[3], [""]);
                    var c = b("MercuryIDs").getParticipantIDFromUserID(e)
                      , f = d.participants.length > 1 ? d.participants.filter(function(a) {
                        return a !== c
                    }) : d.participants;
                    b("MessengerParticipants.bs").getMulti(f, function(c) {
                        __p && __p();
                        if (a[1][2][0]) {
                            var e = [];
                            b("bs_array").iter(function(a) {
                                a = c[a];
                                if (a !== void 0) {
                                    e.push(a);
                                    return 0
                                } else
                                    return 0
                            }, f);
                            var g = b("bs_js_null_undefined").bind(d.custom_nickname, function(a) {
                                var c = {};
                                b("bs_array").iter(function(a) {
                                    c[a[0]] = b("ReasonReact.bs").element(void 0, void 0, b("MessengerTextWithEmoticonsReact.bs").make(!0, !0, a[1], void 0, []));
                                    return 0
                                }, b("bs_js_dict").entries(a));
                                return c
                            });
                            g = new (b("MercuryParticipantListRenderer"))().setUseShortName(o).setUseAndSeparator(p).setIsNewThread(m).setNickname(g).renderParticipantList(e);
                            g = tryGenerateMessagesCount(g);
                            g = n && d.unread_count > 0 ? i(g, d.unread_count) : g;
                            return b("bs_curry")._1(a[3], [g])
                        } else
                            return 0
                    });
                    return 0
                } else
                    return 0
            }
              , r = function() {
                if (c !== void 0) {
                    var a = c;
                    a = a === 0 || a >= d.name.length ? d.name : d.name.slice(0, a) + "..."
                } else
                    a = d.name;
                a = tryGenerateMessagesCount(a);
                if (d.unread_count === 0 || !n)
                    void 0;
                    // return a;
                else
                    a = i(a, d.unread_count);
                a = b("ReasonReact.bs").element(void 0, void 0, b("MessengerTextWithEmoticonsReact.bs").make(!0, !0, a, void 0, []));
                return a;
            };
            return [h[0], h[1], h[2], h[3], function(a) {
                a[1][2][0] = !0;
                return q(a)
            }
            , function(a) {
                a = a[1];
                if (a[1][0][0] !== d) {
                    a[1][0][0] = d;
                    return q(a)
                } else
                    return 0
            }
            , function(a) {
                a[1][2][0] = !1;
                return 0
            }
            , h[7], function(c) {
                __p && __p();
                c = d.name !== "" ? r(0) : c[1][1];
                // c = tryGenerateMessagesCount(c);
                var e = d.other_user_fbid;
                e = e == null ? void 0 : b("bs_js_primitive").some(e);
                e = b("CurrentUser").isWorkUser() && e !== void 0 ? b("React").createElement(b("WorkUserEmojiWithTooltipBootloader.react"), {
                    userID: b("bs_belt_Option").getExn(e),
                    withSpace: !0
                }) : null;
                var f = b("bs_belt_Option").flatMap(b("bs_js_primitive").nullable_to_opt(b("MercuryIDs").getParticipantIDFromFromThreadID(d.thread_id)), function(a) {
                    return b("bs_js_primitive").nullable_to_opt(b("MessengerParticipants.bs").getNow(a))
                });
                f = f !== void 0 && b("bs_caml_obj").caml_equal(b("bs_js_primitive").nullable_to_opt(b("bs_js_primitive").valFromOption(f).verification_status), "BLUE_VERIFIED") ? b("ReasonReact.bs").element(void 0, void 0, b("BadgeReact.bs").make("medium", "verified", [])) : null;
                var g = {};
                a !== void 0 && (g.className = b("bs_js_primitive").valFromOption(a));
                return b("React").createElement("span", g, c, e, f, l)
            }
            , function() {
                return [[d], "", [!1]]
            }
            , h[10], function(a, c) {
                return b("bs_block").__(0, [[c[0], a[0], c[2]]])
            }
            , h[12]]
        }
        f.component = h;
        f.renderTitleWithUnreadCount = i;
        f.make = a
    }
    ), null);
})();