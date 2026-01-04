// ==UserScript==
// @name                绅士辅助工具
// @description         绅士辅助增强脚本，提供下载功能
//
// @author              xiao
// @license             GPLv3.0
// @namespace           https://github.com/xiaoboost
// @supportURL          https://github.com/xiaoboost/scripts/issues
// @homepageURL         https://github.com/xiaoboost/scripts/tree/master/packages/e-hentai
// @icon                https://ehwiki.org/images/c/cd/E-Hentai.png
//
// @grant               GM_addStyle
// @grant               GM_notification
// @grant               GM_xmlhttpRequest
// @grant               unsafeWindow
// @run-at              document-start
// @include             https://e-hentai.org/*
// @include             https://exhentai.org/*
//
// @date                2022/01/14
// @modified            2023/10/14
// @version             1.2.5
// @downloadURL https://update.greasyfork.org/scripts/438541/%E7%BB%85%E5%A3%AB%E8%BE%85%E5%8A%A9%E5%B7%A5%E5%85%B7.user.js
// @updateURL https://update.greasyfork.org/scripts/438541/%E7%BB%85%E5%A3%AB%E8%BE%85%E5%8A%A9%E5%B7%A5%E5%85%B7.meta.js
// ==/UserScript==

(() => {
  // src/features/gallery-downloader/components/download-button/style.jss.ts
  var style_jss_default = {
    classes: {
      "downBtn": "script-down-btn-0"
    },
    toString: function() {
      return `.script-down-btn-0 {
  cursor: pointer;
}`;
    }
  };

  // ../../node_modules/.pnpm/registry.npmmirror.com+preact@10.6.4/node_modules/preact/dist/preact.module.js
  var n;
  var l;
  var u;
  var i;
  var t;
  var r;
  var o;
  var f;
  var e = {};
  var c = [];
  var s = /acit|ex(?:s|g|n|p|$)|rph|grid|ows|mnc|ntw|ine[ch]|zoo|^ord|itera/i;
  function a(n2, l3) {
    for (var u3 in l3)
      n2[u3] = l3[u3];
    return n2;
  }
  function h(n2) {
    var l3 = n2.parentNode;
    l3 && l3.removeChild(n2);
  }
  function v(l3, u3, i3) {
    var t3, r3, o3, f3 = {};
    for (o3 in u3)
      o3 == "key" ? t3 = u3[o3] : o3 == "ref" ? r3 = u3[o3] : f3[o3] = u3[o3];
    if (arguments.length > 2 && (f3.children = arguments.length > 3 ? n.call(arguments, 2) : i3), typeof l3 == "function" && l3.defaultProps != null)
      for (o3 in l3.defaultProps)
        f3[o3] === void 0 && (f3[o3] = l3.defaultProps[o3]);
    return y(l3, f3, t3, r3, null);
  }
  function y(n2, i3, t3, r3, o3) {
    var f3 = { type: n2, props: i3, key: t3, ref: r3, __k: null, __: null, __b: 0, __e: null, __d: void 0, __c: null, __h: null, constructor: void 0, __v: o3 == null ? ++u : o3 };
    return o3 == null && l.vnode != null && l.vnode(f3), f3;
  }
  function d(n2) {
    return n2.children;
  }
  function _(n2, l3) {
    this.props = n2, this.context = l3;
  }
  function k(n2, l3) {
    if (l3 == null)
      return n2.__ ? k(n2.__, n2.__.__k.indexOf(n2) + 1) : null;
    for (var u3; l3 < n2.__k.length; l3++)
      if ((u3 = n2.__k[l3]) != null && u3.__e != null)
        return u3.__e;
    return typeof n2.type == "function" ? k(n2) : null;
  }
  function b(n2) {
    var l3, u3;
    if ((n2 = n2.__) != null && n2.__c != null) {
      for (n2.__e = n2.__c.base = null, l3 = 0; l3 < n2.__k.length; l3++)
        if ((u3 = n2.__k[l3]) != null && u3.__e != null) {
          n2.__e = n2.__c.base = u3.__e;
          break;
        }
      return b(n2);
    }
  }
  function m(n2) {
    (!n2.__d && (n2.__d = true) && t.push(n2) && !g.__r++ || o !== l.debounceRendering) && ((o = l.debounceRendering) || r)(g);
  }
  function g() {
    for (var n2; g.__r = t.length; )
      n2 = t.sort(function(n3, l3) {
        return n3.__v.__b - l3.__v.__b;
      }), t = [], n2.some(function(n3) {
        var l3, u3, i3, t3, r3, o3;
        n3.__d && (r3 = (t3 = (l3 = n3).__v).__e, (o3 = l3.__P) && (u3 = [], (i3 = a({}, t3)).__v = t3.__v + 1, j(o3, t3, i3, l3.__n, o3.ownerSVGElement !== void 0, t3.__h != null ? [r3] : null, u3, r3 == null ? k(t3) : r3, t3.__h), z(u3, t3), t3.__e != r3 && b(t3)));
      });
  }
  function w(n2, l3, u3, i3, t3, r3, o3, f3, s3, a3) {
    var h2, v3, p2, _2, b3, m3, g3, w3 = i3 && i3.__k || c, A = w3.length;
    for (u3.__k = [], h2 = 0; h2 < l3.length; h2++)
      if ((_2 = u3.__k[h2] = (_2 = l3[h2]) == null || typeof _2 == "boolean" ? null : typeof _2 == "string" || typeof _2 == "number" || typeof _2 == "bigint" ? y(null, _2, null, null, _2) : Array.isArray(_2) ? y(d, { children: _2 }, null, null, null) : _2.__b > 0 ? y(_2.type, _2.props, _2.key, null, _2.__v) : _2) != null) {
        if (_2.__ = u3, _2.__b = u3.__b + 1, (p2 = w3[h2]) === null || p2 && _2.key == p2.key && _2.type === p2.type)
          w3[h2] = void 0;
        else
          for (v3 = 0; v3 < A; v3++) {
            if ((p2 = w3[v3]) && _2.key == p2.key && _2.type === p2.type) {
              w3[v3] = void 0;
              break;
            }
            p2 = null;
          }
        j(n2, _2, p2 = p2 || e, t3, r3, o3, f3, s3, a3), b3 = _2.__e, (v3 = _2.ref) && p2.ref != v3 && (g3 || (g3 = []), p2.ref && g3.push(p2.ref, null, _2), g3.push(v3, _2.__c || b3, _2)), b3 != null ? (m3 == null && (m3 = b3), typeof _2.type == "function" && _2.__k === p2.__k ? _2.__d = s3 = x(_2, s3, n2) : s3 = P(n2, _2, p2, w3, b3, s3), typeof u3.type == "function" && (u3.__d = s3)) : s3 && p2.__e == s3 && s3.parentNode != n2 && (s3 = k(p2));
      }
    for (u3.__e = m3, h2 = A; h2--; )
      w3[h2] != null && (typeof u3.type == "function" && w3[h2].__e != null && w3[h2].__e == u3.__d && (u3.__d = k(i3, h2 + 1)), N(w3[h2], w3[h2]));
    if (g3)
      for (h2 = 0; h2 < g3.length; h2++)
        M(g3[h2], g3[++h2], g3[++h2]);
  }
  function x(n2, l3, u3) {
    for (var i3, t3 = n2.__k, r3 = 0; t3 && r3 < t3.length; r3++)
      (i3 = t3[r3]) && (i3.__ = n2, l3 = typeof i3.type == "function" ? x(i3, l3, u3) : P(u3, i3, i3, t3, i3.__e, l3));
    return l3;
  }
  function P(n2, l3, u3, i3, t3, r3) {
    var o3, f3, e3;
    if (l3.__d !== void 0)
      o3 = l3.__d, l3.__d = void 0;
    else if (u3 == null || t3 != r3 || t3.parentNode == null)
      n:
        if (r3 == null || r3.parentNode !== n2)
          n2.appendChild(t3), o3 = null;
        else {
          for (f3 = r3, e3 = 0; (f3 = f3.nextSibling) && e3 < i3.length; e3 += 2)
            if (f3 == t3)
              break n;
          n2.insertBefore(t3, r3), o3 = r3;
        }
    return o3 !== void 0 ? o3 : t3.nextSibling;
  }
  function C(n2, l3, u3, i3, t3) {
    var r3;
    for (r3 in u3)
      r3 === "children" || r3 === "key" || r3 in l3 || H(n2, r3, null, u3[r3], i3);
    for (r3 in l3)
      t3 && typeof l3[r3] != "function" || r3 === "children" || r3 === "key" || r3 === "value" || r3 === "checked" || u3[r3] === l3[r3] || H(n2, r3, l3[r3], u3[r3], i3);
  }
  function $(n2, l3, u3) {
    l3[0] === "-" ? n2.setProperty(l3, u3) : n2[l3] = u3 == null ? "" : typeof u3 != "number" || s.test(l3) ? u3 : u3 + "px";
  }
  function H(n2, l3, u3, i3, t3) {
    var r3;
    n:
      if (l3 === "style")
        if (typeof u3 == "string")
          n2.style.cssText = u3;
        else {
          if (typeof i3 == "string" && (n2.style.cssText = i3 = ""), i3)
            for (l3 in i3)
              u3 && l3 in u3 || $(n2.style, l3, "");
          if (u3)
            for (l3 in u3)
              i3 && u3[l3] === i3[l3] || $(n2.style, l3, u3[l3]);
        }
      else if (l3[0] === "o" && l3[1] === "n")
        r3 = l3 !== (l3 = l3.replace(/Capture$/, "")), l3 = l3.toLowerCase() in n2 ? l3.toLowerCase().slice(2) : l3.slice(2), n2.l || (n2.l = {}), n2.l[l3 + r3] = u3, u3 ? i3 || n2.addEventListener(l3, r3 ? T : I, r3) : n2.removeEventListener(l3, r3 ? T : I, r3);
      else if (l3 !== "dangerouslySetInnerHTML") {
        if (t3)
          l3 = l3.replace(/xlink[H:h]/, "h").replace(/sName$/, "s");
        else if (l3 !== "href" && l3 !== "list" && l3 !== "form" && l3 !== "tabIndex" && l3 !== "download" && l3 in n2)
          try {
            n2[l3] = u3 == null ? "" : u3;
            break n;
          } catch (n3) {
          }
        typeof u3 == "function" || (u3 != null && (u3 !== false || l3[0] === "a" && l3[1] === "r") ? n2.setAttribute(l3, u3) : n2.removeAttribute(l3));
      }
  }
  function I(n2) {
    this.l[n2.type + false](l.event ? l.event(n2) : n2);
  }
  function T(n2) {
    this.l[n2.type + true](l.event ? l.event(n2) : n2);
  }
  function j(n2, u3, i3, t3, r3, o3, f3, e3, c3) {
    var s3, h2, v3, y3, p2, k3, b3, m3, g3, x3, A, P2 = u3.type;
    if (u3.constructor !== void 0)
      return null;
    i3.__h != null && (c3 = i3.__h, e3 = u3.__e = i3.__e, u3.__h = null, o3 = [e3]), (s3 = l.__b) && s3(u3);
    try {
      n:
        if (typeof P2 == "function") {
          if (m3 = u3.props, g3 = (s3 = P2.contextType) && t3[s3.__c], x3 = s3 ? g3 ? g3.props.value : s3.__ : t3, i3.__c ? b3 = (h2 = u3.__c = i3.__c).__ = h2.__E : ("prototype" in P2 && P2.prototype.render ? u3.__c = h2 = new P2(m3, x3) : (u3.__c = h2 = new _(m3, x3), h2.constructor = P2, h2.render = O), g3 && g3.sub(h2), h2.props = m3, h2.state || (h2.state = {}), h2.context = x3, h2.__n = t3, v3 = h2.__d = true, h2.__h = []), h2.__s == null && (h2.__s = h2.state), P2.getDerivedStateFromProps != null && (h2.__s == h2.state && (h2.__s = a({}, h2.__s)), a(h2.__s, P2.getDerivedStateFromProps(m3, h2.__s))), y3 = h2.props, p2 = h2.state, v3)
            P2.getDerivedStateFromProps == null && h2.componentWillMount != null && h2.componentWillMount(), h2.componentDidMount != null && h2.__h.push(h2.componentDidMount);
          else {
            if (P2.getDerivedStateFromProps == null && m3 !== y3 && h2.componentWillReceiveProps != null && h2.componentWillReceiveProps(m3, x3), !h2.__e && h2.shouldComponentUpdate != null && h2.shouldComponentUpdate(m3, h2.__s, x3) === false || u3.__v === i3.__v) {
              h2.props = m3, h2.state = h2.__s, u3.__v !== i3.__v && (h2.__d = false), h2.__v = u3, u3.__e = i3.__e, u3.__k = i3.__k, u3.__k.forEach(function(n3) {
                n3 && (n3.__ = u3);
              }), h2.__h.length && f3.push(h2);
              break n;
            }
            h2.componentWillUpdate != null && h2.componentWillUpdate(m3, h2.__s, x3), h2.componentDidUpdate != null && h2.__h.push(function() {
              h2.componentDidUpdate(y3, p2, k3);
            });
          }
          h2.context = x3, h2.props = m3, h2.state = h2.__s, (s3 = l.__r) && s3(u3), h2.__d = false, h2.__v = u3, h2.__P = n2, s3 = h2.render(h2.props, h2.state, h2.context), h2.state = h2.__s, h2.getChildContext != null && (t3 = a(a({}, t3), h2.getChildContext())), v3 || h2.getSnapshotBeforeUpdate == null || (k3 = h2.getSnapshotBeforeUpdate(y3, p2)), A = s3 != null && s3.type === d && s3.key == null ? s3.props.children : s3, w(n2, Array.isArray(A) ? A : [A], u3, i3, t3, r3, o3, f3, e3, c3), h2.base = u3.__e, u3.__h = null, h2.__h.length && f3.push(h2), b3 && (h2.__E = h2.__ = null), h2.__e = false;
        } else
          o3 == null && u3.__v === i3.__v ? (u3.__k = i3.__k, u3.__e = i3.__e) : u3.__e = L(i3.__e, u3, i3, t3, r3, o3, f3, c3);
      (s3 = l.diffed) && s3(u3);
    } catch (n3) {
      u3.__v = null, (c3 || o3 != null) && (u3.__e = e3, u3.__h = !!c3, o3[o3.indexOf(e3)] = null), l.__e(n3, u3, i3);
    }
  }
  function z(n2, u3) {
    l.__c && l.__c(u3, n2), n2.some(function(u4) {
      try {
        n2 = u4.__h, u4.__h = [], n2.some(function(n3) {
          n3.call(u4);
        });
      } catch (n3) {
        l.__e(n3, u4.__v);
      }
    });
  }
  function L(l3, u3, i3, t3, r3, o3, f3, c3) {
    var s3, a3, v3, y3 = i3.props, p2 = u3.props, d3 = u3.type, _2 = 0;
    if (d3 === "svg" && (r3 = true), o3 != null) {
      for (; _2 < o3.length; _2++)
        if ((s3 = o3[_2]) && "setAttribute" in s3 == !!d3 && (d3 ? s3.localName === d3 : s3.nodeType === 3)) {
          l3 = s3, o3[_2] = null;
          break;
        }
    }
    if (l3 == null) {
      if (d3 === null)
        return document.createTextNode(p2);
      l3 = r3 ? document.createElementNS("http://www.w3.org/2000/svg", d3) : document.createElement(d3, p2.is && p2), o3 = null, c3 = false;
    }
    if (d3 === null)
      y3 === p2 || c3 && l3.data === p2 || (l3.data = p2);
    else {
      if (o3 = o3 && n.call(l3.childNodes), a3 = (y3 = i3.props || e).dangerouslySetInnerHTML, v3 = p2.dangerouslySetInnerHTML, !c3) {
        if (o3 != null)
          for (y3 = {}, _2 = 0; _2 < l3.attributes.length; _2++)
            y3[l3.attributes[_2].name] = l3.attributes[_2].value;
        (v3 || a3) && (v3 && (a3 && v3.__html == a3.__html || v3.__html === l3.innerHTML) || (l3.innerHTML = v3 && v3.__html || ""));
      }
      if (C(l3, p2, y3, r3, c3), v3)
        u3.__k = [];
      else if (_2 = u3.props.children, w(l3, Array.isArray(_2) ? _2 : [_2], u3, i3, t3, r3 && d3 !== "foreignObject", o3, f3, o3 ? o3[0] : i3.__k && k(i3, 0), c3), o3 != null)
        for (_2 = o3.length; _2--; )
          o3[_2] != null && h(o3[_2]);
      c3 || ("value" in p2 && (_2 = p2.value) !== void 0 && (_2 !== y3.value || _2 !== l3.value || d3 === "progress" && !_2) && H(l3, "value", _2, y3.value, false), "checked" in p2 && (_2 = p2.checked) !== void 0 && _2 !== l3.checked && H(l3, "checked", _2, y3.checked, false));
    }
    return l3;
  }
  function M(n2, u3, i3) {
    try {
      typeof n2 == "function" ? n2(u3) : n2.current = u3;
    } catch (n3) {
      l.__e(n3, i3);
    }
  }
  function N(n2, u3, i3) {
    var t3, r3;
    if (l.unmount && l.unmount(n2), (t3 = n2.ref) && (t3.current && t3.current !== n2.__e || M(t3, null, u3)), (t3 = n2.__c) != null) {
      if (t3.componentWillUnmount)
        try {
          t3.componentWillUnmount();
        } catch (n3) {
          l.__e(n3, u3);
        }
      t3.base = t3.__P = null;
    }
    if (t3 = n2.__k)
      for (r3 = 0; r3 < t3.length; r3++)
        t3[r3] && N(t3[r3], u3, typeof n2.type != "function");
    i3 || n2.__e == null || h(n2.__e), n2.__e = n2.__d = void 0;
  }
  function O(n2, l3, u3) {
    return this.constructor(n2, u3);
  }
  function S(u3, i3, t3) {
    var r3, o3, f3;
    l.__ && l.__(u3, i3), o3 = (r3 = typeof t3 == "function") ? null : t3 && t3.__k || i3.__k, f3 = [], j(i3, u3 = (!r3 && t3 || i3).__k = v(d, null, [u3]), o3 || e, e, i3.ownerSVGElement !== void 0, !r3 && t3 ? [t3] : o3 ? null : i3.firstChild ? n.call(i3.childNodes) : null, f3, !r3 && t3 ? t3 : o3 ? o3.__e : i3.firstChild, r3), z(f3, u3);
  }
  n = c.slice, l = { __e: function(n2, l3) {
    for (var u3, i3, t3; l3 = l3.__; )
      if ((u3 = l3.__c) && !u3.__)
        try {
          if ((i3 = u3.constructor) && i3.getDerivedStateFromError != null && (u3.setState(i3.getDerivedStateFromError(n2)), t3 = u3.__d), u3.componentDidCatch != null && (u3.componentDidCatch(n2), t3 = u3.__d), t3)
            return u3.__E = u3;
        } catch (l4) {
          n2 = l4;
        }
    throw n2;
  } }, u = 0, i = function(n2) {
    return n2 != null && n2.constructor === void 0;
  }, _.prototype.setState = function(n2, l3) {
    var u3;
    u3 = this.__s != null && this.__s !== this.state ? this.__s : this.__s = a({}, this.state), typeof n2 == "function" && (n2 = n2(a({}, u3), this.props)), n2 && a(u3, n2), n2 != null && this.__v && (l3 && this.__h.push(l3), m(this));
  }, _.prototype.forceUpdate = function(n2) {
    this.__v && (this.__e = true, n2 && this.__h.push(n2), m(this));
  }, _.prototype.render = d, t = [], r = typeof Promise == "function" ? Promise.prototype.then.bind(Promise.resolve()) : setTimeout, g.__r = 0, f = 0;

  // ../../node_modules/.pnpm/registry.npmmirror.com+preact@10.6.4/node_modules/preact/hooks/dist/hooks.module.js
  var t2;
  var u2;
  var r2;
  var o2 = 0;
  var i2 = [];
  var c2 = l.__b;
  var f2 = l.__r;
  var e2 = l.diffed;
  var a2 = l.__c;
  var v2 = l.unmount;
  function m2(t3, r3) {
    l.__h && l.__h(u2, t3, o2 || r3), o2 = 0;
    var i3 = u2.__H || (u2.__H = { __: [], __h: [] });
    return t3 >= i3.__.length && i3.__.push({}), i3.__[t3];
  }
  function l2(n2) {
    return o2 = 1, p(w2, n2);
  }
  function p(n2, r3, o3) {
    var i3 = m2(t2++, 2);
    return i3.t = n2, i3.__c || (i3.__ = [o3 ? o3(r3) : w2(void 0, r3), function(n3) {
      var t3 = i3.t(i3.__[0], n3);
      i3.__[0] !== t3 && (i3.__ = [t3, i3.__[1]], i3.__c.setState({}));
    }], i3.__c = u2), i3.__;
  }
  function y2(r3, o3) {
    var i3 = m2(t2++, 3);
    !l.__s && k2(i3.__H, o3) && (i3.__ = r3, i3.__H = o3, u2.__H.__h.push(i3));
  }
  function s2(n2) {
    return o2 = 5, d2(function() {
      return { current: n2 };
    }, []);
  }
  function d2(n2, u3) {
    var r3 = m2(t2++, 7);
    return k2(r3.__H, u3) && (r3.__ = n2(), r3.__H = u3, r3.__h = n2), r3.__;
  }
  function x2() {
    var t3;
    for (i2.sort(function(n2, t4) {
      return n2.__v.__b - t4.__v.__b;
    }); t3 = i2.pop(); )
      if (t3.__P)
        try {
          t3.__H.__h.forEach(g2), t3.__H.__h.forEach(j2), t3.__H.__h = [];
        } catch (u3) {
          t3.__H.__h = [], l.__e(u3, t3.__v);
        }
  }
  l.__b = function(n2) {
    u2 = null, c2 && c2(n2);
  }, l.__r = function(n2) {
    f2 && f2(n2), t2 = 0;
    var r3 = (u2 = n2.__c).__H;
    r3 && (r3.__h.forEach(g2), r3.__h.forEach(j2), r3.__h = []);
  }, l.diffed = function(t3) {
    e2 && e2(t3);
    var o3 = t3.__c;
    o3 && o3.__H && o3.__H.__h.length && (i2.push(o3) !== 1 && r2 === l.requestAnimationFrame || ((r2 = l.requestAnimationFrame) || function(n2) {
      var t4, u3 = function() {
        clearTimeout(r3), b2 && cancelAnimationFrame(t4), setTimeout(n2);
      }, r3 = setTimeout(u3, 100);
      b2 && (t4 = requestAnimationFrame(u3));
    })(x2)), u2 = null;
  }, l.__c = function(t3, u3) {
    u3.some(function(t4) {
      try {
        t4.__h.forEach(g2), t4.__h = t4.__h.filter(function(n2) {
          return !n2.__ || j2(n2);
        });
      } catch (r3) {
        u3.some(function(n2) {
          n2.__h && (n2.__h = []);
        }), u3 = [], l.__e(r3, t4.__v);
      }
    }), a2 && a2(t3, u3);
  }, l.unmount = function(t3) {
    v2 && v2(t3);
    var u3, r3 = t3.__c;
    r3 && r3.__H && (r3.__H.__.forEach(function(n2) {
      try {
        g2(n2);
      } catch (n3) {
        u3 = n3;
      }
    }), u3 && l.__e(u3, r3.__v));
  };
  var b2 = typeof requestAnimationFrame == "function";
  function g2(n2) {
    var t3 = u2, r3 = n2.__c;
    typeof r3 == "function" && (n2.__c = void 0, r3()), u2 = t3;
  }
  function j2(n2) {
    var t3 = u2;
    n2.__c = n2.__(), u2 = t3;
  }
  function k2(n2, t3) {
    return !n2 || n2.length !== t3.length || t3.some(function(t4, u3) {
      return t4 !== n2[u3];
    });
  }
  function w2(n2, t3) {
    return typeof t3 == "function" ? t3(n2) : t3;
  }

  // ../../node_modules/.pnpm/registry.npmmirror.com+@xiao-ai+utils@1.5.1/node_modules/@xiao-ai/utils/dist/esm/assert.js
  function isString(x3) {
    return typeof x3 === "string";
  }
  function isDef(x3) {
    return x3 !== void 0 && x3 !== null;
  }
  function isFunc(x3) {
    return typeof x3 === "function";
  }
  function isObject(x3) {
    const type = typeof x3;
    return isDef(x3) && type === "object" || type === "function";
  }

  // ../../node_modules/.pnpm/registry.npmmirror.com+@xiao-ai+utils@1.5.1/node_modules/@xiao-ai/utils/dist/esm/func.js
  function delay(time = 0) {
    return new Promise((resolve) => setTimeout(resolve, time));
  }

  // ../../node_modules/.pnpm/registry.npmmirror.com+@xiao-ai+utils@1.5.1/node_modules/@xiao-ai/utils/dist/esm/string.js
  function stringifyClass(...opt) {
    function parseClassObject(classObject) {
      return Object.keys(classObject).filter((key) => classObject[key]);
    }
    const className = [];
    for (let i3 = 0; i3 < opt.length; i3++) {
      const item = opt[i3];
      if (isObject(item)) {
        className.push(...parseClassObject(item));
      } else if (isString(item)) {
        className.push(item);
      }
    }
    return className.join(" ").split(/\s+/).map((item) => item.trim()).filter(Boolean).join(" ");
  }

  // ../../node_modules/.pnpm/registry.npmmirror.com+@xiao-ai+utils@1.5.1/node_modules/@xiao-ai/utils/dist/esm/subject.js
  var Subject = class {
    constructor() {
      this._events = [];
    }
    observe(ev) {
      this._events.push(ev);
      return () => this.unObserve(ev);
    }
    unObserve(ev) {
      if (!ev) {
        this._events = [];
      } else {
        this._events = this._events.filter((cb) => cb !== ev);
      }
    }
    notify(newVal, lastVal) {
      this._events.forEach((cb) => cb(newVal, lastVal));
    }
  };
  var Watcher = class extends Subject {
    constructor(initVal) {
      super();
      this._data = initVal;
    }
    static computed(watchers, cb) {
      const initVal = cb(...watchers.map(({ _data }) => _data));
      const newWatchers = initVal.map((init) => new Watcher(init));
      const observeCb = () => {
        const current = watchers.map(({ _data }) => _data);
        cb(...current).forEach((val, i3) => {
          newWatchers[i3].setData(val);
        });
      };
      watchers.forEach((watcher) => watcher.observe(observeCb));
      return newWatchers;
    }
    get data() {
      return this._data;
    }
    setData(val) {
      if (val !== this._data) {
        const last = this._data;
        this._data = val;
        this.notify(val, last);
      }
    }
    observe(event, immediately = false) {
      const unObserve = super.observe(event);
      if (immediately) {
        event(this._data);
      }
      return unObserve;
    }
    once(val) {
      const func = arguments.length === 0 ? () => true : isFunc(val) ? val : (item) => item === val;
      return new Promise((resolve) => {
        const callback = (item) => {
          if (func(item)) {
            this.unObserve(callback);
            resolve(item);
          }
        };
        this.observe(callback);
      });
    }
    computed(cb) {
      const watcher = new Watcher(cb(this._data));
      this.observe((val) => watcher.setData(cb(val)));
      return watcher;
    }
  };

  // ../utils/src/style.ts
  var codes = [];
  var timer = -1;
  function addStyle(code) {
    codes.push(code);
    if (timer !== -1) {
      clearTimeout(timer);
    }
    timer = setTimeout(() => {
      GM_addStyle(codes.join("\n"));
      if (false) {
        log("\u6837\u5F0F\u5143\u7D20\u52A0\u8F7D\u6210\u529F");
        timer = -1;
        codes.length = 0;
      }
    });
  }

  // ../utils/src/fetch/utils.ts
  function fileReaderReady(reader) {
    return new Promise((resolve, reject) => {
      reader.onload = () => resolve(reader.result);
      reader.onerror = () => reject(reader.error);
    });
  }
  function readBlobAsArrayBuffer(blob) {
    const reader = new FileReader();
    reader.readAsArrayBuffer(blob);
    return fileReaderReady(reader);
  }
  function readBlobAsText(blob) {
    const reader = new FileReader();
    reader.readAsText(blob);
    return fileReaderReady(reader);
  }
  function parseHeaders(responseHeaders) {
    const head = {};
    const pairs = responseHeaders.trim().split("\n");
    pairs.forEach((header) => {
      const split = header.trim().split(":");
      const key = split.shift().trim();
      const value = split.join(":").trim();
      head[key] = value;
    });
    return head;
  }

  // ../utils/src/fetch/body.ts
  var Body = class {
    _bodyText;
    _bodyBuffer;
    _bodyBlob;
    constructor(body) {
      if (isString(body)) {
        this._bodyText = body;
      } else if (Blob.prototype.isPrototypeOf(body)) {
        this._bodyBlob = body;
      } else if (ArrayBuffer.prototype.isPrototypeOf(body)) {
        this._bodyBuffer = body;
      } else if (!body) {
        this._bodyText = "";
      } else {
        throw new Error("unsupported BodyInit type");
      }
    }
    blob() {
      if (this._bodyBlob) {
        return Promise.resolve(this._bodyBlob);
      } else if (this._bodyBuffer) {
        throw new Error("could not read ArrayBuffer body as blob");
      } else {
        return Promise.resolve(new Blob([this._bodyText ?? ""]));
      }
    }
    arrayBuffer() {
      if (this._bodyBuffer) {
        return Promise.resolve(this._bodyBuffer);
      } else if (this._bodyBlob) {
        return this.blob().then(readBlobAsArrayBuffer);
      } else {
      }
    }
    text() {
      if (this._bodyBlob) {
        return readBlobAsText(this._bodyBlob);
      } else if (this._bodyBuffer) {
        throw new Error("could not read ArrayBuffer body as text");
      } else {
        return Promise.resolve(this._bodyText ?? "");
      }
    }
    json() {
      return this.text().then(JSON.parse);
    }
  };

  // ../utils/src/fetch/response.ts
  var Response = class extends Body {
    type;
    url;
    ok;
    status;
    statusText;
    headers;
    constructor(bodyInit, options) {
      super(bodyInit);
      this.type = "default";
      this.url = options.url ?? "";
      this.status = options.status;
      this.ok = this.status >= 200 && this.status < 300;
      this.statusText = options.statusText;
      this.headers = options.headers;
    }
  };

  // ../utils/src/fetch/index.ts
  function fetch(input, init = {}) {
    return new Promise(function(resolve, reject) {
      const xhr_details = {
        ...init,
        url: input
      };
      xhr_details.onload = (resp) => {
        const status = resp.status;
        if (status < 100 || status > 599) {
          reject(new TypeError("Network request failed"));
          return;
        }
        const rawRespHeaders = resp.responseHeaders;
        const parsedRespHeaders = parseHeaders(rawRespHeaders);
        const resource = init.responseType ? resp.response : resp.responseText;
        resolve(new Response(resource, {
          status,
          statusText: resp.statusText,
          headers: parsedRespHeaders,
          url: resp.finalUrl ?? parsedRespHeaders["X-Request-URL"] ?? ""
        }));
      };
      xhr_details.onerror = () => {
        reject(new TypeError("Network request failed"));
      };
      GM_xmlhttpRequest(xhr_details);
    });
  }

  // ../utils/src/web.ts
  function saveFile(file, name) {
    const vLink = document.createElement("a");
    vLink.href = URL.createObjectURL(file);
    vLink.download = name;
    vLink.click();
  }
  async function download(url, name, errorCheck) {
    const response = await fetch(url, { responseType: "blob" });
    const fileBlob = await response.blob();
    const checkResult = errorCheck ? await errorCheck(fileBlob, response) : null;
    if (checkResult) {
      throw new Error(checkResult);
    }
    saveFile(fileBlob, name);
  }
  function getOffset(el) {
    let left = 0;
    let top = 0;
    let current = el;
    while (current) {
      left += current.offsetLeft;
      top += current.offsetTop;
      current = current.offsetParent;
    }
    return { left, top };
  }
  function onLoad(window2, cb) {
    if (document.readyState === "complete") {
      cb();
    }
    window2.addEventListener("load", cb);
  }

  // src/utils/dom.ts
  function parseFromString(code) {
    const doc = document.implementation.createHTMLDocument("");
    doc.documentElement.innerHTML = code;
    return doc;
  }
  function renderToDom(Component) {
    const wrapElement = document.createElement("div");
    S(v(Component, null), wrapElement);
    return wrapElement.children[0];
  }

  // src/utils/data.ts
  function parseDataSize(str) {
    const val = str.trim().toLowerCase();
    const num = Number.parseFloat(val);
    if (Number.isNaN(num)) {
      return -1;
    }
    const unitRadio = {
      kib: 1,
      mib: 1024,
      gib: 1024 * 1024
    };
    const unit = val.substring(String(num).length, val.length).trim();
    return num * unitRadio[unit];
  }

  // src/utils/hentai/page.ts
  var PageData = class {
    url;
    doc;
    constructor(url, doc) {
      this.url = url;
      this.doc = doc;
    }
    async getDocument() {
      try {
        if (this.doc) {
          return this.doc;
        } else {
          const page = await fetch(this.url);
          const html = await page.text();
          this.doc = parseFromString(html);
          return this.doc;
        }
      } catch (e3) {
        console.warn(e3);
        const err = new Error("\u83B7\u53D6\u7F51\u9875\u6570\u636E\u65F6\u53D1\u751F\u9519\u8BEF");
        err.stack = this.url;
        throw err;
      }
    }
  };

  // src/utils/hentai/utils.ts
  var ClassName = {
    RightAsideItem: "g2",
    RightAsideSplitItem: "gsp",
    PageList: "ptt",
    ImageBoxMedium: "gdtm",
    ImageBoxLarge: "gdtl",
    GalleryListCoverBox: "gl1t",
    GalleryListCoverTitle: "gl4t",
    GalleryFooterInSearchPage: "gl5t",
    GalleryInfoTableName: "gdt1",
    GalleryInfoTableValue: "gdt2"
  };
  var IdName = {
    RightAside: "gd5",
    ImageListBox: "gdt",
    ImagePreviewInfo: "i2",
    ImageOriginInfo: "i7",
    ImagePreview: "img",
    GalleryMainTitle: "gj",
    GallerySubTitle: "gn",
    GalleryData: "gmid",
    GalleryInfo: "gdd",
    SearchOption: "toppane"
  };
  var hentaiKind = globalThis.location?.hostname.startsWith("exhentai") ? 1 /* Ex */ : 0 /* Normal */;
  function isSearchPage() {
    return location.pathname === "/";
  }
  function isGalleryPage() {
    return location.pathname.startsWith("/g/");
  }

  // src/utils/hentai/image.ts
  function parseWidthHeight(str) {
    const [width, height] = str.split("x").map((num) => Number.parseInt(num.trim()));
    if (!Number.isNaN(width) && !Number.isNaN(height)) {
      return { width, height };
    }
  }
  function parsePrieviewInfo(text) {
    const [nameText, sizeText, dataSizeText] = text.split("::").map((t3) => t3.trim());
    const size = parseWidthHeight(sizeText);
    if (!size) {
      throw new Error("\u89E3\u6790\u9884\u89C8\u56FE\u7247\u5BBD\u9AD8\u65F6\u51FA\u9519");
    }
    const dataSize = parseDataSize(dataSizeText);
    if (dataSize === -1) {
      throw new Error("\u89E3\u6790\u9884\u89C8\u56FE\u7247\u6587\u4EF6\u5927\u5C0F\u65F6\u51FA\u9519");
    }
    return {
      url: nameText,
      dataSize,
      size
    };
  }
  function parseOriginInfo(text) {
    const sizeMatch = /\d+ ?x ?\d+/.exec(text);
    const size = parseWidthHeight(sizeMatch?.[0] ?? "");
    if (!size) {
      throw new Error("\u89E3\u6790\u539F\u59CB\u56FE\u7247\u5BBD\u9AD8\u65F6\u51FA\u9519");
    }
    const dataSizeMatch = /\d+(\.\d+)? ?[KMG]B/i.exec(text);
    const dataSize = parseDataSize(dataSizeMatch?.[0] ?? "");
    if (!dataSize) {
      throw new Error("\u89E3\u6790\u539F\u59CB\u56FE\u7247\u6587\u4EF6\u5927\u5C0F\u65F6\u51FA\u9519");
    }
    return {
      url: "",
      dataSize,
      size
    };
  }
  var HentaiImage = class extends PageData {
    index = 0;
    data;
    constructor(url, doc) {
      super(url, doc);
      this.getIndex();
    }
    getIndex() {
      const indexMatch = /-(\d+)$/.exec(this.url);
      const imageIndex = indexMatch ? Number.parseInt(indexMatch[1]) : 0;
      this.index = imageIndex;
      return imageIndex;
    }
    async getImageData() {
      if (this.data) {
        return this.data;
      }
      const doc = await this.getDocument();
      const previewInfoDom = doc.querySelector(`#${IdName.ImagePreviewInfo}`)?.children[1];
      const previewInfo = parsePrieviewInfo(previewInfoDom?.textContent ?? "");
      const previewDom = doc.querySelector(`#${IdName.ImagePreview}`);
      const previewUrl = previewDom?.getAttribute("src");
      const originDom = doc.querySelector(`#${IdName.ImageOriginInfo} a`);
      const originData = originDom ? {
        ...parseOriginInfo(originDom.textContent ?? ""),
        url: originDom.getAttribute("href") ?? ""
      } : void 0;
      if (!previewUrl) {
        throw new Error("\u83B7\u53D6\u9884\u89C8\u56FE\u7247\u94FE\u63A5\u51FA\u9519");
      }
      this.data = {
        name: previewInfo.url,
        index: this.index === 0 ? this.getIndex() : this.index,
        priview: {
          url: previewUrl,
          size: previewInfo.size,
          dataSize: previewInfo.dataSize
        },
        origin: originData
      };
      return this.data;
    }
  };

  // src/utils/hentai/gallery.ts
  var HentaiGallery = class extends PageData {
    _pageUrls = [];
    _images = [];
    constructor(url, doc) {
      super(url, doc);
    }
    get images() {
      return this._images.slice();
    }
    async getTitle() {
      const doc = await this.getDocument();
      const mainTitleEl = doc.querySelector(`#${IdName.GalleryMainTitle}`);
      const subtitleEl = doc.querySelector(`#${IdName.GallerySubTitle}`);
      const title = mainTitleEl?.textContent ?? "";
      const subtitle = subtitleEl?.textContent ?? "";
      if (!title && !subtitle) {
        throw new Error("\u83B7\u53D6\u753B\u5ECA\u6807\u9898\u51FA\u9519");
      }
      return title.length > 0 ? title : subtitle;
    }
    async getSize() {
      const doc = await this.getDocument();
      const error = new Error("\u83B7\u53D6\u753B\u5ECA\u5927\u5C0F\u65F6\u51FA\u9519");
      const tableEls = Array.from(doc.querySelectorAll(`
      #${IdName.GalleryInfo} .${ClassName.GalleryInfoTableName},
      #${IdName.GalleryInfo} .${ClassName.GalleryInfoTableValue}
    `));
      for (let i3 = 0; i3 < tableEls.length; i3++) {
        const text = tableEls[i3].textContent;
        if (text !== "File Size:") {
          continue;
        }
        const sizeText = tableEls[i3 + 1]?.textContent;
        if (!sizeText) {
          throw error;
        }
        const size = parseDataSize(sizeText);
        if (size === -1) {
          throw error;
        }
        return size;
      }
      throw error;
    }
    async getPageUrls() {
      if (this._pageUrls.length > 0) {
        return this._pageUrls.slice();
      }
      const doc = await this.getDocument();
      const baseUrl = `${location.origin}${location.pathname}`;
      const pageListDom = Array.from(doc.querySelectorAll(`.${ClassName.PageList} tr td a[href]`));
      const maxPageNumber = Math.max(...pageListDom.map((el) => Number.parseInt(el.textContent ?? "")).filter((n2) => !Number.isNaN(n2)));
      this._pageUrls = Array(maxPageNumber).fill(0).map((_2, index) => {
        return index === 0 ? baseUrl : `${baseUrl}?p=${index}`;
      });
      return this._pageUrls.slice();
    }
    async *getImages() {
      const pageUrls = await this.getPageUrls();
      for (let i3 = 0; i3 < pageUrls.length; i3++) {
        const html = await fetch(pageUrls[i3]).then((data) => data.text()).catch((e3) => console.warn(e3));
        if (!html) {
          if (false) {
            log2(`\u83B7\u53D6\u7B2C ${i3 + 1} \u9875\u9884\u89C8\u9875\u7F51\u9875\u6E90\u7801\u65F6\u51FA\u9519\uFF0C\u8DF3\u8FC7\u3002`);
          }
          continue;
        }
        const newDocument = parseFromString(html);
        const imageSelector = [
          `#${IdName.ImageListBox} .${ClassName.ImageBoxMedium} a`,
          `#${IdName.ImageListBox} .${ClassName.ImageBoxLarge} a`
        ].join(",");
        const imageElements = Array.from(newDocument.querySelectorAll(imageSelector));
        const imageUrls = imageElements.map((item) => item.getAttribute("href")).filter((item) => isDef(item) && item.length > 0).map((url) => new HentaiImage(url));
        this._images = this.images.concat(imageUrls).sort((pre, next) => pre.index > next.index ? 1 : -1);
        yield this._images.slice();
        await delay(500);
      }
      return this.images;
    }
    async getTorrent() {
      const doc = await this.getDocument();
      const actionEls = Array.from(doc.querySelectorAll(`#${IdName.RightAside} .${ClassName.RightAsideItem} a`));
      const torrentEl = actionEls.find((el) => el.textContent?.includes("Torrent Download"));
      if (!torrentEl) {
        throw new Error("\u672A\u53D1\u73B0\u79CD\u5B50\u4E0B\u8F7D\u6309\u94AE");
      }
      const btnText = torrentEl.textContent ?? "";
      if (btnText.endsWith("(0)")) {
        throw new Error("\u6CA1\u6709\u79CD\u5B50\u6587\u4EF6");
      }
      const btnOnClickCode = torrentEl.getAttribute("onclick");
      const torrentListUrl = /popUp\('([^']+?)'/.exec(btnOnClickCode ?? "");
      if (!torrentListUrl || !torrentListUrl[1]) {
        throw new Error("\u89E3\u6790\u79CD\u5B50\u5217\u8868\u9875\u94FE\u63A5\u51FA\u9519");
      }
      const listPageCode = await fetch(torrentListUrl[1]).then((data) => data.text()).catch((e3) => console.warn(e3));
      if (!listPageCode) {
        throw new Error("\u83B7\u53D6\u79CD\u5B50\u5217\u8868\u9875\u6E90\u7801\u51FA\u9519");
      }
      const listPageDoc = parseFromString(listPageCode);
      const torrents = Array.from(listPageDoc.querySelectorAll("form")).map((formEl) => {
        const infoELs = formEl.querySelectorAll("table td");
        const textContents = Array.from(infoELs).map((item) => item.textContent ?? "");
        const title = textContents[8]?.trim();
        const postedKeyWord = "Posted:";
        const postedTime = textContents.find((text) => text.startsWith(postedKeyWord));
        const timeString = postedTime?.replace(postedKeyWord, "")?.trim();
        if (!timeString) {
          return;
        }
        const time = new Date(timeString).getTime();
        const sizeKeyWord = "Size:";
        const fileSize = textContents.find((text) => text.startsWith(sizeKeyWord));
        const sizeString = fileSize?.replace(sizeKeyWord, "")?.trim();
        if (!sizeString) {
          return;
        }
        const size = parseDataSize(sizeString);
        const downloadBtnEl = formEl.querySelector("table tr td a[href]");
        const downloadLink = downloadBtnEl?.getAttribute("href");
        const fileName = (downloadBtnEl?.textContent ?? "").trim();
        if (!downloadBtnEl || !downloadLink || !fileName) {
          return;
        }
        return {
          url: downloadLink,
          posted: time,
          size,
          title
        };
      }).filter(isDef);
      if (torrents.length === 0) {
        throw new Error("\u6CA1\u6709\u79CD\u5B50\u6587\u4EF6");
      }
      const torrentSort = torrents.sort((pre, next) => {
        const firstKey = "\u53BB\u5EE3\u544A";
        if (pre.title.includes(firstKey)) {
          return -1;
        } else if (next.title.includes(firstKey)) {
          return 1;
        } else {
          return pre.size < next.size ? 1 : -1;
        }
      });
      return torrentSort[0];
    }
  };

  // src/utils/hentai/style.ts
  var HentaiStyle = {
    [0 /* Normal */]: {
      backgroundColor: "#E3E0D1",
      textColor: "#5C0D11",
      shadowColor: "#4c0d01",
      buttonColor: "#5C0D11",
      borderColor: "#5C0D12"
    },
    [1 /* Ex */]: {
      backgroundColor: "#34353b",
      textColor: "#f1f1f1",
      shadowColor: "#919191",
      buttonColor: "#dddddd",
      borderColor: "#000000"
    }
  };
  var hentaiStyle = HentaiStyle[hentaiKind];

  // src/utils/time.ts
  function format(time) {
    const sec = time / 1e3;
    const min = Math.floor(sec / 60);
    const restSec = Math.floor(sec - min * 60);
    if (min > 0) {
      return `${min} \u5206\u949F ${restSec} \u79D2`;
    } else {
      return `${restSec} \u79D2`;
    }
  }

  // src/features/gallery-downloader/components/download-button/constant.ts
  var rightArrow = hentaiKind === 0 /* Normal */ ? "https://ehgt.org/g/mr.gif" : "https://exhentai.org/img/mr.gif";

  // ../components/src/tabs/style.jss.ts
  var style_jss_default2 = {
    classes: {
      "tabBox": "script-tab-box-0",
      "tabHeader": "script-tab-header-0",
      "tabNavList": "script-tab-nav-list-0",
      "tabMavHighlight": "script-tab-mav-highlight-0",
      "tabNavItem": "script-tab-nav-item-0",
      "tabBody": "script-tab-body-0"
    },
    toString: function() {
      return `.script-tab-box-0 {
  width: 100%;
  height: 100%;
  display: flex;
  overflow: hidden;
  font-size: 14px;
  flex-direction: column;
  background-color: transparent;
}
.script-tab-header-0 {
  display: flex;
  padding: 0 8px;
  position: relative;
}
.script-tab-header-0::before {
  left: 0;
  right: 0;
  bottom: 0;
  content: " ";
  position: absolute;
  border-bottom: 1px solid #000000;
}
.script-tab-nav-list-0 {
  margin: 0;
  display: flex;
  padding: 0;
  align-items: center;
  flex-direction: row;
}
.script-tab-nav-item-0 {
  border: 0;
  cursor: pointer;
  display: inline-flex;
  outline: none;
  padding: 10px 6px;
  position: relative;
  font-size: 14px;
  align-items: center;
  border-bottom: 1px solid transparent;
}
.script-tab-nav-item-0.script-tab-mav-highlight-0 {
  color: #1890ff;
  border-bottom: 1px solid #1890ff;
}
.script-tab-body-0 {
  padding: 14px;
}`;
    }
  };

  // ../components/src/tabs/index.tsx
  addStyle(style_jss_default2.toString());
  function Tabs(props) {
    const [state, setState] = l2(props.value ?? props.defaultValue);
    y2(() => {
      setState(props.value);
    }, [props.value]);
    return /* @__PURE__ */ v("div", {
      style: props.style,
      className: stringifyClass(style_jss_default2.classes.tabBox, props.className)
    }, /* @__PURE__ */ v("header", {
      className: style_jss_default2.classes.tabHeader,
      style: props.style
    }, /* @__PURE__ */ v("ul", {
      className: style_jss_default2.classes.tabNavList
    }, props.tabsData.map((item) => /* @__PURE__ */ v("li", {
      key: item.value,
      onClick: () => setState(item.value),
      className: stringifyClass(style_jss_default2.classes.tabNavItem, {
        [style_jss_default2.classes.tabMavHighlight]: state === item.value
      })
    }, item.name)))), /* @__PURE__ */ v("article", {
      className: style_jss_default2.classes.tabBody
    }, props.tabsData.map((item) => /* @__PURE__ */ v("div", {
      key: item.value,
      style: {
        display: state === item.value ? "block" : "none"
      }
    }, item.component))));
  }

  // ../components/src/icons/style.jss.ts
  var style_jss_default3 = {
    classes: {
      "icon": "script-icon-0"
    },
    toString: function() {
      return `.script-icon-0 {
  display: flex;
  align-items: center;
  justify-content: center;
}`;
    }
  };

  // ../components/src/icons/icons.tsx
  addStyle(style_jss_default3.toString());
  function IconCreator(props) {
    return /* @__PURE__ */ v("span", {
      ...props,
      "aria-label": props.name,
      className: stringifyClass(style_jss_default3.classes.icon, props.className)
    }, props.children);
  }

  // ../components/src/icons/close.tsx
  function IconClose(props) {
    return /* @__PURE__ */ v(IconCreator, {
      ...props,
      name: "close"
    }, /* @__PURE__ */ v("svg", {
      width: "1em",
      height: "1em",
      viewBox: "64 64 896 896",
      fill: "currentColor"
    }, /* @__PURE__ */ v("path", {
      d: "M563.8 512l262.5-312.9c4.4-5.2.7-13.1-6.1-13.1h-79.8c-4.7 0-9.2 2.1-12.3 5.7L511.6 449.8 295.1 191.7c-3-3.6-7.5-5.7-12.3-5.7H203c-6.8 0-10.5 7.9-6.1 13.1L459.4 512 196.9 824.9A7.95 7.95 0 00203 838h79.8c4.7 0 9.2-2.1 12.3-5.7l216.5-258.1 216.5 258.1c3 3.6 7.5 5.7 12.3 5.7h79.8c6.8 0 10.5-7.9 6.1-13.1L563.8 512z"
    })));
  }

  // ../components/src/icons/plus.tsx
  function IconPlus(props) {
    return /* @__PURE__ */ v(IconCreator, {
      ...props,
      name: "plus"
    }, /* @__PURE__ */ v("svg", {
      viewBox: "64 64 896 896",
      width: "1em",
      height: "1em",
      fill: "currentColor"
    }, /* @__PURE__ */ v("path", {
      d: "M482 152h60q8 0 8 8v704q0 8-8 8h-60q-8 0-8-8V160q0-8 8-8z"
    }), /* @__PURE__ */ v("path", {
      d: "M176 474h672q8 0 8 8v60q0 8-8 8H176q-8 0-8-8v-60q0-8 8-8z"
    })));
  }

  // ../components/src/icons/delete.tsx
  function IconDelete(props) {
    return /* @__PURE__ */ v(IconCreator, {
      ...props,
      name: "delete"
    }, /* @__PURE__ */ v("svg", {
      width: "1em",
      height: "1em",
      viewBox: "64 64 896 896",
      fill: "currentColor"
    }, /* @__PURE__ */ v("path", {
      d: "M360 184h-8c4.4 0 8-3.6 8-8v8h304v-8c0 4.4 3.6 8 8 8h-8v72h72v-80c0-35.3-28.7-64-64-64H352c-35.3 0-64 28.7-64 64v80h72v-72zm504 72H160c-17.7 0-32 14.3-32 32v32c0 4.4 3.6 8 8 8h60.4l24.7 523c1.6 34.1 29.8 61 63.9 61h454c34.2 0 62.3-26.8 63.9-61l24.7-523H888c4.4 0 8-3.6 8-8v-32c0-17.7-14.3-32-32-32zM731.3 840H292.7l-24.2-512h487l-24.2 512z"
    })));
  }

  // ../components/src/icons/placeholder.tsx
  function IconPlaceholder(props) {
    return /* @__PURE__ */ v(IconCreator, {
      ...props,
      name: "placeholder"
    }, /* @__PURE__ */ v("svg", {
      width: "1em",
      height: "1em",
      viewBox: "64 64 896 896",
      fill: "currentColor"
    }));
  }

  // ../components/src/select/style.jss.ts
  var style_jss_default4 = {
    classes: {
      "select": "script-select-0"
    },
    toString: function() {
      return `.script-select-0 {
  width: 100%;
  height: 24px;
  margin: 0;
  padding: 0;
}`;
    }
  };

  // ../components/src/select/index.tsx
  addStyle(style_jss_default4.toString());
  function Select(props) {
    return /* @__PURE__ */ v("select", {
      style: props.style,
      disabled: props.disabled,
      value: props.value ?? props.defaultValue,
      onChange: ({ currentTarget: el }) => {
        props.onChange?.(Number.parseInt(el.value));
      },
      className: stringifyClass(style_jss_default4.classes.select, props.className)
    }, props.options.map((opt) => /* @__PURE__ */ v("option", {
      key: opt.value,
      value: opt.value
    }, opt.name)));
  }

  // ../components/src/tooltip/style.jss.ts
  var style_jss_default5 = {
    classes: {
      "tooltipWrapper": "script-tooltip-wrapper-0",
      "tooltipChild": "script-tooltip-child-0",
      "tooltip": "script-tooltip-0"
    },
    toString: function() {
      return `.script-tooltip-wrapper-0 {
  position: relative;
}
.script-tooltip-child-0 {
  width: 100%;
}
.script-tooltip-0 {
  display: none;
  padding: 2px 6px;
  z-index: 10;
  position: fixed;
  max-width: 160px;
  align-items: center;
  white-space: normal;
  border-radius: 6px;
  justify-content: center;
  background-color: #888;
}`;
    }
  };

  // ../components/src/tooltip/index.tsx
  addStyle(style_jss_default5.toString());
  function Tooltip(props) {
    const ref = s2(null);
    const [position, setPosition] = l2();
    const onMouseEnter = () => {
      const { current: el } = ref;
      if (!el) {
        return;
      }
      const width = el.offsetWidth;
      const parentWidth = el.parentElement.offsetWidth;
      if (width < parentWidth) {
        return;
      }
      const offset = getOffset(el);
      setPosition({
        left: offset.left,
        top: offset.top + el.offsetHeight + 6
      });
    };
    return /* @__PURE__ */ v("span", {
      ref,
      className: stringifyClass(style_jss_default5.classes.tooltipWrapper, props.className)
    }, /* @__PURE__ */ v("span", {
      className: style_jss_default5.classes.tooltipChild,
      onMouseEnter,
      onMouseLeave: () => setPosition(void 0)
    }, props.children), /* @__PURE__ */ v("span", {
      className: style_jss_default5.classes.tooltip,
      style: {
        ...position,
        display: position ? "flex" : "none"
      }
    }, props.content));
  }

  // src/components/modal/style.jss.ts
  var style_jss_default6 = {
    classes: {
      "modalMask": "script-modal-mask-0",
      "modalEx": "script-modal-ex-0",
      "modalNormal": "script-modal-normal-0",
      "modal": "script-modal-0",
      "closeBtn": "script-close-btn-0"
    },
    toString: function() {
      return `.script-modal-mask-0 {
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  display: flex;
  position: fixed;
  align-items: center;
  justify-content: center;
  background-color: rgba(0, 0, 0, 0.4);
}
.script-modal-0 {
  top: -15%;
  width: 360px;
  position: relative;
  border-radius: 10px;
}
.script-modal-0.script-modal-ex-0 {
  color: #f1f1f1;
  box-shadow: 0px 0px 10px #919191;
  background-color: #34353b;
}
.script-modal-0.script-modal-normal-0 {
  color: #5C0D11;
  box-shadow: 0px 0px 10px #4c0d01;
  background-color: #E3E0D1;
}
.script-close-btn-0 {
  top: 12px;
  right: 8px;
  cursor: pointer;
  position: absolute;
  font-size: 14px;
}`;
    }
  };

  // src/components/modal/index.tsx
  addStyle(style_jss_default6.toString());
  function Modal(props) {
    if (!props.visible) {
      return null;
    }
    return /* @__PURE__ */ v("div", {
      className: style_jss_default6.classes.modalMask
    }, /* @__PURE__ */ v("div", {
      className: stringifyClass(style_jss_default6.classes.modal, {
        [style_jss_default6.classes.modalEx]: hentaiKind === 1 /* Ex */,
        [style_jss_default6.classes.modalNormal]: hentaiKind === 0 /* Normal */
      })
    }, props.children, /* @__PURE__ */ v(IconClose, {
      className: style_jss_default6.classes.closeBtn,
      onClick: props.onClose
    })));
  }

  // src/components/log/style.jss.ts
  var style_jss_default7 = {
    classes: {
      "box": "script-box-0",
      "spaceBox": "script-space-box-0",
      "spaceList": "script-space-list-0",
      "title": "script-title-0",
      "article": "script-article-0",
      "listBox": "script-list-box-0",
      "comlunList": "script-comlun-list-0",
      "indexList": "script-index-list-0",
      "nameList": "script-name-list-0",
      "msgList": "script-msg-list-0",
      "listItem": "script-list-item-0",
      "errorMsg": "script-error-msg-0"
    },
    toString: function() {
      return `.script-box-0 {
  width: 100%;
  display: flex;
  box-sizing: border-box;
  border-color: #000;
  flex-direction: column;
}
.script-space-box-0 {
  width: 100%;
  height: 100px;
  display: flex;
  align-items: center;
  justify-content: center;
}
.script-space-list-0 {
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
}
.script-title-0 {
  text-align: center;
  padding-top: 0;
  padding-bottom: 10px;
}
.script-article-0 {
  height: 300px;
  overflow-x: hidden;
  overflow-y: auto;
}
.script-list-box-0 {
  border: 1px solid;
  display: flex;
  list-style: none;
}
.script-comlun-list-0 {
  margin: 0;
  display: flex;
  padding: 0;
  flex-grow: 0;
  list-style: none;
  flex-shrink: 0;
  border-right: 1px solid;
  flex-direction: column;
}
.script-name-list-0 {
  flex-grow: 1;
  max-width: 245px;
}
.script-msg-list-0 {
  flex-grow: 1;
  max-width: 70px;
  border-right: 0;
}
.script-list-item-0 {
  height: 22px;
  padding: 2px 4px;
  overflow: hidden;
  border-top: 1px solid;
  box-sizing: border-box;
  white-space: nowrap;
  text-overflow: ellipsis;
}
.script-list-item-0:first-child {
  border-top: 0;
}
.script-error-msg-0 {
  color: #ff6900;
}
.script-article-0::-webkit-scrollbar {
  width: 6px;
  height: 6px;
  background-color: #888;
}
.script-article-0::-webkit-scrollbar-track {
  box-shadow: inset 0 0 3px rgba(0, 0, 0, .3);
  background-color: #888;
}
.script-article-0::-webkit-scrollbar-thumb {
  opacity: 0.7;
  box-shadow: inset 0 0 3px rgba(0, 0, 0, .3);
  transition: opacity ease-in-out 200ms;
  background-color: #303133;
}
.script-article-0::-webkit-scrollbar-thumb:hover {
  opacity: 1;
}`;
    }
  };

  // src/components/log/index.tsx
  addStyle(style_jss_default7.toString());
  function Log(props) {
    if (props.message.length === 0 && props.logs.length === 0) {
      return /* @__PURE__ */ v("div", {
        style: props.style,
        className: stringifyClass(style_jss_default7.classes.spaceBox, props.className)
      }, /* @__PURE__ */ v("span", null, "\u5F53\u524D\u6CA1\u6709\u65E5\u5FD7"));
    }
    if (props.message.length > 0 && props.logs.length === 0) {
      return /* @__PURE__ */ v("div", {
        style: props.style,
        className: stringifyClass(style_jss_default7.classes.box, props.className)
      }, /* @__PURE__ */ v("p", {
        className: style_jss_default7.classes.title
      }, props.message), /* @__PURE__ */ v("article", {
        className: style_jss_default7.classes.article,
        style: { height: 200 }
      }, /* @__PURE__ */ v("div", {
        className: style_jss_default7.classes.spaceList
      }, props.placeholder ?? "\u6682\u65E0\u8BB0\u5F55")));
    }
    return /* @__PURE__ */ v("div", {
      style: props.style,
      className: stringifyClass(style_jss_default7.classes.box, props.className)
    }, /* @__PURE__ */ v("p", {
      className: style_jss_default7.classes.title
    }, props.message), /* @__PURE__ */ v("article", {
      className: style_jss_default7.classes.article
    }, /* @__PURE__ */ v("div", {
      className: style_jss_default7.classes.listBox
    }, /* @__PURE__ */ v("ul", {
      className: stringifyClass(style_jss_default7.classes.comlunList, style_jss_default7.classes.indexList)
    }, props.logs.map((log6) => /* @__PURE__ */ v("li", {
      key: log6.index,
      className: style_jss_default7.classes.listItem
    }, log6.index))), /* @__PURE__ */ v("ul", {
      className: stringifyClass(style_jss_default7.classes.comlunList, style_jss_default7.classes.nameList)
    }, props.logs.map((log6) => /* @__PURE__ */ v("li", {
      key: log6.index,
      className: style_jss_default7.classes.listItem
    }, /* @__PURE__ */ v(Tooltip, {
      content: log6.name
    }, log6.url && log6.url.length > 0 ? /* @__PURE__ */ v("a", {
      href: log6.url,
      target: "_blank",
      rel: "noreferrer"
    }, log6.name) : /* @__PURE__ */ v("span", null, log6.name))))), /* @__PURE__ */ v("ul", {
      className: stringifyClass(style_jss_default7.classes.comlunList, style_jss_default7.classes.msgList)
    }, props.logs.map((log6) => /* @__PURE__ */ v("li", {
      key: log6.index,
      className: stringifyClass(style_jss_default7.classes.listItem, {
        [style_jss_default7.classes.errorMsg]: log6.error ?? false
      })
    }, /* @__PURE__ */ v(Tooltip, {
      content: log6.message
    }, log6.message)))))));
  }

  // src/features/gallery-downloader/components/setting/style.jss.ts
  var style_jss_default8 = {
    classes: {
      "box": "script-box-1",
      "body": "script-body-0",
      "footer": "script-footer-0",
      "btn": "script-btn-0",
      "formBox": "script-form-box-0",
      "formBoxTitle": "script-form-box-title-0",
      "formBoxBody": "script-form-box-body-0",
      "formRow": "script-form-row-0",
      "formRowLabel": "script-form-row-label-0",
      "formRowBody": "script-form-row-body-0",
      "rangeRow": "script-range-row-0",
      "rangeInput": "script-range-input-0",
      "rangeDelete": "script-range-delete-0",
      "rangeAdd": "script-range-add-0"
    },
    toString: function() {
      return `.script-box-1 {
  width: 100%;
  display: flex;
  flex-direction: column;
}
.script-body-0 {
  flex-grow: 1;
  margin-bottom: 14px;
}
.script-footer-0 {
  display: flex;
  align-items: center;
  justify-content: flex-end;
}
.script-btn-0 {
  margin-left: 6px;
}
.script-form-box-0 {
  margin-bottom: 14px;
}
.script-form-box-0:last-child {
  margin-bottom: 0;
}
.script-form-box-title-0 {
  margin: 0 0 10px 0;
  font-size: 16px;
  font-weight: normal;
}
.script-form-box-body-0 {
  padding-left: 14px;
}
.script-form-row-0 {
  display: flex;
  align-items: center;
}
.script-form-row-0 > * {
  height: 24px;
  line-height: 24px;
  border-color: #8D8D8D !important;
}
.script-form-row-label-0 {
  width: 60px;
  margin-right: 10px;
}
.script-form-row-body-0 {
  flex-grow: 1;
}
.script-range-row-0 {
  display: flex;
  align-items: center;
  margin-bottom: 12px;
}
.script-range-row-0 > * {
  height: 24px;
  line-height: 24px;
  border-color: #8D8D8D !important;
  margin-right: 24px;
}
.script-range-input-0 {
  border: 1px solid;
  outline: 0;
  box-sizing: border-box;
  border-radius: 4px;
}
.script-range-delete-0 {
  color: #888;
  cursor: pointer;
  transition: color .3s;
}
.script-range-delete-0:hover {
  color: #fff;
}
.script-range-add-0 {
  color: #888;
  width: 100%;
  border: 1px dashed #888;
  cursor: pointer;
  height: 24px;
  display: flex;
  box-sizing: border-box;
  transition: color .3s, border-color .3s;
  align-items: center;
  border-radius: 4px;
  justify-content: center;
}
.script-range-add-0:hover {
  color: #fff;
  border-color: #fff;
}`;
    }
  };

  // src/features/gallery-downloader/components/setting/utils.ts
  var defaultRangeData = {
    start: 1,
    end: 4e3
  };
  var defaultSetting = {
    imageKind: 0 /* Origin */,
    ranges: [{ ...defaultRangeData }]
  };
  var Range = class {
    _data = [];
    _map = {};
    constructor(data) {
      this.push(...data ?? []);
    }
    get ranges() {
      return this._data.slice();
    }
    get map() {
      return { ...this._map };
    }
    getIndex() {
      return Object.keys(this._map).filter((key) => Boolean(this._map[key])).map((key) => Number.parseInt(key));
    }
    getMinIndex() {
      return Math.min(...this.getIndex());
    }
    getMaxIndex() {
      return Math.max(...this.getIndex());
    }
    push(...rows) {
      for (const data of rows) {
        this._data.push(data);
        if (isDef(data.end)) {
          for (let i3 = data.start; i3 <= data.end; i3++) {
            this._map[i3] = true;
          }
        } else {
          this._map[data.start] = true;
        }
      }
    }
    includes(index) {
      return Boolean(this._map[index]);
    }
  };

  // src/features/gallery-downloader/components/setting/range.tsx
  function getKind(data) {
    return isDef(data.end) ? 0 /* Range */ : 1 /* Single */;
  }
  function RangeRow(props) {
    const [kind, setKind] = l2(getKind(props.data));
    y2(() => {
      setKind(getKind(props.data));
    }, [props.data]);
    const onChangeKind = (kind2) => {
      const { data } = props;
      const newData = { ...data };
      if (kind2 === 0 /* Range */) {
        if (!isDef(newData.end)) {
          newData.end = 4e3;
        }
      } else if (kind2 === 1 /* Single */) {
        delete newData.end;
      }
      props.onChange?.(newData);
    };
    const onChange = (data) => {
      props.onChange?.({
        ...props.data,
        ...data
      });
    };
    return /* @__PURE__ */ v("div", {
      className: style_jss_default8.classes.rangeRow
    }, /* @__PURE__ */ v(Select, {
      value: kind,
      disabled: props.disabled,
      defaultValue: 0 /* Range */,
      onChange: (kind2) => onChangeKind(kind2),
      style: { width: 70 },
      options: [
        {
          name: "\u8303\u56F4",
          value: 0 /* Range */
        },
        {
          name: "\u5355\u5F20",
          value: 1 /* Single */
        }
      ]
    }), /* @__PURE__ */ v("input", {
      className: style_jss_default8.classes.rangeInput,
      disabled: props.disabled,
      value: props.data.start,
      onChange: ({ currentTarget: el }) => {
        onChange({ start: Number.parseInt(el.value) });
      },
      style: { width: 60 },
      type: "number",
      min: "0",
      step: "1"
    }), /* @__PURE__ */ v("span", {
      style: { flexGrow: 1, textAlign: "center" }
    }, kind === 0 /* Range */ ? "\u81F3" : ""), kind === 0 /* Range */ && /* @__PURE__ */ v("input", {
      className: style_jss_default8.classes.rangeInput,
      disabled: props.disabled,
      value: props.data.end,
      onChange: ({ currentTarget: el }) => {
        onChange({ end: Number.parseInt(el.value) });
      },
      style: { width: 60 },
      type: "number",
      min: "0",
      step: "1"
    }), props.allowDelelte ? /* @__PURE__ */ v(IconDelete, {
      className: style_jss_default8.classes.rangeDelete,
      onClick: props.onDelete,
      style: { marginRight: 0 }
    }) : /* @__PURE__ */ v(IconPlaceholder, {
      style: { marginRight: 0 }
    }));
  }
  function RangeBox(props) {
    const onChange = (data, index) => {
      const newList = props.data.slice();
      newList.splice(index, 1, data);
      props.onChange(newList);
    };
    const onDelete = (index) => {
      const newList = props.data.slice();
      newList.splice(index, 1);
      props.onChange(newList);
    };
    const onAdd = () => {
      const newList = props.data.slice();
      newList.push({ ...defaultRangeData });
      props.onChange(newList);
    };
    return /* @__PURE__ */ v("div", null, props.data.map((item, i3, arr) => /* @__PURE__ */ v(RangeRow, {
      key: i3,
      data: item,
      disabled: props.disabled,
      allowDelelte: arr.length > 1,
      onDelete: () => onDelete(i3),
      onChange: (data) => onChange(data, i3)
    })), /* @__PURE__ */ v("div", {
      className: style_jss_default8.classes.rangeAdd,
      onClick: onAdd
    }, /* @__PURE__ */ v(IconPlus, null)));
  }

  // src/features/gallery-downloader/components/setting/form.tsx
  function FormBox(props) {
    return /* @__PURE__ */ v("section", {
      className: style_jss_default8.classes.formBox
    }, /* @__PURE__ */ v("h2", {
      className: style_jss_default8.classes.formBoxTitle
    }, props.title), /* @__PURE__ */ v("div", {
      className: style_jss_default8.classes.formBoxBody
    }, props.children));
  }
  function FormRow(props) {
    return /* @__PURE__ */ v("section", {
      className: style_jss_default8.classes.formRow
    }, /* @__PURE__ */ v("label", {
      className: style_jss_default8.classes.formRowLabel
    }, props.label), /* @__PURE__ */ v("div", {
      className: style_jss_default8.classes.formRowBody
    }, props.children));
  }

  // src/features/gallery-downloader/components/setting/index.tsx
  addStyle(style_jss_default8.toString());
  function Setting(props) {
    const onChange = (data) => {
      props.onChange?.({
        ...props.data,
        ...data
      });
    };
    return /* @__PURE__ */ v("div", {
      className: style_jss_default8.classes.box
    }, /* @__PURE__ */ v("article", {
      className: style_jss_default8.classes.body
    }, /* @__PURE__ */ v(FormBox, {
      title: "\u4E0B\u8F7D\u9009\u9879"
    }, /* @__PURE__ */ v(FormRow, {
      label: "\u56FE\u50CF\u7C7B\u522B"
    }, /* @__PURE__ */ v(Select, {
      value: props.data.imageKind,
      defaultValue: 0 /* Origin */,
      disabled: props.disabled,
      onChange: (imageKind) => onChange({ imageKind }),
      options: [
        {
          name: "\u539F\u59CB\u6587\u4EF6\uFF08\u5982\u679C\u6709\uFF09",
          value: 0 /* Origin */
        },
        {
          name: "\u538B\u7F29\u6587\u4EF6",
          value: 1 /* Shrink */
        }
      ]
    }))), /* @__PURE__ */ v(FormBox, {
      title: "\u4E0B\u8F7D\u8303\u56F4"
    }, /* @__PURE__ */ v(RangeBox, {
      data: props.data.ranges,
      disabled: props.disabled,
      onChange: (ranges) => onChange({ ranges })
    }))), /* @__PURE__ */ v("footer", {
      className: style_jss_default8.classes.footer
    }, /* @__PURE__ */ v("button", {
      disabled: !props.disabled,
      onClick: props.onCancel
    }, "\u4E2D\u65AD\u4E0B\u8F7D"), /* @__PURE__ */ v("button", {
      className: style_jss_default8.classes.btn,
      disabled: props.disabled,
      onClick: props.onDownload
    }, "\u4E0B\u8F7D\u753B\u5ECA")));
  }

  // src/features/gallery-downloader/components/download-panel/index.tsx
  function DownloadPanel(props) {
    const [logMsg, setLogMsg] = l2("");
    const [logs, setLogs] = l2([]);
    const [downloading, setLoading] = l2(false);
    const [config, setConfig] = l2(defaultSetting);
    const [tabValue, setTab] = l2(0 /* Setting */);
    const { current: gallery } = s2(new HentaiGallery(location.href, document));
    const onSettingChange = (data) => setConfig({
      ...config,
      ...data
    });
    const onDownload = async () => {
      const startTime = Date.now();
      setTab(1 /* Log */);
      setLoading(true);
      setLogMsg("\u83B7\u53D6\u56FE\u7247\u9884\u89C8\u94FE\u63A5\u4E2D...");
      const result = gallery.getImages();
      const range = new Range(config.ranges);
      let errorStop = false;
      let images = [];
      let val = {
        value: [],
        done: false
      };
      function getImageLog(img, message, isError) {
        return {
          index: img.index,
          name: img.data?.name ?? "\u672A\u83B7\u5F97",
          url: img.url,
          message: message ?? "\u7B49\u5F85\u4E2D",
          error: isError ?? false
        };
      }
      function updateImageLog(data) {
        const index = images.findIndex((item) => item.index === data.index);
        if (index > -1) {
          images.splice(index, 1, data);
        } else {
          images.push(data);
        }
        setLogs(images.slice());
      }
      function setStopImageLog(imgIndex, message) {
        const logIndex = images.findIndex((item) => item.index === imgIndex);
        if (logIndex < 0) {
          return;
        }
        images[logIndex].error = true;
        images[logIndex].message = message;
        for (let i3 = logIndex + 1; i3 < images.length; i3++) {
          images[i3].message = "\u505C\u6B62";
        }
        setLogs(images.slice());
      }
      while (!val.done) {
        val = await result.next();
        images = val.value.map((item) => getImageLog(item)).filter((item) => range.includes(item.index));
        setLogs(images);
      }
      setLogMsg("\u89E3\u6790\u6240\u6709\u56FE\u7247\u9884\u89C8\u9875\u9762...");
      const galleryImages = gallery.images.filter((img) => range.includes(img.index));
      for (const img of galleryImages) {
        try {
          setLogMsg(`\u6B63\u5728\u89E3\u6790\u7B2C ${img.index} \u5F20\u56FE\u7247...`);
          const data = await img.getImageData();
          setLogMsg(`\u6B63\u5728\u4E0B\u8F7D\u7B2C ${img.index} \u5F20\u56FE\u7247...`);
          updateImageLog(getImageLog(img, "\u4E0B\u8F7D\u4E2D", false));
          const downloadUrl = config.imageKind === 0 /* Origin */ ? data.origin?.url ?? data.priview.url : data.priview.url;
          await download(downloadUrl, data.name, async (blob, response) => {
            if (blob.type.includes("text/html")) {
              const htmlText = await response.text();
              errorStop = true;
              if (htmlText.includes("You have exceeded your image viewing limits")) {
                return "\u6D41\u91CF\u8D85\u9650";
              } else {
                return htmlText.split(".")[0];
              }
            }
          });
          updateImageLog(getImageLog(img, "\u5B8C\u6210", false));
        } catch (err) {
          if (errorStop) {
            setStopImageLog(img.index, err.message);
            break;
          } else {
            updateImageLog(getImageLog(img, err.message, true));
          }
        }
        await delay(400);
      }
      const title = await gallery.getTitle();
      GM_notification({
        title,
        text: `\u4E0B\u8F7D${errorStop ? "\u672A" : ""}\u5B8C\u6210\uFF0C\u5171\u8017\u65F6 ${format(Date.now() - startTime)}`
      });
      setLoading(false);
      if (errorStop) {
        setLogMsg("\u4E0B\u8F7D\u51FA\u9519\u505C\u6B62");
      } else {
        setLogMsg("\u4E0B\u8F7D\u6B63\u5E38\u7ED3\u675F");
      }
    };
    if (!props.visible) {
      return null;
    }
    return /* @__PURE__ */ v(Modal, {
      visible: props.visible,
      onClose: props.onClose
    }, /* @__PURE__ */ v(Tabs, {
      value: tabValue,
      tabsData: [
        {
          name: "\u8BBE\u7F6E",
          value: 0 /* Setting */,
          component: /* @__PURE__ */ v(Setting, {
            data: config,
            disabled: downloading,
            onChange: onSettingChange,
            onDownload
          })
        },
        {
          name: "\u65E5\u5FD7",
          value: 1 /* Log */,
          component: /* @__PURE__ */ v(Log, {
            message: logMsg,
            logs
          })
        }
      ]
    }));
  }

  // src/features/gallery-downloader/components/download-button/index.tsx
  addStyle(style_jss_default.toString());
  function MainButton() {
    const [visiblePanel, setVisible] = l2(false);
    return /* @__PURE__ */ v("div", {
      className: stringifyClass(ClassName.RightAsideItem, ClassName.RightAsideSplitItem)
    }, /* @__PURE__ */ v("p", {
      style: { margin: 0, padding: 0 }
    }, /* @__PURE__ */ v("img", {
      src: rightArrow
    }), /* @__PURE__ */ v("a", {
      className: style_jss_default.classes.downBtn,
      onClick: () => setVisible(true)
    }, " Download Gallery")), /* @__PURE__ */ v(DownloadPanel, {
      visible: visiblePanel,
      onClose: () => setVisible(false)
    }));
  }

  // src/features/gallery-downloader/index.ts
  function active() {
    if (!isGalleryPage()) {
      return;
    }
    onLoad(unsafeWindow, () => {
      const rightAside = document.querySelector(`#${IdName.RightAside}`);
      if (!rightAside) {
        if (false) {
          log3("\u672A\u53D1\u73B0\u4FA7\u8FB9\u680F\uFF0C\u4E0B\u8F7D\u6309\u94AE\u52A0\u8F7D\u5931\u8D25");
        }
        return;
      }
      rightAside.appendChild(renderToDom(MainButton));
      if (false) {
        log3("\u4E0B\u8F7D\u6309\u94AE\u52A0\u8F7D\u6210\u529F");
      }
    });
  }

  // src/features/list-downloader/components/checkbox/style.jss.ts
  var style_jss_default9 = {
    classes: {
      "heataiCheckbox": "script-heatai-checkbox-0"
    },
    toString: function() {
      return `.script-heatai-checkbox-0 {
  display: flex;
  align-items: center;
  padding-left: 10px;
  justify-content: center;
}`;
    }
  };

  // src/features/list-downloader/components/checkbox/index.ts
  addStyle(style_jss_default9.toString());
  function Checkbox(name, cb) {
    const div = document.createElement("div");
    const label = document.createElement("label");
    const input = document.createElement("input");
    const span = document.createElement("span");
    label.setAttribute("class", "lc");
    input.setAttribute("type", "checkbox");
    input.setAttribute("name", name);
    input.addEventListener("input", () => {
      cb(input.checked);
    });
    label.appendChild(input);
    label.appendChild(span);
    div.appendChild(label);
    div.setAttribute("class", style_jss_default9.classes.heataiCheckbox);
    return div;
  }

  // src/features/list-downloader/components/download-button/style.jss.ts
  var style_jss_default10 = {
    classes: {
      "downloadBtnWrapper": "script-download-btn-wrapper-0",
      "downloadBtn": "script-download-btn-0"
    },
    toString: function() {
      return `.script-download-btn-wrapper-0 {
  display: flex;
  flex-direction: row-reverse;
}
.script-download-btn-0 {
  margin: -16px 8px 4px 0 !important;
}`;
    }
  };

  // src/features/list-downloader/components/download-panel/style.jss.ts
  var style_jss_default11 = {
    classes: {
      "log": "script-log-0",
      "logFooter": "script-log-footer-0"
    },
    toString: function() {
      return `.script-log-0 {
  padding: 10px;
}
.script-log-footer-0 {
  display: flex;
  padding: 0 10px 10px 10px;
  flex-direction: row-reverse;
}`;
    }
  };

  // src/features/list-downloader/store.ts
  var selected = new Watcher({});
  if (false) {
    selected.observe((val) => {
      log4("\u88AB\u9009\u753B\u5ECA\u66F4\u65B0", JSON.stringify(val, null, 2));
    });
  }

  // src/features/list-downloader/components/download-panel/index.tsx
  addStyle(style_jss_default11.toString());
  function spaceLog(index) {
    const data = {
      index: index + 1,
      url: "",
      name: "",
      message: "\u7B49\u5F85\u4E2D",
      error: false
    };
    const coverEl = document.querySelectorAll(`.${ClassName.GalleryListCoverBox}`)[index];
    if (!coverEl) {
      return;
    }
    const hrefEl = coverEl.querySelector("a");
    const titleEl = coverEl.querySelector(`.${ClassName.GalleryListCoverTitle}`);
    if (!hrefEl || !titleEl) {
      return;
    }
    data.url = hrefEl.getAttribute("href");
    data.name = titleEl.textContent;
    return data;
  }
  function DownloadPanel2(props) {
    const [msg, setMsg] = l2("\u70B9\u51FB\u53F3\u4E0B\u89D2\u201C\u786E\u8BA4\u4E0B\u8F7D\u201D\u5373\u53EF\u5F00\u59CB");
    const [logs, setLogs] = l2([]);
    const [downloading, setLoading] = l2(false);
    const onDownload = async () => {
      const startTime = Date.now();
      const logData = logs.slice();
      const galleries = logData.map((item) => new HentaiGallery(item.url));
      let count = 0;
      setLoading(true);
      setMsg("\u6B63\u5728\u4E0B\u8F7D\u9009\u4E2D\u753B\u5ECA\u79CD\u5B50");
      for (let i3 = 0; i3 < galleries.length; i3++) {
        const gallery = galleries[i3];
        logData[i3].message = "\u89E3\u6790\u753B\u5ECA\u79CD\u5B50\u6587\u4EF6\u4E0B\u8F7D\u94FE\u63A5";
        setLogs(logData.slice());
        try {
          const title = await gallery.getTitle();
          const torrent = await gallery.getTorrent();
          logData[i3].message = "\u4E0B\u8F7D\u4E2D";
          await download(torrent.url, `${title}.zip.torrent`);
          logData[i3].message = "\u4E0B\u8F7D\u5B8C\u6210";
          setLogs(logData.slice());
          count++;
        } catch (e3) {
          logData[i3].message = e3.message;
          logData[i3].error = true;
          setLogs(logData.slice());
        }
        await delay(500);
      }
      GM_notification({
        title: "\u4E0B\u8F7D\u5B8C\u6210",
        text: `\u5171\u9009\u4E2D ${galleries.length} \u4E2A\u79CD\u5B50\uFF0C\u4E0B\u8F7D ${count} \u4E2A, \u8017\u65F6 ${format(Date.now() - startTime)}`
      });
      setLoading(false);
      setMsg("\u4E0B\u8F7D\u5B8C\u6210");
    };
    y2(() => {
      if (!props.visible) {
        return;
      }
      const galleries = Object.entries(selected.data).filter(([_2, value]) => value).map(([index]) => spaceLog(Number.parseInt(index))).filter(isDef);
      setLogs(galleries);
    }, [props.visible]);
    if (!props.visible) {
      return null;
    }
    return /* @__PURE__ */ v(Modal, {
      visible: props.visible,
      onClose: props.onClose
    }, /* @__PURE__ */ v(Log, {
      className: style_jss_default11.classes.log,
      placeholder: "\u672A\u9009\u62E9\u4EFB\u4F55\u753B\u5ECA",
      message: msg,
      logs
    }), logs.length > 0 && /* @__PURE__ */ v("div", {
      className: style_jss_default11.classes.logFooter
    }, /* @__PURE__ */ v("button", {
      disabled: downloading,
      onClick: onDownload
    }, "\u786E\u8BA4\u4E0B\u8F7D")));
  }

  // src/features/list-downloader/components/download-button/index.tsx
  addStyle(style_jss_default10.toString());
  function MainButton2() {
    const [visiblePanel, setVisible] = l2(false);
    return /* @__PURE__ */ v("div", {
      className: style_jss_default10.classes.downloadBtnWrapper
    }, /* @__PURE__ */ v("input", {
      type: "button",
      value: "Download Galleries",
      className: style_jss_default10.classes.downloadBtn,
      onClick: () => setVisible(true)
    }), /* @__PURE__ */ v(DownloadPanel2, {
      visible: visiblePanel,
      onClose: () => setVisible(false)
    }));
  }

  // src/features/list-downloader/index.ts
  function active2() {
    if (!isSearchPage()) {
      return;
    }
    onLoad(unsafeWindow, () => {
      const galleryList = document.querySelector(`#${IdName.SearchOption} + div`);
      const galleryFooter = Array.from(document.querySelectorAll(`.${ClassName.GalleryFooterInSearchPage}`));
      if (!galleryList || galleryFooter.length === 0) {
        if (false) {
          log5("\u672A\u53D1\u73B0\u753B\u5ECA\u5217\u8868\uFF0C\u65E0\u6CD5\u6DFB\u52A0\u4E0B\u8F7D\u6309\u94AE\u548C\u590D\u9009\u6846");
        }
        return;
      }
      for (let i3 = 0; i3 < galleryFooter.length; i3++) {
        galleryFooter[i3].appendChild(Checkbox(`downloader-${i3}`, (val) => {
          selected.setData({
            ...selected.data,
            [i3]: val
          });
        }));
      }
      if (false) {
        log5("\u5217\u8868\u9875\u590D\u9009\u6846\u52A0\u8F7D\u6210\u529F");
      }
      galleryList.appendChild(renderToDom(MainButton2));
      if (false) {
        log5("\u4E0B\u8F7D\u6309\u94AE\u52A0\u8F7D\u6210\u529F");
      }
    });
  }

  // src/index.ts
  active();
  active2();
})();
