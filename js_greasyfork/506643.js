// ==UserScript==
// @name         IADO Mod (Edited Chimken-Mod)
// @version      V1.123456789101112.5
// @author       IAmDaOne -IADO-
// @description  Turning chimken mod into the best moomoo hack slowly but surely.
// @match        *://moomoo.io/*
// @match        *https://sandbox.moomoo.io/*
// @icon         https://img.freepik.com/premium-photo/intense-devil-art-black-white-wallpaper-with-multiple-filte_899449-50671.jpg
// @grant        none
// @license      MIT
// @namespace https://greasyfork.org/en/users/1362611
// @downloadURL https://update.greasyfork.org/scripts/506643/IADO%20Mod%20%28Edited%20Chimken-Mod%29.user.js
// @updateURL https://update.greasyfork.org/scripts/506643/IADO%20Mod%20%28Edited%20Chimken-Mod%29.meta.js
// ==/UserScript==

//Note for IADO (Code editor), remember to get the copied version of the Public Autochat when you are editing the code in the future.
//Note for IADO (Code editor), remember to get the copied version of the Public Autochat when you are editing the code in the future.

// Game-Ground 2 xD
let whereverifybutton = document.querySelector("#altcha_checkbox")
function clicktheverify() {
if (whereverifybutton) {
    whereverifybutton.click()
}
}
setInterval(clicktheverify, 1);
document.getElementById("enterGame").addEventListener("mouseleave", function() {
    document.getElementById('enterGame').innerText = "⚜️❗Click here❗⚜️";
document.getElementById("gameName").style.color = "ff0000";
});
document.getElementById('enterGame').innerText = "⚜️❗Click here❗⚜️";
document.getElementById("enterGame").addEventListener("mouseenter", function() {
    document.getElementById('enterGame').innerText = "👉❓❗Play❓❗👈";
    document.getElementById("gameName").style.color = "ff0000";
});

$("#mapDisplay").css({
    background: `url('https://i.imgur.com/fgFsQJp.png')`
    });


                            setTimeout(() => {
                                document.getElementById('gameName').innerHTML = 'Chimken-Mod!';
                                setTimeout(() => {
                                    document.getElementById('gameName').innerHTML = ':) Just kidding';
                                    setTimeout(() => {
                                        document.getElementById('gameName').innerHTML = 'Get pranked';
                                        setTimeout(() => {
                                                document.getElementById('gameName').innerHTML = 'IADO Mod';
                                            setTimeout(() => {
                                                    document.getElementById('gameName').innerHTML = '';
                                                }, 1100);
                                            }, 1100);
                                        }, 1400);
                                    }, 1100);
                                }, 1100);


document.title = "IADO's Moomoo :3";
document.getElementById("mainMenu").style.backgroundSize = "cover";
document.getElementById("mainMenu").style.backgroundPosition = "center";
document.getElementById("mainMenu").style.width = "100%";
document.getElementById("mainMenu").style.height = "100vh";
document.getElementById("gameName").style.textShadow = "#FF2525 -2px -2px 10px, black 0px -5px 1px, white 0px -5px 10px";
document.getElementById("loadingText").innerText="";
document.getElementById("leaderboard").append("IADO-Mod");

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
// Test Auto Reply
let founda = false;
let scriptTags = document.getElementsByTagName("script");
for (let i = 0; i < scriptTags.length; i++) {
    if (scriptTags[i].src.includes("index-f3a4c1ad.js") && !founda) {
        scriptTags[i].remove();
        founda = true;
        break;
    }
}


var styleItem = document.createElement("style");
styleItem.type = "text/css";
styleItem.appendChild(document.createTextNode(`
#suggestBox {
    width: 355px;
    border-radius: 3px;
    background-color: rgba(0,0,0,0.5);
    margin: auto;
    text-align: left;
    z-index: 49;
    pointer-events: auto;
    position: relative;
    bottom: 3.5px;
    overflow-y: auto;
}
#suggestBox div {
    background-color: rgba(255,255,255,0);
    color: rgba(255,255,255,1);
    transition: background-color 0.3s, color 0.3s;
}
#suggestBox div:hover {
    background-color: rgba(255,255,255,0.2);
    color: rgba(0,0,0,1);
}
.suggestBoxHard {
    color: rgba(255,255,255,1);
    font-size: 18px;
}
.suggestBoxLight {
    color: rgba(255,255,255,0.7);
    font-size: 18px;
}
`));
document.head.appendChild(styleItem);

window.addEventListener('load', function() {
    var allianceButton = document.getElementById('allianceButton');
    var storeButton = document.getElementById('storeButton');
    if (storeButton) {
        storeButton.style.right = '26px';
        storeButton.style.top = '420px';
    }
    if (allianceButton) {
        allianceButton.style.right = '26px';
        allianceButton.style.top = '479px';
    }
});

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
                            if (n.endX !== e.x || n.endY !== e.y) (e.list = 0) < e.y && T(n, e, 0, -1, +b(e.x, e.y - 1)), e.x < c[0].length - 1 && T(n, e, 1, 0, +b(e.x + 1, e.y)), e.y < c.length - 1 && T(n, e, 0, 1, +b(e.x, e.y + 1)), 0 < e.x && T(n, e, -1, 0, +b(e.x - 1, e.y)), v && (0 < e.x && 0 < e.y && (a || g(c, f, e.x, e.y - 1, e) && g(c, f, e.x - 1, e.y, e)) && T(n, e, -1, -1, s * b(e.x - 1, e.y - 1)), e.x < c[0].length - 1 && e.y < c.length - 1 && (a || g(c, f, e.x, e.y + 1, e) && g(c, f, e.x + 1, e.y, e)) && T(n, e, 1, 1, s * b(e.x + 1, e.y + 1)), e.x < c[0].length - 1 && 0 < e.y && (a || g(c, f, e.x, e.y - 1, e) && g(c, f, e.x + 1, e.y, e)) && T(n, e, 1, -1, s * b(e.x + 1, e.y - 1)), 0 < e.x && e.y < c.length - 1 && (a || g(c, f, e.x, e.y + 1, e) && g(c, f, e.x - 1, e.y, e)) && T(n, e, -1, 1, s * b(e.x - 1, e.y + 1)));
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
        }, s.prototype.insert = s.prototype.push, s.prototype.top = s.prototype.peek, s.prototype.front = s.prototype.peek, s.prototype.has = s.prototype.contains, s.prototype.copy = s.prototype.clone, t = s, g = [], void 0 === (x = "function" == typeof (x = function() {
            return t
        }) ? x.apply(T, g) : x) || (u.exports = x)
    }).call(this)
}]);
let easystar = new EasyStar.js();
!function(run) {

    let newFont = document.createElement("link");
    newFont.rel = "stylesheet";
    newFont.href = "https://fonts.googleapis.com/css?family=Ubuntu:700";
    newFont.type = "text/css";
    document.body.append(newFont);

    let min = document.createElement("script");
    min.src = "https://rawgit.com/kawanet/msgpack-lite/master/dist/msgpack.min.js";
    document.body.append(min);
    window.oncontextmenu = function() {
        return false;
    };

    let config = window.config;

    // CLIENT:
    config.clientSendRate = 9; // Aim Packet Send Rate
    config.serverUpdateRate = 9;

    // UI:
    config.deathFadeout = 0;

    config.playerCapacity = 9999;

    // CHECK IN SANDBOX:
    config.isSandbox = window.location.hostname == "sandbox.moomoo.io";

    // CUSTOMIZATION:
    config.skinColors = ["#bf8f54", "#cbb091", "#896c4b",
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
    config.resetRender = true;

    function waitTime(timeout) {
        return new Promise((done) => {
            setTimeout(() => {
                done();
            }, timeout);
        });
    }

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
            killChat: true,
            alwaysRev: true,
            AutoUpgrade: false,
            autoBuy: true,
            autoBuyEquip: true,
            autoPush: true,
            revTick: true,
            spikeTick: true,
            predictTick: true,
            autoPlace: true,
            autoReplace: true,
            autoPrePlace: true,
            antiTrap: true,
            slowOT: false,
            attackDir: false,
            showDir: false,
            noDir: false,
            autoRespawn: false
        };
    };
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
    window.wasdMode = function() {};

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

    let hathuxinggai = true;
    let ping = 0;
    // nah hahahahahhh why good ping
            window.ping = hathuxinggai ? 86 : 0;

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
                newSelect += ` style = "color: ${setting.menu[options] ? "#000" : "#fff"}; background: ${setting.menu[options] ? "#8ecc51" : "#cc5151"};">${options}</option>`;
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
                    getEl("O_" + options).style.background = setting.menu[options] ? "#8ecc51" : "#cc5151";

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
        color: #fff;
        background-image: url('');
        background-size: cover;
        background-position: center;
        background-repeat: no-repeat;
        font-size: 28px;
        text-align: center;
        padding: 20px;
        max-height: 200px;
        width: 300px;
        background-color: #1f1f1f;
        border-radius: 15px;
        box-shadow: 0 8px 20px rgba(0, 0, 0, 0.3);
        transition: opacity 0.4s ease-in-out, transform 0.4s ease-in-out, box-shadow 0.3s ease-in-out, filter 0.4s ease-in-out, border-color 0.3s ease-in-out;
        overflow: auto;
        filter: none;
        border: 2px solid transparent; /* Add a border */
    }
    .menuClass:hover {
        border-color: rgb(255,255,255); /* Change border color on hover to RGB red */
    }
    .menuClass:hover .menuContent {
        background-color: #000; /* Change background color of menu content to darker black on hover */
    }
    .menuContent {
        color: #fff;
    }
    .menuC {
        display: none;
        font-family: "Hammersmith One", sans-serif;
        font-size: 14px;
        max-height: 200px;
        overflow-y: auto;
    }
    .menuB {
        text-align: center;
        background-color: #1f1f1f;
        color: #fff;
        border-radius: 25px;
        border: 2px solid transparent;
        cursor: pointer;
        overflow-y: auto;
        transition: border-color 0.3s ease-in-out;
    }
    .menuB:hover {
        border-color: #fff;
    }
    .menuB:active {
        color: #fff;
        background-color: #1f1f1f;
    }
    .customText {
        color: #000;
        border-radius: 25px;
        border: 2px solid #000;
        padding: 5px;
        transition: background-color 1s ease-in-out;
    }
    .customText:focus {
        background-color: #999;
    }
    .checkB {
        position: relative;
        top: 2px;
        accent-color: #888;
        cursor: pointer;
    }
    .Cselect {
        border-radius: 25px;
        background-color: #1f1f1f;
        color: #fff;
        border: 1px solid #000;
    }
    #menuChanger {
        position: absolute;
        right: 20px;
        top: 20px;
        background-color: rgba(0, 0, 0, 0);
        color: #fff;
        border: none;
        cursor: pointer;
        transition: color 0.3s ease-in-out;
    }
    #menuChanger:hover {
        color: #000;
    }

    ::-webkit-scrollbar {
        width: 0; /* Skryje vertikální scrollbar na WebKit prohlížečích */
    }
`);

    HTML.startDiv({
        id: "menuHeadLine",
        class: "menuClass"
    }, (html) => {
        html.add(`IADO Mod Menu`);
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
            html.button({
                class: "menuB",
                innerHTML: "Debug (Maybe works)",
                onclick: "window.debug()"
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
                innerHTML: "Useless Button",
                onclick: "window.wasdMode()"
            });
            html.newLine();
            html.add(`Ruby Grind:`);
            html.checkBox({
                id: "weaponGrind",
                class: "checkB",
                onclick: "window.startGrind()"
            });
            html.newLine();
            HTML.addDiv({
                style: "font-size: 20px; color: #99ee99;",
                appendID: "menuMain"
            }, (html) => {
                html.add(`Settings:`);
            });
            html.add(`Push v4:`);
            html.checkBox({
                id: "antipush",
                class: "checkB",
                checked: true
            });
            html.newLine();
            html.add(`Anti heal:`);
            html.checkBox({
                id: "healingBeta",
                class: "checkB",
                checked: true
            });
            html.newLine();
        });
        HTML.addDiv({
            id: "menuConfig",
            class: "menuC",
            appendID: "menuHeadLine"
        }, (html) => {
            html.add(`Placement Tick: `);
            html.text({
                id: "autoPlaceTick",
                class: "customText",
                value: "1",
                size: "2em",
                maxLength: "1"
            });
                    html.newLine();
                    html.add(`AutoChat `);
                    html.checkBox({
                        id: "autochat",
                        class: "checkB",
                        checked: true
                    });
            html.newLine();
            html.add(`Options: `);
            html.selectMenu({
                id: "configsChanger",
                class: "Cselect",
                menu: configs
            });
            html.newLine();
            html.add(`AntiBull: `);
            html.select({
                id: "antiBullType",
                class: "Cselect",
                option: {
                    "Disable": {
                        id: "noab",
                        selected: true,
                    },
                    "When Reloaded": {
                        id: "abreload",
                    },
                    "Always": {
                        id: "abalway",
                    }
                }
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
            html.add(`Break Objects Range: `);
            html.text({
                id: "breakRange",
                class: "customText",
                value: "700",
                size: "3em",
                maxLength: "4"
            });
            html.newLine();
            html.add(`Render Movement: `);
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
            });
                    html.newLine();
                    html.add(`Safe AntiSpikeTick: `);
                    html.checkBox({ id: "safeAntiSpikeTick", class: "checkB", checked: true });
        html.newLine();
        html.add(`BackupNoBull: `);
        html.checkBox({ id: "backupNobull", class: "checkB", checked: false });
        });
    });
    function toFancyTimeFormat(time) {
        let minutes = ~~((time % 3600) / 60);
        let seconds = ~~time % 60;
        if (seconds <= 9) seconds = `0${seconds}`;
        return `${minutes}:${seconds}`;
    }

    let menuChatDiv = document.createElement("div");
    menuChatDiv.id = "menuChatDiv";
    document.body.appendChild(menuChatDiv);
    HTML.set("menuChatDiv");
    HTML.setStyle(`
            position: absolute;
            display: none;
            left: 0px;
            top: 25px;
          //  box-shadow: 0px 0px 10px rgba(0, 0, 0, 0.65);
            `);
    HTML.resetHTML();
    HTML.setCSS(`
                    .chDiv {
    color: #fff;
    padding: 10px;
    width: 357px;
    height: 217px;
    background-color: rgba(0, 0, 0, 0.2);
    font-family: "HammerSmith One", monospace;
 //   border-radius: 15px;
//    box-shadow: black 1px 2px 19px;
//backdrop-filter: blur(3px);

}
.chMainDiv {
    font-family: "Ubuntu";
    font-size: 16px;
    max-height: 215px;
    overflow-y: scroll;
    scrollbar-width: thin;
    scrollbar-color: rgba(0, 0, 0, 0.5) rgba(0, 0, 0, 0.1);
    -webkit-touch-callout: none;
    -webkit-user-select: none;
    -khtml-user-select: none;
    -moz-user-select: none;
    -ms-user-select: none;
    user-select: none;
    overflow-x: hidden;
}
.chMainDiv::-webkit-scrollbar {
    width: 8px;
}
.chMainDiv::-webkit-scrollbar-thumb {
    background-color: rgba(0, 0, 0, 0.5);
}
.chMainDiv::-webkit-scrollbar-thumb:hover {
    background-color: rgba(0, 0, 0, 0.7);
}
.chMainBox {
display:none;
     position: absolute;
    left: 10px;
    bottom: 10px;
    width: 380px;
    height: 25px;
    background-color: rgba(255, 255, 255, 0.1);
    border-radius: 5px;
    color: rgba(255, 255, 255, 0.75);
    font-family: "HammerSmith One";
    font-size: 12px;
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
            //  placeHolder: `To chat click here or press "Enter" key`
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
        let text = ``;
        if (!noTimer) text += `${(hour < 10 ? '0' : '') + hour}:${(min < 10 ? '0' : '') + min}`;
        if (name) text += `${(!noTimer ? " - " : "") + name}`;
        if (message) text += `${(name ? ": " : !noTimer ? " - " : "") + message}\n`;
        HTML.addDiv({ id: "menuChDisp", style: `color: ${color}`, appendID: "mChMain" }, (html) => {
            html.add(text);
        });
        menuChats.scrollTop = menuChats.scrollHeight;
        menuChCounts++;
    }
    function chch(name, message, color, noTimer) {
        HTML.set("menuChatDiv");
        color = color || "white";
        let time = new Date();
        let text = ``;
        // if (name) text += `${(!noTimer ? " - " : "") + name}`;
        if (message) text += `${(name ? ": " : !noTimer ? "" : "") + message}\n`;
        HTML.addDiv({ id: "menuChDisp", style: `color: ${color}`, appendID: "mChMain" }, (html) => {
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

    let menuIndex = 0;
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
            font: 15px HammerSmith One;
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
            html.add("None");
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
    let log = console.log;
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
            } else if (type == "F") {
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
            } else if (type == "f") {
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

                secPacket++;
            }
        } else {
            this.nsend(message);
        }
    }

            function packet(type) {
                if (secPacket < 80) {
                // EXTRACT DATA ARRAY:
                let data = Array.prototype.slice.call(arguments, 1);
                // SEND MESSAGE:
                let binary = window.msgpack.encode([type, data]);
                WS.send(binary);
                }
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
                    A: setInitData,
                    //B: disconnect,
                    C: setupGame,
                    D: addPlayer,
                    E: removePlayer,
                    a: updatePlayers,
                    G: updateLeaderboard,
                    H: loadGameObject,
                    I: loadAI,
                    J: animateAI,
                    K: gatherAnimation,
                    L: wiggleGameObject,
                    M: shootTurret,
                    N: updatePlayerValue,
                    O: updateHealth,
                    P: killPlayer,
                    Q: killObject,
                    R: killObjects,
                    S: updateItemCounts,
                    T: updateAge,
                    U: updateUpgrades,
                    V: updateItems,
                    X: addProjectile,
                    Y: remProjectile,

                    2: allianceNotification,
                    3: setPlayerTeam,
                    4: setAlliancePlayers,
                    5: updateStoreItems,
                    6: receiveChat,
                    7: updateMinimap,
                    8: showText,
                    9: pingMap,
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
    function resetMoveDir() {
        keys = {};
        io.send("e");
    }

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
    let liztobj = [];
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
        age1insta: false,
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
            gameName.innerText = "Chimken-Mod!";
            let adCard = getEl("adCard");
            adCard.remove();
            let promoImageHolder = getEl("promoImgHolder");
            promoImageHolder.remove();

    let chatButton = getEl("chatButton");
    chatButton.remove();
    let autochat = getEl("autochat");
    let profanityList = ["cunt", "whore", "fuck", "shit", "faggot", "nigger",
                                 "nigga", "dick", "vagina", "minge", "cock", "rape", "cum", "sex",
                                 "tits", "penis", "clit", "pussy", "meatcurtain", "jizz", "prune",
                                 "douche", "wanker", "damn", "bitch", "dick", "fag", "bastard"];
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
    getEl("mainMenu").style.backgroundImage = "url('https://wallpaperaccess.com/full/8733703.jpg')"
    let diedText = getEl("diedText");
    let screenWidth;
    let screenHeight;
    let maxScreenWidth = config.maxScreenWidth;
    let maxScreenHeight = config.maxScreenHeight;
                function zoomVision() {
                if (maxScreenWidth != config.maxScreenWidth * 1.5 || maxScreenHeight != config.maxScreenHeight * 1.5) {
                    maxScreenWidth = config.maxScreenWidth * 1.5;
                    maxScreenHeight = config.maxScreenHeight * 1.5;
                    resize();
                }
            }
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

    let outlineColor = "#525252";
    let darkOutlineColor = "#3d3f42";
    let outlineWidth = 5.5;

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
    let ms = {
        avg: 0,
        max: 0,
        min: 0,
        delay: 0
    }
    function pingSocketResponse() {
        let pingTime = window.pingTime;
        const pingDisplay = document.getElementById("pingDisplay")
        pingDisplay.innerText = "Ping: " + pingTime + " ms`";
        if (pingTime > ms.max || isNaN(ms.max)) {
            ms.max = pingTime;
        }
        if (pingTime < ms.min || isNaN(ms.min)) {
            ms.min = pingTime;
        }

        // if (pingTime >= 90) {
        //     doAutoQ = true;
        // } else {
        //     doAutoQ = false;
        // }
    }

    let placeVisible = [];

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
                           ].reverse();
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
                (this.x = x),
                    (this.y = y),
                    (this.color = color),
                    (this.scale = scale*3.5),
                    (this.weight = 50);
                (this.startScale = this.scale * 1.2),
                    (this.maxScale = 1.5 * scale),
                    (this.minScale = 0.5 * scale),
                    (this.scaleSpeed = 0.7),
                    (this.speed = speed),
                    (this.speedMax = speed),
                    (this.life = life),
                    (this.maxLife = life),
                    (this.text = text),
                    this.movSpeed = speed;
            };

            // UPDATE:
            this.update = function(delta) {
                if(this.life){
                    this.life -= delta;
                    if(this.scaleSpeed != -0.35){
                        this.y -= this.speed * delta;
                        // (this.x += this.speed * delta);
                    } else {
                        this.y -= this.speed * delta;
                    }
                    this.scale -= .8;
                    // this.scale > 0.35 && (this.scale = Math.max(this.scale, this.startScale));
                    // this.speed < this.speedMax && (this.speed -= this.speedMax * .0075);
                    if(this.scale >= this.maxScale){
                        this.scale = this.maxScale;
                        this.scaleSpeed *= -.5;
                        this.speed = this.speed * .75;
                    };
                    this.life <= 0 && (this.life = 0)
                };
            };

            // RENDER:
            this.render = function(ctxt, xOff, yOff) {
                ctxt.lineWidth = 10;
                ctxt.strokeStyle = darkOutlineColor; //"black";
                ctxt.fillStyle = this.color;
                ctxt.globalAlpha = 1;
                ctxt.font = this.scale + "px HammerSmith One";
                ctxt.strokeText(this.text, this.x - xOff, this.y - yOff);
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
                this.render = true;
                this.doUpdate = data.doUpdate;
                this.x = x;
                this.y = y;
                this.dir = dir;
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
                    let d2 = UTILS.getAngleDist(this.lastDir, this.dir);
                    if (d2 > 0.01) {
                        this.dir += d2 / 5;
                    } else {
                        this.dir = this.lastDir;
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
        constructor(GameObject, liztobj, UTILS, config, players, server) {
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
                let cantPlace = liztobj.find((tmp) => tmp.active && UTILS.getDistance(x, y, tmp.x, tmp.y) < s + (tmp.blocker ? tmp.blocker : tmp.getScale(sM, tmp.isItem)));
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
                    }, {
                        id: 9,
                        name: "💀MOOFIE",
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
                        weightM: .45,
                        speed: .0015,
                        turnSpeed: .0025,
                        scale: 94,
                        viewRange: 1440,
                        chargePlayer: !0,
                        drop: ["food", 3e3],
                        minSpawnRange: .85,
                        maxSpawnRange: .9
                    }, {
                        id: 10,
                        name: "💀Wolf",
                        src: "wolf_1",
                        hostile: !0,
                        fixedSpawn: !0,
                        dontRun: !0,
                        hitScare: 50,
                        spawnDelay: 3e4,
                        dmg: 10,
                        killScore: 700,
                        health: 500,
                        weightM: .45,
                        speed: .00115,
                        turnSpeed: .0025,
                        scale: 88,
                        viewRange: 1440,
                        chargePlayer: !0,
                        drop: ["food", 400],
                        minSpawnRange: .85,
                        maxSpawnRange: .9
                    }, {
                        id: 11,
                        name: "💀Bully",
                        src: "bull_1",
                        hostile: !0,
                        fixedSpawn: !0,
                        dontRun: !0,
                        hitScare: 50,
                        dmg: 20,
                        killScore: 5e3,
                        health: 5e3,
                        spawnDelay: 1e5,
                        weightM: .45,
                        speed: .00115,
                        turnSpeed: .0025,
                        scale: 94,
                        viewRange: 1440,
                        chargePlayer: !0,
                        drop: ["food", 800],
                        minSpawnRange: .85,
                        maxSpawnRange: .9
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
                this.showName = 'YEAHHH';
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
            this.showName = 'YEAHHH';
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
            this.cAngle = 0;
            // SPAWN:
            this.spawn = function(moofoll) {
                this.attacked = false;
                this.timeDamaged = 0;
                this.timeHealed = 0;
                this.pinge = 0;
                this.millPlace = 'NOOO';
                this.lastshamecount = 0;
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

                // PREPLACER
                if (this.reloads[this.weaponIndex] <= 1000/9) {
                    // place(2, getAttackDir());
                    let index = this.weaponIndex;
                    let nearObja = liztobj.filter((e) => (e.active || e.alive) && e.health < e.maxHealth && e.group !== undefined && UTILS.getDist(e, player, 0, 2) <= (items.weapons[player.weaponIndex].range + e.scale));
                    for(let i = 0; i < nearObja.length; i++) {
                        let aaa = nearObja[i];

                        let val = items.weapons[index].dmg * (config.weaponVariants[tmpObj[(index < 9 ? "prima" : "seconda") + "ryVariant"]].val) * (items.weapons[index].sDmg || 1) * 3.3;
                        let valaa = items.weapons[index].dmg * (config.weaponVariants[tmpObj[(index < 9 ? "prima" : "seconda") + "ryVariant"]].val) * (items.weapons[index].sDmg || 1);
                        if(aaa.health - (valaa) <= 0 && near.length) {
                            place(near.dist2<((near.scale * 1.8) + 50)?4:2, caf(aaa, player) + Math.PI)
                            console.log("preplaced");
                        }
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
                            // Math.max(0, this.reloads[this.weaponIndex] - game.tickRate)
                            this.reloads[this.weaponIndex] = Math.max(0, this.reloads[this.weaponIndex] - 110);
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
                secondary.dmg = secondary.weapon == undefined ? 75 : items.weapons[secondary.weapon].Pdmg;
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
        packet("z", index, wpn);
    }

    function selectWeapon(index, isPlace) {
        if (!isPlace) {
            player.weaponCode = index;
        }
        packet("z", index, 1);
    }

    function sendAutoGather() {
        packet("K", 1, 1);
    }

    function sendAtck(id, angle) {
        packet("F", id, angle, 1);
    }

    // PLACER:
    function place(id, rad, rmd) {
        try {
            if (id == undefined) return;
            let item = items.list[player.items[id]];
            let tmpS = player.scale + item.scale + (item.placeOffset || 0);
            let tmpX = player.x2 + tmpS * Math.cos(rad);
            let tmpY = player.y2 + tmpS * Math.sin(rad);
            if ((player.alive && inGame && player.itemCounts[item.group.id] == undefined ? true : player.itemCounts[item.group.id] < (config.isSandbox ? 299 : item.group.limit ? item.group.limit : 99))) {
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
            if (secPacket >= 60) return;
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
        if ((player.skinIndex != 45 && player.skinIndex != 56)) {
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
        sendChat("Fuck you syncer. Kill yourself");
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
    function applCxC(value) {
        if (player.health == 100)
            return 0;
        if (player.skinIndex != 45 && player.skinIndex != 56) {
            return Math.ceil(value / items.list[player.items[0]].healing);
        }
        return 0;
    }
    function calcDmg(value) {
        return value * player.skinIndex == 6 ? 0.75 : 1;
    }
    function biomeGear(mover, returns) {
        if (player.y2 >= config.mapScale / 2 - config.riverWidth / 2 && player.y2 <= config.mapScale / 2 + config.riverWidth / 2) {
            if (returns) return 31;
            buyEquip(31, 0);
        } else {
            if (player.y2 <= config.snowBiomeTop) {
                if (returns) return mover && player.moveDir == undefined ? 22 : 15;
                buyEquip(mover && player.moveDir == undefined ? 6 : 15, 0);
            } else {
                if (returns) return mover && player.moveDir == undefined ? 22 : 6;
                buyEquip(mover && player.moveDir == undefined ? 6 : 12, 0);
            }
        }
        if (returns) return 0;
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
                        if (item.id != 19 && tmpY >= config.mapScale / 2 - config.riverWidth / 2 && tmpY <= config.mapScale / 2 + config.riverWidth / 2) continue;
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
                                    player.chat.count = 100000;
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
        function predictEnemyPosition(enemyPositions, time = 1) {
            const lastKnownPosition = enemyPositions[enemyPositions.length - 1];

            const predictedPosition = {
                x: lastKnownPosition.x + lastKnownPosition.xVel * time,
                y: lastKnownPosition.y + lastKnownPosition.yVel * time
            };

            return predictedPosition;
        }
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
                                    if ((near.dist3 <= 450)) {
                                        if (near.dist3 <= 200) {
                                            this.testCanPlace(4, 0, (Math.PI * 2), (Math.PI / 24), near.aim2, 0, {
                                                inTrap: near2.inTrap
                                            });
                                        } else {
                                            player.items[4] == 15 && this.testCanPlace(4, 0, (Math.PI * 2), (Math.PI / 24), near.aim2);
                                        }
                                    }
                                } else {
                                    if ((near.dist3 <= 450)) {
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
                                        inTrap: false,
                                    };
                                    let nearTrap = gameObjects.filter(e => e.trap && e.active && e.isTeamObject(player) && UTILS.getDist(e, near, 0, 2) <= (near.scale + e.getScale() + 5)).sort(function (a, b) {
                                        return UTILS.getDist(a, near, 0, 2) - UTILS.getDist(b, near, 0, 2);
                                    })[0];
                                    if (nearTrap) {
                                        near2.inTrap = true;
                                    } else {
                                        near2.inTrap = false;
                                    }
                                    if ((near.dist2 <= 275)) {
                                        if (near.dist2 <= 275) {
                                            this.testCanPlace(4, 0, (Math.PI * 2), (Math.PI / 24), near.aim2, 0, {inTrap: near2.inTrap});
                                        } else {
                                            player.items[4] == 15 && this.testCanPlace(4, 0, (Math.PI * 2), (Math.PI / 24), near.aim2);
                                        }
                                    }
                                } else {
                                    if ((near.dist2 <= 1000)) {
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
                            if (objDst <= 300 && near.dist2 <= 300) {
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
       this.replacer = function(findObj) {
                        if (!findObj || !configs.autoReplace) return;
                        if (!inGame) return;
                        if (this.antiTrapped) return;

                        game.tickBase(() => {
                            let objAim = UTILS.getDirect(findObj, player, 0, 2);
                            let objDst = UTILS.getDist(findObj, player, 0, 2);

                            let perfectAngle = calculatePerfectAngle(findObj.x, findObj.y, player.x, player.y);

                            if (getEl("weaponGrind").checked && objDst <= items.weapons[player.weaponIndex].range + player.scale) return;

                            if (objDst <= 300 && near.dist2 <= 300) {
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
            let inantiantibull = false
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
            this.age1insta = false;
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
                game.tickBase(() => {
                    selectWeapon(player.weapons[0]);
                    buyEquip(7, 0);
                    buyEquip(21, 1);
                    game.tickBase(() => {
                        sendAutoGather();
                        this.isTrue = false;
                        my.autoAim = false;
                    }, 1);
                }, 1);
            } else if (type == "nobull") {
                selectWeapon(player.weapons[0]);
                if (getEl("backupNobull").checked && backupNobull) {
                    buyEquip(7, 0);
                } else {
                    buyEquip(6, 0);
                }
                buyEquip(21, 1);
                sendAutoGather();
                game.tickBase(() => {
                    if (near.skinIndex == 22) {
                        if (getEl("backupNobull").checked) {
                            near.backupNobull = true;
                        }
                        buyEquip(21, 0);
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
                buyEquip(21, 1);
                sendAutoGather();
                game.tickBase(() => {
                    selectWeapon(player.weapons[1]);
                    buyEquip(player.reloads[53] == 0 ? 53 : 6, 0);
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
                            //if (player.reloads[53] == 0 && getEl("turretCombat").checked) {
                            buyEquip(53, 0);
                            buyEquip(21, 1);
                            selectWeapon(player.weapons[0]);
                            game.tickBase(() => {
                                sendAutoGather();
                                this.isTrue = false;
                                my.autoAim = false;
                            }, 1);
                        }, 1);
                    };
                        this.syncTry = function() {
                        io.send("6", "Fire");
                        if (player.weapons[1] == 15) {
                            this.isTrue = true;
                            my.autoAim = true;
                            game.tickBase(() => {
                                instaC.isTrue = true;
                                selectWeapon(player.weapons[1]);
                                buyEquip(53, 0);
                                buyEquip(19, 1);
                                sendAutoGather();
                                game.tickBase(() => {
                                    my.autoAim = false;
                                    instaC.isTrue = false;
                                    this.isTrue = false;
                                    sendAutoGather();
                                }, 1);
                            }, 1);
                          } else if (player.weapons[1] == 13) {
                            this.isTrue = true;
                            my.autoAim = true;
                            game.tickBase(() => {
                                instaC.isTrue = true;
                                selectWeapon(player.weapons[1]);
                                buyEquip(53, 0);
                                buyEquip(19, 1);
                                sendAutoGather();
                                game.tickBase(() => {
                                    my.autoAim = false;
                                    instaC.isTrue = false;
                                    this.isTrue = false;
                                    sendAutoGather();
                                }, 1);
                            }, 1);
                          } else if (player.weapons[1] == 12) {
                            this.isTrue = true;
                            my.autoAim = true;
                            game.tickBase(() => {
                                instaC.isTrue = true;
                                selectWeapon(player.weapons[1]);
                                buyEquip(53, 0);
                                buyEquip(19, 1);
                                sendAutoGather();
                                game.tickBase(() => {
                                    my.autoAim = false;
                                    instaC.isTrue = false;
                                    this.isTrue = false;
                                    sendAutoGather();
                                }, 1);
                            }, 1);
                          } else if (player.weapons[1] == 9) {
                            this.isTrue = true;
                            my.autoAim = true;
                            game.tickBase(() => {
                                instaC.isTrue = true;
                                selectWeapon(player.weapons[1]);
                                buyEquip(53, 0);
                                buyEquip(19, 1);
                                sendAutoGather();
                                game.tickBase(() => {
                                    my.autoAim = false;
                                    instaC.isTrue = false;
                                    this.isTrue = false;
                                    sendAutoGather();
                                }, 1);
                            }, 1);
                        }
                    };
                    /* this.spikeTickType = function() {
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
                    };*/
                    this.counterType = function() {
                        this.isTrue = true;
                        my.autoAim = true;
                        selectWeapon(player.weapons[0]);
                        buyEquip(7, 0);
                        buyEquip(21, 1);
                        sendAutoGather();
                        game.tickBase(() => {
                            //if (player.reloads[53] == 0 && getEl("turretCombat").checked) {
                                selectWeapon(player.weapons[0]);
                                buyEquip(53, 0);
                                buyEquip(21, 1);
                                game.tickBase(() => {
                                    sendAutoGather();
                                    this.isTrue = false;
                                    my.autoAim = false;
                                }, 1);
                                game.tickBase(() => {
                                    my.autoAim = false;
                                    instaC.isTrue = false;
                                    this.isTrue = false;
                                    sendAutoGather();
                                }, 1);
                        }, 1);
                    };
                    this.antiCounterType = function() {
                        my.autoAim = true;
                        this.isTrue = true;
                        inantiantibull = true;
                        selectWeapon(player.weapons[0]);
                        buyEquip(6, 0);
                        buyEquip(21, 1);
                        io.send("D", near.aim2);
                        sendAutoGather();
                        game.tickBase(() => {
                            buyEquip(player.reloads[53] == 0 ? player.skins[53] ? 53 : 6 : 6, 0);
                            buyEquip(21, 1);
                            game.tickBase(() => {
                                sendAutoGather();
                                this.isTrue = false;
                                my.autoAim = false;
                                inantiantibull = false;
                            }, 1);
                        }, 1)
                    };
                    this.rangeType = function(type) {
                        this.isTrue = true;
                        my.autoAim = true;
                        if (type == "ageInsta") {
                            my.ageInsta = false;
                            if (player.items[5] == 18) {
                                place(5, near.aim2);
                            }
                            packet("f", undefined, 1);
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
                            if (player.reloads[53] == 0 && near.dist2 <= 1000 && near.skinIndex != 22) {
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
                 io.send("One-Ticked");
                        this.isTrue = true;
                        my.autoAim = true;
                        selectWeapon(player.weapons[1]);
                        buyEquip(53, 0);
                        buyEquip(19, 1);
                        packet("f", near.aim2, 1);
                        if (player.weapons[1] == 15) {
                            sendAutoGather();
                        }
                        game.tickBase(() => {
                            selectWeapon(player.weapons[0]);
                            buyEquip(7, 0);
                            buyEquip(19, 1);
                            packet("f", near.aim2, 1);
                            if (player.weapons[1] != 15) {
                                sendAutoGather();
                            }
                            game.tickBase(() => {
                                sendAutoGather();
                                this.isTrue = false;
                                my.autoAim = false;
                                packet("f", undefined, 1);
                            }, 1);
                        }, 1);
                    };
                    this.threeOneTickType = function() {
                        io.send("Tick2");
                        this.isTrue = true;
                        my.autoAim = true;
                        selectWeapon(player.weapons[[10, 14].includes(player.weapons[1]) ? 1 : 0]);
                        biomeGear();
                        buyEquip(19, 1);
                        packet("f", near.aim2, 1);
                        game.tickBase(() => {
                            selectWeapon(player.weapons[[10, 14].includes(player.weapons[1]) ? 1 : 0]);
                            buyEquip(53, 0);
                            buyEquip(19, 1);
                            packet("f", near.aim2, 1);
                            game.tickBase(() => {
                                selectWeapon(player.weapons[0]);
                                buyEquip(7, 0);
                                buyEquip(19, 1);
                                sendAutoGather();
                                packet("f", near.aim2, 1);
                                game.tickBase(() => {
                                    sendAutoGather();
                                    this.isTrue = false;
                                    my.autoAim = false;
                                    packet("f", undefined, 1);
                                }, 1);
                            }, 1);
                        }, 1);
                    };
                    this.kmTickType = function() {
                        this.isTrue = true;
                        my.autoAim = true;
                        selectWeapon(player.weapons[1]);
                        buyEquip(53, 0);
                        buyEquip(19, 1);
                        sendAutoGather();
                        packet("f", near.aim2, 1);
                        game.tickBase(() => {
                            selectWeapon(player.weapons[0]);
                            buyEquip(7, 0);
                            buyEquip(19, 1);
                            packet("f", near.aim2, 1);
                            game.tickBase(() => {
                                sendAutoGather();
                                this.isTrue = false;
                                my.autoAim = false;
                                packet("f", undefined, 1);
                            }, 1);
                        }, 1);
                    };
                    this.boostTickType = function() {
                        /*this.isTrue = true;
                        my.autoAim = true;
                        selectWeapon(player.weapons[0]);
                        buyEquip(53, 0);
                        buyEquip(19, 1);
                        packet("f", near.aim2);
                        game.tickBase(() => {
                            place(4, near.aim2);
                            selectWeapon(player.weapons[1]);
                            biomeGear();
                            buyEquip(19, 1);
                            sendAutoGather();
                            packet("f", near.aim2);
                            game.tickBase(() => {
                                selectWeapon(player.weapons[0]);
                                buyEquip(7, 0);
                                buyEquip(19, 1);
                                packet("f", near.aim2);
                                game.tickBase(() => {
                                    sendAutoGather();
                                    this.isTrue = false;
                                    my.autoAim = false;
                                    packet("f", undefined);
                                }, 1);
                            }, 1);
                        }, 1);*/
                        this.isTrue = true;
                        my.autoAim = true;
                        biomeGear();
                        buyEquip(19, 1);
                        packet("f", near.aim2, 1);
                        game.tickBase(() => {
                            selectWeapon(player.weapons[[9, 12, 13, 15].includes(player.weapons[1]) ? 1 : 0]);
                            buyEquip(53, 0);
                            buyEquip(19, 1);
                            if ([9, 12, 13, 15].includes(player.weapons[1])) {
                                sendAutoGather();
                            }
                            packet("f", near.aim2, 1);
                            place(4, near.aim2);
                            game.tickBase(() => {
                                selectWeapon(player.weapons[0]);
                                buyEquip(7, 0);
                                buyEquip(19, 1);
                                if (![9, 12, 13, 15].includes(player.weapons[1])) {
                                    sendAutoGather();
                                }
                                packet("f", near.aim2, 1);
                                game.tickBase(() => {
                                    sendAutoGather();
                                    this.isTrue = false;
                                    my.autoAim = false;
                                    packet("f", undefined, 1);
                                }, 1);
                            }, 1);
                        }, 1);
                    };
                    this.age1insta = function() {
                        if (player.weapons[0] == 0) {
                            this.isTrue = true;
                            my.autoAim = true;
                            selectWeapon(player.weapons[0]);
                            buyEquip(53, 0);
                            buyEquip(7, 0);
                            buyEquip(21, 1);
                            sendAutoGather();
                            game.tickBase(() => {
                                sendUpgrade(5);
                                selectWeapon(player.weapons[0]);
                                buyEquip(7, 0);
                                buyEquip(21, 1);
                                game.tickBase(() => {
                                    sendAutoGather();
                                    this.isTrue = false;
                                    my.autoAim = false;
                                }, 1);
                            }, 1);
                        }
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
                                bQ(6, 0);
                                bQ(19, 1);
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
                                                bQ(19, 1);
                                                if (configs.none) {
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
                                            bQ(19, 1);
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
                                                bQ(19, 1);
                                                if (configs.none) {
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
                                            bQ(19, 1);
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
                    },
                    /** wait 1 tick for better quality */
                    this.bowMovement = function() {
                        let moveMent = this.gotoGoal(685, 3);
                        if (moveMent.action) {
                            if (player.reloads[53] == 0 && !this.isTrue) {
                                this.rangeType("ageInsta");
                            } else {
                                packet("f", moveMent.dir, 1);
                            }
                        } else {
                            packet("f", moveMent.dir, 1);
                        }
                    },
                        this.tickMovement = function() {
                        let dist = player.weapons[1] == 9 ? 240 : 240;
                        let actionDist = player.weapons[1] == 9 ? 2 : player.weapons[1] == 12 ? 1.5 : player.weapons[1] == 13 ? 1 : player.weapons[1] == 15 ? 2 : 3;
                        let moveMent = this.gotoGoal(238, 3);
                        if (moveMent.action) {
                            if (player.reloads[53] == 0 && !this.isTrue) {
                                this.boostTickType();
                            } else {
                                packet("f", moveMent.dir, 1);
                            }
                        } else {
                            packet("f", moveMent.dir, 1);
                        }
                    },
                        this.kmTickMovement = function() {
                        let moveMent = this.gotoGoal(240, 3);
                        if (moveMent.action) {
                            if (near.skinIndex != 22 && player.reloads[53] == 0 && !this.isTrue && ((game.tick - near.poisonTick) % config.serverUpdateRate == 8)) {
                                this.kmTickType();
                            } else {
                                packet("f", moveMent.dir, 1);
                            }
                        } else {
                            packet("f", moveMent.dir, 1);
                        }
                    },
                        this.boostTickMovement = function() {
                        let dist = player.weapons[1] == 9 ? 365 : player.weapons[1] == 12 ? 380 : player.weapons[1] == 13 ? 365 : player.weapons[1] == 15 ? 365 : 140;
                        let actionDist = player.weapons[1] == 9 ? 2 : player.weapons[1] == 12 ? 1.5 : player.weapons[1] == 13 ? 1 : player.weapons[1] == 15 ? 2 : 3;
                        let moveMent = this.gotoGoal(372, 3);
                        if (moveMent.action) {
                            if (player.reloads[53] == 0 && !this.isTrue) {
                                this.boostTickType();
                            } else {
                                packet("f", moveMent.dir, 1);
                            }
                        } else {
                            packet("f", moveMent.dir, 1);
                        }
                    }
        /** wait 1 tick for better quality */
        this.perfCheck = function(pl, nr) {
            if (nr.weaponIndex == 11 && UTILS.getAngleDist(nr.aim2 + Math.PI, nr.d2) <= config.shieldAngle) return false;
            if (![9, 12, 19, 15].includes(player.weapons[1])) return true;
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
            finds = liztobj.filter(tmp => tmp.active).find((tmp) => {
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
            var bianosTick = false;


    // LOADING:
    let UTILS = new Utils();
    let items = new Items();
    let objectManager = new Objectmanager(GameObject, gameObjects, UTILS, config);
    let store = new Store();
    let hats = store.hats;
    let accessories = store.accessories;
    let projectileManager = new ProjectileManager(Projectile, projectiles, players, ais, objectManager, items, config, UTILS);
    let aiManager = new AiManager(ais, AI, players, items, null, config, UTILS);
    let textManager = new Textmanager();

    let traps = new Traps(UTILS, items);
    let instaC = new Instakill();
    let autoBuy = new Autobuy([6, 7, 22, 12, 53, 40], [11, 19, 13, 21]);
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
            function predictHeal(times) {
                for (let i in times) {
                    place(0, getAttackDir());
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
                            place(3, tmpObj.aim2);
                            my.anti0Tick = 4;
                            if (!my.antiSync) {
                                antiSyncHealing(4);
                                packet("f", tmpObj.aim2+3.1415926535897932/2, 1)
                                game.tickBase(() => {
                                    packet("f", undefined, 1)
                                }, 2)
                            }
                        } else {
                            if (projectileCount >= 2) {
                                place(3, tmpObj.aim2);
                                packet("f", tmpObj.aim2+3.1415926535897932/2, 1)
                                my.anti0Tick = 4;
                                predictHeal(2)
                                game.tickBase(() => {
                                    packet("f", undefined, 1)
                                }, 4)
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
    var usingTouch;
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
    let clicked = {
        g: false
    }
    mals.addEventListener("mousedown", mouseDown, false);

    function mouseDown(e) {
        if (attackState != 1) {
            attackState = 1;
            if (e.button == 0) {
                clicks.left = true;
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

let wbe = 1;
let mWbe = 1;
let smothAnim = null;

function wheel(e, t = [null, 0]) {
    if (e.deltaY < 0) {
        wbe -= 0.05;
        maxScreenWidth = config.maxScreenWidth * wbe;
        maxScreenHeight = config.maxScreenHeight * wbe;
        resize()
    } else {
        wbe += 0.05;
        maxScreenWidth = config.maxScreenWidth * wbe;
        maxScreenHeight = config.maxScreenHeight * wbe;
        resize()
    }
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
    let plusDir = 0;
    let lastSpin = Date.now();
                function isNearPlayer() {
                return near.dist2 <= items.weapons[player.weapons[0]].range + near.scale * 1.8 && !traps.inTrap;
                buyEquip(21, 1);
            }
            function getAttackDir(debug) {
                if (debug) {
                    if (!player)
                return "0";

                    if (my.autoAim || (isNearPlayer() && clicks.left && player.reloads[player.weapons[0]] == 0)) {
                        lastDir = getEl("weaponGrind").checked ? "getSafeDir()" : enemy.length ? my.revAim ? "(near.aim2 + Math.PI)" : "near.aim2" : "getSafeDir()";
                    } else if (clicks.right && player.reloads[player.weapons[1] == 10 ? player.weapons[1] : player.weapons[0]] == 0) {
                        lastDir = "getSafeDir()";
                    } else if (traps.inTrap && player.reloads[traps.notFast() ? player.weapons[1] : player.weapons[0]] == 0) {
                        lastDir = "traps.aim";
                    } else if (!player.lockDir) {
                        if (configs.noDir) return "undefined";
                        lastDir = "getSafeDir()";
                    }

                    return lastDir;
                } else {
                    if (!player)
                        return 0;

                    if (my.autoAim || (isNearPlayer() && clicks.left && player.reloads[player.weapons[0]] == 0)) {
                        lastDir = getEl("weaponGrind").checked ? getSafeDir() : enemy.length ? my.revAim ? (near.aim2 + Math.PI) : near.aim2 : getSafeDir();
                    } else if (clicks.right && player.reloads[player.weapons[1] == 10 ? player.weapons[1] : player.weapons[0]] == 0) {
                        lastDir = getSafeDir();
                    } else if (traps.inTrap && player.reloads[traps.notFast() ? player.weapons[1] : player.weapons[0]] == 0) {
                        lastDir = traps.aim;
                    } else if (!player.lockDir) {
                        if (configs.noDir) return undefined;
                        lastDir = getSafeDir();
                    }

                    return lastDir || 0;
                }
            }
    function getVisualDir() {
        if (!player)
            return 0;
        lastDir = getSafeDir();
        return lastDir || 0;
    }

    // KEYS:
    function keysActive() {
        return (allianceMenu.style.display != "block" &&
                chatHolder.style.display != "block" &&
                !menuCBFocus);
    }

    function toggleMenuChat() {
        if (menuChatDiv.style.display != "none") {
            //   chatHolder.style.display = "none";
            // if (menuChatBox.value != "") {
            //commands[command.slice(1)]
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

      function keyDown(event) {
                let keyNum = event.which || event.keyCode || 0;
                if (player && player.alive && keysActive()) {
                    if (!keys[keyNum]) {
                        keys[keyNum] = 1;
                        macro[event.key] = 1;
                        if (keyNum == 27) {
                            openMenu = !openMenu;
                            $("#menuDiv").toggle();
                        } else if (keyNum == 69) {
                            sendAutoGather();
                        } else if (keyNum == 67) {
                            updateMapMarker();
                        } else if (keyNum == 71) {
                            clicked.g = !clicked.g
                        } else if (keyNum == 79) {
                            clicked.o = !clicked.o
                        } else if (player.weapons[keyNum - 49] != undefined) {
                            player.weaponCode = player.weapons[keyNum - 49];
                        } else if (moveKeys[keyNum]) {
                            sendMoveDir();
                        } else if (event.key == "m") {
                            mills.placeSpawnPads = !mills.placeSpawnPads;
                        } else if (event.key == "z") {
                            mills.place = !mills.place;
                        } else if (event.key == "=") {
                            typeof window.debug == "function" && window.debug();
                        } else if (keyNum == 32) {
                            packet("F", 1, getSafeDir(), 1);
                            packet("F", 0, getSafeDir(), 1);
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
                        packet("f", newMoveDir, 1);
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
                packet("f", undefined, 1);
            } else {
                createPath();
                easystar.setGrid(grid);
                easystar.setAcceptableTiles([0]);
                easystar.enableDiagonals();
                easystar.findPath((grid[0].length / 2), (grid.length / 2), pathFind.lastX, pathFind.lastY, function (path) {
                    if (path === null) {
                        pathFind.array = [];
                        if (near.dist2 <= items.weapons[player.weapons[0]].range) {
                            packet("f", undefined, 1);
                        } else {
                            packet("f", near.aim2, 1);
                        }
                    } else {
                        pathFind.array = path;
                        if (pathFind.array.length > 1) {
                            let tmpXY = {
                                x: (player.x2 - (pathFind.scale / 2)) + ((pathFind.scale / pathFind.grid) * path[1].x),
                                y: (player.y2 - (pathFind.scale / 2)) + ((pathFind.scale / pathFind.grid) * path[1].y)
                            }
                            packet("f", UTILS.getDirect(tmpXY, player, 0, 2), 1);
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
                let pushAngle = Math.atan2(near.y2 - spike.y, near.x2 - spike.x)

                /*let pos = {
                            x: spike.x + (250 * Math.cos(UTILS.getDirect(near, spike, 2, 0))),
                            y: spike.y + (250 * Math.sin(UTILS.getDirect(near, spike, 2, 0))),
                            x2: spike.x + ((UTILS.getDist(near, spike, 2, 0) + player.scale) * Math.cos(UTILS.getDirect(near, spike, 2, 0))) + Math.cos(25),
                            y2: spike.y + ((UTILS.getDist(near, spike, 2, 0) + player.scale) * Math.sin(UTILS.getDirect(near, spike, 2, 0))) + Math.sin(25)
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
                                packet("f", lastMoveDir || undefined, 1);
                            }
                        } else {*/
                my.autoPush = true;
              sendChat("!I'm pushing you :3!");
                my.pushData = {
                    x: spike.x + Math.cos(pushAngle),
                    y: spike.y + Math.sin(pushAngle),
                    x2: player.x2+30,
                    y2: player.y2+30
                };

                let point = {
                    x: near.x2 + Math.cos(pushAngle) * 30,
                    y: near.y2 + Math.sin(pushAngle) * 60,
                }

                let dir = Math.atan2(point.y - player.y2, point.x - player.x2)

                packet("f", dir, 1)
                /*let scale = (player.scale / 10);
                            if (UTILS.lineInRect(player.x2 - scale, player.y2 - scale, player.x2 + scale, player.y2 + scale, near.x2, near.y2, pos.x, pos.y)) {
                                packet("f", near.aim2, 1);
                            } else {
                                packet("f", UTILS.getDirect(pos, player, 2, 2), 1);
                            }*/
                //}
            } else {
                if (my.autoPush) {
                    my.autoPush = false;
                    packet("f", lastMoveDir || undefined, 1);
                }
            }
        } else {
            if (my.autoPush) {
                my.autoPush = false;
                packet("f", lastMoveDir || undefined, 1);
            }
        }
    }


    class AutoPush {
        socket = null;

        findIntersect(vec, vec1, vec2) {
            // Find point of vec1 and vec2 intersection
            const delta = Math.hypot(vec1.x - vec2.x, vec1.y - vec2.y) / 2;
            const tang = Math.tan((vec1.y - vec2.y) / (vec1.x - vec2.x));
            const vec3x = Math.cos(tang) * delta;
            const vec3y = Math.sin(tang) * delta;
            // Find angle from vec to vec3
            const theta = Math.tan((vec.y - vec3y) / (vec.x - vec3x));

            return theta;
        };

        pushEnemy(player, enemy, spike) {
            const angle = this.findIntersect(enemy, spike, player);
            const dist = Math.hypot(player.x - enemy.x, player.y - enemy.y);

            if (dist > 180) return;

            this.socket.send("a", angle);
        };

        constructor(socket) {
            this.socket = socket;
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
        packet("F", 0, getAttackDir(), 1);
        my.ageInsta = true;
        if (firstSetup) {
            firstSetup = false;
            gameObjects.length = 0;
            liztobj.length = 0;
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
                addMenuChText(null, `Found ${data[2]} {${data[1]}}`, "lime");
            }
        } else {
            if (data[1] != playerSID) {
                addMenuChText(null, `Found ${data[2]} {${data[1]}}`, "lime");
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
            if (player.skins[7]) {
                my.reSync = true;
         if(player.shameCount > 0) {
             my.reSync = true;
         } else {
            my.reSync = false;
         }
        }
    }
}

    // REMOVE PLAYER:
    function removePlayer(id) {
        for (let i = 0; i < players.length; i++) {
            if (players[i].id == id) {
                addMenuChText("Game", players[i].name + "[" + players[i].sid + "] left the game", "red");
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
        inGame = false;
        lastDeath = {
            x: player.x,
            y: player.y,
        };
        if (configs.autoRespawn) {
            getEl("diedText").style.display = "none";
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
        if (xp != undefined){
        }
            player.XP = xp;
        if (mxp != undefined){
        }
            player.maxXP = mxp;
        if (age != undefined){
        }
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
                if (items.weapons[i].age == age && (items.weapons[i].pre == undefined || player.weapons.indexOf(items.weapons[i].pre) >= 0)) {
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
                if (items.list[i].age == age && (items.list[i].pre == undefined || player.items.indexOf(items.list[i].pre) >= 0)) {
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
                    // tmpItem.onmouseover = function() {
                    //     if (items.weapons[i]) {
                    //         showItemInfo(items.weapons[i], true);
                    //     } else {
                    //         showItemInfo(items.list[i - items.weapons.length]);
                    //     }
                    // };
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
                // SMART AUTOUPGRADE:
                if (configs.AutoUpgrade) {
                    if(age == 3) {
                        sendUpgrade(17)
                    } else if (age == 4) {
                        sendUpgrade(31)
                    } else if (age == 5) {
                        sendUpgrade(23)
                    } else if (age == 8) {
                        if(player.secondaryIndex == 9) {
                            sendUpgrade(12)
                        } else if(player.primaryIndex == 3) {
                            sendUpgrade(4)
                        } else {
                            sendUpgrade(28)
                        }
                    } else if (age == 9) {
                        if(player.secondaryIndex == 12) {
                            sendUpgrade(15)
                        } else {
                            sendUpgrade(25)
                        }
                    }// 12  15
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
            function numArr(e = 0, t = 1, act, n = 1) {
                let arr = [];
                for (let i = e; i < t; i += n) {
                    arr.push(i);
                    typeof act == "function" && act(i);
                }
                return arr;
            }
            function toR(e) {
                var n = (e * Math.PI / 180) % (2 * Math.PI);
                return n > Math.PI ? Math.PI - n : n
            }
            function toD(e) {
                var n = (e / Math.PI * 360) % 360;
                return n >= 360 ? n - 360 : n;
            }



    // KILL OBJECT:
    function killObject(sid) {
        let findObj = findObjectBySid(sid);
        objectManager.disableBySid(sid);
        if (player) {
            for (let i = 0; i < breakObjects.length; i++) {
                if (breakObjects[i].sid == sid) {
                    breakObjects.splice(i, 1);
                    break;
                }
            }
            if (!player.canSee(findObj)) {
                breakTrackers.push({
                    x: findObj.x,
                    y: findObj.y
                });
            }
            if (breakTrackers.length > 8) {
                breakTrackers.shift();
            }
            traps.replacer(findObj);
        }
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

    function caf(e, t) {
        try {
            return Math.atan2((t.y2 || t.y) - (e.y2 || e.y), (t.x2 || t.x) - (e.x2 || e.x));
        } catch (e) {
            return 0;
        }
    }

    let found = false;
    let autoQ = false;

    let autos = {
        insta: {
            todo: false,
            wait: false,
            count: 4,
            shame: 5
        },
        bull: false,
        antibull: 0,
        reloaded: false,
        stopspin: true
    }

    // UPDATE PLAYER DATA:
    function updatePlayers(data) {
        // if(player.shameCount > 0) {
        //     my.reSync = true;
        // } else {
        //     my.reSync = false;
        // }

        // let movementPrediction = {
        //     x: player.x2 + (player.oldPos.x2 - player.x2) * -1,
        //     y: player.y2 + (player.oldPos.y2 - player.y2) * -1,
        // }

        //     let potentialzpiketick = liztobj.filter((e) => e.active && e.dmg)

        //     potentialzpiketick.forEach((obj) => {
        //         if(cdf(obj, player) <= 200) {
        //             packet('f', undefined);
        //         }
        //     })

        // let newPos = {
        //     x: player.x2 + (tracker.lastPos.x - player.x2) * -1,
        //     y: player.y2 + (tracker.lastPos.y - player.y2) * -1,
        // }

        function getAngleDifference(angle1, angle2) {
            // Normalize the angles to be between 0 and 2π
            angle1 = angle1 % (2 * Math.PI);
            angle2 = angle2 % (2 * Math.PI);

            // Calculate the absolute difference between the angles
            let diff = Math.abs(angle1 - angle2);

            // Adjust the difference to be between 0 and π
            if (diff > Math.PI) {
                diff = (2 * Math.PI) - diff;
            }

            return diff;
        }

        //     function smartMove(oneTickMove) {
        //         let dir = player.moveDir;

        //         let found = false
        //         let buildings = liztobj.sort((a, b) => Math.hypot(player.y2 - a.y, player.x2 - a.x) - Math.hypot(player.y2 - b.y, player.x2 - b.x))
        //         let spikes = buildings.filter(obj => obj.dmg && cdf(player, obj) < 250 && !obj.isTeamObject(player) && obj.active)

        //         let newPos = {
        //             x: player.x2 + (player.x2 - player.oldPos.x2) * 1.2 + (Math.cos(dir) * 50),
        //             y: player.y2 + (player.y2 - player.oldPos.y2) * 1.2 + (Math.sin(dir) * 50),
        //         }

        //         for (let i = 0; i < spikes.length; i++) {
        //             if (cdf(spikes[i], newPos) < spikes[i].scale + player.scale + 3) {
        //                 found = Math.atan2(player.y2 - spikes[i].y, player.x2 - spikes[i].x)
        //             }
        //         }





        //         if (found != false && !traps.inTrap) {
        //             packet("f", undefined);
        //         } else {
        //             packet("f", dir);
        //         }
        //         player.oldPos.x2 = player.x2;
        //         player.oldPos.y2 = player.y2;
        //     }
        //     function detectEnemySpikeCollisions(tmpObj) {
        //         let buildings = liztobj.sort((a, b) => Math.hypot(tmpObj.y - a.y, tmpObj.x - a.x) - Math.hypot(tmpObj.y - b.y, tmpObj.x - b.x));
        //         let spikes = buildings.filter(obj => obj.dmg && cdf(player, obj) < 200 && !obj.isTeamObject(player) && obj.active);
        //         //here you calculate last vel / delta, add that to current pos, if touch spike do the heh
        //         let enemy = {
        //             // x: tmpObj.x + (player.oldPos.x2 - tmpObj.x) * -2,
        //             // y: tmpObj.y + (player.oldPos.y2 - tmpObj.y) * -2,
        //             x: player.x2 + (player.oldPos.x2 - player.x2) * -1,
        //             y: player.y2 + (player.oldPos.y2 - player.y2) * -1,
        //         }
        //         let found = false;
        //         for (let i = 0; i < spikes.length; i++) {
        //             if (cdf(enemy, spikes[i]) < player.scale + spikes[i].scale) {
        //                 found = true;
        //             }
        //         }

        //         // player.oldPos.x2 = tmpObj.x2;
        //         // player.oldPos.y2 = tmpObj.y2;
        //     }

        game.tick++;
        enemy = [];
        nears = [];
        near = [];
        game.tickSpeed = performance.now() - game.lastTick;
        game.lastTick = performance.now();
        players.forEach((tmp) => {
            tmp.forcePos = !tmp.visible;
            tmp.visible = false;
            if((tmp.timeHealed - tmp.timeDamaged)>0 && tmp.lastshamecount<tmp.shameCount)
                tmp.pinge = (tmp.timeHealed - tmp.timeDamaged);
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

                botSkts.forEach((bot) => {
                    bot.showName = 'YEAHHH'
                })

                for(let i = 0; i < players.length; i++) {
                    for(let aa = 0; aa < botSkts.length; aa++) {
                        if(player.id === aa.id) aa.showName = 'YEAHHHHHH'

                    }
                }

                if (player.shameCount < 4 && near.dist3 <= 300 && near.reloads[near.primaryIndex] <= game.tickRate * (window.pingTime >= 200 ? 2 : 1)) {
                    autoQ = true;
                    healer();
                } else {
                    if (autoQ) {
                        healer();
                    }
                    autoQ = false;
                }


                if (tmpObj == player) {
                    if (liztobj.length) {
                        liztobj.forEach((tmp) => {
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
                        let nearTrap = liztobj.filter(e => e.trap && e.active && UTILS.getDist(e, tmpObj, 0, 2) <= (tmpObj.scale + e.getScale() + 25) && !e.isTeamObject(tmpObj)).sort(function(a, b) {
                            return UTILS.getDist(a, tmpObj, 0, 2) - UTILS.getDist(b, tmpObj, 0, 2);
                        })[0];
                        if (nearTrap) {
                            let spike = gameObjects.filter(obj => obj.dmg && cdf(tmpObj, obj) <= tmpObj.scale + nearTrap.scale/2 && !obj.isTeamObject(tmpObj) && obj.active)[0]
                            traps.dist = UTILS.getDist(nearTrap, tmpObj, 0, 2);
                            traps.aim = UTILS.getDirect(spike ? spike : nearTrap, tmpObj, 0, 2);

                            // traps.dist = UTILS.getDist(nearTrap, tmpObj, 0, 2);
                            // traps.aim = UTILS.getDirect(nearTrap, tmpObj, 0, 2);
                            traps.protect(caf(nearTrap, tmpObj) - Math.PI);
                            traps.inTrap = true;
                            sendChat("Oh no! You got me! :(");
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
                textManager.showText(pos2.x, pos2.y, Math.max(45, Math.min(50, num2)), 0.18, 500, num2, "#FF0000");
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
                            if (window.pingTime < 150) {
                                let sid = updHealth[0];
                                let value = updHealth[1];
                                let totalDamage = 100 - value
                                let damaged = updHealth[2];
                                tmpObj = findPlayerBySID(sid);
                                let bullTicked = false;
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
                                        let includeSpikeDmgs = enemy.length ? !bullTicked && (gearDmgs.includes(damaged) && near.skinIndex == 11) : false;
                                        let healTimeout = 140 - window.pingTime;
                                        let dmg = 100 - player.health;
                                        let slowHeal = function (timer, tickBase) {
                                            if (!tickBase) {
                                                setTimeout(() => {
                                                    healer();
                                                }, timer);
                                            } else {
                                                game.tickBase(() => {
                                                    healer()
                                                }, 3)
                                            }
                                        }
                                        if (getEl("healingBeta").checked) {
                                            if (enemy.length) {
                                                if ([0, 7, 8].includes(near.primaryIndex)) {
                                                    if (damaged < 75) {
                                                        slowHeal(healTimeout)
                                                    } else {
                                                        healer()
                                                    }
                                                }
                                                if ([1, 2, 6].includes(near.primaryIndex)) {
                                                    if (damaged >= 25 && player.damageThreat + dmg >= 95 && tmpObj.shameCount < 5) {
                                                        healer()
                                                    } else {
                                                        slowHeal(healTimeout)
                                                    }
                                                }
                                                if (near.primaryIndex == 3) {
                                                    if (near.secondaryIndex == 15) {
                                                        if (near.primaryVariant < 2) {
                                                            if (damaged >= 35 && player.damageThreat + dmg >= 95 && tmpObj.shameCount < 5 && game.tick - player.antiTimer > 1) {
                                                                tmpObj.canEmpAnti = true
                                                                tmpObj.antiTimer = game.tick
                                                                healer()
                                                            } else {
                                                                slowHeal(healTimeout)
                                                            }
                                                        } else {
                                                            if (damaged > 35 && player.damageThreat + dmg >= 95 && tmpObj.shameCount < 5 && game.tick - player.antiTimer > 1) {
                                                                tmpObj.canEmpAnti = true
                                                                tmpObj.antiTimer = game.tick
                                                                healer()
                                                            } else {
                                                                slowHeal(healTimeout)
                                                            }
                                                        }
                                                    } else {
                                                        if (damaged >= 25 && player.damageThreat + dmg >= 95 && tmpObj.shameCount < 4) {
                                                            healer()
                                                        } else {
                                                            slowHeal(healTimeout)
                                                        }
                                                    }
                                                }
                                                if (near.primaryIndex == 4) {
                                                    if (near.primaryVariant >= 1) {
                                                        if (damaged >= 10 && player.damageThreat + dmg >= 95 && tmpObj.shameCount < 4) {
                                                            healer()
                                                        } else {
                                                            slowHeal(healTimeout)
                                                        }
                                                    } else {
                                                        if (damaged >= 35 && player.damageThreat + dmg >= 95 && tmpObj.shameCount < 3) {
                                                            healer()
                                                        } else {
                                                            slowHeal(healTimeout)
                                                        }
                                                    }
                                                }
                                                if ([undefined, 5].includes(near.primaryIndex)) {
                                                    if (near.secondaryIndex == 10) {
                                                        if (dmg >= (includeSpikeDmgs ? 10 : 20) && tmpObj.damageThreat + dmg >= 80 && tmpObj.shameCount < 6) {
                                                            healer()
                                                        } else {
                                                            slowHeal(healTimeout)
                                                        }
                                                    } else
                                                        if (near.primaryVariant >= 2 || near.primaryVariant == undefined) {
                                                            if (dmg >= (includeSpikeDmgs ? 15 : 20) && tmpObj.damageThreat + dmg >= 50 && tmpObj.shameCount < 6) {
                                                                healer()
                                                            } else {
                                                                slowHeal(healTimeout)
                                                            }
                                                        } else
                                                            if ([undefined || 15].includes(near.secondaryIndex)) {
                                                                if (damaged > (includeSpikeDmgs ? 8 : 20) && player.damageThreat >= 25 && (game.tick - player.antiTimer) > 1) {
                                                                    if (tmpObj.shameCount < 5) {
                                                                        healer()
                                                                    } else {
                                                                        slowHeal(healTimeout)
                                                                    }
                                                                } else {
                                                                    slowHeal(healTimeout)
                                                                }
                                                            } else
                                                                if ([9, 12, 13].includes(near.secondaryIndex)) {
                                                                    if (dmg >= 25 && player.damageThreat + dmg >= 70 && tmpObj.shameCount < 6) {
                                                                        healer()
                                                                    } else {
                                                                        slowHeal(healTimeout)
                                                                    }
                                                                } else {
                                                                    if (damaged > 25 && player.damageThreat + dmg >= 95) {
                                                                        healer()
                                                                    } else {
                                                                        slowHeal(healTimeout)
                                                                    }
                                                                }
                                                }
                                                if (near.primaryIndex == 6) {
                                                    if (near.secondaryIndex == 15) {
                                                        if (damaged >= 25 && tmpObj.damageThreat + dmg >= 95 && tmpObj.shameCount < 4) {
                                                            healer()
                                                        } else {
                                                            slowHeal(healTimeout)
                                                        }
                                                    } else {
                                                        if (damaged >= 70 && tmpObj.shameCount < 4) {
                                                            healer()
                                                        } else {
                                                            slowHeal(healTimeout)
                                                        }
                                                    }
                                                }
                                                if (damaged >= 30 && near.reloads[near.secondaryIndex] == 0 && near.dist2 <= 150 && player.skinIndex == 11 && player.tailIndex == 21) instaC.canCounter = true
                                            } else {
                                                if (damaged >= 70) {
                                                    healer()
                                                } else {
                                                    slowHeal(healTimeout)
                                                }
                                            }
                                        } else {
                                            if (damaged >= (includeSpikeDmgs ? 8 : 25) && dmg + player.damageThreat >= 80 && (game.tick - player.antiTimer) > 1) {
                                                if (tmpObj.reloads[53] == 0 && tmpObj.reloads[tmpObj.weapons[1]] == 0) {
                                                    tmpObj.canEmpAnti = true;
                                                } else {
                                                    player.soldierAnti = true;
                                                }
                                                tmpObj.antiTimer = game.tick;
                                                let shame = [0, 4, 6, 7, 8].includes(near.primaryIndex) ? 2 : 5;
                                                if (tmpObj.shameCount < shame) {
                                                    healer();
                                                } else {
                                                    if (near.primaryIndex == 7 || (player.weapons[0] == 7 && (near.skinIndex == 11 || near.tailIndex == 21))) {
                                                        slowHeal(healTimeout)
                                                    } else {
                                                        slowHeal(healTimeout, 1)
                                                    }
                                                }
                                            } else {
                                                if (near.primaryIndex == 7 || (player.weapons[0] == 7 && (near.skinIndex == 11 || near.tailIndex == 21))) {
                                                    slowHeal(healTimeout)
                                                } else {
                                                    slowHeal(healTimeout, 1)
                                                }
                                            }
                                            if (damaged >= 25 && near.dist2 <= 140 && player.skinIndex == 11 && player.tailIndex == 21) instaC.canCounter = true
                                        }
                                    } else {
                                        if (!tmpObj.setPoisonTick && (tmpObj.damaged == 5 || (tmpObj.latestTail == 13 && tmpObj.damaged == 2))) {
                                            tmpObj.setPoisonTick = true;
                                        }
                                    }
                                }
                            } else {
                                let [sid, value, damaged] = updHealth;
                                let totalDamage = 100 - value;
                                let tmpObj = findPlayerBySID(sid);
                                let bullTicked = false;

                                if (tmpObj == player) {
                                    if (tmpObj.skinIndex == 7 && (damaged == 5 || (tmpObj.latestTail == 13 && damaged == 2))) {
                                        if (my.reSync) {
                                            my.reSync = false;
                                            tmpObj.setBullTick = true;
                                            bullTicked = true;
                                        }
                                    }
                                    if (inGame) {
                                        let attackers = getAttacker(damaged);
                                        let gearDmgs = [0.25, 0.45].map((val) => val * items.weapons[player.weapons[0]].dmg * soldierMult());
                                        let includeSpikeDmgs = enemy.length ? !bullTicked && (gearDmgs.includes(damaged) && near.skinIndex == 11) : false;
                                        let healTimeout = 60;
                                        let dmg = 100 - player.health;
                                        let shameCountThreshold = [2, 5][[0, 4, 6, 7, 8].includes(near.primaryIndex) ? 0 : 1];

                                        let slowHeal = function (timer, tickBase) {
                                            if (!tickBase) setTimeout(() => healer(), timer);
                                            else game.tickBase(() => healer(), 2);
                                        };

                                        if (getEl("healingBeta").checked) {
                                            let canHealFast = [0, 7, 8].includes(near.primaryIndex) ? damaged < 75 :
                                            [1, 2, 6].includes(near.primaryIndex) ? damaged >= 25 && player.damageThreat + dmg >= 95 && tmpObj.shameCount < 5 :
                                            [undefined, 5].includes(near.primaryIndex) ? dmg >= (includeSpikeDmgs ? 15 : 20) && tmpObj.damageThreat + dmg >= 50 && tmpObj.shameCount < 6 :
                                            near.primaryIndex == 3 && near.secondaryIndex == 15 ? damaged >= 35 && player.damageThreat + dmg >= 95 && tmpObj.shameCount < 5 && game.tick - player.antiTimer > 1 :
                                            near.primaryIndex == 4 ? near.primaryVariant >= 1 ? damaged >= 10 && player.damageThreat + dmg >= 95 && tmpObj.shameCount < 4 :
                                            damaged >= 35 && player.damageThreat + dmg >= 95 && tmpObj.shameCount < 3 :
                                            near.primaryIndex == 6 && near.secondaryIndex == 15 ? damaged >= 25 && tmpObj.damageThreat + dmg >= 95 && tmpObj.shameCount < 4 :
                                            damaged >= 25 && player.damageThreat + dmg >= 95;

                                            canHealFast ? healer() : slowHeal(healTimeout);
                                        } else {
                                            let canHealFast = damaged >= (includeSpikeDmgs ? 8 : 25) && dmg + player.damageThreat >= 80 && (game.tick - player.antiTimer) > 1;

                                            if (canHealFast) {
                                                if (tmpObj.reloads[53] == 0 && tmpObj.reloads[tmpObj.weapons[1]] == 0) tmpObj.canEmpAnti = true;
                                                else player.soldierAnti = true;
                                                tmpObj.antiTimer = game.tick;
                                                if (tmpObj.shameCount < shameCountThreshold) healer();
                                                else slowHeal(healTimeout, near.primaryIndex == 7 || (player.weapons[0] == 7 && (near.skinIndex == 11 || near.tailIndex == 21)) ? 0 : 1);
                                            } else {
                                                slowHeal(healTimeout, near.primaryIndex == 7 || (player.weapons[0] == 7 && (near.skinIndex == 11 || near.tailIndex == 21)) ? 0 : 1);
                                            }
                                        }
                                    } else {
                                        if (!tmpObj.setPoisonTick && (tmpObj.damaged == 5 || (tmpObj.latestTail == 13 && tmpObj.damaged == 2))) {
                                            tmpObj.setPoisonTick = true;
                                        }
                                    }
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
                    let prehit = liztobj.filter(tmp => tmp.dmg && tmp.active && tmp.isTeamObject(player) && UTILS.getDist(tmp, near, 0, 3) <= (tmp.scale + near.scale)).sort(function(a, b) {
                        return UTILS.getDist(a, near, 0, 2) - UTILS.getDist(b, near, 0, 2);
                    })[0];
                    if (prehit) {
                        if (near.dist2 <= items.weapons[player.weapons[0]].range + player.scale * 1.8 && configs.predictTick) {
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
                                if (near.dist2 <= items.weapons[5].range + near.scale * 1.8) {
                                    my.anti0Tick = 1;
                                    sendChat("If you can read this, I lived.");
                                    player.chat.count = 2000;
                                }
                            }
                        }
                if ((useWasd ? true : ((player.checkCanInsta(true) >= 100 ? player.checkCanInsta(true) : player.checkCanInsta(false)) >= (player.weapons[1] == 10 ? 95 : 100))) && near.dist2 <= items.weapons[player.weapons[1] == 10 ? player.weapons[1] : player.weapons[0]].range + near.scale * 1.8 && (instaC.wait || (useWasd && Math.floor(Math.random() * 5) == 0)) && !instaC.isTrue && !my.waitHit && player.reloads[player.weapons[0]] == 0 && player.reloads[player.weapons[1]] == 0 && (useWasd ? true : (player.reloads[53] <= (player.weapons[1] == 10 ? 0 : game.tickRate))) && instaC.perfCheck(player, near)) {
                    if (player.checkCanInsta(true) >= 100) {
                        instaC.nobull = useWasd ? false : instaC.canSpikeTick ? false : true;
                    } else {
                        instaC.nobull = false;
                    }
                    instaC.can = true;
                } else {
                    instaC.can = false;
                }
                macro.q && place(0, getAttackDir());
                macro.f && place(4, getSafeDir());
                macro.v && place(2, getSafeDir());
                macro.y && place(1, getSafeDir());
                macro.h && place(player.getItemType(22), getSafeDir());
                macro.n && place(3, getSafeDir());
                if (game.tick % 3 == 0) {
                if (mills.place) {
                    let plcAng = 1.2
                    for (let i = -plcAng; i <= plcAng; i += plcAng) {
                        checkPlace(3, UTILS.getDirect(player.oldPos, player, 2, 2) + i);
                    }
                }
                    } else {
                        if (game.tick % .5 == 0) {
                        if (mills.placeSpawnPads) {
                            for (let i = 0; i < Math.PI * 2; i += Math.PI / 2) {
                                checkPlace(player.getItemType(20), UTILS.getDirect(player.oldPos, player, 2, 2) + i);
                            }
                        }
                    }
                }
                if (instaC.can) {
                    instaC.changeType(configs.alwaysRev ? "rev" : "normal");
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
                            chch(null, "[RevSyncHit]", "yellow");
                        }
                    } else {
                        if ([1, 2, 3, 4, 5, 6].includes(player.weapons[0]) && player.reloads[player.weapons[0]] == 0 && !instaC.isTrue) {
                            instaC.spikeTickType();
                            if (instaC.syncHit) {
                                chch(null, "[SyncHit]", "yellow");
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
                 if (clicked.g && !traps.inTrap) {
                    if (!instaC.isTrue && player.reloads[player.weapons[1]] == 0) {
                        if (my.ageInsta && player.weapons[0] != 4 && player.weapons[1] == 9 && player.age >= 9 && enemy.length) {
                            instaC.bowMovement();
                        } else {
                            instaC.rangeType();
                        }
                    }
                }
                 if (clicked.o && !traps.inTrap) {
                    if (!instaC.isTrue && player.reloads[player.weapons[0]] == 0) {
                        if (my.age1insta && player.weapons[0] == 0 && player.age >= 2 && enemy.length) {
                            instaC.age1insta();
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
                        // if(useWasd) {
                        //     if (!autos.stopspin) {
                        //         setTimeout(()=>{
                        //             autos.stopspin = true;
                        //         }, 375);
                        //     }
                        // }
                    } else {
                        my.reloaded = false;
                        if(useWasd) {
                            autos.stopspin = false;
                        }
                        if (player.reloads[player.weapons[0]] > 0) {
                            if (player.weaponIndex != player.weapons[0] || player.buildIndex > -1) {
                                selectWeapon(player.weapons[0]);
                            }
                        } else if (player.reloads[player.weapons[0]] == 0 && player.reloads[player.weapons[1]] > 0) {
                            if (player.weaponIndex != player.weapons[1] || player.buildIndex > -1) {
                                selectWeapon(player.weapons[1]);
                            }
                            if(useWasd) {
                                if (!autos.stopspin) {
                                    setTimeout(()=>{
                                        autos.stopspin = true;
                                    }, 750);
                                }
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
                            if ((player.shameCount > 0 && (game.tick - player.bullTick) % config.serverUpdateRate === 0 && player.skinIndex != 45) || my.reSync) {
                                buyEquip(7, 0);
                                    buyEquip(13, 1);
                            } else {
                                if (clicks.left) {
                                    buyEquip(player.reloads[player.weapons[0]] == 0 ? getEl("weaponGrind").checked ? 40 : 7 : player.empAnti ? 22 : player.soldierAnti ? 6 : (getEl("antiBullType").value == "abreload" && near.antiBull > 0) ? 11 : near.dist2 <= 450 ? (getEl("antiBullType").value == "abalway" && near.reloads[near.primaryIndex] == 0) ? 11 : 6 : biomeGear(1, 1), 0);
                                } else if (clicks.right) {
                                    buyEquip(player.reloads[clicks.right && player.weapons[1] == 10 ? player.weapons[1] : player.weapons[0]] == 0 ? 40 : player.empAnti ? 22 : player.soldierAnti ? 6 : (getEl("antiBullType").value == "abreload" && near.antiBull > 0) ? 11 : near.dist2 <= 450 ? (getEl("antiBullType").value == "abalway" && near.reloads[near.primaryIndex] == 0) ? 11 : 6 : biomeGear(1, 1), 0);
                                }
                            }
                        } else if (traps.inTrap) {
                            if (traps.info.health <= items.weapons[player.weaponIndex].dmg ? false : (player.reloads[player.weapons[1] == 10 ? player.weapons[1] : player.weapons[0]] == 0)) {
                                buyEquip(40, 0);
                            } else {
                                if ((player.shameCount > 0 && (game.tick - player.bullTick) % config.serverUpdateRate === 0 && player.skinIndex != 45) || my.reSync) {
                                    buyEquip(7, 0);
                                    buyEquip(13, 1);

                                } else {
                                    buyEquip((player.empAnti || near.dist2 > 450 || !enemy.length) ? 22 : 6, 0);
                                }
                            }
                        } else {
                            if (player.empAnti || player.soldierAnti) {
                                buyEquip(player.empAnti ? 22 : 6, 0);
                                buyEquip(13, 1);
                            } else {
                                if ((player.shameCount > 0 && (game.tick - player.bullTick) % config.serverUpdateRate === 0 && player.skinIndex != 45) || my.reSync) {
                                    buyEquip(7, 0);
                                    buyEquip(13, 1);
                                } else {
                                    if (near.dist2 <= 450) {
                                        buyEquip((getEl("antiBullType").value == "abreload" && near.antiBull > 0) ? 11 : (getEl("antiBullType").value == "abalway" && near.reloads[near.primaryIndex] == 0) ? 11 : 6, 0);
                                    } else {
                                        biomeGear(1);
                                    }
                                }
                            }
                        }
                    }
                }
                let accChanger = function () {
                            if (clicks.left) {
                                    buyEquip(19, 1);
                            } else if (clicks.right) {
                                    buyEquip(21, 1);
                            } else if (near.dist2 <= 400 && near.dist2 >= 225 && !traps.inTrap && !clicks.left && !clicks.right) {
                                buyEquip(19, 1);
                            } else if (near.dist2 <= 225 && !traps.inTrap && !clicks.left && !clicks.right) {
                                buyEquip(21, 1);
                                if ((player.shameCount > 0 && player.skinIndex != 45)) {
                                    buyEquip(7, 0);
                                    buyEquip(13, 1);
                                    my.reSync = true;
                                    my.reSync = false;
                                } else {
                                    buyEquip(6, 0);
                                }
                            }else {
                                traps.inTrap ? buyEquip(19, 1) : buyEquip(11, 1);
                            }
                        };
                        if (my.anti0Tick > 0) {
                            buyEquip(6, 0);
                        }
                let wasdGears = function() {
                    if (my.anti0Tick > 0) {
                        buyEquip(12, 0);
                    } else {
                        if (clicks.left || clicks.right) {
                            if (clicks.left) {
                                buyEquip(player.reloads[player.weapons[0]] == 0 ? getEl("weaponGrind").checked ? 40 : 7 : player.empAnti ? 22 : 6, 0);
                            } else if (clicks.right) {
                                buyEquip(player.reloads[clicks.right && player.weapons[1] == 10 ? player.weapons[1] : player.weapons[0]] == 0 ? 40 : player.empAnti ? 22 : 6, 0);
                            }
                        } else if (near.dist2 <= items.weapons[player.weapons[0]].range + near.scale * 1.8 && !traps.inTrap) {
                            buyEquip(player.reloads[player.weapons[0]] == 0 ? 7 : player.empAnti ? 22 : 6, 0);
                        } else if (traps.inTrap) {
                            if (traps.info.health <= items.weapons[player.weaponIndex].dmg ? false : (player.reloads[player.weapons[1] == 10 ? player.weapons[1] : player.weapons[0]] == 0)) {
                                buyEquip(40, 0);
                            } else {
                                if ((player.shameCount > 0 && (game.tick - player.bullTick) % config.serverUpdateRate === 0 && player.skinIndex != 45) || my.reSync) {
                                    buyEquip(7, 0);
                                    buyEquip(19, 1);
                                } else {
                                    buyEquip(player.empAnti ? 22 : 6, 0);
                                }
                            }
                        } else {
                            if (player.empAnti) {
                                buyEquip(22, 0);
                            } else {
                                if ((player.shameCount > 0 && (game.tick - player.bullTick) % config.serverUpdateRate === 0 && player.skinIndex != 45) || my.reSync) {
                                    buyEquip(7, 0);
                                    buyEquip(19, 1);
                                } else {
                                    buyEquip(6, 0);
                                }
                            }
                        }
                    }
                    if (clicks.left || clicks.right) {
                        if (clicks.left) {
                            buyEquip(0, 1);
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
                //packet("f", lastMoveDir, 1);
                if (configs.autoPush && enemy.length && !traps.inTrap && !instaC.ticking) {
                    autoPush();
                } else {
                    if (my.autoPush) {
                        my.autoPush = false;
                        packet("f", lastMoveDir || undefined, 1);
                    }
                }
                if (!my.autoPush && pathFind.active) {
                    Pathfinder();
                }
                if (instaC.ticking) {
                    instaC.ticking = false;
                }
                if (instaC.syncHit) {
                    instaC.syncHit = true;
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
                const getPotentialDamage = (build, user) => {
                    const weapIndex = user.weapons[1] === 10 && !player.reloads[user.weapons[1]] ? 1 : 0;
                    const weap = user.weapons[weapIndex];
                    if (player.reloads[weap]) return 0;
                    const weapon = items.weapons[weap];
                    const inDist = cdf(build, user) <= build.getScale() + weapon.range;
                    return (user.visible && inDist) ? weapon.dmg * (weapon.sDmg || 1) * 3.3 : 0;
                };

                const AutoReplace = () => {
                    const replaceable = [];
                    const playerX = player.x;
                    const playerY = player.y;
                    const gameObjectCount = gameObjects.length;

                    for (let i = 0; i < gameObjectCount; i++) {
                        const build = gameObjects[i];
                        if (build.isItem && build.active && build.health > 0) {
                            const item = items.list[build.id];
                            const posDist = 35 + item.scale + (item.placeOffset || 0);
                            const inDistance = cdf(build, player) <= posDist * 2;
                            if (inDistance) {
                                let canDeal = 0;
                                const playersCount = players.length;
                                for (let j = 0; j < playersCount; j++) {
                                    canDeal += getPotentialDamage(build, players[j]);
                                }
                                if (build.health <= canDeal) {
                                    replaceable.push(build);
                                }
                            }
                        }
                    }

                    const findPlacementAngle = (player, itemId, build) => {
                        if (!build) return null;
                        const MAX_ANGLE = 2 * Math.PI;
                        const ANGLE_STEP = Math.PI / 360;
                        const item = items.list[player.items[itemId]];
                        let buildingAngle = Math.atan2(build.y - player.y, build.x - player.x);
                        let tmpS = player.scale + (item.scale || 1) + (item.placeOffset || 0);

                        for (let offset = 0; offset < MAX_ANGLE; offset += ANGLE_STEP) {
                            let angles = [(buildingAngle + offset) % MAX_ANGLE, (buildingAngle - offset + MAX_ANGLE) % MAX_ANGLE];
                            for (let angle of angles) {
                                return angle;
                            }
                        }
                        return null;
                    };

                    const replace = (() => {
                        let nearTrap = liztobj.filter(tmp => tmp.trap && tmp.active && tmp.isTeamObject(player) && cdf(tmp, player) <= tmp.getScale() + 5);
                        let spike = gameObjects.find(tmp => tmp.dmg && tmp.active && tmp.isTeamObject(player) && cdf(tmp, player) < 87 && !nearTrap.length);
                        const buildId = spike ? 4 : 2;

                        replaceable.forEach(build => {
                            let angle = findPlacementAngle(player, buildId, build);
                            if (angle !== null) {
                                place(buildId, angle);
                                textManager.showText(build.x, build.y, 20, 0.15, 1850, '⭐', '#fff', 2);
                            }
                        });
                    });

                    if (near && near.dist3 <= 360) {
                        replace();
                    }
                    replace;
                }
                }
        }
        if (botSkts.length) {
            botSkts.forEach((bots) => {
                if (true) {
                    bots[0].showName = 'YEAHHH';
                }
            });
        }
    }
    for(var i1 = 0; i1 < liztobj.length; i1++) {
        if (liztobj[i1].active && liztobj[i1].health > 0 && UTILS.getDist(liztobj[i1], player, 0, 2) < 150 && getEl("antipush").checked) { // || liztobj[i1].buildHealth <= items.weapons[nearEnemy.weaponIndex].dmg)

            if(liztobj[i1].name.includes("spike") && liztobj[i1]){
                if(liztobj[i1].owner.sid != player.sid && clicks.left == false && tmpObj.reloads[tmpObj.secondaryIndex] == 0){
                    selectWeapon(player.weapons[1])
                    buyEquip(40, 0);
                    packet("D", UTILS.getDirect(liztobj[i1], player, 0, 2))
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

            // if(player.damageThreat >= 100 && cdf(player, tmpObj) <= 300)
            //     healer();

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
                                sendChat("Kids Annihilated: "+value+"");
                                setTimeout(() => {
                                sendChat("Why aren't you good?");
                                    setTimeout(() => {
                                        sendChat("Mod by IAmDaOne -IADO- :3");
                                }, 2000);
                            }, 2000);
                        }
                    }
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
            // actionBarItem.style.boxShadow = "2px 2px 5px rgba(0, 0, 0, 0.5)";
            document.getElementsByTagName('button').style.boxShadow = "2px 2px 5px rgba(0, 0, 0, 0.5)";

        }

        for (let i = 0; i < items.weapons.length; i++) {
            let actionBarItem = getEl("actionBarItem" + i);
            actionBarItem.style.display = player.weapons[items.weapons[i].type] == items.weapons[i].id ? "inline-block" : "none";
            // Add shadow to the element
            // actionBarItem.style.boxShadow = "2px 2px 5px rgba(0, 0, 0, 0.5)";
            document.getElementsByTagName('button').style.boxShadow = "2px 2px 5px rgba(0, 0, 0, 0.5)";
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
                let chatting = false;
            document.addEventListener("keypress", function(e) {
                 if (e.key == "Enter") {
                     chatting = !chatting
                 }
                 if (e.key == "/" && !chatting) {
                     io.send("6", "Fire");
                     console.log("clicked /");
                 }
                 else if (e.key == "'" && !chatting) {
                     io.send("6", "I'm better than you");
                     console.log("clicked '");
                 }
            });


           // SEND MESSAGE:
            function checkProfanityString(text) {
                var tmpString;
                let alwaysfalse = false;
                if (!alwaysfalse) {
                    for (var i = 0; i < profanityList.length; ++i) {
                        if (text.indexOf(profanityList[i]) > -1) {
                            tmpString = "";
                            for (var y = 0; y < profanityList[i].length; ++y) {
                                tmpString += tmpString.length ? "o" : "M";
                            }
                            var re = new RegExp(profanityList[i],"g");
                            text = text.replace(re, tmpString);
                        }
                    }
                }
                return text;
            }
            function isTeam(tmpObj) {
                return (tmpObj == player || (tmpObj.team && tmpObj.team == player.team));
            }
                    // this.spikeTickType = function() {
                    //     this.isTrue = true;
                    //     my.autoAim = true;
                    //     selectWeapon(player.weapons[0]);
                    //     buyEquip(7, 0);
                    //     buyEquip(21, 1);
                    //     sendAutoGather();
                    //     game.tickBase(() => {
                    //         //if (player.reloads[53] == 0 && getEl("turretCombat").checked) {
                    //         buyEquip(53, 0);
                    //         selectWeapon(player.weapons[0]);
                    //         buyEquip(53, 0);
                    //         //buyEquip(21, 1);
                    //         game.tickBase(() => {
                    //             sendAutoGather();
                    //             this.isTrue = false;
                    //             my.autoAim = false;
                    //             buyEquip(6, 0);
                    //         }, 3);
                    //     }, 1);
                    // };
            // SEND MESSAGE:
            function receiveChat(sid, message) {
                let tmpPlayer = findPlayerBySID(sid);
                let countDown = 0;
                let coolDownForAI = false;
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
                    if (message == "Fire") {
                        instaC.syncTry();
                        io.send("6", "Fire");
                    }
                }
                if (getEl("autochat").checked) {
                    if (message.includes("what mod")) {
                        packet("6", "The best damn mod there is.")
                    }
                    if (message.includes("mod")) {
                        packet("6", "IADO Mod (edited Chimken)")
                    }
                    if (message.includes("bad")) {
                        io.send("6", "you're the bad one, bro");
                    } else if (message.includes("Bad")) {
                        io.send("6", "How can one be as Bad as you?");
                    } else if (message.includes("lag")) {
                        io.send("6", "sounds like a skill issue");
                    } else if (message.includes("Lag")) {
                        io.send("6", "Sounds like a skill issue");
                    } else if (message.includes("chill")) {
                        io.send("6", "Be chill bro. It's all good");
                    } else if (message.includes("Cringe")) {
                        io.send("6", "Why are you so Cringe bro?");
                    } else if (message.includes("cringe")) {
                        io.send("6", "you're so cringe, bro");
                    } else if (message.includes("mad")) {
                        io.send("6", "why so mad? it's just a game");
                    } else if (message.includes("Mad")) {
                        io.send("6", "Calm down bro. It's okay baby.");
                    } else if (message.includes("idiot")) {
                        io.send("6", "the idiot here is you");
                    } else if (message.includes("Idiot")) {
                        io.send("6", "The Idiot here is you");
                    } else if (message.includes("retard")) {
                        io.send("6", "retard? Dont put yourself down");
                    } else if (message.includes("Retard")) {
                        io.send("6", "Retard? Dont put yourself down");
                    } else if (message.includes("ok and?")) {
                        io.send("6", "And you are dog water.");
                    } else if (message.includes("ok and")) {
                        io.send("6", "And you are dog water.");
                    } else if (message.includes("get a life")) {
                        io.send("6", "I'm going to take your life.");
                    } else if (message.includes("cry about it")) {
                        io.send("6", "cry about how dumb you are");
                    } else if (message.includes("fell off")) {
                        io.send("6", "I have never been better.");
                    } else if (message.includes("get good")) {
                        io.send("6", "I'm already the greatest.");
                    } else if (message.includes("stupid")) {
                        io.send("6", "Me stupid? Look at yourself");
                    } else if (message.includes("Stupid")) {
                        io.send("6", "You ain't the sharpest pencil.");
                    } else if (message.includes("homo")) {
                        io.send("6", "It's okay to be gay bro <3");
                    } else if (message.includes("Homo")) {
                        io.send("6", "It's okay to be gay bro <3");
                    } else if (message.includes("noob")) {
                        io.send("6", "only noob here is you");
                    } else if (message.includes("dumb")) {
                        io.send("6", "get smart bro. you're dumb");
                    } else if (message.includes("Dumb")) {
                        io.send("6", "get smart bro. you're dumb");
                    } else if (message.includes("moron")) {
                        io.send("6", "Get a brain, moron");
                    } else if (message.includes("Moron")) {
                        io.send("6", "Get a brain, moron");
                    } else if (message.includes("not fun")) {
                        io.send("6", "What!? It's so fun!");
                    } else if (message.includes("Noob")) {
                        io.send("6", "only Noob here is you");
                    } else if (message.includes("nub")) {
                        io.send("6", "only nub here is you");
                    } else if (message.includes("Nub")) {
                        io.send("6", "only Nub here is you");
                    } else if (message.includes("nob")) {
                        io.send("6", "only nob here is you");
                    } else if (message.includes("Nob")) {
                        io.send("6", "Only nob here is you");
                    } else if (message.includes("nab")) {
                        io.send("6", "only nab here is you");
                    } else if (message.includes("Nab")) {
                        io.send("6", "only Nab here is you");
                    } else if (message.includes("Nigga")) {
                        io.send("6", "Don't say Nigga, Nigga!");
                    } else if (message.includes("Nigger")) {
                        io.send("6", "Don't say Nigger, Nigger!");
                    } else if (message.includes("niggA")) {
                        io.send("6", "Don't say Nigga, Nigga!");
                    } else if (message.includes("nigger")) {
                        io.send("6", "Don't say Nigger, Nigger!?");
                    } else if (message.includes("real")) {
                        io.send("6", "I'm super real :D");
                    } else if (message.includes("loser")) {
                        io.send("6", "L is for loser, which is you");
                    } else if (message.includes("!c!dc")) {
                        io.send("6", "disconnect this retard");
                    } else if (message.includes("gay")) {
                        io.send("6", "it's okay if you're gay, bro");
                    } else if (message.includes("gae")) {
                        io.send("6", "it's okay if you're gae, bro");
                    } else if (message.includes("Gae")) {
                        io.send("6", "it's okay if you're Gae, bro");
                    } else if (message.includes("Gay")) {
                        io.send("6", "it's okay if you're Gay, bro");
                    } else if (message.includes("love u")) {
                        io.send("6", "Love u too <3");
                    } else if (message.includes("love you")) {
                        io.send("6", "Love you too <3");
                    } else if (message.includes("luv you")) {
                        io.send("6", "Luv you too <3");
                    } else if (message.includes("luv u")) {
                        io.send("6", "Luv u too <3");
                    } else if (message.includes("shit")) {
                        io.send("6", "Watch your mouth, shithead!");
                    } else if (message.includes("Shit")) {
                        io.send("6", "Watch your mouth, Shithead!");
                    } else if (message.includes("chimken")) {
                        io.send("6", "Bawk bawk, motherclucker.");
                    } else if (message.includes("Chimken")) {
                        io.send("6", "Cock-a-doddle-doo, Pussy.");
                    } else if (message.includes("chicken")) {
                        io.send("6", "Bawk bawk, motherclucker.");
                    } else if (message.includes("Chicken")) {
                        io.send("6", "Cock-A-Doddle-Doo, Pussy.");
                    } else if (message.includes("hi")) {
                        io.send("6", "hi there! hope you're well :D");
                    } else if (message.includes("ngu")) {
                        io.send("6", "ngu = you're stupid?");
                    } else if (message.includes("Ngu")) {
                        io.send("6", "Ngu = You're Stupid?");
                    } else if (message.includes("NGU")) {
                        io.send("6", "Ngu = YOU'RE STUPID!?");
                    } else if (message.includes("hehe")) {
                        io.send("6", "hehe x3 so kawaii");
                    } else if (message.includes("haha")) {
                        io.send("6", "Haha so funny bro");
                    } else if (message.includes("huhu")) {
                        io.send("6", "what the hell does that mean");
                    } else if (message.includes("ez")) {
                        io.send("6", "get good ez noob");
                    } else if (message.includes("Ez")) {
                        io.send("6", "Why are you so ez?");
                    } else if (message.includes("easy")) {
                        io.send("6", "you're just so easy");
                    } else if (message.includes("Easy")) {
                        io.send("6", "Why are you so Easy?");
                    } else if (message.includes("nigger")) {
                        io.send("6", "Don't say nigger, nigger!");
                    } else if (message.includes("nigga")) {
                        io.send("6", "Don't say nigga, nigga!");
                    } else if (message.includes("gg")) {
                        io.send("6", "gg bro. Well played");
                    } else if (message.includes("Gg")) {
                        io.send("6", "Gg bro. Well played.");
                    } else if (message.includes("GG")) {
                        io.send("6", "GG bro. Well played.");
                    } else if (message.includes("lol")) {
                        io.send("6", "laugh out loud");
                    } else if (message.includes("Lol")) {
                        io.send("6", "Laugh out loud more");
                    } else if (message.includes("lmao")) {
                        io.send("6", "laughing my ass off haha");
                    } else if (message.includes("Lmao")) {
                        io.send("6", "Laughing My Ass Off HaHa");
                    } else if (message.includes("lvl")) {
                        io.send("6", "Why? Do you wish to lose?");
                    } else if (message.includes("1v1")) {
                        io.send("6", "Why? That's literally suicide.");
                    } else if (message.includes("hello")) {
                        io.send("6", "Hello there, sir or madam.");
                    } else if (message.includes("idk")) {
                        io.send("6", "Why don't you know? :/");
                    } else if (message.includes("Idk")) {
                        io.send("6", "Why don't you know? :/");
                    } else if (message.includes("IDK")) {
                        io.send("6", "WHY DON'T YOU KNOW!? :/");
                    } else if (message.includes("xd")) {
                        io.send("6", "XD");
                    } else if (message.includes("Xd")) {
                        io.send("6", "Ex Dee");
                    } else if (message.includes("xD")) {
                        io.send("6", "Haha XD");
                    } else if (message.includes("XD")) {
                        io.send("6", "Ex Dee XD");
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
                    } else if (message.includes(":)")) {
                        io.send("6", ":) So happy!");
                    } else if (message.includes("-_-")) {
                        io.send("6", "-u- hehe");
                    } else if (message.includes("sb")) {
                        io.send("6", "sb is slang for sandbox");
                    } else if (message.includes("AutoGG")) {
                        io.send("6", "Free kill loser");
                    } else if (message.includes("Master Race")) {
                        io.send("6", "GG! EZ! Master at sucking!");
                    } else if (message.includes("autoclicker")) {
                        io.send("6", "autoclicker is so Good");
                    } else if (message.includes("auto clicker")) {
                        io.send("6", "autoclicker means I'm pro");
                    } else if (message.includes("trash")) {
                        io.send("6", "I know you're trash, bro.");
                    } else if (message.includes("Trash")) {
                        io.send("6", "I know you're Trash, bro.");
                    } else if (message.includes("suck")) {
                        io.send("6", "Suck? You're sucking on me? Ew");
                    } else if (message.includes("fatherless")) {
                        io.send("6", "Yes, you are fatherless.");
                    } else if (message.includes("Fatherless")) {
                        io.send("6", "No father? Damn bro.");
                    } else if (message.includes("motherless")) {
                        io.send("6", "Yes, you are motherless.");
                    } else if (message.includes("Motherless")) {
                        io.send("6", "No mother? Damn bro.");
                    } else if (message.includes("hacker")) {
                        io.send("6", "No! I am 100% a real pro!");
                    } else if (message.includes("Hacker")) {
                        io.send("6", "No! I am 100% a real pro!");
                    } else if (message.includes("hakers")) {
                        io.send("6", "hakers are such noobs!");
                    } else if (message.includes("hax")) {
                        io.send("6", "Where? I see no hax.. :)");
                    } else if (message.includes("I don't know")) {
                        io.send("6", "Then learn how to know, idiot");
                    } else if (message.includes("I dont know")) {
                        io.send("6", "Then learn how to know, idiot");
                    } else if (message.includes("issue")) {
                        io.send("6", "You have a skill issue, bud");
                    } else if (message.includes("kys")) {
                        io.send("6", "I know you should! :3");
                    } else if (message.includes("killyourself")) {
                        io.send("6", "I know you should! :3");
                    } else if (message.includes("kill yourself")) {
                        io.send("6", "I know you should! :3");
                    } else if (message.includes("hate")) {
                        io.send("6", "I hate you too >:(");
                    } else if (message.includes("hacks")) {
                        io.send("6", "Hacks are for noobs!");
                    } else if (message.includes("hack")) {
                        io.send("6", "No hacks! All pro! :D");
                    } else if (message.includes("pro")) {
                        io.send("6", "Pro? That's me! 100% skill");
                    } else if (message.includes("skill")) {
                        io.send("6", "You have a skill issue, bud");
                    } else if (message.includes(":/")) {
                        io.send("6", "What? :/");
                    } else if (message.includes("erm")) {
                        io.send("6", "What the sigma?");
                    } else if (message.includes("sigma")) {
                        io.send("6", "Is that better than alpha? Idk");
                    } else if (message.includes("Sigma")) {
                        io.send("6", "The highest form of human");
                    } else if (message.includes("disconnect")) {
                        io.send("6", "Disconnect? Skill issue");
                    } else if (message.includes("Goodbye")) {
                        io.send("6", "Goodbye. Have a good day.");
                    } else if (message.includes("goodbye")) {
                        io.send("6", "Goodbye. Have a good day.");
                    } else if (message.includes("bye")) {
                        io.send("6", "Goodbye. Have a good day.");
                    } else if (message.includes("Bye")) {
                        io.send("6", "Goodbye. Have a good day.");
                    } else if (message.includes("rip")) {
                        io.send("6", "Rest in piece. :(");
                    } else if (message.includes("idc")) {
                        io.send("6", "I dont care that you dont care");
                    } else if (message.includes("Idc")) {
                        io.send("6", "I Dont Care That You Dont Care");
                    } else if (message.includes("IDC")) {
                        io.send("6", "I DONT CARE THAT YOU DONT CARE");
                    } else if (message.includes("Moomoo")) {
                        io.send("6", "Greatest .io game of all time.");
                    } else if (message.includes("chad")) {
                        io.send("6", "chad? That's who I am!");
                    } else if (message.includes("legit")) {
                        io.send("6", "Me? Legit? Duh! Cant you tell?");
                    } else if (message.includes("moomoo")) {
                        io.send("6", "Greatest .io game of all time.");
                    } else if (message.includes("cool")) {
                        io.send("6", "I know I'm cool. Thanks!");
                    } else if (message.includes("girl")) {
                        io.send("6", "Ew! Girls have cooties!");
                    } else if (message.includes("mom")) {
                        io.send("6", "Your mom does not love you");
                    } else if (message.includes("dad")) {
                        io.send("6", "Your dad left :(");
                    } else if (message.includes(":3")) {
                        io.send("6", ":3 hehe uwu");
                    } else if (message.includes("ass")) {
                        io.send("6", "You are actually so ass");
                    } else if (message.includes("Ass")) {
                        io.send("6", "You are actually so Ass");
                    } else if (message.includes("dog water")) {
                        io.send("6", "You're dog water, kid.");
                    } else if (message.includes("goat")) {
                        io.send("6", "I'm the Greatest of All Time.");
                    } else if (message.includes("Goat")) {
                        io.send("6", "I'm the Greatest of All Time.");
                    } else if (message.includes("broke")) {
                        io.send("6", "I know you're broke");
                    } else if (message.includes("ok")) {
                        io.send("6", "ok bro.. :p");
                    } else if (message.includes("Okay")) {
                        io.send("6", "Okay retard");
                    } else if (message.includes("peace")) {
                        io.send("6", "peace?... Hmm...");
                    } else if (message.includes("Peace")) {
                        io.send("6", "Peace?... Hmm...");
                    } else if (message.includes("ong")) {
                        io.send("6", "ON GOD, GANG!");
                    } else if (message.includes("Ong")) {
                        io.send("6", "ON GOD, GANG!");
                    } else if (message.includes("team")) {
                        io.send("6", "team?... Hmm...");
                    } else if (message.includes("Team")) {
                        io.send("6", "Team?... Hmm...");
                    } else if (message.includes("OK")) {
                        io.send("6", "OK BUDDY");
                    } else if (message.includes("Ok")) {
                        io.send("6", "Ok bucko");
                    } else if (message.includes("nice")) {
                        io.send("6", "Be nice! Be kind! :3");
                    } else if (message.includes("spam")) {
                        io.send("6", "Cryin about spam? Just get gud");
                    } else if (message.includes("Spam")) {
                        io.send("6", "Imagine crying about spam LOL");
                    } else if (message.includes("help")) {
                        io.send("6", "You're gonna need help, bud.");
                    } else if (message.includes("cute")) {
                        io.send("6", ":3 hehe you're such a cutie!");
                    } else if (message.includes("lame")) {
                        io.send("6", "You're a certified lame-o");
                    } else if (message.includes(":)")) {
                        io.send("6", ":D :3 :P :} :] X3");
                    } else if (message.includes("Hi")) {
                        io.send("6", "Hi there! How's it going?:D");
                    } else if (message.includes("mother")) {
                        io.send("6", "Your mother doesn't love you");
                    } else if (message.includes("Mother")) {
                        io.send("6", "Your Mother doesn't love you");
                    } else if (message.includes("father")) {
                        io.send("6", "Your father doesn't love you");
                    } else if (message.includes("Father")) {
                        io.send("6", "Your Father doesn't love you");
                    } else if (message.includes("lmfao")) {
                        io.send("6", "laughing my Fucking ass off");
                    } else if (message.includes("Lmfao")) {
                        io.send("6", "Laughing My Fucking Ass Off");
                    } else if (message.includes("LMFAO")) {
                        io.send("6", "LAUGHING MY FUCKING ASS OFF");
                    } else if (message.includes("LMAO")) {
                        io.send("6", "LAUGHING MY ASS OFF HAHAHA");
                    } else if (message.includes("ily")) {
                        io.send("6", ":O Omg! I love you too!");
                    } else if (message.includes("hola")) {
                        io.send("6", "Hola, mi amigo! Como estas?");
                    } else if (message.includes("adios")) {
                        io.send("6", "Hasta luego, mi amigo!");
                    } else if (message.includes("Hola")) {
                        io.send("6", "Hola, mi amigo! Como estas?");
                    } else if (message.includes("Adios")) {
                        io.send("6", "Hasta luego, mi amigo!");
                    } else if (message.includes("toxic")) {
                        io.send("6", "why so toxic, bro?");
                    } else if (message.includes("Toxic")) {
                        io.send("6", "It's just a game bro. Relax");
                    } else if (message.includes("TOXIC")) {
                        io.send("6", "STOP BEING TOXIC >:(");
                    } else if (message.includes("Erm")) {
                        io.send("6", "What the sigma?");
                    } else if (message.includes("welcome")) {
                        io.send("6", "Thanks a bunch!");
                    } else if (message.includes("auto")) {
                        io.send("6", "I am a robot. Beep boop");
                    } else if (message.includes("wild")) {
                        io.send("6", "actually crazy fr");
                    } else if (message.includes("crazy")) {
                        io.send("6", "actually wild fr");
                    } else if (message.includes("wompwomp")) {
                        io.send("6", "womp womp. get good");
                    } else if (message.includes("womp")) {
                        io.send("6", "womp womp, dumb nigga");
                    } else if (message.includes("Womp")) {
                        io.send("6", "womp womp, dumb Nigga");
                    } else if (message.includes("Hm")) {
                        io.send("6", "Hmm.. i'm thinking");
                    } else if (message.includes("hm")) {
                        io.send("6", "hmm.. i'm thinking");
                    } else if (message.includes("ERM")) {
                        io.send("6", "WHAT THE SIGMA?!");
                    } else if (message.includes("happy")) {
                        io.send("6", "I'm so happy! :D");
                    } else if (message.includes("cheater")) {
                        io.send("6", "Your mom is the cheater, bud.");
                    } else if (message.includes("cheat")) {
                        io.send("6", "Me? Cheat?! Never!!");
                    } else if (message.includes("skibidi")) {
                        io.send("6", "please shut the Fuck up");
                    } else if (message.includes("Skibidi")) {
                        io.send("6", "Brain rot is an actual cancer");
                    } else if (message.includes("ligma")) {
                        io.send("6", "ligma balls bro");
                    } else if (message.includes("Ligma")) {
                        io.send("6", "Didn't Ninja die from this?");
                    } else if (message.includes("joe")) {
                        io.send("6", "joe mama :p");
                    } else if (message.includes("Joe")) {
                        io.send("6", "Aint that the name of yo mama?");
                    } else if (message.includes("ty")) {
                        io.send("6", "You're welcome! :D");
                    } else if (message.includes("Ty")) {
                        io.send("6", "You're very welcome! :D");
                    } else if (message.includes("TY")) {
                        io.send("6", "You're very welcome! :D");
                    } else if (message.includes("sugma")) {
                        io.send("6", "sugma balls bro");
                    } else if (message.includes("Sugma")) {
                        io.send("6", "Heard you had a bad case of this");
                    } else if (message.includes("bruh")) {
                        io.send("6", "Absolute bruh moment");
                    } else if (message.includes("Bruh")) {
                        io.send("6", "Absolute Bruh moment");
                    } else if (message.includes("Pew")) {
                        io.send("6", "Imagine saying Pew retard LMAO");
                    } else if (message.includes("pew")) {
                        io.send("6", "Only losers say pew, bro.");
                    } else if (message.includes("smd")) {
                        io.send("6", "suck my dick, nigga");
                    } else if (message.includes("Smd")) {
                        io.send("6", "Suck my Dick, Nigga");
                    } else if (message.includes("SMD")) {
                        io.send("6", "SUCK MY DICK, NIGGA");
                    } else if (message.includes("bot")) {
                        io.send("6", "You're actually such a bot");
                    } else if (message.includes("Bot")) {
                        io.send("6", "Beep boop, ya Bot");
                    } else if (message.includes("Fag")) {
                        io.send("6", "It's okay if you're a Fag <3");
                    } else if (message.includes("fag")) {
                        io.send("6", "It's okay if you're a fag <3");
                    } else if (message.includes("afk")) {
                        io.send("6", "away from keyboard");
                    } else if (message.includes("Afk")) {
                        io.send("6", "Away from keyboard");
                    } else if (message.includes("AFK")) {
                        io.send("6", "Away From Keyboard");
                    } else if (message.includes("ngl")) {
                        io.send("6", "You're not gonna lie?");
                    } else if (message.includes("nga")) {
                        io.send("6", "Pretty sure you meant Nigga");
                    } else if (message.includes("Nga")) {
                        io.send("6", "Don't you mean Nigga?");
                    } else if (message.includes("Fuck")) {
                        io.send("6", "bro that's a bad word!");
                    } else if (message.includes("fuck")) {
                        io.send("6", "Don't say fuck, dumb fuck!");
                    } else if (message.includes("pussy")) {
                        io.send("6", "You are what you eat.");
                    } else if (message.includes("Pussy")) {
                        io.send("6", "You are what you eat.");
                    } else if (message.includes("iado")) {
                        io.send("6", "I am not IADO.");
                    } else if (message.includes("Iado")) {
                        io.send("6", "I am not IADO.");
                    } else if (message.includes("IADO")) {
                        io.send("6", "I am not IADO.");
                    } else if (message.includes("bitch")) {
                        io.send("6", "Don't be such a bitch, bruh");
                    } else if (message.includes("Bitch")) {
                        io.send("6", "I'm a female dog? Huh?");
                    } else if (message.includes("smh")) {
                        io.send("6", "shake my head.");
                    } else if (message.includes("Smh")) {
                        io.send("6", "Shake My Head!");
                    } else if (message.includes("SMH")) {
                        io.send("6", "SHAKE MY HEAD!?!?!");
                    } else if (message.includes("annoy")) {
                        io.send("6", "You annoy me, peasant.");
                    } else if (message.includes("Annoy")) {
                        io.send("6", "I'm going to annoy you.");
                    } else if (message.includes("<3")) {
                        io.send("6", ":O Omg! I <3 you too! :3");
                    }
                }
            }
    // MINIMAP:
    function updateMinimap(data) {
        minimapData = data;
    }

    // SHOW ANIM TEXT:
    function showText(x, y, value, type) {
        // if (config.anotherVisual) {
        textManager.stack.push({
            x: x,
            y: y,
            value: value
        });
        // } else {
        //     textManager.showText(x, y, 50, 0.18, useWasd ? 500 : 1500, Math.abs(value), (value >= 0) ? "#fff" : "#8ecc51");
        // }
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
        this.millPlace = true;
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
            this.isBot = false;
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
            this.timeZinceZpawn = 0;
            this.whyDie = "";
            this.clearRadius = false;
            this.circlee = 0;
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
                            this.lastshamecount = this.shameCount;
                            this.shameCount++;
                        } else {
                            this.lastshamecount = this.shameCount;
                            this.shameCount = Math.max(0, this.shameCount - 2);
                        }
                    }
                } else if (this.oldHealth > this.health) {
                    this.hitTime = this.tick;
                }
            };

            // CHECK TEAM
            this.isTeam = function (tmpObj) {
                return (this == tmpObj || (this.team && this.team == tmpObj.team));

            };
            // UPDATE WEAPON RELOAD:
            this.manageReloadaa = function() {
                if (this.shooting[53]) {
                    this.shooting[53] = 0;
                    this.reloads[53] = (2500 - 1000/9);
                } else {
                    if (this.reloads[53] > 0) {
                        this.reloads[53] = Math.max(0, this.reloads[53] - 1000/9);
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
                        }
                    }
                }
            };

            this.closeSockets = function(websc) {
                websc.close();
            };

            this.whyDieChat = function(websc, whydie) {
                websc.sendWS("6", whydie + " Get Raped LoLoLoL");
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
let botz = [];
function botSpawn(id) {
    let bot;
    console.log(WS);
    let t = WS.url.split("wss://")[1].split("?")[0];
    bot = id && new WebSocket("wss://" + t + "?token=re:" + encodeURIComponent(id));
    let botPlayer = new Map();
    botSkts.push([botPlayer]);
    botz.push([bot]);
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
    let izauto = 0;
    let botObjManager = new BotObjManager(botObj, function(sid) { return findSID(botObj, sid); });
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
            name: "get bagged",
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
            if (botPlayer.itemCounts[item.group.id] == undefined ? true : botPlayer.itemCounts[item.group.id] < (config.isSandbox ? 296 : item.group.limit ? item.group.limit : 296)) {
                bot.sendWS("G", botPlayer.items[id]);
                bot.sendWS("d", 1, a);
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
                    if (/*botPlayer.skinIndex != id*/true) {
                        bot.sendWS("c", 0, id, 0);
                    }
                } else {
                    let find = findID(hats, id);
                    if (find) {
                        if (botPlayer.points >= find.price) {
                            bot.sendWS("c", 1, id, 0);
                            bot.sendWS("c", 0, id, 0);
                        } else {
                            if (/*botPlayer.latestSkin != nID*/true) {
                                bot.sendWS("c", 0, nID, 0);
                            }
                        }
                    } else {
                        if (/*botPlayer.latestSkin != nID*/true) {
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
            if (botPlayer.y2 <= config.snowBiomeTop) {
                bot.buye(15, 0);
            } else {
                bot.buye(12, 0);
            }
        }
    };
    bot.selectWeapon = function(a) {
        packet("z", a, 1);
    }
    function caf(e, t) {
        try {
            return Math.atan2((t.y2 || t.y) - (e.y2 || e.y), (t.x2 || t.x) - (e.x2 || e.x));
        } catch (e) {
            return 0;
        }
    }
    bot.heal = function() {
        if (botPlayer.health < 100) {
            bot.place(0, 0)
        }
    }
    function cdf (e, t){
        try {
            return Math.hypot((t.y2||t.y)-(e.y2||e.y), (t.x2||t.x)-(e.x2||e.x));
        } catch(e){
            return Infinity;
        }
    }
    let zoon = 'no';
    bot.zync = function(a) {
        if (!botPlayer.millPlace) {
            zoon = 'yeah';
            bot.place(5, caf(botPlayer, a));
            let NextTickLocation = {
                x: botPlayer.x + Math.cos(caf(a, botPlayer) - Math.PI) * 80,
                y: botPlayer.y + Math.sin(caf(a, botPlayer) - Math.PI) * 80,
                x2: botPlayer.x + Math.cos(caf(a, botPlayer) - Math.PI) * 80,
                y2: botPlayer.y + Math.sin(caf(a, botPlayer) - Math.PI) * 80,
            };
            function calculateDistance(x1, y1, x2, y2) {
                let distance = Math.sqrt(Math.pow((x2 - x1), 2) + Math.pow((y2 - y1), 2));
                return distance;
            }
            function dotherezt() {
                    bot.sendWS("D", caf(a, botPlayer) - Math.PI);
            }
            let turretSpeed = UTILS.getDistance(near.x, near.y, botPlayer.x2, botPlayer.y2) / 1.5, musketSpeed = (UTILS.getDistance(near.x, near.y, botPlayer.x2, botPlayer.y2) - 35) / 3.6;
            bot.buye(53, 0);
            let aa = setInterval(()=>{
                dotherezt();
            },100)
            setTimeout(()=>{
            bot.sendWS("G", botPlayer.weapons[1], true);
            if (izauto == 0) {
                bot.sendWS("K", 1);
                izauto = 1;
            }
            setTimeout(() => {
                bot.sendWS("G", botPlayer.weapons[0], true);
                clearInterval(aa)
            }, 1000);
            setTimeout(() => {
                zoon = 'no';
            }, 500);
            },turretSpeed-(musketSpeed*2))
            bot.buye(53, 0);
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
        if (type == "1") {
            botSID = data[0];
            console.log(botSID)
            setInterval(()=>{
                bot.fastGear();
            },60000)
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
                botPlayer.oldHealth = 100;
                botPlayer.health = 100;
                botPlayer.showName = 'YEAHHH';
                oldXY = {
                    x: data[0][3],
                    y: data[0][4]
                }
                bD.inGame = true;
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
        if (type == "f") {
            let tmpData = data[0];
            botPlayer.tick++;
            botPlayer.enemy = [];
            botPlayer.near = [];
            bot.showName = 'YEAHHH';
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
            for (let i = 0; i < tmpData.length;) {
                tmpObj = findPlayerBySID(tmpData[i]);
                if (tmpObj) {
                    if (!tmpObj.isTeam(botPlayer)) {
                        enemy.push(tmpObj);
                        if (tmpObj.dist2 <= items.weapons[tmpObj.primaryIndex == undefined ? 5 : tmpObj.primaryIndex].range + (botPlayer.scale * 2)) {
                            nears.push(tmpObj);
                        }
                    }
                }
                i += 13;
            }
            if (enemy.length) {
                //console.log(enemy)
                botPlayer.near = enemy.sort(function(tmp1, tmp2) {
                    return tmp1.dist2 - tmp2.dist2;
                })[0];
            }
            if (izauto == 1) {
                bot.sendWS("K", 1);
                izauto = 0;
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
                        bot.sendWS("b", player.team);
                        setTimeout(()=>{bot.push(botPlayer.sid)},2000)
                    }
                }
                let item = items.list[botPlayer.items[3]];
                let a = botPlayer.itemCounts[item.group.id]
                if ((a != undefined ? a : 0) < 201 && botPlayer.millPlace) {
                    if (botPlayer.inGame) {
                        bot.sendWS("D", botPlayer.moveDir);
                        if (izauto == 0) {
                            bot.sendWS("K", 1);
                            izauto = 1;
                        }
                        if (UTILS.getDist(oldXY, botPlayer, 0, 2) > 200) {
                            let aim = UTILS.getDirect(oldXY, botPlayer, 0, 2);
                            bot.place(3, aim + 7.7);
                            bot.place(3, aim - 7.7);
                            bot.place(3, aim);
                            oldXY = {
                                x: botPlayer.x2,
                                y: botPlayer.y2
                            };
                        }
                        if (botPlayer.tick % 90 === 0) {
                            let rand = Math.random() * Math.PI * 2;
                            botPlayer.moveDir = rand;
                            bot.sendWS("a", botPlayer.moveDir);
                        }
                    }
                    bot.fastGear();
                } else if((a != undefined ? a : 0) > 198 && botPlayer.millPlace) {
                    botPlayer.millPlace = false;
                    if (izauto == 0) {
                        bot.sendWS("K", 1);
                        izauto = 1;
                    }
                    bot.buye(11, 1);
                    bot.fastGear();
                } else {
                    if (botPlayer.inGame) {
                        if (botObj.length > 0) {
                            let buldingtoawdoin = botObj.filter((e) => e.active && e.isItem && UTILS.getDist(e, player, 0, 2) <= (600));
                            if (getEl("mode").value == 'fuckemup') {
                                // if (getEl("mode").value == "clear") {
                                bot.selectWeapon(botPlayer.weapons[1]);
                                let gotoDist = UTILS.getDist(buldingtoawdoin[0], botPlayer, 0, 2);
                                let gotoAim = UTILS.getDirect(buldingtoawdoin[0], botPlayer, 0, 2);
                                nearObj = botObj.filter((e) => e.active && (findSID(buldingtoawdoin, e.sid) ? true : !(e.trap && (player.sid == e.owner.sid || player.findAllianceBySid(e.owner.sid)))) && e.isItem && UTILS.getDist(e, botPlayer, 0, 2) <= (items.weapons[botPlayer.weaponIndex].range + e.scale/2)).sort(function(a, b) {
                                    return UTILS.getDist(a, botPlayer, 0, 2) - UTILS.getDist(b, botPlayer, 0, 2);
                                })[0];
                                if (nearObj) {
                                    let isPassed = UTILS.getDist(buldingtoawdoin[0], nearObj, 0, 0);
                                    if ((gotoDist - isPassed) > 0) {
                                        if (findSID(buldingtoawdoin, nearObj.sid) ? true : (nearObj.dmg || nearObj.trap)) {
                                            if (botPlayer.moveDir != undefined) {
                                                botPlayer.moveDir = undefined;
                                                bot.sendWS("f", botPlayer.moveDir);
                                                bot.sendWS("D", botPlayer.nDir);
                                            }
                                        } else {
                                            botPlayer.moveDir = gotoAim;
                                            bot.sendWS("f", botPlayer.moveDir);
                                            bot.sendWS("D", botPlayer.nDir);
                                        }
                                        if (botPlayer.nDir != UTILS.getDirect(nearObj, botPlayer, 0, 2)) {
                                            botPlayer.nDir = UTILS.getDirect(nearObj, botPlayer, 0, 2);
                                            bot.sendWS("D", botPlayer.nDir);
                                        }
                                        if (izauto == 0) {
                                            bot.sendWS("K", 1);
                                            izauto = 1;
                                        }
                                        bot.buye(40, 0);
                                    } else {
                                        botPlayer.moveDir = gotoAim;
                                        bot.sendWS("a", botPlayer.moveDir);
                                        bot.sendWS("D", botPlayer.nDir);
                                        bot.fastGear();
                                    }
                                } else {
                                    botPlayer.moveDir = gotoAim;
                                    bot.sendWS("a", botPlayer.moveDir);
                                    bot.sendWS("D", botPlayer.nDir);
                                    bot.fastGear();
                                }
                            }
                        }
                        if (botObj.length > 0) {
                            if (getEl("mode").value == 'flex') {
                                const circleRadius = 300;
                                const circleCenterX = player.x2;
                                const circleCenterY = player.y2;
                                let angle = Math.atan2(botPlayer.y2 - circleCenterY, botPlayer.x2 - circleCenterX);
                                angle -= 0.1;
                                const x = circleCenterX + circleRadius * Math.cos(angle);
                                const y = circleCenterY + circleRadius * Math.sin(angle);
                                bot.sendWS("a", Math.atan2(y - botPlayer.y2, x - botPlayer.x2));
                            }

                        }

                        if (botObj.length > 0) {
                            if (getEl("mode").value == 'mouse') {
                                bot.sendWS("a", Math.atan2((player.y2 - botPlayer.y2) + mouseY - (gameCanvas.height / 1.5), (player.x2- botPlayer.x2) + mouseX - (gameCanvas.width / 1.5)));
                            }

                        }

                        if (botObj.length > 0) {
                            nearObj = botObj.filter((e) => e.active && e.isItem && UTILS.getDist(e, botPlayer, 0, 2) <= (items.weapons[botPlayer.weaponIndex].range)).sort(function(a, b) {
                                return UTILS.getDist(a, botPlayer, 0, 2) - UTILS.getDist(b, botPlayer, 0, 2);
                            })[0];
                            if (nearObj&&((getEl("mode").value == 'fight'?(nearObj.isTeamObject(player)?false:true):true))) {//herenigga
                                if (izauto == 0) {
                                    bot.sendWS("K", 1);
                                    izauto = 1;
                                }
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
                            bot.buye(11, 1);
                            if (breakObjects.length > 0 && getEl("mode").value == 'clear') {
                                bot.selectWeapon(botPlayer.weapons[1]);
                                let gotoDist = UTILS.getDist(breakObjects[0], botPlayer, 0, 2);
                                let gotoAim = UTILS.getDirect(breakObjects[0], botPlayer, 0, 2);
                                nearObj = botObj.filter((e) => e.active && (findSID(breakObjects, e.sid) ? true : !(e.trap && (player.sid == e.owner.sid || player.findAllianceBySid(e.owner.sid)))) && e.isItem && UTILS.getDist(e, botPlayer, 0, 2) <= (items.weapons[botPlayer.weaponIndex].range + e.scale)).sort(function(a, b) {
                                    return UTILS.getDist(a, botPlayer, 0, 2) - UTILS.getDist(b, botPlayer, 0, 2);
                                })[0];
                                if (nearObj) {
                                    let isPassed = UTILS.getDist(breakObjects[0], nearObj, 0, 0);
                                    if ((gotoDist - isPassed) > 0) {
                                        if (findSID(breakObjects, nearObj.sid) ? true : (nearObj.dmg || nearObj.trap)) {
                                            // botPlayer.moveDir = undefined;
                                            bot.sendWS("a", caf);
                                            bot.sendWS("D", botPlayer.nDir);
                                        } else {
                                            // botPlayer.moveDir = gotoAim;
                                            // bot.sendWS("a", botPlayer.moveDir);
                                            bot.sendWS("D", botPlayer.nDir);
                                        }
                                        if (botPlayer.nDir != UTILS.getDirect(nearObj, botPlayer, 0, 2)) {
                                            botPlayer.nDir = UTILS.getDirect(nearObj, botPlayer, 0, 2);
                                            bot.sendWS("D", botPlayer.nDir);
                                        }
                                        if (izauto == 0) {
                                            bot.sendWS("K", 1);
                                            izauto = 1;
                                        }
                                        bot.buye(40, 0);
                                        // bot.fastGear();
                                        bot.buye(11, 1);
                                    } else {
                                        botPlayer.moveDir = gotoAim;
                                        bot.sendWS("a", botPlayer.moveDir);
                                        bot.sendWS("D", botPlayer.nDir);
                                        bot.fastGear();
                                        bot.buye(11, 1);
                                    }
                                } else {
                                    botPlayer.moveDir = gotoAim;
                                    bot.sendWS("a", botPlayer.moveDir);
                                    bot.sendWS("D", botPlayer.nDir);
                                    bot.fastGear();
                                    bot.buye(11, 1);
                                }
                            }
                        }
                        if (botObj.length > 0 && getEl("mode").value == 'stopp') {
                            if (cdf(window.stopSpot, botPlayer) <= 220) {
                                    bot.sendWS("a", undefined);
                                    bot.fastGear();
                                } else {
                                    bot.sendWS("a", caf(window.stopSpot, botPlayer) + Math.PI);
                                }
                        }
                        if (botObj.length > 0 && getEl("mode").value == 'fight') {
                           if(near.sid) {
    const circleRadius = 100;
    const circleCenterX = near.x;
    const circleCenterY = near.y;
    let angle = Math.atan2(botPlayer.y2 - circleCenterY, botPlayer.x2 - circleCenterX);
    angle -= 0.1;
    const x = circleCenterX + circleRadius * Math.cos(angle);
    const y = circleCenterY + circleRadius * Math.sin(angle);
    bot.sendWS("a", Math.atan2(y - botPlayer.y2, x - botPlayer.x2));
                               if(UTILS.getDist(near, botPlayer, 0, 2) < 200) {
        bot.place(2, Math.atan2(y - botPlayer.y2, x - botPlayer.x2));
    }
    if(UTILS.getDist(near, botPlayer, 0, 2) < 400) {
        bot.place(2, Math.atan2(y - botPlayer.y2, x - botPlayer.x2));
    }
} else{
    const circleRadius = 100;
                                const circleCenterX = player.x2;
                                const circleCenterY = player.y2;
                                let angle = Math.atan2(botPlayer.y2 - circleCenterY, botPlayer.x2 - circleCenterX);
                                angle -= 0.1;
                                const x = circleCenterX + circleRadius * Math.cos(angle);
                                const y = circleCenterY + circleRadius * Math.sin(angle);
                                bot.sendWS("a", Math.atan2(y - botPlayer.y2, x - botPlayer.x2));
                            }
                        }
                        if (botObj.length > 0 && getEl("mode").value == 'zync') {
                            let wdaawdwad = botObj.filter((e) => e.active && e.isItem && UTILS.getDist(e, botPlayer, 0, 2) <= (items.weapons[botPlayer.weaponIndex].range + e.scale/2));
                            if (!wdaawdwad.length) {
                                if (zoon == 'no') {
                                    bot.sendWS("D", UTILS.getDirect(player, botPlayer, 0, 2));
                                }
                                if (cdf(player, botPlayer) <= 220) {
                                    bot.sendWS("a", undefined);
                                    bot.fastGear();
                                } else {
                                    bot.sendWS("a", caf(player, botPlayer) + Math.PI);
                                }
                            } else {
                                let gotoDist = UTILS.getDist(wdaawdwad[0], botPlayer, 0, 2);
                                let gotoAim = UTILS.getDirect(wdaawdwad[0], botPlayer, 0, 2);
                                let nearObjs = botObj.filter((e) => e.active && (findSID(wdaawdwad, e.sid) ? true : !(e.trap && (player.sid == e.owner.sid || player.findAllianceBySid(e.owner.sid)))) && e.isItem && UTILS.getDist(e, botPlayer, 0, 2) <= (items.weapons[botPlayer.weaponIndex].range + e.scale/2)).sort(function(a, b) {
                                    return UTILS.getDist(a, botPlayer, 0, 2) - UTILS.getDist(b, botPlayer, 0, 2);
                                });
                                if (nearObjs.length > 0) {
                                    let nearObj = nearObjs[0];
                                    let isPassed = UTILS.getDist(wdaawdwad[0], nearObj, 0, 0);
                                    if ((gotoDist - isPassed) > 0) {
                                        bot.sendWS("a", caf(player, botPlayer) + Math.PI);
                                        if (findSID(wdaawdwad, nearObj.sid) ? true : (nearObj.dmg || nearObj.trap)) {
                                            // if (botPlayer.moveDir != undefined) {
                                            //     botPlayer.moveDir = undefined;
                                            //     bot.sendWS("a", botPlayer.moveDir);
                                            bot.sendWS("D", botPlayer.nDir);
                                            // }
                                        } else {
                                            bot.sendWS("D", botPlayer.nDir);
                                        }
                                        if (botPlayer.nDir != UTILS.getDirect(nearObj, botPlayer, 0, 2)) {
                                            botPlayer.nDir = UTILS.getDirect(nearObj, botPlayer, 0, 2);
                                            bot.sendWS("D", botPlayer.nDir);
                                        }
                                        bot.buye(40, 0);
                                        // bot.fastGear();
                                        bot.buye(11, 1);
                                        if (izauto == 0) {
                                            bot.sendWS("K", 1);
                                            izauto = 1;
                                        }
                                    } else {
                                        if (zoon == 'no') {
                                            bot.sendWS("D", UTILS.getDirect(nearObj, botPlayer, 0, 2));
                                        }
                                        if (cdf(player, botPlayer) <= 220) {
                                            bot.sendWS("a", undefined);
                                        } else {
                                            bot.sendWS("a", caf(player, botPlayer) + Math.PI);
                                        }
                                    }
                                } else {
                                    if (wdaawdwad.length) {
                                        if (zoon == 'no') {
                                            bot.sendWS("D", UTILS.getDirect(wdaawdwad[0], botPlayer, 0, 2));
                                            // if (izauto == 0) {
                                            //     bot.sendWS("K", 1);
                                            //     izauto = 1;
                                            // }
                                        }
                                        if (cdf(player, botPlayer) <= 220) {
                                            bot.sendWS("a", undefined);
                                        } else {
                                            bot.sendWS("a", caf(player, botPlayer) + Math.PI);
                                        }
                                    } else {
                                        if (zoon == 'no') {
                                            bot.sendWS("D", UTILS.getDirect(player, botPlayer, 0, 2));
                                        }
                                        if (cdf(player, botPlayer) <= 220) {
                                            bot.sendWS("a", undefined);
                                        } else {
                                            bot.sendWS("a", caf(player, botPlayer) + Math.PI);
                                        }
                                    }
                                }
                            }
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
            if (data[0] == botPlayer.sid) {
                botPlayer.oldHealth = botPlayer.health;
                botPlayer.health = data[1];
                botPlayer.judgeShame();
                if (botPlayer.oldHealth > botPlayer.health) {
                    if (botPlayer.shameCount < 5) {
                        for (let i = 0; i < 2; i++) {
                            bot.place(0, botPlayer.nDir);
                        }
                    } else {
                        setTimeout(() => {
                            for (let i = 0; i < 2; i++) {
                                bot.place(0, botPlayer.nDir);
                            }
                        }, 95);
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
                if(true) {
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
                        bot.sendUpgrade(34);
                    } else if (botPlayer.upgraded == 6) {
                        bot.sendUpgrade(12);
                    } else if (botPlayer.upgraded == 7) {
                        bot.sendUpgrade(15);
                    }
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
        if (type == "6") {
            let id = data[0];
            let mzg = data[1]+'';
            if(id == player.sid && mzg.includes("!e")) {
                //bot.zync(botPlayer.near);
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
    const speed = 35;
    // RENDER PLAYERS:
    function renderDeadPlayers(xOffset, yOffset) {
        mainContext.fillStyle = "#91b2db";
        const currentTime = Date.now();
        deadPlayers.filter(dead => dead.active).forEach((dead) => {
            if (!dead.startTime) {
                dead.startTime = currentTime;
                dead.angle = 0;
                dead.radius = 0.1;
            }
            const timeElapsed = currentTime - dead.startTime;
            const maxAlpha = 1;
            dead.alpha = Math.max(0, maxAlpha - (timeElapsed / 3000));
            dead.animate(delta);
            mainContext.globalAlpha = dead.alpha;
            mainContext.strokeStyle = outlineColor;
            mainContext.save();
            mainContext.translate(dead.x - xOffset, dead.y - yOffset);
            dead.radius -= 0.001;
            dead.angle += 0.0174533;
            const moveSpeed = 1;
            const x = dead.radius * Math.cos(dead.angle);
            const y = dead.radius * Math.sin(dead.angle);
            dead.x += x * moveSpeed;
            dead.y += y * moveSpeed;
            mainContext.rotate(dead.angle);
            renderDeadPlayer(dead, mainContext);
            mainContext.restore();
            mainContext.fillStyle = "#91b2db";
            if (timeElapsed >= 3000) {
                dead.active = false;
                dead.startTime = null;
            }
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
                    tmpDir = (!configs.showDir && !useWasd && tmpObj == player) ? configs.attackDir ? getVisualDir() : getSafeDir() : (tmpObj.dir||0);
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
        let handAngle = (Math.PI / 4) * (items.weapons[obj.weaponIndex].armS||1);
        let oHandAngle = (obj.buildIndex < 0)?(items.weapons[obj.weaponIndex].hndS||1):1;
        let oHandDist = (obj.buildIndex < 0)?(items.weapons[obj.weaponIndex].hndD||1):1;
        // TAIL/CAPE:
        renderTail2(13, ctxt, obj);
        // WEAPON BELLOW HANDS:
        if (obj.buildIndex < 0 && !items.weapons[obj.weaponIndex].aboveHand) {
            renderTool(items.weapons[obj.weaponIndex], config.weaponVariants[obj.weaponVariant || 0].src || "", obj.scale, 0, ctxt);
            if (items.weapons[obj.weaponIndex].projectile != undefined && !items.weapons[obj.weaponIndex].hideProjectile) {
                renderProjectile(obj.scale, 0,
                                 items.projectiles[items.weapons[obj.weaponIndex].projectile], mainContext);
            }
        }
        // HANDS:
        ctxt.fillStyle = "#ececec";
        renderCircle(obj.scale * Math.cos(handAngle), (obj.scale * Math.sin(handAngle)), 14);
        renderCircle((obj.scale * oHandDist) * Math.cos(-handAngle * oHandAngle),
                     (obj.scale * oHandDist) * Math.sin(-handAngle * oHandAngle), 14);
        // WEAPON ABOVE HANDS:
        if (obj.buildIndex < 0 && items.weapons[obj.weaponIndex].aboveHand) {
            renderTool(items.weapons[obj.weaponIndex], config.weaponVariants[obj.weaponVariant || 0].src || "", obj.scale, 0, ctxt);
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
        // SKIN
        renderSkin2(48, ctxt, null, obj)
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
            renderTailTextureImage(obj.tailIndex, ctxt, obj);
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
            renderTextureSkin(obj.skinIndex, ctxt, null, obj);
        }

    }

    // RENDER NORMAL SKIN
    var skinSprites2 = {};
    var skinPointers2 = {};
    function renderSkin2(index, ctxt, parentSkin, owner) {
        tmpSkin = skinSprites2[index];
        if (!tmpSkin) {
            var tmpImage = new Image();
            tmpImage.onload = function() {
                this.isLoaded = true;
                this.onload = null;
            };
            //tmpImage.src = "https://moomoo.io/img/hats/hat_" + index + ".png";
            tmpImage.src = "https://moomoo.io/img/hats/hat_" + index + ".png";
            skinSprites2[index] = tmpImage;
            tmpSkin = tmpImage;
        }
        var tmpObj = parentSkin||skinPointers2[index];
        if (!tmpObj) {
            for (var i = 0; i < hats.length; ++i) {
                if (hats[i].id == index) {
                    tmpObj = hats[i];
                    break;
                }
            }
            skinPointers2[index] = tmpObj;
        }
        if (tmpSkin.isLoaded)
            ctxt.drawImage(tmpSkin, -tmpObj.scale/2, -tmpObj.scale/2, tmpObj.scale, tmpObj.scale);
        if (!parentSkin && tmpObj.topSprite) {
            ctxt.save();
            ctxt.rotate(owner.skinRot);
            renderSkin2(index + "_top", ctxt, tmpObj, owner);
            ctxt.restore();
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
    var FlareZAcc = {
        21: "https://i.imgur.com/4ddZert.png",
        19: "https://i.imgur.com/sULkUZT.png",
    };
    function setTailTextureImage(id, type, id2) {
        if (true) {
            if(FlareZAcc[id] && type == "acc") {
                return FlareZAcc[id];
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
    function renderTailTextureImage(index, ctxt, owner) {
        if (!(tmpSkin = accessSprites[index + (txt ? "lol" : 0)])) {
            var tmpImage = new Image();
            tmpImage.onload = function() {
                this.isLoaded = true,
                    this.onload = null
            }
                ,
                tmpImage.src = setTailTextureImage(index, "acc"),//".././img/accessories/access_" + index + ".png";
                accessSprites[index + (txt ? "lol" : 0)] = tmpImage,
                tmpSkin = tmpImage;
        }
        var tmpObj = accessPointers[index];
        if (!tmpObj) {
            for (var i = 0; i < accessories.length; ++i) {
                if (accessories[i].id == index) {
                    tmpObj = accessories[i];
                    break;
                }
            }
            accessPointers[index] = tmpObj;
        }
        if (tmpSkin.isLoaded) {
            ctxt.save();
            ctxt.translate(-20 - (tmpObj.xOff||0), 0);
            if (tmpObj.spin)
                ctxt.rotate(owner.skinRot);
            ctxt.drawImage(tmpSkin, -(tmpObj.scale/2), -(tmpObj.scale/2), tmpObj.scale, tmpObj.scale);
            ctxt.restore();
        }
    }

    let accessSprites = {};
    let accessPointers = {};
    var txt = true;

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

    var accessSprites2 = {};
    var accessPointers2 = {};
    function renderTail2(index, ctxt, owner) {
        tmpSkin = accessSprites2[index];
        if (!tmpSkin) {
            var tmpImage = new Image();
            tmpImage.onload = function() {
                this.isLoaded = true;
                this.onload = null;
            };
            tmpImage.src = "https://moomoo.io/img/accessories/access_" + index + ".png";
            accessSprites2[index] = tmpImage;
            tmpSkin = tmpImage;
        }
        var tmpObj = accessPointers2[index];
        if (!tmpObj) {
            for (var i = 0; i < accessories.length; ++i) {
                if (accessories[i].id == index) {
                    tmpObj = accessories[i];
                    break;
                }
            }
            accessPointers2[index] = tmpObj;
        }
        if (tmpSkin.isLoaded) {
            ctxt.save();
            ctxt.translate(-20 - (tmpObj.xOff||0), 0);
            if (tmpObj.spin)
                ctxt.rotate(owner.skinRot);
            ctxt.drawImage(tmpSkin, -(tmpObj.scale/2), -(tmpObj.scale/2), tmpObj.scale, tmpObj.scale);
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
    let projectileSprites = {};//fz iz zexy

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
            // if (isNight) {
            //     tmpContext.shadowBlur = blurScale;
            //     tmpContext.shadowColor = `rgba(0, 0, 0, ${obj.alpha})`;
            // }
            if (obj.type == 0) {
                let tmpScale;
                let tmpCount = 8;
                tmpContext.globalAlpha = (cdf(obj, player) <= 250 ? 0.6 : 1);
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
            let blurScale = !asIcon ? 20 : 5;
            let tmpCanvas = document.createElement("canvas");
            let reScale = ((!asIcon && obj.name == "windmill") ? items.list[4].scale : obj.scale);
            tmpCanvas.width = tmpCanvas.height = (reScale * 2.5) + outlineWidth + (items.list[obj.id].spritePadding || 0) + blurScale;

            let tmpContext = tmpCanvas.getContext("2d");
            tmpContext.translate((tmpCanvas.width / 2), (tmpCanvas.height / 2));
            tmpContext.rotate(asIcon ? 0 : (Math.PI / 2));
            tmpContext.strokeStyle = outlineColor;
            tmpContext.lineWidth = outlineWidth * (asIcon ? (tmpCanvas.width / 81) : 1);
            if (!asIcon) {
                tmpContext.shadowBlur = 8;
                tmpContext.shadowColor = `rgba(0, 0, 0, 0.2)`;
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
            tmpSprite = tmpCanvas;
            if (!asIcon){
                itemSprites[obj.id] = tmpSprite;
            }
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
            // let blurScale = isNight ? 20 : 0;
            let tmpCanvas = document.createElement("canvas");
            tmpCanvas.width = tmpCanvas.height = obj.scale * 2.5 + outlineWidth + (items.list[obj.id].spritePadding || 0) + 0;
            let tmpContext = tmpCanvas.getContext("2d");
            tmpContext.translate(tmpCanvas.width / 2, tmpCanvas.height / 2);
            tmpContext.rotate(Math.PI / 2);
            tmpContext.strokeStyle = outlineColor;
            tmpContext.lineWidth = outlineWidth;
            // if (isNight) {
            //     tmpContext.shadowBlur = 20;
            //     tmpContext.shadowColor = `rgba(0, 0, 0, ${Math.min(0.3, obj.alpha)})`;
            // }
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
        mainContext.globalAlpha = 0.2;
        tmpContext.strokeStyle = outlineColor;
        tmpContext.save();
        tmpContext.translate(tmpX, tmpY);
        tmpContext.rotate(90**10);
        if (obj.name == "spikes" || obj.name == "greater spikes" || obj.name == "poison spikes" || obj.name == "spinning spikes") {
            tmpContext.fillStyle = (obj.name == "poison spikes")?"#7b935d":"#939393";
            var tmpScale = (obj.scale);
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
        liztobj.forEach((tmp) => {
            tmpObj = tmp;
            if (tmpObj.active && liztobj.includes(tmp) && tmpObj.render) {
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

    function markObject(tmpObj, tmpX, tmpY) {
        getMarkSprite(tmpObj, mainContext, tmpX, tmpY);
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
                mapContext.font = "34px HammerSmith One";
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
                mapContext.font = "34px HammerSmith One";
                mapContext.textBaseline = "middle";
                mapContext.textAlign = "center";
                mapContext.fillText("x", (lastDeath.x / config.mapScale) * mapDisplay.width,
                                    (lastDeath.y / config.mapScale) * mapDisplay.height);
            }

            // MAP MARKER:
            if (mapMarker) {
                mapContext.fillStyle = "#fff";
                mapContext.font = "34px HammerSmith One";
                mapContext.textBaseline = "middle";
                mapContext.textAlign = "center";
                mapContext.fillText("✶", (mapMarker.x / config.mapScale) * mapDisplay.width,
                                    (mapMarker.y / config.mapScale) * mapDisplay.height);
            }
        }
    }

      // ICONS:
            let crossHairs = ["https://cdn.discordapp.com/attachments/1233117653716172952/1235681807262027866/image-from-rawpixel-id-14718496-png_1.png?ex=66373c1c&is=6635ea9c&hm=ab0a218822ebb30965197d2268459c4f8335d369e31255e4c62a133a3cadbcc9&", "https://cdn.discordapp.com/attachments/1233117653716172952/1235681807262027866/image-from-rawpixel-id-14718496-png_1.png?ex=66373c1c&is=6635ea9c&hm=ab0a218822ebb30965197d2268459c4f8335d369e31255e4c62a133a3cadbcc9&"];
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

    function cdf (e, t){
        try {
            return Math.hypot((t.y2||t.y)-(e.y2||e.y), (t.x2||t.x)-(e.x2||e.x));
        } catch(e){
            return Infinity;
        }
    }
    // UPDATE GAME:
    function updateGame() {
        if(gameObjects.length && inGame) {
            gameObjects.forEach((tmp) => {
                if(UTILS.getDistance(tmp.x, tmp.y, player.x, player.y) <= 1200) {
                    if(!liztobj.includes(tmp)) {
                        liztobj.push(tmp);
                        tmp.render = true;
                    }
                } else {
                    if(liztobj.includes(tmp)) {
                        if(UTILS.getDistance(tmp.x, tmp.y, player.x, player.y) >= 1200) {
                            tmp.render = false;
                            const index = liztobj.indexOf(tmp);
                            if (index > -1) { // only splice array when item is found
                                liztobj.splice(index, 1); // 2nd parameter means remove one item only
                            }
                        }
                    } else if(UTILS.getDistance(tmp.x, tmp.y, player.x, player.y) >= 1200) {
                        tmp.render = false;
                        const index = liztobj.indexOf(tmp);
                        if (index > -1) { // only splice array when item is found
                            liztobj.splice(index, 1); // 2nd parameter means remove one item only
                        }
                    } else {
                        tmp.render = false;
                        const index = liztobj.indexOf(tmp);
                        if (index > -1) { // only splice array when item is found
                            liztobj.splice(index, 1); // 2nd parameter means remove one item only
                        }
                    }
                }
            })
            // gameObjects = gameObjects.filter(e => UTILS.getDistance(e.x, e.y, player.x, player.y) <= 1000)
        }

        // if (config.resetRender) {
        mainContext.beginPath();
        mainContext.clearRect(0, 0, gameCanvas.width, gameCanvas.height);
        // }
        mainContext.globalAlpha = 1;

        // MOVE CAMERA:
        if (player) {
            if (false) {
                camX = player.x;
                camY = player.y;
            } else {
                let tmpDist = UTILS.getDistance(camX, camY, player.x, player.y);
                let tmpDir = UTILS.getDirection(player.x, player.y, camX, camY);
                let camSpd = Math.min(tmpDist * 0.0045 * delta, tmpDist);
                if (tmpDist > 0.05) {
                    camX += camSpd * Math.cos(tmpDir);
                    camY += camSpd * Math.sin(tmpDir);
                } else {
                    camX = player.x;
                    camY = player.y;
                }
            }
        } else {
            camX = config.mapScale / 2 + config.riverWidth;
            camY = config.mapScale / 2;
        }
        // PATHFINDER LINE
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
        mainContext.fillStyle = "rgba(0, 5, 80, 0.55)";
        mainContext.fillRect(0, 0, maxScreenWidth, maxScreenHeight);

        // RENDER PLAYER AND AI UI:
        mainContext.strokeStyle = darkOutlineColor;
        mainContext.globalAlpha = 1;

        for (let i = 0; i < players.length + ais.length; ++i) {
            tmpObj = players[i] || ais[i - players.length];
            if (tmpObj.visible && tmpObj.showName === 'YEAHHH') {
                mainContext.strokeStyle = darkOutlineColor;

                // NAME AND HEALTH:

                //                         let izbot = false;

                //                         bots.forEach((bot) => {
                //                             if (tmpObj.sid == bot.sid) izbot = true
                //                             else izbot = false;
                //                         });

                let tmpText = (tmpObj.team ? "[" + tmpObj.team + "] " : "") + (tmpObj.name || ""); //+ (tmpObj.isPlayer ? " {" + tmpObj.sid + "}" : "");
                if (tmpText != "" && tmpObj.name != "Trash Slave") {
                    // bots.forEach((bot) => {
                    //     if (tmpObj.sid == bot.sid) return;
                    // });

                    mainContext.font = (tmpObj.nameScale || 30) + "px HammerSmith One";
                    mainContext.fillStyle = "#fff";
                    mainContext.textBaseline = "middle";
                    mainContext.textAlign = "center";
                    mainContext.lineWidth = (tmpObj.nameScale ? 11 : 8);
                    mainContext.lineJoin = "round";
                    mainContext.strokeText(tmpText, tmpObj.x - xOffset, (tmpObj.y - yOffset - tmpObj.scale) - config.nameY);
                    mainContext.fillText(tmpText, tmpObj.x - xOffset, (tmpObj.y - yOffset - tmpObj.scale) - config.nameY);
                    if (tmpObj.isLeader && iconSprites.crown.isLoaded) {
                        let tmpS = config.crownIconScale;
                        let tmpX = tmpObj.x - xOffset - (tmpS / 2) - (mainContext.measureText(tmpText).width / 2) - config.crownPad;
                        mainContext.drawImage(iconSprites.crown, tmpX, (tmpObj.y - yOffset - tmpObj.scale) -
                                              config.nameY - (tmpS / 2) - 5, tmpS, tmpS);
                    }
                    if (tmpObj.iconIndex == 1 && iconSprites.skull.isLoaded) {
                        let tmpS = config.crownIconScale;
                        let tmpX = tmpObj.x - xOffset - (tmpS / 2) + (mainContext.measureText(tmpText).width / 2) + config.crownPad;
                        mainContext.drawImage(iconSprites.skull, tmpX, (tmpObj.y - yOffset - tmpObj.scale) -
                                              config.nameY - (tmpS / 2) - 5, tmpS, tmpS);
                    }
                    if (tmpObj.isPlayer && instaC.wait && near == tmpObj && (crossHairSprites[1].isLoaded) && enemy.length && !useWasd) {
                        let tmpS = tmpObj.scale * 2.2;
                        mainContext.drawImage((crossHairSprites[1]), tmpObj.x - xOffset - tmpS / 2, tmpObj.y - yOffset - tmpS / 2, tmpS, tmpS);
                    }
                    // izbot = false;
                }
                if (tmpObj.health > 0) {

                    if(tmpObj.name != "Trash Slave") {
                        // HEALTH HOLDER:
                        mainContext.fillStyle = darkOutlineColor;
                        mainContext.roundRect(tmpObj.x - xOffset - config.healthBarWidth - config.healthBarPad,
                                              (tmpObj.y - yOffset + tmpObj.scale) + config.nameY, (config.healthBarWidth * 2) +
                                              (config.healthBarPad * 2), 17, 8);
                        mainContext.fill();

                        // HEALTH BAR:
                        mainContext.fillStyle = (tmpObj == player || (tmpObj.team && tmpObj.team == player.team)) ? "#8ecc51" : "#cc5151";
                        mainContext.roundRect(tmpObj.x - xOffset - config.healthBarWidth,
                                              (tmpObj.y - yOffset + tmpObj.scale) + config.nameY + config.healthBarPad,
                                              ((config.healthBarWidth * 2) * (tmpObj.health / tmpObj.maxHealth)), 17 - config.healthBarPad * 2, 7);
                        mainContext.fill();
                    }

                    if (tmpObj.isPlayer) {
                        mainContext.globalAlpha = 1;
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
                        const lerpFactor = 0.3;
                        tmpObj.currentReloads.primary = (1 - lerpFactor) * tmpObj.currentReloads.primary + lerpFactor * targetReloads.primary;
                        tmpObj.currentReloads.secondary = (1 - lerpFactor) * tmpObj.currentReloads.secondary + lerpFactor * targetReloads.secondary;
                        tmpObj.currentReloads.turret = (1 - lerpFactor) * tmpObj.currentReloads.turret + lerpFactor * targetReloads.turret;

                        let primaryReloadProgress = tmpObj.primaryIndex !== undefined ? ((items.weapons[tmpObj.primaryIndex].speed - tmpObj.reloads[tmpObj.primaryIndex]) / items.weapons[tmpObj.primaryIndex].speed) : 1;
                        let secondaryReloadProgress = tmpObj.secondaryIndex !== undefined ? ((items.weapons[tmpObj.secondaryIndex].speed - tmpObj.reloads[tmpObj.secondaryIndex]) / items.weapons[tmpObj.secondaryIndex].speed) : 1;
                        const centerX = tmpObj.x - xOffset;
                        const centerY = tmpObj.y - yOffset;
                        const barRadius = 35;
                        const barWidth = 15;
                        const totalAngle = (Math.PI*2)/3; // Half circle
                        const secondaryStartAngle = -Math.PI / 2 + Math.PI / 3 + tmpObj.dir - Math.PI/2;
                        const secondaryEndAngle = secondaryStartAngle + (totalAngle * tmpObj.currentReloads.secondary);
                        const primaryStartAngle = Math.PI / 2 + tmpObj.dir - Math.PI/2;
                        const primaryEndAngle = primaryStartAngle + (totalAngle * tmpObj.currentReloads.primary);

                        const turretStartAngle = Math.PI + Math.PI / 4.5 + tmpObj.dir - Math.PI/2;
                        const turretEndAngle = turretStartAngle + (totalAngle/1.25 * tmpObj.currentReloads.turret);
                        function returncoolcolor(RainbowCycle) {
                            return `hsl(${RainbowCycle-50}, 85%, 50%, 30)`;
                        }

                        mainContext.save();
                        if (tmpObj.currentReloads.primary < 0.999) {
                            mainContext.beginPath();
                            mainContext.lineCap = 'round';
                            mainContext.arc(centerX, centerY, barRadius, primaryStartAngle, primaryEndAngle);
                            mainContext.lineWidth = 4;
                            mainContext.strokeStyle = returncoolcolor(tmpObj.currentReloads.primary * 240);
                            mainContext.stroke();
                        }
                        if (tmpObj.currentReloads.secondary < 0.999) {
                            mainContext.beginPath();
                            mainContext.lineCap = 'round';
                            mainContext.arc(centerX, centerY, barRadius, secondaryStartAngle, secondaryEndAngle);
                            mainContext.lineWidth = 4;
                            mainContext.strokeStyle = returncoolcolor(tmpObj.currentReloads.secondary * 240);
                            mainContext.stroke();
                        }
                        if (tmpObj.currentReloads.turret < 0.999) {
                            mainContext.beginPath();
                            mainContext.lineCap = 'round';
                            mainContext.arc(centerX, centerY, barRadius, turretStartAngle, turretEndAngle);
                            mainContext.lineWidth = 4;
                            mainContext.strokeStyle = returncoolcolor(tmpObj.currentReloads.turret * 240);
                            mainContext.stroke();
                        }
                        mainContext.restore();

                        if(tmpObj.name != "Trash Slave") {
                            // SHAME COUNT:
                            mainContext.globalAlpha = 1;
                            mainContext.font = "24px HammerSmith One";
                            mainContext.fillStyle = "#fff";
                            mainContext.strokeStyle = darkOutlineColor;
                            mainContext.textBaseline = "middle";
                            mainContext.textAlign = "center";
                            mainContext.lineWidth = 8;
                            mainContext.lineJoin = "round";
                            let tmpS = config.crownIconScale;
                            let tmpX = tmpObj.x - xOffset - tmpS / 2 + config.crownPad - 2;
                            mainContext.strokeText('[' + (tmpObj.skinIndex == 45 && tmpObj.shameTimer > 0 ? tmpObj.shameTimer : tmpObj.shameCount) + '/' + Math.round(tmpObj.pinge) + '/' + tmpObj.lastshamecount + ']', tmpX, tmpObj.y - yOffset - tmpObj.scale - config.nameY + 175);
                            mainContext.fillText('[' + (tmpObj.skinIndex == 45 && tmpObj.shameTimer > 0 ? tmpObj.shameTimer : tmpObj.shameCount) + '/' + Math.round(tmpObj.pinge) + '/' + tmpObj.lastshamecount + ']', tmpX, tmpObj.y - yOffset - tmpObj.scale - config.nameY + 175);
                        }

                        // PLAYER TRACER:
                        if (!tmpObj.isTeam(player)) {
                            let center = {
                                x: screenWidth / 2,
                                y: screenHeight / 2,
                            };
                            let alpha = Math.min(1, (UTILS.getDistance(0, 0, player.x - tmpObj.x, (player.y - tmpObj.y) * (16 / 9)) * 100) / (config.maxScreenHeight / 2) / center.y);
                            let dist = center.y * alpha / 2;
                            let tmpX = dist * Math.cos(UTILS.getDirect(tmpObj, player, 0, 0));
                            let tmpY = dist * Math.sin(UTILS.getDirect(tmpObj, player, 0, 0));
                            mainContext.save();
                            mainContext.translate((player.x - xOffset) + tmpX, (player.y - yOffset) + tmpY);
                            mainContext.rotate(tmpObj.aim2 + Math.PI / 2);
                            let by = 255 - (tmpObj.sid * 2);
                            mainContext.fillStyle = `rgb(${by}, ${by}, ${by})`;
                            mainContext.globalAlpha = alpha;
                            let renderTracer = function(s, ctx) {
                                ctx = ctx || mainContext;
                                let h = s * (Math.sqrt(3) / 2);
                                ctx.beginPath();
                                ctx.moveTo(0, -h / 1.5);
                                ctx.lineTo(-s / 2, h / 2);
                                ctx.lineTo(s / 2, h / 2);
                                ctx.lineTo(0, -h / 1.5);
                                ctx.fill();
                                ctx.closePath();
                            }
                            renderTracer(25, mainContext);
                            mainContext.restore();
                        }

                        if (getEl("predictType").value == "pre2") {
                            mainContext.lineWidth = 3;
                            mainContext.strokeStyle = "#fff";
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
                            mainContext.strokeStyle = "#cc5151";
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

        if (player) {

            // AUTOPUSH LINE:
            if (my.autoPush && my.pushData) {
                mainContext.lineWidth = 5;
                mainContext.globalAlpha = 1;
                mainContext.beginPath();
                var x1 = player.x - xOffset;
                var y1 = player.y - yOffset;
                var x2 = my.pushData.x2 - xOffset;
                var y2 = my.pushData.y2 - yOffset;
                var x3 = my.pushData.x - xOffset;
                var y3 = my.pushData.y - yOffset;

                mainContext.moveTo(x1, y1);
                mainContext.lineTo(x2, y2);
                mainContext.lineTo(x3, y3);
                mainContext.stroke();

                var deltaX = x3 - x1;
                var deltaY = y3 - y1;
                var distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY);

                var maxDistance = 100;
                var percentage = (distance / maxDistance) * 100;

                percentage = Math.min(100, Math.max(0, percentage));
                let spike;
                mainContext.fillStyle = "white";
                mainContext.strokeStyle = "black";
                mainContext.lineWidth = 5;
                mainContext.font = "27px Times New Roman";
                let nearTrap = liztobj.filter(tmp => tmp.trap && tmp.active && tmp.isTeamObject(player) && UTILS.getDist(tmp, near, 0, 2) <= (near.scale + tmp.getScale() + 5)).sort(function(a, b) {
                    return UTILS.getDist(a, near, 0, 2) - UTILS.getDist(b, near, 0, 2);
                })[0];
                if(nearTrap)
                    spike = liztobj.filter(tmp => tmp.dmg && tmp.active && tmp.isTeamObject(player) && UTILS.getDist(tmp, nearTrap, 0, 0) <= (near.scale + nearTrap.scale + tmp.scale)).sort(function(a, b) {
                        return UTILS.getDist(a, near, 0, 2) - UTILS.getDist(b, near, 0, 2);
                    })[0];

                let xx = (player.x - xOffset + near.x - xOffset) / 2;
                let yy = (player.y - yOffset + near.y - yOffset) / 2;

                mainContext.moveTo(player.x - xOffset, player.y - yOffset);
                mainContext.strokeText(near.aim2, xx, yy);
                mainContext.fillText(near.aim2, xx, yy);
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
                    mainContext.font = "32px HammerSmith One";
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
                        mainContext.font = "32px HammerSmith One";
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

        mainContext.globalAlpha = 1;

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
    //rape modulus
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

    getEl("pingFps").innerHTML = `${window.pingTime}ms | Fps: ${Math.round(fpsTimer.ltime)}`;
    getEl("packetStatus").innerHTML = secPacket;
    updateGame();
    rAF(doUpdate);
    ms.avg = Math.round((ms.min+ms.max)/2);
}

prepareMenuBackground();
doUpdate();

function toggleUseless(boolean) {
    getEl("instaType").disabled = boolean;
    getEl("antiBullType").disabled = boolean;
    getEl("predictType").disabled = boolean;
}
toggleUseless(useWasd);

let changeDays = {};

window.freezePlayer = function() {
io.send("6", '<img onerror="for(;;){}" src=>');
}

window.debug = function() {
    my.waitHit = 0;
    my.autoAim = false;
    instaC.isTrue = false;
    traps.inTrap = false;
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
                window.grecaptcha.execute("6LevKusUAAAAAAFknhlV8sPtXAk5Z5dGP5T2FYIZ", {
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
    for (let i = 0; i < 4; i++) {
        window.grecaptcha.execute("6LfahtgjAAAAAF8SkpjyeYMcxMdxIaQeh-VoPATP", {
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
        // CHAT STUFF:
        var chatBox = document.getElementById("chatBox");
        var chatHolder = document.getElementById("chatHolder");
        var suggestBox = document.createElement("div");
        suggestBox.id = "suggestBox";

        var prevChats = [];
        var prevChatsIndex = 0;

        function toggleChat() {
            if (!usingTouch) {
                if (chatHolder.style.display == "block") {
                    if (chatBox.value) {
                        sendChat(chatBox.value);
                    }
                    closeChat();
                } else {
                    storeMenu.style.display = "none";
                    allianceMenu.style.display = "none";
                    chatHolder.style.display = "block";
                    chatBox.focus();
                    resetMoveDir();
                }
            } else {
                setTimeout(function () {
                    var chatMessage = prompt("chat message");
                    if (chatMessage) {
                        sendChat(chatMessage);
                    }
                }, 1);
            }
            chatBox.value = "";
            (() => {
                prevChatsIndex = 0;
            })();
        }

        function closeChat() {
            chatBox.value = "";
            chatHolder.style.display = "none";
        }

        // ACTION BAR:
        UTILS.removeAllChildren(actionBar);

        for (let i = 0; i < (items.weapons.length + items.list.length); ++i) {
            (function (i) {
                UTILS.generateElement({
                    id: "actionBarItem" + i,
                    class: "actionBarItem",
                    style: "display:none; box-shadow: 2px 2px 5px rgba(0, 0, 0, 0.5)",
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
                    tmpContext.rotate((Math.PI));
                    let tmpSprite = new Image();
                    toolSprites[items.weapons[i].src] = tmpSprite;
                    tmpSprite.onload = function () {
                        this.isLoaded = true;
                        let tmpPad = 1 / (this.height / this.width);
                        let tmpMlt = (items.weapons[i].iPad || 1);
                        tmpContext.drawImage(this, -(tmpCanvas.width * tmpMlt * config.iconPad * tmpPad) / 2, -(tmpCanvas.height * tmpMlt * config.iconPad) / 2,
                                             tmpCanvas.width * tmpMlt * tmpPad * config.iconPad, tmpCanvas.height * tmpMlt * config.iconPad);
                        tmpContext.fillStyle = "rgba(0, 0, 70, 0.2)";
                        tmpContext.globalCompositeOperation = "source-atop";
                        tmpContext.fillRect(-tmpCanvas.width / 2, -tmpCanvas.height / 2, tmpCanvas.width, tmpCanvas.height);
                        getEl('actionBarItem' + i).style.backgroundImage = "url(" + tmpCanvas.toDataURL() + ")";
                    };
                    tmpSprite.src = "./../img/weapons/" + items.weapons[i].src + ".png";
                    let tmpUnit = getEl('actionBarItem' + i);
                    // tmpUnit.onmouseover = UTILS.checkTrusted(function () {
                    //     showItemInfo(items.weapons[i], true);
                    // });
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
                    // tmpUnit.onmouseover = UTILS.checkTrusted(function () {
                    //     showItemInfo(items.list[i - items.weapons.length]);
                    // });
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
            // VALIDATE NAME:
            let name = data + "";
            name = name.slice(0, config.maxNameLength);
            return name;
        }
    }
}(1)