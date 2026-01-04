// ==UserScript==
// @name         SchoolCheats AdBlock Bypass
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  a bypass for SchoolCheats adblock detection because there homo
// @author       You
// @match        https://schoolcheats.net/*
// @icon         https://www.google.com/s2/favicons?domain=schoolcheats.net
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/428947/SchoolCheats%20AdBlock%20Bypass.user.js
// @updateURL https://update.greasyfork.org/scripts/428947/SchoolCheats%20AdBlock%20Bypass.meta.js
// ==/UserScript==

(function() {
    'use strict';

    (function(t) {
    function e(e) {
        for (var n, r, c = e[0], i = e[1], l = e[2], u = 0, d = []; u < c.length; u++)
            r = c[u],
            Object.prototype.hasOwnProperty.call(s, r) && s[r] && d.push(s[r][0]),
            s[r] = 0;
        for (n in i)
            Object.prototype.hasOwnProperty.call(i, n) && (t[n] = i[n]);
        p && p(e);
        while (d.length)
            d.shift()();
        return o.push.apply(o, l || []),
        a()
    }
    function a() {
        for (var t, e = 0; e < o.length; e++) {
            for (var a = o[e], n = !0, r = 1; r < a.length; r++) {
                var c = a[r];
                0 !== s[c] && (n = !1)
            }
            n && (o.splice(e--, 1),
            t = i(i.s = a[0]))
        }
        return t
    }
    var n = {}
      , r = {
        app: 0
    }
      , s = {
        app: 0
    }
      , o = [];
    function c(t) {
        return i.p + "js/" + ({}[t] || t) + "." + {
            "chunk-2c7259f8": "9c20d284",
            "chunk-2d0d7808": "a1086409",
            "chunk-2d0e22f7": "92ecd8ef",
            "chunk-2d210231": "3246f466",
            "chunk-2d21eae7": "832a926b",
            "chunk-2d224920": "9a10de90",
            "chunk-2d225fd4": "7e1d923c",
            "chunk-2d22bfc0": "5d450942",
            "chunk-d1b43168": "1ef0ac55"
        }[t] + ".js"
    }
    function i(e) {
        if (n[e])
            return n[e].exports;
        var a = n[e] = {
            i: e,
            l: !1,
            exports: {}
        };
        return t[e].call(a.exports, a, a.exports, i),
        a.l = !0,
        a.exports
    }
    i.e = function(t) {
        var e = []
          , a = {
            "chunk-d1b43168": 1
        };
        r[t] ? e.push(r[t]) : 0 !== r[t] && a[t] && e.push(r[t] = new Promise((function(e, a) {
            for (var n = "css/" + ({}[t] || t) + "." + {
                "chunk-2c7259f8": "31d6cfe0",
                "chunk-2d0d7808": "31d6cfe0",
                "chunk-2d0e22f7": "31d6cfe0",
                "chunk-2d210231": "31d6cfe0",
                "chunk-2d21eae7": "31d6cfe0",
                "chunk-2d224920": "31d6cfe0",
                "chunk-2d225fd4": "31d6cfe0",
                "chunk-2d22bfc0": "31d6cfe0",
                "chunk-d1b43168": "335d27cd"
            }[t] + ".css", s = i.p + n, o = document.getElementsByTagName("link"), c = 0; c < o.length; c++) {
                var l = o[c]
                  , u = l.getAttribute("data-href") || l.getAttribute("href");
                if ("stylesheet" === l.rel && (u === n || u === s))
                    return e()
            }
            var d = document.getElementsByTagName("style");
            for (c = 0; c < d.length; c++) {
                l = d[c],
                u = l.getAttribute("data-href");
                if (u === n || u === s)
                    return e()
            }
            var p = document.createElement("link");
            p.rel = "stylesheet",
            p.type = "text/css",
            p.onload = e,
            p.onerror = function(e) {
                var n = e && e.target && e.target.src || s
                  , o = new Error("Loading CSS chunk " + t + " failed.\n(" + n + ")");
                o.code = "CSS_CHUNK_LOAD_FAILED",
                o.request = n,
                delete r[t],
                p.parentNode.removeChild(p),
                a(o)
            }
            ,
            p.href = s;
            var h = document.getElementsByTagName("head")[0];
            h.appendChild(p)
        }
        )).then((function() {
            r[t] = 0
        }
        )));
        var n = s[t];
        if (0 !== n)
            if (n)
                e.push(n[2]);
            else {
                var o = new Promise((function(e, a) {
                    n = s[t] = [e, a]
                }
                ));
                e.push(n[2] = o);
                var l, u = document.createElement("script");
                u.charset = "utf-8",
                u.timeout = 120,
                i.nc && u.setAttribute("nonce", i.nc),
                u.src = c(t);
                var d = new Error;
                l = function(e) {
                    u.onerror = u.onload = null,
                    clearTimeout(p);
                    var a = s[t];
                    if (0 !== a) {
                        if (a) {
                            var n = e && ("load" === e.type ? "missing" : e.type)
                              , r = e && e.target && e.target.src;
                            d.message = "Loading chunk " + t + " failed.\n(" + n + ": " + r + ")",
                            d.name = "ChunkLoadError",
                            d.type = n,
                            d.request = r,
                            a[1](d)
                        }
                        s[t] = void 0
                    }
                }
                ;
                var p = setTimeout((function() {
                    l({
                        type: "timeout",
                        target: u
                    })
                }
                ), 12e4);
                u.onerror = u.onload = l,
                document.head.appendChild(u)
            }
        return Promise.all(e)
    }
    ,
    i.m = t,
    i.c = n,
    i.d = function(t, e, a) {
        i.o(t, e) || Object.defineProperty(t, e, {
            enumerable: !0,
            get: a
        })
    }
    ,
    i.r = function(t) {
        "undefined" !== typeof Symbol && Symbol.toStringTag && Object.defineProperty(t, Symbol.toStringTag, {
            value: "Module"
        }),
        Object.defineProperty(t, "__esModule", {
            value: !0
        })
    }
    ,
    i.t = function(t, e) {
        if (1 & e && (t = i(t)),
        8 & e)
            return t;
        if (4 & e && "object" === typeof t && t && t.__esModule)
            return t;
        var a = Object.create(null);
        if (i.r(a),
        Object.defineProperty(a, "default", {
            enumerable: !0,
            value: t
        }),
        2 & e && "string" != typeof t)
            for (var n in t)
                i.d(a, n, function(e) {
                    return t[e]
                }
                .bind(null, n));
        return a
    }
    ,
    i.n = function(t) {
        var e = t && t.__esModule ? function() {
            return t["default"]
        }
        : function() {
            return t
        }
        ;
        return i.d(e, "a", e),
        e
    }
    ,
    i.o = function(t, e) {
        return Object.prototype.hasOwnProperty.call(t, e)
    }
    ,
    i.p = "/",
    i.oe = function(t) {
        throw console.error(t),
        t
    }
    ;
    var l = window["webpackJsonp"] = window["webpackJsonp"] || []
      , u = l.push.bind(l);
    l.push = e,
    l = l.slice();
    for (var d = 0; d < l.length; d++)
        e(l[d]);
    var p = u;
    o.push([0, "chunk-vendors"]),
    a()
}
)({
    0: function(t, e, a) {
        t.exports = a("56d7")
    },
    "034f": function(t, e, a) {
        "use strict";
        a("85ec")
    },
    1: function(t, e) {},
    10: function(t, e) {},
    11: function(t, e) {},
    12: function(t, e) {},
    13: function(t, e) {},
    14: function(t, e) {},
    "1a12": function(t, e, a) {},
    2: function(t, e) {},
    3: function(t, e) {},
    4: function(t, e) {},
    5: function(t, e) {},
    "56d7": function(t, e, a) {
        "use strict";
        a.r(e);
        a("e260"),
        a("e6cf"),
        a("cca6"),
        a("a79d");
        var n = a("2b0e")
          , r = function() {
            var t = this
              , e = t.$createElement
              , a = t._self._c || e;
            return t.loadingUser ? a("v-app", {
                staticStyle: {
                    background: "#121212"
                }
            }, [a("div", {
                staticClass: "mid-container"
            }, [a("GridLoader", {
                attrs: {
                    color: "#2196f3",
                    size: Number(200)
                }
            })], 1)]) : a("v-app", {
                staticStyle: {
                    background: "#121212"
                }
            }, [a("Navbar"), t.adblocker ? a("div", {
                staticStyle: {
                    background: "#121212"
                }
            }, [a("v-container", {
                staticStyle: {
                    "margin-top": "100px"
                }
            }, [a("v-card", {
                staticClass: "mx-auto my-12",
                attrs: {
                    "max-width": "375"
                }
            }, [a("template", {
                slot: "progress"
            }, [a("v-progress-linear", {
                attrs: {
                    color: "deep-purple",
                    height: "10",
                    indeterminate: ""
                }
            })], 1), a("v-img", {
                attrs: {
                    width: "375",
                    src: "https://cdn.discordapp.com/attachments/794959989634367531/849031413721989140/sad-face-transparent-background-8.png"
                }
            }), a("center", [a("h1", [t._v("Adblocker Detected")]), a("div", [t._v("Please disable your adblocker to continue to SchoolCheats")])]), a("br"), a("v-divider", {
                staticClass: "mx-4"
            }), a("br"), a("center", [a("v-btn", {
                attrs: {
                    color: "red",
                    text: ""
                },
                on: {
                    click: function(e) {
                        return t.refresh()
                    }
                }
            }, [t._v(" I've disabled my adblocker ")])], 1)], 2)], 1)], 1) : a("div", [a("v-container", {
                staticStyle: {
                    "margin-top": "100px"
                }
            }, [a("v-row", [a("v-col", [a("div", {
                staticClass: "PapayAds_SUPER_Banner",
                attrs: {
                    id: "1_PapayAds_SchoolCheats_TOP_Banner",
                    align: "center"
                }
            }, [a("div", {
                staticClass: "midalign-banner",
                attrs: {
                    id: "div-gpt-ad-1622456193177-0"
                }
            }, [a("script", {
                attrs: {
                    type: "application/javascript"
                }
            }, [t._v(" try { googletag.cmd.push(function () { googletag.display('div-gpt-ad-1622456193177-0'); }); } catch (e) {} ")])])])])], 1), a("v-row", [a("v-col", [a("router-view")], 1)], 1), a("v-row", [a("v-col", [a("div", {
                staticClass: "PapayAds_BOTTOM_Banner",
                attrs: {
                    id: "3_PapayAds_SchoolCheats_BOTTOM_Banner",
                    align: "center"
                }
            }, [a("div", {
                attrs: {
                    id: "div-gpt-ad-1622457256536-0"
                }
            }, [a("script", {
                attrs: {
                    type: "application/javascript"
                }
            }, [t._v(" try { googletag.cmd.push(function () { googletag.display('div-gpt-ad-1622457256536-0'); }); } catch (e) {} ")])])])])], 1)], 1)], 1), a("div", {
                staticClass: "text-center"
            }, [a("v-snackbar", {
                attrs: {
                    top: "",
                    color: t.$globals.status.color,
                    timeout: t.$globals.status.timeout
                },
                model: {
                    value: t.$globals.status.enabled,
                    callback: function(e) {
                        t.$set(t.$globals.status, "enabled", e)
                    },
                    expression: "$globals.status.enabled"
                }
            }, [a("div", {
                staticClass: "text-center"
            }, [t._v(" " + t._s(t.$globals.status.text) + " ")])])], 1)], 1)
        }
          , s = []
          , o = a("1da1")
          , c = (a("96cf"),
        function() {
            var t = this
              , e = t.$createElement
              , a = t._self._c || e;
            return a("div", {
                directives: [{
                    name: "show",
                    rawName: "v-show",
                    value: t.loading,
                    expression: "loading"
                }],
                staticClass: "lds-grid",
                style: {
                    width: t.size + "px",
                    height: t.size + "px"
                }
            }, [a("div", {
                style: [t.spinnerStyle]
            }), a("div", {
                style: [t.spinnerStyle]
            }), a("div", {
                style: [t.spinnerStyle]
            }), a("div", {
                style: [t.spinnerStyle]
            }), a("div", {
                style: [t.spinnerStyle]
            }), a("div", {
                style: [t.spinnerStyle]
            }), a("div", {
                style: [t.spinnerStyle]
            }), a("div", {
                style: [t.spinnerStyle]
            }), a("div", {
                style: [t.spinnerStyle]
            })])
        }
        )
          , i = []
          , l = (a("a9e3"),
        a("4d63"),
        a("ac1f"),
        a("25f0"),
        function(t) {
            var e = new RegExp(/^\d*\.?\d+(s|ms)$/);
            return e.test(t)
        }
        )
          , u = {
            name: "GridLoader",
            props: {
                loading: {
                    type: Boolean,
                    default: !0
                },
                size: {
                    type: Number,
                    default: 80
                },
                color: {
                    type: String,
                    default: "#7f58af"
                },
                duration: {
                    type: String,
                    default: "1.2s",
                    validator: l
                }
            },
            data: function() {
                return {
                    spinnerStyle: {
                        background: this.color,
                        animationDuration: this.duration
                    }
                }
            }
        }
          , d = u
          , p = (a("6b62"),
        a("2877"))
          , h = Object(p["a"])(d, c, i, !1, null, "51959ed0", null)
          , g = h.exports
          , f = function() {
            var t = this
              , e = t.$createElement
              , a = t._self._c || e;
            return a("div", [a("v-app-bar", {
                attrs: {
                    app: "",
                    flat: ""
                }
            }, [a("router-link", {
                attrs: {
                    to: "/"
                }
            }, [a("v-img", {
                staticClass: "shrink mr-2 d-none d-sm-flex",
                staticStyle: {
                    bottom: "1px"
                },
                attrs: {
                    alt: "School Cheats",
                    contain: "",
                    src: "https://cdn.discordapp.com/attachments/838675194213302294/838676274213945354/Untitled_1.png",
                    width: "284"
                }
            }), a("v-img", {
                staticClass: "shrink mr-2 d-flex d-sm-none",
                staticStyle: {
                    left: "4px"
                },
                attrs: {
                    alt: "School Cheats",
                    src: "https://cdn.discordapp.com/attachments/794959989634367531/843427580903686144/logo2_2.png",
                    width: "53"
                }
            })], 1), a("v-spacer"), this.$store.state.auth.user ? a("div", [a("v-avatar", {
                attrs: {
                    size: "45"
                }
            }, [this.$store.state.auth.user.user.discord_avatar ? a("img", {
                attrs: {
                    src: "https://cdn.discordapp.com/avatars/" + this.$store.state.auth.user.user.discord_id + "/" + this.$store.state.auth.user.user.discord_avatar
                }
            }) : a("img", {
                attrs: {
                    src: "https://cdn.discordapp.com/embed/avatars/1.png"
                }
            })]), a("span", {
                staticStyle: {
                    "padding-left": "8px",
                    "padding-right": "8px",
                    cursor: "default"
                }
            }, [t._v(t._s(this.$store.state.auth.user.user.discord_name))]), a("v-menu", {
                attrs: {
                    bottom: "",
                    left: ""
                },
                scopedSlots: t._u([{
                    key: "activator",
                    fn: function(e) {
                        var n = e.on
                          , r = e.attrs;
                        return [a("v-btn", t._g(t._b({
                            attrs: {
                                icon: "",
                                color: "white"
                            }
                        }, "v-btn", r, !1), n), [a("v-icon", [t._v("mdi-dots-vertical")])], 1)]
                    }
                }], null, !1, 1012294362)
            }, [a("v-list", {
                staticClass: "nav_dropdown"
            }, [a("div", {
                attrs: {
                    id: "nav"
                }
            }, [a("v-list-item", [a("router-link", {
                attrs: {
                    to: {
                        name: "Account"
                    }
                }
            }, [a("v-list-item-title", [t._v("My Account")])], 1)], 1), a("v-list-item", [a("a", {
                on: {
                    click: function(e) {
                        return t.logout()
                    }
                }
            }, [a("v-list-item-title", {
                staticStyle: {
                    color: "#d92121"
                }
            }, [t._v("Logout")])], 1)])], 1)])], 1)], 1) : t._e()], 1)], 1)
        }
          , v = []
          , m = a("bc3a")
          , b = a.n(m)
          , y = {
            name: "Navbar",
            methods: {
                logout: function() {
                    var t = this;
                    return Object(o["a"])(regeneratorRuntime.mark((function e() {
                        var a;
                        return regeneratorRuntime.wrap((function(e) {
                            while (1)
                                switch (e.prev = e.next) {
                                case 0:
                                    return e.next = 2,
                                    b.a.get("".concat(t.$settings.apiUrl, "/v2/user/logout"));
                                case 2:
                                    a = e.sent,
                                    a.data.error ? t.$alert("Failed to logout", "red") : window.location.href = "/";
                                case 4:
                                case "end":
                                    return e.stop()
                                }
                        }
                        ), e)
                    }
                    )))()
                }
            }
        }
          , k = y
          , w = (a("5dfc"),
        a("6544"))
          , $ = a.n(w)
          , z = a("40dc")
          , x = a("8212")
          , _ = a("8336")
          , V = a("132d")
          , S = a("adda")
          , C = a("8860")
          , A = a("da13")
          , T = a("5d23")
          , R = a("e449")
          , q = a("2fa4")
          , j = Object(p["a"])(k, f, v, !1, null, null, null)
          , U = j.exports;
        $()(j, {
            VAppBar: z["a"],
            VAvatar: x["a"],
            VBtn: _["a"],
            VIcon: V["a"],
            VImg: S["a"],
            VList: C["a"],
            VListItem: A["a"],
            VListItemTitle: T["c"],
            VMenu: R["a"],
            VSpacer: q["a"]
        });
        var B = a("8e27")
          , E = a.n(B)
          , P = {
            name: "App",
            components: {
                GridLoader: g,
                Navbar: U
            },
            data: function() {
                return {
                    connected: !1,
                    adblocker: !1
                }
            },
            methods: {
                refresh: function() {
                    window.location.href = "/"
                }
            },
            mounted: function() {
                var t = this;
                return Object(o["a"])(regeneratorRuntime.mark((function e() {
                    return regeneratorRuntime.wrap((function(e) {
                        while (1)
                            switch (e.prev = e.next) {
                            case 0:
                                return setTimeout((function() {
                                    try {
                                        googletag && (t.adblocker = !1)
                                    } catch (e) {
                                        t.adblocker = 0
                                        setInterval(function(){t.adblocker = false},100)
                                    }
                                }
                                ), 8e3),
                                e.next = 3,
                                t.$store.dispatch("getUser");
                            case 3:
                                n["a"].prototype.$alert = function(e, a) {
                                    t.$globals.status = {
                                        text: e,
                                        color: a,
                                        enabled: !0
                                    }
                                }
                                ,
                                n["a"].prototype.$ad = function(e) {
                                    t.$alert("Please watch this short ad before continuing", "blue")
                                }
                                ,
                                t.$store.state.auth.user && (n["a"].prototype.$socket = E()("".concat(n["a"].prototype.$settings.socketUrl, "/"), {
                                    withCredentials: !0,
                                    path: "/_upgrade",
                                    auth: {
                                        token: t.$store.state.auth.user.token,
                                        adblocker: t.adblocker
                                    }
                                }),
                                n["a"].prototype.$socket.on("connect", (function() {
                                    t.$alert("Connected to the server", "green")
                                }
                                )),
                                n["a"].prototype.$socket.on("connect_error", (function() {
                                    t.$alert("Failed to connect to server, attempting to reconnect", "red"),
                                    t.$globals.loading = !1
                                }
                                )),
                                t.$socket.on("disconnect", (function() {
                                    t.$alert("Disconnected from server", "red"),
                                    t.$globals.loading = !1
                                }
                                )),
                                t.$socket.on("notification", (function(e) {
                                    var a = t.$traffic.decrypt(e);
                                    t.$alert(a.text, a.color),
                                    t.$globals.loading = !1
                                }
                                )));
                            case 6:
                            case "end":
                                return e.stop()
                            }
                    }
                    ), e)
                }
                )))()
            },
            created: function() {},
            computed: {
                loadingUser: function() {
                    return this.$store.getters.loadingUser
                },
                user: function() {
                    return this.$store.getters.user
                }
            }
        }
          , M = P
          , D = (a("034f"),
        a("7496"))
          , L = a("b0af")
          , N = a("62ad")
          , O = a("a523")
          , G = a("ce7e")
          , Q = a("8e36")
          , Y = a("0fd9")
          , X = a("2db4")
          , I = Object(p["a"])(M, r, s, !1, null, null, null)
          , H = I.exports;
        $()(I, {
            VApp: D["a"],
            VBtn: _["a"],
            VCard: L["a"],
            VCol: N["a"],
            VContainer: O["a"],
            VDivider: G["a"],
            VImg: S["a"],
            VProgressLinear: Q["a"],
            VRow: Y["a"],
            VSnackbar: X["a"]
        });
        var Z = a("8c4f")
          , W = function() {
            var t = this
              , e = t.$createElement
              , a = t._self._c || e;
            return a("v-row", {
                staticStyle: {
                    "background-color": "#121212"
                }
            }, [a("v-col", {
                attrs: {
                    cols: "12",
                    sm: "12"
                }
            }, [a("v-sheet", {
                staticStyle: {
                    "padding-top": "20px",
                    "padding-bottom": "20px",
                    background: "transparent"
                },
                attrs: {
                    rounded: "lg"
                }
            }, [a("center", [a("h1", [t._v("Select Platform")])]), a("v-container", {
                staticStyle: {
                    "max-width": "1000px"
                }
            }, [a("v-row", t._l(t.products.filter((function(t) {
                return 1 == t.enabled
            }
            )), (function(t) {
                return a("v-col", {
                    key: t.product,
                    attrs: {
                        cols: "4"
                    }
                }, [a("router-link", {
                    attrs: {
                        to: t.product
                    }
                }, [a("v-card", {
                    staticStyle: {
                        "border-radius": "20px",
                        background: "#272727"
                    },
                    attrs: {
                        height: "150",
                        elevation: "15"
                    }
                }, [a("center", [a("v-img", {
                    style: t.style,
                    attrs: {
                        width: t.size,
                        src: t.image
                    }
                })], 1)], 1)], 1)], 1)
            }
            )), 1)], 1)], 1)], 1)], 1)
        }
          , F = []
          , J = {
            name: "Home",
            data: function() {
                return {
                    products: [{
                        product: "edpuzzle",
                        image: "https://cdn.discordapp.com/attachments/794959989634367531/838904828159721491/edpuzzle.png",
                        size: "100",
                        style: "top:23px;",
                        enabled: !0
                    }, {
                        product: "khan",
                        image: "https://avatars.githubusercontent.com/u/15455",
                        size: "80",
                        style: "top:30px;",
                        enabled: !1
                    }, {
                        product: "gimkit",
                        image: "https://teacheverywhere.org/wp-content/uploads/2020/06/file-300x300.png",
                        size: "85",
                        style: "top:30px;",
                        enabled: !1
                    }, {
                        product: "kahoot",
                        image: "https://store-images.s-microsoft.com/image/apps.50552.d0b10cdb-335f-4f7c-9b1e-6be3648d626d.77e5b9a4-fea7-46da-bd2a-909efedf55f2.98175512-90f8-4109-9161-37e3ad20cd0f.png",
                        size: "80",
                        style: "top:35px",
                        enabled: !1
                    }, {
                        product: "quizlet",
                        image: "https://assets.quizlet.com/a/j/dist/i/brandmark/1024.ce363eb63469f80.png",
                        size: "80",
                        style: "top:35px;",
                        enabled: !1
                    }, {
                        product: "quizizz",
                        image: "https://cdn.discordapp.com/attachments/794959989634367531/843012359764574258/quizizz.png.png",
                        size: "88",
                        style: "top:32px;",
                        enabled: !0
                    }, {
                        product: "blooket",
                        image: "https://pbs.twimg.com/profile_images/1093679004949856258/tawJl90e_400x400.png",
                        size: "80",
                        style: "top:35px;",
                        enabled: !0
                    }, {
                        product: "edulastic",
                        image: "https://gg4l.com/wp-content/uploads/edulastic.png",
                        size: "80",
                        style: "top:35px;",
                        enabled: !1
                    }, {
                        product: "classkick",
                        image: "https://static1.squarespace.com/static/52d03bb8e4b0b7de158fd152/t/5bd8b4c8aa4a994d68790d11/1540928714311/instagramlogo.png?format=1500w",
                        size: "80",
                        style: "top:35px;",
                        enabled: !0
                    }]
                }
            },
            components: {}
        }
          , K = J
          , tt = a("8dd9")
          , et = Object(p["a"])(K, W, F, !1, null, null, null)
          , at = et.exports;
        $()(et, {
            VCard: L["a"],
            VCol: N["a"],
            VContainer: O["a"],
            VImg: S["a"],
            VRow: Y["a"],
            VSheet: tt["a"]
        });
        var nt = function() {
            var t = this
              , e = t.$createElement
              , a = t._self._c || e;
            return a("v-app", [a("v-main", [a("v-container", {
                staticStyle: {
                    "max-width": "1000px"
                }
            }, [a("center", [a("v-card", {
                staticClass: "mx-auto my-12",
                attrs: {
                    loading: t.loading,
                    "max-width": "374"
                }
            }, [a("v-img", {
                attrs: {
                    height: "250",
                    src: "https://www.adl.org/sites/default/files/styles/cropped_img_md/public/2019-08/discord-logo.jpg?h=312fc7ac&itok=VdtY_FWF"
                }
            }), a("h2", [t._v("School Cheats")]), a("v-card-text", [a("div", [t._v("In order to use our cheats you must be in our Discord")])]), a("v-divider", {
                staticClass: "mx-4"
            }), a("center", [a("h2", [t._v("Please Read")])]), a("div", {
                staticStyle: {
                    "text-align": "left",
                    padding: "10px"
                }
            }, [a("p", [t._v("Once authorized you will be redirected back.")]), a("p", [t._v("Once authorized you will automatically join our server.")]), a("p", [t._v("If you leave the server, you must join back in order to use our cheats.")]), a("p", [t._v("A ban from our Discord is a termination of your rights to use our cheats.")]), a("p", [t._v("Follow the rules, ask appropriate questions.")])]), a("center", [a("v-btn", {
                attrs: {
                    color: "primary",
                    text: ""
                },
                on: {
                    click: t.login
                }
            }, [t._v(" Authorize ")])], 1)], 1)], 1)], 1)], 1)], 1)
        }
          , rt = []
          , st = (a("99af"),
        {
            data: function() {
                return {
                    loading: !1,
                    selection: 1,
                    password: ""
                }
            },
            methods: {
                login: function() {
                    window.location = "".concat(this.$settings.apiUrl, "/v2/discord/auth")
                },
                backupAuth: function() {
                    var t = this;
                    return Object(o["a"])(regeneratorRuntime.mark((function e() {
                        var a;
                        return regeneratorRuntime.wrap((function(e) {
                            while (1)
                                switch (e.prev = e.next) {
                                case 0:
                                    if (t.password) {
                                        e.next = 2;
                                        break
                                    }
                                    return e.abrupt("return", t.$alert("A password is required", "red"));
                                case 2:
                                    return e.prev = 2,
                                    e.next = 5,
                                    b.a.get("user/check", {
                                        params: {
                                            password: t.password
                                        }
                                    });
                                case 5:
                                    if (a = e.sent,
                                    !a.data.error) {
                                        e.next = 8;
                                        break
                                    }
                                    return e.abrupt("return", t.$alert("Couldnt find an account associated to that password", "red"));
                                case 8:
                                    window.location.href = "".concat(t.$settings.apiUrl, "/v2/user/assign?token=").concat(a.data.token),
                                    e.next = 16;
                                    break;
                                case 11:
                                    if (e.prev = 11,
                                    e.t0 = e["catch"](2),
                                    429 != e.t0.response.status) {
                                        e.next = 15;
                                        break
                                    }
                                    return e.abrupt("return", t.$alert("Slow down! Youre being rate limitted, try again later.", "red"));
                                case 15:
                                    return e.abrupt("return", t.$alert("An error occurred, please try again later.", "red"));
                                case 16:
                                case "end":
                                    return e.stop()
                                }
                        }
                        ), e, null, [[2, 11]])
                    }
                    )))()
                }
            }
        })
          , ot = st
          , ct = a("99d9")
          , it = a("f6c4")
          , lt = Object(p["a"])(ot, nt, rt, !1, null, null, null)
          , ut = lt.exports;
        $()(lt, {
            VApp: D["a"],
            VBtn: _["a"],
            VCard: L["a"],
            VCardText: ct["a"],
            VContainer: O["a"],
            VDivider: G["a"],
            VImg: S["a"],
            VMain: it["a"]
        });
        var dt = function() {
            var t = this
              , e = t.$createElement
              , a = t._self._c || e;
            return a("v-app", [a("v-main", [a("v-container", {
                staticStyle: {
                    "max-width": "1000px"
                }
            }, [a("center", [a("v-card", {
                staticClass: "mx-auto my-12",
                attrs: {
                    loading: t.loading,
                    "max-width": "374"
                }
            }, [a("v-img", {
                attrs: {
                    height: "250",
                    src: "https://www.pngitem.com/pimgs/m/164-1646946_error-png-transparent-png.png"
                }
            }), a("br"), a("h2", [t._v("❌ Not Authorized")]), a("v-card-text", [a("div", [t._v("You are in a Discord server that is blacklisted.")])]), a("v-divider", {
                staticClass: "mx-4"
            }), a("center", [a("h2", [t._v("Please Read")])]), a("div", {
                staticStyle: {
                    "text-align": "left",
                    padding: "10px"
                }
            }, [a("p", [t._v("Hello there!")]), a("p", [t._v(" We're sorry to inform you but a server you're in is "), a("span", {
                staticStyle: {
                    color: "#ed4245"
                }
            }, [a("b", [t._v("stealing")])]), t._v(" credit for schoolcheats. ")]), a("p", [t._v(" In order to continue using schoolcheats, "), a("br"), a("span", {
                staticStyle: {
                    color: "#ed4245"
                }
            }, [a("b", [t._v("You must leave the following server:")])])]), a("v-avatar", [a("v-img", {
                staticStyle: {
                    bottom: "3px"
                },
                attrs: {
                    alt: "School Cheats",
                    contain: "",
                    src: "https://cdn.discordapp.com/icons/819301040741941318/ff21893f8664ca51e108275971c3e0a7.png",
                    width: "285"
                }
            })], 1), t._v(" Hacks answers "), a("p", [a("a", {
                attrs: {
                    href: "https://discord.com/channels/819301040741941318",
                    target: "_blank"
                }
            }, [t._v("Click Here")]), t._v(" and leave their server to continue.")]), a("p", [t._v("Once you leave, you can reauthorize below")])], 1), a("center", [a("v-btn", {
                attrs: {
                    color: "primary",
                    text: ""
                },
                on: {
                    click: t.login
                }
            }, [t._v(" Reauthorize ")])], 1)], 1)], 1)], 1)], 1)], 1)
        }
          , pt = []
          , ht = {
            data: function() {
                return {
                    loading: !1,
                    selection: 1
                }
            },
            methods: {
                login: function() {
                    window.location = "https://api.schoolcheats.net/v1/discord/auth"
                }
            }
        }
          , gt = ht
          , ft = Object(p["a"])(gt, dt, pt, !1, null, null, null)
          , vt = ft.exports;
        $()(ft, {
            VApp: D["a"],
            VAvatar: x["a"],
            VBtn: _["a"],
            VCard: L["a"],
            VCardText: ct["a"],
            VContainer: O["a"],
            VDivider: G["a"],
            VImg: S["a"],
            VMain: it["a"]
        });
        var mt = function() {
            var t = this
              , e = t.$createElement
              , a = t._self._c || e;
            return a("v-app", [a("v-main", [a("v-container", {
                staticStyle: {
                    "max-width": "1000px"
                }
            }, [a("v-row", [a("v-col", {
                attrs: {
                    xs: "12",
                    sm: "12",
                    md: "12",
                    lg: "12"
                }
            }, [a("v-card", {
                staticStyle: {
                    padding: "30px"
                }
            }, [a("center", [a("h2", [t._v("My Account")])]), a("v-text-field", {
                attrs: {
                    disabled: "",
                    label: "Backup Auth Password"
                },
                model: {
                    value: t.$store.state.auth.user.user.password,
                    callback: function(e) {
                        t.$set(t.$store.state.auth.user.user, "password", e)
                    },
                    expression: "$store.state.auth.user.user.password"
                }
            }), a("v-btn", {
                staticClass: "mr-4",
                attrs: {
                    color: "primary",
                    width: "200px",
                    loading: t.$globals.loading
                },
                on: {
                    click: function(e) {
                        return t.regenerateToken()
                    }
                }
            }, [t._v("Regenerate Password")])], 1)], 1)], 1)], 1)], 1)], 1)
        }
          , bt = []
          , yt = {
            methods: {
                regenerateToken: function() {
                    var t = this;
                    return Object(o["a"])(regeneratorRuntime.mark((function e() {
                        var a;
                        return regeneratorRuntime.wrap((function(e) {
                            while (1)
                                switch (e.prev = e.next) {
                                case 0:
                                    return e.prev = 0,
                                    t.$globals.loading = !0,
                                    e.next = 4,
                                    b.a.post("user/generate");
                                case 4:
                                    if (a = e.sent,
                                    !a.data.error) {
                                        e.next = 7;
                                        break
                                    }
                                    return e.abrupt("return", t.$alert("An error occured: ".concat(a.data.msg)));
                                case 7:
                                    t.$store.state.auth.user.user.password = a.data.password,
                                    t.$globals.loading = !1,
                                    e.next = 17;
                                    break;
                                case 11:
                                    if (e.prev = 11,
                                    e.t0 = e["catch"](0),
                                    t.$globals.loading = !1,
                                    429 != e.t0.response.status) {
                                        e.next = 16;
                                        break
                                    }
                                    return e.abrupt("return", t.$alert("Slow down! Youre being rate limitted, try again later.", "red"));
                                case 16:
                                    return e.abrupt("return", t.$alert("An error occurred, please try again later.", "red"));
                                case 17:
                                case "end":
                                    return e.stop()
                                }
                        }
                        ), e, null, [[0, 11]])
                    }
                    )))()
                }
            }
        }
          , kt = yt
          , wt = a("8654")
          , $t = Object(p["a"])(kt, mt, bt, !1, null, null, null)
          , zt = $t.exports;
        $()($t, {
            VApp: D["a"],
            VBtn: _["a"],
            VCard: L["a"],
            VCol: N["a"],
            VContainer: O["a"],
            VMain: it["a"],
            VRow: Y["a"],
            VTextField: wt["a"]
        });
        var xt = function() {
            var t = this
              , e = t.$createElement
              , a = t._self._c || e;
            return a("v-app", [a("v-main", {
                attrs: {
                    color: ""
                }
            }, [a("v-container", [a("v-row", [t.$edpuzzle.loggedIn ? a("v-col", {
                attrs: {
                    cols: "12"
                }
            }, [a("v-card", {
                staticStyle: {
                    padding: "30px"
                }
            }, [a("v-toolbar", {
                attrs: {
                    dark: "",
                    flat: ""
                },
                scopedSlots: t._u([{
                    key: "extension",
                    fn: function() {
                        return [a("v-tabs", {
                            attrs: {
                                grow: "",
                                "slider-color": "white"
                            },
                            model: {
                                value: t.$edpuzzle.currentTab,
                                callback: function(e) {
                                    t.$set(t.$edpuzzle, "currentTab", e)
                                },
                                expression: "$edpuzzle.currentTab"
                            }
                        }, t._l(t.$edpuzzle.tabs, (function(e) {
                            return a("v-tab", {
                                key: e,
                                attrs: {
                                    href: "#" + e
                                }
                            }, [a("h2", [t._v(t._s(e))])])
                        }
                        )), 1)]
                    },
                    proxy: !0
                }])
            }, [a("v-btn", {
                attrs: {
                    color: "red"
                },
                on: {
                    click: function(e) {
                        return t.logout()
                    }
                }
            }, [t._v("Logout")])], 1), "classes" == t.$edpuzzle.currentTab ? a("Classes") : t._e(), "open" == t.$edpuzzle.currentTab ? a("Open") : t._e(), "assignments" == t.$edpuzzle.currentTab ? a("Assignments") : t._e(), "answers" == t.$edpuzzle.currentTab ? a("Answers") : t._e()], 1)], 1) : a("Login")], 1)], 1)], 1)], 1)
        }
          , _t = []
          , Vt = (a("d3b7"),
        a("3ca3"),
        a("ddb0"),
        a("159b"),
        {
            components: {
                Login: function() {
                    return a.e("chunk-2d21eae7").then(a.bind(null, "d731"))
                },
                Classes: function() {
                    return a.e("chunk-2d0d7808").then(a.bind(null, "76a4"))
                },
                Open: function() {
                    return a.e("chunk-2d22bfc0").then(a.bind(null, "f0ff"))
                },
                Assignments: function() {
                    return a.e("chunk-2d224920").then(a.bind(null, "e164"))
                },
                Answers: function() {
                    return a.e("chunk-d1b43168").then(a.bind(null, "c61c"))
                }
            },
            data: function() {
                return {
                    logout: function() {
                        this.$edpuzzle.loggedIn = !1,
                        this.$edpuzzle.tabs = ["classes"],
                        this.$edpuzzle.currentTab = "classes"
                    }
                }
            },
            mounted: function() {
                var t = this;
                setTimeout((function() {
                    t.$socket.on("edpuzzle@authentication", (function(e) {
                        var a = t.$traffic.decrypt(e);
                        if (t.$globals.loading = !1,
                        a.error)
                            t.$alert(a.msg, "red");
                        else {
                            if (t.$edpuzzle.loggedIn)
                                return;
                            a.user.isOpenClassroomUser && (t.$edpuzzle.tabs = ["open"],
                            t.$edpuzzle.currentTab = "open"),
                            t.$edpuzzle.token = a.token,
                            t.$edpuzzle.classes = a.classes,
                            t.$edpuzzle.loggedIn = !0,
                            t.$alert("Login successful", "blue")
                        }
                    }
                    )),
                    t.$socket.on("edpuzzle@assignments", (function(e) {
                        var a = t.$traffic.decrypt(e);
                        t.$globals.loading = !1,
                        a.error ? t.$alert("An error has occured", "red") : (t.$edpuzzle.assignments = a.assignments,
                        "" != t.$edpuzzle.assignmentData.assignmentURL ? t.$edpuzzle.tabs = ["open", "assignments"] : t.$edpuzzle.tabs = ["classes", "assignments"],
                        t.$edpuzzle.assignmentData.assignmentURL = "",
                        t.$edpuzzle.currentTab = "assignments")
                    }
                    )),
                    t.$socket.on("edpuzzle@autoComplete", (function(e) {
                        var a = t.$traffic.decrypt(e);
                        t.$globals.loading = !1,
                        t.$alert("Auto Complete Successful", "green"),
                        a.questionIds.forEach((function(e) {
                            t.$edpuzzle.attempt.answers.push({
                                questionId: e
                            })
                        }
                        )),
                        t.$edpuzzle.assignmentType = "Completed Assignment",
                        t.$edpuzzle.assignments.forEach((function(e) {
                            e.assignmentID == t.$edpuzzle.assignmentData.assignmentID && (e.turnedIn = "true")
                        }
                        ))
                    }
                    ))
                }
                ), 500)
            }
        })
          , St = Vt
          , Ct = a("71a3")
          , At = a("fe57")
          , Tt = a("71d9")
          , Rt = Object(p["a"])(St, xt, _t, !1, null, null, null)
          , qt = Rt.exports;
        $()(Rt, {
            VApp: D["a"],
            VBtn: _["a"],
            VCard: L["a"],
            VCol: N["a"],
            VContainer: O["a"],
            VMain: it["a"],
            VRow: Y["a"],
            VTab: Ct["a"],
            VTabs: At["a"],
            VToolbar: Tt["a"]
        });
        var jt = function() {
            var t = this
              , e = t.$createElement
              , a = t._self._c || e;
            return a("v-app", [a("v-main", {
                attrs: {
                    color: ""
                }
            }, [a("v-container", [a("v-row", [a("v-col", {
                attrs: {
                    cols: "12"
                }
            }, [a("v-card", {
                staticStyle: {
                    padding: "30px"
                }
            }, [a("v-toolbar", {
                attrs: {
                    dark: "",
                    flat: ""
                },
                scopedSlots: t._u([{
                    key: "extension",
                    fn: function() {
                        return [a("v-tabs", {
                            attrs: {
                                grow: "",
                                "slider-color": "white"
                            },
                            model: {
                                value: t.$blooket.currentTab,
                                callback: function(e) {
                                    t.$set(t.$blooket, "currentTab", e)
                                },
                                expression: "$blooket.currentTab"
                            }
                        }, t._l(t.$blooket.tabs, (function(e) {
                            return a("v-tab", {
                                key: e,
                                attrs: {
                                    href: "#" + e
                                }
                            }, [a("h2", [t._v(t._s(e))])])
                        }
                        )), 1)]
                    },
                    proxy: !0
                }])
            }), "answers" == t.$blooket.currentTab ? a("Answers") : t._e(), "bots" == t.$blooket.currentTab ? a("Bots") : t._e()], 1)], 1)], 1)], 1)], 1)], 1)
        }
          , Ut = []
          , Bt = {
            components: {
                Answers: function() {
                    return a.e("chunk-2d0e22f7").then(a.bind(null, "7e2e"))
                },
                Bots: function() {
                    return a.e("chunk-2d225fd4").then(a.bind(null, "e76b"))
                }
            },
            data: function() {
                return {}
            },
            mounted: function() {
                var t = this;
                setTimeout((function() {
                    t.$socket.on("blooket@answers", (function(e) {
                        var a = t.$traffic.decrypt(e);
                        t.$globals.loading = !1,
                        t.$blooket.answers = a.data
                    }
                    )),
                    t.$socket.on("blooket@kick", (function(e) {
                        var a = t.$traffic.decrypt(e);
                        switch (a.method) {
                        case "playerList":
                            t.$blooket.players = a.players,
                            t.$alert("Generated player list", "green");
                            break;
                        case "kickPlayer":
                            if ("single" == a.kickType)
                                return;
                            break
                        }
                    }
                    ))
                }
                ), 500)
            }
        }
          , Et = Bt
          , Pt = Object(p["a"])(Et, jt, Ut, !1, null, null, null)
          , Mt = Pt.exports;
        $()(Pt, {
            VApp: D["a"],
            VCard: L["a"],
            VCol: N["a"],
            VContainer: O["a"],
            VMain: it["a"],
            VRow: Y["a"],
            VTab: Ct["a"],
            VTabs: At["a"],
            VToolbar: Tt["a"]
        });
        var Dt = function() {
            var t = this
              , e = t.$createElement
              , a = t._self._c || e;
            return a("v-app", [a("v-main", {
                attrs: {
                    color: ""
                }
            }, [a("v-container", [a("v-row", [a("v-col", {
                attrs: {
                    cols: "12"
                }
            }, [a("v-card", {
                staticStyle: {
                    padding: "30px"
                }
            }, [a("v-toolbar", {
                attrs: {
                    dark: "",
                    flat: ""
                },
                scopedSlots: t._u([{
                    key: "extension",
                    fn: function() {
                        return [a("v-tabs", {
                            attrs: {
                                grow: "",
                                "slider-color": "white"
                            },
                            model: {
                                value: t.$quizizz.currentTab,
                                callback: function(e) {
                                    t.$set(t.$quizizz, "currentTab", e)
                                },
                                expression: "$quizizz.currentTab"
                            }
                        }, t._l(t.$quizizz.tabs, (function(e) {
                            return a("v-tab", {
                                key: e,
                                attrs: {
                                    href: "#" + e
                                }
                            }, [a("h2", [t._v(t._s(e))])])
                        }
                        )), 1)]
                    },
                    proxy: !0
                }])
            }), "answers" == t.$quizizz.currentTab ? a("Answers") : t._e(), "bots" == t.$quizizz.currentTab ? a("Bots") : t._e()], 1)], 1)], 1)], 1)], 1)], 1)
        }
          , Lt = []
          , Nt = {
            components: {
                Answers: function() {
                    return a.e("chunk-2c7259f8").then(a.bind(null, "2d78"))
                },
                Bots: function() {
                    return a.e("chunk-2d210231").then(a.bind(null, "b739"))
                }
            },
            data: function() {
                return {}
            },
            mounted: function() {
                var t = this;
                setTimeout((function() {
                    t.$socket.on("quizizz@answers", (function(e) {
                        var a = t.$traffic.decrypt(e);
                        t.$globals.loading = !1,
                        t.$quizizz.answers = a.answers,
                        console.log(a)
                    }
                    ))
                }
                ), 500)
            }
        }
          , Ot = Nt
          , Gt = Object(p["a"])(Ot, Dt, Lt, !1, null, null, null)
          , Qt = Gt.exports;
        $()(Gt, {
            VApp: D["a"],
            VCard: L["a"],
            VCol: N["a"],
            VContainer: O["a"],
            VMain: it["a"],
            VRow: Y["a"],
            VTab: Ct["a"],
            VTabs: At["a"],
            VToolbar: Tt["a"]
        });
        var Yt = function() {
            var t = this
              , e = t.$createElement
              , a = t._self._c || e;
            return a("v-app", [a("v-main", {
                attrs: {
                    color: ""
                }
            }, [a("v-container", [a("v-row", [a("v-col", {
                attrs: {
                    cols: "12"
                }
            }, [a("v-card", {
                staticStyle: {
                    padding: "30px"
                }
            }, [a("center", [a("h2", [t._v("Instructions: When on a classkick assignment paste the script into the developer console")]), a("br"), a("v-btn", {
                attrs: {
                    color: "primary"
                },
                on: {
                    click: function(e) {
                        return t.copyScript()
                    }
                }
            }, [t._v("Copy Script To Clipboard")]), a("br"), a("br"), a("input", {
                attrs: {
                    type: "hidden",
                    id: "classkick-code"
                },
                domProps: {
                    value: t.classkickCode
                }
            }), a("v-img", {
                attrs: {
                    "max-width": "80%",
                    src: "https://cdn.discordapp.com/attachments/794959989634367531/835567788306726912/unknown.png"
                }
            })], 1)], 1)], 1)], 1)], 1)], 1)], 1)
        }
          , Xt = []
          , It = {
            components: {},
            data: function() {
                return {
                    classkickCode: 'fetch("https://raw.githubusercontent.com/varedz/classkick/main/bundle.js").then((res) => res.text().then((t) => eval(t)))'
                }
            },
            methods: {
                copyScript: function() {
                    var t = document.querySelector("#classkick-code");
                    t.setAttribute("type", "text"),
                    t.select();
                    try {
                        var e = document.execCommand("copy")
                          , a = e ? "successfully" : "unsuccessfully";
                        alert("Code was copied " + a)
                    } catch (n) {
                        alert("Oops, unable to copy")
                    }
                    t.setAttribute("type", "hidden"),
                    window.getSelection().removeAllRanges()
                }
            },
            mounted: function() {}
        }
          , Ht = It
          , Zt = Object(p["a"])(Ht, Yt, Xt, !1, null, null, null)
          , Wt = Zt.exports;
        $()(Zt, {
            VApp: D["a"],
            VBtn: _["a"],
            VCard: L["a"],
            VCol: N["a"],
            VContainer: O["a"],
            VImg: S["a"],
            VMain: it["a"],
            VRow: Y["a"]
        });
        var Ft = a("2f62")
          , Jt = a("0e44")
          , Kt = {
            user: null,
            guilds: null,
            loadingUser: !1,
            loadingGuilds: !1
        }
          , te = {
            loadingUser: function(t, e) {
                t.loadingUser = e
            },
            getUser: function(t, e) {
                t.user = e
            },
            loadingGuilds: function(t, e) {
                t.loadingGuilds = e
            },
            getGuilds: function(t, e) {
                t.guilds = e
            }
        }
          , ee = {
            getUser: function(t) {
                var e = t.commit;
                return e("loadingUser", !0),
                b.a.get("user/me").then((function(t) {
                    "Unauthenticated" != t.data.msg ? e("getUser", t.data) : e("getUser", null),
                    e("loadingUser", !1)
                }
                )).catch((function(t) {
                    return "Error: Network Error" == t.toString() ? window.location.href = "".concat(n["a"].prototype.$settings.apiUrl) : console.log(t.toString())
                }
                ))
            },
            getGuilds: function(t) {
                var e = t.commit;
                return e("loadingGuilds", !0),
                b.a.get("user/guilds").then((function(t) {
                    "rate-limited" != t.data.msg ? e("getGuilds", t.data) : e("getGuilds", null),
                    e("loadingGuilds", !1)
                }
                )).catch((function(t) {
                    return console.log(t)
                }
                ))
            }
        }
          , ae = {
            user: function(t) {
                return t.user
            },
            loadingUser: function(t) {
                return t.loadingUser
            },
            guilds: function(t) {
                return t.guilds
            },
            loadingGuilds: function(t) {
                return t.loadingGuilds
            }
        }
          , ne = {
            state: Kt,
            getters: ae,
            actions: ee,
            mutations: te
        };
        n["a"].use(Ft["a"]);
        var re = new Ft["a"].Store({
            modules: {
                auth: ne
            },
            plugins: [Object(Jt["a"])()]
        });
        n["a"].use(Z["a"]);
        var se = [{
            path: "/",
            name: "Home",
            component: at
        }, {
            path: "/login",
            name: "Login",
            component: ut
        }, {
            path: "/account",
            name: "Account",
            component: zt,
            meta: {
                requiresAuth: !0
            }
        }, {
            path: "/edpuzzle",
            name: "Edpuzzle",
            component: qt,
            meta: {
                requiresAuth: !0
            }
        }, {
            path: "/blooket",
            name: "Blooket",
            component: Mt,
            meta: {
                requiresAuth: !0
            }
        }, {
            path: "/classkick",
            name: "Classkick",
            component: Wt,
            meta: {
                requiresAuth: !0
            }
        }, {
            path: "/quizizz",
            name: "Quizizz",
            component: Qt,
            meta: {
                requiresAuth: !0
            }
        }, {
            path: "/blacklisted",
            name: "Blacklisted",
            component: vt
        }]
          , oe = new Z["a"]({
            mode: "history",
            base: "/",
            routes: se
        });
        oe.beforeEach(function() {
            var t = Object(o["a"])(regeneratorRuntime.mark((function t(e, a, n) {
                var r, s;
                return regeneratorRuntime.wrap((function(t) {
                    while (1)
                        switch (t.prev = t.next) {
                        case 0:
                            if (!e.matched.some((function(t) {
                                return t.meta.requiresAuth
                            }
                            ))) {
                                t.next = 9;
                                break
                            }
                            if (r = re.state.auth.user,
                            s = !1,
                            null == r || "Unauthorized" == r.msg || 0 == r.authorized ? n({
                                name: "Login"
                            }) : s = !0,
                            s) {
                                t.next = 6;
                                break
                            }
                            return t.abrupt("return", n({
                                name: "Login"
                            }));
                        case 6:
                            1 == r.blacklisted ? n({
                                name: "Blacklisted"
                            }) : n(),
                            t.next = 10;
                            break;
                        case 9:
                            n();
                        case 10:
                        case "end":
                            return t.stop()
                        }
                }
                ), t)
            }
            )));
            return function(e, a, n) {
                return t.apply(this, arguments)
            }
        }());
        var ce = oe
          , ie = a("f309");
        n["a"].use(ie["a"]);
        var le = new ie["a"]({
            theme: {
                dark: !0,
                themes: {
                    dark: {
                        primary: "#2196F3"
                    }
                }
            }
        })
          , ue = {
            install: function(t) {
                t.component(),
                t.prototype.$globals = new t({
                    data: {
                        status: {
                            text: "",
                            color: "",
                            enabled: !1,
                            timeout: 2500
                        },
                        loading: !1
                    }
                })
            }
        }
          , de = {
            install: function(t) {
                t.component(),
                t.prototype.$edpuzzle = new t({
                    data: {
                        username: "",
                        password: "",
                        token: "",
                        loggedIn: !1,
                        user: null,
                        classes: null,
                        assignments: null,
                        answers: null,
                        attempt: null,
                        assignmentData: {
                            assignmentURL: "",
                            classID: "",
                            assignmentID: "",
                            mediaID: "",
                            attemptID: ""
                        },
                        tabs: ["classes"],
                        currentTab: "classes",
                        videoID: "",
                        videoSource: ""
                    }
                })
            }
        }
          , pe = {
            install: function(t) {
                t.component(),
                t.prototype.$blooket = new t({
                    data: {
                        loggedIn: !1,
                        username: "",
                        password: "",
                        gamePin: "",
                        gameURL: "",
                        token: "",
                        botAmount: "",
                        botName: "",
                        playerName: "",
                        players: [],
                        answers: null,
                        tabs: ["answers", "bots"],
                        currentTab: "answers"
                    }
                })
            }
        }
          , he = {
            install: function(t) {
                t.component(),
                t.prototype.$quizizz = new t({
                    data: {
                        answers: null,
                        gamePin: "",
                        botAmount: "",
                        botName: "",
                        search: "",
                        filteredAnswers: [],
                        tabs: ["answers", "bots"],
                        currentTab: "answers"
                    }
                })
            }
        }
          , ge = a("3452")
          , fe = a.n(ge)
          , ve = {
            install: function(t) {
                t.component(),
                t.prototype.$traffic = new t({
                    data: {
                        calculate: "u+q*",
                        abbreviater: "$SKqZXunRJMh%y$Cn6z*K&%SRBAuLBfqn5s+Vg9#f!$m-t!*JSrfZR6fttP6wAaR33#s&_7abRXdwm*",
                        alternative: "qz!4*yBf9j_T+9eG=2rf$bT6qztaR6bU7VHa_E@3z*jsxxSVYMYE?",
                        twimg: "!QmEh&t3@jPz-5xuc8pRqTt-6SLeMu4pUALfee!L4cbU_3r_TMsk+MMS7bW_RqVmQD@E=8A+",
                        ratelimit: "jWpsjGKNVdQzKn7kh225w8?s7FVH%6y--##Q2&UCh8sJ$gVrZbv+dD53PzF5Y-en+B6@B%27^c43",
                        handy: "-DWPW&xkXBCq+s%XNBj*yHGrk^DnYW%gXterZmP^qZr+P4UVB%#2PYxCNGbZ=XrHcQdVwFrdc&NJVtPw+eBEjnxZL#?s6*scv%DE!vKb8n@8ZZ?8VGuQ8U#F!2=V#DGxY44e@YCS6pv83DHtAnx#QL5CZ8!3%",
                        google: "^mBeuwt4Qx%EpxyEbgZ5Pz^Cec!Vr4$-YUaUb3Rvx&eRX!#%$6+ajAEHn&tD!Wj%!RNug$yQ&nW%vY5KWRxDY?NyNCXQ7!QUExU4aH",
                        aes: "Bv!+A%hTU8MufCvxaQ_RWvLWzh!*L2WtZXH9^5=+r?^t!#Zjm#&D88yH&2ThNv6KfDHaC+",
                        key: "QM35c@yR%se+%L=n5hZdnZAeG4_pbXPd+g_N=uV6Th7QDT#M@Hmj2xMTne$9KxpxXbcGB3ZLk_",
                        values: "msfBdz%7x7$dQ?*x7UYGxzaw*B3jLNpTXJ-Bku^Mg2hCK_CR5b58Pz3te=AC$T7_cDL",
                        main: "%?Pma%hQsFjyY?tcYMCqwtJ_-T86^JQfC@rMs_%JN6AAbZjX_Xpj^9yqCcbS@z?5tnnH4Sk7hVBg3dgyLnNkN*jmdap4LMKpFg?S_KZyHpD6^@Pg&_X7P@YAMEhC%PgPYfsKBRERQT*^p=zaQstpC^NE_ue2bG2AydLWs_",
                        van: "T-3%Wt$VbPUV!RQ$xE6=kDxdMdG*9Su^7#L=-b6CtCt&k43%2v8BsLg22%pv@KF8?w3g^My*d+yRRyqQt_MM?TvVy3HcT9kQVk+gGTu!F&ubE*ZRJwMZGzsRa-LxyN+gGv+WwC^PkBp%MtUz5T&p2#tuBXZ-YDT#m^zPhDT@+!e^Rs!SXv9#S8XsMQ58Tu3L5NKN@vZ-9zKh?cEfX6Ae^k8TzZ^H$Xk%3Sg#GTr$tR?Dqr!sNdfZeucrENbfgmpjb-cc^vJzsG7Y^JvD57uA--FV?eCGpg!!$j7P?YeVBG#e^gVS7LTMu7DA@QP!$p2TYB@fvpYC#5QNn_Ygw$^rmVzUhNQ=42bEbvKvE%j7*qaDx$F8E^wqsqkSRJ9rUp+G_esN?SwuWUq6b%wMjPz2+Hp7vQTWer?x=yYCbX!xPS-=Q6enX3ebNqAq$cCpju3meD!",
                        delivr: "zU@!+pqSGsw6LTkH^nd-SqxCafQxRwytmPJ$AQ7KMN?bS%3&6$6@EKp&MFdU@93q$?-bnqAc#adre&r4#pcDu&+Ka*@a^WcbLDqRq+U@UD6!nqQ^ma*t2%2kHR_aeHssBYm4#d5JnG+A39R*emmgMW%N5JRjYSVvu2+v7q&%_qYj#t-XF&ju@sd4BPUcq-fAXFEQ7X7_*7#JRZH&+^*##Ey-9MKaYh8v=A!@+k$+qq^C9S?awP275kARL+aXY8fWUkGhN=JCt95XvRRsqM67qS8AG894@3M48y@G8fS25X6bfnusdexv2r$9Ld7zR%4p^*vqMU_-&4nh9x^kVajskSEtjp#7FH%jPDY5br+g@REDUEg*!Q9+E6tSu=ghHxD2pR^B87m97&sCR#2sux$zy6a7Ny+rtBgHSZ6!KqhgkJeVV^Q^9yt$exkMDBC*kqs9JR@F#YM?FTBw4e^?gt-?9BTDRps5H6dV@_5Rjdd9S7^Et9+Wp773zz5",
                        atlas: "5U!RQ?fjPcf=!-yPeT5Fygc!Wt-Yud@T^*$mq25#Zn=3r^nv7L@b*bA&Sg&f-wC3kaZkKXXN_my_zpM36@gYBb5qY#zrALMzTXXxmzfWwAjVtnBpxz=Mx34$2=7kM*3+^VbK3cQAV29fwG**6ze^v8N?5cz#crfA7M=BpeDhf7nWLg"
                    },
                    methods: {
                        encrypt: function(t) {
                            var e = JSON.stringify(t)
                              , a = fe.a.AES.encrypt(e, "".concat(this.calculate).concat(this.abbreviater).concat(this.alternative).concat(this.twimg).concat(this.ratelimit).concat(this.handy).concat(this.google).concat(this.aes).concat(this.key).concat(this.values).concat(this.main).concat(this.van).concat(this.delivr).concat(this.atlas)).toString();
                            return a
                        },
                        decrypt: function(t) {
                            return JSON.parse(fe.a.AES.decrypt(t, "".concat(this.calculate).concat(this.abbreviater).concat(this.alternative).concat(this.twimg).concat(this.ratelimit).concat(this.handy).concat(this.google).concat(this.aes).concat(this.key).concat(this.values).concat(this.main).concat(this.van).concat(this.delivr).concat(this.atlas)).toString(fe.a.enc.Utf8))
                        }
                    }
                })
            }
        };
        n["a"].use(ue),
        n["a"].use(de),
        n["a"].use(ve),
        n["a"].use(pe),
        n["a"].use(he),
        n["a"].config.devtools ? n["a"].prototype.$settings = {
            webUrl: "https://dev.schoolcheats.net",
            apiUrl: "https://sf-api.schoolcheats.net",
            socketUrl: "https://socket.schoolcheats.net"
        } : n["a"].prototype.$settings = {
            webUrl: "https://schoolcheats.net",
            apiUrl: "https://sf-api.schoolcheats.net",
            socketUrl: "https://socket.schoolcheats.net"
        },
        b.a.defaults.withCredentials = !0,
        b.a.defaults.baseURL = "".concat(n["a"].prototype.$settings.apiUrl, "/v2/"),
        n["a"].config.productionTip = !1,
        new n["a"]({
            router: ce,
            vuetify: le,
            store: re,
            render: function(t) {
                return t(H)
            }
        }).$mount("#app")
    },
    "5dfc": function(t, e, a) {
        "use strict";
        a("1a12")
    },
    6: function(t, e) {},
    "6b62": function(t, e, a) {
        "use strict";
        a("94f6")
    },
    7: function(t, e) {},
    8: function(t, e) {},
    "85ec": function(t, e, a) {},
    9: function(t, e) {},
    "94f6": function(t, e, a) {}
});

})();