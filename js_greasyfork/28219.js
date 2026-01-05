// ==UserScript==
// @name            Dirty/Lepra Modular SP
// @author          crimaniak
// @namespace       http://dirty.ru/
// @description     Dirty/Lepra Modular Service Pack. Core manage extensions settings and provide jQuery service.
// @include         http://leprosorium.ru/*
// @include         http://*.leprosorium.ru/*
// @include         http://d3.ru/*
// @include         http://*.d3.ru/*
// @include         http://dirty.ru/*
// @include         http://*.dirty.ru/*
// @include         https://leprosorium.ru/*
// @include         https://*.leprosorium.ru/*
// @include         https://leprosorium.com/*
// @include         https://*.leprosorium.com/*
// @include         http://leprosorium.com/*
// @include         http://*.leprosorium.com/*
// @include         https://d3.ru/*
// @include         https://*.d3.ru/*
// @include         https://dirty.ru/*
// @include         https://*.dirty.ru/*
// @include         https://www.reddit.com/*
// @include         https://habrahabr.ru/*
// @include         https://geektimes.ru/*
// @run-at          document-end
// @all_frames      true
// @version         2017-03-17 12:48:48
// @downloadURL https://update.greasyfork.org/scripts/28219/DirtyLepra%20Modular%20SP.user.js
// @updateURL https://update.greasyfork.org/scripts/28219/DirtyLepra%20Modular%20SP.meta.js
// ==/UserScript==
(function(a, b) {
    function cy(a) {
        return f.isWindow(a) ? a : a.nodeType === 9 ? a.defaultView || a.parentWindow : !1

    }

    function cu(a) {
        if (!cj[a]) {
            var b = c.body,
                d = f("<" + a + ">").appendTo(b),
                e = d.css("display");
            d.remove();
            if (e === "none" || e === "") {
                ck || (ck = c.createElement("iframe"), ck.frameBorder = ck.width = ck.height = 0), b.appendChild(ck);
                if (!cl || !ck.createElement)
                    cl = (ck.contentWindow || ck.contentDocument).document,
                    cl.write((f.support.boxModel ? "<!doctype html>" : "") + "<html><body>"), cl.close();
                d = cl.createElement(a), cl.body.appendChild(d), e = f.css(d, "display"), b.removeChild(ck)
            }
            cj[a] = e

        }

        return cj[a]
    }

    function ct(a, b) {
        var c = {};
        f.each(cp.concat.apply([], cp.slice(0, b)), function() {
            c[this] = a
        });
        return c
    }

    function cs() {
        cq = b
    }

    function cr() {
        setTimeout(cs, 0);
        return cq = f.now()
    }

    function ci() {
        try {
            return new a.ActiveXObject("Microsoft.XMLHTTP")
        } catch (b) {}
    }

    function ch() {
        try {
            return new a.XMLHttpRequest
        } catch (b) {}
    }

    function cb(a, c) {
        a.dataFilter && (c = a.dataFilter(c, a.dataType));
        var d = a.dataTypes,
            e = {},
            g, h, i = d.length,
            j, k = d[0],
            l, m, n, o, p;
        for (g = 1; g < i; g++) {
            if (g === 1)
                for (h in a.converters) typeof h == "string" && (e[h.toLowerCase()] = a.converters[h]);
            l = k, k = d[g];
            if (k === "*") k = l;
            else if (l !== "*" && l !== k) {
                m = l + " " + k, n = e[m] || e["* " + k];
                if (!n) {
                    p = b;
                    for (o in e) {
                        j = o.split(" ");
                        if (j[0] === l || j[0] === "*") {
                            p = e[j[1] + " " + k];
                            if (p) {
                                o = e[o], o === !0 ? n = p : p === !0 && (n = o);
                                break
                            }
                        }
                    }
                }!n && !p && f.error("No conversion from " + m.replace(" ", " to ")), n !== !0 && (c = n ? n(c) : p(o(c)))
            }
        }
        return c
    }

    function ca(a, c, d) {
        var e = a.contents,
            f = a.dataTypes,
            g = a.responseFields,
            h, i, j, k;
        for (i in g) i in d && (c[g[i]] = d[i]);
        while (f[0] === "*") f.shift(), h === b && (h = a.mimeType || c.getResponseHeader("content-type"));
        if (h)
            for (i in e)
                if (e[i] && e[i].test(h)) {
                    f.unshift(i);
                    break
                }
        if (f[0] in d) j = f[0];
        else {
            for (i in d) {
                if (!f[0] || a.converters[i + " " + f[0]]) {
                    j = i;
                    break
                }
                k || (k = i)
            }
            j = j || k
        }
        if (j) {
            j !== f[0] && f.unshift(j);
            return d[j]
        }
    }

    function b_(a, b, c, d) {
        if (f.isArray(b)) f.each(b, function(b, e) {
            c || bD.test(a) ? d(a, e) : b_(a + "[" + (typeof e == "object" ? b : "") + "]", e, c, d)
        });
        else if (!c && f.type(b) === "object")
            for (var e in b) b_(a + "[" + e + "]", b[e], c, d);
        else d(a, b)
    }

    function b$(a, c) {
        var d, e, g = f.ajaxSettings.flatOptions || {};
        for (d in c) c[d] !== b && ((g[d] ? a : e || (e = {}))[d] = c[d]);
        e && f.extend(!0, a, e)
    }

    function bZ(a, c, d, e, f, g) {
        f = f || c.dataTypes[0], g = g || {}, g[f] = !0;
        var h = a[f],
            i = 0,
            j = h ? h.length : 0,
            k = a === bS,
            l;
        for (; i < j && (k || !l); i++) l = h[i](c, d, e), typeof l == "string" && (!k || g[l] ? l = b : (c.dataTypes.unshift(l), l = bZ(a, c, d, e, l, g)));
        (k || !l) && !g["*"] && (l = bZ(a, c, d, e, "*", g));
        return l
    }

    function bY(a) {
        return function(b, c) {
            typeof b != "string" && (c = b, b = "*");
            if (f.isFunction(c)) {
                var d = b.toLowerCase().split(bO),
                    e = 0,
                    g = d.length,
                    h, i, j;
                for (; e < g; e++) h = d[e], j = /^\+/.test(h), j && (h = h.substr(1) || "*"), i = a[h] = a[h] || [], i[j ? "unshift" : "push"](c)
            }
        }
    }

    function bB(a, b, c) {
        var d = b === "width" ? a.offsetWidth : a.offsetHeight,
            e = b === "width" ? 1 : 0,
            g = 4;
        if (d > 0) {
            if (c !== "border")
                for (; e < g; e += 2) c || (d -= parseFloat(f.css(a, "padding" + bx[e])) || 0), c === "margin" ? d += parseFloat(f.css(a, c + bx[e])) || 0 : d -= parseFloat(f.css(a, "border" + bx[e] + "Width")) || 0;
            return d + "px"
        }
        d = by(a, b);
        if (d < 0 || d == null) d = a.style[b];
        if (bt.test(d)) return d;
        d = parseFloat(d) || 0;
        if (c)
            for (; e < g; e += 2) d += parseFloat(f.css(a, "padding" + bx[e])) || 0, c !== "padding" && (d += parseFloat(f.css(a, "border" + bx[e] + "Width")) || 0), c === "margin" && (d += parseFloat(f.css(a, c + bx[e])) || 0);
        return d + "px"
    }

    function bo(a) {
        var b = c.createElement("div");
        bh.appendChild(b), b.innerHTML = a.outerHTML;
        return b.firstChild
    }

    function bn(a) {
        var b = (a.nodeName || "").toLowerCase();
        b === "input" ? bm(a) : b !== "script" && typeof a.getElementsByTagName != "undefined" && f.grep(a.getElementsByTagName("input"), bm)
    }

    function bm(a) {
        if (a.type === "checkbox" || a.type === "radio") a.defaultChecked = a.checked
    }

    function bl(a) {
        return typeof a.getElementsByTagName != "undefined" ? a.getElementsByTagName("*") : typeof a.querySelectorAll != "undefined" ? a.querySelectorAll("*") : []
    }

    function bk(a, b) {
        var c;
        b.nodeType === 1 && (b.clearAttributes && b.clearAttributes(), b.mergeAttributes && b.mergeAttributes(a), c = b.nodeName.toLowerCase(), c === "object" ? b.outerHTML = a.outerHTML : c !== "input" || a.type !== "checkbox" && a.type !== "radio" ? c === "option" ? b.selected = a.defaultSelected : c === "input" || c === "textarea" ? b.defaultValue = a.defaultValue : c === "script" && b.text !== a.text && (b.text = a.text) : (a.checked && (b.defaultChecked = b.checked = a.checked), b.value !== a.value && (b.value = a.value)), b.removeAttribute(f.expando), b.removeAttribute("_submit_attached"), b.removeAttribute("_change_attached"))
    }

    function bj(a, b) {
        if (b.nodeType === 1 && !!f.hasData(a)) {
            var c, d, e, g = f._data(a),
                h = f._data(b, g),
                i = g.events;
            if (i) {
                delete h.handle, h.events = {};
                for (c in i)
                    for (d = 0, e = i[c].length; d < e; d++) f.event.add(b, c, i[c][d])
            }
            h.data && (h.data = f.extend({}, h.data))
        }
    }

    function bi(a, b) {
        return f.nodeName(a, "table") ? a.getElementsByTagName("tbody")[0] || a.appendChild(a.ownerDocument.createElement("tbody")) : a
    }

    function U(a) {
        var b = V.split("|"),
            c = a.createDocumentFragment();
        if (c.createElement)
            while (b.length) c.createElement(b.pop());
        return c
    }

    function T(a, b, c) {
        b = b || 0;
        if (f.isFunction(b)) return f.grep(a, function(a, d) {
            var e = !!b.call(a, d, a);
            return e === c
        });
        if (b.nodeType) return f.grep(a, function(a, d) {
            return a === b === c
        });
        if (typeof b == "string") {
            var d = f.grep(a, function(a) {
                return a.nodeType === 1
            });
            if (O.test(b)) return f.filter(b, d, !c);
            b = f.filter(b, d)
        }
        return f.grep(a, function(a, d) {
            return f.inArray(a, b) >= 0 === c
        })
    }

    function S(a) {
        return !a || !a.parentNode || a.parentNode.nodeType === 11
    }

    function K() {
        return !0
    }

    function J() {
        return !1
    }

    function n(a, b, c) {
        var d = b + "defer",
            e = b + "queue",
            g = b + "mark",
            h = f._data(a, d);
        h && (c === "queue" || !f._data(a, e)) && (c === "mark" || !f._data(a, g)) && setTimeout(function() {
            !f._data(a, e) && !f._data(a, g) && (f.removeData(a, d, !0), h.fire())
        }, 0)
    }

    function m(a) {
        for (var b in a) {
            if (b === "data" && f.isEmptyObject(a[b])) continue;
            if (b !== "toJSON") return !1
        }
        return !0
    }

    function l(a, c, d) {
        if (d === b && a.nodeType === 1) {
            var e = "data-" + c.replace(k, "-$1").toLowerCase();
            d = a.getAttribute(e);
            if (typeof d == "string") {
                try {
                    d = d === "true" ? !0 : d === "false" ? !1 : d === "null" ? null : f.isNumeric(d) ? +d : j.test(d) ? f.parseJSON(d) : d
                } catch (g) {}
                f.data(a, c, d)
            } else d = b
        }
        return d
    }

    function h(a) {
        var b = g[a] = {},
            c, d;
        a = a.split(/\s+/);
        for (c = 0, d = a.length; c < d; c++) b[a[c]] = !0;
        return b
    }
    var c = a.document,
        d = a.navigator,
        e = a.location,
        f = function() {
            function J() {
                if (!e.isReady) {
                    try {
                        c.documentElement.doScroll("left")
                    } catch (a) {
                        setTimeout(J, 1);
                        return
                    }
                    e.ready()
                }
            }
            var e = function(a, b) {
                    return new e.fn.init(a, b, h)
                },
                f = a.jQuery,
                g = a.$,
                h, i = /^(?:[^#<]*(<[\w\W]+>)[^>]*$|#([\w\-]*)$)/,
                j = /\S/,
                k = /^\s+/,
                l = /\s+$/,
                m = /^<(\w+)\s*\/?>(?:<\/\1>)?$/,
                n = /^[\],:{}\s]*$/,
                o = /\\(?:["\\\/bfnrt]|u[0-9a-fA-F]{4})/g,
                p = /"[^"\\\n\r]*"|true|false|null|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?/g,
                q = /(?:^|:|,)(?:\s*\[)+/g,
                r = /(webkit)[ \/]([\w.]+)/,
                s = /(opera)(?:.*version)?[ \/]([\w.]+)/,
                t = /(msie) ([\w.]+)/,
                u = /(mozilla)(?:.*? rv:([\w.]+))?/,
                v = /-([a-z]|[0-9])/ig,
                w = /^-ms-/,
                x = function(a, b) {
                    return (b + "").toUpperCase()
                },
                y = d.userAgent,
                z, A, B, C = Object.prototype.toString,
                D = Object.prototype.hasOwnProperty,
                E = Array.prototype.push,
                F = Array.prototype.slice,
                G = String.prototype.trim,
                H = Array.prototype.indexOf,
                I = {};
            e.fn = e.prototype = {
                constructor: e,
                init: function(a, d, f) {
                    var g, h, j, k;
                    if (!a) return this;
                    if (a.nodeType) {
                        this.context = this[0] = a, this.length = 1;
                        return this
                    }
                    if (a === "body" && !d && c.body) {
                        this.context = c, this[0] = c.body, this.selector = a, this.length = 1;
                        return this
                    }
                    if (typeof a == "string") {
                        a.charAt(0) !== "<" || a.charAt(a.length - 1) !== ">" || a.length < 3 ? g = i.exec(a) : g = [null, a, null];
                        if (g && (g[1] || !d)) {
                            if (g[1]) {
                                d = d instanceof e ? d[0] : d, k = d ? d.ownerDocument || d : c, j = m.exec(a), j ? e.isPlainObject(d) ? (a = [c.createElement(j[1])], e.fn.attr.call(a, d, !0)) : a = [k.createElement(j[1])] : (j = e.buildFragment([g[1]], [k]), a = (j.cacheable ? e.clone(j.fragment) : j.fragment).childNodes);
                                return e.merge(this, a)
                            }
                            h = c.getElementById(g[2]);
                            if (h && h.parentNode) {
                                if (h.id !== g[2]) return f.find(a);
                                this.length = 1, this[0] = h
                            }
                            this.context = c, this.selector = a;
                            return this
                        }
                        return !d || d.jquery ? (d || f).find(a) : this.constructor(d).find(a)
                    }
                    if (e.isFunction(a)) return f.ready(a);
                    a.selector !== b && (this.selector = a.selector, this.context = a.context);
                    return e.makeArray(a, this)
                },
                selector: "",
                jquery: "1.7.2",
                length: 0,
                size: function() {
                    return this.length
                },
                toArray: function() {
                    return F.call(this, 0)
                },
                get: function(a) {
                    return a == null ? this.toArray() : a < 0 ? this[this.length + a] : this[a]
                },
                pushStack: function(a, b, c) {
                    var d = this.constructor();
                    e.isArray(a) ? E.apply(d, a) : e.merge(d, a), d.prevObject = this, d.context = this.context, b === "find" ? d.selector = this.selector + (this.selector ? " " : "") + c : b && (d.selector = this.selector + "." + b + "(" + c + ")");
                    return d
                },
                each: function(a, b) {
                    return e.each(this, a, b)
                },
                ready: function(a) {
                    e.bindReady(), A.add(a);
                    return this
                },
                eq: function(a) {
                    a = +a;
                    return a === -1 ? this.slice(a) : this.slice(a, a + 1)
                },
                first: function() {
                    return this.eq(0)
                },
                last: function() {
                    return this.eq(-1)
                },
                slice: function() {
                    return this.pushStack(F.apply(this, arguments), "slice", F.call(arguments).join(","))
                },
                map: function(a) {
                    return this.pushStack(e.map(this, function(b, c) {
                        return a.call(b, c, b)
                    }))
                },
                end: function() {
                    return this.prevObject || this.constructor(null)
                },
                push: E,
                sort: [].sort,
                splice: [].splice
            }, e.fn.init.prototype = e.fn, e.extend = e.fn.extend = function() {
                var a, c, d, f, g, h, i = arguments[0] || {},
                    j = 1,
                    k = arguments.length,
                    l = !1;
                typeof i == "boolean" && (l = i, i = arguments[1] || {}, j = 2), typeof i != "object" && !e.isFunction(i) && (i = {}), k === j && (i = this, --j);
                for (; j < k; j++)
                    if ((a = arguments[j]) != null)
                        for (c in a) {
                            d = i[c], f = a[c];
                            if (i === f) continue;
                            l && f && (e.isPlainObject(f) || (g = e.isArray(f))) ? (g ? (g = !1, h = d && e.isArray(d) ? d : []) : h = d && e.isPlainObject(d) ? d : {}, i[c] = e.extend(l, h, f)) : f !== b && (i[c] = f)
                        }
                return i
            }, e.extend({
                noConflict: function(b) {
                    a.$ === e && (a.$ = g), b && a.jQuery === e && (a.jQuery = f);
                    return e
                },
                isReady: !1,
                readyWait: 1,
                holdReady: function(a) {
                    a ? e.readyWait++ : e.ready(!0)
                },
                ready: function(a) {
                    if (a === !0 && !--e.readyWait || a !== !0 && !e.isReady) {
                        if (!c.body) return setTimeout(e.ready, 1);
                        e.isReady = !0;
                        if (a !== !0 && --e.readyWait > 0) return;
                        A.fireWith(c, [e]), e.fn.trigger && e(c).trigger("ready").off("ready")
                    }
                },
                bindReady: function() {
                    if (!A) {
                        A = e.Callbacks("once memory");
                        if (c.readyState === "complete") return setTimeout(e.ready, 1);
                        if (c.addEventListener) c.addEventListener("DOMContentLoaded", B, !1), a.addEventListener("load", e.ready, !1);
                        else if (c.attachEvent) {
                            c.attachEvent("onreadystatechange", B), a.attachEvent("onload", e.ready);
                            var b = !1;
                            try {
                                b = a.frameElement == null
                            } catch (d) {}
                            c.documentElement.doScroll && b && J()
                        }
                    }
                },
                isFunction: function(a) {
                    return e.type(a) === "function"
                },
                isArray: Array.isArray || function(a) {
                    return e.type(a) === "array"
                },
                isWindow: function(a) {
                    return a != null && a == a.window
                },
                isNumeric: function(a) {
                    return !isNaN(parseFloat(a)) && isFinite(a)
                },
                type: function(a) {
                    return a == null ? String(a) : I[C.call(a)] || "object"
                },
                isPlainObject: function(a) {
                    if (!a || e.type(a) !== "object" || a.nodeType || e.isWindow(a)) return !1;
                    try {
                        if (a.constructor && !D.call(a, "constructor") && !D.call(a.constructor.prototype, "isPrototypeOf")) return !1
                    } catch (c) {
                        return !1
                    }
                    var d;
                    for (d in a);
                    return d === b || D.call(a, d)
                },
                isEmptyObject: function(a) {
                    for (var b in a) return !1;
                    return !0
                },
                error: function(a) {
                    throw new Error(a)
                },
                parseJSON: function(b) {
                    if (typeof b != "string" || !b) return null;
                    b = e.trim(b);
                    if (a.JSON && a.JSON.parse) return a.JSON.parse(b);
                    if (n.test(b.replace(o, "@").replace(p, "]").replace(q, ""))) return (new Function("return " + b))();
                    e.error("Invalid JSON: " + b)
                },
                parseXML: function(c) {
                    if (typeof c != "string" || !c) return null;
                    var d, f;
                    try {
                        a.DOMParser ? (f = new DOMParser, d = f.parseFromString(c, "text/xml")) : (d = new ActiveXObject("Microsoft.XMLDOM"), d.async = "false", d.loadXML(c))
                    } catch (g) {
                        d = b
                    }(!d || !d.documentElement || d.getElementsByTagName("parsererror").length) && e.error("Invalid XML: " + c);
                    return d
                },
                noop: function() {},
                globalEval: function(b) {
                    b && j.test(b) && (a.execScript || function(b) {
                        a.eval.call(a, b)
                    })(b)
                },
                camelCase: function(a) {
                    return a.replace(w, "ms-").replace(v, x)
                },
                nodeName: function(a, b) {
                    return a.nodeName && a.nodeName.toUpperCase() === b.toUpperCase()
                },
                each: function(a, c, d) {
                    var f, g = 0,
                        h = a.length,
                        i = h === b || e.isFunction(a);
                    if (d) {
                        if (i) {
                            for (f in a)
                                if (c.apply(a[f], d) === !1) break
                        } else
                            for (; g < h;)
                                if (c.apply(a[g++], d) === !1) break
                    } else if (i) {
                        for (f in a)
                            if (c.call(a[f], f, a[f]) === !1) break
                    } else
                        for (; g < h;)
                            if (c.call(a[g], g, a[g++]) === !1) break;
                    return a
                },
                trim: G ? function(a) {
                    return a == null ? "" : G.call(a)
                } : function(a) {
                    return a == null ? "" : (a + "").replace(k, "").replace(l, "")
                },
                makeArray: function(a, b) {
                    var c = b || [];
                    if (a != null) {
                        var d = e.type(a);
                        a.length == null || d === "string" || d === "function" || d === "regexp" || e.isWindow(a) ? E.call(c, a) : e.merge(c, a)
                    }
                    return c
                },
                inArray: function(a, b, c) {
                    var d;
                    if (b) {
                        if (H) return H.call(b, a, c);
                        d = b.length, c = c ? c < 0 ? Math.max(0, d + c) : c : 0;
                        for (; c < d; c++)
                            if (c in b && b[c] === a) return c
                    }
                    return -1
                },
                merge: function(a, c) {
                    var d = a.length,
                        e = 0;
                    if (typeof c.length == "number")
                        for (var f = c.length; e < f; e++) a[d++] = c[e];
                    else
                        while (c[e] !== b) a[d++] = c[e++];
                    a.length = d;
                    return a
                },
                grep: function(a, b, c) {
                    var d = [],
                        e;
                    c = !!c;
                    for (var f = 0, g = a.length; f < g; f++) e = !!b(a[f], f), c !== e && d.push(a[f]);
                    return d
                },
                map: function(a, c, d) {
                    var f, g, h = [],
                        i = 0,
                        j = a.length,
                        k = a instanceof e || j !== b && typeof j == "number" && (j > 0 && a[0] && a[j - 1] || j === 0 || e.isArray(a));
                    if (k)
                        for (; i < j; i++) f = c(a[i], i, d), f != null && (h[h.length] = f);
                    else
                        for (g in a) f = c(a[g], g, d), f != null && (h[h.length] = f);
                    return h.concat.apply([], h)
                },
                guid: 1,
                proxy: function(a, c) {
                    if (typeof c == "string") {
                        var d = a[c];
                        c = a, a = d
                    }
                    if (!e.isFunction(a)) return b;
                    var f = F.call(arguments, 2),
                        g = function() {
                            return a.apply(c, f.concat(F.call(arguments)))
                        };
                    g.guid = a.guid = a.guid || g.guid || e.guid++;
                    return g
                },
                access: function(a, c, d, f, g, h, i) {
                    var j, k = d == null,
                        l = 0,
                        m = a.length;
                    if (d && typeof d == "object") {
                        for (l in d) e.access(a, c, l, d[l], 1, h, f);
                        g = 1
                    } else if (f !== b) {
                        j = i === b && e.isFunction(f), k && (j ? (j = c, c = function(a, b, c) {
                            return j.call(e(a), c)
                        }) : (c.call(a, f), c = null));
                        if (c)
                            for (; l < m; l++) c(a[l], d, j ? f.call(a[l], l, c(a[l], d)) : f, i);
                        g = 1
                    }
                    return g ? a : k ? c.call(a) : m ? c(a[0], d) : h
                },
                now: function() {
                    return (new Date).getTime()
                },
                uaMatch: function(a) {
                    a = a.toLowerCase();
                    var b = r.exec(a) || s.exec(a) || t.exec(a) || a.indexOf("compatible") < 0 && u.exec(a) || [];
                    return {
                        browser: b[1] || "",
                        version: b[2] || "0"
                    }
                },
                sub: function() {
                    function a(b, c) {
                        return new a.fn.init(b, c)
                    }
                    e.extend(!0, a, this), a.superclass = this, a.fn = a.prototype = this(), a.fn.constructor = a, a.sub = this.sub, a.fn.init = function(d, f) {
                        f && f instanceof e && !(f instanceof a) && (f = a(f));
                        return e.fn.init.call(this, d, f, b)
                    }, a.fn.init.prototype = a.fn;
                    var b = a(c);
                    return a
                },
                browser: {}
            }), e.each("Boolean Number String Function Array Date RegExp Object".split(" "), function(a, b) {
                I["[object " + b + "]"] = b.toLowerCase()
            }), z = e.uaMatch(y), z.browser && (e.browser[z.browser] = !0, e.browser.version = z.version), e.browser.webkit && (e.browser.safari = !0), j.test(" ") && (k = /^[\s\xA0]+/, l = /[\s\xA0]+$/), h = e(c), c.addEventListener ? B = function() {
                c.removeEventListener("DOMContentLoaded", B, !1), e.ready()
            } : c.attachEvent && (B = function() {
                c.readyState === "complete" && (c.detachEvent("onreadystatechange", B), e.ready())
            });
            return e
        }(),
        g = {};
    f.Callbacks = function(a) {
        a = a ? g[a] || h(a) : {};
        var c = [],
            d = [],
            e, i, j, k, l, m, n = function(b) {
                var d, e, g, h, i;
                for (d = 0, e = b.length; d < e; d++) g = b[d], h = f.type(g), h === "array" ? n(g) : h === "function" && (!a.unique || !p.has(g)) && c.push(g)
            },
            o = function(b, f) {
                f = f || [], e = !a.memory || [b, f], i = !0, j = !0, m = k || 0, k = 0, l = c.length;
                for (; c && m < l; m++)
                    if (c[m].apply(b, f) === !1 && a.stopOnFalse) {
                        e = !0;
                        break
                    }
                j = !1, c && (a.once ? e === !0 ? p.disable() : c = [] : d && d.length && (e = d.shift(), p.fireWith(e[0], e[1])))
            },
            p = {
                add: function() {
                    if (c) {
                        var a = c.length;
                        n(arguments), j ? l = c.length : e && e !== !0 && (k = a, o(e[0], e[1]))
                    }
                    return this
                },
                remove: function() {
                    if (c) {
                        var b = arguments,
                            d = 0,
                            e = b.length;
                        for (; d < e; d++)
                            for (var f = 0; f < c.length; f++)
                                if (b[d] === c[f]) {
                                    j && f <= l && (l--, f <= m && m--), c.splice(f--, 1);
                                    if (a.unique) break
                                }
                    }
                    return this
                },
                has: function(a) {
                    if (c) {
                        var b = 0,
                            d = c.length;
                        for (; b < d; b++)
                            if (a === c[b]) return !0
                    }
                    return !1
                },
                empty: function() {
                    c = [];
                    return this
                },
                disable: function() {
                    c = d = e = b;
                    return this
                },
                disabled: function() {
                    return !c
                },
                lock: function() {
                    d = b, (!e || e === !0) && p.disable();
                    return this
                },
                locked: function() {
                    return !d
                },
                fireWith: function(b, c) {
                    d && (j ? a.once || d.push([b, c]) : (!a.once || !e) && o(b, c));
                    return this
                },
                fire: function() {
                    p.fireWith(this, arguments);
                    return this
                },
                fired: function() {
                    return !!i
                }
            };
        return p
    };
    var i = [].slice;
    f.extend({
        Deferred: function(a) {
            var b = f.Callbacks("once memory"),
                c = f.Callbacks("once memory"),
                d = f.Callbacks("memory"),
                e = "pending",
                g = {
                    resolve: b,
                    reject: c,
                    notify: d
                },
                h = {
                    done: b.add,
                    fail: c.add,
                    progress: d.add,
                    state: function() {
                        return e
                    },
                    isResolved: b.fired,
                    isRejected: c.fired,
                    then: function(a, b, c) {
                        i.done(a).fail(b).progress(c);
                        return this
                    },
                    always: function() {
                        i.done.apply(i, arguments).fail.apply(i, arguments);
                        return this
                    },
                    pipe: function(a, b, c) {
                        return f.Deferred(function(d) {
                            f.each({
                                done: [a, "resolve"],
                                fail: [b, "reject"],
                                progress: [c, "notify"]
                            }, function(a, b) {
                                var c = b[0],
                                    e = b[1],
                                    g;
                                f.isFunction(c) ? i[a](function() {
                                    g = c.apply(this, arguments), g && f.isFunction(g.promise) ? g.promise().then(d.resolve, d.reject, d.notify) : d[e + "With"](this === i ? d : this, [g])
                                }) : i[a](d[e])
                            })
                        }).promise()
                    },
                    promise: function(a) {
                        if (a == null) a = h;
                        else
                            for (var b in h) a[b] = h[b];
                        return a
                    }
                },
                i = h.promise({}),
                j;
            for (j in g) i[j] = g[j].fire, i[j + "With"] = g[j].fireWith;
            i.done(function() {
                e = "resolved"
            }, c.disable, d.lock).fail(function() {
                e = "rejected"
            }, b.disable, d.lock), a && a.call(i, i);
            return i
        },
        when: function(a) {
            function m(a) {
                return function(b) {
                    e[a] = arguments.length > 1 ? i.call(arguments, 0) : b, j.notifyWith(k, e)
                }
            }

            function l(a) {
                return function(c) {
                    b[a] = arguments.length > 1 ? i.call(arguments, 0) : c, --g || j.resolveWith(j, b)
                }
            }
            var b = i.call(arguments, 0),
                c = 0,
                d = b.length,
                e = Array(d),
                g = d,
                h = d,
                j = d <= 1 && a && f.isFunction(a.promise) ? a : f.Deferred(),
                k = j.promise();
            if (d > 1) {
                for (; c < d; c++) b[c] && b[c].promise && f.isFunction(b[c].promise) ? b[c].promise().then(l(c), j.reject, m(c)) : --g;
                g || j.resolveWith(j, b)
            } else j !== a && j.resolveWith(j, d ? [a] : []);
            return k
        }
    }), f.support = function() {
        var b, d, e, g, h, i, j, k, l, m, n, o, p = c.createElement("div"),
            q = c.documentElement;
        p.setAttribute("className", "t"), p.innerHTML = "   <link/><table></table><a href='/a' style='top:1px;float:left;opacity:.55;'>a</a><input type='checkbox'/>", d = p.getElementsByTagName("*"), e = p.getElementsByTagName("a")[0];
        if (!d || !d.length || !e) return {};
        g = c.createElement("select"), h = g.appendChild(c.createElement("option")), i = p.getElementsByTagName("input")[0], b = {
            leadingWhitespace: p.firstChild.nodeType === 3,
            tbody: !p.getElementsByTagName("tbody").length,
            htmlSerialize: !!p.getElementsByTagName("link").length,
            style: /top/.test(e.getAttribute("style")),
            hrefNormalized: e.getAttribute("href") === "/a",
            opacity: /^0.55/.test(e.style.opacity),
            cssFloat: !!e.style.cssFloat,
            checkOn: i.value === "on",
            optSelected: h.selected,
            getSetAttribute: p.className !== "t",
            enctype: !!c.createElement("form").enctype,
            html5Clone: c.createElement("nav").cloneNode(!0).outerHTML !== "<:nav></:nav>",
            submitBubbles: !0,
            changeBubbles: !0,
            focusinBubbles: !1,
            deleteExpando: !0,
            noCloneEvent: !0,
            inlineBlockNeedsLayout: !1,
            shrinkWrapBlocks: !1,
            reliableMarginRight: !0,
            pixelMargin: !0
        }, f.boxModel = b.boxModel = c.compatMode === "CSS1Compat", i.checked = !0, b.noCloneChecked = i.cloneNode(!0).checked, g.disabled = !0, b.optDisabled = !h.disabled;
        try {
            delete p.test
        } catch (r) {
            b.deleteExpando = !1
        }!p.addEventListener && p.attachEvent && p.fireEvent && (p.attachEvent("onclick", function() {
            b.noCloneEvent = !1
        }), p.cloneNode(!0).fireEvent("onclick")), i = c.createElement("input"), i.value = "t", i.setAttribute("type", "radio"), b.radioValue = i.value === "t", i.setAttribute("checked", "checked"), i.setAttribute("name", "t"), p.appendChild(i), j = c.createDocumentFragment(), j.appendChild(p.lastChild), b.checkClone = j.cloneNode(!0).cloneNode(!0).lastChild.checked, b.appendChecked = i.checked, j.removeChild(i), j.appendChild(p);
        if (p.attachEvent)
            for (n in {
                    submit: 1,
                    change: 1,
                    focusin: 1
                }) m = "on" + n, o = m in p, o || (p.setAttribute(m, "return;"), o = typeof p[m] == "function"), b[n + "Bubbles"] = o;
        j.removeChild(p), j = g = h = p = i = null, f(function() {
            var d, e, g, h, i, j, l, m, n, q, r, s, t, u = c.getElementsByTagName("body")[0];
            !u || (m = 1, t = "padding:0;margin:0;border:", r = "position:absolute;top:0;left:0;width:1px;height:1px;", s = t + "0;visibility:hidden;", n = "style='" + r + t + "5px solid #000;", q = "<div " + n + "display:block;'><div style='" + t + "0;display:block;overflow:hidden;'></div></div>" + "<table " + n + "' cellpadding='0' cellspacing='0'>" + "<tr><td></td></tr></table>", d = c.createElement("div"), d.style.cssText = s + "width:0;height:0;position:static;top:0;margin-top:" + m + "px", u.insertBefore(d, u.firstChild), p = c.createElement("div"), d.appendChild(p), p.innerHTML = "<table><tr><td style='" + t + "0;display:none'></td><td>t</td></tr></table>", k = p.getElementsByTagName("td"), o = k[0].offsetHeight === 0, k[0].style.display = "", k[1].style.display = "none", b.reliableHiddenOffsets = o && k[0].offsetHeight === 0, a.getComputedStyle && (p.innerHTML = "", l = c.createElement("div"), l.style.width = "0", l.style.marginRight = "0", p.style.width = "2px", p.appendChild(l), b.reliableMarginRight = (parseInt((a.getComputedStyle(l, null) || {
                marginRight: 0
            }).marginRight, 10) || 0) === 0), typeof p.style.zoom != "undefined" && (p.innerHTML = "", p.style.width = p.style.padding = "1px", p.style.border = 0, p.style.overflow = "hidden", p.style.display = "inline", p.style.zoom = 1, b.inlineBlockNeedsLayout = p.offsetWidth === 3, p.style.display = "block", p.style.overflow = "visible", p.innerHTML = "<div style='width:5px;'></div>", b.shrinkWrapBlocks = p.offsetWidth !== 3), p.style.cssText = r + s, p.innerHTML = q, e = p.firstChild, g = e.firstChild, i = e.nextSibling.firstChild.firstChild, j = {
                doesNotAddBorder: g.offsetTop !== 5,
                doesAddBorderForTableAndCells: i.offsetTop === 5
            }, g.style.position = "fixed", g.style.top = "20px", j.fixedPosition = g.offsetTop === 20 || g.offsetTop === 15, g.style.position = g.style.top = "", e.style.overflow = "hidden", e.style.position = "relative", j.subtractsBorderForOverflowNotVisible = g.offsetTop === -5, j.doesNotIncludeMarginInBodyOffset = u.offsetTop !== m, a.getComputedStyle && (p.style.marginTop = "1%", b.pixelMargin = (a.getComputedStyle(p, null) || {
                marginTop: 0
            }).marginTop !== "1%"), typeof d.style.zoom != "undefined" && (d.style.zoom = 1), u.removeChild(d), l = p = d = null, f.extend(b, j))
        });
        return b
    }();
    var j = /^(?:\{.*\}|\[.*\])$/,
        k = /([A-Z])/g;
    f.extend({
        cache: {},
        uuid: 0,
        expando: "jQuery" + (f.fn.jquery + Math.random()).replace(/\D/g, ""),
        noData: {
            embed: !0,
            object: "clsid:D27CDB6E-AE6D-11cf-96B8-444553540000",
            applet: !0
        },
        hasData: function(a) {
            a = a.nodeType ? f.cache[a[f.expando]] : a[f.expando];
            return !!a && !m(a)
        },
        data: function(a, c, d, e) {
            if (!!f.acceptData(a)) {
                var g, h, i, j = f.expando,
                    k = typeof c == "string",
                    l = a.nodeType,
                    m = l ? f.cache : a,
                    n = l ? a[j] : a[j] && j,
                    o = c === "events";
                if ((!n || !m[n] || !o && !e && !m[n].data) && k && d === b) return;
                n || (l ? a[j] = n = ++f.uuid : n = j), m[n] || (m[n] = {}, l || (m[n].toJSON = f.noop));
                if (typeof c == "object" || typeof c == "function") e ? m[n] = f.extend(m[n], c) : m[n].data = f.extend(m[n].data, c);
                g = h = m[n], e || (h.data || (h.data = {}), h = h.data), d !== b && (h[f.camelCase(c)] = d);
                if (o && !h[c]) return g.events;
                k ? (i = h[c], i == null && (i = h[f.camelCase(c)])) : i = h;
                return i
            }
        },
        removeData: function(a, b, c) {
            if (!!f.acceptData(a)) {
                var d, e, g, h = f.expando,
                    i = a.nodeType,
                    j = i ? f.cache : a,
                    k = i ? a[h] : h;
                if (!j[k]) return;
                if (b) {
                    d = c ? j[k] : j[k].data;
                    if (d) {
                        f.isArray(b) || (b in d ? b = [b] : (b = f.camelCase(b), b in d ? b = [b] : b = b.split(" ")));
                        for (e = 0, g = b.length; e < g; e++) delete d[b[e]];
                        if (!(c ? m : f.isEmptyObject)(d)) return
                    }
                }
                if (!c) {
                    delete j[k].data;
                    if (!m(j[k])) return
                }
                f.support.deleteExpando || !j.setInterval ? delete j[k] : j[k] = null, i && (f.support.deleteExpando ? delete a[h] : a.removeAttribute ? a.removeAttribute(h) : a[h] = null)
            }
        },
        _data: function(a, b, c) {
            return f.data(a, b, c, !0)
        },
        acceptData: function(a) {
            if (a.nodeName) {
                var b = f.noData[a.nodeName.toLowerCase()];
                if (b) return b !== !0 && a.getAttribute("classid") === b
            }
            return !0
        }
    }), f.fn.extend({
        data: function(a, c) {
            var d, e, g, h, i, j = this[0],
                k = 0,
                m = null;
            if (a === b) {
                if (this.length) {
                    m = f.data(j);
                    if (j.nodeType === 1 && !f._data(j, "parsedAttrs")) {
                        g = j.attributes;
                        for (i = g.length; k < i; k++) h = g[k].name, h.indexOf("data-") === 0 && (h = f.camelCase(h.substring(5)), l(j, h, m[h]));
                        f._data(j, "parsedAttrs", !0)
                    }
                }
                return m
            }
            if (typeof a == "object") return this.each(function() {
                f.data(this, a)
            });
            d = a.split(".", 2), d[1] = d[1] ? "." + d[1] : "", e = d[1] + "!";
            return f.access(this, function(c) {
                if (c === b) {
                    m = this.triggerHandler("getData" + e, [d[0]]), m === b && j && (m = f.data(j, a), m = l(j, a, m));
                    return m === b && d[1] ? this.data(d[0]) : m
                }
                d[1] = c, this.each(function() {
                    var b = f(this);
                    b.triggerHandler("setData" + e, d), f.data(this, a, c), b.triggerHandler("changeData" + e, d)
                })
            }, null, c, arguments.length > 1, null, !1)
        },
        removeData: function(a) {
            return this.each(function() {
                f.removeData(this, a)
            })
        }
    }), f.extend({
        _mark: function(a, b) {
            a && (b = (b || "fx") + "mark", f._data(a, b, (f._data(a, b) || 0) + 1))
        },
        _unmark: function(a, b, c) {
            a !== !0 && (c = b, b = a, a = !1);
            if (b) {
                c = c || "fx";
                var d = c + "mark",
                    e = a ? 0 : (f._data(b, d) || 1) - 1;
                e ? f._data(b, d, e) : (f.removeData(b, d, !0), n(b, c, "mark"))
            }
        },
        queue: function(a, b, c) {
            var d;
            if (a) {
                b = (b || "fx") + "queue", d = f._data(a, b), c && (!d || f.isArray(c) ? d = f._data(a, b, f.makeArray(c)) : d.push(c));
                return d || []
            }
        },
        dequeue: function(a, b) {
            b = b || "fx";
            var c = f.queue(a, b),
                d = c.shift(),
                e = {};
            d === "inprogress" && (d = c.shift()), d && (b === "fx" && c.unshift("inprogress"), f._data(a, b + ".run", e), d.call(a, function() {
                f.dequeue(a, b)
            }, e)), c.length || (f.removeData(a, b + "queue " + b + ".run", !0), n(a, b, "queue"))
        }
    }), f.fn.extend({
        queue: function(a, c) {
            var d = 2;
            typeof a != "string" && (c = a, a = "fx", d--);
            if (arguments.length < d) return f.queue(this[0], a);
            return c === b ? this : this.each(function() {
                var b = f.queue(this, a, c);
                a === "fx" && b[0] !== "inprogress" && f.dequeue(this, a)
            })
        },
        dequeue: function(a) {
            return this.each(function() {
                f.dequeue(this, a)
            })
        },
        delay: function(a, b) {
            a = f.fx ? f.fx.speeds[a] || a : a, b = b || "fx";
            return this.queue(b, function(b, c) {
                var d = setTimeout(b, a);
                c.stop = function() {
                    clearTimeout(d)
                }
            })
        },
        clearQueue: function(a) {
            return this.queue(a || "fx", [])
        },
        promise: function(a, c) {
            function m() {
                --h || d.resolveWith(e, [e])
            }
            typeof a != "string" && (c = a, a = b), a = a || "fx";
            var d = f.Deferred(),
                e = this,
                g = e.length,
                h = 1,
                i = a + "defer",
                j = a + "queue",
                k = a + "mark",
                l;
            while (g--)
                if (l = f.data(e[g], i, b, !0) || (f.data(e[g], j, b, !0) || f.data(e[g], k, b, !0)) && f.data(e[g], i, f.Callbacks("once memory"), !0)) h++, l.add(m);
            m();
            return d.promise(c)
        }
    });
    var o = /[\n\t\r]/g,
        p = /\s+/,
        q = /\r/g,
        r = /^(?:button|input)$/i,
        s = /^(?:button|input|object|select|textarea)$/i,
        t = /^a(?:rea)?$/i,
        u = /^(?:autofocus|autoplay|async|checked|controls|defer|disabled|hidden|loop|multiple|open|readonly|required|scoped|selected)$/i,
        v = f.support.getSetAttribute,
        w, x, y;
    f.fn.extend({
        attr: function(a, b) {
            return f.access(this, f.attr, a, b, arguments.length > 1)
        },
        removeAttr: function(a) {
            return this.each(function() {
                f.removeAttr(this, a)
            })
        },
        prop: function(a, b) {
            return f.access(this, f.prop, a, b, arguments.length > 1)
        },
        removeProp: function(a) {
            a = f.propFix[a] || a;
            return this.each(function() {
                try {
                    this[a] = b, delete this[a]
                } catch (c) {}
            })
        },
        addClass: function(a) {
            var b, c, d, e, g, h, i;
            if (f.isFunction(a)) return this.each(function(b) {
                f(this).addClass(a.call(this, b, this.className))
            });
            if (a && typeof a == "string") {
                b = a.split(p);
                for (c = 0, d = this.length; c < d; c++) {
                    e = this[c];
                    if (e.nodeType === 1)
                        if (!e.className && b.length === 1) e.className = a;
                        else {
                            g = " " + e.className + " ";
                            for (h = 0, i = b.length; h < i; h++) ~g.indexOf(" " + b[h] + " ") || (g += b[h] + " ");
                            e.className = f.trim(g)
                        }
                }
            }
            return this
        },
        removeClass: function(a) {
            var c, d, e, g, h, i, j;
            if (f.isFunction(a)) return this.each(function(b) {
                f(this).removeClass(a.call(this, b, this.className))
            });
            if (a && typeof a == "string" || a === b) {
                c = (a || "").split(p);
                for (d = 0, e = this.length; d < e; d++) {
                    g = this[d];
                    if (g.nodeType === 1 && g.className)
                        if (a) {
                            h = (" " + g.className + " ").replace(o, " ");
                            for (i = 0, j = c.length; i < j; i++) h = h.replace(" " + c[i] + " ", " ");
                            g.className = f.trim(h)
                        } else g.className = ""
                }
            }
            return this
        },
        toggleClass: function(a, b) {
            var c = typeof a,
                d = typeof b == "boolean";
            if (f.isFunction(a)) return this.each(function(c) {
                f(this).toggleClass(a.call(this, c, this.className, b), b)
            });
            return this.each(function() {
                if (c === "string") {
                    var e, g = 0,
                        h = f(this),
                        i = b,
                        j = a.split(p);
                    while (e = j[g++]) i = d ? i : !h.hasClass(e), h[i ? "addClass" : "removeClass"](e)
                } else if (c === "undefined" || c === "boolean") this.className && f._data(this, "__className__", this.className), this.className = this.className || a === !1 ? "" : f._data(this, "__className__") || ""
            })
        },
        hasClass: function(a) {
            var b = " " + a + " ",
                c = 0,
                d = this.length;
            for (; c < d; c++)
                if (this[c].nodeType === 1 && (" " + this[c].className + " ").replace(o, " ").indexOf(b) > -1) return !0;
            return !1
        },
        val: function(a) {
            var c, d, e, g = this[0]; {
                if (!!arguments.length) {
                    e = f.isFunction(a);
                    return this.each(function(d) {
                        var g = f(this),
                            h;
                        if (this.nodeType === 1) {
                            e ? h = a.call(this, d, g.val()) : h = a, h == null ? h = "" : typeof h == "number" ? h += "" : f.isArray(h) && (h = f.map(h, function(a) {
                                return a == null ? "" : a + ""
                            })), c = f.valHooks[this.type] || f.valHooks[this.nodeName.toLowerCase()];
                            if (!c || !("set" in c) || c.set(this, h, "value") === b) this.value = h
                        }
                    })
                }
                if (g) {
                    c = f.valHooks[g.type] || f.valHooks[g.nodeName.toLowerCase()];
                    if (c && "get" in c && (d = c.get(g, "value")) !== b) return d;
                    d = g.value;
                    return typeof d == "string" ? d.replace(q, "") : d == null ? "" : d
                }
            }
        }
    }), f.extend({
        valHooks: {
            option: {
                get: function(a) {
                    var b = a.attributes.value;
                    return !b || b.specified ? a.value : a.text
                }
            },
            select: {
                get: function(a) {
                    var b, c, d, e, g = a.selectedIndex,
                        h = [],
                        i = a.options,
                        j = a.type === "select-one";
                    if (g < 0) return null;
                    c = j ? g : 0, d = j ? g + 1 : i.length;
                    for (; c < d; c++) {
                        e = i[c];
                        if (e.selected && (f.support.optDisabled ? !e.disabled : e.getAttribute("disabled") === null) && (!e.parentNode.disabled || !f.nodeName(e.parentNode, "optgroup"))) {
                            b = f(e).val();
                            if (j) return b;
                            h.push(b)
                        }
                    }
                    if (j && !h.length && i.length) return f(i[g]).val();
                    return h
                },
                set: function(a, b) {
                    var c = f.makeArray(b);
                    f(a).find("option").each(function() {
                        this.selected = f.inArray(f(this).val(), c) >= 0
                    }), c.length || (a.selectedIndex = -1);
                    return c
                }
            }
        },
        attrFn: {
            val: !0,
            css: !0,
            html: !0,
            text: !0,
            data: !0,
            width: !0,
            height: !0,
            offset: !0
        },
        attr: function(a, c, d, e) {
            var g, h, i, j = a.nodeType;
            if (!!a && j !== 3 && j !== 8 && j !== 2) {
                if (e && c in f.attrFn) return f(a)[c](d);
                if (typeof a.getAttribute == "undefined") return f.prop(a, c, d);
                i = j !== 1 || !f.isXMLDoc(a), i && (c = c.toLowerCase(), h = f.attrHooks[c] || (u.test(c) ? x : w));
                if (d !== b) {
                    if (d === null) {
                        f.removeAttr(a, c);
                        return
                    }
                    if (h && "set" in h && i && (g = h.set(a, d, c)) !== b) return g;
                    a.setAttribute(c, "" + d);
                    return d
                }
                if (h && "get" in h && i && (g = h.get(a, c)) !== null) return g;
                g = a.getAttribute(c);
                return g === null ? b : g
            }
        },
        removeAttr: function(a, b) {
            var c, d, e, g, h, i = 0;
            if (b && a.nodeType === 1) {
                d = b.toLowerCase().split(p), g = d.length;
                for (; i < g; i++) e = d[i], e && (c = f.propFix[e] || e, h = u.test(e), h || f.attr(a, e, ""), a.removeAttribute(v ? e : c), h && c in a && (a[c] = !1))
            }
        },
        attrHooks: {
            type: {
                set: function(a, b) {
                    if (r.test(a.nodeName) && a.parentNode) f.error("type property can't be changed");
                    else if (!f.support.radioValue && b === "radio" && f.nodeName(a, "input")) {
                        var c = a.value;
                        a.setAttribute("type", b), c && (a.value = c);
                        return b
                    }
                }
            },
            value: {
                get: function(a, b) {
                    if (w && f.nodeName(a, "button")) return w.get(a, b);
                    return b in a ? a.value : null
                },
                set: function(a, b, c) {
                    if (w && f.nodeName(a, "button")) return w.set(a, b, c);
                    a.value = b
                }
            }
        },
        propFix: {
            tabindex: "tabIndex",
            readonly: "readOnly",
            "for": "htmlFor",
            "class": "className",
            maxlength: "maxLength",
            cellspacing: "cellSpacing",
            cellpadding: "cellPadding",
            rowspan: "rowSpan",
            colspan: "colSpan",
            usemap: "useMap",
            frameborder: "frameBorder",
            contenteditable: "contentEditable"
        },
        prop: function(a, c, d) {
            var e, g, h, i = a.nodeType;
            if (!!a && i !== 3 && i !== 8 && i !== 2) {
                h = i !== 1 || !f.isXMLDoc(a), h && (c = f.propFix[c] || c, g = f.propHooks[c]);
                return d !== b ? g && "set" in g && (e = g.set(a, d, c)) !== b ? e : a[c] = d : g && "get" in g && (e = g.get(a, c)) !== null ? e : a[c]
            }
        },
        propHooks: {
            tabIndex: {
                get: function(a) {
                    var c = a.getAttributeNode("tabindex");
                    return c && c.specified ? parseInt(c.value, 10) : s.test(a.nodeName) || t.test(a.nodeName) && a.href ? 0 : b
                }
            }
        }
    }), f.attrHooks.tabindex = f.propHooks.tabIndex, x = {
        get: function(a, c) {
            var d, e = f.prop(a, c);
            return e === !0 || typeof e != "boolean" && (d = a.getAttributeNode(c)) && d.nodeValue !== !1 ? c.toLowerCase() : b
        },
        set: function(a, b, c) {
            var d;
            b === !1 ? f.removeAttr(a, c) : (d = f.propFix[c] || c, d in a && (a[d] = !0), a.setAttribute(c, c.toLowerCase()));
            return c
        }
    }, v || (y = {
        name: !0,
        id: !0,
        coords: !0
    }, w = f.valHooks.button = {
        get: function(a, c) {
            var d;
            d = a.getAttributeNode(c);
            return d && (y[c] ? d.nodeValue !== "" : d.specified) ? d.nodeValue : b
        },
        set: function(a, b, d) {
            var e = a.getAttributeNode(d);
            e || (e = c.createAttribute(d), a.setAttributeNode(e));
            return e.nodeValue = b + ""
        }
    }, f.attrHooks.tabindex.set = w.set, f.each(["width", "height"], function(a, b) {
        f.attrHooks[b] = f.extend(f.attrHooks[b], {
            set: function(a, c) {
                if (c === "") {
                    a.setAttribute(b, "auto");
                    return c
                }
            }
        })
    }), f.attrHooks.contenteditable = {
        get: w.get,
        set: function(a, b, c) {
            b === "" && (b = "false"), w.set(a, b, c)
        }
    }), f.support.hrefNormalized || f.each(["href", "src", "width", "height"], function(a, c) {
        f.attrHooks[c] = f.extend(f.attrHooks[c], {
            get: function(a) {
                var d = a.getAttribute(c, 2);
                return d === null ? b : d
            }
        })
    }), f.support.style || (f.attrHooks.style = {
        get: function(a) {
            return a.style.cssText.toLowerCase() || b
        },
        set: function(a, b) {
            return a.style.cssText = "" + b
        }
    }), f.support.optSelected || (f.propHooks.selected = f.extend(f.propHooks.selected, {
        get: function(a) {
            var b = a.parentNode;
            b && (b.selectedIndex, b.parentNode && b.parentNode.selectedIndex);
            return null
        }
    })), f.support.enctype || (f.propFix.enctype = "encoding"), f.support.checkOn || f.each(["radio", "checkbox"], function() {
        f.valHooks[this] = {
            get: function(a) {
                return a.getAttribute("value") === null ? "on" : a.value
            }
        }
    }), f.each(["radio", "checkbox"], function() {
        f.valHooks[this] = f.extend(f.valHooks[this], {
            set: function(a, b) {
                if (f.isArray(b)) return a.checked = f.inArray(f(a).val(), b) >= 0
            }
        })
    });
    var z = /^(?:textarea|input|select)$/i,
        A = /^([^\.]*)?(?:\.(.+))?$/,
        B = /(?:^|\s)hover(\.\S+)?\b/,
        C = /^key/,
        D = /^(?:mouse|contextmenu)|click/,
        E = /^(?:focusinfocus|focusoutblur)$/,
        F = /^(\w*)(?:#([\w\-]+))?(?:\.([\w\-]+))?$/,
        G = function(a) {
            var b = F.exec(a);
            b && (b[1] = (b[1] || "").toLowerCase(), b[3] = b[3] && new RegExp("(?:^|\\s)" + b[3] + "(?:\\s|$)"));
            return b
        },
        H = function(a, b) {
            var c = a.attributes || {};
            return (!b[1] || a.nodeName.toLowerCase() === b[1]) && (!b[2] || (c.id || {}).value === b[2]) && (!b[3] || b[3].test((c["class"] || {}).value))
        },
        I = function(a) {
            return f.event.special.hover ? a : a.replace(B, "mouseenter$1 mouseleave$1")
        };
    f.event = {
            add: function(a, c, d, e, g) {
                var h, i, j, k, l, m, n, o, p, q, r, s;
                if (!(a.nodeType === 3 || a.nodeType === 8 || !c || !d || !(h = f._data(a)))) {
                    d.handler && (p = d, d = p.handler, g = p.selector), d.guid || (d.guid = f.guid++), j = h.events, j || (h.events = j = {}), i = h.handle, i || (h.handle = i = function(a) {
                        return typeof f != "undefined" && (!a || f.event.triggered !== a.type) ? f.event.dispatch.apply(i.elem, arguments) : b
                    }, i.elem = a), c = f.trim(I(c)).split(" ");
                    for (k = 0; k < c.length; k++) {
                        l = A.exec(c[k]) || [], m = l[1], n = (l[2] || "").split(".").sort(), s = f.event.special[m] || {}, m = (g ? s.delegateType : s.bindType) || m, s = f.event.special[m] || {}, o = f.extend({
                            type: m,
                            origType: l[1],
                            data: e,
                            handler: d,
                            guid: d.guid,
                            selector: g,
                            quick: g && G(g),
                            namespace: n.join(".")
                        }, p), r = j[m];
                        if (!r) {
                            r = j[m] = [], r.delegateCount = 0;
                            if (!s.setup || s.setup.call(a, e, n, i) === !1) a.addEventListener ? a.addEventListener(m, i, !1) : a.attachEvent && a.attachEvent("on" + m, i)
                        }
                        s.add && (s.add.call(a, o), o.handler.guid || (o.handler.guid = d.guid)), g ? r.splice(r.delegateCount++, 0, o) : r.push(o), f.event.global[m] = !0
                    }
                    a = null
                }
            },
            global: {},
            remove: function(a, b, c, d, e) {
                var g = f.hasData(a) && f._data(a),
                    h, i, j, k, l, m, n, o, p, q, r, s;
                if (!!g && !!(o = g.events)) {
                    b = f.trim(I(b || "")).split(" ");
                    for (h = 0; h < b.length; h++) {
                        i = A.exec(b[h]) || [], j = k = i[1], l = i[2];
                        if (!j) {
                            for (j in o) f.event.remove(a, j + b[h], c, d, !0);
                            continue
                        }
                        p = f.event.special[j] || {}, j = (d ? p.delegateType : p.bindType) || j, r = o[j] || [], m = r.length, l = l ? new RegExp("(^|\\.)" + l.split(".").sort().join("\\.(?:.*\\.)?") + "(\\.|$)") : null;
                        for (n = 0; n < r.length; n++) s = r[n], (e || k === s.origType) && (!c || c.guid === s.guid) && (!l || l.test(s.namespace)) && (!d || d === s.selector || d === "**" && s.selector) && (r.splice(n--, 1), s.selector && r.delegateCount--, p.remove && p.remove.call(a, s));
                        r.length === 0 && m !== r.length && ((!p.teardown || p.teardown.call(a, l) === !1) && f.removeEvent(a, j, g.handle), delete o[j])
                    }
                    f.isEmptyObject(o) && (q = g.handle, q && (q.elem = null), f.removeData(a, ["events", "handle"], !0))
                }
            },
            customEvent: {
                getData: !0,
                setData: !0,
                changeData: !0
            },
            trigger: function(c, d, e, g) {
                if (!e || e.nodeType !== 3 && e.nodeType !== 8) {
                    var h = c.type || c,
                        i = [],
                        j, k, l, m, n, o, p, q, r, s;
                    if (E.test(h + f.event.triggered)) return;
                    h.indexOf("!") >= 0 && (h = h.slice(0, -1), k = !0), h.indexOf(".") >= 0 && (i = h.split("."), h = i.shift(), i.sort());
                    if ((!e || f.event.customEvent[h]) && !f.event.global[h]) return;
                    c = typeof c == "object" ? c[f.expando] ? c : new f.Event(h, c) : new f.Event(h), c.type = h, c.isTrigger = !0, c.exclusive = k, c.namespace = i.join("."), c.namespace_re = c.namespace ? new RegExp("(^|\\.)" + i.join("\\.(?:.*\\.)?") + "(\\.|$)") : null, o = h.indexOf(":") < 0 ? "on" + h : "";
                    if (!e) {
                        j = f.cache;
                        for (l in j) j[l].events && j[l].events[h] && f.event.trigger(c, d, j[l].handle.elem, !0);
                        return
                    }
                    c.result = b, c.target || (c.target = e), d = d != null ? f.makeArray(d) : [], d.unshift(c), p = f.event.special[h] || {};
                    if (p.trigger && p.trigger.apply(e, d) === !1) return;
                    r = [
                        [e, p.bindType || h]
                    ];
                    if (!g && !p.noBubble && !f.isWindow(e)) {
                        s = p.delegateType || h, m = E.test(s + h) ? e : e.parentNode, n = null;
                        for (; m; m = m.parentNode) r.push([m, s]), n = m;
                        n && n === e.ownerDocument && r.push([n.defaultView || n.parentWindow || a, s])
                    }
                    for (l = 0; l < r.length && !c.isPropagationStopped(); l++) m = r[l][0], c.type = r[l][1], q = (f._data(m, "events") || {})[c.type] && f._data(m, "handle"), q && q.apply(m, d), q = o && m[o], q && f.acceptData(m) && q.apply(m, d) === !1 && c.preventDefault();
                    c.type = h, !g && !c.isDefaultPrevented() && (!p._default || p._default.apply(e.ownerDocument, d) === !1) && (h !== "click" || !f.nodeName(e, "a")) && f.acceptData(e) && o && e[h] && (h !== "focus" && h !== "blur" || c.target.offsetWidth !== 0) && !f.isWindow(e) && (n = e[o], n && (e[o] = null), f.event.triggered = h, e[h](), f.event.triggered = b, n && (e[o] = n));
                    return c.result
                }
            },
            dispatch: function(c) {
                c = f.event.fix(c || a.event);
                var d = (f._data(this, "events") || {})[c.type] || [],
                    e = d.delegateCount,
                    g = [].slice.call(arguments, 0),
                    h = !c.exclusive && !c.namespace,
                    i = f.event.special[c.type] || {},
                    j = [],
                    k, l, m, n, o, p, q, r, s, t, u;
                g[0] = c, c.delegateTarget = this;
                if (!i.preDispatch || i.preDispatch.call(this, c) !== !1) {
                    if (e && (!c.button || c.type !== "click")) {
                        n = f(this), n.context = this.ownerDocument || this;
                        for (m = c.target; m != this; m = m.parentNode || this)
                            if (m.disabled !== !0) {
                                p = {}, r = [], n[0] = m;
                                for (k = 0; k < e; k++) s = d[k], t = s.selector, p[t] === b && (p[t] = s.quick ? H(m, s.quick) : n.is(t)), p[t] && r.push(s);
                                r.length && j.push({
                                    elem: m,
                                    matches: r
                                })
                            }
                    }
                    d.length > e && j.push({
                        elem: this,
                        matches: d.slice(e)
                    });
                    for (k = 0; k < j.length && !c.isPropagationStopped(); k++) {
                        q = j[k], c.currentTarget = q.elem;
                        for (l = 0; l < q.matches.length && !c.isImmediatePropagationStopped(); l++) {
                            s = q.matches[l];
                            if (h || !c.namespace && !s.namespace || c.namespace_re && c.namespace_re.test(s.namespace)) c.data = s.data, c.handleObj = s, o = ((f.event.special[s.origType] || {}).handle || s.handler).apply(q.elem, g), o !== b && (c.result = o, o === !1 && (c.preventDefault(), c.stopPropagation()))
                        }
                    }
                    i.postDispatch && i.postDispatch.call(this, c);
                    return c.result
                }
            },
            props: "attrChange attrName relatedNode srcElement altKey bubbles cancelable ctrlKey currentTarget eventPhase metaKey relatedTarget shiftKey target timeStamp view which".split(" "),
            fixHooks: {},
            keyHooks: {
                props: "char charCode key keyCode".split(" "),
                filter: function(a, b) {
                    a.which == null && (a.which = b.charCode != null ? b.charCode : b.keyCode);
                    return a
                }
            },
            mouseHooks: {
                props: "button buttons clientX clientY fromElement offsetX offsetY pageX pageY screenX screenY toElement".split(" "),
                filter: function(a, d) {
                    var e, f, g, h = d.button,
                        i = d.fromElement;
                    a.pageX == null && d.clientX != null && (e = a.target.ownerDocument || c, f = e.documentElement, g = e.body, a.pageX = d.clientX + (f && f.scrollLeft || g && g.scrollLeft || 0) - (f && f.clientLeft || g && g.clientLeft || 0), a.pageY = d.clientY + (f && f.scrollTop || g && g.scrollTop || 0) - (f && f.clientTop || g && g.clientTop || 0)), !a.relatedTarget && i && (a.relatedTarget = i === a.target ? d.toElement : i), !a.which && h !== b && (a.which = h & 1 ? 1 : h & 2 ? 3 : h & 4 ? 2 : 0);
                    return a
                }
            },
            fix: function(a) {
                if (a[f.expando]) return a;
                var d, e, g = a,
                    h = f.event.fixHooks[a.type] || {},
                    i = h.props ? this.props.concat(h.props) : this.props;
                a = f.Event(g);
                for (d = i.length; d;) e = i[--d], a[e] = g[e];
                a.target || (a.target = g.srcElement || c), a.target.nodeType === 3 && (a.target = a.target.parentNode), a.metaKey === b && (a.metaKey = a.ctrlKey);
                return h.filter ? h.filter(a, g) : a
            },
            special: {
                ready: {
                    setup: f.bindReady
                },
                load: {
                    noBubble: !0
                },
                focus: {
                    delegateType: "focusin"
                },
                blur: {
                    delegateType: "focusout"
                },
                beforeunload: {
                    setup: function(a, b, c) {
                        f.isWindow(this) && (this.onbeforeunload = c)
                    },
                    teardown: function(a, b) {
                        this.onbeforeunload === b && (this.onbeforeunload = null)
                    }
                }
            },
            simulate: function(a, b, c, d) {
                var e = f.extend(new f.Event, c, {
                    type: a,
                    isSimulated: !0,
                    originalEvent: {}
                });
                d ? f.event.trigger(e, null, b) : f.event.dispatch.call(b, e), e.isDefaultPrevented() && c.preventDefault()
            }
        }, f.event.handle = f.event.dispatch, f.removeEvent = c.removeEventListener ? function(a, b, c) {
            a.removeEventListener && a.removeEventListener(b, c, !1)
        } : function(a, b, c) {
            a.detachEvent && a.detachEvent("on" + b, c)
        }, f.Event = function(a, b) {
            if (!(this instanceof f.Event)) return new f.Event(a, b);
            a && a.type ? (this.originalEvent = a, this.type = a.type, this.isDefaultPrevented = a.defaultPrevented || a.returnValue === !1 || a.getPreventDefault && a.getPreventDefault() ? K : J) : this.type = a, b && f.extend(this, b), this.timeStamp = a && a.timeStamp || f.now(), this[f.expando] = !0
        }, f.Event.prototype = {
            preventDefault: function() {
                this.isDefaultPrevented = K;
                var a = this.originalEvent;
                !a || (a.preventDefault ? a.preventDefault() : a.returnValue = !1)
            },
            stopPropagation: function() {
                this.isPropagationStopped = K;
                var a = this.originalEvent;
                !a || (a.stopPropagation && a.stopPropagation(), a.cancelBubble = !0)
            },
            stopImmediatePropagation: function() {
                this.isImmediatePropagationStopped = K, this.stopPropagation()
            },
            isDefaultPrevented: J,
            isPropagationStopped: J,
            isImmediatePropagationStopped: J
        }, f.each({
            mouseenter: "mouseover",
            mouseleave: "mouseout"
        }, function(a, b) {
            f.event.special[a] = {
                delegateType: b,
                bindType: b,
                handle: function(a) {
                    var c = this,
                        d = a.relatedTarget,
                        e = a.handleObj,
                        g = e.selector,
                        h;
                    if (!d || d !== c && !f.contains(c, d)) a.type = e.origType, h = e.handler.apply(this, arguments), a.type = b;
                    return h
                }
            }
        }), f.support.submitBubbles || (f.event.special.submit = {
            setup: function() {
                if (f.nodeName(this, "form")) return !1;
                f.event.add(this, "click._submit keypress._submit", function(a) {
                    var c = a.target,
                        d = f.nodeName(c, "input") || f.nodeName(c, "button") ? c.form : b;
                    d && !d._submit_attached && (f.event.add(d, "submit._submit", function(a) {
                        a._submit_bubble = !0
                    }), d._submit_attached = !0)
                })
            },
            postDispatch: function(a) {
                a._submit_bubble && (delete a._submit_bubble, this.parentNode && !a.isTrigger && f.event.simulate("submit", this.parentNode, a, !0))
            },
            teardown: function() {
                if (f.nodeName(this, "form")) return !1;
                f.event.remove(this, "._submit")
            }
        }), f.support.changeBubbles || (f.event.special.change = {
            setup: function() {
                if (z.test(this.nodeName)) {
                    if (this.type === "checkbox" || this.type === "radio") f.event.add(this, "propertychange._change", function(a) {
                        a.originalEvent.propertyName === "checked" && (this._just_changed = !0)
                    }), f.event.add(this, "click._change", function(a) {
                        this._just_changed && !a.isTrigger && (this._just_changed = !1, f.event.simulate("change", this, a, !0))
                    });
                    return !1
                }
                f.event.add(this, "beforeactivate._change", function(a) {
                    var b = a.target;
                    z.test(b.nodeName) && !b._change_attached && (f.event.add(b, "change._change", function(a) {
                        this.parentNode && !a.isSimulated && !a.isTrigger && f.event.simulate("change", this.parentNode, a, !0)
                    }), b._change_attached = !0)
                })
            },
            handle: function(a) {
                var b = a.target;
                if (this !== b || a.isSimulated || a.isTrigger || b.type !== "radio" && b.type !== "checkbox") return a.handleObj.handler.apply(this, arguments)
            },
            teardown: function() {
                f.event.remove(this, "._change");
                return z.test(this.nodeName)
            }
        }), f.support.focusinBubbles || f.each({
            focus: "focusin",
            blur: "focusout"
        }, function(a, b) {
            var d = 0,
                e = function(a) {
                    f.event.simulate(b, a.target, f.event.fix(a), !0)
                };
            f.event.special[b] = {
                setup: function() {
                    d++ === 0 && c.addEventListener(a, e, !0)
                },
                teardown: function() {
                    --d === 0 && c.removeEventListener(a, e, !0)
                }
            }
        }), f.fn.extend({
            on: function(a, c, d, e, g) {
                var h, i;
                if (typeof a == "object") {
                    typeof c != "string" && (d = d || c, c = b);
                    for (i in a) this.on(i, c, d, a[i], g);
                    return this
                }
                d == null && e == null ? (e = c, d = c = b) : e == null && (typeof c == "string" ? (e = d, d = b) : (e = d, d = c, c = b));
                if (e === !1) e = J;
                else if (!e) return this;
                g === 1 && (h = e, e = function(a) {
                    f().off(a);
                    return h.apply(this, arguments)
                }, e.guid = h.guid || (h.guid = f.guid++));
                return this.each(function() {
                    f.event.add(this, a, e, d, c)
                })
            },
            one: function(a, b, c, d) {
                return this.on(a, b, c, d, 1)
            },
            off: function(a, c, d) {
                if (a && a.preventDefault && a.handleObj) {
                    var e = a.handleObj;
                    f(a.delegateTarget).off(e.namespace ? e.origType + "." + e.namespace : e.origType, e.selector, e.handler);
                    return this
                }
                if (typeof a == "object") {
                    for (var g in a) this.off(g, c, a[g]);
                    return this
                }
                if (c === !1 || typeof c == "function") d = c, c = b;
                d === !1 && (d = J);
                return this.each(function() {
                    f.event.remove(this, a, d, c)
                })
            },
            bind: function(a, b, c) {
                return this.on(a, null, b, c)
            },
            unbind: function(a, b) {
                return this.off(a, null, b)
            },
            live: function(a, b, c) {
                f(this.context).on(a, this.selector, b, c);
                return this
            },
            die: function(a, b) {
                f(this.context).off(a, this.selector || "**", b);
                return this
            },
            delegate: function(a, b, c, d) {
                return this.on(b, a, c, d)
            },
            undelegate: function(a, b, c) {
                return arguments.length == 1 ? this.off(a, "**") : this.off(b, a, c)
            },
            trigger: function(a, b) {
                return this.each(function() {
                    f.event.trigger(a, b, this)
                })
            },
            triggerHandler: function(a, b) {
                if (this[0]) return f.event.trigger(a, b, this[0], !0)
            },
            toggle: function(a) {
                var b = arguments,
                    c = a.guid || f.guid++,
                    d = 0,
                    e = function(c) {
                        var e = (f._data(this, "lastToggle" + a.guid) || 0) % d;
                        f._data(this, "lastToggle" + a.guid, e + 1), c.preventDefault();
                        return b[e].apply(this, arguments) || !1
                    };
                e.guid = c;
                while (d < b.length) b[d++].guid = c;
                return this.click(e)
            },
            hover: function(a, b) {
                return this.mouseenter(a).mouseleave(b || a)
            }
        }), f.each("blur focus focusin focusout load resize scroll unload click dblclick mousedown mouseup mousemove mouseover mouseout mouseenter mouseleave change select submit keydown keypress keyup error contextmenu".split(" "), function(a, b) {
            f.fn[b] = function(a, c) {
                c == null && (c = a, a = null);
                return arguments.length > 0 ? this.on(b, null, a, c) : this.trigger(b)
            }, f.attrFn && (f.attrFn[b] = !0), C.test(b) && (f.event.fixHooks[b] = f.event.keyHooks), D.test(b) && (f.event.fixHooks[b] = f.event.mouseHooks)
        }),
        function() {
            function x(a, b, c, e, f, g) {
                for (var h = 0, i = e.length; h < i; h++) {
                    var j = e[h];
                    if (j) {
                        var k = !1;
                        j = j[a];
                        while (j) {
                            if (j[d] === c) {
                                k = e[j.sizset];
                                break
                            }
                            if (j.nodeType === 1) {
                                g || (j[d] = c, j.sizset = h);
                                if (typeof b != "string") {
                                    if (j === b) {
                                        k = !0;
                                        break
                                    }
                                } else if (m.filter(b, [j]).length > 0) {
                                    k = j;
                                    break
                                }
                            }
                            j = j[a]
                        }
                        e[h] = k
                    }
                }
            }

            function w(a, b, c, e, f, g) {
                for (var h = 0, i = e.length; h < i; h++) {
                    var j = e[h];
                    if (j) {
                        var k = !1;
                        j = j[a];
                        while (j) {
                            if (j[d] === c) {
                                k = e[j.sizset];
                                break
                            }
                            j.nodeType === 1 && !g && (j[d] = c, j.sizset = h);
                            if (j.nodeName.toLowerCase() === b) {
                                k = j;
                                break
                            }
                            j = j[a]
                        }
                        e[h] = k
                    }
                }
            }
            var a = /((?:\((?:\([^()]+\)|[^()]+)+\)|\[(?:\[[^\[\]]*\]|['"][^'"]*['"]|[^\[\]'"]+)+\]|\\.|[^ >+~,(\[\\]+)+|[>+~])(\s*,\s*)?((?:.|\r|\n)*)/g,
                d = "sizcache" + (Math.random() + "").replace(".", ""),
                e = 0,
                g = Object.prototype.toString,
                h = !1,
                i = !0,
                j = /\\/g,
                k = /\r\n/g,
                l = /\W/;
            [0, 0].sort(function() {
                i = !1;
                return 0
            });
            var m = function(b, d, e, f) {
                e = e || [], d = d || c;
                var h = d;
                if (d.nodeType !== 1 && d.nodeType !== 9) return [];
                if (!b || typeof b != "string") return e;
                var i, j, k, l, n, q, r, t, u = !0,
                    v = m.isXML(d),
                    w = [],
                    x = b;
                do {
                    a.exec(""), i = a.exec(x);
                    if (i) {
                        x = i[3], w.push(i[1]);
                        if (i[2]) {
                            l = i[3];
                            break
                        }
                    }
                } while (i);
                if (w.length > 1 && p.exec(b))
                    if (w.length === 2 && o.relative[w[0]]) j = y(w[0] + w[1], d, f);
                    else {
                        j = o.relative[w[0]] ? [d] : m(w.shift(), d);
                        while (w.length) b = w.shift(), o.relative[b] && (b += w.shift()), j = y(b, j, f)
                    }
                else {
                    !f && w.length > 1 && d.nodeType === 9 && !v && o.match.ID.test(w[0]) && !o.match.ID.test(w[w.length - 1]) && (n = m.find(w.shift(), d, v), d = n.expr ? m.filter(n.expr, n.set)[0] : n.set[0]);
                    if (d) {
                        n = f ? {
                            expr: w.pop(),
                            set: s(f)
                        } : m.find(w.pop(), w.length === 1 && (w[0] === "~" || w[0] === "+") && d.parentNode ? d.parentNode : d, v), j = n.expr ? m.filter(n.expr, n.set) : n.set, w.length > 0 ? k = s(j) : u = !1;
                        while (w.length) q = w.pop(), r = q, o.relative[q] ? r = w.pop() : q = "", r == null && (r = d), o.relative[q](k, r, v)
                    } else k = w = []
                }
                k || (k = j), k || m.error(q || b);
                if (g.call(k) === "[object Array]")
                    if (!u) e.push.apply(e, k);
                    else if (d && d.nodeType === 1)
                    for (t = 0; k[t] != null; t++) k[t] && (k[t] === !0 || k[t].nodeType === 1 && m.contains(d, k[t])) && e.push(j[t]);
                else
                    for (t = 0; k[t] != null; t++) k[t] && k[t].nodeType === 1 && e.push(j[t]);
                else s(k, e);
                l && (m(l, h, e, f), m.uniqueSort(e));
                return e
            };
            m.uniqueSort = function(a) {
                if (u) {
                    h = i, a.sort(u);
                    if (h)
                        for (var b = 1; b < a.length; b++) a[b] === a[b - 1] && a.splice(b--, 1)
                }
                return a
            }, m.matches = function(a, b) {
                return m(a, null, null, b)
            }, m.matchesSelector = function(a, b) {
                return m(b, null, null, [a]).length > 0
            }, m.find = function(a, b, c) {
                var d, e, f, g, h, i;
                if (!a) return [];
                for (e = 0, f = o.order.length; e < f; e++) {
                    h = o.order[e];
                    if (g = o.leftMatch[h].exec(a)) {
                        i = g[1], g.splice(1, 1);
                        if (i.substr(i.length - 1) !== "\\") {
                            g[1] = (g[1] || "").replace(j, ""), d = o.find[h](g, b, c);
                            if (d != null) {
                                a = a.replace(o.match[h], "");
                                break
                            }
                        }
                    }
                }
                d || (d = typeof b.getElementsByTagName != "undefined" ? b.getElementsByTagName("*") : []);
                return {
                    set: d,
                    expr: a
                }
            }, m.filter = function(a, c, d, e) {
                var f, g, h, i, j, k, l, n, p, q = a,
                    r = [],
                    s = c,
                    t = c && c[0] && m.isXML(c[0]);
                while (a && c.length) {
                    for (h in o.filter)
                        if ((f = o.leftMatch[h].exec(a)) != null && f[2]) {
                            k = o.filter[h], l = f[1], g = !1, f.splice(1, 1);
                            if (l.substr(l.length - 1) === "\\") continue;
                            s === r && (r = []);
                            if (o.preFilter[h]) {
                                f = o.preFilter[h](f, s, d, r, e, t);
                                if (!f) g = i = !0;
                                else if (f === !0) continue
                            }
                            if (f)
                                for (n = 0;
                                    (j = s[n]) != null; n++) j && (i = k(j, f, n, s), p = e ^ i, d && i != null ? p ? g = !0 : s[n] = !1 : p && (r.push(j), g = !0));
                            if (i !== b) {
                                d || (s = r), a = a.replace(o.match[h], "");
                                if (!g) return [];
                                break
                            }
                        }
                    if (a === q)
                        if (g == null) m.error(a);
                        else break;
                    q = a
                }
                return s
            }, m.error = function(a) {
                throw new Error("Syntax error, unrecognized expression: " + a)
            };
            var n = m.getText = function(a) {
                    var b, c, d = a.nodeType,
                        e = "";
                    if (d) {
                        if (d === 1 || d === 9 || d === 11) {
                            if (typeof a.textContent == "string") return a.textContent;
                            if (typeof a.innerText == "string") return a.innerText.replace(k, "");
                            for (a = a.firstChild; a; a = a.nextSibling) e += n(a)
                        } else if (d === 3 || d === 4) return a.nodeValue
                    } else
                        for (b = 0; c = a[b]; b++) c.nodeType !== 8 && (e += n(c));
                    return e
                },
                o = m.selectors = {
                    order: ["ID", "NAME", "TAG"],
                    match: {
                        ID: /#((?:[\w\u00c0-\uFFFF\-]|\\.)+)/,
                        CLASS: /\.((?:[\w\u00c0-\uFFFF\-]|\\.)+)/,
                        NAME: /\[name=['"]*((?:[\w\u00c0-\uFFFF\-]|\\.)+)['"]*\]/,
                        ATTR: /\[\s*((?:[\w\u00c0-\uFFFF\-]|\\.)+)\s*(?:(\S?=)\s*(?:(['"])(.*?)\3|(#?(?:[\w\u00c0-\uFFFF\-]|\\.)*)|)|)\s*\]/,
                        TAG: /^((?:[\w\u00c0-\uFFFF\*\-]|\\.)+)/,
                        CHILD: /:(only|nth|last|first)-child(?:\(\s*(even|odd|(?:[+\-]?\d+|(?:[+\-]?\d*)?n\s*(?:[+\-]\s*\d+)?))\s*\))?/,
                        POS: /:(nth|eq|gt|lt|first|last|even|odd)(?:\((\d*)\))?(?=[^\-]|$)/,
                        PSEUDO: /:((?:[\w\u00c0-\uFFFF\-]|\\.)+)(?:\((['"]?)((?:\([^\)]+\)|[^\(\)]*)+)\2\))?/
                    },
                    leftMatch: {},
                    attrMap: {
                        "class": "className",
                        "for": "htmlFor"
                    },
                    attrHandle: {
                        href: function(a) {
                            return a.getAttribute("href")
                        },
                        type: function(a) {
                            return a.getAttribute("type")
                        }
                    },
                    relative: {
                        "+": function(a, b) {
                            var c = typeof b == "string",
                                d = c && !l.test(b),
                                e = c && !d;
                            d && (b = b.toLowerCase());
                            for (var f = 0, g = a.length, h; f < g; f++)
                                if (h = a[f]) {
                                    while ((h = h.previousSibling) && h.nodeType !== 1);
                                    a[f] = e || h && h.nodeName.toLowerCase() === b ? h || !1 : h === b
                                }
                            e && m.filter(b, a, !0)
                        },
                        ">": function(a, b) {
                            var c, d = typeof b == "string",
                                e = 0,
                                f = a.length;
                            if (d && !l.test(b)) {
                                b = b.toLowerCase();
                                for (; e < f; e++) {
                                    c = a[e];
                                    if (c) {
                                        var g = c.parentNode;
                                        a[e] = g.nodeName.toLowerCase() === b ? g : !1
                                    }
                                }
                            } else {
                                for (; e < f; e++) c = a[e], c && (a[e] = d ? c.parentNode : c.parentNode === b);
                                d && m.filter(b, a, !0)
                            }
                        },
                        "": function(a, b, c) {
                            var d, f = e++,
                                g = x;
                            typeof b == "string" && !l.test(b) && (b = b.toLowerCase(), d = b, g = w), g("parentNode", b, f, a, d, c)
                        },
                        "~": function(a, b, c) {
                            var d, f = e++,
                                g = x;
                            typeof b == "string" && !l.test(b) && (b = b.toLowerCase(), d = b, g = w), g("previousSibling", b, f, a, d, c)
                        }
                    },
                    find: {
                        ID: function(a, b, c) {
                            if (typeof b.getElementById != "undefined" && !c) {
                                var d = b.getElementById(a[1]);
                                return d && d.parentNode ? [d] : []
                            }
                        },
                        NAME: function(a, b) {
                            if (typeof b.getElementsByName != "undefined") {
                                var c = [],
                                    d = b.getElementsByName(a[1]);
                                for (var e = 0, f = d.length; e < f; e++) d[e].getAttribute("name") === a[1] && c.push(d[e]);
                                return c.length === 0 ? null : c
                            }
                        },
                        TAG: function(a, b) {
                            if (typeof b.getElementsByTagName != "undefined") return b.getElementsByTagName(a[1])
                        }
                    },
                    preFilter: {
                        CLASS: function(a, b, c, d, e, f) {
                            a = " " + a[1].replace(j, "") + " ";
                            if (f) return a;
                            for (var g = 0, h;
                                (h = b[g]) != null; g++) h && (e ^ (h.className && (" " + h.className + " ").replace(/[\t\n\r]/g, " ").indexOf(a) >= 0) ? c || d.push(h) : c && (b[g] = !1));
                            return !1
                        },
                        ID: function(a) {
                            return a[1].replace(j, "")
                        },
                        TAG: function(a, b) {
                            return a[1].replace(j, "").toLowerCase()
                        },
                        CHILD: function(a) {
                            if (a[1] === "nth") {
                                a[2] || m.error(a[0]), a[2] = a[2].replace(/^\+|\s*/g, "");
                                var b = /(-?)(\d*)(?:n([+\-]?\d*))?/.exec(a[2] === "even" && "2n" || a[2] === "odd" && "2n+1" || !/\D/.test(a[2]) && "0n+" + a[2] || a[2]);
                                a[2] = b[1] + (b[2] || 1) - 0, a[3] = b[3] - 0
                            } else a[2] && m.error(a[0]);
                            a[0] = e++;
                            return a
                        },
                        ATTR: function(a, b, c, d, e, f) {
                            var g = a[1] = a[1].replace(j, "");
                            !f && o.attrMap[g] && (a[1] = o.attrMap[g]), a[4] = (a[4] || a[5] || "").replace(j, ""), a[2] === "~=" && (a[4] = " " + a[4] + " ");
                            return a
                        },
                        PSEUDO: function(b, c, d, e, f) {
                            if (b[1] === "not")
                                if ((a.exec(b[3]) || "").length > 1 || /^\w/.test(b[3])) b[3] = m(b[3], null, null, c);
                                else {
                                    var g = m.filter(b[3], c, d, !0 ^ f);
                                    d || e.push.apply(e, g);
                                    return !1
                                }
                            else if (o.match.POS.test(b[0]) || o.match.CHILD.test(b[0])) return !0;
                            return b
                        },
                        POS: function(a) {
                            a.unshift(!0);
                            return a
                        }
                    },
                    filters: {
                        enabled: function(a) {
                            return a.disabled === !1 && a.type !== "hidden"
                        },
                        disabled: function(a) {
                            return a.disabled === !0
                        },
                        checked: function(a) {
                            return a.checked === !0
                        },
                        selected: function(a) {
                            a.parentNode && a.parentNode.selectedIndex;
                            return a.selected === !0
                        },
                        parent: function(a) {
                            return !!a.firstChild
                        },
                        empty: function(a) {
                            return !a.firstChild
                        },
                        has: function(a, b, c) {
                            return !!m(c[3], a).length
                        },
                        header: function(a) {
                            return /h\d/i.test(a.nodeName)
                        },
                        text: function(a) {
                            var b = a.getAttribute("type"),
                                c = a.type;
                            return a.nodeName.toLowerCase() === "input" && "text" === c && (b === c || b === null)
                        },
                        radio: function(a) {
                            return a.nodeName.toLowerCase() === "input" && "radio" === a.type
                        },
                        checkbox: function(a) {
                            return a.nodeName.toLowerCase() === "input" && "checkbox" === a.type
                        },
                        file: function(a) {
                            return a.nodeName.toLowerCase() === "input" && "file" === a.type
                        },
                        password: function(a) {
                            return a.nodeName.toLowerCase() === "input" && "password" === a.type
                        },
                        submit: function(a) {
                            var b = a.nodeName.toLowerCase();
                            return (b === "input" || b === "button") && "submit" === a.type
                        },
                        image: function(a) {
                            return a.nodeName.toLowerCase() === "input" && "image" === a.type
                        },
                        reset: function(a) {
                            var b = a.nodeName.toLowerCase();
                            return (b === "input" || b === "button") && "reset" === a.type
                        },
                        button: function(a) {
                            var b = a.nodeName.toLowerCase();
                            return b === "input" && "button" === a.type || b === "button"
                        },
                        input: function(a) {
                            return /input|select|textarea|button/i.test(a.nodeName)
                        },
                        focus: function(a) {
                            return a === a.ownerDocument.activeElement
                        }
                    },
                    setFilters: {
                        first: function(a, b) {
                            return b === 0
                        },
                        last: function(a, b, c, d) {
                            return b === d.length - 1
                        },
                        even: function(a, b) {
                            return b % 2 === 0
                        },
                        odd: function(a, b) {
                            return b % 2 === 1
                        },
                        lt: function(a, b, c) {
                            return b < c[3] - 0
                        },
                        gt: function(a, b, c) {
                            return b > c[3] - 0
                        },
                        nth: function(a, b, c) {
                            return c[3] - 0 === b
                        },
                        eq: function(a, b, c) {
                            return c[3] - 0 === b
                        }
                    },
                    filter: {
                        PSEUDO: function(a, b, c, d) {
                            var e = b[1],
                                f = o.filters[e];
                            if (f) return f(a, c, b, d);
                            if (e === "contains") return (a.textContent || a.innerText || n([a]) || "").indexOf(b[3]) >= 0;
                            if (e === "not") {
                                var g = b[3];
                                for (var h = 0, i = g.length; h < i; h++)
                                    if (g[h] === a) return !1;
                                return !0
                            }
                            m.error(e)
                        },
                        CHILD: function(a, b) {
                            var c, e, f, g, h, i, j, k = b[1],
                                l = a;
                            switch (k) {
                                case "only":
                                case "first":
                                    while (l = l.previousSibling)
                                        if (l.nodeType === 1) return !1;
                                    if (k === "first") return !0;
                                    l = a;
                                case "last":
                                    while (l = l.nextSibling)
                                        if (l.nodeType === 1) return !1;
                                    return !0;
                                case "nth":
                                    c = b[2], e = b[3];
                                    if (c === 1 && e === 0) return !0;
                                    f = b[0], g = a.parentNode;
                                    if (g && (g[d] !== f || !a.nodeIndex)) {
                                        i = 0;
                                        for (l = g.firstChild; l; l = l.nextSibling) l.nodeType === 1 && (l.nodeIndex = ++i);
                                        g[d] = f
                                    }
                                    j = a.nodeIndex - e;
                                    return c === 0 ? j === 0 : j % c === 0 && j / c >= 0
                            }
                        },
                        ID: function(a, b) {
                            return a.nodeType === 1 && a.getAttribute("id") === b
                        },
                        TAG: function(a, b) {
                            return b === "*" && a.nodeType === 1 || !!a.nodeName && a.nodeName.toLowerCase() === b
                        },
                        CLASS: function(a, b) {
                            return (" " + (a.className || a.getAttribute("class")) + " ").indexOf(b) > -1
                        },
                        ATTR: function(a, b) {
                            var c = b[1],
                                d = m.attr ? m.attr(a, c) : o.attrHandle[c] ? o.attrHandle[c](a) : a[c] != null ? a[c] : a.getAttribute(c),
                                e = d + "",
                                f = b[2],
                                g = b[4];
                            return d == null ? f === "!=" : !f && m.attr ? d != null : f === "=" ? e === g : f === "*=" ? e.indexOf(g) >= 0 : f === "~=" ? (" " + e + " ").indexOf(g) >= 0 : g ? f === "!=" ? e !== g : f === "^=" ? e.indexOf(g) === 0 : f === "$=" ? e.substr(e.length - g.length) === g : f === "|=" ? e === g || e.substr(0, g.length + 1) === g + "-" : !1 : e && d !== !1
                        },
                        POS: function(a, b, c, d) {
                            var e = b[2],
                                f = o.setFilters[e];
                            if (f) return f(a, c, b, d)
                        }
                    }
                },
                p = o.match.POS,
                q = function(a, b) {
                    return "\\" + (b - 0 + 1)
                };
            for (var r in o.match) o.match[r] = new RegExp(o.match[r].source + /(?![^\[]*\])(?![^\(]*\))/.source), o.leftMatch[r] = new RegExp(/(^(?:.|\r|\n)*?)/.source + o.match[r].source.replace(/\\(\d+)/g, q));
            o.match.globalPOS = p;
            var s = function(a, b) {
                a = Array.prototype.slice.call(a, 0);
                if (b) {
                    b.push.apply(b, a);
                    return b
                }
                return a
            };
            try {
                Array.prototype.slice.call(c.documentElement.childNodes, 0)[0].nodeType
            } catch (t) {
                s = function(a, b) {
                    var c = 0,
                        d = b || [];
                    if (g.call(a) === "[object Array]") Array.prototype.push.apply(d, a);
                    else if (typeof a.length == "number")
                        for (var e = a.length; c < e; c++) d.push(a[c]);
                    else
                        for (; a[c]; c++) d.push(a[c]);
                    return d
                }
            }
            var u, v;
            c.documentElement.compareDocumentPosition ? u = function(a, b) {
                    if (a === b) {
                        h = !0;
                        return 0
                    }
                    if (!a.compareDocumentPosition || !b.compareDocumentPosition) return a.compareDocumentPosition ? -1 : 1;
                    return a.compareDocumentPosition(b) & 4 ? -1 : 1
                } : (u = function(a, b) {
                    if (a === b) {
                        h = !0;
                        return 0
                    }
                    if (a.sourceIndex && b.sourceIndex) return a.sourceIndex - b.sourceIndex;
                    var c, d, e = [],
                        f = [],
                        g = a.parentNode,
                        i = b.parentNode,
                        j = g;
                    if (g === i) return v(a, b);
                    if (!g) return -1;
                    if (!i) return 1;
                    while (j) e.unshift(j), j = j.parentNode;
                    j = i;
                    while (j) f.unshift(j), j = j.parentNode;
                    c = e.length, d = f.length;
                    for (var k = 0; k < c && k < d; k++)
                        if (e[k] !== f[k]) return v(e[k], f[k]);
                    return k === c ? v(a, f[k], -1) : v(e[k], b, 1)
                }, v = function(a, b, c) {
                    if (a === b) return c;
                    var d = a.nextSibling;
                    while (d) {
                        if (d === b) return -1;
                        d = d.nextSibling
                    }
                    return 1
                }),
                function() {
                    var a = c.createElement("div"),
                        d = "script" + (new Date).getTime(),
                        e = c.documentElement;
                    a.innerHTML = "<a name='" + d + "'/>", e.insertBefore(a, e.firstChild), c.getElementById(d) && (o.find.ID = function(a, c, d) {
                        if (typeof c.getElementById != "undefined" && !d) {
                            var e = c.getElementById(a[1]);
                            return e ? e.id === a[1] || typeof e.getAttributeNode != "undefined" && e.getAttributeNode("id").nodeValue === a[1] ? [e] : b : []
                        }
                    }, o.filter.ID = function(a, b) {
                        var c = typeof a.getAttributeNode != "undefined" && a.getAttributeNode("id");
                        return a.nodeType === 1 && c && c.nodeValue === b
                    }), e.removeChild(a), e = a = null
                }(),
                function() {
                    var a = c.createElement("div");
                    a.appendChild(c.createComment("")), a.getElementsByTagName("*").length > 0 && (o.find.TAG = function(a, b) {
                        var c = b.getElementsByTagName(a[1]);
                        if (a[1] === "*") {
                            var d = [];
                            for (var e = 0; c[e]; e++) c[e].nodeType === 1 && d.push(c[e]);
                            c = d
                        }
                        return c
                    }), a.innerHTML = "<a href='#'></a>", a.firstChild && typeof a.firstChild.getAttribute != "undefined" && a.firstChild.getAttribute("href") !== "#" && (o.attrHandle.href = function(a) {
                        return a.getAttribute("href", 2)
                    }), a = null
                }(), c.querySelectorAll && function() {
                    var a = m,
                        b = c.createElement("div"),
                        d = "__sizzle__";
                    b.innerHTML = "<p class='TEST'></p>";
                    if (!b.querySelectorAll || b.querySelectorAll(".TEST").length !== 0) {
                        m = function(b, e, f, g) {
                            e = e || c;
                            if (!g && !m.isXML(e)) {
                                var h = /^(\w+$)|^\.([\w\-]+$)|^#([\w\-]+$)/.exec(b);
                                if (h && (e.nodeType === 1 || e.nodeType === 9)) {
                                    if (h[1]) return s(e.getElementsByTagName(b), f);
                                    if (h[2] && o.find.CLASS && e.getElementsByClassName) return s(e.getElementsByClassName(h[2]), f)
                                }
                                if (e.nodeType === 9) {
                                    if (b === "body" && e.body) return s([e.body], f);
                                    if (h && h[3]) {
                                        var i = e.getElementById(h[3]);
                                        if (!i || !i.parentNode) return s([], f);
                                        if (i.id === h[3]) return s([i], f)
                                    }
                                    try {
                                        return s(e.querySelectorAll(b), f)
                                    } catch (j) {}
                                } else if (e.nodeType === 1 && e.nodeName.toLowerCase() !== "object") {
                                    var k = e,
                                        l = e.getAttribute("id"),
                                        n = l || d,
                                        p = e.parentNode,
                                        q = /^\s*[+~]/.test(b);
                                    l ? n = n.replace(/'/g, "\\$&") : e.setAttribute("id", n), q && p && (e = e.parentNode);
                                    try {
                                        if (!q || p) return s(e.querySelectorAll("[id='" + n + "'] " + b), f)
                                    } catch (r) {} finally {
                                        l || k.removeAttribute("id")
                                    }
                                }
                            }
                            return a(b, e, f, g)
                        };
                        for (var e in a) m[e] = a[e];
                        b = null
                    }
                }(),
                function() {
                    var a = c.documentElement,
                        b = a.matchesSelector || a.mozMatchesSelector || a.webkitMatchesSelector || a.msMatchesSelector;
                    if (b) {
                        var d = !b.call(c.createElement("div"), "div"),
                            e = !1;
                        try {
                            b.call(c.documentElement, "[test!='']:sizzle")
                        } catch (f) {
                            e = !0
                        }
                        m.matchesSelector = function(a, c) {
                            c = c.replace(/\=\s*([^'"\]]*)\s*\]/g, "='$1']");
                            if (!m.isXML(a)) try {
                                if (e || !o.match.PSEUDO.test(c) && !/!=/.test(c)) {
                                    var f = b.call(a, c);
                                    if (f || !d || a.document && a.document.nodeType !== 11) return f
                                }
                            } catch (g) {}
                            return m(c, null, null, [a]).length > 0
                        }
                    }
                }(),
                function() {
                    var a = c.createElement("div");
                    a.innerHTML = "<div class='test e'></div><div class='test'></div>";
                    if (!!a.getElementsByClassName && a.getElementsByClassName("e").length !== 0) {
                        a.lastChild.className = "e";
                        if (a.getElementsByClassName("e").length === 1) return;
                        o.order.splice(1, 0, "CLASS"), o.find.CLASS = function(a, b, c) {
                            if (typeof b.getElementsByClassName != "undefined" && !c) return b.getElementsByClassName(a[1])
                        }, a = null
                    }
                }(), c.documentElement.contains ? m.contains = function(a, b) {
                    return a !== b && (a.contains ? a.contains(b) : !0)
                } : c.documentElement.compareDocumentPosition ? m.contains = function(a, b) {
                    return !!(a.compareDocumentPosition(b) & 16)
                } : m.contains = function() {
                    return !1
                }, m.isXML = function(a) {
                    var b = (a ? a.ownerDocument || a : 0).documentElement;
                    return b ? b.nodeName !== "HTML" : !1
                };
            var y = function(a, b, c) {
                var d, e = [],
                    f = "",
                    g = b.nodeType ? [b] : b;
                while (d = o.match.PSEUDO.exec(a)) f += d[0], a = a.replace(o.match.PSEUDO, "");
                a = o.relative[a] ? a + "*" : a;
                for (var h = 0, i = g.length; h < i; h++) m(a, g[h], e, c);
                return m.filter(f, e)
            };
            m.attr = f.attr, m.selectors.attrMap = {}, f.find = m, f.expr = m.selectors, f.expr[":"] = f.expr.filters, f.unique = m.uniqueSort, f.text = m.getText, f.isXMLDoc = m.isXML, f.contains = m.contains
        }();
    var L = /Until$/,
        M = /^(?:parents|prevUntil|prevAll)/,
        N = /,/,
        O = /^.[^:#\[\.,]*$/,
        P = Array.prototype.slice,
        Q = f.expr.match.globalPOS,
        R = {
            children: !0,
            contents: !0,
            next: !0,
            prev: !0
        };
    f.fn.extend({
        find: function(a) {
            var b = this,
                c, d;
            if (typeof a != "string") return f(a).filter(function() {
                for (c = 0, d = b.length; c < d; c++)
                    if (f.contains(b[c], this)) return !0
            });
            var e = this.pushStack("", "find", a),
                g, h, i;
            for (c = 0, d = this.length; c < d; c++) {
                g = e.length, f.find(a, this[c], e);
                if (c > 0)
                    for (h = g; h < e.length; h++)
                        for (i = 0; i < g; i++)
                            if (e[i] === e[h]) {
                                e.splice(h--, 1);
                                break
                            }
            }
            return e
        },
        has: function(a) {
            var b = f(a);
            return this.filter(function() {
                for (var a = 0, c = b.length; a < c; a++)
                    if (f.contains(this, b[a])) return !0
            })
        },
        not: function(a) {
            return this.pushStack(T(this, a, !1), "not", a)
        },
        filter: function(a) {
            return this.pushStack(T(this, a, !0), "filter", a)
        },
        is: function(a) {
            return !!a && (typeof a == "string" ? Q.test(a) ? f(a, this.context).index(this[0]) >= 0 : f.filter(a, this).length > 0 : this.filter(a).length > 0)
        },
        closest: function(a, b) {
            var c = [],
                d, e, g = this[0];
            if (f.isArray(a)) {
                var h = 1;
                while (g && g.ownerDocument && g !== b) {
                    for (d = 0; d < a.length; d++) f(g).is(a[d]) && c.push({
                        selector: a[d],
                        elem: g,
                        level: h
                    });
                    g = g.parentNode, h++
                }
                return c
            }
            var i = Q.test(a) || typeof a != "string" ? f(a, b || this.context) : 0;
            for (d = 0, e = this.length; d < e; d++) {
                g = this[d];
                while (g) {
                    if (i ? i.index(g) > -1 : f.find.matchesSelector(g, a)) {
                        c.push(g);
                        break
                    }
                    g = g.parentNode;
                    if (!g || !g.ownerDocument || g === b || g.nodeType === 11) break
                }
            }
            c = c.length > 1 ? f.unique(c) : c;
            return this.pushStack(c, "closest", a)
        },
        index: function(a) {
            if (!a) return this[0] && this[0].parentNode ? this.prevAll().length : -1;
            if (typeof a == "string") return f.inArray(this[0], f(a));
            return f.inArray(a.jquery ? a[0] : a, this)
        },
        add: function(a, b) {
            var c = typeof a == "string" ? f(a, b) : f.makeArray(a && a.nodeType ? [a] : a),
                d = f.merge(this.get(), c);
            return this.pushStack(S(c[0]) || S(d[0]) ? d : f.unique(d))
        },
        andSelf: function() {
            return this.add(this.prevObject)
        }
    }), f.each({
        parent: function(a) {
            var b = a.parentNode;
            return b && b.nodeType !== 11 ? b : null
        },
        parents: function(a) {
            return f.dir(a, "parentNode")
        },
        parentsUntil: function(a, b, c) {
            return f.dir(a, "parentNode", c)
        },
        next: function(a) {
            return f.nth(a, 2, "nextSibling")
        },
        prev: function(a) {
            return f.nth(a, 2, "previousSibling")
        },
        nextAll: function(a) {
            return f.dir(a, "nextSibling")
        },
        prevAll: function(a) {
            return f.dir(a, "previousSibling")
        },
        nextUntil: function(a, b, c) {
            return f.dir(a, "nextSibling", c)
        },
        prevUntil: function(a, b, c) {
            return f.dir(a, "previousSibling", c)
        },
        siblings: function(a) {
            return f.sibling((a.parentNode || {}).firstChild, a)
        },
        children: function(a) {
            return f.sibling(a.firstChild)
        },
        contents: function(a) {
            return f.nodeName(a, "iframe") ? a.contentDocument || a.contentWindow.document : f.makeArray(a.childNodes)
        }
    }, function(a, b) {
        f.fn[a] = function(c, d) {
            var e = f.map(this, b, c);
            L.test(a) || (d = c), d && typeof d == "string" && (e = f.filter(d, e)), e = this.length > 1 && !R[a] ? f.unique(e) : e, (this.length > 1 || N.test(d)) && M.test(a) && (e = e.reverse());
            return this.pushStack(e, a, P.call(arguments).join(","))
        }
    }), f.extend({
        filter: function(a, b, c) {
            c && (a = ":not(" + a + ")");
            return b.length === 1 ? f.find.matchesSelector(b[0], a) ? [b[0]] : [] : f.find.matches(a, b)
        },
        dir: function(a, c, d) {
            var e = [],
                g = a[c];
            while (g && g.nodeType !== 9 && (d === b || g.nodeType !== 1 || !f(g).is(d))) g.nodeType === 1 && e.push(g), g = g[c];
            return e
        },
        nth: function(a, b, c, d) {
            b = b || 1;
            var e = 0;
            for (; a; a = a[c])
                if (a.nodeType === 1 && ++e === b) break;
            return a
        },
        sibling: function(a, b) {
            var c = [];
            for (; a; a = a.nextSibling) a.nodeType === 1 && a !== b && c.push(a);
            return c
        }
    });
    var V = "abbr|article|aside|audio|bdi|canvas|data|datalist|details|figcaption|figure|footer|header|hgroup|mark|meter|nav|output|progress|section|summary|time|video",
        W = / jQuery\d+="(?:\d+|null)"/g,
        X = /^\s+/,
        Y = /<(?!area|br|col|embed|hr|img|input|link|meta|param)(([\w:]+)[^>]*)\/>/ig,
        Z = /<([\w:]+)/,
        $ = /<tbody/i,
        _ = /<|&#?\w+;/,
        ba = /<(?:script|style)/i,
        bb = /<(?:script|object|embed|option|style)/i,
        bc = new RegExp("<(?:" + V + ")[\\s/>]", "i"),
        bd = /checked\s*(?:[^=]|=\s*.checked.)/i,
        be = /\/(java|ecma)script/i,
        bf = /^\s*<!(?:\[CDATA\[|\-\-)/,
        bg = {
            option: [1, "<select multiple='multiple'>", "</select>"],
            legend: [1, "<fieldset>", "</fieldset>"],
            thead: [1, "<table>", "</table>"],
            tr: [2, "<table><tbody>", "</tbody></table>"],
            td: [3, "<table><tbody><tr>", "</tr></tbody></table>"],
            col: [2, "<table><tbody></tbody><colgroup>", "</colgroup></table>"],
            area: [1, "<map>", "</map>"],
            _default: [0, "", ""]
        },
        bh = U(c);
    bg.optgroup = bg.option, bg.tbody = bg.tfoot = bg.colgroup = bg.caption = bg.thead, bg.th = bg.td, f.support.htmlSerialize || (bg._default = [1, "div<div>", "</div>"]), f.fn.extend({
        text: function(a) {
            return f.access(this, function(a) {
                return a === b ? f.text(this) : this.empty().append((this[0] && this[0].ownerDocument || c).createTextNode(a))
            }, null, a, arguments.length)
        },
        wrapAll: function(a) {
            if (f.isFunction(a)) return this.each(function(b) {
                f(this).wrapAll(a.call(this, b))
            });
            if (this[0]) {
                var b = f(a, this[0].ownerDocument).eq(0).clone(!0);
                this[0].parentNode && b.insertBefore(this[0]), b.map(function() {
                    var a = this;
                    while (a.firstChild && a.firstChild.nodeType === 1) a = a.firstChild;
                    return a
                }).append(this)
            }
            return this
        },
        wrapInner: function(a) {
            if (f.isFunction(a)) return this.each(function(b) {
                f(this).wrapInner(a.call(this, b))
            });
            return this.each(function() {
                var b = f(this),
                    c = b.contents();
                c.length ? c.wrapAll(a) : b.append(a)
            })
        },
        wrap: function(a) {
            var b = f.isFunction(a);
            return this.each(function(c) {
                f(this).wrapAll(b ? a.call(this, c) : a)
            })
        },
        unwrap: function() {
            return this.parent().each(function() {
                f.nodeName(this, "body") || f(this).replaceWith(this.childNodes)
            }).end()
        },
        append: function() {
            return this.domManip(arguments, !0, function(a) {
                this.nodeType === 1 && this.appendChild(a)
            })
        },
        prepend: function() {
            return this.domManip(arguments, !0, function(a) {
                this.nodeType === 1 && this.insertBefore(a, this.firstChild)
            })
        },
        before: function() {
            if (this[0] && this[0].parentNode) return this.domManip(arguments, !1, function(a) {
                this.parentNode.insertBefore(a, this)
            });
            if (arguments.length) {
                var a = f.clean(arguments);
                a.push.apply(a, this.toArray());
                return this.pushStack(a, "before", arguments)
            }
        },
        after: function() {
            if (this[0] && this[0].parentNode) return this.domManip(arguments, !1, function(a) {
                this.parentNode.insertBefore(a, this.nextSibling)
            });
            if (arguments.length) {
                var a = this.pushStack(this, "after", arguments);
                a.push.apply(a, f.clean(arguments));
                return a
            }
        },
        remove: function(a, b) {
            for (var c = 0, d;
                (d = this[c]) != null; c++)
                if (!a || f.filter(a, [d]).length) !b && d.nodeType === 1 && (f.cleanData(d.getElementsByTagName("*")), f.cleanData([d])), d.parentNode && d.parentNode.removeChild(d);
            return this
        },
        empty: function() {
            for (var a = 0, b;
                (b = this[a]) != null; a++) {
                b.nodeType === 1 && f.cleanData(b.getElementsByTagName("*"));
                while (b.firstChild) b.removeChild(b.firstChild)
            }
            return this
        },
        clone: function(a, b) {
            a = a == null ? !1 : a, b = b == null ? a : b;
            return this.map(function() {
                return f.clone(this, a, b)
            })
        },
        html: function(a) {
            return f.access(this, function(a) {
                var c = this[0] || {},
                    d = 0,
                    e = this.length;
                if (a === b) return c.nodeType === 1 ? c.innerHTML.replace(W, "") : null;
                if (typeof a == "string" && !ba.test(a) && (f.support.leadingWhitespace || !X.test(a)) && !bg[(Z.exec(a) || ["", ""])[1].toLowerCase()]) {
                    a = a.replace(Y, "<$1></$2>");
                    try {
                        for (; d < e; d++) c = this[d] || {}, c.nodeType === 1 && (f.cleanData(c.getElementsByTagName("*")), c.innerHTML = a);
                        c = 0
                    } catch (g) {}
                }
                c && this.empty().append(a)
            }, null, a, arguments.length)
        },
        replaceWith: function(a) {
            if (this[0] && this[0].parentNode) {
                if (f.isFunction(a)) return this.each(function(b) {
                    var c = f(this),
                        d = c.html();
                    c.replaceWith(a.call(this, b, d))
                });
                typeof a != "string" && (a = f(a).detach());
                return this.each(function() {
                    var b = this.nextSibling,
                        c = this.parentNode;
                    f(this).remove(), b ? f(b).before(a) : f(c).append(a)
                })
            }
            return this.length ? this.pushStack(f(f.isFunction(a) ? a() : a), "replaceWith", a) : this
        },
        detach: function(a) {
            return this.remove(a, !0)
        },
        domManip: function(a, c, d) {
            var e, g, h, i, j = a[0],
                k = [];
            if (!f.support.checkClone && arguments.length === 3 && typeof j == "string" && bd.test(j)) return this.each(function() {
                f(this).domManip(a, c, d, !0)
            });
            if (f.isFunction(j)) return this.each(function(e) {
                var g = f(this);
                a[0] = j.call(this, e, c ? g.html() : b), g.domManip(a, c, d)
            });
            if (this[0]) {
                i = j && j.parentNode, f.support.parentNode && i && i.nodeType === 11 && i.childNodes.length === this.length ? e = {
                    fragment: i
                } : e = f.buildFragment(a, this, k), h = e.fragment, h.childNodes.length === 1 ? g = h = h.firstChild : g = h.firstChild;
                if (g) {
                    c = c && f.nodeName(g, "tr");
                    for (var l = 0, m = this.length, n = m - 1; l < m; l++) d.call(c ? bi(this[l], g) : this[l], e.cacheable || m > 1 && l < n ? f.clone(h, !0, !0) : h)
                }
                k.length && f.each(k, function(a, b) {
                    b.src ? f.ajax({
                        type: "GET",
                        global: !1,
                        url: b.src,
                        async: !1,
                        dataType: "script"
                    }) : f.globalEval((b.text || b.textContent || b.innerHTML || "").replace(bf, "/*$0*/")), b.parentNode && b.parentNode.removeChild(b)
                })
            }
            return this
        }
    }), f.buildFragment = function(a, b, d) {
        var e, g, h, i, j = a[0];
        b && b[0] && (i = b[0].ownerDocument || b[0]), i.createDocumentFragment || (i = c), a.length === 1 && typeof j == "string" && j.length < 512 && i === c && j.charAt(0) === "<" && !bb.test(j) && (f.support.checkClone || !bd.test(j)) && (f.support.html5Clone || !bc.test(j)) && (g = !0, h = f.fragments[j], h && h !== 1 && (e = h)), e || (e = i.createDocumentFragment(), f.clean(a, i, e, d)), g && (f.fragments[j] = h ? e : 1);
        return {
            fragment: e,
            cacheable: g
        }
    }, f.fragments = {}, f.each({
        appendTo: "append",
        prependTo: "prepend",
        insertBefore: "before",
        insertAfter: "after",
        replaceAll: "replaceWith"
    }, function(a, b) {
        f.fn[a] = function(c) {
            var d = [],
                e = f(c),
                g = this.length === 1 && this[0].parentNode;
            if (g && g.nodeType === 11 && g.childNodes.length === 1 && e.length === 1) {
                e[b](this[0]);
                return this
            }
            for (var h = 0, i = e.length; h < i; h++) {
                var j = (h > 0 ? this.clone(!0) : this).get();
                f(e[h])[b](j), d = d.concat(j)
            }
            return this.pushStack(d, a, e.selector)
        }
    }), f.extend({
        clone: function(a, b, c) {
            var d, e, g, h = f.support.html5Clone || f.isXMLDoc(a) || !bc.test("<" + a.nodeName + ">") ? a.cloneNode(!0) : bo(a);
            if ((!f.support.noCloneEvent || !f.support.noCloneChecked) && (a.nodeType === 1 || a.nodeType === 11) && !f.isXMLDoc(a)) {
                bk(a, h), d = bl(a), e = bl(h);
                for (g = 0; d[g]; ++g) e[g] && bk(d[g], e[g])
            }
            if (b) {
                bj(a, h);
                if (c) {
                    d = bl(a), e = bl(h);
                    for (g = 0; d[g]; ++g) bj(d[g], e[g])
                }
            }
            d = e = null;
            return h
        },
        clean: function(a, b, d, e) {
            var g, h, i, j = [];
            b = b || c, typeof b.createElement == "undefined" && (b = b.ownerDocument || b[0] && b[0].ownerDocument || c);
            for (var k = 0, l;
                (l = a[k]) != null; k++) {
                typeof l == "number" && (l += "");
                if (!l) continue;
                if (typeof l == "string")
                    if (!_.test(l)) l = b.createTextNode(l);
                    else {
                        l = l.replace(Y, "<$1></$2>");
                        var m = (Z.exec(l) || ["", ""])[1].toLowerCase(),
                            n = bg[m] || bg._default,
                            o = n[0],
                            p = b.createElement("div"),
                            q = bh.childNodes,
                            r;
                        b === c ? bh.appendChild(p) : U(b).appendChild(p), p.innerHTML = n[1] + l + n[2];
                        while (o--) p = p.lastChild;
                        if (!f.support.tbody) {
                            var s = $.test(l),
                                t = m === "table" && !s ? p.firstChild && p.firstChild.childNodes : n[1] === "<table>" && !s ? p.childNodes : [];
                            for (i = t.length - 1; i >= 0; --i) f.nodeName(t[i], "tbody") && !t[i].childNodes.length && t[i].parentNode.removeChild(t[i])
                        }!f.support.leadingWhitespace && X.test(l) && p.insertBefore(b.createTextNode(X.exec(l)[0]), p.firstChild), l = p.childNodes, p && (p.parentNode.removeChild(p), q.length > 0 && (r = q[q.length - 1], r && r.parentNode && r.parentNode.removeChild(r)))
                    }
                var u;
                if (!f.support.appendChecked)
                    if (l[0] && typeof(u = l.length) == "number")
                        for (i = 0; i < u; i++) bn(l[i]);
                    else bn(l);
                l.nodeType ? j.push(l) : j = f.merge(j, l)
            }
            if (d) {
                g = function(a) {
                    return !a.type || be.test(a.type)
                };
                for (k = 0; j[k]; k++) {
                    h = j[k];
                    if (e && f.nodeName(h, "script") && (!h.type || be.test(h.type))) e.push(h.parentNode ? h.parentNode.removeChild(h) : h);
                    else {
                        if (h.nodeType === 1) {
                            var v = f.grep(h.getElementsByTagName("script"), g);
                            j.splice.apply(j, [k + 1, 0].concat(v))
                        }
                        d.appendChild(h)
                    }
                }
            }
            return j
        },
        cleanData: function(a) {
            var b, c, d = f.cache,
                e = f.event.special,
                g = f.support.deleteExpando;
            for (var h = 0, i;
                (i = a[h]) != null; h++) {
                if (i.nodeName && f.noData[i.nodeName.toLowerCase()]) continue;
                c = i[f.expando];
                if (c) {
                    b = d[c];
                    if (b && b.events) {
                        for (var j in b.events) e[j] ? f.event.remove(i, j) : f.removeEvent(i, j, b.handle);
                        b.handle && (b.handle.elem = null)
                    }
                    g ? delete i[f.expando] : i.removeAttribute && i.removeAttribute(f.expando), delete d[c]
                }
            }
        }
    });
    var bp = /alpha\([^)]*\)/i,
        bq = /opacity=([^)]*)/,
        br = /([A-Z]|^ms)/g,
        bs = /^[\-+]?(?:\d*\.)?\d+$/i,
        bt = /^-?(?:\d*\.)?\d+(?!px)[^\d\s]+$/i,
        bu = /^([\-+])=([\-+.\de]+)/,
        bv = /^margin/,
        bw = {
            position: "absolute",
            visibility: "hidden",
            display: "block"
        },
        bx = ["Top", "Right", "Bottom", "Left"],
        by, bz, bA;
    f.fn.css = function(a, c) {
        return f.access(this, function(a, c, d) {
            return d !== b ? f.style(a, c, d) : f.css(a, c)
        }, a, c, arguments.length > 1)
    }, f.extend({
        cssHooks: {
            opacity: {
                get: function(a, b) {
                    if (b) {
                        var c = by(a, "opacity");
                        return c === "" ? "1" : c
                    }
                    return a.style.opacity
                }
            }
        },
        cssNumber: {
            fillOpacity: !0,
            fontWeight: !0,
            lineHeight: !0,
            opacity: !0,
            orphans: !0,
            widows: !0,
            zIndex: !0,
            zoom: !0
        },
        cssProps: {
            "float": f.support.cssFloat ? "cssFloat" : "styleFloat"
        },
        style: function(a, c, d, e) {
            if (!!a && a.nodeType !== 3 && a.nodeType !== 8 && !!a.style) {
                var g, h, i = f.camelCase(c),
                    j = a.style,
                    k = f.cssHooks[i];
                c = f.cssProps[i] || i;
                if (d === b) {
                    if (k && "get" in k && (g = k.get(a, !1, e)) !== b) return g;
                    return j[c]
                }
                h = typeof d, h === "string" && (g = bu.exec(d)) && (d = +(g[1] + 1) * +g[2] + parseFloat(f.css(a, c)), h = "number");
                if (d == null || h === "number" && isNaN(d)) return;
                h === "number" && !f.cssNumber[i] && (d += "px");
                if (!k || !("set" in k) || (d = k.set(a, d)) !== b) try {
                    j[c] = d
                } catch (l) {}
            }
        },
        css: function(a, c, d) {
            var e, g;
            c = f.camelCase(c), g = f.cssHooks[c], c = f.cssProps[c] || c, c === "cssFloat" && (c = "float");
            if (g && "get" in g && (e = g.get(a, !0, d)) !== b) return e;
            if (by) return by(a, c)
        },
        swap: function(a, b, c) {
            var d = {},
                e, f;
            for (f in b) d[f] = a.style[f], a.style[f] = b[f];
            e = c.call(a);
            for (f in b) a.style[f] = d[f];
            return e
        }
    }), f.curCSS = f.css, c.defaultView && c.defaultView.getComputedStyle && (bz = function(a, b) {
        var c, d, e, g, h = a.style;
        b = b.replace(br, "-$1").toLowerCase(), (d = a.ownerDocument.defaultView) && (e = d.getComputedStyle(a, null)) && (c = e.getPropertyValue(b), c === "" && !f.contains(a.ownerDocument.documentElement, a) && (c = f.style(a, b))), !f.support.pixelMargin && e && bv.test(b) && bt.test(c) && (g = h.width, h.width = c, c = e.width, h.width = g);
        return c
    }), c.documentElement.currentStyle && (bA = function(a, b) {
        var c, d, e, f = a.currentStyle && a.currentStyle[b],
            g = a.style;
        f == null && g && (e = g[b]) && (f = e), bt.test(f) && (c = g.left, d = a.runtimeStyle && a.runtimeStyle.left, d && (a.runtimeStyle.left = a.currentStyle.left), g.left = b === "fontSize" ? "1em" : f, f = g.pixelLeft + "px", g.left = c, d && (a.runtimeStyle.left = d));
        return f === "" ? "auto" : f
    }), by = bz || bA, f.each(["height", "width"], function(a, b) {
        f.cssHooks[b] = {
            get: function(a, c, d) {
                if (c) return a.offsetWidth !== 0 ? bB(a, b, d) : f.swap(a, bw, function() {
                    return bB(a, b, d)
                })
            },
            set: function(a, b) {
                return bs.test(b) ? b + "px" : b
            }
        }
    }), f.support.opacity || (f.cssHooks.opacity = {
        get: function(a, b) {
            return bq.test((b && a.currentStyle ? a.currentStyle.filter : a.style.filter) || "") ? parseFloat(RegExp.$1) / 100 + "" : b ? "1" : ""
        },
        set: function(a, b) {
            var c = a.style,
                d = a.currentStyle,
                e = f.isNumeric(b) ? "alpha(opacity=" + b * 100 + ")" : "",
                g = d && d.filter || c.filter || "";
            c.zoom = 1;
            if (b >= 1 && f.trim(g.replace(bp, "")) === "") {
                c.removeAttribute("filter");
                if (d && !d.filter) return
            }
            c.filter = bp.test(g) ? g.replace(bp, e) : g + " " + e
        }
    }), f(function() {
        f.support.reliableMarginRight || (f.cssHooks.marginRight = {
            get: function(a, b) {
                return f.swap(a, {
                    display: "inline-block"
                }, function() {
                    return b ? by(a, "margin-right") : a.style.marginRight
                })
            }
        })
    }), f.expr && f.expr.filters && (f.expr.filters.hidden = function(a) {
        var b = a.offsetWidth,
            c = a.offsetHeight;
        return b === 0 && c === 0 || !f.support.reliableHiddenOffsets && (a.style && a.style.display || f.css(a, "display")) === "none"
    }, f.expr.filters.visible = function(a) {
        return !f.expr.filters.hidden(a)
    }), f.each({
        margin: "",
        padding: "",
        border: "Width"
    }, function(a, b) {
        f.cssHooks[a + b] = {
            expand: function(c) {
                var d, e = typeof c == "string" ? c.split(" ") : [c],
                    f = {};
                for (d = 0; d < 4; d++) f[a + bx[d] + b] = e[d] || e[d - 2] || e[0];
                return f
            }
        }
    });
    var bC = /%20/g,
        bD = /\[\]$/,
        bE = /\r?\n/g,
        bF = /#.*$/,
        bG = /^(.*?):[ \t]*([^\r\n]*)\r?$/mg,
        bH = /^(?:color|date|datetime|datetime-local|email|hidden|month|number|password|range|search|tel|text|time|url|week)$/i,
        bI = /^(?:about|app|app\-storage|.+\-extension|file|res|widget):$/,
        bJ = /^(?:GET|HEAD)$/,
        bK = /^\/\//,
        bL = /\?/,
        bM = /<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi,
        bN = /^(?:select|textarea)/i,
        bO = /\s+/,
        bP = /([?&])_=[^&]*/,
        bQ = /^([\w\+\.\-]+:)(?:\/\/([^\/?#:]*)(?::(\d+))?)?/,
        bR = f.fn.load,
        bS = {},
        bT = {},
        bU, bV, bW = ["*/"] + ["*"];
    try {
        bU = e.href
    } catch (bX) {
        bU = c.createElement("a"), bU.href = "", bU = bU.href
    }
    bV = bQ.exec(bU.toLowerCase()) || [], f.fn.extend({
        load: function(a, c, d) {
            if (typeof a != "string" && bR) return bR.apply(this, arguments);
            if (!this.length) return this;
            var e = a.indexOf(" ");
            if (e >= 0) {
                var g = a.slice(e, a.length);
                a = a.slice(0, e)
            }
            var h = "GET";
            c && (f.isFunction(c) ? (d = c, c = b) : typeof c == "object" && (c = f.param(c, f.ajaxSettings.traditional), h = "POST"));
            var i = this;
            f.ajax({
                url: a,
                type: h,
                dataType: "html",
                data: c,
                complete: function(a, b, c) {
                    c = a.responseText, a.isResolved() && (a.done(function(a) {
                        c = a
                    }), i.html(g ? f("<div>").append(c.replace(bM, "")).find(g) : c)), d && i.each(d, [c, b, a])
                }
            });
            return this
        },
        serialize: function() {
            return f.param(this.serializeArray())
        },
        serializeArray: function() {
            return this.map(function() {
                return this.elements ? f.makeArray(this.elements) : this
            }).filter(function() {
                return this.name && !this.disabled && (this.checked || bN.test(this.nodeName) || bH.test(this.type))
            }).map(function(a, b) {
                var c = f(this).val();
                return c == null ? null : f.isArray(c) ? f.map(c, function(a, c) {
                    return {
                        name: b.name,
                        value: a.replace(bE, "\r\n")
                    }
                }) : {
                    name: b.name,
                    value: c.replace(bE, "\r\n")
                }
            }).get()
        }
    }), f.each("ajaxStart ajaxStop ajaxComplete ajaxError ajaxSuccess ajaxSend".split(" "), function(a, b) {
        f.fn[b] = function(a) {
            return this.on(b, a)
        }
    }), f.each(["get", "post"], function(a, c) {
        f[c] = function(a, d, e, g) {
            f.isFunction(d) && (g = g || e, e = d, d = b);
            return f.ajax({
                type: c,
                url: a,
                data: d,
                success: e,
                dataType: g
            })
        }
    }), f.extend({
        getScript: function(a, c) {
            return f.get(a, b, c, "script")
        },
        getJSON: function(a, b, c) {
            return f.get(a, b, c, "json")
        },
        ajaxSetup: function(a, b) {
            b ? b$(a, f.ajaxSettings) : (b = a, a = f.ajaxSettings), b$(a, b);
            return a
        },
        ajaxSettings: {
            url: bU,
            isLocal: bI.test(bV[1]),
            global: !0,
            type: "GET",
            contentType: "application/x-www-form-urlencoded; charset=UTF-8",
            processData: !0,
            async: !0,
            accepts: {
                xml: "application/xml, text/xml",
                html: "text/html",
                text: "text/plain",
                json: "application/json, text/javascript",
                "*": bW
            },
            contents: {
                xml: /xml/,
                html: /html/,
                json: /json/
            },
            responseFields: {
                xml: "responseXML",
                text: "responseText"
            },
            converters: {
                "* text": a.String,
                "text html": !0,
                "text json": f.parseJSON,
                "text xml": f.parseXML
            },
            flatOptions: {
                context: !0,
                url: !0
            }
        },
        ajaxPrefilter: bY(bS),
        ajaxTransport: bY(bT),
        ajax: function(a, c) {
            function w(a, c, l, m) {
                if (s !== 2) {
                    s = 2, q && clearTimeout(q), p = b, n = m || "", v.readyState = a > 0 ? 4 : 0;
                    var o, r, u, w = c,
                        x = l ? ca(d, v, l) : b,
                        y, z;
                    if (a >= 200 && a < 300 || a === 304) {
                        if (d.ifModified) {
                            if (y = v.getResponseHeader("Last-Modified")) f.lastModified[k] = y;
                            if (z = v.getResponseHeader("Etag")) f.etag[k] = z
                        }
                        if (a === 304) w = "notmodified", o = !0;
                        else try {
                            r = cb(d, x), w = "success", o = !0
                        } catch (A) {
                            w = "parsererror", u = A
                        }
                    } else {
                        u = w;
                        if (!w || a) w = "error", a < 0 && (a = 0)
                    }
                    v.status = a, v.statusText = "" + (c || w), o ? h.resolveWith(e, [r, w, v]) : h.rejectWith(e, [v, w, u]), v.statusCode(j), j = b, t && g.trigger("ajax" + (o ? "Success" : "Error"), [v, d, o ? r : u]), i.fireWith(e, [v, w]), t && (g.trigger("ajaxComplete", [v, d]), --f.active || f.event.trigger("ajaxStop"))
                }
            }
            typeof a == "object" && (c = a, a = b), c = c || {};
            var d = f.ajaxSetup({}, c),
                e = d.context || d,
                g = e !== d && (e.nodeType || e instanceof f) ? f(e) : f.event,
                h = f.Deferred(),
                i = f.Callbacks("once memory"),
                j = d.statusCode || {},
                k, l = {},
                m = {},
                n, o, p, q, r, s = 0,
                t, u, v = {
                    readyState: 0,
                    setRequestHeader: function(a, b) {
                        if (!s) {
                            var c = a.toLowerCase();
                            a = m[c] = m[c] || a, l[a] = b
                        }
                        return this
                    },
                    getAllResponseHeaders: function() {
                        return s === 2 ? n : null
                    },
                    getResponseHeader: function(a) {
                        var c;
                        if (s === 2) {
                            if (!o) {
                                o = {};
                                while (c = bG.exec(n)) o[c[1].toLowerCase()] = c[2]
                            }
                            c = o[a.toLowerCase()]
                        }
                        return c === b ? null : c
                    },
                    overrideMimeType: function(a) {
                        s || (d.mimeType = a);
                        return this
                    },
                    abort: function(a) {
                        a = a || "abort", p && p.abort(a), w(0, a);
                        return this
                    }
                };
            h.promise(v), v.success = v.done, v.error = v.fail, v.complete = i.add, v.statusCode = function(a) {
                if (a) {
                    var b;
                    if (s < 2)
                        for (b in a) j[b] = [j[b], a[b]];
                    else b = a[v.status], v.then(b, b)
                }
                return this
            }, d.url = ((a || d.url) + "").replace(bF, "").replace(bK, bV[1] + "//"), d.dataTypes = f.trim(d.dataType || "*").toLowerCase().split(bO), d.crossDomain == null && (r = bQ.exec(d.url.toLowerCase()), d.crossDomain = !(!r || r[1] == bV[1] && r[2] == bV[2] && (r[3] || (r[1] === "http:" ? 80 : 443)) == (bV[3] || (bV[1] === "http:" ? 80 : 443)))), d.data && d.processData && typeof d.data != "string" && (d.data = f.param(d.data, d.traditional)), bZ(bS, d, c, v);
            if (s === 2) return !1;
            t = d.global, d.type = d.type.toUpperCase(), d.hasContent = !bJ.test(d.type), t && f.active++ === 0 && f.event.trigger("ajaxStart");
            if (!d.hasContent) {
                d.data && (d.url += (bL.test(d.url) ? "&" : "?") + d.data, delete d.data), k = d.url;
                if (d.cache === !1) {
                    var x = f.now(),
                        y = d.url.replace(bP, "$1_=" + x);
                    d.url = y + (y === d.url ? (bL.test(d.url) ? "&" : "?") + "_=" + x : "")
                }
            }(d.data && d.hasContent && d.contentType !== !1 || c.contentType) && v.setRequestHeader("Content-Type", d.contentType), d.ifModified && (k = k || d.url, f.lastModified[k] && v.setRequestHeader("If-Modified-Since", f.lastModified[k]), f.etag[k] && v.setRequestHeader("If-None-Match", f.etag[k])), v.setRequestHeader("Accept", d.dataTypes[0] && d.accepts[d.dataTypes[0]] ? d.accepts[d.dataTypes[0]] + (d.dataTypes[0] !== "*" ? ", " + bW + "; q=0.01" : "") : d.accepts["*"]);
            for (u in d.headers) v.setRequestHeader(u, d.headers[u]);
            if (d.beforeSend && (d.beforeSend.call(e, v, d) === !1 || s === 2)) {
                v.abort();
                return !1
            }
            for (u in {
                    success: 1,
                    error: 1,
                    complete: 1
                }) v[u](d[u]);
            p = bZ(bT, d, c, v);
            if (!p) w(-1, "No Transport");
            else {
                v.readyState = 1, t && g.trigger("ajaxSend", [v, d]), d.async && d.timeout > 0 && (q = setTimeout(function() {
                    v.abort("timeout")
                }, d.timeout));
                try {
                    s = 1, p.send(l, w)
                } catch (z) {
                    if (s < 2) w(-1, z);
                    else throw z
                }
            }
            return v
        },
        param: function(a, c) {
            var d = [],
                e = function(a, b) {
                    b = f.isFunction(b) ? b() : b, d[d.length] = encodeURIComponent(a) + "=" + encodeURIComponent(b)
                };
            c === b && (c = f.ajaxSettings.traditional);
            if (f.isArray(a) || a.jquery && !f.isPlainObject(a)) f.each(a, function() {
                e(this.name, this.value)
            });
            else
                for (var g in a) b_(g, a[g], c, e);
            return d.join("&").replace(bC, "+")
        }
    }), f.extend({
        active: 0,
        lastModified: {},
        etag: {}
    });
    var cc = f.now(),
        cd = /(\=)\?(&|$)|\?\?/i;
    f.ajaxSetup({
        jsonp: "callback",
        jsonpCallback: function() {
            return f.expando + "_" + cc++
        }
    }), f.ajaxPrefilter("json jsonp", function(b, c, d) {
        var e = typeof b.data == "string" && /^application\/x\-www\-form\-urlencoded/.test(b.contentType);
        if (b.dataTypes[0] === "jsonp" || b.jsonp !== !1 && (cd.test(b.url) || e && cd.test(b.data))) {
            var g, h = b.jsonpCallback = f.isFunction(b.jsonpCallback) ? b.jsonpCallback() : b.jsonpCallback,
                i = a[h],
                j = b.url,
                k = b.data,
                l = "$1" + h + "$2";
            b.jsonp !== !1 && (j = j.replace(cd, l), b.url === j && (e && (k = k.replace(cd, l)), b.data === k && (j += (/\?/.test(j) ? "&" : "?") + b.jsonp + "=" + h))), b.url = j, b.data = k, a[h] = function(a) {
                g = [a]
            }, d.always(function() {
                a[h] = i, g && f.isFunction(i) && a[h](g[0])
            }), b.converters["script json"] = function() {
                g || f.error(h + " was not called");
                return g[0]
            }, b.dataTypes[0] = "json";
            return "script"
        }
    }), f.ajaxSetup({
        accepts: {
            script: "text/javascript, application/javascript, application/ecmascript, application/x-ecmascript"
        },
        contents: {
            script: /javascript|ecmascript/
        },
        converters: {
            "text script": function(a) {
                f.globalEval(a);
                return a
            }
        }
    }), f.ajaxPrefilter("script", function(a) {
        a.cache === b && (a.cache = !1), a.crossDomain && (a.type = "GET", a.global = !1)
    }), f.ajaxTransport("script", function(a) {
        if (a.crossDomain) {
            var d, e = c.head || c.getElementsByTagName("head")[0] || c.documentElement;
            return {
                send: function(f, g) {
                    d = c.createElement("script"), d.async = "async", a.scriptCharset && (d.charset = a.scriptCharset), d.src = a.url, d.onload = d.onreadystatechange = function(a, c) {
                        if (c || !d.readyState || /loaded|complete/.test(d.readyState)) d.onload = d.onreadystatechange = null, e && d.parentNode && e.removeChild(d), d = b, c || g(200, "success")
                    }, e.insertBefore(d, e.firstChild)
                },
                abort: function() {
                    d && d.onload(0, 1)
                }
            }
        }
    });
    var ce = a.ActiveXObject ? function() {
            for (var a in cg) cg[a](0, 1)
        } : !1,
        cf = 0,
        cg;
    f.ajaxSettings.xhr = a.ActiveXObject ? function() {
            return !this.isLocal && ch() || ci()
        } : ch,
        function(a) {
            f.extend(f.support, {
                ajax: !!a,
                cors: !!a && "withCredentials" in a
            })
        }(f.ajaxSettings.xhr()), f.support.ajax && f.ajaxTransport(function(c) {
            if (!c.crossDomain || f.support.cors) {
                var d;
                return {
                    send: function(e, g) {
                        var h = c.xhr(),
                            i, j;
                        c.username ? h.open(c.type, c.url, c.async, c.username, c.password) : h.open(c.type, c.url, c.async);
                        if (c.xhrFields)
                            for (j in c.xhrFields) h[j] = c.xhrFields[j];
                        c.mimeType && h.overrideMimeType && h.overrideMimeType(c.mimeType), !c.crossDomain && !e["X-Requested-With"] && (e["X-Requested-With"] = "XMLHttpRequest");
                        try {
                            for (j in e) h.setRequestHeader(j, e[j])
                        } catch (k) {}
                        h.send(c.hasContent && c.data || null), d = function(a, e) {
                            var j, k, l, m, n;
                            try {
                                if (d && (e || h.readyState === 4)) {
                                    d = b, i && (h.onreadystatechange = f.noop, ce && delete cg[i]);
                                    if (e) h.readyState !== 4 && h.abort();
                                    else {
                                        j = h.status, l = h.getAllResponseHeaders(), m = {}, n = h.responseXML, n && n.documentElement && (m.xml = n);
                                        try {
                                            m.text = h.responseText
                                        } catch (a) {}
                                        try {
                                            k = h.statusText
                                        } catch (o) {
                                            k = ""
                                        }!j && c.isLocal && !c.crossDomain ? j = m.text ? 200 : 404 : j === 1223 && (j = 204)
                                    }
                                }
                            } catch (p) {
                                e || g(-1, p)
                            }
                            m && g(j, k, m, l)
                        }, !c.async || h.readyState === 4 ? d() : (i = ++cf, ce && (cg || (cg = {}, f(a).unload(ce)), cg[i] = d), h.onreadystatechange = d)
                    },
                    abort: function() {
                        d && d(0, 1)
                    }
                }
            }
        });
    var cj = {},
        ck, cl, cm = /^(?:toggle|show|hide)$/,
        cn = /^([+\-]=)?([\d+.\-]+)([a-z%]*)$/i,
        co, cp = [
            ["height", "marginTop", "marginBottom", "paddingTop", "paddingBottom"],
            ["width", "marginLeft", "marginRight", "paddingLeft", "paddingRight"],
            ["opacity"]
        ],
        cq;
    f.fn.extend({
        show: function(a, b, c) {
            var d, e;
            if (a || a === 0) return this.animate(ct("show", 3), a, b, c);
            for (var g = 0, h = this.length; g < h; g++) d = this[g], d.style && (e = d.style.display, !f._data(d, "olddisplay") && e === "none" && (e = d.style.display = ""), (e === "" && f.css(d, "display") === "none" || !f.contains(d.ownerDocument.documentElement, d)) && f._data(d, "olddisplay", cu(d.nodeName)));
            for (g = 0; g < h; g++) {
                d = this[g];
                if (d.style) {
                    e = d.style.display;
                    if (e === "" || e === "none") d.style.display = f._data(d, "olddisplay") || ""
                }
            }
            return this
        },
        hide: function(a, b, c) {
            if (a || a === 0) return this.animate(ct("hide", 3), a, b, c);
            var d, e, g = 0,
                h = this.length;
            for (; g < h; g++) d = this[g], d.style && (e = f.css(d, "display"), e !== "none" && !f._data(d, "olddisplay") && f._data(d, "olddisplay", e));
            for (g = 0; g < h; g++) this[g].style && (this[g].style.display = "none");
            return this
        },
        _toggle: f.fn.toggle,
        toggle: function(a, b, c) {
            var d = typeof a == "boolean";
            f.isFunction(a) && f.isFunction(b) ? this._toggle.apply(this, arguments) : a == null || d ? this.each(function() {
                var b = d ? a : f(this).is(":hidden");
                f(this)[b ? "show" : "hide"]()
            }) : this.animate(ct("toggle", 3), a, b, c);
            return this
        },
        fadeTo: function(a, b, c, d) {
            return this.filter(":hidden").css("opacity", 0).show().end().animate({
                opacity: b
            }, a, c, d)
        },
        animate: function(a, b, c, d) {
            function g() {
                e.queue === !1 && f._mark(this);
                var b = f.extend({}, e),
                    c = this.nodeType === 1,
                    d = c && f(this).is(":hidden"),
                    g, h, i, j, k, l, m, n, o, p, q;
                b.animatedProperties = {};
                for (i in a) {
                    g = f.camelCase(i), i !== g && (a[g] = a[i], delete a[i]);
                    if ((k = f.cssHooks[g]) && "expand" in k) {
                        l = k.expand(a[g]), delete a[g];
                        for (i in l) i in a || (a[i] = l[i])
                    }
                }
                for (g in a) {
                    h = a[g], f.isArray(h) ? (b.animatedProperties[g] = h[1], h = a[g] = h[0]) : b.animatedProperties[g] = b.specialEasing && b.specialEasing[g] || b.easing || "swing";
                    if (h === "hide" && d || h === "show" && !d) return b.complete.call(this);
                    c && (g === "height" || g === "width") && (b.overflow = [this.style.overflow, this.style.overflowX, this.style.overflowY], f.css(this, "display") === "inline" && f.css(this, "float") === "none" && (!f.support.inlineBlockNeedsLayout || cu(this.nodeName) === "inline" ? this.style.display = "inline-block" : this.style.zoom = 1))
                }
                b.overflow != null && (this.style.overflow = "hidden");
                for (i in a) j = new f.fx(this, b, i), h = a[i], cm.test(h) ? (q = f._data(this, "toggle" + i) || (h === "toggle" ? d ? "show" : "hide" : 0), q ? (f._data(this, "toggle" + i, q === "show" ? "hide" : "show"), j[q]()) : j[h]()) : (m = cn.exec(h), n = j.cur(), m ? (o = parseFloat(m[2]), p = m[3] || (f.cssNumber[i] ? "" : "px"), p !== "px" && (f.style(this, i, (o || 1) + p), n = (o || 1) / j.cur() * n, f.style(this, i, n + p)), m[1] && (o = (m[1] === "-=" ? -1 : 1) * o + n), j.custom(n, o, p)) : j.custom(n, h, ""));
                return !0
            }
            var e = f.speed(b, c, d);
            if (f.isEmptyObject(a)) return this.each(e.complete, [!1]);
            a = f.extend({}, a);
            return e.queue === !1 ? this.each(g) : this.queue(e.queue, g)
        },
        stop: function(a, c, d) {
            typeof a != "string" && (d = c, c = a, a = b), c && a !== !1 && this.queue(a || "fx", []);
            return this.each(function() {
                function h(a, b, c) {
                    var e = b[c];
                    f.removeData(a, c, !0), e.stop(d)
                }
                var b, c = !1,
                    e = f.timers,
                    g = f._data(this);
                d || f._unmark(!0, this);
                if (a == null)
                    for (b in g) g[b] && g[b].stop && b.indexOf(".run") === b.length - 4 && h(this, g, b);
                else g[b = a + ".run"] && g[b].stop && h(this, g, b);
                for (b = e.length; b--;) e[b].elem === this && (a == null || e[b].queue === a) && (d ? e[b](!0) : e[b].saveState(), c = !0, e.splice(b, 1));
                (!d || !c) && f.dequeue(this, a)
            })
        }
    }), f.each({
        slideDown: ct("show", 1),
        slideUp: ct("hide", 1),
        slideToggle: ct("toggle", 1),
        fadeIn: {
            opacity: "show"
        },
        fadeOut: {
            opacity: "hide"
        },
        fadeToggle: {
            opacity: "toggle"
        }
    }, function(a, b) {
        f.fn[a] = function(a, c, d) {
            return this.animate(b, a, c, d)
        }
    }), f.extend({
        speed: function(a, b, c) {
            var d = a && typeof a == "object" ? f.extend({}, a) : {
                complete: c || !c && b || f.isFunction(a) && a,
                duration: a,
                easing: c && b || b && !f.isFunction(b) && b
            };
            d.duration = f.fx.off ? 0 : typeof d.duration == "number" ? d.duration : d.duration in f.fx.speeds ? f.fx.speeds[d.duration] : f.fx.speeds._default;
            if (d.queue == null || d.queue === !0) d.queue = "fx";
            d.old = d.complete, d.complete = function(a) {
                f.isFunction(d.old) && d.old.call(this), d.queue ? f.dequeue(this, d.queue) : a !== !1 && f._unmark(this)
            };
            return d
        },
        easing: {
            linear: function(a) {
                return a
            },
            swing: function(a) {
                return -Math.cos(a * Math.PI) / 2 + .5
            }
        },
        timers: [],
        fx: function(a, b, c) {
            this.options = b, this.elem = a, this.prop = c, b.orig = b.orig || {}
        }
    }), f.fx.prototype = {
        update: function() {
            this.options.step && this.options.step.call(this.elem, this.now, this), (f.fx.step[this.prop] || f.fx.step._default)(this)
        },
        cur: function() {
            if (this.elem[this.prop] != null && (!this.elem.style || this.elem.style[this.prop] == null)) return this.elem[this.prop];
            var a, b = f.css(this.elem, this.prop);
            return isNaN(a = parseFloat(b)) ? !b || b === "auto" ? 0 : b : a
        },
        custom: function(a, c, d) {
            function h(a) {
                return e.step(a)
            }
            var e = this,
                g = f.fx;
            this.startTime = cq || cr(), this.end = c, this.now = this.start = a, this.pos = this.state = 0, this.unit = d || this.unit || (f.cssNumber[this.prop] ? "" : "px"), h.queue = this.options.queue, h.elem = this.elem, h.saveState = function() {
                f._data(e.elem, "fxshow" + e.prop) === b && (e.options.hide ? f._data(e.elem, "fxshow" + e.prop, e.start) : e.options.show && f._data(e.elem, "fxshow" + e.prop, e.end))
            }, h() && f.timers.push(h) && !co && (co = setInterval(g.tick, g.interval))
        },
        show: function() {
            var a = f._data(this.elem, "fxshow" + this.prop);
            this.options.orig[this.prop] = a || f.style(this.elem, this.prop), this.options.show = !0, a !== b ? this.custom(this.cur(), a) : this.custom(this.prop === "width" || this.prop === "height" ? 1 : 0, this.cur()), f(this.elem).show()
        },
        hide: function() {
            this.options.orig[this.prop] = f._data(this.elem, "fxshow" + this.prop) || f.style(this.elem, this.prop), this.options.hide = !0, this.custom(this.cur(), 0)
        },
        step: function(a) {
            var b, c, d, e = cq || cr(),
                g = !0,
                h = this.elem,
                i = this.options;
            if (a || e >= i.duration + this.startTime) {
                this.now = this.end, this.pos = this.state = 1, this.update(), i.animatedProperties[this.prop] = !0;
                for (b in i.animatedProperties) i.animatedProperties[b] !== !0 && (g = !1);
                if (g) {
                    i.overflow != null && !f.support.shrinkWrapBlocks && f.each(["", "X", "Y"], function(a, b) {
                        h.style["overflow" + b] = i.overflow[a]
                    }), i.hide && f(h).hide();
                    if (i.hide || i.show)
                        for (b in i.animatedProperties) f.style(h, b, i.orig[b]), f.removeData(h, "fxshow" + b, !0), f.removeData(h, "toggle" + b, !0);
                    d = i.complete, d && (i.complete = !1, d.call(h))
                }
                return !1
            }
            i.duration == Infinity ? this.now = e : (c = e - this.startTime, this.state = c / i.duration, this.pos = f.easing[i.animatedProperties[this.prop]](this.state, c, 0, 1, i.duration), this.now = this.start + (this.end - this.start) * this.pos), this.update();
            return !0
        }
    }, f.extend(f.fx, {
        tick: function() {
            var a, b = f.timers,
                c = 0;
            for (; c < b.length; c++) a = b[c], !a() && b[c] === a && b.splice(c--, 1);
            b.length || f.fx.stop()
        },
        interval: 13,
        stop: function() {
            clearInterval(co), co = null
        },
        speeds: {
            slow: 600,
            fast: 200,
            _default: 400
        },
        step: {
            opacity: function(a) {
                f.style(a.elem, "opacity", a.now)
            },
            _default: function(a) {
                a.elem.style && a.elem.style[a.prop] != null ? a.elem.style[a.prop] = a.now + a.unit : a.elem[a.prop] = a.now
            }
        }
    }), f.each(cp.concat.apply([], cp), function(a, b) {
        b.indexOf("margin") && (f.fx.step[b] = function(a) {
            f.style(a.elem, b, Math.max(0, a.now) + a.unit)
        })
    }), f.expr && f.expr.filters && (f.expr.filters.animated = function(a) {
        return f.grep(f.timers, function(b) {
            return a === b.elem
        }).length
    });
    var cv, cw = /^t(?:able|d|h)$/i,
        cx = /^(?:body|html)$/i;
    "getBoundingClientRect" in c.documentElement ? cv = function(a, b, c, d) {
        try {
            d = a.getBoundingClientRect()
        } catch (e) {}
        if (!d || !f.contains(c, a)) return d ? {
            top: d.top,
            left: d.left
        } : {
            top: 0,
            left: 0
        };
        var g = b.body,
            h = cy(b),
            i = c.clientTop || g.clientTop || 0,
            j = c.clientLeft || g.clientLeft || 0,
            k = h.pageYOffset || f.support.boxModel && c.scrollTop || g.scrollTop,
            l = h.pageXOffset || f.support.boxModel && c.scrollLeft || g.scrollLeft,
            m = d.top + k - i,
            n = d.left + l - j;
        return {
            top: m,
            left: n
        }
    } : cv = function(a, b, c) {
        var d, e = a.offsetParent,
            g = a,
            h = b.body,
            i = b.defaultView,
            j = i ? i.getComputedStyle(a, null) : a.currentStyle,
            k = a.offsetTop,
            l = a.offsetLeft;
        while ((a = a.parentNode) && a !== h && a !== c) {
            if (f.support.fixedPosition && j.position === "fixed") break;
            d = i ? i.getComputedStyle(a, null) : a.currentStyle, k -= a.scrollTop, l -= a.scrollLeft, a === e && (k += a.offsetTop, l += a.offsetLeft, f.support.doesNotAddBorder && (!f.support.doesAddBorderForTableAndCells || !cw.test(a.nodeName)) && (k += parseFloat(d.borderTopWidth) || 0, l += parseFloat(d.borderLeftWidth) || 0), g = e, e = a.offsetParent), f.support.subtractsBorderForOverflowNotVisible && d.overflow !== "visible" && (k += parseFloat(d.borderTopWidth) || 0, l += parseFloat(d.borderLeftWidth) || 0), j = d
        }
        if (j.position === "relative" || j.position === "static") k += h.offsetTop, l += h.offsetLeft;
        f.support.fixedPosition && j.position === "fixed" && (k += Math.max(c.scrollTop, h.scrollTop), l += Math.max(c.scrollLeft, h.scrollLeft));
        return {
            top: k,
            left: l
        }
    }, f.fn.offset = function(a) {
        if (arguments.length) return a === b ? this : this.each(function(b) {
            f.offset.setOffset(this, a, b)
        });
        var c = this[0],
            d = c && c.ownerDocument;
        if (!d) return null;
        if (c === d.body) return f.offset.bodyOffset(c);
        return cv(c, d, d.documentElement)
    }, f.offset = {
        bodyOffset: function(a) {
            var b = a.offsetTop,
                c = a.offsetLeft;
            f.support.doesNotIncludeMarginInBodyOffset && (b += parseFloat(f.css(a, "marginTop")) || 0, c += parseFloat(f.css(a, "marginLeft")) || 0);
            return {
                top: b,
                left: c
            }
        },
        setOffset: function(a, b, c) {
            var d = f.css(a, "position");
            d === "static" && (a.style.position = "relative");
            var e = f(a),
                g = e.offset(),
                h = f.css(a, "top"),
                i = f.css(a, "left"),
                j = (d === "absolute" || d === "fixed") && f.inArray("auto", [h, i]) > -1,
                k = {},
                l = {},
                m, n;
            j ? (l = e.position(), m = l.top, n = l.left) : (m = parseFloat(h) || 0, n = parseFloat(i) || 0), f.isFunction(b) && (b = b.call(a, c, g)), b.top != null && (k.top = b.top - g.top + m), b.left != null && (k.left = b.left - g.left + n), "using" in b ? b.using.call(a, k) : e.css(k)
        }
    }, f.fn.extend({
        position: function() {
            if (!this[0]) return null;
            var a = this[0],
                b = this.offsetParent(),
                c = this.offset(),
                d = cx.test(b[0].nodeName) ? {
                    top: 0,
                    left: 0
                } : b.offset();
            c.top -= parseFloat(f.css(a, "marginTop")) || 0, c.left -= parseFloat(f.css(a, "marginLeft")) || 0, d.top += parseFloat(f.css(b[0], "borderTopWidth")) || 0, d.left += parseFloat(f.css(b[0], "borderLeftWidth")) || 0;
            return {
                top: c.top - d.top,
                left: c.left - d.left
            }
        },
        offsetParent: function() {
            return this.map(function() {
                var a = this.offsetParent || c.body;
                while (a && !cx.test(a.nodeName) && f.css(a, "position") === "static") a = a.offsetParent;
                return a
            })
        }
    }), f.each({
        scrollLeft: "pageXOffset",
        scrollTop: "pageYOffset"
    }, function(a, c) {
        var d = /Y/.test(c);
        f.fn[a] = function(e) {
            return f.access(this, function(a, e, g) {
                var h = cy(a);
                if (g === b) return h ? c in h ? h[c] : f.support.boxModel && h.document.documentElement[e] || h.document.body[e] : a[e];
                h ? h.scrollTo(d ? f(h).scrollLeft() : g, d ? g : f(h).scrollTop()) : a[e] = g
            }, a, e, arguments.length, null)
        }
    }), f.each({
        Height: "height",
        Width: "width"
    }, function(a, c) {
        var d = "client" + a,
            e = "scroll" + a,
            g = "offset" + a;
        f.fn["inner" + a] = function() {
            var a = this[0];
            return a ? a.style ? parseFloat(f.css(a, c, "padding")) : this[c]() : null
        }, f.fn["outer" + a] = function(a) {
            var b = this[0];
            return b ? b.style ? parseFloat(f.css(b, c, a ? "margin" : "border")) : this[c]() : null
        }, f.fn[c] = function(a) {
            return f.access(this, function(a, c, h) {
                var i, j, k, l;
                if (f.isWindow(a)) {
                    i = a.document, j = i.documentElement[d];
                    return f.support.boxModel && j || i.body && i.body[d] || j
                }
                if (a.nodeType === 9) {
                    i = a.documentElement;
                    if (i[d] >= i[e]) return i[d];
                    return Math.max(a.body[e], i[e], a.body[g], i[g])
                }
                if (h === b) {
                    k = f.css(a, c), l = parseFloat(k);
                    return f.isNumeric(l) ? l : k
                }
                f(a).css(c, h)
            }, c, a, arguments.length, null)
        }
    }), a.jQuery = a.$ = f, typeof define == "function" && define.amd && define.amd.jQuery && define("jquery", [], function() {
        return f
    })
})(window);
var $j = jQuery.noConflict();
var d3 = {
    modules: [],
    modulesByName: {},
    contentModules: [],
    runTimeTotal: 0,
    buildMode: 'Release',
    buildTime: '2017-03-17 12:48:48',
    buildNumber: '60',
    getModule: function(name) {
        return (this.modulesByName[name] == undefined) ? null : this.modulesByName[name];
    },
    user: {
        id: null,
        name: null
    },
    setStyle: function(element, style) {
        for (var i in style)
            element.style[i] = style[i];
    },
    newElement: function(tagName, parms) {
        var e = document.createElement(tagName);
        var i;
        if (parms.style !== undefined) this.setStyle(e, parms.style);
        if (parms.attributes !== undefined)
            for (i in parms.attributes) e.setAttribute(i, parms.attributes[i]);
        if (parms.innerHTML !== undefined) e.innerHTML = parms.innerHTML;
        return e;
    },
    newDiv: function(parms) {
        return this.newElement('div', parms);
    },
    json: {
        encode: function(value) {
            return (JSON.stringify != undefined ? JSON.stringify : JSON.encode)(value);
        },
        decode: function(value) {
            return (JSON.parse != undefined ? JSON.parse : JSON.decode)(value);
        }
    },
    service: {
        embedScript: function(text) {
            var script2run = document.createElement('script');
            script2run.type = 'text/javascript';
            script2run.text = text;
            document.body.appendChild(script2run);
        },
        attachScript: function(url) {
            var script2run = document.createElement('script');
            script2run.type = 'text/javascript';
            script2run.src = url;
            document.body.appendChild(script2run);
        },
        embedStyle: function(css) {
            $j(document.getElementsByTagName('head')[0] || document.getElementsByTagName('body')[0]).append('<style type="text/css">\n' + css + '\n</style>');
        }
    },
    addContentModule: function(mask, module) {
        this.contentModules.push({
            mask: mask,
            module: module
        });
    },
    initContentModules: function() {
        this.contentModules.forEach(function(item) {
            if (document.location.hostname.match(item.mask))
                item.module.run();
        });
    },
    addModule: function(module) {
        var log = console && this.buildMode == 'Dev';
        if (module.variant !== undefined && $j.inArray(this.content.variant, module.variant) === -1) return;
        this.modules.push(module);
        if (this.modulesByName[module.name] != undefined)
            if (console) console.log('Duplicate module ' + module.name);
        this.modulesByName[module.name] = module;
        this.config.addModule(module);
        if (module.config == undefined || module.config.active == undefined || module.config.active.value) {
            var timeBefore = (new Date()).getTime();
            var moduleTimingInfo = {};
            if (module.run != undefined) {
                try {
                    module.run();
                    moduleTimingInfo["run"] = ((new Date).getTime() - timeBefore) + "ms";
                } catch (e) {
                    if (log) console.log("Error in module '" + module.name + "'", e);
                }
            }
            try {
                if (module.onPost != undefined) {
                    var startTime = (new Date()).getTime();
                    d3.content.onNewPost(function(post) {
                        module.onPost(post);
                    });
                    d3.content.posts.forEach(function(post) {
                        module.onPost(post);
                    });
                    moduleTimingInfo["onPost"] = ((new Date).getTime() - startTime) + "ms";
                }
            } catch (e) {
                if (log) console.log("Error processing posts in module '" + module.name + "'", e);
            }
            try {
                if (module.onComment != undefined) {
                    var startTime = (new Date()).getTime();
                    d3.content.onNewComment(function(comment) {
                        module.onComment(comment);
                    });
                    d3.content.comments.forEach(function(comment) {
                        module.onComment(comment);
                    });
                    moduleTimingInfo["onComment"] = ((new Date).getTime() - startTime) + "ms";
                }
            } catch (e) {
                if (log) console.log("Error processing comments in module '" + module.name + "'", e);
            }
            var handleBatchEvent = function(eventName, handler, runNow) {
                try {
                    if (module[eventName] != undefined) {
                        var startTime = (new Date()).getTime();
                        handler(function() {
                            module[eventName]();
                        });
                        if (runNow) {
                            module[eventName]();
                        }
                        moduleTimingInfo[eventName] = ((new Date).getTime() - startTime) + "ms";
                    }
                } catch (e) {
                    if (log) console.log("Error running " + eventName + " in module '" + module.name + "'", e);
                }
            };
            handleBatchEvent("onPostsUpdated", function(fn) {
                d3.content.onPostsUpdated(fn);
            }, d3.content.posts.length);
            handleBatchEvent("onCommentsUpdated", function(fn) {
                d3.content.onCommentsUpdated(fn);
            }, d3.content.comments.length);
            handleBatchEvent("onItemsUpdated", function(fn) {
                d3.content.onItemsUpdated(fn);
            }, d3.content.posts.length || d3.content.comments.length);
            var moduleRunTime = (new Date()).getTime() - timeBefore;
            this.runTimeTotal += moduleRunTime;
            if (log) console.log(module.name + ": " + moduleRunTime + "ms;  " + JSON.stringify(moduleTimingInfo));
        }
    },
    config: {
        type: "Сервис-пак",
        author: 'crimaniak',
        name: 'config core module',
        data: {},
        controls: {},
        config: {
            linkDisposition: {
                type: 'checkbox',
                caption: "Линк на настройки в заголовке",
                value: 0
            }
        },
        run: function() {
            d3.content.addConfigLink('configLink', this.config.linkDisposition.value);
            $j('#configLink').click(function(event) {
                d3.config.getBox().show();
                return false;
            });
        },
        getBox: function() {
            if (this.box == undefined)
                this.box = this.drawBox();
            return this.box;
        },
        controlName: function(module, control) {
            return 'A' + Math.abs(crc32(module) % 10000) + '_' + control;
        },
        drawBox: function() {
            var box = $j(d3.newElement('div', {
                style: {
                    position: 'fixed',
                    top: ($j(window).height() / 2 - 150) + 'px',
                    left: ($j(window).width() / 2 - 300) + 'px',
                    width: '600px',
                    height: '300px',
                    backgroundColor: '#FFFFCC',
                    border: '1px grey solid',
                    zIndex: '1000',
                    padding: '0 1ex'
                },
                attributes: {
                    id: 'configBox'
                },
                innerHTML: 'Настройки сервис-пака <a id="configCloser" style="position:absolute;right:1ex;top:0px;cursor:pointer">закрыть</a><div id="configTabs"></div>'
            }));
            $j('body').append(box);
            $j('#configCloser').click(function(event) {
                box.hide();
                d3.config.readAndSave();
                return false;
            });
            this.tabs = new TabSheets($j('#configTabs'));
            for (var sheetName in this.controls)
                this.tabs.addSheet(sheetName, this.drawSheet(this.controls[sheetName]));
            var sw = function(node) {
                $j(node).closest('tbody').next()[node.checked ? 'show' : 'hide']();
            };
            $j('.moduleSwitcher input', box).each(function(index, item) {
                sw(item);
            }).click(function(event) {
                sw(event.currentTarget);
            });
            return box;
        },
        drawSheet: function(data) {
            var html = '<table style="width: 100%; border:0px none; border-collapse:collapse; padding: 0px"><col width="24"></col><tbody>';
            var firstModule = 0;
            for (var id in data) {
                if (data[id].name == 'active') {
                    html += '</tbody><tbody><tr' + data[id].title() + '><td colspan="2" style="height:20px;' + (firstModule++ ? 'border-top: 1px dotted grey' : '') + '"><label class="moduleSwitcher" style="font-weight: bold">' + data[id].drawControl() + ' ' + data[id].caption + '</label></td></tr></tbody><tbody>';
                } else
                    html += data[id].draw();
            }
            return html + '</tbody></table>';
        },
        Control: function(module, name) {
            this.module = module;
            this.name = name;
            module.config[this.name]._control = this;
            this.setValue = function(newValue) {
                d3.config.data[this.id] = this.module.config[this.name].value = this.value = newValue;
            };
            this.getValue = function() {
                return $j('#' + this.id).val();
            };
            this.update = function() {
                this.setValue(this.getValue());
            };
            this.title = function() {
                return this.description == undefined ? '' : ' title="' + escapeHtml(this.description) + '"';
            };
            for (var i in module.config[name])
                this[i] = module.config[name][i];
            for (i in d3.config[this.type])
                this[i] = d3.config[this.type][i];
            this.id = d3.config.controlName(module.name, name);
            if (this.caption == undefined)
                this.caption = name == 'active' ? module.name : name;
            if (d3.config.data[this.id] != undefined)
                this.setValue(d3.config.data[this.id]);
        },
        checkbox: {
            drawControl: function() {
                return '<input type="checkbox" id="' + this.id + '" name="' + this.id + '"' + (this.value ? ' checked' : '') + '>';
            },
            draw: function() {
                return '<tr' + this.title() + '><td>' + this.drawControl() + '</td><td><label for="' + this.id + '">' + this.caption + '</label></td></tr>';
            },
            getValue: function() {
                return $j('#' + this.id).attr('checked') ? 1 : 0;
            }
        },
        text: {
            draw: function() {
                return '<tr' + this.title() + '><td colspan="2"><label>' + this.caption + '<input type="text" id="' + this.id + '" name="' + this.id + '" value="' + this.value + '"></label></td></tr>';
            }
        },
        html: {
            draw: function() {
                return '<tr' + this.title() + '><td colspan="2">' + this.value + '</td></tr>';
            },
            getValue: function() {
                return this.value;
            },
            setValue: function(value) {}
        },
        hidden: {
            draw: function() {
                return '';
            },
            getValue: function() {
                return this.module.config[this.name].value;
            }
        },
        radio: {
            draw: function() {
                if (this.columns == undefined) {
                    this.columns = 0;
                    for (var i in this.options) this.columns++;
                    this.columns = Math.floor(Math.sqrt(this.columns));
                }
                var html = '<tr' + this.title() + '><td colspan="2">' + this.caption + '</td></tr><tr><td></td><td><table><tbody><tr>';
                var counter = 1;
                for (var i in this.options) {
                    if ((++counter % this.columns) == 0 && counter > 2) html += '</tr><tr>';
                    html += '<td><label><input type="radio" name="' + this.id + '" value="' + escapeHtml(this.options[i]) + '"' + (this.options[i] == this.value ? ' checked' : '') + '> ' + i + '</label></td>';
                }
                return html + '</tr></tbody></table></td></tr>';
            },
            getValue: function() {
                return $j('input:radio[name=' + this.id + ']:checked').val();
            }
        },
        select: {
            draw: function() {
                var html = '<tr' + this.title() + '><td colspan="2">' + this.caption + ' <select name="' + this.id + '" id="' + this.id + '">';
                for (var i in this.options) {
                    html += '<option value="' + this.options[i] + '"' + (this.options[i] == this.value ? ' selected' : '') + '> ' + i + '</option>';
                }
                return html + '</select></td></tr>';
            },
            getValue: function() {
                return $j('select#' + this.id + ' option:selected').val();
            }
        },
        readAndSave: function() {
            for (var sheet in this.controls)
                for (var id in this.controls[sheet])
                    this.controls[sheet][id].update();
            this.save();
        },
        save: function() {
            d3.storage.set('dirtySpm', this.data);
        },
        load: function() {
            var saved = d3.storage.get('dirtySpm', null);
            if (saved !== null)
                this.data = saved;
        },
        addModule: function(module) {
            if (module.config == undefined) return;
            if (this.controls[module.type] == undefined)
                this.controls[module.type] = {};
            for (var i in module.config) {
                var control = new this.Control(module, i);
                this.controls[module.type][control.id] = control;
            }
        }
    },
    initCore: function() {
        this.getOriginal();
        this.initContentModules();
        this.user = this.content.findUser();
        this.config.load();
        this.addModule(d3.config);
        this.window.d3 = this;
        this.service.getScroll = this.window.getScroll ? function() {
            return d3.window.getScroll();
        } : function() {
            return {
                x: window.scrollX,
                y: window.scrollY
            };
        };
    },
    getOriginal: function() {
        if ($j.browser.opera) {
            this.window = window;
            this.document = document;
            this.globals = this.window.globals;
        } else if ($j.browser.mozilla) {
            this.window = unsafeWindow;
            this.document = document.wrappedJSObject;
            this.globals = this.window.globals;
        } else {
            var retval = d3.newElement('div', {
                attributes: {
                    onclick: "return {window:window,document:document,globals: window.globals};"
                }
            }).onclick();
            this.window = retval.window;
            this.document = retval.document;
            this.globals = retval.globals;
        }
    },
    xpath: {
        get: function(selector, context) {
            if (context == undefined) context = document;
            return document.evaluate(selector, context, document.createNSResolver(document), XPathResult.ORDERED_NODE_SNAPSHOT_TYPE, null);
        },
        each: function(selector, handler, context) {
            var nodes = this.get(selector, context);
            for (var i = 0; i < nodes.snapshotLength; i++)
                if (handler(nodes.snapshotItem(i), i) === false) return false;
            return true;
        }
    }
};
String.prototype.endsWith = function(suffix) {
    return this.indexOf(suffix, this.length - suffix.length) !== -1;
};
(function() {
    var table = "00000000 77073096 EE0E612C 990951BA 076DC419 706AF48F E963A535 9E6495A3 0EDB8832 79DCB8A4 E0D5E91E 97D2D988 09B64C2B 7EB17CBD E7B82D07 90BF1D91 1DB71064 6AB020F2 F3B97148 84BE41DE 1ADAD47D 6DDDE4EB F4D4B551 83D385C7 136C9856 646BA8C0 FD62F97A 8A65C9EC 14015C4F 63066CD9 FA0F3D63 8D080DF5 3B6E20C8 4C69105E D56041E4 A2677172 3C03E4D1 4B04D447 D20D85FD A50AB56B 35B5A8FA 42B2986C DBBBC9D6 ACBCF940 32D86CE3 45DF5C75 DCD60DCF ABD13D59 26D930AC 51DE003A C8D75180 BFD06116 21B4F4B5 56B3C423 CFBA9599 B8BDA50F 2802B89E 5F058808 C60CD9B2 B10BE924 2F6F7C87 58684C11 C1611DAB B6662D3D 76DC4190 01DB7106 98D220BC EFD5102A 71B18589 06B6B51F 9FBFE4A5 E8B8D433 7807C9A2 0F00F934 9609A88E E10E9818 7F6A0DBB 086D3D2D 91646C97 E6635C01 6B6B51F4 1C6C6162 856530D8 F262004E 6C0695ED 1B01A57B 8208F4C1 F50FC457 65B0D9C6 12B7E950 8BBEB8EA FCB9887C 62DD1DDF 15DA2D49 8CD37CF3 FBD44C65 4DB26158 3AB551CE A3BC0074 D4BB30E2 4ADFA541 3DD895D7 A4D1C46D D3D6F4FB 4369E96A 346ED9FC AD678846 DA60B8D0 44042D73 33031DE5 AA0A4C5F DD0D7CC9 5005713C 270241AA BE0B1010 C90C2086 5768B525 206F85B3 B966D409 CE61E49F 5EDEF90E 29D9C998 B0D09822 C7D7A8B4 59B33D17 2EB40D81 B7BD5C3B C0BA6CAD EDB88320 9ABFB3B6 03B6E20C 74B1D29A EAD54739 9DD277AF 04DB2615 73DC1683 E3630B12 94643B84 0D6D6A3E 7A6A5AA8 E40ECF0B 9309FF9D 0A00AE27 7D079EB1 F00F9344 8708A3D2 1E01F268 6906C2FE F762575D 806567CB 196C3671 6E6B06E7 FED41B76 89D32BE0 10DA7A5A 67DD4ACC F9B9DF6F 8EBEEFF9 17B7BE43 60B08ED5 D6D6A3E8 A1D1937E 38D8C2C4 4FDFF252 D1BB67F1 A6BC5767 3FB506DD 48B2364B D80D2BDA AF0A1B4C 36034AF6 41047A60 DF60EFC3 A867DF55 316E8EEF 4669BE79 CB61B38C BC66831A 256FD2A0 5268E236 CC0C7795 BB0B4703 220216B9 5505262F C5BA3BBE B2BD0B28 2BB45A92 5CB36A04 C2D7FFA7 B5D0CF31 2CD99E8B 5BDEAE1D 9B64C2B0 EC63F226 756AA39C 026D930A 9C0906A9 EB0E363F 72076785 05005713 95BF4A82 E2B87A14 7BB12BAE 0CB61B38 92D28E9B E5D5BE0D 7CDCEFB7 0BDBDF21 86D3D2D4 F1D4E242 68DDB3F8 1FDA836E 81BE16CD F6B9265B 6FB077E1 18B74777 88085AE6 FF0F6A70 66063BCA 11010B5C 8F659EFF F862AE69 616BFFD3 166CCF45 A00AE278 D70DD2EE 4E048354 3903B3C2 A7672661 D06016F7 4969474D 3E6E77DB AED16A4A D9D65ADC 40DF0B66 37D83BF0 A9BCAE53 DEBB9EC5 47B2CF7F 30B5FFE9 BDBDF21C CABAC28A 53B39330 24B4A3A6 BAD03605 CDD70693 54DE5729 23D967BF B3667A2E C4614AB8 5D681B02 2A6F2B94 B40BBE37 C30C8EA1 5A05DF1B 2D02EF8D";
    crc32 = function(str, crc) {
        if (crc == window.undefined) crc = 0;
        var n = 0;
        var x = 0;
        crc = crc ^ (-1);
        for (var i = 0, iTop = str.length; i < iTop; i++) {
            n = (crc ^ str.charCodeAt(i)) & 0xFF;
            x = "0x" + table.substr(n * 9, 8);
            crc = (crc >>> 8) ^ x;
        }
        return crc ^ (-1);
    };
})();
RegExp.escape = function(text) {
    return text.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, "\\$&");
};

function escapeHtml(unsafe) {
    return ('' + unsafe).replace(/&(?!amp;)/g, "&amp;").replace(/<(?!lt;)/g, "&lt;").replace(/>(?!gt;)/g, "&gt;").replace(/"(?!quot;)/g, "&quot;").replace(/'(?!#039;)/g, "&#039;");
};
(function($) {
    $.fn.unselectable = function() {
        return this.each(function() {
            $(this).css('-moz-user-select', 'none').css('-khtml-user-select', 'none').css('user-select', 'none');
            if ($.browser.msie) {
                $(this).each(function() {
                    this.ondrag = function() {
                        return false
                    }
                });
                $(this).each(function() {
                    this.onselectstart = function() {
                        return (false)
                    }
                })
            } else if ($.browser.opera) {
                $(this).attr('unselectable', 'on')
            }
        })
    }
})(jQuery);
jQuery.cookie = function(name, value, options) {
    if (typeof value != 'undefined') {
        options = options || {};
        if (value === null) {
            value = '';
            options = $.extend({}, options);
            options.expires = -1;
        }
        var expires = '';
        if (options.expires && (typeof options.expires == 'number' || options.expires.toUTCString)) {
            var date;
            if (typeof options.expires == 'number') {
                date = new Date();
                date.setTime(date.getTime() + (options.expires * 24 * 60 * 60 * 1000));
            } else {
                date = options.expires;
            }
            expires = '; expires=' + date.toUTCString();
        }
        var path = options.path ? '; path=' + (options.path) : '';
        var domain = options.domain ? '; domain=' + (options.domain) : '';
        var secure = options.secure ? '; secure' : '';
        document.cookie = [name, '=', encodeURIComponent(value), expires, path, domain, secure].join('');
    } else {
        var cookieValue = null;
        if (document.cookie && document.cookie != '') {
            var cookies = document.cookie.split(';');
            for (var i = 0; i < cookies.length; i++) {
                var cookie = jQuery.trim(cookies[i]);
                if (cookie.substring(0, name.length + 1) == (name + '=')) {
                    cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                    break;
                }
            }
        }
        return cookieValue;
    }
};

function URL(base) {
    this.base = base != undefined ? base : '';
    this.parms = [];
    this._hash = '';
};
URL.prototype = {
    setBase: function(newBase) {
        this.base = newBase;
        return this;
    },
    addBase: function(part) {
        this.base += part;
        return this;
    },
    add: function(name, value) {
        this.parms.push({
            name: name,
            value: value
        });
        return this;
    },
    hash: function(hash) {
        this._hash = hash;
        return this;
    },
    toString: function() {
        return this.base + this.getParms() + (this._hash != '' ? '#' + this._hash : '');
    },
    getParms: function() {
        var parms = '';
        var i;
        for (i = 0; i < this.parms.length; ++i) with(this.parms[i])
        parms += (parms == '' ? '?' : '&') + encodeURIComponent(name) + '=' + encodeURIComponent(value);
        return parms;
    }
};
URL.make = function(base) {
    return new URL(base);
};
var XRegExp;
XRegExp = XRegExp || function(n) {
    "use strict";

    function v(n, i, r) {
        var u;
        for (u in t.prototype) t.prototype.hasOwnProperty(u) && (n[u] = t.prototype[u]);
        return n.xregexp = {
            captureNames: i,
            isNative: !!r
        }, n
    }

    function g(n) {
        return (n.global ? "g" : "") + (n.ignoreCase ? "i" : "") + (n.multiline ? "m" : "") + (n.extended ? "x" : "") + (n.sticky ? "y" : "")
    }

    function o(n, r, u) {
        if (!t.isRegExp(n)) throw new TypeError("type RegExp expected");
        var f = i.replace.call(g(n) + (r || ""), h, "");
        return u && (f = i.replace.call(f, new RegExp("[" + u + "]+", "g"), "")), n = n.xregexp && !n.xregexp.isNative ? v(t(n.source, f), n.xregexp.captureNames ? n.xregexp.captureNames.slice(0) : null) : v(new RegExp(n.source, f), null, !0)
    }

    function a(n, t) {
        var i = n.length;
        if (Array.prototype.lastIndexOf) return n.lastIndexOf(t);
        while (i--)
            if (n[i] === t) return i;
        return -1
    }

    function s(n, t) {
        return Object.prototype.toString.call(n).toLowerCase() === "[object " + t + "]"
    }

    function d(n) {
        return n = n || {}, n === "all" || n.all ? n = {
            natives: !0,
            extensibility: !0
        } : s(n, "string") && (n = t.forEach(n, /[^\s,]+/, function(n) {
            this[n] = !0
        }, {})), n
    }

    function ut(n, t, i, u) {
        var o = p.length,
            s = null,
            e, f;
        y = !0;
        try {
            while (o--)
                if (f = p[o], (f.scope === "all" || f.scope === i) && (!f.trigger || f.trigger.call(u)) && (f.pattern.lastIndex = t, e = r.exec.call(f.pattern, n), e && e.index === t)) {
                    s = {
                        output: f.handler.call(u, e, i),
                        match: e
                    };
                    break
                }
        } catch (h) {
            throw h;
        } finally {
            y = !1
        }
        return s
    }

    function b(n) {
        t.addToken = c[n ? "on" : "off"], f.extensibility = n
    }

    function tt(n) {
        RegExp.prototype.exec = (n ? r : i).exec, RegExp.prototype.test = (n ? r : i).test, String.prototype.match = (n ? r : i).match, String.prototype.replace = (n ? r : i).replace, String.prototype.split = (n ? r : i).split, f.natives = n
    }
    var t, c, u, f = {
            natives: !1,
            extensibility: !1
        },
        i = {
            exec: RegExp.prototype.exec,
            test: RegExp.prototype.test,
            match: String.prototype.match,
            replace: String.prototype.replace,
            split: String.prototype.split
        },
        r = {},
        k = {},
        p = [],
        e = "default",
        rt = "class",
        it = {
            "default": /^(?:\\(?:0(?:[0-3][0-7]{0,2}|[4-7][0-7]?)?|[1-9]\d*|x[\dA-Fa-f]{2}|u[\dA-Fa-f]{4}|c[A-Za-z]|[\s\S])|\(\?[:=!]|[?*+]\?|{\d+(?:,\d*)?}\??)/,
            "class": /^(?:\\(?:[0-3][0-7]{0,2}|[4-7][0-7]?|x[\dA-Fa-f]{2}|u[\dA-Fa-f]{4}|c[A-Za-z]|[\s\S]))/
        },
        et = /\$(?:{([\w$]+)}|(\d\d?|[\s\S]))/g,
        h = /([\s\S])(?=[\s\S]*\1)/g,
        nt = /^(?:[?*+]|{\d+(?:,\d*)?})\??/,
        ft = i.exec.call(/()??/, "")[1] === n,
        l = RegExp.prototype.sticky !== n,
        y = !1,
        w = "gim" + (l ? "y" : "");
    return t = function(r, u) {
        if (t.isRegExp(r)) {
            if (u !== n) throw new TypeError("can't supply flags when constructing one RegExp from another");
            return o(r)
        }
        if (y) throw new Error("can't call the XRegExp constructor within token definition functions");
        var l = [],
            a = e,
            b = {
                hasNamedCapture: !1,
                captureNames: [],
                hasFlag: function(n) {
                    return u.indexOf(n) > -1
                }
            },
            f = 0,
            c, s, p;
        if (r = r === n ? "" : String(r), u = u === n ? "" : String(u), i.match.call(u, h)) throw new SyntaxError("invalid duplicate regular expression flag");
        for (r = i.replace.call(r, /^\(\?([\w$]+)\)/, function(n, t) {
                if (i.test.call(/[gy]/, t)) throw new SyntaxError("can't use flag g or y in mode modifier");
                return u = i.replace.call(u + t, h, ""), ""
            }), t.forEach(u, /[\s\S]/, function(n) {
                if (w.indexOf(n[0]) < 0) throw new SyntaxError("invalid regular expression flag " + n[0]);
            }); f < r.length;) c = ut(r, f, a, b), c ? (l.push(c.output), f += c.match[0].length || 1) : (s = i.exec.call(it[a], r.slice(f)), s ? (l.push(s[0]), f += s[0].length) : (p = r.charAt(f), p === "[" ? a = rt : p === "]" && (a = e), l.push(p), ++f));
        return v(new RegExp(l.join(""), i.replace.call(u, /[^gimy]+/g, "")), b.hasNamedCapture ? b.captureNames : null)
    }, c = {
        on: function(n, t, r) {
            r = r || {}, n && p.push({
                pattern: o(n, "g" + (l ? "y" : "")),
                handler: t,
                scope: r.scope || e,
                trigger: r.trigger || null
            }), r.customFlags && (w = i.replace.call(w + r.customFlags, h, ""))
        },
        off: function() {
            throw new Error("extensibility must be installed before using addToken");
        }
    }, t.addToken = c.off, t.cache = function(n, i) {
        var r = n + "/" + (i || "");
        return k[r] || (k[r] = t(n, i))
    }, t.escape = function(n) {
        return i.replace.call(n, /[-[\]{}()*+?.,\\^$|#\s]/g, "\\$&")
    }, t.exec = function(n, t, i, u) {
        var e = o(t, "g" + (u && l ? "y" : ""), u === !1 ? "y" : ""),
            f;
        return e.lastIndex = i = i || 0, f = r.exec.call(e, n), u && f && f.index !== i && (f = null), t.global && (t.lastIndex = f ? e.lastIndex : 0), f
    }, t.forEach = function(n, i, r, u) {
        for (var e = 0, o = -1, f; f = t.exec(n, i, e);) r.call(u, f, ++o, n, i), e = f.index + (f[0].length || 1);
        return u
    }, t.globalize = function(n) {
        return o(n, "g")
    }, t.install = function(n) {
        n = d(n), !f.natives && n.natives && tt(!0), !f.extensibility && n.extensibility && b(!0)
    }, t.isInstalled = function(n) {
        return !!f[n]
    }, t.isRegExp = function(n) {
        return s(n, "regexp")
    }, t.matchChain = function(n, i) {
        return function r(n, u) {
            for (var o = i[u].regex ? i[u] : {
                    regex: i[u]
                }, f = [], s = function(n) {
                    f.push(o.backref ? n[o.backref] || "" : n[0])
                }, e = 0; e < n.length; ++e) t.forEach(n[e], o.regex, s);
            return u === i.length - 1 || !f.length ? f : r(f, u + 1)
        }([n], 0)
    }, t.replace = function(i, u, f, e) {
        var c = t.isRegExp(u),
            s = u,
            h;
        return c ? (e === n && u.global && (e = "all"), s = o(u, e === "all" ? "g" : "", e === "all" ? "" : "g")) : e === "all" && (s = new RegExp(t.escape(String(u)), "g")), h = r.replace.call(String(i), s, f), c && u.global && (u.lastIndex = 0), h
    }, t.split = function(n, t, i) {
        return r.split.call(n, t, i)
    }, t.test = function(n, i, r, u) {
        return !!t.exec(n, i, r, u)
    }, t.uninstall = function(n) {
        n = d(n), f.natives && n.natives && tt(!1), f.extensibility && n.extensibility && b(!1)
    }, t.union = function(n, i) {
        var l = /(\()(?!\?)|\\([1-9]\d*)|\\[\s\S]|\[(?:[^\\\]]|\\[\s\S])*]/g,
            o = 0,
            f, h, c = function(n, t, i) {
                var r = h[o - f];
                if (t) {
                    if (++o, r) return "(?<" + r + ">"
                } else if (i) return "\\" + (+i + f);
                return n
            },
            e = [],
            r, u;
        if (!(s(n, "array") && n.length)) throw new TypeError("patterns must be a nonempty array");
        for (u = 0; u < n.length; ++u) r = n[u], t.isRegExp(r) ? (f = o, h = r.xregexp && r.xregexp.captureNames || [], e.push(t(r.source).source.replace(l, c))) : e.push(t.escape(r));
        return t(e.join("|"), i)
    }, t.version = "2.0.0", r.exec = function(t) {
        var r, f, e, o, u;
        if (this.global || (o = this.lastIndex), r = i.exec.apply(this, arguments), r) {
            if (!ft && r.length > 1 && a(r, "") > -1 && (e = new RegExp(this.source, i.replace.call(g(this), "g", "")), i.replace.call(String(t).slice(r.index), e, function() {
                    for (var t = 1; t < arguments.length - 2; ++t) arguments[t] === n && (r[t] = n)
                })), this.xregexp && this.xregexp.captureNames)
                for (u = 1; u < r.length; ++u) f = this.xregexp.captureNames[u - 1], f && (r[f] = r[u]);
            this.global && !r[0].length && this.lastIndex > r.index && (this.lastIndex = r.index)
        }
        return this.global || (this.lastIndex = o), r
    }, r.test = function(n) {
        return !!r.exec.call(this, n)
    }, r.match = function(n) {
        if (t.isRegExp(n)) {
            if (n.global) {
                var u = i.match.apply(this, arguments);
                return n.lastIndex = 0, u
            }
        } else n = new RegExp(n);
        return r.exec.call(n, this)
    }, r.replace = function(n, r) {
        var e = t.isRegExp(n),
            u, f, h, o;
        return e ? (n.xregexp && (u = n.xregexp.captureNames), n.global || (o = n.lastIndex)) : n += "", s(r, "function") ? f = i.replace.call(String(this), n, function() {
            var t = arguments,
                i;
            if (u)
                for (t[0] = new String(t[0]), i = 0; i < u.length; ++i) u[i] && (t[0][u[i]] = t[i + 1]);
            return e && n.global && (n.lastIndex = t[t.length - 2] + t[0].length), r.apply(null, t)
        }) : (h = String(this), f = i.replace.call(h, n, function() {
            var n = arguments;
            return i.replace.call(String(r), et, function(t, i, r) {
                var f;
                if (i) {
                    if (f = +i, f <= n.length - 3) return n[f] || "";
                    if (f = u ? a(u, i) : -1, f < 0) throw new SyntaxError("backreference to undefined group " + t);
                    return n[f + 1] || ""
                }
                if (r === "$") return "$";
                if (r === "&" || +r == 0) return n[0];
                if (r === "`") return n[n.length - 1].slice(0, n[n.length - 2]);
                if (r === "'") return n[n.length - 1].slice(n[n.length - 2] + n[0].length);
                if (r = +r, !isNaN(r)) {
                    if (r > n.length - 3) throw new SyntaxError("backreference to undefined group " + t);
                    return n[r] || ""
                }
                throw new SyntaxError("invalid token " + t);
            })
        })), e && (n.lastIndex = n.global ? 0 : o), f
    }, r.split = function(r, u) {
        if (!t.isRegExp(r)) return i.split.apply(this, arguments);
        var e = String(this),
            h = r.lastIndex,
            f = [],
            o = 0,
            s;
        return u = (u === n ? -1 : u) >>> 0, t.forEach(e, r, function(n) {
            n.index + n[0].length > o && (f.push(e.slice(o, n.index)), n.length > 1 && n.index < e.length && Array.prototype.push.apply(f, n.slice(1)), s = n[0].length, o = n.index + s)
        }), o === e.length ? (!i.test.call(r, "") || s) && f.push("") : f.push(e.slice(o)), r.lastIndex = h, f.length > u ? f.slice(0, u) : f
    }, u = c.on, u(/\\([ABCE-RTUVXYZaeg-mopqyz]|c(?![A-Za-z])|u(?![\dA-Fa-f]{4})|x(?![\dA-Fa-f]{2}))/, function(n, t) {
        if (n[1] === "B" && t === e) return n[0];
        throw new SyntaxError("invalid escape " + n[0]);
    }, {
        scope: "all"
    }), u(/\[(\^?)]/, function(n) {
        return n[1] ? "[\\s\\S]" : "\\b\\B"
    }), u(/(?:\(\?#[^)]*\))+/, function(n) {
        return i.test.call(nt, n.input.slice(n.index + n[0].length)) ? "" : "(?:)"
    }), u(/\\k<([\w$]+)>/, function(n) {
        var t = isNaN(n[1]) ? a(this.captureNames, n[1]) + 1 : +n[1],
            i = n.index + n[0].length;
        if (!t || t > this.captureNames.length) throw new SyntaxError("backreference to undefined group " + n[0]);
        return "\\" + t + (i === n.input.length || isNaN(n.input.charAt(i)) ? "" : "(?:)")
    }), u(/(?:\s+|#.*)+/, function(n) {
        return i.test.call(nt, n.input.slice(n.index + n[0].length)) ? "" : "(?:)"
    }, {
        trigger: function() {
            return this.hasFlag("x")
        },
        customFlags: "x"
    }), u(/\./, function() {
        return "[\\s\\S]"
    }, {
        trigger: function() {
            return this.hasFlag("s")
        },
        customFlags: "s"
    }), u(/\(\?P?<([\w$]+)>/, function(n) {
        if (!isNaN(n[1])) throw new SyntaxError("can't use integer as capture name " + n[0]);
        return this.captureNames.push(n[1]), this.hasNamedCapture = !0, "("
    }), u(/\\(\d+)/, function(n, t) {
        if (!(t === e && /^[1-9]/.test(n[1]) && +n[1] <= this.captureNames.length) && n[1] !== "0") throw new SyntaxError("can't use octal escape or backreference to undefined group " + n[0]);
        return n[0]
    }, {
        scope: "all"
    }), u(/\((?!\?)/, function() {
        return this.hasFlag("n") ? "(?:" : (this.captureNames.push(null), "(")
    }, {
        customFlags: "n"
    }), typeof exports != "undefined" && (exports.XRegExp = t), t
}();
(function(n) {
    "use strict";

    function i(n) {
        return n.replace(/[- _]+/g, "").toLowerCase()
    }

    function s(n) {
        return n.replace(/\w{4}/g, "\\u$&")
    }

    function u(n) {
        while (n.length < 4) n = "0" + n;
        return n
    }

    function f(n) {
        return parseInt(n, 16)
    }

    function r(n) {
        return parseInt(n, 10).toString(16)
    }

    function o(t) {
        var e = [],
            i = -1,
            o;
        return n.forEach(t, /\\u(\w{4})(?:-\\u(\w{4}))?/, function(n) {
            o = f(n[1]), o > i + 1 && (e.push("\\u" + u(r(i + 1))), o > i + 2 && e.push("-\\u" + u(r(o - 1)))), i = f(n[2] || n[1])
        }), i < 65535 && (e.push("\\u" + u(r(i + 1))), i < 65534 && e.push("-\\uFFFF")), e.join("")
    }

    function e(n) {
        return t["^" + n] || (t["^" + n] = o(t[n]))
    }
    var t = {};
    n.install("extensibility"), n.addUnicodePackage = function(r, u) {
        var f;
        if (!n.isInstalled("extensibility")) throw new Error("extensibility must be installed before adding Unicode packages");
        if (r)
            for (f in r) r.hasOwnProperty(f) && (t[i(f)] = s(r[f]));
        if (u)
            for (f in u) u.hasOwnProperty(f) && (t[i(u[f])] = t[i(f)])
    }, n.addUnicodePackage({
        L: "0041-005A0061-007A00AA00B500BA00C0-00D600D8-00F600F8-02C102C6-02D102E0-02E402EC02EE0370-037403760377037A-037D03860388-038A038C038E-03A103A3-03F503F7-0481048A-05270531-055605590561-058705D0-05EA05F0-05F20620-064A066E066F0671-06D306D506E506E606EE06EF06FA-06FC06FF07100712-072F074D-07A507B107CA-07EA07F407F507FA0800-0815081A082408280840-085808A008A2-08AC0904-0939093D09500958-09610971-09770979-097F0985-098C098F09900993-09A809AA-09B009B209B6-09B909BD09CE09DC09DD09DF-09E109F009F10A05-0A0A0A0F0A100A13-0A280A2A-0A300A320A330A350A360A380A390A59-0A5C0A5E0A72-0A740A85-0A8D0A8F-0A910A93-0AA80AAA-0AB00AB20AB30AB5-0AB90ABD0AD00AE00AE10B05-0B0C0B0F0B100B13-0B280B2A-0B300B320B330B35-0B390B3D0B5C0B5D0B5F-0B610B710B830B85-0B8A0B8E-0B900B92-0B950B990B9A0B9C0B9E0B9F0BA30BA40BA8-0BAA0BAE-0BB90BD00C05-0C0C0C0E-0C100C12-0C280C2A-0C330C35-0C390C3D0C580C590C600C610C85-0C8C0C8E-0C900C92-0CA80CAA-0CB30CB5-0CB90CBD0CDE0CE00CE10CF10CF20D05-0D0C0D0E-0D100D12-0D3A0D3D0D4E0D600D610D7A-0D7F0D85-0D960D9A-0DB10DB3-0DBB0DBD0DC0-0DC60E01-0E300E320E330E40-0E460E810E820E840E870E880E8A0E8D0E94-0E970E99-0E9F0EA1-0EA30EA50EA70EAA0EAB0EAD-0EB00EB20EB30EBD0EC0-0EC40EC60EDC-0EDF0F000F40-0F470F49-0F6C0F88-0F8C1000-102A103F1050-1055105A-105D106110651066106E-10701075-1081108E10A0-10C510C710CD10D0-10FA10FC-1248124A-124D1250-12561258125A-125D1260-1288128A-128D1290-12B012B2-12B512B8-12BE12C012C2-12C512C8-12D612D8-13101312-13151318-135A1380-138F13A0-13F41401-166C166F-167F1681-169A16A0-16EA1700-170C170E-17111720-17311740-17511760-176C176E-17701780-17B317D717DC1820-18771880-18A818AA18B0-18F51900-191C1950-196D1970-19741980-19AB19C1-19C71A00-1A161A20-1A541AA71B05-1B331B45-1B4B1B83-1BA01BAE1BAF1BBA-1BE51C00-1C231C4D-1C4F1C5A-1C7D1CE9-1CEC1CEE-1CF11CF51CF61D00-1DBF1E00-1F151F18-1F1D1F20-1F451F48-1F4D1F50-1F571F591F5B1F5D1F5F-1F7D1F80-1FB41FB6-1FBC1FBE1FC2-1FC41FC6-1FCC1FD0-1FD31FD6-1FDB1FE0-1FEC1FF2-1FF41FF6-1FFC2071207F2090-209C21022107210A-211321152119-211D212421262128212A-212D212F-2139213C-213F2145-2149214E218321842C00-2C2E2C30-2C5E2C60-2CE42CEB-2CEE2CF22CF32D00-2D252D272D2D2D30-2D672D6F2D80-2D962DA0-2DA62DA8-2DAE2DB0-2DB62DB8-2DBE2DC0-2DC62DC8-2DCE2DD0-2DD62DD8-2DDE2E2F300530063031-3035303B303C3041-3096309D-309F30A1-30FA30FC-30FF3105-312D3131-318E31A0-31BA31F0-31FF3400-4DB54E00-9FCCA000-A48CA4D0-A4FDA500-A60CA610-A61FA62AA62BA640-A66EA67F-A697A6A0-A6E5A717-A71FA722-A788A78B-A78EA790-A793A7A0-A7AAA7F8-A801A803-A805A807-A80AA80C-A822A840-A873A882-A8B3A8F2-A8F7A8FBA90A-A925A930-A946A960-A97CA984-A9B2A9CFAA00-AA28AA40-AA42AA44-AA4BAA60-AA76AA7AAA80-AAAFAAB1AAB5AAB6AAB9-AABDAAC0AAC2AADB-AADDAAE0-AAEAAAF2-AAF4AB01-AB06AB09-AB0EAB11-AB16AB20-AB26AB28-AB2EABC0-ABE2AC00-D7A3D7B0-D7C6D7CB-D7FBF900-FA6DFA70-FAD9FB00-FB06FB13-FB17FB1DFB1F-FB28FB2A-FB36FB38-FB3CFB3EFB40FB41FB43FB44FB46-FBB1FBD3-FD3DFD50-FD8FFD92-FDC7FDF0-FDFBFE70-FE74FE76-FEFCFF21-FF3AFF41-FF5AFF66-FFBEFFC2-FFC7FFCA-FFCFFFD2-FFD7FFDA-FFDC"
    }, {
        L: "Letter"
    }), n.addToken(/\\([pP]){(\^?)([^}]*)}/, function(n, r) {
        var f = n[1] === "P" || n[2] ? "^" : "",
            u = i(n[3]);
        if (n[1] === "P" && n[2]) throw new SyntaxError("invalid double negation \\P{^");
        if (!t.hasOwnProperty(u)) throw new SyntaxError("invalid or unknown Unicode property " + n[0]);
        return r === "class" ? f ? e(u) : t[u] : "[" + f + t[u] + "]"
    }, {
        scope: "all"
    })
})(XRegExp);
(function(n) {
    "use strict";
    if (!n.addUnicodePackage) throw new ReferenceError("Unicode Base must be loaded before Unicode Categories");
    n.install("extensibility"), n.addUnicodePackage({
        Ll: "0061-007A00B500DF-00F600F8-00FF01010103010501070109010B010D010F01110113011501170119011B011D011F01210123012501270129012B012D012F01310133013501370138013A013C013E014001420144014601480149014B014D014F01510153015501570159015B015D015F01610163016501670169016B016D016F0171017301750177017A017C017E-0180018301850188018C018D019201950199-019B019E01A101A301A501A801AA01AB01AD01B001B401B601B901BA01BD-01BF01C601C901CC01CE01D001D201D401D601D801DA01DC01DD01DF01E101E301E501E701E901EB01ED01EF01F001F301F501F901FB01FD01FF02010203020502070209020B020D020F02110213021502170219021B021D021F02210223022502270229022B022D022F02310233-0239023C023F0240024202470249024B024D024F-02930295-02AF037103730377037B-037D039003AC-03CE03D003D103D5-03D703D903DB03DD03DF03E103E303E503E703E903EB03ED03EF-03F303F503F803FB03FC0430-045F04610463046504670469046B046D046F04710473047504770479047B047D047F0481048B048D048F04910493049504970499049B049D049F04A104A304A504A704A904AB04AD04AF04B104B304B504B704B904BB04BD04BF04C204C404C604C804CA04CC04CE04CF04D104D304D504D704D904DB04DD04DF04E104E304E504E704E904EB04ED04EF04F104F304F504F704F904FB04FD04FF05010503050505070509050B050D050F05110513051505170519051B051D051F05210523052505270561-05871D00-1D2B1D6B-1D771D79-1D9A1E011E031E051E071E091E0B1E0D1E0F1E111E131E151E171E191E1B1E1D1E1F1E211E231E251E271E291E2B1E2D1E2F1E311E331E351E371E391E3B1E3D1E3F1E411E431E451E471E491E4B1E4D1E4F1E511E531E551E571E591E5B1E5D1E5F1E611E631E651E671E691E6B1E6D1E6F1E711E731E751E771E791E7B1E7D1E7F1E811E831E851E871E891E8B1E8D1E8F1E911E931E95-1E9D1E9F1EA11EA31EA51EA71EA91EAB1EAD1EAF1EB11EB31EB51EB71EB91EBB1EBD1EBF1EC11EC31EC51EC71EC91ECB1ECD1ECF1ED11ED31ED51ED71ED91EDB1EDD1EDF1EE11EE31EE51EE71EE91EEB1EED1EEF1EF11EF31EF51EF71EF91EFB1EFD1EFF-1F071F10-1F151F20-1F271F30-1F371F40-1F451F50-1F571F60-1F671F70-1F7D1F80-1F871F90-1F971FA0-1FA71FB0-1FB41FB61FB71FBE1FC2-1FC41FC61FC71FD0-1FD31FD61FD71FE0-1FE71FF2-1FF41FF61FF7210A210E210F2113212F21342139213C213D2146-2149214E21842C30-2C5E2C612C652C662C682C6A2C6C2C712C732C742C76-2C7B2C812C832C852C872C892C8B2C8D2C8F2C912C932C952C972C992C9B2C9D2C9F2CA12CA32CA52CA72CA92CAB2CAD2CAF2CB12CB32CB52CB72CB92CBB2CBD2CBF2CC12CC32CC52CC72CC92CCB2CCD2CCF2CD12CD32CD52CD72CD92CDB2CDD2CDF2CE12CE32CE42CEC2CEE2CF32D00-2D252D272D2DA641A643A645A647A649A64BA64DA64FA651A653A655A657A659A65BA65DA65FA661A663A665A667A669A66BA66DA681A683A685A687A689A68BA68DA68FA691A693A695A697A723A725A727A729A72BA72DA72F-A731A733A735A737A739A73BA73DA73FA741A743A745A747A749A74BA74DA74FA751A753A755A757A759A75BA75DA75FA761A763A765A767A769A76BA76DA76FA771-A778A77AA77CA77FA781A783A785A787A78CA78EA791A793A7A1A7A3A7A5A7A7A7A9A7FAFB00-FB06FB13-FB17FF41-FF5A",
        Lu: "0041-005A00C0-00D600D8-00DE01000102010401060108010A010C010E01100112011401160118011A011C011E01200122012401260128012A012C012E01300132013401360139013B013D013F0141014301450147014A014C014E01500152015401560158015A015C015E01600162016401660168016A016C016E017001720174017601780179017B017D018101820184018601870189-018B018E-0191019301940196-0198019C019D019F01A001A201A401A601A701A901AC01AE01AF01B1-01B301B501B701B801BC01C401C701CA01CD01CF01D101D301D501D701D901DB01DE01E001E201E401E601E801EA01EC01EE01F101F401F6-01F801FA01FC01FE02000202020402060208020A020C020E02100212021402160218021A021C021E02200222022402260228022A022C022E02300232023A023B023D023E02410243-02460248024A024C024E03700372037603860388-038A038C038E038F0391-03A103A3-03AB03CF03D2-03D403D803DA03DC03DE03E003E203E403E603E803EA03EC03EE03F403F703F903FA03FD-042F04600462046404660468046A046C046E04700472047404760478047A047C047E0480048A048C048E04900492049404960498049A049C049E04A004A204A404A604A804AA04AC04AE04B004B204B404B604B804BA04BC04BE04C004C104C304C504C704C904CB04CD04D004D204D404D604D804DA04DC04DE04E004E204E404E604E804EA04EC04EE04F004F204F404F604F804FA04FC04FE05000502050405060508050A050C050E05100512051405160518051A051C051E05200522052405260531-055610A0-10C510C710CD1E001E021E041E061E081E0A1E0C1E0E1E101E121E141E161E181E1A1E1C1E1E1E201E221E241E261E281E2A1E2C1E2E1E301E321E341E361E381E3A1E3C1E3E1E401E421E441E461E481E4A1E4C1E4E1E501E521E541E561E581E5A1E5C1E5E1E601E621E641E661E681E6A1E6C1E6E1E701E721E741E761E781E7A1E7C1E7E1E801E821E841E861E881E8A1E8C1E8E1E901E921E941E9E1EA01EA21EA41EA61EA81EAA1EAC1EAE1EB01EB21EB41EB61EB81EBA1EBC1EBE1EC01EC21EC41EC61EC81ECA1ECC1ECE1ED01ED21ED41ED61ED81EDA1EDC1EDE1EE01EE21EE41EE61EE81EEA1EEC1EEE1EF01EF21EF41EF61EF81EFA1EFC1EFE1F08-1F0F1F18-1F1D1F28-1F2F1F38-1F3F1F48-1F4D1F591F5B1F5D1F5F1F68-1F6F1FB8-1FBB1FC8-1FCB1FD8-1FDB1FE8-1FEC1FF8-1FFB21022107210B-210D2110-211221152119-211D212421262128212A-212D2130-2133213E213F214521832C00-2C2E2C602C62-2C642C672C692C6B2C6D-2C702C722C752C7E-2C802C822C842C862C882C8A2C8C2C8E2C902C922C942C962C982C9A2C9C2C9E2CA02CA22CA42CA62CA82CAA2CAC2CAE2CB02CB22CB42CB62CB82CBA2CBC2CBE2CC02CC22CC42CC62CC82CCA2CCC2CCE2CD02CD22CD42CD62CD82CDA2CDC2CDE2CE02CE22CEB2CED2CF2A640A642A644A646A648A64AA64CA64EA650A652A654A656A658A65AA65CA65EA660A662A664A666A668A66AA66CA680A682A684A686A688A68AA68CA68EA690A692A694A696A722A724A726A728A72AA72CA72EA732A734A736A738A73AA73CA73EA740A742A744A746A748A74AA74CA74EA750A752A754A756A758A75AA75CA75EA760A762A764A766A768A76AA76CA76EA779A77BA77DA77EA780A782A784A786A78BA78DA790A792A7A0A7A2A7A4A7A6A7A8A7AAFF21-FF3A",
        Lt: "01C501C801CB01F21F88-1F8F1F98-1F9F1FA8-1FAF1FBC1FCC1FFC",
        Lm: "02B0-02C102C6-02D102E0-02E402EC02EE0374037A0559064006E506E607F407F507FA081A0824082809710E460EC610FC17D718431AA71C78-1C7D1D2C-1D6A1D781D9B-1DBF2071207F2090-209C2C7C2C7D2D6F2E2F30053031-3035303B309D309E30FC-30FEA015A4F8-A4FDA60CA67FA717-A71FA770A788A7F8A7F9A9CFAA70AADDAAF3AAF4FF70FF9EFF9F",
        Lo: "00AA00BA01BB01C0-01C3029405D0-05EA05F0-05F20620-063F0641-064A066E066F0671-06D306D506EE06EF06FA-06FC06FF07100712-072F074D-07A507B107CA-07EA0800-08150840-085808A008A2-08AC0904-0939093D09500958-09610972-09770979-097F0985-098C098F09900993-09A809AA-09B009B209B6-09B909BD09CE09DC09DD09DF-09E109F009F10A05-0A0A0A0F0A100A13-0A280A2A-0A300A320A330A350A360A380A390A59-0A5C0A5E0A72-0A740A85-0A8D0A8F-0A910A93-0AA80AAA-0AB00AB20AB30AB5-0AB90ABD0AD00AE00AE10B05-0B0C0B0F0B100B13-0B280B2A-0B300B320B330B35-0B390B3D0B5C0B5D0B5F-0B610B710B830B85-0B8A0B8E-0B900B92-0B950B990B9A0B9C0B9E0B9F0BA30BA40BA8-0BAA0BAE-0BB90BD00C05-0C0C0C0E-0C100C12-0C280C2A-0C330C35-0C390C3D0C580C590C600C610C85-0C8C0C8E-0C900C92-0CA80CAA-0CB30CB5-0CB90CBD0CDE0CE00CE10CF10CF20D05-0D0C0D0E-0D100D12-0D3A0D3D0D4E0D600D610D7A-0D7F0D85-0D960D9A-0DB10DB3-0DBB0DBD0DC0-0DC60E01-0E300E320E330E40-0E450E810E820E840E870E880E8A0E8D0E94-0E970E99-0E9F0EA1-0EA30EA50EA70EAA0EAB0EAD-0EB00EB20EB30EBD0EC0-0EC40EDC-0EDF0F000F40-0F470F49-0F6C0F88-0F8C1000-102A103F1050-1055105A-105D106110651066106E-10701075-1081108E10D0-10FA10FD-1248124A-124D1250-12561258125A-125D1260-1288128A-128D1290-12B012B2-12B512B8-12BE12C012C2-12C512C8-12D612D8-13101312-13151318-135A1380-138F13A0-13F41401-166C166F-167F1681-169A16A0-16EA1700-170C170E-17111720-17311740-17511760-176C176E-17701780-17B317DC1820-18421844-18771880-18A818AA18B0-18F51900-191C1950-196D1970-19741980-19AB19C1-19C71A00-1A161A20-1A541B05-1B331B45-1B4B1B83-1BA01BAE1BAF1BBA-1BE51C00-1C231C4D-1C4F1C5A-1C771CE9-1CEC1CEE-1CF11CF51CF62135-21382D30-2D672D80-2D962DA0-2DA62DA8-2DAE2DB0-2DB62DB8-2DBE2DC0-2DC62DC8-2DCE2DD0-2DD62DD8-2DDE3006303C3041-3096309F30A1-30FA30FF3105-312D3131-318E31A0-31BA31F0-31FF3400-4DB54E00-9FCCA000-A014A016-A48CA4D0-A4F7A500-A60BA610-A61FA62AA62BA66EA6A0-A6E5A7FB-A801A803-A805A807-A80AA80C-A822A840-A873A882-A8B3A8F2-A8F7A8FBA90A-A925A930-A946A960-A97CA984-A9B2AA00-AA28AA40-AA42AA44-AA4BAA60-AA6FAA71-AA76AA7AAA80-AAAFAAB1AAB5AAB6AAB9-AABDAAC0AAC2AADBAADCAAE0-AAEAAAF2AB01-AB06AB09-AB0EAB11-AB16AB20-AB26AB28-AB2EABC0-ABE2AC00-D7A3D7B0-D7C6D7CB-D7FBF900-FA6DFA70-FAD9FB1DFB1F-FB28FB2A-FB36FB38-FB3CFB3EFB40FB41FB43FB44FB46-FBB1FBD3-FD3DFD50-FD8FFD92-FDC7FDF0-FDFBFE70-FE74FE76-FEFCFF66-FF6FFF71-FF9DFFA0-FFBEFFC2-FFC7FFCA-FFCFFFD2-FFD7FFDA-FFDC",
        M: "0300-036F0483-04890591-05BD05BF05C105C205C405C505C70610-061A064B-065F067006D6-06DC06DF-06E406E706E806EA-06ED07110730-074A07A6-07B007EB-07F30816-0819081B-08230825-08270829-082D0859-085B08E4-08FE0900-0903093A-093C093E-094F0951-0957096209630981-098309BC09BE-09C409C709C809CB-09CD09D709E209E30A01-0A030A3C0A3E-0A420A470A480A4B-0A4D0A510A700A710A750A81-0A830ABC0ABE-0AC50AC7-0AC90ACB-0ACD0AE20AE30B01-0B030B3C0B3E-0B440B470B480B4B-0B4D0B560B570B620B630B820BBE-0BC20BC6-0BC80BCA-0BCD0BD70C01-0C030C3E-0C440C46-0C480C4A-0C4D0C550C560C620C630C820C830CBC0CBE-0CC40CC6-0CC80CCA-0CCD0CD50CD60CE20CE30D020D030D3E-0D440D46-0D480D4A-0D4D0D570D620D630D820D830DCA0DCF-0DD40DD60DD8-0DDF0DF20DF30E310E34-0E3A0E47-0E4E0EB10EB4-0EB90EBB0EBC0EC8-0ECD0F180F190F350F370F390F3E0F3F0F71-0F840F860F870F8D-0F970F99-0FBC0FC6102B-103E1056-1059105E-10601062-10641067-106D1071-10741082-108D108F109A-109D135D-135F1712-17141732-1734175217531772177317B4-17D317DD180B-180D18A91920-192B1930-193B19B0-19C019C819C91A17-1A1B1A55-1A5E1A60-1A7C1A7F1B00-1B041B34-1B441B6B-1B731B80-1B821BA1-1BAD1BE6-1BF31C24-1C371CD0-1CD21CD4-1CE81CED1CF2-1CF41DC0-1DE61DFC-1DFF20D0-20F02CEF-2CF12D7F2DE0-2DFF302A-302F3099309AA66F-A672A674-A67DA69FA6F0A6F1A802A806A80BA823-A827A880A881A8B4-A8C4A8E0-A8F1A926-A92DA947-A953A980-A983A9B3-A9C0AA29-AA36AA43AA4CAA4DAA7BAAB0AAB2-AAB4AAB7AAB8AABEAABFAAC1AAEB-AAEFAAF5AAF6ABE3-ABEAABECABEDFB1EFE00-FE0FFE20-FE26",
        Mn: "0300-036F0483-04870591-05BD05BF05C105C205C405C505C70610-061A064B-065F067006D6-06DC06DF-06E406E706E806EA-06ED07110730-074A07A6-07B007EB-07F30816-0819081B-08230825-08270829-082D0859-085B08E4-08FE0900-0902093A093C0941-0948094D0951-095709620963098109BC09C1-09C409CD09E209E30A010A020A3C0A410A420A470A480A4B-0A4D0A510A700A710A750A810A820ABC0AC1-0AC50AC70AC80ACD0AE20AE30B010B3C0B3F0B41-0B440B4D0B560B620B630B820BC00BCD0C3E-0C400C46-0C480C4A-0C4D0C550C560C620C630CBC0CBF0CC60CCC0CCD0CE20CE30D41-0D440D4D0D620D630DCA0DD2-0DD40DD60E310E34-0E3A0E47-0E4E0EB10EB4-0EB90EBB0EBC0EC8-0ECD0F180F190F350F370F390F71-0F7E0F80-0F840F860F870F8D-0F970F99-0FBC0FC6102D-10301032-10371039103A103D103E10581059105E-10601071-1074108210851086108D109D135D-135F1712-17141732-1734175217531772177317B417B517B7-17BD17C617C9-17D317DD180B-180D18A91920-19221927192819321939-193B1A171A181A561A58-1A5E1A601A621A65-1A6C1A73-1A7C1A7F1B00-1B031B341B36-1B3A1B3C1B421B6B-1B731B801B811BA2-1BA51BA81BA91BAB1BE61BE81BE91BED1BEF-1BF11C2C-1C331C361C371CD0-1CD21CD4-1CE01CE2-1CE81CED1CF41DC0-1DE61DFC-1DFF20D0-20DC20E120E5-20F02CEF-2CF12D7F2DE0-2DFF302A-302D3099309AA66FA674-A67DA69FA6F0A6F1A802A806A80BA825A826A8C4A8E0-A8F1A926-A92DA947-A951A980-A982A9B3A9B6-A9B9A9BCAA29-AA2EAA31AA32AA35AA36AA43AA4CAAB0AAB2-AAB4AAB7AAB8AABEAABFAAC1AAECAAEDAAF6ABE5ABE8ABEDFB1EFE00-FE0FFE20-FE26",
        Mc: "0903093B093E-09400949-094C094E094F0982098309BE-09C009C709C809CB09CC09D70A030A3E-0A400A830ABE-0AC00AC90ACB0ACC0B020B030B3E0B400B470B480B4B0B4C0B570BBE0BBF0BC10BC20BC6-0BC80BCA-0BCC0BD70C01-0C030C41-0C440C820C830CBE0CC0-0CC40CC70CC80CCA0CCB0CD50CD60D020D030D3E-0D400D46-0D480D4A-0D4C0D570D820D830DCF-0DD10DD8-0DDF0DF20DF30F3E0F3F0F7F102B102C10311038103B103C105610571062-10641067-106D108310841087-108C108F109A-109C17B617BE-17C517C717C81923-19261929-192B193019311933-193819B0-19C019C819C91A19-1A1B1A551A571A611A631A641A6D-1A721B041B351B3B1B3D-1B411B431B441B821BA11BA61BA71BAA1BAC1BAD1BE71BEA-1BEC1BEE1BF21BF31C24-1C2B1C341C351CE11CF21CF3302E302FA823A824A827A880A881A8B4-A8C3A952A953A983A9B4A9B5A9BAA9BBA9BD-A9C0AA2FAA30AA33AA34AA4DAA7BAAEBAAEEAAEFAAF5ABE3ABE4ABE6ABE7ABE9ABEAABEC",
        Me: "0488048920DD-20E020E2-20E4A670-A672",
        N: "0030-003900B200B300B900BC-00BE0660-066906F0-06F907C0-07C90966-096F09E6-09EF09F4-09F90A66-0A6F0AE6-0AEF0B66-0B6F0B72-0B770BE6-0BF20C66-0C6F0C78-0C7E0CE6-0CEF0D66-0D750E50-0E590ED0-0ED90F20-0F331040-10491090-10991369-137C16EE-16F017E0-17E917F0-17F91810-18191946-194F19D0-19DA1A80-1A891A90-1A991B50-1B591BB0-1BB91C40-1C491C50-1C5920702074-20792080-20892150-21822185-21892460-249B24EA-24FF2776-27932CFD30073021-30293038-303A3192-31953220-32293248-324F3251-325F3280-328932B1-32BFA620-A629A6E6-A6EFA830-A835A8D0-A8D9A900-A909A9D0-A9D9AA50-AA59ABF0-ABF9FF10-FF19",
        Nd: "0030-00390660-066906F0-06F907C0-07C90966-096F09E6-09EF0A66-0A6F0AE6-0AEF0B66-0B6F0BE6-0BEF0C66-0C6F0CE6-0CEF0D66-0D6F0E50-0E590ED0-0ED90F20-0F291040-10491090-109917E0-17E91810-18191946-194F19D0-19D91A80-1A891A90-1A991B50-1B591BB0-1BB91C40-1C491C50-1C59A620-A629A8D0-A8D9A900-A909A9D0-A9D9AA50-AA59ABF0-ABF9FF10-FF19",
        Nl: "16EE-16F02160-21822185-218830073021-30293038-303AA6E6-A6EF",
        No: "00B200B300B900BC-00BE09F4-09F90B72-0B770BF0-0BF20C78-0C7E0D70-0D750F2A-0F331369-137C17F0-17F919DA20702074-20792080-20892150-215F21892460-249B24EA-24FF2776-27932CFD3192-31953220-32293248-324F3251-325F3280-328932B1-32BFA830-A835",
        P: "0021-00230025-002A002C-002F003A003B003F0040005B-005D005F007B007D00A100A700AB00B600B700BB00BF037E0387055A-055F0589058A05BE05C005C305C605F305F40609060A060C060D061B061E061F066A-066D06D40700-070D07F7-07F90830-083E085E0964096509700AF00DF40E4F0E5A0E5B0F04-0F120F140F3A-0F3D0F850FD0-0FD40FD90FDA104A-104F10FB1360-13681400166D166E169B169C16EB-16ED1735173617D4-17D617D8-17DA1800-180A194419451A1E1A1F1AA0-1AA61AA8-1AAD1B5A-1B601BFC-1BFF1C3B-1C3F1C7E1C7F1CC0-1CC71CD32010-20272030-20432045-20512053-205E207D207E208D208E2329232A2768-277527C527C627E6-27EF2983-299829D8-29DB29FC29FD2CF9-2CFC2CFE2CFF2D702E00-2E2E2E30-2E3B3001-30033008-30113014-301F3030303D30A030FBA4FEA4FFA60D-A60FA673A67EA6F2-A6F7A874-A877A8CEA8CFA8F8-A8FAA92EA92FA95FA9C1-A9CDA9DEA9DFAA5C-AA5FAADEAADFAAF0AAF1ABEBFD3EFD3FFE10-FE19FE30-FE52FE54-FE61FE63FE68FE6AFE6BFF01-FF03FF05-FF0AFF0C-FF0FFF1AFF1BFF1FFF20FF3B-FF3DFF3FFF5BFF5DFF5F-FF65",
        Pd: "002D058A05BE140018062010-20152E172E1A2E3A2E3B301C303030A0FE31FE32FE58FE63FF0D",
        Ps: "0028005B007B0F3A0F3C169B201A201E2045207D208D23292768276A276C276E27702772277427C527E627E827EA27EC27EE2983298529872989298B298D298F299129932995299729D829DA29FC2E222E242E262E283008300A300C300E3010301430163018301A301DFD3EFE17FE35FE37FE39FE3BFE3DFE3FFE41FE43FE47FE59FE5BFE5DFF08FF3BFF5BFF5FFF62",
        Pe: "0029005D007D0F3B0F3D169C2046207E208E232A2769276B276D276F27712773277527C627E727E927EB27ED27EF298429862988298A298C298E2990299229942996299829D929DB29FD2E232E252E272E293009300B300D300F3011301530173019301B301E301FFD3FFE18FE36FE38FE3AFE3CFE3EFE40FE42FE44FE48FE5AFE5CFE5EFF09FF3DFF5DFF60FF63",
        Pi: "00AB2018201B201C201F20392E022E042E092E0C2E1C2E20",
        Pf: "00BB2019201D203A2E032E052E0A2E0D2E1D2E21",
        Pc: "005F203F20402054FE33FE34FE4D-FE4FFF3F",
        Po: "0021-00230025-0027002A002C002E002F003A003B003F0040005C00A100A700B600B700BF037E0387055A-055F058905C005C305C605F305F40609060A060C060D061B061E061F066A-066D06D40700-070D07F7-07F90830-083E085E0964096509700AF00DF40E4F0E5A0E5B0F04-0F120F140F850FD0-0FD40FD90FDA104A-104F10FB1360-1368166D166E16EB-16ED1735173617D4-17D617D8-17DA1800-18051807-180A194419451A1E1A1F1AA0-1AA61AA8-1AAD1B5A-1B601BFC-1BFF1C3B-1C3F1C7E1C7F1CC0-1CC71CD3201620172020-20272030-2038203B-203E2041-20432047-205120532055-205E2CF9-2CFC2CFE2CFF2D702E002E012E06-2E082E0B2E0E-2E162E182E192E1B2E1E2E1F2E2A-2E2E2E30-2E393001-3003303D30FBA4FEA4FFA60D-A60FA673A67EA6F2-A6F7A874-A877A8CEA8CFA8F8-A8FAA92EA92FA95FA9C1-A9CDA9DEA9DFAA5C-AA5FAADEAADFAAF0AAF1ABEBFE10-FE16FE19FE30FE45FE46FE49-FE4CFE50-FE52FE54-FE57FE5F-FE61FE68FE6AFE6BFF01-FF03FF05-FF07FF0AFF0CFF0EFF0FFF1AFF1BFF1FFF20FF3CFF61FF64FF65",
        S: "0024002B003C-003E005E0060007C007E00A2-00A600A800A900AC00AE-00B100B400B800D700F702C2-02C502D2-02DF02E5-02EB02ED02EF-02FF03750384038503F60482058F0606-0608060B060E060F06DE06E906FD06FE07F609F209F309FA09FB0AF10B700BF3-0BFA0C7F0D790E3F0F01-0F030F130F15-0F170F1A-0F1F0F340F360F380FBE-0FC50FC7-0FCC0FCE0FCF0FD5-0FD8109E109F1390-139917DB194019DE-19FF1B61-1B6A1B74-1B7C1FBD1FBF-1FC11FCD-1FCF1FDD-1FDF1FED-1FEF1FFD1FFE20442052207A-207C208A-208C20A0-20B9210021012103-21062108210921142116-2118211E-2123212521272129212E213A213B2140-2144214A-214D214F2190-2328232B-23F32400-24262440-244A249C-24E92500-26FF2701-27672794-27C427C7-27E527F0-29822999-29D729DC-29FB29FE-2B4C2B50-2B592CE5-2CEA2E80-2E992E9B-2EF32F00-2FD52FF0-2FFB300430123013302030363037303E303F309B309C319031913196-319F31C0-31E33200-321E322A-324732503260-327F328A-32B032C0-32FE3300-33FF4DC0-4DFFA490-A4C6A700-A716A720A721A789A78AA828-A82BA836-A839AA77-AA79FB29FBB2-FBC1FDFCFDFDFE62FE64-FE66FE69FF04FF0BFF1C-FF1EFF3EFF40FF5CFF5EFFE0-FFE6FFE8-FFEEFFFCFFFD",
        Sm: "002B003C-003E007C007E00AC00B100D700F703F60606-060820442052207A-207C208A-208C21182140-2144214B2190-2194219A219B21A021A321A621AE21CE21CF21D221D421F4-22FF2308-230B23202321237C239B-23B323DC-23E125B725C125F8-25FF266F27C0-27C427C7-27E527F0-27FF2900-29822999-29D729DC-29FB29FE-2AFF2B30-2B442B47-2B4CFB29FE62FE64-FE66FF0BFF1C-FF1EFF5CFF5EFFE2FFE9-FFEC",
        Sc: "002400A2-00A5058F060B09F209F309FB0AF10BF90E3F17DB20A0-20B9A838FDFCFE69FF04FFE0FFE1FFE5FFE6",
        Sk: "005E006000A800AF00B400B802C2-02C502D2-02DF02E5-02EB02ED02EF-02FF0375038403851FBD1FBF-1FC11FCD-1FCF1FDD-1FDF1FED-1FEF1FFD1FFE309B309CA700-A716A720A721A789A78AFBB2-FBC1FF3EFF40FFE3",
        So: "00A600A900AE00B00482060E060F06DE06E906FD06FE07F609FA0B700BF3-0BF80BFA0C7F0D790F01-0F030F130F15-0F170F1A-0F1F0F340F360F380FBE-0FC50FC7-0FCC0FCE0FCF0FD5-0FD8109E109F1390-1399194019DE-19FF1B61-1B6A1B74-1B7C210021012103-210621082109211421162117211E-2123212521272129212E213A213B214A214C214D214F2195-2199219C-219F21A121A221A421A521A7-21AD21AF-21CD21D021D121D321D5-21F32300-2307230C-231F2322-2328232B-237B237D-239A23B4-23DB23E2-23F32400-24262440-244A249C-24E92500-25B625B8-25C025C2-25F72600-266E2670-26FF2701-27672794-27BF2800-28FF2B00-2B2F2B452B462B50-2B592CE5-2CEA2E80-2E992E9B-2EF32F00-2FD52FF0-2FFB300430123013302030363037303E303F319031913196-319F31C0-31E33200-321E322A-324732503260-327F328A-32B032C0-32FE3300-33FF4DC0-4DFFA490-A4C6A828-A82BA836A837A839AA77-AA79FDFDFFE4FFE8FFEDFFEEFFFCFFFD",
        Z: "002000A01680180E2000-200A20282029202F205F3000",
        Zs: "002000A01680180E2000-200A202F205F3000",
        Zl: "2028",
        Zp: "2029",
        C: "0000-001F007F-009F00AD03780379037F-0383038B038D03A20528-05300557055805600588058B-058E059005C8-05CF05EB-05EF05F5-0605061C061D06DD070E070F074B074C07B2-07BF07FB-07FF082E082F083F085C085D085F-089F08A108AD-08E308FF097809800984098D098E0991099209A909B109B3-09B509BA09BB09C509C609C909CA09CF-09D609D8-09DB09DE09E409E509FC-0A000A040A0B-0A0E0A110A120A290A310A340A370A3A0A3B0A3D0A43-0A460A490A4A0A4E-0A500A52-0A580A5D0A5F-0A650A76-0A800A840A8E0A920AA90AB10AB40ABA0ABB0AC60ACA0ACE0ACF0AD1-0ADF0AE40AE50AF2-0B000B040B0D0B0E0B110B120B290B310B340B3A0B3B0B450B460B490B4A0B4E-0B550B58-0B5B0B5E0B640B650B78-0B810B840B8B-0B8D0B910B96-0B980B9B0B9D0BA0-0BA20BA5-0BA70BAB-0BAD0BBA-0BBD0BC3-0BC50BC90BCE0BCF0BD1-0BD60BD8-0BE50BFB-0C000C040C0D0C110C290C340C3A-0C3C0C450C490C4E-0C540C570C5A-0C5F0C640C650C70-0C770C800C810C840C8D0C910CA90CB40CBA0CBB0CC50CC90CCE-0CD40CD7-0CDD0CDF0CE40CE50CF00CF3-0D010D040D0D0D110D3B0D3C0D450D490D4F-0D560D58-0D5F0D640D650D76-0D780D800D810D840D97-0D990DB20DBC0DBE0DBF0DC7-0DC90DCB-0DCE0DD50DD70DE0-0DF10DF5-0E000E3B-0E3E0E5C-0E800E830E850E860E890E8B0E8C0E8E-0E930E980EA00EA40EA60EA80EA90EAC0EBA0EBE0EBF0EC50EC70ECE0ECF0EDA0EDB0EE0-0EFF0F480F6D-0F700F980FBD0FCD0FDB-0FFF10C610C8-10CC10CE10CF1249124E124F12571259125E125F1289128E128F12B112B612B712BF12C112C612C712D7131113161317135B135C137D-137F139A-139F13F5-13FF169D-169F16F1-16FF170D1715-171F1737-173F1754-175F176D17711774-177F17DE17DF17EA-17EF17FA-17FF180F181A-181F1878-187F18AB-18AF18F6-18FF191D-191F192C-192F193C-193F1941-1943196E196F1975-197F19AC-19AF19CA-19CF19DB-19DD1A1C1A1D1A5F1A7D1A7E1A8A-1A8F1A9A-1A9F1AAE-1AFF1B4C-1B4F1B7D-1B7F1BF4-1BFB1C38-1C3A1C4A-1C4C1C80-1CBF1CC8-1CCF1CF7-1CFF1DE7-1DFB1F161F171F1E1F1F1F461F471F4E1F4F1F581F5A1F5C1F5E1F7E1F7F1FB51FC51FD41FD51FDC1FF01FF11FF51FFF200B-200F202A-202E2060-206F20722073208F209D-209F20BA-20CF20F1-20FF218A-218F23F4-23FF2427-243F244B-245F27002B4D-2B4F2B5A-2BFF2C2F2C5F2CF4-2CF82D262D28-2D2C2D2E2D2F2D68-2D6E2D71-2D7E2D97-2D9F2DA72DAF2DB72DBF2DC72DCF2DD72DDF2E3C-2E7F2E9A2EF4-2EFF2FD6-2FEF2FFC-2FFF3040309730983100-3104312E-3130318F31BB-31BF31E4-31EF321F32FF4DB6-4DBF9FCD-9FFFA48D-A48FA4C7-A4CFA62C-A63FA698-A69EA6F8-A6FFA78FA794-A79FA7AB-A7F7A82C-A82FA83A-A83FA878-A87FA8C5-A8CDA8DA-A8DFA8FC-A8FFA954-A95EA97D-A97FA9CEA9DA-A9DDA9E0-A9FFAA37-AA3FAA4EAA4FAA5AAA5BAA7C-AA7FAAC3-AADAAAF7-AB00AB07AB08AB0FAB10AB17-AB1FAB27AB2F-ABBFABEEABEFABFA-ABFFD7A4-D7AFD7C7-D7CAD7FC-F8FFFA6EFA6FFADA-FAFFFB07-FB12FB18-FB1CFB37FB3DFB3FFB42FB45FBC2-FBD2FD40-FD4FFD90FD91FDC8-FDEFFDFEFDFFFE1A-FE1FFE27-FE2FFE53FE67FE6C-FE6FFE75FEFD-FF00FFBF-FFC1FFC8FFC9FFD0FFD1FFD8FFD9FFDD-FFDFFFE7FFEF-FFFBFFFEFFFF",
        Cc: "0000-001F007F-009F",
        Cf: "00AD0600-060406DD070F200B-200F202A-202E2060-2064206A-206FFEFFFFF9-FFFB",
        Co: "E000-F8FF",
        Cs: "D800-DFFF",
        Cn: "03780379037F-0383038B038D03A20528-05300557055805600588058B-058E059005C8-05CF05EB-05EF05F5-05FF0605061C061D070E074B074C07B2-07BF07FB-07FF082E082F083F085C085D085F-089F08A108AD-08E308FF097809800984098D098E0991099209A909B109B3-09B509BA09BB09C509C609C909CA09CF-09D609D8-09DB09DE09E409E509FC-0A000A040A0B-0A0E0A110A120A290A310A340A370A3A0A3B0A3D0A43-0A460A490A4A0A4E-0A500A52-0A580A5D0A5F-0A650A76-0A800A840A8E0A920AA90AB10AB40ABA0ABB0AC60ACA0ACE0ACF0AD1-0ADF0AE40AE50AF2-0B000B040B0D0B0E0B110B120B290B310B340B3A0B3B0B450B460B490B4A0B4E-0B550B58-0B5B0B5E0B640B650B78-0B810B840B8B-0B8D0B910B96-0B980B9B0B9D0BA0-0BA20BA5-0BA70BAB-0BAD0BBA-0BBD0BC3-0BC50BC90BCE0BCF0BD1-0BD60BD8-0BE50BFB-0C000C040C0D0C110C290C340C3A-0C3C0C450C490C4E-0C540C570C5A-0C5F0C640C650C70-0C770C800C810C840C8D0C910CA90CB40CBA0CBB0CC50CC90CCE-0CD40CD7-0CDD0CDF0CE40CE50CF00CF3-0D010D040D0D0D110D3B0D3C0D450D490D4F-0D560D58-0D5F0D640D650D76-0D780D800D810D840D97-0D990DB20DBC0DBE0DBF0DC7-0DC90DCB-0DCE0DD50DD70DE0-0DF10DF5-0E000E3B-0E3E0E5C-0E800E830E850E860E890E8B0E8C0E8E-0E930E980EA00EA40EA60EA80EA90EAC0EBA0EBE0EBF0EC50EC70ECE0ECF0EDA0EDB0EE0-0EFF0F480F6D-0F700F980FBD0FCD0FDB-0FFF10C610C8-10CC10CE10CF1249124E124F12571259125E125F1289128E128F12B112B612B712BF12C112C612C712D7131113161317135B135C137D-137F139A-139F13F5-13FF169D-169F16F1-16FF170D1715-171F1737-173F1754-175F176D17711774-177F17DE17DF17EA-17EF17FA-17FF180F181A-181F1878-187F18AB-18AF18F6-18FF191D-191F192C-192F193C-193F1941-1943196E196F1975-197F19AC-19AF19CA-19CF19DB-19DD1A1C1A1D1A5F1A7D1A7E1A8A-1A8F1A9A-1A9F1AAE-1AFF1B4C-1B4F1B7D-1B7F1BF4-1BFB1C38-1C3A1C4A-1C4C1C80-1CBF1CC8-1CCF1CF7-1CFF1DE7-1DFB1F161F171F1E1F1F1F461F471F4E1F4F1F581F5A1F5C1F5E1F7E1F7F1FB51FC51FD41FD51FDC1FF01FF11FF51FFF2065-206920722073208F209D-209F20BA-20CF20F1-20FF218A-218F23F4-23FF2427-243F244B-245F27002B4D-2B4F2B5A-2BFF2C2F2C5F2CF4-2CF82D262D28-2D2C2D2E2D2F2D68-2D6E2D71-2D7E2D97-2D9F2DA72DAF2DB72DBF2DC72DCF2DD72DDF2E3C-2E7F2E9A2EF4-2EFF2FD6-2FEF2FFC-2FFF3040309730983100-3104312E-3130318F31BB-31BF31E4-31EF321F32FF4DB6-4DBF9FCD-9FFFA48D-A48FA4C7-A4CFA62C-A63FA698-A69EA6F8-A6FFA78FA794-A79FA7AB-A7F7A82C-A82FA83A-A83FA878-A87FA8C5-A8CDA8DA-A8DFA8FC-A8FFA954-A95EA97D-A97FA9CEA9DA-A9DDA9E0-A9FFAA37-AA3FAA4EAA4FAA5AAA5BAA7C-AA7FAAC3-AADAAAF7-AB00AB07AB08AB0FAB10AB17-AB1FAB27AB2F-ABBFABEEABEFABFA-ABFFD7A4-D7AFD7C7-D7CAD7FC-D7FFFA6EFA6FFADA-FAFFFB07-FB12FB18-FB1CFB37FB3DFB3FFB42FB45FBC2-FBD2FD40-FD4FFD90FD91FDC8-FDEFFDFEFDFFFE1A-FE1FFE27-FE2FFE53FE67FE6C-FE6FFE75FEFDFEFEFF00FFBF-FFC1FFC8FFC9FFD0FFD1FFD8FFD9FFDD-FFDFFFE7FFEF-FFF8FFFEFFFF"
    }, {
        Ll: "Lowercase_Letter",
        Lu: "Uppercase_Letter",
        Lt: "Titlecase_Letter",
        Lm: "Modifier_Letter",
        Lo: "Other_Letter",
        M: "Mark",
        Mn: "Nonspacing_Mark",
        Mc: "Spacing_Mark",
        Me: "Enclosing_Mark",
        N: "Number",
        Nd: "Decimal_Number",
        Nl: "Letter_Number",
        No: "Other_Number",
        P: "Punctuation",
        Pd: "Dash_Punctuation",
        Ps: "Open_Punctuation",
        Pe: "Close_Punctuation",
        Pi: "Initial_Punctuation",
        Pf: "Final_Punctuation",
        Pc: "Connector_Punctuation",
        Po: "Other_Punctuation",
        S: "Symbol",
        Sm: "Math_Symbol",
        Sc: "Currency_Symbol",
        Sk: "Modifier_Symbol",
        So: "Other_Symbol",
        Z: "Separator",
        Zs: "Space_Separator",
        Zl: "Line_Separator",
        Zp: "Paragraph_Separator",
        C: "Other",
        Cc: "Control",
        Cf: "Format",
        Co: "Private_Use",
        Cs: "Surrogate",
        Cn: "Unassigned"
    })
})(XRegExp);
(function(n) {
    "use strict";
    if (!n.addUnicodePackage) throw new ReferenceError("Unicode Base must be loaded before Unicode Scripts");
    n.install("extensibility"), n.addUnicodePackage({
        Arabic: "0600-06040606-060B060D-061A061E0620-063F0641-064A0656-065E066A-066F0671-06DC06DE-06FF0750-077F08A008A2-08AC08E4-08FEFB50-FBC1FBD3-FD3DFD50-FD8FFD92-FDC7FDF0-FDFCFE70-FE74FE76-FEFC",
        Armenian: "0531-05560559-055F0561-0587058A058FFB13-FB17",
        Balinese: "1B00-1B4B1B50-1B7C",
        Bamum: "A6A0-A6F7",
        Batak: "1BC0-1BF31BFC-1BFF",
        Bengali: "0981-09830985-098C098F09900993-09A809AA-09B009B209B6-09B909BC-09C409C709C809CB-09CE09D709DC09DD09DF-09E309E6-09FB",
        Bopomofo: "02EA02EB3105-312D31A0-31BA",
        Braille: "2800-28FF",
        Buginese: "1A00-1A1B1A1E1A1F",
        Buhid: "1740-1753",
        Canadian_Aboriginal: "1400-167F18B0-18F5",
        Cham: "AA00-AA36AA40-AA4DAA50-AA59AA5C-AA5F",
        Cherokee: "13A0-13F4",
        Common: "0000-0040005B-0060007B-00A900AB-00B900BB-00BF00D700F702B9-02DF02E5-02E902EC-02FF0374037E038503870589060C061B061F06400660-066906DD096409650E3F0FD5-0FD810FB16EB-16ED173517361802180318051CD31CE11CE9-1CEC1CEE-1CF31CF51CF62000-200B200E-2064206A-20702074-207E2080-208E20A0-20B92100-21252127-2129212C-21312133-214D214F-215F21892190-23F32400-24262440-244A2460-26FF2701-27FF2900-2B4C2B50-2B592E00-2E3B2FF0-2FFB3000-300430063008-30203030-3037303C-303F309B309C30A030FB30FC3190-319F31C0-31E33220-325F327F-32CF3358-33FF4DC0-4DFFA700-A721A788-A78AA830-A839FD3EFD3FFDFDFE10-FE19FE30-FE52FE54-FE66FE68-FE6BFEFFFF01-FF20FF3B-FF40FF5B-FF65FF70FF9EFF9FFFE0-FFE6FFE8-FFEEFFF9-FFFD",
        Coptic: "03E2-03EF2C80-2CF32CF9-2CFF",
        Cyrillic: "0400-04840487-05271D2B1D782DE0-2DFFA640-A697A69F",
        Devanagari: "0900-09500953-09630966-09770979-097FA8E0-A8FB",
        Ethiopic: "1200-1248124A-124D1250-12561258125A-125D1260-1288128A-128D1290-12B012B2-12B512B8-12BE12C012C2-12C512C8-12D612D8-13101312-13151318-135A135D-137C1380-13992D80-2D962DA0-2DA62DA8-2DAE2DB0-2DB62DB8-2DBE2DC0-2DC62DC8-2DCE2DD0-2DD62DD8-2DDEAB01-AB06AB09-AB0EAB11-AB16AB20-AB26AB28-AB2E",
        Georgian: "10A0-10C510C710CD10D0-10FA10FC-10FF2D00-2D252D272D2D",
        Glagolitic: "2C00-2C2E2C30-2C5E",
        Greek: "0370-03730375-0377037A-037D038403860388-038A038C038E-03A103A3-03E103F0-03FF1D26-1D2A1D5D-1D611D66-1D6A1DBF1F00-1F151F18-1F1D1F20-1F451F48-1F4D1F50-1F571F591F5B1F5D1F5F-1F7D1F80-1FB41FB6-1FC41FC6-1FD31FD6-1FDB1FDD-1FEF1FF2-1FF41FF6-1FFE2126",
        Gujarati: "0A81-0A830A85-0A8D0A8F-0A910A93-0AA80AAA-0AB00AB20AB30AB5-0AB90ABC-0AC50AC7-0AC90ACB-0ACD0AD00AE0-0AE30AE6-0AF1",
        Gurmukhi: "0A01-0A030A05-0A0A0A0F0A100A13-0A280A2A-0A300A320A330A350A360A380A390A3C0A3E-0A420A470A480A4B-0A4D0A510A59-0A5C0A5E0A66-0A75",
        Han: "2E80-2E992E9B-2EF32F00-2FD5300530073021-30293038-303B3400-4DB54E00-9FCCF900-FA6DFA70-FAD9",
        Hangul: "1100-11FF302E302F3131-318E3200-321E3260-327EA960-A97CAC00-D7A3D7B0-D7C6D7CB-D7FBFFA0-FFBEFFC2-FFC7FFCA-FFCFFFD2-FFD7FFDA-FFDC",
        Hanunoo: "1720-1734",
        Hebrew: "0591-05C705D0-05EA05F0-05F4FB1D-FB36FB38-FB3CFB3EFB40FB41FB43FB44FB46-FB4F",
        Hiragana: "3041-3096309D-309F",
        Inherited: "0300-036F04850486064B-0655065F0670095109521CD0-1CD21CD4-1CE01CE2-1CE81CED1CF41DC0-1DE61DFC-1DFF200C200D20D0-20F0302A-302D3099309AFE00-FE0FFE20-FE26",
        Javanese: "A980-A9CDA9CF-A9D9A9DEA9DF",
        Kannada: "0C820C830C85-0C8C0C8E-0C900C92-0CA80CAA-0CB30CB5-0CB90CBC-0CC40CC6-0CC80CCA-0CCD0CD50CD60CDE0CE0-0CE30CE6-0CEF0CF10CF2",
        Katakana: "30A1-30FA30FD-30FF31F0-31FF32D0-32FE3300-3357FF66-FF6FFF71-FF9D",
        Kayah_Li: "A900-A92F",
        Khmer: "1780-17DD17E0-17E917F0-17F919E0-19FF",
        Lao: "0E810E820E840E870E880E8A0E8D0E94-0E970E99-0E9F0EA1-0EA30EA50EA70EAA0EAB0EAD-0EB90EBB-0EBD0EC0-0EC40EC60EC8-0ECD0ED0-0ED90EDC-0EDF",
        Latin: "0041-005A0061-007A00AA00BA00C0-00D600D8-00F600F8-02B802E0-02E41D00-1D251D2C-1D5C1D62-1D651D6B-1D771D79-1DBE1E00-1EFF2071207F2090-209C212A212B2132214E2160-21882C60-2C7FA722-A787A78B-A78EA790-A793A7A0-A7AAA7F8-A7FFFB00-FB06FF21-FF3AFF41-FF5A",
        Lepcha: "1C00-1C371C3B-1C491C4D-1C4F",
        Limbu: "1900-191C1920-192B1930-193B19401944-194F",
        Lisu: "A4D0-A4FF",
        Malayalam: "0D020D030D05-0D0C0D0E-0D100D12-0D3A0D3D-0D440D46-0D480D4A-0D4E0D570D60-0D630D66-0D750D79-0D7F",
        Mandaic: "0840-085B085E",
        Meetei_Mayek: "AAE0-AAF6ABC0-ABEDABF0-ABF9",
        Mongolian: "1800180118041806-180E1810-18191820-18771880-18AA",
        Myanmar: "1000-109FAA60-AA7B",
        New_Tai_Lue: "1980-19AB19B0-19C919D0-19DA19DE19DF",
        Nko: "07C0-07FA",
        Ogham: "1680-169C",
        Ol_Chiki: "1C50-1C7F",
        Oriya: "0B01-0B030B05-0B0C0B0F0B100B13-0B280B2A-0B300B320B330B35-0B390B3C-0B440B470B480B4B-0B4D0B560B570B5C0B5D0B5F-0B630B66-0B77",
        Phags_Pa: "A840-A877",
        Rejang: "A930-A953A95F",
        Runic: "16A0-16EA16EE-16F0",
        Samaritan: "0800-082D0830-083E",
        Saurashtra: "A880-A8C4A8CE-A8D9",
        Sinhala: "0D820D830D85-0D960D9A-0DB10DB3-0DBB0DBD0DC0-0DC60DCA0DCF-0DD40DD60DD8-0DDF0DF2-0DF4",
        Sundanese: "1B80-1BBF1CC0-1CC7",
        Syloti_Nagri: "A800-A82B",
        Syriac: "0700-070D070F-074A074D-074F",
        Tagalog: "1700-170C170E-1714",
        Tagbanwa: "1760-176C176E-177017721773",
        Tai_Le: "1950-196D1970-1974",
        Tai_Tham: "1A20-1A5E1A60-1A7C1A7F-1A891A90-1A991AA0-1AAD",
        Tai_Viet: "AA80-AAC2AADB-AADF",
        Tamil: "0B820B830B85-0B8A0B8E-0B900B92-0B950B990B9A0B9C0B9E0B9F0BA30BA40BA8-0BAA0BAE-0BB90BBE-0BC20BC6-0BC80BCA-0BCD0BD00BD70BE6-0BFA",
        Telugu: "0C01-0C030C05-0C0C0C0E-0C100C12-0C280C2A-0C330C35-0C390C3D-0C440C46-0C480C4A-0C4D0C550C560C580C590C60-0C630C66-0C6F0C78-0C7F",
        Thaana: "0780-07B1",
        Thai: "0E01-0E3A0E40-0E5B",
        Tibetan: "0F00-0F470F49-0F6C0F71-0F970F99-0FBC0FBE-0FCC0FCE-0FD40FD90FDA",
        Tifinagh: "2D30-2D672D6F2D702D7F",
        Vai: "A500-A62B",
        Yi: "A000-A48CA490-A4C6"
    })
})(XRegExp);
(function(n) {
    "use strict";
    if (!n.addUnicodePackage) throw new ReferenceError("Unicode Base must be loaded before Unicode Blocks");
    n.install("extensibility"), n.addUnicodePackage({
        InBasic_Latin: "0000-007F",
        InLatin_1_Supplement: "0080-00FF",
        InLatin_Extended_A: "0100-017F",
        InLatin_Extended_B: "0180-024F",
        InIPA_Extensions: "0250-02AF",
        InSpacing_Modifier_Letters: "02B0-02FF",
        InCombining_Diacritical_Marks: "0300-036F",
        InGreek_and_Coptic: "0370-03FF",
        InCyrillic: "0400-04FF",
        InCyrillic_Supplement: "0500-052F",
        InArmenian: "0530-058F",
        InHebrew: "0590-05FF",
        InArabic: "0600-06FF",
        InSyriac: "0700-074F",
        InArabic_Supplement: "0750-077F",
        InThaana: "0780-07BF",
        InNKo: "07C0-07FF",
        InSamaritan: "0800-083F",
        InMandaic: "0840-085F",
        InArabic_Extended_A: "08A0-08FF",
        InDevanagari: "0900-097F",
        InBengali: "0980-09FF",
        InGurmukhi: "0A00-0A7F",
        InGujarati: "0A80-0AFF",
        InOriya: "0B00-0B7F",
        InTamil: "0B80-0BFF",
        InTelugu: "0C00-0C7F",
        InKannada: "0C80-0CFF",
        InMalayalam: "0D00-0D7F",
        InSinhala: "0D80-0DFF",
        InThai: "0E00-0E7F",
        InLao: "0E80-0EFF",
        InTibetan: "0F00-0FFF",
        InMyanmar: "1000-109F",
        InGeorgian: "10A0-10FF",
        InHangul_Jamo: "1100-11FF",
        InEthiopic: "1200-137F",
        InEthiopic_Supplement: "1380-139F",
        InCherokee: "13A0-13FF",
        InUnified_Canadian_Aboriginal_Syllabics: "1400-167F",
        InOgham: "1680-169F",
        InRunic: "16A0-16FF",
        InTagalog: "1700-171F",
        InHanunoo: "1720-173F",
        InBuhid: "1740-175F",
        InTagbanwa: "1760-177F",
        InKhmer: "1780-17FF",
        InMongolian: "1800-18AF",
        InUnified_Canadian_Aboriginal_Syllabics_Extended: "18B0-18FF",
        InLimbu: "1900-194F",
        InTai_Le: "1950-197F",
        InNew_Tai_Lue: "1980-19DF",
        InKhmer_Symbols: "19E0-19FF",
        InBuginese: "1A00-1A1F",
        InTai_Tham: "1A20-1AAF",
        InBalinese: "1B00-1B7F",
        InSundanese: "1B80-1BBF",
        InBatak: "1BC0-1BFF",
        InLepcha: "1C00-1C4F",
        InOl_Chiki: "1C50-1C7F",
        InSundanese_Supplement: "1CC0-1CCF",
        InVedic_Extensions: "1CD0-1CFF",
        InPhonetic_Extensions: "1D00-1D7F",
        InPhonetic_Extensions_Supplement: "1D80-1DBF",
        InCombining_Diacritical_Marks_Supplement: "1DC0-1DFF",
        InLatin_Extended_Additional: "1E00-1EFF",
        InGreek_Extended: "1F00-1FFF",
        InGeneral_Punctuation: "2000-206F",
        InSuperscripts_and_Subscripts: "2070-209F",
        InCurrency_Symbols: "20A0-20CF",
        InCombining_Diacritical_Marks_for_Symbols: "20D0-20FF",
        InLetterlike_Symbols: "2100-214F",
        InNumber_Forms: "2150-218F",
        InArrows: "2190-21FF",
        InMathematical_Operators: "2200-22FF",
        InMiscellaneous_Technical: "2300-23FF",
        InControl_Pictures: "2400-243F",
        InOptical_Character_Recognition: "2440-245F",
        InEnclosed_Alphanumerics: "2460-24FF",
        InBox_Drawing: "2500-257F",
        InBlock_Elements: "2580-259F",
        InGeometric_Shapes: "25A0-25FF",
        InMiscellaneous_Symbols: "2600-26FF",
        InDingbats: "2700-27BF",
        InMiscellaneous_Mathematical_Symbols_A: "27C0-27EF",
        InSupplemental_Arrows_A: "27F0-27FF",
        InBraille_Patterns: "2800-28FF",
        InSupplemental_Arrows_B: "2900-297F",
        InMiscellaneous_Mathematical_Symbols_B: "2980-29FF",
        InSupplemental_Mathematical_Operators: "2A00-2AFF",
        InMiscellaneous_Symbols_and_Arrows: "2B00-2BFF",
        InGlagolitic: "2C00-2C5F",
        InLatin_Extended_C: "2C60-2C7F",
        InCoptic: "2C80-2CFF",
        InGeorgian_Supplement: "2D00-2D2F",
        InTifinagh: "2D30-2D7F",
        InEthiopic_Extended: "2D80-2DDF",
        InCyrillic_Extended_A: "2DE0-2DFF",
        InSupplemental_Punctuation: "2E00-2E7F",
        InCJK_Radicals_Supplement: "2E80-2EFF",
        InKangxi_Radicals: "2F00-2FDF",
        InIdeographic_Description_Characters: "2FF0-2FFF",
        InCJK_Symbols_and_Punctuation: "3000-303F",
        InHiragana: "3040-309F",
        InKatakana: "30A0-30FF",
        InBopomofo: "3100-312F",
        InHangul_Compatibility_Jamo: "3130-318F",
        InKanbun: "3190-319F",
        InBopomofo_Extended: "31A0-31BF",
        InCJK_Strokes: "31C0-31EF",
        InKatakana_Phonetic_Extensions: "31F0-31FF",
        InEnclosed_CJK_Letters_and_Months: "3200-32FF",
        InCJK_Compatibility: "3300-33FF",
        InCJK_Unified_Ideographs_Extension_A: "3400-4DBF",
        InYijing_Hexagram_Symbols: "4DC0-4DFF",
        InCJK_Unified_Ideographs: "4E00-9FFF",
        InYi_Syllables: "A000-A48F",
        InYi_Radicals: "A490-A4CF",
        InLisu: "A4D0-A4FF",
        InVai: "A500-A63F",
        InCyrillic_Extended_B: "A640-A69F",
        InBamum: "A6A0-A6FF",
        InModifier_Tone_Letters: "A700-A71F",
        InLatin_Extended_D: "A720-A7FF",
        InSyloti_Nagri: "A800-A82F",
        InCommon_Indic_Number_Forms: "A830-A83F",
        InPhags_pa: "A840-A87F",
        InSaurashtra: "A880-A8DF",
        InDevanagari_Extended: "A8E0-A8FF",
        InKayah_Li: "A900-A92F",
        InRejang: "A930-A95F",
        InHangul_Jamo_Extended_A: "A960-A97F",
        InJavanese: "A980-A9DF",
        InCham: "AA00-AA5F",
        InMyanmar_Extended_A: "AA60-AA7F",
        InTai_Viet: "AA80-AADF",
        InMeetei_Mayek_Extensions: "AAE0-AAFF",
        InEthiopic_Extended_A: "AB00-AB2F",
        InMeetei_Mayek: "ABC0-ABFF",
        InHangul_Syllables: "AC00-D7AF",
        InHangul_Jamo_Extended_B: "D7B0-D7FF",
        InHigh_Surrogates: "D800-DB7F",
        InHigh_Private_Use_Surrogates: "DB80-DBFF",
        InLow_Surrogates: "DC00-DFFF",
        InPrivate_Use_Area: "E000-F8FF",
        InCJK_Compatibility_Ideographs: "F900-FAFF",
        InAlphabetic_Presentation_Forms: "FB00-FB4F",
        InArabic_Presentation_Forms_A: "FB50-FDFF",
        InVariation_Selectors: "FE00-FE0F",
        InVertical_Forms: "FE10-FE1F",
        InCombining_Half_Marks: "FE20-FE2F",
        InCJK_Compatibility_Forms: "FE30-FE4F",
        InSmall_Form_Variants: "FE50-FE6F",
        InArabic_Presentation_Forms_B: "FE70-FEFF",
        InHalfwidth_and_Fullwidth_Forms: "FF00-FFEF",
        InSpecials: "FFF0-FFFF"
    })
})(XRegExp);
(function(n) {
    "use strict";
    if (!n.addUnicodePackage) throw new ReferenceError("Unicode Base must be loaded before Unicode Properties");
    n.install("extensibility"), n.addUnicodePackage({
        Alphabetic: "0041-005A0061-007A00AA00B500BA00C0-00D600D8-00F600F8-02C102C6-02D102E0-02E402EC02EE03450370-037403760377037A-037D03860388-038A038C038E-03A103A3-03F503F7-0481048A-05270531-055605590561-058705B0-05BD05BF05C105C205C405C505C705D0-05EA05F0-05F20610-061A0620-06570659-065F066E-06D306D5-06DC06E1-06E806ED-06EF06FA-06FC06FF0710-073F074D-07B107CA-07EA07F407F507FA0800-0817081A-082C0840-085808A008A2-08AC08E4-08E908F0-08FE0900-093B093D-094C094E-09500955-09630971-09770979-097F0981-09830985-098C098F09900993-09A809AA-09B009B209B6-09B909BD-09C409C709C809CB09CC09CE09D709DC09DD09DF-09E309F009F10A01-0A030A05-0A0A0A0F0A100A13-0A280A2A-0A300A320A330A350A360A380A390A3E-0A420A470A480A4B0A4C0A510A59-0A5C0A5E0A70-0A750A81-0A830A85-0A8D0A8F-0A910A93-0AA80AAA-0AB00AB20AB30AB5-0AB90ABD-0AC50AC7-0AC90ACB0ACC0AD00AE0-0AE30B01-0B030B05-0B0C0B0F0B100B13-0B280B2A-0B300B320B330B35-0B390B3D-0B440B470B480B4B0B4C0B560B570B5C0B5D0B5F-0B630B710B820B830B85-0B8A0B8E-0B900B92-0B950B990B9A0B9C0B9E0B9F0BA30BA40BA8-0BAA0BAE-0BB90BBE-0BC20BC6-0BC80BCA-0BCC0BD00BD70C01-0C030C05-0C0C0C0E-0C100C12-0C280C2A-0C330C35-0C390C3D-0C440C46-0C480C4A-0C4C0C550C560C580C590C60-0C630C820C830C85-0C8C0C8E-0C900C92-0CA80CAA-0CB30CB5-0CB90CBD-0CC40CC6-0CC80CCA-0CCC0CD50CD60CDE0CE0-0CE30CF10CF20D020D030D05-0D0C0D0E-0D100D12-0D3A0D3D-0D440D46-0D480D4A-0D4C0D4E0D570D60-0D630D7A-0D7F0D820D830D85-0D960D9A-0DB10DB3-0DBB0DBD0DC0-0DC60DCF-0DD40DD60DD8-0DDF0DF20DF30E01-0E3A0E40-0E460E4D0E810E820E840E870E880E8A0E8D0E94-0E970E99-0E9F0EA1-0EA30EA50EA70EAA0EAB0EAD-0EB90EBB-0EBD0EC0-0EC40EC60ECD0EDC-0EDF0F000F40-0F470F49-0F6C0F71-0F810F88-0F970F99-0FBC1000-10361038103B-103F1050-10621065-1068106E-1086108E109C109D10A0-10C510C710CD10D0-10FA10FC-1248124A-124D1250-12561258125A-125D1260-1288128A-128D1290-12B012B2-12B512B8-12BE12C012C2-12C512C8-12D612D8-13101312-13151318-135A135F1380-138F13A0-13F41401-166C166F-167F1681-169A16A0-16EA16EE-16F01700-170C170E-17131720-17331740-17531760-176C176E-1770177217731780-17B317B6-17C817D717DC1820-18771880-18AA18B0-18F51900-191C1920-192B1930-19381950-196D1970-19741980-19AB19B0-19C91A00-1A1B1A20-1A5E1A61-1A741AA71B00-1B331B35-1B431B45-1B4B1B80-1BA91BAC-1BAF1BBA-1BE51BE7-1BF11C00-1C351C4D-1C4F1C5A-1C7D1CE9-1CEC1CEE-1CF31CF51CF61D00-1DBF1E00-1F151F18-1F1D1F20-1F451F48-1F4D1F50-1F571F591F5B1F5D1F5F-1F7D1F80-1FB41FB6-1FBC1FBE1FC2-1FC41FC6-1FCC1FD0-1FD31FD6-1FDB1FE0-1FEC1FF2-1FF41FF6-1FFC2071207F2090-209C21022107210A-211321152119-211D212421262128212A-212D212F-2139213C-213F2145-2149214E2160-218824B6-24E92C00-2C2E2C30-2C5E2C60-2CE42CEB-2CEE2CF22CF32D00-2D252D272D2D2D30-2D672D6F2D80-2D962DA0-2DA62DA8-2DAE2DB0-2DB62DB8-2DBE2DC0-2DC62DC8-2DCE2DD0-2DD62DD8-2DDE2DE0-2DFF2E2F3005-30073021-30293031-30353038-303C3041-3096309D-309F30A1-30FA30FC-30FF3105-312D3131-318E31A0-31BA31F0-31FF3400-4DB54E00-9FCCA000-A48CA4D0-A4FDA500-A60CA610-A61FA62AA62BA640-A66EA674-A67BA67F-A697A69F-A6EFA717-A71FA722-A788A78B-A78EA790-A793A7A0-A7AAA7F8-A801A803-A805A807-A80AA80C-A827A840-A873A880-A8C3A8F2-A8F7A8FBA90A-A92AA930-A952A960-A97CA980-A9B2A9B4-A9BFA9CFAA00-AA36AA40-AA4DAA60-AA76AA7AAA80-AABEAAC0AAC2AADB-AADDAAE0-AAEFAAF2-AAF5AB01-AB06AB09-AB0EAB11-AB16AB20-AB26AB28-AB2EABC0-ABEAAC00-D7A3D7B0-D7C6D7CB-D7FBF900-FA6DFA70-FAD9FB00-FB06FB13-FB17FB1D-FB28FB2A-FB36FB38-FB3CFB3EFB40FB41FB43FB44FB46-FBB1FBD3-FD3DFD50-FD8FFD92-FDC7FDF0-FDFBFE70-FE74FE76-FEFCFF21-FF3AFF41-FF5AFF66-FFBEFFC2-FFC7FFCA-FFCFFFD2-FFD7FFDA-FFDC",
        Uppercase: "0041-005A00C0-00D600D8-00DE01000102010401060108010A010C010E01100112011401160118011A011C011E01200122012401260128012A012C012E01300132013401360139013B013D013F0141014301450147014A014C014E01500152015401560158015A015C015E01600162016401660168016A016C016E017001720174017601780179017B017D018101820184018601870189-018B018E-0191019301940196-0198019C019D019F01A001A201A401A601A701A901AC01AE01AF01B1-01B301B501B701B801BC01C401C701CA01CD01CF01D101D301D501D701D901DB01DE01E001E201E401E601E801EA01EC01EE01F101F401F6-01F801FA01FC01FE02000202020402060208020A020C020E02100212021402160218021A021C021E02200222022402260228022A022C022E02300232023A023B023D023E02410243-02460248024A024C024E03700372037603860388-038A038C038E038F0391-03A103A3-03AB03CF03D2-03D403D803DA03DC03DE03E003E203E403E603E803EA03EC03EE03F403F703F903FA03FD-042F04600462046404660468046A046C046E04700472047404760478047A047C047E0480048A048C048E04900492049404960498049A049C049E04A004A204A404A604A804AA04AC04AE04B004B204B404B604B804BA04BC04BE04C004C104C304C504C704C904CB04CD04D004D204D404D604D804DA04DC04DE04E004E204E404E604E804EA04EC04EE04F004F204F404F604F804FA04FC04FE05000502050405060508050A050C050E05100512051405160518051A051C051E05200522052405260531-055610A0-10C510C710CD1E001E021E041E061E081E0A1E0C1E0E1E101E121E141E161E181E1A1E1C1E1E1E201E221E241E261E281E2A1E2C1E2E1E301E321E341E361E381E3A1E3C1E3E1E401E421E441E461E481E4A1E4C1E4E1E501E521E541E561E581E5A1E5C1E5E1E601E621E641E661E681E6A1E6C1E6E1E701E721E741E761E781E7A1E7C1E7E1E801E821E841E861E881E8A1E8C1E8E1E901E921E941E9E1EA01EA21EA41EA61EA81EAA1EAC1EAE1EB01EB21EB41EB61EB81EBA1EBC1EBE1EC01EC21EC41EC61EC81ECA1ECC1ECE1ED01ED21ED41ED61ED81EDA1EDC1EDE1EE01EE21EE41EE61EE81EEA1EEC1EEE1EF01EF21EF41EF61EF81EFA1EFC1EFE1F08-1F0F1F18-1F1D1F28-1F2F1F38-1F3F1F48-1F4D1F591F5B1F5D1F5F1F68-1F6F1FB8-1FBB1FC8-1FCB1FD8-1FDB1FE8-1FEC1FF8-1FFB21022107210B-210D2110-211221152119-211D212421262128212A-212D2130-2133213E213F21452160-216F218324B6-24CF2C00-2C2E2C602C62-2C642C672C692C6B2C6D-2C702C722C752C7E-2C802C822C842C862C882C8A2C8C2C8E2C902C922C942C962C982C9A2C9C2C9E2CA02CA22CA42CA62CA82CAA2CAC2CAE2CB02CB22CB42CB62CB82CBA2CBC2CBE2CC02CC22CC42CC62CC82CCA2CCC2CCE2CD02CD22CD42CD62CD82CDA2CDC2CDE2CE02CE22CEB2CED2CF2A640A642A644A646A648A64AA64CA64EA650A652A654A656A658A65AA65CA65EA660A662A664A666A668A66AA66CA680A682A684A686A688A68AA68CA68EA690A692A694A696A722A724A726A728A72AA72CA72EA732A734A736A738A73AA73CA73EA740A742A744A746A748A74AA74CA74EA750A752A754A756A758A75AA75CA75EA760A762A764A766A768A76AA76CA76EA779A77BA77DA77EA780A782A784A786A78BA78DA790A792A7A0A7A2A7A4A7A6A7A8A7AAFF21-FF3A",
        Lowercase: "0061-007A00AA00B500BA00DF-00F600F8-00FF01010103010501070109010B010D010F01110113011501170119011B011D011F01210123012501270129012B012D012F01310133013501370138013A013C013E014001420144014601480149014B014D014F01510153015501570159015B015D015F01610163016501670169016B016D016F0171017301750177017A017C017E-0180018301850188018C018D019201950199-019B019E01A101A301A501A801AA01AB01AD01B001B401B601B901BA01BD-01BF01C601C901CC01CE01D001D201D401D601D801DA01DC01DD01DF01E101E301E501E701E901EB01ED01EF01F001F301F501F901FB01FD01FF02010203020502070209020B020D020F02110213021502170219021B021D021F02210223022502270229022B022D022F02310233-0239023C023F0240024202470249024B024D024F-02930295-02B802C002C102E0-02E40345037103730377037A-037D039003AC-03CE03D003D103D5-03D703D903DB03DD03DF03E103E303E503E703E903EB03ED03EF-03F303F503F803FB03FC0430-045F04610463046504670469046B046D046F04710473047504770479047B047D047F0481048B048D048F04910493049504970499049B049D049F04A104A304A504A704A904AB04AD04AF04B104B304B504B704B904BB04BD04BF04C204C404C604C804CA04CC04CE04CF04D104D304D504D704D904DB04DD04DF04E104E304E504E704E904EB04ED04EF04F104F304F504F704F904FB04FD04FF05010503050505070509050B050D050F05110513051505170519051B051D051F05210523052505270561-05871D00-1DBF1E011E031E051E071E091E0B1E0D1E0F1E111E131E151E171E191E1B1E1D1E1F1E211E231E251E271E291E2B1E2D1E2F1E311E331E351E371E391E3B1E3D1E3F1E411E431E451E471E491E4B1E4D1E4F1E511E531E551E571E591E5B1E5D1E5F1E611E631E651E671E691E6B1E6D1E6F1E711E731E751E771E791E7B1E7D1E7F1E811E831E851E871E891E8B1E8D1E8F1E911E931E95-1E9D1E9F1EA11EA31EA51EA71EA91EAB1EAD1EAF1EB11EB31EB51EB71EB91EBB1EBD1EBF1EC11EC31EC51EC71EC91ECB1ECD1ECF1ED11ED31ED51ED71ED91EDB1EDD1EDF1EE11EE31EE51EE71EE91EEB1EED1EEF1EF11EF31EF51EF71EF91EFB1EFD1EFF-1F071F10-1F151F20-1F271F30-1F371F40-1F451F50-1F571F60-1F671F70-1F7D1F80-1F871F90-1F971FA0-1FA71FB0-1FB41FB61FB71FBE1FC2-1FC41FC61FC71FD0-1FD31FD61FD71FE0-1FE71FF2-1FF41FF61FF72071207F2090-209C210A210E210F2113212F21342139213C213D2146-2149214E2170-217F218424D0-24E92C30-2C5E2C612C652C662C682C6A2C6C2C712C732C742C76-2C7D2C812C832C852C872C892C8B2C8D2C8F2C912C932C952C972C992C9B2C9D2C9F2CA12CA32CA52CA72CA92CAB2CAD2CAF2CB12CB32CB52CB72CB92CBB2CBD2CBF2CC12CC32CC52CC72CC92CCB2CCD2CCF2CD12CD32CD52CD72CD92CDB2CDD2CDF2CE12CE32CE42CEC2CEE2CF32D00-2D252D272D2DA641A643A645A647A649A64BA64DA64FA651A653A655A657A659A65BA65DA65FA661A663A665A667A669A66BA66DA681A683A685A687A689A68BA68DA68FA691A693A695A697A723A725A727A729A72BA72DA72F-A731A733A735A737A739A73BA73DA73FA741A743A745A747A749A74BA74DA74FA751A753A755A757A759A75BA75DA75FA761A763A765A767A769A76BA76DA76F-A778A77AA77CA77FA781A783A785A787A78CA78EA791A793A7A1A7A3A7A5A7A7A7A9A7F8-A7FAFB00-FB06FB13-FB17FF41-FF5A",
        White_Space: "0009-000D0020008500A01680180E2000-200A20282029202F205F3000",
        Noncharacter_Code_Point: "FDD0-FDEFFFFEFFFF",
        Default_Ignorable_Code_Point: "00AD034F115F116017B417B5180B-180D200B-200F202A-202E2060-206F3164FE00-FE0FFEFFFFA0FFF0-FFF8",
        Any: "0000-FFFF",
        Ascii: "0000-007F",
        Assigned: "0000-0377037A-037E0384-038A038C038E-03A103A3-05270531-05560559-055F0561-05870589058A058F0591-05C705D0-05EA05F0-05F40600-06040606-061B061E-070D070F-074A074D-07B107C0-07FA0800-082D0830-083E0840-085B085E08A008A2-08AC08E4-08FE0900-09770979-097F0981-09830985-098C098F09900993-09A809AA-09B009B209B6-09B909BC-09C409C709C809CB-09CE09D709DC09DD09DF-09E309E6-09FB0A01-0A030A05-0A0A0A0F0A100A13-0A280A2A-0A300A320A330A350A360A380A390A3C0A3E-0A420A470A480A4B-0A4D0A510A59-0A5C0A5E0A66-0A750A81-0A830A85-0A8D0A8F-0A910A93-0AA80AAA-0AB00AB20AB30AB5-0AB90ABC-0AC50AC7-0AC90ACB-0ACD0AD00AE0-0AE30AE6-0AF10B01-0B030B05-0B0C0B0F0B100B13-0B280B2A-0B300B320B330B35-0B390B3C-0B440B470B480B4B-0B4D0B560B570B5C0B5D0B5F-0B630B66-0B770B820B830B85-0B8A0B8E-0B900B92-0B950B990B9A0B9C0B9E0B9F0BA30BA40BA8-0BAA0BAE-0BB90BBE-0BC20BC6-0BC80BCA-0BCD0BD00BD70BE6-0BFA0C01-0C030C05-0C0C0C0E-0C100C12-0C280C2A-0C330C35-0C390C3D-0C440C46-0C480C4A-0C4D0C550C560C580C590C60-0C630C66-0C6F0C78-0C7F0C820C830C85-0C8C0C8E-0C900C92-0CA80CAA-0CB30CB5-0CB90CBC-0CC40CC6-0CC80CCA-0CCD0CD50CD60CDE0CE0-0CE30CE6-0CEF0CF10CF20D020D030D05-0D0C0D0E-0D100D12-0D3A0D3D-0D440D46-0D480D4A-0D4E0D570D60-0D630D66-0D750D79-0D7F0D820D830D85-0D960D9A-0DB10DB3-0DBB0DBD0DC0-0DC60DCA0DCF-0DD40DD60DD8-0DDF0DF2-0DF40E01-0E3A0E3F-0E5B0E810E820E840E870E880E8A0E8D0E94-0E970E99-0E9F0EA1-0EA30EA50EA70EAA0EAB0EAD-0EB90EBB-0EBD0EC0-0EC40EC60EC8-0ECD0ED0-0ED90EDC-0EDF0F00-0F470F49-0F6C0F71-0F970F99-0FBC0FBE-0FCC0FCE-0FDA1000-10C510C710CD10D0-1248124A-124D1250-12561258125A-125D1260-1288128A-128D1290-12B012B2-12B512B8-12BE12C012C2-12C512C8-12D612D8-13101312-13151318-135A135D-137C1380-139913A0-13F41400-169C16A0-16F01700-170C170E-17141720-17361740-17531760-176C176E-1770177217731780-17DD17E0-17E917F0-17F91800-180E1810-18191820-18771880-18AA18B0-18F51900-191C1920-192B1930-193B19401944-196D1970-19741980-19AB19B0-19C919D0-19DA19DE-1A1B1A1E-1A5E1A60-1A7C1A7F-1A891A90-1A991AA0-1AAD1B00-1B4B1B50-1B7C1B80-1BF31BFC-1C371C3B-1C491C4D-1C7F1CC0-1CC71CD0-1CF61D00-1DE61DFC-1F151F18-1F1D1F20-1F451F48-1F4D1F50-1F571F591F5B1F5D1F5F-1F7D1F80-1FB41FB6-1FC41FC6-1FD31FD6-1FDB1FDD-1FEF1FF2-1FF41FF6-1FFE2000-2064206A-20712074-208E2090-209C20A0-20B920D0-20F02100-21892190-23F32400-24262440-244A2460-26FF2701-2B4C2B50-2B592C00-2C2E2C30-2C5E2C60-2CF32CF9-2D252D272D2D2D30-2D672D6F2D702D7F-2D962DA0-2DA62DA8-2DAE2DB0-2DB62DB8-2DBE2DC0-2DC62DC8-2DCE2DD0-2DD62DD8-2DDE2DE0-2E3B2E80-2E992E9B-2EF32F00-2FD52FF0-2FFB3000-303F3041-30963099-30FF3105-312D3131-318E3190-31BA31C0-31E331F0-321E3220-32FE3300-4DB54DC0-9FCCA000-A48CA490-A4C6A4D0-A62BA640-A697A69F-A6F7A700-A78EA790-A793A7A0-A7AAA7F8-A82BA830-A839A840-A877A880-A8C4A8CE-A8D9A8E0-A8FBA900-A953A95F-A97CA980-A9CDA9CF-A9D9A9DEA9DFAA00-AA36AA40-AA4DAA50-AA59AA5C-AA7BAA80-AAC2AADB-AAF6AB01-AB06AB09-AB0EAB11-AB16AB20-AB26AB28-AB2EABC0-ABEDABF0-ABF9AC00-D7A3D7B0-D7C6D7CB-D7FBD800-FA6DFA70-FAD9FB00-FB06FB13-FB17FB1D-FB36FB38-FB3CFB3EFB40FB41FB43FB44FB46-FBC1FBD3-FD3FFD50-FD8FFD92-FDC7FDF0-FDFDFE00-FE19FE20-FE26FE30-FE52FE54-FE66FE68-FE6BFE70-FE74FE76-FEFCFEFFFF01-FFBEFFC2-FFC7FFCA-FFCFFFD2-FFD7FFDA-FFDCFFE0-FFE6FFE8-FFEEFFF9-FFFD"
    })
})(XRegExp);
(function(n) {
    "use strict";

    function t(n, t, i, r) {
        return {
            value: n,
            name: t,
            start: i,
            end: r
        }
    }
    n.matchRecursive = function(i, r, u, f, e) {
        f = f || "", e = e || {};
        var g = f.indexOf("g") > -1,
            nt = f.indexOf("y") > -1,
            d = f.replace(/y/g, ""),
            y = e.escapeChar,
            o = e.valueNames,
            v = [],
            b = 0,
            h = 0,
            s = 0,
            c = 0,
            p, w, l, a, k;
        if (r = n(r, d), u = n(u, d), y) {
            if (y.length > 1) throw new SyntaxError("can't use more than one escape character");
            y = n.escape(y), k = new RegExp("(?:" + y + "[\\S\\s]|(?:(?!" + n.union([r, u]).source + ")[^" + y + "])+)+", f.replace(/[^im]+/g, ""))
        }
        for (;;) {
            if (y && (s += (n.exec(i, k, s, "sticky") || [""])[0].length), l = n.exec(i, r, s), a = n.exec(i, u, s), l && a && (l.index <= a.index ? a = null : l = null), l || a) h = (l || a).index, s = h + (l || a)[0].length;
            else if (!b) break;
            if (nt && !b && h > c) break;
            if (l) b || (p = h, w = s), ++b;
            else if (a && b) {
                if (!--b && (o ? (o[0] && p > c && v.push(t(o[0], i.slice(c, p), c, p)), o[1] && v.push(t(o[1], i.slice(p, w), p, w)), o[2] && v.push(t(o[2], i.slice(w, h), w, h)), o[3] && v.push(t(o[3], i.slice(h, s), h, s))) : v.push(i.slice(w, h)), c = s, !g)) break
            } else throw new Error("string contains unbalanced delimiters");
            h === s && ++s
        }
        return g && !nt && o && o[0] && i.length > c && v.push(t(o[0], i.slice(c), c, i.length)), v
    }
})(XRegExp);
(function(n) {
    "use strict";

    function u(n) {
        var i = /^(?:\(\?:\))?\^/,
            t = /\$(?:\(\?:\))?$/;
        return t.test(n.replace(/\\[\s\S]/g, "")) ? n.replace(i, "").replace(t, "") : n
    }

    function t(t) {
        return n.isRegExp(t) ? t.xregexp && !t.xregexp.isNative ? t : n(t.source) : n(t)
    }
    var i = /(\()(?!\?)|\\([1-9]\d*)|\\[\s\S]|\[(?:[^\\\]]|\\[\s\S])*]/g,
        r = n.union([/\({{([\w$]+)}}\)|{{([\w$]+)}}/, i], "g");
    n.build = function(f, e, o) {
        var w = /^\(\?([\w$]+)\)/.exec(f),
            l = {},
            s = 0,
            v, h = 0,
            p = [0],
            y, a, c;
        w && (o = o || "", w[1].replace(/./g, function(n) {
            o += o.indexOf(n) > -1 ? "" : n
        }));
        for (c in e) e.hasOwnProperty(c) && (a = t(e[c]), l[c] = {
            pattern: u(a.source),
            names: a.xregexp.captureNames || []
        });
        return f = t(f), y = f.xregexp.captureNames || [], f = f.source.replace(r, function(n, t, r, u, f) {
            var o = t || r,
                e, c;
            if (o) {
                if (!l.hasOwnProperty(o)) throw new ReferenceError("undefined property " + n);
                return t ? (e = y[h], p[++h] = ++s, c = "(?<" + (e || o) + ">") : c = "(?:", v = s, c + l[o].pattern.replace(i, function(n, t, i) {
                    if (t) {
                        if (e = l[o].names[s - v], ++s, e) return "(?<" + e + ">"
                    } else if (i) return "\\" + (+i + v);
                    return n
                }) + ")"
            }
            if (u) {
                if (e = y[h], p[++h] = ++s, e) return "(?<" + e + ">"
            } else if (f) return "\\" + p[+f];
            return n
        }), n(f, o)
    }
})(XRegExp);
(function(n) {
    "use strict";

    function t(n, t) {
        for (var i in t) t.hasOwnProperty(i) && (n[i] = t[i])
    }
    t(n.prototype, {
        apply: function(n, t) {
            return this.test(t[0])
        },
        call: function(n, t) {
            return this.test(t)
        },
        forEach: function(t, i, r) {
            return n.forEach(t, this, i, r)
        },
        globalize: function() {
            return n.globalize(this)
        },
        xexec: function(t, i, r) {
            return n.exec(t, this, i, r)
        },
        xtest: function(t, i, r) {
            return n.test(t, this, i, r)
        }
    })
})(XRegExp)
d3.storage = {
    get: function(key, defaultValue) {
        try {
            var value = $j.cookie(key);
            if (value !== null)
                return d3.json.decode(value);
        } catch (e) {}
        return defaultValue;
    },
    set: function(key, value) {
        if (!key || key == undefined) {
            if (console) console.log("Trying to save invalid cookie! ", value);
            return;
        }
        var domain = d3.content.domain || d3.content.variant;
        return $j.cookie(key, d3.json.encode(value), {
            domain: '.' + domain,
            path: '/',
            expires: 365
        });
    },
    remove: function(key) {
        return this.set(key, null);
    }
};
var TabSheet = function(name, body, parent) {
    this.name = name;
    this.body = body;
    this.parent = parent;
    this.tabNode = jQuery('<div class="tbsHeader">' + name + '</div>');
    this.tabNode.get(0).object = this;
    this.tabNode.click(function(event) {
        parent.hideAll();
        this.object.show();
    });
    this.parent.tabs.append(this.tabNode);
    this.node = jQuery('<div class="tbsSheet">' + body + '</div>');
    this.hide();
    this.parent.node.append(this.node);
};
TabSheet.prototype = {
    display: function(value) {
        this.node.get(0).style.display = value;
    },
    hide: function() {
        this.display('none');
        this.tabNode.removeClass('tbsActive');
    },
    show: function() {
        this.display('inline-block');
        this.tabNode.addClass('tbsActive');
    }
};
var TabSheets = function(node) {
    this.node = node;
    this.tabs = jQuery('<div class="tbsTabs"></div>');
    this.node.append(this.tabs);
};
TabSheets.prototype = {
    sheets: [],
    addSheet: function(name, body) {
        this.sheets.push(new TabSheet(name, body, this));
        if (this.sheets.length == 1)
            this.sheets[0].show();
    },
    hideAll: function() {
        this.sheets.forEach(function(item) {
            item.hide();
        });
    }
};
jQuery('head').append('<style>\
.tbsTabs{float:left;}\
.tbsHeader{padding: 1ex 2ex;border: 1px grey solid;border-right-style: none;margin-bottom: 5px;margin-right: 0;cursor: pointer;width:100px}\
.tbsActive{position: relative;left: 1px;background-color: #FFFFFF;}\
.tbsSheet{background-color: #FFFFFF;border: 1px solid grey;padding: 0 1ex;position: absolute; left: 136px; top:19px; z-index:-1; width:454px;height: 272px; overflow: auto;margin: 0;}\
</style>');
var Item = function(o) {
    for (var i in o) this[i] = o[i];
};
Item.prototype = {
    offset: function() {
        return this.container.offset();
    },
    height: function() {
        return this.container.height();
    },
    getContent: function() {
        return $j(this.contentClass, this.container);
    },
    getBody: function() {
        return $j(this.bodyClass, this.container);
    },
    getContentText: function() {
        return this.getContent().text();
    },
    ratingContainer: function() {
        return $j('.vote_result', this.container);
    },
    ratingValue: function() {
        var container_temp = this.ratingContainer();
        if (container_temp.hasClass("vote_result__disabled")) {
            return null;
        } else {
            var text = container_temp.text();
            if (d3.content.variant === "habrahabr.ru") {
                text = text.replace("–", "-");
            }
            return parseInt(text, 10);
        }
    },
    getFooter: function() {
        return $j(this.footerClass, this.container);
    }
};
var Post = function(container) {
    this.container = container;
    this.container.get(0).post = this;
    this.id = parseInt(container.attr('id').substr(1), 10);
    this.info = $j('.dd', this.container);
    this.userName = $j('a[href*="/user/"]', this.info).text();
    this.userId = parseInt($j("a.c_user", this.container).attr("data-user_id"), 10);
    this.isNew = $j('a[href*="#new"]', this.info).length || $j(".b-all_new_comments_link", this.info).length;
    this.isMine = this.userName == d3.user.name;
};
Post.prototype = new Item({
    contentClass: '.dt',
    bodyClass: 'div.dt div.dti div.post_body',
    footerClass: '.dd',
    getClass: function() {
        return 'post';
    },
    _idMask: /(\d+)\/?(#.*)?$/,
    switchBody: function() {
        with(this.container.style) if (display == '') display = 'none';
            else display = '';
        return false;
    },
    commentsCount: function() {
        return parseInt(this.container.find(".b-post_comments_links a:first").text(), 10);
    }
});
d3.Post = Post;
var Comment = function(container) {
    this.container = container;
    container.get(0).comment = this;
    this.id = this.container.attr('id');
    this.isNew = this.container.hasClass('new');
    this.isMine = this.container.hasClass('mine');
    this.userId = this.container.attr('data-user_id');
    this.userName = $j('.c_user', this.container).text();
    this.parentId = this.container.attr('data-parent_comment_id');
};
Comment.prototype = new Item({
    contentClass: '.c_body',
    bodyClass: '.c_body',
    footerClass: '.c_footer',
    getAuthor: function() {
        return new User(this.userName, this.userId);
    },
    getClass: function() {
        return 'comment';
    }
});
d3.Comment = Comment;
var DelayedEventHandler = function() {
    this.timer = null;
    this.listeners = [];
    this.addListener = function(listener) {
        this.listeners.push(listener);
    };
    this.trigger = function() {
        var me = this;
        if (this.timer != null) {
            window.clearTimeout(this.timer);
        }
        this.timer = window.setTimeout(function() {
            me.notify();
            me.timer = null;
        }, 50);
    };
    this.notify = function() {
        this.listeners.forEach(function(l) {
            try {
                l();
            } catch (e) {
                if (console) console.log(e);
            }
        });
    };
};
d3.DelayedEventHandler = DelayedEventHandler;
d3.addContentModule(/(.*\.)?(d3|dirty).ru/i, {
    type: "Ядро",
    author: 'crimaniak',
    name: 'Интерфейс к содержимому dirty.ru',
    variant: 'dirty.ru',
    domain: 'd3.ru',
    posts: [],
    comments: [],
    commentListeners: [],
    postListeners: [],
    postsUpdatedHandler: new DelayedEventHandler(),
    commentsUpdatedHandler: new DelayedEventHandler(),
    itemsUpdatedHandler: new DelayedEventHandler(),
    run: function() {
        var isInbox = document.location.pathname.substr(0, 10) == "/my/inbox/";
        d3.page = {
            inbox: isInbox,
            my: ($j("#js-profile_avatar_uploader_container").length > 0),
            postComments: ($j(".b-post_article_comments").length > 0),
            inboxComments: ((document.location.pathname.indexOf("/inbox/") > 0) && (window.location.pathname.length > 15)),
            onlyNew: (document.location.href.indexOf('#new') > -1),
            user: (window.location.pathname.indexOf("/user/") >= 0) || (window.location.pathname.indexOf("/users/") >= 0),
            f_search: (window.location.pathname.indexOf("/search/") >= 0)
        };
        d3.get = {
            logoutLink: function() {
                return $j('#js-header_logout_link');
            },
            leftNavigation: function() {
                return $j('#leftNavigator');
            },
            items: function() {
                return d3.content.items();
            }
        };
        var me = this;
        this.countItems();
        d3.content = this;
        this.onCommentsUpdated(function() {
            me.itemsUpdatedHandler.trigger();
        });
        this.onPostsUpdated(function() {
            me.itemsUpdatedHandler.trigger();
        });

        function processPost($post) {
            var post = new Post($post);
            me.countPost(post);
            me.postListeners.forEach(function(listener) {
                try {
                    listener(post);
                } catch (e) {
                    if (console) console.log(e);
                }
            });
            me.postsUpdatedHandler.trigger();
        }

        function processComment($comment) {
            var comment = new Comment($comment);
            me.countComment(comment);
            me.commentListeners.forEach(function(listener) {
                try {
                    listener(comment);
                } catch (e) {
                    if (console) console.log(e);
                }
            });
        }
        $j(document).on('DOMNodeInserted', function(event) {
            var $current = $j(event.target);
            if ($current.is(".comment")) processComment($current);
            if ($current.is(".post")) processPost($current);
            var posts = $j("div.post", event.target);
            if (posts.length) {
                posts.each(function() {
                    processPost($j(this));
                });
                $j(document).trigger('d3_sp_new_posts');
            }
            $j("div.comment", event.target).each(function() {
                processComment($j(this));
            });
        });
        this.createLeftNavigator();
    },
    countItems: function() {
        this.posts = [];
        this.comments = [];
        var me = this;
        $j('.post:not(.b-related-posts_item)').each(function() {
            me.countPost(new Post($j(this)));
        });
        $j('.comment').each(function() {
            me.countComment(new Comment($j(this)));
        });
    },
    countPost: function(post) {
        this.posts.push(post);
    },
    countComment: function(comment) {
        this.comments.push(comment);
    },
    items: function() {
        return this.comments.length ? this.comments : this.posts.length ? this.posts : [];
    },
    onNewComment: function(fn) {
        this.commentListeners.push(fn);
    },
    onNewPost: function(fn) {
        this.postListeners.push(fn);
    },
    onPostsUpdated: function(fn) {
        this.postsUpdatedHandler.addListener(fn);
    },
    onCommentsUpdated: function(fn) {
        this.commentsUpdatedHandler.addListener(fn);
    },
    onItemsUpdated: function(fn) {
        this.itemsUpdatedHandler.addListener(fn);
    },
    addItemsProcessor: function(processor) {
        var items = this.items();
        for (var i = 0; i < items.length; ++i)
            processor(items[i]);
        this.onNewComment(processor);
    },
    addToHeaderDrop: function(item, after) {
        var nav = $j('#js-header_nav_user_menu');
        var list = $j('ul', nav);
        if (after !== undefined) {
            after = $j('li:contains("' + after + '")', list);
            item.insertAfter(after);
        } else
            list.append(item);
        nav.height(nav.height() + item.height());
    },
    addToHeaderNav: function(item) {
        $j('.b-header_nav').append(item);
    },
    addToLeftNav: function(item, after) {
        var nav = $j('#leftNavigator');
        var list = $j('ul', nav);
        if (after !== undefined) {
            after = $j('li:contains("' + after + '")', list);
            item.insertAfter(after);
        } else
            list.append(item);
    },
    addConfigLink: function(id, top) {
        if (top)
            this.addToHeaderNav($j('<a id="' + id + '" href="#" class="b-fui_icon_button b-fui_icon_button_settings" title="Настройки сервис-пака"><span></span><em></em></a>'));
        else
            this.addToLeftNav($j('<li><a href="#" id="' + id + '"><div style="background: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADAAAAAwCAYAAABXAvmHAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAACUZJREFUeNrsWglQlOcZ/pbdZXe5BRaEBeS+b4NyhwgJoCIeUXA8m8ZqrDG11bSTTtOZNmmaqfaKTZqKNY2mqDh4AkbBKAoeqNy3IrDcxy67C3vCbp9/szgbBIQoEWb6zbyzu/+/fP/3ft/zvs/zvgtNo9GQuTwYUql0TjtgQOb4mEkHaDAuLBhmOWMQetYJfrF9x7jXD3z+T4ZMKo0quXnzV3Q641B2ZubhCb73Yh2Y7HSVSqWrSDjgwzQ09J+LEDLEcJHJZCYmpibOsxZCelBg4sUP9hpMBevq6+0Nv33jhoGXr2887q/CNR/YAOwSoPdgVjmA4SbsF3x67tSpCLFIRDx9vOWOC5zlLu7uxNXDg32nqPh4VXmZoXhARMIiIwrhUDycGJ5NDoQUXbsaUXH/vvbDoERM62zv4PBbWohGrTZgGDJlXe0dzEGJhCYUCKJUKpUFvtY3m2KgG6yuZcWouLh3+3p62Vt3bP8bk8kkzm5uOW/t2WP5mz9+tNfH35+MjIzAQYlitkHoXkBIyFF+c8uP4pMSaavXp2+AQ8EMBoOYmpm54/5OpNVYLz9fAZvDvv3N15ckz4VshoaGnhsPANdxBXl553u7e0xMzc3JsEpFWpubCdfGhiCVEolYTO28zNF5QWxhfsHd58EDzzuNtjg4LWiqLC0lfCwciyXAO+nu7CQqlZI0NTZS8aBiszn3n3catYNRZNMCa3iG+YQsDrtMLpcHNtbVPb4oEgq1J6F9kAOv7dKFC+rvMTcL5qtbaz5Mqe9AGDCZyeZw+BGxMb/D50JY2/d4CNPZ1bV829u7qgiNpsR8WpwjFjQqpZIgHpRGxsbX59vbmwJ6kmks3AOW2tfTsyXn9BkbnqNjQMLSZL6+AwODg5KRC9nZXnXV1UfDIsLv+QcHn8H1GlglrB0mfwqRUcJtz+2ion3Xr1xhEI124dp7dDpdY2tnJwSxzUNcJKRt2WyL7x/ErUaYehxYm8FcdagI7unuTr5TVOR96/oN7SZYca0H9CFkjJysiHv11Yvl9+69XlVWZgALwy6FuXl6jLh7eTWCkIrnWVlSGGjVOVQPG9JbPBsv60FW+05+efSJzOYXGKjc8OM3ztRVVaUd+uSgceaRL3YtiooMsOPxUj19fMT4yjydatVCBBB06eC3xTQ/fMCrr6mltT56RKCrtHOlrl37WWxCPOWgZDQL2dVX1xxoa219LSA0pP/Usa88HzZ8Nww4RkbE0sqKYBcJMkiPt5/fGZv58zNwq4TKQnDgJQRq1l//8JHz6IPGiCLCtbUlSKNE0N+vvWbv4NAFvkgIj4l2Ai9srK2sTGmorTPt4POJAIFPxY3+MDE1JSvT0lpwgsr+3t7DSakrPh51wKi7s+vDo4cO/Qz4JIujomRt/FYOdVxKxfhcQzkUHRfXi0newsfLsPeOZRz+ZWlJyZRA7erh3v/TvXsD8XbHg/r63WdPZpl3tI0fcjQajQAF5KWIcHlbSysb8CTRr8StW5WenjUKIamt3fwvQhcvWpuTfZqH3ecYm5ho2XKiQe3k5dxcbmtL8/H1W7d+CcX5SgVS51QHz9GpEy/7C/Iupl88d46mVk+elKhTOV5fz6ZiCijoNzI2OTuWyJiYZFPGJwc/r6+pmRY7I1YI4ERGNdBTmRM7um332wNlJXct7hQXTy+Pstnq+KSklPjkpNyxDli08/kbgNU3r+XnB9wsvE6fyTqW0kdIHNP6Gwcnp5Hk1BV5KtVwdkBI8JGxTKzRqDUvZxz8RzCkr3DL9p/I3L29iIHBzNQ701m8lbU1SUxJkaWuWyu6/s3VZdUV5cvHY2KRwwKnPCMjozVfHf63tSX+CO9nRdeBYhKkdQ7Ym0PFQMySJX+ZSAudT1qx4gSViQR9fQRplTwtuH6IQa0F8NaSYmBoyNmVaetuTKZGbarLKw7k5+ZugHahzZbeD+S42s3TM3PTtjc3TkVO+0KIHa2uqAhFMGsl8YscHt7eGk9fn8tLEhOTx5Ed4xY0KlRTzOKr1yblgh9qYDNpw8PDLiLhAHNVeppiKvVAIxTp5oSlSx/NBvggufDB3BHjLX4iCNF1J2NfXFj4p/u37yxrfviQ/UN3sSEeFRCRuUjpq6daUppSnQVYvFgkskMabWYwmRTj8UuKb26BWEsTDQzYS6VSSnmqORy2xNTMXAB29Lyck2M+7a4Xi0UiYmLuSKVDVqgV2HK5gsVkMmSGhqwOFot1wpDN+lfKmjVDeptqqeu1inTy/jsOWMPegA56t/jaNStIWELpoUWREZ3xycnv4x6lEzpHqyC9wR4QCvd//P5v08dToZMSFJc78t4Hv0/UNYEnGnRdbeCJ8nQxytSAEbW60z8oiFKiF2EKrZzGm5/fvXXrHeh05tgZvP39SUBwUI8dz6EBFZb4CVlgyPQG+bkCZtNywNqGS2LjE6TfUtWEADFQKhWs3q5uWlV5ORkaHPy2vggKVICztkCSn6AciL50IScrPy/P1mLePJWNra2qvY1vTHXQnoj4CaQFJdBmOmO5uLlJwiIj/owT34n1clEQtaVt3uxIBWstnW6wLzI2VgCWozDvU1pyN/dYRsYTDdkXycyBoaFNi6Oj/0MlmJamR79ub+VbjfJAP3CeSRU9uuZsJM/JkUbt6mz6/QwqOciSa31+gYsLQyGXEwaTIdAnMmeJWLwbZJHc3NTkitqVrr94YF9t78AbxOuE7UA6nWFSXV7OmcopQQ63o6qbUkeNRjNgSMQi6wf1DaZHPv3Mj9pYZEhlyKKwXY8dwEPtr1z8en1hQQF37AQ+/v4lqIK2pry+pmayzhzq4pgzJ05eQMlnpnOayGWyxymTSjUKlKg8R8euytIyB72GwFT8MK64X/oyKrPliNkBpNnDy9esfvjYAQRnMYIiFuSxE0V3zKBYYoHsIEBOzly3edP+KZ5y0dKVqe9AOR5qamxkrNu08VZ25vFwqjuHHZfSDejq2qoqQzcvzwRKXU5zDEGJ5lI2kRYasePx6mC7n6FHqsZuZi1JSlSamZsvC1q48GRNReUppGeGubnF36Eoy5FyaYX5BdWz8hcanRMUrv9LGaQvd2H44tMNdbWpwyPDB89mZbXPRHDP5I98/YidD718fFux6+0z9ZBnbq+/6DHnf6mnzfV/9vj//0q86PE/AQYAWfMq2ROJ0KgAAAAASUVORK5CYII=) 4px 1px no-repeat; height:50px;border-top:1px solid #e9e9e9;border-bottom:1px solid #e9e9e9"><span style="cursor:pointer;text-decoration:underline;line-height:50px;margin-left:62px">Настройки</span></div></a></li>'));
    },
    findUser: function() {
        var user = {
            name: "",
            id: 0
        };
        if (d3.globals && d3.globals.user) {
            user = d3.globals.user;
            user.name = user.login;
        }
        return user;
    },
    createLeftNavigator: function() {
        $j('div.l-content_aside').append('<div id="leftNavigator"><ul style="list-style-type: none; padding: 0px 0px 0px 5px; font-size: 0.85em;"></ul></div>');
    }
});
d3.addContentModule(/(.*\.)?leprosorium.ru/i, {
    type: "Ядро",
    author: 'crimaniak, crea7or',
    name: 'Интерфейс к содержимому сайта leprosorium',
    variant: 'leprosorium.ru',
    posts: [],
    comments: [],
    commentListeners: [],
    postListeners: [],
    postsUpdatedHandler: new DelayedEventHandler(),
    commentsUpdatedHandler: new DelayedEventHandler(),
    itemsUpdatedHandler: new DelayedEventHandler(),
    run: function() {
        var isInbox = document.location.pathname.substr(0, 10) == "/my/inbox/";
        d3.page = {
            inbox: isInbox,
            my: document.location.pathname.substr(0, 4) == "/my/" && !isInbox,
            postComments: (window.location.pathname.indexOf("/comments/") >= 0),
            inboxComments: ((document.location.pathname.indexOf("/inbox/") > 0) && (window.location.pathname.length > 15)),
            onlyNew: (document.location.href.indexOf('#new') > -1),
            user: (window.location.pathname.indexOf("/user/") >= 0) || (window.location.pathname.indexOf("/users/") >= 0)
        };
        d3.get = {
            logoutLink: function() {
                return $j('#js-header_logout_link');
            },
            leftNavigation: function() {
                return $j('.l-content_aside');
            },
            items: function() {
                return d3.content.items();
            }
        };
        var me = this;
        this.countItems();
        d3.content = this;
        this.onCommentsUpdated(function() {
            me.itemsUpdatedHandler.trigger();
        });
        this.onPostsUpdated(function() {
            me.itemsUpdatedHandler.trigger();
        });

        function processPost($post) {
            var post = new Post($post);
            me.countPost(post);
            me.postListeners.forEach(function(listener) {
                try {
                    listener(post);
                } catch (e) {
                    if (console) console.log(e);
                }
            });
            me.postsUpdatedHandler.trigger();
        }

        function processComment($comment) {
            var comment = new Comment($comment);
            me.countComment(comment);
            me.commentListeners.forEach(function(listener) {
                try {
                    listener(comment);
                } catch (e) {
                    if (console) console.log(e);
                }
            });
        }
        $j(document).on('DOMNodeInserted', function(event) {
            var $current = $j(event.target);
            if ($current.is(".comment")) processComment($current);
            if ($current.is(".post")) processPost($current);
            $j("div.post", event.target).each(function() {
                processPost($j(this));
            });
            $j("div.comment", event.target).each(function() {
                processComment($j(this));
            });
        });
    },
    countItems: function() {
        this.posts = [];
        this.comments = [];
        var me = this;
        $j('.post').each(function() {
            me.countPost(new Post($j(this)));
        });
        $j('.comment').each(function() {
            me.countComment(new Comment($j(this)));
        });
    },
    countPost: function(post) {
        this.posts.push(post);
    },
    countComment: function(comment) {
        this.comments.push(comment);
    },
    items: function() {
        return this.comments.length ? this.comments : this.posts.length ? this.posts : [];
    },
    onNewComment: function(fn) {
        this.commentListeners.push(fn);
    },
    onNewPost: function(fn) {
        this.postListeners.push(fn);
    },
    onPostsUpdated: function(fn) {
        this.postsUpdatedHandler.addListener(fn);
    },
    onCommentsUpdated: function(fn) {
        this.commentsUpdatedHandler.addListener(fn);
    },
    onItemsUpdated: function(fn) {
        this.itemsUpdatedHandler.addListener(fn);
    },
    addItemsProcessor: function(processor) {
        var items = this.items();
        for (var i = 0; i < items.length; ++i)
            processor(items[i]);
        this.onNewComment(processor);
    },
    addToHeaderDrop: function(item, after) {
        var nav = $j('#js-header_nav_user_menu');
        var list = $j('ul', nav);
        if (after !== undefined) {
            after = $j('li:contains("' + after + '")', list);
            item.insertAfter(after);
        } else
            list.append(item);
        nav.height(nav.height() + item.height());
    },
    addToHeaderNav: function(item) {
        $j(item).insertBefore('.b-header_nav_new_post');
    },
    addToLeftNav: function(item, after) {
        $j('.l-content_aside').append(item);
    },
    addConfigLink: function(id, top) {
        if (top)
            this.addToHeaderNav($j(' | <a id="' + id + '" href="#" class="b-header_nav_link" title="Настройки сервис-пака"><i>[sp]</i></a>'));
        else
            this.addToLeftNav($j('<a href="#" id="' + id + '"><div style="margin-left: 5px; background: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADAAAAAwCAYAAABXAvmHAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAACUZJREFUeNrsWglQlOcZ/pbdZXe5BRaEBeS+b4NyhwgJoCIeUXA8m8ZqrDG11bSTTtOZNmmaqfaKTZqKNY2mqDh4AkbBKAoeqNy3IrDcxy67C3vCbp9/szgbBIQoEWb6zbyzu/+/fP/3ft/zvs/zvgtNo9GQuTwYUql0TjtgQOb4mEkHaDAuLBhmOWMQetYJfrF9x7jXD3z+T4ZMKo0quXnzV3Q641B2ZubhCb73Yh2Y7HSVSqWrSDjgwzQ09J+LEDLEcJHJZCYmpibOsxZCelBg4sUP9hpMBevq6+0Nv33jhoGXr2887q/CNR/YAOwSoPdgVjmA4SbsF3x67tSpCLFIRDx9vOWOC5zlLu7uxNXDg32nqPh4VXmZoXhARMIiIwrhUDycGJ5NDoQUXbsaUXH/vvbDoERM62zv4PBbWohGrTZgGDJlXe0dzEGJhCYUCKJUKpUFvtY3m2KgG6yuZcWouLh3+3p62Vt3bP8bk8kkzm5uOW/t2WP5mz9+tNfH35+MjIzAQYlitkHoXkBIyFF+c8uP4pMSaavXp2+AQ8EMBoOYmpm54/5OpNVYLz9fAZvDvv3N15ckz4VshoaGnhsPANdxBXl553u7e0xMzc3JsEpFWpubCdfGhiCVEolYTO28zNF5QWxhfsHd58EDzzuNtjg4LWiqLC0lfCwciyXAO+nu7CQqlZI0NTZS8aBiszn3n3catYNRZNMCa3iG+YQsDrtMLpcHNtbVPb4oEgq1J6F9kAOv7dKFC+rvMTcL5qtbaz5Mqe9AGDCZyeZw+BGxMb/D50JY2/d4CNPZ1bV829u7qgiNpsR8WpwjFjQqpZIgHpRGxsbX59vbmwJ6kmks3AOW2tfTsyXn9BkbnqNjQMLSZL6+AwODg5KRC9nZXnXV1UfDIsLv+QcHn8H1GlglrB0mfwqRUcJtz+2ion3Xr1xhEI124dp7dDpdY2tnJwSxzUNcJKRt2WyL7x/ErUaYehxYm8FcdagI7unuTr5TVOR96/oN7SZYca0H9CFkjJysiHv11Yvl9+69XlVWZgALwy6FuXl6jLh7eTWCkIrnWVlSGGjVOVQPG9JbPBsv60FW+05+efSJzOYXGKjc8OM3ztRVVaUd+uSgceaRL3YtiooMsOPxUj19fMT4yjydatVCBBB06eC3xTQ/fMCrr6mltT56RKCrtHOlrl37WWxCPOWgZDQL2dVX1xxoa219LSA0pP/Usa88HzZ8Nww4RkbE0sqKYBcJMkiPt5/fGZv58zNwq4TKQnDgJQRq1l//8JHz6IPGiCLCtbUlSKNE0N+vvWbv4NAFvkgIj4l2Ai9srK2sTGmorTPt4POJAIFPxY3+MDE1JSvT0lpwgsr+3t7DSakrPh51wKi7s+vDo4cO/Qz4JIujomRt/FYOdVxKxfhcQzkUHRfXi0newsfLsPeOZRz+ZWlJyZRA7erh3v/TvXsD8XbHg/r63WdPZpl3tI0fcjQajQAF5KWIcHlbSysb8CTRr8StW5WenjUKIamt3fwvQhcvWpuTfZqH3ecYm5ho2XKiQe3k5dxcbmtL8/H1W7d+CcX5SgVS51QHz9GpEy/7C/Iupl88d46mVk+elKhTOV5fz6ZiCijoNzI2OTuWyJiYZFPGJwc/r6+pmRY7I1YI4ERGNdBTmRM7um332wNlJXct7hQXTy+Pstnq+KSklPjkpNyxDli08/kbgNU3r+XnB9wsvE6fyTqW0kdIHNP6Gwcnp5Hk1BV5KtVwdkBI8JGxTKzRqDUvZxz8RzCkr3DL9p/I3L29iIHBzNQ701m8lbU1SUxJkaWuWyu6/s3VZdUV5cvHY2KRwwKnPCMjozVfHf63tSX+CO9nRdeBYhKkdQ7Ym0PFQMySJX+ZSAudT1qx4gSViQR9fQRplTwtuH6IQa0F8NaSYmBoyNmVaetuTKZGbarLKw7k5+ZugHahzZbeD+S42s3TM3PTtjc3TkVO+0KIHa2uqAhFMGsl8YscHt7eGk9fn8tLEhOTx5Ed4xY0KlRTzOKr1yblgh9qYDNpw8PDLiLhAHNVeppiKvVAIxTp5oSlSx/NBvggufDB3BHjLX4iCNF1J2NfXFj4p/u37yxrfviQ/UN3sSEeFRCRuUjpq6daUppSnQVYvFgkskMabWYwmRTj8UuKb26BWEsTDQzYS6VSSnmqORy2xNTMXAB29Lyck2M+7a4Xi0UiYmLuSKVDVqgV2HK5gsVkMmSGhqwOFot1wpDN+lfKmjVDeptqqeu1inTy/jsOWMPegA56t/jaNStIWELpoUWREZ3xycnv4x6lEzpHqyC9wR4QCvd//P5v08dToZMSFJc78t4Hv0/UNYEnGnRdbeCJ8nQxytSAEbW60z8oiFKiF2EKrZzGm5/fvXXrHeh05tgZvP39SUBwUI8dz6EBFZb4CVlgyPQG+bkCZtNywNqGS2LjE6TfUtWEADFQKhWs3q5uWlV5ORkaHPy2vggKVICztkCSn6AciL50IScrPy/P1mLePJWNra2qvY1vTHXQnoj4CaQFJdBmOmO5uLlJwiIj/owT34n1clEQtaVt3uxIBWstnW6wLzI2VgCWozDvU1pyN/dYRsYTDdkXycyBoaFNi6Oj/0MlmJamR79ub+VbjfJAP3CeSRU9uuZsJM/JkUbt6mz6/QwqOciSa31+gYsLQyGXEwaTIdAnMmeJWLwbZJHc3NTkitqVrr94YF9t78AbxOuE7UA6nWFSXV7OmcopQQ63o6qbUkeNRjNgSMQi6wf1DaZHPv3Mj9pYZEhlyKKwXY8dwEPtr1z8en1hQQF37AQ+/v4lqIK2pry+pmayzhzq4pgzJ05eQMlnpnOayGWyxymTSjUKlKg8R8euytIyB72GwFT8MK64X/oyKrPliNkBpNnDy9esfvjYAQRnMYIiFuSxE0V3zKBYYoHsIEBOzly3edP+KZ5y0dKVqe9AOR5qamxkrNu08VZ25vFwqjuHHZfSDejq2qoqQzcvzwRKXU5zDEGJ5lI2kRYasePx6mC7n6FHqsZuZi1JSlSamZsvC1q48GRNReUppGeGubnF36Eoy5FyaYX5BdWz8hcanRMUrv9LGaQvd2H44tMNdbWpwyPDB89mZbXPRHDP5I98/YidD718fFux6+0z9ZBnbq+/6DHnf6mnzfV/9vj//0q86PE/AQYAWfMq2ROJ0KgAAAAASUVORK5CYII=) 4px 1px no-repeat; height:50px;border-top:1px solid #e9e9e9;border-bottom:1px solid #e9e9e9"><span style="cursor:pointer;text-decoration:underline;line-height:50px;margin-left:60px">Настройки</span></div></a>'));
    },
    findUser: function() {
        var user = {
            name: "",
            id: 0
        };
        if (d3.globals && d3.globals.user) {
            user = d3.globals.user;
            user.name = user.login;
        }
        return user;
    },
});
d3.addContentModule(/(.*\.)?reddit.com/i, {
    type: "Ядро",
    author: 'bearoff',
    name: 'Интерфейс к содержимому reddit.com',
    variant: 'reddit.com',
    posts: [],
    comments: [],
    commentListeners: [],
    postListeners: [],
    postsUpdatedHandler: new DelayedEventHandler(),
    commentsUpdatedHandler: new DelayedEventHandler(),
    itemsUpdatedHandler: new DelayedEventHandler(),
    run: function() {
        RedditComment = function(container) {
            this.container = container;
            container.get(0).comment = this;
            this.id = this.container.attr('id');
            this.isMine = this.container.find('.edit-usertext').length > 0;
            this.userName = $j('.author', this.container).text();
            this.parentId = this.container.find(".flat-list.buttons .bylink:contains('parent')").attr('href');
        };
        RedditComment.prototype = new Item({
            contentClass: '.usertext-body .md',
            bodyClass: '.usertext-body',
            footerClass: '.tagline',
            getClass: function() {
                return 'comment';
            },
            ratingContainer: function() {
                return $j('.score.likes', this.container);
            }
        });
        d3.Comment = RedditComment;
        var isInbox = false;
        d3.page = {
            inbox: isInbox,
            my: false,
            postComments: ($j("form.usertext").length > 0),
            inboxComments: false,
            onlyNew: false,
            user: false
        };
        d3.get = {
            logoutLink: function() {
                return $j();
            },
            leftNavigation: function() {
                return $j();
            },
            items: function() {
                return d3.content.items();
            }
        };
        var me = this;
        this.countItems();
        d3.content = this;

        function processComment($comment) {
            var comment = new d3.Comment($comment);
            me.countComment(comment);
            me.commentListeners.forEach(function(listener) {
                try {
                    listener(comment);
                } catch (e) {
                    if (console) console.log(e);
                }
            });
        }
        $j(document).on('DOMNodeInserted', function(event) {
            var $current = $j(event.target);
            if ($current.is(".comment")) processComment($current);
            $j("div.comment", event.target).each(function() {
                processComment($j(this));
            });
        });
        this.createLeftNavigator();
    },
    countItems: function() {
        this.posts = [];
        this.comments = [];
        var me = this;
        $j('.comment').each(function() {
            me.countComment(new d3.Comment($j(this)));
        });
    },
    countPost: function(post) {
        this.posts.push(post);
    },
    countComment: function(comment) {
        this.comments.push(comment);
    },
    items: function() {
        return this.comments.length ? this.comments : this.posts.length ? this.posts : [];
    },
    onNewComment: function(fn) {
        this.commentListeners.push(fn);
    },
    onNewPost: function(fn) {
        this.postListeners.push(fn);
    },
    onPostsUpdated: function(fn) {
        this.postsUpdatedHandler.addListener(fn);
    },
    onCommentsUpdated: function(fn) {
        this.commentsUpdatedHandler.addListener(fn);
    },
    onItemsUpdated: function(fn) {
        this.itemsUpdatedHandler.addListener(fn);
    },
    addItemsProcessor: function(processor) {
        var items = this.items();
        for (var i = 0; i < items.length; ++i)
            processor(items[i]);
        this.onNewComment(processor);
    },
    addToHeaderDrop: function(item, after) {
        var nav = $j('#js-header_nav_user_menu');
        var list = $j('ul', nav);
        if (after !== undefined) {
            after = $j('li:contains("' + after + '")', list);
            item.insertAfter(after);
        } else
            list.append(item);
        nav.height(nav.height() + item.height());
    },
    addToHeaderNav: function(item) {
        var li = $j("<li>");
        li.append(item);
        $j('ul.tabmenu').append(li);
    },
    addToLeftNav: function(item, after) {
        var nav = $j('#leftNavigator');
        var list = $j('ul', nav);
        if (after !== undefined) {
            after = $j('li:contains("' + after + '")', list);
            item.insertAfter(after);
        } else
            list.append(item);
    },
    addConfigLink: function(id, top) {
        if (top)
            this.addToHeaderNav($j('<a id="' + id + '" href="#" title="Настройки сервис-пака">SP</a>'));
        else
            this.addToLeftNav($j('<li><a href="#" id="' + id + '"><div style="background: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADAAAAAwCAYAAABXAvmHAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAACUZJREFUeNrsWglQlOcZ/pbdZXe5BRaEBeS+b4NyhwgJoCIeUXA8m8ZqrDG11bSTTtOZNmmaqfaKTZqKNY2mqDh4AkbBKAoeqNy3IrDcxy67C3vCbp9/szgbBIQoEWb6zbyzu/+/fP/3ft/zvs/zvgtNo9GQuTwYUql0TjtgQOb4mEkHaDAuLBhmOWMQetYJfrF9x7jXD3z+T4ZMKo0quXnzV3Q641B2ZubhCb73Yh2Y7HSVSqWrSDjgwzQ09J+LEDLEcJHJZCYmpibOsxZCelBg4sUP9hpMBevq6+0Nv33jhoGXr2887q/CNR/YAOwSoPdgVjmA4SbsF3x67tSpCLFIRDx9vOWOC5zlLu7uxNXDg32nqPh4VXmZoXhARMIiIwrhUDycGJ5NDoQUXbsaUXH/vvbDoERM62zv4PBbWohGrTZgGDJlXe0dzEGJhCYUCKJUKpUFvtY3m2KgG6yuZcWouLh3+3p62Vt3bP8bk8kkzm5uOW/t2WP5mz9+tNfH35+MjIzAQYlitkHoXkBIyFF+c8uP4pMSaavXp2+AQ8EMBoOYmpm54/5OpNVYLz9fAZvDvv3N15ckz4VshoaGnhsPANdxBXl553u7e0xMzc3JsEpFWpubCdfGhiCVEolYTO28zNF5QWxhfsHd58EDzzuNtjg4LWiqLC0lfCwciyXAO+nu7CQqlZI0NTZS8aBiszn3n3catYNRZNMCa3iG+YQsDrtMLpcHNtbVPb4oEgq1J6F9kAOv7dKFC+rvMTcL5qtbaz5Mqe9AGDCZyeZw+BGxMb/D50JY2/d4CNPZ1bV829u7qgiNpsR8WpwjFjQqpZIgHpRGxsbX59vbmwJ6kmks3AOW2tfTsyXn9BkbnqNjQMLSZL6+AwODg5KRC9nZXnXV1UfDIsLv+QcHn8H1GlglrB0mfwqRUcJtz+2ion3Xr1xhEI124dp7dDpdY2tnJwSxzUNcJKRt2WyL7x/ErUaYehxYm8FcdagI7unuTr5TVOR96/oN7SZYca0H9CFkjJysiHv11Yvl9+69XlVWZgALwy6FuXl6jLh7eTWCkIrnWVlSGGjVOVQPG9JbPBsv60FW+05+efSJzOYXGKjc8OM3ztRVVaUd+uSgceaRL3YtiooMsOPxUj19fMT4yjydatVCBBB06eC3xTQ/fMCrr6mltT56RKCrtHOlrl37WWxCPOWgZDQL2dVX1xxoa219LSA0pP/Usa88HzZ8Nww4RkbE0sqKYBcJMkiPt5/fGZv58zNwq4TKQnDgJQRq1l//8JHz6IPGiCLCtbUlSKNE0N+vvWbv4NAFvkgIj4l2Ai9srK2sTGmorTPt4POJAIFPxY3+MDE1JSvT0lpwgsr+3t7DSakrPh51wKi7s+vDo4cO/Qz4JIujomRt/FYOdVxKxfhcQzkUHRfXi0newsfLsPeOZRz+ZWlJyZRA7erh3v/TvXsD8XbHg/r63WdPZpl3tI0fcjQajQAF5KWIcHlbSysb8CTRr8StW5WenjUKIamt3fwvQhcvWpuTfZqH3ecYm5ho2XKiQe3k5dxcbmtL8/H1W7d+CcX5SgVS51QHz9GpEy/7C/Iupl88d46mVk+elKhTOV5fz6ZiCijoNzI2OTuWyJiYZFPGJwc/r6+pmRY7I1YI4ERGNdBTmRM7um332wNlJXct7hQXTy+Pstnq+KSklPjkpNyxDli08/kbgNU3r+XnB9wsvE6fyTqW0kdIHNP6Gwcnp5Hk1BV5KtVwdkBI8JGxTKzRqDUvZxz8RzCkr3DL9p/I3L29iIHBzNQ701m8lbU1SUxJkaWuWyu6/s3VZdUV5cvHY2KRwwKnPCMjozVfHf63tSX+CO9nRdeBYhKkdQ7Ym0PFQMySJX+ZSAudT1qx4gSViQR9fQRplTwtuH6IQa0F8NaSYmBoyNmVaetuTKZGbarLKw7k5+ZugHahzZbeD+S42s3TM3PTtjc3TkVO+0KIHa2uqAhFMGsl8YscHt7eGk9fn8tLEhOTx5Ed4xY0KlRTzOKr1yblgh9qYDNpw8PDLiLhAHNVeppiKvVAIxTp5oSlSx/NBvggufDB3BHjLX4iCNF1J2NfXFj4p/u37yxrfviQ/UN3sSEeFRCRuUjpq6daUppSnQVYvFgkskMabWYwmRTj8UuKb26BWEsTDQzYS6VSSnmqORy2xNTMXAB29Lyck2M+7a4Xi0UiYmLuSKVDVqgV2HK5gsVkMmSGhqwOFot1wpDN+lfKmjVDeptqqeu1inTy/jsOWMPegA56t/jaNStIWELpoUWREZ3xycnv4x6lEzpHqyC9wR4QCvd//P5v08dToZMSFJc78t4Hv0/UNYEnGnRdbeCJ8nQxytSAEbW60z8oiFKiF2EKrZzGm5/fvXXrHeh05tgZvP39SUBwUI8dz6EBFZb4CVlgyPQG+bkCZtNywNqGS2LjE6TfUtWEADFQKhWs3q5uWlV5ORkaHPy2vggKVICztkCSn6AciL50IScrPy/P1mLePJWNra2qvY1vTHXQnoj4CaQFJdBmOmO5uLlJwiIj/owT34n1clEQtaVt3uxIBWstnW6wLzI2VgCWozDvU1pyN/dYRsYTDdkXycyBoaFNi6Oj/0MlmJamR79ub+VbjfJAP3CeSRU9uuZsJM/JkUbt6mz6/QwqOciSa31+gYsLQyGXEwaTIdAnMmeJWLwbZJHc3NTkitqVrr94YF9t78AbxOuE7UA6nWFSXV7OmcopQQ63o6qbUkeNRjNgSMQi6wf1DaZHPv3Mj9pYZEhlyKKwXY8dwEPtr1z8en1hQQF37AQ+/v4lqIK2pry+pmayzhzq4pgzJ05eQMlnpnOayGWyxymTSjUKlKg8R8euytIyB72GwFT8MK64X/oyKrPliNkBpNnDy9esfvjYAQRnMYIiFuSxE0V3zKBYYoHsIEBOzly3edP+KZ5y0dKVqe9AOR5qamxkrNu08VZ25vFwqjuHHZfSDejq2qoqQzcvzwRKXU5zDEGJ5lI2kRYasePx6mC7n6FHqsZuZi1JSlSamZsvC1q48GRNReUppGeGubnF36Eoy5FyaYX5BdWz8hcanRMUrv9LGaQvd2H44tMNdbWpwyPDB89mZbXPRHDP5I98/YidD718fFux6+0z9ZBnbq+/6DHnf6mnzfV/9vj//0q86PE/AQYAWfMq2ROJ0KgAAAAASUVORK5CYII=) 4px 1px no-repeat; height:50px;border-top:1px solid #e9e9e9;border-bottom:1px solid #e9e9e9"><span style="cursor:pointer;text-decoration:underline;line-height:50px;margin-left:62px">Настройки</span></div></a></li>'));
    },
    findUser: function() {
        return {
            name: "",
            id: 0
        };
    },
    createLeftNavigator: function() {
        $j('ul.tabmenu').append('<li id="leftNavigator"><ul style="list-style-type: none; padding: 0px 0px 0px 5px; font-size: 0.85em;"></ul></li>');
    }
});
d3.addContentModule(/(.*\.)?(habrahabr|geektimes).ru/i, {
    type: "Ядро",
    author: 'bearoff',
    name: 'Интерфейс к содержимому habrahabr.ru',
    variant: 'habrahabr.ru',
    posts: [],
    comments: [],
    commentListeners: [],
    postListeners: [],
    postsUpdatedHandler: new DelayedEventHandler(),
    commentsUpdatedHandler: new DelayedEventHandler(),
    itemsUpdatedHandler: new DelayedEventHandler(),
    run: function() {
        HabrComment = function(container) {
            this.container = container;
            container.get(0).comment = this;
            this.id = this.container.parent(".comment_item").attr('id');
            this.isMine = this.container.find('.is_author').length > 0;
            this.userName = $j('.comment-item__username', this.container).text();
            var parent_link = this.container.find(".icon_comment-parent");
            this.parentId = parent_link.length ? "comment_" + parent_link.data('parent_id') : "";
        };
        HabrComment.prototype = new Item({
            contentClass: '.message',
            bodyClass: '.usertext-body',
            footerClass: '.info',
            getClass: function() {
                return 'comment_body';
            },
            ratingContainer: function() {
                return $j('.js-score', this.container);
            }
        });
        d3.Comment = HabrComment;
        var isInbox = false;
        d3.page = {
            inbox: isInbox,
            my: false,
            postComments: ($j(".comments_form").length > 0),
            inboxComments: false,
            onlyNew: false,
            user: false
        };
        d3.get = {
            logoutLink: function() {
                return $j();
            },
            leftNavigation: function() {
                return $j();
            },
            items: function() {
                return d3.content.items();
            }
        };
        var me = this;
        this.countItems();
        d3.content = this;

        function processComment($comment) {
            var comment = new d3.Comment($comment);
            me.countComment(comment);
            me.commentListeners.forEach(function(listener) {
                try {
                    listener(comment);
                } catch (e) {
                    if (console) console.log(e);
                }
            });
        }
    },
    countItems: function() {
        this.posts = [];
        this.comments = [];
        var me = this;
        $j('.comment_body').each(function() {
            me.countComment(new d3.Comment($j(this)));
        });
    },
    countPost: function(post) {
        this.posts.push(post);
    },
    countComment: function(comment) {
        this.comments.push(comment);
    },
    items: function() {
        return this.comments.length ? this.comments : this.posts.length ? this.posts : [];
    },
    onNewComment: function(fn) {
        this.commentListeners.push(fn);
    },
    onNewPost: function(fn) {
        this.postListeners.push(fn);
    },
    onPostsUpdated: function(fn) {
        this.postsUpdatedHandler.addListener(fn);
    },
    onCommentsUpdated: function(fn) {
        this.commentsUpdatedHandler.addListener(fn);
    },
    onItemsUpdated: function(fn) {
        this.itemsUpdatedHandler.addListener(fn);
    },
    addItemsProcessor: function(processor) {
        var items = this.items();
        for (var i = 0; i < items.length; ++i)
            processor(items[i]);
        this.onNewComment(processor);
    },
    addToHeaderDrop: function(item) {
        this.addToHeaderNav(item);
    },
    addToHeaderNav: function(item) {
        var list = $j('#navbar-links');
        list.append(item);
    },
    addToLeftNav: function(item, after) {
        this.addToHeaderNav(item);
    },
    addConfigLink: function(id, top) {
        if (top)
            this.addToHeaderNav($j('<a id="' + id + '" href="#" title="Настройки сервис-пака">SP</a>'));
        else
            this.addToLeftNav($j('<li><a href="#" id="' + id + '"><div style="background: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADAAAAAwCAYAAABXAvmHAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAACUZJREFUeNrsWglQlOcZ/pbdZXe5BRaEBeS+b4NyhwgJoCIeUXA8m8ZqrDG11bSTTtOZNmmaqfaKTZqKNY2mqDh4AkbBKAoeqNy3IrDcxy67C3vCbp9/szgbBIQoEWb6zbyzu/+/fP/3ft/zvs/zvgtNo9GQuTwYUql0TjtgQOb4mEkHaDAuLBhmOWMQetYJfrF9x7jXD3z+T4ZMKo0quXnzV3Q641B2ZubhCb73Yh2Y7HSVSqWrSDjgwzQ09J+LEDLEcJHJZCYmpibOsxZCelBg4sUP9hpMBevq6+0Nv33jhoGXr2887q/CNR/YAOwSoPdgVjmA4SbsF3x67tSpCLFIRDx9vOWOC5zlLu7uxNXDg32nqPh4VXmZoXhARMIiIwrhUDycGJ5NDoQUXbsaUXH/vvbDoERM62zv4PBbWohGrTZgGDJlXe0dzEGJhCYUCKJUKpUFvtY3m2KgG6yuZcWouLh3+3p62Vt3bP8bk8kkzm5uOW/t2WP5mz9+tNfH35+MjIzAQYlitkHoXkBIyFF+c8uP4pMSaavXp2+AQ8EMBoOYmpm54/5OpNVYLz9fAZvDvv3N15ckz4VshoaGnhsPANdxBXl553u7e0xMzc3JsEpFWpubCdfGhiCVEolYTO28zNF5QWxhfsHd58EDzzuNtjg4LWiqLC0lfCwciyXAO+nu7CQqlZI0NTZS8aBiszn3n3catYNRZNMCa3iG+YQsDrtMLpcHNtbVPb4oEgq1J6F9kAOv7dKFC+rvMTcL5qtbaz5Mqe9AGDCZyeZw+BGxMb/D50JY2/d4CNPZ1bV829u7qgiNpsR8WpwjFjQqpZIgHpRGxsbX59vbmwJ6kmks3AOW2tfTsyXn9BkbnqNjQMLSZL6+AwODg5KRC9nZXnXV1UfDIsLv+QcHn8H1GlglrB0mfwqRUcJtz+2ion3Xr1xhEI124dp7dDpdY2tnJwSxzUNcJKRt2WyL7x/ErUaYehxYm8FcdagI7unuTr5TVOR96/oN7SZYca0H9CFkjJysiHv11Yvl9+69XlVWZgALwy6FuXl6jLh7eTWCkIrnWVlSGGjVOVQPG9JbPBsv60FW+05+efSJzOYXGKjc8OM3ztRVVaUd+uSgceaRL3YtiooMsOPxUj19fMT4yjydatVCBBB06eC3xTQ/fMCrr6mltT56RKCrtHOlrl37WWxCPOWgZDQL2dVX1xxoa219LSA0pP/Usa88HzZ8Nww4RkbE0sqKYBcJMkiPt5/fGZv58zNwq4TKQnDgJQRq1l//8JHz6IPGiCLCtbUlSKNE0N+vvWbv4NAFvkgIj4l2Ai9srK2sTGmorTPt4POJAIFPxY3+MDE1JSvT0lpwgsr+3t7DSakrPh51wKi7s+vDo4cO/Qz4JIujomRt/FYOdVxKxfhcQzkUHRfXi0newsfLsPeOZRz+ZWlJyZRA7erh3v/TvXsD8XbHg/r63WdPZpl3tI0fcjQajQAF5KWIcHlbSysb8CTRr8StW5WenjUKIamt3fwvQhcvWpuTfZqH3ecYm5ho2XKiQe3k5dxcbmtL8/H1W7d+CcX5SgVS51QHz9GpEy/7C/Iupl88d46mVk+elKhTOV5fz6ZiCijoNzI2OTuWyJiYZFPGJwc/r6+pmRY7I1YI4ERGNdBTmRM7um332wNlJXct7hQXTy+Pstnq+KSklPjkpNyxDli08/kbgNU3r+XnB9wsvE6fyTqW0kdIHNP6Gwcnp5Hk1BV5KtVwdkBI8JGxTKzRqDUvZxz8RzCkr3DL9p/I3L29iIHBzNQ701m8lbU1SUxJkaWuWyu6/s3VZdUV5cvHY2KRwwKnPCMjozVfHf63tSX+CO9nRdeBYhKkdQ7Ym0PFQMySJX+ZSAudT1qx4gSViQR9fQRplTwtuH6IQa0F8NaSYmBoyNmVaetuTKZGbarLKw7k5+ZugHahzZbeD+S42s3TM3PTtjc3TkVO+0KIHa2uqAhFMGsl8YscHt7eGk9fn8tLEhOTx5Ed4xY0KlRTzOKr1yblgh9qYDNpw8PDLiLhAHNVeppiKvVAIxTp5oSlSx/NBvggufDB3BHjLX4iCNF1J2NfXFj4p/u37yxrfviQ/UN3sSEeFRCRuUjpq6daUppSnQVYvFgkskMabWYwmRTj8UuKb26BWEsTDQzYS6VSSnmqORy2xNTMXAB29Lyck2M+7a4Xi0UiYmLuSKVDVqgV2HK5gsVkMmSGhqwOFot1wpDN+lfKmjVDeptqqeu1inTy/jsOWMPegA56t/jaNStIWELpoUWREZ3xycnv4x6lEzpHqyC9wR4QCvd//P5v08dToZMSFJc78t4Hv0/UNYEnGnRdbeCJ8nQxytSAEbW60z8oiFKiF2EKrZzGm5/fvXXrHeh05tgZvP39SUBwUI8dz6EBFZb4CVlgyPQG+bkCZtNywNqGS2LjE6TfUtWEADFQKhWs3q5uWlV5ORkaHPy2vggKVICztkCSn6AciL50IScrPy/P1mLePJWNra2qvY1vTHXQnoj4CaQFJdBmOmO5uLlJwiIj/owT34n1clEQtaVt3uxIBWstnW6wLzI2VgCWozDvU1pyN/dYRsYTDdkXycyBoaFNi6Oj/0MlmJamR79ub+VbjfJAP3CeSRU9uuZsJM/JkUbt6mz6/QwqOciSa31+gYsLQyGXEwaTIdAnMmeJWLwbZJHc3NTkitqVrr94YF9t78AbxOuE7UA6nWFSXV7OmcopQQ63o6qbUkeNRjNgSMQi6wf1DaZHPv3Mj9pYZEhlyKKwXY8dwEPtr1z8en1hQQF37AQ+/v4lqIK2pry+pmayzhzq4pgzJ05eQMlnpnOayGWyxymTSjUKlKg8R8euytIyB72GwFT8MK64X/oyKrPliNkBpNnDy9esfvjYAQRnMYIiFuSxE0V3zKBYYoHsIEBOzly3edP+KZ5y0dKVqe9AOR5qamxkrNu08VZ25vFwqjuHHZfSDejq2qoqQzcvzwRKXU5zDEGJ5lI2kRYasePx6mC7n6FHqsZuZi1JSlSamZsvC1q48GRNReUppGeGubnF36Eoy5FyaYX5BdWz8hcanRMUrv9LGaQvd2H44tMNdbWpwyPDB89mZbXPRHDP5I98/YidD718fFux6+0z9ZBnbq+/6DHnf6mnzfV/9vj//0q86PE/AQYAWfMq2ROJ0KgAAAAASUVORK5CYII=) 4px 1px no-repeat; height:50px;border-top:1px solid #e9e9e9;border-bottom:1px solid #e9e9e9"><span style="cursor:pointer;text-decoration:underline;line-height:50px;margin-left:62px">Настройки</span></div></a></li>'));
    },
    findUser: function() {
        return {
            name: "",
            id: 0
        };
    },
    createLeftNavigator: function() {
        $j('ul.tabmenu').append('<li id="leftNavigator"><ul style="list-style-type: none; padding: 0px 0px 0px 5px; font-size: 0.85em;"></ul></li>');
    }
});
d3.initCore();
try {
    (function() {
        var processor;
        d3.addModule({
            type: "Стилизация",
            name: 'Х-фаг',
            author: 'crimaniak',
            variant: ['dirty.ru'],
            config: {
                active: {
                    type: 'checkbox',
                    value: 0,
                    description: 'Ищет и уничтожает подозрительные теги и атрибуты в текстах постов и комментариев по заданным маскам'
                },
                masks: {
                    type: 'text',
                    value: './/*[@class="b-bg_animation" or @style]',
                    caption: 'Маски',
                    'description': 'Набор XPath масок, по которым будут выявлены подозрительние ноды. В качестве корневого узла указывается контейнер поста или комментария, поэтому используйте ось descendant::, чтобы проверять только тело элемента. Например, .//b для выявления всех тегов <b> внутри постов. Чтобы задать несколько масок, разделяйте их оператором " || " (пробелы слева и справа обязательны).'
                },
                action: {
                    type: 'select',
                    value: 'show',
                    options: {
                        'Показать': 'show',
                        'Удалить': 'del'
                    },
                    caption: 'Что делать',
                    description: 'После нахождения подозрительного тега можно его подсветить, убрав исходный стиль, или вообще удалить. Последняя опция на случай, если удаление атрибутов по какой-то причине не помогает.'
                },
                newStyle: {
                    type: 'text',
                    value: 'border: 1px red dashed',
                    caption: 'Поставить стиль',
                    description: 'К найденным фрагментам будет применен этот стиль'
                },
                toDelete: {
                    type: 'text',
                    value: 'style class basefont font bgcolor border width height hspace vspace background nowrap',
                    caption: 'Атрибуты к удалению',
                    description: 'Какие именно атрибуты удалять у найденных по маскам фрагментов'
                }
            },
            masks: [],
            run: function() {
                this.masks = this.config.masks.value.split(/\s+\|\|\s+/);
                var newStyle = this.config.newStyle.value;
                var attrToDel = this.config.toDelete.value.split(/\s+/);
                processor = this.config.action.value == 'show' ? function(item, mask) {
                    var title = 'Найдено по маске: ' + mask;
                    $j.each(attrToDel, function(index, attr) {
                        if (item.hasAttribute(attr)) {
                            title += '\n\n' + attr + ': ' + item.getAttribute(attr);
                            item.removeAttribute(attr);
                        }
                    });
                    item.setAttribute('title', title);
                    item.setAttribute('style', newStyle);
                } : function(item, mask) {
                    item.parentNode.removeChild(item);
                };
            },
            onPost: function(post) {
                this.processItem(post);
            },
            onComment: function(comment) {
                this.processItem(comment);
            },
            processItem: function(item) {
                var container = item.getBody().get(0);
                if (container !== undefined) $j.each(this.masks, function(index, mask) {
                    d3.xpath.each(mask, function(item, i) {
                        if (!item.hasAttribute('data-x-phage')) {
                            processor(item, mask);
                            item.setAttribute('data-x-phage', '1');
                        }
                    }, container);
                });
            }
        });
    })();
    d3.addModule({
        type: "Социализм",
        name: 'Игноратор',
        author: 'crimaniak,Stasik0',
        variant: ['dirty.ru'],
        config: {
            active: {
                type: 'checkbox',
                value: 0,
                description: 'Рядом с постами появляется кнопка [скрыть]. Нажав на нее, Вы можете скрыть пост совсем или минимизировать до полоски статуса.'
            },
            ignored: {
                type: 'hidden',
                value: {}
            },
            confirmation: {
                type: 'checkbox',
                value: 1,
                caption: 'спрашивать подтверждение при сокрытии'
            },
            hideAtAll: {
                type: 'checkbox',
                value: 1,
                caption: 'скрывать посты совсем'
            }
        },
        run: function() {
            if (Math.random() < 0.05) {
                var rubicon = Number(new Date()) - 5184000000;
                for (var i in this.config.ignored.value)
                    if (this.config.ignored.value[i] < rubicon)
                        delete this.config.ignored.value[i];
            }
        },
        onPost: function(post) {
            if (d3.content.comments.length == 0 && !d3.page.user) {
                var footer = post.getFooter();
                var me = this;
                var id = '' + post.id;
                if (this.config.ignored.value[id] != undefined)
                    (this.config.hideAtAll.value ? post.container : $j('div.dt', post.container)).hide();
                footer.append('&nbsp; <a class="ignorator" href="#" style="font-weight: bold" title="Скрыть или показать этот пост">[скрыть]</a>');
                $j('.ignorator', footer).click(function() {
                    return me.processClick(post);
                });
            }
        },
        processClick: function(post) {
            var content = $j('div.dt', post.container);
            var id = '' + post.id;
            with(this.config.ignored) {
                if (value[id] != undefined) {
                    value[id] = undefined;
                    content.show();
                } else {
                    if (this.config.confirmation.value && !confirm('Действительно спрятать этот пост?'))
                        return false;
                    value[id] = Number(new Date());
                    content.hide();
                }
                _control.update();
            }
            d3.config.save();
            return false;
        }
    });
    d3.addModule({
        type: "Навигация",
        name: 'Навигация по новым',
        author: 'crimaniak, Stasik0',
        config: {
            active: {
                type: 'checkbox',
                value: 1,
                description: 'С правой стороны страницы появляется дополнительный навигатор, пользуясь которым, Вы можете перемещаться только по новым комментарим, либо только по своим, а также отмотать страницу вверх.'
            },
            smoothScroll: {
                type: 'checkbox',
                value: 1,
                caption: 'Плавная прокрутка'
            },
            transparency: {
                type: 'text',
                value: '0',
                caption: 'Прозрачность: ',
                description: 'Может быть полезна на маленьких разрешениях, когда текст может оказаться под навигатором. В процентах, 0 - 50'
            }
        },
        newItems: [],
        mineItems: [],
        nextMine: null,
        nextNew: null,
        prevNew: null,
        currentItem: null,
        scrolling: false,
        scrollDestination: 0,
        onlyNew: false,
        run: function() {
            this.drawButtons();
            var me = this;
            $j(window).scroll(function(event) {
                me.onScroll();
            });
            $j('#home').mousedown(function(e) {
                e.preventDefault();
                me.scrollToPosition(0);
            });
            $j('#down').mousedown(function(e) {
                e.preventDefault();
                me.scrollToItem(me.nextNew);
            });
            $j('#up').mousedown(function(e) {
                e.preventDefault();
                me.scrollToItem(me.prevNew);
            });
            $j('#mine').mousedown(function(e) {
                e.preventDefault();
                me.scrollToItem(me.nextMine);
            });
            var oldSwitch = d3.window.commentsHandler.switchNew;
            d3.window.commentsHandler.switchNew = function() {
                oldSwitch.apply(d3.window.commentsHandler);
                me.onlyNewTest();
                me.processNewPosition();
            };
        },
        onlyNewTest: function() {
            this.onlyNew = $j('#js-comments.new_only').length > 0;
        },
        onItemsUpdated: function() {
            this.newPosition();
        },
        onPost: function(post) {},
        onComment: function(comment) {},
        scrollToPosition: function(position) {
            if (this.config.smoothScroll.value) {
                this.smoothScroll(position);
            } else {
                $j(window).scrollTop(position);
                this.resetScrolling();
            }
        },
        resetScrolling: function() {
            this.scrolling = false;
        },
        smoothScroll: function(destination) {
            this.scrollDestination = destination;
            this.scrolling = true;
            this.scrollDaemon();
        },
        scrollDaemon: function(lastPosition) {
            lastPosition = typeof lastPosition !== 'undefined' ? lastPosition : -1;
            var destination = this.scrollDestination;
            if (this.scrolling == false) {
                scrolling = false;
                this.newPosition();
                return;
            }
            current = $j(window).scrollTop();
            distance = destination - current;
            if (current == lastPosition || Math.abs(distance) < 5 || Math.round(current + (distance / 3)) < 0) {
                $j(window).scrollTop(destination);
                this.resetScrolling();
                this.newPosition();
                return;
            }
            $j(window).scrollTop(Math.round(current + (distance / 3)));
            var me = this;
            window.setTimeout(function() {
                me.scrollDaemon(current);
            }, 30);
        },
        countItem: function(item) {
            var hidden = undefined;
            var changes = false;
            if (item.isNew) {
                if (hidden = item.container.is(":hidden")) {
                    return false;
                }
                this.newItems.push(item);
                changes = true;
            }
            if (item.isMine) {
                if (hidden == undefined && item.container.is(":hidden")) {
                    return false;
                }
                this.mineItems.push(item);
                changes = true;
            }
            return changes;
        },
        scrollToItem: function(itemNum) {
            if (itemNum == null) return false;
            item = d3.content.items()[itemNum];
            var highlightColor = "#fff48d";
            var colorToHex = function(color) {
                if (color.substr(0, 1) === '#') {
                    return color;
                }
                if (color.substr(0, 3) !== "rgb") {
                    return "unknown";
                }
                if (color.substr(0, 4) === "rgba") {
                    var digits = /(.*?)rgba\((\d+), (\d+), (\d+), (\d+)\)/.exec(color);
                    var red = parseInt(digits[2]);
                    var green = parseInt(digits[3]);
                    var blue = parseInt(digits[4]);
                    var alpha = parseInt(digits[5]);
                    return '#' + (256 + red).toString(16).substr(1) + ((1 << 24) + (green << 16) | (blue << 8) | alpha).toString(16).substr(1);
                } else if (color.substr(0, 3) === "rgb") {
                    var digits = /(.*?)rgb\((\d+), (\d+), (\d+)\)/.exec(color);
                    var red = parseInt(digits[2]);
                    var green = parseInt(digits[3]);
                    var blue = parseInt(digits[4]);
                    var rgb = blue | (green << 8) | (red << 16);
                    return digits[1] + '#' + rgb.toString(16);
                }
                return "unknown";
            };
            this.scrolling = true;
            this.scrollToPosition(Math.floor(item.offset().top + (item.height() - $j(window).height()) / 2));
            this.currentItem = item;
            this.newPosition();
            var content = item.container;
            var inner;
            if (d3.content.variant == "dirty.ru") {
                inner = $j(".comment_inner", content);
            } else {
                inner = $j(".c_i", content);
            }
            if (inner != null && inner.length > 0) {
                content = inner;
            }
            var oldColor = content.css('background-color');
            if (colorToHex(oldColor) != highlightColor) {
                window.setTimeout(function() {
                    content.css('background-color', oldColor);
                }, 650);
                content.css('background-color', highlightColor);
            }
        },
        getCurrentOffset: function() {
            return this.currentItem ? this.currentItem.offset().top + this.currentItem.height() / 2 : $j(window).scrollTop() + $j(window).height() / 2;
        },
        onScroll: function() {
            if (!this.scrolling) {
                this.currentItem = null;
                this.newPosition();
            }
        },
        calculateStatus: function() {
            var currentOffset = this.getCurrentOffset();
            var status = {
                prev: 0,
                next: 0,
                mine: 0,
                prevNew: null,
                nextNew: null,
                nextMine: null
            };
            var firstMine = null;
            var getData = function(item) {
                var retval = {
                    hidden: item.container.is(':hidden')
                };
                if (!retval.hidden) {
                    retval.top = item.container.offset().top;
                    retval.bottom = retval.top + item.height();
                }
                return retval;
            };
            $j.each(d3.content.items(), function(index, item) {
                var data = undefined;
                if (item.isNew) {
                    if ((data = getData(item)).hidden) return;
                    if (data.bottom < currentOffset) {
                        status.prevNew = index;
                        ++status.prev;
                    } else if (data.top > currentOffset) {
                        ++status.next;
                        if (status.nextNew === null) status.nextNew = index;
                    }
                }
                if (item.isMine) {
                    if (data == undefined && (data = getData(item)).hidden) return;
                    if (!firstMine) firstMine = index;
                    if (data.top > currentOffset) {
                        ++status.mine;
                        if (status.nextMine === null) status.nextMine = index;
                    }
                }
            });
            if (status.nextMine === null && firstMine) status.nextMine = firstMine;
            return status;
        },
        fireTimer: 0,
        newPosition: function() {
            var me = this;
            if (this.fireTimer) clearTimeout(this.fireTimer);
            this.fireTimer = setTimeout(function() {
                me.processNewPosition();
            }, 50);
        },
        processNewPosition: function() {
            var status = this.calculateStatus();
            $j('#mine').text(status.mine);
            $j('#up').text(status.prev);
            $j('#down').text(status.next);
            this.nextNew = status.nextNew;
            this.prevNew = status.prevNew;
            this.nextMine = status.nextMine;
        },
        drawButtons: function() {
            var opacity = 1;
            if (this.config.transparency.value) {
                var transparency = parseInt(this.config.transparency.value);
                if (transparency) {
                    opacity = 1 - transparency / 100;
                    if (opacity < 0.5) {
                        opacity = 0.5;
                    }
                }
            }
            document.body.insertBefore(d3.newDiv({
                style: {
                    position: 'fixed',
                    top: '50%',
                    marginTop: '-72px',
                    right: '1px',
                    zIndex: '100',
                    opacity: opacity
                },
                innerHTML: '<div id="home" style="height:32px; width:32px; color:#ffffff; background-image: url(data:image/gif;base64,R0lGODlhIAAgAIAAALOzs////yH5BAAAAAAALAAAAAAgACAAAAIyhI+py+0Po5y02ouz3rx7GgSfEYZfWXYouq1r64qwy8WylgI5bur9CAwKh8Si8YhEFgAAOw==); cursor: pointer; cursor: hand; text-align:center; margin-bottom: 10px;"></div>' +
                    '<div id="up" style="height:22px; width:32px; color:#ffffff; background-image: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAeNJREFUeNrsl8tLAlEYxeeOM1oGxSCW44tESJLEpJZFLoISol0PEPLPat+ibNFqIKhVD4QIatHWJ4YPCvNFWljZuTGIRY/RKDdz4DB831w5P787d2BIs9lkFIqFm7KptPitUK/Xa3q9vob6pe2eYnEdrKUBBNYg2FQoFJay2WwgnU7XXS7XkcViOQTINe4/yeuJfP0WinQwAbp2EMH+fD4fTKVSs+gNy0FF+MLtdu8CRNLpdLdKp6EEgAZoETyF4FAymZxHbYP5TyZUIIScejyeLVEUT3ieL8v9rgBoMF8sFkcx6lUEr6Aeg/t+AH6GcyzLHni93m2TyXSu0Wjuv5rIVwBsqVQSEbyYSCTWUU/DQ237qkQNOMlx3L7P59sxGo1XgHr8CEIBSHuzXC4PIXguHo8HUc7AI/TBY7rXAxy12+17ZrM5bDAYYtim1olpTaBSqWgRPBmLxUIoA7D1k33+jehRvXQ4HGGASIIg5OiJIdVqdSCTydii0egyGmvwONzP/I3oP7+Dz5xOZ9hqtR4TSZI20XDDE7DQ4T53K/qg3tCJ0BfRBqz75T53KpolwgsUQM/0ThzL9FgqgAqgAqgAKoAKoAKoAD0HaH2cNhqNfw3GZ9t7AL/f/68AkUjk7foqwACX9rDUyu2FOQAAAABJRU5ErkJggg==); cursor: pointer; cursor: hand; text-align:center; padding: 10px 0px 0px 0px; font-size: 90%; text-shadow: 0 1px 1px rgba( 0, 0, 0, 0.75);">0</div>' +
                    '<div id="mine" style="height:18px; width:32px; color:#ffffff; background-image: url(data:image/gif;base64,R0lGODlhIAAgAIAAALOzs////yH5BAAAAAAALAAAAAAgACAAAAIvhI+py+0Po1QhTFnrhdnup33ieHQk1XknkGYr26pn+9b2jef6zvf+DwwKh8QisAAAOw==); cursor: pointer; cursor: hand; text-align:center; padding: 14px 0px 0px 0px; font-size: 90%; text-shadow: 0 1px 1px rgba( 0, 0, 0, 0.75);"></div>' +
                    '<div id="down" style="height:26px; width:32px; color:#ffffff; background-image: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAdJJREFUeNrsl11LwmAUx93mC6yLElOYxjBEBDEho4sQQropgyjqG/U9uqgLiy4i8KLLKLCrbgqCLuYLwqZIvmRv0Mr1f+QZLBtkUBNiBw7jnD3P/r+dczZ4mHw+rzlgqqo6rDSXy9W/OvVEJpOxFKBQKHwG0BNWG+sYsdkANoANYAPYADaADWADDAXAMMxoATRN+98teCYvOQJtotlkut3utizLS5IkxZDwwjkLxF8ikchNKBTKMegvERQBsgyQ1WKxmEIcIGeHPxBWw+GwAuETr9e7g/iaoQPG0HYEOp1OularbQBkAfEU3P0Lwj1RFO+CweCFz+fbw1d1itx9X9hkwgnIRLvdngfIZqlUSiMOw3kK+iPjOO4hlUpd+f3+A5Zl80jJ8Hf6LE0HYOlQGGnIgrFWqzUDkLVyubyCOEpyw4BATE0mkxVBEI4AkUPqFv765R8zUAHOAKIZQNzNZjMKkK1KpZKlIONmA4vy9hKJRAPlPsMBdBepc/iT/sbfARhBHLRUxrUcQKbr9XoWIKQis/BJesbU4vH4Iwbs0uPx7CMm5W6Q/g9UVRsGQF/spBveTEAERVEWq9XqeiwWm4Nwl+f5Y9w/hEuDe0xa3LcPAQYAuF+uyd4wHk0AAAAASUVORK5CYII=); cursor: pointer; cursor: hand; text-align:center; padding: 6px 0px 0px 0px;  font-size: 90%; text-shadow: 0 1px 1px rgba( 0, 0, 0, 0.75);"><br/></div>'
            }), document.body.firstChild);
        }
    });﻿
    d3.addModule({
        type: "Стилизация",
        name: 'Рестайлинг сайта от dirty tort',
        author: 'crea7or',
        variant: ['dirty.ru'],
        config: {
            active: {
                type: 'checkbox',
                value: 0
            },
            postInfoMove: {
                type: 'checkbox',
                caption: 'Информация о посте внизу',
                value: 1
            }
        },
        run: function() {
            var css = '.post_body {margin-top: 1px;} .post h3 {font-family: tahoma;} .vote_result {font-weight: normal !important;} div.post_comments_page { padding-top: 10px;} .comments_header { margin-bottom: 12px; } .post .dd { font-size: 10px !important; } div.c_footer {  font-size: 10px !important; } div.comment { margin-bottom: 0px !important; padding-bottom: 10px !important;}';
            css += '.b-comments_controls_social {display: inline; padding: 5px 0px 0px 5px;} .b-comments_controls_sort{display: inline;}' +
                'div.b-comments_controls { padding: 14px 0px 10px 5px; min-width: 800px;}';
            if ((d3.page.postComments || d3.page.inboxComments) && document.location.href.indexOf('write') == -1) {
                if (this.config.postInfoMove.value) {
                    var postInfo = document.querySelector('div.dd');
                    var postParent = postInfo.parentNode;
                    postParent.removeChild(postInfo);
                    postParent.appendChild(postInfo);
                    $j('.post .dt .post_body').css({
                        overflow: "visible"
                    });
                }
            }
            style = document.createElement('style');
            style.type = 'text/css';
            if (style.styleSheet) {
                style.styleSheet.cssText = css;
            } else {
                style.appendChild(document.createTextNode(css));
            }
            $j('head').append(style);
            var socBut = document.querySelector('span.b-comments_controls_social');
            var socButTarget = document.querySelector('div.b-comments_controls_new_nav');
            if (socBut && socButTarget) {
                var socParent = socBut.parentNode;
                socParent.removeChild(socBut);
                socButTarget.appendChild(socBut);
            }
        }
    });
    d3.addModule({
        type: "Социализм",
        name: 'Анонимные авторы постов',
        author: 'crimaniak',
        variant: ['dirty.ru'],
        config: {
            active: {
                type: 'checkbox',
                value: 0,
                caption: "Анонимность",
                description: 'Модуль для анонимизации авторов постов и комментов'
            },
            posts: {
                type: 'checkbox',
                value: 0,
                caption: "Анонимные авторы постов",
                description: 'Скрывать авторов постов'
            },
            comments: {
                type: 'checkbox',
                value: 0,
                caption: "Анонимные комментаторы",
                description: 'Скрывать авторов комментариев'
            },
            mark: {
                type: 'text',
                value: '?????',
                caption: "Менять никнеймы на:",
                description: 'Что именно писать вместо скрытых имён'
            }
        },
        onPost: function(post) {
            if (this.config.posts.value) {
                $j('.dd a[href^="/user/"]', post.container).html(this.config.mark.value);
            }
        },
        onComment: function(comment) {
            var mark = this.config.mark.value;
            if (this.config.comments.value) {
                $j('.c_footer a[href*="/user/"]', comment.container).html(mark);
                d3.xpath.each("//div[contains(@class,'c_body')]//text()", function(node) {
                    if (node.data != undefined && node.parentNode.className.split(/\s/).indexOf("c_body") >= 0)
                        node.data = node.data.replace(/^[^ ]+:/, mark + ':');
                }, comment.container.get(0));
            }
        },
        run: function() {
            if (this.config.comments.value) {
                var mark = this.config.mark.value;
                var searchMask = new RegExp(RegExp.escape(mark) + ': ', 'g');
                with(d3.window.commentsHandler) {
                    var old = toggleCommentForm;
                    toggleCommentForm = function(button, postId, commentId) {
                        old(button, postId, commentId);
                        var $textarea = $j('.b-comments_reply_block textarea');
                        $textarea.each(function() {
                            this.value = this.value.replace(searchMask, '');
                        });
                        var $yarr = $j("input.b-comments_reply_block_yarrr");
                        $yarr.on("click.hidden.author", function($button, $textarea) {
                            return function() {
                                var $user = $j("a.c_user", $textarea.parents("div.comment"));
                                if ($user.length) {
                                    var href = $user.attr("href");
                                    var userName = href.substr(href.lastIndexOf('/') + 1);
                                    $textarea.each(function() {
                                        this.value = userName + ": " + this.value;
                                    });
                                }
                                $button.off("click.hidden.author");
                            }
                        }($yarr, $textarea));
                    };
                }
            }
        }
    });
    d3.addModule({
        type: "Социализм",
        name: 'Цветной рейтинг',
        author: 'crimaniak',
        config: {
            active: {
                type: 'checkbox',
                value: 0
            },
            ratingPower: {
                type: 'text',
                value: 1,
                caption: 'Коэффициент увеличения шрифта'
            }
        },
        colors: [{
            l: -250,
            c: '#993333'
        }, {
            l: -150,
            c: '#aa5533'
        }, {
            l: -100,
            c: '#aa7733'
        }, {
            l: -42,
            c: '#bb8833'
        }, {
            l: -5,
            c: '#aaaa33'
        }, {
            l: 64,
            c: '#666666'
        }, {
            l: 156,
            c: '#333333'
        }, {
            l: 255,
            c: '#000000'
        }, {
            l: 512,
            c: '#990000'
        }, {
            l: 999,
            c: '#cc0000'
        }, {
            l: 64000,
            c: '#ff0000'
        }],
        onComment: function(comment) {
            this.process(comment);
        },
        onPost: function(post) {
            this.process(post);
        },
        process: function(item) {
            var container = item.ratingContainer();
            var rating = item.ratingValue();
            if (rating > 0) {
                container.css('font-size', Math.min(16, 9 + Math.round(0.3 * Math.sqrt(Math.abs(rating * this.config.ratingPower.value)))) + "px");
            }
            for (var i in this.colors) {
                var color = this.colors[i];
                if (rating < color.l) {
                    container.css('color', color.c);
                    break;
                }
            }
        }
    });
    d3.addModule({
        type: "Содержание",
        name: 'Замена %username%',
        author: 'crimaniak',
        config: {
            active: {
                type: 'checkbox',
                value: 0,
                description: 'Аббревиатура %username% в постах и комментах заменяется на твой ник, %username%.'
            }
        },
        noUserName: d3.user.name == null,
        process: function(contextNode) {
            d3.xpath.each("//text()[contains(string(),'%username%')]", function(node) {
                if (node.data != undefined)
                    node.data = node.data.replace('%username%', d3.user.name);
            }, contextNode);
        },
        run: function() {
            if (this.noUserName) return;
            this.process();
        },
        onPost: function(post) {
            if (this.noUserName) return;
            this.process(post.container.get(0));
        },
        onComment: function(comment) {
            if (this.noUserName) return;
            this.process(comment.container.get(0));
        }
    });
    d3.addModule({
        type: "Содержание",
        name: 'Спрятать картинки в постах',
        author: 'crimaniak',
        config: {
            active: {
                type: 'checkbox',
                value: 0
            }
        },
        onPost: function(post) {
            var img = $j('.post_body img', post.container).first();
            if (img.length) {
                var p = img.parent();
                var opener = $j('<a href="#">Показать картинку</a>');
                img.css('display', 'none');
                opener.prependTo(p);
                p.click(function() {
                    img.css('display', '');
                    opener.remove();
                    return false;
                });
            }
        }
    });
    d3.addModule({
        type: "Социализм",
        name: 'Пряталки рейтинга',
        author: 'crimaniak',
        config: {
            postRating: {
                type: 'checkbox',
                value: 0,
                caption: 'Спрятать рейтинг постов'
            },
            commentRating: {
                type: 'checkbox',
                value: 0,
                caption: 'Спрятать рейтинг комментариев'
            },
            voteButtons: {
                type: 'checkbox',
                value: 0,
                caption: 'Спрятать кнопки голосования'
            }
        },
        onPost: function(post) {
            if (d3.page.inbox || this.config.postRating.value) {
                $j('.vote_result', post.container).remove();
            }
            if (d3.page.inbox || this.config.voteButtons.value) {
                $j('.vote_button', post.container).remove();
            }
        },
        onComment: function(comment) {
            if (d3.page.inbox || this.config.commentRating.value) {
                $j('.c_vote .vote_result', comment.container).remove();
            }
            if (d3.page.inbox || this.config.voteButtons.value) {
                $j('.vote_button', comment.container).remove();
            }
        }
    });﻿
    d3.addModule({
        type: "Содержание",
        name: 'Фотогалерея поста',
        author: 'maniak,crimaniak',
        config: {
            active: {
                type: 'checkbox',
                value: 0,
                description: 'Если в посте есть комментарии с картинками, то сверху страницы появляется полоска с копиями всех картинок, масштабированными в одну высоту.'
            },
            height: {
                type: 'text',
                value: '200px',
                caption: 'Высота картинок в фотогалерее'
            }
        },
        run: function() {
            if (!d3.content.comments.length || !(this.imgs = $j('.c_body img')).length) return;
            $j("body").prepend("<div id='fotkiMain' style='background-color:black;'>" +
                "<div id='fotkiShow' style='padding:7px;'><a href='#' id='aFotkiShow' style='color:white'><b>Показать все картинки</b></a></div>" +
                "<div id='fotkiHide1' style='padding:7px;color:white'>" +
                "<a href='#' id='aFotkiHide1' style='color:white'><b>Убрать картинки, буду читать</b></a>" +
                " &nbsp; Размеры: " + function() {
                    var t = '';
                    $j.each([50, 75, 100, 125, 150, 200, 250], function(i, s) {
                        t += ' &nbsp; <a href="#" style="color:white" class="newSize">' + s + 'px</a>';
                    });
                    return t;
                }() +
                "</div>" +
                "<div id='fotkiFotki' style='line-height:0px;background-color:white;'></div>" +
                "<div id='fotkiHide2' style='padding:7px;'><a href='#' id='aFotkiHide2'  style='color:white'><b>Убрать картинки, буду читать</b></a></div></div>");
            var me = this;
            $j("#aFotkiShow").click(function() {
                me.fotkiShow(me.config.height.value);
            });
            $j("#aFotkiHide1").click(this.fotkiHide);
            $j("#aFotkiHide2").click(this.fotkiHide);
            $j('.newSize').click(function() {
                return me.setNewSize($j(this).text());
            });
            this.fotkiHide();
        },
        setNewSize: function(size) {
            this.config.height._control.setValue(size);
            d3.config.save();
            $j('#fotkiFotki img').each(function() {
                this.setAttribute('height', size);
            });
            return false;
        },
        fotkiHide: function() {
            $j('#fotkiFotki').hide();
            $j('#fotkiShow').show();
            $j('#fotkiHide1').hide();
            $j('#fotkiHide2').hide();
        },
        fotkiShow: function(h) {
            var found = [];
            var needToSort = false;
            $j.each(d3.content.comments, function(index, c) {
                $j('img', c.container).each(function(index) {
                    if (this.src == 'http://img.dirty.ru/pics/lapata.gif') return;
                    found.push({
                        src: this.src,
                        id: c.id,
                        rating: c.ratingValue()
                    });
                    var r = c.ratingValue();
                    if (r != 0 && r == r) needToSort = true;
                });
            });
            if (needToSort) found.sort(function(a, b) {
                return b.rating - a.rating;
            });
            var text = "";
            $j.each(found, function(index, image) {
                text += "<a href='#" + image.id + "'><img src='" + image.src + "' height='" + h + (needToSort ? "' title='Рейтинг " + image.rating : '') + "'></a>";
            });
            $j("#fotkiFotki").html(text);
            $j('#fotkiShow').hide();
            $j('#fotkiHide1').show();
            $j('#fotkiHide2').show();
            $j('#fotkiFotki').show();
        }
    });
    d3.addModule({
        type: "Содержание",
        name: 'Добавлять предпросмотр для инбоксов',
        author: 'crea7or',
        config: {
            active: {
                type: 'checkbox',
                value: 0
            }
        },
        run: function() {
            var inboxSubminButtonDiv = document.getElementById('js-new_inbox_submit');
            if (inboxSubminButtonDiv) {
                this.addPreview(inboxSubminButtonDiv);
            }
        },
        addPreview: function(buttonDiv) {
            var previewInput = document.createElement('input');
            previewInput.type = 'image';
            previewInput.setAttribute('name', 'previewButton');
            previewInput.src = 'http://g2.std3.ru/G/1/F7/FE/28284-441f5b868a323f46a2e3f10cd2fdc028.gif';
            previewInput.setAttribute('style', 'margin-left: 50px;');
            buttonDiv.appendChild(previewInput);
            $j(previewInput).click(function(e) {
                var previewTextArea = document.getElementById('js-new_inbox_body');
                if (previewTextArea) {
                    var previewDiv = document.querySelector('div.sp3previewDiv');
                    if (previewDiv == null) {
                        previewDiv = document.createElement('div');
                        previewDiv.setAttribute('style', 'padding: 5px; margin: 5px 0px 0px 0px !important; border: 1px dashed grey;');
                        previewDiv.setAttribute('class', 'sp3previewDiv');
                        previewTextArea.parentNode.parentNode.appendChild(previewDiv);
                    }
                    previewDiv.innerHTML = previewTextArea.value.replace(/\n/g, '<br>');
                }
                e.preventDefault();
                return false;
            });
        }
    });
    d3.addModule({
        type: "Прочее",
        name: 'Показывать favicons доменов',
        author: 'Stasik0, NickJr, crimaniak',
        config: {
            active: {
                type: 'checkbox',
                value: 0
            },
            mouseover: {
                type: 'radio',
                caption: 'Когда:',
                options: {
                    "перманентно": 0,
                    "только при наведении": 1
                },
                value: 0
            },
            position: {
                type: 'radio',
                caption: 'Где:',
                options: {
                    "слева от ссылки": 0,
                    "справа от ссылки": 1
                },
                value: 0
            },
            domainWhitelist: {
                type: 'text',
                caption: 'Список доменов',
                value: 'd3.ru,dirty.ru,livejournal.com,lenta.ru,flickr.com,google.com,google.ru,yandex.ru,yandex.net,rian.ru,wikipedia.org,wikimedia.org,futurico.ru,leprosorium.ru,facebook.com,twitter.com,gazeta.ru,vedomosti.ru,1tv.ru,fontanka.ru,kommersant.ru,vesti.ru,kp.ru,blogspot.com,narod.ru,vimeo.com,rbc.ru,korrespondent.net,youtube.com'
            }
        },
        getDomainMasks: function() {
            return this.config.domainWhitelist.value.split(/[\s,]+/).map(function(item) {
                return new RegExp('^(.*\\.)?' + item.replace(/\./g, '\\.').replace(/\*/g, '.*') + '$', 'i');
            });
        },
        inWhiteList: function(domain) {
            if (domain.length == 0) return false;
            if (this.config.domainWhitelist.value === "*") return true;
            if (this.inWhiteList.masks == undefined) this.inWhiteList.masks = this.getDomainMasks();
            try {
                this.inWhiteList.masks.forEach(function(mask) {
                    if (mask.test(domain)) {
                        throw true;
                    }
                });
                return false;
            } catch (e) {
                return true;
            }
        },
        showFavicon: function(el, faviconUrl) {
            el.css('background-image', 'url(' + faviconUrl + ')').addClass("faviconized");
        },
        hideFavicon: function(el) {
            el.css('background-image', 'none').removeClass("faviconized");
        },
        run: function() {
            var side = this.config.position.value == 1 ? 'right' : 'left';
            $j('head').append("<style type='text/css'> .faviconized { \
    padding-" + side + ":19px; \
      background-repeat:no-repeat; \
   background-position:" + side + " center; \
  } </style>");
        },
        onPost: function(post) {
            this.processItem(post.container);
        },
        onComment: function(comment) {
            this.processItem(comment.container);
        },
        processItem: function(container) {
            var me = this;
            $j.each($j('div.dt > h3 > a', container).add('div.dt a, div.c_body a, div.dt div.post_video a', container).not('a[class*="b-controls_button"]').not(':has(img)').not('a[href=#]'), function(index, link) {
                if (me.inWhiteList(link.hostname)) {
                    var faviconUrl;
                    if (link.hostname.indexOf('dirty.ru', link.hostname.length - 'dirty.ru'.length) !== -1) {
                        faviconUrl = location.protocol + '//www.google.com/s2/favicons?domain=' + link.hostname;
                    } else {
                        faviconUrl = location.protocol + '//favicon.yandex.net/favicon/' + link.hostname;
                    }
                    if (me.config.mouseover.value == 1) {
                        $j(link).mouseover(function() {
                            me.showFavicon($j(this), faviconUrl);
                        }).mouseout(function() {
                            me.hideFavicon($j(this));
                        });
                    } else {
                        me.showFavicon($j(link), faviconUrl);
                    }
                }
            });
        }
    });
    d3.addModule({
        type: "Социализм",
        name: 'Цветовая дифференциация полов',
        author: 'crea7or',
        config: {
            active: {
                type: 'checkbox',
                value: 0
            }
        },
        onPost: function(post) {
            this.processElements(post.info.get(0).querySelectorAll('a.c_user'));
        },
        onComment: function(comment) {
            this.processElementsComment(comment.getFooter().get(0).querySelectorAll('a.c_user'));
        },
        processElements: function(elemArray) {
            if (!elemArray) return;
            for (var i = 0; i < elemArray.length; i++) {
                if (elemArray[i].previousSibling.nodeValue.indexOf('Написала') > -1) {
                    elemArray[i].style.borderBottom = '1px solid #ff78f7';
                } else {
                    elemArray[i].style.borderBottom = '1px solid #5086ff';
                }
                elemArray[i].style.textDecoration = 'none';
            }
        },
        processElementsComment: function(elemArray) {
            if (!elemArray) return;
            for (var i = 0; i < elemArray.length; i++) {
                iconAnchor = elemArray[i].parentNode.querySelector('a.c_icon');
                if (iconAnchor) {
                    var nextNode = iconAnchor.nextSibling;
                    while (nextNode) {
                        if (nextNode.nodeName == 'SPAN') {
                            if (nextNode.innerHTML.indexOf('Написала') > -1) {
                                elemArray[i].style.borderBottom = '1px solid #ff78f7';
                            } else {
                                elemArray[i].style.borderBottom = '1px solid #5086ff';
                            }
                            elemArray[i].style.textDecoration = 'none';
                            break;
                        }
                        nextNode = nextNode.nextSibling;
                    }
                }
            }
        },
    });
    d3.addModule({
        type: "Содержание",
        name: 'Просмотр видео по клику на ссылке',
        author: 'crea7or',
        config: {
            active: {
                type: 'checkbox',
                value: false,
                caption: 'Просмотр видео прямо на сайте',
                description: 'Просмотр видео прямо на сайте, не переходя на youtube'
            },
            bigwindow: {
                type: 'checkbox',
                value: false,
                caption: 'открывать в большом размере',
                description: 'видео будет открываться в большом окне 1024px иначе 800px'
            },
            addimages: {
                type: 'checkbox',
                value: false,
                caption: 'добавлять превью видео к ссылкам',
                description: 'добавлять автоматически картинку-превью ко всем ссылкам на видео без оной'
            }
        },
        onPost: function(post) {
            this.setPlayer(post.container.get(0));
        },
        onComment: function(comment) {
            this.setPlayer(comment.container.get(0));
        },
        setPlayer: function(container) {
            if (!container.getElementsByTagName) return;
            var me = this;
            var allLinksArray = container.getElementsByTagName('a');
            for (var i = 0; i < allLinksArray.length; i++) {
                if (allLinksArray[i].href.match(/(youtube\.com|youtu\.be|vimeo\.com|coub\.com)/i)) {
                    if (this.config.addimages.value) {
                        this.addImage4VideoLinks(allLinksArray[i]);
                    }
                    $j(allLinksArray[i]).bind('click', function(event) {
                        me.clickOnVideoLink(event)
                    });
                }
            }
        },
        clickOnVideoLink: function(e) {
            var thisObject = e.target;
            if (thisObject.nodeName != 'A') {
                thisObject = $j(thisObject).parents("a").get(0);
            }
            var videoId;
            if ((thisObject.href.search(/youtube.com/i) > -1) && (thisObject.href.search(/v=/i) > -1)) {
                videoTime = 0;
                videoId = thisObject.href.slice(thisObject.href.search(/v=/i) + 2);
                if (videoId.indexOf('&') > 1) {
                    if (videoId.indexOf('&t=') > -1) {
                        videoTime = videoId.slice(videoId.indexOf('&t=') + 3);
                        if (videoTime.indexOf('&') > -1) {
                            videoTime = videoTime.slice(0, videoTime.indexOf('&'));
                        }
                    } else if (videoId.indexOf('&start=') > -1) {
                        videoTime = videoId.slice(videoId.indexOf('&start=') + 7);
                        if (videoTime.indexOf('&') > -1) {
                            videoTime = videoTime.slice(0, videoTime.indexOf('&'));
                        }
                    }
                    videoId = videoId.slice(0, videoId.indexOf('&'));
                }
                videoId = location.protocol + '//www.youtube.com/embed/' + videoId + '?autoplay=1&hd=1&fs=1&start=' + videoTime;
            } else if (thisObject.href.search(/youtu.be/i) > -1) {
                videoId = thisObject.href.slice(thisObject.href.search(/youtu.be/i) + 9);
                videoId = location.protocol + '//www.youtube.com/embed/' + videoId + '?autoplay=1&hd=1&fs=1';
            } else if (thisObject.href.search(/vimeo.com/i) > -1) {
                videoId = thisObject.href.slice(thisObject.href.search(/vimeo.com/i) + 10);
                if (!isNaN(parseFloat(videoId)) && isFinite(videoId)) {
                    videoId = location.protocol + '//player.vimeo.com/video/' + videoId + '?autoplay=1';
                } else {
                    videoId = '';
                }
            } else if (thisObject.href.search(/coub.com/i) > -1) {
                videoId = thisObject.href.slice(thisObject.href.search(/view/i) + 5);
                videoId = location.protocol + '//coub.com/embed/' + videoId + '?muted=false&amp;autostart=true&originalSize=false&hideTopBar=false&noSiteButtons=false&startWithHD=true';
            }
            if (videoId.length > 0) {
                divCi = thisObject.parentNode;
                do {
                    if (divCi == undefined || divCi == null || divCi.nodeName != "DIV") {
                        break;
                    }
                    attrb = divCi.getAttribute("class");
                    if (attrb != null && attrb != undefined) {
                        if (attrb.indexOf("c_i") > -1) {
                            divCi.setAttribute("class", "c_i_bkp");
                            divToDel = divCi.querySelector("div.b-c_o");
                            if (divToDel) {
                                divToDel.parentNode.removeChild(divToDel);
                            }
                            break;
                        }
                        if (attrb.indexOf("comment") > -1) {
                            break;
                        }
                    }
                    divCi = divCi.parentNode;
                } while (divCi);
                var playerMainDiv = document.createElement('div');
                var newIframeDiv = document.createElement('div');
                var playerWidth = '800px';
                var playerHeight = '470px';
                if (this.config.bigwindow.value) {
                    playerWidth = '1024px';
                    playerHeight = '600px';
                }
                var newDivToolbar = document.createElement('div');
                $j(newDivToolbar).css('width', '100%');
                $j(newDivToolbar).css('font-size', '13px');
                $j(newDivToolbar).css('font-face', 'verdana,tahoma');
                $j(newDivToolbar).css('margin', '7px');
                var topToolbar = document.createElement('div');
                $j(topToolbar).css('width', playerWidth);
                $j(topToolbar).css('font-size', '13px');
                $j(topToolbar).css('font-face', 'verdana,tahoma');
                $j(topToolbar).css('margin', '7px');
                var videoTargetId = 'vi' + (new Date()).getTime().toString();
                thisObject.id = videoTargetId;
                var iframeObj = document.createElement('iframe');
                $j(iframeObj).css('width', playerWidth);
                $j(iframeObj).css('height', playerHeight);
                iframeObj.frameBorder = '0';
                iframeObj.setAttribute('allowfullscreen', '1');
                iframeObj.class = 'inlineVideo';
                iframeObj.src = videoId;
                topToolbar.appendChild(document.createTextNode(' размер видео: '));
                var newA = document.createElement('a');
                newA.href = '#';
                newA.appendChild(document.createTextNode('нормальный'));
                $j(newA).bind('click', function(e) {
                    $j(topToolbar).css('width', '800px');
                    $j(iframeObj).css('width', '800px');
                    $j(iframeObj).css('height', '470px');
                    e.preventDefault();
                    return false;
                });
                topToolbar.appendChild(newA);
                topToolbar.appendChild(document.createTextNode(' | '));
                newA = document.createElement('a');
                newA.href = '#';
                newA.appendChild(document.createTextNode('большой'));
                $j(newA).bind('click', function(e) {
                    $j(topToolbar).css('width', '1024px');
                    $j(iframeObj).css('width', '1024px');
                    $j(iframeObj).css('height', '600px');
                    e.preventDefault();
                    return false;
                });
                topToolbar.appendChild(newA);
                var newA = document.createElement('a');
                newA.href = '#';
                $j(newA).css('float', 'right');
                newA.setAttribute('orgObj', videoTargetId);
                newA.appendChild(document.createTextNode('закрыть плеер'));
                $j(newA).bind('click', function(e) {
                    var orgObj = document.getElementById(e.target.getAttribute('orgObj'));
                    orgObj.setAttribute('style', orgObj.getAttribute('bkpstyle'));
                    orgObj.setAttribute('class', orgObj.getAttribute('bkpclass'));
                    playerMainDiv.parentNode.removeChild(playerMainDiv);
                    e.preventDefault();
                    return false;
                });
                topToolbar.appendChild(newA);
                newA = document.createElement('a');
                newA.href = '#';
                newA.setAttribute('orgObj', videoTargetId);
                newA.appendChild(document.createTextNode('закрыть плеер'));
                $j(newA).bind('click', function(e) {
                    var orgObj = document.getElementById(e.target.getAttribute('orgObj'));
                    orgObj.setAttribute('style', orgObj.getAttribute('bkpstyle'));
                    orgObj.setAttribute('class', orgObj.getAttribute('bkpclass'));
                    playerMainDiv.parentNode.removeChild(playerMainDiv);
                    e.preventDefault();
                    return false;
                });
                newDivToolbar.appendChild(newA);
                newIframeDiv.appendChild(topToolbar);
                newIframeDiv.appendChild(iframeObj);
                newIframeDiv.appendChild(newDivToolbar);
                playerMainDiv.appendChild(newIframeDiv);
                $j(playerMainDiv).insertAfter(thisObject);
                thisObject.setAttribute('bkpstyle', thisObject.getAttribute('style'));
                thisObject.parentNode.setAttribute('bkpclass', thisObject.parentNode.getAttribute('class'));
                thisObject.parentNode.setAttribute('class', 'dti');
                var outliner = thisObject.parentNode.parentNode.querySelector('div.b-comment_outline');
                if (outliner) {
                    outliner.setAttribute('style', 'display: none');
                }
                thisObject.setAttribute('style', 'display: none');
                thisObject.setAttribute('bkpclass', thisObject.getAttribute('class'));
                e.preventDefault();
                return false;
            }
        },
        addImage4VideoLinks: function(linkObject) {
            videoId = '';
            if ((linkObject.href.search(/youtube.com/i) > -1) && (linkObject.href.search(/v=/i) > -1)) {
                videoTime = 0;
                videoId = linkObject.href.slice(linkObject.href.search(/v=/i) + 2);
                if (videoId.indexOf('&') > 1) {
                    videoId = videoId.slice(0, videoId.indexOf('&'));
                }
                if (videoId.indexOf('#') > -1) {
                    videoId = videoId.slice(0, videoId.indexOf('#'));
                }
            } else if (linkObject.href.search(/youtu.be/i) > -1) {
                videoId = linkObject.href.slice(linkObject.href.search(/youtu.be/i) + 9);
            }
            if (videoId.length > 0) {
                var insertPreview = true;
                var imgs = linkObject.parentNode.getElementsByTagName('img');
                if (imgs) {
                    for (var cnt = 0; cnt < imgs.length; cnt++) {
                        if (imgs[cnt].src.indexOf(videoId) > -1) {
                            insertPreview = false;
                            break;
                        }
                    }
                }
                if (insertPreview) {
                    if (linkObject.parentNode.nodeName == "H3") {
                        insertPreview = false;
                    }
                }
                if (insertPreview) {
                    if (linkObject.innerHTML.indexOf('<img') > -1) {
                        insertPreview = false;
                    }
                }
                if (insertPreview) {
                    newImg = document.createElement('img');
                    newImg.setAttribute('src', location.protocol + '//img.youtube.com/vi/' + videoId + '/0.jpg');
                    linkObject.appendChild(document.createElement('br'));
                    linkObject.appendChild(newImg);
                    linkObject.appendChild(document.createElement('br'));
                }
            }
        }
    });
    d3.addModule({
        type: "Содержание",
        name: 'Прятать пользователей инбокса под ссылку',
        author: 'crea7or',
        config: {
            active: {
                type: 'checkbox',
                value: 0
            }
        },
        run: function() {
            var insidePost = (document.location.href.indexOf('comments') > -1);
            var insideInbox = (document.location.href.indexOf('inbox') > -1);
            var tortAddLinksInbox = document.querySelector('div.b-comments_controls_sort');
            if (tortAddLinksInbox && insideInbox) {
                tortNewa = document.createElement('a');
                tortNewa.href = '#';
                tortNewa.setAttribute('style', 'margin-left: 20px;');
                tortNewa.setAttribute('onclick', "var e = document.getElementById('js-inboxers-list');  if(e.style.display == 'block') e.style.display = 'none'; else e.style.display = 'block'; return false;");
                tortNewa.innerHTML = 'список инбоксеров';
                tortAddLinksInbox.appendChild(tortNewa);
                var tortHideInboxers = document.querySelector('div.b-inbox_controls');
                if (tortHideInboxers) {
                    tortHideInboxers.setAttribute('id', 'js-inboxers-list');
                    tortHideInboxers.style.display = 'none';
                    tortHideInboxers = document.querySelector('div.comments_holder_inner');
                    if (tortHideInboxers) {
                        tortHideInboxers.setAttribute('style', 'padding-right: 0px');
                    }
                }
            }
        },
    });
    d3.addModule({
        type: "Содержание",
        name: 'Добавлять кнопку пересоздания инбокса',
        author: 'crea7or',
        config: {
            active: {
                type: 'checkbox',
                value: 0
            }
        },
        run: function() {
            var me = this;
            var tortAddLinksInbox = document.querySelector('div.b-inbox_controls');
            if (tortAddLinksInbox) {
                tortNewd = document.createElement('div');
                tortNewa = document.createElement('a');
                tortNewa.href = '#';
                tortNewd.setAttribute('style', 'margin-top: 10px;');
                tortNewa.setAttribute('class', 'b-inbox_controls_delete_inbox');
                tortNewa.innerHTML = 'Пересоздать инбокс';
                tortNewd.appendChild(tortNewa);
                tortAddLinksInbox.appendChild(tortNewd);
                $j(tortNewa).bind('click', function(e) {
                    me.copyAction();
                });
            }
            if (document.location.href.indexOf('dirty.ru/my/inbox/write/') > -1) {
                var timeOfUsersCopy = localStorage.getItem('dirtySpmRecInbTime');
                if (timeOfUsersCopy) {
                    if ((new Date().getTime() - timeOfUsersCopy) < 1000 * 30) {
                        var inbUsers = document.getElementById('js-new_inbox_to');
                        if (inbUsers) {
                            inbUsers.value = localStorage.getItem('dirtySpmRecInbUsers');
                        }
                        var inbText = document.getElementById('js-new_inbox_body');
                        if (inbText) {
                            inbText.value = localStorage.getItem('dirtySpmRecTxt');
                        }
                    }
                    localStorage.removeItem('dirtySpmRecInbTime');
                    localStorage.removeItem('dirtySpmRecInbUsers');
                    localStorage.removeItem('dirtySpmRecTxt');
                }
            }
        },
        copyAction: function(e) {
            var inboxUsers = document.getElementById('js-inbox_controls_users');
            if (inboxUsers) {
                var linksToUsers = inboxUsers.getElementsByTagName('a');
                var userNames = new Array();
                if (linksToUsers) {
                    for (var i = 0; i < linksToUsers.length; i++) {
                        if (linksToUsers[i].textContent.length > 0) {
                            userNames.push(linksToUsers[i].textContent);
                        }
                    }
                }
                if (userNames.length > 0) {
                    var postTxtDiv = document.querySelector('div.post_body');
                    if (postTxtDiv) {
                        localStorage.setItem('dirtySpmRecTxt', postTxtDiv.innerHTML);
                    }
                    localStorage.setItem('dirtySpmRecInbUsers', userNames.join());
                    localStorage.setItem('dirtySpmRecInbTime', new Date().getTime());
                    document.location.href = location.protocol + '//dirty.ru/my/inbox/write/';
                }
            }
            e.preventDefault();
            return false;
        },
    });
    d3.addModule({
        type: "Стилизация",
        author: 'crimaniak',
        name: 'Спрятать лишнее',
        variant: ['dirty.ru'],
        config: {
            active: {
                type: 'checkbox',
                value: 0
            },
            hideSocialLinks: {
                type: 'checkbox',
                caption: 'Спрятать кнопки социальных сетей',
                value: 0
            }
        },
        run: function() {
            if (this.config.hideSocialLinks.value) $j('.b-post_social_link').hide();
        }
    });
    d3.addModule({
        type: "Содержание",
        name: 'Показывать внешние ссылки из заголовков постов',
        author: 'crea7or',
        variant: ['dirty.ru'],
        config: {
            active: {
                type: 'checkbox',
                value: 0
            },
            headerToComments: {
                type: 'checkbox',
                caption: 'Ссылка заголовка на комментарии',
                value: 0
            }
        },
        onPost: function(post) {
            var headersArr = $j("h3", post.container).get();
            if (headersArr) {
                var headerLinks;
                var linkHref;
                var linkPreview;
                for (var i = 0; i < headersArr.length; i++) {
                    headerLinks = headersArr[i].getElementsByTagName('a');
                    if (headerLinks.length == 1) {
                        var d3link = true;
                        if (headerLinks[0].href.indexOf('dirty.ru/comments/') == -1) {
                            d3link = false;
                        } else {
                            var linkSplit = headerLinks[0].href.split("/");
                            if (linkSplit.length > 2) {
                                if (post.id != linkSplit[linkSplit.length - 2]) {
                                    d3link = false;
                                }
                            }
                        }
                        if (d3link == false) {
                            linkHref = headerLinks[0].hostname.replace(/^www\./, '');
                            linkPreview = document.createElement('a');
                            linkPreview.href = headerLinks[0].href;
                            linkPreview.innerHTML = linkHref;
                            linkPreview.setAttribute('style', 'margin-left: 20px; opacity: 0.5;');
                            headersArr[i].appendChild(linkPreview);
                            if (this.config.headerToComments.value == 1) {
                                var linkToPost = "";
                                var postInfo = headersArr[0].parentNode.parentNode.querySelector('div.dd');
                                if (postInfo) {
                                    var linksInInfo = postInfo.getElementsByTagName('a');
                                    if (linksInInfo) {
                                        for (var c = 0; c < linksInInfo.length; c++) {
                                            if (linksInInfo[c].href.indexOf("dirty.ru/comments/") > -1) {
                                                linkToPost = linksInInfo[c].href;
                                                break;
                                            }
                                        }
                                    }
                                }
                                if (linkToPost.length > 0) {
                                    headerLinks[0].href = linkToPost;
                                }
                            }
                        }
                    }
                }
            }
        }
    });
    d3.addModule({
        type: "Содержание",
        name: 'Добавление видео к комментариям',
        author: 'Stasik0, crea7or',
        config: {
            active: {
                type: 'checkbox',
                value: 0
            }
        },
        youtube_id: "",
        textarea_id: "",
        run: function() {
            if (d3.page.postComments || d3.page.inboxComments) {
                var me = this;
                var width = 750;
                var height = 320;
                document.body.appendChild(d3.newDiv({
                    innerHTML: '<div id="youtube_preview" style="display:none;position:fixed;top:' + ((me.viewarea_size().y - height) / 2) + 'px;left:' + ((me.viewarea_size().x - width) / 2) + 'px;width:' + width + 'px;height:' + height + 'px;z-index:2999"><table cellspacing="0" cellpadding="0" border="1" width="' + width + '" height="' + height + '" style="background-color: #fff"><tr><td style="font-size:10px;padding:0 10px 15px 0;line-height:16px" align="center" valign="center">' +
                        '<div id="youtube_preview_close" style="float: right; background-color: #999; width:36px;height:20px;font-size:12px;line-height:20px;text-align:center;color:#fff;cursor:pointer"><b>x</b></div>' +
                        '<table><tr><td><div style="font-size:180%;color:#5880af; padding-bottom: 10px;">Youtube preview</div></td><td><div style="float: left";>Картинка в посте</div></td></tr>' +
                        '<tr><td><div id="youtube_embed" style="width: 340px; float:left;"></div></td>' +
                        '<td><div id="youtube_thumbs"></div></td></tr></table>' +
                        '<div id="youtube_time" style="width: 340px; float:left;">Перемотайте на нужное время. Позиция сейчас: 0 cек. Ссылка будет поставлена именно на эту секунду ролика.</div>' +
                        '<div id="youtube_yarrr" style="cursor: pointer; float: right; background-image: url(data:image/gif;base64,R0lGODlhNgAUAMQAAPf39ePj4be3tcfHxYCAgHp6eD09PNbW1ZeXlSwsK6enpv7+/l1dXExMSouLiQICAfHx7/T08jAwLvLy8Pb29B4eHBERDyAgHuXl47+/vT8/PuXl5bKysO7u7IiIhujo5iH/C1hNUCBEYXRhWE1QPD94cGFja2V0IGJlZ2luPSLvu78iIGlkPSJXNU0wTXBDZWhpSHpyZVN6TlRjemtjOWQiPz4gPHg6eG1wbWV0YSB4bWxuczp4PSJhZG9iZTpuczptZXRhLyIgeDp4bXB0az0iQWRvYmUgWE1QIENvcmUgNS4wLWMwNjAgNjEuMTM0Nzc3LCAyMDEwLzAyLzEyLTE3OjMyOjAwICAgICAgICAiPiA8cmRmOlJERiB4bWxuczpyZGY9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkvMDIvMjItcmRmLXN5bnRheC1ucyMiPiA8cmRmOkRlc2NyaXB0aW9uIHJkZjphYm91dD0iIiB4bWxuczp4bXA9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC8iIHhtbG5zOnhtcE1NPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvbW0vIiB4bWxuczpzdFJlZj0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL3NUeXBlL1Jlc291cmNlUmVmIyIgeG1wOkNyZWF0b3JUb29sPSJBZG9iZSBQaG90b3Nob3AgQ1M1IFdpbmRvd3MiIHhtcE1NOkluc3RhbmNlSUQ9InhtcC5paWQ6QjZGRkQ2MzZFMTE3MTFFMzk5NkQ4MDg2M0E3QTBGMkMiIHhtcE1NOkRvY3VtZW50SUQ9InhtcC5kaWQ6QjZGRkQ2MzdFMTE3MTFFMzk5NkQ4MDg2M0E3QTBGMkMiPiA8eG1wTU06RGVyaXZlZEZyb20gc3RSZWY6aW5zdGFuY2VJRD0ieG1wLmlpZDpCNkZGRDYzNEUxMTcxMUUzOTk2RDgwODYzQTdBMEYyQyIgc3RSZWY6ZG9jdW1lbnRJRD0ieG1wLmRpZDpCNkZGRDYzNUUxMTcxMUUzOTk2RDgwODYzQTdBMEYyQyIvPiA8L3JkZjpEZXNjcmlwdGlvbj4gPC9yZGY6UkRGPiA8L3g6eG1wbWV0YT4gPD94cGFja2V0IGVuZD0iciI/PgH//v38+/r5+Pf29fTz8vHw7+7t7Ovq6ejn5uXk4+Lh4N/e3dzb2tnY19bV1NPS0dDPzs3My8rJyMfGxcTDwsHAv769vLu6ubi3trW0s7KxsK+urayrqqmop6alpKOioaCfnp2cm5qZmJeWlZSTkpGQj46NjIuKiYiHhoWEg4KBgH9+fXx7enl4d3Z1dHNycXBvbm1sa2ppaGdmZWRjYmFgX15dXFtaWVhXVlVUU1JRUE9OTUxLSklIR0ZFRENCQUA/Pj08Ozo5ODc2NTQzMjEwLy4tLCsqKSgnJiUkIyIhIB8eHRwbGhkYFxYVFBMSERAPDg0MCwoJCAcGBQQDAgEAACH5BAAAAAAALAAAAAA2ABQAAAX/4BKMZGmeaKqeixgAcCzPdG3f8ijifO/PAcLrRywChcZkMThUOnHMW+AQOwQoVthhwIUADplBxrsNewGNgRRpO0gaFIjFAWEMIl9JgWH4JvYaeYAwFmo2UTcHFRgKBRGKDBMAAQYCGw+TGpaYlAIBmAAGhjWINhAODQ0RFAgeFpIBmgd9sQIHgbW3MKJrTW0XChETDQwXCJMGDBIKyMrMsQwJzGijNKVtlREBqgga2pUCFyOaAhUj4OYAx708AhIOAQwFcQ8IAQkOHQjLCR4R+wre/VtWiB0OBxw4YBBwhwIHAR8ECAAAYQCHDAJWiUkIgMIAhlDYPBlpTSTJk5NMIKIcycTXSiUjCLhYQbOmTRIEZC7IybOnz59AgwoFuiAEADs=); width: 54px; height: 20px;"></div>' +
                        '</td></tr></table></div>'
                }));
                $j('#youtube_preview_close').click(function(e) {
                    me.close();
                });
                $j('#youtube_yarrr').click(function(e) {
                    me.yarr();
                });
                var head = (document.getElementsByTagName('head')[0] || document.getElementsByTagName('body')[0]);
                var script1 = document.createElement('script');
                script1.type = 'text/javascript';
                script1.textContent = 'function vimeoProcessThumb(data)' +
                    '{' +
                    ' var id_img = "#vimeo" + data[0].id;' +
                    ' var textAreas = document.getElementsByTagName("textarea");' +
                    ' if ( textAreas )' +
                    ' {' +
                    '  for ( var i = 0; i < textAreas.length; i++)' +
                    '  {' +
                    '   var valInd = textAreas[i].value.indexOf( id_img );' +
                    '   if ( valInd > -1 )' +
                    '   {' +
                    '    var txtValPre = textAreas[i].value.slice(0, valInd );' +
                    '    var txtValPost = textAreas[i].value.slice( valInd + id_img.length, textAreas[i].value.length );' +
                    '    textAreas[i].value = txtValPre + data[0].thumbnail_large + txtValPost;' +
                    '    break;' +
                    '   }' +
                    '  }' +
                    ' }' +
                    '}';
                head.appendChild(script1);
                var commentBox = document.querySelector('a.b-textarea_editor_image');
                if (commentBox) {
                    me.addVideoLink(commentBox);
                }
                $j(document).on('DOMNodeInserted', function(e) {
                    if (e.target.nodeName == "A" && e.target.className.indexOf("b-textarea_editor_image") > -1) {
                        me.addVideoLink(e.target);
                    }
                });
            }
        },
        addVideoLink: function(textareaEditorImage) {
            var me = this;
            var videoLink = document.createElement('a');
            videoLink.href = '#';
            videoLink.textContent = 'Video';
            textareaEditorImage.parentNode.appendChild(document.createTextNode(' '));
            textareaEditorImage.parentNode.appendChild(videoLink);
            $j(videoLink).click(function(e) {
                me.addVideo(e.target);
                e.preventDefault();
                return false;
            });
            var txtArea = textareaEditorImage.parentNode.parentNode.getElementsByTagName('textarea');
            if (txtArea && txtArea.length == 1) {
                if (txtArea[0].getAttribute('id') == null) {
                    txtArea[0].setAttribute('id', new Date().getTime());
                }
            }
        },
        viewarea_size: function() {
            var y = parseInt(((document.compatMode || _$.browser().name == 'ie') && !window.opera) ? (document.compatMode == 'CSS1Compat') ? document.documentElement.clientHeight : document.body.clientHeight : (document.parentWindow || document.defaultView).innerHeight);
            var x = parseInt(((document.compatMode || _$.browser().name == 'ie') && !window.opera) ? (document.compatMode == 'CSS1Compat') ? document.documentElement.clientWidth : document.body.clientWidth : (document.parentWindow || document.defaultView).innerWidth);
            return {
                x: x,
                y: y
            };
        },
        toggle_div: function(name, param) {
            with(document.getElementById(name).style)
            display = (param && param == 1 || display == 'none') ? 'block' : 'none';
        },
        close: function() {
            var me = this;
            var script1 = document.createElement('script');
            script1.type = 'text/javascript';
            script1.textContent = "if(interval){window.clearInterval(interval);}";
            document.body.appendChild(script1);
            $j('#youtube_embed').html("");
            me.toggle_div('youtube_preview', 0);
        },
        insertTag: function(startTag, endTag) {
            var me = this;
            var txtarea = document.getElementById(me.textarea_id);
            txtarea.focus();
            var scrtop = txtarea.scrollTop;
            var cursorPos = me.getCursor(txtarea);
            var txt_pre = txtarea.value.substring(0, cursorPos.start);
            var txt_sel = txtarea.value.substring(cursorPos.start, cursorPos.end);
            var txt_aft = txtarea.value.substring(cursorPos.end);
            if (cursorPos.start == cursorPos.end) {
                var nuCursorPos = cursorPos.start + startTag.length;
            } else {
                var nuCursorPos = String(txt_pre + startTag + txt_sel + endTag).length;
            }
            txtarea.value = txt_pre + startTag + txt_sel + endTag + txt_aft;
            me.setCursor(txtarea, nuCursorPos, nuCursorPos);
            if (scrtop) txtarea.scrollTop = scrtop;
        },
        getCursor: function(input) {
            var result = {
                start: 0,
                end: 0
            };
            if (input.setSelectionRange) {
                result.start = input.selectionStart;
                result.end = input.selectionEnd;
            } else if (!document.selection) {
                return false;
            } else if (document.selection && document.selection.createRange) {
                var range = document.selection.createRange();
                var stored_range = range.duplicate();
                stored_range.moveToElementText(input);
                stored_range.setEndPoint('EndToEnd', range);
                result.start = stored_range.text.length - range.text.length;
                result.end = result.start + range.text.length;
            }
            return result;
        },
        setCursor: function(txtarea, start, end) {
            if (txtarea.createTextRange) {
                var range = txtarea.createTextRange();
                range.move("character", start);
                range.select();
            } else if (txtarea.selectionStart) {
                txtarea.setSelectionRange(start, end);
            }
        },
        yarr: function() {
            var me = this;
            var radios = document.getElementsByName('thumb');
            for (var i = 0; i < radios.length; i++) {
                if (radios[i].checked) {
                    var val = radios[i].value;
                }
            }
            tagpref = '<a href="' + location.protocol + '//www.youtube.com/watch?v=' + me.youtube_id + '&t=' + d3.window.seconds + '">';
            taginf = '<img src="' + location.protocol + '//img.youtube.com/vi/' + me.youtube_id + '/' + val + '.jpg">';
            tagpost = '</a>';
            if (val == 4) {
                me.insertTag(tagpref, tagpost);
            } else {
                me.insertTag(tagpref + taginf + tagpost, '');
            }
            me.close();
        },
        addVideo: function(target) {
            var me = this;
            var url = prompt("Введите URL video с youtube или vimeo", "");
            if (url == null) {
                return false;
            }
            if (url.match(/(youtube\.com|youtu\.be|vimeo\.com)/i) == -1) {
                alert("Поддерживаются только youtube и vimeo видео");
                return false;
            }
            var videoId = me.getVideoId(url);
            var textAreas = target.parentNode.parentNode.getElementsByTagName('textarea');
            if (textAreas && textAreas.length == 1 && videoId != -1) {
                me.textarea_id = textAreas[0].getAttribute('id');
                var head = (document.getElementsByTagName('head')[0] || document.getElementsByTagName('body')[0]);
                if (url.search(/vimeo.com/i) > -1) {
                    var id_img = '#vimeo' + videoId;
                    textAreas[0].value += '<a href="' + url + '"><img src="' + id_img + '"></a>';
                    var url2l = location.protocol + '//vimeo.com/api/v2/video/' + videoId + '.json?callback=vimeoProcessThumb';
                    var script2 = document.createElement('script');
                    script2.type = 'text/javascript';
                    script2.src = url2l;
                    head.appendChild(script2);
                } else {
                    me.youtube_id = videoId;
                    var id = videoId;
                    var inject = "";
                    inject += 'var player; var interval; var seconds = 0; ';
                    inject += 'function onYouTubePlayerReady(playerId) { player=document.getElementById(\'yembed\');';
                    inject += ' interval=setInterval(statechange, 250); };';
                    inject += 'function statechange(){if(player){seconds = Math.round(player.getCurrentTime()); document.getElementById(\'youtube_time\').innerHTML = "Перемотайте на нужное время. Позиция сейчас: "+seconds+" cек. Ссылка будет поставлена именно на эту секунду ролика.";}}';
                    var script3 = document.createElement('script');
                    script3.type = 'text/javascript';
                    script3.textContent = inject;
                    document.body.appendChild(script3);
                    $j('#youtube_embed').html('<object width="311" height="200" id="yobject"><param name="movie" value="' + location.protocol + '//www.youtube.com/v/' + id + '?enablejsapi=1&playerapiid=player"></param><param name="allowFullScreen" value="true"></param><param name="allowScriptAccess" value="always"></param><embed id="yembed" src="' + location.protocol + '//www.youtube.com/v/' + id + '?enablejsapi=1&playerapiid=player" type="application/x-shockwave-flash" allowscriptaccess="always" allowfullscreen="true" width="311" height="200"></embed></object>');
                    temp = "<table><tr><td width=\"150\">";
                    temp += '<label><input type="radio" name="thumb" value="0" style="position:relative; top: -40px;" checked="checked"/><img src="' + location.protocol + '//img.youtube.com/vi/' + id + '/0.jpg" width="120" height="90"/></label>';
                    temp += "</td><td width=\"150\">";
                    temp += '<label><input type="radio" name="thumb" value="1" style="position:relative; top: -40px;" /><img src="' + location.protocol + '//img.youtube.com/vi/' + id + '/1.jpg" width="120" height="90"/></label>';
                    temp += "</td></tr><tr><td>";
                    temp += '<label><input type="radio" name="thumb" value="2" style="position:relative; top: -40px;" /><img src="' + location.protocol + '//img.youtube.com/vi/' + id + '/2.jpg" width="120" height="90"/></label>';
                    temp += "</td><td>";
                    temp += '<label><input type="radio" name="thumb" value="3" style="position:relative; top: -40px;" /><img src="' + location.protocol + '//img.youtube.com/vi/' + id + '/3.jpg" width="120" height="90"/></label>';
                    temp += '</td></tr><tr><td colspan="2"><label><input type="radio" name="thumb" value="4" />Без картинки</label></td></tr></table>';
                    $j('#youtube_thumbs').html(temp);
                    me.toggle_div('youtube_preview', 1);
                    return false;
                }
            }
        },
        getVideoId: function(url) {
            var videoId = -1;
            if ((url.search(/youtube.com/i) > -1) && (url.search(/v=/i) > -1)) {
                videoTime = 0;
                videoId = url.slice(url.search(/v=/i) + 2);
                if (videoId.indexOf('&') > 1) {
                    videoId = videoId.slice(0, videoId.indexOf('&'));
                }
                if (videoId.indexOf('#') > 1) {
                    videoId = videoId.slice(0, videoId.indexOf('#'));
                }
            } else if (url.search(/youtu.be/i) > -1) {
                videoId = url.slice(url.search(/youtu.be/i) + 9);
                if (videoId.indexOf('&') > 1) {
                    videoId = videoId.slice(0, videoId.indexOf('&'));
                }
                if (videoId.indexOf('#') > 1) {
                    videoId = videoId.slice(0, videoId.indexOf('#'));
                }
            } else if (url.search(/vimeo.com/i) > -1) {
                var preVideoId = url.slice(url.search(/vimeo.com/i) + 10);
                if (!isNaN(parseFloat(preVideoId)) && isFinite(preVideoId)) {
                    videoId = preVideoId;
                }
            }
            return videoId;
        },
    });
    d3.addModule({
        type: "Стилизация",
        name: 'Выделять ссылки на подсайты в постах',
        author: 'Aivean',
        variant: ['dirty.ru'],
        config: {
            active: {
                type: 'checkbox',
                value: 0
            },
            style: {
                type: 'select',
                value: "yellow-back",
                caption: 'Стиль выделения:',
                options: {
                    "Рамка": "border",
                    "Фон": "yellow-back"
                }
            }
        },
        styleName: "subsite-link-highlighted",
        styles: {
            'border': "border: 1px solid #888888;\n" + "padding: 0px 2px 1px 2px; text-decoration: none;" + "-webkit-border-radius: 2px; -moz-border-radius: 2px; border-radius: 2px;",
            'yellow-back': "background-color: #E9DFC3;" + "padding: 0px 2px 1px 2px; text-decoration: none;"
        },
        onPost: function(post) {
            var linksInInfo = post.info.get(0).getElementsByTagName('a');
            if (linksInInfo && linksInInfo.length > 1) {
                var href = linksInInfo[1].href;
                if (href.endsWith(".dirty.ru/new") || href.endsWith(".dirty.ru/") || href.endsWith(".dirty.ru")) {
                    linksInInfo[1].setAttribute('style', this.styles[this.config.style.value]);
                }
            }
        }
    });
    d3.addModule({
        type: "Социализм",
        name: 'Жепки',
        author: 'Aivean',
        variant: ['dirty.ru'],
        config: {
            active: {
                type: 'checkbox',
                value: 0
            },
            rating: {
                caption: 'Показывать жепки с рейтингом:',
                type: 'select',
                value: 0,
                options: {
                    "Любым": -32000,
                    "Ноль и больше": -1,
                    "Больше 0": 0,
                    "Больше 5": 5,
                    "Больше 10": 10
                }
            }
        },
        className: 'zhepka',
        underratedClassName: 'zh-underrated',
        containerClassName: 'zheps-container',
        zheps: [],
        zhepsContainer: null,
        run: function() {
            $j("<style type='text/css'> \n\
    ." + this.className + " { \n\
      margin: 0 0 4px;\n\
      padding: 2px 3px;\n\
      background-color: #f8eebe;\n\
     border-bottom: 1px solid #E0E0E0;\n\
     border-right: 1px solid #E0E0E0;\n\
     white-space: nowrap;\n\
    } \n\
    ." + this.className + "." + this.underratedClassName + " { \n\
     opacity: 0.5;\n\
     background-color: #f5f5f5;\n\
    } \n\
    ." + this.className + " span {\n\
     opacity: 0.2; \n\
    }\n\
    ." + this.containerClassName + " {\n\
     margin-top: 0;\n\
     padding: 0;\n\
    }\n\
    .dd ." + this.containerClassName + ".b-post_tags a.tag {\n\
      background-color: #f8eebe;\n\
    }\n\
   </style>").appendTo('head');
            this.zhepsContainer = $j('<ul class="' + this.containerClassName + ' b-post_tags"></ul>').appendTo("#js-tags_public");
        },
        redrawZheps: function() {
            var elements = [];
            for (var el in this.zheps) {
                if (this.zheps[el].text == undefined) continue;
                elements.push(this.zheps[el]);
            }
            elements.sort(function(a, b) {
                return b.rating - a.rating;
            });
            if (elements.length == 1) {
                this.zhepsContainer.parents(".hidden").removeClass("hidden");
            }
            var me = this;
            this.zhepsContainer.empty();
            elements.forEach(function(zhep) {
                if (!zhep.element) {
                    zhep.element = $j('<li><a class="tag" href="#' + zhep.id + '">' + zhep.text + '</a></li>');
                }
                zhep.element.appendTo(me.zhepsContainer);
                me.zhepsContainer.append(" ");
            });
        },
        addZhepka: function(zhepka, rating, commentId) {
            if (!this.zheps[zhepka]) {
                this.zheps[zhepka] = {
                    "text": zhepka,
                    "rating": rating,
                    "id": commentId
                };
            } else {
                this.zheps[zhepka].rating += rating;
            }
            this.redrawZheps();
        },
        validComment: function(comment) {
            var content = comment.getContentText();
            return content.indexOf("[x]") != -1 || content.indexOf("[X]") != -1 || content.indexOf("[х]") != -1 || content.indexOf("[Х]") != -1;
        },
        onComment: function(comment) {
            if (!this.validComment(comment)) return;
            var underrated = comment.ratingValue() <= this.config.rating.value;
            var html = comment.getContent().html();
            var r = /([^:\s\.><][\wа-яёЁ\-–—\s!%\?,]+?)\s?\[[хx]\]/gi;
            html = html.replace(/(\&nbsp;)/gi, ' ');
            var match;
            var found = [];
            while (match = r.exec(html)) {
                found.push({
                    "text": match[1],
                    "all": match[0]
                });
            }
            var processed = [];
            if (found.length) {
                var me = this;
                found.forEach(function(f) {
                    var r2 = new RegExp(RegExp.escape(f.all));
                    html = html.replace(r2, '<span class="' + me.className +
                        (underrated ? " " + me.underratedClassName : "") + '">' + f.text + ' <span>[x]</span></span>');
                    if (!underrated && !processed[f.text]) {
                        me.addZhepka(f.text, comment.ratingValue(), comment.id);
                        processed[f.text] = true;
                    }
                });
                comment.getContent().html(html);
            }
        }
    });
    d3.addModule({
        type: "Сервис-пак",
        name: 'Линк на последнюю версию',
        author: 'crimaniak',
        config: {
            checkUpdates: {
                type: 'checkbox',
                value: 0,
                caption: 'проверять наличие новых версий',
                description: 'Если эта опция активна, время от времени сервис-пак проверяет наличие обновлений и сообщает о них, а также спрашивает разрешение на обновление.'
            },
            ver: {
                type: 'html',
                value: 'Текущая версия: ' + d3.buildNumber + ' ' + d3.buildMode + ' от ' + d3.buildTime
            },
            link: {
                type: 'html',
                value: '<a href="https://github.com/crimaniak/dirty-on-steroids/raw/master/result/d3.user.js">Установить последнюю версию скрипта</a>'
            }
        },
        lastCheckName: 'lastUpdateCheck',
        interval: 3600000 * 6,
        jsonLink: 'https://api.github.com/repos/crimaniak/dirty-on-steroids/contents/result/pack.version.json?callback=checkUpdate',
        run: function() {
            if (!this.config.checkUpdates.value) return;
            var lastCheck = d3.storage.get(this.lastCheckName, {
                time: 0,
                result: ''
            });
            var now = Date.now();
            var me = this;
            if (now > lastCheck.time + this.interval) {
                window.addEventListener('update-info', function(event) {
                    me.updateListener(event);
                });
                d3.service.embedScript(" \
   checkUpdate = function(data) { \
    var content = data.data.content.replace(/\\s/g, ''); \
    var contentDecoded = JSON.parse(atob(content));\
    var event;\
    if (document.createEvent) {\
     event = document.createEvent('CustomEvent');\
     event.initCustomEvent(\
     'update-info',  \
     false,\
     false,\
     contentDecoded\
     );\
     event.eventName = 'update-info';\
     event.buildInfo = contentDecoded || { };\
     event.data = contentDecoded || { };\
     window.dispatchEvent(event);\
    }\
   }; \
  ");
                d3.service.attachScript(this.jsonLink);
            }
        },
        updateListener: function(event) {
            var now = Date.now();
            var buildTime = event.detail.buildTime;
            if (!buildTime || buildTime == undefined) {
                if (console) console.log("Undefined build time received!", event);
            }
            d3.storage.set(this.lastCheckName, {
                time: now,
                result: buildTime
            });
            if (buildTime > d3.buildTime && confirm('Доступна новая версия сервис-пака. Попробуем поставить?')) {
                document.location = 'https://github.com/crimaniak/dirty-on-steroids/raw/master/result/d3.user.js';
            }
        }
    });
    d3.addModule({
        type: "Социализм",
        name: 'Выделение пользователей',
        author: 'Aivean',
        newUsers: 0,
        oldUsers: 0,
        variant: ['dirty.ru', 'leprosorium.ru'],
        config: {
            active: {
                type: 'checkbox',
                value: 0
            },
            oldskool: {
                type: 'checkbox',
                caption: 'Показывать олдскульность поста',
                value: 0
            },
            style: {
                type: 'radio',
                caption: 'Стиль:',
                options: {
                    "Звездочка": 0,
                    "ID целиком": 1,
                    "ID целиком через |": 2
                },
                value: 0
            },
            idThreshold: {
                type: 'text',
                caption: 'Выделять ID пользователя больше ',
                value: '37194'
            }
        },
        run: function() {
            this.idParsed = parseInt(this.config.idThreshold.value);
            this.styleInt = parseInt(this.config.style.value);
        },
        mark: function(user, userId) {
            if (!user.data('marked')) {
                switch (this.styleInt) {
                    case 0:
                        user.after(" <sup>*</sup>");
                        break;
                    case 1:
                        user.after(" <sup>" + userId + "</sup>");
                        break;
                    case 2:
                        user.after(" <span style='padding-left:0.5em;'> | " + userId + "</span>");
                        break;
                }
                user.data('marked', true);
            }
        },
        processElement: function(userId, footer) {
            if (userId > this.idParsed) {
                this.mark($j("a.c_user", footer), userId);
                this.newUsers++;
            } else {
                this.oldUsers++;
            }
        },
        onComment: function(comment) {
            this.processElement(comment.userId, comment.getFooter());
        },
        onPost: function(post) {
            this.processElement(post.userId, post.getFooter());
        },
        onCommentsUpdated: function(comment) {
            if (this.config.oldskool.value == 1) {
                var headerInner = document.querySelector('div.b-comments_controls_new_nav');
                if (headerInner) {
                    var oldskval = Number((100 / (this.newUsers + this.oldUsers)) * this.oldUsers).toFixed(2);
                    var newSpan = document.createElement('div');
                    newSpan.setAttribute('style', 'padding: 0px 7px 0px 7px;');
                    newSpan.setAttribute('class', 'b-comments_controls_sort');
                    newSpan.appendChild(document.createTextNode('oldsk: ' + oldskval + ' '));
                    headerInner.appendChild(newSpan);
                }
            }
        }
    });
    d3.addModule({
        type: "Содержание",
        name: 'Порог комментариев',
        author: 'bearoff',
        config: {
            active: {
                type: 'checkbox',
                value: true,
                description: 'Добавляет выпадающий список, который позволяет скрывать комментарии с низким рейтингом. Рейтинги в списке хитро рассчитываются для каждого поста индивидуально. Комментарии со спрятанным рейтингом показываются всегда.'
            },
            beFast: {
                type: 'checkbox',
                value: true,
                caption: 'Работать очень быстро (кнопка "новые" не будет работать)',
                description: 'Самая важная опция. Быстрый способ работает на порядок быстрее, чем медленный. Это становится заметно в постах от сотни комментариев. Однако быстрый способ ломает кнопки _все комментарии_/_новые_. Если для вас это не критично — смело используйте эту опцию.'
            },
            optionsCount: {
                type: 'text',
                value: '10',
                caption: 'Количество опций: ',
                description: 'Cколько опций будет в ниспадающем меню. Когда комментариев в посте мало, опций может быть меньше, чем это значение.'
            },
            defaultOption: {
                type: 'text',
                value: '0',
                caption: 'Опция по умолчанию: ',
                description: 'Какая опция применится сразу после того, как вы откроете пост.'
            },
            saveSelectedOption: {
                type: 'checkbox',
                value: false,
                caption: 'Использовать опцию, выбранную на странице, вместо умолчания',
                description: 'Если поставить тут галочку, то вместо опции по умолчанию будет использоваться та опция, которую вы последний раз выбрали в ниспадающем меню.'
            },
            minCommentsCount: {
                type: 'text',
                value: '5',
                caption: 'Минимум комментариев для работы: ',
                description: 'Если в посте будет меньше комментариев, чем значение этого параметра, трешхолд не появится на странице.'
            },
            alwaysShowRepliesToMe: {
                type: 'checkbox',
                value: true,
                caption: 'Не скрывать ответы мне',
                description: 'Всегда показывать ответы на ваши комментарии. Ваши комментарии показываются всегда.'
            }
        },
        threshold: 0,
        variant: ['dirty.ru', 'leprosorium.ru', 'reddit.com', 'habrahabr.ru'],
        select: null,
        min_rating: 0,
        max_rating: 0,
        selected_index: 0,
        select_properties: {
            thresholds: [],
            selected_strings: [],
            counts: []
        },
        sorted_comments: {},
        always_visible_count: 0,
        hidden_rating_count: 0,
        my_comments: {},
        visible_parents: {},
        run: function() {
            if (!d3.page.postComments || !d3.content.comments.length || d3.content.comments.length < parseInt(this.config.minCommentsCount.value)) {
                return false;
            }
            if (this.config.saveSelectedOption.value) {
                this.selected_index = d3.storage.get('commentsSelectedThreshold');
                if (!this.selected_index) {
                    this.selected_index = 0;
                }
            } else {
                this.selected_index = parseInt(this.config.defaultOption.value);
                if (this.selected_index < 0) {
                    this.selected_index = 0;
                }
            }
            this.getStats();
            this.prepareThresholds();
            this.updateVisibility(false);
            this.displaySelect();
            if (d3.content.variant === "dirty.ru") {
                this.initFixSidebarFixer();
                this.fixSidebar();
            }
        },
        displaySelect: function() {
            var me = this;
            var extra_style = "";
            if (d3.content.variant == "dirty.ru") {
                var header_div = $j("div.b-comments_controls_new_nav");
            } else if (d3.content.variant == "leprosorium.ru") {
                header_div = $j("div.b-comments_controls");
            } else if (d3.content.variant == "reddit.com") {
                header_div = $j(".thing p.tagline:first");
            } else if (d3.content.variant == "habrahabr.ru") {
                header_div = $j(".comments_list .title");
                extra_style = "font-size: 16px;"
            }
            var select_div = $j('<div id="advansed_treshhold_div" style="display:inline;margin-left:5px;margin-right:5px;"></div>');
            var select_width = this.hidden_rating_count ? 200 : 180;
            this.select = $j('<select id="advansed_treshhold" style="width:' + select_width + 'px;' + extra_style + '"></select>');
            select_div.append(this.select);
            header_div.append(select_div);
            for (var i = 0; i < this.select_properties.thresholds.length; i++) {
                var visible_count = this.always_visible_count + this.select_properties.counts[i];
                var hidden_part = this.hidden_rating_count ? (this.hidden_rating_count + '+') : '';
                if (this.hidden_rating_count) {
                    visible_count = visible_count - this.hidden_rating_count;
                }
                var option_title = i + ': Больше ' + this.select_properties.thresholds[i] + " (" + hidden_part + visible_count + ")";
                var option = $j('<option id="advthresh_' + i +
                    '" value="' + this.select_properties.thresholds[i] +
                    '" ' + this.select_properties.selected_strings[i] + '>' +
                    option_title +
                    '</option>');
                this.select.append(option);
            }
            this.select.change(function(e) {
                me.onThresholdChange();
            });
        },
        showWithParents: function(comment_container) {
            if (d3.content.variant === "habrahabr.ru") {
                comment_container = comment_container.find("> .comment_body");
                var parent_link = comment_container.find(".icon_comment-parent");
                var parent_id = parent_link.length ? "comment_" + parent_link.data('parent_id') : "";
            } else {
                parent_id = comment_container.attr("data-parent_comment_id");
            }
            comment_container.show();
            if (!parent_id) {
                return;
            }
            var parent = $j("#" + parent_id);
            this.showWithParents(parent);
        },
        fixParentLink: function(comment) {
            if (!comment.parentId) {
                return;
            }
            var parent_selector = ".c_parent";
            if (d3.content.variant === "habrahabr.ru") {
                parent_selector = ".js-comment_parent";
            }
            var parentLink = $j(parent_selector, comment.container);
            var parent = $j("#" + comment.parentId);
            var me = this;
            parentLink.click(function() {
                me.showWithParents(parent);
            });
        },
        getStats: function() {
            for (var i = 0; i < d3.content.comments.length; i++) {
                var rating = d3.content.comments[i].ratingValue();
                this.fixParentLink(d3.content.comments[i]);
                if (isNaN(rating) || null === rating) {
                    continue;
                }
                if (this.sorted_comments[rating] === undefined) {
                    this.sorted_comments[rating] = [];
                }
                this.sorted_comments[rating].push(i);
                if (this.min_rating > rating) {
                    this.min_rating = rating;
                }
                if (this.max_rating < rating) {
                    this.max_rating = rating;
                }
            }
        },
        prepareThresholds: function() {
            var comments_count = d3.content.comments.length;
            var rest_count = comments_count;
            var options_left = this.config.optionsCount.value;
            var curr_step = Math.floor(comments_count / options_left);
            var curr_i = -1;
            var curr_thresh_count = 0;
            var curr_thresh_value = null;
            for (var i = this.min_rating; i <= this.max_rating; i++) {
                if (this.sorted_comments[i] === undefined) {
                    continue;
                }
                if (curr_thresh_value === null) {
                    curr_thresh_value = i;
                }
                curr_thresh_count += this.sorted_comments[i].length;
                if (curr_thresh_count >= curr_step) {
                    curr_i++;
                    this.select_properties.counts[curr_i] = rest_count;
                    this.select_properties.thresholds[curr_i] = curr_thresh_value;
                    this.select_properties.selected_strings[curr_i] = '';
                    rest_count = rest_count - curr_thresh_count;
                    curr_thresh_count = 0;
                    curr_thresh_value = null;
                    options_left--;
                    if (!options_left) {
                        break;
                    }
                    curr_step = Math.floor(rest_count / options_left);
                }
            }
            if (this.selected_index > curr_i) {
                this.selected_index = curr_i;
            }
            this.select_properties.selected_strings[this.selected_index] = 'selected';
            this.threshold = this.select_properties.thresholds[this.selected_index];
        },
        updateCounts: function(rating_value, visible) {
            for (var i = 0; i < this.select_properties.thresholds.length; i++) {
                if (visible || rating_value >= this.select_properties.thresholds[i]) {
                    this.select_properties.counts[i]++;
                } else {
                    return;
                }
            }
        },
        isReplyToMe: function(comment) {
            return comment.parentId && this.my_comments[comment.parentId];
        },
        isVisible: function(comment) {
            if (comment.isMine) {
                this.always_visible_count++;
                this.my_comments[comment.id] = comment.id;
                return true;
            }
            if (this.config.alwaysShowRepliesToMe.value && this.isReplyToMe(comment)) {
                this.always_visible_count++;
                return true;
            }
            var rating = comment.ratingValue();
            if (rating === null) {
                this.hidden_rating_count++;
                return true;
            }
            if (rating >= this.threshold) {
                return true;
            }
            return false;
        },
        updateVisibility: function(first) {
            var show = this.config.beFast.value ? function(item) {
                item.css('display', 'block');
            } : function(item) {
                item.show();
            };
            var hide = this.config.beFast.value ? function(item) {
                item.css('display', 'none');
            } : function(item) {
                item.hide();
            };
            this.visible_parents = {};
            for (var i = 0; i < d3.content.comments.length; i++) {
                var comment = d3.content.comments[i];
                var isVisible = this.isVisible(comment);
                (isVisible ? show : hide)(comment.container);
                if (d3.content.variant === "reddit.com" && isVisible && comment.parentId) {
                    this.visible_parents[comment.parentId.replace("#", "thing_t1_")] = true;
                }
                if (first) {
                    this.updateCounts(comment.ratingValue(), isVisible);
                }
            }
            if (d3.content.variant === "reddit.com") {
                for (var key in this.visible_parents) {
                    var comm = $j("#" + key);
                    if (!comm.is(":visible")) {
                        show(comm);
                        comm.removeClass("collapsed");
                        var parents = comm.parents();
                        parents.filter(".collapsed").removeClass("collapsed");
                        show(parents.filter(":not(:visible)"));
                    }
                }
            }
        },
        onThresholdChange: function() {
            this.selected_index = this.select.find(':selected').attr('id').split('_')[1];
            if (this.config.saveSelectedOption.value) {
                d3.storage.set('commentsSelectedThreshold', this.selected_index);
            }
            this.threshold = this.select.val();
            this.updateVisibility(false);
        },
        fixSidebarTimeout: null,
        fSidebarRemoved: false,
        initFixSidebarFixer: function() {
            var me = this;
            $j(window).scroll(function() {
                me.fixSidebar();
            }).resize(function() {
                me.fixSidebar();
            });
        },
        fixSidebar: function() {
            if (this.fSidebarRemoved) {
                return;
            }
            clearTimeout(this.fixSidebarTimeout);
            this.fixSidebarTimeout = setTimeout(function() {
                var sidebar = $j(".b-right_sidebar.sidebar");
                var sidebar_down = sidebar.offset().top + sidebar.outerHeight();
                var controls_top = $j(".b-comments_controls").offset().top;
                var diff = sidebar_down - controls_top;
                if (diff < 100) {
                    sidebar.remove();
                    this.fSidebarRemoved = true;
                }
            }, 200);
        }
    });
    d3.addModule({
        type: "Содержание",
        name: 'Порог постов',
        author: 'bearoff',
        config: {
            active: {
                type: 'checkbox',
                value: true,
                description: 'Добавляет выпадающий список, который позволяет скрывать посты с низким рейтингом и небольшим количеством комментариев. Рейтинги в списке хитро рассчитываются каждый раз заново. Не влияет на динамически подгруженные посты (по кнопке "ещё посты"). Посты со спрятанным рейтингом всегда показываются.'
            },
            optionsCount: {
                type: 'text',
                value: '10',
                caption: 'Количество опций: ',
                description: 'Cколько опций будет в ниспадающем меню. Когда комментариев в посте мало, опций может быть меньше, чем это значение.'
            },
            defaultOption: {
                type: 'text',
                value: '0',
                caption: 'Опция по умолчанию: ',
                description: 'Какая опция применится сразу после того, как вы откроете главную.'
            },
            checkComments: {
                type: 'checkbox',
                value: true,
                caption: 'Учитывать комментарии',
                description: 'Не скрывать посты с бОльшим, чем указано, количеством комментариев'
            },
            commentsCount: {
                type: 'text',
                value: '20',
                caption: 'Количество комментариев: ',
                description: 'Работает, если стоит галочка "Учитывать комментарии"'
            },
            saveSelectedOption: {
                type: 'checkbox',
                value: false,
                caption: 'Использовать опцию, выбранную на странице, вместо умолчания',
                description: 'Если поставить тут галочку, то вместо опции по умолчанию будет использоваться та опция, которую вы последний раз выбрали в ниспадающем меню.'
            }
        },
        threshold: 0,
        variant: ['dirty.ru'],
        select: null,
        min_rating: 0,
        max_rating: 0,
        selected_index: 0,
        select_properties: {
            thresholds: [],
            selected_strings: [],
            counts: []
        },
        sorted_posts: {},
        always_visible_count: 0,
        hidden_rating_count: 0,
        initial_posts_count: 0,
        reset_timeout: null,
        my_posts: {},
        run: function() {
            if (!d3.content.posts.length || d3.page.user || d3.page.f_search) {
                return false;
            }
            this.initial_posts_count = d3.content.posts.length;
            if (this.config.saveSelectedOption.value) {
                this.selected_index = d3.storage.get('postsSelectedThreshold');
                if (!this.selected_index) {
                    this.selected_index = 0;
                }
            } else {
                this.selected_index = parseInt(this.config.defaultOption.value);
                if (this.selected_index < 0) {
                    this.selected_index = 0;
                }
            }
            this.getStats();
            this.prepareThresholds();
            this.updateVisibility(false);
            this.addResetLink();
            this.displaySelect();
        },
        displaySelect: function() {
            var comments_part = '';
            var select_width = 130;
            if (this.config.checkComments.value) {
                comments_part = ' или ' + this.config.commentsCount.value + ' комм.';
                select_width = 210;
            }
            if (this.hidden_rating_count) {
                select_width = select_width + 30;
            }
            var me = this;
            var header_div = $j(".b-blog_nav_sort");
            var select_div = $j('<div id="advansed_treshhold_div" style="display:inline;margin-left:5px;margin-right:5px;"></div>');
            this.select = $j('<select id="advansed_treshhold" style="width:' + select_width + 'px;font-size:15px;"></select>');
            select_div.append(this.select);
            header_div.after(select_div);
            for (var i = 0; i < this.select_properties.thresholds.length; i++) {
                var visible_count = this.always_visible_count + this.select_properties.counts[i];
                var hidden_part = this.hidden_rating_count ? (this.hidden_rating_count + '+') : '';
                if (this.hidden_rating_count) {
                    visible_count = visible_count - this.hidden_rating_count;
                }
                var option_title = i + ': Рейт ' + this.select_properties.thresholds[i] + comments_part + " (" + hidden_part + visible_count + ")";
                var option = $j('<option id="advthresh_' + i +
                    '" value="' + this.select_properties.thresholds[i] +
                    '" ' + this.select_properties.selected_strings[i] + '>' +
                    option_title +
                    '</option>');
                this.select.append(option);
            }
            this.select.change(function(e) {
                me.onThresholdChange();
            });
        },
        addResetLink: function() {
            var header_div = $j(".b-blog_nav_sort");
            var reset_link = $j("<a href='javascript:void(0);' style = 'position: fixed; top: 10px; left: 10px'>R<span></span></a>");
            header_div.after(reset_link);
            var me = this;
            reset_link.click(function() {
                me.resetFilter(reset_link);
            });
            $j(document).on('d3_sp_new_posts', function(event) {
                clearTimeout(me.reset_timeout);
                me.reset_timeout = setTimeout(function() {
                    me.resetFilter(reset_link);
                }, 200);
            });
        },
        resetFilter: function(reset_link) {
            var me = this;
            me.threshold = 0;
            me.hidden_rating_count = me.always_visible_count = me.min_rating = me.max_rating = 0;
            me.select = null;
            me.select_properties = {
                thresholds: [],
                selected_strings: [],
                counts: []
            };
            me.sorted_posts = this.my_posts = {};
            $j("#advansed_treshhold_div").remove();
            me.getStats();
            me.prepareThresholds();
            me.updateVisibility(false);
            me.displaySelect();
            var new_count = d3.content.posts.length;
            var diff = new_count - this.initial_posts_count;
            this.initial_posts_count = d3.content.posts.length;
            reset_link.find("span").text(" (+" + diff + ")").show().fadeOut(5000);
        },
        getStats: function() {
            for (var i = 0; i < d3.content.posts.length; i++) {
                var rating = parseInt(d3.content.posts[i].ratingValue());
                if (isNaN(rating)) {
                    continue;
                }
                if (this.sorted_posts[rating] === undefined) {
                    this.sorted_posts[rating] = [];
                }
                this.sorted_posts[rating].push(i);
                if (this.min_rating > rating) {
                    this.min_rating = rating;
                }
                if (this.max_rating < rating) {
                    this.max_rating = rating;
                }
            }
        },
        prepareThresholds: function() {
            var posts_count = d3.content.posts.length;
            var rest_count = posts_count;
            var options_left = this.config.optionsCount.value;
            var curr_step = Math.floor(posts_count / options_left);
            var curr_i = -1;
            var curr_thresh_count = 0;
            var curr_thresh_value = null;
            for (var i = this.min_rating; i <= this.max_rating; i++) {
                if (this.sorted_posts[i] === undefined) {
                    continue;
                }
                if (curr_thresh_value === null) {
                    curr_thresh_value = i;
                }
                curr_thresh_count += this.sorted_posts[i].length;
                if (curr_thresh_count >= curr_step) {
                    curr_i++;
                    this.select_properties.counts[curr_i] = rest_count;
                    this.select_properties.thresholds[curr_i] = curr_thresh_value;
                    this.select_properties.selected_strings[curr_i] = '';
                    rest_count = rest_count - curr_thresh_count;
                    curr_thresh_count = 0;
                    curr_thresh_value = null;
                    options_left--;
                    if (!options_left) {
                        break;
                    }
                    curr_step = Math.floor(rest_count / options_left);
                }
            }
            if (this.selected_index > curr_i) {
                this.selected_index = curr_i;
            }
            this.select_properties.selected_strings[this.selected_index] = 'selected';
            this.threshold = this.select_properties.thresholds[this.selected_index];
        },
        updateCounts: function(rating_value, visible) {
            for (var i = 0; i < this.select_properties.thresholds.length; i++) {
                if (visible || rating_value >= this.select_properties.thresholds[i]) {
                    this.select_properties.counts[i]++;
                } else {
                    return;
                }
            }
        },
        isVisible: function(post) {
            if (post.isMine) {
                this.always_visible_count++;
                this.my_posts[post.id] = post.id;
                return true;
            }
            var rating = post.ratingValue();
            if (rating === null) {
                this.hidden_rating_count++;
                return true;
            }
            if (rating >= this.threshold) {
                return true;
            }
            if (this.config.checkComments.value && post.commentsCount() >= this.config.commentsCount.value) {
                return true;
            }
            return false;
        },
        updateVisibility: function(first) {
            var show = function(item) {
                item.css('display', 'block');
            };
            var hide = function(item) {
                item.css('display', 'none');
            };
            for (var i = 0; i < d3.content.posts.length; i++) {
                var post = d3.content.posts[i];
                var isVisible = this.isVisible(post);
                (isVisible ? show : hide)(post.container);
                if (first) {
                    this.updateCounts(post.ratingValue(), isVisible);
                }
            }
        },
        onThresholdChange: function() {
            this.selected_index = this.select.find(':selected').attr('id').split('_')[1];
            if (this.config.saveSelectedOption.value) {
                d3.storage.set('postsSelectedThreshold', this.selected_index);
            }
            this.threshold = this.select.val();
            this.updateVisibility(false);
        }
    });
    d3.addModule({
        type: "Социализм",
        name: 'Статистика по комментариям',
        author: 'crea7or',
        variant: ['leprosorium.ru'],
        config: {
            active: {
                type: 'checkbox',
                value: 0
            }
        },
        usersArray: new Array(),
        onComment: function(comment) {
            var userObject = this.findElement(comment.userName);
            var elemArray = comment.getFooter().get(0).querySelectorAll('a.c_user');
            for (var i = 0; i < elemArray.length; i++) {
                if (elemArray[i].previousSibling.nodeValue.indexOf('Написала') > -1) {
                    userObject.gend = 1;
                } else {
                    userObject.gend = 0;
                }
                elemArray[i].style.textDecoration = 'none';
                userObject.comms++;
                userObject.size += $j('.c_body', comment.container)[0].innerHTML.length;;
                userObject.score += parseInt($j('.vote_result', comment.container)[0].innerHTML, 10);;
            }
        },
        findElement: function(name) {
            for (var i = 0; i < this.usersArray.length; i++) {
                if (this.usersArray[i].name == name) {
                    return this.usersArray[i];
                }
            }
            var obj = {
                name: name,
                comms: 0,
                size: 0,
                score: 0,
                gend: 0
            };
            this.usersArray.push(obj);
            return obj;
        },
        run: function() {
            var head = (document.getElementsByTagName('head')[0] || document.getElementsByTagName('body')[0]);
            var script1 = document.createElement('script');
            script1.type = 'text/javascript';
            script1.textContent = 'var people, asc1 = 1, asc2 = 1, asc3 = 1;' +
                ' function sort_table(tbody, col, asc, digit){' +
                'var rows = tbody.rows, rlen = rows.length, arr = new Array(), i, j, cells, clen;' +
                'for(i = 0; i < rlen; i++){' +
                'cells = rows[i].cells;' +
                'clen = cells.length;' +
                'arr[i] = new Array();' +
                'for(j = 0; j < clen; j++){' +
                'arr[i][j] = cells[j].innerHTML;' +
                '}}' +
                'if ( digit == 0 ){' +
                'arr.sort(function(a, b){' +
                'return (a[col].toUpperCase() == b[col].toUpperCase()) ? 0 : ((a[col].toUpperCase() > b[col].toUpperCase()) ? asc : -1*asc);' +
                '});' +
                '}' +
                'if ( digit == 1 ){' +
                'arr.sort(function(a, b){' +
                'return (parseInt(a[col], 10) == parseInt(b[col], 10)) ? 0 : ((parseInt(a[col], 10) > parseInt(b[col], 10)) ? asc : -1*asc);' +
                '});' +
                '}' +
                'for(i = 0; i < rlen; i++){' +
                'arr[i] = "<td>"+arr[i].join("</td><td>")+"</td>";' +
                '}' +
                'tbody.innerHTML = "<tr>"+arr.join("</tr><tr>")+"</tr>";' +
                '}';
            head.appendChild(script1);
        },
        onCommentsUpdated: function() {
            headerPlace = document.querySelector('div.l-content_aside');
            if (headerPlace) {
                tct = document.getElementById('topcharttable');
                if (tct == null) {
                    newDiv = document.createElement('div');
                    newDiv.setAttribute('id', 'topcharttable');
                    newTable = document.createElement('table');
                    newTable.setAttribute('cellspacing', 2);
                    newTable.setAttribute('cellpadding', 2);
                    newTable.setAttribute('width', '95%');
                    newTable.setAttribute('align', 'center');
                    newTable.setAttribute('style', 'table-layout: fixed; font-size: 10px; color: #666;');
                    newTableHead = document.createElement('thead');
                    newTableHead.setAttribute('style', 'text-decoration: underline; cursor: pointer;');
                    newTr = document.createElement('tr');
                    newTh = document.createElement('th');
                    newTh.setAttribute('onclick', 'sort_table(topchart, 0, asc1, 0); asc1 *= -1; asc2 = 1; asc3 = 1;');
                    newTh.setAttribute('style', 'width: 85px; text-align: left; max-width: 85px; overflow: hidden; text-overflow: ellipsis;');
                    newTh.appendChild(document.createTextNode('имя'));
                    newTr.appendChild(newTh);
                    newTh = document.createElement('th');
                    newTh.setAttribute('onclick', 'sort_table(topchart, 1, asc1, 1); asc1 *= -1; asc2 = 1; asc3 = 1;');
                    newTh.setAttribute('style', 'width: 30px; text-align: left;');
                    newTh.appendChild(document.createTextNode('ком.'));
                    newTr.appendChild(newTh);
                    newTh = document.createElement('th');
                    newTh.setAttribute('onclick', 'sort_table(topchart, 2, asc1, 1); asc1 *= -1; asc2 = 1; asc3 = 1;');
                    newTh.setAttribute('style', 'width: 50px; text-align: left;');
                    newTh.appendChild(document.createTextNode('симв.'));
                    newTr.appendChild(newTh);
                    newTh = document.createElement('th');
                    newTh.setAttribute('onclick', 'sort_table(topchart, 3, asc1, 1); asc1 *= -1; asc2 = 1; asc3 = 1;');
                    newTh.setAttribute('style', 'width: 50px; text-align: left;');
                    newTh.appendChild(document.createTextNode('+/-'));
                    newTr.appendChild(newTh);
                    newTableHead.appendChild(newTr);
                    newTable.appendChild(newTableHead);
                    newTableBody = document.createElement('tbody');
                    newTableBody.setAttribute('id', 'topchart');
                    maleComments = 0;
                    femaleComments = 0;
                    maleCommentsSize = 0;
                    femaleCommentsSize = 0;
                    males = 0;
                    females = 0;
                    totalSize = 0;
                    totalScore = 0;
                    for (var i = 0; i < this.usersArray.length; i++) {
                        newTr = document.createElement('tr');
                        newTd = document.createElement('td');
                        newA = document.createElement('a');
                        newA.setAttribute('href', '/users/' + this.usersArray[i].name);
                        newA.appendChild(document.createTextNode(this.usersArray[i].name));
                        newTd.setAttribute('style', 'width: 85px; max-width: 85px; overflow: hidden; text-overflow: ellipsis;');
                        newTd.appendChild(newA);
                        newTr.appendChild(newTd);
                        newTd = document.createElement('td');
                        newTd.appendChild(document.createTextNode(this.usersArray[i].comms));
                        newTr.appendChild(newTd);
                        newTd = document.createElement('td');
                        newTd.appendChild(document.createTextNode(this.usersArray[i].size));
                        newTr.appendChild(newTd);
                        newTd = document.createElement('td');
                        newTd.appendChild(document.createTextNode(this.usersArray[i].score));
                        newTr.appendChild(newTd);
                        newTableBody.appendChild(newTr);
                        if (this.usersArray[i].gend == 0) {
                            males++;
                            maleComments += this.usersArray[i].comms;
                            maleCommentsSize += this.usersArray[i].size;
                        } else {
                            females++;
                            femaleComments += this.usersArray[i].comms;
                            femaleCommentsSize += this.usersArray[i].size;
                        }
                        totalSize += this.usersArray[i].size;
                        totalScore += this.usersArray[i].score;
                    }
                    newTable.appendChild(newTableBody);
                    statDiv = document.createElement('div');
                    statDiv.setAttribute('style', 'width: 220px; padding: 10px; font-size: 10px; color: #666;');
                    statDiv.appendChild(document.createTextNode('Статистика по комментариям:'));
                    statDiv.appendChild(document.createElement('br'));
                    statDiv.appendChild(document.createElement('br'));
                    statDiv.appendChild(document.createTextNode('мальчики: ' + males));
                    statDiv.appendChild(document.createElement('br'));
                    statDiv.appendChild(document.createTextNode('комментариев: ' + maleComments));
                    statDiv.appendChild(document.createElement('br'));
                    statDiv.appendChild(document.createTextNode('общим размером: ' + maleCommentsSize));
                    statDiv.appendChild(document.createElement('br'));
                    statDiv.appendChild(document.createTextNode('девочки: ' + females));
                    statDiv.appendChild(document.createElement('br'));
                    statDiv.appendChild(document.createTextNode('комментариев: ' + femaleComments));
                    statDiv.appendChild(document.createElement('br'));
                    statDiv.appendChild(document.createTextNode('общим размером: ' + femaleCommentsSize));
                    statDiv.appendChild(document.createElement('br'));
                    statDiv.appendChild(document.createTextNode('Всего написано символов: ' + totalSize));
                    statDiv.appendChild(document.createElement('br'));
                    statDiv.appendChild(document.createTextNode('Общая оценка: ' + totalScore));
                    newDiv.appendChild(statDiv);
                    newDiv.appendChild(document.createElement('br'));
                    newDiv.appendChild(newTable);
                    headerPlace.appendChild(newDiv);
                }
            }
        },
    });
    d3.addModule({
        type: "Социализм",
        name: '(Gold d3) Узнать немного нового о себе',
        author: 'bearoff',
        config: {
            active: {
                type: 'checkbox',
                value: false,
                description: 'Позволяет просмотреть все комментарии о вас от других пользователей (если у вас есть Gold d3 - появится ссылка "Читать всё")'
            }
        },
        threshold: 0,
        variant: ['dirty.ru'],
        notes_array: [],
        current_note: '',
        started: false,
        timeout: null,
        user_id: 0,
        run: function() {
            if (!d3.page.my || !$j("#js-dudenote").length || typeof userProfileHandler === "undefined" || !userProfileHandler.showRandomNote) {
                return false;
            }
            this.user_id = $j(".b-top_panel_user_menu .c_user").data('user_id');
            if (!this.user_id) {
                return false;
            }
            this.showButton();
        },
        showButton: function() {
            var me = this;
            var link = $j("<span>&nbsp;&nbsp;</span><a href='#' id='ftay_get_all_notes'>Читать всё (SP)</a>").click(function() {
                me.getAllNotes();
            });
            $j("#js-dudenote a").after(link);
        },
        getAllNotes: function() {
            if (this.started) {
                clearTimeout(this.timeout);
                $j("#ftay_notes_list").remove();
                this.started = false;
                this.notes_array = [];
                this.current_note = '';
                return;
            }
            this.started = true;
            var div = $j("<div id='ftay_notes_div'><div id='ftay_waiting'>... working ...</div></div>");
            $j(".b-user_data").append(div);
            div.css({
                width: "80%",
                margin: "30px auto",
                padding: "20px",
                border: "1px solid black"
            });
            $j("#ftay_waiting").css({
                width: "50%",
                margin: "0px auto 10px",
                "text-align": "center"
            });
            this.requestNextNote();
        },
        requestNextNote: function() {
            userProfileHandler.showRandomNote(this.user_id);
            var me = this;
            this.timeout = setTimeout(function() {
                me.addNoteIfNew();
            }, 200);
        },
        addNoteIfNew: function() {
            if (!$j("#js-dudenote em").length) {
                var me = this;
                this.timeout = setTimeout(function() {
                    me.addNoteIfNew();
                }, 200);
                return;
            }
            var note = $j("#js-dudenote em").text();
            if (note === this.current_note) {
                this.requestNextNote();
                return;
            }
            this.current_note = note;
            var exist = false;
            for (var i = 0; i <= this.notes_array.length; i++) {
                if (this.notes_array[i] === note) {
                    exist = true;
                    break;
                }
            }
            if (!exist) {
                this.notes_array.push(note);
                var new_note = $j("<div class='ftay_note_div' style='display:none'></div>").text(note);
                $j("#ftay_waiting").after(new_note);
                new_note.fadeIn();
            }
            this.requestNextNote();
        },
    });
} catch (e) {
    if (console) console.log(e);
}