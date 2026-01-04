// ==UserScript==
// @name         TFGS Chat Script
// @namespace    http://tampermonkey.net/
// @version      2.0.7
// @description  QoL features that I wanted added into chat.
// @author       gea
// @match        https://tfgames.site/phpbb3/chat/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/406762/TFGS%20Chat%20Script.user.js
// @updateURL https://update.greasyfork.org/scripts/406762/TFGS%20Chat%20Script.meta.js
// ==/UserScript==
! function(e) {
    var t = {};

    function n(o) {
        if (t[o]) return t[o].exports;
        var r = t[o] = {
            i: o,
            l: !1,
            exports: {}
        };
        return e[o].call(r.exports, r, r.exports, n), r.l = !0, r.exports
    }
    n.m = e, n.c = t, n.d = function(e, t, o) {
        n.o(e, t) || Object.defineProperty(e, t, {
            enumerable: !0,
            get: o
        })
    }, n.r = function(e) {
        "undefined" != typeof Symbol && Symbol.toStringTag && Object.defineProperty(e, Symbol.toStringTag, {
            value: "Module"
        }), Object.defineProperty(e, "__esModule", {
            value: !0
        })
    }, n.t = function(e, t) {
        if (1 & t && (e = n(e)), 8 & t) return e;
        if (4 & t && "object" == typeof e && e && e.__esModule) return e;
        var o = Object.create(null);
        if (n.r(o), Object.defineProperty(o, "default", {
                enumerable: !0,
                value: e
            }), 2 & t && "string" != typeof e)
            for (var r in e) n.d(o, r, function(t) {
                return e[t]
            }.bind(null, r));
        return o
    }, n.n = function(e) {
        var t = e && e.__esModule ? function() {
            return e.default
        } : function() {
            return e
        };
        return n.d(t, "a", t), t
    }, n.o = function(e, t) {
        return Object.prototype.hasOwnProperty.call(e, t)
    }, n.p = "", n(n.s = 1)
}([function(e, t, n) {
    var o = function(e) {
        "use strict";
        var t = Object.prototype,
            n = t.hasOwnProperty,
            o = "function" == typeof Symbol ? Symbol : {},
            r = o.iterator || "@@iterator",
            a = o.asyncIterator || "@@asyncIterator",
            i = o.toStringTag || "@@toStringTag";

        function c(e, t, n, o) {
            var r = t && t.prototype instanceof d ? t : d,
                a = Object.create(r.prototype),
                i = new k(o || []);
            return a._invoke = function(e, t, n) {
                var o = "suspendedStart";
                return function(r, a) {
                    if ("executing" === o) throw new Error("Generator is already running");
                    if ("completed" === o) {
                        if ("throw" === r) throw a;
                        return E()
                    }
                    for (n.method = r, n.arg = a;;) {
                        var i = n.delegate;
                        if (i) {
                            var c = C(i, n);
                            if (c) {
                                if (c === s) continue;
                                return c
                            }
                        }
                        if ("next" === n.method) n.sent = n._sent = n.arg;
                        else if ("throw" === n.method) {
                            if ("suspendedStart" === o) throw o = "completed", n.arg;
                            n.dispatchException(n.arg)
                        } else "return" === n.method && n.abrupt("return", n.arg);
                        o = "executing";
                        var d = l(e, t, n);
                        if ("normal" === d.type) {
                            if (o = n.done ? "completed" : "suspendedYield", d.arg === s) continue;
                            return {
                                value: d.arg,
                                done: n.done
                            }
                        }
                        "throw" === d.type && (o = "completed", n.method = "throw", n.arg = d.arg)
                    }
                }
            }(e, n, i), a
        }

        function l(e, t, n) {
            try {
                return {
                    type: "normal",
                    arg: e.call(t, n)
                }
            } catch (e) {
                return {
                    type: "throw",
                    arg: e
                }
            }
        }
        e.wrap = c;
        var s = {};

        function d() {}

        function u() {}

        function h() {}
        var p = {};
        p[r] = function() {
            return this
        };
        var m = Object.getPrototypeOf,
            g = m && m(m(x([])));
        g && g !== t && n.call(g, r) && (p = g);
        var f = h.prototype = d.prototype = Object.create(p);

        function y(e) {
            ["next", "throw", "return"].forEach((function(t) {
                e[t] = function(e) {
                    return this._invoke(t, e)
                }
            }))
        }

        function v(e, t) {
            var o;
            this._invoke = function(r, a) {
                function i() {
                    return new t((function(o, i) {
                        ! function o(r, a, i, c) {
                            var s = l(e[r], e, a);
                            if ("throw" !== s.type) {
                                var d = s.arg,
                                    u = d.value;
                                return u && "object" == typeof u && n.call(u, "__await") ? t.resolve(u.__await).then((function(e) {
                                    o("next", e, i, c)
                                }), (function(e) {
                                    o("throw", e, i, c)
                                })) : t.resolve(u).then((function(e) {
                                    d.value = e, i(d)
                                }), (function(e) {
                                    return o("throw", e, i, c)
                                }))
                            }
                            c(s.arg)
                        }(r, a, o, i)
                    }))
                }
                return o = o ? o.then(i, i) : i()
            }
        }

        function C(e, t) {
            var n = e.iterator[t.method];
            if (void 0 === n) {
                if (t.delegate = null, "throw" === t.method) {
                    if (e.iterator.return && (t.method = "return", t.arg = void 0, C(e, t), "throw" === t.method)) return s;
                    t.method = "throw", t.arg = new TypeError("The iterator does not provide a 'throw' method")
                }
                return s
            }
            var o = l(n, e.iterator, t.arg);
            if ("throw" === o.type) return t.method = "throw", t.arg = o.arg, t.delegate = null, s;
            var r = o.arg;
            return r ? r.done ? (t[e.resultName] = r.value, t.next = e.nextLoc, "return" !== t.method && (t.method = "next", t.arg = void 0), t.delegate = null, s) : r : (t.method = "throw", t.arg = new TypeError("iterator result is not an object"), t.delegate = null, s)
        }

        function b(e) {
            var t = {
                tryLoc: e[0]
            };
            1 in e && (t.catchLoc = e[1]), 2 in e && (t.finallyLoc = e[2], t.afterLoc = e[3]), this.tryEntries.push(t)
        }

        function w(e) {
            var t = e.completion || {};
            t.type = "normal", delete t.arg, e.completion = t
        }

        function k(e) {
            this.tryEntries = [{
                tryLoc: "root"
            }], e.forEach(b, this), this.reset(!0)
        }

        function x(e) {
            if (e) {
                var t = e[r];
                if (t) return t.call(e);
                if ("function" == typeof e.next) return e;
                if (!isNaN(e.length)) {
                    var o = -1,
                        a = function t() {
                            for (; ++o < e.length;)
                                if (n.call(e, o)) return t.value = e[o], t.done = !1, t;
                            return t.value = void 0, t.done = !0, t
                        };
                    return a.next = a
                }
            }
            return {
                next: E
            }
        }

        function E() {
            return {
                value: void 0,
                done: !0
            }
        }
        return u.prototype = f.constructor = h, h.constructor = u, h[i] = u.displayName = "GeneratorFunction", e.isGeneratorFunction = function(e) {
            var t = "function" == typeof e && e.constructor;
            return !!t && (t === u || "GeneratorFunction" === (t.displayName || t.name))
        }, e.mark = function(e) {
            return Object.setPrototypeOf ? Object.setPrototypeOf(e, h) : (e.__proto__ = h, i in e || (e[i] = "GeneratorFunction")), e.prototype = Object.create(f), e
        }, e.awrap = function(e) {
            return {
                __await: e
            }
        }, y(v.prototype), v.prototype[a] = function() {
            return this
        }, e.AsyncIterator = v, e.async = function(t, n, o, r, a) {
            void 0 === a && (a = Promise);
            var i = new v(c(t, n, o, r), a);
            return e.isGeneratorFunction(n) ? i : i.next().then((function(e) {
                return e.done ? e.value : i.next()
            }))
        }, y(f), f[i] = "Generator", f[r] = function() {
            return this
        }, f.toString = function() {
            return "[object Generator]"
        }, e.keys = function(e) {
            var t = [];
            for (var n in e) t.push(n);
            return t.reverse(),
                function n() {
                    for (; t.length;) {
                        var o = t.pop();
                        if (o in e) return n.value = o, n.done = !1, n
                    }
                    return n.done = !0, n
                }
        }, e.values = x, k.prototype = {
            constructor: k,
            reset: function(e) {
                if (this.prev = 0, this.next = 0, this.sent = this._sent = void 0, this.done = !1, this.delegate = null, this.method = "next", this.arg = void 0, this.tryEntries.forEach(w), !e)
                    for (var t in this) "t" === t.charAt(0) && n.call(this, t) && !isNaN(+t.slice(1)) && (this[t] = void 0)
            },
            stop: function() {
                this.done = !0;
                var e = this.tryEntries[0].completion;
                if ("throw" === e.type) throw e.arg;
                return this.rval
            },
            dispatchException: function(e) {
                if (this.done) throw e;
                var t = this;

                function o(n, o) {
                    return i.type = "throw", i.arg = e, t.next = n, o && (t.method = "next", t.arg = void 0), !!o
                }
                for (var r = this.tryEntries.length - 1; r >= 0; --r) {
                    var a = this.tryEntries[r],
                        i = a.completion;
                    if ("root" === a.tryLoc) return o("end");
                    if (a.tryLoc <= this.prev) {
                        var c = n.call(a, "catchLoc"),
                            l = n.call(a, "finallyLoc");
                        if (c && l) {
                            if (this.prev < a.catchLoc) return o(a.catchLoc, !0);
                            if (this.prev < a.finallyLoc) return o(a.finallyLoc)
                        } else if (c) {
                            if (this.prev < a.catchLoc) return o(a.catchLoc, !0)
                        } else {
                            if (!l) throw new Error("try statement without catch or finally");
                            if (this.prev < a.finallyLoc) return o(a.finallyLoc)
                        }
                    }
                }
            },
            abrupt: function(e, t) {
                for (var o = this.tryEntries.length - 1; o >= 0; --o) {
                    var r = this.tryEntries[o];
                    if (r.tryLoc <= this.prev && n.call(r, "finallyLoc") && this.prev < r.finallyLoc) {
                        var a = r;
                        break
                    }
                }
                a && ("break" === e || "continue" === e) && a.tryLoc <= t && t <= a.finallyLoc && (a = null);
                var i = a ? a.completion : {};
                return i.type = e, i.arg = t, a ? (this.method = "next", this.next = a.finallyLoc, s) : this.complete(i)
            },
            complete: function(e, t) {
                if ("throw" === e.type) throw e.arg;
                return "break" === e.type || "continue" === e.type ? this.next = e.arg : "return" === e.type ? (this.rval = this.arg = e.arg, this.method = "return", this.next = "end") : "normal" === e.type && t && (this.next = t), s
            },
            finish: function(e) {
                for (var t = this.tryEntries.length - 1; t >= 0; --t) {
                    var n = this.tryEntries[t];
                    if (n.finallyLoc === e) return this.complete(n.completion, n.afterLoc), w(n), s
                }
            },
            catch: function(e) {
                for (var t = this.tryEntries.length - 1; t >= 0; --t) {
                    var n = this.tryEntries[t];
                    if (n.tryLoc === e) {
                        var o = n.completion;
                        if ("throw" === o.type) {
                            var r = o.arg;
                            w(n)
                        }
                        return r
                    }
                }
                throw new Error("illegal catch attempt")
            },
            delegateYield: function(e, t, n) {
                return this.delegate = {
                    iterator: x(e),
                    resultName: t,
                    nextLoc: n
                }, "next" === this.method && (this.arg = void 0), s
            }
        }, e
    }(e.exports);
    try {
        regeneratorRuntime = o
    } catch (e) {
        Function("r", "regeneratorRuntime = r")(o)
    }
}, function(e, t, n) {
    "use strict";
    n.r(t);
    var o = {
        updatesRead: [],
        player: new Audio('https://tfgames.site/phpbb3/chat/sounds/sound_1.mp3'),
        features: {
            debugMode: !1,
            audioNotifications: !1,
            notifications: !0,
            autoColorQuotes: !0,
            showYourColors: !0,
            hideChatbotLoginLogoutMessages: !1,
            imageHovering: !0
        },
        buttons: {
            backgroundColor: "#202020",
            borderColor: "#8a8a8a",
            fontColor: "#ffffff"
        },
        dropDownMenus: {
            backgroundColor: "#202020",
            borderColor: "#8a8a8a",
            fontColor: "#ffffff"
        },
        main: {
            backgroundColor: "#373c40",
            linkColor: "#9e9e9e",
            fontFamily: 'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, "Noto Sans", sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol", "Noto Color Emoji"'
        },
        chat: {
            backgroundColor: "#202020",
            rowEvenBackgroundColor: "#202020",
            rowOddBackgroundColor: "#202020",
            quotedTextColor: "#ffffff",
            quotedTextColor2: "#fffffe",
            quotedTextColor3: "#ffffge",
            chatBotColor: "#f09379",
            usernameColor: "#7ee0ce",
            dateTimeColor: "#85dc85",
            actionColor: "#ff5353",
            chatBotMessageColor: "#9e9e9e",
            defaultChatColor: "#8cc85f",
            chatLinksColor: "#78c2ff",
            pmBackgroundColor: "#373c40",
            moderatorColor: "#80a0ff"
        },
        chatInput: {
            backgroundColor: "#202020",
            fontColor: "#8cc85f",
            fontFamily: 'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, "Noto Sans", sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol", "Noto Color Emoji"'
        },
        header: {
            backgroundColor: "#202020",
            fontColor: "#ffffff"
        }
    };

    function r(e, t) {
        var n = Object.keys(e);
        if (Object.getOwnPropertySymbols) {
            var o = Object.getOwnPropertySymbols(e);
            t && (o = o.filter((function(t) {
                return Object.getOwnPropertyDescriptor(e, t).enumerable
            }))), n.push.apply(n, o)
        }
        return n
    }

    function a(e) {
        for (var t = 1; t < arguments.length; t++) {
            var n = null != arguments[t] ? arguments[t] : {};
            t % 2 ? r(Object(n), !0).forEach((function(t) {
                i(e, t, n[t])
            })) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(n)) : r(Object(n)).forEach((function(t) {
                Object.defineProperty(e, t, Object.getOwnPropertyDescriptor(n, t))
            }))
        }
        return e
    }

    function i(e, t, n) {
        return t in e ? Object.defineProperty(e, t, {
            value: n,
            enumerable: !0,
            configurable: !0,
            writable: !0
        }) : e[t] = n, e
    }

    function c(e) {
        localStorage.setItem("config", JSON.stringify(e))
    }

    function l() {
        var e = localStorage.getItem("config");
        return JSON.parse(e)
    }

    function s(e) {
        var t = 0,
            n = 0,
            o = document.getElementById(e);
        if (document.all) t = o.currentStyle.height, n = "".concat(parseInt(o.currentStyle.marginTop, 10) + parseInt(o.currentStyle.marginBottom, 10), "px");
        else {
            var r = document.defaultView.getComputedStyle(o, "");
            t = parseInt(r.getPropertyValue("height").trim("px"), 10), n = parseInt(r.getPropertyValue("margin-top"), 10) + parseInt(r.getPropertyValue("margin-bottom"), 10)
        }
        return t + n
    }

    function d() {
        var e = document.getElementById("chatList"),
            t = document.getElementById("onlineListContainer"),
            n = document.getElementById("settingsContainer"),
            o = document.getElementById("helpContainer"),
            r = window.innerHeight;
        r -= s("headline"), r -= s("logoutChannelContainer"), r -= s("inputFieldContainer"), r -= s("chat_buttons_container"), r -= s("updatesBar"), e.style.height = "calc(".concat(r, "px - 4em)"), t.style.height = "calc(".concat(r, "px - 4em)"), n.style.height = "calc(".concat(r, "px - 4em)"), o.style.height = "calc(".concat(r, "px - 4em)")
    }

    function u(e, t) {
        for (var n = 0; n < t.length; n++) {
            var o = t[n];
            o.enumerable = o.enumerable || !1, o.configurable = !0, "value" in o && (o.writable = !0), Object.defineProperty(e, o.key, o)
        }
    }
    var h = function() {
            function e(t) {
                ! function(e, t) {
                    if (!(e instanceof t)) throw new TypeError("Cannot call a class as a function")
                }(this, e), this.config = t, this.updates = [], this.createBar()
            }
            var t, n, o;
            return t = e, (n = [{
                key: "createUpdate",
                value: function(e, t) {
                    var n = this,
                        o = document.createElement("div");
                    o.style.alignItems = "center", o.style.borderBottom = "1px solid #888", o.style.display = "flex";
                    var r = document.createElement("span");
                    r.innerText = e;
                    var a = document.createElement("span");
                    return a.innerText = "X", a.id = "".concat(t), a.style.cursor = "pointer", a.style.fontSize = "1.5em", a.style.margin = "0 1em 0 auto", a.addEventListener("click", (function() {
                        n.config.updatesRead.push(parseInt(a.id, 10)), c(), a.parentNode.parentNode.removeChild(a.parentNode), d()
                    })), o.appendChild(r), o.appendChild(a), o
                }
            }, {
                key: "createBar",
                value: function() {
                    var e = document.createElement("div");
                    e.id = "updatesBar", e.style.color = "#fff", e.style.fontWeight = "bold";
                    for (var t = 0; t < this.updates.length; t += 1)
                        if (!(this.config.updatesRead.indexOf(t) > -1)) {
                            var n = this.createUpdate(this.updates[t], t);
                            e.appendChild(n)
                        } var o = document.getElementById("headline");
                    o.parentNode.insertBefore(e, o.nextSibling)
                }
            }]) && u(t.prototype, n), o && u(t, o), e
        }(),
        p = [{
            category: "custom",
            command: "/rainbow",
            description: "Makes your text color rainbow.",
            help: "/rainbow message",
            args: 0
        }, {
            category: "custom",
            command: "/tableflip",
            description: "(╯°□°）╯︵ ┻━┻",
            help: "/tableflip",
            args: 0
        }, {
            category: "custom",
            command: "/unflip",
            description: "┬─┬ ノ( ゜-゜ノ)",
            help: "/unflip",
            args: 0
        }, {
            category: "description",
            command: "/append",
            description: "Add text to the end of your description.",
            help: "/append text",
            args: 0
        }, {
            category: "description",
            command: "/desc",
            description: "Set or clear your description.",
            help: "/desc optional text",
            args: 0
        }, {
            category: "description",
            command: "/dlast",
            description: "Restores your last description (even after reconnect).",
            help: "/dlast",
            args: 0
        }, {
            category: "description",
            command: "/dload",
            description: "Load your saved default description.",
            help: "/dload",
            args: 0
        }, {
            category: "description",
            command: "/dload",
            description: "Load the description from numbered (1-9) slot.",
            help: "/dload #",
            args: 1
        }, {
            category: "description",
            command: "/dsave",
            description: "Save your current description as your default (auto-set on login).",
            help: "/dsave",
            args: 0
        }, {
            category: "description",
            command: "/dsave",
            description: "Save the current description to a numbered (1-9) slot.",
            help: "/dsave #",
            args: 1
        }, {
            category: "description",
            command: "/dlist",
            description: "Display a summary of your saved descriptions.",
            help: "/dlist",
            args: 0
        }, {
            category: "description",
            command: "/ex",
            description: "Examine your own description.",
            help: "/ex",
            args: 0
        }, {
            category: "description",
            command: "/ex",
            description: "Examine a user's description.",
            help: "/ex user",
            args: 1
        }, {
            category: "description",
            command: "/exall",
            description: "Examine all other users in your channel.",
            help: "/exall",
            args: 0
        }, {
            category: "description",
            command: "/pref",
            description: "Set or clear your roleplay preferences.",
            help: "/pref",
            args: 1
        }, {
            category: "description",
            command: "/show",
            description: "Show your roleplay preferences.",
            help: "/show",
            args: 0
        }, {
            category: "description",
            command: "/show",
            description: "Show another user's roleplay preferences.",
            help: "/show username",
            args: 1
        }, {
            category: "description",
            command: "/plast",
            description: "Change your preferences back to the previous value.",
            help: "/plast",
            args: 0
        }, {
            category: "description",
            command: "/finger",
            description: "Display when a user last logged on or off.",
            help: "/finger",
            args: 0
        }, {
            category: "transformation",
            command: "/tf",
            description: "Change another user's description.",
            help: "/tf user description",
            args: 1
        }, {
            category: "transformation",
            command: "/tfappend",
            description: "Add text to the end of another user's description.",
            help: "/tfappend user description",
            args: 1
        }, {
            category: "transformation",
            command: "/tfnick",
            description: "Change another user's nickname.",
            help: "/tfnick user nickname",
            args: 1
        }, {
            category: "transformation",
            command: "/tfallow",
            description: "Show your TF permission list (who can TF you).",
            help: "/tfallow",
            args: 0
        }, {
            category: "transformation",
            command: "/tfallow",
            description: "Update your TF permissions list (who can TF you).",
            help: "/tfallow username",
            args: 1
        }, {
            category: "transformation",
            command: "/tfdeny",
            description: "Lock/unlock TFs.",
            help: "/tfdeny",
            args: 0
        }, {
            category: "transformation",
            command: "/tfdeny",
            description: "Update your TF deny list.",
            help: "/tfdeny username",
            args: 1
        }, {
            category: "transformation",
            command: "/tflock",
            description: "Toggles the lock setting.",
            help: "/tflock",
            args: 0
        }, {
            category: "transformation",
            command: "/tfcheck",
            description: "Tells you if <name> is letting you TF them.",
            help: "/tfcheck username",
            args: 1
        }, {
            category: "channel-decoration-keys",
            command: "/deco",
            description: "Decorate the current channel (set its description).",
            help: "/deco description",
            args: 0
        }, {
            category: "channel-decoration-keys",
            command: "/look",
            description: "View the current channel decoration.",
            help: "/look",
            args: 0
        }, {
            category: "channel-decoration-keys",
            command: "/key",
            description: "Give a key to your private channel to a user.",
            help: "/key username",
            args: 1
        }, {
            category: "channel-decoration-keys",
            command: "/keys",
            description: "List who has keys to your private channel.",
            help: "/keys",
            args: 0
        }, {
            category: "channel-decoration-keys",
            command: "/keyring",
            description: "List the users who have given you keys to their private channels",
            help: "/keyring",
            args: 0
        }, {
            category: "channel-decoration-keys",
            command: "/kdel",
            description: "Revoke the key to your private channel from the user.",
            help: "/kdel username",
            args: 1
        }, {
            category: "channel-decoration-keys",
            command: "/kdrop",
            description: "Drop your key to the private channel of the user.",
            help: "/kdrop username",
            args: 1
        }, {
            category: "channel-decoration-keys",
            command: "/lock",
            description: "Locks or unlocks your private channel to prevent keyholders from entering.",
            help: "/lock",
            args: 0
        }, {
            category: "gaming",
            command: "/draw",
            description: "Draw X cards from a virtual deck.",
            help: "/draw #",
            args: 1
        }, {
            category: "gaming",
            command: "/mixup",
            description: "Returns numbers 1-X in a random order.",
            help: "/mixup #",
            args: 1
        }, {
            category: "gaming",
            command: "/8ball",
            description: "Ask the magic 8-ball a question.",
            help: "/8ball question",
            args: 1
        }, {
            category: "gaming",
            command: "/shuffle",
            description: "Shuffle the shared deck with up to 10 decks.",
            help: "/shuffle 1-10",
            args: 1
        }, {
            category: "gaming",
            command: "/reshuffle",
            description: "Repeat last shuffle type, cards in users' hand are not reclaimed.",
            help: "/reshuffle",
            args: 0
        }, {
            category: "gaming",
            command: "/ccount",
            description: "Show the count of cards in the channel deck.",
            help: "/ccount",
            args: 0
        }, {
            category: "gaming",
            command: "/cdraw",
            description: "Draw X cards from the channel deck, but don't add to your hand.",
            help: "/cdraw #",
            args: 1
        }, {
            category: "gaming",
            command: "/vdraw",
            description: "Draw X cards from the channel deck, show them, and add them to your hand.",
            help: "/vdraw #",
            args: 1
        }, {
            category: "gaming",
            command: "/hdraw",
            description: "Draw X cards from the channel deck to your hand without showing them.",
            help: "/hdraw #",
            args: 1
        }, {
            category: "gaming",
            command: "/hpeek",
            description: "Take a peek at your hidden cards.",
            help: "/hpeek",
            args: 0
        }, {
            category: "gaming",
            command: "/vroll",
            description: 'Roll dice so everyone can see and store them in your "hand".',
            help: "/vroll",
            args: 0
        }, {
            category: "gaming",
            command: "/rroll",
            description: 'Roll dice in secret and store them in your "hand".',
            help: "/rroll",
            args: 0
        }, {
            category: "gaming",
            command: "/rpeek",
            description: "Take a peek at your hidden rolls.",
            help: "/rpeek",
            args: 0
        }, {
            category: "gaming",
            command: "/rshow",
            description: "Show all or selected hidden rolls and keep them in your hand.",
            help: "/rshow",
            args: 0
        }, {
            category: "gaming",
            command: "/rplay",
            description: "Play (lay down and discard) all or selected hidden rolls.",
            help: "/rplay",
            args: 0
        }, {
            category: "gaming",
            command: "/rdrop",
            description: "Discard all or selected hidden rolls without showing them.",
            help: "/rdrop",
            args: 0
        }, {
            category: "other",
            command: "/afk",
            description: "Change your nickname to show you're away, or clear it.",
            help: "/afk",
            args: 0
        }, {
            category: "other",
            command: "/color",
            description: "Set or clear your default text color.",
            help: "/color color or hex color",
            args: 1
        }, {
            category: "other",
            command: "/nsave",
            description: "Save your current nickname as your default.",
            help: "/nsave",
            args: 0
        }, {
            category: "other",
            command: "/nlast",
            description: "Switch to the last nickname you were using.",
            help: "/nlast",
            args: 0
        }, {
            category: "other",
            command: "/ndefault",
            description: "Toggle which nickname to restore at login: Default or Last.",
            help: "/ndefault",
            args: 0
        }, {
            category: "other",
            command: "/ddefault",
            description: "Toggle which description to restore at login: Default or Last.",
            help: "/ddefault",
            args: 0
        }, {
            category: "other",
            command: "/actanon",
            description: 'Act "anonymously" as a fictitious user.',
            help: "/actanon fakeuser action",
            args: 1
        }, {
            category: "other",
            command: "/sayanon",
            description: 'Speak "anonymously" as a fictitious user.',
            help: "/sayanon fakeuser action",
            args: 1
        }, {
            category: "other",
            command: "/msganon",
            description: "Send an anonymous private message.",
            help: "/msganon fakeuser username message",
            args: 2
        }, {
            category: "other",
            command: "/doanon",
            description: "Send an anonymous private action.",
            help: "/doanon fakeuser username action",
            args: 2
        }];

    function m(e, t) {
        for (var n = 0; n < t.length; n++) {
            var o = t[n];
            o.enumerable = o.enumerable || !1, o.configurable = !0, "value" in o && (o.writable = !0), Object.defineProperty(e, o.key, o)
        }
    }

    function g(e) {
        var t = e.replace(/^#?([a-f\d])([a-f\d])([a-f\d])$/i, (function(e, t, n, o) {
                return t + t + n + n + o + o
            })),
            n = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(t);
        return n ? {
            r: parseInt(n[1], 16),
            g: parseInt(n[2], 16),
            b: parseInt(n[3], 16)
        } : null
    }

    function f(e, t) {
        var n = t || 2;
        return (new Array(n).join("0") + e).slice(-n)
    }
    var y = function() {
            function e(t) {
                var n, o;
                ! function(e, t) {
                    if (!(e instanceof t)) throw new TypeError("Cannot call a class as a function")
                }(this, e), this.color = t, null !== this.color && void 0 !== this.color && !(this.color instanceof Object) && this.color.length > 0 && (this.color = g(t), null === this.color && (this.color = g((o = (n = t).substring(4, n.length - 1).replace(/ /g, "").split(","), o = {
                    r: parseInt(o[0], 10),
                    g: parseInt(o[1], 10),
                    b: parseInt(o[2], 10)
                }, "#".concat(((1 << 24) + (o.r << 16) + (o.g << 8) + o.b).toString(16).slice(1))))))
            }
            var t, n, o;
            return t = e, (n = [{
                key: "getRgb",
                value: function() {
                    return this.color
                }
            }, {
                key: "getHex",
                value: function() {
                    return console.log(this.color), "#".concat(((1 << 24) + (this.color.r << 16) + (this.color.g << 8) + this.color.b).toString(16).slice(1))
                }
            }, {
                key: "getLuma",
                value: function() {
                    return .2126 * this.color.r + .7152 * this.color.g + .0722 * this.color.b
                }
            }, {
                key: "getInvertedHexColor",
                value: function() {
                    var e = (255 - this.color.r & 255).toString(16),
                        t = (255 - this.color.g & 255).toString(16),
                        n = (255 - this.color.b & 255).toString(16);
                    return "#".concat(f(e)).concat(f(t)).concat(f(n))
                }
            }, {
                key: "setFromHsl",
                value: function(e, t, n) {
                    var o, r, a, i = e / 360,
                        c = t / 100,
                        l = n / 100;
                    if (0 === c) o = l, r = l, a = l;
                    else {
                        var s, d = function(e, t, n) {
                                var o = n;
                                return o < 0 && (o += 1), o > 1 && (o -= 1), o < 1 / 6 ? e + 6 * (t - e) * o : o < .5 ? t : o < 2 / 3 ? e + (t - e) * (2 / 3 - o) * 6 : e
                            },
                            u = 2 * l - (s = l < .5 ? l * (1 + c) : l + c - l * c);
                        o = d(u, s, i + 1 / 3), r = d(u, s, i), a = d(u, s, i - 1 / 3)
                    }
                    console.log(o, r, a), this.color = {
                        r: Math.round(255 * o),
                        g: Math.round(255 * r),
                        b: Math.round(255 * a)
                    }
                }
            }]) && m(t.prototype, n), o && m(t, o), e
        }(),
        v = [{
            command: "/rainbow",
            args: 0,
            func: function(e) {
                for (var t = "", n = 0; n < e.length; n += 1) {
                    var o = new y;
                    o.setFromHsl(360 * n / e.length, 80, 50), t += "[color=".concat(o.getHex(), "]").concat(e[n], "[/color]")
                }
                return t
            }
        }, {
            command: "/help",
            args: 0,
            func: function() {
                var e = document.createElement("div");
                e.id = "help_container", e.style.backgroundColor = "rgba(0, 0, 0, .5)", e.style.height = "100%", e.style.position = "absolute", e.style.top = "0", e.style.width = "100%", e.style.zIndex = "999", e.addEventListener("click", (function(e) {
                    var t = document.getElementById("help_container");
                    e.target === t && t.parentNode.removeChild(t)
                }));
                var t = document.createElement("div");
                t.style.backgroundColor = "#202020", t.style.borderRadius = "5px", t.style.boxShadow = "0 0 5px #444", t.style.height = "75%", t.style.margin = "auto", t.style.maxWidth = "500px", t.style.overflow = "auto", t.style.padding = "1em 2em", t.style.width = "75%", t.style.transform = "translateY(calc(25% / 2))";
                for (var n = null, o = null, r = 0; r < p.length; r += 1) {
                    if (null === n || p[r].category.indexOf(n) <= -1) {
                        null !== o && t.appendChild(o), n = p[r].category, (o = document.createElement("div")).style.border = "1px solid #888", o.style.borderRadius = "5px", o.style.margin = "1em 0 2em", o.style.padding = "0.5em 1em";
                        var a = document.createElement("label");
                        a.innerText = p[r].category.split("-").map((function(e) {
                            return e.charAt(0).toUpperCase() + e.slice(1)
                        })).join(" "), a.style.backgroundColor = "#202020", a.style.marginLeft = "1em", a.style.marginTop = "-1.25em", a.style.position = "absolute", o.appendChild(a)
                    }
                    var i = document.createElement("div");
                    r + 1 < p.length && p[r + 1].category.indexOf(n) > -1 && (i.style.borderBottom = "1px solid #888");
                    var c = document.createElement("p");
                    c.innerText = p[r].help, c.style.margin = "1em 0 0", i.appendChild(c);
                    var l = document.createElement("p");
                    l.innerText = p[r].description, l.style.margin = "0 0 1em", i.appendChild(l), o.appendChild(i)
                }
                return e.appendChild(t), document.body.appendChild(e), null
            }
        }, {
            command: "/tableflip",
            args: 0,
            func: function() {
                return document.getElementById("inputField").value = "", "(╯°□°）╯︵ ┻━┻"
            }
        }, {
            command: "/unflip",
            args: 0,
            func: function() {
                return document.getElementById("inputField").value = "", "┬─┬ ノ( ゜-゜ノ)"
            }
        }];

    function C(e, t) {
        return function(e) {
            if (Array.isArray(e)) return e
        }(e) || function(e, t) {
            if ("undefined" == typeof Symbol || !(Symbol.iterator in Object(e))) return;
            var n = [],
                o = !0,
                r = !1,
                a = void 0;
            try {
                for (var i, c = e[Symbol.iterator](); !(o = (i = c.next()).done) && (n.push(i.value), !t || n.length !== t); o = !0);
            } catch (e) {
                r = !0, a = e
            } finally {
                try {
                    o || null == c.return || c.return()
                } finally {
                    if (r) throw a
                }
            }
            return n
        }(e, t) || function(e, t) {
            if (!e) return;
            if ("string" == typeof e) return b(e, t);
            var n = Object.prototype.toString.call(e).slice(8, -1);
            "Object" === n && e.constructor && (n = e.constructor.name);
            if ("Map" === n || "Set" === n) return Array.from(e);
            if ("Arguments" === n || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return b(e, t)
        }(e, t) || function() {
            throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.")
        }()
    }

    function b(e, t) {
        (null == t || t > e.length) && (t = e.length);
        for (var n = 0, o = new Array(t); n < t; n++) o[n] = e[n];
        return o
    }

    function w(e, t) {
        for (var n = 0; n < t.length; n++) {
            var o = t[n];
            o.enumerable = o.enumerable || !1, o.configurable = !0, "value" in o && (o.writable = !0), Object.defineProperty(e, o.key, o)
        }
    }
    var k = function() {
        function e(t) {
            var n = this;
            ! function(e, t) {
                if (!(e instanceof t)) throw new TypeError("Cannot call a class as a function")
            }(this, e), this.config = t, this.lastMessages = [], this.inputField = document.getElementById("inputField"), this.inputField.removeAttribute("onkeydown"), this.inputField.removeAttribute("onkeyup"), this.inputField.addEventListener("keydown", (function(e) {
                n.handleKeyDown(e)
            })), this.inputField.addEventListener("keyup", (function(e) {
                n.handleKeyUp(e)
            }))
        }
        var t, n, o;
        return t = e, (n = [{
            key: "displayLastMessages",
            value: function() {
                var e = this,
                    t = document.getElementById("lastSentMessages");
                t && t.parentNode && t.parentNode.removeChild(t);
                var n = document.getElementById("inputFieldContainer"),
                    o = document.createElement("div");
                o.style.backgroundColor = "".concat(this.config.chat.backgroundColor), o.style.border = "1px solid #ababab", o.style.boxSizing = "border-box", o.style.marginLeft = "10px", o.style.overflowY = "auto", o.style.width = "200px";
                var r = window.getComputedStyle(n);
                o.style.maxHeight = r.getPropertyValue("height"), o.id = "lastSentMessages";
                for (var a = function(t) {
                        var n = document.createElement("span");
                        n.style.borderBottom = "1px solid #ababab", n.style.display = "block", n.style.cursor = "pointer", n.style.padding = "0.25em", n.innerText = e.lastMessages[t], n.addEventListener("click", (function() {
                            document.getElementById("inputField").value = "", ajaxChat.insertText(n.innerText)
                        })), o.appendChild(n)
                    }, i = 0; i < this.lastMessages.length; i += 1) a(i);
                n.appendChild(o)
            }
        }, {
            key: "modifyMessage",
            value: function() {
                var e = this.inputField.value,
                    t = [e];
                this.lastMessages = t.concat(this.lastMessages), this.lastMessages.length > 5 && this.lastMessages.pop(), this.displayLastMessages();
                var n = function(e) {
                    var t = e,
                        n = !1,
                        o = e.match(/^\/[(\w)]+ ?/gi),
                        r = [/^\/[(\w)]+ ?/gi, /^\/[(\w)]+ [(\w)]+ ?/gi, /^\/[(\w)]+ [(\w)]+ [(\w)]+ ?/gi, /^\/[(\w)]+ [(\w)]+ [(\w)]+ [(\w)]+ ?/gi, /^\/[(\w)]+ [(\w)]+ [(\w)]+ [(\w)]+ [(\w)]+ ?/gi];
                    if (o)
                        for (var a = 0; a < v.length; a += 1)
                            if (v[a].command.indexOf(o[0].trim()) > -1) {
                                var i = t.match(r[v[a].args]);
                                if (i) {
                                    n = !0;
                                    var c = t.replace(i[0].trim(), "");
                                    t = v[a].func(c.trim())
                                } else console.warn("TODO: multiWordCommand")
                            } return [t, n]
                }(e);

                if (this.config.features.autoColorQuotes && !n[1]) {
  e = C(n, 1)[0];
  e = e.replace(/#(.*?)#/g, '"[color='.concat(this.config.chat.quotedTextColor2, ']$1[/color]"'));
  e = e.replace(/"(?!\[color=)(.*?)"/g, '"[color='.concat(this.config.chat.quotedTextColor, ']$1[/color]"'));
  e = e.replace(/@(.*?)@/g, '"[color='.concat(this.config.chat.quotedTextColor3, ']$1[/color]"'));
                  return e;
} else {
  return n[0];
}
            }
        }, {
            key: "handleMouseClick",
            value: function(e) {
                e.preventDefault();
                var t = this.modifyMessage();
                this.inputField.value = t, this.config.features.debugMode || ajaxChat.sendMessage()
            }
        }, {
            key: "handleKeyDown",
            value: function(e) {
                if (13 === e.keyCode && !e.shiftKey) {
                    var t = this.modifyMessage();
                    this.inputField.value = t
                }
                this.config.features.debugMode || ajaxChat.handleInputFieldKeyDown(e)
            }
        }, {
            key: "handleKeyUp",
            value: function(e) {
                this.config.features.debugMode || ajaxChat.handleInputFieldKeyDown(e)
            }
        }]) && w(t.prototype, n), o && w(t, o), e
    }();

    function x(e, t) {
        for (var n = 0; n < t.length; n++) {
            var o = t[n];
            o.enumerable = o.enumerable || !1, o.configurable = !0, "value" in o && (o.writable = !0), Object.defineProperty(e, o.key, o)
        }
    }
    var E = function() {
            function e(t) {
                var n = this;
                ! function(e, t) {
                    if (!(e instanceof t)) throw new TypeError("Cannot call a class as a function")
                }(this, e), this.elem = t, this.elemPad = 15, this.hoverElem = document.createElement("img"),this.hoverElem.className="Imy", this.hoverElem.style.boxShadow = "0 0 5px #000", this.hoverElem.style.position = "absolute", this.hoverElem.style.top = "0", this.hoverElem.style.left = "0", this.hoverElem.style.maxWidth = "500px", this.hoverElem.style.maxHeight = "250px", this.hoverElem.style.zIndex = "99999", (this.elem.href.indexOf(".png") > -1 || this.elem.href.indexOf(".jpg") > -1) && (this.hoverElem.src = this.elem.href, this.elem.addEventListener("mouseenter", (function(e) {
                    n.mouseOverCallback(e)
                })), this.elem.addEventListener("mouseleave", (function() {
                    n.mouseOutCallback()
                })), this.elem.addEventListener("mousemove", (function(e) {
                    n.mouseMoveCallback(e)
                })))
            }
            var t, n, o;
            return t = e, (n = [{
                key: "rebindEvents",
                value: function() {
                    var e = this;
                    this.elem.addEventListener("mouseenter", (function(t) {
                        e.mouseOverCallback(t)
                    })), this.elem.addEventListener("mouseleave", (function() {
                        e.mouseOutCallback()
                    })), this.elem.addEventListener("mousemove", (function(t) {
                        e.mouseMoveCallback(t)
                    }))
                }
            }, {
                key: "mouseOverCallback",
                value: function(e) {
                    document.body.appendChild(this.hoverElem), e.clientY + this.hoverElem.clientHeight < window.screen.height ? this.hoverElem.style.top = "".concat(e.clientY + this.elemPad, "px") : this.hoverElem.style.top = "".concat(e.clientY - this.elemPad - this.hoverElem.clientHeight, "px"), e.clientX + this.hoverElem.clientWidth < window.screen.width ? this.hoverElem.style.left = "".concat(e.clientX + this.elemPad, "px") : this.hoverElem.style.left = "".concat(e.clientX - (window.screen.width - this.hoverElem.clientWidth), "px")
                }
            }, {
                key: "mouseOutCallback",
                value: function() {
                    document.body.removeChild(this.hoverElem)
                }
            }, {
                key: "mouseMoveCallback",
                value: function(e) {
                    e.clientY + this.hoverElem.clientHeight < window.screen.height ? this.hoverElem.style.top = "".concat(e.clientY + this.elemPad, "px") : this.hoverElem.style.top = "".concat(e.clientY - this.elemPad - this.hoverElem.clientHeight, "px"), e.clientX + this.hoverElem.clientWidth < window.screen.width ? this.hoverElem.style.left = "".concat(e.clientX + this.elemPad, "px") : this.hoverElem.style.left = "".concat(window.screen.width + (e.clientX - this.hoverElem.clientWidth), "px")
                }
            }]) && x(t.prototype, n), o && x(t, o), e
        }(),
        T = n(0),
        L = n.n(T);

    function B(e, t) {
        var n = e;
        if (t) var o = 0,
            r = setInterval((function() {
                window.requestAnimationFrame(a)
            }), 5);
        else n.style.opacity = "1";

        function a() {
            o >= 100 ? clearInterval(r) : (o += 1, n.style.opacity = "".concat(o / 100))
        }
    }

    function I(e, t, n, o, r, a, i) {
        try {
            var c = e[a](i),
                l = c.value
        } catch (e) {
            return void n(e)
        }
        c.done ? t(l) : Promise.resolve(l).then(o, r)
    }

    function S(e) {
        return function() {
            var t = this,
                n = arguments;
            return new Promise((function(o, r) {
                var a = e.apply(t, n);

                function i(e) {
                    I(a, o, r, i, c, "next", e)
                }

                function c(e) {
                    I(a, o, r, i, c, "throw", e)
                }
                i(void 0)
            }))
        }
    }

    function O() {
        return (O = S(L.a.mark((function e() {
            return L.a.wrap((function(e) {
                for (;;) switch (e.prev = e.next) {
                    case 0:
                        if (window.Notification) {
                            e.next = 2;
                            break
                        }
                        return e.abrupt("return", !1);
                    case 2:
                        if ("granted" !== Notification.permission) {
                            e.next = 4;
                            break
                        }
                        return e.abrupt("return", !0);
                    case 4:
                        return e.abrupt("return", Notification.requestPermission().then((function(e) {
                            return "granted" === e
                        })).catch((function(e) {
                            return console.error(e), !1
                        })));
                    case 5:
                    case "end":
                        return e.stop()
                }
            }), e)
        })))).apply(this, arguments)
    }

    function F(e, t, n, o) {
        var r = document.createElement("div");
        r.className = "notification-element", r.style.margin = "1em", r.style.backgroundColor = "#202020", r.style.padding = "0.5em 1em", r.style.borderRadius = "5px", r.style.boxShadow = "0 0 10px #222", r.addEventListener("click", (function() {
            ! function(e, t) {
                var n = e;
                if (t) var o = 100,
                    r = setInterval((function() {
                        window.requestAnimationFrame(a)
                    }), 5);
                else e && e.parentNode && e.parentNode.removeChild(e);

                function a() {
                    o <= 0 ? (clearInterval(r), e && e.parentNode && e.parentNode.removeChild(e)) : (o -= 1, n.style.opacity = "".concat(o / 100))
                }
            }(r, o)
        }));
        var a = document.createElement("div");
        a.className = "notification-sender", a.style.display = "flex", a.style.fontWeight = "bold";
        var i = document.createElement("div");
        i.innerText = e, a.appendChild(i);
        var c = document.createElement("div");
        c.innerText = n, c.style.margin = "0 0 0 auto", c.style.fontWeight = "normal", c.style.fontSize = "0.75em", a.appendChild(c), r.appendChild(a);
        var l = document.createElement("div");
        return l.className = "notification-message", l.innerText = t, r.appendChild(l), r
    }

    function M(e, t) {
        return function(e) {
            if (Array.isArray(e)) return e
        }(e) || function(e, t) {
            if ("undefined" == typeof Symbol || !(Symbol.iterator in Object(e))) return;
            var n = [],
                o = !0,
                r = !1,
                a = void 0;
            try {
                for (var i, c = e[Symbol.iterator](); !(o = (i = c.next()).done) && (n.push(i.value), !t || n.length !== t); o = !0);
            } catch (e) {
                r = !0, a = e
            } finally {
                try {
                    o || null == c.return || c.return()
                } finally {
                    if (r) throw a
                }
            }
            return n
        }(e, t) || function(e, t) {
            if (!e) return;
            if ("string" == typeof e) return N(e, t);
            var n = Object.prototype.toString.call(e).slice(8, -1);
            "Object" === n && e.constructor && (n = e.constructor.name);
            if ("Map" === n || "Set" === n) return Array.from(e);
            if ("Arguments" === n || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return N(e, t)
        }(e, t) || function() {
            throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.")
        }()
    }

    function N(e, t) {
        (null == t || t > e.length) && (t = e.length);
        for (var n = 0, o = new Array(t); n < t; n++) o[n] = e[n];
        return o
    }

    function j(e, t) {
        for (var n = 0; n < t.length; n++) {
            var o = t[n];
            o.enumerable = o.enumerable || !1, o.configurable = !0, "value" in o && (o.writable = !0), Object.defineProperty(e, o.key, o)
        }
    }
    var P = function() {
            function e(t, n, o) {
                var r = this;
                ! function(e, t) {
                    if (!(e instanceof t)) throw new TypeError("Cannot call a class as a function")
                }(this, e), this.config = t, this.chatList = document.getElementById("chatList"), this.imageHovers = [], this.observerOptions = {
                    childList: !0,
                    attributes: !0,
                    subtree: !0
                }, this.observer = new MutationObserver((function(e) {
                    r.chatMessageCallback(e)
                })), this.observer.observe(this.chatList, this.observerOptions), this.canNotify = n, this.windowFocused = o
            }
            var t, n, o;
            return t = e, (n = [{
                key: "sendNotification",
                value: async function(e, t, n) {
                    if (this.config.features.audioNotifications && this.config.player.play) {
                      this.config.player.play();
                    } else {
                      let tmp = new Audio('https://tfgames.site/phpbb3/chat/sounds/sound_1.mp3');
                      await tmp.play();
                    }

                    window.Notification && this.canNotify && this.config.features.notifications && !this.windowFocused && new Notification("TFGS New Message: ".concat(n, " ").concat(t), {
                        body: "".concat(e),
                        icon: "https://tfgames.site/favicon.ico"
                    })
                }
            }, {
                key: "applyImageHovering",
                value: function(e) {
                    if (this.config.features.imageHovering) {
                        for (var t = 0; t < this.imageHovers.length; t += 1) this.imageHovers[t].hoverElem && this.imageHovers[t].hoverElem.parentNode && this.imageHovers[t].hoverElem.parentNode.removeChild(this.imageHovers[t].hoverElem), this.imageHovers[t].elem && this.imageHovers[t].elem.parentNode ? this.imageHovers[t].rebindEvents() : (this.imageHovers.splice(t, 1), t -= 1);
                        for (var n = 0; n < e.length; n += 1) {
                            var o = e[n],
                                r = o.children[2];
                            "delete" === o.children[0].className && (r = M(o.children, 4)[3]);
                            for (var a = r.getElementsByTagName("a"), i = 0; i < a.length; i += 1) this.imageHovers.push(new E(a[i]))
                        }
                        for (var c = 0; c < this.imageHovers.length; c += 1)
                            for (var l = 0; l < this.imageHovers.length; l += 1)
                                if (this.imageHovers[c].elem === this.imageHovers[l].elem) {
                                    this.imageHovers.splice(c, 1), c = 0;
                                    break
                                }
                    }
                }
            }, {
                key: "chatMessageAdded",
                value: function(e) {
                    var t, n = e[e.length - 1];
                    if (n && n.parentNode && n instanceof HTMLElement) {
                        var o = n.children[2],
                            r = (t = new y(this.config.chat.backgroundColor)).getLuma();
                        o.className.indexOf("user") > -1 && ((o = o.nextSibling) instanceof HTMLElement || (o = o.nextSibling));
                        var a = o.getElementsByClassName("action");
                        if (a.length > 0 && (o = M(a, 1)[0]), o.getElementsByTagName("span").length > 0)
                            for (var i = o.getElementsByTagName("span"), c = 0; c < i.length; c += 1) {
                                var l = window.getComputedStyle(i[c]),
                                    s = (t = new y(l.getPropertyValue("color"))).getLuma();
                                r < 50 && s < 50 && (i[c].style.backgroundColor = t.getInvertedHexColor())
                            } else {
                                var d = window.getComputedStyle(o),
                                    u = (t = new y(d.getPropertyValue("color"))).getLuma();
                                r < 50 && u < 50 && (o.style.backgroundColor = t.getInvertedHexColor())
                            }
                        var h = n.children[1].innerText,
                            p = n.children[2].innerText,
                            m = n.children[0].innerText;
                        n.children[1], n.children[2], n.children[0], "delete" === n.children[0].className && (m = n.children[1].innerText, h = n.children[2].innerText, p = n.children[3].innerText, n.children[2], n.children[3], n.children[1]), this.applyImageHovering(e), this.sendNotification(p, h, m), n.getElementsByClassName("chatBot").length <= 0 ? (n.style.opacity = 0, B(n, this.windowFocused)) : (p.indexOf("enters the channel") > -1 || p.indexOf("leaves the channel") > -1 || p.indexOf("has been logged out") > -1 || p.indexOf("logs into the Chat") > -1 || p.indexOf("logs out of the Chat") > -1) && n && n.parentNode ? (this.config.features.hideChatbotLoginLogoutMessages && n.parentNode.removeChild(n), function(e, t, n, o) {
                            var r = F(e, t, n);
                            r.style.opacity = 0, document.getElementById("notification_container").appendChild(r), window.setTimeout((function() {
                                r && r.parentNode && r.parentNode.removeChild(r)
                            }), 1e4), B(r, o)
                        }(h, p, m, this.windowFocused)) : (n.style.opacity = 0, B(n, this.windowFocused))
                    }
                    const elems = document.getElementsByClassName('Imy');
                    for (let i = 0; i < elems.length; i++) {
                        elems[i].parentNode.removeChild(elems[i]);
                    }
                }
            }, {
                key: "chatMessageCallback",
                value: function(e) {
                    var t = this;
                    e.forEach((function(e) {
                        switch (e.type) {
                            case "childList":
                                t.chatMessageAdded(e.addedNodes)
                        }
                    }))
                }
            }]) && j(t.prototype, n), o && j(t, o), e
        }(),
        R = [
            ["It's free real estate", "https://i.imgur.com/kXt3rm7.gif"],
            ["Trump derp", "https://i.imgur.com/pEXIe9F.gif"],
            ["Glasses off, wtf", "https://i.imgur.com/YgKfE0F.gif"],
            ["The king", "https://i.imgur.com/3xMt9T5.gif"],
            ["Yeah, it's big brain time", "https://i.imgur.com/fsjqc7d.gif"],
            ["Do tell face", "https://i.imgur.com/NPOLcKB.gif"],
            ["Patrick star evil", "https://i.imgur.com/R4v98C6.gif"],
            ["Nom", "https://i.imgur.com/d1QNOqn.gif"],
            ["Face palm", "https://i.imgur.com/GIDVpQS.gif"],
            ["Booty shake", "https://i.imgur.com/muAYTxY.gif"],
            ["Waterdevil", "https://i.imgur.com/YRYpVx6.gif"],
            ["Eh", "https://i.imgur.com/lxe3TYh.gif"],
            ["LSD", "https://i.imgur.com/RTbIM9X.gif"],
            ["Self five!", "https://i.imgur.com/BX9IgaR.gif"],
            ["Shit's on fire yo", "https://i.imgur.com/RFYoImT.gif"],
            ["Rave bird", "https://i.imgur.com/Vc0FQvQ.gif"],
            ["Excuse me????", "https://i.imgur.com/sJe30Of.gif"],
            ["Shit's gonna need some big brain", "https://i.imgur.com/sOffkvn.gif"],
            ["MoNOply", "https://i.imgur.com/hfxClYo.png"],
            ["Doubtful", "https://i.imgur.com/mT1VpoW.png"],
            ["Panty party", "https://i.imgur.com/yElENo2.gif"],
            ["Meow bongos", "https://i.imgur.com/kO2LCKA.gif"],
            ["Liquorice", "https://i.imgur.com/uyYRQqw.gif"],
            ["Hmmmmm orbit", "https://i.imgur.com/30JVRj6.gif"],
            ["Eyebrow sexy", "https://i.imgur.com/PnLK3Xv.gif"],
            ["Zipit", "https://i.imgur.com/1xndojP.gif"],
            ["Tiny", "https://i.imgur.com/OG53a3K.gif"],
            ["?????", "https://i.imgur.com/wGDlGYd.gif"],
            ["Ah!", "https://i.imgur.com/Zfzj6sE.gif"],
            ["What?", "https://i.imgur.com/PGff4uo.gif"],
            ["Yes, calm", "https://i.imgur.com/8OcnQui.gif"],
            ["Drink the world away", "https://i.imgur.com/lh83cTl.gif"],
            ["Booty Shake", "https://i.imgur.com/PxegsNE.gif"]
        ];

    function H(e, t) {
        return function(e) {
            if (Array.isArray(e)) return e
        }(e) || function(e, t) {
            if ("undefined" == typeof Symbol || !(Symbol.iterator in Object(e))) return;
            var n = [],
                o = !0,
                r = !1,
                a = void 0;
            try {
                for (var i, c = e[Symbol.iterator](); !(o = (i = c.next()).done) && (n.push(i.value), !t || n.length !== t); o = !0);
            } catch (e) {
                r = !0, a = e
            } finally {
                try {
                    o || null == c.return || c.return()
                } finally {
                    if (r) throw a
                }
            }
            return n
        }(e, t) || function(e, t) {
            if (!e) return;
            if ("string" == typeof e) return A(e, t);
            var n = Object.prototype.toString.call(e).slice(8, -1);
            "Object" === n && e.constructor && (n = e.constructor.name);
            if ("Map" === n || "Set" === n) return Array.from(e);
            if ("Arguments" === n || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return A(e, t)
        }(e, t) || function() {
            throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.")
        }()
    }

    function A(e, t) {
        (null == t || t > e.length) && (t = e.length);
        for (var n = 0, o = new Array(t); n < t; n++) o[n] = e[n];
        return o
    }

    function D(e, t) {
        for (var n = 0; n < t.length; n++) {
            var o = t[n];
            o.enumerable = o.enumerable || !1, o.configurable = !0, "value" in o && (o.writable = !0), Object.defineProperty(e, o.key, o)
        }
    }

    function _() {
        var e = document.getElementById("imagesContainer");
        e && e.parentNode && e.parentNode.removeChild(e)
    }
    var Y = function() {
        function e() {
            ! function(e, t) {
                if (!(e instanceof t)) throw new TypeError("Cannot call a class as a function")
            }(this, e), this.images = R, this.containerGenerated = !1
        }
        var t, n, o;
        return t = e, (n = [{
            key: "createImagesButton",
            value: function() {
                var e = document.getElementById("emoticonsContainer"),
                    t = document.createElement("button");
                t.id = "imagesButton", t.className = "custom-button", t.innerText = "More", t.addEventListener("click", this.generateImagesContainer), e.appendChild(t)
            }
        }, {
            key: "generateImagesContainer",
            value: function() {
                if (this.containerGenerated) _(), this.containerGenerated = !1;
                else {
                    var e = document.createElement("div"),
                        t = document.getElementById("imagesButton").getClientRects()[0];
                    e.id = "imagesContainer", e.style.backgroundColor = "#202020", e.style.borderRadius = "5px", e.style.boxShadow = "0 0 5px #fff", e.style.height = "250px", e.style.left = "".concat(t.left, "px"), e.style.overflow = "auto", e.style.padding = "1em", e.style.position = "absolute", e.style.top = "".concat(t.top - 280, "px"), e.style.width = "270px", e.style.zIndex = "999";
                    for (let i = 0; i < R.length; i++) {
  const n = document.createElement('img');
  n.alt = R[i][0];
  n.src = R[i][1];
  n.width = "50";
  n.height = "50";
  n.addEventListener('click', () => {
    ajaxChat.insertText('[img]'.concat(R[i][1], '[/img]'));
    _();
    this.containerGenerated = false;
  });
  e.appendChild(n);
}
                    document.body.appendChild(e), this.containerGenerated = !0
                }
            }
        }]) && D(t.prototype, n), o && D(t, o), e
    }();

    function G(e) {
        var t = document.createElement("style");
        t.id = "custom_stylesheet", t.type = "text/css", t.innerHTML = function(e) {
            return "\n    body,\n    html {\n      overflow: hidden;\n    }\n    #content {\n      display: block;\n      font-family: ".concat(e.main.fontFamily, ";\n      position: relative;\n    }\n    #content a {\n      color: ").concat(e.main.linkColor, ";\n    }\n    #content #logoutButton,\n    .custom-button {\n      background: ").concat(e.buttons.backgroundColor, ";\n      border-radius: 5px;\n      color: ").concat(e.buttons.fontColor, ";\n      float: none;\n      font-family: ").concat(e.main.fontFamily, ";\n      margin: auto 1em auto 0;\n      padding: 0 1em;\n    }\n    #content #submitButton {\n      background: ").concat(e.buttons.backgroundColor, ";\n      border-radius: 5px;\n      color: ").concat(e.buttons.fontColor, ";\n      margin: 0;\n    }\n    #content #bbCodeContainer input {\n      background: ").concat(e.buttons.backgroundColor, ";\n      border-left: 0;\n      color: ").concat(e.buttons.fontColor, ";\n      margin: 0;\n    }\n    #content #bbCodeContainer input:first-child {\n      border-left: 1px solid ").concat(e.buttons.borderColor, ";\n      border-radius: 5px 0 0 5px;\n    }\n    #content #bbCodeContainer input:nth-last-child(2) {\n      border-left: 1px solid ").concat(e.buttons.borderColor, ";\n      border-radius: 0 5px 5px 0;\n    }\n    #content #logoutChannelInner {\n      margin: auto 0;\n    }\n    #content #statusIconContainer {\n      left: 0;\n      margin: 0 0 0 auto;\n      position: relative;\n      right: 0;\n      top: 0;\n    }\n    #content #inputFieldContainer #inputField {\n      color: ").concat(e.chatInput.fontColor, ";\n      font-family: ").concat(e.chatInput.fontFamily, ";\n    }\n    #content select {\n      color: ").concat(e.dropDownMenus.fontColor, ";\n      background: ").concat(e.dropDownMenus.backgroundColor, ";\n      border-radius: 5px;\n      font-family: ").concat(e.main.fontFamily, ";\n      height: 100% !important;\n    }\n    #content #emoticonsContainer {\n      background-color: transparent;\n    }\n    #content #headline {\n      background: ").concat(e.header.backgroundColor, ";\n      color: ").concat(e.header.fontColor, ";\n      display: block;\n      position: relative;\n    }\n    #content #logoutChannelContainer {\n      align-items: center;\n      display: flex;\n      left: 0;\n      margin: 1em 2em 0;\n      position: relative;\n      right: 0;\n      top: 0;\n    }\n    #content #mainPanelContainer {\n      bottom: 0;\n      display: flex;\n      left: 0;\n      margin: 1em 2em;\n      position: relative;\n      right: 0;\n      top: 0;\n    }\n    #content #chatList {\n      width: 100%;\n    }\n    #content #inputFieldContainer {\n      bottom: 0;\n      display: flex;\n      left: 0;\n      margin: 1em 2em;\n      position: relative;\n      right: 0;\n      top: 0;\n    }\n    .chat-buttons-container > div div {\n      bottom: 0 !important;\n      display: block !important;\n      left: 0 !important;\n      position: relative !important;\n      right: 0 !important;\n      top: 0 !important;\n    }\n    .chat-buttons-row {\n      display: flex;\n      margin: 0 2em;\n    }\n    #content #optionsContainer,\n    #content #submitButtonContainer {\n      margin: 0 0 0 auto;\n    }\n    #content #onlineListContainer #onlineList,\n    #content #settingsContainer #settingsList,\n    #content #helpContainer #helpList {\n      bottom: 0;\n      left: 0;\n      padding: 1em 0;\n      position: relative;\n      right: 0;\n      top: 0;\n    }\n    #content #onlineListContainer h3,\n    #content #settingsContainer h3,\n    #content #helpContainer h3 {\n      background-color: ").concat(e.header.backgroundColor, ";\n    }\n    #content #onlineListContainer {\n      float: none;\n    }\n    .ajax-chat {\n      background-color: ").concat(e.main.backgroundColor, ";\n    }\n    #content #chatList,#content #helpContainer,\n    #content #onlineListContainer,\n    #content #settingsContainer,\n    #content textarea,\n    #settingsList dl:nth-child(n),\n    #helpList dl:nth-child(n) {\n      background-color: ").concat(e.chat.backgroundColor, ";\n    }\n    #content .rowEven {\n      background-color: ").concat(e.chat.rowEvenBackgroundColor, ";\n    }\n    #content .rowOdd {\n      background-color: ").concat(e.chat.rowOddBackgroundColor, ";\n    }\n    #content .chatBot {\n      color: ").concat(e.chat.chatBotColor, ";\n    }\n    #content .user {\n      color: ").concat(e.chat.usernameColor, ";\n    }\n    #content #chatList span.dateTime {\n      color: ").concat(e.chat.dateTimeColor, ";\n    }\n    .action {\n      color: ").concat(e.chat.actionColor, ";\n    }\n    .chatBotMessage {\n      color: ").concat(e.chat.chatBotMessageColor, ";\n    }\n    .ajax-chat {\n      color: ").concat(e.chat.defaultChatColor, ";\n    }\n    #content #chatList a,\n    .ajax-chat a {\n      color: ").concat(e.chat.chatLinksColor, ";\n    }\n    #content textarea {\n      color: ").concat(e.chatInput.fontColor, ";\n    }\n    #content #chatList .rowEven.private,\n    #content #chatList .rowOdd.private {\n      background-color: ").concat(e.chat.pmBackgroundColor, ";\n    }\n    #content .moderator {\n      color: ").concat(e.chat.moderatorColor, ";\n    }\n    #content #settingsContainer,\n    #content #helpContainer {\n      margin: 0 1em 0 0;\n    }\n  ")
        }(e), document.getElementsByTagName("head")[0].appendChild(t)
    }

    function U(e) {
        var t = document.getElementById("custom_stylesheet");
        t.parentNode.removeChild(t), G(e), c(e)
    }

    function X(e, t) {
        var n = document.createElement("div");
        n.style.display = "flex", n.style.alignItems = "center";
        var o = document.createElement("label");
        o.for = e.for, o.innerText = e.innerText, n.appendChild(o);
        var r = document.createElement("input");
        return r.type = t.type, r.id = t.id, t.type.indexOf("checkbox") > -1 ? r.checked = t.value ? "checked" : "" : r.value = t.value, r.style.margin = "0 0 0 auto", t.listen && t.callback && r.addEventListener(t.listen, t.callback), n.appendChild(r), n
    }

    function Q(e) {
        var t = document.getElementById("customize_container");
        e.target === t && t.parentNode.removeChild(t)
    }

    function z(e, t) {
        for (var n = 0; n < t.length; n++) {
            var o = t[n];
            o.enumerable = o.enumerable || !1, o.configurable = !0, "value" in o && (o.writable = !0), Object.defineProperty(e, o.key, o)
        }
    }
    var W = function() {
            function e() {
                var t = this;
                ! function(e, t) {
                    if (!(e instanceof t)) throw new TypeError("Cannot call a class as a function")
                }(this, e), this.config = function(e) {
                        var t, n = l() ? l() : o,
                            r = e;
                        for (t in n) n[t] instanceof Object ? r[t] = a(a({}, o[t]), n[t]) : r[t] = n[t];
                        return r
                    }(o), this.canNotify = !1, this.windowFocused = !0, this.updates = new h(this.config), this.chatInput = new k(this.config), this.chat = new P(this.config), this.imageModule = new Y, this.config.features.notifications && function() {
                        return O.apply(this, arguments)
                    }().then((function(e) {
                        t.canNotify = e, t.chat.canNotify = e
                    })),
                    function() {
                        var e = document.createDocumentFragment(),
                            t = document.createElement("div");
                        t.className = "chat-buttons-row", t.appendChild(document.getElementById("emoticonsContainer")), t.appendChild(document.getElementById("submitButtonContainer")), e.appendChild(t);
                        var n = document.createElement("div");
                        n.className = "chat-buttons-row", n.appendChild(document.getElementById("bbCodeContainer")), n.appendChild(document.getElementById("optionsContainer")), e.appendChild(n);
                        var o = document.createElement("div");
                        o.className = "chat-buttons-container", o.id = "chat_buttons_container", o.appendChild(e);
                        var r = document.createDocumentFragment();
                        r.appendChild(document.getElementById("onlineListContainer")), document.getElementById("mainPanelContainer").appendChild(r);
                        var a = document.createDocumentFragment();
                        a.appendChild(document.getElementById("statusIconContainer")), document.getElementById("logoutChannelContainer").appendChild(a), document.getElementById("content").appendChild(o);
                        var i = document.createElement("div");
                        i.style.position = "fixed", i.style.right = "0", i.style.bottom = "0", i.id = "notification_container", document.body.appendChild(i)
                    }(), G(this.config), this.createCustomizeMenuButtons(), window.addEventListener("resize", d), window.addEventListener("focus", (function() {
                        t.windowFocusEvent()
                    })), window.addEventListener("blur", (function() {
                        t.windowBlurEvent()
                    })), window.setTimeout((function() {
                        d(), t.imageModule.createImagesButton(), t.chatInput.displayLastMessages()
                    }), 1e3)
            }
            var t, n, r;
            return t = e, (n = [{
                key: "windowFocusEvent",
                value: function() {
                    this.windowFocused = !0, this.chat.windowFocused = this.windowFocused
                }
            }, {
                key: "windowBlurEvent",
                value: function() {
                    this.windowFocused = !1, this.chat.windowFocused = this.windowFocused
                }
            }, {
                key: "createCustomizeMenuButtons",
                value: function() {
                    var e = this,
                        t = document.getElementById("logoutChannelContainer"),
                        n = document.createElement("button");
                    n.innerText = "Customize", n.style.background = "#202020", n.style.border = "1px solid #8a8a8a", n.style.borderRadius = "5px", n.style.color = "#fff", n.style.fontFamily = "'Source Code Pro', sans-serif", n.style.margin = "auto 1em auto 0", n.style.padding = "0 1em", n.addEventListener("click", (function() {
                        ! function(e) {
                            var t = document.createElement("div");
                            t.id = "customize_container", t.style.backgroundColor = "rgba(0, 0, 0, .5)", t.style.height = "100%", t.style.position = "absolute", t.style.top = "0", t.style.width = "100%", t.style.zIndex = "999", t.addEventListener("click", Q);
                            var n = document.createElement("div");
                            n.style.backgroundColor = "#202020", n.style.borderRadius = "5px", n.style.boxShadow = "0 0 5px #444", n.style.height = "75%", n.style.margin = "auto", n.style.maxWidth = "500px", n.style.overflow = "auto", n.style.padding = "1em 2em", n.style.width = "75%", n.style.transform = "translateY(calc(25% / 2))";
                            var o = document.createElement("div");
                            o.style.border = "1px solid #888", o.style.borderRadius = "5px", o.style.display = "block", o.style.margin = "1em 0 2em", o.style.padding = "0.5em 1em";
                            var r = document.createElement("label");
                            r.innerText = "Features", r.style.backgroundColor = "#202020", r.style.marginLeft = "1em", r.style.marginTop = "-1.25em", r.style.position = "absolute", o.appendChild(r);
                            var a = document.createElement("div");
                            a.style.border = "1px solid #888", a.style.borderRadius = "5px", a.style.display = "none", a.style.margin = "1em 0 2em", a.style.padding = "0.5em 1em";
                            var i = document.createElement("label");
                            i.innerText = "Main", i.style.backgroundColor = "#202020", i.style.marginLeft = "1em", i.style.marginTop = "-1.25em", i.style.position = "absolute", a.appendChild(i);
                            var l = document.createElement("div");
                            l.style.border = "1px solid #888", l.style.borderRadius = "5px", l.style.display = "none", l.style.margin = "2em 0", l.style.padding = "0.5em 1em";
                            var s = document.createElement("label");
                            s.innerText = "Header", s.style.backgroundColor = "#202020", s.style.marginLeft = "1em", s.style.marginTop = "-1.25em", s.style.position = "absolute", l.appendChild(s);
                            var d = document.createElement("div");
                            d.style.border = "1px solid #888", d.style.borderRadius = "5px", d.style.display = "none", d.style.margin = "2em 0", d.style.padding = "0.5em 1em";
                            var u = document.createElement("label");
                            u.innerText = "Chat", u.style.backgroundColor = "#202020", u.style.marginLeft = "1em", u.style.marginTop = "-1.25em", u.style.position = "absolute", d.appendChild(u);
                            var h = document.createElement("div");
                            h.style.border = "1px solid #888", h.style.borderRadius = "5px", h.style.display = "none", h.style.margin = "2em 0", h.style.padding = "0.5em 1em";
                            var p = document.createElement("label");
                            p.innerText = "Chat Input", p.style.backgroundColor = "#202020", p.style.marginLeft = "1em", p.style.marginTop = "-1.25em", p.style.position = "absolute", h.appendChild(p);
                            var m = document.createElement("div"),
                                g = document.createElement("div"),
                                f = X({
                                    for: "featureDebugMode",
                                    innerText: "Debug Mode (prevents sending messages)"
                                }, {
                                    type: "checkbox",
                                    id: "featureDebugMode",
                                    value: e.features.debugMode,
                                    listen: "change",
                                    callback: function(t) {
                                        var n = t.target.checked;
                                        e.features.debugMode = n, c(e)
                                    }
                                });
                            o.appendChild(f), o.appendChild(document.createElement("hr"));
                            var y = X({
                                for: "featureNotifications",
                                innerText: "Desktop Notifications"
                            }, {
                                type: "checkbox",
                                id: "desktopNotifications",
                                value: e.features.notifications,
                                listen: "change",
                                callback: function(t) {
                                    var n = t.target.checked;
                                    e.features.notifications = n, c(e)
                                }
                            });
                            o.appendChild(y), o.appendChild(document.createElement("hr"));
                            var y = X({
                              for: "featureAudioNotifications",
                              innerText: "Audio Notifications",
                            }, {
                              type: "checkbox",
                              id: "desktopAudioNotifications",
                              value: e.features.audioNotifications,
                              listen: 'change',
                              callback: function(t) {
                                var n = t.target.checked;
                                e.features.audioNotifications = n, c(e)
                              }
                            });
                            o.appendChild(y), o.appendChild(document.createElement("hr"));
                            var v = X({
                                for: "featureAutoColorQuotes",
                                innerText: "Auto Color Quotes"
                            }, {
                                type: "checkbox",
                                id: "featureAutoColorQuotes",
                                value: e.features.autoColorQuotes,
                                listen: "change",
                                callback: function(t) {
                                    var n = t.target.checked;
                                    e.features.autoColorQuotes = n, c(e)
                                }
                            });
                            o.appendChild(v), o.appendChild(document.createElement("hr"));
                            var C = X({
                                for: "featureShowYourColors",
                                innerText: "Show Your Colors (display your colors to other people)"
                            }, {
                                type: "checkbox",
                                id: "featureShowYourColors",
                                value: e.features.showYourColors,
                                listen: "change",
                                callback: function(t) {
                                    var n = t.target.checked;
                                    e.features.showYourColors = n, c(e)
                                }
                            });
                            o.appendChild(C), o.appendChild(document.createElement("hr"));
                            var b = X({
                                for: "featureHideChatbotLoginLogoutMessages",
                                innerText: "Hide Chatbot Login Logout Messages"
                            }, {
                                type: "checkbox",
                                id: "featureHideChatbotLoginLogoutMessages",
                                value: e.features.hideChatbotLoginLogoutMessages,
                                callback: function(t) {
                                    var n = t.target.checked;
                                    e.features.hideChatbotLoginLogoutMessages = n, c(e)
                                }
                            });
                            o.appendChild(b);
                            var w = X({
                                for: "mainBackgroundColor",
                                innerText: "Background Color"
                            }, {
                                type: "color",
                                id: "mainBackgroundColor",
                                value: e.main.backgroundColor,
                                listen: "change",
                                callback: function(t) {
                                    var n = t.target.value;
                                    e.main.backgroundColor = n, U(e)
                                }
                            });
                            a.appendChild(w), a.appendChild(document.createElement("hr"));
                            var k = X({
                                for: "mainFontColor",
                                innerText: "Font Color"
                            }, {
                                type: "color",
                                id: "mainFontColor",
                                value: e.chat.defaultChatColor,
                                listen: "change",
                                callback: function(t) {
                                    var n = document.getElementById("inputField"),
                                        o = t.target.value;
                                    n.value = "/color ".concat(o), ajaxChat.sendMessage(), e.chat.defaultChatColor = o, U(e)
                                }
                            });
                            a.appendChild(k), a.appendChild(document.createElement("hr"));
                            var x = X({
                                for: "mainLinkColor",
                                innerText: "Link Color"
                            }, {
                                type: "color",
                                id: "mainLinkColor",
                                value: e.main.linkColor,
                                listen: "change",
                                callback: function(t) {
                                    var n = t.target.value;
                                    e.main.linkColor = n, U(e)
                                }
                            });
                            a.appendChild(x), a.appendChild(document.createElement("hr"));
                            var E = X({
                                for: "mainFontFamily",
                                innerText: "Font Family"
                            }, {
                                type: "text",
                                id: "mainFontFamily",
                                value: e.main.fontFamily,
                                listen: "change",
                                callback: function(t) {
                                    var n = t.target.value;
                                    e.main.fontFamily = n, U(e)
                                }
                            });
                            a.appendChild(E);
                            var T = X({
                                for: "headerBackgroundColor",
                                innerText: "Background Color"
                            }, {
                                type: "color",
                                id: "headerBackgroundColor",
                                value: e.header.backgroundColor,
                                listen: "change",
                                callback: function(t) {
                                    var n = t.target.value;
                                    e.header.backgroundColor = n, U(e)
                                }
                            });
                            l.appendChild(T), l.appendChild(document.createElement("hr"));
                            var L = X({
                                for: "headerFontColor",
                                innerText: "Font Color"
                            }, {
                                type: "color",
                                id: "headerFontColor",
                                value: e.header.fontColor,
                                listen: "change",
                                callback: function(t) {
                                    var n = t.target.value;
                                    e.header.fontColor = n, U(e)
                                }
                            });
                            l.appendChild(L);
                            var B = X({
                                for: "chatBackgroundColor",
                                innerText: "Background Color"
                            }, {
                                type: "color",
                                id: "chatBackgroundColor",
                                value: e.chat.backgroundColor,
                                listen: "change",
                                callback: function(t) {
                                    var n = t.target.value;
                                    e.chat.backgroundColor = n, U(e)
                                }
                            });
                            d.appendChild(B), d.appendChild(document.createElement("hr"));
                            var I = X({
                                for: "chatRowEvenBGColor",
                                innerText: "Row Even Background Color"
                            }, {
                                type: "color",
                                id: "chatRowEvenBGColor",
                                value: e.chat.rowEvenBackgroundColor,
                                listen: "change",
                                callback: function(t) {
                                    var n = t.target.value;
                                    e.chat.rowEvenBackgroundColor = n, U(e)
                                }
                            });
                            d.appendChild(I), d.appendChild(document.createElement("hr"));
                            var S = X({
                                for: "chatRowOddBGColor",
                                innerText: "Row Odd Background Color"
                            }, {
                                type: "color",
                                id: "chatRowOddBGColor",
                                value: e.chat.rowOddBackgroundColor,
                                listen: "change",
                                callback: function(t) {
                                    var n = t.target.value;
                                    e.chat.rowOddBackgroundColor = n, U(e)
                                }
                            });
                            d.appendChild(S), d.appendChild(document.createElement("hr"));
                            var O = X({
                                for: "chatQuoteColor",
                                innerText: "Chat Quote Color"
                            }, {
                                type: "color",
                                id: "chatQuoteColor",
                                value: e.chat.quotedTextColor,
                                listen: "change",
                                callback: function(t) {
                                    var n = t.target.value;
                                    e.chat.quotedTextColor = n, U(e)
                                }
                            });
							d.appendChild(O), d.appendChild(document.createElement("hr"));
                            var Ot = X({
                                for: "chatQuoteColor2",
                                innerText: "Chat Quote Color 2 "
                            }, {
                                type: "color",
                                id: "chatQuoteColor2",
                                value: e.chat.quotedTextColor2,
                                listen: "change",
                                callback: function(t) {
                                    var n = t.target.value;
                                    e.chat.quotedTextColor2 = n, U(e)
                                }
                            });
                            d.appendChild(Ot), d.appendChild(document.createElement("hr"));
                          var Oy = X({
                                for: "chatQuoteColor3",
                                innerText: "Chat Quote Color 3 @"
                            }, {
                                type: "color",
                                id: "chatQuoteColor3",
                                value: e.chat.quotedTextColor3,
                                listen: "change",
                                callback: function(t) {
                                    var n = t.target.value;
                                    e.chat.quotedTextColor3 = n, U(e)
                                }
                            });
                            d.appendChild(Oy), d.appendChild(document.createElement("hr"));
                            var F = X({
                                for: "chatBotColor",
                                innerText: "Chat Bot Color"
                            }, {
                                type: "color",
                                id: "chatBotColor",
                                value: e.chat.chatBotColor,
                                listen: "change",
                                callback: function(t) {
                                    var n = t.target.value;
                                    e.chat.chatBotColor = n, U(e)
                                }
                            });
                            d.appendChild(F), d.appendChild(document.createElement("hr"));
                            var M = X({
                                for: "usernameColor",
                                innerText: "Username Color"
                            }, {
                                type: "color",
                                id: "usernameColor",
                                value: e.chat.usernameColor,
                                listen: "change",
                                callback: function(t) {
                                    var n = t.target.value;
                                    e.chat.usernameColor = n, U(e)
                                }
                            });
                            d.appendChild(M), d.appendChild(document.createElement("hr"));
                            var N = X({
                                for: "dateTimeColor",
                                innerText: "Date Time Color"
                            }, {
                                type: "color",
                                id: "dateTimeColor",
                                value: e.chat.dateTimeColor,
                                listen: "change",
                                callback: function(t) {
                                    var n = t.target.value;
                                    e.chat.dateTimeColor = n, U(e)
                                }
                            });
                            d.appendChild(N), d.appendChild(document.createElement("hr"));
                            var j = X({
                                for: "actionColor",
                                innerText: "Action Color"
                            }, {
                                type: "color",
                                id: "actionColor",
                                value: e.chat.actionColor,
                                listen: "change",
                                callback: function(t) {
                                    var n = t.target.value;
                                    e.chat.actionColor = n, U(e)
                                }
                            });
                            d.appendChild(j), d.appendChild(document.createElement("hr"));
                            var P = X({
                                for: "chatBotMsgColor",
                                innerText: "Chat Bot Message Color"
                            }, {
                                type: "color",
                                id: "chatBotMsgColor",
                                value: e.chat.chatBotMessageColor,
                                listen: "change",
                                callback: function(t) {
                                    var n = t.target.value;
                                    e.chat.chatBotMessageColor = n, U(e)
                                }
                            });
                            d.appendChild(P), d.appendChild(document.createElement("hr"));
                            var R = X({
                                for: "chatLinksColor",
                                innerText: "Chat Links Color"
                            }, {
                                type: "color",
                                id: "chatLinksColor",
                                value: e.chat.chatLinksColor,
                                listen: "change",
                                callback: function(t) {
                                    var n = t.target.value;
                                    e.chat.chatLinksColor = n, U(e)
                                }
                            });
                            d.appendChild(R), d.appendChild(document.createElement("hr"));
                            var H = X({
                                for: "chatPMColor",
                                innerText: "PM Background Color"
                            }, {
                                type: "color",
                                id: "chatPMColor",
                                value: e.chat.pmBackgroundColor,
                                listen: "change",
                                callback: function(t) {
                                    var n = t.target.value;
                                    e.chat.pmBackgroundColor = n, U(e)
                                }
                            });
                            d.appendChild(H), d.appendChild(document.createElement("hr"));
                            var A = X({
                                for: "chatModeratorColor",
                                innerText: "Moderator Color"
                            }, {
                                type: "color",
                                id: "chatModeratorColor",
                                value: e.chat.moderatorColor,
                                listen: "change",
                                callback: function(t) {
                                    var n = t.target.value;
                                    e.chat.moderatorColor = n, U(e)
                                }
                            });
                            d.appendChild(A);
                            var D = X({
                                for: "chatInputBackgroundColor",
                                innerText: "Background Color"
                            }, {
                                type: "color",
                                id: "chatInputBackgroundColor",
                                value: e.chatInput.backgroundColor,
                                listen: "change",
                                callback: function(t) {
                                    var n = t.target.value;
                                    e.chatInput.backgroundColor = n, U(e)
                                }
                            });
                            h.appendChild(D), h.appendChild(document.createElement("hr"));
                            var _ = X({
                                for: "chatInputFontColor",
                                innerText: "Font Color"
                            }, {
                                type: "color",
                                id: "chatInputFontColor",
                                value: e.chatInput.fontColor,
                                listen: "change",
                                callback: function(t) {
                                    var n = t.target.value;
                                    e.chatInput.fontColor = n, U(e)
                                }
                            });
                            h.appendChild(_), h.appendChild(document.createElement("hr"));
                            var Y = X({
                                for: "chatInputFontFamily",
                                innerText: "Font Family"
                            }, {
                                type: "text",
                                id: "chatInputFontFamily",
                                value: e.chatInput.fontFamily,
                                listen: "change",
                                callback: function(t) {
                                    var n = t.target.value;
                                    e.chatInput.fontFamily = n, U(e)
                                }
                            });
                            h.appendChild(Y);
                            var G = function() {
                                    for (var e = n.children, t = 0; t < e.length; t += 1) e[t].id.indexOf("tabsBar") <= -1 && (e[t].style.display = "none")
                                },
                                z = document.createElement("div");
                            z.id = "tabsBar";
                            var W = document.createElement("span");
                            W.innerText = "Features", W.style.borderLeft = "1px solid ".concat(e.chat.defaultChatColor), W.style.borderRadius = "5px 5px 0 0", W.style.borderRight = "1px solid ".concat(e.chat.defaultChatColor), W.style.borderTop = "1px solid ".concat(e.chat.defaultChatColor), W.style.cursor = "pointer", W.style.padding = "0 0.5em", W.addEventListener("click", (function() {
                                G(), o.style.display = "block"
                            })), z.appendChild(W);
                            var q = document.createElement("span");
                            q.innerText = "Main Style", q.style.borderRadius = "0 5px 0 0", q.style.borderRight = "1px solid ".concat(e.chat.defaultChatColor), q.style.borderTop = "1px solid ".concat(e.chat.defaultChatColor), q.style.cursor = "pointer", q.style.padding = "0 0.5em", q.addEventListener("click", (function() {
                                G(), a.style.display = "block"
                            })), z.appendChild(q);
                            var V = document.createElement("span");
                            V.innerText = "Header Style", V.style.borderRadius = "0 5px 0 0", V.style.borderRight = "1px solid ".concat(e.chat.defaultChatColor), V.style.borderTop = "1px solid ".concat(e.chat.defaultChatColor), V.style.cursor = "pointer", V.style.padding = "0 0.5em", V.addEventListener("click", (function() {
                                G(), l.style.display = "block"
                            })), z.appendChild(V);
                            var K = document.createElement("span");
                            K.innerText = "Chat Style", K.style.borderRadius = "0 5px 0 0", K.style.borderRight = "1px solid ".concat(e.chat.defaultChatColor), K.style.borderTop = "1px solid ".concat(e.chat.defaultChatColor), K.style.cursor = "pointer", K.style.padding = "0 0.5em 0", K.addEventListener("click", (function() {
                                G(), d.style.display = "block"
                            })), z.appendChild(K);
                            var $ = document.createElement("span");
                            $.innerText = "Chat Input Style", $.style.borderRadius = "0 5px 0 0", $.style.borderRight = "1px solid ".concat(e.chat.defaultChatColor), $.style.borderTop = "1px solid ".concat(e.chat.defaultChatColor), $.style.cursor = "pointer", $.style.padding = "0 0.5em", $.addEventListener("click", (function() {
                                G(), h.style.display = "block"
                            })), z.appendChild($), n.appendChild(z), n.appendChild(o), n.appendChild(a), n.appendChild(l), n.appendChild(d), n.appendChild(h), n.appendChild(m), n.appendChild(g), t.appendChild(n), document.body.appendChild(t)
                        }(e.config), e.chat.canNotify = e.config.features.notifications
                    })), t.prepend(n)
                }
            }]) && z(t.prototype, n), r && z(t, r), e
        }(),
        q = 2,
        V = 0,
        K = 1,
        $ = document.getElementById("headline");
    $.innerText = "".concat($.innerText, " ").concat(q, ".").concat(V, ".").concat(K);
    new W
}]);
