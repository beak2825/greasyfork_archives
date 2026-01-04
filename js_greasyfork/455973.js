// ==UserScript==
// @name           wormate.io zoom hack - zoom on mousewheel
// @version        0.0.1
// @namespace      example@dindog.com
// @include        https://wormate.io*
// @run-at         document-start
// @description zoom
// @downloadURL https://update.greasyfork.org/scripts/455973/wormateio%20zoom%20hack%20-%20zoom%20on%20mousewheel.user.js
// @updateURL https://update.greasyfork.org/scripts/455973/wormateio%20zoom%20hack%20-%20zoom%20on%20mousewheel.meta.js
// ==/UserScript==


window.addEventListener('beforescriptexecute', function(e) {

    ///for external script:
	src = e.target.src;
	if (src.search(/game\.js/) != -1) {
		e.preventDefault();
		e.stopPropagation();
		append(NewScript1);
    window.removeEventListener(e.type, arguments.callee, true);
	};

}, true);



////// append with new block function:
function append(s) {	 
      document.head.appendChild(document.createElement('script'))
             .innerHTML = s.toString().replace(/^function.*{|}$/g, '');
}

////////////////////////////////////////////////
function NewScript1(){
    /* insert new block here, like:  */
   
  
  
  
  
  
  
  
  
  
  
  "use strict";
var _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function(t) {
        return typeof t
    } : function(t) {
        return t && "function" == typeof Symbol && t.constructor === Symbol && t !== Symbol.prototype ? "symbol" : typeof t
    },
    GoogleAuth;
! function() {
    try {
        console.log(function(t, e) {
            for (var i = 0; i < e.length; i += 2) t = t.replaceAll(e[i], e[i + 1]);
            return t
        }("N-syo.632.oyhs`2./oSo+-2:dhydMdy/32/o+`3:o/62`/o+. .+osYYyso+-.osyQSs6662NyW.63 yW:`+QQ+ -Ms-.:ymmy3+Yo``+Y:6.Qs-+WWhYs:sHhyyHys/6662NoWs63 yW:+Ss:.-+Ss:`M-3.M` .YyySYys32`QSs.2``-Hh-32sH-66 `..3 `..`3N.Wh.63yW-Ss.3`Ss+`Mh/:+hmmo2/yy++yys//Y-3 oS/`Sso`3 ohy6oH.3..6 -Hh. -+Qs/ N /W+62`Wo:Ss32Sso.MMmd+.3syy` .-` :Y+3+Ss//Q+3 +H`32sHhsyHho6-Hh`:S+--+S+N2+W` `+y+2+W.:Ss.3.Ss+/M-:ymmh.2-Y.32+Ys2+Ss+o+/Q-3oH/32Hho-://:`6 Hh`So3`SsN3oHhs-sHhsoW/ `Sso:-:Q.hM-2ymmh. /Yo`3 sYy./Q`3+Sso2`W`3`Hh.66`Hh:So3-SoN3 +Why+yWh/3-oQSso-`Mm:2/Md+/Yy+3 oYy:Q/3 `Q. -W-3`WsYys/`+oo.:Hh//So//Ss-N32-sys:3:S+.6-/+++:-3oHo3 ohdh/`+So:3 .+S/`/oo:6.+s+` `+yyo`3 +yQYs: +oo..shy. -+oSo/. NN", ["W", "hhhh", "Q", "ssss", "M", "mmm", "Y", "yyy", "H", "hh", "S", "ss", "6", "      ", "3", "   ", "2", "  ", "N", "\n"]))
    } catch (t) {}
}(), window.addEventListener("load", function() {
    function isBrowserCompatible() {
        return function(t, e, i) {
            function o(t, e) {
                return (void 0 === t ? "undefined" : _typeof(t)) === e
            }

            function n() {
                return "function" != typeof e.createElement ? e.createElement(arguments[0]) : u ? e.createElementNS.call(e, "http://www.w3.org/2000/svg", arguments[0]) : e.createElement.apply(e, arguments)
            }
            var r = [],
                s = [],
                a = {
                    _version: "3.3.1",
                    _config: {
                        classPrefix: "",
                        enableClasses: !0,
                        enableJSClass: !0,
                        usePrefixes: !0
                    },
                    _q: [],
                    on: function(t, e) {
                        var i = this;
                        setTimeout(function() {
                            e(i[t])
                        }, 0)
                    },
                    addTest: function(t, e, i) {
                        s.push({
                            name: t,
                            fn: e,
                            options: i
                        })
                    },
                    addAsyncTest: function(t) {
                        s.push({
                            name: null,
                            fn: t
                        })
                    }
                },
                h = function() {};
            h.prototype = a, h = new h;
            var l = !1;
            try {
                l = "WebSocket" in t && 2 === t.WebSocket.CLOSING
            } catch (t) {}
            h.addTest("websockets", l);
            var p = e.documentElement,
                u = "svg" === p.nodeName.toLowerCase();
            h.addTest("canvas", function() {
                    var t = n("canvas");
                    return !(!t.getContext || !t.getContext("2d"))
                }), h.addTest("canvastext", function() {
                    return !1 !== h.canvas && "function" == typeof n("canvas").getContext("2d").fillText
                }),
                function() {
                    var t, e, i, n, a, l, p;
                    for (var u in s)
                        if (s.hasOwnProperty(u)) {
                            if (t = [], e = s[u], e.name && (t.push(e.name.toLowerCase()), e.options && e.options.aliases && e.options.aliases.length))
                                for (i = 0; i < e.options.aliases.length; i++) t.push(e.options.aliases[i].toLowerCase());
                            for (n = o(e.fn, "function") ? e.fn() : e.fn, a = 0; a < t.length; a++) l = t[a], p = l.split("."), 1 === p.length ? h[p[0]] = n : (!h[p[0]] || h[p[0]] instanceof Boolean || (h[p[0]] = new Boolean(h[p[0]])), h[p[0]][p[1]] = n), r.push((n ? "" : "no-") + p.join("-"))
                        }
                }(),
                function(t) {
                    var e = p.className,
                        i = h._config.classPrefix || "";
                    if (u && (e = e.baseVal), h._config.enableJSClass) {
                        var o = new RegExp("(^|\\s)" + i + "no-js(\\s|$)");
                        e = e.replace(o, "$1" + i + "js$2")
                    }
                    h._config.enableClasses && (e += " " + i + t.join(" " + i), u ? p.className.baseVal = e : p.className = e)
                }(r), delete a.addTest, delete a.addAsyncTest;
            for (var c = 0; c < h._q.length; c++) h._q[c]();
            t.Modernizr = h
        }(window, document), Modernizr.websockets && Modernizr.canvas && Modernizr.canvastext
    }
    if (document.getElementById("game-wrap").style.display = "block", !isBrowserCompatible()) return void(document.getElementById("error-view").style.display = "block");
    ! function() {
        function getApp() {
            return _anApp
        }

        function i18n(t) {
            return window.I18N_MESSAGES[t]
        }

        function i18nCustomBundle(t) {
            return t[LANG] ? t[LANG] : t.en ? t.en : t.x
        }

        function timeSecsToIntervalText(t) {
            var e = (Math.floor(t) % 60).toString(),
                i = (Math.floor(t / 60) % 60).toString(),
                o = (Math.floor(t / 3600) % 24).toString(),
                n = Math.floor(t / 86400).toString(),
                r = i18n("util.time.days"),
                s = i18n("util.time.hours"),
                a = i18n("util.time.min"),
                h = i18n("util.time.sec");
            return n > 0 ? n + " " + r + " " + o + " " + s + " " + i + " " + a + " " + e + " " + h : o > 0 ? o + " " + s + " " + i + " " + a + " " + e + " " + h : i > 0 ? i + " " + a + " " + e + " " + h : e + " " + h
        }

        function convertI18nStringToHTML(t) {
            return t.includes("href") ? t.replaceAll("href", 'target="_black" href') : t
        }

        function loadScript(t, e, i) {
            var o = document.createElement("script"),
                n = !0;
            e && (o.id = e), o.async = "async", o.type = "text/javascript", o.src = t, i && (o.onload = o.onreadystatechange = function() {
                n = !1;
                try {
                    i()
                } catch (t) {
                    console.log(t)
                }
                o.onload = o.onreadystatechange = null
            }), (document.head || document.getElementsByTagName("head")[0]).appendChild(o)
        }

        function extend(t, e) {
            var i = e;
            return i.prototype = Object.create(t.prototype), i.prototype.constructor = i, i.parent = t, i
        }

        function normDir(t) {
            return t %= _2PI, t < 0 ? t + _2PI : t
        }

        function minmax(t, e, i) {
            return clamp(i, t, e)
        }

        function clamp(t, e, i) {
            return t > i ? i : t < e ? e : Number.isFinite(t) ? t : .5 * (e + i)
        }

        function timeDeltaIncrement(t, e, i, o) {
            return e > t ? Math.min(e, t + i * o) : Math.max(e, t - i * o)
        }

        function linearApproach(t, e, i, o, n) {
            return e + (t - e) * Math.pow(1 - o, i / n)
        }

        function lerp(t, e, i) {
            return t * (1 - i) + e * i
        }

        function arraycopy(t, e, i, o) {
            var n = i,
                r = e,
                s = e + o;
            if (null == t) throw new TypeError("this is null or not defined");
            var a = t.length >>> 0,
                h = n >> 0,
                l = h < 0 ? Math.max( a + h, 0) : Math.min(h, a),
                p = r >> 0,
                u = p < 0 ? Math.max( a + p, 0) : Math.min(p, a),
                c = void 0 === s ? a : s >> 0,
                f = c < 0 ? Math.max( a + c, 0) : Math.min(c, a),
                d = Math.min(f - u, a - l),
                g = 1;
            for (u < l && l < u + d && (g = -1, u += d - 1, l += d - 1); d > 0;) u in t ? t[l] = t[u] : delete t[l], u += g, l += g, d--;
            return t
        }

        function init2DContext(t) {
            return t.getContext("2d")
        }

        function pixijs_removeFromParent(t) {
            null != t.parent && t.parent.removeChild(t)
        }

        function randomRange(t, e) {
            return t + (e - t) * Math.random()
        }

        function any(t) {
            return t[parseInt(Math.random() * t.length)]
        }

        function randStr() {
            return Math.random().toString(36).substring(2, 15)
        }

        function convertHSLtoRGB(t, e, i) {
            var o = (1 - Math.abs(2 * i - 1)) * e,
                n = o * (1 - Math.abs(t / 60 % 2 - 1)),
                r = i - o / 2;
            return 0 <= t && t < 60 ? [r + o, r + n, r + 0] : 60 <= t && t < 120 ? [r + n, r + o, r + 0] : 120 <= t && t < 180 ? [r + 0, r + o, r + n] : 180 <= t && t < 240 ? [r + 0, r + n, r + o] : 240 <= t && t < 300 ? [r + n, r + 0, r + o] : [r + o, r + 0, r + n]
        }

        function ADINPLAY_PREROLL_PLAYER() {
            function t() {
                $("#adbl-1").text(i18n("index.game.antiadblocker.msg1")), $("#adbl-2").text(i18n("index.game.antiadblocker.msg2")), $("#adbl-3").text(i18n("index.game.antiadblocker.msg3")), $("#adbl-4").text(i18n("index.game.antiadblocker.msg4").replace("{0}", 10)), $("#adbl-continue span").text(i18n("index.game.antiadblocker.continue")), $("#adbl-continue").hide(), $("#" + n).fadeIn(500);
                for (var t = 10, e = 0; e < 10; e++) setTimeout(function() {
                    if (t--, $("#adbl-4").text(i18n("index.game.antiadblocker.msg4").replace("{0}", t)), 0 === t) {
                        console.log("aipAABC");
                        try {
                            ga("send", "event", "antiadblocker", window.runtimeHash + "_complete")
                        } catch (t) {}
                        $("#adbl-continue").fadeIn(200)
                    }
                }, 1e3 * (e + 1))
            }
            var e = !1,
                i = function() {},
                o = {},
                n = "JDHnkHtYwyXyVgG9";
            return $("#adbl-continue").click(function() {
                $("#" + n).fadeOut(500), i(!1)
            }), o.a = function(t) {
                if (i = t, !e) try {
                    aiptag.cmd.player.push(function() {
                        aiptag.adplayer = new aipPlayer({
                            AD_WIDTH: 960,
                            AD_HEIGHT: 540,
                            AD_FULLSCREEN: !0,
                            AD_CENTERPLAYER: !1,
                            LOADING_TEXT: "loading advertisement",
                            PREROLL_ELEM: function() {
                                return document.getElementById("1eaom01c3pxu9wd3")
                            },
                            AIP_COMPLETE: function(t) {
                                console.log("aipC"), i(!0), $("#1eaom01c3pxu9wd3").hide(), $("#" + n).hide();
                                try {
                                    ga("send", "event", "preroll", window.runtimeHash + "_complete")
                                } catch (t) {}
                            },
                            AIP_REMOVE: function() {}
                        })
                    }), e = !0
                } catch (t) {}
            }, o.b = function() {
                if (void 0 !== aiptag.adplayer) {
                    console.log("aipS");
                    try {
                        ga("send", "event", "preroll", window.runtimeHash + "_request")
                    } catch (t) {}
                    $("#1eaom01c3pxu9wd3").show(), aiptag.cmd.player.push(function() {
                        aiptag.adplayer.startPreRoll()
                    })
                } else {
                    console.log("aipAABS");
                    try {
                        ga("send", "event", "antiadblocker", window.runtimeHash + "_start")
                    } catch (t) {}
                    t()
                }
            }, o
        }

        function ADINPLAY_BANNER(t, e) {
            var i = $("#" + t),
                o = e,
                n = {},
                r = !1;
            return n.a = function() {
                if (!r) {
                    i.empty(), i.append("<div id='" + o + "'></div>");
                    try {
                        try {
                            ga("send", "event", "banner", window.runtimeHash + "_display")
                        } catch (t) {}
                        aiptag.cmd.display.push(function() {
                            aipDisplayTag.display(o)
                        }), r = !0
                    } catch (t) {}
                }
            }, n.c = function() {
                try {
                    try {
                        ga("send", "event", "banner", window.runtimeHash + "_refresh")
                    } catch (t) {}
                    aiptag.cmd.display.push(function() {
                        aipDisplayTag.display(o)
                    })
                } catch (t) {}
            }, n
        }

        function Application() {
            function t(t) {
                var e = t + 37 * Math.floor(65535 * Math.random());
                setCookie(Cookies.d, e, 30)
            }

            function e() {
                return parseInt(getCookie(Cookies.d)) % 37
            }
            return function() {
                var i = e();
                console.log("init1 pSC: " + i), i >= 0 && i < env.e || (i = Math.max( 0, env.e - 2), console.log("init2 pSC: " + i));
                var o = {};
                _anApp = o, o.f = env, o.g = !1, o.i = Date.now(), o.j = 0, o.k = 0, o.l = null, o.m = LOCALE, o.n = LANG, o.o = null, o.p = null, o.q = null, o.r = null, o.s = null, o.t = null, o.u = null;
                try {
                    navigator && navigator.geolocation && navigator.geolocation.getCurrentPosition(function(t) {
                        if (void 0 !== t.coords) {
                            var e = t.coords;
                            void 0 !== e.latitude && void 0 !== e.longitude && (o.l = t)
                        }
                    }, function(t) {})
                } catch (t) {}
                return o.v = function() {
                    o.p = new AssetsJsonManager, o.q = new ResourceManager, o.r = new AudioManager, o.s = new ScenesManager, o.t = new PropertyManager, o.u = new UserManager, o.o = new Engine, o.o.z = new MessageProcessor(o.o), o.a()
                }, o.a = function() {
                    try {
                        ga("send", "event", "app", window.runtimeHash + "_init")
                    } catch (t) {}
                    o.o.A = function() {
                        o.o.B()
                    }, o.o.C = function() {
                        var t = o.s.F.D();
                        try {
                            ga("send", "event", "game", window.runtimeHash + "_start", t)
                        } catch (t) {}
                        o.r.G(AudioManager.AudioState.H), o.s.I(o.s.H.J())
                    }, o.o.B = function() {
                        try {
                            ga("send", "event", "game", window.runtimeHash + "_end")
                        } catch (t) {}
                        $("body").height() >= 430 && o.f.K.c(), o.p.L(),
                            function() {
                                var t = Math.floor(o.o.N.M),
                                    e = o.o.O;
                                o.u.P() ? o.u.Q(function() {
                                    o.R(t, e)
                                }) : o.R(t, e)
                            }()
                    }, o.o.S = function(t) {
                        t(o.s.H.T(), o.s.H.U())
                    }, o.u.V(function() {
                        if (o.p.W && (o.r.G(AudioManager.AudioState.F), o.s.I(o.s.F)), o.u.P()) try {
                            var t = o.u.X();
                            ga("set", "userId", t)
                        } catch (t) {}
                        o.Y() && o.u.P() && !o.u.Z() ? (o.$(!1, !1), o.s.aa._(new ConsentAcceptanceToasterViewController)) : o.ba(!0)
                    }), o.p.ca(function() {
                        o.r.G(AudioManager.AudioState.F), o.s.I(o.s.F)
                    }), o.q.a(function() {
                        o.o.a(), o.r.a(), o.s.a(), o.t.a(), o.p.a(), o.u.a(), o.Y() && !o.Z() ? o.s.aa._(new ConsentAcceptanceToasterViewController) : o.ba(!0)
                    })
                }, o.da = function(t) {
                    if (o.u.P()) {
                        var e = o.u.ea();
                        $.get(GATEWAY_HOST + "/pub/wuid/" + e + "/consent/change?value=" + encodeURI(t), function(t) {})
                    }
                }, o.fa = function(t) {
                    var e = o.u.ea(),
                        i = o.s.F.D(),
                        n = o.s.F.ga(),
                        r = o.t.ha(PropertyType.ia),
                        s = o.t.ha(PropertyType.ja),
                        a = o.t.ha(PropertyType.ka),
                        h = o.t.ha(PropertyType.la),
                        l = o.t.ha(PropertyType.ma),
                        p = 0;
                    if (null != o.l) {
                        var u = o.l.coords.latitude,
                            c = o.l.coords.longitude;
                        p = 1 | Math.max( 0, Math.min(32767, (u + 90) / 180 * 32768)) << 1 | Math.max( 0, Math.min(65535, (c + 180) / 360 * 65536)) << 16
                    }
                    var f = o;
                    $.get(GATEWAY_HOST + "/pub/wuid/" + e + "/start?gameMode=" + encodeURI(i) + "&gh=" + p + "&nickname=" + encodeURI(n) + "&skinId=" + encodeURI(r) + "&eyesId=" + encodeURI(s) + "&mouthId=" + encodeURI(a) + "&glassesId=" + encodeURI(h) + "&hatId=" + encodeURI(l), function(e) {
                        if (1200 === e.code) {
                            var i = e.server_url;
                            t(i)
                        } else if (1460 === e.code) {
                            f.s.I(f.s.na);
                            try {
                                ga("send", "event", "restricted", window.runtimeHash + "_tick")
                            } catch (t) {}
                        } else t(void 0)
                    })
                }, o.oa = function() {
                    i++, console.log("start pSC: " + i), !o.f.pa && i >= o.f.e ? (o.s.I(o.s.qa), o.r.G(AudioManager.AudioState.ra), o.f.sa.b()) : (t(i), o.ta())
                }, o.ta = function() {
                    if (o.o.ua()) {
                        o.s.I(o.s.va), o.r.G(AudioManager.AudioState.va);
                        var t = o.s.F.D();
                        setCookie(Cookies.wa, t, 30), console.log("save gm: " + t);
                        var e = o.s.ya.xa();
                        if (setCookie(Cookies.za, e, 30), console.log("save sPN: " + e), o.u.P()) o.fa(function(t) {
                            o.o.Aa(t, o.u.ea())
                        });
                        else {
                            var i = o.s.F.ga();
                            setCookie(Cookies.Ba, i, 30);
                            var n = o.t.ha(PropertyType.ia);
                            setCookie(Cookies.Ca, n, 30), o.fa(function(t) {
                                o.o.Da(t, i, n)
                            })
                        }
                    }
                }, o.R = function(t, e) {
                    var i = o.s.F.ga();
                    o.s.H.Ea(t, e, i), o.r.G(AudioManager.AudioState.Fa), o.s.I(o.s.H.Ga())
                }, o.Ha = function() {
                    if (!o.Ia()) return o.t.Ja();
                    var t = parseInt(getCookie(Cookies.Ca));
                    return null != t && o.t.Ka(t, PropertyType.ia) ? t : o.t.Ja()
                }, o.La = function(t) {
                    setCookie(Cookies.Ma, !!t, 1800)
                }, o.Ia = function() {
                    return "true" === getCookie(Cookies.Ma)
                }, o.ba = function(e) {
                    if (e != o.g) {
                        o.g = e;
                        var n = n || {};
                        n.consented = e, n.gdprConsent = e, o.f.Na.a(), o.f.K.a(), o.f.sa.a(function(e) {
                            e && t(i = 0), o.ta()
                        })
                    }
                }, o.$ = function(t, e) {
                    setCookie(Cookies.Oa, t ? "true" : "false"), e && o.da(t), o.ba(t)
                }, o.Z = function() {
                    switch (getCookie(Cookies.Oa)) {
                        case "true":
                            return !0;
                        default:
                            return !1
                    }
                }, o.Y = function() {
                    try {
                        return !!window.isIPInEEA || !(null == o.l || !EEAMap.Pa(o.l.coords.latitude, o.l.coords.longitude))
                    } catch (t) {
                        return !0
                    }
                }, o.Qa = function() {
                    o.j = Date.now(), o.k = o.j - o.i, o.o.Ra(o.j, o.k), o.s.Ra(o.j, o.k), o.i = o.j
                }, o.Sa = function() {
                    o.s.Sa()
                }, o
            }()
        }

        function Engine() {
            var t = {
                    Ta: 0,
                    Ua: 1,
                    Va: 2,
                    Wa: 3
                },
                e = {};
            return e.Xa = 30, e.Ya = new Float32Array(100), e.Za = 0, e.$a = 0, e._a = 0, e.ab = 0, e.bb = 0, e.cb = 0, e.db = t.Ta, e.eb = null, e.fb = 300, e.C = function() {}, e.B = function() {}, e.S = function() {}, e.A = function() {}, e.gb = new GameParams, e.z = null, e.N = null, e.hb = {}, e.ib = {}, e.jb = 12.5, e.kb = 40, e.lb = 1, e.mb = -1, e.nb = 1, e.ob = 1, e.pb = -1, e.qb = -1, e.rb = 1, e.sb = 1, e.tb = -1, e.O = 500, e.ub = 500, e.gb.vb = 500, e.N = new Worm(e.gb), e.a = function() {
                e.N.wb(getApp().s.H.xb), setInterval(function() {
                    e.S(function(t, i) {
                        e.yb(t, i)
                    })
                }, 100)
            }, e.zb = function(t, i, o, n) {
                e.mb = t, e.nb = i, e.ob = o, e.pb = n, e.Ab()
            }, e.Bb = function(t) {
                e.lb = t, e.Ab()
            }, e.Ab = function() {
                e.qb = e.mb - e.lb, e.rb = e.nb + e.lb, e.sb = e.ob - e.lb, e.tb = e.pb + e.lb
            }, e.Ra = function(i, o) {
                e._a += o, e.$a -= .2 * e.Za * o, e.z.Cb(), null == e.eb || e.db !== t.Va && e.db !== t.Wa || (e.Db(i, o), e.kb = 4 + e.jb * e.N.Eb);
                for (var n = 1e3 / Math.max( 1, o), r = 0, s = 0; s < e.Ya.length - 1; s++) r += e.Ya[s], e.Ya[s] = e.Ya[s + 1];
                e.Ya[e.Ya.length - 1] = n, e.Xa = (r + n) / e.Ya.length
            }, e.Fb = function(t, i) {
                return t > e.qb && t < e.rb && i > e.sb && i < e.tb
            }, e.Db = function(t, i) {
                var o = e._a + e.$a,
                    n = (o - e.ab) / (e.bb - e.ab);
                e.N.Gb(t, i), e.N.Hb(t, i, n, e.Fb);
                var r = 0;
                for (var s in e.ib) {
                    var a = e.ib[s];
                    a.Gb(t, i), a.Hb(t, i, n, e.Fb), a.Ib && a.Eb > r && (r = a.Eb), a.Jb || !(a.Kb < .005) && a.Ib || (a.Lb(), delete e.ib[a.Nb.Mb])
                }
                e.Bb(3 * r);
                for (var h in e.hb) {
                    var l = e.hb[h];
                    l.Gb(t, i), l.Hb(t, i, e.Fb), l.Ob && (l.Kb < .005 || !e.Fb(l.Pb, l.Qb)) && (l.Lb(), delete e.hb[l.Nb.Mb])
                }
            }, e.Rb = function(i, o) {
                e.db === t.Ua && (e.db = t.Va, e.C());
                var n = getApp().j;
                e.cb = i, 0 === i ? (e.ab = n - 95, e.bb = n, e._a = e.ab, e.$a = 0) : (e.ab = e.bb, e.bb = e.bb + o);
                var r = e._a + e.$a;
                e.Za = (r - e.ab) / (e.bb - e.ab)
            }, e.Sb = function() {
                if (e.db === t.Ua || e.db === t.Va) {
                    e.db = t.Wa;
                    var i = e.eb;
                    setTimeout(function() {
                        e.db === t.Wa && (e.db = t.Ta), null != i && i === e.eb && (e.eb.close(), e.eb = null)
                    }, 5e3), e.B()
                }
            }, e.ua = function() {
                return e.db !== t.Va && (e.db = t.Ua, e.z.Tb(), e.hb = {}, e.ib = {}, e.N.Ub(), null != e.eb && (e.eb.close(), e.eb = null), !0)
            }, e.Vb = function() {
                e.eb = null, e.z.Tb(), e.db !== t.Wa && e.A(), e.db = t.Ta
            }, e.Aa = function(t, i) {
                e.Wb(t, function() {
                    var t = Math.min(2048, i.length),
                        o = new ArrayBuffer(6 + 2 * t),
                        n = new DataView(o),
                        r = 0;
                    n.setInt8(r, 129), r += 1, n.setInt16(r, 2800), r += 2, n.setInt8(r, 1), r += 1, n.setInt16(r, t), r += 2;
                    for (var s = 0; s < t; s++) n.setInt16(r, i.charCodeAt(s)), r += 2;
                    e.Xb(o)
                })
            }, e.Da = function(t, i, o) {
                e.Wb(t, function() {
                    var t = Math.min(32, i.length),
                        n = new ArrayBuffer(7 + 2 * t),
                        r = new DataView(n),
                        s = 0;
                    r.setInt8(s, 129), s += 1, r.setInt16(s, 2800), s += 2, r.setInt8(s, 0), s += 1, r.setInt16(s, o), s += 2, r.setInt8(s, t), s++;
                    for (var a = 0; a < t; a++) r.setInt16(s, i.charCodeAt(a)), s += 2;
                    e.Xb(n)
                })
            }, e.Xb = function(t) {
                try {
                    null != e.eb && e.eb.readyState === WebSocket.OPEN && e.eb.send(t)
                } catch (t) {
                    console.log("Socket send error: " + t), e.Vb()
                }
            }, e.yb = function(t, i) {
                var o = i ? 128 : 0,
                    n = normDir(t) / _2PI * 128 & 127,
                    r = 255 & (o | n);
                if (e.fb !== r) {
                    var s = new ArrayBuffer(1);
                    new DataView(s).setInt8(0, r), e.Xb(s), e.fb = r
                }
            }, e.Wb = function(t, i) {
                var o = e.eb = new WebSocket(t);
                o.binaryType = "arraybuffer", o.onopen = function() {
                    e.eb === o && (console.log("Socket opened"), i())
                }, o.onclose = function() {
                    e.eb === o && (console.log("Socket closed"), e.Vb())
                }, o.onerror = function(t) {
                    e.eb === o && (console.log("Socket error"), e.Vb())
                }, o.onmessage = function(t) {
                    e.eb === o && e.z.Yb(t.data)
                }
            }, e
        }
        var LINE_LOGO_URL = "/images/linelogo.png",
            GUEST_AVATAR_URL = "/images/guest-avatar-saveukraine2022.png",
            isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream,
            GATEWAY_HOST = atob("aHR0cHM6Ly9nYXRld2F5Lndvcm1hdGUuaW8="),
            RESOURCES_HOST = atob("aHR0cHM6Ly9yZXNvdXJjZXMud29ybWF0ZS5pbw=="),
            LANG = window.I18N_LANG;
        LANG || (LANG = "en");
        var LOCALE = void 0;
        switch (LANG) {
            case "uk":
                LOCALE = "uk_UA";
                break;
            case "de":
                LOCALE = "de_DE";
                break;
            case "fr":
                LOCALE = "fr_FR";
                break;
            case "ru":
                LOCALE = "ru_RU";
                break;
            case "es":
                LOCALE = "es_ES";
                break;
            default:
                LOCALE = "en_US"
        }
        moment.locale(LOCALE);
        var SHOW_FPS = !1,
            _anApp = void 0,
            POGL = function() {
                var p = {
                        Zb: eval(atob("UElYSQ=="))
                    },
                    bm = p.Zb[atob("QkxFTkRfTU9ERVM=")],
                    wm = p.Zb[atob("V1JBUF9NT0RFUw==")];
                return {
                    $b: p.Zb[atob("Q29udGFpbmVy")],
                    _b: p.Zb[atob("QmFzZVRleHR1cmU=")],
                    ac: p.Zb[atob("VGV4dHVyZQ==")],
                    bc: p.Zb[atob("UmVuZGVyZXI=")],
                    cc: p.Zb[atob("R3JhcGhpY3M=")],
                    dc: p.Zb[atob("U2hhZGVy")],
                    ec: p.Zb[atob("UmVjdGFuZ2xl")],
                    fc: p.Zb[atob("U3ByaXRl")],
                    gc: p.Zb[atob("VGV4dA==")],
                    hc: p.Zb[atob("R2VvbWV0cnk=")],
                    ic: p.Zb[atob("TWVzaA==")],
                    jc: {
                        kc: bm[atob("QURE")]
                    },
                    lc: {
                        mc: wm[atob("UkVQRUFU")]
                    }
                }
            }(),
            _2PI = 2 * Math.PI;
        ! function() {
            var t = "Z2V0",
                e = "=",
                i = t + "SW50",
                o = t + "RmxvYXQ",
                n = [atob(i + "OA=="), atob(i + "MTY" + e), atob(i + "MzI" + e), atob(o + "zMg=="), atob(o + "2NA==")];
            DataView.prototype.nc = function(t) {
                return this[n[0]](t)
            }, DataView.prototype.oc = function(t) {
                return this[n[1]](t)
            }, DataView.prototype.pc = function(t) {
                return this[n[2]](t)
            }, DataView.prototype.qc = function(t) {
                return this[n[3]](t)
            }, DataView.prototype.rc = function(t) {
                return this[n[4]](t)
            }
        }();
        var Ability = function() {
                function t(t) {
                    this.sc = t, this.tc = !1, this.uc = 1
                }
                return t.VELOCITY_TYPE = 0, t.FLEXIBLE_TYPE = 1, t.MAGNETIC_TYPE = 2, t.ZOOM_TYPE = 6, t.X2_TYPE = 3, t.X5_TYPE = 4, t.X10_TYPE = 5, t
            }(),
            AssetsJsonManager = function() {
                function t() {
                    this.vc = [], this.wc = {}, this.xc = null, this.yc = AssetsJsonResources.zc()
                }

                function e(t, e) {
                    for (var i in t) t.hasOwnProperty(i) && e(i, t[i])
                }
                return t.prototype.a = function() {
                    this.L()
                }, t.prototype.W = function() {
                    return null != this.xc
                }, t.prototype.Ac = function() {
                    return null != this.xc ? this.xc.revision : -1
                }, t.prototype.Bc = function() {
                    return this.xc
                }, t.prototype.L = function() {
                    var t = this;
                    $.get(RESOURCES_HOST + "/dynamic/assets/revision.json", function(e) {
                        e > t.Ac() && t.Cc()
                    })
                }, t.prototype.Cc = function() {
                    var t = this;
                    $.get(RESOURCES_HOST + "/dynamic/assets/registry.json", function(e) {
                        e.revision > t.Ac() && t.Dc(e)
                    })
                }, t.prototype.ca = function(t) {
                    this.vc.push(t)
                }, t.prototype.Ec = function() {
                    return this.yc
                }, t.prototype.Fc = function() {
                    for (var t = 0; t < this.vc.length; t++) this.vc[t]()
                }, t.prototype.Gc = function(t, i) {
                    if (!(t.revision <= this.Ac())) {
                        var o = i;
                        e(this.wc, function(t, e) {
                            var i = o[t];
                            null != i && e.Hc === i.Hc || (print("disposing prev texture: " + t + " at " + e.Hc), e.Ic.destroy())
                        }), this.wc = o, this.xc = t, this.yc = AssetsJsonResources.Jc(this.xc, this.wc), this.Fc()
                    }
                }, t.prototype.Dc = function(t) {
                    var i = {};
                    e(t.textureDict, function(t, e) {
                        var o = RESOURCES_HOST + e.relativePath;
                        i[t] = new FSTexture(o, POGL._b.from(o))
                    }), this.Gc(t, i)
                }, t
            }(),
            AssetsJsonResources = function() {
                function t() {
                    this.Kc = null, this.Lc = null, this.Mc = null, this.Nc = null, this.Oc = null, this.Pc = null, this.Qc = null, this.Rc = null, this.Sc = null, this.Tc = null, this.Uc = null, this.Vc = null, this.Wc = null, this.Xc = null, this.Yc = null, this.Zc = null
                }

                function e(t, e) {
                    for (var i in t) t.hasOwnProperty(i) && e(i, t[i])
                }
                return t.zc = function() {
                    var t = new AssetsJsonResources;
                    return t.Kc = {}, t.Lc = {
                        $c: null,
                        _c: null
                    }, t.Mc = {}, t.Nc = {
                        $c: null
                    }, t.Oc = {}, t.Pc = {
                        ad: "#FFFFFF",
                        $c: [],
                        _c: []
                    }, t.Qc = {}, t.Rc = {
                        bd: {},
                        cd: t.Pc,
                        dd: t.Lc
                    }, t.Sc = {}, t.Tc = {
                        $c: []
                    }, t.Uc = {}, t.Vc = {
                        $c: []
                    }, t.Wc = {}, t.Xc = {
                        $c: []
                    }, t.Yc = {}, t.Zc = {
                        $c: []
                    }, t
                }, t.Jc = function(t, i) {
                    var o = new AssetsJsonResources,
                        n = {};
                    e(t.colorDict, function(t, e) {
                        n[t] = e
                    });
                    var r = {};
                    e(t.regionDict, function(t, e) {
                        r[t] = new Region(i[e.texture].Ic, e.x, e.y, e.w, e.h, e.px, e.py, e.pw, e.ph)
                    }), o.Oc = {};
                    for (var s = 0; s < t.skinArrayDict.length; s++) {
                        var a = t.skinArrayDict[s];
                        o.Oc[a.id] = new AssetsJsonResources.WormSkinData("#" + n[a.prime], a.base.map(function(t) {
                            return r[t]
                        }), a.glow.map(function(t) {
                            return r[t]
                        }))
                    }
                    var h = t.skinUnknown;
                    o.Pc = new AssetsJsonResources.WormSkinData("#" + n[h.prime], h.base.map(function(t) {
                        return r[t]
                    }), h.glow.map(function(t) {
                        return r[t]
                    })), o.Sc = {}, e(t.eyesDict, function(t, e) {
                        t = parseInt(t), o.Sc[t] = new AssetsJsonResources.WearSkinData(e.base.map(function(t) {
                            return r[t.region]
                        }))
                    }), o.Tc = new AssetsJsonResources.WearSkinData(t.eyesUnknown.base.map(function(t) {
                        return r[t.region]
                    })), o.Uc = {}, e(t.mouthDict, function(t, e) {
                        t = parseInt(t), o.Uc[t] = new AssetsJsonResources.WearSkinData(e.base.map(function(t) {
                            return r[t.region]
                        }))
                    }), o.Vc = new AssetsJsonResources.WearSkinData(t.mouthUnknown.base.map(function(t) {
                        return r[t.region]
                    })), o.Wc = {}, e(t.glassesDict, function(t, e) {
                        t = parseInt(t), o.Wc[t] = new AssetsJsonResources.WearSkinData(e.base.map(function(t) {
                            return r[t.region]
                        }))
                    }), o.Xc = new AssetsJsonResources.WearSkinData(t.glassesUnknown.base.map(function(t) {
                        return r[t.region]
                    })), o.Yc = {}, e(t.hatDict, function(t, e) {
                        t = parseInt(t), o.Yc[t] = new AssetsJsonResources.WearSkinData(e.base.map(function(t) {
                            return r[t.region]
                        }))
                    }), o.Zc = new AssetsJsonResources.WearSkinData(t.hatUnknown.base.map(function(t) {
                        return r[t.region]
                    })), o.Kc = {}, e(t.portionDict, function(t, e) {
                        t = parseInt(t), o.Kc[t] = new AssetsJsonResources.PortionSkinData(r[e.base], r[e.glow])
                    });
                    var l = t.portionUnknown;
                    o.Lc = new AssetsJsonResources.PortionSkinData(r[l.base], r[l.glow]), o.Mc = {}, e(t.abilityDict, function(t, e) {
                        t = parseInt(t), o.Mc[t] = new AssetsJsonResources.AbilitySkinData(r[e.base])
                    });
                    var p = t.abilityUnknown;
                    return o.Nc = new AssetsJsonResources.AbilitySkinData(r[p.base]), o.Qc = {}, e(t.teamDict, function(t, e) {
                        t = parseInt(t), o.Qc[t] = new AssetsJsonResources.TeamSkinData(e.name, new AssetsJsonResources.WormSkinData("#" + n[e.skin.prime], [], e.skin.glow.map(function(t) {
                            return r[t]
                        })), new AssetsJsonResources.PortionSkinData([], r[e.portion.glow]))
                    }), o.Rc = new AssetsJsonResources.TeamSkinData({}, o.Pc, o.Lc), o
                }, t.prototype.ed = function(t) {
                    var e = this.Oc[t];
                    return e || this.Pc
                }, t.prototype.fd = function(t) {
                    var e = this.Qc[t];
                    return e || this.Rc
                }, t.prototype.gd = function(t) {
                    var e = this.Sc[t];
                    return e || this.Tc
                }, t.prototype.hd = function(t) {
                    var e = this.Uc[t];
                    return e || this.Vc
                }, t.prototype.jd = function(t) {
                    var e = this.Wc[t];
                    return e || this.Xc
                }, t.prototype.kd = function(t) {
                    var e = this.Yc[t];
                    return e || this.Zc
                }, t.prototype.ld = function(t) {
                    var e = this.Kc[t];
                    return e || this.Lc
                }, t.prototype.md = function(t) {
                    var e = this.Mc[t];
                    return e || this.Nc
                }, t.TeamSkinData = function() {
                    function t(t, e, i) {
                        this.bd = t, this.cd = e, this.dd = i
                    }
                    return t
                }(), t.WormSkinData = function() {
                    function t(t, e, i) {
                        this.ad = t, this.$c = e, this._c = i
                    }
                    return t
                }(), t.WearSkinData = function() {
                    function t(t) {
                        this.$c = t
                    }
                    return t
                }(), t.PortionSkinData = function() {
                    function t(t, e) {
                        this.$c = t, this._c = e
                    }
                    return t
                }(), t.AbilitySkinData = function() {
                    function t(t) {
                        this.$c = t
                    }
                    return t
                }(), t
            }(),
            AudioManager = function() {
                function t() {
                    this.nd = AudioManager.AudioState.va, this.od = !1, this.pd = !1, this.qd = null, this.rd = null
                }
                t.prototype.a = function() {}, t.prototype.sd = function(t) {
                    this.pd = t
                }, t.prototype.G = function(t) {
                    this.nd = t, this.td()
                }, t.prototype.ud = function(t) {
                    this.od = t, this.td()
                }, t.prototype.td = function() {}, t.prototype.vd = function(t, e) {
                    if (!getApp().p.W) return null;
                    var i = t[e];
                    return null == i || 0 == i.length ? null : i[Math.floor(Math.random() * i.length)].cloneNode()
                }, t.prototype.wd = function(t, e, i) {
                    if (this.pd && !(i <= 0)) {
                        var o = this.vd(t, e);
                        null != o && (o.volume = Math.min(1, i), o.play())
                    }
                }, t.prototype.xd = function(t, e) {
                    this.nd.yd && this.wd(app.q.zd, t, e)
                }, t.prototype.Ad = function(t, e) {
                    this.nd.Bd && this.wd(app.q.Cd, t, e)
                }, t.prototype.Dd = function() {}, t.prototype.Ed = function() {}, t.prototype.Fd = function() {}, t.prototype.Gd = function() {}, t.prototype.Hd = function() {}, t.prototype.Id = function() {}, t.prototype.Jd = function(t, e, i) {}, t.prototype.Kd = function(t) {}, t.prototype.Ld = function(t) {}, t.prototype.Md = function(t) {}, t.prototype.Nd = function(t) {}, t.prototype.Od = function(t) {}, t.prototype.Pd = function(t) {}, t.prototype.Qd = function(t) {}, t.prototype.Rd = function(t) {}, t.prototype.Sd = function(t) {}, t.prototype.Td = function(t) {}, t.prototype.Ud = function(t) {}, t.prototype.Vd = function(t) {}, t.prototype.Wd = function(t) {}, t.prototype.Xd = function(t) {}, t.prototype.Yd = function(t, e) {}, t.prototype.Zd = function(t) {}, t.prototype.$d = function(t, e, i) {};
                var e = (function() {
                    function t(t) {
                        this._d = new e(t, .5), this._d.ae.loop = !0, this.be = !1
                    }
                    t.prototype.ce = function(t) {
                        t ? this.b() : this.de()
                    }, t.prototype.b = function() {
                        this.be || (this.be = !0, this._d.ee = 0, this._d.fe(1500, 100))
                    }, t.prototype.de = function() {
                        this.be && (this.be = !1, this._d.ge(1500, 100))
                    }
                }(), function() {
                    function t(t) {
                        this.he = t.map(function(t) {
                            return new e(t, .4)
                        }), i(this.he, 0, this.he.length), this.ie = null, this.je = 0, this.be = !1, this.ke = 1e4
                    }

                    function i(t, e, i) {
                        for (var o = i - 1; o > e; o--) {
                            var n = e + Math.floor(Math.random() * (o - e + 1)),
                                r = t[o];
                            t[o] = t[n], t[n] = r
                        }
                    }
                    t.prototype.ce = function(t) {
                        t ? this.b() : this.de()
                    }, t.prototype.b = function() {
                        this.be || (this.be = !0, this.le(1500))
                    }, t.prototype.de = function() {
                        this.be && (this.be = !1, null != this.ie && this.ie.ge(800, 50))
                    }, t.prototype.le = function(t) {
                        if (this.be) {
                            null == this.ie && (this.ie = this.me()), this.ie.ae.currentTime + this.ke / 1e3 > this.ie.ae.duration && (this.ie = this.me(), this.ie.ae.currentTime = 0), console.log("Current track '" + this.ie.ae.src + "', change in (ms) " + (1e3 * (this.ie.ae.duration - this.ie.ae.currentTime) - this.ke)), this.ie.ee = 0, this.ie.fe(t, 100);
                            var e = 1e3 * (this.ie.ae.duration - this.ie.ae.currentTime) - this.ke,
                                i = this,
                                o = setTimeout(function() {
                                    i.be && o == i.je && (i.ie.ge(i.ke, 100), i.ie = i.me(), i.ie.ae.currentTime = 0, i.le(i.ke))
                                }, e);
                            this.je = o
                        }
                    }, t.prototype.me = function() {
                        var t = this.he[0],
                            e = Math.max( 1, this.he.length / 2);
                        return i(this.he, e, this.he.length), this.he.push(this.he.shift()), t
                    }
                }(), function() {
                    function t(t, e) {
                        this.ae = t, this.ne = e, this.ee = 0, t.volume = 0, this.oe = 0, this.pe = !1
                    }
                    return t.prototype.fe = function(t, e) {
                        console.log("fade IN " + this.ae.src), this.qe(!0, t, e)
                    }, t.prototype.ge = function(t, e) {
                        console.log("fade OUT " + this.ae.src), this.qe(!1, t, e)
                    }, t.prototype.qe = function(t, e, i) {
                        this.pe && clearInterval(this.oe);
                        var o = this,
                            n = 1 / (e / i),
                            r = setInterval(function() {
                                if (o.pe && r != o.oe) return void clearInterval(r);
                                t ? (o.ee = Math.min(1, o.ee + n), o.ae.volume = o.ee * o.ne, o.ee >= 1 && (o.pe = !1, clearInterval(r))) : (o.ee = Math.max( 0, o.ee - n), o.ae.volume = o.ee * o.ne, o.ee <= 0 && (o.ae.pause(), o.pe = !1, clearInterval(r)))
                            }, i);
                        this.pe = !0, this.oe = r, this.ae.play()
                    }, t
                }());
                return t.AudioState = {
                    va: {
                        re: !1,
                        se: !1,
                        Bd: !0,
                        yd: !1
                    },
                    F: {
                        re: !1,
                        se: !0,
                        Bd: !0,
                        yd: !1
                    },
                    H: {
                        re: !0,
                        se: !1,
                        Bd: !1,
                        yd: !0
                    },
                    Fa: {
                        re: !1,
                        se: !1,
                        Bd: !0,
                        yd: !1
                    },
                    ra: {
                        re: !1,
                        se: !1,
                        Bd: !1,
                        yd: !1
                    }
                }, t
            }(),
            BackgroundView = function() {
                function t(t) {
                    this.te = t, this.ue = t.get()[0], this.ve = new POGL.bc({
                        view: this.ue,
                        backgroundColor: e,
                        antialias: !0
                    }), this.we = new POGL.$b, this.we.sortableChildren = !0, this.xe = [], this.ye = [], this.ze = [], this.a()
                }
                var e = 0,
                    i = function(t, e) {
                        return t + Math.random(e - t)
                    },
                    o = function(t) {
                        return t >= 0 ? Math.cos(t % _2PI) : Math.cos(t % _2PI + _2PI)
                    },
                    n = function(t) {
                        return t >= 0 ? Math.sin(t % _2PI) : Math.sin(t % _2PI + _2PI)
                    },
                    r = [{
                        Ae: i(0, _2PI),
                        Be: i(0, _2PI),
                        Ce: i(.1, .5),
                        De: 1,
                        Ee: 2,
                        Fe: 16765440
                    }, {
                        Ae: i(0, _2PI),
                        Be: i(0, _2PI),
                        Ce: i(.1, .5),
                        De: 1.5,
                        Ee: 1.5,
                        Fe: 16765440
                    }, {
                        Ae: i(0, _2PI),
                        Be: i(0, _2PI),
                        Ce: i(.1, .5),
                        De: 2,
                        Ee: 1,
                        Fe: 16765440
                    }, {
                        Ae: i(0, _2PI),
                        Be: i(0, _2PI),
                        Ce: i(.1, .5),
                        De: 3,
                        Ee: 2,
                        Fe: 16765440
                    }, {
                        Ae: i(0, _2PI),
                        Be: i(0, _2PI),
                        Ce: i(.1, .5),
                        De: 2.5,
                        Ee: 2.5,
                        Fe: 37119
                    }, {
                        Ae: i(0, _2PI),
                        Be: i(0, _2PI),
                        Ce: i(.1, .5),
                        De: 2,
                        Ee: 3,
                        Fe: 37119
                    }, {
                        Ae: i(0, _2PI),
                        Be: i(0, _2PI),
                        Ce: i(.1, .5),
                        De: 5,
                        Ee: 4,
                        Fe: 37119
                    }, {
                        Ae: i(0, _2PI),
                        Be: i(0, _2PI),
                        Ce: i(.1, .5),
                        De: 4.5,
                        Ee: 4.5,
                        Fe: 37119
                    }];
                return t.prototype.a = function() {
                    var t = getApp();
                    this.ve.backgroundColor = e, this.xe = new Array(r.length);
                    for (var i = 0; i < this.xe.length; i++) this.xe[i] = new POGL.fc, this.xe[i].texture = t.q.Ge, this.xe[i].anchor.set(.5), this.xe[i].zIndex = 1, this.we.addChild(this.xe[i]);
                    this.ye = new Array(t.q.He.length);
                    for (var o = 0; o < this.ye.length; o++) this.ye[o] = new POGL.fc, this.ye[o].texture = t.q.He[o], this.ye[o].anchor.set(.5), this.ye[o].zIndex = 2, this.we.addChild(this.ye[o]);
                    this.ze = new Array(this.ye.length);
                    for (var n = 0; n < this.ze.length; n++) {
                        var s = n % 2 == 0 ? [1, .82, 0] : [0, .56, 1];
                        this.ze[n] = {
                            Ie: randomRange(0, _2PI),
                            Je: .66 * randomRange(.09, .16),
                            Ke: randomRange(0, 1),
                            Le: randomRange(0, 1),
                            Me: s[0],
                            Ne: s[1],
                            Oe: s[2]
                        }
                    }
                    this.Sa()
                }, t.tc = !1, t.Pe = function(e) {
                    t.tc = e
                }, t.prototype.Sa = function() {
                    var t = window.devicePixelRatio ? window.devicePixelRatio : 1,
                        e = this.te.width(),
                        i = this.te.height();
                    this.ve.resize(e, i), this.ve.resolution = t, this.ue.width = t * e, this.ue.height = t * i;
                    for (var o = .8 * Math.max( e, i), n = 0; n < this.xe.length; n++) this.xe[n].width = o, this.xe[n].height = o
                }, t.prototype.Qa = function(e, i) {
                    if (t.tc) {
                        for (var s = e / 1e3, a = this.te.width(), h = this.te.height(), l = 0; l < this.xe.length; l++) {
                            var p = r[l % r.length],
                                u = this.xe[l],
                                c = o(p.De * (.08 * s) + p.Be),
                                f = n(p.Ee * (.08 * s)),
                                d = .2 + .2 * o(p.Be + p.Ce * s);
                            u.tint = p.Fe, u.alpha = d, u.position.set(a * (.2 + .5 * (c + 1) * .6), h * (.1 + .5 * (f + 1) * .8))
                        }
                        for (var g = .05 * Math.max( a, h), w = 0; w < this.ye.length; w++) {
                            var y = this.ze[w],
                                k = this.ye[w],
                                v = _2PI * w / this.ye.length;
                            y.Ke = .2 + .6 * (Math.cos(.01 * s + v) + .2 * Math.cos(.02 * s * 17 + v) + 1) / 2, y.Le = .1 + .8 * (Math.sin(.01 * s + v) + .2 * Math.sin(.02 * s * 21 + v) + 1) / 2;
                            var b = y.Ke,
                                m = y.Le,
                                C = clamp(Math.pow(Math.cos(1.5 * (v + .048 * s)), 6), 0, .9),
                                P = 1.3 * (.4 + .5 * (1 + Math.sin(v + .12 * s)) * 1.2);
                            k.alpha = C, k.tint = 16777215 & ((255 & parseInt(255 * y.Me)) << 16 | (255 & parseInt(255 * y.Ne)) << 8 | 255 & parseInt(255 * y.Oe)), k.position.set(a * b, h * m), k.rotation = 0;
                            var B = k.texture.width / k.texture.height;
                            k.width = P * g, k.height = P * g * B
                        }
                        this.ve.render(this.we, null, !0)
                    }
                }, t
            }(),
            Cookies = function() {
                function t() {}
                return t.Oa = "consent_state_2", t.za = "showPlayerNames", t.Qe = "musicEnabled", t.Re = "sfxEnabled", t.Se = "account_type", t.wa = "gameMode", t.Ba = "nickname", t.Ca = "skin", t.d = "prerollCount", t.Ma = "shared", t
            }(),
            EEAMap = function() {
                function t(t, e, i) {
                    for (var o = !1, n = i.length, r = 0, s = n - 1; r < n; s = r++) i[r][1] > e != i[s][1] > e && t < (i[s][0] - i[r][0]) * (e - i[r][1]) / (i[s][1] - i[r][1]) + i[r][0] && (o = !o);
                    return o
                }
                var e = [
                    [-28.06744, 64.95936],
                    [-10.59082, 72.91964],
                    [14.11773, 81.39558],
                    [36.51855, 81.51827],
                    [32.82715, 71.01696],
                    [31.64063, 69.41897],
                    [29.41419, 68.43628],
                    [30.64379, 67.47302],
                    [29.88281, 66.76592],
                    [30.73975, 65.50385],
                    [30.73975, 64.47279],
                    [31.48682, 63.49957],
                    [32.18994, 62.83509],
                    [28.47726, 60.25122],
                    [28.76221, 59.26588],
                    [28.03711, 58.60833],
                    [28.38867, 57.53942],
                    [28.83955, 56.2377],
                    [31.24512, 55.87531],
                    [31.61865, 55.34164],
                    [31.92627, 54.3037],
                    [33.50497, 53.26758],
                    [32.73926, 52.85586],
                    [32.23389, 52.4694],
                    [34.05762, 52.44262],
                    [34.98047, 51.79503],
                    [35.99121, 50.88917],
                    [36.67236, 50.38751],
                    [37.74902, 50.51343],
                    [40.78125, 49.62495],
                    [40.47363, 47.70976],
                    [38.62799, 46.92028],
                    [37.53193, 46.55915],
                    [36.72182, 44.46428],
                    [39.68218, 43.19733],
                    [40.1521, 43.74422],
                    [43.52783, 43.03678],
                    [45.30762, 42.73087],
                    [46.99951, 41.98399],
                    [47.26318, 40.73061],
                    [44.20009, 40.86309],
                    [45.35156, 39.57182],
                    [45.43945, 36.73888],
                    [35.64789, 35.26481],
                    [33.13477, 33.65121],
                    [21.47977, 33.92486],
                    [12.16268, 34.32477],
                    [11.82301, 37.34239],
                    [6.09112, 38.28597],
                    [-1.96037, 35.62069],
                    [-4.82156, 35.60443],
                    [-7.6498, 35.26589],
                    [-16.45237, 37.44851],
                    [-28.06744, 64.95936]
                ];
                return {
                    Pa: function(i, o) {
                        return t(o, i, e)
                    }
                }
            }(),
            FloatingStringManager = function() {
                function t(t) {
                    var e = void 0;
                    e = t > 0 ? "+" + Math.floor(t) : t < 0 ? "-" + Math.floor(t) : "0";
                    var o = Math.min(1.5, .5 + t / 600),
                        r = void 0;
                    if (t < 1) r = "0xFFFFFF";
                    else if (t < 30) {
                        var s = (t - 1) / 29;
                        r = i(1 * (1 - s) + .96 * s, 1 * (1 - s) + .82 * s, 1 * (1 - s) + 0 * s)
                    } else if (t < 300) {
                        var a = (t - 30) / 270;
                        r = i(.96 * (1 - a) + .93 * a, .82 * (1 - a) + .34 * a, 0 * (1 - a) + .25 * a)
                    } else if (t < 700) {
                        var h = (t - 300) / 400;
                        r = i(.93 * (1 - h) + .98 * h, .34 * (1 - h) + 0 * h, .25 * (1 - h) + .98 * h)
                    } else r = i(.98, 0, .98);
                    var l = Math.random(),
                        p = 1 + .5 * Math.random();
                    return new n(e, r, !0, .5, o, l, p)
                }

                function e(t, e) {
                    var o = void 0,
                        r = void 0;
                    return e ? (o = 1.3, r = i(.93, .34, .25)) : (o = 1.1, r = i(.96, .82, 0)), new n(t, r, !0, .5, o, .5, .7)
                }

                function i(t, e, i) {
                    return ((255 * t & 255) << 16) + ((255 * e & 255) << 8) + (255 * i & 255)
                }
                var o = extend(POGL.$b, function() {
                    POGL.$b.call(this), this.Te = [], this.Ue = 0
                });
                o.prototype.Ve = function(e) {
                    if (this.Ue += e, this.Ue >= 1) {
                        var i = Math.floor(this.Ue);
                        this.Ue -= i;
                        var o = t(i);
                        this.addChild(o), this.Te.push(o)
                    }
                }, o.prototype.We = function(t) {
                    if (t) {
                        var i = e(i18n("index.game.floating.headshot"), !0);
                        this.addChild(i), this.Te.push(i)
                    } else {
                        var o = e(i18n("index.game.floating.wellDone"), !1);
                        this.addChild(o), this.Te.push(o)
                    }
                }, o.prototype.Xe = function(t, e) {
                    for (var i = getApp().s.H.xb, o = i.ve.width / i.ve.resolution, n = i.ve.height / i.ve.resolution, r = 0; r < this.Te.length;) {
                        var s = this.Te[r];
                        s.Ye = s.Ye + e / 2e3 * s.Ze, s.$e = s.$e + e / 2e3 * s._e, s.alpha = .5 * Math.sin(Math.PI * s.$e), s.scale.set(s.Ye), s.position.x = o * (.25 + .5 * s.af), s.position.y = s.bf ? n * (1 - .5 * (1 + s.$e)) : n * (1 - .5 * (0 + s.$e)), s.$e > 1 && (pixijs_removeFromParent(s), this.Te.splice(r, 1), r--), r++
                    }
                };
                var n = function() {
                    return extend(POGL.gc, function(t, e, i, o, n, r, s) {
                        POGL.gc.call(this, t, {
                            fill: e,
                            fontFamily: "PTSans",
                            fontSize: 36
                        }), this.anchor.set(.5), this.bf = i, this.Ye = o, this.Ze = n, this.af = r, this.$e = 0, this._e = s
                    })
                }();
                return o
            }(),
            FSTexture = function() {
                function t(t, e) {
                    this.Hc = t, this.Ic = e
                }
                return t
            }(),
            GameMode = {
                cf: 0,
                df: 16
            },
            GameParams = function() {
                function t() {
                    this.ef = GameMode.cf, this.ff = 0, this.vb = 500, this.gf = 4e3, this.hf = 7e3
                }
                return t.TEAM_DEFAULT = 0, t.prototype.if = function() {
                    return 1.02 * this.vb
                }, t
            }(),
            GameView = function() {
                function t(t) {
                    this.te = t, this.ue = t.get()[0], this.ve = new POGL.bc({
                        view: this.ue,
                        backgroundColor: e,
                        antialias: !0
                    }), this.we = new POGL.$b, this.we.sortableChildren = !0, this.jf = Math.floor(360 * Math.random()), this.kf = 0, this.lf = 0, this.mf = 15, this.nf = .5, this.pf = 0, this.qf = new WMGameBackgroundSprite, this.rf = new POGL.cc, this.sf = new POGL.$b, this.tf = new POGL.$b, this.tf.sortableChildren = !0, this.uf = new POGL.$b, this.vf = new POGL.$b, this.vf.sortableChildren = !0, this.wf = new POGL.$b, this.xf = new i, this.yf = new o, this.zf = new n, this.Af = new FloatingStringManager, this.Bf = new POGL.fc, this.Cf = {
                        x: 0,
                        y: 0
                    }, this.a()
                }
                var e = 0;
                t.prototype.a = function() {
                    this.ve.backgroundColor = e, this.qf.Df.zIndex = 10, this.we.addChild(this.qf.Df), this.rf.zIndex = 20, this.we.addChild(this.rf), this.sf.zIndex = 5e3, this.we.addChild(this.sf), this.tf.zIndex = 5100, this.we.addChild(this.tf), this.uf.zIndex = 1e4, this.we.addChild(this.uf), this.Bf.texture = getApp().q.Ef, this.Bf.anchor.set(.5), this.Bf.zIndex = 1, this.vf.addChild(this.Bf), this.wf.alpha = .6, this.wf.zIndex = 2, this.vf.addChild(this.wf), this.Af.zIndex = 3, this.vf.addChild(this.Af), this.xf.alpha = .8, this.xf.zIndex = 4, this.vf.addChild(this.xf), this.yf.zIndex = 5, this.vf.addChild(this.yf), this.zf.zIndex = 6, this.vf.addChild(this.zf), this.Sa()
                }, t.prototype.Sa = function() {
                    var t = window.devicePixelRatio ? window.devicePixelRatio : 1,
                        e = this.te.width(),
                        i = this.te.height();
                    this.ve.resize(e, i), this.ve.resolution = t, this.ue.width = t * e, this.ue.height = t * i, this.nf = Math.min(Math.min(e, i), window.multiplier * Math.max( e, i)), this.Bf.position.x = e / 2, this.Bf.position.y = i / 2, this.Bf.width = e, this.Bf.height = i, this.xf.position.x = 60, this.xf.position.y = 60, this.yf.position.x = 110, this.yf.position.y = 10, this.zf.position.x = e - 225, this.zf.position.y = 1
                    window.changedNf = () => this.nf = Math.min(Math.min(e, i), window.multiplier * Math.max( e, i));
                }, t.prototype.Xe = function(t, e) {
                    var i = getApp();
                    this.mf = 15, this.sf.removeChildren(), this.tf.removeChildren(), this.uf.removeChildren(), this.wf.removeChildren(), this.qf.Ff(t.ef == GameMode.cf ? i.q.Gf : i.q.Hf);
                    var o = this.rf;
                    o.clear(), o.lineStyle(.2, 16711680, .3), o.drawCircle(0, 0, t.vb), o.endFill(), this.zf.If = e, this.wf.visible = e
                }, t.prototype.Qa = function(t, e) {
                    if (!(this.ve.width <= 5)) {
                        var i = getApp(),
                            o = i.o.N,
                            n = this.ve.width / this.ve.resolution,
                            r = this.ve.height / this.ve.resolution;
                        this.mf = timeDeltaIncrement(this.mf, i.o.kb, e, .002);
                        var s = this.nf / this.mf,
                            a = i.o.N.Jf[Ability.ZOOM_TYPE],
                            h = null != a && a.tc;
                        this.pf = minmax(0, 1, this.pf + e / 1e3 * (.1 * (h ? 1 : 0) - this.pf)), this.Bf.alpha = this.pf, this.jf = this.jf + .01 * e, this.jf > 360 && (this.jf = this.jf % 360), this.kf = Math.sin(t / 1200 * 2 * Math.PI);
                        var l = o.Kf();
                        this.Cf.x = linearApproach(this.Cf.x, l.x, e, .5, 33.333), this.Cf.y = linearApproach(this.Cf.y, l.y, e, .5, 33.333);
                        var p = n / s / 2,
                            u = r / s / 2;
                        i.o.zb(this.Cf.x - 1.3 * p, this.Cf.x + 1.3 * p, this.Cf.y - 1.3 * u, this.Cf.y + 1.3 * u), this.qf.Xe(this.Cf.x, this.Cf.y, 2 * p, 2 * u);
                        var c = i.o.gb.vb;
                        this.we.scale.x = s, this.we.scale.y = s, this.we.position.x = n / 2 - this.Cf.x * s, this.we.position.y = r / 2 - this.Cf.y * s;
                        var f = Math.hypot(l.x, l.y);
                        if (f > c - 10) {
                            this.lf = minmax(0, 1, 1 + (f - c) / 10);
                            var d = Math.cos(this.jf * _2PI / 360) * (1 - this.lf) + 1 * this.lf,
                                g = Math.sin(this.jf * _2PI / 360) * (1 - this.lf),
                                w = (Math.atan2(g, d) + _2PI) % _2PI * 360 / _2PI,
                                y = this.lf * (.5 + .5 * this.kf),
                                k = convertHSLtoRGB(Math.floor(w), 1, .75 - .25 * this.lf);
                            this.qf.Lf(k[0], k[1], k[2], .1 + .2 * y)
                        } else {
                            this.lf = 0;
                            var v = convertHSLtoRGB(Math.floor(this.jf), 1, .75);
                            this.qf.Lf(v[0], v[1], v[2], .1)
                        }
                        for (var b = 0; b < this.wf.children.length; b++) {
                            var m = this.wf.children[b];
                            m.position.x = n / 2 - (this.Cf.x - m.Mf.x) * s, m.position.y = r / 2 - (this.Cf.y - m.Mf.y) * s
                        }
                        this.xf.Nf.position.x = l.x / c * this.xf.Of, this.xf.Nf.position.y = l.y / c * this.xf.Of, this.yf.Ra(t), this.Af.Xe(t, e), this.ve.render(this.we, null, !0), this.ve.render(this.vf, null, !1)
                    }
                }, t.prototype.Pf = function(t, e) {
                    e.Sf.Rf.Qf().zIndex = (t + 2147483648) / 4294967296 * 5e3, this.sf.addChild(e.Sf.Tf.Qf()), this.tf.addChild(e.Sf.Rf.Qf())
                }, t.prototype.Uf = function(t, e, i) {
                    e.Vf.zIndex = getApp().o.gb.ff ? 0 : 10 + (t + 32768) / 65536 * 5e3, this.uf.addChild(e.Vf), t != getApp().o.gb.ff && this.wf.addChild(i)
                };
                var i = function() {
                        return extend(POGL.$b, function() {
                            POGL.$b.call(this), this.Of = 40, this.Wf = new POGL.fc, this.Wf.anchor.set(.5), this.Nf = new POGL.cc;
                            var t = new POGL.cc;
                            t.beginFill("black", .4), t.drawCircle(0, 0, this.Of), t.endFill(), t.lineStyle(2, 16225317), t.drawCircle(0, 0, this.Of), t.moveTo(0, -this.Of), t.lineTo(0, +this.Of), t.moveTo(-this.Of, 0), t.lineTo(+this.Of, 0), t.endFill(), this.Wf.alpha = .5, this.Nf.zIndex = 2, this.Nf.alpha = .9, this.Nf.beginFill(16225317), this.Nf.drawCircle(0, 0, .06 * this.Of), this.Nf.endFill(), this.Nf.lineStyle(1, "black"), this.Nf.drawCircle(0, 0, .06 * this.Of), this.Nf.endFill(), this.addChild(t), this.addChild(this.Wf), this.addChild(this.Nf)
                        })
                    }(),
                    o = function() {
                        var t = extend(POGL.$b, function() {
                            POGL.$b.call(this), this.Xf = {}
                        });
                        t.prototype.Ra = function(t) {
                            var e = .5 + .5 * Math.cos(_2PI * (t / 1e3 / 1.6));
                            for (var i in this.Xf) {
                                var o = this.Xf[i],
                                    n = o.Yf;
                                o.alpha = 1 - n + n * e
                            }
                        }, t.prototype.Xe = function(t) {
                            for (var i in this.Xf) null != t[i] && t[i].tc || (pixijs_removeFromParent(this.Xf[i]), delete this.Xf[i]);
                            var o = 0;
                            for (var n in t) {
                                var r = t[n];
                                if (r.tc) {
                                    var s = this.Xf[n];
                                    if (!s) {
                                        var a = getApp().p.Ec().md(r.sc).$c;
                                        s = new e, s.texture = a.Ic, s.width = 40, s.height = 40, this.Xf[n] = s, this.addChild(s)
                                    }
                                    s.Yf = r.uc, s.position.x = o, o += 40
                                }
                            }
                        };
                        var e = function() {
                            return extend(POGL.fc, function() {
                                POGL.fc.call(this), this.Yf = 0
                            })
                        }();
                        return t
                    }(),
                    n = function() {
                        var t = extend(POGL.$b, function() {
                            POGL.$b.call(this), this.If = !0, this.Zf = 12, this.$f = 9, this.Te = [];
                            for (var t = 0; t < 14; t++) this._f()
                        });
                        t.prototype.Xe = function(t) {
                            var e = getApp(),
                                i = e.o.gb.ef == GameMode.df,
                                o = 0,
                                n = 0;
                            n >= this.Te.length && this._f(), this.Te[n].ag(1, "white"), this.Te[n].bg("", i18n("index.game.leader.top10"), "(" + e.o.ub + " online)"), this.Te[n].position.y = o, o += this.Zf, n += 1, t.cg.length > 0 && (o += this.$f);
                            for (var r = 0; r < t.cg.length; r++) {
                                var s = t.cg[r],
                                    a = e.p.Ec().fd(s.dg);
                                n >= this.Te.length && this._f(), this.Te[n].ag(.8, a.cd.ad), this.Te[n].bg("" + (r + 1), i18nCustomBundle(a.bd), "" + Math.floor(s.M)), this.Te[n].position.y = o, o += this.Zf, n += 1
                            }
                            t.eg.length > 0 && (o += this.$f);
                            for (var h = 0; h < t.eg.length; h++) {
                                var l = t.eg[h],
                                    p = e.o.gb.ff == l.fg,
                                    u = void 0,
                                    c = void 0;
                                if (p) u = "white", c = e.o.N.Nb.bd;
                                else {
                                    var f = e.o.ib[l.fg];
                                    null != f ? (u = i ? e.p.Ec().fd(f.Nb.gg).cd.ad : e.p.Ec().ed(f.Nb.hg).ad, c = this.If ? f.Nb.bd : "---") : (u = "gray", c = "?")
                                }
                                p && (o += this.$f), n >= this.Te.length && this._f(), this.Te[n].ag(p ? 1 : .8, u), this.Te[n].bg("" + (h + 1), c, "" + Math.floor(l.M)), this.Te[n].position.y = o, o += this.Zf, n += 1, p && (o += this.$f)
                            }
                            for (e.o.O > t.eg.length && (o += this.$f, n >= this.Te.length && this._f(), this.Te[n].ag(1, "white"), this.Te[n].bg("" + e.o.O, e.o.N.Nb.bd, "" + Math.floor(e.o.N.M)), this.Te[n].position.y = o, o += this.Zf, n += 1, o += this.$f); this.Te.length > n;) pixijs_removeFromParent(this.Te.pop())
                        }, t.prototype._f = function() {
                            var t = new e;
                            t.position.y = 0, this.Te.length > 0 && (t.position.y = this.Te[this.Te.length - 1].position.y + this.Zf), this.Te.push(t), this.addChild(t)
                        };
                        var e = function() {
                            var t = extend(POGL.$b, function() {
                                POGL.$b.call(this), this.ig = new POGL.gc("", {
                                    fontFamily: "PTSans",
                                    fontSize: 12,
                                    fill: "white"
                                }), this.ig.anchor.x = 1, this.ig.position.x = 30, this.addChild(this.ig), this.jg = new POGL.gc("", {
                                    fontFamily: "PTSans",
                                    fontSize: 12,
                                    fill: "white"
                                }), this.jg.anchor.x = 0, this.jg.position.x = 35, this.addChild(this.jg), this.kg = new POGL.gc("", {
                                    fontFamily: "PTSans",
                                    fontSize: 12,
                                    fill: "white"
                                }), this.kg.anchor.x = 1, this.kg.position.x = 220, this.addChild(this.kg)
                            });
                            return t.prototype.bg = function(t, e, i) {
                                this.ig.text = t, this.kg.text = i;
                                var o = e;
                                for (this.jg.text = o; this.jg.width > 100;) o = o.substring(0, o.length - 1), this.jg.text = o + ".."
                            }, t.prototype.ag = function(t, e) {
                                this.ig.alpha = t, this.ig.style.fill = e, this.jg.alpha = t, this.jg.style.fill = e, this.kg.alpha = t, this.kg.style.fill = e
                            }, t
                        }();
                        return t
                    }();
                return t
            }(),
            MessageProcessor = function() {
                function t(t) {
                    this.o = t, this.lg = [], this.mg = 0
                }
                t.prototype.Yb = function(t) {
                    this.lg.push(new DataView(t))
                }, t.prototype.Tb = function() {
                    this.lg = [], this.mg = 0
                }, t.prototype.Cb = function() {
                    for (var t = 0; t < 10; t++) {
                        if (0 === this.lg.length) return;
                        var e = this.lg.shift();
                        try {
                            this.ng(e)
                        } catch (t) {
                            throw console.log("DataReader error: " + t), t
                        }
                    }
                }, t.prototype.ng = function(t) {
                    switch (255 & t.nc(0)) {
                        case 0:
                            return void this.og(t, 1);
                        case 1:
                            return void this.pg(t, 1);
                        case 2:
                            return void this.qg(t, 1);
                        case 3:
                            return void this.rg(t, 1);
                        case 4:
                            return void this.sg(t, 1);
                        case 5:
                            return void this.tg(t, 1)
                    }
                }, t.prototype.og = function(t, e) {
                    console.log("sgp1"), this.o.gb.ef = t.nc(e), e += 1;
                    var i = t.oc(e);
                    return e += 2, this.o.gb.ff = i, this.o.N.Nb.Mb = i, this.o.gb.vb = t.qc(e), e += 4, this.o.gb.gf = t.qc(e), e += 4, this.o.gb.hf = t.qc(e), e += 4, getApp().s.H.xb.Xe(this.o.gb, getApp().s.ya.xa()), console.log("sgp2"), e
                }, t.prototype.pg = function(t, e) {
                    var i = this.mg++,
                        o = t.oc(e);
                    e += 2;
                    var n = void 0;
                    n = this.ug(t, e), e += this.vg(n);
                    for (var r = 0; r < n; r++) e = this.wg(t, e);
                    n = this.ug(t, e), e += this.vg(n);
                    for (var s = 0; s < n; s++) e = this.xg(t, e);
                    n = this.ug(t, e), e += this.vg(n);
                    for (var a = 0; a < n; a++) e = this.yg(t, e);
                    n = this.ug(t, e), e += this.vg(n);
                    for (var h = 0; h < n; h++) e = this.zg(t, e);
                    n = this.ug(t, e), e += this.vg(n);
                    for (var l = 0; l < n; l++) e = this.Ag(t, e);
                    n = this.ug(t, e), e += this.vg(n);
                    for (var p = 0; p < n; p++) e = this.Bg(t, e);
                    n = this.ug(t, e), e += this.vg(n);
                    for (var u = 0; u < n; u++) e = this.Cg(t, e);
                    n = this.ug(t, e), e += this.vg(n);
                    for (var c = 0; c < n; c++) e = this.Dg(t, e);
                    return i > 0 && (e = this.Eg(t, e)), this.o.Rb(i, o), e
                }, t.prototype.zg = function(t, e) {
                    var i = new Worm.Config;
                    i.Mb = t.oc(e), e += 2, i.gg = this.o.gb.ef == GameMode.df ? t.nc(e++) : GameParams.TEAM_DEFAULT, i.hg = t.oc(e), e += 2, i.Fg = t.oc(e), e += 2, i.Gg = t.oc(e), e += 2, i.Hg = t.oc(e), e += 2, i.Ig = t.oc(e), e += 2;
                    var o = t.nc(e);
                    e += 1;
                    for (var n = "", r = 0; r < o; r++) n += String.fromCharCode(t.oc(e)), e += 2;
                    if (i.bd = n, this.o.gb.ff === i.Mb) this.o.N.Jg(i);
                    else {
                        var s = this.o.ib[i.Mb];
                        null != s && s.Lb();
                        var a = new Worm(this.o.gb);
                        a.wb(getApp().s.H.xb), this.o.ib[i.Mb] = a, a.Jg(i)
                    }
                    return e
                }, t.prototype.Ag = function(t, e) {
                    var i = t.oc(e);
                    e += 2;
                    var o = t.nc(e);
                    e++;
                    var n = !!(1 & o),
                        r = !!(2 & o),
                        s = 0;
                    n && (s = t.oc(e), e += 2);
                    var a = this.Kg(i);
                    if (void 0 === a) return e;
                    if (a.Jb = !1, !a.Ib) return e;
                    var h = this.Kg(i);
                    if (n && void 0 !== h && h.Ib)
                        if (s === this.o.gb.ff) {
                            var l = this.o.N.Kf(),
                                p = a.Lg(l.x, l.y);
                            Math.max( 0, 1 - p.distance / (.5 * this.o.kb));
                            p.distance < .5 * this.o.kb && getApp().s.H.xb.Af.We(r)
                        } else if (i === this.o.gb.ff);
                    else {
                        var u = this.o.N.Kf(),
                            c = a.Lg(u.x, u.y);
                        Math.max( 0, 1 - c.distance / (.5 * this.o.kb))
                    } else if (i === this.o.gb.ff);
                    else {
                        var f = this.o.N.Kf(),
                            d = a.Lg(f.x, f.y);
                        Math.max( 0, 1 - d.distance / (.5 * this.o.kb))
                    }
                    return e
                }, t.prototype.Dg = function(t, e) {
                    var i = t.oc(e);
                    e += 2;
                    var o = i === this.o.gb.ff ? null : this.o.ib[i],
                        n = t.nc(e);
                    e += 1;
                    var r = !!(1 & n);
                    if (!!(2 & n)) {
                        var s = t.qc(e);
                        e += 4, o && o.Mg(s)
                    }
                    var a = this.Ng(t.nc(e++), t.nc(e++), t.nc(e++)),
                        h = this.Ng(t.nc(e++), t.nc(e++), t.nc(e++));
                    if (o) {
                        o.Og(a, h, r);
                        var l = this.o.N.Kf(),
                            p = o.Kf(),
                            u = Math.max( 0, 1 - Math.hypot(l.x - p.x, l.y - p.y) / (.5 * this.o.kb));
                        getApp().r.$d(u, i, r)
                    }
                    var c = this.ug(t, e);
                    if (e += this.vg(c), o)
                        for (var f in o.Jf) {
                            var d = o.Jf[f];
                            d && (d.tc = !1)
                        }
                    for (var g = 0; g < c; g++) {
                        var w = t.nc(e);
                        e++;
                        var y = t.nc(e);
                        if (e++, o) {
                            var k = o.Jf[w];
                            k || (k = o.Jf[w] = new Ability(w)), k.tc = !0, k.uc = Math.min( 1, Math.max( 0, y / 100))
                        }
                    }
                    return e
                }, t.prototype.Eg = function(t, e) {
                    var i = this.o.N,
                        o = t.nc(e);
                    e += 1;
                    var n = !!(1 & o),
                        r = !!(2 & o),
                        s = !!(4 & o);
                    if (r) {
                        var a = i.M;
                        i.Mg(t.qc(e)), e += 4, a = i.M - a, a > 0 && getApp().s.H.xb.Af.Ve(a)
                    }
                    s && (this.o.jb = t.qc(e), e += 4);
                    var h = this.Ng(t.nc(e++), t.nc(e++), t.nc(e++)),
                        l = this.Ng(t.nc(e++), t.nc(e++), t.nc(e++));
                    i.Og(h, l, n), getApp().r.$d(.5, this.o.gb.ff, n);
                    var p = this.ug(t, e);
                    e += this.vg(p);
                    for (var u in i.Jf) {
                        var c = i.Jf[u];
                        c && (c.tc = !1)
                    }
                    for (var f = 0; f < p; f++) {
                        var d = t.nc(e);
                        e++;
                        var g = t.nc(e);
                        e++;
                        var w = i.Jf[d];
                        w || (w = new Ability(d), i.Jf[d] = w), w.tc = !0, w.uc = Math.min(1, Math.max( 0, g / 100))
                    }
                    getApp().s.H.xb.yf.Xe(i.Jf)
                }, t.prototype.Bg = function(t, e) {
                    var i = this,
                        o = t.oc(e);
                    e += 2;
                    var n = this.Kg(o),
                        r = t.qc(e);
                    e += 4;
                    var s = this.ug(t, e);
                    if (e += this.vg(s), n) {
                        n.Mg(r), n.Pg(function() {
                            return i.Ng(t.nc(e++), t.nc(e++), t.nc(e++))
                        }, s), n.Qg(!0);
                        var a = this.o.N.Kf(),
                            h = n.Kf(),
                            l = Math.max( 0, 1 - Math.hypot(a.x - h.x, a.y - h.y) / (.5 * this.o.kb));
                        getApp().r.Yd(l, o)
                    } else e += 6 * s;
                    return e
                }, t.prototype.Cg = function(t, e) {
                    var i = t.oc(e);
                    e += 2;
                    var o = this.o.ib[i];
                    return o && o.Jb && o.Qg(!1), getApp().r.Zd(i), e
                }, t.prototype.wg = function(t, e) {
                    var i = new Portion.Config;
                    i.Mb = t.pc(e), e += 4, i.gg = this.o.gb.ef === GameMode.df ? t.nc(e++) : GameParams.TEAM_DEFAULT, i.Rg = this.Ng(t.nc(e++), t.nc(e++), t.nc(e++)), i.hg = t.nc(e++);
                    var o = this.o.hb[i.Mb];
                    null != o && o.Lb();
                    var n = new Portion(i, getApp().s.H.xb);
                    return n.Sg(this.Tg(i.Mb), this.Ug(i.Mb), !0), this.o.hb[i.Mb] = n, e
                }, t.prototype.xg = function(t, e) {
                    var i = t.pc(e);
                    e += 4;
                    var o = this.o.hb[i];
                    return o && (o.Vg = 0, o.Wg = 1.5 * o.Wg, o.Ob = !0), e
                }, t.prototype.yg = function(t, e) {
                    var i = t.pc(e);
                    e += 4;
                    var o = t.oc(e);
                    e += 2;
                    var n = this.o.hb[i];
                    if (n) {
                        n.Vg = 0, n.Wg = .1 * n.Wg, n.Ob = !0;
                        var r = this.Kg(o);
                        if (r && r.Ib) {
                            var s = (this.o.gb.ff, r.Kf());
                            n.Sg(s.x, s.y, !1)
                        }
                    }
                    return e
                };
                var e = [34, 29, 26, 24, 22, 20, 18, 17, 15, 14, 13, 12, 11, 10, 9, 8, 8, 7, 6, 6, 5, 5, 4, 4, 3, 3, 2, 2, 2, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 2, 2, 2, 3, 3, 4, 4, 5, 5, 6, 6, 7, 8, 8, 9, 10, 11, 12, 13, 14, 15, 17, 18, 20, 22, 24, 26, 29, 34];
                return t.prototype.qg = function(t) {
                    for (var i = getApp().q.Yg.Xg, o = i.getImageData(0, 0, 80, 80), n = e[0], r = 80 - n, s = 0, a = 0; a < 628; a++)
                        for (var h = t.nc(1 + a), l = 0; l < 8; l++) {
                            var p = 0 != (h >> l & 1),
                                u = 4 * (n + 80 * s);
                            p ? (o.data[u] = 255, o.data[u + 1] = 255, o.data[u + 2] = 255, o.data[u + 3] = 255) : o.data[u + 3] = 0, ++n >= r && ++s < 80 && (n = e[s], r = 80 - n)
                        }
                    i.putImageData(o, 0, 0);
                    var c = getApp().s.H.xb.xf.Wf;
                    c.texture = getApp().q.Yg.Ic, c.texture.update()
                }, t.prototype.sg = function(t, e) {
                    var i = t.pc(e);
                    e += 4, console.log("Wormy Error: " + i)
                }, t.prototype.tg = function(t, e) {
                    console.log("g.o"), this.o.Sb()
                }, t.prototype.rg = function(t, e) {
                    this.o.ub = t.oc(e), e += 2, this.o.O = t.oc(e), e += 2;
                    var i = new ScoreTableModel;
                    i.eg = [];
                    for (var o = t.nc(e++), n = 0; n < o; n++) {
                        var r = t.oc(e);
                        e += 2;
                        var s = t.qc(e);
                        e += 4, i.eg.push(ScoreTableModel.Zg(r, s))
                    }
                    if (i.cg = [], this.o.gb.ef === GameMode.df)
                        for (var a = t.nc(e++), h = 0; h < a; h++) {
                            var l = t.nc(e);
                            e += 1;
                            var p = t.qc(e);
                            e += 4, i.cg.push(ScoreTableModel.$g(l, p))
                        }
                    getApp().s.H.xb.zf.Xe(i)
                }, t.prototype.Kg = function(t) {
                    return t === this.o.gb.ff ? this.o.N : this.o.ib[t]
                }, t.prototype.Ng = function(t, e, i) {
                    return 1e4 * ((16777215 & (255 & i | e << 8 & 65280 | t << 16 & 16711680)) / 8388608 - 1)
                }, t.prototype.Tg = function(t) {
                    return ((65535 & t) / 32768 - 1) * this.o.gb.if()
                }, t.prototype.Ug = function(t) {
                    return ((t >> 16 & 65535) / 32768 - 1) * this.o.gb.if()
                }, t.prototype.ug = function(t, e) {
                    var i = t.nc(e);
                    if (0 == (128 & i)) return i;
                    var o = t.nc(e + 1);
                    if (0 == (128 & o)) return o | i << 7 & 16256;
                    var n = t.nc(e + 2);
                    if (0 == (128 & n)) return n | o << 7 & 16256 | i << 14 & 2080768;
                    var r = t.nc(e + 3);
                    return 0 == (128 & r) ? r | n << 7 & 16256 | o << 14 & 2080768 | i << 21 & 266338304 : void 0
                }, t.prototype.vg = function(t) {
                    return t < 128 ? 1 : t < 16384 ? 2 : t < 2097152 ? 3 : t < 268435456 ? 4 : void 0
                }, t
            }(),
            Optional = function() {
                function t(t) {
                    this._g = t
                }
                return t.ah = function() {
                    return new Optional(null)
                }, t.bh = function(t) {
                    return new Optional(t)
                }, t.prototype.ch = function() {
                    return this._g
                }, t.prototype.dh = function() {
                    return null != this._g
                }, t.prototype.eh = function(t) {
                    null != this._g && t(this._g)
                }, t
            }(),
            Portion = function() {
                function t(t, e) {
                    this.Nb = t, this.fh = t.hg >= 80, this.Pb = 0, this.Qb = 0, this.gh = 0, this.hh = 0, this.Wg = this.fh ? 1 : t.Rg, this.Vg = 1, this.Ob = !1, this.ih = 0, this.jh = 0, this.Kb = 1, this.Be = 2 * Math.PI * Math.random(), this.kh = new PortionSpriteTree, this.kh.lh(getApp().o.gb.ef, this.Nb.gg === GameParams.TEAM_DEFAULT ? null : getApp().p.Ec().fd(this.Nb.gg), getApp().p.Ec().ld(this.Nb.hg)), e.Pf(t.Mb, this.kh)
                }
                return t.prototype.Lb = function() {
                    this.kh.Sf.Tf.mh(), this.kh.Sf.Rf.mh()
                }, t.prototype.Sg = function(t, e, i) {
                    this.Pb = t, this.Qb = e, i && (this.gh = t, this.hh = e)
                }, t.prototype.Gb = function(t, e) {
                    var i = Math.min(.5, 1 * this.Wg),
                        o = Math.min(2.5, 1.5 * this.Wg);
                    this.ih = timeDeltaIncrement(this.ih, i, e, .0025), this.jh = timeDeltaIncrement(this.jh, o, e, .0025), this.Kb = timeDeltaIncrement(this.Kb, this.Vg, e, .0025)
                }, t.prototype.Hb = function(t, e, i) {
                    this.gh = timeDeltaIncrement(this.gh, this.Pb, e, .0025), this.hh = timeDeltaIncrement(this.hh, this.Qb, e, .0025), this.kh.Xe(this, t, e, i)
                }, t.Config = function() {
                    function t() {
                        this.Mb = 0, this.gg = GameParams.TEAM_DEFAULT, this.Rg = 0, this.hg = 0
                    }
                    return t
                }(), t
            }(),
            PortionSpriteTree = function() {
                function t() {
                    this.Sf = new o(new WMSprite, new WMSprite), this.Sf.Tf.nh.blendMode = POGL.jc.kc, this.Sf.Tf.nh.zIndex = i, this.Sf.Rf.nh.zIndex = e
                }
                var e = 500,
                    i = 100;
                t.prototype.lh = function(t, e, i) {
                    var o = i.$c;
                    null != o && this.Sf.Rf.oh(o);
                    var n = t == GameMode.df && null != e ? e.dd._c : i._c;
                    null != n && this.Sf.Tf.oh(n)
                }, t.prototype.Xe = function(t, e, i, o) {
                    if (!o(t.gh, t.hh)) return void this.Sf.qh();
                    var n = t.jh * (1 + .3 * Math.cos(t.Be + e / 200));
                    t.fh ? this.Sf.rh(t.gh, t.hh, 2 * t.ih, 1 * t.Kb, 1.2 * n, .8 * t.Kb) : this.Sf.rh(t.gh, t.hh, 2 * t.ih, 1 * t.Kb, 2 * n, .3 * t.Kb)
                };
                var o = function() {
                    function t(t, e) {
                        this.Rf = t, this.Tf = e
                    }
                    return t.prototype.rh = function(t, e, i, o, n, r) {
                        this.Rf.Qg(!0), this.Rf.sh(t, e), this.Rf.th(i), this.Rf.uh(o), this.Tf.Qg(!0), this.Tf.sh(t, e), this.Tf.th(n), this.Tf.uh(r)
                    }, t.prototype.qh = function() {
                        this.Rf.Qg(!1), this.Tf.Qg(!1)
                    }, t
                }();
                return t
            }(),
            PropertyManager = function() {
                function t() {
                    this.vh = 0, this.wh = 0, this.xh = 0, this.yh = 0, this.zh = 0, this.Ah = []
                }

                function e(t, e) {
                    if (!getApp().p.W()) return null;
                    var o = getApp().p.Bc();
                    if (e === PropertyType.ia) {
                        var n = i(o.skinArrayDict, t);
                        return n < 0 ? null : o.skinArrayDict[n]
                    }
                    switch (e) {
                        case PropertyType.ja:
                            return o.eyesDict[t];
                        case PropertyType.ka:
                            return o.mouthDict[t];
                        case PropertyType.la:
                            return o.glassesDict[t];
                        case PropertyType.ma:
                            return o.hatDict[t]
                    }
                    return null
                }

                function i(t, e) {
                    for (var i = 0; i < t.length; i++)
                        if (t[i].id == e) return i;
                    return -1
                }
                return t.prototype.a = function() {}, t.prototype.ha = function(t) {
                    switch (t) {
                        case PropertyType.ia:
                            return this.vh;
                        case PropertyType.ja:
                            return this.wh;
                        case PropertyType.ka:
                            return this.xh;
                        case PropertyType.la:
                            return this.yh;
                        case PropertyType.ma:
                            return this.zh
                    }
                    return 0
                }, t.prototype.Bh = function(t) {
                    this.Ah.push(t), this.Ch()
                }, t.prototype.Ja = function() {
                    if (!getApp().p.W()) return any([32, 33, 34, 35]);
                    for (var t = getApp().p.Bc(), e = [], i = 0; i < t.skinArrayDict.length; i++) {
                        var o = t.skinArrayDict[i];
                        this.Ka(o.id, PropertyType.ia) && e.push(o)
                    }
                    return 0 === e.length ? 0 : e[parseInt(e.length * Math.random())].id
                }, t.prototype.Dh = function() {
                    if (getApp().p.W) {
                        var t = getApp().p.Bc().skinArrayDict,
                            e = i(t, this.vh);
                        if (!(e < 0)) {
                            for (var o = e + 1; o < t.length; o++)
                                if (this.Ka(t[o].id, PropertyType.ia)) return this.vh = t[o].id, void this.Ch();
                            for (var n = 0; n < e; n++)
                                if (this.Ka(t[n].id, PropertyType.ia)) return this.vh = t[n].id, void this.Ch()
                        }
                    }
                }, t.prototype.Eh = function() {
                    if (getApp().p.W) {
                        var t = getApp().p.Bc().skinArrayDict,
                            e = i(t, this.vh);
                        if (!(e < 0)) {
                            for (var o = e - 1; o >= 0; o--)
                                if (this.Ka(t[o].id, PropertyType.ia)) return this.vh = t[o].id, void this.Ch();
                            for (var n = t.length - 1; n > e; n--)
                                if (this.Ka(t[n].id, PropertyType.ia)) return this.vh = t[n].id, void this.Ch()
                        }
                    }
                }, t.prototype.Fh = function(t, e) {
                    if (!getApp().p.W() || this.Ka(t, e)) switch (e) {
                        case PropertyType.ia:
                            return void(this.vh != t && (this.vh = t, this.Ch()));
                        case PropertyType.ja:
                            return void(this.wh != t && (this.wh = t, this.Ch()));
                        case PropertyType.ka:
                            return void(this.xh != t && (this.xh = t, this.Ch()));
                        case PropertyType.la:
                            return void(this.yh != t && (this.yh = t, this.Ch()));
                        case PropertyType.ma:
                            return void(this.zh != t && (this.zh = t, this.Ch()))
                    }
                }, t.prototype.Ka = function(t, i) {
                    var o = e(t, i);
                    return null != o && (getApp().u.P() ? 0 == o.price && !o.nonbuyable || getApp().u.Gh(t, i) : o.guest)
                }, t.prototype.Ch = function() {
                    for (var t = 0; t < this.Ah.length; t++) this.Ah[t]()
                }, t
            }(),
            PropertyType = function() {
                function t() {}
                return t.ia = "SKIN", t.ja = "EYES", t.ka = "MOUTH", t.la = "GLASSES", t.ma = "HAT", t
            }(),
            Region = function() {
                function t(t, e, i, o, n, r, s, a, h) {
                    this.Ic = new POGL.ac(t, new POGL.ec(e, i, o, n)), this.Hh = e, this.Ih = i, this.Jh = o, this.Kh = n, this.Lh = r || (a || o) / 2, this.Mh = s || (h || n) / 2, this.Nh = a || o, this.Oh = h || n, this.Ph = .5 - (this.Lh - .5 * this.Nh) / this.Jh, this.Qh = .5 - (this.Mh - .5 * this.Oh) / this.Kh, this.Rh = this.Jh / this.Nh, this.Sh = this.Kh / this.Oh
                }
                return t
            }(),
            ResourceManager = function() {
                function t() {
                    this.Ge = new POGL.ac(POGL._b.from("/images/bg-obstacle.png"));
                    var t = POGL._b.from("/images/confetti-saveukraine.png");
                    this.He = [new POGL.ac(t, new POGL.ec(0, 0, 256, 256)), new POGL.ac(t, new POGL.ec(0, 0, 256, 256)), new POGL.ac(t, new POGL.ec(0, 0, 256, 256)), new POGL.ac(t, new POGL.ec(0, 0, 256, 256)), new POGL.ac(t, new POGL.ec(0, 0, 256, 256)), new POGL.ac(t, new POGL.ec(0, 0, 256, 256)), new POGL.ac(t, new POGL.ec(0, 0, 256, 256)), new POGL.ac(t, new POGL.ec(0, 0, 256, 256)), new POGL.ac(t, new POGL.ec(0, 0, 256, 256)), new POGL.ac(t, new POGL.ec(0, 0, 256, 256)), new POGL.ac(t, new POGL.ec(0, 0, 256, 256)), new POGL.ac(t, new POGL.ec(0, 0, 256, 256))], this.Gf = new POGL.ac(function() {
                        var t = POGL._b.from("/images/bg-pattern-ukraine2-pow2-ARENA.png");
                        return t.wrapMode = POGL.lc.mc, t
                    }()), this.Hf = new POGL.ac(function() {
                        var t = POGL._b.from("/images/bg-pattern-ukraine2-pow2-TEAM2.png");
                        return t.wrapMode = POGL.lc.mc, t
                    }()), this.Ef = new POGL.ac(POGL._b.from("/images/lens.png"));
                    var e = POGL._b.from("/images/wear-ability.png");
                    this.Th = new Region(e, 158, 86, 67, 124, 148, 63.5, 128, 128), this.Uh = new Region(e, 158, 4, 87, 74, 203, 63.5, 128, 128), this.Vh = new Region(e, 4, 4, 146, 146, 63.5, 63.5, 128, 128), this.Yg = function() {
                        var t = window.document.createElement("canvas");
                        return t.width = 80, t.height = 80, {
                            ue: t,
                            Xg: t.getContext("2d"),
                            Ic: new POGL.ac(POGL._b.from(t))
                        }
                    }(), this.Cd = {}, this.zd = {}, this.Wh = [], this.Xh = null
                }
                return t.prototype.a = function(t) {
                    function e() {
                        0 == --i && t()
                    }
                    var i = 4;
                    this.Cd = {}, e(), this.zd = {}, e(), this.Wh = [], e(), this.Xh = null, e()
                }, t
            }(),
            ScenesManager = function() {
                function t() {
                    this.H = new GameViewController, this.F = new MainMenuViewController, this.Yh = new WithdrawConsentViewController, this.Zh = new DeleteAccountViewController, this.$h = new CoinsViewController, this._h = new LeadersViewController, this.ai = new ProfileViewController, this.bi = new LoginViewController, this.ya = new SettingsViewController, this.ci = new SkinsViewController, this.di = new StoreViewController, this.ei = new WearViewController, this.na = new RestrictedViewController, this.aa = new ToasterContainerViewController, this.va = new LoadingViewController, this.qa = new PrerollViewController, this.fi = [], this.gi = null
                }

                function e(t, e) {
                    if (0 != e) {
                        var i = t[e];
                        arraycopy(t, 0, 1, e), t[0] = i
                    }
                }

                function i(t, e) {
                    if (e != t.length + 1) {
                        var i = t[e];
                        arraycopy(t, e + 1, e, t.length - e - 1), t[t.length - 1] = i
                    }
                }

                function o(t, e) {
                    for (var i = 0; i < t.length; i++)
                        if (t[i] == e) return i;
                    return -1
                }
                return t.prototype.a = function() {
                    this.fi = [this.H, this.F, this.Yh, this.Zh, this.$h, this._h, this.ai, this.bi, this.ya, this.ci, this.di, this.ei, this.na, this.aa, this.va, this.qa];
                    for (var t = 0; t < this.fi.length; t++) this.fi[t].a();
                    this.gi = new BackgroundView(BaseViewController.hi)
                }, t.prototype.Ra = function(t, e) {
                    for (var i = this.fi.length - 1; i >= 0; i--) this.fi[i].Qa(t, e);
                    this.fi[0] != this.H && this.fi[0] != this.qa && null != this.gi && this.gi.Qa(t, e)
                }, t.prototype.Sa = function() {
                    for (var t = this.fi.length - 1; t >= 0; t--) this.fi[t].Sa();
                    null != this.gi && this.gi.Sa()
                }, t.prototype.I = function(t) {
                    var i = o(this.fi, t);
                    if (!(i < 0)) {
                        this.fi[0].ii(), e(this.fi, i), this.ji()
                    }
                }, t.prototype.ki = function() {
                    this.fi[0].ii();
                    do {
                        i(this.fi, 0)
                    } while (this.fi[0].sc != ViewControllerType.li);
                    this.ji()
                }, t.prototype.ji = function() {
                    var t = this.fi[0];
                    t.mi(), t.ni(), this.oi()
                }, t.prototype.pi = function() {
                    return 0 != this.fi.length && (this.fi[0].sc == ViewControllerType.li && this.aa.qi())
                }, t.prototype.oi = function() {
                    this.pi() && this.I(this.aa)
                }, t
            }(),
            ScoreTableModel = function() {
                function t() {
                    this.eg = [], this.cg = []
                }
                return t.Zg = function(t, e) {
                    return {
                        fg: t,
                        M: e
                    }
                }, t.$g = function(t, e) {
                    return {
                        dg: t,
                        M: e
                    }
                }, t
            }(),
            UserManager = function() {
                function t() {
                    this.ri = [], this.si = [], this.ti = [], this.vi = !1, this.wi = e, this.xi = {}, this.yi = null
                }
                var e = "guest";
                return t.prototype.a = function() {
                    this.zi()
                }, t.prototype.X = function() {
                    return this.vi ? this.xi.userId : ""
                }, t.prototype.Ai = function() {
                    return this.vi ? this.xi.username : ""
                }, t.prototype.ga = function() {
                    return this.vi ? this.xi.nickname : ""
                }, t.prototype.Bi = function() {
                    return this.vi ? this.xi.avatarUrl : GUEST_AVATAR_URL
                }, t.prototype.Ci = function() {
                    return this.vi && this.xi.isBuyer
                }, t.prototype.Z = function() {
                    return this.vi && this.xi.isConsentGiven
                }, t.prototype.Di = function() {
                    return this.vi ? this.xi.coins : 0
                }, t.prototype.Ei = function() {
                    return this.vi ? this.xi.level : 1
                }, t.prototype.Fi = function() {
                    return this.vi ? this.xi.expOnLevel : 0
                }, t.prototype.Gi = function() {
                    return this.vi ? this.xi.expToNext : 50
                }, t.prototype.Hi = function() {
                    return this.vi ? this.xi.skinId : 0
                }, t.prototype.Ii = function() {
                    return this.vi ? this.xi.eyesId : 0
                }, t.prototype.Ji = function() {
                    return this.vi ? this.xi.mouthId : 0
                }, t.prototype.Ki = function() {
                    return this.vi ? this.xi.glassesId : 0
                }, t.prototype.Li = function() {
                    return this.vi ? this.xi.hatId : 0
                }, t.prototype.Mi = function() {
                    return this.vi ? this.xi.highScore : 0
                }, t.prototype.Ni = function() {
                    return this.vi ? this.xi.bestSurvivalTimeSec : 0
                }, t.prototype.Oi = function() {
                    return this.vi ? this.xi.kills : 0
                }, t.prototype.Pi = function() {
                    return this.vi ? this.xi.headShots : 0
                }, t.prototype.Qi = function() {
                    return this.vi ? this.xi.sessionsPlayed : 0
                }, t.prototype.Ri = function() {
                    return this.vi ? this.xi.totalPlayTimeSec : 0
                }, t.prototype.Si = function() {
                    return this.vi ? this.xi.regDate : {}
                }, t.prototype.V = function(t) {
                    this.ri.push(t), t()
                }, t.prototype.Ti = function(t) {
                    this.si.push(t), t()
                }, t.prototype.Ui = function(t) {
                    this.ti.push(t)
                }, t.prototype.Gh = function(t, e) {
                    var i = this.xi.propertyList;
                    if (!i) return !1;
                    for (var o = 0; o < i.length; o++) {
                        var n = i[o];
                        if (n.id == t && n.type === e) return !0
                    }
                    return !1
                }, t.prototype.P = function() {
                    return this.vi
                }, t.prototype.ea = function() {
                    return this.wi
                }, t.prototype.Q = function(t) {
                    var e = this;
                    this.vi && this.Vi(function(i) {
                        if (i) {
                            var o = e.Di(),
                                n = e.Ei();
                            e.xi = i, e.Wi();
                            var r = e.Di(),
                                s = e.Ei();
                            s > 1 && s != n && getApp().s.aa.Xi(new LevelUpToasterViewController(s));
                            var a = r - o;
                            a >= 20 && getApp().s.aa.Xi(new CoinsToasterViewController(a))
                        }
                        t && t()
                    })
                }, t.prototype.Vi = function(t) {
                    $.get(GATEWAY_HOST + "/pub/wuid/" + this.wi + "/getUserData", function(e) {
                        t(e.user_data)
                    })
                }, t.prototype.Yi = function(t, e, i) {
                    var o = this;
                    $.get(GATEWAY_HOST + "/pub/wuid/" + this.wi + "/buyProperty?id=" + t + "&type=" + e, function(t) {
                        1200 == t.code ? o.Q(i) : i()
                    }).fail(function() {
                        i()
                    })
                }, t.prototype.Zi = function() {
                    var t = this;
                    if (this.$i(), "undefined" == typeof FB) return void this._i();
                    FB.getLoginStatus(function(e) {
                        if ("connected" === e.status) return void(e.authResponse && e.authResponse.accessToken ? t.aj("facebook", "fb_" + e.authResponse.accessToken) : t._i());
                        FB.login(function(e) {
                            "connected" === e.status && e.authResponse && e.authResponse.accessToken ? t.aj("facebook", "fb_" + e.authResponse.accessToken) : t._i()
                        })
                    })
                }, t.prototype.bj = function() {
                    var t = this;
                    if (this.$i(), void 0 === GoogleAuth) return void this._i();
                    console.log("gsi:l"), GoogleAuth.then(function() {
                        if (console.log("gsi:then"), GoogleAuth.isSignedIn.get()) {
                            console.log("gsi:sil");
                            var e = GoogleAuth.currentUser.get();
                            return void t.aj("google", "gg_" + e.getAuthResponse().id_token)
                        }
                        GoogleAuth.signIn().then(function(e) {
                            return void 0 !== e.error ? (console.log("gsi:e: " + e.error), void t._i()) : e.isSignedIn() ? (console.log("gsi:s"), void t.aj("google", "gg_" + e.getAuthResponse().id_token)) : (console.log("gsi:c"), void t._i())
                        })
                    })
                }, t.prototype.$i = function() {
                    console.log("iSI: " + this.vi);
                    var t = this.wi,
                        i = this.yi;
                    switch (this.vi = !1, this.wi = e, this.xi = {}, this.yi = null, setCookie(Cookies.Se, "", 60), i) {
                        case "facebook":
                            this.cj();
                            break;
                        case "google":
                            this.dj()
                    }
                    t !== this.wi ? this.ej() : this.Wi()
                }, t.prototype.fj = function() {
                    console.log("dA"), this.vi && $.get(GATEWAY_HOST + "/pub/wuid/" + this.wi + "/deleteAccount", function(t) {
                        1200 === t.code ? console.log("dA: OK") : console.log("dA: NO")
                    }).fail(function() {
                        console.log("dA: FAIL")
                    })
                }, t.prototype.zi = function() {
                    console.log("rs");
                    var t = getCookie(Cookies.Se),
                        e = this;
                    "facebook" == t ? (console.log("rs:fb"), function t() {
                        "undefined" != typeof FB ? e.Zi() : setTimeout(t, 100)
                    }()) : "google" == t ? (console.log("rs:gg"), function t() {
                        void 0 !== GoogleAuth ? e.bj() : setTimeout(t, 100)
                    }()) : (console.log("rs:lo"), this.$i())
                }, t.prototype.ej = function() {
                    for (var t = 0; t < this.ri.length; t++) this.ri[t]();
                    this.Wi()
                }, t.prototype.Wi = function() {
                    for (var t = 0; t < this.si.length; t++) this.si[t]();
                    var e = this.ti;
                    this.ti = [];
                    for (var i = 0; i < e.length; i++) e[i]()
                }, t.prototype.aj = function(t, e) {
                    var i = this;
                    $.get(GATEWAY_HOST + "/pub/wuid/" + e + "/login", function(o) {
                        if (o && o.user_data) {
                            var n = this.wi;
                            i.vi = !0, i.wi = e, i.xi = o.user_data, i.yi = t, setCookie(Cookies.Se, i.yi, 60), n !== e ? i.ej() : i.Wi()
                        } else i._i()
                    }).fail(function() {
                        i._i()
                    })
                }, t.prototype._i = function() {
                    this.$i()
                }, t.prototype.cj = function() {
                    console.log("lo:fb"), FB.logout(function() {})
                }, t.prototype.dj = function() {
                    console.log("lo:gg"), GoogleAuth.signOut()
                }, t
            }(),
            WMGameBackgroundSprite = function() {
                function t() {
                    this.gj = {}, this.gj[r] = [1, .5, .25, .5], this.gj[s] = POGL.ac.WHITE, this.gj[a] = [0, 0], this.gj[h] = [0, 0];
                    var t = POGL.dc.from(u, c, this.gj);
                    this.Df = new POGL.ic(p, t)
                }
                var e = "a1_" + randStr(),
                    i = "a2_" + randStr(),
                    o = atob("dHJhbnNsYXRpb25NYXRyaXg="),
                    n = atob("cHJvamVjdGlvbk1hdHJpeA=="),
                    r = "u3_" + randStr(),
                    s = "u4_" + randStr(),
                    a = "u5_" + randStr(),
                    h = "u6_" + randStr(),
                    l = "v1_" + randStr(),
                    p = (new POGL.hc).addAttribute(e, [-.5, -.5, .5, -.5, .5, .5, -.5, -.5, .5, .5, -.5, .5], 2).addAttribute(i, [-.5, -.5, .5, -.5, .5, .5, -.5, -.5, .5, .5, -.5, .5], 2),
                    u = atob("cHJlY2lzaW9uIG1lZGl1bXAgZmxvYXQ7YXR0cmlidXRlIHZlYzIg") + e + atob("O2F0dHJpYnV0ZSB2ZWMyIA==") + i + atob("O3VuaWZvcm0gbWF0MyA=") + o + atob("O3VuaWZvcm0gbWF0MyA=") + n + atob("O3ZhcnlpbmcgdmVjMiA=") + l + atob("O3ZvaWQgbWFpbigpew==") + l + atob("PQ==") + i + atob("O2dsX1Bvc2l0aW9uPXZlYzQoKA==") + n + atob("Kg==") + o + atob("KnZlYzMo") + e + atob("LDEuMCkpLnh5LDAuMCwxLjApO30="),
                    c = atob("cHJlY2lzaW9uIGhpZ2hwIGZsb2F0O3ZhcnlpbmcgdmVjMiA=") + l + atob("O3VuaWZvcm0gdmVjNCA=") + r + atob("O3VuaWZvcm0gc2FtcGxlcjJEIA==") + s + atob("O3VuaWZvcm0gdmVjMiA=") + a + atob("O3VuaWZvcm0gdmVjMiA=") + h + atob("O3ZvaWQgbWFpbigpe3ZlYzIgY29vcmQ9") + l + atob("Kg==") + a + atob("Kw==") + h + atob("O3ZlYzQgdl9jb2xvcl9taXg9") + r + atob("O2dsX0ZyYWdDb2xvcj10ZXh0dXJlMkQo") + s + atob("LGNvb3JkKSowLjMrdl9jb2xvcl9taXguYSp2ZWM0KHZfY29sb3JfbWl4LnJnYiwwLjApO30=");
                return t.prototype.Lf = function(t, e, i, o) {
                    var n = this.gj[r];
                    n[0] = t, n[1] = e, n[2] = i, n[3] = o
                }, t.prototype.Ff = function(t) {
                    this.gj[s] = t
                }, t.prototype.Xe = function(t, e, i, o) {
                    this.Df.position.x = t, this.Df.position.y = e, this.Df.scale.x = i, this.Df.scale.y = o;
                    var n = this.gj[a];
                    n[0] = .2520615384615385 * i, n[1] = .4357063736263738 * o;
                    var r = this.gj[h];
                    r[0] = .2520615384615385 * t, r[1] = .4357063736263738 * e
                }, t
            }(),
            WMSprite = function() {
                function t() {
                    this.nh = new POGL.fc, this.hj = 0, this.ij = 0
                }
                return t.prototype.oh = function(t) {
                    this.nh.texture = t.Ic, this.nh.anchor.set(t.Ph, t.Qh), this.hj = t.Rh, this.ij = t.Sh
                }, t.prototype.th = function(t) {
                    this.nh.width = t * this.hj, this.nh.height = t * this.ij
                }, t.prototype.jj = function(t) {
                    this.nh.rotation = t
                }, t.prototype.sh = function(t, e) {
                    this.nh.position.set(t, e)
                }, t.prototype.Qg = function(t) {
                    this.nh.visible = t
                }, t.prototype.kj = function() {
                    return this.nh.visible
                }, t.prototype.uh = function(t) {
                    this.nh.alpha = t
                }, t.prototype.Qf = function() {
                    return this.nh
                }, t.prototype.mh = function() {
                    pixijs_removeFromParent(this.nh)
                }, t
            }(),
            Worm = function() {
                function t(t) {
                    this.gb = t, this.Nb = new Worm.Config, this.Ib = !1, this.Jb = !0, this.lj = !1, this.Eb = 0, this.mj = 0, this.Kb = 1, this.nj = 0, this.M = 0, this.Jf = {}, this.oj = 0, this.pj = new Float32Array(2 * e), this.qj = new Float32Array(2 * e), this.rj = new Float32Array(2 * e), this.sj = null, this.tj = null, this.uj = null, this.Ub()
                }
                var e = 200;
                return t.prototype.Lb = function() {
                    null != this.tj && pixijs_removeFromParent(this.tj.Vf), null != this.uj && pixijs_removeFromParent(this.uj)
                }, t.prototype.Ub = function() {
                    this.Mg(.25), this.Nb.bd = "", this.Jb = !0, this.Jf = {}, this.Qg(!1)
                }, t.prototype.Jg = function(t) {
                    this.Nb = t, this.vj(this.Ib)
                }, t.prototype.Qg = function(t) {
                    var e = this.Ib;
                    this.Ib = t, this.vj(e)
                }, t.prototype.Mg = function(t) {
                    this.M = 50 * t;
                    var i = t;
                    t > this.gb.gf && (i = Math.atan((t - this.gb.gf) / this.gb.hf) * this.gb.hf + this.gb.gf);
                    var o = Math.sqrt(4 * Math.pow(5 * i, .707106781186548) + 25),
                        n = Math.min( e, Math.max( 3, 5 * (o - 5) + 1)),
                        r = this.oj;
                    if (this.Eb = .025 * (5 + .9 * o), this.oj = Math.floor(n), this.mj = n - this.oj, r > 0 && r < this.oj)
                        for (var s = this.pj[2 * r - 2], a = this.pj[2 * r - 1], h = this.qj[2 * r - 2], l = this.qj[2 * r - 1], p = this.rj[2 * r - 2], u = this.rj[2 * r - 1], c = r; c < this.oj; c++) this.pj[2 * c] = s, this.pj[2 * c + 1] = a, this.qj[2 * c] = h, this.qj[2 * c + 1] = l, this.rj[2 * c] = p, this.rj[2 * c + 1] = u
                }, t.prototype.Pg = function(t, e) {
                    this.oj = e;
                    for (var i = 0; i < this.oj; i++) this.pj[2 * i] = this.qj[2 * i] = this.rj[2 * i] = t(), this.pj[2 * i + 1] = this.qj[2 * i + 1] = this.rj[2 * i + 1] = t()
                }, t.prototype.Og = function(t, e, i) {
                    this.lj = i;
                    for (var o = 0; o < this.oj; o++) this.pj[2 * o] = this.qj[2 * o], this.pj[2 * o + 1] = this.qj[2 * o + 1];
                    var n = t - this.qj[0],
                        r = e - this.qj[1];
                    this.wj(n, r, this.oj, this.qj)
                }, t.prototype.wj = function(t, e, i, o) {
                    var n = Math.hypot(t, e);
                    if (!(n <= 0)) {
                        var r = o[0],
                            s = void 0;
                        o[0] += t;
                        var a = o[1],
                            h = void 0;
                        o[1] += e;
                        for (var l = this.Eb / (this.Eb + n), p = 1 - 2 * l, u = 1, c = i - 1; u < c; u++) s = o[2 * u], o[2 * u] = o[2 * u - 2] * p + (s + r) * l, r = s, h = o[2 * u + 1], o[2 * u + 1] = o[2 * u - 1] * p + (h + a) * l, a = h;
                        l = this.mj * this.Eb / (this.mj * this.Eb + n), p = 1 - 2 * l, o[2 * i - 2] = o[2 * i - 4] * p + (o[2 * i - 2] + r) * l, o[2 * i - 1] = o[2 * i - 3] * p + (o[2 * i - 1] + a) * l
                    }
                }, t.prototype.Kf = function() {
                    return {
                        x: this.rj[0],
                        y: this.rj[1]
                    }
                }, t.prototype.Lg = function(t, e) {
                    for (var i = 1e6, o = t, n = e, r = 0; r < this.oj; r++) {
                        var s = this.rj[2 * r],
                            a = this.rj[2 * r + 1],
                            h = Math.hypot(t - s, e - a);
                        h < i && (i = h, o = s, n = a)
                    }
                    return {
                        x: o,
                        y: n,
                        distance: i
                    }
                }, t.prototype.wb = function(t) {
                    this.sj = t
                }, t.prototype.Gb = function(t, e) {
                    this.Kb = timeDeltaIncrement(this.Kb, this.Jb ? this.lj ? .9 + .1 * Math.cos(t / 400 * Math.PI) : 1 : 0, e, 1 / 800), this.nj = timeDeltaIncrement(this.nj, this.Jb ? this.lj ? 1 : 0 : 1, e, .0025), null != this.tj && (this.tj.Vf.alpha = this.Kb), null != this.uj && (this.uj.alpha = this.Kb)
                }, t.prototype.Hb = function(t, e, i, o) {
                    if (this.Ib && this.Jb)
                        for (var n = Math.pow(.11112, e / 95), r = 0; r < this.oj; r++) {
                            var s = lerp(this.pj[2 * r], this.qj[2 * r], i),
                                a = lerp(this.pj[2 * r + 1], this.qj[2 * r + 1], i);
                            this.rj[2 * r] = lerp(s, this.rj[2 * r], n), this.rj[2 * r + 1] = lerp(a, this.rj[2 * r + 1], n)
                        }
                    null != this.tj && this.Ib && this.tj.xj(this, t, e, o), null != this.uj && (this.uj.Mf.x = this.rj[0], this.uj.Mf.y = this.rj[1] - 3 * this.Eb)
                }, t.prototype.vj = function(t) {
                    this.Ib ? t || this.yj() : (null != this.tj && pixijs_removeFromParent(this.tj.Vf), null != this.uj && pixijs_removeFromParent(this.uj))
                }, t.prototype.yj = function() {
                    var t = getApp();
                    null == this.tj ? this.tj = new WormSpriteTree : pixijs_removeFromParent(this.tj.Vf), this.tj.lh(t.o.gb.ef, t.p.Ec().fd(this.Nb.gg), t.p.Ec().ed(this.Nb.hg), t.p.Ec().gd(this.Nb.Fg), t.p.Ec().hd(this.Nb.Gg), t.p.Ec().jd(this.Nb.Hg), t.p.Ec().kd(this.Nb.Ig)), null == this.uj ? (this.uj = new WormLabelNode(""), this.uj.style.fontFamily = "PTSans", this.uj.anchor.set(.5)) : pixijs_removeFromParent(this.uj), this.uj.style.fontSize = 14, this.uj.style.fill = t.p.Ec().ed(this.Nb.hg).ad, this.uj.text = this.Nb.bd, this.sj.Uf(this.Nb.Mb, this.tj, this.uj)
                }, t.Config = function() {
                    function t() {
                        this.Mb = 0, this.gg = GameParams.TEAM_DEFAULT, this.hg = 0, this.Fg = 0, this.Gg = 0, this.Hg = 0, this.Ig = 0, this.bd = ""
                    }
                    return t
                }(), t
            }(),
            WormLabelNode = function() {
                return extend(POGL.gc, function(t, e, i) {
                    POGL.gc.call(this, t, e, i), this.Mf = {
                        x: 0,
                        y: 0
                    }
                })
            }(),
            WormSpriteTree = function() {
                function t() {
                    this.Vf = new POGL.$b, this.Vf.sortableChildren = !0, this.zj = new v, this.zj.zIndex = e * (2 * (i + 1) + 1 + 3), this.Aj = 0, this.Bj = new Array(i), this.Bj[0] = this.Cj(0, new WMSprite, new WMSprite);
                    for (var t = 1; t < i; t++) this.Bj[t] = this.Cj(t, new WMSprite, new WMSprite);
                    this.Dj = 0, this.Ej = 0, this.Fj = 0
                }
                var e = .001,
                    i = 797,
                    o = .1 * Math.PI,
                    n = -.06640625,
                    r = .84375,
                    s = .2578125,
                    a = -.03515625,
                    h = -.0625,
                    l = .5625,
                    p = 3 * n + r,
                    u = s - 3 * n,
                    c = n + a,
                    f = .375,
                    d = .75,
                    g = h + h,
                    w = 3 * a + s,
                    y = r - 3 * a,
                    k = a + n;
                t.prototype.Cj = function(t, o, n) {
                    var r = new b(o, n);
                    return o.nh.zIndex = e * (2 * (i - t) + 1 + 3), n.nh.zIndex = e * (2 * (i - t) - 2 + 3), r
                }, t.prototype.lh = function(t, e, i, o, n, r, s) {
                    var a = i.$c,
                        h = t == GameMode.df ? e.cd._c : i._c;
                    if (a.length > 0 && h.length > 0)
                        for (var l = 0; l < this.Bj.length; l++) this.Bj[l].Rf.oh(a[l % a.length]), this.Bj[l].Tf.oh(h[l % h.length]);
                    this.zj.lh(o, n, r, s)
                };
                var v = function() {
                    var t = extend(POGL.$b, function() {
                        POGL.$b.call(this), this.sortableChildren = !0, this.Gj = [], this.Hj = [], this.Ij = [], this.Jj = [], this.Kj = new POGL.$b, this.Lj = [];
                        for (var t = 0; t < 4; t++) {
                            var e = new WMSprite;
                            e.oh(getApp().q.Th), this.Kj.addChild(e.nh), this.Lj.push(e)
                        }
                        this.Kj.zIndex = .0011, this.addChild(this.Kj), this.Mj(), this.Nj = new WMSprite, this.Nj.oh(getApp().q.Uh), this.Nj.nh.zIndex = .001, this.addChild(this.Nj.nh), this.Oj()
                    });
                    return t.prototype.lh = function(t, e, i, o) {
                        this.Pj(.002, this.Gj, t.$c), this.Pj(.003, this.Hj, e.$c), this.Pj(.004, this.Jj, o.$c), this.Pj(.005, this.Ij, i.$c)
                    }, t.prototype.Pj = function(t, e, i) {
                        for (; i.length > e.length;) {
                            var o = new WMSprite;
                            e.push(o), this.addChild(o.Qf())
                        }
                        for (; i.length < e.length;) {
                            e.pop().mh()
                        }
                        for (var n = t, r = 0; r < i.length; r++) {
                            n += 1e-4;
                            var s = e[r];
                            s.oh(i[r]), s.nh.zIndex = n
                        }
                    }, t.prototype.rh = function(t, e, i, o) {
                        this.visible = !0, this.position.set(t, e), this.rotation = o;
                        for (var n = 0; n < this.Gj.length; n++) this.Gj[n].th(i);
                        for (var r = 0; r < this.Hj.length; r++) this.Hj[r].th(i);
                        for (var s = 0; s < this.Ij.length; s++) this.Ij[s].th(i);
                        for (var a = 0; a < this.Jj.length; a++) this.Jj[a].th(i)
                    }, t.prototype.qh = function() {
                        this.visible = !1
                    }, t.prototype.Qj = function(t, e, i, o) {
                        this.Kj.visible = !0;
                        for (var n = i / 1e3, r = 1 / this.Lj.length, s = 0; s < this.Lj.length; s++) {
                            var a = 1 - (n + r * s) % 1;
                            this.Lj[s].nh.alpha = 1 - a, this.Lj[s].th(e * (.5 + 4.5 * a))
                        }
                    }, t.prototype.Mj = function() {
                        this.Kj.visible = !1
                    }, t.prototype.Rj = function(t, e, i, o) {
                        this.Nj.nh.visible = !0, this.Nj.nh.alpha = timeDeltaIncrement(this.Nj.nh.alpha, t.lj ? .9 : .2, o, .0025), this.Nj.th(e)
                    }, t.prototype.Oj = function() {
                        this.Nj.nh.visible = !1
                    }, t
                }();
                t.prototype.Sj = function(t) {
                    return this.Ej + this.Fj * Math.sin(t * o - this.Dj)
                }, t.prototype.xj = function(t, e, i, o) {
                    var v = 2 * t.Eb,
                        m = t.rj,
                        C = t.oj,
                        P = 4 * C - 3,
                        B = P;
                    this.Dj = e / 400 * Math.PI, this.Ej = 1.5 * v, this.Fj = .15 * v * t.nj;
                    var j = void 0,
                        V = void 0,
                        A = void 0,
                        T = void 0,
                        M = void 0,
                        x = void 0,
                        O = void 0,
                        I = void 0;
                    if (V = m[0], x = m[1], o(V, x)) {
                        A = m[2], O = m[3], T = m[4], I = m[5];
                        var S = Math.atan2(I + 2 * x - 3 * O, T + 2 * V - 3 * A);
                        this.zj.rh(V, x, v, S), this.Bj[0].rh(V, x, v, this.Sj(0), S), this.Bj[1].rh(p * V + u * A + c * T, p * x + u * O + c * I, v, this.Sj(1), b.angleBetween(this.Bj[0], this.Bj[2])), this.Bj[2].rh(f * V + d * A + g * T, f * x + d * O + g * I, v, this.Sj(2), b.angleBetween(this.Bj[1], this.Bj[3])), this.Bj[3].rh(w * V + y * A + k * T, w * x + y * O + k * I, v, this.Sj(3), b.angleBetween(this.Bj[2], this.Bj[4]))
                    } else this.zj.qh(), this.Bj[0].qh(), this.Bj[1].qh(), this.Bj[2].qh(), this.Bj[3].qh();
                    for (var L = 4, D = 2, _ = 2 * C - 4; D < _; D += 2) V = m[D], x = m[D + 1], o(V, x) ? (j = m[D - 2], M = m[D - 1], A = m[D + 2], O = m[D + 3], T = m[D + 4], I = m[D + 5], this.Bj[L].rh(V, x, v, this.Sj(L), b.angleBetween(this.Bj[L - 1], this.Bj[L + 1])), L++, this.Bj[L].rh(n * j + r * V + s * A + a * T, n * M + r * x + s * O + a * I, v, this.Sj(L), b.angleBetween(this.Bj[L - 1], this.Bj[L + 1])), L++, this.Bj[L].rh(h * j + l * V + l * A + h * T, h * M + l * x + l * O + h * I, v, this.Sj(L), b.angleBetween(this.Bj[L - 1], this.Bj[L + 1])), L++, this.Bj[L].rh(a * j + s * V + r * A + n * T, a * M + s * x + r * O + n * I, v, this.Sj(L), b.angleBetween(this.Bj[L - 1], this.Bj[L + 1])), L++) : (this.Bj[L].qh(), L++, this.Bj[L].qh(), L++, this.Bj[L].qh(), L++, this.Bj[L].qh(), L++);
                    for (V = m[2 * C - 4], x = m[2 * C - 3], o(V, x) ? (j = m[2 * C - 6], M = m[2 * C - 5], A = m[2 * C - 2], O = m[2 * C - 1], this.Bj[P - 5].rh(V, x, v, this.Sj(P - 5), b.angleBetween(this.Bj[P - 6], this.Bj[P - 4])), this.Bj[P - 4].rh(k * j + y * V + w * A, k * M + y * x + w * O, v, this.Sj(P - 4), b.angleBetween(this.Bj[P - 5], this.Bj[P - 3])), this.Bj[P - 3].rh(g * j + d * V + f * A, g * M + d * x + f * O, v, this.Sj(P - 3), b.angleBetween(this.Bj[P - 4], this.Bj[P - 2])), this.Bj[P - 2].rh(c * j + u * V + p * A, c * M + u * x + p * O, v, this.Sj(P - 2), b.angleBetween(this.Bj[P - 3], this.Bj[P - 1])), this.Bj[P - 1].rh(A, O, v, this.Sj(P - 1), b.angleBetween(this.Bj[P - 2], this.Bj[P - 1]))) : (this.Bj[P - 5].qh(), this.Bj[P - 4].qh(), this.Bj[P - 3].qh(), this.Bj[P - 2].qh(), this.Bj[P - 1].qh()), 0 == this.Aj && B > 0 && this.Vf.addChild(this.zj), this.Aj > 0 && 0 == B && pixijs_removeFromParent(this.zj); this.Aj < B;) this.Vf.addChild(this.Bj[this.Aj].Rf.Qf()), this.Vf.addChild(this.Bj[this.Aj].Tf.Qf()), this.Aj += 1;
                    for (; this.Aj > B;) this.Aj -= 1, this.Bj[this.Aj].Tf.mh(), this.Bj[this.Aj].Rf.mh();
                    var $ = t.Jf[Ability.MAGNETIC_TYPE];
                    this.Bj[0].kj() && null != $ && $.tc ? this.zj.Qj(t, v, e, i) : this.zj.Mj();
                    var G = t.Jf[Ability.VELOCITY_TYPE];
                    this.Bj[0].kj() && null != G && G.tc ? this.zj.Rj(t, e, i) : this.zj.Oj()
                };
                var b = function() {
                    function t(t, e) {
                        this.Rf = t, this.Rf.Qg(!1), this.Tf = e, this.Tf.Qg(!1)
                    }
                    return t.prototype.rh = function(t, e, i, o, n) {
                        this.Rf.Qg(!0), this.Rf.sh(t, e), this.Rf.th(i), this.Rf.jj(n), this.Tf.Qg(!0), this.Tf.sh(t, e), this.Tf.th(o), this.Tf.jj(n)
                    }, t.prototype.qh = function() {
                        this.Rf.Qg(!1), this.Tf.Qg(!1)
                    }, t.prototype.kj = function() {
                        return this.Rf.kj()
                    }, t.angleBetween = function(t, e) {
                        return Math.atan2(t.Rf.nh.position.y - e.Rf.nh.position.y, t.Rf.nh.position.x - e.Rf.nh.position.x)
                    }, t
                }();
                return t
            }(),
            WormView = function() {
                function t(t) {
                    this.te = t, this.ue = t.get()[0], this.ve = new POGL.bc({
                        view: this.ue,
                        transparent: !0
                    }), this.tc = !1, this.Tj = new WormSpriteTree, this.Tj.Vf.addChild(this.Tj.zj), this.Uj = 0, this.Vj = 0, this.Rg = 1, this.vh = 0, this.wh = 0, this.xh = 0, this.yh = 0, this.zh = 0, this.Wj = !1, this.Xj = !1, this.Yj = !1, this.Zj = !1, this.$j = !1, this._j = !1, this.ak = !1, this.bk = !1, this.ck = !1, this.dk = !1, this.Sa(), this.Gb();
                    var e = this;
                    getApp().p.ca(function() {
                        getApp().p.W() && e.Gb()
                    })
                }
                return t.prototype.Gb = function() {
                    var t = getApp();
                    this.Tj.lh(GameMode.cf, null, t.p.Ec().ed(this.vh), t.p.Ec().gd(this.wh), t.p.Ec().hd(this.xh), t.p.Ec().jd(this.yh), t.p.Ec().kd(this.zh))
                }, t.prototype.Pe = function(t) {
                    this.tc = t
                }, t.prototype.ek = function(t, e, i) {
                    this.vh = t, this.Wj = e, this._j = i, this.Gb()
                }, t.prototype.fk = function(t, e, i) {
                    this.wh = t, this.Xj = e, this.ak = i, this.Gb()
                }, t.prototype.gk = function(t, e, i) {
                    this.xh = t, this.Yj = e, this.bk = i, this.Gb()
                }, t.prototype.hk = function(t, e, i) {
                    this.yh = t, this.Zj = e, this.ck = i, this.Gb()
                }, t.prototype.ik = function(t, e, i) {
                    this.zh = t, this.$j = e, this.dk = i, this.Gb()
                }, t.prototype.Sa = function() {
                    var t = window.devicePixelRatio ? window.devicePixelRatio : 1;
                    this.Uj = this.te.width(), this.Vj = this.te.height(), this.ve.resize(this.Uj, this.Vj), this.ve.resolution = t, this.ue.width = t * this.Uj, this.ue.height = t * this.Vj, this.Rg = this.Vj / 4;
                    var e = minmax(1, this.Tj.Bj.length, 2 * Math.floor(this.Uj / this.Rg) - 5);
                    if (this.Tj.Aj != e) {
                        for (var i = e; i < this.Tj.Bj.length; i++) this.Tj.Bj[i].qh();
                        for (; this.Tj.Aj < e;) this.Tj.Vf.addChild(this.Tj.Bj[this.Tj.Aj].Rf.Qf()), this.Tj.Vf.addChild(this.Tj.Bj[this.Tj.Aj].Tf.Qf()), this.Tj.Aj += 1;
                        for (; this.Tj.Aj > e;) this.Tj.Aj -= 1, this.Tj.Bj[this.Tj.Aj].Tf.mh(), this.Tj.Bj[this.Tj.Aj].Rf.mh()
                    }
                }, t.prototype.Qa = function() {
                    if (this.tc) {
                        if (getApp().p.W) {
                            for (var t = Date.now(), e = t / 200, i = Math.sin(e), o = this.Rg, n = 1.5 * this.Rg, r = this.Uj - .5 * (this.Uj - .5 * o * (this.Tj.Aj - 1)), s = .5 * this.Vj, a = 0, h = 0, l = -1; l < this.Tj.Aj; l++) {
                                var p = l,
                                    u = Math.cos(1 * p / 12 * Math.PI - e) * (1 - Math.pow(16, -1 * p / 12));
                                if (l >= 0) {
                                    var c = r + -.5 * o * p,
                                        f = s + .5 * o * u,
                                        d = 2 * o,
                                        g = 2 * n,
                                        w = Math.atan2(h - u, p - a);
                                    0 == l && this.Tj.zj.rh(c, f, d, w), this.Tj.Bj[l].rh(c, f, d, g, w);
                                    var y = this.Wj ? this._j ? .4 + .2 * i : .9 + .1 * i : this._j ? .4 : 1;
                                    this.Tj.Bj[l].Rf.uh(y), this.Tj.Bj[l].Tf.uh(y)
                                }
                                a = p, h = u
                            }
                            for (var k = 0; k < this.Tj.zj.Gj.length; k++) {
                                var v = this.Xj ? this.ak ? .4 + .2 * i : .9 + .1 * i : this.ak ? .4 : 1;
                                this.Tj.zj.Gj[k].uh(v)
                            }
                            for (var b = 0; b < this.Tj.zj.Hj.length; b++) {
                                var m = this.Yj ? this.bk ? .4 + .2 * i : .9 + .1 * i : this.bk ? .4 : 1;
                                this.Tj.zj.Hj[b].uh(m)
                            }
                            for (var C = 0; C < this.Tj.zj.Ij.length; C++) {
                                var P = this.Zj ? this.ck ? .4 + .2 * i : .9 + .1 * i : this.ck ? .4 : 1;
                                this.Tj.zj.Ij[C].uh(P)
                            }
                            for (var B = 0; B < this.Tj.zj.Jj.length; B++) {
                                var j = this.$j ? this.dk ? .4 + .2 * i : .9 + .1 * i : this.dk ? .4 : 1;
                                this.Tj.zj.Jj[B].uh(j)
                            }
                            this.ve.render(this.Tj.Vf)
                        }
                    }
                }, t
            }(),
            BaseViewController = function() {
                function t(t) {
                    this.sc = t
                }
                return t.jk = $("#game-view"), t.kk = $("#results-view"), t.lk = $("#main-menu-view"), t.mk = $("#popup-view"), t.nk = $("#toaster-view"), t.ok = $("#loading-view"), t.pk = $("#restricted-view"), t.qk = $("#stretch-box"), t.rk = $("#game-canvas"), t.hi = $("#background-canvas"), t.sk = $("#social-buttons"), t.tk = $("#markup-wrap"), t.prototype.a = function() {}, t.prototype.mi = function() {}, t.prototype.ni = function() {}, t.prototype.ii = function() {}, t.prototype.Sa = function() {}, t.prototype.Qa = function(t, e) {}, t
            }(),
            GameViewController = function() {
                function t(t, e, i, o, n, r) {
                    var s = '<div><svg xmlns="http://www.w3.org/2000/svg" version="1.1" x="0" y="0" viewBox="0 0 456 456" xml:space="preserve"><rect x="0" y="0" width="456" height="456" fill="#F7941D"/><path d="M242.7 456V279.7h-59.3v-71.9h59.3v-60.4c0-43.9 35.6-79.5 79.5-79.5h62v64.6h-44.4c-13.9 0-25.3 11.3-25.3 25.3v50h68.5l-9.5 71.9h-59.1V456z" fill="#fff"/></svg><span>' + t + "</span></div>",
                        a = $(s);
                    return a.click(function() {
                        "undefined" != typeof FB && void 0 !== FB.ui && FB.ui({
                            method: "feed",
                            display: "popup",
                            link: e,
                            name: i,
                            caption: o,
                            description: n,
                            picture: r
                        }, function() {})
                    }), a
                }
                var e = $("#final-caption"),
                    i = $("#final-continue"),
                    o = $("#congrats-bg"),
                    n = $("#unl6wj4czdl84o9b"),
                    r = ($("#congrats"), $("#final-share-fb")),
                    s = $("#final-message"),
                    a = $("#final-score"),
                    h = $("#final-place"),
                    l = $("#final-board"),
                    p = extend(BaseViewController, function() {
                        BaseViewController.call(this, ViewControllerType.uk);
                        var t = this,
                            o = getApp(),
                            n = BaseViewController.rk.get()[0];
                        console.log("sSE=" + env.vk), r.toggle(env.vk), e.text(i18n("index.game.result.title")), i.text(i18n("index.game.result.continue")), i.click(function() {
                            o.r.Dd(), o.f.Na.c(), o.r.G(AudioManager.AudioState.F), o.s.I(o.s.F)
                        }), $("html").keydown(function(e) {
                            32 == e.keyCode && (t.wk = !0)
                        }).keyup(function(e) {
                            32 == e.keyCode && (t.wk = !1)
                        }), n.addEventListener("touchmove", function(e) {
                            (e = e || window.event) && (e = e.touches[0], void 0 !== e.clientX ? t.xk = Math.atan2(e.clientY - .5 * n.offsetHeight, e.clientX - .5 * n.offsetWidth) : t.xk = Math.atan2(e.pageY - .5 * n.offsetHeight, e.pageX - .5 * n.offsetWidth))
                        }, !0), n.addEventListener("touchstart", function(e) {
                            (e = e || window.event) && (t.wk = e.touches.length >= 2), e.preventDefault()
                        }, !0), n.addEventListener("touchend", function(e) {
                            (e = e || window.event) && (t.wk = e.touches.length >= 2)
                        }, !0), n.addEventListener("mousemove", function(e) {
                            (e = e || window.event && void 0 !== e.clientX) && (t.xk = Math.atan2(e.clientY - .5 * n.offsetHeight, e.clientX - .5 * n.offsetWidth))
                        }, !0), n.addEventListener("mousedown", function(e) {
                            t.wk = !0
                        }, !0), n.addEventListener("mouseup", function(e) {
                            t.wk = !1
                        }, !0), this.xb = new GameView(BaseViewController.rk), this.db = u.J, this.xk = 0, this.wk = !1
                    });
                p.prototype.a = function() {}, p.prototype.mi = function() {
                    this.db == u.J ? (BaseViewController.jk.stop(), BaseViewController.jk.fadeIn(500), BaseViewController.kk.stop(), BaseViewController.kk.fadeOut(1), BaseViewController.lk.stop(), BaseViewController.lk.fadeOut(50), BaseViewController.mk.stop(), BaseViewController.mk.fadeOut(50), BaseViewController.nk.stop(), BaseViewController.nk.fadeOut(50), BaseViewController.ok.stop(), BaseViewController.ok.fadeOut(50), BaseViewController.pk.stop(), BaseViewController.pk.fadeOut(50), BaseViewController.qk.stop(), BaseViewController.qk.fadeOut(1), BaseViewController.hi.stop(), BaseViewController.hi.fadeOut(50), BackgroundView.Pe(!1), BaseViewController.sk.stop(), BaseViewController.sk.fadeOut(50), BaseViewController.tk.stop(), BaseViewController.tk.fadeOut(50)) : (BaseViewController.jk.stop(), BaseViewController.jk.fadeIn(500), BaseViewController.kk.stop(), BaseViewController.kk.fadeIn(500), BaseViewController.lk.stop(), BaseViewController.lk.fadeOut(50), BaseViewController.mk.stop(), BaseViewController.mk.fadeOut(50), BaseViewController.nk.stop(), BaseViewController.nk.fadeOut(50), BaseViewController.ok.stop(), BaseViewController.ok.fadeOut(50), BaseViewController.pk.stop(), BaseViewController.pk.fadeOut(50), BaseViewController.qk.stop(), BaseViewController.qk.fadeOut(1), BaseViewController.hi.stop(), BaseViewController.hi.fadeOut(50), BackgroundView.Pe(!1), BaseViewController.sk.stop(), BaseViewController.sk.fadeOut(50), BaseViewController.tk.stop(), BaseViewController.tk.fadeOut(50))
                }, p.prototype.J = function() {
                    return this.db = u.J, this
                }, p.prototype.Ga = function() {
                    console.log("re");
                    return o.hide(), setTimeout(function() {
                        console.log("fi_bg"), o.fadeIn(500)
                    }, 3e3), n.hide(), setTimeout(function() {
                        console.log("fi_aw"), n.fadeIn(500)
                    }, 500), this.db = u.Ga, this
                }, p.prototype.ni = function() {
                    this.wk = !1, this.xb.Sa(), this.db == u.Ga && getApp().r.Hd()
                }, p.prototype.Sa = function() {
                    this.xb.Sa()
                }, p.prototype.Qa = function(t, e) {
                    this.xb.Qa(t, e)
                }, p.prototype.Ea = function(e, i, o) {
                    var n = void 0,
                        p = void 0,
                        u = void 0;
                    if (i >= 1 && i <= 10 ? (n = i18n("index.game.result.place.i" + i), p = i18n("index.game.result.placeInBoard"), u = i18n("index.game.social.shareResult.messGood").replace("{0}", o).replace("{1}", e).replace("{2}", n)) : (n = "", p = i18n("index.game.result.tryHit"), u = i18n("index.game.social.shareResult.messNorm").replace("{0}", o).replace("{1}", e)), s.html(i18n("index.game.result.your")), a.html(e), h.html(n), l.html(p), env.vk) {
                        var c = i18n("index.game.result.share");
                        i18n("index.game.social.shareResult.caption");
                        r.empty().append(t(c, "https://wormate.io", "wormate.io", u, u, "https://wormate.io/images/og-share-img-new.jpg"))
                    }
                }, p.prototype.T = function() {
                    return this.xk
                }, p.prototype.U = function() {
                    return this.wk
                };
                var u = {
                    J: 0,
                    Ga: 1
                };
                return p
            }(),
            LoadingViewController = function() {
                var t = $("#loading-worm-a"),
                    e = $("#loading-worm-b"),
                    i = $("#loading-worm-c"),
                    o = ["100% 100%", "100% 200%", "200% 100%", "200% 200%"],
                    n = extend(BaseViewController, function() {
                        BaseViewController.call(this, ViewControllerType.uk)
                    });
                return n.prototype.a = function() {}, n.prototype.mi = function() {
                    BaseViewController.jk.stop(), BaseViewController.jk.fadeOut(50), BaseViewController.kk.stop(), BaseViewController.kk.fadeOut(50), BaseViewController.lk.stop(), BaseViewController.lk.fadeOut(50), BaseViewController.mk.stop(), BaseViewController.mk.fadeOut(50), BaseViewController.nk.stop(), BaseViewController.nk.fadeOut(50), BaseViewController.ok.stop(), BaseViewController.ok.fadeIn(500), BaseViewController.pk.stop(), BaseViewController.pk.fadeOut(50), BaseViewController.qk.stop(), BaseViewController.qk.fadeIn(1), BaseViewController.hi.stop(), BaseViewController.hi.fadeIn(500), BackgroundView.Pe(!0), BaseViewController.sk.stop(), BaseViewController.sk.fadeOut(50), BaseViewController.tk.stop(), BaseViewController.tk.fadeOut(50)
                }, n.prototype.ni = function() {
                    this.yk()
                }, n.prototype.yk = function() {
                    t.css("background-position", "100% 200%");
                    for (var n = 0; n < o.length; n++) {
                        var r = Math.floor(Math.random() * o.length),
                            s = o[n];
                        o[n] = o[r], o[r] = s
                    }
                    t.css("background-position", o[0]), e.css("background-position", o[1]), i.css("background-position", o[2])
                }, n
            }(),
            MainMenuViewController = function() {
                var t = ($("#mm-event-text"), $("#mm-skin-canv")),
                    e = $("#mm-skin-prev"),
                    i = $("#mm-skin-next"),
                    o = $("#mm-skin-over"),
                    n = $("#mm-skin-over-button-list"),
                    r = $("#mm-params-nickname"),
                    s = $("#mm-params-game-mode"),
                    a = $("#mm-action-buttons"),
                    h = $("#mm-action-play"),
                    l = $("#mm-action-guest"),
                    p = $("#mm-action-login"),
                    u = $("#mm-player-info"),
                    c = $("#mm-store"),
                    f = $("#mm-leaders"),
                    d = $("#mm-settings"),
                    g = $("#mm-coins-box"),
                    w = $("#mm-player-avatar"),
                    y = $("#mm-player-username"),
                    k = $("#mm-coins-val"),
                    v = $("#mm-player-exp-bar"),
                    b = $("#mm-player-exp-val"),
                    m = $("#mm-player-level"),
                    C = extend(BaseViewController, function() {
                        BaseViewController.call(this, ViewControllerType.li);
                        var o = getApp();
                        this.zk = new WormView(t), s.click(function() {
                            o.r.Dd()
                        }), t.click(function() {
                            o.u.P() && (o.r.Dd(), o.s.I(o.s.ci))
                        }), e.click(function() {
                            o.r.Dd(), o.t.Eh()
                        }), i.click(function() {
                            o.r.Dd(), o.t.Dh()
                        }), r.keypress(function(t) {
                            13 == t.keyCode && o.oa()
                        }), h.click(function() {
                            o.r.Dd(), o.oa()
                        }), l.click(function() {
                            o.r.Dd(), o.oa()
                        }), p.click(function() {
                            o.r.Dd(), o.s.I(o.s.bi)
                        }), d.click(function() {
                            o.r.Dd(), o.s.I(o.s.ya)
                        }), u.click(function() {
                            o.u.P() && (o.r.Dd(), o.s.I(o.s.ai))
                        }), f.click(function() {
                            o.u.P() && (o.r.Dd(), o.s.I(o.s._h))
                        }), c.click(function() {
                            o.u.P() && (o.r.Dd(), o.s.I(o.s.di))
                        }), g.click(function() {
                            o.u.P() && (o.r.Dd(), o.s.I(o.s.$h))
                        }), this.Ak(), this.Bk();
                        var n = getCookie(Cookies.wa);
                        "ARENA" != n && "TEAM2" != n && (n = "ARENA"), s.val(n), console.log("Load GM: " + n)
                    });
                return C.prototype.a = function() {
                    var t = getApp(),
                        e = this;
                    t.u.V(function() {
                        t.s.F.Ck()
                    }), t.u.Ti(function() {
                        t.u.P() ? (t.t.Fh(t.u.Hi(), PropertyType.ia), t.t.Fh(t.u.Ii(), PropertyType.ja), t.t.Fh(t.u.Ji(), PropertyType.ka), t.t.Fh(t.u.Ki(), PropertyType.la), t.t.Fh(t.u.Li(), PropertyType.ma)) : (t.t.Fh(t.Ha(), PropertyType.ia), t.t.Fh(0, PropertyType.ja), t.t.Fh(0, PropertyType.ka), t.t.Fh(0, PropertyType.la), t.t.Fh(0, PropertyType.ma))
                    }), t.u.Ti(function() {
                        h.toggle(t.u.P()), p.toggle(!t.u.P()), l.toggle(!t.u.P()), f.toggle(t.u.P()), c.toggle(t.u.P()), g.toggle(t.u.P()), t.u.P() ? (o.hide(), y.html(t.u.Ai()), w.attr("src", t.u.Bi()), k.html(t.u.Di()), v.width(100 * t.u.Fi() / t.u.Gi() + "%"), b.html(t.u.Fi() + " / " + t.u.Gi()), m.html(t.u.Ei()), r.val(t.u.ga())) : (o.toggle(env.vk && !t.Ia()), y.html(y.data("guest")), w.attr("src", GUEST_AVATAR_URL), k.html("10"), v.width("0"), b.html(""), m.html(1), r.val(getCookie(Cookies.Ba)))
                    }), t.t.Bh(function() {
                        e.zk.ek(t.t.ha(PropertyType.ia), !1, !1), e.zk.fk(t.t.ha(PropertyType.ja), !1, !1), e.zk.gk(t.t.ha(PropertyType.ka), !1, !1), e.zk.hk(t.t.ha(PropertyType.la), !1, !1), e.zk.ik(t.t.ha(PropertyType.ma), !1, !1)
                    })
                }, C.prototype.mi = function() {
                    BaseViewController.jk.stop(), BaseViewController.jk.fadeOut(50), BaseViewController.kk.stop(), BaseViewController.kk.fadeOut(50), BaseViewController.lk.stop(), BaseViewController.lk.fadeIn(500), BaseViewController.mk.stop(), BaseViewController.mk.fadeOut(50), BaseViewController.nk.stop(), BaseViewController.nk.fadeOut(50), BaseViewController.ok.stop(), BaseViewController.ok.fadeOut(50), BaseViewController.pk.stop(), BaseViewController.pk.fadeOut(50), BaseViewController.qk.stop(), BaseViewController.qk.fadeIn(1), BaseViewController.hi.stop(), BaseViewController.hi.fadeIn(500), BackgroundView.Pe(!0), BaseViewController.sk.stop(), BaseViewController.sk.fadeIn(500), BaseViewController.tk.stop(), BaseViewController.tk.fadeIn(500)
                }, C.prototype.ni = function() {
                    getApp().r.Ed(), this.zk.Pe(!0)
                }, C.prototype.ii = function() {
                    this.zk.Pe(!1)
                }, C.prototype.Sa = function() {
                    this.zk.Sa()
                }, C.prototype.Qa = function(t, e) {
                    this.zk.Qa()
                }, C.prototype.ga = function() {
                    return r.val()
                }, C.prototype.D = function() {
                    return s.val()
                }, C.prototype.Ck = function() {
                    a.show()
                }, C.prototype.Ak = function() {
                    var t = $("#mm-advice-cont").children(),
                        e = 0;
                    setInterval(function() {
                        t.eq(e).fadeOut(500, function() {
                            ++e >= t.length && (e = 0), t.eq(e).fadeIn(500).css("display", "inline-block")
                        })
                    }, 3e3)
                }, C.prototype.Bk = function() {
                    function t() {
                        e.La(!0), setTimeout(function() {
                            o.hide()
                        }, 3e3)
                    }
                    var e = getApp();
                    if (env.vk && !e.Ia()) {
                        o.show();
                        var i = i18n("index.game.main.menu.unlockSkins.share"),
                            r = encodeURIComponent(i18n("index.game.main.menu.unlockSkins.comeAndPlay") + " https://wormate.io/ #wormate #wormateio"),
                            s = encodeURIComponent(i18n("index.game.main.menu.unlockSkins.comeAndPlay"));
                        n.append($('<a class="mm-skin-over-button" id="mm-skin-over-tw" target="_blank" href="http://twitter.com/intent/tweet?status=' + r + '"><img src="data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZlcnNpb249IjEuMSIgd2lkdGg9IjQ1NiIgaGVpZ2h0PSI0NTYiIHhtbDpzcGFjZT0icHJlc2VydmUiPjxwYXRoIGQ9Ik02MCAzMzhjMzAgMTkgNjYgMzAgMTA1IDMwIDEwOCAwIDE5Ni04OCAxOTYtMTk2IDAtMyAwLTUgMC04IDQtMyAyOC0yMyAzNC0zNSAwIDAtMjAgOC0zOSAxMCAwIDAgMCAwIDAgMCAwIDAgMCAwIDAgMCAyLTEgMjctMTggMzAtMzggMCAwLTE0IDctMzMgMTQgLTMgMS03IDItMTAgMyAtMTMtMTMtMzAtMjItNTAtMjIgLTM4IDAtNjkgMzEtNjkgNjkgMCA1IDEgMTEgMiAxNiAtNSAwLTg2LTUtMTQxLTcxIDAgMC0zMyA0NSAyMCA5MSAwIDAtMTYtMS0zMC05IDAgMC01IDU0IDU0IDY4IDAgMC0xMiA0LTMwIDEgMCAwIDEwIDQ0IDYzIDQ4IDAgMC00MiAzOC0xMDEgMjlMNjAgMzM4eiIgZmlsbD0iI0ZGRiIvPjwvc3ZnPg=="><span>' + i + "</span></a>").click(t)), n.append($('<a class="mm-skin-over-button" id="mm-skin-over-fb" target="_blank" href="https://www.facebook.com/dialog/share?app_id=861926850619051&display=popup&href=https%3A%2F%2Fwormate.io&redirect_uri=https%3A%2F%2Fwormate.io&hashtag=%23wormateio&quote=' + s + '"><img src="data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZlcnNpb249IjEuMSIgeD0iMCIgeT0iMCIgdmlld0JveD0iMCAwIDQ1NiA0NTYiIHhtbDpzcGFjZT0icHJlc2VydmUiPjxwYXRoIGQ9Ik0yNDQuMyA0NTZWMjc5LjdoLTU5LjN2LTcxLjloNTkuM3YtNjAuNGMwLTQzLjkgMzUuNi03OS41IDc5LjUtNzkuNWg2MnY2NC42aC00NC40Yy0xMy45IDAtMjUuMyAxMS4zLTI1LjMgMjUuM3Y1MGg2OC41bC05LjUgNzEuOWgtNTkuMVY0NTZ6IiBmaWxsPSIjZmZmIi8+PC9zdmc+"><span>' + i + "</span></a>").click(t))
                    }
                }, C
            }(),
            PrerollViewController = function() {
                var t = extend(BaseViewController, function() {
                    BaseViewController.call(this, ViewControllerType.uk)
                });
                return t.prototype.a = function() {}, t.prototype.mi = function() {
                    BaseViewController.jk.stop(), BaseViewController.jk.fadeOut(50), BaseViewController.kk.stop(), BaseViewController.kk.fadeOut(50), BaseViewController.lk.stop(), BaseViewController.lk.fadeOut(50), BaseViewController.mk.stop(), BaseViewController.mk.fadeOut(50), BaseViewController.nk.stop(), BaseViewController.nk.fadeOut(50), BaseViewController.ok.stop(), BaseViewController.ok.fadeOut(50), BaseViewController.pk.stop(), BaseViewController.pk.fadeOut(50), BaseViewController.qk.stop(), BaseViewController.qk.fadeOut(1), BaseViewController.hi.stop(), BaseViewController.hi.fadeOut(50), BackgroundView.Pe(!1), BaseViewController.sk.stop(), BaseViewController.sk.fadeOut(50), BaseViewController.tk.stop(), BaseViewController.tk.fadeOut(50)
                }, t
            }(),
            RestrictedViewController = function() {
                var t = extend(BaseViewController, function() {
                    BaseViewController.call(this, ViewControllerType.uk)
                });
                return t.prototype.a = function() {}, t.prototype.mi = function() {
                    BaseViewController.jk.stop(), BaseViewController.jk.fadeOut(50), BaseViewController.kk.stop(), BaseViewController.kk.fadeOut(50), BaseViewController.lk.stop(), BaseViewController.lk.fadeOut(50), BaseViewController.mk.stop(), BaseViewController.mk.fadeOut(50), BaseViewController.nk.stop(), BaseViewController.nk.fadeOut(50), BaseViewController.ok.stop(), BaseViewController.ok.fadeOut(50), BaseViewController.pk.stop(), BaseViewController.pk.fadeIn(500), BaseViewController.qk.stop(), BaseViewController.qk.fadeIn(1), BaseViewController.hi.stop(), BaseViewController.hi.fadeIn(500), BackgroundView.Pe(!0), BaseViewController.sk.stop(), BaseViewController.sk.fadeOut(50), BaseViewController.tk.stop(), BaseViewController.tk.fadeOut(50)
                }, t.prototype.ni = function() {}, t
            }(),
            ToasterContainerViewController = function() {
                var t = $("#toaster-stack"),
                    e = extend(BaseViewController, function() {
                        BaseViewController.call(this, ViewControllerType.uk), this.Dk = [], this.Ek = null
                    });
                return e.prototype.a = function() {}, e.prototype.mi = function() {
                    BaseViewController.jk.stop(), BaseViewController.jk.fadeOut(50), BaseViewController.kk.stop(), BaseViewController.kk.fadeOut(50), BaseViewController.lk.stop(), BaseViewController.lk.fadeOut(50), BaseViewController.mk.stop(), BaseViewController.mk.fadeOut(50), BaseViewController.nk.stop(), BaseViewController.nk.fadeIn(500), BaseViewController.ok.stop(), BaseViewController.ok.fadeOut(50), BaseViewController.pk.stop(), BaseViewController.pk.fadeOut(50), BaseViewController.qk.stop(), BaseViewController.qk.fadeIn(1), BaseViewController.hi.stop(), BaseViewController.hi.fadeIn(500), BackgroundView.Pe(!0), BaseViewController.sk.stop(), BaseViewController.sk.fadeOut(50), BaseViewController.tk.stop(), BaseViewController.tk.fadeIn(500)
                }, e.prototype.ni = function() {
                    this.Fk()
                }, e.prototype.qi = function() {
                    return null != this.Ek || this.Dk.length > 0
                }, e.prototype._ = function(t) {
                    this.Dk.unshift(t), setTimeout(function() {
                        getApp().s.oi()
                    }, 0)
                }, e.prototype.Xi = function(t) {
                    this.Dk.push(t), setTimeout(function() {
                        getApp().s.oi()
                    }, 0)
                }, e.prototype.Fk = function() {
                    var e = this;
                    if (null == this.Ek) {
                        if (0 == this.Dk.length) return void getApp().s.ki();
                        var i = this.Dk.shift();
                        this.Ek = i;
                        var o = i.Gk();
                        o.hide(), o.fadeIn(300), t.append(o), i.Hk = function() {
                            o.fadeOut(300), setTimeout(function() {
                                o.remove()
                            }, 300), e.Ek == i && (e.Ek = null), e.Fk()
                        }, i.ni()
                    }
                }, e
            }(),
            ViewControllerType = {
                uk: 0,
                li: 1
            },
            BasePopupViewController = function() {
                var t = $("#popup-menu-label"),
                    e = $("#popup-menu-coins-box"),
                    i = $("#popup-menu-coins-val");
                $("#popup-menu-back").click(function() {
                    var t = getApp();
                    t.r.Dd(), t.s.ki()
                }), e.click(function() {
                    var t = getApp();
                    t.u.P() && (t.r.Dd(), t.s.I(t.s.$h))
                });
                var o = extend(BaseViewController, function(t, e) {
                    BaseViewController.call(this, ViewControllerType.li), this.bd = t, this.Ik = e
                });
                return o.prototype.a = function() {
                    if (o.parent.prototype.a.call(this), !o.Jk) {
                        o.Jk = !0;
                        var t = getApp();
                        t.u.Ti(function() {
                            t.u.P() ? i.html(t.u.Di()) : i.html("0")
                        })
                    }
                }, o.Kk = $("#coins-view"), o.Lk = $("#leaders-view"), o.Mk = $("#profile-view"), o.Nk = $("#settings-view"), o.Ok = $("#login-view"), o.Pk = $("#skins-view"), o.Qk = $("#store-view"), o.Rk = $("#wear-view"), o.Sk = $("#withdraw-consent-view"), o.Tk = $("#delete-account-view"), o.Uk = $("#please-wait-view"), o.prototype.mi = function() {
                    BaseViewController.jk.stop(), BaseViewController.jk.fadeOut(200), BaseViewController.kk.stop(), BaseViewController.kk.fadeOut(200), BaseViewController.lk.stop(), BaseViewController.lk.fadeOut(200), BaseViewController.mk.stop(), BaseViewController.mk.fadeIn(200), BaseViewController.nk.stop(), BaseViewController.nk.fadeOut(200), BaseViewController.ok.stop(), BaseViewController.ok.fadeOut(200), BaseViewController.sk.stop(), BaseViewController.sk.fadeIn(200), BaseViewController.tk.stop(), BaseViewController.tk.fadeIn(200), t.html(this.bd), e.toggle(this.Ik), this.Vk(), this.Wk()
                }, o.prototype.Wk = function() {}, o.prototype.Xk = function() {
                    BasePopupViewController.Uk.stop(), BasePopupViewController.Uk.fadeIn(300)
                }, o.prototype.Vk = function() {
                    BasePopupViewController.Uk.stop(), BasePopupViewController.Uk.fadeOut(300)
                }, o
            }(),
            CoinsViewController = function() {
                var t = $("#store-buy-coins_125000"),
                    e = $("#store-buy-coins_50000"),
                    i = $("#store-buy-coins_16000"),
                    o = $("#store-buy-coins_7000"),
                    n = $("#store-buy-coins_3250"),
                    r = $("#store-buy-coins_1250"),
                    s = extend(BasePopupViewController, function() {
                        BasePopupViewController.call(this, i18n("index.game.popup.menu.coins.tab"), !1);
                        var s = getApp(),
                            a = this;
                        t.click(function() {
                            s.r.Dd(), a.Yk("coins_125000")
                        }), e.click(function() {
                            s.r.Dd(), a.Yk("coins_50000")
                        }), i.click(function() {
                            s.r.Dd(), a.Yk("coins_16000")
                        }), o.click(function() {
                            s.r.Dd(), a.Yk("coins_7000")
                        }), n.click(function() {
                            s.r.Dd(), a.Yk("coins_3250")
                        }), r.click(function() {
                            s.r.Dd(), a.Yk("coins_1250")
                        })
                    });
                return s.prototype.a = function() {
                    s.parent.prototype.a.call(this)
                }, s.prototype.Wk = function() {
                    BasePopupViewController.Kk.stop(), BasePopupViewController.Kk.fadeIn(200), BasePopupViewController.Lk.stop(), BasePopupViewController.Lk.fadeOut(50), BasePopupViewController.Mk.stop(), BasePopupViewController.Mk.fadeOut(50), BasePopupViewController.Ok.stop(), BasePopupViewController.Ok.fadeOut(50), BasePopupViewController.Nk.stop(), BasePopupViewController.Nk.fadeOut(50), BasePopupViewController.Pk.stop(), BasePopupViewController.Pk.fadeOut(50), BasePopupViewController.Qk.stop(), BasePopupViewController.Qk.fadeOut(50), BasePopupViewController.Rk.stop(), BasePopupViewController.Rk.fadeOut(50), BasePopupViewController.Sk.stop(), BasePopupViewController.Sk.fadeOut(50), BasePopupViewController.Tk.stop(), BasePopupViewController.Tk.fadeOut(50)
                }, s.prototype.ni = function() {
                    getApp().r.Ed()
                }, s.prototype.Yk = function(t) {}, s
            }(),
            LeadersViewController = function() {
                var t = $("#highscore-table"),
                    e = $("#leaders-button-level"),
                    i = $("#leaders-button-highscore"),
                    o = $("#leaders-button-kills"),
                    n = extend(BasePopupViewController, function() {
                        BasePopupViewController.call(this, i18n("index.game.popup.menu.leaders.tab"), !0);
                        var t = getApp(),
                            n = this;
                        this.Zk = {}, this.$k = {
                            _k: {
                                al: e,
                                bl: "byLevel"
                            },
                            cl: {
                                al: i,
                                bl: "byHighScore"
                            },
                            dl: {
                                al: o,
                                bl: "byKillsAndHeadShots"
                            }
                        }, e.click(function() {
                            t.r.Dd(), n.el(n.$k._k)
                        }), i.click(function() {
                            t.r.Dd(), n.el(n.$k.cl)
                        }), o.click(function() {
                            t.r.Dd(), n.el(n.$k.dl)
                        })
                    });
                return n.prototype.a = function() {
                    n.parent.prototype.a.call(this)
                }, n.prototype.Wk = function() {
                    BasePopupViewController.Kk.stop(), BasePopupViewController.Kk.fadeOut(50), BasePopupViewController.Lk.stop(), BasePopupViewController.Lk.fadeIn(200), BasePopupViewController.Mk.stop(), BasePopupViewController.Mk.fadeOut(50), BasePopupViewController.Ok.stop(), BasePopupViewController.Ok.fadeOut(50), BasePopupViewController.Nk.stop(), BasePopupViewController.Nk.fadeOut(50), BasePopupViewController.Pk.stop(), BasePopupViewController.Pk.fadeOut(50), BasePopupViewController.Qk.stop(), BasePopupViewController.Qk.fadeOut(50), BasePopupViewController.Rk.stop(), BasePopupViewController.Rk.fadeOut(50), BasePopupViewController.Sk.stop(), BasePopupViewController.Sk.fadeOut(50), BasePopupViewController.Tk.stop(), BasePopupViewController.Tk.fadeOut(50)
                }, n.prototype.ni = function() {
                    getApp().r.Ed();
                    var t = this;
                    this.Xk(), $.get(GATEWAY_HOST + "/pub/leaders", function(e) {
                        t.Zk = e, t.el(null != t.fl ? t.fl : t.$k._k), t.Vk()
                    }).done(function() {
                        t.Vk()
                    })
                }, n.prototype.el = function(e) {
                    this.fl = e;
                    for (var i in this.$k)
                        if (this.$k.hasOwnProperty(i)) {
                            var o = this.$k[i];
                            o.al.removeClass("pressed")
                        } this.fl.al.addClass("pressed");
                    for (var n = this.Zk[this.fl.bl], r = "", s = 0; s < n.length; s++) {
                        var a = n[s];
                        r += '<div class="table-row"><span>' + (s + 1) + '</span><span><img src="' + a.avatarUrl + '"/></span><span>' + a.username + "</span><span>" + a.level + "</span><span>" + a.highScore + "</span><span>" + a.headShots + " / " + a.kills + "</span></div>"
                    }
                    t.empty(), t.append(r)
                }, n
            }(),
            LoginViewController = function() {
                var t = $("#popup-login-gg"),
                    e = $("#popup-login-fb"),
                    i = extend(BasePopupViewController, function() {
                        BasePopupViewController.call(this, i18n("index.game.popup.menu.login.tab"), !1);
                        var i = getApp(),
                            o = this;
                        t.click(function() {
                            i.r.Dd(), o.Xk(), i.u.Ui(function() {
                                o.Vk()
                            }), setTimeout(function() {
                                o.Vk()
                            }, 1e4), i.u.bj()
                        }), e.click(function() {
                            i.r.Dd(), o.Xk(), i.u.Ui(function() {
                                o.Vk()
                            }), setTimeout(function() {
                                o.Vk()
                            }, 1e4), i.u.Zi()
                        })
                    });
                return i.prototype.a = function() {
                    i.parent.prototype.a.call(this)
                }, i.prototype.Wk = function() {
                    BasePopupViewController.Kk.stop(), BasePopupViewController.Kk.fadeOut(50), BasePopupViewController.Lk.stop(), BasePopupViewController.Lk.fadeOut(50), BasePopupViewController.Mk.stop(), BasePopupViewController.Mk.fadeOut(50), BasePopupViewController.Ok.stop(), BasePopupViewController.Ok.fadeIn(200), BasePopupViewController.Nk.stop(), BasePopupViewController.Nk.fadeOut(50), BasePopupViewController.Pk.stop(), BasePopupViewController.Pk.fadeOut(50), BasePopupViewController.Qk.stop(), BasePopupViewController.Qk.fadeOut(50), BasePopupViewController.Rk.stop(), BasePopupViewController.Rk.fadeOut(50), BasePopupViewController.Sk.stop(), BasePopupViewController.Sk.fadeOut(50), BasePopupViewController.Tk.stop(), BasePopupViewController.Tk.fadeOut(50)
                }, i.prototype.ni = function() {
                    getApp().r.Ed()
                }, i
            }(),
            ProfileViewController = function() {
                var t = $("#profile-avatar"),
                    e = $("#profile-username"),
                    i = $("#profile-experience-bar"),
                    o = $("#profile-experience-val"),
                    n = $("#profile-level"),
                    r = $("#profile-stat-highScore"),
                    s = $("#profile-stat-bestSurvivalTime"),
                    a = $("#profile-stat-kills"),
                    h = $("#profile-stat-headshots"),
                    l = $("#profile-stat-gamesPlayed"),
                    p = $("#profile-stat-totalTimeSpent"),
                    u = $("#profile-stat-registrationDate"),
                    c = extend(BasePopupViewController, function() {
                        BasePopupViewController.call(this, i18n("index.game.popup.menu.profile.tab"), !0)
                    });
                return c.prototype.a = function() {
                    c.parent.prototype.a.call(this)
                }, c.prototype.Wk = function() {
                    BasePopupViewController.Kk.stop(), BasePopupViewController.Kk.fadeOut(50), BasePopupViewController.Lk.stop(), BasePopupViewController.Lk.fadeOut(50), BasePopupViewController.Mk.stop(), BasePopupViewController.Mk.fadeIn(200), BasePopupViewController.Ok.stop(), BasePopupViewController.Ok.fadeOut(50), BasePopupViewController.Nk.stop(), BasePopupViewController.Nk.fadeOut(50), BasePopupViewController.Pk.stop(), BasePopupViewController.Pk.fadeOut(50), BasePopupViewController.Qk.stop(), BasePopupViewController.Qk.fadeOut(50), BasePopupViewController.Rk.stop(), BasePopupViewController.Rk.fadeOut(50), BasePopupViewController.Sk.stop(), BasePopupViewController.Sk.fadeOut(50), BasePopupViewController.Tk.stop(), BasePopupViewController.Tk.fadeOut(50)
                }, c.prototype.ni = function() {
                    var c = getApp();
                    c.r.Ed();
                    var f = c.u.Si(),
                        d = moment([f.year, f.month - 1, f.day]).format("LL");
                    e.html(c.u.Ai()), t.attr("src", c.u.Bi()), i.width(100 * c.u.Fi() / c.u.Gi() + "%"), o.html(c.u.Fi() + " / " + c.u.Gi()), n.html(c.u.Ei()), r.html(c.u.Mi()), s.html(timeSecsToIntervalText(c.u.Ni())), a.html(c.u.Oi()), h.html(c.u.Pi()), l.html(c.u.Qi()), p.html(timeSecsToIntervalText(c.u.Ri())), u.html(d)
                }, c
            }(),
            SettingsViewController = function() {
                var t = $("#settings-music-enabled-switch"),
                    e = $("#settings-sfx-enabled-switch"),
                    i = $("#settings-show-names-switch"),
                    o = $("#popup-logout"),
                    n = $("#popup-logout-container"),
                    r = $("#popup-delete-account"),
                    s = $("#popup-delete-account-container"),
                    a = $("#popup-withdraw-consent"),
                    h = extend(BasePopupViewController, function() {
                        BasePopupViewController.call(this, i18n("index.game.popup.menu.settings.tab"), !1);
                        var n = this,
                            s = getApp();
                        t.click(function() {
                            var e = !!t.prop("checked");
                            setCookie(Cookies.Qe, e, 30), s.r.ud(e), s.r.Dd()
                        }), e.click(function() {
                            var t = !!e.prop("checked");
                            setCookie(Cookies.Re, t, 30), s.r.sd(t), s.r.Dd()
                        }), i.click(function() {
                            s.r.Dd()
                        }), o.click(function() {
                            s.r.Dd(), n.Xk(), setTimeout(function() {
                                n.Vk()
                            }, 2e3), s.u.$i()
                        }), r.click(function() {
                            s.u.P() ? (s.r.Dd(), s.s.I(s.s.Zh)) : s.r.Id()
                        }), a.click(function() {
                            s.Y() ? (s.r.Dd(), s.s.I(s.s.Yh)) : s.r.Id()
                        })
                    });
                return h.prototype.a = function() {
                    h.parent.prototype.a.call(this);
                    var o = getApp(),
                        r = void 0;
                    switch (getCookie(Cookies.Qe)) {
                        case "false":
                            r = !1;
                            break;
                        default:
                            r = !0
                    }
                    t.prop("checked", r), o.r.ud(r);
                    var a = void 0;
                    switch (getCookie(Cookies.Re)) {
                        case "false":
                            a = !1;
                            break;
                        default:
                            a = !0
                    }
                    e.prop("checked", a), o.r.sd(a);
                    var l = void 0;
                    switch (getCookie(Cookies.za)) {
                        case "false":
                            l = !1;
                            break;
                        default:
                            l = !0
                    }
                    console.log("Load sPN: " + l), i.prop("checked", l), o.u.V(function() {
                        n.toggle(o.u.P()), s.toggle(o.u.P())
                    })
                }, h.prototype.Wk = function() {
                    BasePopupViewController.Kk.stop(), BasePopupViewController.Kk.fadeOut(50), BasePopupViewController.Lk.stop(), BasePopupViewController.Lk.fadeOut(50), BasePopupViewController.Mk.stop(), BasePopupViewController.Mk.fadeOut(50), BasePopupViewController.Ok.stop(), BasePopupViewController.Ok.fadeOut(50), BasePopupViewController.Nk.stop(), BasePopupViewController.Nk.fadeIn(200), BasePopupViewController.Pk.stop(), BasePopupViewController.Pk.fadeOut(50), BasePopupViewController.Qk.stop(), BasePopupViewController.Qk.fadeOut(50), BasePopupViewController.Rk.stop(), BasePopupViewController.Rk.fadeOut(50), BasePopupViewController.Sk.stop(), BasePopupViewController.Sk.fadeOut(50), BasePopupViewController.Tk.stop(), BasePopupViewController.Tk.fadeOut(50)
                }, h.prototype.ni = function() {
                    var t = getApp();
                    t.r.Ed(), t.Y() ? a.show() : a.hide()
                }, h.prototype.xa = function() {
                    return i.prop("checked")
                }, h
            }(),
            SkinsViewController = function() {
                var t = $("#store-view-canv"),
                    e = $("#skin-description-text"),
                    i = $("#skin-group-description-text"),
                    o = $("#store-locked-bar"),
                    n = $("#store-locked-bar-text"),
                    r = $("#store-buy-button"),
                    s = $("#store-item-price"),
                    a = $("#store-groups"),
                    h = $("#store-view-prev"),
                    l = $("#store-view-next"),
                    p = extend(BasePopupViewController, function() {
                        BasePopupViewController.call(this, i18n("index.game.popup.menu.skins.tab"), !0);
                        var e = this,
                            i = getApp();
                        this.gl = null, this.hl = [], this.il = {}, this.jl = new WormView(t), r.click(function() {
                            i.r.Dd(), e.kl()
                        }), h.click(function() {
                            i.r.Dd(), e.gl.ll()
                        }), l.click(function() {
                            i.r.Dd(), e.gl.ml()
                        })
                    });
                p.prototype.a = function() {
                    p.parent.prototype.a.call(this);
                    var t = this,
                        e = getApp();
                    e.p.ca(function() {
                        var i = e.p.Bc();
                        if (null != i) {
                            t.hl = [];
                            for (var o = 0; o < i.skinGroupArrayDict.length; o++) t.hl.push(new u(t, i.skinGroupArrayDict[o]));
                            t.il = {};
                            for (var n = 0; n < i.skinArrayDict.length; n++) {
                                var r = i.skinArrayDict[n];
                                t.il[r.id] = r
                            }
                        }
                    }), this.nl(!1), e.t.Bh(function() {
                        t.nl(!1)
                    })
                }, p.prototype.Wk = function() {
                    BasePopupViewController.Kk.stop(), BasePopupViewController.Kk.fadeOut(50), BasePopupViewController.Lk.stop(), BasePopupViewController.Lk.fadeOut(50), BasePopupViewController.Mk.stop(), BasePopupViewController.Mk.fadeOut(50), BasePopupViewController.Ok.stop(), BasePopupViewController.Ok.fadeOut(50), BasePopupViewController.Nk.stop(), BasePopupViewController.Nk.fadeOut(50), BasePopupViewController.Pk.stop(), BasePopupViewController.Pk.fadeIn(200), BasePopupViewController.Qk.stop(), BasePopupViewController.Qk.fadeOut(50), BasePopupViewController.Rk.stop(), BasePopupViewController.Rk.fadeOut(50), BasePopupViewController.Sk.stop(), BasePopupViewController.Sk.fadeOut(50), BasePopupViewController.Tk.stop(), BasePopupViewController.Tk.fadeOut(50)
                }, p.prototype.ni = function() {
                    getApp().r.Ed(), this.ol(), this.jl.Pe(!0)
                }, p.prototype.ii = function() {
                    this.jl.Pe(!1)
                }, p.prototype.Sa = function() {
                    this.jl.Sa()
                }, p.prototype.Qa = function(t, e) {
                    this.jl.Qa()
                }, p.prototype.ol = function() {
                    var t = this,
                        e = this,
                        i = getApp();
                    a.empty();
                    for (var o = 0; o < this.hl.length; o++) ! function(o) {
                        var n = t.hl[o],
                            r = document.createElement("li");
                        a.append(r);
                        var s = $(r);
                        s.html(n.pl()), s.click(function() {
                            i.r.Dd(), e.ql(n)
                        }), n.rl = s
                    }(o);
                    if (this.hl.length > 0) {
                        for (var n = i.t.ha(PropertyType.ia), o = 0; o < this.hl.length; o++)
                            for (var r = this.hl[o], s = r.sl.list, h = 0; h < s.length; h++)
                                if (s[h] == n) return r.tl = h, void this.ql(r);
                        this.ql(this.hl[0])
                    }
                }, p.prototype.ql = function(t) {
                    if (this.gl != t) {
                        var e = getApp();
                        if (this.gl = t, a.children().removeClass("pressed"), this.gl.rl && this.gl.rl.addClass("pressed"), i.html(""), null != t.sl) {
                            var o = e.p.Bc().textDict[t.sl.description];
                            null != o && i.html(convertI18nStringToHTML(i18nCustomBundle(o)))
                        }
                        this.nl(!0)
                    }
                }, p.prototype.ul = function() {
                    return null == this.gl ? Optional.ah() : this.gl.vl()
                }, p.prototype.kl = function() {
                    var t = this;
                    this.ul().eh(function(e) {
                        t.wl(e)
                    })
                }, p.prototype.wl = function(t) {
                    var e = this,
                        i = getApp(),
                        o = this.il[t].price;
                    if (!(i.u.Di() < o)) {
                        this.Xk();
                        var n = i.t.ha(PropertyType.ia),
                            r = i.t.ha(PropertyType.ja),
                            s = i.t.ha(PropertyType.ka),
                            a = i.t.ha(PropertyType.la),
                            h = i.t.ha(PropertyType.ma);
                        i.u.Yi(t, PropertyType.ia, function() {
                            i.t.Fh(n, PropertyType.ia), i.t.Fh(r, PropertyType.ja), i.t.Fh(s, PropertyType.ka), i.t.Fh(a, PropertyType.la), i.t.Fh(h, PropertyType.ma), i.u.Gh(t, PropertyType.ia) && i.t.Fh(t, PropertyType.ia), e.Vk()
                        })
                    }
                }, p.prototype.nl = function(t) {
                    var i = getApp();
                    this.jl.fk(i.t.ha(PropertyType.ja), !1, !1), this.jl.gk(i.t.ha(PropertyType.ka), !1, !1), this.jl.hk(i.t.ha(PropertyType.la), !1, !1), this.jl.ik(i.t.ha(PropertyType.ma), !1, !1);
                    var a = this.ul();
                    if (a.dh()) {
                        var h = a.ch(),
                            l = this.il[h],
                            p = !1;
                        if (i.t.Ka(h, PropertyType.ia)) o.hide(), r.hide();
                        else if (null == l || 1 == l.nonbuyable) {
                            if (p = !0, o.show(), r.hide(), n.text(i18n("index.game.popup.menu.store.locked")), null != l && l.nonbuyable && null != l.nonbuyableCause) {
                                var u = i.p.Bc().textDict[l.nonbuyableCause];
                                null != u && n.text(i18nCustomBundle(u))
                            }
                        } else o.hide(), r.show(), s.html(l.price);
                        if (e.html(""), null != l && null != l.description) {
                            var c = i.p.Bc().textDict[l.description];
                            null != c && e.html(convertI18nStringToHTML(i18nCustomBundle(c)))
                        }
                        this.jl.ek(h, !0, p), t && i.t.Fh(h, PropertyType.ia)
                    }
                };
                var u = function() {
                    function t(t, e) {
                        this.xl = t, this.tl = 0, this.sl = e
                    }
                    return t.prototype.ll = function() {
                        --this.tl < 0 && (this.tl = this.sl.list.length - 1), this.xl.nl(!0)
                    }, t.prototype.ml = function() {
                        ++this.tl >= this.sl.list.length && (this.tl = 0), this.xl.nl(!0)
                    }, t.prototype.pl = function() {
                        return i18nCustomBundle(this.sl.name)
                    }, t.prototype.vl = function() {
                        return this.tl >= this.sl.list.length ? Optional.ah() : Optional.bh(this.sl.list[this.tl])
                    }, t
                }();
                return p
            }(),
            StoreViewController = function() {
                var t = $("#store-go-coins-button"),
                    e = $("#store-go-skins-button"),
                    i = $("#store-go-wear-button"),
                    o = extend(BasePopupViewController, function() {
                        BasePopupViewController.call(this, i18n("index.game.popup.menu.store.tab"), !0);
                        var o = getApp();
                        t.click(function() {
                            o.r.Dd(), o.s.I(o.s.$h)
                        }), e.click(function() {
                            o.r.Dd(), o.s.I(o.s.ci)
                        }), i.click(function() {
                            o.r.Dd(), o.s.I(o.s.ei)
                        })
                    });
                return o.prototype.a = function() {
                    o.parent.prototype.a.call(this)
                }, o.prototype.Wk = function() {
                    BasePopupViewController.Kk.stop(), BasePopupViewController.Kk.fadeOut(50), BasePopupViewController.Lk.stop(), BasePopupViewController.Lk.fadeOut(50), BasePopupViewController.Mk.stop(), BasePopupViewController.Mk.fadeOut(50), BasePopupViewController.Ok.stop(), BasePopupViewController.Ok.fadeOut(50), BasePopupViewController.Nk.stop(), BasePopupViewController.Nk.fadeOut(50), BasePopupViewController.Pk.stop(), BasePopupViewController.Pk.fadeOut(50), BasePopupViewController.Qk.stop(), BasePopupViewController.Qk.fadeIn(200), BasePopupViewController.Rk.stop(), BasePopupViewController.Rk.fadeOut(50), BasePopupViewController.Sk.stop(), BasePopupViewController.Sk.fadeOut(50), BasePopupViewController.Tk.stop(), BasePopupViewController.Tk.fadeOut(50)
                }, o.prototype.ni = function() {
                    getApp().r.Ed()
                }, o
            }(),
            WearViewController = function() {
                var t = $("#wear-view-canv"),
                    e = $("#wear-description-text"),
                    i = $("#wear-locked-bar"),
                    o = $("#wear-locked-bar-text"),
                    n = $("#wear-buy-button"),
                    r = $("#wear-item-price"),
                    s = $("#wear-eyes-button"),
                    a = $("#wear-mouths-button"),
                    h = $("#wear-glasses-button"),
                    l = $("#wear-hats-button"),
                    p = $("#wear-tint-chooser"),
                    u = $("#wear-view-prev"),
                    c = $("#wear-view-next"),
                    f = extend(BasePopupViewController, function() {
                        var e = this;
                        BasePopupViewController.call(this, i18n("index.game.popup.menu.wear.tab"), !0);
                        var i = getApp(),
                            o = this;
                        this.yl = [], this.ja = new d(this, PropertyType.ja, s), this.ka = new d(this, PropertyType.ka, a), this.la = new d(this, PropertyType.la, h), this.ma = new d(this, PropertyType.ma, l), this.zl = null, this.Al = null, this.Bl = null, this.Cl = null, this.Dl = null, this.El = null, this.Fl = new WormView(t), n.click(function() {
                            i.r.Dd(), o.Gl()
                        }), u.click(function() {
                            i.r.Dd(), o.zl.Hl()
                        }), c.click(function() {
                            i.r.Dd(), o.zl.Il()
                        }), s.click(function() {
                            i.r.Dd(), o.Jl(e.ja)
                        }), a.click(function() {
                            i.r.Dd(), o.Jl(e.ka)
                        }), h.click(function() {
                            i.r.Dd(), o.Jl(e.la)
                        }), l.click(function() {
                            i.r.Dd(), o.Jl(e.ma)
                        }), this.yl.push(this.ja), this.yl.push(this.ka), this.yl.push(this.la), this.yl.push(this.ma)
                    });
                f.prototype.a = function() {
                    f.parent.prototype.a.call(this);
                    var t = getApp(),
                        e = this;
                    t.p.ca(function() {
                        var i = t.p.Bc();
                        null != i && (e.Al = i.eyesDict, e.Bl = i.mouthDict, e.Cl = i.glassesDict, e.Dl = i.hatDict, e.El = i.colorDict, e.ja.Kl(i.eyesVariantArray), e.ja.Ll(e.Al), e.ka.Kl(i.mouthVariantArray), e.ka.Ll(e.Bl), e.la.Kl(i.glassesVariantArray), e.la.Ll(e.Cl), e.ma.Kl(i.hatVariantArray), e.ma.Ll(e.Dl))
                    }), this.nl(!1), t.t.Bh(function() {
                        e.nl(!1)
                    })
                }, f.prototype.Wk = function() {
                    BasePopupViewController.Kk.stop(), BasePopupViewController.Kk.fadeOut(50), BasePopupViewController.Lk.stop(), BasePopupViewController.Lk.fadeOut(50), BasePopupViewController.Mk.stop(), BasePopupViewController.Mk.fadeOut(50), BasePopupViewController.Ok.stop(), BasePopupViewController.Ok.fadeOut(50), BasePopupViewController.Nk.stop(), BasePopupViewController.Nk.fadeOut(50), BasePopupViewController.Pk.stop(), BasePopupViewController.Pk.fadeOut(50), BasePopupViewController.Qk.stop(), BasePopupViewController.Qk.fadeOut(50), BasePopupViewController.Rk.stop(), BasePopupViewController.Rk.fadeIn(200), BasePopupViewController.Sk.stop(), BasePopupViewController.Sk.fadeOut(50), BasePopupViewController.Tk.stop(), BasePopupViewController.Tk.fadeOut(50)
                }, f.prototype.ni = function() {
                    getApp().r.Ed(), this.Jl(null != this.zl ? this.zl : this.ja), this.Fl.Pe(!0)
                }, f.prototype.ii = function() {
                    this.Fl.Pe(!1)
                }, f.prototype.Sa = function() {
                    this.Fl.Sa()
                }, f.prototype.Qa = function(t, e) {
                    this.Fl.Qa()
                }, f.prototype.Jl = function(t) {
                    this.zl = t;
                    for (var e = 0; e < this.yl.length; e++) this.yl[e].al.removeClass("pressed");
                    this.zl.al.addClass("pressed"), this.zl.mi()
                }, f.prototype.Ml = function() {
                    return null == this.zl ? Optional.ah() : Optional.bh({
                        Mb: this.zl.vl(),
                        sc: this.zl.sc
                    })
                }, f.prototype.Gl = function() {
                    var t = this;
                    this.Ml().eh(function(e) {
                        t.Yi(e.Mb, e.sc)
                    })
                }, f.prototype.Yi = function(t, e) {
                    var i = this,
                        o = getApp(),
                        n = void 0;
                    switch (e) {
                        case PropertyType.ja:
                            n = this.Al[t].price;
                            break;
                        case PropertyType.ka:
                            n = this.Bl[t].price;
                            break;
                        case PropertyType.la:
                            n = this.Cl[t].price;
                            break;
                        case PropertyType.ma:
                            n = this.Dl[t].price;
                            break;
                        default:
                            return
                    }
                    if (!(o.u.Di() < n)) {
                        this.Xk();
                        var r = o.t.ha(PropertyType.ia),
                            s = o.t.ha(PropertyType.ja),
                            a = o.t.ha(PropertyType.ka),
                            h = o.t.ha(PropertyType.la),
                            l = o.t.ha(PropertyType.ma);
                        o.u.Yi(t, e, function() {
                            o.t.Fh(r, PropertyType.ia), o.t.Fh(s, PropertyType.ja), o.t.Fh(a, PropertyType.ka), o.t.Fh(h, PropertyType.la), o.t.Fh(l, PropertyType.ma), o.u.Gh(t, e) && o.t.Fh(t, e), i.Vk()
                        })
                    }
                }, f.prototype.Nl = function(t, e) {
                    switch (e) {
                        case PropertyType.ja:
                            return this.Al[t];
                        case PropertyType.ka:
                            return this.Bl[t];
                        case PropertyType.la:
                            return this.Cl[t];
                        case PropertyType.ma:
                            return this.Dl[t]
                    }
                    return null
                }, f.prototype.nl = function(t) {
                    var s = getApp();
                    this.Fl.ek(s.t.ha(PropertyType.ia), !1, !1), this.Fl.fk(s.t.ha(PropertyType.ja), !1, !1), this.Fl.gk(s.t.ha(PropertyType.ka), !1, !1), this.Fl.hk(s.t.ha(PropertyType.la), !1, !1), this.Fl.ik(s.t.ha(PropertyType.ma), !1, !1);
                    var a = this.Ml();
                    if (a.dh()) {
                        var h = a.ch(),
                            l = this.Nl(h.Mb, h.sc),
                            p = !1;
                        if (s.t.Ka(h.Mb, h.sc)) i.hide(), n.hide();
                        else if (null == l || 1 == l.nonbuyable) {
                            if (p = !0, i.show(), n.hide(), o.text(i18n("index.game.popup.menu.store.locked")), null != l && l.nonbuyable && null != l.nonbuyableCause) {
                                var u = s.p.Bc().textDict[l.nonbuyableCause];
                                null != u && o.text(i18nCustomBundle(u))
                            }
                        } else i.hide(), n.show(), r.html(l.price);
                        if (e.html(""), null != l && null != l.description) {
                            var c = s.p.Bc().textDict[l.description];
                            null != c && e.html(convertI18nStringToHTML(i18nCustomBundle(c)))
                        }
                        switch (h.sc) {
                            case PropertyType.ja:
                                this.Fl.fk(h.Mb, !0, p);
                                break;
                            case PropertyType.ka:
                                this.Fl.gk(h.Mb, !0, p);
                                break;
                            case PropertyType.la:
                                this.Fl.hk(h.Mb, !0, p);
                                break;
                            case PropertyType.ma:
                                this.Fl.ik(h.Mb, !0, p)
                        }
                        t && s.t.Fh(h.Mb, h.sc)
                    }
                };
                var d = function() {
                    function t(t, e, i) {
                        this.xl = t, this.sc = e, this.al = i, this.Ol = {}, this.Pl = [
                            []
                        ], this.Ql = -10, this.Rl = -10
                    }
                    return t.prototype.Kl = function(t) {
                        this.Pl = t
                    }, t.prototype.Ll = function(t) {
                        this.Ol = t
                    }, t.prototype.mi = function() {
                        for (var t = getApp(), e = t.t.ha(this.sc), i = 0; i < this.Pl.length; i++)
                            for (var o = 0; o < this.Pl[i].length; o++)
                                if (this.Pl[i][o] == e) return this.Sl(i), void this.Tl(o);
                        this.Sl(0), this.Tl(0)
                    }, t.prototype.Hl = function() {
                        var t = this.Ql - 1;
                        t < 0 && (t = this.Pl.length - 1), this.Sl(t), this.Tl(this.Rl % this.Pl[t].length)
                    }, t.prototype.Il = function() {
                        var t = this.Ql + 1;
                        t >= this.Pl.length && (t = 0), this.Sl(t), this.Tl(this.Rl % this.Pl[t].length)
                    }, t.prototype.Sl = function(t) {
                        var e = this;
                        if (!(t < 0 || t >= this.Pl.length)) {
                            this.Ql = t, p.empty();
                            var i = this.Pl[this.Ql];
                            if (i.length > 1)
                                for (var o = 0; o < i.length; o++) ! function(t) {
                                    var o = i[t],
                                        n = e.Ol[o],
                                        r = "#" + e.xl.El[n.prime],
                                        s = $('<div style="border-color:' + r + '"></div>');
                                    s.click(function() {
                                        getApp().r.Dd(), e.Tl(t)
                                    }), p.append(s)
                                }(o)
                        }
                    }, t.prototype.Tl = function(t) {
                        if (!(t < 0 || t >= this.Pl[this.Ql].length)) {
                            this.Rl = t, p.children().css("background-color", "transparent");
                            var e = p.children(":nth-child(" + (1 + t) + ")");
                            e.css("background-color", e.css("border-color")), this.xl.nl(!0)
                        }
                    }, t.prototype.vl = function() {
                        return this.Pl[this.Ql][this.Rl]
                    }, t
                }();
                return f
            }(),
            WithdrawConsentViewController = function() {
                var t = $("#withdraw-consent-yes"),
                    e = $("#withdraw-consent-no"),
                    i = extend(BasePopupViewController, function() {
                        BasePopupViewController.call(this, i18n("index.game.popup.menu.consent.tab"), !1);
                        var i = getApp();
                        t.click(function() {
                            i.r.Dd(), i.Y() ? (i.s.I(i.s.F), i.$(!1, !0), i.s.aa._(new ConsentAcceptanceToasterViewController)) : i.s.ki()
                        }), e.click(function() {
                            i.r.Dd(), i.s.ki()
                        })
                    });
                return i.prototype.a = function() {
                    i.parent.prototype.a.call(this)
                }, i.prototype.Wk = function() {
                    BasePopupViewController.Kk.stop(), BasePopupViewController.Kk.fadeOut(50), BasePopupViewController.Lk.stop(), BasePopupViewController.Lk.fadeOut(50), BasePopupViewController.Mk.stop(), BasePopupViewController.Mk.fadeOut(50), BasePopupViewController.Ok.stop(), BasePopupViewController.Ok.fadeOut(50), BasePopupViewController.Nk.stop(), BasePopupViewController.Nk.fadeOut(50), BasePopupViewController.Pk.stop(), BasePopupViewController.Pk.fadeOut(50), BasePopupViewController.Qk.stop(), BasePopupViewController.Qk.fadeOut(50), BasePopupViewController.Rk.stop(), BasePopupViewController.Rk.fadeOut(50), BasePopupViewController.Sk.stop(), BasePopupViewController.Sk.fadeIn(200), BasePopupViewController.Tk.stop(), BasePopupViewController.Tk.fadeOut(50)
                }, i.prototype.ni = function() {
                    getApp().r.Ed()
                }, i
            }(),
            DeleteAccountViewController = function() {
                var t = $("#delete-account-timer"),
                    e = $("#delete-account-yes"),
                    i = $("#delete-account-no"),
                    o = extend(BasePopupViewController, function() {
                        BasePopupViewController.call(this, i18n("index.game.popup.menu.delete.tab"), !1);
                        var t = getApp();
                        e.click(function() {
                            t.r.Dd(), t.u.P() ? (t.u.fj(), t.u.$i()) : t.s.ki()
                        }), i.click(function() {
                            t.r.Dd(), t.s.ki()
                        }), this.Ul = []
                    });
                return o.prototype.a = function() {
                    o.parent.prototype.a.call(this)
                }, o.prototype.Wk = function() {
                    BasePopupViewController.Kk.stop(), BasePopupViewController.Kk.fadeOut(50), BasePopupViewController.Lk.stop(), BasePopupViewController.Lk.fadeOut(50), BasePopupViewController.Mk.stop(), BasePopupViewController.Mk.fadeOut(50), BasePopupViewController.Ok.stop(), BasePopupViewController.Ok.fadeOut(50), BasePopupViewController.Nk.stop(), BasePopupViewController.Nk.fadeOut(50), BasePopupViewController.Pk.stop(), BasePopupViewController.Pk.fadeOut(50), BasePopupViewController.Qk.stop(), BasePopupViewController.Qk.fadeOut(50), BasePopupViewController.Rk.stop(), BasePopupViewController.Rk.fadeOut(50), BasePopupViewController.Sk.stop(), BasePopupViewController.Sk.fadeOut(50), BasePopupViewController.Tk.stop(), BasePopupViewController.Tk.fadeIn(200)
                }, o.prototype.ni = function() {
                    getApp().r.Id(), e.stop(), e.hide(), t.stop(), t.show(), t.text(".. 10 .."), this.Vl(), this.Wl(function() {
                        t.text(".. 9 ..")
                    }, 1e2), this.Wl(function() {
                        t.text(".. 8 ..")
                    }, 2e2), this.Wl(function() {
                        t.text(".. 7 ..")
                    }, 3e2), this.Wl(function() {
                        t.text(".. 6 ..")
                    }, 4e2), this.Wl(function() {
                        t.text(".. 5 ..")
                    }, 5e2), this.Wl(function() {
                        t.text(".. 4 ..")
                    }, 6e2), this.Wl(function() {
                        t.text(".. 3 ..")
                    }, 7e2), this.Wl(function() {
                        t.text(".. 2 ..")
                    }, 8e2), this.Wl(function() {
                        t.text(".. 1 ..")
                    }, 9e2), this.Wl(function() {
                        t.hide(), e.fadeIn(300)
                    }, 1e3)
                }, o.prototype.Wl = function(t, e) {
                    var i = setTimeout(t, e);
                    this.Ul.push(i)
                }, o.prototype.Vl = function() {
                    for (var t = 0; t < this.Ul.length; t++) clearTimeout(this.Ul[t]);
                    this.Ul = []
                }, o
            }(),
            BaseToasterViewController = function() {
                function t() {
                    this.Hk = function() {}
                }
                return t.prototype.Gk = function() {}, t.prototype.ni = function() {}, t
            }(),
            CoinsToasterViewController = function() {
                var t = extend(BaseToasterViewController, function(t) {
                    BaseToasterViewController.call(this);
                    var e = Date.now() + "_" + Math.floor(1e3 + 8999 * Math.random());
                    this.Xl = $('<div id="' + e + '" class="toaster toaster-coins">    <img class="toaster-coins-img" alt="Wormate Coin" src="/images/coin_320.png" />    <div class="toaster-coins-val">+' + t + '</div>    <div class="toaster-coins-close">' + i18n("index.game.toaster.continue") + "</div></div>");
                    var i = this;
                    this.Xl.find(".toaster-coins-close").click(function() {
                        getApp().r.Dd(), i.Hk()
                    })
                });
                return t.prototype.Gk = function() {
                    return this.Xl
                }, t.prototype.ni = function() {
                    getApp().r.Gd()
                }, t
            }(),
            LevelUpToasterViewController = function() {
                var t = extend(BaseToasterViewController, function(t) {
                    BaseToasterViewController.call(this);
                    var e = Date.now() + "_" + Math.floor(1e3 + 8999 * Math.random());
                    this.Xl = $('<div id="' + e + '" class="toaster toaster-levelup">    <img class="toaster-levelup-img" alt="Wormate Level Up Star" src="/images/level-star.svg" />    <div class="toaster-levelup-val">' + t + '</div>    <div class="toaster-levelup-text">' + i18n("index.game.toaster.levelup") + '</div>    <div class="toaster-levelup-close">' + i18n("index.game.toaster.continue") + "</div></div>");
                    var i = this;
                    this.Xl.find(".toaster-levelup-close").click(function() {
                        getApp().r.Dd(), i.Hk()
                    })
                });
                return t.prototype.Gk = function() {
                    return this.Xl
                }, t.prototype.ni = function() {
                    getApp().r.Fd()
                }, t
            }(),
            ConsentAcceptanceToasterViewController = function() {
                var t = extend(BaseToasterViewController, function() {
                    BaseToasterViewController.call(this);
                    var t = this,
                        e = getApp(),
                        i = Date.now() + "_" + Math.floor(1e3 + 8999 * Math.random());
                    this.Xl = $('<div id="' + i + '" class="toaster toaster-consent-accepted">    <img class="toaster-consent-accepted-logo" src="' + LINE_LOGO_URL + '" alt="Wormate.io logo"/>    <div class="toaster-consent-accepted-container">        <span class="toaster-consent-accepted-text">' + i18n("index.game.toaster.consent.text").replaceAll(" ", "&nbsp;").replaceAll("\n", "<br/>") + '</span>        <a class="toaster-consent-accepted-link" href="/privacy-policy">' + i18n("index.game.toaster.consent.link") + '</a>    </div>    <div class="toaster-consent-close">' + i18n("index.game.toaster.consent.iAccept") + "</div></div>"), this.Yl = this.Xl.find(".toaster-consent-close"), this.Yl.hide(), this.Yl.click(function() {
                        e.r.Dd(), e.Y() && e.$(!0, !0), t.Hk()
                    })
                });
                return t.prototype.Gk = function() {
                    return this.Xl
                }, t.prototype.ni = function() {
                    var t = this,
                        e = getApp();
                    e.Y() && !e.Z() ? (e.r.Id(), setTimeout(function() {
                        t.Yl.fadeIn(300)
                    }, 2e3)) : setTimeout(function() {
                        t.Hk()
                    }, 0)
                }, t
            }(),
            ENV_MAP = {};
        ENV_MAP.main = {
            Na: ADINPLAY_BANNER("aqnvgcpz05orkobh", atob("V1JNX3dvcm1hdGUtaW9fMzAweDI1MA==")),
            K: ADINPLAY_BANNER("ltmolilci1iurq1i", atob("d29ybWF0ZS1pb185NzB4MjUw")),
            sa: ADINPLAY_PREROLL_PLAYER(),
            e: 4,
            pa: !1,
            vk: !0
        }, ENV_MAP.miniclip = {
            Na: ADINPLAY_BANNER("aqnvgcpz05orkobh", atob("V1JNX3dvcm1hdGUtaW9fMzAweDI1MA==")),
            K: ADINPLAY_BANNER("ltmolilci1iurq1i", atob("d29ybWF0ZS1pb185NzB4MjUw")),
            sa: ADINPLAY_PREROLL_PLAYER(),
            e: 4,
            pa: !1,
            vk: !1
        };
        var env = ENV_MAP[window.ENV];
        env || (env = ENV_MAP.main), $(function() {
            FastClick.attach(document.body)
        }), addEventListener("contextmenu", function(t) {
            return t.preventDefault(), t.stopPropagation(), !1
        }), loadScript("//connect.facebook.net/" + LOCALE + "/sdk.js", "facebook-jssdk", function() {
            FB.init({
                appId: atob("ODYxOTI2ODUwNjE5MDUx"),
                cookie: !0,
                xfbml: !0,
                status: !0,
                version: "v8.0"
            })
        }), loadScript("//apis.google.com/js/api:client.js", null, function() {
            gapi.load("auth2", function() {
                GoogleAuth = gapi.auth2.init({
                    client_id: atob("OTU5NDI1MTkyMTM4LXFqcTIzbDllMG9oOGxnZDJpY25ibHJiZmJsYXI0YTJmLmFwcHMuZ29vZ2xldXNlcmNvbnRlbnQuY29t")
                })
            })
        }), loadScript("//platform.twitter.com/widgets.js", "twitter-wjs"), loadScript("//apis.google.com/js/platform.js"), _anApp = Application(), _anApp.v();
        var loopFunc = function t() {
            requestAnimationFrame(t), getApp().Qa()
        };
        loopFunc();
        var __resize = function() {
                var t = j_body.width(),
                    e = j_body.height(),
                    i = j_stretchBox.outerWidth(),
                    o = j_stretchBox.outerHeight(),
                    n = j_markupHeader.outerHeight(),
                    r = j_markupFooter.outerHeight(),
                    s = Math.min(1, Math.min((e - r - n) / o, t / i)),
                    a = "translate(-50%, -50%) scale(" + s + ")";
                j_stretchBox.css({
                    "-webkit-transform": a,
                    "-moz-transform": a,
                    "-ms-transform": a,
                    "-o-transform": a,
                    transform: a
                }), getApp().Sa(), window.scrollTo(0, 1)
            },
            j_body = $("body"),
            j_stretchBox = $("#stretch-box"),
            j_markupHeader = $("#markup-header"),
            j_markupFooter = $("#markup-footer");
        __resize(), $(window).resize(__resize)
    }()
});

window.multiplier = .1625;
window.onwheel = (event) => {
    if (event.deltaY < 0) {
        window.multiplier *= 1.25;
    } else {
        window.multiplier *= 0.75;
    }
    window.changedNf();
}
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
};