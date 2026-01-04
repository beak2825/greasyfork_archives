// ==UserScript==
// @name         Simple Multiplayer IP Agario Script
// @namespace    MultiplayerScript Agario v.1
// @version      1.1
// @description  IP address on URL, COPY+PASTE for Agario multiplayer (all modes)
// @homepage     https://jimboy3100.github.io
// @author       Jimboy3100
// @icon         https://raw.githubusercontent.com/jimboy3100/legend.github.io/master/banners/smallbannerlegendclan.png
// @match        https://agar.io/*
// @run-at       document-start
// @grant        GM_xmlhttpRequest
// @connect      agar.io
// @downloadURL https://update.greasyfork.org/scripts/30289/Simple%20Multiplayer%20IP%20Agario%20Script.user.js
// @updateURL https://update.greasyfork.org/scripts/30289/Simple%20Multiplayer%20IP%20Agario%20Script.meta.js
// ==/UserScript==

// MultiplayerMod by Jimboy3100

setTimeout(function () {
var IP;
var SIP;
var stateObj = { foo: "bar" };
    var a = WebSocket.prototype.send;
    window.__WS_send = WebSocket.prototype.send, WebSocket.prototype.send = function(b) {
        IP=this.url;
        try {
            var c = /((?:[0-9]{1,3}(?:\.|\-)){1,3}[0-9]{1,3})(?:.*?)?(\:[0-9]{1,5})/,
                d = c.exec(this.url);
            SIP="http://agar.io/?sip=" + d[1].replace(/-/g, '.') + d[2];
        } catch (e) {}
        try {
            a.apply(this, [b]), WebSocket.prototype.send = a
        } catch (e) {
            window.__WS_send.apply(this, [b]), WebSocket.prototype.send = window.__WS_send
        }
    }

	setTimeout(function () {
	history.pushState(stateObj, "page 2",SIP);
	}, 3000);

		$("#instructions").append('<center><span></span>' +
        'SIP address on URL, COPY+PASTE for multiplayer. By Jimboy3100, author of <a href="http://www.jimboy3100.github.io" target="_blank">LegendMod</a></center>');
}, 8000);
              