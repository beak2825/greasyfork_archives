// ==UserScript==
// @name         Insane mod
// @version      1
// @description  its trash
// @author       wat, Ze_-Q
// @match        *://moomoo.io/*
// @match        *://*.moomoo.io/*
// @icon         https://i.pinimg.com/originals/e7/16/8c/e7168c4f7f17259966b665b776e66389.jpg
// @grant        none
// @license       MIT
// @namespace https://greasyfork.org/users/1258400
// @downloadURL https://update.greasyfork.org/scripts/508017/Insane%20mod.user.js
// @updateURL https://update.greasyfork.org/scripts/508017/Insane%20mod.meta.js
// ==/UserScript==

let icon = document.getElementById("leaderboardButton");
icon.classList.add('material-icons');
icon.textContent = 'format_list_bulleted';
icon.style.fontSize = '35px';
icon.style.verticalAlign = 'middle';

let treeAlphaState = [];

const removeSnowflakes = () => {
    const snowflakes = document.querySelectorAll('.snowflake');
    snowflakes.forEach(snowflake => {
        snowflake.parentNode.removeChild(snowflake);
    });
};

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
snowflakeContainer.style.display = "none";
document.body.appendChild(snowflakeContainer);
const maxSnowflakes = 40;
for (let i = 0; i < maxSnowflakes; i++) {
    const snowflake = createSnowflake();
    if (Math.random() > 0.7) {
        snowflake.classList.add("fast-fall");
    }
    snowflakeContainer.appendChild(snowflake);
}

//selectSkinColor(6);

var newElement = document.createElement('div');
newElement.className = 'newMenuText';
newElement.innerHTML = 'Credits To ';

var newLink = document.createElement('a');
newLink.href = 'https://www.youtube.com/channel/UCy8bEUAgqfr3VSsuAun-oZA';
newLink.target = '_blank';
newLink.className = 'menuLinkMS';
newLink.textContent = 'Morning Star';

newElement.appendChild(newLink);

var existingElement = document.querySelector('.menuLink');

existingElement.parentNode.insertBefore(newElement, existingElement.nextSibling);

document.getElementById("storeHolder").style = "height: 1500px; width: 450px;"

var moomooVer = moomooVer = $('#linksContainer2 .menuLink').html()

let blur = document.createElement("div");
document.body.append(blur);
blur.style.position = "absolute";
blur.style.display = "block";
blur.style.pointerEvents = "none";
blur.style.backgroundColor = "rgba(0, 0, 0, 0.1)";
blur.style.backdropFilter = "blur(5px)";
blur.style.top = "0%";
blur.style.opacity = "0";
blur.style.width = "100%";
blur.style.height = "100%";
blur.style.zIndex = "10000";
blur.style.transition = "all 1s";

document.getElementById("mainMenu").style.backgroundImage = "url('https://i.redd.it/l9t4f48hit771.jpg')";
document.getElementById("mainMenu").style.backgroundSize = "100vw 100vh";

const container = document.createElement('div');
container.id = 'fadeOutContainer';
document.body.appendChild(container);

document.addEventListener('keydown', function(event) {
    if (event.key === 'Tab') {
        event.preventDefault();
    }
    if (event.key === 'F5') {
        event.preventDefault();
    }
});

function onBoxMouseOver() {
    this.style.transform = 'scale(1.05)';
    this.style.transition = 'all 0.7s ease-in-out';
}

function onBoxMouseLeave() {
    this.style.transition = 'all 0.7s ease-in-out';
    this.style.transform = 'scale(1)';
}
var RainbowCycle = 0, useWasd = false, cycle = 0, HPBarColor = "black", NameBarColor = "black";

function onEnterGameMouseOver() {
    const enterGameBox = document.getElementById('enterGame');
    enterGameBox.style.backgroundColor = 'rgba(255, 255, 0, 0.2)';
    enterGameBox.style.borderRadius = '20px';
    enterGameBox.style.transition = 'all 0.7s ease-in-out';
}

function onEnterGameMouseLeave() {
    const enterGameBox = document.getElementById('enterGame');
    enterGameBox.style.backgroundColor = 'rgba(153, 50, 204, 0.3)';
    enterGameBox.style.borderRadius = '15px';
    enterGameBox.style.transition = 'all 0.7s ease-in-out';
}
let menuLink = document.querySelector('.menuLink');
let menuText = document.querySelector('.menuText');
let DeskTopInstructions = document.getElementById("desktopInstructions");

if(menuText) {
    menuText.textContent = ``
}
let skinColorHolder = document.getElementById('skinColorHolder');

skinColorHolder.style.marginBottom = '15px';
if(DeskTopInstructions) {
    DeskTopInstructions.textContent = ''
}
if (menuLink) {
    menuLink.href = 'https://www.youtube.com/channel/UCWhYj1mtBGanJVNjMJwFIYQ';
    menuLink.textContent = 'ZeQ';
}
const boxes = document.querySelectorAll('.menuCard');
boxes.forEach(box => {
    box.style.transition = 'transform 1s ease';
    box.addEventListener('mouseenter', onBoxMouseOver);
    box.addEventListener('mouseleave', onBoxMouseLeave);
});
let hideSelectors = [
    '.menuHeader',
]
for ( let i = 0; i < hideSelectors.length; i++ ) {
    $(hideSelectors[i]).hide();
}

const enterGameBox = document.getElementById('enterGame');
enterGameBox.addEventListener('mouseenter', onEnterGameMouseOver);
enterGameBox.addEventListener('mouseleave', onEnterGameMouseLeave);

$('.menuCard').css({'white-space': 'normal',
                    'text-align': 'center',
                    'background-color': 'rgba(0, 0, 0, 0.7)',
                    '-moz-box-shadow': '0px 0px rgba(255, 255, 255, 0)',
                    '-webkit-box-shadow': '0px 0px rgba(255, 255, 255, 0)',
                    'box-shadow': '0px 0px rgba(255, 255, 255, 1)',
                    '-webkit-border-radius': '0px',
                    '-moz-border-radius': '0px',
                    'border-radius': '15px',
                    'margin': '10px',
                    'margin-top': '5px',
                    'scrollbar-width': 'none',
                    'max-height': '240px'
                   })

$("#killCounter").hide();
$("#chatButton").remove();
document.querySelector("#joinPartyButton").remove();
document.querySelector("#pre-content-container").remove();

let MaxKills = 0, packetsShown = false, MenuRangeIsTrue = false, stopUp = true, MenuEqualizer, MenuNight = 35, chatPing = false, canMusic1 = true, canMusic2 = true, checkEnemy = false, EnemyDist = false, showAim = false, pAB = true, spikePlace = true, MenuRangeIsTrue2 = false, ae86Dir = false;

let antiSync = false,
    topInfoHolder = true,
    myObjectHealth = "#5f9ea0",
    enemyObjectHealth = "#ff6363",
    Fo = -1,
    second = -1,
    highestArr = [],
    highestMs = -1,
    averageArr = [],
    averageMs = -1,
    damageTextColor = "#fff",
    healTextColor = "#8ecc51",
    useHack = true,
    log = console.log,
    testMode = window.location.hostname == "127.0.0.1",
    ChPath = 90;

const nameInputElement = document.getElementById("nameInput");
if (nameInputElement) {
    nameInputElement.style.color = "#333";
}
document.getElementById('promoImgHolder').style.display = "none";
document.getElementById('promoImgHolder').innerHTML =
    `
  <style>
  #top-wrap-right { color: #333;
  } .check-box {transform: scale(1.1);
  } .inParty {display: none;
  } input[type="checkbox"] { position: relative; appearance: none; width: 33px; height: 15.5px; border-radius: 50px; box-shadow: inset 0 0 5px rgba(41, 41, 41, 0.8); cursor: pointer; top: 7.5px; transition: 0.7s;
  } input:checked[type="checkbox"] { background: rgba(51, 51, 51);
  } input[type="checkbox"]::after { position: absolute; content: ""; width: 15.5px; height: 15.5px; top: 0; left: 0; background: #fff; border-radius: 50%; box-shadow: 0 0 5px rgba(0, 0, 0, 0.2); transform: scale(1.1); transition: 0.7s;
  } input:checked[type="checkbox"]::after { left: 50%; }
  </div><br>
  `
document.getElementById("enterGame").addEventListener("click", autohide);
function autohide() {
    $("#ot-sdk-btn-floating").hide();
}
$('#subConfirmationElement').click( () => {
    try { window.follmoo(); } catch(e){};
    localStorage["moofoll"] = "1"; localStorage["moofol"] = "1";
});
$("#gameName").css({
    color: "white",
    "text-shadow": "0 3px 0 #181818, 0 6px 0 #181818, 0 9px 0 #181818, 0 12px 0 #181818, 0 15px 0 #181818, 0 18px 0 #181818, 0 21px 0 #181818, 0 24px 0 #181818, 0 27px 0 #181818, rgba(0, 0, 0, 0.4) 1px 1px 40px",
    "text-align": "center",
    "transform": "scaleY(0.9)",
    "font-size": "140px",
    "margin-bottom": "-5px",
});
$('#linksContainer2').remove();
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
            if (d.length === 0 || c === undefined || f === undefined) return;
            for (let i = 0; i < y; i++) {
                if (d.length === 0) return;
                if (p) i = 0;
                const t = d[0];
                const n = h[t];
                if (n !== undefined) {
                    if (n.openList.size() !== 0) {
                        const e = n.openList.pop();

                        if (n.endX !== e.x || n.endY !== e.y) {
                            if (e.y > 0) T(n, e, 0, -1, b(e.x, e.y - 1));
                            if (e.x < c[0].length - 1) T(n, e, 1, 0, b(e.x + 1, e.y));
                            if (e.y < c.length - 1) T(n, e, 0, 1, b(e.x, e.y + 1));
                            if (e.x > 0) T(n, e, -1, 0, b(e.x - 1, e.y));

                            if (v) {
                                if (e.x > 0 && e.y > 0 && (a || g(c, f, e.x, e.y - 1, e) && g(c, f, e.x - 1, e.y, e))) {
                                    T(n, e, -1, -1, s * b(e.x - 1, e.y - 1));
                                }
                                if (e.x < c[0].length - 1 && e.y < c.length - 1 && (a || g(c, f, e.x, e.y + 1, e) && g(c, f, e.x + 1, e.y, e))) {
                                    T(n, e, 1, 1, s * b(e.x + 1, e.y + 1));
                                }
                                if (e.x < c[0].length - 1 && e.y > 0 && (a || g(c, f, e.x, e.y - 1, e) && g(c, f, e.x + 1, e.y, e))) {
                                    T(n, e, 1, -1, s * b(e.x + 1, e.y - 1));
                                }
                                if (e.x > 0 && e.y < c.length - 1 && (a || g(c, f, e.x, e.y + 1, e) && g(c, f, e.x - 1, e.y, e))) {
                                    T(n, e, -1, 1, s * b(e.x - 1, e.y + 1));
                                }
                            }
                        } else {
                            const o = [];
                            o.push({ x: e.x, y: e.y });
                            let r = e.parent;
                            while (r !== null) {
                                o.push({ x: r.x, y: r.y });
                                r = r.parent;
                            }
                            o.reverse();
                            n.callback(o);
                            delete h[t];
                            d.shift();
                        }
                    } else {
                        n.callback(null);
                        delete h[t];
                        d.shift();
                    }
                } else {
                    d.shift();
                }
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
            config.clientSendRate = 9;
            config.serverUpdateRate = 9;
            config.deathFadeout = 0;
            config.isSandbox = window.location.hostname == "sandbox.moomoo.io";
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
            }]
            config.anotherVisual = true;
            config.anotherVisualTurn = false;
            config.autobot = false;
            config.useWebGl = false;
            config.resetRender = true;
            function waitTime(timeout) {
                return new Promise((done) => {
                    setTimeout(() => {
                        done();
                    }, timeout);
                });
            }
            let changed = false;
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
                    AutoUpgrade: true,
                    killChat: false,
                    AutoBuy: true,
                    RealDir: true,
                };
            }
            function setConfigs3() {
                return {
                    AutoBullSpam: false,
                    SoldierMode: false,
                    AutoPush: true,
                    AntiPh: false,
                };
            }
            function setConfigs4() {
                return {
                };
            }
            function setConfigs7() {
                return {
                    LeaderBoard: true,
                    RenderPl: true,
                    BuildHp: true,
                    Visuals: true,
                };
            }
            let configs = setConfigs();
            let configs3 = setConfigs3();
            let configs4 = setConfigs4();
            let configs7 = setConfigs7();
            window.removeConfigs = function() {
                for (let cF in configs) {
                    deleteVal(cF, configs[cF]);
                }
                for (let cF in configs3) {
                    deleteVal(cF, configs3[cF]);
                }
                for (let cF in configs4) {
                    deleteVal(cF, configs4[cF]);
                }
                for (let cF in configs7) {
                    deleteVal(cF, configs7[cF]);
                }
            };
            for (let cF in configs) {
                configs[cF] = gC(cF, configs[cF]);
            }
            for (let cF in configs3) {
                configs3[cF] = gC(cF, configs3[cF]);
            }
            for (let cF in configs4) {
                configs4[cF] = gC(cF, configs4[cF]);
            }
            for (let cF in configs7) {
                configs7[cF] = gC(cF, configs7[cF]);
            }
            window.debug = function() { };
            window.toggleNight = function() { };
            window.toggleVisual = function() { };
            window.prepareUI = function() { };
            window.leave = function() { };
            window.ping = 0;
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
                range(setting) {
                    let newRangeInput = document.createElement('input');
                    newRangeInput.setAttribute('type', 'range');
                    setting.id && newRangeInput.setAttribute('id', setting.id);
                    setting.class && newRangeInput.setAttribute('class', setting.class);
                    setting.min && newRangeInput.setAttribute('min', setting.min);
                    setting.max && newRangeInput.setAttribute('max', setting.max);
                    setting.value && newRangeInput.setAttribute('value', setting.value);
                    this.element.appendChild(newRangeInput);
                }
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
                        };
                        this.checkBox({ id: "check_" + options, style: `display: ${i == 0 ? "inline-block" : "none"};`, class: "checkB", onclick: `window.${options + "Func"}()`, checked: setting.menu[options] });
                        i++;
                    }
                    last = "check_" + getEl(setting.id).value.split("_")[1];
                    window[setting.id + "Func"] = function() {
                        getEl(last).style.display = "none";
                        last = "check_" + getEl(setting.id).value.split("_")[1];
                        getEl(last).style.display = "inline-block";
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

            let SimpleGrids = 18, Players = 90;
            const parentElement = document.getElementById('topInfoHolder');
            const childElement = document.getElementById('killCounter');

            if (parentElement && childElement) {
                parentElement.removeChild(childElement);
                document.body.appendChild(childElement);
            }
            let HTML = new Html();
            let menuDiv = document.createElement("div");
            menuDiv.id = "menuDiv";
            document.body.appendChild(menuDiv);
            HTML.set("menuDiv");
            HTML.resetHTML();
            HTML.setCSS(`
body {
    will-change: transform;
}
#pingDisplay {
    display: none;
}
.menuCard {
    border-radius: 10px;
}
#itemInfoHolder {
    transition: all 1s ease-in-out;
}
#fadeOutContainer {
    font-size: 15px;
    height: 20px;
    position: fixed;
    opacity: 0;
    transition: all 2s;
	padding: 5px;
	background-color: rgba(0, 0, 0, 0.25);
	-webkit-border-radius: 4px;
	-moz-border-radius: 4px;
	border-radius: 4px;
	color: white;
	padding: 5px;
    z-index: 10000000;
    padding-top: 7px;
    padding-right: 10px;
	pointer-events: none;
}
.yellowText {
    color: yellow;
}

.redText {
    color: red;
}

.whiteText {
    color: white;
}

#scoreDisplay {
    bottom: 150px;
}
#mapDisplay {
    height: 120px;
    width: 120px;
    border-radius: 9px;
    backdrop-filter: blur(4px);
}

#leaderboardButton {
    backdrop-filter: blur(4px);
    display: block;
    border-radius: 9px;
    width: 35px;
    height: 35px;
    left: 20px;
    top: auto;
    bottom: 205px;
    border: none;
    user-select: none;
    z-index: 99999999;
}
  .loader {
  position: absolute;
  top:110%;
  left:46%;
    border: 16px solid white;
    border-radius: 50%;
    border-top: 16px solid black;
    box-shadow: 0 0 10px 10px rgba(0, 0, 0, 0.4);
    width: 60px;
    height: 60px;
    -webkit-animation: spin 0.5s linear infinite;
    animation: spin 0.5s linear infinite;
  }
  @-webkit-keyframes spin {
    0% { -webkit-transform: rotate(0deg); }
    100% { -webkit-transform: rotate(360deg); }
  }

  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }

  @keyframes rainbow {
    0% { filter: hue-rotate(0deg) }
    100% { filter: hue-rotate(360deg) }
  }

.menuClass {
    position: absolute;
    opacity: 0;
    color: #fff;
    font-size: 31px;
    text-align: left;
    padding: 10px;
    padding-top: 7px;
    padding-bottom: 5px;
    -webkit-border-radius: 4px;
    -moz-border-radius: 4px;
    border-radius: 10px;
    background-color: rgba(20, 20, 20, 0.85);
    transition: all 1s ease-in-out;
    z-index: 100000;
    overflow-x: hidden;
    scrollbar-width: none;
    border: 2px solid grey;
}
.newMenuText {
    font-size: 18px !important;
    color: #a8a8a8 !important;
    margin-top: 10px !important;
}
.menuLinkMS {
    font-size: 18px !important;
}

.newMenuText2 {
    font-size: 18px !important;
    color: #a8a8a8 !important;
    margin-top: 10px !important;
}
.menuLinkK {
    font-size: 18px !important;
}

.menuClassBest {
    position: absolute;
    opacity: 0;
    color: #fff;
    font-size: 31px;
    text-align: left;
    padding: 10px;
    padding-top: 7px;
    padding-bottom: 5px;
    -webkit-border-radius: 4px;
    -moz-border-radius: 4px;
    border-radius: 10px;
    background-color: rgba(30, 30, 30);
    transition: all 1s ease-in-out;
    z-index: 1000000;
    overflow: hidden;
    border: 2px solid grey;
}

.menuClassBest {
    left: 475px;
    top: 50%;
    transform: translate(0, -50%);
    width: 180px;
}
.menuClass.moveRight {
    left: 675px;
}
.menuClass {
    left: 475px;
    top: 50%;
    transform: translate(0, -50%);
    width: 450px;
}

.menuC {
    color: #fff;
    font-family: "Hammersmith One";
    font-size: 12px;
    overflow-y: scroll;
    -webkit-touch-callout: none;
    -webkit-user-select: none;
    -khtml-user-select: none;
    -moz-user-select: none;
    -ms-user-select: none;
    user-select: none;
    overflow-x: hidden;
    scrollbar-width: none;
}
.menuCBest {
    color: #fff;
    font-family: "Hammersmith One";
    font-size: 12px;
    overflow-y: scroll;
    -webkit-touch-callout: none;
    -webkit-user-select: none;
    -khtml-user-select: none;
    -moz-user-select: none;
    -ms-user-select: none;
    user-select: none;
    height: 325px;
}
.menuC {
    height: 325px;
}


#storeButton,
#allianceButton {
   right: 20px;
   border-radius: 9px;
   backdrop-filter: blur(4px);
}

#allianceButton {
    top: auto;
    bottom: 360px;
}

#storeButton {
    top: auto;
    bottom: 300px;
}
.betaLow {
    background: white;
    -webkit-background-clip: text;
    color: transparent;
    position: absolute;
    font-size: 13px;
    text-shadow: 0 0 10px rgba(200, 200, 200, 0.2);
}

#SoBetaLow {
    top: 2px;
    right: 5px;
}

#killCounter {
	right: inherit;
    bottom: 185px;
	right: 20px;
    border-radius: 9px;
    backdrop-filter: blur(4px);
}

.actionBarItem {
    border-radius: 9px;
    backdrop-filter: blur(4px);
}

#enterGame {
    background-color: rgba(153, 50, 204, 0.3);
    border-radius: 15px;
    transition: all 0.7s ease-in-out;
}

#noticationDisplay {
	right: 20px;
	bottom: 245px;
	top: auto;
}

#foodDisplay,
#woodDisplay,
#stoneDisplay,
#scoreDisplay {
    border-radius: 9px;
    backdrop-filter: blur(4px);
}

#upgradeHolder,
#upgradeCounter {
    transition: 2s;
}

#topInfoHolder {
    transition: all 1s ease-in-out;
}

#leaderboard {
    border-radius: 13px;
    backdrop-filter: blur(4px);
}

.menuB {
    text-align: center;
    background-color: transparent;
    color: #fff;
    -webkit-border-radius: 4px;
    -moz-border-radius: 4px;
    border-radius: 4px;
    border: 2px solid #000;
    cursor: pointer;
}

.menuB:hover {
    border: 2px solid #fff;
}

.menuB:active {
    color: rgb(25, 25, 25);
    background-color: rgb(200, 200, 200);
}

.customText {
    color: #000;
    -webkit-border-radius: 5px;
    -moz-border-radius: 5px;
    border-radius: 5px;
    border: 2px solid #000;
}

.customText:focus {
    background-color: yellow;
}

.checkB {
    position: relative;
    top: 2px;
    accent-color: #888;
    cursor: pointer;
}

.menuoP {
    background: black;
    width: 100%;
    heigth: 30px;
}

.slider {
    -webkit-appearance: none;
    appearance: none;
    width: 180px;
    height: 10px;
    background: #d3d3d3;
    outline: none;
    opacity: 0.7;
    -webkit-transition: .2s;
    transition: opacity .2s;
    border-radius: 5px;
}

.slider:hover {
    opacity: 1;
}

.slider::-webkit-slider-thumb {
    -webkit-appearance: none;
    appearance: none;
    width: 15px;
    height: 15px;
    background: #614CAF;
    cursor: pointer;
    border-radius: 50%;
}

#gameUI {
    transition: all 1s;
}

#menuMoon {
    background-color: rgba(50, 50, 50, 0);
    color: rgba(221, 212, 179, 0.9);
    user-select: none;
    border: none;
    overflow: hidden;
    transition: all 1s;
    top: 285px;
    left: 60px;
    transform: translate(-50%);
    position: absolute;
    font-size: 30px;
    outline: none;
    pointer-events: none;
}
#menuSun {
    background-color: transparent;
    color: rgba(216, 250, 8, 0.8);
    user-select: none;
    border: none;
    overflow: hidden;
    transition: all 1s;
    top: 285px;
    left: 140px;
    transform: translate(-50%);
    position: absolute;
    outline: none;
    font-size: 30px;
    pointer-events: none;
}

#menuId1 {
    background-color: transparent;
    color: rgba(128, 128, 128);
    user-select: none;
    border: none;
    overflow: hidden;
    transition: all 1s;
    top: 45px;
    left: 20px;
    position: absolute;
    font-size: 35px;
    outline: none;
}
#menuId6 {
    background-color: transparent;
    color: rgba(128, 128, 128);
    user-select: none;
    border: none;
    overflow: hidden;
    transition: all 1s;
    top: 200px;
    outline: none;
    left: 160px;
    transform: translate(-50%);
    position: absolute;
    font-size: 35px;
}
#menuId7 {
    background-color: transparent;
    color: rgba(128, 128, 128);
    user-select: none;
    border: none;
    overflow: hidden;
    transition: all 1s;
    outline: none;
    top: 200px;
    left: 40px;
    transform: translate(-50%);
    position: absolute;
    font-size: 35px;
}
#menuId3 {
    font-size: 40px;
    background-color: transparent;
    color: rgba(128, 128, 128);
    user-select: none;
    border: none;
    overflow: hidden;
    outline: none;
    transition: all 1s;
    top: 120px;
    left: 15px;
    position: absolute;
}
#menuclose {
    font-size: 25px;
    background-color: transparent;
    color: rgba(180, 180, 180);
    user-select: none;
    border: none;
    overflow: hidden;
    outline: none;
    transition: all 1s;
    top: 5px;
    right: 0px;
    position: absolute;
}
#menuId4 {
    background-color: transparent;
    color: rgba(128, 128, 128);
    user-select: none;
    border: none;
    overflow: hidden;
    outline: none;
    transition: all 1s;
    top: 120px;
    right: 15px;
    position: absolute;
    font-size: 40px;
}
#menuId5 {
    background-color: transparent;
    color: rgba(128, 128, 128);
    user-select: none;
    border: none;
    overflow: hidden;
    outline: none;
    transition: all 1s;
    top: 45px;
    right: 15px;
    position: absolute;
    font-size: 40px;
}
#menuId1:hover,
#menuId3:hover,
#menuId4:hover,
#menuId5:hover,
#menuId6:hover,
#menuclose:hover,
#menuId7:hover {
    color: white;
}

.slider::-moz-range-thumb {
    width: 15px;
    height: 15px;
    background: #614CAF;
    cursor: pointer;
    border-radius: 50%;
}

.Cselect {
    -webkit-border-radius: 4px;
    -moz-border-radius: 4px;
    border-radius: 5px;
    background-color: rgba(75, 75, 75, 0.5);
    color: #fff;
    border: 1px solid #000;
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
            HTML.startDiv({ style: "font-size: 28px; color: #ffffff", id: "menuHeadLineBest", class: "menuClassBest" }, (html) => {
                HTML.addDiv({ id: "menuBestEz", class: "menuCBest", appendID: "menuHeadLineBest" }, (html) => {
                    HTML.addDiv({ id: "SoBetaLow", class: "betaLow", appendID: "menuHeadLineBest" }, (html) => {
                        html.add(`Permision`);
                    });
                    HTML.addDiv({ style: "font-size: 20px;", appendID: "menuBestEz" }, (html) => {
                        html.add(`Settings`);
                    });
                    html.button({ id: "menuId1", class: "material-icons", innerHTML: `gps_fixed`, onclick: "window.changeMenu()" });
                    HTML.addDiv({ style: "font-size: 15px; margin-left: 10px; margin-top: 55px; position: fixed;", appendID: "menuBestEz" }, (html) => {
                        html.add(`Combat`);
                    });
                    HTML.addDiv({ style: "font-size: 15px; margin-left: 129px; margin-top: 55px; position: fixed;", appendID: "menuBestEz" }, (html) => {
                        html.add(`Visual`);
                    });
                    html.button({ id: "menuId3", class: "material-icons", innerHTML: `equalizer`, onclick: "window.changeMenu3()" });
                    HTML.addDiv({ style: "font-size: 15px; margin-left: 10px; margin-top: 135px; position: fixed;", appendID: "menuBestEz" }, (html) => {
                        html.add(`Range`);
                    });
                    html.button({ id: "menuId4", class: "material-icons", innerHTML: `extension`, onclick: "window.changeMenu4()" });
                    HTML.addDiv({ style: "font-size: 15px; margin-left: 132px; margin-top: 135px; position: fixed;", appendID: "menuBestEz" }, (html) => {
                        html.add(`Misc`);
                    });
                    html.button({ id: "menuId5", class: "material-icons", innerHTML: `remove_red_eye`, onclick: "window.changeMenu2()" });
                    html.button({ id: "menuId6", class: "material-icons", innerHTML: `library_music`, onclick: "window.changeMenu6()" });
                    HTML.addDiv({ style: "font-size: 15px; margin-left: 130px; margin-top: 210px; position: fixed;", appendID: "menuBestEz" }, (html) => {
                        html.add(`Music`);
                    });
                    html.button({ id: "menuId7", class: "material-icons", innerHTML: `build`, onclick: "window.changeMenu7()" });
                    HTML.addDiv({ style: "font-size: 15px; margin-left: 15px; margin-top: 210px; position: fixed;", appendID: "menuBestEz" }, (html) => {
                        html.add(`Build`);
                    });
                    html.button({ id: "menuMoon", class: "material-icons", innerHTML: `brush` });
                    HTML.addDiv({ style: "font-size: 15px; margin-left: 70px; margin-top: 250px; position: fixed;", appendID: "menuBestEz" }, (html) => {
                        html.checkBox({ id: "lightmode", class: "checkB", checked: false });
                    });
                    html.button({ id: "menuSun", class: "material-icons", innerHTML: `wb_sunny` });
                });
            })
            HTML.startDiv({ style: "font-size: 28px; color: #ffffff", id: "menuHeadLine", class: "menuClass" }, (html) => {
                html.button({ id: "menuclose", class: "material-icons", innerHTML: `close`, onclick: "window.closeMenu()" });
                HTML.addDiv({ id: "menuRange", class: "menuC", appendID: "menuHeadLine" }, (html) => {
                    HTML.addDiv({ style: "font-size: 20px; color: #E2E2E3; background-size: 20px 20px; background-repeat: no-repeat;", appendID: "menuRange" }, (html) => {
                        html.add(`Combat: `);
                        html.newLine();
                    });
                    HTML.addDiv({ style: "font-size: 15px; color: #fff; background-size: 25px 25px; background-repeat: no-repeat;", appendID: "menuRange" }, (html) => {
                        html.add('Main Hat Type: ');
                        html.select({
                            id: "mainHat",
                            class: "Cselect",
                            option: {
                                'Spike Gear': {
                                    id: 'spikegear',
                                },
                                'Emp Gear': {
                                    id: 'empgear',
                                },
                                'Soldier': {
                                    id: 'soldier',
                                    selected: true
                                },
                            }
                        });
                        html.newLine();
                        html.add(`Auto: `);
                        html.selectMenu({ id: "configsChanger3", class: "Cselect", menu: configs3 });
                        html.newLine();
                        html.add(`Avoid Functions: `);
                        html.checkBox({ id: "testavoidspikes", class: "checkB", checked: true });
                        html.newLine();
                        html.add(`CxC Wings: `);
                        html.checkBox({ id: "wingscxc", class: "checkB", checked: true });
                        html.newLine(2);
                        HTML.addDiv({ style: "font-size: 19px; color: #E2E2E3; background-size: 20px 20px; background-repeat: no-repeat;", appendID: "menuRange" }, (html) => {
                            html.add(`Accessibility: `);
                            html.newLine();
                        });
                        HTML.addDiv({ style: "font-size: 15px; color: #fff; background-size: 25px 25px; background-repeat: no-repeat;", appendID: "menuRange" }, (html) => {
                            html.add(`AutoInsta: `);
                            html.text({ id: "AIWithS", class: "customText", value: "5", size: "1em", maxLength: "2" }); html.add(` `);
                            html.text({ id: "AIWithoutS", class: "customText", value: "5", size: "1em", maxLength: "2" }); html.add(` `);
                            html.checkBox({ id: "autoinsta", class: "checkB", checked: true });
                            html.newLine();
                            html.add(`Path Finder: `);
                            html.checkBox({ id: "pathfind", class: "checkB", checked: false });
                            html.newLine();
                        });
                    });
                    HTML.addDiv({ id: "menu6", style: "display: none", class: "menuC", appendID: "menuHeadLine" }, (html) => {
                        HTML.addDiv({ style: "font-size: 20px; color: #E2E2E3; background-size: 20px 20px; background-repeat: no-repeat;", appendID: "menu6" }, (html) => {
                            html.add(`Music: `);
                            html.newLine();
                        });
                        HTML.addDiv({ style: "font-size: 15px; color: #fff; background-size: 25px 25px; background-repeat: no-repeat;", appendID: "menu6" }, (html) => {
                            html.add(`Chat Music:`);
                            html.checkBox({ id: "music1", class: "checkB", checked: false });
                            html.newLine();
                            html.add(`Chat Music 2:`);
                            html.checkBox({ id: "music2", class: "checkB", checked: false });
                            html.newLine();
                        });
                    })
                    HTML.addDiv({ id: "menu7", style: "display: none", class: "menuC", appendID: "menuHeadLine" }, (html) => {
                        HTML.addDiv({ style: "font-size: 20px; color: #E2E2E3; background-size: 20px 20px; background-repeat: no-repeat;", appendID: "menu7" }, (html) => {
                            html.add(`Build: `);
                        });
                        HTML.addDiv({ style: "font-size: 15px; color: #fff; background-size: 25px 25px; background-repeat: no-repeat;", appendID: "menu7" }, (html) => {
                            html.add('Auto Place Type: ');
                            html.select({
                                id: "placertypes",
                                class: "Cselect",
                                option: {
                                    'Spike': {
                                        id: 'spikesPlace',
                                    },
                                    'Trap': {
                                        id: 'trapsPlace',
                                        selected: true
                                    },
                                }
                            });
                            html.newLine();
                            html.add(`Weapon Grinder: `);
                            html.checkBox({ id: "weapongrind", class: "checkB", checked: false });
                            html.newLine();
                            html.add(`Auto Replace: `);
                            html.checkBox({ id: "autoreplace", class: "checkB", checked: true });
                            html.newLine();
                            html.add(`Auto Place: `);
                            html.checkBox({ id: "autoplace", class: "checkB", checked: true });
                            html.newLine();
                            html.add(`Pre Place: `);
                            html.checkBox({ id: "preplace", class: "checkB", checked: true });
                            html.newLine();
                            html.add(`Anti Trap:`);
                            html.checkBox({ id: "antitrap", class: "checkB", checked: true });
                            html.newLine();
                        });
                    })
                    HTML.addDiv({ id: "menu2", style: "display: none", class: "menuC", appendID: "menuHeadLine" }, (html) => {
                        HTML.addDiv({ style: "font-size: 20px; color: #E2E2E3; background-size: 20px 20px; background-repeat: no-repeat;", appendID: "menu2" }, (html) => {
                            html.add(`Visual: `);
                            html.newLine();
                        });
                        HTML.addDiv({ style: "font-size: 15px; color: #fff; background-size: 25px 25px; background-repeat: no-repeat;", appendID: "menu2" }, (html) => {
                            html.add('Tracers Type: ');
                            html.select({
                                id: "tracersvalue",
                                class: "Cselect",
                                option: {
                                    'None': {
                                        id: '',
                                    },
                                    'Tracers Me': {
                                        id: 'tracersMe',
                                    },
                                    'Tracers For': {
                                        id: 'tracersFor',
                                    },
                                    'Tracers Them': {
                                        id: 'tracersThem',
                                        selected: true,
                                    },
                                }
                            });
                            html.newLine();
                            html.add(`Type: `);
                            html.selectMenu({ id: "configsChanger6", class: "Cselect", menu: configs7 });
                            html.newLine();
                            html.add('Camera: ');
                            html.select({
                                id: "visualTypeZoom",
                                class: "Cselect",
                                option: {
                                    'Camera +': {
                                        id: 'Cam+',
                                    },
                                    'Camera 0': {
                                        id: 'Cam0',
                                    },
                                    'Camera 1': {
                                        id: 'Cam1',
                                        selected: true
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
                            html.add(`Nick Name: `);
                            html.checkBox({id: "nickname", class: "checkB", checked: true});
                            html.newLine();
                            html.add(`Health Bar: `);
                            html.checkBox({id: "healthbar", class: "checkB", checked: true});
                            html.newLine();
                            html.add(`Equalizer:`);
                            html.checkBox({ id: "equalizer", class: "checkB", checked: false });
                            html.newLine();
                            html.add(`Snow: `);
                            html.checkBox({id: "cansnow", class: "checkB", checked: false});
                            html.newLine();
                        });
                        html.newLine();
                    })
                    HTML.addDiv({ id: "menu3", style: "display: none", class: "menuC", appendID: "menuHeadLine" }, (html) => {
                        HTML.addDiv({ style: "font-size: 20px; color: #E2E2E3; background-size: 20px 20px; background-repeat: no-repeat;", appendID: "menu3" }, (html) => {
                            html.add(`Range: `);
                            html.newLine();
                        });
                        HTML.addDiv({ style: "font-size: 15px; color: #fff; background-size: 25px 25px; background-repeat: no-repeat;", appendID: "menu3" }, (html) => {
                            html.add(`Equalizer: `);
                            html.range({ id: 'menuequalizer', class: 'slider', min: '0', max: '100', value: '45' });
                            html.add(` `);
                            html.button({ class: "menuB", innerHTML: "45", onclick: "window.ResetThis()" });
                            html.newLine();
                            html.add(`Players: `);
                            html.range({ id: 'players', class: 'slider', min: '10', max: '100', value: '90' });
                            html.add(` `);
                            html.button({ class: "menuB", innerHTML: "90", onclick: "window.ResetPlayers()" });
                            html.newLine();
                            html.add(`Night: `);
                            html.range({ id: 'menunight', class: 'slider', min: '30', max: '70', value: '35' });
                            html.add(` `);
                            html.button({ class: "menuB", innerHTML: "35", onclick: "window.ResetNight()" });
                            html.newLine();
                            html.add(`Grids: `);
                            html.range({ id: 'slider', class: 'slider', min: '0', max: '50', value: '18' });
                            html.add(` `);
                            html.button({ class: "menuB", innerHTML: "18", onclick: "window.ResetGrids()" });
                            html.newLine();
                        });
                    });
                    HTML.addDiv({ id: "menu4", style: "display: none", class: "menuC", appendID: "menuHeadLine" }, (html) => {
                        HTML.addDiv({ style: "font-size: 20px; color: #E2E2E3; background-size: 20px 20px; background-repeat: no-repeat;", appendID: "menu4" }, (html) => {
                            html.add(`Misc: `);
                            html.newLine();
                        });
                        HTML.addDiv({ style: "font-size: 15px; color: #fff; background-size: 25px 25px; background-repeat: no-repeat;", appendID: "menu4" }, (html) => {
                            html.add(`Configs: `);
                            html.selectMenu({ id: "configsChanger", class: "Cselect", menu: configs });
                            html.newLine();
                            html.add(`Smooth Health: `);
                            html.checkBox({id: "smoothhealth", class: "checkB", checked: false});
                            html.newLine();
                            html.add(`Assassin Gear: `);
                            html.checkBox({ id: "invismode", class: "checkB", checked: false });
                            html.newLine();
                            html.add(`Wheel Zoom: `);
                            html.checkBox({ id: "zoomgg", class: "checkB", checked: false });
                            html.newLine();
                            html.add(`Health: `);
                            html.checkBox({ id: "heal", class: "checkB", checked: true });
                            html.newLine();
                            html.add(`Sync: `);
                            html.checkBox({ id: "mapsync", class: "checkB", checked: true });
                            html.newLine();
                        });

                    });
                });

            });
            let trueM = true;
            let AntiBull = false;
            let bultect = false;
            let instaType = true;
            let crossHair = true;
            let plaguemask = true;

            window.changeMenu2 = function() {
                getEl("menuRange").style.display = "none";
                getEl("menu3").style.display = "none";
                getEl("menu2").style.display = "block";
                getEl("menu4").style.display = "none";
                getEl("menu6").style.display = "none";
                getEl("menu7").style.display = "none";
            };
            window.changeMenu3 = function() {
                getEl("menuRange").style.display = "none";
                getEl("menu3").style.display = "block";
                getEl("menu2").style.display = "none";
                getEl("menu4").style.display = "none";
                getEl("menu6").style.display = "none";
                getEl("menu7").style.display = "none";
            };
            window.changeMenu = function() {
                getEl("menuRange").style.display = "block";
                getEl("menu3").style.display = "none";
                getEl("menu2").style.display = "none";
                getEl("menu4").style.display = "none";
                getEl("menu6").style.display = "none";
                getEl("menu7").style.display = "none";
            };
            window.changeMenu4 = function() {
                getEl("menuRange").style.display = "none";
                getEl("menu3").style.display = "none";
                getEl("menu2").style.display = "none";
                getEl("menu4").style.display = "block";
                getEl("menu6").style.display = "none";
                getEl("menu7").style.display = "none";
            };
            window.changeMenu6 = function() {
                getEl("menuRange").style.display = "none";
                getEl("menu3").style.display = "none";
                getEl("menu2").style.display = "none";
                getEl("menu4").style.display = "none";
                getEl("menu6").style.display = "block";
                getEl("menu7").style.display = "none";
            };
            window.changeMenu7 = function() {
                getEl("menuRange").style.display = "none";
                getEl("menu3").style.display = "none";
                getEl("menu2").style.display = "none";
                getEl("menu4").style.display = "none";
                getEl("menu6").style.display = "none";
                getEl("menu7").style.display = "block";
            };

            let mStatus = document.createElement("div");
            mStatus.id = "status";
            getEl("gameUI").appendChild(mStatus);
            HTML.set("status");
            HTML.resetHTML();
            HTML.setCSS(`
            .sizing {
                display: block;
                position: absolute;
                color: white;
                font-family: 'Hammersmith One';
                top: 20px;
                left: 50%;
                transform: translateX(-50%);
            }
            .mod {
                font-size: 12px;
                display: inline-block;
            }
            `);
            HTML.startDiv({ id: "happymod", class: "sizing" }, (html) => {
                HTML.addDiv({ id: "pingFps", class: "mod", appendID: "happymod" }, (html) => {
                });
                HTML.addDiv({ style: "margin-left: 4px", id: "maxping", class: "mod", appendID: "happymod" }, (html) => {
                });
                HTML.addDiv({ style: "margin-left: 4px", id: "fps", class: "mod", appendID: "happymod" }, (html) => {
                });
                //HTML.addDiv({ style: "margin-left: 4px", id: "packet", class: "mod", appendID: "happymod" }, (html) => {});
            });

            let menuChatDiv = document.createElement("div");
            menuChatDiv.id = "menuChatDiv";
            document.body.appendChild(menuChatDiv);
            HTML.set("menuChatDiv");
            HTML.setStyle(`
            position: absolute;
            opacity: 0;
            transform: translate(-50%, -50%);
            left: 50%;
            top: 50%;
            border: 1px solid grey;
            transition: all 1s;
            backdrop-filter: blur(0px);
            border-radius: 15px;
            `);
            HTML.resetHTML();
            HTML.setCSS(`
.chDiv {
    color: #fff;
    border-radius: 15px;
    padding: 10px;
    width: 700px;
    height: 400px;
    background-color: rgba(0, 0, 0, 0.5);
    box-shadow: none;
    font-family: "Courier New", monospace;
    5px 5px 15px rgba(0, 0, 0, 0.35);
    transition: all 3s ease-in-out;
}
.chMainDiv {
    font-family: "Ubuntu";
    font-size: 16px;
    max-height: 375px;
    overflow-y: scroll;
    -webkit-touch-callout: none;
    -webkit-user-select: none;
    -khtml-user-select: none;
    -moz-user-select: none;
    -ms-user-select: none;
    user-select: none;
    overflow-x: hidden;
    scrollbar-width: none;
}

`);
            HTML.startDiv({
                id: "mChDiv",
                class: "chDiv",
            }, (html) => {
                HTML.addDiv({ style: "font-size: 25px; color: #fff;", appendID: "mChDiv" }, (html) => {
                    html.add(`Chat Log`);
                });
                HTML.addDiv({
                    id: "mChMain",
                    class: "chMainDiv",
                    appendID: "mChDiv"
                }, (html) => {
                });
            });

            let menuChats = getEl("mChMain");
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
                a.style.fontSize = '15px';

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
            function resetMenuChText() {
                menuChats.innerHTML = ``;
                menuChCounts = 0;
            }
            resetMenuChText();
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
                    let data = new Uint8Array(message);
                    let parsed = window.msgpack.decode(data);
                    let type = parsed[0];
                    data = parsed[1];
                    if (type == "6") {

                        if (data[0]) {
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

                            data[0] = data[0].slice(0, 30);
                        }
                    } else if (type == "L") {
                        data[0] = data[0] + (String.fromCharCode(0).repeat(7));
                        data[0] = data[0].slice(0, 7);
                    } else if (type == "M") {
                        data[0].name = (data[0].name == "" ? "unknown" : data[0].name);
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
                let data = Array.prototype.slice.call(arguments, 1);
                let binary = window.msgpack.encode([type, data]);
                WS.send(binary);
            }
            function origPacket(type) {
                let data = Array.prototype.slice.call(arguments, 1);
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
                    3: setPlayerTeam,
                    4: setAlliancePlayers,
                    5: updateStoreItems,
                    6: ChatSee,
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
            let allChats = [];
            let ais = [];
            let players = [];
            let alliances = [];
            let alliancePlayers = [];
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
                reSync: false,
                InstaAim: false,
                bullTick: 0,
                anti0Tick: 0,
                SpikeAim: false,
                TrapAim: false,
                MillAim: false,
                antiSync: false,
                TeleAim: false,
                canHat: true,
                canMove: true,
                BullAim: false,
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
            let chatButton = getEl("chatButton");
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
            let maxScreenWidth = config.maxScreenWidth * parseFloat(1);
            let maxScreenHeight = config.maxScreenHeight * parseFloat(1);
            maxScreenHeight = config.maxScreenHeight;
            maxScreenWidth = config.maxScreenWidth;
            function zoomVision() {
                if (maxScreenWidth != config.maxScreenWidth * parseFloat(1) || maxScreenHeight != config.maxScreenHeight * parseFloat(1)) {
                    maxScreenWidth = config.maxScreenWidth * parseFloat(1);
                    maxScreenHeight = config.maxScreenHeight * parseFloat(1);
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
            let outlineWidthRender = 4.5;
            let outlineColorRender = "#F9830D";
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
            let profanityList = [];
            class Utils {
                constructor() {
                    let mathABS = Math.abs,
                        mathCOS = Math.cos,
                        mathSIN = Math.sin,
                        mathPOW = Math.pow,
                        mathSQRT = Math.sqrt,
                        mathATAN2 = Math.atan2,
                        mathPI = Math.PI;
                    let _this = this;
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
                constructor() {
                    this.init = function(x, y, scale, speed, life, text, color) {
                        this.x = x;
                        this.y = y;
                        this.color = color;
                        this.scale = scale;
                        this.startScale = this.scale;
                        this.maxScale = scale * 1.0;
                        this.scaleSpeed = 0.7;
                        this.speed = speed;
                        this.life = life;
                        this.text = text;
                    };

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

                    this.render = function(ctxt, xOff, yOff) {
                        ctxt.lineWidth = 10;
                        ctxt.fillStyle = this.color;
                        ctxt.font = this.scale + "px " + (config.anotherVisual ? "Hammersmith One" : "Ubuntu");
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
                constructor() {
                    this.texts = [];
                    this.stack = [];
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
                    this.changeHealth = function(amount, doer) {
                        this.health += amount;
                        return (this.health <= 0);
                    };
                    this.getScale = function(sM, ig) {
                        sM = sM || 1;
                        return this.scale * ((this.isItem || this.type == 2 || this.type == 3 || this.type == 4) ?
                                             1 : (0.6 * sM)) * (ig ? 1 : this.colDiv);
                    };
                    this.visibleToPlayer = function(player) {
                        return !(this.hideFromEnemy) || (this.owner && (this.owner == player ||
                                                                        (this.owner.team && player.team == this.owner.team)));
                    };
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
                            if (config.anotherVisualTurn) {
                                if (!this.dmg) {
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
                                if (this.turnSpeed) {
                                    this.turnSpeed = 0.001;
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
                    this.isTeamObject = function(tmpObj) {
                        return this.owner == null ? true : (this.owner && tmpObj.sid == this.owner.sid || tmpObj.findAllianceBySid(this.owner.sid));
                    };
                }
            }
            class Items {
                constructor() {
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
                        turnSpeed: 0.001,
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
                    for (let i = 0; i < this.list.length; ++i) {
                        this.list[i].id = i;
                        if (this.list[i].pre) this.list[i].pre = i - this.list[i].pre;
                    }
                    if (typeof window !== "undefined") {
                        function shuffle(a) {
                            for (let i = a.length - 1; i > 0; i--) {
                                const j = Math.floor(Math.random() * (i + 1));
                                [a[i], a[j]] = [a[j], a[i]];
                            }
                            return a;
                        }
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
                    this.disableObj = function(obj) {
                        obj.active = false;
                    };
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
                    this.disableBySid = function(sid) {
                        let find = findObjectBySid(sid);
                        if (find) {
                            this.disableObj(find);
                        }
                    };
                    this.removeAllItems = function(sid, server) {
                        gameObjects.filter((tmp) => tmp.active && tmp.owner && tmp.owner.sid == sid).forEach((tmp) => this.disableObj(tmp));
                    };
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
                    this.addProjectile = function (x, y, dir, range, speed, indx, owner, ignoreObj, layer, inWindow) {
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
                constructor(ais, AI, players, items, objectManager, config, UTILS, scoreCallback, server) {
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

                    this.spawn = function (x, y, dir, index) {
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


                    this.init = function (x, y, dir, index, data) {
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
                    this.animate = function (delta) {
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

                    this.startAnim = function () {
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
                        this.poisonTick = 0;
                        this.bullTick = 0;
                        this.setPoisonTick = false;
                        this.setBullTick = false;
                        this.antiTimer = 4;
                    };
                    this.resetMoveDir = function() {
                        this.moveDir = undefined;
                    };
                    this.resetResources = function(moofoll) {
                        for (let i = 0; i < config.resourceTypes.length; ++i) {
                            this[config.resourceTypes[i]] = moofoll ? 100 : 0;
                        }
                    };
                    this.getItemType = function(id) {
                        let findindx = this.items.findIndex((ids) => ids == id);
                        if (findindx != -1) {
                            return findindx;
                        } else {
                            return items.checkItem.index(id, this.items);
                        }
                    };
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
                            plaguemask = true;
                        } else {
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
                    this.startAnim = function(didHit, index) {
                        this.animTime = this.animSpeed = items.weapons[index].speed;
                        this.targetAngle = (didHit ? -config.hitAngle : -Math.PI);
                        tmpRatio = 0;
                        animIndex = 0;
                    };
                    this.canSee = function(other) {
                        if (!other) return false;
                        let dx = Math.abs(other.x - this.x) - other.scale;
                        let dy = Math.abs(other.y - this.y) - other.scale;
                        return dx <= (config.maxScreenWidth / 2) * 1.3 && dy <= (config.maxScreenHeight / 2) * 1.3;
                    };
                    /*this.judgeShame = function() {
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
                    };*/
                    this.judgeShame = function () {
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
                    this.isTeam = function(tmpObj) {
                        return (this == tmpObj || (this.team && this.team == tmpObj.team));
                    };
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
                                        if (getEl("weapongrind").checked) {
                                            for (let i = 0; i < Math.PI * 2; i += Math.PI / 2) {
                                                checkPlace(player.getItemType(22), i);
                                            }
                                        }
                                    }
                                    if (this.reloads[this.primaryIndex] < 1 || this.reloads[this.weaponIndex] < 1) {
                                        this.antiBull++;
                                        game.tickBase(() => {
                                            this.antiBull = 0;
                                        }, 1);
                                    }
                                }
                            }
                        }
                    };
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
            function Equip(hat, acc) {
                buyEquip(hat, 0);
                buyEquip(acc, 0);
            }
            function buyEquip(id, index) {
                let nID = player.skins[6] ? (enemy.length && near.dist2 <= 230) ? detectHatReturn(6) : 0 : 0;
                if (player.alive && inGame) {
                    if (index == 0) {
                        if (player.skins[id]) {
                            if (player.latestSkin != id) {
                                packet("c", 0, id, 0);
                            }
                        } else {
                            if (configs.AutoBuy) {
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
                        if (player.tails[id]) {
                            if (player.latestTail != id) {
                                packet("c", 0, id, 1);
                            }
                        } else {
                            if (configs.AutoBuy) {
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
            function toRadian(angle) {
                let fixedAngle = (angle % 360) * (Math.PI / 180);
                return fixedAngle < 0 ? (2 * Math.PI + fixedAngle) : fixedAngle;
            }

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
                        if (rmd && configs7.RenderPl) {
                            placeVisible.push({
                                x: tmpX,
                                y: tmpY,
                                name: item.name,
                                scale: item.scale,
                                dir: rad
                            });
                            game.tickBase(() => {
                                placeVisible.shift();
                            }, 1);
                            game.tickBase(() => {
                                placeVisible.shift();
                            }, 3);
                        }

                    }
                } catch (e) { }
            }

            function getDist(e, t) {
                try {
                    return Math.sqrt(((t.y2 || t.y) - (e.y2 || e.y))**2 + ((t.x2 || t.x) - (e.x2 || e.x))**2);
                } catch (e) {
                    return Infinity;
                }
            }
            function getDir(e, t) {
                try {
                    return Math.atan2((t.y2 || t.y) - (e.y2 || e.y), (t.x2 || t.x) - (e.x2 || e.x));
                } catch (e) {
                    return 0;
                }
            }
            function sortFromSmallest(arr, func) {
                func = typeof func == "function" ? func : (obj) => {
                    return obj
                };
                return arr.sort((two, one) => (func(two)) - func(one));
            }
            function getCloseBuildings() {
                let buildings = [];
                let addedBefore = {};
                let filteredBuildings = objectManager.getGridArrays(player.x, player.y, 200);
                for (var x = 0; x < filteredBuildings.length; ++x) {
                    for (var y = 0; y < filteredBuildings[x].length; ++y) {
                        if (filteredBuildings[x][y].active) {
                            buildings.push(filteredBuildings[x][y]);
                        }
                    }
                }
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
                                if (getDist(building, position) < item.scale + range) {
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
                                if (getDist(building, position) < item.scale + range) {
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
            function checkPlace(id, rad) {
                try {
                    let item = items.list[player.items[id]];
                    let tmpS = player.scale + item.scale + (item.placeOffset || 0);
                    let tmpX = player.x2 + tmpS * Math.cos(rad);
                    let tmpY = player.y2 + tmpS * Math.sin(rad);
                    if (objectManager.checkItemLocation(tmpX, tmpY, item.scale, 0.6, item.id, false, player)) {
                        place(id, rad, 1);
                    }
                } catch (e) {}
            }
            function FastPlace(id, rad) {
                try {
                    place(id, rad, 1);
                } catch (e) {}
            }
            function soldierMult() {
                return player.skinIndex == 6 ? 0.75 : 1;
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
                    place(0, getAttackDir());
                }
            }
            function healthBased() {
                if (player.health == 100 || autoQ)
                    return 0;
                if (checkHealth) {
                    if (player.skinIndex != 6) {
                        return Math.ceil((100 - player.health) / items.list[player.items[0]].healing);
                    } else {
                        if (player.health >= 65 && player.health < 100) return 1;

                        if (player.health >= 30 && player.health < 65) return 2;

                        if (player.health >= 0 && player.health < 30) return 3;
                    }
                }
                return 0;
            }
            let checkHealth = function() {
                return player.skinIndex != 45 && getEl("heal").checked && !autoQ;
            }
            function calcDmg(value) {
                return value * player.skinIndex == 6 ? 0.75 : 1;
            }
            function antiSyncHealing(timearg) {
                my.antiSync = true;
                let healAnti = setInterval(() => {
                    if (player.shameCount < 6) {
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
            function isPositionValid(position) {
                const playerX = player.x2;
                const playerY = player.y2;
                const distToPosition = Math.sqrt((position[0] - playerX)**2 + (position[1] - playerY)**2);
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
                const dist = Math.sqrt((position1[0] - position2[0])**2 + (position1[1] - position2[1])**2);
                return dist < minDistance;
            }
            function CheckSnowBiome() {
                if (player.y2 <= config.snowBiomeTop) {
                    return true;
                } else {
                    return false;
                }
            }
            function SpeedMill() {
                if ((player.skinIndex == 12 && player.tailIndex == 11 && player.weaponIndex == 7)) {
                    return 1;
                }else {
                    return player.tailIndex == 11 ? ((CheckSnowBiome() && player.skinIndex != 15) || (player.weaponIndex == 10 || player.weaponIndex == 5 || player.weaponIndex == 3)) ? 3 : 2 : ((CheckSnowBiome() && player.skinIndex != 15) || (player.weaponIndex == 10 || player.weaponIndex == 5 || player.weaponIndex == 5)) ? 4 : 3;
                }
            }

            function biomeGear(mover, returns) {
                if (player.y2 >= config.mapScale / 2 - config.riverWidth / 2 && player.y2 <= config.mapScale / 2 + config.riverWidth / 2) {
                    if (returns) return 31;
                    buyEquip(31, 0);
                    if(near.dist2 <= 250) {
                        buyEquip(Wings, 1);
                    } else {
                        buyEquip(tails, 1);
                    }
                } else {
                    if (configs3.SoldierMode) {
                        detectHat(6);
                        if(near.dist2 <= near.dist2 <= 250) {
                            buyEquip(Wings, 1);
                        } else {
                            buyEquip(tails, 1);
                        }
                    } else {
                        if ((near.dist2 > 350 || !enemy.length) && !getEl("invismode").checked) {
                            if (player.y2 <= config.snowBiomeTop) {
                                if (returns) return mover && player.moveDir == undefined ? 22 : 15;
                                buyEquip(mover && player.moveDir == undefined ? 22 : 15, 0);
                            } else {
                                if (returns) return mover && player.moveDir == undefined ? 22 : 12;
                                buyEquip(mover && player.moveDir == undefined ? 22 : 12, 0);
                            }
                            buyEquip(tails, 1);
                        } else {
                            if(getEl("invismode").checked) {
                                if(player.moveDir == undefined) {
                                    if(player.health < 100 && (near.dist2 >= 270 || !enemy.length)) {
                                        if(player.health < 89) {
                                            healer();
                                        }
                                        detectHat(6);
                                    }else {
                                        buyEquip(56, 0);
                                    }
                                } else {
                                    detectHat(6);
                                }
                                if(near.dist2 <= 250) {
                                    buyEquip(Wings, 1);
                                }
                            } else if(near.dist2 <= 450) {
                                if (player.y2 <= config.snowBiomeTop) {
                                    if (returns) return mover && player.moveDir == undefined ? detectHatReturn(6) : detectHatReturn(6);
                                    buyEquip(mover && player.moveDir == undefined ? detectHatReturn(6) : detectHatReturn(6), 0);
                                } else {
                                    if (returns) return mover && player.moveDir == undefined ? detectHatReturn(6) : detectHatReturn(6);
                                    buyEquip(mover && player.moveDir == undefined ? detectHatReturn(6) : detectHatReturn(6), 0);
                                }
                                if(near.dist2 <= 260) {
                                    buyEquip(Wings, 1);
                                } else {
                                    buyEquip(tails, 1);
                                }
                            }
                        }
                    }
                }
                if (returns) return 0;
            }
            function EmpGear(mover, returns) {
                if (player.y2 >= config.mapScale / 2 - config.riverWidth / 2 && player.y2 <= config.mapScale / 2 + config.riverWidth / 2) {
                    if (returns) return 31;
                    buyEquip(31, 0);
                } else {
                    if ((near.dist2 <= 250 && enemy.length) || traps.inTrap || true) {
                        detectHat(6);
                    } else {
                        detectHat(22);
                    }
                }
                if (returns) return 0;
            }
            function SmartTail() {
                if (near.dist2 <= 260 && enemy.length) {
                    buyEquip(Wings, 1);
                } else {
                    buyEquip(tails, 1);
                }
            }
            function detectHatReturn(index) {
                if (player.skins[26]) {
                    if (near.weaponIndex == 7 && near.dist2 <= items.weapons[player.weapons[0]].range + near.scale * 1.8 && traps.canHit()) {
                        return 26;
                    } else {
                        if (getEl("mainHat").value == "spikegear") {
                            return 11;
                        } else if (getEl("mainHat").value == "empgear") {
                            return 22;
                        } else {
                            return index;
                        }
                    }
                } else {
                    if (getEl("mainHat").value == "spikegear") {
                        return 11;
                    } else if (getEl("mainHat").value == "empgear") {
                        return 22;
                    } else {
                        return index;
                    }

                    if (near.weaponIndex == 7 && !player.skins[26] && player.points >= 8000) {
                        storeBuy(26, 0);
                    }
                }
            }
            function detectHat(index) {
                if (player.skins[26]) {
                    if (near.weaponIndex == 7 && near.dist2 <= items.weapons[player.weapons[0]].range + near.scale * 1.8 && traps.canHit()) {
                        buyEquip(26, 0);
                    } else {
                        if (getEl("mainHat").value == "spikegear") {
                            buyEquip(11, 0);
                        } else if (getEl("mainHat").value == "empgear") {
                            buyEquip(22, 0);
                        } else {
                            buyEquip(index, 0);
                        }
                    }
                } else {
                    if (getEl("mainHat").value == "spikegear") {
                        buyEquip(11, 0);
                    } else if (getEl("mainHat").value == "empgear") {
                        buyEquip(22, 0);
                    } else {
                        buyEquip(index, 0);
                    }

                    if (near.weaponIndex == 7 && !player.skins[26]) {
                        if (player.points >= 8000) {
                            storeBuy(26, 0);
                        }
                    }
                }
            }
            class Node {
                constructor(x, y){
                    this.x = x;
                    this.y = y;
                    this.g = 0;
                    this.h = 0;
                    this.f = 0;
                    this.parent = null;
                }
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
                    this.testCanPlace = function (id, first = -(Math.PI / 2), repeat = (Math.PI / 2), plus = (Math.PI / 18), radian, replacer, yaboi) {
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
                                        sM = sM||1;
                                        return this.scale * ((this.isItem||this.type==2||this.type==3||this.type==4)
                                                             ?1:(0.6*sM)) * (ig?1:this.colDiv);
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
                                            spikePlace = true;
                                            place(2, relAim, 1);
                                        } else {
                                            spikePlace = false;
                                            player.items[4] == 15 && place(4, relAim, 1);
                                        }
                                    } else {
                                        if (UTILS.getAngleDist(near.aim2, relAim) <= config.gatherAngle / 1.5) {
                                            spikePlace = true;
                                            place(2, relAim, 1);
                                        } else {
                                            spikePlace = false;
                                            player.items[4] == 15 && place(4, relAim, 1);
                                        }
                                    }
                                } else {
                                    place(id, relAim, 1);
                                    if (id == 2) {
                                        spikePlace = true;
                                    } else {
                                        spikePlace = false;
                                    }
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
                                if (near.dist2 <= items.weapons[player.weapons[0]].range + (player.scale * 1.8)) {
                                    instaC.canSpikeTick = true;
                                }
                            }
                        } catch (err) {
                        }
                    };
                    this.protect = function (aim) {
                        if (checkEnemy) {
                            if (spikePlace && EnemyDist) {
                                this.testCanPlace(2, -(Math.PI / 2), (Math.PI / 2), (Math.PI / 18), aim + Math.PI);
                            } else {
                                for (let i = Math.PI / 1.5; i < Math.PI * 2; i += Math.PI / 1.5) {
                                    player.items[4] == 15 && this.testCanPlace(4, -(Math.PI / 2), (Math.PI / 2), (Math.PI / 18), aim + Math.PI);
                                }
                            }
                        }
                        this.antiTrapped = true;
                    };
                    this.canHit = function() {
                        const trap1 = gameObjects
                        .filter((e) => e.trap && e.active)
                        .sort((a, b) => UTILS.getDist(a, near, 0, 2) - UTILS.getDist(b, near, 0, 2))
                        .find((trap) => {
                            const trapDist = Math.sqrt((trap.y - near.y2)**2 + (trap.x - near.x2)**2);
                            return (
                                trap !== player &&
                                (player.sid === trap.owner.sid || findAllianceBySid(trap.owner.sid)) &&
                                trapDist <= 50
                            );
                        });
                        return !trap1;
                    }
                    this.cantHit = function() {
                        const trap1 = gameObjects
                        .filter((e) => e.trap && e.active)
                        .sort((a, b) => UTILS.getDist(a, near, 0, 2) - UTILS.getDist(b, near, 0, 2))
                        .find((trap) => {
                            const trapDist = Math.sqrt((trap.y - near.y2)**2 + (trap.x - near.x2)**2);
                            return (
                                trap !== player &&
                                (player.sid === trap.owner.sid || findAllianceBySid(trap.owner.sid)) &&
                                trapDist <= 50
                            );
                        });
                        return trap1;
                    }
                    this.checkSpikeTick = function() {
                        try {
                            if (![3, 4, 5].includes(near.primaryIndex)) return false;
                            if (my.autoPush ? false : near.primaryIndex == undefined ? true : (near.reloads[near.primaryIndex] > game.tickRate)) return false;
                            if (near.dist2 <= items.weapons[near.primaryIndex || 5].range + (near.scale * 1.8)) {
                                let item = items.list[9];
                                let tmpS = near.scale + item.scale + (item.placeOffset || 0);
                                let danger = 0;
                                let counts = {
                                    attempts: 0,
                                    block: `unblocked`
                                };
                                for (let i = -1; i <= 1; i += 1/10) {
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
                                    player.chat.count = 2000;
                                    return true;
                                }
                            }
                        } catch (err) {
                            return null;
                        }
                        return false;
                    }
                    function getEnemyVelocity(near) {
                        return Math.sqrt(near.xVel * near.xVel + near.yVel * near.yVel);
                    }

                    function getEnemyDirection(near) {
                        return Math.atan2(near.yVel, near.xVel);
                    }
                    UTILS.deg2rad = function (degrees) {
                        return degrees * (Math.PI / 180);
                    }

                    this.autoPlace = function () {
                        if (secPacket >= 90) return;
                        let MIN_TRAP_DISTANCE;
                        MIN_TRAP_DISTANCE = 250;
                        const SPIKE_RADIUS = 45;
                        const SPIKE_ANGLE_INCREMENT = Math.PI / 24;
                        if (
                            enemy.length &&
                            game.tick % (Math.max(1, parseInt) || 1) === 0
                        ) {
                            let near2 = {
                                inTrap: false,
                            };

                            let nearTrap = gameObjects.find(e => e.trap && e.active && e.isTeamObject(player) && UTILS.getDist(e, near, 0, 2) <= (near.scale + e.getScale() + 5));
                            near2.inTrap = !!nearTrap;

                            if (near.dist2 <= 300 && ((near.dist2 > MIN_TRAP_DISTANCE && !near2.inTrap) || autoQ)) {
                                if (near2.inTrap && near.dist2 <= 250) {
                                    checkPlace(2, near.aim2 + Math.PI);
                                } else {
                                    player.items[4] == 15 && checkPlace(4, near.aim2);
                                }
                            } else if (!near2.inTrap && (testMode ? enemy.length : near.dist2 <= MIN_TRAP_DISTANCE)) {
                                let objAim = UTILS.getDirect(near, player, 0, 2);
                                let trapPlacementRadius = 70;

                                const enemyVelocity = getEnemyVelocity(near);
                                const enemyDirection = getEnemyDirection(near);

                                if (near.dist2 <= MIN_TRAP_DISTANCE) {
                                    player.items[4] == 15 && this.testCanPlace(
                                        4,
                                        UTILS.deg2rad(-90),
                                        UTILS.deg2rad(90),
                                        Math.PI / 24,
                                        objAim,
                                        trapPlacementRadius,
                                        { inTrap: true, enemyVelocity, enemyDirection }
                                    );
                                }
                            } else if (near2.inTrap) {
                                let objAim = UTILS.getDirect(nearTrap, player, 0, 2);
                                let trapPlacementRadius = 70;

                                const enemyVelocity = getEnemyVelocity(nearTrap);
                                const enemyDirection = getEnemyDirection(nearTrap);

                                if (near.dist2 <= 100) {
                                    let initialAngle = Math.random() * Math.PI * 2;

                                    this.testCanPlace(
                                        2,
                                        initialAngle,
                                        initialAngle + Math.PI * 2,
                                        SPIKE_ANGLE_INCREMENT,
                                        objAim,
                                        SPIKE_RADIUS,
                                        { inTrap: false, enemyVelocity, enemyDirection }
                                    );
                                }
                            }
                        }
                    };
                    this.PrePlace = function () {
                        let range = items.weapons[player.weapons[0]].range + 70;

                        let nearestObj = null;
                        let minDist = Infinity;

                        gameObjects.forEach(tmpObj => {

                            let objDst = UTILS.getDist(tmpObj, player, 0, 2);
                            let SmartHP = 273.01;

                            if ((objDst <= range && objDst < minDist && tmpObj.health < SmartHP) || ((near.length && near.reloads[near.weaponIndex] <= config.tickRate * (window.pingTime >= 200 ? 2 : 1)) || player.reloads[player.weaponIndex] * 1000 <= config.tickRate * (window.pingTime >= 200 ? 2 : 1))) {
                                nearestObj = tmpObj;
                                minDist = objDst;
                            }
                        });

                        if (nearestObj) {
                            let perfectAngle = UTILS.getDirect(nearestObj, player, 0, 2);
                            if (my.SpikeAim) {
                                if (spikePlace) {
                                    FastPlace(2, SpikeDir());
                                } else {
                                    player.items[4] == 15 && FastPlace(4, SpikeDir());
                                }
                            } else if (my.TrapAim) {
                                if (spikePlace) {
                                    FastPlace(2, TrapDir());
                                } else {
                                    player.items[4] == 15 && FastPlace(4, TrapDir());
                                }
                            } else {
                                if (spikePlace) {
                                    FastPlace(2, perfectAngle);
                                } else {
                                    player.items[4] == 15 && FastPlace(4, perfectAngle);
                                }
                            }
                        }
                    }


                    this.nearTrap = function () {
                        return gameObjects.filter(object =>
                                                  object.trap &&
                                                  object.active &&
                                                  UTILS.getDist(object, player, 0, 2) <= (player.scale + object.getScale() + 5)
                                                 );
                    };

                    this.isEnemyInTrap = function(enemy) {
                        let nearTraps = this.nearTrap();
                        return nearTraps.some(trap =>
                                              UTILS.getDist(trap, enemy, 0, 2) <= (trap.getScale() + near.scale)
                                             );
                    };
                    this.replacer = function (findObj) {
                        if (!findObj || !getEl("autoreplace").checked || !inGame || this.antiTrapped) return;

                        this.angles = this.angles || [];

                        let objAim = UTILS.getDirect(findObj, player, 0, 2);
                        let objDst = UTILS.getDist(findObj, player, 0, 2);
                        let weaponRange = items.weapons[player.weaponIndex].range + player.scale;
                        let preAngleAmount = Math.PI / 6;

                        if (getEl("weapongrind").checked && objDst <= weaponRange) return;

                        if (objDst <= 300 && near.dist2 <= 300) {
                            let danger = this.checkSpikeTick();

                            let nearWeaponRange = items.weapons[near.primaryIndex || 5].range;

                            if (!danger && (near.dist2 <= nearWeaponRange || traps.inTrap && objDst <= 150 || traps.isEnemyInTrap(near))) {
                                let angleToPlayer = Math.atan2(player.y - findObj.y, player.x - findObj.x);
                                let distanceToPlayer = UTILS.getDist(findObj, player, 0, 2);
                                let placementRadius = 80;

                                let enemyVelocity = Math.sqrt(near.xVel * near.xVel + near.yVel * near.yVel);
                                let enemyDirection = Math.atan2(near.yVel, near.xVel);

                                let predictedAngle = angleToPlayer + enemyVelocity * Math.cos(enemyDirection);
                                let predictedDistance = distanceToPlayer + enemyVelocity * Math.sin(enemyDirection);

                                this.angles.push(predictedAngle);

                                if (this.angles.length > 5) {
                                    this.angles.shift();
                                }

                                let smoothedAngle = this.angles.reduce((a, b) => a + b, 0) / this.angles.length;

                                smoothedAngle += preAngleAmount;

                                let timeAdjustment = (Math.PI / 24) * Math.sin(Date.now() / 1000);
                                let placementAngle = smoothedAngle + timeAdjustment;

                                this.testCanPlace(2, placementAngle, placementAngle + Math.PI * 2, Math.PI / 24, objAim, placementRadius);

                            } else if (player.items[4] === 15 || near.dist2 <= 100) {
                                let angleToPlayer = Math.atan2(player.y - findObj.y, player.x - findObj.x);
                                let distanceToPlayer = UTILS.getDist(findObj, player, 0, 2);
                                let trapPlacementRadius = 70;

                                let enemyVelocity = Math.sqrt(near.xVel * near.xVel + near.yVel * near.yVel);
                                let enemyDirection = Math.atan2(near.yVel, near.xVel);

                                let predictedAngle = angleToPlayer + enemyVelocity * Math.cos(enemyDirection);
                                let predictedDistance = distanceToPlayer + enemyVelocity * Math.sin(enemyDirection);

                                this.angles.push(predictedAngle);

                                if (this.angles.length > 5) {
                                    this.angles.shift();
                                }

                                let smoothedAngle = this.angles.reduce((a, b) => a + b, 0) / this.angles.length;

                                smoothedAngle += preAngleAmount;

                                let trapPlacementAngle = smoothedAngle + Math.PI;

                                player.items[4] == 15 && this.testCanPlace(4, trapPlacementAngle, trapPlacementAngle + Math.PI * 2, Math.PI / 24, objAim, trapPlacementRadius);
                            }
                            this.replaced = true;
                        }
                    };
                }
            };
            class Instakill {
                constructor() {
                    this.canSpikeTick = false;
                    this.canCounter = false;
                    this.isTrue = false;
                    this.wait = false;
                    this.can = false;
                    this.changeType = function(type) {
                        this.wait = false;
                        this.isTrue = true;
                        my.InstaAim = true;
                        if (player.tailIndex == 11) {
                            buyEquip(Wings, 1);
                            game.tickBase(() => {
                                if (type == "rev") {
                                    selectWeapon(player.weapons[1]);
                                    buyEquip(53, 0);
                                    sendAutoGather();
                                    game.tickBase(() => {
                                        selectWeapon(player.weapons[0]);
                                        buyEquip(7, 0);
                                        game.tickBase(() => {
                                            sendAutoGather();
                                            this.isTrue = false;
                                            my.InstaAim = false;
                                        }, 1);
                                    }, 1);
                                } else if (type == "normal") {
                                    selectWeapon(player.weapons[0]);
                                    buyEquip(7, 0);
                                    sendAutoGather();
                                    game.tickBase(() => {
                                        selectWeapon(player.weapons[1]);
                                        buyEquip(53, 0);
                                        game.tickBase(() => {
                                            detectHat(6);
                                            sendAutoGather();
                                            this.isTrue = false;
                                            game.tickBase(() => {
                                                my.InstaAim = false;
                                            }, 1);
                                        }, 1);
                                    }, 1);
                                } else {
                                    setTimeout(() => {
                                        this.isTrue = false;
                                        my.InstaAim = false;
                                    }, 150);
                                }
                            }, 1);
                        } else {
                            if (type == "rev") {
                                selectWeapon(player.weapons[1]);
                                buyEquip(53, 0);
                                sendAutoGather();
                                game.tickBase(() => {
                                    selectWeapon(player.weapons[0]);
                                    buyEquip(7, 0);
                                    game.tickBase(() => {
                                        sendAutoGather();
                                        this.isTrue = false;
                                        game.tickBase(() => {
                                            my.InstaAim = false;
                                        }, 1);
                                    }, 1);
                                }, 1);
                            } else if (type == "normal") {
                                selectWeapon(player.weapons[0]);
                                buyEquip(7, 0);
                                sendAutoGather();
                                game.tickBase(() => {
                                    selectWeapon(player.weapons[1]);
                                    buyEquip(53, 0);
                                    game.tickBase(() => {
                                        detectHat(6);
                                        sendAutoGather();
                                        my.InstaAim = false;
                                        this.isTrue = false;
                                    }, 1);
                                }, 1);
                            } else {
                                setTimeout(() => {
                                    this.isTrue = false;
                                    my.InstaAim = false;
                                }, 50);
                            }
                        }
                    };
                    this.syncTry = function() {
                        buyEquip(53, 0);
                        game.tickBase(() => {
                            this.isTrue = true;
                            my.autoAim = true;
                            selectWeapon(player.weapons[1]);
                            sendAutoGather();
                            game.tickBase(() => {
                                my.autoAim = false;
                                this.isTrue = false;
                                sendAutoGather();
                            }, 1);
                        }, 2);
                    };
                    this.MapSync = function() {
                        let nearDistCheck;
                        nearDistCheck = (near.dist2 <= 300) ? 1 : 2
                        buyEquip(53, 0);
                        game.tickBase(() => {
                            selectWeapon(player.weapons[1]);
                            sendAutoGather();
                            this.isTrue = true;
                            my.autoAim = true;
                            game.tickBase(() => {
                                my.autoAim = false;
                                this.isTrue = false;
                                sendAutoGather();
                            }, 1);
                        }, nearDistCheck);
                    };
                    this.counterType = function () {
                        this.isTrue = true;
                        my.autoAim = true;
                        selectWeapon(player.weapons[0]);
                        buyEquip(7, 0);
                        buyEquip(Wings, 1);
                        sendAutoGather();
                        game.tickBase(() => {
                            if (player.reloads[53] == 0 && player.weapons[1] == 10) {
                                selectWeapon(player.weapons[0]);
                                buyEquip(53, 0);
                                buyEquip(Wings, 1);
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
                    this.bowInstaCheck = function() {
                        let stop = setInterval(() => {
                            if (!enemy.length || traps.inTrap || player.reloads[53] != 0) {
                                clearInterval(stop);
                            }
                            stopUp = false;
                            if (near.dist2 < 590) {
                                buyEquip(12, 0);
                                packet("a", near.aim2 + Math.PI, 1);
                            } else {
                                if (near.skinIndex != 22) {
                                    packet("a", undefined, 1);
                                    clearInterval(stop);
                                    game.tickBase(() => {
                                        buyEquip(53, 0);
                                        this.isTrue = true;
                                        my.autoAim = true;
                                        selectWeapon(player.weapons[1]);
                                        sendAutoGather();
                                        if (player.upgrAge === 7) {
                                            sendUpgrade(38);
                                        }
                                        buyEquip(53, 0);
                                        game.tickBase(() => {
                                            if (player.upgrAge === 8) {
                                                sendUpgrade(12);
                                            }
                                            selectWeapon(player.weapons[1]);
                                            game.tickBase(() => {
                                                if (player.upgrAge === 9) {
                                                    sendUpgrade(15);
                                                }
                                                selectWeapon(player.weapons[1]);
                                                buyEquip(53, 0);
                                                game.tickBase(() => {
                                                    sendAutoGather();
                                                    this.isTrue = false;
                                                    my.autoAim = false;
                                                    stopUp = true
                                                }, 1);
                                            }, 1);
                                        }, 1);
                                    }, 1);
                                } else {
                                    if (near.dist2 >= 630) {
                                        packet("a", near.aim2, 1);
                                    } else {
                                        packet("a", undefined, 1);
                                    }
                                }
                            }
                        }, 0);
                    };
                    this.CheckSoldier = function () {
                        if ((near.skinIndex != 6 && traps.canHit()) || (traps.cantHit() && near.reloads[near.weaponIndex] != 0)) {
                            return true;
                        } else {
                            return false;
                        }
                    };
                    this.OneFrameType = function () {
                        let Frame = setInterval(() => {
                            if (!checkOneFrame || secPacket >= 85 || (traps.inTrap && near.dist2 <= 300) || !enemy.length) {
                                checkOneFrame = false;
                                clearInterval(Frame);
                                game.tickBase(() => {
                                    packet("a", undefined, 1);
                                    instaC.isTrue = false;
                                }, 1);
                            };
                            if (!clicks.left && !clicks.right) {
                                if (this.CheckSoldier() && player.reloads[53] == 0 && near.skinIndex != 22 && near.dist2 >= items.weapons[player.weapons[0]].range + near.scale * 2.25 && near.dist2 <= items.weapons[player.weapons[0]].range + near.scale * 2.45) {
                                    clearInterval(Frame);
                                    buyEquip(53, 0);
                                    packet("a", near.aim2, 1);
                                    game.tickBase(() => {
                                        packet("a", near.aim2, 1);
                                        this.isTrue = true;
                                        my.InstaAim = true;
                                        sendAutoGather();
                                        selectWeapon(player.weapons[0]);
                                        buyEquip(7, 0);
                                        game.tickBase(() => {
                                            packet("a", near.aim2, 1);
                                            sendAutoGather();
                                            this.isTrue = false;
                                            my.InstaAim = false;
                                            game.tickBase(() => {
                                                checkOneFrame = false;
                                                packet("a", undefined, 1);
                                            }, 1);
                                        }, 1);
                                    }, 1);
                                } else {
                                    let niglet = pathFind;
                                    niglet.scale = (config.maxScreenWidth / 2) * 1.3;
                                    if (enemy.length) {
                                        if (near.dist2 <= items.weapons[player.weapons[0]].range + near.scale * 5) {
                                            if (!my.SpikeAim && !my.MillAim && !my.TeleAim && !my.TrapAim) {
                                                this.isTrue = near.dist2 <= items.weapons[player.weapons[0]].range + near.scale * 3 ? true : false;
                                                this.isTrue && buyEquip(Wings, 1);
                                                if (near.dist2 <= items.weapons[player.weapons[0]].range + near.scale * 2.22) {
                                                    packet("a", near.aim2 + Math.PI, 1);
                                                    this.isTrue && buyEquip(6, 0);
                                                } else {
                                                    packet("a", near.aim2, 1);
                                                    this.isTrue && buyEquip(40, 0);
                                                }
                                            } else {
                                                this.isTrue = false;
                                            }
                                        } else {
                                            createPath();
                                            easystar.setGrid(grid);
                                            easystar.setAcceptableTiles([0]);
                                            easystar.enableDiagonals();
                                            easystar.findPath((grid[0].length / 2), (grid.length / 2), niglet.lastX, niglet.lastY, function(path) {
                                                if (path === null) {
                                                    niglet.array = [];
                                                    if (!traps.inTrap && !my.SpikeAim && !my.MillAim && !my.TeleAim && !my.TrapAim) {
                                                        this.isTrue = near.dist2 <= items.weapons[player.weapons[0]].range + near.scale * 3 ? true : false;
                                                        this.isTrue && buyEquip(Wings, 1);
                                                        if (near.dist2 <= items.weapons[player.weapons[0]].range + near.scale * 2.22) {
                                                            packet("a", near.aim2 + Math.PI, 1);
                                                            this.isTrue && buyEquip(6, 0);
                                                        } else {
                                                            packet("a", near.aim2, 1);
                                                            this.isTrue && buyEquip(40, 0);
                                                        }
                                                    } else {
                                                        this.isTrue = false;
                                                    }
                                                } else {
                                                    niglet.array = path;
                                                    if (niglet.array.length > 1) {
                                                        let tmpXY = {
                                                            x: (player.x2 - (niglet.scale / 2)) + ((niglet.scale / niglet.grid) * path[1].x),
                                                            y: (player.y2 - (niglet.scale / 2)) + ((niglet.scale / niglet.grid) * path[1].y)
                                                        }
                                                        io.send("a", UTILS.getDirect(tmpXY, player, 0, 2), 1);
                                                    }
                                                }
                                            });
                                            easystar.calculate();
                                        }
                                    }
                                }
                            }
                        }, 0);
                    }
                    this.spikeTickType = function () {
                        this.isTrue = true;
                        my.autoAim = true;
                        selectWeapon(player.weapons[0]);
                        buyEquip(7, 0);
                        buyEquip(Wings, 1);
                        sendAutoGather();
                        game.tickBase(() => {
                            if (player.reloads[53] == 0 && player.weapons[1] == 10) {
                                selectWeapon(player.weapons[0]);
                                buyEquip(53, 0);
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
                    this.km = function(upg) {
                        upg(3);
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
            let tmpList = [];
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
            let autoBuy = new Autobuy([40, 15, 31, 6, 7, 22], [11, 21]);
            let autoUpgrade = new Autoupgrade();
            let lastDeath;
            let minimapData;
            let mapMarker = {};
            let mapPings = [];
            let tmpPing;
            let breakTrackers = [];
            let grid = [];
            let pathFind = {
                active: true,
                grid: 40,
                scale: 1440,
                x: 14400,
                y: 14400,
                go_to_nearest_enemy: true,
                array: [],
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
            let Tail = 11;
            let tails = 11;
            let Wings = 21;
            let tryHat = 11;
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
                                io.send("6", "ranged insta homo");
                                antiSyncHealing(4);
                            }
                        } else {
                            if (projectileCount >= 2) {
                                place(1, tmpObj.aim2);
                                my.anti0Tick = 4;
                                if (!my.antiSync) {
                                    io.send("6", "ranged insta homo");
                                    antiSyncHealing(4);
                                }
                            }
                        }
                    }
                }
            }
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

            let autobullspam = false;

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
                        if (player.reloads[player.weapons[0]] == 0) {
                            buyEquip(Wings, 1);
                            buyEquip(plaguemask ? 21 : near.skinIndex == 11 ? 26 : 7, 0);
                        }
                        clicks.left = true;
                    } else if (e.button == 1) {
                        clicks.middle = true;
                    } else if (e.button == 2) {
                        if (player.reloads[player.weapons[1] == 10 ? player.weapons[1] : player.weapons[0]] == 0) {
                            buyEquip(40, 0);
                            buyEquip(Wings, 1);
                        }
                        clicks.right = true;
                    }
                }
            }
            mals.addEventListener("mouseup", UTILS.checkTrusted(mouseUp));
            function mouseUp(e) {
                if (attackState != 0) {
                    attackState = 0;
                    if (e.button == 0) {
                        if (player.reloads[player.weapons[0]] == 0) {
                            buyEquip(Wings, 1);
                            buyEquip(plaguemask ? 21 : near.skinIndex == 11 ? 26 : 7, 0);
                        }
                        clicks.left = false;
                    } else if (e.button == 1) {
                        clicks.middle = false;
                    } else if (e.button == 2) {
                        if (player.reloads[player.weapons[1] == 10 ? player.weapons[1] : player.weapons[0]] == 0) {
                            buyEquip(40, 0);
                            buyEquip(Wings, 1);
                        }
                        clicks.right = false;
                    }
                }
            }
            mals.addEventListener("wheel", wheel, false);
            function wheel(e) {
                if(getEl("zoomgg").checked) {
                    if(e.deltaY > 0){
                        maxScreenHeight *= 1.05;
                        maxScreenWidth *= 1.05;
                    } else {
                        maxScreenHeight /= 1.05;
                        maxScreenWidth /= 1.05;
                    }
                    resize();
                }
            }
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

            function SpikeX() {
                let spike;
                if (near.dist2 > 230 && config.autobot && !my.autoPush && enemy.length) {
                    if (traps.inTrap) {
                        spike = gameObjects.filter(tmp => tmp.dmg && tmp.active && !tmp.isTeamObject(player) && UTILS.getDist(tmp, player, 0, 3) < (items.weapons[player.weapons[0]].range + player.scale * 1.5)).sort(function(a, b) {
                            return UTILS.getDist(a, player, 0, 5) - UTILS.getDist(b, player, 0, 5);
                        })[0];
                    } else {
                        spike = gameObjects.filter(tmp => tmp.dmg && tmp.active && UTILS.getDist(tmp, player, 0, 3) < (tmp.scale + checkDist + player.scale)).sort(function(a, b) {
                            return UTILS.getDist(a, player, 0, 5) - UTILS.getDist(b, player, 0, 5);
                        })[0];
                    }
                } else {
                    if (traps.inTrap) {
                        spike = gameObjects.filter(tmp => tmp.dmg && tmp.active && !tmp.isTeamObject(player) && UTILS.getDist(tmp, player, 0, 3) < (items.weapons[player.weapons[0]].range + player.scale * 1.5)).sort(function(a, b) {
                            return UTILS.getDist(a, player, 0, 5) - UTILS.getDist(b, player, 0, 5);
                        })[0];
                    } else {
                        spike = gameObjects.filter(tmp => tmp.dmg && tmp.active && !tmp.isTeamObject(player) && UTILS.getDist(tmp, player, 0, 3) < (tmp.scale + checkDist + player.scale)).sort(function(a, b) {
                            return UTILS.getDist(a, player, 0, 5) - UTILS.getDist(b, player, 0, 5);
                        })[0];
                    }
                }
                if (spike) {
                    return spike.x;
                }
            }
            function SpikeY() {
                let spike;
                if (near.dist2 > 230 && config.autobot && !my.autoPush && enemy.length) {
                    if (traps.inTrap) {
                        spike = gameObjects.filter(tmp => tmp.dmg && tmp.active && !tmp.isTeamObject(player) && UTILS.getDist(tmp, player, 0, 3) < (items.weapons[player.weapons[0]].range + player.scale * 1.5)).sort(function(a, b) {
                            return UTILS.getDist(a, player, 0, 5) - UTILS.getDist(b, player, 0, 5);
                        })[0];
                    } else {
                        spike = gameObjects.filter(tmp => tmp.dmg && tmp.active && UTILS.getDist(tmp, player, 0, 3) < (tmp.scale + checkDist + player.scale)).sort(function(a, b) {
                            return UTILS.getDist(a, player, 0, 5) - UTILS.getDist(b, player, 0, 5);
                        })[0];
                    }
                } else {
                    if (traps.inTrap) {
                        spike = gameObjects.filter(tmp => tmp.dmg && tmp.active && !tmp.isTeamObject(player) && UTILS.getDist(tmp, player, 0, 3) < (items.weapons[player.weapons[0]].range + player.scale * 1.5)).sort(function(a, b) {
                            return UTILS.getDist(a, player, 0, 5) - UTILS.getDist(b, player, 0, 5);
                        })[0];
                    } else {
                        spike = gameObjects.filter(tmp => tmp.dmg && tmp.active && !tmp.isTeamObject(player) && UTILS.getDist(tmp, player, 0, 3) < (tmp.scale + checkDist + player.scale)).sort(function(a, b) {
                            return UTILS.getDist(a, player, 0, 5) - UTILS.getDist(b, player, 0, 5);
                        })[0];
                    }
                }
                if (spike) {
                    return spike.y;
                }
            }
            function TrapY() {
                let trap = gameObjects.filter(tmp => tmp.trap && tmp.active && !tmp.isTeamObject(player) && UTILS.getDist(tmp, player, 0, 3) < (tmp.scale + checkDist + player.scale)).sort(function(a, b) {
                    return UTILS.getDist(a, player, 0, 5) - UTILS.getDist(b, player, 0, 5);
                })[0];
                if (trap) {
                    return trap.y;
                } else {
                    return undefined;
                }
            }
            function TrapX() {
                let trap = gameObjects.filter(tmp => tmp.trap && tmp.active && !tmp.isTeamObject(player) && UTILS.getDist(tmp, player, 0, 3) < (tmp.scale + checkDist + player.scale)).sort(function(a, b) {
                    return UTILS.getDist(a, player, 0, 5) - UTILS.getDist(b, player, 0, 5);
                })[0];
                if (trap) {
                    return trap.x;
                } else {
                    return undefined;
                }
            }
            let checkDist = 70;
            let CheckTick = 1;
            let canSecondary = 1;
            function antiPush() {
                if (secPacket >= ChPath) return;

                if (near.dist2 <= 350 && !traps.inTrap) {
                    checkDist = 35;
                    CheckTick = 1;
                } else {
                    if (window.pingTime <= 90 && player.weapons[0] !== 5) {
                        checkDist = 75;
                    } else {
                        checkDist = 35;
                    }
                }
                let spike;
                let trap;
                if (near.dist2 > 230 && config.autobot && !my.autoPush && enemy.length) {
                    if (traps.inTrap && checkDist != 35) {
                        spike = gameObjects.filter(tmp => tmp.dmg && tmp.active && !tmp.isTeamObject(player) && UTILS.getDist(tmp, player, 0, 3) < (items.weapons[player.weapons[0]].range + player.scale * 1.5)).sort(function(a, b) {
                            return UTILS.getDist(a, player, 0, 5) - UTILS.getDist(b, player, 0, 5);
                        })[0];
                    } else {
                        spike = gameObjects.filter(tmp => tmp.dmg && tmp.active && UTILS.getDist(tmp, player, 0, 3) < (tmp.scale + checkDist + player.scale)).sort(function(a, b) {
                            return UTILS.getDist(a, player, 0, 5) - UTILS.getDist(b, player, 0, 5);
                        })[0];
                    }
                } else {
                    if (traps.inTrap && checkDist != 35) {
                        spike = gameObjects.filter(tmp => tmp.dmg && tmp.active && !tmp.isTeamObject(player) && UTILS.getDist(tmp, player, 0, 3) < (items.weapons[player.weapons[0]].range + player.scale * 1.5)).sort(function(a, b) {
                            return UTILS.getDist(a, player, 0, 5) - UTILS.getDist(b, player, 0, 5);
                        })[0];
                    } else {
                        spike = gameObjects.filter(tmp => tmp.dmg && tmp.active && !tmp.isTeamObject(player) && UTILS.getDist(tmp, player, 0, 3) < (tmp.scale + checkDist + player.scale)).sort(function(a, b) {
                            return UTILS.getDist(a, player, 0, 5) - UTILS.getDist(b, player, 0, 5);
                        })[0];
                    }
                }
                trap = gameObjects.filter(tmp => tmp.trap && tmp.active && !tmp.isTeamObject(player) && UTILS.getDist(tmp, player, 0, 3) < (tmp.scale + checkDist + player.scale)).sort(function(a, b) {
                    return UTILS.getDist(a, player, 0, 5) - UTILS.getDist(b, player, 0, 5);
                })[0];
                if (spike) {
                    if (spike) {
                        if (!clicks.right && !clicks.left && !instaC.canSpikeTick) {
                            my.SpikeAim = true;
                            let SpikeMove = UTILS.getDirect(spike, player, 0, 2);
                            let SpikeDistReal = UTILS.getDist(spike, player, 0, 2);
                            if (!traps.inTrap && player.weapons[1] == 10) {
                                if (((near.dist2 <= 350 || window.pingTime > 90) && enemy.length) || my.canMove) {
                                    packet("a", undefined, 1);
                                } else {
                                    if (SpikeDistReal < items.weapons[player.weapons[1]].range + player.scale * 1.1) {
                                        packet("a", SpikeMove + Math.PI, 1);
                                    } else if (SpikeDistReal >= items.weapons[player.weapons[1]].range + player.scale * 1.1) {
                                        packet("a", SpikeMove, 1);
                                    }
                                }
                                game.tickBase(() => {
                                    my.canMove = false;
                                }, 1);
                            }
                            let SpikeDist = UTILS.getDist(spike, player, 0, 2);
                            if (traps.inTrap) {
                                if (SpikeDist < items.weapons[player.weapons[1]].range + player.scale * 1.5 && player.weapons[1] == 10) {
                                    if (canSecondary != 1) {
                                        canSecondary = 1;
                                    }
                                    if ((player.weaponIndex != (player.weapons[1] == 10 ? player.weapons[1] : player.weapons[0])) || player.buildIndex > -1) {
                                        selectWeapon(player.weapons[1] == 10 ? player.weapons[1] : player.weapons[0]);
                                    }
                                } else if (player.reloads[player.weapons[1]] == 0 || player.weapons[1] == 10){
                                    if (canSecondary != 0) {
                                        canSecondary = 0;
                                    }
                                    if ((player.weaponIndex != player.weapons[0]) || player.buildIndex > -1) {
                                        selectWeapon(player.weapons[0]);
                                    }
                                }
                            } else {
                                if (SpikeDist < items.weapons[player.weapons[1]].range + player.scale * 1.5 && player.weapons[1] == 10) {
                                    if (canSecondary != 1) {
                                        canSecondary = 1;
                                    }
                                    if ((player.weaponIndex != (player.weapons[1] == 10 ? player.weapons[1] : player.weapons[0])) || player.buildIndex > -1) {
                                        selectWeapon(player.weapons[1] == 10 ? player.weapons[1] : player.weapons[0]);
                                    }
                                }
                            }
                            game.tickBase(() => {
                                my.canHat = false;
                                if (player.reloads[player.weapons[1] == 10 ? player.weapons[canSecondary] : player.weapons[0]] == 0 && !my.waitHit) {
                                    if (my.anti0Tick > 0) {
                                        buyEquip(6, 0);
                                    } else if (player.empAnti) {
                                        buyEquip(22, 0);
                                    } else {
                                        buyEquip(40, 0);
                                    }
                                    sendAutoGather();
                                    my.waitHit = 1;
                                    game.tickBase(() => {
                                        if (my.anti0Tick > 0) {
                                            buyEquip(6, 0);
                                        } else if (player.empAnti) {
                                            buyEquip(22, 0);
                                        } else {
                                            if ((!player.empAnti && (near.dist2 >= 200 || !enemy.length)) && player.health === 100 && player.skins[7] && !autoQ && player.shameCount > 0 && player.skinIndex != 45) {
                                                buyEquip(7, 0);
                                            } else {
                                                detectHat(6);
                                            }
                                        }
                                        sendAutoGather();
                                        my.waitHit = 0;
                                    }, 1);
                                }
                                buyEquip(Wings, 1);
                            }, CheckTick);
                        } else {
                            if (!my.canMove) {
                                packet("a", undefined, 1);
                                game.tickBase(() => {
                                    my.canMove = true;
                                }, 1);
                            }
                            ResetActions()
                        }
                    } else {
                        if (!my.canMove) {
                            packet("a", undefined, 1);
                            game.tickBase(() => {
                                my.canMove = true;
                            }, 1);
                        }
                        ResetActions()
                    }
                } else {
                    if (trap && !traps.inTrap && !clicks.middle) {
                        if (trap) {
                            if (!clicks.right && !clicks.left && !instaC.canSpikeTick) {
                                my.TrapAim = true;
                                let TrapMove = UTILS.getDirect(trap, player, 0, 2);
                                let TrapDistReal = UTILS.getDist(trap, player, 0, 2);
                                if (!traps.inTrap && player.weapons[1] == 10) {
                                    if (near.dist2 <= 350 && enemy.length) {
                                        packet("a", undefined, 1);
                                    } else {
                                        if (TrapDistReal < items.weapons[player.weapons[1]].range + player.scale * 1.1) {
                                            packet("a", TrapMove + Math.PI, 1);
                                        } else if (TrapDistReal >= items.weapons[player.weapons[1]].range + player.scale * 1.1) {
                                            packet("a", TrapMove, 1);
                                        }
                                    }
                                    my.canMove = false;
                                }
                                if (canSecondary != 1) {
                                    canSecondary = 1;
                                }
                                if ((player.weaponIndex != (player.weapons[1] == 10 ? player.weapons[1] : player.weapons[0])) || player.buildIndex > -1) {
                                    selectWeapon(player.weapons[1] == 10 ? player.weapons[1] : player.weapons[0]);
                                }
                                game.tickBase(() => {
                                    my.canHat = false;
                                    if (player.reloads[player.weapons[1] == 10 ? player.weapons[canSecondary] : player.weapons[0]] == 0 && !my.waitHit) {
                                        if (my.anti0Tick > 0) {
                                            buyEquip(6, 0);
                                        } else if (player.empAnti) {
                                            buyEquip(22, 0);
                                        } else {
                                            buyEquip(40, 0);
                                        }
                                        sendAutoGather();
                                        my.waitHit = 1;
                                        game.tickBase(() => {
                                            if (my.anti0Tick > 0) {
                                                buyEquip(6, 0);
                                            } else if (player.empAnti) {
                                                buyEquip(22, 0);
                                            } else {
                                                if ((!player.empAnti && (near.dist2 >= 200 || !enemy.length)) && player.health === 100 && player.skins[7] && !autoQ && configs3.BullTick && player.shameCount > 0 && player.skinIndex != 45) {
                                                    buyEquip(7, 0);
                                                } else {
                                                    detectHat(6);
                                                }
                                            }
                                            sendAutoGather();
                                            my.waitHit = 0;
                                        }, 1);
                                    }
                                    buyEquip(Wings, 1);
                                }, CheckTick);
                            } else {
                                if (!my.canMove) {
                                    packet("a", undefined, 1);
                                    game.tickBase(() => {
                                        my.canMove = true;
                                    }, 1);
                                }
                                ResetActions()
                            }
                        }
                    } else {
                        if (FindTele() && !getEl("weapongrind").checked && enemy.length) {
                            let tele = gameObjects.filter(tmp => tmp.teleport && tmp.active && UTILS.getDist(tmp, player, 0, 3) < (tmp.scale + 35 + player.scale)).sort(function(a, b) {
                                return UTILS.getDist(a, player, 0, 5) - UTILS.getDist(b, player, 0, 5);
                            })[0];
                            if (tele) {
                                if (tele) {
                                    if (!clicks.right && !clicks.left && !instaC.canSpikeTick) {
                                        my.TeleAim = true;
                                        if (!traps.inTrap) {
                                            packet("a", undefined, 1);
                                        }
                                        game.tickBase(() => {
                                            if ((player.weaponIndex != (player.weapons[1] == 10 ? player.weapons[1] : player.weapons[0])) || player.buildIndex > -1) {
                                                selectWeapon(player.weapons[1] == 10 ? player.weapons[1] : player.weapons[0]);
                                            }
                                            my.canHat = false;
                                            if (player.reloads[player.weapons[1] == 10 ? player.weapons[canSecondary] : player.weapons[0]] == 0 && !my.waitHit) {
                                                if (my.anti0Tick > 0) {
                                                    buyEquip(6, 0);
                                                } else if (player.empAnti) {
                                                    buyEquip(22, 0);
                                                } else {
                                                    buyEquip(40, 0);
                                                }
                                                sendAutoGather();
                                                my.waitHit = 1;
                                                game.tickBase(() => {
                                                    if (my.anti0Tick > 0) {
                                                        buyEquip(6, 0);
                                                    } else if (player.empAnti) {
                                                        buyEquip(22, 0);
                                                    } else {
                                                        if ((!player.empAnti && (near.dist2 >= 200 || !enemy.length)) && player.health === 100 && player.skins[7] && !autoQ && configs3.BullTick && player.shameCount > 0 && player.skinIndex != 45) {
                                                            buyEquip(7, 0);
                                                        } else {
                                                            detectHat(6);
                                                        }
                                                    }
                                                    sendAutoGather();
                                                    my.waitHit = 0;
                                                }, 1);
                                            }
                                            buyEquip(Wings, 1);
                                        }, 1);
                                    }
                                }
                            }
                        } else if (FindMill() && (config.autobot || checkOneFrame) && !my.autoPush && near.dist2 >= 360) {
                            let mill = gameObjects.filter(tmp => tmp.pps && tmp.active && UTILS.getDist(tmp, player, 0, 3) < (tmp.scale + 35 + player.scale)).sort(function(a, b) {
                                return UTILS.getDist(a, player, 0, 5) - UTILS.getDist(b, player, 0, 5);
                            })[0];
                            if (mill) {
                                if (mill) {
                                    if (!clicks.right && !clicks.left && !instaC.canSpikeTick) {
                                        my.MillAim = true;
                                        game.tickBase(() => {
                                            if ((player.weaponIndex != (player.weapons[1] == 10 ? player.weapons[1] : player.weapons[0])) || player.buildIndex > -1) {
                                                selectWeapon(player.weapons[1] == 10 ? player.weapons[1] : player.weapons[0]);
                                            }
                                            my.canHat = false;
                                            if (player.reloads[player.weapons[1] == 10 ? player.weapons[canSecondary] : player.weapons[0]] == 0 && !my.waitHit) {
                                                if (my.anti0Tick > 0) {
                                                    buyEquip(6, 0);
                                                } else if (player.empAnti) {
                                                    buyEquip(22, 0);
                                                } else {
                                                    buyEquip(40, 0);
                                                }
                                                sendAutoGather();
                                                my.waitHit = 1;
                                                game.tickBase(() => {
                                                    if (my.anti0Tick > 0) {
                                                        buyEquip(6, 0);
                                                    } else if (player.empAnti) {
                                                        buyEquip(22, 0);
                                                    } else {
                                                        if ((!player.empAnti && (near.dist2 >= 200 || !enemy.length)) && player.health === 100 && player.skins[7] && !autoQ && configs3.BullTick && player.shameCount > 0 && player.skinIndex != 45) {
                                                            buyEquip(7, 0);
                                                        } else {
                                                            detectHat(6);
                                                        }
                                                    }
                                                    sendAutoGather();
                                                    my.waitHit = 0;
                                                }, 1);
                                            }
                                            buyEquip(Wings, 1);
                                        }, 1);
                                    } else {
                                        ResetActions();
                                    }
                                } else {
                                    ResetActions();
                                }
                            } else {
                                ResetActions();
                            }
                        } else {
                            if (!my.canMove) {
                                packet("a", undefined, 1);
                                game.tickBase(() => {
                                    my.canMove = true;
                                }, 1);
                            }
                            ResetActions();
                        }
                    }
                }
            }
            function ResetActions() {
                my.TeleAim = false;
                my.canMove = true;
                my.TrapAim = false;
                my.MillAim = false;
                my.SpikeAim = false;
                my.canHat = true;
            }
            function FindMill() {
                let mill = gameObjects.filter(tmp => tmp.pps && tmp.active && UTILS.getDist(tmp, player, 0, 3) < (tmp.scale + 35 + player.scale)).sort(function(a, b) {
                    return UTILS.getDist(a, player, 0, 5) - UTILS.getDist(b, player, 0, 5);
                })[0];
                if (mill && !traps.inTrap && near.dist2 > 250) {
                    return true;
                } else {
                    return false;
                }
            }
            function FindTele() {
                let tele = gameObjects.filter(tmp => tmp.teleport && tmp.active && UTILS.getDist(tmp, player, 0, 3) < (tmp.scale + 35 + player.scale)).sort(function(a, b) {
                    return UTILS.getDist(a, player, 0, 5) - UTILS.getDist(b, player, 0, 5);
                })[0];
                if (tele) {
                    return true;
                } else {
                    return false;
                }
            }
            function getSafeDir() {
                if (!player)
                    return 0;
                if (!player.lockDir && (!noDirMy || player.reloads[(player.weapons[1] == 10 && !clicks.left) ? player.weapons[1] : player.weapons[0]] == 0 || configs.RealDir)) {
                    lastDir = Math.atan2(mouseY - (screenHeight / 2), mouseX - (screenWidth / 2));
                }
                return lastDir || 0;
            }
            function TrapDir() {
                let trap;
                trap = gameObjects.filter(tmp => tmp.trap && tmp.active && !tmp.isTeamObject(player) && UTILS.getDist(tmp, player, 0, 3) < (tmp.scale + checkDist + player.scale)).sort(function(a, b) {
                    return UTILS.getDist(a, player, 0, 5) - UTILS.getDist(b, player, 0, 5);
                })[0];

                if (trap && !traps.inTrap && !clicks.middle) {
                    let aim = UTILS.getDirect(trap, player, 0, 2);
                    return aim;
                } else {
                    return lastDir || 0;
                }
            }
            function SpikeDir() {
                let spike;
                if (near.dist2 > 230 && config.autobot && !my.autoPush && enemy.length) {
                    if (traps.inTrap) {
                        spike = gameObjects.filter(tmp => tmp.dmg && tmp.active && !tmp.isTeamObject(player) && UTILS.getDist(tmp, player, 0, 3) < (items.weapons[player.weapons[0]].range + player.scale * 1.5)).sort(function(a, b) {
                            return UTILS.getDist(a, player, 0, 5) - UTILS.getDist(b, player, 0, 5);
                        })[0];
                    } else {
                        spike = gameObjects.filter(tmp => tmp.dmg && tmp.active && UTILS.getDist(tmp, player, 0, 3) < (tmp.scale + checkDist + player.scale)).sort(function(a, b) {
                            return UTILS.getDist(a, player, 0, 5) - UTILS.getDist(b, player, 0, 5);
                        })[0];
                    }
                } else {
                    if (traps.inTrap) {
                        spike = gameObjects.filter(tmp => tmp.dmg && tmp.active && !tmp.isTeamObject(player) && UTILS.getDist(tmp, player, 0, 3) < (items.weapons[player.weapons[0]].range + player.scale * 1.5)).sort(function(a, b) {
                            return UTILS.getDist(a, player, 0, 5) - UTILS.getDist(b, player, 0, 5);
                        })[0];
                    } else {
                        spike = gameObjects.filter(tmp => tmp.dmg && tmp.active && !tmp.isTeamObject(player) && UTILS.getDist(tmp, player, 0, 3) < (tmp.scale + checkDist + player.scale)).sort(function(a, b) {
                            return UTILS.getDist(a, player, 0, 5) - UTILS.getDist(b, player, 0, 5);
                        })[0];
                    }
                }

                if (spike) {
                    let aim = UTILS.getDirect(spike, player, 0, 2);
                    return aim;
                } else {
                    return lastDir || 0;
                }
            }
            function TeleDir() {
                let tele;
                if (traps.inTrap) {
                    tele = gameObjects.filter(tmp => tmp.teleport && tmp.active && UTILS.getDist(tmp, player, 0, 3) < (items.weapons[player.weapons[0]].range + player.scale * 1.5)).sort(function(a, b) {
                        return UTILS.getDist(a, player, 0, 5) - UTILS.getDist(b, player, 0, 5);
                    })[0];
                } else {
                    tele = gameObjects.filter(tmp => tmp.teleport && tmp.active && UTILS.getDist(tmp, player, 0, 3) < (tmp.scale + 35 + player.scale)).sort(function(a, b) {
                        return UTILS.getDist(a, player, 0, 5) - UTILS.getDist(b, player, 0, 5);
                    })[0];
                }

                if (tele) {
                    let aim = UTILS.getDirect(tele, player, 0, 2);
                    return aim;
                } else {
                    return lastDir || 0;
                }
            }
            function MillDir() {
                let mill = gameObjects.filter(tmp => tmp.pps && tmp.active && UTILS.getDist(tmp, player, 0, 3) < (tmp.scale + 35 + player.scale)).sort(function(a, b) {
                    return UTILS.getDist(a, player, 0, 5) - UTILS.getDist(b, player, 0, 5);
                })[0];

                if (mill) {
                    let aim = UTILS.getDirect(mill, player, 0, 2);
                    return aim;
                } else {
                    return lastDir || 0;
                }
            }
            function getAttackDir() {
                if(player && Date.now() - lastSpin >= 235) {
                    plusDir += UTILS.fixTo(Math.random()*(Math.PI*2), 1);
                    lastSpin = Date.now();
                }
                if (!player)
                    return 0;
                if (my.autoAim || my.InstaAim || my.BullAim) {
                    lastDir = enemy.length ? near.aim2 : getSafeDir();
                } else if (my.SpikeAim && !instaC.isTrue && !my.autoAim) {
                    if ((player.reloads[player.weapons[1] == 10 ? player.weapons[canSecondary] : player.weapons[0]] == 0) || traps.inTrap) {
                        lastDir = SpikeDir();
                    } else {
                        lastDir = plusDir;
                    }
                } else if (my.TrapAim && !instaC.isTrue && !my.autoAim) {
                    if ((player.reloads[player.weapons[1] == 10 ? player.weapons[canSecondary] : player.weapons[0]] == 0) || traps.inTrap) {
                        lastDir = TrapDir();
                    } else {
                        lastDir = plusDir;
                    }
                } else if (my.TeleAim && !instaC.isTrue && !my.autoAim) {
                    lastDir = TeleDir();
                } else if (my.MillAim && !instaC.isTrue && !my.autoAim) {
                    lastDir = MillDir();
                } else if (my.autoAim || (enemy.length && near.dist2 <= 500 && clicks.left && (player.reloads[player.weapons[0]] == 0 || !showAim))) {
                    lastDir = getEl("weapongrind").checked ? getSafeDir() : enemy.length ? near.aim2 : getSafeDir();
                } else if (clicks.right && player.reloads[player.weapons[1] == 10 ? player.weapons[1] : player.weapons[0]] == 0) {
                    lastDir = getSafeDir();
                } else if (instaType && traps.inTrap && !AntiBull && !clicks.left && !clicks.right) {
                    if (player.reloads[traps.notFast() ? player.weapons[1] : player.weapons[0]] == 0) {
                        lastDir = traps.aim;
                    } else {
                        lastDir = traps.aim;
                    }
                } else if (!player.lockDir && !my.autoAim && (!autobullspam || near.dist2 >= 250 || !enemy.length || player.reloads[player.weapons[1]] != 0)) {
                    if (near.dist2 <= 270 && traps.inTrap && !clicks.left && !clicks.right) return undefined;
                    if (ae86Dir && !clicks.right && !clicks.left && !instaC.isTrue && !traps.inTrap && !instaC.isTrue && !my.autoAim && secPacket <= 44) {
                        lastDir = plusDir;
                    } else {
                        lastDir = getSafeDir();
                    }
                }

                if(noDirMy) {
                    if(!clicks.left && !traps.inTrap && !my.InstaAim && !my.BullAim && !player.lockDir && !my.autoAim && !my.autoAim && !clicks.right && !my.SpikeAim && !my.TrapAim && !ae86Dir && !getEl("weapongrind").checked) {
                    } else {
                        return lastDir || 0;
                    }
                } else {
                    return lastDir || 0;
                }
            }
            let plusDir = 0;
            let lastSpin = Date.now();
            function getdir() {
                lastDir = Math.random() * Math.PI * 2;
            }
            function getVisualDir() {
                if(player && Date.now() - lastSpin >= 235 && !clicks.right && !clicks.left && !instaC.isTrue && !traps.inTrap && !instaC.isTrue && !my.autoAim && secPacket <= 44) {
                    plusDir += UTILS.fixTo(Math.random()*(Math.PI*2), 1);
                    lastSpin = Date.now();
                }
                if (!player)
                    return 0;
                if (my.InstaAim || my.BullAim || my.autoAim) {
                    lastDir = enemy.length ? near.aim2 : getSafeDir();
                } else if (my.SpikeAim && !instaC.isTrue) {
                    if ((player.reloads[player.weapons[1] == 10 ? player.weapons[canSecondary] : player.weapons[0]] == 0) || traps.inTrap) {
                        lastDir = SpikeDir();
                    } else {
                        lastDir = plusDir;
                    }
                } else if (my.TeleAim && !instaC.isTrue && !my.autoAim) {
                    lastDir = TeleDir();
                } else if (my.TrapAim && !instaC.isTrue) {
                    if ((player.reloads[player.weapons[1] == 10 ? player.weapons[canSecondary] : player.weapons[0]] == 0) || traps.inTrap) {
                        lastDir = SpikeDir();
                    } else {
                        lastDir = plusDir;
                    }
                } else if (my.MillAim && !instaC.isTrue) {
                    lastDir = MillDir();
                } else if (enemy.length && clicks.left && player.reloads[player.weapons[0]] == 0) {
                    lastDir = getEl("weapongrind").checked ? getSafeDir() : enemy.length ? near.aim2 : getSafeDir();
                } else if (clicks.right && player.reloads[player.weapons[1] == 10 ? player.weapons[1] : player.weapons[0]] == 0) {
                    lastDir = getSafeDir();
                } else if (instaType && traps.inTrap && !AntiBull && !clicks.left && !clicks.right) {
                    if (player.reloads[traps.notFast() ? player.weapons[1] : player.weapons[0]] == 0) {
                        lastDir = traps.aim;
                    } else {
                        lastDir = traps.aim;
                    }
                } else if (!player.lockDir && !my.autoAim) {
                    if(near.dist2 <= 270 && traps.inTrap && !clicks.left && !clicks.right) {
                    } else {
                        if (ae86Dir && !clicks.right && !clicks.left && !instaC.isTrue && !traps.inTrap && !instaC.isTrue && !my.autoAim && secPacket <= 44) {
                            lastDir = plusDir;
                        } else {
                            lastDir = getSafeDir();
                        }
                    }
                }

                if(noDirMy) {
                    if(!clicks.left && !traps.inTrap && !my.autoAim && !my.BullAim && !my.InstaAim && !player.lockDir && !my.autoAim && !clicks.right && !my.SpikeAim && !my.TrapAim && !getEl("weapongrind").checked) {
                    } else {
                        return lastDir || 0;
                    }
                } else {
                    return lastDir || 0;
                }
            }

            function keysActive() {
                return (allianceMenu.style.display != "block" &&
                        chatHolder.style.display != "block");
            }
            let canMenuchat = false, checkOneFrame = false;
            document.querySelector("#leaderboardButton").addEventListener('click', function () {
                canMenuchat = !canMenuchat;
                MenuRangeIsTrue = false;
                $("#allianceMenu").hide();
                $("#storeMenu").hide();
            });
            let checkPreInsta = false, MouseClicks = false, noDirMy = false, CanClick = true;
            function keyDown(event) {
                let keyNum = event.which || event.keyCode || 0;
                if (keyNum == 27) {
                    MenuRangeIsTrue = !MenuRangeIsTrue;
                    $("#allianceMenu").hide();
                    $("#storeMenu").hide();
                    canMenuchat = false;
                }
                if (player && player.alive && keysActive()) {
                    if (!keys[keyNum]) {
                        keys[keyNum] = 1;
                        macro[event.key] = 1;
                        if (keyNum == 49) {
                            canPrimary = true;
                        } else if (keyNum == 50) {
                            canPrimary = false;
                        } else if (keyNum == 82 && player.reloads[53] == 0 && player.reloads[player.weapons[0]] == 0 && player.reloads[player.weapons[1]] == 0 && !instaC.isTrue) {
                            instaType = false;
                            instaC.can = true;
                            game.tickBase(() => {
                                instaType = true;
                            }, 2);
                        } else if (keyNum == 84) {
                            checkPreInsta = !checkPreInsta;
                            let AtIn = setInterval(() => {
                                if (!traps.inTrap && near.dist2 <= items.weapons[player.weapons[0]].range + near.scale * 1.8 && player.reloads[53] == 0 && near.skinIndex != 6 && player.reloads[player.weapons[0]] == 0 && player.reloads[player.weapons[1]] == 0) {
                                    instaType = false;
                                    instaC.can = true;
                                    game.tickBase(() => {
                                        clearInterval(AtIn);
                                        game.tickBase(() => {
                                            instaType = true;
                                            checkPreInsta = false;
                                        }, 1);
                                    }, 1);
                                }
                                !checkPreInsta && clearInterval(AtIn);
                            }, 0);
                            if (checkPreInsta) {
                                container.style.opacity = '1';
                                container.textContent = 'PreInsta';
                            } else {
                                container.style.opacity = '1';
                                container.textContent = 'PreInsta: Clear';
                            }
                            setTimeout(() => {
                                container.style.opacity = '0';
                            }, 3000);
                        } else if (keyNum == 89) {
                            checkOneFrame = !checkOneFrame;
                            if (checkOneFrame) {
                                instaC.OneFrameType();
                                container.style.opacity = '1';
                                container.textContent = 'OneTick';
                            } else {
                                instaC.isTrue = false;
                                container.style.opacity = '1';
                                container.textContent = 'OneTick: Clear';
                            }
                            setTimeout(() => {
                                container.style.opacity = '0';
                            }, 3000);
                        } else if (keyNum == 191) {
                            window.zoomvis();
                            container.style.opacity = '1';
                            container.textContent = 'Reset Zoom';
                            setTimeout(() => {
                                container.style.opacity = '0';
                            }, 3000);
                        } else if(keyNum == 221) {
                            window.debug();
                        } else if (keyNum == 80) {
                            noDirMy = !noDirMy;
                            if (noDirMy) {
                                container.style.opacity = '1';
                                container.textContent = 'Wasd-M: On';
                            } else {
                                container.style.opacity = '1';
                                container.textContent = 'Wasd-M: Off';
                            }
                            setTimeout(() => {
                                container.style.opacity = '0';
                            }, 3000);
                        } else if(keyNum == 222 && player.reloads[player.weapons[1]] == 0 && (player.reloads[53] == 0 || near.skinIndex != 6 || !player.skins[53])) {
                            instaC.syncTry();
                            container.style.opacity = '1';
                            container.textContent = 'HEADSHOT';
                            setTimeout(() => {
                                container.style.opacity = '0';
                            }, 3000);
                        } else if (keyNum == 188 && !traps.inTrap && enemy.length && player.reloads[53] == 0 && player.reloads[player.weapons[0]] == 0 && !instaC.isTrue) {
                            instaC.bowInstaCheck();
                            container.style.opacity = '1';
                            container.textContent = 'Bow-Insta Check Emp';
                            setTimeout(() => {
                                container.style.opacity = '0';
                            }, 3000);
                        } else if (keyNum == 79) {
                            pAB = pAB ? false : true;
                            if (pAB) {
                                container.style.opacity = '1';
                                container.textContent = 'pAB: On';
                            } else {
                                container.style.opacity = '1';
                                container.textContent = 'pAB: Off';
                            }
                            setTimeout(() => {
                                container.style.opacity = '0';
                            }, 3000);
                        } else if (keyNum == 219) {
                            sendAutoGather();
                        } else if (keyNum == 69) {
                            MouseClicks = !MouseClicks;
                            if (MouseClicks) {
                                container.style.opacity = '1';
                                container.textContent = 'Clicks: On';
                            } else {
                                container.style.opacity = '1';
                                container.textContent = 'Clicks: Off';
                            }
                            setTimeout(() => {
                                container.style.opacity = '0';
                            }, 3000);
                        } else if (keyNum == 67) {
                            updateMapMarker();
                            container.style.opacity = '1';
                            container.textContent = 'Map Marker';
                            setTimeout(() => {
                                container.style.opacity = '0';
                            }, 3000);
                        } else if (player.weapons[keyNum - 49] != undefined) {
                            player.weaponCode = player.weapons[keyNum - 49];
                        } else if (moveKeys[keyNum]) {
                            sendMoveDir();
                        } else if (event.key == "m") {
                            mills.placeSpawnPads = !mills.placeSpawnPads;
                            if (mills.placeSpawnPads) {
                                container.style.opacity = '1';
                                container.textContent = 'Sp-Pads: On';
                            } else {
                                container.style.opacity = '1';
                                container.textContent = 'Sp-Pads: Off';
                            }
                            setTimeout(() => {
                                container.style.opacity = '0';
                            }, 3000);
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
                            if (mills.place) {
                                container.style.opacity = '1';
                                container.textContent = 'Auto Mill: On';
                            } else {
                                container.style.opacity = '1';
                                container.textContent = 'Auto Mill: Off';
                            }
                            setTimeout(() => {
                                container.style.opacity = '0';
                            }, 3000);
                        }
                    }
                }
            }
            addEventListener("keydown", UTILS.checkTrusted(keyDown));
            function keyUp(event) {
                if (player && player.alive) {
                    let keyNum = event.which || event.keyCode || 0;
                    if (keysActive()) {
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
                    if (!my.autoPush && !getEl("weapongrind").checked && !my.TeleAim && !my.SpikeAim && ((!my.TrapAim && !my.MillAim) || near.dist2 <= 350) && !pathFind.active) packet("a", newMoveDir, 1);
                    lastMoveDir = newMoveDir;
                    player.randDIff = Math.random * Math.PI * 2;
                }
            }

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
                        if (UTILS.getDist(pathFind.go_to_nearest_enemy ? near : pathFind, tmpXY, pathFind.go_to_nearest_enemy ? 2 : 0, 0) <= (pathFind.go_to_nearest_enemy ? 35 : 60)) {
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

            let cSp = true;
            function sn(m) {
                io.send("6", m);
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
                    }, 59000);
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
                    setTimeout(()=>{
                        canMusic2 = true;
                    }, 130000);
                }else{
                    return;
                }
            }
            function cH(){
                if(cSp && document.activeElement.id.toLowerCase() !== 'chatbox'){
                    setTimeout(()=>{
                        if(cSp && document.activeElement.id.toLowerCase() !== 'chatbox'){
                            sn("We at the top again, now what?");
                        }else{
                            return;
                        }
                    }, 2000);
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
                            sn("of greatness");
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
                            sn("even if itÃƒÆ’Ã‚ ¢Ãƒ ¢Ã¢â‚¬Å¡Ã‚ ¬Ãƒ ¢Ã¢â‚¬Å¾Ã‚ ¢s too late");
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
                    setTimeout(()=>{
                        if(cSp){
                            cH()
                        }else{
                            return;
                        }
                    }, 225000);
                    setTimeout(()=>{
                        canMusic1 = true;
                    }, 226000);
                }else{
                    return;
                }
            }

            document.getElementById("fadeOutContainer").style.top = "20px";
            document.getElementById("fadeOutContainer").style.left = "20px";

            $("#gameUI").append($("#killCounter")[0]);
            $("#gameUI").append($("#fadeOutContainer")[0]);
            $("#gameUI").css("opacity", "0");

            //Intervals
            setInterval(() => {
                if (getEl("lightmode").checked) {
                    $(".menuClass").css({ 'background-color': 'rgba(20, 20, 20, 0.4);', });
                    $(".menuClassBest").css({ 'background-color': 'rgba(30, 30, 30, 0.55);', });
                    document.querySelector(".menuClass").style.backdropFilter = 'blur(1px)';
                    document.querySelector(".menuClassBest").style.backdropFilter = 'blur(1px)';
                } else {
                    $(".menuClass").css({ 'background-color': 'rgba(20, 20, 20, 0.85);', });
                    $(".menuClassBest").css({ 'background-color': 'rgba(30, 30, 30);', });
                    document.querySelector(".menuClass").style.backdropFilter = 'blur(0px)';
                    document.querySelector(".menuClassBest").style.backdropFilter = 'blur(0px)';
                }

                $("#topInfoHolder").css({ 'opacity': configs7.LeaderBoard ? '1' : '0', });

                if (getEl('placertypes').value == "trapsPlace") {
                    useWasd = false;
                } else {
                    useWasd = true;
                }
                if (player && player.alive && inGame) {
                    if (itemInfoHolder.classList.contains("uiElement") && itemInfoHolder.classList.contains("visible")) {
                        document.getElementById("fadeOutContainer").style.left = "300px";
                    } else {
                        document.getElementById("fadeOutContainer").style.left = "20px";
                    }
                    game.tickBase(() => {
                        $("#gameUI").css("opacity", "1");
                    }, 2);

                    SimpleGrids = $('#slider').val(); MenuEqualizer = $('#menuequalizer').val() / 100; MenuNight = $('#menunight').val() / 100; ; Players = $('#players').val() / 100;

                    if (!config.anotherVisualTurn) {
                        config.anotherVisualTurn = true;
                    }
                    $("#killCounter").show();
                } else {
                    $("#gameUI").css("opacity", "0");
                    MenuRangeIsTrue2 = false;
                    canMenuchat = false;
                    config.anotherVisualTurn = false;
                    $("#killCounter").hide();
                }

                if (MenuRangeIsTrue) {
                    document.querySelector(".menuClass").classList.add("moveRight");
                } else {
                    document.querySelector(".menuClass").classList.remove("moveRight");
                }
                if (allianceMenu.style.display === "block" || storeMenu.style.display === "block") { if (player.alive && player) MenuRangeIsTrue = false; $(".menuClass").css({ 'opacity': '0', 'pointer-events': 'none' }); } else {
                    $(".menuClass").css({ 'opacity': MenuRangeIsTrue ? '1' : '0', 'pointer-events': MenuRangeIsTrue ? 'auto' : 'none' }); }
                if (allianceMenu.style.display === "block" || storeMenu.style.display === "block") { MenuRangeIsTrue = false; $(".menuClassBest").css({ 'opacity': '0', 'pointer-events': 'none' }); } else {
                    $(".menuClassBest").css({ 'opacity': MenuRangeIsTrue ? '1' : '0', 'pointer-events': MenuRangeIsTrue ? 'auto' : 'none' });}


                if (allianceMenu.style.display === "block" || storeMenu.style.display === "block") { canMenuchat = false; $("#menuChatDiv").css({ 'opacity': '0', 'pointer-events': 'none' }); } else {
                    $("#menuChatDiv").css({ 'opacity': canMenuchat ? '1' : '0', 'pointer-events': canMenuchat ? 'auto' : 'none' }); }
            }, 0);

            var songs;
            var converToJSDelay = (time) => {
                let newTime = time.split(":").reverse();
                time = 0;
                let convert = [6e4 * 60, 6e4, 1000, 1].reverse();
                newTime.forEach((b, c) => {
                    time += b * convert[c];
                });
                return time;
            };
            let chatting = false;
            document.addEventListener("keypress", function(e) {
                if (e.key == "Enter") {
                    chatting = !chatting
                }
            });

            function createPath() {
                grid = [];
                checkObject();
            }
            function Move() {
                const trap1 = gameObjects
                .filter((e) => e.trap && e.active)
                .sort((a, b) => UTILS.getDist(a, near, 0, 2) - UTILS.getDist(b, near, 0, 2))
                .find((trap) => {
                    const trapDist = Math.sqrt((trap.y - near.y2)**2 + (trap.x - near.x2)**2);
                    return (
                        trap !== player &&
                        (player.sid === trap.owner.sid || findAllianceBySid(trap.owner.sid)) &&
                        trapDist <= 50
                    );
                });
                ResetActions();
                if (player.shameCount > 5 && near.dist2 < 500) {
                    packet("a", near.aim2 + Math.PI, 1);
                } else if (near.dist2 <= items.weapons[player.weaponIndex].range + near.scale * 1.8 && trap1) {
                    packet("a", undefined, 1);
                } else if(!trap1 && near.dist2 < items.weapons[player.weaponIndex].range + near.scale * 1.8){
                    packet("a", near.aim2 + Math.PI, 1);
                } else if(near.dist2 >= items.weapons[player.weaponIndex].range + near.scale * 1.8){
                    packet("a", near.aim2, 1);
                }
            }
            function Pathfinder() {
                if (secPacket >= 85) return;
                let niglet = pathFind;
                let tracker = traps;
                niglet.scale = (config.maxScreenWidth / 2) * 1.3;
                if (!tracker.inTrap && enemy.length) {
                    if (near.dist2 <= items.weapons[player.weapons[0]].range) {
                        Move();
                    } else {
                        createPath();
                        easystar.setGrid(grid);
                        easystar.setAcceptableTiles([0]);
                        easystar.enableDiagonals();
                        easystar.findPath((grid[0].length / 2), (grid.length / 2), niglet.lastX, niglet.lastY, function(path) {
                            if (path === null) {
                                niglet.array = [];
                                Move();
                            } else {
                                niglet.array = path;
                                if (niglet.array.length > 1) {
                                    let tmpXY = {
                                        x: (player.x2 - (niglet.scale / 2)) + ((niglet.scale / niglet.grid) * path[1].x),
                                        y: (player.y2 - (niglet.scale / 2)) + ((niglet.scale / niglet.grid) * path[1].y)
                                    }
                                    io.send("a", UTILS.getDirect(tmpXY, player, 0, 2), 1);
                                }
                            }
                        });
                        easystar.calculate();
                    }
                }
            }

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
            let canPrimary = true;
            function ClicksGrind() {
                if (player.empAnti) {
                    buyEquip(22, 0);
                } else {
                    if (getEl("weapongrind").checked && canPrimary) {
                        if ((player.weaponIndex != player.weapons[0]) || player.buildIndex > -1) {
                            selectWeapon(player.weapons[0]);
                        }
                        my.canHat = false;
                        if (player.reloads[player.weapons[0]] == 0 && !my.waitHit) {
                            buyEquip(40, 0);
                            sendAutoGather();
                            my.waitHit = 1;
                            game.tickBase(() => {
                                buyEquip(6, 0);
                                sendAutoGather();
                                my.waitHit = 0;
                            }, 1);
                        }
                        buyEquip(11, 1);
                    } else if (!canPrimary){
                        if ((player.weaponIndex != (player.weapons[1] == 10 ? player.weapons[1] : player.weapons[0])) || player.buildIndex > -1) {
                            selectWeapon(player.weapons[1] == 10 ? player.weapons[1] : player.weapons[0]);
                        }
                        my.canHat = false;
                        if (player.reloads[player.weapons[1] == 10 ? player.weapons[1] : player.weapons[0]] == 0 && !my.waitHit) {
                            buyEquip(40, 0);
                            sendAutoGather();
                            my.waitHit = 1;
                            game.tickBase(() => {
                                buyEquip(6, 0);
                                sendAutoGather();
                                my.waitHit = 0;
                            }, 1);
                        }
                        buyEquip(11, 1);
                    }
                }
            }

            function autoPush() {
                const nearTrap = gameObjects
                .filter(tmp => tmp.trap && tmp.active && tmp.isTeamObject(player) && UTILS.getDist(tmp, near, 0, 2) <= near.scale + tmp.getScale() + 5)
                .sort((a, b) => UTILS.getDist(a, near, 0, 2) - UTILS.getDist(b, near, 0, 2))[0];

                if (nearTrap) {
                    const spike = gameObjects
                    .filter(tmp => tmp.dmg && tmp.active && tmp.isTeamObject(player) && UTILS.getDist(tmp, nearTrap, 0, 0) <= near.scale + nearTrap.scale + tmp.scale)
                    .sort((a, b) => UTILS.getDist(a, near, 0, 2) - UTILS.getDist(b, near, 0, 2))[0];

                    if (spike) {
                        const angle = UTILS.getDirect(near, spike, 2, 0);
                        const pushDistance = 250;
                        const pushAngle = UTILS.getDirect(near, spike, 2, 0);
                        const pos = {
                            x: spike.x + pushDistance * Math.cos(pushAngle),
                            y: spike.y + pushDistance * Math.sin(pushAngle),
                            x2: spike.x + (UTILS.getDist(near, spike, 2, 0) + player.scale) * Math.cos(pushAngle),
                            y2: spike.y + (UTILS.getDist(near, spike, 2, 0) + player.scale) * Math.sin(pushAngle),
                        };

                        const isColliding = gameObjects
                        .filter(tmp => tmp.active && !tmp.ignoreCollision)
                        .some(tmp => UTILS.lineInRect(tmp.x - tmp.getScale(), tmp.y - tmp.getScale(), tmp.x + tmp.getScale(), tmp.y + tmp.getScale(), player.x2, player.y2, pos.x2, pos.y2));

                        if (isColliding) {
                            my.autoPush = false;
                            packet("a", lastMoveDir || undefined, 1);
                        } else {
                            my.autoPush = true;
                            let niglet = pathFind;
                            let tracker = traps;
                            niglet.scale = (config.maxScreenWidth / 2) * 1.3;
                            if (!tracker.inTrap && enemy.length) {
                                if (near.dist2 <= items.weapons[player.weapons[0]].range + near.scale * 4.5) {
                                    my.pushData = {
                                        x: spike.x,
                                        y: spike.y,
                                        x2: pos.x2,
                                        y2: pos.y2
                                    };

                                    const scale = player.scale / 10;
                                    if (UTILS.lineInRect(player.x2 - scale, player.y2 - scale, player.x2 + scale, player.y2 + scale, near.x2, near.y2, pos.x, pos.y)) {
                                        if (UTILS.getDist(near, spike, 2, 0) + player.scale <= 0) return;
                                        packet("a", near.aim2, 1);
                                    } else {
                                        packet("a", UTILS.getDirect(pos, player, 2, 2), 1);
                                    }
                                } else {
                                    if (secPacket >= 88) return;
                                    createPath();
                                    easystar.setGrid(grid);
                                    easystar.setAcceptableTiles([0]);
                                    easystar.enableDiagonals();
                                    easystar.findPath((grid[0].length / 2), (grid.length / 2), niglet.lastX, niglet.lastY, function(path) {
                                        if (path === null) {
                                            niglet.array = [];
                                            my.pushData = {
                                                x: spike.x,
                                                y: spike.y,
                                                x2: pos.x2,
                                                y2: pos.y2
                                            };

                                            const scale = player.scale / 10;
                                            if (UTILS.lineInRect(player.x2 - scale, player.y2 - scale, player.x2 + scale, player.y2 + scale, near.x2, near.y2, pos.x, pos.y)) {
                                                if (UTILS.getDist(near, spike, 2, 0) + player.scale <= 0) {
                                                    packet("a", undefined, 1);
                                                } else {
                                                    packet("a", near.aim2, 1);
                                                }
                                            } else {
                                                packet("a", UTILS.getDirect(pos, player, 2, 2), 1);
                                            }
                                        } else {
                                            niglet.array = path;
                                            if (niglet.array.length > 1) {
                                                let tmpXY = {
                                                    x: (player.x2 - (niglet.scale / 2)) + ((niglet.scale / niglet.grid) * path[1].x),
                                                    y: (player.y2 - (niglet.scale / 2)) + ((niglet.scale / niglet.grid) * path[1].y)
                                                }
                                                io.send("a", UTILS.getDirect(tmpXY, player, 0, 2), 1);
                                            }
                                        }
                                    });
                                    easystar.calculate();
                                }
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



            function addDeadPlayer(tmpObj) {
                deadPlayers.push(new DeadPlayer(tmpObj.x, tmpObj.y, tmpObj.dir, tmpObj.buildIndex, tmpObj.weaponIndex, tmpObj.weaponVariant, tmpObj.skinColor, tmpObj.scale, tmpObj.name));
            }
            function setInitData(data) {
                alliances = data.teams;
            }

            function secondSocket() {
                let time = Date.now();
                const e = time - second;
                window.pingTime = e;
            }
            var lastPing = -1;
            var maxPing = NaN;
            var minPing = NaN;
            var pingCount = 0;

            function pingSocketResponse() {
                let pingTime = window.pingTime;
                pingCount++;
                if (pingTime > ms.max || isNaN(ms.max)) {
                    ms.max = pingTime;
                }
                if (pingTime < ms.min || isNaN(ms.min)) {
                    ms.min = pingTime;
                }
            }

            function pingSocket() {
                lastPing = Date.now();
                io.send('0');
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
            pointer-events: none;
            opacity: 0;
            padding: 10px;
            background-color: rgba(0, 0, 0, 0.25);
            border-radius: 4px;
            position: absolute;
            right: 275px;
            top: 20px;
            width: 200px;
            transition: 1s;
            z-index: 999999;
            backdrop-filter: blur(2px);
            box-shadow: 2px 2px 4px 2px rgba(0,0,0,0.3);
        `;

                    setInterval(() => {
                        $("#GraphMenu").css({ 'opacity': getEl("equalizer").checked && player && player.alive && inGame ? '1' : '0' });
                        $("#GraphMenu").css({ 'right': configs7.LeaderBoard ? '275px' : '20px' });
                        $("#GraphMenu").css({
                            "background-color": `rgba(0, 0, 0, ${MenuEqualizer})`
                        });
                    }, 10);
                    var t = document.createElement("canvas");
                    e.appendChild(t);
                    document.body.appendChild(e);
                    var i = t.getContext("2d");
                    var a = {
                        labels: Array.from({ length: 4 }, (e, t) => ""),
                        datasets: [{
                            label: "Ping",
                            data: Array.from({ length: 4 }, () => 0),
                            fill: true,
                            borderColor: "#fff",
                            backgroundColor: GraphColor,
                            pointRadius: Array.from({ length: 4 }, () => 0),
                        }]
                    };
                    var n = new Chart(i, {
                        type: "line",
                        data: a,
                        options: {
                            plugins: {
                                legend: { display: false, labels: {} },
                                title: { display: false }
                            },
                            elements: {
                                line: { fill: false, borderColor: GraphColor, tension: 0.2, borderWidth: 2.5 }
                            },
                            scales: {
                                x: { grid: {} },
                                y: { grid: {} }
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

            let style = document.createElement("style");
            style.innerHTML = `
    #GraphMenu .chartjs-size-monitor,
    #GraphMenu .chartjs-size-monitor-expand,
    #GraphMenu .chartjs-size-monitor-shrink,
    #GraphMenu .chartjs-size-monitor,
    #GraphMenu .chartjs-size-monitor-expand,
    #GraphMenu .chartjs-size-monitor-shrink,
    #GraphMenu .chartjs-tooltip,
    #GraphMenu .chartjs-tooltip label,
    #GraphMenu .chartjs-tooltip span {
        color: #000 !important;
    }
`;
            document.getElementsByTagName('head')[0].appendChild(style);

            var fisrtloadez = false;
            function setupGame(yourSID) {
                keys = {};
                macro = {};
                playerSID = yourSID;
                attackState = 0;
                inGame = true;
                fisrtloadez = true;
                packet("d", 0, getAttackDir(), 1);
                if (firstSetup) {
                    firstSetup = false;
                    gameObjects.length = 0;
                }
            }
            function addPlayer(data, isYou) {
                let tmpPlayer = findPlayerByID(data[0]);
                if (!tmpPlayer) {
                    tmpPlayer = new Player(data[0], data[1], config, UTILS, projectileManager,
                                           objectManager, players, ais, items, hats, accessories);
                    players.push(tmpPlayer);
                    container.style.opacity = '1';
                    container.innerHTML = `<span class="yellowText">Encountered</span> <span class="whiteText">${data[2]}</span>`;
                    setTimeout(() => {
                        container.style.opacity = '0';
                    }, 2000);
                } else {
                    container.style.opacity = '1';
                    container.innerHTML = `<span class="yellowText">Encountered</span> <span class="whiteText">${data[2]}</span>`;
                    setTimeout(() => {
                        container.style.opacity = '0';
                    }, 2000);
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
            function removePlayer(id) {
                for (let i = 0; i < players.length; i++) {
                    if (players[i].id == id) {
                        let tmpPlayer = players[i];
                        container.style.opacity = '1';
                        addChatLog(tmpPlayer.name + " left the game.", "red", "", "red");
                        container.innerHTML = `<span class="redText">${tmpPlayer.name}</span> <span class="whiteText">left the game.</span>`;
                        setTimeout(() => {
                            container.style.opacity = '0';
                        }, 2000);
                        players.splice(i, 1);
                        break;
                    }
                }
            }
            var newHatImgs = {
                //6: "https://images-ext-1.discordapp.net/external/RuYrUql1GgCuG81ke3xRHspUzSiihMNeD_qJpNXYcm4/https/i.imgur.com/HjWADL7.png?format=webp&quality=lossless&width=320&height=320",
                15: "https://i.imgur.com/YRQ8Ybq.png",
                //7: "https://i.imgur.com/vAOzlyY.png",
                40: "https://i.imgur.com/Xzmg27N.png",
            };
            var newAccImgs = {
                21: "https://i.imgur.com/4ddZert.png",
                //11: "https://media.discordapp.net/attachments/386994737090920450/688645620235501615/access_11.png?ex=65ffd236&is=65ed5d36&hm=992593faf17df90c62decd81490da7ace7036145fb3cb1995b4689df326b7cb4&=&format=webp&quality=lossless",
            };
            var newWeaponImgs = {
                //"great_hammer_1_d": "https://media.discordapp.net/attachments/1208831833018732617/1217052153915637852/great_hammer_2_d.png?ex=66029f25&is=65f02a25&hm=8ce80cfdcf77ec50fd782245f8fd21f16d9d846165cbcc82bb046e28013c18e8&=&format=webp&quality=lossless&width=320&height=320",
                //"great_hammer_1_g": "https://media.discordapp.net/attachments/1208831833018732617/1215637990659989564/great_hammer_1_g.png?ex=65fd7a1a&is=65eb051a&hm=181645ced03872f9512758a966cc2911032887217126fac0879fdad38d03c600&=&format=webp&quality=lossless&width=320&height=320",
            };

            function getTexturePackImg(index, type) {
                if(newHatImgs[index] && type == "hat") {
                    return newHatImgs[index];
                }else if(newAccImgs[index] && type == "acc") {
                    return newAccImgs[index];
                }else if(newWeaponImgs[index] && type == "weapons") {
                    return newWeaponImgs[index];
                }else {
                    if(type == "acc") {
                        return ".././img/accessories/access_" + index + ".png";
                    }else if(type == "hat") {
                        return ".././img/hats/hat_" + index + ".png";
                    }else {
                        return ".././img/weapons/" + index + ".png";
                    }
                }
            }
            function updateHealth(sid, value) {
                tmpObj = findPlayerBySID(sid);
                if (tmpObj) {
                    tmpObj.oldHealth = tmpObj.health;
                    tmpObj.health = value;
                    tmpObj.judgeShame();
                    if (tmpObj.oldHealth > tmpObj.health) {
                        if (tmpObj == near) {
                            let damage = tmpObj.oldHealth - tmpObj.health;
                            if (tmpObj.skinIndex == 7 && (damage == 5 || (tmpObj.latestTail == 0 && damage == 2))) {
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
                                container.style.opacity = '1';
                                if (tmpObj != player) {
                                    container.innerHTML = `<span class="yellowText">${tmpObj.name}</span> <span class="whiteText">died.</span>`;
                                } else {
                                    container.innerHTML = `<span class="redText">${tmpObj.name}</span> <span class="whiteText">died.</span>`;
                                }
                                setTimeout(() => {
                                    container.style.opacity = '0';
                                }, 2000);
                                addDeadPlayer(tmpObj);
                            }
                        }
                        if (tmpObj == player) {
                            if (tmpObj.skinIndex == 7 && (damaged == 5 || (tmpObj.latestTail == 0 && damaged == 2))) {
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
                                    setTimeout(() => {
                                        healer();
                                    }, timer);
                                }
                                if(antiSync || my.antiSync || autoQ) {
                                    tmpObj.canEmpAnti = false;
                                }
                                let d = tmpObj.damaged;
                                let AD;
                                let AC;
                                let AKH;
                                AKH = near.weaponIndex == 5|| configs3.AntiPh || player.skinIndex != 6 ? 8 : 20;
                                AD = near.weaponIndex == 7 ? 36 : AKH;
                                AC = near.weaponIndex == 7 ? 36 : 20;
                                if (damaged >= (includeSpikeDmgs ? AC : AD) && tmpObj.damageThreat >= 25 && (game.tick - tmpObj.antiTimer) > 1 && player.shameCount < 5) {
                                    tmpObj.antiTimer = game.tick;
                                    if ((d == 26 || d == 23 || d == 27 || d == 22) || (player.skinIndex != 6 && (d == 35 || d == 45) || (player.skinIndex == 6 && (d == 26 || d == 34 || d == 33)))) {
                                        healer();
                                    } else if(!instaC.isTrue && (!AntiBull || player.shameCount > 3) && !checkOneFrame && (!autobullspam || player.reloads[player.weapons[1]] != 0 || (player.skinIndex === 6 && player.shameCount >= 3)) && ((!traps.inTrap && !clicks.left && !clicks.right && !my.TrapAim && !my.SpikeAim) || (player.skinIndex === 6 && player.shameCount >= 3)) && player.shameCount != 0 && window.pingTime <= 90 && (d < 37 || d > 38) && d > 25 && d < 50) {
                                        tmpObj.canEmpAnti = true;
                                        slowHeal(healTimeout);
                                    } else {
                                        healer();
                                    }
                                } else {
                                    if (player.shameCount >= 5) {
                                        if (damaged > 25) tmpObj.canEmpAnti = true;
                                    }
                                    slowHeal(healTimeout);
                                }
                            }
                            if (damaged > 10 && AntiBull && (traps.canHit() || clicks.middle) && (player.tailIndex == 21 || player.skinIndex == 11)) instaC.canCounter = true;
                        } else {
                            if (!tmpObj.setPoisonTick && ((tmpObj.damaged == 5 && tmpObj.skinIndex != 6) || (tmpObj.damaged == 4 && tmpObj.skinIndex == 6) || (tmpObj.latestTail == 13 && tmpObj.damaged == 2))) {
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
                }
            }
            function checkName(name){
                let S = name + "";
                S = S.slice(0, 15);
                S = S.replace(/[^\w:\(\)\/? -]+/gmi, " ");
                S = S.replace(/[^\x00-\x7F]/g, " ");
                S = S.trim();

                let O = false;
                let U = S.toLowerCase().replace(/\s/g, "").replace(/1/g, "i").replace(/0/g, "o").replace(/5/g, "s");

                for(const L of items.list){
                    if(U.indexOf(L) != -1){
                        O = true;
                        break;
                    }
                }

                if(S.length > 0 && !O){
                    return S;
                } else {
                    return "unknown";
                }
            }

            function getRandomName(){
                let symbols = 'qwertyuiopasdfghjklzxcvbnmQWERTYUIOPASDFGHJKLZXCVBNM1234567890_';
                let name = '';

                for(let i = 0;i < 15;i++){
                    name += symbols[Math.floor(Math.random() * (symbols.length - 1))];
                }

                name = checkName(name);
                if(name == 'unknown'){
                    return getRandomName();
                } else {
                    return name;
                }
            }
            function killPlayer() {
                inGame = false;
                lastDeath = {
                    x: player.x,
                    y: player.y,
                };
                if (false) {
                    packet("M", {
                        name: lastsp[0],
                        moofoll: lastsp[1],
                        skin: lastsp[2]
                    });
                }
            }
            function isElementVisible(e) {
                return (e.offsetParent !== null);
            }
            let testToggle = true;
            let Le = document.getElementById("nameInput");
            setInterval(() => {
                if (player && player.alive) {
                    document.getElementById("mainMenu").style.backgroundImage = "url()";
                }
                if(isElementVisible(document.getElementById("enterGame"))) {
                    document.getElementById('promoImgHolder').innerHTML =
                        `
                        <style>
                        #top-wrap-right { color: #333;
                        } .check-box {transform: scale(1.1);
                        } .inParty {display: none;
                        } input[type="checkbox"] { background: rgba(200, 200, 200, 0.1); position: relative; appearance: none; width: 33px; height: 15.5px; border-radius: 50px; box-shadow: inset 0 0 5px rgba(41, 41, 41, 0.8); cursor: pointer; top: 7.5px; transition: 0.7s;
                        } input:checked[type="checkbox"] { background: rgba(200, 200, 200, 0.5);
                        } input[type="checkbox"]::after { position: absolute; content: ""; width: 15.5px; height: 15.5px; top: 0; left: 0; background: #fff; border-radius: 50%; box-shadow: 0 0 5px rgba(0, 0, 0, 0.9); transform: scale(1.1); transition: 0.7s;
                        } input:checked[type="checkbox"]::after { left: 50%; }
                        </div><br>
                        `
                } else {
                    document.getElementById('promoImgHolder').innerHTML =
                        `
                        <style>
                        #top-wrap-right { color: #333;
                        } .check-box {transform: scale(1.1);
                        } .inParty {display: none;
                        } input[type="checkbox"] { position: relative; background: rgba(100, 100, 100, 0.5); appearance: none; width: 33px; height: 15.5px; border-radius: 50px; box-shadow: inset 0 0 5px rgba(41, 41, 41, 0.8); cursor: pointer; top: 7.5px; transition: 0.7s;
                        } input:checked[type="checkbox"] { background: rgba(50, 50, 50, 0.7);
                        } input[type="checkbox"]::after { position: absolute; content: ""; width: 15.5px; height: 15.5px; top: 0; left: 0; background: #fff; border-radius: 50%; box-shadow: 0 0 5px rgba(200, 200, 200, 0.2); transform: scale(1.1); transition: 0.7s;
                        } input:checked[type="checkbox"]::after { left: 50%; }
                        </div><br>
                        `
                }
            }, 300);

            function updateItemCounts(index, value) {
                if (player) {
                    player.itemCounts[index] = value;
                    updateItemCountDisplay(index);
                }
            }
            var ageText = getEl("ageText");
            var ageBarBody = getEl("ageBarBody");
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
                    ageBarBody.style.transition = "2s";
                }
            }
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
                        upgradeCounter.innerHTML = "Select Items (" + points + ")";
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
                if (configs.AutoUpgrade && stopUp) {
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
                    }
                }
            }
            function cdf(e, t) {
                try {
                    return Math.sqrt((t.y2 || t.y) - (e.y2 || e.y), (t.x2 || t.x) - (e.x2 || e.x));
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
                        breakTrackers.push({x: findObj.x, y: findObj.y});
                    }
                    if (breakTrackers.length > 8) {
                        breakTrackers.shift();
                    }
                    traps.replacer(findObj);
                }
            }
            function killObjects(sid) {
                if (player) objectManager.removeAllItems(sid);
            }
            function fgdo(a, b) {
                return Math.sqrt(Math.pow((b.y - a.y), 2) + Math.pow((b.x - a.x), 2));
            }

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

            let autoQ = false;
            let AutoQ = false;
            let previousCoords = { x: null, y: null };
            function updatePlayers(data) {
                game.tick++;
                enemy = [];
                nears = [];
                near = [];
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
                                            if (!tmp.pps && tmpObj.sid == tmp.owner.sid && UTILS.getDist(tmp, tmpObj, 0, 2) > (parseInt(700) || 0) && !tmp.breakObj && ![13, 14, 20].includes(tmp.id)) {
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
                                if (nearTrap && !clicks.middle && instaType) {
                                    traps.dist = UTILS.getDist(nearTrap, tmpObj, 0, 2);
                                    traps.aim = UTILS.getDirect(nearTrap, tmpObj, 0, 2);

                                    if (!traps.inTrap && getEl("antitrap").checked) {
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
                if (player && player.alive) {
                    if (enemy.length) {
                        if (player && player.alive){
                            placeableSpikes = getPlaceablePositions(player, items.list[player.items[2]]);
                            placeableTraps = player.items[4] == 15 ? getPlaceablePositions(player, items.list[player.items[4]]) : [];
                        }

                        near = enemy.sort(function(tmp1, tmp2) {
                            return tmp1.dist2 - tmp2.dist2;
                        })[0];
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
                                    player.empAnti = true;
                                }
                            }

                            let prehit = gameObjects.filter(tmp => tmp.dmg && tmp.active && tmp.isTeamObject(player) && UTILS.getDist(tmp, near, 0, 3) <= (tmp.scale + near.scale)).sort(function(a, b) {
                                return UTILS.getDist(a, near, 0, 2) - UTILS.getDist(b, near, 0, 2);
                            })[0];
                            let knockhit = gameObjects.filter(tmp => tmp.dmg && tmp.active && tmp.isTeamObject(player) && UTILS.getDist(tmp, near, 0, 3) <= (tmp.scale + near.scale * 2)).sort(function(a, b) {
                                return UTILS.getDist(a, near, 0, 2) - UTILS.getDist(b, near, 0, 2);
                            })[0];
                            if (prehit) {
                                if (near.dist2 <= items.weapons[player.weapons[0]].range + player.scale * 1.8) {
                                    instaC.canSpikeTick = true;
                                }
                            } else {
                                if (knockhit && !traps.inTrap && !clicks.right && !clicks.left && traps.canHit()) {
                                    if (near.dist2 <= items.weapons[player.weapons[0]].range + player.scale * 1.8) {
                                        instaC.canSpikeTick = true;
                                    }
                                }
                            }
                            let antiSpikeTick = gameObjects.filter(tmp => tmp.dmg && tmp.active && !tmp.isTeamObject(player) && UTILS.getDist(tmp, player, 0, 3) < (tmp.scale + player.scale)).sort(function(a, b) {
                                return UTILS.getDist(a, player, 0, 2) - UTILS.getDist(b, player, 0, 2);
                            })[0];
                            if (antiSpikeTick && !traps.inTrap) {
                                if (near.dist2 <= items.weapons[5].range + near.scale * 1.8) {
                                    my.anti0Tick = 1;
                                    player.chat.count = 2000;
                                }
                            }
                        }
                        if((game.tick - near.bullTick) % 9 == 0 && near.skinIndex == 7) {
                            addChatLog("Bulltick detected: " + near.name + "[" + near.sid + "]", "#40E0D0", "", "#40E0D0");
                            bultect = true;
                            game.tickBase(() => {
                                bultect = false;
                            }, 1)
                        }
                        if (traps.canHit() && (((near.skinIndex != 6 && near.shameCount >= getEl("AIWithoutS").value)) || ((near.skinIndex == 6 && near.shameCount >= getEl("AIWithS").value))) && player.weapons[1] != 7 && (getEl("autoinsta").checked || autobullspam) && player.reloads[53] == 0 && (trueM ? true : ((player.checkCanInsta(true) >= 100 ? player.checkCanInsta(true) : player.checkCanInsta(false)) >= (player.weapons[1] == 10 ? 95 : 100))) && near.dist2 <= items.weapons[player.weapons[1] == 10 ? player.weapons[1] : player.weapons[0]].range + near.scale * 1.8 && (instaC.wait || (trueM && Math.floor(Math.random() * 2) == 0) || bultect) && ((trueM && near.shameCount >= near.maxShameCount) || (trueM && true)) && !instaC.isTrue && !my.waitHit && player.reloads[player.weapons[0]] == 0 && player.reloads[player.weapons[1]] == 0 && instaC.perfCheck(player, near)) {
                            instaC.can = true;
                        } else if ((traps.canHit() || clicks.middle) && instaC.canCounter && player.weapons[1] === 10 && player.reloads[player.weapons[1]] == 0 && player.reloads[player.weapons[0]] == 0 && player.reloads[53] == 0) {
                            instaC.can = true;
                        } else if (instaType){
                            instaC.can = false;
                        }

                        macro.q && place(0, getAttackDir());
                        macro.f && place(4, getSafeDir(), 1);
                        macro.v && place(2, getSafeDir(), 1);
                        macro.b && place(1, getSafeDir());
                        macro.h && place(player.getItemType(22), getSafeDir());
                        if (isItemSetted[26].innerHTML != 299) {
                            macro.l && place(3, getSafeDir(), 1);
                        }
                        let CheckMaxSpeed = SpeedMill();
                        if (game.tick % CheckMaxSpeed == 0) {
                            if (mills.place && player.moveDir != undefined && !traps.inTrap && (near.dist2 > 250 || !enemy.length)) {
                                if (isItemSetted[26].innerHTML <= 296) {
                                    let plcAng = 1.20;
                                    if (player.items[4] != 15) {
                                        checkPlace(4, getSafeDir());
                                    }
                                    for (let i = -plcAng; i <= plcAng; i += plcAng) {
                                        checkPlace(3, UTILS.getDirect(player.oldPos, player, 2, 2) + i);
                                    }
                                }
                            } else {
                                if (mills.placeSpawnPads && !traps.inTrap) {
                                    for (let i = 0; i < Math.PI * 2; i += Math.PI / 2) {
                                        checkPlace(player.getItemType(20), UTILS.getDirect(player.oldPos, player, 2, 2) + i);
                                    }
                                }
                            }
                        }
                        if (instaC.can) {
                            instaC.changeType(((player.weapons[1] == 10) || near.shameCount >= 5) ? "rev" : "normal");
                        }
                        if (instaC.canCounter) {
                            instaC.canCounter = false;
                            if (player.reloads[player.weapons[0]] == 0 && !instaC.isTrue) {
                                if (player.reloads[player.weapons[1]] == 0 && player.reloads[player.weapons[0]] == 0 && player.reloads[53] == 0 && player.weapons[1] === 10) {
                                } else {
                                    instaC.counterType();
                                }
                            }
                        }
                        if (instaC.canSpikeTick) {
                            instaC.canSpikeTick = false;
                            if ([1, 2, 3, 4, 5, 6].includes(player.weapons[0]) && player.reloads[player.weapons[0]] == 0 && !instaC.isTrue) {
                                instaC.spikeTickType();
                            }
                        }
                        if ((clicks.left || clicks.right) && !instaC.isTrue && instaType) {
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
                        if (player.shameCount <= 4 && autobullspam && instaType && player.reloads[player.weapons[1]] == 0 && !clicks.middle && !clicks.left && !clicks.right && !instaC.isTrue && near.dist2 <= (items.weapons[player.weapons[0]].range + near.scale * 1.8) && !traps.inTrap) {
                            if (secPacket >= 80) return;
                            if ((((near.skinIndex != 6 && near.shameCount < getEl("AIWithoutS").value) || (near.skinIndex == 6 && near.shameCount < getEl("AIWithS").value) || player.reloads[53] != 0) && (near.skinIndex != 26 || near.shameCount != 0)) || player.weapons[1] == 10) {
                                if ((player.weaponIndex != player.weapons[0]) || player.buildIndex > -1) {
                                    selectWeapon(player.weapons[0]);
                                }
                                my.BullAim = true;
                                if (player.reloads[player.weapons[0]] == 0 && !my.waitHit) {
                                    sendAutoGather();
                                    if (player.tailIndex == 11) {
                                        buyEquip(Wings, 1);
                                    }
                                    if (player.empAnti) {
                                        buyEquip(22, 0);
                                    } else {
                                        buyEquip(near.skinIndex == 11 ? 26 : plaguemask ? 21 : 7, 0);
                                    }
                                    my.waitHit = 1;
                                    game.tickBase(() => {
                                        if (player.empAnti) {
                                            buyEquip(22, 0);
                                        } else {
                                            detectHat(6);
                                        }
                                        sendAutoGather();
                                        my.waitHit = 0;
                                    }, 1);
                                }
                            } else {
                                my.BullAim = false;
                                if (player.reloads[53] == 0 && player.reloads[player.weapons[0]] == 0 && player.reloads[player.weapons[1]] == 0 && !instaC.isTrue) {
                                    instaType = false;
                                    instaC.can = true;
                                    game.tickBase(() => {
                                        instaC.can = false;
                                        instaType = true;
                                    }, 2);
                                }
                            }
                        } else {
                            my.BullAim = false;
                        }
                        if (traps.inTrap && instaType && !my.SpikeAim && !my.TrapAim) {
                            if (!clicks.left && !clicks.right && !instaC.isTrue && !AntiBull) {
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
                        AntiBull = ((clicks.middle || (player.weapons[1] != 7 && !autobullspam && !traps.inTrap && player.shameCount <= 3 && enemy.length && near.dist2 <= items.weapons[player.weapons[0]].range + near.scale * 1.8 && !checkOneFrame && !my.TrapAim && !my.SpikeAim && !my.autoPush && pAB && player.weaponIndex !== 7 && near.weaponIndex !== 7)) && !instaC.isTrue && !clicks.left && !clicks.right) ? true : false;
                        if (!my.SpikeAim && !my.TrapAim && my.canHat && instaType) {
                            if (player.weapons[1] && !clicks.left && !clicks.right && !traps.inTrap && !instaC.isTrue) {
                                if (player.reloads[player.weapons[0]] == 0 && player.reloads[player.weapons[1]] == 0) {
                                    if (!my.reloaded) {
                                        my.reloaded = true;
                                        let fastSpeed = items.weapons[player.weapons[0]].spdMult < items.weapons[player.weapons[1]].spdMult ? 1 : 0;
                                        if (player.weaponIndex != player.weapons[fastSpeed] || player.buildIndex > -1) {
                                            if(near.skinIndex != 26 && near.skinIndex != 11 && autobullspam && player.reloads[player.weapons[1]] == 0 && !clicks.left && !clicks.right && !instaC.isTrue && near.dist2 <= (items.weapons[player.weapons[0]].range + near.scale * 1.8) && !traps.inTrap) {
                                                selectWeapon(player.weapons[0]);
                                            } else {
                                                selectWeapon(player.weapons[fastSpeed]);
                                            }
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
                                            if(near.skinIndex != 26 && autobullspam && player.reloads[player.weapons[1]] == 0 && !clicks.left && !clicks.right && !instaC.isTrue && near.dist2 <= (items.weapons[player.weapons[0]].range + near.scale * 1.8) && !traps.inTrap) {
                                                selectWeapon(player.weapons[0]);
                                            } else {
                                                selectWeapon(player.weapons[1]);
                                            }
                                        }
                                    }
                                }
                            }
                        }
                        if (window.pingTime > 125 || ms.avg > 125 || antiSync) {
                            if (player.shameCount <= Math.random() + 3 && near.dist2 <= 260) {
                                autoQ = true;
                                place(0, getAttackDir());
                                if (AutoQ && !antiSync) {
                                    textManager.showText(player.x2, player.y2, 30, 0.15, 850, `AutoQ! `, "#fff", 2);
                                    AutoQ = false;
                                }
                            } else {
                                if (autoQ) {
                                    place(0, getAttackDir())
                                }
                                autoQ = false;
                                AutoQ = false;
                            }
                        } else {
                            autoQ = false;
                            AutoQ = true;
                        }
                        if (getEl("cansnow").checked) {
                            snowflakeContainer.style.display = "block";
                        } else {
                            snowflakeContainer.style.display = "none";
                        }
                        if (getEl("music1").checked && canMusic1) {
                            canMusic1 = false;
                            cH();
                        }
                        if (getEl("music2").checked && canMusic2) {
                            canMusic2 = false;
                            cH2();
                        }
                        if (window.pingTime >= 270 && !chatPing) {
                            chatPing = true;
                            sendChat("Ping: " + window.pingTime);
                            textManager.showText(player.x2, player.y2, 30, 0.15, 1250, `Warning High Ping ${window.pingTime}! `, "white", 2);
                        } else if (chatPing && window.pingTime < 270){
                            chatPing = false;
                        }
                        if (player.skins[40]) {
                            if(!player.skins[53]) {
                                autoBuy = new Autobuy([22, 53], [11]);
                            } else {
                                if (!player.tails[21]) {
                                    autoBuy = new Autobuy([22, 40, 15, 31, 6, 7, 53, 11, 12, 21], [11, 21]);
                                } else {
                                    autoBuy = new Autobuy([56, 26], [13]);
                                }
                            }
                        }
                        if (getEl("weapongrind").checked ) {
                            ClicksGrind();
                            if (secPacket <= 40) packet("a", undefined, 1);
                        }
                        if (getEl("preplace").checked && !instaC.isTrue && near.dist2 <= 300) {
                            traps.PrePlace();
                        }
                        if (getEl("autoplace").checked && !instaC.isTrue && (!traps.inTrap || traps.info.health >= 273.02)) {
                            traps.autoPlace();
                        }
                        if (getEl("wingscxc").checked) {
                            if (Wings != 21 && tails !== 13) {
                                Wings = 21;
                            }
                            if (tryHat != detectHatReturn(6)) {
                                tryHat = detectHatReturn(6);
                            }
                        } else {
                            if (tryHat != 11) {
                                tryHat = 11;
                            }
                            if (Wings != 0 && tails !== 13) {
                                Wings = 0;
                            }
                        }
                        if (enemy.length) {
                            if (near.dist2 <= 300) {
                                EnemyDist = true;
                            } else {
                                EnemyDist = false;
                            }
                            checkEnemy = true;
                        } else {
                            EnemyDist = false;
                            checkEnemy = false
                        }
                        if (config.autobot || configs3.AutoBullSpam) {
                            if (!my.autoPush && !my.SpikeAim && !my.MillAim && !my.TeleAim && !my.TrapAim && !instaC.isTrue && instaType && secPacket < 99 && !checkOneFrame) {
                                autobullspam = true;
                            } else {
                                autobullspam = false;
                            }
                        } else {
                            autobullspam = false;
                        }
                        if (pathFind.active || config.autobot || checkOneFrame || my.autoPush) {
                            ChPath = 70;
                        } else {
                            ChPath = 90;
                        }
                        if (MouseClicks) {
                            if (secPacket >= ChPath) return;
                            CanClick = true;
                            if (near.dist2 <= items.weapons[player.weapons[0]].range + near.scale * 1.8) {
                                clicks.right = false;
                                clicks.left = true;
                            } else {
                                clicks.left = false;
                                clicks.right = true;
                            }
                        } else {
                            if (CanClick) {
                                CanClick = false;
                                clicks.right = false;
                                clicks.left = false;
                            }
                        }

                        if (player.reloads[player.weapons[1]] != 0 && player.weapons[1] != 10 && player.weapons[1] && (!traps.inTrap || clicks.middle)) {
                            ae86Dir = true;
                        } else {
                            ae86Dir = false;
                        }

                        if (!packetsShown && secPacket >= 100) {
                            textManager.showText(player.x2, player.y2, 30, 0.15, 1050, `${secPacket} Packets! `, "#fff", 2);
                            packetsShown = true;
                        } else if (packetsShown && secPacket < 100) {
                            packetsShown = false;
                        }
                        if (!macro.q && !macro.f && !macro.v && !macro.h && !macro.n) {
                            packet("D", getAttackDir());
                        }
                        let bullTick = function() {
                            if (clicks.left || clicks.right) {
                                if (clicks.left) {
                                    buyEquip(player.reloads[player.weapons[0]] == 0 ? getEl("weapongrind").checked ? 40 : plaguemask ? 21 : near.skinIndex == 11 ? 26 : 7 : near.antiBull > 0 ? tryHat : detectHatReturn(6), 0);
                                    buyEquip(Wings, 1);
                                } else if (clicks.right) {
                                    buyEquip(player.reloads[clicks.right && player.weapons[1] == 10 ? player.weapons[1] : player.weapons[0]] == 0 ? 40 : 7, 0);
                                    buyEquip(Wings, 1);
                                }
                            } else if (traps.inTrap) {
                                if (player.reloads[player.weapons[1] == 10 ? player.weapons[canSecondary] : player.weapons[0]] == 0) {
                                    buyEquip(40, 0);
                                } else {
                                    buyEquip(7, 0);
                                }
                                buyEquip(Wings, 1);
                            } else {
                                buyEquip(7, 0);
                                SmartTail();
                            }
                        }
                        let hatChanger = function() {
                            if (clicks.left || clicks.right) {
                                if (clicks.left) {
                                    buyEquip(player.reloads[player.weapons[0]] == 0 ? getEl("weapongrind").checked ? 40 : plaguemask ? 21 : near.skinIndex == 11 ? 26 : 7 : near.antiBull > 0 ? tryHat : detectHatReturn(6), 0);
                                    buyEquip(Wings, 1);
                                } else if (clicks.right) {
                                    if (player.reloads[player.weapons[1] == 10 ? player.weapons[canSecondary] : player.weapons[0]] == 0) {
                                        buyEquip(40, 0);
                                    } else {
                                        EmpGear(1);
                                    }
                                    buyEquip(Wings, 1);
                                }
                            } else if (traps.inTrap) {
                                if (player.reloads[player.weapons[1] == 10 ? player.weapons[1] : player.weapons[0]] == 0) {
                                    if (player.shameCount >= 4 && (antiSync || autoQ || my.antiSync)) {
                                        detectHat(6);
                                    } else {
                                        buyEquip(40, 0);
                                    }
                                } else {
                                    detectHat(6);
                                }
                                buyEquip(Wings, 1);
                            } else {
                                biomeGear(1);
                            }
                        }
                        if (storeMenu.style.display != "block" && !instaC.isTrue && (my.canHat || player.empAnti || my.anti0Tick > 0)) {
                            if (Wings == 13 && !traps.inTrap && player.skinIndex != 45) {
                                detectHat(6);
                            } else if (player.skinIndex == 45 && player.health != 100 && !traps.inTrap) {
                                if (player.skins[13]) {
                                    buyEquip(13, 0);
                                    SmartTail();
                                } else {
                                    if (player.points >= 5000) {
                                        storeBuy(13, 0);
                                    }
                                }
                            } else if (my.anti0Tick > 0) {
                                buyEquip(6, 0);
                            } else if ((!player.empAnti && (near.dist2 >= 200 || !enemy.length)) && player.skins[7] && !autoQ && ((game.tick - player.lastBull) % 9 == 0 || (player.bullTick && player.bullTimer > 0.5)) && player.health === 100 && player.shameCount > 0 && player.skinIndex != 45) {
                                bullTick();
                            } else if (player.empAnti) {
                                buyEquip(22, 0);
                            } else {
                                if(AntiBull && player && player.alive && player.shameCount <= 4) {
                                    if(near.dist2 <= 250) {
                                        if (player.reloads[player.weapons[1]] == 0 && (near.antiBull > 0 || clicks.middle)) {
                                            buyEquip(11, 0);
                                            buyEquip(21, 1);
                                        } else {
                                            detectHat(6);
                                            buyEquip(Wings, 1);
                                        }
                                    }else {
                                        detectHat(6);
                                        buyEquip(tails, 1);
                                    }
                                } else {
                                    hatChanger();
                                }
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
                            if(player.empAnti) {
                                player.empAnti = false;
                            }
                        }
                    }
                    if (getEl("testavoidspikes").checked && !getEl("weapongrind").checked) {
                        if (!instaC.isTrue && player.weapons[1] && !clicks.left && !clicks.right) {
                            if (player.weapons[1] === 10 || traps.inTrap) {
                                antiPush();
                            } else {
                                ResetActions()
                            }
                        } else {
                            ResetActions()
                        }
                    }
                    if (!traps.inTrap && !instaC.isTrue && (getEl("pathfind").checked || ((checkOneFrame || my.autoPush) && near.dist2 > items.weapons[player.weapons[0]].range + near.scale * 5)) && enemy.length && !my.SpikeAim && !my.TrapAim && !my.TeleAim) {
                        pathFind.active = true;
                        if (!checkOneFrame && !my.autoPush) {
                            config.autobot = true;
                            Pathfinder();
                        }
                    } else {
                        if (!checkOneFrame && !my.autoPush) {
                            if (config.autobot) {
                                packet("a", undefined, 1);
                            }
                            config.autobot = false;
                        }
                        pathFind.active = false;
                    }
                    if (configs3.AutoPush && enemy.length && near.dist2 < 600 && !traps.inTrap && !instaC.isTrue && !my.SpikeAim && !my.TrapAim && !my.TeleAim) {
                        autoPush();
                    } else {
                        if (my.autoPush) {
                            my.autoPush = false;
                            packet("a", lastMoveDir || undefined, 1);
                        }
                    }
                }
            }

            function updateLeaderboard(data) {
                lastLeaderboardData = data;
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
                                    style: "color: rgba(255, 255, 255, 0.9); font-size: 16px;",
                                    text: (data[i + 1] != "" ? data[i + 1] + " - " + " [" + data[i] + "]" : "unknown")
                                }),
                                UTILS.generateElement({
                                    class: "leaderScore",
                                    style: "font-size: 16px;",
                                    text: UTILS.sFormat(data[i + 2]) || "0"
                                })
                            ]
                        });
                    })(i);
                    tmpC++;
                }
            }
            function loadGameObject(data) {
                for (let i = 0; i < data.length;) {
                    objectManager.add(data[i], data[i + 1], data[i + 2], data[i + 3], data[i + 4],
                                      data[i + 5], items.list[data[i + 6]], true, (data[i + 7] >= 0 ? {
                        sid: data[i + 7]
                    } : null));
                    i += 8;
                }
            }
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
            function animateAI(sid) {
                tmpObj = findAIBySID(sid);
                if (tmpObj) tmpObj.startAnim();
            }
            let canShowAntiSync = true;
            function gatherAnimation(sid, didHit, index) {
                tmpObj = findPlayerBySID(sid);
                if (tmpObj) {
                    tmpObj.startAnim(didHit, index);
                    tmpObj.gatherIndex = index;
                    tmpObj.gathering = 1;
                    if(nears.filter(near => near.gathering).length>=2) {
                        io.send("6", "sync detect test");
                        antiSync = true;
                        if (canShowAntiSync) {
                            //textManager.showText(player.x2, player.y2, 30, 0.15, 850, `AntiSync! `, "#fff", 2);
                            canShowAntiSync = false;
                        }
                        setTimeout(() => {
                            canShowAntiSync = true;
                            antiSync = false;
                        }, 2500);
                    }
                    if (didHit) {
                        let tmpObjects = objectManager.hitObj;
                        objectManager.hitObj = [];
                        game.tickBase(() => {
                            tmpObj = findPlayerBySID(sid);
                            let val = items.weapons[index].dmg * (config.weaponVariants[tmpObj[(index < 9 ? "prima" : "seconda") + "ryVariant"]].val) * (items.weapons[index].sDmg || 1) * (tmpObj.skinIndex == 40 ? 3.3 : 1);
                            tmpObjects.forEach((healthy) => {
                                healthy.healthMov = healthy.health;
                                healthy.health -= val;
                            });
                        }, 1);
                    }
                }
            }
            function showDamageText(x, y, value, color) {
                textManager.showText(x, y, 30, 0.15, 550, Math.round(value), color);
            }

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
            function updatePlayerValue(index, value, updateView) {
                if (player) {
                    player[index] = value;

                    if (index == "points") {
                        if (configs.AutoBuy) {
                            autoBuy.hat();
                            autoBuy.acc();
                        }
                    } else if (index == "kills") {
                        MaxKills = player.kills;
                        if (getEl("wingscxc").checked) {
                            tails = 13;
                            Wings = 13;
                            setTimeout(() => {
                                tails = 11;
                                Wings = 21;
                            }, 1200);
                        }
                        if (configs.killChat) {
                            setTimeout(() => {
                                sendChat("sitdown");
                            }, 200);
                        }
                    }
                }
            }
            function updateItems(data, wpn) {
                if (data) {
                    if (wpn) {
                        player.weapons = data;
                        player.primaryIndex = player.weapons[0];
                        player.secondaryIndex = player.weapons[1];
                        if (!instaC.isTrue && instaType) {
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
            function addProjectile(x, y, dir, range, speed, indx, layer, sid) {
                projectileManager.addProjectile(x, y, dir, range, speed, indx, null, null, layer, inWindow).sid = sid;
                runAtNextTick.push(Array.prototype.slice.call(arguments));
            }
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
                            id == 7 && (my.reSync = true);
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
            function time() {
                const now2 = new Date();
                const hours = now2.getHours();
                const minutes = now2.getMinutes();
                const secondsFor = now2.getSeconds();

                const ampm = hours >= 12 ? 'PM' : 'AM';
                const formattedHours = (hours % 12 || 12).toString();
                const formattedMinutes = minutes.toString().padStart(2, '0');
                let seconds = secondsFor < 10 ? "0" + secondsFor : secondsFor;
                let time = `${formattedHours}:${formattedMinutes}:${seconds} ${ampm}`;
                return time;
            }
            function isTeam(tmpObj) {
                return (tmpObj == player || (tmpObj.team && tmpObj.team == player.team));
            }
            function ChatSee(sid, message) {
                let tmpPlayer = findPlayerBySID(sid);
                let countDown = 0;
                let coolDownForAI = false;
                tmpPlayer.chatMessage = checkProfanityString(message);
                tmpPlayer.chatCountdown = config.chatCountdown;


                addChatLog(message, "#fff", tmpPlayer.name + "[" + tmpPlayer.sid + "]:", tmpPlayer == player || (tmpPlayer.team && tmpPlayer.team == player.team) ? "#279df1" : "#fff");
                if (isTeam(tmpPlayer) || player == tmpPlayer) {
                    if (getEl("mapsync").checked) {
                        if (message == "CryLow" || message == ".w" || message == ".f" || message == "L/") {
                            if(player.reloads[53] == 0 || near.skinIndex != 6) {
                                instaC.syncTry();
                            }
                        }
                    }
                }
                if(player == tmpPlayer) {
                    if (message == ".RealPing") {
                        let pingTime = window.pingTime;
                        setTimeout(() => {
                            io.send("6", "Ping: " + pingTime);
                        }, 500);
                    }
                    if (message == ".ping") {
                        const randomPing = Math.floor(Math.random() * (100 - 80 + 1)) + 80;
                        setTimeout(() => {
                            io.send("6", `Ping: ${randomPing}`);
                        }, 500);
                    }
                    if (message == ".fps") {
                        setTimeout(() => {
                            io.send("6", "Frames: " + UTILS.round(fpsTimer.ltime, 10));
                        }, 500);
                    }
                    if (message == ".TestV") {
                        setTimeout(() => {
                            io.send("6", "V-Toggle");
                            config.anotherVisual = !config.anotherVisual;
                        }, 500);
                    }
                    if (message == ".time") {
                        setTimeout(() => {
                            io.send("6", time());
                        }, 500);
                        return;
                    }
                    if (message == ".kills") {
                        setTimeout(() => {
                            io.send("6", "" + MaxKills);
                        }, 500);
                        return;
                    }
                    if (message == ".dist") {
                        setTimeout(() => {
                            io.send("6", "" + near.dist2);
                        }, 500);
                        return;
                    }
                    if (message == ".Night") {
                        window.toggleNight();
                        return;
                    }
                }
                if (message.trim() === ".clear") {
                    resetMenuChText();
                    return;
                }
                if (tmpPlayer) {
                    allChats.push(new addCh(tmpPlayer.x, tmpPlayer.y, message, tmpPlayer));
                }
            }

            function updateMinimap(data) {
                minimapData = data;
            }
            function showText(x, y, value, type, color) {
                if (config.anotherVisual) {
                    textManager.stack.push({ x: x, y: y, value: value });
                } else {
                    textManager.showText(x, y, 50, 0.18, 500, Math.abs(value), color);
                }
            }
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
            function renderRect(x, y, w, h, ctxt, dontStroke, dontFill) {
                if (!dontFill) ctxt.fillRect(x - (w / 2), y - (h / 2), w, h);
                if (!dontStroke) ctxt.strokeRect(x - (w / 2), y - (h / 2), w, h);
            }
            function renderHealthRect(x, y, w, h, ctxt, dontStroke, dontFill) {
                if (!dontFill) ctxt.fillRect(x - (w / 2), y - (h / 2), w, h);
                if (!dontStroke) ctxt.strokeRect(x - (w / 2), y - (h / 2), w, h);
            }
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
            let ooolala = 0;
            function renderDeadPlayers(xOffset, yOffset) {
                mainContext.fillStyle = "#91b2db";
                deadPlayers.filter(dead => dead.active).forEach((dead) => {
                    dead.animate(delta);

                    mainContext.globalAlpha = dead.alpha;
                    mainContext.strokeStyle = outlineColor;

                    mainContext.save();
                    mainContext.translate(dead.x - xOffset, dead.y - yOffset);

                    mainContext.rotate(dead.dir);
                    mainContext.scale(dead.visScale / dead.scale, dead.visScale / dead.scale);
                    renderDeadPlayer(dead, mainContext);
                    mainContext.restore();
                })
            }
            function renderPlayers(xOffset, yOffset, zIndex) {
                mainContext.globalAlpha = $('#players').val() / 100;
                mainContext.fillStyle = "#91b2db";
                for (var i = 0; i < players.length; ++i) {
                    tmpObj = players[i];
                    if (tmpObj.zIndex == zIndex) {
                        tmpObj.animate(delta);
                        if (tmpObj.visible) {
                            tmpObj.skinRot += (0.002 * delta);
                            tmpDir = ((configs.RealDir || showAim) && tmpObj == player) ? ((!noDirMy && showAim && ((!traps.inTrap && !my.TrapAim && !my.SpikeAim) || clicks.middle || clicks.left || clicks.right || instaC.isTrue))) ? getVisualDir() : getSafeDir() : (tmpObj.dir || 0);
                            mainContext.save();
                            mainContext.translate(tmpObj.x - xOffset, tmpObj.y - yOffset);
                            mainContext.rotate(tmpDir + tmpObj.dirPlus);
                            renderPlayer(tmpObj, mainContext);
                            mainContext.restore();
                        }
                    }
                }
            }
            function renderDeadPlayer(obj, ctxt) {
                ctxt = ctxt || mainContext;
                ctxt.lineWidth = outlineWidth;
                ctxt.lineJoin = "miter";
                let handAngle = (Math.PI / 4) * (items.weapons[obj.weaponIndex].armS||1);
                let oHandAngle = (obj.buildIndex < 0)?(items.weapons[obj.weaponIndex].hndS||1):1;
                let oHandDist = (obj.buildIndex < 0)?(items.weapons[obj.weaponIndex].hndD||1):1;

                if (obj.buildIndex < 0 && !items.weapons[obj.weaponIndex].aboveHand) {
                    renderTool(items.weapons[obj.weaponIndex], config.weaponVariants[obj.weaponVariant].src, obj.scale, 0, ctxt);
                    if (items.weapons[obj.weaponIndex].projectile != undefined && !items.weapons[obj.weaponIndex].hideProjectile) {
                        renderProjectile(obj.scale, 0,
                                         items.projectiles[items.weapons[obj.weaponIndex].projectile], mainContext);
                    }
                }

                ctxt.fillStyle = config.skinColors[obj.skinColor];
                renderCircle(obj.scale * Math.cos(handAngle), (obj.scale * Math.sin(handAngle)), 14);
                renderCircle((obj.scale * oHandDist) * Math.cos(-handAngle * oHandAngle),
                             (obj.scale * oHandDist) * Math.sin(-handAngle * oHandAngle), 14);

                if (obj.buildIndex < 0 && items.weapons[obj.weaponIndex].aboveHand) {
                    renderTool(items.weapons[obj.weaponIndex], config.weaponVariants[obj.weaponVariant].src, obj.scale, 0, ctxt);
                    if (items.weapons[obj.weaponIndex].projectile != undefined && !items.weapons[obj.weaponIndex].hideProjectile) {
                        renderProjectile(obj.scale, 0,
                                         items.projectiles[items.weapons[obj.weaponIndex].projectile], mainContext);
                    }
                }

                if (obj.buildIndex >= 0) {
                    var tmpSprite = getItemSprite(items.list[obj.buildIndex]);
                    ctxt.drawImage(tmpSprite, obj.scale - items.list[obj.buildIndex].holdOffset, -tmpSprite.width / 2);
                }

                renderCircle(0, 0, obj.scale, ctxt);

                ctxt.lineWidth = 2;
                ctxt.fillStyle = "#555";
                ctxt.font = "35px Hammersmith One";
                ctxt.textBaseline = "middle";
                ctxt.textAlign = "center";

                ctxt.fillText("(", 20, 5);

                ctxt.rotate(Math.PI / 2);
                ctxt.font = "30px Hammersmith One";
                ctxt.fillText("X", -15, 15/2);
                ctxt.fillText("X", 15, 15/2);

            }
            function renderPlayer(obj, ctxt) {
                ctxt = ctxt || mainContext;
                ctxt.lineWidth = outlineWidth;
                ctxt.lineJoin = "miter";

                ctxt.shadowColor = `rgba(0, 0, 0, 0.4)`;
                ctxt.shadowBlur = 10;
                ctxt.shadowOffsetY = 5;

                ctxt.shadowBlur = 10;
                ctxt.strokeStyle = darkOutlineColor;
                let handAngle = (Math.PI / 4) * (items.weapons[obj.weaponIndex].armS || 1);
                let oHandAngle = (obj.buildIndex < 0) ? (items.weapons[obj.weaponIndex].hndS || 1) : 1;
                let oHandDist = (obj.buildIndex < 0) ? (items.weapons[obj.weaponIndex].hndD || 1) : 1;
                let katanaMusket = (obj == player && obj.weapons[0] == 3 && obj.weapons[1] == 15);
                if (obj.tailIndex > 0) {
                    renderTail(obj.tailIndex, ctxt, obj);
                }
                if (obj.buildIndex < 0 && !items.weapons[obj.weaponIndex].aboveHand) {
                    renderTool(items.weapons[katanaMusket ? 4 : obj.weaponIndex], config.weaponVariants[obj.weaponVariant].src, obj.scale, 0, ctxt);
                    if (items.weapons[obj.weaponIndex].projectile != undefined && !items.weapons[obj.weaponIndex].hideProjectile) {
                        renderProjectile(obj.scale, 0,
                                         items.projectiles[items.weapons[obj.weaponIndex].projectile], mainContext);
                    }
                }
                ctxt.fillStyle = config.skinColors[obj.skinColor];
                renderCircle(obj.scale * Math.cos(handAngle), (obj.scale * Math.sin(handAngle)), 14);
                renderCircle((obj.scale * oHandDist) * Math.cos(-handAngle * oHandAngle),
                             (obj.scale * oHandDist) * Math.sin(-handAngle * oHandAngle), 14);
                if (obj.buildIndex < 0 && items.weapons[obj.weaponIndex].aboveHand) {
                    renderTool(items.weapons[obj.weaponIndex], config.weaponVariants[obj.weaponVariant].src, obj.scale, 0, ctxt);
                    if (items.weapons[obj.weaponIndex].projectile != undefined && !items.weapons[obj.weaponIndex].hideProjectile) {
                        renderProjectile(obj.scale, 0,
                                         items.projectiles[items.weapons[obj.weaponIndex].projectile], mainContext);
                    }
                }
                if (obj.buildIndex >= 0) {
                    var tmpSprite = getItemSprite(items.list[obj.buildIndex]);
                    ctxt.drawImage(tmpSprite, obj.scale - items.list[obj.buildIndex].holdOffset, -tmpSprite.width / 2);
                }
                renderCircle(0, 0, obj.scale, ctxt);
                if (obj.skinIndex > 0) {
                    ctxt.rotate(Math.PI / 2);
                    renderSkin(obj.skinIndex, ctxt, null, obj);
                }
            }
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
                    tmpImage.src = getTexturePackImg(index, "hat");
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
                    tmpImage.src = getTexturePackImg(index, "hat");
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
                    tmpImage.src = getTexturePackImg(index, "acc");
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
                tmpSkin = accessSprites[index];
                if (!tmpSkin) {
                    let tmpImage = new Image();
                    tmpImage.onload = function() {
                        this.isLoaded = true;
                        this.onload = null;
                    };
                    tmpImage.src = getTexturePackImg(index, "acc");
                    accessSprites[index] = tmpImage;
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
            let toolSprites = {};
            function renderTool(obj, variant, x, y, ctxt) {
                let tmpSrc = obj.src + (variant || "");
                let tmpSprite = toolSprites[tmpSrc];
                if (!tmpSprite) {
                    tmpSprite = new Image();
                    tmpSprite.onload = function() {
                        this.isLoaded = true;
                    }
                    tmpSprite.src = getTexturePackImg(tmpSrc, "weapons");
                    toolSprites[tmpSrc] = tmpSprite;
                }
                if (tmpSprite.isLoaded)
                    ctxt.drawImage(tmpSprite, x + obj.xOff - (obj.length / 2), y + obj.yOff - (obj.width / 2), obj.length, obj.width);
            }
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
                        tmpSprite.src = getTexturePackImg(tmpSrc, "weapons");
                        projectileSprites[tmpSrc] = tmpSprite;
                    }
                    if (tmpSprite.isLoaded)
                        ctxt.drawImage(tmpSprite, x - (obj.scale / 2), y - (obj.scale / 2), obj.scale, obj.scale);
                } else if (obj.indx == 1) {
                    ctxt.fillStyle = "#939393";
                    renderCircle(x, y, obj.scale, ctxt);
                }
            }
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
            function renderWaterBodies(xOffset, yOffset, ctxt, padding) {
                let tmpW = config.riverWidth + padding;
                let tmpY = (config.mapScale / 2) - yOffset - (tmpW / 2);
                if (tmpY < maxScreenHeight && tmpY + tmpW > 0) {
                    ctxt.fillRect(0, tmpY, maxScreenWidth, tmpW);
                }
            }
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
                    if (isNight) {
                        tmpContext.shadowBlur = blurScale;
                        tmpContext.shadowColor = `rgba(0, 0, 0, ${obj.alpha})`;
                    }
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
                            tmpContext.fillStyle = "#89a54c";
                            renderCircle(0, 0, obj.scale * 0.55, tmpContext);
                            tmpContext.fillStyle = "#a5c65b";
                            renderCircle(0, 0, obj.scale * 0.3, tmpContext, true);
                        } else {
                            renderBlob(tmpContext, 6, tmpObj.scale, tmpObj.scale * 0.7);
                            tmpContext.fillStyle = biomeID ? "#e3f1f4" : "#89a54c";
                            tmpContext.fill();
                            tmpContext.stroke();
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
            let itemSprites = [];
            function getItemSprite(obj, asIcon) {
                let e = obj;
                let R = player;
                let clr = R && e.owner && (e.owner.sid).constructor == Number && e.owner.sid != R.sid,
                    use = true && false && true,
                    ID = e.id + (!use && clr ? 50 : 0);
                let tmpSprite = itemSprites[ID];
                if (!tmpSprite || asIcon) {
                    let blurScale = !asIcon && isNight ? 15 : 0;
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
                            tmpContext.shadowBlur = 8;
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
                            tmpContext.fillStyle = "#a5974c",
                                renderCircle(0, 0, obj.scale, tmpContext),
                                tmpContext.fillStyle = "#c9b758",
                                renderRectCircle(0, 0, 1.5 * obj.scale, 29, 4, tmpContext),
                                tmpContext.fillStyle = "#a5974c",
                                renderCircle(0, 0, .5 * obj.scale, tmpContext);
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
            function getMarkSprite(obj, tmpContext, tmpX, tmpY) {
                tmpContext.save();
                tmpContext.translate(tmpX, tmpY);
                tmpContext.rotate(obj.dir);
                if (obj.name == "spikes" || obj.name == "greater spikes" || obj.name == "poison spikes" || obj.name == "spinning spikes") {
                    tmpContext.globalAlpha = 0.6;
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
                    tmpContext.globalAlpha = 0.4;
                    tmpContext.fillStyle = "#a5974c",
                        renderCircle(0, 0, obj.scale, tmpContext),
                        tmpContext.fillStyle = "#c9b758",
                        renderRectCircle(0, 0, 1.5 * obj.scale, 29, 4, tmpContext),
                        tmpContext.fillStyle = "#a5974c",
                        renderCircle(0, 0, .5 * obj.scale, tmpContext);
                } else if (obj.name == "pit trap") {
                    tmpContext.globalAlpha = 0.3;
                    tmpContext.fillStyle = "#a5974c";
                    renderStar(tmpContext, 3, obj.scale * 1.1, obj.scale * 1.1);
                    tmpContext.fill();
                    tmpContext.stroke();
                    tmpContext.fillStyle = outlineColor;
                    renderStar(tmpContext, 3, obj.scale * 0.65, obj.scale * 0.65);
                    tmpContext.fill();
                }
                tmpContext.restore();
            }
            function isOnScreen(x, y, s) {
                return (x + s >= 0 && x - s <= maxScreenWidth && y + s >= 0 && (y,
                                                                                s,
                                                                                maxScreenHeight));
            }
            function markObject(tmpObj, tmpX, tmpY) {
                if(configs7.RenderPl) {
                    getMarkSprite(tmpObj, mainContext, tmpX, tmpY);
                }
            }
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
                if (getEl("mapsync").checked && player.weapons[1] != 10 && checkEnemy) {
                    instaC.MapSync();
                }
            }
            function updateMapMarker() {
                mapMarker.x = player.x;
                mapMarker.y = player.y;
            }
            let Pt = [];
            window.isAlly = function(id){
                for(let i = 0;i < Pt.length;i+=2){
                    if(id == Pt[i]){
                        return true;
                    }
                }
            }
            function renderMinimap(delta) {
                if (player && player.alive) {
                    mapContext.clearRect(0, 0, mapDisplay.width, mapDisplay.height);
                    mapContext.lineWidth = 4;
                    for (let i = 0; i < mapPings.length; ++i) {
                        tmpPing = mapPings[i];
                        mapContext.strokeStyle = tmpPing.color;
                        tmpPing.update(mapContext, delta);
                    }
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
                    if (lastDeath) {
                        mapContext.fillStyle = "#fc5553";
                        mapContext.font = "34px Hammersmith One";
                        mapContext.textBaseline = "middle";
                        mapContext.textAlign = "center";
                        mapContext.fillText("x", (lastDeath.x / config.mapScale) * mapDisplay.width,
                                            (lastDeath.y / config.mapScale) * mapDisplay.height);
                    }
                    if (mapMarker) {
                        mapContext.fillStyle = "#fff";
                        mapContext.font = "34px Hammersmith One";
                        mapContext.textBaseline = "middle";
                        mapContext.textAlign = "center";
                        mapContext.fillText("x", (mapMarker.x / config.mapScale) * mapDisplay.width,
                                            (mapMarker.y / config.mapScale) * mapDisplay.height);
                    }
                    //PathFinderLine
                    if (pathFind.active) {
                        if (pathFind.array) {
                            let xOffset = camX - (maxScreenWidth / 2);
                            let yOffset = camY - (maxScreenHeight / 2);
                            mainContext.lineWidth = player.scale / 8;
                            mainContext.globalAlpha = 1;
                            mainContext.strokeStyle = "rgba(255, 255, 255, 0.8)";
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
            }
            let crossHairs = [
                "https://media.discordapp.net/attachments/1055504260634251315/1218830078146908160/center.png?ex=660916f7&is=65f6a1f7&hm=c4155d2e78fb1b9a9166d76f49542ad2ee9444d62d5396cef235df3407049ef3&=&format=webp&quality=lossless&width=602&height=602",
                "https://media.discordapp.net/attachments/1055504260634251315/1218830078146908160/center.png?ex=660916f7&is=65f6a1f7&hm=c4155d2e78fb1b9a9166d76f49542ad2ee9444d62d5396cef235df3407049ef3&=&format=webp&quality=lossless&width=602&height=602",
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
            function updateGame() {

                if (config.resetRender) {
                    mainContext.clearRect(0, 0, gameCanvas.width, gameCanvas.height);
                    mainContext.beginPath();
                }
                if (true) {
                    function updateCamera() {
                        let selectedCamera = document.getElementById("visualTypeZoom").value;
                        let damping = 0.35;
                        let scalingFactor = 20;
                        if (player) {
                            if (selectedCamera === 'Cam1') {
                                let damping3 = 0.075;
                                if (player) {
                                    let targetCamX = player.x + ((1920 / 2) / 30);
                                    let targetCamY = player.y + ((1920 / 2) / 30);
                                    camX = lerp(camX, targetCamX, damping3);
                                    camY = lerp(camY, targetCamY, damping3);
                                } else {
                                    camX = config.mapScale / 2;
                                    camY = config.mapScale / 2;
                                }
                            } else if (selectedCamera === 'Cam0') {
                                let damping = 0.15;
                                let targetCamX = player.x + ((1920 / 2) / 30);
                                let targetCamY = player.y + ((1920 / 2) / 30);
                                camX += (targetCamX - camX) * damping;
                                camY += (targetCamY - camY) * damping;
                            } else if (selectedCamera === 'Cam2') {
                                let damping2 = 0.035;
                                if (player) {
                                    let targetCamX = player.x + ((1920 / 2) / 30);
                                    let targetCamY = player.y + ((1920 / 2) / 30);
                                    camX = lerp(camX, targetCamX, damping2);
                                    camY = lerp(camY, targetCamY, damping2);
                                } else {
                                    camX = config.mapScale / 2;
                                    camY = config.mapScale / 2;
                                }
                            } else if (selectedCamera === 'Cam3') {
                                let damping4 = 0.016;
                                if (player) {
                                    let targetCamX = player.x + ((1920 / 2) / 30);
                                    let targetCamY = player.y + ((1920 / 2) / 30);
                                    camX = lerp(camX, targetCamX, damping4);
                                    camY = lerp(camY, targetCamY, damping4);
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
                    document.getElementById("visualTypeZoom").addEventListener("change", updateCamera);
                    function lerp(start, end, amt) {
                        return (1 - amt) * start + amt * end;
                    }

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
                                tmpObj.dir = Math.lerpAngle(tmpObj.d2, tmpObj.d1, Math.min(1.2, ratio));
                            }
                        }
                    }
                    let xOffset = camX - (maxScreenWidth / 2);
                    let yOffset = camY - (maxScreenHeight / 2);

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
                    mainContext.lineWidth = 4;
                    mainContext.strokeStyle = "#000";
                    mainContext.globalAlpha = 0.06;
                    for (let x = -camX; x < maxScreenWidth; x += maxScreenHeight / SimpleGrids) {
                        if (x > 0) {
                            mainContext.moveTo(x, 0);
                            mainContext.lineTo(x, maxScreenHeight);
                        }
                    }
                    for (let y = -camY; y < maxScreenHeight; y += maxScreenHeight / SimpleGrids) {
                        if (y > 0) {
                            mainContext.moveTo(0, y);
                            mainContext.lineTo(maxScreenWidth, y);
                        }
                    }
                    mainContext.stroke();
                    if (player) {
                        if (lastDeath) {
                            mainContext.globalAlpha = 1;
                            mainContext.fillStyle = "#fc5553";
                            mainContext.font = "100px Hammersmith One";
                            mainContext.textBaseline = "middle";
                            mainContext.textAlign = "center";
                            mainContext.fillText("O", lastDeath.x - xOffset, lastDeath.y - yOffset);
                        }
                    }
                    mainContext.globalAlpha = 1;
                    mainContext.strokeStyle = outlineColor;
                    renderDeadPlayers(xOffset, yOffset);
                    mainContext.globalAlpha = 1;
                    mainContext.strokeStyle = outlineColor;
                    renderGameObjects(-1, xOffset, yOffset);
                    mainContext.globalAlpha = 1;
                    mainContext.lineWidth = outlineWidth;
                    renderProjectiles(0, xOffset, yOffset);
                    renderPlayers(xOffset, yOffset, 0);
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
                    renderGameObjects(0, xOffset, yOffset);
                    renderProjectiles(1, xOffset, yOffset);
                    renderGameObjects(1, xOffset, yOffset);
                    renderPlayers(xOffset, yOffset, 1);
                    renderGameObjects(2, xOffset, yOffset);
                    renderGameObjects(3, xOffset, yOffset);
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
                    mainContext.globalAlpha = 1;
                    if(player && player.alive && inGame && MenuNight !== 35) {
                        mainContext.fillStyle = `rgba(0, 0, 70, ${MenuNight})`;
                        mainContext.fillRect(0, 0, maxScreenWidth, maxScreenHeight);
                    } else {
                        mainContext.fillStyle = "rgba(0, 0, 70, 0.35)";
                        mainContext.fillRect(0, 0, maxScreenWidth, maxScreenHeight);
                    }
                    mainContext.strokeStyle = darkOutlineColor;
                    mainContext.globalAlpha = 1;
                    let shame = true;
                    for (let i = 0; i < players.length + ais.length; ++i) {
                        tmpObj = players[i] || ais[i - players.length];
                        if (tmpObj.visible) {
                            mainContext.strokeStyle = darkOutlineColor;
                            if (tmpObj.skinIndex != 10 || (tmpObj == player) || (tmpObj.team && tmpObj.team == player.team)) {
                                let tmpText = "";
                                tmpText = (tmpObj.team ? "[" + tmpObj.team + "] " : "") + tmpObj.name;
                                if (tmpText != "") {
                                    mainContext.font = (tmpObj.nameScale||30) + "px Hammersmith One";
                                    mainContext.fillStyle = "#fff";
                                    mainContext.textBaseline = "middle";
                                    mainContext.textAlign = "center";
                                    mainContext.lineWidth = (tmpObj.nameScale?11:8);
                                    mainContext.lineJoin = "round";
                                    if (getEl("nickname").checked || tmpObj == player || !tmpObj.isPlayer) {
                                        mainContext.strokeText(tmpText, tmpObj.x - xOffset, (tmpObj.y - yOffset - tmpObj.scale) - config.nameY);
                                        mainContext.fillText(tmpText, tmpObj.x - xOffset, (tmpObj.y - yOffset - tmpObj.scale) - config.nameY);
                                    }
                                    if (tmpObj.isLeader && iconSprites["crown"].isLoaded && (getEl("nickname").checked || tmpObj == player)) {
                                        var tmpS = config.crownIconScale;
                                        var tmpX = tmpObj.x - xOffset - (tmpS/2) - (mainContext.measureText(tmpText).width / 2) - config.crownPad;
                                        mainContext.drawImage(iconSprites["crown"], tmpX, (tmpObj.y - yOffset - tmpObj.scale)
                                                              - config.nameY - (tmpS/2) - 5, tmpS, tmpS);
                                    } if (tmpObj.iconIndex == 1 && iconSprites["skull"].isLoaded && (getEl("nickname").checked || tmpObj == player)) {
                                        var tmpS = config.crownIconScale;
                                        var tmpX = tmpObj.x - xOffset - (tmpS/2) + (mainContext.measureText(tmpText).width / 2) + config.crownPad;
                                        mainContext.drawImage(iconSprites["skull"], tmpX, (tmpObj.y - yOffset - tmpObj.scale)
                                                              - config.nameY - (tmpS/2) - 5, tmpS, tmpS);
                                    }
                                    if (tmpObj.isPlayer && instaC.wait && crossHair && near == tmpObj && (crossHair ? crossHairSprites[1].isLoaded : crossHairSprites[0].isLoaded) && enemy.length) {
                                        let tmpS = tmpObj.scale * 2.2;
                                        mainContext.drawImage((crossHair ? crossHairSprites[1] : crossHairSprites[0]), tmpObj.x - xOffset - tmpS / 2, tmpObj.y - yOffset - tmpS / 2, tmpS, tmpS);
                                    }
                                    if(tmpObj.isPlayer && shame && (getEl("nickname").checked || tmpObj == player)) {
                                        let textColor;
                                        mainContext.font = (tmpObj.nameScale || 30) + "px Hammersmith One";
                                        if (tmpObj.shameCount == 0) {
                                            textColor = "#fff";
                                        } else if (tmpObj.shameCount == 1) {
                                            textColor = "#008000";
                                        } else if (tmpObj.shameCount == 2) {
                                            textColor = "#006400";
                                        } else if (tmpObj.shameCount == 3) {
                                            textColor = "#fff700";
                                        } else if (tmpObj.shameCount == 4) {
                                            textColor = "#9c9c22";
                                        } else if (tmpObj.shameCount == 5) {
                                            textColor = "#fa0202";
                                        } else if (tmpObj.shameCount == 6) {
                                            textColor = "#8ecc51";
                                        } else if (tmpObj.shameCount >= 7) {
                                            textColor = "#cc5151";
                                        }
                                        mainContext.fillStyle = textColor;
                                        mainContext.textBaseline = "middle";
                                        mainContext.textAlign = "center";
                                        mainContext.lineWidth = tmpObj.nameScale ? 11 : 8;
                                        mainContext.lineJoin = "round";
                                        mainContext.strokeStyle = "black";

                                        mainContext.strokeText(tmpObj.shameCount, (tmpObj.iconIndex == 1 ? (tmpObj.x - xOffset - 30 + mainContext.measureText(tmpText).width / 2 + config.crownPad * 3.5 + 5) : (tmpObj.x - xOffset + mainContext.measureText(tmpText).width / 2 + config.crownPad)), tmpObj.y - yOffset - tmpObj.scale - config.nameY),
                                            mainContext.fillText(tmpObj.shameCount, (tmpObj.iconIndex == 1 ? (tmpObj.x - xOffset - 30 + mainContext.measureText(tmpText).width / 2 + config.crownPad * 3.5 + 5) : (tmpObj.x - xOffset + mainContext.measureText(tmpText).width / 2 + config.crownPad)), tmpObj.y - yOffset - tmpObj.scale - config.nameY)
                                    }

                                    tmpText = "";
                                }
                                if (tmpObj.isPlayer) {
                                    mainContext.lineCap = "round";
                                    mainContext.strokeStyle = "#581845";
                                    mainContext.lineWidth = 8
                                    mainContext.beginPath();
                                    mainContext.moveTo(0, 0);
                                    mainContext.lineTo(0, - tmpObj.scale);
                                    mainContext.lineTo(- tmpObj.scale, - tmpObj.scale);
                                    mainContext.stroke();
                                    mainContext.strokeStyle = "transparent";
                                }
                                if (!isTeam(tmpObj) && tmpObj.isPlayer && getEl("tracersvalue").value == "tracersMe") {
                                    let center = {
                                        x: screenWidth / 2,
                                        y: screenHeight / 2,
                                    };
                                    let alpha = Math.min(1, (UTILS.getDistance(0, 0, player.x - tmpObj.x, (player.y - tmpObj.y) * (16 / 9)) * 100) / (config.maxScreenHeight / 2) / center.y);
                                    let dist = center.y * alpha;
                                    let tmpX = dist * Math.cos(UTILS.getDirect(tmpObj, player, 0, 0));
                                    let tmpY = dist * Math.sin(UTILS.getDirect(tmpObj, player, 0, 0));
                                    mainContext.save();
                                    mainContext.translate((player.x - xOffset) + tmpX, (player.y - yOffset) + tmpY);
                                    mainContext.rotate(tmpObj.aim2 + Math.PI / 2);

                                    let by = 255;
                                    mainContext.fillStyle = tmpObj === player || (tmpObj.team && tmpObj.team === player.team) ? "rgba(255, 255, 255, 1)" : `rgb(${by}, ${by}, ${by})`;
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
                                let render = {
                                    x: tmpObj.x2 - xOffset,
                                    y: tmpObj.y2 - yOffset
                                };
                                if (tmpObj.health) {
                                    if (false) {
                                        mainContext.shadowBlur = 2;
                                        mainContext.shadowColor = "rgba(0, 0, 0, 0.5)";
                                        mainContext.shadowOffsetX = 30;
                                        mainContext.shadowOffsetY = 17
                                    }

                                    mainContext.globalAlpha = 1;
                                    mainContext.font = "20px Hammersmith One";
                                    mainContext.fillStyle = "#fff";
                                    mainContext.strokeStyle = darkOutlineColor;
                                    mainContext.textBaseline = "middle";
                                    mainContext.textAlign = "center";
                                    mainContext.lineWidth = 8;
                                    mainContext.lineJoin = "round";
                                    function arrow2(e1,e2,e3, colors, alpha, lineWidth = 0, shownigas) {
                                        let mainCf = shownigas == true ? (tmpObj.isPlayer && tmpObj != player) : (tmpObj.isPlayer && tmpObj.sid != player.sid && !(isAlly(tmpObj.sid) && tmpObj.sid != player.sid))
                                        let center = {
                                            x: screenWidth / 2,
                                            y: screenHeight / 2,
                                        };
                                        let alpha2 = Math.min(1, (UTILS.getDistance(0, 0, player.x - tmpObj.x, (player.y - tmpObj.y) * (16 / 9)) * 100) / (config.maxScreenHeight / 2) / center.y);
                                        if (mainCf && !isTeam(tmpObj)) {
                                            let distance = Math.sqrt((tmpObj.x-player.x)**2 + (tmpObj.x-player.x)**2),
                                                G = player.x + distance * 0.5 * Math.cos(Math.atan2(tmpObj.y - player.y, tmpObj.x - player.x)),
                                                F = player.y + distance * 0.5 * Math.sin(Math.atan2(tmpObj.y - player.y, tmpObj.x - player.x));
                                            mainContext.save();
                                            mainContext.translate(G - xOffset, F - yOffset);
                                            mainContext.rotate(Math.atan2(tmpObj.y - player.y, tmpObj.x - player.x) + Math.PI / 2);
                                            mainContext.fillStyle = colors;
                                            mainContext.globalAlpha = alpha == "auto" ? alpha2 : alpha;
                                            mainContext.lineWidth = lineWidth;
                                            mainContext.lineCap = "round";
                                            mainContext.beginPath();
                                            mainContext.strokeStyle = "transparent";
                                            mainContext.moveTo(e1, e1);
                                            mainContext.lineTo(e2, e2);
                                            mainContext.lineTo(-e3, e3);
                                            mainContext.fill();
                                            mainContext.stroke();
                                            mainContext.closePath();
                                            mainContext.restore();
                                        }
                                    }
                                    if (getEl("tracersvalue").value == "tracersThem") {
                                        arrow2(0, 20, 20, "rgba(0,0,0,5)", "auto", 6, true);
                                    }
                                    if (!isTeam(tmpObj) && tmpObj.isPlayer && getEl("tracersvalue").value == "tracersFor") {
                                        const angle = Math.atan2(tmpObj.y - player.y, tmpObj.x - player.x);
                                        const distance = Math.sqrt((tmpObj.y-player.y)**2 + (tmpObj.x-player.x)**2);
                                        const offset = Math.min(distance - player.scale, player.scale * 2);
                                        const arrowPos = {
                                            x: player.x + offset * Math.cos(angle),
                                            y: player.y + offset * Math.sin(angle)
                                        }
                                        drawArrow(xOffset, yOffset, arrowPos.x, arrowPos.y, 4, darkOutlineColor, angle, 15);
                                        drawArrow(xOffset, yOffset, arrowPos.x, arrowPos.y, 4, "#fff", angle, 8);
                                    }

                                    if (getEl("smoothhealth").checked && tmpObj.isPlayer) {
                                        tmpObj.oldHealth = tmpObj.oldHealth - (tmpObj.oldHealth - tmpObj.health) / 10;
                                    } else {
                                        tmpObj.oldHealth = tmpObj.health;
                                    }

                                    if (getEl("healthbar").checked) {
                                        mainContext.fillStyle = darkOutlineColor;
                                        mainContext.roundRect(tmpObj.x - xOffset - config.healthBarWidth - config.healthBarPad,
                                                              (tmpObj.y - yOffset + tmpObj.scale) + config.nameY, (config.healthBarWidth * 2) +
                                                              (config.healthBarPad * 2), 17, 8);
                                        mainContext.fill();

                                        mainContext.fillStyle = (tmpObj == player || (tmpObj.team && tmpObj.team == player.team)) ? "#8ecc51" : "#cc5151";
                                        mainContext.roundRect(tmpObj.x - xOffset - config.healthBarWidth,
                                                              (tmpObj.y - yOffset + tmpObj.scale) + config.nameY + config.healthBarPad,
                                                              ((config.healthBarWidth * 2) * (tmpObj.oldHealth / tmpObj.maxHealth)), 17 - config.healthBarPad * 2, 7);
                                        mainContext.fill();
                                    }


                                    if(tmpObj.isPlayer) {
                                        let reloads = {
                                            primary: (tmpObj.primaryIndex == undefined ? 1 : ((items.weapons[tmpObj.primaryIndex].speed - tmpObj.reloads[tmpObj.primaryIndex]) / items.weapons[tmpObj.primaryIndex].speed)),
                                            secondary: (tmpObj.secondaryIndex == undefined ? 1 : ((items.weapons[tmpObj.secondaryIndex].speed - tmpObj.reloads[tmpObj.secondaryIndex]) / items.weapons[tmpObj.secondaryIndex].speed)),
                                            turret: (2500 - tmpObj.reloads[53]) / 2500,
                                        };

                                        if (tmpObj == player) {
                                            if (player.reloads[player.weapons[1]] != 0 && player.weapons[1]) {
                                                mainContext.fillStyle = darkOutlineColor;
                                                mainContext.roundRect(tmpObj.x - xOffset - config.healthBarPad + 5,
                                                                      (tmpObj.y - yOffset + tmpObj.scale) + config.nameY - 13, (config.healthBarWidth-5) +
                                                                      (config.healthBarPad * 2), 17, 8);
                                                mainContext.fill();

                                                mainContext.fillStyle = "#FFF533"
                                                mainContext.roundRect(tmpObj.x - xOffset + 5,
                                                                      (tmpObj.y - yOffset + tmpObj.scale) + config.nameY - 13 + config.healthBarPad,
                                                                      (config.healthBarWidth * reloads.secondary + 1) - 5, 17 - config.healthBarPad * 2, 7);
                                                mainContext.fill();
                                            }

                                            if (player.reloads[player.weapons[0]] != 0) {
                                                mainContext.fillStyle = darkOutlineColor;
                                                mainContext.roundRect(tmpObj.x - xOffset - config.healthBarWidth - config.healthBarPad,
                                                                      (tmpObj.y - yOffset + tmpObj.scale) + config.nameY - 13, config.healthBarWidth +
                                                                      (config.healthBarPad * 2) - 5, 17, 8);
                                                mainContext.fill();

                                                mainContext.fillStyle = "#FFF533"
                                                mainContext.roundRect(tmpObj.x - xOffset - config.healthBarWidth,
                                                                      (tmpObj.y - yOffset + tmpObj.scale) + config.nameY - 13 + config.healthBarPad,
                                                                      (config.healthBarWidth * reloads.primary + 1) - 5, 17 - config.healthBarPad * 2, 7);
                                                mainContext.fill();
                                            }
                                            if (player.reloads[53] != 0 && false) {
                                                mainContext.fillStyle = darkOutlineColor;
                                                mainContext.roundRect(tmpObj.x - xOffset - config.healthBarWidth - config.healthBarPad,
                                                                      (tmpObj.y - yOffset + tmpObj.scale) + config.nameY + 13, (config.healthBarWidth * 2) +
                                                                      (config.healthBarPad * 2), 17, 8);
                                                mainContext.fill();

                                                mainContext.fillStyle = "#a9a9a9";
                                                mainContext.roundRect(tmpObj.x - xOffset - config.healthBarWidth,
                                                                      (tmpObj.y - yOffset + tmpObj.scale) + config.nameY + 13 + config.healthBarPad,
                                                                      ((config.healthBarWidth * 2) * reloads.turret), 17 - config.healthBarPad * 2, 7);
                                                mainContext.fill();
                                            }
                                        }
                                        if(tmpObj.isPlayer && tmpObj === player && configs7.Visuals && getEl("healthbar").checked) {
                                            mainContext.fillStyle = "#fff";
                                            mainContext.strokeStyle = "black";
                                            mainContext.strokeText(Math.floor(player.health), tmpObj.x - xOffset, (tmpObj.y - yOffset - tmpObj.scale) + 135);
                                            mainContext.fillText(Math.floor(player.health), tmpObj.x - xOffset, (tmpObj.y - yOffset - tmpObj.scale) + 135);
                                        } else if(tmpObj.isPlayer && tmpObj !== player && configs7.Visuals && getEl("healthbar").checked) {
                                            mainContext.fillStyle = "#fff";
                                            mainContext.strokeStyle = "black";
                                            mainContext.strokeText(Math.floor(tmpObj.health), tmpObj.x - xOffset, (tmpObj.y - yOffset - tmpObj.scale) + 135);
                                            mainContext.fillText(Math.floor(tmpObj.health), tmpObj.x - xOffset, (tmpObj.y - yOffset - tmpObj.scale) + 135);
                                        }
                                    }
                                }
                            }
                        }
                    }
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
                                        renderResources(tmpObj, tmpX, tmpY);
                                        tmpSprite = getResSprite(tmpObj);
                                        mainContext.drawImage(tmpSprite, tmpX - (tmpSprite.width / 2), tmpY - (tmpSprite.height / 2));
                                    }
                                }

                                if (layer == 3) {
                                    if (tmpObj.active && tmpObj.health > 0 && tmpObj.group != undefined && getDist(tmpObj, player) <= 450) {
                                        if (tmpObj.health < tmpObj.maxHealth) {
                                            if (configs7.BuildHp) {
                                                mainContext.fillStyle = darkOutlineColor;
                                                mainContext.beginPath();
                                                mainContext.arc(tmpX, tmpY, config.healthBarWidth / 2 + config.healthBarPad, 0, 2 * Math.PI);
                                                mainContext.fill();

                                                mainContext.fillStyle = tmpObj.isTeamObject(player) ? "#8ecc51" : "#cc5151";
                                                mainContext.beginPath();
                                                mainContext.arc(tmpX, tmpY, config.healthBarWidth * (tmpObj.health / tmpObj.maxHealth) / 2, 0, 2 * Math.PI);
                                                mainContext.fill();

                                                const fontSize = 18;
                                                mainContext.font = `${fontSize}px Hammersmith One`;
                                                mainContext.fillStyle = tmpObj.isTeamObject(player) ? "#8ecc51" : "#cc5151";
                                                mainContext.strokeStyle = "black";

                                                mainContext.strokeText(Math.floor(tmpObj.health), tmpObj.x - xOffset, tmpObj.y - yOffset);
                                                mainContext.fillText(Math.floor(tmpObj.health), tmpObj.x - xOffset, tmpObj.y - yOffset);

                                            }
                                        }
                                    }
                                }
                            }
                        });


                        mainContext.restore();
                        if (layer == 0 && configs7.RenderPl) {
                            if (placeVisible.length) {
                                placeVisible.forEach((places) => {
                                    tmpX = places.x - xOffset;
                                    tmpY = places.y - yOffset;
                                    markObject(places, tmpX, tmpY);
                                });
                            }
                        }
                    }
                    function renderResources(param1, param2, param3) {
                        let sprite = getResSprite(param1);
                        let easeScaling = 0.06, minAlpha = 0.4;
                        if (player && param1.type === 0) {
                            if (!treeAlphaState[param1.sid]) treeAlphaState[param1.sid] = 1;
                            if (Math.sqrt((param1.y-player.y2)**2 + (param1.x-player.x2)**2) <= param1.scale + player.scale) {
                                treeAlphaState[param1.sid] = Math.max(minAlpha, (treeAlphaState[param1.sid] - easeScaling));
                                mainContext.globalAlpha = treeAlphaState[param1.sid];
                            } else {
                                treeAlphaState[param1.sid] = Math.min(1, (treeAlphaState[param1.sid] + easeScaling));
                                mainContext.globalAlpha = treeAlphaState[param1.sid];
                            }
                        }
                        mainContext.drawImage(sprite, param2 - sprite.width / 2, param3 - sprite.height / 2);
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
                        //AutoPushLine
                        if (!pathFind.active) {
                            if (my.autoPush) {
                                mainContext.lineWidth = 5;
                                mainContext.globalAlpha = 0.8;
                                mainContext.beginPath();

                                mainContext.strokeStyle = "rgba(255, 255, 255)";
                                mainContext.moveTo(player.x - xOffset, player.y - yOffset);
                                mainContext.lineTo(my.pushData.x2 - xOffset, my.pushData.y2 - yOffset);
                                mainContext.lineTo(my.pushData.x - xOffset, my.pushData.y - yOffset);
                                mainContext.stroke();
                            }
                            if (my.SpikeAim) {
                                mainContext.globalAlpha = 0.3;
                                mainContext.beginPath();

                                mainContext.fillStyle = "rgba(255, 0, 0)";
                                const spikeX = SpikeX() - xOffset;
                                const spikeY = SpikeY() - yOffset;
                                const radius = 50;
                                mainContext.arc(spikeX, spikeY, radius, 0, Math.PI * 2);
                                mainContext.fill();

                            }
                            if (my.TrapAim && !my.SpikeAim) {
                                mainContext.globalAlpha = 0.3;
                                mainContext.beginPath();

                                mainContext.fillStyle = "rgba(255, 0, 0)";
                                const TrapXTest = TrapX() - xOffset;
                                const TrapYTest = TrapY() - yOffset;
                                const radius = 50;
                                mainContext.arc(TrapXTest, TrapYTest, radius, 0, Math.PI * 2);
                                mainContext.fill();
                            }
                        }
                    }
                    mainContext.globalAlpha = 1;

                    textManager.update(delta, mainContext, xOffset, yOffset);
                    for (var i = 0; i < players.length; ++i) {
                        tmpObj = players[i];
                        if (tmpObj.visible && tmpObj.chatCountdown > 0 && $("#menuChatDiv").css('opacity') == 0) {
                            tmpObj.chatCountdown -= delta;
                            if (tmpObj.chatCountdown <= 0)
                                tmpObj.chatCountdown = 0;
                            mainContext.font = "28px Hammersmith One";
                            var tmpSize = mainContext.measureText(tmpObj.chatMessage);
                            mainContext.textBaseline = "middle";
                            mainContext.textAlign = "center";
                            var tmpX = tmpObj.x - xOffset;
                            var tmpY = tmpObj.y - tmpObj.scale - yOffset - 90;
                            var tmpH = 47;
                            var tmpW = tmpSize.width + 17;
                            mainContext.fillStyle = "rgba(0,0,0,0.2)";
                            mainContext.roundRect(tmpX-tmpW/2, tmpY-tmpH/2, tmpW, tmpH, 6);
                            mainContext.fill();
                            mainContext.fillStyle = "#fff";
                            mainContext.fillText(tmpObj.chatMessage, tmpX, tmpY);
                        }
                    }
                }
                mainContext.globalAlpha = 1;
                renderMinimap(delta);
            }
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
            let Ps = document.getElementById("showPing");
            Ps.checked = true;
            function doUpdate() {
                const now2 = new Date();
                const hours = now2.getHours();
                const minutes = now2.getMinutes();
                const secondsFor = now2.getSeconds();

                const ampm = hours >= 12 ? 'PM' : 'AM';
                const formattedHours = (hours % 12 || 12).toString();
                const formattedMinutes = minutes.toString().padStart(2, '0');
                let seconds = secondsFor < 10 ? "0" + secondsFor : secondsFor;
                let time = `${formattedHours}:${formattedMinutes}:${seconds} ${ampm}`;
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
                if(Ps.checked) {
                    getEl("pingFps").innerHTML = `Ping: ${window.pingTime}ms |`
                    getEl("maxping").innerHTML = `Max: ${ms.max}ms |`
                    //getEl("packet").innerHTML = `Packet: ${secPacket}`;
                    getEl("fps").innerHTML = `FPS: ${UTILS.round(fpsTimer.ltime, 10)}`;
                }else {
                    getEl("fps").innerHTML = ` `;
                    getEl("pingFps").innerHTML = ` `
                    getEl("maxping").innerHTML = ` `
                    //getEl("packet").innerHTML = `⠀`;
                }
            }
            prepareMenuBackground();
            doUpdate();
            let changeDays = {};
            window.debug = function() {
                my.waitHit = 0;
                my.canHat = true;
                my.autoAim = false;
                my.InstaAim = false;
                instaC.isTrue = false;
                traps.inTrap = false;
                itemSprites = [];
                objSprites = [];
                gameObjectSprites = [];
            };
            window.resBuild = function() {
                if (gameObjects.length) {
                    gameObjects.forEach((tmp) => {
                        tmp.breakObj = false;
                    });
                    breakObjects = [];
                }
            };
            window.ResetGrids = function() {
                $('#slider').val(18);
            }
            window.ResetPlayers = function() {
                $('#players').val(90);
            }
            window.ResetNight = function() {
                $('#menunight').val(35);
            }
            window.ResetThis = function() {
                $('#menuequalizer').val(45);
            }
            window.zoomvis = function() {
                zoomVision();
            };
            let myVariable = true;
            window.toggleNight = function() {
                clearTimeout(changeDays);
                isNight = !isNight;
                if (isNight) {
                    textManager.showText(player.x2, player.y2, 30, 0.15, 1850, `Toggle On `, "#fff", 2);
                } else {
                    textManager.showText(player.x2, player.y2, 30, 0.15, 1850, `Toggle Off `, "#fff", 2);
                }
                itemSprites = [];
                objSprites = [];
                gameObjectSprites = [];
            };
            let toggleBlur = true;
            window.closeMenu = function() {
                MenuRangeIsTrue = false;
            }
            window.toggleBlur2 = function() {
                toggleBlur = !toggleBlur;
                if (toggleBlur) {
                    textManager.showText(player.x2, player.y2, 30, 0.15, 1850, `Toggle On `, "#fff", 2);
                } else {
                    textManager.showText(player.x2, player.y2, 30, 0.15, 1850, `Toggle Off `, "#fff", 2);
                }
                document.getElementById('leaderboard').style.backdropFilter = toggleBlur ? 'blur(4px)' : 'blur(0px)';
                document.getElementById('scoreDisplay').style.backdropFilter = toggleBlur ? 'blur(4px)' : 'blur(0px)';
                document.getElementById('killCounter').style.backdropFilter = toggleBlur ? 'blur(4px)' : 'blur(0px)';
                document.getElementById('stoneDisplay').style.backdropFilter = toggleBlur ? 'blur(4px)' : 'blur(0px)';
                document.getElementById('woodDisplay').style.backdropFilter = toggleBlur ? 'blur(4px)' : 'blur(0px)';
                document.getElementById('foodDisplay').style.backdropFilter = toggleBlur ? 'blur(4px)' : 'blur(0px)';
                document.getElementById('storeButton').style.backdropFilter = toggleBlur ? 'blur(4px)' : 'blur(0px)';
                document.getElementById('leaderboardButton').style.backdropFilter = toggleBlur ? 'blur(4px)' : 'blur(0px)';
                document.querySelector('.actionBarItem').style.backdropFilter = toggleBlur ? 'blur(4px)' : 'blur(0px)';
                document.getElementById('allianceButton').style.backdropFilter = toggleBlur ? 'blur(4px)' : 'blur(0px)';
                document.getElementById('mapDisplay').style.backdropFilter = toggleBlur ? 'blur(4px)' : 'blur(0px)';

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

