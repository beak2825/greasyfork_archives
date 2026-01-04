// ==UserScript==
// @name         Moomoo Raven VN RE
// @namespace    https://discord.gg/h2b4CKQZcR
// @version      1
// @author       Skylzzk
// @description  https://discord.gg/h2b4CKQZcR
// @match        *://moomoo.io/*
// @match        *://*.moomoo.io/*
// @license      MIT
// @require      https://update.greasyfork.org/scripts/423602/1005014/msgpack.js
// @icon         https://media.discordapp.net/attachments/1211076553056981112/1212504509595783198/RavenLogo1.png?ex=65f213d2&is=65df9ed2&hm=b5ad7c7103d626f82bd6bc0b9c30a4b12a1e6af6161b83623edbac8e5dfbaf9d&=&format=webp&quality=lossless&width=617&height=619
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/488838/Moomoo%20Raven%20VN%20RE.user.js
// @updateURL https://update.greasyfork.org/scripts/488838/Moomoo%20Raven%20VN%20RE.meta.js
// ==/UserScript==

let styleItem =
    `
    .resourceDisplay,
    #killCounter {
        border: 5px solid transparent;
        border-radius: 50px;
        transition: 0.5s;
    }

    .menuHeader {
        color: #FFFFFF;
    }

    

    #storeHolder {
        background-color: #222;
        border-image: linear-gradient(to right, #222, #222) 1 0 0 0;
        color: #FFFFF;
        margin-top: 0;
        border-radius: 15px;
        border-bottom: 0 solid red;
        transition: all 0.5s;
        transform: scale(1) translateX(0);
        box-shadow: 0 0 5px #222;
        padding: 20px;
        max-height: none !important;
    }

    #storeTab {
        background-color: #444;
        color: #FFF;
        border: 2px solid #FFF;
        border-radius: 8px;
        padding: 10px;
        margin: 5px;
        cursor: pointer;
        transition: background-color 0.3s, color 0.3s, border 0.3s;
    }

    #storeTab:hover {
        background-color: #222;
        color: #FFD700;
        border: 2px solid #FFD700;
    }

    #killCounter:hover {
        transform: scale(1.05);
    }

    #itemInfoHolder {
        background-color: rgba(34, 34, 34, 1);
        z-index: 99999;
        border-radius: 5px;
    }

    .menuCard {
        background-color: #222;
        border-image: linear-gradient(to right, #222, #222) 1 0 0 0;
        color: #FFFFFF";
        margin-top: 0;
        border-radius: 15px;
        border-bottom: 0 solid red;
        transition: all 0.5s;
        transform: scale(1) translateX(0);
        box-shadow: 0 0 5px #222;
    }

    .menuCard:hover {
        transform: scale(1.03);
        box-shadow: 0 0 20px rgba(0, 0, 0, 0.5);
        border-color: #ff6347;
    }

    .menuCard.active {
        transform: translateX(0);
        border-color: #00ff00;

    }

    .uiElement {
        border: 5px solid transparent;
        border-radius: 50px;
        color: #FFFFFF;
        transition: 0.5s;
    }

    .uiElement:hover {
        border: 5px solid transparent;
        border-radius: 50px;
        color: #FFFFFF;
        transition: 0.5s;
        animation: fireAnimation 1s infinite;
    }

    @keyframes fireAnimation {
        35% {
            box-shadow: 0 0 10px 5px #000000;
        }
    }
    .actionBarItem {
        width: 65px;
        height: 65px;
        background-position: center;
        background-size: 55px 55px;
    }
    .ageBarBody {
        border-radius: 50px;
        border: 20px;
    }
    .ageBar {
        border-radius: 100px;
        border: 20px;
    }
    `;

let style = document.createElement('style');
style.type = 'text/css';
style.innerHTML = styleItem;
document.head.appendChild(style);

$('#linksContainer2')
.html(
  '<a href="https://discord.gg/rvu46WKdRu" target="_blank" class="menuLink" style="background-color: #222; color: #ffffff;">' +
  "Sky's Discord" +
  '</a>'
);

    const createSnowflake = function () {
        const snowflake = document.createElement("div");
        snowflake.className = "snowflake";
        snowflake.style.position = "absolute";
        snowflake.style.width = "10px";
        snowflake.style.height = "10px";
        snowflake.style.background = "#fff";
        snowflake.style.borderRadius = "50%";
        snowflake.style.zIndex = "9998";
        snowflake.style.opacity = Math.random();
        snowflake.style.left = Math.random() * 100 + "vw";
        snowflake.style.animation = `fall ${Math.random() * 2 + 1}s linear infinite`;
        snowflake.addEventListener("animationiteration", function () {
            snowflake.style.left = Math.random() * 100 + "vw";
            snowflake.style.opacity = Math.random();
        });
        return snowflake;
    };

    const styleSnowflakes = document.createElement("style");
    styleSnowflakes.textContent = ` @keyframes fall { 0% { transform: translateY(-10vh); opacity: 1; } 100% { transform: translateY(110vh); opacity: 0; } } .fast-fall { animation-duration: ${Math.random() * 1 + 1}s; } `;
    document.head.appendChild(styleSnowflakes);

    const snowflakeContainer = document.createElement("div");
    snowflakeContainer.style.position = "absolute";
    snowflakeContainer.style.top = "0";
    snowflakeContainer.style.left = "0";
    snowflakeContainer.style.width = "100%";
    snowflakeContainer.style.height = "100%";
    snowflakeContainer.style.pointerEvents = "none";
    snowflakeContainer.style.zIndex = "9998";
    document.body.appendChild(snowflakeContainer);

    const maxSnowflakes = 40;
    for (let i = 0; i < maxSnowflakes; i++) {
        const snowflake = createSnowflake();
        if (Math.random() > 0.7) {
            snowflake.classList.add("fast-fall");
        }
        snowflakeContainer.appendChild(snowflake);
    }

    // Add event listener to the "enterGame" element
    const enterGameButton = document.getElementById("enterGame");
    if (enterGameButton) {
        enterGameButton.addEventListener("click", function () {
            // Hide the snowflake container when the button is pressed
            snowflakeContainer.style.display = "none";
        });
    }

    document.getElementById('enterGame').innerText = "🢒 ‍ ‍ ‍PLAY ‍ ‍ ‍🢐";
    document.getElementById('enterGame').style.backgroundColor = '#222';
    document.getElementById("enterGame").addEventListener("mouseenter", function() {
        document.getElementById('enterGame').innerText = "🢒 ‍PLAY 🢐";
    });
    document.getElementById("enterGame").addEventListener("mouseleave", function() {
        document.getElementById('enterGame').innerText = "🢒 ‍ ‍   ‍‍PLAY ‍ ‍   ‍🢐";
    });

document.getElementById('gameName').innerHTML = 'RAVEN';
setTimeout(() => {
    document.getElementById('gameName').innerHTML = 'RAVEN';
    setTimeout(() => {
        document.getElementById('gameName').innerHTML = 'RAVEN';
        setTimeout(() => {
            document.getElementById('gameName').innerHTML = 'RAVEN';
            setTimeout(() => {
                document.getElementById('gameName').innerHTML = 'RAVEN';
                setTimeout(() => {
                    document.getElementById('gameName').innerHTML = 'RAVEN';
                    setTimeout(() => {
                        document.getElementById('gameName').innerHTML = 'RAVEN';
                        setTimeout(() => {
                            document.getElementById('gameName').innerHTML = 'RAVEN';
                            setTimeout(() => {
                                document.getElementById('gameName').innerHTML = 'RAVEN';
                                setTimeout(() => {
                                    document.getElementById('gameName').innerHTML = 'RAVEN';
                                    setTimeout(() => {
                                        document.getElementById('gameName').innerHTML = 'RAVEN';
                                        setTimeout(() => {
                                            document.getElementById('gameName').innerHTML = 'RAVEN';
                                            setTimeout(() => {
                                                document.getElementById('gameName').innerHTML = 'RAVEN';
                                            }, 1200);
                                        }, 120);
                                    }, 120);
                                }, 120);
                            }, 120);
                        }, 120);
                    }, 120);
                }, 120);
            }, 120);
        }, 120);
    }, 1200);
}, 120);
$('#gameName').css({
    'color': 'white',
    'text-shadow': 'rgba(255, 255, 255, 1)',
    'text-align': 'center',
    'font-size': '80px',
    'margin-bottom': '20px'
});

(function() {
    let shadowRadius = 50;
    let shadowDirection = 1;
    let canShadow = true;
    setInterval(() => {
        if (canShadow == true) {
            shadowRadius = (shadowDirection == 1) ? shadowRadius - 5 : shadowRadius + 5;
            if (shadowRadius >= 50 || shadowRadius <= 0) {
                shadowDirection = (shadowRadius >= 50) ? 1 : (shadowRadius <= 0) ? 0 : null;
                canShadow = false;
                setTimeout(() => {
                    canShadow = true;
                }, 100);
            }
        }
        document.getElementById("gameName").style.textShadow = `
        0 0 ${shadowRadius}px rgba(0, 0, 0, 0.9),
        0 0 ${shadowRadius * 2}px rgba(0, 0, 0, 0.9),
        0 0 ${shadowRadius * 3}px rgba(0, 0, 0, 0.9),
        0 0 ${shadowRadius * 4}px rgba(0, 0, 0, 0.9),
        0 0 ${shadowRadius * 5}px rgba(0, 0, 0, 0.9)`;

    }, 100);
})();

document.getElementById('loadingText').innerHTML = 'Load Bundle...';
setTimeout(() => {
    document.getElementById('loadingText').innerHTML = 'Load Success !';
}, 710);
var RainbowCycle = 0;
var cycle = 0;
var HPBarColor = "black";
var NameBarColor = "black";
setInterval(() => {
    if (RainbowCycle > 359) {
        // If Rainbow Reached Maximum
        RainbowCycle = 0; // Restart ();
    } else {
        /*for(let i = 0; i< 30; i++)*/ RainbowCycle++;
        //RainbowCycle++;
        HPBarColor = `hsla(${RainbowCycle}, 100%, 50%, 30)`;
    }
}, 20);
//http://127.0.0.1:5500/

let useHack = true;

let log = console.log;
let testMode = window.location.hostname == "127.0.0.1";
let imueheua = false;

function getEl(id) {
    return document.getElementById(id);
}

var EasyStar = function(e) {
    var o = {};

    function r(t) {
        if (o[t]) return o[t].exports;
        var n = o[t] = {
            i: t,
            l: !1,
            exports: {}
        };
        return e[t].call(n.exports, n, n.exports, r), n.l = !0, n.exports
    }
    return r.m = e, r.c = o, r.d = function(t, n, e) {
        r.o(t, n) || Object.defineProperty(t, n, {
            enumerable: !0,
            get: e
        })
    }, r.r = function(t) {
        "undefined" != typeof Symbol && Symbol.toStringTag && Object.defineProperty(t, Symbol.toStringTag, {
            value: "Module"
        }), Object.defineProperty(t, "__esModule", {
            value: !0
        })
    }, r.t = function(n, t) {
        if (1 & t && (n = r(n)), 8 & t) return n;
        if (4 & t && "object" == typeof n && n && n.__esModule) return n;
        var e = Object.create(null);
        if (r.r(e), Object.defineProperty(e, "default", {
            enumerable: !0,
            value: n
        }), 2 & t && "string" != typeof n)
            for (var o in n) r.d(e, o, function(t) {
                return n[t]
            }.bind(null, o));
        return e
    }, r.n = function(t) {
        var n = t && t.__esModule ? function() {
            return t.default
        } : function() {
            return t
        };
        return r.d(n, "a", n), n
    }, r.o = function(t, n) {
        return Object.prototype.hasOwnProperty.call(t, n)
    }, r.p = "/bin/", r(r.s = 0)
}([function(t, n, e) {
    var P = {},
        M = e(1),
        _ = e(2),
        A = e(3);
    t.exports = P;
    var E = 1;
    P.js = function() {
        var c, i, f, s = 1.4,
            p = !1,
            u = {},
            o = {},
            r = {},
            l = {},
            a = !0,
            h = {},
            d = [],
            y = Number.MAX_VALUE,
            v = !1;
        this.setAcceptableTiles = function(t) {
            t instanceof Array ? f = t : !isNaN(parseFloat(t)) && isFinite(t) && (f = [t])
        }, this.enableSync = function() {
            p = !0
        }, this.disableSync = function() {
            p = !1
        }, this.enableDiagonals = function() {
            v = !0
        }, this.disableDiagonals = function() {
            v = !1
        }, this.setGrid = function(t) {
            c = t;
            for (var n = 0; n < c.length; n++)
                for (var e = 0; e < c[0].length; e++) o[c[n][e]] || (o[c[n][e]] = 1)
        }, this.setTileCost = function(t, n) {
            o[t] = n
        }, this.setAdditionalPointCost = function(t, n, e) {
            void 0 === r[n] && (r[n] = {}), r[n][t] = e
        }, this.removeAdditionalPointCost = function(t, n) {
            void 0 !== r[n] && delete r[n][t]
        }, this.removeAllAdditionalPointCosts = function() {
            r = {}
        }, this.setDirectionalCondition = function(t, n, e) {
            void 0 === l[n] && (l[n] = {}), l[n][t] = e
        }, this.removeAllDirectionalConditions = function() {
            l = {}
        }, this.setIterationsPerCalculation = function(t) {
            y = t
        }, this.avoidAdditionalPoint = function(t, n) {
            void 0 === u[n] && (u[n] = {}), u[n][t] = 1
        }, this.stopAvoidingAdditionalPoint = function(t, n) {
            void 0 !== u[n] && delete u[n][t]
        }, this.enableCornerCutting = function() {
            a = !0
        }, this.disableCornerCutting = function() {
            a = !1
        }, this.stopAvoidingAllAdditionalPoints = function() {
            u = {}
        }, this.findPath = function(t, n, e, o, r) {
            function i(t) {
                p ? r(t) : setTimeout(function() {
                    r(t)
                })
            }
            if (void 0 === f) throw new Error("You can't set a path without first calling setAcceptableTiles() on EasyStar.");
            if (void 0 === c) throw new Error("You can't set a path without first calling setGrid() on EasyStar.");
            if (t < 0 || n < 0 || e < 0 || o < 0 || t > c[0].length - 1 || n > c.length - 1 || e > c[0].length - 1 || o > c.length - 1) throw new Error("Your start or end point is outside the scope of your grid.");
            if (t !== e || n !== o) {
                for (var s = c[o][e], u = !1, l = 0; l < f.length; l++)
                    if (s === f[l]) {
                        u = !0;
                        break
                    } if (!1 !== u) {
                        var a = new M;
                        a.openList = new A(function(t, n) {
                            return t.bestGuessDistance() - n.bestGuessDistance()
                        }), a.isDoneCalculating = !1, a.nodeHash = {}, a.startX = t, a.startY = n, a.endX = e, a.endY = o, a.callback = i, a.openList.push(O(a, a.startX, a.startY, null, 1));
                        o = E++;
                        return h[o] = a, d.push(o), o
                    }
                i(null)
            } else i([])
        }, this.cancelPath = function(t) {
            return t in h && (delete h[t], !0)
        }, this.calculate = function() {
            if (0 !== d.length && void 0 !== c && void 0 !== f)
                for (i = 0; i < y; i++) {
                    if (0 === d.length) return;
                    p && (i = 0);
                    var t = d[0],
                        n = h[t];
                    if (void 0 !== n)
                        if (0 !== n.openList.size()) {
                            var e = n.openList.pop();
                            if (n.endX !== e.x || n.endY !== e.y)(e.list = 0) < e.y && T(n, e, 0, -1, +b(e.x, e.y - 1)), e.x < c[0].length - 1 && T(n, e, 1, 0, +b(e.x + 1, e.y)), e.y < c.length - 1 && T(n, e, 0, 1, +b(e.x, e.y + 1)), 0 < e.x && T(n, e, -1, 0, +b(e.x - 1, e.y)), v && (0 < e.x && 0 < e.y && (a || g(c, f, e.x, e.y - 1, e) && g(c, f, e.x - 1, e.y, e)) && T(n, e, -1, -1, s * b(e.x - 1, e.y - 1)), e.x < c[0].length - 1 && e.y < c.length - 1 && (a || g(c, f, e.x, e.y + 1, e) && g(c, f, e.x + 1, e.y, e)) && T(n, e, 1, 1, s * b(e.x + 1, e.y + 1)), e.x < c[0].length - 1 && 0 < e.y && (a || g(c, f, e.x, e.y - 1, e) && g(c, f, e.x + 1, e.y, e)) && T(n, e, 1, -1, s * b(e.x + 1, e.y - 1)), 0 < e.x && e.y < c.length - 1 && (a || g(c, f, e.x, e.y + 1, e) && g(c, f, e.x - 1, e.y, e)) && T(n, e, -1, 1, s * b(e.x - 1, e.y + 1)));
                            else {
                                var o = [];
                                o.push({
                                    x: e.x,
                                    y: e.y
                                });
                                for (var r = e.parent; null != r;) o.push({
                                    x: r.x,
                                    y: r.y
                                }), r = r.parent;
                                o.reverse(), n.callback(o), delete h[t], d.shift()
                            }
                        } else n.callback(null), delete h[t], d.shift();
                    else d.shift()
                }
        };
        var T = function(t, n, e, o, r) {
            e = n.x + e, o = n.y + o;
            void 0 !== u[o] && void 0 !== u[o][e] || !g(c, f, e, o, n) || (void 0 === (o = O(t, e, o, n, r)).list ? (o.list = 1, t.openList.push(o)) : n.costSoFar + r < o.costSoFar && (o.costSoFar = n.costSoFar + r, o.parent = n, t.openList.updateItem(o)))
        },
            g = function(t, n, e, o, r) {
                var i = l[o] && l[o][e];
                if (i) {
                    var s = x(r.x - e, r.y - o);
                    if (! function() {
                        for (var t = 0; t < i.length; t++)
                            if (i[t] === s) return !0;
                        return !1
                    }()) return !1
                }
                for (var u = 0; u < n.length; u++)
                    if (t[o][e] === n[u]) return !0;
                return !1
            },
            x = function(t, n) {
                if (0 === t && -1 === n) return P.TOP;
                if (1 === t && -1 === n) return P.TOP_RIGHT;
                if (1 === t && 0 === n) return P.RIGHT;
                if (1 === t && 1 === n) return P.BOTTOM_RIGHT;
                if (0 === t && 1 === n) return P.BOTTOM;
                if (-1 === t && 1 === n) return P.BOTTOM_LEFT;
                if (-1 === t && 0 === n) return P.LEFT;
                if (-1 === t && -1 === n) return P.TOP_LEFT;
                throw new Error("These differences are not valid: " + t + ", " + n)
            },
            b = function(t, n) {
                return r[n] && r[n][t] || o[c[n][t]]
            },
            O = function(t, n, e, o, r) {
                if (void 0 !== t.nodeHash[e]) {
                    if (void 0 !== t.nodeHash[e][n]) return t.nodeHash[e][n]
                } else t.nodeHash[e] = {};
                var i = m(n, e, t.endX, t.endY),
                    r = null !== o ? o.costSoFar + r : 0,
                    i = new _(o, n, e, r, i);
                return t.nodeHash[e][n] = i
            },
            m = function(t, n, e, o) {
                var r, i;
                return v ? (r = Math.abs(t - e)) < (i = Math.abs(n - o)) ? s * r + i : s * i + r : (r = Math.abs(t - e)) + (i = Math.abs(n - o))
            }
        }, P.TOP = "TOP", P.TOP_RIGHT = "TOP_RIGHT", P.RIGHT = "RIGHT", P.BOTTOM_RIGHT = "BOTTOM_RIGHT", P.BOTTOM = "BOTTOM", P.BOTTOM_LEFT = "BOTTOM_LEFT", P.LEFT = "LEFT", P.TOP_LEFT = "TOP_LEFT"
}, function(t, n) {
    t.exports = function() {
        this.pointsToAvoid = {}, this.startX, this.callback, this.startY, this.endX, this.endY, this.nodeHash = {}, this.openList
    }
}, function(t, n) {
    t.exports = function(t, n, e, o, r) {
        this.parent = t, this.x = n, this.y = e, this.costSoFar = o, this.simpleDistanceToTarget = r, this.bestGuessDistance = function() {
            return this.costSoFar + this.simpleDistanceToTarget
        }
    }
}, function(t, n, e) {
    t.exports = e(4)
}, function(u, T, t) {
    var g, x;
    (function() {
        var t, p, l, h, d, n, a, e, y, v, o, r, i, c, f;

        function s(t) {
            this.cmp = null != t ? t : p, this.nodes = []
        }
        l = Math.floor, v = Math.min, p = function(t, n) {
            return t < n ? -1 : n < t ? 1 : 0
        }, y = function(t, n, e, o, r) {
            var i;
            if (null == e && (e = 0), null == r && (r = p), e < 0) throw new Error("lo must be non-negative");
            for (null == o && (o = t.length); e < o;) r(n, t[i = l((e + o) / 2)]) < 0 ? o = i : e = i + 1;
            return [].splice.apply(t, [e, e - e].concat(n)), n
        }, n = function(t, n, e) {
            return null == e && (e = p), t.push(n), c(t, 0, t.length - 1, e)
        }, d = function(t, n) {
            var e, o;
            return null == n && (n = p), e = t.pop(), t.length ? (o = t[0], t[0] = e, f(t, 0, n)) : o = e, o
        }, e = function(t, n, e) {
            var o;
            return null == e && (e = p), o = t[0], t[0] = n, f(t, 0, e), o
        }, a = function(t, n, e) {
            var o;
            return null == e && (e = p), t.length && e(t[0], n) < 0 && (n = (o = [t[0], n])[0], t[0] = o[1], f(t, 0, e)), n
        }, h = function(e, t) {
            var n, o, r, i, s, u;
            for (null == t && (t = p), s = [], o = 0, r = (i = function() {
                u = [];
                for (var t = 0, n = l(e.length / 2); 0 <= n ? t < n : n < t; 0 <= n ? t++ : t--) u.push(t);
                return u
            }.apply(this).reverse()).length; o < r; o++) n = i[o], s.push(f(e, n, t));
            return s
        }, i = function(t, n, e) {
            if (null == e && (e = p), -1 !== (n = t.indexOf(n))) return c(t, 0, n, e), f(t, n, e)
        }, o = function(t, n, e) {
            var o, r, i, s, u;
            if (null == e && (e = p), !(r = t.slice(0, n)).length) return r;
            for (h(r, e), i = 0, s = (u = t.slice(n)).length; i < s; i++) o = u[i], a(r, o, e);
            return r.sort(e).reverse()
        }, r = function(t, n, e) {
            var o, r, i, s, u, l, a, c, f;
            if (null == e && (e = p), 10 * n <= t.length) {
                if (!(i = t.slice(0, n).sort(e)).length) return i;
                for (r = i[i.length - 1], s = 0, l = (a = t.slice(n)).length; s < l; s++) e(o = a[s], r) < 0 && (y(i, o, 0, null, e), i.pop(), r = i[i.length - 1]);
                return i
            }
            for (h(t, e), f = [], u = 0, c = v(n, t.length); 0 <= c ? u < c : c < u; 0 <= c ? ++u : --u) f.push(d(t, e));
            return f
        }, c = function(t, n, e, o) {
            var r, i, s;
            for (null == o && (o = p), r = t[e]; n < e && o(r, i = t[s = e - 1 >> 1]) < 0;) t[e] = i, e = s;
            return t[e] = r
        }, f = function(t, n, e) {
            var o, r, i, s, u;
            for (null == e && (e = p), r = t.length, i = t[u = n], o = 2 * n + 1; o < r;)(s = o + 1) < r && !(e(t[o], t[s]) < 0) && (o = s), t[n] = t[o], o = 2 * (n = o) + 1;
            return t[n] = i, c(t, u, n, e)
        }, s.push = n, s.pop = d, s.replace = e, s.pushpop = a, s.heapify = h, s.updateItem = i, s.nlargest = o, s.nsmallest = r, s.prototype.push = function(t) {
            return n(this.nodes, t, this.cmp)
        }, s.prototype.pop = function() {
            return d(this.nodes, this.cmp)
        }, s.prototype.peek = function() {
            return this.nodes[0]
        }, s.prototype.contains = function(t) {
            return -1 !== this.nodes.indexOf(t)
        }, s.prototype.replace = function(t) {
            return e(this.nodes, t, this.cmp)
        }, s.prototype.pushpop = function(t) {
            return a(this.nodes, t, this.cmp)
        }, s.prototype.heapify = function() {
            return h(this.nodes, this.cmp)
        }, s.prototype.updateItem = function(t) {
            return i(this.nodes, t, this.cmp)
        }, s.prototype.clear = function() {
            return this.nodes = []
        }, s.prototype.empty = function() {
            return 0 === this.nodes.length
        }, s.prototype.size = function() {
            return this.nodes.length
        }, s.prototype.clone = function() {
            var t = new s;
            return t.nodes = this.nodes.slice(0), t
        }, s.prototype.toArray = function() {
            return this.nodes.slice(0)
        }, s.prototype.insert = s.prototype.push, s.prototype.top = s.prototype.peek, s.prototype.front = s.prototype.peek, s.prototype.has = s.prototype.contains, s.prototype.copy = s.prototype.clone, t = s, g = [], void 0 === (x = "function" == typeof(x = function() {
            return t
        }) ? x.apply(T, g) : x) || (u.exports = x)
    }).call(this)
}]);
let easystar = new EasyStar.js();
! function(run) {
    if (!run) return;
    let codes = {
        setup: () => {
            "use strict";

            let newFont = document.createElement("link");
            newFont.rel = "stylesheet";
            newFont.href = "https://fonts.googleapis.com/css?family=Ubuntu:700";
            newFont.type = "text/css";
            document.body.append(newFont);

            let min = document.createElement("script");
            min.src = "https://rawgit.com/kawanet/msgpack-lite/master/dist/msgpack.min.js";
            document.body.append(min);
        },
        main: () => {

            if (!useHack) {
                return;
            }

            "use strict";

            /*let scriptTags = document.getElementsByTagName("script");

            for (let i = 0; i < scriptTags.length; i++) {
                if (scriptTags[i].src.includes("bundle.js")) {
                    scriptTags[i].remove();
                    break;
                }
            }*/

            window.oncontextmenu = function() {
                return false;
            };

            let config = window.config;

            // CLIENT:
            config.clientSendRate = 9; // Aim Packet Send Rate
            config.serverUpdateRate = 9;

            // UI:
            config.deathFadeout = 0;

            // CHECK IN SANDBOX:
            config.isSandbox = window.location.hostname == "sandbox.moomoo.io";

            // CUSTOMIZATION:
            config.skinColors = ["#0d0000", "#cbb091", "#896c4b",
                                 "#fadadc", "#ececec", "#c37373", "#4c4c4c", "#ecaff7", "#738cc3",
                                 "#8bc373", "#91b2db"
                                ];
            config.weaponVariants = [{
                id: 0,
                src: "",
                xp: 0,
                val: 1,
            }, {
                id: 1,
                src: "_g",
                xp: 3000,
                val: 1.1,
            }, {
                id: 2,
                src: "_d",
                xp: 7000,
                val: 1.18,
            }, {
                id: 3,
                src: "_r",
                poison: true,
                xp: 12000,
                val: 1.18,
            }, {
                id: 4,
                src: "_e",
                poison: true,
                heal: true,
                xp: 24000,
                val: 1.18,
            }];

            // VISUAL:
            config.anotherVisual = true;
            config.useWebGl = false;
            config.resetRender = false;

            function waitTime(timeout) {
                return new Promise((done) => {
                    setTimeout(() => {
                        done();
                    }, timeout);
                });
            }

            let changed = false;
            let botSkts = [];

            // STORAGE:
            let canStore;
            if (typeof(Storage) !== "undefined") {
                canStore = true;
            }

            function saveVal(name, val) {
                if (canStore)
                    localStorage.setItem(name, val);
            }

            function deleteVal(name) {
                if (canStore)
                    localStorage.removeItem(name);
            }

            function getSavedVal(name) {
                if (canStore)
                    return localStorage.getItem(name);
                return null;
            }

            // CONFIGS:
            let gC = function(a, b) {
                try {
                    let res = JSON.parse(getSavedVal(a));
                    if (typeof res === "object") {
                        return b;
                    } else {
                        return res;
                    }
                } catch (e) {
                    alert("dieskid");
                    return b;
                }
            };

            function setCommands() {
                return {
                    "help": {
                        desc: "Show Commands",
                        action: function(message) {
                            for (let cmds in commands) {
                                addMenuChText("/" + cmds, commands[cmds].desc, "lime", 1);
                            }
                        }
                    },
                    "clear": {
                        desc: "Clear Chats",
                        action: function(message) {
                            resetMenuChText();
                        }
                    },
                    "debug": {
                        desc: "Debug Mod For Development",
                        action: function(message) {
                            addDeadPlayer(player);
                            addMenuChText("Debug", "Done", "#99ee99", 1);
                        }
                    },
                    "play": {
                        desc: "Play Music ( /play [link] )",
                        action: function(message) {
                            let link = message.split(" ");
                            if (link[1]) {
                                let audio = new Audio(link[1]);
                                audio.play();
                            } else {
                                addMenuChText("Warn", "Enter Link ( /play [link] )", "#99ee99", 1);
                            }
                        }
                    },
                    "bye": {
                        desc: "Leave Game",
                        action: function(message) {
                            window.leave();
                        }
                    },
                };
            }

            function setConfigs() {
                return {
                    killChat: false,
                    autoBuy: true,
                    autoBuyEquip: true,
                    autoPush: true,
                    revTick: true,
                    spikeTick: true,
                    predictTick: true,
                    autoPlace: true,
                    autoReplace: true,
                    antiTrap: true,
                    slowOT: false,
                    attackDir: true,
                    ae86_Remake: false,
                    ae86: false,
                    tracers: false,
                    fpsBoost: true,
                    autoRespawn: false
                };
            }

            let commands = setCommands();
            let configs = setConfigs();

            window.removeConfigs = function() {
                for (let cF in configs) {
                    deleteVal(cF, configs[cF]);
                }
            };

            for (let cF in configs) {
                configs[cF] = gC(cF, configs[cF]);
            }

            // MENU FUNCTIONS:
            window.changeMenu = function() {};
            window.debug = function() {};
            window.toggleNight = function() {};
            window.adws_67314 = function() {};

            // PAGE 1:
            window.startGrind = function() {};

            // PAGE 3:
            window.connectFillBots = function() {};
            window.destroyFillBots = function() {};
            window.tryConnectBots = function() {};
            window.destroyBots = function() {};
            window.resBuild = function() {};
            window.toggleBotsCircle = function() {};
            window.toggleVisual = function() {};

            // SOME FUNCTIONS:
            window.prepareUI = function() {};
            window.leave = function() {};

            // nah hahahahahhh why good ping
            window.ping = imueheua ? 86 : 0;

            class deadfuturechickenmodrevival {
                constructor(flarez, lore) {
                    this.inGame = false;
                    this.lover = flarez + lore;
                    this.baby = "ae86";
                    this.isBlack = 0;
                    this.webSocket = undefined;
                    this.checkBaby = function() {
                        this.baby !== "ae86" ? this.isBlack++ : this.isBlack--;
                        if (this.isBlack >= 1) return "bl4cky";
                        return "noting for you";
                    };
                    this.x2 = 0;
                    this.y2 = 0;
                    this.chat = "Imagine playing this badass game XDDDDD";
                    this.summon = function(tmpObj) {
                        this.x2 = tmpObj.x;
                        this.y2 = tmpObj.y;
                        this.chat = tmpObj.name + " ur so bad XDDDD";
                    };
                    this.commands = function(cmd) {
                        cmd == "rv3link" && window.open("https://florr.io/");
                        cmd == "woah" && window.open("https://www.youtube.com/watch?v=MO0AGukzj6M");
                        return cmd;
                    };
                    this.dayte = "11yearold";
                    this.memeganoob = "69yearold";
                    this.startDayteSpawn = function(tmpObj) {
                        let ratio = setInterval(() => {
                            this.x2 = tmpObj.x + 20;
                            this.y2 = tmpObj.y - 20;
                            this.chat = "UR SO BAD LOL";
                            if (tmpObj.name == "ae86") {
                                this.chat = "omg ae86 go run";
                                setTimeout(() => {
                                    this.inGame = false;
                                    clearInterval(ratio);
                                }, 1000);
                            }
                        }, 1234);
                    };
                    this.AntiChickenModV69420 = function(tmpObj) {
                        return "!c!dc user " + tmpObj.name;
                    };
                }
            };
            class HtmlAction {
                constructor(element) {
                    this.element = element;
                };
                add(code) {
                    if (!this.element) return undefined;
                    this.element.innerHTML += code;
                };
                newLine(amount) {
                    let result = `<br>`;
                    if (amount > 0) {
                        result = ``;
                        for (let i = 0; i < amount; i++) {
                            result += `<br>`;
                        }
                    }
                    this.add(result);
                };
                checkBox(setting) {
                    let newCheck = `<input type = "checkbox"`;
                    setting.id && (newCheck += ` id = ${setting.id}`);
                    setting.style && (newCheck += ` style = ${setting.style.replaceAll(" ", "")}`);
                    setting.class && (newCheck += ` class = ${setting.class}`);
                    setting.checked && (newCheck += ` checked`);
                    setting.onclick && (newCheck += ` onclick = ${setting.onclick}`);
                    newCheck += `>`;
                    this.add(newCheck);
                };
                text(setting) {
                    let newText = `<input type = "text"`;
                    setting.id && (newText += ` id = ${setting.id}`);
                    setting.style && (newText += ` style = ${setting.style.replaceAll(" ", "")}`);
                    setting.class && (newText += ` class = ${setting.class}`);
                    setting.size && (newText += ` size = ${setting.size}`);
                    setting.maxLength && (newText += ` maxLength = ${setting.maxLength}`);
                    setting.value && (newText += ` value = ${setting.value}`);
                    setting.placeHolder && (newText += ` placeHolder = ${setting.placeHolder.replaceAll(" ", "&nbsp;")}`);
                    newText += `>`;
                    this.add(newText);
                };
                select(setting) {
                    let newSelect = `<select`;
                    setting.id && (newSelect += ` id = ${setting.id}`);
                    setting.style && (newSelect += ` style = ${setting.style.replaceAll(" ", "")}`);
                    setting.class && (newSelect += ` class = ${setting.class}`);
                    newSelect += `>`;
                    for (let options in setting.option) {
                        newSelect += `<option value = ${setting.option[options].id}`
                        setting.option[options].selected && (newSelect += ` selected`);
                        newSelect += `>${options}</option>`;
                    }
                    newSelect += `</select>`;
                    this.add(newSelect);
                };
                button(setting) {
                    let newButton = `<button`;
                    setting.id && (newButton += ` id = ${setting.id}`);
                    setting.style && (newButton += ` style = ${setting.style.replaceAll(" ", "")}`);
                    setting.class && (newButton += ` class = ${setting.class}`);
                    setting.onclick && (newButton += ` onclick = ${setting.onclick}`);
                    newButton += `>`;
                    setting.innerHTML && (newButton += setting.innerHTML);
                    newButton += `</button>`;
                    this.add(newButton);
                };
                selectMenu(setting) {
                    let newSelect = `<select`;
                    if (!setting.id) {
                        alert("please put id skid");
                        return;
                    }
                    window[setting.id + "Func"] = function() {};
                    setting.id && (newSelect += ` id = ${setting.id}`);
                    setting.style && (newSelect += ` style = ${setting.style.replaceAll(" ", "")}`);
                    setting.class && (newSelect += ` class = ${setting.class}`);
                    newSelect += ` onchange = window.${setting.id + "Func"}()`;
                    newSelect += `>`;
                    let last;
                    let i = 0;
                    for (let options in setting.menu) {
                        newSelect += `<option value = ${"option_" + options} id = ${"O_" + options}`;
                        setting.menu[options] && (newSelect += ` checked`);
                        newSelect += ` style = "color: ${setting.menu[options] ? "#000" : "#fff"}; background: ${setting.menu[options] ? "#8ecc51" : "#fa0202"};">${options}</option>`;
                        i++;
                    }
                    newSelect += `</select>`;

                    this.add(newSelect);

                    i = 0;
                    for (let options in setting.menu) {
                        window[options + "Func"] = function() {
                            setting.menu[options] = getEl("check_" + options).checked ? true : false;
                            saveVal(options, setting.menu[options]);

                            getEl("O_" + options).style.color = setting.menu[options] ? "#000" : "#fff";
                            getEl("O_" + options).style.background = setting.menu[options] ? "#8ecc51" : "#f00e0e";

                            //getEl(setting.id).style.color = setting.menu[options] ? "#8ecc51" : "#cc5151";

                        };
                        this.checkBox({
                            id: "check_" + options,
                            style: `display: ${i == 0 ? "inline-block" : "none"};`,
                            class: "checkB",
                            onclick: `window.${options + "Func"}()`,
                            checked: setting.menu[options]
                        });
                        i++;
                    }

                    last = "check_" + getEl(setting.id).value.split("_")[1];
                    window[setting.id + "Func"] = function() {
                        getEl(last).style.display = "none";
                        last = "check_" + getEl(setting.id).value.split("_")[1];
                        getEl(last).style.display = "inline-block";

                        //getEl(setting.id).style.color = setting.menu[last.split("_")[1]] ? "#8ecc51" : "#fff";

                    };
                };
            };
            class Html {
                constructor() {
                    this.element = null;
                    this.action = null;
                    this.divElement = null;
                    this.startDiv = function(setting, func) {

                        let newDiv = document.createElement("div");
                        setting.id && (newDiv.id = setting.id);
                        setting.style && (newDiv.style = setting.style);
                        setting.class && (newDiv.className = setting.class);
                        this.element.appendChild(newDiv);
                        this.divElement = newDiv;

                        let addRes = new HtmlAction(newDiv);
                        typeof func == "function" && func(addRes);

                    };
                    this.addDiv = function(setting, func) {

                        let newDiv = document.createElement("div");
                        setting.id && (newDiv.id = setting.id);
                        setting.style && (newDiv.style = setting.style);
                        setting.class && (newDiv.className = setting.class);
                        setting.appendID && getEl(setting.appendID).appendChild(newDiv);
                        this.divElement = newDiv;

                        let addRes = new HtmlAction(newDiv);
                        typeof func == "function" && func(addRes);

                    };
                };
                set(id) {
                    this.element = getEl(id);
                    this.action = new HtmlAction(this.element);
                };
                resetHTML(text) {
                    if (text) {
                        this.element.innerHTML = ``;
                    } else {
                        this.element.innerHTML = ``;
                    }
                };
                setStyle(style) {
                    this.element.style = style;
                };
                setCSS(style) {
                    this.action.add(`<style>` + style + `</style>`);
                };
            };

            let HTML = new Html();

            let nightMode = document.createElement("div");
            nightMode.id = "nightMode";
            document.body.appendChild(nightMode);
            HTML.set("nightMode");
            HTML.setStyle(`
            display: none;
            position: absolute;
            pointer-events: none;
            background-color: rgb(0, 0, 100);
            opacity: 0;
            top: 0%;
            width: 100%;
            height: 100%;
            animation-duration: 5s;
            animation-name: night2;
            `);
            HTML.resetHTML();
            HTML.setCSS(`
            @keyframes night1 {
                from {opacity: 0;}
                to {opacity: 0.35;}
            }
            @keyframes night2 {
                from {opacity: 0.35;}
                to {opacity: 0;}
            }
            `);

            let menuDiv = document.createElement("div");
            menuDiv.id = "menuDiv";
            document.body.appendChild(menuDiv);
            HTML.set("menuDiv");
            HTML.setStyle(`
            position: absolute;
            left: 20px;
            top: 20px;
            `);
            HTML.resetHTML();
            HTML.setCSS(`
            .menuClass {
                color: #ffffff;
                font-size: 31px;
                text-align: left;
                padding: 10px;
                padding-top: 7px;
                padding-bottom: 5px;
                width: 600px;
                background-color: rgba(34, 34, 34, 0.9);
                box-shadow: 0 0 20px rgba(0, 0, 0, 0.2);
                -webkit-border-radius: 4px;
                -moz-border-radius: 4px;
                z-index: 9999;

                backdrop-filter: blur(5px);
                -webkit-backdrop-filter: blur(5px);

                transition: transform 0.3s ease, box-shadow 0.3s ease;
            }

            .menuClass:hover {
                transform: scale(1.03);

                box-shadow: 0 0 20px rgba(0, 0, 0, 0.5);
            }

            .menuC {
                display: none;
                font-family: "Hammersmith One";
                font-size: 12px;
                max-height: 180px;
                overflow-y: scroll;
                -webkit-touch-callout: none;
                -webkit-user-select: none;
                -khtml-user-select: none;
                -moz-user-select: none;
                -ms-user-select: none;
                user-select: none;
            }
            .menuB {
                text-align: center;
                background-color: rgba(34, 34, 34, 0.9);
                color: #fff;
                border: none;
                padding: 3px 3px;
                border-radius: 5px;
                cursor: pointer;
                transition: background-color 0.3s ease;
                margin-right: 10px;
                margin-bottom: 10px;
                margin-top: 10px;
            }
            .menuB:active {
                color: rgb(25, 25, 25);
                background-color: rgb(200, 200, 200);
            }
            .customText {
                color: #000;
                -webkit-border-radius: 4px;
                -moz-border-radius: 4px;
                border-radius: 4px;
                border: 2px solid #000;
            }
            .customText:focus {
                background-color: white;
            }
            .checkB {
                position: relative;
                top: 2px;
                accent-color: #888;
                cursor: pointer;
                background-color: transparent;
                border: 1px solid #fff;
            }
            .Cselect {
                -webkit-border-radius: 4px;
                -moz-border-radius: 4px;
                border-radius: 4px;
                background-color: rgb(75, 75, 75);
                color: #fff;
                border: 1px solid #000;
            }
            #menuChanger {
                position: absolute;
                right: -1px;
                bottom: 1px;
                background-color: transparent;
                color: #fff;
                border: none;
                padding: 10px;
                font-size: 16px;
                cursor: pointer;
                transition: background-color 0.3s ease, transform 0.1s ease;
            }

            #menuChanger:hover {
                background-color: rgba(255, 255, 255, 0);
                transform: scale(1.1);
            }
            #menuChanger:hover {
                color: #000;
            }
            ::-webkit-scrollbar {
                width: 10px;
            }
            ::-webkit-scrollbar-track {
                opacity: 0;
            }
            ::-webkit-scrollbar-thumb {
                background-color: rgb(25, 25, 25);
                -webkit-border-radius: 4px;
                -moz-border-radius: 4px;
                border-radius: 4px;
            }
            ::-webkit-scrollbar-thumb:active {
                background-color: rgb(230, 230, 230);
            }
            `);
            HTML.startDiv({
                id: "menuHeadLine",
                class: "menuClass"
            }, (html) => {
                html.add(`Raven`);
                html.button({
                    id: "menuChanger",
                    class: "material-icons",
                    innerHTML: `sync`,
                    onclick: "window.changeMenu()"
                });
                HTML.addDiv({
                    id: "menuButtons",
                    style: "display: block; overflow-y: visible;",
                    class: "menuC",
                    appendID: "menuHeadLine"
                }, (html) => {
                     html.newLine();
                    html.add('https://discord.gg/h2b4CKQZcR');
                    html.newLine();
                    html.button({
                        class: "menuB",
                        innerHTML: "DEBUG",
                        onclick: "window.debug()"
                    });
                    html.button({
                        class: "menuB",
                        innerHTML: "Night",
                        onclick: "window.toggleNight()"
                    });
                });
                HTML.addDiv({
                    id: "menuMain",
                    style: "display: block",
                    class: "menuC",
                    appendID: "menuHeadLine"
                }, (html) => {
                    html.button({
                        class: "menuB",
                        innerHTML: "ASWD",
                        onclick: "window.wasdMode()"
                    });
                    html.newLine();
                    html.add(`Spawn pad Grinder: `);
                    html.checkBox({
                        id: "weaponGrind",
                        class: "checkB",
                        onclick: "window.startGrind()"
                    });
                    html.newLine(2);
                    HTML.addDiv({
                        style: "font-size: 20px; color: #Ffffff;",
                        appendID: "menuMain"
                    }, (html) => {
                        html.add(`Settings:`);
                    });
                    html.add(`AntiPush and anti trap:`);
                    html.checkBox({
                        id: "antipush",
                        class: "checkB",
                        checked: true
                    });

                    html.newLine();
                    html.add(`New Healing Beta:`);
                    html.checkBox({
                        id: "healingBeta",
                        class: "checkB",
                        checked: false
                    });
                    html.newLine();
                    html.add(`
                    Music(press x): `);
                    html.select({
                        id: "autochats", class: "Cselect", option: {
                            "Initial D - The Top": {
                                id: "thetop",
                                selected: true
                            },
                            "Initial D - Gas Gas Gas": {
                                id: "gas"
                            },
                            "Initial D - Deja Vu": {
                                id: "dejavu"
                            },
                            "Alaina Cross - No Rival": {
                                id: "norival"
                            },
                            "Crypt x Joey Nato - Invincible": {
                                id: "inv"
                            },
                            "Cheriimoya - Living Life In The Night": {
                                id: "livinglife"
                            },
                            "Gentrammel - Out Of My Mind": {
                                id: "outtamind"
                            },
                            "BEAUZ - Outerspace": {
                                id: "outerspace"
                            },
                            "CRVN - Nobody": {
                                id: "nobody"
                            },
                            "FELLOWSHIP - Glory Days": {
                                id: "glorydays"
                            },
                            "LoL (Worlds 2017) - Legends Never Die": {
                                id: "legendsNeverDie"
                            },
                            "V O E - Giants": {
                                id: "giants"
                            },
                            "Turi ip ip": {
                                id: "ipip"
                            },
                            "1nonly - Stay With Me": {
                                id: "staywithme"
                            },
                            "Skyfall - Adele": {
                                id: "skyfall"
                            },
                            "Better Place - NSYNC": {
                                id: "betterplace"
                            },
                            "LoL (Worlds 2020) - Take Over": {
                                id: "takeover"
                            }
                        }
                    });
                    html.newLine();
                });
                HTML.addDiv({
                    id: "menuConfig",
                    class: "menuC",
                    appendID: "menuHeadLine"
                }, (html) => {
                    html.add(`AutoPlacer Placement Tick: `);
                    html.text({
                        id: "autoPlaceTick",
                        class: "customText",
                        value: "2",
                        size: "2em",
                        maxLength: "1"
                    });
                    html.newLine();
                    html.add(`Configs: `);
                    html.selectMenu({
                        id: "configsChanger",
                        class: "Cselect",
                        menu: configs
                    });
                    html.newLine();
                    html.add(`InstaKill Type: `);
                    html.select({
                        id: "instaType",
                        class: "Cselect",
                        option: {
                            STACK: {
                                id: "rev",
                                selected: true
                            },
                            Normal: {
                                id: "normal"
                            }
                        }
                    });
                    html.newLine();
                    html.add('Zoom: ');
                    html.select({
                        id: "vision",
                        class: "Cselect",
                        option: {
                            'x1': {
                                id: "1",
                            },
                            'x1.2': {
                                id: "1.2",
                                selected: true
                            },
                            'x1.4': {
                                id: "1.4"
                            },
                            'x1.5': {
                                id: "1.5"
                            },
                            'x1.6': {
                                id: "1.6"
                            },
                            'x1.8': {
                                id: "1.8"
                            },
                            'x2': {
                                id: "2"
                            }
                        }
                    })
                    html.newLine();
                    html.add(`AutoChat `);
                    html.checkBox({
                        id: "autochat",
                        class: "checkB",
                        checked: true
                    });
                    html.newLine();
                    html.add('Camera: ');
                    html.select({
                        id: "visualType",
                        class: "Cselect",
                        option: {
                            'Camera +': {
                                id: 'Cam+',
                            },
                            'Camera 0': {
                                id: 'Cam0',
                                selected: true
                            },
                            'Camera 1': {
                                id: 'Cam1',

                            },
                            'Camera 2': {
                                id: 'Cam2',
                            },
                            'Camera 3': {
                                id: 'Cam3',
                            }
                        }
                    });
                    html.newLine();
                    html.add(`AntiBull Type: `);
                    html.select({
                        id: "antiBullType",
                        class: "Cselect",
                        option: {
                            "Disable AntiBull": {
                                id: "noab",
                                selected: true
                            },
                            "When Reloaded": {
                                id: "abreload",
                            },
                            "Primary Reloaded": {
                                id: "abalway"
                            }
                        }
                    });
                    html.newLine();
                    html.add(`Backup Nobull Insta: `);
                    html.checkBox({
                        id: "backupNobull",
                        class: "checkB",
                        checked: true
                    });
                    html.newLine();
                    html.add(`Turret Gear Combat Assistance: `);
                    html.checkBox({
                        id: "turretCombat",
                        class: "checkB"
                    });
           id: "",
                  html.newLine();
                    html.add(`Safe AntiSpikeTick: `);
                    html.checkBox({
                        id: "safeAntiSpikeTick",
                        class: "checkB",
                        checked: true
                        });
                                        html.newLine();
                        html.add(`Auto Sync: `);
                    html.checkBox({

                        checked: true
                    });
                                   html.newLine();
                        html.add(`Auto bull spam(broken): `);
                    html.checkBox({

                        checked: true
                    });
                    html.newLine();
                    html.add(`
                    Auto heal: `);
                    html.select({

                        option: {
                            "Pro": {

                                selected: true
                            },
                            "Ping": {

                            },
                            "Normal": {

                            }
                        }
                    });
                    html.newLine();
                        html.add(`Fix dump auto break: `);
                    html.checkBox({

                        });

                    });

                HTML.addDiv({
                    id: "menuOther",
                    class: "menuC",
                    appendID: "menuHeadLine"
                }, (html) => {
                    html.button({
                        class: "menuB",
                        innerHTML: "Connect Bots",
                        onclick: "window.tryConnectBots()"
                    });
                    html.button({
                        class: "menuB",
                        innerHTML: "Disconnect Bots",
                        onclick: "window.destroyBots()"
                    });
                    html.newLine();
                    html.button({
                        class: "menuB",
                        innerHTML: "Connect FBots",
                        onclick: "window.connectFillBots()"
                    });
                    html.button({
                        class: "menuB",
                        innerHTML: "Disconnect FBots",
                        onclick: "window.destroyFillBots()"
                    });
                    html.newLine();
                    html.button({
                        class: "menuB",
                        innerHTML: "Reset Break Objects",
                        onclick: "window.resBuild()"
                    });
                    html.newLine();
                    html.add(`Break Objects Range: `);
                    html.text({
                        id: "breakRange",
                        class: "customText",
                        value: "700",
                        size: "3em",
                        maxLength: "4"
                    });
                    html.newLine();
                    html.add(`Predict Movement Type: `);
                    html.select({
                        id: "predictType",
                        class: "Cselect",
                        option: {
                            "Disable Render": {
                                id: "disableRender",
                                selected: true
                            },
                            "X/Y and 2": {
                                id: "pre2",
                            },
                            "X/Y and 3": {
                                id: "pre3"
                            }
                        }
                    });
                    html.newLine();
                    html.add(`Render Placers: `);
                    html.checkBox({
                        id: "placeVis",
                        class: "checkB",
                        checked: true
                    });
                    html.newLine();
                    html.add(`Visuals: `);
                    html.select({
                        id: "visualType",
                        class: "Cselect",
                        option: {
                            "Raven": {
                                id: "ueh1",
                            },
                            "Raven2": {
                                id: "ueh2",
                                selected: true
                            },
                        }
                    });
                    html.newLine(2);
                    html.button({
                        class: "menuB",
                        innerHTML: "Toggle Fbots Circle",
                        onclick: "window.toggleBotsCircle()"
                    });
                    html.newLine();
                    html.add(`MADARA`);
                    html.text({
                        id: "circleRad",
                        class: "customText",
                        value: "200",
                        size: "3em",
                        maxLength: "4"
                    });
                    html.newLine();
                    html.add(`Rad Speed: `);
                    html.text({
                        id: "radSpeed",
                        class: "customText",
                        value: "0.1",
                        size: "2em",
                        maxLength: "3"
                    });
                    html.newLine(2);
                    html.add(`MADARA `);
                    html.checkBox({
                        id: "funni",
                        class: "checkB"
                    });
                    html.newLine();
                    html.button({
                        class: "menuB",
                        innerHTML: "Toggle Another Visual",
                        onclick: "window.toggleVisual()"
                    });
                    html.newLine();
                });
            });


            let menuChatDiv = document.createElement("div");
            menuChatDiv.id = "menuChatDiv";
            document.body.appendChild(menuChatDiv);
            HTML.set("menuChatDiv");
            HTML.setStyle(`
            position: absolute;
            display: block;
            left: 20px;
            top: 350px
            `);
            HTML.resetHTML();
            HTML.setCSS(`
            .chDiv{
                color: #fff;
                padding: 10px;
                width: 390px;
                height: 250px;
                background-color: rgba(34, 34, 34, 0.9);
                font-family: "Courier New", monospace;
                border-radius: 4px;
                backdrop-filter: blur(5px);

                backdrop-filter: blur(5px);
                -webkit-backdrop-filter: blur(5px);

                transition: transform 0.3s ease, box-shadow 0.3s ease;
            }

            .chDiv:hover {
                transform: scale(1.03);

                box-shadow: 0 0 20px rgba(0, 0, 0, 0.5);
            }


            .chMainDiv {
                font-family: "Ubuntu";
                font-size: 16px;
                max-height: 215px;
                overflow-y: scroll;
                -webkit-touch-callout: none;
                -webkit-user-select: none;
                -khtml-user-select: none;
                -moz-user-select: none;
                -ms-user-select: none;
                user-select: none;
                overflow-x: hidden;
                border-radius: 6px;
            }
            .chMainBox{
                position: absolute;
                left: 10px;
                bottom: 10px;
                width: 380px;
                height: 25px;
                background-color: rgba(255, 255, 255, 1);
                -webkit-border-radius: 4px;
                -moz-border-radius: 4px;
                border-radius: 4px;
                color: rgba(0, 0, 0, 1);
                font-family: "Arial";
                font-size: 12px;
                border: none;
                outline: none;
            }
            `);
            HTML.startDiv({
                id: "mChDiv",
                class: "chDiv"
            }, (html) => {
                HTML.addDiv({
                    id: "mChMain",
                    class: "chMainDiv",
                    appendID: "mChDiv"
                }, (html) => {});
                html.text({
                    id: "mChBox",
                    class: "chMainBox",
                    placeHolder: `To chat click here or press "Enter" key`
                });
            });

            let menuChats = getEl("mChMain");
            let menuChatBox = getEl("mChBox");
            let menuCBFocus = false;
            let menuChCounts = 0;

            menuChatBox.value = "";
            menuChatBox.addEventListener("focus", () => {
                menuCBFocus = true;
            });
            menuChatBox.addEventListener("blur", () => {
                menuCBFocus = false;
            });

            function addMenuChText(name, message, color, noTimer) {
                HTML.set("menuChatDiv");
                color = color || "white";

                let time = new Date();
                let min = time.getMinutes();
                let hour = time.getHours();

                let getAMPM = hour >= 12 ? "PM" : "AM";
                let text = ``;
                if (!noTimer) text += `[${(hour % 12) + ":" + min + " " + getAMPM}]`;
                if (name) text += `${(!noTimer ? " - " : "") + name}`;
                if (message) text += `${(name ? ": " : !noTimer ? " - " : "") + message}\n`;

                HTML.addDiv({
                    id: "menuChDisp" + menuChCounts,
                    style: `color: ${color}`,
                    appendID: "mChMain"
                }, (html) => {
                    html.add(text);
                });
                menuChats.scrollTop = menuChats.scrollHeight;
                menuChCounts++;
            }

            function resetMenuChText() {
                menuChats.innerHTML = ``;
                menuChCounts = 0;
                addMenuChText(null, "Chat '/help' for a list of chat commands.", "white", 1)
            }
            resetMenuChText();

            let menuIndex = 9999;
            let menus = ["menuMain", "menuConfig", "menuOther"];
            window.changeMenu = function() {
                getEl(menus[menuIndex % menus.length]).style.display = "none";
                menuIndex++;
                getEl(menus[menuIndex % menus.length]).style.display = "block";
            };

            let mStatus = document.createElement("div");
            mStatus.id = "status";
            getEl("gameUI").appendChild(mStatus);
            HTML.set("status");
            HTML.setStyle(`
            display: block;
            position: absolute;
            color: #ddd;
            font: 15px Hammersmith One;
            bottom: 215px;
            left: 20px;
            `);
            HTML.resetHTML();
            HTML.setCSS(`
            .sizing {
                font-size: 15px;
            }
            .mod {
                font-size: 15px;
                display: inline-block;
            }
            `);
            HTML.startDiv({
                id: "uehmod",
                class: "sizing"
            }, (html) => {
                html.add(`Ping: `);
                HTML.addDiv({
                    id: "pingFps",
                    class: "mod",
                    appendID: "uehmod"
                }, (html) => {
                    html.add("None");
                });
                html.newLine();
                html.add(`Packet: `);
                HTML.addDiv({
                    id: "packetStatus",
                    class: "mod",
                    appendID: "uehmod"
                }, (html) => {
                    html.add("Auto insta: broken");
                });
            });

            /*function modLog() {
                let logs = [];
                for (let i = 0; i < arguments.length; i++) {
                    logs.push(arguments[i]);
                }
                getEl("modLog").innerHTML = logs;
            }*/

            let openMenu = false;

            let WS = undefined;
            let socketID = undefined;

            let useWasd = false;
            let secPacket = 0;
            let secMax = 110;
            let secTime = 1000;
            let firstSend = {
                sec: false
            };
            let game = {
                tick: 0,
                tickQueue: [],
                tickBase: function(set, tick) {
                    if (this.tickQueue[this.tick + tick]) {
                        this.tickQueue[this.tick + tick].push(set);
                    } else {
                        this.tickQueue[this.tick + tick] = [set];
                    }
                },
                tickRate: (1000 / config.serverUpdateRate),
                tickSpeed: 0,
                lastTick: performance.now()
            };
            let modConsole = [];

            let dontSend = false;
            let fpsTimer = {
                last: 0,
                time: 0,
                ltime: 0
            }
            let lastMoveDir = undefined;
            let lastsp = ["cc", 1, "__proto__"];

            WebSocket.prototype.nsend = WebSocket.prototype.send;
            WebSocket.prototype.send = function(message) {
                if (!WS) {
                    WS = this;
                    WS.addEventListener("message", function(msg) {
                        getMessage(msg);
                    });
                    WS.addEventListener("close", (event) => {
                        if (event.code == 4001) {
                            window.location.reload();
                        }
                    });
                }
                if (WS == this) {
                    dontSend = false;

                    // EXTRACT DATA ARRAY:
                    let data = new Uint8Array(message);
                    let parsed = window.msgpack.decode(data);
                    let type = parsed[0];
                    data = parsed[1];

                    // SEND MESSAGE:
                    if (type == "6") {

                        if (data[0]) {
                            // ANTI PROFANITY:
                            let profanity = ["cunt", "whore", "fuck", "shit", "faggot", "nigger", "nigga", "dick", "vagina", "minge", "cock", "rape", "cum", "sex", "tits", "penis", "clit", "pussy", "meatcurtain", "jizz", "prune", "douche", "wanker", "damn", "bitch", "dick", "fag", "bastard", ];
                            let tmpString;
                            profanity.forEach((profany) => {
                                if (data[0].indexOf(profany) > -1) {
                                    tmpString = "";
                                    for (let i = 0; i < profany.length; ++i) {
                                        if (i == 1) {
                                            tmpString += String.fromCharCode(0);
                                        }
                                        tmpString += profany[i];
                                    }
                                    let re = new RegExp(profany, "g");
                                    data[0] = data[0].replace(re, tmpString);
                                }
                            });

                            // FIX CHAT:
                            data[0] = data[0].slice(0, 30);
                        }

                    } else if (type == "L") {
                        // MAKE SAME CLAN:
                        data[0] = data[0] + (String.fromCharCode(0).repeat(7));
                        data[0] = data[0].slice(0, 7);
                    } else if (type == "M") {
                        // APPLY CYAN COLOR:
                        data[0].name = data[0].name == "" ? "unknown" : data[0].name;
                        data[0].moofoll = true;
                        data[0].skin = data[0].skin == 10 ? "__proto__" : data[0].skin;
                        lastsp = [data[0].name, data[0].moofoll, data[0].skin];
                    } else if (type == "D") {
                        if ((my.lastDir == data[0]) || [null, undefined].includes(data[0])) {
                            dontSend = true;
                        } else {
                            my.lastDir = data[0];
                        }
                    } else if (type == "d") {
                        if (!data[2]) {
                            dontSend = true;
                        } else {
                            if (![null, undefined].includes(data[1])) {
                                my.lastDir = data[1];
                            }
                        }
                    } else if (type == "K") {
                        if (!data[1]) {
                            dontSend = true;
                        }
                    } else if (type == "S") {
                        instaC.wait = !instaC.wait;
                        dontSend = true;
                    } else if (type == "a") {
                        if (data[1]) {
                            if (player.moveDir == data[0]) {
                                dontSend = true;
                            }
                            player.moveDir = data[0];
                        } else {
                            dontSend = true;
                        }
                    }
                    if (!dontSend) {
                        let binary = window.msgpack.encode([type, data]);
                        this.nsend(binary);

                        // START COUNT:
                        if (!firstSend.sec) {
                            firstSend.sec = true;
                            setTimeout(() => {
                                firstSend.sec = false;
                                secPacket = 0;
                            }, secTime);
                        }

                        if (secPacket == 100) {
                            addMenuChText("Warn", "LAGGGGGG", "#cc5151", 1);
                        }

                        secPacket++;
                    }
                } else {
                    this.nsend(message);
                }
            }

            function packet(type) {
                // EXTRACT DATA ARRAY:
                let data = Array.prototype.slice.call(arguments, 1);

                // SEND MESSAGE:
                let binary = window.msgpack.encode([type, data]);
                WS.send(binary);
            }

            function origPacket(type) {
                // EXTRACT DATA ARRAY:
                let data = Array.prototype.slice.call(arguments, 1);

                // SEND MESSAGE:
                let binary = window.msgpack.encode([type, data]);
                WS.nsend(binary);
            }

            window.leave = function() {
                origPacket("kys", {
                    "frvr is so bad": true,
                    "sidney is too good": true,
                    "dev are too weak": true,
                });
            };

            //...lol
            let io = {
                send: packet
            };

            function getMessage(message) {
                let data = new Uint8Array(message.data);
                let parsed = window.msgpack.decode(data);
                let type = parsed[0];
                data = parsed[1];
                let events = {
                    A: setInitData, // id: setInitData,
                    //B: disconnect,
                    C: setupGame, // 1: setupGame,
                    D: addPlayer, // 2: addPlayer,
                    E: removePlayer, // 4: removePlayer,
                    a: updatePlayers, // 33: updatePlayers,
                    G: updateLeaderboard, // 5: updateLeaderboard,here
                    H: loadGameObject, // 6: loadGameObject,
                    I: loadAI, // a: loadAI,
                    J: animateAI, // aa: animateAI,
                    K: gatherAnimation, // 7: gatherAnimation,
                    L: wiggleGameObject, // 8: wiggleGameObject,
                    M: shootTurret, // sp: shootTurret,
                    N: updatePlayerValue, // 9: updatePlayerValue,
                    O: updateHealth, // h: updateHealth,//here
                    P: killPlayer, // 11: killPlayer,
                    Q: killObject, // 12: killObject,
                    R: killObjects, // 13: killObjects,
                    S: updateItemCounts, // 14: updateItemCounts,
                    T: updateAge, // 15: updateAge,
                    U: updateUpgrades, // 16: updateUpgrades,
                    V: updateItems, // 17: updateItems,
                    X: addProjectile, // 18: addProjectile,
                    Y: remProjectile, // 19: remProjectile,
                    //Z: serverShutdownNotice,
                    //0: addAlliance,
                    //1: deleteAlliance,
                    2: allianceNotification, // an: allianceNotification,
                    3: setPlayerTeam, // st: setPlayerTeam,
                    4: setAlliancePlayers, // sa: setAlliancePlayers,
                    5: updateStoreItems, // us: updateStoreItems,
                    6: receiveChat, // ch: receiveChat,
                    7: updateMinimap, // mm: updateMinimap,
                    8: showText, // t: showText,
                    9: pingMap, // p: pingMap,
                    //0: pingSocketResponse,
                };
                if (type == "io-init") {
                    socketID = data[0];
                } else {
                    if (events[type]) {
                        events[type].apply(undefined, data);
                    }
                }
            }

            // MATHS:
            Math.lerpAngle = function(value1, value2, amount) {
                let difference = Math.abs(value2 - value1);
                if (difference > Math.PI) {
                    if (value1 > value2) {
                        value2 += Math.PI * 2;
                    } else {
                        value1 += Math.PI * 2;
                    }
                }
                let value = value2 + ((value1 - value2) * amount);
                if (value >= 0 && value <= Math.PI * 2) return value;
                return value % (Math.PI * 2);
            };

            // REOUNDED RECTANGLE:
            CanvasRenderingContext2D.prototype.roundRect = function(x, y, w, h, r) {
                if (w < 2 * r) r = w / 2;
                if (h < 2 * r) r = h / 2;
                if (r < 0)
                    r = 0;
                this.beginPath();
                this.moveTo(x + r, y);
                this.arcTo(x + w, y, x + w, y + h, r);
                this.arcTo(x + w, y + h, x, y + h, r);
                this.arcTo(x, y + h, x, y, r);
                this.arcTo(x, y, x + w, y, r);
                this.closePath();
                return this;
            };

            // GLOBAL VALUES:

            let petals = [];
            let allChats = [];
            let ticks = {
                tick: 0,
                delay: 0,
                time: [],
                manage: [],
            };
            let ais = [];
            let players = [];
            let alliances = [];
            let alliancePlayers = [];
            let allianceNotifications = [];
            let gameObjects = [];
            let projectiles = [];
            let deadPlayers = [];

            let breakObjects = [];

            let player;
            let playerSID;
            let tmpObj;

            let enemy = [];
            let nears = [];
            let near = [];

            let my = {
                reloaded: false,
                waitHit: 0,
                autoAim: false,
                revAim: false,
                ageInsta: true,
                reSync: false,
                bullTick: 0,
                anti0Tick: 0,
                antiSync: false,
                safePrimary: function(tmpObj) {
                    return [0, 8].includes(tmpObj.primaryIndex);
                },
                safeSecondary: function(tmpObj) {
                    return [10, 11, 14].includes(tmpObj.secondaryIndex);
                },
                lastDir: 0,
                autoPush: false,
                pushData: {}
            }

            // FIND OBJECTS BY ID/SID:
            function findID(tmpObj, tmp) {
                return tmpObj.find((THIS) => THIS.id == tmp);
            }

            function findSID(tmpObj, tmp) {
                return tmpObj.find((THIS) => THIS.sid == tmp);
            }

            function findPlayerByID(id) {
                return findID(players, id);
            }

            function findPlayerBySID(sid) {
                return findSID(players, sid);
            }

            function findAIBySID(sid) {
                return findSID(ais, sid);
            }

            function findObjectBySid(sid) {
                return findSID(gameObjects, sid);
            }

            function findProjectileBySid(sid) {
                return findSID(gameObjects, sid);
            }

            let gameName = getEl("gameName");
            gameName.innerText = "MooMoo.io";
            let adCard = getEl("adCard");
            adCard.remove();
            let promoImageHolder = getEl("promoImgHolder");
            promoImageHolder.remove();

            let chatButton = getEl("chatButton");
            chatButton.remove();
            let gameCanvas = getEl("gameCanvas");
            let mainContext = gameCanvas.getContext("2d");
            let mapDisplay = getEl("mapDisplay");
            let mapContext = mapDisplay.getContext("2d");
            mapDisplay.width = 300;
            mapDisplay.height = 300;
            let storeMenu = getEl("storeMenu");
            let storeHolder = getEl("storeHolder");
            let upgradeHolder = getEl("upgradeHolder");
            let upgradeCounter = getEl("upgradeCounter");
            let chatBox = getEl("chatBox");
            chatBox.autocomplete = "off";
            chatBox.style.textAlign = "center";
            chatBox.style.width = "18em";
            let chatHolder = getEl("chatHolder");
            let actionBar = getEl("actionBar");
            let leaderboardData = getEl("leaderboardData");
            let itemInfoHolder = getEl("itemInfoHolder");
            let menuCardHolder = getEl("menuCardHolder");
            let mainMenu = getEl("mainMenu");
            let diedText = getEl("diedText");
            let screenWidth;
            let screenHeight;
            let maxScreenWidth = config.maxScreenWidth * parseFloat(getEl("vision").value);
            let maxScreenHeight = config.maxScreenHeight * parseFloat(getEl("vision").value);
            let pixelDensity = 1;
            let delta;
            let now;
            let lastUpdate = performance.now();
            let camX;
            let camY;
            let tmpDir;
            let mouseX = 0;
            let mouseY = 0;
            let allianceMenu = getEl("allianceMenu");
            let waterMult = 1;
            let waterPlus = 0;

            let outlineColor = "#000000";
            let darkOutlineColor = "#000000";
            let outlineWidth = 5.5;

            let isNight = false;
            let firstSetup = true;
            let keys = {};
            let moveKeys = {
                87: [0, -1],
                38: [0, -1],
                83: [0, 1],
                40: [0, 1],
                65: [-1, 0],
                37: [-1, 0],
                68: [1, 0],
                39: [1, 0],
            };
            let attackState = 0;
            let inGame = false;

            let macro = {};
            let mills = {
                place: 0,
                placeSpawnPads: 0
            };
            let lastDir;

            let lastLeaderboardData = [];

            // ON LOAD:
            let inWindow = true;
            window.onblur = function() {
                inWindow = false;
            };
            window.onfocus = function() {
                inWindow = true;
                if (player && player.alive) {
                    // resetMoveDir();
                }
            };
            function zoomVision() {
                if (maxScreenWidth != config.maxScreenWidth * 1.5 || maxScreenHeight != config.maxScreenHeight * 1.5) {
                    maxScreenWidth = config.maxScreenWidth * 1.5;
                    maxScreenHeight = config.maxScreenHeight * 1.5;
                    resize();

                    let targetCamX = player.x + ((1920 / 2) / 30);
                    let targetCamY = player.y + ((1920 / 2) / 30);
                    camX = lerp(camX, targetCamX, 0.015);
                    camY = lerp(camY, targetCamY, 0.015);
                }
            }
            function resetZoom() {
                if (maxScreenWidth != config.maxScreenWidth * parseFloat(getEl("vision").value) || maxScreenHeight != config.maxScreenHeight * parseFloat(getEl("vision").value)) {
                    maxScreenWidth = config.maxScreenWidth * parseFloat(getEl("vision").value);
                    maxScreenHeight = config.maxScreenHeight * parseFloat(getEl("vision").value);
                    resize();

                    let targetCamX = player.x + ((1920 / 2) / 30);
                    let targetCamY = player.y + ((1920 / 2) / 30);
                    camX = lerp(camX, targetCamX, 0.015);
                    camY = lerp(camY, targetCamY, 0.015);
                }
            }

            getEl("vision").onchange = function() {
                resetZoom();
            }

            let placeVisible = [];
            let profanityList = ["cunt", "whore", "fuck", "shit", "faggot", "nigger",
                                 "nigga", "dick", "vagina", "minge", "cock", "rape", "cum", "sex",
                                 "tits", "penis", "clit", "pussy", "meatcurtain", "jizz", "prune",
                                 "douche", "wanker", "damn", "bitch", "dick", "fag", "bastard"
                                ];

            /** CLASS CODES */

            class Utils {
                constructor() {

                    // MATH UTILS:
                    let mathABS = Math.abs,
                        mathCOS = Math.cos,
                        mathSIN = Math.sin,
                        mathPOW = Math.pow,
                        mathSQRT = Math.sqrt,
                        mathATAN2 = Math.atan2,
                        mathPI = Math.PI;

                    let _this = this;

                    // GLOBAL UTILS:
                    this.round = function(n, v) {
                        return Math.round(n * v) / v;
                    };
                    this.toRad = function(angle) {
                        return angle * (mathPI / 180);
                    };
                    this.toAng = function(radian) {
                        return radian / (mathPI / 180);
                    };
                    this.randInt = function(min, max) {
                        return Math.floor(Math.random() * (max - min + 1)) + min;
                    };
                    this.randFloat = function(min, max) {
                        return Math.random() * (max - min + 1) + min;
                    };
                    this.lerp = function(value1, value2, amount) {
                        return value1 + (value2 - value1) * amount;
                    };
                    this.decel = function(val, cel) {
                        if (val > 0)
                            val = Math.max(0, val - cel);
                        else if (val < 0)
                            val = Math.min(0, val + cel);
                        return val;
                    };
                    this.getDistance = function(x1, y1, x2, y2) {
                        return mathSQRT((x2 -= x1) * x2 + (y2 -= y1) * y2);
                    };
                    this.getDist = function(tmp1, tmp2, type1, type2) {
                        let tmpXY1 = {
                            x: type1 == 0 ? tmp1.x : type1 == 1 ? tmp1.x1 : type1 == 2 ? tmp1.x2 : type1 == 3 && tmp1.x3,
                            y: type1 == 0 ? tmp1.y : type1 == 1 ? tmp1.y1 : type1 == 2 ? tmp1.y2 : type1 == 3 && tmp1.y3,
                        };
                        let tmpXY2 = {
                            x: type2 == 0 ? tmp2.x : type2 == 1 ? tmp2.x1 : type2 == 2 ? tmp2.x2 : type2 == 3 && tmp2.x3,
                            y: type2 == 0 ? tmp2.y : type2 == 1 ? tmp2.y1 : type2 == 2 ? tmp2.y2 : type2 == 3 && tmp2.y3,
                        };
                        return mathSQRT((tmpXY2.x -= tmpXY1.x) * tmpXY2.x + (tmpXY2.y -= tmpXY1.y) * tmpXY2.y);
                    };
                    this.getDirection = function(x1, y1, x2, y2) {
                        return mathATAN2(y1 - y2, x1 - x2);
                    };
                    this.getDirect = function(tmp1, tmp2, type1, type2) {
                        let tmpXY1 = {
                            x: type1 == 0 ? tmp1.x : type1 == 1 ? tmp1.x1 : type1 == 2 ? tmp1.x2 : type1 == 3 && tmp1.x3,
                            y: type1 == 0 ? tmp1.y : type1 == 1 ? tmp1.y1 : type1 == 2 ? tmp1.y2 : type1 == 3 && tmp1.y3,
                        };
                        let tmpXY2 = {
                            x: type2 == 0 ? tmp2.x : type2 == 1 ? tmp2.x1 : type2 == 2 ? tmp2.x2 : type2 == 3 && tmp2.x3,
                            y: type2 == 0 ? tmp2.y : type2 == 1 ? tmp2.y1 : type2 == 2 ? tmp2.y2 : type2 == 3 && tmp2.y3,
                        };
                        return mathATAN2(tmpXY1.y - tmpXY2.y, tmpXY1.x - tmpXY2.x);
                    };
                    this.getAngleDist = function(a, b) {
                        let p = mathABS(b - a) % (mathPI * 2);
                        return (p > mathPI ? (mathPI * 2) - p : p);
                    };
                    this.isNumber = function(n) {
                        return (typeof n == "number" && !isNaN(n) && isFinite(n));
                    };
                    this.isString = function(s) {
                        return (s && typeof s == "string");
                    };
                    this.kFormat = function(num) {
                        return num > 999 ? (num / 1000).toFixed(1) + "k" : num;
                    };
                    this.sFormat = function(num) {
                        let fixs = [{
                            num: 1e3,
                            string: "k"
                        },
                                    {
                                        num: 1e6,
                                        string: "m"
                                    },
                                    {
                                        num: 1e9,
                                        string: "b"
                                    },
                                    {
                                        num: 1e12,
                                        string: "q"
                                    }
                                   ].STACKED();
                        let sp = fixs.find(v => num >= v.num);
                        if (!sp) return num;
                        return (num / sp.num).toFixed(1) + sp.string;
                    };
                    this.capitalizeFirst = function(string) {
                        return string.charAt(0).toUpperCase() + string.slice(1);
                    };
                    this.fixTo = function(n, v) {
                        return parseFloat(n.toFixed(v));
                    };
                    this.sortByPoints = function(a, b) {
                        return parseFloat(b.points) - parseFloat(a.points);
                    };
                    this.lineInRect = function(recX, recY, recX2, recY2, x1, y1, x2, y2) {
                        let minX = x1;
                        let maxX = x2;
                        if (x1 > x2) {
                            minX = x2;
                            maxX = x1;
                        }
                        if (maxX > recX2)
                            maxX = recX2;
                        if (minX < recX)
                            minX = recX;
                        if (minX > maxX)
                            return false;
                        let minY = y1;
                        let maxY = y2;
                        let dx = x2 - x1;
                        if (Math.abs(dx) > 0.0000001) {
                            let a = (y2 - y1) / dx;
                            let b = y1 - a * x1;
                            minY = a * minX + b;
                            maxY = a * maxX + b;
                        }
                        if (minY > maxY) {
                            let tmp = maxY;
                            maxY = minY;
                            minY = tmp;
                        }
                        if (maxY > recY2)
                            maxY = recY2;
                        if (minY < recY)
                            minY = recY;
                        if (minY > maxY)
                            return false;
                        return true;
                    };
                    this.containsPoint = function(element, x, y) {
                        let bounds = element.getBoundingClientRect();
                        let left = bounds.left + window.scrollX;
                        let top = bounds.top + window.scrollY;
                        let width = bounds.width;
                        let height = bounds.height;

                        let insideHorizontal = x > left && x < left + width;
                        let insideVertical = y > top && y < top + height;
                        return insideHorizontal && insideVertical;
                    };
                    this.mousifyTouchEvent = function(event) {
                        let touch = event.changedTouches[0];
                        event.screenX = touch.screenX;
                        event.screenY = touch.screenY;
                        event.clientX = touch.clientX;
                        event.clientY = touch.clientY;
                        event.pageX = touch.pageX;
                        event.pageY = touch.pageY;
                    };
                    this.hookTouchEvents = function(element, skipPrevent) {
                        let preventDefault = !skipPrevent;
                        let isHovering = false;
                        // let passive = window.Modernizr.passiveeventlisteners ? {passive: true} : false;
                        let passive = false;
                        element.addEventListener("touchstart", this.checkTrusted(touchStart), passive);
                        element.addEventListener("touchmove", this.checkTrusted(touchMove), passive);
                        element.addEventListener("touchend", this.checkTrusted(touchEnd), passive);
                        element.addEventListener("touchcancel", this.checkTrusted(touchEnd), passive);
                        element.addEventListener("touchleave", this.checkTrusted(touchEnd), passive);

                        function touchStart(e) {
                            _this.mousifyTouchEvent(e);
                            window.setUsingTouch(true);
                            if (preventDefault) {
                                e.preventDefault();
                                e.stopPropagation();
                            }
                            if (element.onmouseover)
                                element.onmouseover(e);
                            isHovering = true;
                        }

                        function touchMove(e) {
                            _this.mousifyTouchEvent(e);
                            window.setUsingTouch(true);
                            if (preventDefault) {
                                e.preventDefault();
                                e.stopPropagation();
                            }
                            if (_this.containsPoint(element, e.pageX, e.pageY)) {
                                if (!isHovering) {
                                    if (element.onmouseover)
                                        element.onmouseover(e);
                                    isHovering = true;
                                }
                            } else {
                                if (isHovering) {
                                    if (element.onmouseout)
                                        element.onmouseout(e);
                                    isHovering = false;
                                }
                            }
                        }

                        function touchEnd(e) {
                            _this.mousifyTouchEvent(e);
                            window.setUsingTouch(true);
                            if (preventDefault) {
                                e.preventDefault();
                                e.stopPropagation();
                            }
                            if (isHovering) {
                                if (element.onclick)
                                    element.onclick(e);
                                if (element.onmouseout)
                                    element.onmouseout(e);
                                isHovering = false;
                            }
                        }
                    };
                    this.removeAllChildren = function(element) {
                        while (element.hasChildNodes()) {
                            element.removeChild(element.lastChild);
                        }
                    };
                    this.generateElement = function(config) {
                        let element = document.createElement(config.tag || "div");

                        function bind(configValue, elementValue) {
                            if (config[configValue])
                                element[elementValue] = config[configValue];
                        }
                        bind("text", "textContent");
                        bind("html", "innerHTML");
                        bind("class", "className");
                        for (let key in config) {
                            switch (key) {
                                case "tag":
                                case "text":
                                case "html":
                                case "class":
                                case "style":
                                case "hookTouch":
                                case "parent":
                                case "children":
                                    continue;
                                default:
                                    break;
                            }
                            element[key] = config[key];
                        }
                        if (element.onclick)
                            element.onclick = this.checkTrusted(element.onclick);
                        if (element.onmouseover)
                            element.onmouseover = this.checkTrusted(element.onmouseover);
                        if (element.onmouseout)
                            element.onmouseout = this.checkTrusted(element.onmouseout);
                        if (config.style) {
                            element.style.cssText = config.style;
                        }
                        if (config.hookTouch) {
                            this.hookTouchEvents(element);
                        }
                        if (config.parent) {
                            config.parent.appendChild(element);
                        }
                        if (config.children) {
                            for (let i = 0; i < config.children.length; i++) {
                                element.appendChild(config.children[i]);
                            }
                        }
                        return element;
                    };
                    this.checkTrusted = function(callback) {
                        return function(ev) {
                            if (ev && ev instanceof Event && (ev && typeof ev.isTrusted == "boolean" ? ev.isTrusted : true)) {
                                callback(ev);
                            } else {
                                //console.error("Event is not trusted.", ev);
                            }
                        };
                    };
                    this.randomString = function(length) {
                        let text = "";
                        let possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
                        for (let i = 0; i < length; i++) {
                            text += possible.charAt(Math.floor(Math.random() * possible.length));
                        }
                        return text;
                    };
                    this.countInArray = function(array, val) {
                        let count = 0;
                        for (let i = 0; i < array.length; i++) {
                            if (array[i] === val) count++;
                        }
                        return count;
                    };
                    this.hexToRgb = function(hex) {
                        return hex.slice(1).match(/.{1,2}/g).map(g => parseInt(g, 16));
                    };
                    this.getRgb = function(r, g, b) {
                        return [r / 255, g / 255, b / 255].join(", ");
                    };
                }
            };
            class Animtext {
                // ANIMATED TEXT:
                constructor() {
                    // INIT:
                    this.init = function(x, y, scale, speed, life, text, color) {
                        this.x = x;
                        this.y = y;
                        this.color = color;
                        this.scale = scale;
                        this.startScale = this.scale;
                        this.maxScale = scale * 1.5;
                        this.scaleSpeed = 0.7;
                        this.speed = speed;
                        this.life = life;
                        this.text = text;
                        this.acc = 1;
                        this.alpha = 0;
                        this.maxLife = life;
                        this.ranX = UTILS.randFloat(-1, 1);
                    };

                    // UPDATE:
                    this.update = function(delta) {
                        if (this.life) {
                            this.life -= delta;
                            if (config.anotherVisual) {
                                this.y -= this.speed * delta * this.acc;
                                this.acc -= delta / (this.maxLife / 2.5);
                                if (this.life <= 200) {
                                    if (this.alpha > 0) {
                                        this.alpha = Math.max(0, this.alpha - (delta / 300));
                                    }
                                } else {
                                    if (this.alpha < 1) {
                                        this.alpha = Math.min(1, this.alpha + (delta / 100));
                                    }
                                }
                                this.x += this.ranX;
                            } else {
                                this.y -= this.speed * delta;
                            }
                            this.scale += this.scaleSpeed * delta;
                            if (this.scale >= this.maxScale) {
                                this.scale = this.maxScale;
                                this.scaleSpeed *= -1;
                            } else if (this.scale <= this.startScale) {
                                this.scale = this.startScale;
                                this.scaleSpeed = 0;
                            }
                            if (this.life <= 0) {
                                this.life = 0;
                            }
                        }
                    };

                    // RENDER:
                    this.render = function(ctxt, xOff, yOff) {
                        ctxt.lineWidth = 10;
                        ctxt.fillStyle = this.color;
                        ctxt.font = this.scale + "px " + (config.anotherVisual ? "Ubuntu" : "Hammersmith One");
                        if (config.anotherVisual) {
                            ctxt.globalAlpha = this.alpha;
                            ctxt.strokeStyle = darkOutlineColor;
                            ctxt.strokeText(this.text, this.x - xOff, this.y - yOff);
                        }
                        ctxt.fillText(this.text, this.x - xOff, this.y - yOff);
                        ctxt.globalAlpha = 1;
                    };
                }
            };
            class Textmanager {
                // TEXT MANAGER:
                constructor() {
                    this.texts = [];
                    this.stack = [];

                    // UPDATE:
                    this.update = function(delta, ctxt, xOff, yOff) {
                        ctxt.textBaseline = "middle";
                        ctxt.textAlign = "center";
                        for (let i = 0; i < this.texts.length; ++i) {
                            if (this.texts[i].life) {
                                this.texts[i].update(delta);
                                this.texts[i].render(ctxt, xOff, yOff);
                            }
                        }
                    };

                    // SHOW TEXT:
                    this.showText = function(x, y, scale, speed, life, text, color) {
                        let tmpText;
                        for (let i = 0; i < this.texts.length; ++i) {
                            if (!this.texts[i].life) {
                                tmpText = this.texts[i];
                                break;
                            }
                        }
                        if (!tmpText) {
                            tmpText = new Animtext();
                            this.texts.push(tmpText);
                        }
                        tmpText.init(x, y, scale, speed, life, text, color);
                    };
                }
            }
            class GameObject {
                constructor(sid) {
                    this.sid = sid;

                    // INIT:
                    this.init = function(x, y, dir, scale, type, data, owner) {
                        data = data || {};
                        this.sentTo = {};
                        this.gridLocations = [];
                        this.active = true;
                        this.alive = true;
                        this.doUpdate = data.doUpdate;
                        this.x = x;
                        this.y = y;
                        if (config.anotherVisual) {
                            this.dir = dir + Math.PI;
                        } else {
                            this.dir = dir;
                        }
                        this.lastDir = dir;
                        this.xWiggle = 0;
                        this.yWiggle = 0;
                        this.visScale = scale;
                        this.scale = scale;
                        this.type = type;
                        this.id = data.id;
                        this.owner = owner;
                        this.name = data.name;
                        this.isItem = (this.id != undefined);
                        this.group = data.group;
                        this.maxHealth = data.health;
                        this.health = this.maxHealth;
                        this.layer = 2;
                        if (this.group != undefined) {
                            this.layer = this.group.layer;
                        } else if (this.type == 0) {
                            this.layer = 3;
                        } else if (this.type == 2) {
                            this.layer = 0;
                        } else if (this.type == 4) {
                            this.layer = -1;
                        }
                        this.colDiv = data.colDiv || 1;
                        this.blocker = data.blocker;
                        this.ignoreCollision = data.ignoreCollision;
                        this.dontGather = data.dontGather;
                        this.hideFromEnemy = data.hideFromEnemy;
                        this.friction = data.friction;
                        this.projDmg = data.projDmg;
                        this.dmg = data.dmg;
                        this.pDmg = data.pDmg;
                        this.pps = data.pps;
                        this.zIndex = data.zIndex || 0;
                        this.turnSpeed = data.turnSpeed;
                        this.req = data.req;
                        this.trap = data.trap;
                        this.healCol = data.healCol;
                        this.teleport = data.teleport;
                        this.boostSpeed = data.boostSpeed;
                        this.projectile = data.projectile;
                        this.shootRange = data.shootRange;
                        this.shootRate = data.shootRate;
                        this.shootCount = this.shootRate;
                        this.spawnPoint = data.spawnPoint;
                        this.onNear = 0;
                        this.breakObj = false;
                        this.alpha = data.alpha || 1;
                        this.maxAlpha = data.alpha || 1;
                        this.damaged = 0;
                    };

                    // GET HIT:
                    this.changeHealth = function(amount, doer) {
                        this.health += amount;
                        return (this.health <= 0);
                    };

                    // GET SCALE:
                    this.getScale = function(sM, ig) {
                        sM = sM || 1;
                        return this.scale * ((this.isItem || this.type == 2 || this.type == 3 || this.type == 4) ?
                                             1 : (0.6 * sM)) * (ig ? 1 : this.colDiv);
                    };

                    // VISIBLE TO PLAYER:
                    this.visibleToPlayer = function(player) {
                        return !(this.hideFromEnemy) || (this.owner && (this.owner == player ||
                                                                        (this.owner.team && player.team == this.owner.team)));
                    };

                    // UPDATE:
                    this.update = function(delta) {
                        if (this.active) {
                            if (this.xWiggle) {
                                this.xWiggle *= Math.pow(0.99, delta);
                            }
                            if (this.yWiggle) {
                                this.yWiggle *= Math.pow(0.99, delta);
                            }
                            if (config.anotherVisual) {
                                let d2 = UTILS.getAngleDist(this.lastDir, this.dir);
                                if (d2 > 0.01) {
                                    this.dir += d2 / 5;
                                } else {
                                    this.dir = this.lastDir;
                                }
                            } else {
                                if (this.turnSpeed && this.dmg) {
                                    this.dir += this.turnSpeed * delta;
                                }
                            }
                        } else {
                            if (this.alive) {
                                this.alpha -= delta / (200 / this.maxAlpha);
                                this.visScale += delta / (this.scale / 2.5);
                                if (this.alpha <= 0) {
                                    this.alpha = 0;
                                    this.alive = false;
                                }
                            }
                        }
                    };

                    // CHECK TEAM:
                    this.isTeamObject = function(tmpObj) {
                        return this.owner == null ? true : (this.owner && tmpObj.sid == this.owner.sid || tmpObj.findAllianceBySid(this.owner.sid));
                    };
                }
            }
            class autoChatExport {
                constructor() {
                    this.betterplace = {
                        audio: new Audio("https://cdn.discordapp.com/attachments/1183826908270579813/1185869795611131955/Y2meta.app_-_NSYNC_-_Better_Place_Lyrics_128_kbps.mp3"),
                        chats: [
                            ["It's some kind of love", 12587],
                            ["it's some kind of fire", 14896],
                            ["I'm already up", 17177],
                            ["but you lift me higher", 19480],
                            ["You know I'm not wrong", 22305],
                            ["you know I'm not lyin'", 24384],
                            ["We do it better, yeah", 26905],
                            ["we do it better, yeah", 29176],
                            ["I don't mind if the", 32641],
                            ["world spins faster", 34625],
                            ["The music's louder", 36857],
                            [" the waves are get stronger", 39177],
                            ["I don't mind if the world", 41368],
                            ["spins faster", 43056],
                            ["Faster, faster", 45698],
                            ["Just let me take you to a better place", 48360],
                            ["Just let me take you", 50018],
                            ["to a better place", 52992],
                            ["I'm gonna make you", 54121],
                            ["kiss the sky tonight", 57008],
                            ["Yeah, if you let me", 60712],
                            ["show the way", 63440],
                            ["I'm so excited", 65545],
                            ["to see you excited", 69361],
                            ["I'll take you to a better place", 70528],
                            ["And, baby, you can", 73416],
                            [" love me on the way", 77625],
                            ["We're flyin' up to", 84696],
                            ["outer space", 90849],
                            ["I'm so excited", 92528],
                            ["see you excited", 94688],
                            ["You like the bed style loud", 96656],
                            ["I wanna lose control", 98984],
                            ["I wanna dance all night", 100800],
                            ["you like it nice and slow", 102825],
                            ["Don't want it any other way", 104992],
                            ["tell all your friends", 107529],
                            ["you're gonna stay", 108000]
                            ["When were together", 109433],
                            ["you know that we do it better", 111488],
                            ["I don't mind if the", 113560],
                            ["world spins faster", 115640],
                            ["The music's louder,", 117673],
                            ["the waves are gettin' stronger", 119664],
                            ["I don't mind if the", 122736],
                            ["world spins faster", 125489],
                            ["Faster, faster", 126952],
                            ["Just let me take you", 130552],
                            ["to a better place", 132034],
                            ["I'm gonna make you", 134656],
                            ["kiss the sky tonight", 136944],
                            ["Yeah, if you let me", 139176],
                            ["show the way", 143368],
                            ["I'm so excited", 144400],
                            ["to see you excited", 147224],
                            ["I'll take you to a", 151504],
                            ["better place", 153464],
                            ["And, baby, you can", 157224],
                            ["love me on the way", 164936],
                            ["We're flyin' up to", 167408],
                            ["outer space", 175826],
                            ["I'm so excited", 180280],
                            ["to see you excited", 181288],
                            ["", 184136],
                            ["", 185408],
                            ["", 188424],
                            ["", 190392],
                            ["", 192585],
                            ["", 196664],
                            ["", 200658],
                            ["", 204832],
                            ["", 206904]
                        ]
                    }
                    this.skyfall = {
                        audio: new Audio("https://cdn.discordapp.com/attachments/1170751373374148690/1177509237509865544/Adele_Adele_-_Skyfall.mp3"), // Replace with the actual URL of the "Skyfall" audio
                        chats: [
                            ["This is the end", 33000],
                            ["Hold your breath and count to 10", 38000],
                            ["Feel the Earth move and then", 44000],
                            ["Hear my heart burst again!", 50000],
                            ["For this is the end", 58000],
                            ["I've drowned and dreamt", 61200],
                            ["this moment", 63000],
                            ["So overdue, I owe them", 65400],
                            ["Swept away, I'm stolen", 69600],
                            ["Let the skyfall", 73800],
                            ["When it crumbles", 75600],
                            ["We will stand tall", 78000],
                            ["Face it all together", 80300],
                            ["Let the skyfall", 81720],
                            ["When it crumbles", 83400],//85200
                            ["We will stand tall", 85200],
                            ["Face it all together", 87600],
                            ["At skyfall", 89700],
                            ["At skyfall", 93300],
                            ["Skyfall is where we start", 121200],
                            ["thousand miles and poles apart", 124500],
                            ["Where worlds collide", 127900],
                            ["and days are dark", 129300],
                            ["You may have my number", 130200],
                            ["You can take my name", 132000],
                            ["But you'll never have my heart", 134100],
                            ["Let the skyfall", 136750],
                            ["When it crumbles", 138600],
                            ["We will stand tall", 140400],
                            ["Face it all together", 142320],
                            ["Let the skyfall", 144000],
                            ["When it crumbles", 146520],
                            ["We will stand tall", 148380],
                            ["Face it all together", 150120],
                            ["At skyfall", 151200],
                            //["At skyfall", 96000],
                            ["Where you go, I go", 191400],
                            ["What you see, I see", 192600],
                            ["I know I'd never be", 194400],
                            ["me without the security", 196800],
                            ["Of your loving arms", 198600],
                            ["Keeping me from harm", 201000],
                            ["Put your hand in my hand", 202800],
                            ["And we'll stand", 204600],
                            ["Let the skyfall", 206400],
                            ["When it crumbles", 208200],
                            ["We will stand tall", 210600],
                            ["Face it all together", 211800],
                            ["Let the skyfall", 214200],
                            ["When it crumbles", 240000],
                            ["We will stand tall", 241800],
                            ["Face it all together", 243900],
                            ["At skyfall", 245400],
                            ["let the skyfall", 246900],
                            ["we will stand tall", 250200],
                            ["At skyfall", 252300],
                            ["At skyfall", 252800],
                            ["Oooh", 253400]
                        ]
                    }
                    this.staywithme = {
                        audio: new Audio("https://cdn.discordapp.com/attachments/1013031910211063841/1029586481121071145/1nonly_-_Stay_With_Me_Lyrics.mp3"),
                        chats: [
                            [
                                "Stay with me",
                                1159
                            ],
                            [
                                "Stay with me",
                                20273
                            ],
                            [
                                "lil' bitch, yeah",
                                20907
                            ],
                            [
                                "you know that I'm your mans",
                                21691
                            ],
                            [
                                "You be cappin' like a snitch",
                                22668
                            ],
                            [
                                "no thots won't stand",
                                23857
                            ],
                            [
                                "Two hoes, ten toes",
                                25156
                            ],
                            [
                                "new guap, countin' bands",
                                26385
                            ],
                            [
                                "New whip, new chips",
                                27692
                            ],
                            [
                                "new kicks, Jackie Chan",
                                28888
                            ],
                            [
                                "And she bad",
                                30141
                            ],
                            [
                                "bad bitch throw it back",
                                31527
                            ],
                            [
                                "I just hit another lick and",
                                32798
                            ],
                            [
                                "she be counting all my racks",
                                33945
                            ],
                            [
                                "And I be feelin' hella rich",
                                35193
                            ],
                            [
                                "no Brian, hunnids stacked",
                                36503
                            ],
                            [
                                "'Bouta make another hit",
                                37857
                            ],
                            [
                                "goth bitch on my lap",
                                39117
                            ],
                            [
                                "Stay with me, lil' bitch, yeah",
                                40220
                            ],
                            [
                                "you know that I'm your mans",
                                41496
                            ],
                            [
                                "You be cappin' like a snitch",
                                42952
                            ],
                            [
                                "no thots won't stand",
                                44358
                            ],
                            [
                                "Two hoes, ten toes",
                                45378
                            ],
                            [
                                "new guap, countin' bands",
                                46633
                            ],
                            [
                                "New whip, new chips",
                                47962
                            ],
                            [
                                "new kicks, Jackie Chan",
                                49402
                            ],
                            [
                                "And she bad",
                                50500
                            ],
                            [
                                "bad bitch throw it back",
                                51768
                            ],
                            [
                                "I just hit another lick and",
                                52993
                            ],
                            [
                                "she be counting all my racks",
                                54091
                            ],
                            [
                                "And I be feelin' hella rich",
                                55483
                            ],
                            [
                                "no Brian, hunnids stacked",
                                56741
                            ],
                            [
                                "'Bouta make another hit",
                                58088
                            ],
                            [
                                "goth bitch on my lap",
                                59288
                            ],
                            [
                                "if she fucking with me",
                                60569
                            ],
                            [
                                "then you know I gotta get her",
                                61969
                            ],
                            [
                                "I be feelin' like Lil Uzi",
                                63413
                            ],
                            [
                                "got my mind up on the cheddar",
                                64329
                            ],
                            [
                                "Footloose getting groovy with",
                                65866
                            ],
                            [
                                "yo' ho, she like me better",
                                67130
                            ],
                            [
                                "I ain't talkin' Ash Kaashh",
                                68252
                            ],
                            [
                                "but that bitch",
                                69345
                            ],
                            [
                                "she be my header",
                                70322
                            ],
                            [
                                "Ayy, I'm posted up with twin",
                                71289
                            ],
                            [
                                "Glocks and foreign bitches",
                                72099
                            ],
                            [
                                "No fakes",
                                73271
                            ],
                            [
                                "all they want is guap",
                                73847
                            ],
                            [
                                "I burn bridges",
                                74978
                            ],
                            [
                                "I be getting to the bag",
                                75874
                            ],
                            [
                                "you still cleaning",
                                77061
                            ],
                            [
                                "dirty dishes",
                                77775
                            ],
                            [
                                "Two mops send shots at",
                                78331
                            ],
                            [
                                "your spot with no limit",
                                79634
                            ],
                            [
                                "Stay with me, lil' bitch, yeah",
                                80690
                            ],
                            [
                                "you know that I'm your mans",
                                82227
                            ],
                            [
                                "You be cappin' like a snitch",
                                83277
                            ],
                            [
                                "no thots won't stand",
                                84491
                            ],
                            [
                                "Two hoes, ten toes",
                                85727
                            ],
                            [
                                "new guap, countin' bands",
                                87152
                            ],
                            [
                                "New whip, new chips",
                                88356
                            ],
                            [
                                "new kicks, Jackie Chan",
                                89480
                            ],
                            [
                                "And she bad",
                                90797
                            ],
                            [
                                "bad bitch throw it back",
                                91851
                            ],
                            [
                                "I just hit another lick and",
                                93338
                            ],
                            [
                                "she be counting all my racks",
                                94752
                            ],
                            [
                                "And I be feelin' hella rich",
                                96045
                            ],
                            [
                                "no Brian, hunnids stacked",
                                97184
                            ],
                            [
                                "'Bouta make another hit",
                                98407
                            ],
                            [
                                "goth bitch on my lap",
                                99713
                            ],
                            [
                                "Stay with me, lil' bitch, yeah",
                                100910
                            ],
                            [
                                "you know that I'm your mans",
                                102385
                            ],
                            [
                                "You be cappin' like a snitch",
                                103510
                            ],
                            [
                                "no thots won't stand",
                                104783
                            ],
                            [
                                "Two hoes, ten toes",
                                105945
                            ],
                            [
                                "new guap, countin' bands",
                                107235
                            ],
                            [
                                "New whip, new chips",
                                108497
                            ],
                            [
                                "new kicks, Jackie Chan",
                                109744
                            ],
                            [
                                "And she bad",
                                110995
                            ],
                            [
                                "bad bitch throw it back",
                                112387
                            ],
                            [
                                "I just hit another lick and",
                                113531
                            ],
                            [
                                "she be counting all my racks",
                                114939
                            ],
                            [
                                "And I be feelin' hella rich",
                                116067
                            ],
                            [
                                "no Brian, hunnids stacked",
                                117268
                            ],
                            [
                                "'Bouta make another hit",
                                118726
                            ],
                            [
                                "goth bitch on my lap",
                                119972
                            ],
                            [
                                "Stay with me",
                                121136
                            ]
                        ]
                    }
                    this.legendsNeverDie = {
                        audio: new Audio("https://cdn.discordapp.com/attachments/990882830210981920/991648349608493066/Legends_Never_Die_Lyrics_Ft._Against_The_Current.mp3"),
                        chats: [
                            ["Legends Never Die", 12564], ["When the world is calling you", 16471], ["Can you hear them", 19616], ["screaming out your-", 20958], ["name?", 24132], ["Legends Never Die", 25823], ["They become a part of you", 29522], ["Every time you bleed", 33833], ["for reaching greatness", 36142], ["Relentless you survive", 40086], ["They never lose hope", 44050], ["when everything's cold", 45532], ["and the fighting's near", 46877], ["It's deep in their bones", 50361], ["they'll run into smoke", 52331], ["when the fire is fierce", 53631], ["Ohh pick yourself up cause,", 57260], ["Legends Never Die!", 60520], ["when the world is calling you", 64240], ["Can you hear them screaming", 67740], ["out your-", 69231], ["name?", 72521], ["Legends Never Die!", 74300], ["they become a part of you", 77900], ["Every time you bleed", 81620], ["for reaching", 83532], ["greatness", 85252], ["Legends Never Die", 87880], ["They're written", 91340], ["down in eternity", 92440], ["But you'll never see", 95140], ["the price it costs,", 97432], ["the scars collected", 100540], ["all their lives", 101720], ["When everything's lost", 105580], ["They pick up their hearts", 107440], ["and avenge defeat", 109320], ["Before it all starts,", 112680], ["they suffer through harm", 113980], ["just to touch a dream", 116020], ["Ohh pick yourself up cause,", 118840], ["Legends Never Die!", 122200], ["when the world is-", 126240], ["calling you", 127730], ["Can you hear them", 129760], ["screaming out your-", 131320], ["name?", 133320], ["Legends Never Die!", 135640], ["They become a part of you", 139500], ["Every time you bleed", 143180], ["for reaching-", 145320], ["greatness", 148100], ["Legends Never Die", 149440], ["When the world is", 156060], ["calling out", 157620], ["your name", 158900], ["Begging you to fight", 163320], ["Pick yourself up once more", 171160], ["Pick yourself up, cause", 174560], ["Legends Never Die!", 176860], ["when the world is", 180820], ["calling you", 181500], ["Can you hear them", 184400], ["screaming out your-", 186600], ["name?", 188300], ["Legends Never Die", 190780], ["They become a part of you", 194760], ["Every time you bleed", 197900], ["for reaching", 199300], ["greatness", 201500], ["Legends Never Die..", 204540]
                        ]
                    };
                    this.thetop = {
                        audio: new Audio("https://cdn.discordapp.com/attachments/919188611214229524/974478982051405934/Initial_D_5th_Stage_Soundtrack_-_The_Top.mp3"),
                        chats: [
                            [
                                "Final lap",
                                39607
                            ],
                            [
                                "I'm on top of the world",
                                40293
                            ],
                            [
                                "And I will never rest",
                                41845
                            ],
                            [
                                "for second again",
                                43192
                            ],
                            [
                                "One more time",
                                45303
                            ],
                            [
                                "I have beaten them out",
                                46438
                            ],
                            [
                                "The scent of gasoline",
                                47828
                            ],
                            [
                                "announces the end",
                                49351
                            ],
                            [
                                "They all said",
                                51320
                            ],
                            [
                                "I'd best give it up",
                                52316
                            ],
                            [
                                "What a fool",
                                53913
                            ],
                            [
                                "to believe their lies",
                                54752
                            ],
                            [
                                "Now they've fallen",
                                57207
                            ],
                            [
                                "and I'm at the top",
                                58373
                            ],
                            [
                                "Are you ready now to die?",
                                59879
                            ],
                            [
                                "I came up from the bottom",
                                62924
                            ],
                            [
                                "and into the top",
                                64572
                            ],
                            [
                                "For the first time",
                                65813
                            ],
                            [
                                "I feel alive",
                                66962
                            ],
                            [
                                "I can fly like an eagle",
                                68956
                            ],
                            [
                                "strike like a hawk",
                                70748
                            ],
                            [
                                "Do you think you can survive?",
                                71946
                            ],
                            [
                                "The top!",
                                74821
                            ],
                            [
                                "One more turn and",
                                87454
                            ],
                            [
                                "I'll settle the score",
                                88736
                            ],
                            [
                                "A rubber fire",
                                89794
                            ],
                            [
                                "screams into the night",
                                90734
                            ],
                            [
                                "Crash and burn is",
                                93127
                            ],
                            [
                                "what you're gonna do",
                                94471
                            ],
                            [
                                "I am a master of",
                                95752
                            ],
                            [
                                "the asphalt fight",
                                97250
                            ],
                            [
                                "They all said",
                                99128
                            ],
                            [
                                "I'd best give it up",
                                100438
                            ],
                            [
                                "What a fool",
                                101743
                            ],
                            [
                                "to believe their lies",
                                102673
                            ],
                            [
                                "Now they've fallen",
                                105251
                            ],
                            [
                                "and I'm at the top",
                                106445
                            ],
                            [
                                "Are you ready now to die?",
                                107891
                            ],
                            [
                                "I came up from the bottom",
                                110878
                            ],
                            [
                                "and into the top",
                                112544
                            ],
                            [
                                "For the first time",
                                113953
                            ],
                            [
                                "I feel alive",
                                114967
                            ],
                            [
                                "I can fly like an eagle",
                                116928
                            ],
                            [
                                "strike like a hawk",
                                118736
                            ],
                            [
                                "Do you think you can survive?",
                                119907
                            ],
                            [
                                "I came up from the bottom",
                                122969
                            ],
                            [
                                "and into the top",
                                124635
                            ],
                            [
                                "For the first time",
                                125972
                            ],
                            [
                                "I feel alive",
                                126979
                            ],
                            [
                                "I can fly like an eagle",
                                128989
                            ],
                            [
                                "strike like a hawk",
                                130755
                            ],
                            [
                                "Do you think you can survive?",
                                131906
                            ],
                            [
                                "The top!",
                                134941
                            ],
                            [
                                "I came up from the bottom",
                                171049
                            ],
                            [
                                "and into the top",
                                172624
                            ],
                            [
                                "For the first time",
                                173790
                            ],
                            [
                                "I feel alive",
                                174999
                            ],
                            [
                                "I can fly like an eagle",
                                176880
                            ],
                            [
                                "strike like a hawk",
                                178657
                            ],
                            [
                                "Do you think you can survive?",
                                179859
                            ],
                            [
                                "I came up from the bottom",
                                183009
                            ],
                            [
                                "and into the top",
                                184534
                            ],
                            [
                                "For the first time",
                                185837
                            ],
                            [
                                "I feel alive",
                                187606
                            ],
                            [
                                "I can fly like an eagle",
                                188853
                            ],
                            [
                                "strike like a hawk",
                                190569
                            ],
                            [
                                "Do you think you can survive?",
                                191750
                            ],
                            [
                                "The top!",
                                194704
                            ]
                        ]
                    };
                    this.gas = {
                        audio: new Audio("https://cdn.discordapp.com/attachments/876683706381762560/981927132202672228/e.mp3"),
                        chats: [
                            [
                                "Ahhh",
                                16885
                            ],
                            [
                                "(gas, gas gas)",
                                20000
                            ],
                            [
                                "Ahhh",
                                24039
                            ],
                            [
                                "Do you like my car",
                                28341
                            ],
                            [
                                "my car",
                                31349
                            ],
                            [
                                "m y   c a r",
                                33137
                            ],
                            [
                                "Guess you're ready'",
                                53875
                            ],
                            [
                                "Cause I'm waiting for you",
                                54746
                            ],
                            [
                                "It's gonna be so exciting!",
                                56201
                            ],
                            [
                                "Got this feeling",
                                59363
                            ],
                            [
                                "Really deep in my soul",
                                60638
                            ],
                            [
                                "Let's get out I wanna go",
                                62462
                            ],
                            [
                                "come along get it on!",
                                64003
                            ],
                            [
                                "Gonna take my car",
                                65865
                            ],
                            [
                                "gonna sit in",
                                67463
                            ],
                            [
                                "Gonna drive alone",
                                69113
                            ],
                            [
                                "'till I get you",
                                70348
                            ],
                            [
                                "'Cause I'm crazy",
                                71831
                            ],
                            [
                                "hot and ready",
                                72635
                            ],
                            [
                                "but you'll like it!",
                                73624
                            ],
                            [
                                "I wanna race for you",
                                74930
                            ],
                            [
                                "shall I go now?",
                                76885
                            ],
                            [
                                "Gas gas gas",
                                78234
                            ],
                            [
                                "I'm gonna step on the gas",
                                79868
                            ],
                            [
                                "Tonight I'll fly",
                                81582
                            ],
                            [
                                "and be your lover",
                                83111
                            ],
                            [
                                "Yeah yeah yeah",
                                84323
                            ],
                            [
                                "I'll be so quick as a flash",
                                86116
                            ],
                            [
                                "And I'll be your hero!",
                                87777
                            ],
                            [
                                "Gas gas gas",
                                90637
                            ],
                            [
                                "I'm gonna run as a flash",
                                92633
                            ],
                            [
                                "Tonight I'll fight",
                                94096
                            ],
                            [
                                "to be the winner",
                                95500
                            ],
                            [
                                "Yeah yeah yeah",
                                96824
                            ],
                            [
                                "I'm gonna step on the gas",
                                98592
                            ],
                            [
                                "And you'll see the big show!",
                                100155
                            ],
                            [
                                "Don't be lazy",
                                115451
                            ],
                            [
                                "'Cause I'm burning for you",
                                116581
                            ],
                            [
                                "It's like a hot sensation!",
                                118681
                            ],
                            [
                                "Got this power",
                                121655
                            ],
                            [
                                "That is taking me out",
                                122845
                            ],
                            [
                                "Yes I've got a crush on you",
                                124771
                            ],
                            [
                                "Ready now ready go!",
                                126452
                            ]
                        ]
                    }
                    this.dejavu = {
                        audio: new Audio("https://cdn.discordapp.com/attachments/919188611214229524/974636785101582366/DAVE_RODGERS___DEJA_VU_Official_Lyric_VideoD_INITIAL_D.mp3"),
                        chats: [
                            [
                                "See your body",
                                46729
                            ],
                            [
                                "into the moonlight",
                                48320
                            ],
                            [
                                "Even if I try to cancel",
                                49803
                            ],
                            [
                                "All the pictures into the mind",
                                52998
                            ],
                            [
                                "There's a flashing in my eyes",
                                55715
                            ],
                            [
                                "Don't you see my condition",
                                58299
                            ],
                            [
                                "The fiction",
                                61009
                            ],
                            [
                                "is gonna run it again",
                                62601
                            ],
                            [
                                "Can't you see now illusions",
                                64399
                            ],
                            [
                                "Right into your mind",
                                67186
                            ],
                            [
                                "Deja vu",
                                71102
                            ],
                            [
                                "I've just been",
                                72205
                            ],
                            [
                                "in this place before",
                                72846
                            ],
                            [
                                "Higher on the street",
                                74070
                            ],
                            [
                                "And I know it's my time to go",
                                75226
                            ],
                            [
                                "Calling you and",
                                77414
                            ],
                            [
                                "the search is a mystery",
                                78540
                            ],
                            [
                                "Standing on my feet",
                                80256
                            ],
                            [
                                "It's so hard when",
                                81402
                            ],
                            [
                                "I try to be me",
                                82361
                            ],
                            [
                                "UOOOHH",
                                83974
                            ],
                            [
                                "Deja vu",
                                85496
                            ],
                            [
                                "I've just been in",
                                86224
                            ],
                            [
                                "this time before",
                                86992
                            ],
                            [
                                "Higher on the street",
                                88087
                            ],
                            [
                                "And I know it's a place to go",
                                89232
                            ],
                            [
                                "Calling you and",
                                91432
                            ],
                            [
                                "the search is a mystery",
                                92534
                            ],
                            [
                                "Standing on my feet",
                                94184
                            ],
                            [
                                "It's so hard when",
                                95454
                            ],
                            [
                                "I try to be me",
                                96331
                            ],
                            [
                                "YEAHHH",
                                97862
                            ],
                            [
                                "See the future",
                                111909
                            ],
                            [
                                "into the present",
                                113614
                            ],
                            [
                                "See my past lives",
                                115335
                            ],
                            [
                                "in the distance",
                                116885
                            ],
                            [
                                "Try to guess now",
                                118423
                            ],
                            [
                                "what's going on",
                                120073
                            ],
                            [
                                "And the band begins to play",
                                121129
                            ],
                            [
                                "Don't you see my condition",
                                123653
                            ],
                            [
                                "The fiction",
                                126436
                            ],
                            [
                                "is gonna run it again",
                                128002
                            ],
                            [
                                "Can't you see now illusions",
                                129709
                            ],
                            [
                                "Right into your mind",
                                132703
                            ],
                            [
                                "Deja vu",
                                136269
                            ],
                            [
                                "I've just been",
                                137353
                            ],
                            [
                                "in this place before",
                                138199
                            ],
                            [
                                "Higher on the street",
                                139454
                            ],
                            [
                                "And I know",
                                140683
                            ],
                            [
                                "it's my time to go",
                                141457
                            ],
                            [
                                "Calling you",
                                142833
                            ],
                            [
                                "and the search is a mystery",
                                143741
                            ],
                            [
                                "Standing on my feet",
                                145424
                            ],
                            [
                                "It's so hard when",
                                146779
                            ],
                            [
                                "I try to be me",
                                147596
                            ],
                            [
                                "UOOOHH",
                                149231
                            ],
                            [
                                "Deja vu",
                                150890
                            ],
                            [
                                "I've just been in",
                                151580
                            ],
                            [
                                "this time before",
                                152301
                            ],
                            [
                                "Higher on the beat",
                                153484
                            ],
                            [
                                "And I know it's",
                                154656
                            ],
                            [
                                "a place to go",
                                155631
                            ],
                            [
                                "Calling you",
                                156815
                            ],
                            [
                                "and the search is a mystery",
                                158038
                            ],
                            [
                                "Standing on my feet",
                                159645
                            ],
                            [
                                "It's so hard when",
                                160557
                            ],
                            [
                                "I try to be me",
                                161571
                            ],
                            [
                                "YEAHHH",
                                163347
                            ]
                        ]
                    };
                    this.norival = {
                        audio: new Audio("https://cdn.discordapp.com/attachments/784941059066167316/977724487283912735/Nightcore_-_No_Rival_-_Lyrics.mp3"),
                        chats: [
                            [
                                "Here and now",
                                11198
                            ],
                            [
                                "you're coming up to me",
                                12140
                            ],
                            [
                                "'Fore I'm lighting up the sky",
                                13500
                            ],
                            [
                                "Feel the ground",
                                16583
                            ],
                            [
                                "shaking underneath",
                                17638
                            ],
                            [
                                "Trying to take me alive",
                                18855
                            ],
                            [
                                "Oh-oh-ohhh",
                                21720
                            ],
                            [
                                "Get ready for the fallout",
                                24012
                            ],
                            [
                                "Oh-oh-ohhh",
                                26981
                            ],
                            [
                                "Can't stop me now",
                                29312
                            ],
                            [
                                "I got no rival",
                                31419
                            ],
                            [
                                "I'ma find my way",
                                33196
                            ],
                            [
                                "Through the blood and pain",
                                35172
                            ],
                            [
                                "Game of survival",
                                36491
                            ],
                            [
                                "Any time or place",
                                38528
                            ],
                            [
                                "Watch 'em run away",
                                40492
                            ],
                            [
                                "I got no",
                                41945
                            ],
                            [
                                "I'll be standing on my own",
                                43651
                            ],
                            [
                                "Never gonna take my thrown",
                                45499
                            ],
                            [
                                "I got no rival",
                                47335
                            ],
                            [
                                "Watch 'em run away",
                                49108
                            ],
                            [
                                "I got no, no, no",
                                50943
                            ],
                            [
                                "I got no, no, no rival",
                                52146
                            ],
                            [
                                "No rival",
                                63910
                            ],
                            [
                                "No rival",
                                69272
                            ],
                            [
                                "Tell them now what you gon' do",
                                75032
                            ],
                            [
                                "We can do this face to face",
                                77157
                            ],
                            [
                                "Reckoning is coming in soon",
                                80284
                            ],
                            [
                                "Doesn't matter what you say",
                                82523
                            ],
                            [
                                "Trying to tell you",
                                85098
                            ],
                            [
                                "listen to the moment",
                                86269
                            ],
                            [
                                "Can't take mine",
                                87544
                            ],
                            [
                                "'cause I own it",
                                88213
                            ],
                            [
                                "Don't you know that",
                                90057
                            ],
                            [
                                "I'm locked and I'm loaded",
                                91775
                            ],
                            [
                                "You're out of focus",
                                93433
                            ],
                            [
                                "Oh-oh-ohhh",
                                96303
                            ],
                            [
                                "Get ready for the fallout",
                                98299
                            ],
                            [
                                "Oh-oh-ohhh",
                                101475
                            ],
                            [
                                "Can't stop me now",
                                103533
                            ],
                            [
                                "I got no rival",
                                105353
                            ],
                            [
                                "I'ma find my way",
                                107419
                            ],
                            [
                                "Through the blood and pain",
                                109215
                            ],
                            [
                                "Game of survival",
                                110747
                            ],
                            [
                                "Any time or place",
                                112730
                            ],
                            [
                                "Watch 'em run away",
                                114664
                            ],
                            [
                                "I got no",
                                116031
                            ],
                            [
                                "I'll be standing on my own",
                                117862
                            ],
                            [
                                "Never gonna take my thrown",
                                119722
                            ],
                            [
                                "I got no rival",
                                121376
                            ],
                            [
                                "Watch 'em run away",
                                123338
                            ],
                            [
                                "I got no, no, no",
                                125165
                            ],
                            [
                                "I got no, no, no rival",
                                126388
                            ],
                            [
                                "No rival",
                                132506
                            ],
                            [
                                "I got no, no, no",
                                136063
                            ],
                            [
                                "I got no, no, no rival",
                                137058
                            ],
                            [
                                "No rival",
                                143220
                            ],
                            [
                                "No rival",
                                159585
                            ]
                        ]
                    };
                    this.inv = {
                        audio: new Audio("https://cdn.discordapp.com/attachments/975954604451831828/980059990356279316/Crypt_x_Joey_Nato_-_Invincible_feat._soslesion_OFFICIAL_MUSIC_VIDEO.mp3"),
                        chats: [
                            [
                                "Yeah, yeah, yeah",
                                3890
                            ],
                            [
                                "Get myself into the game",
                                11624
                            ],
                            [
                                "I'ma run it up anyway",
                                13854
                            ],
                            [
                                "I get with the violence",
                                17898
                            ],
                            [
                                "I don't think you wanna try it",
                                19893
                            ],
                            [
                                "I'm so up",
                                22911
                            ],
                            [
                                "I feel invincible",
                                23678
                            ],
                            [
                                "I don't know",
                                26102
                            ],
                            [
                                "if they get it though",
                                26784
                            ],
                            [
                                "I'm so up",
                                28401
                            ],
                            [
                                "I feel invincible",
                                29073
                            ],
                            [
                                "Fuck what you said",
                                31587
                            ],
                            [
                                "I'm invincible",
                                32639
                            ],
                            [
                                "Lookin' for a break",
                                34483
                            ],
                            [
                                "and now I think",
                                35417
                            ],
                            [
                                "I finally caught one",
                                36239
                            ],
                            [
                                "We're talkin'",
                                37281
                            ],
                            [
                                "legendary status",
                                38092
                            ],
                            [
                                "when it's all done",
                                39193
                            ],
                            [
                                "I'm a star bitch",
                                40259
                            ],
                            [
                                "if you ever saw one",
                                41257
                            ],
                            [
                                "Law and Order over here",
                                43408
                            ],
                            [
                                "and it's a Tommy one",
                                44760
                            ],
                            [
                                "Meet me at the top",
                                45828
                            ],
                            [
                                "it's goin' down",
                                47841
                            ],
                            [
                                "They tryna fit in my circle",
                                48355
                            ],
                            [
                                "I'm not around (Nah)",
                                49618
                            ],
                            [
                                "I was down before",
                                50887
                            ],
                            [
                                "but not for the count",
                                52516
                            ],
                            [
                                "Shit was real heavy",
                                53741
                            ],
                            [
                                "now it's dollars",
                                55010
                            ],
                            [
                                "not the pound",
                                55590
                            ],
                            [
                                "Tell me what you smokin'",
                                56879
                            ],
                            [
                                "if you think that I'm a joke",
                                57801
                            ],
                            [
                                "Only time I'm trippin'",
                                59455
                            ],
                            [
                                "is when I'm out on a road",
                                60356
                            ],
                            [
                                "Only droppin' joints",
                                62286
                            ],
                            [
                                "if that is fuckin' dope",
                                63270
                            ],
                            [
                                "Scary when you see me",
                                65141
                            ],
                            [
                                "got them meming me like nope",
                                66211
                            ],
                            [
                                "(Nope, nope, nope, nope)",
                                67656
                            ],
                            [
                                "Hate to say it, but",
                                68886
                            ],
                            [
                                "you're runnin' out of time",
                                70326
                            ],
                            [
                                "I don't know 'bout you, but",
                                72052
                            ],
                            [
                                "I'ma make the most of mine",
                                72845
                            ],
                            [
                                "Lookin' clean until",
                                74738
                            ],
                            [
                                "a youngin' in the dirt",
                                75742
                            ],
                            [
                                "Value through the roof",
                                77076
                            ],
                            [
                                "yeah, yeah",
                                78516
                            ],
                            [
                                "I know my worth, Nato",
                                79436
                            ],
                            [
                                "Get myself into the game",
                                80575
                            ],
                            [
                                "I'ma run it up anyway",
                                82594
                            ],
                            [
                                "I get with the violence",
                                85923
                            ],
                            [
                                "I don't think you wanna try it",
                                88419
                            ],
                            [
                                "I'm so up",
                                91257
                            ],
                            [
                                "I feel invincible",
                                91995
                            ],
                            [
                                "I don't know if they get it though",
                                94660
                            ],
                            [
                                "I'm so up",
                                96966
                            ],
                            [
                                "I feel invincible",
                                97642
                            ],
                            [
                                "Fuck what you said",
                                99967
                            ],
                            [
                                "I'm invincible",
                                101046
                            ],
                            [
                                "If you wanna try",
                                103308
                            ],
                            [
                                "to bring me down",
                                103971
                            ],
                            [
                                "you gotta reach me",
                                104685
                            ],
                            [
                                "I'm high up in the clouds",
                                105864
                            ],
                            [
                                "while your're just",
                                107039
                            ],
                            [
                                "down in the seaweeds",
                                107608
                            ],
                            [
                                "I see these little rappers",
                                108622
                            ],
                            [
                                "they all wanna be me",
                                109897
                            ],
                            [
                                "But nobody wanna put the work in",
                                110826
                            ],
                            [
                                "'Cause they thinkin'",
                                112134
                            ],
                            [
                                "that I got it easy",
                                112752
                            ],
                            [
                                "but that's sleezy",
                                113502
                            ],
                            [
                                "My path to the top was hard",
                                114485
                            ],
                            [
                                "but nothin' out there",
                                115575
                            ],
                            [
                                "could me make stop",
                                116247
                            ],
                            [
                                "Every time I thought",
                                116981
                            ],
                            [
                                "it went one way",
                                117624
                            ],
                            [
                                "it turned out that it did not",
                                118407
                            ],
                            [
                                "I got so many",
                                119291
                            ],
                            [
                                "obstacles for my opps",
                                120297
                            ],
                            [
                                "so many prayin'",
                                121206
                            ],
                            [
                                "that I would drop",
                                122096
                            ],
                            [
                                "I had to go around",
                                122774
                            ],
                            [
                                "the whole world",
                                123521
                            ],
                            [
                                "just to get to",
                                124260
                            ],
                            [
                                "the end of my block",
                                124866
                            ],
                            [
                                "I built my skin so tough",
                                125523
                            ],
                            [
                                "achievin' all my desires",
                                126727
                            ],
                            [
                                "I could walk through",
                                128065
                            ],
                            [
                                "Hell without gettin'",
                                129449
                            ],
                            [
                                "burned by the fire",
                                130009
                            ],
                            [
                                "Oh, I admire those",
                                130697
                            ],
                            [
                                "that are deniers",
                                132867
                            ],
                            [
                                "'Cause you messed around",
                                134285
                            ],
                            [
                                "turned me to a",
                                135069
                            ],
                            [
                                "cold blooded fighter",
                                135885
                            ],
                            [
                                "Im so up I feel invincible",
                                137218
                            ],
                            [
                                "I hope my words",
                                140013
                            ],
                            [
                                "feel like insults",
                                141190
                            ],
                            [
                                "I'm up right now",
                                142979
                            ],
                            [
                                "you stuck right now",
                                144030
                            ],
                            [
                                "Stay down there",
                                145496
                            ],
                            [
                                "on that ground",
                                146574
                            ],
                            [
                                "Get myself into the game",
                                147924
                            ],
                            [
                                "I'ma run it up anyway",
                                151037
                            ],
                            [
                                "I get with the violence",
                                154527
                            ],
                            [
                                "I don't think you wanna try it",
                                156787
                            ],
                            [
                                "I'm so up",
                                160415
                            ],
                            [
                                "I feel invincible",
                                160990
                            ],
                            [
                                "I don't know",
                                163133
                            ],
                            [
                                "if they get it though",
                                163952
                            ],
                            [
                                "I'm so up",
                                165446
                            ],
                            [
                                "I feel invincible",
                                166148
                            ],
                            [
                                "Fuck what you said",
                                168516
                            ],
                            [
                                "I'm invincible",
                                169519
                            ],
                            [
                                "Talk like I'm at the top now",
                                171475
                            ],
                            [
                                "If you hit me, I can't fall down",
                                173836
                            ],
                            [
                                "Run up, I'm not second place and",
                                177162
                            ],
                            [
                                "I tell 'em that in runnin'",
                                178025
                            ],
                            [
                                "all my bases",
                                181206
                            ],
                            [
                                "I'm so up",
                                182808
                            ],
                            [
                                "I feel invincible",
                                183340
                            ],
                            [
                                "I don't know if",
                                186082
                            ],
                            [
                                "they get it though",
                                186813
                            ],
                            [
                                "I'm so up",
                                188342
                            ],
                            [
                                "I feel invincible",
                                189013
                            ],
                            [
                                "Fuck what you said",
                                192064
                            ],
                            [
                                "I'm invincible",
                                192606
                            ]
                        ]
                    };
                    this.giants = {
                        audio: new Audio("https://cdn.discordapp.com/attachments/617560371913293827/1023807988047294464/V_O_E_-_Giants_Lyrics.mp3"), chats: [["Oh, where am I going now", 10213], ["just falling over dreams?", 11952], ["Now I'm just so far gone", 15815], ["this isn't what it seems..", 17563], ["It's taking me so damn long", 21274], ["it's fading from believe", 23182], ["I need to slow this down", 26880], ["it's burning from beneath", 28361], ["Come break this light", 32622], ["Before tomorrow dies", 35938], ["Holding on for what", 38578], ["is worth my life", 40752], ["I know in time", 43714], ["I'll make it up the vine", 46797], ["Find my way to giants", 49458], ["in the sky", 51305], ["Tonight it comes to life", 53609], ["Tonight it comes to life", 75604], ["Where am I going now,", 98364], ["just falling over dreams?", 101623], ["Now I'm just so far gone,", 104059], ["this isn't what it seems", 106393], ["It's taking me so damn long,", 109598], ["it's fading from believe", 110995], ["I need to slow this down", 115074], ["it's burning from beneath", 117293], ["Come break this light", 121103], ["Before tomorrow dies", 124000], ["Holding on for what", 126824], ["is worth my lifе", 128132], ["I know in time", 132000], ["I'll make it up the vinе", 135098], ["Find my way to", 137797], ["giants in the sky", 139231], ["Tonight it comes to life", 141870], ["Tonight it comes to life", 152722], ["Come break this light", 176157], ["Before tomorrow dies", 179155], ["Holding on to what is", 181855], ["worth my life", 183000], ["I know in time", 187145], ["I'll make it up the vine", 190330], ["Find my way to", 193014], ["giants in the sky", 195132], ["Tonight it comes to life", 197183]]
                    };
                    this.glorydays = {
                        audio: new Audio("https://cdn.discordapp.com/attachments/990241234696167428/1023774910067261590/FELLOWSHIP_-_Glory_Days_Official_Lyric_Video_192_kbps.mp3"),
                        chats: [
                            [
                                "As the light within me falls",
                                47320
                            ],
                            [
                                "another day departs",
                                49338
                            ],
                            [
                                "if only I could see",
                                52172
                            ],
                            [
                                "the dawn beyond",
                                54166
                            ],
                            [
                                "the shadows cast",
                                55214
                            ],
                            [
                                "An empire of doubt",
                                57561
                            ],
                            [
                                "a heart full of clouds",
                                58671
                            ],
                            [
                                "befall the souls within her",
                                60113
                            ],
                            [
                                "the valley will weep",
                                62134
                            ],
                            [
                                "as a mirror of old",
                                63920
                            ],
                            [
                                "as hope is halfway damned",
                                65463
                            ],
                            [
                                "Oh, to see our last day",
                                68481
                            ],
                            [
                                "with all these",
                                70021
                            ],
                            [
                                "shattered voices raised",
                                71037
                            ],
                            [
                                "Oh say, will you fight?",
                                72920
                            ],
                            [
                                "To seek the glory days,",
                                77842
                            ],
                            [
                                "We'll fight the lion's way",
                                80642
                            ],
                            [
                                "Then let the rain",
                                83334
                            ],
                            [
                                "wash all of our pride away",
                                85272
                            ],
                            [
                                "So if this victory",
                                88786
                            ],
                            [
                                "is our last odyssey,",
                                91400
                            ],
                            [
                                "Then let the power",
                                94134
                            ],
                            [
                                "within us decide!",
                                96046
                            ],
                            [
                                "On the backs of giants",
                                117344
                            ],
                            [
                                "long deceased",
                                119252
                            ],
                            [
                                "are we still standing",
                                120096
                            ],
                            [
                                "we measure our worth",
                                122557
                            ],
                            [
                                "by all the days",
                                123929
                            ],
                            [
                                "we wasted then.",
                                125403
                            ],
                            [
                                "All of our time",
                                127753
                            ],
                            [
                                "and all of our might",
                                128916
                            ],
                            [
                                "are fueled by",
                                130086
                            ],
                            [
                                "the heartache of winter.",
                                131045
                            ],
                            [
                                "Oh life as we know",
                                132595
                            ],
                            [
                                "it is bitter and cold",
                                133924
                            ],
                            [
                                "but souls burn",
                                135278
                            ],
                            [
                                "best with spite.",
                                136334
                            ],
                            [
                                "Oh, to see our last day",
                                138568
                            ],
                            [
                                "with all these",
                                140287
                            ],
                            [
                                "shattered voices raised",
                                141002
                            ],
                            [
                                "Oh say, will you fight?",
                                142849
                            ],
                            [
                                "To seek the glory days,",
                                147919
                            ],
                            [
                                "We'll fight the lion's way",
                                150668
                            ],
                            [
                                "Then let the rain",
                                153331
                            ],
                            [
                                "wash all of our pride away",
                                155055
                            ],
                            [
                                "So if this victory",
                                158747
                            ],
                            [
                                "is our last odyssey,",
                                161502
                            ],
                            [
                                "Then let the power",
                                164244
                            ],
                            [
                                "within us decide!",
                                166385
                            ],
                            [
                                "If we have to choose our fate,",
                                170992
                            ],
                            [
                                "It's still our choice to make",
                                175794
                            ],
                            [
                                "Oh, to see our last day",
                                235540
                            ],
                            [
                                "with all these",
                                237420
                            ],
                            [
                                "shattered voices raised",
                                238154
                            ],
                            [
                                "Oh say, will you fight?",
                                239979
                            ],
                            [
                                "To seek the glory days,",
                                244971
                            ],
                            [
                                "We'll fight the lion's way",
                                247863
                            ],
                            [
                                "Then let the rain",
                                250476
                            ],
                            [
                                "wash all of our pride away",
                                252209
                            ],
                            [
                                "To seek the glory days,",
                                255934
                            ],
                            [
                                "We'll fight the lion's way",
                                258458
                            ],
                            [
                                "Then let the rain",
                                261368
                            ],
                            [
                                "wash all of our pride away",
                                263131
                            ],
                            [
                                "So if this victory",
                                266838
                            ],
                            [
                                "is our last odyssey,",
                                269354
                            ],
                            [
                                "Let the power within",
                                272733
                            ],
                            [
                                "ignite where we've been",
                                274332
                            ],
                            [
                                "let the power within us decide",
                                277877
                            ]
                        ]
                    }
                    this.ipip = {
                        audio: new Audio("https://cdn.discordapp.com/attachments/1008700151579295824/1023235261066399744/Electro-Light_-_Symbolism_NCS_Release.mp3"),
                        chats: [
                            [
                                "Turi, ip ip ip",
                                5416
                            ],
                            [
                                "Ip ip ip turi ik",
                                8978
                            ],
                            [
                                "Ip, tsha ip ik",
                                12132
                            ],
                            [
                                "Eugh turi",
                                13782
                            ],
                            [
                                "eugh turi isha ip turisha",
                                15109
                            ],
                            [
                                "Turi, ip ip ip",
                                17597
                            ],
                            [
                                "Ip ip ip turi ik",
                                20042
                            ],
                            [
                                "Ip, tsha ip ik",
                                23025
                            ],
                            [
                                "Eugh turi",
                                24480
                            ],
                            [
                                "eugh turi isha ip turisha",
                                26215
                            ],
                            [
                                "Turi, ip ip ip",
                                29205
                            ],
                            [
                                "Ip ip ip turi ik",
                                31504
                            ],
                            [
                                "Ip, tsha ip ik",
                                34192
                            ],
                            [
                                "Eugh turi",
                                36291
                            ],
                            [
                                "eugh turi isha ip turisha",
                                37558
                            ],
                            [
                                "Turi, ip ip ip",
                                40202
                            ],
                            [
                                "Ip ip ip turi ik",
                                42762
                            ],
                            [
                                "Ip, tsha ip ik",
                                45921
                            ],
                            [
                                "Eugh turi",
                                47710
                            ],
                            [
                                "eugh turi isha ip turisha",
                                48742
                            ],
                            [
                                "Turi, ip ip ip",
                                56435
                            ],
                            [
                                "Ip ip ip turi ik",
                                58173
                            ],
                            [
                                "Ip, tsha ip ik",
                                59676
                            ],
                            [
                                "Eugh turi",
                                60421
                            ],
                            [
                                "eugh turi isha ip turisha",
                                60952
                            ],
                            [
                                "Turi, ip ip ip",
                                62832
                            ],
                            [
                                "Ip ip ip turi ik",
                                65534
                            ],
                            [
                                "Ip, tsha ip ik",
                                68072
                            ],
                            [
                                "Eugh turi",
                                69931
                            ],
                            [
                                "eugh turi isha ip turisha",
                                71160
                            ],
                            [
                                "Turi, ip ip ip",
                                74119
                            ],
                            [
                                "Ip ip ip turi ik",
                                76666
                            ],
                            [
                                "Ip, tsha ip ik",
                                79454
                            ],
                            [
                                "Eugh turi",
                                81186
                            ],
                            [
                                "eugh turi isha ip turisha",
                                82433
                            ],
                            [
                                "Turi, ip ip ip",
                                85346
                            ],
                            [
                                "Ip ip ip turi ik",
                                87963
                            ],
                            [
                                "Ip, tsha ip ik",
                                90757
                            ],
                            [
                                "Eugh turi",
                                92776
                            ],
                            [
                                "eugh turi isha ip turisha",
                                93914
                            ],
                            [
                                "Thsa",
                                98686
                            ],
                            [
                                "Ip ip",
                                100534
                            ],
                            [
                                "Thsa",
                                109780
                            ],
                            [
                                "Ip ip",
                                116890
                            ],
                            [
                                "Turi, ip ip ip",
                                119438
                            ],
                            [
                                "Ip ip ip turi ik",
                                121839
                            ],
                            [
                                "Ip, tsha ip ik",
                                124701
                            ],
                            [
                                "Eugh turi",
                                126186
                            ],
                            [
                                "eugh turi isha ip turisha",
                                127726
                            ],
                            [
                                "Turi, ip ip ip",
                                130610
                            ],
                            [
                                "Ip ip ip turi ik",
                                133162
                            ],
                            [
                                "Ip, tsha ip ik",
                                136083
                            ],
                            [
                                "Eugh turi",
                                138451
                            ],
                            [
                                "eugh turi isha ip turisha",
                                139431
                            ],
                            [
                                "Turi, ip ip ip",
                                141718
                            ],
                            [
                                "Ip ip ip turi ik",
                                171766
                            ],
                            [
                                "Ip, tsha ip ik",
                                173608
                            ],
                            [
                                "Eugh turi",
                                174050
                            ],
                            [
                                "eugh turi isha ip turisha",
                                174714
                            ],
                            [
                                "Turi, ip ip ip",
                                175754
                            ],
                            [
                                "Ip ip ip turi ik",
                                178427
                            ],
                            [
                                "Ip, tsha ip ik",
                                180996
                            ],
                            [
                                "Eugh turi",
                                182437
                            ],
                            [
                                "eugh turi isha ip turisha",
                                184070
                            ],
                            [
                                "Turi, ip ip ip",
                                186868
                            ],
                            [
                                "Ip ip ip turi ik",
                                189609
                            ],
                            [
                                "Ip, tsha ip ik",
                                192300
                            ],
                            [
                                "Eugh turi",
                                193692
                            ],
                            [
                                "eugh turi isha ip turisha",
                                195611
                            ],
                            [
                                "Turi, ip ip ip",
                                198298
                            ],
                            [
                                "Ip ip ip turi ik",
                                201268
                            ],
                            [
                                "Ip, tsha ip ik",
                                203682
                            ],
                            [
                                "Eugh turi",
                                205139
                            ],
                            [
                                "eugh turi isha ip turisha",
                                206782
                            ],
                            [
                                "Thsa",
                                211680
                            ],
                            [
                                "Ip ip",
                                219763
                            ],
                            [
                                "Thsa",
                                222759
                            ],
                            [
                                "Ip ip",
                                229811
                            ],
                            [
                                "Turi, ip ip ip",
                                232450
                            ],
                            [
                                "Ip ip ip turi ik",
                                234711
                            ],
                            [
                                "Ip, tsha ip ik",
                                237682
                            ],
                            [
                                "Eugh turi",
                                238925
                            ],
                            [
                                "eugh turi isha ip turisha",
                                240651
                            ],
                            [
                                "Turi, ip ip ip",
                                243450
                            ],
                            [
                                "Ip ip ip turi ik",
                                246046
                            ],
                            [
                                "Ip, tsha ip ik",
                                248938
                            ],
                            [
                                "Eugh turi",
                                250268
                            ],
                            [
                                "eugh turi isha ip turisha",
                                251933
                            ]
                        ]

                    }
                    this.livinglife = {
                        audio: new Audio("https://cdn.discordapp.com/attachments/919188611214229524/981928418729934898/1_ac_2_6_22.mp3"),
                        chats: [
                            [
                                "Lord knows and I think",
                                15780
                            ],
                            [
                                "I know it too sometimes",
                                17285
                            ],
                            [
                                "Every time and",
                                18961
                            ],
                            [
                                "they reachin' out for",
                                20223
                            ],
                            [
                                "what's mine",
                                21570
                            ],
                            [
                                "Lord knows and I think",
                                22570
                            ],
                            [
                                "I know it too sometimes",
                                23781
                            ],
                            [
                                "Every time and",
                                25775
                            ],
                            [
                                "they reachin' out for",
                                26932
                            ],
                            [
                                "what's mine",
                                28198
                            ],
                            [
                                "I've been awake for days",
                                28955
                            ],
                            [
                                "So we out living life",
                                29943
                            ],
                            [
                                "in the night",
                                31597
                            ],
                            [
                                "Pray to god",
                                32598
                            ],
                            [
                                "man I hope I don't die",
                                33597
                            ],
                            [
                                "I've been awake for days",
                                35267
                            ],
                            [
                                "So we out living life",
                                36571
                            ],
                            [
                                "in the night",
                                38253
                            ],
                            [
                                "Pray to god",
                                39199
                            ],
                            [
                                "man I hope I don't die",
                                40032
                            ],
                            [
                                "in the night",
                                41702
                            ],
                            [
                                "Lord knows and I think",
                                42527
                            ],
                            [
                                "I know it too sometimes",
                                43935
                            ],
                            [
                                "Every time and",
                                45937
                            ],
                            [
                                "they reachin' out for",
                                47036
                            ],
                            [
                                "what's mine",
                                48436
                            ],
                            [
                                "Lord knows and I think",
                                49263
                            ],
                            [
                                "I know it too sometimes",
                                50589
                            ],
                            [
                                "Every time and",
                                52486
                            ],
                            [
                                "they reachin' out for",
                                53708
                            ],
                            [
                                "what's mine",
                                55117
                            ],
                            [
                                "Two bedrooms",
                                56000
                            ],
                            [
                                "seven little child",
                                57218
                            ],
                            [
                                "can't be right",
                                58532
                            ],
                            [
                                "Call my brother",
                                59452
                            ],
                            [
                                "he in prison doin' time",
                                60420
                            ],
                            [
                                "but we alright",
                                61855
                            ],
                            [
                                "Tried my best just to",
                                62799
                            ],
                            [
                                "catch a fucking smile",
                                64059
                            ],
                            [
                                "But for now",
                                65327
                            ],
                            [
                                "I see myself ain't",
                                66109
                            ],
                            [
                                "hitting the 35",
                                67119
                            ],
                            [
                                "I've been awake for days",
                                69074
                            ],
                            [
                                "So we out living life",
                                70173
                            ],
                            [
                                "in the night",
                                71817
                            ],
                            [
                                "Pray to god",
                                72875
                            ],
                            [
                                "man I hope I don't die",
                                74031
                            ],
                            [
                                "I've been awake for days",
                                75399
                            ],
                            [
                                "So we out living life",
                                76931
                            ],
                            [
                                "in the night",
                                78639
                            ],
                            [
                                "Pray to god",
                                79393
                            ],
                            [
                                "man I hope I don't die",
                                80235
                            ],
                            [
                                "in the night",
                                81927
                            ],
                            [
                                "Lord knows and I think",
                                82788
                            ],
                            [
                                "I know it too sometimes",
                                84179
                            ],
                            [
                                "Every time and",
                                86217
                            ],
                            [
                                "they reachin' out for",
                                87354
                            ],
                            [
                                "what's mine",
                                88685
                            ],
                            [
                                "Lord knows and I think",
                                89588
                            ],
                            [
                                "I know it too sometimes",
                                90890
                            ],
                            [
                                "Every time and",
                                92840
                            ],
                            [
                                "they reachin' out",
                                93997
                            ],
                            [
                                "for what's mine",
                                95011
                            ]
                        ]
                    };
                    this.takeover = {
                        audio: new Audio("https://cdn.discordapp.com/attachments/1174992357767262238/1176217713727770785/01._Take_Over.mp3"),
                        chats: [
                            [
                                "We at the top again, now what?",
                                16900
                            ],
                            [
                                "Heavy lay the crown, but",
                                18900
                            ],
                            [
                                "Count us",
                                20600
                            ],
                            [
                                "Higher than the mountain",
                                21380
                            ],
                            [
                                "And we be up here",
                                23300
                            ],
                            [
                                "for the long run",
                                24273
                            ],
                            [
                                "Strap in for a long one",
                                25413
                            ],
                            [
                                "We got everybody on one",
                                27400
                            ],
                            [
                                "Now you're coming at the king",
                                29740
                            ],
                            [
                                "so you better not miss",
                                30934
                            ],
                            [
                                "And we only get stronger",
                                33700
                            ],
                            [
                                "With everything I",
                                36163
                            ],
                            [
                                "carry up on my back",
                                37292
                            ],
                            [
                                "you should paint it",
                                39360
                            ],
                            [
                                "up with a target",
                                40771
                            ],
                            [
                                "Why would you dare me",
                                46000
                            ],
                            [
                                "to do it again?",
                                46960
                            ],
                            [
                                "Come get your spoiler",
                                50800
                            ],
                            [
                                "up ahead",
                                51977
                            ],
                            [
                                "We're taking over,",
                                53800
                            ],
                            [
                                "We're Taking Over",
                                56832
                            ],
                            [
                                "Look at you come at my name,",
                                61760
                            ],
                            [
                                "you 'oughta know by now,",
                                62866
                            ],
                            [
                                "That We're Taking Over,",
                                66300
                            ],
                            [
                                "We're Taking Over",
                                69411
                            ],
                            [
                                "Maybe you wonder what",
                                74500
                            ],
                            [
                                "your futures gonna be but",
                                76300
                            ],
                            [
                                "I got it all locked up",
                                77780
                            ],
                            [
                                "Take a lap, now",
                                93800
                            ],
                            [
                                "Don't be mad, now",
                                94933
                            ],
                            [
                                "Run it back, run it back",
                                97000
                            ],
                            [
                                "run it back, now",
                                98777
                            ],
                            [
                                "I got bodies lining up,",
                                100100
                            ],
                            [
                                "Think you're dreaming",
                                101400
                            ],
                            [
                                "of greatness",
                                102663
                            ],
                            [
                                "",

                            ],
                            [
                                "",

                            ],
                            [
                                "",

                            ],
                            [
                                "",

                            ],
                            [
                                "",

                            ],
                            [
                                "",

                            ],
                            [
                                "",

                            ],
                            [
                                "",

                            ],
                            [
                                "",

                            ],
                            [
                                "",

                            ],
                            [
                                "",

                            ],
                            [
                                "",

                            ],
                        ]
                    }
                    this.outtamind = {
                        audio: new Audio("https://cdn.discordapp.com/attachments/919188611214229524/981933473709309982/GENTRAMMEL_-_Out_Of_My_Mind__Lyrics_.mp3"),
                        chats: [
                            [
                                "Remember the night that we met",
                                12576
                            ],
                            [
                                "Back at the party",
                                13709
                            ],
                            [
                                "you sat on the bed",
                                14448
                            ],
                            [
                                "You said I’m talented",
                                15380
                            ],
                            [
                                "you said I’m next",
                                16065
                            ],
                            [
                                "My only talent",
                                16922
                            ],
                            [
                                "is making you stressed",
                                17695
                            ],
                            [
                                "I know that I’m not in my best",
                                18510
                            ],
                            [
                                "lately I’m feeling like less",
                                20254
                            ],
                            [
                                "I hope that I’ll see you again",
                                21815
                            ],
                            [
                                "if I don’t than",
                                23230
                            ],
                            [
                                "I’ll lay at the rest",
                                23823
                            ],
                            [
                                "It’s crazy how it goes",
                                24705
                            ],
                            [
                                "left me all alone",
                                26020
                            ],
                            [
                                "I’ve been trying to move on",
                                28056
                            ],
                            [
                                "all I find are holes",
                                29465
                            ],
                            [
                                "Searching for a pot of gold",
                                31159
                            ],
                            [
                                "don’t know if I’ll ever know",
                                32572
                            ],
                            [
                                "How she left",
                                34156
                            ],
                            [
                                "me with no damn place to go",
                                34881
                            ],
                            [
                                "I’m okay, I’ll be fine",
                                37685
                            ],
                            [
                                "I’m just out of my mind",
                                40619
                            ],
                            [
                                "long nights, with no sleep",
                                43802
                            ],
                            [
                                "thinking bout you and me",
                                46646
                            ],
                            [
                                "I’m okay, I’ll be fine",
                                49703
                            ],
                            [
                                "I’m just out of my mind",
                                52687
                            ],
                            [
                                "Long nights, with no sleep",
                                56105
                            ],
                            [
                                "thinking bout you and me",
                                59131
                            ],
                            [
                                "Spent five months",
                                61884
                            ],
                            [
                                "at your crib",
                                62780
                            ],
                            [
                                "and I ain’t pay no rent",
                                63749
                            ],
                            [
                                "We should’ve just been friends",
                                64595
                            ],
                            [
                                "Cause I know you never meant",
                                66714
                            ],
                            [
                                "all the things that",
                                67975
                            ],
                            [
                                "you said to me",
                                70217
                            ],
                            [
                                "Froze my heart in uncertainty",
                                70849
                            ],
                            [
                                "Go and hit the club in some",
                                74061
                            ],
                            [
                                "make sure that you drunk af",
                                75561
                            ],
                            [
                                "Find another man you love",
                                77207
                            ],
                            [
                                "imma show you what you lost",
                                78681
                            ],
                            [
                                "I'mma show you how it feels",
                                80210
                            ],
                            [
                                "to realize everything",
                                81740
                            ],
                            [
                                "you ever knew",
                                82722
                            ],
                            [
                                "And everything you ever",
                                83692
                            ],
                            [
                                "had in love is gone",
                                84701
                            ],
                            [
                                "I’m okay, I’ll be fine",
                                86645
                            ],
                            [
                                "I’m just out of my mind",
                                88575
                            ],
                            [
                                "long nights, with no sleep",
                                93073
                            ],
                            [
                                "thinking bout you and me",
                                95794
                            ],
                            [
                                "I’m okay, I’ll be fine",
                                98841
                            ],
                            [
                                "I’m just out of my mind",
                                102063
                            ],
                            [
                                "Long nights, with no sleep",
                                105218
                            ],
                            [
                                "thinking bout you and me",
                                107967
                            ],
                            [
                                "I guess it’s here for real",
                                110894
                            ],
                            [
                                "and If I had another chance",
                                112311
                            ],
                            [
                                "I don’t know if I’d take",
                                113554
                            ],
                            [
                                "that bet against you",
                                114744
                            ],
                            [
                                "with another man",
                                115679
                            ],
                            [
                                "And if I ever saw your face",
                                116870
                            ],
                            [
                                "than I would probably",
                                118157
                            ],
                            [
                                "take a glance",
                                119295
                            ],
                            [
                                "But I would never bat at night",
                                119966
                            ],
                            [
                                "because you hate me",
                                121188
                            ],
                            [
                                "that’s a fact",
                                122158
                            ],
                            [
                                "I think that this is an epiphany",
                                123173
                            ],
                            [
                                "I don’t think that",
                                124724
                            ],
                            [
                                "you really listening",
                                125704
                            ],
                            [
                                "One day you gonna",
                                126388
                            ],
                            [
                                "be missing me",
                                127116
                            ],
                            [
                                "I swear to God",
                                127850
                            ],
                            [
                                "that we’ll never be frenemies",
                                128440
                            ],
                            [
                                "Female dogs be tryna",
                                129331
                            ],
                            [
                                "to be friends with me",
                                130191
                            ],
                            [
                                "I think they stealing my energy",
                                130907
                            ],
                            [
                                "in my DMs and they tempting me",
                                131654
                            ],
                            [
                                "I know that you really",
                                133839
                            ],
                            [
                                "resenting me now",
                                134709
                            ],
                            [
                                "I’m okay, I’ll be fine",
                                135602
                            ],
                            [
                                "I’m just out of my mind",
                                139010
                            ],
                            [
                                "long nights, with no sleep",
                                142174
                            ],
                            [
                                "thinking bout you and me",
                                144896
                            ],
                            [
                                "I’m okay, I’ll be fine",
                                148125
                            ],
                            [
                                "I’m just out of my mind",
                                151030
                            ],
                            [
                                "Long nights, with no sleep",
                                154548
                            ],
                            [
                                "thinking bout you and me",
                                157313
                            ]
                        ]
                    }
                    this.nobody = {
                        audio: new Audio("https://cdn.discordapp.com/attachments/911557181353111595/1002036095938207815/Zack_Merci_X_CRVN_-_Nobody_NCS_Release.mp3"),
                        chats: [
                            [
                                "Children used to run and play",
                                16047
                            ],
                            [
                                "Look at all the mess we made",
                                18834
                            ],
                            [
                                "Guess I'll never know",
                                21972
                            ],
                            [
                                "where it went wrong",
                                23116
                            ],
                            [
                                "Sometimes I feel like",
                                27962
                            ],
                            [
                                "\"oh, that's sad\"",
                                28732
                            ],
                            [
                                "Goes viral then people forget",
                                30767
                            ],
                            [
                                "In this crazy world",
                                33943
                            ],
                            [
                                "I don't belong",
                                35045
                            ],
                            [
                                "I see fire burning",
                                39164
                            ],
                            [
                                "but I close my eyes",
                                41249
                            ],
                            [
                                "(I'd rather deny that)",
                                43809
                            ],
                            [
                                "Everything is falling",
                                45250
                            ],
                            [
                                "out of place",
                                47215
                            ],
                            [
                                "I see trees ripped",
                                50541
                            ],
                            [
                                "from the ground",
                                52212
                            ],
                            [
                                "But nobody makes a sound",
                                54210
                            ],
                            [
                                "I see fire burning",
                                57003
                            ],
                            [
                                "but I'm fine",
                                59240
                            ],
                            [
                                "And I am nobody",
                                61475
                            ],
                            [
                                "And I am Nobody",
                                73778
                            ],
                            [
                                "The future feels so",
                                99856
                            ],
                            [
                                "unsure we deserve more",
                                100949
                            ],
                            [
                                "The burden that you left",
                                106005
                            ],
                            [
                                "is way too heavy for me",
                                107306
                            ],
                            [
                                "Do you ever feel like",
                                111727
                            ],
                            [
                                "the world would die out",
                                113251
                            ],
                            [
                                "My anxiety is of",
                                114946
                            ],
                            [
                                "the roof I cry out",
                                116239
                            ],
                            [
                                "We have gone too far",
                                117923
                            ],
                            [
                                "take me back right now",
                                118984
                            ],
                            [
                                "I see fire burning",
                                124198
                            ],
                            [
                                "but I close my eyes",
                                125314
                            ],
                            [
                                "(I'd rather deny that)",
                                127683
                            ],
                            [
                                "Everything is falling",
                                129231
                            ],
                            [
                                "out of place",
                                131229
                            ],
                            [
                                "I see trees ripped",
                                134546
                            ],
                            [
                                "from the ground",
                                136762
                            ],
                            [
                                "But nobody makes a sound",
                                138246
                            ],
                            [
                                "I see fire burning",
                                140946
                            ],
                            [
                                "but I'm fine",
                                142957
                            ],
                            [
                                "And I am nobody",
                                145167
                            ],
                            [
                                "And I am nobody",
                                170418
                            ]
                        ]
                    }
                    this.outerspace = {
                        audio: new Audio("https://cdn.discordapp.com/attachments/919188611214229524/981935267155951646/BEAUZ_-_Outerspace_Lyrics_feat._Dallas.mp3"),
                        chats: [
                            [
                                "Falling in quickly",
                                2267
                            ],
                            [
                                "Tell me you feel something too",
                                6056
                            ],
                            [
                                "Caught in the moment",
                                9720
                            ],
                            [
                                "I'm lost here without you",
                                12072
                            ],
                            [
                                "Tangled up in your web",
                                15565
                            ],
                            [
                                "Holding on to",
                                18885
                            ],
                            [
                                "every word you said",
                                20299
                            ],
                            [
                                "I'm ready I know",
                                22258
                            ],
                            [
                                "I'm hoping it shows",
                                23880
                            ],
                            [
                                "Would you say the same?",
                                25613
                            ],
                            [
                                "We're falling",
                                27374
                            ],
                            [
                                "from the outer space",
                                28129
                            ],
                            [
                                "We're moving like a",
                                29969
                            ],
                            [
                                "full pace supernova",
                                30695
                            ],
                            [
                                "We're making all the",
                                33892
                            ],
                            [
                                "headlines now",
                                35003
                            ],
                            [
                                "And I just wanna",
                                36829
                            ],
                            [
                                "seize the moment",
                                38230
                            ],
                            [
                                "'Cause we won't",
                                40572
                            ],
                            [
                                "ever slow it down",
                                41372
                            ],
                            [
                                "Kissin' in the rain",
                                42947
                            ],
                            [
                                "Taste just like champagne",
                                44601
                            ],
                            [
                                "Ballin' everyday",
                                46401
                            ],
                            [
                                "We're falling from outer space",
                                47649
                            ],
                            [
                                "Hopin' time won't change",
                                49656
                            ],
                            [
                                "Got love on my brain",
                                51442
                            ],
                            [
                                "Would you say the same",
                                53257
                            ],
                            [
                                "We're falling from outer space",
                                54647
                            ],
                            [
                                "We're falling from outer space",
                                60982
                            ],
                            [
                                "We're falling from outer space",
                                67811
                            ],
                            [
                                "We're falling from outer space",
                                74600
                            ],
                            [
                                "We're falling from outer space",
                                81321
                            ],
                            [
                                "Falling in quickly",
                                86325
                            ],
                            [
                                "Tell me you feel something too",
                                90323
                            ],
                            [
                                "Caught in the moment",
                                94055
                            ],
                            [
                                "I'm lost here without you",
                                96170
                            ],
                            [
                                "Tangled up in your web",
                                99442
                            ],
                            [
                                "Holding on to",
                                103220
                            ],
                            [
                                "every word you said",
                                104814
                            ],
                            [
                                "I'm ready I know",
                                106585
                            ],
                            [
                                "I'm hoping it shows",
                                108178
                            ],
                            [
                                "Would you say the same?",
                                110052
                            ],
                            [
                                "We're falling from the outer space",
                                111856
                            ],
                            [
                                "We're moving like a",
                                114382
                            ],
                            [
                                "full pace supernova",
                                115087
                            ],
                            [
                                "We're making all the",
                                118063
                            ],
                            [
                                "headlines now",
                                119323
                            ],
                            [
                                "And I just wanna",
                                121048
                            ],
                            [
                                "seize the moment",
                                122684
                            ],
                            [
                                "'Cause we won't",
                                125220
                            ],
                            [
                                "ever slow it down",
                                125899
                            ],
                            [
                                "Kissin' in the rain",
                                127459
                            ],
                            [
                                "Taste just like champagne",
                                129015
                            ],
                            [
                                "Ballin' everyday",
                                130840
                            ],
                            [
                                "We're falling from outer space",
                                131919
                            ],
                            [
                                "Hopin' time won't change",
                                134393
                            ],
                            [
                                "Got love on my brain",
                                135921
                            ],
                            [
                                "Would you say the same?",
                                137671
                            ],
                            [
                                "We're falling from outer space (go)",
                                138737
                            ],
                            [
                                "We're falling from outer space",
                                147417
                            ],
                            [
                                "We're falling from outer space",
                                153800
                            ],
                            [
                                "We're falling from outer space",
                                160563
                            ],
                            [
                                "We're falling from outer space",
                                167204
                            ]
                        ]
                    }
                    this.playing = false;
                    this.doing = false;
                    this.current = null;
                    this.loadAudio = function (e) {
                        e.audio.load();
                    }
                    let scope = this;
                    Object.getOwnPropertyNames(this).filter(e => !["playing", "doing", "current", "loadAudio"].includes(e)).forEach(property => {
                        scope.loadAudio(this[property]);
                    });
                }
            };
            class Items {
                constructor() {
                    // ITEM GROUPS:
                    this.groups = [{
                        id: 0,
                        name: "food",
                        layer: 0
                    }, {
                        id: 1,
                        name: "walls",
                        place: true,
                        limit: 30,
                        layer: 0
                    }, {
                        id: 2,
                        name: "spikes",
                        place: true,
                        limit: 15,
                        layer: 0
                    }, {
                        id: 3,
                        name: "mill",
                        place: true,
                        limit: 7,
                        layer: 1
                    }, {
                        id: 4,
                        name: "mine",
                        place: true,
                        limit: 1,
                        layer: 0
                    }, {
                        id: 5,
                        name: "trap",
                        place: true,
                        limit: 6,
                        layer: -1
                    }, {
                        id: 6,
                        name: "booster",
                        place: true,
                        limit: 12,
                        layer: -1
                    }, {
                        id: 7,
                        name: "turret",
                        place: true,
                        limit: 2,
                        layer: 1
                    }, {
                        id: 8,
                        name: "watchtower",
                        place: true,
                        limit: 12,
                        layer: 1
                    }, {
                        id: 9,
                        name: "buff",
                        place: true,
                        limit: 4,
                        layer: -1
                    }, {
                        id: 10,
                        name: "spawn",
                        place: true,
                        limit: 1,
                        layer: -1
                    }, {
                        id: 11,
                        name: "sapling",
                        place: true,
                        limit: 2,
                        layer: 0
                    }, {
                        id: 12,
                        name: "blocker",
                        place: true,
                        limit: 3,
                        layer: -1
                    }, {
                        id: 13,
                        name: "teleporter",
                        place: true,
                        limit: 2,
                        layer: -1
                    }];

                    // PROJECTILES:
                    this.projectiles = [{
                        indx: 0,
                        layer: 0,
                        src: "arrow_1",
                        dmg: 25,
                        speed: 1.6,
                        scale: 103,
                        range: 1000
                    }, {
                        indx: 1,
                        layer: 1,
                        dmg: 25,
                        scale: 20
                    }, {
                        indx: 0,
                        layer: 0,
                        src: "arrow_1",
                        dmg: 35,
                        speed: 2.5,
                        scale: 103,
                        range: 1200
                    }, {
                        indx: 0,
                        layer: 0,
                        src: "arrow_1",
                        dmg: 30,
                        speed: 2,
                        scale: 103,
                        range: 1200
                    }, {
                        indx: 1,
                        layer: 1,
                        dmg: 16,
                        scale: 20
                    }, {
                        indx: 0,
                        layer: 0,
                        src: "bullet_1",
                        dmg: 50,
                        speed: 3.6,
                        scale: 160,
                        range: 1400
                    }];

                    // WEAPONS:
                    this.weapons = [{
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
                        speed: 300
                    }, {
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
                        speed: 400
                    }, {
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
                        speed: 400
                    }, {
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
                        speed: 300
                    }, {
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
                        speed: 300
                    }, {
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
                        speed: 700
                    }, {
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
                        speed: 300
                    }, {
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
                        speed: 100
                    }, {
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
                        speed: 400
                    }, {
                        id: 9,
                        type: 1,
                        age: 6,
                        name: "hunting bow",
                        desc: "bow used for ranged combat and hunting",
                        src: "bow_1",
                        req: ["wood", 4],
                        length: 120,
                        width: 120,
                        xOff: -6,
                        yOff: 0,
                        Pdmg: 25,
                        projectile: 0,
                        spdMult: 0.75,
                        speed: 600
                    }, {
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
                        Pdmg: 10,
                        spdMult: 0.88,
                        range: 75,
                        sDmg: 7.5,
                        gather: 1,
                        speed: 400
                    }, {
                        id: 11,
                        type: 1,
                        age: 6,
                        name: "wooden shield",
                        desc: "blocks projectiles and reduces melee damage",
                        src: "shield_1",
                        length: 120,
                        width: 120,
                        shield: 0.2,
                        xOff: 6,
                        yOff: 0,
                        Pdmg: 0,
                        spdMult: 0.7
                    }, {
                        id: 12,
                        type: 1,
                        age: 8,
                        pre: 9,
                        name: "crossbow",
                        desc: "deals more damage and has greater range",
                        src: "crossbow_1",
                        req: ["wood", 5],
                        aboveHand: true,
                        armS: 0.75,
                        length: 120,
                        width: 120,
                        xOff: -4,
                        yOff: 0,
                        Pdmg: 35,
                        projectile: 2,
                        spdMult: 0.7,
                        speed: 700
                    }, {
                        id: 13,
                        type: 1,
                        age: 9,
                        pre: 12,
                        name: "repeater crossbow",
                        desc: "high firerate crossbow with reduced damage",
                        src: "crossbow_2",
                        req: ["wood", 10],
                        aboveHand: true,
                        armS: 0.75,
                        length: 120,
                        width: 120,
                        xOff: -4,
                        yOff: 0,
                        Pdmg: 30,
                        projectile: 3,
                        spdMult: 0.7,
                        speed: 230
                    }, {
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
                        Pdmg: 0,
                        steal: 250,
                        knock: 0.2,
                        spdMult: 1.05,
                        range: 125,
                        gather: 0,
                        speed: 700
                    }, {
                        id: 15,
                        type: 1,
                        age: 9,
                        pre: 12,
                        name: "musket",
                        desc: "slow firerate but high damage and range",
                        src: "musket_1",
                        req: ["stone", 10],
                        aboveHand: true,
                        rec: 0.35,
                        armS: 0.6,
                        hndS: 0.3,
                        hndD: 1.6,
                        length: 205,
                        width: 205,
                        xOff: 25,
                        yOff: 0,
                        Pdmg: 50,
                        projectile: 5,
                        hideProjectile: true,
                        spdMult: 0.6,
                        speed: 1500
                    }];

                    // ITEMS:
                    this.list = [{
                        group: this.groups[0],
                        name: "apple",
                        desc: "restores 20 health when consumed",
                        req: ["food", 10],
                        consume: function(doer) {
                            return doer.changeHealth(20, doer);
                        },
                        scale: 22,
                        holdOffset: 15,
                        healing: 20,
                        itemID: 0,
                        itemAID: 16,
                    }, {
                        age: 3,
                        group: this.groups[0],
                        name: "cookie",
                        desc: "restores 40 health when consumed",
                        req: ["food", 15],
                        consume: function(doer) {
                            return doer.changeHealth(40, doer);
                        },
                        scale: 27,
                        holdOffset: 15,
                        healing: 40,
                        itemID: 1,
                        itemAID: 17,
                    }, {
                        age: 7,
                        group: this.groups[0],
                        name: "cheese",
                        desc: "restores 30 health and another 50 over 5 seconds",
                        req: ["food", 25],
                        consume: function(doer) {
                            if (doer.changeHealth(30, doer) || doer.health < 100) {
                                doer.dmgOverTime.dmg = -10;
                                doer.dmgOverTime.doer = doer;
                                doer.dmgOverTime.time = 5;
                                return true;
                            }
                            return false;
                        },
                        scale: 27,
                        holdOffset: 15,
                        healing: 30,
                        itemID: 2,
                        itemAID: 18,
                    }, {
                        group: this.groups[1],
                        name: "wood wall",
                        desc: "provides protection for your village",
                        req: ["wood", 10],
                        projDmg: true,
                        health: 380,
                        scale: 50,
                        holdOffset: 20,
                        placeOffset: -5,
                        itemID: 3,
                        itemAID: 19,
                    }, {
                        age: 3,
                        group: this.groups[1],
                        name: "stone wall",
                        desc: "provides improved protection for your village",
                        req: ["stone", 25],
                        health: 900,
                        scale: 50,
                        holdOffset: 20,
                        placeOffset: -5,
                        itemID: 4,
                        itemAID: 20,
                    }, {
                        age: 7,
                        group: this.groups[1],
                        name: "castle wall",
                        desc: "provides powerful protection for your village",
                        req: ["stone", 35],
                        health: 1500,
                        scale: 52,
                        holdOffset: 20,
                        placeOffset: -5,
                        itemID: 5,
                        itemAID: 21,
                    }, {
                        group: this.groups[2],
                        name: "spikes",
                        desc: "damages enemies when they touch them",
                        req: ["wood", 20, "stone", 5],
                        health: 400,
                        dmg: 20,
                        scale: 49,
                        spritePadding: -23,
                        holdOffset: 8,
                        placeOffset: -5,
                        itemID: 6,
                        itemAID: 22,
                        shadow: {
                            offsetX: 5, // Adjust the shadow's X offset as needed
                            offsetY: 5, // Adjust the shadow's Y offset as needed
                            blur: 20,  // Adjust the shadow's blur as needed
                            color: "rgba(0, 0, 0, 0.5)" // Adjust the shadow's color and transparency as needed
                        }

                    }, {
                        age: 5,
                        group: this.groups[2],
                        name: "greater spikes",
                        desc: "damages enemies when they touch them",
                        req: ["wood", 30, "stone", 10],
                        health: 500,
                        dmg: 35,
                        scale: 52,
                        spritePadding: -23,
                        holdOffset: 8,
                        placeOffset: -5,
                        itemID: 7,
                        itemAID: 23,
                    }, {
                        age: 9,
                        group: this.groups[2],
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
                        itemID: 8,
                        itemAID: 24,
                    }, {
                        age: 9,
                        group: this.groups[2],
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
                        itemID: 9,
                        itemAID: 25,
                    }, {
                        group: this.groups[3],
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
                        itemID: 10,
                        itemAID: 26,
                    }, {
                        age: 5,
                        group: this.groups[3],
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
                        itemID: 11,
                        itemAID: 27,
                    }, {
                        age: 8,
                        group: this.groups[3],
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
                        itemID: 12,
                        itemAID: 28,
                    }, {
                        age: 5,
                        group: this.groups[4],
                        type: 2,
                        name: "mine",
                        desc: "allows you to mine stone",
                        req: ["wood", 20, "stone", 100],
                        iconLineMult: 12,
                        scale: 65,
                        holdOffset: 20,
                        placeOffset: 0,
                        itemID: 13,
                        itemAID: 29,
                    }, {
                        age: 5,
                        group: this.groups[11],
                        type: 0,
                        name: "sapling",
                        desc: "allows you to farm wood",
                        req: ["wood", 150],
                        iconLineMult: 12,
                        colDiv: 0.5,
                        scale: 110,
                        holdOffset: 50,
                        placeOffset: -15,
                        itemID: 14,
                        itemAID: 30,
                    }, {
                        age: 4,
                        group: this.groups[5],
                        name: "pit trap",
                        desc: "pit that traps enemies if they walk over it",
                        req: ["wood", 30, "stone", 30],
                        trap: true,
                        ignoreCollision: true,
                        hideFromEnemy: true,
                        health: 500,
                        colDiv: 0.2,
                        scale: 50,
                        holdOffset: 20,
                        placeOffset: -5,
                        alpha: 0.6,
                        itemID: 15,
                        itemAID: 31,
                    }, {
                        age: 4,
                        group: this.groups[6],
                        name: "boost pad",
                        desc: "provides boost when stepped on",
                        req: ["stone", 20, "wood", 5],
                        ignoreCollision: true,
                        boostSpeed: 1.5,
                        health: 150,
                        colDiv: 0.7,
                        scale: 45,
                        holdOffset: 20,
                        placeOffset: -5,
                        itemID: 16,
                        itemAID: 32,
                    }, {
                        age: 7,
                        group: this.groups[7],
                        doUpdate: true,
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
                        itemID: 17,
                        itemAID: 33,
                    }, {
                        age: 7,
                        group: this.groups[8],
                        name: "platform",
                        desc: "platform to shoot over walls and cross over water",
                        req: ["wood", 20],
                        ignoreCollision: true,
                        zIndex: 1,
                        health: 300,
                        scale: 43,
                        holdOffset: 20,
                        placeOffset: -5,
                        itemID: 18,
                        itemAID: 34,
                    }, {
                        age: 7,
                        group: this.groups[9],
                        name: "healing pad",
                        desc: "standing on it will slowly heal you",
                        req: ["wood", 30, "food", 10],
                        ignoreCollision: true,
                        healCol: 15,
                        health: 400,
                        colDiv: 0.7,
                        scale: 45,
                        holdOffset: 20,
                        placeOffset: -5,
                        itemID: 19,
                        itemAID: 35,
                    }, {
                        age: 9,
                        group: this.groups[10],
                        name: "spawn pad",
                        desc: "you will spawn here when you die but it will dissapear",
                        req: ["wood", 100, "stone", 100],
                        health: 400,
                        ignoreCollision: true,
                        spawnPoint: true,
                        scale: 45,
                        holdOffset: 20,
                        placeOffset: -5,
                        itemID: 20,
                        itemAID: 36,
                    }, {
                        age: 7,
                        group: this.groups[12],
                        name: "blocker",
                        desc: "blocks building in radius",
                        req: ["wood", 30, "stone", 25],
                        ignoreCollision: true,
                        blocker: 300,
                        health: 400,
                        colDiv: 0.7,
                        scale: 45,
                        holdOffset: 20,
                        placeOffset: -5,
                        itemID: 21,
                        itemAID: 37,
                    }, {
                        age: 7,
                        group: this.groups[13],
                        name: "teleporter",
                        desc: "teleports you to a random point on the map",
                        req: ["wood", 60, "stone", 60],
                        ignoreCollision: true,
                        teleport: true,
                        health: 200,
                        colDiv: 0.7,
                        scale: 45,
                        holdOffset: 20,
                        placeOffset: -5,
                        itemID: 22,
                        itemAID: 38
                    }];

                    // CHECK ITEM ID:
                    this.checkItem = {
                        index: function(id, myItems) {
                            return [0, 1, 2].includes(id) ? 0 : [3, 4, 5].includes(id) ? 1 : [6, 7, 8, 9].includes(id) ? 2 : [10, 11, 12].includes(id) ? 3 : [13, 14].includes(id) ? 5 : [15, 16].includes(id) ? 4 : [17, 18, 19, 21, 22].includes(id) ? [13, 14].includes(myItems) ? 6 :
                            5 :
                            id == 20 ? [13, 14].includes(myItems) ? 7 :
                            6 :
                            undefined;
                        }
                    }

                    // ASSIGN IDS:
                    for (let i = 0; i < this.list.length; ++i) {
                        this.list[i].id = i;
                        if (this.list[i].pre) this.list[i].pre = i - this.list[i].pre;
                    }

                    // TROLOLOLOL:
                    if (typeof window !== "undefined") {
                        function shuffle(a) {
                            for (let i = a.length - 1; i > 0; i--) {
                                const j = Math.floor(Math.random() * (i + 1));
                                [a[i], a[j]] = [a[j], a[i]];
                            }
                            return a;
                        }
                        //shuffle(this.list);
                    }
                }
            }
            class Objectmanager {
                constructor(GameObject, gameObjects, UTILS, config, players, server) {
                    let mathFloor = Math.floor,
                        mathABS = Math.abs,
                        mathCOS = Math.cos,
                        mathSIN = Math.sin,
                        mathPOW = Math.pow,
                        mathSQRT = Math.sqrt;

                    this.ignoreAdd = false;
                    this.hitObj = [];

                    // DISABLE OBJ:
                    this.disableObj = function(obj) {
                        obj.active = false;
                        if (config.anotherVisual) {} else {
                            obj.alive = false;
                        }
                    };

                    // ADD NEW:
                    let tmpObj;
                    this.add = function(sid, x, y, dir, s, type, data, setSID, owner) {
                        tmpObj = findObjectBySid(sid);
                        if (!tmpObj) {
                            tmpObj = gameObjects.find((tmp) => !tmp.active);
                            if (!tmpObj) {
                                tmpObj = new GameObject(sid);
                                gameObjects.push(tmpObj);
                            }
                        }
                        if (setSID) {
                            tmpObj.sid = sid;
                        }
                        tmpObj.init(x, y, dir, s, type, data, owner);
                    };

                    // DISABLE BY SID:
                    this.disableBySid = function(sid) {
                        let find = findObjectBySid(sid);
                        if (find) {
                            this.disableObj(find);
                        }
                    };

                    // REMOVE ALL FROM PLAYER:
                    this.removeAllItems = function(sid, server) {
                        gameObjects.filter((tmp) => tmp.active && tmp.owner && tmp.owner.sid == sid).forEach((tmp) => this.disableObj(tmp));
                    };

                    // CHECK IF PLACABLE:
                    this.checkItemLocation = function(x, y, s, sM, indx, ignoreWater, placer) {
                        let cantPlace = gameObjects.find((tmp) => tmp.active && UTILS.getDistance(x, y, tmp.x, tmp.y) < s + (tmp.blocker ? tmp.blocker : tmp.getScale(sM, tmp.isItem)));
                        if (cantPlace) return false;
                        if (!ignoreWater && indx != 18 && y >= config.mapScale / 2 - config.riverWidth / 2 && y <= config.mapScale / 2 + config.riverWidth / 2) return false;
                        return true;
                    };

                }
            }
            class Projectile {
                constructor(players, ais, objectManager, items, config, UTILS, server) {

                    // INIT:
                    this.init = function(indx, x, y, dir, spd, dmg, rng, scl, owner) {
                        this.active = true;
                        this.tickActive = true;
                        this.indx = indx;
                        this.x = x;
                        this.y = y;
                        this.x2 = x;
                        this.y2 = y;
                        this.dir = dir;
                        this.skipMov = true;
                        this.speed = spd;
                        this.dmg = dmg;
                        this.scale = scl;
                        this.range = rng;
                        this.r2 = rng;
                        this.owner = owner;
                    };

                    // UPDATE:
                    this.update = function(delta) {
                        if (this.active) {
                            let tmpSpeed = this.speed * delta;
                            if (!this.skipMov) {
                                this.x += tmpSpeed * Math.cos(this.dir);
                                this.y += tmpSpeed * Math.sin(this.dir);
                                this.range -= tmpSpeed;
                                if (this.range <= 0) {
                                    this.x += this.range * Math.cos(this.dir);
                                    this.y += this.range * Math.sin(this.dir);
                                    tmpSpeed = 1;
                                    this.range = 0;
                                    this.active = false;
                                }
                            } else {
                                this.skipMov = false;
                            }
                        }
                    };
                    this.tickUpdate = function(delta) {
                        if (this.tickActive) {
                            let tmpSpeed = this.speed * delta;
                            if (!this.skipMov) {
                                this.x2 += tmpSpeed * Math.cos(this.dir);
                                this.y2 += tmpSpeed * Math.sin(this.dir);
                                this.r2 -= tmpSpeed;
                                if (this.r2 <= 0) {
                                    this.x2 += this.r2 * Math.cos(this.dir);
                                    this.y2 += this.r2 * Math.sin(this.dir);
                                    tmpSpeed = 1;
                                    this.r2 = 0;
                                    this.tickActive = false;
                                }
                            } else {
                                this.skipMov = false;
                            }
                        }
                    };
                }
            };
            class Store {
                constructor() {
                    // STORE HATS:
                    this.hats = [{
                        id: 45,
                        name: "Shame!",
                        dontSell: true,
                        price: 0,
                        scale: 120,
                        desc: "hacks are for winners"
                    }, {
                        id: 51,
                        name: "Moo Cap",
                        price: 0,
                        scale: 120,
                        desc: "coolest mooer around"
                    }, {
                        id: 50,
                        name: "Apple Cap",
                        price: 0,
                        scale: 120,
                        desc: "apple farms remembers"
                    }, {
                        id: 28,
                        name: "Moo Head",
                        price: 0,
                        scale: 120,
                        desc: "no effect"
                    }, {
                        id: 29,
                        name: "Pig Head",
                        price: 0,
                        scale: 120,
                        desc: "no effect"
                    }, {
                        id: 30,
                        name: "Fluff Head",
                        price: 0,
                        scale: 120,
                        desc: "no effect"
                    }, {
                        id: 36,
                        name: "Pandou Head",
                        price: 0,
                        scale: 120,
                        desc: "no effect"
                    }, {
                        id: 37,
                        name: "Bear Head",
                        price: 0,
                        scale: 120,
                        desc: "no effect"
                    }, {
                        id: 38,
                        name: "Monkey Head",
                        price: 0,
                        scale: 120,
                        desc: "no effect"
                    }, {
                        id: 44,
                        name: "Polar Head",
                        price: 0,
                        scale: 120,
                        desc: "no effect"
                    }, {
                        id: 35,
                        name: "Fez Hat",
                        price: 0,
                        scale: 120,
                        desc: "no effect"
                    }, {
                        id: 42,
                        name: "Enigma Hat",
                        price: 0,
                        scale: 120,
                        desc: "join the enigma army"
                    }, {
                        id: 43,
                        name: "Blitz Hat",
                        price: 0,
                        scale: 120,
                        desc: "hey everybody i'm blitz"
                    }, {
                        id: 49,
                        name: "Bob XIII Hat",
                        price: 0,
                        scale: 120,
                        desc: "like and subscribe"
                    }, {
                        id: 57,
                        name: "Pumpkin",
                        price: 50,
                        scale: 120,
                        desc: "Spooooky"
                    }, {
                        id: 8,
                        name: "Bummle Hat",
                        price: 100,
                        scale: 120,
                        desc: "no effect"
                    }, {
                        id: 2,
                        name: "Straw Hat",
                        price: 500,
                        scale: 120,
                        desc: "no effect"
                    }, {
                        id: 15,
                        name: "Winter Cap",
                        price: 600,
                        scale: 120,
                        desc: "allows you to move at normal speed in snow",
                        coldM: 1
                    }, {
                        id: 5,
                        name: "Cowboy Hat",
                        price: 1000,
                        scale: 120,
                        desc: "no effect"
                    }, {
                        id: 4,
                        name: "Ranger Hat",
                        price: 2000,
                        scale: 120,
                        desc: "no effect"
                    }, {
                        id: 18,
                        name: "Explorer Hat",
                        price: 2000,
                        scale: 120,
                        desc: "no effect"
                    }, {
                        id: 31,
                        name: "Flipper Hat",
                        price: 2500,
                        scale: 120,
                        desc: "have more control while in water",
                        watrImm: true
                    }, {
                        id: 1,
                        name: "Marksman Cap",
                        price: 3000,
                        scale: 120,
                        desc: "increases arrow speed and range",
                        aMlt: 1.3
                    }, {
                        id: 10,
                        name: "Bush Gear",
                        price: 3000,
                        scale: 160,
                        desc: "allows you to disguise yourself as a bush"
                    }, {
                        id: 48,
                        name: "Halo",
                        price: 3000,
                        scale: 120,
                        desc: "no effect"
                    }, {
                        id: 6,
                        name: "Soldier Helmet",
                        price: 4000,
                        scale: 120,
                        desc: "reduces damage taken but slows movement",
                        spdMult: 0.94,
                        dmgMult: 0.75
                    }, {
                        id: 23,
                        name: "Anti Venom Gear",
                        price: 4000,
                        scale: 120,
                        desc: "makes you immune to poison",
                        poisonRes: 1
                    }, {
                        id: 13,
                        name: "Medic Gear",
                        price: 5000,
                        scale: 110,
                        desc: "slowly regenerates health over time",
                        healthRegen: 3
                    }, {
                        id: 9,
                        name: "Miners Helmet",
                        price: 5000,
                        scale: 120,
                        desc: "earn 1 extra gold per resource",
                        extraGold: 1
                    }, {
                        id: 32,
                        name: "Musketeer Hat",
                        price: 5000,
                        scale: 120,
                        desc: "reduces cost of projectiles",
                        projCost: 0.5
                    }, {
                        id: 7,
                        name: "Bull Helmet",
                        price: 6000,
                        scale: 120,
                        desc: "increases damage done but drains health",
                        healthRegen: -5,
                        dmgMultO: 1.5,
                        spdMult: 0.96
                    }, {
                        id: 22,
                        name: "Emp Helmet",
                        price: 6000,
                        scale: 120,
                        desc: "turrets won't attack but you move slower",
                        antiTurret: 1,
                        spdMult: 0.7
                    }, {
                        id: 12,
                        name: "Booster Hat",
                        price: 6000,
                        scale: 120,
                        desc: "increases your movement speed",
                        spdMult: 1.16
                    }, {
                        id: 26,
                        name: "Barbarian Armor",
                        price: 8000,
                        scale: 120,
                        desc: "knocks back enemies that attack you",
                        dmgK: 0.6
                    }, {
                        id: 21,
                        name: "Plague Mask",
                        price: 10000,
                        scale: 120,
                        desc: "melee attacks deal poison damage",
                        poisonDmg: 5,
                        poisonTime: 6
                    }, {
                        id: 46,
                        name: "Bull Mask",
                        price: 10000,
                        scale: 120,
                        desc: "bulls won't target you unless you attack them",
                        bullRepel: 1
                    }, {
                        id: 14,
                        name: "Windmill Hat",
                        topSprite: true,
                        price: 10000,
                        scale: 120,
                        desc: "generates points while worn",
                        pps: 1.5
                    }, {
                        id: 11,
                        name: "Spike Gear",
                        topSprite: true,
                        price: 10000,
                        scale: 120,
                        desc: "deal damage to players that damage you",
                        dmg: 0.45
                    }, {
                        id: 53,
                        name: "Turret Gear",
                        topSprite: true,
                        price: 10000,
                        scale: 120,
                        desc: "you become a walking turret",
                        turret: {
                            proj: 1,
                            range: 700,
                            rate: 2500
                        },
                        spdMult: 0.7
                    }, {
                        id: 20,
                        name: "Samurai Armor",
                        price: 12000,
                        scale: 120,
                        desc: "increased attack speed and fire rate",
                        atkSpd: 0.78
                    }, {
                        id: 58,
                        name: "Dark Knight",
                        price: 12000,
                        scale: 120,
                        desc: "restores health when you deal damage",
                        healD: 0.4
                    }, {
                        id: 27,
                        name: "Scavenger Gear",
                        price: 15000,
                        scale: 120,
                        desc: "earn double points for each kill",
                        kScrM: 2
                    }, {
                        id: 40,
                        name: "Tank Gear",
                        price: 15000,
                        scale: 120,
                        desc: "increased damage to buildings but slower movement",
                        spdMult: 0.3,
                        bDmg: 3.3
                    }, {
                        id: 52,
                        name: "Thief Gear",
                        price: 15000,
                        scale: 120,
                        desc: "steal half of a players gold when you kill them",
                        goldSteal: 0.5
                    }, {
                        id: 55,
                        name: "Bloodthirster",
                        price: 20000,
                        scale: 120,
                        desc: "Restore Health when dealing damage. And increased damage",
                        healD: 0.25,
                        dmgMultO: 1.2,
                    }, {
                        id: 56,
                        name: "Assassin Gear",
                        price: 20000,
                        scale: 120,
                        desc: "Go invisible when not moving. Can't eat. Increased speed",
                        noEat: true,
                        spdMult: 1.1,
                        invisTimer: 1000
                    }];

                    // STORE ACCESSORIES:
                    this.accessories = [{
                        id: 12,
                        name: "Snowball",
                        price: 1000,
                        scale: 105,
                        xOff: 18,
                        desc: "no effect"
                    }, {
                        id: 9,
                        name: "Tree Cape",
                        price: 1000,
                        scale: 90,
                        desc: "no effect"
                    }, {
                        id: 10,
                        name: "Stone Cape",
                        price: 1000,
                        scale: 90,
                        desc: "no effect"
                    }, {
                        id: 3,
                        name: "Cookie Cape",
                        price: 1500,
                        scale: 90,
                        desc: "no effect"
                    }, {
                        id: 8,
                        name: "Cow Cape",
                        price: 2000,
                        scale: 90,
                        desc: "no effect"
                    }, {
                        id: 11,
                        name: "Monkey Tail",
                        price: 2000,
                        scale: 97,
                        xOff: 25,
                        desc: "Super speed but reduced damage",
                        spdMult: 1.35,
                        dmgMultO: 0.2
                    }, {
                        id: 17,
                        name: "Apple Basket",
                        price: 3000,
                        scale: 80,
                        xOff: 12,
                        desc: "slowly regenerates health over time",
                        healthRegen: 1
                    }, {
                        id: 6,
                        name: "Winter Cape",
                        price: 3000,
                        scale: 90,
                        desc: "no effect"
                    }, {
                        id: 4,
                        name: "Skull Cape",
                        price: 4000,
                        scale: 90,
                        desc: "no effect"
                    }, {
                        id: 5,
                        name: "Dash Cape",
                        price: 5000,
                        scale: 90,
                        desc: "no effect"
                    }, {
                        id: 2,
                        name: "Dragon Cape",
                        price: 6000,
                        scale: 90,
                        desc: "no effect"
                    }, {
                        id: 1,
                        name: "Super Cape",
                        price: 8000,
                        scale: 90,
                        desc: "no effect"
                    }, {
                        id: 7,
                        name: "Troll Cape",
                        price: 8000,
                        scale: 90,
                        desc: "no effect"
                    }, {
                        id: 14,
                        name: "Thorns",
                        price: 10000,
                        scale: 115,
                        xOff: 20,
                        desc: "no effect"
                    }, {
                        id: 15,
                        name: "Blockades",
                        price: 10000,
                        scale: 95,
                        xOff: 15,
                        desc: "no effect"
                    }, {
                        id: 20,
                        name: "Devils Tail",
                        price: 10000,
                        scale: 95,
                        xOff: 20,
                        desc: "no effect"
                    }, {
                        id: 16,
                        name: "Sawblade",
                        price: 12000,
                        scale: 90,
                        spin: true,
                        xOff: 0,
                        desc: "deal damage to players that damage you",
                        dmg: 0.15
                    }, {
                        id: 13,
                        name: "Angel Wings",
                        price: 15000,
                        scale: 138,
                        xOff: 22,
                        desc: "slowly regenerates health over time",
                        healthRegen: 3
                    }, {
                        id: 19,
                        name: "Shadow Wings",
                        price: 15000,
                        scale: 138,
                        xOff: 22,
                        desc: "increased movement speed",
                        spdMult: 1.1
                    }, {
                        id: 18,
                        name: "Blood Wings",
                        price: 20000,
                        scale: 178,
                        xOff: 26,
                        desc: "restores health when you deal damage",
                        healD: 0.2
                    }, {
                        id: 21,
                        name: "Corrupt X Wings",
                        price: 20000,
                        scale: 178,
                        xOff: 26,
                        desc: "deal damage to players that damage you",
                        dmg: 0.25
                    }];
                }
            };
            class ProjectileManager {
                constructor(Projectile, projectiles, players, ais, objectManager, items, config, UTILS, server) {
                    this.addProjectile = function(x, y, dir, range, speed, indx, owner, ignoreObj, layer, inWindow) {
                        let tmpData = items.projectiles[indx];
                        let tmpProj;
                        for (let i = 0; i < projectiles.length; ++i) {
                            if (!projectiles[i].active) {
                                tmpProj = projectiles[i];
                                break;
                            }
                        }
                        if (!tmpProj) {
                            tmpProj = new Projectile(players, ais, objectManager, items, config, UTILS, server);
                            tmpProj.sid = projectiles.length;
                            projectiles.push(tmpProj);
                        }
                        tmpProj.init(indx, x, y, dir, speed, tmpData.dmg, range, tmpData.scale, owner);
                        tmpProj.ignoreObj = ignoreObj;
                        tmpProj.layer = layer || tmpData.layer;
                        tmpProj.inWindow = inWindow;
                        tmpProj.src = tmpData.src;
                        return tmpProj;
                    };
                }
            };
            class AiManager {

                // AI MANAGER:
                constructor(ais, AI, players, items, objectManager, config, UTILS, scoreCallback, server) {

                    // AI TYPES:
                    this.aiTypes = [{
                        id: 0,
                        src: "cow_1",
                        killScore: 150,
                        health: 500,
                        weightM: 0.8,
                        speed: 0.00095,
                        turnSpeed: 0.001,
                        scale: 72,
                        drop: ["food", 50]
                    }, {
                        id: 1,
                        src: "pig_1",
                        killScore: 200,
                        health: 800,
                        weightM: 0.6,
                        speed: 0.00085,
                        turnSpeed: 0.001,
                        scale: 72,
                        drop: ["food", 80]
                    }, {
                        id: 2,
                        name: "Bull",
                        src: "bull_2",
                        hostile: true,
                        dmg: 20,
                        killScore: 1000,
                        health: 1800,
                        weightM: 0.5,
                        speed: 0.00094,
                        turnSpeed: 0.00074,
                        scale: 78,
                        viewRange: 800,
                        chargePlayer: true,
                        drop: ["food", 100]
                    }, {
                        id: 3,
                        name: "Bully",
                        src: "bull_1",
                        hostile: true,
                        dmg: 20,
                        killScore: 2000,
                        health: 2800,
                        weightM: 0.45,
                        speed: 0.001,
                        turnSpeed: 0.0008,
                        scale: 90,
                        viewRange: 900,
                        chargePlayer: true,
                        drop: ["food", 400]
                    }, {
                        id: 4,
                        name: "Wolf",
                        src: "wolf_1",
                        hostile: true,
                        dmg: 8,
                        killScore: 500,
                        health: 300,
                        weightM: 0.45,
                        speed: 0.001,
                        turnSpeed: 0.002,
                        scale: 84,
                        viewRange: 800,
                        chargePlayer: true,
                        drop: ["food", 200]
                    }, {
                        id: 5,
                        name: "Quack",
                        src: "chicken_1",
                        dmg: 8,
                        killScore: 2000,
                        noTrap: true,
                        health: 300,
                        weightM: 0.2,
                        speed: 0.0018,
                        turnSpeed: 0.006,
                        scale: 70,
                        drop: ["food", 100]
                    }, {
                        id: 6,
                        name: "MOOSTAFA",
                        nameScale: 50,
                        src: "enemy",
                        hostile: true,
                        dontRun: true,
                        fixedSpawn: true,
                        spawnDelay: 60000,
                        noTrap: true,
                        colDmg: 100,
                        dmg: 40,
                        killScore: 8000,
                        health: 18000,
                        weightM: 0.4,
                        speed: 0.0007,
                        turnSpeed: 0.01,
                        scale: 80,
                        spriteMlt: 1.8,
                        leapForce: 0.9,
                        viewRange: 1000,
                        hitRange: 210,
                        hitDelay: 1000,
                        chargePlayer: true,
                        drop: ["food", 100]
                    }, {
                        id: 7,
                        name: "Treasure",
                        hostile: true,
                        nameScale: 35,
                        src: "crate_1",
                        fixedSpawn: true,
                        spawnDelay: 120000,
                        colDmg: 200,
                        killScore: 5000,
                        health: 20000,
                        weightM: 0.1,
                        speed: 0.0,
                        turnSpeed: 0.0,
                        scale: 70,
                        spriteMlt: 1.0
                    }, {
                        id: 8,
                        name: "MOOFIE",
                        src: "wolf_2",
                        hostile: true,
                        fixedSpawn: true,
                        dontRun: true,
                        hitScare: 4,
                        spawnDelay: 30000,
                        noTrap: true,
                        nameScale: 35,
                        dmg: 10,
                        colDmg: 100,
                        killScore: 3000,
                        health: 7000,
                        weightM: 0.45,
                        speed: 0.0015,
                        turnSpeed: 0.002,
                        scale: 90,
                        viewRange: 800,
                        chargePlayer: true,
                        drop: ["food", 1000]
                    }];

                    // SPAWN AI:
                    this.spawn = function(x, y, dir, index) {
                        let tmpObj = ais.find((tmp) => !tmp.active);
                        if (!tmpObj) {
                            tmpObj = new AI(ais.length, objectManager, players, items, UTILS, config, scoreCallback, server);
                            ais.push(tmpObj);
                        }
                        tmpObj.init(x, y, dir, index, this.aiTypes[index]);
                        return tmpObj;
                    };
                }

            };
            class AI {
                constructor(sid, objectManager, players, items, UTILS, config, scoreCallback, server) {
                    this.sid = sid;
                    this.isAI = true;
                    this.nameIndex = UTILS.randInt(0, config.cowNames.length - 1);

                    // INIT:
                    this.init = function(x, y, dir, index, data) {
                        this.x = x;
                        this.y = y;
                        this.startX = data.fixedSpawn ? x : null;
                        this.startY = data.fixedSpawn ? y : null;
                        this.xVel = 0;
                        this.yVel = 0;
                        this.zIndex = 0;
                        this.dir = dir;
                        this.dirPlus = 0;
                        this.index = index;
                        this.src = data.src;
                        if (data.name) this.name = data.name;
                        this.weightM = data.weightM;
                        this.speed = data.speed;
                        this.killScore = data.killScore;
                        this.turnSpeed = data.turnSpeed;
                        this.scale = data.scale;
                        this.maxHealth = data.health;
                        this.leapForce = data.leapForce;
                        this.health = this.maxHealth;
                        this.chargePlayer = data.chargePlayer;
                        this.viewRange = data.viewRange;
                        this.drop = data.drop;
                        this.dmg = data.dmg;
                        this.hostile = data.hostile;
                        this.dontRun = data.dontRun;
                        this.hitRange = data.hitRange;
                        this.hitDelay = data.hitDelay;
                        this.hitScare = data.hitScare;
                        this.spriteMlt = data.spriteMlt;
                        this.nameScale = data.nameScale;
                        this.colDmg = data.colDmg;
                        this.noTrap = data.noTrap;
                        this.spawnDelay = data.spawnDelay;
                        this.hitWait = 0;
                        this.waitCount = 1000;
                        this.moveCount = 0;
                        this.targetDir = 0;
                        this.active = true;
                        this.alive = true;
                        this.runFrom = null;
                        this.chargeTarget = null;
                        this.dmgOverTime = {};
                    };

                    let tmpRatio = 0;
                    let animIndex = 0;
                    this.animate = function(delta) {
                        if (this.animTime > 0) {
                            this.animTime -= delta;
                            if (this.animTime <= 0) {
                                this.animTime = 0;
                                this.dirPlus = 0;
                                tmpRatio = 0;
                                animIndex = 0;
                            } else {
                                if (animIndex == 0) {
                                    tmpRatio += delta / (this.animSpeed * config.hitReturnRatio);
                                    this.dirPlus = UTILS.lerp(0, this.targetAngle, Math.min(1, tmpRatio));
                                    if (tmpRatio >= 1) {
                                        tmpRatio = 1;
                                        animIndex = 1;
                                    }
                                } else {
                                    tmpRatio -= delta / (this.animSpeed * (1 - config.hitReturnRatio));
                                    this.dirPlus = UTILS.lerp(0, this.targetAngle, Math.max(0, tmpRatio));
                                }
                            }
                        }
                    };

                    // ANIMATION:
                    this.startAnim = function() {
                        this.animTime = this.animSpeed = 600;
                        this.targetAngle = Math.PI * 0.8;
                        tmpRatio = 0;
                        animIndex = 0;
                    };

                };

            };
            class Petal {
                constructor(x, y) {
                    this.x = x;
                    this.y = y;
                    this.damage = 10;
                    this.health = 10;
                    this.maxHealth = this.health;
                    this.active = false;
                    this.alive = false;
                    this.timer = 1500;
                    this.time = 0;
                    this.damaged = 0;
                    this.alpha = 1;
                    this.scale = 9;
                    this.visScale = this.scale;
                }
            };
            class addCh {
                constructor(x, y, chat, tmpObj) {
                    this.x = x;
                    this.y = y;
                    this.alpha = 0;
                    this.active = true;
                    this.alive = false;
                    this.chat = chat;
                    this.owner = tmpObj;
                };
            };
            class DeadPlayer {
                constructor(x, y, dir, buildIndex, weaponIndex, weaponVariant, skinColor, scale, name) {
                    this.x = x;
                    this.y = y;
                    this.lastDir = dir;
                    this.dir = dir + Math.PI;
                    this.buildIndex = buildIndex;
                    this.weaponIndex = weaponIndex;
                    this.weaponVariant = weaponVariant;
                    this.skinColor = skinColor;
                    this.scale = scale;
                    this.visScale = 0;
                    this.name = name;
                    this.alpha = 1;
                    this.active = true;
                    this.animate = function(delta) {
                        let d2 = UTILS.getAngleDist(this.lastDir, this.dir);
                        if (d2 > 0.01) {
                            this.dir += d2 / 20;
                        } else {
                            this.dir = this.lastDir;
                        }
                        if (this.visScale < this.scale) {
                            this.visScale += delta / (this.scale / 2);
                            if (this.visScale >= this.scale) {
                                this.visScale = this.scale;
                            }
                        }
                        this.alpha -= delta / 30000;
                        if (this.alpha <= 0) {
                            this.alpha = 0;
                            this.active = false;
                        }
                    }
                }
            };
            class Player {
                constructor(id, sid, config, UTILS, projectileManager, objectManager, players, ais, items, hats, accessories, server, scoreCallback, iconCallback) {
                    this.id = id;
                    this.sid = sid;
                    this.tmpScore = 0;
                    this.team = null;
                    this.latestSkin = 0;
                    this.oldSkinIndex = 0;
                    this.skinIndex = 0;
                    this.latestTail = 0;
                    this.oldTailIndex = 0;
                    this.tailIndex = 0;
                    this.hitTime = 0;
                    this.lastHit = 0;
                    this.tails = {};
                    for (let i = 0; i < accessories.length; ++i) {
                        if (accessories[i].price <= 0)
                            this.tails[accessories[i].id] = 1;
                    }
                    this.skins = {};
                    for (let i = 0; i < hats.length; ++i) {
                        if (hats[i].price <= 0)
                            this.skins[hats[i].id] = 1;
                    }
                    this.points = 0;
                    this.dt = 0;
                    this.hidden = false;
                    this.itemCounts = {};
                    this.isPlayer = true;
                    this.pps = 0;
                    this.moveDir = undefined;
                    this.skinRot = 0;
                    this.lastPing = 0;
                    this.iconIndex = 0;
                    this.skinColor = 0;
                    this.dist2 = 0;
                    this.aim2 = 0;
                    this.maxSpeed = 1;
                    this.chat = {
                        message: null,
                        count: 0
                    };
                    this.backupNobull = true;
                    this.circle = false;
                    this.circleRad = 200;
                    this.circleRadSpd = 0.1;
                    this.cAngle = 0;

                    // SPAWN:
                    this.spawn = function(moofoll) {
                        this.attacked = false;
                        this.death = false;
                        this.spinDir = 0;
                        this.sync = false;
                        this.antiBull = 0;
                        this.bullTimer = 0;
                        this.poisonTimer = 0;
                        this.active = true;
                        this.alive = true;
                        this.lockMove = false;
                        this.lockDir = false;
                        this.minimapCounter = 0;
                        this.chatCountdown = 0;
                        this.shameCount = 0;
                        this.shameTimer = 0;
                        this.sentTo = {};
                        this.gathering = 0;
                        this.gatherIndex = 0;
                        this.shooting = {};
                        this.shootIndex = 9;
                        this.autoGather = 0;
                        this.animTime = 0;
                        this.animSpeed = 0;
                        this.mouseState = 0;
                        this.buildIndex = -1;
                        this.weaponIndex = 0;
                        this.weaponCode = 0;
                        this.weaponVariant = 0;
                        this.primaryIndex = undefined;
                        this.secondaryIndex = undefined;
                        this.dmgOverTime = {};
                        this.noMovTimer = 0;
                        this.maxXP = 300;
                        this.XP = 0;
                        this.age = 1;
                        this.kills = 0;
                        this.upgrAge = 2;
                        this.upgradePoints = 0;
                        this.x = 0;
                        this.y = 0;
                        this.oldXY = {
                            x: 0,
                            y: 0
                        };
                        this.zIndex = 0;
                        this.xVel = 0;
                        this.yVel = 0;
                        this.slowMult = 1;
                        this.dir = 0;
                        this.dirPlus = 0;
                        this.targetDir = 0;
                        this.targetAngle = 0;
                        this.maxHealth = 100;
                        this.health = this.maxHealth;
                        this.oldHealth = this.maxHealth;
                        this.damaged = 0;
                        this.scale = config.playerScale;
                        this.speed = config.playerSpeed;
                        this.resetMoveDir();
                        this.resetResources(moofoll);
                        this.items = [0, 3, 6, 10];
                        this.weapons = [0];
                        this.shootCount = 0;
                        this.weaponXP = [];
                        this.reloads = {
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
                        };
                        this.bowThreat = {
                            9: 0,
                            12: 0,
                            13: 0,
                            15: 0,
                        };
                        this.damageThreat = 0;
                        this.inTrap = false;
                        this.canEmpAnti = false;
                        this.empAnti = false;
                        this.soldierAnti = false;
                        this.poisonTick = 0;
                        this.bullTick = 0;
                        this.setPoisonTick = false;
                        this.setBullTick = false;
                        this.antiTimer = 2;
                    };

                    // RESET MOVE DIR:
                    this.resetMoveDir = function() {
                        this.moveDir = undefined;
                    };

                    // RESET RESOURCES:
                    this.resetResources = function(moofoll) {
                        for (let i = 0; i < config.resourceTypes.length; ++i) {
                            this[config.resourceTypes[i]] = moofoll ? 100 : 0;
                        }
                    };

                    // ADD ITEM:
                    this.getItemType = function(id) {
                        let findindx = this.items.findIndex((ids) => ids == id);
                        if (findindx != -1) {
                            return findindx;
                        } else {
                            return items.checkItem.index(id, this.items);
                        }
                    };

                    // SET DATA:
                    this.setData = function(data) {
                        this.id = data[0];
                        this.sid = data[1];
                        this.name = data[2];
                        this.x = data[3];
                        this.y = data[4];
                        this.dir = data[5];
                        this.health = data[6];
                        this.maxHealth = data[7];
                        this.scale = data[8];
                        this.skinColor = data[9];
                    };

                    // UPDATE POISON TICK:
                    this.updateTimer = function() {

                        this.bullTimer -= 1;
                        if (this.bullTimer <= 0) {
                            this.setBullTick = false;
                            this.bullTick = game.tick - 1;
                            this.bullTimer = config.serverUpdateRate;
                        }
                        this.poisonTimer -= 1;
                        if (this.poisonTimer <= 0) {
                            this.setPoisonTick = false;
                            this.poisonTick = game.tick - 1;
                            this.poisonTimer = config.serverUpdateRate;
                        }

                    };
                    this.update = function(delta) {
                        if (this.sid == playerSID) {
                            this.circleRad = parseInt(getEl("circleRad").value) || 0;
                            this.circleRadSpd = parseFloat(getEl("radSpeed").value) || 0;
                            this.cAngle += this.circleRadSpd;
                        }
                        if (this.active) {

                            // MOVE:
                            let gear = {
                                skin: findID(hats, this.skinIndex),
                                tail: findID(accessories, this.tailIndex)
                            }
                            let spdMult = ((this.buildIndex >= 0) ? 0.5 : 1) * (items.weapons[this.weaponIndex].spdMult || 1) * (gear.skin ? (gear.skin.spdMult || 1) : 1) * (gear.tail ? (gear.tail.spdMult || 1) : 1) * (this.y <= config.snowBiomeTop ? ((gear.skin && gear.skin.coldM) ? 1 : config.snowSpeed) : 1) * this.slowMult;
                            this.maxSpeed = spdMult;

                        }
                    };

                    let tmpRatio = 0;
                    let animIndex = 0;
                    this.animate = function(delta) {
                        if (this.animTime > 0) {
                            this.animTime -= delta;
                            if (this.animTime <= 0) {
                                this.animTime = 0;
                                this.dirPlus = 0;
                                tmpRatio = 0;
                                animIndex = 0;
                            } else {
                                if (animIndex == 0) {
                                    tmpRatio += delta / (this.animSpeed * config.hitReturnRatio);
                                    this.dirPlus = UTILS.lerp(0, this.targetAngle, Math.min(1, tmpRatio));
                                    if (tmpRatio >= 1) {
                                        tmpRatio = 1;
                                        animIndex = 1;
                                    }
                                } else {
                                    tmpRatio -= delta / (this.animSpeed * (1 - config.hitReturnRatio));
                                    this.dirPlus = UTILS.lerp(0, this.targetAngle, Math.max(0, tmpRatio));
                                }
                            }
                        }
                    };

                    // GATHER ANIMATION:
                    this.startAnim = function(didHit, index) {
                        this.animTime = this.animSpeed = items.weapons[index].speed;
                        this.targetAngle = (didHit ? -config.hitAngle : -Math.PI);
                        tmpRatio = 0;
                        animIndex = 0;
                    };

                    // CAN SEE:
                    this.canSee = function(other) {
                        if (!other) return false;
                        let dx = Math.abs(other.x - this.x) - other.scale;
                        let dy = Math.abs(other.y - this.y) - other.scale;
                        return dx <= (config.maxScreenWidth / 2) * 1.3 && dy <= (config.maxScreenHeight / 2) * 1.3;
                    };

                    // SHAME SYSTEM:
                    this.judgeShame = function() {
                        if (this.oldHealth < this.health) {
                            if (this.hitTime) {
                                let timeSinceHit = game.tick - this.hitTime;
                                this.lastHit = game.tick;
                                this.hitTime = 0;
                                if (timeSinceHit < 2) {
                                    this.shameCount++;
                                } else {
                                    this.shameCount = Math.max(0, this.shameCount - 2);
                                }
                            }
                        } else if (this.oldHealth > this.health) {
                            this.hitTime = game.tick;
                        }
                    };
                    this.addShameTimer = function() {
                        this.shameCount = 0;
                        this.shameTimer = 30;
                        let interval = setInterval(() => {
                            this.shameTimer--;
                            if (this.shameTimer <= 0) {
                                clearInterval(interval);
                            }
                        }, 1000);
                    };

                    // CHECK TEAM:
                    this.isTeam = function(tmpObj) {
                        return (this == tmpObj || (this.team && this.team == tmpObj.team));
                    };

                    // FOR THE PLAYER:
                    this.findAllianceBySid = function(sid) {
                        return this.team ? alliancePlayers.find((THIS) => THIS === sid) : null;
                    };
                    this.checkCanInsta = function(nobull) {
                        let totally = 0;
                        if (this.alive && inGame) {
                            let primary = {
                                weapon: this.weapons[0],
                                variant: this.primaryVariant,
                                dmg: this.weapons[0] == undefined ? 0 : items.weapons[this.weapons[0]].dmg,
                            };
                            let secondary = {
                                weapon: this.weapons[1],
                                variant: this.secondaryVariant,
                                dmg: this.weapons[1] == undefined ? 0 : items.weapons[this.weapons[1]].Pdmg,
                            };
                            let bull = this.skins[7] && !nobull ? 1.5 : 1;
                            let pV = primary.variant != undefined ? config.weaponVariants[primary.variant].val : 1;
                            if (primary.weapon != undefined && this.reloads[primary.weapon] == 0) {
                                totally += primary.dmg * pV * bull;
                            }
                            if (secondary.weapon != undefined && this.reloads[secondary.weapon] == 0) {
                                totally += secondary.dmg;
                            }
                            if (this.skins[53] && this.reloads[53] <= (player.weapons[1] == 10 ? 0 : game.tickRate) && near.skinIndex != 22) {
                                totally += 25;
                            }
                            totally *= near.skinIndex == 6 ? 0.75 : 1;
                            return totally;
                        }
                        return 0;
                    };

                    // UPDATE WEAPON RELOAD:
                    this.manageReload = function() {
                        if (this.shooting[53]) {
                            this.shooting[53] = 0;
                            this.reloads[53] = (2500 - game.tickRate);
                        } else {
                            if (this.reloads[53] > 0) {
                                this.reloads[53] = Math.max(0, this.reloads[53] - game.tickRate);
                            }
                        }
                        if (this.gathering || this.shooting[1]) {
                            if (this.gathering) {
                                this.gathering = 0;
                                this.reloads[this.gatherIndex] = (items.weapons[this.gatherIndex].speed * (this.skinIndex == 20 ? 0.78 : 1));
                                this.attacked = true;
                            }
                            if (this.shooting[1]) {
                                this.shooting[1] = 0;
                                this.reloads[this.shootIndex] = (items.weapons[this.shootIndex].speed * (this.skinIndex == 20 ? 0.78 : 1));
                                this.attacked = true;
                            }
                        } else {
                            this.attacked = false;
                            if (this.buildIndex < 0) {
                                if (this.reloads[this.weaponIndex] > 0) {
                                    this.reloads[this.weaponIndex] = Math.max(0, this.reloads[this.weaponIndex] - game.tickRate);
                                    if (this == player) {
                                        if (getEl("weaponGrind").checked) {
                                            for (let i = 0; i < Math.PI * 2; i += Math.PI / 2) {
                                                checkPlace(player.getItemType(22), i);
                                            }
                                        }
                                    }
                                    if (this.reloads[this.primaryIndex] == 0 && this.reloads[this.weaponIndex] == 0) {
                                        this.antiBull++;
                                        game.tickBase(() => {
                                            this.antiBull = 0;
                                        }, 1);
                                    }
                                }
                            }
                        }
                    };

                    // FOR ANTI INSTA:
                    this.addDamageThreat = function(tmpObj) {
                        let primary = {
                            weapon: this.primaryIndex,
                            variant: this.primaryVariant
                        };
                        primary.dmg = primary.weapon == undefined ? 45 : items.weapons[primary.weapon].dmg;
                        let secondary = {
                            weapon: this.secondaryIndex,
                            variant: this.secondaryVariant
                        };
                        secondary.dmg = secondary.weapon == undefined ? 50 : items.weapons[secondary.weapon].Pdmg;
                        let bull = 1.5;
                        let pV = primary.variant != undefined ? config.weaponVariants[primary.variant].val : 1.18;
                        let sV = secondary.variant != undefined ? [9, 12, 13, 15].includes(secondary.weapon) ? 1 : config.weaponVariants[secondary.variant].val : 1.18;
                        if (primary.weapon == undefined ? true : this.reloads[primary.weapon] == 0) {
                            this.damageThreat += primary.dmg * pV * bull;
                        }
                        if (secondary.weapon == undefined ? true : this.reloads[secondary.weapon] == 0) {
                            this.damageThreat += secondary.dmg * sV;
                        }
                        if (this.reloads[53] <= game.tickRate) {
                            this.damageThreat += 25;
                        }
                        this.damageThreat *= tmpObj.skinIndex == 6 ? 0.75 : 1;
                        if (!this.isTeam(tmpObj)) {
                            if (this.dist2 <= 300) {
                                tmpObj.damageThreat += this.damageThreat;
                            }
                        }
                    };

                }
            };

            // SOME CODES:
            function sendUpgrade(index) {
                player.reloads[index] = 0;
                packet("H", index);
            }

            function storeEquip(id, index) {
                packet("c", 0, id, index);
            }

            function storeBuy(id, index) {
                packet("c", 1, id, index);
            }

            function buyEquip(id, index) {
                let nID = player.skins[6] ? 6 : 0;
                if (player.alive && inGame) {
                    if (index == 0) {
                        if (player.skins[id]) {
                            if (player.latestSkin != id) {
                                packet("c", 0, id, 0);
                            }
                        } else {
                            if (configs.autoBuyEquip) {
                                let find = findID(hats, id);
                                if (find) {
                                    if (player.points >= find.price) {
                                        packet("c", 1, id, 0);
                                        packet("c", 0, id, 0);
                                    } else {
                                        if (player.latestSkin != nID) {
                                            packet("c", 0, nID, 0);
                                        }
                                    }
                                } else {
                                    if (player.latestSkin != nID) {
                                        packet("c", 0, nID, 0);
                                    }
                                }
                            } else {
                                if (player.latestSkin != nID) {
                                    packet("c", 0, nID, 0);
                                }
                            }
                        }
                    } else if (index == 1) {
                        if (useWasd && (id != 11 && id != 0)) {
                            if (player.latestTail != 0) {
                                packet("c", 0, 0, 1);
                            }
                            return;
                        }
                        if (player.tails[id]) {
                            if (player.latestTail != id) {
                                packet("c", 0, id, 1);
                            }
                        } else {
                            if (configs.autoBuyEquip) {
                                let find = findID(accessories, id);
                                if (find) {
                                    if (player.points >= find.price) {
                                        packet("c", 1, id, 1);
                                        packet("c", 0, id, 1);
                                    } else {
                                        if (player.latestTail != 0) {
                                            packet("c", 0, 0, 1);
                                        }
                                    }
                                } else {
                                    if (player.latestTail != 0) {
                                        packet("c", 0, 0, 1);
                                    }
                                }
                            } else {
                                if (player.latestTail != 0) {
                                    packet("c", 0, 0, 1);
                                }
                            }
                        }
                    }
                }
            }

            function selectToBuild(index, wpn) {
                packet("G", index, wpn);
            }

            function selectWeapon(index, isPlace) {
                if (!isPlace) {
                    player.weaponCode = index;
                }
                packet("G", index, 1);
            }

            function sendAutoGather() {
                packet("K", 1, 1);
            }

            function sendAtck(id, angle) {
                packet("d", id, angle, 1);
            }

            // PLACER:
            // PLACER:
            function place(id, rad, rmd) {
                try {
                    if (id == undefined) return;
                    let item = items.list[player.items[id]];
                    let tmpS = player.scale + item.scale + (item.placeOffset || 0);
                    let tmpX = player.x2 + tmpS * Math.cos(rad);
                    let tmpY = player.y2 + tmpS * Math.sin(rad);
                    if (testMode || (player.alive && inGame && player.itemCounts[item.group.id] == undefined ? true : player.itemCounts[item.group.id] < (config.isSandbox ? 299 : item.group.limit ? item.group.limit : 99))) {
                        selectToBuild(player.items[id]);
                        sendAtck(1, rad);
                        selectWeapon(player.weaponCode, 1);
                        if (rmd && getEl("placeVis").checked) {
                            placeVisible.push({
                                x: tmpX,
                                y: tmpY,
                                name: item.name,
                                scale: item.scale,
                                dir: rad
                            });
                            game.tickBase(() => {
                                placeVisible.shift();
                            }, 1)
                        }
                    }
                } catch (e) {}
            }

            function checkPlace(id, rad) {
                try {
                    if (id == undefined) return;
                    let item = items.list[player.items[id]];
                    let tmpS = player.scale + item.scale + (item.placeOffset || 0);
                    let tmpX = player.x2 + tmpS * Math.cos(rad);
                    let tmpY = player.y2 + tmpS * Math.sin(rad);
                    if (objectManager.checkItemLocation(tmpX, tmpY, item.scale, 0.6, item.id, false, player)) {
                        place(id, rad, 1);
                    }
                } catch (e) {}
            }

            // HEALING:
            function soldierMult() {
                return player.latestSkin == 6 ? 0.75 : 1;
            }

            function healthBased() {
                if (player.health == 100)
                    return 0;
                if ((player.skinIndex != 70 && player.skinIndex != 74)) {
                    return Math.ceil((100 - player.health) / items.list[player.items[0]].healing);
                }
                return 0;
            }

            function getAttacker(damaged) {
                let attackers = enemy.filter(tmp => {
                    //let damages = new Damages(items);
                    //let dmg = damages.weapons[tmp.weaponIndex];
                    //let by = tmp.weaponIndex < 9 ? [dmg[0], dmg[1], dmg[2], dmg[3]] : [dmg[0], dmg[1]];
                    let rule = {
                        //one: tmp.dist2 <= 300,
                        //two: by.includes(damaged),
                        three: tmp.attacked
                    }
                    return /*rule.one && rule.two && */ rule.three;
                });
                return attackers;
            }

            function healer() {
                for (let i = 0; i < healthBased(); i++) {
                    place(0, getAttackDir());
                }
            }

            function antiSyncHealing(timearg) {
                my.antiSync = true;
                let healAnti = setInterval(() => {
                    if (player.shameCount < 5) {
                        place(0, getAttackDir());
                    }
                }, 75);
                setTimeout(() => {
                    clearInterval(healAnti);
                    setTimeout(() => {
                        my.antiSync = false;
                    }, game.tickRate);
                }, game.tickRate);
            }

            function biomeGear(mover, returns) {
                if (player.y2 >= config.mapScale / 2 - config.riverWidth / 2 && player.y2 <= config.mapScale / 2 + config.riverWidth / 2) {
                    if (returns) return 31;
                    buyEquip(31, 0);
                } else {
                    if (player.y2 <= config.snowBiomeTop) {
                        if (returns) return mover && player.moveDir == undefined ? 22 : 15;
                        buyEquip(mover && player.moveDir == undefined ? 22 : 15, 0);
                    } else {
                        if (returns) return mover && player.moveDir == undefined ? 22 : 12;
                        buyEquip(mover && player.moveDir == undefined ? 22 : 12, 0);
                    }
                }
                if (returns) return 0;
            }

            function woah(mover) {
                buyEquip(mover && player.moveDir == undefined ? 0 : 11, 1);
            }

            let advHeal = [];

            class Traps {
                constructor(UTILS, items) {
                    this.dist = 0;
                    this.aim = 0;
                    this.inTrap = false;
                    this.replaced = false;
                    this.antiTrapped = false;
                    this.info = {};
                    this.notFast = function() {
                        return player.weapons[1] == 10 && ((this.info.health > items.weapons[player.weapons[0]].dmg) || player.weapons[0] == 5);
                    }
                    this.testCanPlace = function(id, first = -(Math.PI / 2), repeat = (Math.PI / 2), plus = (Math.PI / 18), radian, replacer, yaboi) {
                        try {
                            let item = items.list[player.items[id]];
                            let tmpS = player.scale + item.scale + (item.placeOffset || 0);
                            let counts = {
                                attempts: 0,
                                placed: 0
                            };
                            let tmpObjects = [];
                            gameObjects.forEach((p) => {
                                tmpObjects.push({
                                    x: p.x,
                                    y: p.y,
                                    active: p.active,
                                    blocker: p.blocker,
                                    scale: p.scale,
                                    isItem: p.isItem,
                                    type: p.type,
                                    colDiv: p.colDiv,
                                    getScale: function(sM, ig) {
                                        sM = sM || 1;
                                        return this.scale * ((this.isItem || this.type == 2 || this.type == 3 || this.type == 4)
                                                             ? 1 : (0.6 * sM)) * (ig ? 1 : this.colDiv);
                                    },
                                });
                            });
                            for (let i = first; i < repeat; i += plus) {
                                counts.attempts++;
                                let relAim = radian + i;
                                let tmpX = player.x2 + tmpS * Math.cos(relAim);
                                let tmpY = player.y2 + tmpS * Math.sin(relAim);
                                let cantPlace = tmpObjects.find((tmp) => tmp.active && UTILS.getDistance(tmpX, tmpY, tmp.x, tmp.y) < item.scale + (tmp.blocker ? tmp.blocker : tmp.getScale(0.6, tmp.isItem)));
                                if (cantPlace) continue;
                                if (item.id != 18 && tmpY >= config.mapScale / 2 - config.riverWidth / 2 && tmpY <= config.mapScale / 2 + config.riverWidth / 2) continue;
                                if ((!replacer && yaboi) || useWasd) {
                                    if (useWasd ? false : yaboi.inTrap) {
                                        if (UTILS.getAngleDist(near.aim2 + Math.PI, relAim + Math.PI) <= Math.PI) {
                                            place(2, relAim, 1);
                                        } else {
                                            player.items[4] == 15 && place(4, relAim, 1);
                                        }
                                    } else {
                                        if (UTILS.getAngleDist(near.aim2, relAim) <= config.gatherAngle / 1.5) {
                                            place(2, relAim, 1);
                                        } else {
                                            player.items[4] == 15 && place(4, relAim, 1);
                                        }
                                    }
                                } else {
                                    place(id, relAim, 1);
                                }
                                tmpObjects.push({
                                    x: tmpX,
                                    y: tmpY,
                                    active: true,
                                    blocker: item.blocker,
                                    scale: item.scale,
                                    isItem: true,
                                    type: null,
                                    colDiv: item.colDiv,
                                    getScale: function() {
                                        return this.scale;
                                    },
                                });
                                if (UTILS.getAngleDist(near.aim2, relAim) <= 1) {
                                    counts.placed++;
                                }
                            }
                            if (counts.placed > 0 && replacer && item.dmg) {
                                if (near.dist2 <= items.weapons[player.weapons[0]].range + (player.scale * 1.8) && configs.spikeTick) {
                                    instaC.canSpikeTick = true;
                                }
                            }
                        } catch (err) {
                        }
                    };
                    this.checkSpikeTick = function() {
                        try {
                            if (![3, 4, 5].includes(near.primaryIndex)) return false;
                            if ((getEl("safeAntiSpikeTick").checked || my.autoPush) ? false : near.primaryIndex == undefined ? true : (near.reloads[near.primaryIndex] > game.tickRate)) return false;
                            // more range for safe. also testing near.primaryIndex || 5
                            if (near.dist2 <= items.weapons[near.primaryIndex || 5].range + (near.scale * 1.8)) {
                                let item = items.list[9];
                                let tmpS = near.scale + item.scale + (item.placeOffset || 0);
                                let danger = 0;
                                let counts = {
                                    attempts: 0,
                                    block: `unblocked`
                                };
                                for (let i = -1; i <= 1; i += 1 / 10) {
                                    counts.attempts++;
                                    let relAim = UTILS.getDirect(player, near, 2, 2) + i;
                                    let tmpX = near.x2 + tmpS * Math.cos(relAim);
                                    let tmpY = near.y2 + tmpS * Math.sin(relAim);
                                    let cantPlace = gameObjects.find((tmp) => tmp.active && UTILS.getDistance(tmpX, tmpY, tmp.x, tmp.y) < item.scale + (tmp.blocker ? tmp.blocker : tmp.getScale(0.6, tmp.isItem)));
                                    if (cantPlace) continue;
                                    if (tmpY >= config.mapScale / 2 - config.riverWidth / 2 && tmpY <= config.mapScale / 2 + config.riverWidth / 2) continue;
                                    danger++;
                                    counts.block = `blocked`;
                                    break;
                                }
                                if (danger) {
                                    my.anti0Tick = 1;
                                    player.chat.message = "test spike detest " + near.sid;
                                    player.chat.count = 2000;
                                    return true;
                                }
                            }
                        } catch (err) {
                            return null;
                        }
                        return false;
                    }
                    this.protect = function(aim) {
                        if (!configs.antiTrap) return;
                        if (player.items[4]) {
                            this.testCanPlace(4, -(Math.PI / 2), (Math.PI / 2), (Math.PI / 18), aim + Math.PI);
                            this.antiTrapped = true;
                        }
                    };
                    /*this.autoPlace = function() {
                        if (enemy.length && configs.autoPlace && !instaC.ticking) {
                            if (game.tick % (Math.max(1, parseInt(getEl("autoPlaceTick").value)) || 1) === 0) {
                                if (gameObjects.length) {
                                    let near2 = {
                                        inTrap: false,
                                    };
                                    let nearTrap = gameObjects.filter(e => e.trap && e.active && e.isTeamObject(player) && UTILS.getDist(e, near, 0, 2) <= (near.scale + e.getScale() + 5)).sort(function(a, b) {
                                        return UTILS.getDist(a, near, 0, 2) - UTILS.getDist(b, near, 0, 2);
                                    })[0];
                                    if (nearTrap) {
                                        near2.inTrap = true;
                                    } else {
                                        near2.inTrap = false;
                                    }
                                    if (testMode ? enemy.length : (near.dist3 <= 450)) {
                                        if (near.dist3 <= 200) {
                                            this.testCanPlace(4, 0, (Math.PI * 2), (Math.PI / 24), near.aim2, 0, {
                                                inTrap: near2.inTrap
                                            });
                                        } else {
                                            player.items[4] == 15 && this.testCanPlace(4, 0, (Math.PI * 2), (Math.PI / 24), near.aim2);
                                        }
                                    }
                                } else {
                                    if (testMode ? enemy.length : (near.dist3 <= 450)) {
                                        player.items[4] == 15 && this.testCanPlace(4, 0, (Math.PI * 2), (Math.PI / 24), near.aim2);
                                    }
                                }
                            }
                        }
                    };*/
                    this.autoPlace = function () {
                        if (enemy.length && configs.autoPlace && !instaC.ticking) {
                            if (game.tick % (Math.max(1, parseInt(getEl("autoPlaceTick").value))||1) === 0) {
                                if (gameObjects.length) {
                                    let near2 = {
                                        inTrap: true,
                                    };
                                    let nearTrap = gameObjects.filter(e => e.trap && e.active && e.isTeamObject(player) && UTILS.getDist(e, near, 0, 2) <= (near.scale + e.getScale() + 5)).sort(function (a, b) {
                                        return UTILS.getDist(a, near, 0, 2) - UTILS.getDist(b, near, 0, 2);
                                    })[0];
                                    if (nearTrap) {
                                        near2.inTrap = true;
                                    } else {
                                        near2.inTrap = true;
                                    }
                                    if (testMode ? enemy.length : (near.dist2 <= 375)) {
                                        if (near.dist2 <= 200) {
                                            this.testCanPlace(4, 0, (Math.PI * 2), (Math.PI / 24), near.aim2, 0, {inTrap: near2.inTrap});
                                        } else {
                                            player.items[4] == 15 && this.testCanPlace(4, 0, (Math.PI * 2), (Math.PI / 24), near.aim2);
                                        }
                                    }
                                } else {
                                    if (testMode ? enemy.length : (near.dist2 <= 1000)) {
                                        player.items[4] == 15 && this.testCanPlace(4, 0, (Math.PI * 2), (Math.PI / 24), near.aim2);
                                    }
                                }
                            }
                        }
                    };
                    this.replacer = function (findObj) {
                        if (!findObj || !configs.autoReplace) return;
                        if (!inGame) return;
                        if (this.antiTrapped) return;
                        game.tickBase(() => {
                            let objAim = UTILS.getDirect(findObj, player, 0, 2);
                            let objDst = UTILS.getDist(findObj, player, 0, 2);
                            if (getEl("weaponGrind").checked && objDst <= items.weapons[player.weaponIndex].range + player.scale) return;
                            if (objDst <= 400 && near.dist2 <= 400) {
                                let danger = this.checkSpikeTick();
                                if (!danger && near.dist2 <= items.weapons[near.primaryIndex || 5].range + (near.scale * 1.8)) {
                                    //this.testCanPlace(2, -(Math.PI / 2), (Math.PI / 2), (Math.PI / 18), objAim, 1);
                                    this.testCanPlace(2, 0, (Math.PI * 2), (Math.PI / 24), objAim, 1);
                                } else {
                                    player.items[4] == 15 && this.testCanPlace(4, 0, (Math.PI * 2), (Math.PI / 24), objAim, 1);
                                }
                                this.replaced = true;
                            }
                        }, 1);
                    };
                }
            };
            /*   this.replacer = function(findObj) {
                        if (!findObj || !configs.autoReplace) return;
                        if (!inGame) return;
                        if (this.antiTrapped) return;

                        game.tickBase(() => {
                            let objAim = UTILS.getDirect(findObj, player, 0, 2);
                            let objDst = UTILS.getDist(findObj, player, 0, 2);

                            let perfectAngle = calculatePerfectAngle(findObj.x, findObj.y, player.x, player.y);

                            if (getEl("weaponGrind").checked && objDst <= items.weapons[player.weaponIndex].range + player.scale) return;

                            if (objDst <= 400 && near.dist2 <= 400) {
                                if (isObjectBroken(findObj)) {
                                    let danger = this.checkSpikeTick();
                                    if (!danger && near.dist2 <= items.weapons[near.primaryIndex || 5].range + (near.scale * 1.8)) {
                                        this.testCanPlace(2, 0, (Math.PI * 2), (Math.PI / 24), perfectAngle , 1);
                                    } else {
                                        if (player.items[4] == 15) {
                                            this.testCanPlace(4, 0, (Math.PI * 2), (Math.PI / 24), perfectAngle , 1);
                                        }
                                    }
                                    this.replaced = true;
                                }
                            }
                        }, 1);
                    }
                }
            }*/

            function calculatePerfectAngle(x1, y1, x2, y2) {
                return Math.atan2(y2 - y1, x2 - x1);
            }
            function isObjectBroken(object) {
                const healthThreshold = 20;
                return object.health < healthThreshold;
            }

            /*this.replacer = function (findObj) {
                        if (!findObj || !configs.autoReplace) return;
                        if (!inGame) return;
                        if (this.antiTrapped) return;
                        game.tickBase(() => {
                            let objAim = UTILS.getDirect(findObj, player, 0, 2);
                            let objDst = UTILS.getDist(findObj, player, 0, 2);
                            if (getEl("weaponGrind").checked && objDst <= items.weapons[player.weaponIndex].range + player.scale) return;
                            if (objDst <= 400 && near.dist2 <= 400) {
                                let danger = this.checkSpikeTick();
                                if (!danger && near.dist2 <= items.weapons[near.primaryIndex + 5].range + (near.scale * 1.8)) {
                                    //this.testCanPlace(2, -(Math.PI / 2), (Math.PI / 2), (Math.PI / 18), objAim, 1);
                                    this.testCanPlace(2, 0, (Math.PI * 2), (Math.PI / 24), objAim, 1);
                                } else {
                                    player.items[4] == 15 && this.testCanPlace(4, 0, (Math.PI * 2), (Math.PI / 24), objAim, 1);
                                }
                                this.replaced = true;
                            }
                        }, 1);
                    };
                }
            }*/

            class Instakill {
                constructor() {
                    this.wait = false;
                    this.can = false;
                    this.isTrue = false;
                    this.nobull = false;
                    this.ticking = false;
                    this.canSpikeTick = false;
                    this.startTick = false;
                    this.readyTick = false;
                    this.canCounter = false;
                    this.revTick = false;
                    this.syncHit = false;
                    this.changeType = function(type) {
                        this.wait = false;
                        this.isTrue = true;
                        my.autoAim = true;
                        let instaLog = [type];
                        let backupNobull = near.backupNobull;
                        near.backupNobull = false;
                        game.tickBase(() => {
                            instaLog.push(player.skinIndex);
                            game.tickBase(() => {
                                if (near.skinIndex == 22 && getEl("backupNobull").checked) {
                                    near.backupNobull = true;
                                }
                                instaLog.push(player.skinIndex);
                            }, 1);
                        }, 1);
                        if (type == "rev") {
                            selectWeapon(player.weapons[1]);
                            buyEquip(53, 0);
                            buyEquip(21, 1);
                            sendAutoGather();
                            game.tickBase(()=> {
                                selectWeapon(player.weapons[0]);
                                buyEquip(7, 0);
                                buyEquip(18, 1);
                                game.tickBase(()=> {
                                    sendAutoGather();
                                    this.isTrue = false;
                                    my.autoAim = false;
                                }, 1);
                            }, 1);
                        } else if (type == "nobull") {
                            selectWeapon(player.weapons[0]);
                            if (getEl("backupNobull").checked && backupNobull) {
                                buyEquip(7, 0);
                                buyEquip(18, 1);
                            } else {
                                buyEquip(6, 0);
                                buyEquip(21, 1);
                            }
                            sendAutoGather();
                            game.tickBase(() => {
                                if (near.skinIndex == 22) {
                                    if (getEl("backupNobull").checked) {
                                        near.backupNobull = true;
                                    }
                                    buyEquip(6, 0);
                                    buyEquip(21, 1);
                                } else {
                                    buyEquip(53, 0);
                                }
                                selectWeapon(player.weapons[1]);
                                buyEquip(21, 1);
                                game.tickBase(() => {
                                    sendAutoGather();
                                    this.isTrue = false;
                                    my.autoAim = false;
                                }, 1);
                            }, 1);
                        } else if (type == "normal") {
                            selectWeapon(player.weapons[0]);
                            buyEquip(7, 0);
                            buyEquip(18, 1);
                            sendAutoGather();
                            game.tickBase(() => {
                                buyEquip(player.reloads[53] == 0 ? 53 : 6, 0);
                                selectWeapon(player.weapons[1]);
                                buyEquip(21, 1);
                                game.tickBase(() => {
                                    sendAutoGather();
                                    this.isTrue = false;
                                    my.autoAim = false;
                                }, 1);
                            }, 1);
                        } else {
                            setTimeout(() => {
                                this.isTrue = false;
                                my.autoAim = false;
                            }, 50);
                        }
                    };
                    this.spikeTickType = function() {
                        this.isTrue = true;
                        my.autoAim = true;
                        selectWeapon(player.weapons[0]);
                        buyEquip(7, 0);
                        buyEquip(21, 1);
                        sendAutoGather();
                        game.tickBase(() => {
                            if (player.reloads[53] == 0 && getEl("turretCombat").checked) {
                                selectWeapon(player.weapons[0]);
                                buyEquip(53, 0);
                                buyEquip(21, 1);
                                game.tickBase(() => {
                                    sendAutoGather();
                                    this.isTrue = false;
                                    my.autoAim = false;
                                }, 1);
                            } else {
                                sendAutoGather();
                                this.isTrue = false;
                                my.autoAim = false;
                            }
                        }, 1);
                    };
                    this.counterType = function() {
                        this.isTrue = true;
                        my.autoAim = true;
                        selectWeapon(player.weapons[0]);
                        buyEquip(7, 0);
                        buyEquip(21, 1);
                        sendAutoGather();
                        game.tickBase(() => {
                            if (player.reloads[53] == 0 && getEl("turretCombat").checked) {
                                selectWeapon(player.weapons[0]);
                                buyEquip(53, 0);
                                buyEquip(21, 1);
                                game.tickBase(() => {
                                    sendAutoGather();
                                    this.isTrue = false;
                                    my.autoAim = false;
                                }, 1);
                            } else {
                                sendAutoGather();
                                this.isTrue = false;
                                my.autoAim = false;
                            }
                        }, 1);
                    };
                    this.rangeType = function(type) {
                        this.isTrue = true;
                        my.autoAim = true;
                        if (type == "ageInsta") {
                            my.ageInsta = false;
                            if (player.items[5] == 18) {
                                place(5, near.aim2);
                            }
                            packet("a", undefined, 1);
                            buyEquip(22, 0);
                            buyEquip(21, 1);
                            game.tickBase(() => {
                                selectWeapon(player.weapons[1]);
                                buyEquip(53, 0);
                                buyEquip(21, 1);
                                sendAutoGather();
                                game.tickBase(() => {
                                    sendUpgrade(12);
                                    selectWeapon(player.weapons[1]);
                                    buyEquip(53, 0);
                                    buyEquip(21, 1);
                                    game.tickBase(() => {
                                        sendUpgrade(15);
                                        selectWeapon(player.weapons[1]);
                                        buyEquip(53, 0);
                                        buyEquip(21, 1);
                                        game.tickBase(() => {
                                            sendAutoGather();
                                            this.isTrue = false;
                                            my.autoAim = false;
                                        }, 1);
                                    }, 1);
                                }, 1);
                            }, 1);
                        } else {
                            selectWeapon(player.weapons[1]);
                            if (player.reloads[53] == 0 && near.dist2 <= 700 && near.skinIndex != 22) {
                                buyEquip(53, 0);
                            } else {
                                buyEquip(20, 0);
                            }
                            buyEquip(11, 1);
                            sendAutoGather();
                            game.tickBase(() => {
                                sendAutoGather();
                                this.isTrue = false;
                                my.autoAim = false;
                            }, 1);
                        }
                    };
                    this.oneTickType = function() {
                        this.isTrue = true;
                        my.autoAim = true;
                        selectWeapon(player.weapons[1]);
                        buyEquip(53, 0);
                        buyEquip(11, 1);
                        packet("a", near.aim2, 1);
                        if (player.weapons[1] == 15) {
                            my.revAim = true;
                            sendAutoGather();
                        }
                        game.tickBase(() => {
                            my.revAim = false;
                            selectWeapon(player.weapons[0]);
                            buyEquip(7, 0);
                            buyEquip(19, 1);
                            packet("a", near.aim2, 1);
                            if (player.weapons[1] != 15) {
                                sendAutoGather();
                            }
                            game.tickBase(() => {
                                sendAutoGather();
                                this.isTrue = false;
                                my.autoAim = false;
                                packet("a", undefined, 1);
                            }, 1);
                        }, 1);
                    };
                    this.threeOneTickType = function() {
                        this.isTrue = true;
                        my.autoAim = true;
                        selectWeapon(player.weapons[[10, 14].includes(player.weapons[1]) ? 1 : 0]);
                        biomeGear();
                        buyEquip(11, 1);
                        packet("a", near.aim2, 1);
                        game.tickBase(() => {
                            selectWeapon(player.weapons[[10, 14].includes(player.weapons[1]) ? 1 : 0]);
                            buyEquip(53, 0);
                            buyEquip(11, 1);
                            packet("a", near.aim2, 1);
                            game.tickBase(() => {
                                selectWeapon(player.weapons[0]);
                                buyEquip(7, 0);
                                buyEquip(19, 1);
                                sendAutoGather();
                                packet("a", near.aim2, 1);
                                game.tickBase(() => {
                                    sendAutoGather();
                                    this.isTrue = false;
                                    my.autoAim = false;
                                    packet("a", undefined, 1);
                                }, 1);
                            }, 1);
                        }, 1);
                    };
                    this.kmTickType = function() {
                        this.isTrue = true;
                        my.autoAim = true;
                        my.revAim = true;
                        selectWeapon(player.weapons[1]);
                        buyEquip(53, 0);
                        buyEquip(11, 1);
                        sendAutoGather();
                        packet("a", near.aim2, 1);
                        game.tickBase(() => {
                            my.revAim = false;
                            selectWeapon(player.weapons[0]);
                            buyEquip(7, 0);
                            buyEquip(19, 1);
                            packet("a", near.aim2, 1);
                            game.tickBase(() => {
                                sendAutoGather();
                                this.isTrue = false;
                                my.autoAim = false;
                                packet("a", undefined, 1);
                            }, 1);
                        }, 1);
                    };
                    this.boostTickType = function() {
                        /*this.isTrue = true;
                        my.autoAim = true;
                        selectWeapon(player.weapons[0]);
                        buyEquip(53, 0);
                        buyEquip(11, 1);
                        packet("a", near.aim2);
                        game.tickBase(() => {
                            place(4, near.aim2);
                            selectWeapon(player.weapons[1]);
                            biomeGear();
                            buyEquip(11, 1);
                            sendAutoGather();
                            packet("a", near.aim2);
                            game.tickBase(() => {
                                selectWeapon(player.weapons[0]);
                                buyEquip(7, 0);
                                buyEquip(19, 1);
                                packet("a", near.aim2);
                                game.tickBase(() => {
                                    sendAutoGather();
                                    this.isTrue = false;
                                    my.autoAim = false;
                                    packet("a", undefined);
                                }, 1);
                            }, 1);
                        }, 1);*/
                        this.isTrue = true;
                        my.autoAim = true;
                        biomeGear();
                        buyEquip(11, 1);
                        packet("a", near.aim2, 1);
                        game.tickBase(() => {
                            if (player.weapons[1] == 15) {
                                my.revAim = true;
                            }
                            selectWeapon(player.weapons[[9, 12, 13, 15].includes(player.weapons[1]) ? 1 : 0]);
                            buyEquip(53, 0);
                            buyEquip(11, 1);
                            if ([9, 12, 13, 15].includes(player.weapons[1])) {
                                sendAutoGather();
                            }
                            packet("a", near.aim2, 1);
                            place(4, near.aim2);
                            game.tickBase(() => {
                                my.revAim = false;
                                selectWeapon(player.weapons[0]);
                                buyEquip(7, 0);
                                buyEquip(19, 1);
                                if (![9, 12, 13, 15].includes(player.weapons[1])) {
                                    sendAutoGather();
                                }
                                packet("a", near.aim2, 1);
                                game.tickBase(() => {
                                    sendAutoGather();
                                    this.isTrue = false;
                                    my.autoAim = false;
                                    packet("a", undefined, 1);
                                }, 1);
                            }, 1);
                        }, 1);
                    };
                    this.gotoGoal = function(goto, OT) {
                        let slowDists = (weeeee) => weeeee * config.playerScale;
                        let goal = {
                            a: goto - OT,
                            b: goto + OT,
                            c: goto - slowDists(1),
                            d: goto + slowDists(1),
                            e: goto - slowDists(2),
                            f: goto + slowDists(2),
                            g: goto - slowDists(4),
                            h: goto + slowDists(4)
                        };
                        let bQ = function(wwww, awwww) {
                            if (player.y2 >= config.mapScale / 2 - config.riverWidth / 2 && player.y2 <= config.mapScale / 2 + config.riverWidth / 2 && awwww == 0) {
                                buyEquip(31, 0);
                            } else {
                                buyEquip(wwww, awwww);
                            }
                        }
                        if (enemy.length) {
                            let dst = near.dist2;
                            this.ticking = true;
                            if (dst >= goal.a && dst <= goal.b) {
                                bQ(22, 0);
                                bQ(11, 1);
                                if (player.weaponIndex != player.weapons[[10, 14].includes(player.weapons[1]) ? 1 : 0] || player.buildIndex > -1) {
                                    selectWeapon(player.weapons[[10, 14].includes(player.weapons[1]) ? 1 : 0]);
                                }
                                return {
                                    dir: undefined,
                                    action: 1
                                };
                            } else {
                                if (dst < goal.a) {
                                    if (dst >= goal.g) {
                                        if (dst >= goal.e) {
                                            if (dst >= goal.c) {
                                                bQ(40, 0);
                                                bQ(10, 1);
                                                if (configs.slowOT) {
                                                    player.buildIndex != player.items[1] && selectToBuild(player.items[1]);
                                                } else {
                                                    if ((player.weaponIndex != player.weapons[[10, 14].includes(player.weapons[1]) ? 1 : 0]) || player.buildIndex > -1) {
                                                        selectWeapon(player.weapons[[10, 14].includes(player.weapons[1]) ? 1 : 0]);
                                                    }
                                                }
                                            } else {
                                                bQ(22, 0);
                                                bQ(19, 1);
                                                if ((player.weaponIndex != player.weapons[[10, 14].includes(player.weapons[1]) ? 1 : 0]) || player.buildIndex > -1) {
                                                    selectWeapon(player.weapons[[10, 14].includes(player.weapons[1]) ? 1 : 0]);
                                                }
                                            }
                                        } else {
                                            bQ(6, 0);
                                            bQ(12, 1);
                                            if ((player.weaponIndex != player.weapons[[10, 14].includes(player.weapons[1]) ? 1 : 0]) || player.buildIndex > -1) {
                                                selectWeapon(player.weapons[[10, 14].includes(player.weapons[1]) ? 1 : 0]);
                                            }
                                        }
                                    } else {
                                        biomeGear();
                                        bQ(11, 1);
                                        if ((player.weaponIndex != player.weapons[[10, 14].includes(player.weapons[1]) ? 1 : 0]) || player.buildIndex > -1) {
                                            selectWeapon(player.weapons[[10, 14].includes(player.weapons[1]) ? 1 : 0]);
                                        }
                                    }
                                    return {
                                        dir: near.aim2 + Math.PI,
                                        action: 0
                                    };
                                } else if (dst > goal.b) {
                                    if (dst <= goal.h) {
                                        if (dst <= goal.f) {
                                            if (dst <= goal.d) {
                                                bQ(40, 0);
                                                bQ(9, 1);
                                                if (configs.slowOT) {
                                                    player.buildIndex != player.items[1] && selectToBuild(player.items[1]);
                                                } else {
                                                    if ((player.weaponIndex != player.weapons[[10, 14].includes(player.weapons[1]) ? 1 : 0]) || player.buildIndex > -1) {
                                                        selectWeapon(player.weapons[[10, 14].includes(player.weapons[1]) ? 1 : 0]);
                                                    }
                                                }
                                            } else {
                                                bQ(22, 0);
                                                bQ(19, 1);
                                                if ((player.weaponIndex != player.weapons[[10, 14].includes(player.weapons[1]) ? 1 : 0]) || player.buildIndex > -1) {
                                                    selectWeapon(player.weapons[[10, 14].includes(player.weapons[1]) ? 1 : 0]);
                                                }
                                            }
                                        } else {
                                            bQ(6, 0);
                                            bQ(12, 1);
                                            if ((player.weaponIndex != player.weapons[[10, 14].includes(player.weapons[1]) ? 1 : 0]) || player.buildIndex > -1) {
                                                selectWeapon(player.weapons[[10, 14].includes(player.weapons[1]) ? 1 : 0]);
                                            }
                                        }
                                    } else {
                                        biomeGear();
                                        bQ(11, 1);
                                        if ((player.weaponIndex != player.weapons[[10, 14].includes(player.weapons[1]) ? 1 : 0]) || player.buildIndex > -1) {
                                            selectWeapon(player.weapons[[10, 14].includes(player.weapons[1]) ? 1 : 0]);
                                        }
                                    }
                                    return {
                                        dir: near.aim2,
                                        action: 0
                                    };
                                }
                                return {
                                    dir: undefined,
                                    action: 0
                                };
                            }
                        } else {
                            this.ticking = false;
                            return {
                                dir: undefined,
                                action: 0
                            };
                        }
                    }
                    /** wait 1 tick for better quality */
                    this.bowMovement = function() {
                        let moveMent = this.gotoGoal(685, 3);
                        if (moveMent.action) {
                            if (player.reloads[53] == 0 && !this.isTrue) {
                                this.rangeType("ageInsta");
                            } else {
                                packet("a", moveMent.dir, 1);
                            }
                        } else {
                            packet("a", moveMent.dir, 1);
                        }
                    },
                        this.tickMovement = function() {
                        let moveMent = this.gotoGoal(([10, 14].includes(player.weapons[1]) && player.y2 > config.snowBiomeTop) ? 240 : player.weapons[1] == 15 ? 250 : player.y2 <= config.snowBiomeTop ? [10, 14].includes(player.weapons[1]) ? 270 : 265 : 275, 3);
                        if (moveMent.action) {
                            if (![6, 22].includes(near.skinIndex) && player.reloads[53] == 0 && !this.isTrue) {
                                ([10, 14].includes(player.weapons[1]) && player.y2 > config.snowBiomeTop) || (player.weapons[1] == 15) ? this.oneTickType(): this.threeOneTickType();
                            } else {
                                packet("a", moveMent.dir, 1);
                            }
                        } else {
                            packet("a", moveMent.dir, 1);
                        }
                    },
                        this.kmTickMovement = function() {
                        let moveMent = this.gotoGoal(240, 3);
                        if (moveMent.action) {
                            if (near.skinIndex != 22 && player.reloads[53] == 0 && !this.isTrue && ((game.tick - near.poisonTick) % config.serverUpdateRate == 8)) {
                                this.kmTickType();
                            } else {
                                packet("a", moveMent.dir, 1);
                            }
                        } else {
                            packet("a", moveMent.dir, 1);
                        }
                    },
                        this.boostTickMovement = function() {
                        let dist = player.weapons[1] == 9 ? 365 : player.weapons[1] == 12 ? 380 : player.weapons[1] == 13 ? 390 : player.weapons[1] == 15 ? 365 : 370;
                        let actionDist = player.weapons[1] == 9 ? 2 : player.weapons[1] == 12 ? 1.5 : player.weapons[1] == 13 ? 1.5 : player.weapons[1] == 15 ? 2 : 3;
                        let moveMent = this.gotoGoal(dist, actionDist);
                        if (moveMent.action) {
                            if (player.reloads[53] == 0 && !this.isTrue) {
                                this.boostTickType();
                            } else {
                                packet("a", moveMent.dir, 1);
                            }
                        } else {
                            packet("a", moveMent.dir, 1);
                        }
                    }
                    /** wait 1 tick for better quality */
                    this.perfCheck = function(pl, nr) {
                        if (nr.weaponIndex == 11 && UTILS.getAngleDist(nr.aim2 + Math.PI, nr.d2) <= config.shieldAngle) return false;
                        if (![9, 12, 13, 15].includes(player.weapons[1])) return true;
                        let pjs = {
                            x: nr.x2 + (70 * Math.cos(nr.aim2 + Math.PI)),
                            y: nr.y2 + (70 * Math.sin(nr.aim2 + Math.PI))
                        };
                        if (UTILS.lineInRect(pl.x2 - pl.scale, pl.y2 - pl.scale, pl.x2 + pl.scale, pl.y2 + pl.scale, pjs.x, pjs.y, pjs.x, pjs.y)) {
                            return true;
                        }
                        let finds = ais.filter(tmp => tmp.visible).find((tmp) => {
                            if (UTILS.lineInRect(tmp.x2 - tmp.scale, tmp.y2 - tmp.scale, tmp.x2 + tmp.scale, tmp.y2 + tmp.scale, pjs.x, pjs.y, pjs.x, pjs.y)) {
                                return true;
                            }
                        });
                        if (finds) return false;
                        finds = gameObjects.filter(tmp => tmp.active).find((tmp) => {
                            let tmpScale = tmp.getScale();
                            if (!tmp.ignoreCollision && UTILS.lineInRect(tmp.x - tmpScale, tmp.y - tmpScale, tmp.x + tmpScale, tmp.y + tmpScale, pjs.x, pjs.y, pjs.x, pjs.y)) {
                                return true;
                            }
                        });
                        if (finds) return false;
                        return true;
                    }
                }
            };

            class Autobuy {
                constructor(buyHat, buyAcc) {
                    this.hat = function() {
                        buyHat.forEach((id) => {
                            let find = findID(hats, id);
                            if (find && !player.skins[id] && player.points >= find.price) packet("c", 1, id, 0);
                        });
                    };
                    this.acc = function() {
                        buyAcc.forEach((id) => {
                            let find = findID(accessories, id);
                            if (find && !player.tails[id] && player.points >= find.price) packet("c", 1, id, 1);
                        });
                    };
                }
            };

            class Autoupgrade {
                constructor() {
                    this.sb = function(upg) {
                        upg(3);
                        upg(17);
                        upg(31);
                        upg(23);
                        upg(9);
                        upg(38);
                    };
                    this.kh = function(upg) {
                        upg(3);
                        upg(17);
                        upg(31);
                        upg(23);
                        upg(10);
                        upg(38);
                        upg(4);
                        upg(25);
                    };
                    this.pb = function(upg) {
                        upg(5);
                        upg(17);
                        upg(32);
                        upg(23);
                        upg(9);
                        upg(38);
                    };
                    this.ph = function(upg) {
                        upg(5);
                        upg(17);
                        upg(32);
                        upg(23);
                        upg(10);
                        upg(38);
                        upg(28);
                        upg(25);
                    };
                    this.db = function(upg) {
                        upg(7);
                        upg(17);
                        upg(31);
                        upg(23);
                        upg(9);
                        upg(34);
                    };
                    /* old functions */
                    this.km = function(upg) {
                        upg(7);
                        upg(17);
                        upg(31);
                        upg(23);
                        upg(10);
                        upg(38);
                        upg(4);
                        upg(15);
                    };
                };
            };

            class Damages {
                constructor(items) {
                    // 0.75 1 1.125 1.5
                    this.calcDmg = function(dmg, val) {
                        return dmg * val;
                    };
                    this.getAllDamage = function(dmg) {
                        return [this.calcDmg(dmg, 0.75), dmg, this.calcDmg(dmg, 1.125), this.calcDmg(dmg, 1.5)];
                    };
                    this.weapons = [];
                    for (let i = 0; i < items.weapons.length; i++) {
                        let wp = items.weapons[i];
                        let name = wp.name.split(" ").length <= 1 ? wp.name : (wp.name.split(" ")[0] + "_" + wp.name.split(" ")[1]);
                        this.weapons.push(this.getAllDamage(i > 8 ? wp.Pdmg : wp.dmg));
                        this[name] = this.weapons[i];
                    }
                }
            }

            /** CLASS CODES */
            // jumpscare code warn
            let tmpList = [];

            // LOADING:
            let UTILS = new Utils();
            let items = new Items();
            let objectManager = new Objectmanager(GameObject, gameObjects, UTILS, config);
            let store = new Store();
            let hats = store.hats;
            let accessories = store.accessories;
            let projectileManager = new ProjectileManager(Projectile, projectiles, players, ais, objectManager, items, config, UTILS);
            let aiManager = new AiManager(ais, AI, players, items, null, config, UTILS);
            let chatTimeouts = [], oldChatter = [], chatter = [], startedDate = Date.now()
            let textManager = new Textmanager();
            let autochats = new autoChatExport;
            function AC(name) {
                if (autochats[name].audio.paused) {
                    startedDate = Date.now();
                    if (autochats.current == name && oldChatter.length > 0) {
                        chatter = oldChatter;
                    } else {
                        autochats[name].audio.currentTime = 0;
                        chatter = Array.from(autochats[name].chats);
                    }
                    autochats.current = name;
                    autochats[name].audio.play();

                    chatter.forEach((a, i) => {
                        chatTimeouts.push(setTimeout(() => {
                            chatter.splice(0, 1);
                            a[0] = a[0].replaceAll("’", "'");
                            io.send("6", a[0]);
                            if (chatter.length == 0) {
                                chatter = Array.from(autochats[name].chats);
                            }
                        }, a[1]));
                    });
                } else {
                    autochats[autochats.current].audio.pause();
                    // Calculate the remaining time for each chat and store in oldChatter
                    oldChatter = chatter.map(e => [e[0], e[1] - (Date.now() - startedDate)]);
                    chatTimeouts.forEach(e => clearTimeout(e));
                }
            }
            let traps = new Traps(UTILS, items);
            let instaC = new Instakill();
            let autoBuy = new Autobuy([15, 31, 6, 7, 22, 12, 53, 20, 40], [11, 13, 19, 18, 21]);
            let autoUpgrade = new Autoupgrade();

            let lastDeath;
            let minimapData;
            let mapMarker = {};
            let mapPings = [];
            let tmpPing;

            let breakTrackers = [];

            let pathFindTest = 0;
            let grid = [];
            let pathFind = {
                active: false,
                grid: 40,
                scale: 1440,
                x: 14400,
                y: 14400,
                chaseNear: false,
                array: [],
                lastX: this.grid / 2,
                lastY: this.grid / 2
            };

            function sendChat(message) {
                packet("6", message.slice(0, 30));
            }

            let runAtNextTick = [];

            function checkProjectileHolder(x, y, dir, range, speed, indx, layer, sid) {
                let weaponIndx = indx == 0 ? 9 : indx == 2 ? 12 : indx == 3 ? 13 : indx == 5 && 15;
                let projOffset = config.playerScale * 2;
                let projXY = {
                    x: indx == 1 ? x : x - projOffset * Math.cos(dir),
                    y: indx == 1 ? y : y - projOffset * Math.sin(dir),
                };
                let nearPlayer = players.filter((e) => e.visible && UTILS.getDist(projXY, e, 0, 2) <= e.scale).sort(function(a, b) {
                    return UTILS.getDist(projXY, a, 0, 2) - UTILS.getDist(projXY, b, 0, 2);
                })[0];
                if (nearPlayer) {
                    if (indx == 1) {
                        nearPlayer.shooting[53] = 1;
                    } else {
                        nearPlayer.shootIndex = weaponIndx;
                        nearPlayer.shooting[1] = 1;
                        antiProj(nearPlayer, dir, range, speed, indx, weaponIndx);
                    }
                }
            }
            let projectileCount = 0;

            function antiProj(tmpObj, dir, range, speed, index, weaponIndex) {
                if (!tmpObj.isTeam(player)) {
                    tmpDir = UTILS.getDirect(player, tmpObj, 2, 2);
                    if (UTILS.getAngleDist(tmpDir, dir) <= 0.2) {
                        tmpObj.bowThreat[weaponIndex]++;
                        if (index == 5) {
                            projectileCount++;
                        }
                        setTimeout(() => {
                            tmpObj.bowThreat[weaponIndex]--;
                            if (index == 5) {
                                projectileCount--;
                            }
                        }, range / speed);
                        if (tmpObj.bowThreat[9] >= 1 && (tmpObj.bowThreat[12] >= 1 || tmpObj.bowThreat[15] >= 1)) {
                            place(1, tmpObj.aim2);
                            my.anti0Tick = 4;
                            if (!my.antiSync) {
                                antiSyncHealing(4);
                            }
                        } else {
                            if (projectileCount >= 2) {
                                place(1, tmpObj.aim2);
                                my.anti0Tick = 4;
                                if (!my.antiSync) {
                                    antiSyncHealing(4);
                                }
                            }
                        }
                    }
                }
            }

            // SHOW ITEM INFO:
            function showItemInfo(item, isWeapon, isStoreItem) {
                if (player && item) {
                    UTILS.removeAllChildren(itemInfoHolder);
                    itemInfoHolder.classList.add("visible");
                    UTILS.generateElement({
                        id: "itemInfoName",
                        text: UTILS.capitalizeFirst(item.name),
                        parent: itemInfoHolder
                    });
                    UTILS.generateElement({
                        id: "itemInfoDesc",
                        text: item.desc,
                        parent: itemInfoHolder
                    });
                    if (isStoreItem) {

                    } else if (isWeapon) {
                        UTILS.generateElement({
                            class: "itemInfoReq",
                            text: !item.type ? "primary" : "secondary",
                            parent: itemInfoHolder
                        });
                    } else {
                        for (let i = 0; i < item.req.length; i += 2) {
                            UTILS.generateElement({
                                class: "itemInfoReq",
                                html: item.req[i] + "<span class='itemInfoReqVal'> x" + item.req[i + 1] + "</span>",
                                parent: itemInfoHolder
                            });
                        }
                        if (item.group.limit) {
                            UTILS.generateElement({
                                class: "itemInfoLmt",
                                text: (player.itemCounts[item.group.id] || 0) + "/" + (config.isSandbox ? 99 : item.group.limit),
                                parent: itemInfoHolder
                            });
                        }
                    }
                } else {
                    itemInfoHolder.classList.remove("visible");
                }
            }

            // RESIZE:
            window.addEventListener("resize", UTILS.checkTrusted(resize));

            function resize() {
                screenWidth = window.innerWidth;
                screenHeight = window.innerHeight;
                let scaleFillNative = Math.max(screenWidth / maxScreenWidth, screenHeight / maxScreenHeight) * pixelDensity;
                gameCanvas.width = screenWidth * pixelDensity;
                gameCanvas.height = screenHeight * pixelDensity;
                gameCanvas.style.width = screenWidth + "px";
                gameCanvas.style.height = screenHeight + "px";
                mainContext.setTransform(
                    scaleFillNative, 0,
                    0, scaleFillNative,
                    (screenWidth * pixelDensity - (maxScreenWidth * scaleFillNative)) / 2,
                    (screenHeight * pixelDensity - (maxScreenHeight * scaleFillNative)) / 2
                );
            }
            resize();

            // MOUSE INPUT:
            const mals = document.getElementById('touch-controls-fullscreen');
            mals.style.display = 'block';
            mals.addEventListener("mousemove", gameInput, false);

            function gameInput(e) {
                mouseX = e.clientX;
                mouseY = e.clientY;
            }
            let clicks = {
                left: false,
                middle: false,
                right: false,
            };
            mals.addEventListener("mousedown", mouseDown, false);

            function mouseDown(e) {
                if (attackState != 1) {
                    attackState = 1;
                    if (e.button == 0) {
                        clicks.left = true;
                    } else if (e.button == 1) {
                        clicks.middle = true;
                    } else if (e.button == 2) {
                        clicks.right = true;
                    }
                }
            }
            mals.addEventListener("mouseup", UTILS.checkTrusted(mouseUp));

            function mouseUp(e) {
                if (attackState != 0) {
                    attackState = 0;
                    if (e.button == 0) {
                        clicks.left = false;
                    } else if (e.button == 1) {
                        clicks.middle = false;
                    } else if (e.button == 2) {
                        clicks.right = false;
                    }
                }
            }
            mals.addEventListener("wheel", wheel, false);

            function wheel(e) {
                if (e.deltaY < 0) {
                    my.reSync = true;
                } else {
                    my.reSync = false;
                }
            }

            // INPUT UTILS:
            function getMoveDir() {
                let dx = 0;
                let dy = 0;
                for (let key in moveKeys) {
                    let tmpDir = moveKeys[key];
                    dx += !!keys[key] * tmpDir[0];
                    dy += !!keys[key] * tmpDir[1];
                }
                return dx == 0 && dy == 0 ? undefined : Math.atan2(dy, dx);
            }

            function getSafeDir() {
                if (!player)
                    return 0;
                if (!player.lockDir) {
                    lastDir = Math.atan2(mouseY - (screenHeight / 2), mouseX - (screenWidth / 2));
                }
                return lastDir || 0;
            }

            function getAttackDir(debug) {
                if (debug) {
                    if (!player)
                        return "0";
                    if (my.autoAim || ((clicks.left || (useWasd && near.dist2 <= items.weapons[player.weapons[0]].range + near.scale * 1.8 && !traps.inTrap)) && player.reloads[player.weapons[0]] == 0))
                        lastDir = getEl("weaponGrind").checked ? "getSafeDir()" : enemy.length ? my.revAim ? "(near.aim2 + Math.PI)" : "near.aim2" : "getSafeDir()";
                    else
                        if (clicks.right && player.reloads[player.weapons[1] == 10 ? player.weapons[1] : player.weapons[0]] == 0)
                            lastDir = "getSafeDir()";
                    else
                        if (traps.inTrap && player.reloads[traps.notFast() ? player.weapons[1] : player.weapons[0]] == 0)
                            lastDir = "traps.aim";
                    else
                        if (!player.lockDir) {
                            if (configs.noDir) return "undefined";
                            lastDir = "getSafeDir()";
                        }
                    return lastDir;
                } else {
                    if (!player)
                        return 0;
                    if (my.autoAim || ((clicks.left || (useWasd && near.dist2 <= items.weapons[player.weapons[0]].range + near.scale * 1.8 && !traps.inTrap)) && player.reloads[player.weapons[0]] == 0))
                        lastDir = getEl("weaponGrind").checked ? getSafeDir() : enemy.length ? my.revAim ? (near.aim2 + Math.PI) : near.aim2 : getSafeDir();
                    else
                        if (clicks.right && player.reloads[player.weapons[1] == 10 ? player.weapons[1] : player.weapons[0]] == 0)
                            lastDir = getSafeDir();
                    else
                        if (traps.inTrap && player.reloads[traps.notFast() ? player.weapons[1] : player.weapons[0]] == 0)
                            lastDir = traps.aim;
                    else
                        if (!player.lockDir) {
                            if (configs.noDir) return undefined;
                            lastDir = getSafeDir();
                        }
                    return lastDir || 0;
                }
            }

            function getVisualDir() {
                if (!player)
                    return 0;
                if (my.autoAim || ((clicks.left || (useWasd && near.dist2 <= items.weapons[player.weapons[0]].range + near.scale * 1.8 && !traps.inTrap)) && player.reloads[player.weapons[0]] == 0))
                    lastDir = getEl("weaponGrind").checked ? getSafeDir() : enemy.length ? my.revAim ? (near.aim2 + Math.PI) : near.aim2 : getSafeDir();
                else
                    if (clicks.right && player.reloads[player.weapons[1] == 10 ? player.weapons[1] : player.weapons[0]] == 0)
                        lastDir = getSafeDir();
                else
                    if (traps.inTrap && player.reloads[traps.notFast() ? player.weapons[1] : player.weapons[0]] == 0)
                        lastDir = traps.aim;
                else
                    if (!player.lockDir) {
                        lastDir = getSafeDir();
                    }
                return lastDir || 0;
            }

            // KEYS:
            function keysActive() {
                return (allianceMenu.style.display != "block" &&
                        chatHolder.style.display != "block" &&
                        !menuCBFocus);
            }

            function toggleMenuChat() {
                // Always set display property for both elements to "block"
                chatHolder.style.display = "none";
                menuDiv.style.display = "block";

                // Rest of your logic here...
                if (menuChatDiv.style.display != "none") {
                    if (menuChatBox.value != "") {
                        let cmd = function(command) {
                            return {
                                found: command.startsWith("/") && commands[command.slice(1).split(" ")[0]],
                                fv: commands[command.slice(1).split(" ")[0]]
                            }
                        }
                        let command = cmd(menuChatBox.value);
                        if (command.found) {
                            if (typeof command.fv.action === "function") {
                                command.fv.action(menuChatBox.value);
                            }
                        } else {
                            sendChat(menuChatBox.value);
                        }
                        menuChatBox.value = "";
                        menuChatBox.blur();
                    } else {
                        if (menuCBFocus) {
                            menuChatBox.blur();
                        } else {
                            menuChatBox.focus();
                        }
                    }
                }
            }





            function keyDown(event) {
                let keyNum = event.which || event.keyCode || 0;
                if (player && player.alive && keysActive()) {
                    if (!keys[keyNum]) {
                        keys[keyNum] = 1;
                        macro[event.key] = 1;
                        if (keyNum == 27) {
                            openMenu = !openMenu;
                            $("#menuDiv").toggle();
                            $("#menuChatDiv").toggle();
                        } else if (keyNum == 69) {
                            sendAutoGather();
                        } else if (keyNum == 67) {
                            updateMapMarker();
                        } else if (player.weapons[keyNum - 49] != undefined) {
                            player.weaponCode = player.weapons[keyNum - 49];
                        } else if (moveKeys[keyNum]) {
                            sendMoveDir();
                        } else if (event.key == "m") {
                            mills.placeSpawnPads = !mills.placeSpawnPads;
                        } else if (keyNum == 85) {
                            packet("6", 'ml. 324/3%3|2');
                        } else if (event.key == "z") {
                            mills.place = !mills.place;
                        } else if (event.key == "Z") {
                            typeof window.debug == "function" && window.debug();
                        } else if (keyNum == 32) {
                            packet("d", 1, getSafeDir(), 1);
                            packet("d", 0, getSafeDir(), 1);
                        } else if (event.key == ",") {
                            player.sync = true;
                        }
                    }
                }
            }
            addEventListener("keydown", UTILS.checkTrusted(keyDown));

            function keyUp(event) {
                if (player && player.alive) {
                    let keyNum = event.which || event.keyCode || 0;
                    if (keyNum == 13) {
                        toggleMenuChat();
                    } else if (keysActive()) {
                        if (keys[keyNum]) {
                            keys[keyNum] = 0;
                            macro[event.key] = 0;
                            if (moveKeys[keyNum]) {
                                sendMoveDir();
                            } else if (event.key == ",") {
                                player.sync = false;
                            } else if (event.key == "x") {
                                AC(document.getElementById("autochats").value);
                            }
                        }
                    }
                }
            }
            window.addEventListener("keyup", UTILS.checkTrusted(keyUp));

            function sendMoveDir() {
                let newMoveDir = getMoveDir();
                if (lastMoveDir == undefined || newMoveDir == undefined || Math.abs(newMoveDir - lastMoveDir) > 0.3) {
                    if (!my.autoPush) {
                        packet("a", newMoveDir, 1);
                    }
                    lastMoveDir = newMoveDir;
                }
            }

            // BUTTON EVENTS:
            function bindEvents() {}
            bindEvents();

            /** PATHFIND TEST */
            function chechPathColl(tmp) {
                return ((player.scale + tmp.getScale()) / (player.maxSpeed * items.weapons[player.weaponIndex].spdMult)) + (tmp.dmg && !tmp.isTeamObject(player) ? 35 : 0);
                return tmp.colDiv == 0.5 ? (tmp.scale * tmp.colDiv) :
                    !tmp.isTeamObject(player) && tmp.dmg ? (tmp.scale + player.scale) :
                tmp.isTeamObject(player) && tmp.trap ? 0 : tmp.scale;
            }

            function checkObject() {
                let checkColl = gameObjects.filter(tmp => player.canSee(tmp) && tmp.active);
                for (let y = 0; y < pathFind.grid; y++) {
                    grid[y] = [];
                    for (let x = 0; x < pathFind.grid; x++) {
                        let tmpXY = {
                            x: (player.x2 - (pathFind.scale / 2)) + ((pathFind.scale / pathFind.grid) * x),
                            y: (player.y2 - (pathFind.scale / 2)) + ((pathFind.scale / pathFind.grid) * y)
                        }
                        if (UTILS.getDist(pathFind.chaseNear ? near : pathFind, tmpXY, pathFind.chaseNear ? 2 : 0, 0) <= (pathFind.chaseNear ? 35 : 60)) {
                            pathFind.lastX = x;
                            pathFind.lastY = y;
                            grid[y][x] = 0;
                            continue;
                        }
                        let find = checkColl.find(tmp => UTILS.getDist(tmp, tmpXY, 0, 0) <= chechPathColl(tmp));
                        if (find) {
                            if (find.trap) {
                                grid[y][x] = 0;
                                continue;
                            }
                            grid[y][x] = 1;
                        } else {
                            grid[y][x] = 0;
                        }
                    }
                }
            }

            function createPath() {
                grid = [];
                checkObject();
            }

            function Pathfinder() {
                pathFind.scale = (config.maxScreenWidth / 2) * 1.3;
                if (!traps.inTrap && (pathFind.chaseNear ? enemy.length : true)) {
                    if (near.dist2 <= items.weapons[player.weapons[0]].range) {
                        packet("a", undefined, 1);
                    } else {
                        createPath();
                        easystar.setGrid(grid);
                        easystar.setAcceptableTiles([0]);
                        easystar.enableDiagonals();
                        easystar.findPath((grid[0].length / 2), (grid.length / 2), pathFind.lastX, pathFind.lastY, function(path) {
                            if (path === null) {
                                pathFind.array = [];
                                if (near.dist2 <= items.weapons[player.weapons[0]].range) {
                                    packet("a", undefined, 1);
                                } else {
                                    packet("a", near.aim2, 1);
                                }
                            } else {
                                pathFind.array = path;
                                if (pathFind.array.length > 1) {
                                    let tmpXY = {
                                        x: (player.x2 - (pathFind.scale / 2)) + ((pathFind.scale / pathFind.grid) * path[1].x),
                                        y: (player.y2 - (pathFind.scale / 2)) + ((pathFind.scale / pathFind.grid) * path[1].y)
                                    }
                                    packet("a", UTILS.getDirect(tmpXY, player, 0, 2), 1);
                                }
                            }
                        });
                        easystar.calculate();
                    }
                }
            }
            /** PATHFIND TEST */

            // ITEM COUNT DISPLAY:
            let isItemSetted = [];

            function updateItemCountDisplay(index = undefined) {
                for (let i = 3; i < items.list.length; ++i) {
                    let id = items.list[i].group.id;
                    let tmpI = items.weapons.length + i;
                    if (!isItemSetted[tmpI]) {
                        isItemSetted[tmpI] = document.createElement("div");
                        isItemSetted[tmpI].id = "itemCount" + tmpI;
                        getEl("actionBarItem" + tmpI).appendChild(isItemSetted[tmpI]);
                        isItemSetted[tmpI].style = `
                        display: block;
                        position: absolute;
                        padding-left: 5px;
                        font-size: 2em;
                        color: #fff;
                        `;
                        isItemSetted[tmpI].innerHTML = player.itemCounts[id] || 0;
                    } else {
                        if (index == id) isItemSetted[tmpI].innerHTML = player.itemCounts[index] || 0;
                    }
                }
            }

            // AUTOPUSH:
            function autoPush() {
                let nearTrap = gameObjects.filter(tmp => tmp.trap && tmp.active && tmp.isTeamObject(player) && UTILS.getDist(tmp, near, 0, 2) <= (near.scale + tmp.getScale() + 5)).sort(function(a, b) {
                    return UTILS.getDist(a, near, 0, 2) - UTILS.getDist(b, near, 0, 2);
                })[0];
                if (nearTrap) {
                    let spike = gameObjects.filter(tmp => tmp.dmg && tmp.active && tmp.isTeamObject(player) && UTILS.getDist(tmp, nearTrap, 0, 0) <= (near.scale + nearTrap.scale + tmp.scale)).sort(function(a, b) {
                        return UTILS.getDist(a, near, 0, 2) - UTILS.getDist(b, near, 0, 2);
                    })[0];
                    if (spike) {
                        let pos = {
                            x: spike.x + (250 * Math.cos(UTILS.getDirect(near, spike, 2, 0))),
                            y: spike.y + (250 * Math.sin(UTILS.getDirect(near, spike, 2, 0))),
                            x2: spike.x + ((UTILS.getDist(near, spike, 2, 0) + player.scale) * Math.cos(UTILS.getDirect(near, spike, 2, 0))),
                            y2: spike.y + ((UTILS.getDist(near, spike, 2, 0) + player.scale) * Math.sin(UTILS.getDirect(near, spike, 2, 0)))
                        };
                        let finds = gameObjects.filter(tmp => tmp.active).find((tmp) => {
                            let tmpScale = tmp.getScale();
                            if (!tmp.ignoreCollision && UTILS.lineInRect(tmp.x - tmpScale, tmp.y - tmpScale, tmp.x + tmpScale, tmp.y + tmpScale, player.x2, player.y2, pos.x2, pos.y2)) {
                                return true;
                            }
                        });
                        if (finds) {
                            if (my.autoPush) {
                                my.autoPush = false;
                                packet("a", lastMoveDir || undefined, 1);
                            }
                        } else {
                            my.autoPush = true;
                            my.pushData = {
                                x: spike.x,
                                y: spike.y,
                                x2: pos.x2,
                                y2: pos.y2
                            };
                            let scale = (player.scale / 10);
                            if (UTILS.lineInRect(player.x2 - scale, player.y2 - scale, player.x2 + scale, player.y2 + scale, near.x2, near.y2, pos.x, pos.y)) {
                                packet("a", near.aim2, 1);
                            } else {
                                packet("a", UTILS.getDirect(pos, player, 2, 2), 1);
                            }
                        }
                    } else {
                        if (my.autoPush) {
                            my.autoPush = false;
                            packet("a", lastMoveDir || undefined, 1);
                        }
                    }
                } else {
                    if (my.autoPush) {
                        my.autoPush = false;
                        packet("a", lastMoveDir || undefined, 1);
                    }
                }
            }

            // ADD DEAD PLAYER:
            function addDeadPlayer(tmpObj) {
                deadPlayers.push(new DeadPlayer(tmpObj.x, tmpObj.y, tmpObj.dir, tmpObj.buildIndex, tmpObj.weaponIndex, tmpObj.weaponVariant, tmpObj.skinColor, tmpObj.scale, tmpObj.name));
            }

            /** APPLY SOCKET CODES */

            // SET INIT DATA:
            function setInitData(data) {
                alliances = data.teams;
            }

            // SETUP GAME:
            function setupGame(yourSID) {
                keys = {};
                macro = {};
                playerSID = yourSID;
                attackState = 0;
                inGame = true;
                packet("d", 0, getAttackDir(), 1);
                my.ageInsta = true;
                if (firstSetup) {
                    firstSetup = false;
                    gameObjects.length = 0;
                }
            }

            // ADD NEW PLAYER:
            function addPlayer(data, isYou) {
                let tmpPlayer = findPlayerByID(data[0]);
                if (!tmpPlayer) {
                    tmpPlayer = new Player(data[0], data[1], config, UTILS, projectileManager,
                                           objectManager, players, ais, items, hats, accessories);
                    players.push(tmpPlayer);
                    if (data[1] != playerSID) {
                        //addMenuChText("Game", `Found ${data[2]} {${data[1]}}`, "yellow");
                    }
                } else {
                    if (data[1] != playerSID) {
                        // addMenuChText("Game", `Encount ${data[2]} {${data[1]}}`, "yellow");
                    }
                }
                tmpPlayer.spawn(isYou ? true : null);
                tmpPlayer.visible = false;
                tmpPlayer.oldPos = {
                    x2: undefined,
                    y2: undefined
                };
                tmpPlayer.x2 = undefined;
                tmpPlayer.y2 = undefined;
                tmpPlayer.x3 = undefined;
                tmpPlayer.y3 = undefined;
                tmpPlayer.setData(data);
                if (isYou) {
                    if (!player) {
                        window.prepareUI(tmpPlayer);
                    }
                    player = tmpPlayer;
                    camX = player.x;
                    camY = player.y;
                    my.lastDir = 0;
                    updateItems();
                    updateAge();
                    updateItemCountDisplay();
                    for (let i = 0; i < 5; i++) {
                        petals.push(new Petal(player.x, player.y));
                    }
                    if (player.skins[7]) {
                        my.reSync = true;
                    }
                }
            }

            // REMOVE PLAYER:
            function removePlayer(id) {
                for (let i = 0; i < players.length; i++) {
                    if (players[i].id == id) {
                        //  addMenuChText("Game", players[i].name + " left the game", "yellow");
                        players.splice(i, 1);
                        break;
                    }
                }
            }

            // UPDATE HEALTH:
            function updateHealth(sid, value) {
                tmpObj = findPlayerBySID(sid);
                if (tmpObj) {
                    tmpObj.oldHealth = tmpObj.health;
                    tmpObj.health = value;
                    tmpObj.judgeShame();
                    if (tmpObj.oldHealth > tmpObj.health) {
                        tmpObj.damaged = tmpObj.oldHealth - tmpObj.health;
                        advHeal.push([sid, value, tmpObj.damaged]);
                    } else {}
                    if (tmpObj.health <= 0) {
                        /*bots.forEach((hmm) => {
                            hmm.whyDie = tmpObj.name;
                        });*/
                    }
                }
            }

            // KILL PLAYER:
            function killPlayer() {
                petals = [];
                inGame = false;
                lastDeath = {
                    x: player.x,
                    y: player.y,
                };
                /*menuCardHolder.style.display = "block";
                mainMenu.style.display = "block";
                diedText.style.display = "none";*/
                if (configs.autoRespawn) {
                    getEl("ot-sdk-btn-floating").style.display = "none";
                    packet("M", {
                        name: lastsp[0],
                        moofoll: lastsp[1],
                        skin: lastsp[2]
                    });
                }
            }

            // UPDATE PLAYER ITEM VALUES:
            function updateItemCounts(index, value) {
                if (player) {
                    player.itemCounts[index] = value;
                    updateItemCountDisplay(index);
                }
            }

            // UPDATE AGE:
            function updateAge(xp, mxp, age) {
                if (xp != undefined)
                    player.XP = xp;
                if (mxp != undefined)
                    player.maxXP = mxp;
                if (age != undefined)
                    player.age = age;
            }

            // UPDATE UPGRADES:
            function updateUpgrades(points, age) {
                player.upgradePoints = points;
                player.upgrAge = age;
                if (points > 0) {
                    tmpList.length = 0;
                    UTILS.removeAllChildren(upgradeHolder);
                    for (let i = 0; i < items.weapons.length; ++i) {
                        if (items.weapons[i].age == age && (testMode || items.weapons[i].pre == undefined || player.weapons.indexOf(items.weapons[i].pre) >= 0)) {
                            let e = UTILS.generateElement({
                                id: "upgradeItem" + i,
                                class: "actionBarItem",
                                onmouseout: function() {
                                    showItemInfo();
                                },
                                parent: upgradeHolder
                            });
                            e.style.backgroundImage = getEl("actionBarItem" + i).style.backgroundImage;
                            tmpList.push(i);
                        }
                    }
                    for (let i = 0; i < items.list.length; ++i) {
                        if (items.list[i].age == age && (testMode || items.list[i].pre == undefined || player.items.indexOf(items.list[i].pre) >= 0)) {
                            let tmpI = (items.weapons.length + i);
                            let e = UTILS.generateElement({
                                id: "upgradeItem" + tmpI,
                                class: "actionBarItem",
                                onmouseout: function() {
                                    showItemInfo();
                                },
                                parent: upgradeHolder
                            });
                            e.style.backgroundImage = getEl("actionBarItem" + tmpI).style.backgroundImage;
                            tmpList.push(tmpI);
                        }
                    }
                    for (let i = 0; i < tmpList.length; i++) {
                        (function(i) {
                            let tmpItem = getEl('upgradeItem' + i);
                            tmpItem.onmouseover = function() {
                                if (items.weapons[i]) {
                                    showItemInfo(items.weapons[i], true);
                                } else {
                                    showItemInfo(items.list[i - items.weapons.length]);
                                }
                            };
                            tmpItem.onclick = UTILS.checkTrusted(function() {
                                packet("H", i);
                            });
                            UTILS.hookTouchEvents(tmpItem);
                        })(tmpList[i]);
                    }
                    if (tmpList.length) {
                        upgradeHolder.style.display = "block";
                        upgradeCounter.style.display = "block";
                        upgradeCounter.innerHTML = "SELECT ITEMS (" + points + ")";
                    } else {
                        upgradeHolder.style.display = "none";
                        upgradeCounter.style.display = "none";
                        showItemInfo();
                    }
                } else {
                    upgradeHolder.style.display = "none";
                    upgradeCounter.style.display = "none";
                    showItemInfo();
                }
            }
            function getDist(e, t) {
                try {
                    return Math.hypot((t.y2 || t.y) - (e.y2 || e.y), (t.x2 || t.x) - (e.x2 || e.x));
                } catch (e) {
                    return Infinity;
                }
            }
            function cdf(e, t) {
                try {
                    return Math.hypot((t.y2 || t.y) - (e.y2 || e.y), (t.x2 || t.x) - (e.x2 || e.x));
                } catch (e) {
                    return Infinity;
                }
            }
            function caf(e, t) {
                try {
                    return Math.atan2((t.y2 || t.y) - (e.y2 || e.y), (t.x2 || t.x) - (e.x2 || e.x));
                } catch (e) {
                    return 0;
                }
            }
            // KILL OBJECT:
            function killObject(sid) {
                let findObj = findObjectBySid(sid);
                objectManager.disableBySid(sid);
                let n = findObj;
                if (nears.length) {
                    let enemy = near;
                    let A = player;
                    let dist = cdf(A, enemy);
                    let dir = caf(A, enemy);
                    //code of bianos
                    let objAim = Math.atan2(findObj.y-player.y2, findObj.x-player.x2);
                    let objDist = Math.hypot(findObj.y-player.y2, findObj.x-player.x2);
                    //
                    let ignore = [0, 0];
                    let place = function(t, f) {
                        checkPlace(t, f);
                    }
                    if (objDist <= 200 && getDist(player, tmpObj) <= 168 && tmpObj != player && player.reloads[player.weapons[0]] == 0) {
                        // BianosTick
                        bianosSpTick();
                    }
                    if (player.alive) {
                        // REPLACER:
                        if (configs.autoReplace && objDist <= 400) {

                            if (near.dist2 <= 250) {
                                let tmpCount = -1;
                                for (let i = 0; i < Math.PI*8; i+= Math.PI/1) {
                                    tmpCount++
                                    if (tmpCount == 1 && objDist <= 200) {
                                        place(2, objAim);
                                        place(2, objAim + Math.PI);
                                    } else {
                                        checkPlace(2, objAim+i);
                                    }
                                }
                            } else if (near.dist2 > 250 && near.dist2 < 500) {
                                let tmpCount = -1;
                                for (let i = 0; i < Math.PI*5.5; i+= Math.PI/2.2) {
                                    if (player.items[4] == 15) {
                                        tmpCount++;
                                        if (tmpCount == 0 && objDist <= 200) {
                                            place(4, objAim);
                                            place(4, objAim + Math.PI);
                                        } else {
                                            checkPlace(4, objAim+i+2);
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
            }
            function bianosSpTickWh(){
                buyEquip(7, 0);
                buyEquip(18, 1);
                selectWeapon(player.weapons[0]);
                io.send("d", 1, near.aim2);
                textManager.showText(player.x2, player.y2, 30, 0.15, 1850, "sync detect text", "#fff", 2);
                setTickout(()=>{
                    buyEquip(53, 0);
                    buyEquip(21, 1);
                    setTickout(()=>{
                        io.send("d", 0, near.aim2);
                        buyEquip(6, 0);
                    }, 3);
                }, 1);
            }

            // KILL ALL OBJECTS BY A PLAYER:
            function killObjects(sid) {
                if (player) objectManager.removeAllItems(sid);
            }
            function setTickout(doo, timeout) {
                if (!ticks.manage[ticks.tick + timeout]) {
                    ticks.manage[ticks.tick + timeout] = [doo];
                } else {
                    ticks.manage[ticks.tick + timeout].push(doo);
                }
            }
            function doNextTick(doo) {
                waitTicks.push(doo);
            }
            let waitTicks = [];
            let autoQ = false;
            function bianosSpTick(){
                buyEquip(7, 0);
                buyEquip(18, 1);
                selectWeapon(player.weapons[0]);
                io.send("d", 1, near.aim2);
                textManager.showText(player.x2, player.y2, 30, 0.15, 1850, "sync detect text", "#fff", 2);
                place(2, near.aim2);
                setTickout(()=>{
                    buyEquip(53, 0);
                    buyEquip(21, 1);
                    setTickout(()=>{
                        io.send("d", 0, near.aim2);
                        buyEquip(6, 0);
                    }, 3);
                }, 1);
            }
            // UPDATE PLAYER DATA:
            function updatePlayers(data) {
                if(player.shameCount > 0) {
                    my.reSync = true;
                } else {
                    my.reSync = false;
                }
                game.tick++;
                enemy = [];
                nears = [];
                near = [];
                game.tickSpeed = performance.now() - game.lastTick;
                game.lastTick = performance.now();
                players.forEach((tmp) => {
                    tmp.forcePos = !tmp.visible;
                    tmp.visible = false;
                });
                for (let i = 0; i < data.length;) {
                    tmpObj = findPlayerBySID(data[i]);
                    if (tmpObj) {
                        tmpObj.t1 = (tmpObj.t2 === undefined) ? game.lastTick : tmpObj.t2;
                        tmpObj.t2 = game.lastTick;
                        tmpObj.oldPos.x2 = tmpObj.x2;
                        tmpObj.oldPos.y2 = tmpObj.y2;
                        tmpObj.x1 = tmpObj.x;
                        tmpObj.y1 = tmpObj.y;
                        tmpObj.x2 = data[i + 1];
                        tmpObj.y2 = data[i + 2];
                        tmpObj.x3 = tmpObj.x2 + (tmpObj.x2 - tmpObj.oldPos.x2);
                        tmpObj.y3 = tmpObj.y2 + (tmpObj.y2 - tmpObj.oldPos.y2);
                        tmpObj.d1 = (tmpObj.d2 === undefined) ? data[i + 3] : tmpObj.d2;
                        tmpObj.d2 = data[i + 3];
                        tmpObj.dt = 0;
                        tmpObj.buildIndex = data[i + 4];
                        tmpObj.weaponIndex = data[i + 5];
                        tmpObj.weaponVariant = data[i + 6];
                        tmpObj.team = data[i + 7];
                        tmpObj.isLeader = data[i + 8];
                        tmpObj.oldSkinIndex = tmpObj.skinIndex;
                        tmpObj.oldTailIndex = tmpObj.tailIndex;
                        tmpObj.skinIndex = data[i + 9];
                        tmpObj.tailIndex = data[i + 10];
                        tmpObj.iconIndex = data[i + 11];
                        tmpObj.zIndex = data[i + 12];
                        tmpObj.visible = true;
                        tmpObj.update(game.tickSpeed);
                        tmpObj.dist2 = UTILS.getDist(tmpObj, player, 2, 2);
                        tmpObj.aim2 = UTILS.getDirect(tmpObj, player, 2, 2);
                        tmpObj.dist3 = UTILS.getDist(tmpObj, player, 3, 3);
                        tmpObj.aim3 = UTILS.getDirect(tmpObj, player, 3, 3);
                        tmpObj.damageThreat = 0;
                        if (tmpObj.skinIndex == 45 && tmpObj.shameTimer <= 0) {
                            tmpObj.addShameTimer();
                        }
                        if (tmpObj.oldSkinIndex == 45 && tmpObj.skinIndex != 45) {
                            tmpObj.shameTimer = 0;
                            tmpObj.shameCount = 0;
                            if (tmpObj == player) {
                                healer();
                            }
                        }
                        if (tmpObj == player) {
                            if (gameObjects.length) {
                                gameObjects.forEach((tmp) => {
                                    tmp.onNear = false;
                                    if (tmp.active) {
                                        if (!tmp.onNear && UTILS.getDist(tmp, tmpObj, 0, 2) <= tmp.scale + items.weapons[tmpObj.weapons[0]].range) {
                                            tmp.onNear = true;
                                        }
                                        if (tmp.isItem && tmp.owner) {
                                            if (!tmp.pps && tmpObj.sid == tmp.owner.sid && UTILS.getDist(tmp, tmpObj, 0, 2) > (parseInt(getEl("breakRange").value) || 0) && !tmp.breakObj && ![13, 14, 20].includes(tmp.id)) {
                                                tmp.breakObj = true;
                                                breakObjects.push({
                                                    x: tmp.x,
                                                    y: tmp.y,
                                                    sid: tmp.sid
                                                });
                                            }
                                        }
                                    }
                                });
                                let nearTrap = gameObjects.filter(e => e.trap && e.active && UTILS.getDist(e, tmpObj, 0, 2) <= (tmpObj.scale + e.getScale() + 5) && !e.isTeamObject(tmpObj)).sort(function(a, b) {
                                    return UTILS.getDist(a, tmpObj, 0, 2) - UTILS.getDist(b, tmpObj, 0, 2);
                                })[0];
                                if (nearTrap) {
                                    traps.dist = UTILS.getDist(nearTrap, tmpObj, 0, 2);
                                    traps.aim = UTILS.getDirect(nearTrap, tmpObj, 0, 2);
                                    if (!traps.inTrap) {
                                        traps.protect(traps.aim);
                                    }
                                    traps.inTrap = true;
                                    traps.info = nearTrap;
                                } else {
                                    traps.inTrap = false;
                                    traps.info = {};
                                }
                            } else {
                                traps.inTrap = false;
                            }
                        }
                        if (tmpObj.weaponIndex < 9) {
                            tmpObj.primaryIndex = tmpObj.weaponIndex;
                            tmpObj.primaryVariant = tmpObj.weaponVariant;
                        } else if (tmpObj.weaponIndex > 8) {
                            tmpObj.secondaryIndex = tmpObj.weaponIndex;
                            tmpObj.secondaryVariant = tmpObj.weaponVariant;
                        }
                    }
                    i += 13;
                }
                if (textManager.stack.length) {
                    let stacks = [];
                    let notstacks = [];
                    let num = 0;
                    let num2 = 0;
                    let pos = {
                        x: null,
                        y: null
                    };
                    let pos2 = {
                        x: null,
                        y: null
                    }
                    textManager.stack.forEach((text) => {
                        if (text.value >= 0) {
                            if (num == 0) pos = {
                                x: text.x,
                                y: text.y
                            };
                            num += Math.abs(text.value);
                        } else {
                            if (num2 == 0) pos2 = {
                                x: text.x,
                                y: text.y
                            };
                            num2 += Math.abs(text.value);
                        }
                    });
                    if (num2 > 0) {
                        textManager.showText(pos2.x, pos2.y, Math.max(45, Math.min(50, num2)), 0.18, 500, num2, "#8ecc51");
                    }
                    if (num > 0) {
                        textManager.showText(pos.x, pos.y, Math.max(45, Math.min(50, num)), 0.18, 500, num, "#fff");
                    }
                    textManager.stack = [];
                }
                if (runAtNextTick.length) {
                    runAtNextTick.forEach((tmp) => {
                        checkProjectileHolder(...tmp);
                    });
                    runAtNextTick = [];
                }
                for (let i = 0; i < data.length;) {
                    tmpObj = findPlayerBySID(data[i]);
                    if (tmpObj) {
                        if (!tmpObj.isTeam(player)) {
                            enemy.push(tmpObj);
                            if (tmpObj.dist2 <= items.weapons[tmpObj.primaryIndex == undefined ? 5 : tmpObj.primaryIndex].range + (player.scale * 2)) {
                                nears.push(tmpObj);
                            }
                        }
                        tmpObj.manageReload();
                        if (tmpObj != player) {
                            tmpObj.addDamageThreat(player);
                        }
                    }
                    i += 13;
                }
                /*projectiles.forEach((proj) => {
                    tmpObj = proj;
                    if (tmpObj.active) {
                        tmpObj.tickUpdate(game.tickSpeed);
                    }
                });*/
                if (player && player.alive) {
                    if (enemy.length) {
                        near = enemy.sort(function(tmp1, tmp2) {
                            return tmp1.dist2 - tmp2.dist2;
                        })[0];
                    } else {
                        // console.log("no enemy");
                    }
                    if (game.tickQueue[game.tick]) {
                        game.tickQueue[game.tick].forEach((action) => {
                            action();
                        });
                        game.tickQueue[game.tick] = null;
                    }
                    if (advHeal.length) {
                        advHeal.forEach((updHealth) => {
                            let sid = updHealth[0];
                            let value = updHealth[1];
                            let damaged = updHealth[2];
                            tmpObj = findPlayerBySID(sid);

                            let bullTicked = false;

                            if (tmpObj.health <= 0) {
                                if (!tmpObj.death) {
                                    tmpObj.death = true;
                                    if (tmpObj != player) {
                                        //                   addMenuChText("Game", `${tmpObj.name} {${tmpObj.sid}} Is Dead`, "yellow");
                                    }
                                    addDeadPlayer(tmpObj);
                                }
                            }
                            if (tmpObj == player) {
                                if (tmpObj.skinIndex == 7 && (damaged == 5 || (tmpObj.latestTail == 13 && damaged == 2))) {
                                    if (my.reSync) {
                                        my.reSync = false;
                                        tmpObj.setBullTick = true;
                                    }
                                    bullTicked = true;
                                }
                                if (inGame) {
                                    let attackers = getAttacker(damaged);
                                    let gearDmgs = [0.25, 0.45].map((val) => val * items.weapons[player.weapons[0]].dmg * soldierMult());
                                    let includeSpikeDmgs = !bullTicked && gearDmgs.includes(damaged);
                                    let healTimeout = 140 - window.ping;
                                    let slowHeal = function(timer) {
                                        setTimeout(() => {
                                            healer();
                                        }, timer);
                                    }
                                    if (getEl("healingBeta").checked) {
                                        if (attackers.length) {
                                            let by = attackers.filter((tmp) => {
                                                if (tmp.dist2 <= (tmp.weaponIndex < 9 ? 300 : 700)) {
                                                    tmpDir = UTILS.getDirect(player, tmp, 2, 2);
                                                    if (UTILS.getAngleDist(tmpDir, tmp.d2) <= Math.PI) {
                                                        return tmp;
                                                    }
                                                }
                                            });
                                            if (by.length) {
                                                let maxDamage = (includeSpikeDmgs ? 10 : 10);
                                                if (damaged > maxDamage && (game.tick - tmpObj.antiTimer) > 1) {
                                                    tmpObj.canEmpAnti = true;
                                                    tmpObj.antiTimer = game.tick;
                                                    let shame = 5;
                                                    if (tmpObj.shameCount < shame) {
                                                        healer();
                                                    } else {
                                                        slowHeal(healTimeout);
                                                    }
                                                } else {
                                                    slowHeal(healTimeout);
                                                }
                                            } else {
                                                slowHeal(healTimeout);
                                            }
                                        } else {
                                            slowHeal(healTimeout);
                                        }
                                    } else {
                                        if (damaged >= (includeSpikeDmgs ? 8 : 20) && tmpObj.damageThreat >= 25 && (game.tick - tmpObj.antiTimer) > 1) {
                                            tmpObj.canEmpAnti = true;
                                            tmpObj.antiTimer = game.tick;
                                            let shame = 5;
                                            if (tmpObj.shameCount < shame) {
                                                healer();
                                            } else {
                                                slowHeal(healTimeout);
                                            }
                                        } else {
                                            slowHeal(healTimeout);
                                        }
                                    }
                                    if (damaged >= 20 && player.skinIndex == 11) instaC.canCounter = true;
                                }
                            } else {
                                if (!tmpObj.setPoisonTick && (tmpObj.damaged == 5 || (tmpObj.latestTail == 13 && tmpObj.damaged == 2))) {
                                    tmpObj.setPoisonTick = true;
                                }
                            }
                        });
                        advHeal = [];
                    }
                    players.forEach((tmp) => {
                        if (!tmp.visible && player != tmp) {
                            tmp.reloads = {
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
                            };
                        }
                        if (tmp.setBullTick) {
                            tmp.bullTimer = 0;
                        }
                        if (tmp.setPoisonTick) {
                            tmp.poisonTimer = 0;
                        }
                        tmp.updateTimer();
                    });
                    if (inGame) {
                        if (enemy.length) {
                            if (player.canEmpAnti) {
                                player.canEmpAnti = false;
                                if (near.dist2 <= 300 && !my.safePrimary(near) && !my.safeSecondary(near)) {
                                    if (near.reloads[53] == 0) {
                                        player.empAnti = true;
                                        player.soldierAnti = false;
                                        //modLog("EmpAnti");
                                    } else {
                                        player.empAnti = false;
                                        player.soldierAnti = true;
                                        //modLog("SoldierAnti");
                                    }
                                }
                            }
                            let prehit = gameObjects.filter(tmp => tmp.dmg && tmp.active && tmp.isTeamObject(player) && UTILS.getDist(tmp, near, 0, 3) <= (tmp.scale + near.scale)).sort(function(a, b) {
                                return UTILS.getDist(a, near, 0, 2) - UTILS.getDist(b, near, 0, 2);
                            })[0];
                            if (prehit) {
                                if (near.dist3 <= items.weapons[player.weapons[0]].range + player.scale * 1.8 && configs.predictTick) {
                                    instaC.canSpikeTick = true;
                                    instaC.syncHit = true;
                                    if (configs.revTick && player.weapons[1] == 15 && player.reloads[53] == 0 && instaC.perfCheck(player, near)) {
                                        instaC.revTick = true;
                                    }
                                }
                            }
                            let antiSpikeTick = gameObjects.filter(tmp => tmp.dmg && tmp.active && !tmp.isTeamObject(player) && UTILS.getDist(tmp, player, 0, 3) < (tmp.scale + player.scale)).sort(function(a, b) {
                                return UTILS.getDist(a, player, 0, 2) - UTILS.getDist(b, player, 0, 2);
                            })[0];
                            if (antiSpikeTick && !traps.inTrap) {
                                if (near.dist3 <= items.weapons[5].range + near.scale * 1.8) {
                                    my.anti0Tick = 1;
                                    player.chat.message = "Raven" + near.sid;
                                    player.chat.count = 2000;
                                }
                            }
                        }
                        if (
                            (!useWasd
                             ? true
                             : ((player.checkCanInsta(true) >= 100
                                 ? player.checkCanInsta(true)
                                 : player.checkCanInsta(false)) >=
                                (player.weapons[1] == 10 ? 95 : 100)
                               )) &&
                            near.dist2 <=
                            items.weapons[player.weapons[1] == 10
                                          ? player.weapons[1]
                                          : player.weapons[0]].range +
                            near.scale * 1.8 &&
                            (instaC.wait || (!useWasd && Math.floor(Math.random() * 5) == 0)) &&
                            !instaC.isTrue &&
                            !my.waitHit &&
                            player.reloads[player.weapons[0]] == 0 &&
                            player.reloads[player.weapons[1]] == 0 &&
                            (!useWasd
                             ? true
                             : getEl("instaType").value == "oneShot"
                             ? player.reloads[53] <=
                             (player.weapons[1] == 10 ? 0 : game.tickRate)
                             : true) &&
                            instaC.perfCheck(player, near)
                        ) {

                            if (player.checkCanInsta(true) >= 100) {
                                instaC.nobull = !useWasd
                                    ? false
                                : instaC.canSpikeTick
                                    ? false
                                : true;
                            } else {
                                instaC.nobull = false;
                            }
                            instaC.can = true;
                        } else {
                            instaC.can = false;
                        }
                        /*if ((useWasd ? true : ((player.checkCanInsta(true) >= 100 ? player.checkCanInsta(true) : player.checkCanInsta(false)) >= (player.weapons[1] == 10 ? 95 : 100))) && near.dist2 <= items.weapons[player.weapons[1] == 10 ? player.weapons[1] : player.weapons[0]].range + near.scale * 1.8 && (instaC.wait || (!useWasd && Math.floor(Math.random() * 5) == 0)) && !instaC.isTrue && !my.waitHit && player.reloads[player.weapons[0]] == 0 && player.reloads[player.weapons[1]] == 0 && (!useWasd ? true : getEl("instaType").value == "oneShot" ? (player.reloads[53] <= (player.weapons[1] == 10 ? 0 : game.tickRate)) : true) && instaC.perfCheck(player, near)) {
                            if (player.checkCanInsta(true) >= 100) {
                                instaC.nobull = useWasd ? false : instaC.canSpikeTick ? false : true;
                            } else {
                                instaC.nobull = false;
                            }
                            instaC.can = true;
                        } else {
                            instaC.can = false;
                        }*/
                        macro.q && place(0, getAttackDir());
                        macro.f && place(4, getSafeDir());
                        macro.v && place(2, getSafeDir());
                        macro.y && place(5, getSafeDir());
                        macro.h && place(player.getItemType(22), getSafeDir());
                        macro.n && place(3, getSafeDir());
                        if (game.tick % 2 == 0) {
                            if (mills.place) {
                                let plcAng = 1.25;
                                for (let i = -plcAng; i <= plcAng; i += plcAng) {
                                    checkPlace(3, UTILS.getDirect(player.oldPos, player, 2, 2) + i);
                                }
                            } else {
                                if (mills.placeSpawnPads) {
                                    for (let i = 0; i < Math.PI * 2; i += Math.PI / 2) {
                                        checkPlace(player.getItemType(20), UTILS.getDirect(player.oldPos, player, 2, 2) + i);
                                    }
                                }
                            }
                        }
                        if (instaC.can) {
                            instaC.changeType(getEl("instaType").value);
                        }
                        if (instaC.canCounter) {
                            instaC.canCounter = false;
                            if (player.reloads[player.weapons[0]] == 0 && !instaC.isTrue) {
                                instaC.counterType();
                            }
                        }
                        if (instaC.canSpikeTick) {
                            instaC.canSpikeTick = false;
                            if (instaC.revTick) {
                                instaC.revTick = false;
                                if ([1, 2, 3, 4, 5, 6].includes(player.weapons[0]) && player.reloads[player.weapons[1]] == 0 && !instaC.isTrue) {
                                    instaC.changeType("rev");
                                    // addMenuChText("Mod", "Rev SyncHit", "lightBlue");
                                }
                            } else {
                                if ([1, 2, 3, 4, 5, 6].includes(player.weapons[0]) && player.reloads[player.weapons[0]] == 0 && !instaC.isTrue) {
                                    instaC.spikeTickType();
                                    if (instaC.syncHit) {
                                        //addMenuChText("Mod", "SyncHit", "lightBlue");
                                    }
                                }
                            }
                        }
                        if (!clicks.middle && (clicks.left || clicks.right) && !instaC.isTrue) {
                            if ((player.weaponIndex != (clicks.right && player.weapons[1] == 10 ? player.weapons[1] : player.weapons[0])) || player.buildIndex > -1) {
                                selectWeapon(clicks.right && player.weapons[1] == 10 ? player.weapons[1] : player.weapons[0]);
                            }
                            if (player.reloads[clicks.right && player.weapons[1] == 10 ? player.weapons[1] : player.weapons[0]] == 0 && !my.waitHit) {
                                sendAutoGather();
                                my.waitHit = 1;
                                game.tickBase(() => {
                                    sendAutoGather();
                                    my.waitHit = 0;
                                }, 1);
                            }
                        }
                        if (useWasd && !clicks.left && !clicks.right && !instaC.isTrue && near.dist2 <= (items.weapons[player.weapons[0]].range + near.scale * 1.8) && !traps.inTrap) {
                            if ((player.weaponIndex != player.weapons[0]) || player.buildIndex > -1) {
                                selectWeapon(player.weapons[0]);
                            }
                            if (player.reloads[player.weapons[0]] == 0 && !my.waitHit) {
                                sendAutoGather();
                                my.waitHit = 1;
                                game.tickBase(() => {
                                    sendAutoGather();
                                    my.waitHit = 0;
                                }, 1);
                            }
                        }
                        if (traps.inTrap) {
                            if (!clicks.left && !clicks.right && !instaC.isTrue) {
                                if (player.weaponIndex != (traps.notFast() ? player.weapons[1] : player.weapons[0]) || player.buildIndex > -1) {
                                    selectWeapon(traps.notFast() ? player.weapons[1] : player.weapons[0]);
                                }
                                if (player.reloads[traps.notFast() ? player.weapons[1] : player.weapons[0]] == 0 && !my.waitHit) {
                                    sendAutoGather();
                                    my.waitHit = 1;
                                    game.tickBase(() => {
                                        sendAutoGather();
                                        my.waitHit = 0;
                                    }, 1);
                                }
                            }
                        }
                        if (clicks.middle && !traps.inTrap) {
                            if (!instaC.isTrue && player.reloads[player.weapons[1]] == 0) {
                                if (my.ageInsta && player.weapons[0] != 4 && player.weapons[1] == 9 && player.age >= 9 && enemy.length) {
                                    instaC.bowMovement();
                                } else {
                                    instaC.rangeType();
                                }
                            }
                        }
                        if (macro.t && !traps.inTrap) {
                            if (!instaC.isTrue && player.reloads[player.weapons[0]] == 0 && (player.weapons[1] == 15 ? (player.reloads[player.weapons[1]] == 0) : true) && (player.weapons[0] == 5 || (player.weapons[0] == 4 && player.weapons[1] == 15))) {
                                instaC[(player.weapons[0] == 4 && player.weapons[1] == 15) ? "kmTickMovement" : "tickMovement"]();
                            }
                        }
                        if (macro["."] && !traps.inTrap) {
                            if (!instaC.isTrue && player.reloads[player.weapons[0]] == 0 && ([9, 12, 13, 15].includes(player.weapons[1]) ? (player.reloads[player.weapons[1]] == 0) : true)) {
                                instaC.boostTickMovement();
                            }
                        }
                        if (player.weapons[1] && !clicks.left && !clicks.right && !traps.inTrap && !instaC.isTrue && !(useWasd && near.dist2 <= items.weapons[player.weapons[0]].range + near.scale * 1.8)) {
                            if (player.reloads[player.weapons[0]] == 0 && player.reloads[player.weapons[1]] == 0) {
                                if (!my.reloaded) {
                                    my.reloaded = true;
                                    let fastSpeed = items.weapons[player.weapons[0]].spdMult < items.weapons[player.weapons[1]].spdMult ? 1 : 0;
                                    if (player.weaponIndex != player.weapons[fastSpeed] || player.buildIndex > -1) {
                                        selectWeapon(player.weapons[fastSpeed]);
                                    }
                                }
                            } else {
                                my.reloaded = false;
                                if (player.reloads[player.weapons[0]] > 0) {
                                    if (player.weaponIndex != player.weapons[0] || player.buildIndex > -1) {
                                        selectWeapon(player.weapons[0]);
                                    }
                                } else if (player.reloads[player.weapons[0]] == 0 && player.reloads[player.weapons[1]] > 0) {
                                    if (player.weaponIndex != player.weapons[1] || player.buildIndex > -1) {
                                        selectWeapon(player.weapons[1]);
                                    }
                                }
                            }
                        }
                        if (!instaC.isTrue && !traps.inTrap && !traps.replaced) {
                            traps.autoPlace();
                        }
                        if (!macro.q && !macro.f && !macro.v && !macro.h && !macro.n) {
                            packet("D", getAttackDir());
                        }
                        let hatChanger = function() {
                            if (my.anti0Tick > 0) {
                                buyEquip(6, 0);
                            } else {
                                if (clicks.left || clicks.right) {
                                    if ((player.shameCount > 0 && (game.tick - player.bullTick) % 7 == 0 && player.skinIndex != 45) || my.reSync) {
                                        buyEquip(7, 0);
                                    } else {
                                        if (clicks.left) {
                                            buyEquip(player.reloads[player.weapons[0]] == 0 ? getEl("weaponGrind").checked ? 40 : 7 : player.empAnti ? 6 : player.soldierAnti ? 26 : (getEl("antiBullType").value == "abreload" && near.antiBull > 0) ? 11 : near.dist2 <= 300 ? (getEl("antiBullType").value == "abalway" && near.reloads[near.primaryIndex] == 0) ? 11 : 6 : biomeGear(1, 1), 0);
                                        } else if (clicks.right) {
                                            buyEquip(player.reloads[clicks.right && player.weapons[1] == 10 ? player.weapons[1] : player.weapons[0]] == 0 ? 40 : player.empAnti ? 6 : player.soldierAnti ? 26 : (getEl("antiBullType").value == "abreload" && near.antiBull > 0) ? 11 : near.dist2 <= 300 ? (getEl("antiBullType").value == "abalway" && near.reloads[near.primaryIndex] == 0) ? 11 : 6 : biomeGear(1, 1), 0);
                                        }
                                    }
                                } else if (traps.inTrap) {
                                    if (traps.info.health <= items.weapons[player.weaponIndex].dmg ? false : (player.reloads[player.weapons[1] == 10 ? player.weapons[1] : player.weapons[0]] == 0)) {
                                        buyEquip(40, 0);
                                        // Barbarian hat
                                        if (near.dist2 > 300 && (!player.reloads[player.weapons[1] == 10 ? player.weapons[1] : player.weapons[0]] == 0)) {
                                            buyEquip(26, 0);
                                        }
                                    }
                                    else {
                                        if ((player.shameCount > 0 && (game.tick - player.bullTick) % config.serverUpdateRate === 0 && player.skinIndex != 45) || my.reSync) {
                                            buyEquip(7, 0);
                                        } else {
                                            buyEquip((player.empAnti || near.dist2 > 300 || !enemy.length) ? 6 : 26, 0);
                                        }
                                    }
                                } else {
                                    if (player.empAnti || player.soldierAnti) {
                                        buyEquip(player.empAnti ? 6 : 26, 0);
                                    } else {
                                        if ((player.shameCount > 0 && (game.tick - player.bullTick) % config.serverUpdateRate === 0 && player.skinIndex != 45) || my.reSync) {
                                            buyEquip(7, 0);
                                        } else {
                                            if (near.dist2 <= 300) {
                                                buyEquip((getEl("antiBullType").value == "abreload" && near.antiBull > 0) ? 11 : (getEl("antiBullType").value == "abalway" && near.reloads[near.primaryIndex] == 0) ? 11 : 6, 0);
                                            } else {
                                                biomeGear(1);
                                            }
                                        }
                                    }
                                }
                            }
                        }
                        let accChanger = function() {
                            if (instaC.can && player.checkCanInsta(true) >= 100) {
                                buyEquip(18, 1);
                            } else if (clicks.left) {
                                setTimeout(() => {
                                    buyEquip(21, 1);
                                }, 50)
                            } else if (clicks.right) {
                                setTimeout(() => {
                                    buyEquip(21, 1);
                                }, 50)
                            } else if (near.dist2 <= 260) {
                                buyEquip(21, 1);
                            } else {
                                traps.inTrap ? buyEquip(21, 1) : buyEquip(11, 1);
                            }
                        };
                        let wasdGears = function() {
                            if (my.anti0Tick > 0) {
                                buyEquip(6, 0);
                            } else {
                                if (clicks.left || clicks.right) {
                                    if ((player.shameCount > 4320 && (game.tick - player.bullTick) % config.serverUpdateRate === 0 && player.skinIndex != 45) || my.reSync) {
                                        buyEquip(7, 0);
                                    } else {
                                        if (clicks.left) {
                                            buyEquip(player.reloads[player.weapons[0]] == 0 ? getEl("weaponGrind").checked ? 40 : 7 : player.empAnti ? 22 : 6, 0);
                                        } else if (clicks.right) {
                                            buyEquip(player.reloads[clicks.right && player.weapons[1] == 10 ? player.weapons[1] : player.weapons[0]] == 0 ? 40 : player.empAnti ? 22 : 6, 0);
                                        }
                                    }
                                } else if (near.dist2 <= items.weapons[player.weapons[0]].range + near.scale * 1.8 && !traps.inTrap) {
                                    if ((player.shameCount > 4320 && (game.tick - player.bullTick) % config.serverUpdateRate === 0 && player.skinIndex != 45) || my.reSync) {
                                        buyEquip(7, 0);
                                    } else {
                                        buyEquip(player.reloads[player.weapons[0]] == 0 ? 7 : player.empAnti ? 22 : 6, 0);
                                    }
                                } else if (traps.inTrap) {
                                    if (traps.info.health <= items.weapons[player.weaponIndex].dmg ? false : (player.reloads[player.weapons[1] == 10 ? player.weapons[1] : player.weapons[0]] == 0)) {
                                        buyEquip(40, 0);
                                    } else {
                                        if ((player.shameCount > 4320 && (game.tick - player.bullTick) % config.serverUpdateRate === 0 && player.skinIndex != 45) || my.reSync) {
                                            buyEquip(7, 0);
                                        } else {
                                            buyEquip(player.empAnti ? 22 : 6, 0);
                                        }
                                    }
                                } else {
                                    if (player.empAnti) {
                                        buyEquip(22, 0);
                                    } else {
                                        if ((player.shameCount > 4320 && (game.tick - player.bullTick) % config.serverUpdateRate === 0 && player.skinIndex != 45) || my.reSync) {
                                            buyEquip(7, 0);
                                        } else {
                                            buyEquip(6, 0);
                                        }
                                    }
                                }
                            }
                            if (clicks.left || clicks.right) {
                                if (clicks.left) {
                                    buyEquip(0, 1);
                                } else if (clicks.right) {
                                    buyEquip(11, 1);
                                }
                            } else if (near.dist2 <= items.weapons[player.weapons[0]].range + near.scale * 1.8 && !traps.inTrap) {
                                buyEquip(0, 1);
                            } else if (traps.inTrap) {
                                buyEquip(0, 1);
                            } else {
                                buyEquip(11, 1);
                            }
                        }
                        if (storeMenu.style.display != "block" && !instaC.isTrue && !instaC.ticking) {
                            if (useWasd) {
                                wasdGears();
                            } else {
                                hatChanger();
                                accChanger();
                            }
                        }
                        //lastMoveDir = getSafeDir();
                        //packet("a", lastMoveDir, 1);
                        if (configs.autoPush && enemy.length && !traps.inTrap && !instaC.ticking) {
                            autoPush();
                        } else {
                            if (my.autoPush) {
                                my.autoPush = false;
                                packet("a", lastMoveDir || undefined, 1);
                            }
                        }
                        if (configs.fpsBoost) {
                            setTimeout(() => {
                                clearConsole()
                            }, 50)
                        }
                        if (!my.autoPush && pathFind.active) {
                            Pathfinder();
                        }
                        if (instaC.ticking) {
                            instaC.ticking = false;
                        }
                        if (instaC.syncHit) {
                            instaC.syncHit = false;
                        }
                        if (player.empAnti) {
                            player.empAnti = false;
                        }
                        if (player.soldierAnti) {
                            player.soldierAnti = false;
                        }
                        if (my.anti0Tick > 0) {
                            my.anti0Tick--;
                        }
                        if (traps.replaced) {
                            traps.replaced = false;
                        }
                        if (traps.antiTrapped) {
                            traps.antiTrapped = false;
                        }
                    }
                }
                if (botSkts.length) {
                    botSkts.forEach((bots) => {
                        if (true) {
                            bots[0].ssend("player", player, near, botIDS);
                        }
                    });
                }
            }
            for(var i1 = 0; i1 < gameObjects.length; i1++) {
                if (gameObjects[i1].active && gameObjects[i1].health > 0 && UTILS.getDist(gameObjects[i1], player, 0, 2) < 130 && getEl("antipush").checked) { // || gameObjects[i1].buildHealth <= items.weapons[nearEnemy.weaponIndex].dmg)

                    if(gameObjects[i1].name.includes("spike") && gameObjects[i1]){
                        if(gameObjects[i1].owner.sid != player.sid && clicks.left == false && tmpObj.reloads[tmpObj.secondaryIndex] == 0){
                            selectWeapon(player.weapons[1])
                            buyEquip(40, 0);
                            packet("c", 1, UTILS.getDirect(gameObjects[i1], player, 0, 2), 1)
                            setTickout( () => {
                                buyEquip(6, 0)
                            }, 1);
                        }
                    }
                }
            }
            function ez(context, x, y) {
                context.fillStyle = "rgba(0, 255, 255, 0.2)";
                context.beginPath();
                context.arc(x, y, 55, 0, Math.PI * 2); // Adjust the circle size
                context.fill();
                context.closePath();
                context.globalAlpha = 1;
            }
            // UPDATE LEADERBOARD:
            function updateLeaderboard(data) {
                lastLeaderboardData = data;
                return;
                UTILS.removeAllChildren(leaderboardData);
                let tmpC = 1;
                for (let i = 0; i < data.length; i += 3) {
                    (function(i) {
                        UTILS.generateElement({
                            class: "leaderHolder",
                            parent: leaderboardData,
                            children: [
                                UTILS.generateElement({
                                    class: "leaderboardItem",
                                    style: "color:" + ((data[i] == playerSID) ? "#fff" : "rgba(255,255,255,0.6)"),
                                    text: tmpC + ". " + (data[i + 1] != "" ? data[i + 1] : "unknown")
                                }),
                                UTILS.generateElement({
                                    class: "leaderScore",
                                    text: UTILS.sFormat(data[i + 2]) || "0"
                                })
                            ]
                        });
                    })(i);
                    tmpC++;
                }
            }

            // LOAD GAME OBJECT:
            function loadGameObject(data) {
                for (let i = 0; i < data.length;) {
                    objectManager.add(data[i], data[i + 1], data[i + 2], data[i + 3], data[i + 4],
                                      data[i + 5], items.list[data[i + 6]], true, (data[i + 7] >= 0 ? {
                        sid: data[i + 7]
                    } : null));
                    // sid, x, y, dir, s, type, data, setSID, owner
                    /*let dist = UTILS.getDist({
                        x: data[i + 1],
                        y: data[i + 2]
                    }, player, 0, 2);
                    let aim = UTILS.getDirect({
                        x: data[i + 1],
                        y: data[i + 2]
                    }, player, 0, 2);
                    find = findObjectBySid(data[i]);
                    if (data[i + 6] == 15) {
                        if (find && !find.isTeamObject(player)) {
                            if (dist <= 100) {
                                traps.dist = dist;
                                traps.aim = aim;
                                traps.protect(aim);
                            }
                        }
                    }*/
                    i += 8;
                }
            }

            // ADD AI:
            function loadAI(data) {
                for (let i = 0; i < ais.length; ++i) {
                    ais[i].forcePos = !ais[i].visible;
                    ais[i].visible = false;
                }
                if (data) {
                    let tmpTime = performance.now();
                    for (let i = 0; i < data.length;) {
                        tmpObj = findAIBySID(data[i]);
                        if (tmpObj) {
                            tmpObj.index = data[i + 1];
                            tmpObj.t1 = (tmpObj.t2 === undefined) ? tmpTime : tmpObj.t2;
                            tmpObj.t2 = tmpTime;
                            tmpObj.x1 = tmpObj.x;
                            tmpObj.y1 = tmpObj.y;
                            tmpObj.x2 = data[i + 2];
                            tmpObj.y2 = data[i + 3];
                            tmpObj.d1 = (tmpObj.d2 === undefined) ? data[i + 4] : tmpObj.d2;
                            tmpObj.d2 = data[i + 4];
                            tmpObj.health = data[i + 5];
                            tmpObj.dt = 0;
                            tmpObj.visible = true;
                        } else {
                            tmpObj = aiManager.spawn(data[i + 2], data[i + 3], data[i + 4], data[i + 1]);
                            tmpObj.x2 = tmpObj.x;
                            tmpObj.y2 = tmpObj.y;
                            tmpObj.d2 = tmpObj.dir;
                            tmpObj.health = data[i + 5];
                            if (!aiManager.aiTypes[data[i + 1]].name)
                                tmpObj.name = config.cowNames[data[i + 6]];
                            tmpObj.forcePos = true;
                            tmpObj.sid = data[i];
                            tmpObj.visible = true;
                        }
                        i += 7;
                    }
                }
            }

            // ANIMATE AI:
            function animateAI(sid) {
                tmpObj = findAIBySID(sid);
                if (tmpObj) tmpObj.startAnim();
            }

            // GATHER ANIMATION:
            function gatherAnimation(sid, didHit, index) {
                tmpObj = findPlayerBySID(sid);
                if (tmpObj) {
                    tmpObj.startAnim(didHit, index);
                    tmpObj.gatherIndex = index;
                    tmpObj.gathering = 1;
                    if (didHit) {
                        let tmpObjects = objectManager.hitObj;
                        objectManager.hitObj = [];
                        game.tickBase(() => {
                            // refind
                            tmpObj = findPlayerBySID(sid);
                            let val = items.weapons[index].dmg * (config.weaponVariants[tmpObj[(index < 9 ? "prima" : "seconda") + "ryVariant"]].val) * (items.weapons[index].sDmg || 1) * (tmpObj.skinIndex == 40 ? 3.3 : 1);
                            tmpObjects.forEach((healthy) => {
                                healthy.health -= val;
                            });
                        }, 1);
                    }
                }
            }

            // WIGGLE GAME OBJECT:
            function wiggleGameObject(dir, sid) {
                tmpObj = findObjectBySid(sid);
                if (tmpObj) {
                    tmpObj.xWiggle += config.gatherWiggle * Math.cos(dir);
                    tmpObj.yWiggle += config.gatherWiggle * Math.sin(dir);
                    if (tmpObj.health) {
                        //tmpObj.damaged = Math.min(255, tmpObj.damaged + 60);
                        objectManager.hitObj.push(tmpObj);
                    }
                }
            }

            // SHOOT TURRET:
            function shootTurret(sid, dir) {
                tmpObj = findObjectBySid(sid);
                if (tmpObj) {
                    if (config.anotherVisual) {
                        tmpObj.lastDir = dir;
                    } else {
                        tmpObj.dir = dir;
                    }
                    tmpObj.xWiggle += config.gatherWiggle * Math.cos(dir + Math.PI);
                    tmpObj.yWiggle += config.gatherWiggle * Math.sin(dir + Math.PI);
                }
            }
            // UPDATE PLAYER VALUE:
            function updatePlayerValue(index, value, updateView) {
                if (player) {
                    player[index] = value;
                    if (index == "points") {
                        if (configs.autoBuy) {
                            autoBuy.hat();
                            autoBuy.acc();
                        }
                    } else if (index == "kills") {
                        if (configs.killChat) {
                            packet("6", "Raven owns u");
                            setTimeout(() => {
                                packet("6", "get a better mod");
                                setTimeout(() => {
                                    packet("6", "Oblitirated");
                                    setTimeout(() => {
                                        io.send("6", "Players oblitirated : " + player.kills);
                                    }, 1500);
                                }, 1500);
                            }, 1500);
                        }
                    }
                }
            }
            function clearConsole() {
                if (configs.fpsBoost) {
                }
            }
            // ACTION BAR:
            function updateItems(data, wpn) {
                if (data) {
                    if (wpn) {
                        player.weapons = data;
                        player.primaryIndex = player.weapons[0];
                        player.secondaryIndex = player.weapons[1];
                        if (!instaC.isTrue) {
                            selectWeapon(player.weapons[0]);
                        }
                    } else {
                        player.items = data;
                    }
                }

                for (let i = 0; i < items.list.length; i++) {
                    let tmpI = items.weapons.length + i;
                    let actionBarItem = getEl("actionBarItem" + tmpI);
                    actionBarItem.style.display = player.items.indexOf(items.list[i].id) >= 0 ? "inline-block" : "none";
                    // Add shadow to the element
                    actionBarItem.style.boxShadow = "2px 2px 5px rgba(0, 0, 0, 0.5)";
                }

                for (let i = 0; i < items.weapons.length; i++) {
                    let actionBarItem = getEl("actionBarItem" + i);
                    actionBarItem.style.display = player.weapons[items.weapons[i].type] == items.weapons[i].id ? "inline-block" : "none";
                    // Add shadow to the element
                    actionBarItem.style.boxShadow = "2px 2px 5px rgba(0, 0, 0, 0.5)";
                }

                let kms = player.weapons[0] == 3 && player.weapons[1] == 15;
                if (kms) {
                    getEl("actionBarItem3").style.display = "none";
                    getEl("actionBarItem4").style.display = "inline-block";
                }
            }

            // ADD PROJECTILE:
            function addProjectile(x, y, dir, range, speed, indx, layer, sid) {
                projectileManager.addProjectile(x, y, dir, range, speed, indx, null, null, layer, inWindow).sid = sid;
                runAtNextTick.push(Array.prototype.slice.call(arguments));
            }

            // REMOVE PROJECTILE:
            function remProjectile(sid, range) {
                for (let i = 0; i < projectiles.length; ++i) {
                    if (projectiles[i].sid == sid) {
                        projectiles[i].range = range;
                        let tmpObjects = objectManager.hitObj;
                        objectManager.hitObj = [];
                        game.tickBase(() => {
                            let val = projectiles[i].dmg;
                            tmpObjects.forEach((healthy) => {
                                if (healthy.projDmg) {
                                    healthy.health -= val;
                                }
                            });
                        }, 1);
                    }
                }
            }

            // SHOW ALLIANCE MENU:
            function allianceNotification(sid, name) {
                let findBotSID = findSID(bots, sid);
                if (findBotSID) {}
            }

            function setPlayerTeam(team, isOwner) {
                if (player) {
                    player.team = team;
                    player.isOwner = isOwner;
                    if (team == null)
                        alliancePlayers = [];
                }
            }

            function setAlliancePlayers(data) {
                alliancePlayers = data;
            }

            // STORE MENU:
            function updateStoreItems(type, id, index) {
                if (index) {
                    if (!type)
                        player.tails[id] = 1;
                    else {
                        player.latestTail = id;
                    }
                } else {
                    if (!type)
                        player.skins[id] = 1,
                            id == 7 && (my.reSync = true); // testing perfect bulltick...
                    else {
                        player.latestSkin = id;
                    }
                }
            }
            // SEND MESSAGE:
            function receiveChat(sid, message) {
                if (message === 'zatuzatu -o-' && player.reloads[player.weapons[0]] == 0 && player.reloads[player.weapons[1]] == 0) {
                    packet("6", "");
                    my.autoAim = true;
                    selectWeapon(player.weapons[0]);
                    buyEquip(7, 0);
                    sendAutoGather();
                    game.tickBase(() => {
                        selectWeapon(player.weapons[1]);
                        buyEquip(player.reloads[53] == 0 ? 53 : 6, 0);
                        game.tickBase(() => {
                            sendAutoGather();
                            this.isTrue = false;
                            my.autoAim = false;
                        }, 1);
                    }, 1);
                }

                // SEND MESSAGE:
                let tmpPlayer = findPlayerBySID(sid);
                if (tmpPlayer) {
                    addMenuChText(`${tmpPlayer.name} {${tmpPlayer.sid}}`, message, "white");
                    if (config.anotherVisual) {
                        allChats.push(new addCh(tmpPlayer.x, tmpPlayer.y, message, tmpPlayer));
                    } else {
                        tmpPlayer.chatMessage = ((text) => {
                            let tmpString;
                            profanityList.forEach((list) => {
                                if (text.indexOf(list) > -1) {
                                    tmpString = "";
                                    for (var y = 0; y < list.length; ++y) {
                                        tmpString += tmpString.length ? "o" : "M";
                                    }
                                    var re = new RegExp(list, 'g');
                                    text = text.replace(re, tmpString);
                                }
                            });
                            return text;
                        })(message);
                        tmpPlayer.chatCountdown = config.chatCountdown;
                    }
                } else {
                    addMenuChText(`${"Anonymous"} {null}`, message, "white");
                }
            }

            // MINIMAP:
            function updateMinimap(data) {
                minimapData = data;
            }

            // SHOW ANIM TEXT:
            function showText(x, y, value, type) {
                if (config.anotherVisual) {
                    textManager.stack.push({
                        x: x,
                        y: y,
                        value: value
                    });
                } else {
                    textManager.showText(x, y, 50, 0.18, useWasd ? 500 : 1500, Math.abs(value), (value >= 0) ? "#fff" : "#8ecc51");
                }
            }

            /** APPLY SOCKET CODES */

            // BOT:
            let bots = [];
            let ranLocation = {
                x: UTILS.randInt(35, 14365),
                y: UTILS.randInt(35, 14365)
            };
            setInterval(() => {
                ranLocation = {
                    x: UTILS.randInt(35, 14365),
                    y: UTILS.randInt(35, 14365)
                };
            }, 60000);
            class Bot {
                constructor(id, sid, hats, accessories) {
                    this.id = id;
                    this.sid = sid;
                    this.team = null;
                    this.skinIndex = 0;
                    this.tailIndex = 0;
                    this.hitTime = 0;
                    this.iconIndex = 0;
                    this.enemy = [];
                    this.near = [];
                    this.dist2 = 0;
                    this.aim2 = 0;
                    this.tick = 0;
                    this.itemCounts = {};
                    this.latestSkin = 0;
                    this.latestTail = 0;
                    this.points = 0;
                    this.tails = {};
                    for (let i = 0; i < accessories.length; ++i) {
                        if (accessories[i].price <= 0)
                            this.tails[accessories[i].id] = 1;
                    }
                    this.skins = {};
                    for (let i = 0; i < hats.length; ++i) {
                        if (hats[i].price <= 0)
                            this.skins[hats[i].id] = 1;
                    }
                    this.spawn = function(moofoll) {
                        this.upgraded = 0;
                        this.enemy = [];
                        this.near = [];
                        this.active = true;
                        this.alive = true;
                        this.lockMove = false;
                        this.lockDir = false;
                        this.minimapCounter = 0;
                        this.chatCountdown = 0;
                        this.shameCount = 0;
                        this.shameTimer = 0;
                        this.sentTo = {};
                        this.gathering = 0;
                        this.autoGather = 0;
                        this.animTime = 0;
                        this.animSpeed = 0;
                        this.mouseState = 0;
                        this.buildIndex = -1;
                        this.weaponIndex = 0;
                        this.dmgOverTime = {};
                        this.noMovTimer = 0;
                        this.maxXP = 300;
                        this.XP = 0;
                        this.age = 1;
                        this.kills = 0;
                        this.upgrAge = 2;
                        this.upgradePoints = 0;
                        this.x = 0;
                        this.y = 0;
                        this.zIndex = 0;
                        this.xVel = 0;
                        this.yVel = 0;
                        this.slowMult = 1;
                        this.dir = 0;
                        this.nDir = 0;
                        this.dirPlus = 0;
                        this.targetDir = 0;
                        this.targetAngle = 0;
                        this.maxHealth = 100;
                        this.health = this.maxHealth;
                        this.oldHealth = this.maxHealth;
                        this.scale = config.playerScale;
                        this.speed = config.playerSpeed;
                        this.resetMoveDir();
                        this.resetResources(moofoll);
                        this.items = [0, 3, 6, 10];
                        this.weapons = [0];
                        this.shootCount = 0;
                        this.weaponXP = [];
                        this.reloads = {};
                        this.whyDie = "";
                    };

                    // RESET MOVE DIR:
                    this.resetMoveDir = function() {
                        this.moveDir = undefined;
                    };

                    // RESET RESOURCES:
                    this.resetResources = function(moofoll) {
                        for (let i = 0; i < config.resourceTypes.length; ++i) {
                            this[config.resourceTypes[i]] = moofoll ? 100 : 0;
                        }
                    };

                    // SET DATA:
                    this.setData = function(data) {
                        this.id = data[0];
                        this.sid = data[1];
                        this.name = data[2];
                        this.x = data[3];
                        this.y = data[4];
                        this.dir = data[5];
                        this.health = data[6];
                        this.maxHealth = data[7];
                        this.scale = data[8];
                        this.skinColor = data[9];
                    };


                    // SHAME SYSTEM:
                    this.judgeShame = function() {
                        if (this.oldHealth < this.health) {
                            if (this.hitTime) {
                                let timeSinceHit = this.tick - this.hitTime;
                                this.hitTime = 0;
                                if (timeSinceHit < 2) {
                                    this.shameCount++;
                                } else {
                                    this.shameCount = Math.max(0, this.shameCount - 2);
                                }
                            }
                        } else if (this.oldHealth > this.health) {
                            this.hitTime = this.tick;
                        }
                    };

                    this.closeSockets = function(websc) {
                        websc.close();
                    };

                    this.whyDieChat = function(websc, whydie) {
                        websc.sendWS("6", "XDDD why die " + whydie);
                    };
                }
            };

            class BotObject {
                constructor(sid) {
                    this.sid = sid;
                    // INIT:
                    this.init = function(x, y, dir, scale, type, data, owner) {
                        data = data || {};
                        this.active = true;
                        this.x = x;
                        this.y = y;
                        this.scale = scale;
                        this.owner = owner;
                        this.id = data.id;
                        this.dmg = data.dmg;
                        this.trap = data.trap;
                        this.teleport = data.teleport;
                        this.isItem = this.id != undefined;
                    };

                }
            };
            class BotObjManager {
                constructor(botObj, fOS) {
                    // DISABLE OBJ:
                    this.disableObj = function(obj) {
                        obj.active = false;
                        if (config.anotherVisual) {} else {
                            obj.alive = false;
                        }
                    };

                    // ADD NEW:
                    let tmpObj;
                    this.add = function(sid, x, y, dir, s, type, data, setSID, owner) {
                        tmpObj = fOS(sid);
                        if (!tmpObj) {
                            tmpObj = botObj.find((tmp) => !tmp.active);
                            if (!tmpObj) {
                                tmpObj = new BotObject(sid);
                                botObj.push(tmpObj);
                            }
                        }
                        if (setSID) {
                            tmpObj.sid = sid;
                        }
                        tmpObj.init(x, y, dir, s, type, data, owner);
                    };

                    // DISABLE BY SID:
                    this.disableBySid = function(sid) {
                        let find = fOS(sid);
                        if (find) {
                            this.disableObj(find);
                        }
                    };

                    // REMOVE ALL FROM PLAYER:
                    this.removeAllItems = function(sid, server) {
                        botObj.filter((tmp) => tmp.active && tmp.owner && tmp.owner.sid == sid).forEach((tmp) => this.disableObj(tmp));
                    };
                }
            };

            function botSpawn(id) {
                let bot;
                if (testMode) {
                    return;
                    bot = id && new WebSocket(`wss://elon_musk_hentai.io/websocket`);
                } else {
                    bot = id && new WebSocket(WS.url.split("&")[0] + "&token=" + encodeURIComponent(id));
                }
                let botPlayer = new Map();
                let botSID;
                let botObj = [];
                let nearObj = [];
                let bD = {
                    x: 0,
                    y: 0,
                    inGame: false,
                    closeSocket: false,
                    whyDie: ""
                };
                let oldXY = {
                    x: 0,
                    y: 0,
                };

                let botObjManager = new BotObjManager(botObj, function(sid) {
                    return findSID(botObj, sid);
                });

                bot.binaryType = "arraybuffer";
                bot.first = true;
                bot.sendWS = function(type) {
                    // EXTRACT DATA ARRAY:
                    let data = Array.prototype.slice.call(arguments, 1);

                    // SEND MESSAGE:
                    let binary = window.msgpack.encode([type, data]);
                    bot.send(binary);
                };
                bot.spawn = function() {
                    bot.sendWS("M", {
                        name: "AAAAAAAAAAAAAAA",
                        moofoll: 1,
                        skin: "__proto__"
                    });
                };
                bot.sendUpgrade = function(index) {
                    bot.sendWS("H", index);
                };
                bot.place = function(id, a) {
                    try {
                        let item = items.list[botPlayer.items[id]];
                        if (botPlayer.itemCounts[item.group.id] == undefined ? true : botPlayer.itemCounts[item.group.id] < (config.isSandbox ? 99 : item.group.limit ? item.group.limit : 99)) {
                            bot.sendWS("G", botPlayer.items[id]);
                            bot.sendWS("c", 1, a);
                            bot.sendWS("G", botPlayer.weaponIndex, true);
                        }
                    } catch (e) {

                    }
                };
                bot.buye = function(id, index) {
                    let nID = 0;
                    if (botPlayer.alive && botPlayer.inGame) {
                        if (index == 0) {
                            if (botPlayer.skins[id]) {
                                if (botPlayer.latestSkin != id) {
                                    bot.sendWS("c", 0, id, 0);
                                }
                            } else {
                                let find = findID(hats, id);
                                if (find) {
                                    if (botPlayer.points >= find.price) {
                                        bot.sendWS("c", 1, id, 0);
                                        bot.sendWS("c", 0, id, 0);
                                    } else {
                                        if (botPlayer.latestSkin != nID) {
                                            bot.sendWS("c", 0, nID, 0);
                                        }
                                    }
                                } else {
                                    if (botPlayer.latestSkin != nID) {
                                        bot.sendWS("c", 0, nID, 0);
                                    }
                                }
                            }
                        } else if (index == 1) {
                            if (botPlayer.tails[id]) {
                                if (botPlayer.latestTail != id) {
                                    bot.sendWS("c", 0, id, 1);
                                }
                            } else {
                                let find = findID(accessories, id);
                                if (find) {
                                    if (botPlayer.points >= find.price) {
                                        bot.sendWS("c", 1, id, 1);
                                        bot.sendWS("c", 0, id, 1);
                                    } else {
                                        if (botPlayer.latestTail != 0) {
                                            bot.sendWS("c", 0, 0, 1);
                                        }
                                    }
                                } else {
                                    if (botPlayer.latestTail != 0) {
                                        bot.sendWS("c", 0, 0, 1);
                                    }
                                }
                            }
                        }
                    }
                };
                bot.fastGear = function() {
                    if (botPlayer.y2 >= config.mapScale / 2 - config.riverWidth / 2 && botPlayer.y2 <= config.mapScale / 2 + config.riverWidth / 2) {
                        bot.buye(31, 0);
                    } else {
                        if (botPlayer.moveDir == undefined) {
                            bot.buye(22, 0);
                        } else {
                            if (botPlayer.y2 <= config.snowBiomeTop) {
                                bot.buye(15, 0);
                            } else {
                                bot.buye(12, 0);
                            }
                        }
                    }
                };
                let heal = function() {
                    let healthBased = function() {
                        if (botPlayer.health == 100)
                            return 0;
                        if (botPlayer.skinIndex != 45 && botPlayer.skinIndex != 56) {
                            return Math.ceil((100 - botPlayer.health) / items.list[botPlayer.items[0]].healing);
                        }
                        return 0;
                    };
                    for (let i = 0; i < healthBased(); i++) {
                        bot.place(0, botPlayer.nDir);
                    }
                };
                bot.onmessage = function(message) {
                    let data = new Uint8Array(message.data);
                    let parsed = window.msgpack.decode(data);
                    let type = parsed[0];
                    data = parsed[1];
                    if (type == "io-init") {
                        bot.spawn();
                    }
                    if (type == "C") {
                        botSID = data[0];
                    }
                    if (type == "D") {
                        if (data[1]) {
                            botPlayer = new Bot(data[0][0], data[0][1], hats, accessories);
                            botPlayer.setData(data[0]);
                            botPlayer.inGame = true;
                            botPlayer.alive = true;
                            botPlayer.x2 = undefined;
                            botPlayer.y2 = undefined;
                            botPlayer.spawn(1);
                            oldXY = {
                                x: data[0][3],
                                y: data[0][4]
                            }
                            bD.inGame = true;
                            bot.sendWS("K", 1);
                            if (bot.first) {
                                bot.first = false;
                                bots.push(bD);
                            }
                        }
                    }
                    if (type == "P") {
                        bot.spawn();
                        botPlayer.inGame = false;
                        bD.inGame = false;
                    }
                    if (type == "a") {
                        let tmpData = data[0];
                        botPlayer.tick++;
                        botPlayer.enemy = [];
                        botPlayer.near = [];
                        nearObj = [];
                        for (let i = 0; i < tmpData.length;) {
                            if (tmpData[i] == botPlayer.sid) {
                                botPlayer.x2 = tmpData[i + 1];
                                botPlayer.y2 = tmpData[i + 2];
                                botPlayer.d2 = tmpData[i + 3];
                                botPlayer.buildIndex = tmpData[i + 4];
                                botPlayer.weaponIndex = tmpData[i + 5];
                                botPlayer.weaponVariant = tmpData[i + 6];
                                botPlayer.team = tmpData[i + 7];
                                botPlayer.isLeader = tmpData[i + 8];
                                botPlayer.skinIndex = tmpData[i + 9];
                                botPlayer.tailIndex = tmpData[i + 10];
                                botPlayer.iconIndex = tmpData[i + 11];
                                botPlayer.zIndex = tmpData[i + 12];
                                botPlayer.visible = true;
                                bD.x2 = botPlayer.x2;
                                bD.y2 = botPlayer.y2;
                            }
                            i += 13;
                        }
                        if (bD.closeSocket) {
                            botPlayer.closeSockets(bot);
                        }
                        if (bD.whyDie != "") {
                            botPlayer.whyDieChat(bot, bD.whyDie);
                            bD.whyDie = "";
                        }
                        if (botPlayer.alive) {
                            if (player.team) {
                                if (botPlayer.team != player.team && (botPlayer.tick % 9 === 0)) {
                                    botPlayer.team && (bot.sendWS("N"));
                                    bot.sendWS("10", player.team);
                                }
                            }
                            if (botPlayer.inGame) {
                                if (botObj.length > 0) {
                                    if (breakObjects.length > 0) {
                                        let gotoDist = UTILS.getDist(breakObjects[0], botPlayer, 0, 2);
                                        let gotoAim = UTILS.getDirect(breakObjects[0], botPlayer, 0, 2);
                                        nearObj = botObj.filter((e) => e.active && (findSID(breakObjects, e.sid) ? true : !(e.trap && (player.sid == e.owner.sid || player.findAllianceBySid(e.owner.sid)))) && e.isItem && UTILS.getDist(e, botPlayer, 0, 2) <= (items.weapons[botPlayer.weaponIndex].range + e.scale)).sort(function(a, b) {
                                            return UTILS.getDist(a, botPlayer, 0, 2) - UTILS.getDist(b, botPlayer, 0, 2);
                                        })[0];
                                        if (nearObj) {
                                            let isPassed = UTILS.getDist(breakObjects[0], nearObj, 0, 0);
                                            if ((gotoDist - isPassed) > 0) {
                                                if (findSID(breakObjects, nearObj.sid) ? true : (nearObj.dmg || nearObj.trap || nearObj.teleport)) {
                                                    if (botPlayer.moveDir != undefined) {
                                                        botPlayer.moveDir = undefined;
                                                        bot.sendWS("a", botPlayer.moveDir);
                                                    }
                                                } else {
                                                    botPlayer.moveDir = gotoAim;
                                                    bot.sendWS("a", botPlayer.moveDir);
                                                }
                                                if (botPlayer.nDir != UTILS.getDirect(nearObj, botPlayer, 0, 2)) {
                                                    botPlayer.nDir = UTILS.getDirect(nearObj, botPlayer, 0, 2);
                                                    bot.sendWS("D", botPlayer.nDir);
                                                }
                                                bot.buye(40, 0);
                                                bot.buye(11, 1);
                                            } else {
                                                botPlayer.moveDir = gotoAim;
                                                bot.sendWS("a", botPlayer.moveDir);
                                                bot.fastGear();
                                                bot.buye(11, 1);
                                            }
                                        } else {
                                            botPlayer.moveDir = gotoAim;
                                            bot.sendWS("a", botPlayer.moveDir);
                                            bot.fastGear();
                                            bot.buye(11, 1);
                                        }
                                        if (gotoDist > 300) {
                                            if (UTILS.getDist(oldXY, botPlayer, 0, 2) > 90) {
                                                let aim = UTILS.getDirect(oldXY, botPlayer, 0, 2);
                                                bot.place(3, aim + (Math.PI / 2.3));
                                                bot.place(3, aim - (Math.PI / 2.3));
                                                bot.place(3, aim);
                                                oldXY = {
                                                    x: botPlayer.x2,
                                                    y: botPlayer.y2
                                                };
                                            }
                                        }
                                    } else {
                                        if (botPlayer.moveDir != undefined) {
                                            botPlayer.moveDir = undefined;
                                            bot.sendWS("a", botPlayer.moveDir);
                                        }
                                        nearObj = botObj.filter((e) => e.active && (findSID(breakObjects, e.sid) ? true : !(e.trap && (player.sid == e.owner.sid || player.findAllianceBySid(e.owner.sid)))) && e.isItem && UTILS.getDist(e, botPlayer, 0, 2) <= (items.weapons[botPlayer.weaponIndex].range + e.scale)).sort(function(a, b) {
                                            return UTILS.getDist(a, botPlayer, 0, 2) - UTILS.getDist(b, botPlayer, 0, 2);
                                        })[0];
                                        if (nearObj) {
                                            if (botPlayer.nDir != UTILS.getDirect(nearObj, botPlayer, 0, 2)) {
                                                botPlayer.nDir = UTILS.getDirect(nearObj, botPlayer, 0, 2);
                                                bot.sendWS("D", botPlayer.nDir);
                                            }
                                            bot.buye(40, 0);
                                            bot.buye(11, 1);
                                        } else {
                                            bot.fastGear();
                                            bot.buye(11, 1);
                                        }
                                    }
                                } else {
                                    if (botPlayer.moveDir != undefined) {
                                        botPlayer.moveDir = undefined;
                                        bot.sendWS("a", botPlayer.moveDir);
                                    }
                                }
                            }
                        }
                    }
                    if (type == "H") {
                        let tmpData = data[0];
                        for (let i = 0; i < tmpData.length;) {
                            botObjManager.add(tmpData[i], tmpData[i + 1], tmpData[i + 2], tmpData[i + 3], tmpData[i + 4],
                                              tmpData[i + 5], items.list[tmpData[i + 6]], true, (tmpData[i + 7] >= 0 ? {
                                sid: tmpData[i + 7]
                            } : null));
                            i += 8;
                        }
                    }
                    if (type == "N") {
                        let index = data[0];
                        let value = data[1];
                        if (botPlayer) {
                            botPlayer[index] = value;
                        }
                    }
                    if (type == "O") {
                        if (data[0] == botSID) {
                            botPlayer.oldHealth = botPlayer.health;
                            botPlayer.health = data[1];
                            botPlayer.judgeShame();
                            if (botPlayer.oldHealth > botPlayer.health) {
                                if (botPlayer.shameCount < 5) {
                                    heal();
                                } else {
                                    setTimeout(() => {
                                        heal();
                                    }, 70);
                                }
                            }
                        }
                    }
                    if (type == "Q") {
                        let sid = data[0];
                        botObjManager.disableBySid(sid);
                    }
                    if (type == "R") {
                        let sid = data[0];
                        if (botPlayer.alive) botObjManager.removeAllItems(sid);
                    }
                    if (type == "S") {
                        let index = data[0];
                        let value = data[1];
                        if (botPlayer) {
                            botPlayer.itemCounts[index] = value;
                        }
                    }
                    if (type == "U") {
                        if (data[0] > 0) {
                            if (botPlayer.upgraded == 0) {
                                bot.sendUpgrade(3);
                            } else if (botPlayer.upgraded == 1) {
                                bot.sendUpgrade(17);
                            } else if (botPlayer.upgraded == 2) {
                                bot.sendUpgrade(31);
                            } else if (botPlayer.upgraded == 3) {
                                bot.sendUpgrade(27);
                            } else if (botPlayer.upgraded == 4) {
                                bot.sendUpgrade(9);
                            } else if (botPlayer.upgraded == 5) {
                                bot.sendUpgrade(38);
                            } else if (botPlayer.upgraded == 6) {
                                bot.sendUpgrade(4);
                            } else if (botPlayer.upgraded == 7) {
                                bot.sendUpgrade(25);
                            }
                            botPlayer.upgraded++;
                        }
                    }
                    if (type == "V") {
                        let tmpData = data[0];
                        let wpn = data[1];
                        if (tmpData) {
                            if (wpn) botPlayer.weapons = tmpData;
                            else botPlayer.items = tmpData;
                        }
                        bot.sendWS("G", botPlayer.weapons[0], true);
                    }
                    if (type == "5") {
                        let type = data[0];
                        let id = data[1];
                        let index = data[2];
                        if (index) {
                            if (!type)
                                botPlayer.tails[id] = 1;
                            else
                                botPlayer.latestTail = id;
                        } else {
                            if (!type)
                                botPlayer.skins[id] = 1;
                            else
                                botPlayer.latestSkin = id;
                        }
                    }
                };
                bot.onclose = function() {
                    botPlayer.inGame = false;
                    bD.inGame = false;
                };
            }

            // RENDER LEAF:
            function renderLeaf(x, y, l, r, ctxt) {
                let endX = x + (l * Math.cos(r));
                let endY = y + (l * Math.sin(r));
                let width = l * 0.4;
                ctxt.moveTo(x, y);
                ctxt.beginPath();
                ctxt.quadraticCurveTo(((x + endX) / 2) + (width * Math.cos(r + Math.PI / 2)),
                                      ((y + endY) / 2) + (width * Math.sin(r + Math.PI / 2)), endX, endY);
                ctxt.quadraticCurveTo(((x + endX) / 2) - (width * Math.cos(r + Math.PI / 2)),
                                      ((y + endY) / 2) - (width * Math.sin(r + Math.PI / 2)), x, y);
                ctxt.closePath();
                ctxt.fill();
                ctxt.stroke();
            }

            // RENDER CIRCLE:
            function renderCircle(x, y, scale, tmpContext, dontStroke, dontFill) {
                tmpContext = tmpContext || mainContext;
                tmpContext.beginPath();
                tmpContext.arc(x, y, scale, 0, 2 * Math.PI);
                if (!dontFill) tmpContext.fill();
                if (!dontStroke) tmpContext.stroke();
            }

            function renderHealthCircle(x, y, scale, tmpContext, dontStroke, dontFill) {
                tmpContext = tmpContext || mainContext;
                tmpContext.beginPath();
                tmpContext.arc(x, y, scale, 0, 2 * Math.PI);
                if (!dontFill) tmpContext.fill();
                if (!dontStroke) tmpContext.stroke();
            }

            // RENDER STAR SHAPE:
            function renderStar(ctxt, spikes, outer, inner) {
                let rot = Math.PI / 2 * 3;
                let x, y;
                let step = Math.PI / spikes;
                ctxt.beginPath();
                ctxt.moveTo(0, -outer);
                for (let i = 0; i < spikes; i++) {
                    x = Math.cos(rot) * outer;
                    y = Math.sin(rot) * outer;
                    ctxt.lineTo(x, y);
                    rot += step;
                    x = Math.cos(rot) * inner;
                    y = Math.sin(rot) * inner;
                    ctxt.lineTo(x, y);
                    rot += step;
                }
                ctxt.lineTo(0, -outer);
                ctxt.closePath();
            }

            function renderHealthStar(ctxt, spikes, outer, inner) {
                let rot = Math.PI / 2 * 3;
                let x, y;
                let step = Math.PI / spikes;
                ctxt.beginPath();
                ctxt.moveTo(0, -outer);
                for (let i = 0; i < spikes; i++) {
                    x = Math.cos(rot) * outer;
                    y = Math.sin(rot) * outer;
                    ctxt.lineTo(x, y);
                    rot += step;
                    x = Math.cos(rot) * inner;
                    y = Math.sin(rot) * inner;
                    ctxt.lineTo(x, y);
                    rot += step;
                }
                ctxt.lineTo(0, -outer);
                ctxt.closePath();
            }

            // RENDER RECTANGLE:
            function renderRect(x, y, w, h, ctxt, dontStroke, dontFill) {
                if (!dontFill) ctxt.fillRect(x - (w / 2), y - (h / 2), w, h);
                if (!dontStroke) ctxt.strokeRect(x - (w / 2), y - (h / 2), w, h);
            }

            function renderHealthRect(x, y, w, h, ctxt, dontStroke, dontFill) {
                if (!dontFill) ctxt.fillRect(x - (w / 2), y - (h / 2), w, h);
                if (!dontStroke) ctxt.strokeRect(x - (w / 2), y - (h / 2), w, h);
            }

            // RENDER RECTCIRCLE:
            function renderRectCircle(x, y, s, sw, seg, ctxt, dontStroke, dontFill) {
                ctxt.save();
                ctxt.translate(x, y);
                seg = Math.ceil(seg / 2);
                for (let i = 0; i < seg; i++) {
                    renderRect(0, 0, s * 2, sw, ctxt, dontStroke, dontFill);
                    ctxt.rotate(Math.PI / seg);
                }
                ctxt.restore();
            }

            // RENDER BLOB:
            function renderBlob(ctxt, spikes, outer, inner) {
                let rot = Math.PI / 2 * 3;
                let x, y;
                let step = Math.PI / spikes;
                let tmpOuter;
                ctxt.beginPath();
                ctxt.moveTo(0, -inner);
                for (let i = 0; i < spikes; i++) {
                    tmpOuter = UTILS.randInt(outer + 0.9, outer * 1.2);
                    ctxt.quadraticCurveTo(Math.cos(rot + step) * tmpOuter, Math.sin(rot + step) * tmpOuter,
                                          Math.cos(rot + (step * 2)) * inner, Math.sin(rot + (step * 2)) * inner);
                    rot += step * 2;
                }
                ctxt.lineTo(0, -inner);
                ctxt.closePath();
            }

            // RENDER TRIANGLE:
            function renderTriangle(s, ctx) {
                ctx = ctx || mainContext;
                let h = s * (Math.sqrt(3) / 2);
                ctx.beginPath();
                ctx.moveTo(0, -h / 2);
                ctx.lineTo(-s / 2, h / 2);
                ctx.lineTo(s / 2, h / 2);
                ctx.lineTo(0, -h / 2);
                ctx.fill();
                ctx.closePath();
            }

            // PREPARE MENU BACKGROUND:
            function prepareMenuBackground() {
                let tmpMid = config.mapScale / 2;
                let attempts = 0;
                for (let i = 0; i < items.list.length * 3;) {
                    if (attempts >= 1000) break;
                    attempts++;
                    let type = items.list[UTILS.randInt(0, items.list.length - 1)];
                    let data = {
                        x: tmpMid + UTILS.randFloat(-1000, 1000),
                        y: tmpMid + UTILS.randFloat(-600, 600),
                        dir: UTILS.fixTo(Math.random() * (Math.PI * 2), 2)
                    };
                    if (objectManager.checkItemLocation(data.x, data.y, type.scale, 0.6, type.id, true)) {
                        objectManager.add(i, data.x, data.y, data.dir, type.scale, type.id, type);
                    } else {
                        continue;
                    }
                    i++;
                }
            }

            // RENDER PLAYERS:
            function renderDeadPlayers(xOffset, yOffset) {
                mainContext.fillStyle = "#91b2db";
                deadPlayers.filter(dead => dead.active).forEach((dead) => {
                    dead.animate(delta);

                    mainContext.globalAlpha = dead.alpha;
                    mainContext.strokeStyle = outlineColor;

                    mainContext.save();
                    mainContext.translate(dead.x - xOffset, dead.y - yOffset);

                    // RENDER PLAYER:
                    mainContext.rotate(dead.dir);
                    mainContext.scale(dead.visScale / dead.scale, dead.visScale / dead.scale);
                    renderDeadPlayer(dead, mainContext);
                    mainContext.restore();

                    /*    mainContext.font = "20px Ubuntu";
                   let tmpSize = mainContext.measureText("");
                    let tmpH = 60;
                    let tmpW = tmpSize.width + 10;
                    mainContext.textBaseline = "middle";
                    mainContext.textAlign = "center";

                    //smainContext.fillStyle = "#ccc";
                    //mainContext.strokeStyle = "#999";
                    mainContext.roundRect(dead.x - xOffset - (tmpW / 2), dead.y - yOffset - (tmpH / 2) + (dead.scale * 1.5), tmpW, tmpH, 6);
                    mainContext.fill();
                    mainContext.stroke();

*/
                    // same color in bundle
                    //aaaaaaaaaa                    mainContext.fillStyle = "#91b2db";

                });
            }
            // RENDER PLAYERS:
            function renderPlayers(xOffset, yOffset, zIndex) {
                mainContext.globalAlpha = 1;
                mainContext.fillStyle = "#91b2db";
                for (var i = 0; i < players.length; ++i) {
                    tmpObj = players[i];
                    if (tmpObj.zIndex == zIndex) {
                        tmpObj.animate(delta);
                        if (tmpObj.visible) {
                            tmpObj.skinRot += (0.002 * delta);
                            tmpDir = (!configs.showDir && !useWasd && tmpObj == player) ? configs.attackDir ? getVisualDir() : getSafeDir() : (tmpObj.dir || 0);
                            mainContext.save();
                            mainContext.translate(tmpObj.x - xOffset, tmpObj.y - yOffset);

                            // RENDER PLAYER:
                            mainContext.rotate(tmpDir + tmpObj.dirPlus);
                            renderPlayer(tmpObj, mainContext);
                            mainContext.restore();

                        }
                    }
                }
            }

            // RENDER DEAD PLAYER:
            function renderDeadPlayer(obj, ctxt) {
                ctxt = ctxt || mainContext;
                ctxt.lineWidth = outlineWidth;
                ctxt.lineJoin = "miter";
                let handAngle = (Math.PI / 4) * (items.weapons[obj.weaponIndex].armS || 1);
                let oHandAngle = (obj.buildIndex < 0) ? (items.weapons[obj.weaponIndex].hndS || 1) : 1;
                let oHandDist = (obj.buildIndex < 0) ? (items.weapons[obj.weaponIndex].hndD || 1) : 1;

                let katanaMusket = (obj == player && obj.weapons[0] == 3 && obj.weapons[1] == 15);

                // TAIL/CAPE:
                if (obj.tailIndex > 0) {
                    renderTail(obj.tailIndex, ctxt, obj);
                }

                // WEAPON BELLOW HANDS:
                if (obj.buildIndex < 0 && !items.weapons[obj.weaponIndex].aboveHand) {
                    renderTool(items.weapons[katanaMusket ? 4 : obj.weaponIndex], config.weaponVariants[obj.weaponVariant].src, obj.scale, 0, ctxt);
                    if (items.weapons[obj.weaponIndex].projectile != undefined && !items.weapons[obj.weaponIndex].hideProjectile) {
                        renderProjectile(obj.scale, 0,
                                         items.projectiles[items.weapons[obj.weaponIndex].projectile], mainContext);
                    }
                }

                // HANDS:
                ctxt.fillStyle = config.skinColors[obj.skinColor];
                renderCircle(obj.scale * Math.cos(handAngle), (obj.scale * Math.sin(handAngle)), 14);
                renderCircle((obj.scale * oHandDist) * Math.cos(-handAngle * oHandAngle),
                             (obj.scale * oHandDist) * Math.sin(-handAngle * oHandAngle), 14);

                // WEAPON ABOVE HANDS:
                if (obj.buildIndex < 0 && items.weapons[obj.weaponIndex].aboveHand) {
                    renderTool(items.weapons[obj.weaponIndex], config.weaponVariants[obj.weaponVariant].src, obj.scale, 0, ctxt);
                    if (items.weapons[obj.weaponIndex].projectile != undefined && !items.weapons[obj.weaponIndex].hideProjectile) {
                        renderProjectile(obj.scale, 0,
                                         items.projectiles[items.weapons[obj.weaponIndex].projectile], mainContext);
                    }
                }

                // BUILD ITEM:
                if (obj.buildIndex >= 0) {
                    var tmpSprite = getItemSprite(items.list[obj.buildIndex]);
                    ctxt.drawImage(tmpSprite, obj.scale - items.list[obj.buildIndex].holdOffset, -tmpSprite.width / 2);
                }

                // BODY:
                renderCircle(0, 0, obj.scale, ctxt);

                // SKIN:
                if (obj.skinIndex > 0) {
                    ctxt.rotate(Math.PI / 2);
                    renderSkin(obj.skinIndex, ctxt, null, obj);
                }
            }
            // RENDER SKIN:
            function renderTextureSkin(index, ctxt, parentSkin, owner) {
                if (!(tmpSkin = skinSprites[index + (txt ? "lol" : 0)])) {
                    var tmpImage = new Image();
                    tmpImage.onload = function() {
                        this.isLoaded = true,
                            this.onload = null
                    }
                        ,
                        tmpImage.src = setSkinTextureImage(index, "hat", index),
                        skinSprites[index + (txt ? "lol" : 0)] = tmpImage,
                        tmpSkin = tmpImage
                }
                var tmpObj = parentSkin||skinPointers[index];
                if (!tmpObj) {
                    for (var i = 0; i < hats.length; ++i) {
                        if (hats[i].id == index) {
                            tmpObj = hats[i];
                            break;
                        }
                    }
                    skinPointers[index] = tmpObj;
                }
                if (tmpSkin.isLoaded)
                    ctxt.drawImage(tmpSkin, -tmpObj.scale/2, -tmpObj.scale/2, tmpObj.scale, tmpObj.scale);
                if (!parentSkin && tmpObj.topSprite) {
                    ctxt.save();
                    ctxt.rotate(owner.skinRot);
                    renderSkin(index + "_top", ctxt, tmpObj, owner);
                    ctxt.restore();
                }
            }

            var FlareZHat = {
                7: "https://i.imgur.com/vAOzlyY.png",
                15: "https://i.imgur.com/YRQ8Ybq.png",
                40: "https://i.imgur.com/Xzmg27N.png",
                26: "https://i.imgur.com/I0xGtyZ.png",
                55: "https://i.imgur.com/uYgDtcZ.png",
                20: "https://i.imgur.com/f5uhWCk.png",
            };

            function setSkinTextureImage(id, type, id2) {
                if (true) {
                    if(FlareZHat[id] && type == "hat") {
                        return FlareZHat[id];
                    } else {
                        if(type == "acc") {
                            return ".././img/accessories/access_" + id + ".png";
                        } else if(type == "hat") {
                            return ".././img/hats/hat_" + id + ".png";
                        } else {
                            return ".././img/weapons/" + id + ".png";
                        }
                    }
                } else {
                    if(type == "acc") {
                        return ".././img/accessories/access_" + id + ".png";
                    } else if(type == "hat") {
                        return ".././img/hats/hat_" + id + ".png";
                    } else {
                        return ".././img/weapons/" + id + ".png";
                    }
                }
            }

            // RENDER PLAYER:
            function renderPlayer(obj, ctxt) {
                ctxt = ctxt || mainContext;
                ctxt.lineWidth = outlineWidth;
                ctxt.lineJoin = "miter";
                let handAngle = (Math.PI / 4) * (items.weapons[obj.weaponIndex].armS || 1);
                let oHandAngle = (obj.buildIndex < 0) ? (items.weapons[obj.weaponIndex].hndS || 1) : 1;
                let oHandDist = (obj.buildIndex < 0) ? (items.weapons[obj.weaponIndex].hndD || 1) : 1;

                let katanaMusket = (obj == player && obj.weapons[0] == 3 && obj.weapons[1] == 15);

                // TAIL/CAPE:
                if (obj.tailIndex > 0) {
                    renderTail(obj.tailIndex, ctxt, obj);
                }

                // WEAPON BELLOW HANDS:
                if (obj.buildIndex < 0 && !items.weapons[obj.weaponIndex].aboveHand) {
                    renderTool(items.weapons[katanaMusket ? 4 : obj.weaponIndex], config.weaponVariants[obj.weaponVariant].src, obj.scale, 0, ctxt);
                    if (items.weapons[obj.weaponIndex].projectile != undefined && !items.weapons[obj.weaponIndex].hideProjectile) {
                        renderProjectile(obj.scale, 0,
                                         items.projectiles[items.weapons[obj.weaponIndex].projectile], mainContext);
                    }
                }

                // HANDS:
                ctxt.fillStyle = config.skinColors[obj.skinColor];
                renderCircle(obj.scale * Math.cos(handAngle), (obj.scale * Math.sin(handAngle)), 14);
                renderCircle((obj.scale * oHandDist) * Math.cos(-handAngle * oHandAngle),
                             (obj.scale * oHandDist) * Math.sin(-handAngle * oHandAngle), 14);

                // WEAPON ABOVE HANDS:
                if (obj.buildIndex < 0 && items.weapons[obj.weaponIndex].aboveHand) {
                    renderTool(items.weapons[obj.weaponIndex], config.weaponVariants[obj.weaponVariant].src, obj.scale, 0, ctxt);
                    if (items.weapons[obj.weaponIndex].projectile != undefined && !items.weapons[obj.weaponIndex].hideProjectile) {
                        renderProjectile(obj.scale, 0,
                                         items.projectiles[items.weapons[obj.weaponIndex].projectile], mainContext);
                    }
                }

                // BUILD ITEM:
                if (obj.buildIndex >= 0) {
                    var tmpSprite = getItemSprite(items.list[obj.buildIndex]);
                    ctxt.drawImage(tmpSprite, obj.scale - items.list[obj.buildIndex].holdOffset, -tmpSprite.width / 2);
                }

                // BODY:
                renderCircle(0, 0, obj.scale, ctxt);

                // SKIN:
                if (obj.skinIndex > 0) {
                    ctxt.rotate(Math.PI / 2);
                    renderSkin(obj.skinIndex, ctxt, null, obj);
                }

            }

            // RENDER SKINS:
            let skinSprites = {};
            let skinPointers = {};
            let tmpSkin;

            function renderSkin(index, ctxt, parentSkin, owner) {
                tmpSkin = skinSprites[index];
                if (!tmpSkin) {
                    let tmpImage = new Image();
                    tmpImage.onload = function() {
                        this.isLoaded = true;
                        this.onload = null;
                    };
                    tmpImage.src = "https://moomoo.io/img/hats/hat_" + index + ".png";
                    skinSprites[index] = tmpImage;
                    tmpSkin = tmpImage;
                }
                let tmpObj = parentSkin || skinPointers[index];
                if (!tmpObj) {
                    for (let i = 0; i < hats.length; ++i) {
                        if (hats[i].id == index) {
                            tmpObj = hats[i];
                            break;
                        }
                    }
                    skinPointers[index] = tmpObj;
                }
                if (tmpSkin.isLoaded)
                    ctxt.drawImage(tmpSkin, -tmpObj.scale / 2, -tmpObj.scale / 2, tmpObj.scale, tmpObj.scale);
                if (!parentSkin && tmpObj.topSprite) {
                    ctxt.save();
                    ctxt.rotate(owner.skinRot);
                    renderSkin(index + "_top", ctxt, tmpObj, owner);
                    ctxt.restore();
                }
            }

            // RENDER TAIL:
            let accessSprites = {};
            let accessPointers = {};

            function renderTail(index, ctxt, owner) {
                tmpSkin = accessSprites[index];
                if (!tmpSkin) {
                    let tmpImage = new Image();
                    tmpImage.onload = function() {
                        this.isLoaded = true;
                        this.onload = null;
                    };
                    tmpImage.src = "https://moomoo.io/img/accessories/access_" + index + ".png";
                    accessSprites[index] = tmpImage;
                    tmpSkin = tmpImage;
                }
                let tmpObj = accessPointers[index];
                if (!tmpObj) {
                    for (let i = 0; i < accessories.length; ++i) {
                        if (accessories[i].id == index) {
                            tmpObj = accessories[i];
                            break;
                        }
                    }
                    accessPointers[index] = tmpObj;
                }
                if (tmpSkin.isLoaded) {
                    ctxt.save();
                    ctxt.translate(-20 - (tmpObj.xOff || 0), 0);
                    if (tmpObj.spin)
                        ctxt.rotate(owner.skinRot);
                    ctxt.drawImage(tmpSkin, -(tmpObj.scale / 2), -(tmpObj.scale / 2), tmpObj.scale, tmpObj.scale);
                    ctxt.restore();
                }
            }

            // RENDER TOOL:
            let toolSprites = {};

            function renderTool(obj, variant, x, y, ctxt) {
                let tmpSrc = obj.src + (variant || "");
                let tmpSprite = toolSprites[tmpSrc];
                if (!tmpSprite) {
                    tmpSprite = new Image();
                    tmpSprite.onload = function() {
                        this.isLoaded = true;
                    }
                    tmpSprite.src = "https://moomoo.io/img/weapons/" + tmpSrc + ".png";
                    toolSprites[tmpSrc] = tmpSprite;
                }
                if (tmpSprite.isLoaded)
                    ctxt.drawImage(tmpSprite, x + obj.xOff - (obj.length / 2), y + obj.yOff - (obj.width / 2), obj.length, obj.width);
            }

            // RENDER PROJECTILES:
            function renderProjectiles(layer, xOffset, yOffset) {
                for (let i = 0; i < projectiles.length; i++) {
                    tmpObj = projectiles[i];
                    if (tmpObj.active && tmpObj.layer == layer && tmpObj.inWindow) {
                        tmpObj.update(delta);
                        if (tmpObj.active && isOnScreen(tmpObj.x - xOffset, tmpObj.y - yOffset, tmpObj.scale)) {
                            mainContext.save();
                            mainContext.translate(tmpObj.x - xOffset, tmpObj.y - yOffset);
                            mainContext.rotate(tmpObj.dir);
                            renderProjectile(0, 0, tmpObj, mainContext, 1);
                            mainContext.restore();
                        }
                    }
                };
            }

            // RENDER PROJECTILE:
            let projectileSprites = {};

            function renderProjectile(x, y, obj, ctxt, debug) {
                if (obj.src) {
                    let tmpSrc = items.projectiles[obj.indx].src;
                    let tmpSprite = projectileSprites[tmpSrc];
                    if (!tmpSprite) {
                        tmpSprite = new Image();
                        tmpSprite.onload = function() {
                            this.isLoaded = true;
                        }
                        tmpSprite.src = "https://moomoo.io/img/weapons/" + tmpSrc + ".png";
                        projectileSprites[tmpSrc] = tmpSprite;
                    }
                    if (tmpSprite.isLoaded)
                        ctxt.drawImage(tmpSprite, x - (obj.scale / 2), y - (obj.scale / 2), obj.scale, obj.scale);
                } else if (obj.indx == 1) {
                    ctxt.fillStyle = "#939393";
                    renderCircle(x, y, obj.scale, ctxt);
                }
            }

            // RENDER AI:
            let aiSprites = {};

            function renderAI(obj, ctxt) {
                let tmpIndx = obj.index;
                let tmpSprite = aiSprites[tmpIndx];
                if (!tmpSprite) {
                    let tmpImg = new Image();
                    tmpImg.onload = function() {
                        this.isLoaded = true;
                        this.onload = null;
                    };
                    tmpImg.src = "https://moomoo.io/img/animals/" + obj.src + ".png";
                    tmpSprite = tmpImg;
                    aiSprites[tmpIndx] = tmpSprite;
                }
                if (tmpSprite.isLoaded) {
                    let tmpScale = obj.scale * 1.2 * (obj.spriteMlt || 1);
                    ctxt.drawImage(tmpSprite, -tmpScale, -tmpScale, tmpScale * 2, tmpScale * 2);
                }
            }

            // RENDER WATER BODIES:
            function renderWaterBodies(xOffset, yOffset, ctxt, padding) {

                // MIDDLE RIVER:
                let tmpW = config.riverWidth + padding;
                let tmpY = (config.mapScale / 2) - yOffset - (tmpW / 2);
                if (tmpY < maxScreenHeight && tmpY + tmpW > 0) {
                    ctxt.fillRect(0, tmpY, maxScreenWidth, tmpW);
                }
            }

            // RENDER GAME OBJECTS:
            let gameObjectSprites = {};

            function getResSprite(obj) {
                let biomeID = (obj.y >= config.mapScale - config.snowBiomeTop) ? 2 : ((obj.y <= config.snowBiomeTop) ? 1 : 0);
                let tmpIndex = (obj.type + "_" + obj.scale + "_" + biomeID);
                let tmpSprite = gameObjectSprites[tmpIndex];
                if (!tmpSprite) {
                    let blurScale = 6;
                    let tmpCanvas = document.createElement("canvas");
                    tmpCanvas.width = tmpCanvas.height = (obj.scale * 2.1) + outlineWidth;
                    let tmpContext = tmpCanvas.getContext('2d');
                    tmpContext.translate((tmpCanvas.width / 2), (tmpCanvas.height / 2));
                    tmpContext.rotate(UTILS.randFloat(0, Math.PI));
                    tmpContext.strokeStyle = outlineColor;
                    tmpContext.lineWidth = outlineWidth;
                    if (isNight) {
                        tmpContext.shadowBlur = blurScale;
                        tmpContext.shadowColor = `rgba(0, 0, 0, ${obj.alpha})`;
                    }
                    if (obj.type == 0) {
                        let tmpScale;
                        let tmpCount = UTILS.randInt(5, 7);
                        tmpContext.globalAlpha = isNight ? 0.8 : 0.8;
                        for (let i = 0; i < 2; ++i) {
                            tmpScale = tmpObj.scale * (!i ? 1 : 0.5);
                            renderStar(tmpContext, tmpCount, tmpScale, tmpScale * 0.7);
                            tmpContext.fillStyle = !biomeID ? (!i ? "#9ebf57" : "#b4db62") : (!i ? "#e3f1f4" : "#fff");
                            tmpContext.fill();
                            if (!i) {
                                tmpContext.stroke();
                                tmpContext.shadowBlur = null;
                                tmpContext.shadowColor = null;
                                tmpContext.globalAlpha = 1;
                            }
                        }
                    } else if (obj.type == 1) {
                        if (biomeID == 2) {
                            tmpContext.fillStyle = "#606060";
                            renderStar(tmpContext, 6, obj.scale * 0.3, obj.scale * 0.71);
                            tmpContext.fill();
                            tmpContext.stroke();

                            //tmpContext.shadowBlur = null;
                            //tmpContext.shadowColor = null;

                            tmpContext.fillStyle = "#89a54c";
                            renderCircle(0, 0, obj.scale * 0.55, tmpContext);
                            tmpContext.fillStyle = "#a5c65b";
                            renderCircle(0, 0, obj.scale * 0.3, tmpContext, true);
                        } else {
                            renderBlob(tmpContext, 6, tmpObj.scale, tmpObj.scale * 0.7);
                            tmpContext.fillStyle = biomeID ? "#e3f1f4" : "#89a54c";
                            tmpContext.fill();
                            tmpContext.stroke();

                            //tmpContext.shadowBlur = null;
                            //tmpContext.shadowColor = null;

                            tmpContext.fillStyle = biomeID ? "#6a64af" : "#c15555";
                            let tmpRange;
                            let berries = 4;
                            let rotVal = (Math.PI * 2) / berries;
                            for (let i = 0; i < berries; ++i) {
                                tmpRange = UTILS.randInt(tmpObj.scale / 3.5, tmpObj.scale / 2.3);
                                renderCircle(tmpRange * Math.cos(rotVal * i), tmpRange * Math.sin(rotVal * i),
                                             UTILS.randInt(10, 12), tmpContext);
                            }
                        }
                    } else if (obj.type == 2 || obj.type == 3) {
                        tmpContext.fillStyle = (obj.type == 2) ? (biomeID == 2 ? "#938d77" : "#939393") : "#e0c655";
                        renderStar(tmpContext, 3, obj.scale, obj.scale);
                        tmpContext.fill();
                        tmpContext.stroke();

                        tmpContext.shadowBlur = null;
                        tmpContext.shadowColor = null;

                        tmpContext.fillStyle = (obj.type == 2) ? (biomeID == 2 ? "#b2ab90" : "#bcbcbc") : "#ebdca3";
                        renderStar(tmpContext, 3, obj.scale * 0.55, obj.scale * 0.65);
                        tmpContext.fill();
                    }
                    tmpSprite = tmpCanvas;
                    gameObjectSprites[tmpIndex] = tmpSprite;
                }
                return tmpSprite;
            }

            // GET ITEM SPRITE:
            let itemSprites = [];

            function getItemSprite(obj, asIcon) {
                let tmpSprite = itemSprites[obj.id];
                if (!tmpSprite || asIcon) {
                    let blurScale = !asIcon && isNight ? 20 : 5;
                    let tmpCanvas = document.createElement("canvas");
                    let reScale = ((!asIcon && obj.name == "windmill") ? items.list[4].scale : obj.scale);
                    tmpCanvas.width = tmpCanvas.height = (reScale * 2.5) + outlineWidth + (items.list[obj.id].spritePadding || 0) + blurScale;
                    if (config.useWebGl) {
                        let gl = tmpCanvas.getContext("webgl");
                        gl.clearColor(0, 0, 0, 0);
                        gl.clear(gl.COLOR_BUFFER_BIT);

                        let buffer = gl.createBuffer();
                        gl.bindBuffer(gl.ARRAY_BUFFER, buffer);

                        function render(vs, fs, vertice, type) {

                            let vShader = gl.createShader(gl.VERTEX_SHADER);
                            gl.shaderSource(vShader, vs);
                            gl.compileShader(vShader);
                            gl.getShaderParameter(vShader, gl.COMPILE_STATUS);

                            let fShader = gl.createShader(gl.FRAGMENT_SHADER);
                            gl.shaderSource(fShader, fs);
                            gl.compileShader(fShader);
                            gl.getShaderParameter(fShader, gl.COMPILE_STATUS);

                            let program = gl.createProgram();
                            gl.attachShader(program, vShader);
                            gl.attachShader(program, fShader);
                            gl.linkProgram(program);
                            gl.getProgramParameter(program, gl.LINK_STATUS);
                            gl.useProgram(program);

                            let vertex = gl.getAttribLocation(program, "vertex");
                            gl.enableVertexAttribArray(vertex);
                            gl.vertexAttribPointer(vertex, 2, gl.FLOAT, false, 0, 0);

                            let vertices = vertice.length / 2;
                            gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertice), gl.DYNAMIC_DRAW);
                            gl.drawArrays(type, 0, vertices);
                        }

                        function hexToRgb(hex) {
                            return hex.slice(1).match(/.{1,2}/g).map(g => parseInt(g, 16));
                        }

                        function getRgb(r, g, b) {
                            return [r / 255, g / 255, b / 255].join(", ");
                        }

                        let max = 100;
                        for (let i = 0; i < max; i++) {
                            let radian = (Math.PI * (i / (max / 2)));
                            render(`
                            precision mediump float;
                            attribute vec2 vertex;
                            void main(void) {
                                gl_Position = vec4(vertex, 0, 1);
                            }
                            `, `
                            precision mediump float;
                            void main(void) {
                                gl_FragColor = vec4(${getRgb(...hexToRgb("#fff"))}, 1);
                            }
                            `, [
                                0 + (Math.cos(radian) * 0.5), 0 + (Math.sin(radian) * 0.5),
                                0, 0,
                            ], gl.LINE_LOOP);
                        }
                    } else {
                        let tmpContext = tmpCanvas.getContext("2d");
                        tmpContext.translate((tmpCanvas.width / 2), (tmpCanvas.height / 2));
                        tmpContext.rotate(asIcon ? 0 : (Math.PI / 2));
                        tmpContext.strokeStyle = outlineColor;
                        tmpContext.lineWidth = outlineWidth * (asIcon ? (tmpCanvas.width / 81) : 1);
                        if (isNight && !asIcon) {
                            tmpContext.shadowBlur = 8; // Increase this value for a stronger blur
                            tmpContext.shadowColor = `rgba(0, 0, 0, ${Math.min(obj.name == "pit trap" ? 0.8 : 0.5, obj.alpha)})`;
                        }

                        if (obj.name == "apple") {
                            tmpContext.fillStyle = "#c15555";
                            renderCircle(0, 0, obj.scale, tmpContext);
                            tmpContext.fillStyle = "#89a54c";
                            let leafDir = -(Math.PI / 2);
                            renderLeaf(obj.scale * Math.cos(leafDir), obj.scale * Math.sin(leafDir),
                                       25, leafDir + Math.PI / 2, tmpContext);
                        } else if (obj.name == "cookie") {
                            tmpContext.fillStyle = "#cca861";
                            renderCircle(0, 0, obj.scale, tmpContext);
                            tmpContext.fillStyle = "#937c4b";
                            let chips = 4;
                            let rotVal = (Math.PI * 2) / chips;
                            let tmpRange;
                            for (let i = 0; i < chips; ++i) {
                                tmpRange = UTILS.randInt(obj.scale / 2.5, obj.scale / 1.7);
                                renderCircle(tmpRange * Math.cos(rotVal * i), tmpRange * Math.sin(rotVal * i),
                                             UTILS.randInt(4, 5), tmpContext, true);
                            }
                        } else if (obj.name == "cheese") {
                            tmpContext.fillStyle = "#f4f3ac";
                            renderCircle(0, 0, obj.scale, tmpContext);
                            tmpContext.fillStyle = "#c3c28b";
                            let chips = 4;
                            let rotVal = (Math.PI * 2) / chips;
                            let tmpRange;
                            for (let i = 0; i < chips; ++i) {
                                tmpRange = UTILS.randInt(obj.scale / 2.5, obj.scale / 1.7);
                                renderCircle(tmpRange * Math.cos(rotVal * i), tmpRange * Math.sin(rotVal * i),
                                             UTILS.randInt(4, 5), tmpContext, true);
                            }
                        } else if (obj.name == "wood wall" || obj.name == "stone wall" || obj.name == "castle wall") {
                            tmpContext.fillStyle = (obj.name == "castle wall") ? "#83898e" : (obj.name == "wood wall") ?
                                "#a5974c" : "#939393";
                            let sides = (obj.name == "castle wall") ? 4 : 3;
                            renderStar(tmpContext, sides, obj.scale * 1.1, obj.scale * 1.1);
                            tmpContext.fill();
                            tmpContext.stroke();
                            tmpContext.fillStyle = (obj.name == "castle wall") ? "#9da4aa" : (obj.name == "wood wall") ?
                                "#c9b758" : "#bcbcbc";
                            renderStar(tmpContext, sides, obj.scale * 0.65, obj.scale * 0.65);
                            tmpContext.fill();
                        } else if (obj.name == "spikes" || obj.name == "greater spikes" || obj.name == "poison spikes" ||
                                   obj.name == "spinning spikes") {
                            tmpContext.fillStyle = (obj.name == "poison spikes") ? "#7b935d" : "#939393";
                            let tmpScale = (obj.scale * 0.6);
                            renderStar(tmpContext, (obj.name == "spikes") ? 5 : 6, obj.scale, tmpScale);
                            tmpContext.fill();
                            tmpContext.stroke();
                            tmpContext.fillStyle = "#a5974c";
                            renderCircle(0, 0, tmpScale, tmpContext);
                            tmpContext.fillStyle = "#c9b758";
                            renderCircle(0, 0, tmpScale / 2, tmpContext, true);
                        } else if (obj.name == "windmill" || obj.name == "faster windmill" || obj.name == "power mill") {
                            tmpContext.fillStyle = "#a5974c";
                            renderCircle(0, 0, reScale, tmpContext);
                            tmpContext.fillStyle = "#c9b758";
                            renderRectCircle(0, 0, reScale * 1.5, 29, 4, tmpContext);
                            tmpContext.fillStyle = "#a5974c";
                            renderCircle(0, 0, reScale * 0.5, tmpContext);
                        } else if (obj.name == "mine") {
                            tmpContext.fillStyle = "#939393";
                            renderStar(tmpContext, 3, obj.scale, obj.scale);
                            tmpContext.fill();
                            tmpContext.stroke();
                            tmpContext.fillStyle = "#bcbcbc";
                            renderStar(tmpContext, 3, obj.scale * 0.55, obj.scale * 0.65);
                            tmpContext.fill();
                        } else if (obj.name == "sapling") {
                            for (let i = 0; i < 2; ++i) {
                                let tmpScale = obj.scale * (!i ? 1 : 0.5);
                                renderStar(tmpContext, 7, tmpScale, tmpScale * 0.7);
                                tmpContext.fillStyle = (!i ? "#9ebf57" : "#b4db62");
                                tmpContext.fill();
                                if (!i) tmpContext.stroke();
                            }
                        } else if (obj.name == "pit trap") {
                            tmpContext.fillStyle = "#a5974c";
                            renderStar(tmpContext, 3, obj.scale * 1.1, obj.scale * 1.1);
                            tmpContext.fill();
                            tmpContext.stroke();
                            tmpContext.fillStyle = outlineColor;
                            renderStar(tmpContext, 3, obj.scale * 0.65, obj.scale * 0.65);
                            tmpContext.fill();
                        } else if (obj.name == "boost pad") {
                            tmpContext.fillStyle = "#7e7f82";
                            renderRect(0, 0, obj.scale * 2, obj.scale * 2, tmpContext);
                            tmpContext.fill();
                            tmpContext.stroke();
                            tmpContext.fillStyle = "#dbd97d";
                            renderTriangle(obj.scale * 1, tmpContext);
                        } else if (obj.name == "turret") {
                            tmpContext.fillStyle = "#a5974c";
                            renderCircle(0, 0, obj.scale, tmpContext);
                            tmpContext.fill();
                            tmpContext.stroke();
                            tmpContext.fillStyle = "#939393";
                            let tmpLen = 50;
                            renderRect(0, -tmpLen / 2, obj.scale * 0.9, tmpLen, tmpContext);
                            renderCircle(0, 0, obj.scale * 0.6, tmpContext);
                            tmpContext.fill();
                            tmpContext.stroke();
                        } else if (obj.name == "platform") {
                            tmpContext.fillStyle = "#cebd5f";
                            let tmpCount = 4;
                            let tmpS = obj.scale * 2;
                            let tmpW = tmpS / tmpCount;
                            let tmpX = -(obj.scale / 2);
                            for (let i = 0; i < tmpCount; ++i) {
                                renderRect(tmpX - (tmpW / 2), 0, tmpW, obj.scale * 2, tmpContext);
                                tmpContext.fill();
                                tmpContext.stroke();
                                tmpX += tmpS / tmpCount;
                            }
                        } else if (obj.name == "healing pad") {
                            tmpContext.fillStyle = "#7e7f82";
                            renderRect(0, 0, obj.scale * 2, obj.scale * 2, tmpContext);
                            tmpContext.fill();
                            tmpContext.stroke();
                            tmpContext.fillStyle = "#db6e6e";
                            renderRectCircle(0, 0, obj.scale * 0.65, 20, 4, tmpContext, true);
                        } else if (obj.name == "spawn pad") {
                            tmpContext.fillStyle = "#7e7f82";
                            renderRect(0, 0, obj.scale * 2, obj.scale * 2, tmpContext);
                            tmpContext.fill();
                            tmpContext.stroke();
                            tmpContext.fillStyle = "#71aad6";
                            renderCircle(0, 0, obj.scale * 0.6, tmpContext);
                        } else if (obj.name == "blocker") {
                            tmpContext.fillStyle = "#7e7f82";
                            renderCircle(0, 0, obj.scale, tmpContext);
                            tmpContext.fill();
                            tmpContext.stroke();
                            tmpContext.rotate(Math.PI / 4);
                            tmpContext.fillStyle = "#db6e6e";
                            renderRectCircle(0, 0, obj.scale * 0.65, 20, 4, tmpContext, true);
                        } else if (obj.name == "teleporter") {
                            tmpContext.fillStyle = "#7e7f82";
                            renderCircle(0, 0, obj.scale, tmpContext);
                            tmpContext.fill();
                            tmpContext.stroke();
                            tmpContext.rotate(Math.PI / 4);
                            tmpContext.fillStyle = "#d76edb";
                            renderCircle(0, 0, obj.scale * 0.5, tmpContext, true);
                        }
                    }
                    tmpSprite = tmpCanvas;
                    if (!asIcon)
                        itemSprites[obj.id] = tmpSprite;
                }
                return tmpSprite;
            }

            function getItemSprite2(obj, tmpX, tmpY) {
                let tmpContext = mainContext;
                let reScale = (obj.name == "windmill" ? items.list[4].scale : obj.scale);
                tmpContext.save();
                tmpContext.translate(tmpX, tmpY);
                tmpContext.rotate(obj.dir);
                tmpContext.strokeStyle = outlineColor;
                tmpContext.lineWidth = outlineWidth;
                if (obj.name == "apple") {
                    tmpContext.fillStyle = "#c15555";
                    renderCircle(0, 0, obj.scale, tmpContext);
                    tmpContext.fillStyle = "#89a54c";
                    let leafDir = -(Math.PI / 2);
                    renderLeaf(obj.scale * Math.cos(leafDir), obj.scale * Math.sin(leafDir),
                               25, leafDir + Math.PI / 2, tmpContext);
                } else if (obj.name == "cookie") {
                    tmpContext.fillStyle = "#cca861";
                    renderCircle(0, 0, obj.scale, tmpContext);
                    tmpContext.fillStyle = "#937c4b";
                    let chips = 4;
                    let rotVal = (Math.PI * 2) / chips;
                    let tmpRange;
                    for (let i = 0; i < chips; ++i) {
                        tmpRange = UTILS.randInt(obj.scale / 2.5, obj.scale / 1.7);
                        renderCircle(tmpRange * Math.cos(rotVal * i), tmpRange * Math.sin(rotVal * i),
                                     UTILS.randInt(4, 5), tmpContext, true);
                    }
                } else if (obj.name == "cheese") {
                    tmpContext.fillStyle = "#f4f3ac";
                    renderCircle(0, 0, obj.scale, tmpContext);
                    tmpContext.fillStyle = "#c3c28b";
                    let chips = 4;
                    let rotVal = (Math.PI * 2) / chips;
                    let tmpRange;
                    for (let i = 0; i < chips; ++i) {
                        tmpRange = UTILS.randInt(obj.scale / 2.5, obj.scale / 1.7);
                        renderCircle(tmpRange * Math.cos(rotVal * i), tmpRange * Math.sin(rotVal * i),
                                     UTILS.randInt(4, 5), tmpContext, true);
                    }
                } else if (obj.name == "wood wall" || obj.name == "stone wall" || obj.name == "castle wall") {
                    tmpContext.fillStyle = (obj.name == "castle wall") ? "#83898e" : (obj.name == "wood wall") ?
                        "#a5974c" : "#939393";
                    let sides = (obj.name == "castle wall") ? 4 : 3;
                    renderStar(tmpContext, sides, obj.scale * 1.1, obj.scale * 1.1);
                    tmpContext.fill();
                    tmpContext.stroke();
                    tmpContext.fillStyle = (obj.name == "castle wall") ? "#9da4aa" : (obj.name == "wood wall") ?
                        "#c9b758" : "#bcbcbc";
                    renderStar(tmpContext, sides, obj.scale * 0.65, obj.scale * 0.65);
                    tmpContext.fill();
                } else if (obj.name == "spikes" || obj.name == "greater spikes" || obj.name == "poison spikes" ||
                           obj.name == "spinning spikes") {
                    tmpContext.fillStyle = (obj.name == "poison spikes") ? "#7b935d" : "#939393";
                    let tmpScale = (obj.scale * 0.6);
                    renderStar(tmpContext, (obj.name == "spikes") ? 5 : 6, obj.scale, tmpScale);
                    tmpContext.fill();
                    tmpContext.stroke();
                    tmpContext.fillStyle = "#a5974c";
                    renderCircle(0, 0, tmpScale, tmpContext);
                    tmpContext.fillStyle = "#c9b758";
                    renderCircle(0, 0, tmpScale / 2, tmpContext, true);
                } else if (obj.name == "windmill" || obj.name == "faster windmill" || obj.name == "power mill") {
                    tmpContext.fillStyle = "#a5974c";
                    renderCircle(0, 0, reScale, tmpContext);
                    tmpContext.fillStyle = "#c9b758";
                    renderRectCircle(0, 0, reScale * 1.5, 29, 4, tmpContext);
                    tmpContext.fillStyle = "#a5974c";
                    renderCircle(0, 0, reScale * 0.5, tmpContext);
                } else if (obj.name == "mine") {
                    tmpContext.fillStyle = "#939393";
                    renderStar(tmpContext, 3, obj.scale, obj.scale);
                    tmpContext.fill();
                    tmpContext.stroke();
                    tmpContext.fillStyle = "#bcbcbc";
                    renderStar(tmpContext, 3, obj.scale * 0.55, obj.scale * 0.65);
                    tmpContext.fill();
                } else if (obj.name == "sapling") {
                    for (let i = 0; i < 2; ++i) {
                        let tmpScale = obj.scale * (!i ? 1 : 0.5);
                        renderStar(tmpContext, 7, tmpScale, tmpScale * 0.7);
                        tmpContext.fillStyle = (!i ? "#9ebf57" : "#b4db62");
                        tmpContext.fill();
                        if (!i) tmpContext.stroke();
                    }
                } else if (obj.name == "pit trap") {
                    tmpContext.fillStyle = "#a5974c";
                    renderStar(tmpContext, 3, obj.scale * 1.1, obj.scale * 1.1);
                    tmpContext.fill();
                    tmpContext.stroke();
                    tmpContext.fillStyle = outlineColor;
                    renderStar(tmpContext, 3, obj.scale * 0.65, obj.scale * 0.65);
                    tmpContext.fill();
                } else if (obj.name == "boost pad") {
                    tmpContext.fillStyle = "#7e7f82";
                    renderRect(0, 0, obj.scale * 2, obj.scale * 2, tmpContext);
                    tmpContext.fill();
                    tmpContext.stroke();
                    tmpContext.fillStyle = "#dbd97d";
                    renderTriangle(obj.scale * 1, tmpContext);
                } else if (obj.name == "turret") {
                    tmpContext.fillStyle = "#a5974c";
                    renderCircle(0, 0, obj.scale, tmpContext);
                    tmpContext.fill();
                    tmpContext.stroke();
                    tmpContext.fillStyle = "#939393";
                    let tmpLen = 50;
                    renderRect(0, -tmpLen / 2, obj.scale * 0.9, tmpLen, tmpContext);
                    renderCircle(0, 0, obj.scale * 0.6, tmpContext);
                    tmpContext.fill();
                    tmpContext.stroke();
                } else if (obj.name == "platform") {
                    tmpContext.fillStyle = "#cebd5f";
                    let tmpCount = 4;
                    let tmpS = obj.scale * 2;
                    let tmpW = tmpS / tmpCount;
                    let tmpX = -(obj.scale / 2);
                    for (let i = 0; i < tmpCount; ++i) {
                        renderRect(tmpX - (tmpW / 2), 0, tmpW, obj.scale * 2, tmpContext);
                        tmpContext.fill();
                        tmpContext.stroke();
                        tmpX += tmpS / tmpCount;
                    }
                } else if (obj.name == "healing pad") {
                    tmpContext.fillStyle = "#7e7f82";
                    renderRect(0, 0, obj.scale * 2, obj.scale * 2, tmpContext);
                    tmpContext.fill();
                    tmpContext.stroke();
                    tmpContext.fillStyle = "#db6e6e";
                    renderRectCircle(0, 0, obj.scale * 0.65, 20, 4, tmpContext, true);
                } else if (obj.name == "spawn pad") {
                    tmpContext.fillStyle = "#7e7f82";
                    renderRect(0, 0, obj.scale * 2, obj.scale * 2, tmpContext);
                    tmpContext.fill();
                    tmpContext.stroke();
                    tmpContext.fillStyle = "#71aad6";
                    renderCircle(0, 0, obj.scale * 0.6, tmpContext);
                } else if (obj.name == "blocker") {
                    tmpContext.fillStyle = "#7e7f82";
                    renderCircle(0, 0, obj.scale, tmpContext);
                    tmpContext.fill();
                    tmpContext.stroke();
                    tmpContext.rotate(Math.PI / 4);
                    tmpContext.fillStyle = "#db6e6e";
                    renderRectCircle(0, 0, obj.scale * 0.65, 20, 4, tmpContext, true);
                } else if (obj.name == "teleporter") {
                    tmpContext.fillStyle = "#7e7f82";
                    renderCircle(0, 0, obj.scale, tmpContext);
                    tmpContext.fill();
                    tmpContext.stroke();
                    tmpContext.rotate(Math.PI / 4);
                    tmpContext.fillStyle = "#d76edb";
                    renderCircle(0, 0, obj.scale * 0.5, tmpContext, true);
                }
                tmpContext.restore();
            }

            let objSprites = [];

            function getObjSprite(obj) {
                let tmpSprite = objSprites[obj.id];
                if (!tmpSprite) {
                    let blurScale = isNight ? 20 : 0;
                    let tmpCanvas = document.createElement("canvas");
                    tmpCanvas.width = tmpCanvas.height = obj.scale * 2.5 + outlineWidth + (items.list[obj.id].spritePadding || 0) + blurScale;
                    let tmpContext = tmpCanvas.getContext("2d");
                    tmpContext.translate(tmpCanvas.width / 2, tmpCanvas.height / 2);
                    tmpContext.rotate(Math.PI / 2);
                    tmpContext.strokeStyle = outlineColor;
                    tmpContext.lineWidth = outlineWidth;
                    if (isNight) {
                        tmpContext.shadowBlur = 20;
                        tmpContext.shadowColor = `rgba(0, 0, 0, ${Math.min(0.3, obj.alpha)})`;
                    }
                    if (obj.name == "spikes" || obj.name == "greater spikes" || obj.name == "poison spikes" || obj.name == "spinning spikes") {
                        tmpContext.fillStyle = obj.name == "poison spikes" ? "#7b935d" : "#939393";
                        let tmpScale = obj.scale * 0.6;
                        renderStar(tmpContext, obj.name == "spikes" ? 5 : 6, obj.scale, tmpScale);
                        tmpContext.fill();
                        tmpContext.stroke();
                        tmpContext.fillStyle = "#a5974c";
                        renderCircle(0, 0, tmpScale, tmpContext);
                        tmpContext.fillStyle = "#cc5151";
                        renderCircle(0, 0, tmpScale / 2, tmpContext, true);
                    } else if (obj.name == "pit trap") {
                        tmpContext.fillStyle = "#a5974c";
                        renderStar(tmpContext, 3, obj.scale * 1.1, obj.scale * 1.1);
                        tmpContext.fill();
                        tmpContext.stroke();
                        tmpContext.fillStyle = "#cc5151";
                        renderStar(tmpContext, 3, obj.scale * 0.65, obj.scale * 0.65);
                        tmpContext.fill();
                    }
                    tmpSprite = tmpCanvas;
                    objSprites[obj.id] = tmpSprite;
                }
                return tmpSprite;
            }

            // GET MARK SPRITE:
            function getMarkSprite(obj, tmpContext, tmpX, tmpY) {
                let center = {
                    x: screenWidth / 2,
                    y: screenHeight / 2,
                };
                tmpContext.lineWidth = outlineWidth;
                mainContext.globalAlpha = 0.8;
                tmpContext.strokeStyle = outlineColor;
                tmpContext.save();
                tmpContext.translate(tmpX, tmpY);
                tmpContext.rotate(obj.dir || getAttackDir());
                if (obj.name == "spikes" || obj.name == "greater spikes" || obj.name == "poison spikes" || obj.name == "spinning spikes") {
                    tmpContext.fillStyle = (obj.name == "poison spikes")?"#7b935d":"#939393";
                    var tmpScale = (obj.scale * 0.6);
                    renderStar(tmpContext, (obj.name == "spikes")?5:6, obj.scale, tmpScale);
                    tmpContext.fill();
                    tmpContext.stroke();
                    tmpContext.fillStyle = "#a5974c";
                    renderCircle(0, 0, tmpScale, tmpContext);
                    if (player && obj.owner && player.sid != obj.owner.sid && !tmpObj.findAllianceBySid(obj.owner.sid)) {
                        tmpContext.fillStyle = "#a34040";
                    } else {
                        tmpContext.fillStyle = "#c9b758";
                    }
                    renderCircle(0, 0, tmpScale/2, tmpContext, true);
                } else if (obj.name == "turret") {
                    tmpContext.fillStyle = "#a5974c";
                    renderCircle(0, 0, obj.scale, tmpContext);
                    tmpContext.fill();
                    tmpContext.stroke();
                    tmpContext.fillStyle = "#939393";
                    let tmpLen = 50;
                    renderRect(0, -tmpLen / 2, obj.scale * 0.9, tmpLen, tmpContext);
                    renderCircle(0, 0, obj.scale * 0.6, tmpContext);
                    tmpContext.fill();
                    tmpContext.stroke();
                } else if (obj.name == "teleporter") {
                    tmpContext.fillStyle = "#7e7f82";
                    renderCircle(0, 0, obj.scale, tmpContext);
                    tmpContext.fill();
                    tmpContext.stroke();
                    tmpContext.rotate(Math.PI / 4);
                    tmpContext.fillStyle = "#d76edb";
                    renderCircle(0, 0, obj.scale * 0.5, tmpContext, true);
                } else if (obj.name == "platform") {
                    tmpContext.fillStyle = "#cebd5f";
                    let tmpCount = 4;
                    let tmpS = obj.scale * 2;
                    let tmpW = tmpS / tmpCount;
                    let tmpX = -(obj.scale / 2);
                    for (let i = 0; i < tmpCount; ++i) {
                        renderRect(tmpX - (tmpW / 2), 0, tmpW, obj.scale * 2, tmpContext);
                        tmpContext.fill();
                        tmpContext.stroke();
                        tmpX += tmpS / tmpCount;
                    }
                } else if (obj.name == "healing pad") {
                    tmpContext.fillStyle = "#7e7f82";
                    renderRect(0, 0, obj.scale * 2, obj.scale * 2, tmpContext);
                    tmpContext.fill();
                    tmpContext.stroke();
                    tmpContext.fillStyle = "#db6e6e";
                    renderRectCircle(0, 0, obj.scale * 0.65, 20, 4, tmpContext, true);
                } else if (obj.name == "spawn pad") {
                    tmpContext.fillStyle = "#7e7f82";
                    renderRect(0, 0, obj.scale * 2, obj.scale * 2, tmpContext);
                    tmpContext.fill();
                    tmpContext.stroke();
                    tmpContext.fillStyle = "#71aad6";
                    renderCircle(0, 0, obj.scale * 0.6, tmpContext);
                } else if (obj.name == "blocker") {
                    tmpContext.fillStyle = "#7e7f82";
                    renderCircle(0, 0, obj.scale, tmpContext);
                    tmpContext.fill();
                    tmpContext.stroke();
                    tmpContext.rotate(Math.PI / 4);
                    tmpContext.fillStyle = "#db6e6e";
                    renderRectCircle(0, 0, obj.scale * 0.65, 20, 4, tmpContext, true);
                } else if (obj.name == "windmill" || obj.name == "faster windmill" || obj.name == "power mill") {
                    tmpContext.fillStyle = "#a5974c";
                    renderCircle(0, 0, obj.scale, tmpContext);
                    tmpContext.fillStyle = "#c9b758";
                    renderRectCircle(0, 0, obj.scale * 1.5, 29, 4, tmpContext);
                    tmpContext.fillStyle = "#a5974c";
                    renderCircle(0, 0, obj.scale * 0.5, tmpContext);
                } else if (obj.name == "pit trap") {
                    tmpContext.fillStyle = "#a5974c";
                    renderStar(tmpContext, 3, obj.scale * 1.1, obj.scale * 1.1);
                    tmpContext.fill();
                    tmpContext.stroke();
                    if (player && obj.owner && player.sid != obj.owner.sid && !tmpObj.findAllianceBySid(obj.owner.sid)) {
                        tmpContext.fillStyle = "#a34040";
                    } else {
                        tmpContext.fillStyle = outlineColor;
                    }
                    renderStar(tmpContext, 3, obj.scale * 0.65, obj.scale * 0.65);
                    tmpContext.fill();
                }
                tmpContext.restore();
            }
            //renderCircle(tmpObj.x - xOffset, tmpObj.y - yOffset, tmpObj.getScale(0.6, true), mainContext, false, true);

            // OBJECT ON SCREEN:
            function isOnScreen(x, y, s) {
                return (x + s >= 0 && x - s <= maxScreenWidth && y + s >= 0 && (y,
                                                                                s,
                                                                                maxScreenHeight));
            }

            // RENDER GAME OBJECTS:
            function renderGameObjects(layer, xOffset, yOffset) {
                let tmpSprite;
                let tmpX;
                let tmpY;
                gameObjects.forEach((tmp) => {
                    tmpObj = tmp;
                    if (tmpObj.alive) {
                        tmpX = tmpObj.x + tmpObj.xWiggle - xOffset;
                        tmpY = tmpObj.y + tmpObj.yWiggle - yOffset;
                        if (layer == 0) {
                            tmpObj.update(delta);
                        }
                        mainContext.globalAlpha = tmpObj.alpha;
                        if (tmpObj.layer == layer && isOnScreen(tmpX, tmpY, tmpObj.scale + (tmpObj.blocker || 0))) {
                            if (tmpObj.isItem) {
                                if ((tmpObj.dmg || tmpObj.trap) && !tmpObj.isTeamObject(player)) {
                                    tmpSprite = getObjSprite(tmpObj);
                                } else {
                                    tmpSprite = getItemSprite(tmpObj);
                                }

                                mainContext.save();
                                mainContext.translate(tmpX, tmpY);
                                mainContext.rotate(tmpObj.dir);
                                if (!tmpObj.active) {
                                    mainContext.scale(tmpObj.visScale / tmpObj.scale, tmpObj.visScale / tmpObj.scale);
                                }
                                mainContext.drawImage(tmpSprite, -(tmpSprite.width / 2), -(tmpSprite.height / 2));

                                if (tmpObj.blocker) {
                                    mainContext.strokeStyle = "#db6e6e";
                                    mainContext.globalAlpha = 0.3;
                                    mainContext.lineWidth = 6;
                                    renderCircle(0, 0, tmpObj.blocker, mainContext, false, true);
                                }
                                mainContext.restore();
                            } else {
                                tmpSprite = getResSprite(tmpObj);
                                mainContext.drawImage(tmpSprite, tmpX - (tmpSprite.width / 2), tmpY - (tmpSprite.height / 2));
                            }
                        }
                        if (layer == 3 && !useWasd) {
                            if (tmpObj.health < tmpObj.maxHealth) {
                                // HEALTH HOLDER:
                                mainContext.fillStyle = darkOutlineColor;
                                mainContext.roundRect(tmpX - config.healthBarWidth / 2 - config.healthBarPad, tmpY - config.healthBarPad, config.healthBarWidth + config.healthBarPad * 2, 17, 8);
                                mainContext.fill();

                                // HEALTH BAR:
                                mainContext.fillStyle = tmpObj.isTeamObject(player) ? "#8ecc51" : "#cc5151";
                                mainContext.roundRect(tmpX - config.healthBarWidth / 2, tmpY, config.healthBarWidth * (tmpObj.health / tmpObj.maxHealth), 17 - config.healthBarPad * 2, 7);
                                mainContext.fill();
                            }
                        }
                    }
                });

                // PLACE VISIBLE:
                if (layer == 0) {
                    if (placeVisible.length) {
                        placeVisible.forEach((places) => {
                            tmpX = places.x - xOffset;
                            tmpY = places.y - yOffset;
                            markObject(places, tmpX, tmpY);
                        });
                    }
                }
            }
            /*         function markObject(tmpObj, tmpX, tmpY) {
          getMarkSprite(tmpObj, mainContext, tmpX, tmpY);
      }*/
            function markObject(tmpObj, tmpX, tmpY) {
                yen(mainContext, tmpX, tmpY);
            }
            function yen(context, x, y) {
                context.fillStyle = "rgb(234,182,118)";
                context.beginPath();
                context.arc(x, y, 55, 0, Math.PI * 2); // Adjust the circle size
                context.fill();
                context.closePath();
                context.globalAlpha = 1;
            }
            function ppyen(context, x, y) {
                context.fillStyle = "red";
                context.beginPath();
                context.arc(x, y, 55, 0, Math.PI * 2); // Adjust the circle size
                context.fill();
                context.closePath();
                context.globalAlpha = 1;
            }

            // RENDER MINIMAP:
            class MapPing {
                constructor(color, scale) {
                    this.init = function(x, y) {
                        this.scale = 0;
                        this.x = x;
                        this.y = y;
                        this.active = true;
                    };
                    this.update = function(ctxt, delta) {
                        if (this.active) {
                            this.scale += 0.05 * delta;
                            if (this.scale >= scale) {
                                this.active = false;
                            } else {
                                ctxt.globalAlpha = (1 - Math.max(0, this.scale / scale));
                                ctxt.beginPath();
                                ctxt.arc((this.x / config.mapScale) * mapDisplay.width, (this.y / config.mapScale) *
                                         mapDisplay.width, this.scale, 0, 2 * Math.PI);
                                ctxt.stroke();
                            }
                        }
                    };
                    this.color = color;
                }
            }

            function pingMap(x, y) {
                tmpPing = mapPings.find(pings => !pings.active);
                if (!tmpPing) {
                    tmpPing = new MapPing("#fff", config.mapPingScale);
                    mapPings.push(tmpPing);
                }
                tmpPing.init(x, y);
            }

            function updateMapMarker() {
                mapMarker.x = player.x;
                mapMarker.y = player.y;
            }

            function renderMinimap(delta) {
                if (player && player.alive) {
                    mapContext.clearRect(0, 0, mapDisplay.width, mapDisplay.height);

                    // RENDER PINGS:
                    mapContext.lineWidth = 4;
                    for (let i = 0; i < mapPings.length; ++i) {
                        tmpPing = mapPings[i];
                        mapContext.strokeStyle = tmpPing.color;
                        tmpPing.update(mapContext, delta);
                    }

                    // RENDER BREAK TRACKS:
                    mapContext.globalAlpha = 1;
                    mapContext.fillStyle = "#ff0000";
                    if (breakTrackers.length) {
                        mapContext.fillStyle = "#abcdef";
                        mapContext.font = "34px Hammersmith One";
                        mapContext.textBaseline = "middle";
                        mapContext.textAlign = "center";
                        for (let i = 0; i < breakTrackers.length;) {
                            mapContext.fillText("!", (breakTrackers[i].x / config.mapScale) * mapDisplay.width,
                                                (breakTrackers[i].y / config.mapScale) * mapDisplay.height);
                            i += 2;
                        }
                    }

                    // RENDER PLAYERS:
                    mapContext.globalAlpha = 1;
                    mapContext.fillStyle = "#fff";
                    renderCircle((player.x / config.mapScale) * mapDisplay.width,
                                 (player.y / config.mapScale) * mapDisplay.height, 7, mapContext, true);
                    mapContext.fillStyle = "rgba(255,255,255,0.35)";
                    if (player.team && minimapData) {
                        for (let i = 0; i < minimapData.length;) {
                            renderCircle((minimapData[i] / config.mapScale) * mapDisplay.width,
                                         (minimapData[i + 1] / config.mapScale) * mapDisplay.height, 7, mapContext, true);
                            i += 2;
                        }
                    }

                    // RENDER BOTS:
                    if (bots.length) {
                        bots.forEach((tmp) => {
                            if (tmp.inGame) {
                                mapContext.globalAlpha = 1;
                                mapContext.strokeStyle = "#cc5151";
                                renderCircle((tmp.x2 / config.mapScale) * mapDisplay.width,
                                             (tmp.y2 / config.mapScale) * mapDisplay.height, 7, mapContext, false, true);
                            }
                        });
                    }

                    // DEATH LOCATION:
                    if (lastDeath) {
                        mapContext.fillStyle = "#fc5553";
                        mapContext.font = "34px Hammersmith One";
                        mapContext.textBaseline = "middle";
                        mapContext.textAlign = "center";
                        mapContext.fillText("x", (lastDeath.x / config.mapScale) * mapDisplay.width,
                                            (lastDeath.y / config.mapScale) * mapDisplay.height);
                    }

                    // MAP MARKER:
                    if (mapMarker) {
                        mapContext.fillStyle = "#fff";
                        mapContext.font = "34px Hammersmith One";
                        mapContext.textBaseline = "middle";
                        mapContext.textAlign = "center";
                        mapContext.fillText("x", (mapMarker.x / config.mapScale) * mapDisplay.width,
                                            (mapMarker.y / config.mapScale) * mapDisplay.height);
                    }
                }
            }

            // ICONS:
            let crossHairs = ["https://cdn.discordapp.com/attachments/1001384433078779927/1149285738412769300/newawwddd.png", "https://cdn.discordapp.com/attachments/1001384433078779927/1149285168780165170/100px-Crosshairs_Red.png"];
            let crossHairSprites = {};
            let iconSprites = {};
            let icons = ["crown", "skull"];

            function loadIcons() {
                for (let i = 0; i < icons.length; ++i) {
                    let tmpSprite = new Image();
                    tmpSprite.onload = function() {
                        this.isLoaded = true;
                    };
                    tmpSprite.src = "./../img/icons/" + icons[i] + ".png";
                    iconSprites[icons[i]] = tmpSprite;
                }
                for (let i = 0; i < crossHairs.length; ++i) {
                    let tmpSprite = new Image();
                    tmpSprite.onload = function() {
                        this.isLoaded = true;
                    };
                    tmpSprite.src = crossHairs[i];
                    crossHairSprites[i] = tmpSprite;
                }
            }
            loadIcons();

            // UPDATE GAME:
            function updateGame() {
                if (config.resetRender) {
                    mainContext.clearRect(0, 0, gameCanvas.width, gameCanvas.height);
                    mainContext.beginPath();
                }
                if (true) {
                    function updateCamera() {
                        let selectedCamera = document.getElementById("visualType").value;
                        let damping = 0.35;
                        let scalingFactor = 20;
                        if (player) {
                            if (selectedCamera === 'Cam1') {
                                let targetCamX = player.x + ((mouseX - 1920 / 2) / scalingFactor);
                                let targetCamY = player.y + ((mouseY - 1920 / 2) / scalingFactor);
                                camX += (targetCamX - camX) * damping;
                                camY += (targetCamY - camY) * damping;
                            } else if (selectedCamera === 'Cam0') {
                                let damping = 0.15;
                                let targetCamX = player.x + ((1920 / 2) / 30);
                                let targetCamY = player.y + ((1920 / 2) / 30);
                                camX += (targetCamX - camX) * damping;
                                camY += (targetCamY - camY) * damping;
                            } else if (selectedCamera === 'Cam2' || selectedCamera === 'Cam3') {
                                let damping2 = 0.016;
                                if (player) {
                                    let targetCamX = player.x + ((1920 / 2) / 30);
                                    let targetCamY = player.y + ((1920 / 2) / 30);
                                    camX = lerp(camX, targetCamX, damping2);
                                    camY = lerp(camY, targetCamY, damping2);
                                } else {
                                    camX = config.mapScale / 2;
                                    camY = config.mapScale / 2;
                                }
                            }
                        } else {
                            camX = config.mapScale / 2;
                            camY = config.mapScale / 2;
                        }
                    }
                    updateCamera()
                    document.getElementById("visualType").addEventListener("change", updateCamera);
                    function lerp(start, end, amt) {
                        return (1 - amt) * start + amt * end;
                    }

                    // INTERPOLATE PLAYERS AND AI:
                    let lastTime = now - (1000 / config.serverUpdateRate);
                    let tmpDiff;
                    for (let i = 0; i < players.length + ais.length; ++i) {
                        tmpObj = players[i] || ais[i - players.length];
                        if (tmpObj && tmpObj.visible) {
                            if (tmpObj.forcePos) {
                                tmpObj.x = tmpObj.x2;
                                tmpObj.y = tmpObj.y2;
                                tmpObj.dir = tmpObj.d2;
                            } else {
                                let total = tmpObj.t2 - tmpObj.t1;
                                let fraction = lastTime - tmpObj.t1;
                                let ratio = (fraction / total);
                                let rate = 170;
                                tmpObj.dt += delta;
                                let tmpRate = Math.min(1.7, tmpObj.dt / rate);
                                tmpDiff = (tmpObj.x2 - tmpObj.x1);
                                tmpObj.x = tmpObj.x1 + (tmpDiff * tmpRate);
                                tmpDiff = (tmpObj.y2 - tmpObj.y1);
                                tmpObj.y = tmpObj.y1 + (tmpDiff * tmpRate);
                                if (config.anotherVisual) {
                                    tmpObj.dir = Math.lerpAngle(tmpObj.d2, tmpObj.d1, Math.min(1.2, ratio));
                                } else {
                                    tmpObj.dir = Math.lerpAngle(tmpObj.d2, tmpObj.d1, Math.min(1.2, ratio));
                                }
                            }
                        }
                    }

                    // BETTER MOVE CAMERA:
                    /*if (player) {
                        if (false) {
                            camX = player.x;
                            camY = player.y;
                        } else {
                            let tmpDist = UTILS.getDistance(camX, camY, player.x, player.y);
                            let tmpDir = UTILS.getDirection(player.x, player.y, camX, camY);
                            let camSpd = Math.min(tmpDist * 0.01 * delta, tmpDist);
                            if (tmpDist > 0.05) {
                                camX += camSpd * Math.cos(tmpDir);
                                camY += camSpd * Math.sin(tmpDir);
                            } else {
                                camX = player.x;
                                camY = player.y;
                            }
                        }
                    } else {
                        camX = config.mapScale / 2;
                        camY = config.mapScale / 2;
                    }*/

                    // RENDER CORDS:
                    let xOffset = camX - (maxScreenWidth / 2);
                    let yOffset = camY - (maxScreenHeight / 2);

                    // RENDER BACKGROUND:
                    if (config.snowBiomeTop - yOffset <= 0 && config.mapScale - config.snowBiomeTop - yOffset >= maxScreenHeight) {
                        mainContext.fillStyle = "#b6db66";
                        mainContext.fillRect(0, 0, maxScreenWidth, maxScreenHeight);
                    } else if (config.mapScale - config.snowBiomeTop - yOffset <= 0) {
                        mainContext.fillStyle = "#dbc666";
                        mainContext.fillRect(0, 0, maxScreenWidth, maxScreenHeight);
                    } else if (config.snowBiomeTop - yOffset >= maxScreenHeight) {
                        mainContext.fillStyle = "#fff";
                        mainContext.fillRect(0, 0, maxScreenWidth, maxScreenHeight);
                    } else if (config.snowBiomeTop - yOffset >= 0) {
                        mainContext.fillStyle = "#fff";
                        mainContext.fillRect(0, 0, maxScreenWidth, config.snowBiomeTop - yOffset);
                        mainContext.fillStyle = "#b6db66";
                        mainContext.fillRect(0, config.snowBiomeTop - yOffset, maxScreenWidth,
                                             maxScreenHeight - (config.snowBiomeTop - yOffset));
                    } else {
                        mainContext.fillStyle = "#b6db66";
                        mainContext.fillRect(0, 0, maxScreenWidth,
                                             (config.mapScale - config.snowBiomeTop - yOffset));
                        mainContext.fillStyle = "#dbc666";
                        mainContext.fillRect(0, (config.mapScale - config.snowBiomeTop - yOffset), maxScreenWidth,
                                             maxScreenHeight - (config.mapScale - config.snowBiomeTop - yOffset));
                    }

                    // RENDER WATER AREAS:
                    if (!firstSetup) {
                        waterMult += waterPlus * config.waveSpeed * delta;
                        if (waterMult >= config.waveMax) {
                            waterMult = config.waveMax;
                            waterPlus = -1;
                        } else if (waterMult <= 1) {
                            waterMult = waterPlus = 1;
                        }
                        mainContext.globalAlpha = 1;
                        mainContext.fillStyle = "#dbc666";
                        renderWaterBodies(xOffset, yOffset, mainContext, config.riverPadding);
                        mainContext.fillStyle = "#91b2db";
                        renderWaterBodies(xOffset, yOffset, mainContext, (waterMult - 1) * 250);
                    }

                    if (getEl("visualType").value != "ueh1") {

                        // RENDER GRID:
                        mainContext.lineWidth = 4;
                        mainContext.strokeStyle = "#000";
                        mainContext.globalAlpha = 0.06;
                        mainContext.beginPath();
                        for (let x = -camX; x < maxScreenWidth; x += useWasd ? 60 : 120) {
                            if (x > 0) {
                                mainContext.moveTo(x, 0);
                                mainContext.lineTo(x, maxScreenHeight);
                            }
                        }
                        for (let y = -camY; y < maxScreenHeight; y += useWasd ? 60 : 120) {
                            if (y > 0) {
                                mainContext.moveTo(0, y);
                                mainContext.lineTo(maxScreenWidth, y);
                            }
                        }
                        mainContext.stroke();

                    }
                    if (player) {

                        // DEATH LOCATION:
                        if (lastDeath) {
                            mainContext.globalAlpha = 1;
                            mainContext.fillStyle = "#fc5553";
                            mainContext.font = "100px Hammersmith One";
                            mainContext.textBaseline = "middle";
                            mainContext.textAlign = "center";
                            mainContext.fillText("x", lastDeath.x - xOffset, lastDeath.y - yOffset);
                        }

                        // PATHFINDER LINE:
                        if (pathFind.active) {
                            if (pathFind.array && (pathFind.chaseNear ? enemy.length : true)) {
                                mainContext.lineWidth = player.scale / 5;
                                mainContext.globalAlpha = 1;
                                mainContext.strokeStyle = "red";
                                mainContext.beginPath();
                                pathFind.array.forEach((path, i) => {
                                    let pathXY = {
                                        x: (pathFind.scale / pathFind.grid) * path.x,
                                        y: (pathFind.scale / pathFind.grid) * path.y
                                    }
                                    let render = {
                                        x: ((player.x2 - (pathFind.scale / 2)) + pathXY.x) - xOffset,
                                        y: ((player.y2 - (pathFind.scale / 2)) + pathXY.y) - yOffset
                                    }
                                    if (i == 0) {
                                        mainContext.moveTo(render.x, render.y);
                                    } else {
                                        mainContext.lineTo(render.x, render.y);
                                    }
                                });
                                mainContext.stroke();
                            }
                        }

                    }

                    // RENDER DEAD PLAYERS:
                    mainContext.globalAlpha = 1;
                    mainContext.strokeStyle = outlineColor;
                    renderDeadPlayers(xOffset, yOffset);

                    // RENDER BOTTOM LAYER:
                    mainContext.globalAlpha = 1;
                    mainContext.strokeStyle = outlineColor;
                    renderGameObjects(-1, xOffset, yOffset);

                    // RENDER PROJECTILES:
                    mainContext.globalAlpha = 1;
                    mainContext.lineWidth = outlineWidth;
                    renderProjectiles(0, xOffset, yOffset);

                    // RENDER PLAYERS:
                    renderPlayers(xOffset, yOffset, 0);

                    // RENDER AI:
                    mainContext.globalAlpha = 1;
                    for (let i = 0; i < ais.length; ++i) {
                        tmpObj = ais[i];
                        if (tmpObj.active && tmpObj.visible) {
                            tmpObj.animate(delta);
                            mainContext.save();
                            mainContext.translate(tmpObj.x - xOffset, tmpObj.y - yOffset);
                            mainContext.rotate(tmpObj.dir + tmpObj.dirPlus - (Math.PI / 2));
                            renderAI(tmpObj, mainContext);
                            mainContext.restore();
                        }
                    }

                    // RENDER GAME OBJECTS (LAYERED):
                    renderGameObjects(0, xOffset, yOffset);
                    renderProjectiles(1, xOffset, yOffset);
                    renderGameObjects(1, xOffset, yOffset);
                    renderPlayers(xOffset, yOffset, 1);
                    renderGameObjects(2, xOffset, yOffset);
                    renderGameObjects(3, xOffset, yOffset);

                    // MAP BOUNDARIES:
                    mainContext.fillStyle = "#000";
                    mainContext.globalAlpha = 0.09;
                    if (xOffset <= 0) {
                        mainContext.fillRect(0, 0, -xOffset, maxScreenHeight);
                    }
                    if (config.mapScale - xOffset <= maxScreenWidth) {
                        let tmpY = Math.max(0, -yOffset);
                        mainContext.fillRect(config.mapScale - xOffset, tmpY, maxScreenWidth - (config.mapScale - xOffset), maxScreenHeight - tmpY);
                    }
                    if (yOffset <= 0) {
                        mainContext.fillRect(-xOffset, 0, maxScreenWidth + xOffset, -yOffset);
                    }
                    if (config.mapScale - yOffset <= maxScreenHeight) {
                        let tmpX = Math.max(0, -xOffset);
                        let tmpMin = 0;
                        if (config.mapScale - xOffset <= maxScreenWidth)
                            tmpMin = maxScreenWidth - (config.mapScale - xOffset);
                        mainContext.fillRect(tmpX, config.mapScale - yOffset,
                                             (maxScreenWidth - tmpX) - tmpMin, maxScreenHeight - (config.mapScale - yOffset));
                    }

                    // RENDER DAY/NIGHT TIME:
                    mainContext.globalAlpha = 1;
                    mainContext.fillStyle = "rgba(0, 0, 70, 0.35)";
                    mainContext.fillRect(0, 0, maxScreenWidth, maxScreenHeight);

                    // RENDER PLAYER AND AI UI:
                    mainContext.strokeStyle = darkOutlineColor;
                    mainContext.globalAlpha = 1;
                    for (let i = 0; i < players.length + ais.length; ++i) {
                        tmpObj = players[i] || ais[i - players.length];
                        if (tmpObj.visible) {
                            mainContext.strokeStyle = darkOutlineColor;

                            // NAME AND HEALTH:
                            if (tmpObj.skinIndex != 10 || (tmpObj == player) || (tmpObj.team && tmpObj.team == player.team)) {
                                let tmpText = (tmpObj.team ? "[" + tmpObj.team + "] " : "") + (tmpObj.name || ""); //+ (tmpObj.isPlayer ? " {" + tmpObj.sid + "}" : "");
                                if (tmpText != "") {
                                    mainContext.font = (tmpObj.nameScale || 30) + "px Hammersmith One";
                                    mainContext.fillStyle = "#fff";
                                    mainContext.textBaseline = "middle";
                                    mainContext.textAlign = "center";
                                    mainContext.lineWidth = (tmpObj.nameScale ? 11 : 8);
                                    mainContext.lineJoin = "round";
                                    mainContext.strokeText(tmpText, tmpObj.x - xOffset, (tmpObj.y - yOffset - tmpObj.scale) - config.nameY);
                                    mainContext.fillText(tmpText, tmpObj.x - xOffset, (tmpObj.y - yOffset - tmpObj.scale) - config.nameY);
                                    if (tmpObj.isLeader && iconSprites["crown"].isLoaded) {
                                        let tmpS = config.crownIconScale;
                                        let tmpX = tmpObj.x - xOffset - (tmpS / 2) - (mainContext.measureText(tmpText).width / 2) - config.crownPad;
                                        mainContext.drawImage(iconSprites["crown"], tmpX, (tmpObj.y - yOffset - tmpObj.scale) -
                                                              config.nameY - (tmpS / 2) - 5, tmpS, tmpS);
                                    }
                                    if (tmpObj.iconIndex == 1 && iconSprites["skull"].isLoaded) {
                                        let tmpS = config.crownIconScale;
                                        let tmpX = tmpObj.x - xOffset - (tmpS / 2) + (mainContext.measureText(tmpText).width / 2) + config.crownPad;
                                        mainContext.drawImage(iconSprites["skull"], tmpX, (tmpObj.y - yOffset - tmpObj.scale) -
                                                              config.nameY - (tmpS / 2) - 5, tmpS, tmpS);
                                    }
                                    if (tmpObj.isPlayer && instaC.wait && near == tmpObj && (tmpObj.backupNobull ? crossHairSprites[1].isLoaded : crossHairSprites[0].isLoaded) && enemy.length && !useWasd) {
                                        let tmpS = tmpObj.scale * 2.2;
                                        mainContext.drawImage((tmpObj.backupNobull ? crossHairSprites[1] : crossHairSprites[0]), tmpObj.x - xOffset - tmpS / 2, tmpObj.y - yOffset - tmpS / 2, tmpS, tmpS);
                                    }
                                }
                                if (tmpObj.health > 0) {

                                    // HEALTH HOLDER:
                                    mainContext.fillStyle = darkOutlineColor;
                                    mainContext.roundRect(tmpObj.x - xOffset - config.healthBarWidth - config.healthBarPad,
                                                          (tmpObj.y - yOffset + tmpObj.scale) + config.nameY, (config.healthBarWidth * 2) +
                                                          (config.healthBarPad * 2), 17, 8);
                                    mainContext.fill();

                                    // HEALTH BAR:
                                    mainContext.fillStyle = (tmpObj == player || (tmpObj.team && tmpObj.team == player.team)) ? "#7eff00" : "#ff0000";
                                    mainContext.roundRect(tmpObj.x - xOffset - config.healthBarWidth,
                                                          (tmpObj.y - yOffset + tmpObj.scale) + config.nameY + config.healthBarPad,
                                                          ((config.healthBarWidth * 2) * (tmpObj.health / tmpObj.maxHealth)), 17 - config.healthBarPad * 2, 7);
                                    mainContext.fill();

                                    if (tmpObj.isPlayer) {
                                        mainContext.globalAlpha = 1;
                                        const RGBBarColor = HPBarColor;

                                        let targetReloads = {
                                            primary: (tmpObj.primaryIndex == undefined ? 1 : ((items.weapons[tmpObj.primaryIndex].speed - tmpObj.reloads[tmpObj.primaryIndex]) / items.weapons[tmpObj.primaryIndex].speed)),
                                            secondary: (tmpObj.secondaryIndex == undefined ? 1 : ((items.weapons[tmpObj.secondaryIndex].speed - tmpObj.reloads[tmpObj.secondaryIndex]) / items.weapons[tmpObj.secondaryIndex].speed)),
                                            turret: (2500 - tmpObj.reloads[53]) / 2500
                                        };
                                        if (!tmpObj.currentReloads) {
                                            tmpObj.currentReloads = { // Initialize currentReloads if not already set
                                                primary: targetReloads.primary,
                                                secondary: targetReloads.secondary,
                                                turret: targetReloads.turret
                                            };
                                        }
                                        const lerpFactor = 0.4;
                                        tmpObj.currentReloads.primary = (1 - lerpFactor) * tmpObj.currentReloads.primary + lerpFactor * targetReloads.primary;
                                        tmpObj.currentReloads.secondary = (1 - lerpFactor) * tmpObj.currentReloads.secondary + lerpFactor * targetReloads.secondary;
                                        tmpObj.currentReloads.turret = (1 - lerpFactor) * tmpObj.currentReloads.turret + lerpFactor * targetReloads.turret;

                                        let primaryReloadProgress = tmpObj.primaryIndex !== undefined ? ((items.weapons[tmpObj.primaryIndex].speed - tmpObj.reloads[tmpObj.primaryIndex]) / items.weapons[tmpObj.primaryIndex].speed) : 1;
                                        let secondaryReloadProgress = tmpObj.secondaryIndex !== undefined ? ((items.weapons[tmpObj.secondaryIndex].speed - tmpObj.reloads[tmpObj.secondaryIndex]) / items.weapons[tmpObj.secondaryIndex].speed) : 1;
                                        const centerX = tmpObj.x - xOffset;
                                        const centerY = tmpObj.y - yOffset;
                                        const barRadius = 28;
                                        const barWidth = 15;
                                        const totalAngle = (Math.PI*2)/3; // Half circle
                                        const secondaryStartAngle = -Math.PI / 2 + Math.PI / 3;
                                        const secondaryEndAngle = secondaryStartAngle + (totalAngle * tmpObj.currentReloads.secondary);
                                        const primaryStartAngle = Math.PI / 2;
                                        const primaryEndAngle = primaryStartAngle + (totalAngle * tmpObj.currentReloads.primary);

                                        const turretStartAngle = Math.PI + Math.PI / 4.5;
                                        const turretEndAngle = turretStartAngle + (totalAngle/1.25 * tmpObj.currentReloads.turret);
                                        function returncoolcolor(RainbowCycle) {
                                            return `hsl(${RainbowCycle}, 100%, 50%, 30)`;
                                        }

                                        mainContext.save();
                                        if (tmpObj.currentReloads.primary < 0.999) {
                                            mainContext.beginPath();
                                            //   mainContext.lineCap = 'round';
                                            mainContext.arc(centerX, centerY, barRadius, primaryStartAngle, primaryEndAngle);
                                            mainContext.lineWidth = 4;
                                            mainContext.strokeStyle = darkOutlineColor;
                                            mainContext.stroke();
                                            mainContext.beginPath();
                                            // mainContext.lineCap = 'round';
                                            mainContext.arc(centerX, centerY, barRadius, primaryStartAngle, primaryEndAngle);
                                            mainContext.lineWidth = 4;
                                            mainContext.strokeStyle = returncoolcolor(tmpObj.currentReloads.primary * 200);
                                            mainContext.stroke();
                                        }
                                        if (tmpObj.currentReloads.secondary < 0.999) {
                                            mainContext.beginPath();
                                            //  mainContext.lineCap = 'round';
                                            mainContext.arc(centerX, centerY, barRadius, secondaryStartAngle, secondaryEndAngle);
                                            mainContext.lineWidth = 4;
                                            mainContext.strokeStyle = darkOutlineColor;
                                            mainContext.stroke();
                                            mainContext.beginPath();
                                            //    mainContext.lineCap = 'round';
                                            mainContext.arc(centerX, centerY, barRadius, secondaryStartAngle, secondaryEndAngle);
                                            mainContext.lineWidth = 4;
                                            mainContext.strokeStyle = returncoolcolor(tmpObj.currentReloads.secondary * 200);
                                            mainContext.stroke();
                                        }
                                        if (tmpObj.currentReloads.turret < 0.999) {
                                            mainContext.beginPath();
                                            //   mainContext.lineCap = 'round';
                                            mainContext.arc(centerX, centerY, barRadius, turretStartAngle, turretEndAngle);
                                            mainContext.lineWidth = 4;
                                            mainContext.strokeStyle = darkOutlineColor;
                                            mainContext.stroke();
                                            mainContext.beginPath();
                                            //mainContext.lineCap = 'round';
                                            mainContext.arc(centerX, centerY, barRadius, turretStartAngle, turretEndAngle);
                                            mainContext.lineWidth = 4;
                                            mainContext.strokeStyle = returncoolcolor(tmpObj.currentReloads.turret * 200);
                                            mainContext.stroke();
                                        }
                                        mainContext.restore();

                                        // SHAME COUNT:
                                        mainContext.globalAlpha = 1;
                                        mainContext.font = "30px Hammersmith One";
                                        mainContext.fillStyle = "#fff";
                                        mainContext.strokeStyle = darkOutlineColor;
                                        mainContext.textBaseline = "middle";
                                        mainContext.textAlign = "center";
                                        mainContext.lineWidth = 8;
                                        mainContext.lineJoin = "round";
                                        let tmpS = config.crownIconScale;
                                        let tmpX = tmpObj.x - xOffset - tmpS / 2 + mainContext.measureText(tmpText).width / 2 + config.crownPad + (tmpObj.iconIndex == 1 ? 30 * 2.75 : 30);
                                        mainContext.strokeText(tmpObj.skinIndex == 45 && tmpObj.shameTimer > 0 ? tmpObj.shameTimer : tmpObj.shameCount, tmpX, tmpObj.y - yOffset - tmpObj.scale - config.nameY);
                                        mainContext.fillText(tmpObj.skinIndex == 45 && tmpObj.shameTimer > 0 ? tmpObj.shameTimer : tmpObj.shameCount, tmpX, tmpObj.y - yOffset - tmpObj.scale - config.nameY);

                                        if (tmpObj.isPlayer && tmpObj.sid !== player.sid) {
                                            // Tracery and glowing text for players who are not the player itself
                                            if (tmpObj.isPlayer && tmpObj.sid !== player.sid && configs.tracers) {
                                                const color = tmpObj === player || (tmpObj.team && tmpObj.team === player.team) ? "rgba(142, 204, 81, 1)" : "rgba(204, 81, 81, 1)";
                                                mainContext.save();
                                                const tempContext = mainContext.canvas.getContext("2d");
                                                tempContext.strokeStyle = color;
                                                tempContext.lineWidth = 3;
                                                tempContext.lineJoin = "round";
                                                tempContext.beginPath();
                                                tempContext.moveTo(player.x - xOffset, player.y - yOffset);
                                                tempContext.lineTo(tmpObj.x - xOffset, tmpObj.y - yOffset);
                                                tempContext.stroke();
                                                tempContext.closePath();
                                                mainContext.restore();

                                                mainContext.fillStyle = "white";
                                                mainContext.font = "bold 12px Arial";

                                                const playerName = tmpObj.name;
                                                const nameWidth = mainContext.measureText(playerName).width;

                                                const midX = (player.x + tmpObj.x - 2 * xOffset) / 2;
                                                const midY = (player.y + tmpObj.y - 2 * yOffset) / 2;

                                                mainContext.save();
                                                mainContext.translate(midX, midY);
                                                const dx = tmpObj.x - player.x;
                                                const dy = tmpObj.y - player.y;
                                                const angle = Math.atan2(dy, dx);
                                                mainContext.rotate(angle - Math.PI / 2);
                                                mainContext.rotate(-Math.PI / 2);
                                                mainContext.fillText(playerName, 0, 0);
                                                mainContext.restore();

                                                mainContext.shadowColor = "transparent";
                                                mainContext.shadowBlur = 1;
                                            }
                                            let playerTracerImage = new Image();
                                            playerTracerImage.src = 'https://cdn.discordapp.com/attachments/1154469605021077636/1184190491626045490/image.png?ex=658b1256&is=65789d56&hm=8bacd22e5ab9f53a080ae758b3bc5e34068a99c5c26420c90014f45020698c38&';
                                            if (!tmpObj.isTeam(player) && !configs.tracers) {
                                                const angle = Math.atan2(tmpObj.y - player.y, tmpObj.x - player.x);
                                                const distance = Math.hypot(tmpObj.y - player.y, tmpObj.x - player.x);
                                                const offset = Math.min(distance - player.scale, player.scale * 2);
                                                const arrowPos = {
                                                    x: player.x + offset * Math.cos(angle),
                                                    y: player.y + offset * Math.sin(angle)
                                                }
                                                drawArrow(xOffset, yOffset, arrowPos.x, arrowPos.y, 4, darkOutlineColor, angle, 15);
                                                drawArrow(xOffset, yOffset, arrowPos.x, arrowPos.y, 4, "#fff", angle, 8);
                                            }
                                        }
                                        function drawArrow(xOffset, yOffset, x, y, arrowWidth, color, angle, lineWidth) {
                                            mainContext.save()
                                            mainContext.translate(x - xOffset, y - yOffset)
                                            mainContext.rotate(Math.PI / 4)
                                            mainContext.rotate(angle)
                                            mainContext.globalAlpha = 1
                                            mainContext.strokeStyle = color
                                            mainContext.lineCap = "round"
                                            mainContext.lineWidth = lineWidth
                                            mainContext.beginPath()
                                            mainContext.moveTo(-arrowWidth, -arrowWidth)
                                            mainContext.lineTo(arrowWidth, -arrowWidth)
                                            mainContext.lineTo(arrowWidth, arrowWidth)
                                            mainContext.stroke()
                                            mainContext.closePath()
                                            mainContext.restore()
                                        }

                                        if (getEl("predictType").value == "pre2") {
                                            mainContext.lineWidth = 3;
                                            mainContext.strokeStyle = "#ff0000";
                                            mainContext.globalAlpha = 1;
                                            mainContext.beginPath();
                                            let render = {
                                                x: tmpObj.x2 - xOffset,
                                                y: tmpObj.y2 - yOffset
                                            };
                                            mainContext.moveTo(tmpObj.x - xOffset, tmpObj.y - yOffset);
                                            mainContext.lineTo(render.x, render.y);
                                            mainContext.stroke();
                                        } else if (getEl("predictType").value == "pre3") {
                                            mainContext.lineWidth = 3;
                                            mainContext.strokeStyle = "#ff0000";
                                            mainContext.globalAlpha = 1;
                                            mainContext.beginPath();
                                            let render = {
                                                x: tmpObj.x3 - xOffset,
                                                y: tmpObj.y3 - yOffset
                                            };
                                            mainContext.moveTo(tmpObj.x - xOffset, tmpObj.y - yOffset);
                                            mainContext.lineTo(render.x, render.y);
                                            mainContext.stroke();
                                        }

                                    }
                                }
                            }
                        }
                    }

                    if (player) {

                        // AUTOPUSH LINE:
                        if (my.autoPush) {
                            mainContext.lineWidth = 5;
                            mainContext.globalAlpha = 1;
                            mainContext.beginPath();

                            mainContext.strokeStyle = "blue";
                            mainContext.moveTo(player.x - xOffset, player.y - yOffset);
                            mainContext.lineTo(my.pushData.x2 - xOffset, my.pushData.y2 - yOffset);
                            mainContext.lineTo(my.pushData.x - xOffset, my.pushData.y - yOffset);
                            mainContext.stroke();
                        }

                        // FUNNY:
                        if (petals.length && getEl("funni").checked) {

                            player.spinDir += 2.5 / 60;
                            let maxRad = 0;
                            if (clicks.left) {
                                maxRad = 100;
                            } else if (clicks.right) {
                                maxRad = 15;
                            } else {
                                maxRad = 40;
                            }
                            maxRad += player.scale;

                            petals.forEach((petal, i) => {
                                if (petal.active) {
                                    let petalRad = (Math.PI * (i / (petals.length / 2)));
                                    let pl = {
                                        x: player.x + (maxRad * Math.cos(player.spinDir + petalRad)),
                                        y: player.y + (maxRad * Math.sin(player.spinDir + petalRad))
                                    };
                                    let angle = UTILS.getDirect(pl, petal, 0, 0);
                                    let dist = UTILS.getDist(pl, petal, 0, 0);
                                    petal.x += (dist / 7) * Math.cos(angle);
                                    petal.y += (dist / 7) * Math.sin(angle);

                                    players.filter((tmp) => tmp.visible && tmp != player).forEach((tmp) => {
                                        let angle = UTILS.getDirect(petal, tmp, 0, 0);
                                        let dist = UTILS.getDist(petal, tmp, 0, 0);
                                        let sc = petal.scale + tmp.scale;
                                        if (dist <= sc) {
                                            let tD = dist - sc;
                                            let diff = -tD;
                                            petal.x += diff * Math.cos(angle);
                                            petal.y += diff * Math.sin(angle);
                                            petal.health -= 10;
                                            petal.damaged += 125;
                                            if (petal.health <= 0) {
                                                petal.active = false;
                                            }
                                        }
                                    });

                                } else {
                                    petal.time += delta;

                                    if (petal.alive) {
                                        petal.alpha -= delta / 200;
                                        petal.visScale += delta / (petal.scale * 2);
                                        if (petal.alpha <= 0) {
                                            petal.alpha = 0;
                                            petal.alive = false;
                                        }
                                    }

                                    if (petal.time >= petal.timer) {
                                        petal.time = 0;
                                        petal.active = true;
                                        petal.alive = true;
                                        petal.x = player.x;
                                        petal.y = player.y;
                                        petal.health = petal.maxHealth;
                                        petal.damaged = 0;
                                        petal.alpha = 1;
                                        petal.visScale = petal.scale;
                                    }
                                }

                                if (petal.alive) {

                                    let cD = function(r, g, b, dmg) {
                                        return "rgb(" + `${Math.min(255, r + Math.floor(dmg))}, ${Math.max(0, g - Math.floor(dmg))}, ${Math.max(0, b - Math.floor(dmg))}` + ")";
                                    }

                                    mainContext.globalAlpha = petal.alpha;
                                    mainContext.lineWidth = 3;
                                    mainContext.fillStyle = cD(255, 255, 255, petal.damaged);
                                    mainContext.strokeStyle = cD(200, 200, 200, petal.damaged);
                                    mainContext.beginPath();
                                    mainContext.arc(petal.x - xOffset, petal.y - yOffset, petal.visScale, 0, Math.PI * 2);
                                    mainContext.fill();
                                    mainContext.stroke();

                                    petal.damaged = Math.max(0, petal.damaged - (delta / 2));

                                }

                            });
                        }

                    }

                    mainContext.globalAlpha = 1;

                    // RENDER ANIM TEXTS:
                    textManager.update(delta, mainContext, xOffset, yOffset);
                    // RENDER CHAT MESSAGES:
                    for (let i = 0; i < players.length; ++i) {
                        tmpObj = players[i];
                        if (tmpObj.visible) {
                            if (tmpObj.chatCountdown > 0) {
                                tmpObj.chatCountdown -= delta;
                                if (tmpObj.chatCountdown <= 0)
                                    tmpObj.chatCountdown = 0;
                                mainContext.font = "32px Hammersmith One";
                                let tmpSize = mainContext.measureText(tmpObj.chatMessage);
                                mainContext.textBaseline = "middle";
                                mainContext.textAlign = "center";
                                let tmpX = tmpObj.x - xOffset;
                                let tmpY = tmpObj.y - tmpObj.scale - yOffset - 90;
                                let tmpH = 47;
                                let tmpW = tmpSize.width + 17;
                                mainContext.fillStyle = "rgba(0,0,0,0.2)";
                                mainContext.roundRect(tmpX - tmpW / 2, tmpY - tmpH / 2, tmpW, tmpH, 6);
                                mainContext.fill();
                                mainContext.fillStyle = "#fff";
                                mainContext.fillText(tmpObj.chatMessage, tmpX, tmpY);
                            }
                            if (tmpObj.chat.count > 0) {
                                if (!useWasd) {
                                    tmpObj.chat.count -= delta;
                                    if (tmpObj.chat.count <= 0)
                                        tmpObj.chat.count = 0;
                                    mainContext.font = "32px Hammersmith One";
                                    let tmpSize = mainContext.measureText(tmpObj.chat.message);
                                    mainContext.textBaseline = "middle";
                                    mainContext.textAlign = "center";
                                    let tmpX = tmpObj.x - xOffset;
                                    let tmpY = tmpObj.y - tmpObj.scale - yOffset + (90 * 2);
                                    let tmpH = 47;
                                    let tmpW = tmpSize.width + 17;
                                    mainContext.fillStyle = "rgba(0,0,0,0.2)";
                                    mainContext.roundRect(tmpX - tmpW / 2, tmpY - tmpH / 2, tmpW, tmpH, 6);
                                    mainContext.fill();
                                    mainContext.fillStyle = "#ffffff99";
                                    mainContext.fillText(tmpObj.chat.message, tmpX, tmpY);
                                } else {
                                    tmpObj.chat.count = 0;
                                }
                            }
                        }
                    }

                    if (allChats.length) {
                        allChats.filter(ch => ch.active).forEach((ch) => {
                            if (!ch.alive) {
                                if (ch.alpha <= 1) {
                                    ch.alpha += delta / 250;
                                    if (ch.alpha >= 1) {
                                        ch.alpha = 1;
                                        ch.alive = true;
                                    }
                                }
                            } else {
                                ch.alpha -= delta / 5000;
                                if (ch.alpha <= 0) {
                                    ch.alpha = 0;
                                    ch.active = false;
                                }
                            }
                            if (ch.active) {
                                mainContext.font = "20px Ubuntu";
                                let tmpSize = mainContext.measureText(ch.chat);
                                mainContext.textBaseline = "middle";
                                mainContext.textAlign = "center";
                                let tmpX = ch.x - xOffset;
                                let tmpY = ch.y - yOffset - 90;
                                let tmpH = 40;
                                let tmpW = tmpSize.width + 15;

                                mainContext.globalAlpha = ch.alpha;

                                mainContext.fillStyle = ch.owner.isTeam(player) ? "#8ecc51" : "#cc5151";
                                mainContext.strokeStyle = "rgb(25, 25, 25)";
                                mainContext.strokeText(ch.owner.name, tmpX, tmpY - 45);
                                mainContext.fillText(ch.owner.name, tmpX, tmpY - 45);

                                mainContext.lineWidth = 5;
                                mainContext.fillStyle = "#ccc";
                                mainContext.strokeStyle = "rgb(25, 25, 25)";

                                mainContext.roundRect(tmpX - tmpW / 2, tmpY - tmpH / 2, tmpW, tmpH, 6);
                                mainContext.stroke();
                                mainContext.fill();

                                mainContext.fillStyle = "#fff";
                                mainContext.strokeStyle = "#000";
                                mainContext.strokeText(ch.chat, tmpX, tmpY);
                                mainContext.fillText(ch.chat, tmpX, tmpY);
                                ch.y -= delta / 100;
                            }
                        });
                    }
                }

                mainContext.globalAlpha = 1;


                    // SEND MESSAGE:
            function receiveChat(sid, message) {
                let tmpPlayer = findPlayerBySID(sid);
                let countDown = 0;
                let coolDownForAI = false;
                addChatLog(message, "#fff", tmpPlayer.name + "[" + tmpPlayer.sid + "]:", tmpPlayer == player || (tmpPlayer.team && tmpPlayer.team == player.team) ? "#279df1" : "#fff");
                tmpPlayer.chatMessage = ((text) => {
					let tmpString;
					profanityList.forEach((list) => {
						if (text.indexOf(list) > -1) {
							tmpString = "";
							for (var y = 0; y < list.length; ++y) {
								tmpString += tmpString.length ? "o" : "M";
							}
							var re = new RegExp(list, 'g');
							text = text.replace(re, tmpString);
						}
					});
					return text;
				})(message);
				tmpPlayer.chatCountdown = config.chatCountdown;
                if (isTeam(tmpPlayer) || player == tmpPlayer) {
                    if (message == "Raven") {
                        instaC.syncTry();
                        io.send("6", "Raven");
                    }
                }
                if (getEl("autochat").checked) {
                    if (message.includes("mod")) {
                        packet("6", "Raven")
                    }
                    if (message.includes("what mod")) {
                        packet("6", "Raven")
                    }
                    if (message.includes("bad")) {
                        io.send("6", "Anh Yeu Em");
                    } else if (message.includes("lag")) {
                        io.send("6", "lag ke con me may thk ngu");
                                            } else if (message.includes("Smiley") || message.includes("smiley") || message.includes("SMILEY")) {
                                                io.send("6", "Smiley is Pro");
                                            } else if (message.includes("eX")) {
                                                io.send("6", "eX is Pro");
                    } else if (message.includes("Lag")) {
                        io.send("6", "lag ke me may");
                    } else if (message.includes("cringe")) {
                        io.send("6", "cringe = u cringe?");
                    } else if (message.includes("mad")) {
                        io.send("6", "mad = u mad?");
                    } else if (message.includes("idiot")) {
                        io.send("6", "idiot = u idiot?");
                    } else if (message.includes("retard")) {
                        io.send("6", "retard = u retard?");
                    } else if (message.includes("ok and")) {
                        io.send("6", "ok, u r noob");
                    } else if (message.includes("get a life")) {
                        io.send("6", "then i will get ur life");
                    } else if (message.includes("cry about it")) {
                        io.send("6", "cry about your dumbness");
                    } else if (message.includes("fell off")) {
                        io.send("6", "i leveled up");
                    } else if (message.includes("get good")) {
                        io.send("6", "U r right you should get good");
                    } else if (message.includes("stupid")) {
                        io.send("6", "stupid = u stupid?");
                    } else if (message.includes("homo")) {
                        io.send("6", "homo = u homo?");
                    } else if (message.includes("noob")) {
                        io.send("6", "Tao Trum ONESHOT FAIFAI");
                    } else if (message.includes("dumb")) {
                        io.send("6", "dumb = u dumb?");
                    } else if (message.includes("Dumb")) {
                        io.send("6", "Dumb = You Dumb?");
                    } else if (message.includes("moron")) {
                        io.send("6", "moron = u moron?");
                    } else if (message.includes("not fun")) {
                        io.send("6", "so funny!");
                    } else if (message.includes("Noob")) {
                        io.send("6", "Noob = You Noob?");
                    } else if (message.includes("nub")) {
                        io.send("6", "nub = u nub?");
                    } else if (message.includes("nob")) {
                        io.send("6", "nob = u nob?");
                    } else if (message.includes("nab")) {
                        io.send("6", "nab = u nab?");
                    } else if (message.includes("Nigga")) {
                        io.send("6", "Nigga = u Nigger?");
                    } else if (message.includes("Nigger")) {
                        io.send("6", "Nigger = u Nigger?");
                    } else if (message.includes("niggA")) {
                        io.send("6", "Nigga = u Nigger?");
                    } else if (message.includes("nigger")) {
                        io.send("6", "Nigger = u Nigger?");
                    } else if (message.includes("real")) {
                        io.send("6", "yes im real");
                    } else if (message.includes("loser")) {
                        io.send("6", "loser = u loser?");
                    } else if (message.includes("!c!dc")) {
                        io.send("6", "pls disconnect this noob");
                    } else if (message.includes("!dc")) {
                        io.send("6", "Lam on ko dc ghi !dc >vang game");
                    } else if (message.includes("gay")) {
                        io.send("6", "gay = m Bi Diec");
                    } else if (message.includes("gae")) {
                        io.send("6", "gae = u gay ?");
                    } else if (message.includes("Gay")) {
                        io.send("6", "Gay = You gay ?");
                    } else if (message.includes("love u")) {
                        io.send("6", "Gay??");
                    } else if (message.includes("love you")) {
                        io.send("6", "Gay??");
                    } else if (message.includes("luv you")) {
                        io.send("6", "Gay??");
                    } else if (message.includes("luv u")) {
                        io.send("6", "Gay??");
                    } else if (message.includes("hi")) {
                        io.send("6", "hi cai lon me may");
                    } else if (message.includes("ngu")) {
                        io.send("6", "ngu = Cai Dau Buoi");
                    } else if (message.includes("Ngu")) {
                        io.send("6", "Ngu = Con Cac me May");
                    } else if (message.includes("NGU")) {
                        io.send("6", "Ngu = Con Cac Me may");
                    } else if (message.includes("hehe")) {
                        io.send("6", "haha");
                    } else if (message.includes("haha")) {
                        io.send("6", "haha cai lon");
                    } else if (message.includes("huhu")) {
                        io.send("6", "huhu Cai Lon");
                    } else if (message.includes("ez")) {
                        io.send("6", "ez cai con cac");
                    } else if (message.includes("Ez")) {
                        io.send("6", "Ngu > Fu.ck");
                    } else if (message.includes("easy")) {
                        io.send("6", "ik you ez");
                    } else if (message.includes("gg")) {
                        io.send("6", "gg cai lon me may cut");
                    } else if (message.includes("Gg")) {
                        io.send("6", "gg Nub");
                    } else if (message.includes("lol")) {
                        io.send("6", "Ko Lam Ma Doi An");
                    } else if (message.includes("Lol")) {
                        io.send("6", "LOL LOL LOL");
                    } else if (message.includes("lmao")) {
                        io.send("6", "lmao LMAO LMAO LMAO");
                    } else if (message.includes("Lmao")) {
                        io.send("6", "lmao LMAO LMAO LMAO");
                    } else if (message.includes("lvl")) {
                        io.send("6", "why");
                    } else if (message.includes("1v1")) {
                        io.send("6", "why you nub");
                    } else if (message.includes("hello")) {
                        io.send("6", "hello ke con me may");
                    } else if (message.includes("idk")) {
                        io.send("6", "-_-");
                    } else if (message.includes("xd")) {
                        io.send("6", "Tao Trum ONESHOT");
                    } else if (message.includes("Xd")) {
                        io.send("6", "Lol k lam ma doi an");
                    } else if (message.includes("xD")) {
                        io.send("6", "YOU NOOD Fu.ck");
                    } else if (message.includes("XD")) {
                        io.send("6", "XD k lam Ma Doi An");
                    } else if (message.includes(":<")) {
                        io.send("6", ":>");
                    } else if (message.includes(":(")) {
                        io.send("6", ":)");
                    } else if (message.includes("):")) {
                        io.send("6", "(:");
                    } else if (message.includes(":C")) {
                        io.send("6", "C:");
                    } else if (message.includes(":c")) {
                        io.send("6", "c:");
                    } else if (message.includes("D:")) {
                        io.send("6", ":D");
                    } else if (message.includes("-_-")) {
                        io.send("6", "xd");
                    } else if (message.includes("sb")) { //chinese meaning. (stupid)
                        io.send("6", "sb = u SB?");
                    } else if (message.includes("AutoGG")) {
                        io.send("6", "GG! EZ!");
                    } else if (message.includes("Master Race")) {
                        io.send("6", "GG! EZ!");
                    } else if (message.includes("autoclicker")) {
                        io.send("6", "autoclicker = Good");
                    } else if (message.includes("auto clicker")) {
                        io.send("6", "autoclicker = Good");
                    } else if (message.includes("trash")) {
                        io.send("6", "trash = u trash?");
                    } else if (message.includes("suck")) {
                        io.send("6", "suck = u suck?");
                    } else if (message.includes("fatherless")) {
                        io.send("6", "Yes you are fatherless");
                    } else if (message.includes("motherless")) {
                        io.send("6", "Yes you are motherless");
                    }
                }
            }
                // RENDER MINIMAP:
                renderMinimap(delta);
            }

            // UPDATE & ANIMATE:
            window.requestAnimFrame = function() {
                return null;
            }
            window.rAF = (function() {
                return window.requestAnimationFrame ||
                    window.webkitRequestAnimationFrame ||
                    window.mozRequestAnimationFrame ||
                    function(callback) {
                    window.setTimeout(callback, 1000 / 60);
                };
            })();

            function doUpdate() {
                now = performance.now();
                delta = now - lastUpdate;
                lastUpdate = now;

                let timer = performance.now();
                let diff = timer - fpsTimer.last;
                if (diff >= 1000) {

                    fpsTimer.ltime = fpsTimer.time * (1000 / diff);

                    fpsTimer.last = timer;
                    fpsTimer.time = 0;
                }
                fpsTimer.time++;

                getEl("pingFps").innerHTML = `${window.pingTime}ms | Fps: ${UTILS.round(fpsTimer.ltime, 10)}`;
                getEl("packetStatus").innerHTML = secPacket;
                updateGame();
                rAF(doUpdate);
            }
            prepareMenuBackground();
            doUpdate();

            function toggleUseless(boolean) {
                getEl("instaType").disabled = boolean;
                getEl("antiBullType").disabled = boolean;
                getEl("predictType").disabled = boolean;
                getEl("visualType").disabled = boolean;
            }
            toggleUseless(useWasd);

            let changeDays = {};
            window.debug = function() {
                my.waitHit = 0;
                my.autoAim = false;
                instaC.isTrue = false;
                traps.inTrap = false;
                itemSprites = [];
                objSprites = [];
                gameObjectSprites = [];
            };
            window.toggleNight = function() {
                clearTimeout(changeDays);
                if (nightMode.style.animationName == "night1") {
                    nightMode.style.animationName = "night2";
                    nightMode.style.opacity = 0;
                    changeDays = setTimeout(() => {
                        nightMode.style.display = "none";
                    }, 1000 * parseFloat(nightMode.style.animationDuration));
                } else {
                    nightMode.style.animationName = "night1";
                    nightMode.style.opacity = 0.35;
                    nightMode.style.display = "block";
                }
                isNight = !isNight;
                itemSprites = [];
                objSprites = [];
                gameObjectSprites = [];
            };
            window.wasdMode = function() {
                useWasd = !useWasd;
                toggleUseless(useWasd);
            };
            window.startGrind = function() {
                if (getEl("weaponGrind").checked) {
                    for (let i = 0; i < Math.PI * 2; i += Math.PI / 2) {
                        checkPlace(player.getItemType(22), i);
                    }
                }
            };
            // REMOVED!!! so they cant abuse :)
            let projects = [];
            let botIDS = 0;
            window.connectFillBots = function() {
                botSkts = [];
                botIDS = 0;
                for (let i = 0; i < projects.length; i++) {
                    let test = new WebSocket(`wss://${projects[i]}.glitch.me`);
                    test.binaryType = "arraybuffer";

                    test.onopen = function() {
                        test.ssend = function(type) {
                            let data = Array.prototype.slice.call(arguments, 1);
                            let binary = window.msgpack.encode([type, data]);
                            test.send(binary);
                        };
                        for (let i = 0; i < 4; i++) {
                            window.grecaptcha.execute("", {
                                action: "homepage"
                            }).then(function(token) {
                                test.ssend("bots", WS.url.split("&")[0] + "&token=" + encodeURIComponent(token), botIDS);
                                botSkts.push([test]);
                                botIDS++;
                            });
                        }
                    };
                    test.onmessage = function(message) {
                        let data = new Uint8Array(message.data);
                        let parsed = window.msgpack.decode(data);
                        let type = parsed[0];
                        data = parsed[1];
                    };
                }
            };
            window.destroyFillBots = function() {
                botSkts.forEach((socket) => {
                    socket[0].close();
                });
                botSkts = [];
            };
            window.tryConnectBots = function() {
                for (let i = 0; i < (bots.length < 3 ? 3 : 4); i++) {
                    window.grecaptcha.execute("", {
                        action: "homepage"
                    }).then(function(token) {
                        // CONNECT SOCKET:
                        botSpawn(token);
                    });
                }
            };
            window.destroyBots = function() {
                bots.forEach((botyyyyy) => {
                    botyyyyy.closeSocket = true;
                });
                bots = [];
            };
            window.resBuild = function() {
                if (gameObjects.length) {
                    gameObjects.forEach((tmp) => {
                        tmp.breakObj = false;
                    });
                    breakObjects = [];
                }
            };
            window.toggleBotsCircle = function() {
                player.circle = !player.circle;
            };
            window.toggleVisual = function() {
                config.anotherVisual = !config.anotherVisual;
                gameObjects.forEach((tmp) => {
                    if (tmp.active) {
                        tmp.dir = tmp.lastDir;
                    }
                });
            };
            window.prepareUI = function(tmpObj) {
                resize();
                // ACTION BAR:
                UTILS.removeAllChildren(actionBar);

                for (let i = 0; i < (items.weapons.length + items.list.length); ++i) {
                    (function (i) {
                        UTILS.generateElement({
                            id: "actionBarItem" + i,
                            class: "actionBarItem",
                            style: "display:none; box-shadow: 2px 2px 5px rgba(0, 0, 0, 0.5)", // Add box-shadow property
                            onmouseout: function () {
                                showItemInfo();
                            },
                            parent: actionBar
                        });
                    })(i);
                }

                for (let i = 0; i < (items.list.length + items.weapons.length); ++i) {
                    (function (i) {
                        let tmpCanvas = document.createElement("canvas");
                        tmpCanvas.width = tmpCanvas.height = 66;
                        let tmpContext = tmpCanvas.getContext("2d");
                        tmpContext.translate((tmpCanvas.width / 2), (tmpCanvas.height / 2));
                        tmpContext.imageSmoothingEnabled = false;
                        tmpContext.webkitImageSmoothingEnabled = false;
                        tmpContext.mozImageSmoothingEnabled = false;

                        if (items.weapons[i]) {
                            tmpContext.rotate((Math.PI / 4) + Math.PI);
                            let tmpSprite = new Image();
                            toolSprites[items.weapons[i].src] = tmpSprite;
                            tmpSprite.onload = function () {
                                this.isLoaded = true;
                                let tmpPad = 1 / (this.height / this.width);
                                let tmpMlt = (items.weapons[i].iPad || 1);
                                tmpContext.drawImage(this, -(tmpCanvas.width * tmpMlt * config.iconPad * tmpPad) / 2, -(tmpCanvas.height * tmpMlt * config.iconPad) / 2,
                                                     tmpCanvas.width * tmpMlt * tmpPad * config.iconPad, tmpCanvas.height * tmpMlt * config.iconPad);
                                tmpContext.fillStyle = "rgba(0, 0, 70, 0.1)";
                                tmpContext.globalCompositeOperation = "source-atop";
                                tmpContext.fillRect(-tmpCanvas.width / 2, -tmpCanvas.height / 2, tmpCanvas.width, tmpCanvas.height);
                                getEl('actionBarItem' + i).style.backgroundImage = "url(" + tmpCanvas.toDataURL() + ")";
                            };
                            tmpSprite.src = "./../img/weapons/" + items.weapons[i].src + ".png";
                            let tmpUnit = getEl('actionBarItem' + i);
                            tmpUnit.onmouseover = UTILS.checkTrusted(function () {
                                showItemInfo(items.weapons[i], true);
                            });
                            tmpUnit.onclick = UTILS.checkTrusted(function () {
                                selectWeapon(tmpObj.weapons[items.weapons[i].type]);
                            });
                            UTILS.hookTouchEvents(tmpUnit);
                        } else {
                            let tmpSprite = getItemSprite(items.list[i - items.weapons.length], true);
                            let tmpScale = Math.min(tmpCanvas.width - config.iconPadding, tmpSprite.width);
                            tmpContext.globalAlpha = 1;
                            tmpContext.drawImage(tmpSprite, -tmpScale / 2, -tmpScale / 2, tmpScale, tmpScale);
                            tmpContext.fillStyle = "rgba(0, 0, 70, 0.1)";
                            tmpContext.globalCompositeOperation = "source-atop";
                            tmpContext.fillRect(-tmpScale / 2, -tmpScale / 2, tmpScale, tmpScale);
                            getEl('actionBarItem' + i).style.backgroundImage = "url(" + tmpCanvas.toDataURL() + ")";
                            let tmpUnit = getEl('actionBarItem' + i);
                            tmpUnit.onmouseover = UTILS.checkTrusted(function () {
                                showItemInfo(items.list[i - items.weapons.length]);
                            });
                            tmpUnit.onclick = UTILS.checkTrusted(function () {
                                selectToBuild(tmpObj.items[tmpObj.getItemType(i - items.weapons.length)]);
                            });
                            UTILS.hookTouchEvents(tmpUnit);
                        }
                    })(i);
                }
            };
            window.profineTest = function(data) {
                if (data) {
                    // SET INITIAL NAME:
                    let noname = "unknown";

                    // VALIDATE NAME:
                    let name = data + "";
                    name = name.slice(0, config.maxNameLength);
                    name = name.replace(/[^\w:\(\)\/? -]+/gmi, " "); // USE SPACE SO WE CAN CHECK PROFANITY
                    name = name.replace(/[^\x00-\x7F]/g, " ");
                    name = name.trim();

                    let langFilter = {
                        "list": [
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
                            "queer",
                            "queers",
                            "queerz",
                            "qweers",
                            "qweerz",
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
                            "lesbian",
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
                            "asa"
                        ],
                        "exclude": [],
                        "placeHolder": "*",
                        "regex": {},
                        "replaceRegex": {}
                    };

                    let isProfane = false;
                    let convertedName = name.toLowerCase().replace(/\s/g, "").replace(/1/g, "i").replace(/0/g, "o").replace(/5/g, "s");
                    for (let word of langFilter.list) {
                        if (convertedName.indexOf(word) != -1) {
                            isProfane = true;
                            break;
                        }
                    }

                    if (name.length > 0 && !isProfane) {
                        noname = name;
                    }

                    return noname;
                }
            };
            window.toggleNight();
        },
        webgl_test: () => {
            return;
            let canvas = document.createElement("canvas");
            canvas.id = "WEBGL";
            canvas.width = canvas.height = 300;
            canvas.style = `
            position: relative;
            bottom: 70%;
            left: 70%;
            pointer-events: none;
            `;

            let fat = document.createElement("div");
            fat.id = "faku";
            fat.width = fat.height = 300;
            fat.style = `
            position: relative;
            bottom: 70%;
            left: 70%;
            pointer-events: none;
            font-size: 20px;
            `;
            fat.innerHTML = "Webgl Test Rendering";

            let gl = canvas.getContext("webgl");
            if (!gl) {
                alert("urbad");
                return;
            }

            document.body.append(canvas);
            document.body.append(fat);
            log(gl);

            gl.clearColor(0, 0, 0, 0.2);
            gl.clear(gl.COLOR_BUFFER_BIT);

            let buffer = gl.createBuffer();
            gl.bindBuffer(gl.ARRAY_BUFFER, buffer);

            function render(vs, fs, vertice, type) {

                let vShader = gl.createShader(gl.VERTEX_SHADER);
                gl.shaderSource(vShader, vs);
                gl.compileShader(vShader);
                gl.getShaderParameter(vShader, gl.COMPILE_STATUS);

                let fShader = gl.createShader(gl.FRAGMENT_SHADER);
                gl.shaderSource(fShader, fs);
                gl.compileShader(fShader);
                gl.getShaderParameter(fShader, gl.COMPILE_STATUS);

                let program = gl.createProgram();
                gl.attachShader(program, vShader);
                gl.attachShader(program, fShader);
                gl.linkProgram(program);
                gl.getProgramParameter(program, gl.LINK_STATUS);
                gl.useProgram(program);

                let vertex = gl.getAttribLocation(program, "vertex");
                gl.enableVertexAttribArray(vertex);
                gl.vertexAttribPointer(vertex, 2, gl.FLOAT, false, 0, 0);

                let vertices = vertice.length / 2;
                gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertice), gl.DYNAMIC_DRAW);
                gl.drawArrays(type, 0, vertices);
            }

            function hexToRgb(hex) {
                return hex.slice(1).match(/.{1,2}/g).map(g => parseInt(g, 16));
            }

            function getRgb(r, g, b) {
                return [r / 255, g / 255, b / 255].join(", ");
            }

            let max = 50;
            for (let i = 0; i < max; i++) {
                let radian = (Math.PI * (i / (max / 2)));
                render(`
                precision mediump float;
                attribute vec2 vertex;
                void main(void) {
                    gl_Position = vec4(vertex, 0, 1);
                }
                `, `
                precision mediump float;
                void main(void) {
                    gl_FragColor = vec4(${getRgb(...hexToRgb("#cc5151"))}, 1);
                }
                `, [
                    // moveto, lineto
                    0 + (Math.cos(radian) * 0.5), 0 + (Math.sin(radian) * 0.5),
                    0, 0,
                ], gl.LINE_LOOP);
            }
        }
    };
    if (codes) {
        for (let code in codes) {
            let func = codes[code];
            typeof func === "function" && func();
        }
        window.enableHack = function() {
            if (!useHack) {
                useHack = true;
                codes.main();
            }
        };
    }
}(1);

//                         if (near.dist <= items.weapons[player.weapons[0]].range + (near.enemy.scale * 1.8) && !traps.intrap && !autos.insta.wait) {
//                             autos.bull = true;
//                             if (player.weaponIndex != player.weapons[0]) {
//                                 selectWeapon(player.weapons[0]);
//                             }
//                             if (player.reloads[player.weapons[0]] == 0) {
//                                 io.send("7", 1);
//                                 io.send("2", near.aim);
//                                 buyEquip(7, 0);
//                                 setTimeout(()=> {
//                                     io.send("7", 1);
//                                     buyEquip(6, 0);
//                                 }, game.tickRate);
//                             }
//                         } else {
//                             autos.bull = false;
//                         }
//window.devicePixelRatio = 0.2;
//selectSkinColor(4);
document.getElementById("woodDisplay").remove();
document.getElementById("stoneDisplay").remove();
document.getElementById("foodDisplay").remove();433333