// ==UserScript==
// @name         Bahamut Anime Comment Mountains
// @version      0.2.2
// @description  彈幕密度山脈 for 巴哈姆特動畫瘋
// @author       JacobLinCool <jacoblincool@gmail.com> (https://github.com/JacobLinCool)
// @license      MIT
// @homepage     https://github.com/JacobLinCool/Bahamut-Anime-Comment-Mountains#readme
// @supportURL   https://github.com/JacobLinCool/Bahamut-Anime-Comment-Mountains/issues
// @namespace    http://tampermonkey.net/
// @match        https://ani.gamer.com.tw/animeVideo.php?sn=*
// @icon         https://www.google.com/s2/favicons?domain=gamer.com.tw
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/438287/Bahamut%20Anime%20Comment%20Mountains.user.js
// @updateURL https://update.greasyfork.org/scripts/438287/Bahamut%20Anime%20Comment%20Mountains.meta.js
// ==/UserScript==


(() => {
  var __defProp = Object.defineProperty;
  var __defNormalProp = (obj, key, value) => key in obj ? __defProp(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
  var __publicField = (obj, key, value) => {
    __defNormalProp(obj, typeof key !== "symbol" ? key + "" : key, value);
    return value;
  };
  var __async = (__this, __arguments, generator) => {
    return new Promise((resolve, reject) => {
      var fulfilled = (value) => {
        try {
          step(generator.next(value));
        } catch (e2) {
          reject(e2);
        }
      };
      var rejected = (value) => {
        try {
          step(generator.throw(value));
        } catch (e2) {
          reject(e2);
        }
      };
      var step = (x2) => x2.done ? resolve(x2.value) : Promise.resolve(x2.value).then(fulfilled, rejected);
      step((generator = generator.apply(__this, __arguments)).next());
    });
  };

  // src/utils.js
  function log(...msg) {
    if (msg.length >= 1) {
      console.log("%c[\u5F48\u5E55\u5C71\u8108]", "color: orange; font-weight: bold;", ...msg);
    } else {
      console.log();
    }
  }
  function retry(func, times = 3) {
    return __async(this, null, function* () {
      for (let i2 = 0; i2 < times; i2++) {
        try {
          return yield func();
        } catch (err) {
          log("Retry", i2 + 1, func, err);
        }
      }
      log("Failed", func);
      throw new Error("Failed");
    });
  }
  function sleep(ms, val) {
    return new Promise((resolve) => setTimeout(() => resolve(val), ms));
  }

  // node_modules/.pnpm/preact@10.6.4/node_modules/preact/dist/preact.module.js
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
  function a(n2, l2) {
    for (var u2 in l2)
      n2[u2] = l2[u2];
    return n2;
  }
  function h(n2) {
    var l2 = n2.parentNode;
    l2 && l2.removeChild(n2);
  }
  function v(l2, u2, i2) {
    var t2, r2, o2, f2 = {};
    for (o2 in u2)
      o2 == "key" ? t2 = u2[o2] : o2 == "ref" ? r2 = u2[o2] : f2[o2] = u2[o2];
    if (arguments.length > 2 && (f2.children = arguments.length > 3 ? n.call(arguments, 2) : i2), typeof l2 == "function" && l2.defaultProps != null)
      for (o2 in l2.defaultProps)
        f2[o2] === void 0 && (f2[o2] = l2.defaultProps[o2]);
    return y(l2, f2, t2, r2, null);
  }
  function y(n2, i2, t2, r2, o2) {
    var f2 = { type: n2, props: i2, key: t2, ref: r2, __k: null, __: null, __b: 0, __e: null, __d: void 0, __c: null, __h: null, constructor: void 0, __v: o2 == null ? ++u : o2 };
    return o2 == null && l.vnode != null && l.vnode(f2), f2;
  }
  function d(n2) {
    return n2.children;
  }
  function _(n2, l2) {
    this.props = n2, this.context = l2;
  }
  function k(n2, l2) {
    if (l2 == null)
      return n2.__ ? k(n2.__, n2.__.__k.indexOf(n2) + 1) : null;
    for (var u2; l2 < n2.__k.length; l2++)
      if ((u2 = n2.__k[l2]) != null && u2.__e != null)
        return u2.__e;
    return typeof n2.type == "function" ? k(n2) : null;
  }
  function b(n2) {
    var l2, u2;
    if ((n2 = n2.__) != null && n2.__c != null) {
      for (n2.__e = n2.__c.base = null, l2 = 0; l2 < n2.__k.length; l2++)
        if ((u2 = n2.__k[l2]) != null && u2.__e != null) {
          n2.__e = n2.__c.base = u2.__e;
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
      n2 = t.sort(function(n3, l2) {
        return n3.__v.__b - l2.__v.__b;
      }), t = [], n2.some(function(n3) {
        var l2, u2, i2, t2, r2, o2;
        n3.__d && (r2 = (t2 = (l2 = n3).__v).__e, (o2 = l2.__P) && (u2 = [], (i2 = a({}, t2)).__v = t2.__v + 1, j(o2, t2, i2, l2.__n, o2.ownerSVGElement !== void 0, t2.__h != null ? [r2] : null, u2, r2 == null ? k(t2) : r2, t2.__h), z(u2, t2), t2.__e != r2 && b(t2)));
      });
  }
  function w(n2, l2, u2, i2, t2, r2, o2, f2, s2, a2) {
    var h2, v2, p, _2, b2, m2, g2, w2 = i2 && i2.__k || c, A = w2.length;
    for (u2.__k = [], h2 = 0; h2 < l2.length; h2++)
      if ((_2 = u2.__k[h2] = (_2 = l2[h2]) == null || typeof _2 == "boolean" ? null : typeof _2 == "string" || typeof _2 == "number" || typeof _2 == "bigint" ? y(null, _2, null, null, _2) : Array.isArray(_2) ? y(d, { children: _2 }, null, null, null) : _2.__b > 0 ? y(_2.type, _2.props, _2.key, null, _2.__v) : _2) != null) {
        if (_2.__ = u2, _2.__b = u2.__b + 1, (p = w2[h2]) === null || p && _2.key == p.key && _2.type === p.type)
          w2[h2] = void 0;
        else
          for (v2 = 0; v2 < A; v2++) {
            if ((p = w2[v2]) && _2.key == p.key && _2.type === p.type) {
              w2[v2] = void 0;
              break;
            }
            p = null;
          }
        j(n2, _2, p = p || e, t2, r2, o2, f2, s2, a2), b2 = _2.__e, (v2 = _2.ref) && p.ref != v2 && (g2 || (g2 = []), p.ref && g2.push(p.ref, null, _2), g2.push(v2, _2.__c || b2, _2)), b2 != null ? (m2 == null && (m2 = b2), typeof _2.type == "function" && _2.__k === p.__k ? _2.__d = s2 = x(_2, s2, n2) : s2 = P(n2, _2, p, w2, b2, s2), typeof u2.type == "function" && (u2.__d = s2)) : s2 && p.__e == s2 && s2.parentNode != n2 && (s2 = k(p));
      }
    for (u2.__e = m2, h2 = A; h2--; )
      w2[h2] != null && (typeof u2.type == "function" && w2[h2].__e != null && w2[h2].__e == u2.__d && (u2.__d = k(i2, h2 + 1)), N(w2[h2], w2[h2]));
    if (g2)
      for (h2 = 0; h2 < g2.length; h2++)
        M(g2[h2], g2[++h2], g2[++h2]);
  }
  function x(n2, l2, u2) {
    for (var i2, t2 = n2.__k, r2 = 0; t2 && r2 < t2.length; r2++)
      (i2 = t2[r2]) && (i2.__ = n2, l2 = typeof i2.type == "function" ? x(i2, l2, u2) : P(u2, i2, i2, t2, i2.__e, l2));
    return l2;
  }
  function P(n2, l2, u2, i2, t2, r2) {
    var o2, f2, e2;
    if (l2.__d !== void 0)
      o2 = l2.__d, l2.__d = void 0;
    else if (u2 == null || t2 != r2 || t2.parentNode == null)
      n:
        if (r2 == null || r2.parentNode !== n2)
          n2.appendChild(t2), o2 = null;
        else {
          for (f2 = r2, e2 = 0; (f2 = f2.nextSibling) && e2 < i2.length; e2 += 2)
            if (f2 == t2)
              break n;
          n2.insertBefore(t2, r2), o2 = r2;
        }
    return o2 !== void 0 ? o2 : t2.nextSibling;
  }
  function C(n2, l2, u2, i2, t2) {
    var r2;
    for (r2 in u2)
      r2 === "children" || r2 === "key" || r2 in l2 || H(n2, r2, null, u2[r2], i2);
    for (r2 in l2)
      t2 && typeof l2[r2] != "function" || r2 === "children" || r2 === "key" || r2 === "value" || r2 === "checked" || u2[r2] === l2[r2] || H(n2, r2, l2[r2], u2[r2], i2);
  }
  function $(n2, l2, u2) {
    l2[0] === "-" ? n2.setProperty(l2, u2) : n2[l2] = u2 == null ? "" : typeof u2 != "number" || s.test(l2) ? u2 : u2 + "px";
  }
  function H(n2, l2, u2, i2, t2) {
    var r2;
    n:
      if (l2 === "style")
        if (typeof u2 == "string")
          n2.style.cssText = u2;
        else {
          if (typeof i2 == "string" && (n2.style.cssText = i2 = ""), i2)
            for (l2 in i2)
              u2 && l2 in u2 || $(n2.style, l2, "");
          if (u2)
            for (l2 in u2)
              i2 && u2[l2] === i2[l2] || $(n2.style, l2, u2[l2]);
        }
      else if (l2[0] === "o" && l2[1] === "n")
        r2 = l2 !== (l2 = l2.replace(/Capture$/, "")), l2 = l2.toLowerCase() in n2 ? l2.toLowerCase().slice(2) : l2.slice(2), n2.l || (n2.l = {}), n2.l[l2 + r2] = u2, u2 ? i2 || n2.addEventListener(l2, r2 ? T : I, r2) : n2.removeEventListener(l2, r2 ? T : I, r2);
      else if (l2 !== "dangerouslySetInnerHTML") {
        if (t2)
          l2 = l2.replace(/xlink[H:h]/, "h").replace(/sName$/, "s");
        else if (l2 !== "href" && l2 !== "list" && l2 !== "form" && l2 !== "tabIndex" && l2 !== "download" && l2 in n2)
          try {
            n2[l2] = u2 == null ? "" : u2;
            break n;
          } catch (n3) {
          }
        typeof u2 == "function" || (u2 != null && (u2 !== false || l2[0] === "a" && l2[1] === "r") ? n2.setAttribute(l2, u2) : n2.removeAttribute(l2));
      }
  }
  function I(n2) {
    this.l[n2.type + false](l.event ? l.event(n2) : n2);
  }
  function T(n2) {
    this.l[n2.type + true](l.event ? l.event(n2) : n2);
  }
  function j(n2, u2, i2, t2, r2, o2, f2, e2, c2) {
    var s2, h2, v2, y2, p, k2, b2, m2, g2, x2, A, P2 = u2.type;
    if (u2.constructor !== void 0)
      return null;
    i2.__h != null && (c2 = i2.__h, e2 = u2.__e = i2.__e, u2.__h = null, o2 = [e2]), (s2 = l.__b) && s2(u2);
    try {
      n:
        if (typeof P2 == "function") {
          if (m2 = u2.props, g2 = (s2 = P2.contextType) && t2[s2.__c], x2 = s2 ? g2 ? g2.props.value : s2.__ : t2, i2.__c ? b2 = (h2 = u2.__c = i2.__c).__ = h2.__E : ("prototype" in P2 && P2.prototype.render ? u2.__c = h2 = new P2(m2, x2) : (u2.__c = h2 = new _(m2, x2), h2.constructor = P2, h2.render = O), g2 && g2.sub(h2), h2.props = m2, h2.state || (h2.state = {}), h2.context = x2, h2.__n = t2, v2 = h2.__d = true, h2.__h = []), h2.__s == null && (h2.__s = h2.state), P2.getDerivedStateFromProps != null && (h2.__s == h2.state && (h2.__s = a({}, h2.__s)), a(h2.__s, P2.getDerivedStateFromProps(m2, h2.__s))), y2 = h2.props, p = h2.state, v2)
            P2.getDerivedStateFromProps == null && h2.componentWillMount != null && h2.componentWillMount(), h2.componentDidMount != null && h2.__h.push(h2.componentDidMount);
          else {
            if (P2.getDerivedStateFromProps == null && m2 !== y2 && h2.componentWillReceiveProps != null && h2.componentWillReceiveProps(m2, x2), !h2.__e && h2.shouldComponentUpdate != null && h2.shouldComponentUpdate(m2, h2.__s, x2) === false || u2.__v === i2.__v) {
              h2.props = m2, h2.state = h2.__s, u2.__v !== i2.__v && (h2.__d = false), h2.__v = u2, u2.__e = i2.__e, u2.__k = i2.__k, u2.__k.forEach(function(n3) {
                n3 && (n3.__ = u2);
              }), h2.__h.length && f2.push(h2);
              break n;
            }
            h2.componentWillUpdate != null && h2.componentWillUpdate(m2, h2.__s, x2), h2.componentDidUpdate != null && h2.__h.push(function() {
              h2.componentDidUpdate(y2, p, k2);
            });
          }
          h2.context = x2, h2.props = m2, h2.state = h2.__s, (s2 = l.__r) && s2(u2), h2.__d = false, h2.__v = u2, h2.__P = n2, s2 = h2.render(h2.props, h2.state, h2.context), h2.state = h2.__s, h2.getChildContext != null && (t2 = a(a({}, t2), h2.getChildContext())), v2 || h2.getSnapshotBeforeUpdate == null || (k2 = h2.getSnapshotBeforeUpdate(y2, p)), A = s2 != null && s2.type === d && s2.key == null ? s2.props.children : s2, w(n2, Array.isArray(A) ? A : [A], u2, i2, t2, r2, o2, f2, e2, c2), h2.base = u2.__e, u2.__h = null, h2.__h.length && f2.push(h2), b2 && (h2.__E = h2.__ = null), h2.__e = false;
        } else
          o2 == null && u2.__v === i2.__v ? (u2.__k = i2.__k, u2.__e = i2.__e) : u2.__e = L(i2.__e, u2, i2, t2, r2, o2, f2, c2);
      (s2 = l.diffed) && s2(u2);
    } catch (n3) {
      u2.__v = null, (c2 || o2 != null) && (u2.__e = e2, u2.__h = !!c2, o2[o2.indexOf(e2)] = null), l.__e(n3, u2, i2);
    }
  }
  function z(n2, u2) {
    l.__c && l.__c(u2, n2), n2.some(function(u3) {
      try {
        n2 = u3.__h, u3.__h = [], n2.some(function(n3) {
          n3.call(u3);
        });
      } catch (n3) {
        l.__e(n3, u3.__v);
      }
    });
  }
  function L(l2, u2, i2, t2, r2, o2, f2, c2) {
    var s2, a2, v2, y2 = i2.props, p = u2.props, d2 = u2.type, _2 = 0;
    if (d2 === "svg" && (r2 = true), o2 != null) {
      for (; _2 < o2.length; _2++)
        if ((s2 = o2[_2]) && "setAttribute" in s2 == !!d2 && (d2 ? s2.localName === d2 : s2.nodeType === 3)) {
          l2 = s2, o2[_2] = null;
          break;
        }
    }
    if (l2 == null) {
      if (d2 === null)
        return document.createTextNode(p);
      l2 = r2 ? document.createElementNS("http://www.w3.org/2000/svg", d2) : document.createElement(d2, p.is && p), o2 = null, c2 = false;
    }
    if (d2 === null)
      y2 === p || c2 && l2.data === p || (l2.data = p);
    else {
      if (o2 = o2 && n.call(l2.childNodes), a2 = (y2 = i2.props || e).dangerouslySetInnerHTML, v2 = p.dangerouslySetInnerHTML, !c2) {
        if (o2 != null)
          for (y2 = {}, _2 = 0; _2 < l2.attributes.length; _2++)
            y2[l2.attributes[_2].name] = l2.attributes[_2].value;
        (v2 || a2) && (v2 && (a2 && v2.__html == a2.__html || v2.__html === l2.innerHTML) || (l2.innerHTML = v2 && v2.__html || ""));
      }
      if (C(l2, p, y2, r2, c2), v2)
        u2.__k = [];
      else if (_2 = u2.props.children, w(l2, Array.isArray(_2) ? _2 : [_2], u2, i2, t2, r2 && d2 !== "foreignObject", o2, f2, o2 ? o2[0] : i2.__k && k(i2, 0), c2), o2 != null)
        for (_2 = o2.length; _2--; )
          o2[_2] != null && h(o2[_2]);
      c2 || ("value" in p && (_2 = p.value) !== void 0 && (_2 !== y2.value || _2 !== l2.value || d2 === "progress" && !_2) && H(l2, "value", _2, y2.value, false), "checked" in p && (_2 = p.checked) !== void 0 && _2 !== l2.checked && H(l2, "checked", _2, y2.checked, false));
    }
    return l2;
  }
  function M(n2, u2, i2) {
    try {
      typeof n2 == "function" ? n2(u2) : n2.current = u2;
    } catch (n3) {
      l.__e(n3, i2);
    }
  }
  function N(n2, u2, i2) {
    var t2, r2;
    if (l.unmount && l.unmount(n2), (t2 = n2.ref) && (t2.current && t2.current !== n2.__e || M(t2, null, u2)), (t2 = n2.__c) != null) {
      if (t2.componentWillUnmount)
        try {
          t2.componentWillUnmount();
        } catch (n3) {
          l.__e(n3, u2);
        }
      t2.base = t2.__P = null;
    }
    if (t2 = n2.__k)
      for (r2 = 0; r2 < t2.length; r2++)
        t2[r2] && N(t2[r2], u2, typeof n2.type != "function");
    i2 || n2.__e == null || h(n2.__e), n2.__e = n2.__d = void 0;
  }
  function O(n2, l2, u2) {
    return this.constructor(n2, u2);
  }
  function S(u2, i2, t2) {
    var r2, o2, f2;
    l.__ && l.__(u2, i2), o2 = (r2 = typeof t2 == "function") ? null : t2 && t2.__k || i2.__k, f2 = [], j(i2, u2 = (!r2 && t2 || i2).__k = v(d, null, [u2]), o2 || e, e, i2.ownerSVGElement !== void 0, !r2 && t2 ? [t2] : o2 ? null : i2.firstChild ? n.call(i2.childNodes) : null, f2, !r2 && t2 ? t2 : o2 ? o2.__e : i2.firstChild, r2), z(f2, u2);
  }
  n = c.slice, l = { __e: function(n2, l2) {
    for (var u2, i2, t2; l2 = l2.__; )
      if ((u2 = l2.__c) && !u2.__)
        try {
          if ((i2 = u2.constructor) && i2.getDerivedStateFromError != null && (u2.setState(i2.getDerivedStateFromError(n2)), t2 = u2.__d), u2.componentDidCatch != null && (u2.componentDidCatch(n2), t2 = u2.__d), t2)
            return u2.__E = u2;
        } catch (l3) {
          n2 = l3;
        }
    throw n2;
  } }, u = 0, i = function(n2) {
    return n2 != null && n2.constructor === void 0;
  }, _.prototype.setState = function(n2, l2) {
    var u2;
    u2 = this.__s != null && this.__s !== this.state ? this.__s : this.__s = a({}, this.state), typeof n2 == "function" && (n2 = n2(a({}, u2), this.props)), n2 && a(u2, n2), n2 != null && this.__v && (l2 && this.__h.push(l2), m(this));
  }, _.prototype.forceUpdate = function(n2) {
    this.__v && (this.__e = true, n2 && this.__h.push(n2), m(this));
  }, _.prototype.render = d, t = [], r = typeof Promise == "function" ? Promise.prototype.then.bind(Promise.resolve()) : setTimeout, g.__r = 0, f = 0;

  // src/config.js
  var default_configs = {
    colorful: true,
    always: false,
    opacity: 0.3,
    wait: 1e3,
    segments: 50,
    threshold: 300
  };
  var configs = JSON.parse(localStorage.getItem("bahamut-anime-comment-mountains-configs") || JSON.stringify(default_configs));
  function get(key) {
    return configs[key];
  }
  function set(key, value) {
    configs[key] = value;
    localStorage.setItem("bahamut-anime-comment-mountains-configs", JSON.stringify(configs));
  }
  function reset() {
    localStorage.removeItem("bahamut-anime-comment-mountains-configs");
    for (let key in configs) {
      if (default_configs.hasOwnProperty(key)) {
        set(key, default_configs[key]);
      } else {
        delete configs[key];
      }
    }
  }
  var cfg = {
    get colorful() {
      return get("colorful");
    },
    get always() {
      return get("always");
    },
    get opacity() {
      return get("opacity");
    },
    get wait() {
      return get("wait");
    },
    get segments() {
      return get("segments");
    },
    get threshold() {
      return get("threshold");
    },
    set colorful(value) {
      value = !!value;
      set("colorful", value);
    },
    set always(value) {
      value = !!value;
      set("always", value);
    },
    set opacity(value) {
      value = parseFloat(value) || 0.3;
      set("opacity", value);
    },
    set wait(value) {
      value = parseInt(value) || 1e3;
      set("wait", value);
    },
    set segments(value) {
      value = parseInt(value) || 50;
      set("segments", value);
    },
    set threshold(value) {
      value = parseInt(value) || 300;
      set("threshold", value);
    }
  };

  // src/setup.jsx
  function setup() {
    const { canvas: canvas2, ctx: ctx2 } = create_canvas();
    if (cfg.always) {
      document.querySelector("video-js").appendChild(canvas2);
    } else {
      document.querySelector(".control-bar-mask").appendChild(canvas2);
    }
    const { canvas: preview, ctx: preview_ctx } = create_canvas();
    preview.style.zIndex = 15;
    document.querySelector(".R18").appendChild(preview);
    create_panel();
    return { canvas: canvas2, ctx: ctx2, preview, preview_ctx };
  }
  function create_canvas() {
    const canvas2 = document.createElement("canvas");
    Object.assign(canvas2, { width: 1e3, height: 300 });
    Object.assign(canvas2.style, {
      position: "absolute",
      bottom: 0,
      left: 0,
      width: "100%",
      zIndex: 5,
      "pointer-events": "none"
    });
    const ctx2 = canvas2.getContext("2d");
    Object.assign(ctx2, {
      fillStyle: "white",
      strokeStyle: "white",
      lineJoin: "round",
      lineCap: "round",
      lineWidth: 2
    });
    return { canvas: canvas2, ctx: ctx2 };
  }
  function create_panel() {
    const tabs = document.querySelector(".sub_top.ani-tabs");
    const contents = document.querySelector(".ani-tab-content");
    const tab = /* @__PURE__ */ v("div", {
      id: "cm-settings",
      class: "ani-tabs__item"
    }, /* @__PURE__ */ v("a", {
      class: "ani-tabs-link",
      href: "#ani-tab-content-cm",
      onClick: (e2) => {
        document.querySelector(".ani-tabs-link.is-active").classList.remove("is-active");
        e2.target.classList.add("is-active");
        document.querySelectorAll(".ani-tab-content__item").forEach((item) => {
          item.style.display = "none";
        });
        document.querySelector("#ani-tab-content-cm").style.display = "block";
        e2.preventDefault();
      }
    }, "\u5F48\u5E55\u5C71\u8108"));
    const content = /* @__PURE__ */ v("div", {
      class: "ani-tab-content__item",
      id: "ani-tab-content-cm",
      style: "display: none"
    }, /* @__PURE__ */ v("div", {
      class: "ani-setting-section"
    }, /* @__PURE__ */ v("h4", {
      class: "ani-setting-title"
    }, "\u5C71\u8108\u8A2D\u5B9A"), /* @__PURE__ */ v("div", {
      class: "ani-setting-item ani-flex"
    }, /* @__PURE__ */ v("div", {
      class: "ani-setting-label"
    }, /* @__PURE__ */ v("span", {
      class: "ani-setting-label__mian"
    }, "\u6301\u7E8C\u986F\u793A")), /* @__PURE__ */ v("div", {
      class: "ani-setting-value ani-set-flex-right"
    }, /* @__PURE__ */ v("div", {
      class: "ani-checkbox"
    }, /* @__PURE__ */ v("label", {
      class: "ani-checkbox__label"
    }, /* @__PURE__ */ v("input", {
      id: "cm-always",
      type: "checkbox",
      name: "ani-checkbox",
      checked: cfg.always,
      onChange: (e2) => {
        window.cm.always = e2.target.checked;
      }
    }), /* @__PURE__ */ v("div", {
      class: "ani-checkbox__button"
    }))))), /* @__PURE__ */ v("div", {
      class: "ani-setting-item ani-flex"
    }, /* @__PURE__ */ v("div", {
      class: "ani-setting-label"
    }, /* @__PURE__ */ v("span", {
      class: "ani-setting-label__mian"
    }, "\u5F69\u8272\u986F\u793A")), /* @__PURE__ */ v("div", {
      class: "ani-setting-value ani-set-flex-right"
    }, /* @__PURE__ */ v("div", {
      class: "ani-checkbox"
    }, /* @__PURE__ */ v("label", {
      class: "ani-checkbox__label"
    }, /* @__PURE__ */ v("input", {
      id: "cm-colorful",
      type: "checkbox",
      name: "ani-checkbox",
      checked: cfg.colorful,
      onChange: (e2) => {
        window.cm.colorful = e2.target.checked;
      }
    }), /* @__PURE__ */ v("div", {
      class: "ani-checkbox__button"
    }))))), /* @__PURE__ */ v("div", {
      class: "ani-setting-item ani-flex"
    }, /* @__PURE__ */ v("div", {
      class: "ani-setting-label"
    }, /* @__PURE__ */ v("span", {
      class: "ani-setting-label__mian"
    }, "\u4E0D\u900F\u660E\u5EA6"), /* @__PURE__ */ v("span", {
      class: "ani-setting-label__sub",
      id: "cm-opacity-label"
    }, cfg.opacity * 100, "%")), /* @__PURE__ */ v("div", {
      class: "ani-setting-value ani-set-flex-right"
    }, /* @__PURE__ */ v("div", {
      class: "ani-range",
      id: "cm-opacity-range"
    }, /* @__PURE__ */ v("input", {
      type: "range",
      id: "cm-opacity",
      max: "100",
      min: "10",
      step: "10",
      value: cfg.opacity * 100,
      onChange: (e2) => {
        window.cm.opacity = parseInt(e2.target.value) / 100;
        document.querySelector("#cm-opacity-label").innerText = e2.target.value + "%";
      }
    })))), /* @__PURE__ */ v("div", {
      class: "ani-setting-item ani-flex"
    }, /* @__PURE__ */ v("div", {
      class: "ani-setting-label"
    }, /* @__PURE__ */ v("span", {
      class: "ani-setting-label__mian"
    }, "\u71B1\u5EA6\u95A5\u503C"), /* @__PURE__ */ v("span", {
      class: "ani-setting-label__sub",
      id: "cm-threshold-label"
    }, cfg.threshold)), /* @__PURE__ */ v("div", {
      class: "ani-setting-value ani-set-flex-right"
    }, /* @__PURE__ */ v("div", {
      class: "ani-range",
      id: "cm-threshold-input"
    }, /* @__PURE__ */ v("input", {
      type: "number",
      id: "cm-threshold",
      max: "1000",
      min: "0",
      step: "10",
      value: cfg.threshold,
      onChange: (e2) => {
        window.cm.threshold = parseInt(e2.target.value);
        document.querySelector("#cm-threshold-label").innerText = e2.target.value;
      }
    })))), /* @__PURE__ */ v("div", {
      class: "ani-setting-item ani-flex"
    }, /* @__PURE__ */ v("div", {
      class: "ani-setting-label"
    }, /* @__PURE__ */ v("span", {
      class: "ani-setting-label__mian"
    }, "\u5207\u7247\u5927\u5C0F"), /* @__PURE__ */ v("span", {
      class: "ani-setting-label__sub",
      id: "cm-segments-label"
    }, cfg.segments)), /* @__PURE__ */ v("div", {
      class: "ani-setting-value ani-set-flex-right"
    }, /* @__PURE__ */ v("div", {
      class: "ani-range",
      id: "cm-segments-input"
    }, /* @__PURE__ */ v("input", {
      type: "number",
      id: "cm-segments",
      max: "1000",
      min: "0",
      step: "10",
      value: cfg.segments,
      onChange: (e2) => {
        window.cm.segments = parseInt(e2.target.value);
        document.querySelector("#cm-segments-label").innerText = e2.target.value;
      }
    }))))), /* @__PURE__ */ v("style", null, '#ani-tab-content-cm input[type="number"] ', "{", "border: none; color: #54c3e0; font-size: 2rem; text-align: right; ", "}"));
    S(tab, tabs.appendChild(document.createElement("div")));
    S(content, contents.appendChild(document.createElement("div")));
  }

  // src/types.js
  var Comment = class {
    constructor(data) {
      __publicField(this, "text", "");
      __publicField(this, "userid", "");
      __publicField(this, "color", "");
      __publicField(this, "position", 0);
      __publicField(this, "size", 0);
      __publicField(this, "sn", 0);
      __publicField(this, "time", 0);
      Object.assign(this, data);
    }
  };
  var Point = class {
    constructor(x2 = 0, y2 = 0) {
      __publicField(this, "x", 0);
      __publicField(this, "y", 0);
      this.x = x2;
      this.y = y2;
    }
  };

  // src/index.js
  var canvas;
  var ctx;
  var comments = [];
  var video_duration = null;
  (function() {
    return __async(this, null, function* () {
      yield sleep(cfg.wait);
      observe_video_src();
      let elms = setup();
      canvas = elms.canvas;
      ctx = elms.ctx;
      comments = yield get_comments();
      paint();
      elms.preview_ctx.drawImage(canvas, 0, 0);
      set_global_hook();
    });
  })();
  function paint() {
    const { max, heights } = calc_heights();
    const points = calc_points(heights);
    set_color(max);
    set_opacity();
    draw_mountains(points);
  }
  function get_comments(ignore = false) {
    return __async(this, null, function* () {
      const data = yield retry(() => fetch("https://ani.gamer.com.tw/ajax/danmuGet.php", {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded"
        },
        body: `sn=${location.search.match(/\d+/)[0]}`
      }).then((res) => res.json()));
      const comments2 = data.map((x2) => new Comment(x2));
      log("Comments", comments2);
      if (ignore) {
        const ignores = yield retry(() => fetch("https://ani.gamer.com.tw/ajax/keywordGet.php").then((res) => res.json()).then((list) => list.map((x2) => x2.keyword)));
        return comments2.filter((x2) => !ignores.some((y2) => x2.text.includes(y2)));
      }
      return comments2;
    });
  }
  function calc_heights() {
    comments = comments.sort((a2, b2) => a2.time - b2.time);
    const width = (video_duration || comments[comments.length - 1].time) / cfg.segments;
    log("Width", width);
    const heights = new Array(cfg.segments).fill(0);
    let idx = 0;
    for (let i2 = 0; i2 < comments.length; i2++) {
      while (comments[i2].time > (idx + 1) * width + 0.1) {
        idx++;
      }
      heights[idx]++;
    }
    heights.splice(cfg.segments, heights.length - cfg.segments);
    log("Heights", heights);
    const max = Math.max(...heights);
    log("Max", max);
    const normalized = heights.map((x2) => x2 / max);
    log("Normalized", normalized);
    return { max, heights: normalized };
  }
  function calc_points(heights) {
    const points = [];
    for (let i2 = 0; i2 < heights.length; i2++) {
      points.push(new Point(canvas.width / heights.length * (i2 + 0.5), canvas.height * 0.5 * (2 - heights[i2])));
    }
    return points;
  }
  function set_color(max) {
    const offset = max - cfg.threshold < 50 ? max - cfg.threshold : 50;
    log("Color Offset", offset);
    if (cfg.colorful) {
      const grd = ctx.createLinearGradient(0, canvas.height * 0.5 + offset, 0, canvas.height);
      grd.addColorStop(0, "#BF616A");
      grd.addColorStop(0.4, "#EBCB8B");
      grd.addColorStop(0.5, "#EBCB8B");
      grd.addColorStop(1, "#A3BE8C");
      ctx.fillStyle = grd;
    } else {
      ctx.fillStyle = "white";
    }
  }
  function set_opacity() {
    if (cfg.opacity) {
      ctx.globalAlpha = cfg.opacity;
    } else {
      ctx.globalAlpha = 0.3;
    }
  }
  function draw_mountains(points) {
    const paint_points = [new Point(0, canvas.height), ...points, new Point(canvas.width, canvas.height)];
    const f2 = 0.3;
    const t2 = 0.6;
    let m2 = 0, dx1 = 0, dy1 = 0, dx2 = 0, dy2 = 0;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.beginPath();
    ctx.moveTo(0, canvas.height);
    let prev_point = paint_points[0];
    for (let i2 = 0; i2 < paint_points.length; i2++) {
      const curr_point = paint_points[i2];
      const next_point = paint_points[i2 + 1];
      if (next_point) {
        m2 = (next_point.y - prev_point.y) / (next_point.x - prev_point.x);
        dx2 = (next_point.x - curr_point.x) * -f2;
        dy2 = dx2 * m2 * t2;
      } else {
        m2 = 0;
        dx2 = 0;
        dy2 = 0;
      }
      ctx.bezierCurveTo(prev_point.x - dx1, prev_point.y - dy1, curr_point.x + dx2, curr_point.y + dy2, curr_point.x, curr_point.y);
      dx1 = dx2;
      dy1 = dy2;
      prev_point = curr_point;
    }
    ctx.lineTo(canvas.width, canvas.height);
    ctx.closePath();
    ctx.fill();
  }
  function set_global_hook() {
    window.cm = {
      reset() {
        reset();
        paint();
      }
    };
    for (const key in cfg) {
      Object.defineProperty(window.cm, key, {
        get: () => cfg[key],
        set: (val) => {
          cfg[key] = val;
          if (key === "always") {
            if (!!val) {
              document.querySelector("video-js").appendChild(canvas);
            } else {
              document.querySelector(".control-bar-mask").appendChild(canvas);
            }
          } else if (key === "wait") {
            log("Wait", val);
          } else {
            paint();
          }
        }
      });
    }
  }
  function observe_video_src() {
    const target = document.querySelector("video");
    const config = { attributes: true, attributeFilter: ["src"] };
    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (mutation.attributeName === "src") {
          target.addEventListener("loadedmetadata", () => {
            log("Real Video Duration", target.duration);
            video_duration = target.duration * 10;
            paint();
          });
        }
      });
    });
    observer.observe(target, config);
  }
})();