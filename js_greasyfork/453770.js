// ==UserScript==
// @name         群友分享的觅影
// @version      20.6.13
// @author       (o˘◡˘o)
// @description  视频解析观看（套壳专用）
// @note         最近更新：更新解析，移除低质量解析，提升解析效率；增加数张加载图；优化自动切换线路；更新 hls 库；更新引用文件的 cdn 域名
// @namespace    (o˘◡˘o)
// @icon         https://p.pstatp.com/origin/fe690000c9141955bbac
// @license      GPL License
// @include      *
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_deleteValue
// @grant        unsafeWindow
// @downloadURL https://update.greasyfork.org/scripts/453770/%E7%BE%A4%E5%8F%8B%E5%88%86%E4%BA%AB%E7%9A%84%E8%A7%85%E5%BD%B1.user.js
// @updateURL https://update.greasyfork.org/scripts/453770/%E7%BE%A4%E5%8F%8B%E5%88%86%E4%BA%AB%E7%9A%84%E8%A7%85%E5%BD%B1.meta.js
// ==/UserScript==

!async function() {
  let _Mathfloor = Math.floor, _Mathmax = Math.max;
  function Is(n) {
    let e = 1 < arguments.length && void 0 !== arguments[1] ? arguments[1] : Href;
    return n instanceof Function ? n(e) : (e = (n.source || n).includes("=http") ? e : e.replace(/=http[^&]+/, ""),
    "string" == typeof n ? e.includes(n) : n.test(e));
  }
  function IsNot(n, e) {
    return !Is(n, e);
  }
  function Arguments(n) {
    const e = n.length, t = Array(e);
    for (let i = 0; i < e; i++) t[i] = n[i];
    return t;
  }
  function getGlobal(n) {
    return (hasUnsafeWindow ? unsafeWindow : window)[n];
  }
  function setGlobal(n, e) {
    window[n] = e, hasUnsafeWindow && (unsafeWindow[n] = e);
  }
  function parseStoreData(n) {
    let e = 1 < arguments.length && void 0 !== arguments[1] ? arguments[1] : null;
    if ("string" == typeof n) try {
      n = JSON.parse(n);
    } catch (n) {}
    return null === n ? e : n;
  }
  function getCdnUrl(n) {
    return "https://cdn.bootcdn.net/ajax/libs" + n;
  }
  async function fetchCdnUrl(n, e) {
    let t;
    const i = /^\/\w/.test(n);
    if (n = i ? getCdnUrl(n) : n, !e && i) {
      const e = n.match(/.*\/([^\/]+)\/([^\/]+)$/);
      t = e[2];
    } else t = e && e.name || n;
    const o = GlobalStore.get(t);
    let a;
    return a = o && "20.6.13" === o.version ? o.data : await window.fetch(n).then((function(n) {
      return n.text();
    })).then((function(n) {
      return GlobalStore.set(t, {
        data: n,
        version: VERSION
      }), n;
    })), a;
  }
  async function addJs(url, opts) {
    const data = await fetchCdnUrl(url, opts);
    return eval(data);
  }
  async function addCssUrl(n) {
    addCss(await fetchCdnUrl(n));
  }
  function addCss(n) {
    let e;
    return /^(http|\/)/.test(n) ? addCssUrl(n) : (n = n.replace(/\n+\s*/g, " "), e = document.createElement("style"),
    e.styleSheet ? e.styleSheet.cssText = n : e.appendChild(document.createTextNode(n)),
    e.type = "text/css", void document.getElementsByTagName("head")[0].appendChild(e));
  }
  function prefixCss(n, e) {
    let t, i, o, a, r = e.length;
    e += " ", n = (n = (n = n.replace(/\/\*(?:(?!\*\/)[\s\S])*\*\/|[\r\n\t]+/g, "")).replace(/}(\s*)@/g, "}@")).replace(/}(\s*)}/g, "}}");
    for (let s = 0; s < n.length - 2; s++) t = n[s], i = n[s + 1], "@" === t && (o = !0),
    o || "{" !== t || (a = !0), a && "}" === t && (a = !1), !a && "@" !== i && "}" !== i && ("}" === t || "," === t || ("{" === t || ";" === t) && o) && (n = n.slice(0, s + 1) + e + n.slice(s + 1),
    s += r, o = !1);
    return 0 !== n.indexOf(e) && 0 !== n.indexOf("@") && (n = e + n), n;
  }
  function get$() {
    function n(n, e) {
      try {
        return n(e);
      } catch (n) {
        return e;
      }
    }
    function e(n, e) {
      return n && (l(e) || c(e)) ? rn.test(n) ? e.getElementsByClassName(n.slice(1)) : sn.test(n) ? e.getElementsByTagName(n) : e.querySelectorAll(n) : [];
    }
    function t(n) {
      return n.replace(pn, (function(n, e) {
        return e.toUpperCase();
      }));
    }
    function i(n, e, t) {
      if (t) {
        for (let t = n.length; t--; ) if (!1 === e.call(n[t], t, n[t])) return n;
      } else for (let t = 0, i = n.length; t < i; t++) if (!1 === e.call(n[t], t, n[t])) return n;
      return n;
    }
    function o(n) {
      let e = [];
      for (let n = 1; n < arguments.length; n++) e[n - 1] = arguments[n];
      let t = arguments.length;
      if (!t) return {};
      if (1 === t) return o(dn, n);
      for (let e = 1; e < t; e++) for (let t in arguments[e]) n[t] = arguments[e][t];
      return n;
    }
    function a(n, e) {
      let t = n && (n.matches || n.webkitMatchesSelector || n.msMatchesSelector);
      return !!t && !!e && t.call(n, e);
    }
    function r(n) {
      return n instanceof ln;
    }
    function s(n) {
      return !!n && n === n.window;
    }
    function l(n) {
      return !!n && 9 === n.nodeType;
    }
    function c(n) {
      return !!n && 1 === n.nodeType;
    }
    function d(n) {
      return "function" == typeof n;
    }
    function p(n) {
      return "string" == typeof n;
    }
    function f(n) {
      return void 0 === n;
    }
    function u(n) {
      return null === n;
    }
    function m(n) {
      return !isNaN(parseFloat(n)) && isFinite(n);
    }
    function h(n) {
      return p(n) ? function(e, t) {
        return a(t, n);
      } : d(n) ? n : r(n) ? function(e, t) {
        return n.is(t);
      } : n ? function(e, t) {
        return t === n;
      } : function() {
        return !1;
      };
    }
    function g(n, e) {
      return e ? n.filter(e) : n;
    }
    function b(n) {
      return p(n) && n.match(fn) || [];
    }
    function v(n, e, t, i) {
      let o = [], a = d(e), r = i && h(i);
      for (let s = 0, l = n.length; s < l; s++) if (a) {
        let t = e(n[s]);
        t.length && en.apply(o, t);
      } else for (let a = n[s][e]; !(null == a || i && r(-1, a)); ) o.push(a), a = t ? a[e] : null;
      return o;
    }
    function y(n) {
      return 1 < n.length ? Z.call(n, (function(n, e, t) {
        return Y.call(t, n) === e;
      })) : n;
    }
    function x(n, e, t) {
      if (c(n)) {
        let i = L.getComputedStyle(n, null);
        return t ? i.getPropertyValue(e) || void 0 : i[e];
      }
    }
    function w(n, e) {
      return parseInt(x(n, e), 10) || 0;
    }
    function _(n) {
      return un.test(n);
    }
    function k(n, e) {
      if (void 0 === e && (e = _(n)), e) return n;
      if (!mn[n]) {
        let e = t(n), o = "" + e[0].toUpperCase() + e.slice(1);
        i((e + " " + gn.join(o + " ") + o).split(" "), (function(e, t) {
          if (t in hn) return mn[n] = t, !1;
        }));
      }
      return mn[n];
    }
    function S(n, e, t) {
      return void 0 === t && (t = _(n)), t || bn[n] || !m(e) ? e : e + "px";
    }
    function j(e, i) {
      let o = e.dataset[i] || e.dataset[t(i)];
      return vn.test(o) ? o : n(JSON.parse, o);
    }
    function I(e, i, o) {
      o = n(JSON.stringify, o), e.dataset[t(i)] = o;
    }
    function $(n, e) {
      let t = n.documentElement;
      return _Mathmax(n.body["scroll" + e], t["scroll" + e], n.body["offset" + e], t["offset" + e], t["client" + e]);
    }
    function C(n, e) {
      return w(n, "border" + (e ? "Left" : "Top") + "Width") + w(n, "padding" + (e ? "Left" : "Top")) + w(n, "padding" + (e ? "Right" : "Bottom")) + w(n, "border" + (e ? "Right" : "Bottom") + "Width");
    }
    function A(n) {
      return "none" === x(n, "display");
    }
    function U(n, e) {
      return !e || !on.call(e, (function(e) {
        return 0 > n.indexOf(e);
      }));
    }
    function T(n) {
      return kn[n] || _n[n] || n;
    }
    function q(n) {
      return n[xn] = n[xn] || {};
    }
    function z(n, e, t, i, o) {
      let a = q(n);
      a[e] = a[e] || [], a[e].push([ t, i, o ]), n.addEventListener(e, o);
    }
    function M(n) {
      let e = n.split(wn);
      return [ e[0], e.slice(1).sort() ];
    }
    function P(n, e, t, i, o) {
      let a = q(n);
      if (e) a[e] && (a[e] = a[e].filter((function(a) {
        let r = a[0], s = a[1], l = a[2];
        return !!(o && l.guid !== o.guid || !U(r, t) || i && i !== s) || void n.removeEventListener(e, l);
      }))); else for (e in a) P(n, e, t, i, o);
    }
    function E(n) {
      return n.multiple && n.options ? v(Z.call(n.options, (function(n) {
        return n.selected && !n.disabled && !n.parentNode.disabled;
      })), "value") : n.value || "";
    }
    function V(n) {
      if (!p(n)) return [];
      if (Cn.test(n)) return [ H(RegExp.$1) ];
      let e = $n.test(n) && RegExp.$1, t = An[e] || An["*"];
      return t.innerHTML = n, dn(t.childNodes).detach().get();
    }
    function N(n, e, t, o, a) {
      o ? n.insertBefore(e, t ? n.firstChild : null) : n.parentNode.insertBefore(e, t ? n : n.nextSibling),
      a && function(n, e) {
        let t = dn(n);
        t.filter("script").add(t.find("script")).each((function(n, t) {
          if (Tn.test(t.type) && G.contains(t)) {
            let n = H("script");
            n.text = t.textContent.replace(Un, ""), i(qn, (function(e, i) {
              t[i] && (n[i] = t[i]);
            })), e.head.insertBefore(n, null), e.head.removeChild(n);
          }
        }));
      }(e, n.ownerDocument);
    }
    function R(n, e, t, o, a, r, s, l) {
      return i(n, (function(n, r) {
        i(dn(r), (function(n, r) {
          i(dn(e), (function(e, i) {
            let s = t ? i : r, l = t ? n : e;
            N(t ? r : i, l ? s.cloneNode(!0) : s, o, a, !l);
          }), l);
        }), s);
      }), r), e;
    }
    let D = {
      class: "className",
      contenteditable: "contentEditable",
      for: "htmlFor",
      readonly: "readOnly",
      maxlength: "maxLength",
      tabindex: "tabIndex",
      colspan: "colSpan",
      rowspan: "rowSpan",
      usemap: "useMap"
    }, F = document, L = window, G = F.documentElement, H = F.createElement.bind(F), O = H("div"), B = H("table"), W = H("tbody"), X = H("tr"), J = Array.isArray, K = Array.prototype, Q = K.concat, Z = K.filter, Y = K.indexOf, nn = K.map, en = K.push, tn = K.slice, on = K.some, an = K.splice, rn = /^\.[\w-]*$/, sn = /^\w+$/, ln = function() {
      function n(n, t) {
        if (!n) return;
        if (r(n)) return n;
        let i = n;
        if (p(n)) {
          let o = (r(t) ? t[0] : t) || F;
          if (i = /^#[\w-]*$/.test(n) ? o.getElementById(n.slice(1)) : /<.+>/.test(n) ? V(n) : e(n, o),
          !i) return;
        } else if (d(n)) return this.ready(n);
        (i.nodeType || i === L) && (i = [ i ]), this.length = i.length;
        for (let n = 0, e = this.length; n < e; n++) this[n] = i[n];
      }
      return n.prototype.init = function(e, t) {
        return new n(e, t);
      }, n;
    }(), cn = ln.prototype, dn = cn.init;
    dn.fn = dn.prototype = cn, cn.length = 0, cn.splice = an, "function" == typeof Symbol && (cn[Symbol.iterator] = K[Symbol.iterator]),
    cn.map = function(n) {
      return dn(Q.apply([], nn.call(this, (function(e, t) {
        return n.call(e, t, e);
      }))));
    }, cn.slice = function(n, e) {
      return dn(tn.call(this, n, e));
    };
    let pn = /-([a-z])/g;
    dn.each = i, cn.each = function(n) {
      return i(this, n);
    }, cn.removeProp = function(n) {
      return this.each((function(e, t) {
        delete t[D[n] || n];
      }));
    }, dn.extend = o, cn.extend = function(n) {
      return o(cn, n);
    }, dn.guid = 1, dn.isWindow = s, dn.isFunction = d, dn.isNumeric = m, dn.isArray = J,
    cn.prop = function(n, e) {
      if (n) {
        if (p(n)) return n = D[n] || n, 2 > arguments.length ? this[0] && this[0][n] : this.each((function(t, i) {
          i[n] = e;
        }));
        for (let e in n) this.prop(e, n[e]);
        return this;
      }
    }, cn.get = function(n) {
      return f(n) ? tn.call(this) : this[0 > (n = +n) ? n + this.length : n];
    }, cn.eq = function(n) {
      return dn(this.get(n));
    }, cn.first = function() {
      return this.eq(0);
    }, cn.last = function() {
      return this.eq(-1);
    }, cn.filter = function(n) {
      let e = h(n);
      return dn(Z.call(this, (function(n, t) {
        return e.call(n, t, n);
      })));
    };
    let fn = /\S+/g;
    cn.hasClass = function(n) {
      return !!n && on.call(this, (function(e) {
        return c(e) && e.classList.contains(n);
      }));
    }, cn.removeAttr = function(n) {
      let e = b(n);
      return this.each((function(n, t) {
        c(t) && i(e, (function(n, e) {
          t.removeAttribute(e);
        }));
      }));
    }, cn.attr = function(n, e) {
      if (n) {
        if (p(n)) {
          if (2 > arguments.length) {
            if (!this[0] || !c(this[0])) return;
            let e = this[0].getAttribute(n);
            return u(e) ? void 0 : e;
          }
          return f(e) ? this : u(e) ? this.removeAttr(n) : this.each((function(t, i) {
            c(i) && i.setAttribute(n, e);
          }));
        }
        for (let e in n) this.attr(e, n[e]);
        return this;
      }
    }, cn.toggleClass = function(n, e) {
      let t = b(n), o = !f(e);
      return this.each((function(n, a) {
        c(a) && i(t, (function(n, t) {
          o ? e ? a.classList.add(t) : a.classList.remove(t) : a.classList.toggle(t);
        }));
      }));
    }, cn.addClass = function(n) {
      return this.toggleClass(n, !0);
    }, cn.removeClass = function(n) {
      return arguments.length ? this.toggleClass(n, !1) : this.attr("class", "");
    }, dn.unique = y, cn.add = function(n, e) {
      return dn(y(this.get().concat(dn(n, e).get())));
    };
    let un = /^--/, mn = {}, hn = O.style, gn = [ "webkit", "moz", "ms" ], bn = {
      animationIterationCount: !0,
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
      widows: !0,
      zIndex: !0
    };
    cn.css = function(n, e) {
      if (p(n)) {
        let t = _(n);
        return n = k(n, t), 2 > arguments.length ? this[0] && x(this[0], n, t) : n ? (e = S(n, e, t),
        this.each((function(i, o) {
          c(o) && (t ? o.style.setProperty(n, e) : o.style[n] = e);
        }))) : this;
      }
      for (let e in n) this.css(e, n[e]);
      return this;
    };
    let vn = /^\s+|\s+$/;
    cn.data = function(n, e) {
      if (!n) {
        if (!this[0]) return;
        let n = {};
        for (let e in this[0].dataset) n[e] = j(this[0], e);
        return n;
      }
      if (p(n)) return 2 > arguments.length ? this[0] && j(this[0], n) : f(e) ? this : this.each((function(t, i) {
        I(i, n, e);
      }));
      for (let e in n) this.data(e, n[e]);
      return this;
    }, i([ !0, !1 ], (function(n, e) {
      i([ "Width", "Height" ], (function(n, t) {
        cn[(e ? "outer" : "inner") + t] = function(i) {
          return this[0] ? s(this[0]) ? e ? this[0]["inner" + t] : this[0].document.documentElement["client" + t] : l(this[0]) ? $(this[0], t) : this[0][(e ? "offset" : "client") + t] + (i && e ? w(this[0], "margin" + (n ? "Top" : "Left")) + w(this[0], "margin" + (n ? "Bottom" : "Right")) : 0) : void 0;
        };
      }));
    })), i([ "Width", "Height" ], (function(n, e) {
      let t = e.toLowerCase();
      cn[t] = function(i) {
        if (!this[0]) return f(i) ? void 0 : this;
        if (!arguments.length) return s(this[0]) ? this[0].document.documentElement["client" + e] : l(this[0]) ? $(this[0], e) : this[0].getBoundingClientRect()[t] - C(this[0], !n);
        let o = parseInt(i, 10);
        return this.each((function(e, i) {
          if (c(i)) {
            let e = x(i, "boxSizing");
            i.style[t] = S(t, o + ("border-box" === e ? C(i, !n) : 0));
          }
        }));
      };
    }));
    let yn = {};
    cn.toggle = function(n) {
      return this.each((function(e, t) {
        if (c(t)) {
          (f(n) ? A(t) : n) ? (t.style.display = t.___cd || "", A(t) && (t.style.display = function(n) {
            if (yn[n]) return yn[n];
            let e = H(n);
            F.body.insertBefore(e, null);
            let t = x(e, "display");
            return F.body.removeChild(e), yn[n] = "none" === t ? "block" : t;
          }(t.tagName))) : (t.___cd = x(t, "display"), t.style.display = "none");
        }
      }));
    }, cn.hide = function() {
      return this.toggle(!1);
    }, cn.show = function() {
      return this.toggle(!0);
    };
    let xn = "___ce", wn = ".", _n = {
      focus: "focusin",
      blur: "focusout"
    }, kn = {
      mouseenter: "mouseover",
      mouseleave: "mouseout"
    };
    cn.off = function(n, e, t) {
      let o = this;
      if (f(n)) this.each((function(n, e) {
        (c(e) || l(e) || s(e)) && P(e);
      })); else if (p(n)) d(e) && (t = e, e = ""), i(b(n), (function(n, i) {
        let a = M(i), r = a[0], d = a[1], p = T(r);
        o.each((function(n, i) {
          (c(i) || l(i) || s(i)) && (P(i, p, d, e, t), r !== p && P(i, r, d, e, t));
        }));
      })); else for (let e in n) this.off(e, n[e]);
      return this;
    }, cn.on = function(n, e, t, o, r) {
      let m = this;
      if (!p(n)) {
        for (let i in n) this.on(i, e, t, n[i], r);
        return this;
      }
      return p(e) || (f(e) || u(e) ? e = "" : f(t) ? (t = e, e = "") : (o = t, t = e,
      e = "")), d(o) || (o = t, t = void 0), o ? (i(b(n), (function(n, i) {
        let d = M(i), p = d[0], f = d[1], u = T(p), h = p !== u, g = p in _n;
        u && m.each((function(n, i) {
          if (c(i) || l(i) || s(i)) {
            let n = function n(s) {
              if (h && (s.___ot ? s.___ot !== p : s.type !== p || s.target["___i" + p] && (delete s.target["___i" + p],
              s.stopImmediatePropagation(), 1))) return;
              if (s.namespace && !U(f, s.namespace.split(wn))) return;
              let l = i;
              if (e) {
                let n = s.target;
                for (;!a(n, e); ) {
                  if (n === i) return;
                  if (n = n.parentNode, !n) return;
                }
                l = n, s.___cd = !0;
              } else if (g && s.___ot === p && i !== s.target && i.contains(s.target)) return;
              s.___cd && Object.defineProperty(s, "currentTarget", {
                configurable: !0,
                get: function() {
                  return l;
                }
              }), Object.defineProperty(s, "data", {
                configurable: !0,
                get: function() {
                  return t;
                }
              });
              let c = o.call(l, s, s.___td);
              r && P(i, u, f, e, n), !1 === c && (s.preventDefault(), s.stopPropagation());
            };
            n.guid = o.guid = o.guid || dn.guid++, z(i, u, f, e, n), h && z(i, p, f, e, n);
          }
        }));
      })), this) : this;
    }, cn.one = function(n, e, t, i) {
      return this.on(n, e, t, i, !0);
    }, cn.ready = function(n) {
      let e = function() {
        return setTimeout(n, 0, dn);
      };
      return "loading" === F.readyState ? F.addEventListener("DOMContentLoaded", e) : e(),
      this;
    }, cn.trigger = function(n, e) {
      if (p(n)) {
        let e = M(n), t = e[0], i = e[1], o = T(t);
        if (!o) return this;
        let a = /^(mouse|pointer|contextmenu|drag|drop|click|dblclick)/i.test(o) ? "MouseEvents" : "HTMLEvents";
        (n = F.createEvent(a)).initEvent(o, !0, !0), n.namespace = i.join(wn), n.___ot = t;
      }
      n.___td = e;
      let t = n.___ot in _n;
      return this.each((function(e, i) {
        t && d(i[n.___ot]) && (i["___i" + n.___ot] = !0, i[n.___ot]()), i.dispatchEvent(n);
      }));
    };
    let Sn = /%20/g, jn = /\r?\n/g, In = /radio|checkbox/i;
    cn.serialize = function() {
      let n = "";
      return this.each((function(e, t) {
        i(t.elements || [ t ], (function(e, t) {
          if (!(t.disabled || !t.name || "FIELDSET" === t.tagName || /file|reset|submit|button|image/i.test(t.type) || In.test(t.type) && !t.checked)) {
            let e = E(t);
            if (!f(e)) {
              i(J(e) ? e : [ e ], (function(e, i) {
                n += function(n, e) {
                  return "&" + encodeURIComponent(n) + "=" + encodeURIComponent(e.replace(jn, "\r\n")).replace(Sn, "+");
                }(t.name, i);
              }));
            }
          }
        }));
      })), n.slice(1);
    }, cn.val = function(n) {
      return arguments.length ? this.each((function(e, t) {
        let o = t.multiple && t.options;
        if (o || In.test(t.type)) {
          let e = J(n) ? nn.call(n, String) : u(n) ? [] : [ n + "" ];
          o ? i(t.options, (function(n, t) {
            t.selected = 0 <= e.indexOf(t.value);
          }), !0) : t.checked = 0 <= e.indexOf(t.value);
        } else t.value = f(n) || u(n) ? "" : n;
      })) : this[0] && E(this[0]);
    }, cn.clone = function() {
      return this.map((function(n, e) {
        return e.cloneNode(!0);
      }));
    }, cn.detach = function(n) {
      return g(this, n).each((function(n, e) {
        e.parentNode && e.parentNode.removeChild(e);
      })), this;
    };
    let $n = /^\s*<(\w+)[^>]*>/, Cn = /^<(\w+)\s*\/?>(?:<\/\1>)?$/, An = {
      "*": O,
      tr: W,
      td: X,
      th: X,
      thead: B,
      tbody: B,
      tfoot: B
    };
    dn.parseHTML = V, cn.empty = function() {
      return this.each((function(n, e) {
        for (;e.firstChild; ) e.removeChild(e.firstChild);
      }));
    }, cn.html = function(n) {
      return arguments.length ? f(n) ? this : this.each((function(e, t) {
        c(t) && (t.innerHTML = n);
      })) : this[0] && this[0].innerHTML;
    }, cn.remove = function(n) {
      return g(this, n).detach().off(), this;
    }, cn.text = function(n) {
      return f(n) ? this[0] ? this[0].textContent : "" : this.each((function(e, t) {
        c(t) && (t.textContent = n);
      }));
    }, cn.unwrap = function() {
      return this.parent().each((function(n, e) {
        if ("BODY" !== e.tagName) {
          let n = dn(e);
          n.replaceWith(n.children());
        }
      })), this;
    }, cn.offset = function() {
      let n = this[0];
      if (n) {
        let e = n.getBoundingClientRect();
        return {
          top: e.top + L.pageYOffset,
          left: e.left + L.pageXOffset
        };
      }
    }, cn.offsetParent = function() {
      return this.map((function(n, e) {
        let t = e.offsetParent;
        for (;t && "static" === x(t, "position"); ) t = t.offsetParent;
        return t || G;
      }));
    }, cn.position = function() {
      let n = this[0];
      if (n) {
        let e = "fixed" === x(n, "position"), t = e ? n.getBoundingClientRect() : this.offset();
        if (!e) {
          let e = n.ownerDocument, i = n.offsetParent || e.documentElement;
          for (;(i === e.body || i === e.documentElement) && "static" === x(i, "position"); ) i = i.parentNode;
          if (i !== n && c(i)) {
            let n = dn(i).offset();
            t.top -= n.top + w(i, "borderTopWidth"), t.left -= n.left + w(i, "borderLeftWidth");
          }
        }
        return {
          top: t.top - w(n, "marginTop"),
          left: t.left - w(n, "marginLeft")
        };
      }
    }, cn.children = function(n) {
      return g(dn(y(v(this, (function(n) {
        return n.children;
      })))), n);
    }, cn.contents = function() {
      return dn(y(v(this, (function(n) {
        return "IFRAME" === n.tagName ? [ n.contentDocument ] : "TEMPLATE" === n.tagName ? n.content.childNodes : n.childNodes;
      }))));
    }, cn.find = function(n) {
      return dn(y(v(this, (function(t) {
        return e(n, t);
      }))));
    };
    let Un = /^\s*<!(?:\[CDATA\[|--)|(?:\]\]|--)>\s*$/g, Tn = /^$|^module$|\/(java|ecma)script/i, qn = [ "type", "src", "nonce", "noModule" ];
    return cn.after = function() {
      return R(arguments, this, !1, !1, !1, !0, !0);
    }, cn.append = function() {
      return R(arguments, this, !1, !1, !0);
    }, cn.appendTo = function() {
      return R(arguments, this, !0, !1, !0);
    }, cn.before = function() {
      return R(arguments, this, !1, !0);
    }, cn.insertAfter = function() {
      return R(arguments, this, !0, !1, !1, !1, !1, !0);
    }, cn.insertBefore = function() {
      return R(arguments, this, !0, !0);
    }, cn.prepend = function() {
      return R(arguments, this, !1, !0, !0, !0, !0);
    }, cn.prependTo = function() {
      return R(arguments, this, !0, !0, !0, !1, !1, !0);
    }, cn.replaceWith = function(n) {
      return this.before(n).remove();
    }, cn.replaceAll = function(n) {
      return dn(n).replaceWith(this), this;
    }, cn.wrapAll = function(n) {
      let e = dn(n), t = e[0];
      for (;t.children.length; ) t = t.firstElementChild;
      return this.first().before(e), this.appendTo(t);
    }, cn.wrap = function(n) {
      return this.each((function(e, t) {
        let i = dn(n)[0];
        dn(t).wrapAll(e ? i.cloneNode(!0) : i);
      }));
    }, cn.wrapInner = function(n) {
      return this.each((function(e, t) {
        let i = dn(t), o = i.contents();
        o.length ? o.wrapAll(n) : i.append(n);
      }));
    }, cn.has = function(n) {
      let t = p(n) ? function(t, i) {
        return e(n, i).length;
      } : function(e, t) {
        return t.contains(n);
      };
      return this.filter(t);
    }, cn.is = function(n) {
      let e = h(n);
      return on.call(this, (function(n, t) {
        return e.call(n, t, n);
      }));
    }, cn.next = function(n, e, t) {
      return g(dn(y(v(this, "nextElementSibling", e, t))), n);
    }, cn.nextAll = function(n) {
      return this.next(n, !0);
    }, cn.nextUntil = function(n, e) {
      return this.next(e, !0, n);
    }, cn.not = function(n) {
      let e = h(n);
      return this.filter((function(t, i) {
        return (!p(n) || c(i)) && !e.call(i, t, i);
      }));
    }, cn.parent = function(n) {
      return g(dn(y(v(this, "parentNode"))), n);
    }, cn.index = function(n) {
      let e = n ? dn(n)[0] : this[0], t = n ? this : dn(e).parent().children();
      return Y.call(t, e);
    }, cn.closest = function(n) {
      let e = this.filter(n);
      if (e.length) return e;
      let t = this.parent();
      return t.length ? t.closest(n) : e;
    }, cn.parents = function(n, e) {
      return g(dn(y(v(this, "parentElement", !0, e))), n);
    }, cn.parentsUntil = function(n, e) {
      return this.parents(e, n);
    }, cn.prev = function(n, e, t) {
      return g(dn(y(v(this, "previousElementSibling", e, t))), n);
    }, cn.prevAll = function(n) {
      return this.prev(n, !0);
    }, cn.prevUntil = function(n, e) {
      return this.prev(e, !0, n);
    }, cn.siblings = function(n) {
      return g(dn(y(v(this, (function(n) {
        return dn(n).parent().children().not(n);
      })))), n);
    }, dn;
  }
  function waitToRun(n, e) {
    let t = 2 < arguments.length && void 0 !== arguments[2] ? arguments[2] : 0;
    const i = n instanceof Function ? n() : 0 < $(n).length;
    return i ? void (e instanceof Function && e(i)) : void (100 < t || setTimeout((function() {
      waitToRun(n, e, t + 1);
    }), 100));
  }
  function $$(n, e) {
    return new Promise((function(t) {
      waitToRun(n, (function(n) {
        e instanceof Function && e(n), t(n);
      }));
    }));
  }
  function emitter(n) {
    return n = n || Object.create(null), {
      on(e, t) {
        (n[e] || (n[e] = [])).push(t);
      },
      off(e, t) {
        n[e] && n[e].splice(n[e].indexOf(t) >>> 0, 1);
      },
      emit(e, t) {
        (n[e] || []).slice().map((function(n) {
          n(t);
        })), (n["*"] || []).slice().map((function(n) {
          n(e, t);
        }));
      }
    };
  }
  function getCdnImageUrl(n) {
    return "https://p.pstatp.com/origin/" + n;
  }
  function uuid() {
    let n = 0 | 46656 * Math.random(), e = 0 | 46656 * Math.random();
    return n = ("000" + n.toString(36)).slice(-2), e = ("000" + e.toString(36)).slice(-3),
    "o" + n + e;
  }
  function delay(n) {
    return new Promise((function(e) {
      setTimeout((function() {
        e();
      }), n);
    }));
  }
  function getKeywordFromUrl(n, e) {
    const t = (e || location.href).match(n || CommonSearchKeywordRegex);
    return t ? decodeURIComponent((n ? t[1] || t[2] : t[2] || t[4]) || "") : "";
  }
  function purifyKeyword(n) {
    return (PurifyKeywordRegex ? n.replace(PurifyKeywordRegex, "") || (n.startsWith("第") ? "" : n) : n).replace(/\s*:\s*$/, "").replace(/\s*([粤英日]语|\[.语\])\s*$/, "").replace(/(.*\S.*)\(.*\)\s*$/, "$1").replace(/.*《(.+)》.*/, "$1").replace(/\s+(bd|hd|\d+p)\s*$/i, "").replace(/[:：]\s*$/, "").trim();
  }
  function getVideoInfo(n) {
    return {
      src: n.src,
      duration: n.duration,
      paused: n.paused,
      currentTime: n.currentTime,
      playbackRate: n.playbackRate
    };
  }
  function skipAdVideo(n) {
    let e = !!(1 < arguments.length && void 0 !== arguments[1]) && arguments[1];
    "string" == typeof n && (n = document.querySelector(n)), n && 0 !== n.duration && (n.currentTime,
    91 > n.duration ? (n.playbackRate = 16, n.skipAd = !0, 0 < n.currentTime && n.currentTime < n.duration - 1 && (n.currentTime = n.duration)) : e && n.skipAd && (n.muted = !1,
    n.playbackRate = 1, .01 >= n.volume && (n.volume = .4)));
  }
  function skipAdVideoWrapper(n) {
    if (!isSkipAdVideo) return;
    let e = !1, t = 0;
    const i = setInterval((function() {
      if (document.querySelector(".o--player") || 600 < t) {
        $(".o--skip-ad").addClass("o--hide");
        const n = document.querySelector("video");
        return n && (n.muted = !1, n.playbackRate = 1, .01 >= n.volume && (n.volume = .4)),
        clearInterval(i);
      }
      e = !1, $("video[src]").each((function(n, t) {
        0 < t.duration && 91 > t.duration && !t.paused && (e = !0);
      })), e ? (t = 0, n()) : (t += 1, $(".o--skip-ad").addClass("o--hide"));
    }), 200);
  }
  function toggleSkipAdTip(n) {
    let e = 1 < arguments.length && void 0 !== arguments[1] ? arguments[1] : "append";
    document.querySelector(".o--skip-ad") ? $(".o--skip-ad").removeClass("o--hide") : $(n)[e](Skip_Ad_Html);
  }
  function smartCollapse(n) {
    let e = 0, t = !1;
    $(n).each((function(n, i) {
      n < collapseNum ? n >= collapseNum - 1 && (e = $(i).position().top) : t || e !== $(i).position().top ? (t = !0,
      $(i).prev("").addClass("is-collapse")) : !t && $(i).hasClass("o--collapse") && $(i).addClass("is-collapse");
    })), $(n).parent().addClass("o--collapse-box"), $(".o--collapse").off("click").on("click", (function() {
      $(this).parent().toggleClass("is-open");
    }));
  }
  function fixM3u8Playing() {
    function n(n) {
      n.from = Href, n.origin = Href, n.url = i, isNotTop && window.parent.postMessage(Object.assign({}, n, {
        _id: MESSAGE_ID,
        action: "log",
        parent: !0
      }), "*");
    }
    const e = Date.now();
    let t, i;
    const o = setInterval((function() {
      const a = Date.now() - e;
      i = "", t = document.querySelector("video[src]"), t && (i = t.src), /(\.m3u8|\/m3u8play)[^\/]*$/.test(i) ? (clearInterval(o),
      setTimeout((async function() {
        if (0 === t.readyState) {
          let e = getGlobal("Hls");
          if (e || (await addJs("/hls.js/0.13.2/hls.min.js"), e = getGlobal("Hls")), e.isSupported()) {
            t.pause();
            const o = new e;
            o.loadSource(i), o.attachMedia(t), o.on(e.Events.MANIFEST_PARSED, (function() {
              t.play();
            })), n({
              text: "✔ Fix m3u8 play"
            });
          }
        }
      }), 1e3)) : a >= 15e3 && (clearInterval(o), n({
        text: "× Fix m3u8 play failed"
      }));
    }), 100);
  }
  function isValidVideoUrl(n) {
    return isValidUrlRegex.test(n) && isVideoUrlRegex.test(n) && !isInvalidSniffUrlRegex.test(n);
  }
  function toSearchUrl(n, e) {
    return n.includes("**") ? n.replace("**", e) : /movie\.douban\.com\/tag/.test(n) ? n : n + e;
  }
  function parseUrl(n, e) {
    let t, i, o = n.trim().split(/[\s@]+/);
    const a = o.filter((function(n) {
      return /https?:\/\//.test(n);
    }));
    o = o.filter((function(n) {
      return !/https?:\/\//.test(n);
    })), a.forEach((function(n) {
      /\/\/m\.|\/m\/|\/\/msou/.test(n) ? t = n : i = n;
    }));
    let r = (isMobile ? t : i) || a[0];
    e && (r = toSearchUrl(r, e));
    const s = 0 < o.length ? o.join(" ") : r.match(/\/\/(.+\.)?([^\/]+)\.\w+\//)[2].replace(/^(\w)/, (function(n) {
      return n.toUpperCase();
    }));
    return {
      url: r,
      name: s
    };
  }
  function getSearchSourcesHtml(n) {
    let e = !(1 < arguments.length && void 0 !== arguments[1]) || arguments[1];
    const t = Href.match(/\/\/.*?(\w+)\.\w+\//)[1];
    return SEARCH_URLS.map((function(e) {
      const i = isVipSiteRegex.test(e.url) ? "is-vip" : isAnimeSiteRegex.test(e.url) ? "is-anime" : "", o = e.url.match(/\/\/.*?(\w+)\.\w+\//)[1];
      return e.url.includes(t) || Href.includes(o) ? "" : '<a target="_blank" class="' + i + '" ' + (_D ? 'data-weight="' + e.weight + '" ' : "") + 'href="' + toSearchUrl(e.url, n) + '">' + e.name + "</a>";
    })).join("\n") + (e && SEARCH_URLS.length > collapseNum ? '<a class="o--collapse">➢</a>' : "");
  }
  function toggleViewport() {
    let n = document.querySelector("meta[name=viewport]");
    n || (n = document.createElement("meta"), n.name = "viewport", document.getElementsByTagName("head")[0].appendChild(n));
    const e = allowScale ? "width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no" : "width=device-width, initial-scale=1.0, user-scalable=yes";
    n.setAttribute("content", e), allowScale = !allowScale;
  }
  function ensureArray(n) {
    return Array.isArray(n) ? n : n.trim().split(/[\n\s]*\n+[\n\s]*/);
  }
  function toUrlRegex(n) {
    return new RegExp(n.map((function(n) {
      return n.replace(/.+\/\/|\/.+/g, "").replace(/\./g, "\\.");
    })).join("|"));
  }
  function insertSearchAddon(n, e) {
    let t = 2 < arguments.length && void 0 !== arguments[2] ? arguments[2] : "after", i = 3 < arguments.length && void 0 !== arguments[3] ? arguments[3] : 0;
    const o = Href.includes("m.douban.com/search");
    if (!n || !o && 0 < $(".o--jump").length || 20 < i) return;
    let a, r = !1;
    return "string" == typeof e && (r = e.startsWith("-"), r && (e = e.slice(1))), a = $(e),
    0 === a.length ? void setTimeout((function() {
      insertSearchAddon(n, e, t, i + 1);
    }), 500) : (playerTitle = purifyKeyword(n), void (playerTitle && (a[r ? "last" : "first"]()[t]('<div class="o--jump">' + getSearchSourcesHtml(playerTitle, !o) + "</div>"),
    !o && smartCollapse(".o--jump a"))));
  }
  function sniffInIframe() {
    location.href === SniffCheckUrl && window.top.postMessage({
      pageInfo: pageInfo,
      _id: MESSAGE_ID,
      action: "enable.sniff",
      from: location.href
    }, "*");
    const n = Date.now(), e = setInterval((function() {
      const t = Date.now() - n;
      if (0 < $("video source[src], video[src]").length) {
        clearInterval(e), $("video, audio").each((function(n, e) {
          e.muted = !0, e.volume = 0, e.pause();
          const t = Date.now(), i = setInterval((function() {
            const n = Date.now() - t;
            e.muted = !0, e.volume = 0, e.pause(), n > 4e3 && clearInterval(i);
          }), 60);
        }));
        const n = $("video source[src]").eq(0).attr("src") || $("video[src]").eq(0).attr("src") || "";
        return n && $("video, audio").remove(), /^\/[^\/]/.test(n) && (n = location.origin + n),
        void (isValidVideoUrl(n) ? window.parent.postMessage({
          pageInfo: pageInfo,
          usedTime: t,
          _id: MESSAGE_ID,
          action: "play.video",
          from: location.href,
          origin: location.href,
          url: n.trim(),
          parent: !0
        }, "*") : /^blob:/.test(n) ? window.parent.postMessage({
          pageInfo: pageInfo,
          usedTime: t,
          _id: MESSAGE_ID,
          action: "sniff.blob",
          from: location.href,
          origin: location.href,
          url: n,
          parent: !0
        }, "*") : window.parent.postMessage({
          pageInfo: pageInfo,
          usedTime: t,
          text: "NOT MATCH VIDEO URL",
          _id: MESSAGE_ID,
          action: "log",
          from: location.href,
          origin: location.href,
          url: n,
          parent: !0
        }, "*"));
      }
      const i = document.querySelector("iframe[src]");
      if (i) {
        const n = i.scr, e = decodeURIComponent(n).match(/=(http[^&=]+\.(m3u8|mp4))/);
        (/dplayer/.test(n) || isVideoUrlRegex.test(n)) && window.parent.postMessage({
          pageInfo: pageInfo,
          usedTime: t,
          text: "iframe player url",
          _id: MESSAGE_ID,
          action: "log",
          from: location.href,
          origin: location.href,
          url: e ? e[1] : n,
          isMatch: e && isValidVideoUrl(e[1]),
          parent: !0
        }, "*"), e && isValidVideoUrl(e[1]) && ($("iframe").remove(), window.parent.postMessage({
          pageInfo: pageInfo,
          usedTime: t,
          _id: MESSAGE_ID,
          action: "play.video",
          from: location.href,
          origin: location.href,
          url: e[1].trim(),
          parent: !0
        }, "*"));
      }
      if (4e3 <= t && i) return void clearInterval(e);
      const o = 0 < $("video").length;
      (t >= 3e4 || 2e3 <= t && o) && (clearInterval(e), window.parent.postMessage({
        pageInfo: pageInfo,
        usedTime: t,
        hasVideo: o,
        hasIframe: !!i,
        _id: MESSAGE_ID,
        action: "sniff.fail",
        from: location.href,
        origin: location.href,
        parent: !0
      }, "*"));
    }), 100);
  }
  let Href = location.href;
  if (Is(/cookie.html/) || Is(/m\.le\.com/) && IsNot(/m.le.com\/search|so.le.com\/s|\.le\.com\/(ptv\/vplay\/|vplay_)/)) return;
  const isTop = window.top === window.self, isNotTop = !isTop;
  if (isTop && Is(/vwecam.tc.qq.com|\.titan.mgtv.com/) && !document.querySelector("video")) return void (IsNot(/miying/) && (location.href = Href + (Href.includes("?") ? "&" : "?") + "miying=" + (new Date).getFullYear()));
  const PLUGIN_ATTR = "miying", PLUGIN_NAME = "觅影", OO_SIGN = "(o˘◡˘o)", $html = document.getElementsByTagName("html")[0];
  if ($html.getAttribute("miying") === PLUGIN_NAME) return;
  $html.setAttribute("miying", PLUGIN_NAME);
  const _D = !1, VERSION = "20.6.13", hasUnsafeWindow = "undefined" != typeof unsafeWindow, isGM = "undefined" != typeof GM && hasUnsafeWindow;
  let logsDom;
  const screenWidth = window.screen.width, isMobile = 600 >= screenWidth || /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) || !1, storePrefix = "觅影.", Store = {
    get(n) {
      let e = 1 < arguments.length && void 0 !== arguments[1] ? arguments[1] : null;
      return parseStoreData(window.localStorage.getItem(storePrefix + n), e);
    },
    set(n) {
      let e = 1 < arguments.length && void 0 !== arguments[1] ? arguments[1] : null;
      window.localStorage.setItem(storePrefix + n, JSON.stringify(e));
    },
    remove(n) {
      window.localStorage.removeItem(storePrefix + n);
    }
  }, GlobalStore = {
    get(n) {
      let e = 1 < arguments.length && void 0 !== arguments[1] ? arguments[1] : null;
      return isGM ? parseStoreData(GM_getValue(storePrefix + n, e), e) : Store.get(n, e);
    },
    set(n) {
      let e = 1 < arguments.length && void 0 !== arguments[1] ? arguments[1] : null;
      isGM ? GM_setValue(storePrefix + n, JSON.stringify(e)) : Store.set(n, e);
    },
    remove(n) {
      isGM ? GM_deleteValue(n) : Store.remove(n);
    }
  }, $ = get$(), MAX_Z_INDEX = 2147483647, MESSAGE_ID = PLUGIN_NAME, PurifyStyle = "\ndisplay: none !important;visibility: hidden !important;width: 0 !important;height: 0 !important;max-width: 0 !important;max-height: 0 !important;overflow: hidden !important;position: absolute !important;left: -99999px !important;opacity: 0 !important;pointer-events: none !important;", day = new Date, SniffCheckUrl = getCdnImageUrl("fe23000139a023cedc4c"), PlayerPlayingCovers = "fe8d0001e71b421af470;fe9d0001a23fa4ba12e6;febc0001f7dca601acaa;fed8000143c1c9977f0a;fedd0001f8dbf113a9e4;ff15000173e7a91b2bdf;ff1800015827bd5a70fc;ff19000149336b0edadc;ff3400021ad5dc99bcba;ff810001019d7b986cd3;ff980000a0bdd0ffac71;ffa00002c7b08703a79c".trim().split(/;/), PlayerPlayingCover = getCdnImageUrl(PlayerPlayingCovers[(day.getDay() + day.getHours()) % PlayerPlayingCovers.length]), PlayerLoadingCovers = "1000000008c00c6f9096f;10003000093941116d81a;dc0e00062b2c5eb493bd;dc0f00054064f8c380f5;dc1000045c075dd30656;dc110005e8b72a1ce583;fe2300013baa4cde2890;fe2f000129d006c2a139;fe34000135a421254486;fe360001ec336a96d0bc;fe3b0000eb53f8449038;fe3c00015043d37d7be5;fe42000218b9f7f5a55b;fe42000218c5f11c2ed9;fe430001043448994846;fe460000b3fae6aa1bb1;fe4d00010cf5c48c9b6b;fe510000f1fb19801e38;fe5f000154a794261138;fe630001b222d8a6eb7e;fe6d000226452faaf640;fe720001f24f9e93046f;fe7a00015706929e1d37;fe7d0002548cfd1152bb;fe8b0001c2706bfe3e77;fe8f00027fdd79dda7fd;fe960001b1ea0aa7e463;fea40002bfaa57d0ede4;fea6000127426b4d3bda;fea70000881c53694724;fea80002b0fd162e79fa;fea900012ca6c49d658e;feaa0002c59ed8a9dedf;fead000117ca9fd25054;feb000014b98fae777af;feb000014e2c84228ef9;feb100014198ca804c96;feb3000155028619db92;feb90000fab0c934c7cc;febc000164174a579b12;fec500013cb3f2492087;fec6000146799db82ddc;fec8000107f04dd9bea1;fece000145c7e8ab38ac;fecf0001f1c37ba62e0a;fed20001d74b7e6ef17c;fedb0000b2fb0630d6ec;fee10000fcf9e0f8a0ea;fee20000cbfe1d94035a;fee20000cbff18b0fa78;fee90001664117078084;fef500022fa8b5e54884;fef900011ed65de1bf72;fefa0000c8f25fbf889b;fefd000255b6928f4a32;ff000001080380c127ab;ff000001576d6d164dd5;ff08000171884e2e46c0;ff080001718cebbe8501;ff080001718eb948b1b4;ff1300010f3da17290d5;ff160001cb3fcc952e68;ff1700009db11e2d3555;ff1c00011675a444a9af;ff2400017249d15b1b83;ff250001a8dc0c4b1e37;ff2600020854079038ec;ff270001ec2048e95669;ff280001b41f37c4f5ac;ff2d0000c217f776cd0f;ff2f0003a17605741222;ff32000120ffbfa379d7;ff33000098bc3e5c764e;ff360000b232c77947c5;ff44000292bbf8164af2;ff55000105c2c5f00b6a;ff5e00017f49a36b2736;ff5e00018310eb5829ca;ff640000e2bd55b26e27;ff650001343066b7a407;ff6a0001f3bb184d6b00;ff7300009d5dbef7f5eb;ff7300009d5fb1c0a7ea;ff77000188c8c124297d;ff8d00018e87f58fcbec;ff940001c74763521d5e;ff960000c1e181a4de0e;ff980000c0a203eb34bb;ff9a0001c79480443798;ffa00001c50ada56505b;ffa40000e75742e72d7c;ffa40000e931066afc47;ffa90000e7d6f9c8319e;ffad0001246ecc8dc1c6;ffba00017bed9148a744;ffca0000bb9fb5e59f1f;ffcc0000de1c18886223;ffcd00017ed0bd476aaf;ffd1000086050c452015;ffd2000090b39567fed5;ffd4000133a992d6feaa;ffd50000a6a3c08f2f65;ffd70000ef199c32dc7b;ffdb0000848a6ac113f5;ffe20001218b3ce6ccff;ffe30000a3fc4e84210c;ffe90000daf1b7bf726d;ffec00017021c028b3fd;fff40000e4f8f277a6bd;fff90001a7d7337447cf".trim().split(/;/), isValidUrlRegex = /^(http|\/\/)/, isVideoUrlRegex = /\.(mp4|m3u8|3gp|wmv|flv|avi|rmvb|m4v)|m3u8play.php/, videoExtRegex = /(mp4|m3u8|3gp|wmv|flv|avi|rmvb|m4v)/, shortVideoUrlRegex = /\/\/([^\/]+)\/(.*\/)?([^\/]+)\.(mp4|m3u8|3gp|wmv|flv|avi|rmvb|m4v)/, shortVideoUrlLoseRegex = /\/\/([^\/]+)\/(.*[^\/])\/?(mp4|m3u8|3gp|wmv|flv|avi|rmvb|m4v)/, isOnlyDownloadVideoUrlRegex = /.titan.mgtv.com/, isInvalidSniffUrlRegex = /btrace.video.qq.com|lmsjy.qq.com|vlive.qqvideo.tc.qq.com|qzonestyle.gtimg.cn|img.baidu.com|dplayer\/\w+.mp4|vip.fwwmy1.cn|com-t-iqiyi.com|hz189cloud.oos-hz.ctyunapi.cn|video.da.mgtv.com|(titan.mgtv.com|cdn.oss-cn.aliyuncs.com.gms-lighting.com).+m3u8|jieshuo-okzy.com|manhoo.cn|\/{3}|\.(js|css)/, PurifyKeywordRegex = /.*《|》.*|[-\s]*第.{1,3}[季集话部].*|\s+\d{2,3}\s*$/g, CommonSearchKeywordRegex = /(wd|key|keyword|searchword|query|kw|q|searchstr)=([^&\?\/\.-]+)|(search\/|seacher-|q_)([^&\?\/\.-]+)/i, collapseNum = isMobile ? 8 : 12;
  let ooPlayUrl = "", isSkipAdVideo = Store.get("isSkipAdVideo", !0), SEARCH_URLS = "豆瓣  https://search.douban.com/movie/subject_search?search_text=**  https://m.douban.com/search/?type=movie&query=**\n\n腾讯  https://m.v.qq.com/search.html?act=0&keyWord=**   https://v.qq.com/x/search/?q=**\n\n爱奇艺  https://m.iqiyi.com/search.html?source=default&key=**  https://so.iqiyi.com/so/q_**\n\n优酷  https://search.youku.com/search_video?keyword=**  https://so.youku.com/search_video/q_**\n\n芒果  https://m.mgtv.com/so?k=**  https://so.mgtv.com/so?k=**\n\n1905  https://vip.1905.com/Search?q=**\n\n搜狐  https://m.tv.sohu.com/upload/h5/m/mso.html?key=**  https://so.tv.sohu.com/mts?wd=**\n\n1080  https://www.k1080.net/vodsearch/-------------.html?wd=**\n\n1090  https://1090ys.com/?c=search&sort=addtime&order=desc&page=1&wd=**\n\n完美  https://www.wanmeikk.me/so/-------------.html?wd=**\n\n在线  https://www.zxzj.me/vodsearch/-------------.html?wd=**\n\n神马  https://www.shenma4480.com/search/-------------/?wd=**\n\n飞极速  http://m.feijisu8.com/search/**  http://feijisu8.com/search/**\n\n真不卡  https://www.zhenbuka.com/vod/search/page/1/wd/**/\n\n碟影  https://dvdhd.me/search.php?searchword=**\n\n美剧  https://91mjw.com/?s=**\n\nTVB  https://www.hktvyb.com/vod/search.html?wd=**\n\n茶杯狐  https://www.cupfox.com/search?key=**\n\n哔哩哔哩  https://m.bilibili.com/search?keyword=**  https://search.bilibili.com/all?keyword=**\n\n迅播  https://www.xbdm.org/search.php?searchword=**\n\nZzzFun  http://www.zzzfun.com/vod-search.html?wd=**\n\n妮可  http://www.nicotv.me/video/search/**.html\n\nAGE  https://www.agefans.tv/search?page=1&query=**\n\nQinmei  https://qinmei.video/search/?type=queryAnimate&keyword=**  https://m.qinmei.video/search?type=queryAnimate&keyword=**\n\n哆咪  http://www.duomimh.com/dongmansearch.html?wd=**\n\n次元  https://cyloli.com/vodsearch/**----------1---/\n\n哔咪  http://bimibimi.me/vod/search/wd/**/page/1/\n\nMikan  https://mikanani.me/Home/Search?searchstr=**";
  const ADDONS = [ {
    name: "哔哩哔哩",
    match: ".bilibili.com",
    search: {
      match: /\/search|search\./,
      jump: "#all-list | append, .index__board__src-search-board-"
    },
    play: {
      match: /\/bangumi\/play\//,
      title: ".media-title, .ep-info-title",
      jump() {
        $$(".ep-info-image img, .media-cover img", (function() {
          const n = $(".media-title, .ep-info-title").eq(0).text();
          n && setTimeout((function() {
            insertSearchAddon(n, ".media-wrapper, .ep-list-pre-wrapper");
          }), 500);
        }));
      }
    },
    hide: ".index__openAppBtn__src-commonComponent-topArea-, .index__container__src-commonComponent-bottomOpenApp-, .bili-app, .recom-wrapper, .b-footer, .open-app-bar, .open-app-float, .more-review-wrapper, #bannerAd, .banner-card, #slide_ad"
  }, {
    name: "腾讯视频",
    match: "v.qq.com",
    search: {
      match: /\/search/,
      jump: "#result, .wrapper_main > .mod_pages"
    },
    play: {
      match: /\/(cover|play|x\/cover|x\/page|x\/play|x\/m\/cover|x\/m\/page|x\/m\/play)/,
      vip: "#vip_title, .U_box_bg_a, .player_headline, .mod_video_info",
      title: ".mod_video_info .video_title, ._main_title, .player_title",
      fixUrl(n) {
        if (n.includes("cid=")) {
          const e = n.match(/cid=(\w+)/)[1];
          let t = n.match(/vid=(\w+)/);
          return t = t ? "/" + t[1] : "", "https://v.qq.com/x/cover/" + e + t + ".html";
        }
        return n.includes("/x/cover") ? n.replace(/\.html.*/, ".html") : n;
      },
      async js() {
        if (skipAdVideoWrapper((function() {
          isMobile ? skipAdVideo(".txp_video_container video[src]", !/vlive.qqvideo.tc.qq.com/.test(video.src)) : document.querySelector(".txp_ad video[src]") && ($(".txp_ad video[src]").each((function(n, e) {
            skipAdVideo(e);
          })), toggleSkipAdTip(".txp_ad"));
        })), isMobile) {
          let n = document.querySelector("#play_sync"), e = n && n.value;
          if (!e) {
            const n = (await fetch(location.href).then((function(n) {
              return n.text();
            }))).match(/id=['"]play_sync.+?value=['"]([^'"]+)/);
            n && (e = n[1]);
          }
          e && (e = JSON.parse(decodeURIComponent(e)), console.console.log(e));
        }
      }
    },
    hide: '.mod_source, .video_function, .mod_promotion, #vip_privilege, #vip_activity, .U_bg_b, .btn_open_v, .btn_openapp, #vip_header, .btn_user_hd, .mod_sideslip_privileges, .mod_game_rec, .mod_source, .mod_promotion, .mod_sideslip_h, .btn_open, .btn_pay, .mod_box_lastview, .mod_vip_popup, .mod_vip_popup + .mask_layer, txpdiv[data-role="hd-ad-adapter-interactivelayer"], .mod_ad, .tvp_app_bar, .txp-watermark, .mod_recommend',
    css: "\nbody, #vip_title {padding-bottom: 0 !important;}.mod_episodes_numbers.is-vip .item {width: auto;padding: 0 1em;}.U_html_bg .container {padding-bottom: 30px;}.mod_play .mod_player_viptips .btn_try {left: 30%;}.mod_box .mod_video_info {margin-top: 1em;}"
  }, {
    name: "爱奇艺",
    match: ".iqiyi.com",
    search: {
      match: /\/search|so\.iqiyi/,
      jump: "-.m-box, .layout-main, .search-con-page"
    },
    play: {
      match: /\/v_/,
      vip: 'div[name="m-videoInfo"], #block-C, .o--pc .tw-play-info-wrap .tw-play-info, .o--m .tw-m-play-info .m-play-intro',
      title: "#widget-videotitle, .video-title, .c-title-link, .player-title a, .tw-play-title .drama-name, .tw-play-title",
      fixUrl: n => n.replace(/\.html.*/, ".html").replace("tw.", "www."),
      js() {
        let n = [], e = ($('[name="apple-itunes-app"]').attr("content") || "").match(/aid=\d{2,}/);
        if (e) {
          fetch("https://pcw-api.iqiyi.com/albums/album/avlistinfo?page=1&size=9999&" + e[0]).then((function(n) {
            return n.json();
          })).then((function(e) {
            n = e.data.epsodelist;
          }));
          let t = 0;
          setInterval((function() {
            let e = +($(".qy-episode-num .select-item.selected .select-link").text() || 0);
            if (e && e !== t) {
              t = e;
              let i = n[t - 1];
              if (i) {
                let n = i.playUrl.replace(/https?:/, location.protocol);
                if (n !== ooPlayUrl) {
                  const e = ooPlayUrl || location.href;
                  ooPlayUrl = n;
                  const t = ($(".qy-episode-num .select-item.selected .icon-tr img").attr("src") || "").includes("-pre-");
                  E.emit("url.change", {
                    oldUrl: e,
                    newUrl: n,
                    autoPlay: !t
                  });
                }
              }
            }
          }), 200);
        }
        if (isMobile) return;
        let t = 0;
        skipAdVideoWrapper((function() {
          if (0 === t && 0 < $(".cupid-public-time").length && "none" !== $(".cupid-public-time").css("display")) {
            getGlobal("Date").now = function() {
              return (new window.Date).getTime() + (t += 1e4);
            }, setInterval((function() {
              t = 0;
            }), 6e5);
          }
          const n = document.querySelector(".iqp-player video");
          if (n && !n.isSkip && 1 < n.readyState && 0 < $(".bottom-public").length && "none" !== $(".bottom-public").css("display")) {
            const n = document.querySelector(".skippable-after");
            n && !n.isSkipClick && (isSkipClick = !0, setTimeout((function() {
              n.click(), setTimeout((function() {
                n.isSkipClick = !1;
              }), 1e3);
            }), 1e3));
          }
        }));
      }
    },
    hide: '.m-iqyDown, .header-login + div, .m-video-action, div[name="m-vipRights"], div[name="m-extendBar"], .m-iqylink-diversion, .m-iqylink-guide, .c-openVip, .c-score-btn, .m-videoUser-spacing, .m-pp-entrance, .m-hotWords-bottom, div[template-type="ALBUM"] .m-player-tip, .iqp-box-integral, .btn-ticket, .btn-yuyue, .btn-download, .m-iqyDown, .iqp-player div[adid], .detail-sd, .scroll-anchor > *:not(:last-child), #iProgress ~ div[style]',
    css: '.page_play {padding-bottom: 0;}div[name="m-videoInfo"] {padding-top: 1em;}.m-box-items .o--album-item {border-radius: 0.05em;background-color: #e9ecef;color: #495057;padding: 0.5em 1em;display: inline-flex;justify-content: center;align-items: center;margin: 0.25em;font-weight: bold;}.m-video-player #o--player-iframe {padding-top: 56.25%;top: 50%;transform: translateY(-50%);}.qy-header .header-wrap {z-index: ' + MAX_Z_INDEX + ";}"
  }, {
    name: "优酷",
    match: /youku.com|soku.com/,
    search: {
      match: /soku.com\/m.+q=|youku.com\/search_video/,
      jump: '#bpmodule-main, .yk_result, div[class^="pagination-box"], .yk-footer | before'
    },
    play: {
      match: /youku\.com\/[av]/,
      vip: ".h5-detail-info, .player-title",
      title: ".player-title .subtitle a, .module-name h1, .anthology-title-wrap .title, .title-link",
      fixUrl: !0,
      js() {
        isMobile || (skipAdVideoWrapper((function() {
          document.querySelector(".h5-ext-layer video[src]") && ($(".h5-ext-layer video[src]").each((function(n, e) {
            e.muted = !0, e.volume = 0, skipAdVideo(e);
          })), toggleSkipAdTip(".h5-ext-layer"));
        })), $$(".h5-ext-layer video[src]", (function() {
          setTimeout((function() {
            $(".h5-ext-layer, .yk-trigger-layer").addClass("o--hide");
            let n = document.querySelector(".youku-player video");
            if (!n) return;
            n.muted = !1, .01 >= n.volume && (n.volume = .4), n.paused && n.play();
            let e = !1;
            $(".h5-layer-conatiner").css("cursor", "pointer").off("click").on("click", (function(t) {
              $(t.target).hasClass("h5-layer-conatiner") && (t.preventDefault(), t.stopImmediatePropagation(),
              e = !n.paused, setTimeout((function() {
                n.paused === e || document.querySelector(".h5player-dashboard .control-play-icon").click();
              }), 100));
            }));
          }), 1e3);
        })), $$(".quality-dashboard .youku_vip_pay_btn, .quality-dashboard .login-canuse", (function() {
          $(".quality-dashboard .youku_vip_pay_btn, .quality-dashboard .login-canuse").removeClass("youku_vip_pay_btn disable login-canuse"),
          $(".quality-item").on("click", (function() {
            setTimeout((function() {
              $(".h5player-dashboard .control-play-icon").hasClass("control-pause-icon") || $(".h5-layer-conatiner").get(0).click(),
              setTimeout((function() {
                $(".h5player-dashboard .control-play-icon").hasClass("control-pause-icon") || $(".h5-layer-conatiner").get(0).click();
              }), 1500);
            }), 1500);
          }));
        })));
      }
    },
    hide: '.h5-detail-guide, .h5-detail-ad, .brief-btm, .smartBannerBtn, .cmt-user-action, #right-title-ad-banner, .Corner-container, .youku-layer-wuliao, .qr-wrap, .quality-item[class*="p"] .vip-label, .award-pass, .iconshoucang ~ div .modal-position-container, .js-top-icon',
    css: "\n#bpmodule-playpage-lefttitle {height: auto !important;}.left-title .left-title-content-wrap {width: 100%;}.search-button-box {display: inline-block;}"
  }, {
    name: "土豆",
    match: ".tudou.com",
    play: {
      match: /\/v\//,
      vip: ".play-video-desc, .td-play__baseinfo",
      title: ".td-listbox__title, .video-desc-title",
      fixUrl: !0
    },
    hide: ".video-player-topbar, .td-h5__player__appguide, #tudou-footer, .dropdown__panel__con"
  }, {
    name: "芒果",
    match: ".mgtv.com",
    search: {
      match: /\/so/,
      jump: "#paginator, .hitv_page, -.result-box .media",
      keyword: /k[-=]([^&\?\/\.]+)/
    },
    play: {
      match: /\/[bl]\//,
      vip: [ ".xuanji | before", ".v-panel-box, .control-left" ],
      title: ".v-panel-title, .vt-txt, .m-player-open .control-left .title",
      fixUrl: !0,
      js() {
        let n;
        skipAdVideoWrapper((function() {
          isMobile || (n = document.querySelector(".video video[src]")) && /video.da.mgtv.com/.test(n.src) && (skipAdVideo(n),
          toggleSkipAdTip(".video container"));
        }));
      }
    },
    hide: ".ad-banner, .video-area-bar, .video-error .btn, .m-vip-list, .m-vip-list + div:not([class]), .toapp, .video-comment .ft, .mg-app-swip, mango-plugin-ad, mango-control-tip",
    css: ".m-player-open .control-left {float: unset !important;}"
  }, {
    name: "搜狐",
    match: /(film|tv)\.sohu\.com/,
    search: {
      match: /(key|wd)=/,
      jump: ".ssMore | before, .select-container | before"
    },
    play: {
      match: /\/(v|album\/|phone_play_film|\d+\/n\d+.shtml)/,
      vip: ".title-wrap, .videoInfo, .tw-info, .player-detail, .movie-info-content",
      title: "#vinfobox h2, .t-info, .movie-t h3",
      fixUrl(n) {
        if (/phone_play_film.+channeled=/.test(n)) {
          const e = n.match(/channeled=(\w+)/)[1];
          return "https://film.sohu.com/album/" + n.match(/aid=(\w+)/)[1] + ".html?channeled=" + e;
        }
        return n;
      },
      js() {
        let n;
        skipAdVideoWrapper((function() {
          isMobile || (n = document.querySelector(".x-video-adv video[src]")) && (skipAdVideo(n),
          toggleSkipAdTip(".x-video-adv"));
        }));
      }
    },
    hide: ".actv-banner, .btn-xz-app, .twinfo_iconwrap, .btn-comment-app, #ad_banner, .advertise, .main-ad-view-box, .foot.sohu-swiper, .app-star-vbox, .app-guess-vbox, .main-rec-view-box, .app-qianfan-box, .comment-empty-bg, .copyinfo, .ph-vbox, .btn_m_action, .btn-xz-app, #film_top_banner, .btn-comment-app, .adv, .x-adv-pause-nonlinear-panel",
    css: ".comment-empty-txt {margin-bottom: 0;}.app-view-box + footer {padding: 0;opacity: 0.5;}#sohuplayer #menu {z-index: " + MAX_Z_INDEX + ";}"
  }, {
    name: "乐视",
    match: ".le.com",
    search: {
      match: /\/search|so.le.com\/s/,
      jump: ".column_tit | before, .Relate | before"
    },
    play: {
      match: /\/(ptv\/vplay\/|vplay_)/,
      vip: ".introduction_box, .briefIntro_left .info_list",
      title: ".briefIntro_info .info_tit, #j-introduction h2",
      fixUrl: !0
    },
    hide: ".gamePromotion, .gamePromotionTxt, #j-leappMore, .lbzDaoliu, .arkBox"
  }, {
    name: "咪咕",
    match: "miguvideo.com",
    search: {
      match: /search.html/,
      jump: ".search-pagination, .search-main",
      keyword: /keywords=([^&\?\/\.]+)|\?.*#([^&\?\/\.]+)/
    },
    play: {
      match: /detail.html/,
      vip: ".playerFooter, .programgroup",
      title: ".left-box .title, .episodeTitle, .video_title"
    },
    hide: '.group-item[name*="广告"], .openClient'
  }, {
    name: "PPTV",
    match: ".pptv.com",
    search: {
      match: /sou.+(kw|keyword)=/,
      jump: ".pagination, .zhengpian-box | append"
    },
    play: {
      match: /\/show\//,
      vip: ".m .cf, .vod-tit, .vod-intor",
      title: "#video-info h1, .vod-tit-in span, .tit",
      fixUrl: !0
    },
    hide: '.w-video-vastad, #video-download-game, div[class*="openapp"], div[class*="side-adv"], div[id*="afp_"], div[id*="-afp"], iframe[src*="/game/"], .afpPosition, .download-iconbar'
  }, {
    name: "华数",
    match: "wasu.cn",
    search: {
      match: /Search\/.+k=/,
      jump: "#topVod"
    },
    play: {
      match: /[pP]lay\/show\//,
      vip: ".movie_title",
      title: ".movie_title h2",
      fixUrl: !0
    },
    hide: 'div[id*="BAIDU"], .player_menu_con, body > div[style*="fixed"]'
  }, {
    name: "1905",
    match: "1905.com",
    search: {
      match: /\/search/i,
      jump: ".pagination, #new_page"
    },
    play: {
      match: /\/play/,
      vip: ".playerBox-info, #movie_info, .player-nav",
      title: "#movie_info .infoInner .title, .movie-title, .tv_title",
      fixUrl: !0
    },
    hide: "#app_store, .openMembershipBtn, body > div[id]:not([class]) > iframe, .pv2-advertisement, .open-app",
    css: "\n#movie_info {margin-top: 1em;}"
  }, {
    name: "1080影视",
    match: "k1080.net",
    search: {
      match: /wd=/,
      jump: ".myui-page, .myui-panel-box | append",
      result: ".searchkey"
    },
    play: {
      match: /\/vodplay/,
      title: ".myui-player__data h3 a, .col-pd > .myui-panel__head h3",
      jump: ".myui-player__data"
    },
    hide: "body > *:not(script) + script ~ *[id]",
    css: "\n#player-sidebar {height: auto !important;}"
  }, {
    name: "1090影视",
    match: /1090ys\d?.com/,
    search: {
      match: /c=search/,
      jump: ".stui-page, .stui-pannel",
      jumpTo: [ ".stui-vodlist__media a", /.*show\/(\d+).*/, "/play/$1~0~0.html" ],
      keyword() {
        const n = location.href.match(/wd=([^-&]+)/);
        return n ? n[1] : document.querySelector(".more + .title").textContent;
      },
      result: "h3.title a"
    },
    play: {
      match: /\/play/,
      title: "h4 font",
      jump: ".tab-content.stui-pannel_bd"
    },
    hide: ".container ~ *[id], body > .container > p[style]",
    css: "\nbody {padding-bottom: 0 !important;}"
  }, {
    name: "完美看看",
    match: "wanmeikk.me",
    search: {
      match: /\/so\//,
      jump: ".stui-page, .stui-pannel",
      jumpTo: [ ".stui-vodlist__media a", /.*project\/(\d+).*/, "/play/$1-1-1.html" ],
      result: "h3.title a"
    },
    play: {
      match: /\/play/,
      title: "h1 a",
      jump: "-.playlist"
    },
    hide: ".container ~ *[id]"
  }, {
    name: "在线之家",
    match: "zxzj.me",
    search: {
      match: /wd=/,
      jump: ".stui-pannel__ft",
      jumpTo: [ ".stui-vodlist a", /.*detail\/(\d+).*/, "/video/$1-1-1.html" ],
      result: ".stui-vodlist .title a"
    },
    play: {
      match: /\/video/,
      title: "h1",
      jump: ".stui-player"
    },
    hide: 'body > div[class^="AD"], body > *:not(script) + script ~ *[id]'
  }, {
    name: "91美剧",
    match: "91mjw.com",
    search: {
      match: /s=/,
      keyword: /s=(.+)/,
      jump: ".list-content | append",
      result: {
        title: ".m-movies .u-movie h2",
        url: ".m-movies .u-movie a"
      }
    },
    play: {
      match: /\/vplay/,
      title: ".vtitle a",
      jump: ".mgplaylist"
    },
    hide: "body > *:not(script) + script ~ *[id], div:not([id]) > iframe, a > iframe, .ads"
  }, {
    name: "哔滴",
    match: "bde4.com",
    disable: !0,
    search: {
      match: /\/search/,
      jump: ".search-list",
      result: "a.header"
    },
    play: {
      match: /\/play/,
      title: ".player-wrapper + .container a + a",
      jump: ".player-wrapper + .container"
    },
    hide: "body::after, body > *:not(script) + script ~ *[id]"
  }, {
    name: "神马",
    match: "shenma4480.com",
    search: {
      match: /\/search/,
      jump: ".stui-page, .stui-pannel",
      jumpTo: [ ".stui-vodlist a", /.*detail\/(\d+).*/, "/play/$1-1-1/" ],
      result: ".stui-vodlist__title a"
    },
    play: {
      match: /\/play/,
      title: "h1 a",
      jump: "-.stui-pannel | before"
    }
  }, {
    name: "TVB",
    match: "hktvyb.com",
    search: {
      match: /\/search/,
      jump: ".myui-page, .myui-pannel_bd | before, .myui-panel | append",
      jumpTo: [ "#searchList a", /.*detail\/id\/(\d+).*/, "/vod/play/id/$1/sid/1/nid/1.html" ],
      result: ".searchkey"
    },
    play: {
      match: /\/vod\/play/,
      title: "h3 a",
      jump: ".myui-panel-box"
    },
    hide: "body > iframe, body > div[style]:not([class]), body > div[id]:not([class]), .myui-panel ~ div[id], .nav-menu > .hidden-md, script + a[id], a[id] + div[style]:not([class])",
    css: "\nbody {padding-top: 60px !important;}"
  }, {
    name: "飞极速",
    match: "feijisu8.com",
    search: {
      match: /\/search/,
      jump: "#result",
      jumpTo: [ "#result a", /\/$/, "/1.html" ],
      result: "#result h2 a"
    },
    play: {
      match: /acg\/\d+\/\d+/,
      title: "h1 a",
      jump: ".midbar, .footer | before"
    },
    hide: ".index-top ~ div, .v-top ~ div, .footer ~ div, .footer ~ brde, body > div:not([class])"
  }, {
    name: "真不卡",
    match: "zhenbuka.com",
    search: {
      match: /\/search/,
      jump: ".stui-page, .stui-pannel",
      jumpTo: [ ".stui-vodlist__media a", /.*voddetail\/(\d+).*/, "/vodplay/$1-1-1/" ],
      keyword() {
        const n = location.href.match(/wd\/([^\/]+)/);
        return n ? n[1] : document.querySelector("h3").textContent;
      },
      result: ".stui-vodlist__media h3.title a"
    },
    play: {
      match: /\/vodplay/,
      title: ".detail h1",
      jump: "-.playlist"
    },
    hide: "body > div[id]:not([class]), .stui-player__item ~ div[style]"
  }, {
    name: "碟影",
    match: /dvdhd.me|952780.com/,
    search: {
      match: /\/search/,
      jump: ".list-content",
      jumpTo: [ ".list-content a", /.*index(\d+)\.html/, "/video/$1-0-0.html" ],
      result: {
        title: ".m-movies .u-movie h2",
        url: ".m-movies .u-movie a"
      }
    },
    play: {
      match: /\/video/,
      title: ".vtitle a",
      jump: ".videotitle"
    },
    hide: 'body > brde, body > div[id]:not([class]), body > a, .header ~ div[class*="ad"], .widget_ads'
  }, {
    name: "ZzzFun",
    match: /www.zzzfun.com/,
    search: {
      match: /\/vod-search/,
      jump: "#list-focus | append, .leo-foot-txt | before",
      jumpTo: [ ".show-list a, .leo-detail-wrap a", /.*detail-id-(\d+).*/, "/vod-play-id-$1-sid-1-nid-1.html" ],
      result: ".show-list h2 a"
    },
    play: {
      match: /\/vod-play/,
      title() {
        const n = document.querySelector(".bread-crumb-nav, .leo-bg-a h1");
        return n ? n.textContent.replace(/.*当前播放：(.+?) -.*/, "$1") : "";
      },
      jump: ".episode-wrap, -.leo-mod.leo-left"
    },
    hide: "#navbar + div[style]",
    js() {
      $("input[onclick]").each((function(n, e) {
        $(e).val().includes("继续访问") && e.click();
      }));
    }
  }, {
    name: "迅播",
    match: "xbdm.org",
    search: {
      match: /\/search/,
      jump: ".myui-page"
    },
    play: {
      match: /\/video/,
      title: ".myui-panel__head h3 a",
      jump: ".myui-panel-bg"
    },
    hide: "body > div"
  }, {
    name: "哔咪哔咪",
    match: "bimibimi.me",
    search: {
      match: /\/search/,
      jump: ".v_mod, .leo-foot-txt | before",
      result: {
        title: ".info a, .leo-detail-media h1",
        url: ".info a, .leo-detail-media .leo-po-ab a"
      },
      keyword() {
        const n = location.href.match(/wd\/([^\/]+)/);
        return n ? n[1] : document.querySelector(".p_tab strong, .leo-search-wd").textContent;
      }
    },
    play: {
      match: /\/play\//,
      title: ".v_path .current, header a + font, h1.leo-fs-l",
      jump: "-.play_box, -.leo-mod.leo-left | before"
    },
    hide: "body > div[id]:not([class]), body > div[style]:not([class]), .tuiguang, body > .leo-container ~ [id], .ssr1, .ssr1 + div:not([class]), ins[id], section + div[id]",
    css: ".leo-detail-wrap {background-color: #6ea7b8;margin-bottom: 10px;border-radius: 5px;box-shadow: 0 2px 2px 0 rgba(0,0,0,0.2);}"
  }, {
    name: "妮可",
    match: /nicotv\.(me|club)/,
    search: {
      match: /\/search/,
      jump: ".pager, .navbar ~ .container",
      jumpTo: [ ".ff-bg a", /.*\/(\d+).*/, "/video/play/$1-1-1.html" ],
      result: "h2 a"
    },
    play: {
      match: /\/play\//,
      title: "a.ff-text",
      jump: "-.tab-content.ff-playurl-dropdown"
    },
    hide: "body > brde, body > div[id]:not([class]), body > div[style]:not([class]), body > a, .ff-ads, body > div[classname], #ff-totop ~ div[id]"
  }, {
    name: "AGE",
    match: "agefans.tv",
    search: {
      match: /\/search/,
      jump: "#container",
      result: ".cell_imform_name"
    },
    play: {
      match: /\/play\/.+playid=/,
      title: "#detailname a",
      jump: ".baseblock + .spaceblock1 + .baseblock | before"
    },
    hide: "div[style]:not([class]) > a"
  }, {
    name: "Qinmei",
    match: "qinmei.video",
    search: {
      match: /\/search/,
      jump: ".layout | append"
    },
    play: {
      match: /\/video/,
      title: ".info .title",
      jump: ".player | append"
    }
  }, {
    name: "哆咪",
    match: "duomimh.com",
    search: {
      match: /wd=/,
      jump: ".myui-page, .myui-pannel_bd | before",
      jumpTo: [ "#searchList a", /.*detail\/(\d+).*/, "/dongmanplay/$1-1-1.html" ],
      result: ".searchkey"
    },
    play: {
      match: /\/dongmanplay/,
      title: "#player-sidebar .title",
      jump: "#player-sidebar .myui-panel_bd | before"
    }
  }, {
    name: "次元",
    match: "cyloli.com",
    search: {
      match: /\/vodsearch/,
      jump: ".typebox | append, #content | append, .pagebox",
      jumpTo: [ ".search a", /.*\/cy(\d+).*/, "/yv$1-1-1/" ],
      keyword() {
        const n = location.href.match(/vodsearch\/([^-]+)/);
        return n ? n[1] : document.querySelector(".main-head .title b, .re-info b").textContent;
      },
      result: ".search .title"
    },
    play: {
      match: /\/cy\d+/,
      title: ".u-title a, .title a",
      jump: ".playlistall .playbox, .play-info + .main"
    },
    hide: ".column-rgt #play"
  }, {
    name: "Mikan",
    match: "mikanani.me",
    search: {
      match: /\/Search/,
      jump: ".footer | before"
    }
  } ], Icon = {
    vip: '<svg fill="currentColor" viewBox="0 0 18 18" role="img" aria-hidden="true"><path d="M17.731,6.27l-2.771-4.464c-0.332-0.534-0.906-0.852-1.538-0.852h-2.364c-0.553,0-1,0.448-1,1s0.447,1,1,1h2.261l2.628,4.232l-6.955,7.58L2.053,7.187l2.628-4.233h2.33c0.552,0,1-0.448,1-1s-0.448-1-1-1H4.577c-0.623,0-1.212,0.327-1.537,0.853L0.267,6.272c-0.416,0.671-0.346,1.521,0.189,2.133l7.475,8.167c0.275,0.313,0.663,0.475,1.056,0.475c0.324,0,0.651-0.11,0.92-0.336l7.648-8.321C18.077,7.794,18.148,6.943,17.731,6.27z"></path><path d="M4.517,6.167C4.108,6.538,4.078,7.171,4.45,7.58l3.81,4.19c0.189,0.208,0.458,0.327,0.739,0.327c0,0,0,0,0,0c0.281,0,0.55-0.118,0.739-0.327l3.81-4.184c0.372-0.409,0.343-1.041-0.066-1.413c-0.407-0.372-1.039-0.342-1.412,0.066L9,9.612L5.929,6.234C5.558,5.826,4.926,5.796,4.517,6.167z"></path></svg>',
    loader: '<svg><defs><filter id="o--l-f"><feGaussianBlur in="SourceGraphic" stdDeviation="2" result="blur" /><feColorMatrix in="blur" mode="matrix" values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 5 -2" result="gooey" /><feComposite in="SourceGraphic" in2="gooey" operator="atop"/></filter></defs></svg>',
    qrcode: '<svg viewBox="0 0 512 512"><path d="M160 0H0v160h160V0zm-32 128H32V32h96v96z"/><path d="M64 64h32v32H64zM352 0v160h160V0H352zm128 128h-96V32h96v96z"/><path d="M416 64h32v32h-32zM0 512h160V352H0v160zm32-128h96v96H32v-96z"/><path d="M64 416h32v32H64zM256 0h64v32h-64zM256 128h32V96h32V64h-96V32h-32v64h64zM192 128h32v32h-32zM320 160h-32v32h-96v32h128zM32 288h32v-32H32v-64H0v128h32zM64 192h32v32H64z"/><path d="M192 320h64v-32h-32v-32h-64v-64h-32v64H96v64h32v-32h64zM288 256h32v64h-32zM288 352h-96v32h64v96h-64v32h96v-32h64v-32h-64z"/><path d="M192 416h32v32h-32zM320 352h32v64h-32zM480 416h-96v96h32v-64h64z"/><path d="M448 480h64v32h-64zM480 352h32v32h-32zM384 384h32v-96h-64v32h32zM448 224h-32v-32h-32v32h-32v32h128v-32h32v-32h-64zM448 288h64v32h-64z"/></svg>',
    panda: '<svg viewBox="0 0 58 58"><g fill="none" fill-rule="evenodd"><g fill-rule="nonzero"><path d="m45 53c-.0546881 2.7931564-2.3463984 5.0224466-5.14 5h-13.27c-.5083718-.0010076-1.0053831-.1504586-1.43-.43-.1420678-.0989627-.275843-.2093272-.4-.33-.6996697-.7022762-.9371022-1.7423172-.6115134-2.6786512.3255889-.936334 1.1570752-1.6046829 2.1415134-1.7213488 2.3239372-.2331788 4.5921787-.8551705 6.71-1.84 4-2 4-3 8-3h.09c1.96 0 3.91 1.05 3.91 5z" fill="#56595e"/><path d="m16.64 57.93c-.2570845.0487903-.5183362.072236-.78.07h-13.27c-1.36404057-.0108453-2.48586821-1.0778065-2.5650417-2.4395906s.91144837-2.5515622 2.2650417-2.7204094c.39-.05.82-.1 1.27-.18 1.85 2.41 5.67 4.83 13.08 5.27z" fill="#393f4a"/><path d="m41.58 37.82c-.2120073-1.3689502-.5741922-2.7103759-1.08-4-1.5321302-3.7998021-4.6308132-6.7526647-8.5-8.1-1.7723811-.6604586-3.6142699-1.116737-5.49-1.36-1.459417-1.64571-3.3787039-2.8160918-5.51-3.36v2s-1-1-4-1c.5564171.6373694.9052622 1.4292477 1 2.27-.9881102.1626962-1.954383.4378156-2.88.82-3.1405237 1.3398517-5.57726048 3.9325106-6.72 7.15-.30020366.7422496-.56057405 1.4999942-.78 2.27.74962449-.3324619 1.55996792-.5061069 2.38-.51 2.9840565.0005329 5.5142137 2.1939229 5.9380884 5.1477211s-1.3873715 5.7701864-4.2508583 6.609851c-2.86348678.8396646-5.90884659-.5526136-7.1472301-3.2675721-1.26 1.25-2.54 2.23-2.54 6.07.06231285 1.4995348.60975081 2.9383141 1.56 4.1 1.85 2.41 5.67 4.83 13.08 5.27.79 0 1.62.07 2.49.07 2.00787.0049 4.0133487-.1388259 6-.43-.1420678-.0989627-.275843-.2093272-.4-.33-.6996697-.7022762-.9371022-1.7423172-.6115134-2.6786512.3255889-.936334 1.1570752-1.6046829 2.1415134-1.7213488 2.3341673-.2298694 4.6128181-.8519343 6.74-1.84 4-2 4-3 8-3h.09c.5978063-1.3090107.9081086-2.7309455.91-4.17.0288781-2.0115692-.1116179-4.0219997-.42-6.01zm-14.58 10.18c-3.3137085 0-6-2.6862915-6-6s2.6862915-6 6-6 6 2.6862915 6 6-2.6862915 6-6 6z" fill="#ecf0f1"/><path d="m16 40c.0011067 2.8236772-1.9667629 5.2660153-4.7260589 5.8655482-2.75929597.5995329-5.56322164-.8060016-6.7339411-3.3755482 1.23619272-1.1255907 2.02450604-2.6596058 2.22-4.32.20043438-1.2343619.47087057-2.4563329.81-3.66.76502877-.3392836 1.59311716-.5130799 2.43-.51 3.3137085 0 6 2.6862915 6 6z" fill="#393f4a"/><path class="o--svg-panda-ear" d="m15.07 25.09c-3.1405237 1.3398517-5.57726048 3.9325106-6.72 7.15-1.7107005-1.0733343-2.60773955-3.0704104-2.2737971-5.0621496.33394244-1.9917392 1.83329082-3.5870281 3.80051907-4.0437071 1.96722823-.456679 4.01603603.3149289 5.19327803 1.9558567z" fill="currentColor"/><path class="o--svg-panda-ear" d="m43 29c-.0010936 1.9310523-.9315354 3.7435529-2.5 4.87-1.5202565-3.8188289-4.6206581-6.7915669-8.5-8.15 1.4591701-2.1999413 4.1848044-3.1877097 6.7146046-2.4333692 2.5298003.7543404 4.2693548 3.0735469 4.2853954 5.7133692z" fill="currentColor"/><path d="m57 51.26c-.3048058-.1727609-.6496472-.2624197-1-.26h-2c-1.72 0-3.45 1-3.93 4.8-.0557454.552159.1204415 1.102656.4864258 1.5198401.3659843.4171842.8888571.663543 1.4435742.6801599l-12.14.000168c2.7936016.0222786 5.0853119-2.2070116 5.14-5.000168 0-3.91-2-4.93-3.91-5 .5978063-1.3090107.9081086-2.7309455.91-4.17.0283169-2.008234-.1121774-4.0152958-.42-6 2.1858513.1377619 4.344226.5613682 6.42 1.26 2.3098491.7513339 4.379859 2.1002904 6 3.91.2104479.2362838.4042467.4868857.58.75 1.5534805 2.1980542 2.3978803 4.8184847 2.42 7.51z" fill="#d1d4d1"/><path d="m58 39c.0026732 2.1548771-1.3755384 4.06906-3.42 4.75-.1757533-.2631143-.3695521-.5137162-.58-.75-1.620141-1.8097096-3.6901509-3.1586661-6-3.91-.004853-.0298037-.004853-.0601963 0-.09 0-2.7614237 2.2385763-5 5-5s5 2.2385763 5 5z" fill="#56595e"/><path d="m58 53v3c0 1.1045695-.8954305 2-2 2h-4c-.5669756.0028428-1.108514-.2350961-1.4899078-.6546293s-.5667976-.9812308-.5100922-1.5453707c.49-3.8 2.22-4.8 3.94-4.8h2c1.1045695 0 2 .8954305 2 2z" fill="#56595e"/><circle id="Oval" cx="27" cy="42" fill="#393f4a" r="6"/><g fill="#2c2f38"><path d="m12 42h-2c-.55228475 0-1-.4477153-1-1s.44771525-1 1-1h2c.5522847 0 1 .4477153 1 1s-.4477153 1-1 1z"/><path d="m27 43h-2c-.5522847 0-1-.4477153-1-1s.4477153-1 1-1h2c.5522847 0 1 .4477153 1 1s-.4477153 1-1 1z"/><path d="m16 49c-.265803.0015368-.5212812-.1028135-.71-.29l-1-1c-.3921222-.3921222-.3921222-1.0278778 0-1.42s1.0278778-.3921222 1.42 0l.49.49 1.35-.67c.3211808-.1932607.7234705-.1906728 1.0421383.0067041.3186678.1973768.5001928.5563928.4702434.9300368s-.2663431.6991617-.6123817.8432591l-2 1c-.1379993.0748719-.2930224.1127664-.45.11z"/></g><path class="o--svg-panda-z" d="m38 18h-10c-.8485805-.0006612-1.6043661-.5367509-1.8854964-1.33741s-.0263968-1.6915659.6354964-2.22259l5.55-4.44h-4.3c-1.1045695 0-2-.8954305-2-2s.8954305-2 2-2h10c.8485805.00066116 1.6043661.53675085 1.8854964 1.33740998.2811303.80065912.0263968 1.69156589-.6354964 2.22259002l-5.55 4.44h4.3c1.1045695 0 2 .8954305 2 2s-.8954305 2-2 2z" fill="#3b97d3"/><path class="o--svg-panda-z2" d="m56 12h-10c-.8485805-.0006612-1.6043661-.5367509-1.8854964-1.33741s-.0263968-1.69156587.6354964-2.22259l5.55-4.44h-4.3c-1.1045695 0-2-.8954305-2-2s.8954305-2 2-2h10c.8485805.00066116 1.6043661.53675085 1.8854964 1.33740998.2811303.80065912.0263968 1.69156589-.6354964 2.22259002l-5.55 4.44h4.3c1.1045695 0 2 .8954305 2 2s-.8954305 2-2 2z" fill="#3b97d3"/></g></g></svg>'
  }, Skip_Ad_Html = '<div class="o--skip-ad"><div class="o--slogan"><strong>加速吧</strong><div class="o--loader">' + Icon.loader + "</div><strong>广告</strong></div></div>", isVipSiteRegex = /(v\.qq|tv\.sohu|iqiyi|youku|mgtv|1905|pptv|le)\.(com|cn)/, isAnimeSiteRegex = /(bilibili|cyloli|nicotv|duomimh|zzzfun|mikanani|xbdm|agefans|qinmei|bimibimi)\.(com|me|org|tv|video)/, E = emitter();
  let pageInfo = {};
  const Arr = {
    shuffle(n) {
      for (let e = n.length; 0 < e; ) {
        const t = _Mathfloor(Math.random() * e);
        e--;
        const i = n[e];
        n[e] = n[t], n[t] = i;
      }
      return n;
    },
    random: n => n[_Mathfloor(Math.random() * n.length)]
  };
  let allowScale = !0;
  E.on("log", (function() {})), E.on("url.change", (function(n) {
    let {oldUrl: e, newUrl: t, autoPlay: i} = n;
    try {
      addonGo();
    } catch (n) {}
    const o = ADDONS.find((function(n) {
      return n.play && n.play.vip && Is(n.play.match, e);
    })), a = ADDONS.find((function(n) {
      return n.play && n.play.vip && Is(n.play.match, t);
    }));
    o && a && E.emit("playurl.change");
  })), SEARCH_URLS && IsNot(/douban\.com/) && (SEARCH_URLS = "觅影  https://movie.douban.com/tag/\n\n" + SEARCH_URLS),
  SEARCH_URLS = ensureArray(SEARCH_URLS).map((function(n) {
    const {url: e, name: t} = parseUrl(n), i = Is(isAnimeSiteRegex, e), o = Is(isVipSiteRegex, e);
    return {
      url: e,
      name: t,
      weight: /douban.com/.test(e) ? 10 : (Is(/bilibili.com/) || Is(isAnimeSiteRegex)) && i ? 5 : (Is(isVipSiteRegex) || Is(/douban.com/)) && o ? 3 : i ? 1 : o ? 0 : 2
    };
  })), SEARCH_URLS.sort((function(n, e) {
    return e.weight - n.weight;
  })), $("html").addClass("o--miying" + (isMobile ? " o--m" : " o--pc"));
  let winW = window.innerWidth || 0;
  for (const n = Date.now(); 3e3 > Date.now() - n && 0 === (winW = window.innerWidth || 0); ) await delay(100);
  const buttonBoxShadow = "box-shadow: 0 2px 2px 0 rgba(0,0,0,0.2);", maxSniffIframeWidth = 105, isSniffIframe = 0 < winW && winW <= maxSniffIframeWidth + 5;
  pageInfo = {
    isSniffIframe: isSniffIframe,
    winW: winW,
    screenWidth: screenWidth
  };
  const isJiexiRegex = /(jx|url|v)=http/i;
  let m3u8Video;
  if (!isSniffIframe && (Is(isJiexiRegex) && Is(isVipSiteRegex, Href.replace(/.+=http/, "http")) || isNotTop && (Is(/=http.+\.m3u8/) || (m3u8Video = document.querySelector("video[src]")) && /\.m3u8/.test(m3u8Video.src))) && (addCss("\nbody > *:not(script) + script ~ *[id]:not([class]) {" + PurifyStyle + "}"),
  fixM3u8Playing()), window.addEventListener("message", (function(n) {
    const e = n.data;
    e && e._id === MESSAGE_ID && (isNotTop && e.parent ? (e.from = location.href, window.parent.postMessage(e, "*")) : isTop && e.action && E.emit(e.action, e));
  })), isNotTop) {
    if (Is(/m1907.cn/)) {
      addCss("\n#s-player + .show > div[title],#s-controls + div > div:nth-child(n+5):not(:last-child){" + PurifyStyle + "}");
      let n = 0;
      const e = setInterval((function() {
        (document.querySelector("#s-player + .show") || 30 < n++) && (clearInterval(e),
        document.querySelector("#s-controls > div img + span").click());
      }), 100);
      return void (window.alert = function() {});
    }
    return Is(/jx.jiasheshangmao.com/) ? addCss("\n#lines {" + PurifyStyle + "}") : Is(/okjx.cc/) && addCss(".WANG-WANG {visibility: hidden !important;}"),
    void (isSniffIframe && sniffInIframe());
  }
  if (Is(/beijixs\.cn.*url=http/)) if (addCss("\nbody > form {position: absolute !important;left: 0 !important;right: 0 !important;top: 0 !important;bottom: 0 !important;background: #eee8d3 !important;z-index: " + MAX_Z_INDEX + ' !important;}div,input,form {max-width: 100% !important;}form #divcss5 {height: auto;padding: 0 1em;border: none;width: auto;}.o--pc form #divcss5 {max-width: 570px !important;}.o--m h5 input[type="text"] {width: 90% !important;margin: .5em 0 !important;padding: 0 .5em !important;}.o--fail {height: auto !important;}.o--fail > div {text-align: center;border-top: 1px solid #495057;border-bottom: 1px solid #495057;padding: 1em;color: #d9480f;font-weight: bold;font-size: 16px;background-color: #fff4e6;}.o--fail > div > div + div {margin-top: 1em;}.o--m .video-js {width: 100% !important;height: 100vh !important;}'),
  isMobile && toggleViewport(), document.querySelector("#TextBox1").value) {
    $("#form1").prepend($(".video-js").parent());
    let n = 0;
    const e = setInterval((function() {
      const t = document.querySelector("video");
      if (t && 390 > t.duration) {
        t.pause();
        const n = document.querySelector("#TextBox2").value || "", i = document.querySelector("video");
        i.classList.add("o--fail"), i.innerHTML = "<div><div>解析失败</div>" + (n ? "<div>" + n + "</div>" : "") + "</div>",
        clearInterval(e);
      }
      100 < n++ && clearInterval(e);
    }), 100);
  } else {
    let n = Href.split("url=")[1];
    if (n) {
      n = decodeURI(n), document.querySelector("#TextBox1").value = n;
      const e = document.querySelector("#Button1");
      if (e) {
        const n = document.querySelector(".video-js");
        n.style.display = "none !important", e.click();
      }
    }
    let e = 0;
    const t = setInterval((function() {
      const n = document.querySelector("video");
      n && 360 > n.duration ? n.pause() : n.play(), 100 < e++ && clearInterval(t);
    }), 100);
  } else {
    if (Is(/m\.tv\.sohu\.com\/phone_play_film.+vid=/)) return location.href = Href.replace("phone_play_film", "v" + Href.match(/vid=(\d+)/)[1] + ".shtml");
    if (Is(/search\.douban\.com\/movie\//)) addCss("\n#dale_movie_subject_search_bottom,#dale_movie_subject_search_top_right,#dale_movie_subject_top_right,#dale_movie_subject_bottom_super_banner,#dale_movie_subject_middle_right {" + PurifyStyle + "}.o--jump {padding-left: 1em;}.o--jump a {display: inline-flex !important;align-items: center;border-radius: 4px;font-size: 0.75em;height: 2em;justify-content: center;line-height: 1.5;padding-left: 0.75em;padding-right: 0.75em;white-space: nowrap;background-color: #effaf3;color: #257942;margin-top: 0.5em;margin-right: 0.5em;cursor: pointer;}"),
    $((function() {
      $("#icp").html(OO_SIGN), $(".gemzcp").each((function(n, e) {
        const t = $(".title", e).text();
        $(e).append('<p class="o--jump">' + getSearchSourcesHtml(t) + "</p>");
      }));
    })); else if (Is(/m\.douban\.com\/search\/\?.*type=movie/)) addCss("\n#TalionNav,.search-results-modules-name {" + PurifyStyle + "}.search-module {margin-top: 0;}.search-results img {width: 80px;}.search-results {padding-bottom: 10px;}.search-results li a {display: flex;align-items: center;}.search-results img {height: 100%;padding: 0;margin: 5px 0;border: 2px solid;border-image: linear-gradient(to bottom, #2b68c4 0%,#cf2d6e 100%)1;}"),
    $((function() {
      $("#more-search").append("    " + OO_SIGN), $(".subject-info").each((function(n, e) {
        insertSearchAddon($(".subject-title", e).text(), e, "append");
      })), $(".search-hd input").on("keyup", (function(n) {
        13 === n.keyCode && (n.preventDefault(), location.href = "/search/?query=" + n.target.value + "&type=movie");
      })), $(".search-hd .button-search").attr("id", OO_SIGN), $(".search-hd .button-search").on("click", (function(n) {
        n.preventDefault();
        const e = $(".search-hd input").val();
        location.href = "/search/?query=" + e + "&type=movie";
      }));
    })); else if (Is(/movie.douban.com\/subject\//)) addCss("\n#dale_movie_subject_search_bottom,#dale_movie_subject_search_top_right,#dale_movie_subject_top_right,#dale_movie_subject_bottom_super_banner,#dale_movie_subject_middle_right {" + PurifyStyle + "}.o--douban-source a {color: #257942;}.o--douban-source a:hover {color: #FFFFFF;background: #257942;}.o--douban-source a.is-vip {color: #e8590c;}.o--douban-source a.is-vip:hover {color: #FFFFFF;background: #e8590c;}.o--douban-source a.is-anime {color: #e64980;}.o--douban-source a.is-anime:hover {color: #FFFFFF;background: #e64980;}"),
    $((function() {
      $("#icp").html(OO_SIGN);
      const n = purifyKeyword($("title").text().replace("(豆瓣)", "").trim());
      $("#info").append('<div class="o--douban-source"><span class="pl">在线观看:</span><span><span> </span>' + SEARCH_URLS.filter((function(n) {
        return !/douban\.com/.test(n.url);
      })).map((function(e) {
        return '<span><a class="' + (isVipSiteRegex.test(e.url) ? "is-vip" : isAnimeSiteRegex.test(e.url) ? "is-anime" : "") + '" ' + (isMobile ? "" : 'target="_blank" ') + (_D ? 'data-weight="' + e.weight + '" ' : "") + 'href="' + toSearchUrl(e.url, n) + '">' + e.name + "</a>";
      })).join(" / </span>") + "</span></span></div>");
    })); else if (Is(/m\.douban\.com\/movie\/subject\//)) addCss(".score-write,a[href*='to_app']:not(.sub-honor):not(.sub-cover),a[href*='doubanapp'],div[id*='BAIDU'],div[id*='google'],section + .center,.bottom_ad_download,.sub-vendor,.to_pc,.TalionNav-static,.sub-detail .mark-movie,.sub-detail .mark-tv,.subject-banner,.bottom_ad_download,.cover-count,#google_esf,.adsbygoogle,.Advertisement,.TalionNav-primary .nav-btns.cancel {" + PurifyStyle + '}.sub-info .sub-cover {display: block !important;}.TalionNav-primary {position: relative !important;justify-content: space-around;}.subject-header-wrap .sub-honor {font-size: 12px;}.subject-intro {margin-top: .5em;}.subject-comments,.subject-reviews {margin-bottom: 0 !important;}.TalionNav .TalionNav-primary .search-box {width: 200px;flex: 200px 0 0;animation: none;}a.nav-btn-item[href*=\'logout\'] {width: 5em;margin-left: -.5em;font-size: .8em;}.sub-original-title {padding: 0.25em 0;}._V_sign {font-size: 0.85em;opacity: 0.25;text-align: center;padding-bottom: 1em;}._V_source, .sub-score + .sub-score {margin-top: 1.5em !important;color: #fff;}._V_source .sub-score .sub-content {display: block;}._V_source .sub-score a {padding: 0.3em 0.5em 0.2em;line-height: 1.4;margin: 0 0.15em;border: 1px solid rgba(255,255,255,0.2);font-size: 1.05em;font-weight: bold;letter-spacing: 1px;margin-top: 0.5em;display: inline-block;color: #ffe8cc;background: rgba(239, 238, 238, 0.05);border-radius: 4px;box-shadow: 0 2px 2px 0 rgba(0,0,0,0.2);}#TalionNav {display: none;}#TalionNav .logo {background: none;font-size: 1em;display: inline-flex;justify-content: center;align-items: center;color: #dee2e6;margin-right: 5px;}.search-box:not(.on-search) {opacity: 0.7;}#channel_tags {margin-bottom: 10px;}.subject-header-wrap .sub-detail {display: flex;flex-direction: column;justify-content: space-around;}#channel_tags {margin-top: 10px;}input[type="search"]::-webkit-search-decoration,input[type="search"]::-webkit-search-cancel-button,input[type="search"]::-webkit-search-results-button,input[type="search"]::-webkit-search-results-decoration {-webkit-appearance:none;}.o--douban-source a {color: #e9fac8 !important;}.o--douban-source a.is-vip {color: #ffc078 !important;}.o--douban-source a.is-anime {color: #ffdeeb !important;}'),
    $((function() {
      $(".movie-reviews .show-all").after('<div class="_V_sign"><a href="https://gitee.com/ecruos/oo">豆瓣·净化 ' + OO_SIGN + "</a></div>"),
      $("section + .center").each((function(n, e) {
        $(e).remove();
      })), $(".subject-header-wrap").after($("#TalionNav")), $("#TalionNav").css("display", "block"),
      $("#TalionNav .logo").html(OO_SIGN).attr("href", "https://movie.douban.com/tag/#/"),
      $(".search-box").remove(), $(".TalionNav-primary .logo").after('<div class="search-box"><input class="search-input" type="search" placeholder="搜索"></div>'),
      $(".search-input").on("focus", (function() {
        $(this).parent().addClass("on-search");
      })).on("blur", (function() {
        $(this).parent().removeClass("on-search");
      })), $(".search-input").on("keyup", (function(n) {
        13 === n.keyCode && (n.preventDefault(), location.href = "/search/?query=" + n.target.value + "&type=movie");
      }));
      const n = purifyKeyword($(".sub-title").text().trim());
      0 === $("._V_source").length && $(".subject-header-wrap").append('<div class="_V_source subject-mark"><div class="sub-score"><div class="sub-trademark">在线观看</div><div class="sub-content o--douban-source">' + getSearchSourcesHtml(n, !1) + "</div></div></div>"),
      setTimeout((function() {
        $(".subject-intro .bd p").get(0).click(), $(".sub-cover").attr("href", "#"), $("#subject-honor-root a").attr("href", "#");
      }), 1e3);
      let e = 0;
      const t = setInterval((function() {
        $("body > ins, body > iframe, .adsbygoogle").remove(), 5 < e++ && clearInterval(t);
      }), 500);
      !function n() {
        const e = $("#subject-header-container").attr("style");
        if (e) {
          const n = e.match(/:\s*([^;]+);?/)[1], t = n.replace(")", ", 0)");
          try {
            addCss(".sub-cover::before {background: -webkit-linear-gradient(bottom, " + n + " 0%, " + t + " 5%), -webkit-linear-gradient(right, " + n + " 0%, " + t + " 5%),-webkit-linear-gradient(top, " + n + " 0%, " + t + " 5%), -webkit-linear-gradient(left, " + n + " 0%, " + t + ' 5%);content: "";bottom: 0;position: absolute;left: 0;right: 0;top: 0;width: 102px;height: 142px;border-radius: 4px;}');
          } catch (n) {}
        } else setTimeout((function() {
          n();
        }), 100);
      }();
    })); else if (Is(/movie\.douban\.com\/tag\//)) addCss(".aside, .extra,.dale_movie_tag_bottom_banner {" + PurifyStyle + "}" + prefixCss(".grid-16-8 .article {width: auto;float: unset;}h1 {display: none;}#db-nav-movie {margin-bottom: 20px;}#db-nav-movie .o--nav-item-a {background-color: #27a;color: #fafafa;padding: 3px 5px;border-radius: 3px;}.list-wp {display: flex;flex-wrap: wrap;justify-content: space-between;margin-top: 25px;}a.item {width: 118px;margin: 0 8px;}div.item {width: 100%;margin-left: 8px;margin-right: 8px;margin-bottom: 16px;}a.item p {padding-right: 0;text-align: center;}a.item .cover-wp, div.item .poster {overflow: hidden;border-radius: 3px;box-shadow: 0 1px 4px rgba(0, 0, 0, 0.39);border: 3px solid #f1eded;height: auto;}@media only screen and (max-width: 320px) {a.item .cover-wp {border-width: 0;}}a.item .cover-wp:hover, div.item .poster:hover {box-shadow: 0 5px 10px rgba(0, 0, 0, 0.5);}a.item .pic img {width: 100%;height: 163px;object-fit: cover;}a.item .cover-wp:after {display: none;}.tag-nav {margin-right: 0;}.o--item-divider {width: 100%;}.o--item-divider + .o--item-divider {display: none;}", ".o--miying") + prefixCss(".category {width: 100%;white-space: nowrap;overflow-x: auto;}.tags {margin-bottom: 1em !important;}.tags, .o--douban-search {padding-left: 6px;padding-right: 6px;}.checkbox__input {vertical-align: text-top;}.tag-nav {margin: 0 auto;font-size: 12px;width: 100%;}.tag-nav .tabs, .tag-nav .check {display: flex;justify-content: space-around;width: 100%;}.tag-nav .tabs a {padding: 7.5px 5px 5px;}.tabs a:not(.tab-checked) {border: 1px solid #dfdfdf;}.tabs .tab-checked {border: 1px solid #258dcd!important;}.tab-checked:after {display: none;}.checkbox, .range {margin-right: 5px;}.check {float: none;margin-top: 5px;}.list-wp {margin-top: 40px;justify-content: space-evenly;}.list-wp, .item .cover-wp {overflow: unset;}a.item {width: calc((100% - 15px) / 3);text-align: center;margin: 0 2px;}a.item p {padding-right: 0;}a.item .cover-wp:after, .poster:after {display: none;}.tag-nav .range-dropdown {left: 0 !important;width: auto !important;right: 0 !important;top: -4em !important;}.more {margin: 0 1em 0.5em !important;}", ".oo") + prefixCss("\nbody > *:not(.oo) {" + PurifyStyle + "}#app .article, .article.oo {position: absolute;top: 0;left: 0;right: 0;padding: 10px 0;transition: all 0.8s;}.category::-webkit-scrollbar {width: 1px;height: 1px;background-color: rgba(223, 223, 223, 0.25);}.category::-webkit-scrollbar-track {background: transparent;border: 0px none #ffffff;border-radius: 50px;}.category::-webkit-scrollbar-thumb {-webkit-box-shadow: inset 0 0 2.5px rgba(0, 0, 0, 0.1);box-shadow: inset 0 0 2.5px rgba(0, 0, 0, 0.1);border-radius: 2.5px;background-color: rgba(223, 223, 223, 0.25);opacity: 0.7;transition: opacity ease-in-out 200ms;}.category::-webkit-scrollbar-thumb:hover {opacity: 1;background-color: rgba(223, 223, 223, 0.25);}.o--douban-search {position: relative;display: flex;margin-bottom: 5px;}.o--douban-search .inp {height: 34px;text-align: center;cursor: text;width: 90%;border-top: 1px solid #dedede;border-left: 1px solid #dedede;border-top-left-radius: 3px;border-bottom-left-radius: 5px;}.o--douban-search .inp input {background: #fff;width: 96%;margin: 0;text-align: left;height: 30px;padding-left: 10px;outline: none;}.o--douban-search input {-webkit-appearance: none;border: none;background: transparent;}.o--douban-search .inp-btn {position: relative;width: 37px;height: 34px;}.o--douban-search .inp-btn input {width: 100%;height: 100%;font-size: 0;padding: 35px 0 0 0;overflow: hidden;color: transparent;cursor: pointer;}.o--douban-search .inp-btn input:focus {outline: none;}.o--douban-search .inp {background-image: url(//img3.doubanio.com/dae/accounts/resources/a4a38a5/movie/assets/nav_mv_bg.png?s=1);}.o--douban-search .inp-btn input {background: url(//img3.doubanio.com/dae/accounts/resources/a4a38a5/movie/assets/nav_mv_bg.png?s=1) no-repeat 0 -40px;}.o--item-balancer {margin-left: 11%;margin-right: 11%;}", ".o--m")),
    $((function() {
      const n = document.querySelector(".list-wp");
      let e = !1, t = !1;
      new MutationObserver((function(n) {
        if (t) t = !1; else {
          for (const t of n) "childList" == t.type && (e = !0);
          e && (t = !0, $(".list-wp").append('<div class="o--item-divider"></div>'));
        }
      })).observe(n, {
        attributes: !0,
        childList: !0
      }), $(".nav-items li a").eq(5).addClass("o--nav-item-a").html("觅影"), $("title").html("觅影"),
      isMobile && ($("#app .article .tags").before('<div class="o--douban-search"><div class="inp"><input name="' + OO_SIGN + '" size="22" maxlength="60" placeholder="搜索电影、电视剧、综艺、影人" value="" autocomplete="off"></div><div class="inp-btn"><input type="submit" value="搜索"></div></div>'),
      $("body").prepend($("#app .article").addClass("oo")), $(".o--douban-search input").on("keyup", (function(n) {
        13 === n.keyCode && (n.preventDefault(), location.href = "https://m.douban.com/search/?query=" + n.target.value + "&type=movie");
      })), $(".o--douban-search .inp-btn input").on("click", (function(n) {
        n.preventDefault();
        const e = $(".o--douban-search input").val();
        location.href = "https://m.douban.com/search/?query=" + e + "&type=movie";
      })), setInterval((function() {
        $(".list-wp [href]").each((function(n, e) {
          const t = $(e).attr("href");
          t.includes("movie.douban.com") && $(e).attr("href", t.replace("movie.douban.com", "m.douban.com/movie")).attr("target", "_blank");
        }));
      }), 500));
    })); else {
      function getBaseStyle() {
        return "\n@keyframes o--breath {0% {animation-timing-function: cubic-bezier(0.9647, 0.2413, -0.0705, 0.7911);transform: scale(0.9);}51% {animation-timing-function: cubic-bezier(0.9226, 0.2631, -0.0308, 0.7628);transform: scale(1.02);}100% {transform: scale(0.9);}}@keyframes o--blink {20%,24%,55% {color: #FFE082\ntext-shadow: none;}0%,19%,21%,23%,25%,54%,56%,100% {color: #fff6a9;text-shadow: 0 0 5px #ffa500, 0 0 5px #ffa500, 0 0 15px #ffa500, 0 0 20px #ffa500, 0 0 6px #ff0000, 0 0 10px #ff8d00, 0 0 9px #ff0000;}}@keyframes o--bopA {0% {transform: scale(0.9);opacity: .8;}50%,100% {transform: scale(1);opacity: 1;}}@keyframes o--bopB {0% {transform: scale(0.9);opacity: .8;}80%,100% {transform: scale(1) rotateZ(-3deg);opacity: 1;}}@keyframes o--beat {to {transform: scale(1.4);}}@keyframes o--loader-spin {0% {transform: rotate(0deg);}100% {transform: rotate(360deg);}}@keyframes o--color-change-opacity {0%   { opacity: 0.9; }50% { opacity: 1; }100% { opacity: 0.9; }}@keyframes o--panda-ear-color-change {0%   { color: #ff9800; }25% { color: #fb7b76; }50% { opacity: #9C27B0; }75% { color: #fb7b76; }100% { opacity: #ff9800; }}@keyframes o--comment-bubble1 {40% {transform: translate(2px,2px) scale(.79);opacity: .8;}to {transform: translate(6px,-4px) scale(.57);opacity: 0;}}@keyframes o--comment-bubble2 {0% {transform: translate(4px,3px);}16% {transform: translate(4px,3px);opacity: 0;}28% {transform: translate(7px);opacity: .8;}60% {transform: translate(11px,-2px);}72% {transform: translate(14px,-3px) scale(.57);opacity: 0;}}@keyframes o--comment-bubble3 {0% {transform: translate(10px,-4px) scale(.71)\n}16% {transform: translate(10px,-4px) scale(.71);opacity: 0;}28% {transform: translate(10px,-4px) scale(.71);opacity: .5;}72% {transform: translate(14px,-9px) scale(.57);opacity: 0;}}oo-logs {position: fixed;bottom: 0;right: 0;max-height: 300px;overflow-y: scroll;text-align: right;z-index: " + (MAX_Z_INDEX - 10) + ";display: none;}oo-logs.is-active {display: block !important;}.o--log-message {display: inline-block;background-color: #4CAF50;color: #fff;padding: .25em .5em;margin-bottom: .25em;border-top-left-radius: 3px;border-bottom-left-radius: 3px;max-width: 800px;word-break: break-all;}.o--m.o--debug {max-width: 400px !important;margin: 0 auto !important;}.o--m.o--debug .mod_player > .player_container {max-height: 203px;}\noo-iframes {visibility: hidden;pointer-events: none;position: fixed;bottom: 0;left: 0;max-width: 320px;display: block;}oo-iframes > iframe {max-width: " + maxSniffIframeWidth + "px;max-height: 60px;display: inline-block;}.o--hide {display: none !important;}.o--vip-play {position: absolute;top: 0;left: 0;z-index: 1;margin: 1em;font-size: 14px;}.o--vip .o--vip-play {position: relative;font-size: 12px;background-color: #2d2d2e;margin: .5em 0 0;padding: .8em .5em .5em;}.is-play-in-page .o--vip-play {display: none;}.plyr--hide-controls ~ .o--vip-play {display: none;}.plyr--paused + .o--vip-play,.o--player:hover .o--vip-play {display: block !important;}.o--vip-play.is-hide {display: none !important;}.o--vip-play a {position: relative;margin-right: 8px;}.o--vip-play .o--sources a {background-color: #0db2fb;padding: .3em .75em .25em .75em;border-radius: 3px;color: #ffffff;cursor: pointer;opacity: .85;display: inline-flex;margin: .25em;}.o--vip-play .o--sources a.is-active {background-color: #1c7ed6;}.o--vip-play .o--sources a.is-active,.o--vip-play .o--sources a:hover {opacity: 1;font-weight: bold;}.o--vip-play .o--sources a.is-mp4 {border-bottom: 1.5px solid #FFEB3B;}.o--sniff-done {color: #4CAF50;}.o--play-url {color: #ffffff;padding: 1em 1em .5em;text-shadow: 1px 1px 2px #000000;}.o--play-url a {color: #0db2fb !important;text-decoration: underline;cursor: pointer;font-weight: bold;}.o--play-url .o--span {font-size: .9em;color: #EEEEEE;display: block;opacity: .9;margin-top: .5em;}.o--play-url .o--span.is-warning span {font-weight: bold;color: white;background-color: #FF5722;padding: .25em .5em;border-radius: 2px;}.o--play-url a span {color: #FF9800;}.o--play-url a:hover {color: #e67700 !important;}.o--player-box > *:not(.o--player),.o--player-box::before,.o--player-box::after {display: none !important;}.o--player {position: relative;height: 100%;max-height: 100%;background-color: #01081a;overflow: hidden;z-index: " + MAX_Z_INDEX + ';}.o--player:not(.is-loaded) #o--player-iframe {display: none;}.o--player-bg {position: absolute;top: 0;bottom: 0;left: 0;right: 0;display: flex;justify-content: center;align-items: center;flex-direction: column;font-size: 16px;color: #f1f3f5;overflow: hidden;background-color: #01081a;background-position: center;background-size: cover;background-repeat: no-repeat;transition: all 3.5s;}.o--player.is-loaded .o--player-bg {visibility: hidden;opacity: 0;}.o--m .o--player-bg {font-size: 12px;}.o--player-mask {background-color: #282828;position: absolute;top: 0;right: 0;bottom: 0;left: 0;opacity: 0.35;transition: all 2.5s;}.o--player-bg.is-fail .o--player-mask {opacity: 0.9;}.o--sign {opacity: .25;text-shadow: 1px 1px 2px #000000;width: 96%;display: flex;justify-content: space-between;position: absolute;bottom: 1em;font-size: .8em;}.o--version {margin-left: 1em;font-size: .8em;opacity: .9;}.o--slogan {letter-spacing: 2px;color: #f8964c;display: flex;justify-content: space-evenly;align-items: center;width: 100%;max-width: 480px;}.o--slogan strong {font-size: 2.5em;text-shadow: 0 0 5px #ffa500, 0 0 5px #ffa500, 0 0 15px #ffa500, 0 0 20px #ffa500, 0 0 6px #ff0000, 0 0 10px #ff8d00, 0 0 9px #ff0000;color: #fff6a9;opacity: .8;transform: scale(0.9);display: inline-block;margin: 0 5px;}.o--slogan strong:first-child {animation: o--bopA 1s cubic-bezier(0.175, 0.885, 0.32, 1.275) forwards infinite alternate, o--blink 12s infinite;}.o--slogan strong:last-child {animation: o--bopB 1s 0.2s cubic-bezier(0.175, 0.885, 0.32, 1.275) forwards infinite alternate, o--blink 12s 3s infinite;}.o--error-text {display: none;padding-top: 1em;letter-spacing: 1px;box-shadow: 0 -10px 8px 0 #fff4e6;padding: .25em .5em .4em;position: absolute;bottom: 0;left: -5%;right: -5%;width: 110%;text-align: center;background-color: #fff4e6;color: #FF5722;}.o--player-bg.is-fail .o--slogan {color: #f76707;}.o--player-bg.is-fail .o--slogan strong {color: #d9480f;}.o--player-bg.is-fail .o--loader,.o--player-bg.is-fail + .o--vip-play {display: none;}.o--player-bg.is-fail .o--error-text {display: block;}.o--sniff-progress {display: none;position: absolute;left: 0;bottom: 0;height: 1px;width: 0;background-color: #2b8a3e;border: 1px solid #2b8a3e;border-top-right-radius: 2px;transition: all 5s ease;max-width: 99% !important;}.o--sniffing .o--sniff-progress {display: block;}.o--player.is-loaded .o--sniff-progress,.o--player-bg.is-fail .o--sniff-progress {display: none;}.o--loader {border: 3.6px solid #ff974d;box-sizing: border-box;overflow: hidden;width: 2em;height: 2em;left: 50%;top: 50%;animation: o--loader-spin 2s linear infinite reverse;-webkit-filter: url(#o--l-f);filter: url(#o--l-f);box-shadow: 0 0 0 1px #ff974d inset;}.o--loader:before {content: "";position: absolute;animation: o--loader-spin 2s cubic-bezier(0.59, 0.25, 0.4, 0.69) infinite;background: #ff974d;-webkit-transform-origin: top center;transform-origin: top center;border-radius: 50%;width: 150%;height: 150%;top: 50%;left: -12.5%;}.o--player .plyr__progress input[type=range] {cursor: pointer;}.o--video {height: 100%;width: 100%;background-color: black;}.o--collapse-box.is-open .o--collapse {transform:scaleX(-1);}.o--collapse-box:not(.is-open) .is-collapse {display: none !important;}.o--skip-ad {position: absolute;bottom: 0;left: 0;right: 0;padding: 1.5em 0;text-align: center;background-color: #fff4e6;color: #FF5722;z-index: ' + MAX_Z_INDEX + ";display: flex;justify-content: center;align-items: center;box-shadow: 0 -10px 8px 0 #fff4e6;}.o--skip-ad .o--slogan {letter-spacing: 1em;justify-content: center;}.o--skip-ad .o--loader {width: 1.5em;height: 1.5em;border-width: 2.6px;margin: 0 2.5em 0 2em;}.o--skip-ad .o--slogan strong {font-size: 2em;}.o--vip {position: relative;padding-bottom: 0.5em;background-color: rgba(255, 255, 255, 0.05);margin: .5em .25em;width: calc(100% - .5em);border-radius: 5px;box-shadow: 0 1px 8px 0 rgba(0,0,0,0.2);font-size: 12px;line-height: 1.6;}.o--vip + .o--vip {" + PurifyStyle + '}.o--vip-panel {display: flex;justify-content: space-between;align-items: center;padding: .75em 1em .25em;font-size: 15px;}.o--vip-title {font-weight: bold;color: #257942;width: 100%;}.o--vip-small {font-size: 0.75em;margin: 0 10px;color: #ced4da;}.o--vip-panel, .o--vip-list {height: auto !important;}.o--menus {display: flex;justify-content: center;align-items: center;}.o--menus > div {display: inline-flex;margin-left: 1.5em;cursor: pointer;position: relative;}.o--qrcode-box {background-color: white;padding: 1px 2px 1px 1px;border-radius: 2px;opacity: .65;}.o--m .o--qrcode-box {display: none;}.o--qrcode-box:hover {opacity: 1;}.o--qrcode-box svg {width: 20px;height: 20px;}.o--qrcode-box .o--qrcode {overflow: hidden;display: none;background-color: #fff;position: absolute;top: -35px;left: -110px;z-index: 1;box-shadow: 0 4px 8px 0 rgba(0,0,0,0.35);border-radius: 3px;}.o--qrcode img {width: 100px;height: 100px;}.o--qrcode-text {position: absolute;background-color: #fff;text-align: center;z-index: 2;top: -49px;left: -110px;width: 100px;border-radius: 3px;color: #F57C00;letter-spacing: 1px;font-size: 12px;display: none;}.o--qrcode-box:hover .o--qrcode,.o--qrcode-box:hover .o--qrcode-text {display: block;}.o--setting-button {transition: all .5s;animation: o--color-change-opacity 8s normal infinite ease-in-out, 7s linear 0s infinite normal forwards running o--breath;}.o--setting-button:hover {cursor: pointer;}.o--setting-button svg {width: 1.75em;height: 1.75em;}.o--svg-panda-z {animation: 3.5s linear 0s infinite normal forwards running o--breath;}.o--svg-panda-z2 {animation: 4s linear 0s infinite normal forwards running o--breath;}.o--svg-panda-ear {color: #ff9800;animation: o--panda-ear-color-change 9s normal infinite ease-in-out;}.o--vip-list {padding: 0.5em;letter-spacing: 1px;}.o--vip-list .o--vip-item {border-radius: 4px;display: inline-block;white-space: nowrap;background-color: #eef6fc;color: #1d72aa;margin: 4px;padding: 0.5em 0.5em 0.35em;cursor: pointer;font-size: 14px;line-height: 1.2;font-weight: 600;text-decoration: none;position: relative;overflow: hidden;transition: all 0.25s;text-align: center;vertical-align: top;box-shadow: 0 2px 2px 0 rgba(0,0,0,0.2);}.o--vip-list ~ .o--tip {margin: .25em 1em;font-size: .9em;border-top: 1px solid rgba(224, 224, 224, 0.25);padding-top: 1em;color: #5b5b67;letter-spacing: 1px;}.o--tip strong {color: #FF7043;}.o--vip-item.is-play-in-page::after {content: "";position: absolute;bottom: 0;left: 0;width: 100%;height: 2px;background-color: #2E7D32;}.o--vip-item.is-blob::after {background-color: #2196F3;}.o--vip-item.is-random {padding: 0.5em 1em 0.35em;}.o--vip-item.is-random::after {background-color: #1971c2;}.o--vip-list .o--vip-sniff {width: 1.15em;position: relative;}.o--vip:not(.is-allow-sniff) .o--vip-sniff {display: none;}.o--vip-sniff svg {display: block;}.o--vip-sniff .o--bubble {position: absolute;top: 5%;left: 25%;width: 4px;height: 4px;border-radius: 50%;background-color: #eef6fc;opacity: 0;visibility: hidden;}.o--vip-sniff.is-active {overflow: visible !important;}.is-sniffing .o--vip-sniff.is-active .o--bubble {visibility: visible;}.o--vip-sniff .o--bubble.o--b1 {animation: o--comment-bubble1 1.2s linear infinite;}.o--vip-sniff .o--bubble.o--b2 {animation: o--comment-bubble2 1.2s linear infinite;}.o--vip-sniff .o--bubble.o--b3 {animation: o--comment-bubble3 1.2s linear infinite;}.o--vip-list .o--vip-item:hover, .o--vip-list .o--vip-item:active,.o--vip-list .o--vip-item:hover::after, .o--vip-list .o--vip-item:active::after {background-color: #1d72aa;color: #eef6fc !important;}.o--vip-list .o--vip-item.is-active {background-color: #2b8a3e;color: #eef6fc;}.o--vip-list .o--vip-item.is-active::after {display: none;}.o--vip.is-sniff-success .o--vip-sniff.is-active {background-color: #2f9e44;color: #eef6fc;}.o--vip.is-sniffing .o--vip-sniff.is-active,.o--vip.is-sniff-success .o--vip-sniff.is-active,.o--vip.is-sniffing:not(.is-sniff-success) .o--vip-item,.o--vip-list .o--vip-item.is-active {cursor: not-allowed;pointer-events: none;opacity: 0.5 !important;}.o--vip.is-sniff-done .o--vip-sniff {opacity: .95 !important;}.o--vip.is-sniffing:not(.is-sniff-success) .o--vip-sniff {animation: o--beat 0.25s infinite alternate;}.o--vip .o--sniff-progress {bottom: auto;top: 0;}.o--setting-panel {border-top: 2px solid rgba(224, 224, 224, 0.25);padding: 1em .5em;display: none;margin-top: .5em;transition: all 0.5s;}.o--vip.is-setting-on .o--setting-panel {display: block;}.o--vip.is-setting-on .o--vip-list {display: none;}.o--edit-vip-source-panel {text-align: center;margin: 1em 1em .5em;}.o--edit-vip-source-panel textarea {padding: .75em;font-size: 14px;letter-spacing: 1px;border-radius: 5px;width: calc(100% - 1.5em);min-height: 18em;box-shadow: 0 4px 8px 0 rgba(0,0,0,0.2);border: 1px solid #eee;overflow-y: scroll;}.o--edit-hint {text-align: left;margin: .5em;color: #4CAF50;text-shadow: 0px 0px 1px #8BC34A;}.o--slogan-text {margin-top: .5em;letter-spacing: 1px;color: #adb5bd;font-size: 12px;}.o--slogan-text strong {font-size: 1.25em;margin: 0 .25em;}.o--actions {text-align: right;}.o--action {color: wheat;letter-spacing: 1px;border: 1px solid;display: inline-flex;justify-content: center;align-items: center;padding: .15em .5em;border-radius: 3px;margin-right: 1em;cursor: pointer;background-color: #1b1b29;}.o--action a {color: #FF9800 !important;}.o--m .o--action {font-size: 12px;}.o--action:hover {color: #FFB74D;}.o--toggle .o--y, .o--toggle .o--n {font-weight: bold;font-size: 1.2em;margin-right: .15em;}.o--toggle.is-n .o--y {color: inherit;}.o--toggle:not(.is-n) .o--y {color: green;font-size: 1.5em;}.o--toggle.is-n .o--n {color: red;font-size: 1.5em;}.o--log-button {cursor: pointer;padding: 0 .35em;background-color: hsla(0,0%,100%,.9);box-shadow: 0 2px 2px 0 rgba(0,0,0,0.2);color: #9e774a;border-radius: 3px;display: inline-flex;}.o--log-button:hover {background-color: #9e774a;color: hsla(0,0%,100%,.9);}.o--jump {max-width: 1000px;font-size: 12px;margin: 0 auto;padding: .5em 1em;}.o--vip .o--jump {max-width: unset;margin-top: 5px;}.o--jump + .o--jump {' + PurifyStyle + "}.o--jump a {display: inline-block !important;border-radius: 4px;font-size: 12px !important;line-height: 1;text-align: center;margin-top: 10px;margin-right: 8px;white-space: nowrap;cursor: pointer;text-decoration: none;transition: all 0.25s;color: #257942 !important;background-color: #fafafa !important;border: 1px solid #f1f3f5;padding: 6px;box-shadow: 0 2px 2px 0 rgba(0,0,0,0.2);}.o--pc .o--jump a {\npadding: 5px 6px 4px;}.o--jump a:hover,.o--jump a.is-active {border: 1px solid #099268;background-color: #257942 !important;color: #effaf3 !important;}.o--jump a.is-anime {color: #e64980 !important;}.o--jump a.is-anime:hover,.o--jump a.is-anime.is-active {border: 1px solid #f783ac;background-color: #e64980 !important;color: #ffdeeb !important;}.o--jump a.is-vip {color: #e8590c !important;}.o--jump a.is-vip:hover,.o--jump a.is-vip.is-active {border: 1px solid #e8590c;background-color: #e8590c !important;color: #fff4e6 !important;}.o--vip-list ~ .o--jump {border-top: 2px solid rgba(224, 224, 224, 0.25);}.o--vip-list ~ .o--jump .o--collapse:not(.is-collapse) {display: inline-block !important;}.o--collapse {min-width: 2em;}";
      }
      async function getKeyword(n) {
        return "string" == typeof n ? await $$((function() {
          return $(n).eq(0).text();
        })) : "function" == typeof n ? n($) : getKeywordFromUrl(n);
      }
      async function goJump(n, e) {
        if (n instanceof Function) n(e); else {
          const t = await getKeyword(e);
          if (!t) return;
          (Array.isArray(n) ? n : n.split(/\s*,\s*/)).forEach((function(n) {
            n = n.split(/\s*\|\s*/), insertSearchAddon(t, n[0], n[1] || "after");
          }));
        }
      }
      function execAddonJs(n) {
        n && n.js instanceof Function && n.js();
      }
      function addonGo() {
        const addon = ADDONS.find((function(n) {
          return !n.disable && Is(n.match);
        }));
        if (addon) {
          if (isFirstRunAddon) {
            let n = getBaseStyle();
            addon.hide && (n += "\n" + addon.hide + " {" + PurifyStyle + "}"), addon.css && (n += addon.css),
            addCss(n);
          }
          _D && $("oo-logs").length, _D && $("oo-logs").length, $((function() {
            let _Mathmin = Math.min;
            const playAddon = addon.play;
            if (playAddon && Is(playAddon.match)) {
              if (playAddon.vip && !document.querySelector(".o--vip")) {
                function formatPassedTime(n) {
                  return ((Date.now() - n) / 1e3).toFixed(2) + "s";
                }
                async function updateQrcode() {
                  let url = 0 < arguments.length && void 0 !== arguments[0] ? arguments[0] : Href;
                  isMobile || (!qrcodeCode && (qrcodeCode = await fetchCdnUrl("/qrcode-generator/1.4.4/qrcode.min.js")),
                  eval(qrcodeCode), qrcode && (QR = qrcode(0, "L"), QR.addData(url), QR.make(), $(".o--qrcode-box").removeClass("o--hide"),
                  $(".o--qrcode").html(QR.createImgTag())));
                }
                function fixUrl(n) {
                  return n.replace(/[\?#].+/g, "");
                }
                function fixVipUrl(n) {
                  const e = ADDONS.find((function(e) {
                    return Is(e.match, n) && e.play && e.play.fixUrl;
                  }));
                  return e ? !0 === e.play.fixUrl ? fixUrl(n) : e.play.fixUrl(n) : n;
                }
                function getVipTargetUrl() {
                  if (ooPlayUrl) return ooPlayUrl;
                  let n = location.href.replace(/&?\w+=http[^&]+/, "").replace(/.+http/, "http");
                  return n = decodeURI(fixVipUrl(n) || n), n;
                }
                function canPlayInPage(n) {
                  return !isOnlyDownloadVideoUrlRegex.test(n) && (!/\/\/vwecam.tc.qq.com/.test(n) || Is("v.qq.com"));
                }
                function toShortVideoUrl(n) {
                  const e = n.match(shortVideoUrlRegex) || n.match(shortVideoUrlLoseRegex);
                  return e ? e[1].split(".").slice(-2).join(".") + " ... " + e[e.length - 2].slice(-10) + "<span> . " + e[e.length - 1] + "</span>" : n;
                }
                function fixIframeUrl(n) {
                  return n.replace(/\/?\?.+/, "");
                }
                function getIframeId(n) {
                  return iframes[fixIframeUrl(n)];
                }
                function getIframe(n) {
                  return frames[getIframeId(n)];
                }
                function setIframe(n, e) {
                  iframes[fixIframeUrl(n)] = e;
                }
                function addIframe(n) {
                  let e = 1 < arguments.length && void 0 !== arguments[1] ? arguments[1] : "oo-iframes";
                  const t = document.createElement("iframe");
                  return t.id = uuid(), t.frameborder = "0", t.scrolling = "no", t.seamless = !0,
                  t.sandbox = "allow-scripts allow-same-origin allow-forms", n && (t.src = n, setIframe(n, t.id)),
                  $(e).append(t), t;
                }
                function removeIframe() {
                  let n = 0 < arguments.length && void 0 !== arguments[0] ? arguments[0] : "oo-iframes > iframe";
                  const e = $("string" == typeof n ? n.startsWith("oo-iframes") ? n : "#" + n : n.id ? "#" + n.id : n).get(0);
                  e && (e.src = "about:blank", $(e).remove());
                }
                function emptyIframes() {
                  $("oo-iframes > iframe").each((function(n, e) {
                    removeIframe(e);
                  })), $("oo-iframes").empty();
                }
                function getSniffTime(n) {
                  const e = sniffTimes[fixIframeUrl(n)];
                  return e ? formatPassedTime(e) : "0s";
                }
                function sniffStart() {
                  isSniffing = !0, isEnsurePlayingCheck = !1, sniffTimestamp = Date.now(), sniffUrls = [],
                  sniffUrlsKey = [], $(".o--player").empty(), $("html").addClass("o--sniffing"), $(".o--vip").removeClass("is-play-in-page"),
                  blobCount = 0, $(".o--vip-item.is-blob").remove(), progressInterval = setInterval((function() {
                    $(".o--sniff-progress").css({
                      width: +$(".o--sniff-progress").css("width").replace("%", "") + .1 + "%"
                    });
                  }), 200);
                }
                function sniffDone() {
                  formatPassedTime(sniffStartTime), isSniffing = !1, emptyIframes(), $(".o--sniff-progress").css({
                    width: "100%"
                  }), clearInterval(progressInterval), $(".o--vip").removeClass("is-sniffing").addClass("is-sniff-done"),
                  $("html").removeClass("o--sniffing"), 0 < sniffUrls.length && 0 === $(".o--sniff-done").length && $(".o--vip-play .o--sources").length && $(".o--vip-play .o--sources").append('<span class="o--sniff-done">✔</span>'),
                  setTimeout((function() {
                    $(".o--sniff-progress").css({
                      width: "0"
                    });
                  }), 1e3);
                }
                function sniffSuccess(n, e) {
                  const t = (n = decodeURIComponent(n.trim()).replace(/^(http:)?\/\//, "https://")).replace(/\?.+/, "");
                  if (sniffUrlsKey.includes(t)) return;
                  sniffUrlsKey.push(t), sniffUrls.push(n);
                  const i = sniffUrls.length, o = n.match(videoExtRegex), a = o ? o[1] : "unknow";
                  if ($(".o--vip-play .o--sources").append('<a _href="' + ("blob" === a ? e : n) + '" class="is-' + a + '">线路' + i + "</a>"),
                  $(".o--vip-play .o--sources a").off("click").on("click", (function() {
                    const n = $(this).attr("_href");
                    updateQrcode(n);
                    let e = document.querySelector(".o--player video");
                    e || ($(".o--player").prepend('<video class="o--video" poster="' + PlayerPlayingCover + '" controls playsinline></video>'),
                    e = document.querySelector(".o--player video"));
                    const t = getGlobal("Plyr"), i = getGlobal("Hls") || getGlobal("hls");
                    if (!player && t && (player = new t(e, {
                      debug: _D,
                      invertTime: !1,
                      autoplay: !0,
                      volume: .75,
                      speed: {
                        selected: 1,
                        options: [ .5, .75, 1, 1.25, 1.5, 2 ]
                      },
                      storage: {
                        enabled: !0,
                        key: storePrefix + "plyr"
                      }
                    }), player.on("enterfullscreen", (function() {
                      $("html").addClass("o--fullscreen");
                    })), player.on("exitfullscree", (function() {
                      $("html").removeClass("o--fullscreen");
                    }))), $(".o--player-bg").remove(), /\.m3u8/.test(n) && i && i.isSupported()) {
                      const t = new i;
                      t.loadSource(n), t.attachMedia(e), t.on(i.Events.MANIFEST_PARSED, (function() {
                        e.play();
                      }));
                    } else e.src = n, e.addEventListener("loadedmetadata", (function() {
                      e.play();
                    }));
                    $(".o--play-url").html('来源：<a _href="' + n + '">' + toShortVideoUrl(n) + "</a>" + (canPlayInPage(n) ? '<span class="o--span">如果全部线路都无法播放，可以点击来源链接下载来播放，或使用单个解析播放。</span>' : '<span class="o--span is-warning"><span>该链接无法在当前站点播放，请点击来源下载播放</span></span>')),
                    $(".o--play-url a").off("click").on("click", (function() {
                      const n = $(this).attr("_href");
                      isHiker && window.fy_bridge_app.playVideo ? window.fy_bridge_app.playVideo(n) : isMixia && window.mx_browser_obj.playvideo ? window.mx_browser_obj.playvideo(n, n) : window.open(n, "_blank", "noopener");
                    })), $(".o--vip-play .o--sources a").removeClass("is-active"), $(this).addClass("is-active");
                  })), 1 === i) {
                    let n;
                    $(".o--vip-play .o--sources a").get(0).click(), $(".o--vip").addClass("is-sniff-success"),
                    $(".o--vip-play").removeClass("is-hide"), isEnsurePlayingCheck = !0, setTimeout((function e() {
                      if (isEnsurePlayingCheck) return player && player.ready && 0 < player.duration ? void (isEnsurePlayingCheck = !1) : ((n = document.querySelector(".o--vip-play .o--sources a.is-active + a")) ? n.click() : 1 < i && (n = document.querySelector(".o--vip-play .o--sources a"),
                      n && n.click()), void setTimeout(e, 4500));
                    }), 4e3);
                  }
                }
                function sniffFail() {
                  sniffDone(), $(".o--player-bg").addClass("is-fail"), $(".o--vip").addClass("is-sniff-fail");
                }
                function iSniff() {}
                function hikerSniff(sniffTickId) {
                  if (sniffTickId !== sniffTick) return;
                  let resource = eval(window.fy_bridge_app.getNetworkRecords());
                  resource = resource.filter((function(n) {
                    return n.timestamp > sniffTimestamp && isValidVideoUrl(n.url);
                  })), isSniffing && (resource.forEach((function(n) {
                    sniffSuccess(n.url);
                  })), setTimeout((function() {
                    hikerSniff(sniffTickId);
                  }), 100));
                }
                function mixiaSniff(n) {
                  if (n !== sniffTick) return;
                  let e = [], t = window.mx_browser_obj.getweblogs("http");
                  "error" !== t && (e = t.trim().split(/\s*\n[\n\s]*/), e = e.filter((function(n) {
                    return isValidVideoUrl(n);
                  }))), isSniffing && (e.forEach((function(n) {
                    sniffSuccess(n);
                  })), setTimeout((function() {
                    mixiaSniff(n);
                  }), 100));
                }
                function insertPlayerHtml() {
                  let n = 0 < arguments.length && void 0 !== arguments[0] ? arguments[0] : "";
                  const e = getVipPlayer();
                  if (e) {
                    const t = '<div class="o--player-bg" style="background-image: url(' + getCdnImageUrl(PlayerLoadingCovers[parseInt(Date.now() / 1e3) % PlayerLoadingCovers.length]) + ');"><div class="o--player-mask"></div><div class="o--sniff-progress"></div><div class="o--sign">(o˘◡˘o)<span class="o--version">v ' + VERSION + '</span></div><div class="o--slogan"><strong>觅</strong><div class="o--loader">' + Icon.loader + '</div><strong>影</strong></div><div class="o--error-text">解析失败，可以尝试使用单个解析播放，或者到其它正版网站上解析</div></div>';
                    $(e).empty().append('<div class="o--player">' + t + n + "</div>"), $(".o--player").parent().addClass("o--player-box");
                    const i = Date.now(), o = setInterval((function() {
                      Date.now() - i > 9e4 && clearInterval(o), $(".o--player-box > *:not(.o--player)").remove();
                    }), 1e3);
                  }
                }
                function sniff(n) {
                  if (isSniffing && sniffDone(), sniffStart(), isAllowIframeSniff) iSniff(); else if (isAllowHikerSniff) hikerSniff(n); else {
                    if (!isAllowMixiaSniff) return void sniffDone();
                    mixiaSniff(n);
                  }
                  insertPlayerHtml(isMobile ? "" : '<div class="o--vip-play is-hide"><div class="o--sources"></div><div class="o--play-url"></div></div>'),
                  isMobile && ($(".o--vip-play").remove(), $(".o--vip-panel").after('<div class="o--vip-play is-hide"><div class="o--sources"></div><div class="o--play-url"></div></div>')),
                  pausePlay(), sniffUrls = [], sniffTimes = {}, sniffIndex = -1, goSniff();
                }
                function goSniff() {
                  if (!isSniffing) return;
                  sniffIndex += 1;
                  const n = V_U[sniffIndex], e = (sniffIndex + 1) / (V_U.length + 1), t = (sniffUrls.length + 1) / MAX_SNIFF_PLAY_COUNT, i = _Mathmin(10 * (2.5 * e + 2.5 * t + 5 * _Mathmax(e, t) + .5), 99).toFixed(4) + "%";
                  if ($(".o--sniff-progress").css({
                    width: i
                  }), !n) {
                    const n = setInterval((function() {
                      if (0 === $("oo-iframes > iframe").length && (clearInterval(n), sniffDone(), 0 === sniffUrls.length)) {
                        const n = document.querySelector(".o--vip-item.is-blob");
                        n ? n.click() : sniffFail();
                      }
                    }), 1e3);
                    return;
                  }
                  if (sniffUrls.length >= MAX_SNIFF_PLAY_COUNT + (player && player.ready && 0 < player.duration ? -1 : 2) || sniffUrls.length >= MAX_SNIFF_PLAY_COUNT / 2 && Date.now() - sniffTimestamp > 1e3 * _Mathmax(250 - 10 * sniffUrls.length, 150)) return void sniffDone();
                  const o = getVipTargetUrl(), a = M_VipUrl(n) + o;
                  sniffTimes[fixIframeUrl(a)] = Date.now();
                  const r = addIframe(a), s = isMobile ? 7 : 5;
                  r.onload = function() {
                    setTimeout((function() {
                      removeIframe(r, "TIMEOUT");
                    }), 12e3);
                  }, setTimeout((function() {
                    removeIframe(r, "MAX TIMEOUT"), setTimeout((function() {
                      isSniffing && 0 === $("oo-iframes > iframe").length && sniffIndex >= V_U.length - 1 && sniffDone();
                    }), 1500);
                  }), 15e3), function n() {
                    const e = $("oo-iframes > iframe").length;
                    if (e > s - 1) setTimeout((function() {
                      n();
                    }), 100); else {
                      const n = player && player.ready && 0 < player.duration, t = _Mathmin(sniffUrls.length * (n ? 200 : 150) + 100 * (s - e) + _Mathmin(50 * sniffIndex, 1e3), 3e3) * (isMobile ? .7 : 1);
                      setTimeout((function() {
                        goSniff();
                      }), t);
                    }
                  }();
                }
                async function autoSniffPlay() {
                  await playBefore(), 0 < sniffTick && sniffDone(), sniffStartTime = Date.now(), sniff(++sniffTick),
                  $(".o--vip").removeClass("is-sniff-success is-sniff-done").addClass("is-sniffing");
                }
                function pausePlay() {
                  try {
                    $("video:not(.o--video), audio").each((function(n, e) {
                      e.pause(), e.volume = 0, e.muted = !0, $("video:not(.o--video), audio").each((function(n, e) {
                        $(e).remove();
                      }));
                    }));
                    const n = Date.now(), e = setInterval((function() {
                      const t = Date.now() - n, i = getGlobal("playerObject") || getGlobal("MGTVPlayer") && getGlobal("MGTVPlayer").player || getGlobal("videoPlayer") || getGlobal("PLAYER");
                      i && (i.pause instanceof Function && i.pause(), i.mute instanceof Function && i.mute()),
                      (!i || t > 9e4) && clearInterval(e);
                    }), 60);
                  } catch (n) {}
                }
                async function playBefore() {
                  $(".o--vip-play").removeClass("is-hide"), isLoadPlayer || (addCss("/plyr/3.6.2/plyr.css"),
                  await addJs("/hls.js/0.13.2/hls.min.js"), await addJs("/plyr/3.6.2/plyr.min.js"),
                  isLoadPlayer = !0);
                }
                function getVipPlayer() {
                  return $(PlayerSelector).get(0) || $("#player, .player").get(0);
                }
                function playInPage(n) {
                  $(".o--player").removeClass("is-loaded");
                  getVipPlayer() ? (pausePlay(), insertPlayerHtml('<iframe id="o--player-iframe" style="width: 100%; height: 100%; border: none; outline: none;"  width="100%" height="100%" allowfullscreen="true" allowtransparency="true" frameborder="0" scrolling="no" sandbox="allow-scripts allow-same-origin allow-forms" src="' + n + '"></iframe>')) : location.href = n,
                  setTimeout((function() {
                    $(".o--player").addClass("is-loaded");
                  }), 2500);
                }
                function playVipUrl(n) {
                  if (!n) return;
                  const e = n + getVipTargetUrl();
                  $(".o--vip").removeClass("is-sniff-success is-sniff-done is-sniffing").addClass("is-play-in-page"),
                  updateQrcode(e), isPlayingInPage && !/http:/.test(n) ? playInPage(e) : (pausePlay(),
                  $("#o--player-iframe").remove(), $(".o--player").removeClass("is-loaded"), setTimeout((function() {
                    window.open(e, "_blank");
                  }), 100));
                }
                function playVipItem(n) {
                  const e = 0 < $(n).length;
                  let t = e ? $(n).hasClass("o--vip-sniff") ? "auto" : $(n).attr("_href") : Store.get("lastPlayChoice", "");
                  $(".o--vip-item").removeClass("is-active"), $(".o--vip-list ~ .o--tip").removeClass("o--hide"),
                  e ? $(n).addClass("is-active") : t.startsWith("http") ? ($(".o--vip-item:not(.o--vip-sniff)").each((function() {
                    $(this).attr("_href") === t && $(this).addClass("is-active");
                  })), playVipUrl(t)) : $(".o--vip-item.o--vip-sniff").addClass("is-active"), isSniffing && sniffDone(),
                  t.startsWith("http") ? playVipUrl(t) : autoSniffPlay(), Store.set("lastPlayChoice", t);
                }
                function M_Source(n) {
                  return n ? n.replace(/(\w+)/g, (function(n, e) {
                    return M_String(e);
                  })) : "";
                }
                function M_VipUrl(n) {
                  if (!n) return "";
                  const e = M_Source(n);
                  return "https://" + e + (e.includes("?") ? "" : (e.endsWith(".") ? "php" : /\/$/.test(e) ? "" : "/") + "?url") + "=";
                }
                function insertVipSource(n) {
                  function e() {
                    $(".o--setting-button").off("click").on("click", (function() {
                      $(".o--vip").toggleClass("is-setting-on");
                    })), $(".o--toggle").off("click").on("click", (function() {
                      $(this).toggleClass("is-n"), $(this).hasClass("o--action-pip") ? (isPlayingInPage = !isPlayingInPage,
                      GlobalStore.set("isPlayingInPage", isPlayingInPage)) : $(this).hasClass("o--action-skip-ad") && (isSkipAdVideo = !isSkipAdVideo,
                      Store.set("isSkipAdVideo", isSkipAdVideo));
                    })), $(".o--edit-vip-source-panel textarea").off("input").on("input", (function() {
                      GlobalStore.set("VipUrls", $(this).val());
                    })), $(".o--vip-item:not(.o--normal)").off("click").on("click", (function() {
                      playVipItem(this);
                    })), $(".o--log-button").off("click").on("click", (function() {
                      $("oo-logs").toggleClass("is-active");
                    }));
                  }
                  let t = 1 < arguments.length && void 0 !== arguments[1] ? arguments[1] : "after", i = 2 < arguments.length && void 0 !== arguments[2] ? arguments[2] : 0;
                  if (0 < $(".o--vip").length || 20 < i) return;
                  const o = $(n);
                  if (0 === o.length) return void setTimeout((function() {
                    insertVipSource(n, t, i + 1);
                  }), 250);
                  const a = vipUrls.length > collapseNum;
                  let r = (isMobile ? "" : '<div class="o--action o--toggle o--action-skip-ad' + (isSkipAdVideo ? "" : " is-n") + '"><span class="o--y">是</span><span class="o--n">否</span>加速跳广告</div>') + '<div class="o--action o--toggle o--action-pip' + (isPlayingInPage ? "" : " is-n") + '"><span class="o--y">是</span><span class="o--n">否</span>开启原网页解析播放</div><div class="o--action"><a href="https://greasyfork.org/zh-CN/scripts/393284" target="_blank">油猴地址</a></div>';
                  o.eq(0)[t]('<div class="o--vip' + (isAllowSniff ? " is-allow-sniff" : "") + '"><div class="o--sniff-progress"></div><div class="o--vip-panel"><div class="o--vip-title"><span class="o--vip-title-text">' + PLUGIN_NAME + '<span class="o--vip-small">v' + VERSION + "</span></span>" + (_D ? '<span class="o--log-button">LOG</span>' : "") + '</div><div class="o--menus"><div class="o--qrcode-box o--hide">' + Icon.qrcode + '<div class="o--qrcode-text">手机扫码看</div><div class="o--qrcode"></div></div><div class="o--setting-button">' + Icon.panda + '</div></div></div><div class="o--setting-panel"><div class="o--actions">' + r + '</div><div class="o--edit-vip-source-panel"><div class="o--edit-hint">刷新生效，清空恢复默认（原网页解析只支持 https  解析）</div><textarea placeholder="清空会使用默认值">' + customVipUrls.trim() + '</textarea><div class="o--slogan-text"><strong>觅</strong>即知君不可见，挥毫点染湖山<strong>影</strong></div></div></div><div class="o--vip-list"><span class="o--vip-item o--vip-sniff">' + Icon.vip + '<i class="o--bubble o--b1"></i><i class="o--bubble o--b2"></i><i class="o--bubble o--b3"></i></span>' + vipUrls.map((function(n) {
                    let e = "o--vip-item";
                    return n.url.startsWith("https") && (e += " is-play-in-page"), n.isRandom && (e += " is-random"),
                    '<span class="' + e + '" _href="' + n.url + '">' + n.name + "</span>";
                  })).join("\n") + (a ? '<span class="o--vip-item o--normal o--collapse">➢</span>' : "") + "</div>" + (isMobile ? '<div class="o--tip o--hide">多数解析会在移动端显示<strong>图片广告</strong>，需手动拦截。<br>配合浏览器的<strong>嗅探功能</strong>使用，体验更佳。</div>' : "") + "</div>"),
                  a && smartCollapse(".o--vip-item");
                  let s = 0, l = setInterval((function() {
                    e(), 100 < s++ && clearInterval(l);
                  }), _Mathmin(200 + 50 * s, 1e3));
                }
                const VipUrls = "M2090 https://m2090.com/jx?url=\n蓝调影视 http://lcoc.top/coc/jiexi.php?url=\nbaidu.oss.aliyuncs http://47.97.170.115:39001/jiexi/?url=\n盘古 https://jxla.ylybz.cn/pangu/jiexi.php?url=\n8B https://api.8bjx.cn/qw/?url=\n无名小站 https://www.administratorw.com/video.php?url=\nu2h https://u2h.cn/vip.php?url=\n人人 https://vip.mpos.ren/v/?url=\nH8 https://www.h8jx.com/jiexi.php?url=\n69 https://api.69ne.com/?url=\noopw http://api.oopw.top/jiexi/?url=\nTV920 https://api.tv920.com/vip/?url=\n618 https://jx.618g.com/?url=", PlayerSelector = "#iframaWrapper, #mgtv-player-wrap, #sohuplayer .x-player, #wPlayer, #video-box, #playerbox, .td-h5__player, .td-playbox, .iqp-player, .g-play .video-area, #mod_player, #playBox, #j-player, #video, .m-video-player, .site_player", D_V_U = "wi.811usg.npd,oju.jwfji34.ops,job.138us.npd·wi,jwfji.hj7na.md,wi.xzz88.npd,u.czd6.npd·oju,wilp.dd,bbbri.npd·wi.,jwfji.l192.npd,wi.usjzvpz.npd,u.fjipbanm.npd·jqhmjn·jqhmjn.,xxx.upnld.yzw·wi·job,md.mbgtmbaia.md·wi.,xxx.jtpbjcw.npd·oju,wi.ilkqv.npd,xxx.ukewm.npd,wi.b98.lmj,xxx.wi9g.npd·jwfji.,zbko.68pe.md,xxx.jwfjivhmbo.dd·jwfji.,xxx.h1819.md·jwfji,wi.dsxkf.npd·oju,job.jwfji.bk,xxx.9v2nzbko.md·jwfji.,job.wivhjt.npd,xxx.mvz6060.npd·wi·zs.,job.wi638.npd·oju,f177.npd,wi.fgdbk.fn·dd,wi.h907.npd,oju.tpon.mfq·u,mcd.vihmbz.oju·l,wi.190111.ops·wi,job.134247.ops·oju,wi.22ab.ops·oju,wi.94nl.ops·wi,o617.npd", V_N = "曾经沧海难为水，山形依旧枕寒流。人生若只如初见，自在飞花轻似梦。韶华不为少年留，桃花依旧笑春风。山雨欲来风满楼，别有人间行路难。满船清梦压星河，一蓑烟雨任平生。人间有味是清欢，此心安处是吾乡。", MAX_SNIFF_PLAY_COUNT = isMobile ? 15 : 12;
                let isAllowIframeSniff = GlobalStore.get("isAllowIframeSniff") || !1;
                const isHiker = !!window.fy_bridge_app, isMixia = !!window.mx_browser_obj, isAllowHikerSniff = isHiker && !!window.fy_bridge_app.getNetworkRecords, isAllowMixiaSniff = isMixia && !!window.mx_browser_obj.getweblog;
                let player, isAllowSniff = isAllowHikerSniff || isAllowMixiaSniff || isAllowIframeSniff, sniffTimestamp = Date.now(), isSniffing = !1, sniffTick = 0, sniffUrls = [], sniffUrlsKey = [], isPlayingInPage = GlobalStore.get("isPlayingInPage", !isMobile), isLoadPlayer = !1, sniffTimes = {}, sniffStartTime = Date.now(), QR = "", qrcodeCode = "", blobCount = 0;
                const blobNames = "①②③④⑤⑥⑦⑧⑨⑩⑪⑫⑬⑭⑮⑯⑰⑱⑲⑳", iframes = {};
                let progressInterval = null, isEnsurePlayingCheck = !1;
                E.on("playurl.change", (function(n) {
                  n ? playVipItem($(".o--vip-item.is-active")) : (sniffDone(), $(".o--vip-item").removeClass("is-active"));
                })), E.on("enable.sniff", (function(n) {
                  n.from === SniffCheckUrl && $("oo-iframes > iframe").each((function(n, e) {
                    e.src === SniffCheckUrl && removeIframe(e);
                  })), isAllowIframeSniff || (isAllowIframeSniff = !0, isAllowSniff = !0, GlobalStore.set("isAllowIframeSniff", !0),
                  $(".o--vip").addClass("is-allow-sniff"), $(".o--vip-item.is-random").remove(), smartCollapse(".o--vip-item"));
                })), E.on("sniff.fail", (function(n) {
                  if (isAllowSniff) {
                    removeIframe(getIframeId(n.from));
                  }
                })), E.on("play.video", (function(n) {
                  removeIframe(getIframeId(n.from)), sniffSuccess(n.url, n.from);
                })), E.on("sniff.blob", (function(n) {
                  removeIframe(getIframeId(n.from));
                  const e = n.from.replace(/=http.+/, "=");
                  let t = !1;
                  if ($(".o--vip-item.is-play-in-page").each((function(n, i) {
                    $(i).attr("_href") === e && (t = !0);
                  })), !t) {
                    const n = blobNames[blobCount++] || "解析" + blobCount;
                    $(".o--vip-item.is-play-in-page:not(.is-blob)").eq(0).before('<span class="o--vip-item is-play-in-page is-blob" _href="' + e + '">' + n + "</span>"),
                    $(".o--vip-item:not(.o--normal)").off("click").on("click", (function() {
                      playVipItem(this);
                    }));
                  }
                }));
                const charToNum = function(n) {
                  return n.charCodeAt(0) - 97;
                }, numToChar = function(n) {
                  return (0, String.fromCharCode)(97 + n);
                }, M_Number = function(n) {
                  return +n + (1 == n % 2 ? -1 : 1);
                }, M_Letter = function(n) {
                  return numToChar(M_Number(charToNum(n)));
                }, M_Char = function(n) {
                  return /[a-z]/i.test(n) ? M_Letter(n) : /\d/.test(n) ? M_Number(n) : "";
                }, M_String = function(n) {
                  return n.split("").reverse().map((function(n) {
                    return M_Char(n);
                  })).join("");
                };
                let V_U = "wi.811usg.npd,oju.jwfji34.ops,job.138us.npd·wi,jwfji.hj7na.md,wi.xzz88.npd,u.czd6.npd·oju,wilp.dd,bbbri.npd·wi.,jwfji.l192.npd,wi.usjzvpz.npd,u.fjipbanm.npd·jqhmjn·jqhmjn.,xxx.upnld.yzw·wi·job,md.mbgtmbaia.md·wi.,xxx.jtpbjcw.npd·oju,wi.ilkqv.npd,xxx.ukewm.npd,wi.b98.lmj,xxx.wi9g.npd·jwfji.,zbko.68pe.md,xxx.jwfjivhmbo.dd·jwfji.,xxx.h1819.md·jwfji,wi.dsxkf.npd·oju,job.jwfji.bk,xxx.9v2nzbko.md·jwfji.,job.wivhjt.npd,xxx.mvz6060.npd·wi·zs.,job.wi638.npd·oju,f177.npd,wi.fgdbk.fn·dd,wi.h907.npd,oju.tpon.mfq·u,mcd.vihmbz.oju·l,wi.190111.ops·wi,job.134247.ops·oju,wi.22ab.ops·oju,wi.94nl.ops·wi,o617.npd";
                const NoMobileVipUrlRegex = /jx\.wslmf\.com/, storeVipUrls = (GlobalStore.get("VipUrls") || "").trim(), customVipUrls = storeVipUrls || "北极 http://beijixs.cn/?url=\n蓝调影视 http://lcoc.top/coc/jiexi.php?url=\nbaidu.oss.aliyuncs http://47.97.170.115:39001/jiexi/?url=\n盘古 https://jxla.ylybz.cn/pangu/jiexi.php?url=\n8B https://api.8bjx.cn/qw/?url=\n无名小站 https://www.administratorw.com/video.php?url=\nu2h https://u2h.cn/vip.php?url=\n人人 https://vip.mpos.ren/v/?url=\nH8 https://www.h8jx.com/jiexi.php?url=\n69 https://api.69ne.com/?url=\noopw http://api.oopw.top/jiexi/?url=\nTV920 https://api.tv920.com/vip/?url=\n618 https://jx.618g.com/?url=", vipUrls = ensureArray(customVipUrls).map((function(n) {
                  let e = n.split(/\s+/);
                  if (n = e.pop(), !/^http.+=/.test(n)) return {};
                  let t = 0 < e.length ? e.join(" ") : n.match(/\/\/(.+\.)?([^\/]+)\.\w+\//)[2].replace(/^(\w)/, (function(n) {
                    return n.toUpperCase();
                  }));
                  return {
                    url: n,
                    name: t
                  };
                })).filter((function(n) {
                  return n.url && (!isMobile || !NoMobileVipUrlRegex.test(n.url));
                }));
                if (V_U = V_U.replace(/·/g, "/").split(","), !storeVipUrls || storeVipUrls === "北极 http://beijixs.cn/?url=\n蓝调影视 http://lcoc.top/coc/jiexi.php?url=\nbaidu.oss.aliyuncs http://47.97.170.115:39001/jiexi/?url=\n盘古 https://jxla.ylybz.cn/pangu/jiexi.php?url=\n8B https://api.8bjx.cn/qw/?url=\n无名小站 https://www.administratorw.com/video.php?url=\nu2h https://u2h.cn/vip.php?url=\n人人 https://vip.mpos.ren/v/?url=\nH8 https://www.h8jx.com/jiexi.php?url=\n69 https://api.69ne.com/?url=\noopw http://api.oopw.top/jiexi/?url=\nTV920 https://api.tv920.com/vip/?url=\n618 https://jx.618g.com/?url=".trim()) {
                  const n = V_N.split(/[，。；]/).map((function(n) {
                    return n.trim();
                  })).filter((function(n) {
                    return n;
                  })), e = n[parseInt(Date.now() / 1e3 / 60 % n.length)].split("");
                  V_U.slice(0, 7).map((function(n, t) {
                    vipUrls.push({
                      name: e[t],
                      url: M_VipUrl(n),
                      isRandom: !0
                    });
                  }));
                }
                if (!isCheckIframeSniff) {
                  $("html").append('<oo-iframes style="visibility: hidden; position: fixed; bottom: 0; pointer-events: none;"></oo-iframes>');
                  const n = addIframe(SniffCheckUrl);
                  setTimeout((function() {
                    removeIframe(n);
                  }), 5e3), isCheckIframeSniff = !0;
                }
                const vips = Array.isArray(playAddon.vip) ? playAddon.vip : [ playAddon.vip ];
                vips.forEach((function(n) {
                  insertVipSource((n = n.split(/\s*\|\s*/))[0], n[1]);
                }));
              }
              playAddon.title && !document.querySelector(".o--jump") && (playAddon.vip && $$((function() {
                return $(playAddon.title).eq(0).text();
              }), (function(n) {
                playAddon.fixTitle && (n = playAddon.fixTitle(n)), insertSearchAddon(n, ".o--vip-list", "after");
              })), playAddon.jump && goJump(playAddon.jump, playAddon.title)), execAddonJs(playAddon);
            }
            const searchAddon = addon.search;
            if (searchAddon && Is(searchAddon.match)) {
              if (searchAddon.jump && goJump(searchAddon.jump, searchAddon.keyword), searchAddon.jumpTo && $$(searchAddon.jumpTo[0], (function() {
                $(searchAddon.jumpTo[0]).each((function() {
                  let n = $(this).attr("href");
                  $(this).attr("href", n.replace(searchAddon.jumpTo[1], searchAddon.jumpTo[2]));
                }));
              })), searchAddon.result) {
                const n = "string" == typeof searchAddon.result ? {
                  title: searchAddon.result,
                  url: searchAddon.result
                } : searchAddon.result;
                if (1 === $(n.title).length) {
                  const e = $(n.title).text();
                  if (!/第.{1,3}[季集话部].*$/.test(e)) {
                    const e = $(n.url).eq(0).attr("href");
                    e && (location.href = e);
                  }
                }
              }
              execAddonJs(searchAddon);
            }
            execAddonJs(addon);
          })), isFirstRunAddon = !1;
        } else isFirstRunAddon && ($("html").removeClass("o--miying o--m o--pc o--debug"),
        setTimeout((function() {
          $html.removeAttribute(PLUGIN_ATTR);
        }), 1e3));
      }
      function urlDetector() {
        setInterval((function() {
          !function() {
            if (Href !== window.location.href) {
              const n = Href;
              Href = window.location.href, E.emit("url.change", {
                newUrl: Href,
                oldUrl: n
              });
            }
          }();
        }), 250);
      }
      let isFirstRunAddon = !0, isCheckIframeSniff = !1;
      try {
        addonGo();
      } catch (n) {}
      urlDetector();
    }
  }
}();