// ==UserScript==
// @name         term.ptt autologin
// @namespace    NoNameSpace
// @version      0.3
// @description  restore term.ptt autologin function
// @match        *://term.ptt.cc
// @match        *://term.ptt.cc/*
// @grant        none
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/35360/termptt%20autologin.user.js
// @updateURL https://update.greasyfork.org/scripts/35360/termptt%20autologin.meta.js
// ==/UserScript==

var RealWebSocket = window.WebSocket;
class FakeWebSocket extends RealWebSocket {
    constructor(url) {
        super(url);
        this.sendStr = (e) => {
            for (var t = 0; t < e.length; t += 1e3) {
                var i = e.substring(t, t + 1e3)
                , s = new Uint8Array(i.split("").map(function(e) {
                    return e.charCodeAt(0);
                }));
                this.send(s.buffer);
            }
        };
        this.addEventListener("open", () => {
            setTimeout(() => {
                var USER = '';
                var PASS = '';
                this.sendStr(USER + '\x0d' + PASS + '\x0d');
            }, 500);
        });
    }
}
window.WebSocket = FakeWebSocket;

var ael = window.addEventListener;
window.addEventListener = function (...args) {
    if (args[0] === 'beforeunload') return;
    return ael.apply(this, args);
};