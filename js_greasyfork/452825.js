// ==UserScript==
// @name         Source Bot
// @namespace    https://greasyfork.org/
// @version      0.1
// @description  MINI Bot to MPP
// @author       COdER#3389
// @icon         https://mpphust.ga/assets/icon%20(48).png
// @include      *://multiplayerpiano.com/*
// @include      *://mppclone.com/*
// @include      *://mpp.terrium.net/*
// @include      *://piano.ourworldofpixels.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/452825/Source%20Bot.user.js
// @updateURL https://update.greasyfork.org/scripts/452825/Source%20Bot.meta.js
// ==/UserScript==
function say(string) {
      gClient.sendArray([{m:'a', message:string}]);
    }
function handleMessage(msg) {
window.inspect = (() => {
    function e(e, o) {
        var c = {
            seen: [],
            stylize: t
        };
        return arguments.length >= 3 && (c.depth = arguments[2]), arguments.length >= 4 && (c.colors = arguments[3]), n(o) ? c.showHidden = o : o && b(c, o), r(c.showHidden) && (c.showHidden = !1), r(c.depth) && (c.depth = 2), r(c.colors) && (c.colors = !1), r(c.customInspect) && (c.customInspect = !0), c.colors && (c.stylize = i), d(c, e, c.depth)
    }

    function t(e, t) {
        return e
    }

    function n(e) {
        return "boolean" == typeof e
    }

    function r(e) {
        return void 0 === e
    }

    function i(t, n) {
        var r = e.styles[n];
        return r ? "[" + e.colors[r][0] + "m" + t + "[" + e.colors[r][1] + "m" : t
    }

    function o(e) {
        return "function" == typeof e
    }

    function c(e) {
        return "string" == typeof e
    }

    function u(e) {
        return null === e
    }

    function l(e, t) {
        return Object.prototype.hasOwnProperty.call(e, t)
    }

    function s(e) {
        return a(e) && "[object RegExp]" === y(e)
    }

    function a(e) {
        return "object" == typeof e && null !== e
    }

    function p(e) {
        return a(e) && ("[object Error]" === y(e) || e instanceof Error)
    }

    function f(e) {
        return a(e) && "[object Date]" === y(e)
    }

    function y(e) {
        return Object.prototype.toString.call(e)
    }

    function g(e) {
        return "[" + Error.prototype.toString.call(e) + "]"
    }

    function d(t, i, a) {
        if (t.customInspect && i && o(i.inspect) && i.inspect !== e && (!i.constructor || i.constructor.prototype !== i)) {
            var y = i.inspect(a, t);
            return c(y) || (y = d(t, y, a)), y
        }
        var b = function(e, t) {
            if (r(t)) return e.stylize("undefined", "undefined");
            if (c(t)) {
                var i = "'" + JSON.stringify(t).replace(/^"|"$/g, "").replace(/'/g, "\\'").replace(/\\"/g, '"') + "'";
                return e.stylize(i, "string")
            }
            if (o = t, "number" == typeof o) return e.stylize("" + t, "number");
            var o;
            if (n(t)) return e.stylize("" + t, "boolean");
            if (u(t)) return e.stylize("null", "null")
        }(t, i);
        if (b) return b;
        var m = Object.keys(i),
            v = function(e) {
                var t = {};
                return e.forEach((function(e, n) {
                    t[e] = !0
                })), t
            }(m);
        try {
            t.showHidden && Object.getOwnPropertyNames && (m = Object.getOwnPropertyNames(i))
        } catch (e) {}
        if (p(i) && (m.indexOf("message") >= 0 || m.indexOf("description") >= 0)) return g(i);
        if (0 === m.length) {
            if (o(i)) {
                var O = i.name ? ": " + i.name : "";
                return t.stylize("[Function" + O + "]", "special")
            }
            if (s(i)) return t.stylize(RegExp.prototype.toString.call(i), "regexp");
            if (f(i)) return t.stylize(Date.prototype.toString.call(i), "date");
            if (p(i)) return g(i)
        }
        var z, j = "",
            w = !1,
            S = ["{", "}"];
        (Array.isArray(i) && (w = !0, S = ["[", "]"]), o(i)) && (j = " [Function" + (i.name ? ": " + i.name : "") + "]");
        return s(i) && (j = " " + RegExp.prototype.toString.call(i)), f(i) && (j = " " + Date.prototype.toUTCString.call(i)), p(i) && (j = " " + g(i)), 0 !== m.length || w && 0 != i.length ? a < 0 ? s(i) ? t.stylize(RegExp.prototype.toString.call(i), "regexp") : t.stylize("[Object]", "special") : (t.seen.push(i), z = w ? function(e, t, n, r, i) {
            for (var o = [], c = 0, u = t.length; c < u; ++c) l(t, String(c)) ? o.push(h(e, t, n, r, String(c), !0)) : o.push("");
            return i.forEach((function(i) {
                i.match(/^\d+$/) || o.push(h(e, t, n, r, i, !0))
            })), o
        }(t, i, a, v, m) : m.map((function(e) {
            return h(t, i, a, v, e, w)
        })), t.seen.pop(), function(e, t, n) {
            if (e.reduce((function(e, t) {
                    return t.indexOf("\n") >= 0 && 0, e + t.replace(/\u001b\[\d\d?m/g, "").length + 1
                }), 0) > 60) return n[0] + ("" === t ? "" : t + "\n ") + " " + e.join(",\n  ") + " " + n[1];
            return n[0] + t + " " + e.join(", ") + " " + n[1]
        }(z, j, S)) : S[0] + j + S[1]
    }

    function h(e, t, n, i, o, c) {
        var s, a, p;
        p = {
            value: void 0
        };
        try {
            p.value = t[o]
        } catch (e) {}
        try {
            Object.getOwnPropertyDescriptor && (p = Object.getOwnPropertyDescriptor(t, o) || p)
        } catch (e) {}
        if (p.get ? a = p.set ? e.stylize("[Getter/Setter]", "special") : e.stylize("[Getter]", "special") : p.set && (a = e.stylize("[Setter]", "special")), l(i, o) || (s = "[" + o + "]"), a || (e.seen.indexOf(p.value) < 0 ? (a = u(n) ? d(e, p.value, null) : d(e, p.value, n - 1)).indexOf("\n") > -1 && (a = c ? a.split("\n").map((function(e) {
                return "  " + e
            })).join("\n").substr(2) : "\n" + a.split("\n").map((function(e) {
                return "   " + e
            })).join("\n")) : a = e.stylize("[Circular]", "special")), r(s)) {
            if (c && o.match(/^\d+$/)) return a;
            (s = JSON.stringify("" + o)).match(/^"([a-zA-Z_][a-zA-Z_0-9]*)"$/) ? (s = s.substr(1, s.length - 2), s = e.stylize(s, "name")) : (s = s.replace(/'/g, "\\'").replace(/\\"/g, '"').replace(/(^"|"$)/g, "'"), s = e.stylize(s, "string"))
        }
        return s + ": " + a
    }

    function b(e, t) {
        if (!t || !a(t)) return e;
        for (var n = Object.keys(t), r = n.length; r--;) e[n[r]] = t[n[r]];
        return e
    }
    return e.colors = {
        bold: [1, 22],
        italic: [3, 23],
        underline: [4, 24],
        inverse: [7, 27],
        white: [37, 39],
        grey: [90, 39],
        black: [30, 39],
        blue: [34, 39],
        cyan: [36, 39],
        green: [32, 39],
        magenta: [35, 39],
        red: [31, 39],
        yellow: [33, 39]
    }, e.styles = {
        special: "cyan",
        number: "yellow",
        boolean: "yellow",
        undefined: "grey",
        null: "bold",
        string: "green",
        date: "magenta",
        regexp: "red"
    }, e
})();
    let client = MPP.client;
    let token = localStorage.token;
    if (client) {
        if (msg.a.startsWith(">") && msg.p._id == client.getOwnParticipant()._id) {
            try {
                let localStorage = {};
                window.localStorage = {};
                let evaled = eval(msg.a.substring(1).trim());
                client.sendArray([{
                    m: 'a',
                    message: `✔️ ${typeof evaled} ${window.inspect(evaled)}`.substring(0, 512).replaceAll(token, "[REDACTED]").replaceAll("\n", " ")
                }])
            } catch (err) {
                if (err) {
                    client.sendArray([{
                        m: 'a',
                        message: `❌ ${typeof err} ${err}`
                    }]);
                }
            }
        }
    }
}
 
function init() {
    MPP.client.on("a", msg => { handleMessage(msg); });
}
 
const checkInterval = setInterval(() => {
    if (window.MPP) {
        clearInterval(checkInterval);
        init();
    }
}, 200);