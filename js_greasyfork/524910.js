// ==UserScript==
// @name         USF Student Seach Bypass
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  A simple script to bypass sign-in on the University of South Florida Directory page
// @author       November2246
// @match        https://directory.usf.edu/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=usf.edu
// @grant        none
// @run-at       document-start
// @license      ISC
// @downloadURL https://update.greasyfork.org/scripts/524910/USF%20Student%20Seach%20Bypass.user.js
// @updateURL https://update.greasyfork.org/scripts/524910/USF%20Student%20Seach%20Bypass.meta.js
// ==/UserScript==

//XHook - v1.6.2 - https://github.com/jpillora/xhook
//Jaime Pillora <dev@jpillora.com> - MIT Copyright 2023
var xhook = function () {
  "use strict";

  const e = (e, t) => Array.prototype.slice.call(e, t);
  let t = null;
  if (typeof WorkerGlobalScope != "undefined" && self instanceof WorkerGlobalScope) {
    t = self;
  } else if (typeof global != "undefined") {
    t = global;
  } else if (window) {
    t = window;
  }
  const n = t;
  const o = t.document;
  const r = ["load", "loadend", "loadstart"];
  const s = ["progress", "abort", "error", "timeout"];
  const a = e => ["returnValue", "totalSize", "position"].includes(e);
  const i = function (e, t) {
    for (let n in e) {
      if (a(n)) {
        continue;
      }
      const o = e[n];
      try {
        t[n] = o;
      } catch (e) {}
    }
    return t;
  };
  const c = function (e, t, n) {
    const o = e => function (o) {
      const r = {};
      for (let e in o) {
        if (a(e)) {
          continue;
        }
        const s = o[e];
        r[e] = s === t ? n : s;
      }
      return n.dispatchEvent(e, r);
    };
    for (let r of Array.from(e)) {
      if (n._has(r)) {
        t[`on${r}`] = o(r);
      }
    }
  };
  const u = function (e) {
    if (o && o.createEventObject != null) {
      const t = o.createEventObject();
      t.type = e;
      return t;
    }
    try {
      return new Event(e);
    } catch (t) {
      return {
        type: e
      };
    }
  };
  const l = function (t) {
    let n = {};
    const o = e => n[e] || [];
    const r = {
      addEventListener: function (e, t, r) {
        n[e] = o(e);
        if (!(n[e].indexOf(t) >= 0)) {
          r = r === undefined ? n[e].length : r;
          n[e].splice(r, 0, t);
        }
      },
      removeEventListener: function (e, t) {
        if (e === undefined) {
          n = {};
          return;
        }
        if (t === undefined) {
          n[e] = [];
        }
        const r = o(e).indexOf(t);
        if (r !== -1) {
          o(e).splice(r, 1);
        }
      },
      dispatchEvent: function () {
        const n = e(arguments);
        const s = n.shift();
        if (!t) {
          n[0] = i(n[0], u(s));
          Object.defineProperty(n[0], "target", {
            writable: false,
            value: this
          });
        }
        const a = r[`on${s}`];
        if (a) {
          a.apply(r, n);
        }
        const c = o(s).concat(o("*"));
        for (let e = 0; e < c.length; e++) {
          c[e].apply(r, n);
        }
      },
      _has: e => !!n[e] || !!r[`on${e}`]
    };
    if (t) {
      r.listeners = t => e(o(t));
      r.on = r.addEventListener;
      r.off = r.removeEventListener;
      r.fire = r.dispatchEvent;
      r.once = function (e, t) {
        function n() {
          r.off(e, n);
          return t.apply(null, arguments);
        }
        return r.on(e, n);
      };
      r.destroy = () => n = {};
    }
    return r;
  };
  function f(e, t) {
    switch (typeof e) {
      case "object":
        n = e;
        return Object.entries(n).map(([e, t]) => `${e.toLowerCase()}: ${t}`).join("\r\n");
      case "string":
        return function (e, t) {
          const n = e.split("\r\n");
          if (t == null) {
            t = {};
          }
          for (let e of n) {
            if (/([^:]+):\s*(.+)/.test(e)) {
              const e = RegExp.$1 != null ? RegExp.$1.toLowerCase() : undefined;
              const n = RegExp.$2;
              if (t[e] == null) {
                t[e] = n;
              }
            }
          }
          return t;
        }(e, t);
    }
    var n;
    return [];
  }
  const d = l(true);
  const p = e => e === undefined ? null : e;
  const h = n.XMLHttpRequest;
  const y = function () {
    const e = new h();
    const t = {};
    let n;
    let o;
    let a;
    let u = null;
    var y = 0;
    const v = function () {
      a.status = u || e.status;
      if (u !== -1) {
        a.statusText = e.statusText;
      }
      if (u === -1) ;else {
        const t = f(e.getAllResponseHeaders());
        for (let e in t) {
          const n = t[e];
          if (!a.headers[e]) {
            const t = e.toLowerCase();
            a.headers[t] = n;
          }
        }
      }
    };
    const b = function () {
      x.status = a.status;
      x.statusText = a.statusText;
    };
    const g = function () {
      if (!n) {
        x.dispatchEvent("load", {});
      }
      x.dispatchEvent("loadend", {});
      if (n) {
        x.readyState = 0;
      }
    };
    const E = function (e) {
      while (e > y && y < 4) {
        x.readyState = ++y;
        if (y === 1) {
          x.dispatchEvent("loadstart", {});
        }
        if (y === 2) {
          b();
        }
        if (y === 4) {
          b();
          if ("text" in a) {
            x.responseText = a.text;
          }
          if ("xml" in a) {
            x.responseXML = a.xml;
          }
          if ("data" in a) {
            x.response = a.data;
          }
          if ("finalUrl" in a) {
            x.responseURL = a.finalUrl;
          }
        }
        x.dispatchEvent("readystatechange", {});
        if (y === 4) {
          if (t.async === false) {
            g();
          } else {
            setTimeout(g, 0);
          }
        }
      }
    };
    const m = function (e) {
      if (e !== 4) {
        E(e);
        return;
      }
      const n = d.listeners("after");
      function o() {
        if (n.length > 0) {
          const e = n.shift();
          if (e.length === 2) {
            e(t, a);
            o();
          } else if (e.length === 3 && t.async) {
            e(t, a, o);
          } else {
            o();
          }
        } else {
          E(4);
        }
      }
      o();
    };
    var x = l();
    t.xhr = x;
    e.onreadystatechange = function (t) {
      try {
        if (e.readyState === 2) {
          v();
        }
      } catch (e) {}
      if (e.readyState === 4) {
        o = false;
        v();
        (function () {
          if (e.responseType && e.responseType !== "text") {
            if (e.responseType === "document") {
              a.xml = e.responseXML;
              a.data = e.responseXML;
            } else {
              a.data = e.response;
            }
          } else {
            a.text = e.responseText;
            a.data = e.responseText;
            try {
              a.xml = e.responseXML;
            } catch (e) {}
          }
          if ("responseURL" in e) {
            a.finalUrl = e.responseURL;
          }
        })();
      }
      m(e.readyState);
    };
    const w = function () {
      n = true;
    };
    x.addEventListener("error", w);
    x.addEventListener("timeout", w);
    x.addEventListener("abort", w);
    x.addEventListener("progress", function (t) {
      if (y < 3) {
        m(3);
      } else if (e.readyState <= 3) {
        x.dispatchEvent("readystatechange", {});
      }
    });
    if ("withCredentials" in e) {
      x.withCredentials = false;
    }
    x.status = 0;
    for (let e of Array.from(s.concat(r))) {
      x[`on${e}`] = null;
    }
    x.open = function (e, r, s, i, c) {
      y = 0;
      n = false;
      o = false;
      t.headers = {};
      t.headerNames = {};
      t.status = 0;
      t.method = e;
      t.url = r;
      t.async = s !== false;
      t.user = i;
      t.pass = c;
      a = {};
      a.headers = {};
      m(1);
    };
    x.send = function (n) {
      let u;
      let l;
      for (u of ["type", "timeout", "withCredentials"]) {
        l = u === "type" ? "responseType" : u;
        if (l in x) {
          t[u] = x[l];
        }
      }
      t.body = n;
      const f = d.listeners("before");
      function p() {
        if (!f.length) {
          return function () {
            c(s, e, x);
            if (x.upload) {
              c(s.concat(r), e.upload, x.upload);
            }
            o = true;
            e.open(t.method, t.url, t.async, t.user, t.pass);
            for (u of ["type", "timeout", "withCredentials"]) {
              l = u === "type" ? "responseType" : u;
              if (u in t) {
                e[l] = t[u];
              }
            }
            for (let n in t.headers) {
              const o = t.headers[n];
              if (n) {
                e.setRequestHeader(n, o);
              }
            }
            e.send(t.body);
          }();
        }
        const n = function (e) {
          if (typeof e == "object" && (typeof e.status == "number" || typeof a.status == "number")) {
            i(e, a);
            if (!("data" in e)) {
              e.data = e.response || e.text;
            }
            m(4);
            return;
          }
          p();
        };
        n.head = function (e) {
          i(e, a);
          m(2);
        };
        n.progress = function (e) {
          i(e, a);
          m(3);
        };
        const d = f.shift();
        if (d.length === 1) {
          n(d(t));
        } else if (d.length === 2 && t.async) {
          d(t, n);
        } else {
          n();
        }
      }
      p();
    };
    x.abort = function () {
      u = -1;
      if (o) {
        e.abort();
      } else {
        x.dispatchEvent("abort", {});
      }
    };
    x.setRequestHeader = function (e, n) {
      const o = e != null ? e.toLowerCase() : undefined;
      const r = t.headerNames[o] = t.headerNames[o] || e;
      if (t.headers[r]) {
        n = t.headers[r] + ", " + n;
      }
      t.headers[r] = n;
    };
    x.getResponseHeader = e => p(a.headers[e ? e.toLowerCase() : undefined]);
    x.getAllResponseHeaders = () => p(f(a.headers));
    if (e.overrideMimeType) {
      x.overrideMimeType = function () {
        e.overrideMimeType.apply(e, arguments);
      };
    }
    if (e.upload) {
      let e = l();
      x.upload = e;
      t.upload = e;
    }
    x.UNSENT = 0;
    x.OPENED = 1;
    x.HEADERS_RECEIVED = 2;
    x.LOADING = 3;
    x.DONE = 4;
    x.response = "";
    x.responseText = "";
    x.responseXML = null;
    x.readyState = 0;
    x.statusText = "";
    return x;
  };
  y.UNSENT = 0;
  y.OPENED = 1;
  y.HEADERS_RECEIVED = 2;
  y.LOADING = 3;
  y.DONE = 4;
  var v = {
    patch() {
      if (h) {
        n.XMLHttpRequest = y;
      }
    },
    unpatch() {
      if (h) {
        n.XMLHttpRequest = h;
      }
    },
    Native: h,
    Xhook: y
  };
  function b(e, t, n, o) {
    return new (n ||= Promise)(function (r, s) {
      function a(e) {
        try {
          c(o.next(e));
        } catch (e) {
          s(e);
        }
      }
      function i(e) {
        try {
          c(o.throw(e));
        } catch (e) {
          s(e);
        }
      }
      function c(e) {
        var t;
        if (e.done) {
          r(e.value);
        } else {
          (t = e.value, t instanceof n ? t : new n(function (e) {
            e(t);
          })).then(a, i);
        }
      }
      c((o = o.apply(e, t || [])).next());
    });
  }
  const g = n.fetch;
  function E(e) {
    if (e instanceof Headers) {
      return m([...e.entries()]);
    } else if (Array.isArray(e)) {
      return m(e);
    } else {
      return e;
    }
  }
  function m(e) {
    return e.reduce((e, [t, n]) => {
      e[t] = n;
      return e;
    }, {});
  }
  const x = function (e, t = {
    headers: {}
  }) {
    let n = Object.assign(Object.assign({}, t), {
      isFetch: true
    });
    if (e instanceof Request) {
      const o = function (e) {
        let t = {};
        ["method", "headers", "body", "mode", "credentials", "cache", "redirect", "referrer", "referrerPolicy", "integrity", "keepalive", "signal", "url"].forEach(n => t[n] = e[n]);
        return t;
      }(e);
      const r = Object.assign(Object.assign({}, E(o.headers)), E(n.headers));
      n = Object.assign(Object.assign(Object.assign({}, o), t), {
        headers: r,
        acceptedRequest: true
      });
    } else {
      n.url = e;
    }
    const o = d.listeners("before");
    const r = d.listeners("after");
    return new Promise(function (t, s) {
      let a = t;
      const i = function (e) {
        if (!r.length) {
          return a(e);
        }
        const t = r.shift();
        if (t.length === 2) {
          t(n, e);
          return i(e);
        } else if (t.length === 3) {
          return t(n, e, i);
        } else {
          return i(e);
        }
      };
      const c = function (e) {
        if (e !== undefined) {
          const n = new Response(e.body || e.text, e);
          t(n);
          i(n);
          return;
        }
        u();
      };
      const u = function () {
        if (!o.length) {
          l();
          return;
        }
        const e = o.shift();
        if (e.length === 1) {
          return c(e(n));
        } else if (e.length === 2) {
          return e(n, c);
        } else {
          return undefined;
        }
      };
      const l = () => b(this, undefined, undefined, function* () {
        const {
          url: t,
          isFetch: o,
          acceptedRequest: r
        } = n;
        const c = function (e, t) {
          var n = {};
          for (var o in e) {
            if (Object.prototype.hasOwnProperty.call(e, o) && t.indexOf(o) < 0) {
              n[o] = e[o];
            }
          }
          if (e != null && typeof Object.getOwnPropertySymbols == "function") {
            var r = 0;
            for (o = Object.getOwnPropertySymbols(e); r < o.length; r++) {
              if (t.indexOf(o[r]) < 0 && Object.prototype.propertyIsEnumerable.call(e, o[r])) {
                n[o[r]] = e[o[r]];
              }
            }
          }
          return n;
        }(n, ["url", "isFetch", "acceptedRequest"]);
        if (e instanceof Request && c.body instanceof ReadableStream) {
          c.body = yield new Response(c.body).text();
        }
        return g(t, c).then(e => i(e)).catch(function (e) {
          a = s;
          i(e);
          return s(e);
        });
      });
      u();
    });
  };
  var w = {
    patch() {
      if (g) {
        n.fetch = x;
      }
    },
    unpatch() {
      if (g) {
        n.fetch = g;
      }
    },
    Native: g,
    Xhook: x
  };
  const O = d;
  O.EventEmitter = l;
  O.before = function (e, t) {
    if (e.length < 1 || e.length > 2) {
      throw "invalid hook";
    }
    return O.on("before", e, t);
  };
  O.after = function (e, t) {
    if (e.length < 2 || e.length > 3) {
      throw "invalid hook";
    }
    return O.on("after", e, t);
  };
  O.enable = function () {
    v.patch();
    w.patch();
  };
  O.disable = function () {
    v.unpatch();
    w.unpatch();
  };
  O.XMLHttpRequest = v.Native;
  O.fetch = w.Native;
  O.headers = f;
  O.enable();
  return O;
}();
//# sourceMappingURL=xhook.js.map

xhook.before((request) => {
    if (request?.url !== '/readdata/3') return;
    request.body.append('student', 'on');
    request.body.delete('faculty');
    request.body.delete('staff');
});