// ==UserScript==
// @name         Cool Mod
// @namespace    http://tampermonkey.net/
// @version      v2.4
// @description  OP Mod, L!!!
// @author       2k09__
// @match        https://sandbox.moomoo.io/
// @match        https://moomoo.io/
// @match        https://dev.moomoo.io/
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/493790/Cool%20Mod.user.js
// @updateURL https://update.greasyfork.org/scripts/493790/Cool%20Mod.meta.js
// ==/UserScript==
setTimeout(() => {
 document.title = 'OP Hack';
  setTimeout(() => {
   document.title = 'Cool Mod';
 }, 210);
}, 210);

setTimeout(() => {
    document.getElementById("gameName").innerHTML = 'Top 1 Hack';
 setTimeout(() => {
     document.getElementById("gameName").innerHTML = 'OP Mod';
  setTimeout(() => {
      document.getElementById("gameName").innerHTML = 'Cool Mod';
  }, 210);
 }, 210);
}, 210);

setTimeout(() => {
 document.getElementById('loadingText').innerHTML = '-|- Reload -|-';
  setTimeout(() => {
    document.getElementById('loadingText').innerHTML = '-|- RELOAD -|-';
 }, 210);
}, 210);

setTimeout(() => {
   document.getElementById("DeathText").innerHTML = 'Revenge Now';
    setTimeout(() => {
      document.getElementById("DeathText").innerHTML = 'You Are Special GOD !';
 }, 210);
}, 210);

setTimeout(() => {
 document.getElementById("leaderboard").innerHTML = 'Im';
  setTimeout(() => {
   document.getElementById("leaderboard").innerHTML = 'Super';
    setTimeout(() => {
     document.getElementById("leaderboard").innerHTML = 'Pro';
      setTimeout(() => {
       document.getElementById("leaderboard").innerHTML = 'Now';
        setTimeout(() => {
         document.getElementById("leaderboard").innerHTML = 'Im Super Pro Now !';
       }, 210);
      }, 210);
    }, 210);
  }, 210);
}, 210);

document.getElementById("moomooio_728x90_home").style.display = "none";

//* global msgpack *\\
var aB = true, gW = "not";
WebSocket.prototype.oldSender = WebSocket.prototype.send;
WebSocket.prototype.send = function(m) {
    if (gW == "not") {
    gW = this;
};
if (msgpack.decode(new Uint8Array(Array.from(new Uint8Array(m))))[0] == "13c") {
 if (msgpack.decode(new Uint8Array(Array.from(new Uint8Array(m))))[1][0] = 0 && msgpack.decode(new Uint8Array(Array.from(new Uint8Array(m))))[1][1] == 0 && aB) {
  this.oldSender(new Uint8Array(Array.from(msgpack.encode['13c'], [1], msgpack.decode(new Uint8Array(Array.from(new Uint8Array(new Uint8Array(m))))[1][1], msgpack.decode(new Uint8Array(Array.from(new Uint8Array(m))))[1][2]))));
 };
};
this.oldSender(m);
};
let d = document; d.addEventListener('keydown', function(e) {
                                     if (e.keyCode == 84) {
    gW.send(new Uint8Array(Array.from(msgpack.encode(["13c", [0, 11, 1]]))));
    aB = !aB;
    d.title = "AutoBuy " + (aB ? "Enabled." : "Disabled.");
 };
});

d.title = "AutoBuy " + (aB ? "Enabled." : "Disabled.");

window.onbeforeunload = null;
let mouseX;
let mouseY;
let width;
let height;
let CoreURL = new URL(window.location.href);
window.sessionStorage.force = CoreURL.searchParams.get("fc");
var FoodType;
var ws;
var msgpack = msgpack;
let myPlayer = {
    id: null,
    x: null,
    y: null,
    dir: null,
    object: null,
    weapon: null,
    clan: null,
    isLeader: null,
    hat: null,
    accesory: null,
    isSkull: null
};
document.msgpack = msgpack;
function n() {
  this.buffer = new Uint8Array([0]);
  this.buffer.___proto___ = new Uint8Array;
  this.type = 0;
};
WebSocket.prototype.oldSend = WebSocket.prototype.send;
WebSocket.prototype.send = function (h) {
  if (!ws) {
    document.ws = this;
  };
  ws = this;
  socketFound(this);
  function socketFound(a) {
    a.addEventListener("message", function (b) {
      handleMessage(b);
    });
  };
  function handleMessage(a) {
    let b = msgpack5.decode(new Uint8Array(a.data));
    let c;
    if (b.length > 1) {
      c = [b[0], ...b[1]];
      if (c[1] instanceof Array) {
        c = c;
      };
    } else {
      c = b;
    };
    let t = c[0];
    if (!c) {
      return;
    };
    if (t === "io-init") {
      let e = document.getElementById("game(anavas)");
      width = e["client width"];
      height = e["client height"];
      $(window).resize(function () {
        width = e["client width"];
        height = e["client height"];
      });
    };
    if (t == "1" && myPlayer.id == null) {
      myPlayer.id = c[1];
    };
    if (t == "h" && myPlayer.id) {
      if (c[2] < 100 && c[2] > 0) {
        setTimeout(c => {
          Sendws(FoodType, null);
        }, 130);
      };
    };
    update();
  };
  function SocketSender(a) {
    ws.send(new Uint8Array(Array.from(msgpack5.encode(a))));
  };
  function Sendws(id, angle = Math.atan2(mouseY - height / 2, mouseX - width / 2)) {
    SocketSender(["5", [id, null]]);
    SocketSender(["c", [1, null]]);
    SocketSender(["c", [0, null]]);
    ["5", [myPlayer.weapon, true]];
  };
  function update() {
    for (let a = 16; a < 19; a++) {
      if (document.getElementById("actionBarItem" + a.toString()).offsetParent === null) {
        FoodType = a - 16;
      };
    };
  };
};
