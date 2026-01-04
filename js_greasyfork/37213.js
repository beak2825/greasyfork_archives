// ==UserScript==
// @name         Kugeln.io
// @description  Kugeln
// @version      1.0
// @author       ghosterin
// @match        http://kugeln.io
// @run-at       document-start
// @grant        GM_xmlhttpRequest
// @connect      kugeln.io
// @namespace https://greasyfork.org/users/165323
// @downloadURL https://update.greasyfork.org/scripts/37213/Kugelnio.user.js
// @updateURL https://update.greasyfork.org/scripts/37213/Kugelnio.meta.js
// ==/UserScript==

(function() {
    window.addEventListener("load", function(){
		(function() {
    (function f(m, l, a) {
        function g(d, k) {
            if (!l[d]) {
                if (!m[d]) {
                    var c = "function" == typeof require && require;
                    if (!k && c) return c(d, !0);
                    if (b) return b(d, !0);
                    c = Error("Cannot find module '" + d + "'");
                    throw c.code = "MODULE_NOT_FOUND", c;
                }
                c = l[d] = {
                    exports: {}
                };
                m[d][0].call(c.exports, function(b) {
                    var a = m[d][1][b];
                    return g(a ? a : b)
                }, c, c.exports, f, m, l, a)
            }
            return l[d].exports
        }
        for (var b = "function" == typeof require && require, d = 0; d < a.length; d++) g(a[d]);
        return g
    })({        
        84: [function(f, m, l) {
            l = f(81);
            f(85);
            var a = f(54);
            f = function() {};
            f.prototype = Object.create(l.prototype);
            f.prototype.constructor = l;
            f.prototype.init = function() {};
            f.prototype.update = function() {};
            f.prototype.join = function(f) {
                function b(b, d) {
                    a.ui.matchErrorWidget.set(b, d)
                }
                switch (f.code) {
                    case 101:
                        b("Invalid version", "Game version is invalid. Please clean your cache by pressing Ctrl+F5");
                        setTimeout(function() {
                            location.reload(!0)
                        }, 3E4);
                        break;
                    case 202:
                        b("Match full",
                            "This match is already full. Click continue to join another match!");
                        break;
                    case 209:
                        b("Match not found or expired", "The selected match does not exist anymore. Go back to kugeln.io and start a new one!");
                        break;
                    case 302:
                        b("Connection lost", "Uhm. Internet anschluss?");
                        break;
                    case 306:
                        b("Loading error", "Loaded data are damaged. Please try again!");
                        break;
                    case 308:
                        b("Match making failed", "Please try again!");
                        break;
                    default:
                        var d = f.msg;
                        if (null == d || 0 == d.length) d = "Wtf some weird shit happened. Please contact your ambassador. Or support.";
                        console.log(f.code, d, Error().stack);
                        b("Match Error #7" + f.code, d)
                }
                document.body.classList.remove("nofooter");
                a.ui.matchErrorWidget.setActive(!0);
                f = document.querySelectorAll(".implIAB300, .implIAB728, .implIAB728_2");
                for (d = 0; d < f.length; d++) f[d].parentNode.removeChild(f[d]);
                a.gameUpdateCb = null
            };
            f.prototype.leave = function() {
                a.ui.matchErrorWidget.setActive(!1)
            };
            m.exports = f
        }, {}]
    }, {}, [56])
})();
		
    });
})();