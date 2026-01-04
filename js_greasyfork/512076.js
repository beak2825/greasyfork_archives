// ==UserScript==
// @name         byw漫畫下載
// @version      2025-10-28
// @namespace    mccranky83.github.io
// @description  下載搬運網單行本漫畫
// @author       Mccranky83
// @match        http://*/plugin.php?id=jameson_manhua*a=bofang*kuid*
// @match        http://*/plugin.php?id=jameson_manhua*kuid*a=bofang*
// @match        https://*/plugin.php?id=jameson_manhua*a=bofang*kuid*
// @match        https://*/plugin.php?id=jameson_manhua*kuid*a=bofang*
// @match        https://mangatoto.com/title/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=antbyw.com
// @grant        GM_xmlhttpRequest
// @connect      zerobywb.com
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/512076/byw%E6%BC%AB%E7%95%AB%E4%B8%8B%E8%BC%89.user.js
// @updateURL https://update.greasyfork.org/scripts/512076/byw%E6%BC%AB%E7%95%AB%E4%B8%8B%E8%BC%89.meta.js
// ==/UserScript==
(() => {
  var t = {
      145: (t, e, n) => {
        "use strict";
        n.d(e, { A: () => c });
        var r = n(601),
          o = n.n(r),
          i = n(314),
          a = n.n(i)()(o());
        a.push([
          t.id,
          "#cursor-pointer,\n#vertical-line,\n#horizontal-line {\n  position: fixed;\n  z-index: 2000;\n  pointer-events: none;\n  display: none;\n}\n#cursor-pointer {\n  --cursor-diameter: 20px;\n  width: var(--cursor-diameter);\n  height: var(--cursor-diameter);\n  border-radius: 50%;\n  background-color: blue;\n  opacity: 0.5;\n}\n#vertical-line,\n#horizontal-line {\n  background-color: blue;\n  opacity: 0.5;\n}\n#vertical-line {\n  width: 1px;\n  top: 0;\n  bottom: 0;\n  left: 50%;\n  transform: translateX(-50%);\n  background: linear-gradient(blue 50%, transparent 50%);\n  background-size: 100% 20px;\n  animation: moveDown 1s linear infinite;\n}\n#horizontal-line {\n  height: 1px;\n  left: 0;\n  right: 0;\n  top: 50%;\n  transform: translateY(-50%);\n  background: linear-gradient(to right, blue 50%, transparent 50%);\n  background-size: 20px 100%;\n  animation: moveRight 1s linear infinite;\n}\n@keyframes moveDown {\n  0% {\n    background-position: 0 0;\n  }\n  100% {\n    background-position: 0 20px;\n  }\n}\n@keyframes moveRight {\n  0% {\n    background-position: 0 0;\n  }\n  100% {\n    background-position: 20px 0;\n  }\n}\n",
          "",
        ]);
        const c = a;
      },
      282: (t, e, n) => {
        "use strict";
        n.d(e, { A: () => c });
        var r = n(601),
          o = n.n(r),
          i = n(314),
          a = n.n(i)()(o());
        a.push([
          t.id,
          "#injected span {\n  padding: 2px 8px;\n}\n#injected select {\n  width: 80px;\n  height: 30px;\n  line-height: 30px;\n  border-radius: 2px;\n}\n.grid-container {\n  display: grid;\n  grid-template-columns: repeat(3, 1fr);\n  gap: 2%;\n}\n.grid-container .uk-button {\n  display: flex;\n  justify-content: center;\n  align-items: center;\n  height: 5vh;\n  text-align: center;\n  padding: 2%;\n  box-sizing: border-box;\n  white-space: nowrap;\n  overflow: hidden;\n  text-overflow: ellipsis;\n}\n.range-container,\n.tooltip-container {\n  position: relative;\n  display: inline-block;\n  margin-top: 10px;\n}\n.tooltip-button {\n  width: 20px;\n  height: 20px;\n  border-radius: 50%;\n  background-color: #007bff;\n  color: white;\n  border: none;\n  font-size: 10px;\n  text-align: center;\n  line-height: 20px;\n  cursor: pointer;\n  display: inline-flex;\n  align-items: center;\n  justify-content: center;\n}\n.tooltip-text {\n  visibility: hidden;\n  width: 250px;\n  background-color: #555;\n  color: #fff;\n  text-align: left;\n  border-radius: 5px;\n  padding: 10px;\n  position: absolute;\n  z-index: 1500;\n  right: 0%;\n  bottom: 100%;\n  white-space: normal;\n}\n.tooltip-button:hover + .tooltip-text {\n  visibility: visible;\n  opacity: 1;\n}\n.tooltip-text p {\n  margin: 0 0 10px;\n}\n.tooltip-text p:last-child {\n  margin-bottom: 0;\n}\n",
          "",
        ]);
        const c = a;
      },
      821: (t, e, n) => {
        "use strict";
        n.d(e, { A: () => c });
        var r = n(601),
          o = n.n(r),
          i = n(314),
          a = n.n(i)()(o());
        a.push([
          t.id,
          "#dl-bar {\n  border: 1px solid black;\n  height: 20px;\n  width: 400px;\n  display: none;\n  position: relative;\n  background-color: #f3f3f3;\n  overflow: hidden;\n}\n#dl-progress-failed {\n  height: 100%;\n  width: 0%;\n  background-color: red;\n  position: absolute;\n  transition: width 0.5s ease;\n}\n#dl-progress {\n  height: 100%;\n  width: 0%;\n  background-color: green;\n  position: absolute;\n  transition: width 0.5s ease;\n}\n#dl-info {\n  position: absolute;\n  top: 50%;\n  left: 50%;\n  transform: translate(-50%, -50%);\n  font-size: 12px;\n  z-index: 999999;\n  color: black;\n}\n#dl-percentage-container {\n  display: none;\n  position: fixed !important;\n  z-index: 999999 !important;\n  right: 0 !important;\n  bottom: 0 !important;\n}\n#dl-percentage-container > a {\n  display: flex !important;\n  position: relative !important;\n  min-width: 1vh !important;\n  min-height: 1vh !important;\n  max-width: max-content !important;\n  max-height: max-content !important;\n  align-items: center !important;\n  justify-content: center !important;\n  border: 0.2vh solid black !important;\n  border-radius: 0.4vh !important;\n  padding: 0.6vh !important;\n  margin: 1.2vh !important;\n  margin-left: auto !important;\n  font-weight: bold !important;\n  font-size: 1.9vh !important;\n  text-decoration: none !important;\n  cursor: pointer !important;\n  user-select: none !important;\n  transition:\n    top 0.05s ease-out,\n    right 0.05s ease-out,\n    bottom 0.05s ease-out,\n    left 0.05s ease-out,\n    box-shadow 0.05s ease-out !important;\n  background-color: white;\n  color: black;\n}\n#dl-percentage-container > a.disabled {\n  pointer-events: none !important;\n  opacity: 0.5 !important;\n}\n#dl-percentage-container > a:hover {\n  filter: brightness(90%);\n}\n#dl-percentage-container > a:active {\n  filter: brightness(75%);\n}\n#dl-percentage-container > a.animate-click {\n  bottom: 0vh;\n  right: 0vh;\n  box-shadow:\n    black 0.05vh 0.05vh,\n    black 0.1vh 0.1vh,\n    black 0.15vh 0.15vh,\n    black 0.2vh 0.2vh,\n    black 0.25vh 0.25vh,\n    black 0.3vh 0.3vh,\n    black 0.35vh 0.35vh,\n    black 0.4vh 0.4vh;\n}\n#dl-percentage-container > a.animate-click:active {\n  bottom: -0.4vh;\n  right: -0.4vh;\n  box-shadow: none;\n}\n",
          "",
        ]);
        const c = a;
      },
      887: (t, e, n) => {
        "use strict";
        n.d(e, { A: () => c });
        var r = n(601),
          o = n.n(r),
          i = n(314),
          a = n.n(i)()(o());
        a.push([
          t.id,
          "#sidebar-open-btn {\n  --sidebar-diameter: 50px;\n  position: fixed;\n  top: 50%;\n  right: 0%;\n  width: var(--sidebar-diameter);\n  height: var(--sidebar-diameter);\n  font-size: 16px;\n  border-radius: 50%;\n  background-color: #007bff;\n  color: white;\n  border: none;\n  cursor: pointer;\n  z-index: 1000;\n  display: flex;\n  align-items: center;\n  justify-content: center;\n  text-overflow: ellipsis;\n  white-space: nowrap;\n}\n#sidebar-open-btn.hidden {\n  display: none;\n}\n#uk-sidebar {\n  position: fixed;\n  bottom: 0;\n  right: -100%;\n  width: 30%;\n  max-width: 50%;\n  height: 60%;\n  background-color: white;\n  color: black;\n  padding: 20px;\n  transition: right 0.3s ease;\n  box-shadow: -2px 0 5px rgba(0, 0, 0, 0.5);\n  z-index: 1000;\n  display: flex;\n  flex-direction: column;\n  justify-content: center;\n  align-items: center;\n}\n.abort-dialog a {\n  color: #cc0000;\n  cursor: pointer;\n}\n#uk-sidebar .abort-dialog {\n  width: 100%;\n  background: rgba(0, 0, 0, 0.75);\n  color: white;\n  padding: 10px;\n  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);\n  text-align: center;\n  position: absolute;\n  top: 0;\n  left: 0;\n  border: 1px solid black;\n  opacity: 0;\n  transition:\n    opacity 0.5s ease,\n    bottom 0.5s ease;\n  white-space: nowrap;\n  overflow: hidden;\n  text-overflow: ellipsis;\n  display: inline-block;\n  max-width: 100%;\n}\n#uk-sidebar:hover .abort-dialog {\n  opacity: 1;\n}\n#uk-sidebar .titlebar {\n  font-size: 25px;\n  margin-bottom: auto;\n  margin-top: 50px;\n}\n#uk-sidebar .uk-container {\n  margin-top: 10%;\n  flex-grow: 1;\n}\n#uk-sidebar.active {\n  right: 0%;\n}\n#sidebar-close-btn {\n  position: absolute;\n  top: 40px;\n  right: 20px;\n  font-size: 30px;\n  background: none;\n  border: none;\n  color: black;\n  cursor: pointer;\n}\n",
          "",
        ]);
        const c = a;
      },
      314: (t) => {
        "use strict";
        t.exports = function (t) {
          var e = [];
          return (
            (e.toString = function () {
              return this.map(function (e) {
                var n = "",
                  r = void 0 !== e[5];
                return (
                  e[4] && (n += "@supports (".concat(e[4], ") {")),
                  e[2] && (n += "@media ".concat(e[2], " {")),
                  r &&
                    (n += "@layer".concat(
                      e[5].length > 0 ? " ".concat(e[5]) : "",
                      " {",
                    )),
                  (n += t(e)),
                  r && (n += "}"),
                  e[2] && (n += "}"),
                  e[4] && (n += "}"),
                  n
                );
              }).join("");
            }),
            (e.i = function (t, n, r, o, i) {
              "string" == typeof t && (t = [[null, t, void 0]]);
              var a = {};
              if (r)
                for (var c = 0; c < this.length; c++) {
                  var s = this[c][0];
                  null != s && (a[s] = !0);
                }
              for (var u = 0; u < t.length; u++) {
                var l = [].concat(t[u]);
                (r && a[l[0]]) ||
                  (void 0 !== i &&
                    (void 0 === l[5] ||
                      (l[1] = "@layer"
                        .concat(l[5].length > 0 ? " ".concat(l[5]) : "", " {")
                        .concat(l[1], "}")),
                    (l[5] = i)),
                  n &&
                    (l[2]
                      ? ((l[1] = "@media "
                          .concat(l[2], " {")
                          .concat(l[1], "}")),
                        (l[2] = n))
                      : (l[2] = n)),
                  o &&
                    (l[4]
                      ? ((l[1] = "@supports ("
                          .concat(l[4], ") {")
                          .concat(l[1], "}")),
                        (l[4] = o))
                      : (l[4] = "".concat(o))),
                  e.push(l));
              }
            }),
            e
          );
        };
      },
      601: (t) => {
        "use strict";
        t.exports = function (t) {
          return t[1];
        };
      },
      213: function (t, e, n) {
        var r, o, i;
        ((o = []),
          void 0 ===
            (i =
              "function" ==
              typeof (r = function () {
                "use strict";
                function e(t, e) {
                  return (
                    void 0 === e
                      ? (e = { autoBom: !1 })
                      : "object" != typeof e &&
                        (console.warn(
                          "Deprecated: Expected third argument to be a object",
                        ),
                        (e = { autoBom: !e })),
                    e.autoBom &&
                    /^\s*(?:text\/\S*|application\/xml|\S*\/\S*\+xml)\s*;.*charset\s*=\s*utf-8/i.test(
                      t.type,
                    )
                      ? new Blob(["\ufeff", t], { type: t.type })
                      : t
                  );
                }
                function r(t, e, n) {
                  var r = new XMLHttpRequest();
                  (r.open("GET", t),
                    (r.responseType = "blob"),
                    (r.onload = function () {
                      s(r.response, e, n);
                    }),
                    (r.onerror = function () {
                      console.error("could not download file");
                    }),
                    r.send());
                }
                function o(t) {
                  var e = new XMLHttpRequest();
                  e.open("HEAD", t, !1);
                  try {
                    e.send();
                  } catch (t) {}
                  return 200 <= e.status && 299 >= e.status;
                }
                function i(t) {
                  try {
                    t.dispatchEvent(new MouseEvent("click"));
                  } catch (n) {
                    var e = document.createEvent("MouseEvents");
                    (e.initMouseEvent(
                      "click",
                      !0,
                      !0,
                      window,
                      0,
                      0,
                      0,
                      80,
                      20,
                      !1,
                      !1,
                      !1,
                      !1,
                      0,
                      null,
                    ),
                      t.dispatchEvent(e));
                  }
                }
                var a =
                    "object" == typeof window && window.window === window
                      ? window
                      : "object" == typeof self && self.self === self
                        ? self
                        : "object" == typeof n.g && n.g.global === n.g
                          ? n.g
                          : void 0,
                  c =
                    a.navigator &&
                    /Macintosh/.test(navigator.userAgent) &&
                    /AppleWebKit/.test(navigator.userAgent) &&
                    !/Safari/.test(navigator.userAgent),
                  s =
                    a.saveAs ||
                    ("object" != typeof window || window !== a
                      ? function () {}
                      : "download" in HTMLAnchorElement.prototype && !c
                        ? function (t, e, n) {
                            var c = a.URL || a.webkitURL,
                              s = document.createElement("a");
                            ((e = e || t.name || "download"),
                              (s.download = e),
                              (s.rel = "noopener"),
                              "string" == typeof t
                                ? ((s.href = t),
                                  s.origin === location.origin
                                    ? i(s)
                                    : o(s.href)
                                      ? r(t, e, n)
                                      : i(s, (s.target = "_blank")))
                                : ((s.href = c.createObjectURL(t)),
                                  setTimeout(function () {
                                    c.revokeObjectURL(s.href);
                                  }, 4e4),
                                  setTimeout(function () {
                                    i(s);
                                  }, 0)));
                          }
                        : "msSaveOrOpenBlob" in navigator
                          ? function (t, n, a) {
                              if (
                                ((n = n || t.name || "download"),
                                "string" != typeof t)
                              )
                                navigator.msSaveOrOpenBlob(e(t, a), n);
                              else if (o(t)) r(t, n, a);
                              else {
                                var c = document.createElement("a");
                                ((c.href = t),
                                  (c.target = "_blank"),
                                  setTimeout(function () {
                                    i(c);
                                  }));
                              }
                            }
                          : function (t, e, n, o) {
                              if (
                                ((o = o || open("", "_blank")) &&
                                  (o.document.title =
                                    o.document.body.innerText =
                                      "downloading..."),
                                "string" == typeof t)
                              )
                                return r(t, e, n);
                              var i = "application/octet-stream" === t.type,
                                s =
                                  /constructor/i.test(a.HTMLElement) ||
                                  a.safari,
                                u = /CriOS\/[\d]+/.test(navigator.userAgent);
                              if (
                                (u || (i && s) || c) &&
                                "undefined" != typeof FileReader
                              ) {
                                var l = new FileReader();
                                ((l.onloadend = function () {
                                  var t = l.result;
                                  ((t = u
                                    ? t
                                    : t.replace(
                                        /^data:[^;]*;/,
                                        "data:attachment/file;",
                                      )),
                                    o ? (o.location.href = t) : (location = t),
                                    (o = null));
                                }),
                                  l.readAsDataURL(t));
                              } else {
                                var f = a.URL || a.webkitURL,
                                  p = f.createObjectURL(t);
                                (o ? (o.location = p) : (location.href = p),
                                  (o = null),
                                  setTimeout(function () {
                                    f.revokeObjectURL(p);
                                  }, 4e4));
                              }
                            });
                ((a.saveAs = s.saveAs = s), (t.exports = s));
              })
                ? r.apply(e, o)
                : r) || (t.exports = i));
      },
      692: function (t, e) {
        var n;
        !(function (e, n) {
          "use strict";
          "object" == typeof t.exports
            ? (t.exports = e.document
                ? n(e, !0)
                : function (t) {
                    if (!t.document)
                      throw new Error(
                        "jQuery requires a window with a document",
                      );
                    return n(t);
                  })
            : n(e);
        })("undefined" != typeof window ? window : this, function (r, o) {
          "use strict";
          var i = [],
            a = Object.getPrototypeOf,
            c = i.slice,
            s = i.flat
              ? function (t) {
                  return i.flat.call(t);
                }
              : function (t) {
                  return i.concat.apply([], t);
                },
            u = i.push,
            l = i.indexOf,
            f = {},
            p = f.toString,
            h = f.hasOwnProperty,
            d = h.toString,
            v = d.call(Object),
            y = {},
            g = function (t) {
              return (
                "function" == typeof t &&
                "number" != typeof t.nodeType &&
                "function" != typeof t.item
              );
            },
            m = function (t) {
              return null != t && t === t.window;
            },
            b = r.document,
            x = { type: !0, src: !0, nonce: !0, noModule: !0 };
          function w(t, e, n) {
            var r,
              o,
              i = (n = n || b).createElement("script");
            if (((i.text = t), e))
              for (r in x)
                (o = e[r] || (e.getAttribute && e.getAttribute(r))) &&
                  i.setAttribute(r, o);
            n.head.appendChild(i).parentNode.removeChild(i);
          }
          function k(t) {
            return null == t
              ? t + ""
              : "object" == typeof t || "function" == typeof t
                ? f[p.call(t)] || "object"
                : typeof t;
          }
          var E = "3.7.1",
            j = /HTML$/i,
            T = function (t, e) {
              return new T.fn.init(t, e);
            };
          function L(t) {
            var e = !!t && "length" in t && t.length,
              n = k(t);
            return (
              !g(t) &&
              !m(t) &&
              ("array" === n ||
                0 === e ||
                ("number" == typeof e && e > 0 && e - 1 in t))
            );
          }
          function S(t, e) {
            return t.nodeName && t.nodeName.toLowerCase() === e.toLowerCase();
          }
          ((T.fn = T.prototype =
            {
              jquery: E,
              constructor: T,
              length: 0,
              toArray: function () {
                return c.call(this);
              },
              get: function (t) {
                return null == t
                  ? c.call(this)
                  : t < 0
                    ? this[t + this.length]
                    : this[t];
              },
              pushStack: function (t) {
                var e = T.merge(this.constructor(), t);
                return ((e.prevObject = this), e);
              },
              each: function (t) {
                return T.each(this, t);
              },
              map: function (t) {
                return this.pushStack(
                  T.map(this, function (e, n) {
                    return t.call(e, n, e);
                  }),
                );
              },
              slice: function () {
                return this.pushStack(c.apply(this, arguments));
              },
              first: function () {
                return this.eq(0);
              },
              last: function () {
                return this.eq(-1);
              },
              even: function () {
                return this.pushStack(
                  T.grep(this, function (t, e) {
                    return (e + 1) % 2;
                  }),
                );
              },
              odd: function () {
                return this.pushStack(
                  T.grep(this, function (t, e) {
                    return e % 2;
                  }),
                );
              },
              eq: function (t) {
                var e = this.length,
                  n = +t + (t < 0 ? e : 0);
                return this.pushStack(n >= 0 && n < e ? [this[n]] : []);
              },
              end: function () {
                return this.prevObject || this.constructor();
              },
              push: u,
              sort: i.sort,
              splice: i.splice,
            }),
            (T.extend = T.fn.extend =
              function () {
                var t,
                  e,
                  n,
                  r,
                  o,
                  i,
                  a = arguments[0] || {},
                  c = 1,
                  s = arguments.length,
                  u = !1;
                for (
                  "boolean" == typeof a &&
                    ((u = a), (a = arguments[c] || {}), c++),
                    "object" == typeof a || g(a) || (a = {}),
                    c === s && ((a = this), c--);
                  c < s;
                  c++
                )
                  if (null != (t = arguments[c]))
                    for (e in t)
                      ((r = t[e]),
                        "__proto__" !== e &&
                          a !== r &&
                          (u &&
                          r &&
                          (T.isPlainObject(r) || (o = Array.isArray(r)))
                            ? ((n = a[e]),
                              (i =
                                o && !Array.isArray(n)
                                  ? []
                                  : o || T.isPlainObject(n)
                                    ? n
                                    : {}),
                              (o = !1),
                              (a[e] = T.extend(u, i, r)))
                            : void 0 !== r && (a[e] = r)));
                return a;
              }),
            T.extend({
              expando: "jQuery" + (E + Math.random()).replace(/\D/g, ""),
              isReady: !0,
              error: function (t) {
                throw new Error(t);
              },
              noop: function () {},
              isPlainObject: function (t) {
                var e, n;
                return (
                  !(!t || "[object Object]" !== p.call(t)) &&
                  (!(e = a(t)) ||
                    ("function" ==
                      typeof (n = h.call(e, "constructor") && e.constructor) &&
                      d.call(n) === v))
                );
              },
              isEmptyObject: function (t) {
                var e;
                for (e in t) return !1;
                return !0;
              },
              globalEval: function (t, e, n) {
                w(t, { nonce: e && e.nonce }, n);
              },
              each: function (t, e) {
                var n,
                  r = 0;
                if (L(t))
                  for (
                    n = t.length;
                    r < n && !1 !== e.call(t[r], r, t[r]);
                    r++
                  );
                else for (r in t) if (!1 === e.call(t[r], r, t[r])) break;
                return t;
              },
              text: function (t) {
                var e,
                  n = "",
                  r = 0,
                  o = t.nodeType;
                if (!o) for (; (e = t[r++]); ) n += T.text(e);
                return 1 === o || 11 === o
                  ? t.textContent
                  : 9 === o
                    ? t.documentElement.textContent
                    : 3 === o || 4 === o
                      ? t.nodeValue
                      : n;
              },
              makeArray: function (t, e) {
                var n = e || [];
                return (
                  null != t &&
                    (L(Object(t))
                      ? T.merge(n, "string" == typeof t ? [t] : t)
                      : u.call(n, t)),
                  n
                );
              },
              inArray: function (t, e, n) {
                return null == e ? -1 : l.call(e, t, n);
              },
              isXMLDoc: function (t) {
                var e = t && t.namespaceURI,
                  n = t && (t.ownerDocument || t).documentElement;
                return !j.test(e || (n && n.nodeName) || "HTML");
              },
              merge: function (t, e) {
                for (var n = +e.length, r = 0, o = t.length; r < n; r++)
                  t[o++] = e[r];
                return ((t.length = o), t);
              },
              grep: function (t, e, n) {
                for (var r = [], o = 0, i = t.length, a = !n; o < i; o++)
                  !e(t[o], o) !== a && r.push(t[o]);
                return r;
              },
              map: function (t, e, n) {
                var r,
                  o,
                  i = 0,
                  a = [];
                if (L(t))
                  for (r = t.length; i < r; i++)
                    null != (o = e(t[i], i, n)) && a.push(o);
                else for (i in t) null != (o = e(t[i], i, n)) && a.push(o);
                return s(a);
              },
              guid: 1,
              support: y,
            }),
            "function" == typeof Symbol &&
              (T.fn[Symbol.iterator] = i[Symbol.iterator]),
            T.each(
              "Boolean Number String Function Array Date RegExp Object Error Symbol".split(
                " ",
              ),
              function (t, e) {
                f["[object " + e + "]"] = e.toLowerCase();
              },
            ));
          var A = i.pop,
            O = i.sort,
            C = i.splice,
            _ = "[\\x20\\t\\r\\n\\f]",
            N = new RegExp(
              "^" + _ + "+|((?:^|[^\\\\])(?:\\\\.)*)" + _ + "+$",
              "g",
            );
          T.contains = function (t, e) {
            var n = e && e.parentNode;
            return (
              t === n ||
              !(
                !n ||
                1 !== n.nodeType ||
                !(t.contains
                  ? t.contains(n)
                  : t.compareDocumentPosition &&
                    16 & t.compareDocumentPosition(n))
              )
            );
          };
          var P = /([\0-\x1f\x7f]|^-?\d)|^-$|[^\x80-\uFFFF\w-]/g;
          function D(t, e) {
            return e
              ? "\0" === t
                ? "�"
                : t.slice(0, -1) +
                  "\\" +
                  t.charCodeAt(t.length - 1).toString(16) +
                  " "
              : "\\" + t;
          }
          T.escapeSelector = function (t) {
            return (t + "").replace(P, D);
          };
          var q = b,
            H = u;
          !(function () {
            var t,
              e,
              n,
              o,
              a,
              s,
              u,
              f,
              p,
              d,
              v = H,
              g = T.expando,
              m = 0,
              b = 0,
              x = tt(),
              w = tt(),
              k = tt(),
              E = tt(),
              j = function (t, e) {
                return (t === e && (a = !0), 0);
              },
              L =
                "checked|selected|async|autofocus|autoplay|controls|defer|disabled|hidden|ismap|loop|multiple|open|readonly|required|scoped",
              P =
                "(?:\\\\[\\da-fA-F]{1,6}" +
                _ +
                "?|\\\\[^\\r\\n\\f]|[\\w-]|[^\0-\\x7f])+",
              D =
                "\\[" +
                _ +
                "*(" +
                P +
                ")(?:" +
                _ +
                "*([*^$|!~]?=)" +
                _ +
                "*(?:'((?:\\\\.|[^\\\\'])*)'|\"((?:\\\\.|[^\\\\\"])*)\"|(" +
                P +
                "))|)" +
                _ +
                "*\\]",
              R =
                ":(" +
                P +
                ")(?:\\((('((?:\\\\.|[^\\\\'])*)'|\"((?:\\\\.|[^\\\\\"])*)\")|((?:\\\\.|[^\\\\()[\\]]|" +
                D +
                ")*)|.*)\\)|)",
              I = new RegExp(_ + "+", "g"),
              F = new RegExp("^" + _ + "*," + _ + "*"),
              M = new RegExp("^" + _ + "*([>+~]|" + _ + ")" + _ + "*"),
              G = new RegExp(_ + "|>"),
              z = new RegExp(R),
              W = new RegExp("^" + P + "$"),
              B = {
                ID: new RegExp("^#(" + P + ")"),
                CLASS: new RegExp("^\\.(" + P + ")"),
                TAG: new RegExp("^(" + P + "|[*])"),
                ATTR: new RegExp("^" + D),
                PSEUDO: new RegExp("^" + R),
                CHILD: new RegExp(
                  "^:(only|first|last|nth|nth-last)-(child|of-type)(?:\\(" +
                    _ +
                    "*(even|odd|(([+-]|)(\\d*)n|)" +
                    _ +
                    "*(?:([+-]|)" +
                    _ +
                    "*(\\d+)|))" +
                    _ +
                    "*\\)|)",
                  "i",
                ),
                bool: new RegExp("^(?:" + L + ")$", "i"),
                needsContext: new RegExp(
                  "^" +
                    _ +
                    "*[>+~]|:(even|odd|eq|gt|lt|nth|first|last)(?:\\(" +
                    _ +
                    "*((?:-\\d)?\\d*)" +
                    _ +
                    "*\\)|)(?=[^-]|$)",
                  "i",
                ),
              },
              $ = /^(?:input|select|textarea|button)$/i,
              U = /^h\d$/i,
              X = /^(?:#([\w-]+)|(\w+)|\.([\w-]+))$/,
              Y = /[+~]/,
              V = new RegExp(
                "\\\\[\\da-fA-F]{1,6}" + _ + "?|\\\\([^\\r\\n\\f])",
                "g",
              ),
              J = function (t, e) {
                var n = "0x" + t.slice(1) - 65536;
                return (
                  e ||
                  (n < 0
                    ? String.fromCharCode(n + 65536)
                    : String.fromCharCode(
                        (n >> 10) | 55296,
                        (1023 & n) | 56320,
                      ))
                );
              },
              Q = function () {
                st();
              },
              K = pt(
                function (t) {
                  return !0 === t.disabled && S(t, "fieldset");
                },
                { dir: "parentNode", next: "legend" },
              );
            try {
              (v.apply((i = c.call(q.childNodes)), q.childNodes),
                i[q.childNodes.length].nodeType);
            } catch (t) {
              v = {
                apply: function (t, e) {
                  H.apply(t, c.call(e));
                },
                call: function (t) {
                  H.apply(t, c.call(arguments, 1));
                },
              };
            }
            function Z(t, e, n, r) {
              var o,
                i,
                a,
                c,
                u,
                l,
                h,
                d = e && e.ownerDocument,
                m = e ? e.nodeType : 9;
              if (
                ((n = n || []),
                "string" != typeof t || !t || (1 !== m && 9 !== m && 11 !== m))
              )
                return n;
              if (!r && (st(e), (e = e || s), f)) {
                if (11 !== m && (u = X.exec(t)))
                  if ((o = u[1])) {
                    if (9 === m) {
                      if (!(a = e.getElementById(o))) return n;
                      if (a.id === o) return (v.call(n, a), n);
                    } else if (
                      d &&
                      (a = d.getElementById(o)) &&
                      Z.contains(e, a) &&
                      a.id === o
                    )
                      return (v.call(n, a), n);
                  } else {
                    if (u[2]) return (v.apply(n, e.getElementsByTagName(t)), n);
                    if ((o = u[3]) && e.getElementsByClassName)
                      return (v.apply(n, e.getElementsByClassName(o)), n);
                  }
                if (!(E[t + " "] || (p && p.test(t)))) {
                  if (((h = t), (d = e), 1 === m && (G.test(t) || M.test(t)))) {
                    for (
                      ((d = (Y.test(t) && ct(e.parentNode)) || e) == e &&
                        y.scope) ||
                        ((c = e.getAttribute("id"))
                          ? (c = T.escapeSelector(c))
                          : e.setAttribute("id", (c = g))),
                        i = (l = lt(t)).length;
                      i--;

                    )
                      l[i] = (c ? "#" + c : ":scope") + " " + ft(l[i]);
                    h = l.join(",");
                  }
                  try {
                    return (v.apply(n, d.querySelectorAll(h)), n);
                  } catch (e) {
                    E(t, !0);
                  } finally {
                    c === g && e.removeAttribute("id");
                  }
                }
              }
              return mt(t.replace(N, "$1"), e, n, r);
            }
            function tt() {
              var t = [];
              return function n(r, o) {
                return (
                  t.push(r + " ") > e.cacheLength && delete n[t.shift()],
                  (n[r + " "] = o)
                );
              };
            }
            function et(t) {
              return ((t[g] = !0), t);
            }
            function nt(t) {
              var e = s.createElement("fieldset");
              try {
                return !!t(e);
              } catch (t) {
                return !1;
              } finally {
                (e.parentNode && e.parentNode.removeChild(e), (e = null));
              }
            }
            function rt(t) {
              return function (e) {
                return S(e, "input") && e.type === t;
              };
            }
            function ot(t) {
              return function (e) {
                return (S(e, "input") || S(e, "button")) && e.type === t;
              };
            }
            function it(t) {
              return function (e) {
                return "form" in e
                  ? e.parentNode && !1 === e.disabled
                    ? "label" in e
                      ? "label" in e.parentNode
                        ? e.parentNode.disabled === t
                        : e.disabled === t
                      : e.isDisabled === t ||
                        (e.isDisabled !== !t && K(e) === t)
                    : e.disabled === t
                  : "label" in e && e.disabled === t;
              };
            }
            function at(t) {
              return et(function (e) {
                return (
                  (e = +e),
                  et(function (n, r) {
                    for (var o, i = t([], n.length, e), a = i.length; a--; )
                      n[(o = i[a])] && (n[o] = !(r[o] = n[o]));
                  })
                );
              });
            }
            function ct(t) {
              return t && void 0 !== t.getElementsByTagName && t;
            }
            function st(t) {
              var n,
                r = t ? t.ownerDocument || t : q;
              return r != s && 9 === r.nodeType && r.documentElement
                ? ((u = (s = r).documentElement),
                  (f = !T.isXMLDoc(s)),
                  (d =
                    u.matches ||
                    u.webkitMatchesSelector ||
                    u.msMatchesSelector),
                  u.msMatchesSelector &&
                    q != s &&
                    (n = s.defaultView) &&
                    n.top !== n &&
                    n.addEventListener("unload", Q),
                  (y.getById = nt(function (t) {
                    return (
                      (u.appendChild(t).id = T.expando),
                      !s.getElementsByName ||
                        !s.getElementsByName(T.expando).length
                    );
                  })),
                  (y.disconnectedMatch = nt(function (t) {
                    return d.call(t, "*");
                  })),
                  (y.scope = nt(function () {
                    return s.querySelectorAll(":scope");
                  })),
                  (y.cssHas = nt(function () {
                    try {
                      return (s.querySelector(":has(*,:jqfake)"), !1);
                    } catch (t) {
                      return !0;
                    }
                  })),
                  y.getById
                    ? ((e.filter.ID = function (t) {
                        var e = t.replace(V, J);
                        return function (t) {
                          return t.getAttribute("id") === e;
                        };
                      }),
                      (e.find.ID = function (t, e) {
                        if (void 0 !== e.getElementById && f) {
                          var n = e.getElementById(t);
                          return n ? [n] : [];
                        }
                      }))
                    : ((e.filter.ID = function (t) {
                        var e = t.replace(V, J);
                        return function (t) {
                          var n =
                            void 0 !== t.getAttributeNode &&
                            t.getAttributeNode("id");
                          return n && n.value === e;
                        };
                      }),
                      (e.find.ID = function (t, e) {
                        if (void 0 !== e.getElementById && f) {
                          var n,
                            r,
                            o,
                            i = e.getElementById(t);
                          if (i) {
                            if ((n = i.getAttributeNode("id")) && n.value === t)
                              return [i];
                            for (
                              o = e.getElementsByName(t), r = 0;
                              (i = o[r++]);

                            )
                              if (
                                (n = i.getAttributeNode("id")) &&
                                n.value === t
                              )
                                return [i];
                          }
                          return [];
                        }
                      })),
                  (e.find.TAG = function (t, e) {
                    return void 0 !== e.getElementsByTagName
                      ? e.getElementsByTagName(t)
                      : e.querySelectorAll(t);
                  }),
                  (e.find.CLASS = function (t, e) {
                    if (void 0 !== e.getElementsByClassName && f)
                      return e.getElementsByClassName(t);
                  }),
                  (p = []),
                  nt(function (t) {
                    var e;
                    ((u.appendChild(t).innerHTML =
                      "<a id='" +
                      g +
                      "' href='' disabled='disabled'></a><select id='" +
                      g +
                      "-\r\\' disabled='disabled'><option selected=''></option></select>"),
                      t.querySelectorAll("[selected]").length ||
                        p.push("\\[" + _ + "*(?:value|" + L + ")"),
                      t.querySelectorAll("[id~=" + g + "-]").length ||
                        p.push("~="),
                      t.querySelectorAll("a#" + g + "+*").length ||
                        p.push(".#.+[+~]"),
                      t.querySelectorAll(":checked").length ||
                        p.push(":checked"),
                      (e = s.createElement("input")).setAttribute(
                        "type",
                        "hidden",
                      ),
                      t.appendChild(e).setAttribute("name", "D"),
                      (u.appendChild(t).disabled = !0),
                      2 !== t.querySelectorAll(":disabled").length &&
                        p.push(":enabled", ":disabled"),
                      (e = s.createElement("input")).setAttribute("name", ""),
                      t.appendChild(e),
                      t.querySelectorAll("[name='']").length ||
                        p.push(
                          "\\[" + _ + "*name" + _ + "*=" + _ + "*(?:''|\"\")",
                        ));
                  }),
                  y.cssHas || p.push(":has"),
                  (p = p.length && new RegExp(p.join("|"))),
                  (j = function (t, e) {
                    if (t === e) return ((a = !0), 0);
                    var n =
                      !t.compareDocumentPosition - !e.compareDocumentPosition;
                    return (
                      n ||
                      (1 &
                        (n =
                          (t.ownerDocument || t) == (e.ownerDocument || e)
                            ? t.compareDocumentPosition(e)
                            : 1) ||
                      (!y.sortDetached && e.compareDocumentPosition(t) === n)
                        ? t === s || (t.ownerDocument == q && Z.contains(q, t))
                          ? -1
                          : e === s ||
                              (e.ownerDocument == q && Z.contains(q, e))
                            ? 1
                            : o
                              ? l.call(o, t) - l.call(o, e)
                              : 0
                        : 4 & n
                          ? -1
                          : 1)
                    );
                  }),
                  s)
                : s;
            }
            for (t in ((Z.matches = function (t, e) {
              return Z(t, null, null, e);
            }),
            (Z.matchesSelector = function (t, e) {
              if ((st(t), f && !E[e + " "] && (!p || !p.test(e))))
                try {
                  var n = d.call(t, e);
                  if (
                    n ||
                    y.disconnectedMatch ||
                    (t.document && 11 !== t.document.nodeType)
                  )
                    return n;
                } catch (t) {
                  E(e, !0);
                }
              return Z(e, s, null, [t]).length > 0;
            }),
            (Z.contains = function (t, e) {
              return ((t.ownerDocument || t) != s && st(t), T.contains(t, e));
            }),
            (Z.attr = function (t, n) {
              (t.ownerDocument || t) != s && st(t);
              var r = e.attrHandle[n.toLowerCase()],
                o =
                  r && h.call(e.attrHandle, n.toLowerCase())
                    ? r(t, n, !f)
                    : void 0;
              return void 0 !== o ? o : t.getAttribute(n);
            }),
            (Z.error = function (t) {
              throw new Error("Syntax error, unrecognized expression: " + t);
            }),
            (T.uniqueSort = function (t) {
              var e,
                n = [],
                r = 0,
                i = 0;
              if (
                ((a = !y.sortStable),
                (o = !y.sortStable && c.call(t, 0)),
                O.call(t, j),
                a)
              ) {
                for (; (e = t[i++]); ) e === t[i] && (r = n.push(i));
                for (; r--; ) C.call(t, n[r], 1);
              }
              return ((o = null), t);
            }),
            (T.fn.uniqueSort = function () {
              return this.pushStack(T.uniqueSort(c.apply(this)));
            }),
            (e = T.expr =
              {
                cacheLength: 50,
                createPseudo: et,
                match: B,
                attrHandle: {},
                find: {},
                relative: {
                  ">": { dir: "parentNode", first: !0 },
                  " ": { dir: "parentNode" },
                  "+": { dir: "previousSibling", first: !0 },
                  "~": { dir: "previousSibling" },
                },
                preFilter: {
                  ATTR: function (t) {
                    return (
                      (t[1] = t[1].replace(V, J)),
                      (t[3] = (t[3] || t[4] || t[5] || "").replace(V, J)),
                      "~=" === t[2] && (t[3] = " " + t[3] + " "),
                      t.slice(0, 4)
                    );
                  },
                  CHILD: function (t) {
                    return (
                      (t[1] = t[1].toLowerCase()),
                      "nth" === t[1].slice(0, 3)
                        ? (t[3] || Z.error(t[0]),
                          (t[4] = +(t[4]
                            ? t[5] + (t[6] || 1)
                            : 2 * ("even" === t[3] || "odd" === t[3]))),
                          (t[5] = +(t[7] + t[8] || "odd" === t[3])))
                        : t[3] && Z.error(t[0]),
                      t
                    );
                  },
                  PSEUDO: function (t) {
                    var e,
                      n = !t[6] && t[2];
                    return B.CHILD.test(t[0])
                      ? null
                      : (t[3]
                          ? (t[2] = t[4] || t[5] || "")
                          : n &&
                            z.test(n) &&
                            (e = lt(n, !0)) &&
                            (e = n.indexOf(")", n.length - e) - n.length) &&
                            ((t[0] = t[0].slice(0, e)), (t[2] = n.slice(0, e))),
                        t.slice(0, 3));
                  },
                },
                filter: {
                  TAG: function (t) {
                    var e = t.replace(V, J).toLowerCase();
                    return "*" === t
                      ? function () {
                          return !0;
                        }
                      : function (t) {
                          return S(t, e);
                        };
                  },
                  CLASS: function (t) {
                    var e = x[t + " "];
                    return (
                      e ||
                      ((e = new RegExp(
                        "(^|" + _ + ")" + t + "(" + _ + "|$)",
                      )) &&
                        x(t, function (t) {
                          return e.test(
                            ("string" == typeof t.className && t.className) ||
                              (void 0 !== t.getAttribute &&
                                t.getAttribute("class")) ||
                              "",
                          );
                        }))
                    );
                  },
                  ATTR: function (t, e, n) {
                    return function (r) {
                      var o = Z.attr(r, t);
                      return null == o
                        ? "!=" === e
                        : !e ||
                            ((o += ""),
                            "=" === e
                              ? o === n
                              : "!=" === e
                                ? o !== n
                                : "^=" === e
                                  ? n && 0 === o.indexOf(n)
                                  : "*=" === e
                                    ? n && o.indexOf(n) > -1
                                    : "$=" === e
                                      ? n && o.slice(-n.length) === n
                                      : "~=" === e
                                        ? (
                                            " " +
                                            o.replace(I, " ") +
                                            " "
                                          ).indexOf(n) > -1
                                        : "|=" === e &&
                                          (o === n ||
                                            o.slice(0, n.length + 1) ===
                                              n + "-"));
                    };
                  },
                  CHILD: function (t, e, n, r, o) {
                    var i = "nth" !== t.slice(0, 3),
                      a = "last" !== t.slice(-4),
                      c = "of-type" === e;
                    return 1 === r && 0 === o
                      ? function (t) {
                          return !!t.parentNode;
                        }
                      : function (e, n, s) {
                          var u,
                            l,
                            f,
                            p,
                            h,
                            d = i !== a ? "nextSibling" : "previousSibling",
                            v = e.parentNode,
                            y = c && e.nodeName.toLowerCase(),
                            b = !s && !c,
                            x = !1;
                          if (v) {
                            if (i) {
                              for (; d; ) {
                                for (f = e; (f = f[d]); )
                                  if (c ? S(f, y) : 1 === f.nodeType) return !1;
                                h = d = "only" === t && !h && "nextSibling";
                              }
                              return !0;
                            }
                            if (
                              ((h = [a ? v.firstChild : v.lastChild]), a && b)
                            ) {
                              for (
                                x =
                                  (p =
                                    (u =
                                      (l = v[g] || (v[g] = {}))[t] || [])[0] ===
                                      m && u[1]) && u[2],
                                  f = p && v.childNodes[p];
                                (f =
                                  (++p && f && f[d]) || (x = p = 0) || h.pop());

                              )
                                if (1 === f.nodeType && ++x && f === e) {
                                  l[t] = [m, p, x];
                                  break;
                                }
                            } else if (
                              (b &&
                                (x = p =
                                  (u =
                                    (l = e[g] || (e[g] = {}))[t] || [])[0] ===
                                    m && u[1]),
                              !1 === x)
                            )
                              for (
                                ;
                                (f =
                                  (++p && f && f[d]) ||
                                  (x = p = 0) ||
                                  h.pop()) &&
                                (!(c ? S(f, y) : 1 === f.nodeType) ||
                                  !++x ||
                                  (b && ((l = f[g] || (f[g] = {}))[t] = [m, x]),
                                  f !== e));

                              );
                            return (x -= o) === r || (x % r == 0 && x / r >= 0);
                          }
                        };
                  },
                  PSEUDO: function (t, n) {
                    var r,
                      o =
                        e.pseudos[t] ||
                        e.setFilters[t.toLowerCase()] ||
                        Z.error("unsupported pseudo: " + t);
                    return o[g]
                      ? o(n)
                      : o.length > 1
                        ? ((r = [t, t, "", n]),
                          e.setFilters.hasOwnProperty(t.toLowerCase())
                            ? et(function (t, e) {
                                for (var r, i = o(t, n), a = i.length; a--; )
                                  t[(r = l.call(t, i[a]))] = !(e[r] = i[a]);
                              })
                            : function (t) {
                                return o(t, 0, r);
                              })
                        : o;
                  },
                },
                pseudos: {
                  not: et(function (t) {
                    var e = [],
                      n = [],
                      r = gt(t.replace(N, "$1"));
                    return r[g]
                      ? et(function (t, e, n, o) {
                          for (
                            var i, a = r(t, null, o, []), c = t.length;
                            c--;

                          )
                            (i = a[c]) && (t[c] = !(e[c] = i));
                        })
                      : function (t, o, i) {
                          return (
                            (e[0] = t),
                            r(e, null, i, n),
                            (e[0] = null),
                            !n.pop()
                          );
                        };
                  }),
                  has: et(function (t) {
                    return function (e) {
                      return Z(t, e).length > 0;
                    };
                  }),
                  contains: et(function (t) {
                    return (
                      (t = t.replace(V, J)),
                      function (e) {
                        return (e.textContent || T.text(e)).indexOf(t) > -1;
                      }
                    );
                  }),
                  lang: et(function (t) {
                    return (
                      W.test(t || "") || Z.error("unsupported lang: " + t),
                      (t = t.replace(V, J).toLowerCase()),
                      function (e) {
                        var n;
                        do {
                          if (
                            (n = f
                              ? e.lang
                              : e.getAttribute("xml:lang") ||
                                e.getAttribute("lang"))
                          )
                            return (
                              (n = n.toLowerCase()) === t ||
                              0 === n.indexOf(t + "-")
                            );
                        } while ((e = e.parentNode) && 1 === e.nodeType);
                        return !1;
                      }
                    );
                  }),
                  target: function (t) {
                    var e = r.location && r.location.hash;
                    return e && e.slice(1) === t.id;
                  },
                  root: function (t) {
                    return t === u;
                  },
                  focus: function (t) {
                    return (
                      t ===
                        (function () {
                          try {
                            return s.activeElement;
                          } catch (t) {}
                        })() &&
                      s.hasFocus() &&
                      !!(t.type || t.href || ~t.tabIndex)
                    );
                  },
                  enabled: it(!1),
                  disabled: it(!0),
                  checked: function (t) {
                    return (
                      (S(t, "input") && !!t.checked) ||
                      (S(t, "option") && !!t.selected)
                    );
                  },
                  selected: function (t) {
                    return (
                      t.parentNode && t.parentNode.selectedIndex,
                      !0 === t.selected
                    );
                  },
                  empty: function (t) {
                    for (t = t.firstChild; t; t = t.nextSibling)
                      if (t.nodeType < 6) return !1;
                    return !0;
                  },
                  parent: function (t) {
                    return !e.pseudos.empty(t);
                  },
                  header: function (t) {
                    return U.test(t.nodeName);
                  },
                  input: function (t) {
                    return $.test(t.nodeName);
                  },
                  button: function (t) {
                    return (
                      (S(t, "input") && "button" === t.type) || S(t, "button")
                    );
                  },
                  text: function (t) {
                    var e;
                    return (
                      S(t, "input") &&
                      "text" === t.type &&
                      (null == (e = t.getAttribute("type")) ||
                        "text" === e.toLowerCase())
                    );
                  },
                  first: at(function () {
                    return [0];
                  }),
                  last: at(function (t, e) {
                    return [e - 1];
                  }),
                  eq: at(function (t, e, n) {
                    return [n < 0 ? n + e : n];
                  }),
                  even: at(function (t, e) {
                    for (var n = 0; n < e; n += 2) t.push(n);
                    return t;
                  }),
                  odd: at(function (t, e) {
                    for (var n = 1; n < e; n += 2) t.push(n);
                    return t;
                  }),
                  lt: at(function (t, e, n) {
                    var r;
                    for (r = n < 0 ? n + e : n > e ? e : n; --r >= 0; )
                      t.push(r);
                    return t;
                  }),
                  gt: at(function (t, e, n) {
                    for (var r = n < 0 ? n + e : n; ++r < e; ) t.push(r);
                    return t;
                  }),
                },
              }),
            (e.pseudos.nth = e.pseudos.eq),
            { radio: !0, checkbox: !0, file: !0, password: !0, image: !0 }))
              e.pseudos[t] = rt(t);
            for (t in { submit: !0, reset: !0 }) e.pseudos[t] = ot(t);
            function ut() {}
            function lt(t, n) {
              var r,
                o,
                i,
                a,
                c,
                s,
                u,
                l = w[t + " "];
              if (l) return n ? 0 : l.slice(0);
              for (c = t, s = [], u = e.preFilter; c; ) {
                for (a in ((r && !(o = F.exec(c))) ||
                  (o && (c = c.slice(o[0].length) || c), s.push((i = []))),
                (r = !1),
                (o = M.exec(c)) &&
                  ((r = o.shift()),
                  i.push({ value: r, type: o[0].replace(N, " ") }),
                  (c = c.slice(r.length))),
                e.filter))
                  !(o = B[a].exec(c)) ||
                    (u[a] && !(o = u[a](o))) ||
                    ((r = o.shift()),
                    i.push({ value: r, type: a, matches: o }),
                    (c = c.slice(r.length)));
                if (!r) break;
              }
              return n ? c.length : c ? Z.error(t) : w(t, s).slice(0);
            }
            function ft(t) {
              for (var e = 0, n = t.length, r = ""; e < n; e++) r += t[e].value;
              return r;
            }
            function pt(t, e, n) {
              var r = e.dir,
                o = e.next,
                i = o || r,
                a = n && "parentNode" === i,
                c = b++;
              return e.first
                ? function (e, n, o) {
                    for (; (e = e[r]); )
                      if (1 === e.nodeType || a) return t(e, n, o);
                    return !1;
                  }
                : function (e, n, s) {
                    var u,
                      l,
                      f = [m, c];
                    if (s) {
                      for (; (e = e[r]); )
                        if ((1 === e.nodeType || a) && t(e, n, s)) return !0;
                    } else
                      for (; (e = e[r]); )
                        if (1 === e.nodeType || a)
                          if (((l = e[g] || (e[g] = {})), o && S(e, o)))
                            e = e[r] || e;
                          else {
                            if ((u = l[i]) && u[0] === m && u[1] === c)
                              return (f[2] = u[2]);
                            if (((l[i] = f), (f[2] = t(e, n, s)))) return !0;
                          }
                    return !1;
                  };
            }
            function ht(t) {
              return t.length > 1
                ? function (e, n, r) {
                    for (var o = t.length; o--; ) if (!t[o](e, n, r)) return !1;
                    return !0;
                  }
                : t[0];
            }
            function dt(t, e, n, r, o) {
              for (
                var i, a = [], c = 0, s = t.length, u = null != e;
                c < s;
                c++
              )
                (i = t[c]) &&
                  ((n && !n(i, r, o)) || (a.push(i), u && e.push(c)));
              return a;
            }
            function vt(t, e, n, r, o, i) {
              return (
                r && !r[g] && (r = vt(r)),
                o && !o[g] && (o = vt(o, i)),
                et(function (i, a, c, s) {
                  var u,
                    f,
                    p,
                    h,
                    d = [],
                    y = [],
                    g = a.length,
                    m =
                      i ||
                      (function (t, e, n) {
                        for (var r = 0, o = e.length; r < o; r++) Z(t, e[r], n);
                        return n;
                      })(e || "*", c.nodeType ? [c] : c, []),
                    b = !t || (!i && e) ? m : dt(m, d, t, c, s);
                  if (
                    (n
                      ? n(b, (h = o || (i ? t : g || r) ? [] : a), c, s)
                      : (h = b),
                    r)
                  )
                    for (u = dt(h, y), r(u, [], c, s), f = u.length; f--; )
                      (p = u[f]) && (h[y[f]] = !(b[y[f]] = p));
                  if (i) {
                    if (o || t) {
                      if (o) {
                        for (u = [], f = h.length; f--; )
                          (p = h[f]) && u.push((b[f] = p));
                        o(null, (h = []), u, s);
                      }
                      for (f = h.length; f--; )
                        (p = h[f]) &&
                          (u = o ? l.call(i, p) : d[f]) > -1 &&
                          (i[u] = !(a[u] = p));
                    }
                  } else
                    ((h = dt(h === a ? h.splice(g, h.length) : h)),
                      o ? o(null, a, h, s) : v.apply(a, h));
                })
              );
            }
            function yt(t) {
              for (
                var r,
                  o,
                  i,
                  a = t.length,
                  c = e.relative[t[0].type],
                  s = c || e.relative[" "],
                  u = c ? 1 : 0,
                  f = pt(
                    function (t) {
                      return t === r;
                    },
                    s,
                    !0,
                  ),
                  p = pt(
                    function (t) {
                      return l.call(r, t) > -1;
                    },
                    s,
                    !0,
                  ),
                  h = [
                    function (t, e, o) {
                      var i =
                        (!c && (o || e != n)) ||
                        ((r = e).nodeType ? f(t, e, o) : p(t, e, o));
                      return ((r = null), i);
                    },
                  ];
                u < a;
                u++
              )
                if ((o = e.relative[t[u].type])) h = [pt(ht(h), o)];
                else {
                  if ((o = e.filter[t[u].type].apply(null, t[u].matches))[g]) {
                    for (i = ++u; i < a && !e.relative[t[i].type]; i++);
                    return vt(
                      u > 1 && ht(h),
                      u > 1 &&
                        ft(
                          t.slice(0, u - 1).concat({
                            value: " " === t[u - 2].type ? "*" : "",
                          }),
                        ).replace(N, "$1"),
                      o,
                      u < i && yt(t.slice(u, i)),
                      i < a && yt((t = t.slice(i))),
                      i < a && ft(t),
                    );
                  }
                  h.push(o);
                }
              return ht(h);
            }
            function gt(t, r) {
              var o,
                i = [],
                a = [],
                c = k[t + " "];
              if (!c) {
                for (r || (r = lt(t)), o = r.length; o--; )
                  (c = yt(r[o]))[g] ? i.push(c) : a.push(c);
                ((c = k(
                  t,
                  (function (t, r) {
                    var o = r.length > 0,
                      i = t.length > 0,
                      a = function (a, c, u, l, p) {
                        var h,
                          d,
                          y,
                          g = 0,
                          b = "0",
                          x = a && [],
                          w = [],
                          k = n,
                          E = a || (i && e.find.TAG("*", p)),
                          j = (m += null == k ? 1 : Math.random() || 0.1),
                          L = E.length;
                        for (
                          p && (n = c == s || c || p);
                          b !== L && null != (h = E[b]);
                          b++
                        ) {
                          if (i && h) {
                            for (
                              d = 0,
                                c || h.ownerDocument == s || (st(h), (u = !f));
                              (y = t[d++]);

                            )
                              if (y(h, c || s, u)) {
                                v.call(l, h);
                                break;
                              }
                            p && (m = j);
                          }
                          o && ((h = !y && h) && g--, a && x.push(h));
                        }
                        if (((g += b), o && b !== g)) {
                          for (d = 0; (y = r[d++]); ) y(x, w, c, u);
                          if (a) {
                            if (g > 0)
                              for (; b--; ) x[b] || w[b] || (w[b] = A.call(l));
                            w = dt(w);
                          }
                          (v.apply(l, w),
                            p &&
                              !a &&
                              w.length > 0 &&
                              g + r.length > 1 &&
                              T.uniqueSort(l));
                        }
                        return (p && ((m = j), (n = k)), x);
                      };
                    return o ? et(a) : a;
                  })(a, i),
                )),
                  (c.selector = t));
              }
              return c;
            }
            function mt(t, n, r, o) {
              var i,
                a,
                c,
                s,
                u,
                l = "function" == typeof t && t,
                p = !o && lt((t = l.selector || t));
              if (((r = r || []), 1 === p.length)) {
                if (
                  (a = p[0] = p[0].slice(0)).length > 2 &&
                  "ID" === (c = a[0]).type &&
                  9 === n.nodeType &&
                  f &&
                  e.relative[a[1].type]
                ) {
                  if (
                    !(n = (e.find.ID(c.matches[0].replace(V, J), n) || [])[0])
                  )
                    return r;
                  (l && (n = n.parentNode),
                    (t = t.slice(a.shift().value.length)));
                }
                for (
                  i = B.needsContext.test(t) ? 0 : a.length;
                  i-- && ((c = a[i]), !e.relative[(s = c.type)]);

                )
                  if (
                    (u = e.find[s]) &&
                    (o = u(
                      c.matches[0].replace(V, J),
                      (Y.test(a[0].type) && ct(n.parentNode)) || n,
                    ))
                  ) {
                    if ((a.splice(i, 1), !(t = o.length && ft(a))))
                      return (v.apply(r, o), r);
                    break;
                  }
              }
              return (
                (l || gt(t, p))(
                  o,
                  n,
                  !f,
                  r,
                  !n || (Y.test(t) && ct(n.parentNode)) || n,
                ),
                r
              );
            }
            ((ut.prototype = e.filters = e.pseudos),
              (e.setFilters = new ut()),
              (y.sortStable = g.split("").sort(j).join("") === g),
              st(),
              (y.sortDetached = nt(function (t) {
                return (
                  1 & t.compareDocumentPosition(s.createElement("fieldset"))
                );
              })),
              (T.find = Z),
              (T.expr[":"] = T.expr.pseudos),
              (T.unique = T.uniqueSort),
              (Z.compile = gt),
              (Z.select = mt),
              (Z.setDocument = st),
              (Z.tokenize = lt),
              (Z.escape = T.escapeSelector),
              (Z.getText = T.text),
              (Z.isXML = T.isXMLDoc),
              (Z.selectors = T.expr),
              (Z.support = T.support),
              (Z.uniqueSort = T.uniqueSort));
          })();
          var R = function (t, e, n) {
              for (
                var r = [], o = void 0 !== n;
                (t = t[e]) && 9 !== t.nodeType;

              )
                if (1 === t.nodeType) {
                  if (o && T(t).is(n)) break;
                  r.push(t);
                }
              return r;
            },
            I = function (t, e) {
              for (var n = []; t; t = t.nextSibling)
                1 === t.nodeType && t !== e && n.push(t);
              return n;
            },
            F = T.expr.match.needsContext,
            M =
              /^<([a-z][^\/\0>:\x20\t\r\n\f]*)[\x20\t\r\n\f]*\/?>(?:<\/\1>|)$/i;
          function G(t, e, n) {
            return g(e)
              ? T.grep(t, function (t, r) {
                  return !!e.call(t, r, t) !== n;
                })
              : e.nodeType
                ? T.grep(t, function (t) {
                    return (t === e) !== n;
                  })
                : "string" != typeof e
                  ? T.grep(t, function (t) {
                      return l.call(e, t) > -1 !== n;
                    })
                  : T.filter(e, t, n);
          }
          ((T.filter = function (t, e, n) {
            var r = e[0];
            return (
              n && (t = ":not(" + t + ")"),
              1 === e.length && 1 === r.nodeType
                ? T.find.matchesSelector(r, t)
                  ? [r]
                  : []
                : T.find.matches(
                    t,
                    T.grep(e, function (t) {
                      return 1 === t.nodeType;
                    }),
                  )
            );
          }),
            T.fn.extend({
              find: function (t) {
                var e,
                  n,
                  r = this.length,
                  o = this;
                if ("string" != typeof t)
                  return this.pushStack(
                    T(t).filter(function () {
                      for (e = 0; e < r; e++)
                        if (T.contains(o[e], this)) return !0;
                    }),
                  );
                for (n = this.pushStack([]), e = 0; e < r; e++)
                  T.find(t, o[e], n);
                return r > 1 ? T.uniqueSort(n) : n;
              },
              filter: function (t) {
                return this.pushStack(G(this, t || [], !1));
              },
              not: function (t) {
                return this.pushStack(G(this, t || [], !0));
              },
              is: function (t) {
                return !!G(
                  this,
                  "string" == typeof t && F.test(t) ? T(t) : t || [],
                  !1,
                ).length;
              },
            }));
          var z,
            W = /^(?:\s*(<[\w\W]+>)[^>]*|#([\w-]+))$/;
          (((T.fn.init = function (t, e, n) {
            var r, o;
            if (!t) return this;
            if (((n = n || z), "string" == typeof t)) {
              if (
                !(r =
                  "<" === t[0] && ">" === t[t.length - 1] && t.length >= 3
                    ? [null, t, null]
                    : W.exec(t)) ||
                (!r[1] && e)
              )
                return !e || e.jquery
                  ? (e || n).find(t)
                  : this.constructor(e).find(t);
              if (r[1]) {
                if (
                  ((e = e instanceof T ? e[0] : e),
                  T.merge(
                    this,
                    T.parseHTML(
                      r[1],
                      e && e.nodeType ? e.ownerDocument || e : b,
                      !0,
                    ),
                  ),
                  M.test(r[1]) && T.isPlainObject(e))
                )
                  for (r in e) g(this[r]) ? this[r](e[r]) : this.attr(r, e[r]);
                return this;
              }
              return (
                (o = b.getElementById(r[2])) &&
                  ((this[0] = o), (this.length = 1)),
                this
              );
            }
            return t.nodeType
              ? ((this[0] = t), (this.length = 1), this)
              : g(t)
                ? void 0 !== n.ready
                  ? n.ready(t)
                  : t(T)
                : T.makeArray(t, this);
          }).prototype = T.fn),
            (z = T(b)));
          var B = /^(?:parents|prev(?:Until|All))/,
            $ = { children: !0, contents: !0, next: !0, prev: !0 };
          function U(t, e) {
            for (; (t = t[e]) && 1 !== t.nodeType; );
            return t;
          }
          (T.fn.extend({
            has: function (t) {
              var e = T(t, this),
                n = e.length;
              return this.filter(function () {
                for (var t = 0; t < n; t++)
                  if (T.contains(this, e[t])) return !0;
              });
            },
            closest: function (t, e) {
              var n,
                r = 0,
                o = this.length,
                i = [],
                a = "string" != typeof t && T(t);
              if (!F.test(t))
                for (; r < o; r++)
                  for (n = this[r]; n && n !== e; n = n.parentNode)
                    if (
                      n.nodeType < 11 &&
                      (a
                        ? a.index(n) > -1
                        : 1 === n.nodeType && T.find.matchesSelector(n, t))
                    ) {
                      i.push(n);
                      break;
                    }
              return this.pushStack(i.length > 1 ? T.uniqueSort(i) : i);
            },
            index: function (t) {
              return t
                ? "string" == typeof t
                  ? l.call(T(t), this[0])
                  : l.call(this, t.jquery ? t[0] : t)
                : this[0] && this[0].parentNode
                  ? this.first().prevAll().length
                  : -1;
            },
            add: function (t, e) {
              return this.pushStack(T.uniqueSort(T.merge(this.get(), T(t, e))));
            },
            addBack: function (t) {
              return this.add(
                null == t ? this.prevObject : this.prevObject.filter(t),
              );
            },
          }),
            T.each(
              {
                parent: function (t) {
                  var e = t.parentNode;
                  return e && 11 !== e.nodeType ? e : null;
                },
                parents: function (t) {
                  return R(t, "parentNode");
                },
                parentsUntil: function (t, e, n) {
                  return R(t, "parentNode", n);
                },
                next: function (t) {
                  return U(t, "nextSibling");
                },
                prev: function (t) {
                  return U(t, "previousSibling");
                },
                nextAll: function (t) {
                  return R(t, "nextSibling");
                },
                prevAll: function (t) {
                  return R(t, "previousSibling");
                },
                nextUntil: function (t, e, n) {
                  return R(t, "nextSibling", n);
                },
                prevUntil: function (t, e, n) {
                  return R(t, "previousSibling", n);
                },
                siblings: function (t) {
                  return I((t.parentNode || {}).firstChild, t);
                },
                children: function (t) {
                  return I(t.firstChild);
                },
                contents: function (t) {
                  return null != t.contentDocument && a(t.contentDocument)
                    ? t.contentDocument
                    : (S(t, "template") && (t = t.content || t),
                      T.merge([], t.childNodes));
                },
              },
              function (t, e) {
                T.fn[t] = function (n, r) {
                  var o = T.map(this, e, n);
                  return (
                    "Until" !== t.slice(-5) && (r = n),
                    r && "string" == typeof r && (o = T.filter(r, o)),
                    this.length > 1 &&
                      ($[t] || T.uniqueSort(o), B.test(t) && o.reverse()),
                    this.pushStack(o)
                  );
                };
              },
            ));
          var X = /[^\x20\t\r\n\f]+/g;
          function Y(t) {
            return t;
          }
          function V(t) {
            throw t;
          }
          function J(t, e, n, r) {
            var o;
            try {
              t && g((o = t.promise))
                ? o.call(t).done(e).fail(n)
                : t && g((o = t.then))
                  ? o.call(t, e, n)
                  : e.apply(void 0, [t].slice(r));
            } catch (t) {
              n.apply(void 0, [t]);
            }
          }
          ((T.Callbacks = function (t) {
            t =
              "string" == typeof t
                ? (function (t) {
                    var e = {};
                    return (
                      T.each(t.match(X) || [], function (t, n) {
                        e[n] = !0;
                      }),
                      e
                    );
                  })(t)
                : T.extend({}, t);
            var e,
              n,
              r,
              o,
              i = [],
              a = [],
              c = -1,
              s = function () {
                for (o = o || t.once, r = e = !0; a.length; c = -1)
                  for (n = a.shift(); ++c < i.length; )
                    !1 === i[c].apply(n[0], n[1]) &&
                      t.stopOnFalse &&
                      ((c = i.length), (n = !1));
                (t.memory || (n = !1), (e = !1), o && (i = n ? [] : ""));
              },
              u = {
                add: function () {
                  return (
                    i &&
                      (n && !e && ((c = i.length - 1), a.push(n)),
                      (function e(n) {
                        T.each(n, function (n, r) {
                          g(r)
                            ? (t.unique && u.has(r)) || i.push(r)
                            : r && r.length && "string" !== k(r) && e(r);
                        });
                      })(arguments),
                      n && !e && s()),
                    this
                  );
                },
                remove: function () {
                  return (
                    T.each(arguments, function (t, e) {
                      for (var n; (n = T.inArray(e, i, n)) > -1; )
                        (i.splice(n, 1), n <= c && c--);
                    }),
                    this
                  );
                },
                has: function (t) {
                  return t ? T.inArray(t, i) > -1 : i.length > 0;
                },
                empty: function () {
                  return (i && (i = []), this);
                },
                disable: function () {
                  return ((o = a = []), (i = n = ""), this);
                },
                disabled: function () {
                  return !i;
                },
                lock: function () {
                  return ((o = a = []), n || e || (i = n = ""), this);
                },
                locked: function () {
                  return !!o;
                },
                fireWith: function (t, n) {
                  return (
                    o ||
                      ((n = [t, (n = n || []).slice ? n.slice() : n]),
                      a.push(n),
                      e || s()),
                    this
                  );
                },
                fire: function () {
                  return (u.fireWith(this, arguments), this);
                },
                fired: function () {
                  return !!r;
                },
              };
            return u;
          }),
            T.extend({
              Deferred: function (t) {
                var e = [
                    [
                      "notify",
                      "progress",
                      T.Callbacks("memory"),
                      T.Callbacks("memory"),
                      2,
                    ],
                    [
                      "resolve",
                      "done",
                      T.Callbacks("once memory"),
                      T.Callbacks("once memory"),
                      0,
                      "resolved",
                    ],
                    [
                      "reject",
                      "fail",
                      T.Callbacks("once memory"),
                      T.Callbacks("once memory"),
                      1,
                      "rejected",
                    ],
                  ],
                  n = "pending",
                  o = {
                    state: function () {
                      return n;
                    },
                    always: function () {
                      return (i.done(arguments).fail(arguments), this);
                    },
                    catch: function (t) {
                      return o.then(null, t);
                    },
                    pipe: function () {
                      var t = arguments;
                      return T.Deferred(function (n) {
                        (T.each(e, function (e, r) {
                          var o = g(t[r[4]]) && t[r[4]];
                          i[r[1]](function () {
                            var t = o && o.apply(this, arguments);
                            t && g(t.promise)
                              ? t
                                  .promise()
                                  .progress(n.notify)
                                  .done(n.resolve)
                                  .fail(n.reject)
                              : n[r[0] + "With"](this, o ? [t] : arguments);
                          });
                        }),
                          (t = null));
                      }).promise();
                    },
                    then: function (t, n, o) {
                      var i = 0;
                      function a(t, e, n, o) {
                        return function () {
                          var c = this,
                            s = arguments,
                            u = function () {
                              var r, u;
                              if (!(t < i)) {
                                if ((r = n.apply(c, s)) === e.promise())
                                  throw new TypeError(
                                    "Thenable self-resolution",
                                  );
                                ((u =
                                  r &&
                                  ("object" == typeof r ||
                                    "function" == typeof r) &&
                                  r.then),
                                  g(u)
                                    ? o
                                      ? u.call(r, a(i, e, Y, o), a(i, e, V, o))
                                      : (i++,
                                        u.call(
                                          r,
                                          a(i, e, Y, o),
                                          a(i, e, V, o),
                                          a(i, e, Y, e.notifyWith),
                                        ))
                                    : (n !== Y && ((c = void 0), (s = [r])),
                                      (o || e.resolveWith)(c, s)));
                              }
                            },
                            l = o
                              ? u
                              : function () {
                                  try {
                                    u();
                                  } catch (r) {
                                    (T.Deferred.exceptionHook &&
                                      T.Deferred.exceptionHook(r, l.error),
                                      t + 1 >= i &&
                                        (n !== V && ((c = void 0), (s = [r])),
                                        e.rejectWith(c, s)));
                                  }
                                };
                          t
                            ? l()
                            : (T.Deferred.getErrorHook
                                ? (l.error = T.Deferred.getErrorHook())
                                : T.Deferred.getStackHook &&
                                  (l.error = T.Deferred.getStackHook()),
                              r.setTimeout(l));
                        };
                      }
                      return T.Deferred(function (r) {
                        (e[0][3].add(a(0, r, g(o) ? o : Y, r.notifyWith)),
                          e[1][3].add(a(0, r, g(t) ? t : Y)),
                          e[2][3].add(a(0, r, g(n) ? n : V)));
                      }).promise();
                    },
                    promise: function (t) {
                      return null != t ? T.extend(t, o) : o;
                    },
                  },
                  i = {};
                return (
                  T.each(e, function (t, r) {
                    var a = r[2],
                      c = r[5];
                    ((o[r[1]] = a.add),
                      c &&
                        a.add(
                          function () {
                            n = c;
                          },
                          e[3 - t][2].disable,
                          e[3 - t][3].disable,
                          e[0][2].lock,
                          e[0][3].lock,
                        ),
                      a.add(r[3].fire),
                      (i[r[0]] = function () {
                        return (
                          i[r[0] + "With"](
                            this === i ? void 0 : this,
                            arguments,
                          ),
                          this
                        );
                      }),
                      (i[r[0] + "With"] = a.fireWith));
                  }),
                  o.promise(i),
                  t && t.call(i, i),
                  i
                );
              },
              when: function (t) {
                var e = arguments.length,
                  n = e,
                  r = Array(n),
                  o = c.call(arguments),
                  i = T.Deferred(),
                  a = function (t) {
                    return function (n) {
                      ((r[t] = this),
                        (o[t] = arguments.length > 1 ? c.call(arguments) : n),
                        --e || i.resolveWith(r, o));
                    };
                  };
                if (
                  e <= 1 &&
                  (J(t, i.done(a(n)).resolve, i.reject, !e),
                  "pending" === i.state() || g(o[n] && o[n].then))
                )
                  return i.then();
                for (; n--; ) J(o[n], a(n), i.reject);
                return i.promise();
              },
            }));
          var Q = /^(Eval|Internal|Range|Reference|Syntax|Type|URI)Error$/;
          ((T.Deferred.exceptionHook = function (t, e) {
            r.console &&
              r.console.warn &&
              t &&
              Q.test(t.name) &&
              r.console.warn(
                "jQuery.Deferred exception: " + t.message,
                t.stack,
                e,
              );
          }),
            (T.readyException = function (t) {
              r.setTimeout(function () {
                throw t;
              });
            }));
          var K = T.Deferred();
          function Z() {
            (b.removeEventListener("DOMContentLoaded", Z),
              r.removeEventListener("load", Z),
              T.ready());
          }
          ((T.fn.ready = function (t) {
            return (
              K.then(t).catch(function (t) {
                T.readyException(t);
              }),
              this
            );
          }),
            T.extend({
              isReady: !1,
              readyWait: 1,
              ready: function (t) {
                (!0 === t ? --T.readyWait : T.isReady) ||
                  ((T.isReady = !0),
                  (!0 !== t && --T.readyWait > 0) || K.resolveWith(b, [T]));
              },
            }),
            (T.ready.then = K.then),
            "complete" === b.readyState ||
            ("loading" !== b.readyState && !b.documentElement.doScroll)
              ? r.setTimeout(T.ready)
              : (b.addEventListener("DOMContentLoaded", Z),
                r.addEventListener("load", Z)));
          var tt = function (t, e, n, r, o, i, a) {
              var c = 0,
                s = t.length,
                u = null == n;
              if ("object" === k(n))
                for (c in ((o = !0), n)) tt(t, e, c, n[c], !0, i, a);
              else if (
                void 0 !== r &&
                ((o = !0),
                g(r) || (a = !0),
                u &&
                  (a
                    ? (e.call(t, r), (e = null))
                    : ((u = e),
                      (e = function (t, e, n) {
                        return u.call(T(t), n);
                      }))),
                e)
              )
                for (; c < s; c++)
                  e(t[c], n, a ? r : r.call(t[c], c, e(t[c], n)));
              return o ? t : u ? e.call(t) : s ? e(t[0], n) : i;
            },
            et = /^-ms-/,
            nt = /-([a-z])/g;
          function rt(t, e) {
            return e.toUpperCase();
          }
          function ot(t) {
            return t.replace(et, "ms-").replace(nt, rt);
          }
          var it = function (t) {
            return 1 === t.nodeType || 9 === t.nodeType || !+t.nodeType;
          };
          function at() {
            this.expando = T.expando + at.uid++;
          }
          ((at.uid = 1),
            (at.prototype = {
              cache: function (t) {
                var e = t[this.expando];
                return (
                  e ||
                    ((e = {}),
                    it(t) &&
                      (t.nodeType
                        ? (t[this.expando] = e)
                        : Object.defineProperty(t, this.expando, {
                            value: e,
                            configurable: !0,
                          }))),
                  e
                );
              },
              set: function (t, e, n) {
                var r,
                  o = this.cache(t);
                if ("string" == typeof e) o[ot(e)] = n;
                else for (r in e) o[ot(r)] = e[r];
                return o;
              },
              get: function (t, e) {
                return void 0 === e
                  ? this.cache(t)
                  : t[this.expando] && t[this.expando][ot(e)];
              },
              access: function (t, e, n) {
                return void 0 === e ||
                  (e && "string" == typeof e && void 0 === n)
                  ? this.get(t, e)
                  : (this.set(t, e, n), void 0 !== n ? n : e);
              },
              remove: function (t, e) {
                var n,
                  r = t[this.expando];
                if (void 0 !== r) {
                  if (void 0 !== e) {
                    n = (e = Array.isArray(e)
                      ? e.map(ot)
                      : (e = ot(e)) in r
                        ? [e]
                        : e.match(X) || []).length;
                    for (; n--; ) delete r[e[n]];
                  }
                  (void 0 === e || T.isEmptyObject(r)) &&
                    (t.nodeType
                      ? (t[this.expando] = void 0)
                      : delete t[this.expando]);
                }
              },
              hasData: function (t) {
                var e = t[this.expando];
                return void 0 !== e && !T.isEmptyObject(e);
              },
            }));
          var ct = new at(),
            st = new at(),
            ut = /^(?:\{[\w\W]*\}|\[[\w\W]*\])$/,
            lt = /[A-Z]/g;
          function ft(t, e, n) {
            var r;
            if (void 0 === n && 1 === t.nodeType)
              if (
                ((r = "data-" + e.replace(lt, "-$&").toLowerCase()),
                "string" == typeof (n = t.getAttribute(r)))
              ) {
                try {
                  n = (function (t) {
                    return (
                      "true" === t ||
                      ("false" !== t &&
                        ("null" === t
                          ? null
                          : t === +t + ""
                            ? +t
                            : ut.test(t)
                              ? JSON.parse(t)
                              : t))
                    );
                  })(n);
                } catch (t) {}
                st.set(t, e, n);
              } else n = void 0;
            return n;
          }
          (T.extend({
            hasData: function (t) {
              return st.hasData(t) || ct.hasData(t);
            },
            data: function (t, e, n) {
              return st.access(t, e, n);
            },
            removeData: function (t, e) {
              st.remove(t, e);
            },
            _data: function (t, e, n) {
              return ct.access(t, e, n);
            },
            _removeData: function (t, e) {
              ct.remove(t, e);
            },
          }),
            T.fn.extend({
              data: function (t, e) {
                var n,
                  r,
                  o,
                  i = this[0],
                  a = i && i.attributes;
                if (void 0 === t) {
                  if (
                    this.length &&
                    ((o = st.get(i)),
                    1 === i.nodeType && !ct.get(i, "hasDataAttrs"))
                  ) {
                    for (n = a.length; n--; )
                      a[n] &&
                        0 === (r = a[n].name).indexOf("data-") &&
                        ((r = ot(r.slice(5))), ft(i, r, o[r]));
                    ct.set(i, "hasDataAttrs", !0);
                  }
                  return o;
                }
                return "object" == typeof t
                  ? this.each(function () {
                      st.set(this, t);
                    })
                  : tt(
                      this,
                      function (e) {
                        var n;
                        if (i && void 0 === e)
                          return void 0 !== (n = st.get(i, t)) ||
                            void 0 !== (n = ft(i, t))
                            ? n
                            : void 0;
                        this.each(function () {
                          st.set(this, t, e);
                        });
                      },
                      null,
                      e,
                      arguments.length > 1,
                      null,
                      !0,
                    );
              },
              removeData: function (t) {
                return this.each(function () {
                  st.remove(this, t);
                });
              },
            }),
            T.extend({
              queue: function (t, e, n) {
                var r;
                if (t)
                  return (
                    (e = (e || "fx") + "queue"),
                    (r = ct.get(t, e)),
                    n &&
                      (!r || Array.isArray(n)
                        ? (r = ct.access(t, e, T.makeArray(n)))
                        : r.push(n)),
                    r || []
                  );
              },
              dequeue: function (t, e) {
                e = e || "fx";
                var n = T.queue(t, e),
                  r = n.length,
                  o = n.shift(),
                  i = T._queueHooks(t, e);
                ("inprogress" === o && ((o = n.shift()), r--),
                  o &&
                    ("fx" === e && n.unshift("inprogress"),
                    delete i.stop,
                    o.call(
                      t,
                      function () {
                        T.dequeue(t, e);
                      },
                      i,
                    )),
                  !r && i && i.empty.fire());
              },
              _queueHooks: function (t, e) {
                var n = e + "queueHooks";
                return (
                  ct.get(t, n) ||
                  ct.access(t, n, {
                    empty: T.Callbacks("once memory").add(function () {
                      ct.remove(t, [e + "queue", n]);
                    }),
                  })
                );
              },
            }),
            T.fn.extend({
              queue: function (t, e) {
                var n = 2;
                return (
                  "string" != typeof t && ((e = t), (t = "fx"), n--),
                  arguments.length < n
                    ? T.queue(this[0], t)
                    : void 0 === e
                      ? this
                      : this.each(function () {
                          var n = T.queue(this, t, e);
                          (T._queueHooks(this, t),
                            "fx" === t &&
                              "inprogress" !== n[0] &&
                              T.dequeue(this, t));
                        })
                );
              },
              dequeue: function (t) {
                return this.each(function () {
                  T.dequeue(this, t);
                });
              },
              clearQueue: function (t) {
                return this.queue(t || "fx", []);
              },
              promise: function (t, e) {
                var n,
                  r = 1,
                  o = T.Deferred(),
                  i = this,
                  a = this.length,
                  c = function () {
                    --r || o.resolveWith(i, [i]);
                  };
                for (
                  "string" != typeof t && ((e = t), (t = void 0)),
                    t = t || "fx";
                  a--;

                )
                  (n = ct.get(i[a], t + "queueHooks")) &&
                    n.empty &&
                    (r++, n.empty.add(c));
                return (c(), o.promise(e));
              },
            }));
          var pt = /[+-]?(?:\d*\.|)\d+(?:[eE][+-]?\d+|)/.source,
            ht = new RegExp("^(?:([+-])=|)(" + pt + ")([a-z%]*)$", "i"),
            dt = ["Top", "Right", "Bottom", "Left"],
            vt = b.documentElement,
            yt = function (t) {
              return T.contains(t.ownerDocument, t);
            },
            gt = { composed: !0 };
          vt.getRootNode &&
            (yt = function (t) {
              return (
                T.contains(t.ownerDocument, t) ||
                t.getRootNode(gt) === t.ownerDocument
              );
            });
          var mt = function (t, e) {
            return (
              "none" === (t = e || t).style.display ||
              ("" === t.style.display &&
                yt(t) &&
                "none" === T.css(t, "display"))
            );
          };
          function bt(t, e, n, r) {
            var o,
              i,
              a = 20,
              c = r
                ? function () {
                    return r.cur();
                  }
                : function () {
                    return T.css(t, e, "");
                  },
              s = c(),
              u = (n && n[3]) || (T.cssNumber[e] ? "" : "px"),
              l =
                t.nodeType &&
                (T.cssNumber[e] || ("px" !== u && +s)) &&
                ht.exec(T.css(t, e));
            if (l && l[3] !== u) {
              for (s /= 2, u = u || l[3], l = +s || 1; a--; )
                (T.style(t, e, l + u),
                  (1 - i) * (1 - (i = c() / s || 0.5)) <= 0 && (a = 0),
                  (l /= i));
              ((l *= 2), T.style(t, e, l + u), (n = n || []));
            }
            return (
              n &&
                ((l = +l || +s || 0),
                (o = n[1] ? l + (n[1] + 1) * n[2] : +n[2]),
                r && ((r.unit = u), (r.start = l), (r.end = o))),
              o
            );
          }
          var xt = {};
          function wt(t) {
            var e,
              n = t.ownerDocument,
              r = t.nodeName,
              o = xt[r];
            return (
              o ||
              ((e = n.body.appendChild(n.createElement(r))),
              (o = T.css(e, "display")),
              e.parentNode.removeChild(e),
              "none" === o && (o = "block"),
              (xt[r] = o),
              o)
            );
          }
          function kt(t, e) {
            for (var n, r, o = [], i = 0, a = t.length; i < a; i++)
              (r = t[i]).style &&
                ((n = r.style.display),
                e
                  ? ("none" === n &&
                      ((o[i] = ct.get(r, "display") || null),
                      o[i] || (r.style.display = "")),
                    "" === r.style.display && mt(r) && (o[i] = wt(r)))
                  : "none" !== n && ((o[i] = "none"), ct.set(r, "display", n)));
            for (i = 0; i < a; i++) null != o[i] && (t[i].style.display = o[i]);
            return t;
          }
          T.fn.extend({
            show: function () {
              return kt(this, !0);
            },
            hide: function () {
              return kt(this);
            },
            toggle: function (t) {
              return "boolean" == typeof t
                ? t
                  ? this.show()
                  : this.hide()
                : this.each(function () {
                    mt(this) ? T(this).show() : T(this).hide();
                  });
            },
          });
          var Et,
            jt,
            Tt = /^(?:checkbox|radio)$/i,
            Lt = /<([a-z][^\/\0>\x20\t\r\n\f]*)/i,
            St = /^$|^module$|\/(?:java|ecma)script/i;
          ((Et = b
            .createDocumentFragment()
            .appendChild(b.createElement("div"))),
            (jt = b.createElement("input")).setAttribute("type", "radio"),
            jt.setAttribute("checked", "checked"),
            jt.setAttribute("name", "t"),
            Et.appendChild(jt),
            (y.checkClone = Et.cloneNode(!0).cloneNode(!0).lastChild.checked),
            (Et.innerHTML = "<textarea>x</textarea>"),
            (y.noCloneChecked = !!Et.cloneNode(!0).lastChild.defaultValue),
            (Et.innerHTML = "<option></option>"),
            (y.option = !!Et.lastChild));
          var At = {
            thead: [1, "<table>", "</table>"],
            col: [2, "<table><colgroup>", "</colgroup></table>"],
            tr: [2, "<table><tbody>", "</tbody></table>"],
            td: [3, "<table><tbody><tr>", "</tr></tbody></table>"],
            _default: [0, "", ""],
          };
          function Ot(t, e) {
            var n;
            return (
              (n =
                void 0 !== t.getElementsByTagName
                  ? t.getElementsByTagName(e || "*")
                  : void 0 !== t.querySelectorAll
                    ? t.querySelectorAll(e || "*")
                    : []),
              void 0 === e || (e && S(t, e)) ? T.merge([t], n) : n
            );
          }
          function Ct(t, e) {
            for (var n = 0, r = t.length; n < r; n++)
              ct.set(t[n], "globalEval", !e || ct.get(e[n], "globalEval"));
          }
          ((At.tbody = At.tfoot = At.colgroup = At.caption = At.thead),
            (At.th = At.td),
            y.option ||
              (At.optgroup = At.option =
                [1, "<select multiple='multiple'>", "</select>"]));
          var _t = /<|&#?\w+;/;
          function Nt(t, e, n, r, o) {
            for (
              var i,
                a,
                c,
                s,
                u,
                l,
                f = e.createDocumentFragment(),
                p = [],
                h = 0,
                d = t.length;
              h < d;
              h++
            )
              if ((i = t[h]) || 0 === i)
                if ("object" === k(i)) T.merge(p, i.nodeType ? [i] : i);
                else if (_t.test(i)) {
                  for (
                    a = a || f.appendChild(e.createElement("div")),
                      c = (Lt.exec(i) || ["", ""])[1].toLowerCase(),
                      s = At[c] || At._default,
                      a.innerHTML = s[1] + T.htmlPrefilter(i) + s[2],
                      l = s[0];
                    l--;

                  )
                    a = a.lastChild;
                  (T.merge(p, a.childNodes),
                    ((a = f.firstChild).textContent = ""));
                } else p.push(e.createTextNode(i));
            for (f.textContent = "", h = 0; (i = p[h++]); )
              if (r && T.inArray(i, r) > -1) o && o.push(i);
              else if (
                ((u = yt(i)),
                (a = Ot(f.appendChild(i), "script")),
                u && Ct(a),
                n)
              )
                for (l = 0; (i = a[l++]); ) St.test(i.type || "") && n.push(i);
            return f;
          }
          var Pt = /^([^.]*)(?:\.(.+)|)/;
          function Dt() {
            return !0;
          }
          function qt() {
            return !1;
          }
          function Ht(t, e, n, r, o, i) {
            var a, c;
            if ("object" == typeof e) {
              for (c in ("string" != typeof n && ((r = r || n), (n = void 0)),
              e))
                Ht(t, c, n, r, e[c], i);
              return t;
            }
            if (
              (null == r && null == o
                ? ((o = n), (r = n = void 0))
                : null == o &&
                  ("string" == typeof n
                    ? ((o = r), (r = void 0))
                    : ((o = r), (r = n), (n = void 0))),
              !1 === o)
            )
              o = qt;
            else if (!o) return t;
            return (
              1 === i &&
                ((a = o),
                (o = function (t) {
                  return (T().off(t), a.apply(this, arguments));
                }),
                (o.guid = a.guid || (a.guid = T.guid++))),
              t.each(function () {
                T.event.add(this, e, o, r, n);
              })
            );
          }
          function Rt(t, e, n) {
            n
              ? (ct.set(t, e, !1),
                T.event.add(t, e, {
                  namespace: !1,
                  handler: function (t) {
                    var n,
                      r = ct.get(this, e);
                    if (1 & t.isTrigger && this[e]) {
                      if (r)
                        (T.event.special[e] || {}).delegateType &&
                          t.stopPropagation();
                      else if (
                        ((r = c.call(arguments)),
                        ct.set(this, e, r),
                        this[e](),
                        (n = ct.get(this, e)),
                        ct.set(this, e, !1),
                        r !== n)
                      )
                        return (
                          t.stopImmediatePropagation(),
                          t.preventDefault(),
                          n
                        );
                    } else
                      r &&
                        (ct.set(
                          this,
                          e,
                          T.event.trigger(r[0], r.slice(1), this),
                        ),
                        t.stopPropagation(),
                        (t.isImmediatePropagationStopped = Dt));
                  },
                }))
              : void 0 === ct.get(t, e) && T.event.add(t, e, Dt);
          }
          ((T.event = {
            global: {},
            add: function (t, e, n, r, o) {
              var i,
                a,
                c,
                s,
                u,
                l,
                f,
                p,
                h,
                d,
                v,
                y = ct.get(t);
              if (it(t))
                for (
                  n.handler && ((n = (i = n).handler), (o = i.selector)),
                    o && T.find.matchesSelector(vt, o),
                    n.guid || (n.guid = T.guid++),
                    (s = y.events) || (s = y.events = Object.create(null)),
                    (a = y.handle) ||
                      (a = y.handle =
                        function (e) {
                          return void 0 !== T && T.event.triggered !== e.type
                            ? T.event.dispatch.apply(t, arguments)
                            : void 0;
                        }),
                    u = (e = (e || "").match(X) || [""]).length;
                  u--;

                )
                  ((h = v = (c = Pt.exec(e[u]) || [])[1]),
                    (d = (c[2] || "").split(".").sort()),
                    h &&
                      ((f = T.event.special[h] || {}),
                      (h = (o ? f.delegateType : f.bindType) || h),
                      (f = T.event.special[h] || {}),
                      (l = T.extend(
                        {
                          type: h,
                          origType: v,
                          data: r,
                          handler: n,
                          guid: n.guid,
                          selector: o,
                          needsContext: o && T.expr.match.needsContext.test(o),
                          namespace: d.join("."),
                        },
                        i,
                      )),
                      (p = s[h]) ||
                        (((p = s[h] = []).delegateCount = 0),
                        (f.setup && !1 !== f.setup.call(t, r, d, a)) ||
                          (t.addEventListener && t.addEventListener(h, a))),
                      f.add &&
                        (f.add.call(t, l),
                        l.handler.guid || (l.handler.guid = n.guid)),
                      o ? p.splice(p.delegateCount++, 0, l) : p.push(l),
                      (T.event.global[h] = !0)));
            },
            remove: function (t, e, n, r, o) {
              var i,
                a,
                c,
                s,
                u,
                l,
                f,
                p,
                h,
                d,
                v,
                y = ct.hasData(t) && ct.get(t);
              if (y && (s = y.events)) {
                for (u = (e = (e || "").match(X) || [""]).length; u--; )
                  if (
                    ((h = v = (c = Pt.exec(e[u]) || [])[1]),
                    (d = (c[2] || "").split(".").sort()),
                    h)
                  ) {
                    for (
                      f = T.event.special[h] || {},
                        p =
                          s[(h = (r ? f.delegateType : f.bindType) || h)] || [],
                        c =
                          c[2] &&
                          new RegExp(
                            "(^|\\.)" + d.join("\\.(?:.*\\.|)") + "(\\.|$)",
                          ),
                        a = i = p.length;
                      i--;

                    )
                      ((l = p[i]),
                        (!o && v !== l.origType) ||
                          (n && n.guid !== l.guid) ||
                          (c && !c.test(l.namespace)) ||
                          (r &&
                            r !== l.selector &&
                            ("**" !== r || !l.selector)) ||
                          (p.splice(i, 1),
                          l.selector && p.delegateCount--,
                          f.remove && f.remove.call(t, l)));
                    a &&
                      !p.length &&
                      ((f.teardown && !1 !== f.teardown.call(t, d, y.handle)) ||
                        T.removeEvent(t, h, y.handle),
                      delete s[h]);
                  } else for (h in s) T.event.remove(t, h + e[u], n, r, !0);
                T.isEmptyObject(s) && ct.remove(t, "handle events");
              }
            },
            dispatch: function (t) {
              var e,
                n,
                r,
                o,
                i,
                a,
                c = new Array(arguments.length),
                s = T.event.fix(t),
                u =
                  (ct.get(this, "events") || Object.create(null))[s.type] || [],
                l = T.event.special[s.type] || {};
              for (c[0] = s, e = 1; e < arguments.length; e++)
                c[e] = arguments[e];
              if (
                ((s.delegateTarget = this),
                !l.preDispatch || !1 !== l.preDispatch.call(this, s))
              ) {
                for (
                  a = T.event.handlers.call(this, s, u), e = 0;
                  (o = a[e++]) && !s.isPropagationStopped();

                )
                  for (
                    s.currentTarget = o.elem, n = 0;
                    (i = o.handlers[n++]) && !s.isImmediatePropagationStopped();

                  )
                    (s.rnamespace &&
                      !1 !== i.namespace &&
                      !s.rnamespace.test(i.namespace)) ||
                      ((s.handleObj = i),
                      (s.data = i.data),
                      void 0 !==
                        (r = (
                          (T.event.special[i.origType] || {}).handle ||
                          i.handler
                        ).apply(o.elem, c)) &&
                        !1 === (s.result = r) &&
                        (s.preventDefault(), s.stopPropagation()));
                return (
                  l.postDispatch && l.postDispatch.call(this, s),
                  s.result
                );
              }
            },
            handlers: function (t, e) {
              var n,
                r,
                o,
                i,
                a,
                c = [],
                s = e.delegateCount,
                u = t.target;
              if (s && u.nodeType && !("click" === t.type && t.button >= 1))
                for (; u !== this; u = u.parentNode || this)
                  if (
                    1 === u.nodeType &&
                    ("click" !== t.type || !0 !== u.disabled)
                  ) {
                    for (i = [], a = {}, n = 0; n < s; n++)
                      (void 0 === a[(o = (r = e[n]).selector + " ")] &&
                        (a[o] = r.needsContext
                          ? T(o, this).index(u) > -1
                          : T.find(o, this, null, [u]).length),
                        a[o] && i.push(r));
                    i.length && c.push({ elem: u, handlers: i });
                  }
              return (
                (u = this),
                s < e.length && c.push({ elem: u, handlers: e.slice(s) }),
                c
              );
            },
            addProp: function (t, e) {
              Object.defineProperty(T.Event.prototype, t, {
                enumerable: !0,
                configurable: !0,
                get: g(e)
                  ? function () {
                      if (this.originalEvent) return e(this.originalEvent);
                    }
                  : function () {
                      if (this.originalEvent) return this.originalEvent[t];
                    },
                set: function (e) {
                  Object.defineProperty(this, t, {
                    enumerable: !0,
                    configurable: !0,
                    writable: !0,
                    value: e,
                  });
                },
              });
            },
            fix: function (t) {
              return t[T.expando] ? t : new T.Event(t);
            },
            special: {
              load: { noBubble: !0 },
              click: {
                setup: function (t) {
                  var e = this || t;
                  return (
                    Tt.test(e.type) &&
                      e.click &&
                      S(e, "input") &&
                      Rt(e, "click", !0),
                    !1
                  );
                },
                trigger: function (t) {
                  var e = this || t;
                  return (
                    Tt.test(e.type) &&
                      e.click &&
                      S(e, "input") &&
                      Rt(e, "click"),
                    !0
                  );
                },
                _default: function (t) {
                  var e = t.target;
                  return (
                    (Tt.test(e.type) &&
                      e.click &&
                      S(e, "input") &&
                      ct.get(e, "click")) ||
                    S(e, "a")
                  );
                },
              },
              beforeunload: {
                postDispatch: function (t) {
                  void 0 !== t.result &&
                    t.originalEvent &&
                    (t.originalEvent.returnValue = t.result);
                },
              },
            },
          }),
            (T.removeEvent = function (t, e, n) {
              t.removeEventListener && t.removeEventListener(e, n);
            }),
            (T.Event = function (t, e) {
              if (!(this instanceof T.Event)) return new T.Event(t, e);
              (t && t.type
                ? ((this.originalEvent = t),
                  (this.type = t.type),
                  (this.isDefaultPrevented =
                    t.defaultPrevented ||
                    (void 0 === t.defaultPrevented && !1 === t.returnValue)
                      ? Dt
                      : qt),
                  (this.target =
                    t.target && 3 === t.target.nodeType
                      ? t.target.parentNode
                      : t.target),
                  (this.currentTarget = t.currentTarget),
                  (this.relatedTarget = t.relatedTarget))
                : (this.type = t),
                e && T.extend(this, e),
                (this.timeStamp = (t && t.timeStamp) || Date.now()),
                (this[T.expando] = !0));
            }),
            (T.Event.prototype = {
              constructor: T.Event,
              isDefaultPrevented: qt,
              isPropagationStopped: qt,
              isImmediatePropagationStopped: qt,
              isSimulated: !1,
              preventDefault: function () {
                var t = this.originalEvent;
                ((this.isDefaultPrevented = Dt),
                  t && !this.isSimulated && t.preventDefault());
              },
              stopPropagation: function () {
                var t = this.originalEvent;
                ((this.isPropagationStopped = Dt),
                  t && !this.isSimulated && t.stopPropagation());
              },
              stopImmediatePropagation: function () {
                var t = this.originalEvent;
                ((this.isImmediatePropagationStopped = Dt),
                  t && !this.isSimulated && t.stopImmediatePropagation(),
                  this.stopPropagation());
              },
            }),
            T.each(
              {
                altKey: !0,
                bubbles: !0,
                cancelable: !0,
                changedTouches: !0,
                ctrlKey: !0,
                detail: !0,
                eventPhase: !0,
                metaKey: !0,
                pageX: !0,
                pageY: !0,
                shiftKey: !0,
                view: !0,
                char: !0,
                code: !0,
                charCode: !0,
                key: !0,
                keyCode: !0,
                button: !0,
                buttons: !0,
                clientX: !0,
                clientY: !0,
                offsetX: !0,
                offsetY: !0,
                pointerId: !0,
                pointerType: !0,
                screenX: !0,
                screenY: !0,
                targetTouches: !0,
                toElement: !0,
                touches: !0,
                which: !0,
              },
              T.event.addProp,
            ),
            T.each({ focus: "focusin", blur: "focusout" }, function (t, e) {
              function n(t) {
                if (b.documentMode) {
                  var n = ct.get(this, "handle"),
                    r = T.event.fix(t);
                  ((r.type = "focusin" === t.type ? "focus" : "blur"),
                    (r.isSimulated = !0),
                    n(t),
                    r.target === r.currentTarget && n(r));
                } else T.event.simulate(e, t.target, T.event.fix(t));
              }
              ((T.event.special[t] = {
                setup: function () {
                  var r;
                  if ((Rt(this, t, !0), !b.documentMode)) return !1;
                  ((r = ct.get(this, e)) || this.addEventListener(e, n),
                    ct.set(this, e, (r || 0) + 1));
                },
                trigger: function () {
                  return (Rt(this, t), !0);
                },
                teardown: function () {
                  var t;
                  if (!b.documentMode) return !1;
                  (t = ct.get(this, e) - 1)
                    ? ct.set(this, e, t)
                    : (this.removeEventListener(e, n), ct.remove(this, e));
                },
                _default: function (e) {
                  return ct.get(e.target, t);
                },
                delegateType: e,
              }),
                (T.event.special[e] = {
                  setup: function () {
                    var r = this.ownerDocument || this.document || this,
                      o = b.documentMode ? this : r,
                      i = ct.get(o, e);
                    (i ||
                      (b.documentMode
                        ? this.addEventListener(e, n)
                        : r.addEventListener(t, n, !0)),
                      ct.set(o, e, (i || 0) + 1));
                  },
                  teardown: function () {
                    var r = this.ownerDocument || this.document || this,
                      o = b.documentMode ? this : r,
                      i = ct.get(o, e) - 1;
                    i
                      ? ct.set(o, e, i)
                      : (b.documentMode
                          ? this.removeEventListener(e, n)
                          : r.removeEventListener(t, n, !0),
                        ct.remove(o, e));
                  },
                }));
            }),
            T.each(
              {
                mouseenter: "mouseover",
                mouseleave: "mouseout",
                pointerenter: "pointerover",
                pointerleave: "pointerout",
              },
              function (t, e) {
                T.event.special[t] = {
                  delegateType: e,
                  bindType: e,
                  handle: function (t) {
                    var n,
                      r = t.relatedTarget,
                      o = t.handleObj;
                    return (
                      (r && (r === this || T.contains(this, r))) ||
                        ((t.type = o.origType),
                        (n = o.handler.apply(this, arguments)),
                        (t.type = e)),
                      n
                    );
                  },
                };
              },
            ),
            T.fn.extend({
              on: function (t, e, n, r) {
                return Ht(this, t, e, n, r);
              },
              one: function (t, e, n, r) {
                return Ht(this, t, e, n, r, 1);
              },
              off: function (t, e, n) {
                var r, o;
                if (t && t.preventDefault && t.handleObj)
                  return (
                    (r = t.handleObj),
                    T(t.delegateTarget).off(
                      r.namespace ? r.origType + "." + r.namespace : r.origType,
                      r.selector,
                      r.handler,
                    ),
                    this
                  );
                if ("object" == typeof t) {
                  for (o in t) this.off(o, e, t[o]);
                  return this;
                }
                return (
                  (!1 !== e && "function" != typeof e) ||
                    ((n = e), (e = void 0)),
                  !1 === n && (n = qt),
                  this.each(function () {
                    T.event.remove(this, t, n, e);
                  })
                );
              },
            }));
          var It = /<script|<style|<link/i,
            Ft = /checked\s*(?:[^=]|=\s*.checked.)/i,
            Mt = /^\s*<!\[CDATA\[|\]\]>\s*$/g;
          function Gt(t, e) {
            return (
              (S(t, "table") &&
                S(11 !== e.nodeType ? e : e.firstChild, "tr") &&
                T(t).children("tbody")[0]) ||
              t
            );
          }
          function zt(t) {
            return (
              (t.type = (null !== t.getAttribute("type")) + "/" + t.type),
              t
            );
          }
          function Wt(t) {
            return (
              "true/" === (t.type || "").slice(0, 5)
                ? (t.type = t.type.slice(5))
                : t.removeAttribute("type"),
              t
            );
          }
          function Bt(t, e) {
            var n, r, o, i, a, c;
            if (1 === e.nodeType) {
              if (ct.hasData(t) && (c = ct.get(t).events))
                for (o in (ct.remove(e, "handle events"), c))
                  for (n = 0, r = c[o].length; n < r; n++)
                    T.event.add(e, o, c[o][n]);
              st.hasData(t) &&
                ((i = st.access(t)), (a = T.extend({}, i)), st.set(e, a));
            }
          }
          function $t(t, e) {
            var n = e.nodeName.toLowerCase();
            "input" === n && Tt.test(t.type)
              ? (e.checked = t.checked)
              : ("input" !== n && "textarea" !== n) ||
                (e.defaultValue = t.defaultValue);
          }
          function Ut(t, e, n, r) {
            e = s(e);
            var o,
              i,
              a,
              c,
              u,
              l,
              f = 0,
              p = t.length,
              h = p - 1,
              d = e[0],
              v = g(d);
            if (
              v ||
              (p > 1 && "string" == typeof d && !y.checkClone && Ft.test(d))
            )
              return t.each(function (o) {
                var i = t.eq(o);
                (v && (e[0] = d.call(this, o, i.html())), Ut(i, e, n, r));
              });
            if (
              p &&
              ((i = (o = Nt(e, t[0].ownerDocument, !1, t, r)).firstChild),
              1 === o.childNodes.length && (o = i),
              i || r)
            ) {
              for (c = (a = T.map(Ot(o, "script"), zt)).length; f < p; f++)
                ((u = o),
                  f !== h &&
                    ((u = T.clone(u, !0, !0)),
                    c && T.merge(a, Ot(u, "script"))),
                  n.call(t[f], u, f));
              if (c)
                for (
                  l = a[a.length - 1].ownerDocument, T.map(a, Wt), f = 0;
                  f < c;
                  f++
                )
                  ((u = a[f]),
                    St.test(u.type || "") &&
                      !ct.access(u, "globalEval") &&
                      T.contains(l, u) &&
                      (u.src && "module" !== (u.type || "").toLowerCase()
                        ? T._evalUrl &&
                          !u.noModule &&
                          T._evalUrl(
                            u.src,
                            { nonce: u.nonce || u.getAttribute("nonce") },
                            l,
                          )
                        : w(u.textContent.replace(Mt, ""), u, l)));
            }
            return t;
          }
          function Xt(t, e, n) {
            for (
              var r, o = e ? T.filter(e, t) : t, i = 0;
              null != (r = o[i]);
              i++
            )
              (n || 1 !== r.nodeType || T.cleanData(Ot(r)),
                r.parentNode &&
                  (n && yt(r) && Ct(Ot(r, "script")),
                  r.parentNode.removeChild(r)));
            return t;
          }
          (T.extend({
            htmlPrefilter: function (t) {
              return t;
            },
            clone: function (t, e, n) {
              var r,
                o,
                i,
                a,
                c = t.cloneNode(!0),
                s = yt(t);
              if (
                !(
                  y.noCloneChecked ||
                  (1 !== t.nodeType && 11 !== t.nodeType) ||
                  T.isXMLDoc(t)
                )
              )
                for (a = Ot(c), r = 0, o = (i = Ot(t)).length; r < o; r++)
                  $t(i[r], a[r]);
              if (e)
                if (n)
                  for (
                    i = i || Ot(t), a = a || Ot(c), r = 0, o = i.length;
                    r < o;
                    r++
                  )
                    Bt(i[r], a[r]);
                else Bt(t, c);
              return (
                (a = Ot(c, "script")).length > 0 &&
                  Ct(a, !s && Ot(t, "script")),
                c
              );
            },
            cleanData: function (t) {
              for (
                var e, n, r, o = T.event.special, i = 0;
                void 0 !== (n = t[i]);
                i++
              )
                if (it(n)) {
                  if ((e = n[ct.expando])) {
                    if (e.events)
                      for (r in e.events)
                        o[r]
                          ? T.event.remove(n, r)
                          : T.removeEvent(n, r, e.handle);
                    n[ct.expando] = void 0;
                  }
                  n[st.expando] && (n[st.expando] = void 0);
                }
            },
          }),
            T.fn.extend({
              detach: function (t) {
                return Xt(this, t, !0);
              },
              remove: function (t) {
                return Xt(this, t);
              },
              text: function (t) {
                return tt(
                  this,
                  function (t) {
                    return void 0 === t
                      ? T.text(this)
                      : this.empty().each(function () {
                          (1 !== this.nodeType &&
                            11 !== this.nodeType &&
                            9 !== this.nodeType) ||
                            (this.textContent = t);
                        });
                  },
                  null,
                  t,
                  arguments.length,
                );
              },
              append: function () {
                return Ut(this, arguments, function (t) {
                  (1 !== this.nodeType &&
                    11 !== this.nodeType &&
                    9 !== this.nodeType) ||
                    Gt(this, t).appendChild(t);
                });
              },
              prepend: function () {
                return Ut(this, arguments, function (t) {
                  if (
                    1 === this.nodeType ||
                    11 === this.nodeType ||
                    9 === this.nodeType
                  ) {
                    var e = Gt(this, t);
                    e.insertBefore(t, e.firstChild);
                  }
                });
              },
              before: function () {
                return Ut(this, arguments, function (t) {
                  this.parentNode && this.parentNode.insertBefore(t, this);
                });
              },
              after: function () {
                return Ut(this, arguments, function (t) {
                  this.parentNode &&
                    this.parentNode.insertBefore(t, this.nextSibling);
                });
              },
              empty: function () {
                for (var t, e = 0; null != (t = this[e]); e++)
                  1 === t.nodeType &&
                    (T.cleanData(Ot(t, !1)), (t.textContent = ""));
                return this;
              },
              clone: function (t, e) {
                return (
                  (t = null != t && t),
                  (e = null == e ? t : e),
                  this.map(function () {
                    return T.clone(this, t, e);
                  })
                );
              },
              html: function (t) {
                return tt(
                  this,
                  function (t) {
                    var e = this[0] || {},
                      n = 0,
                      r = this.length;
                    if (void 0 === t && 1 === e.nodeType) return e.innerHTML;
                    if (
                      "string" == typeof t &&
                      !It.test(t) &&
                      !At[(Lt.exec(t) || ["", ""])[1].toLowerCase()]
                    ) {
                      t = T.htmlPrefilter(t);
                      try {
                        for (; n < r; n++)
                          1 === (e = this[n] || {}).nodeType &&
                            (T.cleanData(Ot(e, !1)), (e.innerHTML = t));
                        e = 0;
                      } catch (t) {}
                    }
                    e && this.empty().append(t);
                  },
                  null,
                  t,
                  arguments.length,
                );
              },
              replaceWith: function () {
                var t = [];
                return Ut(
                  this,
                  arguments,
                  function (e) {
                    var n = this.parentNode;
                    T.inArray(this, t) < 0 &&
                      (T.cleanData(Ot(this)), n && n.replaceChild(e, this));
                  },
                  t,
                );
              },
            }),
            T.each(
              {
                appendTo: "append",
                prependTo: "prepend",
                insertBefore: "before",
                insertAfter: "after",
                replaceAll: "replaceWith",
              },
              function (t, e) {
                T.fn[t] = function (t) {
                  for (
                    var n, r = [], o = T(t), i = o.length - 1, a = 0;
                    a <= i;
                    a++
                  )
                    ((n = a === i ? this : this.clone(!0)),
                      T(o[a])[e](n),
                      u.apply(r, n.get()));
                  return this.pushStack(r);
                };
              },
            ));
          var Yt = new RegExp("^(" + pt + ")(?!px)[a-z%]+$", "i"),
            Vt = /^--/,
            Jt = function (t) {
              var e = t.ownerDocument.defaultView;
              return ((e && e.opener) || (e = r), e.getComputedStyle(t));
            },
            Qt = function (t, e, n) {
              var r,
                o,
                i = {};
              for (o in e) ((i[o] = t.style[o]), (t.style[o] = e[o]));
              for (o in ((r = n.call(t)), e)) t.style[o] = i[o];
              return r;
            },
            Kt = new RegExp(dt.join("|"), "i");
          function Zt(t, e, n) {
            var r,
              o,
              i,
              a,
              c = Vt.test(e),
              s = t.style;
            return (
              (n = n || Jt(t)) &&
                ((a = n.getPropertyValue(e) || n[e]),
                c && a && (a = a.replace(N, "$1") || void 0),
                "" !== a || yt(t) || (a = T.style(t, e)),
                !y.pixelBoxStyles() &&
                  Yt.test(a) &&
                  Kt.test(e) &&
                  ((r = s.width),
                  (o = s.minWidth),
                  (i = s.maxWidth),
                  (s.minWidth = s.maxWidth = s.width = a),
                  (a = n.width),
                  (s.width = r),
                  (s.minWidth = o),
                  (s.maxWidth = i))),
              void 0 !== a ? a + "" : a
            );
          }
          function te(t, e) {
            return {
              get: function () {
                if (!t()) return (this.get = e).apply(this, arguments);
                delete this.get;
              },
            };
          }
          !(function () {
            function t() {
              if (l) {
                ((u.style.cssText =
                  "position:absolute;left:-11111px;width:60px;margin-top:1px;padding:0;border:0"),
                  (l.style.cssText =
                    "position:relative;display:block;box-sizing:border-box;overflow:scroll;margin:auto;border:1px;padding:1px;width:60%;top:1%"),
                  vt.appendChild(u).appendChild(l));
                var t = r.getComputedStyle(l);
                ((n = "1%" !== t.top),
                  (s = 12 === e(t.marginLeft)),
                  (l.style.right = "60%"),
                  (a = 36 === e(t.right)),
                  (o = 36 === e(t.width)),
                  (l.style.position = "absolute"),
                  (i = 12 === e(l.offsetWidth / 3)),
                  vt.removeChild(u),
                  (l = null));
              }
            }
            function e(t) {
              return Math.round(parseFloat(t));
            }
            var n,
              o,
              i,
              a,
              c,
              s,
              u = b.createElement("div"),
              l = b.createElement("div");
            l.style &&
              ((l.style.backgroundClip = "content-box"),
              (l.cloneNode(!0).style.backgroundClip = ""),
              (y.clearCloneStyle = "content-box" === l.style.backgroundClip),
              T.extend(y, {
                boxSizingReliable: function () {
                  return (t(), o);
                },
                pixelBoxStyles: function () {
                  return (t(), a);
                },
                pixelPosition: function () {
                  return (t(), n);
                },
                reliableMarginLeft: function () {
                  return (t(), s);
                },
                scrollboxSize: function () {
                  return (t(), i);
                },
                reliableTrDimensions: function () {
                  var t, e, n, o;
                  return (
                    null == c &&
                      ((t = b.createElement("table")),
                      (e = b.createElement("tr")),
                      (n = b.createElement("div")),
                      (t.style.cssText =
                        "position:absolute;left:-11111px;border-collapse:separate"),
                      (e.style.cssText =
                        "box-sizing:content-box;border:1px solid"),
                      (e.style.height = "1px"),
                      (n.style.height = "9px"),
                      (n.style.display = "block"),
                      vt.appendChild(t).appendChild(e).appendChild(n),
                      (o = r.getComputedStyle(e)),
                      (c =
                        parseInt(o.height, 10) +
                          parseInt(o.borderTopWidth, 10) +
                          parseInt(o.borderBottomWidth, 10) ===
                        e.offsetHeight),
                      vt.removeChild(t)),
                    c
                  );
                },
              }));
          })();
          var ee = ["Webkit", "Moz", "ms"],
            ne = b.createElement("div").style,
            re = {};
          function oe(t) {
            var e = T.cssProps[t] || re[t];
            return (
              e ||
              (t in ne
                ? t
                : (re[t] =
                    (function (t) {
                      for (
                        var e = t[0].toUpperCase() + t.slice(1), n = ee.length;
                        n--;

                      )
                        if ((t = ee[n] + e) in ne) return t;
                    })(t) || t))
            );
          }
          var ie = /^(none|table(?!-c[ea]).+)/,
            ae = {
              position: "absolute",
              visibility: "hidden",
              display: "block",
            },
            ce = { letterSpacing: "0", fontWeight: "400" };
          function se(t, e, n) {
            var r = ht.exec(e);
            return r ? Math.max(0, r[2] - (n || 0)) + (r[3] || "px") : e;
          }
          function ue(t, e, n, r, o, i) {
            var a = "width" === e ? 1 : 0,
              c = 0,
              s = 0,
              u = 0;
            if (n === (r ? "border" : "content")) return 0;
            for (; a < 4; a += 2)
              ("margin" === n && (u += T.css(t, n + dt[a], !0, o)),
                r
                  ? ("content" === n &&
                      (s -= T.css(t, "padding" + dt[a], !0, o)),
                    "margin" !== n &&
                      (s -= T.css(t, "border" + dt[a] + "Width", !0, o)))
                  : ((s += T.css(t, "padding" + dt[a], !0, o)),
                    "padding" !== n
                      ? (s += T.css(t, "border" + dt[a] + "Width", !0, o))
                      : (c += T.css(t, "border" + dt[a] + "Width", !0, o))));
            return (
              !r &&
                i >= 0 &&
                (s +=
                  Math.max(
                    0,
                    Math.ceil(
                      t["offset" + e[0].toUpperCase() + e.slice(1)] -
                        i -
                        s -
                        c -
                        0.5,
                    ),
                  ) || 0),
              s + u
            );
          }
          function le(t, e, n) {
            var r = Jt(t),
              o =
                (!y.boxSizingReliable() || n) &&
                "border-box" === T.css(t, "boxSizing", !1, r),
              i = o,
              a = Zt(t, e, r),
              c = "offset" + e[0].toUpperCase() + e.slice(1);
            if (Yt.test(a)) {
              if (!n) return a;
              a = "auto";
            }
            return (
              ((!y.boxSizingReliable() && o) ||
                (!y.reliableTrDimensions() && S(t, "tr")) ||
                "auto" === a ||
                (!parseFloat(a) && "inline" === T.css(t, "display", !1, r))) &&
                t.getClientRects().length &&
                ((o = "border-box" === T.css(t, "boxSizing", !1, r)),
                (i = c in t) && (a = t[c])),
              (a = parseFloat(a) || 0) +
                ue(t, e, n || (o ? "border" : "content"), i, r, a) +
                "px"
            );
          }
          function fe(t, e, n, r, o) {
            return new fe.prototype.init(t, e, n, r, o);
          }
          (T.extend({
            cssHooks: {
              opacity: {
                get: function (t, e) {
                  if (e) {
                    var n = Zt(t, "opacity");
                    return "" === n ? "1" : n;
                  }
                },
              },
            },
            cssNumber: {
              animationIterationCount: !0,
              aspectRatio: !0,
              borderImageSlice: !0,
              columnCount: !0,
              flexGrow: !0,
              flexShrink: !0,
              fontWeight: !0,
              gridArea: !0,
              gridColumn: !0,
              gridColumnEnd: !0,
              gridColumnStart: !0,
              gridRow: !0,
              gridRowEnd: !0,
              gridRowStart: !0,
              lineHeight: !0,
              opacity: !0,
              order: !0,
              orphans: !0,
              scale: !0,
              widows: !0,
              zIndex: !0,
              zoom: !0,
              fillOpacity: !0,
              floodOpacity: !0,
              stopOpacity: !0,
              strokeMiterlimit: !0,
              strokeOpacity: !0,
            },
            cssProps: {},
            style: function (t, e, n, r) {
              if (t && 3 !== t.nodeType && 8 !== t.nodeType && t.style) {
                var o,
                  i,
                  a,
                  c = ot(e),
                  s = Vt.test(e),
                  u = t.style;
                if (
                  (s || (e = oe(c)),
                  (a = T.cssHooks[e] || T.cssHooks[c]),
                  void 0 === n)
                )
                  return a && "get" in a && void 0 !== (o = a.get(t, !1, r))
                    ? o
                    : u[e];
                ("string" === (i = typeof n) &&
                  (o = ht.exec(n)) &&
                  o[1] &&
                  ((n = bt(t, e, o)), (i = "number")),
                  null != n &&
                    n == n &&
                    ("number" !== i ||
                      s ||
                      (n += (o && o[3]) || (T.cssNumber[c] ? "" : "px")),
                    y.clearCloneStyle ||
                      "" !== n ||
                      0 !== e.indexOf("background") ||
                      (u[e] = "inherit"),
                    (a && "set" in a && void 0 === (n = a.set(t, n, r))) ||
                      (s ? u.setProperty(e, n) : (u[e] = n))));
              }
            },
            css: function (t, e, n, r) {
              var o,
                i,
                a,
                c = ot(e);
              return (
                Vt.test(e) || (e = oe(c)),
                (a = T.cssHooks[e] || T.cssHooks[c]) &&
                  "get" in a &&
                  (o = a.get(t, !0, n)),
                void 0 === o && (o = Zt(t, e, r)),
                "normal" === o && e in ce && (o = ce[e]),
                "" === n || n
                  ? ((i = parseFloat(o)), !0 === n || isFinite(i) ? i || 0 : o)
                  : o
              );
            },
          }),
            T.each(["height", "width"], function (t, e) {
              T.cssHooks[e] = {
                get: function (t, n, r) {
                  if (n)
                    return !ie.test(T.css(t, "display")) ||
                      (t.getClientRects().length &&
                        t.getBoundingClientRect().width)
                      ? le(t, e, r)
                      : Qt(t, ae, function () {
                          return le(t, e, r);
                        });
                },
                set: function (t, n, r) {
                  var o,
                    i = Jt(t),
                    a = !y.scrollboxSize() && "absolute" === i.position,
                    c =
                      (a || r) && "border-box" === T.css(t, "boxSizing", !1, i),
                    s = r ? ue(t, e, r, c, i) : 0;
                  return (
                    c &&
                      a &&
                      (s -= Math.ceil(
                        t["offset" + e[0].toUpperCase() + e.slice(1)] -
                          parseFloat(i[e]) -
                          ue(t, e, "border", !1, i) -
                          0.5,
                      )),
                    s &&
                      (o = ht.exec(n)) &&
                      "px" !== (o[3] || "px") &&
                      ((t.style[e] = n), (n = T.css(t, e))),
                    se(0, n, s)
                  );
                },
              };
            }),
            (T.cssHooks.marginLeft = te(y.reliableMarginLeft, function (t, e) {
              if (e)
                return (
                  (parseFloat(Zt(t, "marginLeft")) ||
                    t.getBoundingClientRect().left -
                      Qt(t, { marginLeft: 0 }, function () {
                        return t.getBoundingClientRect().left;
                      })) + "px"
                );
            })),
            T.each(
              { margin: "", padding: "", border: "Width" },
              function (t, e) {
                ((T.cssHooks[t + e] = {
                  expand: function (n) {
                    for (
                      var r = 0,
                        o = {},
                        i = "string" == typeof n ? n.split(" ") : [n];
                      r < 4;
                      r++
                    )
                      o[t + dt[r] + e] = i[r] || i[r - 2] || i[0];
                    return o;
                  },
                }),
                  "margin" !== t && (T.cssHooks[t + e].set = se));
              },
            ),
            T.fn.extend({
              css: function (t, e) {
                return tt(
                  this,
                  function (t, e, n) {
                    var r,
                      o,
                      i = {},
                      a = 0;
                    if (Array.isArray(e)) {
                      for (r = Jt(t), o = e.length; a < o; a++)
                        i[e[a]] = T.css(t, e[a], !1, r);
                      return i;
                    }
                    return void 0 !== n ? T.style(t, e, n) : T.css(t, e);
                  },
                  t,
                  e,
                  arguments.length > 1,
                );
              },
            }),
            (T.Tween = fe),
            (fe.prototype = {
              constructor: fe,
              init: function (t, e, n, r, o, i) {
                ((this.elem = t),
                  (this.prop = n),
                  (this.easing = o || T.easing._default),
                  (this.options = e),
                  (this.start = this.now = this.cur()),
                  (this.end = r),
                  (this.unit = i || (T.cssNumber[n] ? "" : "px")));
              },
              cur: function () {
                var t = fe.propHooks[this.prop];
                return t && t.get
                  ? t.get(this)
                  : fe.propHooks._default.get(this);
              },
              run: function (t) {
                var e,
                  n = fe.propHooks[this.prop];
                return (
                  this.options.duration
                    ? (this.pos = e =
                        T.easing[this.easing](
                          t,
                          this.options.duration * t,
                          0,
                          1,
                          this.options.duration,
                        ))
                    : (this.pos = e = t),
                  (this.now = (this.end - this.start) * e + this.start),
                  this.options.step &&
                    this.options.step.call(this.elem, this.now, this),
                  n && n.set ? n.set(this) : fe.propHooks._default.set(this),
                  this
                );
              },
            }),
            (fe.prototype.init.prototype = fe.prototype),
            (fe.propHooks = {
              _default: {
                get: function (t) {
                  var e;
                  return 1 !== t.elem.nodeType ||
                    (null != t.elem[t.prop] && null == t.elem.style[t.prop])
                    ? t.elem[t.prop]
                    : (e = T.css(t.elem, t.prop, "")) && "auto" !== e
                      ? e
                      : 0;
                },
                set: function (t) {
                  T.fx.step[t.prop]
                    ? T.fx.step[t.prop](t)
                    : 1 !== t.elem.nodeType ||
                        (!T.cssHooks[t.prop] &&
                          null == t.elem.style[oe(t.prop)])
                      ? (t.elem[t.prop] = t.now)
                      : T.style(t.elem, t.prop, t.now + t.unit);
                },
              },
            }),
            (fe.propHooks.scrollTop = fe.propHooks.scrollLeft =
              {
                set: function (t) {
                  t.elem.nodeType &&
                    t.elem.parentNode &&
                    (t.elem[t.prop] = t.now);
                },
              }),
            (T.easing = {
              linear: function (t) {
                return t;
              },
              swing: function (t) {
                return 0.5 - Math.cos(t * Math.PI) / 2;
              },
              _default: "swing",
            }),
            (T.fx = fe.prototype.init),
            (T.fx.step = {}));
          var pe,
            he,
            de = /^(?:toggle|show|hide)$/,
            ve = /queueHooks$/;
          function ye() {
            he &&
              (!1 === b.hidden && r.requestAnimationFrame
                ? r.requestAnimationFrame(ye)
                : r.setTimeout(ye, T.fx.interval),
              T.fx.tick());
          }
          function ge() {
            return (
              r.setTimeout(function () {
                pe = void 0;
              }),
              (pe = Date.now())
            );
          }
          function me(t, e) {
            var n,
              r = 0,
              o = { height: t };
            for (e = e ? 1 : 0; r < 4; r += 2 - e)
              o["margin" + (n = dt[r])] = o["padding" + n] = t;
            return (e && (o.opacity = o.width = t), o);
          }
          function be(t, e, n) {
            for (
              var r,
                o = (xe.tweeners[e] || []).concat(xe.tweeners["*"]),
                i = 0,
                a = o.length;
              i < a;
              i++
            )
              if ((r = o[i].call(n, e, t))) return r;
          }
          function xe(t, e, n) {
            var r,
              o,
              i = 0,
              a = xe.prefilters.length,
              c = T.Deferred().always(function () {
                delete s.elem;
              }),
              s = function () {
                if (o) return !1;
                for (
                  var e = pe || ge(),
                    n = Math.max(0, u.startTime + u.duration - e),
                    r = 1 - (n / u.duration || 0),
                    i = 0,
                    a = u.tweens.length;
                  i < a;
                  i++
                )
                  u.tweens[i].run(r);
                return (
                  c.notifyWith(t, [u, r, n]),
                  r < 1 && a
                    ? n
                    : (a || c.notifyWith(t, [u, 1, 0]),
                      c.resolveWith(t, [u]),
                      !1)
                );
              },
              u = c.promise({
                elem: t,
                props: T.extend({}, e),
                opts: T.extend(
                  !0,
                  { specialEasing: {}, easing: T.easing._default },
                  n,
                ),
                originalProperties: e,
                originalOptions: n,
                startTime: pe || ge(),
                duration: n.duration,
                tweens: [],
                createTween: function (e, n) {
                  var r = T.Tween(
                    t,
                    u.opts,
                    e,
                    n,
                    u.opts.specialEasing[e] || u.opts.easing,
                  );
                  return (u.tweens.push(r), r);
                },
                stop: function (e) {
                  var n = 0,
                    r = e ? u.tweens.length : 0;
                  if (o) return this;
                  for (o = !0; n < r; n++) u.tweens[n].run(1);
                  return (
                    e
                      ? (c.notifyWith(t, [u, 1, 0]), c.resolveWith(t, [u, e]))
                      : c.rejectWith(t, [u, e]),
                    this
                  );
                },
              }),
              l = u.props;
            for (
              !(function (t, e) {
                var n, r, o, i, a;
                for (n in t)
                  if (
                    ((o = e[(r = ot(n))]),
                    (i = t[n]),
                    Array.isArray(i) && ((o = i[1]), (i = t[n] = i[0])),
                    n !== r && ((t[r] = i), delete t[n]),
                    (a = T.cssHooks[r]) && ("expand" in a))
                  )
                    for (n in ((i = a.expand(i)), delete t[r], i))
                      (n in t) || ((t[n] = i[n]), (e[n] = o));
                  else e[r] = o;
              })(l, u.opts.specialEasing);
              i < a;
              i++
            )
              if ((r = xe.prefilters[i].call(u, t, l, u.opts)))
                return (
                  g(r.stop) &&
                    (T._queueHooks(u.elem, u.opts.queue).stop = r.stop.bind(r)),
                  r
                );
            return (
              T.map(l, be, u),
              g(u.opts.start) && u.opts.start.call(t, u),
              u
                .progress(u.opts.progress)
                .done(u.opts.done, u.opts.complete)
                .fail(u.opts.fail)
                .always(u.opts.always),
              T.fx.timer(
                T.extend(s, { elem: t, anim: u, queue: u.opts.queue }),
              ),
              u
            );
          }
          ((T.Animation = T.extend(xe, {
            tweeners: {
              "*": [
                function (t, e) {
                  var n = this.createTween(t, e);
                  return (bt(n.elem, t, ht.exec(e), n), n);
                },
              ],
            },
            tweener: function (t, e) {
              g(t) ? ((e = t), (t = ["*"])) : (t = t.match(X));
              for (var n, r = 0, o = t.length; r < o; r++)
                ((n = t[r]),
                  (xe.tweeners[n] = xe.tweeners[n] || []),
                  xe.tweeners[n].unshift(e));
            },
            prefilters: [
              function (t, e, n) {
                var r,
                  o,
                  i,
                  a,
                  c,
                  s,
                  u,
                  l,
                  f = "width" in e || "height" in e,
                  p = this,
                  h = {},
                  d = t.style,
                  v = t.nodeType && mt(t),
                  y = ct.get(t, "fxshow");
                for (r in (n.queue ||
                  (null == (a = T._queueHooks(t, "fx")).unqueued &&
                    ((a.unqueued = 0),
                    (c = a.empty.fire),
                    (a.empty.fire = function () {
                      a.unqueued || c();
                    })),
                  a.unqueued++,
                  p.always(function () {
                    p.always(function () {
                      (a.unqueued--, T.queue(t, "fx").length || a.empty.fire());
                    });
                  })),
                e))
                  if (((o = e[r]), de.test(o))) {
                    if (
                      (delete e[r],
                      (i = i || "toggle" === o),
                      o === (v ? "hide" : "show"))
                    ) {
                      if ("show" !== o || !y || void 0 === y[r]) continue;
                      v = !0;
                    }
                    h[r] = (y && y[r]) || T.style(t, r);
                  }
                if ((s = !T.isEmptyObject(e)) || !T.isEmptyObject(h))
                  for (r in (f &&
                    1 === t.nodeType &&
                    ((n.overflow = [d.overflow, d.overflowX, d.overflowY]),
                    null == (u = y && y.display) && (u = ct.get(t, "display")),
                    "none" === (l = T.css(t, "display")) &&
                      (u
                        ? (l = u)
                        : (kt([t], !0),
                          (u = t.style.display || u),
                          (l = T.css(t, "display")),
                          kt([t]))),
                    ("inline" === l || ("inline-block" === l && null != u)) &&
                      "none" === T.css(t, "float") &&
                      (s ||
                        (p.done(function () {
                          d.display = u;
                        }),
                        null == u &&
                          ((l = d.display), (u = "none" === l ? "" : l))),
                      (d.display = "inline-block"))),
                  n.overflow &&
                    ((d.overflow = "hidden"),
                    p.always(function () {
                      ((d.overflow = n.overflow[0]),
                        (d.overflowX = n.overflow[1]),
                        (d.overflowY = n.overflow[2]));
                    })),
                  (s = !1),
                  h))
                    (s ||
                      (y
                        ? "hidden" in y && (v = y.hidden)
                        : (y = ct.access(t, "fxshow", { display: u })),
                      i && (y.hidden = !v),
                      v && kt([t], !0),
                      p.done(function () {
                        for (r in (v || kt([t]), ct.remove(t, "fxshow"), h))
                          T.style(t, r, h[r]);
                      })),
                      (s = be(v ? y[r] : 0, r, p)),
                      r in y ||
                        ((y[r] = s.start),
                        v && ((s.end = s.start), (s.start = 0))));
              },
            ],
            prefilter: function (t, e) {
              e ? xe.prefilters.unshift(t) : xe.prefilters.push(t);
            },
          })),
            (T.speed = function (t, e, n) {
              var r =
                t && "object" == typeof t
                  ? T.extend({}, t)
                  : {
                      complete: n || (!n && e) || (g(t) && t),
                      duration: t,
                      easing: (n && e) || (e && !g(e) && e),
                    };
              return (
                T.fx.off
                  ? (r.duration = 0)
                  : "number" != typeof r.duration &&
                    (r.duration in T.fx.speeds
                      ? (r.duration = T.fx.speeds[r.duration])
                      : (r.duration = T.fx.speeds._default)),
                (null != r.queue && !0 !== r.queue) || (r.queue = "fx"),
                (r.old = r.complete),
                (r.complete = function () {
                  (g(r.old) && r.old.call(this),
                    r.queue && T.dequeue(this, r.queue));
                }),
                r
              );
            }),
            T.fn.extend({
              fadeTo: function (t, e, n, r) {
                return this.filter(mt)
                  .css("opacity", 0)
                  .show()
                  .end()
                  .animate({ opacity: e }, t, n, r);
              },
              animate: function (t, e, n, r) {
                var o = T.isEmptyObject(t),
                  i = T.speed(e, n, r),
                  a = function () {
                    var e = xe(this, T.extend({}, t), i);
                    (o || ct.get(this, "finish")) && e.stop(!0);
                  };
                return (
                  (a.finish = a),
                  o || !1 === i.queue ? this.each(a) : this.queue(i.queue, a)
                );
              },
              stop: function (t, e, n) {
                var r = function (t) {
                  var e = t.stop;
                  (delete t.stop, e(n));
                };
                return (
                  "string" != typeof t && ((n = e), (e = t), (t = void 0)),
                  e && this.queue(t || "fx", []),
                  this.each(function () {
                    var e = !0,
                      o = null != t && t + "queueHooks",
                      i = T.timers,
                      a = ct.get(this);
                    if (o) a[o] && a[o].stop && r(a[o]);
                    else
                      for (o in a) a[o] && a[o].stop && ve.test(o) && r(a[o]);
                    for (o = i.length; o--; )
                      i[o].elem !== this ||
                        (null != t && i[o].queue !== t) ||
                        (i[o].anim.stop(n), (e = !1), i.splice(o, 1));
                    (!e && n) || T.dequeue(this, t);
                  })
                );
              },
              finish: function (t) {
                return (
                  !1 !== t && (t = t || "fx"),
                  this.each(function () {
                    var e,
                      n = ct.get(this),
                      r = n[t + "queue"],
                      o = n[t + "queueHooks"],
                      i = T.timers,
                      a = r ? r.length : 0;
                    for (
                      n.finish = !0,
                        T.queue(this, t, []),
                        o && o.stop && o.stop.call(this, !0),
                        e = i.length;
                      e--;

                    )
                      i[e].elem === this &&
                        i[e].queue === t &&
                        (i[e].anim.stop(!0), i.splice(e, 1));
                    for (e = 0; e < a; e++)
                      r[e] && r[e].finish && r[e].finish.call(this);
                    delete n.finish;
                  })
                );
              },
            }),
            T.each(["toggle", "show", "hide"], function (t, e) {
              var n = T.fn[e];
              T.fn[e] = function (t, r, o) {
                return null == t || "boolean" == typeof t
                  ? n.apply(this, arguments)
                  : this.animate(me(e, !0), t, r, o);
              };
            }),
            T.each(
              {
                slideDown: me("show"),
                slideUp: me("hide"),
                slideToggle: me("toggle"),
                fadeIn: { opacity: "show" },
                fadeOut: { opacity: "hide" },
                fadeToggle: { opacity: "toggle" },
              },
              function (t, e) {
                T.fn[t] = function (t, n, r) {
                  return this.animate(e, t, n, r);
                };
              },
            ),
            (T.timers = []),
            (T.fx.tick = function () {
              var t,
                e = 0,
                n = T.timers;
              for (pe = Date.now(); e < n.length; e++)
                (t = n[e])() || n[e] !== t || n.splice(e--, 1);
              (n.length || T.fx.stop(), (pe = void 0));
            }),
            (T.fx.timer = function (t) {
              (T.timers.push(t), T.fx.start());
            }),
            (T.fx.interval = 13),
            (T.fx.start = function () {
              he || ((he = !0), ye());
            }),
            (T.fx.stop = function () {
              he = null;
            }),
            (T.fx.speeds = { slow: 600, fast: 200, _default: 400 }),
            (T.fn.delay = function (t, e) {
              return (
                (t = (T.fx && T.fx.speeds[t]) || t),
                (e = e || "fx"),
                this.queue(e, function (e, n) {
                  var o = r.setTimeout(e, t);
                  n.stop = function () {
                    r.clearTimeout(o);
                  };
                })
              );
            }),
            (function () {
              var t = b.createElement("input"),
                e = b
                  .createElement("select")
                  .appendChild(b.createElement("option"));
              ((t.type = "checkbox"),
                (y.checkOn = "" !== t.value),
                (y.optSelected = e.selected),
                ((t = b.createElement("input")).value = "t"),
                (t.type = "radio"),
                (y.radioValue = "t" === t.value));
            })());
          var we,
            ke = T.expr.attrHandle;
          (T.fn.extend({
            attr: function (t, e) {
              return tt(this, T.attr, t, e, arguments.length > 1);
            },
            removeAttr: function (t) {
              return this.each(function () {
                T.removeAttr(this, t);
              });
            },
          }),
            T.extend({
              attr: function (t, e, n) {
                var r,
                  o,
                  i = t.nodeType;
                if (3 !== i && 8 !== i && 2 !== i)
                  return void 0 === t.getAttribute
                    ? T.prop(t, e, n)
                    : ((1 === i && T.isXMLDoc(t)) ||
                        (o =
                          T.attrHooks[e.toLowerCase()] ||
                          (T.expr.match.bool.test(e) ? we : void 0)),
                      void 0 !== n
                        ? null === n
                          ? void T.removeAttr(t, e)
                          : o && "set" in o && void 0 !== (r = o.set(t, n, e))
                            ? r
                            : (t.setAttribute(e, n + ""), n)
                        : o && "get" in o && null !== (r = o.get(t, e))
                          ? r
                          : null == (r = T.find.attr(t, e))
                            ? void 0
                            : r);
              },
              attrHooks: {
                type: {
                  set: function (t, e) {
                    if (!y.radioValue && "radio" === e && S(t, "input")) {
                      var n = t.value;
                      return (t.setAttribute("type", e), n && (t.value = n), e);
                    }
                  },
                },
              },
              removeAttr: function (t, e) {
                var n,
                  r = 0,
                  o = e && e.match(X);
                if (o && 1 === t.nodeType)
                  for (; (n = o[r++]); ) t.removeAttribute(n);
              },
            }),
            (we = {
              set: function (t, e, n) {
                return (
                  !1 === e ? T.removeAttr(t, n) : t.setAttribute(n, n),
                  n
                );
              },
            }),
            T.each(T.expr.match.bool.source.match(/\w+/g), function (t, e) {
              var n = ke[e] || T.find.attr;
              ke[e] = function (t, e, r) {
                var o,
                  i,
                  a = e.toLowerCase();
                return (
                  r ||
                    ((i = ke[a]),
                    (ke[a] = o),
                    (o = null != n(t, e, r) ? a : null),
                    (ke[a] = i)),
                  o
                );
              };
            }));
          var Ee = /^(?:input|select|textarea|button)$/i,
            je = /^(?:a|area)$/i;
          function Te(t) {
            return (t.match(X) || []).join(" ");
          }
          function Le(t) {
            return (t.getAttribute && t.getAttribute("class")) || "";
          }
          function Se(t) {
            return Array.isArray(t)
              ? t
              : ("string" == typeof t && t.match(X)) || [];
          }
          (T.fn.extend({
            prop: function (t, e) {
              return tt(this, T.prop, t, e, arguments.length > 1);
            },
            removeProp: function (t) {
              return this.each(function () {
                delete this[T.propFix[t] || t];
              });
            },
          }),
            T.extend({
              prop: function (t, e, n) {
                var r,
                  o,
                  i = t.nodeType;
                if (3 !== i && 8 !== i && 2 !== i)
                  return (
                    (1 === i && T.isXMLDoc(t)) ||
                      ((e = T.propFix[e] || e), (o = T.propHooks[e])),
                    void 0 !== n
                      ? o && "set" in o && void 0 !== (r = o.set(t, n, e))
                        ? r
                        : (t[e] = n)
                      : o && "get" in o && null !== (r = o.get(t, e))
                        ? r
                        : t[e]
                  );
              },
              propHooks: {
                tabIndex: {
                  get: function (t) {
                    var e = T.find.attr(t, "tabindex");
                    return e
                      ? parseInt(e, 10)
                      : Ee.test(t.nodeName) || (je.test(t.nodeName) && t.href)
                        ? 0
                        : -1;
                  },
                },
              },
              propFix: { for: "htmlFor", class: "className" },
            }),
            y.optSelected ||
              (T.propHooks.selected = {
                get: function (t) {
                  var e = t.parentNode;
                  return (
                    e && e.parentNode && e.parentNode.selectedIndex,
                    null
                  );
                },
                set: function (t) {
                  var e = t.parentNode;
                  e &&
                    (e.selectedIndex,
                    e.parentNode && e.parentNode.selectedIndex);
                },
              }),
            T.each(
              [
                "tabIndex",
                "readOnly",
                "maxLength",
                "cellSpacing",
                "cellPadding",
                "rowSpan",
                "colSpan",
                "useMap",
                "frameBorder",
                "contentEditable",
              ],
              function () {
                T.propFix[this.toLowerCase()] = this;
              },
            ),
            T.fn.extend({
              addClass: function (t) {
                var e, n, r, o, i, a;
                return g(t)
                  ? this.each(function (e) {
                      T(this).addClass(t.call(this, e, Le(this)));
                    })
                  : (e = Se(t)).length
                    ? this.each(function () {
                        if (
                          ((r = Le(this)),
                          (n = 1 === this.nodeType && " " + Te(r) + " "))
                        ) {
                          for (i = 0; i < e.length; i++)
                            ((o = e[i]),
                              n.indexOf(" " + o + " ") < 0 && (n += o + " "));
                          ((a = Te(n)),
                            r !== a && this.setAttribute("class", a));
                        }
                      })
                    : this;
              },
              removeClass: function (t) {
                var e, n, r, o, i, a;
                return g(t)
                  ? this.each(function (e) {
                      T(this).removeClass(t.call(this, e, Le(this)));
                    })
                  : arguments.length
                    ? (e = Se(t)).length
                      ? this.each(function () {
                          if (
                            ((r = Le(this)),
                            (n = 1 === this.nodeType && " " + Te(r) + " "))
                          ) {
                            for (i = 0; i < e.length; i++)
                              for (o = e[i]; n.indexOf(" " + o + " ") > -1; )
                                n = n.replace(" " + o + " ", " ");
                            ((a = Te(n)),
                              r !== a && this.setAttribute("class", a));
                          }
                        })
                      : this
                    : this.attr("class", "");
              },
              toggleClass: function (t, e) {
                var n,
                  r,
                  o,
                  i,
                  a = typeof t,
                  c = "string" === a || Array.isArray(t);
                return g(t)
                  ? this.each(function (n) {
                      T(this).toggleClass(t.call(this, n, Le(this), e), e);
                    })
                  : "boolean" == typeof e && c
                    ? e
                      ? this.addClass(t)
                      : this.removeClass(t)
                    : ((n = Se(t)),
                      this.each(function () {
                        if (c)
                          for (i = T(this), o = 0; o < n.length; o++)
                            ((r = n[o]),
                              i.hasClass(r) ? i.removeClass(r) : i.addClass(r));
                        else
                          (void 0 !== t && "boolean" !== a) ||
                            ((r = Le(this)) && ct.set(this, "__className__", r),
                            this.setAttribute &&
                              this.setAttribute(
                                "class",
                                r || !1 === t
                                  ? ""
                                  : ct.get(this, "__className__") || "",
                              ));
                      }));
              },
              hasClass: function (t) {
                var e,
                  n,
                  r = 0;
                for (e = " " + t + " "; (n = this[r++]); )
                  if (
                    1 === n.nodeType &&
                    (" " + Te(Le(n)) + " ").indexOf(e) > -1
                  )
                    return !0;
                return !1;
              },
            }));
          var Ae = /\r/g;
          (T.fn.extend({
            val: function (t) {
              var e,
                n,
                r,
                o = this[0];
              return arguments.length
                ? ((r = g(t)),
                  this.each(function (n) {
                    var o;
                    1 === this.nodeType &&
                      (null == (o = r ? t.call(this, n, T(this).val()) : t)
                        ? (o = "")
                        : "number" == typeof o
                          ? (o += "")
                          : Array.isArray(o) &&
                            (o = T.map(o, function (t) {
                              return null == t ? "" : t + "";
                            })),
                      ((e =
                        T.valHooks[this.type] ||
                        T.valHooks[this.nodeName.toLowerCase()]) &&
                        "set" in e &&
                        void 0 !== e.set(this, o, "value")) ||
                        (this.value = o));
                  }))
                : o
                  ? (e =
                      T.valHooks[o.type] ||
                      T.valHooks[o.nodeName.toLowerCase()]) &&
                    "get" in e &&
                    void 0 !== (n = e.get(o, "value"))
                    ? n
                    : "string" == typeof (n = o.value)
                      ? n.replace(Ae, "")
                      : null == n
                        ? ""
                        : n
                  : void 0;
            },
          }),
            T.extend({
              valHooks: {
                option: {
                  get: function (t) {
                    var e = T.find.attr(t, "value");
                    return null != e ? e : Te(T.text(t));
                  },
                },
                select: {
                  get: function (t) {
                    var e,
                      n,
                      r,
                      o = t.options,
                      i = t.selectedIndex,
                      a = "select-one" === t.type,
                      c = a ? null : [],
                      s = a ? i + 1 : o.length;
                    for (r = i < 0 ? s : a ? i : 0; r < s; r++)
                      if (
                        ((n = o[r]).selected || r === i) &&
                        !n.disabled &&
                        (!n.parentNode.disabled || !S(n.parentNode, "optgroup"))
                      ) {
                        if (((e = T(n).val()), a)) return e;
                        c.push(e);
                      }
                    return c;
                  },
                  set: function (t, e) {
                    for (
                      var n, r, o = t.options, i = T.makeArray(e), a = o.length;
                      a--;

                    )
                      ((r = o[a]).selected =
                        T.inArray(T.valHooks.option.get(r), i) > -1) &&
                        (n = !0);
                    return (n || (t.selectedIndex = -1), i);
                  },
                },
              },
            }),
            T.each(["radio", "checkbox"], function () {
              ((T.valHooks[this] = {
                set: function (t, e) {
                  if (Array.isArray(e))
                    return (t.checked = T.inArray(T(t).val(), e) > -1);
                },
              }),
                y.checkOn ||
                  (T.valHooks[this].get = function (t) {
                    return null === t.getAttribute("value") ? "on" : t.value;
                  }));
            }));
          var Oe = r.location,
            Ce = { guid: Date.now() },
            _e = /\?/;
          T.parseXML = function (t) {
            var e, n;
            if (!t || "string" != typeof t) return null;
            try {
              e = new r.DOMParser().parseFromString(t, "text/xml");
            } catch (t) {}
            return (
              (n = e && e.getElementsByTagName("parsererror")[0]),
              (e && !n) ||
                T.error(
                  "Invalid XML: " +
                    (n
                      ? T.map(n.childNodes, function (t) {
                          return t.textContent;
                        }).join("\n")
                      : t),
                ),
              e
            );
          };
          var Ne = /^(?:focusinfocus|focusoutblur)$/,
            Pe = function (t) {
              t.stopPropagation();
            };
          (T.extend(T.event, {
            trigger: function (t, e, n, o) {
              var i,
                a,
                c,
                s,
                u,
                l,
                f,
                p,
                d = [n || b],
                v = h.call(t, "type") ? t.type : t,
                y = h.call(t, "namespace") ? t.namespace.split(".") : [];
              if (
                ((a = p = c = n = n || b),
                3 !== n.nodeType &&
                  8 !== n.nodeType &&
                  !Ne.test(v + T.event.triggered) &&
                  (v.indexOf(".") > -1 &&
                    ((y = v.split(".")), (v = y.shift()), y.sort()),
                  (u = v.indexOf(":") < 0 && "on" + v),
                  ((t = t[T.expando]
                    ? t
                    : new T.Event(v, "object" == typeof t && t)).isTrigger = o
                    ? 2
                    : 3),
                  (t.namespace = y.join(".")),
                  (t.rnamespace = t.namespace
                    ? new RegExp(
                        "(^|\\.)" + y.join("\\.(?:.*\\.|)") + "(\\.|$)",
                      )
                    : null),
                  (t.result = void 0),
                  t.target || (t.target = n),
                  (e = null == e ? [t] : T.makeArray(e, [t])),
                  (f = T.event.special[v] || {}),
                  o || !f.trigger || !1 !== f.trigger.apply(n, e)))
              ) {
                if (!o && !f.noBubble && !m(n)) {
                  for (
                    s = f.delegateType || v,
                      Ne.test(s + v) || (a = a.parentNode);
                    a;
                    a = a.parentNode
                  )
                    (d.push(a), (c = a));
                  c === (n.ownerDocument || b) &&
                    d.push(c.defaultView || c.parentWindow || r);
                }
                for (i = 0; (a = d[i++]) && !t.isPropagationStopped(); )
                  ((p = a),
                    (t.type = i > 1 ? s : f.bindType || v),
                    (l =
                      (ct.get(a, "events") || Object.create(null))[t.type] &&
                      ct.get(a, "handle")) && l.apply(a, e),
                    (l = u && a[u]) &&
                      l.apply &&
                      it(a) &&
                      ((t.result = l.apply(a, e)),
                      !1 === t.result && t.preventDefault()));
                return (
                  (t.type = v),
                  o ||
                    t.isDefaultPrevented() ||
                    (f._default && !1 !== f._default.apply(d.pop(), e)) ||
                    !it(n) ||
                    (u &&
                      g(n[v]) &&
                      !m(n) &&
                      ((c = n[u]) && (n[u] = null),
                      (T.event.triggered = v),
                      t.isPropagationStopped() && p.addEventListener(v, Pe),
                      n[v](),
                      t.isPropagationStopped() && p.removeEventListener(v, Pe),
                      (T.event.triggered = void 0),
                      c && (n[u] = c))),
                  t.result
                );
              }
            },
            simulate: function (t, e, n) {
              var r = T.extend(new T.Event(), n, { type: t, isSimulated: !0 });
              T.event.trigger(r, null, e);
            },
          }),
            T.fn.extend({
              trigger: function (t, e) {
                return this.each(function () {
                  T.event.trigger(t, e, this);
                });
              },
              triggerHandler: function (t, e) {
                var n = this[0];
                if (n) return T.event.trigger(t, e, n, !0);
              },
            }));
          var De = /\[\]$/,
            qe = /\r?\n/g,
            He = /^(?:submit|button|image|reset|file)$/i,
            Re = /^(?:input|select|textarea|keygen)/i;
          function Ie(t, e, n, r) {
            var o;
            if (Array.isArray(e))
              T.each(e, function (e, o) {
                n || De.test(t)
                  ? r(t, o)
                  : Ie(
                      t +
                        "[" +
                        ("object" == typeof o && null != o ? e : "") +
                        "]",
                      o,
                      n,
                      r,
                    );
              });
            else if (n || "object" !== k(e)) r(t, e);
            else for (o in e) Ie(t + "[" + o + "]", e[o], n, r);
          }
          ((T.param = function (t, e) {
            var n,
              r = [],
              o = function (t, e) {
                var n = g(e) ? e() : e;
                r[r.length] =
                  encodeURIComponent(t) +
                  "=" +
                  encodeURIComponent(null == n ? "" : n);
              };
            if (null == t) return "";
            if (Array.isArray(t) || (t.jquery && !T.isPlainObject(t)))
              T.each(t, function () {
                o(this.name, this.value);
              });
            else for (n in t) Ie(n, t[n], e, o);
            return r.join("&");
          }),
            T.fn.extend({
              serialize: function () {
                return T.param(this.serializeArray());
              },
              serializeArray: function () {
                return this.map(function () {
                  var t = T.prop(this, "elements");
                  return t ? T.makeArray(t) : this;
                })
                  .filter(function () {
                    var t = this.type;
                    return (
                      this.name &&
                      !T(this).is(":disabled") &&
                      Re.test(this.nodeName) &&
                      !He.test(t) &&
                      (this.checked || !Tt.test(t))
                    );
                  })
                  .map(function (t, e) {
                    var n = T(this).val();
                    return null == n
                      ? null
                      : Array.isArray(n)
                        ? T.map(n, function (t) {
                            return {
                              name: e.name,
                              value: t.replace(qe, "\r\n"),
                            };
                          })
                        : { name: e.name, value: n.replace(qe, "\r\n") };
                  })
                  .get();
              },
            }));
          var Fe = /%20/g,
            Me = /#.*$/,
            Ge = /([?&])_=[^&]*/,
            ze = /^(.*?):[ \t]*([^\r\n]*)$/gm,
            We = /^(?:GET|HEAD)$/,
            Be = /^\/\//,
            $e = {},
            Ue = {},
            Xe = "*/".concat("*"),
            Ye = b.createElement("a");
          function Ve(t) {
            return function (e, n) {
              "string" != typeof e && ((n = e), (e = "*"));
              var r,
                o = 0,
                i = e.toLowerCase().match(X) || [];
              if (g(n))
                for (; (r = i[o++]); )
                  "+" === r[0]
                    ? ((r = r.slice(1) || "*"), (t[r] = t[r] || []).unshift(n))
                    : (t[r] = t[r] || []).push(n);
            };
          }
          function Je(t, e, n, r) {
            var o = {},
              i = t === Ue;
            function a(c) {
              var s;
              return (
                (o[c] = !0),
                T.each(t[c] || [], function (t, c) {
                  var u = c(e, n, r);
                  return "string" != typeof u || i || o[u]
                    ? i
                      ? !(s = u)
                      : void 0
                    : (e.dataTypes.unshift(u), a(u), !1);
                }),
                s
              );
            }
            return a(e.dataTypes[0]) || (!o["*"] && a("*"));
          }
          function Qe(t, e) {
            var n,
              r,
              o = T.ajaxSettings.flatOptions || {};
            for (n in e)
              void 0 !== e[n] && ((o[n] ? t : r || (r = {}))[n] = e[n]);
            return (r && T.extend(!0, t, r), t);
          }
          ((Ye.href = Oe.href),
            T.extend({
              active: 0,
              lastModified: {},
              etag: {},
              ajaxSettings: {
                url: Oe.href,
                type: "GET",
                isLocal:
                  /^(?:about|app|app-storage|.+-extension|file|res|widget):$/.test(
                    Oe.protocol,
                  ),
                global: !0,
                processData: !0,
                async: !0,
                contentType: "application/x-www-form-urlencoded; charset=UTF-8",
                accepts: {
                  "*": Xe,
                  text: "text/plain",
                  html: "text/html",
                  xml: "application/xml, text/xml",
                  json: "application/json, text/javascript",
                },
                contents: { xml: /\bxml\b/, html: /\bhtml/, json: /\bjson\b/ },
                responseFields: {
                  xml: "responseXML",
                  text: "responseText",
                  json: "responseJSON",
                },
                converters: {
                  "* text": String,
                  "text html": !0,
                  "text json": JSON.parse,
                  "text xml": T.parseXML,
                },
                flatOptions: { url: !0, context: !0 },
              },
              ajaxSetup: function (t, e) {
                return e ? Qe(Qe(t, T.ajaxSettings), e) : Qe(T.ajaxSettings, t);
              },
              ajaxPrefilter: Ve($e),
              ajaxTransport: Ve(Ue),
              ajax: function (t, e) {
                ("object" == typeof t && ((e = t), (t = void 0)),
                  (e = e || {}));
                var n,
                  o,
                  i,
                  a,
                  c,
                  s,
                  u,
                  l,
                  f,
                  p,
                  h = T.ajaxSetup({}, e),
                  d = h.context || h,
                  v = h.context && (d.nodeType || d.jquery) ? T(d) : T.event,
                  y = T.Deferred(),
                  g = T.Callbacks("once memory"),
                  m = h.statusCode || {},
                  x = {},
                  w = {},
                  k = "canceled",
                  E = {
                    readyState: 0,
                    getResponseHeader: function (t) {
                      var e;
                      if (u) {
                        if (!a)
                          for (a = {}; (e = ze.exec(i)); )
                            a[e[1].toLowerCase() + " "] = (
                              a[e[1].toLowerCase() + " "] || []
                            ).concat(e[2]);
                        e = a[t.toLowerCase() + " "];
                      }
                      return null == e ? null : e.join(", ");
                    },
                    getAllResponseHeaders: function () {
                      return u ? i : null;
                    },
                    setRequestHeader: function (t, e) {
                      return (
                        null == u &&
                          ((t = w[t.toLowerCase()] = w[t.toLowerCase()] || t),
                          (x[t] = e)),
                        this
                      );
                    },
                    overrideMimeType: function (t) {
                      return (null == u && (h.mimeType = t), this);
                    },
                    statusCode: function (t) {
                      var e;
                      if (t)
                        if (u) E.always(t[E.status]);
                        else for (e in t) m[e] = [m[e], t[e]];
                      return this;
                    },
                    abort: function (t) {
                      var e = t || k;
                      return (n && n.abort(e), j(0, e), this);
                    },
                  };
                if (
                  (y.promise(E),
                  (h.url = ((t || h.url || Oe.href) + "").replace(
                    Be,
                    Oe.protocol + "//",
                  )),
                  (h.type = e.method || e.type || h.method || h.type),
                  (h.dataTypes = (h.dataType || "*").toLowerCase().match(X) || [
                    "",
                  ]),
                  null == h.crossDomain)
                ) {
                  s = b.createElement("a");
                  try {
                    ((s.href = h.url),
                      (s.href = s.href),
                      (h.crossDomain =
                        Ye.protocol + "//" + Ye.host !=
                        s.protocol + "//" + s.host));
                  } catch (t) {
                    h.crossDomain = !0;
                  }
                }
                if (
                  (h.data &&
                    h.processData &&
                    "string" != typeof h.data &&
                    (h.data = T.param(h.data, h.traditional)),
                  Je($e, h, e, E),
                  u)
                )
                  return E;
                for (f in ((l = T.event && h.global) &&
                  0 == T.active++ &&
                  T.event.trigger("ajaxStart"),
                (h.type = h.type.toUpperCase()),
                (h.hasContent = !We.test(h.type)),
                (o = h.url.replace(Me, "")),
                h.hasContent
                  ? h.data &&
                    h.processData &&
                    0 ===
                      (h.contentType || "").indexOf(
                        "application/x-www-form-urlencoded",
                      ) &&
                    (h.data = h.data.replace(Fe, "+"))
                  : ((p = h.url.slice(o.length)),
                    h.data &&
                      (h.processData || "string" == typeof h.data) &&
                      ((o += (_e.test(o) ? "&" : "?") + h.data), delete h.data),
                    !1 === h.cache &&
                      ((o = o.replace(Ge, "$1")),
                      (p = (_e.test(o) ? "&" : "?") + "_=" + Ce.guid++ + p)),
                    (h.url = o + p)),
                h.ifModified &&
                  (T.lastModified[o] &&
                    E.setRequestHeader("If-Modified-Since", T.lastModified[o]),
                  T.etag[o] && E.setRequestHeader("If-None-Match", T.etag[o])),
                ((h.data && h.hasContent && !1 !== h.contentType) ||
                  e.contentType) &&
                  E.setRequestHeader("Content-Type", h.contentType),
                E.setRequestHeader(
                  "Accept",
                  h.dataTypes[0] && h.accepts[h.dataTypes[0]]
                    ? h.accepts[h.dataTypes[0]] +
                        ("*" !== h.dataTypes[0] ? ", " + Xe + "; q=0.01" : "")
                    : h.accepts["*"],
                ),
                h.headers))
                  E.setRequestHeader(f, h.headers[f]);
                if (h.beforeSend && (!1 === h.beforeSend.call(d, E, h) || u))
                  return E.abort();
                if (
                  ((k = "abort"),
                  g.add(h.complete),
                  E.done(h.success),
                  E.fail(h.error),
                  (n = Je(Ue, h, e, E)))
                ) {
                  if (
                    ((E.readyState = 1), l && v.trigger("ajaxSend", [E, h]), u)
                  )
                    return E;
                  h.async &&
                    h.timeout > 0 &&
                    (c = r.setTimeout(function () {
                      E.abort("timeout");
                    }, h.timeout));
                  try {
                    ((u = !1), n.send(x, j));
                  } catch (t) {
                    if (u) throw t;
                    j(-1, t);
                  }
                } else j(-1, "No Transport");
                function j(t, e, a, s) {
                  var f,
                    p,
                    b,
                    x,
                    w,
                    k = e;
                  u ||
                    ((u = !0),
                    c && r.clearTimeout(c),
                    (n = void 0),
                    (i = s || ""),
                    (E.readyState = t > 0 ? 4 : 0),
                    (f = (t >= 200 && t < 300) || 304 === t),
                    a &&
                      (x = (function (t, e, n) {
                        for (
                          var r, o, i, a, c = t.contents, s = t.dataTypes;
                          "*" === s[0];

                        )
                          (s.shift(),
                            void 0 === r &&
                              (r =
                                t.mimeType ||
                                e.getResponseHeader("Content-Type")));
                        if (r)
                          for (o in c)
                            if (c[o] && c[o].test(r)) {
                              s.unshift(o);
                              break;
                            }
                        if (s[0] in n) i = s[0];
                        else {
                          for (o in n) {
                            if (!s[0] || t.converters[o + " " + s[0]]) {
                              i = o;
                              break;
                            }
                            a || (a = o);
                          }
                          i = i || a;
                        }
                        if (i) return (i !== s[0] && s.unshift(i), n[i]);
                      })(h, E, a)),
                    !f &&
                      T.inArray("script", h.dataTypes) > -1 &&
                      T.inArray("json", h.dataTypes) < 0 &&
                      (h.converters["text script"] = function () {}),
                    (x = (function (t, e, n, r) {
                      var o,
                        i,
                        a,
                        c,
                        s,
                        u = {},
                        l = t.dataTypes.slice();
                      if (l[1])
                        for (a in t.converters)
                          u[a.toLowerCase()] = t.converters[a];
                      for (i = l.shift(); i; )
                        if (
                          (t.responseFields[i] && (n[t.responseFields[i]] = e),
                          !s &&
                            r &&
                            t.dataFilter &&
                            (e = t.dataFilter(e, t.dataType)),
                          (s = i),
                          (i = l.shift()))
                        )
                          if ("*" === i) i = s;
                          else if ("*" !== s && s !== i) {
                            if (!(a = u[s + " " + i] || u["* " + i]))
                              for (o in u)
                                if (
                                  (c = o.split(" "))[1] === i &&
                                  (a = u[s + " " + c[0]] || u["* " + c[0]])
                                ) {
                                  !0 === a
                                    ? (a = u[o])
                                    : !0 !== u[o] &&
                                      ((i = c[0]), l.unshift(c[1]));
                                  break;
                                }
                            if (!0 !== a)
                              if (a && t.throws) e = a(e);
                              else
                                try {
                                  e = a(e);
                                } catch (t) {
                                  return {
                                    state: "parsererror",
                                    error: a
                                      ? t
                                      : "No conversion from " + s + " to " + i,
                                  };
                                }
                          }
                      return { state: "success", data: e };
                    })(h, x, E, f)),
                    f
                      ? (h.ifModified &&
                          ((w = E.getResponseHeader("Last-Modified")) &&
                            (T.lastModified[o] = w),
                          (w = E.getResponseHeader("etag")) && (T.etag[o] = w)),
                        204 === t || "HEAD" === h.type
                          ? (k = "nocontent")
                          : 304 === t
                            ? (k = "notmodified")
                            : ((k = x.state),
                              (p = x.data),
                              (f = !(b = x.error))))
                      : ((b = k),
                        (!t && k) || ((k = "error"), t < 0 && (t = 0))),
                    (E.status = t),
                    (E.statusText = (e || k) + ""),
                    f
                      ? y.resolveWith(d, [p, k, E])
                      : y.rejectWith(d, [E, k, b]),
                    E.statusCode(m),
                    (m = void 0),
                    l &&
                      v.trigger(f ? "ajaxSuccess" : "ajaxError", [
                        E,
                        h,
                        f ? p : b,
                      ]),
                    g.fireWith(d, [E, k]),
                    l &&
                      (v.trigger("ajaxComplete", [E, h]),
                      --T.active || T.event.trigger("ajaxStop")));
                }
                return E;
              },
              getJSON: function (t, e, n) {
                return T.get(t, e, n, "json");
              },
              getScript: function (t, e) {
                return T.get(t, void 0, e, "script");
              },
            }),
            T.each(["get", "post"], function (t, e) {
              T[e] = function (t, n, r, o) {
                return (
                  g(n) && ((o = o || r), (r = n), (n = void 0)),
                  T.ajax(
                    T.extend(
                      { url: t, type: e, dataType: o, data: n, success: r },
                      T.isPlainObject(t) && t,
                    ),
                  )
                );
              };
            }),
            T.ajaxPrefilter(function (t) {
              var e;
              for (e in t.headers)
                "content-type" === e.toLowerCase() &&
                  (t.contentType = t.headers[e] || "");
            }),
            (T._evalUrl = function (t, e, n) {
              return T.ajax({
                url: t,
                type: "GET",
                dataType: "script",
                cache: !0,
                async: !1,
                global: !1,
                converters: { "text script": function () {} },
                dataFilter: function (t) {
                  T.globalEval(t, e, n);
                },
              });
            }),
            T.fn.extend({
              wrapAll: function (t) {
                var e;
                return (
                  this[0] &&
                    (g(t) && (t = t.call(this[0])),
                    (e = T(t, this[0].ownerDocument).eq(0).clone(!0)),
                    this[0].parentNode && e.insertBefore(this[0]),
                    e
                      .map(function () {
                        for (var t = this; t.firstElementChild; )
                          t = t.firstElementChild;
                        return t;
                      })
                      .append(this)),
                  this
                );
              },
              wrapInner: function (t) {
                return g(t)
                  ? this.each(function (e) {
                      T(this).wrapInner(t.call(this, e));
                    })
                  : this.each(function () {
                      var e = T(this),
                        n = e.contents();
                      n.length ? n.wrapAll(t) : e.append(t);
                    });
              },
              wrap: function (t) {
                var e = g(t);
                return this.each(function (n) {
                  T(this).wrapAll(e ? t.call(this, n) : t);
                });
              },
              unwrap: function (t) {
                return (
                  this.parent(t)
                    .not("body")
                    .each(function () {
                      T(this).replaceWith(this.childNodes);
                    }),
                  this
                );
              },
            }),
            (T.expr.pseudos.hidden = function (t) {
              return !T.expr.pseudos.visible(t);
            }),
            (T.expr.pseudos.visible = function (t) {
              return !!(
                t.offsetWidth ||
                t.offsetHeight ||
                t.getClientRects().length
              );
            }),
            (T.ajaxSettings.xhr = function () {
              try {
                return new r.XMLHttpRequest();
              } catch (t) {}
            }));
          var Ke = { 0: 200, 1223: 204 },
            Ze = T.ajaxSettings.xhr();
          ((y.cors = !!Ze && "withCredentials" in Ze),
            (y.ajax = Ze = !!Ze),
            T.ajaxTransport(function (t) {
              var e, n;
              if (y.cors || (Ze && !t.crossDomain))
                return {
                  send: function (o, i) {
                    var a,
                      c = t.xhr();
                    if (
                      (c.open(t.type, t.url, t.async, t.username, t.password),
                      t.xhrFields)
                    )
                      for (a in t.xhrFields) c[a] = t.xhrFields[a];
                    for (a in (t.mimeType &&
                      c.overrideMimeType &&
                      c.overrideMimeType(t.mimeType),
                    t.crossDomain ||
                      o["X-Requested-With"] ||
                      (o["X-Requested-With"] = "XMLHttpRequest"),
                    o))
                      c.setRequestHeader(a, o[a]);
                    ((e = function (t) {
                      return function () {
                        e &&
                          ((e =
                            n =
                            c.onload =
                            c.onerror =
                            c.onabort =
                            c.ontimeout =
                            c.onreadystatechange =
                              null),
                          "abort" === t
                            ? c.abort()
                            : "error" === t
                              ? "number" != typeof c.status
                                ? i(0, "error")
                                : i(c.status, c.statusText)
                              : i(
                                  Ke[c.status] || c.status,
                                  c.statusText,
                                  "text" !== (c.responseType || "text") ||
                                    "string" != typeof c.responseText
                                    ? { binary: c.response }
                                    : { text: c.responseText },
                                  c.getAllResponseHeaders(),
                                ));
                      };
                    }),
                      (c.onload = e()),
                      (n = c.onerror = c.ontimeout = e("error")),
                      void 0 !== c.onabort
                        ? (c.onabort = n)
                        : (c.onreadystatechange = function () {
                            4 === c.readyState &&
                              r.setTimeout(function () {
                                e && n();
                              });
                          }),
                      (e = e("abort")));
                    try {
                      c.send((t.hasContent && t.data) || null);
                    } catch (t) {
                      if (e) throw t;
                    }
                  },
                  abort: function () {
                    e && e();
                  },
                };
            }),
            T.ajaxPrefilter(function (t) {
              t.crossDomain && (t.contents.script = !1);
            }),
            T.ajaxSetup({
              accepts: {
                script:
                  "text/javascript, application/javascript, application/ecmascript, application/x-ecmascript",
              },
              contents: { script: /\b(?:java|ecma)script\b/ },
              converters: {
                "text script": function (t) {
                  return (T.globalEval(t), t);
                },
              },
            }),
            T.ajaxPrefilter("script", function (t) {
              (void 0 === t.cache && (t.cache = !1),
                t.crossDomain && (t.type = "GET"));
            }),
            T.ajaxTransport("script", function (t) {
              var e, n;
              if (t.crossDomain || t.scriptAttrs)
                return {
                  send: function (r, o) {
                    ((e = T("<script>")
                      .attr(t.scriptAttrs || {})
                      .prop({ charset: t.scriptCharset, src: t.url })
                      .on(
                        "load error",
                        (n = function (t) {
                          (e.remove(),
                            (n = null),
                            t && o("error" === t.type ? 404 : 200, t.type));
                        }),
                      )),
                      b.head.appendChild(e[0]));
                  },
                  abort: function () {
                    n && n();
                  },
                };
            }));
          var tn,
            en = [],
            nn = /(=)\?(?=&|$)|\?\?/;
          (T.ajaxSetup({
            jsonp: "callback",
            jsonpCallback: function () {
              var t = en.pop() || T.expando + "_" + Ce.guid++;
              return ((this[t] = !0), t);
            },
          }),
            T.ajaxPrefilter("json jsonp", function (t, e, n) {
              var o,
                i,
                a,
                c =
                  !1 !== t.jsonp &&
                  (nn.test(t.url)
                    ? "url"
                    : "string" == typeof t.data &&
                      0 ===
                        (t.contentType || "").indexOf(
                          "application/x-www-form-urlencoded",
                        ) &&
                      nn.test(t.data) &&
                      "data");
              if (c || "jsonp" === t.dataTypes[0])
                return (
                  (o = t.jsonpCallback =
                    g(t.jsonpCallback) ? t.jsonpCallback() : t.jsonpCallback),
                  c
                    ? (t[c] = t[c].replace(nn, "$1" + o))
                    : !1 !== t.jsonp &&
                      (t.url +=
                        (_e.test(t.url) ? "&" : "?") + t.jsonp + "=" + o),
                  (t.converters["script json"] = function () {
                    return (a || T.error(o + " was not called"), a[0]);
                  }),
                  (t.dataTypes[0] = "json"),
                  (i = r[o]),
                  (r[o] = function () {
                    a = arguments;
                  }),
                  n.always(function () {
                    (void 0 === i ? T(r).removeProp(o) : (r[o] = i),
                      t[o] && ((t.jsonpCallback = e.jsonpCallback), en.push(o)),
                      a && g(i) && i(a[0]),
                      (a = i = void 0));
                  }),
                  "script"
                );
            }),
            (y.createHTMLDocument =
              (((tn = b.implementation.createHTMLDocument("").body).innerHTML =
                "<form></form><form></form>"),
              2 === tn.childNodes.length)),
            (T.parseHTML = function (t, e, n) {
              return "string" != typeof t
                ? []
                : ("boolean" == typeof e && ((n = e), (e = !1)),
                  e ||
                    (y.createHTMLDocument
                      ? (((r = (e =
                          b.implementation.createHTMLDocument(
                            "",
                          )).createElement("base")).href = b.location.href),
                        e.head.appendChild(r))
                      : (e = b)),
                  (i = !n && []),
                  (o = M.exec(t))
                    ? [e.createElement(o[1])]
                    : ((o = Nt([t], e, i)),
                      i && i.length && T(i).remove(),
                      T.merge([], o.childNodes)));
              var r, o, i;
            }),
            (T.fn.load = function (t, e, n) {
              var r,
                o,
                i,
                a = this,
                c = t.indexOf(" ");
              return (
                c > -1 && ((r = Te(t.slice(c))), (t = t.slice(0, c))),
                g(e)
                  ? ((n = e), (e = void 0))
                  : e && "object" == typeof e && (o = "POST"),
                a.length > 0 &&
                  T.ajax({
                    url: t,
                    type: o || "GET",
                    dataType: "html",
                    data: e,
                  })
                    .done(function (t) {
                      ((i = arguments),
                        a.html(
                          r ? T("<div>").append(T.parseHTML(t)).find(r) : t,
                        ));
                    })
                    .always(
                      n &&
                        function (t, e) {
                          a.each(function () {
                            n.apply(this, i || [t.responseText, e, t]);
                          });
                        },
                    ),
                this
              );
            }),
            (T.expr.pseudos.animated = function (t) {
              return T.grep(T.timers, function (e) {
                return t === e.elem;
              }).length;
            }),
            (T.offset = {
              setOffset: function (t, e, n) {
                var r,
                  o,
                  i,
                  a,
                  c,
                  s,
                  u = T.css(t, "position"),
                  l = T(t),
                  f = {};
                ("static" === u && (t.style.position = "relative"),
                  (c = l.offset()),
                  (i = T.css(t, "top")),
                  (s = T.css(t, "left")),
                  ("absolute" === u || "fixed" === u) &&
                  (i + s).indexOf("auto") > -1
                    ? ((a = (r = l.position()).top), (o = r.left))
                    : ((a = parseFloat(i) || 0), (o = parseFloat(s) || 0)),
                  g(e) && (e = e.call(t, n, T.extend({}, c))),
                  null != e.top && (f.top = e.top - c.top + a),
                  null != e.left && (f.left = e.left - c.left + o),
                  "using" in e ? e.using.call(t, f) : l.css(f));
              },
            }),
            T.fn.extend({
              offset: function (t) {
                if (arguments.length)
                  return void 0 === t
                    ? this
                    : this.each(function (e) {
                        T.offset.setOffset(this, t, e);
                      });
                var e,
                  n,
                  r = this[0];
                return r
                  ? r.getClientRects().length
                    ? ((e = r.getBoundingClientRect()),
                      (n = r.ownerDocument.defaultView),
                      {
                        top: e.top + n.pageYOffset,
                        left: e.left + n.pageXOffset,
                      })
                    : { top: 0, left: 0 }
                  : void 0;
              },
              position: function () {
                if (this[0]) {
                  var t,
                    e,
                    n,
                    r = this[0],
                    o = { top: 0, left: 0 };
                  if ("fixed" === T.css(r, "position"))
                    e = r.getBoundingClientRect();
                  else {
                    for (
                      e = this.offset(),
                        n = r.ownerDocument,
                        t = r.offsetParent || n.documentElement;
                      t &&
                      (t === n.body || t === n.documentElement) &&
                      "static" === T.css(t, "position");

                    )
                      t = t.parentNode;
                    t &&
                      t !== r &&
                      1 === t.nodeType &&
                      (((o = T(t).offset()).top += T.css(
                        t,
                        "borderTopWidth",
                        !0,
                      )),
                      (o.left += T.css(t, "borderLeftWidth", !0)));
                  }
                  return {
                    top: e.top - o.top - T.css(r, "marginTop", !0),
                    left: e.left - o.left - T.css(r, "marginLeft", !0),
                  };
                }
              },
              offsetParent: function () {
                return this.map(function () {
                  for (
                    var t = this.offsetParent;
                    t && "static" === T.css(t, "position");

                  )
                    t = t.offsetParent;
                  return t || vt;
                });
              },
            }),
            T.each(
              { scrollLeft: "pageXOffset", scrollTop: "pageYOffset" },
              function (t, e) {
                var n = "pageYOffset" === e;
                T.fn[t] = function (r) {
                  return tt(
                    this,
                    function (t, r, o) {
                      var i;
                      if (
                        (m(t)
                          ? (i = t)
                          : 9 === t.nodeType && (i = t.defaultView),
                        void 0 === o)
                      )
                        return i ? i[e] : t[r];
                      i
                        ? i.scrollTo(
                            n ? i.pageXOffset : o,
                            n ? o : i.pageYOffset,
                          )
                        : (t[r] = o);
                    },
                    t,
                    r,
                    arguments.length,
                  );
                };
              },
            ),
            T.each(["top", "left"], function (t, e) {
              T.cssHooks[e] = te(y.pixelPosition, function (t, n) {
                if (n)
                  return (
                    (n = Zt(t, e)),
                    Yt.test(n) ? T(t).position()[e] + "px" : n
                  );
              });
            }),
            T.each({ Height: "height", Width: "width" }, function (t, e) {
              T.each(
                { padding: "inner" + t, content: e, "": "outer" + t },
                function (n, r) {
                  T.fn[r] = function (o, i) {
                    var a = arguments.length && (n || "boolean" != typeof o),
                      c = n || (!0 === o || !0 === i ? "margin" : "border");
                    return tt(
                      this,
                      function (e, n, o) {
                        var i;
                        return m(e)
                          ? 0 === r.indexOf("outer")
                            ? e["inner" + t]
                            : e.document.documentElement["client" + t]
                          : 9 === e.nodeType
                            ? ((i = e.documentElement),
                              Math.max(
                                e.body["scroll" + t],
                                i["scroll" + t],
                                e.body["offset" + t],
                                i["offset" + t],
                                i["client" + t],
                              ))
                            : void 0 === o
                              ? T.css(e, n, c)
                              : T.style(e, n, o, c);
                      },
                      e,
                      a ? o : void 0,
                      a,
                    );
                  };
                },
              );
            }),
            T.each(
              [
                "ajaxStart",
                "ajaxStop",
                "ajaxComplete",
                "ajaxError",
                "ajaxSuccess",
                "ajaxSend",
              ],
              function (t, e) {
                T.fn[e] = function (t) {
                  return this.on(e, t);
                };
              },
            ),
            T.fn.extend({
              bind: function (t, e, n) {
                return this.on(t, null, e, n);
              },
              unbind: function (t, e) {
                return this.off(t, null, e);
              },
              delegate: function (t, e, n, r) {
                return this.on(e, t, n, r);
              },
              undelegate: function (t, e, n) {
                return 1 === arguments.length
                  ? this.off(t, "**")
                  : this.off(e, t || "**", n);
              },
              hover: function (t, e) {
                return this.on("mouseenter", t).on("mouseleave", e || t);
              },
            }),
            T.each(
              "blur focus focusin focusout resize scroll click dblclick mousedown mouseup mousemove mouseover mouseout mouseenter mouseleave change select submit keydown keypress keyup contextmenu".split(
                " ",
              ),
              function (t, e) {
                T.fn[e] = function (t, n) {
                  return arguments.length > 0
                    ? this.on(e, null, t, n)
                    : this.trigger(e);
                };
              },
            ));
          var rn = /^[\s\uFEFF\xA0]+|([^\s\uFEFF\xA0])[\s\uFEFF\xA0]+$/g;
          ((T.proxy = function (t, e) {
            var n, r, o;
            if (("string" == typeof e && ((n = t[e]), (e = t), (t = n)), g(t)))
              return (
                (r = c.call(arguments, 2)),
                (o = function () {
                  return t.apply(e || this, r.concat(c.call(arguments)));
                }),
                (o.guid = t.guid = t.guid || T.guid++),
                o
              );
          }),
            (T.holdReady = function (t) {
              t ? T.readyWait++ : T.ready(!0);
            }),
            (T.isArray = Array.isArray),
            (T.parseJSON = JSON.parse),
            (T.nodeName = S),
            (T.isFunction = g),
            (T.isWindow = m),
            (T.camelCase = ot),
            (T.type = k),
            (T.now = Date.now),
            (T.isNumeric = function (t) {
              var e = T.type(t);
              return (
                ("number" === e || "string" === e) && !isNaN(t - parseFloat(t))
              );
            }),
            (T.trim = function (t) {
              return null == t ? "" : (t + "").replace(rn, "$1");
            }),
            void 0 ===
              (n = function () {
                return T;
              }.apply(e, [])) || (t.exports = n));
          var on = r.jQuery,
            an = r.$;
          return (
            (T.noConflict = function (t) {
              return (
                r.$ === T && (r.$ = an),
                t && r.jQuery === T && (r.jQuery = on),
                T
              );
            }),
            void 0 === o && (r.jQuery = r.$ = T),
            T
          );
        });
      },
      72: (t) => {
        "use strict";
        var e = [];
        function n(t) {
          for (var n = -1, r = 0; r < e.length; r++)
            if (e[r].identifier === t) {
              n = r;
              break;
            }
          return n;
        }
        function r(t, r) {
          for (var i = {}, a = [], c = 0; c < t.length; c++) {
            var s = t[c],
              u = r.base ? s[0] + r.base : s[0],
              l = i[u] || 0,
              f = "".concat(u, " ").concat(l);
            i[u] = l + 1;
            var p = n(f),
              h = {
                css: s[1],
                media: s[2],
                sourceMap: s[3],
                supports: s[4],
                layer: s[5],
              };
            if (-1 !== p) (e[p].references++, e[p].updater(h));
            else {
              var d = o(h, r);
              ((r.byIndex = c),
                e.splice(c, 0, { identifier: f, updater: d, references: 1 }));
            }
            a.push(f);
          }
          return a;
        }
        function o(t, e) {
          var n = e.domAPI(e);
          n.update(t);
          return function (e) {
            if (e) {
              if (
                e.css === t.css &&
                e.media === t.media &&
                e.sourceMap === t.sourceMap &&
                e.supports === t.supports &&
                e.layer === t.layer
              )
                return;
              n.update((t = e));
            } else n.remove();
          };
        }
        t.exports = function (t, o) {
          var i = r((t = t || []), (o = o || {}));
          return function (t) {
            t = t || [];
            for (var a = 0; a < i.length; a++) {
              var c = n(i[a]);
              e[c].references--;
            }
            for (var s = r(t, o), u = 0; u < i.length; u++) {
              var l = n(i[u]);
              0 === e[l].references && (e[l].updater(), e.splice(l, 1));
            }
            i = s;
          };
        };
      },
      659: (t) => {
        "use strict";
        var e = {};
        t.exports = function (t, n) {
          var r = (function (t) {
            if (void 0 === e[t]) {
              var n = document.querySelector(t);
              if (
                window.HTMLIFrameElement &&
                n instanceof window.HTMLIFrameElement
              )
                try {
                  n = n.contentDocument.head;
                } catch (t) {
                  n = null;
                }
              e[t] = n;
            }
            return e[t];
          })(t);
          if (!r)
            throw new Error(
              "Couldn't find a style target. This probably means that the value for the 'insert' parameter is invalid.",
            );
          r.appendChild(n);
        };
      },
      540: (t) => {
        "use strict";
        t.exports = function (t) {
          var e = document.createElement("style");
          return (t.setAttributes(e, t.attributes), t.insert(e, t.options), e);
        };
      },
      56: (t, e, n) => {
        "use strict";
        t.exports = function (t) {
          var e = n.nc;
          e && t.setAttribute("nonce", e);
        };
      },
      825: (t) => {
        "use strict";
        t.exports = function (t) {
          if ("undefined" == typeof document)
            return { update: function () {}, remove: function () {} };
          var e = t.insertStyleElement(t);
          return {
            update: function (n) {
              !(function (t, e, n) {
                var r = "";
                (n.supports && (r += "@supports (".concat(n.supports, ") {")),
                  n.media && (r += "@media ".concat(n.media, " {")));
                var o = void 0 !== n.layer;
                (o &&
                  (r += "@layer".concat(
                    n.layer.length > 0 ? " ".concat(n.layer) : "",
                    " {",
                  )),
                  (r += n.css),
                  o && (r += "}"),
                  n.media && (r += "}"),
                  n.supports && (r += "}"));
                var i = n.sourceMap;
                (i &&
                  "undefined" != typeof btoa &&
                  (r +=
                    "\n/*# sourceMappingURL=data:application/json;base64,".concat(
                      btoa(unescape(encodeURIComponent(JSON.stringify(i)))),
                      " */",
                    )),
                  e.styleTagTransform(r, t, e.options));
              })(e, t, n);
            },
            remove: function () {
              !(function (t) {
                if (null === t.parentNode) return !1;
                t.parentNode.removeChild(t);
              })(e);
            },
          };
        };
      },
      113: (t) => {
        "use strict";
        t.exports = function (t, e) {
          if (e.styleSheet) e.styleSheet.cssText = t;
          else {
            for (; e.firstChild; ) e.removeChild(e.firstChild);
            e.appendChild(document.createTextNode(t));
          }
        };
      },
    },
    e = {};
  function n(r) {
    var o = e[r];
    if (void 0 !== o) return o.exports;
    var i = (e[r] = { id: r, exports: {} });
    return (t[r].call(i.exports, i, i.exports, n), i.exports);
  }
  ((n.n = (t) => {
    var e = t && t.__esModule ? () => t.default : () => t;
    return (n.d(e, { a: e }), e);
  }),
    (n.d = (t, e) => {
      for (var r in e)
        n.o(e, r) &&
          !n.o(t, r) &&
          Object.defineProperty(t, r, { enumerable: !0, get: e[r] });
    }),
    (n.g = (function () {
      if ("object" == typeof globalThis) return globalThis;
      try {
        return this || new Function("return this")();
      } catch (t) {
        if ("object" == typeof window) return window;
      }
    })()),
    (n.o = (t, e) => Object.prototype.hasOwnProperty.call(t, e)),
    (n.nc = void 0),
    (() => {
      "use strict";
      var t = n(72),
        e = n.n(t),
        r = n(825),
        o = n.n(r),
        i = n(659),
        a = n.n(i),
        c = n(56),
        s = n.n(c),
        u = n(540),
        l = n.n(u),
        f = n(113),
        p = n.n(f),
        h = n(887),
        d = {};
      ((d.styleTagTransform = p()),
        (d.setAttributes = s()),
        (d.insert = a().bind(null, "head")),
        (d.domAPI = o()),
        (d.insertStyleElement = l()));
      e()(h.A, d);
      h.A && h.A.locals && h.A.locals;
      var v = n(692);
      var y = n(282),
        g = {};
      ((g.styleTagTransform = p()),
        (g.setAttributes = s()),
        (g.insert = a().bind(null, "head")),
        (g.domAPI = o()),
        (g.insertStyleElement = l()));
      e()(y.A, g);
      y.A && y.A.locals && y.A.locals;
      function m(t) {
        return (
          (m =
            "function" == typeof Symbol && "symbol" == typeof Symbol.iterator
              ? function (t) {
                  return typeof t;
                }
              : function (t) {
                  return t &&
                    "function" == typeof Symbol &&
                    t.constructor === Symbol &&
                    t !== Symbol.prototype
                    ? "symbol"
                    : typeof t;
                }),
          m(t)
        );
      }
      function b() {
        b = function () {
          return e;
        };
        var t,
          e = {},
          n = Object.prototype,
          r = n.hasOwnProperty,
          o =
            Object.defineProperty ||
            function (t, e, n) {
              t[e] = n.value;
            },
          i = "function" == typeof Symbol ? Symbol : {},
          a = i.iterator || "@@iterator",
          c = i.asyncIterator || "@@asyncIterator",
          s = i.toStringTag || "@@toStringTag";
        function u(t, e, n) {
          return (
            Object.defineProperty(t, e, {
              value: n,
              enumerable: !0,
              configurable: !0,
              writable: !0,
            }),
            t[e]
          );
        }
        try {
          u({}, "");
        } catch (t) {
          u = function (t, e, n) {
            return (t[e] = n);
          };
        }
        function l(t, e, n, r) {
          var i = e && e.prototype instanceof g ? e : g,
            a = Object.create(i.prototype),
            c = new N(r || []);
          return (o(a, "_invoke", { value: A(t, n, c) }), a);
        }
        function f(t, e, n) {
          try {
            return { type: "normal", arg: t.call(e, n) };
          } catch (t) {
            return { type: "throw", arg: t };
          }
        }
        e.wrap = l;
        var p = "suspendedStart",
          h = "suspendedYield",
          d = "executing",
          v = "completed",
          y = {};
        function g() {}
        function x() {}
        function w() {}
        var k = {};
        u(k, a, function () {
          return this;
        });
        var E = Object.getPrototypeOf,
          j = E && E(E(P([])));
        j && j !== n && r.call(j, a) && (k = j);
        var T = (w.prototype = g.prototype = Object.create(k));
        function L(t) {
          ["next", "throw", "return"].forEach(function (e) {
            u(t, e, function (t) {
              return this._invoke(e, t);
            });
          });
        }
        function S(t, e) {
          function n(o, i, a, c) {
            var s = f(t[o], t, i);
            if ("throw" !== s.type) {
              var u = s.arg,
                l = u.value;
              return l && "object" == m(l) && r.call(l, "__await")
                ? e.resolve(l.__await).then(
                    function (t) {
                      n("next", t, a, c);
                    },
                    function (t) {
                      n("throw", t, a, c);
                    },
                  )
                : e.resolve(l).then(
                    function (t) {
                      ((u.value = t), a(u));
                    },
                    function (t) {
                      return n("throw", t, a, c);
                    },
                  );
            }
            c(s.arg);
          }
          var i;
          o(this, "_invoke", {
            value: function (t, r) {
              function o() {
                return new e(function (e, o) {
                  n(t, r, e, o);
                });
              }
              return (i = i ? i.then(o, o) : o());
            },
          });
        }
        function A(e, n, r) {
          var o = p;
          return function (i, a) {
            if (o === d) throw Error("Generator is already running");
            if (o === v) {
              if ("throw" === i) throw a;
              return { value: t, done: !0 };
            }
            for (r.method = i, r.arg = a; ; ) {
              var c = r.delegate;
              if (c) {
                var s = O(c, r);
                if (s) {
                  if (s === y) continue;
                  return s;
                }
              }
              if ("next" === r.method) r.sent = r._sent = r.arg;
              else if ("throw" === r.method) {
                if (o === p) throw ((o = v), r.arg);
                r.dispatchException(r.arg);
              } else "return" === r.method && r.abrupt("return", r.arg);
              o = d;
              var u = f(e, n, r);
              if ("normal" === u.type) {
                if (((o = r.done ? v : h), u.arg === y)) continue;
                return { value: u.arg, done: r.done };
              }
              "throw" === u.type &&
                ((o = v), (r.method = "throw"), (r.arg = u.arg));
            }
          };
        }
        function O(e, n) {
          var r = n.method,
            o = e.iterator[r];
          if (o === t)
            return (
              (n.delegate = null),
              ("throw" === r &&
                e.iterator.return &&
                ((n.method = "return"),
                (n.arg = t),
                O(e, n),
                "throw" === n.method)) ||
                ("return" !== r &&
                  ((n.method = "throw"),
                  (n.arg = new TypeError(
                    "The iterator does not provide a '" + r + "' method",
                  )))),
              y
            );
          var i = f(o, e.iterator, n.arg);
          if ("throw" === i.type)
            return (
              (n.method = "throw"),
              (n.arg = i.arg),
              (n.delegate = null),
              y
            );
          var a = i.arg;
          return a
            ? a.done
              ? ((n[e.resultName] = a.value),
                (n.next = e.nextLoc),
                "return" !== n.method && ((n.method = "next"), (n.arg = t)),
                (n.delegate = null),
                y)
              : a
            : ((n.method = "throw"),
              (n.arg = new TypeError("iterator result is not an object")),
              (n.delegate = null),
              y);
        }
        function C(t) {
          var e = { tryLoc: t[0] };
          (1 in t && (e.catchLoc = t[1]),
            2 in t && ((e.finallyLoc = t[2]), (e.afterLoc = t[3])),
            this.tryEntries.push(e));
        }
        function _(t) {
          var e = t.completion || {};
          ((e.type = "normal"), delete e.arg, (t.completion = e));
        }
        function N(t) {
          ((this.tryEntries = [{ tryLoc: "root" }]),
            t.forEach(C, this),
            this.reset(!0));
        }
        function P(e) {
          if (e || "" === e) {
            var n = e[a];
            if (n) return n.call(e);
            if ("function" == typeof e.next) return e;
            if (!isNaN(e.length)) {
              var o = -1,
                i = function n() {
                  for (; ++o < e.length; )
                    if (r.call(e, o))
                      return ((n.value = e[o]), (n.done = !1), n);
                  return ((n.value = t), (n.done = !0), n);
                };
              return (i.next = i);
            }
          }
          throw new TypeError(m(e) + " is not iterable");
        }
        return (
          (x.prototype = w),
          o(T, "constructor", { value: w, configurable: !0 }),
          o(w, "constructor", { value: x, configurable: !0 }),
          (x.displayName = u(w, s, "GeneratorFunction")),
          (e.isGeneratorFunction = function (t) {
            var e = "function" == typeof t && t.constructor;
            return (
              !!e &&
              (e === x || "GeneratorFunction" === (e.displayName || e.name))
            );
          }),
          (e.mark = function (t) {
            return (
              Object.setPrototypeOf
                ? Object.setPrototypeOf(t, w)
                : ((t.__proto__ = w), u(t, s, "GeneratorFunction")),
              (t.prototype = Object.create(T)),
              t
            );
          }),
          (e.awrap = function (t) {
            return { __await: t };
          }),
          L(S.prototype),
          u(S.prototype, c, function () {
            return this;
          }),
          (e.AsyncIterator = S),
          (e.async = function (t, n, r, o, i) {
            void 0 === i && (i = Promise);
            var a = new S(l(t, n, r, o), i);
            return e.isGeneratorFunction(n)
              ? a
              : a.next().then(function (t) {
                  return t.done ? t.value : a.next();
                });
          }),
          L(T),
          u(T, s, "Generator"),
          u(T, a, function () {
            return this;
          }),
          u(T, "toString", function () {
            return "[object Generator]";
          }),
          (e.keys = function (t) {
            var e = Object(t),
              n = [];
            for (var r in e) n.push(r);
            return (
              n.reverse(),
              function t() {
                for (; n.length; ) {
                  var r = n.pop();
                  if (r in e) return ((t.value = r), (t.done = !1), t);
                }
                return ((t.done = !0), t);
              }
            );
          }),
          (e.values = P),
          (N.prototype = {
            constructor: N,
            reset: function (e) {
              if (
                ((this.prev = 0),
                (this.next = 0),
                (this.sent = this._sent = t),
                (this.done = !1),
                (this.delegate = null),
                (this.method = "next"),
                (this.arg = t),
                this.tryEntries.forEach(_),
                !e)
              )
                for (var n in this)
                  "t" === n.charAt(0) &&
                    r.call(this, n) &&
                    !isNaN(+n.slice(1)) &&
                    (this[n] = t);
            },
            stop: function () {
              this.done = !0;
              var t = this.tryEntries[0].completion;
              if ("throw" === t.type) throw t.arg;
              return this.rval;
            },
            dispatchException: function (e) {
              if (this.done) throw e;
              var n = this;
              function o(r, o) {
                return (
                  (c.type = "throw"),
                  (c.arg = e),
                  (n.next = r),
                  o && ((n.method = "next"), (n.arg = t)),
                  !!o
                );
              }
              for (var i = this.tryEntries.length - 1; i >= 0; --i) {
                var a = this.tryEntries[i],
                  c = a.completion;
                if ("root" === a.tryLoc) return o("end");
                if (a.tryLoc <= this.prev) {
                  var s = r.call(a, "catchLoc"),
                    u = r.call(a, "finallyLoc");
                  if (s && u) {
                    if (this.prev < a.catchLoc) return o(a.catchLoc, !0);
                    if (this.prev < a.finallyLoc) return o(a.finallyLoc);
                  } else if (s) {
                    if (this.prev < a.catchLoc) return o(a.catchLoc, !0);
                  } else {
                    if (!u)
                      throw Error("try statement without catch or finally");
                    if (this.prev < a.finallyLoc) return o(a.finallyLoc);
                  }
                }
              }
            },
            abrupt: function (t, e) {
              for (var n = this.tryEntries.length - 1; n >= 0; --n) {
                var o = this.tryEntries[n];
                if (
                  o.tryLoc <= this.prev &&
                  r.call(o, "finallyLoc") &&
                  this.prev < o.finallyLoc
                ) {
                  var i = o;
                  break;
                }
              }
              i &&
                ("break" === t || "continue" === t) &&
                i.tryLoc <= e &&
                e <= i.finallyLoc &&
                (i = null);
              var a = i ? i.completion : {};
              return (
                (a.type = t),
                (a.arg = e),
                i
                  ? ((this.method = "next"), (this.next = i.finallyLoc), y)
                  : this.complete(a)
              );
            },
            complete: function (t, e) {
              if ("throw" === t.type) throw t.arg;
              return (
                "break" === t.type || "continue" === t.type
                  ? (this.next = t.arg)
                  : "return" === t.type
                    ? ((this.rval = this.arg = t.arg),
                      (this.method = "return"),
                      (this.next = "end"))
                    : "normal" === t.type && e && (this.next = e),
                y
              );
            },
            finish: function (t) {
              for (var e = this.tryEntries.length - 1; e >= 0; --e) {
                var n = this.tryEntries[e];
                if (n.finallyLoc === t)
                  return (this.complete(n.completion, n.afterLoc), _(n), y);
              }
            },
            catch: function (t) {
              for (var e = this.tryEntries.length - 1; e >= 0; --e) {
                var n = this.tryEntries[e];
                if (n.tryLoc === t) {
                  var r = n.completion;
                  if ("throw" === r.type) {
                    var o = r.arg;
                    _(n);
                  }
                  return o;
                }
              }
              throw Error("illegal catch attempt");
            },
            delegateYield: function (e, n, r) {
              return (
                (this.delegate = { iterator: P(e), resultName: n, nextLoc: r }),
                "next" === this.method && (this.arg = t),
                y
              );
            },
          }),
          e
        );
      }
      function x(t, e, n, r, o, i, a) {
        try {
          var c = t[i](a),
            s = c.value;
        } catch (t) {
          return void n(t);
        }
        c.done ? e(s) : Promise.resolve(s).then(r, o);
      }
      function w(t, e) {
        for (var n = 0; n < e.length; n++) {
          var r = e[n];
          ((r.enumerable = r.enumerable || !1),
            (r.configurable = !0),
            "value" in r && (r.writable = !0),
            Object.defineProperty(t, k(r.key), r));
        }
      }
      function k(t) {
        var e = (function (t, e) {
          if ("object" != m(t) || !t) return t;
          var n = t[Symbol.toPrimitive];
          if (void 0 !== n) {
            var r = n.call(t, e || "default");
            if ("object" != m(r)) return r;
            throw new TypeError("@@toPrimitive must return a primitive value.");
          }
          return ("string" === e ? String : Number)(t);
        })(t, "string");
        return "symbol" == m(e) ? e : e + "";
      }
      var E = (function () {
          return (
            (t = function t() {
              (!(function (t, e) {
                if (!(t instanceof e))
                  throw new TypeError("Cannot call a class as a function");
              })(this, t),
                (this.locked = !1),
                (this.queue = []));
            }),
            (e = [
              {
                key: "lock",
                value:
                  ((r = b().mark(function t() {
                    var e = this;
                    return b().wrap(function (t) {
                      for (;;)
                        switch ((t.prev = t.next)) {
                          case 0:
                            return t.abrupt(
                              "return",
                              new Promise(function (t) {
                                e.locked
                                  ? e.queue.push(t)
                                  : ((e.locked = !0), t());
                              }),
                            );
                          case 1:
                          case "end":
                            return t.stop();
                        }
                    }, t);
                  })),
                  (o = function () {
                    var t = this,
                      e = arguments;
                    return new Promise(function (n, o) {
                      var i = r.apply(t, e);
                      function a(t) {
                        x(i, n, o, a, c, "next", t);
                      }
                      function c(t) {
                        x(i, n, o, a, c, "throw", t);
                      }
                      a(void 0);
                    });
                  }),
                  function () {
                    return o.apply(this, arguments);
                  }),
              },
              {
                key: "unlock",
                value: function () {
                  this.queue.length ? this.queue.shift()() : (this.locked = !1);
                },
              },
            ]),
            e && w(t.prototype, e),
            n && w(t, n),
            Object.defineProperty(t, "prototype", { writable: !1 }),
            t
          );
          var t, e, n, r, o;
        })(),
        j = n(692);
      function T(t) {
        return (
          (T =
            "function" == typeof Symbol && "symbol" == typeof Symbol.iterator
              ? function (t) {
                  return typeof t;
                }
              : function (t) {
                  return t &&
                    "function" == typeof Symbol &&
                    t.constructor === Symbol &&
                    t !== Symbol.prototype
                    ? "symbol"
                    : typeof t;
                }),
          T(t)
        );
      }
      function L(t, e) {
        for (var n = 0; n < e.length; n++) {
          var r = e[n];
          ((r.enumerable = r.enumerable || !1),
            (r.configurable = !0),
            "value" in r && (r.writable = !0),
            Object.defineProperty(t, S(r.key), r));
        }
      }
      function S(t) {
        var e = (function (t, e) {
          if ("object" != T(t) || !t) return t;
          var n = t[Symbol.toPrimitive];
          if (void 0 !== n) {
            var r = n.call(t, e || "default");
            if ("object" != T(r)) return r;
            throw new TypeError("@@toPrimitive must return a primitive value.");
          }
          return ("string" === e ? String : Number)(t);
        })(t, "string");
        return "symbol" == T(e) ? e : e + "";
      }
      const A = new ((function () {
        return (
          (t = function t() {
            (!(function (t, e) {
              if (!(t instanceof e))
                throw new TypeError("Cannot call a class as a function");
            })(this, t),
              (this.chap_info = this.getChapterInfo()),
              (this.manga_name = this.chap_info.manga_name),
              (this.chap_list = this.chap_info.chap_list),
              (this.chap_num = this.chap_list.length),
              (this.chap_dllist = []),
              (this.entry_chap = 0),
              (this.end_chap = 0),
              (this.max_chap_par = 0),
              (this.max_img_par = 0),
              (this.dling = !1),
              (this.zip = []),
              (this.storing = new E()),
              (this.retry = 0),
              (this.updating = new E()),
              (this.net_chap = 0));
          }),
          (e = [
            {
              key: "init",
              value: function () {
                (j("#mangadl-retry").attr("class").includes("none") ||
                  j("#mangadl-retry").addClass("none"),
                  (this.entry_chap = 0),
                  (this.end_chap = 0),
                  (this.max_chap_par = 0),
                  (this.max_img_par = 0),
                  (this.chap_dllist = []),
                  (this.zip = []),
                  console.clear());
              },
            },
            {
              key: "getChapterInfo",
              value: function () {
                var t = j(".uk-switcher .uk-heading-line").text(),
                  e = "",
                  n = "";
                t.includes("【")
                  ? ((e = t.match(/(?<=【)[^[【】]+(?=】)/g)[1]),
                    (n = t.split("【")[0]))
                  : (n = t.split(" ")[0]);
                var r = n + (e ? "｜" + e : e),
                  o = [],
                  i = "";
                switch (location.hostname.includes("ant")) {
                  case !0:
                    i =
                      ".uk-container ul.uk-switcher .muludiv a.uk-button-default";
                    break;
                  case !1:
                    i = ".uk-grid-collapse .muludiv a";
                }
                return (
                  (function (t) {
                    j(t).each(function (t, e) {
                      var n = [
                        window.location.protocol,
                        "//",
                        window.location.host,
                        "/",
                        j(e).attr("href"),
                      ].join("");
                      o.push({ number: j(e).text().padStart(2, "0"), url: n });
                    });
                  })(i),
                  { chap_list: o, manga_name: r }
                );
              },
            },
          ]) && L(t.prototype, e),
          n && L(t, n),
          Object.defineProperty(t, "prototype", { writable: !1 }),
          t
        );
        var t, e, n;
      })())();
      function O(t) {
        return (
          (O =
            "function" == typeof Symbol && "symbol" == typeof Symbol.iterator
              ? function (t) {
                  return typeof t;
                }
              : function (t) {
                  return t &&
                    "function" == typeof Symbol &&
                    t.constructor === Symbol &&
                    t !== Symbol.prototype
                    ? "symbol"
                    : typeof t;
                }),
          O(t)
        );
      }
      function C() {
        C = function () {
          return e;
        };
        var t,
          e = {},
          n = Object.prototype,
          r = n.hasOwnProperty,
          o =
            Object.defineProperty ||
            function (t, e, n) {
              t[e] = n.value;
            },
          i = "function" == typeof Symbol ? Symbol : {},
          a = i.iterator || "@@iterator",
          c = i.asyncIterator || "@@asyncIterator",
          s = i.toStringTag || "@@toStringTag";
        function u(t, e, n) {
          return (
            Object.defineProperty(t, e, {
              value: n,
              enumerable: !0,
              configurable: !0,
              writable: !0,
            }),
            t[e]
          );
        }
        try {
          u({}, "");
        } catch (t) {
          u = function (t, e, n) {
            return (t[e] = n);
          };
        }
        function l(t, e, n, r) {
          var i = e && e.prototype instanceof g ? e : g,
            a = Object.create(i.prototype),
            c = new N(r || []);
          return (o(a, "_invoke", { value: L(t, n, c) }), a);
        }
        function f(t, e, n) {
          try {
            return { type: "normal", arg: t.call(e, n) };
          } catch (t) {
            return { type: "throw", arg: t };
          }
        }
        e.wrap = l;
        var p = "suspendedStart",
          h = "suspendedYield",
          d = "executing",
          v = "completed",
          y = {};
        function g() {}
        function m() {}
        function b() {}
        var x = {};
        u(x, a, function () {
          return this;
        });
        var w = Object.getPrototypeOf,
          k = w && w(w(P([])));
        k && k !== n && r.call(k, a) && (x = k);
        var E = (b.prototype = g.prototype = Object.create(x));
        function j(t) {
          ["next", "throw", "return"].forEach(function (e) {
            u(t, e, function (t) {
              return this._invoke(e, t);
            });
          });
        }
        function T(t, e) {
          function n(o, i, a, c) {
            var s = f(t[o], t, i);
            if ("throw" !== s.type) {
              var u = s.arg,
                l = u.value;
              return l && "object" == O(l) && r.call(l, "__await")
                ? e.resolve(l.__await).then(
                    function (t) {
                      n("next", t, a, c);
                    },
                    function (t) {
                      n("throw", t, a, c);
                    },
                  )
                : e.resolve(l).then(
                    function (t) {
                      ((u.value = t), a(u));
                    },
                    function (t) {
                      return n("throw", t, a, c);
                    },
                  );
            }
            c(s.arg);
          }
          var i;
          o(this, "_invoke", {
            value: function (t, r) {
              function o() {
                return new e(function (e, o) {
                  n(t, r, e, o);
                });
              }
              return (i = i ? i.then(o, o) : o());
            },
          });
        }
        function L(e, n, r) {
          var o = p;
          return function (i, a) {
            if (o === d) throw Error("Generator is already running");
            if (o === v) {
              if ("throw" === i) throw a;
              return { value: t, done: !0 };
            }
            for (r.method = i, r.arg = a; ; ) {
              var c = r.delegate;
              if (c) {
                var s = S(c, r);
                if (s) {
                  if (s === y) continue;
                  return s;
                }
              }
              if ("next" === r.method) r.sent = r._sent = r.arg;
              else if ("throw" === r.method) {
                if (o === p) throw ((o = v), r.arg);
                r.dispatchException(r.arg);
              } else "return" === r.method && r.abrupt("return", r.arg);
              o = d;
              var u = f(e, n, r);
              if ("normal" === u.type) {
                if (((o = r.done ? v : h), u.arg === y)) continue;
                return { value: u.arg, done: r.done };
              }
              "throw" === u.type &&
                ((o = v), (r.method = "throw"), (r.arg = u.arg));
            }
          };
        }
        function S(e, n) {
          var r = n.method,
            o = e.iterator[r];
          if (o === t)
            return (
              (n.delegate = null),
              ("throw" === r &&
                e.iterator.return &&
                ((n.method = "return"),
                (n.arg = t),
                S(e, n),
                "throw" === n.method)) ||
                ("return" !== r &&
                  ((n.method = "throw"),
                  (n.arg = new TypeError(
                    "The iterator does not provide a '" + r + "' method",
                  )))),
              y
            );
          var i = f(o, e.iterator, n.arg);
          if ("throw" === i.type)
            return (
              (n.method = "throw"),
              (n.arg = i.arg),
              (n.delegate = null),
              y
            );
          var a = i.arg;
          return a
            ? a.done
              ? ((n[e.resultName] = a.value),
                (n.next = e.nextLoc),
                "return" !== n.method && ((n.method = "next"), (n.arg = t)),
                (n.delegate = null),
                y)
              : a
            : ((n.method = "throw"),
              (n.arg = new TypeError("iterator result is not an object")),
              (n.delegate = null),
              y);
        }
        function A(t) {
          var e = { tryLoc: t[0] };
          (1 in t && (e.catchLoc = t[1]),
            2 in t && ((e.finallyLoc = t[2]), (e.afterLoc = t[3])),
            this.tryEntries.push(e));
        }
        function _(t) {
          var e = t.completion || {};
          ((e.type = "normal"), delete e.arg, (t.completion = e));
        }
        function N(t) {
          ((this.tryEntries = [{ tryLoc: "root" }]),
            t.forEach(A, this),
            this.reset(!0));
        }
        function P(e) {
          if (e || "" === e) {
            var n = e[a];
            if (n) return n.call(e);
            if ("function" == typeof e.next) return e;
            if (!isNaN(e.length)) {
              var o = -1,
                i = function n() {
                  for (; ++o < e.length; )
                    if (r.call(e, o))
                      return ((n.value = e[o]), (n.done = !1), n);
                  return ((n.value = t), (n.done = !0), n);
                };
              return (i.next = i);
            }
          }
          throw new TypeError(O(e) + " is not iterable");
        }
        return (
          (m.prototype = b),
          o(E, "constructor", { value: b, configurable: !0 }),
          o(b, "constructor", { value: m, configurable: !0 }),
          (m.displayName = u(b, s, "GeneratorFunction")),
          (e.isGeneratorFunction = function (t) {
            var e = "function" == typeof t && t.constructor;
            return (
              !!e &&
              (e === m || "GeneratorFunction" === (e.displayName || e.name))
            );
          }),
          (e.mark = function (t) {
            return (
              Object.setPrototypeOf
                ? Object.setPrototypeOf(t, b)
                : ((t.__proto__ = b), u(t, s, "GeneratorFunction")),
              (t.prototype = Object.create(E)),
              t
            );
          }),
          (e.awrap = function (t) {
            return { __await: t };
          }),
          j(T.prototype),
          u(T.prototype, c, function () {
            return this;
          }),
          (e.AsyncIterator = T),
          (e.async = function (t, n, r, o, i) {
            void 0 === i && (i = Promise);
            var a = new T(l(t, n, r, o), i);
            return e.isGeneratorFunction(n)
              ? a
              : a.next().then(function (t) {
                  return t.done ? t.value : a.next();
                });
          }),
          j(E),
          u(E, s, "Generator"),
          u(E, a, function () {
            return this;
          }),
          u(E, "toString", function () {
            return "[object Generator]";
          }),
          (e.keys = function (t) {
            var e = Object(t),
              n = [];
            for (var r in e) n.push(r);
            return (
              n.reverse(),
              function t() {
                for (; n.length; ) {
                  var r = n.pop();
                  if (r in e) return ((t.value = r), (t.done = !1), t);
                }
                return ((t.done = !0), t);
              }
            );
          }),
          (e.values = P),
          (N.prototype = {
            constructor: N,
            reset: function (e) {
              if (
                ((this.prev = 0),
                (this.next = 0),
                (this.sent = this._sent = t),
                (this.done = !1),
                (this.delegate = null),
                (this.method = "next"),
                (this.arg = t),
                this.tryEntries.forEach(_),
                !e)
              )
                for (var n in this)
                  "t" === n.charAt(0) &&
                    r.call(this, n) &&
                    !isNaN(+n.slice(1)) &&
                    (this[n] = t);
            },
            stop: function () {
              this.done = !0;
              var t = this.tryEntries[0].completion;
              if ("throw" === t.type) throw t.arg;
              return this.rval;
            },
            dispatchException: function (e) {
              if (this.done) throw e;
              var n = this;
              function o(r, o) {
                return (
                  (c.type = "throw"),
                  (c.arg = e),
                  (n.next = r),
                  o && ((n.method = "next"), (n.arg = t)),
                  !!o
                );
              }
              for (var i = this.tryEntries.length - 1; i >= 0; --i) {
                var a = this.tryEntries[i],
                  c = a.completion;
                if ("root" === a.tryLoc) return o("end");
                if (a.tryLoc <= this.prev) {
                  var s = r.call(a, "catchLoc"),
                    u = r.call(a, "finallyLoc");
                  if (s && u) {
                    if (this.prev < a.catchLoc) return o(a.catchLoc, !0);
                    if (this.prev < a.finallyLoc) return o(a.finallyLoc);
                  } else if (s) {
                    if (this.prev < a.catchLoc) return o(a.catchLoc, !0);
                  } else {
                    if (!u)
                      throw Error("try statement without catch or finally");
                    if (this.prev < a.finallyLoc) return o(a.finallyLoc);
                  }
                }
              }
            },
            abrupt: function (t, e) {
              for (var n = this.tryEntries.length - 1; n >= 0; --n) {
                var o = this.tryEntries[n];
                if (
                  o.tryLoc <= this.prev &&
                  r.call(o, "finallyLoc") &&
                  this.prev < o.finallyLoc
                ) {
                  var i = o;
                  break;
                }
              }
              i &&
                ("break" === t || "continue" === t) &&
                i.tryLoc <= e &&
                e <= i.finallyLoc &&
                (i = null);
              var a = i ? i.completion : {};
              return (
                (a.type = t),
                (a.arg = e),
                i
                  ? ((this.method = "next"), (this.next = i.finallyLoc), y)
                  : this.complete(a)
              );
            },
            complete: function (t, e) {
              if ("throw" === t.type) throw t.arg;
              return (
                "break" === t.type || "continue" === t.type
                  ? (this.next = t.arg)
                  : "return" === t.type
                    ? ((this.rval = this.arg = t.arg),
                      (this.method = "return"),
                      (this.next = "end"))
                    : "normal" === t.type && e && (this.next = e),
                y
              );
            },
            finish: function (t) {
              for (var e = this.tryEntries.length - 1; e >= 0; --e) {
                var n = this.tryEntries[e];
                if (n.finallyLoc === t)
                  return (this.complete(n.completion, n.afterLoc), _(n), y);
              }
            },
            catch: function (t) {
              for (var e = this.tryEntries.length - 1; e >= 0; --e) {
                var n = this.tryEntries[e];
                if (n.tryLoc === t) {
                  var r = n.completion;
                  if ("throw" === r.type) {
                    var o = r.arg;
                    _(n);
                  }
                  return o;
                }
              }
              throw Error("illegal catch attempt");
            },
            delegateYield: function (e, n, r) {
              return (
                (this.delegate = { iterator: P(e), resultName: n, nextLoc: r }),
                "next" === this.method && (this.arg = t),
                y
              );
            },
          }),
          e
        );
      }
      function _(t, e, n, r, o, i, a) {
        try {
          var c = t[i](a),
            s = c.value;
        } catch (t) {
          return void n(t);
        }
        c.done ? e(s) : Promise.resolve(s).then(r, o);
      }
      function N(t) {
        return function () {
          var e = this,
            n = arguments;
          return new Promise(function (r, o) {
            var i = t.apply(e, n);
            function a(t) {
              _(i, r, o, a, c, "next", t);
            }
            function c(t) {
              _(i, r, o, a, c, "throw", t);
            }
            a(void 0);
          });
        };
      }
      function P(t, e) {
        for (var n = 0; n < e.length; n++) {
          var r = e[n];
          ((r.enumerable = r.enumerable || !1),
            (r.configurable = !0),
            "value" in r && (r.writable = !0),
            Object.defineProperty(t, D(r.key), r));
        }
      }
      function D(t) {
        var e = (function (t, e) {
          if ("object" != O(t) || !t) return t;
          var n = t[Symbol.toPrimitive];
          if (void 0 !== n) {
            var r = n.call(t, e || "default");
            if ("object" != O(r)) return r;
            throw new TypeError("@@toPrimitive must return a primitive value.");
          }
          return ("string" === e ? String : Number)(t);
        })(t, "string");
        return "symbol" == O(e) ? e : e + "";
      }
      var q = (function () {
        return (
          (t = function t(e) {
            (!(function (t, e) {
              if (!(t instanceof e))
                throw new TypeError("Cannot call a class as a function");
            })(this, t),
              (this.counter = e),
              (this.waitlist = []),
              (this.paused = !1),
              (this.pauseRes = []),
              (this.terminated = !1));
          }),
          (e = [
            {
              key: "acquire",
              value:
                ((i = N(
                  C().mark(function t() {
                    var e = this;
                    return C().wrap(
                      function (t) {
                        for (;;)
                          switch ((t.prev = t.next)) {
                            case 0:
                              return ((t.next = 2), this.check());
                            case 2:
                              if (!(this.counter > 0)) {
                                t.next = 6;
                                break;
                              }
                              (this.counter--, (t.next = 8));
                              break;
                            case 6:
                              return (
                                (t.next = 8),
                                new Promise(function (t) {
                                  e.waitlist.push(t);
                                })
                              );
                            case 8:
                            case "end":
                              return t.stop();
                          }
                      },
                      t,
                      this,
                    );
                  }),
                )),
                function () {
                  return i.apply(this, arguments);
                }),
            },
            {
              key: "release",
              value:
                ((o = N(
                  C().mark(function t() {
                    return C().wrap(
                      function (t) {
                        for (;;)
                          switch ((t.prev = t.next)) {
                            case 0:
                              return ((t.next = 2), this.check());
                            case 2:
                              (this.waitlist.length > 0 &&
                                (this.counter--, this.waitlist.shift()()),
                                this.counter++);
                            case 4:
                            case "end":
                              return t.stop();
                          }
                      },
                      t,
                      this,
                    );
                  }),
                )),
                function () {
                  return o.apply(this, arguments);
                }),
            },
            {
              key: "check",
              value:
                ((r = N(
                  C().mark(function t() {
                    var e = this;
                    return C().wrap(
                      function (t) {
                        for (;;)
                          switch ((t.prev = t.next)) {
                            case 0:
                              if (((t.t0 = this.paused), !t.t0)) {
                                t.next = 4;
                                break;
                              }
                              return (
                                (t.next = 4),
                                new Promise(function (t) {
                                  e.pauseRes.push(t);
                                })
                              );
                            case 4:
                            case "end":
                              return t.stop();
                          }
                      },
                      t,
                      this,
                    );
                  }),
                )),
                function () {
                  return r.apply(this, arguments);
                }),
            },
            {
              key: "togglePause",
              value: function () {
                ((this.paused = !this.paused),
                  !this.paused &&
                    this.pauseRes.forEach(function (t) {
                      return t();
                    }));
              },
            },
            {
              key: "terminate",
              value: function () {
                ((this.terminated = !0),
                  this.paused && this.togglePause(),
                  this.waitlist.forEach(function (t) {
                    t();
                  }));
              },
            },
          ]),
          e && P(t.prototype, e),
          n && P(t, n),
          Object.defineProperty(t, "prototype", { writable: !1 }),
          t
        );
        var t, e, n, r, o, i;
      })();
      function H(t) {
        return (
          (H =
            "function" == typeof Symbol && "symbol" == typeof Symbol.iterator
              ? function (t) {
                  return typeof t;
                }
              : function (t) {
                  return t &&
                    "function" == typeof Symbol &&
                    t.constructor === Symbol &&
                    t !== Symbol.prototype
                    ? "symbol"
                    : typeof t;
                }),
          H(t)
        );
      }
      function R() {
        R = function () {
          return e;
        };
        var t,
          e = {},
          n = Object.prototype,
          r = n.hasOwnProperty,
          o =
            Object.defineProperty ||
            function (t, e, n) {
              t[e] = n.value;
            },
          i = "function" == typeof Symbol ? Symbol : {},
          a = i.iterator || "@@iterator",
          c = i.asyncIterator || "@@asyncIterator",
          s = i.toStringTag || "@@toStringTag";
        function u(t, e, n) {
          return (
            Object.defineProperty(t, e, {
              value: n,
              enumerable: !0,
              configurable: !0,
              writable: !0,
            }),
            t[e]
          );
        }
        try {
          u({}, "");
        } catch (t) {
          u = function (t, e, n) {
            return (t[e] = n);
          };
        }
        function l(t, e, n, r) {
          var i = e && e.prototype instanceof g ? e : g,
            a = Object.create(i.prototype),
            c = new C(r || []);
          return (o(a, "_invoke", { value: L(t, n, c) }), a);
        }
        function f(t, e, n) {
          try {
            return { type: "normal", arg: t.call(e, n) };
          } catch (t) {
            return { type: "throw", arg: t };
          }
        }
        e.wrap = l;
        var p = "suspendedStart",
          h = "suspendedYield",
          d = "executing",
          v = "completed",
          y = {};
        function g() {}
        function m() {}
        function b() {}
        var x = {};
        u(x, a, function () {
          return this;
        });
        var w = Object.getPrototypeOf,
          k = w && w(w(_([])));
        k && k !== n && r.call(k, a) && (x = k);
        var E = (b.prototype = g.prototype = Object.create(x));
        function j(t) {
          ["next", "throw", "return"].forEach(function (e) {
            u(t, e, function (t) {
              return this._invoke(e, t);
            });
          });
        }
        function T(t, e) {
          function n(o, i, a, c) {
            var s = f(t[o], t, i);
            if ("throw" !== s.type) {
              var u = s.arg,
                l = u.value;
              return l && "object" == H(l) && r.call(l, "__await")
                ? e.resolve(l.__await).then(
                    function (t) {
                      n("next", t, a, c);
                    },
                    function (t) {
                      n("throw", t, a, c);
                    },
                  )
                : e.resolve(l).then(
                    function (t) {
                      ((u.value = t), a(u));
                    },
                    function (t) {
                      return n("throw", t, a, c);
                    },
                  );
            }
            c(s.arg);
          }
          var i;
          o(this, "_invoke", {
            value: function (t, r) {
              function o() {
                return new e(function (e, o) {
                  n(t, r, e, o);
                });
              }
              return (i = i ? i.then(o, o) : o());
            },
          });
        }
        function L(e, n, r) {
          var o = p;
          return function (i, a) {
            if (o === d) throw Error("Generator is already running");
            if (o === v) {
              if ("throw" === i) throw a;
              return { value: t, done: !0 };
            }
            for (r.method = i, r.arg = a; ; ) {
              var c = r.delegate;
              if (c) {
                var s = S(c, r);
                if (s) {
                  if (s === y) continue;
                  return s;
                }
              }
              if ("next" === r.method) r.sent = r._sent = r.arg;
              else if ("throw" === r.method) {
                if (o === p) throw ((o = v), r.arg);
                r.dispatchException(r.arg);
              } else "return" === r.method && r.abrupt("return", r.arg);
              o = d;
              var u = f(e, n, r);
              if ("normal" === u.type) {
                if (((o = r.done ? v : h), u.arg === y)) continue;
                return { value: u.arg, done: r.done };
              }
              "throw" === u.type &&
                ((o = v), (r.method = "throw"), (r.arg = u.arg));
            }
          };
        }
        function S(e, n) {
          var r = n.method,
            o = e.iterator[r];
          if (o === t)
            return (
              (n.delegate = null),
              ("throw" === r &&
                e.iterator.return &&
                ((n.method = "return"),
                (n.arg = t),
                S(e, n),
                "throw" === n.method)) ||
                ("return" !== r &&
                  ((n.method = "throw"),
                  (n.arg = new TypeError(
                    "The iterator does not provide a '" + r + "' method",
                  )))),
              y
            );
          var i = f(o, e.iterator, n.arg);
          if ("throw" === i.type)
            return (
              (n.method = "throw"),
              (n.arg = i.arg),
              (n.delegate = null),
              y
            );
          var a = i.arg;
          return a
            ? a.done
              ? ((n[e.resultName] = a.value),
                (n.next = e.nextLoc),
                "return" !== n.method && ((n.method = "next"), (n.arg = t)),
                (n.delegate = null),
                y)
              : a
            : ((n.method = "throw"),
              (n.arg = new TypeError("iterator result is not an object")),
              (n.delegate = null),
              y);
        }
        function A(t) {
          var e = { tryLoc: t[0] };
          (1 in t && (e.catchLoc = t[1]),
            2 in t && ((e.finallyLoc = t[2]), (e.afterLoc = t[3])),
            this.tryEntries.push(e));
        }
        function O(t) {
          var e = t.completion || {};
          ((e.type = "normal"), delete e.arg, (t.completion = e));
        }
        function C(t) {
          ((this.tryEntries = [{ tryLoc: "root" }]),
            t.forEach(A, this),
            this.reset(!0));
        }
        function _(e) {
          if (e || "" === e) {
            var n = e[a];
            if (n) return n.call(e);
            if ("function" == typeof e.next) return e;
            if (!isNaN(e.length)) {
              var o = -1,
                i = function n() {
                  for (; ++o < e.length; )
                    if (r.call(e, o))
                      return ((n.value = e[o]), (n.done = !1), n);
                  return ((n.value = t), (n.done = !0), n);
                };
              return (i.next = i);
            }
          }
          throw new TypeError(H(e) + " is not iterable");
        }
        return (
          (m.prototype = b),
          o(E, "constructor", { value: b, configurable: !0 }),
          o(b, "constructor", { value: m, configurable: !0 }),
          (m.displayName = u(b, s, "GeneratorFunction")),
          (e.isGeneratorFunction = function (t) {
            var e = "function" == typeof t && t.constructor;
            return (
              !!e &&
              (e === m || "GeneratorFunction" === (e.displayName || e.name))
            );
          }),
          (e.mark = function (t) {
            return (
              Object.setPrototypeOf
                ? Object.setPrototypeOf(t, b)
                : ((t.__proto__ = b), u(t, s, "GeneratorFunction")),
              (t.prototype = Object.create(E)),
              t
            );
          }),
          (e.awrap = function (t) {
            return { __await: t };
          }),
          j(T.prototype),
          u(T.prototype, c, function () {
            return this;
          }),
          (e.AsyncIterator = T),
          (e.async = function (t, n, r, o, i) {
            void 0 === i && (i = Promise);
            var a = new T(l(t, n, r, o), i);
            return e.isGeneratorFunction(n)
              ? a
              : a.next().then(function (t) {
                  return t.done ? t.value : a.next();
                });
          }),
          j(E),
          u(E, s, "Generator"),
          u(E, a, function () {
            return this;
          }),
          u(E, "toString", function () {
            return "[object Generator]";
          }),
          (e.keys = function (t) {
            var e = Object(t),
              n = [];
            for (var r in e) n.push(r);
            return (
              n.reverse(),
              function t() {
                for (; n.length; ) {
                  var r = n.pop();
                  if (r in e) return ((t.value = r), (t.done = !1), t);
                }
                return ((t.done = !0), t);
              }
            );
          }),
          (e.values = _),
          (C.prototype = {
            constructor: C,
            reset: function (e) {
              if (
                ((this.prev = 0),
                (this.next = 0),
                (this.sent = this._sent = t),
                (this.done = !1),
                (this.delegate = null),
                (this.method = "next"),
                (this.arg = t),
                this.tryEntries.forEach(O),
                !e)
              )
                for (var n in this)
                  "t" === n.charAt(0) &&
                    r.call(this, n) &&
                    !isNaN(+n.slice(1)) &&
                    (this[n] = t);
            },
            stop: function () {
              this.done = !0;
              var t = this.tryEntries[0].completion;
              if ("throw" === t.type) throw t.arg;
              return this.rval;
            },
            dispatchException: function (e) {
              if (this.done) throw e;
              var n = this;
              function o(r, o) {
                return (
                  (c.type = "throw"),
                  (c.arg = e),
                  (n.next = r),
                  o && ((n.method = "next"), (n.arg = t)),
                  !!o
                );
              }
              for (var i = this.tryEntries.length - 1; i >= 0; --i) {
                var a = this.tryEntries[i],
                  c = a.completion;
                if ("root" === a.tryLoc) return o("end");
                if (a.tryLoc <= this.prev) {
                  var s = r.call(a, "catchLoc"),
                    u = r.call(a, "finallyLoc");
                  if (s && u) {
                    if (this.prev < a.catchLoc) return o(a.catchLoc, !0);
                    if (this.prev < a.finallyLoc) return o(a.finallyLoc);
                  } else if (s) {
                    if (this.prev < a.catchLoc) return o(a.catchLoc, !0);
                  } else {
                    if (!u)
                      throw Error("try statement without catch or finally");
                    if (this.prev < a.finallyLoc) return o(a.finallyLoc);
                  }
                }
              }
            },
            abrupt: function (t, e) {
              for (var n = this.tryEntries.length - 1; n >= 0; --n) {
                var o = this.tryEntries[n];
                if (
                  o.tryLoc <= this.prev &&
                  r.call(o, "finallyLoc") &&
                  this.prev < o.finallyLoc
                ) {
                  var i = o;
                  break;
                }
              }
              i &&
                ("break" === t || "continue" === t) &&
                i.tryLoc <= e &&
                e <= i.finallyLoc &&
                (i = null);
              var a = i ? i.completion : {};
              return (
                (a.type = t),
                (a.arg = e),
                i
                  ? ((this.method = "next"), (this.next = i.finallyLoc), y)
                  : this.complete(a)
              );
            },
            complete: function (t, e) {
              if ("throw" === t.type) throw t.arg;
              return (
                "break" === t.type || "continue" === t.type
                  ? (this.next = t.arg)
                  : "return" === t.type
                    ? ((this.rval = this.arg = t.arg),
                      (this.method = "return"),
                      (this.next = "end"))
                    : "normal" === t.type && e && (this.next = e),
                y
              );
            },
            finish: function (t) {
              for (var e = this.tryEntries.length - 1; e >= 0; --e) {
                var n = this.tryEntries[e];
                if (n.finallyLoc === t)
                  return (this.complete(n.completion, n.afterLoc), O(n), y);
              }
            },
            catch: function (t) {
              for (var e = this.tryEntries.length - 1; e >= 0; --e) {
                var n = this.tryEntries[e];
                if (n.tryLoc === t) {
                  var r = n.completion;
                  if ("throw" === r.type) {
                    var o = r.arg;
                    O(n);
                  }
                  return o;
                }
              }
              throw Error("illegal catch attempt");
            },
            delegateYield: function (e, n, r) {
              return (
                (this.delegate = { iterator: _(e), resultName: n, nextLoc: r }),
                "next" === this.method && (this.arg = t),
                y
              );
            },
          }),
          e
        );
      }
      function I(t) {
        return (
          (function (t) {
            if (Array.isArray(t)) return F(t);
          })(t) ||
          (function (t) {
            if (
              ("undefined" != typeof Symbol && null != t[Symbol.iterator]) ||
              null != t["@@iterator"]
            )
              return Array.from(t);
          })(t) ||
          (function (t, e) {
            if (t) {
              if ("string" == typeof t) return F(t, e);
              var n = {}.toString.call(t).slice(8, -1);
              return (
                "Object" === n && t.constructor && (n = t.constructor.name),
                "Map" === n || "Set" === n
                  ? Array.from(t)
                  : "Arguments" === n ||
                      /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)
                    ? F(t, e)
                    : void 0
              );
            }
          })(t) ||
          (function () {
            throw new TypeError(
              "Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.",
            );
          })()
        );
      }
      function F(t, e) {
        (null == e || e > t.length) && (e = t.length);
        for (var n = 0, r = Array(e); n < e; n++) r[n] = t[n];
        return r;
      }
      function M(t, e) {
        var n = Object.keys(t);
        if (Object.getOwnPropertySymbols) {
          var r = Object.getOwnPropertySymbols(t);
          (e &&
            (r = r.filter(function (e) {
              return Object.getOwnPropertyDescriptor(t, e).enumerable;
            })),
            n.push.apply(n, r));
        }
        return n;
      }
      function G(t) {
        for (var e = 1; e < arguments.length; e++) {
          var n = null != arguments[e] ? arguments[e] : {};
          e % 2
            ? M(Object(n), !0).forEach(function (e) {
                z(t, e, n[e]);
              })
            : Object.getOwnPropertyDescriptors
              ? Object.defineProperties(t, Object.getOwnPropertyDescriptors(n))
              : M(Object(n)).forEach(function (e) {
                  Object.defineProperty(
                    t,
                    e,
                    Object.getOwnPropertyDescriptor(n, e),
                  );
                });
        }
        return t;
      }
      function z(t, e, n) {
        return (
          (e = (function (t) {
            var e = (function (t, e) {
              if ("object" != H(t) || !t) return t;
              var n = t[Symbol.toPrimitive];
              if (void 0 !== n) {
                var r = n.call(t, e || "default");
                if ("object" != H(r)) return r;
                throw new TypeError(
                  "@@toPrimitive must return a primitive value.",
                );
              }
              return ("string" === e ? String : Number)(t);
            })(t, "string");
            return "symbol" == H(e) ? e : e + "";
          })(e)) in t
            ? Object.defineProperty(t, e, {
                value: n,
                enumerable: !0,
                configurable: !0,
                writable: !0,
              })
            : (t[e] = n),
          t
        );
      }
      function W(t, e, n, r, o, i, a) {
        try {
          var c = t[i](a),
            s = c.value;
        } catch (t) {
          return void n(t);
        }
        c.done ? e(s) : Promise.resolve(s).then(r, o);
      }
      function B(t) {
        return function () {
          var e = this,
            n = arguments;
          return new Promise(function (r, o) {
            var i = t.apply(e, n);
            function a(t) {
              W(i, r, o, a, c, "next", t);
            }
            function c(t) {
              W(i, r, o, a, c, "throw", t);
            }
            a(void 0);
          });
        };
      }
      function $(t, e, n, r) {
        return U.apply(this, arguments);
      }
      function U() {
        return (
          (U = B(
            R().mark(function t(e, n, r, o) {
              return R().wrap(function (t) {
                for (;;)
                  switch ((t.prev = t.next)) {
                    case 0:
                      return (
                        (t.next = 2),
                        Promise.all(
                          e.map(
                            (function () {
                              var t = B(
                                R().mark(function t(e) {
                                  return R().wrap(function (t) {
                                    for (;;)
                                      switch ((t.prev = t.next)) {
                                        case 0:
                                          return ((t.next = 2), o.acquire());
                                        case 2:
                                          if (!o.terminated) {
                                            t.next = 4;
                                            break;
                                          }
                                          return t.abrupt("return");
                                        case 4:
                                          return (
                                            (t.next = 6),
                                            n
                                              .apply(void 0, [e].concat(I(r)))
                                              .finally(o.release.bind(o))
                                          );
                                        case 6:
                                        case "end":
                                          return t.stop();
                                      }
                                  }, t);
                                }),
                              );
                              return function (e) {
                                return t.apply(this, arguments);
                              };
                            })(),
                          ),
                        )
                      );
                    case 2:
                    case "end":
                      return t.stop();
                  }
              }, t);
            }),
          )),
          U.apply(this, arguments)
        );
      }
      function X(t, e, n) {
        var r = new AbortController(),
          o = r.signal,
          i = fetch(t, G(G({}, e), {}, { signal: o })).catch(function () {}),
          a = new Promise(function (t, e) {
            setTimeout(function () {
              (r.abort(), e(new Error("request timeout...")));
            }, n);
          });
        return Promise.race([i, a]);
      }
      var Y = n(692);
      function V(t) {
        return (
          (V =
            "function" == typeof Symbol && "symbol" == typeof Symbol.iterator
              ? function (t) {
                  return typeof t;
                }
              : function (t) {
                  return t &&
                    "function" == typeof Symbol &&
                    t.constructor === Symbol &&
                    t !== Symbol.prototype
                    ? "symbol"
                    : typeof t;
                }),
          V(t)
        );
      }
      function J() {
        J = function () {
          return e;
        };
        var t,
          e = {},
          n = Object.prototype,
          r = n.hasOwnProperty,
          o =
            Object.defineProperty ||
            function (t, e, n) {
              t[e] = n.value;
            },
          i = "function" == typeof Symbol ? Symbol : {},
          a = i.iterator || "@@iterator",
          c = i.asyncIterator || "@@asyncIterator",
          s = i.toStringTag || "@@toStringTag";
        function u(t, e, n) {
          return (
            Object.defineProperty(t, e, {
              value: n,
              enumerable: !0,
              configurable: !0,
              writable: !0,
            }),
            t[e]
          );
        }
        try {
          u({}, "");
        } catch (t) {
          u = function (t, e, n) {
            return (t[e] = n);
          };
        }
        function l(t, e, n, r) {
          var i = e && e.prototype instanceof g ? e : g,
            a = Object.create(i.prototype),
            c = new C(r || []);
          return (o(a, "_invoke", { value: L(t, n, c) }), a);
        }
        function f(t, e, n) {
          try {
            return { type: "normal", arg: t.call(e, n) };
          } catch (t) {
            return { type: "throw", arg: t };
          }
        }
        e.wrap = l;
        var p = "suspendedStart",
          h = "suspendedYield",
          d = "executing",
          v = "completed",
          y = {};
        function g() {}
        function m() {}
        function b() {}
        var x = {};
        u(x, a, function () {
          return this;
        });
        var w = Object.getPrototypeOf,
          k = w && w(w(_([])));
        k && k !== n && r.call(k, a) && (x = k);
        var E = (b.prototype = g.prototype = Object.create(x));
        function j(t) {
          ["next", "throw", "return"].forEach(function (e) {
            u(t, e, function (t) {
              return this._invoke(e, t);
            });
          });
        }
        function T(t, e) {
          function n(o, i, a, c) {
            var s = f(t[o], t, i);
            if ("throw" !== s.type) {
              var u = s.arg,
                l = u.value;
              return l && "object" == V(l) && r.call(l, "__await")
                ? e.resolve(l.__await).then(
                    function (t) {
                      n("next", t, a, c);
                    },
                    function (t) {
                      n("throw", t, a, c);
                    },
                  )
                : e.resolve(l).then(
                    function (t) {
                      ((u.value = t), a(u));
                    },
                    function (t) {
                      return n("throw", t, a, c);
                    },
                  );
            }
            c(s.arg);
          }
          var i;
          o(this, "_invoke", {
            value: function (t, r) {
              function o() {
                return new e(function (e, o) {
                  n(t, r, e, o);
                });
              }
              return (i = i ? i.then(o, o) : o());
            },
          });
        }
        function L(e, n, r) {
          var o = p;
          return function (i, a) {
            if (o === d) throw Error("Generator is already running");
            if (o === v) {
              if ("throw" === i) throw a;
              return { value: t, done: !0 };
            }
            for (r.method = i, r.arg = a; ; ) {
              var c = r.delegate;
              if (c) {
                var s = S(c, r);
                if (s) {
                  if (s === y) continue;
                  return s;
                }
              }
              if ("next" === r.method) r.sent = r._sent = r.arg;
              else if ("throw" === r.method) {
                if (o === p) throw ((o = v), r.arg);
                r.dispatchException(r.arg);
              } else "return" === r.method && r.abrupt("return", r.arg);
              o = d;
              var u = f(e, n, r);
              if ("normal" === u.type) {
                if (((o = r.done ? v : h), u.arg === y)) continue;
                return { value: u.arg, done: r.done };
              }
              "throw" === u.type &&
                ((o = v), (r.method = "throw"), (r.arg = u.arg));
            }
          };
        }
        function S(e, n) {
          var r = n.method,
            o = e.iterator[r];
          if (o === t)
            return (
              (n.delegate = null),
              ("throw" === r &&
                e.iterator.return &&
                ((n.method = "return"),
                (n.arg = t),
                S(e, n),
                "throw" === n.method)) ||
                ("return" !== r &&
                  ((n.method = "throw"),
                  (n.arg = new TypeError(
                    "The iterator does not provide a '" + r + "' method",
                  )))),
              y
            );
          var i = f(o, e.iterator, n.arg);
          if ("throw" === i.type)
            return (
              (n.method = "throw"),
              (n.arg = i.arg),
              (n.delegate = null),
              y
            );
          var a = i.arg;
          return a
            ? a.done
              ? ((n[e.resultName] = a.value),
                (n.next = e.nextLoc),
                "return" !== n.method && ((n.method = "next"), (n.arg = t)),
                (n.delegate = null),
                y)
              : a
            : ((n.method = "throw"),
              (n.arg = new TypeError("iterator result is not an object")),
              (n.delegate = null),
              y);
        }
        function A(t) {
          var e = { tryLoc: t[0] };
          (1 in t && (e.catchLoc = t[1]),
            2 in t && ((e.finallyLoc = t[2]), (e.afterLoc = t[3])),
            this.tryEntries.push(e));
        }
        function O(t) {
          var e = t.completion || {};
          ((e.type = "normal"), delete e.arg, (t.completion = e));
        }
        function C(t) {
          ((this.tryEntries = [{ tryLoc: "root" }]),
            t.forEach(A, this),
            this.reset(!0));
        }
        function _(e) {
          if (e || "" === e) {
            var n = e[a];
            if (n) return n.call(e);
            if ("function" == typeof e.next) return e;
            if (!isNaN(e.length)) {
              var o = -1,
                i = function n() {
                  for (; ++o < e.length; )
                    if (r.call(e, o))
                      return ((n.value = e[o]), (n.done = !1), n);
                  return ((n.value = t), (n.done = !0), n);
                };
              return (i.next = i);
            }
          }
          throw new TypeError(V(e) + " is not iterable");
        }
        return (
          (m.prototype = b),
          o(E, "constructor", { value: b, configurable: !0 }),
          o(b, "constructor", { value: m, configurable: !0 }),
          (m.displayName = u(b, s, "GeneratorFunction")),
          (e.isGeneratorFunction = function (t) {
            var e = "function" == typeof t && t.constructor;
            return (
              !!e &&
              (e === m || "GeneratorFunction" === (e.displayName || e.name))
            );
          }),
          (e.mark = function (t) {
            return (
              Object.setPrototypeOf
                ? Object.setPrototypeOf(t, b)
                : ((t.__proto__ = b), u(t, s, "GeneratorFunction")),
              (t.prototype = Object.create(E)),
              t
            );
          }),
          (e.awrap = function (t) {
            return { __await: t };
          }),
          j(T.prototype),
          u(T.prototype, c, function () {
            return this;
          }),
          (e.AsyncIterator = T),
          (e.async = function (t, n, r, o, i) {
            void 0 === i && (i = Promise);
            var a = new T(l(t, n, r, o), i);
            return e.isGeneratorFunction(n)
              ? a
              : a.next().then(function (t) {
                  return t.done ? t.value : a.next();
                });
          }),
          j(E),
          u(E, s, "Generator"),
          u(E, a, function () {
            return this;
          }),
          u(E, "toString", function () {
            return "[object Generator]";
          }),
          (e.keys = function (t) {
            var e = Object(t),
              n = [];
            for (var r in e) n.push(r);
            return (
              n.reverse(),
              function t() {
                for (; n.length; ) {
                  var r = n.pop();
                  if (r in e) return ((t.value = r), (t.done = !1), t);
                }
                return ((t.done = !0), t);
              }
            );
          }),
          (e.values = _),
          (C.prototype = {
            constructor: C,
            reset: function (e) {
              if (
                ((this.prev = 0),
                (this.next = 0),
                (this.sent = this._sent = t),
                (this.done = !1),
                (this.delegate = null),
                (this.method = "next"),
                (this.arg = t),
                this.tryEntries.forEach(O),
                !e)
              )
                for (var n in this)
                  "t" === n.charAt(0) &&
                    r.call(this, n) &&
                    !isNaN(+n.slice(1)) &&
                    (this[n] = t);
            },
            stop: function () {
              this.done = !0;
              var t = this.tryEntries[0].completion;
              if ("throw" === t.type) throw t.arg;
              return this.rval;
            },
            dispatchException: function (e) {
              if (this.done) throw e;
              var n = this;
              function o(r, o) {
                return (
                  (c.type = "throw"),
                  (c.arg = e),
                  (n.next = r),
                  o && ((n.method = "next"), (n.arg = t)),
                  !!o
                );
              }
              for (var i = this.tryEntries.length - 1; i >= 0; --i) {
                var a = this.tryEntries[i],
                  c = a.completion;
                if ("root" === a.tryLoc) return o("end");
                if (a.tryLoc <= this.prev) {
                  var s = r.call(a, "catchLoc"),
                    u = r.call(a, "finallyLoc");
                  if (s && u) {
                    if (this.prev < a.catchLoc) return o(a.catchLoc, !0);
                    if (this.prev < a.finallyLoc) return o(a.finallyLoc);
                  } else if (s) {
                    if (this.prev < a.catchLoc) return o(a.catchLoc, !0);
                  } else {
                    if (!u)
                      throw Error("try statement without catch or finally");
                    if (this.prev < a.finallyLoc) return o(a.finallyLoc);
                  }
                }
              }
            },
            abrupt: function (t, e) {
              for (var n = this.tryEntries.length - 1; n >= 0; --n) {
                var o = this.tryEntries[n];
                if (
                  o.tryLoc <= this.prev &&
                  r.call(o, "finallyLoc") &&
                  this.prev < o.finallyLoc
                ) {
                  var i = o;
                  break;
                }
              }
              i &&
                ("break" === t || "continue" === t) &&
                i.tryLoc <= e &&
                e <= i.finallyLoc &&
                (i = null);
              var a = i ? i.completion : {};
              return (
                (a.type = t),
                (a.arg = e),
                i
                  ? ((this.method = "next"), (this.next = i.finallyLoc), y)
                  : this.complete(a)
              );
            },
            complete: function (t, e) {
              if ("throw" === t.type) throw t.arg;
              return (
                "break" === t.type || "continue" === t.type
                  ? (this.next = t.arg)
                  : "return" === t.type
                    ? ((this.rval = this.arg = t.arg),
                      (this.method = "return"),
                      (this.next = "end"))
                    : "normal" === t.type && e && (this.next = e),
                y
              );
            },
            finish: function (t) {
              for (var e = this.tryEntries.length - 1; e >= 0; --e) {
                var n = this.tryEntries[e];
                if (n.finallyLoc === t)
                  return (this.complete(n.completion, n.afterLoc), O(n), y);
              }
            },
            catch: function (t) {
              for (var e = this.tryEntries.length - 1; e >= 0; --e) {
                var n = this.tryEntries[e];
                if (n.tryLoc === t) {
                  var r = n.completion;
                  if ("throw" === r.type) {
                    var o = r.arg;
                    O(n);
                  }
                  return o;
                }
              }
              throw Error("illegal catch attempt");
            },
            delegateYield: function (e, n, r) {
              return (
                (this.delegate = { iterator: _(e), resultName: n, nextLoc: r }),
                "next" === this.method && (this.arg = t),
                y
              );
            },
          }),
          e
        );
      }
      function Q(t, e, n, r, o, i, a) {
        try {
          var c = t[i](a),
            s = c.value;
        } catch (t) {
          return void n(t);
        }
        c.done ? e(s) : Promise.resolve(s).then(r, o);
      }
      function K(t) {
        return function () {
          var e = this,
            n = arguments;
          return new Promise(function (r, o) {
            var i = t.apply(e, n);
            function a(t) {
              Q(i, r, o, a, c, "next", t);
            }
            function c(t) {
              Q(i, r, o, a, c, "throw", t);
            }
            a(void 0);
          });
        };
      }
      function Z(t, e, n, r, o, i) {
        return tt.apply(this, arguments);
      }
      function tt() {
        return (
          (tt = K(
            J().mark(function t(e, n, r, o, i, a) {
              var c, s, u, l, f, p, h, d, v, y, g;
              return J().wrap(function (t) {
                for (;;)
                  switch ((t.prev = t.next)) {
                    case 0:
                      if (
                        ((g = function () {
                          return (
                            (g = K(
                              J().mark(function t() {
                                var e,
                                  n = arguments;
                                return J().wrap(function (t) {
                                  for (;;)
                                    switch ((t.prev = t.next)) {
                                      case 0:
                                        return (
                                          (e =
                                            n.length > 0 && void 0 !== n[0]
                                              ? n[0]
                                              : 0),
                                          (t.next = 3),
                                          new Promise(
                                            (function () {
                                              var t = K(
                                                J().mark(function t(e, n) {
                                                  return J().wrap(function (t) {
                                                    for (;;)
                                                      switch (
                                                        (t.prev = t.next)
                                                      ) {
                                                        case 0:
                                                          GM_xmlhttpRequest({
                                                            method: "GET",
                                                            url: s,
                                                            responseType:
                                                              "arraybuffer",
                                                            timeout: l,
                                                            onload: function (
                                                              t,
                                                            ) {
                                                              t.response
                                                                .byteLength > 10
                                                                ? (r.file(
                                                                    u,
                                                                    t.response,
                                                                    {
                                                                      binary:
                                                                        !0,
                                                                    },
                                                                  ),
                                                                  o.sc++,
                                                                  a.page
                                                                    .success++,
                                                                  e())
                                                                : n();
                                                            },
                                                            onerror: n,
                                                            ontimeout: n,
                                                          });
                                                        case 1:
                                                        case "end":
                                                          return t.stop();
                                                      }
                                                  }, t);
                                                }),
                                              );
                                              return function (e, n) {
                                                return t.apply(this, arguments);
                                              };
                                            })(),
                                          ).catch(
                                            K(
                                              J().mark(function t() {
                                                return J().wrap(function (t) {
                                                  for (;;)
                                                    switch ((t.prev = t.next)) {
                                                      case 0:
                                                        if (!(e < p)) {
                                                          t.next = 7;
                                                          break;
                                                        }
                                                        return (
                                                          (t.next = 3),
                                                          new Promise(function (
                                                            t,
                                                          ) {
                                                            setTimeout(t, f);
                                                          })
                                                        );
                                                      case 3:
                                                        return (
                                                          (t.next = 5),
                                                          y(++e)
                                                        );
                                                      case 5:
                                                        t.next = 10;
                                                        break;
                                                      case 7:
                                                        (o.fc++,
                                                          a.page.failed++,
                                                          i(u));
                                                      case 10:
                                                      case "end":
                                                        return t.stop();
                                                    }
                                                }, t);
                                              }),
                                            ),
                                          )
                                        );
                                      case 3:
                                      case "end":
                                        return t.stop();
                                    }
                                }, t);
                              }),
                            )),
                            g.apply(this, arguments)
                          );
                        }),
                        (y = function () {
                          return g.apply(this, arguments);
                        }),
                        (v = function () {
                          return (
                            (v = K(
                              J().mark(function t() {
                                var e,
                                  c = arguments;
                                return J().wrap(function (t) {
                                  for (;;)
                                    switch ((t.prev = t.next)) {
                                      case 0:
                                        return (
                                          (e =
                                            c.length > 0 && void 0 !== c[0]
                                              ? c[0]
                                              : 0),
                                          (t.next = 3),
                                          X(s, { method: "GET" }, l)
                                            .then(function (t) {
                                              if (t.ok) return t.arrayBuffer();
                                              throw new Error();
                                            })
                                            .then(function (t) {
                                              if (!(t.byteLength > 10))
                                                throw new Error();
                                              (r.file(u, t, { binary: !0 }),
                                                o.sc++,
                                                a.page.success++);
                                            })
                                            .catch(
                                              K(
                                                J().mark(function t() {
                                                  return J().wrap(function (t) {
                                                    for (;;)
                                                      switch (
                                                        (t.prev = t.next)
                                                      ) {
                                                        case 0:
                                                          if (!(e < p)) {
                                                            t.next = 7;
                                                            break;
                                                          }
                                                          return (
                                                            (t.next = 3),
                                                            new Promise(
                                                              function (t) {
                                                                (setTimeout(
                                                                  t,
                                                                  f,
                                                                ),
                                                                  h &&
                                                                    console.log(
                                                                      ""
                                                                        .concat(
                                                                          n,
                                                                          "的",
                                                                        )
                                                                        .concat(
                                                                          u,
                                                                          "重試次數: ",
                                                                        )
                                                                        .concat(
                                                                          e + 1,
                                                                          "/",
                                                                        )
                                                                        .concat(
                                                                          p,
                                                                          "次",
                                                                        ),
                                                                    ));
                                                              },
                                                            )
                                                          );
                                                        case 3:
                                                          return (
                                                            (t.next = 5),
                                                            d(++e)
                                                          );
                                                        case 5:
                                                          t.next = 11;
                                                          break;
                                                        case 7:
                                                          (console.log(
                                                            ""
                                                              .concat(n, "的")
                                                              .concat(
                                                                u,
                                                                ": Failed to download...",
                                                              ),
                                                          ),
                                                            o.fc++,
                                                            a.page.failed++,
                                                            i(u));
                                                        case 11:
                                                        case "end":
                                                          return t.stop();
                                                      }
                                                  }, t);
                                                }),
                                              ),
                                            )
                                        );
                                      case 3:
                                      case "end":
                                        return t.stop();
                                    }
                                }, t);
                              }),
                            )),
                            v.apply(this, arguments)
                          );
                        }),
                        (d = function () {
                          return v.apply(this, arguments);
                        }),
                        (c = location.hostname.includes("ant")
                          ? "data-src"
                          : "src"),
                        (s = Y(e).attr(c)),
                        (u = s.split("/").reverse()[0]),
                        (l = 6e4),
                        (f = 5e3),
                        (p = A.retry),
                        (h = !0),
                        !location.href.includes("ant"))
                      ) {
                        t.next = 16;
                        break;
                      }
                      return ((t.next = 14), d());
                    case 14:
                      t.next = 18;
                      break;
                    case 16:
                      return ((t.next = 18), y());
                    case 18:
                    case "end":
                      return t.stop();
                  }
              }, t);
            }),
          )),
          tt.apply(this, arguments)
        );
      }
      function et(t) {
        return (
          (function (t) {
            if (Array.isArray(t)) return nt(t);
          })(t) ||
          (function (t) {
            if (
              ("undefined" != typeof Symbol && null != t[Symbol.iterator]) ||
              null != t["@@iterator"]
            )
              return Array.from(t);
          })(t) ||
          (function (t, e) {
            if (t) {
              if ("string" == typeof t) return nt(t, e);
              var n = {}.toString.call(t).slice(8, -1);
              return (
                "Object" === n && t.constructor && (n = t.constructor.name),
                "Map" === n || "Set" === n
                  ? Array.from(t)
                  : "Arguments" === n ||
                      /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)
                    ? nt(t, e)
                    : void 0
              );
            }
          })(t) ||
          (function () {
            throw new TypeError(
              "Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.",
            );
          })()
        );
      }
      function nt(t, e) {
        (null == e || e > t.length) && (e = t.length);
        for (var n = 0, r = Array(e); n < e; n++) r[n] = t[n];
        return r;
      }
      function rt() {
        var t = 0;
        return function (e) {
          return (!e && ++t, t);
        };
      }
      function ot() {
        var t = "";
        return function (e) {
          return (t = [t, e].join("\n")).trim();
        };
      }
      function it(t) {
        var e = t.trim().split("\n"),
          n = e.slice(0, 1),
          r = e
            .slice(1)
            .sort()
            .reduce(function (t, e, n) {
              return (
                !(n % 5) && t.push([]),
                t[t.length - 1].push(e.padStart(15, " ")),
                t
              );
            }, [])
            .map(function (t) {
              return t.join("");
            });
        return [].concat(et(n), et(r)).join("\n");
      }
      var at = n(692);
      function ct(t) {
        return (
          (ct =
            "function" == typeof Symbol && "symbol" == typeof Symbol.iterator
              ? function (t) {
                  return typeof t;
                }
              : function (t) {
                  return t &&
                    "function" == typeof Symbol &&
                    t.constructor === Symbol &&
                    t !== Symbol.prototype
                    ? "symbol"
                    : typeof t;
                }),
          ct(t)
        );
      }
      function st() {
        st = function () {
          return e;
        };
        var t,
          e = {},
          n = Object.prototype,
          r = n.hasOwnProperty,
          o =
            Object.defineProperty ||
            function (t, e, n) {
              t[e] = n.value;
            },
          i = "function" == typeof Symbol ? Symbol : {},
          a = i.iterator || "@@iterator",
          c = i.asyncIterator || "@@asyncIterator",
          s = i.toStringTag || "@@toStringTag";
        function u(t, e, n) {
          return (
            Object.defineProperty(t, e, {
              value: n,
              enumerable: !0,
              configurable: !0,
              writable: !0,
            }),
            t[e]
          );
        }
        try {
          u({}, "");
        } catch (t) {
          u = function (t, e, n) {
            return (t[e] = n);
          };
        }
        function l(t, e, n, r) {
          var i = e && e.prototype instanceof g ? e : g,
            a = Object.create(i.prototype),
            c = new C(r || []);
          return (o(a, "_invoke", { value: L(t, n, c) }), a);
        }
        function f(t, e, n) {
          try {
            return { type: "normal", arg: t.call(e, n) };
          } catch (t) {
            return { type: "throw", arg: t };
          }
        }
        e.wrap = l;
        var p = "suspendedStart",
          h = "suspendedYield",
          d = "executing",
          v = "completed",
          y = {};
        function g() {}
        function m() {}
        function b() {}
        var x = {};
        u(x, a, function () {
          return this;
        });
        var w = Object.getPrototypeOf,
          k = w && w(w(_([])));
        k && k !== n && r.call(k, a) && (x = k);
        var E = (b.prototype = g.prototype = Object.create(x));
        function j(t) {
          ["next", "throw", "return"].forEach(function (e) {
            u(t, e, function (t) {
              return this._invoke(e, t);
            });
          });
        }
        function T(t, e) {
          function n(o, i, a, c) {
            var s = f(t[o], t, i);
            if ("throw" !== s.type) {
              var u = s.arg,
                l = u.value;
              return l && "object" == ct(l) && r.call(l, "__await")
                ? e.resolve(l.__await).then(
                    function (t) {
                      n("next", t, a, c);
                    },
                    function (t) {
                      n("throw", t, a, c);
                    },
                  )
                : e.resolve(l).then(
                    function (t) {
                      ((u.value = t), a(u));
                    },
                    function (t) {
                      return n("throw", t, a, c);
                    },
                  );
            }
            c(s.arg);
          }
          var i;
          o(this, "_invoke", {
            value: function (t, r) {
              function o() {
                return new e(function (e, o) {
                  n(t, r, e, o);
                });
              }
              return (i = i ? i.then(o, o) : o());
            },
          });
        }
        function L(e, n, r) {
          var o = p;
          return function (i, a) {
            if (o === d) throw Error("Generator is already running");
            if (o === v) {
              if ("throw" === i) throw a;
              return { value: t, done: !0 };
            }
            for (r.method = i, r.arg = a; ; ) {
              var c = r.delegate;
              if (c) {
                var s = S(c, r);
                if (s) {
                  if (s === y) continue;
                  return s;
                }
              }
              if ("next" === r.method) r.sent = r._sent = r.arg;
              else if ("throw" === r.method) {
                if (o === p) throw ((o = v), r.arg);
                r.dispatchException(r.arg);
              } else "return" === r.method && r.abrupt("return", r.arg);
              o = d;
              var u = f(e, n, r);
              if ("normal" === u.type) {
                if (((o = r.done ? v : h), u.arg === y)) continue;
                return { value: u.arg, done: r.done };
              }
              "throw" === u.type &&
                ((o = v), (r.method = "throw"), (r.arg = u.arg));
            }
          };
        }
        function S(e, n) {
          var r = n.method,
            o = e.iterator[r];
          if (o === t)
            return (
              (n.delegate = null),
              ("throw" === r &&
                e.iterator.return &&
                ((n.method = "return"),
                (n.arg = t),
                S(e, n),
                "throw" === n.method)) ||
                ("return" !== r &&
                  ((n.method = "throw"),
                  (n.arg = new TypeError(
                    "The iterator does not provide a '" + r + "' method",
                  )))),
              y
            );
          var i = f(o, e.iterator, n.arg);
          if ("throw" === i.type)
            return (
              (n.method = "throw"),
              (n.arg = i.arg),
              (n.delegate = null),
              y
            );
          var a = i.arg;
          return a
            ? a.done
              ? ((n[e.resultName] = a.value),
                (n.next = e.nextLoc),
                "return" !== n.method && ((n.method = "next"), (n.arg = t)),
                (n.delegate = null),
                y)
              : a
            : ((n.method = "throw"),
              (n.arg = new TypeError("iterator result is not an object")),
              (n.delegate = null),
              y);
        }
        function A(t) {
          var e = { tryLoc: t[0] };
          (1 in t && (e.catchLoc = t[1]),
            2 in t && ((e.finallyLoc = t[2]), (e.afterLoc = t[3])),
            this.tryEntries.push(e));
        }
        function O(t) {
          var e = t.completion || {};
          ((e.type = "normal"), delete e.arg, (t.completion = e));
        }
        function C(t) {
          ((this.tryEntries = [{ tryLoc: "root" }]),
            t.forEach(A, this),
            this.reset(!0));
        }
        function _(e) {
          if (e || "" === e) {
            var n = e[a];
            if (n) return n.call(e);
            if ("function" == typeof e.next) return e;
            if (!isNaN(e.length)) {
              var o = -1,
                i = function n() {
                  for (; ++o < e.length; )
                    if (r.call(e, o))
                      return ((n.value = e[o]), (n.done = !1), n);
                  return ((n.value = t), (n.done = !0), n);
                };
              return (i.next = i);
            }
          }
          throw new TypeError(ct(e) + " is not iterable");
        }
        return (
          (m.prototype = b),
          o(E, "constructor", { value: b, configurable: !0 }),
          o(b, "constructor", { value: m, configurable: !0 }),
          (m.displayName = u(b, s, "GeneratorFunction")),
          (e.isGeneratorFunction = function (t) {
            var e = "function" == typeof t && t.constructor;
            return (
              !!e &&
              (e === m || "GeneratorFunction" === (e.displayName || e.name))
            );
          }),
          (e.mark = function (t) {
            return (
              Object.setPrototypeOf
                ? Object.setPrototypeOf(t, b)
                : ((t.__proto__ = b), u(t, s, "GeneratorFunction")),
              (t.prototype = Object.create(E)),
              t
            );
          }),
          (e.awrap = function (t) {
            return { __await: t };
          }),
          j(T.prototype),
          u(T.prototype, c, function () {
            return this;
          }),
          (e.AsyncIterator = T),
          (e.async = function (t, n, r, o, i) {
            void 0 === i && (i = Promise);
            var a = new T(l(t, n, r, o), i);
            return e.isGeneratorFunction(n)
              ? a
              : a.next().then(function (t) {
                  return t.done ? t.value : a.next();
                });
          }),
          j(E),
          u(E, s, "Generator"),
          u(E, a, function () {
            return this;
          }),
          u(E, "toString", function () {
            return "[object Generator]";
          }),
          (e.keys = function (t) {
            var e = Object(t),
              n = [];
            for (var r in e) n.push(r);
            return (
              n.reverse(),
              function t() {
                for (; n.length; ) {
                  var r = n.pop();
                  if (r in e) return ((t.value = r), (t.done = !1), t);
                }
                return ((t.done = !0), t);
              }
            );
          }),
          (e.values = _),
          (C.prototype = {
            constructor: C,
            reset: function (e) {
              if (
                ((this.prev = 0),
                (this.next = 0),
                (this.sent = this._sent = t),
                (this.done = !1),
                (this.delegate = null),
                (this.method = "next"),
                (this.arg = t),
                this.tryEntries.forEach(O),
                !e)
              )
                for (var n in this)
                  "t" === n.charAt(0) &&
                    r.call(this, n) &&
                    !isNaN(+n.slice(1)) &&
                    (this[n] = t);
            },
            stop: function () {
              this.done = !0;
              var t = this.tryEntries[0].completion;
              if ("throw" === t.type) throw t.arg;
              return this.rval;
            },
            dispatchException: function (e) {
              if (this.done) throw e;
              var n = this;
              function o(r, o) {
                return (
                  (c.type = "throw"),
                  (c.arg = e),
                  (n.next = r),
                  o && ((n.method = "next"), (n.arg = t)),
                  !!o
                );
              }
              for (var i = this.tryEntries.length - 1; i >= 0; --i) {
                var a = this.tryEntries[i],
                  c = a.completion;
                if ("root" === a.tryLoc) return o("end");
                if (a.tryLoc <= this.prev) {
                  var s = r.call(a, "catchLoc"),
                    u = r.call(a, "finallyLoc");
                  if (s && u) {
                    if (this.prev < a.catchLoc) return o(a.catchLoc, !0);
                    if (this.prev < a.finallyLoc) return o(a.finallyLoc);
                  } else if (s) {
                    if (this.prev < a.catchLoc) return o(a.catchLoc, !0);
                  } else {
                    if (!u)
                      throw Error("try statement without catch or finally");
                    if (this.prev < a.finallyLoc) return o(a.finallyLoc);
                  }
                }
              }
            },
            abrupt: function (t, e) {
              for (var n = this.tryEntries.length - 1; n >= 0; --n) {
                var o = this.tryEntries[n];
                if (
                  o.tryLoc <= this.prev &&
                  r.call(o, "finallyLoc") &&
                  this.prev < o.finallyLoc
                ) {
                  var i = o;
                  break;
                }
              }
              i &&
                ("break" === t || "continue" === t) &&
                i.tryLoc <= e &&
                e <= i.finallyLoc &&
                (i = null);
              var a = i ? i.completion : {};
              return (
                (a.type = t),
                (a.arg = e),
                i
                  ? ((this.method = "next"), (this.next = i.finallyLoc), y)
                  : this.complete(a)
              );
            },
            complete: function (t, e) {
              if ("throw" === t.type) throw t.arg;
              return (
                "break" === t.type || "continue" === t.type
                  ? (this.next = t.arg)
                  : "return" === t.type
                    ? ((this.rval = this.arg = t.arg),
                      (this.method = "return"),
                      (this.next = "end"))
                    : "normal" === t.type && e && (this.next = e),
                y
              );
            },
            finish: function (t) {
              for (var e = this.tryEntries.length - 1; e >= 0; --e) {
                var n = this.tryEntries[e];
                if (n.finallyLoc === t)
                  return (this.complete(n.completion, n.afterLoc), O(n), y);
              }
            },
            catch: function (t) {
              for (var e = this.tryEntries.length - 1; e >= 0; --e) {
                var n = this.tryEntries[e];
                if (n.tryLoc === t) {
                  var r = n.completion;
                  if ("throw" === r.type) {
                    var o = r.arg;
                    O(n);
                  }
                  return o;
                }
              }
              throw Error("illegal catch attempt");
            },
            delegateYield: function (e, n, r) {
              return (
                (this.delegate = { iterator: _(e), resultName: n, nextLoc: r }),
                "next" === this.method && (this.arg = t),
                y
              );
            },
          }),
          e
        );
      }
      function ut(t, e, n, r, o, i, a) {
        try {
          var c = t[i](a),
            s = c.value;
        } catch (t) {
          return void n(t);
        }
        c.done ? e(s) : Promise.resolve(s).then(r, o);
      }
      function lt(t) {
        return function () {
          var e = this,
            n = arguments;
          return new Promise(function (r, o) {
            var i = t.apply(e, n);
            function a(t) {
              ut(i, r, o, a, c, "next", t);
            }
            function c(t) {
              ut(i, r, o, a, c, "throw", t);
            }
            a(void 0);
          });
        };
      }
      function ft(t, e, n, r, o, i) {
        return pt.apply(this, arguments);
      }
      function pt() {
        return (
          (pt = lt(
            st().mark(function t(e, n, r, o, i, a) {
              var c, s, u, l, f, p, h, d;
              return st().wrap(function (t) {
                for (;;)
                  switch ((t.prev = t.next)) {
                    case 0:
                      return (
                        (d = function (t) {
                          c.file("".concat(s, "/").concat(t))
                            .async("string")
                            .then(function (t) {
                              return console.error(t);
                            });
                        }),
                        (h = function () {
                          return (h = lt(
                            st().mark(function t() {
                              var e;
                              return st().wrap(function (t) {
                                for (;;)
                                  switch ((t.prev = t.next)) {
                                    case 0:
                                      return ((t.next = 2), A.updating.lock());
                                    case 2:
                                      (A.net_chap--,
                                        (e = Number(
                                          at("#dl-percentage")
                                            .text()
                                            .split("/")[0],
                                        )),
                                        at("#dl-percentage").text(
                                          "".concat(e, "/").concat(A.net_chap),
                                        ),
                                        A.updating.unlock());
                                    case 6:
                                    case "end":
                                      return t.stop();
                                  }
                              }, t);
                            }),
                          )).apply(this, arguments);
                        }),
                        (p = function () {
                          return h.apply(this, arguments);
                        }),
                        (f = function () {
                          return (f = lt(
                            st().mark(function t() {
                              var e, n, r, o, i;
                              return st().wrap(function (t) {
                                for (;;)
                                  switch ((t.prev = t.next)) {
                                    case 0:
                                      return (
                                        (t.next = 2),
                                        c.generateAsync({
                                          type: "blob",
                                          compression: "DEFLATE",
                                          compressionOptions: { level: 6 },
                                        })
                                      );
                                    case 2:
                                      return (
                                        (e = t.sent),
                                        (n = {}),
                                        (r = 512 * Math.pow(1024, 2)),
                                        (o = function () {
                                          var t = new JSZip();
                                          return (A.zip.push(t), t);
                                        }),
                                        (t.next = 8),
                                        A.storing.lock()
                                      );
                                    case 8:
                                      if (!A.zip.length) {
                                        t.next = 15;
                                        break;
                                      }
                                      return (
                                        (t.next = 11),
                                        A.zip[A.zip.length - 1].generateAsync({
                                          type: "uint8array",
                                          compression: "STORE",
                                        })
                                      );
                                    case 11:
                                      ((i = t.sent.length),
                                        (n =
                                          i > r
                                            ? o()
                                            : A.zip[A.zip.length - 1]),
                                        (t.next = 16));
                                      break;
                                    case 15:
                                      n = o();
                                    case 16:
                                      (A.storing.unlock(),
                                        n.file("".concat(s, ".zip"), e, {
                                          binary: !0,
                                        }));
                                    case 18:
                                    case "end":
                                      return t.stop();
                                  }
                              }, t);
                            }),
                          )).apply(this, arguments);
                        }),
                        (l = function () {
                          return f.apply(this, arguments);
                        }),
                        (c = new JSZip()),
                        (s = e.number),
                        (u = c.folder(s)),
                        (t.next = 10),
                        X(e.url, { method: "GET" }, 3e4)
                          .then(function (t) {
                            if (!t.ok)
                              throw new Error(
                                "".concat(s, ": chapter request failed..."),
                              );
                            return (
                              console.log(
                                "".concat(s, ": chapter request successful..."),
                              ),
                              t.text()
                            );
                          })
                          .then(
                            (function () {
                              var t = lt(
                                st().mark(function t(c) {
                                  var f, h, v, y, g, m, b;
                                  return st().wrap(
                                    function (t) {
                                      for (;;)
                                        switch ((t.prev = t.next)) {
                                          case 0:
                                            if (
                                              (f = at(
                                                new DOMParser().parseFromString(
                                                  c,
                                                  "text/html",
                                                ).body,
                                              )).find(".wp").length
                                            ) {
                                              t.next = 6;
                                              break;
                                            }
                                            (console.error(
                                              "failed to load chapter...",
                                            ),
                                              setTimeout(function () {
                                                getImgList(e);
                                              }),
                                              (t.next = 55));
                                            break;
                                          case 6:
                                            if (
                                              f.find(".jameson_manhua").length
                                            ) {
                                              t.next = 16;
                                              break;
                                            }
                                            return (
                                              (h = "權限不足.txt"),
                                              u.file(
                                                h,
                                                "權限不足，請登錄賬戶或使用VIP帳戶！\n",
                                              ),
                                              i.page.failed++,
                                              d(h),
                                              p(),
                                              (t.next = 14),
                                              l()
                                            );
                                          case 14:
                                            t.next = 55;
                                            break;
                                          case 16:
                                            if (
                                              f.find(".uk-zjimg img").length
                                            ) {
                                              t.next = 26;
                                              break;
                                            }
                                            return (
                                              (v = "VIP專屬.txt"),
                                              u.file(
                                                v,
                                                "請使用VIP帳戶下載！\n",
                                              ),
                                              i.page.failed++,
                                              d(v),
                                              p(),
                                              (t.next = 24),
                                              l()
                                            );
                                          case 24:
                                            t.next = 55;
                                            break;
                                          case 26:
                                            return (
                                              (y = f
                                                .find(".uk-zjimg img")
                                                .toArray()),
                                              (g = y.length),
                                              (i.page.net += g),
                                              (m = ot()),
                                              (b = new Proxy(
                                                { sc: 0, fc: 0 },
                                                {
                                                  get: function (t, e) {
                                                    return Reflect.get.apply(
                                                      Reflect,
                                                      arguments,
                                                    );
                                                  },
                                                  set: function (t, e, n) {
                                                    return Reflect.set.apply(
                                                      Reflect,
                                                      arguments,
                                                    );
                                                  },
                                                },
                                              )),
                                              (t.next = 33),
                                              $(y, Z, [s, u, b, m, i], a)
                                            );
                                          case 33:
                                            if (
                                              ((t.prev = 33),
                                              b.fc || b.sc !== y.length)
                                            ) {
                                              t.next = 40;
                                              break;
                                            }
                                            (i.chap.success++,
                                              n(),
                                              console.log(
                                                "".concat(s, ": all clear!"),
                                              ),
                                              (t.next = 41));
                                            break;
                                          case 40:
                                            throw new Error(
                                              ""
                                                .concat(s, "缺失頁：")
                                                .concat(
                                                  b.fc || y.length - b.sc,
                                                  "/",
                                                )
                                                .concat(g),
                                            );
                                          case 41:
                                            t.next = 52;
                                            break;
                                          case 43:
                                            ((t.prev = 43),
                                              (t.t0 = t.catch(33)),
                                              console.error(t.t0.message),
                                              u.file(
                                                "不完整下載.txt",
                                                it(
                                                  ""
                                                    .concat(t.t0.message, "\n")
                                                    .concat(m()),
                                                ),
                                              ),
                                              i.chap.failed++,
                                              n(),
                                              r(),
                                              o(s));
                                          case 52:
                                            return ((t.next = 54), l());
                                          case 54:
                                            return t.abrupt("return");
                                          case 55:
                                          case "end":
                                            return t.stop();
                                        }
                                    },
                                    t,
                                    null,
                                    [[33, 43]],
                                  );
                                }),
                              );
                              return function (e) {
                                return t.apply(this, arguments);
                              };
                            })(),
                          )
                          .catch(function (t) {
                            console.error(t.message);
                          })
                      );
                    case 10:
                    case "end":
                      return t.stop();
                  }
              }, t);
            }),
          )),
          pt.apply(this, arguments)
        );
      }
      var ht = n(213),
        dt = n(692);
      function vt() {
        vt = function () {
          return e;
        };
        var t,
          e = {},
          n = Object.prototype,
          r = n.hasOwnProperty,
          o =
            Object.defineProperty ||
            function (t, e, n) {
              t[e] = n.value;
            },
          i = "function" == typeof Symbol ? Symbol : {},
          a = i.iterator || "@@iterator",
          c = i.asyncIterator || "@@asyncIterator",
          s = i.toStringTag || "@@toStringTag";
        function u(t, e, n) {
          return (
            Object.defineProperty(t, e, {
              value: n,
              enumerable: !0,
              configurable: !0,
              writable: !0,
            }),
            t[e]
          );
        }
        try {
          u({}, "");
        } catch (t) {
          u = function (t, e, n) {
            return (t[e] = n);
          };
        }
        function l(t, e, n, r) {
          var i = e && e.prototype instanceof g ? e : g,
            a = Object.create(i.prototype),
            c = new C(r || []);
          return (o(a, "_invoke", { value: L(t, n, c) }), a);
        }
        function f(t, e, n) {
          try {
            return { type: "normal", arg: t.call(e, n) };
          } catch (t) {
            return { type: "throw", arg: t };
          }
        }
        e.wrap = l;
        var p = "suspendedStart",
          h = "suspendedYield",
          d = "executing",
          v = "completed",
          y = {};
        function g() {}
        function m() {}
        function b() {}
        var x = {};
        u(x, a, function () {
          return this;
        });
        var w = Object.getPrototypeOf,
          k = w && w(w(_([])));
        k && k !== n && r.call(k, a) && (x = k);
        var E = (b.prototype = g.prototype = Object.create(x));
        function j(t) {
          ["next", "throw", "return"].forEach(function (e) {
            u(t, e, function (t) {
              return this._invoke(e, t);
            });
          });
        }
        function T(t, e) {
          function n(o, i, a, c) {
            var s = f(t[o], t, i);
            if ("throw" !== s.type) {
              var u = s.arg,
                l = u.value;
              return l && "object" == yt(l) && r.call(l, "__await")
                ? e.resolve(l.__await).then(
                    function (t) {
                      n("next", t, a, c);
                    },
                    function (t) {
                      n("throw", t, a, c);
                    },
                  )
                : e.resolve(l).then(
                    function (t) {
                      ((u.value = t), a(u));
                    },
                    function (t) {
                      return n("throw", t, a, c);
                    },
                  );
            }
            c(s.arg);
          }
          var i;
          o(this, "_invoke", {
            value: function (t, r) {
              function o() {
                return new e(function (e, o) {
                  n(t, r, e, o);
                });
              }
              return (i = i ? i.then(o, o) : o());
            },
          });
        }
        function L(e, n, r) {
          var o = p;
          return function (i, a) {
            if (o === d) throw Error("Generator is already running");
            if (o === v) {
              if ("throw" === i) throw a;
              return { value: t, done: !0 };
            }
            for (r.method = i, r.arg = a; ; ) {
              var c = r.delegate;
              if (c) {
                var s = S(c, r);
                if (s) {
                  if (s === y) continue;
                  return s;
                }
              }
              if ("next" === r.method) r.sent = r._sent = r.arg;
              else if ("throw" === r.method) {
                if (o === p) throw ((o = v), r.arg);
                r.dispatchException(r.arg);
              } else "return" === r.method && r.abrupt("return", r.arg);
              o = d;
              var u = f(e, n, r);
              if ("normal" === u.type) {
                if (((o = r.done ? v : h), u.arg === y)) continue;
                return { value: u.arg, done: r.done };
              }
              "throw" === u.type &&
                ((o = v), (r.method = "throw"), (r.arg = u.arg));
            }
          };
        }
        function S(e, n) {
          var r = n.method,
            o = e.iterator[r];
          if (o === t)
            return (
              (n.delegate = null),
              ("throw" === r &&
                e.iterator.return &&
                ((n.method = "return"),
                (n.arg = t),
                S(e, n),
                "throw" === n.method)) ||
                ("return" !== r &&
                  ((n.method = "throw"),
                  (n.arg = new TypeError(
                    "The iterator does not provide a '" + r + "' method",
                  )))),
              y
            );
          var i = f(o, e.iterator, n.arg);
          if ("throw" === i.type)
            return (
              (n.method = "throw"),
              (n.arg = i.arg),
              (n.delegate = null),
              y
            );
          var a = i.arg;
          return a
            ? a.done
              ? ((n[e.resultName] = a.value),
                (n.next = e.nextLoc),
                "return" !== n.method && ((n.method = "next"), (n.arg = t)),
                (n.delegate = null),
                y)
              : a
            : ((n.method = "throw"),
              (n.arg = new TypeError("iterator result is not an object")),
              (n.delegate = null),
              y);
        }
        function A(t) {
          var e = { tryLoc: t[0] };
          (1 in t && (e.catchLoc = t[1]),
            2 in t && ((e.finallyLoc = t[2]), (e.afterLoc = t[3])),
            this.tryEntries.push(e));
        }
        function O(t) {
          var e = t.completion || {};
          ((e.type = "normal"), delete e.arg, (t.completion = e));
        }
        function C(t) {
          ((this.tryEntries = [{ tryLoc: "root" }]),
            t.forEach(A, this),
            this.reset(!0));
        }
        function _(e) {
          if (e || "" === e) {
            var n = e[a];
            if (n) return n.call(e);
            if ("function" == typeof e.next) return e;
            if (!isNaN(e.length)) {
              var o = -1,
                i = function n() {
                  for (; ++o < e.length; )
                    if (r.call(e, o))
                      return ((n.value = e[o]), (n.done = !1), n);
                  return ((n.value = t), (n.done = !0), n);
                };
              return (i.next = i);
            }
          }
          throw new TypeError(yt(e) + " is not iterable");
        }
        return (
          (m.prototype = b),
          o(E, "constructor", { value: b, configurable: !0 }),
          o(b, "constructor", { value: m, configurable: !0 }),
          (m.displayName = u(b, s, "GeneratorFunction")),
          (e.isGeneratorFunction = function (t) {
            var e = "function" == typeof t && t.constructor;
            return (
              !!e &&
              (e === m || "GeneratorFunction" === (e.displayName || e.name))
            );
          }),
          (e.mark = function (t) {
            return (
              Object.setPrototypeOf
                ? Object.setPrototypeOf(t, b)
                : ((t.__proto__ = b), u(t, s, "GeneratorFunction")),
              (t.prototype = Object.create(E)),
              t
            );
          }),
          (e.awrap = function (t) {
            return { __await: t };
          }),
          j(T.prototype),
          u(T.prototype, c, function () {
            return this;
          }),
          (e.AsyncIterator = T),
          (e.async = function (t, n, r, o, i) {
            void 0 === i && (i = Promise);
            var a = new T(l(t, n, r, o), i);
            return e.isGeneratorFunction(n)
              ? a
              : a.next().then(function (t) {
                  return t.done ? t.value : a.next();
                });
          }),
          j(E),
          u(E, s, "Generator"),
          u(E, a, function () {
            return this;
          }),
          u(E, "toString", function () {
            return "[object Generator]";
          }),
          (e.keys = function (t) {
            var e = Object(t),
              n = [];
            for (var r in e) n.push(r);
            return (
              n.reverse(),
              function t() {
                for (; n.length; ) {
                  var r = n.pop();
                  if (r in e) return ((t.value = r), (t.done = !1), t);
                }
                return ((t.done = !0), t);
              }
            );
          }),
          (e.values = _),
          (C.prototype = {
            constructor: C,
            reset: function (e) {
              if (
                ((this.prev = 0),
                (this.next = 0),
                (this.sent = this._sent = t),
                (this.done = !1),
                (this.delegate = null),
                (this.method = "next"),
                (this.arg = t),
                this.tryEntries.forEach(O),
                !e)
              )
                for (var n in this)
                  "t" === n.charAt(0) &&
                    r.call(this, n) &&
                    !isNaN(+n.slice(1)) &&
                    (this[n] = t);
            },
            stop: function () {
              this.done = !0;
              var t = this.tryEntries[0].completion;
              if ("throw" === t.type) throw t.arg;
              return this.rval;
            },
            dispatchException: function (e) {
              if (this.done) throw e;
              var n = this;
              function o(r, o) {
                return (
                  (c.type = "throw"),
                  (c.arg = e),
                  (n.next = r),
                  o && ((n.method = "next"), (n.arg = t)),
                  !!o
                );
              }
              for (var i = this.tryEntries.length - 1; i >= 0; --i) {
                var a = this.tryEntries[i],
                  c = a.completion;
                if ("root" === a.tryLoc) return o("end");
                if (a.tryLoc <= this.prev) {
                  var s = r.call(a, "catchLoc"),
                    u = r.call(a, "finallyLoc");
                  if (s && u) {
                    if (this.prev < a.catchLoc) return o(a.catchLoc, !0);
                    if (this.prev < a.finallyLoc) return o(a.finallyLoc);
                  } else if (s) {
                    if (this.prev < a.catchLoc) return o(a.catchLoc, !0);
                  } else {
                    if (!u)
                      throw Error("try statement without catch or finally");
                    if (this.prev < a.finallyLoc) return o(a.finallyLoc);
                  }
                }
              }
            },
            abrupt: function (t, e) {
              for (var n = this.tryEntries.length - 1; n >= 0; --n) {
                var o = this.tryEntries[n];
                if (
                  o.tryLoc <= this.prev &&
                  r.call(o, "finallyLoc") &&
                  this.prev < o.finallyLoc
                ) {
                  var i = o;
                  break;
                }
              }
              i &&
                ("break" === t || "continue" === t) &&
                i.tryLoc <= e &&
                e <= i.finallyLoc &&
                (i = null);
              var a = i ? i.completion : {};
              return (
                (a.type = t),
                (a.arg = e),
                i
                  ? ((this.method = "next"), (this.next = i.finallyLoc), y)
                  : this.complete(a)
              );
            },
            complete: function (t, e) {
              if ("throw" === t.type) throw t.arg;
              return (
                "break" === t.type || "continue" === t.type
                  ? (this.next = t.arg)
                  : "return" === t.type
                    ? ((this.rval = this.arg = t.arg),
                      (this.method = "return"),
                      (this.next = "end"))
                    : "normal" === t.type && e && (this.next = e),
                y
              );
            },
            finish: function (t) {
              for (var e = this.tryEntries.length - 1; e >= 0; --e) {
                var n = this.tryEntries[e];
                if (n.finallyLoc === t)
                  return (this.complete(n.completion, n.afterLoc), O(n), y);
              }
            },
            catch: function (t) {
              for (var e = this.tryEntries.length - 1; e >= 0; --e) {
                var n = this.tryEntries[e];
                if (n.tryLoc === t) {
                  var r = n.completion;
                  if ("throw" === r.type) {
                    var o = r.arg;
                    O(n);
                  }
                  return o;
                }
              }
              throw Error("illegal catch attempt");
            },
            delegateYield: function (e, n, r) {
              return (
                (this.delegate = { iterator: _(e), resultName: n, nextLoc: r }),
                "next" === this.method && (this.arg = t),
                y
              );
            },
          }),
          e
        );
      }
      function yt(t) {
        return (
          (yt =
            "function" == typeof Symbol && "symbol" == typeof Symbol.iterator
              ? function (t) {
                  return typeof t;
                }
              : function (t) {
                  return t &&
                    "function" == typeof Symbol &&
                    t.constructor === Symbol &&
                    t !== Symbol.prototype
                    ? "symbol"
                    : typeof t;
                }),
          yt(t)
        );
      }
      function gt(t, e, n, r, o, i, a) {
        try {
          var c = t[i](a),
            s = c.value;
        } catch (t) {
          return void n(t);
        }
        c.done ? e(s) : Promise.resolve(s).then(r, o);
      }
      function mt(t) {
        return function () {
          var e = this,
            n = arguments;
          return new Promise(function (r, o) {
            var i = t.apply(e, n);
            function a(t) {
              gt(i, r, o, a, c, "next", t);
            }
            function c(t) {
              gt(i, r, o, a, c, "throw", t);
            }
            a(void 0);
          });
        };
      }
      var bt = ht.saveAs;
      function xt() {
        return wt.apply(this, arguments);
      }
      function wt() {
        return (
          (wt = mt(
            vt().mark(function t() {
              var e, n, r, o, i, a, c, s;
              return vt().wrap(function (t) {
                for (;;)
                  switch ((t.prev = t.next)) {
                    case 0:
                      return (
                        (e = new q(A.max_chap_par)),
                        (n = new q(A.max_img_par)),
                        (A.net_chap = A.chap_dllist.length),
                        dt("#manual-pause").on("click", function () {
                          (n.togglePause(),
                            dt("#manual-pause").text(
                              n.paused ? "繼續下載" : "暫停下載",
                            ));
                        }),
                        dt(".abort-dialog").on("click", function () {
                          (e.terminate(), n.terminate());
                        }),
                        dt(".animate-click").on("click", function () {
                          (e.terminate(), n.terminate());
                        }),
                        dt("#dl-bar").show(),
                        dt("#dl-progress").show(),
                        dt("#dl-percentage-container").show(),
                        (r = rt()),
                        (o = rt()),
                        (i = ot()),
                        (a = {
                          get: function (t, e) {
                            var n = Reflect.get(t, e);
                            return "object" === yt(n) ? new Proxy(n, a) : n;
                          },
                          set: function (t, e, n) {
                            if (
                              ((t[e] = n),
                              "success" === e || "failed" === e || "net" === e)
                            ) {
                              var r = t.name;
                              if ("page" === r) {
                                var o = ((t.success + t.failed) / t.net) * 100,
                                  i = (t.failed / t.net) * 100;
                                (dt("#dl-progress").css(
                                  "width",
                                  "".concat(o, "%"),
                                ),
                                  dt("#dl-progress-failed").css(
                                    "width",
                                    "".concat(i, "%"),
                                  ),
                                  dt("#dl-info").text(
                                    ""
                                      .concat(t.success + t.failed, "/")
                                      .concat(t.net),
                                  ));
                              } else
                                "chap" === r &&
                                  dt("#dl-percentage").text(
                                    ""
                                      .concat(t.success + t.failed, "/")
                                      .concat(A.net_chap),
                                  );
                            }
                            return !0;
                          },
                        }),
                        (c = new Proxy(
                          {
                            page: {
                              name: "page",
                              net: 0,
                              success: 0,
                              failed: 0,
                            },
                            chap: {
                              name: "chap",
                              net: A.chap_dllist.length,
                              success: 0,
                              failed: 0,
                            },
                          },
                          a,
                        )),
                        dt("#dl-percentage").text("0/".concat(A.net_chap)),
                        (s = setInterval(
                          mt(
                            vt().mark(function t() {
                              var e;
                              return vt().wrap(function (t) {
                                for (;;)
                                  switch ((t.prev = t.next)) {
                                    case 0:
                                      if (!(A.zip.length > 1)) {
                                        t.next = 8;
                                        break;
                                      }
                                      return (
                                        (e = A.zip.shift()),
                                        (t.t0 = bt),
                                        (t.next = 5),
                                        e.generateAsync({
                                          type: "blob",
                                          compression: "STORE",
                                        })
                                      );
                                    case 5:
                                      ((t.t1 = t.sent),
                                        (t.t2 = "".concat(
                                          A.manga_name,
                                          ".zip",
                                        )),
                                        (0, t.t0)(t.t1, t.t2));
                                    case 8:
                                    case "end":
                                      return t.stop();
                                  }
                              }, t);
                            }),
                          ),
                          500,
                        )),
                        (t.next = 18),
                        $(A.chap_dllist, ft, [r, o, i, c, n], e)
                          .then(function () {
                            try {
                              if (o(!0))
                                throw (
                                  e.terminated &&
                                    console.error(
                                      "".concat(A.manga_name, ": terminated!"),
                                    ),
                                  new Error(
                                    "缺失章節："
                                      .concat(o(!0), "/")
                                      .concat(r(!0), " (Total: ")
                                      .concat(c.chap.net, ")"),
                                  )
                                );
                              console.log(
                                "".concat(A.manga_name, ": all clear!"),
                              );
                            } catch (t) {
                              console.error(t.message);
                              A.zip[A.zip.length - 1].file(
                                "不完整下載.txt",
                                it("".concat(t.message, "\n").concat(i())),
                              );
                            }
                          })
                          .then(
                            mt(
                              vt().mark(function t() {
                                return vt().wrap(function (t) {
                                  for (;;)
                                    switch ((t.prev = t.next)) {
                                      case 0:
                                        return (
                                          clearInterval(s),
                                          (t.next = 3),
                                          Promise.all(
                                            A.zip.map(
                                              (function () {
                                                var t = mt(
                                                  vt().mark(function t(e) {
                                                    var n;
                                                    return vt().wrap(function (
                                                      t,
                                                    ) {
                                                      for (;;)
                                                        switch (
                                                          (t.prev = t.next)
                                                        ) {
                                                          case 0:
                                                            return (
                                                              (t.next = 2),
                                                              e.generateAsync({
                                                                type: "blob",
                                                                compression:
                                                                  "STORE",
                                                              })
                                                            );
                                                          case 2:
                                                            ((n = t.sent),
                                                              bt(
                                                                n,
                                                                "".concat(
                                                                  A.manga_name,
                                                                  ".zip",
                                                                ),
                                                              ));
                                                          case 4:
                                                          case "end":
                                                            return t.stop();
                                                        }
                                                    }, t);
                                                  }),
                                                );
                                                return function (e) {
                                                  return t.apply(
                                                    this,
                                                    arguments,
                                                  );
                                                };
                                              })(),
                                            ),
                                          )
                                        );
                                      case 3:
                                      case "end":
                                        return t.stop();
                                    }
                                }, t);
                              }),
                            ),
                          )
                          .finally(function () {
                            (dt("#mangadl-all")
                              .removeAttr("dling")
                              .text("打包下載"),
                              dt("#mangadl-retry")
                                .removeAttr("dling")
                                .text("重新下載"),
                              dt("#mangadl-retry").removeClass("none"),
                              dt(".muludiv").css("background-color", ""),
                              dt("#dl-bar").hide(),
                              dt("#dl-progress").hide(),
                              dt("#dl-progress").css({ width: 0 }),
                              dt("#dl-progress-failed").css({ width: 0 }),
                              dt("#dl-info").text(""),
                              dt("#dl-percentage-container").hide(),
                              dt("#dl-percentage").text(""),
                              dt("#manual-pause").text("手動暫停"),
                              dt("#manual-select").show(),
                              dt("#clear-selection").show(),
                              (A.net_chap = 0),
                              (A.dling = !1));
                          })
                      );
                    case 18:
                    case "end":
                      return t.stop();
                  }
              }, t);
            }),
          )),
          wt.apply(this, arguments)
        );
      }
      var kt = n(692);
      function Et(t) {
        return (
          (Et =
            "function" == typeof Symbol && "symbol" == typeof Symbol.iterator
              ? function (t) {
                  return typeof t;
                }
              : function (t) {
                  return t &&
                    "function" == typeof Symbol &&
                    t.constructor === Symbol &&
                    t !== Symbol.prototype
                    ? "symbol"
                    : typeof t;
                }),
          Et(t)
        );
      }
      function jt() {
        jt = function () {
          return e;
        };
        var t,
          e = {},
          n = Object.prototype,
          r = n.hasOwnProperty,
          o =
            Object.defineProperty ||
            function (t, e, n) {
              t[e] = n.value;
            },
          i = "function" == typeof Symbol ? Symbol : {},
          a = i.iterator || "@@iterator",
          c = i.asyncIterator || "@@asyncIterator",
          s = i.toStringTag || "@@toStringTag";
        function u(t, e, n) {
          return (
            Object.defineProperty(t, e, {
              value: n,
              enumerable: !0,
              configurable: !0,
              writable: !0,
            }),
            t[e]
          );
        }
        try {
          u({}, "");
        } catch (t) {
          u = function (t, e, n) {
            return (t[e] = n);
          };
        }
        function l(t, e, n, r) {
          var i = e && e.prototype instanceof g ? e : g,
            a = Object.create(i.prototype),
            c = new C(r || []);
          return (o(a, "_invoke", { value: L(t, n, c) }), a);
        }
        function f(t, e, n) {
          try {
            return { type: "normal", arg: t.call(e, n) };
          } catch (t) {
            return { type: "throw", arg: t };
          }
        }
        e.wrap = l;
        var p = "suspendedStart",
          h = "suspendedYield",
          d = "executing",
          v = "completed",
          y = {};
        function g() {}
        function m() {}
        function b() {}
        var x = {};
        u(x, a, function () {
          return this;
        });
        var w = Object.getPrototypeOf,
          k = w && w(w(_([])));
        k && k !== n && r.call(k, a) && (x = k);
        var E = (b.prototype = g.prototype = Object.create(x));
        function j(t) {
          ["next", "throw", "return"].forEach(function (e) {
            u(t, e, function (t) {
              return this._invoke(e, t);
            });
          });
        }
        function T(t, e) {
          function n(o, i, a, c) {
            var s = f(t[o], t, i);
            if ("throw" !== s.type) {
              var u = s.arg,
                l = u.value;
              return l && "object" == Et(l) && r.call(l, "__await")
                ? e.resolve(l.__await).then(
                    function (t) {
                      n("next", t, a, c);
                    },
                    function (t) {
                      n("throw", t, a, c);
                    },
                  )
                : e.resolve(l).then(
                    function (t) {
                      ((u.value = t), a(u));
                    },
                    function (t) {
                      return n("throw", t, a, c);
                    },
                  );
            }
            c(s.arg);
          }
          var i;
          o(this, "_invoke", {
            value: function (t, r) {
              function o() {
                return new e(function (e, o) {
                  n(t, r, e, o);
                });
              }
              return (i = i ? i.then(o, o) : o());
            },
          });
        }
        function L(e, n, r) {
          var o = p;
          return function (i, a) {
            if (o === d) throw Error("Generator is already running");
            if (o === v) {
              if ("throw" === i) throw a;
              return { value: t, done: !0 };
            }
            for (r.method = i, r.arg = a; ; ) {
              var c = r.delegate;
              if (c) {
                var s = S(c, r);
                if (s) {
                  if (s === y) continue;
                  return s;
                }
              }
              if ("next" === r.method) r.sent = r._sent = r.arg;
              else if ("throw" === r.method) {
                if (o === p) throw ((o = v), r.arg);
                r.dispatchException(r.arg);
              } else "return" === r.method && r.abrupt("return", r.arg);
              o = d;
              var u = f(e, n, r);
              if ("normal" === u.type) {
                if (((o = r.done ? v : h), u.arg === y)) continue;
                return { value: u.arg, done: r.done };
              }
              "throw" === u.type &&
                ((o = v), (r.method = "throw"), (r.arg = u.arg));
            }
          };
        }
        function S(e, n) {
          var r = n.method,
            o = e.iterator[r];
          if (o === t)
            return (
              (n.delegate = null),
              ("throw" === r &&
                e.iterator.return &&
                ((n.method = "return"),
                (n.arg = t),
                S(e, n),
                "throw" === n.method)) ||
                ("return" !== r &&
                  ((n.method = "throw"),
                  (n.arg = new TypeError(
                    "The iterator does not provide a '" + r + "' method",
                  )))),
              y
            );
          var i = f(o, e.iterator, n.arg);
          if ("throw" === i.type)
            return (
              (n.method = "throw"),
              (n.arg = i.arg),
              (n.delegate = null),
              y
            );
          var a = i.arg;
          return a
            ? a.done
              ? ((n[e.resultName] = a.value),
                (n.next = e.nextLoc),
                "return" !== n.method && ((n.method = "next"), (n.arg = t)),
                (n.delegate = null),
                y)
              : a
            : ((n.method = "throw"),
              (n.arg = new TypeError("iterator result is not an object")),
              (n.delegate = null),
              y);
        }
        function A(t) {
          var e = { tryLoc: t[0] };
          (1 in t && (e.catchLoc = t[1]),
            2 in t && ((e.finallyLoc = t[2]), (e.afterLoc = t[3])),
            this.tryEntries.push(e));
        }
        function O(t) {
          var e = t.completion || {};
          ((e.type = "normal"), delete e.arg, (t.completion = e));
        }
        function C(t) {
          ((this.tryEntries = [{ tryLoc: "root" }]),
            t.forEach(A, this),
            this.reset(!0));
        }
        function _(e) {
          if (e || "" === e) {
            var n = e[a];
            if (n) return n.call(e);
            if ("function" == typeof e.next) return e;
            if (!isNaN(e.length)) {
              var o = -1,
                i = function n() {
                  for (; ++o < e.length; )
                    if (r.call(e, o))
                      return ((n.value = e[o]), (n.done = !1), n);
                  return ((n.value = t), (n.done = !0), n);
                };
              return (i.next = i);
            }
          }
          throw new TypeError(Et(e) + " is not iterable");
        }
        return (
          (m.prototype = b),
          o(E, "constructor", { value: b, configurable: !0 }),
          o(b, "constructor", { value: m, configurable: !0 }),
          (m.displayName = u(b, s, "GeneratorFunction")),
          (e.isGeneratorFunction = function (t) {
            var e = "function" == typeof t && t.constructor;
            return (
              !!e &&
              (e === m || "GeneratorFunction" === (e.displayName || e.name))
            );
          }),
          (e.mark = function (t) {
            return (
              Object.setPrototypeOf
                ? Object.setPrototypeOf(t, b)
                : ((t.__proto__ = b), u(t, s, "GeneratorFunction")),
              (t.prototype = Object.create(E)),
              t
            );
          }),
          (e.awrap = function (t) {
            return { __await: t };
          }),
          j(T.prototype),
          u(T.prototype, c, function () {
            return this;
          }),
          (e.AsyncIterator = T),
          (e.async = function (t, n, r, o, i) {
            void 0 === i && (i = Promise);
            var a = new T(l(t, n, r, o), i);
            return e.isGeneratorFunction(n)
              ? a
              : a.next().then(function (t) {
                  return t.done ? t.value : a.next();
                });
          }),
          j(E),
          u(E, s, "Generator"),
          u(E, a, function () {
            return this;
          }),
          u(E, "toString", function () {
            return "[object Generator]";
          }),
          (e.keys = function (t) {
            var e = Object(t),
              n = [];
            for (var r in e) n.push(r);
            return (
              n.reverse(),
              function t() {
                for (; n.length; ) {
                  var r = n.pop();
                  if (r in e) return ((t.value = r), (t.done = !1), t);
                }
                return ((t.done = !0), t);
              }
            );
          }),
          (e.values = _),
          (C.prototype = {
            constructor: C,
            reset: function (e) {
              if (
                ((this.prev = 0),
                (this.next = 0),
                (this.sent = this._sent = t),
                (this.done = !1),
                (this.delegate = null),
                (this.method = "next"),
                (this.arg = t),
                this.tryEntries.forEach(O),
                !e)
              )
                for (var n in this)
                  "t" === n.charAt(0) &&
                    r.call(this, n) &&
                    !isNaN(+n.slice(1)) &&
                    (this[n] = t);
            },
            stop: function () {
              this.done = !0;
              var t = this.tryEntries[0].completion;
              if ("throw" === t.type) throw t.arg;
              return this.rval;
            },
            dispatchException: function (e) {
              if (this.done) throw e;
              var n = this;
              function o(r, o) {
                return (
                  (c.type = "throw"),
                  (c.arg = e),
                  (n.next = r),
                  o && ((n.method = "next"), (n.arg = t)),
                  !!o
                );
              }
              for (var i = this.tryEntries.length - 1; i >= 0; --i) {
                var a = this.tryEntries[i],
                  c = a.completion;
                if ("root" === a.tryLoc) return o("end");
                if (a.tryLoc <= this.prev) {
                  var s = r.call(a, "catchLoc"),
                    u = r.call(a, "finallyLoc");
                  if (s && u) {
                    if (this.prev < a.catchLoc) return o(a.catchLoc, !0);
                    if (this.prev < a.finallyLoc) return o(a.finallyLoc);
                  } else if (s) {
                    if (this.prev < a.catchLoc) return o(a.catchLoc, !0);
                  } else {
                    if (!u)
                      throw Error("try statement without catch or finally");
                    if (this.prev < a.finallyLoc) return o(a.finallyLoc);
                  }
                }
              }
            },
            abrupt: function (t, e) {
              for (var n = this.tryEntries.length - 1; n >= 0; --n) {
                var o = this.tryEntries[n];
                if (
                  o.tryLoc <= this.prev &&
                  r.call(o, "finallyLoc") &&
                  this.prev < o.finallyLoc
                ) {
                  var i = o;
                  break;
                }
              }
              i &&
                ("break" === t || "continue" === t) &&
                i.tryLoc <= e &&
                e <= i.finallyLoc &&
                (i = null);
              var a = i ? i.completion : {};
              return (
                (a.type = t),
                (a.arg = e),
                i
                  ? ((this.method = "next"), (this.next = i.finallyLoc), y)
                  : this.complete(a)
              );
            },
            complete: function (t, e) {
              if ("throw" === t.type) throw t.arg;
              return (
                "break" === t.type || "continue" === t.type
                  ? (this.next = t.arg)
                  : "return" === t.type
                    ? ((this.rval = this.arg = t.arg),
                      (this.method = "return"),
                      (this.next = "end"))
                    : "normal" === t.type && e && (this.next = e),
                y
              );
            },
            finish: function (t) {
              for (var e = this.tryEntries.length - 1; e >= 0; --e) {
                var n = this.tryEntries[e];
                if (n.finallyLoc === t)
                  return (this.complete(n.completion, n.afterLoc), O(n), y);
              }
            },
            catch: function (t) {
              for (var e = this.tryEntries.length - 1; e >= 0; --e) {
                var n = this.tryEntries[e];
                if (n.tryLoc === t) {
                  var r = n.completion;
                  if ("throw" === r.type) {
                    var o = r.arg;
                    O(n);
                  }
                  return o;
                }
              }
              throw Error("illegal catch attempt");
            },
            delegateYield: function (e, n, r) {
              return (
                (this.delegate = { iterator: _(e), resultName: n, nextLoc: r }),
                "next" === this.method && (this.arg = t),
                y
              );
            },
          }),
          e
        );
      }
      function Tt(t, e, n, r, o, i, a) {
        try {
          var c = t[i](a),
            s = c.value;
        } catch (t) {
          return void n(t);
        }
        c.done ? e(s) : Promise.resolve(s).then(r, o);
      }
      function Lt(t) {
        return function () {
          var e = this,
            n = arguments;
          return new Promise(function (r, o) {
            var i = t.apply(e, n);
            function a(t) {
              Tt(i, r, o, a, c, "next", t);
            }
            function c(t) {
              Tt(i, r, o, a, c, "throw", t);
            }
            a(void 0);
          });
        };
      }
      function St() {
        return At.apply(this, arguments);
      }
      function At() {
        return (
          (At = Lt(
            jt().mark(function t() {
              var e;
              return jt().wrap(function (t) {
                for (;;)
                  switch ((t.prev = t.next)) {
                    case 0:
                      if (!kt("#mangadl-all").attr("dling") && !A.dling) {
                        t.next = 5;
                        break;
                      }
                      return (
                        kt("#mangadl-all").text("下載中稍等.."),
                        t.abrupt("return")
                      );
                    case 5:
                      (A.init(),
                        (A.dling = !0),
                        kt("#mangadl-all")
                          .attr("dling", A.dling)
                          .text("下載中"),
                        kt("#manual-select").hide(),
                        kt("#clear-selection").hide());
                    case 10:
                      return (
                        kt(".muludiv").each(function (t, e) {
                          "rgb(127, 187, 179)" ===
                            kt(e).css("background-color") &&
                            A.chap_dllist.push(A.chap_list[t]);
                        }),
                        A.chap_dllist.length ||
                          ((A.entry_chap = Number(
                            kt("#injected [name='entry']").val(),
                          )),
                          (A.end_chap = Number(
                            kt("#injected [name='end']").val(),
                          )),
                          A.entry_chap > A.end_chap &&
                            ((e = [A.end_chap, A.entry_chap]),
                            (A.entry_chap = e[0]),
                            (A.end_chap = e[1])),
                          (A.chap_dllist = A.chap_list.slice(
                            A.entry_chap,
                            A.end_chap + 1,
                          ))),
                        (A.max_chap_par = Number(
                          kt("#injected [name='chap-par']").val(),
                        )),
                        (A.max_img_par = Number(
                          kt("#injected [name='img-par']").val(),
                        )),
                        (A.retry = Number(
                          kt("#injected [name='retry']").val(),
                        )),
                        (t.next = 17),
                        xt()
                      );
                    case 17:
                    case "end":
                      return t.stop();
                  }
              }, t);
            }),
          )),
          At.apply(this, arguments)
        );
      }
      function Ot() {
        return Ct.apply(this, arguments);
      }
      function Ct() {
        return (Ct = Lt(
          jt().mark(function t() {
            return jt().wrap(function (t) {
              for (;;)
                switch ((t.prev = t.next)) {
                  case 0:
                    if (!kt("#mangadl-retry").attr("dling") && !A.dling) {
                      t.next = 5;
                      break;
                    }
                    return (
                      kt("#mangadl-retry").text("下載中稍等.."),
                      t.abrupt("return")
                    );
                  case 5:
                    ((A.dling = !0),
                      kt("#mangadl-retry")
                        .attr("dling", A.dling)
                        .text("下載中"));
                  case 7:
                    return ((t.next = 9), xt());
                  case 9:
                  case "end":
                    return t.stop();
                }
            }, t);
          }),
        )).apply(this, arguments);
      }
      var _t = n(692);
      function Nt(t) {
        return (
          (function (t) {
            if (Array.isArray(t)) return Pt(t);
          })(t) ||
          (function (t) {
            if (
              ("undefined" != typeof Symbol && null != t[Symbol.iterator]) ||
              null != t["@@iterator"]
            )
              return Array.from(t);
          })(t) ||
          (function (t, e) {
            if (t) {
              if ("string" == typeof t) return Pt(t, e);
              var n = {}.toString.call(t).slice(8, -1);
              return (
                "Object" === n && t.constructor && (n = t.constructor.name),
                "Map" === n || "Set" === n
                  ? Array.from(t)
                  : "Arguments" === n ||
                      /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)
                    ? Pt(t, e)
                    : void 0
              );
            }
          })(t) ||
          (function () {
            throw new TypeError(
              "Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.",
            );
          })()
        );
      }
      function Pt(t, e) {
        (null == e || e > t.length) && (e = t.length);
        for (var n = 0, r = Array(e); n < e; n++) r[n] = t[n];
        return r;
      }
      var Dt = n(145),
        qt = {};
      ((qt.styleTagTransform = p()),
        (qt.setAttributes = s()),
        (qt.insert = a().bind(null, "head")),
        (qt.domAPI = o()),
        (qt.insertStyleElement = l()));
      e()(Dt.A, qt);
      Dt.A && Dt.A.locals && Dt.A.locals;
      var Ht = n(692);
      var Rt = n(821),
        It = {};
      ((It.styleTagTransform = p()),
        (It.setAttributes = s()),
        (It.insert = a().bind(null, "head")),
        (It.domAPI = o()),
        (It.insertStyleElement = l()));
      e()(Rt.A, It);
      Rt.A && Rt.A.locals && Rt.A.locals;
      var Ft = n(692);
      (n(692)("<script>", {
        type: "text/javascript",
        src: "https://cdnjs.cloudflare.com/ajax/libs/jszip/3.10.1/jszip.min.js",
      }).appendTo(document.head),
        (function () {
          (v("body").css({ "overflow-x": "hidden" }),
            v("body:last-child").after(
              '<button id="sidebar-open-btn">菜單</button> <div id="uk-sidebar"> <div class="abort-dialog"> Click <a href="javascript:;">here</a> to force save downloaded images&period; </div> <div class="titlebar"> <button id="sidebar-close-btn">&times;</button> <h2>菜單</h2> </div> <div class="uk-container"></div> </div> ',
            ));
          var t = !1,
            e = v("#uk-sidebar"),
            n = v("#sidebar-open-btn"),
            r = v("#sidebar-close-btn");
          (v(document).on("keydown", function (t) {
            var r = t.key,
              o = t.ctrlKey;
            "o" === r && o && (e.addClass("active"), n.addClass("hidden"));
          }),
            v(document).on("keydown", function (t) {
              var r = t.key,
                o = t.ctrlKey;
              "q" === r &&
                o &&
                (e.removeClass("active"), n.removeClass("hidden"));
            }),
            r.on("click", function () {
              (e.removeClass("active"), n.removeClass("hidden"));
            }),
            n.on("mousedown", function (r) {
              var o = r.clientX,
                i = r.clientY,
                a = n[0].getBoundingClientRect(),
                c = o - a.left,
                s = i - a.top;
              function u(e) {
                var r = e.clientX,
                  o = e.clientY;
                ((t = !0), n.css({ left: r - c + "px", top: o - s + "px" }));
              }
              (v(document).on("mousemove", u),
                n.on("mouseup", function () {
                  (t ? (t = !1) : (e.addClass("active"), n.addClass("hidden")),
                    v(document).off("mousemove", u),
                    n.off("mouseup"));
                }));
            }));
        })(),
        (function () {
          var t = [],
            e = [];
          A.chap_list.forEach(function (n, r) {
            (t.push(
              '\n              <option value="'
                .concat(r, '" ')
                .concat(r ? "" : "selected", ">\n                ")
                .concat(n.number, "\n              </option>"),
            ),
              e.push(
                '\n              <option value="'
                  .concat(r, '" ')
                  .concat(
                    r === A.chap_num - 1 ? "selected" : "",
                    ">\n                ",
                  )
                  .concat(n.number, "\n              </option>"),
              ));
          });
          var n = Nt(Array(5)).map(function (t, e) {
              return "\n              <option value="
                .concat(e + 1, " ")
                .concat(4 === e ? "selected" : "", ">")
                .concat(e + 1, "</option>\n            ");
            }),
            r = Nt(Array(5)).map(function (t, e) {
              return "\n              <option value="
                .concat(e + 1, " ")
                .concat(4 === e ? "selected" : "", ">")
                .concat(20 * (e + 1), "</option>\n            ");
            }),
            o = Nt(Array(10)).map(function (t, e) {
              return "\n              <option value="
                .concat(e + 1, " ")
                .concat(4 === e ? "selected" : "", ">")
                .concat(e + 1, "</option>\n            ");
            });
          (_t("div#uk-sidebar .uk-container").append(
            '<div id="injected"> <div class="range-container"> <span>開始：</span> <select name="entry" class="uk-select"></select> </div> <div class="range-container"> <span>結束：</span> <select name="end" class="uk-select"></select> </div> <div class="tooltip-container"> <span>重試：</span> <select name="retry" class="uk-select"></select> <button class="tooltip-button">?</button> <div class="tooltip-text"> <p>Number of retries after image download fails.</p> <p>圖片下載失敗後重試次數。</p> </div> </div> <div class="tooltip-container"> <span>併發章節數：</span> <select name="chap-par" class="uk-select"></select> <button class="tooltip-button">?</button> <div class="tooltip-text"> <p> Bigger the value, larger the number of concurrent chapter fetches. But because the browser can only handle a limited number of concurrent requests, it is recommended to use the options listed below. </p> <p> 數值越大，同時下載章節的數量就越多。但由於瀏覽器只能處理有限的並發請求，建議使用以下選項。 </p> </div> </div> <div class="tooltip-container"> <span>併發圖片數：</span> <select name="img-par" class="uk-select"></select> <button class="tooltip-button">?</button> <div class="tooltip-text"> <p> Bigger the value, larger the number of concurrent image fetches. But because the browser can only handle a limited number of concurrent requests, it is recommended to use the options listed below. </p> <p> 數值越大，同時下載圖片的數量就越多。但由於瀏覽器只能處理有限的並發請求，建議使用以下選項。 </p> </div> </div> <div class="mtm grid-container"> <a href="javascript:;" class="uk-button uk-button-danger" id="mangadl-all"> <span>打包下載</span> </a> <a href="javascript:;" class="uk-button uk-button-primary none" style="background-color:#000" id="mangadl-retry"> <span>重新下載</span> </a> <a href="javascript:;" class="uk-button uk-button-primary" id="manual-pause"> <span>手動暫停</span> </a> <a href="javascript:;" class="uk-button uk-button-primary" id="manual-select"> <span>手動選擇</span> </a> <a href="javascript:;" class="uk-button uk-button-primary" id="clear-selection"> <span>取消選擇</span> </a> </div> </div> ',
          ),
            _t("#injected [name=entry]").html(t.join("\n")),
            _t("#injected [name=end]").html(e.join("\n")),
            _t("#injected [name=retry]").html(o.join("\n")),
            _t("#injected [name=chap-par]").html(n.join("\n")),
            _t("#injected [name=img-par]").html(r.join("\n")),
            _t("#mangadl-all").on("click", St),
            _t("#mangadl-retry").on("click", Ot),
            _t("#clear-selection").on("click", function () {
              _t(".muludiv").each(function (t, e) {
                _t(e).css("background-color", "");
              });
            }));
        })(),
        (function () {
          Ht(document.body).append(
            '<div id="cursor-pointer"></div> <div id="vertical-line"></div> <div id="horizontal-line"></div> ',
          );
          var t = Ht("#manual-select"),
            e = Ht("#cursor-pointer"),
            n = Ht("#vertical-line"),
            r = Ht("#horizontal-line"),
            o = !1;
          function i() {
            ((o = !1), e.hide(), n.hide(), r.hide());
          }
          (t.on("click", function (t) {
            var a, c, s;
            o
              ? i()
              : ((c = (a = t).clientX),
                (s = a.clientY),
                (o = !0),
                e.show(),
                n.show(),
                r.show(),
                e.css({ left: c - 10 + "px", top: s - 10 + "px" }),
                n.css({ left: c + "px" }),
                r.css({ top: s + "px" }));
          }),
            Ht(document).on("mousemove", function (t) {
              var i = t.clientX,
                a = t.clientY;
              o &&
                (e.css({ left: i - 10 + "px", top: a - 10 + "px" }),
                n.css({ left: i + "px" }),
                r.css({ top: a + "px" }));
            }),
            Ht(document).on("keydown", function (t) {
              "Escape" === t.key && i();
            }),
            Ht("#mangadl-all").on("click", i),
            Ht(document).on("click", ".muludiv", function (t) {
              o &&
                (t.preventDefault(),
                Ht(t.currentTarget)[0].style.backgroundColor
                  ? Ht(this).css("background-color", "")
                  : Ht(this).css("background-color", "#7fbbb3"));
            }));
        })(),
        Ft("<div>", { id: "dl-bar" })
          .html(
            '</div><div id="dl-progress"></div><span id="dl-info"></span><div id="dl-progress-failed">',
          )
          .appendTo(".uk-width-expand .uk-margin-left"),
        Ft("body").append(
          '\n            <div id="dl-percentage-container">\n              <a href="javascript:;" id="dl-percentage" class="animate-click" draggable="false"></a>\n            </div>\n          ',
        ));
    })());
})();
