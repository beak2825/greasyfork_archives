// ==UserScript==
// @name        Sploop.io Rude Chat + Clan Generator (by crygen) giveaway
// @namespace   Violentmonkey Scripts
// @match       *://sploop.io/
// @grant       none
// @run-at      document-start
// @author      crygen
// @description rude chat + clan generator
// @version 0.0.1.20241004222857
// @downloadURL https://update.greasyfork.org/scripts/511517/Sploopio%20Rude%20Chat%20%2B%20Clan%20Generator%20%28by%20crygen%29%20giveaway.user.js
// @updateURL https://update.greasyfork.org/scripts/511517/Sploopio%20Rude%20Chat%20%2B%20Clan%20Generator%20%28by%20crygen%29%20giveaway.meta.js
// ==/UserScript==


var a = ["you're so bad", "get good, noob", "try harder next time", "is that your best shot?", "you're a real rookie", "even a potato plays better", "you call that a move?", "no skill at all", "do you even practice?", "i've seen better from a bot", "you play like my grandma", "you're just a free kill", "give up already", "not even close", "you're a walking target", "that was embarrassing", "your game sense is zero", "i thought this was a joke", "who taught you to play?", "you should stick to watching", "is this your first game?", "you make it too easy", "i've met rocks with more skill"];
var b = 0x7;
var c;
var d = (e, f) => {
    c = setInterval(() => {
        var g = a[Math.floor(Math.random() * a.length)];
        if (e.readyState === 1) {
            f(new Uint8Array([b, ...h(g)]));
        }
    }, 5000);
};
var i = () => {
    clearInterval(c);
};
var j = (e, f) => {
    e.addEventListener('open', () => {
        d(e, f);
    });
    e.addEventListener('error', i);
    e.addEventListener('close', i);
};
var h = (k => k.encode.bind(k))(new TextEncoder());
var l = () => {};
var m = () => {
    var n = document.querySelector("#clan-container");
    return n !== null;
};
var o = (p) => {
    var q = '1234567890!@#$%^&*()';
    var r = '';
    for (var s = 0; s < p; s++) {
        var t = Math.floor(Math.random() * q.length);
        r += q[t];
    }
    return r;
};
var u = () => {
    var v = document.querySelector("#clan-menu");
    var w = document.querySelector("#clan-menu-clan-name-input");
    var x = document.querySelector("#create-clan-button");

    if (v && w && x) {
        v.click();
        w.value = o(9);
        x.click();
        w.value = "";
    }
};
var y = () => {
    if (!m()) {
        u();
    }
};
window.addEventListener("DOMContentLoaded", () => {
    u();
    setInterval(y, 3000);
});
WebSocket = new Proxy(WebSocket, {
    construct: (z, A, B) => {
        var C = Reflect.construct(z, A, B);
        var D = C.send.bind(C);

        j(C, D);
        return C;
    }
});