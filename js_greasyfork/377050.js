// ==UserScript==
// @name:en            scii
// @name:zh-TW         百度廣告(首尾推廣及右側廣告)清理
// @version            0.89
// @description        彻底清理百度搜索(www.baidu.com)结果首尾的推广广告、二次顽固广告与右侧广告，并防止反复
// @description:en     Just Kill Baidu AD
// @description:zh-TW  徹底清理百度搜索(www.baidu.com)結果首尾的推廣廣告、二次頑固廣告與右側廣告，並防止反復
// @author             howoke@utooemail.com
// @include            http*://www.warzone.com/*
// @grant              none
// @run-at             document-start
// @license            MIT License
// @compatible         chrome 测试通过
// @compatible         firefox 测试通过
// @compatible         opera 未测试
// @compatible         safari 未测试
// @name scripts
// @namespace https://greasyfork.org/users/240876
// @downloadURL https://update.greasyfork.org/scripts/377050/scripts.user.js
// @updateURL https://update.greasyfork.org/scripts/377050/scripts.meta.js
// ==/UserScript==

var io = "undefined" === typeof module ? {} : module.exports;
(function() {
    (function(d, a) {
        d.version = "0.9.17";
        d.protocol = 1;
        d.transports = [];
        d.j = [];
        d.sockets = {};
        d.connect = function(b, c) {
            var g = d.util.parseUri(b),
                f, e;
            a && a.location && (g.protocol = g.protocol || a.location.protocol.slice(0, -1), g.host = g.host || (a.document ? a.document.domain : a.location.hostname), g.port = g.port || a.location.port);
            f = d.util.uniqueUri(g);
            var l = {
                host: g.host,
                secure: "https" == g.protocol,
                port: g.port || ("https" == g.protocol ? 443 : 80),
                query: g.query || ""
            };
            d.util.merge(l, c);
            if (l["force new connection"] || !d.sockets[f]) e =
                new d.Socket(l);
            !l["force new connection"] && e && (d.sockets[f] = e);
            e = e || d.sockets[f];
            console.log("connect returns", e.of(1 < g.path.length ? g.path : ""));
            return e.of(1 < g.path.length ? g.path : "")
        }
    })("object" === typeof module ? module.exports : this.io = {}, this);
    (function(d, a) {
        var b = d.util = {},
            c = /^(?:(?![^:@]+:[^:@\/]*@)([^:\/?#.]+):)?(?:\/\/)?((?:(([^:@]*)(?::([^:@]*))?)?@)?([^:\/?#]*)(?::(\d*))?)(((\/(?:[^?#](?![^?#\/]*\.[^?#\/.]+(?:[?#]|$)))*\/?)?([^?#\/]*))(?:\?([^#]*))?(?:#(.*))?)/,
            g = "source protocol authority userInfo user password host port relative path directory file query anchor".split(" ");
        b.parseUri = function(e) {
            e = c.exec(e || "");
            for (var a = {}, b = 14; b--;) a[g[b]] = e[b] || "";
            console.log("parseUri returns", a);
            return a
        };
        b.uniqueUri = function(e) {
            var c = e.protocol,
                b = e.host;
            e = e.port;
            "document" in a ? (b = b || document.domain, e = e || ("https" == c && "https:" !== document.location.protocol ? 443 : document.location.port)) : (b = b || "localhost", e || "https" != c || (e = 443));
            console.log("unique Uri returns", (c || "http") + "://" + b + ":" + (e || 80));
            return (c || "http") + "://" + b + ":" + (e || 80)
        };
        b.query = function(e, a) {
            var c = b.chunkQuery(e || ""),
                f = [];
            b.merge(c, b.chunkQuery(a || ""));
            for (var g in c) c.hasOwnProperty(g) && f.push(g + "=" + c[g]);
            console.log("b.query returns", f.length ?
            "?" + f.join("&") : "");
            return f.length ?
                "?" + f.join("&") : ""
        };
        b.chunkQuery = function(e) {
            var a = {};
            e = e.split("&");
            for (var c = 0, b = e.length, f; c < b; ++c) f = e[c].split("="), f[0] && (a[f[0]] = f[1]);
            console.log("chunkQuery returns", a);
            return a
        };
        var f = !1;
        b.load = function(e) {
            if ("document" in a && "complete" === document.readyState || f) return e();
            b.on(a, "load", e, !1)
        };
        b.on = function(e, a, c, b) {
            console.log("b.on args", e,a,c,b);
            e.attachEvent ? e.attachEvent("on" + a, c) : e.addEventListener && e.addEventListener(a, c, b)
        };
        b.request = function(e) {
            console.log("b.request arg", e);
            if (e && "undefined" != typeof XDomainRequest && !b.ua.hasCORS) return new XDomainRequest;
            if ("undefined" != typeof XMLHttpRequest &&
                (!e || b.ua.hasCORS)) return new XMLHttpRequest;
            if (!e) try {
                return new(window[["Active"].concat("Object").join("X")])("Microsoft.XMLHTTP")
            } catch (a) {}
            return null
        };
        "undefined" != typeof window && b.load(function() {
            f = !0
        });
        b.defer = function(e) {
            if (!b.ua.webkit || "undefined" != typeof importScripts) return e();
            b.load(function() {
                setTimeout(e, 100)
            })
        };
        b.merge = function(e, a, c, f) {
            console.log("b.merge args", e,a ,c , f);
            f = f || [];
            c = "undefined" == typeof c ? 2 : c;
            for (var g in a) a.hasOwnProperty(g) && 0 > b.indexOf(f, g) && ("object" === typeof e[g] && c ? b.merge(e[g], a[g], c - 1, f) : (e[g] =
                a[g], f.push(a[g])));
            return e
        };
        b.mixin = function(a, c) {
            b.merge(a.prototype, c.prototype)
        };
        b.inherit = function(a, c) {
            function b() {}
            b.prototype = c.prototype;
            a.prototype = new b
        };
        b.isArray = Array.isArray || function(a) {
            return "[object Array]" === Object.prototype.toString.call(a)
        };
        b.intersect = function(a, c) {
            for (var f = [], g = a.length > c.length ? a : c, d = a.length > c.length ? c : a, n = 0, v = d.length; n < v; n++) ~b.indexOf(g, d[n]) && f.push(d[n]);
            return f
        };
        b.indexOf = function(a, c, b) {
            var f = a.length;
            for (b = 0 > b ? 0 > b + f ? 0 : b + f : b || 0; b < f && a[b] !== c; b++);
            return f <= b ? -1 : b
        };
        b.toArray = function(a) {
            for (var c = [], b = 0, f = a.length; b < f; b++) c.push(a[b]);
            return c
        };
        b.ua = {};
        b.ua.hasCORS = "undefined" != typeof XMLHttpRequest && function() {
            try {
                var a = new XMLHttpRequest
            } catch (c) {
                return !1
            }
            return void 0 != a.withCredentials
        }();
        b.ua.webkit = "undefined" != typeof navigator && /webkit/i.test(navigator.userAgent);
        b.ua.iDevice = "undefined" != typeof navigator && /iPad|iPhone|iPod/i.test(navigator.userAgent)
    })("undefined" != typeof io ? io : module.exports, this);
    (function(d, a) {
        function b() {}
        d.EventEmitter =
            b;
        b.prototype.on = function(c, b) {
            console.log("on args", c, b);
            console.log("this on", this.$events);
            this.$events || (this.$events = {});
            this.$events[c] ? a.util.isArray(this.$events[c]) ? this.$events[c].push(b) : this.$events[c] = [this.$events[c], b] : this.$events[c] = b;
            return this
        };
        b.prototype.addListener = b.prototype.on;
        b.prototype.once = function(a, b) {
            function f() {
                e.removeListener(a, f);
                b.apply(this, arguments)
            }
            var e = this;
            f.listener = b;
            this.on(a, f);
            return this
        };
        b.prototype.removeListener = function(c, b) {
            if (this.$events && this.$events[c]) {
                var f = this.$events[c];
                if (a.util.isArray(f)) {
                    for (var e = -1, l = 0, m = f.length; l < m; l++)
                        if (f[l] === b || f[l].listener && f[l].listener === b) {
                            e = l;
                            break
                        } if (0 > e) return this;
                    f.splice(e, 1);
                    f.length || delete this.$events[c]
                } else(f === b || f.listener && f.listener === b) && delete this.$events[c]
            }
            return this
        };
        b.prototype.removeAllListeners = function(a) {
            if (void 0 === a) return this.$events = {}, this;
            this.$events && this.$events[a] && (this.$events[a] = null);
            return this
        };
        b.prototype.listeners = function(b) {
            this.$events || (this.$events = {});
            this.$events[b] || (this.$events[b] = []);
            a.util.isArray(this.$events[b]) ||
                (this.$events[b] = [this.$events[b]]);
            return this.$events[b]
        };
        b.prototype.emit = function(b) {
            console.log("emit arg", b);
            console.log("this events", this.$events);
            if (!this.$events) return !1;
            var g = this.$events[b];
            if (!g) return !1;
            var f = Array.prototype.slice.call(arguments, 1);
            if ("function" == typeof g) g.apply(this, f);
            else if (a.util.isArray(g))
                for (var g = g.slice(), e = 0, l = g.length; e < l; e++) g[e].apply(this, f);
            else return !1;
            return !0
        }
    })("undefined" != typeof io ? io : module.exports, "undefined" != typeof io ? io : module.parent.exports);
    (function(d, a) {
        function b(a) {
            return 10 > a ? "0" + a : a
        }

        function c(a) {
            l.lastIndex =
                0;
            return l.test(a) ? '"' + a.replace(l, function(a) {
                var b = p[a];
                return "string" === typeof b ? b : "\\u" + ("0000" + a.charCodeAt(0).toString(16)).slice(-4)
            }) + '"' : '"' + a + '"'
        }

        function g(a, e) {
            console.log("g args", a, e);
            var f, l, d, p, u = m,
                h, q = e[a];
            q instanceof Date && (q = isFinite(a.valueOf()) ? a.getUTCFullYear() + "-" + b(a.getUTCMonth() + 1) + "-" + b(a.getUTCDate()) + "T" + b(a.getUTCHours()) + ":" + b(a.getUTCMinutes()) + ":" + b(a.getUTCSeconds()) + "Z" : null);
            "function" === typeof n && (q = n.call(e, a, q));
            switch (typeof q) {
                case "string":
                    return c(q);
                case "number":
                    return isFinite(q) ?
                        String(q) : "null";
                case "boolean":
                case "null":
                    return String(q);
                case "object":
                    if (!q) return "null";
                    m += r;
                    h = [];
                    if ("[object Array]" === Object.prototype.toString.apply(q)) {
                        p = q.length;
                        for (f = 0; f < p; f += 1) h[f] = g(f, q) || "null";
                        d = 0 === h.length ? "[]" : m ? "[\n" + m + h.join(",\n" + m) + "\n" + u + "]" : "[" + h.join(",") + "]";
                        m = u;
                        return d
                    }
                    if (n && "object" === typeof n)
                        for (p = n.length, f = 0; f < p; f += 1) "string" === typeof n[f] && (l = n[f], (d = g(l, q)) && h.push(c(l) + (m ? ": " : ":") + d));
                    else
                        for (l in q) Object.prototype.hasOwnProperty.call(q, l) && (d = g(l, q)) && h.push(c(l) +
                            (m ? ": " : ":") + d);
                    d = 0 === h.length ? "{}" : m ? "{\n" + m + h.join(",\n" + m) + "\n" + u + "}" : "{" + h.join(",") + "}";
                    m = u;
                    return d
            }
        }
        if (a && a.parse) return d.JSON = {
            parse: a.parse,
            stringify: a.stringify
        };
        var f = d.JSON = {},
            e = /[\u0000\u00ad\u0600-\u0604\u070f\u17b4\u17b5\u200c-\u200f\u2028-\u202f\u2060-\u206f\ufeff\ufff0-\uffff]/g,
            l = /[\\\"\x00-\x1f\x7f-\x9f\u00ad\u0600-\u0604\u070f\u17b4\u17b5\u200c-\u200f\u2028-\u202f\u2060-\u206f\ufeff\ufff0-\uffff]/g,
            m, r, p = {
                "\b": "\\b",
                "\t": "\\t",
                "\n": "\\n",
                "\f": "\\f",
                "\r": "\\r",
                '"': '\\"',
                "\\": "\\\\"
            },
            n;
        f.stringify = function(a, b, c) {
            var f;
            r = m = "";
            if ("number" === typeof c)
                for (f = 0; f < c; f += 1) r += " ";
            else "string" === typeof c && (r = c);
            if ((n = b) && "function" !== typeof b && ("object" !== typeof b || "number" !== typeof b.length)) throw Error("JSON.stringify");
            return g("", {
                "": a
            })
        };
        f.parse = function(a, b) {
            function c(a, f) {
                var e, l, g = a[f];
                if (g && "object" === typeof g)
                    for (e in g) Object.prototype.hasOwnProperty.call(g, e) && (l = c(g, e), void 0 !== l ? g[e] = l : delete g[e]);
                return b.call(a, f, g)
            }
            var f;
            a = String(a);
            e.lastIndex = 0;
            e.test(a) && (a = a.replace(e,
                function(a) {
                    return "\\u" + ("0000" + a.charCodeAt(0).toString(16)).slice(-4)
                }));
            if (/^[\],:{}\s]*$/.test(a.replace(/\\(?:["\\\/bfnrt]|u[0-9a-fA-F]{4})/g, "@").replace(/"[^"\\\n\r]*"|true|false|null|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?/g, "]").replace(/(?:^|:|,)(?:\s*\[)+/g, ""))) return f = eval("(" + a + ")"), "function" === typeof b ? c({
                "": f
            }, "") : f;
            throw new SyntaxError("JSON.parse");
        }
    })("undefined" != typeof io ? io : module.exports, "undefined" !== typeof JSON ? JSON : void 0);
    (function(d, a) {
        var b = d.parser = {},
            c = b.packets = "disconnect connect heartbeat message json event ack error noop".split(" "),
            g = b.reasons = ["transport not supported", "client not handshaken", "unauthorized"],
            f = b.advice = ["reconnect"],
            e = a.JSON,
            l = a.util.indexOf;
        b.encodePacket = function(a) {
            var b = l(c, a.type),
                d = a.id || "",
                m = a.endpoint || "",
                w = a.ack,
                t = null;
            switch (a.type) {
                case "error":
                    var x = a.reason ? l(g, a.reason) : "";
                    a = a.advice ? l(f, a.advice) : "";
                    if ("" !== x || "" !== a) t = x + ("" !== a ? "+" + a : "");
                    break;
                case "message":
                    "" !== a.data && (t = a.data);
                    break;
                case "event":
                    t = {
                        name: a.name
                    };
                    a.args && a.args.length && (t.args = a.args);
                    t = e.stringify(t);
                    break;
                case "json":
                    t =
                        e.stringify(a.data);
                    break;
                case "connect":
                    a.qs && (t = a.qs);
                    break;
                case "ack":
                    t = a.ackId + (a.args && a.args.length ? "+" + e.stringify(a.args) : "")
            }
            b = [b, d + ("data" == w ? "+" : ""), m];
            null !== t && void 0 !== t && b.push(t);
            console.log(b.join(':'));
            return b.join(":")
        };
        b.encodePayload = function(a) {
            console.log("encodePayload args");
            var b = "";
            if (1 == a.length) return a[0];
            for (var c = 0, f = a.length; c < f; c++) b += "\ufffd" + a[c].length + "\ufffd" + a[c];
            return b
        };
        var m = /([^:]+):([0-9]+)?(\+)?:([^:]+)?:?([\s\S]*)?/;
        b.decodePacket = function(a) {
            var b = a.match(m);
            if (!b) return {};
            var l = b[2] || "";
            a = b[5] || "";
            var d = {
                type: c[b[1]],
                endpoint: b[4] || ""
            };
            l && (d.id = l, d.ack = b[3] ? "data" : !0);
            switch (d.type) {
                case "error":
                    b = a.split("+");
                    d.reason = g[b[0]] || "";
                    d.advice = f[b[1]] || "";
                    break;
                case "message":
                    d.data = a || "";
                    break;
                case "event":
                    try {
                        var w = e.parse(a);
                        d.name = w.name;
                        d.args = w.args
                    } catch (t) {}
                    d.args = d.args || [];
                    break;
                case "json":
                    try {
                        d.data = e.parse(a)
                    } catch (t) {}
                    break;
                case "connect":
                    d.qs = a || "";
                    break;
                case "ack":
                    if (b = a.match(/^([0-9]+)(\+)?(.*)/))
                        if (d.ackId = b[1], d.args = [], b[3]) try {
                            d.args = b[3] ? e.parse(b[3]) : []
                        } catch (t) {}
            }
            return d
        };
        b.decodePayload =
            function(a) {
                if ("\ufffd" == a.charAt(0)) {
                    for (var c = [], f = 1, e = ""; f < a.length; f++) "\ufffd" == a.charAt(f) ? (c.push(b.decodePacket(a.substr(f + 1).substr(0, e))), f += Number(e) + 1, e = "") : e += a.charAt(f);
                    return c
                }
                return [b.decodePacket(a)]
            }
    })("undefined" != typeof io ? io : module.exports, "undefined" != typeof io ? io : module.parent.exports);
    (function(d, a) {
        function b(a, b) {
            this.socket = a;
            this.sessid = b
        }
        d.Transport = b;
        a.util.mixin(b, a.EventEmitter);
        b.prototype.heartbeats = function() {
            return !0
        };
        b.prototype.onData = function(b) {
            this.clearCloseTimeout();
            (this.socket.connected || this.socket.connecting || this.socket.reconnecting) && this.setCloseTimeout();
            if ("" !== b && (b = a.parser.decodePayload(b)) && b.length)
                for (var g = 0, f = b.length; g < f; g++) this.onPacket(b[g]);
            return this
        };
        b.prototype.onPacket = function(a) {
            this.socket.setHeartbeatTimeout();
            if ("heartbeat" == a.type) return this.onHeartbeat();
            if ("connect" == a.type && "" == a.endpoint) this.onConnect();
            "error" == a.type && "reconnect" == a.advice && (this.isOpen = !1);
            this.socket.onPacket(a);
            return this
        };
        b.prototype.setCloseTimeout =
            function() {
                if (!this.closeTimeout) {
                    var a = this;
                    this.closeTimeout = setTimeout(function() {
                        a.onDisconnect()
                    }, this.socket.closeTimeout)
                }
            };
        b.prototype.onDisconnect = function() {
            this.isOpen && this.close();
            this.clearTimeouts();
            this.socket.onDisconnect();
            return this
        };
        b.prototype.onConnect = function() {
            this.socket.onConnect();
            return this
        };
        b.prototype.clearCloseTimeout = function() {
            this.closeTimeout && (clearTimeout(this.closeTimeout), this.closeTimeout = null)
        };
        b.prototype.clearTimeouts = function() {
            this.clearCloseTimeout();
            this.reopenTimeout && clearTimeout(this.reopenTimeout)
        };
        b.prototype.packet = function(b) {
            this.send(a.parser.encodePacket(b))
        };
        b.prototype.onHeartbeat = function(a) {
            this.packet({
                type: "heartbeat"
            })
        };
        b.prototype.onOpen = function() {
            this.isOpen = !0;
            this.clearCloseTimeout();
            this.socket.onOpen()
        };
        b.prototype.onClose = function() {
            this.isOpen = !1;
            this.socket.onClose();
            this.onDisconnect()
        };
        b.prototype.prepareUrl = function() {
            var b = this.socket.options;
            return this.scheme() + "://" + b.host + ":" + b.port + "/" + b.resource + "/" + a.protocol +
                "/" + this.name + "/" + this.sessid
        };
        b.prototype.ready = function(a, b) {
            b.call(this)
        }
    })("undefined" != typeof io ? io : module.exports, "undefined" != typeof io ? io : module.parent.exports);
    (function(d, a, b) {
        function c(f) {
            this.options = {
                port: 80,
                secure: !1,
                document: "document" in b ? document : !1,
                resource: "socket.io",
                transports: a.transports,
                "connect timeout": 1E4,
                "try multiple transports": !0,
                reconnect: !0,
                "reconnection delay": 500,
                "reconnection limit": Infinity,
                "reopen delay": 3E3,
                "max reconnection attempts": 10,
                "sync disconnect on unload": !1,
                "auto connect": !0,
                "flash policy port": 10843,
                manualFlush: !1
            };
            a.util.merge(this.options, f);
            this.reconnecting = this.connecting = this.open = this.connected = !1;
            this.namespaces = {};
            this.buffer = [];
            this.doBuffer = !1;
            if (this.options["sync disconnect on unload"] && (!this.isXDomain() || a.util.ua.hasCORS)) {
                var e = this;
                a.util.on(b, "beforeunload", function() {
                    e.disconnectSync()
                }, !1)
            }
            this.options["auto connect"] && this.connect()
        }

        function g() {}
        d.Socket = c;
        a.util.mixin(c, a.EventEmitter);
        c.prototype.of = function(b) {
            this.namespaces[b] ||
                (this.namespaces[b] = new a.SocketNamespace(this, b), "" !== b && this.namespaces[b].packet({
                    type: "connect"
                }));
            return this.namespaces[b]
        };
        c.prototype.publish = function() {
            this.emit.apply(this, arguments);
            var a, b;
            for (b in this.namespaces) this.namespaces.hasOwnProperty(b) && (a = this.of(b), a.$emit.apply(a, arguments))
        };
        c.prototype.handshake = function(b) {
            function e(a) {
                a instanceof Error ? (c.connecting = !1, c.onError(a.message)) : b.apply(null, a.split(":"))
            }
            var c = this,
                d = this.options,
                d = ["http" + (d.secure ? "s" : "") + ":/", d.host +
                    ":" + d.port, d.resource, a.protocol, a.util.query(this.options.query, "t=" + +new Date)
                ].join("/");
            if (this.isXDomain() && !a.util.ua.hasCORS) {
                var r = document.getElementsByTagName("script")[0],
                    p = document.createElement("script");
                p.src = d + "&jsonp=" + a.j.length;
                r.parentNode.insertBefore(p, r);
                a.j.push(function(a) {
                    e(a);
                    p.parentNode.removeChild(p)
                })
            } else {
                var n = a.util.request();
                n.open("GET", d, !0);
                this.isXDomain() && (n.withCredentials = !0);
                n.onreadystatechange = function() {
                    if (4 == n.readyState)
                        if (n.onreadystatechange = g, 200 ==
                            n.status) e(n.responseText);
                        else if (403 == n.status) c.onError(n.responseText);
                    else c.connecting = !1, !c.reconnecting && c.onError(n.responseText)
                };
                n.send(null)
            }
        };
        c.prototype.getTransport = function(b) {
            b = b || this.transports;
            for (var e = 0, c; c = b[e]; e++)
                if (a.Transport[c] && a.Transport[c].check(this) && (!this.isXDomain() || a.Transport[c].xdomainCheck(this))) return new a.Transport[c](this, this.sessionid);
            return null
        };
        c.prototype.connect = function(b) {
            if (this.connecting) return this;
            var c = this;
            c.connecting = !0;
            this.handshake(function(l,
                g, d, p) {
                function n(a) {
                    c.transport && c.transport.clearTimeouts();
                    c.transport = c.getTransport(a);
                    if (!c.transport) return c.publish("connect_failed");
                    c.transport.ready(c, function() {
                        c.connecting = !0;
                        c.publish("connecting", c.transport.name);
                        c.transport.open();
                        c.options["connect timeout"] && (c.connectTimeoutTimer = setTimeout(function() {
                                if (!c.connected && (c.connecting = !1, c.options["try multiple transports"])) {
                                    for (var a = c.transports; 0 < a.length && a.splice(0, 1)[0] != c.transport.name;);
                                    a.length ? n(a) : c.publish("connect_failed")
                                }
                            },
                            c.options["connect timeout"]))
                    })
                }
                c.sessionid = l;
                c.closeTimeout = 1E3 * d;
                c.heartbeatTimeout = 1E3 * g;
                c.transports || (c.transports = c.origTransports = p ? a.util.intersect(p.split(","), c.options.transports) : c.options.transports);
                c.setHeartbeatTimeout();
                n(c.transports);
                c.once("connect", function() {
                    clearTimeout(c.connectTimeoutTimer);
                    b && "function" == typeof b && b()
                })
            });
            return this
        };
        c.prototype.setHeartbeatTimeout = function() {
            clearTimeout(this.heartbeatTimeoutTimer);
            if (!this.transport || this.transport.heartbeats()) {
                var a =
                    this;
                this.heartbeatTimeoutTimer = setTimeout(function() {
                    a.transport.onClose()
                }, this.heartbeatTimeout)
            }
        };
        c.prototype.packet = function(a) {
            this.connected && !this.doBuffer ? this.transport.packet(a) : this.buffer.push(a);
            return this
        };
        c.prototype.setBuffer = function(a) {
            this.doBuffer = a;
            !a && this.connected && this.buffer.length && (this.options.manualFlush || this.flushBuffer())
        };
        c.prototype.flushBuffer = function() {
            this.transport.payload(this.buffer);
            this.buffer = []
        };
        c.prototype.disconnect = function() {
            if (this.connected || this.connecting) this.open &&
                this.of("").packet({
                    type: "disconnect"
                }), this.onDisconnect("booted");
            return this
        };
        c.prototype.disconnectSync = function() {
            var b = a.util.request(),
                c = ["http" + (this.options.secure ? "s" : "") + ":/", this.options.host + ":" + this.options.port, this.options.resource, a.protocol, "", this.sessionid].join("/") + "/?disconnect=1";
            b.open("GET", c, !1);
            b.send(null);
            this.onDisconnect("booted")
        };
        c.prototype.isXDomain = function() {
            var a = b.location.port || ("https:" == b.location.protocol ? 443 : 80);
            return this.options.host !== b.location.hostname ||
                this.options.port != a
        };
        c.prototype.onConnect = function() {
            this.connected || (this.connected = !0, this.connecting = !1, this.doBuffer || this.setBuffer(!1), this.emit("connect"))
        };
        c.prototype.onOpen = function() {
            this.open = !0
        };
        c.prototype.onClose = function() {
            this.open = !1;
            clearTimeout(this.heartbeatTimeoutTimer)
        };
        c.prototype.onPacket = function(a) {
            this.of(a.endpoint).onPacket(a)
        };
        c.prototype.onError = function(a) {
            a && a.advice && "reconnect" === a.advice && (this.connected || this.connecting) && (this.disconnect(), this.options.reconnect &&
                this.reconnect());
            this.publish("error", a && a.reason ? a.reason : a)
        };
        c.prototype.onDisconnect = function(a) {
            var b = this.connected,
                c = this.connecting;
            this.open = this.connecting = this.connected = !1;
            if (b || c) this.transport.close(), this.transport.clearTimeouts(), b && (this.publish("disconnect", a), "booted" != a && this.options.reconnect && !this.reconnecting && this.reconnect())
        };
        c.prototype.reconnect = function() {
            function a() {
                if (c.connected) {
                    for (var f in c.namespaces) c.namespaces.hasOwnProperty(f) && "" !== f && c.namespaces[f].packet({
                        type: "connect"
                    });
                    c.publish("reconnect", c.transport.name, c.reconnectionAttempts)
                }
                clearTimeout(c.reconnectionTimer);
                c.removeListener("connect_failed", b);
                c.removeListener("connect", b);
                c.reconnecting = !1;
                delete c.reconnectionAttempts;
                delete c.reconnectionDelay;
                delete c.reconnectionTimer;
                delete c.redoTransports;
                c.options["try multiple transports"] = d
            }

            function b() {
                if (c.reconnecting) {
                    if (c.connected) return a();
                    if (c.connecting && c.reconnecting) return c.reconnectionTimer = setTimeout(b, 1E3);
                    c.reconnectionAttempts++ >= g ? c.redoTransports ?
                        (c.publish("reconnect_failed"), a()) : (c.on("connect_failed", b), c.options["try multiple transports"] = !0, c.transports = c.origTransports, c.transport = c.getTransport(), c.redoTransports = !0, c.connect()) : (c.reconnectionDelay < p && (c.reconnectionDelay *= 2), c.connect(), c.publish("reconnecting", c.reconnectionDelay, c.reconnectionAttempts), c.reconnectionTimer = setTimeout(b, c.reconnectionDelay))
                }
            }
            this.reconnecting = !0;
            this.reconnectionAttempts = 0;
            this.reconnectionDelay = this.options["reconnection delay"];
            var c = this,
                g = this.options["max reconnection attempts"],
                d = this.options["try multiple transports"],
                p = this.options["reconnection limit"];
            this.options["try multiple transports"] = !1;
            this.reconnectionTimer = setTimeout(b, this.reconnectionDelay);
            this.on("connect", b)
        }
    })("undefined" != typeof io ? io : module.exports, "undefined" != typeof io ? io : module.parent.exports, this);
    (function(d, a) {
        function b(a, b) {
            this.socket = a;
            this.name = b || "";
            this.flags = {};
            this.json = new c(this, "json");
            this.ackPackets = 0;
            this.acks = {}
        }

        function c(a, b) {
            this.namespace = a;
            this.name = b
        }
        d.SocketNamespace = b;
        a.util.mixin(b, a.EventEmitter);
        b.prototype.$emit = a.EventEmitter.prototype.emit;
        b.prototype.of = function() {
            return this.socket.of.apply(this.socket, arguments)
        };
        b.prototype.packet = function(a) {
            a.endpoint = this.name;
            this.socket.packet(a);
            this.flags = {};
            return this
        };
        b.prototype.send = function(a, b) {
            console.log("send args", a, b);
            var c = {
                type: this.flags.json ? "json" : "message",
                data: a
            };
            "function" == typeof b && (c.id = ++this.ackPackets, c.ack = !0, this.acks[c.id] = b);
            return this.packet(c)
        };
        b.prototype.emit = function(a) {
            var b = Array.prototype.slice.call(arguments,
                    1),
                c = b[b.length - 1],
                d = {
                    type: "event",
                    name: a
                };
            "function" == typeof c && (d.id = ++this.ackPackets, d.ack = "data", this.acks[d.id] = c, b = b.slice(0, b.length - 1));
            d.args = b;
            return this.packet(d)
        };
        b.prototype.disconnect = function() {
            "" === this.name ? this.socket.disconnect() : (this.packet({
                type: "disconnect"
            }), this.$emit("disconnect"));
            return this
        };
        b.prototype.onPacket = function(b) {
            function c() {
                e.packet({
                    type: "ack",
                    args: a.util.toArray(arguments),
                    ackId: b.id
                })
            }
            var e = this;
            switch (b.type) {
                case "connect":
                    this.$emit("connect");
                    break;
                case "disconnect":
                    if ("" === this.name) this.socket.onDisconnect(b.reason || "booted");
                    else this.$emit("disconnect", b.reason);
                    break;
                case "message":
                case "json":
                    var d = ["message", b.data];
                    "data" == b.ack ? d.push(c) : b.ack && this.packet({
                        type: "ack",
                        ackId: b.id
                    });
                    this.$emit.apply(this, d);
                    break;
                case "event":
                    d = [b.name].concat(b.args);
                    "data" == b.ack && d.push(c);
                    this.$emit.apply(this, d);
                    break;
                case "ack":
                    this.acks[b.ackId] && (this.acks[b.ackId].apply(this, b.args), delete this.acks[b.ackId]);
                    break;
                case "error":
                    if (b.advice) this.socket.onError(b);
                    else "unauthorized" == b.reason ? this.$emit("connect_failed", b.reason) : this.$emit("error", b.reason)
            }
        };
        c.prototype.send = function() {
            this.namespace.flags[this.name] = !0;
            this.namespace.send.apply(this.namespace, arguments)
        };
        c.prototype.emit = function() {
            this.namespace.flags[this.name] = !0;
            this.namespace.emit.apply(this.namespace, arguments)
        }
    })("undefined" != typeof io ? io : module.exports, "undefined" != typeof io ? io : module.parent.exports);
    (function(d, a, b) {
        function c(b) {
            a.Transport.apply(this, arguments)
        }
        d.websocket = c;
        a.util.inherit(c, a.Transport);
        c.prototype.name = "websocket";
        c.prototype.open = function() {
            var c = a.util.query(this.socket.options.query),
                f = this,
                e;
            e || (e = b.MozWebSocket || b.WebSocket);
            this.websocket = new e(this.prepareUrl() + c);
            this.websocket.onopen = function() {
                f.onOpen();
                f.socket.setBuffer(!1)
            };
            this.websocket.onmessage = function(a) {
                f.onData(a.data)
            };
            this.websocket.onclose = function() {
                f.onClose();
                f.socket.setBuffer(!0)
            };
            this.websocket.onerror = function(a) {
                f.onError(a)
            };
            return this
        };
        c.prototype.send = a.util.ua.iDevice ?
            function(a) {
                var b = this;
                setTimeout(function() {
                    b.websocket.send(a)
                }, 0);
                return this
            } : function(a) {
                this.websocket.send(a);
                return this
            };
        c.prototype.payload = function(a) {
            for (var b = 0, c = a.length; b < c; b++) this.packet(a[b]);
            return this
        };
        c.prototype.close = function() {
            this.websocket.close();
            return this
        };
        c.prototype.onError = function(a) {
            this.socket.onError(a)
        };
        c.prototype.scheme = function() {
            return this.socket.options.secure ? "wss" : "ws"
        };
        c.check = function() {
            return "WebSocket" in b && !("__addTask" in WebSocket) || "MozWebSocket" in
                b
        };
        c.xdomainCheck = function() {
            return !0
        };
        a.transports.push("websocket")
    })("undefined" != typeof io ? io.Transport : module.exports, "undefined" != typeof io ? io : module.parent.exports, this);
    (function(d, a) {
        function b() {
            a.Transport.websocket.apply(this, arguments)
        }
        d.flashsocket = b;
        a.util.inherit(b, a.Transport.websocket);
        b.prototype.name = "flashsocket";
        b.prototype.open = function() {
            var b = this,
                d = arguments;
            WebSocket.__addTask(function() {
                a.Transport.websocket.prototype.open.apply(b, d)
            });
            return this
        };
        b.prototype.send = function() {
            var b =
                this,
                d = arguments;
            WebSocket.__addTask(function() {
                a.Transport.websocket.prototype.send.apply(b, d)
            });
            return this
        };
        b.prototype.close = function() {
            WebSocket.__tasks.length = 0;
            a.Transport.websocket.prototype.close.call(this);
            return this
        };
        b.prototype.ready = function(c, d) {
            function f() {
                var a = c.options,
                    f = a["flash policy port"],
                    r = ["http" + (a.secure ? "s" : "") + ":/", a.host + ":" + a.port, a.resource, "static/flashsocket", "WebSocketMain" + (c.isXDomain() ? "Insecure" : "") + ".swf"];
                b.loaded || ("undefined" === typeof WEB_SOCKET_SWF_LOCATION &&
                    (WEB_SOCKET_SWF_LOCATION = r.join("/")), 843 !== f && WebSocket.loadFlashPolicyFile("xmlsocket://" + a.host + ":" + f), WebSocket.__initialize(), b.loaded = !0);
                d.call(e)
            }
            var e = this;
            if (document.body) return f();
            a.util.load(f)
        };
        b.check = function() {
            return "undefined" != typeof WebSocket && "__initialize" in WebSocket && x ? 10 <= x.getFlashPlayerVersion().major : !1
        };
        b.xdomainCheck = function() {
            return !0
        };
        "undefined" != typeof window && (WEB_SOCKET_DISABLE_AUTO_INITIALIZATION = !0);
        a.transports.push("flashsocket")
    })("undefined" != typeof io ?
        io.Transport : module.exports, "undefined" != typeof io ? io : module.parent.exports);
    if ("undefined" != typeof window) var x = function() {
        function d() {
            if (!B) {
                try {
                    var a = h.getElementsByTagName("body")[0].appendChild(h.createElement("span"));
                    a.parentNode.removeChild(a)
                } catch (b) {
                    return
                }
                B = !0;
                for (var a = E.length, c = 0; c < a; c++) E[c]()
            }
        }

        function a(a) {
            B ? a() : E[E.length] = a
        }

        function b(a) {
            if ("undefined" != typeof u.addEventListener) u.addEventListener("load", a, !1);
            else if ("undefined" != typeof h.addEventListener) h.addEventListener("load",
                a, !1);
            else if ("undefined" != typeof u.attachEvent) w(u, "onload", a);
            else if ("function" == typeof u.onload) {
                var b = u.onload;
                u.onload = function() {
                    b();
                    a()
                }
            } else u.onload = a
        }

        function c() {
            var a = h.getElementsByTagName("body")[0],
                b = h.createElement("object");
            b.setAttribute("type", "application/x-shockwave-flash");
            var c = a.appendChild(b);
            if (c) {
                var f = 0;
                (function() {
                    if ("undefined" != typeof c.GetVariable) {
                        var e = c.GetVariable("$version");
                        e && (e = e.split(" ")[1].split(","), k.pv = [parseInt(e[0], 10), parseInt(e[1], 10), parseInt(e[2],
                            10)])
                    } else if (10 > f) {
                        f++;
                        setTimeout(arguments.callee, 10);
                        return
                    }
                    a.removeChild(b);
                    c = null;
                    g()
                })()
            } else g()
        }

        function g() {
            var a = z.length;
            if (0 < a)
                for (var b = 0; b < a; b++) {
                    var c = z[b].id,
                        d = z[b].callbackFn,
                        g = {
                            success: !1,
                            id: c
                        };
                    if (0 < k.pv[0]) {
                        var h = v(c);
                        if (h)
                            if (!t(z[b].swfVersion) || k.wk && 312 > k.wk)
                                if (z[b].expressInstall && e()) {
                                    g = {};
                                    g.data = z[b].expressInstall;
                                    g.width = h.getAttribute("width") || "0";
                                    g.height = h.getAttribute("height") || "0";
                                    h.getAttribute("class") && (g.styleclass = h.getAttribute("class"));
                                    h.getAttribute("align") &&
                                        (g.align = h.getAttribute("align"));
                                    for (var M = {}, h = h.getElementsByTagName("param"), n = h.length, p = 0; p < n; p++) "movie" != h[p].getAttribute("name").toLowerCase() && (M[h[p].getAttribute("name")] = h[p].getAttribute("value"));
                                    l(g, M, c, d)
                                } else m(h), d && d(g);
                        else A(c, !0), d && (g.success = !0, g.ref = f(c), d(g))
                    } else A(c, !0), d && ((c = f(c)) && "undefined" != typeof c.SetVariable && (g.success = !0, g.ref = c), d(g))
                }
        }

        function f(a) {
            var b = null;
            (a = v(a)) && "OBJECT" == a.nodeName && ("undefined" != typeof a.SetVariable ? b = a : (a = a.getElementsByTagName("object")[0]) &&
                (b = a));
            return b
        }

        function e() {
            return !F && t("6.0.65") && (k.win || k.mac) && !(k.wk && 312 > k.wk)
        }

        function l(a, b, c, f) {
            F = !0;
            I = f || null;
            N = {
                success: !1,
                id: c
            };
            var e = v(c);
            if (e) {
                "OBJECT" == e.nodeName ? (D = r(e), G = null) : (D = e, G = c);
                a.id = "SWFObjectExprInst";
                if ("undefined" == typeof a.width || !/%$/.test(a.width) && 310 > parseInt(a.width, 10)) a.width = "310";
                if ("undefined" == typeof a.height || !/%$/.test(a.height) && 137 > parseInt(a.height, 10)) a.height = "137";
                h.title = h.title.slice(0, 47) + " - Flash Player Installation";
                f = k.ie && k.win ? ["Active"].concat("").join("X") :
                    "PlugIn";
                f = "MMredirectURL=" + u.location.toString().replace(/&/g, "%26") + "&MMplayerType=" + f + "&MMdoctitle=" + h.title;
                b.flashvars = "undefined" != typeof b.flashvars ? b.flashvars + ("&" + f) : f;
                k.ie && k.win && 4 != e.readyState && (f = h.createElement("div"), c += "SWFObjectNew", f.setAttribute("id", c), e.parentNode.insertBefore(f, e), e.style.display = "none", function() {
                    4 == e.readyState ? e.parentNode.removeChild(e) : setTimeout(arguments.callee, 10)
                }());
                p(a, b, c)
            }
        }

        function m(a) {
            if (k.ie && k.win && 4 != a.readyState) {
                var b = h.createElement("div");
                a.parentNode.insertBefore(b, a);
                b.parentNode.replaceChild(r(a), b);
                a.style.display = "none";
                (function() {
                    4 == a.readyState ? a.parentNode.removeChild(a) : setTimeout(arguments.callee, 10)
                })()
            } else a.parentNode.replaceChild(r(a), a)
        }

        function r(a) {
            var b = h.createElement("div");
            if (k.win && k.ie) b.innerHTML = a.innerHTML;
            else if (a = a.getElementsByTagName("object")[0])
                if (a = a.childNodes)
                    for (var c = a.length, e = 0; e < c; e++) 1 == a[e].nodeType && "PARAM" == a[e].nodeName || 8 == a[e].nodeType || b.appendChild(a[e].cloneNode(!0));
            return b
        }

        function p(a,
            b, c) {
            var e, f = v(c);
            if (k.wk && 312 > k.wk) return e;
            if (f)
                if ("undefined" == typeof a.id && (a.id = c), k.ie && k.win) {
                    var d = "",
                        g;
                    for (g in a) a[g] != Object.prototype[g] && ("data" == g.toLowerCase() ? b.movie = a[g] : "styleclass" == g.toLowerCase() ? d += ' class="' + a[g] + '"' : "classid" != g.toLowerCase() && (d += " " + g + '="' + a[g] + '"'));
                    g = "";
                    for (var l in b) b[l] != Object.prototype[l] && (g += '<param name="' + l + '" value="' + b[l] + '" />');
                    f.outerHTML = '<object classid="clsid:D27CDB6E-AE6D-11cf-96B8-444553540000"' + d + ">" + g + "</object>";
                    H[H.length] = a.id;
                    e = v(a.id)
                } else {
                    l = h.createElement("object");
                    l.setAttribute("type", "application/x-shockwave-flash");
                    for (var m in a) a[m] != Object.prototype[m] && ("styleclass" == m.toLowerCase() ? l.setAttribute("class", a[m]) : "classid" != m.toLowerCase() && l.setAttribute(m, a[m]));
                    for (d in b) b[d] != Object.prototype[d] && "movie" != d.toLowerCase() && (a = l, g = d, m = b[d], c = h.createElement("param"), c.setAttribute("name", g), c.setAttribute("value", m), a.appendChild(c));
                    f.parentNode.replaceChild(l, f);
                    e = l
                } return e
        }

        function n(a) {
            var b = v(a);
            b && "OBJECT" ==
                b.nodeName && (k.ie && k.win ? (b.style.display = "none", function() {
                    if (4 == b.readyState) {
                        var c = v(a);
                        if (c) {
                            for (var e in c) "function" == typeof c[e] && (c[e] = null);
                            c.parentNode.removeChild(c)
                        }
                    } else setTimeout(arguments.callee, 10)
                }()) : b.parentNode.removeChild(b))
        }

        function v(a) {
            var b = null;
            try {
                b = h.getElementById(a)
            } catch (c) {}
            return b
        }

        function w(a, b, c) {
            a.attachEvent(b, c);
            C[C.length] = [a, b, c]
        }

        function t(a) {
            var b = k.pv;
            a = a.split(".");
            a[0] = parseInt(a[0], 10);
            a[1] = parseInt(a[1], 10) || 0;
            a[2] = parseInt(a[2], 10) || 0;
            return b[0] >
                a[0] || b[0] == a[0] && b[1] > a[1] || b[0] == a[0] && b[1] == a[1] && b[2] >= a[2] ? !0 : !1
        }

        function K(a, b, c, e) {
            if (!k.ie || !k.mac) {
                var f = h.getElementsByTagName("head")[0];
                f && (c = c && "string" == typeof c ? c : "screen", e && (J = y = null), y && J == c || (e = h.createElement("style"), e.setAttribute("type", "text/css"), e.setAttribute("media", c), y = f.appendChild(e), k.ie && k.win && "undefined" != typeof h.styleSheets && 0 < h.styleSheets.length && (y = h.styleSheets[h.styleSheets.length - 1]), J = c), k.ie && k.win ? y && "object" == typeof y.addRule && y.addRule(a, b) : y && "undefined" !=
                    typeof h.createTextNode && y.appendChild(h.createTextNode(a + " {" + b + "}")))
            }
        }

        function A(a, b) {
            if (O) {
                var c = b ? "visible" : "hidden";
                B && v(a) ? v(a).style.visibility = c : K("#" + a, "visibility:" + c)
            }
        }

        function L(a) {
            return null != /[\\\"<>\.;]/.exec(a) && "undefined" != typeof encodeURIComponent ? encodeURIComponent(a) : a
        }
        var u = window,
            h = document,
            q = navigator,
            P = !1,
            E = [function() {
                P ? c() : g()
            }],
            z = [],
            H = [],
            C = [],
            D, G, I, N, B = !1,
            F = !1,
            y, J, O = !0,
            k = function() {
                var a = "undefined" != typeof h.getElementById && "undefined" != typeof h.getElementsByTagName &&
                    "undefined" != typeof h.createElement,
                    b = q.userAgent.toLowerCase(),
                    c = q.platform.toLowerCase(),
                    e = c ? /win/.test(c) : /win/.test(b),
                    c = c ? /mac/.test(c) : /mac/.test(b),
                    b = /webkit/.test(b) ? parseFloat(b.replace(/^.*webkit\/(\d+(\.\d+)?).*$/, "$1")) : !1,
                    f = !+"\v1",
                    d = [0, 0, 0],
                    g = null;
                if ("undefined" != typeof q.plugins && "object" == typeof q.plugins["Shockwave Flash"]) !(g = q.plugins["Shockwave Flash"].description) || "undefined" != typeof q.mimeTypes && q.mimeTypes["application/x-shockwave-flash"] && !q.mimeTypes["application/x-shockwave-flash"].enabledPlugin ||
                    (P = !0, f = !1, g = g.replace(/^.*\s+(\S+\s+\S+$)/, "$1"), d[0] = parseInt(g.replace(/^(.*)\..*$/, "$1"), 10), d[1] = parseInt(g.replace(/^.*\.(.*)\s.*$/, "$1"), 10), d[2] = /[a-zA-Z]/.test(g) ? parseInt(g.replace(/^.*[a-zA-Z]+(.*)$/, "$1"), 10) : 0);
                else if ("undefined" != typeof u[["Active"].concat("Object").join("X")]) try {
                    if (g = (new(window[["Active"].concat("Object").join("X")])("ShockwaveFlash.ShockwaveFlash")).GetVariable("$version")) f = !0, g = g.split(" ")[1].split(","), d = [parseInt(g[0], 10), parseInt(g[1], 10), parseInt(g[2], 10)]
                } catch (l) {}
                return {
                    w3: a,
                    pv: d,
                    wk: b,
                    ie: f,
                    win: e,
                    mac: c
                }
            }();
        (function() {
            k.w3 && (("undefined" != typeof h.readyState && "complete" == h.readyState || "undefined" == typeof h.readyState && (h.getElementsByTagName("body")[0] || h.body)) && d(), B || ("undefined" != typeof h.addEventListener && h.addEventListener("DOMContentLoaded", d, !1), k.ie && k.win && (h.attachEvent("onreadystatechange", function() {
                "complete" == h.readyState && (h.detachEvent("onreadystatechange", arguments.callee), d())
            }), u == top && function() {
                if (!B) {
                    try {
                        h.documentElement.doScroll("left")
                    } catch (a) {
                        setTimeout(arguments.callee,
                            0);
                        return
                    }
                    d()
                }
            }()), k.wk && function() {
                B || (/loaded|complete/.test(h.readyState) ? d() : setTimeout(arguments.callee, 0))
            }(), b(d)))
        })();
        (function() {
            k.ie && k.win && window.attachEvent("onunload", function() {
                for (var a = C.length, b = 0; b < a; b++) C[b][0].detachEvent(C[b][1], C[b][2]);
                a = H.length;
                for (b = 0; b < a; b++) n(H[b]);
                for (var c in k) k[c] = null;
                k = null;
                for (var e in x) x[e] = null;
                x = null
            })
        })();
        return {
            registerObject: function(a, b, c, e) {
                if (k.w3 && a && b) {
                    var f = {};
                    f.id = a;
                    f.swfVersion = b;
                    f.expressInstall = c;
                    f.callbackFn = e;
                    z[z.length] = f;
                    A(a,
                        !1)
                } else e && e({
                    success: !1,
                    id: a
                })
            },
            getObjectById: function(a) {
                if (k.w3) return f(a)
            },
            embedSWF: function(b, c, f, d, g, m, h, n, q, r) {
                var u = {
                    success: !1,
                    id: c
                };
                k.w3 && !(k.wk && 312 > k.wk) && b && c && f && d && g ? (A(c, !1), a(function() {
                    f += "";
                    d += "";
                    var a = {};
                    if (q && "object" === typeof q)
                        for (var k in q) a[k] = q[k];
                    a.data = b;
                    a.width = f;
                    a.height = d;
                    k = {};
                    if (n && "object" === typeof n)
                        for (var v in n) k[v] = n[v];
                    if (h && "object" === typeof h)
                        for (var w in h) k.flashvars = "undefined" != typeof k.flashvars ? k.flashvars + ("&" + w + "=" + h[w]) : w + "=" + h[w];
                    if (t(g)) v = p(a,
                        k, c), a.id == c && A(c, !0), u.success = !0, u.ref = v;
                    else {
                        if (m && e()) {
                            a.data = m;
                            l(a, k, c, r);
                            return
                        }
                        A(c, !0)
                    }
                    r && r(u)
                })) : r && r(u)
            },
            switchOffAutoHideShow: function() {
                O = !1
            },
            ua: k,
            getFlashPlayerVersion: function() {
                return {
                    major: k.pv[0],
                    minor: k.pv[1],
                    release: k.pv[2]
                }
            },
            hasFlashPlayerVersion: t,
            createSWF: function(a, b, c) {
                if (k.w3) return p(a, b, c)
            },
            showExpressInstall: function(a, b, c, f) {
                k.w3 && e() && l(a, b, c, f)
            },
            removeSWF: function(a) {
                k.w3 && n(a)
            },
            createCSS: function(a, b, c, e) {
                k.w3 && K(a, b, c, e)
            },
            addDomLoadEvent: a,
            addLoadEvent: b,
            getQueryParamValue: function(a) {
                var b =
                    h.location.search || h.location.hash;
                if (b) {
                    /\?/.test(b) && (b = b.split("?")[1]);
                    if (null == a) return L(b);
                    for (var b = b.split("&"), c = 0; c < b.length; c++)
                        if (b[c].substring(0, b[c].indexOf("=")) == a) return L(b[c].substring(b[c].indexOf("=") + 1))
                }
                return ""
            },
            expressInstallCallback: function() {
                if (F) {
                    var a = v("SWFObjectExprInst");
                    a && D && (a.parentNode.replaceChild(D, a), G && (A(G, !0), k.ie && k.win && (D.style.display = "block")), I && I(N));
                    F = !1
                }
            }
        }
    }();
    (function() {
        if ("undefined" != typeof window && !window.WebSocket) {
            var d = window.console;
            d &&
                d.log && d.error || (d = {
                    log: function() {},
                    error: function() {}
                });
            x.hasFlashPlayerVersion("10.0.0") ? ("file:" == location.protocol && d.error("WARNING: web-socket-js doesn't work in file:///... URL unless you set Flash Security Settings properly. Open the page via Web server i.e. http://..."), WebSocket = function(a, b, c, d, f) {
                    var e = this;
                    e.__id = WebSocket.__nextId++;
                    WebSocket.__instances[e.__id] = e;
                    e.readyState = WebSocket.CONNECTING;
                    e.bufferedAmount = 0;
                    e.__events = {};
                    b ? "string" == typeof b && (b = [b]) : b = [];
                    setTimeout(function() {
                        WebSocket.__addTask(function() {
                            WebSocket.__flash.create(e.__id,
                                a, b, c || null, d || 0, f || null)
                        })
                    }, 0)
                }, WebSocket.prototype.send = function(a) {
                    if (this.readyState == WebSocket.CONNECTING) throw "INVALID_STATE_ERR: Web Socket connection has not been established";
                    a = WebSocket.__flash.send(this.__id, encodeURIComponent(a));
                    if (0 > a) return !0;
                    this.bufferedAmount += a;
                    return !1
                }, WebSocket.prototype.close = function() {
                    this.readyState != WebSocket.CLOSED && this.readyState != WebSocket.CLOSING && (this.readyState = WebSocket.CLOSING, WebSocket.__flash.close(this.__id))
                }, WebSocket.prototype.addEventListener =
                function(a, b, c) {
                    a in this.__events || (this.__events[a] = []);
                    this.__events[a].push(b)
                }, WebSocket.prototype.removeEventListener = function(a, b, c) {
                    if (a in this.__events)
                        for (a = this.__events[a], c = a.length - 1; 0 <= c; --c)
                            if (a[c] === b) {
                                a.splice(c, 1);
                                break
                            }
                }, WebSocket.prototype.dispatchEvent = function(a) {
                    console.log("dispatch event arg", a);
                    for (var b = this.__events[a.type] || [], c = 0; c < b.length; ++c) b[c](a);
                    (b = this["on" + a.type]) && b(a)
                }, WebSocket.prototype.__handleEvent = function(a) {
                    console.log("handle event arg", a);
                    "readyState" in a && (this.readyState = a.readyState);
                    "protocol" in a && (this.protocol =
                        a.protocol);
                    if ("open" == a.type || "error" == a.type) a = this.__createSimpleEvent(a.type);
                    else if ("close" == a.type) a = this.__createSimpleEvent("close");
                    else if ("message" == a.type) a = decodeURIComponent(a.message), a = this.__createMessageEvent("message", a);
                    else throw "unknown event type: " + a.type;
                    this.dispatchEvent(a)
                }, WebSocket.prototype.__createSimpleEvent = function(a) {
                    if (document.createEvent && window.Event) {
                        var b = document.createEvent("Event");
                        b.initEvent(a, !1, !1);
                        return b
                    }
                    return {
                        type: a,
                        bubbles: !1,
                        cancelable: !1
                    }
                },
                WebSocket.prototype.__createMessageEvent = function(a, b) {
                    if (document.createEvent && window.MessageEvent && !window.opera) {
                        var c = document.createEvent("MessageEvent");
                        c.initMessageEvent("message", !1, !1, b, null, null, window, null);
                        return c
                    }
                    return {
                        type: a,
                        data: b,
                        bubbles: !1,
                        cancelable: !1
                    }
                }, WebSocket.CONNECTING = 0, WebSocket.OPEN = 1, WebSocket.CLOSING = 2, WebSocket.CLOSED = 3, WebSocket.__flash = null, WebSocket.__instances = {}, WebSocket.__tasks = [], WebSocket.__nextId = 0, WebSocket.loadFlashPolicyFile = function(a) {
                    WebSocket.__addTask(function() {
                        WebSocket.__flash.loadManualPolicyFile(a)
                    })
                },
                WebSocket.__initialize = function() {
                    if (!WebSocket.__flash)
                        if (WebSocket.__swfLocation && (window.WEB_SOCKET_SWF_LOCATION = WebSocket.__swfLocation), window.WEB_SOCKET_SWF_LOCATION) {
                            var a = document.createElement("div");
                            a.id = "webSocketContainer";
                            a.style.position = "absolute";
                            WebSocket.__isFlashLite() ? (a.style.left = "0px", a.style.top = "0px") : (a.style.left = "-100px", a.style.top = "-100px");
                            var b = document.createElement("div");
                            b.id = "webSocketFlash";
                            a.appendChild(b);
                            document.body.appendChild(a);
                            x.embedSWF(WEB_SOCKET_SWF_LOCATION,
                                "webSocketFlash", "1", "1", "10.0.0", null, null, {
                                    hasPriority: !0,
                                    swliveconnect: !0,
                                    allowScriptAccess: "always"
                                }, null,
                                function(a) {
                                    a.success || d.error("[WebSocket] swfobject.embedSWF failed")
                                })
                        } else d.error("[WebSocket] set WEB_SOCKET_SWF_LOCATION to location of WebSocketMain.swf")
                }, WebSocket.__onFlashInitialized = function() {
                    setTimeout(function() {
                        WebSocket.__flash = document.getElementById("webSocketFlash");
                        WebSocket.__flash.setCallerUrl(location.href);
                        WebSocket.__flash.setDebug(!!window.WEB_SOCKET_DEBUG);
                        for (var a =
                                0; a < WebSocket.__tasks.length; ++a) WebSocket.__tasks[a]();
                        WebSocket.__tasks = []
                    }, 0)
                }, WebSocket.__onFlashEvent = function() {
                    setTimeout(function() {
                        try {
                            for (var a = WebSocket.__flash.receiveEvents(), b = 0; b < a.length; ++b) WebSocket.__instances[a[b].webSocketId].__handleEvent(a[b])
                        } catch (c) {
                            d.error(c)
                        }
                    }, 0);
                    return !0
                }, WebSocket.__log = function(a) {
                    d.log(decodeURIComponent(a))
                }, WebSocket.__error = function(a) {
                    d.error(decodeURIComponent(a))
                }, WebSocket.__addTask = function(a) {
                    WebSocket.__flash ? a() : WebSocket.__tasks.push(a)
                },
                WebSocket.__isFlashLite = function() {
                    if (!window.navigator || !window.navigator.mimeTypes) return !1;
                    var a = window.navigator.mimeTypes["application/x-shockwave-flash"];
                    return a && a.enabledPlugin && a.enabledPlugin.filename ? a.enabledPlugin.filename.match(/flashlite/i) ? !0 : !1 : !1
                }, window.WEB_SOCKET_DISABLE_AUTO_INITIALIZATION || (window.addEventListener ? window.addEventListener("load", function() {
                    WebSocket.__initialize()
                }, !1) : window.attachEvent("onload", function() {
                    WebSocket.__initialize()
                }))) : d.error("Flash Player >= 10.0.0 is required.")
        }
    })();
    (function(d, a, b) {
        function c(b) {
            b && (a.Transport.apply(this, arguments), this.sendBuffer = [])
        }

        function g() {}
        d.XHR = c;
        a.util.inherit(c, a.Transport);
        c.prototype.open = function() {
            this.socket.setBuffer(!1);
            this.onOpen();
            this.get();
            this.setCloseTimeout();
            return this
        };
        c.prototype.payload = function(b) {
            for (var c = [], d = 0, g = b.length; d < g; d++) c.push(a.parser.encodePacket(b[d]));
            this.send(a.parser.encodePayload(c))
        };
        c.prototype.send = function(a) {
            this.post(a);
            return this
        };
        c.prototype.post = function(a) {
            function c() {
                if (4 ==
                    this.readyState)
                    if (this.onreadystatechange = g, m.posting = !1, 200 == this.status) m.socket.setBuffer(!1);
                    else m.onClose()
            }

            function d() {
                this.onload = g;
                m.socket.setBuffer(!1)
            }
            var m = this;
            this.socket.setBuffer(!0);
            this.sendXHR = this.request("POST");
            b.XDomainRequest && this.sendXHR instanceof XDomainRequest ? this.sendXHR.onload = this.sendXHR.onerror = d : this.sendXHR.onreadystatechange = c;
            this.sendXHR.send(a)
        };
        c.prototype.close = function() {
            this.onClose();
            return this
        };
        c.prototype.request = function(b) {
            var c = a.util.request(this.socket.isXDomain()),
                d = a.util.query(this.socket.options.query, "t=" + +new Date);
            c.open(b || "GET", this.prepareUrl() + d, !0);
            if ("POST" == b) try {
                c.setRequestHeader ? c.setRequestHeader("Content-type", "text/plain;charset=UTF-8") : c.contentType = "text/plain"
            } catch (g) {}
            return c
        };
        c.prototype.scheme = function() {
            return this.socket.options.secure ? "https" : "http"
        };
        c.check = function(c, e) {
            try {
                var d = a.util.request(e),
                    g = b.XDomainRequest && d instanceof XDomainRequest,
                    r = c && c.options && c.options.secure ? "https:" : "http:",
                    p = b.location && r != b.location.protocol;
                if (d && (!g || !p)) return !0
            } catch (n) {}
            return !1
        };
        c.xdomainCheck = function(a) {
            return c.check(a, !0)
        }
    })("undefined" != typeof io ? io.Transport : module.exports, "undefined" != typeof io ? io : module.parent.exports, this);
    (function(d, a) {
        function b(b) {
            a.Transport.XHR.apply(this, arguments)
        }
        d.htmlfile = b;
        a.util.inherit(b, a.Transport.XHR);
        b.prototype.name = "htmlfile";
        b.prototype.get = function() {
            this.doc = new(window[["Active"].concat("Object").join("X")])("htmlfile");
            this.doc.open();
            this.doc.write("<html></html>");
            this.doc.close();
            this.doc.parentWindow.s = this;
            var b = this.doc.createElement("div");
            b.className = "socketio";
            this.doc.body.appendChild(b);
            this.iframe = this.doc.createElement("iframe");
            b.appendChild(this.iframe);
            var d = this,
                b = a.util.query(this.socket.options.query, "t=" + +new Date);
            this.iframe.src = this.prepareUrl() + b;
            a.util.on(window, "unload", function() {
                d.destroy()
            })
        };
        b.prototype._ = function(a, b) {
            a = a.replace(/\\\//g, "/");
            this.onData(a);
            try {
                var f = b.getElementsByTagName("script")[0];
                f.parentNode.removeChild(f)
            } catch (e) {}
        };
        b.prototype.destroy =
            function() {
                if (this.iframe) {
                    try {
                        this.iframe.src = "about:blank"
                    } catch (a) {}
                    this.doc = null;
                    this.iframe.parentNode.removeChild(this.iframe);
                    this.iframe = null;
                    CollectGarbage()
                }
            };
        b.prototype.close = function() {
            this.destroy();
            return a.Transport.XHR.prototype.close.call(this)
        };
        b.check = function(b) {
            if ("undefined" != typeof window && ["Active"].concat("Object").join("X") in window) try {
                return new(window[["Active"].concat("Object").join("X")])("htmlfile"), a.Transport.XHR.check(b)
            } catch (d) {}
            return !1
        };
        b.xdomainCheck = function() {
            return !1
        };
        a.transports.push("htmlfile")
    })("undefined" != typeof io ? io.Transport : module.exports, "undefined" != typeof io ? io : module.parent.exports);
    (function(d, a, b) {
        function c() {
            a.Transport.XHR.apply(this, arguments)
        }

        function g() {}
        d["xhr-polling"] = c;
        a.util.inherit(c, a.Transport.XHR);
        a.util.merge(c, a.Transport.XHR);
        c.prototype.name = "xhr-polling";
        c.prototype.heartbeats = function() {
            return !1
        };
        c.prototype.open = function() {
            a.Transport.XHR.prototype.open.call(this);
            return !1
        };
        c.prototype.get = function() {
            function a() {
                if (4 == this.readyState)
                    if (this.onreadystatechange =
                        g, 200 == this.status) m.onData(this.responseText), m.get();
                    else m.onClose()
            }

            function c() {
                this.onerror = this.onload = g;
                m.retryCounter = 1;
                m.onData(this.responseText);
                m.get()
            }

            function d() {
                m.retryCounter++;
                if (!m.retryCounter || 3 < m.retryCounter) m.onClose();
                else m.get()
            }
            if (this.isOpen) {
                var m = this;
                this.xhr = this.request();
                b.XDomainRequest && this.xhr instanceof XDomainRequest ? (this.xhr.onload = c, this.xhr.onerror = d) : this.xhr.onreadystatechange = a;
                this.xhr.send(null)
            }
        };
        c.prototype.onClose = function() {
            a.Transport.XHR.prototype.onClose.call(this);
            if (this.xhr) {
                this.xhr.onreadystatechange = this.xhr.onload = this.xhr.onerror = g;
                try {
                    this.xhr.abort()
                } catch (b) {}
                this.xhr = null
            }
        };
        c.prototype.ready = function(b, c) {
            var d = this;
            a.util.defer(function() {
                c.call(d)
            })
        };
        a.transports.push("xhr-polling")
    })("undefined" != typeof io ? io.Transport : module.exports, "undefined" != typeof io ? io : module.parent.exports, this);
    (function(d, a, b) {
        function c(b) {
            a.Transport["xhr-polling"].apply(this, arguments);
            this.index = a.j.length;
            var c = this;
            a.j.push(function(a) {
                c._(a)
            })
        }
        var g = b.document &&
            "MozAppearance" in b.document.documentElement.style;
        d["jsonp-polling"] = c;
        a.util.inherit(c, a.Transport["xhr-polling"]);
        c.prototype.name = "jsonp-polling";
        c.prototype.post = function(b) {
            function c() {
                d();
                g.socket.setBuffer(!1)
            }

            function d() {
                g.iframe && g.form.removeChild(g.iframe);
                try {
                    w = document.createElement('<iframe name="' + g.iframeId + '">')
                } catch (a) {
                    w = document.createElement("iframe"), w.name = g.iframeId
                }
                w.id = g.iframeId;
                g.form.appendChild(w);
                g.iframe = w
            }
            var g = this,
                r = a.util.query(this.socket.options.query, "t=" +
                    +new Date + "&i=" + this.index);
            if (!this.form) {
                var p = document.createElement("form"),
                    n = document.createElement("textarea"),
                    v = this.iframeId = "socketio_iframe_" + this.index,
                    w;
                p.className = "socketio";
                p.style.position = "absolute";
                p.style.top = "0px";
                p.style.left = "0px";
                p.style.display = "none";
                p.target = v;
                p.method = "POST";
                p.setAttribute("accept-charset", "utf-8");
                n.name = "d";
                p.appendChild(n);
                document.body.appendChild(p);
                this.form = p;
                this.area = n
            }
            this.form.action = this.prepareUrl() + r;
            d();
            this.area.value = a.JSON.stringify(b);
            try {
                this.form.submit()
            } catch (t) {}
            this.iframe.attachEvent ? w.onreadystatechange = function() {
                "complete" == g.iframe.readyState && c()
            } : this.iframe.onload = c;
            this.socket.setBuffer(!0)
        };
        c.prototype.get = function() {
            var b = this,
                c = document.createElement("script"),
                d = a.util.query(this.socket.options.query, "t=" + +new Date + "&i=" + this.index);
            this.script && (this.script.parentNode.removeChild(this.script), this.script = null);
            c.async = !0;
            c.src = this.prepareUrl() + d;
            c.onerror = function() {
                b.onClose()
            };
            d = document.getElementsByTagName("script")[0];
            d.parentNode.insertBefore(c, d);
            this.script = c;
            g && setTimeout(function() {
                var a = document.createElement("iframe");
                document.body.appendChild(a);
                document.body.removeChild(a)
            }, 100)
        };
        c.prototype._ = function(a) {
            this.onData(a);
            this.isOpen && this.get();
            return this
        };
        c.prototype.ready = function(b, c) {
            var d = this;
            if (!g) return c.call(this);
            a.util.load(function() {
                c.call(d)
            })
        };
        c.check = function() {
            return "document" in b
        };
        c.xdomainCheck = function() {
            return !0
        };
        a.transports.push("jsonp-polling")
    })("undefined" != typeof io ? io.Transport :
        module.exports, "undefined" != typeof io ? io : module.parent.exports, this);
    "function" === typeof define && define.amd && define([], function() {
        return io
    })
})();