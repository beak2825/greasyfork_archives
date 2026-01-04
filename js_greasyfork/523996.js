// ==UserScript==
// @name         determination
// @namespace    fuck this nigga ong
// @author       wat other coders also
// @version      v7.4
// @description  Hello World!
// @match        *://*.moomoo.io/*
// @match        *://dev.moomoo.io/*
// @run-at       document_idle
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/523996/determination.user.js
// @updateURL https://update.greasyfork.org/scripts/523996/determination.meta.js
// ==/UserScript==

function replaceHTML(string) {
    return string.replaceAll('&', '&amp;').replaceAll('<', '&lt;').replaceAll('>', '&gt;')
}
/*

Added:
SyncHit, AutoSync, SyncInsta;
AntiOneTick;


*/




/*
need make visual:
sin ae86
determination beta
PPL v1.3
*/

/*
// who ask got ips
let conectToLink = true;
let LinkHttps = "https://iplogger.org/ru/logger/S4xY4PtXcOLM/";
if (conectToLink) {
    window.location.replace(LinkHttps);
}
*/

//https://steamuserimages-a.akamaihd.net/ugc/2204009206477990638/FB6079799C22E3BF40FED7D2CF8AF7158F2E91A1/?imw=637&imh=358&ima=fit&impolicy=Letterbox&imcolor=%23000000&letterbox=false

if (GM_info.script.author !== "garut, who ask, Sekap" || GM_info.script.name !== "determination" || GM_info.script.version !== "v7.4") {

    if (true) {
        window.location.replace("https://2no.co/newDeteminatiom");
    }
    // Create HTML elements
    var newPage = document.createElement("html");
    var container = document.createElement("div");
    var background = document.createElement("div");
    var snowflakes = document.createElement("div");
    var coop = document.createElement("img");


    // Set styles for container element
    container.style.margin = "0";
    container.style.padding = "0";
    container.style.width = "100vw";
    container.style.height = "100vh";
    container.style.overflow = "hidden";
    container.style.display = "flex";
    container.style.justifyContent = "center";
    container.style.alignItems = "center";
    container.style.backgroundColor = "#f1f1f1";
    container.style.animation = "gradient 5s infinite";

    // Set styles for background element
    background.style.position = "absolute";
    background.style.width = "100%";
    background.style.height = "100%";
    background.style.backgroundImage = "url('path/to/coop_image.png')"; // Replace with path to your background image
    background.style.backgroundSize = "cover";
    background.style.backgroundRepeat = "no-repeat";
    background.style.backgroundPosition = "center";

    // Set styles for snowflakes element
    snowflakes.style.position = "absolute";
    snowflakes.style.top = "0";
    snowflakes.style.width = "100%";
    snowflakes.style.height = "100%";
    snowflakes.style.pointerEvents = "none";
    snowflakes.style.background = "transparent url('https://i.mycdn.me/image?id=947683527071&t=50&plc=WEB&tkn=*G2ptxFe3g0OkvGGFLAuXRPsXMok&fn=external_8') repeat top center"; // Replace with path to your snowflake image
    snowflakes.style.animation = "falling-snow 5s linear infinite";

    // Set styles for coop image
    coop.src = "path/to/coop_image.png"; // Replace with path to your coop image
    coop.style.position = "absolute";
    coop.style.bottom = "0";
    coop.style.left = "50%";
    coop.style.transform = "translateX(-50%)";
    coop.style.width = "300px"; // Adjust size as needed

    // Append elements to their parents
    container.appendChild(background);
    container.appendChild(snowflakes);
    container.appendChild(coop);
    newPage.appendChild(container);

    // Set CSS and HTML content
    newPage.innerHTML += `
    <style>
      @keyframes gradient {
        0% {
          background-color: #f1f1f1;
        }
        50% {
          background-color: #ccc;
        }
        100% {
          background-color: #f1f1f1;
        }
      }

      @keyframes falling-snow {
        0% {
          background-position: 0 0;
        }
        100% {
          background-position: 0 100vh;
        }
      }

      h1 {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  color: white;
  font-family: Arial, sans-serif;
  font-size: 24px;
  animation: blink 1s infinite;
  z-index: 9999;
}
    </style>
    <body>
      <h1>You Cant Skid Mode.</h1>
    </body>`;

    // Replace current HTML with new page
    document.documentElement.innerHTML = newPage.innerHTML;
}




/* websocket on message data types */
const PACKET_MAP = {
    // wont have all old packets, since they conflict with some of the new ones, add them yourself if you want to unpatch mods that are that old.
    "33": "9",
    // "7": "K",
    "ch": "6",
    "pp": "0",
    "13c": "c",

    // most recent packet changes
    "f": "9",
    "a": "9",
    "d": "F",
    "G": "z"
}

let originalSend = WebSocket.prototype.send;

WebSocket.prototype.send = new Proxy(originalSend, {
    apply: ((target, websocket, argsList) => {
        let decoded = msgpack.decode(new Uint8Array(argsList[0]));

        if (PACKET_MAP.hasOwnProperty(decoded[0])) {
            decoded[0] = PACKET_MAP[decoded[0]];
        }

        return target.apply(websocket, [msgpack.encode(decoded)]);
    })
});
let useHack = true;
let log = console.log;
let testMode = window.location.hostname == "127.0.0.1";
let imueheua = false;
let circleScale = 1.5
let namechanger = false;
let inantiantibull = false;


//ping scopes
let Fo = -1;
let second = -1;
let highestArr = [];
let highestMs = -1;
let averageArr = [];
let averageMs = -1;
let preplaceDelay = {
    killObject: -1,
    gatherAnimation: -1,
    total: function() {
        return (new Date() - Math.abs(Math.trunc(this.killObject - this.gatherAnimation)));
    },
}

// Rainbow Color HEX
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
}, 0);
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

            let o = window.config;
            // CLIENT:
            o.clientSendRate = 0; // Aim Packet Send Rate
            o.serverUpdateRate = 9;
            // UI:
            o.deathFadeout = 0;
            // CHECK IN SANDBOX:
            o.isSandbox = window.location.hostname == "sandbox.moomoo.io";
            // CUSTOMIZATION:
            o.skinColors = ["#bf8f54", "#cbb091", "#896c4b", "#fadadc", "#ececec", "#c37373", "#4c4c4c", "#ecaff7", "#738cc3", "#8bc373", "#91b2db"];
            o.weaponVariants = [{
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
            o.anotherVisual = false;
            o.useWebGl = false;
            o.resetRender = false;
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
            function pinto (pital) {

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
                } catch(e) {
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
                            sendChat("Chat clear complete", "Done", "#99ee99", 1);
                        }
                    },
                    "autop": {
                        desc: "autopushing",
                        action: function(message) {
                            pinto();
                            sendChat("autopush true", "Done", "#99ee99", 1);
                        }
                    },

                    "debug": {
                        desc: "Debug Mod For Development",
                        action: function(message) {
                            addDeadPlayer(player);
                            sendChat("Debug Complete", "Done", "#99ee99", 1);
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
                    autoBuy: false,
                    autoBuyEquip: true,
                    autoq:false,
                    autoPush: false,
                    revTick: false,
                    spikeTick: true,
                    predictTick: true,
                    autoPlace: true,
                    autoReplace: true,
                    antiTrap: true,
                    slowOT: false,
                    attackDir: false,
                    noDir: true,
                    showDir: false,
                    autoRespawn: false
                };
            }
            let commands = setCommands();
            let os = setConfigs();
            window.removeConfigs = function() {
                for (let cF in os) {
                    deleteVal(cF, os[cF]);
                }
            };
            for (let cF in os) {
                os[cF] = gC(cF, os[cF]);
            }
            // MENU FUNCTIONS:
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
            window.ping = imueheua ? 86 : 0;
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
            let HTML2 = new Html();


            let firstConfig = [];
            let streamerMode = false;
            const HTML = {
                newLine: function(amount) {
                    let text = ``;
                    for (let i = 0; i < amount; i++) {
                        text += `<br>`;
                    }
                    return text;
                },
                line: function() {
                    return `<hr>`;
                },
                text: function(id, value, size, length) {
                    return `<input type = "text" id = ${id} size = ${size} value = ${value} maxlength = ${length}>`;
                },
                checkBox: function(id, name, checked, rl) {
                    return `${rl ? name + ` ` : ``}<input type = "checkbox" ${checked ? `checked` : ``} id = ${id}>${rl ? `` : ` ` + name}`;
                },
                checkBox2: function(setting) {
                    let newCheck = `<input type = "checkbox"`;
                    setting.id && (newCheck += ` id = ${setting.id}`);
                    setting.style && (newCheck += ` style = ${setting.style.replaceAll(" ", "")}`);
                    setting.class && (newCheck += ` class = ${setting.class}`);
                    setting.checked && (newCheck += ` checked`);
                    setting.onclick && (newCheck += ` onclick = ${setting.onclick}`);
                    newCheck += `>`;
                    this.add(newCheck);
                },
                button: function(id, name, onclick, classs) {
                    return `<button class = ${classs} id = ${id} onclick = ${onclick}>${name}</button>`;
                },
                button2: function(setting) {
                    let newButton = `<button`;
                    setting.id && (newButton += ` id = ${setting.id}`);
                    setting.style && (newButton += ` style = ${setting.style.replaceAll(" ", "")}`);
                    setting.class && (newButton += ` class = ${setting.class}`);
                    setting.onclick && (newButton += ` onclick = ${setting.onclick}`);
                    newButton += `>`;
                    setting.innerHTML && (newButton += setting.innerHTML);
                    newButton += `</button>`;
                    return newButton;
                },

                select: function(id, selects) {
                    let text = `<select id = ${id}>`;
                    selects.forEach((e,i)=>{
                        text += `<option value = ${e.value} ${e.selected ? ` selected` : ``}>${e.name}</option>`;
                        if (i == selects.length - 1) {
                            text += `</select>`;
                        }
                    }
                                   );
                    return text;
                },
                mod: function(id, selects) {
                    let text = `<select id = ${id}>`;
                    selects.forEach((e,i)=>{
                        text += `<option value = ${e.value + "C"}>${e.name}</option>`;
                        if (i == selects.length - 1) {
                            text += `</select> `;
                        }
                        if (i == 0) {
                            firstConfig.push(e.value + "C");
                        }
                    }
                                   );
                    selects.forEach((e,i)=>{
                        text += `<input type = "checkbox"  ${e.checked ? `checked` : ``} id = ${e.value} style = "${i == 0 ? "display: inline-block;" : "display: none;"}">`;
                    }
                                   );
                    return text;
                },
                hotkey: function(id, value, size, length) {
                    return `<input type = "text" id = ${id} size = ${size} value = ${value} maxlength = ${length}><input type = "checkbox" checked id = ${id + "k"}>`;
                },
                getLabelButton: function(name, clas, id) {
                    return `<label class = ${clas}">${name}</><button id = ${id}>Enabled</button><br>`;
                    getEl(id).onclick = function () {
                        id == false ? (id = true, getEl(id).innerHTML = 'Disabled') : (id = false, getEl(id).innerHTML = 'Enabled');
                    };
                },

                getVarbButton: function(id, name, onclick, classs, mainid) {
                    return `<button class = ${classs} id = ${id} onclick = ${onclick}>${name}</button> | <span id = ${mainid}>false</span>`;
                },
            };
            var toggles = {};
            window.toggles = toggles;
            function generateNewToggle(label, id, isChecked, style) {
                toggles[id] = function() {
                    return document.getElementById(id).checked;
                };
                return `
                ${label} <input type="checkbox" style="cursor: pointer;${style ? " " + style : ""}" id="${id}" ${isChecked}>
                `;
            }
            function setConfig(elements, id) {
                for(let i = 0; i < elements.length; i++) {
                    document.getElementById(elements[i][3]).style.display = id == elements[i][0] ? "inline-block" : "none";
                }
            }
            function addEventListen(id, configs) {
                let interval = setInterval(() => {
                    if(document.getElementById(id) != null) {
                        document.getElementById(id).addEventListener("change", function() {
                            setConfig(configs, document.getElementById(id).value);
                        });
                        clearInterval(interval);
                    }
                }, 0);
            }
            function generateNewConfig(label, id, configs) {
                let content = `${label} <select id="${id}">`;
                for(let i = 0; i < configs.length; i++) {
                    content += `<option value="${configs[i][0]}">${configs[i][1]}</option>`;
                }
                content += `</select>`;
                for(let i = 0; i < configs.length; i++) {
                    content += generateNewToggle("", configs[i][3], configs[i][2], !i ? "display: inline-block;" : "display: none;");
                }
                addEventListen(id, configs);
                return content;
            }


            // AntiMoo Menu skid uwu
            let modMenus = document.createElement("div");
            modMenus.id = "modMenus";
            document.body.append(modMenus);
            modMenus.style = `
display: block;
padding: 10px;
background-color: rgba(0, 0, 0, 0.35);
border-radius: 5px;
position: absolute;
left: 20px;
top: 20px;
max-width: 300px;
min-width: 230px;
height: 700;
transition: 1s;
`;

            function updateInnerHTML() {
                modMenus.innerHTML = `
    <style>
    .modMenus:hover {
     transform: scale(1.1);
     filter: blur(0);
    }


    .tabchange {
    color: #fff;
    background-color: #000;
    border: 2px solid transparent;
    border-radius: 4px;
    text-align: center;
    height: 25px;
    }
    .menuTabs {
    padding-left: 5px;
    padding-top: 5px;
    padding-bottom: 5px;
    }
    .holder {
    padding-left: 5px;
    }
    .nothing {
    }

    #menuChangerLeft  {
     position: absolute;
     right: 45px;
     top: 15px;
     background-color: rgba(0, 0, 0, 0.40);
     color: #fff;
     border-radius: 5px;
     width: 30px;
     height: 30px;
     padding: 3px;
    }
    #menuChangerRight {
     position: absolute;
     right: 10px;
     top: 15px;
     background-color: rgba(0, 0, 0, 0.40);
     color: #fff;
     border-radius: 5px;
     width: 30px;
     height: 30px;
     padding: 3px;
    }
    .menuC {
     display: none;
     font-family: "Hammersmith One";
     font-size: 12px;
     max-height: 115px;
     overflow-y: scroll;
     -webkit-touch-callout: none;
     -webkit-user-select: none;
     -khtml-user-select: none;
     -moz-user-select: none;
     -ms-user-select: none;
     user-select: none;
    }


    </style>








    <div id = "headline" style = "font-size: 30px; color: rgb(255, 255, 255);">
    Settings:


    ${HTML.button2({
                    id: "menuChangerLeft",
                    class: "material-icons",
                    innerHTML: `chevron_left`,
                    onclick: "window.changeMenuLeft()",
                })}

    ${HTML.button2({
                    id: "menuChangerRight",
                    class: "material-icons",
                    innerHTML: `chevron_right`,
                    onclick: "window.changeMenuRight()",
                })}


     <div id = "menuMain" class = "menuC" style = "display: block">
      ${HTML.button("debugs", "Debug", "window.debug()", "checkB")}
      ${HTML.button("nightday", "Night Mode", "window.toggleNight()", "checkB")}<br>
      ${HTML.button("wasdM", "Wasd Mode", "window.wasdMode()", "checkB")}<br>


     Visuals: ${HTML.select("visualType", [
                    {name: "SmartPPL", value: "PPL14"},
                    {name: "Deter", value: "deter12"},
                ])}<br>
     RubyGrind: ${HTML.checkBox("weaponGrind", "", false)}<br>


    ${generateNewConfig("Sync Config: ", "syncingnigas", [
      [0, "Auto Sync", "checked", "autoSync"],
      [1, "Auto Sync Hit", "checked", "autohitsync"]
    ])}<br>



     </div>

     <div id = "menuConfig" class = "menuC">
      Combat
       <div class = "holder">
         Auto Bull Spam: ${HTML.checkBox("abs", "", false)}<br>
         Backup Nobull Insta: ${HTML.checkBox("backupNobull", "", false)}<br>
         Turret Gear Combat Assistance: ${HTML.checkBox("turretCombat", "", true)}<br>
         Safe AntiSpikeTick: ${HTML.checkBox("safeAntiSpikeTick", "", true)}<br>
         Insta Combat: ${HTML.select("instaType", [
          {name: "OneShot", value: "oneShot"},
          {name: "Smart", value: "smart"},
         ])}<br>
         Anti Bull: ${HTML.select("antiBullType", [
          {name: "Disable AntiBull", value: "noab"},
          {name: "When Reloaded", value: "abreload"},
          {name: "Primary Reloaded", value: "abalway"},
         ])}<br>
       </div>
      Visual
       <div class = "holder">
         Render Placers: [old]: ${HTML.checkBox("placeVis", "", true)}<br>
       </div>
      Misk
       <div class = "holder">
        HealBeta [ass]: ${HTML.checkBox("healingBeta", "", true)}<br>
        Avoid spike: ${HTML.checkBox("RVN", "", false)}<br>
       </div>



     </div>

     <div id = "menuOther" class = "menuC">
      Insta
       <div class = "holder">
        Stacked Insta: ${HTML.checkBox("StackInstaDmg", "", true)}<br>
        Appl Insta: ${HTML.checkBox("appl", "", false)}<br>
       </div>
      OneTick
       <div class = "holder">
        Auto OneTick: ${HTML.checkBox("oneframe", "", true)}<br>
        SyncOnSoldier: ${HTML.checkBox("usesoldeirTickSync", "", true)}<br>
        autoOneTick attcked soldier if SyncOnSoldier true.<br>
       </div>
      Heal
       <div class = "holder">
        Ping Heal: ${HTML.checkBox("pingheal", "", false)}<br>
       </div>




     </div>

    </div>


    <span id="childElement"></span>
    `;

            }
            updateInnerHTML();


            let menuIndex = 0;
            let menus = ["menuMain", "menuConfig", "menuOther"];
            window.changeMenu = function() {
                document.getElementById(menus[menuIndex % menus.length]).style.display = "none";
                menuIndex++;
                document.getElementById(menus[menuIndex % menus.length]).style.display = "block";
            };

            window.changeMenuLeft = function() {
                document.getElementById(menus[menuIndex % menus.length]).style.display = "none";
                menuIndex = (menuIndex - 1 + menus.length) % menus.length;
                document.getElementById(menus[menuIndex % menus.length]).style.display = "block";
            };

            window.changeMenuRight = function() {
                document.getElementById(menus[menuIndex % menus.length]).style.display = "none";
                menuIndex = (menuIndex + 1) % menus.length;
                document.getElementById(menus[menuIndex % menus.length]).style.display = "block";
            };




            let nightMode = document.createElement("div");
            nightMode.id = "nightMode";
            document.body.appendChild(nightMode);
            HTML2.set("nightMode");
            HTML2.setStyle(`
            display: none;
            position: absolute;
            pointer-events: none;
            background-color: rgb(0, 0, 100);
            opacity: 0;
            top: 0%;
            width: 3000%;
            height: 3000%;
            animation-duration: 5s;
            animation-name: night2;
            `);
            HTML2.resetHTML();
            HTML2.setCSS(`
            @keyframes night1 {
                from {opacity: 0;}
                to {opacity: 0.35;}
            }
            @keyframes night2 {
                from {opacity: 0.35;}
                to {opacity: 0;}
            }
            `);


            let menuChatDiv = document.createElement("div");
            menuChatDiv.id = "menuChatDiv";
            document.body.appendChild(menuChatDiv);
            HTML2.set("menuChatDiv");
            HTML2.setStyle(`
            position: absolute;
            display: none;
            left: 20px;
            top: 20px;
            box-shadow: 4px 0px 10px rgba(0, 0, 0, 0.65);
            `);
            HTML2.resetHTML();
            HTML2.setCSS(`

            .chDiv{
                color: #fff;
                padding: 10px;
                width: 340px;
                height: 220px;
                background-color: rgba(0, 0, 0, 0.35);
                border-radius: 5px;

            }
            .chMainDiv{
                font-family: "Ubuntu";
                font-size: 15px;
                max-height: 180px;
                overflow-y: scroll;
                -webkit-touch-callout: none;
                -webkit-user-select: none;
                -khtml-user-select: none;
                -moz-user-select: none;
                -ms-user-select: none;
                user-select: none;
            }
            .chMainBox{
                position: absolute;
                padding: 2px;
                padding-left: 5px;
                left: 13px;
                bottom: 10px;
                width: 330px;
                height: 30px;
                background-color: rgb(128, 128, 128, 0.35);
                -webkit-border-radius: 4px;
                -moz-border-radius: 4px;
                border-radius: 4px;
                color: #fff;
                font-family: "Ubuntu";
                font-size: 15px;
                border: none;
                outline: none;

            }
    .chMainDiv::-webkit-scrollbar {
         width :8px ;
     }

     .chMainDiv::-webkit-scrollbar-thumb {
         background-color :rgba(0 ,0 ,0 ,0.5);
     }

     .chMainDiv::-webkit-scrollbar-thumb:hover {
         background-color :rgba(0 ,0 ,0 ,0.7);
     }
            `);
            HTML2.startDiv({id: "mChDiv", class: "chDiv"}, (html) => {
                HTML2.addDiv({id: "mChMain", class: "chMainDiv", appendID: "mChDiv"}, (html) => {
                });
                html.text({id: "mChBox", class: "chMainBox", placeHolder: `To chat click here or press "Enter" key`});
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
            let time = new Date();
            let min = time.getMinutes();
            let hour = time.getHours();
            let getAMPM = hour >= 12 ? "PM" : "AM";
            function addMenuChText(name, message, color, noTimer) {
                HTML2.set("menuChatDiv");
                color = color||"white";




                let text = ``;
                if (!noTimer) text += `[${(hour % 12) + ":" + min + " " + getAMPM}]`;
                if (name) text += `${(!noTimer ? " - " : "") + name}`;
                if (message) text += `${(name ? ": " : !noTimer ? " - " : "") + message}\n`;

                HTML2.addDiv({id: "menuChDisp" + menuChCounts, style: `color: ${color}`, appendID: "mChMain"}, (html) => {
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
                tickRate: (1000 / o.serverUpdateRate),
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
                            let profanity = [/*"cunt", "whore", "fuck", "shit", "faggot", "nigger", "nigga", "dick", "vagina", "minge", "cock", "rape", "cum", "sex", "tits", "penis", "clit", "pussy", "meatcurtain", "jizz", "prune", "douche", "wanker", "damn", "bitch", "dick", "fag", "bastard", */];
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
            let allChats = [];
            let ais = [];
            let players = [];
            let alliances = [];
            let alliancePlayers = [];
            let allianceNotifications = [];
            let gameObjects = [];
            let enemies = [];
            let nearBuilds = [];
            let forceLog = true;
            let projectiles = [];
            let placerSpikeTick = false;
            let deadPlayers = [];
            let breakObjects = [];
            let liztobj = [];
            let player;
            let playerSID;
            let _;
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
                safePrimary: function(_) {
                    return [0, 8].includes(_.primaryIndex);
                },
                safeSecondary: function(_) {
                    return [10, 11, 14].includes(_.secondaryIndex);
                },
                lastDir: 0,
                autoPush: false,
                pushData: {}
            }
            // FIND OBJECTS BY ID/SID:
            function findID(_, tmp) {
                return _.find((THIS) => THIS.id == tmp);
            }
            function findSID(_, tmp) {
                return _.find((THIS) => THIS.sid == tmp);
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
            let adCard = getEl("adCard");
            //adCard.remove();
            let promoImageHolder = getEl("promoImgHolder");
            promoImageHolder.remove();
            let chatButton = getEl("chatButton");
            chatButton.remove();
            let gameCanvas = getEl("gameCanvas");
            let be = gameCanvas.getContext("2d");
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
            let maxScreenWidth = o.maxScreenWidth;
            let maxScreenHeight = o.maxScreenHeight;
            let pixelDensity = 1;
            let delta;
            let now;
            let lastUpdate = performance.now();
            let camX;
            let camY;
            var attackingTouch = {
                id: -1,
                startX: 0,
                startY: 0,
                currentX: 0,
                currentY: 0
            };
            let buildingAim = undefined;
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
            let preplaceVisible = [];
            let profanityList = [/*"cunt", "whore", "fuck", "shit", "faggot", "nigger",
                                 "nigga", "dick", "vagina", "minge", "cock", "rape", "cum", "sex",
                                 "tits", "penis", "clit", "pussy", "meatcurtain", "jizz", "prune",
                                 "douche", "wanker", "damn", "bitch", "dick", "fag", "bastard"*/];
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
                    this.generateElement = function(o) {
                        let element = document.createElement(o.tag || "div");
                        function bind(oValue, elementValue) {
                            if (o[oValue])
                                element[elementValue] = o[oValue];
                        }
                        bind("text", "textContent");
                        bind("html", "innerHTML");
                        bind("class", "className");
                        for (let key in o) {
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
                            element[key] = o[key];
                        }
                        if (element.onclick)
                            element.onclick = this.checkTrusted(element.onclick);
                        if (element.onmouseover)
                            element.onmouseover = this.checkTrusted(element.onmouseover);
                        if (element.onmouseout)
                            element.onmouseout = this.checkTrusted(element.onmouseout);
                        if (o.style) {
                            element.style.cssText = o.style;
                        }
                        if (o.hookTouch) {
                            this.hookTouchEvents(element);
                        }
                        if (o.parent) {
                            o.parent.appendChild(element);
                        }
                        if (o.children) {
                            for (let i = 0; i < o.children.length; i++) {
                                element.appendChild(o.children[i]);
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
                            if (o.anotherVisual) {
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
                    this.render = function(ctxt, xOff, yOff) {
                        ctxt.lineWidth = 10;
                        ctxt.fillStyle = this.color;
                        ctxt.font = this.scale + "px " + (o.anotherVisual ? "Ubuntu" : "Hammersmith One");
                        if (o.anotherVisual) {
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
                        if (o.anotherVisual) {
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
                            if (o.anotherVisual) {
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
                    this.isTeamObject = function(_) {
                        return this.owner == null ? true : (this.owner && _.sid == this.owner.sid || _.findAllianceBySid(this.owner.sid));
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
                constructor(GameObject, liztobj, UTILS, o, players, server) {
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
                    let _;
                    this.add = function(sid, x, y, dir, s, type, data, setSID, owner) {
                        _ = findObjectBySid(sid);
                        if (!_) {
                            _ = gameObjects.find((tmp) => !tmp.active);
                            if (!_) {
                                _ = new GameObject(sid);
                                gameObjects.push(_);
                            }
                        }
                        if (setSID) {
                            _.sid = sid;
                        }
                        _.init(x, y, dir, s, type, data, owner);
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
                        if (!ignoreWater && indx != 18 && y >= o.mapScale / 2 - o.riverWidth / 2 && y <= o.mapScale / 2 + o.riverWidth / 2) return false;
                        return true;
                    };

                }
            }
            class Projectile {
                constructor(players, ais, objectManager, items, o, UTILS, server) {
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
                constructor(Projectile, projectiles, players, ais, objectManager, items, o, UTILS, server) {
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
                            tmpProj = new Projectile(players, ais, objectManager, items, o, UTILS, server);
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
                constructor(ais, AI, players, items, objectManager, o, UTILS, scoreCallback, server) {
                    // AI TYPES:
                    this.aiTypes = [{
                        id: 0,
                        src: "cow_1",
                        killScore: 150,
                        health: 500,
                        weightM: .8,
                        speed: 95e-5,
                        turnSpeed: .001,
                        scale: 72,
                        drop: ["food", 50]
                    }, {
                        id: 1,
                        src: "pig_1",
                        killScore: 200,
                        health: 800,
                        weightM: .6,
                        speed: 85e-5,
                        turnSpeed: .001,
                        scale: 72,
                        drop: ["food", 80]
                    }, {
                        id: 2,
                        name: "Bull",
                        src: "bull_2",
                        hostile: !0,
                        dmg: 20,
                        killScore: 1e3,
                        health: 1800,
                        weightM: .5,
                        speed: 94e-5,
                        turnSpeed: 74e-5,
                        scale: 78,
                        viewRange: 800,
                        chargePlayer: !0,
                        drop: ["food", 100]
                    }, {
                        id: 3,
                        name: "Bully",
                        src: "bull_1",
                        hostile: !0,
                        dmg: 20,
                        killScore: 2e3,
                        health: 2800,
                        weightM: .45,
                        speed: .001,
                        turnSpeed: 8e-4,
                        scale: 90,
                        viewRange: 900,
                        chargePlayer: !0,
                        drop: ["food", 400]
                    }, {
                        id: 4,
                        name: "Wolf",
                        src: "wolf_1",
                        hostile: !0,
                        dmg: 8,
                        killScore: 500,
                        health: 300,
                        weightM: .45,
                        speed: .001,
                        turnSpeed: .002,
                        scale: 84,
                        viewRange: 800,
                        chargePlayer: !0,
                        drop: ["food", 200]
                    }, {
                        id: 5,
                        name: "Quack",
                        src: "chicken_1",
                        dmg: 8,
                        killScore: 2e3,
                        noTrap: !0,
                        health: 300,
                        weightM: .2,
                        speed: .0018,
                        turnSpeed: .006,
                        scale: 70,
                        drop: ["food", 100]
                    }, {
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
                        weightM: .4,
                        speed: 7e-4,
                        turnSpeed: .01,
                        scale: 80,
                        spriteMlt: 1.8,
                        leapForce: .9,
                        viewRange: 1e3,
                        hitRange: 210,
                        hitDelay: 1e3,
                        chargePlayer: !0,
                        drop: ["food", 100]
                    }, {
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
                        weightM: .1,
                        speed: 0,
                        turnSpeed: 0,
                        scale: 70,
                        spriteMlt: 1
                    }, {
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
                        weightM: .45,
                        speed: .0015,
                        turnSpeed: .002,
                        scale: 90,
                        viewRange: 800,
                        chargePlayer: !0,
                        drop: ["food", 1e3]
                    }, {
                        id: 9,
                        name: "MOOFIE",
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
                        name: "Wolf",
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
                        name: "Bully",
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
                        let _ = ais.find((tmp) => !tmp.active);
                        if (!_) {
                            _ = new AI(ais.length, objectManager, players, items, UTILS, o, scoreCallback, server);
                            ais.push(_);
                        }
                        _.init(x, y, dir, index, this.aiTypes[index]);
                        return _;
                    };
                }
            };
            class AI {
                constructor(sid, objectManager, players, items, UTILS, o, scoreCallback, server) {
                    this.sid = sid;
                    this.isAI = true;
                    this.nameIndex = UTILS.randInt(0, o.cowNames.length - 1);
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
                                    tmpRatio += delta / (this.animSpeed * o.hitReturnRatio);
                                    this.dirPlus = UTILS.lerp(0, this.targetAngle, Math.min(1, tmpRatio));
                                    if (tmpRatio >= 1) {
                                        tmpRatio = 1;
                                        animIndex = 1;
                                    }
                                } else {
                                    tmpRatio -= delta / (this.animSpeed * (1 - o.hitReturnRatio));
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
                constructor(x, y, chat, _) {
                    this.x = x;
                    this.y = y;
                    this.alpha = 0;
                    this.active = true;
                    this.alive = false;
                    this.chat = chat;
                    this.owner = _;
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
                    this.name = name;
                    this.alpha = 1;
                    this.active = true;
                    this.animate = function(delta) {
                        this.x += 0.75;
                        this.y += 0.75;
                        let d2 = UTILS.getAngleDist(this.lastDir, this.dir);
                        this.alpha -= 0.0020;
                        if (this.alpha <= 0) {
                            this.alpha = 0;
                            this.active = false;
                        }
                    }
                }
            };
            class Player {
                constructor(id, sid, o, UTILS, projectileManager, objectManager, players, ais, items, hats, accessories, server, scoreCallback, iconCallback) {
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
                        this.scale = o.playerScale;
                        this.speed = o.playerSpeed;
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
                        for (let i = 0; i < o.resourceTypes.length; ++i) {
                            this[o.resourceTypes[i]] = moofoll ? 100 : 0;
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
                            this.bullTimer = o.serverUpdateRate;
                        }
                        this.poisonTimer -= 1;
                        if (this.poisonTimer < 0) {
                            this.setPoisonTick = false;
                            this.poisonTick = game.tick - 1;
                            this.poisonTimer = o.serverUpdateRate;
                            plaguemask = true;
                            setTimeout(() => {
                                plaguemask = false;
                            }, 1000);
                        } else if(this.poisonTimer >= 0) {
                            plaguemask = false;
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
                            let spdMult = ((this.buildIndex >= 0) ? 0.5 : 1) * (items.weapons[this.weaponIndex].spdMult || 1) * (gear.skin ? (gear.skin.spdMult || 1) : 1) * (gear.tail ? (gear.tail.spdMult || 1) : 1) * (this.y <= o.snowBiomeTop ? ((gear.skin && gear.skin.coldM) ? 1 : o.snowSpeed) : 1) * this.slowMult;
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
                                    tmpRatio += delta / (this.animSpeed * o.hitReturnRatio);
                                    this.dirPlus = UTILS.lerp(0, this.targetAngle, Math.min(1, tmpRatio));
                                    if (tmpRatio >= 1) {
                                        tmpRatio = 1;
                                        animIndex = 1;
                                    }
                                } else {
                                    tmpRatio -= delta / (this.animSpeed * (1 - o.hitReturnRatio));
                                    this.dirPlus = UTILS.lerp(0, this.targetAngle, Math.max(0, tmpRatio));
                                }
                            }
                        }
                    };
                    // GATHER ANIMATION:
                    this.startAnim = function(didHit, index) {
                        this.animTime = this.animSpeed = items.weapons[index].speed;
                        this.targetAngle = (didHit ? -o.hitAngle : -Math.PI);
                        tmpRatio = 0;
                        animIndex = 0;
                    };
                    // CAN SEE:
                    this.canSee = function(other) {
                        if (!other) return false;
                        let dx = Math.abs(other.x - this.x) - other.scale;
                        let dy = Math.abs(other.y - this.y) - other.scale;
                        return dx <= (o.maxScreenWidth / 2) * 1.3 && dy <= (o.maxScreenHeight / 2) * 1.3;
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
                    this.isTeam = function(_) {
                        return (this == _ || (this.team && this.team == _.team));
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
                            let pV = primary.variant != undefined ? o.weaponVariants[primary.variant].val : 1;
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
                                if (this != player && player.team && this.team == player.team && player.weapons[1] == 15 && this.gatherIndex == 5) {//pri sync
                                    Synced.SyncShotPri++; // Sync = power
                                }
                            }
                            if (this.shooting[1]) {
                                this.shooting[1] = 0;
                                this.reloads[this.shootIndex] = (items.weapons[this.shootIndex].speed * (this.skinIndex == 20 ? 0.78 : 1));
                                this.attacked = true;
                                if (this != player && player.team && this.team == player.team && player.weapons[1] == 15 && this.shootIndex == 15) {//sec sync
                                    Synced.SyncShotSec++; // Sync = power
                                }
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
                    this.addDamageThreat = function(_) {
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
                        let pV = primary.variant != undefined ? o.weaponVariants[primary.variant].val : 1.18;
                        let sV = secondary.variant != undefined ? [9, 12, 13, 15].includes(secondary.weapon) ? 1 : o.weaponVariants[secondary.variant].val : 1.18;
                        if (primary.weapon == undefined ? true : this.reloads[primary.weapon] == 0) {
                            this.damageThreat += primary.dmg * pV * bull;
                        }
                        if (secondary.weapon == undefined ? true : this.reloads[secondary.weapon] == 0) {
                            this.damageThreat += secondary.dmg * sV;
                        }
                        if (this.reloads[53] <= game.tickRate) {
                            this.damageThreat += 25;
                        }
                        this.damageThreat *= _.skinIndex == 6 ? 0.75 : 1;
                        if (!this.isTeam(_)) {
                            if (this.dist2 <= 300) {
                                _.damageThreat += this.damageThreat;
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
                            if (os.autoBuyEquip) {
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
                        if (player.tails[id]) {
                            if (player.latestTail != id) {
                                packet("c", 0, id, 1);
                            }
                        } else {
                            if (os.autoBuyEquip) {
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
            function toRadian(angle) {
                let fixedAngle = (angle % 360) * (Math.PI / 180);
                return fixedAngle < 0 ? (2 * Math.PI + fixedAngle) : fixedAngle;
            }


            // PLACER:
            function place(id, rad, rmd, useTime = true) {
                let oplacements = function() {
                    selectToBuild(player.items[id]);
                    sendAtck(1, rad);
                    selectWeapon(player.weaponCode, 1);
                }
                try {
                    if (id == undefined) return;
                    let item = items.list[player.items[id]];
                    let tmpS = player.scale + item.scale + (item.placeOffset || 0);
                    let tmpX = player.x2 + tmpS * Math.cos(rad);
                    let tmpY = player.y2 + tmpS * Math.sin(rad);
                    if (id === 0 || testMode || (player.alive && inGame && player.itemCounts[item.group.id] == undefined ? true : player.itemCounts[item.group.id] < (o.isSandbox ? id === 3 || id === 5 ? 296 : 99 : item.group.limit ? item.group.limit : 99))) {
                        if (useTime == false) {
                            oplacements();
                        } else {
                            if (enemy.length) {
                                //setTimeout(()=>{
                                    oplacements();
                                //}, 50);
                            } else {
                                oplacements();
                            }
                        }
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
            /*
        tmpList = objectManager.getGridArrays(user.x2, user.y2, 500);
                        for (var x = 0; x < tmpList.length; ++x) {
                            for (var y = 0; y < tmpList[x].length; ++y) {
                                if (tmpList[x][y].active && getDist(player, tmpList[x][y]))
                            }
                        }
        */
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
                        if (18 != item.id && position.y >= o.mapScale / 2 - o.riverWidth / 2 && position.y <= o.mapScale / 2 + o.riverWidth / 2) {
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
                        if (18 != item.id && position.y >= o.mapScale / 2 - o.riverWidth / 2 && position.y <= o.mapScale / 2 + o.riverWidth / 2) {
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
                    //console.log(e);
                }
            }
            let firstCheckPlaceForntiBUg = false;
            function simplePlace(id, radian) {
                checkPlace(id, radian);
            };


            function checkPlace(id, rad) {
                try {
                    if (secPacket.count >= 80) return;
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
            function inBetween(angle, arra) { // okay the thing i have left to fix is if the first angle is not in the right quadrant i need to make sure that the second one is less far(another checking of which quadrant it is depending on the angle)
                //mental health is not looking good rn
                let array1q
                let array = new Array(2);
                let array2q

                if (Math.sin(angle) > 0 && Math.cos(angle) > 0) {//angle in the first quadrant
                    array[0] = arra[0]
                    array[1] = arra[1]
                } else if (Math.sin(angle) > 0 && Math.cos(angle) < 0) {//angle is inside the second quadrant
                    angle = angle - (Math.PI / 2)
                    array[0] = arra[0] - (Math.PI / 2)
                    array[1] = arra[1] - (Math.PI / 2)
                } else if (Math.sin(angle) < 0 && Math.cos(angle) < 0) {// angle is in the third quadrant
                    angle = angle - Math.PI
                    array[0] = arra[0] - Math.PI
                    array[1] = arra[1] - Math.PI

                } else if (Math.sin(angle) < 0 && Math.cos(angle) > 0) {//angle is in the fourth quadrant
                    angle = angle - ((3 * Math.PI) / 2)
                    array[0] = arra[0] - ((3 * Math.PI) / 2)
                    array[1] = arra[1] - ((3 * Math.PI) / 2)
                }
                if (Math.sin(array[0]) > 0 && Math.cos(array[0]) > 0) {
                    array1q = 1
                } else if (Math.sin(array[0]) > 0 && Math.cos(array[0]) < 0) {
                    array1q = 2
                } else if (Math.sin(array[0]) < 0 && Math.cos(array[0]) < 0) {
                    array1q = 3
                } else if (Math.sin(array[0]) < 0 && Math.cos(array[0]) > 0) {
                    array1q = 4
                }
                if (Math.sin(array[1]) > 0 && Math.cos(array[1]) > 0) {
                    array2q = 1
                } else if (Math.sin(array[1]) > 0 && Math.cos(array[1]) < 0) {
                    array2q = 2
                } else if (Math.sin(array[1]) < 0 && Math.cos(array[1]) < 0) {
                    array2q = 3
                } else if (Math.sin(array[1]) < 0 && Math.cos(array[1]) > 0) {
                    array2q = 4
                }

                if (array1q == 1) {//lowest angle of the not allowed zone in the first quadrant

                    if (Math.sin(angle) < Math.sin(array[0])) {//if the angle is lower than the not allowed zone (probably not in between)
                        if (array2q == 1) {// if the second part of the not allowed zone is in the first quadrant
                            if (Math.sin(angle) < Math.sin(array[2])) {//if it wraps completely around and makes it in between
                                return true
                            } else {//doesn't wrap around enough
                                return false
                            }
                        } else {//not in the first quadrant, not in between
                            return false
                        }
                    } else {//if the angle is further than the not allowed zone
                        if (array2q == 1) {//if the second part of the not allowed zone is in the first quadrant
                            if (Math.sin(angle) < Math.sin(array[2])) {//if the angle is lower than the top limit (in between)

                                return true
                            } else {//is not in between
                                return false
                            }

                        } else {//its gonna be somewhere further so its in between
                            return true;
                        }
                    }
                } else {
                    if (array2q == 1) {//if the further part of the not allowed zone is in the first quadrant
                        if (Math.sin(angle) < Math.sin(array[1])) {//if it wraps all the way around
                            return true
                        } else {
                            return false
                        }
                    } else {
                        if (array1q == 2) {//if lowest angle is in the second
                            if (array2q == 2) {
                                if (Math.sin(array[0]) < Math.sin(array[1])) {
                                    return true
                                } else {
                                    return false
                                }
                            } else {
                                return false
                            }
                        } else if (array1q == 3) {//if the first one is in the third
                            if (array1q > array2q) {
                                return true
                            } else if (array1q < array2q) {
                                return false
                            } else {
                                if (Math.sin(array[0]) < Math.sin(array[1])) {
                                    return true
                                } else {
                                    return false
                                }
                            }
                        } else if (array1q == 4) {//if the first one is in the third
                            if (array1q > array2q) {
                                return true
                            } else if (array1q < array2q) {
                                return false
                            } else {
                                if (Math.sin(array[0]) > Math.sin(array[1])) {
                                    return true
                                } else {
                                    return false
                                }
                            }
                        }
                    }

                }

            }
            // HEALING:
            function soldierMult() {
                return player.latestSkin == 6 ? 0.75 : 1;
            }
            function getAttacker(damaged) {
                let attackers = enemy.filter(tmp => {
                    let damages = new Damages(items);
                    let dmg = damages.weapons[tmp.weaponIndex];
                    let by = tmp.weaponIndex < 9 ? [dmg[0], dmg[1], dmg[2], dmg[3]] : [dmg[0], dmg[1]];
                    let rule = {
                        one: tmp.dist2 <= 300,
                        two: by.includes(damaged),
                        three: tmp.attacked
                    }
                    return rule.one && rule.two && rule.three;
                });
                return attackers;
            }
            function healer() {
                for (let i = 0; i < healthBased(); i++) {
                    place(0, getAttackDir(), 0, false);
                }
            }
            // ADVANCED:
            function applCxC(value) {
                if (player.health == 100)
                    return 0;
                if (player.skinIndex != 45 && player.skinIndex != 56) {
                    return Math.ceil(value / items.list[player.items[0]].healing);
                }
                return 0;
            }
            function healthBased() {
                if (player.health == 100)
                    return 0;
                if (player.skinIndex != 45 && player.skinIndex != 56) {
                    return Math.ceil((100 - player.health) / items.list[player.items[0]].healing);
                }
                return 0;
            }
            function calcDmg(value) {
                return value * player.skinIndex == 6 ? 0.75 : 1;
            }
            // LATER:
            function predictHeal() { }
            function antiSyncHealing(timearg) {
                my.antiSync = true;
                let healAnti = setInterval(() => {
                    if (player.shameCount < 5) {
                        place(0, getAttackDir(), 0, false);
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
                if (player.y2 >= o.mapScale / 2 - o.riverWidth / 2 && player.y2 <= o.mapScale / 2 + o.riverWidth / 2) {
                    if (returns) return 31;
                    buyEquip(31, 0);
                } else {
                    if (player.y2 <= o.snowBiomeTop) {
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
            let nearTrap = gameObjects.filter(e => e.trap && e.active && e.isTeamObject(player) && UTILS.getDist(e, near, 0, 2) <= (near.scale + e.getScale() + 5)).sort(function (a, b) {
                return UTILS.getDist(a, near, 0, 2) - UTILS.getDist(b, near, 0, 2);
            })[0];
            if (nearTrap) {
                near.inTrap = true;
            } else {
                near.inTrap = false;
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
                            let _ects = [];
                            gameObjects.forEach((p) => {
                                _ects.push({
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
                                let cantPlace = _ects.find((tmp) => tmp.active && UTILS.getDistance(tmpX, tmpY, tmp.x, tmp.y) < item.scale + (tmp.blocker ? tmp.blocker : tmp.getScale(0.6, tmp.isItem)));
                                if (cantPlace) continue;
                                if (item.id != 18 && tmpY >= o.mapScale / 2 - o.riverWidth / 2 && tmpY <= o.mapScale / 2 + o.riverWidth / 2) continue;
                                if ((!replacer && yaboi) || useWasd) {
                                    if (useWasd ? false : yaboi.inTrap) {
                                        if (UTILS.getAngleDist(near.aim2 + Math.PI, relAim + Math.PI) <= Math.PI) {
                                            place(2, relAim, 1);
                                        } else {
                                            player.items[4] == 15 && place(4, relAim, 1);
                                        }
                                    } else {
                                        if (UTILS.getAngleDist(near.aim2, relAim) <= o.gatherAngle / 1.5) {
                                            place(2, relAim, 1);
                                        } else {
                                            player.items[4] == 15 && place(4, relAim, 1);
                                        }
                                    }
                                } else {
                                    place(id, relAim, 1);
                                }
                                _ects.push({
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
                                if (near.dist2 <= items.weapons[player.weapons[0]].range + (player.scale * 1.8) && os.spikeTick) {
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
                                    if (tmpY >= o.mapScale / 2 - o.riverWidth / 2 && tmpY <= o.mapScale / 2 + o.riverWidth / 2) continue;
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
                    this.protect = function (aim) {
                        if (!os.antiTrap) return;
                        if (player.items[4]) {
                            this.testCanPlace(2, -(Math.PI / 2), (Math.PI / 2), (Math.PI / 18), aim + Math.PI);
                            this.antiTrapped = true;
                            spin();
                        }
                    };


                    this.ReTrap = function() {
                        let range = items.weapons[player.weaponIndex].range + 70;
                        gameObjects.forEach(_ => {
                            if(enemy.length) {
                                let objDst = UTILS.getDist(_, player, 0, 2);
                                let perfectAngle = UTILS.getDirect(_, player, 0, 2);
                                game.tickBase(() => {
                                    if (near.dist2 <= range && _.health <= 272.58 && PrePlaceCount < 15 && fgdo(_, player) <= range || ((near.length && near.reloads[near.weaponIndex] <= o.tickRate * (window.pingTime >= 200 ? 2 : 1)) || player.reloads[player.weaponIndex]*1000 <= o.tickRate * (window.pingTime >= 200 ? 2 : 1))) {
                                        place(2, perfectAngle);
                                        PrePlaceCount++;
                                    } else if (near.dist2 > range && _.health <= 272.58 && PrePlaceCount >= 0 && fgdo(_, player) <= range || ((near.length && near.reloads[near.weaponIndex] <= o.tickRate * (window.pingTime >= 200 ? 2 : 1)) || player.reloads[player.weaponIndex]*1000 <= o.tickRate * (window.pingTime >= 200 ? 2 : 1))) {
                                        PrePlaceCount--;
                                    }
                                }, 1);
                            }
                        });
                    }
                    this.runPrePlacer = function() {
                        if (enemies.length) {
                            let prePlaceObj = gameObjects.find(U => (getDist(player, U) <= 250) && (100*U.buildHealth/U.health) <= Math.max(getPossibleObjDmg(player), getPossibleObjDmg(enemy)) + 10);
                            if (enemies.length && prePlaceObj && !player.inTrap && ((getDist(player, prePlaceObj) <= items.weapons[player.weapons[0]].range) && (getDist(enemy, prePlaceObj) <= items.weapons[player.weapons[0]].range))) {
                                let position = player.buildItemPosition(items.list[player.items[2]], getDir(player, prePlaceObj));
                                let _Predict = {
                                    x: position.x,
                                    y: position.y,
                                    scale: items.list[player.items[2]].scale,
                                };
                                if (enemies.length) {
                                    placeVisible.add(position, 1, prePlaceObj, _Predict.scale, true);
                                }
                                setTickout(() => {
                                    spikeTickPlace(2, getDir(player, prePlaceObj));
                                    placeableSpikes.filter((i)=>UTILS.getAngleDist(i, getDir(player, prePlaceObj)) <= Math.PI/2).forEach(function(i){
                                        spikeTickPlace(2, i);
                                    })
                                }, 1);
                            }
                        }
                    }
                    function getPossibleObjDmg(user) {
                        return (items.weapons[player.weapons[player.weapons[1] ? Number(player.weapons[1] == 10) : 0]].dmg / 4) * (player.skins[40] ? 3.3 : 1) * (items.weapons[player.weapons[Number(player.weapons[1] == 10)]].sDmg || 1);
                    }
                    function spikeTickPlace(id, radian) {
                        var item = items.list[player.items[id]];
                        if (checkPlace(id, radian) && item.dmg) {
                            if (enemies.length && enemies.find(e => e.skinIndex != 6 && getDist(player.buildItemPosition(items.list[player.items[2]], radian), e) <= 35 + items.list[player.items[2]].scale)) {
                                placerSpikeTick = true;
                            }
                        }
                    }
                    let placedSpikePositions = new Set();
                    let placedTrapPositions = new Set();
                    this.autoPlace = function () {

                        if (os.autoPlace) {
                            try {
                                // Configs:
                                const trap1 = gameObjects.filter((e) => e.trap && e.active).sort((a, b) => UTILS.getDist(a, near, 0, 2) - UTILS.getDist(b, near, 0, 2)).find((trap) => {
                                    const trapDist = Math.hypot(trap.y - near.y2, trap.x - near.x2);
                                    return (
                                        trap !== player &&
                                        (player.sid === trap.owner.sid || findAllianceBySid(trap.owner.sid)) &&
                                        trapDist <= 50
                                    );
                                });


                                if (enemy.length && !instaC.ticking) {
                                    if (gameObjects.length) {
                                        if (near.dist2 <= 400) {
                                            if (near.dist2 <= 200) {
                                                this.testCanPlace(2, 0, (Math.PI * 2), (Math.PI / 24), near.aim2, 0, {inTrap: near.inTrap});
                                            } else {
                                                if (player.items[4] == 15) {
                                                    this.testCanPlace(4, 0, (Math.PI * 2), (Math.PI / 24), near.aim2);
                                                }
                                            }
                                        }
                                    } else {
                                        if (near.dist2 <= 300) {
                                            if (player.items[4] == 15) {
                                                this.testCanPlace(4, 0, (Math.PI * 2), (Math.PI / 24), near.aim2);
                                            }
                                        }
                                    }
                                }


                                if (trap1 && near.dist2 <= 160) {
                                    const trapX = trap1.x;
                                    const trapY = trap1.y;
                                    const circleRadius = 102;
                                    const numPositions = 64;
                                    for (let i = 0; i < numPositions; i++) {
                                        const angle = (2 * Math.PI * i) / numPositions;
                                        const offsetX = trapX + circleRadius * Math.cos(angle);
                                        const offsetY = trapY + circleRadius * Math.sin(angle);
                                        const position = [offsetX, offsetY];
                                        const distToPlayer = Math.hypot(position[0] - player.x2, position[1] - player.y2);
                                        if (!placedSpikePositions.has(JSON.stringify(position)) && isPositionValid(position) && distToPlayer <= 87) {
                                            const angleToPlace = Math.atan2(position[1] - player.y2, position[0] - player.x2);
                                            checkPlace(2, angleToPlace);
                                            placedSpikePositions.add(JSON.stringify(position));
                                        }
                                    }
                                } else if (!trap1 && near.dist2 <= 206) {
                                    placedSpikePositions.clear();
                                    const maxTrapsToPlace = 3;
                                    const trapRadius = 50;
                                    const trapPositions = calculatePossibleTrapPositions(player.x2, player.y2, trapRadius);
                                    let trapsPlaced = 0;
                                    for (const position of trapPositions) {
                                        if (trapsPlaced < maxTrapsToPlace && !placedTrapPositions.has(JSON.stringify(position)) && isPositionValid(position)) {
                                            checkPlace(4, ...position);
                                            placedTrapPositions.add(JSON.stringify(position));
                                            trapsPlaced++;
                                        }
                                    }
                                }
                            } catch (e) {
                                console.log("Auto Place: Error " + e);
                            }
                        }
                    };

                    this.PerfectPlaceTrap = function() {
                        if (enemy.length && near.dist2 <= 120) {
                            enemy.sort((a, b) => UTILS.getDist(player, a) - UTILS.getDist(player, b));

                            for (const enemyPlayer of enemy) {
                                const enemyDistance = UTILS.getDist(player, enemyPlayer);

                                // Check if enemy is already in a trap
                                const enemyInTrap = gameObjects.some(
                                    (tmp) =>
                                    tmp.trap &&
                                    tmp.active &&
                                    UTILS.getDist(tmp, enemyPlayer, 0, 2) <= tmp.getScale() + 5
                                );

                                if (enemyInTrap) {
                                    // If enemy is in a trap, place a trap on top of them
                                    this.testCanPlace(4, enemyPlayer.x, enemyPlayer.y);
                                } else if (near.dist2 >= 0 && near.dist2 <= 80) {
                                    // If enemy is not in a trap, calculate optimal distance and place a trap
                                    const optimalDistance = Math.min(80, enemyDistance);
                                    const spikeX = player.x + (optimalDistance / enemyDistance) * (enemyPlayer.x - player.x);
                                    const spikeY = player.y + (optimalDistance / enemyDistance) * (enemyPlayer.y - player.y);
                                    this.testCanPlace(4, spikeX, spikeY);
                                }
                            }
                        }
                    }
                    function calculatePerfectAngle(x1, y1, x2, y2) {
                        return Math.atan2(y2 - y1, x2 - x1);
                    }
                    function isObjectBroken(object) {
                        const healthThreshold = 20;
                        return object.health < healthThreshold;
                    }
                    // AutoReplacer:
                    this.replacer = function(findObj) { //
                        if (!findObj) return;
                        if (!inGame) return;
                        if (this.antiTrapped) return;

                        game.tickBase(() => {
                            let objAim = UTILS.getDirect(findObj, player, 0, 2);
                            let objDst = UTILS.getDist(findObj, player, 0, 2);
                            let dist = cdf(player, near);
                            let dir = caf(player, near);
                            let dir2 = caf(player, dir + 180);
                            let ignore = [0, 0];
                            let danger = this.checkSpikeTick();
                            let bSpikeTicked = function() {
                                if (objDst <= 200 && near.dist2 <= 185 && player.reloads[player.weapons[0]] === 0 ) {
                                    ch3("bSpikeTicked", 500, "red");
                                    buyEquip(7, 0);
                                    buyEquip(18, 1);
                                    selectWeapon(player.weapons[0]);
                                    packet("d", 0, near.aim2, 1);
                                    checkPlace(2, near.aim2);
                                    setTickout(()=>{
                                        buyEquip(11, 0);
                                        buyEquip(21, 1);
                                        setTickout(()=>{
                                            packet("d", 0, near.aim2, 1);
                                            buyEquip(6, 0);
                                        }, 15);
                                    }, 5);
                                }
                            };
                            bSpikeTicked();


                            let perfectAngle = calculatePerfectAngle(findObj.x, findObj.y, player.x, player.y);

                            if (getEl("weaponGrind").checked && objDst <= items.weapons[player.weaponIndex].range + player.scale) return;


                            if (objDst <= 400 && near.dist2 <= 400 && isObjectBroken(findObj)) {
                                for(let i = 0; i != 2; i++) {
                                    if (near.dist2 < 200) {
                                        //console.log(dir);
                                        for(let i = 0; i < Math.PI; i += toR(items.list[player.items[2]].scale)) {
                                            let placed;
                                            if (ignore[0]) {
                                                placed = false;
                                                ignore[0]--;
                                            } else {
                                                checkPlace(2, (dir || dir2) + i) && (toD(i) < items.list[player.items[2]].scale && (ignore[1] = Math.ceil(items.list[player.items[2]].scale / toD(Math.PI / 12))), placed = true);
                                            }
                                            placed && (ignore[0] = Math.ceil(items.list[player.items[2]].scale / toD(Math.PI / 12)));
                                            if (!placed || UTILS.getAngleDist(dir + i, dir - i) > toR(items.list[player.items[2]].scale)) {
                                                if (ignore[1]) {
                                                    ignore[1]--;
                                                } else {
                                                    checkPlace(2, dir - i) && (ignore[1] = Math.ceil(items.list[player.items[2]].scale / toD(Math.PI / 12)))
                                                }
                                            }
                                        }
                                        checkPlace(4, toR(toD(dir) - 180));
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
                            /*
                            if (objDst <= 400 && near.dist2 <= 400) {
                                if (isObjectBroken(findObj)) {
                                    let danger = this.checkSpikeTick();
                                    if (!danger && near.dist2 <= items.weapons[near.primaryIndex || 5].range + (near.scale * 1.8)) {
                                        this.testCanPlace(2, 0, Math.PI * 2, Math.PI / 24, perfectAngle, 1);
                                    } else if (player.items[4] == 15) {
                                        this.testCanPlace(2, 0, Math.PI * 2, Math.PI / 24, perfectAngle, 1);
                                    }
                                    this.replaced = true;
                                }
                            }
                            */
                        }, 1);
                    }
                }
            }


            let autoOneTick = {
                toggle: false,
                toDo: [],
                run: function(other) {
                    if (autoOneTick.toDo.length) return;
                    if (!other || !other.visible || other == player) return;
                    let OTType = (player.weapons[0] == 5 || player.weapons[0] == 3) ? (player.items[4] == 16 && [12, 13, 15].includes(player.weapons[1]) ? "boost pad" : "polearm") : null;
                    if(autoOneTick.toggle) {
                        if(OTType == "polearm" ? (near.skinIndex != 22 && near.skinIndex != 6) : true) {
                            instaC.doOneTicked(other, OTType);
                        }
                    }
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
                        let backupNobull = near.backupNobull;
                        let StakedIns = getEl("StackInstaDmg").checked ? 250 : 1;
                        let StakedIns2 = getEl("StackInstaDmg").checked ? 125 : 1;
                        let ApplInsta = function () {
                            if (getEl("appl").checked && player.skins[21]) {
                                setTimeout(() => {
                                    Hg(21, 21);
                                }, 2);
                            }
                        }
                        near.backupNobull = false;
                        game.tickBase(() => {
                            game.tickBase(() => {
                                if (near.skinIndex == 22 && getEl("backupNobull").checked) {
                                    near.backupNobull = true;
                                }
                            }, 1);
                        }, 1);

                        // smartInstaKill:
                        if (type == "rev") {
                            selectWeapon(player.weapons[1]);
                            sendAutoGather();
                            Hg(53, 21);
                            setTimeout(() => {
                                selectWeapon(player.weapons[0]);
                                Hg(7, 19);
                                ApplInsta();
                                setTimeout(() => {
                                    sendAutoGather();
                                    this.isTrue = false;
                                    my.autoAim = false;
                                }, StakedIns);
                            }, StakedIns2);
                        } else if (type == "nobull") {
                            selectWeapon(player.weapons[0]);
                            if (getEl("backupNobull").checked && backupNobull) {
                                buyEquip(7, 0);
                            } else {
                                buyEquip(6, 0);
                            }
                            buyEquip(21, 1);
                            ApplInsta();
                            sendAutoGather();
                            setTimeout(() => {
                                if (near.skinIndex == 22) {
                                    if (getEl("backupNobull").checked) {
                                        near.backupNobull = true;
                                    }
                                    buyEquip(6, 0);
                                } else {
                                    buyEquip(53, 0);
                                }
                                selectWeapon(player.weapons[1]);
                                buyEquip(21, 1);
                                setTimeout(() => {
                                    sendAutoGather();
                                    this.isTrue = false;
                                    my.autoAim = false;
                                }, StakedIns);
                            }, StakedIns2);
                        } else if (type == "normal") {
                            selectWeapon(player.weapons[0]);
                            Hg(7, 18);
                            ApplInsta();
                            sendAutoGather();
                            setTimeout(() => {
                                selectWeapon(player.weapons[1]);
                                Hg(player.reloads[53] == 0 ? 53 : 6, 21);
                                setTimeout(() => {
                                    sendAutoGather();
                                    this.isTrue = false;
                                    my.autoAim = false;
                                }, StakedIns);
                            }, StakedIns2);
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
                            selectWeapon(player.weapons[0]);
                            buyEquip(53, 0);
                            //buyEquip(21, 1);
                            game.tickBase(() => {
                                sendAutoGather();
                                this.isTrue = false;
                                my.autoAim = false;
                                buyEquip(6, 0);
                            }, 3);
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
                    this.syncTry = function(syncType = "sec", time = 5) {
                        setTimeout(() => {
                            if (syncType == "sec") {
                                if (player.weapons[1] == 15) {
                                    packet("D", near.aim2);
                                    this.isTrue = true;
                                    my.autoAim = true;
                                    selectWeapon(player.weapons[1]);
                                    //rangeBackup.push(near.dist2);
                                    if (player.reloads[53] == 0 && near.dist2 <= 700 && near.skinIndex != 22) {
                                        Hg(53, 21);
                                    } else {
                                        Hg(20, 21);
                                    }
                                    sendAutoGather();
                                    game.tickBase(() => {
                                        this.isTrue = false;
                                        my.autoAim = false;
                                        sendAutoGather();
                                    }, 2);
                                }
                            } else if (syncType == "insta") {
                                if (near.dist <= 500 && player.reloads[player.weapons[1]] == 0 && player.reloads[player.weapons[0]] == 0 && player.reloads[53] == 0) {
                                    this.isTrue = true;
                                    my.autoAim = true;
                                    selectWeapon(player.weapons[0]);
                                    Hg(7, 18);
                                    sendAutoGather();
                                    setTickout(()=>{
                                        selectWeapon(player.weapons[1]);
                                        Hg(53, 21);
                                        setTickout(()=>{
                                            sendAutoGather();
                                            this.isTrue = false;
                                            my.autoAim = false;
                                            setTimeout(()=>{
                                                Hg(6, 21);
                                                this.isTrue = false;
                                                my.autoAim = false;
                                            }, 150);
                                        }, 100);
                                    }, 50);
                                }
                            }
                        }, time);
                    };
                    this.rangeType = function (type) {
                        this.isTrue = true;
                        my.autoAim = true;
                        if (type == 'ageInsta') {
                            my.ageInsta = false;
                            if (player.items[5] == 18) {
                                place(5, near.aim2);
                            }
                            packet('a', undefined, 1);
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


                    function move(setDirNiger) {
                        packet("a", setDirNiger, 1);
                    }

                    this.doOneTicked = function(other, OTType) {
                        move(other.aim2);
                        if(OTType == "polearm") {
                            autoOneTick.toDo = [function(){
                                this.isTrue = false;
                                autoOneTick.toggle = false;
                                my.autoAim = false;
                                move(null);
                                sendAutoGather();
                            }, function() {
                                move(other.aim2);
                                Hg(7, 19)
                                packet("D", other.aim2);
                                sendAutoGather();
                            }, function() {
                                this.isTrue = true;
                                my.autoAim = true;
                                move(other.aim2);
                                buyEquip(53, 0);
                                buyEquip(0, 1);
                                selectWeapon(player.weapons[0]);
                            }];
                        } else if(OTType == "boost pad") {
                            autoOneTick.toDo = [function() {
                                this.isTrue = false;
                                autoOneTick.toggle = false;
                                my.autoAim = false;
                                move(null);
                                sendAutoGather();
                            }, function() {
                                selectWeapon(player.weapons[0]);
                                move(other.aim2);
                                buyEquip(7, 0);
                                buyEquip(player.skins[18] ? 18 : 0, 1);
                                packet("D", other.aim2);
                            }, function() {
                                this.isTrue = true;
                                my.autoAim = true;
                                move(other.aim2);
                                packet("D", other.aim2);
                                buyEquip(53, 0);
                                place(4, other.aim2);
                                selectWeapon(player.weapons[1]);
                                sendAutoGather();
                            }];
                        }
                    }
                    this.autoOneFrame = function() {
                        ch3("autoOneTick");
                        this.isTrue = true;
                        my.autoAim = true;
                        packet("a", near.aim2, 1);
                        buyEquip(53, 0);
                        buyEquip(21, 1);
                        selectWeapon(player.weapons[0]);
                        setTimeout(() => {
                            buyEquip(7, 0)
                            buyEquip(21, 1);
                            sendAutoGather();
                            setTimeout(() => {
                                sendAutoGather();
                                my.autoAim = false;
                                packet("a", lastMoveDir, 1);
                                this.isTrue = false;
                            }, 1);
                        }, 1);
                    }

                    this.Snowtick = function () {
                        this.isTrue = true;
                        my.autoAim = true;
                        selectWeapon(player.weapons[[10, 14].includes(player.weapons[1]) ? 1 : 0]);
                        biomeGear();
                        buyEquip(19, 1);
                        packet('a', near.aim2, 1);
                        game.tickBase(() => {
                            selectWeapon(player.weapons[[10, 14].includes(player.weapons[1]) ? 1 : 0]);
                            buyEquip(53, 0);
                            packet('a', near.aim2, 1);
                            game.tickBase(() => {
                                selectWeapon(player.weapons[0]);
                                buyEquip(7, 0);
                                sendAutoGather();
                                packet('a', near.aim2, 1);
                                game.tickBase(() => {
                                    sendAutoGather();
                                    this.isTrue = false;
                                    my.autoAim = false;
                                    packet('a', undefined, 1);
                                }, 1);
                            }, 1);
                        }, 1);
                    };

                    this.oneTickType = function () {
                        this.isTrue = true;
                        my.autoAim = true;
                        selectWeapon(player.weapons[1]);
                        buyEquip(53, 0);
                        packet('a', near.aim2, 1);
                        if (player.weapons[1] == 15) {
                            my.revAim = true;
                            sendAutoGather();
                        }
                        game.tickBase(() => {
                            const trap1 = gameObjects
                            .filter(e => e.trap && e.active)
                            .sort((a, b) => UTILS.getDist(a, near, 0, 2) - UTILS.getDist(b, near, 0, 2))
                            .find(trap => {
                                const trapDist = Math.hypot(trap.y - near.y2, trap.x - near.x2);
                                return trap !== player && (player.sid === trap.owner.sid || findAllianceBySid(trap.owner.sid)) && trapDist <= 30;
                            });
                            //if ([6, 22].includes(near.skinIndex) && trap1) io.send('6', 'p_OT [2/3]');
                            my.revAim = false;
                            selectWeapon(player.weapons[0]);
                            buyEquip(7, 0);
                            packet('a', near.aim2, 1);
                            if (player.weapons[1] != 15) {
                                sendAutoGather();
                            }
                            game.tickBase(() => {
                                sendAutoGather();
                                this.isTrue = false;
                                my.autoAim = false;
                                packet('a', undefined, 1);
                            }, 1);
                        }, 1);
                    };
                    this.threeOneTickType = function () {
                        this.isTrue = true;
                        my.autoAim = true;
                        selectWeapon(player.weapons[[10, 14].includes(player.weapons[1]) ? 1 : 0]);
                        biomeGear();
                        buyEquip(11, 1);
                        packet('a', near.aim2, 1);
                        game.tickBase(() => {
                            selectWeapon(player.weapons[[10, 14].includes(player.weapons[1]) ? 1 : 0]);
                            buyEquip(53, 0);
                            buyEquip(11, 1);
                            packet('a', near.aim2, 1);
                            game.tickBase(() => {
                                const trap1 = gameObjects.filter(e => e.trap && e.active).sort((a, b) => UTILS.getDist(a, near, 0, 2) - UTILS.getDist(b, near, 0, 2)).find(trap => {
                                    const trapDist = Math.hypot(trap.y - near.y2, trap.x - near.x2);
                                    return trap !== player && (player.sid === trap.owner.sid || findAllianceBySid(trap.owner.sid)) && trapDist <= 30;
                                });
                                //if ([6, 22].includes(near.skinIndex) && trap1) io.send('6', 'p_OT [2/3]');
                                selectWeapon(player.weapons[0]);
                                buyEquip(7, 0);
                                buyEquip(19, 1);
                                sendAutoGather();
                                packet('a', near.aim2, 1);
                                game.tickBase(() => {
                                    sendAutoGather();
                                    this.isTrue = false;
                                    my.autoAim = false;
                                    packet('a', undefined, 1);
                                }, 1);
                            }, 1);
                        }, 1);
                    };
                    this.kmTickType = function () {
                        this.isTrue = true;
                        my.autoAim = true;
                        my.revAim = true;
                        selectWeapon(player.weapons[1]);
                        buyEquip(53, 0);
                        buyEquip(11, 1);
                        sendAutoGather();
                        packet('a', near.aim2, 1);
                        game.tickBase(() => {
                            my.revAim = false;
                            selectWeapon(player.weapons[0]);
                            buyEquip(7, 0);
                            buyEquip(19, 1);
                            packet('a', near.aim2, 1);
                            game.tickBase(() => {
                                sendAutoGather();
                                this.isTrue = false;
                                my.autoAim = false;
                                packet('a', undefined, 1);
                            }, 1);
                        }, 1);
                    };
                    this.boostTickType = function() {
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
                                buyEquip(21, 1);
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
                        let slowDists = (weeeee) => weeeee * o.playerScale;
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
                            if (player.y2 >= o.mapScale / 2 - o.riverWidth / 2 && player.y2 <= o.mapScale / 2 + o.riverWidth / 2 && awwww == 0) {
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
                                                if (os.slowOT) {
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
                                        bQ(19, 1);
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
                                                if (os.slowOT) {
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
                                        bQ(19, 1);
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
                        }};

                    /** wait 1 tick for better quality */
                    (this.bowMovement = function () {
                        let moveMent = this.gotoGoal(685, 3);
                        if (moveMent.action) {
                            if (player.reloads[53] == 0 && !this.isTrue) {
                                this.rangeType('ageInsta');
                            } else {
                                packet('a', moveMent.dir, 1);
                            }
                        } else {
                            packet('a', moveMent.dir, 1);
                        }
                    }),
                        (this.tickMovement = function () {
                        const trap1 = gameObjects
                        .filter(e => e.trap && e.active)
                        .sort((a, b) => UTILS.getDist(a, near, 0, 2) - UTILS.getDist(b, near, 0, 2))
                        .find(trap => {
                            const trapDist = Math.hypot(trap.y - near.y2, trap.x - near.x2);
                            return trap !== player && (player.sid === trap.owner.sid || findAllianceBySid(trap.owner.sid)) && trapDist <= 50;
                        });
                        let moveMent = this.gotoGoal(
                            [10, 14].includes(player.weapons[1]) && player.y2 > o.snowBiomeTop ? 240 : player.weapons[1] == 15 ? 250 : player.y2 <= o.snowBiomeTop ? [10, 14].includes(player.weapons[1]) ? 265 : 255 : 270, 3
                        );
                        if (moveMent.action) {
                            if ((![6, 22].includes(near.skinIndex) || ([6, 22].includes(near.skinIndex) && trap1)) && player.reloads[53] == 0 && !this.isTrue) {
                                ([10, 14].includes(player.weapons[1]) && player.y2 > o.snowBiomeTop) || player.weapons[1] == 15 ? this.threeOneTickType() : this.Snowtick();
                            } else {
                                packet('a', moveMent.dir, 1);
                            }
                        } else {
                            packet('a', moveMent.dir, 1);
                        }
                    }),
                        (this.kmTickMovement = function () {
                        let moveMent = this.gotoGoal(240, 3);
                        if (moveMent.action) {
                            if (near.skinIndex != 22 && player.reloads[53] == 0 && !this.isTrue && (game.tick - near.poisonTick) % o.serverUpdateRate == 8) {
                                this.kmTickType();
                            } else {
                                packet('a', moveMent.dir, 1);
                            }
                        } else {
                            packet('a', moveMent.dir, 1);
                        }
                    }),
                        (this.boostTickMovement = function () {
                        let dist = player.weapons[1] == 9 ? 365 : player.weapons[1] == 12 ? 380 : player.weapons[1] == 13 ? 390 : player.weapons[1] == 15 ? 365 : 370;
                        let actionDist = player.weapons[1] == 9 ? 2 : player.weapons[1] == 12 ? 1.5 : player.weapons[1] == 13 ? 1.5 : player.weapons[1] == 15 ? 2 : 3;
                        let moveMent = this.gotoGoal(dist, actionDist);
                        if (moveMent.action) {
                            if (player.reloads[53] == 0 && !this.isTrue) {
                                this.boostTickType();
                            } else {
                                packet('a', moveMent.dir, 1);
                            }
                        } else {
                            packet('a', moveMent.dir, 1);
                        }
                    });
                    /** wait 1 tick for better quality */
                    this.perfCheck = function(pl, nr) {
                        if (nr.weaponIndex == 11 && UTILS.getAngleDist(nr.aim2 + Math.PI, nr.d2) <= o.shieldAngle) return false;
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
            let objectManager = new Objectmanager(GameObject, gameObjects, UTILS, o);
            let store = new Store();
            let hats = store.hats;
            let accessories = store.accessories;
            let projectileManager = new ProjectileManager(Projectile, projectiles, players, ais, objectManager, items, o, UTILS);
            let aiManager = new AiManager(ais, AI, players, items, null, o, UTILS);
            let textManager = new Textmanager();
            let traps = new Traps(UTILS, items);
            let instaC = new Instakill();
            let autoBuy = new Autobuy([15, 31, 6, 7, 22, 12, 53, 20, 40, 11, 21, 26], [11, 13, 19, 18, 21]);
            let autoUpgrade = new Autoupgrade();
            let lastDeath;
            let minimapData;
            let mapMarker = {};
            let mapPings = [];
            let antiShamehat = false;
            let tmpPing;
            let breakTrackers = [];
            let grid = [];
            function sendChat(message) {
                packet("6", message.slice(0, 30));
            }
            let runAtNextTick = [];
            function checkProjectileHolder(x, y, dir, range, speed, indx, layer, sid) {
                let weaponIndx = indx == 0 ? 9 : indx == 2 ? 12 : indx == 3 ? 13 : indx == 5 && 15;
                let projOffset = o.playerScale * 2;
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
            function antiProj(_, dir, range, speed, index, weaponIndex) {
                if (!_.isTeam(player)) {
                    tmpDir = UTILS.getDirect(player, _, 2, 2);
                    if (UTILS.getAngleDist(tmpDir, dir) <= 0.2) {
                        _.bowThreat[weaponIndex]++;
                        if (index == 5) {
                            projectileCount++;
                        }
                        setTimeout(() => {
                            _.bowThreat[weaponIndex]--;
                            if (index == 5) {
                                projectileCount--;
                            }
                        }, range / speed);
                        if (_.bowThreat[9] >= 1 && (_.bowThreat[12] >= 1 || _.bowThreat[15] >= 1)) {
                            place(1, _.aim2);
                            my.anti0Tick = 4;
                            if (!my.antiSync) {
                                antiSyncHealing(4);
                            }
                        } else {
                            if (projectileCount >= 2) {
                                place(1, _.aim2);
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
                                text: (player.itemCounts[item.group.id] || 0) + "/" + (o.isSandbox ? 99 : item.group.limit),
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
                be.setTransform(
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
            let spinDir = 0;
            function getAttackDir(debug) {
                if (debug) {
                    let spike = gameObjects.filter(obj => (obj.name == "spikes" || obj.name == "greater spikes" || obj.name == "spinning spikes" || obj.name == "poison spikes") && fgdo(player, obj) < player.scale + obj.scale + 22 && !obj.isTeamObject(_) && obj.active)[0]
                    if (!player)
                        return "0";
                    if (my.autoAim || ((clicks.left || (useWasd && near.dist2 <= items.weapons[player.weapons[0]].range + near.scale * 1.8 && !traps.inTrap)) && player.reloads[player.weapons[0]] == 0))
                        lastDir = getEl("weaponGrind").checked ? "getSafeDir()" : enemy.length ? my.revAim ? "(near.aim2 + Math.PI)" : "near.aim2" : "getSafeDir()";
                    else
                        if (clicks.right && player.reloads[player.weapons[1] == 10 ? player.weapons[1] : player.weapons[0]] == 0)
                            lastDir = "getSafeDir()";
                    else
                        if (spike && player.reloads[traps.notFast() ? player.weapons[1] : player.weapons[0]] == 0)
                            lastDir = "S.aim";
                    else
                        if (traps.inTrap && player.reloads[traps.notFast() ? player.weapons[1] : player.weapons[0]] == 0)
                            lastDir = "traps.aim";
                    else
                        if (spinner == true) {
                            spinDir += "(Math.PI * 2) / (9 / 4)";
                            return spinDir;
                        } else {
                            if (!player.lockDir) {
                                if (os.noDir) return "undefined";
                                lastDir = "getSafeDir()";
                            }
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
                        if (spike && player.reloads[traps.notFast() ? player.weapons[1] : player.weapons[0]] == 0)
                            lastDir = my.Saim;
                    else
                        if (traps.inTrap && player.reloads[traps.notFast() ? player.weapons[1] : player.weapons[0]] == 0)
                            lastDir = traps.aim;
                    else
                        if (spinner == true) {
                            spinDir += (Math.PI * 2) / (9 / 4);
                            return spinDir;
                        } else {
                            if (!player.lockDir) {
                                if (os.noDir) return undefined;
                                lastDir = getSafeDir();
                            }
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
                            $("#modMenus").toggle();
                            $("#menuChatDiv").toggle();
                        } else if (keyNum == 69) {
                            sendAutoGather();
                        } else if (keyNum == 67) {
                            updateMapMarker();
                        } else if (player.weapons[keyNum - 49] != undefined) {
                            player.weaponCode = player.weapons[keyNum - 49];
                        } else if (moveKeys[keyNum]) {
                            sendMoveDir();
                        } else if (event.key == "g") {
                            autoOneTick.toggle = !autoOneTick.toggle;
                        } else if (event.key == "m") {
                            mills.placeSpawnPads = !mills.placeSpawnPads;
                        } else if (event.key == "z") {
                            mills.place = !mills.place;
                        } else if (event.key == "Z") {
                            typeof window.debug == "function" && window.debug();
                        } else if (keyNum == 32) {
                            packet("c", 1, getSafeDir(), 1);
                            packet("c", 0, getSafeDir(), 1);
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
            function toFancyTimeFormat(time) {
                let minutes = ~~((time % 3600) / 60);
                let seconds = ~~time % 60;
                if (seconds <= 9) seconds = `0${seconds}`;
                return `${minutes}:${seconds}`;
            }
            let song = {
                '0:41': 'Moon, a hole of light',
                '0:48': 'Through the big top tent up high',
                '0:50': 'Here before and after me',
                '0:52': 'Shining down on me',
                '0:58': 'Moon, tell me if I could',
                '1:02': 'Send up my heart to you',
                '1:05': 'So, when I die, which I must do',
                '1:14': 'Could it shine down here with you?',
                '1:17': 'Cause my love is mine, all mine',
                '1:23': 'I love, my, my, mine',
                '1:24': 'Nothing in the world belongs to me',
                '1:26': 'But my love, mine, all mine, all mine',
                '1:49': 'My baby here on Earth',
                '1:54': 'Showed me what my heart was worth',
                '1:58': 'So, when it comes to be my turn',
                '2:02': 'Could you shine it down here for her?',
                '2:05': 'Cause my love is mine, all mine',
                '2:10': 'I love, my, my, mine',
                '2:15': 'Nothing in the world belongs to me',
                '2:18': 'But my love, mine, all mine',
                '2:22': 'Nothing in the world is mine for free',
                '2:25': 'But my love, mine, all mine, all mine',


            };
            const songchat1 = new Audio("https://cdn.discordapp.com/attachments/1148402801387520003/1175206517650227311/tomp3.cc_-_Mitski_My_Love_Mine_All_Mine_Official_Video.mp3?ex=656a635c&is=6557ee5c&hm=18ddbb9e23e5ac29d3e979f02106bda29eaafe19033c619d0536710dbbded5b6&");
            let isPlaying = false;
            let currentPart = '';
            function toggleSong() {
                if (!isPlaying) {
                    songchat1.play();
                    songchat1.ontimeupdate = function(time) {
                        let part = song[toFancyTimeFormat(Math.round(this.currentTime | 0))];
                        if (part && part !== currentPart) {
                            currentPart = part;
                            io.send("6", part);
                        }
                    };
                    songchat1.onended = function() {
                        if (isPlaying) {
                            songchat1.play();
                        }
                    };
                    isPlaying = true;
                } else {
                    songchat1.pause();
                    isPlaying = false;
                }
            }
            document.addEventListener("keypress", function(e) {
                if (e.key === "C") {
                    toggleSong();
                }
            });

            // ITEM COUNT DISPLAY:
            let isItemSetted = [];

            function updateItemCountHTML(index=undefined) {
                for (let i = 0; i < items.list.length; ++i) {
                    let id = items.list[i].group.id;
                    let tmpI = items.weapons.length + i;
                    if (!isItemSetted[tmpI]) {
                        isItemSetted[tmpI] = document.createElement("div");
                        isItemSetted[tmpI].id = "itemCount" + tmpI;
                        document.getElementById("actionBarItem" + tmpI).appendChild(isItemSetted[tmpI]);
                        isItemSetted[tmpI].style = `
                    display: block;
                    position: absolute;
                    padding-left: 5px;
                    font-size: 2em;
                    color: #fff;
                    `;
                        if (i < 3) {
                            isItemSetted[tmpI].innerHTML = Math.floor(player.food / items.list[i].req[1]);
                        } else {
                            isItemSetted[tmpI].innerHTML = player.itemCounts[id] || 0;
                        }
                    } else {
                        if (index == id) {
                            isItemSetted[tmpI].innerHTML = player.itemCounts[index] || 0;
                        }
                        if (index == undefined) {
                            if (i < 3) {
                                isItemSetted[tmpI].innerHTML = Math.floor(player.food / items.list[i].req[1]);
                            }
                        }
                    }

                }
            }
            // ANTIPUSH:
            function antiPush() {
                const desiredDistance = 100;
                let spike = gameObjects.filter(tmp => tmp.dmg && tmp.active && !tmp.isTeamObject(player) && UTILS.getDist(tmp, player, 0, 3) < (tmp.scale + 40 + player.scale)).sort(function(a, b) {
                    return UTILS.getDist(a, player, 0, 5) - UTILS.getDist(b, player, 0, 5);
                })[0];
                if (spike) {
                    let pos = {
                        x: spike.x + (250 * Math.cos(UTILS.getDirect(near, spike, 2, 0))),
                        y: spike.y + (250 * Math.sin(UTILS.getDirect(near, spike, 2, 0))),
                        x2: spike.x + ((UTILS.getDist(near, spike, 2, 0) + player.scale) * Math.cos(UTILS.getDirect(near, spike, 2, 0))),
                        y2: spike.y + ((UTILS.getDist(near, spike, 2, 0) + player.scale) * Math.sin(UTILS.getDirect(near, spike, 2, 0)))
                    };
                    if (spike) {
                        let currentDistance = UTILS.getDist(spike, player, 0, 2);
                        let scale = player.scale / 10;
                        if (UTILS.lineInRect(player.x2 - scale, player.y2 - scale, player.x2 + scale, player.y2 + scale, near.x2, near.y2, pos.x, pos.y)) {
                            packet("a", undefined, 1);
                            packet("a", undefined, 1);
                        } else {
                            packet("a", undefined, 1);
                        }

                        let aim = UTILS.getDirect(spike, player, 0, 2);
                        console.log(aim);

                        if (spike) {
                            if (!clicks.left && !clicks.right && !instaC.isTrue) {
                                if (player.weaponIndex != (traps.notFast() ? player.weapons[1] : player.weapons[0]) || player.buildIndex > -1) {
                                    selectWeapon(traps.notFast() ? player.weapons[1] : player.weapons[0]);
                                }
                            }
                        }
                    }
                }
            }
            // AUTOPUSH:
            function autoPush() {
                autoPush.pushing = false
                let nearTrap = gameObjects.filter(tmp => tmp.trap && tmp.active && tmp.isTeamObject(player) && UTILS.getDist(tmp, near, 0, 2) <= (near.scale + tmp.getScale() + 5)).sort(function(a, b) {
                    return UTILS.getDist(a, near, 0, 2) - UTILS.getDist(b, near, 0, 2);
                })[0];
                if (nearTrap && near && near.dist2 <= 260) {
                    let spike = gameObjects.filter(tmp => tmp.dmg && tmp.active && tmp.isTeamObject(player) && UTILS.getDist(tmp, nearTrap, 0, 0) <= (near.scale + nearTrap.scale + tmp.scale)).sort(function(a, b) {
                        return UTILS.getDist(a, near, 0, 2) - UTILS.getDist(b, near, 0, 2);
                    })[0];
                    if (spike) {
                        autoPush.pushing = true;
                        if(near.dist2 <= 180 && near.health <= 66 && _.reloads[_.primaryIndex] == 0){
                            instaC.spikeTickType();
                        }
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

                        let path;
                        if (finds) {
                            pathFind.show = true;
                            path = doPathFind(null, near.x, near.y);
                            pathFind.paths = path;
                            packet("a", path ? Math.atan2(path[1].y - path[0].y, path[1].x - path[0].x) : lastMoveDir || undefined, 1);
                        } else {
                            autoPush.place = true;
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
                                packet("a", secondArg, 1);
                            } else {
                                packet("a", UTILS.getDirect(pos, player, 2, 2), 1);
                            }
                        }
                    } else {
                        if (my.autoPush) {
                            saved.reset;
                            autoPush.pushing = false;
                            my.autoPush = false;
                            packet("a", lastMoveDir || undefined, 1);
                            autoPush.place = false;
                        }
                    }
                } else {
                    if (my.autoPush) {
                        saved.reset;
                        autoPush.pushing = false;
                        my.autoPush = false;
                        packet("a", lastMoveDir || undefined, 1);
                        autoPush.place = false;
                    }
                }
            }

            // ADD DEAD PLAYER:
            function addDeadPlayer(_) {
                deadPlayers.push(new DeadPlayer(_.x, _.y, _.dir, _.buildIndex, _.weaponIndex, _.weaponVariant, _.skinColor, _.scale, _.name));
            }
            // PING:
            var lastPing = -1;
            var pingCount = 0;
            function pingSocket() {
                lastPing = Date.now();
                io.send('0');
            }




            /** APPLY SOCKET CODES */
            // SET INIT DATA:
            function setInitData(data) {
                alliances = data.teams;
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
                    tmpPlayer = new Player(data[0], data[1], o, UTILS, projectileManager,
                                           objectManager, players, ais, items, hats, accessories);
                    players.push(tmpPlayer);
                    if (data[1] != playerSID) {
                        addMenuChText("System", `Found ${data[2]} {${data[1]}}`, "#fff");
                    }
                } else {
                    if (data[1] != playerSID) {
                        addMenuChText("Game", `Encount ${data[2]} {${data[1]}}`, "yellow");
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
                    //updateItemCountDisplay();
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
                        //ch3(tmpPlayer.name + " left", 400, "blue");
                        players.splice(i, 1);
                        break;
                    }
                }
            }
            // UPDATE HEALTH:
            var judgeAtNextTick = false;
            let hittedTime = Date.now();
            function updateHealth(sid, value) {
                _ = findPlayerBySID(sid);
                if (_) {
                    _.oldHealth = _.health;
                    _.health = value;
                    _.judgeShame();
                    if (_.oldHealth > _.health) {
                        if (_ == near) {
                            let damage = _.oldHealth - _.health;
                            if (_.skinIndex == 7 && (damage == 5 || (_.latestTail == 13 && damage == 2))) {
                                _.bullTick = game.tick;
                            }
                        }
                        _.damaged = _.oldHealth - _.health;
                        let damaged = _.damaged;
                        _ = findPlayerBySID(sid);
                        let bullTicked = false;
                        if (value >= 20) {
                            hittedTime = Date.now();
                            judgeAtNextTick = true;
                        }
                        if (near.antiBull > 0 && player.shameCount < 5) {
                            place(0, getAttackDir(), 0, false);
                        }
                        if (_ == player) {
                            if (_.skinIndex == 7 && (damaged == 5 || (_.latestTail == 13 && damaged == 2))) {
                                if (my.reSync) {
                                    my.reSync = false;
                                    _.setBullTick = true;
                                }
                                bullTicked = true;
                            }
                            if (inGame) {
                                let attackers = getAttacker(damaged);
                                let gearDmgs = [0.25, 0.45].map((val) => val * items.weapons[player.weapons[0]].dmg * soldierMult());
                                let includeSpikeDmgs = !bullTicked && gearDmgs.includes(damaged);
                                let healTimeout = (1000 / 9);
                                let slowHeal = function(timer) {
                                    setTimeout(() => {
                                        healer();
                                    }, timer);
                                }
                                if (near.dist2 <= 150 && damaged >= 35 && _.shamecount < 4) {
                                    healer();
                                    buyEquip(18, 1);
                                    buyEquip(11, 0);
                                }
                                let total = 0;
                                if (damaged >= (includeSpikeDmgs ? 8 : 25) && player.damageThreat >= 100 && (game.tick - player.antiTimer) > 1) {
                                    player.canEmpAnti = true;
                                    player.antiTimer = game.tick;
                                    let shame = Math.floor(Math.random() * (6 - 4) + 3);
                                    if (_.shameCount < shame) {
                                        healer();
                                    } else {
                                        slowHeal(healTimeout);
                                    }
                                } else {
                                    slowHeal(healTimeout);
                                }
                                if (damaged >= 20 && (player.skinIndex == 11)) instaC.canCounter = true;

                                // Pab
                                if (player.skinIndex == 11) {
                                    if (value >= 30) {
                                        instaC.isCounter = true;
                                    }
                                } else {
                                    if (_ == player) {
                                        if (damaged <= 30 && near.skinIndex == 11 && near.weapons[0] != 8 && near.weapons[0] != 7 && near.weapons[1] != 9 && near.skinIndex == 11 && player.reloads[player.weapons[0]] != 0) {
                                            instaC.isAntiCounter = true;
                                        }
                                    }
                                }
                            }
                        } else {
                            if (!_.setPoisonTick && (_.damaged == 5 || (_.latestTail == 13 && _.damaged == 2))) {
                                _.setPoisonTick = true;
                            }
                        }
                    } else {
                        if (_ != player) {
                            if (_.maxShameCount < _.shameCount) {
                                _.maxShameCount = _.shameCount;
                            }
                        }
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
                if (os.autoRespawn) {
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
                    //updateItemCountDisplay(index);
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
            var replacing = false;

            // KILL OBJECT:
            function killObject(sid) {
                let findObj = findObjectBySid(sid);
                objectManager.disableBySid(sid);
                // Replaced:
                if (enemy.length) {
                    if (player.alive) {
                        traps.replacer();
                        traps.PerfectPlaceTrap();
                    }
                }
            }

            // KILL ALL OBJECTS BY A PLAYER:
            function killObjects(sid) {
                if (player) objectManager.removeAllItems(sid);
            }
            function fgdo(a, b) {
                return Math.sqrt(Math.pow((b.y - a.y), 2) + Math.pow((b.x - a.x), 2));
            }
            function precheckPlace(a, b) {
                checkPlace(a, b);
                ch3("PrePlaces Success");
            }

            // Game Tickout:
            let ticks = {
                tick: 0,
                delay: 0,
                time: [],
                manage: [],
            };
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
            // Send Chat:
            function ch(e) {
                io.send("6", e.slice(0, 30));
            }
            function ch2(text, waitCount = 3000) {
                player.chat.message = text;
                player.chat.count = waitCount;
            }
            function ch3(text, time = 500, color = "#fff") {
                textManager.showText(player.x2, player.y2, 30, 0.15, time, text, color, 2);
            }

            // Spin:
            let spinner = false;
            function spin() {
                let random = [2, 3, 4, 5];
                setTickout(() => {
                    spinner = true;

                    setTickout(() => {
                        spinner = false;
                    }, random[Math.floor(Math.random() * (random.length + 1))]);
                }, 1);
            }


            let ShowFps = UTILS.round(fpsTimer.ltime, 10);
            let GraphColor = "rgba(142, 226, 231, 0.5)";
            let GraphFPSColor = "rgba(184, 146, 169, 0.5)";
            var Z;
            let Q = function () {
                !function () {
                    let e = document.createElement("div");
                    e.id = "GraphMenu";
                    document.body.append(e);
                    e.style = `
                    display: block;
                    padding: 10px;
                    background-color: rgba(0, 0, 0, 0.25);
                    border-radius: 4px;
                    position: fixed;
                    right: 20px;
                    top: 58%;
                    width: auto;
                    width: auto;
                    transition: 1s;
                    zIndex: 999999;
                    overflow: auto;
                    backdrop-Filter: blur(2px);
                    box-Shadow: 2px 2px 4px 2px rgba(0,0,0,0.3);
                    `;
                    //document.getElementById("topInfoHolder").insertBefore(e, document.getElementById("killCounter"));
                    var t = document.createElement("canvas");
                    e.appendChild(t);
                    document.body.appendChild(e);
                    var i = t.getContext("2d");
                    var a = {
                        labels: Array.from({
                            length: 4
                        }, (e, t) => ""),
                        datasets: [{
                            label: "Ping",
                            data: Array.from({
                                length: 4
                            }, () => 0),
                            fill: true,
                            borderColor: "#fff",
                            backgroundColor: GraphColor,
                            pointRadius: Array.from({
                                length: 4
                            }, () => 0),
                        }]
                    };
                    var n = new Chart(i, {
                        type: "line",
                        data: a,
                        options: {
                            plugins: {
                                legend: {
                                    display: false,
                                    labels: {}
                                },
                                title: {
                                    display: false
                                }
                            },
                            elements: {
                                line: {
                                    fill: false,
                                    borderColor: GraphColor,
                                    tension: 0.2,
                                    borderWidth: 2.5,
                                }
                            },
                            scales: {
                                x: {
                                    grid: {

                                    }
                                },
                                y: {
                                    grid: {

                                    }
                                }
                            }
                        }
                    });
                    setInterval(function () {
                        if (a.labels.length >= 5) {
                            a.labels.shift();
                            a.datasets[0].data.shift();
                            a.datasets[0].pointRadius.shift();
                        }
                        a.labels.push(window.pingTime);
                        a.datasets[0].data.push(window.pingTime);
                        let t = window.pingTime ? GraphColor : "#000";
                        a.datasets[0].borderColor = t;
                        a.datasets[0].pointRadius.push(window.pingTime > 10 ? 2.3 : 0);
                        n.update();
                    }, 3500);
                }();
            };
            (Z = document.createElement("script")).type = "text/javascript";
            if (Z.readyState) {
                Z.onreadystatechange = function () {
                    if (!("loaded" !== Z.readyState && "complete" !== Z.readyState)) {
                        Z.onreadystatechange = null;
                        Q();
                    }
                };
            } else {
                Z.onload = function () {
                    Q();
                };
            }
            Z.src = "https://cdn.jsdelivr.net/npm/chart.js";
            document.getElementsByTagName("head")[0].appendChild(Z);


            // Synced:
            function canSyncHit() {
                let N = gameObjects;
                let _ = findPlayerByID(near);
                if(player.reloads[player.weapons[0]] != 1) return false;
                if(near.dist2/1.56 > items.weapons[player.weapons[0]].range) return false;
                let x = (_.velX || _.x2), y = (_.velY || _.y2);
                let isEnemyTraped = false;
                for(let i = 0; i < N.length; i++) {
                    if(N[i] && N[i].name == "pit trap" && N[i].active && (N[i].owner.sid == player.sid || isAlly(N[i].owner.sid)) && Math.hypot(N[i].y - _.y2, N[i].x - _.x2) < 70) {
                        isEnemyTraped = true;
                    }
                    if(N[i] && N[i].dmg && N[i].active && isEnemyTraped == false && (N[i].owner.sid == player.sid || isAlly(N[i].owner.sid))) {
                        if(Math.hypot(N[i].y - y, N[i].x - x) <= 35 + N[i].scale) {
                            return true;
                        }
                    }
                }
                if(_.health - (Math.round(items.weapons[player.weapons[0]].dmg * 1.5 * window.variantMulti(items.weapons[player.weapons[0]].variant) * (_.skinIndex == 6 ? .75 : 1))) <= 0) {
                    return true;
                }
                return false;
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
                    ch("ur gay!");
                } else if(near.dist2 < 220 && player.weapons[0] == 4 && player.weapons[1] == 10 || player.weapons[1] == 9){
                    antiOneTick(); //anti 2 frames if they have katana
                    ch("ur got katana in ass niger");
                }
            }

            // PathFinder
            let saved = {
                x: null,
                y: null,
                nea: null,
                reset: function () {
                    this.x = null;
                    this.y = null;
                    this.nea = null;
                    pathFind.paths = [];
                    pathFind.show = false;
                }
            };
            let pathFind = {
                show: false,
                paths: [],
                enabled: false
            };
            function doPathFind(afg1keg1, target) {
                let R = player;
                let N = gameObjects
                let centerX = R.x + (target[0] - R.x) / 2;
                let centerY = R.y + (target[1] - R.y) / 2;
                const nearBuilds = N.filter(e => Math.hypot(e.y - centerY, e.x - centerX) < 800 && e.active);
                let block = 30, node = function (x, y, gScore) {
                    this.x = x;
                    this.y = y;
                    this.g = gScore;
                    this.type = nearBuilds.some(e => {
                        let exactScale = (/spike/.test(e.name) && R.sid != e.owner.sid && (R.team ? !e.isTeamObject(R) : true)) ? (e.scale + 50) : e.scale;
                        if (e.name == "pit trap") {
                            if (e.owner && (R.sid == e.owner.sid || e.isTeamObject(R))) {
                                return false;
                            }
                        }
                        if (Math.hypot(e.y - y, e.x - x) < exactScale + block && Math.hypot(e.y - target[1], e.x - target[0]) > exactScale + block && Math.hypot(e.y - R.y2, e.x - R.x2) > exactScale + block) {
                            return true;
                        }
                        return false;
                    }) ? "wall" : "space";
                }, myNode = new node(Math.round(R.x2 / block) * block, Math.round(R.y2 / block) * block, 0),
                    targetNode = new node(Math.round(target[0] / block) * block, Math.round(target[1] / block) * block, 0),
                    paths = [], foundset = [], currentTick = 0, endTick = 100, found = true;
                function positive(num) {
                    return Math.abs(num);
                };
                while (!foundset.find(e => { return Math.hypot(e.y - targetNode.y, e.x - targetNode.x) < block; })) {
                    currentTick++;
                    if (currentTick >= endTick) {
                        found = false;
                        break;
                    };
                    let bestnode = currentTick === 1 ? myNode : foundset.filter(e => e.type == "space").sort((a, b) => a.good - b.good)[0];
                    for (let i = 0; i < 3; i++) {
                        for (let o = 0; o < 3; o++) {
                            if (i == 1 && o == 1) {
                                continue;
                            }
                            let x = bestnode.x + block * (-1 + i);
                            let y = bestnode.y + block * (-1 + o);
                            let n = new node(x, y, currentTick);
                            let good = (positive(n.x - targetNode.x) + positive(n.y - targetNode.y) / block) - currentTick;
                            n.good = good;
                            foundset.push(n);
                        }
                    }
                    paths.push(bestnode);
                }
                return found ? paths : false;
            }

            // Get Move:
            function GetMoveDirection() {
                const xOffset = camX - maxScreenWidth / 2;
                const yOffset = camY - maxScreenHeight / 2;

                const movex = player.x - xOffset;
                const movey = player.y - yOffset;

                return {
                    movex,
                    movey
                };
            }

            // isAlly:
            function isAlly(sid, pSid) {
                _ = findPlayerBySID(sid)
                if (!_) {
                    return
                }
                if (pSid) {
                    let pObj = findPlayerBySID(pSid)
                    if (!pObj) {
                        return
                    }
                    if (pObj.sid == sid) {
                        return true
                    } else if (_.team) {
                        return _.team === pObj.team ? true : false
                    } else {
                        return false
                    }
                }
                if (!_) {
                    return
                }
                if (player.sid == sid) {
                    return true
                } else if (_.team) {
                    return _.team === player.team ? true : false
                } else {
                    return false
                }
            }
            // Hat / Gear:
            function Hg(e, t){
                buyEquip(e, 0);
                buyEquip(t, 1);
            }

            // UPDATE PLAYER DATA:
            let PrePlaceCount = false;
            let nEy;
            let placeableSpikes = [];
            let placeableTraps = [];
            let placeableSpikesPREDICTS = [];
            let spike = gameObjects.filter(obj => (obj.name == "spikes" || obj.name == "greater spikes" || obj.name == "spinning spikes" || obj.name == "poison spikes") && fgdo(player, obj) < player.scale + obj.scale + 22 && !obj.isTeamObject(_) && obj.active)[0]
            let plaguemask = true;
            let Synced = {
                SyncShotPri: 0,
                SyncShotSec: 0,
                bultect: false,
            }
            let inbullspam = false;



            // n ti:
            function updatePlayers(data) {
                game.tick++;
                enemy = [];
                nears = [];
                near = [];
                //showPlace = [];
                game.tickSpeed = performance.now() - game.lastTick;
                game.lastTick = performance.now();
                ticks.tick++;
                ticks.time.push(Date.now() - ticks.delay <= 50 || Date.now() - ticks.delay >= 175 ? "lag" : 1);
                if (ticks.tick % 10 === 0) {
                    ticks.time = [];
                }
                if (ticks.tick % 300 === 0) {
                }
                ticks.delay = Date.now();
                players.forEach((tmp) => {
                    tmp.forcePos = !tmp.visible;
                    tmp.visible = false;
                });
                for (let i = 0; i < data.length;) {
                    _ = findPlayerBySID(data[i]);
                    if (_) {
                        _.t1 = (_.t2 === undefined) ? game.lastTick : _.t2;
                        _.t2 = game.lastTick;
                        _.oldPos.x2 = _.x2;
                        _.oldPos.y2 = _.y2;
                        _.x1 = _.x;
                        _.y1 = _.y;
                        _.x2 = data[i + 1];
                        _.y2 = data[i + 2];
                        _.x3 = _.x2 + (_.x2 - _.oldPos.x2);
                        _.y3 = _.y2 + (_.y2 - _.oldPos.y2);
                        _.d1 = (_.d2 === undefined) ? data[i + 3] : _.d2;
                        _.d2 = data[i + 3];
                        _.dt = 0;
                        _.buildIndex = data[i + 4];
                        _.weaponIndex = data[i + 5];
                        _.weaponVariant = data[i + 6];
                        _.team = data[i + 7];
                        _.isLeader = data[i + 8];
                        _.oldSkinIndex = _.skinIndex;
                        _.oldTailIndex = _.tailIndex;
                        _.skinIndex = data[i + 9];
                        _.tailIndex = data[i + 10];
                        _.iconIndex = data[i + 11];
                        _.zIndex = data[i + 12];
                        _.visible = true;
                        _.update(game.tickSpeed);
                        _.dist2 = UTILS.getDist(_, player, 2, 2);
                        _.aim2 = UTILS.getDirect(_, player, 2, 2);
                        _.dist3 = UTILS.getDist(_, player, 3, 3);
                        _.aim3 = UTILS.getDirect(_, player, 3, 3);
                        if (spike) {
                            _.Saim = UTILS.getDirect(_, spike, 2, 2);
                        }
                        _.damageThreat = 0;
                        if (_.skinIndex == 45 && _.shameTimer <= 0) {
                            _.addShameTimer();
                        }
                        if (_.oldSkinIndex == 45 && _.skinIndex != 45) {
                            _.shameTimer = 0;
                            _.shameCount = 0;
                            if (_ == player) {
                                healer();
                            }
                        }


                        nEy = _;
                        if (_ == player) {
                            if (gameObjects.length) {

                                let nearTrap = gameObjects.filter(e => e.trap && e.active && UTILS.getDist(e, _, 0, 2) <= (_.scale + e.getScale() + 5) && !e.isTeamObject(_)).sort(function(a, b) {
                                    return UTILS.getDist(a, _, 0, 2) - UTILS.getDist(b, _, 0, 2);
                                })[0];
                                let spike = gameObjects.filter(obj => (obj.name == "spikes" || obj.name == "greater spikes" || obj.name == "spinning spikes" || obj.name == "poison spikes") && fgdo(player, obj) < player.scale + obj.scale + 22 && !obj.isTeamObject(_) && obj.active)[0]
                                if (nearTrap) {
                                    traps.dist = UTILS.getDist(nearTrap, _, 0, 2);
                                    //traps.aim = UTILS.getDirect(spike ? spike : nearTrap, _, 0, 2);
                                    traps.aim = UTILS.getDirect(nearTrap, _, 0, 2);
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
                        if (_.weaponIndex < 9) {
                            _.primaryIndex = _.weaponIndex;
                            _.primaryVariant = _.weaponVariant;
                        } else if (_.weaponIndex > 8) {
                            _.secondaryIndex = _.weaponIndex;
                            _.secondaryVariant = _.weaponVariant;
                        }
                    }
                    i += 13;
                }

                if (inGame) {
                    if (window.pingTime > ms.max || isNaN(ms.max)) {
                        ms.max = window.pingTime;
                    }
                    if (window.pingTime < ms.min || isNaN(ms.min)) {
                        ms.min = window.pingTime;
                    }
                    ms.avg = Math.floor([(window.pingTime + ms.max + ms.min)/3]);
                    nearBuilds = gameObjects.filter((e) => Math.hypot(e.y - player.y2, e.x - player.x2) < 600);
                }









                if (waitTicks.length) {
                    waitTicks.forEach((ajaj) => {
                        ajaj();
                    });
                    waitTicks = [];
                }
                if (runAtNextTick.length) {
                    runAtNextTick.forEach((tmp) => {
                        checkProjectileHolder(...tmp);
                    });
                    runAtNextTick = [];
                }

                if (runAtNextTick.length) {
                    runAtNextTick.forEach((tmp) => {
                        checkProjectileHolder(...tmp);
                    });
                    runAtNextTick = [];
                }
                for (let i = 0; i < data.length;) {
                    _ = findPlayerBySID(data[i]);
                    if (_) {
                        if (!_.isTeam(player)) {
                            enemy.push(_);
                            if (_.dist2 <= items.weapons[_.primaryIndex == undefined ? 5 : _.primaryIndex].range + (player.scale * 2)) {
                                nears.push(_);
                            }
                        }
                        _.manageReload();
                        if (_ != player) {
                            _.addDamageThreat(player);
                        }
                    }
                    i += 13;
                }




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
                        // console.log("no enemy");
                    }
                    if (os.autoq && near.dist2 <= 255 && player.shameCount <= 4) {
                        game.tickBase(() => {
                            place(0, getAttackDir(), 0, false);
                        }, 5);
                    }
                    if (game.tickQueue[game.tick]) {
                        game.tickQueue[game.tick].forEach((action) => {
                            action();
                        });
                        game.tickQueue[game.tick] = null;
                    }
                    if (advHeal.length) {
                        advHeal.forEach(updHealth => {
                            let sid = updHealth[0];
                            let value = updHealth[1];
                            let damaged = updHealth[2];
                            _ = findPlayerBySID(sid);
                            let bullTicked = false;
                            if (_.health <= 0) {
                                if (!_.death) {
                                    _.death = true;
                                    if (_ != player) {
                                        //addMenuChText('', `${_.name} ${randomizePhrases2()}`, 'red');
                                    }
                                    addDeadPlayer(_);
                                }
                            }
                            if (_ == player) {
                                if (_.skinIndex == 7 && (damaged == 5 || (_.latestTail == 13 && damaged == 2))) {
                                    if (my.reSync) {
                                        my.reSync = false;
                                        _.setBullTick = true;
                                    }
                                    bullTicked = true;
                                }
                                if (inGame) {
                                    let attackers = getAttacker(damaged);
                                    let gearDmgs = [0.25, 0.45].map(val => val * items.weapons[player.weapons[0]].dmg * soldierMult());
                                    let includeSpikeDmgs = !bullTicked && gearDmgs.includes(damaged);
                                    let healTimeout = 1000 / 9;
                                    let pingHealTimeout = 140 - window.pingTime;
                                    let slowHeal = function (timer) {
                                        setTimeout(() => {
                                            healer();
                                        }, timer);
                                    };
                                    let PingHealing = getEl("pingheal").checked ? pingHealTimeout : healTimeout;
                                    if (getEl('healingBeta').checked) {
                                        if (attackers.length) {
                                            let by = attackers.filter(tmp => {
                                                if (tmp.dist2 <= (tmp.weaponIndex < 9 ? 300 : 700)) {
                                                    tmpDir = UTILS.getDirect(player, tmp, 2, 2);
                                                    if (UTILS.getAngleDist(tmpDir, tmp.d2) <= Math.PI) {
                                                        return tmp;
                                                    }
                                                }
                                            });
                                            if (by.length) {
                                                let maxDamage = includeSpikeDmgs ? 10 : 10;
                                                if (damaged > maxDamage && game.tick - _.antiTimer > 1) {
                                                    _.canEmpAnti = true;
                                                    _.antiTimer = game.tick;
                                                    let shame = 4;
                                                    if (_.shameCount < shame) {
                                                        healer();
                                                    } else {
                                                        slowHeal(PingHealing);
                                                    }
                                                } else {
                                                    slowHeal(PingHealing);
                                                }
                                            } else {
                                                slowHeal(PingHealing);
                                            }
                                        } else {
                                            slowHeal(PingHealing);
                                        }
                                    } else {
                                        if (damaged >= (includeSpikeDmgs ? 8 : 20) && _.damageThreat >= 25 && game.tick - _.antiTimer > 1) {
                                            _.canEmpAnti = true;
                                            _.antiTimer = game.tick;
                                            let shame = 5;
                                            if (_.shameCount < shame) {
                                                healer();
                                            } else {
                                                slowHeal(PingHealing);
                                            }
                                        } else {
                                            slowHeal(PingHealing);
                                        }
                                    }
                                    if (damaged >= 20 && player.skinIndex == 11) instaC.canCounter = true;
                                }
                            } else {
                                if (!_.setPoisonTick && (_.damaged == 5 || (_.latestTail == 13 && _.damaged == 2))) {
                                    _.setPoisonTick = true;
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
                            // AntiInsta:
                            if (player.canEmpAnti) {
                                player.canEmpAnti = false;
                                if (near.dist2 <= 300 && !my.safePrimary(near) && !my.safeSecondary(near)) {
                                    if (near.reloads[53] == 0) {
                                        player.empAnti = true;
                                        player.soldierAnti = false;
                                        if (true) {//anti insta
                                            ch3("Emp Anti");
                                            Hg(22, 21);
                                        }
                                        /*
                                    } else if (near.dist2 <= 400 && !my.safePrimary(near) && !my.safeSecondary(near) && player.weapons[0] == 5 && player.weapons[1] == 10 || player.weapons[1] == 9 || player.weapons[1] == 12 || player.weapons[1] == 15) {
                                        player.empAnti = false;
                                        player.soldierAnti = false;
                                        if (true) {//anti OneTick
                                            antiOneTick();
                                            ch3("OneTick Anti");
                                        }
                                        */
                                    } else {
                                        player.empAnti = false;
                                        player.soldierAnti = true;
                                        if (true) {//anti rev insta
                                            ch3("Soldier Anti");
                                            Hg(6, 21);
                                            setTimeout(() => {
                                                Hg(11, 18);
                                            }, 100);
                                        }
                                    }
                                }
                            }
                            let prehit = gameObjects.filter(tmp => tmp.dmg && tmp.active && tmp.isTeamObject(player) && UTILS.getDist(tmp, near, 0, 3) <= (tmp.scale + near.scale)).sort(function(a, b) {
                                return UTILS.getDist(a, near, 0, 2) - UTILS.getDist(b, near, 0, 2);
                            })[0];
                            if (prehit) {
                                if (near.dist2 <= items.weapons[player.weapons[0]].range + player.scale * 1.8 && os.predictTick) {
                                    instaC.canSpikeTick = true;
                                    instaC.syncHit = true;
                                    if (os.revTick && player.weapons[1] == 15 && player.reloads[53] == 0 && instaC.perfCheck(player, near)) {
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
                                    //textManager.showText(player.x2, player.y2, 30, 0.15, 1850, "Anti Vel Spiketick", "#fff", 2);
                                    packet("a", near.dir + 180, 1);
                                    game.tickBase(() => {
                                        packet("a", lastMoveDir || undefined, 1);
                                    }, 1);
                                }
                            }
                        }




                        // Move Dir:
                        const moveDirection = GetMoveDirection();



                        //  AutoOneTick
                        if (true) {
                            [autoOneTick].forEach(e => e.toggle != undefined && e.toDo.length && (e.toggle = false));
                            if (enemy.length && autoOneTick.toggle && !autoOneTick.toDo.length) {
                                autoOneTick.run(near);
                            }
                            for (let e of [autoOneTick]) {
                                if (e.toDo.length) {
                                    e.toDo.pop()();
                                    break;
                                }
                            }

                            if (getEl("oneframe").checked && player.reloads[player.weapons[0]] == 0 && !traps.inTrap && player.reloads[53] == 0 &&
                                near.dist2 >= 170 && near.dist2 <= 240 && (getEl("usesoldeirTickSync").checked ? near.skinIndex != 6 : true) && moveDirection.movex >= 957 && moveDirection.movex <= 963 && moveDirection.movey >= 537 && moveDirection.movey <= 543) {
                                instaC.autoOneFrame();
                            }
                        }
                        // Auto Sync:
                        if (true) {
                            // autoSync
                            if (toggles.autoSync()) {
                                if (Synced.SyncShotSec >= 1 && player.weapons[1] == 15) {
                                    if (near.dist2 <= 180) {
                                        instaC.syncTry("insta", 5);
                                    } else {
                                        instaC.syncTry();
                                    }
                                    Synced.SyncShotSec = 0;
                                }
                                if (Synced.SyncShotPri >= 1 && near.dist2 <= (items.weapons[player.weapons[0]].range + near.scale * 1.8) && player.weapons[1] == 15) {
                                    instaC.syncTry("insta", 5);
                                    Synced.SyncShotPri = 0;
                                }
                            }
                            // autoHit:
                            if(enemy.length && toggles.autohitsync() && canSyncHit() && !my.waitHit && near.dist2 <= 350 && !traps.inTrap) {
                                setTimeout(() => {
                                    ch3("syncHited");
                                    my.autoAim = true;
                                    my.waitHit = true;
                                    Hg(7, 18);
                                    sendAutoGather();
                                    // Add your custom logic or function calls here
                                    setTimeout(() => {
                                        my.autoAim = false;
                                        my.waitHit = false;
                                        sendAutoGather();
                                    }, 100);
                                }, 5);
                            }
                            // bullTcik
                            if((game.tick - near.bullTick) % 9 == 0 && near.skinIndex == 7) {
                                //ch2("Bulltick detected: " + near.name + "[" + near.sid + "]");
                                Synced.bultect = true;
                                game.tickBase(() => {
                                    Synced.bultect = false;
                                }, 1)
                            }
                        }


                        // Isnat:
                        if (true) {
                            let NouseBadHatBoy = (near.skinIndex != 6 || near.skinIndex != 22);


                            if ((true ? NouseBadHatBoy : true) && (useWasd ? true : ((player.checkCanInsta(true) >= 100 ? player.checkCanInsta(true) : player.checkCanInsta(false)) >= (player.weapons[1] == 10 ? 95 : 100))) && near.dist2 <= items.weapons[player.weapons[1] == 10 ? player.weapons[1] : player.weapons[0]].range + near.scale * 1.8 && (instaC.wait || (useWasd && Math.floor(Math.random() * 5) == 0)) && !instaC.isTrue && !my.waitHit && player.reloads[player.weapons[0]] == 0 && player.reloads[player.weapons[1]] == 0 && (useWasd ? true : player.reloads[53] == 0) && instaC.perfCheck(player, near)) {
                                if (player.checkCanInsta(true) >= 100) {
                                    instaC.nobull = useWasd ? false : instaC.canSpikeTick ? false : true;
                                } else {
                                    instaC.nobull = false;
                                }
                                instaC.can = true;
                            } else {
                                instaC.can = false;
                            }
                        }
                        /*
                        if ((useWasd ? true : ((player.checkCanInsta(true) >= 100 ? player.checkCanInsta(true) : player.checkCanInsta(false)) >= (player.weapons[1] == 10 ? 95 : 100))) && near.dist2 <= items.weapons[player.weapons[1] == 10 ? player.weapons[1] : player.weapons[0]].range + near.scale * 1.8 && (instaC.wait || (useWasd && Math.floor(Math.random() * 5) == 0)) && !instaC.isTrue && !my.waitHit && player.reloads[player.weapons[0]] == 0 && player.reloads[player.weapons[1]] == 0 && (useWasd ? true : getEl("instaType").value == "oneShot" ? (player.reloads[53] <= (player.weapons[1] == 10 ? 0 : game.tickRate)) : true) && instaC.perfCheck(player, near)) {
                            instaC.nobull = false;
                            instaC.can = true;
                        } else {
                            instaC.can = false;
                        }
                        */

                        let nearTrap = liztobj.filter(e => e.trap && e.active && e.isTeamObject(player) && UTILS.getDist(e, near, 0, 2) <= (near.scale + e.getScale() + 5)).sort(function(a, b) {
                            return UTILS.getDist(a, near, 0, 2) - UTILS.getDist(b, near, 0, 2);
                        })[0];

                        if(nearTrap && near.skinIndex == 6) {
                            setTimeout(() => {
                                instaC.can = true;
                                instaC.nobull = false;
                            }, items.weapons[near.weaponIndex] - near.reloads[near.weaponIndex] + near.pinge)
                        }
                        macro.q && place(0, getAttackDir(), 0, false);
                        macro.f && place(4, getSafeDir());
                        macro.v && place(2, getSafeDir());
                        macro.y && place(5, getSafeDir());
                        macro.h && place(player.getItemType(22), getSafeDir());
                        macro.n && place(3, getSafeDir());
                        if (game.tick % 3 == 0) {
                            if (mills.place) {
                                let plcAng = 1.50;
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
                            instaC.changeType([9, 10, 15].includes(player.weapons[1]) ? "rev" : "normal");
                            //instaC.changeType(player.weapons[1] == 10 ? "rev" : instaC.nobull ? "nobull" : "normal");
                        }
                        if (instaC.canCounter) {
                            instaC.canCounter = false;
                            if (player.reloads[player.weapons[0]] == 0 && !instaC.isTrue) {
                                instaC.counterType();
                            }
                        }
                        if (instaC.isAntiCounter) {
                            instaC.isAntiCounter = false;
                            if (!instaC.isTrue) {
                                instaC.antiCounterType();
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

                        // AutoBullSpam - abs:
                        if (near.skinIndex !== 26 && getEl("abs").checked && !clicks.left && !clicks.right && !instaC.isTrue && near.dist2 <= (items.weapons[player.weapons[0]].range + near.scale * 1.8) && !traps.inTrap) {
                            setTimeout(() => {
                                if (player.weaponIndex !== player.weapons[0] || player.buildIndex > -1) {
                                    selectWeapon(player.weapons[0]);
                                }
                                if (player.reloads[player.weapons[0]] === 0 && !my.waitHit) {
                                    sendAutoGather();
                                    my.waitHit = 1;
                                    my.autoAim = true;
                                    inbullspam = true;
                                    Hg(!plaguemask ? 7 : 21, 18);
                                    game.tickBase(() => {
                                        sendAutoGather();
                                        my.waitHit = 0;
                                        my.autoAim = false;
                                        inbullspam = false;
                                        Hg(near.skinIndex === 7 ? near.antiBull > 0 ? 11 : 6 : 6, 21);
                                    }, 10);
                                }
                            }, 5);
                        } else {
                            inbullspam = false;
                        }


                        // Click Events:
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
                        // Auto Break:
                        if (traps.inTrap) {
                            if (!clicks.left && !clicks.right && !instaC.isTrue) {
                                if (player.weaponIndex != (traps.notFast() ? player.weapons[1] : player.weapons[0]) || player.buildIndex > -1) {
                                    selectWeapon(traps.notFast() ? player.weapons[1] : player.weapons[0]);
                                }
                                if (player.reloads[traps.notFast() ? player.weapons[1] : player.weapons[0]] == 0 && !my.waitHit) {
                                    sendAutoGather();
                                    my.waitHit = 1;
                                    invisBody = true;
                                    game.tickBase(() => {
                                        sendAutoGather();
                                        my.waitHit = 0;
                                        invisBody = false;
                                    }, 1);
                                }
                            }
                        }
                        // Bow Insta Move:
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
                        // PrePlaced:
                        if (!instaC.isTrue && near.inTrap) {
                            game.tickBase(() => {
                                if (near.skinIndex == 6) {
                                    traps.ReTrap();
                                } else {
                                    traps.runPrePlacer();
                                }
                            }, 1);
                        }



                        // AutoReload
                        if (player.weapons[1] && !clicks.left && !clicks.right && !traps.inTrap && !instaC.isTrue && !my.waitHit) {
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
                        let doEmpAntiInsta = false;
                        if (judgeAtNextTick) {
                            judgeAtNextTick = false;
                            if (enemy.length && near.reloads[53] <= game.tickRate && (near.secondaryIndex != 10 && near.secondaryIndex != 11 && near.secondaryIndex != 14)) {
                                doEmpAntiInsta = true;
                            }
                        }
                        function safeWeapon1() {
                            return (near.primaryIndex == 0 || near.primaryIndex == 6 || near.primaryIndex == 7 || near.primaryIndex == 8);
                        }

                        function safeWeapon2() {
                            return (near.secondaryIndex == 9 || near.secondaryIndex == 10 || near.secondaryIndex == 11 || near.secondaryIndex == 14);
                        }
                        var bulltick = false;
                        // switch shit
                        let hatChanger = function() {
                            if (my.anti0Tick > 0) {
                                buyEquip(6, 0);
                            } else {
                                if (((player.shameCount > 0 && (game.tick - player.bullTick) % 7 == 0 && player.skinIndex != 45) || my.reSync)) {
                                    buyEquip(7, 0);
                                    if (near.dist2 > 200 || !enemy.length) {
                                        bulltick = true;
                                    } else {
                                        bulltick = false;
                                    }
                                } else if (clicks.left || clicks.right) {
                                        if (clicks.left) {
                                            buyEquip(player.reloads[player.weapons[0]] == 0 ? getEl("weaponGrind").checked ? 40 : 7 : player.empAnti ? 22 : player.soldierAnti ? 6 : (getEl("antiBullType").value == "abreload" && near.antiBull > 0) ? 11 : near.dist2 <= 300 ? (getEl("antiBullType").value == "abalway" && near.reloads[near.primaryIndex] == 0) ? 11 : 6 : biomeGear(1, 1), 0);
                                        } else if (clicks.right) {
                                            buyEquip(player.reloads[clicks.right && player.weapons[1] == 10 ? player.weapons[1] : player.weapons[0]] == 0 ? 40 : player.empAnti ? 0 : player.soldierAnti ? 0 : (getEl("antiBullType").value == "abreload" && near.antiBull > 0) ? 11 : near.dist2 <= 300 ? (getEl("antiBullType").value == "abalway" && near.reloads[near.primaryIndex] == 0) ? 11 : 6 : biomeGear(1, 1), 0);
                                        }
                                } else if (traps.inTrap) {// AutoBreak Hats
                                    if (traps.info.health <= items.weapons[player.weaponIndex].dmg ? false : (player.reloads[player.weapons[1] == 10 ? player.weapons[1] : player.weapons[0]] == 0)) {
                                        buyEquip(40, 0);
                                    } else {
                                        if ((player.shameCount > 0 && (game.tick - player.bullTick) % o.serverUpdateRate === 0 && player.skinIndex != 45) || my.reSync) {
                                            Hg(7, 13);
                                        } else {
                                            if (player.empAnti) {
                                                buyEquip(22, 0);
                                            } else if (near.weapons[0] == 3 || near.weapons[0] == 4 && near.reloads[near.weapons[0]] === 0) {
                                                buyEquip(26, 0);
                                            } else {
                                                buyEquip(6, 0);
                                            }
                                        }
                                    }
                                } else {
                                    if ((player.empAnti || player.soldierAnti) && bulltick == false) {
                                        buyEquip(player.empAnti ? 22 : 6, 0);
                                    } else {
                                        if ((player.shameCount > 0 && (game.tick - player.bullTick) % o.serverUpdateRate === 0 && player.skinIndex != 45) || my.reSync) {
                                            buyEquip(7, 0);
                                        } else {
                                            if (near.dist2 <= 300 && bulltick == false) {
                                                buyEquip((getEl("antiBullType").value == "abreload" && near.antiBull > 0) ? 11 : (getEl("antiBullType").value == "abalway" && near.reloads[near.primaryIndex] == 0) ? 11 : 6, 0);
                                            } else {
                                                if (bulltick == false) {
                                                    biomeGear(1);
                                                }
                                            }
                                        }
                                    }
                                }
                            }
                        }
                        function findOBJ(sid) {
                            let findObj = findObjectBySid(sid);
                        }
                        let accChanger = function () {
                            if (!traps.inTrap) {
                                if(near.dist2 <= 700){
                                    buyEquip(player.health <= 75 ? 21 : 19, 1);
                                } else if (clicks.left || clicks.right) {
                                    buyEquip(clicks.right ? 11 : player.reloads[player.weapons[0]] == 0 ? 21 : 11, 1);
                                } else if (traps.inTrap) {
                                    buyEquip(near.dist3 <= (items.weapons[player.weaponIndex].range + (player.scale * 1.8)) && player.reloads[player.weaponIndex] == 0 ? 21 : 11, 1);
                                } else if (((player.shameCount > 0 && (game.tick - player.bullTick) % 7 == 0 && player.skinIndex != 45) || my.reSync)) {
                                    buyEquip(13, 1);
                                } else {
                                    buyEquip(11, 1);
                                }
                            } else if (traps.inTrap) {
                                if (near.antiBull > 0) {
                                    buyEquip(21, 1);
                                } else {
                                    if (near.dist2 <= items.weapons[near.primaryIndex ? near.primaryIndex : 5].range + player.scale * 3) {
                                        if (instaC.wait) {
                                            buyEquip(21, 1);
                                        } else {
                                            if ((game.tick - player.bullTick) % o.serverUpdateRate === 0) {
                                                buyEquip(13, 1);
                                            } else {
                                                buyEquip(11, 1);
                                            }
                                        }
                                    } else {
                                        buyEquip(11, 1);
                                    }
                                }
                            }
                        }
                        if (storeMenu.style.display != "block" && !instaC.isTrue && !instaC.ticking) {
                            hatChanger();
                            accChanger();
                        }
                        if (os.autoPush && enemy.length && !traps.inTrap && !instaC.ticking) {
                            autoPush();
                        } else {
                            if (my.autoPush) {
                                my.autoPush = false;
                                packet("a", lastMoveDir || undefined, 1);
                            }
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
                        if (getEl("RVN").checked) {
                            antiPush();
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
                                    }
                                });
                            });

                            if (near && near.dist3 <= 360) {
                                traps.replacer();
                            }
                            traps.replacer();
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
                if (liztobj[i1].active && liztobj[i1].health > 0 && UTILS.getDist(liztobj[i1], player, 0, 2) < 150) { // || liztobj[i1].buildHealth <= items.weapons[nearEnemy.weaponIndex].dmg)

                    if(liztobj[i1].name.includes("spike") && liztobj[i1]){
                        if(liztobj[i1].owner.sid != player.sid && clicks.left == false && _.reloads[_.secondaryIndex] == 0){
                            selectWeapon(player.weapons[1])
                            buyEquip(40, 0);
                            packet("D", UTILS.getDirect(liztobj[i1], player, 0, 2))
                            setTickout( () => {
                                buyEquip(6, 0)
                            }, 1);
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
                                    text: tmpC + ". " + (data[i+1] != "" ? data[i+1] : "unknown")
                                }),
                                UTILS.generateElement({
                                    class: "leaderScore",
                                    text: UTILS.sFormat(data[i+2]) || "0"
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
                        _ = findAIBySID(data[i]);
                        if (_) {
                            _.index = data[i + 1];
                            _.t1 = (_.t2 === undefined) ? tmpTime : _.t2;
                            _.t2 = tmpTime;
                            _.x1 = _.x;
                            _.y1 = _.y;
                            _.x2 = data[i + 2];
                            _.y2 = data[i + 3];
                            _.d1 = (_.d2 === undefined) ? data[i + 4] : _.d2;
                            _.d2 = data[i + 4];
                            _.health = data[i + 5];
                            _.dt = 0;
                            _.visible = true;
                        } else {
                            _ = aiManager.spawn(data[i + 2], data[i + 3], data[i + 4], data[i + 1]);
                            _.x2 = _.x;
                            _.y2 = _.y;
                            _.d2 = _.dir;
                            _.health = data[i + 5];
                            if (!aiManager.aiTypes[data[i + 1]].name)
                                _.name = o.cowNames[data[i + 6]];
                            _.forcePos = true;
                            _.sid = data[i];
                            _.visible = true;
                        }
                        i += 7;
                    }
                }
            }
            // ANIMATE AI:
            function animateAI(sid) {
                _ = findAIBySID(sid);
                if (_) _.startAnim();
            }
            function gatherAnimation(sid, didHit, index) {
                _ = findPlayerBySID(sid);
                if (_) {
                    _.startAnim(didHit, index);
                    _.gatherIndex = index;
                    _.gathering = 1;

                    if (didHit) {
                        let _ects = objectManager.hitObj;
                        //preplacer

                        setTickout(() => {
                            setTimeout(() => {
                                if(near.dist2 <= 300) {
                                    this.testCanPlace(2, 0, (Math.PI * 2), (Math.PI / 24), near.aim2);
                                    ch3("PrePlacer 1");
                                } else {
                                    this.testCanPlace(4, 0, (Math.PI * 2), (Math.PI / 24), near.aim2);
                                    ch3("PrePlacer 2");
                                }
                            }, items.weapons[index].speed - window.pingTime)
                        }, 2)
                        objectManager.hitObj = [];
                        game.tickBase(() => {
                            // refind
                            _ = findPlayerBySID(sid);
                            let val = items.weapons[index].dmg * (o.weaponVariants[_[(index < 9 ? "prima" : "seconda") + "ryVariant"]].val) * (items.weapons[index].sDmg || 1) * (_.skinIndex == 40 ? 3.3 : 1);
                            _ects.forEach((healthy) => {
                                healthy.healthMov = healthy.health - val / 2;
                                healthy.health -= val;
                                // Display damage text for each hit
                            });
                        }, 1);
                    }
                }
            }


            // WIGGLE GAME OBJECT:
            function wiggleGameObject(dir, sid) {
                _ = findObjectBySid(sid);
                if (_) {
                    _.xWiggle += o.gatherWiggle * Math.cos(dir);
                    _.yWiggle += o.gatherWiggle * Math.sin(dir);
                    if (_.health) {
                        //_.damaged = Math.min(255, _.damaged + 60);
                        objectManager.hitObj.push(_);
                    }
                }
            }
            // SHOOT TURRET:
            function shootTurret(sid, dir) {
                _ = findObjectBySid(sid);
                if (_) {
                    if (o.anotherVisual) {
                        _.lastDir = dir;
                    } else {
                        _.dir = dir;
                    }
                    _.xWiggle += o.gatherWiggle * Math.cos(dir + Math.PI);
                    _.yWiggle += o.gatherWiggle * Math.sin(dir + Math.PI);
                }
            }
            var killCounter = getEl("killCounter");
            // UPDATE PLAYER VALUE:
            function updatePlayerValue(index, value, updateView) {
                if (player) {
                    player[index] = value;
                    if (index == "points") {
                        if (os.autoBuy) {
                            autoBuy.hat();
                            autoBuy.acc();
                        }
                    } else if (index == "kills") {
                        if (os.killChat) {
                            io.send("6", "Got Skill Nigaer");
                            ch3("+1 niger", 600, "#c2002e");
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
                        let _ects = objectManager.hitObj;
                        objectManager.hitObj = [];
                        game.tickBase(() => {
                            let val = projectiles[i].dmg;
                            _ects.forEach((healthy) => {
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
            function isTeam(_) {
                return (_ == player || (_.team && _.team == player.team));
            }

            // SEND MESSAGE:
            function receiveChat(sid, message) {
                let tmpPlayer = findPlayerBySID(sid);
                if (tmpPlayer) {




                    if (true) {
                        if (player != tmpPlayer) {
                            if (message.includes("mod")) { // what mod?
                                ch('determination (priv)');
                            } else if (message.includes("real") && message.includes("mod")) { // real mod?
                                ch("sam mod v69");
                            } else if (message.includes("i") && message.includes("pro")) { // he pro ;o
                                ch("wow ok");
                            }else if((message.includes("u") || message.includes("noob")) || (message.includes("ms") || message.includes("ping") && /\d/.test(message)) || (message.includes("high") && message.includes("pin")) || (message.includes("i") && message.includes("lag"))) { // ms? by ch3
                                let number = message.match(/\d+/);
                                if(parseInt(number) >= 90) {
                                    ch("don't care");
                                }
                            } else if (message.includes("!e")) { // omg sync on !e, PPL like it huuh ;D
                                if (near.dist2 <= 300) {
                                    instaC.syncTry("insta", 50);
                                } else {
                                    instaC.syncTry("sec", 5);
                                }
                                ch('Delay awayaay: ' + window.pingTime);
                            }
                        }
                    }


                    addMenuChText(`${tmpPlayer.name} {${tmpPlayer.sid}}`, message, "white");
                    if (o.anotherVisual) {
                        allChats.push(new addCh(tmpPlayer.x, tmpPlayer.y, message, tmpPlayer));
                    } else {
                        tmpPlayer.chatMessage = ((text) => {
                            let tmpString;
                            profanityList.forEach((list) => {
                                if (text.indexOf(list) > -1) {
                                    tmpString = "";
                                    for (var y = 0; y < list.length; ++y) {
                                        tmpString += tmpString.length?"o":"M";
                                    }
                                    var re = new RegExp(list, 'g');
                                    text = text.replace(re, tmpString);
                                }
                            });
                            return text;
                        })(message);
                        tmpPlayer.chatCountdown = o.chatCountdown;
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
                if (o.anotherVisual) {
                    textManager.stack.push({x: x, y: y, value: value});
                } else {
                    textManager.showText(x, y, 50, 0.18, useWasd ? 500 : 1500, Math.abs(value), (value>=0)?"#fff":"#8ecc51");
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
                        this.scale = o.playerScale;
                        this.speed = o.playerSpeed;
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
                        for (let i = 0; i < o.resourceTypes.length; ++i) {
                            this[o.resourceTypes[i]] = moofoll ? 100 : 0;
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
                    this.judgeShame = function () {
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
                        if (o.anotherVisual) {
                        } else {
                            obj.alive = false;
                        }
                    };
                    // ADD NEW:
                    let _;
                    this.add = function(sid, x, y, dir, s, type, data, setSID, owner) {
                        _ = fOS(sid);
                        if (!_) {
                            _ = botObj.find((tmp) => !tmp.active);
                            if (!_) {
                                _ = new BotObject(sid);
                                botObj.push(_);
                            }
                        }
                        if (setSID) {
                            _.sid = sid;
                        }
                        _.init(x, y, dir, s, type, data, owner);
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
                tmpContext = tmpContext || be;
                tmpContext.beginPath();
                tmpContext.arc(x, y, scale, 0, 2 * Math.PI);
                if (!dontFill) tmpContext.fill();
                if (!dontStroke) tmpContext.stroke();
            }
            function renderHealthCircle(x, y, scale, tmpContext, dontStroke, dontFill) {
                tmpContext = tmpContext || be;
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
                ctx = ctx || be;
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
                var tmpMid = o.mapScale / 2;
                objectManager.add(0, tmpMid, tmpMid + 200, 0, o.treeScales[3], 0);
                objectManager.add(1, tmpMid, tmpMid - 480, 0, o.treeScales[3], 0);
                objectManager.add(2, tmpMid + 300, tmpMid + 450, 0, o.treeScales[3], 0);
                objectManager.add(3, tmpMid - 950, tmpMid - 130, 0, o.treeScales[2], 0);
                objectManager.add(4, tmpMid - 750, tmpMid - 400, 0, o.treeScales[3], 0);
                objectManager.add(5, tmpMid - 700, tmpMid + 400, 0, o.treeScales[2], 0);
                objectManager.add(6, tmpMid + 800, tmpMid - 200, 0, o.treeScales[3], 0);
                objectManager.add(7, tmpMid - 260, tmpMid + 340, 0, o.bushScales[3], 1);
                objectManager.add(8, tmpMid + 760, tmpMid + 310, 0, o.bushScales[3], 1);
                objectManager.add(9, tmpMid - 800, tmpMid + 100, 0, o.bushScales[3], 1);
                objectManager.add(10, tmpMid - 800, tmpMid + 300, 0, items.list[4].scale, items.list[4].id, items.list[10]);
                objectManager.add(11, tmpMid + 650, tmpMid - 390, 0, items.list[4].scale, items.list[4].id, items.list[10]);
                objectManager.add(12, tmpMid - 400, tmpMid - 450, 0, o.rockScales[2], 2);
            }
            const speed = 35;
            // RENDER PLAYERS:
            function renderDeadPlayers(f, d) {
                be.fillStyle = "#91b2db";
                deadPlayers.filter(dead => dead.active).forEach((dead) => {
                    dead.animate(delta);

                    be.globalAlpha = dead.alpha;
                    be.strokeStyle = outlineColor;

                    be.save();
                    be.translate(dead.x - f, dead.y - d);
                    // tphere
                    dead.dir += toRadian(1);
                    if (dead.dir >= 2 * Math.PI) {
                        dead.dir -= 2 * Math.PI;
                    }
                    // RENDER PLAYER:
                    be.rotate(dead.dir);
                    renderDeadPlayer(dead, be);
                    be.restore();

                    // same color in bundle
                    be.fillStyle = "#91b2db";

                });
            }
            // RENDER PLAYERS:
            let invisBody = false;
            function renderPlayers(f, d, zIndex) {
                be.globalAlpha = 1;
                be.fillStyle = "#91b2db";
                for (var i = 0; i < players.length; ++i) {
                    _ = players[i];
                    if (_.zIndex == zIndex) {
                        _.animate(delta);
                        if (_.visible) {
                            _.skinRot += (0.002 * delta);
                            tmpDir = (!os.showDir && !useWasd && _ == player) ? os.attackDir ? getVisualDir() : getSafeDir() : (_.dir || 0);
                            be.save();
                            be.translate(_.x - f, _.y - d);
                            // RENDER PLAYER:
                            be.rotate(tmpDir + _.dirPlus);
                            if (_ == player && invisBody) {
                                null;
                            } else {
                                renderPlayer(_, be);
                            }
                            be.restore();
                        }
                    }
                }
            }
            function renderDeadPlayer(obj, ctxt) {
                ctxt = ctxt || be;
                ctxt.lineWidth = outlineWidth;
                ctxt.lineJoin = "miter";
                let handAngle = (Math.PI / 4) * (items.weapons[obj.weaponIndex].armS||1);
                let oHandAngle = (obj.buildIndex < 0)?(items.weapons[obj.weaponIndex].hndS||1):1;
                let oHandDist = (obj.buildIndex < 0)?(items.weapons[obj.weaponIndex].hndD||1):1;

                obj.skinIndex = 48;
                obj.tailIndex = 13;
                renderTail(13, ctxt, obj);
                // WEAPON BELLOW HANDS:
                if (obj.buildIndex < 0 && !items.weapons[obj.weaponIndex].aboveHand) {
                    renderTool(items.weapons[10], o.weaponVariants[obj.weaponVariant].src, obj.scale, 0, ctxt);
                    if (items.weapons[obj.weaponIndex].projectile != undefined && !items.weapons[obj.weaponIndex].hideProjectile) {
                        renderProjectile(obj.scale, 0,
                                         items.projectiles[items.weapons[obj.weaponIndex].projectile], be);
                    }
                }

                // HANDS:
                ctxt.fillStyle = "#ececec";
                renderCircle(obj.scale * Math.cos(handAngle), (obj.scale * Math.sin(handAngle)), 14);
                renderCircle((obj.scale * oHandDist) * Math.cos(-handAngle * oHandAngle),
                             (obj.scale * oHandDist) * Math.sin(-handAngle * oHandAngle), 14);

                // WEAPON ABOVE HANDS:
                if (obj.buildIndex < 0 && items.weapons[obj.weaponIndex].aboveHand) {
                    renderTool(items.weapons[10], o.weaponVariants[obj.weaponVariant].src, obj.scale, 0, ctxt);
                }

                // BUILD ITEM:
                if (obj.buildIndex >= 0) {
                    renderTool(items.weapons[10], o.weaponVariants[obj.weaponVariant].src, obj.scale, 0, ctxt);
                }

                renderCircle(0, 0, obj.scale, ctxt);
                // SKIN
                renderSkin(48, ctxt, null, obj)

            }
            // RENDER PLAYER:
            function renderPlayer(obj, ctxt) {
                ctxt = ctxt || be;
                ctxt.lineWidth = outlineWidth;
                ctxt.lineJoin = "miter";
                let handAngle = (Math.PI / 4) * (items.weapons[obj.weaponIndex].armS||1);
                let oHandAngle = (obj.buildIndex < 0)?(items.weapons[obj.weaponIndex].hndS||1):1;
                let oHandDist = (obj.buildIndex < 0)?(items.weapons[obj.weaponIndex].hndD||1):1;

                let katanaMusket = (obj == player && obj.weapons[0] == 3 && obj.weapons[1] == 15);

                // TAIL/CAPE:
                if (obj.tailIndex > 0) {
                    renderTail(obj.tailIndex, ctxt, obj);
                }

                // WEAPON BELLOW HANDS:
                if (obj.buildIndex < 0 && !items.weapons[obj.weaponIndex].aboveHand) {
                    renderTool(items.weapons[katanaMusket ? 4 : obj.weaponIndex], o.weaponVariants[obj.weaponVariant].src, obj.scale, 0, ctxt);
                    if (items.weapons[obj.weaponIndex].projectile != undefined && !items.weapons[obj.weaponIndex].hideProjectile) {
                        renderProjectile(obj.scale, 0,
                                         items.projectiles[items.weapons[obj.weaponIndex].projectile], be);
                    }
                }

                // HANDS:
                ctxt.fillStyle = o.skinColors[obj.skinColor];
                renderCircle(obj.scale * Math.cos(handAngle), (obj.scale * Math.sin(handAngle)), 14);
                renderCircle((obj.scale * oHandDist) * Math.cos(-handAngle * oHandAngle),
                             (obj.scale * oHandDist) * Math.sin(-handAngle * oHandAngle), 14);

                // WEAPON ABOVE HANDS:
                if (obj.buildIndex < 0 && items.weapons[obj.weaponIndex].aboveHand) {
                    renderTool(items.weapons[obj.weaponIndex], o.weaponVariants[obj.weaponVariant].src, obj.scale, 0, ctxt);
                    if (items.weapons[obj.weaponIndex].projectile != undefined && !items.weapons[obj.weaponIndex].hideProjectile) {
                        renderProjectile(obj.scale, 0,
                                         items.projectiles[items.weapons[obj.weaponIndex].projectile], be);
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
                    ctxt.rotate(Math.PI/2);
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
                let _ = parentSkin||skinPointers[index];
                if (!_) {
                    for (let i = 0; i < hats.length; ++i) {
                        if (hats[i].id == index) {
                            _ = hats[i];
                            break;
                        }
                    }
                    skinPointers[index] = _;
                }
                if (tmpSkin.isLoaded)
                    ctxt.drawImage(tmpSkin, -_.scale/2, -_.scale/2, _.scale, _.scale);
                if (!parentSkin && _.topSprite) {
                    ctxt.save();
                    ctxt.rotate(owner.skinRot);
                    renderSkin(index + "_top", ctxt, _, owner);
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
                let _ = accessPointers[index];
                if (!_) {
                    for (let i = 0; i < accessories.length; ++i) {
                        if (accessories[i].id == index) {
                            _ = accessories[i];
                            break;
                        }
                    }
                    accessPointers[index] = _;
                }
                if (tmpSkin.isLoaded) {
                    ctxt.save();
                    ctxt.translate(-20 - (_.xOff || 0), 0);
                    if (_.spin)
                        ctxt.rotate(owner.skinRot);
                    ctxt.drawImage(tmpSkin, -(_.scale / 2), -(_.scale / 2), _.scale, _.scale);
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
                var _ = accessPointers2[index];
                if (!_) {
                    for (var i = 0; i < accessories.length; ++i) {
                        if (accessories[i].id == index) {
                            _ = accessories[i];
                            break;
                        }
                    }
                    accessPointers2[index] = _;
                }
                if (tmpSkin.isLoaded) {
                    ctxt.save();
                    ctxt.translate(-20 - (_.xOff||0), 0);
                    if (_.spin)
                        ctxt.rotate(owner.skinRot);
                    ctxt.drawImage(tmpSkin, -(_.scale/2), -(_.scale/2), _.scale, _.scale);
                    ctxt.restore();
                }
            }
            // RENDER TOOL:
            let toolSprites = {};
            // RENDER PROJECTILES:
            function renderProjectiles(layer, f, d) {
                for (let i = 0; i < projectiles.length; i++) {
                    _ = projectiles[i];
                    if (_.active && _.layer == layer && _.inWindow) {
                        _.update(delta);
                        if (_.active && isOnScreen(_.x - f, _.y - d, _.scale)) {
                            be.save();
                            be.translate(_.x - f, _.y - d);
                            be.rotate(_.dir);
                            renderProjectile(0, 0, _, be, 1);
                            be.restore();
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
            function renderWaterBodies(f, d, ctxt, padding) {
                // MIDDLE RIVER:
                let tmpW = o.riverWidth + padding;
                let tmpY = (o.mapScale / 2) - d - (tmpW / 2);
                if (tmpY < maxScreenHeight && tmpY + tmpW > 0) {
                    ctxt.fillRect(0, tmpY, maxScreenWidth, tmpW);
                }
            }

            function renderTool(obj, variant, x, y, ctxt) {
                var tmpSrc = obj.src + (variant || "");
                var tmpSprite = toolSprites[tmpSrc];
                if (!tmpSprite) {
                    tmpSprite = new Image();
                    tmpSprite.onload = function() {
                        this.isLoaded = true;
                    }
                    ;
                    tmpSprite.src = ".././img/weapons/" + tmpSrc + ".png";
                    toolSprites[tmpSrc] = tmpSprite;
                }
                if (tmpSprite.isLoaded)
                    ctxt.drawImage(tmpSprite, x + obj.xOff - obj.length / 2, y + obj.yOff - obj.width / 2, obj.length, obj.width);
            }

            var toolFucks = {};



            // RENDER GAME OBJECTS:
            let gameObjectSprites = {};
            function getResSprite(obj) {
                let biomeID = (obj.y >= o.mapScale - o.snowBiomeTop) ? 2 : ((obj.y <= o.snowBiomeTop) ? 1 : 0);
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
                    if (isNight) {
                        tmpContext.shadowBlur = blurScale;
                        tmpContext.shadowColor = `rgba(0, 0, 0, ${obj.alpha})`;
                    }
                    if (obj.type == 0) {
                        let tmpScale;
                        let tmpCount = UTILS.randInt(5, 7);
                        tmpContext.globalAlpha = 0.8;
                        for (let i = 0; i < 2; ++i) {
                            tmpScale = _.scale * (!i ? 1 : 0.5);
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
                            renderBlob(tmpContext, 6, _.scale, _.scale * 0.7);
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
                                tmpRange = UTILS.randInt(_.scale / 3.5, _.scale / 2.3);
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
                    let blurScale = 0;
                    let tmpCanvas = document.createElement("canvas");
                    // let reScale = ((!asIcon && obj.name == "windmill") ? items.list[4].scale : obj.scale);
                    tmpCanvas.width = tmpCanvas.height = (obj.scale * 2.5) + outlineWidth + (items.list[obj.id].spritePadding || 0) + blurScale;
                    if (o.useWebGl) {
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
                        itemSprites[obj.id] = tmpSprite;
                }
                return tmpSprite;
            }
            function getItemSprite2(obj, tmpX, tmpY) {
                let tmpContext = be;
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
                tmpContext.fillStyle = "rgba(0, 0, 0, 0.5)";
                tmpContext.fill();
                tmpContext.restore();
            }
            //renderCircle(_.x - f, _.y - d, _.getScale(0.6, true), be, false, true);
            // OBJECT ON SCREEN:
            function isOnScreen(x, y, s) {
                return (x + s >= 0 && x - s <= maxScreenWidth && y + s >= 0 && (y,
                                                                                s,
                                                                                maxScreenHeight));
            }
            /*         function markObject(_, tmpX, tmpY) {
          getMarkSprite(_, be, tmpX, tmpY);
      }*/
            function markObject(_, tmpX, tmpY) {
                const select = getEl("predic");
                const selectedOption = select.value;

                if (selectedOption === "zod") {
                    yen(be, tmpX, tmpY);
                } else if (selectedOption === "kite") {
                    getMarkSprite(_, be, tmpX, tmpY);
                }
            }
            function yen(context, x, y) {
                context.fillStyle = "rgba(0, 255, 255, 0)";
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
                                ctxt.arc((this.x / o.mapScale) * mapDisplay.width, (this.y / o.mapScale)
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
                    tmpPing = new MapPing("#fff", o.mapPingScale);
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
                            mapContext.fillText("!", (breakTrackers[i].x / o.mapScale) * mapDisplay.width,
                                                (breakTrackers[i].y / o.mapScale) * mapDisplay.height);
                            i += 2;
                        }
                    }
                    // RENDER PLAYERS:
                    mapContext.globalAlpha = 1;
                    mapContext.fillStyle = "#fff";
                    renderCircle((player.x / o.mapScale) * mapDisplay.width,
                                 (player.y / o.mapScale) * mapDisplay.height, 7, mapContext, true);
                    mapContext.fillStyle = "rgba(255,255,255,0.35)";
                    if (player.team && minimapData) {
                        for (let i = 0; i < minimapData.length;) {
                            renderCircle((minimapData[i] / o.mapScale) * mapDisplay.width,
                                         (minimapData[i + 1] / o.mapScale) * mapDisplay.height, 7, mapContext, true);
                            i += 2;
                        }
                    }
                    // RENDER BOTS:
                    if (bots.length) {
                        bots.forEach((tmp) => {
                            if (tmp.inGame) {
                                mapContext.globalAlpha = 1;
                                mapContext.strokeStyle = "#cc5151";
                                renderCircle((tmp.x2 / o.mapScale) * mapDisplay.width,
                                             (tmp.y2 / o.mapScale) * mapDisplay.height, 7, mapContext, false, true);
                            }
                        });
                    }
                    // DEATH LOCATION:
                    if (lastDeath) {
                        mapContext.fillStyle = "#fc5553";
                        mapContext.font = "34px Hammersmith One";
                        mapContext.textBaseline = "middle";
                        mapContext.textAlign = "center";
                        mapContext.fillText("x", (lastDeath.x / o.mapScale) * mapDisplay.width,
                                            (lastDeath.y / o.mapScale) * mapDisplay.height);
                    }
                    // MAP MARKER:
                    if (mapMarker) {
                        mapContext.fillStyle = "#fff";
                        mapContext.font = "34px Hammersmith One";
                        mapContext.textBaseline = "middle";
                        mapContext.textAlign = "center";
                        mapContext.fillText("x", (mapMarker.x / o.mapScale) * mapDisplay.width,
                                            (mapMarker.y / o.mapScale) * mapDisplay.height);
                    }
                }
            }
            // ICONS:
            let crossHairs = [
                "https://upload.wikimedia.org/wikipedia/commons/thumb/9/95/Crosshairs_Red.svg/1200px-Crosshairs_Red.svg.png",
                "https://cdn.discordapp.com/attachments/1136761235958943806/1213248402825936948/Crosshairs_Red.png?ex=65f4c8a0&is=65e253a0&hm=07565291c663b247ee00fefd50b2bb42453068757384fcef48feca86828c5a5d&"
            ];
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
                    tmpSprite.onload = function () {
                        this.isLoaded = true;
                    };
                    tmpSprite.src = crossHairs[i];
                    crossHairSprites[i] = tmpSprite;
                }
            }
            loadIcons();
            // UPDATE GAME:
            function updateGame() {
                if (o.resetRender) {
                    be.clearRect(0, 0, gameCanvas.width, gameCanvas.height);
                    be.beginPath();
                }
                if (true) {
                    function add(array){
                        let lmao = 0
                        for(let i = 0; i < array.length; i++){
                            lmao += array[i]
                        }
                        return lmao/array.length
                    }

                    // MOVE CAMERA:
                    if (player) {
                        let px = player.x
                        let py = player.y
                        if(near.dist){
                            let ax = []
                            let ay = []
                            for(let i = 0; i < near.enemy.length; i++){
                                ax.push(near.enemy[i].x)
                                ay.push(near.enemy[i].y)
                            }
                            let apx = add(ax)
                            let apy = add(ay)
                            px = (player.x*6 + apx)/7
                            py = (player.y*6 + apy)/7

                        }
                        let tmpDist = UTILS.getDistance(camX, camY, px, py);
                        let tmpDir = UTILS.getDirection(px, py, camX, camY);
                        let camSpd = Math.min(tmpDist * 0.005 * delta, tmpDist);
                        if (tmpDist > 0.05) {
                            camX += camSpd * Math.cos(tmpDir);
                            camY += camSpd * Math.sin(tmpDir);
                        } else {
                            camX = px;
                            camY = py;
                        }
                    } else {
                        camX = o.mapScale / 2;
                        camY = o.mapScale / 2;
                    }



                    /* let tmpDist = UTILS.getDistance(camX, camY, px, py);
                        let tmpDir = UTILS.getDirection(px, py, camX, camY);
                        let camSpd = Math.min(tmpDist * 0.005 * delta, tmpDist);
                        if (tmpDist > 0.05) {
                            camX += camSpd * Math.cos(tmpDir);
                            camY += camSpd * Math.sin(tmpDir);
                        } else {
                            camX = px;
                            camY = py;
                        }*/



                    // INTERPOLATE PLAYERS AND AI:
                    var lastTime = now - (1000 / o.serverUpdateRate);
                    var tmpDiff;
                    for (var i = 0; i < players.length + ais.length; ++i) {
                        _ = players[i]||ais[i-players.length];
                        if (_ && _.visible) {
                            if (_.forcePos) {
                                _.x = _.x2;
                                _.y = _.y2;
                                _.dir = _.d2;
                            } else {
                                var total = _.t2 - _.t1;
                                var fraction = lastTime - _.t1;
                                var ratio = (fraction / total);
                                var rate = 170;
                                _.dt += delta;
                                var tmpRate = Math.min(1.7, _.dt / rate);
                                var tmpDiff = (_.x2 - _.x1);
                                _.x = _.x1 + (tmpDiff * tmpRate);
                                tmpDiff = (_.y2 - _.y1);
                                _.y = _.y1 + (tmpDiff * tmpRate);
                                _.dir = Math.lerpAngle(_.d2, _.d1, Math.min(1.2, ratio));
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
              camX = o.mapScale / 2;
              camY = o.mapScale / 2;
          }*/
                    // RENDER CORDS:
                    let f = camX - (maxScreenWidth / 2);
                    let d = camY - (maxScreenHeight / 2);
                    // RENDER BACKGROUND:
                    if (o.snowBiomeTop - d <= 0 && o.mapScale - o.snowBiomeTop - d >= maxScreenHeight) {
                        be.fillStyle = "#b6db66"; //grass biom
                        be.fillRect(0, 0, maxScreenWidth, maxScreenHeight);
                    } else if (o.mapScale - o.snowBiomeTop - d <= 0) {
                        be.fillStyle = "#dbc666";
                        be.fillRect(0, 0, maxScreenWidth, maxScreenHeight);
                    } else if (o.snowBiomeTop - d >= maxScreenHeight) {
                        be.fillStyle = "#fff";
                        be.fillRect(0, 0, maxScreenWidth, maxScreenHeight);
                    } else if (o.snowBiomeTop - d >= 0) {
                        be.fillStyle = "#fff";
                        be.fillRect(0, 0, maxScreenWidth, o.snowBiomeTop - d);
                        be.fillStyle = "#b6db66";
                        be.fillRect(0, o.snowBiomeTop - d, maxScreenWidth,
                                    maxScreenHeight - (o.snowBiomeTop - d));
                    } else {
                        be.fillStyle = "#b6db66";
                        be.fillRect(0, 0, maxScreenWidth,
                                    (o.mapScale - o.snowBiomeTop - d));
                        be.fillStyle = "#dbc666";
                        be.fillRect(0, (o.mapScale - o.snowBiomeTop - d), maxScreenWidth,
                                    maxScreenHeight - (o.mapScale - o.snowBiomeTop - d));
                    }
                    // RENDER WATER AREAS:
                    if (!firstSetup) {
                        waterMult += waterPlus * o.waveSpeed * delta;
                        if (waterMult >= o.waveMax) {
                            waterMult = o.waveMax;
                            waterPlus = -1;
                        } else if (waterMult <= 1) {
                            waterMult = waterPlus = 1;
                        }
                        be.globalAlpha = 1;
                        be.fillStyle = "#dbc666";
                        renderWaterBodies(f, d, be, o.riverPadding);
                        be.fillStyle = "#91b2db";
                        renderWaterBodies(f, d, be, (waterMult - 1) * 250);
                    }
                    if (player) {
                        // DEATH LOCATION:
                        if (lastDeath) {
                            be.globalAlpha = 1;
                            be.fillStyle = "#fc5553";
                            be.font = "100px Hammersmith One";
                            be.textBaseline = "middle";
                            be.textAlign = "center";
                            be.fillText("", lastDeath.x - f, lastDeath.y - d);
                        }
                        if (pathFind.show) {
                            be.beginPath();
                            be.strokeStyle = "white";
                            be.globalAlpha = 1;
                            be.lineWidth = 4;
                            be.moveTo(player.x - f, player.y - d);
                            for (let i = 0; i < pathFind.paths.length; i++) {
                                let a = pathFind.paths[i];
                                be.lineTo(a.x - f, a.y - d);
                            }
                            be.stroke();
                        }
                    }
                    // RENDER DEAD PLAYERS:
                    if (inWindow && fisrtloadez) {
                        be.globalAlpha = 1;
                        be.strokeStyle = outlineColor;
                        renderDeadPlayers(f, d, Math.random() * Math.PI * 2);
                    }
                    // RENDER BOTTOM LAYER:
                    be.globalAlpha = 1;
                    be.strokeStyle = outlineColor;
                    renderGameObjects(-1, f, d);
                    // RENDER PROJECTILES:
                    be.globalAlpha = 1;
                    be.lineWidth = outlineWidth;
                    renderProjectiles(0, f, d);
                    // RENDER PLAYERS:
                    renderPlayers(f, d, 0);
                    // RENDER AI:
                    be.globalAlpha = 1;
                    for (let i = 0; i < ais.length; ++i) {
                        _ = ais[i];
                        if (_.active && _.visible) {
                            _.animate(delta);
                            be.save();
                            be.translate(_.x - f, _.y - d);
                            be.rotate(_.dir + _.dirPlus - (Math.PI / 2));
                            renderAI(_, be);
                            be.restore();
                        }
                    }
                    // RENDER GAME OBJECTS (LAYERED):
                    renderGameObjects(0, f, d);
                    renderProjectiles(1, f, d);
                    renderGameObjects(1, f, d);
                    renderPlayers(f, d, 1);
                    renderGameObjects(2, f, d);
                    renderGameObjects(3, f, d);
                    // MAP BOUNDARIES:
                    be.fillStyle = "#000";
                    be.globalAlpha = 0.2;
                    if (f <= 0) {
                        be.fillRect(0, 0, -f, maxScreenHeight);
                    } if (o.mapScale - f <= maxScreenWidth) {
                        let tmpY = Math.max(0, -d);
                        be.fillRect(o.mapScale - f, tmpY, maxScreenWidth - (o.mapScale - f), maxScreenHeight - tmpY);
                    } if (d <= 0) {
                        be.fillRect(-f, 0, maxScreenWidth + f, -d);
                    } if (o.mapScale - d <= maxScreenHeight) {
                        let tmpX = Math.max(0, -f);
                        let tmpMin = 0;
                        if (o.mapScale - f <= maxScreenWidth)
                            tmpMin = maxScreenWidth - (o.mapScale - f);
                        be.fillRect(tmpX, o.mapScale - d,
                                    (maxScreenWidth - tmpX) - tmpMin, maxScreenHeight - (o.mapScale - d));
                    }

















                    // RENDER DAY/NIGHT TIME:
                    be.globalAlpha = 1;
                    be.fillStyle = "rgba(0, 0, 40, 0.55)";
                    be.fillRect(0, 0, maxScreenWidth, maxScreenHeight);
                    // RENDER PLAYER AND AI UI:
                    be.strokeStyle = darkOutlineColor;
                    be.globalAlpha = 1;
                    for (let i = 0; i < players.length + ais.length; ++i) {
                        _ = players[i] || ais[i - players.length];
                        if (_.visible) {
                            be.strokeStyle = darkOutlineColor;
                            let trustIconImage = new Image();
                            trustIconImage.src = '';

                            // NAME AND HEALTH:
                            if (_.skinIndex != 10 || (_==player) || (_.team && _.team==player.team)) {
                                let tmpText = (_.team?"["+_.team+"] ":"")+(_.name||"")+(_.isPlayer?" ":"");
                                if (tmpText != "") {
                                    be.font = (_.nameScale||30) + "px Hammersmith One";
                                    be.fillStyle = "#fff";
                                    be.textBaseline = "middle";
                                    be.textAlign = "center";
                                    be.lineWidth = (_.nameScale?11:8);
                                    be.lineJoin = "round";
                                    be.strokeText(tmpText, _.x - f, (_.y - d - _.scale) - o.nameY);
                                    be.fillText(tmpText, _.x - f, (_.y - d - _.scale) - o.nameY);
                                    if (_.isLeader && iconSprites["crown"].isLoaded) {
                                        let tmpS = o.crownIconScale;
                                        let tmpX = _.x - f - (tmpS/2) - (be.measureText(tmpText).width / 2) - o.crownPad;
                                        be.drawImage(iconSprites["crown"], tmpX, (_.y - d - _.scale)
                                                     - o.nameY - (tmpS/2) - 5, tmpS, tmpS);
                                    } if (_.iconIndex == 1 && iconSprites["skull"].isLoaded) {
                                        let tmpS = o.crownIconScale;
                                        let tmpX = _.x - f - (tmpS/2) + (be.measureText(tmpText).width / 2) + o.crownPad;
                                        be.drawImage(iconSprites["skull"], tmpX, (_.y - d - _.scale)
                                                     - o.nameY - (tmpS/2) - 5, tmpS, tmpS);
                                    }

                                    if (_.isPlayer && instaC.wait && near == _ && (_.backupNobull ? crossHairSprites[1].isLoaded : crossHairSprites[0].isLoaded) && enemy.length && !useWasd) {
                                        let tmpS = _.scale * 2.2;
                                        be.drawImage((_.backupNobull ? crossHairSprites[1] : crossHairSprites[0]), _.x - f - tmpS / 2, _.y - d - tmpS / 2, tmpS, tmpS);
                                    }
                                }










                                if (_.health > 0) {

                                    // HEALTH HOLDER:
                                    be.fillStyle = darkOutlineColor;
                                    be.roundRect(_.x - f - o.healthBarWidth - o.healthBarPad, (_.y - d + _.scale) + o.nameY, (o.healthBarWidth * 2) + (o.healthBarPad * 2), 17, 8);
                                    be.fill();

                                    // HEALTH BAR:
                                    be.fillStyle = (_==player||(_.team&&_.team==player.team))?"#8ecc51":"#cc5151";
                                    be.roundRect(_.x - f - o.healthBarWidth, (_.y - d + _.scale) + o.nameY + o.healthBarPad, ((o.healthBarWidth * 2) * (_.health / _.maxHealth)), 17 - o.healthBarPad * 2, 7);
                                    be.fill();



                                    function arrow2(e1,e2,e3, colors, alpha, lineWidth = 0, shownigas) {
                                        let mainCf = shownigas == true ? (_.isPlayer && _ != player) : (_.isPlayer && _.sid != player.sid && !(isAlly(_.sid) && _.sid != player.sid))
                                        let center = {
                                            x: screenWidth / 2,
                                            y: screenHeight / 2,
                                        };
                                        let alpha2 = Math.min(1, (UTILS.getDistance(0, 0, player.x - _.x, (player.y - _.y) * (16 / 9)) * 100) / (o.maxScreenHeight / 2) / center.y);
                                        if (mainCf) {
                                            let distance = Math.hypot(_.y - player.y, _.x - player.x),
                                                G = player.x + distance * 0.5 * Math.cos(Math.atan2(_.y - player.y, _.x - player.x)),
                                                F = player.y + distance * 0.5 * Math.sin(Math.atan2(_.y - player.y, _.x - player.x));
                                            be.save();
                                            be.translate(G - f, F - d);
                                            be.rotate(Math.atan2(_.y - player.y, _.x - player.x) + Math.PI / 2);
                                            be.fillStyle = colors;
                                            be.globalAlpha = alpha == "auto" ? alpha2 : alpha;
                                            be.lineWidth = lineWidth;
                                            be.lineCap = "round";
                                            be.beginPath();
                                            be.strokeStyle = "transparent";
                                            be.moveTo(e1, e1);
                                            be.lineTo(e2, e2);
                                            be.lineTo(-e3, e3);
                                            be.fill();
                                            be.stroke();
                                            be.closePath();
                                            be.restore();
                                        }
                                    }


                                    // Enemy Radar:
                                    if (getEl("visualType").value == "PPL14") {
                                        arrow2(0, 20, 20, "rgba(0,0,0,0.5)", "auto", 6, false);
                                    } else if (getEl("visualType").value == "deter12") {
                                        arrow2(6, 6, 6, "#fff", "auto", 6, false);
                                    }
                                    if (_.isPlayer) {

                                        be.globalAlpha = 1;


                                        // Text:
                                        let shameCn = _.skinIndex == 45 && _.shameTimer > 0 ? _.shameTimer : _.shameCount;
                                        if (true) {
                                            if (_.isPlayer && getEl("visualType").value == "PPL14") {
                                                be.font = "20px Hammersmith One";
                                                be.fillStyle = "#fff";
                                                be.textBaseline = "middle";
                                                be.textAlign = "center";
                                                be.lineWidth = (_.nameScale ? 11 : 8);
                                                be.lineJoin = "round";
                                                be.strokeText(_.sid, _.x - f, (_.y - d - _.scale) + 40);
                                                be.fillText(_.sid, _.x - f, (_.y - d - _.scale) + 40);
                                                be.strokeText(shameCn, _.x - f, (_.y - d - _.scale) + 135);
                                                be.fillText(shameCn, _.x - f, (_.y - d - _.scale) + 135);
                                            }
                                        }

                                        // ReloadBars:
                                        if (true) {

                                            let PAD = 0;
                                            let tmpX = 0;
                                            let BAR = o.healthBarWidth - PAD;
                                            let reloads = {
                                                primary: (_.primaryIndex == undefined ? 1 : ((items.weapons[_.primaryIndex].speed - _.reloads[_.primaryIndex]) / items.weapons[_.primaryIndex].speed)),
                                                secondary: (_.secondaryIndex == undefined ? 1 : ((items.weapons[_.secondaryIndex].speed - _.reloads[_.secondaryIndex]) / items.weapons[_.secondaryIndex].speed)),
                                                turret: (2500 - _.reloads[53]) / 2500
                                            };



                                            if (getEl("visualType").value == "deter12") {
                                                if (!_.currentReloads) {
                                                    _.currentReloads = { // Initialize currentReloads if not already set
                                                        primary: reloads.primary,
                                                        secondary: reloads.secondary,
                                                        turret: reloads.turret
                                                    };
                                                }
                                                const lerpFactor = 0.3;
                                                _.currentReloads.primary = (1 - lerpFactor) * _.currentReloads.primary + lerpFactor * reloads.primary;
                                                _.currentReloads.secondary = (1 - lerpFactor) * _.currentReloads.secondary + lerpFactor * reloads.secondary;
                                                _.currentReloads.turret = (1 - lerpFactor) * _.currentReloads.turret + lerpFactor * reloads.turret;

                                                let primaryReloadProgress = _.primaryIndex !== undefined ? ((items.weapons[_.primaryIndex].speed - _.reloads[_.primaryIndex]) / items.weapons[_.primaryIndex].speed) : 1;
                                                let secondaryReloadProgress = _.secondaryIndex !== undefined ? ((items.weapons[_.secondaryIndex].speed - _.reloads[_.secondaryIndex]) / items.weapons[_.secondaryIndex].speed) : 1;
                                                const centerX = _.x - f;
                                                const centerY = _.y - d;
                                                const barRadius = 35;
                                                const barWidth = 15;
                                                const totalAngle = (Math.PI*2)/3; // Half circle
                                                const secondaryStartAngle = -Math.PI / 2 + Math.PI / 3 + _.dir - Math.PI/2;
                                                const secondaryEndAngle = secondaryStartAngle + (totalAngle * _.currentReloads.secondary);
                                                const primaryStartAngle = Math.PI / 2 + _.dir - Math.PI/2;
                                                const primaryEndAngle = primaryStartAngle + (totalAngle * _.currentReloads.primary);

                                                const turretStartAngle = Math.PI + Math.PI / 4.5 + _.dir - Math.PI/2;
                                                const turretEndAngle = turretStartAngle + (totalAngle/1.25 * _.currentReloads.turret);
                                                function returncoolcolor(RainbowCycle) {
                                                    return `hsl(${RainbowCycle-50}, 64%, 68%, 30)`;
                                                }

                                                be.save();
                                                if (_.currentReloads.primary < 0.999) {
                                                    be.beginPath();
                                                    be.lineCap = 'round';
                                                    be.arc(centerX, centerY, barRadius, primaryStartAngle, primaryEndAngle);
                                                    be.lineWidth = 4;
                                                    be.strokeStyle = returncoolcolor(_.currentReloads.primary * 240);
                                                    be.stroke();
                                                }
                                                if (_.currentReloads.secondary < 0.999) {
                                                    be.beginPath();
                                                    be.lineCap = 'round';
                                                    be.arc(centerX, centerY, barRadius, secondaryStartAngle, secondaryEndAngle);
                                                    be.lineWidth = 4;
                                                    be.strokeStyle = returncoolcolor(_.currentReloads.secondary * 240);
                                                    be.stroke();
                                                }
                                                if (_.currentReloads.turret < 0.999) {
                                                    be.beginPath();
                                                    be.lineCap = 'round';
                                                    be.arc(centerX, centerY, barRadius, turretStartAngle, turretEndAngle);
                                                    be.lineWidth = 4;
                                                    be.strokeStyle = returncoolcolor(_.currentReloads.turret * 240);
                                                    be.stroke();
                                                }
                                                be.restore();

                                            } else if (getEl("visualType").value == "PPL14") {
                                                be.globalAlpha = 1;

                                                let primaryReloadProgress = _.primaryIndex !== undefined ? ((items.weapons[_.primaryIndex].speed - _.reloads[_.primaryIndex]) / items.weapons[_.primaryIndex].speed) : 1;
                                                let secondaryReloadProgress = _.secondaryIndex !== undefined ? ((items.weapons[_.secondaryIndex].speed - _.reloads[_.secondaryIndex]) / items.weapons[_.secondaryIndex].speed) : 1;
                                                let SecReloadColor = _.secondaryIndex == undefined || _.reloads[_.secondaryIndex] == 0 ? "#000" :
                                                `hsl(${200 * (items.weapons[_.secondaryIndex].speed - _.reloads[_.secondaryIndex]) + 153}, 64%, 68%)`;
                                                let PriReloadColor = _.primaryIndex == undefined || _.reloads[_.primaryIndex] == 0 ? "#000" :
                                                `hsl(${200 * (items.weapons[_.primaryIndex].speed - _.reloads[_.primaryIndex]) + 153}, 64%, 68%)`;

                                                const centerX = _.x - f;
                                                const centerY = _.y - d;

                                                const barRadius = 34;
                                                const totalAngle = Math.PI; // Half circle
                                                const secondaryStartAngle = Math.PI * 1.5;
                                                const secondaryEndAngle = secondaryStartAngle + (totalAngle * secondaryReloadProgress);
                                                const primaryStartAngle = Math.PI / 2;
                                                const primaryEndAngle = primaryStartAngle + (totalAngle * primaryReloadProgress);

                                                be.save();
                                                if (primaryReloadProgress < 1) {
                                                    be.beginPath();
                                                    be.lineCap = "round";
                                                    be.arc(centerX, centerY, barRadius, primaryStartAngle, primaryEndAngle);
                                                    be.lineWidth = (player.scale / 8);
                                                    be.strokeStyle = PriReloadColor;
                                                    be.stroke();
                                                }

                                                if (secondaryReloadProgress < 1) {
                                                    be.beginPath();
                                                    be.lineCap = "round";
                                                    be.arc(centerX, centerY, barRadius, secondaryStartAngle + Math.PI * 2, secondaryEndAngle - Math.PI * 2);
                                                    be.lineWidth = (player.scale / 8);
                                                    be.strokeStyle = SecReloadColor;

                                                    be.stroke();
                                                }
                                                be.restore();
                                            }
                                        }
                                    }
                                }
                            }


                        }




                    }

                    // RENDER GAME OBJECTS:
                    function renderGameObjects(layer, f, d) {
                        let tmpSprite;
                        let tmpX;
                        let tmpY;
                        gameObjects.forEach((tmp) => {
                            _ = tmp;
                            if (_.alive) {
                                tmpX = _.x + _.xWiggle - f;
                                tmpY = _.y + _.yWiggle - d;
                                if (layer == 0) {
                                    _.update(delta);
                                }
                                be.globalAlpha = _.alpha;

                                if (_.layer == layer && isOnScreen(tmpX, tmpY, _.scale + (_.blocker || 0))) {
                                    if (_.isItem) {
                                        if ((_.dmg || _.trap) && !_.isTeamObject(player)) {
                                            tmpSprite = getObjSprite(_);
                                        } else {
                                            tmpSprite = getItemSprite(_);
                                        }

                                        be.save();
                                        be.translate(tmpX, tmpY);
                                        be.rotate(_.dir);
                                        if (!_.active) {
                                            be.scale(_.visScale / _.scale, _.visScale / _.scale);
                                        }
                                        be.drawImage(tmpSprite, -(tmpSprite.width / 2), -(tmpSprite.height / 2));

                                        if (_.blocker) {
                                            be.strokeStyle = "#db6e6e";
                                            be.globalAlpha = 0.3;
                                            be.lineWidth = 6;
                                            renderCircle(0, 0, _.blocker, be, false, true);
                                        }
                                        be.restore();
                                    } else {
                                        tmpSprite = getResSprite(_);
                                        be.drawImage(tmpSprite, tmpX - (tmpSprite.width / 2), tmpY - (tmpSprite.height / 2));
                                    }
                                }

                                // BuildHealTh:
                            }
                        });


                        // PLACE VISIBLE:
                        if (layer == 0) {
                            if (placeVisible.length) {
                                placeVisible.forEach((places) => {
                                    tmpX = places.x - f;
                                    tmpY = places.y - d;
                                    markObject(places, tmpX, tmpY);
                                });
                            }
                            if (preplaceVisible.length) {
                                preplaceVisible.forEach((places) => {
                                    tmpX = places.x - f;
                                    tmpY = places.y - d;
                                    ppmarkObject(places, tmpX, tmpY);
                                });
                            }
                        }
                    }
                    function markObject(_, tmpX, tmpY) {
                        getMarkSprite(_, be, tmpX, tmpY);
                    }
                    function ppmarkObject(_, tmpX, tmpY) {
                        ppyen(be, tmpX, tmpY);
                    }

                    function yen(context, x, y) {
                        context.fillStyle = "rgb(255, 0, 0, 0.5)";
                        context.globalAlpha = 0.5;
                        context.beginPath();
                        context.stroke();
                        context.strokeStyle = "red"
                        context.arc(x, y, 40, 0, Math.PI * 2); // Adjust the circle size
                        context.fill();
                        context.stroke();
                        context.strokeStyle = "red"
                        context.closePath();


                        context.globalAlpha = 0.5;
                    }
                    function ppyen(context, x, y) {
                        context.fillStyle = "rgba(255, 0, 0, 0.2)";
                        context.beginPath();
                        context.arc(x, y, 55, 0, Math.PI * 2); // Adjust the circle size
                        context.fill();
                        context.closePath();
                        context.globalAlpha = 1;
                    }
                    // AUTOPUSH LINE:
                    if (my.autoPush) {
                        be.lineWidth = 5;
                        be.globalAlpha = 1;
                        be.beginPath();

                        be.fillStyle = darkOutlineColor;
                        be.strokeStyle = "#fff";
                        be.moveTo(player.x - f, player.y - d);
                        be.lineTo(my.pushData.x2 - f, my.pushData.y2 - d);
                        be.lineTo(my.pushData.x - f, my.pushData.y - d);
                        be.stroke();
                    }
                    be.globalAlpha = 1;
                    // RENDER ANIM TEXTS:
                    textManager.update(delta, be, f, d);
                    // RENDER CHAT MESSAGES:
                    for (let i = 0; i < players.length; ++i) {
                        _ = players[i];
                        if (_.visible) {
                            if (_.chatCountdown > 0) {
                                _.chatCountdown -= delta;
                                if (_.chatCountdown <= 0)
                                    _.chatCountdown = 0;
                                be.font = "32px Hammersmith One";
                                let tmpSize = be.measureText(_.chatMessage);
                                be.textBaseline = "middle";
                                be.textAlign = "center";
                                let tmpX = _.x - f;
                                let tmpY = _.y - _.scale - d - 90;
                                let tmpH = 47;
                                let tmpW = tmpSize.width + 17;
                                be.fillStyle = "rgba(0,0,0,0.2)";
                                be.roundRect(tmpX - tmpW / 2, tmpY - tmpH / 2, tmpW, tmpH, 6);
                                be.fill();
                                be.fillStyle = "#fff";
                                be.fillText(_.chatMessage, tmpX, tmpY);
                            }
                            if (_.chat.count > 0) {
                                if (!useWasd) {
                                    _.chat.count -= delta;
                                    if (_.chat.count <= 0)
                                        _.chat.count = 0;
                                    be.font = "32px Hammersmith One";
                                    let tmpSize = be.measureText(_.chat.message);
                                    be.textBaseline = "middle";
                                    be.textAlign = "center";
                                    let tmpX = _.x - f;
                                    let tmpY = _.y - _.scale - d + (90 * 2);
                                    let tmpH = 47;
                                    let tmpW = tmpSize.width + 17;
                                    be.fillStyle = "rgba(0,0,0,0.2)";
                                    be.roundRect(tmpX - tmpW / 2, tmpY - tmpH / 2, tmpW, tmpH, 6);
                                    be.fill();
                                    be.fillStyle = "#ffffff99";
                                    be.fillText(_.chat.message, tmpX, tmpY);
                                } else {
                                    _.chat.count = 0;
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
                                be.font = "20px Hammersmith One";
                                let tmpSize = be.measureText(ch.chat);
                                be.textBaseline = "middle";
                                be.textAlign = "center";
                                let tmpX = ch.owner.x - f;
                                let tmpY = ch.owner.y - ch.owner.scale - d - 90;
                                let tmpH = 47;
                                let tmpW = tmpSize.width + 17;
                                be.globalAlpha = ch.alpha;
                                be.fillStyle = ch.owner.isTeam(player) ? "rgba(255,215,0,1)" : "#cc5151";
                                be.strokeStyle = "rgb(25, 25, 25)";
                                be.lineWidth = 5;
                                be.fillStyle = "rgba(0,0,0,0.4)";
                                be.strokeStyle = "rgba(0,0,0,0.0)";
                                be.roundRect(tmpX - tmpW / 2, tmpY - tmpH / 2, tmpW, tmpH, 6);
                                be.stroke();
                                be.fill();
                                be.fillStyle = "#fff";
                                be.strokeStyle = "#000";
                                be.strokeText(ch.chat, tmpX, tmpY);
                                be.fillText(ch.chat, tmpX, tmpY);
                                ch.y -= delta / 100;
                            }
                        });
                    }
                }
                be.globalAlpha = 1;
                // RENDER MINIMAP:
                renderMinimap(delta);
            }
            // UPDATE & ANIMATE:
            window.requestAnimFrame = function() {
                return null;
            }
            let ms = {
                avg: 0,
                max: 0,
                min: 0,
            }
            window.rAF = (function() {
                return window.requestAnimationFrame ||
                    window.webkitRequestAnimationFrame ||
                    window.mozRequestAnimationFrame ||
                    function(callback) {
                    window.setTimeout(callback, 1000 / 240);
                };
            })();
            let trackedFPS = null;
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
                    if (trackedFPS === null && fpsTimer.ltime >= 58) {
                        trackedFPS = UTILS.round(fpsTimer.ltime, 10);
                    }
                }
                fpsTimer.time++;
                updateGame();
                rAF(doUpdate);
            }
            prepareMenuBackground();
            doUpdate();
            function toggleUseless(boolean) {
                //getEl("instaType").disabled = boolean;
                //getEl("antiBullType").disabled = boolean;
                //getEl("visualType").disabled = boolean;
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
            window.tryConnectBots = function() {
                for (let i = 0; i < (bots.length < 3 ? 3 : 4); i++) {
                    window.grecaptcha.execute("6LevKusUAAAAAAFknhlV8sPtXAk5Z5dGP5T2FYIZ", {
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
                o.anotherVisual = !o.anotherVisual;
                gameObjects.forEach((tmp) => {
                    if (tmp.active) {
                        tmp.dir = tmp.lastDir;
                    }
                });
            };
            window.prepareUI = function(_) {
                resize();


                function closeChat() {
                    chatBox.value = "";
                    chatHolder.style.display = "none";
                }
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
                                tmpContext.drawImage(this, -(tmpCanvas.width * tmpMlt * o.iconPad * tmpPad) / 2, -(tmpCanvas.height * tmpMlt * o.iconPad) / 2,
                                                     tmpCanvas.width * tmpMlt * tmpPad * o.iconPad, tmpCanvas.height * tmpMlt * o.iconPad);
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
                                selectWeapon(_.weapons[items.weapons[i].type]);
                            });
                            UTILS.hookTouchEvents(tmpUnit);
                        } else {
                            let tmpSprite = getItemSprite(items.list[i - items.weapons.length], true);
                            let tmpScale = Math.min(tmpCanvas.width - o.iconPadding, tmpSprite.width);
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
                                selectToBuild(_.items[_.getItemType(i - items.weapons.length)]);
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
                    name = name.slice(0, o.maxNameLength);
                    name = name.replace(/[^\w:\(\)\/? -]+/gmi, " "); // USE SPACE SO WE CAN CHECK PROFANITY
                    name = name.replace(/[^\x00-\x7F]/g, " ");
                    name = name.trim();
                    let langFilter = {
                        "list": [
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


