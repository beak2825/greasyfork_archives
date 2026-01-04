// ==UserScript==
// @name         npmjs-explore
// @name:zh      npmjs文件查看
// @namespace    https://github.com/lisonge
// @version      1.0.3
// @author       lisonge
// @description  npmjs-explore/npmjs文件查看
// @license      ISC
// @icon         https://i.songe.li/favicon.svg
// @homepage     https://github.com/lisonge/npmjs-explore#readme
// @homepageURL  https://github.com/lisonge/npmjs-explore#readme
// @source       https://github.com/lisonge/npmjs-explore.git
// @supportURL   https://github.com/lisonge/npmjs-explore/issues
// @include      ^https:\/\/www.npmjs.com\/package\/.*
// @match        https://www.npmjs.com/package/*
// @require      https://cdn.jsdelivr.net/npm/preact@10.10.0
// @downloadURL https://update.greasyfork.org/scripts/446853/npmjs-explore.user.js
// @updateURL https://update.greasyfork.org/scripts/446853/npmjs-explore.meta.js
// ==/UserScript==

// use vite-plugin-monkey@1.1.3 at 2022-07-22T07:45:07.318Z

(function(preact2) {
  "use strict";
  var t, u, r, o$1, i = 0, c = [], f = [], e$1 = preact2.options.__b, a = preact2.options.__r, v = preact2.options.diffed, l = preact2.options.__c, m = preact2.options.unmount;
  function p(t2, r2) {
    preact2.options.__h && preact2.options.__h(u, t2, i || r2), i = 0;
    var o2 = u.__H || (u.__H = { __: [], __h: [] });
    return t2 >= o2.__.length && o2.__.push({ __V: f }), o2.__[t2];
  }
  function y(n) {
    return i = 1, d(z, n);
  }
  function d(n, r2, o2) {
    var i2 = p(t++, 2);
    return i2.t = n, i2.__c || (i2.__ = [o2 ? o2(r2) : z(void 0, r2), function(n2) {
      var t2 = i2.t(i2.__[0], n2);
      i2.__[0] !== t2 && (i2.__ = [t2, i2.__[1]], i2.__c.setState({}));
    }], i2.__c = u), i2.__;
  }
  function _(r2, o2) {
    var i2 = p(t++, 3);
    !preact2.options.__s && w(i2.__H, o2) && (i2.__ = r2, i2.u = o2, u.__H.__h.push(i2));
  }
  function b() {
    for (var t2; t2 = c.shift(); )
      if (t2.__P)
        try {
          t2.__H.__h.forEach(j), t2.__H.__h.forEach(k), t2.__H.__h = [];
        } catch (u2) {
          t2.__H.__h = [], preact2.options.__e(u2, t2.__v);
        }
  }
  preact2.options.__b = function(n) {
    u = null, e$1 && e$1(n);
  }, preact2.options.__r = function(n) {
    a && a(n), t = 0;
    var o2 = (u = n.__c).__H;
    o2 && (r === u ? (o2.__h = [], u.__h = [], o2.__.forEach(function(n2) {
      n2.__V = f, n2.u = void 0;
    })) : (o2.__h.forEach(j), o2.__h.forEach(k), o2.__h = [])), r = u;
  }, preact2.options.diffed = function(t2) {
    v && v(t2);
    var i2 = t2.__c;
    i2 && i2.__H && (i2.__H.__h.length && (1 !== c.push(i2) && o$1 === preact2.options.requestAnimationFrame || ((o$1 = preact2.options.requestAnimationFrame) || function(n) {
      var t3, u2 = function() {
        clearTimeout(r2), g && cancelAnimationFrame(t3), setTimeout(n);
      }, r2 = setTimeout(u2, 100);
      g && (t3 = requestAnimationFrame(u2));
    })(b)), i2.__H.__.forEach(function(n) {
      n.u && (n.__H = n.u), n.__V !== f && (n.__ = n.__V), n.u = void 0, n.__V = f;
    })), r = u = null;
  }, preact2.options.__c = function(t2, u2) {
    u2.some(function(t3) {
      try {
        t3.__h.forEach(j), t3.__h = t3.__h.filter(function(n) {
          return !n.__ || k(n);
        });
      } catch (r2) {
        u2.some(function(n) {
          n.__h && (n.__h = []);
        }), u2 = [], preact2.options.__e(r2, t3.__v);
      }
    }), l && l(t2, u2);
  }, preact2.options.unmount = function(t2) {
    m && m(t2);
    var u2, r2 = t2.__c;
    r2 && r2.__H && (r2.__H.__.forEach(function(n) {
      try {
        j(n);
      } catch (n2) {
        u2 = n2;
      }
    }), u2 && preact2.options.__e(u2, r2.__v));
  };
  var g = "function" == typeof requestAnimationFrame;
  function j(n) {
    var t2 = u, r2 = n.__c;
    "function" == typeof r2 && (n.__c = void 0, r2()), u = t2;
  }
  function k(n) {
    var t2 = u;
    n.__c = n.__(), u = t2;
  }
  function w(n, t2) {
    return !n || n.length !== t2.length || t2.some(function(t3, u2) {
      return t3 !== n[u2];
    });
  }
  function z(n, t2) {
    return "function" == typeof t2 ? t2(n) : t2;
  }
  const getPackageMeta = () => {
    var _a, _b;
    const list = location.pathname.split("/");
    let name = list[2];
    let version = (_a = list[4]) != null ? _a : "latest";
    if (name.startsWith("@")) {
      name = list[2] + "/" + list[3];
      version = (_b = list[5]) != null ? _b : "latest";
    }
    return {
      name,
      version
    };
  };
  var o = 0;
  function e(_2, e2, n, t2, f2) {
    var l2, s, u2 = {};
    for (s in e2)
      "ref" == s ? l2 = e2[s] : u2[s] = e2[s];
    var a2 = { type: _2, props: u2, key: n, ref: l2, __k: null, __: null, __b: 0, __e: null, __d: void 0, __c: null, __h: null, constructor: void 0, __v: --o, __source: f2, __self: t2 };
    if ("function" == typeof _2 && (l2 = _2.defaultProps))
      for (s in l2)
        void 0 === u2[s] && (u2[s] = l2[s]);
    return preact2.options.vnode && preact2.options.vnode(a2), a2;
  }
  function App() {
    const [jsdelivrUrl, setJsdelivrUrl] = y("");
    const [unpkgUrl, setUnpkgUrl] = y("");
    _(() => {
      const invoke = () => {
        const {
          name,
          version
        } = getPackageMeta();
        setJsdelivrUrl(`https://cdn.jsdelivr.net/npm/${name}@${version}/`);
        setUnpkgUrl(`https://unpkg.com/browse/${name}@${version}/`);
      };
      invoke();
      const task = setInterval(invoke, 1e3);
      return () => {
        clearInterval(task);
      };
    }, []);
    return e(preact2.Fragment, {
      children: e("div", {
        style: {
          marginLeft: "20px"
        },
        children: [e("a", {
          href: unpkgUrl,
          title: unpkgUrl,
          target: "_blank",
          style: {
            color: "#bb2e3e",
            textDecoration: "none"
          },
          children: "unpkg"
        }), e("span", {
          style: {
            display: "inline-block",
            width: "10px"
          }
        }), e("a", {
          href: jsdelivrUrl,
          title: jsdelivrUrl,
          target: "_blank",
          style: {
            color: "#bb2e3e",
            textDecoration: "none"
          },
          children: "jsdelivr"
        })]
      })
    });
  }
  (() => {
    var _a;
    const {
      name
    } = getPackageMeta();
    const box = (_a = document.querySelector(`span[title="${name}"]`)) == null ? void 0 : _a.parentElement;
    if (!box) {
      console.warn("npmjs-explore inject failed");
      return;
    }
    const container = document.createElement("div");
    box.appendChild(container);
    preact2.render(e(App, {}), container);
  })();
})(preact);
 
