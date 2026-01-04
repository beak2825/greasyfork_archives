// ==UserScript==
// @name         Fix Draftlol
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Fix Draftlol's Support tab
// @author       You
// @match        https://draftlol.dawe.gg/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=dawe.gg
// @grant        none
// @run-at document-start
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/446548/Fix%20Draftlol.user.js
// @updateURL https://update.greasyfork.org/scripts/446548/Fix%20Draftlol.meta.js
// ==/UserScript==

(function() {
    (window.webpackJsonp = window.webpackJsonp || []).push([
    [0], {
        30: function(e, t, a) {
            e.exports = a(53)
        },
        35: function(e, t, a) {},
        53: function(e, t, a) {
            "use strict";
            a.r(t);
            var n = a(0),
                c = a.n(n),
                r = a(28),
                o = a.n(r),
                i = a(1),
                l = (a(35), a(9)),
                s = a(2),
                u = a(4),
                d = a(13),
                m = a.n(d),
                p = a(14),
                b = a.n(p),
                g = function() {
                    var e = "https:" === window.location.protocol ? "wss" : "ws";
                    return "localhost:3000" === window.location.host ? "wss://draftlol.dawe.gg" : "".concat(e, "://").concat(window.location.host)
                },
                f = a(7),
                h = a.n(f),
                v = a(10),
                k = function() {
                    var e = Object(v.a)(h.a.mark(function e(t) {
                        var a;
                        return h.a.wrap(function(e) {
                            for (;;) switch (e.prev = e.next) {
                                case 0:
                                    return e.next = 2, fetch("https://ddragon.leagueoflegends.com/cdn/".concat(t, "/data/en_US/champion.json"));
                                case 2:
                                    return e.next = 4, e.sent.json();
                                case 4:
                                    return a = e.sent, e.abrupt("return", a.data);
                                case 6:
                                case "end":
                                    return e.stop()
                            }
                        }, e)
                    }));
                    return function(t) {
                        return e.apply(this, arguments)
                    }
                }(),
                E = function(e) {
                    var t = Object(n.useState)(void 0),
                        a = Object(i.a)(t, 2),
                        c = a[0],
                        r = a[1];
                    return Object(n.useEffect)(function() {
                        k(e).then(r)
                    }, [e]), c
                },
                y = [{
                    turn: 0,
                    display: "Disable First ban",
                    index: 0,
                    array: "blueBans"
                }, {
                    turn: 2,
                    display: "Disable Second ban",
                    index: 1,
                    array: "blueBans"
                }, {
                    turn: 4,
                    display: "Disable Third ban",
                    index: 2,
                    array: "blueBans"
                }, {
                    turn: 13,
                    display: "Disable Fourth ban",
                    index: 3,
                    array: "blueBans"
                }, {
                    turn: 15,
                    display: "Disable Fifth ban",
                    index: 4,
                    array: "blueBans"
                }, {
                    turn: 6,
                    display: "Disable First pick",
                    index: 0,
                    array: "bluePicks"
                }, {
                    turn: 9,
                    display: "Disable Second pick",
                    index: 1,
                    array: "bluePicks"
                }, {
                    turn: 10,
                    display: "Disable Third pick",
                    index: 2,
                    array: "bluePicks"
                }, {
                    turn: 17,
                    display: "Disable Fourth pick",
                    index: 3,
                    array: "bluePicks"
                }, {
                    turn: 18,
                    display: "Disable Fifth pick",
                    index: 4,
                    array: "bluePicks"
                }],
                O = [{
                    turn: 1,
                    display: "Disable First ban",
                    index: 0,
                    array: "redBans"
                }, {
                    turn: 3,
                    display: "Disable Second ban",
                    index: 1,
                    array: "redBans"
                }, {
                    turn: 5,
                    display: "Disable Third ban",
                    index: 2,
                    array: "redBans"
                }, {
                    turn: 12,
                    display: "Disable Fourth ban",
                    index: 3,
                    array: "redBans"
                }, {
                    turn: 14,
                    display: "Disable Fifth ban",
                    index: 4,
                    array: "redBans"
                }, {
                    turn: 7,
                    display: "Disable First pick",
                    index: 0,
                    array: "redPicks"
                }, {
                    turn: 8,
                    display: "Disable Second pick",
                    index: 1,
                    array: "redPicks"
                }, {
                    turn: 11,
                    display: "Disable Third pick",
                    index: 2,
                    array: "redPicks"
                }, {
                    turn: 16,
                    display: "Disable Fourth pick",
                    index: 3,
                    array: "redPicks"
                }, {
                    turn: 19,
                    display: "Disable Fifth pick",
                    index: 4,
                    array: "redPicks"
                }],
                C = y.concat(O),
                w = function(e) {
                    return function() {
                        e.current && e.current.select(), document.execCommand("copy")
                    }
                },
                N = function() {
                    return "".concat(window.location.protocol, "//").concat(window.location.host)
                },
                S = function() {
                    var e = Object(v.a)(h.a.mark(function e() {
                        var t, a, n, c, r, o, i;
                        return h.a.wrap(function(e) {
                            for (;;) switch (e.prev = e.next) {
                                case 0:
                                    return e.next = 2, fetch("https://raw.communitydragon.org/latest/plugins/rcp-fe-lol-champion-statistics/global/default/rcp-fe-lol-champion-statistics.js");
                                case 2:
                                    return e.next = 4, e.sent.text();
                                case 4:
                                    if (t = e.sent, a = /(?<=function\(a\){a.exports=){[A-Z,:]*?({.*}[A-Z,:]*?){5}}(?=})/, null != (n = t.match(a)) && 0 !== n.length) {
                                        e.next = 9;
                                        break
                                    }
                                    return e.abrupt("return", {
                                        TOP: {},
                                        JUNGLE: {},
                                        MIDDLE: {},
                                        BOTTOM: {},
                                        SUPPORT: {}
                                    });
                                case 9:
                                    return c = n[0], r = c.replace(/(['"])?([a-z0-9A-Z_]+)(['"])?:/g, '"$2": ').replace(/(\.\d+)/g, "0$1"), o = JSON.parse(r), i = {
                                        TOP: o.TOP,
                                        JUNGLE: o.JUNGLE,
                                        MIDDLE: o.MIDDLE,
                                        BOTTOM: o.BOTTOM,
                                        UTILITY: o.SUPPORT
                                    }, e.abrupt("return", i);
                                case 14:
                                case "end":
                                    return e.stop()
                            }
                        }, e)
                    }));
                    return function() {
                        return e.apply(this, arguments)
                    }
                }(),
                j = function() {
                    var e = Object(n.useState)(),
                        t = Object(i.a)(e, 2),
                        a = t[0],
                        c = t[1];
                    return Object(n.useEffect)(function() {
                        S().then(c)
                    }, []), a
                },
                x = function(e) {
                    return c.a.createElement("svg", Object.assign({}, e, {
                        version: "1.1",
                        viewBox: "0 0 32 32",
                        xmlns: "http://www.w3.org/2000/svg"
                    }), c.a.createElement("path", {
                        stroke: "#5d5f57",
                        d: "M3,3 29,29 M3,29 29,3"
                    }))
                },
                P = function(e) {
                    return c.a.createElement("svg", Object.assign({}, e, {
                        version: "1.1",
                        viewBox: "0 0 32 32",
                        xmlns: "http://www.w3.org/2000/svg"
                    }), c.a.createElement("path", {
                        fill: "#5d5f57",
                        d: "M19.4271164,20.4271164 C18.0372495,21.4174803 16.3366522,22 14.5,22 C9.80557939,22 6,18.1944206 6,13.5 C6,8.80557939 9.80557939,5 14.5,5 C19.1944206,5 23,8.80557939 23,13.5 C23,15.8472103 22.0486052,17.9722103 20.5104077,19.5104077 L26.5077736,25.5077736 C26.782828,25.782828 26.7761424,26.2238576 26.5,26.5 C26.2219324,26.7780676 25.7796227,26.7796227 25.5077736,26.5077736 L19.4271164,20.4271164 L19.4271164,20.4271164 Z M14.5,21 C18.6421358,21 22,17.6421358 22,13.5 C22,9.35786417 18.6421358,6 14.5,6 C10.3578642,6 7,9.35786417 7,13.5 C7,17.6421358 10.3578642,21 14.5,21 L14.5,21 Z"
                    }))
                },
                B = ["top", "jungle", "middle", "bottom", "utility"],
                R = function(e) {
                    var t = e.version,
                        a = e.isChampDisabled,
                        r = e.onChampSelected,
                        o = e.allowSelectDisabled,
                        l = E(t),
                        s = j(),
                        u = Object(n.useState)(""),
                        d = Object(i.a)(u, 2),
                        m = d[0],
                        p = d[1],
                        b = Object(n.useState)(""),
                        g = Object(i.a)(b, 2),
                        f = g[0],
                        h = g[1];
                    if (!l || !s) return c.a.createElement(c.a.Fragment, null);
                    var v = function(e) {
                            return p(e.target.value)
                        },
                        k = function() {
                            return p("")
                        },
                        y = function(e) {
                            return c.a.createElement("img", {
                                key: e,
                                alt: e,
                                onClick: (t = e, function(e) {
                                    var a = t.toUpperCase();
                                    h(f === a ? "" : a), e.preventDefault()
                                }),
                                className: "champsFiltersPositionsInd ".concat(e, " ").concat(e.toUpperCase() === f ? "highlight" : ""),
                                src: "/position-".concat(e, ".svg")
                            });
                            var t
                        };
                    return c.a.createElement("div", {
                        className: "champsWithFilters"
                    }, c.a.createElement("div", {
                        className: "champsFilters"
                    }, c.a.createElement("div", {
                        className: "champsFiltersPositions"
                    }, B.map(y)), c.a.createElement("div", {
                        className: "champsFiltersSearch"
                    }, c.a.createElement("input", {
                        value: m,
                        onChange: v
                    }), c.a.createElement(P, {
                        className: "search"
                    }), c.a.createElement(x, {
                        className: "cross",
                        onClick: k
                    }))), c.a.createElement("div", {
                        className: "roomChampionsList"
                    }, Object.values(l).filter(function(e) {
                        return new RegExp(m.split("").join(".*"), "i").test(e.name)
                    }).filter(function(e) {
                        return !(f in s) || e.key in s[f]
                    }).map(function(e) {
                        return c.a.createElement("img", {
                            key: e.id,
                            alt: e.name,
                            disabled: a(e.id),
                            onClick: function() {
                                return o || !a(e.id) ? r(e) : {}
                            },
                            className: "roomImgListItem",
                            onDragStart: function(e) {
                                return e.preventDefault()
                            },
                            src: "https://ddragon.leagueoflegends.com/cdn/".concat(t, "/img/champion/").concat(e.image.full, " ")
                        })
                    })))
                },
                D = 30,
                T = 30,
                I = Object(s.h)(function(e) {
                    var t = e.version,
                        a = Object(n.useState)(function() {
                            var t = new URLSearchParams(e.location.search),
                                a = Object.fromEntries(t).opts,
                                n = {};
                            try {
                                var c = b.a.decode(a);
                                c.startsWith("{") || (c = "{".concat(c, "}")), n = JSON.parse(c)
                            } catch (r) {}
                            return {
                                disabledBlueOptions: y.map(function(e) {
                                    return Object(u.a)({}, e, {
                                        isChecked: n.t && n.t.includes(e.turn) || !1
                                    })
                                }),
                                disabledRedOptions: O.map(function(e) {
                                    return Object(u.a)({}, e, {
                                        isChecked: n.t && n.t.includes(e.turn) || !1
                                    })
                                }),
                                disabledChamps: void 0,
                                timePerBan: n.b || D,
                                timePerPick: n.p || T
                            }
                        }),
                        r = Object(i.a)(a, 2),
                        o = r[0],
                        l = r[1],
                        d = Object(n.createRef)(),
                        p = Object(n.createRef)(),
                        f = Object(n.createRef)(),
                        h = Object(n.useState)(),
                        v = Object(i.a)(h, 2),
                        k = v[0],
                        C = v[1],
                        S = Object(n.useState)(!1),
                        j = Object(i.a)(S, 2),
                        x = j[0],
                        P = j[1],
                        B = E(t);
                    Object(n.useEffect)(function() {
                        if (null != B) {
                            var t = new URLSearchParams(e.location.search),
                                a = Object.fromEntries(t).opts,
                                n = {};
                            try {
                                var c = b.a.decode(a);
                                c.startsWith("{") || (c = "{".concat(c, "}")), n = JSON.parse(c)
                            } catch (r) {}
                            l(function(e) {
                                return Object(u.a)({}, e, {
                                    disabledChamps: Object.values(B).map(function(e) {
                                        return {
                                            champion: e,
                                            isChecked: n.c && n.c.some(function(t) {
                                                return t.toString() === e.key || t.toString() === e.id
                                            }) || !1
                                        }
                                    })
                                })
                            })
                        }
                    }, [B]);
                    var I = m()(g, {
                            onMessage: function(e) {
                                var t = JSON.parse(e.data);
                                "roomcreated" === t.type && C(t)
                            },
                            shouldReconnect: function() {
                                return !0
                            }
                        }).sendJsonMessage,
                        F = function(e) {
                            I({
                                type: "createroom",
                                blueName: d.current && d.current.value || "Blue",
                                redName: p.current && p.current.value || "Red",
                                disabledTurns: o.disabledBlueOptions.concat(o.disabledRedOptions).filter(function(e) {
                                    return e.isChecked
                                }).map(function(e) {
                                    return e.turn
                                }),
                                disabledChamps: o.disabledChamps ? o.disabledChamps.filter(function(e) {
                                    return e.isChecked
                                }).map(function(e) {
                                    return e.champion.id
                                }) : [],
                                timePerPick: o.timePerPick,
                                timePerBan: o.timePerBan
                            }), e.preventDefault()
                        },
                        L = function(e) {
                            return function() {
                                l(function(t) {
                                    return Object(u.a)({}, t, {
                                        disabledBlueOptions: t.disabledBlueOptions.map(function(t, a) {
                                            return a === e ? Object(u.a)({}, t, {
                                                isChecked: !t.isChecked
                                            }) : t
                                        })
                                    })
                                })
                            }
                        },
                        M = function(e) {
                            return function() {
                                l(function(t) {
                                    return Object(u.a)({}, t, {
                                        disabledRedOptions: t.disabledRedOptions.map(function(t, a) {
                                            return a === e ? Object(u.a)({}, t, {
                                                isChecked: !t.isChecked
                                            }) : t
                                        })
                                    })
                                })
                            }
                        },
                        J = function(e) {
                            return function(t) {
                                try {
                                    var a = Number(t.target.value);
                                    if (Number.isNaN(a) || a === 1 / 0) return;
                                    a < 0 && (a = 0), a > 3600 && (a = 3600), e(a)
                                } catch (n) {}
                            }
                        };
                    return k ? c.a.createElement(s.a, {
                        to: "/".concat(k.roomId, "/").concat(k.adminPassword, "/").concat(k.bluePassword, "/").concat(k.redPassword)
                    }) : c.a.createElement("div", {
                        className: "createContainer"
                    }, c.a.createElement("div", {
                        className: "sendLine",
                        onSubmit: F
                    }, c.a.createElement("label", null, "Blue team name"), c.a.createElement("input", {
                        className: "inputLine inputBlue",
                        type: "text",
                        placeholder: "Blue",
                        ref: d
                    }), c.a.createElement("label", null, "Red team name"), c.a.createElement("input", {
                        className: "inputLine inputRed",
                        type: "text",
                        placeholder: "Red",
                        ref: p
                    }), c.a.createElement("div", {
                        className: "sendButton",
                        onClick: F
                    }, "Create")), c.a.createElement("div", {
                        className: "advancedOptionsButton",
                        onClick: function() {
                            return P(function(e) {
                                return !e
                            })
                        }
                    }, "Adv options"), x ? c.a.createElement("div", {
                        className: "advancedOptionsSuperContainer"
                    }, c.a.createElement("div", null, c.a.createElement("label", null, "Permanent link to this configuration"), c.a.createElement("div", {
                        className: "outputContainer"
                    }, c.a.createElement("input", {
                        ref: f,
                        className: "",
                        type: "text",
                        value: function() {
                            var e = {
                                t: o.disabledBlueOptions.concat(o.disabledRedOptions).filter(function(e) {
                                    return e.isChecked
                                }).map(function(e) {
                                    return e.turn
                                }),
                                c: o.disabledChamps ? o.disabledChamps.filter(function(e) {
                                    return e.isChecked
                                }).map(function(e) {
                                    return +e.champion.key
                                }) : [],
                                p: o.timePerPick,
                                b: o.timePerBan
                            };
                            e.t && 0 === e.t.length && delete e.t, e.c && 0 === e.c.length && delete e.c, e.p === T && delete e.p, e.b === D && delete e.b;
                            var t = JSON.stringify(e);
                            t = t.substring(1, t.length - 1);
                            var a = b.a.encode(t);
                            return 0 === Object.keys(e).length ? N() : "".concat(N(), "?opts=").concat(a)
                        }(),
                        readOnly: !0
                    }), c.a.createElement("div", {
                        className: "outputButton",
                        onClick: w(f)
                    }, "Copy"))), c.a.createElement("div", {
                        className: "advancedOptionContainer"
                    }, c.a.createElement("div", {
                        className: "inputDisabledOptionsContainer"
                    }, c.a.createElement("div", null, c.a.createElement("label", null, "Time per ban"), c.a.createElement("input", {
                        value: o.timePerBan,
                        onChange: J(function(e) {
                            l(function(t) {
                                return Object(u.a)({}, t, {
                                    timePerBan: e
                                })
                            })
                        })
                    })), c.a.createElement("div", null, c.a.createElement("label", null, "Time per pick"), c.a.createElement("input", {
                        value: o.timePerPick,
                        onChange: J(function(e) {
                            l(function(t) {
                                return Object(u.a)({}, t, {
                                    timePerPick: e
                                })
                            })
                        })
                    }))), c.a.createElement("div", {
                        className: "inputDisabledOptionsContainer"
                    }, "Blue", o.disabledBlueOptions.map(function(e, t) {
                        return c.a.createElement("div", {
                            className: "inputDisabledOptionsElement",
                            key: e.turn,
                            onClick: L(t)
                        }, c.a.createElement("input", {
                            readOnly: !0,
                            type: "checkbox",
                            checked: e.isChecked
                        }), e.display)
                    })), c.a.createElement("div", {
                        className: "inputDisabledOptionsContainer"
                    }, "Red", o.disabledRedOptions.map(function(e, t) {
                        return c.a.createElement("div", {
                            className: "inputDisabledOptionsElement",
                            key: e.turn,
                            onClick: M(t)
                        }, c.a.createElement("input", {
                            readOnly: !0,
                            type: "checkbox",
                            checked: e.isChecked
                        }), e.display)
                    }))), c.a.createElement("div", {
                        className: "disabledChamps"
                    }, c.a.createElement("div", {
                        className: "disabledChampsLabel"
                    }, " Disable champions "), c.a.createElement("div", null, c.a.createElement(R, {
                        version: t,
                        isChampDisabled: function(e) {
                            return o.disabledChamps.find(function(t) {
                                return t.champion.id === e
                            }).isChecked
                        },
                        onChampSelected: function(e) {
                            l(function(t) {
                                return Object(u.a)({}, t, {
                                    disabledChamps: t.disabledChamps && t.disabledChamps.map(function(t) {
                                        return t.champion.id === e.id ? Object(u.a)({}, t, {
                                            isChecked: !t.isChecked
                                        }) : t
                                    })
                                })
                            })
                        },
                        allowSelectDisabled: !0
                    })))) : c.a.createElement(c.a.Fragment, null))
                }),
                F = a(20);
            var L = function(e) {
                    var t = e.version,
                        a = e.appSettings,
                        r = Object(s.g)(),
                        o = r.id,
                        u = r.password,
                        d = E(t),
                        p = j(),
                        b = Object(n.useState)(),
                        f = Object(i.a)(b, 2),
                        h = f[0],
                        v = f[1],
                        k = Object(n.useState)("none"),
                        y = Object(i.a)(k, 2),
                        O = y[0],
                        w = y[1],
                        N = Object(n.useState)(""),
                        S = Object(i.a)(N, 2),
                        x = S[0],
                        P = S[1],
                        B = Object(n.useState)(0),
                        D = Object(i.a)(B, 2),
                        T = D[0],
                        I = D[1],
                        L = Object(n.useState)(Date.now()),
                        M = Object(i.a)(L, 2),
                        J = M[0],
                        W = M[1],
                        z = Object(n.useState)(),
                        U = Object(i.a)(z, 2),
                        A = U[0],
                        V = U[1],
                        Y = Object(F.a)("https://raw.communitydragon.org/latest/plugins/rcp-fe-lol-champ-select/global/default/sounds/sfx-cs-draft-notif-yourban.ogg", {
                            volume: .25
                        }),
                        _ = Object(i.a)(Y, 1)[0],
                        Z = Object(F.a)("https://raw.communitydragon.org/latest/plugins/rcp-fe-lol-champ-select/global/default/sounds/sfx-cs-draft-notif-yourpick.ogg", {
                            volume: .25
                        }),
                        q = Object(i.a)(Z, 1)[0],
                        H = m()(g, {
                            onOpen: function() {
                                P(""), H({
                                    type: "joinroom",
                                    roomId: o,
                                    password: u
                                })
                            },
                            onMessage: function(e) {
                                var t = JSON.parse(e.data);
                                "statechange" === t.type ? (v(function(e) {
                                    return a.soundsEnabled && function(e, t) {
                                        return (null != e || null != t) && (null == e || null == t || e.blueBans.length + e.redBans.length + e.bluePicks.length + e.redPicks.length !== t.blueBans.length + t.redBans.length + t.bluePicks.length + t.redPicks.length)
                                    }(e, t.newState) && t.newState && "none" !== O && "ongoing" === t.newState.state && t.newState.nextTeam === O && (console.log(t.newState.nextTeam, O), "ban" === t.newState.nextType ? _() : "pick" === t.newState.nextType && q()), t.newState
                                }), t.newState.nextTimeout >= 0 && W(Date.now() + t.newState.nextTimeout)) : "sidechoose" === t.type ? w(t.side) : "error" === t.type && P(t.reason)
                            },
                            onClose: function() {
                                return console.log("WebSocket Client Disconnected")
                            },
                            shouldReconnect: function() {
                                return !0
                            }
                        }).sendJsonMessage;
                    if (Object(n.useEffect)(function() {
                            var e = setInterval(function() {
                                I(Math.max(J - Date.now(), 0))
                            }, 200);
                            return function() {
                                clearInterval(e)
                            }
                        }, [J]), null == d || null == p || null == h) return c.a.createElement(c.a.Fragment, null);
                    var X = function(e) {
                            H({
                                type: "setready",
                                toggle: !0
                            }), e.preventDefault()
                        },
                        G = function() {
                            void 0 !== A && H({
                                type: "lockchampion",
                                chosenChamp: A.id
                            })
                        },
                        $ = function(e, t) {
                            var a = C.find(function(a) {
                                return a.index === t && a.array === e
                            });
                            return !!a && h.disabledTurns.includes(a.turn)
                        };
                    if (void 0 !== x && "" !== x) return console.log("error", x), c.a.createElement("div", null, "Error: ", x, c.a.createElement("br", null), c.a.createElement(l.b, {
                        to: "/"
                    }, "Create a new room"));
                    var K = function(e) {
                            return e.image ? "https://ddragon.leagueoflegends.com/cdn/".concat(t, "/img/champion/").concat(e.image.full) : "/square.png"
                        },
                        Q = function(e) {
                            return e.image ? "https://raw.communitydragon.org/latest/plugins/rcp-be-lol-game-data/global/default/v1/champion-splashes/".concat(e.key, "/").concat(e.key, "000.jpg") : "/rectangle.png"
                        },
                        ee = function(e) {
                            var t = arguments.length > 1 && void 0 !== arguments[1] ? arguments[1] : "",
                                a = arguments.length > 2 && void 0 !== arguments[2] && arguments[2],
                                n = arguments.length > 3 && void 0 !== arguments[3] && arguments[3];
                            return c.a.createElement("div", {
                                key: e.id,
                                className: "".concat(t, " champSquareSmall"),
                                onDragStart: function(e) {
                                    return e.preventDefault()
                                }
                            }, c.a.createElement("div", {
                                className: "champImageWrapper"
                            }, c.a.createElement("div", {
                                className: "champImageSmall",
                                "data-id": null != e.key ? e.key : -1,
                                style: {
                                    backgroundImage: n ? "url(/disabled.png)" : "url(".concat(K(e), ")")
                                }
                            })), a ? c.a.createElement("div", {
                                className: "champHighlight"
                            }) : c.a.createElement(c.a.Fragment, null))
                        },
                        te = function(e) {
                            var t = arguments.length > 1 && void 0 !== arguments[1] ? arguments[1] : "",
                                n = arguments.length > 2 && void 0 !== arguments[2] && arguments[2],
                                r = arguments.length > 3 && void 0 !== arguments[3] && arguments[3];
                            return c.a.createElement("div", {
                                className: "roomChampRow",
                                key: e.id
                            }, "large" === a.sideView ? function(e) {
                                var t = arguments.length > 1 && void 0 !== arguments[1] ? arguments[1] : "",
                                    a = arguments.length > 2 && void 0 !== arguments[2] && arguments[2],
                                    n = arguments.length > 3 && void 0 !== arguments[3] && arguments[3];
                                return c.a.createElement("div", {
                                    key: e.id,
                                    className: "".concat(t, " champSquareWide"),
                                    onDragStart: function(e) {
                                        return e.preventDefault()
                                    }
                                }, c.a.createElement("div", {
                                    className: "champImageWrapper"
                                }, c.a.createElement("div", {
                                    className: "champImage",
                                    "data-id": null != e.key ? e.key : -1,
                                    style: {
                                        backgroundImage: n ? "url(/disabled.png)" : "url(".concat(Q(e), ")")
                                    }
                                })), a ? c.a.createElement("div", {
                                    className: "champHighlight"
                                }) : c.a.createElement(c.a.Fragment, null), c.a.createElement("p", {
                                    className: "roomChampName roomBigChamp"
                                }, e.name))
                            }(e, t, n, r) : ee(e, t, n, r), "large" === a.sideView ? c.a.createElement(c.a.Fragment, null) : c.a.createElement("p", {
                                className: "roomChampName roomSmallChamp"
                            }, e.name))
                        },
                        ae = [-5, -4, -3, -2, -1],
                        ne = function(e) {
                            return c.a.createElement("div", {
                                className: "roomReady"
                            }, c.a.createElement("p", {
                                className: "roomTeamName"
                            }, "\xa0".concat(h["".concat(e, "Name")], "\xa0")), c.a.createElement("div", {
                                className: "roomReadyBackground roomReadyBackground".concat(e, " ").concat(h["".concat(e, "Ready")] && "waiting" === h.state || h.nextTeam === e && "ongoing" === h.state ? "active" : "")
                            }))
                        },
                        ce = {
                            blue: "Blue",
                            red: "Red",
                            ban: "Ban",
                            pick: "Pick"
                        },
                        re = function(e) {
                            return c.a.createElement("div", {
                                className: "roomBanRow ".concat(e)
                            }, (h["".concat(e, "Bans")] || []).concat(ae).slice(0, 5).map(function(e) {
                                return d[e] || {
                                    id: e.toString()
                                }
                            }).map(function(t, n) {
                                return c.a.createElement("div", {
                                    className: "banChampContainer"
                                }, c.a.createElement("img", {
                                    alt: t.name,
                                    src: "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 1 1'></svg>"
                                }), "normal" === a.bansPosition ? ee(t, "banChamp", h.nextTeam === e && h["".concat(e, "Bans")].length === n + 1 && "ban" === h.nextType, $("".concat(e, "Bans"), n)) : function(e) {
                                    var t = arguments.length > 1 && void 0 !== arguments[1] ? arguments[1] : "",
                                        a = arguments.length > 2 && void 0 !== arguments[2] && arguments[2],
                                        n = arguments.length > 3 && void 0 !== arguments[3] && arguments[3];
                                    return c.a.createElement("div", {
                                        key: e.id,
                                        className: "".concat(t, " champSquareSmall"),
                                        onDragStart: function(e) {
                                            return e.preventDefault()
                                        }
                                    }, c.a.createElement("div", {
                                        className: "champImageWrapper"
                                    }, c.a.createElement("div", {
                                        className: "banChamp",
                                        "data-id": null != e.key ? e.key : -1,
                                        style: {
                                            backgroundImage: n ? "url(/disabled.png)" : "url(".concat(Q(e), ")")
                                        }
                                    })), a ? c.a.createElement("div", {
                                        className: "champHighlight"
                                    }) : c.a.createElement(c.a.Fragment, null))
                                }(t, "wrapper", h.nextTeam === e && h["".concat(e, "Bans")].length === n + 1 && "ban" === h.nextType, $("".concat(e, "Bans"), n)))
                            }))
                        },
                        oe = function(e) {
                            return c.a.createElement("div", {
                                className: "roomPickColumn ".concat(e)
                            }, (h["".concat(e, "Picks")] || []).concat(ae).slice(0, 5).map(function(e) {
                                return d[e] || {
                                    id: e.toString()
                                }
                            }).map(function(t, a) {
                                return te(t, "pickChamp", h.nextTeam === e && h["".concat(e, "Picks")].length === a + 1 && "pick" === h.nextType, $("".concat(e, "Picks"), a))
                            }))
                        };
                    return d && p ? c.a.createElement("div", {
                        className: "roomContainer ".concat("tournamentRealm" === a.bansPosition ? "bansTournament" : "")
                    }, function() {
                        return c.a.createElement("div", {
                            className: "roomTimerBar",
                            onClick: X
                        }, ne("blue"), "ongoing" === h.state ? c.a.createElement("div", {
                            className: "roomTimerContainer"
                        }, c.a.createElement("p", {
                            className: "roomTimer"
                        }, (e = T / 1e3, Math.trunc(e))), c.a.createElement("p", {
                            className: "roomTimerSubtext"
                        }, ce[h.nextTeam], " ", ce[h.nextType])) : c.a.createElement(c.a.Fragment, null), ne("red"));
                        var e
                    }(), oe("blue"), oe("red"), re("blue"), re("red"), c.a.createElement(R, {
                        version: t,
                        isChampDisabled: function(e) {
                            return [].concat(h.bluePicks || [], h.redPicks || [], h.blueBans || [], h.redBans || [], h.disabledChamps || []).some(function(t) {
                                return t === e
                            })
                        },
                        onChampSelected: function(e) {
                            H({
                                type: "choosechampion",
                                chosenChamp: e.id
                            }), V(e)
                        }
                    }), function() {
                        switch (h.state) {
                            case "waiting":
                                return "blue" === O ? c.a.createElement("div", {
                                    className: "roomLock ".concat(h.blueReady ? "" : "active"),
                                    onClick: X,
                                    onDragStart: function(e) {
                                        return e.preventDefault()
                                    }
                                }, h.blueReady ? "Waiting..." : "Ready") : "red" === O ? c.a.createElement("div", {
                                    className: "roomLock ".concat(h.redReady ? "" : "active"),
                                    onClick: X
                                }, h.redReady ? "Waiting..." : "Ready") : c.a.createElement("div", {
                                    className: "roomLock "
                                }, "Waiting... ");
                            case "ongoing":
                                return c.a.createElement("div", {
                                    className: "roomLock ".concat(h.nextTeam === O ? "active" : ""),
                                    onClick: G
                                }, h.nextTeam === O ? "Lock" : "Waiting...");
                            default:
                                return c.a.createElement("div", {
                                    className: "roomLock "
                                }, " Finished ")
                        }
                    }()) : c.a.createElement("div", null)
                },
                M = function() {
                    var e = Object(n.useState)(void 0),
                        t = Object(i.a)(e, 2),
                        a = t[0],
                        c = t[1];
                    return Object(n.useEffect)(function() {
                        Object(v.a)(h.a.mark(function e() {
                            return h.a.wrap(function(e) {
                                for (;;) switch (e.prev = e.next) {
                                    case 0:
                                        return e.t0 = c, e.next = 3, fetch("https://ddragon.leagueoflegends.com/api/versions.json");
                                    case 3:
                                        return e.next = 5, e.sent.json();
                                    case 5:
                                        e.t1 = e.sent[0], (0, e.t0)(e.t1);
                                    case 7:
                                    case "end":
                                        return e.stop()
                                }
                            }, e)
                        }))()
                    }, []), a
                },
                J = function() {
                    var e = Object(s.g)(),
                        t = Object(n.useState)(!1),
                        a = Object(i.a)(t, 2),
                        r = a[0],
                        o = a[1],
                        u = Object(n.createRef)(),
                        d = Object(n.createRef)(),
                        p = Object(n.createRef)(),
                        f = Object(n.createRef)(),
                        h = Object(n.useState)(),
                        v = Object(i.a)(h, 2),
                        k = v[0],
                        E = v[1],
                        y = Object(n.useState)(),
                        O = Object(i.a)(y, 2),
                        C = O[0],
                        N = O[1],
                        S = function() {
                            return "".concat(window.location.protocol, "//").concat(window.location.host)
                        },
                        j = function() {
                            var t = arguments.length > 0 && void 0 !== arguments[0] && arguments[0];
                            return "".concat(t ? "" : S(), "/").concat(e.roomId, "/").concat(e.bluePassword)
                        },
                        x = function() {
                            var t = arguments.length > 0 && void 0 !== arguments[0] && arguments[0];
                            return "".concat(t ? "" : S(), "/").concat(e.roomId, "/").concat(e.redPassword)
                        },
                        P = function() {
                            var t = arguments.length > 0 && void 0 !== arguments[0] && arguments[0];
                            return "".concat(t ? "" : S(), "/").concat(e.roomId)
                        },
                        B = function() {
                            return "Blue pick: ".concat(j(), "\t\t\t\nRed pick: ").concat(x(), "\t\t\t\nSpectator: ").concat(P())
                        },
                        R = m()(g, {
                            onOpen: function() {
                                R({
                                    type: "joinroom",
                                    roomId: e.roomId,
                                    password: e.adminPassword
                                })
                            },
                            onMessage: function(e) {
                                var t = JSON.parse(e.data);
                                "statechange" === t.type ? E(t.newState) : "adminstats" === t.type ? N(t) : t.type
                            },
                            shouldReconnect: function() {
                                return !0
                            }
                        }).sendJsonMessage,
                        I = function(e) {
                            return function() {
                                R({
                                    type: "cyclepicker",
                                    side: e
                                })
                            }
                        },
                        F = function(e) {
                            return e.target.select()
                        };
                    return c.a.createElement("div", {
                        className: "createContainer"
                    }, c.a.createElement("div", null, c.a.createElement("div", {
                        className: "outputContainer"
                    }, c.a.createElement(l.b, {
                        className: "outputButton outputButtonCenter",
                        to: function() {
                            var e = {
                                t: k && k.disabledTurns,
                                c: k && k.disabledChamps,
                                p: k && k.timePerPick,
                                b: k && k.timePerBan
                            };
                            e.t && 0 === e.t.length && delete e.t, e.c && 0 === e.c.length && delete e.c, e.p === T && delete e.p, e.b === D && delete e.b;
                            var t = b.a.encode(JSON.stringify(e));
                            return 0 === Object.keys(e).length ? "/" : "/?opts=".concat(t)
                        }(),
                        target: "_blank"
                    }, "New draft")), c.a.createElement("label", null, "Blue"), c.a.createElement("div", {
                        className: "outputContainer"
                    }, c.a.createElement("input", {
                        ref: u,
                        className: "inputBlue",
                        type: "text",
                        value: j(),
                        readOnly: !0,
                        onFocus: F
                    }), c.a.createElement(l.b, {
                        className: "outputButton",
                        to: j(!0),
                        target: "_blank"
                    }, "Open"), c.a.createElement("div", {
                        className: "outputButton",
                        onClick: w(u)
                    }, "Copy")), c.a.createElement("label", null, "Red"), c.a.createElement("div", {
                        className: "outputContainer"
                    }, c.a.createElement("input", {
                        ref: d,
                        className: "inputRed",
                        type: "text",
                        value: x(),
                        readOnly: !0,
                        onFocus: F
                    }), c.a.createElement(l.b, {
                        className: "outputButton",
                        to: x(!0),
                        target: "_blank"
                    }, "Open"), c.a.createElement("div", {
                        className: "outputButton",
                        onClick: w(d)
                    }, "Copy")), c.a.createElement("label", null, "Spectator"), c.a.createElement("div", {
                        className: "outputContainer"
                    }, c.a.createElement("input", {
                        ref: p,
                        className: "",
                        type: "text",
                        value: P(),
                        readOnly: !0,
                        onFocus: F
                    }), c.a.createElement(l.b, {
                        className: "outputButton",
                        to: P(!0),
                        target: "_blank"
                    }, "Open"), c.a.createElement("div", {
                        className: "outputButton",
                        onClick: w(p)
                    }, "Copy")), void 0 === navigator.clipboard ? c.a.createElement("label", null, "All") : c.a.createElement("label", null), c.a.createElement("div", {
                        className: "outputContainer"
                    }, void 0 === navigator.clipboard ? c.a.createElement("input", {
                        ref: f,
                        type: "text",
                        value: B(),
                        readOnly: !0,
                        onFocus: F
                    }) : c.a.createElement(c.a.Fragment, null), c.a.createElement("div", {
                        className: "outputButton ".concat(void 0 !== navigator.clipboard ? "outputButtonCenter" : ""),
                        onClick: function() {
                            navigator.clipboard ? navigator.clipboard.writeText(B()) : (f.current && f.current.select(), document.execCommand("copy"))
                        }
                    }, "Copy All")), c.a.createElement("div", {
                        className: "outputContainer"
                    }, c.a.createElement("div", {
                        className: "advancedOptionsButton",
                        onClick: function() {
                            return o(function(e) {
                                return !e
                            })
                        }
                    }, "Adv options")), r && c.a.createElement("div", {
                        className: "outputContainer"
                    }, c.a.createElement("div", {
                        className: "textContainer"
                    }, "Blue Pickers: ", C && C.numBluePickers), c.a.createElement("div", {
                        className: "outputButton inputBlue",
                        onClick: I("blue")
                    }, "Cycle Blue"), c.a.createElement("div", {
                        className: "textContainer"
                    }, "Red Pickers: ", C && C.numRedPickers), c.a.createElement("div", {
                        className: "outputButton inputRed",
                        onClick: I("red")
                    }, "Cycle Red"), c.a.createElement("div", {
                        className: "textContainer"
                    }, "Admins: ", C && C.numAdminPickers), c.a.createElement("div", {
                        className: "textContainer"
                    }, "Rest: ", C ? C.numTotalPickers - (C.numBluePickers + C.numRedPickers + C.numAdminPickers) : null))))
                },
                W = {
                    sideView: "large",
                    bansPosition: "tournamentRealm",
                    soundsEnabled: !0,
                    version: "2"
                },
                z = function(e) {
                    return function() {
                        e(function(e) {
                            return Object(u.a)({}, e, {
                                sideView: "small" === e.sideView ? "large" : "small"
                            })
                        })
                    }
                },
                U = function(e) {
                    return function() {
                        e(function(e) {
                            return Object(u.a)({}, e, {
                                soundsEnabled: !e.soundsEnabled
                            })
                        })
                    }
                },
                A = function(e) {
                    var t = e.appSettings,
                        a = e.appSettingsSetters,
                        r = Object(n.useState)(!1),
                        o = Object(i.a)(r, 2),
                        l = o[0],
                        s = o[1];
                    return c.a.createElement(c.a.Fragment, null, c.a.createElement("button", {
                        type: "button",
                        className: "burgerButton ".concat(l ? "open" : ""),
                        onClick: function() {
                            return s(!l)
                        }
                    }, c.a.createElement("div", null), c.a.createElement("div", null), c.a.createElement("div", null)), c.a.createElement("nav", {
                        className: "burgerMenu ".concat(l ? "open" : "")
                    }, c.a.createElement("div", {
                        onClick: a.cycleSideView
                    }, "Picks: ", "large" === t.sideView ? "large" : "small"), c.a.createElement("div", {
                        onClick: a.cycleBansView
                    }, "Bans:", " ", "tournamentRealm" === t.bansPosition ? "tournament" : "normal"), c.a.createElement("div", {
                        onClick: a.toggleSoundsEnabled
                    }, "Sounds: ", !0 === t.soundsEnabled ? "enabled" : "disabled")))
                },
                V = function(e) {
                    var t = document.implementation.createHTMLDocument(""),
                        a = document.createElement("style");
                    return a.textContent = e, t.body.appendChild(a), a.sheet.cssRules
                },
                Y = /data-id/,
                _ = /\.background/,
                Z = /\.ban/,
                q = /data-id="(\d+)"/,
                H = "\n".concat(".champImage", " {\n    background-size: 241%;\n    background-position: 52% 28%;\n    background-repeat: no-repeat;\n}"),
                X = "\n".concat(".banChamp", " {\n    background-size: 360%;\n    background-position-x: 51%;\n    background-position-y: 27%;\n    background-repeat: no-repeat;\n}"),
                G = "\n".concat(".champImage", '[data-id="-1"] {\n    background-size: 100%;\n    background-position: 50%;\n}'),
                $ = "\n".concat(".banChamp", '[data-id="-1"] {\n    background: no-repeat;\n    background-size: cover;\n    background-position: 50%;\n    filter: grayscale(0) !important;\n}'),
                K = function(e) {
                    var t, a = q.exec(e.selectorText)[1],
                        n = [];
                    if (_.test(e.selectorText)) t = "".concat(".champImage", '[data-id="').concat(a, '"]'), e.style.backgroundPositionX && n.push("background-position-x: ".concat(e.style.backgroundPositionX)), e.style.backgroundPositionY && n.push("background-position-y: ".concat(e.style.backgroundPositionY)), e.style.backgroundSize && n.push("background-size: ".concat(e.style.backgroundSize));
                    else if (Z.test(e.selectorText)) {
                        if (t = "".concat(".banChamp", '[data-id="').concat(a, '"]'), e.style.backgroundPositionX && n.push("background-position-x: ".concat(e.style.backgroundPositionX)), e.style.backgroundPositionY && n.push("background-position-y: ".concat(e.style.backgroundPositionY)), e.style.backgroundSize) {
                            var c = Number(e.style.backgroundSize.replace(/\w/, ""));
                            n.push("background-size: ".concat(c / 10, "%"))
                        }
                    } else t = '[data-id="'.concat(a, '"]'), e.style.transform && n.push("transform: ".concat(e.style.transform));
                    return "".concat(t, " { ").concat(n.join(";"), " }")
                },
                Q = function() {
                    Object(n.useEffect)(function() {
                        Object(v.a)(h.a.mark(function e() {
                            var t, a, n, c, r;
                            return h.a.wrap(function(e) {
                                for (;;) switch (e.prev = e.next) {
                                    case 0:
                                        return e.next = 2, fetch("https://raw.communitydragon.org/latest/plugins/rcp-fe-lol-esports-spectate/global/default/rcp-fe-lol-esports-spectate.css");
                                    case 2:
                                        return e.next = 4, e.sent.text();
                                    case 4:
                                        t = e.sent, a = V(t), (n = window.document.styleSheets[0]).insertRule(H, n.rules.length), n.insertRule(X, n.rules.length), n.insertRule(G, n.rules.length), n.insertRule($, n.rules.length), c = 0;
                                    case 12:
                                        if (!(c < a.length)) {
                                            e.next = 20;
                                            break
                                        }
                                        if ((r = a[c]) instanceof CSSStyleRule) {
                                            e.next = 16;
                                            break
                                        }
                                        return e.abrupt("continue", 17);
                                    case 16:
                                        Y.test(r.selectorText) && n.insertRule(K(r), n.cssRules.length);
                                    case 17:
                                        c++, e.next = 12;
                                        break;
                                    case 20:
                                        console.log(n.rules);
                                    case 21:
                                    case "end":
                                        return e.stop()
                                }
                            }, e)
                        }))()
                    }, [])
                },
                ee = function() {
                    Q();
                    var e = M(),
                        t = function() {
                            var e, t = Object(n.useState)(function() {
                                    var e = localStorage.getItem("draftlol-app-settings");
                                    if (null !== e) try {
                                        return JSON.parse(e).version !== W.version ? W : Object(u.a)({}, W, JSON.parse(e))
                                    } catch (t) {}
                                    return W
                                }),
                                a = Object(i.a)(t, 2),
                                c = a[0],
                                r = a[1];
                            return [c, {
                                cycleBansView: (e = r, function() {
                                    e(function(e) {
                                        return Object(u.a)({}, e, {
                                            bansPosition: "normal" === e.bansPosition ? "tournamentRealm" : "normal"
                                        })
                                    })
                                }),
                                cycleSideView: z(r),
                                toggleSoundsEnabled: U(r)
                            }]
                        }(),
                        a = Object(i.a)(t, 2),
                        r = a[0],
                        o = a[1];
                    return Object(n.useEffect)(function() {
                        localStorage.setItem("draftlol-app-settings", JSON.stringify(r))
                    }, [r]), e ? c.a.createElement(c.a.Fragment, null, c.a.createElement(l.a, null, c.a.createElement(s.d, null, c.a.createElement(s.b, {
                        path: "/champs"
                    }, c.a.createElement(R, {
                        version: e,
                        onChampSelected: function() {},
                        isChampDisabled: function() {
                            return !1
                        }
                    })), c.a.createElement(s.b, {
                        path: "/:roomId/:adminPassword/:bluePassword/:redPassword"
                    }, c.a.createElement(J, null)), c.a.createElement(s.b, {
                        path: "/:id/:password"
                    }, c.a.createElement(L, {
                        version: e,
                        appSettings: r
                    })), c.a.createElement(s.b, {
                        path: "/:id"
                    }, c.a.createElement(L, {
                        version: e,
                        appSettings: r
                    })), c.a.createElement(s.b, {
                        path: "/"
                    }, c.a.createElement(I, {
                        version: e
                    })))), c.a.createElement(A, {
                        appSettings: r,
                        appSettingsSetters: o
                    })) : c.a.createElement(l.a, null)
                };
            Boolean("localhost" === window.location.hostname || "[::1]" === window.location.hostname || window.location.hostname.match(/^127(?:\.(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)){3}$/));
            o.a.render(c.a.createElement(ee, null), document.getElementById("root")), "serviceWorker" in navigator && navigator.serviceWorker.ready.then(function(e) {
                e.unregister()
            })
        }
    },
    [
        [30, 1, 2]
    ]
]);
})();