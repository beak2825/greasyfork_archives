// ==UserScript==
// @name         F-L Drag&Drop 1.0
// @namespace    http://tampermonkey.net/
// @version      1.0.3
// @description
// @author       ZyLyXy
// @match        https://www.f-list.net/character_edit.php*
// @grant        none
// @run-at       document-idle
// @description F-L Drag&Drop for CustomFetishes & SubFetishes
// @downloadURL https://update.greasyfork.org/scripts/409850/F-L%20DragDrop%2010.user.js
// @updateURL https://update.greasyfork.org/scripts/409850/F-L%20DragDrop%2010.meta.js
// ==/UserScript==
"use strict";
(function () {
    function la(a) {
        a = typeof a;
        return "string" === a || "number" === a;
    }
    function t(a) {
        return void 0 === a || null === a;
    }
    function Z(a) {
        return null === a || !1 === a || !0 === a || void 0 === a;
    }
    function w(a) {
        return "function" === typeof a;
    }
    function aa(a) {
        return "string" === typeof a;
    }
    function L(a, b) {
        var c = {};
        if (a) for (var d in a) c[d] = a[d];
        if (b) for (var e in b) c[e] = b[e];
        return c;
    }
    function za(a) {
        return null !== a && "object" === typeof a;
    }
    function ma(a, b, c) {
        null === c ? a.appendChild(b) : a.insertBefore(b, c);
    }
    function Ra(a) {
        for (var b = 0; b < a.length; b++) a[b]();
    }
    function G(a, b) {
        for (var c; a; ) {
            c = a.flags;
            if (c & 2033) return a.dom;
            var d = a.children;
            a = c & 4 ? d.$LI : c & 8192 ? (2 === a.childFlags ? d : d[b ? 0 : d.length - 1]) : d;
        }
        return null;
    }
    function ba(a, b) {
        do {
            var c = a.flags;
            if (c & 2033) {
                b.removeChild(a.dom);
                break;
            }
            var d = a.children;
            c & 4 && (a = d.$LI);
            c & 8 && (a = d);
            if (c & 8192)
                if (2 === a.childFlags) a = d;
                else {
                    a = 0;
                    for (c = d.length; a < c; ++a) ba(d[a], b);
                    break;
                }
        } while (a);
    }
    function Sa(a, b, c) {
        do {
            var d = a.flags;
            if (d & 2033) {
                ma(b, a.dom, c);
                break;
            }
            var e = a.children;
            d & 4 && (a = e.$LI);
            d & 8 && (a = e);
            if (d & 8192)
                if (2 === a.childFlags) a = e;
                else {
                    a = 0;
                    for (d = e.length; a < d; ++a) Sa(e[a], b, c);
                    break;
                }
        } while (a);
    }
    function Ta(a, b, c) {
        return a.constructor.getDerivedStateFromProps ? L(c, a.constructor.getDerivedStateFromProps(b, c)) : c;
    }
    function Ua(a, b) {
        return za(a) && a.event === b.event && a.data === b.data;
    }
    function Va(a, b) {
        for (var c in b) void 0 === a[c] && (a[c] = b[c]);
        return a;
    }
    function Aa(a, b) {
        return !!w(a) && (a(b), !0);
    }
    function na(a, b, c, d, e, f, g, h) {
        this.childFlags = a;
        this.children = b;
        this.className = c;
        this.dom = null;
        this.flags = d;
        this.key = void 0 === e ? null : e;
        this.props = void 0 === f ? null : f;
        this.ref = void 0 === g ? null : g;
        this.type = h;
    }
    function r(a, b, c, d, e, f, g, h) {
        e = void 0 === e ? 1 : e;
        a = new na(e, d, c, a, g, f, h, b);
        W.createVNode && W.createVNode(a);
        0 === e && Wa(a, a.children);
        return a;
    }
    function l(a, b, c, d, e) {
        var f = (a = a & 12 ? a : b.prototype && b.prototype.render ? 4 : b.render ? 32776 : 8);
        var g = (a & 32768 ? b.render : b).defaultProps;
        c = t(g) ? c : t(c) ? L(g, null) : Va(c, g);
        a & 4 || ((a = (a & 32768 ? b.render : b).defaultHooks), (e = t(a) ? e : t(e) ? a : Va(e, a)));
        b = new na(1, null, null, f, d, c, e, b);
        W.createVNode && W.createVNode(b);
        return b;
    }
    function M(a, b) {
        return new na(1, t(a) || !0 === a || !1 === a ? "" : a, null, 16, b, null, null, null);
    }
    function oa(a, b, c) {
        b = r(8192, 8192, null, a, b, null, c, null);
        switch (b.childFlags) {
            case 1:
                b.children = M("", null);
                b.childFlags = 2;
                break;
            case 16:
                (b.children = [M(a)]), (b.childFlags = 4);
        }
        return b;
    }
    function Ba(a) {
        var b = a.props;
        if (b) {
            var c = a.flags;
            c & 481 && (void 0 !== b.children && t(a.children) && Wa(a, b.children), void 0 !== b.className && ((a.className = b.className || null), (b.className = void 0)));
            void 0 !== b.key && ((a.key = b.key), (b.key = void 0));
            void 0 !== b.ref && ((a.ref = c & 8 ? L(a.ref, b.ref) : b.ref), (b.ref = void 0));
        }
        return a;
    }
    function B(a) {
        var b = a.flags & -16385,
            c = a.props;
        if (b & 14 && null !== c) {
            var d = c;
            c = {};
            for (var e in d) c[e] = d[e];
        }
        if (0 === (b & 8192)) return new na(a.childFlags, a.children, a.className, b, a.key, c, a.ref, a.type);
        b = a.children;
        c = a.childFlags;
        if (2 === c) var f = B(b);
        else if (c & 12) for (f = [], d = 0, e = b.length; d < e; ++d) f.push(B(b[d]));
        return oa(f, c, a.key);
    }
    function Xa(a, b, c, d) {
        for (var e = a.length; c < e; c++) {
            var f = a[c];
            if (!Z(f)) {
                var g = d + "$" + c;
                if (ca(f)) Xa(f, b, 0, g);
                else {
                    if (la(f)) f = M(f, g);
                    else {
                        var h = f.key,
                            q = aa(h) && "$" === h[0];
                        if (f.flags & 81920 || q) f = B(f);
                        f.flags |= 65536;
                        q ? h.substring(0, d.length) !== d && (f.key = d + h) : (f.key = null === h ? g : d + h);
                    }
                    b.push(f);
                }
            }
        }
    }
    function Wa(a, b) {
        var c = 1;
        if (Z(b)) var d = b;
        else if (la(b)) (c = 16), (d = b);
        else if (ca(b)) {
            c = b.length;
            for (var e = 0; e < c; ++e) {
                var f = b[e];
                if (Z(f) || ca(f)) {
                    d = d || b.slice(0, e);
                    Xa(b, d, e, "");
                    break;
                } else if (la(f)) (d = d || b.slice(0, e)), d.push(M(f, "$" + e));
                else {
                    var g = f.key,
                        h = 0 < (f.flags & 81920),
                        q = null === g;
                    g = aa(g) && "$" === g[0];
                    if (h || q || g) {
                        d = d || b.slice(0, e);
                        if (h || g) f = B(f);
                        if (q || g) f.key = "$" + e;
                        d.push(f);
                    } else d && d.push(f);
                    f.flags |= 65536;
                }
            }
            d = d || b;
            c = 0 === d.length ? 1 : 8;
        } else (d = b), (d.flags |= 65536), b.flags & 81920 && (d = B(b)), (c = 2);
        a.children = d;
        a.childFlags = c;
        return a;
    }
    function Ca(a) {
        return Z(a) || la(a) ? M(a, null) : ca(a) ? oa(a, 0, null) : a.flags & 16384 ? B(a) : a;
    }
    function pa(a) {
        return { onClick: a, onDblClick: a, onFocusIn: a, onFocusOut: a, onKeyDown: a, onKeyPress: a, onKeyUp: a, onMouseDown: a, onMouseMove: a, onMouseUp: a, onTouchEnd: a, onTouchMove: a, onTouchStart: a };
    }
    function Ya(a, b) {
        var c = b.$EV;
        c || (c = b.$EV = pa(null));
        c[a] || 1 !== ++Za[a] || ((b = "onClick" === a || "onDblClick" === a ? Hb(a) : Ib(a)), document.addEventListener(a.substr(2).toLowerCase(), b), (Da[a] = b));
        return c;
    }
    function $a(a, b) {
        (b = b.$EV) && b[a] && (0 === --Za[a] && (document.removeEventListener(a.substr(2).toLowerCase(), Da[a]), (Da[a] = null)), (b[a] = null));
    }
    function ab(a, b, c, d) {
        var e = w(a.composedPath) ? a.composedPath()[0] : a.target;
        do {
            if (b && e.disabled) break;
            var f = e.$EV;
            if (f && (f = f[c]) && ((d.dom = e), f.event ? f.event(f.data, a) : f(a), a.cancelBubble)) break;
            e = e.parentNode;
        } while (null !== e);
    }
    function Jb() {
        this.cancelBubble = !0;
        this.immediatePropagationStopped || this.stopImmediatePropagation();
    }
    function Kb() {
        return this.defaultPrevented;
    }
    function Lb() {
        return this.cancelBubble;
    }
    function bb(a) {
        var b = { dom: document };
        a.isDefaultPrevented = Kb;
        a.isPropagationStopped = Lb;
        a.stopPropagation = Jb;
        Object.defineProperty(a, "currentTarget", {
            configurable: !0,
            get: function () {
                return b.dom;
            },
        });
        return b;
    }
    function Hb(a) {
        return function (b) {
            0 !== b.button ? b.stopPropagation() : ab(b, !0, a, bb(b));
        };
    }
    function Ib(a) {
        return function (b) {
            ab(b, !1, a, bb(b));
        };
    }
    function cb(a, b, c) {
        if (a[b]) (a = a[b]), a.event ? a.event(a.data, c) : a(c);
        else if (((b = b.toLowerCase()), a[b])) a[b](c);
    }
    function da(a, b) {
        var c = function (c) {
            var d = this.$V;
            if (d) {
                var f = d.props || x;
                d = d.dom;
                if (aa(a)) cb(f, a, c);
                else for (var g = 0; g < a.length; ++g) cb(f, a[g], c);
                w(b) && ((c = this.$V), b(c.props || x, d, !1, c));
            }
        };
        Object.defineProperty(c, "wrapped", { configurable: !1, enumerable: !1, value: !0, writable: !1 });
        return c;
    }
    function P(a, b, c) {
        var d = "$" + b,
            e = a[d];
        if (e) {
            if (e[1].wrapped) return;
            a.removeEventListener(e[0], e[1]);
            a[d] = null;
        }
        w(c) && (a.addEventListener(b, c), (a[d] = [b, c]));
    }
    function Ea(a) {
        return "checkbox" === a || "radio" === a;
    }
    function db(a) {
        a.stopPropagation();
    }
    function qa(a, b) {
        var c = a.type,
            d = a.value,
            e = a.checked,
            f = a.multiple;
        a = a.defaultValue;
        var g = !t(d);
        c && c !== b.type && b.setAttribute("type", c);
        t(f) || f === b.multiple || (b.multiple = f);
        t(a) || g || (b.defaultValue = a + "");
        Ea(c) ? (g && (b.value = d), t(e) || (b.checked = e)) : g && b.value !== d ? ((b.defaultValue = d), (b.value = d)) : t(e) || (b.checked = e);
    }
    function ea(a, b) {
        if ("option" === a.type) {
            var c = a.props || x;
            a = a.dom;
            a.value = c.value;
            c.value === b || (ca(b) && -1 !== b.indexOf(c.value)) ? (a.selected = !0) : (t(b) && t(c.selected)) || (a.selected = c.selected || !1);
        } else {
            c = a.children;
            var d = a.flags;
            if (d & 4) ea(c.$LI, b);
            else if (d & 8) ea(c, b);
            else if (2 === a.childFlags) ea(c, b);
            else if (a.childFlags & 12) for (a = 0, d = c.length; a < d; ++a) ea(c[a], b);
        }
    }
    function Fa(a, b, c, d) {
        var e = !!a.multiple;
        t(a.multiple) || e === b.multiple || (b.multiple = e);
        e = a.selectedIndex;
        -1 === e && (b.selectedIndex = -1);
        if (1 !== d.childFlags) {
            var f = a.value;
            "number" === typeof e && -1 < e && b.options[e] && (f = b.options[e].value);
            c && t(f) && (f = a.defaultValue);
            ea(d, f);
        }
    }
    function Ga(a, b, c) {
        var d = a.value,
            e = b.value;
        t(d) ? c && ((a = a.defaultValue), t(a) || a === e || ((b.defaultValue = a), (b.value = a))) : e !== d && ((b.defaultValue = d), (b.value = d));
    }
    function eb(a) {
        return a.type && Ea(a.type) ? !t(a.checked) : !t(a.value);
    }
    function ra(a) {
        a && !Aa(a, null) && a.current && (a.current = null);
    }
    function sa(a, b, c) {
        a &&
            (w(a) || void 0 !== a.current) &&
            c.push(function () {
                Aa(a, b) || void 0 === a.current || (a.current = b);
            });
    }
    function F(a, b) {
        I(a);
        ba(a, b);
    }
    function I(a) {
        var b = a.flags,
            c = a.children;
        if (b & 481) {
            b = a.ref;
            var d = a.props;
            ra(b);
            b = a.childFlags;
            if (null !== d) {
                d = Object.keys(d);
                for (var e = 0, f = d.length; e < f; e++) {
                    var g = d[e];
                    fb[g] && $a(g, a.dom);
                }
            }
            b & 12 ? fa(c) : 2 === b && I(c);
        } else if (c)
            if (b & 4) w(c.componentWillUnmount) && c.componentWillUnmount(), ra(a.ref), (c.$UN = !0), I(c.$LI);
            else if (b & 8) {
                b = a.ref;
                if (!t(b) && w(b.onComponentWillUnmount)) b.onComponentWillUnmount(G(a, !0), a.props || x);
                I(c);
            } else b & 1024 ? F(c, a.ref) : b & 8192 && a.childFlags & 12 && fa(c);
    }
    function fa(a) {
        for (var b = 0, c = a.length; b < c; ++b) I(a[b]);
    }
    function ta(a, b, c) {
        fa(c);
        b.flags & 8192 ? ba(b, a) : (a.textContent = "");
    }
    function Mb(a) {
        var b = a.event;
        return function (c) {
            b(a.data, c);
        };
    }
    function Ha(a, b, c, d, e, f, g) {
        switch (a) {
            case "children":
            case "childrenType":
            case "className":
            case "defaultValue":
            case "key":
            case "multiple":
            case "ref":
            case "selectedIndex":
                break;
            case "autoFocus":
                d.autofocus = !!c;
                break;
            case "allowfullscreen":
            case "autoplay":
            case "capture":
            case "checked":
            case "controls":
            case "default":
            case "disabled":
            case "hidden":
            case "indeterminate":
            case "loop":
            case "muted":
            case "novalidate":
            case "open":
            case "readOnly":
            case "required":
            case "reversed":
            case "scoped":
            case "seamless":
            case "selected":
                d[a] = !!c;
                break;
            case "defaultChecked":
            case "value":
            case "volume":
                if (f && "value" === a) break;
                b = t(c) ? "" : c;
                d[a] !== b && (d[a] = b);
                break;
            case "style":
                if (t(c)) d.removeAttribute("style");
                else {
                    d = d.style;
                    var h;
                    if (aa(c)) d.cssText = c;
                    else if (t(b) || aa(b)) for (h in c) (g = c[h]), d.setProperty(h, g);
                    else {
                        for (h in c) (g = c[h]), g !== b[h] && d.setProperty(h, g);
                        for (h in b) t(c[h]) && d.removeProperty(h);
                    }
                }
                break;
            case "dangerouslySetInnerHTML":
                a = (c && c.__html) || "";
                if ((b = ((b && b.__html) || "") !== a)) if ((b = !t(a))) (b = document.createElement("i")), (b.innerHTML = a), (b = b.innerHTML !== d.innerHTML);
                b && (null !== g && (g.childFlags & 12 ? fa(g.children) : 2 === g.childFlags && I(g.children), (g.children = null), (g.childFlags = 1)), (d.innerHTML = a));
                break;
            default:
                if (fb[a]) w(c) ? (Ya(a, d)[a] = c) : za(c) ? Ua(b, c) || (Ya(a, d)[a] = c) : $a(a, d);
                else if (111 === a.charCodeAt(0) && 110 === a.charCodeAt(1))
                    a: {
                        g = c;
                        if (za(g)) {
                            if (Ua(b, g)) break a;
                            g = Mb(g);
                        }
                        P(d, a.substr(2).toLowerCase(), g);
                    }
                else t(c) ? d.removeAttribute(a) : e && gb[a] ? d.setAttributeNS(gb[a], a, c) : d.setAttribute(a, c);
        }
    }
    function hb(a, b, c) {
        b = Ca(a.render(b, a.state, c));
        var d = c;
        w(a.getChildContext) && (d = L(c, a.getChildContext()));
        a.$CX = d;
        return b;
    }
    function D(a, b, c, d, e, f) {
        var g = (a.flags |= 16384);
        if (g & 481) {
            var h = d;
            d = a.flags;
            var q = a.props,
                k = a.className,
                n = a.children,
                v = a.childFlags;
            g = a.type;
            g = (h = h || 0 < (d & 32)) ? document.createElementNS("http://www.w3.org/2000/svg", g) : document.createElement(g);
            g = a.dom = g;
            t(k) || "" === k || (h ? g.setAttribute("class", k) : (g.className = k));
            16 === v ? (g.textContent = n) : 1 !== v && ((k = h && "foreignObject" !== a.type), 2 === v ? (n.flags & 16384 && (a.children = n = B(n)), D(n, g, c, k, null, f)) : (8 !== v && 4 !== v) || Q(n, g, c, k, null, f));
            null === b || ma(b, g, e);
            if (null !== q) {
                b = h;
                e = !1;
                if ((c = 0 < (d & 448))) if ((e = eb(q))) d & 64 ? (Ea(q.type) ? (P(g, "change", Nb), P(g, "click", db)) : P(g, "input", Ob)) : d & 256 ? P(g, "change", Pb) : d & 128 && (P(g, "input", Qb), q.onChange && P(g, "change", Rb));
                for (var p in q) Ha(p, null, q[p], g, b, e, null);
                c && ((b = e), d & 64 ? qa(q, g) : d & 256 ? Fa(q, g, !0, a) : d & 128 && Ga(q, g, !0), b && (g.$V = a));
            }
            sa(a.ref, g, f);
        } else if (g & 4) {
            h = a.type;
            p = a.props || x;
            g = new h(p, c);
            h = g.$N = !(!h.getDerivedStateFromProps && !g.getSnapshotBeforeUpdate);
            g.$SVG = d;
            g.$L = f;
            a.children = g;
            g.$BS = !1;
            g.context = c;
            g.props === x && (g.props = p);
            if (h) g.state = Ta(g, p, g.state);
            else if (w(g.componentWillMount)) {
                g.$BR = !0;
                g.componentWillMount();
                h = g.$PS;
                if (null !== h) {
                    n = g.state;
                    if (null === n) g.state = h;
                    else for (q in h) n[q] = h[q];
                    g.$PS = null;
                }
                g.$BR = !1;
            }
            g.$LI = hb(g, p, c);
            D(g.$LI, b, g.$CX, d, e, f);
            sa(a.ref, g, f);
            w(g.componentDidMount) && f.push(Sb(g));
        } else
            g & 8
                ? ((p = a.flags & 32768 ? a.type.render(a.props || x, a.ref, c) : a.type(a.props || x, c)),
                  D((a.children = Ca(p)), b, c, d, e, f),
                  (b = a.ref),
                  t(b) || (Aa(b.onComponentWillMount, a.props || x), w(b.onComponentDidMount) && f.push(Tb(b, a))))
                : g & 512 || g & 16
                ? ((a = a.dom = document.createTextNode(a.children)), null !== b && ma(b, a, e))
                : g & 8192
                ? ((p = a.children), (q = a.childFlags), q & 12 && 0 === p.length && ((q = a.childFlags = 2), (p = a.children = M("", null))), 2 === q ? D(p, b, e, d, e, f) : Q(p, b, c, d, e, f))
                : g & 1024 && (D(a.children, a.ref, c, !1, null, f), (f = M("", null)), (c = f.dom = document.createTextNode(f.children)), null !== b && ma(b, c, e), (a.dom = f.dom));
    }
    function Q(a, b, c, d, e, f) {
        for (var g = 0; g < a.length; ++g) {
            var h = a[g];
            h.flags & 16384 && (a[g] = h = B(h));
            D(h, b, c, d, e, f);
        }
    }
    function Sb(a) {
        return function () {
            a.componentDidMount();
        };
    }
    function Tb(a, b) {
        return function () {
            a.onComponentDidMount(G(b, !0), b.props || x);
        };
    }
    function J(a, b, c, d, e, f, g) {
        var h = (b.flags |= 16384);
        if (a.flags !== h || a.type !== b.type || a.key !== b.key || h & 2048)
            a.flags & 16384 ? (I(a), 0 !== (b.flags & a.flags & 2033) ? (D(b, null, d, e, null, g), c.replaceChild(b.dom, a.dom)) : (D(b, c, d, e, G(a, !0), g), ba(a, c))) : D(b, c, d, e, f, g);
        else if (h & 481) {
            c = b.dom = a.dom;
            var q = a.props,
                k = b.props,
                n = !1;
            f = !1;
            e = e || 0 < (h & 32);
            if (q !== k) {
                q = q || x;
                var v = k || x;
                if (v !== x) {
                    (n = 0 < (h & 448)) && (f = eb(v));
                    for (var p in v) {
                        k = q[p];
                        var u = v[p];
                        k !== u && Ha(p, k, u, c, e, f, a);
                    }
                }
                if (q !== x) for (var m in q) t(v[m]) && !t(q[m]) && Ha(m, q[m], null, c, e, f, a);
            }
            p = b.children;
            m = b.className;
            a.className !== m && (t(m) ? c.removeAttribute("class") : e ? c.setAttribute("class", m) : (c.className = m));
            h & 4096 ? c.textContent !== p && (c.textContent = p) : Ia(a.childFlags, b.childFlags, a.children, p, c, d, e && "foreignObject" !== b.type, null, a, g);
            n && ((d = v), (e = f), h & 64 ? qa(d, c) : h & 256 ? Fa(d, c, !1, b) : h & 128 && Ga(d, c, !1), e && (c.$V = b));
            d = b.ref;
            a = a.ref;
            a !== d && (ra(a), sa(d, c, g));
        } else if (h & 4)
            a: {
                if (((h = b.children = a.children), null !== h)) {
                    h.$L = g;
                    v = b.props || x;
                    b = b.ref;
                    a = a.ref;
                    n = h.state;
                    if (!h.$N) {
                        if (w(h.componentWillReceiveProps)) {
                            h.$BR = !0;
                            h.componentWillReceiveProps(v, d);
                            if (h.$UN) break a;
                            h.$BR = !1;
                        }
                        null !== h.$PS && ((n = L(n, h.$PS)), (h.$PS = null));
                    }
                    ib(h, n, v, c, d, e, !1, f, g);
                    a !== b && (ra(a), sa(b, h, g));
                }
            }
        else if (h & 8)
            if (((m = !0), (h = b.props || x), (v = b.ref), (n = a.props), (p = !t(v)), (a = a.children), p && w(v.onComponentShouldUpdate) && (m = v.onComponentShouldUpdate(n, h)), !1 !== m)) {
                if (p && w(v.onComponentWillUpdate)) v.onComponentWillUpdate(n, h);
                m = b.type;
                m = Ca(b.flags & 32768 ? m.render(h, v, d) : m(h, d));
                J(a, m, c, d, e, f, g);
                b.children = m;
                if (p && w(v.onComponentDidUpdate)) v.onComponentDidUpdate(n, h);
            } else b.children = a;
        else
            h & 16
                ? ((g = b.children), (d = b.dom = a.dom), g !== a.children && (d.nodeValue = g))
                : h & 512
                ? (b.dom = a.dom)
                : h & 8192
                ? ((f = a.children),
                  (h = b.children),
                  (v = a.childFlags),
                  (n = b.childFlags),
                  (p = null),
                  n & 12 && 0 === h.length && ((n = b.childFlags = 2), (h = b.children = M("", null))),
                  (b = 0 !== (n & 2)),
                  v & 12 && ((m = f.length), (v & 8 && n & 8) || b || (!b && h.length > m)) && (p = G(f[m - 1], !1).nextSibling),
                  Ia(v, n, f, h, c, d, e, p, a, g))
                : ((e = a.ref), (c = b.ref), (f = b.children), Ia(a.childFlags, b.childFlags, a.children, f, e, d, !1, null, a, g), (b.dom = a.dom), e === c || Z(f) || ((g = f.dom), e.removeChild(g), c.appendChild(g)));
    }
    function Ia(a, b, c, d, e, f, g, h, q, k) {
        switch (a) {
            case 2:
                switch (b) {
                    case 2:
                        J(c, d, e, f, g, h, k);
                        break;
                    case 1:
                        F(c, e);
                        break;
                    case 16:
                        I(c);
                        e.textContent = d;
                        break;
                    default:
                        I(c), Q(d, e, f, g, G(c, !0), k), ba(c, e);
                }
                break;
            case 1:
                switch (b) {
                    case 2:
                        D(d, e, f, g, h, k);
                        break;
                    case 1:
                        break;
                    case 16:
                        e.textContent = d;
                        break;
                    default:
                        Q(d, e, f, g, h, k);
                }
                break;
            case 16:
                switch (b) {
                    case 16:
                        c !== d && ("" !== c ? (e.firstChild.nodeValue = d) : (e.textContent = d));
                        break;
                    case 2:
                        e.textContent = "";
                        D(d, e, f, g, h, k);
                        break;
                    case 1:
                        e.textContent = "";
                        break;
                    default:
                        (e.textContent = ""), Q(d, e, f, g, h, k);
                }
                break;
            default:
                switch (b) {
                    case 16:
                        fa(c);
                        e.textContent = d;
                        break;
                    case 2:
                        ta(e, q, c);
                        D(d, e, f, g, h, k);
                        break;
                    case 1:
                        ta(e, q, c);
                        break;
                    default:
                        var n = c.length | 0,
                            v = d.length | 0;
                        if (0 === n) 0 < v && Q(d, e, f, g, h, k);
                        else if (0 === v) ta(e, q, c);
                        else if (8 === b && 8 === a) {
                            var p = n - 1;
                            b = v - 1;
                            a = 0;
                            var u = c[a],
                                m = d[a];
                            a: {
                                for (; u.key === m.key; ) {
                                    m.flags & 16384 && (d[a] = m = B(m));
                                    J(u, m, e, f, g, h, k);
                                    c[a] = m;
                                    ++a;
                                    if (a > p || a > b) break a;
                                    u = c[a];
                                    m = d[a];
                                }
                                u = c[p];
                                for (m = d[b]; u.key === m.key; ) {
                                    m.flags & 16384 && (d[b] = m = B(m));
                                    J(u, m, e, f, g, h, k);
                                    c[p] = m;
                                    p--;
                                    b--;
                                    if (a > p || a > b) break a;
                                    u = c[p];
                                    m = d[b];
                                }
                            }
                            if (a > p) {
                                if (a <= b) for (c = b + 1, h = c < v ? G(d[c], !0) : h; a <= b; ) (m = d[a]), m.flags & 16384 && (d[a] = m = B(m)), ++a, D(m, e, f, g, h, k);
                            } else if (a > b) for (; a <= p; ) F(c[a++], e);
                            else {
                                var r = b;
                                u = a;
                                var t = u;
                                a = u;
                                var l = p - u + 1;
                                m = r - u + 1;
                                b = new Int32Array(m + 1);
                                var w = l === n,
                                    z = !1,
                                    x = 0,
                                    A = 0;
                                if (4 > v || 32 > (l | m))
                                    for (l = t; l <= p; ++l) {
                                        var y = c[l];
                                        if (A < m) {
                                            for (u = a; u <= r; u++)
                                                if (((n = d[u]), y.key === n.key)) {
                                                    b[u - a] = l + 1;
                                                    if (w) for (w = !1; t < l; ) F(c[t++], e);
                                                    x > u ? (z = !0) : (x = u);
                                                    n.flags & 16384 && (d[u] = n = B(n));
                                                    J(y, n, e, f, g, h, k);
                                                    ++A;
                                                    break;
                                                }
                                            !w && u > r && F(y, e);
                                        } else w || F(y, e);
                                    }
                                else {
                                    var C = {};
                                    for (l = a; l <= r; ++l) C[d[l].key] = l;
                                    for (l = t; l <= p; ++l)
                                        if (((y = c[l]), A < m))
                                            if (((u = C[y.key]), void 0 !== u)) {
                                                if (w) for (w = !1; l > t; ) F(c[t++], e);
                                                b[u - a] = l + 1;
                                                x > u ? (z = !0) : (x = u);
                                                n = d[u];
                                                n.flags & 16384 && (d[u] = n = B(n));
                                                J(y, n, e, f, g, h, k);
                                                ++A;
                                            } else w || F(y, e);
                                        else w || F(y, e);
                                }
                                if (w) ta(e, q, c), Q(d, e, f, g, h, k);
                                else if (z) {
                                    n = q = 0;
                                    r = b.length;
                                    r > jb && ((jb = r), (K = new Int32Array(r)), (ua = new Int32Array(r)));
                                    for (; q < r; ++q)
                                        if (((c = b[q]), 0 !== c))
                                            if (((p = K[n]), b[p] < c)) (ua[q] = p), (K[++n] = q);
                                            else {
                                                p = 0;
                                                for (u = n; p < u; ) (l = (p + u) >> 1), b[K[l]] < c ? (p = l + 1) : (u = l);
                                                c < b[K[p]] && (0 < p && (ua[q] = K[p - 1]), (K[p] = q));
                                            }
                                    p = n + 1;
                                    c = new Int32Array(p);
                                    for (u = K[p - 1]; 0 < p--; ) (c[p] = u), (u = ua[u]), (K[p] = 0);
                                    u = c.length - 1;
                                    for (l = m - 1; 0 <= l; l--)
                                        0 === b[l]
                                            ? ((x = l + a), (n = d[x]), n.flags & 16384 && (d[x] = n = B(n)), (m = x + 1), D(n, e, f, g, m < v ? G(d[m], !0) : h, k))
                                            : 0 > u || l !== c[u]
                                            ? ((x = l + a), (n = d[x]), (m = x + 1), Sa(n, e, m < v ? G(d[m], !0) : h))
                                            : u--;
                                } else if (A !== m) for (l = m - 1; 0 <= l; l--) 0 === b[l] && ((x = l + a), (n = d[x]), n.flags & 16384 && (d[x] = n = B(n)), (m = x + 1), D(n, e, f, g, m < v ? G(d[m], !0) : h, k));
                            }
                        } else {
                            a = n > v ? v : n;
                            for (b = 0; b < a; ++b) (m = d[b]), (q = c[b]), m.flags & 16384 && (m = d[b] = B(m)), J(q, m, e, f, g, h, k), (c[b] = m);
                            if (n < v) for (b = a; b < v; ++b) (m = d[b]), m.flags & 16384 && (m = d[b] = B(m)), D(m, e, f, g, h, k);
                            else if (n > v) for (b = a; b < n; ++b) F(c[b], e);
                        }
                }
        }
    }
    function Ub(a, b, c, d, e) {
        e.push(function () {
            a.componentDidUpdate(b, c, d);
        });
    }
    function ib(a, b, c, d, e, f, g, h, k) {
        var l = a.state,
            n = a.props,
            q = !!a.$N,
            p = w(a.shouldComponentUpdate);
        q && (b = Ta(a, c, b !== l ? L(l, b) : b));
        g || !p || (p && a.shouldComponentUpdate(c, b, e))
            ? (!q && w(a.componentWillUpdate) && a.componentWillUpdate(c, b, e),
              (a.props = c),
              (a.state = b),
              (a.context = e),
              (b = null),
              (c = hb(a, c, e)),
              q && w(a.getSnapshotBeforeUpdate) && (b = a.getSnapshotBeforeUpdate(n, l)),
              J(a.$LI, c, d, a.$CX, f, h, k),
              (a.$LI = c),
              w(a.componentDidUpdate) && Ub(a, n, l, b, k))
            : ((a.props = c), (a.state = b), (a.context = e));
    }
    function kb(a, b, c, d) {
        void 0 === c && (c = null);
        void 0 === d && (d = x);
        var e = [],
            f = b.$V;
        ha = !0;
        t(f) ? t(a) || (a.flags & 16384 && (a = B(a)), D(a, b, d, !1, null, e), (f = b.$V = a)) : t(a) ? (F(f, b), (b.$V = null)) : (a.flags & 16384 && (a = B(a)), J(f, a, b, d, !1, null, e), (f = b.$V = a));
        Ra(e);
        ha = !1;
        w(c) && c();
        w(W.renderComplete) && W.renderComplete(f, b);
    }
    function lb(a, b, c, d) {
        var e = a.$PS;
        w(b) && (b = b(e ? L(a.state, e) : a.state, a.props, a.context));
        if (t(e)) a.$PS = b;
        else for (var f in b) e[f] = b[f];
        a.$BR ? w(c) && a.$L.push(c.bind(a)) : ha || 0 !== va.length ? (-1 === va.indexOf(a) && va.push(a), Ja || ((Ja = !0), Vb(Wb)), w(c) && ((b = a.$QU), b || (b = a.$QU = []), b.push(c))) : (mb(a, d), w(c) && c.call(a));
    }
    function Wb() {
        var a;
        for (Ja = !1; (a = va.shift()); )
            if (!a.$UN && (mb(a, !1), a.$QU)) {
                for (var b = a.$QU, c = 0; c < b.length; ++c) b[c].call(a);
                a.$QU = null;
            }
    }
    function mb(a, b) {
        if (b || !a.$BR) {
            var c = a.$PS;
            a.$PS = null;
            var d = [];
            ha = !0;
            ib(a, L(a.state, c), a.props, G(a.$LI, !0).parentNode, a.context, a.$SVG, b, null, d);
            Ra(d);
            ha = !1;
        } else (a.state = a.$PS), (a.$PS = null);
    }
    function wa(a) {
        let b = [];
        for (let d = 0, e = a.length; d < e; d++) {
            var c = d + 1;
            if (c < e) {
                c = a[c];
                let e = !!c;
                e && c.constructor === String ? b.push(a[d]) : (e && b.push(a[d]), d++);
            } else b.push(a[d]);
        }
        return b.join(" ");
    }
    function Xb(a, b, c, d, e) {
        let f = new XMLHttpRequest();
        e &&
            (f.onreadystatechange = function () {
                4 === f.readyState && e(200 !== f.status, f);
            });
        if (d) {
            let a = d.type;
            a && (f.responseType = a);
        }
        f.open(a, b, d ? !d.sync : !0);
        if (d && (a = d.headers)) for (let b = 0, c = a.length; b < c; b += 2) f.setRequestHeader(a[b], a[b + 1]);
        f.send(c);
    }
    function Ka(a, b, c) {
        if (a === b) return !0;
        if (!a || "object" !== typeof a || !b || "object" !== typeof b) return !1;
        var d = a.constructor;
        if (d !== b.constructor) return !1;
        if (d === Date) return a.getTime() === b.getTime();
        if (d === RegExp) return a.source === b.source;
        var e = R.get(a);
        if (!e)
            if ((R.set(a, b), d === Array)) {
                d = a.length;
                if (d !== b.length) return c || R.clear(), !1;
                for (e = 0; e < d; e++) if (!Ka(a[e], b[e], !0)) return c || R.clear(), !1;
            } else {
                d = Object.keys(a);
                var f = Object.keys(b);
                e = d.length;
                if (e !== f.length) return c || R.clear(), !1;
                for (f = 0; f < e; f++) {
                    let e = d[f];
                    if (!Ka(a[e], b[e], !0)) return c || R.clear(), !1;
                }
            }
        else if (c) return b === e;
        c || R.clear();
        return !0;
    }
    function H(a, b, c, d) {
        void 0 === d ? a.addEventListener(b, c) : a.addEventListener(b, c, d);
    }
    function La(a, b) {
        for (let c = 0, d = a.length; c < d; c++) if (a[c].id === b) return c;
        return -1;
    }
    function xa(a, b) {
        var c = b._c;
        if (a._c !== c) return c ? 1 : -1;
        c = a.choice;
        var d = b.choice;
        if (c !== d) return Ma[c] - Ma[d];
        a = a.name;
        b = b.name;
        for (let e = 0, f = a.length; e < f; e++) {
            c = a.codePointAt(e);
            d = b.codePointAt(e);
            if (void 0 === d) return 1;
            if (c !== d) return c - d;
        }
        return a.length - b.length;
    }
    function nb(a) {
        let b = document.getElementById("FetishItem" + a.id);
        a = a.choice;
        if (b.previousElementSibling.value !== a) {
            var c = Ma[a];
            let d = b.children[2].children;
            if (4 > c) d[2 * c].onclick();
            else (c = d[0]), c.onclick(), c.onclick();
            b.previousElementSibling.value = a;
        }
    }
    function Yb() {
        A.clear();
        let a = C.b,
            b = N.b;
        for (let d in S) {
            let e = a[d];
            if (e) {
                var c = S[d];
                c = c ? c.map((a) => b[a]) : [];
                A.set(e, c);
            } else delete S[d];
        }
    }
    function Na() {
        S = {};
        for (let b in A.a) {
            var a = A.a[b];
            a = a ? a.map((a) => a.id) : [];
            S[b] = a;
        }
    }
    function ob(a) {
        A.a[a.id] && (T = !0);
        C.rem(a);
        A.remK(a.id);
    }
    function pb(a) {
        a && a._c && (ob(a), (a = k.Sels.indexOf(a)), 0 <= a && k.Sels.splice(a, 1));
    }
    function Zb() {
        let a = document.getElementById("character-button-save");
        if (!a._i) {
            a._i = !0;
            var b = a.onclick;
            a.onclick = function () {
                if (T) {
                    var a = JSON.stringify(S),
                        d = new URLSearchParams();
                    d.append("csrf_token", document.getElementById("flcsrf-token").content);
                    d.append("subfetish_json", a);
                    d.append("charid", qb.CharacterLists.characterId);
                    Xb("POST", "https://www.f-list.net/experimental/subfetish_save.php", d, { headers: ["Content-Type", "application/x-www-form-urlencoded"] }, (a, c) => {
                        a ? qb.Common_displayError("Error posting CustomFetishes: " + c.responseText) : b();
                    });
                } else b();
            };
        }
    }
    function rb() {
        if (!sb) {
            var a = document.getElementById("characterListsTemplate");
            a && (a = a.previousElementSibling);
            a && (a = a.textContent);
            if (a) {
                var b = a.indexOf("\n            //FList.Subfetish.Data.SubfetishesByCustom = ");
                if (0 > b) a = "";
                else {
                    b += 58;
                    var c = a.indexOf(";\n", b);
                    a = 0 > c ? "" : a.substring(b, c);
                }
            }
            S = a ? JSON.parse(a) : {};
            sb = !0;
            Zb();
            tb.inject();
        }
        C.clear();
        a = document.querySelectorAll(".CustomKink");
        for (let d = 0, e = a.length - 1; d < e; d++) {
            b = a[d].children;
            c = b[6].value;
            let e = 500 < parseInt(c);
            C.fset({ _o: !0, _c: !0, _p: e, id: e ? c : "N" + c, name: b[2].value, description: b[4].value, choice: b[5].value });
        }
        N.clear();
        a = document.querySelectorAll(".FetishItem");
        for (let d = 0, e = a.length; d < e; d++)
            (b = a[d]), (c = b.children), (b = { _o: !1, _c: !1, _p: !0, id: b.id.substring(10), name: c[0].innerText.trim(), description: c[3].innerText.trim(), choice: b.previousElementSibling.value }), N.fset(b);
        Yb();
    }
    function z(a, b) {
        return { data: b, event: a };
    }
    function $b(a, b) {
        (a = a.opClick) && (a.event ? a.event(a.data, b) : a(b));
        return !1;
    }
    function E(a) {
        let b = a.isDisabled;
        return r(1, "a", wa([a.clazz || "x-btn", "x-dis", b]), a.children, 0, { onClick: !b && z($b, a) });
    }
    function ac(a) {
        return a && a._p;
    }
    function ub() {
        var a = C.a.filter(ac).sort(xa),
            b = O && O.length === a.length;
        if (b)
            for (let c = 0, d = O.length; c < d; c++)
                if (a[c].id !== O[c].id) {
                    b = !1;
                    break;
                }
        if (b) return U;
        O = a;
        a = Array(O.length + 1);
        a[0] = r(1, "option", "opt-kink", "None", 16, { value: "X" }, "X");
        for (let c = 0, d = O.length; c < d; c++) (b = O[c]), (a[c + 1] = r(1, "option", "opt-kink " + b.choice, b.name, 16, { value: b.id }, b.id));
        return a;
    }
    function vb() {
        U = ub();
        let a = A.b;
        for (let b = 0, c = ia.length; b < c; b++) {
            let c = ia[b],
                e = a[c.props.kink.id];
            c.children.setState({ sel: e ? e.id : "X", opts: U });
        }
    }
    function bc(a, b) {
        b = b.target.value;
        if ("X" === b) {
            var c = a.props.kink.id;
            T = !0;
            A.remV(c);
        } else if ((c = C.b[b])) {
            var d = a.props.kink;
            d.choice = c.choice;
            nb(d);
            T = !0;
            A.add(c, d);
        }
        Na();
        a.setState({ sel: b });
    }
    function cc(a) {
        var b = a.props.kink.id;
        T = !0;
        A.remV(b);
        Na();
        a.setState({ sel: "X" });
    }
    function wb(a) {
        return r(
            1,
            "div",
            "Dialog",
            r(
                1,
                "div",
                wa(["bp", "bp-s" + (a.size || 0)]),
                [
                    r(1, "div", "bp-h", [r(1, "h3", "bp-hh", a.title, 16), r(1, "img", "bp-hi", null, 1, { onClick: a.opClose, src: "https://static.f-list.net/images/icons/cross-circle-frame.png", alt: "Close Preview" })], 4),
                    r(1, "div", "bp-c", a.children, 0),
                ],
                4
            ),
            2
        );
    }
    function dc(a) {
        (a = X(a)) && a.removeAttribute("draggable");
    }
    function ec(a) {
        let b = X(a);
        if (b) return a.preventDefault(), k.initEditDialog(b._k.state.kink), !1;
    }
    function fc(a) {
        xb();
        let b = k.Sels;
        if (!(1 > b.length)) {
            var c = b[0]._c;
            a: {
                var d = !c;
                for (a = a.target; a && a !== ja; ) {
                    let b = a.className;
                    var e = d && a._k;
                    e = d && e && e.state.kink;
                    if (d && e && e._c) {
                        d = { k: e };
                        break a;
                    } else if ("box" === b) {
                        d = { c: a.firstElementChild.textContent.toLowerCase() };
                        break a;
                    }
                    a = a.parentElement;
                }
                d = null;
            }
            if (d) {
                if (d.c)
                    for (let e = 0, g = b.length; e < g; e++)
                        if (((a = b[e]), (a.choice = d.c), c)) {
                            if ((a = A.a[a.id])) for (let b = 0, c = a.length; b < c; b++) a[b].choice = d.c;
                        } else (a = a.id), (T = !0), A.remV(a);
                else if (((d = d.k), d._p)) {
                    for (let e = 0, g = b.length; e < g; e++) (a = b[e]), (a.choice = d.choice), (c = d), (T = !0), A.add(c, a);
                    d._o = !0;
                }
                k.UpdateUi();
            }
        }
    }
    function gc(a) {
        let b = a.target;
        for (; b; ) {
            let c = b.className;
            if ("box" === c || "kinks" === c || "subkinks" === c) {
                a.preventDefault();
                break;
            }
            b = b.parentElement;
        }
    }
    function xb() {
        ja.classList.remove("drag");
    }
    function hc(a) {
        ja.classList.add("drag");
        k.ToolTip.clearTip();
        let b = X(a)._k.state.kink;
        0 > k.Sels.indexOf(b) && yb(a, !0);
    }
    function ic(a) {
        if ((a = X(a))) a.draggable = !0;
    }
    function jc(a) {
        if ((a = X(a))) {
            let b = a._k.state.kink;
            k.ToolTip.showTip(b.id, b.name, b.description, a, 18);
        } else k.ToolTip.clearTip();
    }
    function kc() {
        k.ToolTip.clearTip();
    }
    function yb(a, b) {
        var c = X(a);
        if (c) {
            var d = c._k;
            c = d.state.kink;
            var e = A,
                f = e.a[c.id],
                g = f && 0 < f.length;
            f = e.b[c.id];
            if (!b && a.offsetX <= (f ? 46 : 32)) g && 16 >= a.offsetX ? ((c._o = !c._o), d.forceUpdate()) : k.initEditDialog(c);
            else {
                (b = k.Sels[0]) && b._c !== c._c && ((k.Sels = []), (V = c));
                if (!a.shiftKey || null === V || (V._c && !C.b[V.id])) V = c;
                if (a.shiftKey && 0 < k.Sels.length) {
                    if (c.choice === V.choice) {
                        k.Sels = [];
                        a = f ? e.a[f.id] : c._c ? C.a : N.a;
                        c = a.indexOf(c);
                        b = a.indexOf(V);
                        for (let d = c < b ? c : b, e = c < b ? b : c; d <= e; d++) k.Sels.push(a[d]);
                    }
                } else a.ctrlKey ? ((a = k.Sels.indexOf(c)), 0 <= a ? k.Sels.splice(a, 1) : k.Sels.push(c)) : (k.Sels = [c]);
                k.UpdateUi();
            }
        }
    }
    function X(a) {
        for (a = a.target; a && a !== ja; ) {
            if (a._k) return a;
            a = a.parentElement;
        }
    }
    function lc(a) {
        if (a && !a._i) {
            var b = "ontouchstart" in window;
            a._i = !0;
            ja = a;
            k.Sels = [];
            H(a, "mouseover", jc);
            H(a, "mouseleave", kc);
            H(a, "click", yb);
            H(a, "contextmenu", ec);
            H(a, b ? "touchend" : "mouseup", dc);
            H(a, b ? "touchstart" : "mousedown", ic);
            H(a, "dragover", gc);
            H(a, "dragstart", hc);
            H(a, "dragend", xb);
            H(a, "drop", fc);
        }
    }
    function Oa(a, b) {
        let c = a.props;
        var d = c.state;
        let e = b.target.value,
            f = c.prop.split("."),
            g = f.length - 1;
        for (let a = 0; a < g; a++) d = d[f[a]];
        d[f[g]] = 1 === c.ilk ? parseFloat(e) : e;
        a.forceUpdate();
        c.opChange && (a = c.opChange) && (a.event ? a.event(a.data, b) : a(b));
    }
    function Pa(a) {
        let b = a.prop.split("."),
            c = b.length;
        a = a.state;
        for (let d = 0; d < c; d++) a = a ? a[b[d]] : null;
        return a;
    }
    function Qa(a) {
        let b = {};
        for (let c in a) mc[c] || (b[c] = a[c]);
        return b;
    }
    function zb(a) {
        a.clear();
    }
    function nc(a) {
        let b = a.state,
            c = b.kink;
        b.oldKink ? Object.assign(b.oldKink, c) : ((c.id = "_" + oc++), C.fset(c));
        k.UpdateUi();
        a.clear();
    }
    function pc(a) {
        let b = a.state.oldKink;
        b && (pb(b), k.UpdateUi());
        a.clear();
    }
    function qc(a) {
        if (!a) return ["", 3];
        let b = a.indexOf("\u3010"),
            c;
        if (0 <= b && ((c = a.indexOf("\u3011", b)), 0 <= c)) return [a.substring(b + 1, c), 0];
        b = a.indexOf("\u2502");
        if (0 <= b) return [a.substring(b + 1), 1];
        b = a.indexOf("\u3014", b);
        return 0 <= b
            ? ((c = a.indexOf("\u3015", b)), [a.substring(b + 1, c), 2])
            : a.endsWith("\u2514\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2518")
            ? ["", 2]
            : a.charCodeAt(1) === Y[0]
            ? [a.substring(2), 3]
            : 0 <= Y.indexOf(a.charCodeAt(0))
            ? [a.substring(1), 3]
            : [a, 3];
    }
    function ya(a, b) {
        let c = k.Sels;
        if (c && !(1 > c.length) && c[0]._c) {
            var d = 0 > b ? "" : String.fromCharCode(b);
            b = 0 > b ? "" : String.fromCharCode(Y[0]);
            for (let e = 0, f = c.length; e < f; e++) {
                let f = c[e],
                    h = qc(f.name),
                    k = h[0];
                switch (3 > a ? a : h[1]) {
                    case 0:
                        f.name = d + b + "\u250c\u3010" + k + "\u3011\u2510";
                        break;
                    case 1:
                        f.name = d + "\u2502" + k;
                        break;
                    case 2:
                        f.name = d + (k ? "\u2514\u3014" + k + "\u3015\u2518" : "\u2514\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2518");
                        break;
                    case 3:
                        f.name = d + k;
                }
            }
            k.UpdateUi();
        }
    }
    function rc(a) {
        ya(0, a.state.num);
    }
    function sc(a) {
        ya(1, a.state.num);
    }
    function tc(a) {
        ya(2, a.state.num);
    }
    function uc(a) {
        ya(3, a.state.num);
    }
    function Ab(a) {
        let b = C.a;
        for (let c = 0, d = b.length; c < d; c++) b[c]._o = a;
        k.UpdateUi();
    }
    function vc() {
        Ab(!1);
    }
    function wc() {
        Ab(!0);
    }
    function xc() {
        k.initEditDialog(null, !0);
    }
    function yc() {
        {
            let a = k.Sels,
                b = a[0];
            if (b && b._c) {
                for (let b = 0, d = a.length; b < d; b++) ob(a[b]);
                a.length = 0;
            }
        }
        k.UpdateUi();
    }
    function zc() {
        var a = C.b,
            b = C.a;
        for (let e = 0, f = b.length; e < f; e++) {
            var c = b[e],
                d = void 0;
            d = c.id;
            "_" === d[0]
                ? (document.getElementById("customs-button-add").onclick(), (d = document.getElementById("CustomKinksList").lastElementChild.children), (a["N" + d[6].value] = c))
                : (d = document.getElementById("kinkName" + ("N" === d[0] ? d.substring(1) : d)).parentElement.children);
            d[2].value = c.name;
            d[4].value = c.description;
            d[5].value = c.choice;
        }
        b = document.querySelectorAll(".CustomKink");
        for (let e = 0, f = b.length - 1; e < f; e++) {
            c = b[e];
            d = c.children[6].value;
            let f = 500 < parseInt(d);
            if (!a[f ? d : "N" + d]) c.children[0].onclick();
        }
        a = N.a;
        for (let b = 0, c = a.length; b < c; b++) nb(a[b]);
        Na();
        k.togMainDialog(!1);
        vb();
    }
    function Ac(a) {
        rb();
        a.setState({ show: !0 });
    }
    function Bc(a) {
        a.setState({ show: !1 });
    }
    var ca = Array.isArray,
        x = {};
    var ha = !1;
    var W = { componentComparator: null, createVNode: null, renderComplete: null },
        gb = {
            "xlink:actuate": "http://www.w3.org/1999/xlink",
            "xlink:arcrole": "http://www.w3.org/1999/xlink",
            "xlink:href": "http://www.w3.org/1999/xlink",
            "xlink:role": "http://www.w3.org/1999/xlink",
            "xlink:show": "http://www.w3.org/1999/xlink",
            "xlink:title": "http://www.w3.org/1999/xlink",
            "xlink:type": "http://www.w3.org/1999/xlink",
            "xml:base": "http://www.w3.org/XML/1998/namespace",
            "xml:lang": "http://www.w3.org/XML/1998/namespace",
            "xml:space": "http://www.w3.org/XML/1998/namespace",
        },
        Za = pa(0),
        Da = pa(null),
        fb = pa(!0),
        Ob = da("onInput", qa),
        Nb = da(["onClick", "onChange"], qa);
    db.wrapped = !0;
    var Pb = da("onChange", Fa),
        Qb = da("onInput", Ga),
        Rb = da("onChange"),
        K,
        ua,
        jb = 0;
    "undefined" !== typeof document && window.Node && ((Node.prototype.$EV = null), (Node.prototype.$V = null));
    var va = [],
        Vb =
            "undefined" !== typeof Promise
                ? Promise.resolve().then.bind(Promise.resolve())
                : function (a) {
                      window.setTimeout(a, 0);
                  },
        Ja = !1,
        y = function (a, b) {
            this.state = null;
            this.$BR = !1;
            this.$BS = !0;
            this.$LI = this.$PS = null;
            this.$UN = !1;
            this.$QU = this.$CX = null;
            this.$N = !1;
            this.$L = null;
            this.$SVG = !1;
            this.props = a || x;
            this.context = b || x;
        };
    y.prototype.forceUpdate = function (a) {
        this.$UN || lb(this, {}, a, !0);
    };
    y.prototype.setState = function (a, b) {
        this.$UN || this.$BS || lb(this, a, b, !1);
    };
    y.prototype.render = function (a, b, c) {
        return null;
    };
    let k = {
            Sels: [],
            UpdateUi: function () {
                for (let a in k.Updates) k.Updates[a].forceUpdate();
            },
            Updates: {},
        },
        Ma = { fave: 0, yes: 1, maybe: 2, no: 3, undecided: 4 };
    class tb {
        static inject() {
            document.getElementsByName("image_file")[0].multiple = !0;
            let a = document.getElementById("addimagebutton");
            a.onclick = this.uploadBatchImages;
            a.value = "Add All Images";
        }
        static uploadBatchImages() {
            let a = document.getElementsByName("image_file")[0].files;
            for (var b = 0; b < a.length; b++) {
                let c = a[b];
                setTimeout(function () {
                    tb.originalUploadImage(c);
                }, 1e3 * b);
            }
        }
        static originalUploadImage(a) {
            let b = window;
            b.imageUploading = !0;
            b.$("#addimagebutton").prop("value", "Uploading Image...");
            b.$("#addimagebutton").prop("disabled", !0);
            var c = new FormData();
            c.append("csrf_token", b.FList.csrf_token());
            c.append("character_id", b.editCharacterId);
            c.append("image_file", a);
            b.$.ajax({
                type: "POST",
                url: b.domain + "json/image-add.json",
                data: c,
                dataType: "json",
                processData: !1,
                contentType: !1,
                timeout: 12e4,
                success: function (a) {
                    b.imageUploading = !1;
                    b.$("#addimagebutton").prop("disabled", !1);
                    b.$("#addimagebutton").prop("value", "Add All Images");
                    "" == a.error ? (b.FList.Common_displayNotice("Image added successfully."), b.loadImages(b.editCharacterId)) : b.FList.Common_displayError("Error while uploading image: " + a.error);
                },
                error: function (a, c, f) {
                    b.imageUploading = !1;
                    b.$("#addimagebutton").prop("disabled", !1);
                    b.$("#addimagebutton").prop("value", "Add Image");
                    b.FList.Common_displayError("Error while uploading image: " + c + ", " + f);
                },
            });
            return !1;
        }
    }
    let R = new Map();
    class Bb {
        constructor() {
            this.b = {};
            this.a = [];
        }
        set(a, b) {
            let c = this.a,
                d = a.id,
                e = La(c, d);
            this.b[d] = a;
            0 <= e ? (c[e] = a) : b ? c.unshift(a) : c.push(a);
        }
        fset(a) {
            this.b[a.id] = a;
            this.a.push(a);
        }
        rem(a) {
            let b = this.a;
            a = a.id;
            let c = La(b, a);
            delete this.b[a];
            0 <= c && b.splice(c, 1);
        }
        clear() {
            this.a.length = 0;
            this.b = {};
        }
    }
    class Cc {
        constructor() {
            this.a = {};
            this.b = {};
        }
        set(a, b) {
            let c = this.b,
                d = a.id;
            this.remK(d);
            this.a[d] = b;
            for (let d = 0, f = b.length; d < f; d++) c[b[d].id] = a;
        }
        add(a, b) {
            let c = this.b,
                d = a.id;
            this.remV(b.id);
            let e = this.a[d];
            e ? e.push(b) : (this.a[d] = [b]);
            c[b.id] = a;
        }
        remV(a) {
            let b = this.b;
            var c = b[a];
            if (c && (c = this.a[c.id])) {
                let b = La(c, a);
                0 <= b && c.splice(b, 1);
            }
            delete b[a];
        }
        remK(a) {
            let b = this.a[a];
            if (b) {
                let c = this.b;
                for (let a = 0, e = b.length; a < e; a++) delete c[b[a].id];
                delete this.a[a];
            }
        }
        clear() {
            this.a = {};
            this.b = {};
        }
    }
    let C = new Bb(),
        N = new Bb(),
        A = new Cc(),
        S,
        qb = window.FList,
        sb = !1,
        T = !1,
        O,
        U,
        ia,
        Cb = window.FList,
        Dc = Cb.Subfetish.Data.removeCustom;
    Cb.Subfetish.Data.removeCustom = function (a) {
        let b = 500 < parseInt(a) ? a : "N" + a;
        pb(C.b[b]);
        vb();
        Dc(a);
    };
    class Ec extends y {
        constructor(...a) {
            super(...a);
            this.state = {};
        }
        render(a, b) {
            a = b.sel;
            return r(
                1,
                "div",
                "sel-kink-div",
                [r(256, "select", wa(["sel-kink", "none", "X" === a]), b.opts, 0, { value: a, onChange: z(bc, this) }), l(2, E, { clazz: "sel-kink-x x-btn btn-l", isDisabled: "X" === a, opClick: z(cc, this), children: "\u00d7" })],
                4
            );
        }
        shouldComponentUpdate(a, b) {
            a = this.state;
            return a.sel !== b.sel || a.opts !== b.opts;
        }
        static getDerivedStateFromProps(a, b) {
            let c;
            b.sel || (c = { sel: a.sel });
            b.opts || (c ? (c.opts = U) : (c = { opts: U }));
            return c;
        }
    }
    class Fc extends y {
        constructor(...a) {
            super(...a);
            this.state = {};
            this.ref = { current: null };
        }
        render(a, b) {
            a = b.kink;
            let c = b.subs && 0 < b.subs.length,
                d = a._o;
            return r(1, "li", wa([a.choice, "kink", "multi", c, "open", c && d, "closed", c && !d, "sel", b.sel, "custom", a._c, "reg", !a._c, "new", !a._p]), [a.name, l(2, Db, { kinks: b.subs })], 0, null, null, this.ref);
        }
        componentDidMount() {
            this.ref.current._k = this;
        }
        componentDidUpdate() {
            this.ref.current._k = this;
        }
        static getDerivedStateFromProps(a, b) {
            var c = null;
            for (var d in a) {
                let e = a[d];
                Ka(e, b[d]) || (c || (c = {}), (c[d] = e));
            }
            d = a.kink || b.kink;
            (a.kink && b.kink && a.kink.id === b.kink.id) || (c.subs = d._c ? A.a[d.id] : null);
            a = 0 <= k.Sels.indexOf(d);
            a !== b.sel && (c || (c = {}), (c.sel = a));
            return c;
        }
    }
    class Db extends y {
        render(a) {
            let b = a.kinks;
            return b
                ? r(
                      1,
                      "ul",
                      a.clazz || "subkinks",
                      b.map((a) => l(2, Fc, { kink: a }, a.id)),
                      8
                  )
                : null;
        }
    }
    class ka extends y {
        render(a, b) {
            a = a.name;
            a = a[0].toUpperCase() + a.substring(1);
            return r(1, "div", "box", [r(1, "div", null, a, 16), l(2, Db, { clazz: "kinks", kinks: b.kinks })], 4);
        }
        static getDerivedStateFromProps(a, b) {
            b = [];
            var c = C.a;
            a = a.name;
            for (let e = 0, f = c.length; e < f; e++) {
                var d = c[e];
                d.choice === a && b.push(d);
            }
            c = N.a;
            d = A.b;
            for (let e = 0, f = c.length; e < f; e++) {
                let f = c[e];
                d[f.id] || (f.choice === a && b.push(f));
            }
            return { kinks: b };
        }
    }
    let ja,
        V = null,
        mc = { prop: !0, state: !0, opChange: !0, children: !0 };
    class Gc extends y {
        render(a) {
            let b = Qa(a);
            return Ba(r(64, "input", null, null, 1, { ...b, value: Pa(a), onInput: z(Oa, this) }));
        }
    }
    class Hc extends y {
        render(a) {
            let b = Qa(a);
            return Ba(r(128, "textarea", null, null, 1, { ...b, value: Pa(a), onInput: z(Oa, this) }));
        }
    }
    class Eb extends y {
        render(a) {
            let b = Qa(a);
            return Ba(r(256, "select", null, a.children, 0, { ...b, value: Pa(a), onChange: z(Oa, this) }));
        }
    }
    let oc = 0;
    class Ic extends y {
        constructor(...a) {
            super(...a);
            this.state = {};
        }
        componentDidMount() {
            k.initEditDialog = (a, b) => {
                b ? this.setState({ kink: { _o: !1, _p: !1, _c: !0, id: "", name: "", description: "", choice: "fave" }, oldKink: null }) : a ? ((b = Object.assign({}, a)), this.setState({ kink: b, oldKink: a })) : this.clear();
            };
        }
        clear() {
            this.setState({ kink: null, oldKink: null });
        }
        render(a, b) {
            var c = b.kink;
            c = (a = !!c) && !c._c;
            return (
                a &&
                l(2, wb, {
                    size: 1,
                    title: c ? "Info" : b.oldKink ? "Edit" : "Create",
                    opClose: z(zb, this),
                    children: [
                        r(
                            1,
                            "div",
                            "kinkBtns edt-btns",
                            [
                                l(2, E, { opClick: z(zb, this), children: "Cancel" }),
                                l(2, E, { isDisabled: c, clazz: "x-btn red", opClick: z(pc, this), children: "\u00d7 Remove" }),
                                l(2, E, { opClick: z(nc, this), children: "\u2399 Apply" }),
                            ],
                            4
                        ),
                        r(1, "label", "edt-lbl", "Name", 16),
                        l(2, Gc, { disabled: c, class: "edt-inp", type: "text", maxLength: 30, prop: "kink.name", state: b }),
                        r(1, "label", "edt-lbl", "Choice", 16),
                        l(2, Eb, {
                            class: "edt-sel",
                            prop: "kink.choice",
                            state: b,
                            children: [
                                r(1, "option", null, "Favorite", 16, { value: "fave" }),
                                r(1, "option", null, "Yes", 16, { value: "yes" }),
                                r(1, "option", null, "Maybe", 16, { value: "maybe" }),
                                r(1, "option", null, "No", 16, { value: "no" }),
                                r(1, "option", null, "Undecided", 16, { value: "undecided" }),
                            ],
                        }),
                        r(1, "label", "edt-lbl", "Description", 16),
                        l(2, Hc, { disabled: c, class: "edt-txt", maxLength: 1024, prop: "kink.description", state: b }),
                    ],
                })
            );
        }
    }
    let Y = [173, 847, 1564, 6068, 6069, 6155, 6156, 6157, 6158, 8203, 8204, 8205, 8206, 8207, 8234, 8236, 8237, 8288, 8289, 8290, 8291, 8292, 8293, 8294, 8296, 8297, 8298, 8299, 8300, 8301, 8302, 8303];
    class Jc extends y {
        constructor(...a) {
            super(...a);
            this.state = { num: -1 };
        }
        componentDidMount() {
            k.Updates.HB = this;
        }
        render(a, b) {
            a = (a = k.Sels[k.Sels.length - 1]) ? Y.indexOf(a.name.charCodeAt(0)) : -1;
            b.num = 0 <= a ? Y[a] : -1;
            return oa(
                [
                    l(2, E, { clazz: "x-btn btn-f", opClick: z(rc, this), children: "\u25ce Header" }),
                    l(2, E, { clazz: "x-btn btn-n", opClick: z(sc, this), children: "\u25ce Content" }),
                    l(2, E, { clazz: "x-btn btn-n", opClick: z(tc, this), children: "\u25ce Footer" }),
                    l(2, Eb, { class: "x-sel", prop: "num", state: b, ilk: 1, opChange: z(uc, this), children: [r(1, "option", null, "X", 16, { value: -1 }, -1), Y.map((a, b) => r(1, "option", null, b + ": " + a, 16, { value: a }, a))] }),
                ],
                4
            );
        }
    }
    class Kc extends y {
        render() {
            return r(
                1,
                "div",
                "kinkBtns",
                [
                    l(2, E, { clazz: "x-btn btn-f btn-sm", opClick: z(vc), children: "\u2296" }),
                    l(2, E, { clazz: "x-btn btn-l btn-sm", opClick: z(wc), children: "\u2295" }),
                    l(2, Jc),
                    l(2, E, { clazz: "x-btn btn-f green", opClick: z(xc), children: "\uff0b Custom Kink" }),
                    l(2, E, { clazz: "x-btn btn-l red", opClick: z(yc), children: "\u00d7 Custom Kink" }),
                    l(2, E, { opClick: z(zc), children: "Apply Changes To Page" }),
                ],
                4
            );
        }
    }
    class Lc extends y {
        componentDidMount() {
            k.Updates.MB = this;
        }
        render() {
            {
                C.a.sort(xa);
                N.a.sort(xa);
                let a = C.a,
                    b = A.a;
                for (let c = 0, d = a.length; c < d; c++) {
                    let d = b[a[c].id];
                    d && d.sort(xa);
                }
            }
            return r(1, "div", "boxes", [l(2, ka, { name: "fave" }), l(2, ka, { name: "yes" }), l(2, ka, { name: "maybe" }), l(2, ka, { name: "no" }), l(2, ka, { name: "undecided" })], 4, null, null, lc);
        }
    }
    class Mc extends y {
        constructor(...a) {
            super(...a);
            this.state = {};
            this.div = { current: null };
        }
        componentDidMount() {
            k.ToolTip = this;
        }
        componentDidUpdate() {
            var a = this.div.current;
            let b = this.state;
            if (a && b.id) {
                var c = a.style;
                a = Math.round(b.y - a.clientHeight - b.ft - 5);
                0 > a && (a = Math.round(b.y + b.eh - b.ft + 5));
                c.top = a + "px";
                c.left = Math.round(b.x - b.fl) + "px";
            }
        }
        render(a, b) {
            return r(
                1,
                "div",
                "x-tt ui-tooltip qtip ui-helper-reset ui-tooltip-shadow ui-tooltip-pos-tc ui-widfget ui-tfooltip-focus",
                [
                    r(1, "div", "ui-tooltip-titlebar ui-widget-header", r(1, "div", "ui-tooltip-title", b.title || "", 16, { id: "ui-tooltip-4-title" }), 2),
                    r(1, "div", "ui-tooltip-content ui-widget-content", b.body || "", 16, { id: "ui-tooltip-4-content" }),
                ],
                4,
                { style: b.id ? "" : "display: none" },
                null,
                this.div
            );
        }
        showTip(a, b, c, d, e, f) {
            if (this.state.id !== a) {
                let g = d.getBoundingClientRect();
                this.setState({ id: a, title: b, body: c, x: g.x, y: g.y, eh: e || d.offsetHeight, fl: f ? f.offsetLeft : 0, ft: f ? f.offsetTop : 0 });
            }
        }
        clearTip() {
            this.setState({ id: null });
        }
    }
    class Nc extends y {
        render() {
            return r(1, "div", "kinkInf", [l(2, Kc), l(2, Lc), l(2, Mc), l(2, Ic)], 4);
        }
    }
    class Oc extends y {
        constructor(...a) {
            super(...a);
            this.state = { show: !1 };
        }
        componentDidMount() {
            k.togMainDialog = (a) => this.setState({ show: a });
        }
        componentDidUpdate() {
            document.body.style.overflow = this.state.show ? "hidden" : "";
        }
        render(a, b) {
            return oa([l(2, E, { opClick: z(Ac, this), children: "Show Table" }), b.show && l(2, wb, { title: "Kinks", opClose: z(Bc, this), children: l(2, Nc) })], 0);
        }
    }
    (function (a) {
        let b = document.head,
            c = document.createElement("style");
        c.type = "text/css";
        c.styleSheet ? (c.styleSheet.cssText = a) : ((a = document.createTextNode(a)), c.appendChild(a));
        b.appendChild(c);
    })(
        ".Dialog{width:100%;height:100vh;left:0;top:0;padding:0;margin:0;background:rgba(0,0,0,.5);position:fixed;z-index:100;text-align:center}.bp{text-align:left;border:2px solid #0b345f;color:#ccc;background:-webkit-gradient(linear,left bottom,left top,color-stop(0,#134478),color-stop(1,#2468af));height:96%;margin-top:calc(2% - 10px);width:96%;margin-left:calc(2% - 10px);padding:10px}.bp.bp-s1{height:auto;width:auto;display:inline-block;margin-top:calc(10% - 10px)}.x-tt{opacity:1;display:block;width:280px;z-index:15007}.bp-s0>.bp-c{height:calc(96vh - 37px)}.bp-h{margin-bottom:10px;text-align:right}.bp-hh{margin:0;float:left}.bp-hi{cursor:pointer}.bp-c{overflow:auto;padding:5px}.boxes{outline:0;height:calc(100% - 250px)}.box,.boxes{text-align:center}.box{vertical-align:top;margin:5px;max-width:19%;color:#fff;height:100%}.box,.box>.kinks{display:inline-block}.box>.kinks{cursor:default;padding:6px 4px;border:2px solid #4f94cd;border-radius:4px;text-align:left;vertical-align:middle;max-height:100%;overflow:auto;width:300px;max-width:100%;-webkit-touch-callout:none;-webkit-user-select:none;-khtml-user-select:none;-moz-user-select:none;-ms-user-select:none;user-select:none;color:#000;overflow-x:hidden}.kink{font-size:13.5px;line-height:15px;margin-top:-1px;white-space:nowrap;cursor:pointer}ul{list-style:none}.subkinks{padding-left:0;cursor:default}.kink:hover{font-weight:700}.fave{background-color:#ccf}.fave:before{content:url(https://static.f-list.net/images/icons/heart.png)}.yes{background-color:#cfc}.yes:before{content:url(https://static.f-list.net/images/icons/heart-half.png)}.maybe{background-color:#ffc}.maybe:before{content:url(https://static.f-list.net/images/icons/heart-empty.png)}.no{background-color:#fcc}.no:before{content:url(https://static.f-list.net/images/icons/minus-circle.png)}.undecided{background-color:#ffdfcc}.undecided:before{content:url(https://static.f-list.net/images/icons/question.png)}.custom{background-image:url(https://static.f-list.net/images/icons/target.png)}.closed,.custom{background-repeat:no-repeat;background-position:0 1px}.closed{background-image:url(https://static.f-list.net/images/icons/plus-white.png)}.open{background-image:url(https://static.f-list.net/images/icons/minus-white.png)}.new,.open{background-repeat:no-repeat;background-position:0 1px}.new{background-image:url(https://static.f-list.net/images/icons/new.png)}.reg{background-image:url(https://static.f-list.net/images/icons/blue-document-tag.png);background-repeat:no-repeat;background-position:0 1px;font-weight:400;color:#000}.subkinks>.kink{padding-left:18px;background-position:18px 0}.kink:before{margin-left:14px}.sel{background-color:rgb(30 144 255);color:#fff}.drag .sel{background-color:rgb(134 192 249)}.closed>ul{display:none}.x-sel{border-radius:0 6px 6px 0;height:27px;width:40px}.x-btn{display:inline-block;padding:.4em 1em;margin:10px 0 0 10px;border:1px solid #04194f;background:#04396f url(https://static.f-list.net/images/jquery/default/ui-bg_highlight-soft_20_04396f_1x100.png) 50% 50% repeat-x;font-weight:400;color:#dde;cursor:pointer;border-radius:6px}.x-btn:focus,.x-btn:hover{border:1px solid #04194f;background:#04396f url(https://static.f-list.net/images/jquery/default/ui-bg_glass_40_04396f_1x400.png) 50% 50% repeat-x}.x-btn:active{border:1px solid #0b244f;background:#bf1213 url(https://static.f-list.net/images/jquery/default/ui-bg_highlight-hard_30_bf1213_1x100.png) 50% 50% repeat-x}.x-btn.red{background:-webkit-linear-gradient(top,#e62012,#9a1710)}.x-btn.red:hover{background:-webkit-linear-gradient(top,#f33729,#cb190f)}.x-btn.green{background:-webkit-linear-gradient(top,#1fe612,#139a10)}.x-btn.green:hover{background:-webkit-linear-gradient(top,#2cf329,#2ecb0f)}.x-btn.x-dis.x-dis{cursor:default;color:#ccc;background:#04396f url(https://static.f-list.net/images/jquery/default/ui-bg_highlight-soft_20_04396f_1x100.png) 50% 50% repeat-x}.btn-sm{padding:.4em .8em}.btn-l,.btn-n{margin:0}.btn-f{border-radius:6px 0 0 6px}.btn-l{border-radius:0 6px 6px 0}.btn-n{border-radius:0}.kinkBtns{text-align:right;margin-bottom:4px;margin-top:-15px}.kinkInf{height:100%}.edt-inp{font-size:13.67px}.edt-inp:disabled,.edt-sel:disabled,.edt-txt:disabled{background-color:#b1c7dd;border-radius:5px}.edt-inp,.edt-sel,.edt-txt{opacity:1;margin-bottom:4px;width:99%;color:#000;border:1px solid rgb(103 136 171)}.edt-sel{width:calc(99% + 6px)}.edt-lbl{color:#fff;font-weight:700;text-decoration:none;display:block;cursor:default}.edt-btn{float:right}.edt-btns{min-width:350px}.Characterdata_FetishChoiceBox{margin-top:-5px;padding:0}.sel-kink-div{position:absolute;right:0;display:block;margin-top:-2px}.sel-kink{border-radius:5px 0 0 5px;margin-left:8px;height:15px;font-size:11.33px!important;border:1px solid #000}.sel-kink-x{display:inline-block;padding:0 3px 2px 1px;vertical-align:top;text-decoration:none!important;height:11px;margin:0 0 0 -1px}.opt-kink{color:#000}.opt-kink:before{content:normal}.sel-kink.none{background:transparent;color:#fff;border:1px solid #07203a}"
    );
    let Fb = document.querySelectorAll("[name='customkinkchoice[]'");
    for (let a = 0, b = Fb.length; a < b; a++) {
        let b = Fb[a];
        if (5 <= b.childElementCount) continue;
        let d = document.createElement("option");
        d.value = "undecided";
        d.textContent = "Undecided";
        b.appendChild(d);
        if (0 === b.selectedIndex && null === b.firstElementChild.getAttribute("selected")) {
            let a = !1;
            for (let c = 0, d = b.options, e = d.length; c < e; c++)
                if (null !== d[c].getAttribute("selected")) {
                    a = !0;
                    b.selectedIndex = c;
                    break;
                }
            a || (b.selectedIndex = 4);
        }
    }
    rb();
    let Gb = new DocumentFragment();
    kb(l(2, Oc), Gb);
    let Pc = Gb.firstElementChild;
    (function (a, b) {
        let c = a.parentElement;
        if (c) return c.insertBefore(b, a);
    })(document.getElementById("CustomKinksList"), Pc);
    (function () {
        U = ub();
        var a = N.a,
            b = A.b,
            c = Array(a.length);
        for (let f = 0, g = a.length; f < g; f++) {
            var d = a[f],
                e = b[d.id];
            c[f] = l(2, Ec, { kink: d, sel: e ? e.id : "X", opts: U }, d.id);
        }
        ia = c;
        a = {};
        for (let c = 0, d = ia.length; c < d; c++) (b = ia[c]), (a[b.props.kink.id] = b);
        b = document.querySelectorAll(".FetishItem");
        for (let f = 0, g = b.length; f < g; f++) if (((c = b[f]), (d = c.id.substring(10)), (d = a[d]))) (e = new DocumentFragment()), kb(d, e), c.children[2].appendChild(e.firstElementChild);
    })();
})();