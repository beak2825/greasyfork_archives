// ==UserScript==
// @name         Stats, Shards, XP, Dust, Quest, Res, Loot and Level tracker v2
// @namespace    http://tampermonkey.net/
// @version      4.5.7
// @description  Tracks XP, Dust, leveling speed, quest time, as well as shards, stats, farm output, potion profitability and overhauls items entirely
// @icon         https://www.google.com/s2/favicons?sz=64&domain=manarion.com
// @match        *://manarion.com/*
// @grant        none
// @author       Elnaeth(main) & axie(some qol improvements)
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/546568/Stats%2C%20Shards%2C%20XP%2C%20Dust%2C%20Quest%2C%20Res%2C%20Loot%20and%20Level%20tracker%20v2.user.js
// @updateURL https://update.greasyfork.org/scripts/546568/Stats%2C%20Shards%2C%20XP%2C%20Dust%2C%20Quest%2C%20Res%2C%20Loot%20and%20Level%20tracker%20v2.meta.js
// ==/UserScript==

/*
     ======= Changelog =======
     v4.5.7
     Updated resonance tier calculation (not sure if correct would appreciate feedback)

     v4.5.6
     Updated potion cost formula to include 0.0002*tier^3 term
     Added Potion Duration boost to calculations for max tier calculations

     v4.5.5
     Changed daily/hourly shards to use math instead of loot tracker

     v4.5.4
     Added max potion tier w/ resonance running with tax and no tax.

     v4.5.3
     Fixed wrong calculation for max pot tier using held dust. Added max pot tier using income.

     v4.5.2
     Fixed wrong calculation for herbs/hr, fixed ideal resonance potion tier to not include equipment shard boosts from player.
     
     v4.5.1
     Fixed the ideal resonance potion tier calculation.
     - The formula now correctly identifies the tier with the absolute maximum profit, not just the break-even point.
     - Removed the "Max Resonance Tier" field from the UI as it was not useful.

     v4.5.0
     Added Farm and Potion tracking capabilities.
     - Calculates total Herbs/hr based on farm upgrades.
     - Calculates the maximum sustainable potion tier for Wisdom, Harvesting, and Resonance based on herb output.
     - Fetches live market prices for herbs and shards.
     - Calculates the ideal Potion of Resonance tier to run for maximum profit by finding the inflection point between cost and shard revenue.
     - Displays all new information in a dedicated section in the main tracker UI.
     
     v4.4.2
     Fixed resources showing up in the UI when they shouldn't for TSers.
     
     v4.4.1
     Pets! Added egg drops from chicken tracking.
    */

"use strict";

const globals = {
  lastGainedXP: 0,
  lastGainedDust: 0,
  lastGainedResource: 0,

  // TODO take 100% tax edge cases into account
};

/* minified absolutely smallest version of cashJS, a dep aimed at providing the smallest possible jQuery-like experience  */
(function () {
  "use strict";
  var C = document,
    D = window,
    st = C.documentElement,
    L = C.createElement.bind(C),
    ft = L("div"),
    q = L("table"),
    Mt = L("tbody"),
    ot = L("tr"),
    H = Array.isArray,
    S = Array.prototype,
    Dt = S.concat,
    U = S.filter,
    at = S.indexOf,
    ct = S.map,
    Bt = S.push,
    ht = S.slice,
    z = S.some,
    _t = S.splice,
    Pt = /^#(?:[\w-]|\\.|[^\x00-\xa0])*$/,
    Ht = /^\.(?:[\w-]|\\.|[^\x00-\xa0])*$/,
    $t = /<.+>/,
    jt = /^\w+$/;
  function J(t, n) {
    var r = It(n);
    return !t || (!r && !A(n) && !c(n))
      ? []
      : !r && Ht.test(t)
      ? n.getElementsByClassName(t.slice(1).replace(/\\/g, ""))
      : !r && jt.test(t)
      ? n.getElementsByTagName(t)
      : n.querySelectorAll(t);
  }
  var dt = (function () {
      function t(n, r) {
        if (n) {
          if (Y(n)) return n;
          var i = n;
          if (g(n)) {
            var e = r || C;
            if (
              ((i =
                Pt.test(n) && A(e)
                  ? e.getElementById(n.slice(1).replace(/\\/g, ""))
                  : $t.test(n)
                  ? yt(n)
                  : Y(e)
                  ? e.find(n)
                  : g(e)
                  ? o(e).find(n)
                  : J(n, e)),
              !i)
            )
              return;
          } else if (O(n)) return this.ready(n);
          (i.nodeType || i === D) && (i = [i]), (this.length = i.length);
          for (var s = 0, f = this.length; s < f; s++) this[s] = i[s];
        }
      }
      return (
        (t.prototype.init = function (n, r) {
          return new t(n, r);
        }),
        t
      );
    })(),
    u = dt.prototype,
    o = u.init;
  (o.fn = o.prototype = u),
    (u.length = 0),
    (u.splice = _t),
    typeof Symbol == "function" && (u[Symbol.iterator] = S[Symbol.iterator]);
  function Y(t) {
    return t instanceof dt;
  }
  function B(t) {
    return !!t && t === t.window;
  }
  function A(t) {
    return !!t && t.nodeType === 9;
  }
  function It(t) {
    return !!t && t.nodeType === 11;
  }
  function c(t) {
    return !!t && t.nodeType === 1;
  }
  function Ft(t) {
    return !!t && t.nodeType === 3;
  }
  function Wt(t) {
    return typeof t == "boolean";
  }
  function O(t) {
    return typeof t == "function";
  }
  function g(t) {
    return typeof t == "string";
  }
  function v(t) {
    return t === void 0;
  }
  function P(t) {
    return t === null;
  }
  function lt(t) {
    return !isNaN(parseFloat(t)) && isFinite(t);
  }
  function G(t) {
    if (typeof t != "object" || t === null) return !1;
    var n = Object.getPrototypeOf(t);
    return n === null || n === Object.prototype;
  }
  (o.isWindow = B),
    (o.isFunction = O),
    (o.isArray = H),
    (o.isNumeric = lt),
    (o.isPlainObject = G);
  function d(t, n, r) {
    if (r) {
      for (var i = t.length; i--; ) if (n.call(t[i], i, t[i]) === !1) return t;
    } else if (G(t))
      for (var e = Object.keys(t), i = 0, s = e.length; i < s; i++) {
        var f = e[i];
        if (n.call(t[f], f, t[f]) === !1) return t;
      }
    else
      for (var i = 0, s = t.length; i < s; i++)
        if (n.call(t[i], i, t[i]) === !1) return t;
    return t;
  }
  (o.each = d),
    (u.each = function (t) {
      return d(this, t);
    }),
    (u.empty = function () {
      return this.each(function (t, n) {
        for (; n.firstChild; ) n.removeChild(n.firstChild);
      });
    });
  function $() {
    for (var t = [], n = 0; n < arguments.length; n++) t[n] = arguments[n];
    var r = Wt(t[0]) ? t.shift() : !1,
      i = t.shift(),
      e = t.length;
    if (!i) return {};
    if (!e) return $(r, o, i);
    for (var s = 0; s < e; s++) {
      var f = t[s];
      for (var a in f)
        r && (H(f[a]) || G(f[a]))
          ? ((!i[a] || i[a].constructor !== f[a].constructor) &&
              (i[a] = new f[a].constructor()),
            $(r, i[a], f[a]))
          : (i[a] = f[a]);
    }
    return i;
  }
  (o.extend = $),
    (u.extend = function (t) {
      return $(u, t);
    });
  var qt = /\S+/g;
  function j(t) {
    return g(t) ? t.match(qt) || [] : [];
  }
  (u.toggleClass = function (t, n) {
    var r = j(t),
      i = !v(n);
    return this.each(function (e, s) {
      c(s) &&
        d(r, function (f, a) {
          i
            ? n
              ? s.classList.add(a)
              : s.classList.remove(a)
            : s.classList.toggle(a);
        });
    });
  }),
    (u.addClass = function (t) {
      return this.toggleClass(t, !0);
    }),
    (u.removeAttr = function (t) {
      var n = j(t);
      return this.each(function (r, i) {
        c(i) &&
          d(n, function (e, s) {
            i.removeAttribute(s);
          });
      });
    });
  function Ut(t, n) {
    if (t) {
      if (g(t)) {
        if (arguments.length < 2) {
          if (!this[0] || !c(this[0])) return;
          var r = this[0].getAttribute(t);
          return P(r) ? void 0 : r;
        }
        return v(n)
          ? this
          : P(n)
          ? this.removeAttr(t)
          : this.each(function (e, s) {
              c(s) && s.setAttribute(t, n);
            });
      }
      for (var i in t) this.attr(i, t[i]);
      return this;
    }
  }
  (u.attr = Ut),
    (u.removeClass = function (t) {
      return arguments.length
        ? this.toggleClass(t, !1)
        : this.attr("class", "");
    }),
    (u.hasClass = function (t) {
      return (
        !!t &&
        z.call(this, function (n) {
          return c(n) && n.classList.contains(t);
        })
      );
    }),
    (u.get = function (t) {
      return v(t)
        ? ht.call(this)
        : ((t = Number(t)), this[t < 0 ? t + this.length : t]);
    }),
    (u.eq = function (t) {
      return o(this.get(t));
    }),
    (u.first = function () {
      return this.eq(0);
    }),
    (u.last = function () {
      return this.eq(-1);
    });
  function zt(t) {
    return v(t)
      ? this.get()
          .map(function (n) {
            return c(n) || Ft(n) ? n.textContent : "";
          })
          .join("")
      : this.each(function (n, r) {
          c(r) && (r.textContent = t);
        });
  }
  u.text = zt;
  function T(t, n, r) {
    if (c(t)) {
      var i = D.getComputedStyle(t, null);
      return r ? i.getPropertyValue(n) || void 0 : i[n] || t.style[n];
    }
  }
  function E(t, n) {
    return parseInt(T(t, n), 10) || 0;
  }
  function gt(t, n) {
    return (
      E(t, "border".concat(n ? "Left" : "Top", "Width")) +
      E(t, "padding".concat(n ? "Left" : "Top")) +
      E(t, "padding".concat(n ? "Right" : "Bottom")) +
      E(t, "border".concat(n ? "Right" : "Bottom", "Width"))
    );
  }
  var X = {};
  function Jt(t) {
    if (X[t]) return X[t];
    var n = L(t);
    C.body.insertBefore(n, null);
    var r = T(n, "display");
    return C.body.removeChild(n), (X[t] = r !== "none" ? r : "block");
  }
  function vt(t) {
    return T(t, "display") === "none";
  }
  function pt(t, n) {
    var r = t && (t.matches || t.webkitMatchesSelector || t.msMatchesSelector);
    return !!r && !!n && r.call(t, n);
  }
  function I(t) {
    return g(t)
      ? function (n, r) {
          return pt(r, t);
        }
      : O(t)
      ? t
      : Y(t)
      ? function (n, r) {
          return t.is(r);
        }
      : t
      ? function (n, r) {
          return r === t;
        }
      : function () {
          return !1;
        };
  }
  u.filter = function (t) {
    var n = I(t);
    return o(
      U.call(this, function (r, i) {
        return n.call(r, i, r);
      })
    );
  };
  function x(t, n) {
    return n ? t.filter(n) : t;
  }
  u.detach = function (t) {
    return (
      x(this, t).each(function (n, r) {
        r.parentNode && r.parentNode.removeChild(r);
      }),
      this
    );
  };
  var Yt = /^\s*<(\w+)[^>]*>/,
    Gt = /^<(\w+)\s*\/?>(?:<\/\1>)?$/,
    mt = { "*": ft, tr: Mt, td: ot, th: ot, thead: q, tbody: q, tfoot: q };
  function yt(t) {
    if (!g(t)) return [];
    if (Gt.test(t)) return [L(RegExp.$1)];
    var n = Yt.test(t) && RegExp.$1,
      r = mt[n] || mt["*"];
    return (r.innerHTML = t), o(r.childNodes).detach().get();
  }
  (o.parseHTML = yt),
    (u.has = function (t) {
      var n = g(t)
        ? function (r, i) {
            return J(t, i).length;
          }
        : function (r, i) {
            return i.contains(t);
          };
      return this.filter(n);
    }),
    (u.not = function (t) {
      var n = I(t);
      return this.filter(function (r, i) {
        return (!g(t) || c(i)) && !n.call(i, r, i);
      });
    });
  function R(t, n, r, i) {
    for (var e = [], s = O(n), f = i && I(i), a = 0, y = t.length; a < y; a++)
      if (s) {
        var h = n(t[a]);
        h.length && Bt.apply(e, h);
      } else
        for (var p = t[a][n]; p != null && !(i && f(-1, p)); )
          e.push(p), (p = r ? p[n] : null);
    return e;
  }
  function bt(t) {
    return t.multiple && t.options
      ? R(
          U.call(t.options, function (n) {
            return n.selected && !n.disabled && !n.parentNode.disabled;
          }),
          "value"
        )
      : t.value || "";
  }
  function Xt(t) {
    return arguments.length
      ? this.each(function (n, r) {
          var i = r.multiple && r.options;
          if (i || Ot.test(r.type)) {
            var e = H(t) ? ct.call(t, String) : P(t) ? [] : [String(t)];
            i
              ? d(
                  r.options,
                  function (s, f) {
                    f.selected = e.indexOf(f.value) >= 0;
                  },
                  !0
                )
              : (r.checked = e.indexOf(r.value) >= 0);
          } else r.value = v(t) || P(t) ? "" : t;
        })
      : this[0] && bt(this[0]);
  }
  (u.val = Xt),
    (u.is = function (t) {
      var n = I(t);
      return z.call(this, function (r, i) {
        return n.call(r, i, r);
      });
    }),
    (o.guid = 1);
  function w(t) {
    return t.length > 1
      ? U.call(t, function (n, r, i) {
          return at.call(i, n) === r;
        })
      : t;
  }
  (o.unique = w),
    (u.add = function (t, n) {
      return o(w(this.get().concat(o(t, n).get())));
    }),
    (u.children = function (t) {
      return x(
        o(
          w(
            R(this, function (n) {
              return n.children;
            })
          )
        ),
        t
      );
    }),
    (u.parent = function (t) {
      return x(o(w(R(this, "parentNode"))), t);
    }),
    (u.index = function (t) {
      var n = t ? o(t)[0] : this[0],
        r = t ? this : o(n).parent().children();
      return at.call(r, n);
    }),
    (u.closest = function (t) {
      var n = this.filter(t);
      if (n.length) return n;
      var r = this.parent();
      return r.length ? r.closest(t) : n;
    }),
    (u.siblings = function (t) {
      return x(
        o(
          w(
            R(this, function (n) {
              return o(n).parent().children().not(n);
            })
          )
        ),
        t
      );
    }),
    (u.find = function (t) {
      return o(
        w(
          R(this, function (n) {
            return J(t, n);
          })
        )
      );
    });
  var Kt = /^\s*<!(?:\[CDATA\[|--)|(?:\]\]|--)>\s*$/g,
    Qt = /^$|^module$|\/(java|ecma)script/i,
    Vt = ["type", "src", "nonce", "noModule"];
  function Zt(t, n) {
    var r = o(t);
    r.filter("script")
      .add(r.find("script"))
      .each(function (i, e) {
        if (Qt.test(e.type) && st.contains(e)) {
          var s = L("script");
          (s.text = e.textContent.replace(Kt, "")),
            d(Vt, function (f, a) {
              e[a] && (s[a] = e[a]);
            }),
            n.head.insertBefore(s, null),
            n.head.removeChild(s);
        }
      });
  }
  function kt(t, n, r, i, e) {
    i
      ? t.insertBefore(n, r ? t.firstChild : null)
      : t.nodeName === "HTML"
      ? t.parentNode.replaceChild(n, t)
      : t.parentNode.insertBefore(n, r ? t : t.nextSibling),
      e && Zt(n, t.ownerDocument);
  }
  function N(t, n, r, i, e, s, f, a) {
    return (
      d(
        t,
        function (y, h) {
          d(
            o(h),
            function (p, M) {
              d(
                o(n),
                function (b, W) {
                  var rt = r ? M : W,
                    it = r ? W : M,
                    m = r ? p : b;
                  kt(rt, m ? it.cloneNode(!0) : it, i, e, !m);
                },
                a
              );
            },
            f
          );
        },
        s
      ),
      n
    );
  }
  (u.after = function () {
    return N(arguments, this, !1, !1, !1, !0, !0);
  }),
    (u.append = function () {
      return N(arguments, this, !1, !1, !0);
    });
  function tn(t) {
    if (!arguments.length) return this[0] && this[0].innerHTML;
    if (v(t)) return this;
    var n = /<script[\s>]/.test(t);
    return this.each(function (r, i) {
      c(i) && (n ? o(i).empty().append(t) : (i.innerHTML = t));
    });
  }
  (u.html = tn),
    (u.appendTo = function (t) {
      return N(arguments, this, !0, !1, !0);
    }),
    (u.wrapInner = function (t) {
      return this.each(function (n, r) {
        var i = o(r),
          e = i.contents();
        e.length ? e.wrapAll(t) : i.append(t);
      });
    }),
    (u.before = function () {
      return N(arguments, this, !1, !0);
    }),
    (u.wrapAll = function (t) {
      for (var n = o(t), r = n[0]; r.children.length; ) r = r.firstElementChild;
      return this.first().before(n), this.appendTo(r);
    }),
    (u.wrap = function (t) {
      return this.each(function (n, r) {
        var i = o(t)[0];
        o(r).wrapAll(n ? i.cloneNode(!0) : i);
      });
    }),
    (u.insertAfter = function (t) {
      return N(arguments, this, !0, !1, !1, !1, !1, !0);
    }),
    (u.insertBefore = function (t) {
      return N(arguments, this, !0, !0);
    }),
    (u.prepend = function () {
      return N(arguments, this, !1, !0, !0, !0, !0);
    }),
    (u.prependTo = function (t) {
      return N(arguments, this, !0, !0, !0, !1, !1, !0);
    }),
    (u.contents = function () {
      return o(
        w(
          R(this, function (t) {
            return t.tagName === "IFRAME"
              ? [t.contentDocument]
              : t.tagName === "TEMPLATE"
              ? t.content.childNodes
              : t.childNodes;
          })
        )
      );
    }),
    (u.next = function (t, n, r) {
      return x(o(w(R(this, "nextElementSibling", n, r))), t);
    }),
    (u.nextAll = function (t) {
      return this.next(t, !0);
    }),
    (u.nextUntil = function (t, n) {
      return this.next(n, !0, t);
    }),
    (u.parents = function (t, n) {
      return x(o(w(R(this, "parentElement", !0, n))), t);
    }),
    (u.parentsUntil = function (t, n) {
      return this.parents(n, t);
    }),
    (u.prev = function (t, n, r) {
      return x(o(w(R(this, "previousElementSibling", n, r))), t);
    }),
    (u.prevAll = function (t) {
      return this.prev(t, !0);
    }),
    (u.prevUntil = function (t, n) {
      return this.prev(n, !0, t);
    }),
    (u.map = function (t) {
      return o(
        Dt.apply(
          [],
          ct.call(this, function (n, r) {
            return t.call(n, r, n);
          })
        )
      );
    }),
    (u.clone = function () {
      return this.map(function (t, n) {
        return n.cloneNode(!0);
      });
    }),
    (u.offsetParent = function () {
      return this.map(function (t, n) {
        for (var r = n.offsetParent; r && T(r, "position") === "static"; )
          r = r.offsetParent;
        return r || st;
      });
    }),
    (u.slice = function (t, n) {
      return o(ht.call(this, t, n));
    });
  var nn = /-([a-z])/g;
  function K(t) {
    return t.replace(nn, function (n, r) {
      return r.toUpperCase();
    });
  }
  (u.ready = function (t) {
    var n = function () {
      return setTimeout(t, 0, o);
    };
    return (
      C.readyState !== "loading"
        ? n()
        : C.addEventListener("DOMContentLoaded", n),
      this
    );
  }),
    (u.unwrap = function () {
      return (
        this.parent().each(function (t, n) {
          if (n.tagName !== "BODY") {
            var r = o(n);
            r.replaceWith(r.children());
          }
        }),
        this
      );
    }),
    (u.offset = function () {
      var t = this[0];
      if (t) {
        var n = t.getBoundingClientRect();
        return { top: n.top + D.pageYOffset, left: n.left + D.pageXOffset };
      }
    }),
    (u.position = function () {
      var t = this[0];
      if (t) {
        var n = T(t, "position") === "fixed",
          r = n ? t.getBoundingClientRect() : this.offset();
        if (!n) {
          for (
            var i = t.ownerDocument, e = t.offsetParent || i.documentElement;
            (e === i.body || e === i.documentElement) &&
            T(e, "position") === "static";

          )
            e = e.parentNode;
          if (e !== t && c(e)) {
            var s = o(e).offset();
            (r.top -= s.top + E(e, "borderTopWidth")),
              (r.left -= s.left + E(e, "borderLeftWidth"));
          }
        }
        return {
          top: r.top - E(t, "marginTop"),
          left: r.left - E(t, "marginLeft"),
        };
      }
    });
  var Et = {
    class: "className",
    contenteditable: "contentEditable",
    for: "htmlFor",
    readonly: "readOnly",
    maxlength: "maxLength",
    tabindex: "tabIndex",
    colspan: "colSpan",
    rowspan: "rowSpan",
    usemap: "useMap",
  };
  (u.prop = function (t, n) {
    if (t) {
      if (g(t))
        return (
          (t = Et[t] || t),
          arguments.length < 2
            ? this[0] && this[0][t]
            : this.each(function (i, e) {
                e[t] = n;
              })
        );
      for (var r in t) this.prop(r, t[r]);
      return this;
    }
  }),
    (u.removeProp = function (t) {
      return this.each(function (n, r) {
        delete r[Et[t] || t];
      });
    });
  var rn = /^--/;
  function Q(t) {
    return rn.test(t);
  }
  var V = {},
    en = ft.style,
    un = ["webkit", "moz", "ms"];
  function sn(t, n) {
    if ((n === void 0 && (n = Q(t)), n)) return t;
    if (!V[t]) {
      var r = K(t),
        i = "".concat(r[0].toUpperCase()).concat(r.slice(1)),
        e = ""
          .concat(r, " ")
          .concat(un.join("".concat(i, " ")))
          .concat(i)
          .split(" ");
      d(e, function (s, f) {
        if (f in en) return (V[t] = f), !1;
      });
    }
    return V[t];
  }
  var fn = {
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
    zIndex: !0,
  };
  function wt(t, n, r) {
    return (
      r === void 0 && (r = Q(t)), !r && !fn[t] && lt(n) ? "".concat(n, "px") : n
    );
  }
  function on(t, n) {
    if (g(t)) {
      var r = Q(t);
      return (
        (t = sn(t, r)),
        arguments.length < 2
          ? this[0] && T(this[0], t, r)
          : t
          ? ((n = wt(t, n, r)),
            this.each(function (e, s) {
              c(s) && (r ? s.style.setProperty(t, n) : (s.style[t] = n));
            }))
          : this
      );
    }
    for (var i in t) this.css(i, t[i]);
    return this;
  }
  u.css = on;
  function Ct(t, n) {
    try {
      return t(n);
    } catch {
      return n;
    }
  }
  var an = /^\s+|\s+$/;
  function St(t, n) {
    var r = t.dataset[n] || t.dataset[K(n)];
    return an.test(r) ? r : Ct(JSON.parse, r);
  }
  function cn(t, n, r) {
    (r = Ct(JSON.stringify, r)), (t.dataset[K(n)] = r);
  }
  function hn(t, n) {
    if (!t) {
      if (!this[0]) return;
      var r = {};
      for (var i in this[0].dataset) r[i] = St(this[0], i);
      return r;
    }
    if (g(t))
      return arguments.length < 2
        ? this[0] && St(this[0], t)
        : v(n)
        ? this
        : this.each(function (e, s) {
            cn(s, t, n);
          });
    for (var i in t) this.data(i, t[i]);
    return this;
  }
  u.data = hn;
  function Tt(t, n) {
    var r = t.documentElement;
    return Math.max(
      t.body["scroll".concat(n)],
      r["scroll".concat(n)],
      t.body["offset".concat(n)],
      r["offset".concat(n)],
      r["client".concat(n)]
    );
  }
  d([!0, !1], function (t, n) {
    d(["Width", "Height"], function (r, i) {
      var e = "".concat(n ? "outer" : "inner").concat(i);
      u[e] = function (s) {
        if (this[0])
          return B(this[0])
            ? n
              ? this[0]["inner".concat(i)]
              : this[0].document.documentElement["client".concat(i)]
            : A(this[0])
            ? Tt(this[0], i)
            : this[0]["".concat(n ? "offset" : "client").concat(i)] +
              (s && n
                ? E(this[0], "margin".concat(r ? "Top" : "Left")) +
                  E(this[0], "margin".concat(r ? "Bottom" : "Right"))
                : 0);
      };
    });
  }),
    d(["Width", "Height"], function (t, n) {
      var r = n.toLowerCase();
      u[r] = function (i) {
        if (!this[0]) return v(i) ? void 0 : this;
        if (!arguments.length)
          return B(this[0])
            ? this[0].document.documentElement["client".concat(n)]
            : A(this[0])
            ? Tt(this[0], n)
            : this[0].getBoundingClientRect()[r] - gt(this[0], !t);
        var e = parseInt(i, 10);
        return this.each(function (s, f) {
          if (c(f)) {
            var a = T(f, "boxSizing");
            f.style[r] = wt(r, e + (a === "border-box" ? gt(f, !t) : 0));
          }
        });
      };
    });
  var Rt = "___cd";
  (u.toggle = function (t) {
    return this.each(function (n, r) {
      if (c(r)) {
        var i = vt(r),
          e = v(t) ? i : t;
        e
          ? ((r.style.display = r[Rt] || ""),
            vt(r) && (r.style.display = Jt(r.tagName)))
          : i || ((r[Rt] = T(r, "display")), (r.style.display = "none"));
      }
    });
  }),
    (u.hide = function () {
      return this.toggle(!1);
    }),
    (u.show = function () {
      return this.toggle(!0);
    });
  var xt = "___ce",
    Z = ".",
    k = { focus: "focusin", blur: "focusout" },
    Nt = { mouseenter: "mouseover", mouseleave: "mouseout" },
    dn = /^(mouse|pointer|contextmenu|drag|drop|click|dblclick)/i;
  function tt(t) {
    return Nt[t] || k[t] || t;
  }
  function nt(t) {
    var n = t.split(Z);
    return [n[0], n.slice(1).sort()];
  }
  u.trigger = function (t, n) {
    if (g(t)) {
      var r = nt(t),
        i = r[0],
        e = r[1],
        s = tt(i);
      if (!s) return this;
      var f = dn.test(s) ? "MouseEvents" : "HTMLEvents";
      (t = C.createEvent(f)),
        t.initEvent(s, !0, !0),
        (t.namespace = e.join(Z)),
        (t.___ot = i);
    }
    t.___td = n;
    var a = t.___ot in k;
    return this.each(function (y, h) {
      a &&
        O(h[t.___ot]) &&
        ((h["___i".concat(t.type)] = !0),
        h[t.___ot](),
        (h["___i".concat(t.type)] = !1)),
        h.dispatchEvent(t);
    });
  };
  function Lt(t) {
    return (t[xt] = t[xt] || {});
  }
  function ln(t, n, r, i, e) {
    var s = Lt(t);
    (s[n] = s[n] || []), s[n].push([r, i, e]), t.addEventListener(n, e);
  }
  function At(t, n) {
    return (
      !n ||
      !z.call(n, function (r) {
        return t.indexOf(r) < 0;
      })
    );
  }
  function F(t, n, r, i, e) {
    var s = Lt(t);
    if (n)
      s[n] &&
        (s[n] = s[n].filter(function (f) {
          var a = f[0],
            y = f[1],
            h = f[2];
          if ((e && h.guid !== e.guid) || !At(a, r) || (i && i !== y))
            return !0;
          t.removeEventListener(n, h);
        }));
    else for (n in s) F(t, n, r, i, e);
  }
  (u.off = function (t, n, r) {
    var i = this;
    if (v(t))
      this.each(function (s, f) {
        (!c(f) && !A(f) && !B(f)) || F(f);
      });
    else if (g(t))
      O(n) && ((r = n), (n = "")),
        d(j(t), function (s, f) {
          var a = nt(f),
            y = a[0],
            h = a[1],
            p = tt(y);
          i.each(function (M, b) {
            (!c(b) && !A(b) && !B(b)) || F(b, p, h, n, r);
          });
        });
    else for (var e in t) this.off(e, t[e]);
    return this;
  }),
    (u.remove = function (t) {
      return x(this, t).detach().off(), this;
    }),
    (u.replaceWith = function (t) {
      return this.before(t).remove();
    }),
    (u.replaceAll = function (t) {
      return o(t).replaceWith(this), this;
    });
  function gn(t, n, r, i, e) {
    var s = this;
    if (!g(t)) {
      for (var f in t) this.on(f, n, r, t[f], e);
      return this;
    }
    return (
      g(n) ||
        (v(n) || P(n)
          ? (n = "")
          : v(r)
          ? ((r = n), (n = ""))
          : ((i = r), (r = n), (n = ""))),
      O(i) || ((i = r), (r = void 0)),
      i
        ? (d(j(t), function (a, y) {
            var h = nt(y),
              p = h[0],
              M = h[1],
              b = tt(p),
              W = p in Nt,
              rt = p in k;
            b &&
              s.each(function (it, m) {
                if (!(!c(m) && !A(m) && !B(m))) {
                  var et = function (l) {
                    if (l.target["___i".concat(l.type)])
                      return l.stopImmediatePropagation();
                    if (
                      !(l.namespace && !At(M, l.namespace.split(Z))) &&
                      !(
                        !n &&
                        ((rt && (l.target !== m || l.___ot === b)) ||
                          (W && l.relatedTarget && m.contains(l.relatedTarget)))
                      )
                    ) {
                      var ut = m;
                      if (n) {
                        for (var _ = l.target; !pt(_, n); )
                          if (_ === m || ((_ = _.parentNode), !_)) return;
                        ut = _;
                      }
                      Object.defineProperty(l, "currentTarget", {
                        configurable: !0,
                        get: function () {
                          return ut;
                        },
                      }),
                        Object.defineProperty(l, "delegateTarget", {
                          configurable: !0,
                          get: function () {
                            return m;
                          },
                        }),
                        Object.defineProperty(l, "data", {
                          configurable: !0,
                          get: function () {
                            return r;
                          },
                        });
                      var bn = i.call(ut, l, l.___td);
                      e && F(m, b, M, n, et),
                        bn === !1 && (l.preventDefault(), l.stopPropagation());
                    }
                  };
                  (et.guid = i.guid = i.guid || o.guid++), ln(m, b, M, n, et);
                }
              });
          }),
          this)
        : this
    );
  }
  u.on = gn;
  function vn(t, n, r, i) {
    return this.on(t, n, r, i, !0);
  }
  u.one = vn;
  var pn = /\r?\n/g;
  function mn(t, n) {
    return "&".concat(encodeURIComponent(t), "=").concat(
      encodeURIComponent(
        n.replace(
          pn,
          `\r
    `
        )
      )
    );
  }
  var yn = /file|reset|submit|button|image/i,
    Ot = /radio|checkbox/i;
  (u.serialize = function () {
    var t = "";
    return (
      this.each(function (n, r) {
        d(r.elements || [r], function (i, e) {
          if (
            !(
              e.disabled ||
              !e.name ||
              e.tagName === "FIELDSET" ||
              yn.test(e.type) ||
              (Ot.test(e.type) && !e.checked)
            )
          ) {
            var s = bt(e);
            if (!v(s)) {
              var f = H(s) ? s : [s];
              d(f, function (a, y) {
                t += mn(e.name, y);
              });
            }
          }
        });
      }),
      t.slice(1)
    );
  }),
    typeof exports < "u" ? (module.exports = o) : (D.cash = D.$ = o);
})();

/*
        Some versions can/will cause breakage because we might have leftover stuff from previous versions left in localStorage.
    */

(function () {
  if (localStorage.getItem("elnaeth-items-log-visible"))
    localStorage.removeItem("elnaeth-items-log-visible");
  if (localStorage.getItem("elnaeth-stats-log-visible"))
    localStorage.removeItem("elnaeth-stats-log-visible");
})();

const BoostTypes = Object.freeze({
  BASE_SPELLPOWER: { id: 1, name: "Base Spellpower" },
  BASE_WARD: { id: 2, name: "Base Ward" },

  STAT_INTELLECT: { id: 3, name: "Intellect" },
  STAT_STAMINA: { id: 4, name: "Stamina" },
  STAT_FOCUS: { id: 5, name: "Focus" },
  STAT_SPIRIT: { id: 6, name: "Spirit" },
  STAT_MANA: { id: 7, name: "Mana" },

  FIRE_MASTERY: { id: 10, name: "Fire Mastery" },
  WATER_MASTERY: { id: 11, name: "Water Mastery" },
  NATURE_MASTERY: { id: 12, name: "Nature Mastery" },

  DAMAGE: { id: 40, name: "Damage", short: "Da" },
  MULTICAST: { id: 41, name: "Multicast", short: "MC" },
  CRIT_CHANCE: { id: 42, name: "Critical hit chance", short: "CC" },
  CRIT_DAMAGE: { id: 43, name: "Critical hit damage", short: "CD" },
  HASTE: { id: 44, name: "Haste", short: "Ha" },
  HEALTH: { id: 45, name: "Health", short: "Hp" },
  WARD: { id: 46, name: "Ward", short: "Wa" },
  FOCUS: { id: 47, name: "Focus", short: "Fo" },
  MANA: { id: 48, name: "Mana", short: "Ma" },
  OVERLOAD: { id: 49, name: "Overload", short: "OL" },
  TIME_DILATION: { id: 50, name: "Time dilation", short: "TD" },

  ENCHANT_INFERNO_RANK: { id: 60, name: "Inferno Enchant Rank" },
  ENCHANT_TIDAL_WRATH_RANK: { id: 61, name: "Tidal Wrath Enchant Rank" },
  ENCHANT_WILDHEART_RANK: { id: 62, name: "Wildheart Enchant Rank" },
  ENCHANT_FIRE_RESISTANCE_RANK: {
    id: 63,
    name: "Fire Resistance Enchant Rank",
  },
  ENCHANT_WATER_RESISTANCE_RANK: {
    id: 64,
    name: "Water Resistance Enchant Rank",
  },
  ENCHANT_NATURE_RESISTANCE_RANK: {
    id: 65,
    name: "Nature Resistance Enchant Rank",
  },
  ENCHANT_INSIGHT_RANK: { id: 66, name: "Insight Enchant Rank" },
  ENCHANT_BOUNTIFUL_HARVEST_RANK: {
    id: 67,
    name: "Bountiful Harvest Enchant Rank",
  },
  ENCHANT_PROSPERITY_RANK: { id: 68, name: "Prosperity Enchant Rank" },
  ENCHANT_FORTUNE_RANK: { id: 69, name: "Fortune Enchant Rank" },
  ENCHANT_GROWTH_RANK: { id: 70, name: "Growth Enchant Rank" },
  ENCHANT_VITALITY_RANK: { id: 71, name: "Vitality Enchant Rank" },

  INFERNO_VALUE: { id: 80, name: "Inferno" },
  TIDAL_WRATH_VALUE: { id: 81, name: "Tidal Wrath" },
  WILDHEART_VALUE: { id: 82, name: "Wildheart" },
  FIRE_RESISTANCE_VALUE: { id: 83, name: "Fire res" },
  WATER_RESISTANCE_VALUE: { id: 84, name: "Water res" },
  NATURE_RESISTANCE_VALUE: { id: 85, name: "Nature res" },
  VITALITY_VALUE: { id: 86, name: "Vitality" },

  BASE_EXPERIENCE: { id: 100, name: "Base Experience" },
  BASE_MANA_DUST: { id: 101, name: "Base Mana Dust" },
  DROP_BOOST: { id: 102, name: "Drop Boost" },
  MULTISTAT: { id: 103, name: "Multistat Boost" },
  ACTIONS: { id: 105, name: "Actions", short: "actions" },
  BASE_RESOURCE: { id: 106, name: "Base Resource" },

  POTION_BOOST: { id: 108, name: "Potion Boost", short: "potion" },
  POTION_DURATION: { id: 110, name: "Potion Duration", short: "duration" },
  BATTLE_EXPERIENCE_BOOST: {
    id: 120,
    name: "Battle Experience Boost",
    short: "exp",
  },
  MANA_DUST_BOOST: { id: 121, name: "Mana Dust Boost", short: "dust" },
  ELEMENTAL_SHARD_BOOST: {
    id: 122,
    name: "Elemental Shard Boost",
    short: "shards",
  },
  STAT_DROP: { id: 123, name: "Stat Drop", short: "stats" },
  BASE_RESOURCE_AMOUNT: { id: 124, name: "Base Resource Amount", short: "res" },

  FARM_GOLEMS: { id: 130, name: "Harvest Golems" },
  FARM_FERTILIZER: { id: 131, name: "Fertilizer" },
  FARM_PLOTS: { id: 132, name: "Plots" },
});

const ItemTypes = Object.freeze({
  MANA_DUST: { id: 1, name: "Mana Dust", rarity: "common" },
  ELEMENTAL_SHARDS: { id: 2, name: "Elemental Shards", rarity: "common" },
  CODEX: { id: 3, name: "Codex", rarity: "epic" },

  FIRE_ESSENCE: { id: 4, name: "Fire Essence", rarity: "rare" },
  WATER_ESSENCE: { id: 5, name: "Water Essence", rarity: "rare" },
  NATURE_ESSENCE: { id: 6, name: "Nature Essence", rarity: "rare" },

  FISH: { id: 7, name: "Fish", rarity: "common" },
  WOOD: { id: 8, name: "Wood", rarity: "common" },
  IRON: { id: 9, name: "Iron", rarity: "common" },

  ASBESTOS: { id: 10, name: "Asbestos", rarity: "uncommon" },
  IRONBARK: { id: 11, name: "Ironbark", rarity: "uncommon" },
  FISH_SCALES: { id: 12, name: "Fish Scales", rarity: "uncommon" },

  TOME_OF_FIRE: { id: 13, name: "Tome of Fire", rarity: "uncommon" },
  TOME_OF_WATER: { id: 14, name: "Tome of Water", rarity: "uncommon" },
  TOME_OF_NATURE: { id: 15, name: "Tome of Nature", rarity: "uncommon" },

  TOME_OF_MANA_SHIELD: { id: 16, name: "Tome of Mana Shield", rarity: "epic" },

  ENCHANT_FIRE_RESISTANCE: {
    id: 17,
    name: "Formula: Fire Resistance",
    rarity: "epic",
  },
  ENCHANT_WATER_RESISTANCE: {
    id: 18,
    name: "Formula: Water Resistance",
    rarity: "epic",
  },
  ENCHANT_NATURE_RESISTANCE: {
    id: 19,
    name: "Formula: Nature Resistance",
    rarity: "epic",
  },
  ENCHANT_INFERNO: { id: 20, name: "Formula: Inferno", rarity: "epic" },
  ENCHANT_TIDAL_WRATH: { id: 21, name: "Formula: Tidal Wrath", rarity: "epic" },
  ENCHANT_WILDHEART: { id: 22, name: "Formula: Wildheart", rarity: "epic" },
  ENCHANT_INSIGHT: { id: 23, name: "Formula: Insight", rarity: "epic" },
  ENCHANT_BOUNTIFUL_HARVEST: {
    id: 24,
    name: "Formula: Bountiful Harvest",
    rarity: "epic",
  },
  ENCHANT_PROSPERITY: { id: 25, name: "Formula: Prosperity", rarity: "epic" },
  ENCHANT_FORTUNE: { id: 26, name: "Formula: Fortune", rarity: "epic" },
  ENCHANT_GROWTH: { id: 27, name: "Formula: Growth", rarity: "epic" },
  ENCHANT_VITALITY: { id: 28, name: "Formula: Vitality", rarity: "epic" },

  REAGENT_ELDERWOOD: { id: 29, name: "Elderwood", rarity: "uncommon" },
  REAGENT_LODESTONE: { id: 30, name: "Lodestone", rarity: "uncommon" },
  REAGENT_WHITE_PEARL: { id: 31, name: "White Pearl", rarity: "uncommon" },
  REAGENT_FOUR_LEAF_CLOVER: {
    id: 32,
    name: "Four Leaf Clover",
    rarity: "uncommon",
  },
  REAGENT_ENCHANTED_DROPLET: {
    id: 33,
    name: "Enchanted Droplet",
    rarity: "uncommon",
  },
  REAGENT_INFERNAL_HEART: {
    id: 34,
    name: "Infernal Heart",
    rarity: "uncommon",
  },

  ORB_OF_POWER: { id: 35, name: "Orb of Power", rarity: "rare" },
  ORB_OF_CHAOS: { id: 36, name: "Orb of Chaos", rarity: "epic" },
  ORB_OF_DIVINITY: { id: 37, name: "Orb of Divinity", rarity: "legendary" },
  ORB_OF_LEGACY: { id: 45, name: "Orb of Legacy", rarity: "heirloom" },

  SUNPETAL: { id: 39, name: "Sunpetal", rarity: "rare" },
  SAGEROOT: { id: 40, name: "Sageroot", rarity: "common" },
  BLOOMWELL: { id: 41, name: "Bloomwell", rarity: "common" },

  ELEMENTIUM: { id: 46, name: "Elementium", rarity: "epic" },
  DIVINE_ESSENCE: { id: 47, name: "Divine Essence", rarity: "legendary" },

  DUNGEON_POINTS: { id: 48, name: "Dungeon Points", rarity: "common" },

  PET_EGG: { id: 49, name: "Pet Egg", rarity: "rare" },

  // kept out of here on purpose since they are not really tracked loot drops
  // BOUND_CODEX = 38
  // GUILD_BATTLE_XP = 42
  // EVENT_POINTS = 43
  // CRYSTALLIZED_MANA = 44
});

const utils = {
  gatheringActions: ["mining", "fishing", "woodcutting"],

  // function that formats huge numbers humanly-readable
  formatNumber: (num) => {
    if (num >= 1e18) return (num / 1e18).toFixed(2) + "Qi";
    if (num >= 1e15) return (num / 1e15).toFixed(2) + "Qa";
    if (num >= 1e12) return (num / 1e12).toFixed(2) + "T";
    if (num >= 1e9) return (num / 1e9).toFixed(2) + "B";
    if (num >= 1e6) return (num / 1e6).toFixed(2) + "M";
    if (num >= 1e3) return (num / 1e3).toFixed(2) + "K";

    // if it's a result like 1.00 or 2.00 we trim the zeroes
    const result = (num / 1).toFixed(2).toString();

    return result.replace(/\.0+$/, "").replace(/(\.\d*[1-9])0+$/, "$1");
  },

  // converts minutes to 1h 30m strings
  formatTime: (minutesTotal) => {
    const hours = Math.floor(minutesTotal / 60);
    const minutes = Math.floor(minutesTotal % 60);
    return `${hours}h ${minutes}m`;
  },

  sortByRarity: (a, b) => {
    const rarityOrder = {
      common: 1,
      uncommon: 2,
      rare: 3,
      epic: 4,
      legendary: 5,
      heirloom: 6,
      mythic: 7,
    };

    return rarityOrder[a.rarity] - rarityOrder[b.rarity];
  },

  // count number of mondays since enchanting cap implementation
  calculateEnchantingCap: () => {
    const startDate = new Date(Date.UTC(2025, 3, 24));
    const today = new Date();
    let count = 22; // initial count of 22, when the patch was implemented
    let currentDate = new Date(startDate);

    // Loop until today
    while (currentDate <= today) {
      if (currentDate.getDay() === 1) {
        // 1 = Monday
        count++;
      }
      currentDate.setDate(currentDate.getDate() + 1);
    }

    return count;
  },

  isBattleActivity: (activity) => activity === "battle",
  isGatherActivity: (activity) => utils.gatheringActions.includes(activity),

  // keep track of what kind of thing we're doing right now
  isBattling: () => utils.isBattleActivity(manarion.player.ActionType),
  isGathering: () => utils.isGatherActivity(manarion.player.ActionType),
};

const settings = {
  __localStorageKey: "elnaeth-settings",

  // this holds the current configuration (starts out empty)
  configuration: {},

  // these are the default settings
  defaults: {
    // general settings
    showLootTracker: true,
    showStatsTracker: true,
    showStatsLog: true,

    // the main item qol settings
    enableItemQol: true,
    enableItemQolProfilePage: true,

    // which items to parse
    parseRareItems: true,
    parseEpicItems: true,
    parseLegendaryItems: true,
    parseHeirloomItems: true,
    parseMythicItems: true,

    // various other item QoL settings
    showItemCodexBoosts: true,
    showItemShardBoosts: true,
    showItemEnchants: true,
    showItemSets: true,
    showItemQuality: true,
    showItemInfoSingleLine: false,

    // dev settings (huehue that's me silly)
    debugMode: false,
  },

  loadFromStorage: () => {
    // clone the defaults
    const newConfiguration = { ...settings.defaults };

    const loaded = localStorage.getItem(settings.__localStorageKey);
    if (!loaded) {
      console.warn("[settings] using default settings");
      settings.configuration = newConfiguration;
      return;
    }

    try {
      const parsed = JSON.parse(loaded);
      if (!parsed) {
        console.warn(
          "[settings] Malformed JSON in localStorage, falling back to defaults:",
          loaded
        );
        settings.configuration = newConfiguration;
        return;
      }

      // overwrite any defaults, but keep any that have never been saved
      for (const setting in parsed) {
        newConfiguration[setting] = parsed[setting];
      }

      // set the internal storage to what we just loaded
      settings.configuration = newConfiguration;
    } catch (error) {
      console.error(
        "[settings] Could not parse settings from localstorage:",
        error
      );
    }

    logger.debug("[settings] Loaded from storage");
  },

  saveToStorage: () => {
    const newSettings = settings.serializeForm();

    // overwrite existing configuration
    for (const setting in newSettings) {
      settings.configuration[setting] = newSettings[setting];
    }

    const json = JSON.stringify(settings.configuration);
    localStorage.setItem(settings.__localStorageKey, json);

    // because settings might have changed visibility, re-render the UI
    ui.render();
    itemQOL.render();

    logger.debug("[settings] Saved to storage");
  },

  setCheckboxValues: (settings) => {
    for (const setting in settings) {
      $(`#settings-form input[name="${setting}"]`).prop(
        "checked",
        settings[setting]
      );
    }
  },

  serializeForm: () => {
    const settings = {};

    $('#settings-form input[type="checkbox"]').each(function () {
      settings[this.name] = this.checked;
    });

    return settings;
  },

  initialize: () => {
    const style = document.createElement("style");
    style.textContent = `
            button#elnaeth-settings-button {
              position: fixed;
              bottom: 20px;
              right: 30px;
              z-index: 9999;
            }
     
            button#elnaeth-settings-button, div#elnaeth-modal-overlay button {
              padding: 10px 15px;
              background: #333;
              color: white;
              border: none;
              border-radius: 6px;
              cursor: pointer;
              font-size: 14px;
            }
     
            div#elnaeth-modal-overlay {
              position: fixed;
              top: 0; left: 0; right: 0; bottom: 0;
              background: rgba(0, 0, 0, 0.4);
              display: none;
              align-items: center;
              justify-content: center;
              z-index: 9998;
            }
     
            div#elnaeth-modal-overlay label {
              cursor: pointer;
     
              height: 20px;
              line-height: 20px;
            }
     
            div#elnaeth-modal-overlay input {
              margin-right: 15px;
              transform: scale(1.25);
            }
     
            div#elnaeth-modal-overlay div.flex.items-center.justify-between:hover {
              box-shadow: 0 0 0 1px var(--ring);
            }
     
            div#elnaeth-modal-overlay hr {
              border-top: 1px solid var(--ring);
              margin: 10px 0 10px 0;
            }
     
            div#elnaeth-modal-overlay h1, h2 {
              font-size: 1.5em;
            }
     
            div#elnaeth-modal-overlay div#tracker-modal {
              background-color: #000;
              margin: 30px auto;
              padding: 20px;
              border-radius: 10px;
              border-color: var(--ring);
              border-width: 2px;
              min-width: 300px;
              max-width: 75%;
              min-height: 500px;
              max-height: 75%;
              overflow-y: auto;
            }
     
            div#close-tracker-modal {
              float: right;
              cursor: pointer;
              font-weight: bold;
              font-size: 16px;
            }
        `;

    document.head.appendChild(style);

    $("body").append(`
          <button id="elnaeth-settings-button">
            Tracker settings
          </button>
     
          <div id="elnaeth-modal-overlay" style="display:none;">
            <div id="tracker-modal">
              <div class="pt-4 text-right float-right">
                <button id="close-tracker-modal" type="button"> X </button>
              </div>
     
              <h1 class="text-left float-left">Settings</h1>
     
              <br/>
     
              <form id="settings-form" class="space-y-2">
                <h2>General settings</h2>
     
                <div class="flex items-center justify-between">
                  <label for="show-stats-tracker">Show stats tracker (lower left)</label>
                  <input type="checkbox" id="show-stats-tracker" name="showStatsTracker" class="toggle">
                </div>
     
                <div class="flex items-center justify-between">
                  <label for="show-stats-log">Show individual stat gains log (upper right)</label>
                  <input type="checkbox" id="show-stats-log" name="showStatsLog" class="toggle">
                </div>
     
                <div class="flex items-center justify-between">
                  <label for="show-loot-tracker">Show enhanced loot tracker (upper right)</label>
                  <input type="checkbox" id="show-loot-tracker" name="showLootTracker" class="toggle">
                </div>
     
                <hr>
     
                <h2>Item QoL settings</h2>
     
                <div class="flex items-center justify-between">
                  <label for="enable-item-qol">Enable item QoL as a whole</label>
                  <input type="checkbox" id="enable-item-qol" name="enableItemQol" class="toggle">
                </div>
     
                <div class="flex items-center justify-between">
                  <label for="enable-item-qol-profile-page">Enable item QoL on profile pages</label>
                  <input type="checkbox" id="enable-item-qol-profile-page" name="enableItemQolProfilePage" class="toggle">
                </div>
     
                <div class="flex items-center justify-between">
                  <label for="parse-rare-items">Parse rare items</label>
                  <input type="checkbox" id="parse-rare-items" name="parseRareItems" class="toggle">
                </div>
     
                <div class="flex items-center justify-between">
                  <label for="parse-epic-items">Parse epic items</label>
                  <input type="checkbox" id="parse-epic-items" name="parseEpicItems" class="toggle">
                </div>
     
                <div class="flex items-center justify-between">
                  <label for="parse-legendary-items">Parse legendary items</label>
                  <input type="checkbox" id="parse-legendary-items" name="parseLegendaryItems" class="toggle">
                </div>
     
                <div class="flex items-center justify-between">
                  <label for="parse-heirloom-items">Parse heirloom items</label>
                  <input type="checkbox" id="parse-heirloom-items" name="parseHeirloomItems" class="toggle">
                </div>
     
                <div class="flex items-center justify-between">
                  <label for="parse-mythic-items">Parse mythic items</label>
                  <input type="checkbox" id="parse-mythic-items" name="parseMythicItems" class="toggle">
                </div>
     
                <div class="flex items-center justify-between">
                  <label for="show-codex-boosts">Show codex boosts (such as exp, stat, mana dust, etc)</label>
                  <input type="checkbox" id="show-codex-boosts" name="showItemCodexBoosts" class="toggle">
                </div>
     
                <div class="flex items-center justify-between">
                  <label for="show-shard-boosts">Show shard boosts (such as crit chance, crit damage, etc)</label>
                  <input type="checkbox" id="show-shard-boosts" name="showItemShardBoosts" class="toggle">
                </div>
     
                <div class="flex items-center justify-between">
                  <label for="show-enchants">Show (missing) enchants</label>
                  <input type="checkbox" id="show-enchants" name="showItemEnchants" class="toggle">
                </div>
     
                <div class="flex items-center justify-between">
                  <label for="show-item-sets">Show which sets items belong to</label>
                  <input type="checkbox" id="show-item-sets" name="showItemSets" class="toggle">
                </div>
     
                <div class="flex items-center justify-between">
                  <label for="show-item-quality">Show item quality</label>
                  <input type="checkbox" id="show-item-quality" name="showItemQuality" class="toggle">
                </div>
     
                <div class="flex items-center justify-between">
                  <label for="show-item-info-single-line">Show item info on a single line</label>
                  <input type="checkbox" id="show-item-info-single-line" name="showItemInfoSingleLine" class="toggle">
                </div>
     
                <hr>
     
                <div class="flex items-center justify-between">
                  <label for="debug-mode">Enable extensive debug output (developer mode)</label>
                  <input type="checkbox" id="debug-mode" name="debugMode" class="toggle">
                </div>
     
                <br/>
                <br/>
     
                <button type="submit" id="save-tracker-settings">
                  Save settings
                </button>
              </form>
            </div>
          </div>
        `);

    // load from storage (or use defaults) and then pre-check all checkboxes with the corresponding value
    settings.loadFromStorage();
    settings.setCheckboxValues(settings.configuration);

    const openModal = () => $("#elnaeth-modal-overlay").show();

    const closeModal = () => $("#elnaeth-modal-overlay").hide();

    // pressing escape also closes it
    $(document).on("keydown", function (e) {
      if (e.key === "Escape") closeModal();
    });

    // clicking outside the middle part closest it too
    $("div#elnaeth-modal-overlay").on("click", function (e) {
      if ($(e.target).closest("div#tracker-modal").length === 0) closeModal();
    });

    $("#elnaeth-settings-button").on("click", () => {
      openModal();
    });

    $("#close-tracker-modal").on("click", () => {
      closeModal();
    });

    // save all and close modal after
    $("#save-tracker-settings").on("click", (e) => {
      e.preventDefault();
      settings.saveToStorage();
      closeModal();
    });

    // save all settings upon toggle of a checkbox, but keep modal open
    $('#settings-form input[type="checkbox"]').on(
      "change",
      settings.saveToStorage
    );
  },
};

const logger = {
  __getDate: () => {
    return new Date().toLocaleString("nl-NL");
  },

  info: (...params) => {
    console.info(logger.__getDate(), ...params);
  },

  debug: (...params) => {
    if (settings.configuration.debugMode)
      console.info(logger.__getDate(), ...params);
  },

  warn: (...params) => {
    console.warn(logger.__getDate(), ...params);
  },
};

const statTracker = {
  __localStorageKey: "elnaeth-stats-history",

  // keep track of found stats in a nicer format for the visible stat tracker
  log: [],

  // keep track of player gained stats in absolute values
  internalStore: null,

  getStatByName: (partialName) => {
    return statTracker.internalStore.TrackedStats.find((stat) =>
      stat.definition.name.toLowerCase().includes(partialName.toLowerCase())
    );
  },

  reset: () => {
    statTracker.log = [];
    statTracker.internalStore = statTracker.cleanStats();
    logger.debug("[stats] Stat tracker has been reset");
    statTracker.saveToStorage();
    statTracker.parseTick();
  },

  cleanStats: () => ({
    StartTime: new Date(),
    EndTime: new Date(),

    TotalStats: 0,

    TrackedStats: [
      // base stats
      {
        definition: BoostTypes.STAT_INTELLECT,
        start: 0,
        current: 0,
        gained: 0,
        mastery: false,
      },
      {
        definition: BoostTypes.STAT_STAMINA,
        start: 0,
        current: 0,
        gained: 0,
        mastery: false,
      },
      {
        definition: BoostTypes.STAT_SPIRIT,
        start: 0,
        current: 0,
        gained: 0,
        mastery: false,
      },
      {
        definition: BoostTypes.STAT_FOCUS,
        start: 0,
        current: 0,
        gained: 0,
        mastery: false,
      },
      {
        definition: BoostTypes.STAT_MANA,
        start: 0,
        current: 0,
        gained: 0,
        mastery: false,
      },

      // masteries
      {
        definition: BoostTypes.WATER_MASTERY,
        start: 0,
        current: 0,
        gained: 0,
        mastery: true,
        active: false,
      },
      {
        definition: BoostTypes.FIRE_MASTERY,
        start: 0,
        current: 0,
        gained: 0,
        mastery: true,
        active: false,
      },
      {
        definition: BoostTypes.NATURE_MASTERY,
        start: 0,
        current: 0,
        gained: 0,
        mastery: true,
        active: false,
      },
    ],
  }),

  loadFromStorage: () => {
    statTracker.internalStore = statTracker.cleanStats();

    // retrieve from storage
    const loadedStats = localStorage.getItem(statTracker.__localStorageKey);
    if (loadedStats) {
      try {
        const parsed = JSON.parse(loadedStats);
        statTracker.internalStore = parsed;
        statTracker.internalStore.StartTime = new Date(parsed.StartTime);
        statTracker.internalStore.EndTime = new Date(parsed.EndTime);
      } catch (error) {
        console.error("[stats] Could not parse loot from localstorage:", error);
      }
    }

    logger.debug("[stats] Loaded from storage");
  },

  saveToStorage: () => {
    const json = JSON.stringify(statTracker.internalStore);
    localStorage.setItem(statTracker.__localStorageKey, json);
    logger.debug("[stats] Saved to storage");
  },

  // parse base stat values from game memory
  parseTick: () => {
    if (!statTracker.internalStore) statTracker.loadFromStorage();
    const stats = statTracker.internalStore;

    // each iteration, set the end time to right now
    stats.EndTime = new Date();

    const player = manarion.player;
    if (!player) return;

    // find the spell type the player is currently using and set that as active
    const currentMastery = stats.TrackedStats.find((x) =>
      x.definition.name.toLowerCase().includes(player.MagicType)
    );
    currentMastery.active = true;

    const playerBoosts = manarion.player.Boosts;
    if (!playerBoosts) return;

    // loop over all keys, which are the ID of the boost
    for (const boostID in playerBoosts) {
      const trackedStat = stats.TrackedStats.find(
        (x) => x.definition.id === parseInt(boostID)
      );
      if (!trackedStat) continue;

      const currentBoost = playerBoosts[boostID];

      // if the current boost is 0, we don't want to track it, possibly this happens
      // when the game + extension have loaded before the websocket has let us know our stats
      if (!currentBoost) return;

      // check if this is the first iteration
      if (!trackedStat.current || !stats.StartTime) {
        trackedStat.start = currentBoost;
        trackedStat.current = currentBoost;
        trackedStat.gained = 0;
      } else {
        // first calculate the difference, then set the new value for next iteration
        let gained = currentBoost - trackedStat.current;
        trackedStat.current = currentBoost;

        // before updating the tracked gains, see if we gained this iteration and log it
        if (gained > 0) {
          trackedStat.gained += gained;

          // do not add to total stats if this is a mastery stat, and if it IS mastery, change the format for the statlog
          if (!trackedStat.mastery) stats.TotalStats += gained;
          else gained = (gained / 100).toFixed(2) + "%";

          // prepare an entry for the stat log that shows individual stat drops
          const statLogEntry = {
            line: `+${gained} ${trackedStat.definition.name}`,
            timestamp: new Date().toLocaleTimeString("en-US", {
              hour: "2-digit",
              minute: "2-digit",
              second: "2-digit",
              hour12: false,
            }),
          };

          // prepend this
          statTracker.log.unshift(statLogEntry);

          // remove the oldest entries, keeping the log to a maximum of 200 entries
          if (statTracker.log.length > 200) {
            statTracker.log.length = 200;
          }
        }
      }
    }

    // this might be the first time we're tracking, or it has been reset manually by the player,
    // so start tracking from this point onwards
    if (!stats.StartTime) stats.StartTime = new Date();

    statTracker.internalStore = stats;
    statTracker.saveToStorage(stats);
  },
};

const lootTracker = {
  __localStorageKey: "elnaeth-item-drops",

  // keep track of loots
  internalStore: {
    first: new Date(),
    last: new Date(),
    elapsedSeconds: 0,
    items: [],
  },

  // TODO make this configurable?
  // we track literally all items
  trackedItems: Object.values(ItemTypes),

  getCurrentState: () => {
    return lootTracker.internalStore;
  },

  loadFromStorage: () => {
    const stored = localStorage.getItem(lootTracker.__localStorageKey);
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        if (parsed.first) parsed.first = new Date(parsed.first);
        if (parsed.last) parsed.last = new Date(parsed.last);
        lootTracker.internalStore.first = parsed.first;
        lootTracker.internalStore.last = parsed.last;
        lootTracker.internalStore.elapsedSeconds = parsed.elapsedSeconds;
        lootTracker.internalStore.items = parsed.items || [];
      } catch (error) {
        console.error("[loot] Could not parse loot from localstorage:", error);
      }
      logger.debug("[loot] Loaded from storage");
    }
  },

  saveToStorage: () => {
    const json = JSON.stringify(lootTracker.internalStore);
    localStorage.setItem(lootTracker.__localStorageKey, json);
    logger.debug("[loot] Saved to storage");
  },

  reset: () => {
    lootTracker.internalStore = {
      first: new Date(),
      last: new Date(),
      elapsedSeconds: 0,
      items: [],
    };

    logger.debug("[loot] Reset internal storage");

    lootTracker.saveToStorage();
    lootTracker.parseTick();
  },

  resetSingleItem: (itemID) => {
    lootTracker.internalStore.items = lootTracker.internalStore.items.filter(
      (i) => i.id !== itemID
    );
    lootTracker.saveToStorage();

    logger.debug(`[loot] Removed item with ID ${itemID} from internal storage`);
  },

  // keep track of loot results for each gather or battle
  parseTick: () => {
    if (!lootTracker.internalStore.elapsedSeconds)
      lootTracker.loadFromStorage();

    // now that we know we've got either a fresh set of lootOutput, or a reloaded one from storage
    // we can set the last known date to right now, since we're tracking from start to end
    lootTracker.internalStore.last = new Date();

    if (utils.isBattling()) {
      const lastBattle = manarion.battle;
      if (!lastBattle) return;

      lootTracker.parseLootResults(lastBattle.Loot);

      // TODO also track lastBattle.Items for gear drops
    }

    if (utils.isGathering()) {
      const lastGather = manarion.gather;
      if (!lastGather) return;

      lootTracker.parseLootResults(lastGather.Loot);

      // TODO also track lastGather.Items for gear drops
    }

    // calculate elapsed time
    if (lootTracker.internalStore.first && lootTracker.internalStore.last) {
      lootTracker.internalStore.elapsedSeconds =
        (lootTracker.internalStore.last - lootTracker.internalStore.first) /
        1000;
    }

    // save to localStorage for next iteration
    lootTracker.saveToStorage();
  },

  parseLootResults: (latestLoot) => {
    if (!latestLoot) return;

    const lootIDs = Object.keys(latestLoot);
    for (const lootID of lootIDs) {
      const lootDefinition = lootTracker.trackedItems.find(
        (definition) => definition.id === parseInt(lootID)
      );
      if (!lootDefinition) {
        console.warn(
          `[loot] Loot ID ${lootID} not found in tracked items, skipping...`
        );
        continue;
      } // this is not a tracked loot type

      // we could let the number util do it instead and keep this pristine,
      // but the accuracy on the floats is just so insanely high that this saves space
      const amount = parseInt(latestLoot[lootID]);

      // find the item in the internal store
      const existingEntry = lootTracker.internalStore.items.find(
        (entry) => entry.id === lootDefinition.id
      );
      if (!existingEntry) {
        // create new entry with this amount
        lootTracker.internalStore.items.push({
          id: lootDefinition.id,
          name: lootDefinition.name,
          rarity: lootDefinition.rarity,
          amount: amount,
        });
      } else {
        // add found amount to existing entry
        existingEntry.amount += amount;
      }
    }
  },
};

const shardTracker = {
  // parse the entire content of the loot tracker for all shard entries and calculate rates
  parse: () => {
    const output = {
      first: null,
      last: new Date(), // the last drop of the day is always statically taken as current system time for more accuracy

      highestFound: 0,
      lowestFound: 0,

      elapsedSeconds: 0,
      total: 0,
    };

    // loop through game loot tracker
    for (const lootDrop of manarion.lootTracker.entries) {
      // regardless of the loot, always set the first found loot to the earliest parsed loot
      const date = new Date(lootDrop.Timestamp * 1000);
      if (date < output.first || !output.first) {
        output.first = date;
      }

      // skip if not a shard drop
      if (lootDrop.LootID !== ItemTypes.ELEMENTAL_SHARDS.id) continue;

      const amount = parseInt(lootDrop.Amount);

      // keep track of highest found amount of shards
      if (amount > output.highestFound) output.highestFound = amount;

      // also keep track of lowest found amount of shards
      if (output.lowestFound === 0 || amount < output.lowestFound)
        output.lowestFound = amount;

      output.total += amount;
    }

    // calculate the time between first and last tracked shard drop
    if (output.first && output.last) {
      output.elapsedSeconds = (output.last - output.first) / 1000;
    }

    return output;
  },
  // Find by name
  getPlayerID: () => {
    return manarion.player.ID;
  },
  getRankIDFromRosterUsingPlayerID: (ID) => {
    const roster = manarion.guild.Roster;
    for (let key in roster) {
      if (roster[key].ID === ID) {
        return { key: key, rank: roster[key].RankID };
      }
    }
    return null;
  },
  getTaxFromRanksUsingRankID: (rankID) => {
    const ranks = manarion.guild.Ranks;
    return ranks[rankID.rank].Tax;
  },
  // Usage
  getEquipmentShardBoost: () => {
    const shardBoost =
      manarion.player.TotalBoosts[BoostTypes.ELEMENTAL_SHARD_BOOST.id] || 1;
    return shardBoost;
  },
  getPotionTier: () => {
    const potionTier =
      manarion.buffs.Potions[BoostTypes.ELEMENTAL_SHARD_BOOST.id]?.Tier || 0;
    return potionTier;
  },
  getPotionBoost: () => {
    const potionBoost =
      manarion.player.TotalBoosts[BoostTypes.POTION_BOOST.id] || 1;
    return potionBoost;
  },
  getTotalShardMultiplier(equipmentShardBoost, potionTier, potionBoost) {
    const totalPotionBoost = 5 * potionTier * (1 + potionBoost / 100);
    let mult = 1 + equipmentShardBoost / 100 + (1 + totalPotionBoost / 100);
    return mult;
  },

  getLevels: () => {
    const battleLevel = manarion.player.Level;
    const miningLevel = manarion.player.MiningLevel;
    const fishingLevel = manarion.player.FishingLevel;
    const woodcuttingLevel = manarion.player.WoodcuttingLevel;
    const levels = {
      battle: battleLevel,
      mining: miningLevel,
      fishing: fishingLevel,
      woodcutting: woodcuttingLevel,
    };
    return levels;
  },
  getBaseMinMaxShardsByLevel: (levels) => {
    const level =
      levels.battle * 3 + levels.mining + levels.fishing + levels.woodcutting;
    const minShards = Math.floor(
      100 * Math.pow(1 + level / 10, 1 - 0.3 * (level / (level + 20000)))
    );
    const maxShards = minShards * 2;
    const minMaxShards = {
      min: minShards,
      max: maxShards,
    };
    return minMaxShards;
  },
  getTotalMinMaxShards: (minMaxShards, shardMultiplier) => {
    const totalMinMaxShards = {
      min: minMaxShards.min * shardMultiplier,
      max: minMaxShards.max * shardMultiplier,
    };
    return totalMinMaxShards;
  },
};

const farmAndPotionTracker = {
  marketPrices: {},
  pricesLoaded: false,

  initialize: async () => {
    await farmAndPotionTracker.fetchMarketPrices();
  },

  fetchMarketPrices: async () => {
    try {
      const response = await fetch("https://api.manarion.com/market");
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      const getPrice = (id, type) =>
        (type === "Sell" ? data.Sell[id] : data.Buy[id]) || 0;

      farmAndPotionTracker.marketPrices.shardAvg =
        (getPrice(ItemTypes.ELEMENTAL_SHARDS.id, "Buy") +
          getPrice(ItemTypes.ELEMENTAL_SHARDS.id, "Sell")) /
        2;
      farmAndPotionTracker.marketPrices.sagerootAvg =
        (getPrice(ItemTypes.SAGEROOT.id, "Buy") +
          getPrice(ItemTypes.SAGEROOT.id, "Sell")) /
        2;
      farmAndPotionTracker.marketPrices.bloomwellAvg =
        (getPrice(ItemTypes.BLOOMWELL.id, "Buy") +
          getPrice(ItemTypes.BLOOMWELL.id, "Sell")) /
        2;

      // Store the specific sell prices we need for the new calculation
      farmAndPotionTracker.marketPrices.sagerootSell = getPrice(
        ItemTypes.SAGEROOT.id,
        "Sell"
      );
      farmAndPotionTracker.marketPrices.bloomwellSell = getPrice(
        ItemTypes.BLOOMWELL.id,
        "Sell"
      );

      farmAndPotionTracker.pricesLoaded = true;
      logger.debug(
        "[farm] Market prices loaded",
        farmAndPotionTracker.marketPrices
      );
    } catch (error) {
      console.error("Could not fetch market prices:", error);
      farmAndPotionTracker.pricesLoaded = false;
    }
  },
  calculateHerbsPerHour: () => {
    const boosts = manarion.player.TotalBoosts;
    const golems = boosts[BoostTypes.FARM_GOLEMS.id] || 1;
    const fertilizer = boosts[BoostTypes.FARM_FERTILIZER.id] || 1;
    const plots = boosts[BoostTypes.FARM_PLOTS.id] || 1;

    const golemsMultiplier = Math.pow(golems / 100 + 1, 0.9);
    const fertilizerMultiplier = Math.pow(fertilizer / 100 + 1, 0.9);
    const plotsMultiplier = Math.pow(plots / 100 + 1, 0.9);

    const herbsPerHour =
      2.5 * golemsMultiplier * fertilizerMultiplier * plotsMultiplier;
    return herbsPerHour;
  },

  calculateHerbCost: (tier) => {
    return 0.5 * tier * (tier + 1) + 0.0002 * Math.pow(tier, 3);
  },

  getPotionDuration: () => {
    const durationBoost =
      manarion.player.TotalBoosts[BoostTypes.POTION_DURATION.id] || 0;
    return 1 + durationBoost / 100;
  },

  calculateMaxTier: (herbsPerHour, costPerTierFormula) => {
    if (herbsPerHour <= 0) return 0;

    const durationMultiplier = farmAndPotionTracker.getPotionDuration();
    const totalHerbsAvailable = herbsPerHour * durationMultiplier;

    // Exponential search to find upper bound
    let high = 1;
    while (
      farmAndPotionTracker.calculateHerbCost(high) <= totalHerbsAvailable
    ) {
      high *= 2;
    }
    // Binary search between high/2 and high
    let low = Math.floor(high / 2);
    let maxTier = 0;

    while (low <= high) {
      const mid = Math.floor((low + high) / 2);
      const cost = farmAndPotionTracker.calculateHerbCost(mid);

      if (cost <= totalHerbsAvailable) {
        maxTier = mid;
        low = mid + 1;
      } else {
        high = mid - 1;
      }
    }

    return Math.floor(maxTier);
  },

  calculateIdealResonanceTier: (afterTax = false) => {
    if (!farmAndPotionTracker.pricesLoaded) return "Fetching prices...";

    let taxRate = 0;
    if (afterTax) {
      const playerID = shardTracker.getPlayerID();
      const rankID = shardTracker.getRankIDFromRosterUsingPlayerID(playerID);
      if (!rankID) {
        return "Go to guild page to get taxes and calculate";
      }
      const taxes = shardTracker.getTaxFromRanksUsingRankID(rankID);
      taxRate = (taxes[ItemTypes.ELEMENTAL_SHARDS.id] || 0) / 100;
    }

    const shardPrice = farmAndPotionTracker.marketPrices.shardAvg;
    const sagerootPrice = farmAndPotionTracker.marketPrices.sagerootAvg;
    const bloomwellPrice = farmAndPotionTracker.marketPrices.bloomwellAvg;

    if (shardPrice === 0 || sagerootPrice === 0 || bloomwellPrice === 0) {
      return "Market data missing";
    }

    const dropBoost =
      manarion.player.TotalBoosts[BoostTypes.DROP_BOOST.id] || 0;
    const potionBoost =
      manarion.player.TotalBoosts[BoostTypes.POTION_BOOST.id] || 0;
    const durationMultiplier = farmAndPotionTracker.getPotionDuration();

    const shardDropsPerHour = (3600 / 3) * (1 / 80) * (1 + dropBoost / 100);

    const levels = shardTracker.getLevels();
    const baseMinMax = shardTracker.getBaseMinMaxShardsByLevel(levels);
    const avgBaseShardsPerDrop = (baseMinMax.min + baseMinMax.max) / 2;
    const baseShardsPerHour = shardDropsPerHour * avgBaseShardsPerDrop;

    const herbCostFactor =
      (sagerootPrice + bloomwellPrice) / durationMultiplier;
    const baseRevenue = baseShardsPerHour * shardPrice * (1 - taxRate);
    const revenuePerTier =
      baseShardsPerHour *
      0.05 *
      (1 + potionBoost / 100) *
      shardPrice *
      (1 - taxRate);

    if (herbCostFactor <= 0) {
      return "Profitable (no cost)";
    }

    // Function to calculate profit per hour for a given tier
    const calculateProfitPerHour = (tier) => {
      const revenue = baseRevenue + revenuePerTier * tier;
      const herbCost = farmAndPotionTracker.calculateHerbCost(tier);
      const cost = herbCost * herbCostFactor;
      return revenue - cost;
    };

    // Search for maximum profit
    let bestTier = 0;
    let maxProfit = calculateProfitPerHour(0); // Profit with no potion

    // Search up to 10,000 with step size
    for (let tier = 50; tier <= 10000; tier += 50) {
      const profit = calculateProfitPerHour(tier);
      if (profit > maxProfit) {
        maxProfit = profit;
        bestTier = tier;
      } else if (profit < 0 || (maxProfit > 0 && profit < maxProfit * 0.5)) {
        // Stop if profit goes negative or drops significantly
        break;
      }
    }

    // Fine-tune around the best tier found
    const searchStart = Math.max(1, bestTier - 100);
    const searchEnd = bestTier + 100;

    for (let tier = searchStart; tier <= searchEnd; tier++) {
      const profit = calculateProfitPerHour(tier);
      if (profit > maxProfit) {
        maxProfit = profit;
        bestTier = tier;
      }
    }

    if (maxProfit <= calculateProfitPerHour(0)) {
      return "Not profitable";
    }

    return Math.floor(bestTier);
  },

  calculateMaxTierWithDust: (forIncome = false) => {
    if (!farmAndPotionTracker.pricesLoaded) return "Fetching prices...";

    const sagerootPrice = farmAndPotionTracker.marketPrices.sagerootSell;
    const bloomwellPrice = farmAndPotionTracker.marketPrices.bloomwellSell;
    const manaDust = manarion.player.Loot[1] || 0;
    const dustPerHr = globals.lastGainedDust
      ? globals.lastGainedDust * 1200
      : 0;
    const dustPerDay = dustPerHr * 24;
    if (sagerootPrice === 0 || bloomwellPrice === 0) {
      return "Market data missing";
    }

    // 1. Calculate herbs farmed over 24 hours
    const herbsPerHour = farmAndPotionTracker.calculateHerbsPerHour();
    const farmedHerbs = herbsPerHour * 24;

    // 2. Calculate how many additional herbs can be bought with dust
    const costPerSet = (sagerootPrice + bloomwellPrice) / 2;
    let boughtHerbs;
    forIncome
      ? (boughtHerbs = costPerSet > 0 ? dustPerDay / costPerSet : 0)
      : (boughtHerbs = costPerSet > 0 ? manaDust / costPerSet : 0);

    // 3. Add them together for a total
    const totalAvailableHerbs = farmedHerbs + boughtHerbs;
    const durationMultiplier = farmAndPotionTracker.getPotionDuration();
    const herbsPerBrew = (totalAvailableHerbs / 24) * durationMultiplier;

    let low = 0;
    let high = 10000;
    let maxTier = 0;

    while (low <= high) {
      const mid = Math.floor((low + high) / 2);
      const costPerPotion = farmAndPotionTracker.calculateHerbCost(mid);

      if (costPerPotion <= herbsPerBrew) {
        maxTier = mid;
        low = mid + 1;
      } else {
        high = mid - 1;
      }
    }

    return Math.floor(maxTier);
  },
  // This is an internal "helper" function that contains the main calculation logic.
  calculateMaxTierWithResonance: (afterTax = true) => {
    const herbsPerHour = farmAndPotionTracker.calculateHerbsPerHour();
    // Using 'true' to get the after-tax ideal tier for a more realistic calculation.
    const idealResonanceTier =
      farmAndPotionTracker.calculateIdealResonanceTier(afterTax);

    // If the ideal tier isn't a valid number (e.g., it's "not profitable" or still loading),
    // we can't proceed. We return 0 as you can't sustain a resonance tier.
    if (isNaN(idealResonanceTier) || idealResonanceTier <= 0) {
      return 0;
    }

    // The script calculates herb cost for resonance as T * (T + 1) per hour.
    const durationMultiplier = farmAndPotionTracker.getPotionDuration();
    const resonanceCostPerPotion =
      farmAndPotionTracker.calculateHerbCost(idealResonanceTier);
    const resonanceHerbCostPerHour =
      resonanceCostPerPotion / durationMultiplier;

    const remainingHerbsPerHour = herbsPerHour - resonanceHerbCostPerHour;
    if (remainingHerbsPerHour <= 0) {
      return 0;
    }

    return farmAndPotionTracker.calculateMaxTier(
      remainingHerbsPerHour,
      "single"
    );
  },
};

const questTracker = {
  getQuestTime: () => {
    if (utils.isBattling()) {
      const battleProgress = manarion.player.BattleQuestProgress;
      const battleQuestGoal = manarion.player.BattleQuestCompleted;

      const remaining = battleQuestGoal - battleProgress;
      const seconds = remaining * 3;
      return utils.formatTime(seconds / 60);
    }

    if (utils.isGathering()) {
      const gatherProgress = manarion.player.GatherQuestProgress;
      const gatherQuestGoal = manarion.player.GatherQuestCompleted;

      const remaining = gatherQuestGoal - gatherProgress;
      const seconds = remaining * 3;
      return utils.formatTime(seconds / 60);
    }

    // weird fallback but ok
    return utils.formatTime(0);
  },
};

const levelTracker = {
  // calculates time to next level
  getTimeNextLevel: () => {
    if (utils.isBattling()) {
      const current = manarion.player.Experience;
      const next = manarion.player.ExperienceToLevel;

      return {
        remaining: next - current,
        remainingPercent: (((next - current) / next) * 100).toFixed(2),
      };
    }

    if (utils.isGathering()) {
      let current;
      let next;
      switch (manarion.player.ActionType) {
        case "mining":
          current = manarion.player.MiningExperience;
          next = manarion.player.MiningExperienceToLevel;
          break;

        case "fishing":
          current = manarion.player.FishingExperience;
          next = manarion.player.FishingExperienceToLevel;
          break;

        case "woodcutting":
          current = manarion.player.WoodcuttingExperience;
          next = manarion.player.WoodcuttingExperienceToLevel;
          break;
      }

      return {
        remaining: next - current,
        remainingPercent: (((next - current) / next) * 100).toFixed(2),
      };
    }
  },

  getLevelsPerHour: () => {
    if (!globals.lastGainedXP) return 0;

    switch (manarion.player.ActionType) {
      case "battle":
        return (
          (globals.lastGainedXP * 1200) / manarion.player.ExperienceToLevel
        );

      case "mining":
        return (
          (globals.lastGainedXP * 1200) /
          manarion.player.MiningExperienceToLevel
        );

      case "fishing":
        return (
          (globals.lastGainedXP * 1200) /
          manarion.player.FishingExperienceToLevel
        );

      case "woodcutting":
        return (
          (globals.lastGainedXP * 1200) /
          manarion.player.WoodcuttingExperienceToLevel
        );
    }
  },

  parseBattleTick: () => {
    globals.lastGainedXP = 0;
    globals.lastGainedDust = 0;
    globals.lastGainedResource = 0;

    if (!manarion.battle) return;
    const lastBattle = manarion.battle;

    globals.lastGainedXP = lastBattle.ExperienceGained
      ? parseInt(lastBattle.ExperienceGained)
      : 0;
    globals.lastGainedDust = lastBattle.Loot
      ? parseInt(lastBattle.Loot[ItemTypes.MANA_DUST.id])
      : 0;
  },

  parseGatherTick: () => {
    globals.lastGainedXP = 0;
    globals.lastGainedDust = 0;
    globals.lastGainedResource = 0;

    if (!manarion.gather) return;
    const lastGather = manarion.gather;

    globals.lastGainedXP = lastGather.ExperienceGained
      ? parseFloat(lastGather.ExperienceGained)
      : 0;

    switch (manarion.player.ActionType) {
      case "mining":
        globals.lastGainedResource = lastGather.Loot
          ? parseFloat(lastGather.Loot[ItemTypes.IRON.id])
          : 0;
        break;

      case "fishing":
        globals.lastGainedResource = lastGather.Loot
          ? parseFloat(lastGather.Loot[ItemTypes.FISH.id])
          : 0;
        break;

      case "woodcutting":
        globals.lastGainedResource = lastGather.Loot
          ? parseFloat(lastGather.Loot[ItemTypes.WOOD.id])
          : 0;
        break;
    }
  },
};

const itemQOL = {
  // the codex specific boosts on items, their main property
  shownCodexBoosts: [
    BoostTypes.BATTLE_EXPERIENCE_BOOST,
    BoostTypes.MANA_DUST_BOOST,
    BoostTypes.ELEMENTAL_SHARD_BOOST,
    BoostTypes.STAT_DROP,
    BoostTypes.BASE_RESOURCE_AMOUNT,
    BoostTypes.ACTIONS,
  ],

  // all possible suffixes on items, also shown
  shownShardBoosts: [
    BoostTypes.DAMAGE,
    BoostTypes.MULTICAST,
    BoostTypes.CRIT_CHANCE,
    BoostTypes.CRIT_DAMAGE,
    BoostTypes.HASTE,
    BoostTypes.HEALTH,
    BoostTypes.WARD,
    BoostTypes.FOCUS,
    BoostTypes.MANA,
    BoostTypes.OVERLOAD,
    BoostTypes.TIME_DILATION,
  ],

  shownItemEnchants: [
    {
      slot: 1,
      battler: true,
      gatherer: false,
      value: BoostTypes.INFERNO_VALUE,
      maxRank: BoostTypes.ENCHANT_INFERNO_RANK,
      name: "Inferno",
    },
    {
      slot: 1,
      battler: true,
      gatherer: false,
      value: BoostTypes.TIDAL_WRATH_VALUE,
      maxRank: BoostTypes.ENCHANT_TIDAL_WRATH_RANK,
      name: "Tidal Wrath",
    },
    {
      slot: 1,
      battler: true,
      gatherer: false,
      value: BoostTypes.WILDHEART_VALUE,
      maxRank: BoostTypes.ENCHANT_WILDHEART_RANK,
      name: "Wildheart",
    },

    {
      slot: 2,
      battler: true,
      gatherer: false,
      value: BoostTypes.BASE_MANA_DUST,
      maxRank: BoostTypes.ENCHANT_PROSPERITY_RANK,
      name: "Prosperity",
    },
    {
      slot: 3,
      battler: true,
      gatherer: true,
      value: BoostTypes.MULTISTAT,
      maxRank: BoostTypes.ENCHANT_GROWTH_RANK,
      name: "Growth",
    },
    {
      slot: 4,
      battler: true,
      gatherer: true,
      value: BoostTypes.DROP_BOOST,
      maxRank: BoostTypes.ENCHANT_FORTUNE_RANK,
      name: "Fortune",
    },
    {
      slot: 5,
      battler: true,
      gatherer: true,
      value: BoostTypes.BASE_EXPERIENCE,
      maxRank: BoostTypes.ENCHANT_INSIGHT_RANK,
      name: "Insight",
    },

    {
      slot: 6,
      battler: true,
      gatherer: false,
      value: BoostTypes.FIRE_RESISTANCE_VALUE,
      maxRank: BoostTypes.ENCHANT_FIRE_RESISTANCE_RANK,
      name: "Fire res",
    },
    {
      slot: 6,
      battler: true,
      gatherer: false,
      value: BoostTypes.WATER_RESISTANCE_VALUE,
      maxRank: BoostTypes.ENCHANT_WATER_RESISTANCE_RANK,
      name: "Water res",
    },
    {
      slot: 6,
      battler: true,
      gatherer: false,
      value: BoostTypes.NATURE_RESISTANCE_VALUE,
      maxRank: BoostTypes.ENCHANT_NATURE_RESISTANCE_RANK,
      name: "Nature res",
    },

    {
      slot: 7,
      battler: false,
      gatherer: true,
      value: BoostTypes.BASE_RESOURCE,
      maxRank: BoostTypes.ENCHANT_BOUNTIFUL_HARVEST_RANK,
      name: "Bountiful Harvest",
    },
    {
      slot: 8,
      battler: true,
      gatherer: false,
      value: BoostTypes.VITALITY_VALUE,
      maxRank: BoostTypes.ENCHANT_VITALITY_RANK,
      name: "Vitality",
    },
  ],

  // construct item selectors based on settings
  getItemSelectors: () => {
    const itemSelectors = [];
    if (settings.configuration.parseRareItems)
      itemSelectors.push(".rarity-rare");
    if (settings.configuration.parseEpicItems)
      itemSelectors.push(".rarity-epic");
    if (settings.configuration.parseLegendaryItems)
      itemSelectors.push(".rarity-legendary");
    if (settings.configuration.parseHeirloomItems)
      itemSelectors.push(".rarity-heirloom");
    if (settings.configuration.parseMythicItems)
      itemSelectors.push(".rarity-mythic");

    return itemSelectors.join(", ");
  },

  // processes the current players own inventory page
  processPrivateInventoryPage: () => {
    // only trigger on the inventory page
    if (!window.location.pathname.includes("/inventory")) return;

    // check if game has loaded all the data we need
    if (
      !manarion ||
      !manarion.player ||
      !manarion.inventory ||
      !manarion.equipmentSets
    )
      return;

    // try to locate the inventory screen
    const playerInventory = document.querySelector("main > div.space-y-4");
    if (!playerInventory) {
      logger.warn("Inventory window not found, cannot parse items");
      return;
    }

    itemQOL.processItems(
      playerInventory,
      manarion.inventory.items,
      true,
      manarion.player.ActionType
    );
  },

  processProfilePage: () => {
    // only trigger on profile pages
    if (!window.location.pathname.includes("/profile")) return;

    // check if game has loaded all the data we need
    if (!manarion || !manarion.player || !manarion.profile) return;

    // try to locate the profile screen items
    const profileInventory = document.querySelector(
      "main div[data-slot=card-content] div.space-y-1"
    );
    if (!profileInventory) {
      logger.warn("Profile window not found, cannot parse items");
      return;
    }

    itemQOL.processItems(
      profileInventory,
      manarion.profile.Equipment,
      false,
      manarion.profile.ActionType
    );
  },

  // does the heavy lifting of processing items in the targeted area
  processItems: (
    searchArea,
    itemsSource,
    includeItemSets = false,
    currentActivity = "battle"
  ) => {
    const currentEnchantCap = utils.calculateEnchantingCap();

    // because a user can actually disable all item rarities via settings, we need this check
    const selector = itemQOL.getItemSelectors();
    if (!selector) return;

    // look for either equipped or items in the search area
    const items = searchArea.querySelectorAll(selector);
    items.forEach((item) => {
      if (item.classList.contains("item-processed")) return;

      // pass over it once, so we don't add the set name multiple times
      item.classList.add("item-processed");

      // data-item-id is the ID of the item in the game's inventory
      const itemId = item.dataset.itemId;

      // couldn't find it, might be a loot item like orbs or formulas etc
      if (!itemId) return;

      // look it up in game memory
      const foundItem = itemsSource.find((item) => item.ID == itemId);
      if (!foundItem) return;

      // create a container to hold all the various texts we want to show
      const container = document.createElement("div");
      container.className = "item-qol-container text-sm";
      if (settings.configuration.showItemInfoSingleLine) {
        container.style.display = "inline-block";
        container.style.verticalAlign = "top"; // Align with the 'item' div
        container.style.marginLeft = "10px"; // Add some space between the two divs
      } else {
        container.style.marginBottom = "10px";
      }

      item.insertAdjacentElement("afterend", container);

      // keep track of whether we found any enchants for this item
      let hasEnchants = false;

      // show the main codex boost for the item, as well as quality and any enchants
      const itemBoosts = Object.keys(foundItem.Boosts);
      itemBoosts.forEach((itemBoost) => {
        const itemBoostID = parseInt(itemBoost);

        // show codex boosts that show up on gear
        if (settings.configuration.showItemCodexBoosts) {
          const codexBoost = itemQOL.shownCodexBoosts.find(
            (boost) => boost.id === itemBoostID
          );
          if (codexBoost) {
            const boostSpan = document.createElement("span");
            boostSpan.style.marginRight = "5px";
            boostSpan.title = codexBoost.name;

            let infusedBoost = Math.floor(
              (1 + (foundItem.Infusions * 5) / 100) *
                foundItem.Boosts[itemBoostID]
            );
            if (codexBoost === BoostTypes.BASE_RESOURCE_AMOUNT) {
              infusedBoost = (infusedBoost / 100).toFixed(2);
              boostSpan.textContent = `${codexBoost.short}: +${infusedBoost}`;
            } else if (codexBoost === BoostTypes.ACTIONS) {
              boostSpan.textContent = `${codexBoost.short}: +${infusedBoost}`;
            } else {
              boostSpan.textContent = `${codexBoost.short}: ${infusedBoost}%`;
            }

            container.insertBefore(boostSpan, container.firstChild);
          }
        }

        // show shard boosts that show up on gear
        if (settings.configuration.showItemShardBoosts) {
          const shardBoost = itemQOL.shownShardBoosts.find(
            (boost) => boost.id === itemBoostID
          );
          if (shardBoost) {
            const infusedBoost =
              (1 + (foundItem.Infusions * 5) / 100) *
              (foundItem.Boosts[itemBoostID] * 0.02);

            const boostSpan = document.createElement("span");
            boostSpan.style.marginRight = "5px";
            boostSpan.title = shardBoost.name;
            boostSpan.textContent = `${
              shardBoost.short
            }: ${infusedBoost.toFixed(2)}%`;
            container.appendChild(boostSpan);
          }
        }

        // show enchantments on the item (and how close they are to your max rank)
        if (settings.configuration.showItemEnchants) {
          const enchant = itemQOL.shownItemEnchants.find(
            (enchant) => enchant.value.id === itemBoostID
          );
          if (enchant) {
            hasEnchants = true;
            const currentValue = foundItem.Boosts[itemBoostID];
            const yourRank = manarion.player.Boosts[enchant.maxRank.id];
            const isCapped = currentValue >= currentEnchantCap;

            // skip if enchant is capped to the current gamewide max
            if (isCapped) return;

            // see if we can personally still improve it
            const isPersonalCapped = currentValue >= yourRank;

            const enchantSpan = document.createElement("span");
            enchantSpan.style.marginRight = "5px";
            enchantSpan.style.color = isPersonalCapped ? "green" : "red"; // green if capped, red if not
            enchantSpan.textContent = ` ${currentValue} / ${yourRank} (${currentEnchantCap}) ${enchant.name.toLowerCase()} `;
            enchantSpan.title = isPersonalCapped
              ? `You can't improve this enchant further, but other enchanters probably can`
              : `You can still improve this enchantment to rank ${yourRank}`;
            container.insertBefore(enchantSpan, container.firstChild);
          }
        }
      });

      // show quality of the item
      if (settings.configuration.showItemQuality) {
        const qualitySpan = document.createElement("span");
        qualitySpan.style.marginRight = "5px";
        qualitySpan.textContent = `Q: ${(foundItem.Quality * 100).toFixed(2)}%`;
        qualitySpan.title = "Item Quality";
        container.appendChild(qualitySpan);
      }

      // if no enchant was found, first check if we'd even want to put any on there
      if (settings.configuration.showItemEnchants && !hasEnchants) {
        const isBattler = utils.isBattleActivity(currentActivity);
        const isGatherer = utils.isGatherActivity(currentActivity);

        const applicableEnchants = itemQOL.shownItemEnchants.filter(
          (enchant) =>
            enchant.slot === foundItem.Slot &&
            !foundItem.Boosts[enchant.value.id] &&
            (enchant.battler === isBattler || enchant.gatherer === isGatherer)
        );
        if (applicableEnchants && applicableEnchants.length > 0) {
          const missingEnchant = document.createElement("span");
          missingEnchant.className = "text-red-500";
          missingEnchant.style.marginRight = "5px";
          missingEnchant.textContent = "Missing enchant";
          container.insertBefore(missingEnchant, container.firstChild);
        }
      }

      // find all sets that contain this item and add the set name after the item
      if (settings.configuration.showItemSets && includeItemSets) {
        // this is a dirty hack that's needed because item sets apparently load later
        setTimeout(() => {
          manarion.equipmentSets.sets.forEach((set) => {
            const itemInSet = set.items.find(
              (setItem) => setItem === foundItem.ID
            );
            if (!itemInSet) return;

            const setNamesSpan = document.createElement("span");
            setNamesSpan.style.marginRight = "5px";
            setNamesSpan.style.color = "var(--input)";
            setNamesSpan.textContent = `<${set.name.toLowerCase()} set>`;
            container.appendChild(setNamesSpan);
          });
        }, 250);
      }
    });
  },

  removeContainers: () => {
    const processedItems = document.querySelectorAll(".item-processed");
    processedItems.forEach((item) => item.classList.remove("item-processed"));

    const qolContainers = document.querySelectorAll(".item-qol-container");
    qolContainers.forEach((container) => container.remove());
  },

  render: () => {
    // remove containers upon render to clear the way for the ones that are still enabled
    itemQOL.removeContainers();
    if (settings.configuration.enableItemQol) {
      // this is just base functionality
      itemQOL.processPrivateInventoryPage();

      // see if the user also wants these functions in profile pages
      if (settings.configuration.enableItemQolProfilePage)
        itemQOL.processProfilePage();
    }
  },

  initialize: () => {
    const targetNode = document.querySelector("main");
    if (!targetNode) {
      logger.warn("Main element not found, observer not initialized.");
      return;
    }

    const observerConfig = {
      childList: true,
      subtree: true,
      characterData: true,
      attributes: true,
    };

    const isItemMutation = (mutation) => {
      // same thing here, a user can select zero rarities so we need this failsafe
      const selectors = itemQOL.getItemSelectors();
      if (!selectors) return false;

      if (mutation.type === "childList") {
        const nodes = [...mutation.addedNodes, ...mutation.removedNodes];
        return nodes.some(
          (node) =>
            node.nodeType === 1 &&
            (node.matches(selectors) || node.querySelector?.(selectors))
        );
      }

      if (mutation.type === "characterData") {
        const parent = mutation.target.parentElement;
        return parent?.matches(selectors);
      }

      if (mutation.type === "attributes") {
        return mutation.target.matches(selectors);
      }

      return false;
    };

    const observer = new MutationObserver((mutationsList) => {
      const shouldTrigger = mutationsList.some(isItemMutation);
      if (shouldTrigger) {
        observer.disconnect();
        try {
          itemQOL.render();
        } finally {
          observer.observe(targetNode, observerConfig);
        }
      }
    });

    observer.observe(targetNode, observerConfig);
  },
};

const ui = {
  // track ticks that have passed
  trackedTicks: 0,

  createMainTracker: (leftMenu) => {
    const tracker = document.createElement("div");
    tracker.innerHTML = `
          <div id="elnaeth-tracker" style="display: none;"></div>
     
          <hr width="100%" style="border-top: 1px solid var(--ring); margin: 2px 0 2px 0;" />
     
          <div class="grid grid-cols-4 gap-x-4 gap-y-1 p-2 my-1 text-sm lg:grid-cols-2" title="Kindly provided by Elnaeth. Tips appreciated!">
            <div class="flex col-span-2 justify-between"><span>Quest Timer:</span><span id="quest-timer">Calculating...</span></div>
            <div class="flex col-span-2 justify-between"><span>Time to Level:</span><span id="xp-tnl">Calculating...</span></div>
            <div class="flex col-span-2 justify-between"><span title="This space brought to you, and sponsored by, Autumn">Levels / Hr:</span><span id="levels-per-hour">Autumning...</span></div>
     
            <div title="If this stays at calculating, check if you're at 100% tax" class="flex col-span-2 justify-between"><span>XP / Hr:</span><span id="xp-rate">Calculating...</span></div>
            <div title="If this stays at calculating, check if you're at 100% tax" class="flex col-span-2 justify-between"><span>XP / Day:</span><span id="xp-day-rate">Calculating...</span></div>
     
            <div title="If this stays at calculating, check if you're at 100% tax" class="battle-specific flex col-span-2 justify-between"><span>Mana Dust / Hr:</span><span id="dust-rate">Calculating...</span></div>
            <div title="If this stays at calculating, check if you're at 100% tax" class="battle-specific flex col-span-2 justify-between"><span>Mana Dust / Day:</span><span id="dust-day-rate">Calculating...</span></div>
     
            <div title="If this stays at calculating, check if you're at 100% tax" class="gather-specific flex col-span-2 justify-between"><span>Resource / Hr:</span><span id="resource-rate">Calculating...</span></div>
            <div title="If this stays at calculating, check if you're at 100% tax" class="gather-specific flex col-span-2 justify-between"><span>Resource / Day:</span><span id="resource-day-rate">Calculating...</span></div>
     
            <div class="flex col-span-2 justify-between"><span>Shards / Hr:</span><span id="shard-rate">Calculating...</span></div>
            <div class="flex col-span-2 justify-between"><span>Shards / Day:</span><span id="shard-day-rate">Calculating...</span></div>
            <div class="flex col-span-2 justify-between"><span>Shards / Day(Taxed):</span><span id="shard-day-rate-taxed">Go to guild page to calculate</span></div>
            <div class="flex col-span-2 justify-between"><span>Base Shards range:</span><span id="base-shard-drop-range">Calculating...</span></div>
            <div class="flex col-span-2 justify-between"><span>Total Shards range:</span><span id="total-shard-drop-range">Go to guild page to calculate</span></div>
          </div>
     
          <hr width="100%" style="border-top: 1px solid var(--ring); margin: 2px 0 2px 0;" />
     
          <div class="grid grid-cols-4 gap-x-4 gap-y-1 p-2 my-1 text-sm lg:grid-cols-2" title="Farm & Potion Info">
              <div class="flex col-span-4 justify-between"><span>Herbs / Hr:</span><span id="herbs-per-hour">Calculating...</span></div>
              <div class="flex col-span-4 justify-between" title="Max sustainable tier from farming herbs alone."><span>Max potion tier farmed:</span><span id="max-potion-tier">Calculating...</span></div>
              <div class="flex col-span-4 justify-between" title="Max tier you can sustain for 24 hours by buying herbs with your current Mana Dust."><span>Max potion tier with dust:</span><span id="max-potion-tier-with-dust">Calculating...</span></div>
              <div class="flex col-span-4 justify-between" title="Max tier you can sustain for 24 hours by buying herbs with daily Mana Dust income."><span>Max potion tier with dust income (Day):</span><span id="max-potion-tier-with-dust-income">Calculating...</span></div>
<div class="flex col-span-4 justify-between" title="Max sustainable potion tier you can run while also running your ideal resonance tier, calculated without guild tax."><span>Max pot tier w/ resonance (No Tax):</span><span id="max-potion-tier-with-resonance-no-tax">Calculating...</span></div>
<div class="flex col-span-4 justify-between" title="Max sustainable potion tier you can run while also running your ideal resonance tier, calculated with your guild tax."><span>Max pot tier w/ resonance (Tax):</span><span id="max-potion-tier-with-resonance-tax">Calculating...</span></div>              <div class="flex col-span-4 justify-between"><span>Ideal Resonance Tier (Profit):</span><span id="ideal-resonance-tier">Calculating...</span></div>
              <div class="flex col-span-4 justify-between"><span>Ideal Resonance Tier (After Tax):</span><span id="ideal-resonance-tier-after-tax">Calculating...</span></div>
              <div class="flex col-span-4 justify-between text-xs text-foreground/50" title="Prices used for Ideal Tier calculation (Shard | Sageroot / Bloomwell)"><span>└─ Prices (Avg):</span><span id="ideal-tier-prices">Loading...</span></div>
          </div>
     
          <hr width="100%" style="border-top: 1px solid var(--ring); margin: 2px 0 2px 0;" class="elnaeth-stats-tracker" />
     
          <div class="elnaeth-stats-tracker grid grid-cols-4 gap-x-4 gap-y-1 p-2 my-1 text-sm lg:grid-cols-2" title="Kindly provided by Elnaeth. Tips appreciated!">
            <div class="flex col-span-2 justify-between"><span>Intellect gained:</span><span id="intellect-gained">Calculating...</span></div>
            <div class="flex col-span-2 justify-between"><span>Stamina gained:</span><span id="stamina-gained">Calculating...</span></div>
            <div class="flex col-span-2 justify-between"><span>Spirit gained:</span><span id="spirit-gained">Calculating...</span></div>
            <div class="flex col-span-2 justify-between"><span>Focus gained:</span><span id="focus-gained">Calculating...</span></div>
            <div class="flex col-span-2 justify-between"><span>Mana gained:</span><span id="mana-gained">Calculating...</span></div>
            <div class="flex col-span-2 justify-between"><span>Mastery gained:</span><span id="mastery-gained">Calculating...</span></div>
            <div class="flex col-span-2 justify-between"><span>Tracked time:</span><span id="tracked-time">Calculating...</span></div>
            <div class="flex col-span-2 justify-between"><span>Total stats:</span><span id="stats-hr">Calculating...</span></div>
     
            <div class="flex col-span-4 lg:col-span-2 justify-between text-center">
              <div></div>
              <button id="reset-stat-tracker" class="m-0 p-1 col-span-2 bg-red-500 text-sm text-white rounded cursor-pointer">Reset</button>
              <div></div>
            </div>
          </div>`;

    leftMenu.insertAdjacentElement("afterend", tracker);

    document
      .getElementById("reset-stat-tracker")
      .addEventListener("click", () => {
        statTracker.reset();
        ui.render();
      });

    logger.debug("[ui] Main tracker injected");
  },

  createStatsTracker: (lootTracker) => {
    // Create the stat tracker header
    const header = document.createElement("div");
    header.className = "elnaeth-stats-log text-center text-lg";
    header.title = "Kindly provided by Elnaeth. Tips appreciated!";
    header.textContent = "Stat Drop Tracker";

    // add the header to the DOM, right before the loot tracker
    lootTracker.previousSibling.insertAdjacentElement("beforebegin", header);

    // Create the stats log container for the actual lines
    const statsLogContainer = document.createElement("div");
    statsLogContainer.id = "elnaeth-stats-log";
    statsLogContainer.className =
      "elnaeth-stats-log scrollbar-none hover:scrollbar-thin scrollbar-track-transparent h-15 max-h-15 grow-1 overflow-x-hidden overflow-y-auto";
    statsLogContainer.style.maxHeight = "200px"; // extra control for max height

    // add the stats log container to the DOM, right after the header
    header.insertAdjacentElement("afterend", statsLogContainer);

    logger.debug("[ui] Stats tracker injected");
  },

  createItemsTracker: (lootTrackerElement) => {
    // Create the item drop tracker header
    const header = document.createElement("div");
    header.className = "elnaeth-items-log text-center text-lg";
    header.title = "Kindly provided by Elnaeth. Tips appreciated!";
    header.textContent = "Item Drop Tracker";

    const resetButton = document.createElement("button");
    resetButton.textContent = "Reset";
    resetButton.className =
      "elnaeth-items-log m-0 p-1 bg-red-500 text-sm text-white rounded cursor-pointer";
    resetButton.addEventListener("click", () => {
      // Reset the item drops and re-render ui immediately
      lootTracker.reset();
      ui.render();
    });

    header.appendChild(document.createElement("br"));
    header.appendChild(resetButton);

    // add the header to the DOM, right before the loot tracker
    lootTrackerElement.previousSibling.insertAdjacentElement(
      "beforebegin",
      header
    );

    // Create the items log container
    const itemsLogContainer = document.createElement("div");
    itemsLogContainer.id = "elnaeth-items-log";
    itemsLogContainer.className =
      "elnaeth-items-log scrollbar-none hover:scrollbar-thin scrollbar-track-transparent h-15 max-h-15 grow-1 overflow-x-hidden overflow-y-auto";
    itemsLogContainer.style.maxHeight = "200px";

    header.insertAdjacentElement("afterend", itemsLogContainer);

    logger.debug("[ui] Items tracker injected");
  },

  createTrackerContainers: () => {
    // Look for the entire menu on the left of the screen
    const leftMenu = document.querySelector("div.grid.grid-cols-4");
    if (!leftMenu) return;

    // add space to show the 3 resources next to the other currencies
    const span = Array.from(document.querySelectorAll("div.grid span")).find(
      (s) => s.textContent.trim() === "Codex:"
    );
    if (span) {
      span.parentElement.insertAdjacentHTML(
        "afterend",
        `
            <div class="col-span-2 flex justify-between battle-specific"><span>Fish:</span><span class="battle-specific" id="elnaeth-currency-fish">0</span></div>
            <div class="col-span-2 flex justify-between battle-specific"><span>Wood:</span><span class="battle-specific" id="elnaeth-currency-wood">0</span></div>
            <div class="col-span-2 flex justify-between battle-specific"><span>Iron:</span><span class="battle-specific" id="elnaeth-currency-iron">0</span></div>
            `
      );
    }

    // find the native game UI loot tracker
    const lootTrackerElement = document.querySelector(
      "div.scrollbar-none.scrollbar-track-transparent.h-60.grow-1.overflow-x-hidden.overflow-y-auto"
    );
    if (!lootTrackerElement) return;

    // add the main tracker container on the left menu
    let exists = document.getElementById("elnaeth-tracker");
    if (!exists) {
      ui.createMainTracker(leftMenu);
    }

    // create our stats tracker window above the loot tracker
    exists = document.getElementById("elnaeth-stats-log");
    if (!exists) {
      ui.createStatsTracker(lootTrackerElement);
    }

    // create our items tracker window above the loot tracker
    exists = document.getElementById("elnaeth-items-log");
    if (!exists) {
      ui.createItemsTracker(lootTrackerElement);
      document
        .getElementById("elnaeth-items-log")
        .addEventListener("click", function (event) {
          if (event.target.matches("i.elnaeth-delete-row")) {
            const itemId = parseInt(event.target.dataset.itemId);
            lootTracker.resetSingleItem(itemId);
            ui.render();
          }
        });
    }
  },

  render: () => {
    // show/hide battler specific stats depending on if we're battling
    const battleContainers = document.getElementsByClassName("battle-specific");
    for (let container of battleContainers) {
      container.style.display = utils.isBattling() ? "flex" : "none";
    }

    // show/hide gatherer specific stats depending on if we're gathering
    const gatherContainers = document.getElementsByClassName("gather-specific");
    for (let container of gatherContainers) {
      container.style.display = utils.isGathering() ? "flex" : "none";
    }

    // show/hide the lower left stats tracker based on settings
    if (!settings.configuration.showStatsTracker)
      $(".elnaeth-stats-tracker").hide();
    else $(".elnaeth-stats-tracker").show();

    // show/hide the upper right stats log based on settings
    if (!settings.configuration.showStatsLog) $(".elnaeth-stats-log").hide();
    else $(".elnaeth-stats-log").show();

    // show/hide the upper right items log based on settings
    if (!settings.configuration.showLootTracker) $(".elnaeth-items-log").hide();
    else $(".elnaeth-items-log").show();

    // update stats section
    const logTracker = document.getElementById("elnaeth-stats-log");
    if (logTracker) {
      // clear the log tracker and re-render
      logTracker.innerHTML = "";

      statTracker.log.forEach((stat) => {
        const statDiv = document.createElement("div");
        statDiv.innerHTML = `
            <div class="max-w-full overflow-hidden align-middle text-sm text-ellipsis whitespace-nowrap">
                 <span class="text-foreground/50 text-xs"> ${stat.timestamp} </span>
                 <span class="rarity-uncommon"> ${stat.line} </span>
            </div>`;

        logTracker.appendChild(statDiv);
      });
    }

    // Calculate rates
    const xpPerHr = globals.lastGainedXP ? globals.lastGainedXP * 1200 : 0;
    const xpPerDay = xpPerHr * 24;

    const dustPerHr = globals.lastGainedDust
      ? globals.lastGainedDust * 1200
      : 0;
    const dustPerDay = dustPerHr * 24;

    const resourcePerHr = globals.lastGainedResource
      ? globals.lastGainedResource * 1200
      : 0;
    const resourcePerDay = resourcePerHr * 24;

    // Calculate time to next level
    const tnl = levelTracker.getTimeNextLevel();
    const minutesToLevel =
      xpPerHr > 0 && tnl ? (tnl.remaining / xpPerHr) * 60 : null;

    const levelsPerHour = levelTracker.getLevelsPerHour();

    // Calculate quest completion time
    const questTime = questTracker.getQuestTime();

    // Calculate percentage to next level
    let percentageToLevel = "N/A";
    if (tnl && xpPerHr > 0) {
      percentageToLevel = tnl.remainingPercent + "%";
    }

    // update to show current fish, wood and iron
    if (manarion.player.Loot[ItemTypes.FISH.id]) {
      document.getElementById("elnaeth-currency-fish").textContent =
        utils.formatNumber(manarion.player.Loot[ItemTypes.FISH.id] || 0);
      document.getElementById("elnaeth-currency-fish").title =
        manarion.player.Loot[ItemTypes.FISH.id].toFixed(0) || 0;
    }

    if (manarion.player.Loot[ItemTypes.WOOD.id]) {
      document.getElementById("elnaeth-currency-wood").textContent =
        utils.formatNumber(manarion.player.Loot[ItemTypes.WOOD.id] || 0);
      document.getElementById("elnaeth-currency-wood").title =
        manarion.player.Loot[ItemTypes.WOOD.id].toFixed(0) || 0;
    }

    if (manarion.player.Loot[ItemTypes.IRON.id]) {
      document.getElementById("elnaeth-currency-iron").textContent =
        utils.formatNumber(manarion.player.Loot[ItemTypes.IRON.id] || 0);
      document.getElementById("elnaeth-currency-iron").title =
        manarion.player.Loot[ItemTypes.IRON.id].toFixed(0) || 0;
    }

    // update level calculation and quest timer
    document.getElementById("xp-tnl").textContent = minutesToLevel
      ? `${utils.formatTime(minutesToLevel)} (${percentageToLevel})`
      : "Calculating...";
    document.getElementById("levels-per-hour").textContent = levelsPerHour
      ? levelsPerHour.toFixed(2)
      : "Autumning...";
    document.getElementById("levels-per-hour").title =
      "This space brought to you, and sponsored by, Autumn";
    document.getElementById("quest-timer").textContent = questTime ?? "N/A";

    // update xp, dust and resource rates
    document.getElementById("xp-rate").textContent = xpPerHr
      ? utils.formatNumber(xpPerHr)
      : "Calculating...";
    document.getElementById("xp-day-rate").textContent = xpPerDay
      ? utils.formatNumber(xpPerDay)
      : "Calculating...";

    document.getElementById("dust-rate").textContent = dustPerHr
      ? utils.formatNumber(dustPerHr)
      : "Calculating...";
    document.getElementById("dust-day-rate").textContent = dustPerDay
      ? utils.formatNumber(dustPerDay)
      : "Calculating...";

    document.getElementById("resource-rate").textContent = resourcePerHr
      ? utils.formatNumber(resourcePerHr)
      : "Calculating...";
    document.getElementById("resource-day-rate").textContent = resourcePerDay
      ? utils.formatNumber(resourcePerDay)
      : "Calculating...";

    // calculate stats per hour
    if (ui.trackedTicks > 0) {
      const stats = statTracker.internalStore;
      const secondsPassed = (stats.EndTime - stats.StartTime) / 1000 ?? 0;
      const hoursPassed = secondsPassed / 3600;
      const statsPerHour = stats.TotalStats / hoursPassed ?? 0;
      const tookTime =
        secondsPassed > 0 ? utils.formatTime(secondsPassed / 60) : "0h 0m";

      // show stats per hour and total
      document.getElementById("stats-hr").textContent =
        (stats.TotalStats ?? 0) + " (" + statsPerHour.toFixed(2) + " / hr)";
      document.getElementById("tracked-time").textContent = tookTime;

      // show shards per hour and total if we can
      const shards = shardTracker.parse();
      const totalLevels = shardTracker.getLevels();
      const minMaxShards = shardTracker.getBaseMinMaxShardsByLevel(totalLevels);
      const equipmentShardBoost = shardTracker.getEquipmentShardBoost();
      const potionTier = shardTracker.getPotionTier();
      const potionBoost = shardTracker.getPotionBoost();
      const playerID = shardTracker.getPlayerID();
      const rankID = shardTracker.getRankIDFromRosterUsingPlayerID(playerID);
      const taxes = rankID
        ? shardTracker.getTaxFromRanksUsingRankID(rankID)
        : { [ItemTypes.ELEMENTAL_SHARDS.id]: 0 };
      const taxRate = (taxes[ItemTypes.ELEMENTAL_SHARDS.id] || 0) / 100;
      const getTotalShardMultiplier = shardTracker.getTotalShardMultiplier(
        equipmentShardBoost,
        potionTier,
        potionBoost
      );
      const totalMinMaxShards = shardTracker.getTotalMinMaxShards(
        minMaxShards,
        getTotalShardMultiplier
      );
      const avgShardDrop = (totalMinMaxShards.min + totalMinMaxShards.max) / 2;
      const dropBoost =
        manarion.player.TotalBoosts[BoostTypes.DROP_BOOST.id] || 0;
      const shardDropsPerHour =
        (3600 / 3) * (1 / 80) * (1 + dropBoost / 100) * avgShardDrop;
      if (shards.elapsedSeconds > 0) {
        const shardsPerHour = shardDropsPerHour;
        const shardsPerDay = shardDropsPerHour * 24;
        const shardsPerDayTaxed = shardDropsPerHour * 24 * (1 - taxRate);
        document.getElementById("shard-rate").textContent =
          utils.formatNumber(shardsPerHour);
        document.getElementById("shard-day-rate").textContent =
          utils.formatNumber(shardsPerDay);
        document.getElementById("shard-day-rate-taxed").textContent =
          utils.formatNumber(shardsPerDayTaxed);
        document.getElementById(
          "base-shard-drop-range"
        ).textContent = `${utils.formatNumber(
          minMaxShards.min
        )} to ${utils.formatNumber(minMaxShards.max)}`;
        if (rankID) {
          const taxes = shardTracker.getTaxFromRanksUsingRankID(rankID);
          const taxRate = (taxes[ItemTypes.ELEMENTAL_SHARDS.id] || 0) / 100;
          document.getElementById(
            "total-shard-drop-range"
          ).textContent = `${utils.formatNumber(
            totalMinMaxShards.min * (1 - taxRate)
          )} to ${utils.formatNumber(totalMinMaxShards.max * (1 - taxRate))}`;
        } else {
          document.getElementById("total-shard-drop-range").textContent =
            "Go to guild page to calculate";
          document.getElementById("shard-day-rate-taxed").textContent =
            "Go to guild page to calculate";
        }
      }
    }

    // Update farm and potion info
    const herbsPerHour = farmAndPotionTracker.calculateHerbsPerHour();
    document.getElementById("herbs-per-hour").textContent =
      utils.formatNumber(herbsPerHour);
    document.getElementById("max-potion-tier").textContent =
      farmAndPotionTracker.calculateMaxTier(herbsPerHour, "single");
    document.getElementById("max-potion-tier-with-dust").textContent =
      farmAndPotionTracker.calculateMaxTierWithDust(false);
    document.getElementById("max-potion-tier-with-dust-income").textContent =
      farmAndPotionTracker.calculateMaxTierWithDust(true);
    document.getElementById(
      "max-potion-tier-with-resonance-no-tax"
    ).textContent = farmAndPotionTracker.calculateMaxTierWithResonance(false);
    document.getElementById("max-potion-tier-with-resonance-tax").textContent =
      farmAndPotionTracker.calculateMaxTierWithResonance(true);
    document.getElementById("ideal-resonance-tier").textContent =
      farmAndPotionTracker.calculateIdealResonanceTier(false);
    document.getElementById("ideal-resonance-tier-after-tax").textContent =
      farmAndPotionTracker.calculateIdealResonanceTier(true);

    // FIX: Removed the update logic for the now-deleted "max-resonance-tier" element.

    document.getElementById("ideal-resonance-tier").textContent =
      farmAndPotionTracker.calculateIdealResonanceTier();
    const prices = farmAndPotionTracker.marketPrices;
    if (
      farmAndPotionTracker.pricesLoaded &&
      prices.shardAvg &&
      prices.sagerootAvg &&
      prices.bloomwellAvg
    ) {
      const shardPriceFormatted = utils.formatNumber(prices.shardAvg);
      const sagerootPriceFormatted = utils.formatNumber(prices.sagerootAvg);
      const bloomwellPriceFormatted = utils.formatNumber(prices.bloomwellAvg);
      document.getElementById(
        "ideal-tier-prices"
      ).textContent = `Shard: ${shardPriceFormatted} | Herbs: ${sagerootPriceFormatted} / ${bloomwellPriceFormatted}`;
    } else {
      document.getElementById("ideal-tier-prices").textContent = "Loading...";
    }

    // write out stat gains
    document.getElementById("intellect-gained").textContent =
      statTracker.getStatByName("intellect").gained;
    document.getElementById("stamina-gained").textContent =
      statTracker.getStatByName("stamina").gained;
    document.getElementById("spirit-gained").textContent =
      statTracker.getStatByName("spirit").gained;
    document.getElementById("focus-gained").textContent =
      statTracker.getStatByName("focus").gained;
    document.getElementById("mana-gained").textContent =
      statTracker.getStatByName("mana").gained;

    // write out current mastery gains
    if (statTracker.getStatByName("fire").active)
      document.getElementById("mastery-gained").textContent =
        statTracker.getStatByName("fire").gained / 100 + "%";
    if (statTracker.getStatByName("water").active)
      document.getElementById("mastery-gained").textContent =
        statTracker.getStatByName("water").gained / 100 + "%";
    if (statTracker.getStatByName("nature").active)
      document.getElementById("mastery-gained").textContent =
        statTracker.getStatByName("nature").gained / 100 + "%";

    // Render item drops in the item tracker container
    const itemsLog = document.getElementById("elnaeth-items-log");
    if (itemsLog) {
      itemsLog.innerHTML = "";

      const itemDrops = lootTracker.getCurrentState();

      // Calculate elapsed time for per-hour rate
      const elapsedHours =
        itemDrops.elapsedSeconds > 0 ? itemDrops.elapsedSeconds / 3600 : 1;

      // render the items, sorted by rarity, rarest first
      const sortedByRarity = Array.from(itemDrops.items)
        .sort((a, b) => utils.sortByRarity(a, b))
        .reverse();
      sortedByRarity.forEach((item) => {
        const perHour = (item.amount / elapsedHours).toFixed(2);
        const itemDiv = document.createElement("div");
        itemDiv.innerHTML = `
              <div class="max-w-full overflow-hidden align-middle text-sm text-ellipsis whitespace-nowrap">
                <i data-item-id="${
                  item.id
                }" class="elnaeth-delete-row cursor-pointer text-xs">[-]</i>
     
                <span class="rarity-${item.rarity}">${
          item.name
        }:</span> <span>${utils.formatNumber(item.amount)}</span>
                <span class="text-foreground/50 text-xs">(${utils.formatNumber(
                  perHour
                )}/HR)</span>
              </div>`;

        itemsLog.appendChild(itemDiv);
      });
    }

    ui.trackedTicks++;
  },

  condenseMainMenu: () => {
    document.querySelectorAll("div.grid.grid-cols-4").forEach((grid) => {
      if (grid.classList.contains("gap-y-2")) {
        grid.classList.remove("gap-y-2");
      }
    });

    logger.debug("[ui] Main menu condensed");
  },
};

(function () {
  function waitForGameReady(maxWaitMs = 10000) {
    return new Promise((resolve, reject) => {
      const interval = 100;
      let waited = 0;

      const check = () => {
        if (
          typeof manarion !== "undefined" &&
          manarion.player &&
          manarion.player.Boosts &&
          manarion.inventory &&
          manarion.equipmentSets
        ) {
          resolve(true);
          return;
        }

        waited += interval;
        if (waited >= maxWaitMs) {
          reject("manarion not ready in time");
          return;
        }

        setTimeout(check, interval);
      };

      check();
    });
  }

  $(async () => {
    try {
      await waitForGameReady();

      // add the settings UI and load all settings
      settings.initialize();

      // fetch market prices for potion calculations
      farmAndPotionTracker.initialize();

      // make the left menu not use up as much vertical spacing
      ui.condenseMainMenu();

      // create the tracker HTML elements
      ui.createTrackerContainers();

      // start listening for item QoL events a little bit after page load
      itemQOL.initialize();

      let playerTotalActions = 0;
      const monitorTicks = () => {
        // get the current player total actions
        const remainingActions = manarion.player.Actions;
        if (remainingActions > 0 && remainingActions !== playerTotalActions) {
          logger.debug("[main] Tick processing");

          // this tick is now processed, save it for the next iteration
          playerTotalActions = remainingActions;

          try {
            // keep track of gains, like exp and dust, or incoming resources, for both action types
            if (utils.isBattling()) levelTracker.parseBattleTick();
            if (utils.isGathering()) levelTracker.parseGatherTick();

            // calculate stats for this tick
            statTracker.parseTick();

            // parse the latest action for any loot drops
            lootTracker.parseTick();
          } catch (error) {
            console.error("[main] Error during tick parsing:", error);
          }

          // finally, render UI
          ui.render();

          logger.debug("[main] Tick processed");
        }
      };

      // run tick monitor every 500ms
      setInterval(monitorTicks, 500);
    } catch (err) {
      console.warn("[main] Game never finished loading:", err);
    }
  });
})();
