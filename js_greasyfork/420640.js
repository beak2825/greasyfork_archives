// ==UserScript==
// @name         none
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  try to take over the world!
// @author       You
// @match        https://www.tcpjw.com/B2BHall/
// @grant        none
// @run-at document-idle
// @downloadURL https://update.greasyfork.org/scripts/420640/none.user.js
// @updateURL https://update.greasyfork.org/scripts/420640/none.meta.js
// ==/UserScript==

(function () {
    'use strict';
    /*! jQuery v2.1.4 | (c) 2005, 2015 jQuery Foundation, Inc. | jquery.org/license */
    !function (a, b) { "object" == typeof module && "object" == typeof module.exports ? module.exports = a.document ? b(a, !0) : function (a) { if (!a.document) throw new Error("jQuery requires a window with a document"); return b(a) } : b(a) }("undefined" != typeof window ? window : this, function (a, b) {
        var c = [], d = c.slice, e = c.concat, f = c.push, g = c.indexOf, h = {}, i = h.toString, j = h.hasOwnProperty, k = {}, l = a.document, m = "2.1.4", n = function (a, b) { return new n.fn.init(a, b) }, o = /^[\s\uFEFF\xA0]+|[\s\uFEFF\xA0]+$/g, p = /^-ms-/, q = /-([\da-z])/gi, r = function (a, b) { return b.toUpperCase() }; n.fn = n.prototype = { jquery: m, constructor: n, selector: "", length: 0, toArray: function () { return d.call(this) }, get: function (a) { return null != a ? 0 > a ? this[a + this.length] : this[a] : d.call(this) }, pushStack: function (a) { var b = n.merge(this.constructor(), a); return b.prevObject = this, b.context = this.context, b }, each: function (a, b) { return n.each(this, a, b) }, map: function (a) { return this.pushStack(n.map(this, function (b, c) { return a.call(b, c, b) })) }, slice: function () { return this.pushStack(d.apply(this, arguments)) }, first: function () { return this.eq(0) }, last: function () { return this.eq(-1) }, eq: function (a) { var b = this.length, c = +a + (0 > a ? b : 0); return this.pushStack(c >= 0 && b > c ? [this[c]] : []) }, end: function () { return this.prevObject || this.constructor(null) }, push: f, sort: c.sort, splice: c.splice }, n.extend = n.fn.extend = function () { var a, b, c, d, e, f, g = arguments[0] || {}, h = 1, i = arguments.length, j = !1; for ("boolean" == typeof g && (j = g, g = arguments[h] || {}, h++), "object" == typeof g || n.isFunction(g) || (g = {}), h === i && (g = this, h--); i > h; h++)if (null != (a = arguments[h])) for (b in a) c = g[b], d = a[b], g !== d && (j && d && (n.isPlainObject(d) || (e = n.isArray(d))) ? (e ? (e = !1, f = c && n.isArray(c) ? c : []) : f = c && n.isPlainObject(c) ? c : {}, g[b] = n.extend(j, f, d)) : void 0 !== d && (g[b] = d)); return g }, n.extend({ expando: "jQuery" + (m + Math.random()).replace(/\D/g, ""), isReady: !0, error: function (a) { throw new Error(a) }, noop: function () { }, isFunction: function (a) { return "function" === n.type(a) }, isArray: Array.isArray, isWindow: function (a) { return null != a && a === a.window }, isNumeric: function (a) { return !n.isArray(a) && a - parseFloat(a) + 1 >= 0 }, isPlainObject: function (a) { return "object" !== n.type(a) || a.nodeType || n.isWindow(a) ? !1 : a.constructor && !j.call(a.constructor.prototype, "isPrototypeOf") ? !1 : !0 }, isEmptyObject: function (a) { var b; for (b in a) return !1; return !0 }, type: function (a) { return null == a ? a + "" : "object" == typeof a || "function" == typeof a ? h[i.call(a)] || "object" : typeof a }, globalEval: function (a) { var b, c = eval; a = n.trim(a), a && (1 === a.indexOf("use strict") ? (b = l.createElement("script"), b.text = a, l.head.appendChild(b).parentNode.removeChild(b)) : c(a)) }, camelCase: function (a) { return a.replace(p, "ms-").replace(q, r) }, nodeName: function (a, b) { return a.nodeName && a.nodeName.toLowerCase() === b.toLowerCase() }, each: function (a, b, c) { var d, e = 0, f = a.length, g = s(a); if (c) { if (g) { for (; f > e; e++)if (d = b.apply(a[e], c), d === !1) break } else for (e in a) if (d = b.apply(a[e], c), d === !1) break } else if (g) { for (; f > e; e++)if (d = b.call(a[e], e, a[e]), d === !1) break } else for (e in a) if (d = b.call(a[e], e, a[e]), d === !1) break; return a }, trim: function (a) { return null == a ? "" : (a + "").replace(o, "") }, makeArray: function (a, b) { var c = b || []; return null != a && (s(Object(a)) ? n.merge(c, "string" == typeof a ? [a] : a) : f.call(c, a)), c }, inArray: function (a, b, c) { return null == b ? -1 : g.call(b, a, c) }, merge: function (a, b) { for (var c = +b.length, d = 0, e = a.length; c > d; d++)a[e++] = b[d]; return a.length = e, a }, grep: function (a, b, c) { for (var d, e = [], f = 0, g = a.length, h = !c; g > f; f++)d = !b(a[f], f), d !== h && e.push(a[f]); return e }, map: function (a, b, c) { var d, f = 0, g = a.length, h = s(a), i = []; if (h) for (; g > f; f++)d = b(a[f], f, c), null != d && i.push(d); else for (f in a) d = b(a[f], f, c), null != d && i.push(d); return e.apply([], i) }, guid: 1, proxy: function (a, b) { var c, e, f; return "string" == typeof b && (c = a[b], b = a, a = c), n.isFunction(a) ? (e = d.call(arguments, 2), f = function () { return a.apply(b || this, e.concat(d.call(arguments))) }, f.guid = a.guid = a.guid || n.guid++, f) : void 0 }, now: Date.now, support: k }), n.each("Boolean Number String Function Array Date RegExp Object Error".split(" "), function (a, b) { h["[object " + b + "]"] = b.toLowerCase() }); function s(a) { var b = "length" in a && a.length, c = n.type(a); return "function" === c || n.isWindow(a) ? !1 : 1 === a.nodeType && b ? !0 : "array" === c || 0 === b || "number" == typeof b && b > 0 && b - 1 in a } var t = function (a) { var b, c, d, e, f, g, h, i, j, k, l, m, n, o, p, q, r, s, t, u = "sizzle" + 1 * new Date, v = a.document, w = 0, x = 0, y = ha(), z = ha(), A = ha(), B = function (a, b) { return a === b && (l = !0), 0 }, C = 1 << 31, D = {}.hasOwnProperty, E = [], F = E.pop, G = E.push, H = E.push, I = E.slice, J = function (a, b) { for (var c = 0, d = a.length; d > c; c++)if (a[c] === b) return c; return -1 }, K = "checked|selected|async|autofocus|autoplay|controls|defer|disabled|hidden|ismap|loop|multiple|open|readonly|required|scoped", L = "[\\x20\\t\\r\\n\\f]", M = "(?:\\\\.|[\\w-]|[^\\x00-\\xa0])+", N = M.replace("w", "w#"), O = "\\[" + L + "*(" + M + ")(?:" + L + "*([*^$|!~]?=)" + L + "*(?:'((?:\\\\.|[^\\\\'])*)'|\"((?:\\\\.|[^\\\\\"])*)\"|(" + N + "))|)" + L + "*\\]", P = ":(" + M + ")(?:\\((('((?:\\\\.|[^\\\\'])*)'|\"((?:\\\\.|[^\\\\\"])*)\")|((?:\\\\.|[^\\\\()[\\]]|" + O + ")*)|.*)\\)|)", Q = new RegExp(L + "+", "g"), R = new RegExp("^" + L + "+|((?:^|[^\\\\])(?:\\\\.)*)" + L + "+$", "g"), S = new RegExp("^" + L + "*," + L + "*"), T = new RegExp("^" + L + "*([>+~]|" + L + ")" + L + "*"), U = new RegExp("=" + L + "*([^\\]'\"]*?)" + L + "*\\]", "g"), V = new RegExp(P), W = new RegExp("^" + N + "$"), X = { ID: new RegExp("^#(" + M + ")"), CLASS: new RegExp("^\\.(" + M + ")"), TAG: new RegExp("^(" + M.replace("w", "w*") + ")"), ATTR: new RegExp("^" + O), PSEUDO: new RegExp("^" + P), CHILD: new RegExp("^:(only|first|last|nth|nth-last)-(child|of-type)(?:\\(" + L + "*(even|odd|(([+-]|)(\\d*)n|)" + L + "*(?:([+-]|)" + L + "*(\\d+)|))" + L + "*\\)|)", "i"), bool: new RegExp("^(?:" + K + ")$", "i"), needsContext: new RegExp("^" + L + "*[>+~]|:(even|odd|eq|gt|lt|nth|first|last)(?:\\(" + L + "*((?:-\\d)?\\d*)" + L + "*\\)|)(?=[^-]|$)", "i") }, Y = /^(?:input|select|textarea|button)$/i, Z = /^h\d$/i, $ = /^[^{]+\{\s*\[native \w/, _ = /^(?:#([\w-]+)|(\w+)|\.([\w-]+))$/, aa = /[+~]/, ba = /'|\\/g, ca = new RegExp("\\\\([\\da-f]{1,6}" + L + "?|(" + L + ")|.)", "ig"), da = function (a, b, c) { var d = "0x" + b - 65536; return d !== d || c ? b : 0 > d ? String.fromCharCode(d + 65536) : String.fromCharCode(d >> 10 | 55296, 1023 & d | 56320) }, ea = function () { m() }; try { H.apply(E = I.call(v.childNodes), v.childNodes), E[v.childNodes.length].nodeType } catch (fa) { H = { apply: E.length ? function (a, b) { G.apply(a, I.call(b)) } : function (a, b) { var c = a.length, d = 0; while (a[c++] = b[d++]); a.length = c - 1 } } } function ga(a, b, d, e) { var f, h, j, k, l, o, r, s, w, x; if ((b ? b.ownerDocument || b : v) !== n && m(b), b = b || n, d = d || [], k = b.nodeType, "string" != typeof a || !a || 1 !== k && 9 !== k && 11 !== k) return d; if (!e && p) { if (11 !== k && (f = _.exec(a))) if (j = f[1]) { if (9 === k) { if (h = b.getElementById(j), !h || !h.parentNode) return d; if (h.id === j) return d.push(h), d } else if (b.ownerDocument && (h = b.ownerDocument.getElementById(j)) && t(b, h) && h.id === j) return d.push(h), d } else { if (f[2]) return H.apply(d, b.getElementsByTagName(a)), d; if ((j = f[3]) && c.getElementsByClassName) return H.apply(d, b.getElementsByClassName(j)), d } if (c.qsa && (!q || !q.test(a))) { if (s = r = u, w = b, x = 1 !== k && a, 1 === k && "object" !== b.nodeName.toLowerCase()) { o = g(a), (r = b.getAttribute("id")) ? s = r.replace(ba, "\\$&") : b.setAttribute("id", s), s = "[id='" + s + "'] ", l = o.length; while (l--) o[l] = s + ra(o[l]); w = aa.test(a) && pa(b.parentNode) || b, x = o.join(",") } if (x) try { return H.apply(d, w.querySelectorAll(x)), d } catch (y) { } finally { r || b.removeAttribute("id") } } } return i(a.replace(R, "$1"), b, d, e) } function ha() { var a = []; function b(c, e) { return a.push(c + " ") > d.cacheLength && delete b[a.shift()], b[c + " "] = e } return b } function ia(a) { return a[u] = !0, a } function ja(a) { var b = n.createElement("div"); try { return !!a(b) } catch (c) { return !1 } finally { b.parentNode && b.parentNode.removeChild(b), b = null } } function ka(a, b) { var c = a.split("|"), e = a.length; while (e--) d.attrHandle[c[e]] = b } function la(a, b) { var c = b && a, d = c && 1 === a.nodeType && 1 === b.nodeType && (~b.sourceIndex || C) - (~a.sourceIndex || C); if (d) return d; if (c) while (c = c.nextSibling) if (c === b) return -1; return a ? 1 : -1 } function ma(a) { return function (b) { var c = b.nodeName.toLowerCase(); return "input" === c && b.type === a } } function na(a) { return function (b) { var c = b.nodeName.toLowerCase(); return ("input" === c || "button" === c) && b.type === a } } function oa(a) { return ia(function (b) { return b = +b, ia(function (c, d) { var e, f = a([], c.length, b), g = f.length; while (g--) c[e = f[g]] && (c[e] = !(d[e] = c[e])) }) }) } function pa(a) { return a && "undefined" != typeof a.getElementsByTagName && a } c = ga.support = {}, f = ga.isXML = function (a) { var b = a && (a.ownerDocument || a).documentElement; return b ? "HTML" !== b.nodeName : !1 }, m = ga.setDocument = function (a) { var b, e, g = a ? a.ownerDocument || a : v; return g !== n && 9 === g.nodeType && g.documentElement ? (n = g, o = g.documentElement, e = g.defaultView, e && e !== e.top && (e.addEventListener ? e.addEventListener("unload", ea, !1) : e.attachEvent && e.attachEvent("onunload", ea)), p = !f(g), c.attributes = ja(function (a) { return a.className = "i", !a.getAttribute("className") }), c.getElementsByTagName = ja(function (a) { return a.appendChild(g.createComment("")), !a.getElementsByTagName("*").length }), c.getElementsByClassName = $.test(g.getElementsByClassName), c.getById = ja(function (a) { return o.appendChild(a).id = u, !g.getElementsByName || !g.getElementsByName(u).length }), c.getById ? (d.find.ID = function (a, b) { if ("undefined" != typeof b.getElementById && p) { var c = b.getElementById(a); return c && c.parentNode ? [c] : [] } }, d.filter.ID = function (a) { var b = a.replace(ca, da); return function (a) { return a.getAttribute("id") === b } }) : (delete d.find.ID, d.filter.ID = function (a) { var b = a.replace(ca, da); return function (a) { var c = "undefined" != typeof a.getAttributeNode && a.getAttributeNode("id"); return c && c.value === b } }), d.find.TAG = c.getElementsByTagName ? function (a, b) { return "undefined" != typeof b.getElementsByTagName ? b.getElementsByTagName(a) : c.qsa ? b.querySelectorAll(a) : void 0 } : function (a, b) { var c, d = [], e = 0, f = b.getElementsByTagName(a); if ("*" === a) { while (c = f[e++]) 1 === c.nodeType && d.push(c); return d } return f }, d.find.CLASS = c.getElementsByClassName && function (a, b) { return p ? b.getElementsByClassName(a) : void 0 }, r = [], q = [], (c.qsa = $.test(g.querySelectorAll)) && (ja(function (a) { o.appendChild(a).innerHTML = "<a id='" + u + "'></a><select id='" + u + "-\f]' msallowcapture=''><option selected=''></option></select>", a.querySelectorAll("[msallowcapture^='']").length && q.push("[*^$]=" + L + "*(?:''|\"\")"), a.querySelectorAll("[selected]").length || q.push("\\[" + L + "*(?:value|" + K + ")"), a.querySelectorAll("[id~=" + u + "-]").length || q.push("~="), a.querySelectorAll(":checked").length || q.push(":checked"), a.querySelectorAll("a#" + u + "+*").length || q.push(".#.+[+~]") }), ja(function (a) { var b = g.createElement("input"); b.setAttribute("type", "hidden"), a.appendChild(b).setAttribute("name", "D"), a.querySelectorAll("[name=d]").length && q.push("name" + L + "*[*^$|!~]?="), a.querySelectorAll(":enabled").length || q.push(":enabled", ":disabled"), a.querySelectorAll("*,:x"), q.push(",.*:") })), (c.matchesSelector = $.test(s = o.matches || o.webkitMatchesSelector || o.mozMatchesSelector || o.oMatchesSelector || o.msMatchesSelector)) && ja(function (a) { c.disconnectedMatch = s.call(a, "div"), s.call(a, "[s!='']:x"), r.push("!=", P) }), q = q.length && new RegExp(q.join("|")), r = r.length && new RegExp(r.join("|")), b = $.test(o.compareDocumentPosition), t = b || $.test(o.contains) ? function (a, b) { var c = 9 === a.nodeType ? a.documentElement : a, d = b && b.parentNode; return a === d || !(!d || 1 !== d.nodeType || !(c.contains ? c.contains(d) : a.compareDocumentPosition && 16 & a.compareDocumentPosition(d))) } : function (a, b) { if (b) while (b = b.parentNode) if (b === a) return !0; return !1 }, B = b ? function (a, b) { if (a === b) return l = !0, 0; var d = !a.compareDocumentPosition - !b.compareDocumentPosition; return d ? d : (d = (a.ownerDocument || a) === (b.ownerDocument || b) ? a.compareDocumentPosition(b) : 1, 1 & d || !c.sortDetached && b.compareDocumentPosition(a) === d ? a === g || a.ownerDocument === v && t(v, a) ? -1 : b === g || b.ownerDocument === v && t(v, b) ? 1 : k ? J(k, a) - J(k, b) : 0 : 4 & d ? -1 : 1) } : function (a, b) { if (a === b) return l = !0, 0; var c, d = 0, e = a.parentNode, f = b.parentNode, h = [a], i = [b]; if (!e || !f) return a === g ? -1 : b === g ? 1 : e ? -1 : f ? 1 : k ? J(k, a) - J(k, b) : 0; if (e === f) return la(a, b); c = a; while (c = c.parentNode) h.unshift(c); c = b; while (c = c.parentNode) i.unshift(c); while (h[d] === i[d]) d++; return d ? la(h[d], i[d]) : h[d] === v ? -1 : i[d] === v ? 1 : 0 }, g) : n }, ga.matches = function (a, b) { return ga(a, null, null, b) }, ga.matchesSelector = function (a, b) { if ((a.ownerDocument || a) !== n && m(a), b = b.replace(U, "='$1']"), !(!c.matchesSelector || !p || r && r.test(b) || q && q.test(b))) try { var d = s.call(a, b); if (d || c.disconnectedMatch || a.document && 11 !== a.document.nodeType) return d } catch (e) { } return ga(b, n, null, [a]).length > 0 }, ga.contains = function (a, b) { return (a.ownerDocument || a) !== n && m(a), t(a, b) }, ga.attr = function (a, b) { (a.ownerDocument || a) !== n && m(a); var e = d.attrHandle[b.toLowerCase()], f = e && D.call(d.attrHandle, b.toLowerCase()) ? e(a, b, !p) : void 0; return void 0 !== f ? f : c.attributes || !p ? a.getAttribute(b) : (f = a.getAttributeNode(b)) && f.specified ? f.value : null }, ga.error = function (a) { throw new Error("Syntax error, unrecognized expression: " + a) }, ga.uniqueSort = function (a) { var b, d = [], e = 0, f = 0; if (l = !c.detectDuplicates, k = !c.sortStable && a.slice(0), a.sort(B), l) { while (b = a[f++]) b === a[f] && (e = d.push(f)); while (e--) a.splice(d[e], 1) } return k = null, a }, e = ga.getText = function (a) { var b, c = "", d = 0, f = a.nodeType; if (f) { if (1 === f || 9 === f || 11 === f) { if ("string" == typeof a.textContent) return a.textContent; for (a = a.firstChild; a; a = a.nextSibling)c += e(a) } else if (3 === f || 4 === f) return a.nodeValue } else while (b = a[d++]) c += e(b); return c }, d = ga.selectors = { cacheLength: 50, createPseudo: ia, match: X, attrHandle: {}, find: {}, relative: { ">": { dir: "parentNode", first: !0 }, " ": { dir: "parentNode" }, "+": { dir: "previousSibling", first: !0 }, "~": { dir: "previousSibling" } }, preFilter: { ATTR: function (a) { return a[1] = a[1].replace(ca, da), a[3] = (a[3] || a[4] || a[5] || "").replace(ca, da), "~=" === a[2] && (a[3] = " " + a[3] + " "), a.slice(0, 4) }, CHILD: function (a) { return a[1] = a[1].toLowerCase(), "nth" === a[1].slice(0, 3) ? (a[3] || ga.error(a[0]), a[4] = +(a[4] ? a[5] + (a[6] || 1) : 2 * ("even" === a[3] || "odd" === a[3])), a[5] = +(a[7] + a[8] || "odd" === a[3])) : a[3] && ga.error(a[0]), a }, PSEUDO: function (a) { var b, c = !a[6] && a[2]; return X.CHILD.test(a[0]) ? null : (a[3] ? a[2] = a[4] || a[5] || "" : c && V.test(c) && (b = g(c, !0)) && (b = c.indexOf(")", c.length - b) - c.length) && (a[0] = a[0].slice(0, b), a[2] = c.slice(0, b)), a.slice(0, 3)) } }, filter: { TAG: function (a) { var b = a.replace(ca, da).toLowerCase(); return "*" === a ? function () { return !0 } : function (a) { return a.nodeName && a.nodeName.toLowerCase() === b } }, CLASS: function (a) { var b = y[a + " "]; return b || (b = new RegExp("(^|" + L + ")" + a + "(" + L + "|$)")) && y(a, function (a) { return b.test("string" == typeof a.className && a.className || "undefined" != typeof a.getAttribute && a.getAttribute("class") || "") }) }, ATTR: function (a, b, c) { return function (d) { var e = ga.attr(d, a); return null == e ? "!=" === b : b ? (e += "", "=" === b ? e === c : "!=" === b ? e !== c : "^=" === b ? c && 0 === e.indexOf(c) : "*=" === b ? c && e.indexOf(c) > -1 : "$=" === b ? c && e.slice(-c.length) === c : "~=" === b ? (" " + e.replace(Q, " ") + " ").indexOf(c) > -1 : "|=" === b ? e === c || e.slice(0, c.length + 1) === c + "-" : !1) : !0 } }, CHILD: function (a, b, c, d, e) { var f = "nth" !== a.slice(0, 3), g = "last" !== a.slice(-4), h = "of-type" === b; return 1 === d && 0 === e ? function (a) { return !!a.parentNode } : function (b, c, i) { var j, k, l, m, n, o, p = f !== g ? "nextSibling" : "previousSibling", q = b.parentNode, r = h && b.nodeName.toLowerCase(), s = !i && !h; if (q) { if (f) { while (p) { l = b; while (l = l[p]) if (h ? l.nodeName.toLowerCase() === r : 1 === l.nodeType) return !1; o = p = "only" === a && !o && "nextSibling" } return !0 } if (o = [g ? q.firstChild : q.lastChild], g && s) { k = q[u] || (q[u] = {}), j = k[a] || [], n = j[0] === w && j[1], m = j[0] === w && j[2], l = n && q.childNodes[n]; while (l = ++n && l && l[p] || (m = n = 0) || o.pop()) if (1 === l.nodeType && ++m && l === b) { k[a] = [w, n, m]; break } } else if (s && (j = (b[u] || (b[u] = {}))[a]) && j[0] === w) m = j[1]; else while (l = ++n && l && l[p] || (m = n = 0) || o.pop()) if ((h ? l.nodeName.toLowerCase() === r : 1 === l.nodeType) && ++m && (s && ((l[u] || (l[u] = {}))[a] = [w, m]), l === b)) break; return m -= e, m === d || m % d === 0 && m / d >= 0 } } }, PSEUDO: function (a, b) { var c, e = d.pseudos[a] || d.setFilters[a.toLowerCase()] || ga.error("unsupported pseudo: " + a); return e[u] ? e(b) : e.length > 1 ? (c = [a, a, "", b], d.setFilters.hasOwnProperty(a.toLowerCase()) ? ia(function (a, c) { var d, f = e(a, b), g = f.length; while (g--) d = J(a, f[g]), a[d] = !(c[d] = f[g]) }) : function (a) { return e(a, 0, c) }) : e } }, pseudos: { not: ia(function (a) { var b = [], c = [], d = h(a.replace(R, "$1")); return d[u] ? ia(function (a, b, c, e) { var f, g = d(a, null, e, []), h = a.length; while (h--) (f = g[h]) && (a[h] = !(b[h] = f)) }) : function (a, e, f) { return b[0] = a, d(b, null, f, c), b[0] = null, !c.pop() } }), has: ia(function (a) { return function (b) { return ga(a, b).length > 0 } }), contains: ia(function (a) { return a = a.replace(ca, da), function (b) { return (b.textContent || b.innerText || e(b)).indexOf(a) > -1 } }), lang: ia(function (a) { return W.test(a || "") || ga.error("unsupported lang: " + a), a = a.replace(ca, da).toLowerCase(), function (b) { var c; do if (c = p ? b.lang : b.getAttribute("xml:lang") || b.getAttribute("lang")) return c = c.toLowerCase(), c === a || 0 === c.indexOf(a + "-"); while ((b = b.parentNode) && 1 === b.nodeType); return !1 } }), target: function (b) { var c = a.location && a.location.hash; return c && c.slice(1) === b.id }, root: function (a) { return a === o }, focus: function (a) { return a === n.activeElement && (!n.hasFocus || n.hasFocus()) && !!(a.type || a.href || ~a.tabIndex) }, enabled: function (a) { return a.disabled === !1 }, disabled: function (a) { return a.disabled === !0 }, checked: function (a) { var b = a.nodeName.toLowerCase(); return "input" === b && !!a.checked || "option" === b && !!a.selected }, selected: function (a) { return a.parentNode && a.parentNode.selectedIndex, a.selected === !0 }, empty: function (a) { for (a = a.firstChild; a; a = a.nextSibling)if (a.nodeType < 6) return !1; return !0 }, parent: function (a) { return !d.pseudos.empty(a) }, header: function (a) { return Z.test(a.nodeName) }, input: function (a) { return Y.test(a.nodeName) }, button: function (a) { var b = a.nodeName.toLowerCase(); return "input" === b && "button" === a.type || "button" === b }, text: function (a) { var b; return "input" === a.nodeName.toLowerCase() && "text" === a.type && (null == (b = a.getAttribute("type")) || "text" === b.toLowerCase()) }, first: oa(function () { return [0] }), last: oa(function (a, b) { return [b - 1] }), eq: oa(function (a, b, c) { return [0 > c ? c + b : c] }), even: oa(function (a, b) { for (var c = 0; b > c; c += 2)a.push(c); return a }), odd: oa(function (a, b) { for (var c = 1; b > c; c += 2)a.push(c); return a }), lt: oa(function (a, b, c) { for (var d = 0 > c ? c + b : c; --d >= 0;)a.push(d); return a }), gt: oa(function (a, b, c) { for (var d = 0 > c ? c + b : c; ++d < b;)a.push(d); return a }) } }, d.pseudos.nth = d.pseudos.eq; for (b in { radio: !0, checkbox: !0, file: !0, password: !0, image: !0 }) d.pseudos[b] = ma(b); for (b in { submit: !0, reset: !0 }) d.pseudos[b] = na(b); function qa() { } qa.prototype = d.filters = d.pseudos, d.setFilters = new qa, g = ga.tokenize = function (a, b) { var c, e, f, g, h, i, j, k = z[a + " "]; if (k) return b ? 0 : k.slice(0); h = a, i = [], j = d.preFilter; while (h) { (!c || (e = S.exec(h))) && (e && (h = h.slice(e[0].length) || h), i.push(f = [])), c = !1, (e = T.exec(h)) && (c = e.shift(), f.push({ value: c, type: e[0].replace(R, " ") }), h = h.slice(c.length)); for (g in d.filter) !(e = X[g].exec(h)) || j[g] && !(e = j[g](e)) || (c = e.shift(), f.push({ value: c, type: g, matches: e }), h = h.slice(c.length)); if (!c) break } return b ? h.length : h ? ga.error(a) : z(a, i).slice(0) }; function ra(a) { for (var b = 0, c = a.length, d = ""; c > b; b++)d += a[b].value; return d } function sa(a, b, c) { var d = b.dir, e = c && "parentNode" === d, f = x++; return b.first ? function (b, c, f) { while (b = b[d]) if (1 === b.nodeType || e) return a(b, c, f) } : function (b, c, g) { var h, i, j = [w, f]; if (g) { while (b = b[d]) if ((1 === b.nodeType || e) && a(b, c, g)) return !0 } else while (b = b[d]) if (1 === b.nodeType || e) { if (i = b[u] || (b[u] = {}), (h = i[d]) && h[0] === w && h[1] === f) return j[2] = h[2]; if (i[d] = j, j[2] = a(b, c, g)) return !0 } } } function ta(a) { return a.length > 1 ? function (b, c, d) { var e = a.length; while (e--) if (!a[e](b, c, d)) return !1; return !0 } : a[0] } function ua(a, b, c) { for (var d = 0, e = b.length; e > d; d++)ga(a, b[d], c); return c } function va(a, b, c, d, e) { for (var f, g = [], h = 0, i = a.length, j = null != b; i > h; h++)(f = a[h]) && (!c || c(f, d, e)) && (g.push(f), j && b.push(h)); return g } function wa(a, b, c, d, e, f) { return d && !d[u] && (d = wa(d)), e && !e[u] && (e = wa(e, f)), ia(function (f, g, h, i) { var j, k, l, m = [], n = [], o = g.length, p = f || ua(b || "*", h.nodeType ? [h] : h, []), q = !a || !f && b ? p : va(p, m, a, h, i), r = c ? e || (f ? a : o || d) ? [] : g : q; if (c && c(q, r, h, i), d) { j = va(r, n), d(j, [], h, i), k = j.length; while (k--) (l = j[k]) && (r[n[k]] = !(q[n[k]] = l)) } if (f) { if (e || a) { if (e) { j = [], k = r.length; while (k--) (l = r[k]) && j.push(q[k] = l); e(null, r = [], j, i) } k = r.length; while (k--) (l = r[k]) && (j = e ? J(f, l) : m[k]) > -1 && (f[j] = !(g[j] = l)) } } else r = va(r === g ? r.splice(o, r.length) : r), e ? e(null, g, r, i) : H.apply(g, r) }) } function xa(a) { for (var b, c, e, f = a.length, g = d.relative[a[0].type], h = g || d.relative[" "], i = g ? 1 : 0, k = sa(function (a) { return a === b }, h, !0), l = sa(function (a) { return J(b, a) > -1 }, h, !0), m = [function (a, c, d) { var e = !g && (d || c !== j) || ((b = c).nodeType ? k(a, c, d) : l(a, c, d)); return b = null, e }]; f > i; i++)if (c = d.relative[a[i].type]) m = [sa(ta(m), c)]; else { if (c = d.filter[a[i].type].apply(null, a[i].matches), c[u]) { for (e = ++i; f > e; e++)if (d.relative[a[e].type]) break; return wa(i > 1 && ta(m), i > 1 && ra(a.slice(0, i - 1).concat({ value: " " === a[i - 2].type ? "*" : "" })).replace(R, "$1"), c, e > i && xa(a.slice(i, e)), f > e && xa(a = a.slice(e)), f > e && ra(a)) } m.push(c) } return ta(m) } function ya(a, b) { var c = b.length > 0, e = a.length > 0, f = function (f, g, h, i, k) { var l, m, o, p = 0, q = "0", r = f && [], s = [], t = j, u = f || e && d.find.TAG("*", k), v = w += null == t ? 1 : Math.random() || .1, x = u.length; for (k && (j = g !== n && g); q !== x && null != (l = u[q]); q++) { if (e && l) { m = 0; while (o = a[m++]) if (o(l, g, h)) { i.push(l); break } k && (w = v) } c && ((l = !o && l) && p--, f && r.push(l)) } if (p += q, c && q !== p) { m = 0; while (o = b[m++]) o(r, s, g, h); if (f) { if (p > 0) while (q--) r[q] || s[q] || (s[q] = F.call(i)); s = va(s) } H.apply(i, s), k && !f && s.length > 0 && p + b.length > 1 && ga.uniqueSort(i) } return k && (w = v, j = t), r }; return c ? ia(f) : f } return h = ga.compile = function (a, b) { var c, d = [], e = [], f = A[a + " "]; if (!f) { b || (b = g(a)), c = b.length; while (c--) f = xa(b[c]), f[u] ? d.push(f) : e.push(f); f = A(a, ya(e, d)), f.selector = a } return f }, i = ga.select = function (a, b, e, f) { var i, j, k, l, m, n = "function" == typeof a && a, o = !f && g(a = n.selector || a); if (e = e || [], 1 === o.length) { if (j = o[0] = o[0].slice(0), j.length > 2 && "ID" === (k = j[0]).type && c.getById && 9 === b.nodeType && p && d.relative[j[1].type]) { if (b = (d.find.ID(k.matches[0].replace(ca, da), b) || [])[0], !b) return e; n && (b = b.parentNode), a = a.slice(j.shift().value.length) } i = X.needsContext.test(a) ? 0 : j.length; while (i--) { if (k = j[i], d.relative[l = k.type]) break; if ((m = d.find[l]) && (f = m(k.matches[0].replace(ca, da), aa.test(j[0].type) && pa(b.parentNode) || b))) { if (j.splice(i, 1), a = f.length && ra(j), !a) return H.apply(e, f), e; break } } } return (n || h(a, o))(f, b, !p, e, aa.test(a) && pa(b.parentNode) || b), e }, c.sortStable = u.split("").sort(B).join("") === u, c.detectDuplicates = !!l, m(), c.sortDetached = ja(function (a) { return 1 & a.compareDocumentPosition(n.createElement("div")) }), ja(function (a) { return a.innerHTML = "<a href='#'></a>", "#" === a.firstChild.getAttribute("href") }) || ka("type|href|height|width", function (a, b, c) { return c ? void 0 : a.getAttribute(b, "type" === b.toLowerCase() ? 1 : 2) }), c.attributes && ja(function (a) { return a.innerHTML = "<input/>", a.firstChild.setAttribute("value", ""), "" === a.firstChild.getAttribute("value") }) || ka("value", function (a, b, c) { return c || "input" !== a.nodeName.toLowerCase() ? void 0 : a.defaultValue }), ja(function (a) { return null == a.getAttribute("disabled") }) || ka(K, function (a, b, c) { var d; return c ? void 0 : a[b] === !0 ? b.toLowerCase() : (d = a.getAttributeNode(b)) && d.specified ? d.value : null }), ga }(a); n.find = t, n.expr = t.selectors, n.expr[":"] = n.expr.pseudos, n.unique = t.uniqueSort, n.text = t.getText, n.isXMLDoc = t.isXML, n.contains = t.contains; var u = n.expr.match.needsContext, v = /^<(\w+)\s*\/?>(?:<\/\1>|)$/, w = /^.[^:#\[\.,]*$/; function x(a, b, c) { if (n.isFunction(b)) return n.grep(a, function (a, d) { return !!b.call(a, d, a) !== c }); if (b.nodeType) return n.grep(a, function (a) { return a === b !== c }); if ("string" == typeof b) { if (w.test(b)) return n.filter(b, a, c); b = n.filter(b, a) } return n.grep(a, function (a) { return g.call(b, a) >= 0 !== c }) } n.filter = function (a, b, c) { var d = b[0]; return c && (a = ":not(" + a + ")"), 1 === b.length && 1 === d.nodeType ? n.find.matchesSelector(d, a) ? [d] : [] : n.find.matches(a, n.grep(b, function (a) { return 1 === a.nodeType })) }, n.fn.extend({ find: function (a) { var b, c = this.length, d = [], e = this; if ("string" != typeof a) return this.pushStack(n(a).filter(function () { for (b = 0; c > b; b++)if (n.contains(e[b], this)) return !0 })); for (b = 0; c > b; b++)n.find(a, e[b], d); return d = this.pushStack(c > 1 ? n.unique(d) : d), d.selector = this.selector ? this.selector + " " + a : a, d }, filter: function (a) { return this.pushStack(x(this, a || [], !1)) }, not: function (a) { return this.pushStack(x(this, a || [], !0)) }, is: function (a) { return !!x(this, "string" == typeof a && u.test(a) ? n(a) : a || [], !1).length } }); var y, z = /^(?:\s*(<[\w\W]+>)[^>]*|#([\w-]*))$/, A = n.fn.init = function (a, b) { var c, d; if (!a) return this; if ("string" == typeof a) { if (c = "<" === a[0] && ">" === a[a.length - 1] && a.length >= 3 ? [null, a, null] : z.exec(a), !c || !c[1] && b) return !b || b.jquery ? (b || y).find(a) : this.constructor(b).find(a); if (c[1]) { if (b = b instanceof n ? b[0] : b, n.merge(this, n.parseHTML(c[1], b && b.nodeType ? b.ownerDocument || b : l, !0)), v.test(c[1]) && n.isPlainObject(b)) for (c in b) n.isFunction(this[c]) ? this[c](b[c]) : this.attr(c, b[c]); return this } return d = l.getElementById(c[2]), d && d.parentNode && (this.length = 1, this[0] = d), this.context = l, this.selector = a, this } return a.nodeType ? (this.context = this[0] = a, this.length = 1, this) : n.isFunction(a) ? "undefined" != typeof y.ready ? y.ready(a) : a(n) : (void 0 !== a.selector && (this.selector = a.selector, this.context = a.context), n.makeArray(a, this)) }; A.prototype = n.fn, y = n(l); var B = /^(?:parents|prev(?:Until|All))/, C = { children: !0, contents: !0, next: !0, prev: !0 }; n.extend({ dir: function (a, b, c) { var d = [], e = void 0 !== c; while ((a = a[b]) && 9 !== a.nodeType) if (1 === a.nodeType) { if (e && n(a).is(c)) break; d.push(a) } return d }, sibling: function (a, b) { for (var c = []; a; a = a.nextSibling)1 === a.nodeType && a !== b && c.push(a); return c } }), n.fn.extend({ has: function (a) { var b = n(a, this), c = b.length; return this.filter(function () { for (var a = 0; c > a; a++)if (n.contains(this, b[a])) return !0 }) }, closest: function (a, b) { for (var c, d = 0, e = this.length, f = [], g = u.test(a) || "string" != typeof a ? n(a, b || this.context) : 0; e > d; d++)for (c = this[d]; c && c !== b; c = c.parentNode)if (c.nodeType < 11 && (g ? g.index(c) > -1 : 1 === c.nodeType && n.find.matchesSelector(c, a))) { f.push(c); break } return this.pushStack(f.length > 1 ? n.unique(f) : f) }, index: function (a) { return a ? "string" == typeof a ? g.call(n(a), this[0]) : g.call(this, a.jquery ? a[0] : a) : this[0] && this[0].parentNode ? this.first().prevAll().length : -1 }, add: function (a, b) { return this.pushStack(n.unique(n.merge(this.get(), n(a, b)))) }, addBack: function (a) { return this.add(null == a ? this.prevObject : this.prevObject.filter(a)) } }); function D(a, b) { while ((a = a[b]) && 1 !== a.nodeType); return a } n.each({ parent: function (a) { var b = a.parentNode; return b && 11 !== b.nodeType ? b : null }, parents: function (a) { return n.dir(a, "parentNode") }, parentsUntil: function (a, b, c) { return n.dir(a, "parentNode", c) }, next: function (a) { return D(a, "nextSibling") }, prev: function (a) { return D(a, "previousSibling") }, nextAll: function (a) { return n.dir(a, "nextSibling") }, prevAll: function (a) { return n.dir(a, "previousSibling") }, nextUntil: function (a, b, c) { return n.dir(a, "nextSibling", c) }, prevUntil: function (a, b, c) { return n.dir(a, "previousSibling", c) }, siblings: function (a) { return n.sibling((a.parentNode || {}).firstChild, a) }, children: function (a) { return n.sibling(a.firstChild) }, contents: function (a) { return a.contentDocument || n.merge([], a.childNodes) } }, function (a, b) { n.fn[a] = function (c, d) { var e = n.map(this, b, c); return "Until" !== a.slice(-5) && (d = c), d && "string" == typeof d && (e = n.filter(d, e)), this.length > 1 && (C[a] || n.unique(e), B.test(a) && e.reverse()), this.pushStack(e) } }); var E = /\S+/g, F = {}; function G(a) { var b = F[a] = {}; return n.each(a.match(E) || [], function (a, c) { b[c] = !0 }), b } n.Callbacks = function (a) { a = "string" == typeof a ? F[a] || G(a) : n.extend({}, a); var b, c, d, e, f, g, h = [], i = !a.once && [], j = function (l) { for (b = a.memory && l, c = !0, g = e || 0, e = 0, f = h.length, d = !0; h && f > g; g++)if (h[g].apply(l[0], l[1]) === !1 && a.stopOnFalse) { b = !1; break } d = !1, h && (i ? i.length && j(i.shift()) : b ? h = [] : k.disable()) }, k = { add: function () { if (h) { var c = h.length; !function g(b) { n.each(b, function (b, c) { var d = n.type(c); "function" === d ? a.unique && k.has(c) || h.push(c) : c && c.length && "string" !== d && g(c) }) }(arguments), d ? f = h.length : b && (e = c, j(b)) } return this }, remove: function () { return h && n.each(arguments, function (a, b) { var c; while ((c = n.inArray(b, h, c)) > -1) h.splice(c, 1), d && (f >= c && f--, g >= c && g--) }), this }, has: function (a) { return a ? n.inArray(a, h) > -1 : !(!h || !h.length) }, empty: function () { return h = [], f = 0, this }, disable: function () { return h = i = b = void 0, this }, disabled: function () { return !h }, lock: function () { return i = void 0, b || k.disable(), this }, locked: function () { return !i }, fireWith: function (a, b) { return !h || c && !i || (b = b || [], b = [a, b.slice ? b.slice() : b], d ? i.push(b) : j(b)), this }, fire: function () { return k.fireWith(this, arguments), this }, fired: function () { return !!c } }; return k }, n.extend({ Deferred: function (a) { var b = [["resolve", "done", n.Callbacks("once memory"), "resolved"], ["reject", "fail", n.Callbacks("once memory"), "rejected"], ["notify", "progress", n.Callbacks("memory")]], c = "pending", d = { state: function () { return c }, always: function () { return e.done(arguments).fail(arguments), this }, then: function () { var a = arguments; return n.Deferred(function (c) { n.each(b, function (b, f) { var g = n.isFunction(a[b]) && a[b]; e[f[1]](function () { var a = g && g.apply(this, arguments); a && n.isFunction(a.promise) ? a.promise().done(c.resolve).fail(c.reject).progress(c.notify) : c[f[0] + "With"](this === d ? c.promise() : this, g ? [a] : arguments) }) }), a = null }).promise() }, promise: function (a) { return null != a ? n.extend(a, d) : d } }, e = {}; return d.pipe = d.then, n.each(b, function (a, f) { var g = f[2], h = f[3]; d[f[1]] = g.add, h && g.add(function () { c = h }, b[1 ^ a][2].disable, b[2][2].lock), e[f[0]] = function () { return e[f[0] + "With"](this === e ? d : this, arguments), this }, e[f[0] + "With"] = g.fireWith }), d.promise(e), a && a.call(e, e), e }, when: function (a) { var b = 0, c = d.call(arguments), e = c.length, f = 1 !== e || a && n.isFunction(a.promise) ? e : 0, g = 1 === f ? a : n.Deferred(), h = function (a, b, c) { return function (e) { b[a] = this, c[a] = arguments.length > 1 ? d.call(arguments) : e, c === i ? g.notifyWith(b, c) : --f || g.resolveWith(b, c) } }, i, j, k; if (e > 1) for (i = new Array(e), j = new Array(e), k = new Array(e); e > b; b++)c[b] && n.isFunction(c[b].promise) ? c[b].promise().done(h(b, k, c)).fail(g.reject).progress(h(b, j, i)) : --f; return f || g.resolveWith(k, c), g.promise() } }); var H; n.fn.ready = function (a) { return n.ready.promise().done(a), this }, n.extend({ isReady: !1, readyWait: 1, holdReady: function (a) { a ? n.readyWait++ : n.ready(!0) }, ready: function (a) { (a === !0 ? --n.readyWait : n.isReady) || (n.isReady = !0, a !== !0 && --n.readyWait > 0 || (H.resolveWith(l, [n]), n.fn.triggerHandler && (n(l).triggerHandler("ready"), n(l).off("ready")))) } }); function I() { l.removeEventListener("DOMContentLoaded", I, !1), a.removeEventListener("load", I, !1), n.ready() } n.ready.promise = function (b) { return H || (H = n.Deferred(), "complete" === l.readyState ? setTimeout(n.ready) : (l.addEventListener("DOMContentLoaded", I, !1), a.addEventListener("load", I, !1))), H.promise(b) }, n.ready.promise(); var J = n.access = function (a, b, c, d, e, f, g) { var h = 0, i = a.length, j = null == c; if ("object" === n.type(c)) { e = !0; for (h in c) n.access(a, b, h, c[h], !0, f, g) } else if (void 0 !== d && (e = !0, n.isFunction(d) || (g = !0), j && (g ? (b.call(a, d), b = null) : (j = b, b = function (a, b, c) { return j.call(n(a), c) })), b)) for (; i > h; h++)b(a[h], c, g ? d : d.call(a[h], h, b(a[h], c))); return e ? a : j ? b.call(a) : i ? b(a[0], c) : f }; n.acceptData = function (a) { return 1 === a.nodeType || 9 === a.nodeType || !+a.nodeType }; function K() { Object.defineProperty(this.cache = {}, 0, { get: function () { return {} } }), this.expando = n.expando + K.uid++ } K.uid = 1, K.accepts = n.acceptData, K.prototype = { key: function (a) { if (!K.accepts(a)) return 0; var b = {}, c = a[this.expando]; if (!c) { c = K.uid++; try { b[this.expando] = { value: c }, Object.defineProperties(a, b) } catch (d) { b[this.expando] = c, n.extend(a, b) } } return this.cache[c] || (this.cache[c] = {}), c }, set: function (a, b, c) { var d, e = this.key(a), f = this.cache[e]; if ("string" == typeof b) f[b] = c; else if (n.isEmptyObject(f)) n.extend(this.cache[e], b); else for (d in b) f[d] = b[d]; return f }, get: function (a, b) { var c = this.cache[this.key(a)]; return void 0 === b ? c : c[b] }, access: function (a, b, c) { var d; return void 0 === b || b && "string" == typeof b && void 0 === c ? (d = this.get(a, b), void 0 !== d ? d : this.get(a, n.camelCase(b))) : (this.set(a, b, c), void 0 !== c ? c : b) }, remove: function (a, b) { var c, d, e, f = this.key(a), g = this.cache[f]; if (void 0 === b) this.cache[f] = {}; else { n.isArray(b) ? d = b.concat(b.map(n.camelCase)) : (e = n.camelCase(b), b in g ? d = [b, e] : (d = e, d = d in g ? [d] : d.match(E) || [])), c = d.length; while (c--) delete g[d[c]] } }, hasData: function (a) { return !n.isEmptyObject(this.cache[a[this.expando]] || {}) }, discard: function (a) { a[this.expando] && delete this.cache[a[this.expando]] } }; var L = new K, M = new K, N = /^(?:\{[\w\W]*\}|\[[\w\W]*\])$/, O = /([A-Z])/g; function P(a, b, c) { var d; if (void 0 === c && 1 === a.nodeType) if (d = "data-" + b.replace(O, "-$1").toLowerCase(), c = a.getAttribute(d), "string" == typeof c) { try { c = "true" === c ? !0 : "false" === c ? !1 : "null" === c ? null : +c + "" === c ? +c : N.test(c) ? n.parseJSON(c) : c } catch (e) { } M.set(a, b, c) } else c = void 0; return c } n.extend({
            hasData: function (a) { return M.hasData(a) || L.hasData(a) }, data: function (a, b, c) {
                return M.access(a, b, c)
            }, removeData: function (a, b) { M.remove(a, b) }, _data: function (a, b, c) { return L.access(a, b, c) }, _removeData: function (a, b) { L.remove(a, b) }
        }), n.fn.extend({ data: function (a, b) { var c, d, e, f = this[0], g = f && f.attributes; if (void 0 === a) { if (this.length && (e = M.get(f), 1 === f.nodeType && !L.get(f, "hasDataAttrs"))) { c = g.length; while (c--) g[c] && (d = g[c].name, 0 === d.indexOf("data-") && (d = n.camelCase(d.slice(5)), P(f, d, e[d]))); L.set(f, "hasDataAttrs", !0) } return e } return "object" == typeof a ? this.each(function () { M.set(this, a) }) : J(this, function (b) { var c, d = n.camelCase(a); if (f && void 0 === b) { if (c = M.get(f, a), void 0 !== c) return c; if (c = M.get(f, d), void 0 !== c) return c; if (c = P(f, d, void 0), void 0 !== c) return c } else this.each(function () { var c = M.get(this, d); M.set(this, d, b), -1 !== a.indexOf("-") && void 0 !== c && M.set(this, a, b) }) }, null, b, arguments.length > 1, null, !0) }, removeData: function (a) { return this.each(function () { M.remove(this, a) }) } }), n.extend({ queue: function (a, b, c) { var d; return a ? (b = (b || "fx") + "queue", d = L.get(a, b), c && (!d || n.isArray(c) ? d = L.access(a, b, n.makeArray(c)) : d.push(c)), d || []) : void 0 }, dequeue: function (a, b) { b = b || "fx"; var c = n.queue(a, b), d = c.length, e = c.shift(), f = n._queueHooks(a, b), g = function () { n.dequeue(a, b) }; "inprogress" === e && (e = c.shift(), d--), e && ("fx" === b && c.unshift("inprogress"), delete f.stop, e.call(a, g, f)), !d && f && f.empty.fire() }, _queueHooks: function (a, b) { var c = b + "queueHooks"; return L.get(a, c) || L.access(a, c, { empty: n.Callbacks("once memory").add(function () { L.remove(a, [b + "queue", c]) }) }) } }), n.fn.extend({ queue: function (a, b) { var c = 2; return "string" != typeof a && (b = a, a = "fx", c--), arguments.length < c ? n.queue(this[0], a) : void 0 === b ? this : this.each(function () { var c = n.queue(this, a, b); n._queueHooks(this, a), "fx" === a && "inprogress" !== c[0] && n.dequeue(this, a) }) }, dequeue: function (a) { return this.each(function () { n.dequeue(this, a) }) }, clearQueue: function (a) { return this.queue(a || "fx", []) }, promise: function (a, b) { var c, d = 1, e = n.Deferred(), f = this, g = this.length, h = function () { --d || e.resolveWith(f, [f]) }; "string" != typeof a && (b = a, a = void 0), a = a || "fx"; while (g--) c = L.get(f[g], a + "queueHooks"), c && c.empty && (d++, c.empty.add(h)); return h(), e.promise(b) } }); var Q = /[+-]?(?:\d*\.|)\d+(?:[eE][+-]?\d+|)/.source, R = ["Top", "Right", "Bottom", "Left"], S = function (a, b) { return a = b || a, "none" === n.css(a, "display") || !n.contains(a.ownerDocument, a) }, T = /^(?:checkbox|radio)$/i; !function () { var a = l.createDocumentFragment(), b = a.appendChild(l.createElement("div")), c = l.createElement("input"); c.setAttribute("type", "radio"), c.setAttribute("checked", "checked"), c.setAttribute("name", "t"), b.appendChild(c), k.checkClone = b.cloneNode(!0).cloneNode(!0).lastChild.checked, b.innerHTML = "<textarea>x</textarea>", k.noCloneChecked = !!b.cloneNode(!0).lastChild.defaultValue }(); var U = "undefined"; k.focusinBubbles = "onfocusin" in a; var V = /^key/, W = /^(?:mouse|pointer|contextmenu)|click/, X = /^(?:focusinfocus|focusoutblur)$/, Y = /^([^.]*)(?:\.(.+)|)$/; function Z() { return !0 } function $() { return !1 } function _() { try { return l.activeElement } catch (a) { } } n.event = { global: {}, add: function (a, b, c, d, e) { var f, g, h, i, j, k, l, m, o, p, q, r = L.get(a); if (r) { c.handler && (f = c, c = f.handler, e = f.selector), c.guid || (c.guid = n.guid++), (i = r.events) || (i = r.events = {}), (g = r.handle) || (g = r.handle = function (b) { return typeof n !== U && n.event.triggered !== b.type ? n.event.dispatch.apply(a, arguments) : void 0 }), b = (b || "").match(E) || [""], j = b.length; while (j--) h = Y.exec(b[j]) || [], o = q = h[1], p = (h[2] || "").split(".").sort(), o && (l = n.event.special[o] || {}, o = (e ? l.delegateType : l.bindType) || o, l = n.event.special[o] || {}, k = n.extend({ type: o, origType: q, data: d, handler: c, guid: c.guid, selector: e, needsContext: e && n.expr.match.needsContext.test(e), namespace: p.join(".") }, f), (m = i[o]) || (m = i[o] = [], m.delegateCount = 0, l.setup && l.setup.call(a, d, p, g) !== !1 || a.addEventListener && a.addEventListener(o, g, !1)), l.add && (l.add.call(a, k), k.handler.guid || (k.handler.guid = c.guid)), e ? m.splice(m.delegateCount++, 0, k) : m.push(k), n.event.global[o] = !0) } }, remove: function (a, b, c, d, e) { var f, g, h, i, j, k, l, m, o, p, q, r = L.hasData(a) && L.get(a); if (r && (i = r.events)) { b = (b || "").match(E) || [""], j = b.length; while (j--) if (h = Y.exec(b[j]) || [], o = q = h[1], p = (h[2] || "").split(".").sort(), o) { l = n.event.special[o] || {}, o = (d ? l.delegateType : l.bindType) || o, m = i[o] || [], h = h[2] && new RegExp("(^|\\.)" + p.join("\\.(?:.*\\.|)") + "(\\.|$)"), g = f = m.length; while (f--) k = m[f], !e && q !== k.origType || c && c.guid !== k.guid || h && !h.test(k.namespace) || d && d !== k.selector && ("**" !== d || !k.selector) || (m.splice(f, 1), k.selector && m.delegateCount--, l.remove && l.remove.call(a, k)); g && !m.length && (l.teardown && l.teardown.call(a, p, r.handle) !== !1 || n.removeEvent(a, o, r.handle), delete i[o]) } else for (o in i) n.event.remove(a, o + b[j], c, d, !0); n.isEmptyObject(i) && (delete r.handle, L.remove(a, "events")) } }, trigger: function (b, c, d, e) { var f, g, h, i, k, m, o, p = [d || l], q = j.call(b, "type") ? b.type : b, r = j.call(b, "namespace") ? b.namespace.split(".") : []; if (g = h = d = d || l, 3 !== d.nodeType && 8 !== d.nodeType && !X.test(q + n.event.triggered) && (q.indexOf(".") >= 0 && (r = q.split("."), q = r.shift(), r.sort()), k = q.indexOf(":") < 0 && "on" + q, b = b[n.expando] ? b : new n.Event(q, "object" == typeof b && b), b.isTrigger = e ? 2 : 3, b.namespace = r.join("."), b.namespace_re = b.namespace ? new RegExp("(^|\\.)" + r.join("\\.(?:.*\\.|)") + "(\\.|$)") : null, b.result = void 0, b.target || (b.target = d), c = null == c ? [b] : n.makeArray(c, [b]), o = n.event.special[q] || {}, e || !o.trigger || o.trigger.apply(d, c) !== !1)) { if (!e && !o.noBubble && !n.isWindow(d)) { for (i = o.delegateType || q, X.test(i + q) || (g = g.parentNode); g; g = g.parentNode)p.push(g), h = g; h === (d.ownerDocument || l) && p.push(h.defaultView || h.parentWindow || a) } f = 0; while ((g = p[f++]) && !b.isPropagationStopped()) b.type = f > 1 ? i : o.bindType || q, m = (L.get(g, "events") || {})[b.type] && L.get(g, "handle"), m && m.apply(g, c), m = k && g[k], m && m.apply && n.acceptData(g) && (b.result = m.apply(g, c), b.result === !1 && b.preventDefault()); return b.type = q, e || b.isDefaultPrevented() || o._default && o._default.apply(p.pop(), c) !== !1 || !n.acceptData(d) || k && n.isFunction(d[q]) && !n.isWindow(d) && (h = d[k], h && (d[k] = null), n.event.triggered = q, d[q](), n.event.triggered = void 0, h && (d[k] = h)), b.result } }, dispatch: function (a) { a = n.event.fix(a); var b, c, e, f, g, h = [], i = d.call(arguments), j = (L.get(this, "events") || {})[a.type] || [], k = n.event.special[a.type] || {}; if (i[0] = a, a.delegateTarget = this, !k.preDispatch || k.preDispatch.call(this, a) !== !1) { h = n.event.handlers.call(this, a, j), b = 0; while ((f = h[b++]) && !a.isPropagationStopped()) { a.currentTarget = f.elem, c = 0; while ((g = f.handlers[c++]) && !a.isImmediatePropagationStopped()) (!a.namespace_re || a.namespace_re.test(g.namespace)) && (a.handleObj = g, a.data = g.data, e = ((n.event.special[g.origType] || {}).handle || g.handler).apply(f.elem, i), void 0 !== e && (a.result = e) === !1 && (a.preventDefault(), a.stopPropagation())) } return k.postDispatch && k.postDispatch.call(this, a), a.result } }, handlers: function (a, b) { var c, d, e, f, g = [], h = b.delegateCount, i = a.target; if (h && i.nodeType && (!a.button || "click" !== a.type)) for (; i !== this; i = i.parentNode || this)if (i.disabled !== !0 || "click" !== a.type) { for (d = [], c = 0; h > c; c++)f = b[c], e = f.selector + " ", void 0 === d[e] && (d[e] = f.needsContext ? n(e, this).index(i) >= 0 : n.find(e, this, null, [i]).length), d[e] && d.push(f); d.length && g.push({ elem: i, handlers: d }) } return h < b.length && g.push({ elem: this, handlers: b.slice(h) }), g }, props: "altKey bubbles cancelable ctrlKey currentTarget eventPhase metaKey relatedTarget shiftKey target timeStamp view which".split(" "), fixHooks: {}, keyHooks: { props: "char charCode key keyCode".split(" "), filter: function (a, b) { return null == a.which && (a.which = null != b.charCode ? b.charCode : b.keyCode), a } }, mouseHooks: { props: "button buttons clientX clientY offsetX offsetY pageX pageY screenX screenY toElement".split(" "), filter: function (a, b) { var c, d, e, f = b.button; return null == a.pageX && null != b.clientX && (c = a.target.ownerDocument || l, d = c.documentElement, e = c.body, a.pageX = b.clientX + (d && d.scrollLeft || e && e.scrollLeft || 0) - (d && d.clientLeft || e && e.clientLeft || 0), a.pageY = b.clientY + (d && d.scrollTop || e && e.scrollTop || 0) - (d && d.clientTop || e && e.clientTop || 0)), a.which || void 0 === f || (a.which = 1 & f ? 1 : 2 & f ? 3 : 4 & f ? 2 : 0), a } }, fix: function (a) { if (a[n.expando]) return a; var b, c, d, e = a.type, f = a, g = this.fixHooks[e]; g || (this.fixHooks[e] = g = W.test(e) ? this.mouseHooks : V.test(e) ? this.keyHooks : {}), d = g.props ? this.props.concat(g.props) : this.props, a = new n.Event(f), b = d.length; while (b--) c = d[b], a[c] = f[c]; return a.target || (a.target = l), 3 === a.target.nodeType && (a.target = a.target.parentNode), g.filter ? g.filter(a, f) : a }, special: { load: { noBubble: !0 }, focus: { trigger: function () { return this !== _() && this.focus ? (this.focus(), !1) : void 0 }, delegateType: "focusin" }, blur: { trigger: function () { return this === _() && this.blur ? (this.blur(), !1) : void 0 }, delegateType: "focusout" }, click: { trigger: function () { return "checkbox" === this.type && this.click && n.nodeName(this, "input") ? (this.click(), !1) : void 0 }, _default: function (a) { return n.nodeName(a.target, "a") } }, beforeunload: { postDispatch: function (a) { void 0 !== a.result && a.originalEvent && (a.originalEvent.returnValue = a.result) } } }, simulate: function (a, b, c, d) { var e = n.extend(new n.Event, c, { type: a, isSimulated: !0, originalEvent: {} }); d ? n.event.trigger(e, null, b) : n.event.dispatch.call(b, e), e.isDefaultPrevented() && c.preventDefault() } }, n.removeEvent = function (a, b, c) { a.removeEventListener && a.removeEventListener(b, c, !1) }, n.Event = function (a, b) { return this instanceof n.Event ? (a && a.type ? (this.originalEvent = a, this.type = a.type, this.isDefaultPrevented = a.defaultPrevented || void 0 === a.defaultPrevented && a.returnValue === !1 ? Z : $) : this.type = a, b && n.extend(this, b), this.timeStamp = a && a.timeStamp || n.now(), void (this[n.expando] = !0)) : new n.Event(a, b) }, n.Event.prototype = { isDefaultPrevented: $, isPropagationStopped: $, isImmediatePropagationStopped: $, preventDefault: function () { var a = this.originalEvent; this.isDefaultPrevented = Z, a && a.preventDefault && a.preventDefault() }, stopPropagation: function () { var a = this.originalEvent; this.isPropagationStopped = Z, a && a.stopPropagation && a.stopPropagation() }, stopImmediatePropagation: function () { var a = this.originalEvent; this.isImmediatePropagationStopped = Z, a && a.stopImmediatePropagation && a.stopImmediatePropagation(), this.stopPropagation() } }, n.each({ mouseenter: "mouseover", mouseleave: "mouseout", pointerenter: "pointerover", pointerleave: "pointerout" }, function (a, b) { n.event.special[a] = { delegateType: b, bindType: b, handle: function (a) { var c, d = this, e = a.relatedTarget, f = a.handleObj; return (!e || e !== d && !n.contains(d, e)) && (a.type = f.origType, c = f.handler.apply(this, arguments), a.type = b), c } } }), k.focusinBubbles || n.each({ focus: "focusin", blur: "focusout" }, function (a, b) { var c = function (a) { n.event.simulate(b, a.target, n.event.fix(a), !0) }; n.event.special[b] = { setup: function () { var d = this.ownerDocument || this, e = L.access(d, b); e || d.addEventListener(a, c, !0), L.access(d, b, (e || 0) + 1) }, teardown: function () { var d = this.ownerDocument || this, e = L.access(d, b) - 1; e ? L.access(d, b, e) : (d.removeEventListener(a, c, !0), L.remove(d, b)) } } }), n.fn.extend({ on: function (a, b, c, d, e) { var f, g; if ("object" == typeof a) { "string" != typeof b && (c = c || b, b = void 0); for (g in a) this.on(g, b, c, a[g], e); return this } if (null == c && null == d ? (d = b, c = b = void 0) : null == d && ("string" == typeof b ? (d = c, c = void 0) : (d = c, c = b, b = void 0)), d === !1) d = $; else if (!d) return this; return 1 === e && (f = d, d = function (a) { return n().off(a), f.apply(this, arguments) }, d.guid = f.guid || (f.guid = n.guid++)), this.each(function () { n.event.add(this, a, d, c, b) }) }, one: function (a, b, c, d) { return this.on(a, b, c, d, 1) }, off: function (a, b, c) { var d, e; if (a && a.preventDefault && a.handleObj) return d = a.handleObj, n(a.delegateTarget).off(d.namespace ? d.origType + "." + d.namespace : d.origType, d.selector, d.handler), this; if ("object" == typeof a) { for (e in a) this.off(e, b, a[e]); return this } return (b === !1 || "function" == typeof b) && (c = b, b = void 0), c === !1 && (c = $), this.each(function () { n.event.remove(this, a, c, b) }) }, trigger: function (a, b) { return this.each(function () { n.event.trigger(a, b, this) }) }, triggerHandler: function (a, b) { var c = this[0]; return c ? n.event.trigger(a, b, c, !0) : void 0 } }); var aa = /<(?!area|br|col|embed|hr|img|input|link|meta|param)(([\w:]+)[^>]*)\/>/gi, ba = /<([\w:]+)/, ca = /<|&#?\w+;/, da = /<(?:script|style|link)/i, ea = /checked\s*(?:[^=]|=\s*.checked.)/i, fa = /^$|\/(?:java|ecma)script/i, ga = /^true\/(.*)/, ha = /^\s*<!(?:\[CDATA\[|--)|(?:\]\]|--)>\s*$/g, ia = { option: [1, "<select multiple='multiple'>", "</select>"], thead: [1, "<table>", "</table>"], col: [2, "<table><colgroup>", "</colgroup></table>"], tr: [2, "<table><tbody>", "</tbody></table>"], td: [3, "<table><tbody><tr>", "</tr></tbody></table>"], _default: [0, "", ""] }; ia.optgroup = ia.option, ia.tbody = ia.tfoot = ia.colgroup = ia.caption = ia.thead, ia.th = ia.td; function ja(a, b) { return n.nodeName(a, "table") && n.nodeName(11 !== b.nodeType ? b : b.firstChild, "tr") ? a.getElementsByTagName("tbody")[0] || a.appendChild(a.ownerDocument.createElement("tbody")) : a } function ka(a) { return a.type = (null !== a.getAttribute("type")) + "/" + a.type, a } function la(a) { var b = ga.exec(a.type); return b ? a.type = b[1] : a.removeAttribute("type"), a } function ma(a, b) { for (var c = 0, d = a.length; d > c; c++)L.set(a[c], "globalEval", !b || L.get(b[c], "globalEval")) } function na(a, b) { var c, d, e, f, g, h, i, j; if (1 === b.nodeType) { if (L.hasData(a) && (f = L.access(a), g = L.set(b, f), j = f.events)) { delete g.handle, g.events = {}; for (e in j) for (c = 0, d = j[e].length; d > c; c++)n.event.add(b, e, j[e][c]) } M.hasData(a) && (h = M.access(a), i = n.extend({}, h), M.set(b, i)) } } function oa(a, b) { var c = a.getElementsByTagName ? a.getElementsByTagName(b || "*") : a.querySelectorAll ? a.querySelectorAll(b || "*") : []; return void 0 === b || b && n.nodeName(a, b) ? n.merge([a], c) : c } function pa(a, b) { var c = b.nodeName.toLowerCase(); "input" === c && T.test(a.type) ? b.checked = a.checked : ("input" === c || "textarea" === c) && (b.defaultValue = a.defaultValue) } n.extend({ clone: function (a, b, c) { var d, e, f, g, h = a.cloneNode(!0), i = n.contains(a.ownerDocument, a); if (!(k.noCloneChecked || 1 !== a.nodeType && 11 !== a.nodeType || n.isXMLDoc(a))) for (g = oa(h), f = oa(a), d = 0, e = f.length; e > d; d++)pa(f[d], g[d]); if (b) if (c) for (f = f || oa(a), g = g || oa(h), d = 0, e = f.length; e > d; d++)na(f[d], g[d]); else na(a, h); return g = oa(h, "script"), g.length > 0 && ma(g, !i && oa(a, "script")), h }, buildFragment: function (a, b, c, d) { for (var e, f, g, h, i, j, k = b.createDocumentFragment(), l = [], m = 0, o = a.length; o > m; m++)if (e = a[m], e || 0 === e) if ("object" === n.type(e)) n.merge(l, e.nodeType ? [e] : e); else if (ca.test(e)) { f = f || k.appendChild(b.createElement("div")), g = (ba.exec(e) || ["", ""])[1].toLowerCase(), h = ia[g] || ia._default, f.innerHTML = h[1] + e.replace(aa, "<$1></$2>") + h[2], j = h[0]; while (j--) f = f.lastChild; n.merge(l, f.childNodes), f = k.firstChild, f.textContent = "" } else l.push(b.createTextNode(e)); k.textContent = "", m = 0; while (e = l[m++]) if ((!d || -1 === n.inArray(e, d)) && (i = n.contains(e.ownerDocument, e), f = oa(k.appendChild(e), "script"), i && ma(f), c)) { j = 0; while (e = f[j++]) fa.test(e.type || "") && c.push(e) } return k }, cleanData: function (a) { for (var b, c, d, e, f = n.event.special, g = 0; void 0 !== (c = a[g]); g++) { if (n.acceptData(c) && (e = c[L.expando], e && (b = L.cache[e]))) { if (b.events) for (d in b.events) f[d] ? n.event.remove(c, d) : n.removeEvent(c, d, b.handle); L.cache[e] && delete L.cache[e] } delete M.cache[c[M.expando]] } } }), n.fn.extend({ text: function (a) { return J(this, function (a) { return void 0 === a ? n.text(this) : this.empty().each(function () { (1 === this.nodeType || 11 === this.nodeType || 9 === this.nodeType) && (this.textContent = a) }) }, null, a, arguments.length) }, append: function () { return this.domManip(arguments, function (a) { if (1 === this.nodeType || 11 === this.nodeType || 9 === this.nodeType) { var b = ja(this, a); b.appendChild(a) } }) }, prepend: function () { return this.domManip(arguments, function (a) { if (1 === this.nodeType || 11 === this.nodeType || 9 === this.nodeType) { var b = ja(this, a); b.insertBefore(a, b.firstChild) } }) }, before: function () { return this.domManip(arguments, function (a) { this.parentNode && this.parentNode.insertBefore(a, this) }) }, after: function () { return this.domManip(arguments, function (a) { this.parentNode && this.parentNode.insertBefore(a, this.nextSibling) }) }, remove: function (a, b) { for (var c, d = a ? n.filter(a, this) : this, e = 0; null != (c = d[e]); e++)b || 1 !== c.nodeType || n.cleanData(oa(c)), c.parentNode && (b && n.contains(c.ownerDocument, c) && ma(oa(c, "script")), c.parentNode.removeChild(c)); return this }, empty: function () { for (var a, b = 0; null != (a = this[b]); b++)1 === a.nodeType && (n.cleanData(oa(a, !1)), a.textContent = ""); return this }, clone: function (a, b) { return a = null == a ? !1 : a, b = null == b ? a : b, this.map(function () { return n.clone(this, a, b) }) }, html: function (a) { return J(this, function (a) { var b = this[0] || {}, c = 0, d = this.length; if (void 0 === a && 1 === b.nodeType) return b.innerHTML; if ("string" == typeof a && !da.test(a) && !ia[(ba.exec(a) || ["", ""])[1].toLowerCase()]) { a = a.replace(aa, "<$1></$2>"); try { for (; d > c; c++)b = this[c] || {}, 1 === b.nodeType && (n.cleanData(oa(b, !1)), b.innerHTML = a); b = 0 } catch (e) { } } b && this.empty().append(a) }, null, a, arguments.length) }, replaceWith: function () { var a = arguments[0]; return this.domManip(arguments, function (b) { a = this.parentNode, n.cleanData(oa(this)), a && a.replaceChild(b, this) }), a && (a.length || a.nodeType) ? this : this.remove() }, detach: function (a) { return this.remove(a, !0) }, domManip: function (a, b) { a = e.apply([], a); var c, d, f, g, h, i, j = 0, l = this.length, m = this, o = l - 1, p = a[0], q = n.isFunction(p); if (q || l > 1 && "string" == typeof p && !k.checkClone && ea.test(p)) return this.each(function (c) { var d = m.eq(c); q && (a[0] = p.call(this, c, d.html())), d.domManip(a, b) }); if (l && (c = n.buildFragment(a, this[0].ownerDocument, !1, this), d = c.firstChild, 1 === c.childNodes.length && (c = d), d)) { for (f = n.map(oa(c, "script"), ka), g = f.length; l > j; j++)h = c, j !== o && (h = n.clone(h, !0, !0), g && n.merge(f, oa(h, "script"))), b.call(this[j], h, j); if (g) for (i = f[f.length - 1].ownerDocument, n.map(f, la), j = 0; g > j; j++)h = f[j], fa.test(h.type || "") && !L.access(h, "globalEval") && n.contains(i, h) && (h.src ? n._evalUrl && n._evalUrl(h.src) : n.globalEval(h.textContent.replace(ha, ""))) } return this } }), n.each({ appendTo: "append", prependTo: "prepend", insertBefore: "before", insertAfter: "after", replaceAll: "replaceWith" }, function (a, b) { n.fn[a] = function (a) { for (var c, d = [], e = n(a), g = e.length - 1, h = 0; g >= h; h++)c = h === g ? this : this.clone(!0), n(e[h])[b](c), f.apply(d, c.get()); return this.pushStack(d) } }); var qa, ra = {}; function sa(b, c) { var d, e = n(c.createElement(b)).appendTo(c.body), f = a.getDefaultComputedStyle && (d = a.getDefaultComputedStyle(e[0])) ? d.display : n.css(e[0], "display"); return e.detach(), f } function ta(a) { var b = l, c = ra[a]; return c || (c = sa(a, b), "none" !== c && c || (qa = (qa || n("<iframe frameborder='0' width='0' height='0'/>")).appendTo(b.documentElement), b = qa[0].contentDocument, b.write(), b.close(), c = sa(a, b), qa.detach()), ra[a] = c), c } var ua = /^margin/, va = new RegExp("^(" + Q + ")(?!px)[a-z%]+$", "i"), wa = function (b) { return b.ownerDocument.defaultView.opener ? b.ownerDocument.defaultView.getComputedStyle(b, null) : a.getComputedStyle(b, null) }; function xa(a, b, c) { var d, e, f, g, h = a.style; return c = c || wa(a), c && (g = c.getPropertyValue(b) || c[b]), c && ("" !== g || n.contains(a.ownerDocument, a) || (g = n.style(a, b)), va.test(g) && ua.test(b) && (d = h.width, e = h.minWidth, f = h.maxWidth, h.minWidth = h.maxWidth = h.width = g, g = c.width, h.width = d, h.minWidth = e, h.maxWidth = f)), void 0 !== g ? g + "" : g } function ya(a, b) { return { get: function () { return a() ? void delete this.get : (this.get = b).apply(this, arguments) } } } !function () { var b, c, d = l.documentElement, e = l.createElement("div"), f = l.createElement("div"); if (f.style) { f.style.backgroundClip = "content-box", f.cloneNode(!0).style.backgroundClip = "", k.clearCloneStyle = "content-box" === f.style.backgroundClip, e.style.cssText = "border:0;width:0;height:0;top:0;left:-9999px;margin-top:1px;position:absolute", e.appendChild(f); function g() { f.style.cssText = "-webkit-box-sizing:border-box;-moz-box-sizing:border-box;box-sizing:border-box;display:block;margin-top:1%;top:1%;border:1px;padding:1px;width:4px;position:absolute", f.innerHTML = "", d.appendChild(e); var g = a.getComputedStyle(f, null); b = "1%" !== g.top, c = "4px" === g.width, d.removeChild(e) } a.getComputedStyle && n.extend(k, { pixelPosition: function () { return g(), b }, boxSizingReliable: function () { return null == c && g(), c }, reliableMarginRight: function () { var b, c = f.appendChild(l.createElement("div")); return c.style.cssText = f.style.cssText = "-webkit-box-sizing:content-box;-moz-box-sizing:content-box;box-sizing:content-box;display:block;margin:0;border:0;padding:0", c.style.marginRight = c.style.width = "0", f.style.width = "1px", d.appendChild(e), b = !parseFloat(a.getComputedStyle(c, null).marginRight), d.removeChild(e), f.removeChild(c), b } }) } }(), n.swap = function (a, b, c, d) { var e, f, g = {}; for (f in b) g[f] = a.style[f], a.style[f] = b[f]; e = c.apply(a, d || []); for (f in b) a.style[f] = g[f]; return e }; var za = /^(none|table(?!-c[ea]).+)/, Aa = new RegExp("^(" + Q + ")(.*)$", "i"), Ba = new RegExp("^([+-])=(" + Q + ")", "i"), Ca = { position: "absolute", visibility: "hidden", display: "block" }, Da = { letterSpacing: "0", fontWeight: "400" }, Ea = ["Webkit", "O", "Moz", "ms"]; function Fa(a, b) { if (b in a) return b; var c = b[0].toUpperCase() + b.slice(1), d = b, e = Ea.length; while (e--) if (b = Ea[e] + c, b in a) return b; return d } function Ga(a, b, c) { var d = Aa.exec(b); return d ? Math.max(0, d[1] - (c || 0)) + (d[2] || "px") : b } function Ha(a, b, c, d, e) { for (var f = c === (d ? "border" : "content") ? 4 : "width" === b ? 1 : 0, g = 0; 4 > f; f += 2)"margin" === c && (g += n.css(a, c + R[f], !0, e)), d ? ("content" === c && (g -= n.css(a, "padding" + R[f], !0, e)), "margin" !== c && (g -= n.css(a, "border" + R[f] + "Width", !0, e))) : (g += n.css(a, "padding" + R[f], !0, e), "padding" !== c && (g += n.css(a, "border" + R[f] + "Width", !0, e))); return g } function Ia(a, b, c) { var d = !0, e = "width" === b ? a.offsetWidth : a.offsetHeight, f = wa(a), g = "border-box" === n.css(a, "boxSizing", !1, f); if (0 >= e || null == e) { if (e = xa(a, b, f), (0 > e || null == e) && (e = a.style[b]), va.test(e)) return e; d = g && (k.boxSizingReliable() || e === a.style[b]), e = parseFloat(e) || 0 } return e + Ha(a, b, c || (g ? "border" : "content"), d, f) + "px" } function Ja(a, b) { for (var c, d, e, f = [], g = 0, h = a.length; h > g; g++)d = a[g], d.style && (f[g] = L.get(d, "olddisplay"), c = d.style.display, b ? (f[g] || "none" !== c || (d.style.display = ""), "" === d.style.display && S(d) && (f[g] = L.access(d, "olddisplay", ta(d.nodeName)))) : (e = S(d), "none" === c && e || L.set(d, "olddisplay", e ? c : n.css(d, "display")))); for (g = 0; h > g; g++)d = a[g], d.style && (b && "none" !== d.style.display && "" !== d.style.display || (d.style.display = b ? f[g] || "" : "none")); return a } n.extend({ cssHooks: { opacity: { get: function (a, b) { if (b) { var c = xa(a, "opacity"); return "" === c ? "1" : c } } } }, cssNumber: { columnCount: !0, fillOpacity: !0, flexGrow: !0, flexShrink: !0, fontWeight: !0, lineHeight: !0, opacity: !0, order: !0, orphans: !0, widows: !0, zIndex: !0, zoom: !0 }, cssProps: { "float": "cssFloat" }, style: function (a, b, c, d) { if (a && 3 !== a.nodeType && 8 !== a.nodeType && a.style) { var e, f, g, h = n.camelCase(b), i = a.style; return b = n.cssProps[h] || (n.cssProps[h] = Fa(i, h)), g = n.cssHooks[b] || n.cssHooks[h], void 0 === c ? g && "get" in g && void 0 !== (e = g.get(a, !1, d)) ? e : i[b] : (f = typeof c, "string" === f && (e = Ba.exec(c)) && (c = (e[1] + 1) * e[2] + parseFloat(n.css(a, b)), f = "number"), null != c && c === c && ("number" !== f || n.cssNumber[h] || (c += "px"), k.clearCloneStyle || "" !== c || 0 !== b.indexOf("background") || (i[b] = "inherit"), g && "set" in g && void 0 === (c = g.set(a, c, d)) || (i[b] = c)), void 0) } }, css: function (a, b, c, d) { var e, f, g, h = n.camelCase(b); return b = n.cssProps[h] || (n.cssProps[h] = Fa(a.style, h)), g = n.cssHooks[b] || n.cssHooks[h], g && "get" in g && (e = g.get(a, !0, c)), void 0 === e && (e = xa(a, b, d)), "normal" === e && b in Da && (e = Da[b]), "" === c || c ? (f = parseFloat(e), c === !0 || n.isNumeric(f) ? f || 0 : e) : e } }), n.each(["height", "width"], function (a, b) { n.cssHooks[b] = { get: function (a, c, d) { return c ? za.test(n.css(a, "display")) && 0 === a.offsetWidth ? n.swap(a, Ca, function () { return Ia(a, b, d) }) : Ia(a, b, d) : void 0 }, set: function (a, c, d) { var e = d && wa(a); return Ga(a, c, d ? Ha(a, b, d, "border-box" === n.css(a, "boxSizing", !1, e), e) : 0) } } }), n.cssHooks.marginRight = ya(k.reliableMarginRight, function (a, b) { return b ? n.swap(a, { display: "inline-block" }, xa, [a, "marginRight"]) : void 0 }), n.each({ margin: "", padding: "", border: "Width" }, function (a, b) { n.cssHooks[a + b] = { expand: function (c) { for (var d = 0, e = {}, f = "string" == typeof c ? c.split(" ") : [c]; 4 > d; d++)e[a + R[d] + b] = f[d] || f[d - 2] || f[0]; return e } }, ua.test(a) || (n.cssHooks[a + b].set = Ga) }), n.fn.extend({ css: function (a, b) { return J(this, function (a, b, c) { var d, e, f = {}, g = 0; if (n.isArray(b)) { for (d = wa(a), e = b.length; e > g; g++)f[b[g]] = n.css(a, b[g], !1, d); return f } return void 0 !== c ? n.style(a, b, c) : n.css(a, b) }, a, b, arguments.length > 1) }, show: function () { return Ja(this, !0) }, hide: function () { return Ja(this) }, toggle: function (a) { return "boolean" == typeof a ? a ? this.show() : this.hide() : this.each(function () { S(this) ? n(this).show() : n(this).hide() }) } }); function Ka(a, b, c, d, e) { return new Ka.prototype.init(a, b, c, d, e) } n.Tween = Ka, Ka.prototype = { constructor: Ka, init: function (a, b, c, d, e, f) { this.elem = a, this.prop = c, this.easing = e || "swing", this.options = b, this.start = this.now = this.cur(), this.end = d, this.unit = f || (n.cssNumber[c] ? "" : "px") }, cur: function () { var a = Ka.propHooks[this.prop]; return a && a.get ? a.get(this) : Ka.propHooks._default.get(this) }, run: function (a) { var b, c = Ka.propHooks[this.prop]; return this.options.duration ? this.pos = b = n.easing[this.easing](a, this.options.duration * a, 0, 1, this.options.duration) : this.pos = b = a, this.now = (this.end - this.start) * b + this.start, this.options.step && this.options.step.call(this.elem, this.now, this), c && c.set ? c.set(this) : Ka.propHooks._default.set(this), this } }, Ka.prototype.init.prototype = Ka.prototype, Ka.propHooks = { _default: { get: function (a) { var b; return null == a.elem[a.prop] || a.elem.style && null != a.elem.style[a.prop] ? (b = n.css(a.elem, a.prop, ""), b && "auto" !== b ? b : 0) : a.elem[a.prop] }, set: function (a) { n.fx.step[a.prop] ? n.fx.step[a.prop](a) : a.elem.style && (null != a.elem.style[n.cssProps[a.prop]] || n.cssHooks[a.prop]) ? n.style(a.elem, a.prop, a.now + a.unit) : a.elem[a.prop] = a.now } } }, Ka.propHooks.scrollTop = Ka.propHooks.scrollLeft = { set: function (a) { a.elem.nodeType && a.elem.parentNode && (a.elem[a.prop] = a.now) } }, n.easing = { linear: function (a) { return a }, swing: function (a) { return .5 - Math.cos(a * Math.PI) / 2 } }, n.fx = Ka.prototype.init, n.fx.step = {}; var La, Ma, Na = /^(?:toggle|show|hide)$/, Oa = new RegExp("^(?:([+-])=|)(" + Q + ")([a-z%]*)$", "i"), Pa = /queueHooks$/, Qa = [Va], Ra = { "*": [function (a, b) { var c = this.createTween(a, b), d = c.cur(), e = Oa.exec(b), f = e && e[3] || (n.cssNumber[a] ? "" : "px"), g = (n.cssNumber[a] || "px" !== f && +d) && Oa.exec(n.css(c.elem, a)), h = 1, i = 20; if (g && g[3] !== f) { f = f || g[3], e = e || [], g = +d || 1; do h = h || ".5", g /= h, n.style(c.elem, a, g + f); while (h !== (h = c.cur() / d) && 1 !== h && --i) } return e && (g = c.start = +g || +d || 0, c.unit = f, c.end = e[1] ? g + (e[1] + 1) * e[2] : +e[2]), c }] }; function Sa() { return setTimeout(function () { La = void 0 }), La = n.now() } function Ta(a, b) { var c, d = 0, e = { height: a }; for (b = b ? 1 : 0; 4 > d; d += 2 - b)c = R[d], e["margin" + c] = e["padding" + c] = a; return b && (e.opacity = e.width = a), e } function Ua(a, b, c) { for (var d, e = (Ra[b] || []).concat(Ra["*"]), f = 0, g = e.length; g > f; f++)if (d = e[f].call(c, b, a)) return d } function Va(a, b, c) { var d, e, f, g, h, i, j, k, l = this, m = {}, o = a.style, p = a.nodeType && S(a), q = L.get(a, "fxshow"); c.queue || (h = n._queueHooks(a, "fx"), null == h.unqueued && (h.unqueued = 0, i = h.empty.fire, h.empty.fire = function () { h.unqueued || i() }), h.unqueued++, l.always(function () { l.always(function () { h.unqueued--, n.queue(a, "fx").length || h.empty.fire() }) })), 1 === a.nodeType && ("height" in b || "width" in b) && (c.overflow = [o.overflow, o.overflowX, o.overflowY], j = n.css(a, "display"), k = "none" === j ? L.get(a, "olddisplay") || ta(a.nodeName) : j, "inline" === k && "none" === n.css(a, "float") && (o.display = "inline-block")), c.overflow && (o.overflow = "hidden", l.always(function () { o.overflow = c.overflow[0], o.overflowX = c.overflow[1], o.overflowY = c.overflow[2] })); for (d in b) if (e = b[d], Na.exec(e)) { if (delete b[d], f = f || "toggle" === e, e === (p ? "hide" : "show")) { if ("show" !== e || !q || void 0 === q[d]) continue; p = !0 } m[d] = q && q[d] || n.style(a, d) } else j = void 0; if (n.isEmptyObject(m)) "inline" === ("none" === j ? ta(a.nodeName) : j) && (o.display = j); else { q ? "hidden" in q && (p = q.hidden) : q = L.access(a, "fxshow", {}), f && (q.hidden = !p), p ? n(a).show() : l.done(function () { n(a).hide() }), l.done(function () { var b; L.remove(a, "fxshow"); for (b in m) n.style(a, b, m[b]) }); for (d in m) g = Ua(p ? q[d] : 0, d, l), d in q || (q[d] = g.start, p && (g.end = g.start, g.start = "width" === d || "height" === d ? 1 : 0)) } } function Wa(a, b) { var c, d, e, f, g; for (c in a) if (d = n.camelCase(c), e = b[d], f = a[c], n.isArray(f) && (e = f[1], f = a[c] = f[0]), c !== d && (a[d] = f, delete a[c]), g = n.cssHooks[d], g && "expand" in g) { f = g.expand(f), delete a[d]; for (c in f) c in a || (a[c] = f[c], b[c] = e) } else b[d] = e } function Xa(a, b, c) { var d, e, f = 0, g = Qa.length, h = n.Deferred().always(function () { delete i.elem }), i = function () { if (e) return !1; for (var b = La || Sa(), c = Math.max(0, j.startTime + j.duration - b), d = c / j.duration || 0, f = 1 - d, g = 0, i = j.tweens.length; i > g; g++)j.tweens[g].run(f); return h.notifyWith(a, [j, f, c]), 1 > f && i ? c : (h.resolveWith(a, [j]), !1) }, j = h.promise({ elem: a, props: n.extend({}, b), opts: n.extend(!0, { specialEasing: {} }, c), originalProperties: b, originalOptions: c, startTime: La || Sa(), duration: c.duration, tweens: [], createTween: function (b, c) { var d = n.Tween(a, j.opts, b, c, j.opts.specialEasing[b] || j.opts.easing); return j.tweens.push(d), d }, stop: function (b) { var c = 0, d = b ? j.tweens.length : 0; if (e) return this; for (e = !0; d > c; c++)j.tweens[c].run(1); return b ? h.resolveWith(a, [j, b]) : h.rejectWith(a, [j, b]), this } }), k = j.props; for (Wa(k, j.opts.specialEasing); g > f; f++)if (d = Qa[f].call(j, a, k, j.opts)) return d; return n.map(k, Ua, j), n.isFunction(j.opts.start) && j.opts.start.call(a, j), n.fx.timer(n.extend(i, { elem: a, anim: j, queue: j.opts.queue })), j.progress(j.opts.progress).done(j.opts.done, j.opts.complete).fail(j.opts.fail).always(j.opts.always) } n.Animation = n.extend(Xa, { tweener: function (a, b) { n.isFunction(a) ? (b = a, a = ["*"]) : a = a.split(" "); for (var c, d = 0, e = a.length; e > d; d++)c = a[d], Ra[c] = Ra[c] || [], Ra[c].unshift(b) }, prefilter: function (a, b) { b ? Qa.unshift(a) : Qa.push(a) } }), n.speed = function (a, b, c) { var d = a && "object" == typeof a ? n.extend({}, a) : { complete: c || !c && b || n.isFunction(a) && a, duration: a, easing: c && b || b && !n.isFunction(b) && b }; return d.duration = n.fx.off ? 0 : "number" == typeof d.duration ? d.duration : d.duration in n.fx.speeds ? n.fx.speeds[d.duration] : n.fx.speeds._default, (null == d.queue || d.queue === !0) && (d.queue = "fx"), d.old = d.complete, d.complete = function () { n.isFunction(d.old) && d.old.call(this), d.queue && n.dequeue(this, d.queue) }, d }, n.fn.extend({ fadeTo: function (a, b, c, d) { return this.filter(S).css("opacity", 0).show().end().animate({ opacity: b }, a, c, d) }, animate: function (a, b, c, d) { var e = n.isEmptyObject(a), f = n.speed(b, c, d), g = function () { var b = Xa(this, n.extend({}, a), f); (e || L.get(this, "finish")) && b.stop(!0) }; return g.finish = g, e || f.queue === !1 ? this.each(g) : this.queue(f.queue, g) }, stop: function (a, b, c) { var d = function (a) { var b = a.stop; delete a.stop, b(c) }; return "string" != typeof a && (c = b, b = a, a = void 0), b && a !== !1 && this.queue(a || "fx", []), this.each(function () { var b = !0, e = null != a && a + "queueHooks", f = n.timers, g = L.get(this); if (e) g[e] && g[e].stop && d(g[e]); else for (e in g) g[e] && g[e].stop && Pa.test(e) && d(g[e]); for (e = f.length; e--;)f[e].elem !== this || null != a && f[e].queue !== a || (f[e].anim.stop(c), b = !1, f.splice(e, 1)); (b || !c) && n.dequeue(this, a) }) }, finish: function (a) { return a !== !1 && (a = a || "fx"), this.each(function () { var b, c = L.get(this), d = c[a + "queue"], e = c[a + "queueHooks"], f = n.timers, g = d ? d.length : 0; for (c.finish = !0, n.queue(this, a, []), e && e.stop && e.stop.call(this, !0), b = f.length; b--;)f[b].elem === this && f[b].queue === a && (f[b].anim.stop(!0), f.splice(b, 1)); for (b = 0; g > b; b++)d[b] && d[b].finish && d[b].finish.call(this); delete c.finish }) } }), n.each(["toggle", "show", "hide"], function (a, b) { var c = n.fn[b]; n.fn[b] = function (a, d, e) { return null == a || "boolean" == typeof a ? c.apply(this, arguments) : this.animate(Ta(b, !0), a, d, e) } }), n.each({ slideDown: Ta("show"), slideUp: Ta("hide"), slideToggle: Ta("toggle"), fadeIn: { opacity: "show" }, fadeOut: { opacity: "hide" }, fadeToggle: { opacity: "toggle" } }, function (a, b) { n.fn[a] = function (a, c, d) { return this.animate(b, a, c, d) } }), n.timers = [], n.fx.tick = function () { var a, b = 0, c = n.timers; for (La = n.now(); b < c.length; b++)a = c[b], a() || c[b] !== a || c.splice(b--, 1); c.length || n.fx.stop(), La = void 0 }, n.fx.timer = function (a) { n.timers.push(a), a() ? n.fx.start() : n.timers.pop() }, n.fx.interval = 13, n.fx.start = function () { Ma || (Ma = setInterval(n.fx.tick, n.fx.interval)) }, n.fx.stop = function () { clearInterval(Ma), Ma = null }, n.fx.speeds = { slow: 600, fast: 200, _default: 400 }, n.fn.delay = function (a, b) { return a = n.fx ? n.fx.speeds[a] || a : a, b = b || "fx", this.queue(b, function (b, c) { var d = setTimeout(b, a); c.stop = function () { clearTimeout(d) } }) }, function () { var a = l.createElement("input"), b = l.createElement("select"), c = b.appendChild(l.createElement("option")); a.type = "checkbox", k.checkOn = "" !== a.value, k.optSelected = c.selected, b.disabled = !0, k.optDisabled = !c.disabled, a = l.createElement("input"), a.value = "t", a.type = "radio", k.radioValue = "t" === a.value }(); var Ya, Za, $a = n.expr.attrHandle; n.fn.extend({ attr: function (a, b) { return J(this, n.attr, a, b, arguments.length > 1) }, removeAttr: function (a) { return this.each(function () { n.removeAttr(this, a) }) } }), n.extend({
            attr: function (a, b, c) {
                var d, e, f = a.nodeType; if (a && 3 !== f && 8 !== f && 2 !== f) return typeof a.getAttribute === U ? n.prop(a, b, c) : (1 === f && n.isXMLDoc(a) || (b = b.toLowerCase(), d = n.attrHooks[b] || (n.expr.match.bool.test(b) ? Za : Ya)),
                    void 0 === c ? d && "get" in d && null !== (e = d.get(a, b)) ? e : (e = n.find.attr(a, b), null == e ? void 0 : e) : null !== c ? d && "set" in d && void 0 !== (e = d.set(a, c, b)) ? e : (a.setAttribute(b, c + ""), c) : void n.removeAttr(a, b))
            }, removeAttr: function (a, b) { var c, d, e = 0, f = b && b.match(E); if (f && 1 === a.nodeType) while (c = f[e++]) d = n.propFix[c] || c, n.expr.match.bool.test(c) && (a[d] = !1), a.removeAttribute(c) }, attrHooks: { type: { set: function (a, b) { if (!k.radioValue && "radio" === b && n.nodeName(a, "input")) { var c = a.value; return a.setAttribute("type", b), c && (a.value = c), b } } } }
        }), Za = { set: function (a, b, c) { return b === !1 ? n.removeAttr(a, c) : a.setAttribute(c, c), c } }, n.each(n.expr.match.bool.source.match(/\w+/g), function (a, b) { var c = $a[b] || n.find.attr; $a[b] = function (a, b, d) { var e, f; return d || (f = $a[b], $a[b] = e, e = null != c(a, b, d) ? b.toLowerCase() : null, $a[b] = f), e } }); var _a = /^(?:input|select|textarea|button)$/i; n.fn.extend({ prop: function (a, b) { return J(this, n.prop, a, b, arguments.length > 1) }, removeProp: function (a) { return this.each(function () { delete this[n.propFix[a] || a] }) } }), n.extend({ propFix: { "for": "htmlFor", "class": "className" }, prop: function (a, b, c) { var d, e, f, g = a.nodeType; if (a && 3 !== g && 8 !== g && 2 !== g) return f = 1 !== g || !n.isXMLDoc(a), f && (b = n.propFix[b] || b, e = n.propHooks[b]), void 0 !== c ? e && "set" in e && void 0 !== (d = e.set(a, c, b)) ? d : a[b] = c : e && "get" in e && null !== (d = e.get(a, b)) ? d : a[b] }, propHooks: { tabIndex: { get: function (a) { return a.hasAttribute("tabindex") || _a.test(a.nodeName) || a.href ? a.tabIndex : -1 } } } }), k.optSelected || (n.propHooks.selected = { get: function (a) { var b = a.parentNode; return b && b.parentNode && b.parentNode.selectedIndex, null } }), n.each(["tabIndex", "readOnly", "maxLength", "cellSpacing", "cellPadding", "rowSpan", "colSpan", "useMap", "frameBorder", "contentEditable"], function () { n.propFix[this.toLowerCase()] = this }); var ab = /[\t\r\n\f]/g; n.fn.extend({ addClass: function (a) { var b, c, d, e, f, g, h = "string" == typeof a && a, i = 0, j = this.length; if (n.isFunction(a)) return this.each(function (b) { n(this).addClass(a.call(this, b, this.className)) }); if (h) for (b = (a || "").match(E) || []; j > i; i++)if (c = this[i], d = 1 === c.nodeType && (c.className ? (" " + c.className + " ").replace(ab, " ") : " ")) { f = 0; while (e = b[f++]) d.indexOf(" " + e + " ") < 0 && (d += e + " "); g = n.trim(d), c.className !== g && (c.className = g) } return this }, removeClass: function (a) { var b, c, d, e, f, g, h = 0 === arguments.length || "string" == typeof a && a, i = 0, j = this.length; if (n.isFunction(a)) return this.each(function (b) { n(this).removeClass(a.call(this, b, this.className)) }); if (h) for (b = (a || "").match(E) || []; j > i; i++)if (c = this[i], d = 1 === c.nodeType && (c.className ? (" " + c.className + " ").replace(ab, " ") : "")) { f = 0; while (e = b[f++]) while (d.indexOf(" " + e + " ") >= 0) d = d.replace(" " + e + " ", " "); g = a ? n.trim(d) : "", c.className !== g && (c.className = g) } return this }, toggleClass: function (a, b) { var c = typeof a; return "boolean" == typeof b && "string" === c ? b ? this.addClass(a) : this.removeClass(a) : this.each(n.isFunction(a) ? function (c) { n(this).toggleClass(a.call(this, c, this.className, b), b) } : function () { if ("string" === c) { var b, d = 0, e = n(this), f = a.match(E) || []; while (b = f[d++]) e.hasClass(b) ? e.removeClass(b) : e.addClass(b) } else (c === U || "boolean" === c) && (this.className && L.set(this, "__className__", this.className), this.className = this.className || a === !1 ? "" : L.get(this, "__className__") || "") }) }, hasClass: function (a) { for (var b = " " + a + " ", c = 0, d = this.length; d > c; c++)if (1 === this[c].nodeType && (" " + this[c].className + " ").replace(ab, " ").indexOf(b) >= 0) return !0; return !1 } }); var bb = /\r/g; n.fn.extend({ val: function (a) { var b, c, d, e = this[0]; { if (arguments.length) return d = n.isFunction(a), this.each(function (c) { var e; 1 === this.nodeType && (e = d ? a.call(this, c, n(this).val()) : a, null == e ? e = "" : "number" == typeof e ? e += "" : n.isArray(e) && (e = n.map(e, function (a) { return null == a ? "" : a + "" })), b = n.valHooks[this.type] || n.valHooks[this.nodeName.toLowerCase()], b && "set" in b && void 0 !== b.set(this, e, "value") || (this.value = e)) }); if (e) return b = n.valHooks[e.type] || n.valHooks[e.nodeName.toLowerCase()], b && "get" in b && void 0 !== (c = b.get(e, "value")) ? c : (c = e.value, "string" == typeof c ? c.replace(bb, "") : null == c ? "" : c) } } }), n.extend({ valHooks: { option: { get: function (a) { var b = n.find.attr(a, "value"); return null != b ? b : n.trim(n.text(a)) } }, select: { get: function (a) { for (var b, c, d = a.options, e = a.selectedIndex, f = "select-one" === a.type || 0 > e, g = f ? null : [], h = f ? e + 1 : d.length, i = 0 > e ? h : f ? e : 0; h > i; i++)if (c = d[i], !(!c.selected && i !== e || (k.optDisabled ? c.disabled : null !== c.getAttribute("disabled")) || c.parentNode.disabled && n.nodeName(c.parentNode, "optgroup"))) { if (b = n(c).val(), f) return b; g.push(b) } return g }, set: function (a, b) { var c, d, e = a.options, f = n.makeArray(b), g = e.length; while (g--) d = e[g], (d.selected = n.inArray(d.value, f) >= 0) && (c = !0); return c || (a.selectedIndex = -1), f } } } }), n.each(["radio", "checkbox"], function () { n.valHooks[this] = { set: function (a, b) { return n.isArray(b) ? a.checked = n.inArray(n(a).val(), b) >= 0 : void 0 } }, k.checkOn || (n.valHooks[this].get = function (a) { return null === a.getAttribute("value") ? "on" : a.value }) }), n.each("blur focus focusin focusout load resize scroll unload click dblclick mousedown mouseup mousemove mouseover mouseout mouseenter mouseleave change select submit keydown keypress keyup error contextmenu".split(" "), function (a, b) { n.fn[b] = function (a, c) { return arguments.length > 0 ? this.on(b, null, a, c) : this.trigger(b) } }), n.fn.extend({ hover: function (a, b) { return this.mouseenter(a).mouseleave(b || a) }, bind: function (a, b, c) { return this.on(a, null, b, c) }, unbind: function (a, b) { return this.off(a, null, b) }, delegate: function (a, b, c, d) { return this.on(b, a, c, d) }, undelegate: function (a, b, c) { return 1 === arguments.length ? this.off(a, "**") : this.off(b, a || "**", c) } }); var cb = n.now(), db = /\?/; n.parseJSON = function (a) { return JSON.parse(a + "") }, n.parseXML = function (a) { var b, c; if (!a || "string" != typeof a) return null; try { c = new DOMParser, b = c.parseFromString(a, "text/xml") } catch (d) { b = void 0 } return (!b || b.getElementsByTagName("parsererror").length) && n.error("Invalid XML: " + a), b }; var eb = /#.*$/, fb = /([?&])_=[^&]*/, gb = /^(.*?):[ \t]*([^\r\n]*)$/gm, hb = /^(?:about|app|app-storage|.+-extension|file|res|widget):$/, ib = /^(?:GET|HEAD)$/, jb = /^\/\//, kb = /^([\w.+-]+:)(?:\/\/(?:[^\/?#]*@|)([^\/?#:]*)(?::(\d+)|)|)/, lb = {}, mb = {}, nb = "*/".concat("*"), ob = a.location.href, pb = kb.exec(ob.toLowerCase()) || []; function qb(a) { return function (b, c) { "string" != typeof b && (c = b, b = "*"); var d, e = 0, f = b.toLowerCase().match(E) || []; if (n.isFunction(c)) while (d = f[e++]) "+" === d[0] ? (d = d.slice(1) || "*", (a[d] = a[d] || []).unshift(c)) : (a[d] = a[d] || []).push(c) } } function rb(a, b, c, d) { var e = {}, f = a === mb; function g(h) { var i; return e[h] = !0, n.each(a[h] || [], function (a, h) { var j = h(b, c, d); return "string" != typeof j || f || e[j] ? f ? !(i = j) : void 0 : (b.dataTypes.unshift(j), g(j), !1) }), i } return g(b.dataTypes[0]) || !e["*"] && g("*") } function sb(a, b) { var c, d, e = n.ajaxSettings.flatOptions || {}; for (c in b) void 0 !== b[c] && ((e[c] ? a : d || (d = {}))[c] = b[c]); return d && n.extend(!0, a, d), a } function tb(a, b, c) { var d, e, f, g, h = a.contents, i = a.dataTypes; while ("*" === i[0]) i.shift(), void 0 === d && (d = a.mimeType || b.getResponseHeader("Content-Type")); if (d) for (e in h) if (h[e] && h[e].test(d)) { i.unshift(e); break } if (i[0] in c) f = i[0]; else { for (e in c) { if (!i[0] || a.converters[e + " " + i[0]]) { f = e; break } g || (g = e) } f = f || g } return f ? (f !== i[0] && i.unshift(f), c[f]) : void 0 } function ub(a, b, c, d) { var e, f, g, h, i, j = {}, k = a.dataTypes.slice(); if (k[1]) for (g in a.converters) j[g.toLowerCase()] = a.converters[g]; f = k.shift(); while (f) if (a.responseFields[f] && (c[a.responseFields[f]] = b), !i && d && a.dataFilter && (b = a.dataFilter(b, a.dataType)), i = f, f = k.shift()) if ("*" === f) f = i; else if ("*" !== i && i !== f) { if (g = j[i + " " + f] || j["* " + f], !g) for (e in j) if (h = e.split(" "), h[1] === f && (g = j[i + " " + h[0]] || j["* " + h[0]])) { g === !0 ? g = j[e] : j[e] !== !0 && (f = h[0], k.unshift(h[1])); break } if (g !== !0) if (g && a["throws"]) b = g(b); else try { b = g(b) } catch (l) { return { state: "parsererror", error: g ? l : "No conversion from " + i + " to " + f } } } return { state: "success", data: b } } n.extend({ active: 0, lastModified: {}, etag: {}, ajaxSettings: { url: ob, type: "GET", isLocal: hb.test(pb[1]), global: !0, processData: !0, async: !0, contentType: "application/x-www-form-urlencoded; charset=UTF-8", accepts: { "*": nb, text: "text/plain", html: "text/html", xml: "application/xml, text/xml", json: "application/json, text/javascript" }, contents: { xml: /xml/, html: /html/, json: /json/ }, responseFields: { xml: "responseXML", text: "responseText", json: "responseJSON" }, converters: { "* text": String, "text html": !0, "text json": n.parseJSON, "text xml": n.parseXML }, flatOptions: { url: !0, context: !0 } }, ajaxSetup: function (a, b) { return b ? sb(sb(a, n.ajaxSettings), b) : sb(n.ajaxSettings, a) }, ajaxPrefilter: qb(lb), ajaxTransport: qb(mb), ajax: function (a, b) { "object" == typeof a && (b = a, a = void 0), b = b || {}; var c, d, e, f, g, h, i, j, k = n.ajaxSetup({}, b), l = k.context || k, m = k.context && (l.nodeType || l.jquery) ? n(l) : n.event, o = n.Deferred(), p = n.Callbacks("once memory"), q = k.statusCode || {}, r = {}, s = {}, t = 0, u = "canceled", v = { readyState: 0, getResponseHeader: function (a) { var b; if (2 === t) { if (!f) { f = {}; while (b = gb.exec(e)) f[b[1].toLowerCase()] = b[2] } b = f[a.toLowerCase()] } return null == b ? null : b }, getAllResponseHeaders: function () { return 2 === t ? e : null }, setRequestHeader: function (a, b) { var c = a.toLowerCase(); return t || (a = s[c] = s[c] || a, r[a] = b), this }, overrideMimeType: function (a) { return t || (k.mimeType = a), this }, statusCode: function (a) { var b; if (a) if (2 > t) for (b in a) q[b] = [q[b], a[b]]; else v.always(a[v.status]); return this }, abort: function (a) { var b = a || u; return c && c.abort(b), x(0, b), this } }; if (o.promise(v).complete = p.add, v.success = v.done, v.error = v.fail, k.url = ((a || k.url || ob) + "").replace(eb, "").replace(jb, pb[1] + "//"), k.type = b.method || b.type || k.method || k.type, k.dataTypes = n.trim(k.dataType || "*").toLowerCase().match(E) || [""], null == k.crossDomain && (h = kb.exec(k.url.toLowerCase()), k.crossDomain = !(!h || h[1] === pb[1] && h[2] === pb[2] && (h[3] || ("http:" === h[1] ? "80" : "443")) === (pb[3] || ("http:" === pb[1] ? "80" : "443")))), k.data && k.processData && "string" != typeof k.data && (k.data = n.param(k.data, k.traditional)), rb(lb, k, b, v), 2 === t) return v; i = n.event && k.global, i && 0 === n.active++ && n.event.trigger("ajaxStart"), k.type = k.type.toUpperCase(), k.hasContent = !ib.test(k.type), d = k.url, k.hasContent || (k.data && (d = k.url += (db.test(d) ? "&" : "?") + k.data, delete k.data), k.cache === !1 && (k.url = fb.test(d) ? d.replace(fb, "$1_=" + cb++) : d + (db.test(d) ? "&" : "?") + "_=" + cb++)), k.ifModified && (n.lastModified[d] && v.setRequestHeader("If-Modified-Since", n.lastModified[d]), n.etag[d] && v.setRequestHeader("If-None-Match", n.etag[d])), (k.data && k.hasContent && k.contentType !== !1 || b.contentType) && v.setRequestHeader("Content-Type", k.contentType), v.setRequestHeader("Accept", k.dataTypes[0] && k.accepts[k.dataTypes[0]] ? k.accepts[k.dataTypes[0]] + ("*" !== k.dataTypes[0] ? ", " + nb + "; q=0.01" : "") : k.accepts["*"]); for (j in k.headers) v.setRequestHeader(j, k.headers[j]); if (k.beforeSend && (k.beforeSend.call(l, v, k) === !1 || 2 === t)) return v.abort(); u = "abort"; for (j in { success: 1, error: 1, complete: 1 }) v[j](k[j]); if (c = rb(mb, k, b, v)) { v.readyState = 1, i && m.trigger("ajaxSend", [v, k]), k.async && k.timeout > 0 && (g = setTimeout(function () { v.abort("timeout") }, k.timeout)); try { t = 1, c.send(r, x) } catch (w) { if (!(2 > t)) throw w; x(-1, w) } } else x(-1, "No Transport"); function x(a, b, f, h) { var j, r, s, u, w, x = b; 2 !== t && (t = 2, g && clearTimeout(g), c = void 0, e = h || "", v.readyState = a > 0 ? 4 : 0, j = a >= 200 && 300 > a || 304 === a, f && (u = tb(k, v, f)), u = ub(k, u, v, j), j ? (k.ifModified && (w = v.getResponseHeader("Last-Modified"), w && (n.lastModified[d] = w), w = v.getResponseHeader("etag"), w && (n.etag[d] = w)), 204 === a || "HEAD" === k.type ? x = "nocontent" : 304 === a ? x = "notmodified" : (x = u.state, r = u.data, s = u.error, j = !s)) : (s = x, (a || !x) && (x = "error", 0 > a && (a = 0))), v.status = a, v.statusText = (b || x) + "", j ? o.resolveWith(l, [r, x, v]) : o.rejectWith(l, [v, x, s]), v.statusCode(q), q = void 0, i && m.trigger(j ? "ajaxSuccess" : "ajaxError", [v, k, j ? r : s]), p.fireWith(l, [v, x]), i && (m.trigger("ajaxComplete", [v, k]), --n.active || n.event.trigger("ajaxStop"))) } return v }, getJSON: function (a, b, c) { return n.get(a, b, c, "json") }, getScript: function (a, b) { return n.get(a, void 0, b, "script") } }), n.each(["get", "post"], function (a, b) { n[b] = function (a, c, d, e) { return n.isFunction(c) && (e = e || d, d = c, c = void 0), n.ajax({ url: a, type: b, dataType: e, data: c, success: d }) } }), n._evalUrl = function (a) { return n.ajax({ url: a, type: "GET", dataType: "script", async: !1, global: !1, "throws": !0 }) }, n.fn.extend({ wrapAll: function (a) { var b; return n.isFunction(a) ? this.each(function (b) { n(this).wrapAll(a.call(this, b)) }) : (this[0] && (b = n(a, this[0].ownerDocument).eq(0).clone(!0), this[0].parentNode && b.insertBefore(this[0]), b.map(function () { var a = this; while (a.firstElementChild) a = a.firstElementChild; return a }).append(this)), this) }, wrapInner: function (a) { return this.each(n.isFunction(a) ? function (b) { n(this).wrapInner(a.call(this, b)) } : function () { var b = n(this), c = b.contents(); c.length ? c.wrapAll(a) : b.append(a) }) }, wrap: function (a) { var b = n.isFunction(a); return this.each(function (c) { n(this).wrapAll(b ? a.call(this, c) : a) }) }, unwrap: function () { return this.parent().each(function () { n.nodeName(this, "body") || n(this).replaceWith(this.childNodes) }).end() } }), n.expr.filters.hidden = function (a) { return a.offsetWidth <= 0 && a.offsetHeight <= 0 }, n.expr.filters.visible = function (a) { return !n.expr.filters.hidden(a) }; var vb = /%20/g, wb = /\[\]$/, xb = /\r?\n/g, yb = /^(?:submit|button|image|reset|file)$/i, zb = /^(?:input|select|textarea|keygen)/i; function Ab(a, b, c, d) { var e; if (n.isArray(b)) n.each(b, function (b, e) { c || wb.test(a) ? d(a, e) : Ab(a + "[" + ("object" == typeof e ? b : "") + "]", e, c, d) }); else if (c || "object" !== n.type(b)) d(a, b); else for (e in b) Ab(a + "[" + e + "]", b[e], c, d) } n.param = function (a, b) { var c, d = [], e = function (a, b) { b = n.isFunction(b) ? b() : null == b ? "" : b, d[d.length] = encodeURIComponent(a) + "=" + encodeURIComponent(b) }; if (void 0 === b && (b = n.ajaxSettings && n.ajaxSettings.traditional), n.isArray(a) || a.jquery && !n.isPlainObject(a)) n.each(a, function () { e(this.name, this.value) }); else for (c in a) Ab(c, a[c], b, e); return d.join("&").replace(vb, "+") }, n.fn.extend({ serialize: function () { return n.param(this.serializeArray()) }, serializeArray: function () { return this.map(function () { var a = n.prop(this, "elements"); return a ? n.makeArray(a) : this }).filter(function () { var a = this.type; return this.name && !n(this).is(":disabled") && zb.test(this.nodeName) && !yb.test(a) && (this.checked || !T.test(a)) }).map(function (a, b) { var c = n(this).val(); return null == c ? null : n.isArray(c) ? n.map(c, function (a) { return { name: b.name, value: a.replace(xb, "\r\n") } }) : { name: b.name, value: c.replace(xb, "\r\n") } }).get() } }), n.ajaxSettings.xhr = function () { try { return new XMLHttpRequest } catch (a) { } }; var Bb = 0, Cb = {}, Db = { 0: 200, 1223: 204 }, Eb = n.ajaxSettings.xhr(); a.attachEvent && a.attachEvent("onunload", function () { for (var a in Cb) Cb[a]() }), k.cors = !!Eb && "withCredentials" in Eb, k.ajax = Eb = !!Eb, n.ajaxTransport(function (a) { var b; return k.cors || Eb && !a.crossDomain ? { send: function (c, d) { var e, f = a.xhr(), g = ++Bb; if (f.open(a.type, a.url, a.async, a.username, a.password), a.xhrFields) for (e in a.xhrFields) f[e] = a.xhrFields[e]; a.mimeType && f.overrideMimeType && f.overrideMimeType(a.mimeType), a.crossDomain || c["X-Requested-With"] || (c["X-Requested-With"] = "XMLHttpRequest"); for (e in c) f.setRequestHeader(e, c[e]); b = function (a) { return function () { b && (delete Cb[g], b = f.onload = f.onerror = null, "abort" === a ? f.abort() : "error" === a ? d(f.status, f.statusText) : d(Db[f.status] || f.status, f.statusText, "string" == typeof f.responseText ? { text: f.responseText } : void 0, f.getAllResponseHeaders())) } }, f.onload = b(), f.onerror = b("error"), b = Cb[g] = b("abort"); try { f.send(a.hasContent && a.data || null) } catch (h) { if (b) throw h } }, abort: function () { b && b() } } : void 0 }), n.ajaxSetup({ accepts: { script: "text/javascript, application/javascript, application/ecmascript, application/x-ecmascript" }, contents: { script: /(?:java|ecma)script/ }, converters: { "text script": function (a) { return n.globalEval(a), a } } }), n.ajaxPrefilter("script", function (a) { void 0 === a.cache && (a.cache = !1), a.crossDomain && (a.type = "GET") }), n.ajaxTransport("script", function (a) { if (a.crossDomain) { var b, c; return { send: function (d, e) { b = n("<script>").prop({ async: !0, charset: a.scriptCharset, src: a.url }).on("load error", c = function (a) { b.remove(), c = null, a && e("error" === a.type ? 404 : 200, a.type) }), l.head.appendChild(b[0]) }, abort: function () { c && c() } } } }); var Fb = [], Gb = /(=)\?(?=&|$)|\?\?/; n.ajaxSetup({ jsonp: "callback", jsonpCallback: function () { var a = Fb.pop() || n.expando + "_" + cb++; return this[a] = !0, a } }), n.ajaxPrefilter("json jsonp", function (b, c, d) { var e, f, g, h = b.jsonp !== !1 && (Gb.test(b.url) ? "url" : "string" == typeof b.data && !(b.contentType || "").indexOf("application/x-www-form-urlencoded") && Gb.test(b.data) && "data"); return h || "jsonp" === b.dataTypes[0] ? (e = b.jsonpCallback = n.isFunction(b.jsonpCallback) ? b.jsonpCallback() : b.jsonpCallback, h ? b[h] = b[h].replace(Gb, "$1" + e) : b.jsonp !== !1 && (b.url += (db.test(b.url) ? "&" : "?") + b.jsonp + "=" + e), b.converters["script json"] = function () { return g || n.error(e + " was not called"), g[0] }, b.dataTypes[0] = "json", f = a[e], a[e] = function () { g = arguments }, d.always(function () { a[e] = f, b[e] && (b.jsonpCallback = c.jsonpCallback, Fb.push(e)), g && n.isFunction(f) && f(g[0]), g = f = void 0 }), "script") : void 0 }), n.parseHTML = function (a, b, c) { if (!a || "string" != typeof a) return null; "boolean" == typeof b && (c = b, b = !1), b = b || l; var d = v.exec(a), e = !c && []; return d ? [b.createElement(d[1])] : (d = n.buildFragment([a], b, e), e && e.length && n(e).remove(), n.merge([], d.childNodes)) }; var Hb = n.fn.load; n.fn.load = function (a, b, c) { if ("string" != typeof a && Hb) return Hb.apply(this, arguments); var d, e, f, g = this, h = a.indexOf(" "); return h >= 0 && (d = n.trim(a.slice(h)), a = a.slice(0, h)), n.isFunction(b) ? (c = b, b = void 0) : b && "object" == typeof b && (e = "POST"), g.length > 0 && n.ajax({ url: a, type: e, dataType: "html", data: b }).done(function (a) { f = arguments, g.html(d ? n("<div>").append(n.parseHTML(a)).find(d) : a) }).complete(c && function (a, b) { g.each(c, f || [a.responseText, b, a]) }), this }, n.each(["ajaxStart", "ajaxStop", "ajaxComplete", "ajaxError", "ajaxSuccess", "ajaxSend"], function (a, b) { n.fn[b] = function (a) { return this.on(b, a) } }), n.expr.filters.animated = function (a) { return n.grep(n.timers, function (b) { return a === b.elem }).length }; var Ib = a.document.documentElement; function Jb(a) { return n.isWindow(a) ? a : 9 === a.nodeType && a.defaultView } n.offset = { setOffset: function (a, b, c) { var d, e, f, g, h, i, j, k = n.css(a, "position"), l = n(a), m = {}; "static" === k && (a.style.position = "relative"), h = l.offset(), f = n.css(a, "top"), i = n.css(a, "left"), j = ("absolute" === k || "fixed" === k) && (f + i).indexOf("auto") > -1, j ? (d = l.position(), g = d.top, e = d.left) : (g = parseFloat(f) || 0, e = parseFloat(i) || 0), n.isFunction(b) && (b = b.call(a, c, h)), null != b.top && (m.top = b.top - h.top + g), null != b.left && (m.left = b.left - h.left + e), "using" in b ? b.using.call(a, m) : l.css(m) } }, n.fn.extend({ offset: function (a) { if (arguments.length) return void 0 === a ? this : this.each(function (b) { n.offset.setOffset(this, a, b) }); var b, c, d = this[0], e = { top: 0, left: 0 }, f = d && d.ownerDocument; if (f) return b = f.documentElement, n.contains(b, d) ? (typeof d.getBoundingClientRect !== U && (e = d.getBoundingClientRect()), c = Jb(f), { top: e.top + c.pageYOffset - b.clientTop, left: e.left + c.pageXOffset - b.clientLeft }) : e }, position: function () { if (this[0]) { var a, b, c = this[0], d = { top: 0, left: 0 }; return "fixed" === n.css(c, "position") ? b = c.getBoundingClientRect() : (a = this.offsetParent(), b = this.offset(), n.nodeName(a[0], "html") || (d = a.offset()), d.top += n.css(a[0], "borderTopWidth", !0), d.left += n.css(a[0], "borderLeftWidth", !0)), { top: b.top - d.top - n.css(c, "marginTop", !0), left: b.left - d.left - n.css(c, "marginLeft", !0) } } }, offsetParent: function () { return this.map(function () { var a = this.offsetParent || Ib; while (a && !n.nodeName(a, "html") && "static" === n.css(a, "position")) a = a.offsetParent; return a || Ib }) } }), n.each({ scrollLeft: "pageXOffset", scrollTop: "pageYOffset" }, function (b, c) { var d = "pageYOffset" === c; n.fn[b] = function (e) { return J(this, function (b, e, f) { var g = Jb(b); return void 0 === f ? g ? g[c] : b[e] : void (g ? g.scrollTo(d ? a.pageXOffset : f, d ? f : a.pageYOffset) : b[e] = f) }, b, e, arguments.length, null) } }), n.each(["top", "left"], function (a, b) { n.cssHooks[b] = ya(k.pixelPosition, function (a, c) { return c ? (c = xa(a, b), va.test(c) ? n(a).position()[b] + "px" : c) : void 0 }) }), n.each({ Height: "height", Width: "width" }, function (a, b) { n.each({ padding: "inner" + a, content: b, "": "outer" + a }, function (c, d) { n.fn[d] = function (d, e) { var f = arguments.length && (c || "boolean" != typeof d), g = c || (d === !0 || e === !0 ? "margin" : "border"); return J(this, function (b, c, d) { var e; return n.isWindow(b) ? b.document.documentElement["client" + a] : 9 === b.nodeType ? (e = b.documentElement, Math.max(b.body["scroll" + a], e["scroll" + a], b.body["offset" + a], e["offset" + a], e["client" + a])) : void 0 === d ? n.css(b, c, g) : n.style(b, c, d, g) }, b, f ? d : void 0, f, null) } }) }), n.fn.size = function () { return this.length }, n.fn.andSelf = n.fn.addBack, "function" == typeof define && define.amd && define("jquery", [], function () { return n }); var Kb = a.jQuery, Lb = a.$; return n.noConflict = function (b) { return a.$ === n && (a.$ = Lb), b && a.jQuery === n && (a.jQuery = Kb), n }, typeof b === U && (a.jQuery = a.$ = n), n
    });
    // Your code here...
    //定义时间收集器

    window.setTimeout(function (){
        let timerArr = [];

    //删除row 停止接单都需要消除的定时器
    function GetDateStr(AddDayCount) {
        var dd = new Date();
        //传递的天数必须时number数据类型
        dd.setDate(dd.getDate() + Number(AddDayCount));
        //获取AddDayCount天后的日期
        var y = dd.getFullYear();
        var m = (dd.getMonth() + 1) < 10 ? "0" + (dd.getMonth() + 1) : (dd.getMonth() + 1);
        //获取当前月份的日期，不足10补0
        var d = dd.getDate() < 10 ? "0" + dd.getDate() : dd.getDate();
        //获取当前几号，不足10补0
        return y + "-" + m + "-" + d;
    }

    document.head.getElementsByTagName("script")[5].nextElementSibling.innerHTML = `.nc-container .nc_scale span {
                height: 100% !important
            }

            #wkf_write {
                display: none;
            }

            #wkf_div {
                width: 1600px;
                overflow: hidden;
                margin: 50px auto;
                font-size: 13px;
                display: none;
                background-color: white;
            }

            #wkfnew_table1 {
                width: 100%;
                text-align: center;
            }

            #wkfnew_table2 {
                width: 100%;
                text-align: center;
                border: 1px solid #e9ecf3;
            }

            #wkfnew_table3 {
                width: 100%;
                text-align: center;
                font-weight: normal;
                border: 1px solid #e9ecf3;
            }

            #wkf_tbody {
                min-height: 0;
            }`

    var mydiv = document.getElementById("root").appendChild(document.createElement('div'))
    mydiv.id = "wkf_div"
    mydiv.innerHTML = `<table id="wkfnew_table1" border="1">
                <tbody>
                    <tr>
                        <th style="background-color: rgb(10, 169, 225); height: 40px; border: 1px solid rgb(10, 169, 225); text-align: center; color: rgb(255, 255, 255);">接单成功</th>
                    </tr>
                </tbody>
            </table>
            <table id="wkfnew_table2" border="1">
                <thead>
                    <tr style="height: 50px;">
                        <th style="width: 71px;">简称</th>
                        <th style="width: 71px;">时间</th>
                        <th style="width: 357px;">承兑人</th>
                        <th style="width: 80px;">金额(万元)</th>
                        <th style="width: 100px;">到期日</th>
                        <th style="width: 100px;">每十万扣利息</th>
                        <th style="width: 100px;">年息</th>
                        <th style="width: 150px;">票号</th>
                        <th style="width: 100px;">支付渠道</th>
                        <th style="width: 100px;">利差</th>
                        <th style="width: 100px;">瑕疵情况</th>
                        <th id="wkf_th" style="width: 14px;"></th>
                    </tr>
                </thead>
            </table>
            <div style="max-height: 400px; overflow-y: auto;color: #666;">
                <table id="wkfnew_table3" border="1">
                    <tbody id="wkf_tbody"></tbody>
                </table>
            </div>`
    var myscript = document.body.appendChild(document.createElement('script'))
    myscript.type = "text/tpl"
    myscript.id = "wkf_tpl"
    myscript.innerHTML = `<tr style="height: 50px;">
                <td style="width: 71px;">{{name}}</td>
                <td style="width: 71px;">{{dates}}</td>
                <td style="width: 357px;">{{manager}}</td>
                <td style="width: 80px;">{{money}}</td>
                <td style="width: 100px;">{{surplusDate}}</td>
                <td style="width: 100px;">{{housand}}</td>
                <td style="width: 100px;">{{yearRate}}</td>
                <td style="width: 150px;">{{draftMarkNo}}</td>
                <td style="width: 100px;">{{supportChannel}}</td>
                <td style="width: 100px;">{{gap}}</td>
                <td style="width: 100px;">{{flaw}}</td>
            </tr>`


    var root = document.getElementsByClassName("new-b2b-hall")[0];
    var div = document.createElement("div");
    div.setAttribute("id", "wkf_write")
    div.style.width = "100%";
    div.style.maxHeight = "840px";
    div.style.backgroundColor = "white";
    console.log(document.getElementsByClassName("company-promotion")[0])
    root.insertBefore(div, document.getElementsByClassName("company-promotion")[0])

    div.innerHTML = `<table id="wkf_table" border='1' style="margin: auto; color:white; border-color: #ebeef5;">
                    <tr bgcolor="#009ff0" align="center" style="height: 40px;">
                        <th width="100px">简称</th>
                        <th width="110px">时间(抢到数)</th>
                        <th width="130px">同城状态</th>
                        <th width="78px">最小金额</th>
                        <th width="78px">最大金额</th>
                        <th width="170px">银行类型</th>
                        <th width="209px">银行名单</th>
                        <th width="208px">屏蔽银行名称</th>
                        <th width="85px">日期之后</th>
                        <th width="85px">日期之前</th>
                        <th width="64px">年化</th>
                        <th width="70px">每十万加</th>
                        <th width="96px">瑕疵</th>
                        <th width="83px">刷新频率</th>
                        <th width="64px">整数</th>
                        <th width="64px">限金额</th>
                        <th width="64px">限笔数</th>
                        <th width="130px">操作</th>
                    </tr>
                <table>`;

    var divParent = document.getElementsByClassName('left')[6].parentNode
    //获取该div的父节点
    var addBtn = document.createElement('input');
    addBtn.type = 'button';
    addBtn.value = '添加到抢票';
    addBtn.className = 'operate-button order-ticket-button'
    addBtn.id = 'add'
    addBtn.style.marginLeft = "242px"
    addBtn.style.color = "white"
    addBtn.style.borderColor = "red"
    addBtn.style.background = "red"
    addBtn.style.borderRadius = "5px"
    var changeBtn = document.createElement('input');
    changeBtn.type = 'button';
    changeBtn.value = '切换到抢票页面';
    changeBtn.id = 'changeBtn'
    changeBtn.style.marginLeft = "10px"
    changeBtn.style.color = "white"
    changeBtn.style.borderColor = "#52c41a"
    changeBtn.style.background = "#52c41a"
    changeBtn.style.borderRadius = "5px"

    try {
        // 隐藏右侧悬浮部分
        document.getElementsByClassName("right-menu-content")[0].style.display = "none"
    } catch {
    }
    var next = document.getElementById('add')
    //获取按钮是否添加过
    if (next) {
        console.log('按钮已经添加成功')
    } else {
        //不存在则直接添加到最后,appendChild默认添加到divParent的最后

        divParent.appendChild(addBtn);
        divParent.appendChild(changeBtn);

        document.getElementsByClassName("filter-condition-area")[0].children[0].children[1].children[0].appendChild(document.createElement('lable')).innerHTML = "输入其他用户值:"
        var authValue = document.getElementsByClassName("filter-condition-area")[0].children[0].children[1].children[0].appendChild(document.createElement('input'))

        authValue.setAttribute("id", "authValue");
        document.getElementById('authValue').setAttribute("placeholder", "Bearer " + document.cookie.split('access_token=')[1].split(';')[0])
        authValue.style.color = "red"
        authValue.style.width = "340px"
        authValue.style.fontWeight = "bold"
        authValue.style.marginRight = "5px"
        authValue.style.border = '1px solid red'
        authValue.style.borderRadius = '5px'
        document.getElementById('authValue').value = localStorage.getItem('authValue')

        var addAuthValueBtn = document.getElementsByClassName("filter-condition-area")[0].children[0].children[1].children[0].appendChild(document.createElement('input'))

        addAuthValueBtn.type = 'button';
        addAuthValueBtn.value = '添加用户值';
        addAuthValueBtn.className = 'operate-button order-ticket-button'
        addAuthValueBtn.id = 'addAuthValueBtn'
        addAuthValueBtn.style.color = "white"
        addAuthValueBtn.style.borderColor = "red"
        addAuthValueBtn.style.background = "red"
        addAuthValueBtn.style.borderRadius = "5px"

        document.getElementsByClassName('multiple-filter')[0].appendChild(document.createElement('div')).innerHTML = '限制数量:'
        var num = document.getElementsByClassName('multiple-filter')[0].lastElementChild.appendChild(document.createElement('input'))
        num.id = 'num'
        num.value = 2
        document.getElementById('num').setAttribute("placeholder", 2)
        num.style.color = "red"
        num.style.width = "50px"
        num.style.fontWeight = "bold"
        num.style.marginRight = "5px"
        num.style.textAlign = "center"
        num.style.border = '1px solid red'
        num.style.borderRadius = '5px'

        document.getElementsByClassName('multiple-filter')[0].appendChild(document.createElement('div')).innerHTML = '限制金额:'
        var amount = document.getElementsByClassName('multiple-filter')[0].lastElementChild.appendChild(document.createElement('input'))
        amount.id = 'amount'

        document.getElementById('amount').setAttribute("placeholder", 500)
        amount.value = 500
        amount.style.color = "red"
        amount.style.width = "50px"
        amount.style.fontWeight = "bold"
        amount.style.marginRight = "5px"
        amount.style.textAlrign = "center"
        amount.style.border = '1px solid red'
        amount.style.borderRadius = '5px'

        document.getElementsByClassName('multiple-filter')[0].appendChild(document.createElement('div')).innerHTML = '最小刷新频率:'
        var refreshRateStart = document.getElementsByClassName('multiple-filter')[0].lastElementChild.appendChild(document.createElement('input'))
        refreshRateStart.id = 'refreshRateStart'

        document.getElementById('refreshRateStart').setAttribute("placeholder", 1)
        refreshRateStart.value = 1
        refreshRateStart.style.color = "red"
        refreshRateStart.style.width = "50px"
        refreshRateStart.style.fontWeight = "bold"
        refreshRateStart.style.border = '1px solid red'
        refreshRateStart.style.marginRight = "5px"
        refreshRateStart.style.borderRadius = '5px'
        refreshRateStart.style.textAlign = "center"

        document.getElementsByClassName('multiple-filter')[0].appendChild(document.createElement('div')).innerHTML = '最大刷新频率:'
        var refreshRateEnd = document.getElementsByClassName('multiple-filter')[0].lastElementChild.appendChild(document.createElement('input'))
        refreshRateEnd.id = 'refreshRateEnd'
        document.getElementById('refreshRateEnd').setAttribute("placeholder", 5)
        refreshRateEnd.value = 5
        refreshRateEnd.style.color = "red"
        refreshRateEnd.style.width = "50px"
        refreshRateEnd.style.fontWeight = "bold"
        refreshRateEnd.style.border = '1px solid red'
        refreshRateEnd.style.borderRadius = '5px'
        refreshRateEnd.style.textAlign = "center"

        setInterval(() => {
            /****wkf接单成功STRATS****/
            let wkf_div = document.getElementById("wkf_div");
            //获取元素
            let company = document.getElementsByClassName("company-promotion")[0];
            //插入company-promotion类名之前
            document.getElementsByClassName("new-b2b-hall")[0].insertBefore(wkf_div, company);
            //获取表格元素
            let wkf_tbody = document.getElementById("wkf_tbody");
            //获取模板元素
            let tpl = document.getElementById("wkf_tpl")
            //获取模板内容
            let tplHtml = document.getElementById("wkf_tpl").innerHTML;
            //存储模板内容
            let tpl_result = "";
            //tbody的子节点数量
            let trsLength = "";
            //定义数组存储后台返回的数据
            let successList = [];
            //获取接单完成数据
            let wkf_xhr = new XMLHttpRequest();
            wkf_xhr.open("GET", "https://dianpiaoku.cn:9902/cdk/orderp/getOrderp");
            wkf_xhr.send();
            wkf_xhr.onreadystatechange = function () {
                if (wkf_xhr.readyState == 4 && wkf_xhr.status == 200) {
                    var res = JSON.parse(wkf_xhr.responseText);
                    //获取到json字符串，解析

                    try {
                        successList = res.obj.orderpList
                        //正则匹配函数
                        function templateReplace(template, newArr) {
                            for (var i = newArr.length - 1; i >= 0; i--) {
                                tpl_result += template.replace(/{{([a-zA-Z]+)}}/g, function (match, $1) {
                                    return newArr[i][$1]
                                })
                            }

                        }
                        if (successList.length == 0 && Array.isArray(successList)) {
                            document.getElementById("wkf_tbody").innerHTML = `
                                <tr style="height: 50px;">
                                    <td style="width: 100%;">没有接单成功的数据!!!!!!!!!!</td>
                                </tr>
                                `
                            //如果tr存在的高度小于400px
                            document.getElementById("wkf_th").style.width = "0.1px"

                        } else {
                            templateReplace(tplHtml, successList)
                            wkf_tbody.innerHTML = tpl_result;
                            trsLength = successList.length;
                            if (trsLength > 8) {
                                //如果tr存在的高度大于400px,就显示最后一个th
                                document.getElementById("wkf_th").style.width = "14px";
                            } else {
                                //如果tr存在的高度小于400px
                                document.getElementById("wkf_th").style.width = "0.1px"
                            }

                        }

                    } catch (error) {
                        alert("请联系开发人员:" + error)
                    }
                }
            }
        }
            , 10000);


        document.getElementById("addAuthValueBtn").onclick = function () {
            if (document.getElementById("authValue").value == "") {
                document.getElementById("authValue").value = "Bearer " + document.cookie.split('access_token=')[1].split(';')[0]
                localStorage.setItem('authValue', "Bearer " + document.cookie.split('access_token=')[1].split(';')[0])
            } else {

                var authBtnV = document.getElementById("authValue").value
                var CheckRequest = new XMLHttpRequest();
                //第一步：创建需要的对象
                CheckRequest.open('POST', 'https://www.tcpjw.com/order-web/setCommuterTime/getUserColsingTimeMillisecond', true);
                //第二步：打开连接/***发送json格式文件必须设置请求头 ；如下 - */
                CheckRequest.setRequestHeader("Content-type", "application/json");
                //设置请求头 注：post方式必须设置请求头（在建立连接后设置请求头）var obj = { name: 'zhansgan', age: 18 };
                CheckRequest.setRequestHeader("Authorization", authBtnV);
                CheckRequest.setRequestHeader("OriginV", "3.92");
                CheckRequest.send(JSON.stringify({
                    "version": "3.5",
                    "source": "HTML",
                    "channel": "01"
                }));

                CheckRequest.onreadystatechange = function () {

                    if (CheckRequest.readyState != 4 && CheckRequest.status != 200) {

                        alert('输入用户值不正确')
                        return

                    } else {

                        localStorage.setItem('authValue', authBtnV)
                        document.getElementById("authValue").value = authBtnV
                        alert('输入用户值添加成功')
                        return

                    }

                }
            }
        }

        // 添加
        document.getElementById("add").onclick = function () {
            var bidText = ''
            //
            var bid = document.getElementsByClassName('custom-style-checkbox ant-checkbox-wrapper ant-checkbox-wrapper-checked')
            //获取承兑人类型
            var inputValue = document.getElementsByClassName('ant-input ant-input-sm')
            // 获取页面所有input的值
            var buttonValue = document.getElementsByClassName('ant-radio-button ant-radio-button-checked')
            // 获取点击按钮值
            var priceBtnValue = buttonValue[4].getElementsByClassName('ant-radio-button-input')[0].value
            //金额按钮值
            var DateBtnValue = document.getElementsByClassName("filter-condition-area")[0].children[4].children[1].getElementsByClassName("ant-radio-group ant-radio-group-solid ant-radio-group-small")[0].getElementsByClassName("button-margin ant-radio-button-wrapper ant-radio-button-wrapper-checked")[0].getElementsByClassName("ant-radio-button ant-radio-button-checked")[0].children[0].value
            // 开始日期按钮值
            var flawStatusBtnValue = buttonValue[6].getElementsByClassName('ant-radio-button-input')[0].value
            // 瑕疵按钮值
            var bankName = document.getElementsByClassName("filter-condition-area")[0].children[2].children[1].children[2].value
            // 搜索承兑人名称
            var blackBankName = document.getElementsByClassName("filter-condition-area")[0].children[2].children[1].children[3].value
            // 屏蔽承兑人名称
            var priceSp = inputValue[2].value
            // 最小金额
            var priceEp = inputValue[3].value
            // 最大金额
            var startDate = inputValue[4].value
            // 开始日期
            var endDate = inputValue[5].value
            //  结束日期
            var yearQuote = inputValue[7].value
            // 年化
            var msw = inputValue[8].value
            // 每10万扣息
            var amount = document.getElementById('amount').value
            var num = document.getElementById('num').value
            let refreshStart = document.getElementById('refreshRateStart').value;
            let refreshEnd = document.getElementById('refreshRateEnd').value;

            if (bid.length === 0) {
                console.log('没有选择承兑人类型')
            } else {
                for (var i = 0; i < bid.length; i++) {
                    var bidInnerText = bid[i].innerText
                    bidText = bidText + ' ' + bidInnerText
                }
                ;

            }
            if (bidText.length === 0 && bankName === "") {
                alert('承兑人类型和搜素承兑人名称不能同时为空')
                return
            }

            if (priceBtnValue === '' && priceSp === '' && priceEp === '') {
                alert('最小金额和最大金额和票面金额按钮不能同时为空')
                return
            } else {
                if (priceSp === '' && priceEp === '') {
                    if (priceBtnValue === "1") {
                        priceSp = ''
                        priceEp = 9.9999

                    } else if (priceBtnValue === "2") {
                        priceSp = 10
                        priceEp = 49.9999

                    } else if (priceBtnValue === "3") {
                        priceSp = 50
                        priceEp = 99.9999

                    } else {
                        priceSp = 100
                        priceEp = ''
                    }

                } else {
                    if (priceSp === undefined) {
                        priceSp = ""
                    }
                    if (priceEp === undefined) {
                        priceEp = ""
                    }
                    priceSp = priceSp
                    priceEp = priceEp

                }

            }

            if (DateBtnValue === '' && startDate === '' && endDate === '') {
                alert('开始日期和结束日期和票据期限按钮不能同时为空')
                return
            } else {
                if (startDate === '' && endDate === '') {
                    if (DateBtnValue === "1") {
                        startDate = ''
                        endDate = GetDateStr(90)

                    } else if (DateBtnValue === "2") {
                        startDate = GetDateStr(91)
                        endDate = GetDateStr(129)

                    } else if (DateBtnValue === "3") {
                        startDate = GetDateStr(130)
                        endDate = GetDateStr(187)

                    } else if (DateBtnValue === "4") {
                        startDate = GetDateStr(188)
                        endDate = GetDateStr(330)

                    } else {
                        startDate = GetDateStr(331)
                        endDate = ''
                    }

                } else {

                    if (startDate === undefined) {
                        startDate = ""
                    }
                    if (endDate === undefined) {
                        endDate = ""
                    }
                    startDate = startDate
                    endDate = endDate
                }
            }
            if (yearQuote === '' && msw === '') {
                alert('年化和每10万扣息不能同时为空')
                return
            } else {
                if (yearQuote === undefined) {
                    yearQuote = ''
                }
                if (msw === undefined) {
                    msw = ''
                }
            }
            if (num === "" || amount === "") {
                alert('限制金额或者限制数量不能同时为空')
                return

            }
            if (flawStatusBtnValue === "0") {
                flawStatusBtnValue = '无瑕疵'
            } else if (flawStatusBtnValue === "46") {
                flawStatusBtnValue = '回出票人'
            } else if (flawStatusBtnValue === "47") {
                flawStatusBtnValue = '回收款人'
            } else if (flawStatusBtnValue === "48") {
                flawStatusBtnValue = '背书回头'
            } else if (flawStatusBtnValue === "2") {
                flawStatusBtnValue = '重复'
            } else if (flawStatusBtnValue === "3") {
                flawStatusBtnValue = '质押'
            } else if (flawStatusBtnValue === "4") {
                flawStatusBtnValue = '保证'
            } else if (flawStatusBtnValue === "5") {
                flawStatusBtnValue = '不一致'
            } else if (flawStatusBtnValue === "6") {
                flawStatusBtnValue = '其他'
            }
            else {
                flawStatusBtnValue = "全部"
            }
            // 获取添加偏好数量

            var shadowLength = document.getElementsByClassName("new-item-area")[0].children.length
            if (new RegExp(/^[0-9]*$/).test(amount) === false || amount === undefined) {
                alert("限制金额应为数字")
                return
            }
            if (new RegExp(/^[0-9]*$/).test(num) === false || num === undefined) {
                alert("限制数量应为数字")
                return
            }
            if (new RegExp(/^[0-9]*$/).test(refreshStart) === false || refreshStart === undefined) {
                alert("开始刷新频率应为数字")
                return
            }

            if (new RegExp(/^[0-9]*$/).test(refreshEnd) === false || refreshEnd === undefined) {
                alert("结束刷新频率应为数字")
                return
            }
            if (shadowLength < 20 || shadowLength === undefined) {
                // console.log("开始render")
                document.getElementsByClassName("tr chosen-filters")[0].children[1].lastChild.click()
                // 添加为搜索偏好按钮
                // 为  点击搜索偏好按钮弹出后的 确认按钮  添加点击事件
                document.getElementsByClassName("ant-modal-content")[0].lastChild.lastChild.lastChild.onclick = function () {
                    var name = document.getElementsByClassName("ant-modal-content")[0].children[2].lastChild.lastChild.value
                    // 简称名称

                    if (name !== "" && name.length <= 10) {
                        for (var j = 0; j < shadowLength; j++) {
                            j
                            // console.log(name, document.getElementById("new-item-area-shadow").children[0].innerHTML)
                            var nameInnerHtml = document.getElementsByClassName("new-item-area")[0].children[j].innerHTML

                        }
                        if (name === nameInnerHtml) {
                            alert("简称重复啦")
                            return
                        }

                    }

                    let tr = document.createElement("tr");
                    // background-color: #52c41a;

                    tr.style.color = '#333';
                    tr.innerHTML = `
                                    <td width="100px"><input  min="0" type="text"  value="${name}" style="width: 98px; text-align: center;  border: 1px solid white;" readonly></td>
                                    <td width="110px"><input  id =${name} min="0" type="text"  value="" style="width: 110px; text-align: center; border: 1px solid white;" readonly></td>
                                    <td width="130px" style="display: flex;justify-content:space-around;padding: 5px;"" >
                                        <button onClick="wkf_start(event)" style="cursor:pointer;width: 60px;height: 27px;border: 1px solid #52c41a;line-height: 24px;background-color: #52c41a;color: white; border-radius: 5px;font-size: 13px;margin-right: 5px;">开始</button>
                                        <button onClick="own_stop(event)"  style="cursor:pointer;width: 60px;height: 27px;border: 1px solid #009ff1;line-height: 24px;color: #ff0f37; background-color: white;border-color: #ff0f37;border-radius: 5px;font-size: 13px;">停止</button></td>
                                    <td width="78px"><input  min="0" type="text"  value="${priceSp}" style="width: 78px;text-align: center;  border: 1px solid white;" readonly></td>
                                    <td width="78px"><input  min="0" type="text"  value="${priceEp}" style="width: 78px; text-align: center; border: 1px solid white;" readonly></td>
                                    <td width="170px"><input  min="0" type="text"  value="${bidText}" style="width: 170px;overflow: hidden;text-overflow:ellipsis;white-space: nowrap;text-align: center; border: 1px solid white;" readonly></td>
                                    <td width="209px"><input  min="0" type="text"  value="${bankName}" style="width: 209px;overflow: hidden;text-overflow:ellipsis;white-space: nowrap;text-align: center; border: 1px solid white;" readonly></td>
                                    <td width="208px"><input  min="0" type="text"  value="${blackBankName}" style="width: 208px;overflow: hidden;text-overflow:ellipsis;white-space: nowrap;text-align: center;  border: 1px solid white;" readonly></td>
                                    <td width="85px"><input  min="0" type="text"  value="${startDate}" style="width: 85px;text-align: center; border: 1px solid white;" readonly></td>
                                    <td width="85px"><input  min="0" type="text"  value="${endDate}" style="width: 85px;text-align: center;  border: 1px solid white;" readonly></td>
                                    <td width="64px"><input  min="0" type="text"  value="${yearQuote}" style="width: 64px; text-align: center; font-weight: bold;  border: 1px solid white;" readonly></td>
                                    <td width="70px"><input  min="0" type="text"  value="${msw}" style="width: 70px; text-align: center; font-weight: bold; border: 1px solid white;" readonly></td>
                                    <td width="96px"><input  min="0" type="text"  value="${flawStatusBtnValue}" style="width: 96px;text-align: center;  border: 1px solid white;" readonly></td>
                                    <td width="83px"><input  min="0" type="text"  value="${refreshStart}~${refreshEnd}" style="width: 83px;text-align: center;  border: 1px solid white;" readonly></td>
                                    <td width="64px"><input  min="0" type="text"  value="${bidText}" style="width: 64px;text-align: center;  border: 1px solid white;" readonly></td>
                                    <td width="64px"><input  min="0" type="text"  value="${amount}" style="width: 64px;text-align: center;  border: 1px solid white;" readonly></td>
                                    <td width="64px"><input  min="0" type="text"  value="${num}" style="width: 64px;text-align: center;  border: 1px solid white;" readonly></td>
                                    <td width="130px" style="display: flex;justify-content:space-around;padding: 5px;">
                                        <button  onClick="own_del(event)" style="cursor:pointer;width: 60px;height: 27px;line-height: 24px;border: 1px solid #009ff1;color: #ff0f37; background-color: white;border-color: #ff0f37;border-radius: 5px;font-size: 13px;">删除</button>
                                        <button   class ="edit" style="cursor:pointer;width: 60px;height: 27px;border: 1px solid #009ff1;line-height: 24px;color: #009ff1; background-color: white;border-radius: 5px;font-size: 13px;margin-left: 5px;">编辑</button>
                                    </td>
                                    `;
                    // 存储 限制金额 限制数量 刷新频率
                    localStorage.setItem(name + "qwertyuiop", JSON.stringify({
                        "n": num,
                        "a": amount,
                        'rS': refreshStart,
                        "rE": refreshEnd
                    }))

                }

            }
            else {
                alert("已达到20个上限,不能在添加")
                return

            }

        }

    }
    ;
    // 切换按钮
    document.getElementById("changeBtn").onclick = function () {

        if (document.getElementsByClassName('data-table')[0].style.display == "" || document.getElementsByClassName('data-table')[0].style.display == "block") {
            //干掉广告
            try {
                document.querySelector(".AdvertisingLeft").style.display = "none"
            } catch (err) {
                console.log(`广告关闭失败:${err}`)
            }
            document.getElementsByClassName('data-table')[0].style.display = "none"
            //自己定义的table需要显示
            document.getElementById("wkf_write").style.display = "block"
            document.getElementById("wkf_div").style.display = "block";

            let trs = document.getElementById("wkf_table").getElementsByTagName("tr");


            $.ajax({
                type: "POST",
                url: "https://www.tcpjw.com/order-web/orderInfo/setTcPreferencedRecord",
                headers: {
                    "Content-type": 'application/json',
                    "Authorization": "Bearer " + document.cookie.split('access_token=')[1].split(';')[0],
                    'OriginV': '3.92'
                },
                dataType: "json",
                data: JSON.stringify({
                    "version": "3.5",
                    "source": "HTML",
                    "channel": "01",
                    "setPreferencesType": 4
                }),
                success: function (data) {


                     let testdiv = document.createElement("div");

                     var JSONdata =data
                     if (JSONdata.code === "0") {
                         var tcPreferencedRecordRespBaseVos = JSONdata.data.tcPreferencedRecordRespBaseVos


                         for (var j = 0; j < tcPreferencedRecordRespBaseVos.length; j++) {
                             // console.log(j,'这个是j')
                             var tagName = tcPreferencedRecordRespBaseVos[j].tagName
                             // 简称
                             var bid = tcPreferencedRecordRespBaseVos[j].tcPreferencedRecordBaseVO.bid
                             // 承兑人类型
                             var keyWords = tcPreferencedRecordRespBaseVos[j].tcPreferencedRecordBaseVO.keyWords
                             // 搜索承兑人名称
                             var blackKeyWords = tcPreferencedRecordRespBaseVos[j].tcPreferencedRecordBaseVO.blackKeyWords
                             // 屏蔽承兑人名称
                             var minPrice = tcPreferencedRecordRespBaseVos[j].tcPreferencedRecordBaseVO.minPrice
                             // 最小金额
                             var maxPrice = tcPreferencedRecordRespBaseVos[j].tcPreferencedRecordBaseVO.maxPrice
                             // 最大金额
                             var priceType = tcPreferencedRecordRespBaseVos[j].tcPreferencedRecordBaseVO.priceType
                             // 票面金额按钮值
                             var remainingDays = tcPreferencedRecordRespBaseVos[j].tcPreferencedRecordBaseVO.remainingDays
                             // 票据期限按钮值
                             var flawStatus = tcPreferencedRecordRespBaseVos[j].tcPreferencedRecordBaseVO.flawStatus
                             var maxRDate = tcPreferencedRecordRespBaseVos[j].tcPreferencedRecordBaseVO.maxRDate
                             // 最大日期
                             var minRDate = tcPreferencedRecordRespBaseVos[j].tcPreferencedRecordBaseVO.minRDate
                             // 最小日期
                             var maxRDays = tcPreferencedRecordRespBaseVos[j].tcPreferencedRecordBaseVO.maxRDays
                             // 最大天数
                             var minRDays = tcPreferencedRecordRespBaseVos[j].tcPreferencedRecordBaseVO.minRDays
                             // 最小天数
                             var msw = tcPreferencedRecordRespBaseVos[j].tcPreferencedRecordBaseVO.msw
                             // 每10万加
                             var yearQuote = tcPreferencedRecordRespBaseVos[j].tcPreferencedRecordBaseVO.yearQuote
                             // 年化

                             if (yearQuote === undefined) {
                                 yearQuote = ""
                             }
                             if (msw === undefined) {
                                 msw = ""
                             }
                             if (keyWords === undefined) {
                                 keyWords = ""
                             }
                             if (blackKeyWords === undefined) {
                                 blackKeyWords = ""
                             }
                             if (priceType === undefined) {
                                 priceType = ""
                             }
                             if (remainingDays === undefined) {
                                 remainingDays = ""
                             }
                             if (flawStatus === undefined) {
                                 flawStatus = ""
                             }

                             var bidName = ""
                             for (var x = 0; x < bid.length; x++) {
                                 if (bid[x] == "1") {
                                     bidName = bidName + " " + "国股"
                                 } else if (bid[x] == "9") {
                                     bidName = bidName + " " + "大商"
                                 } else if (bid[x] == "2") {
                                     bidName = bidName + " " + "城商"
                                 } else if (bid[x] == "3") {
                                     bidName = bidName + " " + "三农"
                                 } else if (bid[x] == "6") {
                                     bidName = bidName + " " + "村镇"
                                 } else if (bid[x] == "7") {
                                     bidName = bidName + " " + "外资"
                                 } else if (bid[x] == "10") {
                                     bidName = bidName + " " + "民营"
                                 } else if (bid[x] == "4") {
                                     bidName = bidName + " " + "财票"
                                 } else {
                                     bidName = bidName + " " + "商票"
                                 }

                             }
                             if (priceType == 1) {
                                 minPrice = ""
                                 maxPrice = 9.9999
                             } else if (priceType == 2) {
                                 minPrice = 10
                                 maxPrice = 49.9999

                             } else if (priceType == 3) {
                                 minPrice = 50
                                 maxPrice = 99.9999

                             } else if (priceType == 4) {
                                 minPrice = 100
                                 maxPrice = ""
                             } else {
                                 if (minPrice === undefined) {
                                     minPrice = ""
                                 }
                                 if (maxPrice === undefined) {
                                     maxPrice = ""
                                 }
                                 minPrice = minPrice
                                 maxPrice = maxPrice
                             }

                             if (remainingDays !== undefined) {
                                 // 判断 minRDate maxRDate  maxRDays  minRDays  是否存在
                                 if (minRDate !== "" && minRDate !== undefined || maxRDate !== "" && maxRDate !== undefined || maxRDays !== "" && maxRDays !== undefined || minRDays !== "" && minRDays !== undefined) {
                                     if (minRDate !== "" && minRDate !== undefined || maxRDate !== "" && maxRDate !== undefined) {
                                         minRDate = minRDate
                                         maxRDate = maxRDate

                                     } else {
                                         minRDate = minRDays
                                         maxRDate = maxRDays
                                     }

                                 } else {
                                     if (remainingDays == 1) {

                                         minRDate = ""
                                         maxRDate = 90

                                     } else if (remainingDays == 2) {
                                         minRDate = 91
                                         maxRDate = 129

                                     } else if (remainingDays == 3) {
                                         minRDate = 130
                                         maxRDate = 187

                                     } else if (remainingDays == 4) {
                                         minRDate = 188
                                         maxRDate = 330

                                     } else {
                                         minRDate = 331
                                         maxRDate = ""
                                     }

                                 }

                             } else {
                                 if (minRDate !== "" && minRDate !== undefined || maxRDate !== "" && maxRDate !== undefined) {
                                     minRDate = minRDate
                                     maxRDate = maxRDate

                                 } else {
                                     minRDate = minRDays
                                     maxRDate = maxRDays
                                 }

                             }

                             if (flawStatus === 0) {
                                 flawStatus = '无瑕疵'

                             } else if (flawStatus === 46) {
                                 flawStatus = '回出票人'
                             } else if (flawStatus === 47) {
                                 flawStatus = '回收款人'
                             } else if (flawStatus === 48) {
                                 flawStatus = '背书回头'
                             } else if (flawStatus === 2) {
                                 flawStatus = '重复'
                             } else if (flawStatus === 3) {
                                 flawStatus = '质押'
                             } else if (flawStatus === 4) {
                                 flawStatus = '保证'
                             } else if (flawStatus === 5) {
                                 flawStatus = '不一致'
                             } else if (flawStatus === 6) {
                                 flawStatus = '其他'
                             } else {
                                 flawStatus = '无瑕疵'
                             }
                             // 判断是否 存在 local
                             if (localStorage.getItem(tagName + "qwertyuiop") === null) {
                                 var amount = document.getElementById('amount').value
                                 var num = document.getElementById('num').value
                                 let refreshStart = document.getElementById('refreshRateStart').value;
                                 let refreshEnd = document.getElementById('refreshRateEnd').value;
                                 if (refreshStart === undefined || refreshStart === "") {
                                     refreshStart = 1
                                 }
                                 if (refreshEnd === undefined || refreshEnd === "") {
                                     refreshEnd = 5
                                 }
                             } else {

                                 amount = JSON.parse(localStorage.getItem(tagName + "qwertyuiop")).a
                                 num = JSON.parse(localStorage.getItem(tagName + "qwertyuiop")).n
                                 var refreshStart = JSON.parse(localStorage.getItem(tagName + "qwertyuiop")).rS
                                 var refreshEnd = JSON.parse(localStorage.getItem(tagName + "qwertyuiop")).rE
                                 if (refreshStart === undefined || refreshStart === "") {
                                     refreshStart = 1
                                 }
                                 if (refreshEnd === undefined || refreshEnd === "") {
                                     refreshEnd = 5
                                 }

                             }

                             //添加一行信息
                             let tr = document.createElement("tr");
                             document.getElementById("wkf_table").appendChild(tr)
                             tr.style.color = "#333";
                             tr.style.textAlign = 'center';
                             // 判断显示开头为抢的
                             if (tagName.substr(0, 1) == "抢") {
                                 // 如果为空说明 没有添加过
                                 if (document.getElementById(tagName) === null) {
                                     if (refreshStart === undefined || refreshStart === "") {
                                         refreshStart = 1
                                     }
                                     if (refreshEnd === undefined || refreshEnd === "") {
                                         refreshEnd = 5
                                     }
                                     if (minRDate === undefined) {
                                         minRDate = ""
                                     }
                                     if (maxRDate === undefined) {
                                         maxRDate = ""
                                     }

                                     tr.innerHTML = `
                                 <td width="100px" ><input class ="tagTextName" min="0" type="text"  value="${tagName}" style="width: 98px; text-align: center; border: 1px solid white;" readonly></td>
                                 <td width="110px"><input  id = "${tagName}" min="0" type="text"  value="" style="width: 110px; text-align: center; border: 1px solid white;" readonly></td>
                                 <td width="130px" style="display: flex;justify-content:space-around;padding: 5px;"" >
                                     <button class ="start" style="cursor:pointer;width: 60px;height: 27px;border: 1px solid #52c41a;line-height: 24px;background-color: #52c41a;color: white;border-radius: 5px;font-size: 13px;margin-right: 5px;">开始</button>
                                     <button class="stop"  style="cursor:pointer;width: 60px;height: 27px;border: 1px solid #009ff1;line-height: 24px;background-color: red;color: white;border-color: #ff0f37;border-radius: 5px;font-size: 13px;">停止</button></td>
                                 <td width="78px"><input  min="0" type="text"  value="${minPrice}" style="width: 78px; text-align: center; border: 1px solid white;" readonly></td>
                                 <td width="78px"><input  min="0" type="text"  value="${maxPrice}" style="width: 78px; text-align: center; border: 1px solid white;" readonly></td>
                                 <td width="170px"><input  min="0" type="text"  value="${bidName}" style="width: 170px;overflow: hidden;text-overflow:ellipsis;white-space: nowrap; text-align: center; border: 1px solid white;" readonly></td>
                                 <td width="209px"><input  min="0" type="text"  value="${keyWords}" style="width: 209px;overflow: hidden;text-overflow:ellipsis;white-space: nowrap;text-align: center; border: 1px solid white;" readonly></td>
                                 <td width="208px"><input  min="0" type="text"  value="${blackKeyWords}" style="width: 208px;overflow: hidden;text-overflow:ellipsis;white-space: nowrap; text-align: center; border: 1px solid white;" readonly></td>
                                 <td width="85px"><input  min="0" type="text"  value="${minRDate}" style="width: 85px;text-align: center; border: 1px solid white;" readonly></td>
                                 <td width="85px"><input  min="0" type="text"  value="${maxRDate}" style="width: 85px;text-align: center;  border: 1px solid white;" readonly></td>
                                 <td width="64px"><input  min="0" type="text"  value="${yearQuote}" style="width: 64px; text-align: center; font-weight: bold; border: 1px solid white;" readonly></td>
                                 <td width="70px"><input  min="0" type="text"  value="${msw}" style="width: 70px; text-align: center; font-weight: bold; border: 1px solid white;" readonly></td>
                                 <td width="96px"><input  min="0" type="text"  value="${flawStatus}" style="width: 96px;text-align: center;  border: 1px solid white;" readonly></td>
                                 <td width="83px"><input  min="0" type="text"  value="${refreshStart}~${refreshEnd}" style="width: 83px;text-align: center;  border: 1px solid white;" readonly></td>
                                 <td width="64px"><input  min="0" type="text"  value="${2}" style="width: 64px; text-align: center; border: 1px solid white;" readonly></td>
                                 <td width="64px"><input  min="0" type="text"  value="${amount}" style="width: 64px; text-align: center; border: 1px solid white;" readonly></td>
                                 <td width="64px"><input  min="0" type="text"  value="${num}" style="width: 64px; text-align: center; border: 1px solid white;" readonly></td>
                                 <td width="130px" style="display: flex;justify-content:space-around;padding: 5px;">
                                 <button  class ="del" style="cursor:pointer;width: 60px;height: 27px;line-height: 24px;border: 1px solid #009ff1;color: #ff0f37; background-color: white;border-color: #ff0f37;border-radius: 5px;font-size: 13px;">删除</button>
                                 <button class ="edit" style="cursor:pointer;width: 60px;height: 27px;border: 1px solid #009ff1;line-height: 24px;color: #009ff1; background-color: white;border-radius: 5px;font-size: 13px;margin-left: 5px;">编辑</button>
                                 </td>`;

                                     localStorage.setItem(tagName + "qwertyuiop", JSON.stringify({
                                         "n": num,
                                         "a": amount,
                                         'rS': refreshStart,
                                         "rE": refreshEnd
                                     }))
                                 } else {
                                     if (refreshStart === undefined || refreshStart === "") {
                                         refreshStart = 1
                                     }
                                     if (refreshEnd === undefined || refreshEnd === "") {
                                         refreshEnd = 5
                                     }
                                     if (minRDate === undefined) {
                                         minRDate = ""
                                     }
                                     if (maxRDate === undefined) {
                                         maxRDate = ""
                                     }
                                     document.getElementById(tagName).parentNode.parentNode.children[3].children[0].value = minPrice
                                     document.getElementById(tagName).parentNode.parentNode.children[4].children[0].value = maxPrice
                                     document.getElementById(tagName).parentNode.parentNode.children[5].children[0].value = bidName
                                     document.getElementById(tagName).parentNode.parentNode.children[6].children[0].value = keyWords
                                     document.getElementById(tagName).parentNode.parentNode.children[7].children[0].value = blackKeyWords
                                     document.getElementById(tagName).parentNode.parentNode.children[8].children[0].value = minRDate
                                     document.getElementById(tagName).parentNode.parentNode.children[9].children[0].value = maxRDate
                                     document.getElementById(tagName).parentNode.parentNode.children[10].children[0].value = yearQuote
                                     document.getElementById(tagName).parentNode.parentNode.children[11].children[0].value = msw
                                     document.getElementById(tagName).parentNode.parentNode.children[12].children[0].value = flawStatus
                                     document.getElementById(tagName).parentNode.parentNode.children[15].children[0].value = amount
                                     document.getElementById(tagName).parentNode.parentNode.children[16].children[0].value = num

                                 }






                             }

                         }
                        $('.edit').click(function () {
                            var tdList = this.parentNode.parentNode.children
                            console.log(event.path)
                            let priceSp = tdList[3].children[0].value
                            let priceEp = tdList[4].children[0].value
                            let bid = tdList[5].children[0].value
                            let bankName = tdList[6].children[0].value
                            let blackBankName = tdList[7].children[0].value
                            let startDate = tdList[8].children[0].value
                            let endDate = tdList[9].children[0].value
                            let yearQuote = tdList[10].children[0].value
                            let msw = tdList[11].children[0].value
                            let flawStatus = tdList[12].children[0].value
                            let amount = tdList[15].children[0].value
                            let num = tdList[16].children[0].value
                            let ReValue = tdList[13].children[0].value
                            // 用于防止多次点击编辑按钮出错
                            let name = tdList[0].children[0].value
                            // 简称用于删除编辑
                            // 点击偏好处理
                            document.getElementsByClassName("ant-btn ant-btn-primary ant-btn-sm ant-btn-background-ghost")[1].click()
                            //延时获取
                            window.setTimeout(function () {

                                for (var i = 0; i < document.getElementsByClassName("sortable-item-customer").length; i++) {
                                    tagName = document.getElementsByClassName("sortable-item-customer")[i].firstChild.innerText
                                    // 简称

                                    if (name === tagName) {
                                        // 点击编辑小图标
                                        document.getElementsByClassName("sortable-item-customer")[i].children[1].firstChild.click()
                                        window.setTimeout(function () {
                                            if (document.getElementById('addstartRe') == null) {
                                                document.getElementsByClassName("preference-modal-content")[0].children[3].appendChild(document.createElement('div')).innerHTML = '&nbsp限制数量:'
                                                var addNumInput = document.getElementsByClassName("preference-modal-content")[0].children[3].lastElementChild.appendChild(document.createElement('input'))
                                                addNumInput.id = 'addNumInpu'
                                                addNumInput.value = num
                                                addNumInput.style.color = "red"
                                                addNumInput.style.width = "50px"
                                                addNumInput.style.fontWeight = "bold"
                                                addNumInput.style.border = '1px solid red'
                                                addNumInput.style.borderRadius = '5px'
                                                addNumInput.style.textAlign = "center"
                                                document.getElementById('addNumInpu').setAttribute("placeholder", 2)

                                                document.getElementsByClassName("preference-modal-content")[0].children[3].appendChild(document.createElement('div')).innerHTML = '&nbsp限制金额:'
                                                var addAmountInput = document.getElementsByClassName("preference-modal-content")[0].children[3].lastElementChild.appendChild(document.createElement('input'))
                                                addAmountInput.id = 'addAmountInput'
                                                addAmountInput.value = amount

                                                addAmountInput.style.color = "red"
                                                addAmountInput.style.width = "50px"
                                                addAmountInput.style.fontWeight = "bold"
                                                addAmountInput.style.border = '1px solid red'
                                                addAmountInput.style.borderRadius = '5px'
                                                addAmountInput.style.textAlign = "center"
                                                document.getElementsByClassName("preference-modal-tr")[9].children[1].children[1].innerText = bankName
                                                document.getElementsByClassName("preference-modal-tr")[10].children[1].children[1].innerText = blackBankName

                                                document.getElementsByClassName("preference-modal-content")[0].children[3].appendChild(document.createElement('div')).innerHTML = '&nbsp最小刷新频率:'
                                                var addstartRe = document.getElementsByClassName("preference-modal-content")[0].children[3].lastElementChild.appendChild(document.createElement('input'))
                                                addstartRe.id = 'addstartRe'

                                                addstartRe.value = ReValue.split("~")[0]
                                                addstartRe.style.color = "red"
                                                addstartRe.style.width = "50px"
                                                addstartRe.style.fontWeight = "bold"
                                                addstartRe.style.border = '1px solid red'
                                                addstartRe.style.borderRadius = '5px'
                                                addstartRe.style.textAlign = "center"

                                                document.getElementsByClassName("preference-modal-content")[0].children[3].appendChild(document.createElement('div')).innerHTML = '&nbsp最小刷新频率:'
                                                var addEndRe = document.getElementsByClassName("preference-modal-content")[0].children[3].lastElementChild.appendChild(document.createElement('input'))
                                                addEndRe.id = 'addEndRe'

                                                addEndRe.value = ReValue.split("~")[1]
                                                addEndRe.style.color = "red"
                                                addEndRe.style.width = "50px"
                                                addEndRe.style.fontWeight = "bold"
                                                addEndRe.style.border = '1px solid red'
                                                addEndRe.style.borderRadius = '5px'
                                                addEndRe.style.textAlign = "center"
                                                // 判断如果是 天数是日期格式 显示日期格式 是天数展示天数
                                                if (/^\d{4}-\d{2}-\d{1,2}/.test(startDate) === true || /^\d{4}-\d{2}-\d{1,2}/.test(endDate) == true) {

                                                    if (document.getElementsByClassName("preference-modal-content")[0].children[6].lastChild.children[0].children[8].innerText === "切为日期") {
                                                        document.getElementsByClassName("preference-modal-content")[0].children[6].lastChild.children[0].children[8].click()
                                                    }

                                                }

                                                document.getElementsByClassName("ant-modal-body")[1].firstChild.children[9].lastChild.lastChild.innerText = "清除"
                                                document.getElementsByClassName("ant-modal-body")[1].firstChild.children[10].lastChild.lastChild.innerText = "清除"
                                                // 隐藏按钮
                                                document.getElementsByClassName("ant-modal-body")[1].lastChild.lastChild.style.display = "none"

                                                // 添加自己定义按钮
                                                var ownBtn = document.getElementsByClassName("ant-modal-body")[1].lastChild.appendChild(document.createElement('button'))
                                                ownBtn.type = "button"
                                                ownBtn.appendChild(document.createElement('span'))
                                                document.getElementsByClassName("ant-modal-body")[1].lastChild.lastChild.innerHTML = "保存编辑"
                                                ownBtn.className = "ant-btn ant-btn-primary"
                                                ownBtn.id = "saveEdit"
                                                var btn = document.getElementById("saveEdit");
                                                btn.onclick = function () {
                                                    var editDom = document.getElementsByClassName("preference-modal-content")[0].children
                                                    // 判断是否是超级账号
                                                    if (document.getElementsByClassName("new-ticket-remind-flag").length == 1) {
                                                        var editBidBtnLength = editDom[5].getElementsByClassName("ant-checkbox-group-item ant-checkbox-wrapper ant-checkbox-wrapper-checked").length
                                                        // 编辑承兑人类型长度
                                                        var editPriceSpInput = editDom[6].children[1].children[1].value
                                                        //编辑 最小金额
                                                        var editPriceEpInput = editDom[6].children[1].children[2].value
                                                        //编辑 最大金额
                                                        var editPriceBtn = editDom[6].lastChild.firstChild.getElementsByClassName("button-margin ant-radio-button-wrapper ant-radio-button-wrapper-checked")[0].children[0].firstChild.value
                                                        var editDateBtn = editDom[7].children[1].children[0].getElementsByClassName("button-margin ant-radio-button-wrapper ant-radio-button-wrapper-checked")[0].children[0].children[0].value
                                                        // 编辑日期按钮值
                                                        var editDateInputFlag = editDom[7].lastChild.lastChild.children[8].innerText
                                                        // 切为日期
                                                        if (editDateInputFlag === "切为日期") {
                                                            var editStartDate = editDom[7].children[1].children[0].children[7].children[0].value
                                                            // 天数格式
                                                            var editEndDate = editDom[7].children[1].children[0].children[7].children[1].value
                                                            // 天数格式
                                                        } else {
                                                            editStartDate = editDom[7].children[1].children[0].children[7].children[0].children[0].value
                                                            // 日期格式
                                                            editEndDate = editDom[7].children[1].children[0].children[8].children[0].children[0].value
                                                            // 日期格式
                                                        }

                                                        var editFlaw = editDom[8].children[1].children[0].getElementsByClassName("button-margin ant-radio-button-wrapper ant-radio-button-wrapper-checked")[0].children[1].innerHTML
                                                        // 瑕疵情况
                                                        var editYearQuote = editDom[9].children[1].children[0].children[0].value
                                                        // 编辑年化
                                                        var editMsw = editDom[9].children[1].children[0].children[1].value
                                                        //编辑每10万扣息

                                                        var editbankName = editDom[10].children[1].children[1].innerHTML
                                                        // 搜索承兑人
                                                        var editblankName = editDom[11].children[1].children[1].innerHTML
                                                        // 屏蔽承兑人
                                                        var editNum = document.getElementById("addNumInpu").value
                                                        // 编辑数量
                                                        var editAmount = document.getElementById("addAmountInput").value
                                                        // 编辑金额
                                                        var editTagName = document.getElementsByClassName("preference-modal-content")[0].children[1].children[1].children[0].value
                                                        // 简称
                                                        var editReStart = document.getElementById("addstartRe").value
                                                        // 开始刷新频率
                                                        var editReEnd = document.getElementById("addEndRe").value
                                                        // 开始刷新频率
                                                        // 修改值
                                                        var editBid = ""
                                                        for (var m = 0; m < editBidBtnLength; m++) {
                                                            editBid = editBid + " " + document.getElementsByClassName("preference-modal-content")[0].children[5].getElementsByClassName("ant-checkbox-group-item ant-checkbox-wrapper ant-checkbox-wrapper-checked")[m].innerText
                                                        }

                                                    } else {
                                                        // 获取编辑页面值

                                                        editBidBtnLength = editDom[4].getElementsByClassName("ant-checkbox-group-item ant-checkbox-wrapper ant-checkbox-wrapper-checked").length
                                                        // 编辑承兑人类型长度
                                                        editPriceSpInput = editDom[5].children[1].children[1].value
                                                        //编辑 最小金额
                                                        editPriceEpInput = editDom[5].children[1].children[2].value
                                                        //编辑 最大金额
                                                        editPriceBtn = editDom[5].lastChild.firstChild.getElementsByClassName("button-margin ant-radio-button-wrapper ant-radio-button-wrapper-checked")[0].children[0].firstChild.value
                                                        editDateBtn = editDom[6].children[1].children[0].getElementsByClassName("button-margin ant-radio-button-wrapper ant-radio-button-wrapper-checked")[0].children[0].children[0].value
                                                        // 编辑日期按钮值
                                                        editDateInputFlag = editDom[6].lastChild.lastChild.children[8].innerText
                                                        // 切为日期
                                                        if (editDateInputFlag === "切为日期") {
                                                            editStartDate = editDom[6].children[1].children[0].children[7].children[0].value
                                                            // 天数格式
                                                            editEndDate = editDom[6].children[1].children[0].children[7].children[1].value
                                                            // 天数格式
                                                        } else {
                                                            editStartDate = editDom[6].children[1].children[0].children[7].children[0].children[0].value
                                                            // 日期格式
                                                            editEndDate = editDom[6].children[1].children[0].children[8].children[0].children[0].value
                                                            // 日期格式
                                                        }

                                                        editFlaw = editDom[7].children[1].children[0].getElementsByClassName("button-margin ant-radio-button-wrapper ant-radio-button-wrapper-checked")[0].children[1].innerHTML
                                                        // 瑕疵情况
                                                        editYearQuote = editDom[8].children[1].children[0].children[0].value
                                                        // 编辑年化
                                                        editMsw = editDom[8].children[1].children[0].children[1].value
                                                        //编辑每10万扣息

                                                        editbankName = editDom[9].children[1].children[1].innerHTML
                                                        // 搜索承兑人
                                                        editblankName = editDom[10].children[1].children[1].innerHTML
                                                        // 屏蔽承兑人
                                                        editNum = document.getElementById("addNumInpu").value
                                                        // 编辑数量
                                                        editAmount = document.getElementById("addAmountInput").value
                                                        // 编辑金额
                                                        editTagName = document.getElementsByClassName("preference-modal-content")[0].children[0].children[1].children[0].value
                                                        // 简称
                                                        editReStart = document.getElementById("addstartRe").value
                                                        // 开始刷新频率
                                                        editReEnd = document.getElementById("addEndRe").value
                                                        // 开始刷新频率
                                                        // 修改值
                                                        editBid = ""
                                                        for (var m1 = 0; m1 < editBidBtnLength; m1++) {
                                                            editBid = editBid + " " + document.getElementsByClassName("preference-modal-content")[0].children[4].getElementsByClassName("ant-checkbox-group-item ant-checkbox-wrapper ant-checkbox-wrapper-checked")[m1].innerText
                                                        }

                                                    }

                                                    if (editBidBtnLength === 0 && editbankName === "") {
                                                        alert('承兑人类型和承兑人名称不能同时为空')
                                                        // console.log("承兑人类型和承兑人名称不能同时为空")
                                                        return
                                                    }
                                                    if (editPriceBtn === '' && editPriceSpInput === '' && editPriceEpInput === '') {
                                                        alert('最小金额和最大金额和票面金额按钮不能同时为空')
                                                        return
                                                    }
                                                    else {
                                                        if (editPriceSpInput === '' && editPriceEpInput === '') {
                                                            if (editPriceBtn === "1") {
                                                                editPriceSpInput = ''
                                                                editPriceEpInput = 9.9999

                                                            } else if (editPriceBtn === "2") {
                                                                editPriceSpInput = 10
                                                                editPriceEpInput = 49.9999

                                                            } else if (editPriceBtn === "3") {
                                                                editPriceSpInput = 50
                                                                editPriceEpInput = 99.9999

                                                            } else {
                                                                editPriceSpInput = 100
                                                                editPriceEpInput = ''
                                                            }

                                                        } else {
                                                            if (editPriceSpInput === undefined) {
                                                                editPriceSpInput = ""
                                                            }
                                                            if (editPriceEpInput === undefined) {
                                                                editPriceEpInput = ""
                                                            }
                                                            editPriceSpInput = editPriceSpInput
                                                            editPriceEpInput = editPriceEpInput

                                                        }

                                                    }

                                                    if (editFlaw === "全部") {
                                                        editFlaw = "无瑕疵"
                                                    }

                                                    if (editYearQuote === "" && editMsw === "") {
                                                        alert('年化和每10万扣息不能同时为空')
                                                        return

                                                    }
                                                    if (editStartDate === "" && editEndDate === "" && editDateBtn === "") {
                                                        alert('票据期限和天数不能同时为空')
                                                        return
                                                    } else {
                                                        if (editDateBtn === "1") {
                                                            editStartDate = ""
                                                            editEndDate = 90
                                                        } else if (editDateBtn === "2") {
                                                            editStartDate = 91
                                                            editEndDate = 129
                                                        } else if (editDateBtn === "3") {
                                                            editStartDate = 130
                                                            editEndDate = 187
                                                        } else if (editDateBtn === "4") {
                                                            editStartDate = 188
                                                            editEndDate = 330
                                                        } else if (editDateBtn === "5") {
                                                            editStartDate = 331
                                                            editEndDate = ""
                                                        } else {
                                                            if (editStartDate === undefined) {
                                                                editPriceSpInput = ""
                                                            }
                                                            if (editEndDate === undefined) {
                                                                editPriceEpInput = ""
                                                            }
                                                            editStartDate = editStartDate
                                                            editEndDate = editEndDate

                                                        }

                                                    }
                                                    console.log(editNum, editAmount, editReStart, editReEnd)
                                                    if (new RegExp(/^[0-9]*$/).test(editNum) === false || editNum === undefined || editNum === "") {
                                                        alert("限制数量应为数字")
                                                        return
                                                    }
                                                    if (new RegExp(/^[0-9]*$/).test(editAmount) === false || editAmount === undefined || editAmount === "") {
                                                        alert("限制金额应为数字")
                                                        return
                                                    }
                                                    if (new RegExp(/^[0-9]*$/).test(editReStart) === false || editReStart === undefined || editReStart === "") {
                                                        alert("开始刷新频率应为数字")
                                                        return
                                                    }
                                                    if (new RegExp(/^[0-9]*$/).test(editReEnd) === false || editReEnd === undefined || editReEnd === "") {
                                                        alert("刷新频率应为数字")
                                                        return
                                                    }

                                                    tdList[3].children[0].value = editPriceSpInput
                                                    tdList[4].children[0].value = editPriceEpInput
                                                    tdList[5].children[0].value = editBid
                                                    tdList[6].children[0].value = editbankName
                                                    tdList[7].children[0].value = editblankName
                                                    tdList[8].children[0].value = editStartDate
                                                    tdList[9].children[0].value = editEndDate
                                                    tdList[10].children[0].value = editYearQuote
                                                    tdList[11].children[0].value = editMsw
                                                    tdList[12].children[0].value = editFlaw
                                                    tdList[13].children[0].value = editReStart + "~" + editReEnd
                                                    tdList[15].children[0].value = editAmount
                                                    tdList[16].children[0].value = editNum

                                                    document.getElementsByClassName("ant-modal-body")[1].lastChild.children[3].click()
                                                    // 点击保存
                                                    localStorage.setItem(name + "qwertyuiop", JSON.stringify({
                                                        "n": editNum,
                                                        "a": editAmount,
                                                        'rS': editReStart,
                                                        "rE": editReEnd
                                                    }))
                                                    document.getElementById(name).id = editTagName
                                                    tdList[0].children[0].value = editTagName
                                                    // 简称用于删除编辑
                                                    document.getElementsByClassName("ant-modal-close-x")[0].click()
                                                    // 关闭编辑
                                                    //console.log(document.getElementById(name).parentNode.parentNode.children[0].children[0].value)

                                                }
                                            }
                                        }, 1000)

                                    }




                                }

                            }, 2000)

                        })
                        $('.del').click(function () {
                            var tdList = this.parentNode.parentNode
                            console.log(tdList)
                            var name = tdList.children[0].children[0].value

                            var Nametime = document.getElementById(name).value
                            if (Nametime === "" || Nametime === undefined || Nametime === " ") {
                                // 点击偏好处理
                                document.getElementById("new-ticket-remind").lastChild.lastChild.lastChild.click()
                                window.setTimeout(function () {
                                    for (var i = 0; i < document.getElementsByClassName("sortable-item-customer").length; i++) {
                                        tagName = document.getElementsByClassName("sortable-item-customer")[i].firstChild.innerText
                                        // 简称
                                        if (name === tagName) {
                                            // 点击编辑小图标
                                            document.getElementsByClassName("sortable-item-customer")[i].children[1].lastChild.click()
                                            document.getElementsByClassName("ant-modal-close-x")[0].click()
                                            // 关闭编辑
                                            tdList.remove()
                                            // 移除表格中内容

                                            //删除localStorage 值
                                            localStorage.removeItem(tagName + "qwertyuiop")

                                        }

                                    }

                                }, 1000)

                            } else {
                                alert("请停止后,在删除")
                            }

                        })
                        $('.start').click(function () {
                            console.log(this,123123123123123)
                            this.style.borderColor = "red";
                            this.style.backgroundColor = "red";
                            this.setAttribute("disabled", true);
                            this.innerHTML = "抢单中";
                            // 获取值

                            var tdList = this.parentNode.parentNode.children
                            let priceSp = tdList[3].children[0].value
                            // 最小金额
                            let priceEp = tdList[4].children[0].value
                            // 最大金额
                            let bid = tdList[5].children[0].value
                            // 承兑人类型
                            let bankName = tdList[6].children[0].value
                            // 搜索承兑人名单
                            let blackBankName = tdList[7].children[0].value
                            // 屏蔽承兑人名单
                            let startDate = tdList[8].children[0].value
                            // 开始日期
                            let endDate = tdList[9].children[0].value
                            // 结束日期
                            let yearQuote = tdList[10].children[0].value
                            // 年化
                            let msw = tdList[11].children[0].value
                            // 每10万加
                            let flawStatus = tdList[12].children[0].value
                            // 瑕疵情况
                            let refresh = tdList[13].children[0].value
                            // 刷新频率1~5   parseInt(Math.random() * Math.max(arr)) + 1 => 1-5
                            let amount = tdList[15].children[0].value
                            // 限制金额
                            let num = tdList[16].children[0].value
                            // 限制数量
                            let abbreviation = tdList[0].children[0].value
                            // 简称
                            var bidList = []
                            // 检验判断

                            if (priceSp === "" && priceEp === "") {
                                alert('最小金额和最大金额不能同时为空')
                                return
                            } else {
                                if (priceSp === "" || priceSp === undefined) {
                                    priceSp = null
                                }
                                if (priceEp === "" || priceEp === undefined) {
                                    priceEp = null
                                }

                            }
                            // console.log(bid,typeof bid)
                            if (bid === "" && bankName === "") {
                                alert('承兑人类型和搜索承兑人名称不能同时为空')
                                return
                            }
                            else {
                                //["1", "9", "2", "3", "6", "7", "4", "8", "10"]
                                for (var a = 0, wgl_bid = bid.split(" "); a < wgl_bid.length; a++) {
                                    if (wgl_bid[a] == "国股") {
                                        var strBid = "1"
                                        bidList.push(strBid)
                                    } else if (wgl_bid[a] == "大商") {
                                        strBid = "9"
                                        bidList.push(strBid)

                                    } else if (wgl_bid[a] == "城商") {
                                        strBid = "2"
                                        bidList.push(strBid)

                                    } else if (wgl_bid[a] == "三农") {
                                        strBid = "3"
                                        bidList.push(strBid)

                                    } else if (wgl_bid[a] == "村镇") {
                                        strBid = "6"
                                        bidList.push(strBid)

                                    } else if (wgl_bid[a] == "外资") {
                                        strBid = "7"
                                        bidList.push(strBid)

                                    } else if (wgl_bid[a] == "民营") {
                                        strBid = "4"
                                        bidList.push(strBid)

                                    } else if (wgl_bid[a] == "财票") {
                                        strBid = "8"
                                        bidList.push(strBid)

                                    } else if (wgl_bid[a] == "商票") {
                                        strBid = "10"
                                        bidList.push(strBid)

                                    }

                                }
                                if (bidList === [""] || bidList === []) {
                                    bidList = null

                                } else {
                                    bidList = Array.from(new Set(bidList))

                                }
                                if (bankName === "") {
                                    bankName = null
                                }

                            }
                            console.log(startDate, endDate, 55555555555555)
                            if (startDate === "" && endDate === "") {
                                alert("开始日期和结束日期不能同时为空")
                                return
                            } else {
                                console.log(startDate, endDate, 55555555555555)

                                if (/^\d{4}-\d{2}-\d{1,2}/.test(startDate) === false && /^\d{4}-\d{2}-\d{1,2}/.test(endDate) == false) {
                                    if (startDate != "" && startDate !== undefined) {
                                        startDate = GetDateStr(startDate)

                                    }
                                    if (endDate != "" && endDate !== undefined) {
                                        endDate = GetDateStr(endDate)
                                    }
                                }

                            }
                            if (flawStatus === "无瑕疵") {
                                flawStatus = "0"
                            } else if (flawStatus === "回出票人") {
                                flawStatus = "46"

                            } else if (flawStatus === "回收款人") {
                                flawStatus = "47"

                            } else if (flawStatus === "背书回头") {
                                flawStatus = "48"

                            } else if (flawStatus === "重复") {
                                flawStatus = "2"

                            } else if (flawStatus === "质押") {
                                flawStatus = "3"

                            } else if (flawStatus === "保证") {
                                flawStatus = "4"

                            } else if (flawStatus === "不一致") {
                                flawStatus = "5"

                            } else if (flawStatus === "其他") {
                                flawStatus = "6"

                            } else {
                                flawStatus = ""
                            }
                            if (yearQuote === "" && msw === "") {
                                alert('年化和每10万扣息不能同时为空')
                            }
                            if (blackBankName === "" || blackBankName === undefined) {
                                blackBankName = null
                            }
                            //1~5刷新频率 最终值 1000-5000ms-
                            let setTime = randomNum(Number(refresh.split('~')[0]), Number(refresh.split('~')[1]))

                            //根据简称动态声明变量
                            let timer = abbreviation;
                            //定义一个初始量
                            //在开始元素中设定data-*属性
                            this.dataset.text = abbreviation;
                            clearInterval(abbreviation);
                            //存储简称值 用于刷新后判断 恢复
                            localStorage.setItem(abbreviation, 1);
                            if (document.getElementById("authValue") === "") {
                                var localStorageAuthValue = "Bearer " + document.cookie.split('access_token=')[1].split(';')[0]
                            } else {
                                localStorageAuthValue = localStorage.getItem('authValue')
                                if (localStorageAuthValue === null || localStorageAuthValue === undefined || localStorageAuthValue == "" || localStorageAuthValue.length != 43) {
                                    alert('输入用户值有问题,请重新输入')
                                    return
                                }

                            }

                            //收集时间变量
                            timer = setInterval(() => {
                                var authorization = "Bearer " + document.cookie.split('access_token=')[1].split(';')[0]

                                var getTradingOrderInfohttpRequest = new XMLHttpRequest();
                                //第一步：创建需要的对象
                                getTradingOrderInfohttpRequest.open('POST', 'https://www.tcpjw.com/order-web/orderInfo/getTradingOrderInfo', true);
                                //第二步：打开连接/***发送json格式文件必须设置请求头 ；如下 - */
                                getTradingOrderInfohttpRequest.setRequestHeader("Content-type", "application/json");
                                //设置请求头 注：post方式必须设置请求头（在建立连接后设置请求头）var obj = { name: 'zhansgan', age: 18 };
                                getTradingOrderInfohttpRequest.setRequestHeader("Authorization", localStorageAuthValue);
                                getTradingOrderInfohttpRequest.setRequestHeader("OriginV", "3.91");
                                var playload = {
                                    "bankName": bankName, // 承兑人名称
                                    "bid": bidList,// 承兑人类型
                                    "blackBankName": blackBankName, // 屏蔽承兑人名称
                                    "depositPay": false, // 保证金 未交
                                    "endDate": endDate,// 结束日期
                                    "endorseKeyWords":null,
                                    "faceKeyWords": null,
                                    "flawStatus": flawStatus, // 瑕疵情况
                                    "isCollected":false,
                                    "isCurUserPublish":false,
                                    "isSpj":false,// 识票据
                                    "issueDailyNoMoreThanNums": "",
                                    "lastMonthTimeList":'',
                                    "lastTime": null,
                                    "lastTimeEnd": null,
                                    "lastTimeStart": null,
                                    "msw": msw,// 10万加
                                    "mswEnd":null,
                                    "mswStart": null,
                                    "noMoreThanNums":"",
                                    "noMoreThanTodayNums":"",
                                    "orderColumn":null,
                                    "orderStatus": 1,//待接单
                                    "pageNum":1,
                                    "pageSize":"10",
                                    "payType": null,
                                    "priceSp": priceSp,// 最小金额
                                    "priceEp": priceEp,// 最大金额
                                    "priceType": null,
                                    "queryBillAmount":null,
                                    "recentDays":null,
                                    "recentDaysNoMoreThanNums":null,
                                    "sortType": "",
                                    "source": "HTML",
                                    "startDate": startDate,// 开始日期
                                    "version": "3.5",
                                    "yearQuote": yearQuote,// 年化
                                }

                                getTradingOrderInfohttpRequest.send(JSON.stringify(playload));
                                //发送请求 将json写入send中
                                /**
                            * 获取数据后的处理程序
                            */
                                getTradingOrderInfohttpRequest.onreadystatechange = function () {
                                    //请求后的回调接口，可将请求成功后要执行的程序写在其中

                                    if (getTradingOrderInfohttpRequest.readyState == 4 && getTradingOrderInfohttpRequest.status == 200) {
                                        //验证请求是否发送成功
                                        var json = getTradingOrderInfohttpRequest.responseText;
                                        //获取到服务端返回的数据
                                        var orderInfo = JSON.parse(json)
                                        var code = orderInfo.code

                                        var nowTime = new Date().getHours().toString() + ":" + new Date().getMinutes().toString() + ":" + new Date().getSeconds().toString()
                                        try {
                                            document.getElementById(abbreviation).value = nowTime
                                            if (nowTime) {

                                                tdList[2].children[0].style.backgroundColor = "red";
                                                tdList[2].children[0].style.color = "white";
                                                tdList[2].children[0].innerHTML = "接单中";
                                            }
                                        } catch (error) {
                                            console.log(error)
                                        }

                                        if (code == "0") {

                                            var orderInfoList = orderInfo.data.list
                                            var orderInfoListLen = orderInfoList.length
                                            if (orderInfoListLen >= 3) {
                                                orderInfoListLen = 1
                                            }
                                            for (var d = 0; d < orderInfoListLen; d++) {

                                                var difPrice = parseFloat(orderInfoList[d].difPrice)
                                                // 利差
                                                var ticketId = orderInfoList[d].ticketId
                                                // 票号id
                                                var yearQuote = orderInfoList[d].yearQuote
                                                // 年化
                                                var sellPrice = orderInfoList[d].sellPrice
                                                // 每10万扣息
                                                var orderStatusDesc = orderInfoList[d].orderStatusDesc
                                                // 是否能接单
                                                if (difPrice + 1 >= 0 && orderStatusDesc === "接单") {
                                                    var getQuoteOrderInfo = new XMLHttpRequest();
                                                    //第一步：创建需要的对象
                                                    getQuoteOrderInfo.open('POST', 'https://www.tcpjw.com/order-web/orderInfo/getQuoteOrderInfo', true);
                                                    //第二步：打开连接/***发送json格式文件必须设置请求头 ；如下 - */
                                                    getQuoteOrderInfo.setRequestHeader("Content-type", "application/json");
                                                    //设置请求头 注：post方式必须设置请求头（在建立连接后设置请求头）
                                                    getQuoteOrderInfo.setRequestHeader("Authorization", authorization);
                                                    getQuoteOrderInfo.setRequestHeader("OriginV", "3.92");
                                                    getQuoteOrderInfo.send(JSON.stringify({
                                                        "version": "3.5",
                                                        "source": "HTML",
                                                        "channel": "01",
                                                        "ticketId": ticketId,
                                                        "msw": sellPrice,
                                                        "yearQuote": yearQuote
                                                    }));
                                                    //发送请求 将json写入send中
                                                    getQuoteOrderInfo.onreadystatechange = function () {
                                                        if (getQuoteOrderInfo.readyState == 4 && getQuoteOrderInfo.status == 200) {
                                                            var getQuoteOrderInfoData = getQuoteOrderInfo.responseText
                                                            var getQuoteOrderInfoJsonData = JSON.parse(getQuoteOrderInfoData)
                                                            // console.log(getQuoteOrderInfoJsonData)
                                                            var getQuoteOrderInfoJsonDataCode = getQuoteOrderInfoJsonData.code
                                                            if (getQuoteOrderInfoJsonDataCode == '0') {
                                                                var tradeNo = getQuoteOrderInfoJsonData.data.tradeNo
                                                                // 订单编号
                                                                var ticketPrice = getQuoteOrderInfoJsonData.data.ticketPrice
                                                                // 票面金额
                                                                var ticketType = getQuoteOrderInfoJsonData.data.ticketType
                                                                // 票据类型
                                                                var ticketPayPass = getQuoteOrderInfoJsonData.data.ticketPayPass
                                                                // 支付渠道
                                                                var totalPrice = getQuoteOrderInfoJsonData.data.totalPrice
                                                                // 实际支付金额
                                                                var hundredThousandCharge = getQuoteOrderInfoJsonData.data.msw
                                                                // 每10万扣息
                                                                var QuoteyearQuote = getQuoteOrderInfoJsonData.data.yearQuote
                                                                // 年化
                                                                var publishTime = getQuoteOrderInfoJsonData.data.publishTime
                                                                // 发布时间
                                                                var endTime = getQuoteOrderInfoJsonData.data.endTime
                                                                // 到期日
                                                                var bankName = getQuoteOrderInfoJsonData.data.bankName
                                                                // 承兑人名称
                                                                var flawDescription = getQuoteOrderInfoJsonData.data.flawDescription
                                                                var flawStatusDescrption = getQuoteOrderInfoJsonData.data.flawStatusDescrption
                                                                var endTimeCheck = getQuoteOrderInfoJsonData.data.endTimeCheck
                                                                // 瑕疵
                                                                // 判断是否达到限制条件
                                                                //console.log(tdList[16].children[0].value, tdList[15].children[0].value)
                                                                if (Number(tdList[16].children[0].value) > 0 && parseFloat(tdList[15].children[0].value) >= parseFloat(ticketPrice)) {

                                                                    $.ajax({
                                                                        type: "POST",
                                                                        url: "https://www.tcpjw.com/commodule-web/settings/receipt/paymentChannels",
                                                                        headers: {
                                                                            "Content-type": 'application/json',
                                                                            "authorization": authorization
                                                                        },
                                                                        dataType: "json",
                                                                        data: JSON.stringify({"version":"3.5","source":"HTML","channel":"01"}),
                                                                        success: function (data) {
                                                                            console.log(data)
                                                                            if(data.code=="0"){
                                                                                var collectionData = data.collectionData
                                                                                for(var C =0;C<collectionData.length;C++){
                                                                                    var channel = collectionData[C].channel
                                                                                    var accounts = collectionData[C].accounts
                                                                                    console.log(channel)
                                                                                    if (ticketPayPass.indexOf(channel.toString()) != -1) {
                                                                                        if(channel==2){
                                                                                            var payType = 1
                                                                                            var eId = accounts[0].id
                                                                                            console.log(payType,eId,123)
                                                                                        }
                                                                                        else if(channel==5){
                                                                                            var payType = 4
                                                                                            var eId = accounts[0].id
                                                                                            console.log(payType,eId,456)
                                                                                        }

                                                                                        break

                                                                                    }



                                                                                }
                                                                                var getUseCouponList = new XMLHttpRequest();
                                                                                //第一步：创建需要的对象
                                                                                getUseCouponList.open('POST', 'https://www.tcpjw.com/order-web/orderCoupon/getUseCouponList', true);
                                                                                //第二步：打开连接/***发送json格式文件必须设置请求头 ；如下 - */
                                                                                getUseCouponList.setRequestHeader("Content-type", "application/json");
                                                                                //设置请求头 注：post方式必须设置请求头（在建立连接后设置请求头）
                                                                                getUseCouponList.setRequestHeader("Authorization", authorization);
                                                                                getUseCouponList.setRequestHeader("OriginV", "3.92");
                                                                                getUseCouponList.send(JSON.stringify({
                                                                                    "version": "3.5",
                                                                                    "source": "HTML",
                                                                                    "channel": "01",
                                                                                    "ticketPrice": ticketPrice,
                                                                                    "ticketType": ticketType,
                                                                                    "tradeNo": tradeNo
                                                                                }));
                                                                                //发送请求 将json写入send中
                                                                                getUseCouponList.onreadystatechange = function () {
                                                                                    if (getUseCouponList.readyState == 4 && getUseCouponList.status == 200) {
                                                                                        var getUseCouponListData = getUseCouponList.responseText
                                                                                        var getUseCouponListJsonData = JSON.parse(getUseCouponListData)
                                                                                        var getUseCouponListJsonDataCode = getUseCouponListJsonData.code


                                                                                        if (getUseCouponListJsonDataCode == "0") {
                                                                                            var totalRestNumCash = getUseCouponListJsonData.data.totalRestNumCash
                                                                                            // 返现金优惠卷数量 类型 number
                                                                                            var totalRestNumDis = getUseCouponListJsonData.data.totalRestNumDis
                                                                                            // 返豆优惠卷数量     类型 number

                                                                                            if (totalRestNumCash > 0 && totalRestNumDis > 0) {
                                                                                                // 使用优惠卷
                                                                                                var cashBackCouponList = getUseCouponListJsonData.data.cashBackCouponList
                                                                                                var discountCouponList = getUseCouponListJsonData.data.discountCouponList
                                                                                                var cashBackCouponListDiscount = parseFloat(cashBackCouponList[0].discount)
                                                                                                //返现金百分比
                                                                                                var discountCouponListDiscount = parseFloat(discountCouponList[0].discount)
                                                                                                // 返豆百分比
                                                                                                if (cashBackCouponListDiscount > discountCouponListDiscount) {
                                                                                                    var UseCouponCode = cashBackCouponList[0].code
                                                                                                } else {
                                                                                                    UseCouponCode = discountCouponList[0].code
                                                                                                }

                                                                                            } else if (totalRestNumCash === 0 && totalRestNumDis > 0) {
                                                                                                // 只能使用返豆优惠卷
                                                                                                UseCouponCode = getUseCouponListJsonData.data.discountCouponList[0].code

                                                                                            } else if (totalRestNumCash > 0 && totalRestNumDis === 0) {
                                                                                                // 只能使用返现优惠卷
                                                                                                UseCouponCode = getUseCouponListJsonData.data.cashBackCouponList[0].code

                                                                                            } else {
                                                                                                // 没有优惠卷
                                                                                                UseCouponCode = null
                                                                                            }


                                                                                        }
                                                                                        // 支付
                                                                                        var quoteOrder = new XMLHttpRequest();
                                                                                        //第一步：创建需要的对象
                                                                                        quoteOrder.open('POST', 'https://www.tcpjw.com/order-web/orderFlow/quoteOrder', true);
                                                                                        //第二步：打开连接/***发送json格式文件必须设置请求头 ；如下 - */
                                                                                        quoteOrder.setRequestHeader("Content-type", "application/json");
                                                                                        //设置请求头 注：post方式必须设置请求头（在建立连接后设置请求头）
                                                                                        quoteOrder.setRequestHeader("Authorization", authorization);
                                                                                        quoteOrder.setRequestHeader("OriginV", "3.92");
                                                                                        //商票1，银票2，财票3
                                                                                        if (UseCouponCode === null) {
                                                                                            var quoteOrderParmas = {
                                                                                                "version": "3.5",
                                                                                                "source": "HTML",
                                                                                                "channel": "01",
                                                                                                "ticketId": ticketId,
                                                                                                "hundredThousandCharge": hundredThousandCharge,
                                                                                                "payType": payType,
                                                                                                "endorseId": eId,
                                                                                                "yearRate": QuoteyearQuote,
                                                                                                "dealPrice": totalPrice,
                                                                                                "ticketPrice": ticketPrice,
                                                                                                "ticketType": 2,
                                                                                                "useDefault": false,
                                                                                                "tradeNo": tradeNo,
                                                                                                'bankName':bankName,
                                                                                                "flawStatusDescrption":flawStatusDescrption,
                                                                                                "endTime":endTimeCheck

                                                                                            }

                                                                                        } else {
                                                                                            quoteOrderParmas = {
                                                                                                "version": "3.5",
                                                                                                "source": "HTML",
                                                                                                "channel": "01",
                                                                                                "ticketId": ticketId,
                                                                                                "hundredThousandCharge": hundredThousandCharge,
                                                                                                "payType": payType,
                                                                                                "endorseId": eId,
                                                                                                "yearRate": QuoteyearQuote,
                                                                                                "dealPrice": totalPrice,
                                                                                                "ticketPrice": ticketPrice,
                                                                                                "ticketType": 2,
                                                                                                "useDefault": false,
                                                                                                "tradeNo": tradeNo,
                                                                                                "code": UseCouponCode,
                                                                                                "num": 1,
                                                                                                'bankName':bankName,
                                                                                                "flawStatusDescrption":flawStatusDescrption,
                                                                                                "endTime":endTimeCheck
                                                                                            }

                                                                                        }

                                                                                        quoteOrder.send(JSON.stringify(quoteOrderParmas));

                                                                                        quoteOrder.onreadystatechange = function () {
                                                                                            if (quoteOrder.readyState == 4 && quoteOrder.status == 200) {
                                                                                                var quoteOrderData = quoteOrder.responseText


                                                                                                var quoteOrderJsonData = JSON.parse(quoteOrderData)

                                                                                                var quoteOrderJsonDataCode = quoteOrderJsonData.code
                                                                                                if (quoteOrderJsonDataCode == "0") {
                                                                                                    console.log(tdList[16].children[0].value, tdList[15].children[0].value)
                                                                                                    tdList[15].children[0].value = parseFloat(tdList[15].children[0].value) - parseFloat(ticketPrice).toFixed(2)
                                                                                                    // 限制金额
                                                                                                    tdList[16].children[0].value = Number(tdList[16].children[0].value) - 1
                                                                                                    // 限制数量
                                                                                                    var quoteOrderMsg = new XMLHttpRequest();
                                                                                                    //第一步：创建需要的对象
                                                                                                    quoteOrderMsg.open('POST', 'https://dianpiaoku.cn:9902/cdk/orderp/addOrderp', true);
                                                                                                    //第二步：打开连接/***发送json格式文件必须设置请求头 ；如下 - */
                                                                                                    quoteOrderMsg.setRequestHeader("Content-Type", "application/json");
                                                                                                    ;//设置请求头 注：post方式必须设置请求头（在建立连接后设置请求头）
                                                                                                    var quoteOrderMsgparmas = {
                                                                                                        "name": abbreviation,
                                                                                                        "dateTime": GetDateStr(0),
                                                                                                        "dates": publishTime,
                                                                                                        "manager": bankName,
                                                                                                        "money": ticketPrice,
                                                                                                        "surplusDate": endTime,
                                                                                                        "housand": hundredThousandCharge,
                                                                                                        "yearRate": yearQuote,
                                                                                                        "draftMarkNo": tradeNo,
                                                                                                        "supportChannel": payType,
                                                                                                        "gap": difPrice,
                                                                                                        "flaw": flawDescription,
                                                                                                    }
                                                                                                    quoteOrderMsg.send(JSON.stringify(quoteOrderMsgparmas));
                                                                                                    //发送请求 将json写入send中
                                                                                                    quoteOrderMsg.onreadystatechange = function () {
                                                                                                        if (quoteOrderMsg.readyState == 4 && quoteOrderMsg.status == 200) {

                                                                                                            console.log(quoteOrderMsg.responseText)

                                                                                                        }
                                                                                                    }

                                                                                                }

                                                                                            }

                                                                                        }


                                                                                    }

                                                                                }

                                                                            }
                                                                        }
                                                                    })



                                                                }

                                                            } else {
                                                                //限制金额或者限笔数为0 跳出循环  停止
                                                                tdList[2].children[0].style.borderColor = "#52c41a";
                                                                tdList[2].children[0].style.backgroundColor = "#52c41a";
                                                                tdList[2].children[0].disabled = false;
                                                                tdList[2].children[0].innerHTML = "开始";
                                                                tdList[15].children[0].value = 500
                                                                // 限制金额
                                                                tdList[16].children[0].value = 2
                                                                // 限制数量
                                                                tdList[1].children[0].value = "";
                                                                localStorage.setItem(abbreviation, 0)
                                                                timerArr.forEach(item => {
                                                                    if (localStorage.getItem(abbreviation + "abc123") == item.timer) {

                                                                        // console.log(item.timer)

                                                                        clearInterval(item.timer)

                                                                    }

                                                                }
                                                                )
                                                                return false

                                                            }

                                                        }

                                                    }

                                                }
                                            }

                                        }

                                    }// code -3 达到风控
                                    else if (code == "-3") {

                                        // 请求风控接口
                                        var dianhttpRequest = new XMLHttpRequest();
                                        //第一步：创建需要的对象
                                        dianhttpRequest.open('GET', 'https://dianpiaoku.cn:9902/cdk/token/getToken', true);
                                        //第二步：打开连接/***发送json格式文件必须设置请求头 ；如下 - */

                                        dianhttpRequest.send();
                                        //发送请求 将json写入send中
                                        /**
                                    * 获取数据后的处理程序
                                    */
                                        dianhttpRequest.onreadystatechange = function () {
                                            //请求后的回调接口，可将请求成功后要执行的程序写在其中
                                            if (dianhttpRequest.readyState == 4 && dianhttpRequest.status == 200) {
                                                //验证请求是否发送成功
                                                var data = dianhttpRequest.responseText;
                                                //获取到服务端返回的数据
                                                var dianJSONdata = JSON.parse(data)
                                                if (dianJSONdata.code == 200) {
                                                    var text = dianJSONdata.obj.text
                                                    console.log(text, typeof text, JSON.parse(text), typeof (JSON.parse(text)))

                                                    if (JSON.parse(text).msg == -1) {
                                                        console.log("刮刮卡接口用完")
                                                    } else {
                                                        var jsonpData = JSON.parse(text).data
                                                        console.log(jsonpData, typeof jsonpData)
                                                        var splitJsonpData = JSON.parse(jsonpData.split("(")[1].split(")")[0])
                                                        if (splitJsonpData.result.result.code == 0) {
                                                            var sig = splitJsonpData.result.result.sig
                                                            var sessionId = splitJsonpData.result.result.sessionId
                                                            var verifyHttpRequest = new XMLHttpRequest();
                                                            verifyHttpRequest.open('POST', 'https://www.tcpjw.com/order-web/alisign/verify', true);
                                                            //第二步：打开连接/***发送json格式文件必须设置请求头 ；如下 - */
                                                            verifyHttpRequest.setRequestHeader("Content-type", "application/json");
                                                            //设置请求头 注：post方式必须设置请求头（在建立连接后设置请求头）var obj = { name: 'zhansgan', age: 18 };
                                                            verifyHttpRequest.setRequestHeader("Authorization", "Bearer " + document.cookie.split('access_token=')[1].split(';')[0]);
                                                            verifyHttpRequest.setRequestHeader("OriginV", "3.91");
                                                            console.log({
                                                                "version": "3.5",
                                                                "source": "HTML",
                                                                "channel": "01",
                                                                "sessionId": sessionId,
                                                                "sig": sig,
                                                                "token": JSON.parse(text).token
                                                            })
                                                            verifyHttpRequest.send(JSON.stringify({
                                                                "version": "3.5",
                                                                "source": "HTML",
                                                                "channel": "01",
                                                                "sessionId": sessionId,
                                                                "sig": sig,
                                                                "token": JSON.parse(text).token
                                                            }));
                                                            //发送请求 将json写入send中
                                                            verifyHttpRequest.onreadystatechange = function () {
                                                                if (verifyHttpRequest.readyState == 4 && verifyHttpRequest.status == 200) {
                                                                    console.log(verifyHttpRequest.responseText)

                                                                }
                                                            }

                                                        }

                                                    }

                                                }

                                            }
                                        }

                                    }

                                }
                            }

                                , setTime)
                            //定义一个对象
                            let timerObj = {
                                wgl_index: abbreviation,
                                timer,
                            }
                            localStorage.setItem(abbreviation + "abc123", timer)
                            //时间收集器
                            timerArr.push(timerObj)
                        })
                        $('.stop').click(function () {
                            /**********************************2.0******************************************************************/
                            //接收data-text的数据
                            var tdList = this.parentNode.parentNode
                            let name = tdList.children[0].children[0].value

                            timerArr.forEach((item, index, arr) => {
                                if (name == item.wgl_index) {
                                    //同一个单元格的开始按钮data属性 与 自定义的时间收集器简称一致就可以清除定时器
                                    clearInterval(item.timer);
                                    this.parentNode.parentNode.children[1].children[0].value = " ";
                                    this.parentNode.parentNode.children[2].children[0].innerHTML = "开始";
                                    this.parentNode.parentNode.children[2].children[0].disabled = false;
                                    this.parentNode.parentNode.children[2].children[0].style.backgroundColor = "#52c41a";
                                    this.parentNode.parentNode.children[2].children[0].style.borderColor = "#52c41a";
                                    localStorage.setItem(name, 0);
                                }
                            }
                            )

                        })

                     }
                }
            })


        }
        else {
            document.getElementsByClassName('data-table')[0].style.display = "block"
            //自己定义的table需要消失
            document.getElementById("wkf_write").style.display = "none"

        }

    }
    //接单完成
    document.getElementById("changeBtn").click()
    // 获取用户值
    setTimeout(() => {
        //先获取简称
        var httpRequest = new XMLHttpRequest();
        //第一步：创建需要的对象
        httpRequest.open('POST', 'https://www.tcpjw.com/order-web/orderInfo/setTcPreferencedRecord', true);
        //第二步：打开连接/***发送json格式文件必须设置请求头 ；如下 - */
        httpRequest.setRequestHeader("Content-type", "application/json");
        //设置请求头 注：post方式必须设置请求头（在建立连接后设置请求头）var obj = { name: 'zhansgan', age: 18 };
        httpRequest.setRequestHeader("Authorization", "Bearer " + document.cookie.split('access_token=')[1].split(';')[0]);
        httpRequest.setRequestHeader("OriginV", "3.91");
        httpRequest.send(JSON.stringify({
            "version": "3.5",
            "source": "HTML",
            "channel": "01",
            "setPreferencesType": 4
        }));
        //发送请求 将json写入send中
        /**
        * 获取数据后的处理程序
        */
        httpRequest.onreadystatechange = function () {
            //请求后的回调接口，可将请求成功后要执行的程序写在其中

            if (httpRequest.readyState == 4 && httpRequest.status == 200) {
                //验证请求是否发送成功

                var data = httpRequest.responseText;
                //获取到服务端返回的数据

                var JSONdata = JSON.parse(data)

                if (JSONdata.code === "0") {

                    var tcPreferencedRecordRespBaseVos = JSONdata.data.tcPreferencedRecordRespBaseVos

                    for (let j = 0; j < tcPreferencedRecordRespBaseVos.length; j++) {

                        let tagName = tcPreferencedRecordRespBaseVos[j].tagName
                        // 简称

                        if (localStorage.getItem(tagName) == 1) {

                            document.getElementById(tagName).parentNode.parentNode.children[2].children[0].click()

                        }
                    }
                }
            }
        }
    }
        , 1000)


    function randomNum(m, n) {
        var num = Math.floor(Math.random() * (m - n) + n);
        return num * 1000
    }

    },10000)







})();