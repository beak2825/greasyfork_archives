// ==UserScript==
// @name         Happymod by Ultra hack
// @version      2.1
// @author       Ultra hack
// @match        *://*moomoo.io/*
// @match        *://*sandbox.moomoo.io/*
// @icon         https://i.pinimg.com/originals/bb/29/d1/bb29d1724a4b4f0b30acf18fa4d16ad0.gif
// @grant        none
// @namespace https://greasyfork.org/users/805514
// @description Happy mod by Ultra hack
// @downloadURL
// @updateURL
// @downloadURL https://update.greasyfork.org/scripts/525464/Happymod%20by%20Ultra%20hack.user.js
// @updateURL https://update.greasyfork.org/scripts/525464/Happymod%20by%20Ultra%20hack.meta.js
// ==/UserScript==
/// Visuals
let styleItem =
	`
    .resourceDisplay,
    #killCounter {
        border: 5px solid black;
        border-radius: 50px;
        transition: 0.5s;
    }
    .uiElement {
        border: 5px solid #303030;
        border-radius: 50px;
        color: #FFFFFF;
        transition: 0.5s;
    }

    .skinColorItem {
        height: 20px;
        width: 20px;
        border: 4px solid rgba(0, 0, 0, 0.5);
        transition: .5s
    }



    .actionBarItem {
        border: 5px solid transparent;
        border-radius: 50px;
        color: default;
        transition: 0.5s;
    }
    .actionBarItem:hover {
        background-color: transparent;
        border: 5px solid;
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
    border-radius: 50px;
    border: 20px;
    }
    `;
if (typeof GM_addStyle != "undefined") {
	GM_addStyle(styleItem);
} else {
	var node = document.createElement("style");
	node.type = "text/css";
	node.appendChild(document.createTextNode(styleItem));
	var heads = document.getElementsByTagName("head");
	if (heads.length > 0) {
		heads[0].appendChild(node);
	} else {
		document.documentElement.appendChild(node);
	}
}
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
		document.getElementById("gameName").style.textShadow = `0px 0px ${shadowRadius + 20}px #ffffff`;
	}, 100);
})();
let loadingText = document.getElementById("loadingText");
let hue = 0;
    document.getElementById("storeHolder").style = "height: 500px; width: 435px;";
document.getElementById('enterGame').innerText = "⇏ ‍ ‍ Play ‍ ‍ ‍⇍";
document.getElementById("enterGame").addEventListener("mouseenter", function() {
	document.getElementById('enterGame').innerText = "⇏ Play? ‍⇍";
});
document.getElementById("enterGame").addEventListener("mouseleave", function() {
	document.getElementById('enterGame').innerText = "⇏ ‍  ‍  Play ‍ ‍   ‍⇍";
});
$('#itemInfoHolder').css({
	'text-align': 'center',
	'top': '25px',
	'left': '440px',
	'right': '350px',
	'max-width': '350px'
});
function isTeamMember(a){
    if(player.team && a != player && a.team == player.team){
        return true;
    } else {
        return false;
    }
}
function isTeam(tmpObj) {
    return (tmpObj == player || (tmpObj.team && tmpObj.team == player.team));
}

let whereverifybutton = document.querySelector("#altcha_checkbox")
function clicktheverify() {
    if (whereverifybutton) {
        whereverifybutton.click()
    }
}

setInterval(clicktheverify, 10);
document.getElementById('gameName').innerHTML = 'Happy mod';
document.getElementById('loadingText').innerHTML = 'Loading...';
setTimeout(() => {
	document.getElementById('loadingText').innerHTML = '✅Successful✅';
}, 710);
$('#gameName').css({
	'color': '#87ceeb',
	'text-shadow': 'rgba(111, 5, 149, 1)',
	'text-align': 'center',
	'font-size': '80px',
	'margin-bottom': '20px'
});
document.getElementById("mainMenu").style.backgroundImage = "url()";
$("#mapDisplay").css({
	background: `url('https://i.imgur.com/fgFsQJp.png')`
});
document.getElementById("mapDisplay").style.border = "1px solid black";
let antiSync = false;
//ping scopes
let Fo = -1;
let second = -1;
let highestArr = [];
let highestMs = -1;
let averageArr = [];
let averageMs = -1;
//preplacer tests for better results
let preplaceDelay = {
    killObject: -1,
    gatherAnimation: -1,
    total: function() {
        return (new Date() - Math.abs(Math.trunc(this.killObject - this.gatherAnimation)));
    },
}

let nameColor = "#99ee99";
let enemyNameColor = "rgba(204, 81, 81, 0.6)";
let reloadBarColor = "#f9cb9c";
let healthBarColor = "#8ecc51";
let shameBarColor = "#926DB6";
let enemyHealthBarColor = "#F05C5B";
let damageTextColor = "#fff";
let healTextColor = "#8ecc51";
let myObjectHealth = "#98B86E";
let enemyObjectHealth = "#F05C5B";
let autoPushLine = "#926DB6";
let useHack = true;
let log = console.log;
let testMode = window.location.hostname == "127.0.0.1";
let inantiantibull = false;

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
        return r.d(n, "f", n), n
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
            min.src = "https://update.greasyfork.org/scripts/423602/msgpack.js";
            document.body.append(min);
        },
        main: () => {
            if (!useHack) {
                return;
            }
            "use strict";
            let scriptTags = document.getElementsByTagName("script");
            for (let i = 0; i < scriptTags.length; i++) {
                if (scriptTags[i].src.includes("bundle.js")) {
                    scriptTags[i].remove();
                    break;
                }
            }
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
            if (typeof (Storage) !== "undefined") {
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
            function setConfigs() {
                return {
                    combatWarnings: true,
                    playerLogger: true,
                    AutoUpgrade: false,
                    killChat: true,
                    autoBuy: true,
                    autoBuyEquip: true,
                    autoPush: true,
                    revTick: false,
                    alwaysRevInsta: false,
                    spikeTick: true,
                    predictTick: true,
                    autoPlace: true,
                    autoReplace: true,
                    antiTrap: true,
                    slowOT: false,
                    attackDir: false,
                    noDir: false,
                    showDir: false,
                    autoRespawn: false
                };
            }
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
            window.changeMenu = function() { };
            window.debug = function() { };
            window.toggleNight = function() { };
            window.wasdMode = function() { };
            // PAGE 1:
            window.startGrind = function() { };
            // PAGE 3:
            window.connectFillBots = function() { };
            window.destroyFillBots = function() { };
            window.tryConnectBots = function() { };
            window.destroyBots = function() { };
            window.resBuild = function() { };
            window.toggleBotsCircle = function() { };
            window.toggleVisual = function() { };
            // SOME FUNCTIONS:
            window.prepareUI = function() { };
            window.leave = function() { };
            // nah hahahahahhh why good ping
            window.ping = 0;
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
                    window[setting.id + "Func"] = function() { };
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
                        this.checkBox({ id: "check_" + options, style: `display: ${i == 0 ? "inline-block" : "none"};`, class: "checkB", onclick: `window.${options + "Func"}()`, checked: setting.menu[options] });
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
:root {
    --bg-dark: #222;
    --bg-darker: #191919;
    --bg-panel: rgba(34, 34, 34, 0.75);
    --text-light: #fff;
    --text-active: #c8c8c8;
    --accent-green: #99ee99;
    --border-dark: #000;
    --border-light: #fff;
    --shadow: 0 20px 40px rgba(0, 0, 0, 0.6);
    --radius: 6px;
    --transition: all 0.2s ease;
}

.menuClass {
    color: var(--text-light);
    font-size: 31px;
    text-align: left;
    padding: 10px 12px 8px;
    width: 300px;
    background: var(--bg-panel);
    border-radius: var(--radius);
    box-shadow: var(--shadow);
    backdrop-filter: blur(8px); /* красивое размытие фона */
    border: 1px solid rgba(255, 255, 255, 0.05);
    transition: var(--transition);
}

.menuC {
    display: none;
    margin-top: 8px;
    font-family: "Hammersmith One", sans-serif;
    font-size: 13px;
    max-height: 200px;
    overflow-y: auto;
    padding: 8px 0;
    user-select: none;
    -webkit-user-drag: none;
}

.menuB {
    display: block;
    width: 100%;
    padding: 10px 12px;
    margin: 2px 8px;
    text-align: center;
    background: var(--bg-darker);
    color: var(--text-light);
    border: 2px solid var(--border-dark);
    border-radius: var(--radius);
    cursor: pointer;
    transition: var(--transition);
    font-weight: 500;
}

.menuB:hover {
    border-color: var(--border-light);
    background: rgba(255, 255, 255, 0.05);
    transform: translateY(-1px);
}

.menuB:active {
    background: #c8c8c8;
    color: #191919;
    transform: translateY(0);
}

.customText {
    padding: 8px 10px;
    border: 2px solid var(--border-dark);
    border-radius: var(--radius);
    background: var(--bg-dark);
    color: var(--text-light);
    transition: var(--transition);
}

.customText:focus {
    outline: none;
    background: #ffff00;
    color: #000;
    box-shadow: 0 0 0 3px rgba(255, 255, 0, 0.4);
}

.checkB {
    accent-color: #88ff88;
    cursor: pointer;
    width: 18px;
    height: 18px;
    transform: translateY(3px);
}

.Cselect {
    padding: 8px 10px;
    background: rgb(75, 75, 75);
    color: var(--text-light);
    border: 1px solid var(--border-dark);
    border-radius: var(--radius);
    cursor: pointer;
}

.Cselect:focus {
    outline: 2px solid var(--accent-green);
}

#menuChanger {
    position: absolute;
    right: -1px;
    top: 1px;
    padding: 4px 8px;
    background: #202020;
    color: var(--text-light);
    border: 3px solid #99ee99;
    border-radius: 0 var(--radius) var(--radius) 0;
    font-weight: bold;
    cursor: pointer;
    transition: var(--transition);
    z-index: 10;
}

#menuChanger:hover {
    color: var(--accent-green);
    background: #2a2a2a;
    border-color: #bbffbb;
}

.menuC::-webkit-scrollbar {
    width: 10px;
}

.menuC::-webkit-scrollbar-track {
    background: transparent;
}

.menuC::-webkit-scrollbar-thumb {
    background: var(--bg-darker);
    border-radius: var(--radius);
    border: 2px solid var(--bg-panel);
}

.menuC::-webkit-scrollbar-thumb:hover {
    background: #444;
}

.menuC::-webkit-scrollbar-thumb:active {
    background: #ccc;
}

.menuC {
    scrollbar-color: var(--bg-darker) transparent;
    scrollbar-width: thin;
}
            `);
                        HTML.startDiv({ style: "font-size: 30px; color: #ffffff", id: "menuHeadLine", class: "menuClass" }, (html) => {
                html.add(`ModMenu:`);
                html.button({ id: "menuChanger", class: "material-icons", innerHTML: `sync`, onclick: "window.changeMenu()" });
                HTML.addDiv({ id: "menuMain", style: "display: block", class: "menuC", appendID: "menuHeadLine" }, (html) => {
                    html.newLine();
                HTML.addDiv({ style: "font-size: 20px; color: #99ee99;", appendID: "menuMain" }, (html) => {
                    html.add(`Grinder:`);
                    html.newLine();
                    });
                    html.checkBox({ id: "weaponGrind", class: "checkB", onclick: "window.startGrind()" });
                    html.newLine(2);
                HTML.addDiv({ style: "font-size: 20px; color: #99ee99;", appendID: "menuMain" }, (html) => {
                    html.add(`Visuals:`);
                    });
                    html.newLine();
                    html.select({
                        id: "visualType", class: "Cselect", option: {
                            "Fz": {
                                id: "fz",
                            },
                            "Mega": {
                                id: "mega",
                            },
                            "Zika": {
                                id: "zika",
                            },
                            "Pacifist": {
                                id: "pacifist",
                            },
                            "Happymod": {
                                id: "smiley",
                                selected: true
                            },
                            "EliteMod": {
                                id: "elite",
                            }
                        }
                    });
                });
                HTML.addDiv({ id: "menuConfig", class: "menuC", appendID: "menuHeadLine" }, (html) => {
                    html.add(`AutoPlacer Placement Tick:`);
                    html.text({ id: "autoPlaceTick", class: "customText", value: "2", size: "2em", maxLength: "1" });
                    html.newLine();
                    html.add(`Render Placers:`);
                    html.checkBox({id: "placeVis", class: "checkB", checked: true});
                    html.newLine();
                    html.add(`Configs:`);
                    html.selectMenu({ id: "configsChanger", class: "Cselect", menu: configs });
                    html.newLine();
                    html.newLine();
                    html.add(`AutoChat`);
					html.checkBox({
						id: "autochat",
						class: "checkB",
						checked: true
					});
					html.newLine();
                    html.add(`instakill Type:`);
                    html.select({
                        id: "instaType", class: "Cselect", option: {
                            OneShot: {
                                id: "Normal-insta",
                                selected: true
                            },
                            Spammer: {
                                id: "Revers-insta"
                            }
                        }
                    });
                    html.newLine();
                    html.add(`AntiBull Type:`);
                    html.select({
                        id: "antiBullType", class: "Cselect", option: {
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
                    html.add(`Backup Nobull Insta:`);
                    html.checkBox({ id: "backupNobull", class: "checkB", checked: true });
                    html.newLine();
                    html.add(`Turret Gear Combat Assistance:`);
                    html.checkBox({ id: "turretCombat", class: "checkB", checked: true });
                    html.newLine();
                    html.add(`AntiSpikeTick:`);
                    html.checkBox({ id: "safeAntiSpikeTick", class: "checkB", checked: true });
                    html.newLine();
                });
                HTML.addDiv({ id: "menuOther", class: "menuC", appendID: "menuHeadLine" }, (html) => {
                    html.add(`Break Objects Range:`);
                    html.text({ id: "breakRange", class: "customText", value: "700", size: "3em", maxLength: "4" });
                    html.newLine();
                    html.add(`Predictive Antibull:`);
                    html.checkBox({ id: "pAB", class: "checkB" });
                    html.newLine();
                    html.add(`Safewalk:`);
                    html.checkBox({ id: "dunemodpro", class: "checkB" });
                    html.add(`Song: `);
                    html.select({
                        id: "songy", class: "Cselect", option: {
                            "Take Over - LOL": {
                                id: "1",
                                selected: true
                            },
                            "Subway Sexists": {
                                id: "2",
                            },
                            "Warriors - Imagine Dragons": {
                                id: "3"
                            },
                            "Legends Never Die - LOL": {
                                id: "4"
                            },
                            "Shooting star": {
                                id: "5"
                            },
                            "Rival - Lonely Way": {
                                id: "1"
                            },
                            "Rival - Throne": {
                                id: "2"
                            },
                            "Rival - Be Gone": {
                                id: "3"
                            },
                            "Rival - Walls": {
                                id: "4"
                            },
                            "Rival - Control": {
                                id: "5"
                            },
                            "Egzod - No Rival": {
                                id: "6"
                            },
                            "do not resurrect - Necrotic Grip": {
                                id: "7"
                            },
                            "Witchouse 40k - Black Rainbow": {
                                id: "8"
                            },
                            "Grim Salvo - Feasting.On.The.Guts.Of.Angels": {
                                id: "9"
                            },
                            "Initial D - Don't Stand so Close": {
                                id: "10"
                            },
                            "Initial D - The Top": {
                                id: "11"
                            },
                            "Initial D - Gas Gas Gas": {
                                id: "12"
                            },
                            "Initial D - Running In The 90's": {
                                id: "13"
                            },
                            "Initial D - No One Sleep In Tokyo": {
                                id: "14"
                            },
                            "UNSECRET & Noeni - Fallout": {
                                id: "15"
                            },
                            "V O E - Giants": {
                                id: "16"
                            },
                            "Neoni - Champion": {
                                id: "17"
                            },
                            "JPB & Mendum - Losing Control": {
                                id: "18"
                            },
                            "Freddie Dredd - Limbo": {
                                id: "19"
                            },
                            "xxxmanera - NFS": {
                                id: "20"
                            },
                            "Take Me Home": {
                                id: "21"
                            },
                            "rarin - GTA": {
                                id: "22"
                            },
                            "Ghost": {
                                id: "23"
                            },
                            "Rico Story 1": {
                                id: "24"
                            },
                            "xxxmanera - Loyalty Before Royalty": {
                                id: "25"
                            },
                            "xxxmanera - Sosa! Baby": {
                                id: "26"
                            },
                            "xxxmanera - Dead Idol": {
                                id: "27"
                            },
                            "CRVN x Zack Merci - Nobody": {
                                id: "28"
                            },
                            "Cheriimoya, Sierra Kidd - Living Life In The Night": {
                                id: "29"
                            },
                            "Adrenaline - ACE": {
                                id: "30"
                            },
                        }
                    });

                });
            });
            let menuChatDiv = document.createElement("div");
            menuChatDiv.id = "menuChatDiv";
            document.body.appendChild(menuChatDiv);
            HTML.set("menuChatDiv");
            HTML.setStyle(`
            position: absolute;
            display: none;
            left: 20px;
            top: 20px;
            box-shadow: 0px 0px 10px rgba(0, 0, 0, 0); //0.65
            `);
            HTML.resetHTML();
            HTML.setCSS(`
            .chDiv {
    color: #fff;
    padding: 10px;
    width: 390px;
    height: 250px;
    background-color: rgba(34, 34, 34, 0.7);
    font-family: "Courier New", monospace;
    border-radius: 15px;
    backdrop-filter: blur(5px);
    box-shadow: 20px 10px #202020;
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
    scrollbar-width: thin;
    scrollbar-color: rgba(255, 255, 255, 0.5) rgba(255, 255, 255, 0.1);
    border-radius: 10px;
}
.chMainDiv::-webkit-scrollbar {
    width: 8px;
}
/* Handle */
.chMainDiv::-webkit-scrollbar-thumb {
    background-color: rgba(255, 255, 255, 0.5);
    border-radius: 10px;
}
/* Handle on hover */
.chMainDiv::-webkit-scrollbar-thumb:hover {
    background-color: rgba(255, 255, 255, 0.7);
}
.chMainBox {
     position: absolute;
    left: 10px;
    bottom: 10px;
    width: 380px;
    height: 25px;
    background-color: rgba(255, 255, 255, 0.1);
    border-radius: 16px;
    color: rgba(255, 255, 255, 0.75);
    font-family: "Courier New", monospace;
    font-size: 12px;
    border: none;
    outline: none;
}
            `);
            HTML.startDiv({ id: "mChDiv", class: "chDiv" }, (html) => {
                HTML.addDiv({ id: "mChMain", class: "chMainDiv", appendID: "mChDiv" }, (html) => {
                });
                html.text({ id: "mChBox", class: "chMainBox", placeHolder: `📝 To chat click here or press "Enter" key` });
            });
            let menuChats = getEl("mChMain");
            let menuChatBox = getEl("mChBox");
            let menuCBFocus = false;
            let menuChCounts = 0;

            function addChatLog(e, c, d, v) {
                HTML.set("menuChatDiv");
                let chatLogs = document.getElementById("mChMain");
                const now = new Date();
                const hours = now.getHours();
                const minutes = now.getMinutes();
                const ampm = hours >= 12 ? 'PM' : 'AM';
                const formattedHours = (hours % 12 || 12).toString();
                const formattedMinutes = minutes.toString().padStart(2, '0');
                let time = `${formattedHours}:${formattedMinutes} ${ampm}`;

                let a = document.createElement('div');
                a.className = 'chatEntry';

                let timeSpan = document.createElement('span');
                timeSpan.style.color = 'rgba(255, 255, 255, 0.5)';
                timeSpan.innerText = `${time}`;
                a.appendChild(timeSpan);

                let namething = document.createElement('span');
                namething.style.color = v;
                namething.innerText = ' ' + d;
                a.appendChild(namething);

                let chatSpan = document.createElement('span');
                chatSpan.style.color = c;
                chatSpan.innerText = ' ' + e;
                a.appendChild(chatSpan);

                chatLogs.appendChild(a);
                chatLogs.scrollTop = chatLogs.scrollHeight;
            }
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
            HTML.startDiv({ id: "happymod", class: "sizing" }, (html) => {
                html.add(`Ping: `);
                HTML.addDiv({ id: "pingFps", class: "mod", appendID: "happymod" }, (html) => {
                });
                html.newLine();
                html.add(`Packet: `);
                HTML.addDiv({ id: "packetStatus", class: "mod", appendID: "happymod" }, (html) => {
                    html.add("None");
                });
            });
            let openMenu = false;
            let WS = undefined;
            let socketID = undefined;
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
            setInterval(() => {
                secPacket = 0;
            }, 1000);
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
                    let profanity = ["cunt", "whore", "fuck", "shit", "faggot", "nigger", "nigga", "dick", "vagina", "minge", "cock", "rape", "cum", "sex", "tits", "penis", "clit", "pussy", "meatcurtain", "jizz", "prune", "douche", "wanker", "damn", "bitch", "dick", "fag", "bastard"];
                            let tmpString;
                            // FIX CHAT:
                            data[0] = data[0].slice(0, 30);
                        }
                    } else if (type == "L") {
                        // MAKE SAME CLAN:
                        data[0] = data[0] + (String.fromCharCode(0).repeat(7));
                        data[0] = data[0].slice(0, 7);
                    } else if (type == "M") {
                        // APPLY CYAN COLOR:
                        let checkrespawn = 0;
                        checkrespawn =+ 1;
                        data[0].name = (data[0].name == "" ? "unknown" : data[0].name);
                        data[0].moofoll = true;
                        data[0].skin = data[0].skin == 10 ? "__proto__" : ([0,1,2,3,5,6,7,8,9].includes(data[0].skin) ? 4 : data[0].skin);
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
                                player.randDIff = Math.random * Math.PI * 2;
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
                    //Z: serverShutdownNotice,
                    //0: addAlliance,
                    //1: deleteAlliance,
                    2: allianceNotification,
                    3: setPlayerTeam,
                    4: setAlliancePlayers,
                    5: updateStoreItems,
                    6: receiveChat,
                    7: updateMinimap,
                    8: showText,
                    9: pingMap,
                    0: pingSocketResponse,
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
            let allChats = [];
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
            //let perfectReplace = [];
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
            let maxScreenWidth = config.maxScreenWidth;
            let maxScreenHeight = config.maxScreenHeight;
            if (getEl("visualType").value == "smiley") {
                maxScreenHeight = config.maxScreenHeight * 1;
                maxScreenWidth = config.maxScreenWidth * 1;
            } else {
                maxScreenHeight = config.maxScreenHeight;
                maxScreenWidth = config.maxScreenWidth;
            }
            function zoomVision() {
                if (maxScreenWidth != config.maxScreenWidth * 1 || maxScreenHeight != config.maxScreenHeight * 1.5) {
                    maxScreenWidth = config.maxScreenWidth * 1;
                    maxScreenHeight = config.maxScreenHeight * 1;
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
            function resetMoveDir() {
                keys = {};
                io.send("e");
            }
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
                    resetMoveDir();
                }
            };
            let placeVisible = [];
            let profanityList = ["cunt", "whore", "fuck", "shit", "faggot", "nigger",
                                 "nigga", "dick", "vagina", "minge", "cock", "rape", "cum", "sex",
                                 "tits", "penis", "clit", "pussy", "meatcurtain", "jizz", "prune",
                                 "douche", "wanker", "damn", "bitch", "dick", "fag", "bastard"];
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
                        let fixs = [
                            { num: 1e3, string: "k" },
                            { num: 1e6, string: "m" },
                            { num: 1e9, string: "b" },
                            { num: 1e12, string: "q" }
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
                    };

                    // UPDATE:
                    this.update = function(delta) {
                        if (this.life) {
                            this.life -= delta;
                            this.y -= this.speed * delta;
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
                        ctxt.fillStyle = this.color;
                        ctxt.font = this.scale + "px Hammersmith One";
                        ctxt.fillText(this.text, this.x - xOff, this.y - yOff);
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
                        this.dir = dir + Math.PI;
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
                        this.healthMov = 100;
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
                        if (this.health != this.healthMov) {
                            this.health < this.healthMov ? (this.healthMov -= 1.9) : (this.healthMov += 1.9);
                            if (Math.abs(this.health - this.healthMov) < 1.9) this.healthMov = this.health;
                        };
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
                            return [0, 1, 2].includes(id) ? 0 :
                            [3, 4, 5].includes(id) ? 1 :
                            [6, 7, 8, 9].includes(id) ? 2 :
                            [10, 11, 12].includes(id) ? 3 :
                            [13, 14].includes(id) ? 5 :
                            [15, 16].includes(id) ? 4 :
                            [17, 18, 19, 21, 22].includes(id) ?
                                [13, 14].includes(myItems) ? 6 :
                            5 :
                            id == 20 ?
                                [13, 14].includes(myItems) ? 7 :
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
                        // if (config.anotherVisual) {
                        // } else {
                        //     obj.alive = false;
                        // }
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
                    this.randDIff = Math.random * Math.PI * 2;
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
                        this.maxShameCount = 0;
                        this.deathDir = Math.random() * Math.PI * 2;
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
                        this.antiTimer = 4;
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
                        if (this.alive) {
                            if (this.health != this.healthMov) {
                                this.health < this.healthMov ? (this.healthMov -= 2) : (this.healthMov += 2);
                                if (Math.abs(this.health - this.healthMov) < 2) this.healthMov = this.health;
                            };
                            if (this.shameCount != this.shameMov) this.shameCount < this.shameMov ? (this.shameMov -= .1) : (this.shameMov += .1), Math.abs(this.shameCount - this.shameMov) < .1 && (this.shameMov = this.shameCount);
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
                        return dx <= (config.maxScreenWidth / 1) * 1 && dy <= (config.maxScreenHeight / 1) * 1;
                    };
                    // SHAME SYSTEM:
                    this.judgeShame = function() {
                        if (this.oldHealth < this.health) {
                            if (this.hitTime) {
                                let timeSinceHit = Date.now() - this.hitTime;
                                this.lastHit = game.tick;
                                this.hitTime = 0;
                                if (timeSinceHit < 120) {
                                    this.shameCount++;
                                } else {
                                    this.shameCount = Math.max(0, this.shameCount - 2);
                                }
                            }
                        } else if (this.oldHealth > this.health) {
                            this.hitTime = Date.now();
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
                                            io.send("6", "Grinding...")
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
                                    // Hat / Gear:
                      function Hg(e, t){
                         buyEquip(e, 0);
                         buyEquip(t, 1);
                        }
            // AntiOneTicked:
            function antiOneTick(){
                let e = near;
                let n = (Math.hypot(player.y2 - e.y2, player.x2 - e.x2) <= 395 && Math.hypot(player.y2 - e.y2, player.x2 - e.x2) >= 370 && e.speed <= 20);
                let t = (e.weaponIndex == 5 && [2, 3].includes(e.weaponVariant) && near.reloads[near.weapons[0]].done && near.reloads[near.weapons[1]].done && e.reloads[53] == 2200 && n);
                t ? (Hg(22, 21)) : (t = gameObjects.find(c => c.active && c.id == 16 && c.owner.sid == e.sid && Math.hypot(c.y - e.y2, c.x - e.x2) <= c.scale + 80), n && t && [9, 12, 13].includes(e.weaponIndex) && e.reloads[0].done && e.reloads[0].id == 5 && [2, 3].includes(e.reloads[0].rarity) && !e.reloads[1].done && e.skinIndex != 53 && (Hg(6, 21)));
            };
            function antiSecondaries(){
                let r = items.weapons[near.weaponIndex];
                if(near.dist2 < 280 && player.weapons[0] == 5 && player.weapons[1] == 10 || player.weapons[1] == 9 || player.weapons[1] == 12 || player.weapons[1] == 15){
                    antiOneTick()//anti 1 frame
                    sendChat("ur gay!");
                } else if(near.dist2 < 220 && player.weapons[0] == 4 && player.weapons[1] == 10 || player.weapons[1] == 9){
                    antiOneTick(); //anti 2 frames if they have katana
                    sendChat("ur got katana in ass niger");
                }
            }

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
                                        //setTimeout(()=>{
                                        packet("c", 1, id, 0);
                                        //setTimeout(()=>{
                                        packet("c", 0, id, 0);
                                        //}, 120);
                                        //}, 120);
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
                        if (getEl("visualType").value == "ae" && (id != 11 && id != 0)) {
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
                                        // setTimeout(()=>{
                                        packet("c", 0, id, 1);
                                        //}, 120);
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
            function toRadian(angle) {
                let fixedAngle = (angle % 360) * (Math.PI / 180);
                return fixedAngle < 0 ? (2 * Math.PI + fixedAngle) : fixedAngle;
            }

            // PLACER:
            function place(id, rad, rmd) {
                try {
                    if (id == undefined) return;
                    let item = items.list[player.items[id]];
                    let tmpS = player.scale + item.scale + (item.placeOffset || 0);
                    let tmpX = player.x2 + tmpS * Math.cos(rad);
                    let tmpY = player.y2 + tmpS * Math.sin(rad);
                    if (id === 0 || testMode || (player.alive && inGame && player.itemCounts[item.group.id] == undefined ? true : player.itemCounts[item.group.id] < (config.isSandbox ? id === 3 || id === 5 ? 299 : 99 : item.group.limit ? item.group.limit : 99))) {
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
                } catch (e) { }
            }

            function getDist(e, t) {
                try {
                    return Math.hypot((t.y2 || t.y) - (e.y2 || e.y), (t.x2 || t.x) - (e.x2 || e.x));
                } catch (e) {
                    return Infinity;
                }
            }
            // GET DIRECTION
            function getDir(e, t) {
                try {
                    return Math.atan2((t.y2 || t.y) - (e.y2 || e.y), (t.x2 || t.x) - (e.x2 || e.x));
                } catch (e) {
                    return 0;
                }
            }

            function sortFromSmallest(arr, func) { // dist - dist
                func = typeof func == "function" ? func : (obj) => {
                    return obj
                };
                return arr.sort((two, one) => (func(two)) - func(one));
            }
            // tmpList = objectManager.getGridArrays(user.x2, user.y2, 500);
            //                 for (var x = 0; x < tmpList.length; ++x) {
            //                     for (var y = 0; y < tmpList[x].length; ++y) {
            //                         if (tmpList[x][y].active && getDist(player, tmpList[x][y]))
            //                     }
            //                 }
            function getCloseBuildings() {
                let buildings = [];
                let addedBefore = {};
                let filteredBuildings = objectManager.getGridArrays(player.x, player.y, 200);
                //console.log(filteredBuildings);
                for (var x = 0; x < filteredBuildings.length; ++x) {
                    for (var y = 0; y < filteredBuildings[x].length; ++y) {
                        if (filteredBuildings[x][y].active) {
                            buildings.push(filteredBuildings[x][y]);
                        }
                    }
                }
                //console.log(buildings);
                return buildings;
            }
            function quadSpikeBreak(user, item) {
                try {
                    let angles = [];
                    let possibleOnes = [];
                    for (let angle = 0; angle < 72; angle++) {
                        angles.push(toRadian(angle * 5));
                    }
                    let buildings_ = sortFromSmallest(gameObjects.filter(t => t.active && t.sid != player.inTrap.sid && getDist(player, t) <= 150), (a)=>{
                        return getDist(player, a);
                    });
                    let last = null;
                    for (let angle of angles) {
                        let position = player.buildItemPosition(item, angle);
                        let possibleToPlace = true;
                        if (18 != item.id && position.y >= config.mapScale / 2 - config.riverWidth / 2 && position.y <= config.mapScale / 2 + config.riverWidth / 2) {
                            possibleToPlace = false;
                        } else if(last && getDist(last, position) < item.scale + (last.blocker ? last.blocker : last.getScale(0.6, last.isItem))){
                            possibleToPlace = false;
                        } else {
                            for (let building of buildings_) {
                                let range = building.blocker ? building.blocker : building.getScale(0.6, building.isItem);
                                if (getDist(building, position) < item.scale + range) { // overlap
                                    possibleToPlace = false;
                                    last = building;
                                    break;
                                }
                            }
                        }
                        if (possibleToPlace) {
                            possibleOnes.push(angle);
                        }
                    }
                    return possibleOnes;
                } catch (e) {
                    //console.log(e);
                }
            }
            function getPlaceablePositions(user, item) {
                try {
                    let angles = [];
                    let possibleOnes = [];
                    for (let angle = 0; angle < 72; angle++) {
                        angles.push(toRadian(angle * 5));
                    }
                    let buildings_ = [];
                    if (!window.isMohMoh) {
                        buildings_ = sortFromSmallest(gameObjects.filter(t => t.active && getDist(player, t) <= 150), (a)=>{
                            return getDist(player, a);
                        });
                    }
                    let last = null;
                    for (let angle of angles) {
                        let position = player.buildItemPosition(item, angle);
                        let possibleToPlace = true;
                        if (18 != item.id && position.y >= config.mapScale / 2 - config.riverWidth / 2 && position.y <= config.mapScale / 2 + config.riverWidth / 2) {
                            possibleToPlace = false;
                        } else if(last && getDist(last, position) < item.scale + (last.blocker ? last.blocker : last.getScale(0.6, last.isItem))){
                            possibleToPlace = false;
                        } else if (true) {
                            for (let building of buildings_) {
                                let range = building.blocker ? building.blocker : building.getScale(0.6, building.isItem);
                                if (getDist(building, position) < item.scale + range) { // overlap
                                    possibleToPlace = false;
                                    last = building;
                                    break;
                                }
                            }
                        }
                        if (possibleToPlace) {
                            possibleOnes.push(angle);
                        }
                    }
                    return possibleOnes;
                } catch (e) {
                }
            }
            let firstCheckPlaceForntiBUg = false;
            function simplePlace(id, radian) {
                checkPlace(id, radian);
            };


            function checkPlace(id, rad) {
                try {
                    if (secPacket.count >= 80) return;
                    let item = items.list[player.items[id]];
                    let tmpS = player.scale + item.scale + (item.placeOffset || 0);
                    let tmpX = player.x2 + tmpS * Math.cos(rad);
                    let tmpY = player.y2 + tmpS * Math.sin(rad);
                    if (objectManager.checkItemLocation(tmpX, tmpY, item.scale, 0.6, item.id, false, player)) {
                        place(id, rad, 1);
                    }
                } catch (e) {}
            }
            // HEALINGF:
function soldierMult() {
    return player.latestSkin == 6 ? 0.75 : 1;
}

function healthBased() {
    sendChat("Happy healing!");
    if (player.health === 100) {
        return 0;
    }
    if (player.skinIndex !== 45 && player.skinIndex !== 56) {
        const currentItem = items.list[player.items[0]];
        if (currentItem && currentItem.healing) {
            const remainingHealth = 100 - player.health;
            const itemsNeeded = Math.ceil(remainingHealth / currentItem.healing);
            return itemsNeeded;
        } else {
            console.error("Item data missing or invalid for player's current item.");
            return -1;
        }
    }
    return 0;
}

function getAttacker(damaged) {
    sendChat("❄️Frozen healing!");
    let attackers = enemy.filter(tmp => {
        let rule = {
            three: tmp.attacked
        }
        return rule.three;
    });
    return attackers;
}

function healer() {
    sendChat("❄️Frozen healing!");
    for (let i = 0; i < healthBased(); i++) {
        place(0, getAttackDir());
    }
}
function healer33() {
    sendChat("❄️Frozen healing!");
    for (let i = 0; i < healthBased(); i++) {
        place(0, getAttackDir());
    }
}
function healer1() {
    sendChat("❄️Frozen healing!");
    place(0, getAttackDir());
    return Math.ceil((100 - player.health) / items.list[player.items[0]].healing);
}

function noshameheal() {
    sendChat("❄️Frozen healing!");
    place(0, getAttackDir());
    if (player.shameCount >= 5) {
        place(0, getAttackDir());
        healer33();
    } else {
        if (player.skinIndex != 6 && player.skinIndex != 22) {
            healer33();
            buyEquip(6, 0);
        } else {
            const neededHealing = Math.ceil((100 - player.health) / items.list[player.items[0]].healing);
            healer33();
            return neededHealing;
        }
    }
}

            // LATER:
            function predictHeal() { }
            function antiSyncHealing(timearg) {
                sendChat("Fucking suncers!");
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
            const placedSpikePositions = new Set();
            const placedTrapPositions = new Set();
            function isPositionValid(position) {
                const playerX = player.x2;
                const playerY = player.y2;
                const distToPosition = Math.hypot(position[0] - playerX, position[1] - playerY);
                return distToPosition > 35;
            }
            function findAllianceBySid(sid) {
                return player.team ? alliancePlayers.find((THIS) => THIS === sid) : null;
            }
            function calculatePossibleTrapPositions(x, y, radius) {
                const trapPositions = [];
                const numPositions = 16;
                for (let i = 0; i < numPositions; i++) {
                    const angle = (2 * Math.PI * i) / numPositions;
                    const offsetX = x + radius * Math.cos(angle);
                    const offsetY = y + radius * Math.sin(angle);
                    const position = [offsetX, offsetY];
                    if (!trapPositions.some((pos) => isPositionTooClose(position, pos))) {
                        trapPositions.push(position);
                    }
                }
                return trapPositions;
            }
            function isPositionTooClose(position1, position2, minDistance = 50) {
                const dist = Math.hypot(position1[0] - position2[0], position1[1] - position2[1]);
                return dist < minDistance;
            }
    function biomeGear(mover, returns) {
        if (player.y2 >= config.mapScale / 2 - config.riverWidth / 2 && player.y2 <= config.mapScale / 2 + config.riverWidth / 2) {
            if (returns) return 31;
            buyEquip(31, 0);
        } else {
            if (player.y2 <= config.snowBiomeTop) {
                if (returns) return mover && player.moveDir == undefined ? 6 : 6;
                buyEquip(mover && player.moveDir == undefined ? 6 : 6, 0);
            } else {
                if (returns) return mover && player.moveDir == undefined ? 6 : 6;
                buyEquip(mover && player.moveDir == undefined ? 6 : 6, 0);
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
                                if (item.id != 18 && tmpY >= config.mapScale / 2 - config.riverWidth / 2 && tmpY <= config.mapScale / 2 + config.riverWidth / 2) continue;
                                if ((!replacer && yaboi) || getEl("visualType").value == "smiley") {
                                    if (yaboi.inTrap) {
                                        if (UTILS.getAngleDist(near.aim2 + Math.PI, relAim + Math.PI) <= Math.PI) {
                                            place(4, relAim, 1);
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
                                    player.chat.message = "Anti SpikeTick " + near.sid;
                                    player.chat.count = 2000;
                                    return true;
                                }
                            }
                        } catch (err) {
                            return null;
                        }
                        return false;
                    }
					this.protect = function(aim, trap) {
						if (!configs.antiTrap) return;
						if (player.items[4]) {
							this.testCanPlace(4, -(Math.PI / 2), (Math.PI / 2), (Math.PI / 18), aim + Math.PI);
							this.antiTrapped = true;
						} else {
							this.testCanPlace(2, -(Math.PI / 2), (Math.PI / 2), (Math.PI / 18), aim + Math.PI);
							this.antiTrapped = true;
						}
					};
        this.autoPlace = function() {
            if (enemy.length && configs.autoPlace && !instaC.ticking) {
                let nearTrap = gameObjects.find(obj => obj.trap && obj.active && obj.isTeamObject(player) && UTILS.getDist(obj, near, 0, 2) <= near.scale + obj.getScale() + 5);
                let nearDistance = UTILS.getDist(player, near, 0, 2);

                if (nearTrap && nearDistance <= 375) {
                    let safePlacement = nearDistance <= 200;
                    if (safePlacement) {
                        this.testCanPlace(4, 0, Math.PI * 2, Math.PI / 24, near.aim2, 0, { inTrap: true });
                    } else if (player.items[4] === 15) {
                        this.testCanPlace(4, 0, Math.PI * 2, Math.PI / 24, near.aim2);
                    }
                } else if (nearDistance <= 400 && player.items[4] === 15) {
                    this.testCanPlace(4, 0, Math.PI * 2, Math.PI / 24, near.aim2);
                }
            }
        };
                    function calculatePerfectAngle(x1, y1, x2, y2) {
                        return Math.atan2(y2 - y1, x2 - x1);
                    }
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
                    this.isCounter = false;
                    this.isAntiCounter = false;
                    this.canCounter = false;
                    this.revTick = false;
                    this.syncHit = false;
                    this.changeType = function(type) {
                        this.wait = false;
                        this.isTrue = true;
                        my.autoAim = true;

                        // Hat / Gear:
                      function Hg(e, t){
                         buyEquip(e, 0);
                         buyEquip(t, 1);
                        }
            const actions = {
                "rev": () => this.revInstakill(),
                "nobull": () => this.noBullInstakill(),
                "normal": () => this.normalInstakill(),
                "default": () => {
                    setTimeout(() => {
                        this.isTrue = false;
                        my.autoAim = false;
                    }, 50);
                }
            };

            (actions[type] || actions.default)();
        };

        this.revInstakill = function() {
            sendChat("reInstakill");
            healer1();
            selectWeapon(player.weapons[1]);
            buyEquip(53, 0);
            sendAutoGather();
            setTimeout(() => {
                selectWeapon(player.weapons[0]);
                buyEquip(7, 0);
                setTimeout(() => {
                    sendAutoGather();
                    this.isTrue = false;
                    my.autoAim = false;
            }, 70);
      }, 70);
        };

        this.noBullInstakill = function() {
            sendChat("noBullInstakill");
            selectWeapon(player.weapons[0]);
            healer1();
            buyEquip(7, 0);
            buyEquip(21, 1);
            sendAutoGather();
            setTimeout(() => {
                selectWeapon(player.weapons[1]);
                buyEquip(player.reloads[53] == 0 ? 53 : 6, 0);
                setTimeout(() => {
                    sendAutoGather();
                    this.isTrue = false;
                    my.autoAim = false;
            }, 70);
         }, 70);
        };

        this.normalInstakill = function() {
            sendChat("NormalInstakill");
            selectWeapon(player.weapons[0]);
            healer1();
            buyEquip(7, 0);
            buyEquip(21, 1);
            sendAutoGather();
            setTimeout(() => {
                selectWeapon(player.weapons[1]);
                buyEquip(player.reloads[53] == 0 ? 53 : 6, 0);
                setTimeout(() => {
                    sendAutoGather();
                    this.isTrue = false;
                    my.autoAim = false;
            }, 80);
         }, 80);
        };

            this.spikeTickType = function() {
                sendChat("SpikeTick!");
                this.isTrue = true;
                my.autoAim = true;
                selectWeapon(player.weapons[0]);
                buyEquip(7, 0);
                sendAutoGather();
                game.tickBase(() => {
                    buyEquip(53, 0);
                    selectWeapon(player.weapons[0]);
                    buyEquip(53, 0);
                            game.tickBase(() => {
                                sendAutoGather();
                                packet("F", 0, getSafeDir(), 1);
                                this.isTrue = false;
                                my.autoAim = false;
                                buyEquip(6, 0);
                                buyEquip(21, 1);
                            }, 2);
                        }, 1);
                    };
                    this.syncTry = function() {
                        io.send("6", "Pew");
                        if (player.weapons[1] == 15) {
                            this.isTrue = true;
                            my.autoAim = true;
                            game.tickBase(() => {
                                instaC.isTrue = true;
                                selectWeapon(player.weapons[1]);
                                buyEquip(53, 0);
                                buyEquip(0, 1);
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
        this.counterType = function() {
            this.isTrue = true;
            my.autoAim = true;
            my.revAim = true;
            selectWeapon(player.weapons[1]);
            buyEquip(53, 0);
            buyEquip(19, 1);
            sendAutoGather();
            packet("9", near.aim2, 1);
            game.tickBase(() => {
                my.revAim = false;
                selectWeapon(player.weapons[0]);
                buyEquip(7, 0);
                buyEquip(19, 1);
                packet("9", near.aim2, 1);
                game.tickBase(() => {
                    sendAutoGather();
                    this.isTrue = false;
                    my.autoAim = false;
                    packet("9", undefined, 1);
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
                            packet("9", undefined, 1);
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
                    this.OneTickType = function() {
                        io.send("6", "7113213.29154");
                        this.isTrue = true;
                        my.autoAim = true;
                        biomeGear();
                        buyEquip(19, 1);
                        packet("9", near.aim2, 1);
                        game.tickBase(() => {
                            if (player.weapons[1] == 15) {
                                my.revAim = true;
                            }
                            selectWeapon(player.weapons[[9, 12, 13, 15].includes(player.weapons[1]) ? 1 : 0]);
                            buyEquip(53, 0);
                            buyEquip(19, 1);
                            if ([9, 12, 13, 15].includes(player.weapons[1])) {
                                sendAutoGather();
                            }
                            packet("9", near.aim2, 1);
                            game.tickBase(() => {
                                my.revAim = false;
                                selectWeapon(player.weapons[0]);
                                buyEquip(7, 0);
                                buyEquip(19, 1);
                                if (![9, 12, 13, 15].includes(player.weapons[1])) {
                                    sendAutoGather();
                                }
                                packet("9", near.aim2, 1);
                                game.tickBase(() => {
                                    sendAutoGather();
                                    this.isTrue = false;
                                    my.autoAim = false;
                                    packet("9", undefined, 1);
                                }, 2);
                            }, 1);
                        }, 1);
                    };
                    this.threeOneTickType = function() {
                        this.isTrue = true;
                        my.autoAim = true;
                        selectWeapon(player.weapons[[10, 14].includes(player.weapons[1]) ? 1 : 0]);
                        biomeGear();
                        buyEquip(11, 1);
                        packet("9", near.aim2, 1);
                        game.tickBase(() => {
                            selectWeapon(player.weapons[[10, 14].includes(player.weapons[1]) ? 1 : 0]);
                            buyEquip(53, 0);
                            buyEquip(11, 1);
                            packet("9", near.aim2, 1);
                            game.tickBase(() => {
                                selectWeapon(player.weapons[0]);
                                buyEquip(7, 0);
                                buyEquip(16, 1);
                                sendAutoGather();
                                packet("9", near.aim2, 1);
                                game.tickBase(() => {
                                    sendAutoGather();
                                    this.isTrue = false;
                                    my.autoAim = false;
                                    packet("9", undefined, 1);
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
                        packet("9", near.aim2, 1);
                        game.tickBase(() => {
                            my.revAim = false;
                            selectWeapon(player.weapons[0]);
                            buyEquip(7, 0);
                            buyEquip(16, 1);
                            packet("9", near.aim2, 1);
                            game.tickBase(() => {
                                sendAutoGather();
                                this.isTrue = false;
                                my.autoAim = false;
                                packet("9", undefined, 1);
                            }, 1);
                        }, 1);
                    };
                    this.boostTickType = function() {
                        /*this.isTrue = true;
            my.autoAim = true;
            selectWeapon(player.weapons[0]);
            buyEquip(53, 0);
            buyEquip(11, 1);
            packet("33", near.aim2);
            game.tickBase(() => {
                place(4, near.aim2);
                selectWeapon(player.weapons[1]);
                biomeGear();
                buyEquip(11, 1);
                sendAutoGather();
                packet("33", near.aim2);
                game.tickBase(() => {
                    selectWeapon(player.weapons[0]);
                    buyEquip(7, 0);
                    buyEquip(19, 1);
                    packet("33", near.aim2);
                    game.tickBase(() => {
                        sendAutoGather();
                        this.isTrue = false;
                        my.autoAim = false;
                        packet("33", undefined);
                    }, 1);
                }, 1);
            }, 1);*/
                        this.isTrue = true;
                        my.autoAim = true;
                        biomeGear();
                        buyEquip(11, 1);
                        packet("9", near.aim2, 1);
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
                            packet("9", near.aim2, 1);
                            place(4, near.aim2);
                            game.tickBase(() => {
                                my.revAim = false;
                                selectWeapon(player.weapons[0]);
                                buyEquip(7, 0);
                                buyEquip(16, 1);
                                if (![9, 12, 13, 15].includes(player.weapons[1])) {
                                    sendAutoGather();
                                }
                                packet("9", near.aim2, 1);
                                game.tickBase(() => {
                                    sendAutoGather();
                                    this.isTrue = false;
                                    my.autoAim = false;
                                    packet("9", undefined, 1);
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
                                                bQ(16, 1);
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
                                                bQ(16, 1);
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
                                packet("9", moveMent.dir, 1);
                            }
                        } else {
                            packet("9", moveMent.dir, 1);
                        }
                    },
                        this.testMovement = function () {
                        let move1 = this.gotoGoal(1440, 3);
                        if(move1.action) {
                            io.send("6", "test complete")
                        } else {
                            packet("9", Number.MAX_VALUE)
                        }
                    },
                    this.tickMovement = function() {
                        let dist = player.weapons[1] == 9 ? 245 : 245;
                        let actionDist = player.weapons[1] == 9 ? 2 : player.weapons[1] == 12 ? 1.5 : player.weapons[1] == 13 ? 1 : player.weapons[1] == 15 ? 2 : 3;
                        let moveMent = this.gotoGoal(245, 3);
                        if (moveMent.action) {
                            if (player.reloads[53] == 0 && !this.isTrue) {
                                this.OneTickType();
                            } else {
                                packet("9", moveMent.dir, 1);
                            }
                        } else {
                            packet("9", moveMent.dir, 1);
                        }
                    }
                        this.kmTickMovement = function() {
                        let moveMent = this.gotoGoal(240, 3);
                        if (moveMent.action) {
                            if (near.skinIndex != 22 && player.reloads[53] == 0 && !this.isTrue && ((game.tick - near.poisonTick) % config.serverUpdateRate == 8)) {
                                this.kmTickType();
                            } else {
                                packet("9", moveMent.dir, 1);
                            }
                        } else {
                            packet("9", moveMent.dir, 1);
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
                                packet("9", moveMent.dir, 1);
                            }
                        } else {
                            packet("9", moveMent.dir, 1);
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
            let textManager = new Textmanager();
            let traps = new Traps(UTILS, items);
            let instaC = new Instakill();
            let autoBuy = new Autobuy([15, 31, 6, 7, 22, 12, 53, 20, 40], [11, 13, 16, 18, 21]);
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
                active: true,
                grid: 1440,
                scale: 40,
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
							if (configs.combatWarnings) {
								player.chat.message = "Bow Insta [ 2 ]";
								player.chat.count = 1500;
							}
                            if (!my.antiSync) {
								antiSyncHealing(4);
							}
                        } else {
                            if (projectileCount >= 2) {
                                place(1, tmpObj.aim2);
                                my.anti0Tick = 4;
								if (configs.combatWarnings) {
									player.chat.message = "Ranged Sync [ 5 ]";
									player.chat.count = 1500;
								}
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

                if (my.autoAim || (isNearPlayer() && clicks.left && player.reloads[player.weapons[0]] == 0)) {
                    lastDir = getEl("weaponGrind").checked ? getSafeDir() : enemy.length ? my.revAim ? (near.aim2 + Math.PI) : near.aim2 : getSafeDir();
                } else if (clicks.right && player.reloads[player.weapons[1] == 10 ? player.weapons[1] : player.weapons[0]] == 0) {
                    lastDir = getSafeDir();
                } else if (traps.inTrap && player.reloads[traps.notFast() ? player.weapons[1] : player.weapons[0]] == 0) {
                    lastDir = traps.aim;
                } else if (!player.lockDir) {
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
                if (menuChatDiv.style.display != "none") {
                    chatHolder.style.display = "none";
                    if (menuChatBox.value != "") {
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
                        } else if (keyNum == 222) {
                            instaC.testMovement();
                        } else if (keyNum == 82 && getEl("visualType").value == "ae") {
                            autos.insta.count = Math.floor(Math.random()*8);
                            if (autos.insta.count <= 0) {
                                autos.insta.todo = true;
                            }
                        } else if (keyNum == 67) {
                            updateMapMarker();
                        } else if (player.weapons[keyNum - 49] != undefined) {
                            player.weaponCode = player.weapons[keyNum - 49];
                        } else if (moveKeys[keyNum]) {
                            sendMoveDir();
                        } else if (event.key == "m") {
                            mills.placeSpawnPads = !mills.placeSpawnPads;
                            io.send("6", "")
                        } else if (event.key == "q") {
                            io.send("6", "")
                            setTimeout(() => {
                            io.send("6", "")
                                }, 1000);
                        } else if (event.key == "v") {
                            io.send("6", "")
                        } else if (event.key == "f") {
                            io.send("6", "")
                        } else if (event.key == "h") {
                            io.send("6", "")
                        } else if (event.key == "y") {
                            io.send("6", "")
                        } else if (event.key == "z") {
                            mills.place = !mills.place;
                        } else if (event.key == "Z") {
                            typeof window.debug == "function" && window.debug();
                        } else if (keyNum == 32) {
                            packet("F", 1, getSafeDir(), 1);
                            packet("F", 0, getSafeDir(), 1);
                        } else if (event.key == ",") {
                            player.sync = true;
                            io.send("6", "")
                        }
                    }
                }
            }
            addEventListener("keydown", UTILS.checkTrusted(keyDown));
            function keyUp(event) {
                if (player && player.alive) {
                    let keyNum = event.which || event.keyCode || 0;
                    if (keyNum == 13) {
                        // toggleMenuChat();
                    } else if (keysActive()) {
                        if (keys[keyNum]) {
                            keys[keyNum] = 0;
                            macro[event.key] = 0;
                            if (moveKeys[keyNum]) {
                                sendMoveDir();
                            } else if (event.key == ",") {
                                player.sync = false;
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
                        packet("9", newMoveDir, 1);
                    }
                    lastMoveDir = newMoveDir;
                    player.randDIff = Math.random * Math.PI * 2;
                }
            }
            var enterGameButton = getEl("enterGame");
            // BUTTON EVENTS:
            function bindEvents() {
                enterGameButton.onclick = UTILS.checkTrusted(function() {
                // START GAME:
                enterGame();
            });
            }
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
            function toFancyTimeFormat(time) {
                let minutes = ~~((time % 3600) / 60);
                let seconds = ~~time % 60;
                if (seconds <= 9) seconds = `0${seconds}`;
                return `${minutes}:${seconds}`;
            }




            let cSp = false;
          //   if(document.getElementById("songy").value == 1 && player && !cSp) {
          //       cH();
          //       cSp = true;
          //       io.send("6", "started");
          //   }

            //LMFAO QUASAR SONGS WHY SO BIG
            function sn(m) {
                sendChat(m);
            }
           //  setInterval(() => {
            //     console.log(document.activeElement.id.toLowerCase());
          //   }, 0);

          //   if(player)
           //      setInterval(() => {
           //          sn("aaa");
          //       }, 250);
            function cH(){
                if(cSp && document.activeElement.id.toLowerCase() !== 'chatbox'){
                    setTimeout(()=>{
                        if(cSp && document.activeElement.id.toLowerCase() !== 'chatbox'){
                            sn("We at the top again, now what?");
                        }else{
                            return;
                        }
                    }, 16000);
                    setTimeout(()=>{
                        if(cSp && document.activeElement.id.toLowerCase() !== 'chatbox'){
                            sn("Heavy lay the crown, but");
                        }else{
                            return;
                        }
                    }, 18000);
                    setTimeout(()=>{
                        if(cSp && document.activeElement.id.toLowerCase() !== 'chatbox'){
                            sn("Count us");
                        }else{
                            return;
                        }
                    }, 20000);
                    setTimeout(()=>{
                        if(cSp && document.activeElement.id.toLowerCase() !== 'chatbox'){
                            sn("Higher than the mountain");
                        }else{
                            return;
                        }
                    }, 21000);
                    setTimeout(()=>{
                        if(cSp && document.activeElement.id.toLowerCase() !== 'chatbox'){
                            sn("And we be up here");
                        }else{
                            return;
                        }
                    }, 23000);
                    setTimeout(()=>{
                        if(cSp && document.activeElement.id.toLowerCase() !== 'chatbox'){
                            sn("for the long run");
                        }else{
                            return;
                        }
                    }, 24000);
                    setTimeout(()=>{
                        if(cSp && document.activeElement.id.toLowerCase() !== 'chatbox'){
                            sn("Strap in for a long one");
                        }else{
                            return;
                        }
                    }, 25000);
                    setTimeout(()=>{
                        if(cSp && document.activeElement.id.toLowerCase() !== 'chatbox'){
                            sn("We got everybody on one");
                        }else{
                            return;
                        }
                    }, 27000);
                    setTimeout(()=>{
                        if(cSp && document.activeElement.id.toLowerCase() !== 'chatbox'){
                            sn("Now you're coming at the king");
                        }else{
                            return;
                        }
                    }, 29000);
                    setTimeout(()=>{
                        if(cSp && document.activeElement.id.toLowerCase() !== 'chatbox'){
                            sn("so you better not miss");
                        }else{
                            return;
                        }
                    }, 31000);
                    setTimeout(()=>{
                        if(cSp && document.activeElement.id.toLowerCase() !== 'chatbox'){
                            sn("And we only get stronger");
                        }else{
                            return;
                        }
                    }, 33000);
                    setTimeout(()=>{
                        if(cSp && document.activeElement.id.toLowerCase() !== 'chatbox'){
                            sn("With everthing I carry");
                        }else{
                            return;
                        }
                    }, 36000);
                    setTimeout(()=>{
                        if(cSp && document.activeElement.id.toLowerCase() !== 'chatbox'){
                            sn("up on my back");
                        }else{
                            return;
                        }
                    }, 37000);
                    setTimeout(()=>{
                        if(cSp && document.activeElement.id.toLowerCase() !== 'chatbox'){
                            sn("you should paint it up");
                        }else{
                            return;
                        }
                    }, 39000);
                    setTimeout(()=>{
                        if(cSp && document.activeElement.id.toLowerCase() !== 'chatbox'){
                            sn("with a target");
                        }else{
                            return;
                        }
                    }, 41000);
                    setTimeout(()=>{
                        if(cSp && document.activeElement.id.toLowerCase() !== 'chatbox'){
                            sn("Why would you dare me to");
                        }else{
                            return;
                        }
                    }, 46000);
                    setTimeout(()=>{
                        if(cSp && document.activeElement.id.toLowerCase() !== 'chatbox'){
                            sn("do it again?");
                        }else{
                            return;
                        }
                    }, 47000);
                    setTimeout(()=>{
                        if(cSp && document.activeElement.id.toLowerCase() !== 'chatbox'){
                            sn("Come get your spoiler up ahead");
                        }else{
                            return;
                        }
                    }, 50000);
                    setTimeout(()=>{
                        if(cSp && document.activeElement.id.toLowerCase() !== 'chatbox'){
                            sn("We're taking over,");
                        }else{
                            return;
                        }
                    }, 53000);
                    setTimeout(()=>{
                        if(cSp && document.activeElement.id.toLowerCase() !== 'chatbox'){
                            sn("We're taking over");
                        }else{
                            return;
                        }
                    }, 56000);
                    setTimeout(()=>{
                        if(cSp && document.activeElement.id.toLowerCase() !== 'chatbox'){
                            sn("Look at you come at my name,");
                        }else{
                            return;
                        }
                    }, 61000);
                    setTimeout(()=>{
                        if(cSp && document.activeElement.id.toLowerCase() !== 'chatbox'){
                            sn("you 'oughta know by now,");
                        }else{
                            return;
                        }
                    }, 63000);
                    setTimeout(()=>{
                        if(cSp && document.activeElement.id.toLowerCase() !== 'chatbox'){
                            sn("That We're Taking Over,");
                        }else{
                            return;
                        }
                    }, 66000);
                    setTimeout(()=>{
                        if(cSp && document.activeElement.id.toLowerCase() !== 'chatbox'){
                            sn("We're Taking Over");
                        }else{
                            return;
                        }
                    }, 69000);
                    setTimeout(()=>{
                        if(cSp && document.activeElement.id.toLowerCase() !== 'chatbox'){
                            sn("Maybe you wonder what");
                        }else{
                            return;
                        }
                    }, 74000);
                    setTimeout(()=>{
                        if(cSp && document.activeElement.id.toLowerCase() !== 'chatbox'){
                            sn("you're futures gonna be, but");
                        }else{
                            return;
                        }
                    }, 75000);
                    setTimeout(()=>{
                        if(cSp && document.activeElement.id.toLowerCase() !== 'chatbox'){
                            sn("I got it all locked up");
                        }else{
                            return;
                        }
                    }, 77000);
                    setTimeout(()=>{
                        if(cSp && document.activeElement.id.toLowerCase() !== 'chatbox'){
                            sn("Take a lap, now");
                        }else{
                            return;
                        }
                    }, 93000);
                    setTimeout(()=>{
                        if(cSp && document.activeElement.id.toLowerCase() !== 'chatbox'){
                            sn("Don't be mad, now");
                        }else{
                            return;
                        }
                    }, 95000);
                    setTimeout(()=>{
                        if(cSp && document.activeElement.id.toLowerCase() !== 'chatbox'){
                            sn("Run it back, run it back,");
                        }else{
                            return;
                        }
                    }, 97000);
                    setTimeout(()=>{
                        if(cSp && document.activeElement.id.toLowerCase() !== 'chatbox'){
                            sn("run it back, now");
                        }else{
                            return;
                        }
                    }, 98000);
                    setTimeout(()=>{
                        if(cSp && document.activeElement.id.toLowerCase() !== 'chatbox'){
                            sn("I got bodies lining up,");
                        }else{
                            return;
                        }
                    }, 100000);
                    setTimeout(()=>{
                        if(cSp && document.activeElement.id.toLowerCase() !== 'chatbox'){
                            sn("think you're dreaming");
                        }else{
                            return;
                        }
                    }, 101000);
                    setTimeout(()=>{
                        if(cSp && document.activeElement.id.toLowerCase() !== 'chatbox'){
                            sn("of greatness?");
                        }else{
                            return;
                        }
                    }, 102000);
                    setTimeout(()=>{
                        if(cSp && document.activeElement.id.toLowerCase() !== 'chatbox'){
                            sn("Send you back home,");
                        }else{
                            return;
                        }
                    }, 103000);
                    setTimeout(()=>{
                        if(cSp && document.activeElement.id.toLowerCase() !== 'chatbox'){
                            sn("let you wake up");
                        }else{
                            return;
                        }
                    }, 105000);
                    setTimeout(()=>{
                        if(cSp && document.activeElement.id.toLowerCase() !== 'chatbox'){
                            sn("Why would you dare me to");
                        }else{
                            return;
                        }
                    }, 110000);
                    setTimeout(()=>{
                        if(cSp && document.activeElement.id.toLowerCase() !== 'chatbox'){
                            sn("do it again?");
                        }else{
                            return;
                        }
                    }, 111000);
                    setTimeout(()=>{
                        if(cSp && document.activeElement.id.toLowerCase() !== 'chatbox'){
                            sn("Come get your spoiler up ahead");
                        }else{
                            return;
                        }
                    }, 114000);
                    setTimeout(()=>{
                        if(cSp && document.activeElement.id.toLowerCase() !== 'chatbox'){
                            sn("We're taking over,");
                        }else{
                            return;
                        }
                    }, 117000);
                    setTimeout(()=>{
                        if(cSp && document.activeElement.id.toLowerCase() !== 'chatbox'){
                            sn("We're taking over");
                        }else{
                            return;
                        }
                    }, 120000);
                    setTimeout(()=>{
                        if(cSp && document.activeElement.id.toLowerCase() !== 'chatbox'){
                            sn("Look at you come at my name,");
                        }else{
                            return;
                        }
                    }, 125000);
                    setTimeout(()=>{
                        if(cSp && document.activeElement.id.toLowerCase() !== 'chatbox'){
                            sn("you 'oughta know by now,");
                        }else{
                            return;
                        }
                    }, 127000);
                    setTimeout(()=>{
                        if(cSp && document.activeElement.id.toLowerCase() !== 'chatbox'){
                            sn("That We're Taking Over,");
                        }else{
                            return;
                        }
                    }, 130000);
                    setTimeout(()=>{
                        if(cSp && document.activeElement.id.toLowerCase() !== 'chatbox'){
                            sn("We're Taking Over");
                        }else{
                            return;
                        }
                    }, 133000);
                    setTimeout(()=>{
                        if(cSp && document.activeElement.id.toLowerCase() !== 'chatbox'){
                            sn("Maybe you wonder what");
                        }else{
                            return;
                        }
                    }, 138000);
                    setTimeout(()=>{
                        if(cSp && document.activeElement.id.toLowerCase() !== 'chatbox'){
                            sn("you're futures gonna be, but");
                        }else{
                            return;
                        }
                    }, 140000);
                    setTimeout(()=>{
                        if(cSp && document.activeElement.id.toLowerCase() !== 'chatbox'){
                            sn("I got it all locked up");
                        }else{
                            return;
                        }
                    }, 141000);
                    setTimeout(()=>{
                        if(cSp && document.activeElement.id.toLowerCase() !== 'chatbox'){
                            sn("After all, what still exists");
                        }else{
                            return;
                        }
                    }, 157000);
                    setTimeout(()=>{
                        if(cSp && document.activeElement.id.toLowerCase() !== 'chatbox'){
                            sn("except for fights");
                        }else{
                            return;
                        }
                    }, 158000);
                    setTimeout(()=>{
                        if(cSp && document.activeElement.id.toLowerCase() !== 'chatbox'){
                            sn("Around me,");
                        }else{
                            return;
                        }
                    }, 160000);
                    setTimeout(()=>{
                        if(cSp && document.activeElement.id.toLowerCase() !== 'chatbox'){
                            sn("the keyboard is clicking,");
                        }else{
                            return;
                        }
                    }, 161000);
                    setTimeout(()=>{
                        if(cSp && document.activeElement.id.toLowerCase() !== 'chatbox'){
                            sn("the clock is ticking");
                        }else{
                            return;
                        }
                    }, 162000);
                    setTimeout(()=>{
                        if(cSp && document.activeElement.id.toLowerCase() !== 'chatbox'){
                            sn("Still not enough, let me");
                        }else{
                            return;
                        }
                    }, 164000);
                    setTimeout(()=>{
                        if(cSp && document.activeElement.id.toLowerCase() !== 'chatbox'){
                            sn("protect your persistence");
                        }else{
                            return;
                        }
                    }, 165000);
                    setTimeout(()=>{
                        if(cSp && document.activeElement.id.toLowerCase() !== 'chatbox'){
                            sn("Do not worry about the future");
                        }else{
                            return;
                        }
                    }, 166000);
                    setTimeout(()=>{
                        if(cSp && document.activeElement.id.toLowerCase() !== 'chatbox'){
                            sn("even if it's too late");
                        }else{
                            return;
                        }
                    }, 167000);
                    setTimeout(()=>{
                        if(cSp && document.activeElement.id.toLowerCase() !== 'chatbox'){
                            sn("Let out the fight,");
                        }else{
                            return;
                        }
                    }, 168000);
                    setTimeout(()=>{
                        if(cSp && document.activeElement.id.toLowerCase() !== 'chatbox'){
                            sn("right at this moment");
                        }else{
                            return;
                        }
                    }, 169000);
                    setTimeout(()=>{
                        if(cSp && document.activeElement.id.toLowerCase() !== 'chatbox'){
                            sn("I got the heart of lion");
                        }else{
                            return;
                        }
                    }, 170000);
                    setTimeout(()=>{
                        if(cSp && document.activeElement.id.toLowerCase() !== 'chatbox'){
                            sn("I know the higher you climbing");
                        }else{
                            return;
                        }
                    }, 171000);
                    setTimeout(()=>{
                        if(cSp && document.activeElement.id.toLowerCase() !== 'chatbox'){
                            sn("the harder you fall");
                        }else{
                            return;
                        }
                    }, 172000);
                    setTimeout(()=>{
                        if(cSp && document.activeElement.id.toLowerCase() !== 'chatbox'){
                            sn("I'm at the top of the mount");
                        }else{
                            return;
                        }
                    }, 173000);
                    setTimeout(()=>{
                        if(cSp && document.activeElement.id.toLowerCase() !== 'chatbox'){
                            sn("Too many bodies to count,");
                        }else{
                            return;
                        }
                    }, 174000);
                    setTimeout(()=>{
                        if(cSp && document.activeElement.id.toLowerCase() !== 'chatbox'){
                            sn("I've been through it all");
                        }else{
                            return;
                        }
                    }, 175000);
                    setTimeout(()=>{
                        if(cSp && document.activeElement.id.toLowerCase() !== 'chatbox'){
                            sn("I had to weather the storm");
                        }else{
                            return;
                        }
                    }, 176000);
                    setTimeout(()=>{
                        if(cSp && document.activeElement.id.toLowerCase() !== 'chatbox'){
                            sn("to get to level I'm on");
                        }else{
                            return;
                        }
                    }, 178000);
                    setTimeout(()=>{
                        if(cSp && document.activeElement.id.toLowerCase() !== 'chatbox'){
                            sn("That's how the legend was born");
                        }else{
                            return;
                        }
                    }, 179000);
                    setTimeout(()=>{
                        if(cSp && document.activeElement.id.toLowerCase() !== 'chatbox'){
                            sn("All of my enemies already dead");
                        }else{
                            return;
                        }
                    }, 180000);
                    setTimeout(()=>{
                        if(cSp && document.activeElement.id.toLowerCase() !== 'chatbox'){
                            sn("I'm bored, I'm ready for more");
                        }else{
                            return;
                        }
                    }, 182000);
                    setTimeout(()=>{
                        if(cSp && document.activeElement.id.toLowerCase() !== 'chatbox'){
                            sn("They know I'm ready for war");
                        }else{
                            return;
                        }
                    }, 183000);
                    setTimeout(()=>{
                        if(cSp && document.activeElement.id.toLowerCase() !== 'chatbox'){
                            sn("I told em");
                        }else{
                            return;
                        }
                    }, 184000);
                    setTimeout(()=>{
                        if(cSp && document.activeElement.id.toLowerCase() !== 'chatbox'){
                            sn("We're Taking Over,");
                        }else{
                            return;
                        }
                    }, 185000);
                    setTimeout(()=>{
                        if(cSp && document.activeElement.id.toLowerCase() !== 'chatbox'){
                            sn("We're Taking Over");
                        }else{
                            return;
                        }
                    }, 186000);
                    setTimeout(()=>{
                        if(cSp && document.activeElement.id.toLowerCase() !== 'chatbox'){
                            sn("Look at you come at my name,");
                        }else{
                            return;
                        }
                    }, 192000);
                    setTimeout(()=>{
                        if(cSp && document.activeElement.id.toLowerCase() !== 'chatbox'){
                            sn("you 'oughta know by now,");
                        }else{
                            return;
                        }
                    }, 194000);
                    setTimeout(()=>{
                        if(cSp && document.activeElement.id.toLowerCase() !== 'chatbox'){
                            sn("That We're Taking Over,");
                        }else{
                            return;
                        }
                    }, 197000);
                    setTimeout(()=>{
                        if(cSp && document.activeElement.id.toLowerCase() !== 'chatbox'){
                            sn("We're Taking Over");
                        }else{
                            return;
                        }
                    }, 200000);
                    setTimeout(()=>{
                        if(cSp && document.activeElement.id.toLowerCase() !== 'chatbox'){
                            sn("Maybe you wonder what");
                        }else{
                            return;
                        }
                    }, 205000);
                    setTimeout(()=>{
                        if(cSp && document.activeElement.id.toLowerCase() !== 'chatbox'){
                            sn("you're futures gonna be, but");
                        }else{
                            return;
                        }
                    }, 206000);
                    setTimeout(()=>{
                        if(cSp && document.activeElement.id.toLowerCase() !== 'chatbox'){
                            sn("I got it all locked up");
                        }else{
                            return;
                        }
                    }, 208000);
                }else{
                    return;
                }
            }
            function cH2(){
                if(cSp && document.activeElement.id.toLowerCase() !== 'chatbox'){
                    setTimeout(()=>{
                        if(cSp && document.activeElement.id.toLowerCase() !== 'chatbox'){
                            sn("I love you so much");
                        }else{
                            return;
                        }
                    }, 13000);
                    setTimeout(()=>{
                        if(cSp && document.activeElement.id.toLowerCase() !== 'chatbox'){
                            sn("I am a registered s*x offender");
                        }else{
                            return;
                        }
                    }, 16000);
                    setTimeout(()=>{
                        if(cSp && document.activeElement.id.toLowerCase() !== 'chatbox'){
                            sn("I stuck my d*ck into a blender");
                        }else{
                            return;
                        }
                    }, 18000);
                    setTimeout(()=>{
                        if(cSp && document.activeElement.id.toLowerCase() !== 'chatbox'){
                            sn("Your mom is a transgender");
                        }else{
                            return;
                        }
                    }, 20000);
                    setTimeout(()=>{
                        if(cSp && document.activeElement.id.toLowerCase() !== 'chatbox'){
                            sn("I am a professional");
                        }else{
                            return;
                        }
                    }, 22000);
                    setTimeout(()=>{
                        if(cSp && document.activeElement.id.toLowerCase() !== 'chatbox'){
                            sn("nude sender");
                        }else{
                            return;
                        }
                    }, 23000);
                    setTimeout(()=>{
                        if(cSp && document.activeElement.id.toLowerCase() !== 'chatbox'){
                            sn("You know that I be dominating");
                        }else{
                            return;
                        }
                    }, 24000);
                    setTimeout(()=>{
                        if(cSp && document.activeElement.id.toLowerCase() !== 'chatbox'){
                            sn("My c*ck and balls are rotating");
                        }else{
                            return;
                        }
                    }, 26000);
                    setTimeout(()=>{
                        if(cSp && document.activeElement.id.toLowerCase() !== 'chatbox'){
                            sn("Ice on my wrist,");
                        }else{
                            return;
                        }
                    }, 28000);
                    setTimeout(()=>{
                        if(cSp && document.activeElement.id.toLowerCase() !== 'chatbox'){
                            sn("I could go skating");
                        }else{
                            return;
                        }
                    }, 29000);
                    setTimeout(()=>{
                        if(cSp && document.activeElement.id.toLowerCase() !== 'chatbox'){
                            sn("Between thick thighs,");
                        }else{
                            return;
                        }
                    }, 30000);
                    setTimeout(()=>{
                        if(cSp && document.activeElement.id.toLowerCase() !== 'chatbox'){
                            sn("I'm suffocating");
                        }else{
                            return;
                        }
                    }, 31000);
                    setTimeout(()=>{
                        if(cSp && document.activeElement.id.toLowerCase() !== 'chatbox'){
                            sn("I have a huge f*cking c*ck");
                        }else{
                            return;
                        }
                    }, 32000);
                    setTimeout(()=>{
                        if(cSp && document.activeElement.id.toLowerCase() !== 'chatbox'){
                            sn("I nut inside of my sock");
                        }else{
                            return;
                        }
                    }, 34000);
                    setTimeout(()=>{
                        if(cSp && document.activeElement.id.toLowerCase() !== 'chatbox'){
                            sn("I walk around in crocks");
                        }else{
                            return;
                        }
                    }, 36000);
                    setTimeout(()=>{
                        if(cSp && document.activeElement.id.toLowerCase() !== 'chatbox'){
                            sn("While my d*ck is harder");
                        }else{
                            return;
                        }
                    }, 38000);
                    setTimeout(()=>{
                        if(cSp && document.activeElement.id.toLowerCase() !== 'chatbox'){
                            sn("than a rock");
                        }else{
                            return;
                        }
                    }, 39000);
                    setTimeout(()=>{
                        if(cSp && document.activeElement.id.toLowerCase() !== 'chatbox'){
                            sn("I f*ck b*tches in school");
                        }else{
                            return;
                        }
                    }, 40000);
                    setTimeout(()=>{
                        if(cSp && document.activeElement.id.toLowerCase() !== 'chatbox'){
                            sn("Cause you know");
                        }else{
                            return;
                        }
                    }, 42000);
                    setTimeout(()=>{
                        if(cSp && document.activeElement.id.toLowerCase() !== 'chatbox'){
                            sn("I'm fucking cool");
                        }else{
                            return;
                        }
                    }, 43000);
                    setTimeout(()=>{
                        if(cSp && document.activeElement.id.toLowerCase() !== 'chatbox'){
                            sn("I jump inside of my pool");
                        }else{
                            return;
                        }
                    }, 44000);
                    setTimeout(()=>{
                        if(cSp && document.activeElement.id.toLowerCase() !== 'chatbox'){
                            sn("I take a hit from juul");
                        }else{
                            return;
                        }
                    }, 46000);
                    setTimeout(()=>{
                        if(cSp && document.activeElement.id.toLowerCase() !== 'chatbox'){
                            sn("I don't actually smoke");
                        }else{
                            return;
                        }
                    }, 48000);
                    setTimeout(()=>{
                        if(cSp && document.activeElement.id.toLowerCase() !== 'chatbox'){
                            sn("But it'd make your b*tch choke");
                        }else{
                            return;
                        }
                    }, 50000);
                    setTimeout(()=>{
                        if(cSp && document.activeElement.id.toLowerCase() !== 'chatbox'){
                            sn("Once I give someone a stroke");
                        }else{
                            return;
                        }
                    }, 52000);
                    setTimeout(()=>{
                        if(cSp && document.activeElement.id.toLowerCase() !== 'chatbox'){
                            sn("My c*ck is hard like oak");
                        }else{
                            return;
                        }
                    }, 54000);
                    setTimeout(()=>{
                        if(cSp && document.activeElement.id.toLowerCase() !== 'chatbox'){
                            sn("You know I'm dropping fire");
                        }else{
                            return;
                        }
                    }, 56000);
                    setTimeout(()=>{
                        if(cSp && document.activeElement.id.toLowerCase() !== 'chatbox'){
                            sn("You could sing my songs");
                        }else{
                            return;
                        }
                    }, 58000);
                    setTimeout(()=>{
                        if(cSp && document.activeElement.id.toLowerCase() !== 'chatbox'){
                            sn("the the choir");
                        }else{
                            return;
                        }
                    }, 590000);
                    setTimeout(()=>{
                        if(cSp && document.activeElement.id.toLowerCase() !== 'chatbox'){
                            sn("They call me Quagmire");
                        }else{
                            return;
                        }
                    }, 60000);
                    setTimeout(()=>{
                        if(cSp && document.activeElement.id.toLowerCase() !== 'chatbox'){
                            sn("No they don't but");
                        }else{
                            return;
                        }
                    }, 62000);
                    setTimeout(()=>{
                        if(cSp && document.activeElement.id.toLowerCase() !== 'chatbox'){
                            sn("at least it rhymes");
                        }else{
                            return;
                        }
                    }, 63000);
                    setTimeout(()=>{
                        if(cSp && document.activeElement.id.toLowerCase() !== 'chatbox'){
                            sn("Ay!");
                        }else{
                            return;
                        }
                    }, 64000);
                    setTimeout(()=>{
                        if(cSp && document.activeElement.id.toLowerCase() !== 'chatbox'){
                            sn("Alright everyone,");
                        }else{
                            return;
                        }
                    }, 66000);
                    setTimeout(()=>{
                        if(cSp && document.activeElement.id.toLowerCase() !== 'chatbox'){
                            sn("sing along for this next part!");
                        }else{
                            return;
                        }
                    }, 67000);
                    setTimeout(()=>{
                        if(cSp && document.activeElement.id.toLowerCase() !== 'chatbox'){
                            sn("I nutted inside you mooo-ooom");
                        }else{
                            return;
                        }
                    }, 72000);
                    setTimeout(()=>{
                        if(cSp && document.activeElement.id.toLowerCase() !== 'chatbox'){
                            sn("Yeah!");
                        }else{
                            return;
                        }
                    }, 76000);
                    setTimeout(()=>{
                        if(cSp && document.activeElement.id.toLowerCase() !== 'chatbox'){
                            sn("Ay!");
                        }else{
                            return;
                        }
                    }, 78000);
                    setTimeout(()=>{
                        if(cSp && document.activeElement.id.toLowerCase() !== 'chatbox'){
                            sn("I nutted inside you mooo-ooom");
                        }else{
                            return;
                        }
                    }, 80000);
                    setTimeout(()=>{
                        if(cSp && document.activeElement.id.toLowerCase() !== 'chatbox'){
                            sn("Woooh!");
                        }else{
                            return;
                        }
                    }, 84000);
                    setTimeout(()=>{
                        if(cSp && document.activeElement.id.toLowerCase() !== 'chatbox'){
                            sn("Alright, here we go!");
                        }else{
                            return;
                        }
                    }, 86000);
                    setTimeout(()=>{
                        if(cSp && document.activeElement.id.toLowerCase() !== 'chatbox'){
                            sn("I love you so much");
                        }else{
                            return;
                        }
                    }, 93000);
                    setTimeout(()=>{
                        if(cSp && document.activeElement.id.toLowerCase() !== 'chatbox'){
                            sn("AY AY AY AY!");
                        }else{
                            return;
                        }
                    }, 94000);
                    setTimeout(()=>{
                        if(cSp && document.activeElement.id.toLowerCase() !== 'chatbox'){
                            sn("You know I love being a s*xist");
                        }else{
                            return;
                        }
                    }, 96000);
                    setTimeout(()=>{
                        if(cSp && document.activeElement.id.toLowerCase() !== 'chatbox'){
                            sn("I eat p*ssy for breakfast");
                        }else{
                            return;
                        }
                    }, 98000);
                    setTimeout(()=>{
                        if(cSp && document.activeElement.id.toLowerCase() !== 'chatbox'){
                            sn("Ice on my necklace");
                        }else{
                            return;
                        }
                    }, 100000);
                    setTimeout(()=>{
                        if(cSp && document.activeElement.id.toLowerCase() !== 'chatbox'){
                            sn("I had s*x with my dentist");
                        }else{
                            return;
                        }
                    }, 102000);
                    setTimeout(()=>{
                        if(cSp && document.activeElement.id.toLowerCase() !== 'chatbox'){
                            sn("My fanbase is getting bigger");
                        }else{
                            return;
                        }
                    }, 104000);
                    setTimeout(()=>{
                        if(cSp && document.activeElement.id.toLowerCase() !== 'chatbox'){
                            sn("Your hoe is a gold digger");
                        }else{
                            return;
                        }
                    }, 106000);
                    setTimeout(()=>{
                        if(cSp && document.activeElement.id.toLowerCase() !== 'chatbox'){
                            sn("I wear Tommy Hilfiger");
                        }else{
                            return;
                        }
                    }, 108000);
                    setTimeout(()=>{
                        if(cSp && document.activeElement.id.toLowerCase() !== 'chatbox'){
                            sn("While I pull on the trigger");
                        }else{
                            return;
                        }
                    }, 110000);
                    setTimeout(()=>{
                        if(cSp && document.activeElement.id.toLowerCase() !== 'chatbox'){
                            sn("Woah, woah, woah");
                        }else{
                            return;
                        }
                    }, 112000);
                    setTimeout(()=>{
                        if(cSp && document.activeElement.id.toLowerCase() !== 'chatbox'){
                            sn("that was risky");
                        }else{
                            return;
                        }
                    }, 113000);
                    setTimeout(()=>{
                        if(cSp && document.activeElement.id.toLowerCase() !== 'chatbox'){
                            sn("My b*tch just turned 60");
                        }else{
                            return;
                        }
                    }, 114000);
                    setTimeout(()=>{
                        if(cSp && document.activeElement.id.toLowerCase() !== 'chatbox'){
                            sn("She knows my c*m is sticky");
                        }else{
                            return;
                        }
                    }, 116000);
                    setTimeout(()=>{
                        if(cSp && document.activeElement.id.toLowerCase() !== 'chatbox'){
                            sn("But her p*ssy is squeaky");
                        }else{
                            return;
                        }
                    }, 118000);
                    setTimeout(()=>{
                        if(cSp && document.activeElement.id.toLowerCase() !== 'chatbox'){
                            sn("like Mickey");
                        }else{
                            return;
                        }
                    }, 119000);
                    setTimeout(()=>{
                        if(cSp && document.activeElement.id.toLowerCase() !== 'chatbox'){
                            sn("My lines are hotter");
                        }else{
                            return;
                        }
                    }, 120000);
                    setTimeout(()=>{
                        if(cSp && document.activeElement.id.toLowerCase() !== 'chatbox'){
                            sn("than the stars");
                        }else{
                            return;
                        }
                    }, 121000);
                    setTimeout(()=>{
                        if(cSp && document.activeElement.id.toLowerCase() !== 'chatbox'){
                            sn("When I'm dropping");
                        }else{
                            return;
                        }
                    }, 122000);
                    setTimeout(()=>{
                        if(cSp && document.activeElement.id.toLowerCase() !== 'chatbox'){
                            sn("these crazy bars");
                        }else{
                            return;
                        }
                    }, 123000);
                    setTimeout(()=>{
                        if(cSp && document.activeElement.id.toLowerCase() !== 'chatbox'){
                            sn("My c*m has filled jars");
                        }else{
                            return;
                        }
                    }, 124000);
                    setTimeout(()=>{
                        if(cSp && document.activeElement.id.toLowerCase() !== 'chatbox'){
                            sn("And stained so many cars");
                        }else{
                            return;
                        }
                    }, 126000);
                    setTimeout(()=>{
                        if(cSp && document.activeElement.id.toLowerCase() !== 'chatbox'){
                            sn("Ay");
                        }else{
                            return;
                        }
                    }, 129000);
                }else{
                    return;
                }
            }
            function cH3(){
                if(cSp && document.activeElement.id.toLowerCase() !== 'chatbox'){
                    setTimeout(()=>{
                        if(cSp && document.activeElement.id.toLowerCase() !== 'chatbox'){
                            sn("As a child you would wait");
                        }else{
                            return;
                        }
                    }, 6000);
                    setTimeout(()=>{
                        if(cSp && document.activeElement.id.toLowerCase() !== 'chatbox'){
                            sn("And watch from far away");
                        }else{
                            return;
                        }
                    }, 9000);
                    setTimeout(()=>{
                        if(cSp && document.activeElement.id.toLowerCase() !== 'chatbox'){
                            sn("But you always knew");
                        }else{
                            return;
                        }
                    }, 12000);
                    setTimeout(()=>{
                        if(cSp && document.activeElement.id.toLowerCase() !== 'chatbox'){
                            sn("that you'd be the one");
                        }else{
                            return;
                        }
                    }, 14000);
                    setTimeout(()=>{
                        if(cSp && document.activeElement.id.toLowerCase() !== 'chatbox'){
                            sn("That work while they all play");
                        }else{
                            return;
                        }
                    }, 15000);
                    setTimeout(()=>{
                        if(cSp && document.activeElement.id.toLowerCase() !== 'chatbox'){
                            sn("In youth you'd lay");
                        }else{
                            return;
                        }
                    }, 18000);
                    setTimeout(()=>{
                        if(cSp && document.activeElement.id.toLowerCase() !== 'chatbox'){
                            sn("Awake at night and scheme");
                        }else{
                            return;
                        }
                    }, 21000);
                    setTimeout(()=>{
                        if(cSp && document.activeElement.id.toLowerCase() !== 'chatbox'){
                            sn("Of all the things");
                        }else{
                            return;
                        }
                    }, 24000);
                    setTimeout(()=>{
                        if(cSp && document.activeElement.id.toLowerCase() !== 'chatbox'){
                            sn("that you would change");
                        }else{
                            return;
                        }
                    }, 26000);
                    setTimeout(()=>{
                        if(cSp && document.activeElement.id.toLowerCase() !== 'chatbox'){
                            sn("But it was just a dream");
                        }else{
                            return;
                        }
                    }, 27000);
                    setTimeout(()=>{
                        if(cSp && document.activeElement.id.toLowerCase() !== 'chatbox'){
                            sn("Here we are,");
                        }else{
                            return;
                        }
                    }, 31000);
                    setTimeout(()=>{
                        if(cSp && document.activeElement.id.toLowerCase() !== 'chatbox'){
                            sn("Don't turn away now");
                        }else{
                            return;
                        }
                    }, 33000);
                    setTimeout(()=>{
                        if(cSp && document.activeElement.id.toLowerCase() !== 'chatbox'){
                            sn("We are the warriors");
                        }else{
                            return;
                        }
                    }, 37000);
                    setTimeout(()=>{
                        if(cSp && document.activeElement.id.toLowerCase() !== 'chatbox'){
                            sn("that built this town");
                        }else{
                            return;
                        }
                    }, 39000);
                    setTimeout(()=>{
                        if(cSp && document.activeElement.id.toLowerCase() !== 'chatbox'){
                            sn("Here we are");
                        }else{
                            return;
                        }
                    }, 43000);
                    setTimeout(()=>{
                        if(cSp && document.activeElement.id.toLowerCase() !== 'chatbox'){
                            sn("Don't turn away now");
                        }else{
                            return;
                        }
                    }, 45000);
                    setTimeout(()=>{
                        if(cSp && document.activeElement.id.toLowerCase() !== 'chatbox'){
                            sn("We are the warriors");
                        }else{
                            return;
                        }
                    }, 49000);
                    setTimeout(()=>{
                        if(cSp && document.activeElement.id.toLowerCase() !== 'chatbox'){
                            sn("that built this town");
                        }else{
                            return;
                        }
                    }, 51000);
                    setTimeout(()=>{
                        if(cSp && document.activeElement.id.toLowerCase() !== 'chatbox'){
                            sn("From dust");
                        }else{
                            return;
                        }
                    }, 55000);
                    setTimeout(()=>{
                        if(cSp && document.activeElement.id.toLowerCase() !== 'chatbox'){
                            sn("The time will come");
                        }else{
                            return;
                        }
                    }, 57000);
                    setTimeout(()=>{
                        if(cSp && document.activeElement.id.toLowerCase() !== 'chatbox'){
                            sn("When you'll have to rise");
                        }else{
                            return;
                        }
                    }, 58000);
                    setTimeout(()=>{
                        if(cSp && document.activeElement.id.toLowerCase() !== 'chatbox'){
                            sn("Above the best");
                        }else{
                            return;
                        }
                    }, 61000);
                    setTimeout(()=>{
                        if(cSp && document.activeElement.id.toLowerCase() !== 'chatbox'){
                            sn("and prove yourself");
                        }else{
                            return;
                        }
                    }, 63000);
                    setTimeout(()=>{
                        if(cSp && document.activeElement.id.toLowerCase() !== 'chatbox'){
                            sn("Your spirit never dies");
                        }else{
                            return;
                        }
                    }, 64000);
                    setTimeout(()=>{
                        if(cSp && document.activeElement.id.toLowerCase() !== 'chatbox'){
                            sn("Farewell, I've gone");
                        }else{
                            return;
                        }
                    }, 67000);
                    setTimeout(()=>{
                        if(cSp && document.activeElement.id.toLowerCase() !== 'chatbox'){
                            sn("to take my throne above");
                        }else{
                            return;
                        }
                    }, 71000);
                    setTimeout(()=>{
                        if(cSp && document.activeElement.id.toLowerCase() !== 'chatbox'){
                            sn("But don't weep for me");
                        }else{
                            return;
                        }
                    }, 73000);
                    setTimeout(()=>{
                        if(cSp && document.activeElement.id.toLowerCase() !== 'chatbox'){
                            sn("'Cause this will be");
                        }else{
                            return;
                        }
                    }, 75000);
                    setTimeout(()=>{
                        if(cSp && document.activeElement.id.toLowerCase() !== 'chatbox'){
                            sn("The labor of my love");
                        }else{
                            return;
                        }
                    }, 77000);
                    setTimeout(()=>{
                        if(cSp && document.activeElement.id.toLowerCase() !== 'chatbox'){
                            sn("Here we are,");
                        }else{
                            return;
                        }
                    }, 80000);
                    setTimeout(()=>{
                        if(cSp && document.activeElement.id.toLowerCase() !== 'chatbox'){
                            sn("Don't turn away now");
                        }else{
                            return;
                        }
                    }, 82000);
                    setTimeout(()=>{
                        if(cSp && document.activeElement.id.toLowerCase() !== 'chatbox'){
                            sn("We are the warriors");
                        }else{
                            return;
                        }
                    }, 86000);
                    setTimeout(()=>{
                        if(cSp && document.activeElement.id.toLowerCase() !== 'chatbox'){
                            sn("that built this town");
                        }else{
                            return;
                        }
                    }, 89000);
                    setTimeout(()=>{
                        if(cSp && document.activeElement.id.toLowerCase() !== 'chatbox'){
                            sn("Here we are");
                        }else{
                            return;
                        }
                    }, 92000);
                    setTimeout(()=>{
                        if(cSp && document.activeElement.id.toLowerCase() !== 'chatbox'){
                            sn("Don't turn away now");
                        }else{
                            return;
                        }
                    }, 94000);
                    setTimeout(()=>{
                        if(cSp && document.activeElement.id.toLowerCase() !== 'chatbox'){
                            sn("We are the warriors");
                        }else{
                            return;
                        }
                    }, 98000);
                    setTimeout(()=>{
                        if(cSp && document.activeElement.id.toLowerCase() !== 'chatbox'){
                            sn("that built this town");
                        }else{
                            return;
                        }
                    }, 101000);
                    setTimeout(()=>{
                        if(cSp && document.activeElement.id.toLowerCase() !== 'chatbox'){
                            sn("From dust");
                        }else{
                            return;
                        }
                    }, 104000);
                    setTimeout(()=>{
                        if(cSp && document.activeElement.id.toLowerCase() !== 'chatbox'){
                            sn("Here we are,");
                        }else{
                            return;
                        }
                    }, 129000);
                    setTimeout(()=>{
                        if(cSp && document.activeElement.id.toLowerCase() !== 'chatbox'){
                            sn("Don't turn away now");
                        }else{
                            return;
                        }
                    }, 132000);
                    setTimeout(()=>{
                        if(cSp && document.activeElement.id.toLowerCase() !== 'chatbox'){
                            sn("We are the warriors");
                        }else{
                            return;
                        }
                    }, 136000);
                    setTimeout(()=>{
                        if(cSp && document.activeElement.id.toLowerCase() !== 'chatbox'){
                            sn("that built this town");
                        }else{
                            return;
                        }
                    }, 138000);
                    setTimeout(()=>{
                        if(cSp && document.activeElement.id.toLowerCase() !== 'chatbox'){
                            sn("Here we are");
                        }else{
                            return;
                        }
                    }, 142000);
                    setTimeout(()=>{
                        if(cSp && document.activeElement.id.toLowerCase() !== 'chatbox'){
                            sn("Don't turn away now");
                        }else{
                            return;
                        }
                    }, 144000);
                    setTimeout(()=>{
                        if(cSp && document.activeElement.id.toLowerCase() !== 'chatbox'){
                            sn("We are the warriors");
                        }else{
                            return;
                        }
                    }, 148000);
                    setTimeout(()=>{
                        if(cSp && document.activeElement.id.toLowerCase() !== 'chatbox'){
                            sn("that built this town");
                        }else{
                            return;
                        }
                    }, 150000);
                    setTimeout(()=>{
                        if(cSp && document.activeElement.id.toLowerCase() !== 'chatbox'){
                            sn("From dust");
                        }else{
                            return;
                        }
                    }, 154000);
                }else{
                    return;
                }
            }
            function cH4(){
                if(cSp && document.activeElement.id.toLowerCase() !== 'chatbox'){
                    setTimeout(()=>{
                        if(cSp && document.activeElement.id.toLowerCase() !== 'chatbox'){
                            sn("Legends never die");
                        }else{
                            return;
                        }
                    }, 12000);
                    setTimeout(()=>{
                        if(cSp && document.activeElement.id.toLowerCase() !== 'chatbox'){
                            sn("when the world is calling you");
                        }else{
                            return;
                        }
                    }, 16000);
                    setTimeout(()=>{
                        if(cSp && document.activeElement.id.toLowerCase() !== 'chatbox'){
                            sn("Can you hear them");
                        }else{
                            return;
                        }
                    }, 19000);
                    setTimeout(()=>{
                        if(cSp && document.activeElement.id.toLowerCase() !== 'chatbox'){
                            sn("screaming out your name?");
                        }else{
                            return;
                        }
                    }, 21000);
                    setTimeout(()=>{
                        if(cSp && document.activeElement.id.toLowerCase() !== 'chatbox'){
                            sn("Legends never die");
                        }else{
                            return;
                        }
                    }, 25000);
                    setTimeout(()=>{
                        if(cSp && document.activeElement.id.toLowerCase() !== 'chatbox'){
                            sn("they become a part of you");
                        }else{
                            return;
                        }
                    }, 29000);
                    setTimeout(()=>{
                        if(cSp && document.activeElement.id.toLowerCase() !== 'chatbox'){
                            sn("Every time you bleed");
                        }else{
                            return;
                        }
                    }, 33000);
                    setTimeout(()=>{
                        if(cSp && document.activeElement.id.toLowerCase() !== 'chatbox'){
                            sn("for reaching greatness");
                        }else{
                            return;
                        }
                    }, 35000);
                    setTimeout(()=>{
                        if(cSp && document.activeElement.id.toLowerCase() !== 'chatbox'){
                            sn("Relentless you survive");
                        }else{
                            return;
                        }
                    }, 39000);
                    setTimeout(()=>{
                        if(cSp && document.activeElement.id.toLowerCase() !== 'chatbox'){
                            sn("They never lose hope");
                        }else{
                            return;
                        }
                    }, 43000);
                    setTimeout(()=>{
                        if(cSp && document.activeElement.id.toLowerCase() !== 'chatbox'){
                            sn("when everything's cold");
                        }else{
                            return;
                        }
                    }, 45000);
                    setTimeout(()=>{
                        if(cSp && document.activeElement.id.toLowerCase() !== 'chatbox'){
                            sn("and the fighting's near");
                        }else{
                            return;
                        }
                    }, 47000);
                    setTimeout(()=>{
                        if(cSp && document.activeElement.id.toLowerCase() !== 'chatbox'){
                            sn("It's deep in their bones");
                        }else{
                            return;
                        }
                    }, 50000);
                    setTimeout(()=>{
                        if(cSp && document.activeElement.id.toLowerCase() !== 'chatbox'){
                            sn("they run into smoke");
                        }else{
                            return;
                        }
                    }, 52000);
                    setTimeout(()=>{
                        if(cSp && document.activeElement.id.toLowerCase() !== 'chatbox'){
                            sn("when the fire is fierce");
                        }else{
                            return;
                        }
                    }, 54000);
                    setTimeout(()=>{
                        if(cSp && document.activeElement.id.toLowerCase() !== 'chatbox'){
                            sn("'Oh pick yourself up, cause");
                        }else{
                            return;
                        }
                    }, 57000);
                    setTimeout(()=>{
                        if(cSp && document.activeElement.id.toLowerCase() !== 'chatbox'){
                            sn("Legends never die");
                        }else{
                            return;
                        }
                    }, 60000);
                    setTimeout(()=>{
                        if(cSp && document.activeElement.id.toLowerCase() !== 'chatbox'){
                            sn("when the world is calling you");
                        }else{
                            return;
                        }
                    }, 64000);
                    setTimeout(()=>{
                        if(cSp && document.activeElement.id.toLowerCase() !== 'chatbox'){
                            sn("Can you hear them");
                        }else{
                            return;
                        }
                    }, 67000);
                    setTimeout(()=>{
                        if(cSp && document.activeElement.id.toLowerCase() !== 'chatbox'){
                            sn("screaming out your name?");
                        }else{
                            return;
                        }
                    }, 69000);
                    setTimeout(()=>{
                        if(cSp && document.activeElement.id.toLowerCase() !== 'chatbox'){
                            sn("Legends never die");
                        }else{
                            return;
                        }
                    }, 74000);
                    setTimeout(()=>{
                        if(cSp && document.activeElement.id.toLowerCase() !== 'chatbox'){
                            sn("they become a part of you");
                        }else{
                            return;
                        }
                    }, 77000);
                    setTimeout(()=>{
                        if(cSp && document.activeElement.id.toLowerCase() !== 'chatbox'){
                            sn("Every time you bleed");
                        }else{
                            return;
                        }
                    }, 81000);
                    setTimeout(()=>{
                        if(cSp && document.activeElement.id.toLowerCase() !== 'chatbox'){
                            sn("for reaching greatness,");
                        }else{
                            return;
                        }
                    }, 83000);
                    setTimeout(()=>{
                        if(cSp && document.activeElement.id.toLowerCase() !== 'chatbox'){
                            sn("Legends never die");
                        }else{
                            return;
                        }
                    }, 87000);
                    setTimeout(()=>{
                        if(cSp && document.activeElement.id.toLowerCase() !== 'chatbox'){
                            sn("They're written down");
                        }else{
                            return;
                        }
                    }, 91000);
                    setTimeout(()=>{
                        if(cSp && document.activeElement.id.toLowerCase() !== 'chatbox'){
                            sn("in eternity");
                        }else{
                            return;
                        }
                    }, 92000);
                    setTimeout(()=>{
                        if(cSp && document.activeElement.id.toLowerCase() !== 'chatbox'){
                            sn("But you'll never see");
                        }else{
                            return;
                        }
                    }, 94000);
                    setTimeout(()=>{
                        if(cSp && document.activeElement.id.toLowerCase() !== 'chatbox'){
                            sn("the price it costs,");
                        }else{
                            return;
                        }
                    }, 97000);
                    setTimeout(()=>{
                        if(cSp && document.activeElement.id.toLowerCase() !== 'chatbox'){
                            sn("the scars collected");
                        }else{
                            return;
                        }
                    }, 100000);
                    setTimeout(()=>{
                        if(cSp && document.activeElement.id.toLowerCase() !== 'chatbox'){
                            sn("all their lives");
                        }else{
                            return;
                        }
                    }, 102000);
                    setTimeout(()=>{
                        if(cSp && document.activeElement.id.toLowerCase() !== 'chatbox'){
                            sn("When everything's lost");
                        }else{
                            return;
                        }
                    }, 105000);
                    setTimeout(()=>{
                        if(cSp && document.activeElement.id.toLowerCase() !== 'chatbox'){
                            sn("they pick up their hearts");
                        }else{
                            return;
                        }
                    }, 107000);
                    setTimeout(()=>{
                        if(cSp && document.activeElement.id.toLowerCase() !== 'chatbox'){
                            sn("and avenge defeat");
                        }else{
                            return;
                        }
                    }, 109000);
                    setTimeout(()=>{
                        if(cSp && document.activeElement.id.toLowerCase() !== 'chatbox'){
                            sn("Before it all starts,");
                        }else{
                            return;
                        }
                    }, 112000);
                    setTimeout(()=>{
                        if(cSp && document.activeElement.id.toLowerCase() !== 'chatbox'){
                            sn("they suffer through harm");
                        }else{
                            return;
                        }
                    }, 114000);
                    setTimeout(()=>{
                        if(cSp && document.activeElement.id.toLowerCase() !== 'chatbox'){
                            sn("just to touch a dream");
                        }else{
                            return;
                        }
                    }, 115000);
                    setTimeout(()=>{
                        if(cSp && document.activeElement.id.toLowerCase() !== 'chatbox'){
                            sn("'Oh pick yourself up, cause");
                        }else{
                            return;
                        }
                    }, 118000);
                    setTimeout(()=>{
                        if(cSp && document.activeElement.id.toLowerCase() !== 'chatbox'){
                            sn("Legends never die");
                        }else{
                            return;
                        }
                    }, 121000);
                    setTimeout(()=>{
                        if(cSp && document.activeElement.id.toLowerCase() !== 'chatbox'){
                            sn("when the world is calling you");
                        }else{
                            return;
                        }
                    }, 125000);
                    setTimeout(()=>{
                        if(cSp && document.activeElement.id.toLowerCase() !== 'chatbox'){
                            sn("Can you hear them");
                        }else{
                            return;
                        }
                    }, 129000);
                    setTimeout(()=>{
                        if(cSp && document.activeElement.id.toLowerCase() !== 'chatbox'){
                            sn("screaming out your name?");
                        }else{
                            return;
                        }
                    }, 130000);
                    setTimeout(()=>{
                        if(cSp && document.activeElement.id.toLowerCase() !== 'chatbox'){
                            sn("Legends never die");
                        }else{
                            return;
                        }
                    }, 135000);
                    setTimeout(()=>{
                        if(cSp && document.activeElement.id.toLowerCase() !== 'chatbox'){
                            sn("they become a part of you");
                        }else{
                            return;
                        }
                    }, 139000);
                    setTimeout(()=>{
                        if(cSp && document.activeElement.id.toLowerCase() !== 'chatbox'){
                            sn("Every time you bleed");
                        }else{
                            return;
                        }
                    }, 143000);
                    setTimeout(()=>{
                        if(cSp && document.activeElement.id.toLowerCase() !== 'chatbox'){
                            sn("for reaching greatness,");
                        }else{
                            return;
                        }
                    }, 145000);
                    setTimeout(()=>{
                        if(cSp && document.activeElement.id.toLowerCase() !== 'chatbox'){
                            sn("Legends never die");
                        }else{
                            return;
                        }
                    }, 149000);
                }else{
                    return;
                }
            }
            function cH5(){
                if(cSp){
                    setTimeout(()=>{
                        if(cSp){
                            sn("No there ain't no stopping us.");
                            setTimeout(()=>{
                                if(cSp){
                                    sn("Fly without boarding pass.");
                                    setTimeout(()=>{
                                        if(cSp){
                                            sn("Couldn't catch me");
                                            setTimeout(()=>{
                                                if(cSp){
                                                    sn("I be moving fast.");
                                                    setTimeout(()=>{
                                                        if(cSp){
                                                            sn("Call me a shooting star.");
                                                            setTimeout(()=>{
                                                                if(cSp){
                                                                    sn("Lend all you are.");
                                                                    setTimeout(()=>{
                                                                        if(cSp){
                                                                            sn("Flyin' up in a bar.");
                                                                            setTimeout(()=>{
                                                                                if(cSp){
                                                                                    sn("Wish on a star.");
                                                                                    setTimeout(()=>{
                                                                                        if(cSp){
                                                                                            sn("Time to show' em");
                                                                                            setTimeout(()=>{
                                                                                                if(cSp){
                                                                                                    sn("who's in charge");
                                                                                                    setTimeout(()=>{
                                                                                                        if(cSp){
                                                                                                            sn("Call me a shooting star.");
                                                                                                            cH6()
                                                                                                        }else{
                                                                                                            return;
                                                                                                        }
                                                                                                    }, 3000);
                                                                                                }else{
                                                                                                    return;
                                                                                                }
                                                                                            }, 1000);
                                                                                        }else{
                                                                                            return;
                                                                                        }
                                                                                    }, 3000);
                                                                                }else{
                                                                                    return;
                                                                                }
                                                                            }, 2000);
                                                                        }else{
                                                                            return;
                                                                        }
                                                                    }, 2000);
                                                                }else{
                                                                    return;
                                                                }
                                                            }, 3000);
                                                        }else{
                                                            return;
                                                        }
                                                    }, 3000);
                                                }else{
                                                    return;
                                                }
                                            }, 1000);
                                        }else{
                                            return;
                                        }
                                    }, 3000);
                                }else{
                                    return;
                                }
                            }, 3000);
                        }else{
                            return;
                        }
                    }, 5000);
                }else{
                    return;
                }
            }
            function cH6(){
                if(cSp){
                    setTimeout(()=>{
                        if(cSp){
                            sn("Shootin' stars!");
                            setTimeout(()=>{
                                if(cSp){
                                    sn("Didn't even get to guns");
                                    setTimeout(()=>{
                                        if(cSp){
                                            sn("I said I'm moving to fast!");
                                            setTimeout(()=>{
                                                if(cSp){
                                                    sn("Get to guns");
                                                    setTimeout(()=>{
                                                        if(cSp){
                                                            sn("You lookin' at shooting star.");
                                                            setTimeout(()=>{
                                                                if(cSp){
                                                                    sn("Got more than a couple");
                                                                    setTimeout(()=>{
                                                                        if(cSp){
                                                                            sn("of people going mad");
                                                                            setTimeout(()=>{
                                                                                if(cSp){
                                                                                    sn("I swear they're rooting hard.");
                                                                                    setTimeout(()=>{
                                                                                        if(cSp){
                                                                                            sn("To the my be big in the game");
                                                                                            setTimeout(()=>{
                                                                                                if(cSp){
                                                                                                    sn("now she went and");
                                                                                                    cH7()
                                                                                                }else{
                                                                                                    return;
                                                                                                }
                                                                                            }, 1000);
                                                                                        }else{
                                                                                            return;
                                                                                        }
                                                                                    }, 2000);
                                                                                }else{
                                                                                    return;
                                                                                }
                                                                            }, 600);
                                                                        }else{
                                                                            return;
                                                                        }
                                                                    }, 600);
                                                                }else{
                                                                    return;
                                                                }
                                                            }, 2000);
                                                        }else{
                                                            return;
                                                        }
                                                    }, 17000);
                                                }else{
                                                    return;
                                                }
                                            }, 2000);
                                        }else{
                                            return;
                                        }
                                    }, 26000);
                                }else{
                                    return;
                                }
                            }, 1000);
                        }else{
                            return;
                        }
                    }, 12000);
                }else{
                    return;
                }
            }
            function cH7(){
                if(cSp){
                    setTimeout(()=>{
                        if(cSp){
                            sn("got them breast implants.");
                            setTimeout(()=>{
                                if(cSp){
                                    sn("I said I'm moving to fast,");
                                    setTimeout(()=>{
                                        if(cSp){
                                            sn("didn't even get to guns!");
                                            setTimeout(()=>{
                                                if(cSp){
                                                    sn("I'm ready to eat up track like");
                                                    setTimeout(()=>{
                                                        if(cSp){
                                                            sn("I'm seated in a restaurant.");
                                                            setTimeout(()=>{
                                                                if(cSp){
                                                                    sn("If you had like swag like mine");
                                                                    setTimeout(()=>{
                                                                        if(cSp){
                                                                            sn("you'd know it's best to flaunt.");
                                                                            setTimeout(()=>{
                                                                                if(cSp){
                                                                                    sn("We are, hey in");
                                                                                    setTimeout(()=>{
                                                                                        if(cSp){
                                                                                            sn("because you aren't.");
                                                                                            setTimeout(()=>{
                                                                                                if(cSp){
                                                                                                    sn("Shining like Disney & Young.");
                                                                                                    cH8()
                                                                                                }else{
                                                                                                    return;
                                                                                                }
                                                                                            }, 1000);
                                                                                        }else{
                                                                                            return;
                                                                                        }
                                                                                    }, 2000);
                                                                                }else{
                                                                                    return;
                                                                                }
                                                                            }, 2000);
                                                                        }else{
                                                                            return;
                                                                        }
                                                                    }, 2000);
                                                                }else{
                                                                    return;
                                                                }
                                                            }, 2000);
                                                        }else{
                                                            return;
                                                        }
                                                    }, 1500);
                                                }else{
                                                    return;
                                                }
                                            }, 2000);
                                        }else{
                                            return;
                                        }
                                    }, 2000);
                                }else{
                                    return;
                                }
                            }, 1000);
                        }else{
                            return;
                        }
                    }, 1000);
                }else{
                    return;
                }
            }
            function cH8(){
                if(cSp){
                    setTimeout(()=>{
                        if(cSp){
                            sn("Drop like Kings of Leon.");
                            setTimeout(()=>{
                                if(cSp){
                                    sn("Shooting stars");
                                    setTimeout(()=>{
                                        if(cSp){
                                            sn("across the galaxy.");
                                            setTimeout(()=>{
                                                if(cSp){
                                                    sn("I stand out so");
                                                    setTimeout(()=>{
                                                        if(cSp){
                                                            sn("don't be mad at me.");
                                                            setTimeout(()=>{
                                                                if(cSp){
                                                                    sn("Infiltration win my strategy.");
                                                                    setTimeout(()=>{
                                                                        if(cSp){
                                                                            sn("When I turn up they");
                                                                            setTimeout(()=>{
                                                                                if(cSp){
                                                                                    sn("gonna just have to leave.");
                                                                                    setTimeout(()=>{
                                                                                        if(cSp){
                                                                                            sn("Shooting stars");
                                                                                            setTimeout(()=>{
                                                                                                if(cSp){
                                                                                                    sn("across the galaxy.");
                                                                                                    setTimeout(()=>{
                                                                                                        if(cSp){
                                                                                                            sn("I stand out so");
                                                                                                            cH9()
                                                                                                        }else{
                                                                                                            return;
                                                                                                        }
                                                                                                    }, 3000);
                                                                                                }else{
                                                                                                    return;
                                                                                                }
                                                                                            }, 1000);
                                                                                        }else{
                                                                                            return;
                                                                                        }
                                                                                    }, 2000);
                                                                                }else{
                                                                                    return;
                                                                                }
                                                                            }, 2000);
                                                                        }else{
                                                                            return;
                                                                        }
                                                                    }, 3000);
                                                                }else{
                                                                    return;
                                                                }
                                                            }, 2000);
                                                        }else{
                                                            return;
                                                        }
                                                    }, 750);
                                                }else{
                                                    return;
                                                }
                                            }, 3000);
                                        }else{
                                            return;
                                        }
                                    }, 1000);
                                }else{
                                    return;
                                }
                            }, 2000);
                        }else{
                            return;
                        }
                    }, 2000);
                }else{
                    return;
                }
            }
            function cH9(){
                if(cSp){
                    setTimeout(()=>{
                        if(cSp){
                            sn("don't be mad at me.");
                            setTimeout(()=>{
                                if(cSp){
                                    sn("Infiltration win my strategy.");
                                    setTimeout(()=>{
                                        if(cSp){
                                            sn("When I turn up they");
                                            setTimeout(()=>{
                                                if(cSp){
                                                    sn("gonna just have to leave.");
                                                    setTimeout(()=>{
                                                        if(cSp){
                                                            sn("Yao, yao, yao");
                                                            setTimeout(()=>{
                                                                if(cSp){
                                                                    sn("Shoot, shoot, shoot");
                                                                    setTimeout(()=>{
                                                                        if(cSp){
                                                                            sn("Yao, yao, yao");
                                                                            setTimeout(()=>{
                                                                                if(cSp){
                                                                                    sn("Shoot, shoot, shoot");
                                                                                    setTimeout(()=>{
                                                                                        if(cSp){
                                                                                            sn("Yao, yao, yao");
                                                                                            setTimeout(()=>{
                                                                                                if(cSp){
                                                                                                    sn("Shootin', shootin', shootin'");
                                                                                                    setTimeout(()=>{
                                                                                                        if(cSp){
                                                                                                            sn("Yao, yao, yao");
                                                                                                            cH10()
                                                                                                        }else{
                                                                                                            return;
                                                                                                        }
                                                                                                    }, 2500);
                                                                                                }else{
                                                                                                    return;
                                                                                                }
                                                                                            }, 1000);
                                                                                        }else{
                                                                                            return;
                                                                                        }
                                                                                    }, 2500);
                                                                                }else{
                                                                                    return;
                                                                                }
                                                                            }, 1000);
                                                                        }else{
                                                                            return;
                                                                        }
                                                                    }, 2500);
                                                                }else{
                                                                    return;
                                                                }
                                                            }, 1000);
                                                        }else{
                                                            return;
                                                        }
                                                    }, 2500);
                                                }else{
                                                    return;
                                                }
                                            }, 1000);
                                        }else{
                                            return;
                                        }
                                    }, 3000);
                                }else{
                                    return;
                                }
                            }, 2000);
                        }else{
                            return;
                        }
                    }, 750);
                }else{
                    return;
                }
            }
            function cH10(){
                if(cSp){
                    setTimeout(()=>{
                        if(cSp){
                            sn("Shootin' shots!");
                            setTimeout(()=>{
                                if(cSp){
                                    sn("Shooting stars!");
                                    setTimeout(()=>{
                                        if(cSp){
                                            sn("Shooting stars!");
                                            setTimeout(()=>{
                                                if(cSp){
                                                    sn("Shooting stars!");
                                                    setTimeout(()=>{
                                                        if(cSp){
                                                            sn("Shooting stars!");
                                                            setTimeout(()=>{
                                                                if(cSp){
                                                                    sn("Didn't even get to guns");
                                                                    setTimeout(()=>{
                                                                        if(cSp){
                                                                            sn("I said I'm moving to fast!");
                                                                            setTimeout(()=>{
                                                                                if(cSp){
                                                                                    sn("Get to guns");
                                                                                    setTimeout(()=>{
                                                                                        if(cSp){
                                                                                            cH5()
                                                                                        }else{
                                                                                            return;
                                                                                        }
                                                                                    }, 48000);
                                                                                }else{
                                                                                    return;
                                                                                }
                                                                            }, 1000);
                                                                        }else{
                                                                            return;
                                                                        }
                                                                    }, 25000);
                                                                }else{
                                                                    return;
                                                                }
                                                            }, 1000);
                                                        }else{
                                                            return;
                                                        }
                                                    }, 2000);
                                                }else{
                                                    return;
                                                }
                                            }, 2000);
                                        }else{
                                            return;
                                        }
                                    }, 2000);
                                }else{
                                    return;
                                }
                            }, 7000);
                        }else{
                            return;
                        }
                    }, 1000);
                }else{
                    return;
                }
            }










            var songs = [{
                name: "Rival - Lonely Way",
                src: "https://cdn.discordapp.com/attachments/851750266256228392/1092072385827582002/Rival_-_Lonely_Way.mp3",
                sync: {
                    "7:53": "I don't wanna fight, anymore",
                    "13:12": "Just turn around and leave me",
                    "19:63": "The tear in my eye",
                    "22:70": "drops on the floor",
                    "25:300": "Alongside my spear",
                    "33:530": "My....",
                    "35:40": "Knees, are drenched..",
                    "39:83": "in the blood",
                    "41:3": "I've spilt just to get here",
                    "45:730": "When I look",
                    "48:45": "Around me...",
                    "52:550": "Everything I had",
                    "54:20": "Went up in flames",
                    "56:100": "My Lonely Way",
                    "1:16:680": "When I look",
                    "1:19:63": "Around me...",
                    "1:23:420": "Everything I had",
                    "1:25:15": "Went up in flames",
                    "1:27:60": "My Lonely Way",
                    "1:55:30": "I never pray to god, anymore",
                    "2:1:530": "I'd rather no one heard, me",
                    "2:7:550": "Redemption, I have waited",
                    "2:10:900": "for you, to come",
                    "2:13:950": "And drown all my sins",
                    "2:25:13": "My...",
                    "2:26:730": "Knees, are drenched..",
                    "2:31:3": "in the blood",
                    "2:32:270": "I've spilt just to get here",
                    "2:37:34": "When I look",
                    "2:39:920": "Around me...",
                    "2:44:30": "Everything I had",
                    "2:45:150": "Went up in flames",
                    "2:48:34": "My Lonely Way",
                    "3:1:900": "When I-",
                    "3:8:950": "Everything I had",
                    "3:10:96": "Went up in flames",
                    "3:12:230": "My Lonely Way",
                },
            }, {
                name: "Rival - Throne",
                src: "https://cdn.discordapp.com/attachments/851750266256228392/1092477220083216435/Rival_-_Throne_ft._Neoni_Lost_Identities_Remix_NCS_Release.mp3",
                sync: {
                    "10:843": "So you wanna",
                    "11:883": "go to war with me",
                    "13:850": "You're talking like",
                    "14:451": "you think you're royalty",
                    "18:8": "You think that I'm afraid",
                    "21:12": "But I don't break",
                    "22:850": "I heard you question",
                    "23:720": "my stability?",
                    "25:780": "You think I'll fall",
                    "26:450": "just like a guillotine",
                    "30:5": "But I am here to stay",
                    "33:1": "Won't look away.",
                    "37:320": "A storm is coming",
                    "40:40": "So you best start running",
                    "43:70": "No you can't control",
                    "44:733": "feel it in my bones",
                    "46:220": "I'm coming for the,",
                    "47:125": "Coming for the",
                    "48:63": "Ohhh",
                    "49:120": "Ohhhhh",
                    "50:930": "Ohhh",
                    "52:60": "Ohhhhhh",
                    "54:54": "Ohhhh",
                    "58:820": "I'm coming for the throne",
                    "1:10:900": "I'm coming for the throne",

                },
            }, {
                name: "Rival - Be Gone",
                src: "https://cdn.discordapp.com/attachments/851750266256228392/1092049138855723082/Rival_-_Be_Gone_ft._Caravn.mp3",
                sync: {
                    "6:73": "You",
                    "7:83": "You just walk",
                    "8:30": "Right out the door",
                    "10:51": "Don't wanna do this",
                    "11:880": "Anymore",
                    "13:90": "Now I'm lost without you",
                    "18:750": "You",
                    "19:820": "Drive me crazy out my mind",
                    "22:990": "How'd you do this every time?",
                    "25:930": "Now I'm lost without you",
                    "30:93": "Used to be the one I talk",
                    "33:80": "to when I'm sad",
                    "36:300": "Can't you see",
                    "37:940": "now tainted love",
                    "39:100": "is all we have?",
                    "42:63": "Our issues run so deep",
                    "43:950": "Now when I try to sleep",
                    "45:440": "I feel so bad",
                    "49:5": "I should leave",
                    "50:370": "and by the time",
                    "52:3": "it's dawn",
                    "54:139": "I'll be gone",
                    "1:14:5": "I should leave",
                    "1:15:120": "and by the time",
                    "1:17:1": "it's dawn",
                    "1:19:430": "I'll be gone",
                    "1:58:220": "You're",
                    "1:59:150": "so distant when you're home",
                    "2:2:570": "Always hanging",
                    "2:3:280": "By your phone",
                    "2:5:820": "Do I even know you?",
                    "2:10:150": "And I",
                    "2:12:10": "get paranoid sometimes",
                    "2:15:30": "Cause I know",
                    "2:16:60": "that you ain't mine",
                    "2:18:70": "And I'm lost without you",
                    "2:22:200": "Used to be the one I talk",
                    "2:25:99": "to when I'm sad",
                    "2:28:830": "Can't you see",
                    "2:30:40": "now tainted love",
                    "2:31:200": "is all we have?",
                    "2:34:180": "Our issues run so deep",
                    "2:36:30": "Now when I try to sleep",
                    "2:37:735": "I feel so bad",
                    "2:41:30": "I should leave",
                    "2:42:630": "and by the time",
                    "2:44:48": "it's dawn",
                    "2:46:800": "I'll be gone",
                    "2:59:45": "I'll be gone",
                },
            }, {
                name: "Rival - Walls",
                src: "https://cdn.discordapp.com/attachments/851750266256228392/1091412065396195338/rival-walls-ft-bryan-finlay.mp3",
                sync: {
                    "2:543": "I was ready",
                    "4:653": "to surrender my heart",
                    "7:80": "to you...",
                    "9:651": "only you....",
                    "13:20": "These lights all around me",
                    "15:40": "keep blinding my eyes",
                    "18:20": "from you...",
                    "20:73": "and the truth",
                    "24:5": "Don't tell me,",
                    "24:750": "Don't tell me,",
                    "25:80": "Don't tell me why",
                    "26:680": "I know, I know",
                    "27:420": "no you won't",
                    "28:80": "save my life...",
                    "30:790": "save my life...",
                    "34:90": "If you keep on, you keep on",
                    "35:750": "you're making the waves",
                    "37:90": "You...",
                    "37:850": "And I will never",
                    "39:70": "be sane,",
                    "42:3": "be sane...",
                    "44:789": "If these walls",
                    "46:230": "come down...",
                    "49:980": "Will you pick me off",
                    "53:5": "the groound?...",
                    "55:80": "If these walls",
                    "57:70": "come down...",
                    "1:0:420": "Will you save me,",
                    "1:2:68": "or burn me doown?..",
                    "1:11:68": "Will you pick me off",
                    "1:14:50": "the groound?...",
                    "1:22:20": "Will you save me,",
                    "1:23:700": "or burn me doown?..",
                    "1:32:550": "Will you pick me off",
                    "1:35:900": "the groound?...",
                    "1:43:50": "Will you save me,",
                    "1:45:20": "or burn me doown?..",
                    "1:49:80": "I was ready",
                    "1:51:75": "to surrender my heart",
                    "1:54:8": "to you...",
                    "1:56:90": "only you...",
                    "1:59:720": "These lights all around me",
                    "2:1:980": "keep blinding my eyes",
                    "2:4:850": "from you...",
                    "2:6:900": "and the truth...",
                    "2:10:600": "Don't tell me",
                    "2:11:80": "Don't tell me",
                    "2:11:980": "Don't tell me why",
                    "2:13:70": "I know, I know",
                    "2:14:80": "no you won't",
                    "2:14:930": "save my life...",
                    "2:17:80": "save my life...",
                    "2:21:10": "If you keep, you keep on",
                    "2:22:320": "you're making the waves",
                    "2:23:990": "You...",
                    "2:24:570": "And I will never",
                    "2:26:1": "be sane,",
                    "2:28:420": "be sane...",
                    "2:31:80": "If these walls",
                    "2:33:78": "come down...",
                    "2:36:150": "Will you pick me off",
                    "2:39:500": "the groound?...",
                    "2:42:1": "If these walls",
                    "2:44:1": "come down...",
                    "2:47:50": "Will you save me,",
                    "2:49:5": "or burn me doown?..",
                    "2:58:1": "Will you pick me off",
                    "3:1:15": "the groound?...",
                    "3:8:50": "Will you save me,",
                    "3:10:80": "or burn me doown?..",
                    "3:19:30": "Will you pick me off",
                    "3:22:60": "the groound?...",
                    "3:29:860": "Will you save me,",
                    "3:31:700": "or burn me doown?..",
                },
            }, {
                name: "Rival - Control",
                src: "https://cdn.discordapp.com/attachments/1052272022639620168/1098229240907972648/Y2Mate.is_-_Unknown_Brain_x_Rival_-_Control_feat._Jex_NCS_Release-bLZHcnuqscU-1080p-1657559679661.mp4",
                sync: {
                    "2:50": "Take me in the smoke",
                    "3:50": "Breathe me in and let me go",
                    "7:00": "Filling the lungs inside you",
                    "11:75": "In the black of night",
                    "13:50": "Make my way into your mind",
                    "17:25": "Just to know what you knew",
                    "20:25": "Restless every time",
                    "22:50": "We start lockin' eyes",
                    "25:00": "Oh, oh, oh, oh",
                    "27:00": "Lost control",
                    "29:00": "Oh",
                    "30:50": "it's paradise",
                    "32:00": "With a nasty bite",
                    "35:00": "Oh, oh, oh, oh",
                    "37:00": "In the dead of the night",
                    "47:00": "Let the darkness take control",
                    "1:10:0": "Let the darkness take control",
                    "1:15:1": "Darkness take control",
                    "1:20:1": "May the darkness take control",
                    "1:28:1": "Take me in the smoke",
                    "1:30:1": "Breathe me in and let me go",
                    "1:34:1": "Sink to your heart to find you",
                    "1:38:1": "Open up your eyes",
                    "1:39:1": "till you're blinded",
                    "1:41:1": "by the lies",
                    "1:43:1": "So you can see what you do",
                    "1:46:1": "Restless every time",
                    "1:49:1": "We start lockin' eyes",
                    "1:51:1": "Oh, oh, oh, oh",
                    "1:54:1": "Lost control",
                    "1:56:1": "Oh",
                    "1:57:1": "it's paradise",
                    "1:59:1": "With a nasty bite",
                    "2:1:0": "Oh, oh, oh, oh",
                    "2:4:0": "In the dead of the night",
                    "2:8:0": "Teardrops on the floor",
                    "2:11:0": "The pain is over",
                    "2:13:0": "Feel the darkness take control",
                    "2:32:0": "May the darkness take control",
                },
            }, {
                name: "Egzod - No Rival",
                src: "https://cdn.discordapp.com/attachments/1059159650026659842/1075173234263203861/Egzod_Maestro_Chives_Alaina_Cross_-_No_Rival_NCS_Release.mp3",
                sync: {
                    "12:679": "Here and now",
                    "13:730": "you're coming up to me",
                    "15:197": "'Fore I'm lighting up the sky",
                    "18:565": "Feel the ground",
                    "19:855": "shaking underneath",
                    "21:346": "Tryna take me alive",
                    "24:415": "Oh-oh-oh-oh-oh-oh-oh",
                    "26:906": "Get ready for the fallout",
                    "30:357": "Oh-oh-oh-oh-oh-oh-oh",
                    "33:26": "Can't stop me now",
                    "35:154": "I got no rival",
                    "37:463": "I'ma find my way",
                    "39:615": "Through the blood and pain",
                    "41:162": "Game of survival",
                    "43:463": "Any time or place",
                    "45:577": "Watch 'em run away",
                    "47:337": "I got no-",
                    "49:78": "I'll be standing on my own",
                    "51:259": "Never gonna take my thrown",
                    "53:389": "I got no rival",
                    "55:349": "Watch 'em run away",
                    "57:320": "I got no, no, no",
                    "58:789": "I got no, no, no rival",
                    "1:0:227": "No rival",
                    "1:11:329": "No rival",
                    "1:17:295": "No Rival",
                    "1:24:694": "Tell them now what you gon' do",
                    "1:27:265": "We can do this face-to-face",
                    "1:30:316": "Reckoning is coming real soon",
                    "1:33:254": "Doesn't matter what you say",
                    "1:36:175": "Tryna tell you",
                    "1:37:203": "listen to the moment",
                    "1:38:512": "Can't take mine 'cause I own it",
                    "1:42:714": "Don't you know that",
                    "1:43:869": "I'm locked and I'm loaded?",
                    "1:45:389": "You're out of focus",
                    "1:48:202": "Oh-oh-oh-oh-oh-oh-oh",
                    "1:51:61": "Get ready for the fallout",
                    "1:54:362": "Oh-oh-oh-oh-oh-oh-oh",
                    "1:56:885": "Can't stop me now",
                    "1:59:205": "I got no rival",
                    "2:1:383": "I'ma find my way",
                    "2:3:722": "Through the blood and pain",
                    "2:5:242": "Game of survival",
                    "2:7:461": "Any time or place",
                    "2:9:631": "Watch 'em run away",
                    "2:11:210": "I got no-",
                    "2:12:959": "I'll be standing on my own",
                    "2:15:221": "Never gonna take my throne",
                    "2:17:141": "I got no rival",
                    "2:19:351": "Watch 'em run away",
                    "2:21:221": "I got no, no, no",
                    "2:22:770": "I got no, no, no rival",
                    "2:24:149": "No rival",
                    "2:29:116": "No rival",
                    "2:33:194": "I got no, no, no",
                    "2:34:695": "I got no, no, no rival",
                    "2:41:239": "No rival",
                    "2:59:204": "No rival",
                },
            }, {
                name: "do not resurrect - Necrotic Grip",
                src: "",
                sync: {
                    "::": "Back off",
                    "::": "I came to play",
                    "::": "with my hacksaw",
                    "::": "Bash in your brain",
                    "::": "with my mask off",
                    "::": "Yea try to pray",
                    "::": "for the last time",
                    "::": "Lame and you mad",
                    "::": "but you hate",
                    "::": "cuz your cash wrong",
                    "::": "I don't want love",
                    "::": "I want matte Glocks",
                    "::": "I'll eat ya heart",
                    "::": "like it's bath salts",
                    "::": "I'll leave",
                    "::": "his lung on the asphalt",
                    "::": "I'll leave",
                    "::": "your tongue in a glass jar",
                    "::": "Murder with a black SCAR",
                    "::": "He don't wanna dump",
                    "::": "What the fuck",
                    "::": "is it that hard?",
                    "::": "He don't wanna buck",
                    "::": "He respond with a sad bar",
                    "::": "Nigga shoulda ducked",
                    "::": "but he run like a track star",
                    "::": "I came to play",
                    "::": "with my hacksaw",
                    "::": "I don't want pain",
                    "::": "I want matte Glocks",
                    "::": "I'll eat ya heart",
                    "::": "like it's bath salts",
                    "::": "I'll leave",
                    "::": "his lung on the asphalt",
                    "::": "Now I just be sippin'",
                    "::": "sippin'",
                    "::": "sippin' slow on the blood",
                    "::": "I collect from you fuckers",
                    "::": "And I could be vicious",
                    "::": "witness never told of",
                    "::": "the souls that",
                    "::": "I left in my dungeon",
                    "::": "Now cuz of my pigment",
                    "::": "I been predisposed to unload",
                    "::": "and attack in abundance",
                    "::": "But that's just",
                    "::": "the shit they said",
                    "::": "I go and murder cuz simply",
                    "::": "the fact that I love it",
                    "::": "But it's back to the subject",
                    "::": "Stacking bodies by the dozen",
                    "::": "Whippin' Audis outta budget",
                    "::": "Godly while I'm thumpin'",
                    "::": "You would probly",
                    "::": "caught a couple",
                    "::": "Grippin' probly why",
                    "::": "I'm fucked and",
                    "::": "I don't plan on stoppin'",
                    "::": "She do molly while we fuckin'",
                    "::": "Creepin' I might grab a snub",
                    "::": "I caught him out in public",
                    "::": "Beam, he saw it",
                    "::": "'fore it snuffed him",
                    "::": "He was talking like he tough",
                    "::": "and now he not so lucky",
                    "::": "Back off",
                    "::": "I came to play",
                    "::": "with my hacksaw",
                    "::": "Bash in your brain",
                    "::": "with my mask off",
                    "::": "Yea try to pray",
                    "::": "for the last time",
                    "::": "Lame and you mad",
                    "::": "but you hate",
                    "::": "cuz your cash wrong",
                    "::": "I don't want love",
                    "::": "I want matte Glocks",
                    "::": "I'll eat ya heart",
                    "::": "like it's bath salts",
                    "::": "I'll leave",
                    "::": "his lung on the asphalt",
                    "::": "I'll leave",
                    "::": "your tongue in a glass jar",
                    "::": "Murder with a black SCAR",
                    "::": "He don't wanna dump",
                    "::": "What the fuck",
                    "::": "is it that hard?",
                    "::": "He don't wanna buck",
                    "::": "He respond with a sad bar",
                    "::": "Nigga shoulda ducked",
                    "::": "but he run like a track star",
                    "::": "I came to play",
                    "::": "with my hacksaw",
                    "::": "I don't want pain",
                    "::": "I want matte Glocks",
                    "::": "I'll eat ya heart",
                    "::": "like it's bath salts",
                    "::": "I'll leave",
                    "::": "his lung on the asphalt",
                    "::": "I came to play",
                    "::": "with my hacksaw",
                    "::": "I don't want pain",
                    "::": "I want matte Glocks",
                    "::": "I'll eat ya heart",
                    "::": "like it's bath salts",
                    "::": "I'll leave",
                    "::": "his lung on the asphalt",
                    "::": "I came to play",
                    "::": "with my hacksaw",
                    "::": "I don't want pain",
                    "::": "I want matte Glocks",
                    "::": "I'll eat ya heart",
                    "::": "like it's bath salts",
                    "::": "I'll leave",
                    "::": "his lung on the asphalt",
                },
            }, {
                name: "Witchouse 40k - Black Rainbow",
                src: "https://cdn.discordapp.com/attachments/873309075276959834/1098246319526653994/Grim_Salvo_-_Black_Rainbow_ft._Witchouse40k_Lyrics.mp3",
                sync: {
                    "3:000": "Terror when she told me, mmm",
                    "7:000": "This is what you wanted",
                    "11:000": "Somebody to hold me, mmm",
                    "15:000": "It's all I ever wanted",
                    "19:000": "Terror when she told me, mmm",
                    "23:000": "This is what you wanted",
                    "27:000": "Somebody to hold me, mmm",
                    "31:000": "It's all I ever wanted",
                    "35:000": "Mhmm",
                    "39:000": "Mhmm",
                    "43:000": "Mhmm",
                    "47:000": "Mhmm",
                    "50:000": "All I've got is time",
                    "53:000": "No hands, no crown",
                    "58:000": "Eternal the shine",
                    "1:1:000": "When no one around",
                    "1:5:000": "I’ve had no plans",
                    "1:6:000": "on the lately",
                    "1:7:000": "Paranoid they smile",
                    "1:8:000": "when they hate me",
                    "1:9:000": "Fuck a urinal",
                    "1:10:000": "piss in the mainstream",
                    "1:11:000": "What I gotta chop off",
                    "1:12:000": "so you’ll place me",
                    "1:13:000": "Choppin up snakey",
                    "1:14:000": "Demons ovеrtake me",
                    "1:15:000": "Nevеr had a good reason",
                    "1:16:000": "to be hasty",
                    "1:17:000": "‘Til the wheels",
                    "1:18:000": "fell off of the daydream",
                    "1:19:000": "Yeah we would just take it",
                    "1:20:000": "when we lazy",
                    "1:21:000": "Didn’t hesitate it’s wild",
                    "1:22:000": "How we justify omega",
                    "1:23:000": "When we get a taste of venom",
                    "1:24:000": "Turn a quick fix",
                    "1:25:000": "into big dilemma",
                    "1:26:000": "I’m a dog",
                    "1:27:000": "but I’m not sure",
                    "1:28:000": "if I’ll go to heaven",
                    "1:30:000": "Thought I knew better",
                    "1:31:000": "Sneaking pills from her purse",
                    "1:32:000": "Bitch move",
                    "1:33:000": "I belong in a hearse",
                    "1:34:000": "Addy got me feeling",
                    "1:35:000": "like I’m fallin' in reverse",
                    "1:36:000": "Patty told me hiding in",
                    "1:37:000": "the shadows really",
                    "1:38:000": "only gonna make it worse",
                    "1:39:000": "Terror when she told me, mmm",
                    "1:43:000": "“This is what you wanted”",
                    "1:47:000": "Somebody to hold me, mmm",
                    "1:51:000": "It's all I ever wanted",
                    "1:54:000": "I just wanna—hold it",
                    "1:55:000": "A future",
                    "1:56:000": "that would’ve been golden",
                    "1:57:000": "Rumors of realms",
                    "1:58:000": "that don’t wither and fold in",
                    "1:59:000": "All I smell is some",
                    "2:0:000": "mold in the corners",
                    "2:1:000": "What good are you for then?",
                    "2:2:000": "Sweeter and more delectable",
                    "2:3:000": "that torture",
                    "2:4:000": "The more of those horrors",
                    "2:5:000": "that tend to enfold them",
                    "2:6:000": "Putrid the stench from",
                    "2:7:000": "the stables",
                    "2:8:000": "Forgotten rotted fable",
                    "2:9:000": "scapegoats they holed in",
                    "2:10:000": "I paid for your rage",
                    "2:11:000": "a million days",
                    "2:12:000": "Look at me now on my bullshit",
                    "2:13:000": "Bitch I shit on this place",
                    "2:14:000": "I was pulled in",
                    "2:15:000": "Blood feathers break when",
                    "2:16:000": "I shed",
                    "2:17:000": "But not ever dead",
                    "2:17:000": "Upgrading my cage",
                    "2:18:000": "when I’m molting",
                    "2:29:000": "Now that I’m free",
                    "2:21:000": "what is even illegal?",
                    "2:22:000": "Burn the whole church",
                    "2:23:000": "'cause they’re perched",
                    "2:24:000": "on the steeple",
                    "2:25:000": "Go open the door",
                    "2:26:000": "but you won’t see no people",
                    "2:27:000": "Know some ring wraiths",
                    "2:28:000": "that’ll feed on your face",
                    "2:28:600": "if you don’t keep",
                    "2:28:999": "your distance",
                    "2:29:000": "We’re not going back",
                    "2:30:000": "it’s a suicide mission",
                    "2:31:000": "Lights in my head always",
                    "2:32:000": "on every day is",
                    "2:33:000": "like Christmas",
                    "2:34:000": "Long as there’s one person",
                    "2:35:000": "still out there listening",
                    "2:36:000": "Then there’s",
                    "2:37:000": "still a resistance",
                    "2:38:000": "All our dead",
                    "2:39:000": "dreams detonated",
                    "2:40:000": "right at the core",
                    "2:41:000": "of this mold pearl",
                    "2:42:000": "We don’t need their assistance",
                    "2:43:000": "Wait, hold it",
                    "2:44:000": "Now I wield the dusty",
                    "2:45:000": "bone blade of the Ogress",
                    "2:46:000": "Sold us downriver",
                    "2:47:000": "Sold us down the phlegethon",
                    "2:48:000": "but we floated",
                    "2:49:000": "Just wait…",
                    "2:50:000": "'Cause a carpet of bones",
                    "2:51:000": "'til there’s nothing left pulsing",
                    "2:52:000": "Woefully",
                    "2:53:000": "I cannot help",
                    "2:54:449": "but to loathe this",
                    "2:55:000": "I hope",
                    "2:56:000": "that nobody knows this",
                    "2:57:000": "I’ll be there to deliver",
                    "2:57:000": "the finishing blow like a",
                    "2:58:000": "slow kiss",
                    "2:59:000": "What does he need?",
                    "3:1:000": "Revenge",
                    "3:3:000": "For what?",
                    "3:5:000": "Being born",
                    "3:7:000": "I’m gon' turn into a ghost",
                    "3:8:000": "I don’t feel my body",
                    "3:10:000": "They say I’m broken",
                    "3:11:000": "shattered bones",
                    "3:12:000": "I don’t feel nobody",
                    "3:14:000": "I’m healing",
                    "3:15:000": "scars up in the cold",
                    "3:16:000": "leave me frozen now",
                    "3:18:000": "I slowly walk a lonely road",
                    "3:20:000": "I can’t save myself",
                    "3:22:000": "Glock on me",
                    "3:23:000": "I’m gon' walk out the coffin",
                    "3:24:000": "I shot thirty",
                    "3:25:000": "See me hop on the block",
                    "3:26:000": "take a lot for me",
                    "3:27:000": "I got bugs in my conscious",
                    "3:28:000": "I rot…",
                    "3:29:000": "Everyone plot on me",
                    "3:29:555": "knock off his top",
                    "3:30:000": "Fuck it",
                    "3:31:000": "I've got slugs in my system",
                    "3:32:000": "my shots loaded",
                    "3:33:000": "Put the gun through",
                    "3:34:000": "your vision and pop forty",
                    "3:35:000": "Like a bully",
                    "3:37:000": "I spin on your block",
                    "3:36:000": "Spiderweb scope out the roof",
                    "3:39:000": "'til they drop for me",
                    "3:40:000": "I got all these demons",
                    "3:41:000": "in my grave",
                    "3:42:000": "that leave me vacant",
                    "3:43:000": "Come and lay yo",
                    "3:44:000": "body wit' me baby",
                    "3:45:000": "won’t awaken",
                    "3:47:000": "Talkin' wit' the devil",
                    "3:48:000": "sold my soul",
                    "3:49:000": "but I could take it",
                    "3:51:000": "I had nothing left to heal",
                    "3:53:000": "my heart",
                    "3:54:000": "that's always breaking",
                    "3:55:000": "I got all these demons",
                    "3:56:000": "in my grave",
                    "3:57:000": "that leave me vacant",
                    "3:59:000": "Come and lay yo'",
                    "4:0:000": "body wit' me baby",
                    "4:1:000": "won’t awaken",
                    "4:3:000": "Talkin' wit' the devil",
                    "4:4:000": "sold my soul",
                    "4:5:000": "but I could take it",
                    "4:7:000": "I had nothing left to heal",
                    "4:8:000": "my heart",
                    "4:9:000": "that's always breaking",
                    "4:11:000": "Terror when she told me, mmm",
                    "4:15:000": "“This is what you wanted”",
                    "4:19:000": "Somebody to hold me, mmm",
                    "4:23:000": "It's all I ever wanted",
                    "4:27:000": "Terror when she told me, mmm",
                    "4:31:000": "“This is what you wanted”",
                    "4:35:000": "Somebody to hold memmm",
                    "4:39:000": "It's all I ever wanted",
                    "4:42:000": "I just wanna—hold it",
                    "4:43:000": "A future",
                    "4:43:000": "that would’ve been golden",
                    "4:44:000": "Rumors of realms",
                    "4:45:000": "that don’t wither and fold in",
                    "4:46:000": "All I smell is some",
                    "4:47:000": "mold in the corners",
                    "4:48:000": "What good are you for then?",
                    "4:49:000": "Sweeter and more delectable",
                    "4:50:000": "that torture",
                    "4:51:000": "The more of those horrors",
                    "4:52:000": "that tend to enfold them",
                    "4:53:000": "Putrid the stench from",
                    "4:54:000": "the stables",
                    "4:55:000": "Forgotten rotted fable",
                    "4:56:000": "scapegoats they holed in",
                    "4:57:000": "Etched like the",
                    "4:58:000": "base of a grave",
                    "4:59:000": "Covered in old magazine",
                    "5:0:000": "and dead roses",
                    "5:1:000": "Gotta put on a bold fac",
                    "5:2:000": "for the lies and mistakes",
                    "5:3:000": "All the pain happening",
                    "5:4:000": "right underneath our noses",
                    "5:5:000": "Woefully",
                    "5:6:000": "I cannot help",
                    "5:7:000": "but to loathe this",
                    "5:8:000": "Woefully—Woefully—",
                    "5:15:000": "I hope",
                    "5:16:000": "that nobody knows this",
                    "5:19:000": "A man like Ringo",
                    "5:19:500": "has got agreat big hole",
                    "5:20:000": "right through",
                    "5:21:000": "the middle of him",
                    "5:24:000": "He can never kill enough",
                    "5:26:000": "or steal enough",
                    "5:27:000": "or inflict enough",
                    "5:28:000": "pain to ever fill it",
                }
            }, {
                name: "Grim Salvo - Feasting.On.The.Guts.Of.Angels",
                src: "https://cdn.discordapp.com/attachments/976188754417025144/1074693682336378890/Grim_Salvo_x_KAMAARA_-_Feasting.On.The.Guts.Of.Angels._OFFICIAL_AUDIO.mp3",
                sync: {
                    "14:00": "You think that I won't",
                    "15:50": "I'm sick of the front",
                    "17:0": "I got no fuckin' patience",
                    "18:0": "yeah yeah",
                    "19:0": "She jump down my throat",
                    "::": "Manage your expectations",
                    "::": "yeah yeah",
                    "::": "You're building a roof",
                    "::": "When you got no foundation",
                    "::": "yeah yeah",
                    "::": "Signal the smoke",
                    "::": "Spare me the altercation",
                    "::": "yeah yeah",
                    "::": "I'm sick of the front",
                    "::": "I got no fucking patience",
                    "::": "yeah yeah",
                    "::": "She jump down my throat",
                    "::": "Manage your expectations",
                    "::": "yeah yeah",
                    "::": "You're building a roof",
                    "::": "When you got no foundation",
                    "::": "yeah yeah",
                    "::": "Signal the smoke",
                    "::": "Spare me the altercation",
                    "::": "yeah yeah",
                    "::": "Been a minute since",
                    "::": "I really took a minute",
                    "::": "yeah yeah",
                    "::": "Been fixated on",
                    "::": "too many different women",
                    "::": "yeah yeah",
                    "::": "I've been spinnin'",
                    "::": "avoidin' all of my feelings",
                    "::": "yeah yeah",
                    "::": "Spillin' my guts while",
                    "::": "I'm starin' at the ceiling",
                    "::": "yeah yeah",
                    "::": "I've been here too many times",
                    "::": "I'm slowly losing my mind",
                    "::": "Bitch I'm broke",
                    "::": "And I got holes in my clothes",
                    "::": "But I am not impatient",
                    "::": "yeah yeah",
                    "::": "What the fuck do I want?",
                    "::": "Think I got hesitations",
                    "::": "yeah yeah",
                    "::": "33 always gonna be spicy",
                    "::": "Call it capsaicin",
                    "::": "yeah yeah",
                    "::": "Under the impression",
                    "::": "that we're ever gonna stop",
                    "::": "But you're fucking mistaken",
                    "::": "yeah yeah",
                    "::": "You a facade!",
                    "::": "Bitch you so fraudulent",
                    "::": "I can see it on your face",
                    "::": "not so confident",
                    "::": "Tried to manipulate",
                    "::": "me and my brothers",
                    "::": "Thinking I won't",
                    "::": "but that bitch needs a buffer",
                    "::": "Used to pawn licks",
                    "::": "now I'm top of my game",
                    "::": "Peeling the skin back",
                    "::": "from under my face",
                    "::": "Got a taste for it",
                    "::": "now I just do it for thrills",
                    "::": "Tried to bait me",
                    "::": "put a shot in his gills",
                    "::": "Not mad, I'm the gadfly",
                    "::": "No cyanide 'cause the world just",
                    "::": "gonna keep killing me still",
                    "::": "Sleuthy like Socrates",
                    "::": "No one's ever gonna",
                    "::": "be able to say they bought me",
                    "::": "Actin' like you not there",
                    "::": "but I still care",
                    "::": "Still stare with a blank face",
                    "::": "Wonder what the fuck",
                    "::": "is on the TV",
                    "::": "with a Phoebe",
                    "::": "Tell me take her someplace",
                    "::": "'Cause she really wanna please me",
                    "::": "Got them Blinders on like Peaky",
                    "::": "I've been here too many times",
                    "::": "I'm slowly losing my mind",
                    "::": "See red in her eyes",
                    "::": "All of these bitches evil",
                    "::": "yeah yeah",
                    "::": "You twisting your tongue",
                    "::": "Twisting my mind, that's lethal",
                    "::": "yeah yeah",
                    "::": "Not part of the script",
                    "::": "Taking you out the sequel",
                    "::": "yeah yeah",
                    "::": "Right before I leave",
                    "::": "I'mma get revenge, Max Keeble",
                    "::": "yeah yeah",
                    "::": "I'mma save you the heartache",
                    "::": "Think it's time",
                    "::": "that we part ways",
                    "::": "(yeah!)",
                    "::": "Not here for the long wait",
                    "::": "Think my time is a short stay",
                    "::": "(what?)",
                    "::": "You don't know the half of me",
                    "::": "It's sad to see that everybody",
                    "::": "Laughed at me like Sajudis, now",
                    "::": "Bitches throw it back",
                    "::": "for me so casually",
                    "::": "Like 'deet da deet da",
                    "::": "deet da deet da",
                    "::": "deet da deet da deet'",
                    "::": "Pour another cold one",
                    "::": "swallow down a whole one",
                    "::": "Checking my pulse;",
                    "::": "am I dead? Can't tell",
                    "::": "All that I know is",
                    "::": "I'm leaving my soul",
                    "::": "As you're in my ear screaming",
                    "::": "'Burn in hell!'",
                    "::": "Clip that! (What's up?)",
                    "::": "'Cause one day, bitch",
                    "::": "I'mma come back",
                    "::": "Rub this shit in yo' face",
                    "::": "eat your words that disgraced",
                    "::": "No more MIAs, only KIAs",
                    "::": "Where the dog tags?",
                    "::": "You think that I won't",
                    "::": "I'm sick of the front",
                    "::": "I got no fuckin' patience",
                    "::": "yeah yeah",
                    "::": "She jump down my throat",
                    "::": "Manage your expectations",
                    "::": "yeah yeah",
                    "::": "You're building a roof",
                    "::": "When you-",
                    "::": "When you got no foundation",
                    "::": "yeah yeah",
                    "::": "Signal the smoke",
                    "::": "Spare me the altercation",
                    "::": "yeah yeah",
                    "::": "I'm sick of the front",
                    "::": "I got no fuckin' patience",
                    "::": "yeah yeah",
                    "::": "She jump down my throat",
                    "::": "Manage your expectations",
                    "::": "yeah yeah",
                    "::": "You're building a roof",
                    "::": "When you got no foundation",
                    "::": "yeah yeah",
                    "::": "Signal the smoke",
                    "::": "Spare me the altercation",
                    "::": "yeah y—",
                },
            }, {
                name: "Initial D - Don't Stand so Close",
                src: "https://cdn.discordapp.com/attachments/976188754417025144/1074693171419820122/Initial_D_-_Dont_Stand_So_Close_AMV.mp3",
                sync: {
                    "9:629": "We'll be together",
                    "10:847": "'till the morning light",
                    "12:877": "Don't stand so",
                    "14:400": "Don't stand so",
                    "15:928": "Don't stand so close to me",
                    "30:895": "Baby you belong to me",
                    "34:085": "Yes you do, yes you do",
                    "35:377": "You're my affection",
                    "37:118": "I can make a woman cry",
                    "40:129": "Yes I do, yes I do",
                    "41:668": "I will be good",
                    "43:380": "You're like a cruel device",
                    "45:041": "your blood is cold like ice",
                    "46:605": "Posion for my veins",
                    "48:205": "I'm breaking my chains",
                    "49:710": "One look and you can kill",
                    "51:228": "my pain now is your thrill",
                    "52:817": "Your love is for me",
                    "55:108": "I say, Try me",
                    "56:567": "take a chance on emotions",
                    "58:829": "For now and ever",
                    "1:0:19": "close to your heart",
                    "1:1:299": "I say, Try me",
                    "1:2:725": "take a chance on my passion",
                    "1:5:102": "We'll be together all the time",
                    "1:7:383": "I say, Try me",
                    "1:8:874": "take a chance on emotions",
                    "1:11:142": "For now and ever into my heart",
                    "1:13:279": "I say, Try me",
                    "1:14:989": "take a chance on my passion",
                    "1:17:349": "We'll be together",
                    "1:18:429": "'till the morning light",
                    "1:20:610": "Don't stand so",
                    "1:22:210": "Don't stand so",
                    "1:23:639": "Don't stand so close to me",
                    "1:38:607": "Baby let me take control",
                    "1:41:679": "Yes I do, yes I do",
                    "1:43:254": "You are my target",
                    "1:44:897": "No one ever made me cry",
                    "1:47:969": "What you do, what you do",
                    "1:49:406": "Baby's so bad",
                    "1:51:134": "You're like a cruel device",
                    "1:52:521": "your blood is cold like ice",
                    "1:54:293": "Posion for my veins",
                    "1:55:754": "I'm breaking my chains",
                    "1:57:333": "One look and you can kill",
                    "1:58:879": "my pain now is your thrill",
                    "2:0:607": "Your love is for me",
                    "2:2:690": "I say, Try me",
                    "2:4:271": "take a chance on emotions",
                    "2:6:599": "For now and ever",
                    "2:7:824": "close to your heart",
                    "2:8:715": "I say, Try me",
                    "2:10:394": "take a chance on my passion",
                    "2:12:733": "We'll be together all the time",
                    "2:14:993": "I say, Try me",
                    "2:16:298": "take a chance on emotions",
                    "2:18:900": "For now and ever into my heart",
                    "2:21:209": "I say, Try me",
                    "2:22:652": "take a chance on my passion",
                    "2:24:972": "We'll be together",
                    "2:26:129": "'till the morning light",
                    "2:28:216": "Don't stand so",
                    "2:29:856": "Don't stand so",
                    "2:31:296": "Don't stand so close to me",
                    "2:58:89": "I say, Try me",
                    "2:59:679": "take a chance on emotions",
                    "3:1:937": "For now and ever",
                    "3:3:47": "close to your heart",
                    "3:4:231": "I say, Try me",
                    "3:5:820": "take a chance on my passion",
                    "3:8:140": "We'll be together all the time",
                    "3:10:495": "I say, Try me",
                    "3:11:883": "take a chance on emotions",
                    "3:14:267": "For now and ever into my heart",
                    "3:16:558": "I say, Try me",
                    "3:18:67": "take a chance on my passion",
                    "3:20:464": "We'll be together",
                    "3:21:515": "'till the morning light",
                    "3:23:694": "Don't stand so",
                    "3:25:176": "Don't stand so",
                    "3:26:768": "Don't stand so close to me",
                    "3:41:739": "Try me",
                    "3:42:830": "take a chance on emotions",
                    "3:45:0": "For now and ever",
                    "3:46:271": "close to your heart",
                    "3:47:296": "I say, Try me",
                    "3:48:816": "take a chance on my passion",
                    "3:51:163": "We'll be together all the time",
                    "3:53:505": "I say, Try me",
                    "3:55:28": "take a chance on emotions",
                    "3:57:379": "For now and ever into my heart",
                    "3:59:667": "I say, Try me",
                    "4:1:216": "take a chance on my passion",
                    "4:3:507": "We'll be together",
                    "4:4:755": "'till the morning light",
                    "4:6:783": "Don't stand so",
                    "4:8:292": "Don't stand so",
                    "4:9:791": "Don't stand so close to me",
                },
            }, {
                name: "Initial D - The Top",
                src: "https://cdn.discordapp.com/attachments/976188754417025144/1074417409626226728/initial_D_MAD_The_Top_1.mp3",
                sync: {
                    "39:401": "Final lap",
                    "40:516": "I'm on top of the world",
                    "41:618": "And I will never rest",
                    "43:667": "for second again",
                    "45:448": "One more time",
                    "46:410": "I have beaten them out",
                    "47:999": "The scent of gasoline",
                    "49:831": "announces the end",
                    "51:388": "They all said",
                    "52:838": "I'd best give it up",
                    "54:137": "What a fool",
                    "55:40": "to believe their lies",
                    "57:528": "Now they've fall",
                    "58:976": "and I'm at the top",
                    "1:0:116": "Are you ready now to die?",
                    "1:3:151": "I came up from the bottom",
                    "1:4:759": "and into the top",
                    "1:6:170": "For the first time",
                    "1:7:211": "I feel alive",
                    "1:9:373": "I can fly like an eagle",
                    "1:10:574": "strike like a hawk",
                    "1:12:170": "Do you think",
                    "1:12:997": "you can survive the top",
                    "1:15:328": "the top",
                    "1:27:347": "Final turn",
                    "1:28:526": "and I'll settle the score",
                    "1:30:177": "A rubber fire screams",
                    "1:31:392": "into the night",
                    "1:33:483": "Crash and burn is",
                    "1:34:747": "what you're gonna do",
                    "1:36:17": "I am a master",
                    "1:37:77": "of the asphalt fight",
                    "1:39:517": "They all said",
                    "1:40:563": "I'd best give it up",
                    "1:42:134": "What a fool",
                    "1:42:846": "to believe their lies",
                    "1:45:415": "Now they've fall",
                    "1:46:775": "and I'm at the top",
                    "1:48:175": "Are you ready now to die?",
                    "1:51:55": "I came up from the bottom",
                    "1:52:745": "and into the top",
                    "1:54:225": "For the first time",
                    "1:55:9": "I feel alive",
                    "1:57:343": "I can fly like an eagle",
                    "1:58:907": "strike like a hawk",
                    "2:0:153": "Do you think",
                    "2:0:794": "you can survive?",
                    "2:3:120": "I came up from the bottom",
                    "2:4:775": "and into the top",
                    "2:6:92": "For the first time",
                    "2:7:233": "I feel alive",
                    "2:9:212": "I can fly like an eagle",
                    "2:10:951": "strike like a hawk",
                    "2:12:79": "Do you think",
                    "2:12:904": "you can survive the top",
                    "2:27:859": "What were you thinking",
                    "2:28:721": "telling me to change my game?",
                    "2:30:588": "This style wasn't",
                    "2:31:247": "going anywhere",
                    "2:32:216": "it was kaput!",
                    "2:33:227": "You want to see what",
                    "2:33:793": "I've done with this place",
                    "2:35:39": "this whole thing?",
                    "2:36:322": "You want to see that",
                    "2:36:850": "I changed the game?",
                    "2:37:471": "No, I AM the game!",
                    "2:40:117": "Before I knew where",
                    "2:40:698": "this was going",
                    "2:41:320": "I would've listened to you",
                    "2:42:392": "Right now",
                    "2:42:992": "I distance myself from",
                    "2:43:665": "what you have to say!",
                    "2:44:894": "I made this",
                    "2:45:650": "something way bigger",
                    "2:46:403": "than you're ever gonna be",
                    "2:47:926": "I made it this far",
                    "2:49:494": "and I'm taking it to the top",
                    "2:51:115": "I came up from the bottom",
                    "2:52:854": "And into the top",
                    "2:54:185": "For the first time",
                    "2:55:106": "I feel alive!",
                    "2:57:195": "I can fly like an eagle",
                    "2:58:857": "And strike like a hawk",
                    "3:0:30": "Do you think",
                    "3:0:994": "you can survive...",
                    "3:3:53": "I came up from the bottom",
                    "3:4:751": "And into the top",
                    "3:6:141": "For the first time",
                    "3:7:211": "I feel alive!",
                    "3:9:171": "I can fly like an eagle",
                    "3:11:11": "And strike like a hawk",
                    "3:12:91": "Do you think",
                    "3:12:800": "you can survive... the top?",
                    "3:51:44": "I came up from the bottom",
                    "3:52:746": "And into the top",
                    "3:54:26": "For the first time",
                    "3:55:95": "I feel alive!",
                    "3:57:135": "I can fly like an eagle",
                    "3:58:615": "And strike like a hawk",
                    "4:0:153": "Do you think",
                    "4:0:776": "you can survive...",
                    "4:3:102": "I came up from the bottom",
                    "4:4:782": "And into the top",
                    "4:6:32": "For the first time",
                    "4:7:6": "I feel alive!",
                    "4:9:57": "I can fly like an eagle",
                    "4:10:876": "And strike like a hawk",
                    "4:12:188": "Do you think",
                    "4:12:852": "you can survive... the top?",
                },
            }, {
                name: "Initial D - Gas Gas Gas",
                src: "https://cdn.discordapp.com/attachments/976188754417025144/1074417409303269478/Manuel_-_Gas_Gas_Gas_1.mp3",
                sync: {
                    "16:852": "Ah",
                    "20:9": "gas, gas, gas, gas",
                    "23:124": "Ah",
                    "28:271": "Do you like..",
                    "29:853": "my car",
                    "31:468": "m y c a r",
                    "33:132": "m  y  c  a  r",
                    "53:109": "Guess you're ready",
                    "54:291": "'cause I'm waiting for you",
                    "56:129": "It's gonna be so exciting",
                    "59:290": "Got this feeling",
                    "1:0:499": "really deep in my soul",
                    "1:2:281": "Let's get out",
                    "1:3:135": "I wanna go",
                    "1:4:48": "come along",
                    "1:4:855": "get it on",
                    "1:5:993": "Gonna take my car",
                    "1:7:562": "gonna sit in",
                    "1:9:35": "Gonna drive along",
                    "1:10:474": "'til I get you",
                    "1:11:823": "'Cause I'm crazy",
                    "1:12:562": "hot and ready",
                    "1:13:541": "but you like it",
                    "1:15:10": "I wanna race for you",
                    "1:16:610": "(Shall I go now?)",
                    "1:18:109": "Gas, gas, gas",
                    "1:19:810": "I'm gonna step on the gas",
                    "1:21:642": "Tonight, I'll fly",
                    "1:22:962": "(and be your lover)",
                    "1:24:370": "Yeah, yeah, yeah",
                    "1:26:101": "I'll be so quick as a flash",
                    "1:27:884": "And I'll be your hero",
                    "1:30:651": "Gas, gas, gas",
                    "1:32:379": "I'm gonna run as a flash",
                    "1:34:59": "Tonight, I'll fight",
                    "1:35:507": "(to be the winner)",
                    "1:36:707": "Yeah, yeah, yeah",
                    "1:38:547": "I'm gonna step on the gas",
                    "1:40:286": "And you'll see the big show",
                    "1:55:520": "Don't be lazy",
                    "1:56:751": "'cause I'm burning for you",
                    "1:58:340": "It's like a hot sensation",
                    "2:1:733": "Got this power",
                    "2:2:913": "that is taking me out",
                    "2:4:681": "Yes, I've got a crush on you",
                    "2:6:347": "ready, now",
                    "2:7:174": "ready, go",
                    "2:8:335": "Gonna take my car",
                    "2:9:935": "gonna sit in",
                    "2:11:481": "Gonna drive alone",
                    "2:12:775": "'til I get you",
                    "2:14:244": "'Cause I'm crazy",
                    "2:14:975": "hot and ready",
                    "2:15:999": "but you like it",
                    "2:17:279": "I wanna race for you",
                    "2:18:938": "(Shall I go now?)",
                    "2:20:455": "Gas, gas, gas",
                    "2:22:178": "I'm gonna step on the gas",
                    "2:23:999": "Tonight, I'll fly",
                    "2:25:311": "(and be your lover)",
                    "2:26:738": "Yeah, yeah, yeah",
                    "2:28:512": "I'll be so quick as a flash",
                    "2:29:975": "And I'll be your hero",
                    "2:32:978": "Gas, gas, gas",
                    "2:34:668": "I'm gonna run as a flash",
                    "2:36:447": "Tonight, I'll fight",
                    "2:37:809": "(to be the winner)",
                    "2:39:81": "Yeah, yeah, yeah",
                    "2:40:931": "I'm gonna step on the gas",
                    "2:42:463": "And you'll see the big show",
                    "3:10:277": "Guess you're ready",
                    "3:11:426": "'cause I'm waiting for you",
                    "3:13:215": "It's gonna be so exciting",
                    "3:16:471": "Got this feeling",
                    "3:17:789": "really deep in my soul",
                    "3:19:408": "Let's get out",
                    "3:20:224": "I wanna go",
                    "3:21:197": "come along",
                    "3:22:34": "get it on",
                    "3:23:234": "Gonna take my car",
                    "3:25:986": "do you like",
                    "3:27:605": "my car?",
                    "3:29:5": "'Cause I'm crazy",
                    "3:29:685": "hot and ready",
                    "3:30:823": "but you like it",
                    "3:32:133": "I wanna race for you",
                    "3:33:653": "(Shall I go now?)",
                    "3:36:813": "Gas, gas, gas",
                    "3:38:514": "I'm gonna step on the gas",
                    "3:40:185": "Tonight, I'll fly",
                    "3:41:665": "(and be your lover)",
                    "3:43:46": "Yeah, yeah, yeah",
                    "3:44:756": "I'll be so quick as a flash",
                    "3:46:354": "And I'll be your hero",
                    "3:49:245": "Gas, gas, gas",
                    "3:51:130": "I'm gonna run as a flash",
                    "3:52:840": "Tonight, I'll fight",
                    "3:54:90": "(to be the winner)",
                    "3:55:448": "Yeah, yeah, yeah",
                    "3:57:389": "I'm gonna step on the gas",
                    "3:58:866": "And you'll see the big show",
                    "4:1:797": "Gas, gas, gas",
                    "4:4:805": "Yeah, yeah, yeah",
                    "4:7:975": "Gas, gas, gas",
                    "4:11:293": "And you'll see the big show",
                    "4:28:89": "Ah"
                },
            }, {
                name: "Initial D - Running In The 90's",
                src: "https://cdn.discordapp.com/attachments/976188754417025144/1074691658643415050/Running_In_The_90s_2.mp3",
                sync: {
                    "37:412": "Modern talking",
                    "38:991": "modern walking in the streets",
                    "41:601": "New desire",
                    "43:481": "Take me higher",
                    "45:89": "lift me higher with your speed",
                    "47:729": "I need fire",
                    "49:220": "Get the satellite",
                    "50:892": "if you want to see me",
                    "52:225": "Talking on the net",
                    "53:699": "I know the way you like it",
                    "55:329": "Get your credit card",
                    "56:862": "'cause I need no money",
                    "58:339": "All I wanna get is you",
                    "1:0:480": "baby",
                    "1:1:344": "Running in the 90's",
                    "1:3:976": "is a new way I like to be",
                    "1:6:664": "I'm just running in the 90's",
                    "1:10:141": "Come on baby, run to me",
                    "1:12:800": "We are running in the 90's",
                    "1:16:141": "it's a new way to set me free",
                    "1:18:722": "I'm just running in the 90's",
                    "1:22:242": "Yes, I wanna know",
                    "1:23:850": "yes, I wanna see",
                    "1:37:880": "Cyber talking",
                    "1:39:613": "cybersex is on the line",
                    "1:42:184": "New desire",
                    "1:44:150": "Take me higher",
                    "1:45:691": "boost me higher with your mind",
                    "1:48:203": "Set me on fire",
                    "1:49:645": "Get the satellite",
                    "1:51:347": "if you want to see me",
                    "1:52:769": "Talking on the net",
                    "1:54:379": "I know the way you like it",
                    "1:55:896": "Get your credit card",
                    "1:57:307": "'cause I need no money",
                    "1:58:617": "All I wanna get is you",
                    "2:1:97": "baby",
                    "2:1:814": "Running in the 90's",
                    "2:4:582": "is a new way I like to be",
                    "2:7:196": "I'm just running in the 90's",
                    "2:10:595": "Come on baby, run to me",
                    "2:13:233": "We are running in the 90's",
                    "2:16:673": "it's a new way to set me free",
                    "2:19:225": "I'm just running in the 90's",
                    "2:22:868": "Yes, I wanna know",
                    "2:24:325": "yes, I wanna see",
                    "2:42:690": "New desire",
                    "2:48:845": "I need fire",
                    "3:2:496": "Running in the 90's",
                    "3:5:165": "is a new way I like to be",
                    "3:7:744": "I'm just running in the 90's",
                    "3:11:424": "Come on, baby, run to me",
                    "3:13:885": "We are running in the 90's",
                    "3:17:333": "it's a new way to set me free",
                    "3:19:971": "I'm just running in the 90's",
                    "3:23:451": "Yes, I wanna know",
                    "3:24:949": "yes, I wanna see",
                    "3:45:179": "Take me higher",
                    "3:46:699": "lift me higher with your speed",
                    "3:49:356": "I need fire",
                    "3:50:937": "Get the satellite",
                    "3:53:983": "talking on the net",
                    "3:56:922": "Get your credit card",
                    "4:0:4": "all I wanna get",
                    "4:2:899": "Running in the 90's",
                    "4:8:968": "Running in the 90's",
                    "4:15:200": "Running in the 90's",
                    "4:21:190": "Running in the 90's",
                },
            }, {
                name: "Initial D - No One Sleep In Tokyo",
                src: "https://cdn.discordapp.com/attachments/1059159650026659842/1075151008910561330/Initial_D_-_No_One_Sleep_In_Tokyo.mp3",
                sync: {
                    "666": "(4... 3... 2... 1...)",
                    "19:197": "no one sleep in Tokyo",
                    "22:301": "all right crossing the line",
                    "25:392": "no one quit the radio",
                    "28:432": "Tokyo is on fire",
                    "43:821": "even if you say",
                    "45:341": "'I have been the world wide'",
                    "47:124": "I'll take you where",
                    "48:190": "surely you have never been",
                    "50:558": "all right in the fight",
                    "52:47": "I'm OK... come on",
                    "56:5": "come on",
                    "59:374": "hey do you feel",
                    "1:0:688": "the night is breathable",
                    "1:2:760": "look at this town",
                    "1:1:347": "which is unbelievable",
                    "1:2:805": "no other places",
                    "1:7:21": "like that in the world",
                    "1:9:264": "worldddd",
                    "1:10:144": "worlddddddddd (1, 2, 3, 4)",
                    "1:11:825": "no one sleep in Tokyo",
                    "1:14:843": "all right crossing the line",
                    "1:18:137": "no one quit the radio",
                    "1:21:203": "Tokyo is on fire",
                    "1:24:393": "no one sleep in Tokyo",
                    "1:27:302": "all right crossing the line",
                    "1:30:403": "no one quit the radio",
                    "1:33:473": "Tokyo is on fire",
                    "1:48:894": "turning to the left",
                    "1:50:364": "easy chicks and red lights",
                    "1:52:367": "and to the right",
                    "1:53:305": "crazy music everywhere",
                    "1:55:705": "all right in the fight",
                    "1:56:855": "I'm OK... come on",
                    "2:0:924": "come on",
                    "2:4:448": "hey do you feel",
                    "2:5:832": "the night is breathable",
                    "2:7:767": "look at this town",
                    "2:8:514": "which is unbelievable",
                    "2:10:885": "no other places",
                    "2:11:984": "like that in the world",
                    "2:14:333": "worldddd",
                    "2:15:245": "worlddddddddd (1, 2, 3, 4)",
                    "2:16:842": "no one sleep in Tokyo",
                    "2:20:26": "all right crossing the line",
                    "2:23:77": "no one quit the radio",
                    "2:26:286": "Tokyo is on fire",
                    "2:29:266": "no one sleep in Tokyo",
                    "2:32:487": "all right crossing the line",
                    "2:35:436": "no one quit the radio",
                    "2:38:546": "Tokyo is on fire",
                    "3:18:369": "(come on)",
                    "3:32:566": "(1, 2, 3, 4)",
                    "3:37:328": "all right crossing the line",
                    "3:43:658": "Tokyo is on fire",
                    "3:59:82": "hey do you feel",
                    "4:0:318": "the night is breathable",
                    "4:2:486": "look at this town",
                    "4:3:515": "which is unbelievable",
                    "4:5:525": "no other places",
                    "4:6:600": "like that in the world",
                    "4:8:992": "worldddd",
                    "4:9:680": "worlddddddddd (1, 2, 3, 4)",
                    "4:11:454": "no one sleep in Tokyo",
                    "4:14:568": "all right crossing the line",
                    "4:17:616": "no one quit the radio",
                    "4:20:747": "Tokyo is on fire",
                    "4:23:779": "no one sleep in Tokyo",
                    "4:26:950": "all right crossing the line",
                    "4:30:51": "no one quit the radio",
                    "4:33:70": "Tokyo is on fire",
                },
            }, {
                name: "UNSECRET & Noeni - Fallout",
                src: "https://cdn.discordapp.com/attachments/1040928912118652928/1079764097169641552/Neoni_x_UNSECRET_-_Fallout_Official_Lyric_Video.mp3",
                sync: {
                    "19:833": "Hush now, dry your eyes",
                    "24:167": "Fate is upon us",
                    "26:84": "The changing of times",
                    "27:417": "Welcome blood red skies",
                    "32:751": "Burn in wake of a",
                    "35:1": "world left behind",
                    "37:280": " DI YA, DA, DA",
                    "39:238": "DA DA, DE DI YA",
                    "40:613": "DA DA, DE DA",
                    "45:988": "DI YA, DA, DA",
                    "48:155": "DE, DI YA",
                    "49:113": "DA DA",
                    "50:125": "DE DI, YA",
                    "51:257": "DA, DA, DE, DA",
                    "53:632": "Can't escape the fallout",
                    "58:48": "Feel the fire rain down",
                    "1:2:382": "See the shadows",
                    "1:3:531": "rising all around",
                    "1:6:489": "Can't escape the FALLOUT,",
                    "1:9:239": "fallout",
                    "1:12:114": "Down to the ashes",
                    "1:16:531": "Bones are left to dry",
                    "1:20:781": "Waves of desolation",
                    "1:25:031": "There's nowhere safe to hide",
                    "1:29:971": "DI YA",
                    "1:30:762": "DA DA DE",
                    "1:31:972": "DI YA.",
                    "1:32:346": "DA DA DE",
                    "1:34:160": "DI YA",
                    "1:35:35": "DA DA DE DA",
                    "1:38:539": "DI YA",
                    "1:39:372": "DA DA DE",
                    "1:40:521": "DI YA",
                    "1:41:729": "DA DA DE",
                    "1:42:762": "DI YA",
                    "1:43:878": "DA DA DE DA",
                    "1:45:890": "Can't escape the fallout",
                    "1:50:265": "Feel the fire rain down",
                    "1:54:557": "See the shadows",
                    "1:55:849": "rising all around",
                    "1:58:897": "Can't escape the fallout,",
                    "2:1:814": "FALLOUT!",
                    "2:22:237": "DI YA",
                    "2:23:153": "DA DA DE",
                    "2:24:528": "DI YA.",
                    "2:25:362": "DA DA DE",
                    "2:26:305": "DI YA",
                    "2:27:347": "DA DA DE DA",
                    "2:30:730": "DI YA",
                    "2:31:722": "DA DA DE",
                    "2:33:49": "DI YA",
                    "2:34:8": "DA DA DE",
                    "2:35:133": "DI YA",
                    "2:36:174": "DA DA DE DA",
                    "2:46:921": "Can't escape the fallout!",
                    "2:51:296": "Feel the fire rain down",
                    "2:55:755": "See the shadows",
                    "2:57:58": "rising all around",
                    "3:0:183": "Can't escape the fallout",
                    "3:2:433": "FALLOUT!",
                    "3:4:642": "Can't escape the fallout,",
                    "3:7:267": "FALLOUT!",
                },
            }, {
                name: "V O E - Giants",
                src: "https://cdn.discordapp.com/attachments/1065969963644506152/1079719316074790953/V_O_E_-_Giants_Extended_Mix_NCS_Release_1.mp3",
                sync: {
                    "10:639": "Oh, where am I going now",
                    "12:163": "just falling over dreams",
                    "16:299": "Now I'm just so far gone",
                    "18:439": "this isn't what it seems",
                    "21:785": "I'm taking this so d*mn long",
                    "23:317": "it's fading from believe",
                    "27:178": "I need to slow this down",
                    "28:828": "it's burning from beneath",
                    "32:909": "Come break this line",
                    "36:175": "Before tomorrow dies,",
                    "38:805": "Holding on for what",
                    "40:547": "is worth my life",
                    "44:175": "I know in time",
                    "47:214": "I'll make it up the vine",
                    "49:802": "Find my way to",
                    "51:71": "giants in the sky",
                    "53:974": "Tonight it comes to life.",
                    "1:16:17": "Tonight it comes to life..",
                    "1:38:829": "Oh, where am I going now",
                    "1:40:450": "just falling over dreams",
                    "1:44:520": "Now I'm just so far gone",
                    "1:46:391": "this isn't what it seems",
                    "1:49:974": "I'm taking this so d*mn long",
                    "1:51:652": "it's fading from believe",
                    "1:55:509": "I need to slow this down",
                    "1:57:142": "it's burning from beneath",
                    "2:1:269": "Come break this light",
                    "2:4:52": "Before tomorrow dies,",
                    "2:7:97": "Holding on for what",
                    "2:8:785": "is worth my life",
                    "2:12:322": "I know in time",
                    "2:15:315": "I'll make it up the vine",
                    "2:18:221": "Find my way to",
                    "2:19:582": "giants in the sky",
                    "2:21:175": "Tonight it comes to life.",
                    "2:32:969": "Tonight it comes to life..",
                    "2:56:461": "Come break this line",
                    "2:59:450": "Before tomorrow dies,",
                    "3:2:601": "Holding on for what",
                    "3:3:853": "is worth my life",
                    "3:7:617": "I know in time",
                    "3:10:701": "I'll make it up the vine",
                    "3:13:195": "Find my way to",
                    "3:14:591": "giants in the sky",
                    "3:17:446": "Tonight it comes to life.",
                },

            }, {
                name: "Neoni - Champion",
                src: "https://cdn.discordapp.com/attachments/1040928912118652928/1079696275303305256/Nightcore_-_CHAMPION_Lyrics.mp3",
                sync: {
                    "14:689": "The battle's coming now...",
                    "20:398": "The fury shakes the ground",
                    "26:174": "I've come to take my crown",
                    "31:525": "Im rising up",
                    "32:155": "my heart is pounding",
                    "34:382": "Ready or not the",
                    "35:516": "clock is counting down",
                    "37:322": "Whoa",
                    "40:814": "This is my moment",
                    "42:722": "Whoa",
                    "46:581": "This is my moment..",
                    "49:399": "This is my moment...",
                    "52:074": "Whoa",
                    "53:033": "I was born for greatness",
                    "54:847": "Whoa",
                    "55:709": "A legend in the making",
                    "57:432": "Deep in my bones",
                    "58:702": "Oh yeah I know",
                    "1:0:743": "I am",
                    "1:1:695": "I am the champion",
                    "1:3:466": "Whoa",
                    "1:4:597": "Come on try and take it",
                    "1:6:366": "Whoa",
                    "1:7:255": "It all comes down to this and",
                    "1:8:781": "Deep in my bones",
                    "1:10:414": "Oh yeah I know",
                    "1:12:137": "I am",
                    "1:13:180": "I am the champion",
                    "1:17:852": "You know I'm out for blood",
                    "1:23:339": "Im feeling dangerous",
                    "1:29:235": "I just can't get enough",
                    "1:34:722": "Im rising up",
                    "1:35:555": "my heart is pounding",
                    "1:37:353": "Ready or not the",
                    "1:38:625": "clock is counting down",
                    "1:43:976": "This is my moment..",
                    "1:49:781": "This is my moment...",
                    "1:52:684": "This is my moment yeah",
                    "1:55:136": "Whoa",
                    "1:56:117": "I was born for greatness",
                    "1:58:079": "Whoa",
                    "1:59:060": "A legend in the making",
                    "2:0:557": "Deep in my bones",
                    "2:1:963": "Oh yeah I know",
                    "2:3:718": "I am",
                    "2:4:931": "I am the champion",
                    "2:6:609": "Whoa",
                    "2:7:652": "Come on try to take it",
                    "2:9:511": "Whoa",
                    "2:10:645": "It all comes down to this and",
                    "2:11:920": "Deep in my bones",
                    "2:13:553": "Oh yeah I know",
                    "2:15:231": "I am",
                    "2:16:228": "I am the champion",
                    "2:21:943": "I am the",
                    "2:22:804": "I am the.",
                    "2:26:627": "I am.",
                    "2:27:897": "I am the champion",
                    "2:29:756": "I know where I'm going",
                    "2:32:840": "I have been chosen",
                    "2:35:607": "I'll never be broken",
                    "2:39:326": "I am the champion",
                    "2:41:276": "A clashing of titans",
                    "2:44:269": "A battle of giants",
                    "2:46:555": "Take a moment of silence",
                    "2:53:472": "I am the champion",
                    "2:55:467": "Whoa",
                    "2:56:510": "I was born for greatness",
                    "2:58:279": "Whoa",
                    "2:59:336": "A legend in the making",
                    "3:0:878": "Deep in my bones",
                    "3:2:238": "Oh yeah I know",
                    "3:4:007": "I am",
                    "3:5:186": "I am the champion",
                    "3:6:955": "Whoa",
                    "3:7:689": "Come on try to take it",
                    "3:9:799": "Whoa",
                    "3:10:797": "It all comes down to this and",
                    "3:12:115": "Deep in my bones",
                    "3:13:666": "Oh yeah I know",
                    "3:15:515": "I am",
                    "3:16:649": "I am the champion",
                    "3:22:318": "I am the",
                    "3:22:998": "I am the.",
                    "3:27:033": "I am",
                    "3:28:123": "I am the champion.",
                }
            }, {
                name: "JPB & Mendum - Losing Control",
                src: "https://cdn.discordapp.com/attachments/1040928912118652928/1080030493212409896/JPB__Mendum_-_Losing_Control_feat._Marvin_Divine_.mp3",
                sync: {
                    "10:259": "(Losing control)",
                    "12:346": "(I like losing control)",
                    "15:384": "I like losing control",
                    "18:220": "I get high when",
                    "19:672": "I'm feeling my flow",
                    "21:667": "My mind is focused",
                    "22:665": "and I'm ready to go",
                    "24:161": "Ready to go",
                    "26:248": "Na na",
                    "27:835": "I like losing control",
                    "30:702": "I get high when Im feeling my",
                    "32:788": "flow",
                    "33:695": "My mind is focused and",
                    "35:283": "I'm ready to go",
                    "36:779": "Ready to go",
                    "38:593": "Na na",
                    "49:519": "I like losing control",
                    "1:6:798": "Hahaha",
                    "1:8:748": "Oh yeah",
                    "1:12:58": "Are we talking",
                    "1:13:65": "'bout losing control?",
                    "1:15:287": "I'mma show you",
                    "1:16:1": "how we lose control baby",
                    "1:18:335": "haha",
                    "1:19:877": "Watch this",
                    "1:21:237": "Look, look",
                    "1:22:779": "Marvin, marv (yeah)",
                    "1:24:140": "Watch the way I start up(yeah)",
                    "1:25:500": "I've been going hard,",
                    "1:26:861": "I can go way harder (aha)",
                    "1:28:493": "Every beat I'm on,",
                    "1:29:854": "yeah you know that I spot her",
                    "1:31:634": "and Im always looking gorgeous",
                    "1:32:904": "Chillingwith somebody daughter",
                    "1:34:673": "Yeah, she loves me (me)",
                    "1:35:988": "Said she love the way my chain",
                    "1:37:484": "Sit and cut the blade",
                    "1:39:72": "And of course she says my name",
                    "1:40:659": "If you want a way (aha)",
                    "1:42:156": "To let you know we spent bloke",
                    "1:43:652": "Always winning check the score",
                    "1:45:466": "I'm only losing control, oh",
                    "1:46:323": "I like losing control",
                    "1:51:135": "I get high when",
                    "1:52:360": "I'm feeling my flow",
                    "1:54:264": "My mind is focused",
                    "1:55:262": "and I'm ready to go",
                    "1:57:212": "Ready to go",
                    "1:59:208": "na na",
                    "2:11:215": "I get high when",
                    "2:12:712": "Im feeling my flow",
                    "2:14:617": "Na, na",
                    "2:15:650": "Losing control",
                    "2:16:158": "Losing control",
                    "2:17:1": "(Losing control)",
                    "2:18:2": ".Losing control.",
                    "2:19:3": "..Losing control..",
                    "2:20:3": "...Losing control...",
                    "2:21:3": "..Losing control..",
                    "2:22:3": ".Losing control.",
                    "2:23:3": "(Losing control)",
                    "2:25:969": "!!!Losing control...",
                    "2:26:500": "..Losing control..",
                    "2:27:500": ".Losing control.",
                    "2:28:500": "..Losing control..",
                    "2:29:500": "...Losing control...",
                    "2:30:500": "..Losing control..",
                    "2:31:500": ".Losing control.",
                    "2:32:500": "..Losing control..",
                    "2:33:500": "...Losing control...",
                    "2:34:9": "(Losing control)",
                    "2:36:452": "Always winning check the score",
                    "2:38:85": "I'm only losing control",
                    "2:39:446": "I like losing control",
                },
            }, {
                name: "Freddie Dredd - Limbo",
                src: "https://cdn.discordapp.com/attachments/1027664063297224734/1080003023234928690/Freddie_Dredd_-_Limbo_Lyrics_1.mp3",
                sync: {
                    "13:750": "Walk around the world,",
                    "15:42": "it feel like every",
                    "16:3": "place the same",
                    "17:1": "I look into your eyes and see",
                    "18:861": "that you are in some pain",
                    "20:28": "Freddie gonna help",
                    "21:70": "the business",
                    "22:1": "help a rope around your neck",
                    "23:70": "Gonna help you make a choice",
                    "24:945": "let it sit, don't let it rest",
                    "26:320": "You a pest, what the f*ck",
                    "27:778": "you left a mess",
                    "28:945": "It's okay, I'll just say that",
                    "30:695": "your body's gone today",
                    "31:820": "You in Hell,",
                    "32:736": "I don't think you failed,",
                    "33:861": "you just made some bail",
                    "35:111": "Come that day, it gets worse",
                    "36:695": "and I hope you f*cking hurt",
                    "38:70": "Now what's the word, captain?",
                    "39:695": "I think I caught you lackin'",
                    "41:486": "There are nine more layers",
                    "43:140": "than this hell's packin'",
                    "44:348": "No tippy tappin', bit*h",
                    "46:431": "I come in rippy rappin'",
                    "47:723": "I feel lucky I'm not you",
                    "49:556": "At the top I do the do",
                    "51:181": "Stuck in the fuc*in' darkness",
                    "52:890": "and it's cold, at heart",
                    "54:265": "Haven't felt sun in some days,",
                    "55:598": "b*tch, where do I start?",
                    "57:681": "Start from the top,",
                    "58:890": "and the next stop the bottom",
                    "1:0:931": "Rock bottom baby,",
                    "1:2:265": "I swear I already got em'",
                    "1:4:983": "Close your eyes",
                    "1:5:774": "and think of something for me",
                    "1:7:399": "Think of all the times that",
                    "1:9:107": "you been feeling kinda lonely",
                    "1:10:857": "What could you do with your",
                    "1:12:268": "time instead?",
                    "1:13:434": "What? You smoking weed,",
                    "1:14:934": "you f*ck your b*tch and",
                    "1:15:809": "go to bed",
                    "1:16:934": "Notice all the colors that you",
                    "1:18:559": "seeing in your head",
                    "1:19:893": "Now strip away that s*it and",
                    "1:21:393": "feel the darkness,",
                    "1:22:309": "feel it spread",
                    "1:23:434": "This is what is like to be",
                    "1:24:601": "known as d*ad",
                    "1:26:601": "Now open up your eyes,",
                    "1:27:684": "you see the world it is red",
                    "1:29:226": "Now what's the word, captain?",
                    "1:30:893": "I think I caught you lackin",
                    "1:32:601": "There are nine more layers",
                    "1:34:309": "than this hell's packin'",
                    "1:35:726": "No tippy tappin', b*tch",
                    "1:37:330": "I come in rippy rappin'",
                    "1:38:996": "I feel lucky I'm not you",
                    "1:40:621": "At the top I do the do",
                    "1:42:163": "Stuck in the fu*kin' darkness",
                    "1:43:905": "and it's cold, at heart",
                    "1:45:572": "Haven't felt sun in some days",
                    "1:46:738": "b*tch, where do I start?",
                    "1:48:863": "Start from the top,",
                    "1:50:277": "Rock bottom baby,",
                    "1:53:568": "I swear I already got em'",
                    "1:55:27": "Now what's the word, captain?",
                    "1:56:443": "I think I caught you lackin'",
                    "1:58:193": "There are nine more layers",
                    "2:0:235": "than this hell's packin'",
                    "2:1:485": "No tippy tappin', b*tch",
                    "2:2:985": "I come in rippy rappin'",
                    "2:4:402": "I feel lucky I'm not you",
                    "2:6:193": "At the top I do the do",
                    "2:7:652": "Stuck in the f*ckin' darkness",
                    "2:9:402": "and it's cold, at heart",
                    "2:10:985": "Haven't felt sun in some days",
                    "2:12:610": "b*tch, where do I start?",
                    "2:14:568": "Start from the top,",
                    "2:15:943": "and the next stop the bottom",
                    "2:17:652": "Rock bottom baby,",
                    "2:19:110": "I swear I already got em'",
                },
            },{
                name: "xxxmanera - NFS",
                src: "https://cdn.discordapp.com/attachments/851750266256228392/1090576090982011040/xxxmanera_-_NFS_Prod._by_Klimonglue.mp3",
                sync: {
                    "8:583": "Manera wanna fly",
                    "9:803": "Let me do it right",
                    "10:901": "I'm NFS in BMW",
                    "12:489": "You are take L, Pussy down",
                    "14:123": "She be screaming well",
                    "15:130": "Instead I quite as hell",
                    "16:125": "Grow speed on a dash",
                    "18:53": "Slidin' when I past",
                    "19:200": "Foenem just off the Xans",
                    "20:465": "Ayy Bitch, we do not friends",
                    "22:99": "Bitch I smoke on private jet",
                    "23:737": "Pilot just took a bean",
                    "25:58": "Hop inside a phantom",
                    "26:143": "I smoke another green",
                    "28:78": "Smoking from windows tint",
                    "29:473": "Team is Fucking fiends",
                    "30:783": "Life is realest dream",
                    "32:50": "Let me do my Shit,",
                    "33:40": "Let me do my Shit.",
                    "34:30": "With this sounds slaps",
                    "35:90": "With this heads bop",
                    "36:90": "Whachu' mean?",
                    "37:5": "Watch me going far",
                    "38:30": "And I going fast",
                    "39:80": "Watch your dream",
                    "39:880": "Where I'm going hard",
                    "40:830": "Bitch I'm so far",
                    "42:5": "And I feel like a one of stars",
                    "43:500": "Bitch I getting hot",
                    "44:600": "I'm NFS in BMW",
                    "46:220": "You are take L, Pussy down",
                    "48:100": "She be screaming well",
                    "49:90": "Instead I quite as hell",
                    "50:99": "Grow speed on a dash",
                    "51:930": "Slidin' when I past",
                    "53:90": "Foenem just off the Xans",
                    "54:800": "Ayy Bitch, we do not friends",
                    "56:100": "Bitch I smoke on private jet",
                    "57:70": "Pilot just took a bean",
                    "58:100": "Hop inside a phantom",
                    "59:200": "And I smoke a green",
                    "1:0:190": "Smoking from windows tint",
                    "1:1:670": "Team is Fucking fiends",
                    "1:2:880": "Life is realest dream",
                    "1:3:740": "Let me do my Shit",
                    "1:4:830": "Let (Let-Let-Let)",
                    "1:5:599": "Let me do my Shit, Let my Shit",
                    "1:7:680": "With this sounds slaps",
                    "1:8:770": "With this heads bop",
                    "1:9:840": "Whachu' really mean?",
                    "1:10:850": "Watch me going far",
                    "1:11:940": "And I going fast",
                    "1:13:40": "Watch your dream",
                    "1:13:820": "Where I'm going hard",
                    "1:14:790": "Bitch I'm so far",
                    "1:15:833": "And I feel like a one of stars",
                    "1:17:160": "and I getting hot, Bitch",
                },
            }, {
                name: "Take Me Home",
                src: "https://cdn.discordapp.com/attachments/851750266256228392/1090178686814261288/Aero_Chord_-_Take_Me_Home_ft._Nevve.mp3",
                sync: {
                    "0:00": "Get your body,",
                    "1:121": "On my body",
                    "3:273": "La, la, la, la, la",
                    "6:73": "La, la, la, la, la",
                    "9:109": "I know you want me",
                    "11:129": "Baby let's stop talking",
                    "13:920": "I'll be in my zone",
                    "16:92": "'till you take me home",
                    "19:155": "I know you want me",
                    "21:89": "You already got me",
                    "24:69": "Got me in my zone",
                    "26:112": "'till you take me home",
                    "29:709": "(I know you-)",
                    "30:400": "Get your body",
                    "32:84": "On my body",
                    "40:176": "He got out the car",
                    "41:164": "she said (I'll stay inside)",
                    "43:881": "Put his mask on",
                    "45:100": "load his four-four",
                    "47:181": "Prayed to God",
                    "47:822": "and then he opened up the door",
                    "50:782": "Point his gun and said",
                    "51:990": "Don't nobody move,",
                    "53:880": "Just give me all the money,",
                    "55:313": "and we all cool.",
                    "57:484": "He told the teller",
                    "58:440": "Please don't try no funny sh*t",
                    "1:0:341": "Cause if you try some sh*t",
                    "1:2:103": "I'll shoot up this b*tch.",
                    "1:4:139": "She said okay and gave him",
                    "1:5:87": "'bout a hundred K",
                    "1:7:469": "He started walkin' backwards",
                    "1:9:109": "then he ran away",
                    "1:11:196": "When he got outside",
                    "1:12:150": "he saw a lot of cops",
                    "1:14:617": "Ran to the side of the bank",
                    "1:18:43": "(Hands behind your back,",
                    "1:19:114": "spread your feet, sir)",
                    "1:21:182": "He turned around and saw",
                    "1:22:226": "that it was Tesha, d*mn",
                    "1:25:75": "Now he locked up",
                    "1:26:103": "his bond a million",
                    "1:28:173": "He locked in a cell",
                    "1:29:265": "with a Brazilian",
                    "1:31:838": "Rico cellmate name is Pedro",
                    "1:35:225": "Pedro said he know",
                    "1:36:260": "how to get them pesos",
                    "1:38:665": "Rico dead broke",
                    "1:39:656": "and he ain't got no bond",
                    "1:41:885": "But Pedro got connects",
                    "1:43:144": "and paid Rico's bond",
                    "1:45:284": "Rico out of jail",
                    "1:46:800": "and he met the plug",
                    "1:48:883": "Started movin' bricks",
                    "1:50:11": "and got his bands up",
                    "1:52:351": "Rico went to jail",
                    "1:53:369": "and paid Pedro a visit",
                    "1:55:779": "Pedro looked at Rico and asked",
                    "1:57:79": "How you livin'?",
                    "1:59:106": "Rico said he want out",
                    "2:0:437": "of the dope game",
                    "2:2:93": "But he love that fast money",
                    "2:3:922": "off the cocaine",
                    "2:6:89": "Pedro said he get out",
                    "2:7:169": "in a couple weeks",
                    "2:9:100": "And he need Rico",
                    "2:10:20": "to loan his ass a couple keys",
                    "2:13:50": "Rico said",
                    "2:13:689": "I got you, u know you my homie",
                    "2:16:126": "Pedro told Rico",
                    "2:17:203": "he was the next Tony",
                    "2:19:903": "Rico left then got",
                    "2:21:30": "pulled over by a cop",
                    "2:22:890": "He said, (What?) She said,",
                    "2:24:10": "Excuse me sir u failed to stop",
                    "2:26:223": "He looked close and recognized",
                    "2:27:933": "it was his baby mama",
                    "2:30:93": "He reached under the seat",
                    "2:31:102": "and grabbed his f*ckin' llama",
                }
            }, {
                name: "rarin - GTA",
                src: "https://cdn.discordapp.com/attachments/1076948561561923676/1078697997443014656/rarin-gta_456477569.mp3",
                sync: {
                    "2:890": "Get a bag",
                    "3:530": "And I'm out, Yeah",
                    "5:90": "(Yeahhh)",
                    "6:30": "Shorty on my lap now",
                    "7:980": "(Yeahh)",
                    "9:90": "And she playing",
                    "9:830": "with the gang now",
                    "12:700": "Flip a bag",
                    "13:326": "Now I'm swearving in a tesla",
                    "15:777": "Got my back",
                    "16:339": "Shawty with me",
                    "17:125": "Yeah, I stepped up",
                    "19:15": "GTA, F*ck the opps",
                    "20:189": "Ain't no Lester",
                    "22:203": "Lets do this, hah",
                    "25:80": "Flip a bag",
                    "25:738": "Now I'm swearving in a tesla",
                    "28:120": "Got my back",
                    "28:880": "Shawty with me",
                    "29:670": "Yeah, I stepped up",
                    "31:108": "GTA, F*ck the opps",
                    "32:590": "Ain't no Lester",
                    "34:120": "Shawty born to be my angel",
                    "35:980": "Yeah, I'm blessed up",
                    "37:280": "Cooking right up in the stu'",
                    "39:10": "gotta check the fan",
                    "40:448": "Yeah I'm watching out for opps",
                    "42:45": "Yeah, they not my fans",
                    "43:635": "People treat me",
                    "44:348": "Like I'm something",
                    "45:130": "Cause I got some bands",
                    "46:630": "Was a LONER that was hustling",
                    "48:200": "now I'm filling stands",
                    "49:963": "I been sticking to my paper",
                    "51:283": "Like I am a staple",
                    "53:23": "I ain't going 'bout this safer",
                    "54:633": "I ain't really able",
                    "56:80": "I been getting all this cash",
                    "57:693": "I don't need a label",
                    "59:100": "Made it up from nothing fast",
                    "1:0:823": "Yeah, this is a fable",
                    "1:2:233": "Now they always hit me up",
                    "1:3:893": "got me feeling fuego",
                    "1:5:100": "Got me always plugged up",
                    "1:7:000": "I ain't talking cable",
                    "1:8:153": "Spreading all my money cash",
                    "1:10:20": "right up, on the table",
                    "1:11:211": "Shawty turn into a fan",
                    "1:13:80": "Yeah, this is a fable",
                    "1:14:93": "I looking a little toxic baby",
                    "1:15:835": "but don't be AFRAID",
                    "1:17:360": "Baby you a goddess",
                    "1:18:150": "you expensive like the Wraith",
                    "1:20:256": "We could mess around",
                    "1:22:234": "maybe plan a trip to Spain",
                    "1:23:264": "All you gotta do",
                    "1:24:564": "is come to me",
                    "1:25:135": "we on our way, wayyyyy",
                    "1:27:93": "Flip a bag",
                    "1:27:690": "Now I'm swerving in a tesla",
                    "1:30:20": "Got my back",
                    "1:30:780": "Shawty with me",
                    "1:31:435": "Yeah, I stepped up",
                    "1:33:93": "GTA, f*ck the opps",
                    "1:34:645": "Ain't no Lester",
                    "1:36:82": "Shawty born to be my angel",
                    "1:37:956": "Yeah I'm blessed up",
                    "1:39:456": "Cooking right up in the stu'",
                    "1:41:2": "gotta check the fan",
                    "1:42:678": "Yeah I'm watching our for opps",
                    "1:44:50": "Yeah, they not my fans",
                    "1:45:675": "People treat me",
                    "1:45:356": "Like I'm something",
                    "1:46:130": "Cause I got some bands",
                    "1:48:653": "Was a LONER that was hustling",
                    "1:50:83": "now I'm filling stands",
                },
            }, {
                name: "Ghost",
                src: "https://cdn.discordapp.com/attachments/851750266256228392/1088242460012064840/Confetti_-_Ghost_musmore.com.mp3",
                sync: {
                    "0:829": "(La-La-La-La)",
                    "2:97": "(La-La-La-La)",
                    "3:100": "(La-La, La-La)",
                    "6:120": "Look I don't want to fight you",
                    "8:10": "You got to know",
                    "8:933": "that I meant it when I said",
                    "10:85": "that I liked you",
                    "11:877": "Or maybe just the idea",
                    "14:10": "I bought it, don't want it",
                    "15:109": "now return that sh*t like IKEA",
                    "17:128": "Apologize Im not a mind reader",
                    "19:120": "I need attention",
                    "20:41": "so I try to be a crowd-pleaser",
                    "22:155": "It was easy",
                    "22:895": "till it got a little deeper",
                    "24:310": "Now I don't know how to",
                    "25:128": "deal with you",
                    "25:917": "so I'ma disappear",
                    "27:838": "I'm a ghost",
                    "30:37": "Now you see me, now you don't",
                    "33:429": "I'm a ghost",
                    "35:720": "Every time you hit the phone",
                    "39:69": "I'm a ghost",
                    "40:125": "(La-La-La-La)",
                    "41:802": "(La-La-La-La)",
                    "42:783": "(La-La, La-La)",
                    "44:74": "Now you see me, now you don't",
                    "45:842": "(La-La-La-La)",
                    "47:109": "(La-La-La-La)",
                    "48:139": "(La-La, La-La)",
                    "50:849": "I know it's inconvenient",
                    "53:99": "To change your background",
                    "54:210": "But let's back down",
                    "55:90": "So you can see",
                    "56:109": "this is a problem",
                    "56:907": "I don't wanna put myself",
                    "58:79": "in front of",
                    "58:754": "That's why I blocked you",
                    "59:697": "Cause I'm not the guy",
                    "1:0:669": "You should rely on",
                    "1:1:406": "Or spy on",
                    "1:2:834": "Creep on",
                    "1:3:521": "I don't   know",
                    "1:4:893": "You just aint that type of hoe",
                    "1:7:614": "If I don't holler, let me go",
                    "1:10:33": "I should have said it",
                    "1:10:979": "But I didn't and I won't",
                    "1:13:17": "I'm a ghost",
                    "1:15:90": "Now you see me, now you don't",
                    "1:18:371": "I'm a ghost",
                    "1:20:899": "Every time you hit the phone",
                    "1:24:154": "I'm a ghost",
                    "1:25:155": "(La-La-La-La)",
                    "1:26:894": "(La-La-La-La)",
                    "1:27:833": "(La-La, La-La)",
                    "1:29:91": "Now you see me, now you don't",
                    "1:31:18": "(La-La-La-La)",
                    "1:32:100": "(La-La-La-La)",
                    "1:33:209": "(La-La, La-La)",
                    "1:35:452": "I know you",
                    "1:36:72": "Hate me, hate me, hate me",
                    "1:37:129": "Hate me, hate me",
                    "1:38:216": "Cause I been shady,",
                    "1:39:156": "shady, shady, shady, shady",
                    "1:41:596": "I don't get reception,",
                    "1:43:189": "missed your call",
                    "1:44:109": "but best believe",
                    "1:44:937": "I got the message",
                    "1:46:97": "Why don't you",
                    "1:47:101": "Just, leave me, alone",
                    "1:51:820": "I think its la-sted",
                    "1:54:240": "way too long",
                    "1:57:495": "I thought by now",
                    "1:59:203": "That you would know",
                    "2:3:87": "But since you",
                    "2:4:98": "Doooooooooooooooooooooooooon't",
                    "2:8:67": "Doooooooooooooooooooooooooon't",
                    "2:9:84": "I'm a ghost",
                    "2:11:315": "Now you see me, now you don't",
                    "2:15:44": "I'm a ghost",
                    "2:17:99": "Every time you hit the phone",
                    "2:20:768": "I'm a ghost",
                    "2:21:839": "(La-La-La-La)",
                    "2:23:90": "(La-La-La-La)",
                    "2:24:50": "(La-La, La-La)",
                    "2:25:871": "Now you see me, now you don't",
                    "2:27:206": "(La-La-La-La)",
                    "2:28:916": "(La-La-La-La)",
                    "2:29:963": "(La-La, La-La)",
                },
            }, {
                name: "Rico Story 1",
                src: "https://cdn.discordapp.com/attachments/1073944551825346590/1086378361925947483/speaker-knockerz_rico-story_.mp3",
                sync: {
                    "14:212": "(It's a speaker knockerz)",
                    "16:501": "Rico got no money",
                    "17:673": "he done lost his job",
                    "19:873": "He ain't got no choice",
                    "21:109": "but to jugg and rob",
                    "23:129": "He f*cked a b*tch named Tesha",
                    "24:420": "got one on the way",
                    "26:772": "Got kicked out the house",
                    "27:725": "now he stay at her place",
                    "30:19": "He told her",
                    "30:669": "Baby lets go rob a f*ckin bank",
                    "33:212": "She said okay, and then",
                    "34:559": "they filled the gas tank",
                    "37:50": "Pulled up to the bank",
                    "38:104": "he parked on the side",
                    "40:176": "He got out the car",
                    "41:164": "she said (I'll stay inside)",
                    "43:881": "Put his mask on",
                    "45:100": "load his four-four",
                    "47:181": "Prayed to God",
                    "47:822": "and then he opened up the door",
                    "50:782": "Point his gun and said",
                    "51:990": "Don't nobody move,",
                    "53:880": "Just give me all the money,",
                    "55:313": "and we all cool.",
                    "57:484": "He told the teller",
                    "58:440": "Please don't try no funny sh*t",
                    "1:0:341": "Cause if you try some sh*t",
                    "1:2:103": "I'll shoot up this b*tch.",
                    "1:4:139": "She said okay and gave him",
                    "1:5:87": "'bout a hundred K",
                    "1:7:469": "He started walkin' backwards",
                    "1:9:109": "then he ran away",
                    "1:11:196": "When he got outside",
                    "1:12:150": "he saw a lot of cops",
                    "1:14:617": "Ran to the side of the bank",
                    "1:18:43": "(Hands behind your back,",
                    "1:19:114": "spread your feet, sir)",
                    "1:21:182": "He turned around and saw",
                    "1:22:226": "that it was Tesha, d*mn",
                    "1:25:75": "Now he locked up",
                    "1:26:103": "his bond a million",
                    "1:28:173": "He locked in a cell",
                    "1:29:265": "with a Brazilian",
                    "1:31:838": "Rico cellmate name is Pedro",
                    "1:35:225": "Pedro said he know",
                    "1:36:260": "how to get them pesos",
                    "1:38:665": "Rico dead broke",
                    "1:39:656": "and he ain't got no bond",
                    "1:41:885": "But Pedro got connects",
                    "1:43:144": "and paid Rico's bond",
                    "1:45:284": "Rico out of jail",
                    "1:46:800": "and he met the plug",
                    "1:48:883": "Started movin' bricks",
                    "1:50:11": "and got his bands up",
                    "1:52:351": "Rico went to jail",
                    "1:53:369": "and paid Pedro a visit",
                    "1:55:779": "Pedro looked at Rico and asked",
                    "1:57:79": "How you livin'?",
                    "1:59:106": "Rico said he want out",
                    "2:0:437": "of the dope game",
                    "2:2:93": "But he love that fast money",
                    "2:3:922": "off the cocaine",
                    "2:6:89": "Pedro said he get out",
                    "2:7:169": "in a couple weeks",
                    "2:9:100": "And he need Rico",
                    "2:10:20": "to loan his ass a couple keys",
                    "2:13:50": "Rico said",
                    "2:13:689": "I got you, u know you my homie",
                    "2:16:126": "Pedro told Rico",
                    "2:17:203": "he was the next Tony",
                    "2:19:903": "Rico left then got",
                    "2:21:30": "pulled over by a cop",
                    "2:22:890": "He said, (What?) She said,",
                    "2:24:10": "Excuse me sir u failed to stop",
                    "2:26:223": "He looked close and recognized",
                    "2:27:933": "it was his baby mama",
                    "2:30:93": "He reached under the seat",
                    "2:31:102": "and grabbed his f*ckin' llama",
                }
            }, {
                name: "xxxmanera - Loyalty Before Royalty",
                src: "https://cdn.discordapp.com/attachments/851750266256228392/1090196343143804948/xxxmanera_-_Loyalty_Before_Royalty_musmore.com.mp3",
                sync: {
                    "12:79": "Ah, I don't even know, ah",
                    "13:730": "Why I lost a friend, hey",
                    "15:57": "But you know",
                    "15:765": "I still, keep gridin', yea",
                    "17:855": "Starting gettin' bread, yeah",
                    "19:46": "Get my momma help, yeah",
                    "20:115": "Yeah, you know my boy",
                    "21:126": "you make me shining, ah",
                    "23:37": "Every time I feel, uh",
                    "24:100": "Like I keep it real, ah",
                    "25:904": "When I even get my diamond, yh",
                    "28:63": "Diamonds on me frozed, frozed",
                    "29:715": "Biting and it hurts, yeah",
                    "31:62": "Shit is look like even",
                    "32:13": "Yeah, get fightin', yeah",
                    "33:47": "Wake up in the mornin'",
                    "34:57": "with my style Shit insane, huh",
                    "35:158": "I'm going hard, feelin' like",
                    "37:29": "I really never change though",
                    "38:109": "Back to old me, yeah",
                    "40:69": "I was lonely, yeah",
                    "41:100": "Never know",
                    "42:60": "that I'm goin' riding foreign",
                    "43:227": "Yea-yea, ah-ah-ah",
                    "45:329": "I'm so fly",
                    "46:225": "Yeah, my money doubleup",
                    "47:794": "bands, go die",
                    "49:25": "I saw that Bitch",
                    "49:816": "I might go like, then wassup",
                    "51:854": "Yeah, I saw her before",
                    "53:55": "I take her tonight",
                    "54:903": "Ah, I don't even know, ah",
                    "56:82": "Why I lost a friend, hey",
                    "57:814": "But you know",
                    "58:439": "I still, keep gridin', yea",
                    "1:0:100": "Starting gettin' bread, yeah",
                    "1:1:802": "Get my momma help, yeah",
                    "1:3:82": "Yeah, you know my boy",
                    "1:4:82": "you make me shining, ah",
                    "1:5:745": "Every time I feel, uh",
                    "1:7:55": "Like I keep it real, ah",
                    "1:8:103": "When I even get my diamond, yh",
                    "1:11:92": "Diamonds on me frozed, frozed",
                    "1:12:99": "Biting and it hurts, yeah",
                    "1:13:51": "Shit is look like even",
                    "1:14:931": "Yeah, get fightin', yeah",
                },
            }, {
                name: "xxxmanera - Sosa! Baby",
                src: "https://cdn.discordapp.com/attachments/851750266256228392/1090994870786723880/xxxmanera-sosa-baby_456582572.mp3",
                sync: {
                    "0:83": "Sosa Baby, uh-uh",
                    "1:653": "Sosa Baby (Yeah, wha')",
                    "3:41": "Sosa Baby",
                    "4:19": "Look at me, now I'm ready",
                    "6:63": "Sosa Baby (Uh-uh)",
                    "7:730": "Sosa Baby (Yeah, wha')",
                    "9:55": "Sosa Baby",
                    "9:853": "Look at me, now I'm",
                    "11:30": "Back in a days",
                    "12:85": "When I used to dream",
                    "13:99": "about this dollar sign",
                    "14:300": "Bitch so crazy",
                    "15:98": "How this make me",
                    "16:6": "Write the Fucking hella rhymes",
                    "17:99": "And I tryin make it right",
                    "19:13": "Wanna make my pockets tight",
                    "20:103": "Everyday I wanna baggin'",
                    "22:50": "I got baggin' on my mind",
                    "23:70": "Back in a days",
                    "24:90": "When I used to dream",
                    "25:30": "about this dollar sign",
                    "26:150": "Bitch so crazy",
                    "27:60": "How this make me",
                    "28:50": "Write the Fucking hella rhymes",
                    "29:140": "And I tryin make it right",
                    "31:40": "Wanna make my pockets tight",
                    "32:250": "Everyday I wanna baggin'",
                    "34:20": "I got baggin' on my mind",
                    "35:85": "I know she wait on me",
                    "36:200": "Cause I sound like nobody",
                    "38:50": "She just tryna get it in",
                    "39:200": "But I feel like no one need",
                    "41:80": "Yeah, cold blood and is it",
                    "43:49": "Drunk Hennessy",
                    "44:30": "All I do is tryna get rich",
                    "46:10": "Look at me (Yeah, wow, yeah)",
                    "47:700": "I want my Lamborghini fits",
                    "49:5": "with my eyes colour",
                    "50:70": "Yeah, I wanna riding Mazzerati",
                    "52:20": "Let this cops swallow dust",
                    "53:120": "Buy the castle all cost",
                    "55:4": "Bitch we trapin like a russian",
                    "56:320": "It is money on my mind",
                    "57:940": "So I never stop rushin'",
                    "59:60": "Back in a days",
                    "1:0:80": "When I used to dream",
                    "1:1:59": "about this dollar sign",
                    "1:2:90": "Bitch so crazy",
                    "1:3:60": "How this make me",
                    "1:4:20": "Write the Fucking hella rhymes",
                    "1:5:130": "And I tryin make it right",
                    "1:7:20": "Wanna make my pockets tight",
                    "1:8:140": "Everyday I wanna baggin'",
                    "1:10:20": "I got baggin' on my mind",
                    "1:11:60": "Back in a days",
                    "1:12:93": "When I used to dream",
                    "1:13:80": "about this dollar sign",
                    "1:14:90": "Bitch so crazy",
                    "1:15:60": "How this make me",
                    "1:16:40": "Write the Fucking hella rhymes",
                    "1:17:100": "and I tryin make it right",
                    "1:19:10": "Wanna make my pockets tight",
                    "1:20:60": "Everyday I wanna baggin'",
                    "1:22:50": "I got baggin' on my mind",
                    "1:23:120": "I know she wait on me",
                    "1:24:300": "Cause I sound like nobody",
                    "1:26:30": "She just tryna get it in",
                    "1:27:120": "But I feel like no one need",
                    "1:29:60": "Yeah, cold blood and is it",
                    "1:31:5": "Drunk Hennessy",
                    "1:32:50": "All I do is tryna get rich",
                    "1:34:10": "Look at me (Yeah-yeah)",
                    "1:36:20": "Sosa Baby (Wha')",
                    "1:37:800": "Sosa Baby (Ayy)",
                    "1:39:80": "Sosa Baby (Wha')",
                    "1:40:720": "Sosa Baby",
                },
            }, {
                name: "xxxmanera - Dead Idol",
                src: "https://cdn.discordapp.com/attachments/851750266256228392/1090186949488279573/xxxmanera_-_Dead_Idol_musmore.com.mp3",
                sync: {
                    "13:97": "I've write that sh1t again",
                    "14:107": "that splash again, hold up",
                    "15:800": "Young minds cant stand,hold up",
                    "17:105": "Drip on me, cocaine colour",
                    "19:85": "Look like I'm a dead idol",
                    "20:107": "Oh man godDamn, okay",
                    "22:118": "I'm tired of be alone",
                    "23:829": "I got a fame, the faith",
                    "25:768": "That say, 'I gotta play'",
                    "27:60": "I gotta say",
                    "28:81": "a lot, to people in a crowd",
                    "30:505": "Don't need no think,",
                    "31:905": "I'm smart.",
                    "32:810": "This Shit don't warm my heart",
                    "34:38": "I feel like, Damn,",
                    "35:87": "Whachu' really mean?",
                    "36:108": "I ain't play saints",
                    "37:867": "I'm just sayin'",
                    "38:800": "I don't know, how this sh1t",
                    "40:19": "just up my bands?",
                    "41:99": "Are you mad or nah?",
                    "42:125": "you take a loss",
                    "43:102": "Can't understand your feelings",
                    "44:640": "duh, dont Fuck about the Bitch",
                    "46:92": "like boss",
                    "51:979": "You know my name",
                    "52:700": "but wrist ain't frozed",
                    "53:904": "This photo, Bitch",
                    "54:689": "just take a pose",
                },
            }, {
                name: "CRVN x Zack Merci - Nobody",
                src: "https://cdn.discordapp.com/attachments/851750266256228392/1093939618765873172/Zack_Merci_-_Nobody_feat._CRVN.mp3",
                sync: {
                    "15:879": "Children used to run and play",
                    "18:730": "Look at all the mess we made",
                    "21:747": "Guess I never know",
                    "22:795": "Where it went wrong",
                    "27:155": "Sometimes I feel like",
                    "28:99": "all that's sad",
                    "30:99": "Goes viral then people forget",
                    "33:666": "In this crazy world",
                    "34:557": "I don't belong",
                    "38:986": "I see fire burning",
                    "41:84": "but I close my eyes",
                    "43:98": "(I'd rather deny that)",
                    "44:992": "Everything is falling",
                    "47:62": "out of place...",
                    "50:93": "I see trees ripped",
                    "52:97": "from the ground, but",
                    "54:87": "Nobody makes a sound",
                    "57:12": "I see fire burning",
                    "59:19": "But I'm fine",
                    "1:1:39": "Now I am nobody",
                    "1:13:80": "Now I am nobody",
                    "1:39:300": "The future feels so unsure",
                    "1:42:700": "Didn't we deserve more?",
                    "1:45:103": "The burden that you left",
                    "1:46:943": "is way too heavy for me",
                    "1:51:890": "Do you ever feel",
                    "1:52:930": "Like the world will die out?",
                    "1:54:120": "My anxiety's",
                    "1:55:930": "off the roof, I cry out",
                    "1:57:750": "We have gone too far",
                    "1:58:700": "Take me back right now",
                    "2:3:1": "I see fire burning",
                    "2:5:50": "but I close my eyes",
                    "2:7:100": "(I'd rather deny that)",
                    "2:9:1": "Everything is falling",
                    "2:11:0": "out of place...",
                    "2:14:50": "I see the trees ripped",
                    "2:16:50": "from the ground, but",
                    "2:18:60": "Nobody makes a sound",
                    "2:21:0": "I see fire burning",
                    "2:23:30": "But I'm fine",
                    "2:25:30": "Now I am nobody",
                    "2:49:13": "Now I am nobody",
                },
            }, {
                name: "Cheriimoya, Sierra Kidd - Living Life In The Night",
                src: "https://cdn.discordapp.com/attachments/851750266256228392/1094196032650362891/Cheriimoya_Sierra_Kidd_-_Living_Life_In_The_Night.mp3",
                sync: {
                    "15:937": "Lord knows and I think",
                    "17:53": "I know it too sometimes",
                    "19:20": "Everytime, and",
                    "20:18": "they reachin out for",
                    "21:185": "what's mine",
                    "22:70": "Lord knows and I think",
                    "23:918": "I know it too sometimes",
                    "25:869": "Everytime, and",
                    "26:908": "they reachin out for",
                    "28:20": "what's mine",
                    "28:700": "I've been awake for days",
                    "30:5": "so we out living life",
                    "31:150": "in the night",
                    "32:90": "Pray to God",
                    "33:80": "Man I hope I don't die",
                    "34:988": "I've been awake for days",
                    "36:220": "so we out living life",
                    "38:70": "in the night",
                    "39:15": "Pray to God",
                    "40:19": "Man I hope I don't die",
                    "41:120": "in the night",
                    "42:105": "Lord knows and I think",
                    "44:25": "I know it too sometimes",
                    "45:993": "Everytime, and",
                    "47:12": "they reachin out for",
                    "48:79": "what's mine",
                    "49:70": "Lord knows and I think",
                    "50:263": "I know it too sometimes",
                    "52:639": "Everytime, and",
                    "53:778": "they reachin out for",
                    "55:56": "what's mine",
                    "55:700": "Two-two, two bedrooms",
                    "57:53": "seven little childs",
                    "58:100": "it can't be right",
                    "59:83": "Call my brother",
                    "1:0:100": "he in prison doin' time",
                    "1:1:863": "but we alright",
                    "1:2:699": "Tried my best just",
                    "1:3:978": "to catch a Fuckin' smile",
                    "1:5:60": "But for now I see myself",
                    "1:7:3": "ain't hittin the thirty-five",
                    "1:8:530": "I've been awake for days",
                    "1:10:31": "so we out living life",
                    "1:12:1": "in the night",
                    "1:12:800": "Pray to God",
                    "1:13:410": "Man I hope I don't die",
                    "1:15:30": "I've been awake for days",
                    "1:17:1": "so we out living life",
                    "1:18:830": "in the night",
                    "1:19:100": "Pray to God",
                    "1:20:50": "Man I hope I don't die",
                    "1:22:1": "in the night",
                    "1:22:900": "Lord knows and I think",
                    "1:24:33": "I know it too sometimes",
                    "1:26:20": "Everytime, and",
                    "1:27:63": "they reachin out for",
                    "1:28:803": "what's mine",
                    "1:29:200": "Lord knows and I think",
                    "1:31:3": "I know it too sometimes",
                    "1:32:990": "Everytime, and",
                    "1:34:20": "they reachin out for",
                    "1:35:50": "what's mine",
                    "1:35:930": "Two-two, two bedrooms",
                    "1:37:60": "seven little childs",
                    "1:38:560": "it can't be right",
                    "1:39:700": "Call my brother",
                    "1:40:230": "he in prison doin' time",
                    "1:42:30": "but we alright",
                    "1:43:1": "Tried my best just",
                    "1:44:30": "to catch a Fuckin' smile",
                    "1:45:200": "But for now I see myself",
                    "1:47:45": "ain't hittin the thirty-five",
                    "1:48:853": "I've been awake for days",
                    "1:50:67": "so we out living life",
                    "1:52:30": "in the night",
                    "1:53:50": "Pray to God",
                    "1:53:950": "Man I hope I don't die",
                    "1:55:30": "I've been awake for days",
                    "1:57:73": "so we out living life",
                    "1:59:1": "in the night",
                    "1:59:773": "Pray to God",
                    "2:0:220": "Man I hope I don't die",
                    "2:2:80": "in the night",
                    "2:3:13": "Lord knows and I think",
                    "2:4:63": "I know it too sometimes",
                    "2:6:60": "Everytime, and",
                    "2:7:80": "they reachin out for",
                    "2:9:1": "what's mine",
                    "2:9:800": "Lord knows and I think",
                    "2:11:50": "I know it too sometimes",
                    "2:13:90": "Everytime, and",
                    "2:14:50": "they reachin out for",
                    "2:15:700": "what's mine",

                },
            }, {
                name: "Adrenaline - ACE",
                src: "https://cdn.discordapp.com/attachments/1030764523734441985/1081989273361842246/ADRENALINE_-_ACE.mp3",
                sync: {
                    "1:0:816": "Body feels like lava flowin'",
                    "1:3:428": "Hard adrenaline",
                    "1:6:637": "Rushin' though the pain",
                    "1:8:315": "and squeezing",
                    "1:9:449": "Power's runnin' in my veins",
                    "1:11:762": "Fight or flight",
                    "1:13:258": "And my mind turns crazy",
                    "1:15:753": "It's time to do or die",
                    "1:18:746": "Fear thunders in my heart",
                    "1:21:229": "and I, and I",
                    "1:24:721": "Energy, a heart explosion",
                    "1:27:896": "All I need, adrenaline",
                    "1:30:753": "Never stop to is in my mind",
                    "1:33:565": "Fire away, adrenaline",
                    "1:36:785": "Rollercoaster of emotion",
                    "1:39:869": "I just need adrenaline",
                    "1:42:635": "Setting all the worlds afire",
                    "1:45:583": "Energy, adrenaline",
                    "2:1:33": "It's no game, we're messin'",
                    "2:2:847": "'round with",
                    "2:3:981": "Hard adrenaline",
                    "2:7:246": "Waste a wave of hungryfeelings",
                    "2:10:285": "Just bring out the best in me",
                    "2:12:643": "Fight or flight",
                    "2:14:185": "And my mind turns crazy",
                    "2:16:453": "It's time to do or die",
                    "2:19:128": "Fear thunders in my heart",
                    "2:21:940": "and I, and I",
                    "2:25:468": "Energy, a heart explosion",
                    "2:28:371": "All I need, adrenaline",
                    "2:31:545": "Never stop to is in my mind",
                    "2:34:584": "Fire away, adrenaline",
                    "2:37:441": "Rollercoaster of emotion",
                    "2:40:752": "I just need adrenaline",
                    "2:43:563": "Setting all the worlds afire",
                    "2:46:693": "Energy, adrenaline",
                    "3:40:48": "Energy, a heart explosion",
                    "3:42:995": "All I need, adrenaline",
                    "3:45:995": "Never stop to is in my mind",
                    "3:48:995": "Fire away, adrenaline",
                    "3:53:653": "Rollercoaster of emotion",
                    "3:56:374": "I just need adrenaline",
                    "3:59:549": "Setting all the worlds afire",
                    "4:2:542": "Energy, adrenaline",
                    "4:18:160": "A D R E N A L I N E",
                }
            }];
            //Thanks To BySylex For Making Song Chats
            var converToJSDelay = (time) => {
                let newTime = time.split(":").reverse();
                time = 0;
                let convert = [6e4 * 60, 6e4, 1000, 1].reverse();
                newTime.forEach((b, c) => {
                    time += b * convert[c];
                });
                return time;
            };
            songs.forEach(e => {
                let oldDatas = e.sync;
                e.sync = {};
                for (let time in oldDatas) {
                    e.sync[converToJSDelay(time)] = oldDatas[time];
                }
            });

            let songchat1 = new Audio("https://cdn.discordapp.com/attachments/1065969963644506152/1079719316074790953/V_O_E_-_Giants_Extended_Mix_NCS_Release_1.mp3");
            let isPlaying = false;
            let singing = {
                timeouts: []
            }
            function toggleSong() {
                let id = document.getElementById("songy").value;
                if(id > 5) {
                    if (!isPlaying) {
                        songchat1.src = songs[id - 1].src;
                        songchat1.play();
                        for (let time in songs[id - 1].sync) {
                            let message = songs[id - 1].sync[time];
                            singing.timeouts.push(setTimeout(() => {
                                io.send("6", message);
                            }, time));
                        }
                        isPlaying = true;
                    } else {
                        songchat1.pause();
                        isPlaying = false;
                    }
                }
            }
            let bboooo = 120120
            document.addEventListener("keypress", function(e) {
                if (e.key === bboooo) {
                    if(document.getElementById("songy").value > 5) {
                        toggleSong();
                    }
                    if(document.getElementById("songy").value == 1) {
                        cSp = !cSp;
                        cH()
                    }
                    if(document.getElementById("songy").value == 2) {
                        cSp = !cSp;
                        cH2()
                    }

                    if(document.getElementById("songy").value == 3) {
                        cSp = !cSp;
                        cH3()
                    }

                    if(document.getElementById("songy").value == 4) {
                        cSp = !cSp;
                        cH4()
                    }

                    sendChat("started");
                }
            });
            let chatting = false;
            document.addEventListener("keypress", function(e) {
                 if (e.key == "Enter") {
                     chatting = !chatting
                 }
                 if (e.key == "b" && !chatting) {
                     io.send("6", "Pew");
                     console.log("clicked b");
                 }
            });
            function createPath() {
                grid = [];
                checkObject();
            }
            function Pathfinder() {
                pathFind.scale = (config.maxScreenWidth / 2) * 1.3;
                if (!traps.inTrap && (pathFind.chaseNear ? enemy.length : true)) {
                    if (near.dist2 <= items.weapons[player.weapons[0]].range) {
                        packet("9", undefined, 1);
                    } else {
                        createPath();
                        easystar.setGrid(grid);
                        easystar.setAcceptableTiles([0]);
                        easystar.enableDiagonals();
                        let spike = gameObjects.filter(tmp => tmp.dmg && tmp.active && tmp.isTeamObject(player)).sort(function(a, b) {
                            return UTILS.getDist(a, near, 0, 2) - UTILS.getDist(b, near, 0, 2);
                        })[0];
                        easystar.findPath(spike.x, spike.y, pathFind.lastX, pathFind.lastY, function(path) {
                            if (path === null) {
                                pathFind.array = [];
                                if (near.dist2 <= items.weapons[player.weapons[0]].range) {
                                    packet("9", undefined, 1);
                                } else {
                                    packet("9", near.aim2, 1);
                                }
                            } else {
                                pathFind.array = path;
                                if (pathFind.array.length > 1) {
                                    let tmpXY = {
                                        x: (player.x2 - (pathFind.scale / 2)) + ((pathFind.scale / pathFind.grid) * path[1].x),
                                        y: (player.y2 - (pathFind.scale / 2)) + ((pathFind.scale / pathFind.grid) * path[1].y)
                                    }
                                    packet("9", UTILS.getDirect(tmpXY, player, 0, 2), 1);
                                }
                            }
                        });
                        easystar.calculate();

                        console.warn(easystar);
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
                                packet("9", lastMoveDir || undefined, 1);
                            }
                        } else {
                            my.autoPush = true;
                            my.pushData = {
                                x: spike.x + Math.cos(70),
                                y: spike.y + Math.sin(70),
                                x2: pos.x2 + Math.cos(30),
                                y2: pos.y2 + Math.sin(30)
                            };
                            let scale = player.scale / 10;
                            let secondArg = UTILS.getDirect(near, spike, 2, 0) > 70 ? near.aim2 : undefined;
                            if (UTILS.lineInRect(player.x2 - scale, player.y2 - scale, player.x2 + scale, player.y2 + scale, near.x2, near.y2, pos.x, pos.y)) {
                                packet("9", secondArg, 1);
                            } else {
                                packet("9", UTILS.getDirect(pos, player, 2, 2), 1);
                            }
                        }
                    } else {
                        if (my.autoPush) {
                            my.autoPush = false;
                            packet("9", lastMoveDir || undefined, 1);
                        }
                    }
                } else {
                    if (my.autoPush) {
                        my.autoPush = false;
                        packet("9", lastMoveDir || undefined, 1);
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

                    this.socket.send("33", angle);
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

            function secondSocket() {
                let time = Date.now();
                const e = time - second;
                window.pingTime = e;
            }
            const Qt = document.getElementById("pingDisplay")
            // PING:
            var lastPing = -1;
            var maxPing = NaN;
            var minPing = NaN;
            var pingCount = 0;
            var doAutoQ = false;

            function pingSocketResponse() {
                let pingTime = window.pingTime;
                pingCount++;
                if (pingTime > ms.max || isNaN(ms.max)) {
                    ms.max = pingTime;
                }
                if (pingTime < ms.min || isNaN(ms.min)) {
                    ms.min = pingTime;
                }
                // pingDisplay.innerText = "Ping: " + pingTime + " ms | FPS: " + currentFPS + " frames";
                // if (pingTime >= 90) {
                //     doAutoQ = true;
                // } else {
                //     doAutoQ = false;
                // }
            }

            function pingSocket() {
                lastPing = Date.now();
                io.send('0');
            }






            // SETUP GAME:
            var fisrtloadez = false;
            function setupGame(yourSID) {
                keys = {};
                macro = {};
                playerSID = yourSID;
                attackState = 0;
                inGame = true;
                // pingSocketStart();
                // rePing();
                fisrtloadez = true;
                packet("F", 0, getAttackDir(), 1);
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
                        addChatLog("Encountered " + data[2], "#23BD86", "", "#23BD86");
                    }
                } else {
                    if (data[1] != playerSID) {
                        addChatLog("Encountered " + data[2], "#23BD86", "", "#23BD86");
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
                    }
                }
            }
            // REMOVE PLAYER:
            function removePlayer(id) {
                for (let i = 0; i < players.length; i++) {
                    if (players[i].id == id) {
                        let tmpPlayer = players[i];
                        addChatLog(tmpPlayer.name + " has left", "red", "", "red");
                        if (configs.playerLogger) {
							player.chat.message = tmpPlayer.name + " has left";
							player.chat.count = 2000;
						}
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
                        if (tmpObj == near) {
                            let damage = tmpObj.oldHealth - tmpObj.health;
                            if (tmpObj.skinIndex == 7 && (damage == 5 || (tmpObj.latestTail == 13 && damage == 2))) {
                                tmpObj.bullTick = game.tick;
                            }
                        }
                        tmpObj.damaged = tmpObj.oldHealth - tmpObj.health;
                        let damaged = tmpObj.damaged;
                        tmpObj = findPlayerBySID(sid);
                        let bullTicked = false;
                        if (tmpObj && tmpObj.health <= 0) {
                            if (!tmpObj.death) {
                                tmpObj.death = true;
                                if (tmpObj != player) {
                                    console.warn(getAttacker(damaged));
                                    addChatLog(tmpObj.name + " has died", "#db2727", "", "#db2727");
                                    if (configs.playerLogger) {
										player.chat.message = tmpObj.name + " has died";
										player.chat.count = 2000;
									}
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
                                let healTimeout = (1000/9);
                                let slowHeal = function(timer) {
                                    game.tickBase(() => {
                                        healer();
                                    }, 2);
                                }
                                if(antiSync) {
                                    healer();
                                    player.canEmpAnti = false;
                                }
                                let total = 0;
                                if (damaged >= (includeSpikeDmgs ? 8 : 25) && player.damageThreat >= 100 && (game.tick - player.antiTimer) > 1) {
                                    player.canEmpAnti = true;
                                    player.antiTimer = game.tick;
                                    let shame = Math.floor(Math.random() * (6 - 4) + 3);
                                    if (tmpObj.shameCount < shame) {
                                        healer();
                                    } else {
                                        slowHeal(healTimeout);
                                    }
                                } else {
                                    slowHeal(healTimeout);
                                }
                                // if (damaged >= 20 && (player.skinIndex == 11 || near.skinIndex == 53)) instaC.canCounter = true;
                            }
                        } else {
                            if (!tmpObj.setPoisonTick && (tmpObj.damaged == 5 || (tmpObj.latestTail == 13 && tmpObj.damaged == 2))) {
                                tmpObj.setPoisonTick = true;
                            }
                        }
                    } else {
                        if(tmpObj != player) {
                            if(tmpObj.maxShameCount < tmpObj.shameCount) {
                                tmpObj.maxShameCount = tmpObj.shameCount;
                            }
                        }
                    }
                    if (tmpObj.health <= 0) {
                        /*bots.forEach((hmm) => {
                hmm.whyDie = tmpObj.name;
            });*/
                    }
                }
            }
            function enterGame() {
                getEl("ot-sdk-btn-floating").style.display = "none";
                packet("M", {
                        name: "1-lol",
                        moofoll: lastsp[1],
                        skin: lastsp[2]
                    });
            }
            // KILL PLAYER:
            function killPlayer() {
                inGame = false;
                lastDeath = {
                    x: player.x,
                    y: player.y,
                };
                if (configs.autoRespawn) {
                    getEl("ot-sdk-btn-floating").style.display = "none";
                    packet("M", {
                        name: "1-lol",
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
            var ageText = getEl("ageText");
            var ageBarBody = getEl("ageBarBody");
            // UPDATE AGE:
            function updateAge(xp, mxp, age) {
                if (xp != undefined)
                    player.XP = xp;
                if (mxp != undefined)
                    player.maxXP = mxp;
                if (age != undefined)
                    player.age = age;
                if (age == config.maxAge) {
                    ageText.innerHTML = "MAX AGE";
                } else {
                    ageText.innerHTML = "AGE " + player.age;
                    if (getEl("visualType").value == "smiley") {
                        ageBarBody.style.transition = "1s";
                    } else {
                        ageBarBody.style.transition = null;
                    }
                }
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
                        upgradeCounter.style.borderRadius = "4px";
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
                let n = findObj;
                if (n && cdf(player, n) < 200) {
                    if (nears.length) {
                        let enemy = near;
                        let A = player;
                        let dist = cdf(A, enemy);
                        let dir = caf(A, enemy);
                        let dir2 = caf(player, dir + toR(180));//this dir can works to laggy players
                        let ignore = [0, 0];
                        let place = function(t, f) {
                            checkPlace(t, f);
                        }
                        if (dist < 500) {
                            for(let i = 0; i != 2; i++) {
                                if (dist < 200) {
                                    //console.log(dir);
                                    for(let i = 0; i < Math.PI; i += toR(items.list[A.items[2]].scale)) {
                                        let placed;
                                        if (ignore[0]) {
                                            placed = false;
                                            ignore[0]--;
                                        } else {
                                            place(2, (dir || dir2) + i) && (toD(i) < items.list[A.items[2]].scale && (ignore[1] = Math.ceil(items.list[A.items[2]].scale / toD(Math.PI / 12))), placed = true);
                                        }
                                        placed && (ignore[0] = Math.ceil(items.list[A.items[2]].scale / toD(Math.PI / 12)));
                                        if (!placed || UTILS.getAngleDist(dir + i, dir - i) > toR(items.list[A.items[2]].scale)) {
                                            if (ignore[1]) {
                                                ignore[1]--;
                                            } else {
                                                place(2, dir - i) && (ignore[1] = Math.ceil(items.list[A.items[2]].scale / toD(Math.PI / 12)))
                                            }
                                        }
                                    }
                                    place(4, toR(toD(dir) - 180));
                                } else {
                                    let ignore = 0;
                                    if (ignore) {
                                        ignore--;
                                    } else {
                                        for(let i = 0; i < Math.PI/2; i += Math.PI / 3) {
                                            checkPlace(4, dir + i) && (ignore = Math.ceil(50 / Math.PI / 6));
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
            }
            // KILL ALL OBJECTS BY A PLAYER:
            function killObjects(sid) {
                // addChatLog(findPlayerBySID(sid).name + " has left", "red", "", "red");
                if (player) objectManager.removeAllItems(sid);
            }
            function fgdo(a, b) {
                return Math.sqrt(Math.pow((b.y - a.y), 2) + Math.pow((b.x - a.x), 2));
            }
            function perfectReplace() {
                let range = items.weapons[player.weapons[0]].range + 70;
                gameObjects.forEach(tmpObj => {
                    let objDst = UTILS.getDist(tmpObj, player, 0, 2);
                    let perfectAngle = UTILS.getDirect(tmpObj, player, 0, 2);
                    if (tmpObj.health <= 300 && fgdo(tmpObj, player) <= 300 && near.dist2 <= 300 || ((near.length && near.reloads[near.weaponIndex] <= config.tickRate * (window.pingTime >= 200 ? 2 : 1)) || player.reloads[player.weaponIndex]*1000 <= config.tickRate * (window.pingTime >= 200 ? 2 : 1))) {
                        console.log('preplace');
                        // setTickout(() => {
                        place(2, perfectAngle);
                        // }, 2);
                    }
                });
            }




            let ticks = {
                tick: 0,
                delay: 0,
                time: [],
                manage: [],
            };
            // GAME TICKOUT:
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
            // UPDATE PLAYER DATA:
            let nEy;
            let placeableSpikes = [];
            let placeableTraps = [];
            let placeableSpikesPREDICTS = [];
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
            let autoQ = false, canHit = false;
            function updatePlayers(data) {
                //insta prediction
                game.tick++;
                enemy = [];
                // perfectReplace();
                nears = [];
                near = [];
                //showPlace = [];
                game.tickSpeed = performance.now() - game.lastTick;
                game.lastTick = performance.now();
                ticks.tick++;
                ticks.time.push(Date.now() - ticks.delay <= 50 || Date.now() - ticks.delay >= 175 ? "lag" : 1);
                if (ticks.tick % 10 === 0) {
                    ticks.time = [];
                    antiSync = false;
                }
                if (ticks.tick % 300 === 0) {
                    ms.max = window.pingTime;
                    ms.min = window.pingTime;
                    players.forEach((tmp) => {
                        tmp.maxShameCount = 0;
                    })
                }
                ticks.delay = Date.now();
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
                            if (tmpObj == player) {
                                healer();
                            }
                        }

                        if ((window.pingTime > 90 || ms.avg > 90)) {
                            if (player.shameCount < 4 && near.dist2 <= 300 && near.reloads[near.primaryIndex] <= config.tickRate * (window.pingTime >= 200 ? 2 : 1)) {
                                autoQ = true;
                                place(0, getAttackDir());
                            } else {
                                if (autoQ) {
                                    place(0, getAttackDir());
                                }
                                autoQ = false;
                            }
                        }

                        //predictive antibull thx o1rd
                        if (near.dist2 < 300) {
                            if (near.reloads[near.primaryIndex] <= config.tickRate && [3, 4, 5].includes(near.primaryIndex) && [3, 4, 5].includes(player.weapons[0])) {
                                canHit = true;
                            } else {
                                canHit = false;
                            }
                        } else {
                            canHit = false;
                        }
                        if (canHit) {
                            buyEquip(11, 0);
                            buyEquip(21, 1);
                            my.autoAim = true;
                            setTickout(() => {
                                selectWeapon(player.weapons[0]);
                                buyEquip(7, 0);
                                buyEquip(21, 1);
                                sendAutoGather();
                                setTickout(() => {
                                    buyEquip(53, 0);
                                    sendAutoGather();
                                    my.autoAim = false;
                                }, 1)
                            }, 1)
                        }

                        nEy = tmpObj;
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
                                        traps.protect(traps.aim, nearTrap);
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
                if (waitTicks.length) {
                    waitTicks.forEach((ajaj) => {
                        ajaj();
                    }
                                     );
                    waitTicks = [];
                }
                if (runAtNextTick.length) {
                    runAtNextTick.forEach((tmp) => {
                        checkProjectileHolder(...tmp);
                    }
                                         );
                    runAtNextTick = [];
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
                        textManager.showText(pos2.x, pos2.y, 50, 0.18, 500, num2, healTextColor);
                    }
                    if (num > 0) {
                        textManager.showText(pos.x, pos.y, 50, 0.18, 500, num, damageTextColor);
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
                        if (player && player.alive){
                            placeableSpikes = getPlaceablePositions(player, items.list[player.items[2]]);
                            placeableTraps = player.items[4] == 15 ? getPlaceablePositions(player, items.list[player.items[4]]) : [];
                        }

                        near = enemy.sort(function(tmp1, tmp2) {
                            return tmp1.dist2 - tmp2.dist2;
                        })[0];
                    } else {
                        //console.log("no enemy");
                    }
                    if (game.tickQueue[game.tick]) {
                        game.tickQueue[game.tick].forEach((action) => {
                            action();
                        });
                        game.tickQueue[game.tick] = null;
                    }
                    if (advHeal.length) {
                        advHeal.forEach((updHealth) => {

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
                                if (near.dist2 <= 300) {
                                    if (near.reloads[53] == 0 && !my.safePrimary(near) && !my.safeSecondary(near)) {
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
                                    if (configs.combatWarnings) {
                                        player.chat.message = "SpikeTick Threat [ 4 ]";
                                        player.chat.count = 1500;
                                    }
                                }
                            }
                        }
                        let bultect = false;
                        if((game.tick - near.bullTick) % 9 == 0 && near.skinIndex == 7) {
                            addChatLog("Bulltick detected: " + near.name + "[" + near.sid + "]", "#40E0D0", "", "#40E0D0");
                            bultect = true;
                            game.tickBase(() => {
                                bultect = false;
                            }, 1)
                        }

                        if ((getEl("visualType").value == "smiley" ? true : ((player.checkCanInsta(true) >= 100 ? player.checkCanInsta(true) : player.checkCanInsta(false)) >= (player.weapons[1] == 10 ? 95 : 100))) && near.dist2 <= items.weapons[player.weapons[1] == 10 ? player.weapons[1] : player.weapons[0]].range + near.scale * 1.8 && (instaC.wait || (getEl("visualType").value == "smiley" && Math.floor(Math.random() * 2) == 0) || bultect) && ((getEl("visualType").value == "smiley" && near.shameCount >= near.maxShameCount) || (getEl("visualType").value != "smiley" && true)) && !instaC.isTrue && !my.waitHit && player.reloads[player.weapons[0]] == 0 && player.reloads[player.weapons[1]] == 0 && (getEl("visualType").value == "smiley" ? true : getEl("instaType").value == "oneShot" ? (player.reloads[53] <= (player.weapons[1] == 10 ? 0 : game.tickRate)) : true) && instaC.perfCheck(player, near)) {
                            if (player.checkCanInsta(true) >= 100) {
                                instaC.nobull = getEl("visualType").value == "smiley" ? false : instaC.canSpikeTick ? false : true;
                            } else {
                                instaC.nobull = false;
                            }
                            instaC.can = true;
                        } else {
                            instaC.can = false;
                        }

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

                        macro.q && place(0, getAttackDir());
                        macro.f && place(4, getSafeDir());
                        macro.v && place(2, getSafeDir());
                        macro.y && place(1, getSafeDir());
                        macro.h && place(player.getItemType(22), getSafeDir());
                        macro.z && place(3, getSafeDir());
                        if (game.tick % 0.5 == 0) {
                            if (mills.place) {
                                let plcAng = 1.20;
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
                            instaC.changeType(configs.alwaysRevInsta ? "rev" : player.weapons[1] == 10 ? "rev" : instaC.nobull ? "nobull" : "normal");
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
                                }
                            } else {
                                if ([1, 2, 3, 4, 5, 6].includes(player.weapons[0]) && player.reloads[player.weapons[0]] == 0 && !instaC.isTrue) {
                                    instaC.spikeTickType();
                                    if (instaC.syncHit) {
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
                        if (player.weapons[1] && !clicks.left && !clicks.right && !traps.inTrap && !instaC.isTrue && !(getEl("visualType").value == "ae" && near.dist2 <= items.weapons[player.weapons[0]].range + near.scale * 1.8)) {
                            if (player.reloads[player.weapons[0]] == 0 && player.reloads[player.weapons[1]] == 0) {
                                if (!my.reloaded) {
                                    my.reloaded = true;
                                    let fastSpeed = items.weapons[player.weapons[0]].spdMult < items.weapons[player.weapons[1]].spdMult ? 1 : 0;
                                    if (player.weaponIndex != player.weapons[fastSpeed] || player.buildIndex > -1) {
                                        selectWeapon(player.weapons[fastSpeed]);
                                    }
                                }
                                if(getEl("visualType").value == "ae") {
                                    if (!autos.stopspin) {
                                        setTimeout(()=>{
                                            autos.stopspin = true;
                                        }, 500);
                                    }
                                }
                            } else {
                                my.reloaded = false;
                                if(getEl("visualType").value == "ae") {
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
                                    if(getEl("visualType").value == "ae") {
                                        if (!autos.stopspin) {
                                            setTimeout(()=>{
                                                autos.stopspin = true;
                                            }, 500);
                                        }
                                    }
                                }
                            }
                        }
                        if (!traps.inTrap && !traps.replaced) {
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
                                    if ((player.shameCount > 0 && (game.tick - player.bullTick) % 9 == 0 && player.skinIndex != 45) || my.reSync) {
                                        buyEquip(7, 0);
                                    } else {
                                        if (clicks.left) {
                                            buyEquip(21, 1);
                                            buyEquip(player.reloads[player.weapons[0]] == 0 ? getEl("weaponGrind").checked ? 40 : 7 : player.empAnti ? 22 : player.soldierAnti ? 22 : (getEl("antiBullType").value == "abreload" && near.antiBull > 0) ? 11 : near.dist2 <= 300 ? (getEl("antiBullType").value == "abalway" && near.reloads[near.primaryIndex] == 0) ? 11 : 22 : biomeGear(1, 1), 0);
                                        } else if (clicks.right) {
                                            buyEquip(player.reloads[clicks.right && player.weapons[1] == 10 ? player.weapons[1] : player.weapons[0]] == 0 ? 40 : player.empAnti ? 22 : 22, 0);
                                        }
                                    }
                                } else if (traps.inTrap) {
                                    if (traps.info.health <= items.weapons[player.weaponIndex].dmg ? false : (player.reloads[player.weapons[1] == 10 ? player.weapons[1] : player.weapons[0]] == 0)) {
                                        buyEquip(40, 0);
                                    } else {
                                        if ((player.shameCount > 0 && (game.tick - player.bullTick) % 9 == 0 && player.skinIndex != 45) || my.reSync) {
                                            buyEquip(7, 0);
                                        } else {
                                            buyEquip((player.empAnti || near.dist2 > 300 || !enemy.length) ? 22 : 22, 0);
                                        }
                                    }
                                } else {
                                    if (player.empAnti || player.soldierAnti) {
                                        buyEquip(player.empAnti ? 22 : 6, 0);
                                    } else {
                                        if ((player.shameCount > 0 && (game.tick - player.bullTick) % 9 == 0 && player.skinIndex != 45) || my.reSync) {
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
                                if((near.antiBull > 0 || (player.reloads[player.weaponIndex] != 0 && player.reloads[player.weaponIndex] != 1))) {
                                    for(let i = toR(-30); i < toR(30); i += toR(30)) {
                                        let obj = gameObjects.filter(tmp => tmp.active && UTILS.getDist(tmp, player, 0, 2) < 300);
                                        if(obj) {
                                            obj.forEach((tmp) => {
                                                if(obj.health <= items.weapons[player.weaponIndex].dmg || (near.length && obj.health <= items.weapons[near.weaponIndex].dmg)) {
                                                    place(2, UTILS.getDirect(tmp, player, 0, 2) + i);
                                                }
                                            })
                                        }
                                    }
                                }
                            }
                        }
                        let accChanger = function() {
                            if (near.dist2 <= 500 && near.dist2 > 200) {
                                buyEquip(16, 1)
                            }
                            if (clicks.left || clicks.right || autos.bull || near.dist2 <= 200) {
                                buyEquip(21, 1);
                            } else {
                                traps.inTrap ? buyEquip(21, 1) : buyEquip(11, 1);
                            }
                        }
                        if (storeMenu.style.display != "block" && !instaC.ticking) {
                            hatChanger();
                            accChanger();
                        }
                        if (configs.autoPush && enemy.length && !traps.inTrap) {
                            autoPush();
                            //Pathfinder();
                        } else {
                            if (my.autoPush) {
                                my.autoPush = false;
                                packet("9", lastMoveDir || undefined, 1);
                            }
                        }
                        if (!my.autoPush && pathFind.active && enemy.length && !traps.inTrap && !instaC.ticking) {
                            // PathFinder();
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
            // UPDATE LEADERBOARD:
			function updateLeaderboard(data) {
				UTILS.removeAllChildren(leaderboardData);
				var tmpC = 1;
				for (var i = 0; i < data.length; i += 3) {
					// console.log(data);
					(function(i) {
						UTILS.generateElement({
							class: "leaderHolder",
							parent: leaderboardData,
							children: [
								UTILS.generateElement({
									class: "leaderboardItem",
									style: data[i] == player.sid ? "color: rgba(255,255,255,1); font-size: 18px;" : "color: rgba(255,255,255,0.6); font-size: 18px; padding: 2px;", //"font-size: 18px;",
									text: (data[i + 1] != "" ? data[i + 1] : "unknown") + " [" + data[i] + "]"
								}),
								UTILS.generateElement({
									class: "f", //class: "leaderScore",
									style: data[i] == player.sid ? "color: rgba(255,255,255,1); font-size: 18px;" : "color: rgba(255,255,255,0.6); font-size: 18px; padding: 2px;",
									text: (" " + UTILS.kFormat(data[i + 2]) || " 0")
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

            function gatherAnimation(sid, didHit, index) {
                tmpObj = findPlayerBySID(sid);
                // console.log(items.weapons[tmpObj.weaponIndex].speed - 1000/9 - (ms.max - ms.avg) + ms.avg)
                if (tmpObj) {
                    tmpObj.startAnim(didHit, index);
                    tmpObj.gatherIndex = index;
                    tmpObj.gathering = 1;
                    if(nears.filter(near => near.gathering).length>=2) {
                       if (configs.combatWarnings) {
							player.chat.message = "Primary Sync Threat [ 1 ]";
							player.chat.count = 1500;
						}
                        antiSync = true;
                        game.tickBase(() => {
                            antiSync = false;
                        }, 1);
                    }
                    if (didHit) {
                        let tmpObjects = objectManager.hitObj;
                        objectManager.hitObj = [];
                        // let obj = tmpObjects;
                        //     if(obj.health <= items.weapons[tmpObj.weaponIndex].dmg*2) {
                        //         game.tickBase(() => {
                        //             setTimeout(() => {
                        //                 place(2, Number.MAX_VALUE);
                        //             }, items.weapons[tmpObj.weaponIndex].speed - 1000/9)
                        //         }, 2)
                        //     }
                        tmpObj = findPlayerBySID(sid);
                        game.tickBase(() => {
                            let val = items.weapons[index].dmg * (config.weaponVariants[tmpObj[(index < 9 ? "prima" : "seconda") + "ryVariant"]].val) * (items.weapons[index].sDmg || 1) * (tmpObj.skinIndex == 40 ? 3.3 : 1);
                            tmpObjects.forEach((healthy) => {
                                healthy.healthMov = healthy.health - val / 2;
                                healthy.health -= val;
                                if(healthy.health <= items.weapons[index].dmg*2 && near.length && near.dist2 <= 600 && UTILS.getDist(healthy, player, 0, 2) <= 300) {
                                    game.tickBase(() => {
                                        setTimeout(() => {
                                            place(near.dist2<140?4:2, UTILS.getDirect(healthy, player, 0, 2));
                                            for(let i = toR(-60); i < toR(60); i += toR(30)) {
                                                place(((near.dist2<180||near.dist2>350)?4:2), UTILS.getDirect(healthy, player, 0, 2) + i);
                                            }
                                        }, (items.weapons[tmpObj.weaponIndex].speed - 1000/9 - (ms.max - ms.avg) + ms.avg/3))
                                    }, 2)
                                }
                                if (getEl("visualType").value == "pacifist") {
                                    //love to https://gist.github.com/bendc/76c48ce53299e6078a76
                                    let h, s, l;
                                    let color = (() => {
                                        const randomInt = (min, max) => {
                                            return Math.floor(Math.random() * (max - min + 1)) + min;
                                        };
                                        h = randomInt(0, 360);
                                        s = randomInt(42, 98);
                                        l = randomInt(40, 90);
                                        // return `hsl(${h},${s}%,${l}%)`;
                                    })();
                                    //and love https://stackoverflow.com/questions/36721830/convert-hsl-to-rgb-and-hex
                                    function hslToHex(h, s, l) {
                                        l /= 100;
                                        const a = s * Math.min(l, 1 - l) / 100;
                                        const f = n => {
                                            const k = (n + h / 30) % 12;
                                            const color = l - a * Math.max(Math.min(k - 3, 9 - k, 1), -1);
                                            return Math.round(255 * color).toString(16).padStart(2, '0');   // convert to Hex and prefix "0" if needed
                                        };
                                        return `#${f(0)}${f(8)}${f(4)}`;
                                    }
                                    console.log(hslToHex(h, s, l));
                                    showDamageText(healthy.x, healthy.y, val, hslToHex(h, s, l));
                                }
                            });
                        }, 1)
                    }
                }
            }
            function showDamageText(x, y, value, color) {
                textManager.showText(x, y, 30, 0.15, 550, Math.round(value), color);
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
                    // io.send("6", "wiggled");
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
            var killCounter = getEl("killCounter");
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
                            io.send("6", "AutoGG Happymod")
                            setTimeout(() => {
                            io.send("6", "Happy Mod by Ultra hack")
                            setTimeout(() => {
                            io.send("6", "Coming soon v3!")
                            setTimeout(() => {
                            io.send("6", "Happy: " + player.kills)
                        }, 1000);
                        }, 1000);
                        }, 1000);
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
                    getEl("actionBarItem" + tmpI).style.display = player.items.indexOf(items.list[i].id) >= 0 ? "inline-block" : "none";
                }
                for (let i = 0; i < items.weapons.length; i++) {
                    getEl("actionBarItem" + i).style.display = player.weapons[items.weapons[i].type] == items.weapons[i].id ? "inline-block" : "none";
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
                if (findBotSID) { }
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
                    if (message == "Pew") {
                        instaC.syncTry();
                        io.send("6", "Pew");
                    }
                }
                if (getEl("autochat").checked) {
                    if (message.includes("mod")) {
                        packet("6", "Happymod Ultra hack")
                    }
                    if (message.includes("what mod")) {
                        packet("6", "Happymod by Ultra hack")
                    }
                    if (message.includes("bad")) {
                        io.send("6", "bad = u bad?");
                    } else if (message.includes("lag")) {
                        io.send("6", "your issue");
                    } else if (message.includes("Lag")) {
                        io.send("6", "your issue");
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
                        io.send("6", "noob = u noob?");
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
                    } else if (message.includes("gay")) {
                        io.send("6", "gay = u gay ?");
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
                        io.send("6", "hi");
                    } else if (message.includes("ngu")) {
                        io.send("6", "ngu = u stupid?");
                    } else if (message.includes("Ngu")) {
                        io.send("6", "Ngu = u stupid?");
                    } else if (message.includes("NGU")) {
                        io.send("6", "Ngu = u NGU?");
                    } else if (message.includes("hehe")) {
                        io.send("6", "haha");
                    } else if (message.includes("haha")) {
                        io.send("6", "hahahahahaha");
                    } else if (message.includes("huhu")) {
                        io.send("6", "huhuhuhuhuhu");
                    } else if (message.includes("ez")) {
                        io.send("6", "ik you ez");
                    } else if (message.includes("Ez")) {
                        io.send("6", "ik you ez");
                    } else if (message.includes("easy")) {
                        io.send("6", "ik you ez");
                    } else if (message.includes("gg")) {
                        io.send("6", "gg ez");
                    } else if (message.includes("Gg")) {
                        io.send("6", "gg ez");
                    } else if (message.includes("lol")) {
                        io.send("6", "LOL LOL LOL");
                    } else if (message.includes("Lol")) {
                        io.send("6", "LOL LOL LOL");
                    } else if (message.includes("lmao")) {
                        io.send("6", "lmao LMAO LMAO LMAO");
                    } else if (message.includes("Lmao")) {
                        io.send("6", "lmao LMAO LMAO LMAO");
                    } else if (message.includes("lvl")) {
                        io.send("6", "why");
                    } else if (message.includes("1v1")) {
                        io.send("6", "why");
                    } else if (message.includes("hello")) {
                        io.send("6", "hello");
                    } else if (message.includes("idk")) {
                        io.send("6", "-_-");
                    } else if (message.includes("xd")) {
                        io.send("6", "lol");
                    } else if (message.includes("Xd")) {
                        io.send("6", "lol lol lol");
                    } else if (message.includes("xD")) {
                        io.send("6", "lol lol");
                    } else if (message.includes("XD")) {
                        io.send("6", "lmaooo");
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
            // MINIMAP:
            function updateMinimap(data) {
                minimapData = data;
            }
            // SHOW ANIM TEXT:
            function showText(x, y, value, type, color) {
                if (config.anotherVisual) {
                    textManager.stack.push({ x: x, y: y, value: value });
                } else {
                    textManager.showText(x, y, 50, 0.18, 500, Math.abs(value), color);
                }
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
                var tmpMid = config.mapScale / 2;
                objectManager.add(0, tmpMid, tmpMid + 200, 0, config.treeScales[3], 0);
                objectManager.add(1, tmpMid, tmpMid - 480, 0, config.treeScales[3], 0);
                objectManager.add(2, tmpMid + 300, tmpMid + 450, 0, config.treeScales[3], 0);
                objectManager.add(3, tmpMid - 950, tmpMid - 130, 0, config.treeScales[2], 0);
                objectManager.add(4, tmpMid - 750, tmpMid - 400, 0, config.treeScales[3], 0);
                objectManager.add(5, tmpMid - 700, tmpMid + 400, 0, config.treeScales[2], 0);
                objectManager.add(6, tmpMid + 800, tmpMid - 200, 0, config.treeScales[3], 0);
                objectManager.add(7, tmpMid - 260, tmpMid + 340, 0, config.bushScales[3], 1);
                objectManager.add(8, tmpMid + 760, tmpMid + 310, 0, config.bushScales[3], 1);
                objectManager.add(9, tmpMid - 800, tmpMid + 100, 0, config.bushScales[3], 1);
                objectManager.add(10, tmpMid - 800, tmpMid + 300, 0, items.list[4].scale, items.list[4].id, items.list[10]);
                objectManager.add(11, tmpMid + 650, tmpMid - 390, 0, items.list[4].scale, items.list[4].id, items.list[10]);
                objectManager.add(12, tmpMid - 400, tmpMid - 450, 0, config.rockScales[2], 2);
            }
            // RENDER PLAYERS:
            let ooolala = 0;
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

					mainContext.font = "20px Ubuntu";
					let tmpSize = mainContext.measureText("R.I.P");
					let tmpH = 50;
					let tmpW = tmpSize.width + 10;
					mainContext.textBaseline = "middle";
					mainContext.textAlign = "center";
					mainContext.fillStyle = "#ccc";
					mainContext.strokeStyle = "#999";
					mainContext.roundRect(dead.x - xOffset - (tmpW / 2), dead.y - yOffset - (tmpH / 2) + (dead.scale * 1.5), tmpW, tmpH, 6);
					mainContext.fill();
					mainContext.stroke();

					mainContext.fillStyle = "#fff";
					mainContext.strokeStyle = "#000";
					mainContext.strokeText("R.I.P", dead.x - xOffset, dead.y + (dead.scale * 1.5) - yOffset);
					mainContext.fillText("R.I.P", dead.x - xOffset, dead.y + (dead.scale * 1.5) - yOffset);
					mainContext.strokeText(dead.name, dead.x - xOffset, dead.y + (dead.scale * 1.5) + 35 - yOffset);
					mainContext.fillText(dead.name, dead.x - xOffset, dead.y + (dead.scale * 1.5) + 35 - yOffset);

					// same color in bundle
					mainContext.fillStyle = "#91b2db";

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
                            tmpDir = (getEl("visualType").value == "ae" || tmpObj != player ? tmpObj.dir : getVisualDir());
                            // tmpDir = (!configs.showDir && tmpObj == player) ? configs.attackDir ? getVisualDir() : getSafeDir() : (tmpObj.dir || 0);
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

				// WEAPON BELLOW HANDS:
				if (obj.buildIndex < 0 && !items.weapons[obj.weaponIndex].aboveHand) {
					renderTool(items.weapons[obj.weaponIndex], config.weaponVariants[obj.weaponVariant].src, obj.scale, 0, ctxt);
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

				ctxt.lineWidth = 2;
				ctxt.fillStyle = "#555";
				ctxt.font = "35px Hammersmith One";
				ctxt.textBaseline = "middle";
				ctxt.textAlign = "center";

				ctxt.fillText(")", 20, 5);

				ctxt.rotate(Math.PI / 2);
				ctxt.font = "30px Hammersmith One";
				ctxt.fillText("X", -15, 15 / 2);
				ctxt.fillText("X", 15, 15 / 2);

			}
            // RENDER PLAYER:
            function renderPlayer(obj, ctxt) {
                ctxt = ctxt || mainContext;
                ctxt.lineWidth = outlineWidth;
                ctxt.lineJoin = "miter";
                // PLAYER SHADOW: nme
                if (getEl("visualType").value == "pacifist") {
                    ctxt.shadowColor = 'rgba(0, 0, 0, 0.5)';
                    ctxt.shadowBlur = 10;
                    ctxt.shadowOffsetY = 5;
                }
                ctxt.strokeStyle = darkOutlineColor;
                let handAngle = (Math.PI / 4) * (items.weapons[obj.weaponIndex].armS || 1);
                let oHandAngle = (obj.buildIndex < 0) ? (items.weapons[obj.weaponIndex].hndS || 1) : 1;
                let oHandDist = (obj.buildIndex < 0) ? (items.weapons[obj.weaponIndex].hndD || 1) : 1;
                // Dont lie to Yourself, KatanaMusket doesnt exist.
               // let katanaMusket = (obj == player && obj.weapons[0] == 3 && obj.weapons[1] == 15);
                // TAIL/CAPE:
                if (obj.tailIndex > 0) {
                    renderTail(obj.tailIndex, ctxt, obj);
                }
                let a = false;
                // WEAPON BELLOW HANDS:
                if (obj.buildIndex < 0 && !items.weapons[obj.weaponIndex].aboveHand) {
                    renderTool(items.weapons[a ? 4 : obj.weaponIndex], config.weaponVariants[obj.weaponVariant].src, obj.scale, 0, ctxt);
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
            // RENDER NORMAL TAIL
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
                    let blurScale = 15;
                    let tmpCanvas = document.createElement("canvas");
                    tmpCanvas.width = tmpCanvas.height = (obj.scale * 2.1) + outlineWidth;
                    let tmpContext = tmpCanvas.getContext('2d');
                    tmpContext.translate((tmpCanvas.width / 2), (tmpCanvas.height / 2));
                    tmpContext.rotate(UTILS.randFloat(0, Math.PI));
                    tmpContext.strokeStyle = outlineColor;
                    tmpContext.lineWidth = outlineWidth;
                    if (obj.type == 0) {
                        let tmpScale;
                        let tmpCount = UTILS.randInt(5, 7);
                        tmpContext.globalAlpha = 0.8;
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
                let e = obj;
                let R = player;
                let clr = R && e.owner && (e.owner.sid).constructor == Number && e.owner.sid != R.sid,
                    use = true && false && true,
                    ID = e.id + (!use && clr ? 50 : 0);
                let tmpSprite = itemSprites[ID];
                if (!tmpSprite || asIcon) {
                    let blurScale = 0;
                    let tmpCanvas = document.createElement("canvas");
                    // let reScale = ((!asIcon && obj.name == "windmill") ? items.list[4].scale : obj.scale);
                    tmpCanvas.width = tmpCanvas.height = (obj.scale * 2.5) + outlineWidth + (items.list[obj.id].spritePadding || 0) + blurScale;
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
                            tmpContext.fillStyle = "#a5974c",
                                renderCircle(0, 0, obj.scale, tmpContext),
                                tmpContext.fillStyle = "#c9b758",
                                renderRectCircle(0, 0, obj.scale * 1.5, 29, 4, tmpContext),
                                tmpContext.fillStyle = "#a5974c",
                                renderCircle(0, 0, obj.scale * .5, tmpContext);
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
                        itemSprites[ID] = tmpSprite;
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
                    let blurScale = 0;
                    let tmpCanvas = document.createElement("canvas");
                    tmpCanvas.width = tmpCanvas.height = obj.scale * 2.5 + outlineWidth + (items.list[obj.id].spritePadding || 0) + blurScale;
                    let tmpContext = tmpCanvas.getContext("2d");
                    tmpContext.translate(tmpCanvas.width / 2, tmpCanvas.height / 2);
                    tmpContext.rotate(Math.PI / 2);
                    tmpContext.strokeStyle = outlineColor;
                    tmpContext.lineWidth = outlineWidth;
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
                tmpContext.lineWidth = outlineWidth;
                tmpContext.globalAlpha = 1;
                tmpContext.strokeStyle = outlineColor;
                tmpContext.save();
                tmpContext.translate(tmpX, tmpY);
                tmpContext.rotate(obj.dir);
                if (obj.name == "wood wall" || obj.name == "stone wall" || obj.name == "castle wall") {
                    let sides = obj.name == "castle wall" ? 4 : 3;
                    renderHealthStar(tmpContext, sides, obj.scale * 1.1, obj.scale * 1.1);
                    tmpContext.stroke();
                } else if (obj.name == "spikes" || obj.name == "greater spikes" || obj.name == "poison spikes" || obj.name == "spinning spikes") {
                    let tmpScale = obj.scale * 0.6;
                    renderHealthStar(tmpContext, obj.name == "spikes" ? 5 : 6, obj.scale, tmpScale);
                    tmpContext.stroke();
                } else if (obj.name == "windmill" || obj.name == "faster windmill" || obj.name == "power mill") {
                    renderHealthCircle(0, 0, obj.scale, tmpContext, false, true);
                } else if (obj.name == "mine") {
                    renderHealthStar(tmpContext, 3, obj.scale, obj.scale);
                    tmpContext.stroke();
                } else if (obj.name == "sapling") {
                    let tmpScale = obj.scale * 0.7;
                    renderHealthStar(tmpContext, 7, obj.scale, tmpScale);
                    tmpContext.stroke();
                } else if (obj.name == "pit trap") {
                    renderHealthStar(tmpContext, 3, obj.scale * 1.1, obj.scale * 1.1);
                    tmpContext.stroke();
                } else if (obj.name == "boost pad") {
                    renderHealthRect(0, 0, obj.scale * 2, obj.scale * 2, tmpContext, false, true);
                } else if (obj.name == "turret") {
                    renderHealthCircle(0, 0, obj.scale, tmpContext, false, true);
                } else if (obj.name == "platform") {
                    renderHealthRect(0, 0, obj.scale * 2, obj.scale * 2, tmpContext, false, true);
                } else if (obj.name == "healing pad") {
                    renderHealthRect(0, 0, obj.scale * 2, obj.scale * 2, tmpContext, false, true);
                } else if (obj.name == "spawn pad") {
                    renderHealthRect(0, 0, obj.scale * 2, obj.scale * 2, tmpContext, false, true);
                } else if (obj.name == "blocker") {
                    renderHealthCircle(0, 0, obj.scale, tmpContext, false, true);
                } else if (obj.name == "teleporter") {
                    renderHealthCircle(0, 0, obj.scale, tmpContext, false, true);
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
            function markObject(tmpObj, tmpX, tmpY) {
                yen(tmpObj, mainContext, tmpX, tmpY);
            }
            function yen(obj, tmpContext, tmpX, tmpY) {
                tmpContext.lineWidth = outlineWidth;
                tmpContext.globalAlpha = 1;
                tmpContext.strokeStyle = outlineColor;
                tmpContext.save();
                tmpContext.translate(tmpX, tmpY);
                tmpContext.rotate(obj.dir);
                if (obj.name == "wood wall" || obj.name == "stone wall" || obj.name == "castle wall") {
                    let sides = obj.name == "castle wall" ? 4 : 3;
                    renderHealthStar(tmpContext, sides, obj.scale * 1.1, obj.scale * 1.1);
                    tmpContext.stroke();
                } else if (obj.name == "spikes" || obj.name == "greater spikes" || obj.name == "poison spikes" || obj.name == "spinning spikes") {
                    let tmpScale = obj.scale * 0.6;
                    renderHealthStar(tmpContext, obj.name == "spikes" ? 5 : 6, obj.scale, tmpScale);
                    tmpContext.stroke();
                } else if (obj.name == "windmill" || obj.name == "faster windmill" || obj.name == "power mill") {
                    renderHealthCircle(0, 0, obj.scale, tmpContext, false, true);
                } else if (obj.name == "mine") {
                    renderHealthStar(tmpContext, 3, obj.scale, obj.scale);
                    tmpContext.stroke();
                } else if (obj.name == "sapling") {
                    let tmpScale = obj.scale * 0.7;
                    renderHealthStar(tmpContext, 7, obj.scale, tmpScale);
                    tmpContext.stroke();
                } else if (obj.name == "pit trap") {
                    renderHealthStar(tmpContext, 3, obj.scale * 1.1, obj.scale * 1.1);
                    tmpContext.stroke();
                } else if (obj.name == "boost pad") {
                    renderHealthRect(0, 0, obj.scale * 2, obj.scale * 2, tmpContext, false, true);
                } else if (obj.name == "turret") {
                    renderHealthCircle(0, 0, obj.scale, tmpContext, false, true);
                } else if (obj.name == "platform") {
                    renderHealthRect(0, 0, obj.scale * 2, obj.scale * 2, tmpContext, false, true);
                } else if (obj.name == "healing pad") {
                    renderHealthRect(0, 0, obj.scale * 2, obj.scale * 2, tmpContext, false, true);
                } else if (obj.name == "spawn pad") {
                    renderHealthRect(0, 0, obj.scale * 2, obj.scale * 2, tmpContext, false, true);
                } else if (obj.name == "blocker") {
                    renderHealthCircle(0, 0, obj.scale, tmpContext, false, true);
                } else if (obj.name == "teleporter") {
                    renderHealthCircle(0, 0, obj.scale, tmpContext, false, true);
                }
                tmpContext.restore();
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
                                ctxt.arc((this.x / config.mapScale) * mapDisplay.width, (this.y / config.mapScale)
                                         * mapDisplay.width, this.scale, 0, 2 * Math.PI);
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
            let crossHairs = [
                "https://cdn.discordapp.com/attachments/1001384433078779927/1149285738412769300/newawwddd.png",
                "https://cdn.discordapp.com/attachments/1001384433078779927/1149285168780165170/100px-Crosshairs_Red.png"
            ];
            let crossHairSprites = {};
            let iconSprites = {
                crown: new Image(),
                skull: new Image()
            };
            function loadIcons() {
                iconSprites.crown.onload = function() {
                    this.isLoaded = true;
                };
                iconSprites.crown.src = "./../img/icons/crown.png";
                iconSprites.skull.onload = function() {
                    this.isLoaded = true;
                };
                iconSprites.skull.src = "./../img/icons/skull.png";
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
                    if (player) {
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
                    // RENDER GRID:
                    if (getEl("visualType").value == "ae" || getEl("visualType").value == "fz" || getEl("visualType").value == "zika") {
                        mainContext.lineWidth = 4;
                        mainContext.strokeStyle = "#000";
                        mainContext.globalAlpha = 0.06;
                        mainContext.beginPath();
                        for (let x = -camX; x < maxScreenWidth; x += maxScreenHeight / 18) {
                            if (x > 0) {
                                mainContext.moveTo(x, 0);
                                mainContext.lineTo(x, maxScreenHeight);
                            }
                        }
                        for (let y = -camY; y < maxScreenHeight; y += maxScreenHeight / 18) {
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
                            mainContext.fillText("O", lastDeath.x - xOffset, lastDeath.y - yOffset);
                        }
                        // PATHFINDER LINE:
                        if (pathFind.active) {
                            if (pathFind.array && (pathFind.chaseNear ? enemy.length : true)) {
                                mainContext.lineWidth = 25;
                                mainContext.globalAlpha = 0.6;
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
                    mainContext.globalAlpha = 0.2;
                    if (xOffset <= 0) {
                        mainContext.fillRect(0, 0, -xOffset, maxScreenHeight);
                    } if (config.mapScale - xOffset <= maxScreenWidth) {
                        let tmpY = Math.max(0, -yOffset);
                        mainContext.fillRect(config.mapScale - xOffset, tmpY, maxScreenWidth - (config.mapScale - xOffset), maxScreenHeight - tmpY);
                    } if (yOffset <= 0) {
                        mainContext.fillRect(-xOffset, 0, maxScreenWidth + xOffset, -yOffset);
                    } if (config.mapScale - yOffset <= maxScreenHeight) {
                        let tmpX = Math.max(0, -xOffset);
                        let tmpMin = 0;
                        if (config.mapScale - xOffset <= maxScreenWidth)
                            tmpMin = maxScreenWidth - (config.mapScale - xOffset);
                        mainContext.fillRect(tmpX, config.mapScale - yOffset,
                                             (maxScreenWidth - tmpX) - tmpMin, maxScreenHeight - (config.mapScale - yOffset));
                    }
                    // RENDER DAY/NIGHT TIME:
                    let nightTime = false;
                    setInterval(() => {
                        nightTime = !nightTime;
                    }, 30000);
                    if(getEl("visualType").value == "smiley") {
                        nightTime = false;
                    }
                    mainContext.globalAlpha = 1;
                    if(getEl("visualType").value == "ae" || getEl("visualType").value == "mega") {
                        mainContext.fillStyle = "rgba(0, 0, 70, 0.35)";
                        mainContext.fillRect(0, 0, maxScreenWidth, maxScreenHeight);
                    } else if(getEl("visualType").value == "fz") {
                        if(nightTime) {
                            mainContext.fillStyle = "rgba(0, 0, 70, 0.45)";
                            mainContext.fillRect(0, 0, maxScreenWidth, maxScreenHeight);
                        } else {
                            mainContext.fillStyle = "rgba(0, 0, 70, 0.35)";
                            mainContext.fillRect(0, 0, maxScreenWidth, maxScreenHeight);
                        }
                    } else if(getEl("visualType").value == "zika") {
                        mainContext.fillStyle = "rgba(0, 0, 70, 0.55)";
                        mainContext.fillRect(0, 0, maxScreenWidth, maxScreenHeight);
                    } else {
                        mainContext.fillStyle = "rgba(20, 0, 70, 0.45)";
                        mainContext.fillRect(0, 0, maxScreenWidth, maxScreenHeight);
                        mainContext.fillStyle = "rgba(0, 5, 0, 0.15)";
                        mainContext.fillRect(0, 0, maxScreenWidth, maxScreenHeight);
                        mainContext.fillStyle = "rgba(255, 255, 255, 0.025)";
                        mainContext.fillRect(0, 0, maxScreenWidth, maxScreenHeight);
                    }
                    // RENDER PLAYER AND AI UI:
                    mainContext.strokeStyle = darkOutlineColor;
                    mainContext.globalAlpha = 1;
                    let shame = false;
                    for (let i = 0; i < players.length + ais.length; ++i) {
                        tmpObj = players[i] || ais[i - players.length];
                        if (tmpObj.visible) {
                            mainContext.strokeStyle = darkOutlineColor;
                            if (tmpObj.skinIndex != 10 || (tmpObj == player) || (tmpObj.team && tmpObj.team == player.team)) {
                                let tmpText = "";
                                if(getEl("visualType").value == "ae" || getEl("visualType").value == "elite") {
                                    shame = false;
                                    tmpText = (tmpObj.team ? "[" + tmpObj.team + "] " : "") + tmpObj.name + " {" + tmpObj.maxShameCount + "} | " + tmpObj.damageThreat;
                                }
                                if (getEl("visualType").value == "fz") {
                                    shame = true;
                                    tmpText = (tmpObj.team ? "[" + tmpObj.team + "] " : "") + ("[" + tmpObj.primaryIndex + "/" + tmpObj.secondaryIndex + "/" + tmpObj.maxShameCount + "] ") + tmpObj.name;
                                }
                                if (getEl("visualType").value == "pacifist" || getEl("visualType").value == "zika") {
                                    shame = false;
                                    tmpText = (tmpObj.team ? "[" + tmpObj.team + "] " : "") + tmpObj.name;
                                }
                                if (getEl("visualType").value == "smiley") {
                                    tmpText = (tmpObj.team?"["+tmpObj.team+"] ":"")+(tmpObj.name||"")+("");
                                    shame = true;
                                }
                                if(getEl("visualType").value == "mega") {
                                    shame = true;
                                    tmpText = (tmpObj.team ? "{" + tmpObj.team + "} " : "") + tmpObj.name;
                                }
                                if (tmpText != "") {
                                    if(tmpObj.isPlayer) {
                                        if(getEl("visualType") == "mega") {
                                            mainContext.font = (tmpObj.nameScale||30) + "px Hammersmith One";
                                            mainContext.fillStyle = "#fff";
                                            mainContext.textBaseline = "middle";
                                            mainContext.textAlign = "center";
                                            mainContext.lineWidth = (tmpObj.nameScale?11:8);
                                            mainContext.lineJoin = "round";
                                            mainContext.strokeText(tmpText, tmpObj.x - xOffset, (tmpObj.y - yOffset - tmpObj.scale) - config.nameY - 155);
                                            mainContext.fillText(tmpText, tmpObj.x - xOffset, (tmpObj.y - yOffset - tmpObj.scale) - config.nameY - 155);
                                        } else {
                                            mainContext.font = (tmpObj.nameScale||30) + "px Hammersmith One";
                                            mainContext.fillStyle = "#fff";
                                            mainContext.textBaseline = "middle";
                                            mainContext.textAlign = "center";
                                            mainContext.lineWidth = (tmpObj.nameScale?11:8);
                                            mainContext.lineJoin = "round";
                                            mainContext.strokeText(tmpText, tmpObj.x - xOffset, (tmpObj.y - yOffset - tmpObj.scale) - config.nameY);
                                            mainContext.fillText(tmpText, tmpObj.x - xOffset, (tmpObj.y - yOffset - tmpObj.scale) - config.nameY);
                                        }
                                    }
                                    if (tmpObj.isLeader && iconSprites["crown"].isLoaded) {
                                        let tmpS = config.crownIconScale;
                                        let tmpX = tmpObj.x - xOffset - (tmpS/2) - (mainContext.measureText(tmpText).width / 2) - config.crownPad;
                                        mainContext.drawImage(iconSprites["crown"], tmpX, (tmpObj.y - yOffset - tmpObj.scale)
                                                              - config.nameY - (tmpS/2) - 5, tmpS, tmpS);
                                    } if (tmpObj.iconIndex == 1 && iconSprites["skull"].isLoaded) {
                                        let tmpS = config.crownIconScale;
                                        let tmpX = tmpObj.x - xOffset - (tmpS/2) + (mainContext.measureText(tmpText).width / 2) + config.crownPad;
                                        mainContext.drawImage(iconSprites["skull"], tmpX, (tmpObj.y - yOffset - tmpObj.scale)
                                                              - config.nameY - (tmpS/2) - 5, tmpS, tmpS);
                                    }
                                    if (tmpObj.isPlayer && instaC.wait && near == tmpObj && (tmpObj.backupNobull ? crossHairSprites[1].isLoaded : crossHairSprites[0].isLoaded) && enemy.length && !getEl("visualType").value == "ae") {
                                        let tmpS = tmpObj.scale * 2.2;
                                        mainContext.drawImage((tmpObj.backupNobull ? crossHairSprites[1] : crossHairSprites[0]), tmpObj.x - xOffset - tmpS / 2, tmpObj.y - yOffset - tmpS / 2, tmpS, tmpS);
                                    }
                                    if(tmpObj.isPlayer && shame) {
                                        mainContext.font = (tmpObj.nameScale || 30) + "px Hammersmith One";
                                        mainContext.fillStyle = "#ff0000";
                                        mainContext.textBaseline = "middle";
                                        mainContext.textAlign = "center";
                                        mainContext.lineWidth = tmpObj.nameScale ? 11 : 8;
                                        mainContext.lineJoin = "round";
                                        var tmpS = config.crownIconScale;
                                        var tmpX = tmpObj.x - xOffset - (tmpS/2) + (mainContext.measureText(tmpText).width / 2) + config.crownPad + 15;
                                        mainContext.strokeText(tmpObj.shameCount, tmpX, tmpObj.y - yOffset - tmpObj.scale - config.nameY);
                                        mainContext.fillText(tmpObj.shameCount, tmpX, tmpObj.y - yOffset - tmpObj.scale - config.nameY);
                                    }

                                    tmpText = "";
                                }
                                if (tmpObj.health) {
                                    // UNDER TEXT:
                                    mainContext.globalAlpha = 1;
                                    mainContext.font = "20px Hammersmith One";
                                    mainContext.fillStyle = "#fff";
                                    mainContext.strokeStyle = darkOutlineColor;
                                    mainContext.textBaseline = "middle";
                                    mainContext.textAlign = "center";
                                    mainContext.lineWidth = 8;
                                    mainContext.lineJoin = "round";
                                    if(getEl("visualType").value == "fz"  && tmpObj.isPlayer) {
                                        // HEALTH HOLDER:
                                        var tmpWidth = config.healthBarWidth;
                                        mainContext.fillStyle = darkOutlineColor;
                                        mainContext.roundRect(tmpObj.x - xOffset - config.healthBarWidth - config.healthBarPad,
                                                              (tmpObj.y - yOffset + tmpObj.scale) + config.nameY, (config.healthBarWidth * 2) +
                                                              (config.healthBarPad * 2), 17, 11); // 11
                                        mainContext.fill();
                                        // HEALTH BAR:
                                        mainContext.fillStyle = (tmpObj==player||(tmpObj.team&&tmpObj.team==player.team))? "#8ecc51" : "#cc5151";
                                        mainContext.roundRect(tmpObj.x - xOffset - config.healthBarWidth,
                                                              (tmpObj.y - yOffset + tmpObj.scale) + config.nameY + config.healthBarPad,
                                                              ((config.healthBarWidth * 2) * (tmpObj.health / tmpObj.maxHealth)), 17 - config.healthBarPad * 2, 20);
                                        mainContext.fill();
                                        mainContext.fillStyle = "#fff";

                                        let reloads = {
                                            primary: (tmpObj.primaryIndex == undefined ? 1 : ((items.weapons[tmpObj.primaryIndex].speed - tmpObj.reloads[tmpObj.primaryIndex]) / items.weapons[tmpObj.primaryIndex].speed)),
                                            secondary: (tmpObj.secondaryIndex == undefined ? 1 : ((items.weapons[tmpObj.secondaryIndex].speed - tmpObj.reloads[tmpObj.secondaryIndex]) / items.weapons[tmpObj.secondaryIndex].speed)),
                                            // turret: (2500 - tmpObj.reloads[53]) / 2500
                                        };

                                        // SECONDARY RELOAD HOLDER:
                                        mainContext.fillStyle = darkOutlineColor;
                                        mainContext.roundRect(tmpObj.x - xOffset - config.healthBarPad + 5,
                                                              (tmpObj.y - yOffset + tmpObj.scale) + config.nameY - 13, (config.healthBarWidth-5) +
                                                              (config.healthBarPad * 2), 17, 8);
                                        mainContext.fill();

                                        // SECONDARY RELOAD BAR:
                                        mainContext.fillStyle = reloads.secondary == 1 ? "#FFFFFF" : "hsl(" + 50 * reloads.secondary + ", 50%, 60%)";
                                        mainContext.roundRect(tmpObj.x - xOffset + 5,
                                                              (tmpObj.y - yOffset + tmpObj.scale) + config.nameY - 13 + config.healthBarPad,
                                                              (config.healthBarWidth * reloads.secondary + 1) - 5, 17 - config.healthBarPad * 2, 7);
                                        mainContext.fill();

                                        // PRIMARY RELOAD HOLDER:
                                        mainContext.fillStyle = darkOutlineColor;
                                        mainContext.roundRect(tmpObj.x - xOffset - config.healthBarWidth - config.healthBarPad,
                                                              (tmpObj.y - yOffset + tmpObj.scale) + config.nameY - 13, config.healthBarWidth +
                                                              (config.healthBarPad * 2) - 5, 17, 8);
                                        mainContext.fill();

                                        // PRIMARY RELOAD BAR:
                                        mainContext.fillStyle = reloads.primary == 1 ? "#FFF533" : "hsl(" + 50 * reloads.primary + ", 50%, 60%)";
                                        mainContext.roundRect(tmpObj.x - xOffset - config.healthBarWidth,
                                                              (tmpObj.y - yOffset + tmpObj.scale) + config.nameY - 13 + config.healthBarPad,
                                                              (config.healthBarWidth * reloads.primary + 1) - 5, 17 - config.healthBarPad * 2, 7);
                                        mainContext.fill();
                                        if(tmpObj === player) {
                                            mainContext.fillStyle = "#fff";
                                            mainContext.strokeText("[" + instaC.isTrue + "/" + my.antiSync + "/" + ms.max + "," + window.pingTime + "," + ms.avg + "]", tmpObj.x - xOffset, (tmpObj.y - yOffset - tmpObj.scale) + 135);
                                            mainContext.fillText("[" + instaC.isTrue + "/" + my.antiSync + "/" + ms.max + "," + window.pingTime + "," + ms.avg + "]", tmpObj.x - xOffset, (tmpObj.y - yOffset - tmpObj.scale) + 135);
                                        }
                                    } else if(getEl("visualType").value == "smiley" && tmpObj.isPlayer) {
                                        // HEALTH HOLDER:
                                        var mpWidth = config.healthBarWidth;
                                        mainContext.fillStyle = darkOutlineColor;
                                        mainContext.roundRect(tmpObj.x - xOffset - config.healthBarWidth - config.healthBarPad,
                                                              (tmpObj.y - yOffset + tmpObj.scale) + config.nameY, (config.healthBarWidth * 2) +
                                                              (config.healthBarPad * 2), 17, 11); // 11
                                        mainContext.fill();
                                        // HEALTH BAR:
                                        mainContext.fillStyle = (tmpObj==player||(tmpObj.team&&tmpObj.team==player.team))? "#8ecc51" : "#cc5151";
                                        mainContext.roundRect(tmpObj.x - xOffset - config.healthBarWidth,
                                                              (tmpObj.y - yOffset + tmpObj.scale) + config.nameY + config.healthBarPad,
                                                              ((config.healthBarWidth * 2) * (tmpObj.health / tmpObj.maxHealth)), 17 - config.healthBarPad * 2, 20);
                                        mainContext.fill();
                                        mainContext.fillStyle = "#fff";

                                        let reloads = {
                                            primary: (tmpObj.primaryIndex == undefined ? 1 : ((items.weapons[tmpObj.primaryIndex].speed - tmpObj.reloads[tmpObj.primaryIndex]) / items.weapons[tmpObj.primaryIndex].speed)),
                                            secondary: (tmpObj.secondaryIndex == undefined ? 1 : ((items.weapons[tmpObj.secondaryIndex].speed - tmpObj.reloads[tmpObj.secondaryIndex]) / items.weapons[tmpObj.secondaryIndex].speed)),
                                            // turret: (2500 - tmpObj.reloads[53]) / 2500
                                            turret: (2500 - tmpObj.reloads[53]) / 2500
                                        };

                                        // SECONDARY RELOAD HOLDER:
                                        mainContext.fillStyle = darkOutlineColor;
                                        mainContext.roundRect(tmpObj.x - xOffset - config.healthBarPad + 5,
                                                              (tmpObj.y - yOffset + tmpObj.scale) + config.nameY - 13, (config.healthBarWidth-5) +
                                                              (config.healthBarPad * 2), 17, 8);
                                        mainContext.fill();

                                        // SECONDARY RELOAD BAR:
                                        mainContext.fillStyle = reloads.secondary == 1 ? "#FFFFFF" : "#ffa07a";
                                        mainContext.roundRect(tmpObj.x - xOffset + 5,
                                                              (tmpObj.y - yOffset + tmpObj.scale) + config.nameY - 13 + config.healthBarPad,
                                                              (config.healthBarWidth * reloads.secondary + 1) - 5, 17 - config.healthBarPad * 2, 7);
                                        mainContext.fill();

                                        // PRIMARY RELOAD HOLDER:
                                        mainContext.fillStyle = darkOutlineColor;
                                        mainContext.roundRect(tmpObj.x - xOffset - config.healthBarWidth - config.healthBarPad,
                                                              (tmpObj.y - yOffset + tmpObj.scale) + config.nameY - 13, config.healthBarWidth +
                                                              (config.healthBarPad * 2) - 5, 17, 8);
                                        mainContext.fill();

                                        // PRIMARY RELOAD BAR:
                                        mainContext.fillStyle = reloads.primary == 1 ? "#FFFFFF" : "#ffa07a";
                                        mainContext.roundRect(tmpObj.x - xOffset - config.healthBarWidth,
                                                              (tmpObj.y - yOffset + tmpObj.scale) + config.nameY - 13 + config.healthBarPad,
                                                              (config.healthBarWidth * reloads.primary + 1) - 5, 17 - config.healthBarPad * 2, 7);
                                        mainContext.fill();

                                        if (getEl("visualType").value == "smiley") {

                                            // TURRET RELOAD HOLDER:
                                            mainContext.fillStyle = darkOutlineColor;
                                            mainContext.roundRect(tmpObj.x - xOffset - config.healthBarWidth - config.healthBarPad,
                                                                  (tmpObj.y - yOffset + tmpObj.scale) + config.nameY + 13, (config.healthBarWidth * 2) +
                                                                  (config.healthBarPad * 2), 17, 8);
                                            mainContext.fill();

                                            // TURRET RELOAD BAR:
                                            mainContext.fillStyle = "#a9a9a9";
                                            mainContext.roundRect(tmpObj.x - xOffset - config.healthBarWidth,
                                                                  (tmpObj.y - yOffset + tmpObj.scale) + config.nameY + 13 + config.healthBarPad,
                                                                  ((config.healthBarWidth * 2) * reloads.turret), 17 - config.healthBarPad * 2, 7);
                                            mainContext.fill();
                                        }

                                    } else if (getEl("visualType").value == "pacifist" ) {
                                        // HEALTH HOLDER:
                                        var tmpWidth = config.healthBarWidth;
                                        mainContext.fillStyle = darkOutlineColor;
                                        mainContext.roundRect(tmpObj.x - xOffset - config.healthBarWidth - config.healthBarPad,
                                                              (tmpObj.y - yOffset + tmpObj.scale) + config.nameY, (config.healthBarWidth * 2) +
                                                              (config.healthBarPad * 2), 17, 11); // 11
                                        mainContext.fill();
                                        // HEALTH BAR:
                                        mainContext.fillStyle = (tmpObj==player||(tmpObj.team&&tmpObj.team==player.team))? "#8ecc51" : "#cc5151";
                                        mainContext.roundRect(tmpObj.x - xOffset - config.healthBarWidth,
                                                              (tmpObj.y - yOffset + tmpObj.scale) + config.nameY + config.healthBarPad,
                                                              ((config.healthBarWidth * 2) * (tmpObj.health / tmpObj.maxHealth)), 17 - config.healthBarPad * 2, 20);
                                        mainContext.fill();
                                        mainContext.fillStyle = "#fff";

                                        if(tmpObj === player) {
                                            mainContext.strokeText(secPacket, tmpObj.x - xOffset, (tmpObj.y - yOffset - tmpObj.scale) - 10);
                                            mainContext.fillText(secPacket, tmpObj.x - xOffset, (tmpObj.y - yOffset - tmpObj.scale) - 10);
                                        } else if (tmpObj.isPlayer) {
                                            mainContext.strokeText("[" + tmpObj.primaryIndex + " / " + (tmpObj.secondaryIndex!=undefined?tmpObj.secondaryIndex:"0") + "]", tmpObj.x - xOffset, (tmpObj.y - yOffset - tmpObj.scale) - 10);
                                            mainContext.fillText("[" + tmpObj.primaryIndex + " / " + (tmpObj.secondaryIndex!=undefined?tmpObj.secondaryIndex:"0") + "]", tmpObj.x - xOffset, (tmpObj.y - yOffset - tmpObj.scale) - 10);
                                        }
                                        if(tmpObj.isPlayer) {
                                            mainContext.strokeText(tmpObj.sid, tmpObj.x - xOffset, (tmpObj.y - yOffset - tmpObj.scale) + 40);
                                            mainContext.fillText(tmpObj.sid, tmpObj.x - xOffset, (tmpObj.y - yOffset - tmpObj.scale) + 40);

                                            mainContext.strokeText(tmpObj.shameCount, tmpObj.x - xOffset, (tmpObj.y - yOffset - tmpObj.scale) + 135);
                                            mainContext.fillText(tmpObj.shameCount, tmpObj.x - xOffset, (tmpObj.y - yOffset - tmpObj.scale) + 135);
                                        }
                                    } else if (getEl("visualType").value == "zika") {
                                        // HEALTH HOLDER:
                                        var tmpWidth = config.healthBarWidth;
                                        mainContext.fillStyle = darkOutlineColor;
                                        mainContext.roundRect(tmpObj.x - xOffset - config.healthBarWidth - config.healthBarPad,
                                                              (tmpObj.y - yOffset + tmpObj.scale) + config.nameY, (config.healthBarWidth * 2) +
                                                              (config.healthBarPad * 2), 17, 11); // 11
                                        mainContext.fill();
                                        // HEALTH BAR:
                                        mainContext.fillStyle = (tmpObj==player||(tmpObj.team&&tmpObj.team==player.team))? "#8ecc51" : "#cc5151";
                                        mainContext.roundRect(tmpObj.x - xOffset - config.healthBarWidth,
                                                              (tmpObj.y - yOffset + tmpObj.scale) + config.nameY + config.healthBarPad,
                                                              ((config.healthBarWidth * 2) * (tmpObj.health / tmpObj.maxHealth)), 17 - config.healthBarPad * 2, 20);
                                        mainContext.fill();
                                        mainContext.fillStyle = "#fff";

                                        mainContext.font = "18px Hammersmith One";
                                        if(tmpObj === player) {
                                            mainContext.strokeText(secPacket, tmpObj.x - xOffset, (tmpObj.y - yOffset - tmpObj.scale) - 10);
                                            mainContext.fillText(secPacket, tmpObj.x - xOffset, (tmpObj.y - yOffset - tmpObj.scale) - 10);
                                        } else if (tmpObj.isPlayer) {
                                            mainContext.strokeText("[" + tmpObj.primaryIndex + " / " + (tmpObj.secondaryIndex!=undefined?tmpObj.secondaryIndex:"0") + "]", tmpObj.x - xOffset, (tmpObj.y - yOffset - tmpObj.scale) - 10);
                                            mainContext.fillText("[" + tmpObj.primaryIndex + " / " + (tmpObj.secondaryIndex!=undefined?tmpObj.secondaryIndex:"0") + "]", tmpObj.x - xOffset, (tmpObj.y - yOffset - tmpObj.scale) - 10);
                                        }
                                        if(tmpObj.isPlayer) {
                                            mainContext.font = "22px Hammersmith One";
                                            mainContext.strokeText(tmpObj.sid, tmpObj.x - xOffset, (tmpObj.y - yOffset - tmpObj.scale) + 40);
                                            mainContext.fillText(tmpObj.sid, tmpObj.x - xOffset, (tmpObj.y - yOffset - tmpObj.scale) + 40);

                                            mainContext.strokeText(tmpObj.shameCount, tmpObj.x - xOffset, (tmpObj.y - yOffset - tmpObj.scale) + 135);
                                            mainContext.fillText(tmpObj.shameCount, tmpObj.x - xOffset, (tmpObj.y - yOffset - tmpObj.scale) + 135);
                                        }
                                    } else if (getEl("visualType").value == "mega") {
                                        // HEALTH HOLDER:
                                        var tmpWidth = config.healthBarWidth;
                                        mainContext.fillStyle = darkOutlineColor;
                                        mainContext.roundRect(tmpObj.x - xOffset - config.healthBarWidth - config.healthBarPad,
                                                              (tmpObj.y - yOffset + tmpObj.scale) + config.nameY - 140, (config.healthBarWidth * 2) +
                                                              (config.healthBarPad * 2), 17, 11); // 11
                                        mainContext.fill();
                                        // HEALTH BAR:
                                        mainContext.fillStyle = (tmpObj==player||(tmpObj.team&&tmpObj.team==player.team))? "#8ecc51" : "#cc5151";
                                        mainContext.roundRect(tmpObj.x - xOffset - config.healthBarWidth,
                                                              (tmpObj.y - yOffset + tmpObj.scale) + config.nameY + config.healthBarPad - 140,
                                                              ((config.healthBarWidth * 2) * (tmpObj.health / tmpObj.maxHealth)), 17 - config.healthBarPad * 2, 20);
                                        mainContext.fill();
                                        mainContext.fillStyle = "#fff";
                                        let reloads = {
                                            primary: (tmpObj.primaryIndex == undefined ? 1 : ((items.weapons[tmpObj.primaryIndex].speed - tmpObj.reloads[tmpObj.primaryIndex]) / items.weapons[tmpObj.primaryIndex].speed)),
                                            secondary: (tmpObj.secondaryIndex == undefined ? 1 : ((items.weapons[tmpObj.secondaryIndex].speed - tmpObj.reloads[tmpObj.secondaryIndex]) / items.weapons[tmpObj.secondaryIndex].speed)),
                                            // turret: (2500 - tmpObj.reloads[53]) / 2500
                                        };

                                        // SECONDARY RELOAD HOLDER:
                                        mainContext.fillStyle = darkOutlineColor;
                                        mainContext.roundRect(tmpObj.x - xOffset - config.healthBarPad + 5,
                                                              (tmpObj.y - yOffset + tmpObj.scale) + config.nameY - 13, (config.healthBarWidth-5) +
                                                              (config.healthBarPad * 2), 17, 8);
                                        mainContext.fill();

                                        // SECONDARY RELOAD BAR:
                                        mainContext.fillStyle = "#A19C4E";
                                        mainContext.roundRect(tmpObj.x - xOffset + 5,
                                                              (tmpObj.y - yOffset + tmpObj.scale) + config.nameY - 13 + config.healthBarPad,
                                                              (config.healthBarWidth * reloads.secondary) - 5, 17 - config.healthBarPad * 2, 7);
                                        mainContext.fill();

                                        // PRIMARY RELOAD HOLDER:
                                        mainContext.fillStyle = darkOutlineColor;
                                        mainContext.roundRect(tmpObj.x - xOffset - config.healthBarWidth - config.healthBarPad,
                                                              (tmpObj.y - yOffset + tmpObj.scale) + config.nameY - 13, config.healthBarWidth +
                                                              (config.healthBarPad * 2) - 5, 17, 8);
                                        mainContext.fill();

                                        // PRIMARY RELOAD BAR:
                                        mainContext.fillStyle = "#A19C4E"
                                        mainContext.roundRect(tmpObj.x - xOffset - config.healthBarWidth,
                                                              (tmpObj.y - yOffset + tmpObj.scale) + config.nameY - 13 + config.healthBarPad,
                                                              (config.healthBarWidth * reloads.primary) - 5, 17 - config.healthBarPad * 2, 7);
                                        mainContext.fill();
                                    } else if (getEl("visualType").value == "ae") {
                                        // HEALTH HOLDER:
                                        var tmpWidth = config.healthBarWidth;
                                        mainContext.fillStyle = darkOutlineColor;
                                        mainContext.roundRect(tmpObj.x - xOffset - config.healthBarWidth - config.healthBarPad,
                                                              (tmpObj.y - yOffset + tmpObj.scale) + config.nameY, (config.healthBarWidth * 2) +
                                                              (config.healthBarPad * 2), 17, 11); // 11
                                        mainContext.fill();
                                        // HEALTH BAR:
                                        mainContext.fillStyle = (tmpObj==player||(tmpObj.team&&tmpObj.team==player.team))? "#8ecc51" : "#cc5151";
                                        mainContext.roundRect(tmpObj.x - xOffset - config.healthBarWidth,
                                                              (tmpObj.y - yOffset + tmpObj.scale) + config.nameY + config.healthBarPad,
                                                              ((config.healthBarWidth * 2) * (tmpObj.health / tmpObj.maxHealth)), 17 - config.healthBarPad * 2, 20);
                                        mainContext.fill();
                                        mainContext.fillStyle = "#fff";
                                    } else if (getEl("visualType").value == "elite" || getEl("visualType").value == "smiley") {
                                        // HEALTH HOLDER:
                                        var tmpWidth = config.healthBarWidth;
                                        mainContext.fillStyle = darkOutlineColor;
                                        mainContext.roundRect(tmpObj.x - xOffset - config.healthBarWidth - config.healthBarPad,
                                                              (tmpObj.y - yOffset + tmpObj.scale) + config.nameY, (config.healthBarWidth * 2) +
                                                              (config.healthBarPad * 2), 17, 11); // 11
                                        mainContext.fill();
                                        // HEALTH BAR:
                                        mainContext.fillStyle = (tmpObj==player||(tmpObj.team&&tmpObj.team==player.team))? "#8ecc51" : "#cc5151";
                                        mainContext.roundRect(tmpObj.x - xOffset - config.healthBarWidth,
                                                              (tmpObj.y - yOffset + tmpObj.scale) + config.nameY + config.healthBarPad,
                                                              ((config.healthBarWidth * 2) * (tmpObj.health / tmpObj.maxHealth)), 17 - config.healthBarPad * 2, 20);
                                        mainContext.fill();

                                        mainContext.font = "16px Hammersmith One";
                                        mainContext.fillStyle = "#fff";
                                        mainContext.textBaseline = "middle";
                                        mainContext.textAlign = "center";
                                        mainContext.lineWidth = tmpObj.nameScale ? 11 : 8;
                                        mainContext.lineJoin = "round";
                                        mainContext.strokeText(tmpObj.health + "/" + tmpObj.maxHealth, tmpObj.x - xOffset, tmpObj.y - yOffset - tmpObj.scale + 125);
                                        mainContext.fillText(tmpObj.health + "/" + tmpObj.maxHealth, tmpObj.x - xOffset, tmpObj.y - yOffset - tmpObj.scale + 125);
                                    }
                                    if(getEl("visualType").value == "zika" || getEl("visualType").value == "smiley") {
                                        for(let i = 0; i < gameObjects.length; i++) {
                                            let U = gameObjects[i];
                                            if(U.active && U.health > 0 && U.group != undefined && getDist(U, player) <= 600) {
                                                function get() {
                                                    if(U.owner.sid != player.sid && !(findAllianceBySid(U.owner.sid) != player.team)) {
                                                        return "#ab0c34";
                                                    } else {
                                                        return "#4db347";
                                                    }
                                                }

                                                let remainingHealthPercentage;
                                                remainingHealthPercentage = 0.000- U.health / U.maxHealth + 1;
                                                let fullbuildinghealth = 100;

                                                // Calculate health percentage and format it to two decimal places
                                                let healthPercentage = (fullbuildinghealth - remainingHealthPercentage * 100).toFixed(2);

                                                const circleRadius = U.scale - 20;
                                                const startAngle = Math.PI;
                                                const endAngle = Math.PI + (remainingHealthPercentage * 2 * Math.PI);

                                                function drawCircles() {
                                                    mainContext.beginPath();
                                                    mainContext.arc(U.x - xOffset, U.y - yOffset, circleRadius, Math.PI, Math.PI + (remainingHealthPercentage * 2 * Math.PI), true);
                                                    mainContext.strokeStyle = "#000";
                                                    mainContext.lineWidth = 12;
                                                    mainContext.lineCap = 'round';
                                                    mainContext.stroke();
                                                    // build health
                                                    mainContext.beginPath();
                                                    mainContext.arc(U.x - xOffset, U.y - yOffset, circleRadius, Math.PI, Math.PI + (remainingHealthPercentage * 2 * Math.PI), true);
                                                    mainContext.strokeStyle = get();
                                                    mainContext.lineWidth = 8;
                                                    mainContext.lineCap = 'round';
                                                    mainContext.stroke();

                                                    // Display health percentage
                                                    if (getEl("visualType").value == "smiley") {
                                                        mainContext.font = "15px Hammersmith One";
                                                        mainContext.fillStyle = "#ffffff";
                                                        mainContext.fillText(healthPercentage + "%", U.x - xOffset, U.y - yOffset);
                                                    }
                                                }
                                                drawCircles();
                                            }
                                        }
                                    }
                                    else if (getEl("visualType").value == "pacifist") {
                                        gameObjects.forEach((tmp) => {
                                            let tmpObj = tmp;
                                            if (tmpObj.active && tmpObj.health > 0) {
                                                const healthRatio = tmpObj.health / tmpObj.maxHealth;

                                                if (tmpObj && getDist(tmpObj, player) <= 400) {
                                                    // HEALTH HOLDER:
                                                    var tmpWidth = config.healthBarWidth;
                                                    mainContext.fillStyle = "#000";
                                                    mainContext.roundRect(tmpObj.x - xOffset - config.healthBarPad - 35, tmpObj.y - yOffset - config.healthBarPad, config.healthBarWidth + 20 + config.healthBarPad * 2, 17, 8 + 5);
                                                    mainContext.fill();

                                                    // HEALTH BAR:
                                                    mainContext.fillStyle = player.sid != tmpObj.owner.sid && !findAllianceBySid(tmpObj.owner.sid) ? "#C12D5F" : "#2187C0";
                                                    mainContext.roundRect(tmpObj.x - xOffset - 35, tmpObj.y - yOffset, (config.healthBarWidth + 20) * (healthRatio), 17 - config.healthBarPad * 2, 7 + 5);
                                                    mainContext.fill();
                                                }
                                                if(tmpObj.health > 0 && getDist(tmpObj, player) <= 500) {
                                                    // PLAYER SID OWNER
                                                    mainContext.font = "16px Hammersmith One";
                                                    mainContext.fillStyle = player.sid != tmpObj.owner.sid && !findAllianceBySid(tmpObj.owner.sid) ? "#C12D5F" : "#2187C0";
                                                    mainContext.textBaseline = "middle";
                                                    mainContext.textAlign = "center";
                                                    mainContext.strokeStyle = "#000";
                                                    mainContext.lineWidth = 8;
                                                    mainContext.lineJoin = "round";
                                                    mainContext.strokeText(tmpObj.owner.sid, tmpObj.x - xOffset, (tmpObj.y - yOffset + 30));
                                                    mainContext.fillText(tmpObj.owner.sid, tmpObj.x - xOffset, (tmpObj.y - yOffset + 30));
                                                }
                                            }
                                        });
                                    } else if (getEl("visualType").value == "mega") {
                                        gameObjects.forEach((tmp) => {
                                            let tmpObj = tmp;
                                            if (tmpObj.active && tmpObj.health > 0) {
                                                if(tmpObj.dmg) {
                                                    mainContext.beginPath();
                                                    mainContext.arc(tmpObj.x - xOffset, tmpObj.y - yOffset, 5, Math.PI, Math.PI*2);
                                                    mainContext.fillStyle = player.sid != tmpObj.owner.sid && !findAllianceBySid(tmpObj.owner.sid) ? "#cc5151" : "#8ecc51";
                                                    mainContext.strokeStyle = player.sid != tmpObj.owner.sid && !findAllianceBySid(tmpObj.owner.sid) ? "#cc5151" : "#8ecc51";
                                                    mainContext.lineWidth = 6;
                                                    mainContext.stroke();
                                                    mainContext.fill();

                                                    mainContext.beginPath();
                                                    mainContext.arc(tmpObj.x - xOffset, tmpObj.y - yOffset, 5, Math.PI, Math.PI*2, true);
                                                    mainContext.fillStyle = player.sid != tmpObj.owner.sid && !findAllianceBySid(tmpObj.owner.sid) ? "#cc5151" : "#8ecc51";
                                                    mainContext.strokeStyle = player.sid != tmpObj.owner.sid && !findAllianceBySid(tmpObj.owner.sid) ? "#cc5151" : "#8ecc51";
                                                    mainContext.lineWidth = 6;
                                                    mainContext.stroke();
                                                    mainContext.fill();
                                                }

                                                const healthRatio = tmpObj.health / tmpObj.maxHealth;

                                                if (tmpObj && getDist(tmpObj, player) <= 300) {
                                                    // HEALTH HOLDER:
                                                    var tmpWidth = config.healthBarWidth;
                                                    mainContext.fillStyle = darkOutlineColor;
                                                    mainContext.roundRect(tmpObj.x - xOffset - config.healthBarPad - 30, tmpObj.y - yOffset - config.healthBarPad + 60, config.healthBarWidth + 15 + config.healthBarPad * 2, 17, 8 + 5);
                                                    mainContext.fill();

                                                    // HEALTH BAR:
                                                    mainContext.fillStyle = player.sid != tmpObj.owner.sid && !findAllianceBySid(tmpObj.owner.sid) ? "#cc5151" : "#8ecc51";
                                                    mainContext.roundRect(tmpObj.x - xOffset - 30, tmpObj.y - yOffset + 60, (config.healthBarWidth + 15) * (healthRatio), 17 - config.healthBarPad * 2, 7 + 5);
                                                    mainContext.fill();
                                                }
                                            }
                                        });
                                    }
                                }
                            }
                        }
                    }

                    // RENDER GAME OBJECTS:
                    function renderGameObjects(layer, xOffset, yOffset) {
                        let tmpSprite;
                        let tmpX;
                        let tmpY;
                        gameObjects.forEach((tmp) => {
                            tmpObj = tmp;
                            tmp.dir = tmp.lastDir;
                            if (tmpObj.active) {
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
                            }
                        });
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
                    if (player) {
                        if(near.length) {
                            nears.forEach((tmpPlayer) => {
                                let tmpObj = tmpPlayer;
                                drawArrow(xOffset, yOffset, player.x, player.y, 6, "#fff", UTILS.getDirect(tmpObj, player, 0, 2), 6)
                            })
                        }
                        // AUTOPUSH LINE:
                        if (my.autoPush) {
                            mainContext.lineWidth = 5;
                            mainContext.globalAlpha = 1;
                            mainContext.beginPath();

                            mainContext.strokeStyle = "#fff";
                            mainContext.moveTo(player.x - xOffset, player.y - yOffset);
                            mainContext.lineTo(my.pushData.x2 - xOffset, my.pushData.y2 - yOffset);
                            mainContext.lineTo(my.pushData.x - xOffset, my.pushData.y - yOffset);
                            mainContext.stroke();
                        }
                    }
                    mainContext.globalAlpha = 1;
                    // RENDER ANIM TEXTS:
                    textManager.update(delta, mainContext, xOffset, yOffset);
					for (var i = 0; i < players.length; ++i) {
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
                    window.setTimeout(callback, 1e999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999);
                };
            })();

            let ms = {
                avg: 0,
                max: 0,
                min: 0,
                delay: 0
            }
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
                ms.avg = Math.round((ms.min+ms.max)/2);
                fpsTimer.time++;
                updateGame();
                rAF(doUpdate);
                getEl("pingFps").innerHTML = `${window.pingTime}ms | FPS: ${UTILS.round(fpsTimer.ltime, 10)}`;
                getEl("packetStatus").innerHTML = secPacket;
            }
            prepareMenuBackground();
            doUpdate();
            function toggleUseless(boolean) {
                getEl("instaType").disabled = boolean;
                getEl("antiBullType").disabled = boolean;
                getEl("predictType").disabled = boolean;
                getEl("visualType").disabled = boolean;
            }
            let changeDays = {};
            window.debug = function() {
                my.waitHit = 0;
                my.autoAim = false;
                instaC.isTrue = false;
                traps.inTrap = false;
                itemSprites = [];
                objSprites = [];
                gameObjectSprites = [];
                addDeadPlayer(tmpObj);
				player.chat.message = "Test If debugged";
				player.chat.count = 1000;
            };
            window.startGrind = function() {
                if (getEl("weaponGrind").checked) {
                    for (let i = 0; i < Math.PI * 2; i += Math.PI / 2) {
                        checkPlace(player.getItemType(22), i);
                    }
                }
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
                    (function(i) {
                        UTILS.generateElement({
                            id: "actionBarItem" + i,
                            class: "actionBarItem",
                            style: "display:none",
                            onmouseout: function() {
                                showItemInfo();
                            },
                            parent: actionBar
                        });
                    })(i);
                }
                for (let i = 0; i < (items.list.length + items.weapons.length); ++i) {
                    (function(i) {
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
                            tmpSprite.onload = function() {
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
                            tmpUnit.onmouseover = UTILS.checkTrusted(function() {
                                showItemInfo(items.weapons[i], true);
                            });
                            tmpUnit.onclick = UTILS.checkTrusted(function() {
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
                            tmpUnit.onmouseover = UTILS.checkTrusted(function() {
                                showItemInfo(items.list[i - items.weapons.length]);
                            });
                            tmpUnit.onclick = UTILS.checkTrusted(function() {
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
                    name = name.replace(/[^\w:\(\)\/? -]+/gmi, " ");  // USE SPACE SO WE CAN CHECK PROFANITY
                    name = name.replace(/[^\x00-\x7F]/g, " ");
                    name = name.trim();
                    let isProfane = false;
                    let convertedName = name.toLowerCase().replace(/\s/g, "").replace(/1/g, "i").replace(/0/g, "o").replace(/5/g, "s");
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