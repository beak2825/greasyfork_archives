// ==UserScript==
// @name         aespa Bouquet fix
// @version      1.0
// @description  fixes the bouquet bug wew
// @author       isuprel
// @match        https://betterthingsbyaespa.com/bouquet
// @grant        none
// @license      MIT
// @namespace https://greasyfork.org/users/1165393
// @downloadURL https://update.greasyfork.org/scripts/474454/aespa%20Bouquet%20fix.user.js
// @updateURL https://update.greasyfork.org/scripts/474454/aespa%20Bouquet%20fix.meta.js
// ==/UserScript==

(function() {
    'use strict';

    (self.webpackChunk_N_E = self.webpackChunk_N_E || []).push([[95], {
    5933: function (n, e, t) {
        "use strict";
        t.d(e, {
            Z6: function () {
                return l
            },
            kk: function () {
                return g
            },
            lU: function () {
                return f
            },
            qO: function () {
                return d
            },
            wN: function () {
                return h
            }
        });
        var r = t(7297)
            , i = t(9521);
        function o() {
            var n = (0,
                r.Z)(["\n  display: flex;\n  flex-direction: column;\n  align-items: center;\n  justify-content: space-between;\n"]);
            return o = function () {
                return n
            }
                ,
                n
        }
        function a() {
            var n = (0,
                r.Z)(["\n  display: flex;\n  justify-content: center;\n  align-items: center;\n  gap: 10px;\n  margin-top: 10px;\n  min-height: 75px;\n\n  ", " {\n    margin-top: 10px;\n    min-height: 40px;\n  }\n"]);
            return a = function () {
                return n
            }
                ,
                n
        }
        function c() {
            var n = (0,
                r.Z)(["\n  margin: 50px 0 50px 0;\n  text-align: center;\n  min-height: 75px;\n\n  ", " {\n    margin: 40px 0;\n    min-height: 30px;\n  }\n"]);
            return c = function () {
                return n
            }
                ,
                n
        }
        function s() {
            var n = (0,
                r.Z)(["\n  color: #aaa;\n  margin: 20px 0 0 0;\n"]);
            return s = function () {
                return n
            }
                ,
                n
        }
        function u() {
            var n = (0,
                r.Z)(["\n  color: #888;\n  margin: 5px 0 10px;\n  font-size: 10px;\n"]);
            return u = function () {
                return n
            }
                ,
                n
        }
        var l = i.default.div.withConfig({
            componentId: "sc-ea79c2f8-0"
        })(o())
            , d = i.default.div.withConfig({
                componentId: "sc-ea79c2f8-1"
            })(a(), (function (n) {
                return n.theme.mediaMax.medium
            }
            ))
            , f = i.default.div.withConfig({
                componentId: "sc-ea79c2f8-2"
            })(c(), (function (n) {
                return n.theme.mediaMax.medium
            }
            ))
            , h = i.default.p.withConfig({
                componentId: "sc-ea79c2f8-3"
            })(s())
            , g = i.default.p.withConfig({
                componentId: "sc-ea79c2f8-4"
            })(u())
    },
    2369: function (n, e, t) {
        "use strict";
        t.d(e, {
            VY: function () {
                return m
            }
        });
        var r = t(7297)
            , i = t(5893)
            , o = t(7294)
            , a = t(9521)
            , c = t(1221);
        function s() {
            var n = (0,
                r.Z)(["\n      text-align: center;\n      width: 60vw;\n      max-width: 500px;\n    "]);
            return s = function () {
                return n
            }
                ,
                n
        }
        function u() {
            var n = (0,
                r.Z)(["\n      width: unset;\n      max-width: 80vw;\n\n      text-transform: uppercase;\n      text-align: center;\n    "]);
            return u = function () {
                return n
            }
                ,
                n
        }
        function l() {
            var n = (0,
                r.Z)(["\n  overflow: hidden;\n  z-index: ", ";\n\n  width: 80vw;\n  max-width: 850px;\n  margin: 0 auto;\n\n  border: ", ";\n  border-radius: ", ";\n  background: ", ";\n  background: rgba(40, 40, 40, 0.3);\n  box-shadow: 0 4px 16px 4px rgba(0, 0, 0, 0.4);\n  backdrop-filter: blur(18px);\n\n  transition: all 1s cubic-bezier(0.6, 0.01, 0, 0.9);\n\n  ", "\n\n  ", "\n\n  ", " {\n    width: 90vw;\n    width: 100%;\n  }\n"]);
            return l = function () {
                return n
            }
                ,
                n
        }
        function d() {
            var n = (0,
                r.Z)(["\n  overflow-y: auto;\n  overflow-x: hidden;\n  position: relative;\n  height: calc(100% - 45px);\n  padding: 24px;\n  scrollbar-width: none;\n  scrollbar-color: gray white;\n\n  @media only screen and (max-width: 799px) {\n    min-height: auto;\n    height: calc(100% - 45px);\n    bottom: 0;\n  }\n"]);
            return d = function () {
                return n
            }
                ,
                n
        }
        function f() {
            var n = (0,
                r.Z)(["\n  display: flex;\n  flex-direction: row;\n  align-items: center;\n  justify-items: space-between;\n  padding: 12px 16px;\n  border-bottom: ", ";\n\n  @media only screen and (max-width: 600px) {\n    position: relative;\n  }\n"]);
            return f = function () {
                return n
            }
                ,
                n
        }
        function h() {
            var n = (0,
                r.Z)(["\n  display: flex;\n  flex-direction: row;\n  align-items: center;\n  justify-content: center;\n  justify-items: space-between;\n  gap: 8px;\n  width: 100%;\n  text-transform: uppercase;\n  text-align: center;\n\n  span {\n    font-size: ", ";\n    line-height: 24px;\n    font-weight: bold;\n\n    ", " {\n      font-size: ", ";\n    }\n  }\n"]);
            return h = function () {
                return n
            }
                ,
                n
        }
        var g = function (n) {
            var e = n.className
                , t = n.children
                , r = n.title
                , o = n.icon
                , a = n.size
                , s = n.white
                , u = n.id
                , l = void 0 === u ? "" : u
                , d = n.ContentWrapper
                , f = void 0 === d ? m : d;
            return (0,
                i.jsxs)(p, {
                    className: e,
                    size: a,
                    white: s,
                    id: l,
                    children: [r && (0,
                        i.jsx)(x, {
                            children: (0,
                                i.jsxs)(v, {
                                    children: [o && (0,
                                        i.jsx)(c.ZP, {
                                            svg: o,
                                            size: 24,
                                            color: "primary",
                                            style: {
                                                transform: "scale(-1, -1)"
                                            }
                                        }), (0,
                                            i.jsx)("span", {
                                                children: r
                                            }), o && (0,
                                                i.jsx)(c.ZP, {
                                                    svg: o,
                                                    size: 24,
                                                    color: "primary"
                                                })]
                                })
                        }), (0,
                            i.jsx)(f, {
                                children: t
                            })]
                })
        };
        e.ZP = o.memo(g);
        var p = a.default.div.withConfig({
            componentId: "sc-9e48f54b-0"
        })(l(), (function (n) {
            return n.theme.zIndex.container
        }
        ), (function (n) {
            return n.theme.borders.thin
        }
        ), (function (n) {
            return n.theme.radii[4]
        }
        ), (function (n) {
            var e = n.theme;
            return n.white ? "rgba(40, 40, 40, 0.3)" : e.colors.alpha
        }
        ), (function (n) {
            return "small" === n.size && (0,
                a.css)(s())
        }
        ), (function (n) {
            return "tiny" === n.size && (0,
                a.css)(u())
        }
        ), (function (n) {
            return n.theme.mediaMax.small
        }
        ))
            , m = a.default.div.withConfig({
                componentId: "sc-9e48f54b-1"
            })(d())
            , x = a.default.div.withConfig({
                componentId: "sc-9e48f54b-2"
            })(f(), (function (n) {
                return n.theme.borders.thin
            }
            ))
            , v = a.default.div.withConfig({
                componentId: "sc-9e48f54b-3"
            })(h(), (function (n) {
                return n.theme.fontSizes.large
            }
            ), (function (n) {
                return n.theme.mediaMax.medium
            }
            ), (function (n) {
                return n.theme.fontSizes.small
            }
            ))
    },
    560: function (n, e, t) {
        "use strict";
        t.d(e, {
            _: function () {
                return x
            }
        });
        var r = t(7297)
            , i = t(5893)
            , o = t(9521)
            , a = t(7294)
            , c = t(120);
        function s() {
            var n = (0,
                r.Z)([""]);
            return s = function () {
                return n
            }
                ,
                n
        }
        function u() {
            var n = (0,
                r.Z)(["\n  font-size: 25px;\n  margin: 0;\n  font-family: monospace;\n  color: ", ";\n"]);
            return u = function () {
                return n
            }
                ,
                n
        }
        var l = o.default.section.withConfig({
            componentId: "sc-8bf873a-0"
        })(s())
            , d = o.default.h1.withConfig({
                componentId: "sc-8bf873a-1"
            })(u(), (function (n) {
                return n.theme.colors.blueLight
            }
            ))
            , f = 6e4
            , h = 36e5
            , g = 24 * h
            , p = function (n) {
                var e = n.onDone
                    , t = void 0 === e ? function () { }
                        : e
                    , r = (0,
                        a.useState)(!1)
                    , o = r[0]
                    , s = r[1]
                    , u = (0,
                        a.useState)({
                            days: 0,
                            hours: 0,
                            minutes: 0,
                            seconds: 0
                        })
                    , p = u[0]
                    , m = u[1]
                    , x = (0,
                        a.useRef)();
                return (0,
                    a.useEffect)((function () {
                        var n = function () {
                            var e = c.ou.now().setZone("America/Los_Angeles")
                                , r = e.plus({
                                    days: 1
                                }).startOf("day").valueOf() - e.valueOf();
                            r > 0 ? (m({
                                days: Math.floor(r / g),
                                hours: Math.floor(r % g / h),
                                minutes: Math.floor(r % h / f),
                                seconds: Math.floor(r % f / 1e3)
                            }),
                                x.current = setTimeout(n, 1e3)) : (s(!0),
                                    t())
                        };
                        return s(!1),
                            n(),
                            function () {
                                clearTimeout(x.current)
                            }
                    }
                    ), [t]),
                    !o && (0,
                        i.jsx)(l, {
                            children: (0,
                                i.jsxs)(d, {
                                    children: [1 === p.hours.toString().length ? "0".concat(p.hours) : p.hours, ":", 1 === p.minutes.toString().length ? "0".concat(p.minutes) : p.minutes, ":", 1 === p.seconds.toString().length ? "0".concat(p.seconds) : p.seconds]
                                })
                        })
            };
        function m() {
            var n = (0,
                r.Z)(["\n  z-index: 2;\n  position: absolute;\n  width: 100%;\n  height: 100%;\n  display: flex;\n  align-items: center;\n  justify-content: center;\n  flex-direction: column;\n  z-index: 30;\n\n  padding: 0px 20px;\n\n  background: rgba(40, 40, 40, 0.5);\n  backdrop-filter: blur(2px);\n"]);
            return m = function () {
                return n
            }
                ,
                n
        }
        var x = function (n) {
            var e = n.onDone;
            return (0,
                i.jsx)(v, {
                    children: (0,
                        i.jsx)(p, {
                            onDone: e
                        })
                })
        }
            , v = o.default.div.withConfig({
                componentId: "sc-c90fe427-0"
            })(m())
    },
    7879: function (n, t, r) {
        "use strict";
        r.d(t, {
            Z: function () {
                return A
            }
        });
        var i = r(603)
            , o = r(7297)
            , a = r(5893)
            , c = r(7294)
            , s = r(9521)
            , u = r(6005)
            , l = r(6008)
            , d = r(7568)
            , f = r(655)
            , h = r(987);
        function g(n, e, t, r, i, o) {
            n.beginPath(),
                n.moveTo(e + o, t),
                n.arcTo(e + r, t, e + r, t + i, o),
                n.arcTo(e + r, t + i, e, t + i, o),
                n.arcTo(e, t + i, e, t, o),
                n.arcTo(e, t, e + r, t, o),
                n.closePath()
        }
        function p(n, e, t, r, i) {
            var o = arguments.length > 5 && void 0 !== arguments[5] ? arguments[5] : 60
                , a = arguments.length > 6 && void 0 !== arguments[6] ? arguments[6] : 200
                , c = 30
                , s = c / 2
                , u = (e.width - a) / 2;
            g(n, u, o, a, c, s),
                n.fillStyle = r,
                n.fill(),
                n.fillStyle = i,
                n.textAlign = "center",
                n.textBaseline = "middle",
                n.font = "14px monospace",
                n.fillText(t.toUpperCase(), u + a / 2, o + 1 + c / 2)
        }
        var m = function (n) {
            var e = n.health
                , t = void 0 === e ? 0 : e
                , r = n.cardNumber
                , i = n.demo
                , o = void 0 !== i && i
                , s = n.onRender
                , u = (0,
                    h.getFlowerStateFromHealth)(t)
                , l = u.flowerImage
                , m = u.status
                , x = u.bgColor
                , v = u.textColor
                , b = (0,
                    c.useRef)(null);
            return (0,
                c.useEffect)((function () {
                    var n = function () {
                        var n = (0,
                            d.Z)((function () {
                                var n, e, t, i, a, c, u, d;
                                return (0,
                                    f.__generator)(this, (function (f) {
                                        switch (f.label) {
                                            case 0:
                                                return n = b.current,
                                                    e = n.getContext("2d"),
                                                    "/images/index/card-background.v4.webp",
                                                    "/images/logo-better-things.webp",
                                                    (t = new Image).src = "/images/index/card-background.v4.webp",
                                                    (i = new Image).src = o ? "/images/index/bouquet.demo.webp" : l,
                                                    (a = new Image).src = "/images/logo-better-things.webp",
                                                    c = new Promise((function (n) {
                                                        return t.onload = n
                                                    }
                                                    )),
                                                    u = new Promise((function (n) {
                                                        return i.onload = n
                                                    }
                                                    )),
                                                    d = new Promise((function (n) {
                                                        return a.onload = n
                                                    }
                                                    )),
                                                    [4, Promise.all([c, u, d])];
                                            case 1:
                                                return f.sent(),
                                                    e.save(),
                                                    function (n, e, t, r) {
                                                        var i = function (n, e) {
                                                            var t = .82 * n.width
                                                                , r = .585 * n.height
                                                                , i = 650 / 666;
                                                            return i > t / r ? r = t / i : t = r * i,
                                                            {
                                                                targetWidth: t,
                                                                targetHeight: r
                                                            }
                                                        }(t)
                                                            , o = i.targetWidth
                                                            , a = i.targetHeight
                                                            , c = .102 * t.width;
                                                        g(n, c, 120, o, a, r),
                                                            n.clip(),
                                                            n.drawImage(e, c, 120, o, a)
                                                    }(e, i, n, 15),
                                                    e.restore(),
                                                    e.drawImage(t, 0, 0, n.width, n.height),
                                                    o || p(e, n, m, x, v, 77),
                                                    r && p(e, n, "#".concat(r), "#fff0", "#000", 647, 265),
                                                    s && s(),
                                                    [2]
                                        }
                                    }
                                    ))
                            }
                            ));
                        return function () {
                            return n.apply(this, arguments)
                        }
                    }();
                    b.current && n()
                }
                ), [t, r, l, x, v, m]),
                (0,
                    a.jsx)("canvas", {
                        id: "card-canvas",
                        ref: b,
                        width: "500",
                        height: "698"
                    })
        };
        function x() {
            var n = (0,
                o.Z)(["\n  opacity: 0;\n  animation: ", " 500ms forwards;\n  animation-delay: 500ms;\n"]);
            return x = function () {
                return n
            }
                ,
                n
        }
        function v() {
            var n = (0,
                o.Z)(["\n  opacity: ", ";\n  transition: opacity 500ms ease-out;\n  transform-origin: top center;\n  max-width: 100%;\n"]);
            return v = function () {
                return n
            }
                ,
                n
        }
        function b() {
            var n = (0,
                o.Z)(["\n  position: absolute;\n  top: 20px;\n  left: 10px;\n  max-height: 100px;\n  max-width: 100px;\n\n  border-radius: 50%;\n\n  background: radial-gradient(ellipse at top center, #ff359d99, transparent),\n    radial-gradient(ellipse at bottom center, #ff359d77, transparent);\n\n  backdrop-filter: blur(10px);\n  border: 1px solid #ff359d33;\n\n  z-index: 1337;\n  color: white;\n\n  margin: 20px auto 0px auto;\n\n  display: flex;\n  flex-direction: column;\n  justify-content: center;\n  align-items: center;\n  font-size: 12px;\n  font-weight: 700;\n\n  transform: rotate(-10deg);\n"]);
            return b = function () {
                return n
            }
                ,
                n
        }
        function w() {
            var n = (0,
                o.Z)(["\n  width: 100%;\n  max-width: 400px;\n\n  margin: 0 auto;\n  position: relative;\n  display: block;\n  border-radius: 25px;\n  box-shadow: 0px 30px 100px -10px rgba(255, 0, 153, 0.6);\n  transition: box-shadow 0.5s, opacity 0.5s;\n  will-change: transform;\n  touch-action: none;\n  cursor: move;\n  overflow: visible;\n\n  &:hover {\n    box-shadow: 0px 30px 150px -10px rgba(255, 0, 153, 0.8);\n  }\n  canvas {\n    overflow: hidden;\n    display: block;\n  }\n\n  > * {\n    width: 100%;\n    height: 100%;\n  }\n"]);
            return w = function () {
                return n
            }
                ,
                n
        }
        var j = function (n) {
            var t = n.className
                , r = void 0 === t ? "card" : t
                , o = n.health
                , s = n.cardNumber
                , d = n.demo
                , f = void 0 !== d && d
                , h = (0,
                    c.useState)(!1)
                , g = h[0]
                , p = h[1];
            (0,
                c.useEffect)((function () {
                    var n = function () {
                        return e.preventDefault()
                    };
                    return document.addEventListener("gesturestart", n),
                        document.addEventListener("gesturechange", n),
                        function () {
                            document.removeEventListener("gesturestart", n),
                                document.removeEventListener("gesturechange", n)
                        }
                }
                ), []);
            var x = (0,
                c.useRef)(null)
                , v = (0,
                    i.Z)((0,
                        u.q_)((function () {
                            return {
                                rotateX: 0,
                                rotateY: 0,
                                rotateZ: 0,
                                scale: 1,
                                zoom: 0,
                                x: 0,
                                y: 0,
                                config: {
                                    mass: 5,
                                    tension: 350,
                                    friction: 40
                                }
                            }
                        }
                        )), 2)
                , b = v[0]
                , w = b.x
                , j = b.y
                , A = b.rotateX
                , k = b.rotateY
                , S = b.rotateZ
                , L = b.zoom
                , E = b.scale
                , T = v[1];
            return (0,
                l.T2)({
                    onMove: function (n) {
                        var e = n.xy
                            , t = function (n, e) {
                                var t = (0,
                                    i.Z)(e, 2)
                                    , r = t[0]
                                    , o = t[1]
                                    , a = n.getBoundingClientRect()
                                    , c = a.left + a.width / 2;
                                return {
                                    rotateX: .05 * (o - (a.top + a.height / 2)),
                                    rotateY: -.05 * (r - c)
                                }
                            }(x.current, e)
                            , r = t.rotateX
                            , o = t.rotateY;
                        return T.start({
                            rotateX: r,
                            rotateY: o,
                            scale: 1.05
                        })
                    },
                    onHover: function (n) {
                        return !n.hovering && T.start({
                            rotateX: 0,
                            rotateY: 0,
                            scale: 1
                        })
                    }
                }, {
                    domTarget: x,
                    eventOptions: {
                        passive: !1
                    }
                }),
                (0,
                    a.jsx)(y, {
                        className: r,
                        children: (0,
                            a.jsx)(C, {
                                visible: g,
                                children: (0,
                                    a.jsxs)(I, {
                                        ref: x,
                                        className: "card-container",
                                        style: {
                                            transform: "perspective(600px)",
                                            x: w,
                                            y: j,
                                            scale: (0,
                                                u.to)([E, L], (function (n, e) {
                                                    return n + e
                                                }
                                                )),
                                            rotateX: A,
                                            rotateY: k,
                                            rotateZ: S
                                        },
                                        children: [f && (0,
                                            a.jsx)(Z, {
                                                children: "EXAMPLE"
                                            }), (0,
                                                a.jsx)(m, {
                                                    demo: f,
                                                    health: o,
                                                    cardNumber: s,
                                                    onRender: function () {
                                                        return p(!0)
                                                    }
                                                })]
                                    })
                            })
                    })
        }
            , y = s.default.div.withConfig({
                componentId: "sc-b47b84ec-0"
            })(x(), (function (n) {
                return n.theme.animations.slideUpFadeIn
            }
            ))
            , C = s.default.div.withConfig({
                componentId: "sc-b47b84ec-1"
            })(v(), (function (n) {
                return n.visible ? 1 : 0
            }
            ))
            , Z = s.default.div.withConfig({
                componentId: "sc-b47b84ec-2"
            })(b())
            , I = (0,
                s.default)(u.q.div).withConfig({
                    componentId: "sc-b47b84ec-3"
                })(w())
            , A = (0,
                c.memo)(j)
    },
    7501: function (n, e, t) {
        "use strict";
        t.d(e, {
            T4: function () {
                return f
            },
            X7: function () {
                return h
            },
            Yu: function () {
                return g
            }
        });
        var r = t(7297)
            , i = t(5893)
            , o = (t(7294),
                t(9521))
            , a = t(987);
        function c() {
            var n = (0,
                r.Z)(["\n  overflow: hidden;\n  position: relative;\n\n  display: flex;\n  flex-direction: row;\n  justify-content: flex-start;\n  align-items: center;\n\n  width: 400px;\n  max-width: 90%;\n  height: 30px;\n  margin: 0px auto 50px auto;\n  padding: 0 2px;\n\n  border-radius: ", ";\n  transition: all 1s cubic-bezier(0.6, 0.01, 0, 0.9);\n  background: ", ";\n"]);
            return c = function () {
                return n
            }
                ,
                n
        }
        function s() {
            var n = (0,
                r.Z)(["\n  display: flex;\n  justify-content: flex-end;\n  align-items: center;\n  width: ", "%;\n  height: 85%;\n  color: ", ";\n  padding: 0 10px;\n  border-radius: ", ";\n  background-color: ", ";\n  transition: all 1s cubic-bezier(0.6, 0.01, 0, 0.9);\n  z-index: 1;\n  position: relative;\n"]);
            return s = function () {
                return n
            }
                ,
                n
        }
        function u() {
            var n = (0,
                r.Z)(["\n  margin: -40px auto 30px auto;\n  width: 400px;\n  max-width: 90%;\n  flex-direction: row;\n  display: flex;\n  justify-content: space-between;\n"]);
            return u = function () {
                return n
            }
                ,
                n
        }
        function l() {
            var n = (0,
                r.Z)(["\n  font-size: 10px;\n  text-transform: uppercase;\n  color: ", ";\n"]);
            return l = function () {
                return n
            }
                ,
                n
        }
        var d = Object.values(a.FLOWER_STATES)
            , f = function (n) {
                var e = n.health
                    , t = (0,
                        a.getFlowerStateFromHealth)(e);
                return (0,
                    i.jsxs)("div", {
                        style: {
                            margin: "0 0 20px 0"
                        },
                        children: [(0,
                            i.jsx)(h, {
                                children: (0,
                                    i.jsxs)(g, {
                                        health: e,
                                        colorText: t.bgColor,
                                        children: [e, "%"]
                                    })
                            }), (0,
                                i.jsx)(p, {
                                    children: d.map((function (n, e) {
                                        var t = n.status
                                            , r = n.bgColor;
                                        return (0,
                                            i.jsx)(m, {
                                                color: r,
                                                children: t
                                            }, t)
                                    }
                                    ))
                                })]
                    })
            }
            , h = o.default.div.withConfig({
                componentId: "sc-ed610bdc-0"
            })(c(), (function (n) {
                return n.theme.radii[6]
            }
            ), (function (n) {
                var e = n.colorBg;
                return e || "linear-gradient(\n            to right,\n            #ea3939aa 0%,\n            #ffff00aa 25%,\n            #ffff00aa 50%,\n            #00ff4caa 75%,\n            #ff359daa 90%\n          );"
            }
            ))
            , g = o.default.div.withConfig({
                componentId: "sc-ed610bdc-1"
            })(s(), (function (n) {
                var e = n.health;
                return Math.ceil(e)
            }
            ), (function (n) {
                return n.color
            }
            ), (function (n) {
                return n.theme.radii[6]
            }
            ), (function (n) {
                var e = n.colorMeterBg;
                return e || "rgb(17, 17, 18)"
            }
            ))
            , p = o.default.div.withConfig({
                componentId: "sc-ed610bdc-2"
            })(u())
            , m = o.default.span.withConfig({
                componentId: "sc-ed610bdc-3"
            })(l(), (function (n) {
                return n.color
            }
            ))
    },
    9997: function (n, e, t) {
        "use strict";
        t.d(e, {
            D: function () {
                return u
            }
        });
        var r = t(7297)
            , i = t(5893)
            , o = (t(7294),
                t(9521));
        function a() {
            var n = (0,
                r.Z)(["\n  position: relative;\n  display: grid;\n  grid-template-columns: repeat(5, 1fr);\n\n  background-color: #aaa5;\n  grid-gap: 1px;\n  border-radius: 10px;\n  box-shadow: 0 0 20px 0px #aaa3;\n  overflow: hidden;\n"]);
            return a = function () {
                return n
            }
                ,
                n
        }
        function c() {
            var n = (0,
                r.Z)(["\n  background-color: ", ";\n  display: flex;\n  align-items: center;\n  justify-content: center;\n  color: white;\n  font-size: 16px;\n  padding: 15px;\n  font-family: monospace;\n  max-height: 300px;\n  flex-direction: column;\n  position: relative;\n\n  ", "\n"]);
            return c = function () {
                return n
            }
                ,
                n
        }
        var s = function () {
            var n = arguments.length > 0 && void 0 !== arguments[0] ? arguments[0] : "\ud83d\udca7"
                , e = arguments.length > 1 ? arguments[1] : void 0
                , t = arguments.length > 2 ? arguments[2] : void 0
                , r = arguments.length > 3 ? arguments[3] : void 0;
            return t ? n : "past" === e ? "\u2620\ufe0f" : r + 1
        }
            , u = o.default.div.withConfig({
                componentId: "sc-adb2b82f-0"
            })(a())
            , l = o.default.div.withConfig({
                componentId: "sc-adb2b82f-1"
            })(c(), (function (n) {
                return n.checked ? "#555" : "#222"
            }
            ), "");
        e.Z = function (n) {
            var e = n.emoji
                , t = n.checked
                , r = n.status
                , o = n.index;
            return (0,
                i.jsx)(l, {
                    checked: "today" === r,
                    index: o,
                    children: s(e, r, t, o)
                })
        }
    },
    9068: function (n, e, t) {
        "use strict";
        var r = t(7297)
            , i = t(5893)
            , o = (t(7294),
                t(9521))
            , a = t(2369)
            , c = t(5029)
            , s = t(7879)
            , u = t(1221);
        function l() {
            var n = (0,
                r.Z)(["\n  max-width: 300px;\n  margin: 0 auto;\n"]);
            return l = function () {
                return n
            }
                ,
                n
        }
        function d() {
            var n = (0,
                r.Z)(["\n  gap: 20px;\n"]);
            return d = function () {
                return n
            }
                ,
                n
        }
        function f() {
            var n = (0,
                r.Z)(["\n  margin: 20px 0;\n  line-height: 40px;\n  padding: 0 50px;\n  text-align: center;\n\n  ", " {\n    margin: 20px 0 30px 0;\n    line-height: 30px;\n    padding: 0 50px;\n    text-align: center;\n  }\n"]);
            return f = function () {
                return n
            }
                ,
                n
        }
        function h() {
            var n = (0,
                r.Z)(["\n  display: flex;\n  flex-direction: column-reverse;\n  align-items: center;\n"]);
            return h = function () {
                return n
            }
                ,
                n
        }
        function g() {
            var n = (0,
                r.Z)(["\n  flex-direction: row;\n  align-items: start;\n  margin: 40px 20px;\n  padding: 20px 0 40px;\n\n  &:nth-child(odd) {\n    flex-direction: row-reverse;\n  }\n\n  img {\n    object-fit: cover;\n    border-radius: 10px;\n  }\n\n  h4 {\n    font-size: ", ";\n    margin: 0 0 10px;\n  }\n\n  ul {\n    margin: 0;\n    padding: 0;\n    list-style: none;\n\n    li {\n      display: flex;\n      margin: 4px 0;\n      line-height: 1.25;\n\n      &::before {\n        content: '\u2022';\n        color: ", ";\n        margin: 0 10px 0 0;\n      }\n\n      span {\n        color: ", ";\n      }\n    }\n  }\n\n  ", " {\n    > div {\n      width: 70%;\n    }\n  }\n  ", " {\n    margin: 0px 10px;\n    img {\n      min-width: 100%;\n    }\n  }\n"]);
            return g = function () {
                return n
            }
                ,
                n
        }
        function p() {
            var n = (0,
                r.Z)(["\n  margin: 0 0 20px;\n  padding: 6px 20px;\n  border-radius: ", ";\n  background-color: ", ";\n  border: 1px solid ", ";\n  color: ", ";\n"]);
            return p = function () {
                return n
            }
                ,
                n
        }
        e.Z = function () {
            return (0,
                i.jsxs)(x, {
                    title: "Rewards",
                    icon: u.J4,
                    children: [(0,
                        i.jsxs)(v, {
                            children: [(0,
                                i.jsx)("p", {
                                    children: "Every participant will receive a custom 1/1 digital collectible bouquet."
                                }), (0,
                                    i.jsx)("p", {
                                        children: 'Fans who keep their Bouquet healthy by watering (aka listening and sharing "Better Things") will unlock access to more rewards.'
                                    })]
                        }), (0,
                            i.jsxs)(b, {
                                children: [(0,
                                    i.jsxs)(w, {
                                        children: [(0,
                                            i.jsx)("img", {
                                                src: "/images/rewards/t-shirt.webp",
                                                alt: "t-shirt price"
                                            }), (0,
                                                i.jsxs)("div", {
                                                    children: [(0,
                                                        i.jsx)("h4", {
                                                            children: "Reward Level"
                                                        }), (0,
                                                            i.jsx)(j, {
                                                                color: "#FC5EFF",
                                                                children: "Thriving"
                                                            }), (0,
                                                                i.jsxs)("ul", {
                                                                    children: [(0,
                                                                        i.jsx)("li", {
                                                                            children: (0,
                                                                                i.jsx)("div", {
                                                                                    children: "1/1 Digital Collectible"
                                                                                })
                                                                        }), (0,
                                                                            i.jsx)("li", {
                                                                                children: (0,
                                                                                    i.jsx)("div", {
                                                                                        children: "Animated Digital Signature"
                                                                                    })
                                                                            }), (0,
                                                                                i.jsx)("li", {
                                                                                    children: (0,
                                                                                        i.jsxs)("div", {
                                                                                            children: ["Access to purchase Bundle 1:", (0,
                                                                                                i.jsx)("br", {}), " Notepad ", (0,
                                                                                                    i.jsx)("span", {
                                                                                                        children: "+"
                                                                                                    }), " Sticker Sheet ", (0,
                                                                                                        i.jsx)("span", {
                                                                                                            children: "+"
                                                                                                        }), "Photo Card"]
                                                                                        })
                                                                                }), (0,
                                                                                    i.jsx)("li", {
                                                                                        children: (0,
                                                                                            i.jsxs)("div", {
                                                                                                children: ["Access to purchase Bundle 2:", (0,
                                                                                                    i.jsx)("br", {}), " T-Shirt ", (0,
                                                                                                        i.jsx)("span", {
                                                                                                            children: "+"
                                                                                                        }), " extra surprise."]
                                                                                            })
                                                                                    })]
                                                                })]
                                                })]
                                    }), (0,
                                        i.jsxs)(w, {
                                            children: [(0,
                                                i.jsx)("img", {
                                                    src: "/images/rewards/notepad-sticker.jpg",
                                                    alt: "notepad stickersheet price"
                                                }), (0,
                                                    i.jsxs)("div", {
                                                        children: [(0,
                                                            i.jsx)("h4", {
                                                                children: "Reward Level"
                                                            }), (0,
                                                                i.jsx)(j, {
                                                                    color: "#36FF6E",
                                                                    children: "Blossoming"
                                                                }), (0,
                                                                    i.jsxs)("ul", {
                                                                        children: [(0,
                                                                            i.jsx)("li", {
                                                                                children: (0,
                                                                                    i.jsx)("div", {
                                                                                        children: "1/1 Digital Collectible"
                                                                                    })
                                                                            }), (0,
                                                                                i.jsx)("li", {
                                                                                    children: (0,
                                                                                        i.jsx)("div", {
                                                                                            children: "Animated Digital Signature"
                                                                                        })
                                                                                }), (0,
                                                                                    i.jsx)("li", {
                                                                                        children: (0,
                                                                                            i.jsxs)("div", {
                                                                                                children: ["Access to purchase Bundle 1: ", (0,
                                                                                                    i.jsx)("br", {}), "Notepad ", (0,
                                                                                                        i.jsx)("span", {
                                                                                                            children: "+"
                                                                                                        }), " Sticker Sheet ", (0,
                                                                                                            i.jsx)("span", {
                                                                                                                children: "+"
                                                                                                            }), " Photo Card"]
                                                                                            })
                                                                                    })]
                                                                    })]
                                                    })]
                                        }), (0,
                                            i.jsxs)(w, {
                                                children: [(0,
                                                    i.jsx)("img", {
                                                        src: "/images/rewards/aespa-signature-c.gif",
                                                        alt: "Signature gif"
                                                    }), (0,
                                                        i.jsxs)("div", {
                                                            children: [(0,
                                                                i.jsx)("h4", {
                                                                    children: "Reward Level"
                                                                }), (0,
                                                                    i.jsx)(j, {
                                                                        color: "#FFF964",
                                                                        children: "Budding"
                                                                    }), (0,
                                                                        i.jsxs)("ul", {
                                                                            children: [(0,
                                                                                i.jsx)("li", {
                                                                                    children: (0,
                                                                                        i.jsx)("div", {
                                                                                            children: "1/1 Digital Collectible"
                                                                                        })
                                                                                }), (0,
                                                                                    i.jsx)("li", {
                                                                                        children: (0,
                                                                                            i.jsx)("div", {
                                                                                                children: "Animated Digital Signature"
                                                                                            })
                                                                                    })]
                                                                        })]
                                                        })]
                                            }), (0,
                                                i.jsxs)(w, {
                                                    children: [(0,
                                                        i.jsx)(m, {
                                                            demo: !0,
                                                            cardNumber: Math.floor(1e7 * Math.random()),
                                                            width: 200
                                                        }), (0,
                                                            i.jsxs)("div", {
                                                                children: [(0,
                                                                    i.jsx)("h4", {
                                                                        children: "Reward Level"
                                                                    }), (0,
                                                                        i.jsx)(j, {
                                                                            color: "#FF6464",
                                                                            children: "Wilting"
                                                                        }), (0,
                                                                            i.jsx)("ul", {
                                                                                children: (0,
                                                                                    i.jsx)("li", {
                                                                                        children: (0,
                                                                                            i.jsx)("div", {
                                                                                                children: "1/1 Digital Collectible"
                                                                                            })
                                                                                    })
                                                                            })]
                                                            })]
                                                })]
                            })]
                })
        }
            ;
        var m = (0,
            o.default)(s.Z).withConfig({
                componentId: "sc-4995bf0a-0"
            })(l())
            , x = (0,
                o.default)(a.ZP).withConfig({
                    componentId: "sc-4995bf0a-1"
                })(d())
            , v = o.default.h4.withConfig({
                componentId: "sc-4995bf0a-2"
            })(f(), (function (n) {
                return n.theme.mediaMax.medium
            }
            ))
            , b = o.default.div.withConfig({
                componentId: "sc-4995bf0a-3"
            })(h())
            , w = (0,
                o.default)(c.Z).withConfig({
                    componentId: "sc-4995bf0a-4"
                })(g(), (function (n) {
                    return n.theme.fontSizes.regular
                }
                ), (function (n) {
                    return n.theme.colors.states.thriving
                }
                ), (function (n) {
                    return n.theme.colors.states.budding
                }
                ), (function (n) {
                    return n.theme.mediaMin.medium
                }
                ), (function (n) {
                    return n.theme.mediaMax.medium
                }
                ))
            , j = o.default.div.withConfig({
                componentId: "sc-4995bf0a-5"
            })(p(), (function (n) {
                return n.theme.radii[6]
            }
            ), (function (n) {
                return n.color
            }
            ), (function (n) {
                return n.theme.colors.alpha
            }
            ), (function (n) {
                return n.theme.colors.black
            }
            ))
    },
    5029: function (n, e, t) {
        "use strict";
        var r = t(7297);
        function i() {
            var n = (0,
                r.Z)(["\n  ", " {\n    h1 {\n      font-size: 20px;\n    }\n\n    & > :first-child {\n      margin-bottom: 24px;\n    }\n  }\n\n  ", " {\n    display: flex;\n    align-items: center;\n    gap: 24px;\n\n    & > img {\n      width: 50%;\n    }\n  }\n"]);
            return i = function () {
                return n
            }
                ,
                n
        }
        var o = t(9521).default.div.withConfig({
            componentId: "sc-ecd07161-0"
        })(i(), (function (n) {
            return n.theme.mediaMax.medium
        }
        ), (function (n) {
            return n.theme.mediaMin.medium
        }
        ));
        e.Z = o
    },
    3128: function (n, e, t) {
        "use strict";
        t.d(e, {
            Z: function () {
                return O
            }
        });
        var r = t(603)
            , i = t(7297)
            , o = t(5893)
            , a = t(7294)
            , c = t(9521)
            , s = t(7501)
            , u = t(987)
            , l = (t(1221),
                t(4731));
        function d() {
            var n = (0,
                i.Z)(["\n  z-index: 200;\n  position: relative;\n  width: 100%;\n  max-width: 100%;\n  margin-bottom: 0;\n"]);
            return d = function () {
                return n
            }
                ,
                n
        }
        function f() {
            var n = (0,
                i.Z)(["\n  position: relative;\n  width: 80%;\n  margin: 0 auto 50px;\n"]);
            return f = function () {
                return n
            }
                ,
                n
        }
        var h = (0,
            c.default)(s.X7).withConfig({
                componentId: "sc-c570b262-0"
            })(d())
            , g = c.default.div.withConfig({
                componentId: "sc-c570b262-1"
            })(f())
            , p = function (n) {
                var e = n.health
                    , t = n.colorBg
                    , r = void 0 === t ? null : t
                    , i = n.colorText
                    , a = void 0 === i ? null : i
                    , c = n.colorMeterBg
                    , l = void 0 === c ? null : c
                    , d = (0,
                        u.getFlowerStateFromHealth)(e);
                return (0,
                    o.jsx)(g, {
                        children: (0,
                            o.jsx)(h, {
                                colorBg: r,
                                children: (0,
                                    o.jsxs)(s.Yu, {
                                        health: e,
                                        colorText: a || d.bgColor,
                                        colorMeterBg: l,
                                        children: [e, "%"]
                                    })
                            })
                    })
            }
            , m = t(2369)
            , x = t(3448)
            , v = t(9181)
            , b = t(8186)
            , w = "HFL_AESPA";
        function j() {
            var n = (0,
                i.Z)(["\n  position: fixed;\n  top: 0;\n  left: 0;\n  z-index: 9999;\n  background: ", ";\n  width: 100%;\n  text-align: center;\n  padding: 4px;\n  color: ", ";\n  opacity: ", ";\n  box-shadow: 0 0 5px rgba(0, 0, 0, 0.5);\n  transition: opacity 0.3s ease-out;\n"]);
            return j = function () {
                return n
            }
                ,
                n
        }
        function y() {
            var n = (0,
                i.Z)(["\n  overflow: unset;\n\n  p {\n    text-align: center;\n  }\n"]);
            return y = function () {
                return n
            }
                ,
                n
        }
        function C() {
            var n = (0,
                i.Z)(["\n  padding: 24px;\n"]);
            return C = function () {
                return n
            }
                ,
                n
        }
        function Z() {
            var n = (0,
                i.Z)(["\n  display: block;\n  transform: rotate(var(--rotate, -3.5deg));\n"]);
            return Z = function () {
                return n
            }
                ,
                n
        }
        function I() {
            var n = (0,
                i.Z)([""]);
            return I = function () {
                return n
            }
                ,
                n
        }
        function A() {
            var n = (0,
                i.Z)(["\n  display: flex;\n  gap: 10px;\n  margin: 10px 0;\n"]);
            return A = function () {
                return n
            }
                ,
                n
        }
        function k() {
            var n = (0,
                i.Z)(["\n  padding: 15px 7px;\n  width: 100%;\n  ", " {\n    width: 100%;\n    max-width: 300px;\n    margin-left: 0;\n    margin-bottom: 20px;\n  }\n  ", " {\n    min-width: 54px;\n  }\n"]);
            return k = function () {
                return n
            }
                ,
                n
        }
        function S() {
            var n = (0,
                i.Z)(["\n  display: flex;\n  gap: 15px;\n  margin: 0;\n  flex-dirrection: row:\n  align-items: center;\n  justify-content: center;\n  transition: transform 0.3s ease-out;\n\n\n\n  &:nth-child(odd) {\n    flex-direction: row-reverse;\n  }\n"]);
            return S = function () {
                return n
            }
                ,
                n
        }
        function L() {
            var n = (0,
                i.Z)(["\n  position: relative;\n  display: flex;\n  flex-direction: column;\n  align-content: center;\n  justify-content: center;\n  gap: 50px;\n  max-width: 680px;\n  margin: 50px auto;\n\n  ", " {\n    &:nth-child(odd) ", " {\n      --rotate: 3.5deg;\n    }\n  }\n"]);
            return L = function () {
                return n
            }
                ,
                n
        }
        var E = [{
            image: "images/card-upgrades/card-star.webp",
            alt: "Star upgrade"
        }, {
            image: "images/card-upgrades/card-bar.webp",
            alt: "Gold Bar upgrade"
        }, {
            image: "images/card-upgrades/card-signed.webp",
            alt: "aespa Digital Signature upgrade"
        }]
            , T = function () {
                var n = (0,
                    r.Z)((0,
                        x.z)(), 2)
                    , e = n[0]
                    , t = n[1]
                    , i = !!e && !t;
                return (0,
                    o.jsx)("div", {
                        style: {
                            display: "flex",
                            flexDirection: "column",
                            alignItems: "center",
                            justifyContent: "center",
                            margin: "0 0 20px 0"
                        },
                        children: i ? (0,
                            o.jsxs)(o.Fragment, {
                                children: [(0,
                                    o.jsx)("p", {
                                        children: "Share with your friends and help everyone get signed digital bouquets!"
                                    }), (0,
                                        o.jsx)(v.P, {
                                            style: {
                                                marginTop: 0
                                            }
                                        })]
                            }) : (0,
                                o.jsxs)(o.Fragment, {
                                    children: [(0,
                                        o.jsx)("p", {
                                            children: "Create an account and start streaming!"
                                        }), (0,
                                            o.jsx)(b.CJ, {})]
                                })
                    })
            }
            , z = c.default.a.withConfig({
                componentId: "sc-79c56d30-0"
            })(j(), (function (n) {
                return n.theme.colors.primary
            }
            ), (function (n) {
                return n.theme.colors.blueLight
            }
            ), (function (n) {
                return n.hideBanner ? 0 : 1
            }
            ))
            , F = (0,
                c.default)(m.ZP).withConfig({
                    componentId: "sc-79c56d30-1"
                })(y())
            , _ = c.default.div.withConfig({
                componentId: "sc-79c56d30-2"
            })(C())
            , M = c.default.img.withConfig({
                componentId: "sc-79c56d30-3"
            })(Z())
            , D = c.default.h2.withConfig({
                componentId: "sc-79c56d30-4"
            })(I())
            , P = c.default.p.withConfig({
                componentId: "sc-79c56d30-5"
            })(A())
            , B = c.default.div.withConfig({
                componentId: "sc-79c56d30-6"
            })(k(), g, s.Yu)
            , N = c.default.div.withConfig({
                componentId: "sc-79c56d30-7"
            })(S())
            , H = c.default.div.withConfig({
                componentId: "sc-79c56d30-8"
            })(L(), N, M)
            , O = function () {
                var n = function (n) {
                    var e = (arguments.length > 1 && void 0 !== arguments[1] ? arguments[1] : {}).withPrefix
                        , t = void 0 === e || e;
                    return localStorage.getItem("".concat(t ? "".concat(w, "_") : "").concat(n))
                }("hide-banner-global-listen", {
                    withPrefix: !1
                })
                    , e = function () {
                        return function (n, e) {
                            var t = (arguments.length > 2 && void 0 !== arguments[2] ? arguments[2] : {}).withPrefix
                                , r = void 0 === t || t;
                            localStorage.setItem("".concat(r ? "".concat(w, "_") : "").concat(n), e)
                        }("hide-banner-global-listen", !0, {
                            withPrefix: !1
                        })
                    }
                    , t = (0,
                        a.useState)(n)
                    , i = t[0]
                    , c = t[1]
                    , s = !!(0,
                        r.Z)((0,
                            x.z)(), 1)[0];
                return (0,
                    o.jsxs)(o.Fragment, {
                        children: [s && (0,
                            o.jsx)(z, {
                                href: "#global-listen",
                                hideBanner: i,
                                onClick: function (n) {
                                    n.preventDefault(),
                                        document.getElementById("global-listen").scrollIntoView({
                                            behavior: "smooth"
                                        }),
                                        e(),
                                        c(!0)
                                },
                                children: "Collective challenge: win bouquet upgrades!"
                            }), (0,
                                o.jsxs)(F, {
                                    title: "Collective Fan Challenge",
                                    ContentWrapper: _,
                                    id: "global-listen",
                                    children: [(0,
                                        o.jsx)("p", {
                                            style: {
                                                maxWidth: "80%",
                                                margin: "30px auto 50px"
                                            },
                                            children: 'Help increase the total streams for "Better Things" and unlock more bouquet features for everyone. The more streams we make together, the more extra rewards we unlock. So make sure to stream and share with your friends, all streams count!'
                                        }), (0,
                                            o.jsx)("div", {
                                                children: (0,
                                                    o.jsx)(H, {
                                                        children: E.map((function (n, e) {
                                                            return (0,
                                                                o.jsxs)(N, {
                                                                    children: [(0,
                                                                        o.jsx)("div", {
                                                                            children: (0,
                                                                                o.jsx)(M, {
                                                                                    src: n.image,
                                                                                    alt: n.alt,
                                                                                    width: "240"
                                                                                })
                                                                        }), (0,
                                                                            o.jsxs)(B, {
                                                                                children: [(0,
                                                                                    o.jsxs)(D, {
                                                                                        children: ["\ud83d\udd12 ", (0,
                                                                                            o.jsx)("span", {
                                                                                                children: n.alt
                                                                                            })]
                                                                                    }), (0,
                                                                                        o.jsx)(P, {
                                                                                            children: (0,
                                                                                                o.jsxs)("span", {
                                                                                                    role: "image",
                                                                                                    "aria-label": "lock image",
                                                                                                    children: ["unlocked at ", Math.ceil(33.3 * (e + 1)), "%"]
                                                                                                })
                                                                                        })]
                                                                            })]
                                                                }, e)
                                                        }
                                                        ))
                                                    })
                                            }), (0,
                                                o.jsx)("hr", {
                                                    style: {
                                                        margin: "30px 0 50px 0",
                                                        opacity: .2
                                                    }
                                                }), (0,
                                                    o.jsx)(p, {
                                                        health: u.GLOBALLISTENHEALTH,
                                                        colorText: l.r.colors.white,
                                                        colorBg: l.r.colors.blueLight,
                                                        colorMeterBg: l.r.colors.primary
                                                    }), (0,
                                                        o.jsxs)("p", {
                                                            style: {
                                                                margin: "-20px 0 0 0"
                                                            },
                                                            children: ["Currently we're at ", u.GLOBALLISTENHEALTH, "% of our goal!", " ", u.GLOBALLISTENHEALTH < 34 ? "Keep sharing with your friends!" : u.GLOBALLISTENHEALTH < 67 ? "We unlocked the Star upgrade! Keep pushing for signed digital bouquets!" : u.GLOBALLISTENHEALTH < 100 ? "We unlocked the Golden bar upgrade!" : "We did it! Everyone will receive signed digital bouquets \ud83d\ude4c"]
                                                        }), (0,
                                                            o.jsx)(T, {})]
                                })]
                    })
            }
    },
    9181: function (n, e, t) {
        "use strict";
        t.d(e, {
            P: function () {
                return y
            }
        });
        var r = t(7568)
            , i = t(603)
            , o = t(7297)
            , a = t(655)
            , c = t(5893)
            , s = t(7294)
            , u = t(9521)
            , l = t(3448)
            , d = t(2077)
            , f = t(560)
            , h = t(9997)
            , g = t(5933)
            , p = t(1690)
            , m = t(120)
            , x = t(987);
        function v() {
            var n = (0,
                o.Z)(["\n  margin: 12px auto 0 auto;\n  text-align: center;\n  font-size: 12px;\n"]);
            return v = function () {
                return n
            }
                ,
                n
        }
        var b = "Copy Invite Link"
            , w = "Link copied!"
            , j = function () {
                var n, e = (0,
                    i.Z)((0,
                        l.z)(), 2), t = e[0], r = e[1], o = (0,
                            x.getUserMapActivationMapping)(m.ou, t), a = (0,
                                x.getDailyActivationStatus)(o).share;
                return r ? null : (0,
                    c.jsxs)(g.Z6, {
                        children: [(0,
                            c.jsx)(g.qO, {
                                children: (0,
                                    c.jsx)(y, {
                                        user: t
                                    })
                            }), (0,
                                c.jsx)(g.lU, {
                                    children: (n = a,
                                        n ? (0,
                                            c.jsx)(c.Fragment, {
                                                children: "Congratulations! You completed today\u2019s task! Come back tomorrow to share again."
                                            }) : (0,
                                                c.jsx)(c.Fragment, {
                                                    children: "Invite one friend a day to participate in this challenge to increase your bouquet\u2019s health."
                                                }))
                                }), (0,
                                    c.jsxs)(h.D, {
                                        children: [a && (0,
                                            c.jsx)(f._, {
                                                onDone: function () {
                                                    return window.location.reload()
                                                }
                                            }), Object.values(o).map((function (n, e) {
                                                var t = n.invitedCount
                                                    , r = n.status;
                                                return (0,
                                                    c.jsx)(h.Z, {
                                                        index: e,
                                                        checked: t > 0,
                                                        size: 40,
                                                        status: r,
                                                        emoji: "\ud83e\udd1d"
                                                    }, e)
                                            }
                                            ))]
                                    }), (0,
                                        c.jsx)(g.wN, {
                                            children: "Daily Share Results"
                                        }), (0,
                                            c.jsx)(g.kk, {
                                                children: "10% per registered user / max 1 per day"
                                            })]
                    })
            }
            , y = function () {
                var n = (0,
                    i.Z)((0,
                        l.z)(), 2)
                    , e = n[0]
                    , t = (n[1],
                        (0,
                            s.useState)(b))
                    , o = t[0]
                    , u = t[1]
                    , f = (0,
                        s.useCallback)((0,
                            r.Z)((function () {
                                var n;
                                return (0,
                                    a.__generator)(this, (function (t) {
                                        switch (t.label) {
                                            case 0:
                                                if (n = location.origin + "/invite/" + e.inviteCode,
                                                    !navigator.share)
                                                    return [3, 5];
                                                t.label = 1;
                                            case 1:
                                                return t.trys.push([1, 3, , 4]),
                                                    (0,
                                                        p.K)("share-link-mobile-open"),
                                                    [4, navigator.share({
                                                        title: "aespa Bouquets",
                                                        url: n
                                                    })];
                                            case 2:
                                                return t.sent(),
                                                    (0,
                                                        p.K)("share-link-mobile-shared"),
                                                    [3, 4];
                                            case 3:
                                                return "AbortError" === t.sent().name && (0,
                                                    p.K)("share-link-mobile-cancel"),
                                                    [3, 4];
                                            case 4:
                                                return [3, 6];
                                            case 5:
                                                try {
                                                    navigator.clipboard.writeText(n),
                                                        u(w),
                                                        (0,
                                                            p.K)("share-link-desktop-copied"),
                                                        setTimeout((function () {
                                                            u(b)
                                                        }
                                                        ), 2e3)
                                                } catch (r) {
                                                    prompt("Here is your Invite Url", n),
                                                        (0,
                                                            p.K)("share-link-desktop-prompt-copied"),
                                                        u(b)
                                                }
                                                t.label = 6;
                                            case 6:
                                                return [2]
                                        }
                                    }
                                    ))
                            }
                            )), [null === e || void 0 === e ? void 0 : e.inviteCode]);
                return (0,
                    c.jsx)(d.ZP, {
                        onClickCapture: f,
                        active: !0,
                        children: navigator.share ? "Share invite link" : o
                    })
            };
        u.default.p.withConfig({
            componentId: "sc-6a42c7d2-0"
        })(v());
        e.Z = (0,
            s.memo)(j)
    },
    6490: function (n, e, t) {
        "use strict";
        t.d(e, {
            mh: function () {
                return y
            }
        });
        var r = t(603)
            , i = t(7297)
            , o = t(5893)
            , a = t(7294)
            , c = t(9521)
            , s = t(9329)
            , u = t(2077)
            , l = t(698)
            , d = t(4196)
            , f = t(4731)
            , h = t(1690)
            , g = t(5933)
            , p = t(9997)
            , m = t(3448)
            , x = t(120)
            , v = t(987)
            , b = t(560);
        function w() {
            var n = (0,
                i.Z)(["\n  border-radius: 50%;\n  padding: 12px;\n\n  &:hover .amazonmusic path {\n    stroke: none;\n  }\n"]);
            return w = function () {
                return n
            }
                ,
                n
        }
        var j = function (n) {
            return n ? (0,
                o.jsx)(o.Fragment, {
                    children: "Congratulations! You completed today\u2019s task! Come back tomorrow to stream again."
                }) : (0,
                    o.jsx)(o.Fragment, {
                        children: 'Stream "Better Things" on one of the platforms below to increase your bouquet\u2019s health.'
                    })
        }
            , y = (0,
                c.default)(u.Yz).withConfig({
                    componentId: "sc-9a56e9f1-0"
                })(w());
        e.ZP = function () {
            var n = (0,
                r.Z)((0,
                    l.i)(), 1)[0]
                , e = "xsmall" === n.screenType
                , t = "small" === n.screenType
                , i = (0,
                    r.Z)((0,
                        m.z)(), 2)
                , c = i[0]
                , u = (i[1],
                    (0,
                        v.getUserMapActivationMapping)(x.ou, c))
                , w = (0,
                    v.getDailyActivationStatus)(u).listen
                , C = (0,
                    a.useCallback)((function (n) {
                        (0,
                            s.ck)(n)
                    }
                    ), []);
            return (0,
                o.jsxs)(g.Z6, {
                    children: [(0,
                        o.jsx)(g.qO, {
                            children: d.Z.map((function (n) {
                                if (n.disable)
                                    return null;
                                var r = n.id
                                    , i = n.url
                                    , a = (n.label,
                                        n.Icon);
                                return i ? (0,
                                    o.jsx)(y, {
                                        externalHref: i,
                                        onClick: function () {
                                            (0,
                                                h.K)("listen-button-click", {
                                                    platform: r
                                                }),
                                                C(r)
                                        },
                                        active: !0,
                                        children: (0,
                                            o.jsx)(a, {
                                                size: e || t ? 24 : 28,
                                                color: f.r.colors.blueLight,
                                                className: "amazonmusic" === r && "amazonmusic"
                                            })
                                    }, r) : void 0
                            }
                            ))
                        }), (0,
                            o.jsx)(g.lU, {
                                children: j(w)
                            }), (0,
                                o.jsxs)(p.D, {
                                    children: [w && (0,
                                        o.jsx)(b._, {
                                            onDone: function () {
                                                return window.location.reload()
                                            }
                                        }), Object.values(u).map((function (n, e) {
                                            var t = n.totalListens
                                                , r = n.status;
                                            return (0,
                                                o.jsx)(p.Z, {
                                                    index: e,
                                                    checked: t > 0,
                                                    size: 40,
                                                    status: r
                                                }, e)
                                        }
                                        ))]
                                }), (0,
                                    o.jsx)(g.wN, {
                                        children: "Daily Listen Results"
                                    }), (0,
                                        o.jsx)(g.kk, {
                                            children: "5% per listen / max 1 per day"
                                        })]
                })
        }
    },
    4196: function (n, e, t) {
        "use strict";
        t.d(e, {
            Z: function () {
                return i
            }
        });
        var r = t(1221)
            , i = [{
                id: "spotify",
                label: "Spotify",
                url: "https://open.spotify.com/track/6zZWoHlF2zNSLUNLvx4GUl?si=4a2ba997725a4cde",
                Icon: r.ri
            }, {
                id: "applemusic",
                label: "Apple Music",
                url: "https://music.apple.com/album/better-things-single/1699294565",
                Icon: r.iV
            }, {
                id: "amazonmusic",
                label: "Amazon Music",
                url: "https://amazon.com/music/player/albums/B0CBQSV85B",
                Icon: r.sf
            }]
    },
    987: function (n, e, t) {
        const { getDaysSince: r, generateDateMap: i } = t(4671)
            , o = "2023-08-23"
            , a = (n, e) => {
                if (n > e)
                    throw new Error("Count cannot be greater than length");
                return Array.from({
                    length: e
                }, ((e, t) => t < n))
            }
            , c = n => {
                const e = n?.invitedUsers;
                return e ? Object.keys(e).length : 0
            }
            , s = n => {
                const e = n?.ownListenings;
                if (e) {
                    return Object.entries(e).filter((([n, e]) => Object.keys(e).length >= 1)).length
                }
                return 0
            }
            , u = n => {
                const e = c(n);
                return a(e, 15)
            }
            , l = n => {
                const e = s(n);
                return a(e, 15)
            }
            , d = {
                wilting: {
                    flowerImage: "/images/index/bouquet.wilting.v2.webp",
                    status: "Wilting",
                    textColor: "black",
                    bgColor: "#FF6464"
                },
                budding: {
                    flowerImage: "/images/index/bouquet.budding.v2.webp",
                    status: "Budding",
                    textColor: "black",
                    bgColor: "#FFF964"
                },
                blossoming: {
                    flowerImage: "/images/index/bouquet.blossoming.v2.webp",
                    status: "Blossoming",
                    textColor: "black",
                    bgColor: "#36FF6E"
                },
                thriving: {
                    flowerImage: "/images/index/bouquet.thriving.v2.webp",
                    status: "Thriving",
                    textColor: "black",
                    bgColor: "#FC5EFF"
                }
            };
        n.exports = {
            MAX_SHARED: 10,
            MAX_PLAYED_TRACKS: 10,
            MIN_PLAYED_PLATFORMS_PER_DAY: 1,
            ACTIVATION_START_DATE: o,
            ACTIVATION_END_DATE: "2023-09-07",
            START_HEALTH_PERCENTAGE: 50,
            HEALTH_DECAY_PERCENTAGE_PER_DAY: 2.5,
            PLAY_PERCENTAGE_VALUE: 5,
            SHARE_PERCENTAGE_VALUE: 10,
            FLOWER_STATES: d,
            GLOBALLISTENHEALTH: 24,
            generateBooleanArray: a,
            getInvitedUserPerDayCount: c,
            getPlaysPerDayCount: s,
            getFinalizedSharesFromUser: u,
            getFinalizedPlaysFromUser: l,
            calculateUserHealth: (n, e) => {
                const t = u(e)
                    , i = l(e)
                    , a = 10 * t.filter((n => n)).length
                    , c = 5 * i.filter((n => n)).length;
                return 50 - 2.5 * r(n, o) + a + c
            }
            ,
            getUserMapActivationMapping: (n, e) => {
                const t = e?.invitedUsers || {}
                    , r = e?.ownListenings || {};
                let a = i(n, o, 15);
                for (const i in a)
                    a[i].invitedCount = t[i] && t[i] || 0,
                        r[i] ? a[i].totalListens = Object.values(r[i]).reduce(((n, e) => n + e), 0) : a[i].totalListens = 0;
                return a
            }
            ,
            getFlowerStateFromHealth: n => n <= 25 ? d.wilting : n <= 50 ? d.budding : n <= 75 ? d.blossoming : n > 75 ? d.thriving : void 0,
            getDailyActivationStatus: n => {
                const e = Object.values(n).find((n => "today" === n.status));
                return e ? {
                    listen: e.totalListens >= 1,
                    share: e.invitedCount >= 1
                } : {
                    listen: !1,
                    share: !1
                }
            }
        }
    },
    4671: function (n) {
        n.exports = {
            getCurrentDateInPST: n => n.now().setZone("America/Los_Angeles").toFormat("yyyy-MM-dd"),
            getDaysSince: (n, e) => {
                const t = n.now().setZone("America/Los_Angeles")
                    , r = n.fromFormat(e, "yyyy-MM-dd").setZone("America/Los_Angeles")
                    , i = t.diff(r, "days");
                return Math.floor(i.days)
            }
            ,
            getDaysTil: (n, e) => {
                const t = n.now().setZone("America/Los_Angeles")
                    , r = n.fromFormat(e, "yyyy-MM-dd").setZone("America/Los_Angeles").diff(t, "days");
                return Math.ceil(r.days)
            }
            ,
            generateDateMap: (n, e, t) => {
                const r = n.fromISO(e, {
                    zone: "America/Los_Angeles"
                })
                    , i = n.now().setZone("America/Los_Angeles");
                let o = {};
                for (let a = 0; a < t; a++) {
                    const n = r.plus({
                        days: a
                    });
                    n < i.startOf("day") ? o[n.toISODate()] = {
                        status: "past"
                    } : n.hasSame(i, "day") ? o[n.toISODate()] = {
                        status: "today"
                    } : o[n.toISODate()] = {
                        status: "future"
                    }
                }
                return o
            }
        }
    }
}]);

})();