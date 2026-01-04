// ==UserScript==
// @name         term.gamer.com.tw autologin
// @namespace    NoNameSpace
// @version      0.1
// @description  restore term.gamer.com.tw autologin function
// @match        *://term.gamer.com.tw
// @match        *://term.gamer.com.tw/*
// @grant        none
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/35761/termgamercomtw%20autologin.user.js
// @updateURL https://update.greasyfork.org/scripts/35761/termgamercomtw%20autologin.meta.js
// ==/UserScript==

(function() {
    var USER = '';
    var PASS = '';
    setTimeout(function () {
        var originalOnConnect = pttchrome.app.onConnect;
        pttchrome.app.onConnect = function () {
            originalOnConnect.call(this);
            this.sendData( USER + '\x0d' + PASS + '\x0d');
        };
        pttchrome.app.sendData(USER + '\x0d' + PASS + '\x0d');
    }, 1000);
})();

var ael = window.addEventListener;
window.addEventListener = function (...args) {
    if (args[0] === 'beforeunload') return;
    return ael.apply(this, args);
};