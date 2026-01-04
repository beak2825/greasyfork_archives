// ==UserScript==
// @name         Moomoo.io 1.8.0 Swear Words Bypass
// @author       Seryo
// @description  if you send a message with a swear word it capitalizes it to avoid game censorship.
// @version      1
// @match        *://*.moomoo.io/*
// @namespace    https://greasyfork.org/users/1190411
// @require      https://cdn.jsdelivr.net/npm/msgpack-lite@0.1.26/dist/msgpack.min.js
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/481034/Moomooio%20180%20Swear%20Words%20Bypass.user.js
// @updateURL https://update.greasyfork.org/scripts/481034/Moomooio%20180%20Swear%20Words%20Bypass.meta.js
// ==/UserScript==

var msgpack5 = msgpack;

var list = ["cubic", "flex", "cunt", "whore", "fuck", "shit", "faggot", "nigger", "nigga", "dick", "vagina", "minge", "cock", "rape", "cum", "sex", "tits", "penis", "clit", "pussy", "meatcurtain", "jizz", "prune", "douche", "wanker", "damn", "bitch", "dick", "fag", "bastard"];
WebSocket.prototype.oldSend = WebSocket.prototype.send;
WebSocket.prototype.send = function(m) {
    var data = msgpack5.decode(new Uint8Array(m));

    if (data[0] == "6") {
        var all = null;
        for (var t, n = 0; n < list.length; n++) {
            if (data[1][0].indexOf(list[n]) > -1) {
                t = "";
                for (var i = 0; i < list[n].length; i++) {
                    var f = list[n].substr(0, 1).toUpperCase();
                    t = f + list[n].substr(1, list[n].length);
                }
                var r = new RegExp(list[n], "g");
                if (!all) {
                    all = data[1][0].replace(r, t);
                } else {
                    all = all.replace(r, t);
                }
            }
        }
        if (all !== null) {
            this.oldSend(new Uint8Array(Array.from(msgpack5.encode(["6", [all]]))));
        }
    }
    this.oldSend(m);
};
